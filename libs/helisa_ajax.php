<?php 
	ini_set('max_execution_time', 240);

	include("../application/Config.php");
	include '../application/Conexion.php';
	include '../application/Model.php';
	include '../application/PHPExcel/PHPExcel.php';

	$_msg_error = "";
	$_msg_control = "Entro en helisa_ajax.php\n";
	$_array_result = Array();

	$Data = new Consultas;
	$Model = new Model;

	// $datafile["get"] = $_GET;

	switch ( $_GET["action"] ) {
		case 'generaExcelPedidos':
			$_msg_control.= "<p>Entro en opción generaExcelPedidos</p>\n";

			// Se pregunta si existen las carpetas en el servidor 
			$carpeta_destino = BASE_URL . "public/files/helisa/pedidos/";
			$_ahora = date('Y-m-d H:i:s');
			$solo_fecha = date("d/m/Y", strtotime($_ahora));

			$nombre_archivo = 'Lista de pedidos - ' . $_ahora;

			$fila = 1;

			$objPHPExcel = new PHPExcel;
			
			$objPHPExcel->getProperties()
				->setCreator('Nexos Group S.A.S')
				->setTitle('Pedidos')
				->setDescription('')
				->setKeywords('Facturación Nexos Group ')
				->setCategory('Tesorería')
			;
			
			$objPHPExcel->setActiveSheetIndex(0);
			$objPHPExcel->getActiveSheet( $nombre_archivo );

			// Se crean las filas de encabezado del archivo Excel
			$objPHPExcel->getActiveSheet()->setCellValue('A' . $fila , "TIPO"); // TIPO
			$objPHPExcel->getActiveSheet()->setCellValue('B' . $fila , "NUMERO DOCUMENTO"); // NUMERO_DOC
			$objPHPExcel->getActiveSheet()->setCellValue('C' . $fila , "FECHA DOCUMENTO"); // FECHA_DOC
			$objPHPExcel->getActiveSheet()->setCellValue('D' . $fila , "DOCUMENTO CLIENTE"); // IDENTIDAD_CLIENTE
			$objPHPExcel->getActiveSheet()->setCellValue('E' . $fila , "NOMBRE CLIENTE"); // NOMBRE_CLIENTE
			$objPHPExcel->getActiveSheet()->setCellValue('F' . $fila , "TIPO CONCEPTO"); // TIPO CONCEPTO
			$objPHPExcel->getActiveSheet()->setCellValue('G' . $fila , "CODIGO CONCEPTO"); // CODIGO CONCEPTO
			$objPHPExcel->getActiveSheet()->setCellValue('H' . $fila , "ARTICULO/SERVICIO" ); // ARTICULO/SERVICIO
			$objPHPExcel->getActiveSheet()->setCellValue('I' . $fila , "CANTIDAD"); // CANTIDAD (PESO DEL MATERIAL)
			$objPHPExcel->getActiveSheet()->setCellValue('J' . $fila , "V/TOTAL"); // V/TOTAL (VALOR DE LA REMESA)
			$fila++;

			$arrayRemesas = explode(",",$_GET["id_remesas"]);
			foreach ($arrayRemesas as $value) {
				if ($value) {
					// Se busca informacion de las remesas 
					$sql = '
						SELECT 
							cam.id ID_REMESA, cam.numero_remesa, 
							csat.tipo_servicio, cim.nombre MATERIAL,
							cc.id ID_CLIENTE, cc.tipo_documento, cc.documento, cc.digito_verificacion, cc.nombre,
							caa.id ID_MANIFIESTO, caa.numero_manifiesto, cip.id ID_PROYECTO, cip.numero_importacion, cip.importacion,
							cms.id_solicitud, csat.valor_venta, FLOOR(cs.peso_total) PESO_TOTAL, cam.peso PESO_MATERIAL,
							FLOOR( ( csat.valor_venta * cam.peso ) / FLOOR(cs.peso_total) ) VALOR_PRORRATEO,
							FLOOR( ( csat.valor_venta * cam.peso ) / FLOOR(cs.peso_total) ) VALOR_PRORRATEO,
							(	SELECT COUNT(cts1.id)
								FROM cmx_tramo_solicitud cts1
								WHERE cts1.id_solicitud = cs.id
							) CUANTOS,
							(	SELECT CONCAT(cm1.id,"_",cm1.municipio," (",cm1.depto," - ",cm1.pais,")")
								FROM cmx_tramo_solicitud cts1
									INNER JOIN cmx_tramos_orden cto1 ON cto1.id_tramo = cts1.id
									INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cts1.id_remitente_destinatario
									INNER JOIN cmx_municipios cm1 ON cm1.id = crd1.id_ciudad
								WHERE cts1.id_solicitud = cs.id
									AND cts1.tipo_operacion = "Cargue"
									AND cto1.orden = 1
							) ORIGEN,
							(	SELECT CONCAT(cm1.id,"_",cm1.municipio," (",cm1.depto," - ",cm1.pais,")")
								FROM cmx_tramo_solicitud cts1
									INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cts1.id_remitente_destinatario
									INNER JOIN cmx_municipios cm1 ON cm1.id = crd1.id_ciudad
									INNER JOIN cmx_tramos_orden cto1 ON cto1.id_tramo = cts1.id
								WHERE cts1.id_solicitud = cs.id
									AND cts1.tipo_operacion = "Descargue"
									AND cto1.orden = CUANTOS
							) DESTINO,
							cam.helisa_estado,
							cia.id ID_ACTIVIDAD, cia.id_importacion, cia.grupo, cia.orden
						FROM 
							cmx_importacion_proyecto cip
							INNER JOIN cmx_importacion_material cim ON cim.id_importacion = cip.id
							INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cim.id
							INNER JOIN cmx_agrupacion_material cam ON cam.id_material_proyecto = cim.id
							INNER JOIN cmx_agrupaciones ca ON ca.id = cam.id_agrupamiento
							INNER JOIN cmx_agrupacion_anticipo caa ON caa.id_agrupacion = ca.id
							INNER JOIN cmx_mercancia_solicitud cms ON cms.id = cam.id_material
							INNER JOIN cmx_servicio_adicional_tramo csat ON csat.id_solicitud = cms.id_solicitud
							INNER JOIN cmx_solicitudes cs ON cs.id = cms.id_solicitud
							INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
						WHERE 
							cam.id = ' . $value . '
							AND cia.tipo_actividad = "factura"
							AND cia.estado = 2
							AND cip.estado = 1
							AND csat.id_servicio = 24
					;';
					$result = $Data->getConsulta($sql);
					$remesa = $result["rowsData"][0];

					// Se actualiza el estado de la descarga de la remesa 
					$arrayUpdateRemesa = Array();
					$arrayUpdateRemesa["helisa_estado"] = "Descargado";
					$Data->updateRegistro( "cmx_agrupacion_material" , $arrayUpdateRemesa, (int)$value );

					// Se gestiona la actividad en el proyecto 
					$arrayUpdateActividad = Array();
					$arrayUpdateActividad["estado"] = 1;
					$arrayUpdateActividad["fecha_hora_finalizacion"] = $_ahora;
					$Data->updateRegistro("cmx_importacion_actividades", $arrayUpdateActividad, (int)$result["rowsData"][0]['ID_ACTIVIDAD']);

					// Se preguntra si a todas las remesas del proyecto se les generó archivo de factuarción 
					$sql = '
						SELECT COUNT(cia.estado) PENDIENTES
						FROM cmx_importacion_actividades cia
						WHERE 
							cia.id_importacion = ' . $result["rowsData"][0]['id_importacion'] . '
							AND cia.grupo = ' . $result["rowsData"][0]['grupo'] . '
							AND cia.orden = ' . $result["rowsData"][0]['orden'] . '
							AND cia.estado != 1
					;';
					$result_1 = $Data->getConsulta($sql);

					// Si ya se generó el archivo de las remesas del grupo de actividades del proyecto de inicia la siguiente actividad 
					if ( $result_1["rowsData"][0]["PENDIENTES"] == 0 ) {
						$sql = '
							SELECT cia.id
							FROM cmx_importacion_actividades cia
							WHERE 
								cia.id_importacion = ' . $result["rowsData"][0]['id_importacion'] . '
								AND cia.grupo = ' . $result["rowsData"][0]['grupo'] . '
								AND cia.orden = ' . ($result["rowsData"][0]['orden'] + 1) . '
								AND cia.id_material IS NOT NULL
						;';
						$result_2 = $Data->getConsulta($sql);

						foreach ($result_2["rowsData"] as $key_1 => $value_1) {
							// Se actualiza el estado de la descarga de la remesa 
							$arrayUpdateActividadSiguiente = Array();
							$arrayUpdateActividadSiguiente["estado"] = 2;
							$arrayUpdateActividadSiguiente["fecha_hora_inicio"] = $_ahora;
							$Data->updateRegistro( "cmx_importacion_actividades" , $arrayUpdateActividadSiguiente, (int)$value_1[0] );
						}
					}

					// Se crea los datos de la fila del archivo Excel
					$servicio = $result["rowsData"][0]['tipo_servicio'] . " " . $result["rowsData"][0]['numero_remesa'] . " - (" . $result["rowsData"][0]['MATERIAL'] . ")";

					// Se busca la información de las cuentas contables del concepto 
					$sql = '
						SELECT cccu.*
						FROM cmx_contabilidad_cuentas cccu
							INNER JOIN cmx_contabilidad_conceptos ccc ON cccu.id_concepto = ccc.id
						WHERE ccc.id = 24
					';
					$result = $Data->getConsulta($sql);
					if ($result) {
						$cuentas = $result["rowsData"];
						foreach ($cuentas as $key_01 => $value_01) {
							// Se crean las filas del archivo Excel
							$objPHPExcel->getActiveSheet()->setCellValue('A' . $fila , "PED"); // TIPO
							$objPHPExcel->getActiveSheet()->setCellValue('B' . $fila , $remesa['ID_REMESA']); // NUMERO_DOC
							$objPHPExcel->getActiveSheet()->setCellValue('C' . $fila , $solo_fecha); // FECHA_DOC
							$objPHPExcel->getActiveSheet()->setCellValue('D' . $fila , $remesa['documento']); // IDENTIDAD_CLIENTE
							$objPHPExcel->getActiveSheet()->setCellValue('E' . $fila , $Model->textContabilidad( $remesa['nombre'] )); // NOMBRE_CLIENTE
							$objPHPExcel->getActiveSheet()->setCellValue('F' . $fila , "2"); // TIPO CONCEPTO
							$objPHPExcel->getActiveSheet()->setCellValue('G' . $fila , $value_01["num_cuenta"]); // CODIGO CONCEPTO
							$objPHPExcel->getActiveSheet()->setCellValue('H' . $fila , $Model->textContabilidad( $value_01["nom_cuenta"] ) . " " . $Model->textContabilidad( $servicio ) ); // ARTICULO/SERVICIO
							$objPHPExcel->getActiveSheet()->setCellValue('I' . $fila , $remesa['PESO_MATERIAL']); // CANTIDAD (PESO DEL MATERIAL)
							$objPHPExcel->getActiveSheet()->setCellValue('J' . $fila , $remesa['VALOR_PRORRATEO']); // V/TOTAL (VALOR DE LA REMESA)
							$fila++;
						}
					}
				}
			}

			// Se crea el registro de descarga de las remesas 
			$arrayListaRemesa = Array();
			$arrayListaRemesa["lista_remesas"] = $_GET["id_remesas"];
			$arrayListaRemesa["fecha_creacion"] = $_ahora;
			$Data->setRegistro("cmx_agrupacion_descarga_remesas", $arrayListaRemesa);

			header('Content-Type: application/vnd.ms-excel');
			header('Content-Disposition: attachment;filename="' . $nombre_archivo . '.xls"');
			header('Cache-Control: max-age=0');

			$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
			$objWriter->save('php://output');
			break;

		case 'descargaExcelPedidos':
			$_msg_control.= "<p>Entro en opción descargaExcelPedidos</p>\n";

			$nombre_archivo = 'Copia - Lista de pedidos - ' . $_GET["fecha_creacion"];
			$solo_fecha = date("d/m/Y", strtotime($_GET["fecha_creacion"]));

			$fila = 1;
			
			$objPHPExcel = new PHPExcel;
			
			$objPHPExcel->getProperties()
				->setCreator('Nexos Group S.A.S')
				->setTitle('Pedidos - Copia')
				->setDescription('')
				->setKeywords('Facturación Nexos Group ')
				->setCategory('Tesorería')
			;
			
			$objPHPExcel->setActiveSheetIndex(0);
			$objPHPExcel->getActiveSheet( $nombre_archivo );

			// Se crean las filas del archivo Excel
			$objPHPExcel->getActiveSheet()->setCellValue('A' . $fila , "TIPO"); // TIPO
			$objPHPExcel->getActiveSheet()->setCellValue('B' . $fila , "NUMERO DOCUMENTO"); // NUMERO_DOC
			$objPHPExcel->getActiveSheet()->setCellValue('C' . $fila , "FECHA DOCUMENTO"); // FECHA_DOC
			$objPHPExcel->getActiveSheet()->setCellValue('D' . $fila , "DOCUMENTO CLIENTE"); // IDENTIDAD_CLIENTE
			$objPHPExcel->getActiveSheet()->setCellValue('E' . $fila , "NOMBRE CLIENTE"); // NOMBRE_CLIENTE
			$objPHPExcel->getActiveSheet()->setCellValue('F' . $fila , "TIPO CONCEPTO"); // TIPO CONCEPTO
			$objPHPExcel->getActiveSheet()->setCellValue('G' . $fila , "CODIGO CONCEPTO"); // CODIGO CONCEPTO
			$objPHPExcel->getActiveSheet()->setCellValue('H' . $fila , "ARTICULO/SERVICIO" ); // ARTICULO/SERVICIO
			$objPHPExcel->getActiveSheet()->setCellValue('I' . $fila , "CANTIDAD"); // CANTIDAD (PESO DEL MATERIAL)
			$objPHPExcel->getActiveSheet()->setCellValue('J' . $fila , "V/TOTAL"); // V/TOTAL (VALOR DE LA REMESA)
			$fila++;

			$arrayRemesas = explode(",",$_GET["id_remesas"]);
			foreach ($arrayRemesas as $value) {
				if ($value) {
					// Se busca informacion de las remesas 
					$sql = '
						SELECT 
							DISTINCT(cam.id) ID_REMESA, cam.numero_remesa, 
							csat.tipo_servicio, cim.nombre MATERIAL,
							cc.id ID_CLIENTE, cc.tipo_documento, cc.documento, cc.digito_verificacion, cc.nombre,
							caa.id ID_MANIFIESTO, caa.numero_manifiesto, cip.id ID_PROYECTO, cip.numero_importacion, cip.importacion,
							cms.id_solicitud, csat.valor_venta, FLOOR(cs.peso_total) PESO_TOTAL, cam.peso PESO_MATERIAL,
							FLOOR( ( csat.valor_venta * cam.peso ) / FLOOR(cs.peso_total) ) VALOR_PRORRATEO,
							(	SELECT COUNT(cts1.id)
								FROM cmx_tramo_solicitud cts1
								WHERE cts1.id_solicitud = cs.id
							) CUANTOS,
							(	SELECT CONCAT(cm1.id,"_",cm1.municipio," (",cm1.depto," - ",cm1.pais,")")
								FROM cmx_tramo_solicitud cts1
									INNER JOIN cmx_tramos_orden cto1 ON cto1.id_tramo = cts1.id
									INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cts1.id_remitente_destinatario
									INNER JOIN cmx_municipios cm1 ON cm1.id = crd1.id_ciudad
								WHERE cts1.id_solicitud = cs.id
									AND cts1.tipo_operacion = "Cargue"
									AND cto1.orden = 1
							) ORIGEN,
							(	SELECT CONCAT(cm1.id,"_",cm1.municipio," (",cm1.depto," - ",cm1.pais,")")
								FROM cmx_tramo_solicitud cts1
									INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cts1.id_remitente_destinatario
									INNER JOIN cmx_municipios cm1 ON cm1.id = crd1.id_ciudad
									INNER JOIN cmx_tramos_orden cto1 ON cto1.id_tramo = cts1.id
								WHERE cts1.id_solicitud = cs.id
									AND cts1.tipo_operacion = "Descargue"
									AND cto1.orden = CUANTOS
							) DESTINO,
							cam.helisa_estado
						FROM 
							cmx_importacion_proyecto cip
							INNER JOIN cmx_importacion_material cim ON cim.id_importacion = cip.id
							INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cim.id
							INNER JOIN cmx_agrupacion_material cam ON cam.id_material_proyecto = cim.id
							INNER JOIN cmx_agrupaciones ca ON ca.id = cam.id_agrupamiento
							INNER JOIN cmx_agrupacion_anticipo caa ON caa.id_agrupacion = ca.id
							INNER JOIN cmx_mercancia_solicitud cms ON cms.id = cam.id_material
							INNER JOIN cmx_servicio_adicional_tramo csat ON csat.id_solicitud = cms.id_solicitud
							INNER JOIN cmx_solicitudes cs ON cs.id = cms.id_solicitud
							INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
						WHERE 
							cam.id = ' . $value . '
							AND cip.estado = 1
							AND csat.id_servicio = 24
					;';
					$result = $Data->getConsulta($sql);

					$remesa = $result["rowsData"][0];
					$servicio = $remesa['tipo_servicio'] . " " . $remesa['numero_remesa'] . " - (" . $remesa['MATERIAL'] . ")";

					// Se busca la información de las cuentas contables del concepto 
					$sql = '
						SELECT cccu.*
						FROM cmx_contabilidad_cuentas cccu
							INNER JOIN cmx_contabilidad_conceptos ccc ON cccu.id_concepto = ccc.id
						WHERE ccc.id = 24
					';
					$result = $Data->getConsulta($sql);
					if ($result) {
						$cuentas = $result["rowsData"];
						foreach ($cuentas as $key_01 => $value_01) {
							// Se crean las filas del archivo Excel
							$objPHPExcel->getActiveSheet()->setCellValue('A' . $fila , "PED"); // TIPO
							$objPHPExcel->getActiveSheet()->setCellValue('B' . $fila , $remesa['ID_REMESA']); // NUMERO_DOC
							$objPHPExcel->getActiveSheet()->setCellValue('C' . $fila , $solo_fecha); // FECHA_DOC
							$objPHPExcel->getActiveSheet()->setCellValue('D' . $fila , $remesa['documento']); // IDENTIDAD_CLIENTE
							$objPHPExcel->getActiveSheet()->setCellValue('E' . $fila , $Model->textContabilidad( $remesa['nombre'] )); // NOMBRE_CLIENTE
							$objPHPExcel->getActiveSheet()->setCellValue('F' . $fila , "2"); // TIPO CONCEPTO
							$objPHPExcel->getActiveSheet()->setCellValue('G' . $fila , $value_01["num_cuenta"]); // CODIGO CONCEPTO
							$objPHPExcel->getActiveSheet()->setCellValue('H' . $fila , $Model->textContabilidad( $value_01["nom_cuenta"] ) . " " . $Model->textContabilidad( $servicio ) ); // ARTICULO/SERVICIO
							$objPHPExcel->getActiveSheet()->setCellValue('I' . $fila , $remesa['PESO_MATERIAL']); // CANTIDAD (PESO DEL MATERIAL)
							$objPHPExcel->getActiveSheet()->setCellValue('J' . $fila , $remesa['VALOR_PRORRATEO']); // V/TOTAL (VALOR DE LA REMESA)
							$fila++;
						}
					}
				}
			}

			header('Content-Type: application/vnd.ms-excel');
			header('Content-Disposition: attachment;filename="' . $nombre_archivo . '.xls"');
			header('Cache-Control: max-age=0');

			$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
			$objWriter->save('php://output');
			break;

		case 'verDatosPedido':
			$_msg_control.= "<p>Entro en opción verDatosPedido</p>\n";

			// Se busca informacion de las remesas 
			$sql = '
				SELECT 
					DISTINCT(cam.id) ID_REMESA, cam.numero_remesa, ca.id,
					csat.tipo_servicio, cim.nombre MATERIAL,
					cc.id ID_CLIENTE, cc.tipo_documento, cc.documento, cc.digito_verificacion, cc.nombre,
					caa.id ID_MANIFIESTO, caa.numero_manifiesto, cip.id ID_PROYECTO, cip.numero_importacion, cip.importacion,
					cms.id_solicitud, csat.valor_venta, FLOOR(cs.peso_total) PESO_TOTAL, cam.peso PESO_MATERIAL,
					FLOOR( ( csat.valor_venta * cam.peso ) / FLOOR(cs.peso_total) ) VALOR_PRORRATEO,
					(	SELECT COUNT(cts1.id)
						FROM cmx_tramo_solicitud cts1
						WHERE cts1.id_solicitud = cs.id
					) CUANTOS,
					(	SELECT CONCAT(cm1.id,"_",cm1.municipio," (",cm1.depto," - ",cm1.pais,")")
						FROM cmx_tramo_solicitud cts1
							INNER JOIN cmx_tramos_orden cto1 ON cto1.id_tramo = cts1.id
							INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cts1.id_remitente_destinatario
							INNER JOIN cmx_municipios cm1 ON cm1.id = crd1.id_ciudad
						WHERE cts1.id_solicitud = cs.id
							AND cts1.tipo_operacion = "Cargue"
							AND cto1.orden = 1
					) ORIGEN,
					(	SELECT CONCAT(cm1.id,"_",cm1.municipio," (",cm1.depto," - ",cm1.pais,")")
						FROM cmx_tramo_solicitud cts1
							INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cts1.id_remitente_destinatario
							INNER JOIN cmx_municipios cm1 ON cm1.id = crd1.id_ciudad
							INNER JOIN cmx_tramos_orden cto1 ON cto1.id_tramo = cts1.id
						WHERE cts1.id_solicitud = cs.id
							AND cts1.tipo_operacion = "Descargue"
							AND cto1.orden = CUANTOS
					) DESTINO,
					cam.helisa_estado
				FROM
					cmx_importacion_proyecto cip
					INNER JOIN cmx_importacion_material cim ON cim.id_importacion = cip.id
					INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cim.id
					INNER JOIN cmx_agrupacion_material cam ON cam.id_material_proyecto = cim.id
					INNER JOIN cmx_agrupaciones ca ON ca.id = cam.id_agrupamiento
					INNER JOIN cmx_agrupacion_anticipo caa ON caa.id_agrupacion = ca.id
					INNER JOIN cmx_mercancia_solicitud cms ON cms.id = cam.id_material
					INNER JOIN cmx_servicio_adicional_tramo csat ON csat.id_solicitud = cms.id_solicitud
					INNER JOIN cmx_solicitudes cs ON cs.id = cms.id_solicitud
					INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
				WHERE
					cam.id IN (' . $_POST["lista_remesas"] . '0)
					AND csat.id_servicio = 24
			;';
			$result = $Data->getConsulta($sql);

			$table_content = '
				<div class="col-xs-12 col-sm-12 col-md-12">
					<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible">
						<div class="icon">
							<span class="mdi mdi-alert-triangle"></span>
						</div>
						<div class="message">
							<strong>Atención!</strong>
							<p>El concepto no tiene cuentas contables registradas</p>
						</div>
					</div>
				</div>
			';

			if ($result) {
				$rows = '
					<div class="panel panel-border panel-contrast">
						<div class="panel-heading panel-heading-contrast">
							Descargar copia del pedido
							<div class="tools" id="tools_crear_asignacion" style="display: block;">
								<a href="' . BASE_URL . 'libs/helisa_ajax.php?action=descargaExcelPedidos&id_remesas=' . $_POST["lista_remesas"] . '&fecha_creacion=' . $_POST["fecha_creacion"] . '" class="icon hint--top-left" data-hint="Descargar archivo"><span class="mdi mdi-grid"></span></a>

							</div>
						</div>
					</div>
				';

				foreach ($result["rowsData"] as $key => $value) {
					// Se maqueta contenido de la tabla 
					$rows.= '<tr>';
					$rows.= '
						<td class="cell-detail">
							<span>' . $value["nombre"] . '</span>
							<span class="cell-detail-description">' . $value["documento"] . '-' . $value["digito_verificacion"] . '</span>
						</td>
						<td class="cell-detail">
							<span>' . $value["numero_remesa"] . '</span>
						</td>
						<td class="cell-detail">
							<span>' . $value["numero_manifiesto"] . '</span>
						</td>
						<td class="cell-detail">
							<span>' . $value["importacion"] . '</span>
							<span class="cell-detail-description">' . $value["numero_importacion"] . '</span>
						</td>
						<td class="cell-detail text-center">
							<span>' .  number_format($value["PESO_TOTAL"], 0, ",", ".") . 'Kg</span>
						</td>
						<td class="cell-detail text-center">
							<span>' . number_format($value["PESO_MATERIAL"], 0, ",", ".") . 'Kg</span>
						</td>
						<td class="cell-detail text-right">
							<span>$' . number_format($value["valor_venta"], 0, ",", ".") . '</span>
						</td>
						<td class="cell-detail text-right">
							<span>$' . number_format($value["VALOR_PRORRATEO"], 0, ",", ".") . '</span>
						</td>
					';
					$rows.= '</tr>';
				}

				$table_content = '
					<table id="table" class="table table-striped table-hover table-condensed">
						<thead>
							<tr>
								<th>Cliente</th>
								<th>Remesa</th>
								<th>Manifiesto</th>
								<th>Proyecto</th>
								<th>Kg Proyecto</th>
								<th>Kg Remesa</th>
								<th>$ Proyecto</th>
								<th>$ Remesa</th>
							</tr>
						</thead>
						<tbody>
							%content%
						</tbody>
					</table>
				';
				$table_content = str_replace("%content%" , $rows , $table_content);
			}
			$datafile["table_content"] = $table_content;
			break;

		case 'generaExcelAnticipos':
			$_msg_control.= "<p>Entro en opción generaExcelAnticipos</p>\n";

			$_ahora = date('Y-m-d H:i:s');
			$solo_fecha = date("d/m/Y", strtotime($_ahora));
			$arrayCuenta = explode("-",$_GET["cuenta"]);

			$nombre_archivo = 'Lista de anticipos - ' . $_ahora;

			$fila = 1;
			
			$objPHPExcel = new PHPExcel;
			
			$objPHPExcel->getProperties()
				->setCreator('Nexos Group S.A.S')
				->setTitle('Anticipos')
				->setDescription('')
				->setKeywords('Anticipos Nexos Group ')
				->setCategory('Tesorería')
			;
			
			$objPHPExcel->setActiveSheetIndex(0);
			$objPHPExcel->getActiveSheet( $nombre_archivo );

			// Se busca informacion de las remesas 
			$sql = '
				SELECT 
					ca.id ID_AGRUPACION, caa.numero_manifiesto, caa.flete, caa.anticipo,
					IF(
						(SELECT 
							COUNT(cv1.id)
						FROM
							cmx_vehiculos cv1
						WHERE 
							cv1.id_propietario = caa.beneficiario
							AND cv1.id = cav.id_vehiculo) > 0,
						"Propietario",
						"Conductor"
					) BENEFICIARIO,
					IF(
						(SELECT 
							COUNT(cv1.id)
						FROM
							cmx_vehiculos cv1
						WHERE 
							cv1.id_propietario = caa.beneficiario
							AND cv1.id = cav.id_vehiculo) > 0,
						(
							SELECT 
								IF(
									cp1.tipo_documento = "NIT",
									CONCAT(cp1.numero_documento,"-",cp1.digito_verificacion),
									cp1.numero_documento
								)
							FROM 
								cmx_proveedores cp1
								INNER JOIN cmx_vehiculos cv2 ON cv2.id_propietario = cp1.id
							WHERE 
								cp1.id = caa.beneficiario
								AND cv2.id = cav.id_vehiculo
						),
						(
							SELECT 
								IF(
									cp1.tipo_documento = "NIT",
									CONCAT(cp1.numero_documento,"-",cp1.digito_verificacion),
									cp1.numero_documento
								)
							FROM 
								cmx_proveedores cp1
								INNER JOIN cmx_vehiculos cv2 ON cv2.id_conductor = cp1.id
							WHERE 
								cp1.id = caa.beneficiario
								AND cv2.id = cav.id_vehiculo
						)
					) DOCUMENTO_BENEFICIARIO,
					IF(
						(SELECT 
							COUNT(cv1.id)
						FROM
							cmx_vehiculos cv1
						WHERE 
							cv1.id_propietario = caa.beneficiario
							AND cv1.id = cav.id_vehiculo) > 0,
						(
							SELECT 
								cp1.nombre
							FROM 
								cmx_proveedores cp1
								INNER JOIN cmx_vehiculos cv2 ON cv2.id_propietario = cp1.id
							WHERE 
								cp1.id = caa.beneficiario
								AND cv2.id = cav.id_vehiculo
						),
						(
							SELECT 
								cp1.nombre
							FROM 
								cmx_proveedores cp1
								INNER JOIN cmx_vehiculos cv2 ON cv2.id_conductor = cp1.id
							WHERE 
								cp1.id = caa.beneficiario
								AND cv2.id = cav.id_vehiculo
						)
					) NOMBRE_BENEFICIARIO,
					cv.id_propietario
				FROM 
					cmx_agrupaciones ca
					INNER JOIN cmx_agrupacion_anticipo caa ON caa.id_agrupacion = ca.id
					INNER JOIN cmx_agrupaciones_vehiculos cav ON cav.id_agrupacion = ca.id
					INNER JOIN cmx_vehiculos cv ON cv.id = cav.id_vehiculo
				WHERE 
					cav.estado IN ("Planillado","Anticipo Asignado")
					AND caa.id_agrupacion = ' . $_GET["id_agrupacion"] . '
			;';
			$result = $Data->getConsulta($sql);

			$arrayAnticipo = $result["rowsData"][0];
			$_concepto = "A TRANSPORTADORES TERCEROS";
			$_cuenta_vehiculo = "13300502";
			if ($arrayAnticipo["id_propietario"] == "5041") { // Se pregunta si el vehículo es de nexos 
				$_concepto = "A TRANSPORTADORES PROPIOS";
				$_cuenta_vehiculo = "13301501";
			}

			// Se crean las filas del encabezado del archivo Excel
			$objPHPExcel->getActiveSheet()->setCellValue('A' . $fila , "TIPO"); // TIPO
			$objPHPExcel->getActiveSheet()->setCellValue('B' . $fila , "NUMERO DOCUMENTO"); // NUMERO_DOC
			$objPHPExcel->getActiveSheet()->setCellValue('C' . $fila , "FECHA DOCUMENTO"); // FECHA_DOC
			$objPHPExcel->getActiveSheet()->setCellValue('D' . $fila , "CUENTA"); // CUENTA
			$objPHPExcel->getActiveSheet()->setCellValue('E' . $fila , "CONCEPTO" ); // CONCEPTO
			$objPHPExcel->getActiveSheet()->setCellValue('F' . $fila , "VALOR"); // VALOR
			$objPHPExcel->getActiveSheet()->setCellValue('G' . $fila , "NATURALEZA"); // NATURALEZA
			$objPHPExcel->getActiveSheet()->setCellValue('H' . $fila , "DOCUMENTO TERCERO"); // IDENTIDAD_CLIENTE
			$objPHPExcel->getActiveSheet()->setCellValue('I' . $fila , "NOMBRE TERCERO"); // NOMBRE TERCERO
			$objPHPExcel->getActiveSheet()->setCellValue('J' . $fila , "CLASE MOVIMIENTO"); // CLASE MOVIMIENTO
			$objPHPExcel->getActiveSheet()->setCellValue('K' . $fila , "INDICE"); // INDICE
			$fila++;

			// Registro del anticipo 
			$objPHPExcel->getActiveSheet()->setCellValue('A' . $fila , "CE"); // TIPO DOC
			$objPHPExcel->getActiveSheet()->setCellValue('B' . $fila , $arrayAnticipo["numero_manifiesto"]); // NÚMERO DOC
			$objPHPExcel->getActiveSheet()->setCellValue('C' . $fila , $solo_fecha); // FECHA
			$objPHPExcel->getActiveSheet()->setCellValue('D' . $fila , $_cuenta_vehiculo); // CUENTA
			$objPHPExcel->getActiveSheet()->setCellValue('E' . $fila , $_concepto . " (" . $arrayAnticipo["numero_manifiesto"] . ")"); // CONCEPTO
			$objPHPExcel->getActiveSheet()->setCellValue('F' . $fila , $arrayAnticipo["anticipo"]); // VALOR
			$objPHPExcel->getActiveSheet()->setCellValue('G' . $fila , "D"); // NATURALEZA
			$objPHPExcel->getActiveSheet()->setCellValue('H' . $fila , $arrayAnticipo["DOCUMENTO_BENEFICIARIO"]); // IDENTIDAD TERCERO
			$objPHPExcel->getActiveSheet()->setCellValue('I' . $fila , $arrayAnticipo["NOMBRE_BENEFICIARIO"]); // NOMBRE TERCERO
			$objPHPExcel->getActiveSheet()->setCellValue('J' . $fila , "F"); // CLASE MOVIMIENTO
			$objPHPExcel->getActiveSheet()->setCellValue('K' . $fila , "1003"); // INDICE
			$fila++;

			// Registro de la salida del banco 
			$objPHPExcel->getActiveSheet()->setCellValue('A' . $fila , "CE"); // TIPO DOC
			$objPHPExcel->getActiveSheet()->setCellValue('B' . $fila , $arrayAnticipo["numero_manifiesto"]); // NÚMERO DOC
			$objPHPExcel->getActiveSheet()->setCellValue('C' . $fila , $solo_fecha); // FECHA
			$objPHPExcel->getActiveSheet()->setCellValue('D' . $fila , $arrayCuenta[0]); // CUENTA
			$objPHPExcel->getActiveSheet()->setCellValue('E' . $fila , "ANTICIPO TRANSPORTADORES (" . $arrayAnticipo["numero_manifiesto"] . ")"); // CONCEPTO
			$objPHPExcel->getActiveSheet()->setCellValue('F' . $fila , $arrayAnticipo["anticipo"]); // VALOR
			$objPHPExcel->getActiveSheet()->setCellValue('G' . $fila , "C"); // NATURALEZA
			$objPHPExcel->getActiveSheet()->setCellValue('H' . $fila , $arrayAnticipo["DOCUMENTO_BENEFICIARIO"]); // IDENTIDAD TERCERO
			$objPHPExcel->getActiveSheet()->setCellValue('I' . $fila , $arrayAnticipo["NOMBRE_BENEFICIARIO"]); // NOMBRE TERCERO
			$objPHPExcel->getActiveSheet()->setCellValue('J' . $fila , "F"); // CLASE MOVIMIENTO
			$objPHPExcel->getActiveSheet()->setCellValue('K' . $fila , "1004"); // INDICE
			$fila++;

			// Se crea el registro de descarga de los anticipos
			$arrayListaAnticipos = Array();
			$arrayListaAnticipos["id_agrupamiento"] = $_GET["id_agrupacion"];
			$arrayListaAnticipos["fecha_creacion"] = $_ahora;
			$arrayListaAnticipos["cuenta"] = $_GET["cuenta"];
			$Data->setRegistro("cmx_agrupacion_descarga_anticipos", $arrayListaAnticipos);

			header('Content-Type: application/vnd.ms-excel');
			header('Content-Disposition: attachment;filename="' . $nombre_archivo . '.xls"');
			header('Cache-Control: max-age=0');

			$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
			$objWriter->save('php://output');
			break;

		case 'descargaExcelAnticipos':
			$_msg_control.= "<p>Entro en opción descargaExcelAnticipos</p>\n";

			$_ahora = date('Y-m-d H:i:s');
			$solo_fecha = date("d/m/Y", strtotime($_ahora));

			$nombre_archivo = 'Copia - Lista de anticipos - ' . $_ahora;

			$fila = 1;
			
			$objPHPExcel = new PHPExcel;
			
			$objPHPExcel->getProperties()
				->setCreator('Nexos Group S.A.S')
				->setTitle('Anticipos')
				->setDescription('')
				->setKeywords('Anticipos Nexos Group ')
				->setCategory('Tesorería')
			;
			
			$objPHPExcel->setActiveSheetIndex(0);
			$objPHPExcel->getActiveSheet( $nombre_archivo );

			// Se crean las filas del encabezado del archivo Excel
			$objPHPExcel->getActiveSheet()->setCellValue('A' . $fila , "TIPO"); // TIPO
			$objPHPExcel->getActiveSheet()->setCellValue('B' . $fila , "NUMERO DOCUMENTO"); // NUMERO_DOC
			$objPHPExcel->getActiveSheet()->setCellValue('C' . $fila , "FECHA DOCUMENTO"); // FECHA_DOC
			$objPHPExcel->getActiveSheet()->setCellValue('D' . $fila , "CUENTA"); // CUENTA
			$objPHPExcel->getActiveSheet()->setCellValue('E' . $fila , "CONCEPTO" ); // CONCEPTO
			$objPHPExcel->getActiveSheet()->setCellValue('F' . $fila , "VALOR"); // VALOR
			$objPHPExcel->getActiveSheet()->setCellValue('G' . $fila , "NATURALEZA"); // NATURALEZA
			$objPHPExcel->getActiveSheet()->setCellValue('H' . $fila , "DOCUMENTO TERCERO"); // IDENTIDAD_CLIENTE
			$objPHPExcel->getActiveSheet()->setCellValue('I' . $fila , "NOMBRE TERCERO"); // NOMBRE TERCERO
			$objPHPExcel->getActiveSheet()->setCellValue('J' . $fila , "CLASE MOVIMIENTO"); // CLASE MOVIMIENTO
			$objPHPExcel->getActiveSheet()->setCellValue('K' . $fila , "INDICE"); // INDICE
			$fila++;

			$arrayAnticipos = explode(",",$_GET["id_agrupacion"]);

			foreach ($arrayAnticipos as $value) {
				if ( $value ) {
					// Se busca informacion de las remesas 
					$sql = '
						SELECT 
							ca.id ID_AGRUPACION, caa.numero_manifiesto, caa.flete, caa.anticipo,
							IF(
								(SELECT 
									COUNT(cv1.id)
								FROM
									cmx_vehiculos cv1
								WHERE 
									cv1.id_propietario = caa.beneficiario
									AND cv1.id = cav.id_vehiculo) > 0,
								"Propietario",
								"Conductor"
							) BENEFICIARIO,
							IF(
								(SELECT 
									COUNT(cv1.id)
								FROM
									cmx_vehiculos cv1
								WHERE 
									cv1.id_propietario = caa.beneficiario
									AND cv1.id = cav.id_vehiculo) > 0,
								(
									SELECT 
										IF(
											cp1.tipo_documento = "NIT",
											CONCAT(cp1.numero_documento,"-",cp1.digito_verificacion),
											cp1.numero_documento
										)
									FROM 
										cmx_proveedores cp1
										INNER JOIN cmx_vehiculos cv2 ON cv2.id_propietario = cp1.id
									WHERE 
										cp1.id = caa.beneficiario
										AND cv2.id = cav.id_vehiculo
								),
								(
									SELECT 
										IF(
											cp1.tipo_documento = "NIT",
											CONCAT(cp1.numero_documento,"-",cp1.digito_verificacion),
											cp1.numero_documento
										)
									FROM 
										cmx_proveedores cp1
										INNER JOIN cmx_vehiculos cv2 ON cv2.id_conductor = cp1.id
									WHERE 
										cp1.id = caa.beneficiario
										AND cv2.id = cav.id_vehiculo
								)
							) DOCUMENTO_BENEFICIARIO,
							IF(
								(SELECT 
									COUNT(cv1.id)
								FROM
									cmx_vehiculos cv1
								WHERE 
									cv1.id_propietario = caa.beneficiario
									AND cv1.id = cav.id_vehiculo) > 0,
								(
									SELECT 
										cp1.nombre
									FROM 
										cmx_proveedores cp1
										INNER JOIN cmx_vehiculos cv2 ON cv2.id_propietario = cp1.id
									WHERE 
										cp1.id = caa.beneficiario
										AND cv2.id = cav.id_vehiculo
								),
								(
									SELECT 
										cp1.nombre
									FROM 
										cmx_proveedores cp1
										INNER JOIN cmx_vehiculos cv2 ON cv2.id_conductor = cp1.id
									WHERE 
										cp1.id = caa.beneficiario
										AND cv2.id = cav.id_vehiculo
								)
							) NOMBRE_BENEFICIARIO,
							cada.id ID_DESCARGA, cada.cuenta, cada.fecha_creacion, cada.descargado,
							cv.id_propietario
						FROM 
							cmx_agrupaciones ca
							INNER JOIN cmx_agrupacion_anticipo caa ON caa.id_agrupacion = ca.id
							INNER JOIN cmx_agrupaciones_vehiculos cav ON cav.id_agrupacion = ca.id
							INNER JOIN cmx_vehiculos cv ON cv.id = cav.id_vehiculo
							INNER JOIN cmx_agrupacion_descarga_anticipos cada ON cada.id_agrupamiento = ca.id
						WHERE 
							cav.estado IN ("Planillado","Anticipo Asignado")
							AND caa.anticipo > 0
							AND cada.id_agrupamiento = ' . $value . '
					;';
					$result = $Data->getConsulta($sql);

					$arrayAnticipo = $result["rowsData"][0];
					$arrayCuenta = explode("-",$result["rowsData"][0]["cuenta"]);
					$estadoDescarga = $result["rowsData"][0]["descargado"];
					$idDescarga = $result["rowsData"][0]["ID_DESCARGA"];

					if ( (isset($_GET["estado"]) AND $_GET["estado"] == 0) OR $estadoDescarga == 0 ) {
						$array = Array();
						$array["descargado"] = 1;
						$result = $Data->updateRegistro( "cmx_agrupacion_descarga_anticipos" , $array, (int)$idDescarga );
					}

					$_concepto = "A TRANSPORTADORES TERCEROS";
					$_cuenta_vehiculo = "13300502";
					if ($arrayAnticipo["id_propietario"] == "5041") { // Se pregunta si el vehículo es de nexos 
						$_concepto = "A TRANSPORTADORES PROPIOS";
						$_cuenta_vehiculo = "13301501";
					}

					// Registro del anticipo 
					$objPHPExcel->getActiveSheet()->setCellValue('A' . $fila , "CE"); // TIPO DOC
					$objPHPExcel->getActiveSheet()->setCellValue('B' . $fila , $arrayAnticipo["numero_manifiesto"]); // NÚMERO DOC
					$objPHPExcel->getActiveSheet()->setCellValue('C' . $fila , date("d/m/Y", strtotime( $arrayAnticipo["fecha_creacion"] ))); // FECHA
					$objPHPExcel->getActiveSheet()->setCellValue('D' . $fila , $_cuenta_vehiculo); // CUENTA
					$objPHPExcel->getActiveSheet()->setCellValue('E' . $fila , $_concepto . " (" . $arrayAnticipo["numero_manifiesto"] . ")"); // CONCEPTO
					$objPHPExcel->getActiveSheet()->setCellValue('F' . $fila , $arrayAnticipo["anticipo"]); // VALOR
					$objPHPExcel->getActiveSheet()->setCellValue('G' . $fila , "D"); // NATURALEZA
					$objPHPExcel->getActiveSheet()->setCellValue('H' . $fila , $arrayAnticipo["DOCUMENTO_BENEFICIARIO"]); // IDENTIDAD TERCERO
					$objPHPExcel->getActiveSheet()->setCellValue('I' . $fila , $arrayAnticipo["NOMBRE_BENEFICIARIO"]); // NOMBRE TERCERO
					$objPHPExcel->getActiveSheet()->setCellValue('J' . $fila , "F"); // CLASE MOVIMIENTO
					$objPHPExcel->getActiveSheet()->setCellValue('K' . $fila , "1003"); // INDICE
					$fila++;

					// Registro de la salida del banco 
					$objPHPExcel->getActiveSheet()->setCellValue('A' . $fila , "CE"); // TIPO DOC
					$objPHPExcel->getActiveSheet()->setCellValue('B' . $fila , $arrayAnticipo["numero_manifiesto"]); // NÚMERO DOC
					$objPHPExcel->getActiveSheet()->setCellValue('C' . $fila , date("d/m/Y", strtotime( $arrayAnticipo["fecha_creacion"] ))); // FECHA
					$objPHPExcel->getActiveSheet()->setCellValue('D' . $fila , $arrayCuenta[0]); // CUENTA
					$objPHPExcel->getActiveSheet()->setCellValue('E' . $fila , "ANTICIPO TRANSPORTADORES (" . $arrayAnticipo["numero_manifiesto"] . ")"); // CONCEPTO
					$objPHPExcel->getActiveSheet()->setCellValue('F' . $fila , $arrayAnticipo["anticipo"]); // VALOR
					$objPHPExcel->getActiveSheet()->setCellValue('G' . $fila , "C"); // NATURALEZA
					$objPHPExcel->getActiveSheet()->setCellValue('H' . $fila , $arrayAnticipo["DOCUMENTO_BENEFICIARIO"]); // IDENTIDAD TERCERO
					$objPHPExcel->getActiveSheet()->setCellValue('I' . $fila , $arrayAnticipo["NOMBRE_BENEFICIARIO"]); // NOMBRE TERCERO
					$objPHPExcel->getActiveSheet()->setCellValue('J' . $fila , "F"); // CLASE MOVIMIENTO
					$objPHPExcel->getActiveSheet()->setCellValue('K' . $fila , "1004"); // INDICE
					$fila++;
				}
			}

			header('Content-Type: application/vnd.ms-excel');
			header('Content-Disposition: attachment;filename="' . $nombre_archivo . '.xls"');
			header('Cache-Control: max-age=0');

			$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
			$objWriter->save('php://output');
			break;

		case 'generaExcelCostos':
			$_msg_control.= "<p>Entro en opción generaExcelCostos</p>\n";

			$_ahora = date('Y-m-d H:i:s');
			$solo_fecha = date("d/m/Y", strtotime($_ahora));
			$arrayCuenta = explode("-",$_GET["id_costos"]);

			$nombre_archivo = 'Lista de costos - ' . $_ahora;

			$fila = 1;
			
			$objPHPExcel = new PHPExcel;
			
			$objPHPExcel->getProperties()
				->setCreator('Nexos Group S.A.S')
				->setTitle('Costos')
				->setDescription('')
				->setKeywords('Costos Nexos Group ')
				->setCategory('Tesorería')
			;
			
			$objPHPExcel->setActiveSheetIndex(0);
			$objPHPExcel->getActiveSheet( $nombre_archivo );

			// Se crean las filas del encabezado del archivo Excel
			$objPHPExcel->getActiveSheet()->setCellValue('A' . $fila , "TIPO DOCUMENTO"); // TIPO DOCUMENTO
			$objPHPExcel->getActiveSheet()->setCellValue('B' . $fila , "NUMERO DOCUMENTO"); // NUMERO_DOC
			$objPHPExcel->getActiveSheet()->setCellValue('C' . $fila , "FECHA DOCUMENTO"); // FECHA_DOC
			$objPHPExcel->getActiveSheet()->setCellValue('D' . $fila , "DOCUMENTO TERCERO"); // IDENTIDAD_CLIENTE
			$objPHPExcel->getActiveSheet()->setCellValue('E' . $fila , "NOMBRE TERCERO"); // NOMBRE TERCERO
			$objPHPExcel->getActiveSheet()->setCellValue('F' . $fila , "NATURALEZA"); // NATURALEZA
			$objPHPExcel->getActiveSheet()->setCellValue('G' . $fila , "TIPO DE CONCEPTO"); // TIPO DE CONCEPTO
			$objPHPExcel->getActiveSheet()->setCellValue('H' . $fila , "CUENTA"); // CUENTA
			$objPHPExcel->getActiveSheet()->setCellValue('I' . $fila , "CONCEPTO" ); // CONCEPTO
			$objPHPExcel->getActiveSheet()->setCellValue('J' . $fila , "VALOR"); // VALOR
			$fila++;

			$arrayCostos = explode(",",$_GET["id_costos"]);

			foreach ($arrayCostos as $value) {
				if ($value) {
					// Se busca informacion de las remesas 
					$sql = '
						SELECT 
							DISTINCT(csat.id), 
							caa.id ID_MANIFIESTO, caa.numero_manifiesto,
							cs.id ID_SOLICITUD, cs.numero_solicitud,
							cc.nombre NOMBRE_CLIENTE,
							csat.id_servicio,
							(
								SELECT ccco1.nom_servicios_especial
								FROM cmx_contabilidad_conceptos ccco1
								WHERE ccco1.id = csat.id_servicio
							) tipo_servicio,
							FLOOR( 
								csat.valor_compra / (
									SELECT COUNT( cas1.id_agrupacion) CUANTOS
									FROM cmx_agrupacion_solicitudes cas1
										INNER JOIN cmx_servicio_adicional_tramo csat1 ON csat1.id_solicitud = cas1.id_solicitud
									WHERE cas1.id_agrupacion = cam.id_agrupamiento
										AND csat1.id_servicio != 24
								)
							) VALOR_COMPRA,
							(	SELECT crd1.nombre
								FROM cmx_tramo_solicitud cts1
									INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cts1.id_remitente_destinatario
								WHERE cts1.id_solicitud = cs.id
									AND cts1.tipo_operacion = "Cargue"
							) ORIGEN,
							(	SELECT CONCAT(cm1.municipio," (",cm1.depto," - ",cm1.pais,")")
								FROM cmx_tramo_solicitud cts1
									INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cts1.id_remitente_destinatario
									INNER JOIN cmx_municipios cm1 ON cm1.id = crd1.id_ciudad
								WHERE cts1.id_solicitud = cs.id
									AND cts1.tipo_operacion = "Cargue"
							) CIUDAD_ORIGEN,
							(	SELECT DISTINCT( crd1.nombre )
								FROM cmx_tramo_solicitud cts1
									INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cts1.id_remitente_destinatario
									INNER JOIN cmx_tramos_orden cto1 ON cto1.id_tramo = cts1.id
								WHERE cts1.id_solicitud = cs.id
									AND cts1.tipo_operacion = "Descargue"
									AND cto1.orden = (
										SELECT MAX(cto2.orden)
										FROM cmx_tramo_solicitud cts2
											INNER JOIN cmx_tramos_orden cto2 ON cto2.id_tramo = cts2.id
										WHERE cts2.id_solicitud = cts1.id_solicitud
									)
							) DESTINO,
							(	SELECT DISTINCT( CONCAT(cm1.municipio," (",cm1.depto," - ",cm1.pais,")") )
								FROM cmx_tramo_solicitud cts1
									INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cts1.id_remitente_destinatario
									INNER JOIN cmx_municipios cm1 ON cm1.id = crd1.id_ciudad
									INNER JOIN cmx_tramos_orden cto1 ON cto1.id_tramo = cts1.id
								WHERE cts1.id_solicitud = cs.id
									AND cts1.tipo_operacion = "Descargue"
									AND cto1.orden = (
										SELECT MAX(cto2.orden)
										FROM cmx_tramo_solicitud cts2
											INNER JOIN cmx_tramos_orden cto2 ON cto2.id_tramo = cts2.id
										WHERE cts2.id_solicitud = cts1.id_solicitud
									)
							) CIUDAD_DESTINO,
							cp.id ID_PROVEEDOR, cp.tipo_documento, cp.numero_documento, cp.digito_verificacion, cp.nombre
						FROM 
							cmx_servicio_adicional_tramo csat
							INNER JOIN cmx_proveedores cp ON cp.id = csat.id_proveedor
							INNER JOIN cmx_mercancia_solicitud cms ON cms.id_solicitud = csat.id_solicitud
							INNER JOIN cmx_agrupacion_material cam ON cam.id_material = cms.id
							INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cms.id_material_proyecto AND cia.id_material = cam.id_material_proyecto
							INNER JOIN cmx_agrupacion_anticipo caa ON caa.id_agrupacion = cam.id_agrupamiento
							LEFT JOIN cmx_agrupacion_descarga_costos cadc ON cadc.id_servicio_adicional = csat.id
							INNER JOIN cmx_solicitudes cs ON cs.id = cms.id_solicitud
							INNER JOIN cmx_clientes cc ON cc.id = cs.id_cliente
						WHERE 
							csat.id = ' . $value . '
							AND csat.id_servicio != 24
							AND cia.tipo_actividad = "instruccion_factura"
							AND cia.estado = 2
							AND cadc.id_servicio_adicional IS NULL
					;';
					$result = $Data->getConsulta($sql);

					if ($result) {
						foreach ($result["rowsData"] as $key_01 => $value_01) {
							// Se buscan los conceptos contables de los servicios 
							$sql = '
								SELECT *
								FROM cmx_contabilidad_cuentas cccu
								WHERE cccu.id_concepto = ' . $value_01["id_servicio"] . '
									AND cccu.estado = "Activo"
							';
							$result_01 = $Data->getConsulta($sql);

							if ($result_01) {
								foreach ($result_01["rowsData"] as $key_02 => $value_02) {
									// Registro del costo del servicio
									$objPHPExcel->getActiveSheet()->setCellValue('A' . $fila , $value_02["tipo_documento"]); // TIPO DOC
									$objPHPExcel->getActiveSheet()->setCellValue('B' . $fila , $value_01["numero_manifiesto"]); // NÚMERO DOC
									$objPHPExcel->getActiveSheet()->setCellValue('C' . $fila , $solo_fecha); // FECHA
									$objPHPExcel->getActiveSheet()->setCellValue('D' . $fila , $value_01["numero_documento"]); // IDENTIDAD TERCERO
									$objPHPExcel->getActiveSheet()->setCellValue('E' . $fila , $Model->textContabilidad( $value_01["nombre"] )); // NOMBRE TERCERO
									$objPHPExcel->getActiveSheet()->setCellValue('F' . $fila , $value_02["tipo_cuenta"]); // NATURALEZA
									$objPHPExcel->getActiveSheet()->setCellValue('G' . $fila , "2"); // TIPO CONCEPTO
									$objPHPExcel->getActiveSheet()->setCellValue('H' . $fila , $value_02["num_cuenta"]); // CUENTA
									$objPHPExcel->getActiveSheet()->setCellValue('I' . $fila , $Model->textContabilidad( $value_01["tipo_servicio"] ) . " " . $Model->textContabilidad( $value_02["nom_cuenta"] )); // CONCEPTO
									$objPHPExcel->getActiveSheet()->setCellValue('J' . $fila , $value_01["VALOR_COMPRA"]); // VALOR
									$fila++;
								}
							}
						}
					}

					// Se crea el registro de descarga de los costos
					$arrayListaCostos = Array();
					$arrayListaCostos["id_servicio_adicional"] = $value;
					$arrayListaCostos["fecha_creacion"] = $_ahora;
					$Data->setRegistro("cmx_agrupacion_descarga_costos", $arrayListaCostos);
				}
			}

			header('Content-Type: application/vnd.ms-excel');
			header('Content-Disposition: attachment;filename="' . $nombre_archivo . '.xls"');
			header('Cache-Control: max-age=0');

			$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
			$objWriter->save('php://output');
			break;

		case 'descargaExcelCostos':
			$_msg_control.= "<p>Entro en opción generaExcelCostos</p>\n";

			$_ahora = date('Y-m-d H:i:s');
			$arrayCuenta = explode("-",$_GET["id_costos"]);

			$nombre_archivo = 'Copia - Lista de costos - ' . $_ahora;

			$fila = 1;
			
			$objPHPExcel = new PHPExcel;
			
			$objPHPExcel->getProperties()
				->setCreator('Nexos Group S.A.S')
				->setTitle('Costos')
				->setDescription('')
				->setKeywords('Costos Nexos Group ')
				->setCategory('Tesorería')
			;
			
			$objPHPExcel->setActiveSheetIndex(0);
			$objPHPExcel->getActiveSheet( $nombre_archivo );

			// Se crean las filas del encabezado del archivo Excel
			$objPHPExcel->getActiveSheet()->setCellValue('A' . $fila , "TIPO DOCUMENTO"); // TIPO DOCUMENTO
			$objPHPExcel->getActiveSheet()->setCellValue('B' . $fila , "NUMERO DOCUMENTO"); // NUMERO_DOC
			$objPHPExcel->getActiveSheet()->setCellValue('C' . $fila , "FECHA DOCUMENTO"); // FECHA_DOC
			$objPHPExcel->getActiveSheet()->setCellValue('D' . $fila , "CUENTA"); // CUENTA
			$objPHPExcel->getActiveSheet()->setCellValue('E' . $fila , "CONCEPTO" ); // CONCEPTO
			$objPHPExcel->getActiveSheet()->setCellValue('F' . $fila , "VALOR"); // VALOR
			$objPHPExcel->getActiveSheet()->setCellValue('G' . $fila , "NATURALEZA"); // NATURALEZA
			$objPHPExcel->getActiveSheet()->setCellValue('H' . $fila , "DOCUMENTO TERCERO"); // IDENTIDAD_CLIENTE
			$objPHPExcel->getActiveSheet()->setCellValue('I' . $fila , "NOMBRE TERCERO"); // NOMBRE TERCERO
			$fila++;

			$arrayCostos = explode(",",$_GET["id_costos"]);

			foreach ($arrayCostos as $value) {
				if ($value) {
					// Se busca informacion de las remesas 
					$sql = '
						SELECT 
							DISTINCT(csat.id), 
							caa.id ID_MANIFIESTO, caa.numero_manifiesto,
							cadc.fecha_creacion,
							cs.id ID_SOLICITUD, cs.numero_solicitud,
							cc.nombre NOMBRE_CLIENTE,
							(
								SELECT ccco1.nom_servicios_especial
								FROM cmx_contabilidad_conceptos ccco1
								WHERE ccco1.id = csat.id_servicio
							) tipo_servicio,
							FLOOR( 
								csat.valor_compra / (
									SELECT 
										COUNT( cas1.id_agrupacion) CUANTOS
									FROM 
										cmx_agrupacion_solicitudes cas1
										INNER JOIN cmx_servicio_adicional_tramo csat1 ON csat1.id_solicitud = cas1.id_solicitud
									WHERE 
										cas1.id_agrupacion = cam.id_agrupamiento
										AND csat1.tipo_servicio != "Transporte"
								)
							) VALOR_COMPRA,
							(
								SELECT 
									crd1.nombre
								FROM 
									cmx_tramo_solicitud cts1
									INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cts1.id_remitente_destinatario
								WHERE 
									cts1.id_solicitud = cs.id
									AND cts1.tipo_operacion = "Cargue"
							) ORIGEN,
							(
								SELECT 
									CONCAT(cm1.municipio," (",cm1.depto," - ",cm1.pais,")")
								FROM 
									cmx_tramo_solicitud cts1
									INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cts1.id_remitente_destinatario
									INNER JOIN cmx_municipios cm1 ON cm1.id = crd1.id_ciudad
								WHERE 
									cts1.id_solicitud = cs.id
									AND cts1.tipo_operacion = "Cargue"
							) CIUDAD_ORIGEN,
							(
								SELECT 
									DISTINCT( crd1.nombre )
								FROM 
									cmx_tramo_solicitud cts1
									INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cts1.id_remitente_destinatario
									INNER JOIN cmx_tramos_orden cto1 ON cto1.id_tramo = cts1.id
								WHERE 
									cts1.id_solicitud = cs.id
									AND cts1.tipo_operacion = "Descargue"
									AND cto1.orden = (
										SELECT 
											MAX(cto2.orden)
										FROM 
											cmx_tramo_solicitud cts2
											INNER JOIN cmx_tramos_orden cto2 ON cto2.id_tramo = cts2.id
										WHERE 
											cts2.id_solicitud = cts1.id_solicitud
									)
							) DESTINO,
							(
								SELECT 
									DISTINCT( CONCAT(cm1.municipio," (",cm1.depto," - ",cm1.pais,")") )
								FROM 
									cmx_tramo_solicitud cts1
									INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cts1.id_remitente_destinatario
									INNER JOIN cmx_municipios cm1 ON cm1.id = crd1.id_ciudad
									INNER JOIN cmx_tramos_orden cto1 ON cto1.id_tramo = cts1.id
								WHERE 
									cts1.id_solicitud = cs.id
									AND cts1.tipo_operacion = "Descargue"
									AND cto1.orden = (
										SELECT 
											MAX(cto2.orden)
										FROM 
											cmx_tramo_solicitud cts2
											INNER JOIN cmx_tramos_orden cto2 ON cto2.id_tramo = cts2.id
										WHERE 
											cts2.id_solicitud = cts1.id_solicitud
									)
							) CIUDAD_DESTINO,
							cp.id ID_PROVEEDOR, cp.tipo_documento, cp.numero_documento, cp.digito_verificacion, cp.nombre
						FROM 
							cmx_servicio_adicional_tramo csat
							INNER JOIN cmx_proveedores cp ON cp.id = csat.id_proveedor
							INNER JOIN cmx_mercancia_solicitud cms ON cms.id_solicitud = csat.id_solicitud
							INNER JOIN cmx_agrupacion_material cam ON cam.id_material = cms.id
							INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cms.id_material_proyecto AND cia.id_material = cam.id_material_proyecto
							INNER JOIN cmx_agrupacion_anticipo caa ON caa.id_agrupacion = cam.id_agrupamiento
							INNER JOIN cmx_agrupacion_descarga_costos cadc ON cadc.id_servicio_adicional = csat.id
							INNER JOIN cmx_solicitudes cs ON cs.id = cms.id_solicitud
							INNER JOIN cmx_clientes cc ON cc.id = cs.id_cliente
						WHERE 
							csat.id = ' . $value . '
							AND csat.tipo_servicio != "Transporte"
							AND cia.tipo_actividad = "instruccion_factura"
							AND cia.estado = 2
					;';
					$result = $Data->getConsulta($sql);
					$arrayCosto = $result["rowsData"][0];
					
					// Se filtra el contenido del valor del número de cuenta del servicio adicional
					switch ( $arrayCosto["tipo_servicio"] ) {
						case 'Desconsolidacion':
							$cuenta_contable = 74050504;
							break;

						case 'Satelital':
							$cuenta_contable = 74050505;
							break;

						case 'Escoltas':
							$cuenta_contable = 74050502;
							break;

						case 'Almacenamiento':
							$cuenta_contable = 74050511;
							break;

						case 'Montacarga':
							$cuenta_contable = 74050508;
							break;

						default:
							$cuenta_contable = "error";
							break;
					}

					// Registro del costo del servicio
					$objPHPExcel->getActiveSheet()->setCellValue('A' . $fila , "CE"); // TIPO DOC
					$objPHPExcel->getActiveSheet()->setCellValue('B' . $fila , $arrayCosto["numero_manifiesto"]); // NÚMERO DOC
					$objPHPExcel->getActiveSheet()->setCellValue('C' . $fila , date("d/m/Y", strtotime($arrayCosto["fecha_creacion"]))); // FECHA
					$objPHPExcel->getActiveSheet()->setCellValue('D' . $fila , $cuenta_contable); // CUENTA
					$objPHPExcel->getActiveSheet()->setCellValue('E' . $fila , $arrayCosto["tipo_servicio"]); // CONCEPTO
					$objPHPExcel->getActiveSheet()->setCellValue('F' . $fila , $arrayCosto["VALOR_COMPRA"]); // VALOR
					$objPHPExcel->getActiveSheet()->setCellValue('G' . $fila , "D"); // NATURALEZA
					$objPHPExcel->getActiveSheet()->setCellValue('H' . $fila , $arrayCosto["numero_documento"]); // IDENTIDAD TERCERO
					$objPHPExcel->getActiveSheet()->setCellValue('I' . $fila , $Model->textContabilidad( $arrayCosto["nombre"] )); // NOMBRE TERCERO
					$fila++;

					// Registro de cuanta de contrapeso contable 
					$objPHPExcel->getActiveSheet()->setCellValue('A' . $fila , "CE"); // TIPO DOC
					$objPHPExcel->getActiveSheet()->setCellValue('B' . $fila , $arrayCosto["numero_manifiesto"]); // NÚMERO DOC
					$objPHPExcel->getActiveSheet()->setCellValue('C' . $fila , date("d/m/Y", strtotime($arrayCosto["fecha_creacion"]))); // FECHA
					$objPHPExcel->getActiveSheet()->setCellValue('D' . $fila , 28150501); // CUENTA
					$objPHPExcel->getActiveSheet()->setCellValue('E' . $fila , "RECIBIDO POR SALDOS MANIFIESTOS"); // CONCEPTO
					$objPHPExcel->getActiveSheet()->setCellValue('F' . $fila , $arrayCosto["VALOR_COMPRA"]); // VALOR
					$objPHPExcel->getActiveSheet()->setCellValue('G' . $fila , "C"); // NATURALEZA
					$objPHPExcel->getActiveSheet()->setCellValue('H' . $fila , $arrayCosto["numero_documento"]); // IDENTIDAD TERCERO
					$objPHPExcel->getActiveSheet()->setCellValue('I' . $fila , $Model->textContabilidad( $arrayCosto["nombre"] )); // NOMBRE TERCERO
					$fila++;
				}
			}

			header('Content-Type: application/vnd.ms-excel');
			header('Content-Disposition: attachment;filename="' . $nombre_archivo . '.xls"');
			header('Cache-Control: max-age=0');

			$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
			$objWriter->save('php://output');
			break;

		default:
			$_msg_error.= "Función no especificada";
			break;
	}

	$datafile["control"] = $_msg_control;
	if ( $_msg_error ) {
		$datafile["error"] = $_msg_error;
	}
	if ( $_array_result ) {
		$datafile["result"] = $_array_result;
	}

	echo json_encode($datafile);
	// print_r("<pre>");
	// print_r($datafile);
	// print_r("</pre>");

?>
