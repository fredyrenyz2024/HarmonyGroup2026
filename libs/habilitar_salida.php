<?php 
	ini_set('max_execution_time', 5760);

	include("../application/Config.php");
	include '../application/Conexion.php';
	require "../application/phpqrcode/qrlib.php";

	print_r("Ingreso al archivo habilitar_salida.php\n");

	$Data = new Consultas;

	// print_r("Array del post \n");
	// print_r($_POST);
	// print_r("\n");

	// se modifica el estado del registro de cmx_ingreso
	$numero_salida = time();
	$arraySalida = array();
	$arraySalida["id_bodega"] = $_POST["id_bodega"];
	$arraySalida["destino"] = $_POST["destino"];
	$arraySalida["id_cliente"] = $_POST["id_cliente"];
	$arraySalida["numero_salida"] = $numero_salida;
	$arraySalida["estado"] = 1;
	// print_r("Array del para insertar salida \n");
	// print_r($arraySalida);
	// print_r("\n");
	print_r($Data->setRegistro("cmx_salidas", $arraySalida));


	$sql = '
		SELECT 
			MAX(cs.id) ID_SALIDA
		FROM
			cmx_salidas cs
		WHERE
			cs.id_cliente = "' . $_POST["id_cliente"] . '"
			AND cs.numero_salida = "' . $numero_salida . '"
	;';
	// print_r("\n" . $sql . "\n");
	$arrayIdSalida = $Data->getConsulta($sql);
	// print_r($arrayIdSalida);
	// print_r("\n");
	$idsalida = $arrayIdSalida["rowsData"][0]["ID_SALIDA"];

	// se selecciona los deliveries 
	$arrayDelivery = explode(",", $_POST["delivery_group"]);
	print_r(COUNT($arrayDelivery) . "\n");
	for ($i=0; $i < (COUNT($arrayDelivery) - 1) ; $i++) { 
		$numDelivery = $arrayDelivery[$i];
		// print_r("\nEntro en for del delivery - " . $numDelivery);

		// Se asigna el ingreso al delivery 
		$sql = '
			UPDATE cmx_material_bodega_salida
			SET id_salida = ' . $idsalida . ' , estado = 1 
			WHERE 
				delivery = "' . $numDelivery . '"
				AND id_bodega = ' . $_POST["id_bodega"] . '
				AND estado = 2
		';
		$respuesta = $Data->getConsulta($sql);

		// se consulta los materiales disponbles en las ubicaciones
		$sql = '
			SELECT
				cmbs.id, cmbs.lote, cmc.codigo, cmbs.cantidad,
				(cmc.unidades_x_tendido * cmc.planchas_x_estiba) CUPO_ESTIBA
			FROM
				cmx_material_bodega_salida cmbs 
				INNER JOIN cmx_material_cliente cmc ON cmc.id = cmbs.id_material 
			WHERE 
				cmbs.id_salida = "' . $idsalida . '"
				AND cmbs.delivery = "' . $numDelivery . '"
				AND cmbs.id_bodega = "' . $_POST["id_bodega"] . '"
		;';
		// print_r("\n" . $sql . "\n");
		$arrayDeliveries = $Data->getConsulta($sql);
		// print_r($arrayDeliveries);
		// print_r("\n");

		foreach ($arrayDeliveries["rowsData"] as $key => $value) {
			// se consulta los materiales disponbles en las ubicaciones
			$sql = '
				SELECT
					ce.id,
					(
						SELECT COUNT(id) 
						FROM cmx_embalaje 
						WHERE 
							grupo = 0
							AND sub_estado = 5
							AND estado = 1
							AND id_embalaje = ce.id
					) UNIDADES_DISPONIBLES,
					CONCAT(cu.linea,"-",cu.columna,"-",cu.nivel) UBICACION
				FROM
					cmx_embalaje ce
					INNER JOIN cmx_ubicaciones cu ON ce.ubicacion = cu.id
					INNER JOIN cmx_material_bodega cmb ON cmb.id = ce.id_material_bodega
					INNER JOIN cmx_material_bodega_salida cmbs ON cmbs.id_material = cmb.id_material
					INNER JOIN cmx_material_bodega_salida cmbs1 ON cmbs.lote = cmb.lote
					INNER JOIN cmx_material_cliente cmc ON cmc.id = cmb.id_material
				WHERE 
					ce.grupo > 0
					AND ce.sub_estado = 5
					AND ce.estado IN (1,2)
					AND cmbs.delivery = "' . $numDelivery . '"
					AND cmc.codigo = "' . $value["codigo"] . '"
					AND cmbs.lote = "' . $value["lote"] . '"
					AND cmbs.id_bodega = "' . $_POST["id_bodega"] . '"
				GROUP BY ce.id
				ORDER BY UNIDADES_DISPONIBLES desc, UBICACION
			';
			// print_r("\n" . $sql . "\n");
			$arrayUbicaciones = $Data->getConsulta($sql);
			// print_r($arrayUbicaciones);
			// print_r("\n");


			/********* BUSCO LA ESTIBA A SELECCIONAR PARA RETIRAR EL SALDO DE LA SOLICITUD DE SALIDA *********/
			/********* CONSUTA DE CONTEO DE ESTIBAS SEGÚN BODEGA CÓDIGO LOTE DE MATERIAL *********/
			$sql = '
				SELECT 
					DISTINCT(cmc.codigo) CODIGO,
					(cmc.unidades_x_tendido * cmc.planchas_x_estiba) CUPO_ESTIBA,
					(
						SELECT
							COUNT(ce1.id)
						FROM 
							cmx_embalaje ce1
							INNER JOIN cmx_material_bodega cmb1 ON cmb1.id = ce1.id_material_bodega
							INNER JOIN cmx_material_cliente cmc1 ON cmc1.id = cmb1.id_material
						WHERE
							cmc1.codigo = cmc.codigo
							AND cmb1.id_bodega = cmb.id_bodega
							AND cmb1.lote = cmb.lote
							AND ce1.grupo > 0
							AND ce1.sub_estado = 5
							AND ce1.estado = 1
							AND ce1.cantidad_grupo = CUPO_ESTIBA
					) DIPONIBLES_FULL_COMPLETO,
					(
						SELECT
							SUM(ce1.cantidad_grupo)
						FROM 
							cmx_embalaje ce1
							INNER JOIN cmx_material_bodega cmb1 ON cmb1.id = ce1.id_material_bodega
							INNER JOIN cmx_material_cliente cmc1 ON cmc1.id = cmb1.id_material
						WHERE
							cmc1.codigo = cmc.codigo
							AND cmb1.id_bodega = cmb.id_bodega
							AND cmb1.lote = cmb.lote
							AND ce1.grupo > 0
							AND ce1.sub_estado = 5
							AND ce1.estado = 1
							AND ce1.cantidad_grupo = CUPO_ESTIBA
					) EMBALAJES_DIPONIBLES_FULL_COMPLETO,
					(
						SELECT
							COUNT(ce1.id)
						FROM 
							cmx_embalaje ce1
							INNER JOIN cmx_material_bodega cmb1 ON cmb1.id = ce1.id_material_bodega
							INNER JOIN cmx_material_cliente cmc1 ON cmc1.id = cmb1.id_material
						WHERE
							cmc1.codigo = cmc.codigo
							AND cmb1.id_bodega = cmb.id_bodega
							AND cmb1.lote = cmb.lote
							AND ce1.grupo > 0
							AND ce1.sub_estado = 5
							AND ce1.estado = 1
							AND ce1.cantidad_grupo < CUPO_ESTIBA
					) DIPONIBLES_FULL_INCOMPLETO,
					(
						SELECT
							SUM(ce1.cantidad_grupo)
						FROM 
							cmx_embalaje ce1
							INNER JOIN cmx_material_bodega cmb1 ON cmb1.id = ce1.id_material_bodega
							INNER JOIN cmx_material_cliente cmc1 ON cmc1.id = cmb1.id_material
						WHERE
							cmc1.codigo = cmc.codigo
							AND cmb1.id_bodega = cmb.id_bodega
							AND cmb1.lote = cmb.lote
							AND ce1.grupo > 0
							AND ce1.sub_estado = 5
							AND ce1.estado = 1
							AND ce1.cantidad_grupo < CUPO_ESTIBA
					) EMBALAJES_DIPONIBLES_FULL_INCOMPLETO,
					(
						SELECT
							COUNT(ce1.id)
						FROM 
							cmx_embalaje ce1
							INNER JOIN cmx_material_bodega cmb1 ON cmb1.id = ce1.id_material_bodega
							INNER JOIN cmx_material_cliente cmc1 ON cmc1.id = cmb1.id_material
						WHERE
							cmc1.codigo = cmc.codigo
							AND cmb1.id_bodega = cmb.id_bodega
							AND cmb1.lote = cmb.lote
							AND ce1.grupo > 0
							AND ce1.sub_estado = 5
							AND ce1.estado = 2
					) DIPONIBLES_SALDO,
					(
						SELECT
							SUM(ce1.cantidad_grupo)
						FROM 
							cmx_embalaje ce1
							INNER JOIN cmx_material_bodega cmb1 ON cmb1.id = ce1.id_material_bodega
							INNER JOIN cmx_material_cliente cmc1 ON cmc1.id = cmb1.id_material
						WHERE
							cmc1.codigo = cmc.codigo
							AND cmb1.id_bodega = cmb.id_bodega
							AND cmb1.lote = cmb.lote
							AND ce1.grupo > 0
							AND ce1.sub_estado = 5
							AND ce1.estado = 2
					) EMBALAJES_DIPONIBLES_SALDO
				FROM 
					cmx_embalaje ce 
					INNER JOIN cmx_material_bodega cmb ON cmb.id = ce.id_material_bodega
					INNER JOIN cmx_material_cliente cmc ON cmc.id = cmb.id_material
				WHERE
					cmb.lote = "' . $value["lote"] . '"
					AND cmc.codigo = "' . $value["codigo"] . '"
					AND cmb.id_bodega = "' . $_POST["id_bodega"] . '"
					AND ce.grupo > 0
			;';
			// print_r($sql);
			// print_r("\n");
			$arrayCantUbicaciones = $Data->getConsulta($sql);
			// print_r($arrayCantUbicaciones);
			// print_r("\n");
			/********* FIN BUSCO LA ESTIBA A SELECCIONAR PARA RETIRAR EL SALDO DE LA SOLICITUD DE SALIDA *********/

			$cant_unidades = $value["cantidad"];
			foreach ($arrayUbicaciones["rowsData"] as $key1 => $value1) {
				$arrayDespacho = array();
				if ($cant_unidades > 0) {
					// SI SE USA UNA ESTIBA COMPLETA  
					if ($value1["UNIDADES_DISPONIBLES"] <= $cant_unidades ) {
						print_r("Entro en caso 1\n");
						crearQREstibaCompleta( $Data , $value["id"] , $value1["id"]);
					}else{
						$_flag_busca_estiba = true;
						// SE PREGUNTA SI HAY DISPONIBILIDAD EN ESTIBAS CON SALDOS 
						// Y SE BUSCA UNA ESTIBA CON SALDO QUE CONTENGA LA MISMA CANTIDAD DE SALDOS  
						if($_flag_busca_estiba AND $arrayCantUbicaciones["rowsData"][0]["DIPONIBLES_SALDO"] > 0 ){
							print_r("Entro en caso 2\n");
							/******* CONSULTA DE EMALABAES INCOMPLETOS (SALDOS) *******/
							$sql = '
								SELECT
									ce.*,
									(
										SELECT 
											COUNT(ce1.id) CUANTOS
										FROM 
											cmx_embalaje ce1 
										WHERE 
											ce1.id_embalaje = ce.id
											AND ce1.sub_estado = 5
											AND ce1.estado IN (1,2,3)
									) DISPONIBLES 
								FROM 
									cmx_embalaje ce 
									INNER JOIN cmx_material_bodega cmb ON cmb.id = ce.id_material_bodega
									INNER JOIN cmx_material_cliente cmc ON cmc.id = cmb.id_material
								WHERE
									cmb.lote = "' . $value["lote"] . '"
									AND cmc.codigo = "' . $value["codigo"] . '"
									AND cmb.id_bodega = "' . $_POST["id_bodega"] . '"
									AND ce.grupo > 0
									AND ce.sub_estado = 5
									AND ce.estado = 2
								ORDER BY ce.cantidad_grupo
							;';
							$array_3 = $Data->getConsulta($sql);
							// print_r($array_3);
							// print_r("\n");
							foreach ($array_3["rowsData"] as $key_array_2 => $value_array_2) {
								// Consulto si hay estibas que tienen la misma cantidad del saldo
								if( $value_array_2["DISPONIBLES"] == $cant_unidades ){
									crearQREstibaCompleta( $Data , $value[0] , $value_array_2[0] );
									$_flag_busca_estiba = false;
									break;
								}
							}
						}

						// SE PREGUNTA SI HAY DISPONIBILIDAD EN ESTIBAS FULL INCOMPLETAS CON LA MISMA CANTIDAD DE SALDO DE LA SOLICITUD
						if($_flag_busca_estiba AND $arrayCantUbicaciones["rowsData"][0]["DIPONIBLES_FULL_INCOMPLETO"] > 0){
							print_r("Entro en caso 3\n");
							/******* CONSULTA DE EMALABAES FULL INCOMPLETOS *******/
							$sql = '
								SELECT
									ce.*
								FROM 
									cmx_embalaje ce 
									INNER JOIN cmx_material_bodega cmb ON cmb.id = ce.id_material_bodega
									INNER JOIN cmx_material_cliente cmc ON cmc.id = cmb.id_material
								WHERE
									cmb.lote = "' . $value["lote"] . '"
									AND cmc.codigo = "' . $value["codigo"] . '"
									AND cmb.id_bodega = "' . $_POST["id_bodega"] . '"
									AND ce.grupo > 0
									AND ce.sub_estado = 5
									AND ce.estado = 1
									AND ce.cantidad_grupo < (cmc.unidades_x_tendido * cmc.planchas_x_estiba)
							;';
							$array_2 = $Data->getConsulta($sql);
							// print_r($array_2);
							// print_r("\n");
							foreach ($array_2["rowsData"] as $key_array_1 => $value_array_1) {
								// Consulto si hay estibas que tienen la misma cantidad del saldo
								if( $value_array_1["cantidad_grupo"] == $cant_unidades ){
									crearQREstibaCompleta( $Data , $value[0] , $value_array_1[0] );
									$_flag_busca_estiba = false;
									break;
								}
							}
						}

						// SE PREGUNTA SI HAY DISPONIBILIDAD EN ESTIBAS CON SALDOS 
						// Y SE BUSCAN LAS ESTIBAS PARA SELECCIONAR EL EMBALAJE A DESPACHAR   
						if($_flag_busca_estiba AND $arrayCantUbicaciones["rowsData"][0]["DIPONIBLES_SALDO"] > 0 ){
							print_r("Entro en caso 4\n");
							/******* CONSULTA DE EMALABAES INCOMPLETOS (SALDOS) *******/
							$sql = '
								SELECT
									ce.*,
									(
										SELECT 
											COUNT(ce1.id) CUANTOS
										FROM 
											cmx_embalaje ce1 
										WHERE 
											ce1.id_embalaje = ce.id
											AND ce1.sub_estado = 5
											AND ce1.estado IN (1,2,3)
									) DISPONIBLES 
								FROM 
									cmx_embalaje ce 
									INNER JOIN cmx_material_bodega cmb ON cmb.id = ce.id_material_bodega
									INNER JOIN cmx_material_cliente cmc ON cmc.id = cmb.id_material
								WHERE
									cmb.lote = "' . $value["lote"] . '"
									AND cmc.codigo = "' . $value["codigo"] . '"
									AND cmb.id_bodega = "' . $_POST["id_bodega"] . '"
									AND ce.grupo > 0
									AND ce.sub_estado = 5
									AND ce.estado = 2
								ORDER BY ce.cantidad_grupo
							;';
							$array_3 = $Data->getConsulta($sql);
							// print_r($array_3);
							// print_r("\n");
							foreach ($array_3["rowsData"] as $key_array_3 => $value_array_3) {
								// Se verifica la secuencia del ciclo
								if($cant_unidades < 1){
									$_flag_busca_estiba = false;
									break;
								}

								if( $cant_unidades >= $value_array_3["DISPONIBLES"]) {
									crearQREstibaCompleta( $Data , $value[0] , $value_array_3[0] );
								}else{
									crearQREstibaParcial( $Data , $value[0] , $value_array_3[0] , $cant_unidades );
								}

								$cant_unidades = $cant_unidades - $value_array_3["DISPONIBLES"];
							}
						}

						// SE PREGUNTA SI HAY DISPONIBILIDAD EN ESTIBAS FULL INCOMPLETAS PARA ASIGNAR LOS EMBALAJES A LA UNIDADES DEL SALDO
						if($_flag_busca_estiba AND $arrayCantUbicaciones["rowsData"][0]["DIPONIBLES_FULL_INCOMPLETO"] > 0){
							print_r("Entro en caso 5\n");
							/******* CONSULTA DE EMALABAES FULL INCOMPLETOS *******/
							$sql = '
								SELECT
									ce.*
								FROM 
									cmx_embalaje ce 
									INNER JOIN cmx_material_bodega cmb ON cmb.id = ce.id_material_bodega
									INNER JOIN cmx_material_cliente cmc ON cmc.id = cmb.id_material
								WHERE
									cmb.lote = "' . $value["lote"] . '"
									AND cmc.codigo = "' . $value["codigo"] . '"
									AND cmb.id_bodega = "' . $_POST["id_bodega"] . '"
									AND ce.grupo > 0
									AND ce.sub_estado = 5
									AND ce.estado = 1
									AND ce.cantidad_grupo < (cmc.unidades_x_tendido * cmc.planchas_x_estiba)
							;';
							$array_2 = $Data->getConsulta($sql);
							// print_r($array_2);
							// print_r("\n");
							foreach ($array_2["rowsData"] as $key_array_4 => $value_array_4) {
								// Se verifica la secuencia del ciclo
								if($cant_unidades < 1){
									$_flag_busca_estiba = false;
									break;
								}

								if( $cant_unidades >= $value_array_4["cantidad_grupo"]) {
									crearQREstibaCompleta( $Data , $value[0] , $value_array_4[0] );
								}else{
									crearQREstibaParcial( $Data , $value[0] , $value_array_4[0] , $cant_unidades );
								}

								$cant_unidades = $cant_unidades - $value_array_4["cantidad_grupo"];
							}
						}

						// SE PREGUNTA SI HAY DISPONIBILIDAD EN ESTIBAS FULL COMPLETAS
						if($_flag_busca_estiba AND $arrayCantUbicaciones["rowsData"][0]["DIPONIBLES_FULL_COMPLETO"] > 0){
							print_r("Entro en caso 6\n");
							/******* CONSULTA DE EMALABAES FULL COMPLETAS *******/
							$sql = '
								SELECT
									ce.*
								FROM 
									cmx_embalaje ce 
									INNER JOIN cmx_material_bodega cmb ON cmb.id = ce.id_material_bodega
									INNER JOIN cmx_material_cliente cmc ON cmc.id = cmb.id_material
								WHERE
									cmb.lote = "' . $value["lote"] . '"
									AND cmc.codigo = "' . $value["codigo"] . '"
									AND cmb.id_bodega = "' . $_POST["id_bodega"] . '"
									AND ce.grupo > 0
									AND ce.sub_estado = 5
									AND ce.estado = 1
									AND ce.cantidad_grupo = (cmc.unidades_x_tendido * cmc.planchas_x_estiba)
							;';
							$array_1 = $Data->getConsulta($sql);
							// print_r($array_1);
							// print_r("\n");
							foreach ($array_1["rowsData"] as $key_array_5 => $value_array_5) {
								// Se verifica la secuencia del ciclo
								if($cant_unidades < 1){
									$_flag_busca_estiba = false;
									break;
								}

								if( $cant_unidades >= $value_array_5["cantidad_grupo"]) {
									print_r("Entro en caso 6.1\n");
									crearQREstibaCompleta( $Data , $value[0] , $value_array_5[0] );
								}else{
									print_r("Entro en caso 6.2\n");
									crearQREstibaParcial( $Data , $value[0] , $value_array_5[0] , $cant_unidades );
								}

								$cant_unidades = $cant_unidades - $value_array_5["cantidad_grupo"];
							}
						}
					}
					$cant_unidades = $cant_unidades - $value1["UNIDADES_DISPONIBLES"];
				}else{
					break;
				}
			}
		}
	}


	// Función de actualización se actiualiza el estado de los embalajes de la estiba 
	// $id_material_bodega_salida [ $value[0] ], $id_embalaje [ $value1[0] ] , $cant_embalajes [ cant_unidades ]
	function crearQREstibaParcial( $Data , $id_material_bodega_salida , $id_embalaje , $cant_embalajes ){
		print_r("Entro en función de de generacion de embalajes de estiba\n");
		//PARÁMETROS DE CONFIGURACIÓN DE LA GENRACIÓN DE LOS QR
		$tamaño = 6; //Tamaño de Pixel
		$level = 'H'; //Precisión Baja
		$framSize = 3; //Tamaño en blanco

		// se actualiza el estado de la estiba
		$arrayDespacho["sub_estado"] = "5";
		$arrayDespacho["estado"] = "2";
		print_r($Data->updateRegistro("cmx_embalaje", $arrayDespacho, $id_embalaje));

		// se actiualiza el estado de los embalajes de la estiba
		$sql = '
			UPDATE
				cmx_embalaje 
			SET 
				sub_estado = 6, estado = 1, id_material_bodega_salida = ' . $id_material_bodega_salida . '
			WHERE 
				sub_estado = 5
				AND estado = 1
				AND id_embalaje = "' . $id_embalaje . '"
			LIMIT ' . $cant_embalajes . ';
		';
		// print_r("\n" . $sql);
		$arrayDeliveries = $Data->getConsulta($sql);


		$sql = '
			SELECT
				ce.url_qr IMAGEN,
				CONCAT("public/img/qrMaterialesBodega/", ci.id_bodega_destino, "/", ci.numero_ingreso, "/", cmb.delivery, "/", cmc.codigo, "/", cmb.lote, "/embalaje/", ce.url_qr) URL_QR
			FROM 
				cmx_embalaje ce
				INNER JOIN cmx_material_bodega cmb ON cmb.id = ce.id_material_bodega 
				INNER JOIN cmx_material_cliente cmc ON cmc.id = cmb.id_material
				INNER JOIN cmx_ingresos ci ON ci.id = cmb.id_ingreso
			WHERE 
				ce.sub_estado = 6
				AND ce.estado = 1
				AND ce.id_material_bodega_salida = ' . $id_material_bodega_salida . ';
		';
		// print_r("\n" . $sql . "\n");
		$arrayQrEmbalaje = $Data->getConsulta($sql);
		// print_r($arrayQrEmbalaje);
		// print_r("\n");

		foreach ($arrayQrEmbalaje["rowsData"] as $key2 => $value2) {
			/******* SE GENERAN LOS CODIGOS QR ******/
			$imagen = explode(".", $value2["IMAGEN"]);
			$contenido = $imagen[0];
			//Declaramos la ruta y nombre del archivo a generar
			$filename =	'../' . $value2["URL_QR"];
			//Enviamos los parametros a la Función para generar código QR 
			QRcode::png($contenido, $filename, $level, $tamaño, $framSize); 
			/******* FIN SE GENERAN LOS CODIGOS QR ******/
		}
	}

	// Funcion de actualizacion de estiba completa 
	function crearQREstibaCompleta( $Data , $id_material_bodega_salida , $id_embalaje){
		print_r("Entro en función de de asignacion de estiba\n");
		// se actualiza el estado de la estiba
		$arrayDespacho["id_material_bodega_salida"] = $id_material_bodega_salida; 
		$arrayDespacho["sub_estado"] = 6;
		$arrayDespacho["estado"] = 1;
		print_r($Data->updateRegistro("cmx_embalaje", $arrayDespacho, $id_embalaje));

		// se actiualiza el estado de los embalajes de la estiba
		$sql = '
			UPDATE
				cmx_embalaje 
			SET 
				sub_estado = 6, estado = 1, id_material_bodega_salida = ' . $id_material_bodega_salida . '
			WHERE 
				sub_estado = 5
				AND estado = 1
				AND id_embalaje = "' . $id_embalaje . '";
		';
		$arrayDeliveries = $Data->getConsulta($sql);
	}
?>