<?php
	include("../application/Config.php");
	include '../application/Conexion.php';

	$Data = new Consultas;

	$result["control"] = '';
	$result["content"] = Array();

	switch ( $_POST["accion"] ) {
		case 'detalle_informar_anticipo':
			$result["control"].= "Entro en detalle_informar_anticipo\n";
			$sql = '
				SELECT 
					caa.id, caa.numero_manifiesto, ca.id ID_AGRUPACION, ca.numero_agrupacion, cv.placa, cv.placa_trailer, cv.tipo_carroceria, ctv.nombre TIPO_VEHICULO, 
					cp.nombre, cp.contacto, cp.numero_documento, cp.celular, SUM(cam.peso) peso_total, 
					caa.flete, caa.anticipo, caa.porcentaje_anticipo, caa.metodo_desembolso
				FROM 
					cmx_agrupaciones ca 
					INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = ca.id 
					INNER JOIN cmx_agrupacion_anticipo caa ON caa.id_agrupacion = ca.id 
					INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cam.id_material_proyecto 
					INNER JOIN cmx_importacion_proyecto cip ON cip.id = cia.id_importacion 
					INNER JOIN cmx_agrupaciones_vehiculos cav ON cav.id_agrupacion = ca.id 
					INNER JOIN cmx_vehiculos cv ON cv.id = cav.id_vehiculo 
					INNER JOIN cmx_proveedores cp ON cp.id = cv.id_conductor 
					INNER JOIN cmx_tipo_vehiculos ctv ON ctv.id = cv.tipo_vehiculo 
				WHERE 
					ca.id = ' . $_POST["id"] . '
					AND cia.estado = 2 
					AND cia.nombre = "Informar asignación anticipo al conductor" 
					AND cav.estado IN ("Planillado","Anticipo Asignado") 
				GROUP BY ca.id
			';
			$request["info_anticipo"] = $Data->getConsulta($sql);
			if ( $request["info_anticipo"] ) {
				foreach ($request["info_anticipo"]["rowsData"] as $key => $value) {
					/********* Se toma la información del seguimiento *********/
					// Contenido del Título
					$result["content"]["title"] = 'Información del Anticipo del manifiesto - ' . $value["numero_manifiesto"];

					// Contenido de la información general del Seguimiento 
					$result["content"]["body"]["general"] = '
						<span><strong>Información General</strong></span>
						<table class="table">
							<tbody>
								<tr>
									<td class="cell-detail">
										<div class="col-sm-4">
											<span>Manifiesto:</span>
											<span class="cell-detail-description">' . $value["numero_manifiesto"] . '</span>
										</div>
										<div class="col-sm-4">
											<span>Agrupanción:</span>
											<span class="cell-detail-description">' . $value["numero_agrupacion"] . '</span>
										</div>
										<div class="col-sm-4">
											<span>Peso Total:</span>
											<span class="cell-detail-description">' . number_format($value["peso_total"], 2, ",", ".") . 'Kg.</span>
										</div>
									</td>
								</tr>
								<tr>
									<td class="cell-detail"></td>
								</tr>
							</tbody>
						</table>
					';

					// Contenido de la información general del Seguimiento 
					// Filtro de la placa del trailes si lo tiene 
					$_placa_trailer = '';
					if ( $value["placa_trailer"] ) {
						$_placa_trailer = '
							<span class="cell-detail-description">Trailer: ' . $value["placa_trailer"] . '</span>
						';
					}

					$_tipo_carroceria = '';
					if ( $value["placa_trailer"] ) {
						$_tipo_carroceria = '(' . $value["tipo_carroceria"] . ')';
					}

					$result["content"]["body"]["vehiculo"] = '
						<span><strong>Vehículo</strong></span>
						<table class="table">
							<tbody>
								<tr>
									<td class="cell-detail">
										<div class="col-sm-3"></div>
										<div class="col-sm-3">
											<span>Vehículo:</span>
											<span class="cell-detail-description">' . $value["placa"] . '</span>
											' . $_placa_trailer . '
											<span class="cell-detail-description">' . $value["TIPO_VEHICULO"] . '</span>
											' . $_tipo_carroceria . '
										</div>
										<div class="col-sm-3">
											<span>Conductor:</span>
											<span class="cell-detail-description">' . $value["nombre"] . '</span>
											<span class="cell-detail-description">Documento: ' . $value["numero_documento"] . '</span>
											<span class="cell-detail-description">Contacto: ' . $value["contacto"] . '</span>
										</div>
										<div class="col-sm-3"></div>
									</td>
								</tr>
								<tr>
									<td class="cell-detail"></td>
								</tr>
							</tbody>
						</table>
					';
					/********* Fin - Se toma la información del seguimiento *********/

					// Se busca la información de la solicitudes del agrupamiento
					$sql = '
						SELECT 
							cc.id, cc.nombre, CONCAT(cc.documento,"-",cc.digito_verificacion) DOCUMENTO, cc.direccion, CONCAT(cm.municipio," - (",cm.depto," - ",cm.pais,")") CIUDAD,
							cc.telefono
						FROM 
							cmx_solicitudes cs
							INNER JOIN cmx_agrupacion_solicitudes cas ON cs.id = cas.id_solicitud
							INNER JOIN cmx_agrupaciones ca ON cas.id_agrupacion = ca.id
							INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = ca.id
							INNER JOIN cmx_importacion_material cim ON cim.id = cam.id_material_proyecto
							INNER JOIN cmx_importacion_proyecto cip ON cip.id = cim.id_importacion
							INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
							INNER JOIN cmx_municipios cm ON cm.id = cc.ciudad
						WHERE 
							ca.id = ' . $_POST["id"] . '
						GROUP BY cip.id_cliente
					';
					$request["solicitudes"][ $_POST["id"] ] = $Data->getConsulta($sql);

					if ( $request["solicitudes"][ $_POST["id"] ] ) {
						$result["content"]["body"]["cliente"] = '<h3>Clientes</h3>';
						foreach ($request["solicitudes"][ $_POST["id"] ]["rowsData"] as $key_01 => $value_01) {

							// Se busca la información de la solicitud de acuerdo con el cliente 
							$sql = '
								SELECT 
									cs.id, cs.numero_solicitud, cas.peso_parcial
								FROM 
									cmx_solicitudes cs
									INNER JOIN cmx_agrupacion_solicitudes cas ON cs.id = cas.id_solicitud
									INNER JOIN cmx_agrupaciones ca ON cas.id_agrupacion = ca.id
									INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = ca.id
									INNER JOIN cmx_mercancia_solicitud cms ON cms.id_solicitud = cs.id
									INNER JOIN cmx_importacion_material cim ON cim.id = cam.id_material_proyecto AND cim.id = cms.id_material_proyecto
									INNER JOIN cmx_importacion_proyecto cip ON cip.id = cim.id_importacion
								WHERE 
									ca.id = ' . $_POST["id"] . '
									AND cip.id_cliente = ' . $value_01[0] . '
								GROUP BY cs.id
							';
							$request["solicitudes"][ $_POST["id"] ][ $value_01[0] ] = $Data->getConsulta($sql);

							if ( $request["solicitudes"][ $_POST["id"] ][ $value_01[0] ] ) {
								$_table_cliente = '';
								foreach ($request["solicitudes"][ $_POST["id"] ][ $value_01[0] ]["rowsData"] as $key_02 => $value_02) {

									// Se buscan los materiales de la solicitud
									$sql = '
										SELECT 
											cim.*,
											cam.peso
										FROM 
											cmx_agrupacion_solicitudes cas 
											INNER JOIN cmx_mercancia_solicitud cms ON cms.id_solicitud = cas.id_solicitud
											INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = cas.id_agrupacion
											INNER JOIN cmx_importacion_material cim ON cim.id = cam.id_material_proyecto AND cim.id = cms.id_material_proyecto
											INNER JOIN cmx_importacion_proyecto cip ON cip.id = cim.id_importacion
										WHERE 
											cip.id_cliente = ' . $value_01[0] . '
											AND cas.id_agrupacion = ' . $_POST["id"] . '
											AND cas.id_solicitud = ' . $value_02[0] . ';
									';
									$request["solicitudes"][ $_POST["id"] ][ $value_01[0] ][ $value_02[0] ] = $Data->getConsulta($sql);

									$_table_material = '';
									// Se llena la table de contenido de los materiales de la solicitud
									if ( $request["solicitudes"][ $_POST["id"] ][ $value_01[0] ][ $value_02[0] ] ) {
										foreach ($request["solicitudes"][ $_POST["id"] ][ $value_01[0] ][ $value_02[0] ]["rowsData"] as $key_03 => $value_03 ) {
											$_table_material.= '
												<tr>
													<td class="cell-detail">
														<span>' . $value_03["nombre"] . '</span>
														<span class="cell-detail-description">' . $value_03["codigo"] . '</span>
													</td>
													<td class="cell-detail">
														<span>UN ' . $value_03["codigoUN"] . '</span>
														<span class="cell-detail-description">Riesgo - ' . $value_03["rombos"] . '</span>
													</td>
													<td class="cell-detail">
														<span>' . $value_03["cantidad"] . ' Unid.</span>
													</td>
													<td class="cell-detail">
														<span>' . number_format($value_03["peso"], 2, ",", ".") . 'Kg.</span>
													</td>
												</tr>
											';
										}
									}

									$_table_cliente.= '
										<span><strong>Materiales de la Solicitud - ' . $value_02["numero_solicitud"] . '</strong></span>
										<table class="table">
											<thead>
												<tr class="nexos-encabezado">
													<th style="width: 55%;">Material</th>
													<th>Codigos</th>
													<th>Cantidad</th>
													<th>Peso</th>
												</tr>
											<thead>
											<tbody>
												' . $_table_material . '
											</tbody>
										</table>
									';
								}
							}

							$result["content"]["body"]["cliente"].= '
								<span><strong>' . $value_01["nombre"] . ' (' . $value_01["DOCUMENTO"] . ')</strong></span>
								<table class="table">
									<tbody>
										<tr>
											<td class="cell-detail">
												<div class="col-sm-4">
													<span>Dirección:</span>
													<span class="cell-detail-description">' . $value_01["direccion"] . '</span>
												</div>
												<div class="col-sm-4">
													<span>Ciudad:</span>
													<span class="cell-detail-description">' . $value_01["CIUDAD"] . '</span>
												</div>
												<div class="col-sm-4">
													<span>Teléfono:</span>
													<span class="cell-detail-description">' . $value_01["telefono"] . '</span>
												</div>
											</td>
										</tr>
										<tr>
											<td class="cell-detail">
												' . $_table_cliente . '
											</td>
										</tr>
									</tbody>
								</table>
							';
						}
					}
				}
			}
			break;

		case 'gestion_informar_anticipo':
			$result["control"].= "Entro en gestion_informar_anticipo\n";
			$sql = '
				SELECT 
					ca.id, ca.numero_agrupacion, 
					cv.placa, cv.placa_trailer, cv.tipo_carroceria, ctv.nombre TIPO_VEHICULO, cp.nombre, cp.numero_documento, cp.contacto, 
					SUM(cam.peso) peso_total,
					caa.numero_manifiesto, caa.flete, caa.anticipo, caa.anticipo, caa.porcentaje_anticipo, caa.metodo_desembolso, caa.pin_tarjeta, 
					caa.clave, caa.banco, caa.tipo_cuenta, caa.num_cuenta, caa.documento_titular, caa.nombre_titular, caa.numero_cheque, 
					caa.comprobante_egreso, caa.fecha_hora_transferencia
				FROM 
					cmx_agrupaciones ca
					INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = ca.id
					INNER JOIN cmx_agrupacion_anticipo caa ON caa.id_agrupacion = ca.id
					INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cam.id_material_proyecto
					INNER JOIN cmx_importacion_proyecto cip ON cip.id = cia.id_importacion
					INNER JOIN cmx_agrupaciones_vehiculos cav ON cav.id_agrupacion = ca.id
					INNER JOIN cmx_vehiculos cv ON cv.id = cav.id_vehiculo
					INNER JOIN cmx_proveedores cp ON cp.id = cv.id_conductor
					INNER JOIN cmx_tipo_vehiculos ctv ON ctv.id = cv.tipo_vehiculo
				WHERE 
					cia.estado = 2
					AND ca.id = ' . $_POST["id"] . '
					AND cia.nombre = "Informar asignación anticipo al conductor"
					AND cav.estado IN ("Planillado","Anticipo Asignado")
				GROUP BY ca.id
			';
			$request["agrupaciones"] = $Data->getConsulta($sql);
			if ( $request["agrupaciones"] ) {
				foreach ($request["agrupaciones"]["rowsData"] as $key => $value) {
					/********* Se toma la información del anticipo *********/
					// Contenido del Título
					$result["content"]["title"] = 'Gestión de la Asignación de Plan de Ruta - ' . $value["numero_manifiesto"];

					// Contenido de la información general del Anticipo 
					$result["content"]["body"]["general"] = '
						<span><strong>Información General</strong></span>
						<table class="table">
							<tbody>
								<tr>
									<td class="cell-detail">
										<div class="col-sm-2">
											<span>Manifiesto:</span>
											<span class="cell-detail-description">' . $value["numero_manifiesto"] . '</span>
										</div>
										<div class="col-sm-2">
											<span>Agrupanción:</span>
											<span class="cell-detail-description">' . $value["numero_agrupacion"] . '</span>
										</div>
										<div class="col-sm-2">
											<span>Peso Total:</span>
											<span class="cell-detail-description">' . number_format($value["peso_total"], 2, ",", ".") . 'Kg.</span>
										</div>
										<div class="col-sm-2">
											<span>Flete:</span>
											<span class="cell-detail-description">$' . number_format($value["flete"], 2, ",", ".") . '</span>
										</div>
										<div class="col-sm-2">
											<span>Anticipo:</span>
											<span class="cell-detail-description">$' . number_format($value["anticipo"], 2, ",", ".") . '</span>
										</div>
										<div class="col-sm-2">
											<span>%Desembolso:</span>
											<span class="cell-detail-description">' . $value["porcentaje_anticipo"] . '%</span>
										</div>
									</td>
								</tr>
								<tr>
									<td class="cell-detail"></td>
								</tr>
							</tbody>
						</table>
					';

					// Contenido de la información general del Anticipo 
					// Filtro de la placa del trailes si lo tiene 
					$_placa_trailer = '';
					if ( $value["placa_trailer"] ) {
						$_placa_trailer = '
							<span class="cell-detail-description">Trailer: ' . $value["placa_trailer"] . '</span>
						';
					}

					$_tipo_carroceria = '';
					if ( $value["placa_trailer"] ) {
						$_tipo_carroceria = '(' . $value["tipo_carroceria"] . ')';
					}

					$result["content"]["body"]["vehiculo"] = '
						<span><strong>Vehículo</strong></span>
						<table class="table">
							<tbody>
								<tr>
									<td class="cell-detail">
										<div class="col-sm-3"></div>
										<div class="col-sm-3">
											<span>Vehículo:</span>
											<span class="cell-detail-description">' . $value["placa"] . '</span>
											' . $_placa_trailer . '
											<span class="cell-detail-description">' . $value["TIPO_VEHICULO"] . '</span>
											' . $_tipo_carroceria . '
										</div>
										<div class="col-sm-3">
											<span>Conductor:</span>
											<span class="cell-detail-description">' . $value["nombre"] . '</span>
											<span class="cell-detail-description">Documento: ' . $value["numero_documento"] . '</span>
											<span class="cell-detail-description">Contacto: ' . $value["contacto"] . '</span>
										</div>
										<div class="col-sm-3"></div>
									</td>
								</tr>
								<tr>
									<td class="cell-detail"></td>
								</tr>
							</tbody>
						</table>
					';
					/********* Fin - Se toma la información del anticipo *********/

					/********* Se toma la información del anticipo *********/
					switch ( $value["metodo_desembolso"] ) {
						case 'Tarjeta Débito':
							$result["content"]["body"]["anticipo"] = '
								<span><strong>' . $value["metodo_desembolso"] . '</strong></span>
								<table class="table">
									<tbody>
										<tr>
											<td class="cell-detail">
												<div class="col-sm-1"></div>
												<div class="col-sm-4">
													<span>Comprobante de Egreso:</span>
													<span class="cell-detail-description">' . $value["comprobante_egreso"] . '</span>
												</div>
												<div class="col-sm-3">
													<span>Número de Tarjeta:</span>
													<span class="cell-detail-description">' . $value["pin_tarjeta"] . '</span>
												</div>
												<div class="col-sm-3">
													<span>Clave:</span>
													<span class="cell-detail-description">' . $value["clave"] . '</span>
												</div>
												<div class="col-sm-1"></div>
											</td>
										</tr>
										<tr>
											<td class="cell-detail"></td>
										</tr>
									</tbody>
								</table>
							';
							break;

						case 'Cuenta Personal':
							$result["content"]["body"]["anticipo"] = '
								<span><strong>' . $value["metodo_desembolso"] . '</strong></span>
								<table class="table">
									<tbody>
										<tr>
											<td class="cell-detail">
												<div class="col-sm-2"></div>
												<div class="col-sm-4">
													<span>Comprobante de Egreso:</span>
													<span class="cell-detail-description">' . $value["comprobante_egreso"] . '</span>
												</div>
												<div class="col-sm-4">
													<span>Entidad Bancaria:</span>
													<span class="cell-detail-description">' . $value["banco"] . '</span>
												</div>
												<div class="col-sm-2"></div>
												<div class="row"></div><br>
												<div class="col-sm-3">
													<span>Tipo Cuenta:</span>
													<span class="cell-detail-description">' . $value["tipo_cuenta"] . '</span>
												</div>
												<div class="col-sm-3">
													<span># Cuenta:</span>
													<span class="cell-detail-description">' . $value["num_cuenta"] . '</span>
												</div>
												<div class="col-sm-3">
													<span>Documento Titular:</span>
													<span class="cell-detail-description">' . $value["documento_titular"] . '</span>
												</div>
												<div class="col-sm-3">
													<span>Nombre del Titular:</span>
													<span class="cell-detail-description">' . $value["nombre_titular"] . '</span>
												</div>
											</td>
										</tr>
										<tr>
											<td class="cell-detail"></td>
										</tr>
									</tbody>
								</table>
							';
							break;

						case 'Cheque':
							$result["content"]["body"]["anticipo"] = '
								<span><strong>' . $value["metodo_desembolso"] . '</strong></span>
								<table class="table">
									<tbody>
										<tr>
											<td class="cell-detail">
												<div class="col-sm-2"></div>
												<div class="col-sm-4">
													<span>Comprobante de Egreso:</span>
													<span class="cell-detail-description">' . $value["comprobante_egreso"] . '</span>
												</div>
												<div class="col-sm-4">
													<span>Número de Cheque:</span>
													<span class="cell-detail-description">' . $value["numero_cheque"] . '</span>
												</div>
												<div class="col-sm-2"></div>
											</td>
										</tr>
										<tr>
											<td class="cell-detail"></td>
										</tr>
									</tbody>
								</table>
							';
							break;

						default:
							$result["content"]["body"]["anticipo"] = '<p class="text-danger"><strong>No exite información del desembolso del anticipo.</strong></p>';
							break;
					}
					/********* Fin - Se toma la información del anticipo *********/
				}
			}

			/***** SE BUSCAN LAS ACTIVIDADES DEL MÓDULO *****/
			$sql = '
				SELECT 
					cia.id
				FROM 
					cmx_agrupaciones ca
					INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = ca.id
					INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cam.id_material_proyecto
					INNER JOIN cmx_agrupaciones_vehiculos cav ON cav.id_agrupacion = ca.id
				WHERE 
					cia.estado = 2
					AND ca.id = ' . $_POST["id"] . '
					AND cia.nombre = "Informar asignación anticipo al conductor"
					AND cav.estado IN ("Planillado","Anticipo Asignado")
			';
			$request["actividades"] = $Data->getConsulta($sql);
			if ($request["actividades"]) {
				$id_actividades = "";
				foreach ($request["actividades"]["rowsData"] as $key => $value) {
					$id_actividades.= $value[0] . ",";
				}
				$result["actividades"] = $id_actividades;
			}
			break;

		case 'detalle_asignacion_ruta':
			$result["control"].= "Entro en detalle_asignacion_ruta\n";
			$sql = '
				SELECT 
					ca.id, ca.numero_agrupacion, caa.numero_manifiesto, 
					cv.placa, cv.placa_trailer, cv.tipo_carroceria, ctv.nombre TIPO_VEHICULO, cp.nombre, cp.numero_documento, cp.contacto, 
					SUM(cam.peso) peso_total,
					IF(
						(SELECT COUNT(cisr1.id) FROM cmx_importacion_seguimiento_rutas cisr1 WHERE cisr1.id_actividad = cia.id ) > 0,
						1,
						0
					) ULTIMO_SEGUIMIENTO,
					IF(
						(SELECT COUNT(cisr1.id) FROM cmx_importacion_seguimiento_rutas cisr1 WHERE cisr1.id_actividad = cia.id ) > 0,
						(SELECT MAX(cisr1.fecha_hora) FROM cmx_importacion_seguimiento_rutas cisr1 WHERE cisr1.id_actividad = cia.id),
						cia.fecha_hora_inicio
					) ULTIMO_SEGUIMIENTO_FECHA,
					IF(
						(SELECT COUNT(cisr1.id) FROM cmx_importacion_seguimiento_rutas cisr1 WHERE cisr1.id_actividad = cia.id ) > 0,
						(	SELECT cisr1.ubicacion 
							FROM cmx_importacion_seguimiento_rutas cisr1 
							WHERE 
								cisr1.id_actividad = cia.id 
								AND cisr1.id = (	SELECT MAX(cisr2.id) 
														FROM cmx_importacion_seguimiento_rutas cisr2 
														WHERE cisr2.id_actividad = cia.id) ),
						(	SELECT crd1.sigla
							FROM cmx_tramos_orden cto1
								INNER JOIN cmx_tramo_solicitud cts1 ON cts1.id = cto1.id_tramo
								INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cts1.id_remitente_destinatario
							WHERE cto1.orden = 1
								AND cto1.id_agrupacion = ca.id
						)
					) ULTIMO_SEGUIMIENTO_UBICACION,
					IF(
						(SELECT COUNT(cisr1.id) FROM cmx_importacion_seguimiento_rutas cisr1 WHERE cisr1.id_actividad = cia.id ) > 0,
						(	SELECT cisr1.tipo_seguimiento_ruta 
							FROM cmx_importacion_seguimiento_rutas cisr1 
							WHERE 
								cisr1.id_actividad = cia.id 
								AND cisr1.id = (	SELECT MAX(cisr2.id) 
														FROM cmx_importacion_seguimiento_rutas cisr2 
														WHERE cisr2.id_actividad = cia.id) ),
						"Sin iniciar ruta"
					) ULTIMO_SEGUIMIENTO_TIPO_SEGUIMIENTO,
					IF(
						(SELECT COUNT(cisr1.id) FROM cmx_importacion_seguimiento_rutas cisr1 WHERE cisr1.id_actividad = cia.id ) > 0,
						(	SELECT cisr1.observacion 
							FROM cmx_importacion_seguimiento_rutas cisr1 
							WHERE 
								cisr1.id_actividad = cia.id 
								AND cisr1.id = (	SELECT MAX(cisr2.id) 
														FROM cmx_importacion_seguimiento_rutas cisr2 
														WHERE cisr2.id_actividad = cia.id) ),
						"Sin iniciar ruta"
					) ULTIMO_SEGUIMIENTO_OBSERVACION,
					IF(
						(SELECT COUNT(cisr1.id) FROM cmx_importacion_seguimiento_rutas cisr1 WHERE cisr1.id_actividad = cia.id ) > 0,
						(	SELECT cisr1.observacion_interna 
							FROM cmx_importacion_seguimiento_rutas cisr1 
							WHERE 
								cisr1.id_actividad = cia.id 
								AND cisr1.id = (	SELECT MAX(cisr2.id) 
														FROM cmx_importacion_seguimiento_rutas cisr2 
														WHERE cisr2.id_actividad = cia.id) ),
						""
					) ULTIMO_SEGUIMIENTO_OBSERVACION_INTERNA
				FROM 
					cmx_agrupaciones ca
					INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = ca.id
					INNER JOIN cmx_agrupacion_anticipo caa ON caa.id_agrupacion = ca.id
					INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cam.id_material_proyecto
					INNER JOIN cmx_importacion_proyecto cip ON cip.id = cia.id_importacion
					INNER JOIN cmx_agrupaciones_vehiculos cav ON cav.id_agrupacion = ca.id
					INNER JOIN cmx_vehiculos cv ON cv.id = cav.id_vehiculo
					INNER JOIN cmx_proveedores cp ON cp.id = cv.id_conductor
					INNER JOIN cmx_tipo_vehiculos ctv ON ctv.id = cv.tipo_vehiculo
				WHERE 
					cia.estado = 2
					AND ca.id = ' . $_POST["id"] . '
					AND cia.nombre = "Asignación de plan de ruta"
					AND cav.estado IN ("Planillado","Anticipo Asignado")
				GROUP BY ca.id
			';
			$request["agrupaciones"] = $Data->getConsulta($sql);

			if ( $request["agrupaciones"] ) {
				foreach ($request["agrupaciones"]["rowsData"] as $key => $value) {
					/********* Se toma la información del seguimiento *********/
					// Contenido del Título
					$result["content"]["title"] = 'Información de la Asignación de Ruta - ' . $value["numero_manifiesto"];

					// Contenido de la información general del Seguimiento 
					$result["content"]["body"]["general"] = '
						<span><strong>Información General</strong></span>
						<table class="table">
							<tbody>
								<tr>
									<td class="cell-detail">
										<div class="col-sm-4">
											<span>Manifiesto:</span>
											<span class="cell-detail-description">' . $value["numero_manifiesto"] . '</span>
										</div>
										<div class="col-sm-4">
											<span>Agrupanción:</span>
											<span class="cell-detail-description">' . $value["numero_agrupacion"] . '</span>
										</div>
										<div class="col-sm-4">
											<span>Peso Total:</span>
											<span class="cell-detail-description">' . number_format($value["peso_total"], 2, ",", ".") . 'Kg.</span>
										</div>
									</td>
								</tr>
								<tr>
									<td class="cell-detail"></td>
								</tr>
							</tbody>
						</table>
					';

					// Contenido de la información general del Seguimiento 
					// Filtro de la placa del trailes si lo tiene 
					$_placa_trailer = '';
					if ( $value["placa_trailer"] ) {
						$_placa_trailer = '
							<span class="cell-detail-description">Trailer: ' . $value["placa_trailer"] . '</span>
						';
					}

					$_tipo_carroceria = '';
					if ( $value["placa_trailer"] ) {
						$_tipo_carroceria = '(' . $value["tipo_carroceria"] . ')';
					}

					$result["content"]["body"]["vehiculo"] = '
						<span><strong>Vehículo</strong></span>
						<table class="table">
							<tbody>
								<tr>
									<td class="cell-detail">
										<div class="col-sm-3"></div>
										<div class="col-sm-3">
											<span>Vehículo:</span>
											<span class="cell-detail-description">' . $value["placa"] . '</span>
											' . $_placa_trailer . '
											<span class="cell-detail-description">' . $value["TIPO_VEHICULO"] . '</span>
											' . $_tipo_carroceria . '
										</div>
										<div class="col-sm-3">
											<span>Conductor:</span>
											<span class="cell-detail-description">' . $value["nombre"] . '</span>
											<span class="cell-detail-description">Documento: ' . $value["numero_documento"] . '</span>
											<span class="cell-detail-description">Contacto: ' . $value["contacto"] . '</span>
										</div>
										<div class="col-sm-3"></div>
									</td>
								</tr>
								<tr>
									<td class="cell-detail"></td>
								</tr>
							</tbody>
						</table>
					';
					/********* Fin - Se toma la información del seguimiento *********/

					// Se busca la información de la solicitudes del agrupamiento
					$sql = '
						SELECT 
							cc.id, cc.nombre, CONCAT(cc.documento,"-",cc.digito_verificacion) DOCUMENTO, cc.direccion, CONCAT(cm.municipio," - (",cm.depto," - ",cm.pais,")") CIUDAD,
							cc.telefono
						FROM 
							cmx_solicitudes cs
							INNER JOIN cmx_agrupacion_solicitudes cas ON cs.id = cas.id_solicitud
							INNER JOIN cmx_agrupaciones ca ON cas.id_agrupacion = ca.id
							INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = ca.id
							INNER JOIN cmx_importacion_material cim ON cim.id = cam.id_material_proyecto
							INNER JOIN cmx_importacion_proyecto cip ON cip.id = cim.id_importacion
							INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
							INNER JOIN cmx_municipios cm ON cm.id = cc.ciudad
						WHERE 
							ca.id = ' . $value[0] . '
						GROUP BY cip.id_cliente
					';
					$request["solicitudes"][ $value[0] ] = $Data->getConsulta($sql);

					if ( $request["solicitudes"][ $value[0] ] ) {
						$result["content"]["body"]["cliente"] = '<h3>Clientes</h3>';
						foreach ($request["solicitudes"][ $value[0] ]["rowsData"] as $key_01 => $value_01) {

							// Se busca la información de la solicitud de acuerdo con el cliente 
							$sql = '
								SELECT 
									cs.id, cs.numero_solicitud, cas.peso_parcial
								FROM 
									cmx_solicitudes cs
									INNER JOIN cmx_agrupacion_solicitudes cas ON cs.id = cas.id_solicitud
									INNER JOIN cmx_agrupaciones ca ON cas.id_agrupacion = ca.id
									INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = ca.id
									INNER JOIN cmx_mercancia_solicitud cms ON cms.id = cam.id_material
									INNER JOIN cmx_importacion_material cim ON cim.id = cms.id_material_proyecto
									INNER JOIN cmx_importacion_proyecto cip ON cip.id = cim.id_importacion
								WHERE 
									ca.id = ' . $value[0] . '
									AND cip.id_cliente = ' . $value_01[0] . '
								GROUP BY cs.id
							';
							$request["solicitudes"][ $value[0] ][ $value_01[0] ] = $Data->getConsulta($sql);

							if ( $request["solicitudes"][ $value[0] ][ $value_01[0] ] ) {
								$_table_cliente = '';
								foreach ($request["solicitudes"][ $value[0] ][ $value_01[0] ]["rowsData"] as $key_02 => $value_02) {

									// Se buscan los materiales de la solicitud
									$sql = '
										SELECT 
											cim.*,
											cam.peso
										FROM 
											cmx_solicitudes cs
											INNER JOIN cmx_agrupacion_solicitudes cas ON cs.id = cas.id_solicitud
											INNER JOIN cmx_agrupaciones ca ON cas.id_agrupacion = ca.id
											INNER JOIN cmx_mercancia_solicitud cms ON cms.id_solicitud = cs.id
											INNER JOIN cmx_agrupacion_material cam ON cam.id_material = cms.id AND cam.id_agrupamiento = ca.id
											INNER JOIN cmx_importacion_material cim ON cim.id = cam.id_material_proyecto
											INNER JOIN cmx_importacion_proyecto cip ON cip.id = cim.id_importacion
										WHERE 
											cip.id_cliente = ' . $value_01[0] . '
											AND cas.id_agrupacion = ' . $value[0] . '
											AND cas.id_solicitud = ' . $value_02[0] . ';
									';
									$request["solicitudes"][ $value[0] ][ $value_01[0] ][ $value_02[0] ] = $Data->getConsulta($sql);
									$_table_material = '';
									// Se llena la table de contenido de los materiales de la solicitud
									if ( $request["solicitudes"][ $value[0] ][ $value_01[0] ][ $value_02[0] ] ) {
										foreach ($request["solicitudes"][ $value[0] ][ $value_01[0] ][ $value_02[0] ]["rowsData"] as $key_03 => $value_03 ) {
											$_table_material.= '
												<tr>
													<td class="cell-detail">
														<span>' . $value_03["nombre"] . '</span>
														<span class="cell-detail-description">' . $value_03["codigo"] . '</span>
													</td>
													<td class="cell-detail">
														<span>UN ' . $value_03["codigoUN"] . '</span>
														<span class="cell-detail-description">Riesgo - ' . $value_03["rombos"] . '</span>
													</td>
													<td class="cell-detail">
														<span>' . $value_03["cantidad"] . ' Unid.</span>
													</td>
													<td class="cell-detail">
														<span>' . number_format($value_03["peso"], 2, ",", ".") . 'Kg.</span>
													</td>
												</tr>
											';
										}
									}

									$_table_cliente.= '
										<span><strong>Materiales de la Solicitud - ' . $value_02["numero_solicitud"] . '</strong></span>
										<table class="table">
											<thead>
												<tr class="nexos-encabezado">
													<th style="width: 55%;">Material</th>
													<th>Codigos</th>
													<th>Cantidad</th>
													<th>Peso</th>
												</tr>
											<thead>
											<tbody>
												' . $_table_material . '
											</tbody>
										</table>
									';
								}
							}

							$result["content"]["body"]["cliente"].= '
								<span><strong>' . $value_01["nombre"] . ' (' . $value_01["DOCUMENTO"] . ')</strong></span>
								<table class="table">
									<tbody>
										<tr>
											<td class="cell-detail">
												<div class="col-sm-4">
													<span>Dirección:</span>
													<span class="cell-detail-description">' . $value_01["direccion"] . '</span>
												</div>
												<div class="col-sm-4">
													<span>Ciudad:</span>
													<span class="cell-detail-description">' . $value_01["CIUDAD"] . '</span>
												</div>
												<div class="col-sm-4">
													<span>Teléfono:</span>
													<span class="cell-detail-description">' . $value_01["telefono"] . '</span>
												</div>
											</td>
										</tr>
										<tr>
											<td class="cell-detail">
												' . $_table_cliente . '
											</td>
										</tr>
									</tbody>
								</table>
							';
						}
					}
				}
			}
			break;

		case 'gestion_asignacion_ruta':
			$result["control"].= "Entro en gestion_asignacion_ruta\n";
			$sql = '
				SELECT 
					ca.id, ca.numero_agrupacion, caa.numero_manifiesto, 
					cv.placa, cv.placa_trailer, cv.tipo_carroceria, ctv.nombre TIPO_VEHICULO, cp.nombre, cp.numero_documento, cp.contacto, 
					SUM(cam.peso) peso_total
				FROM 
					cmx_agrupaciones ca
					INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = ca.id
					INNER JOIN cmx_agrupacion_anticipo caa ON caa.id_agrupacion = ca.id
					INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cam.id_material_proyecto
					INNER JOIN cmx_importacion_proyecto cip ON cip.id = cia.id_importacion
					INNER JOIN cmx_agrupaciones_vehiculos cav ON cav.id_agrupacion = ca.id
					INNER JOIN cmx_vehiculos cv ON cv.id = cav.id_vehiculo
					INNER JOIN cmx_proveedores cp ON cp.id = cv.id_conductor
					INNER JOIN cmx_tipo_vehiculos ctv ON ctv.id = cv.tipo_vehiculo
				WHERE 
					cia.estado = 2
					AND ca.id = ' . $_POST["id"] . '
					AND cia.nombre = "Asignación de plan de ruta"
					AND cav.estado IN ("Planillado","Anticipo Asignado")
				GROUP BY ca.id
			';
			$request["agrupaciones"] = $Data->getConsulta($sql);
			if ( $request["agrupaciones"] ) {
				foreach ($request["agrupaciones"]["rowsData"] as $key => $value) {
					/********* Se toma la información del seguimiento *********/
					// Contenido del Título
					$result["content"]["title"] = 'Gestión de la Asignación de Plan de Ruta - ' . $value["numero_manifiesto"];

					// Contenido de la información general del Seguimiento 
					$result["content"]["body"]["general"] = '
						<span><strong>Información General</strong></span>
						<table class="table">
							<tbody>
								<tr>
									<td class="cell-detail">
										<div class="col-sm-4">
											<span>Manifiesto:</span>
											<span class="cell-detail-description">' . $value["numero_manifiesto"] . '</span>
										</div>
										<div class="col-sm-4">
											<span>Agrupanción:</span>
											<span class="cell-detail-description">' . $value["numero_agrupacion"] . '</span>
										</div>
										<div class="col-sm-4">
											<span>Peso Total:</span>
											<span class="cell-detail-description">' . number_format($value["peso_total"], 2, ",", ".") . 'Kg.</span>
										</div>
									</td>
								</tr>
								<tr>
									<td class="cell-detail"></td>
								</tr>
							</tbody>
						</table>
					';

					// Contenido de la información general del Seguimiento 
					// Filtro de la placa del trailes si lo tiene 
					$_placa_trailer = '';
					if ( $value["placa_trailer"] ) {
						$_placa_trailer = '
							<span class="cell-detail-description">Trailer: ' . $value["placa_trailer"] . '</span>
						';
					}

					$_tipo_carroceria = '';
					if ( $value["placa_trailer"] ) {
						$_tipo_carroceria = '(' . $value["tipo_carroceria"] . ')';
					}

					$result["content"]["body"]["vehiculo"] = '
						<span><strong>Vehículo</strong></span>
						<table class="table">
							<tbody>
								<tr>
									<td class="cell-detail">
										<div class="col-sm-3"></div>
										<div class="col-sm-3">
											<span>Vehículo:</span>
											<span class="cell-detail-description">' . $value["placa"] . '</span>
											' . $_placa_trailer . '
											<span class="cell-detail-description">' . $value["TIPO_VEHICULO"] . '</span>
											' . $_tipo_carroceria . '
										</div>
										<div class="col-sm-3">
											<span>Conductor:</span>
											<span class="cell-detail-description">' . $value["nombre"] . '</span>
											<span class="cell-detail-description">Documento: ' . $value["numero_documento"] . '</span>
											<span class="cell-detail-description">Contacto: ' . $value["contacto"] . '</span>
										</div>
										<div class="col-sm-3"></div>
									</td>
								</tr>
								<tr>
									<td class="cell-detail"></td>
								</tr>
							</tbody>
						</table>
					';
					/********* Fin - Se toma la información del seguimiento *********/
				}

				// Se cuenta cuantos tramos tiene el agrupamiento
				$sql = '
					SELECT 
						COUNT(cts.id) CUANTOS
					FROM 
						cmx_municipios cm
						INNER JOIN cmx_remitente_destinatario crd ON crd.id_ciudad = cm.id
						INNER JOIN cmx_tramo_solicitud cts ON cts.id_remitente_destinatario = crd.id
						INNER JOIN cmx_agrupacion_solicitudes cas ON cas.id_solicitud = cts.id_solicitud
					WHERE 
						cas.id_agrupacion = ' . $_POST["id"] . '
				';
				$request_01 = $Data->getConsulta($sql);
				$cuantos_tramos = $request_01["rowsData"][0]["CUANTOS"];

				// Tomo el id de la ciudad del primer tramo del agrupamiento 
				$id_ciudad_origen = buscaIdCiudadPlanRuta( $Data, $_POST["id"], 1 );

				// Tomo el id de la ciudad del último tramo del agrupamiento 
				$id_ciudad_destino = buscaIdCiudadPlanRuta( $Data, $_POST["id"], $cuantos_tramos );

				// Se genera el select de los planes de ruta disponibles para el agrupamiento 
				$result["content"]["body"]["slct_planes_ruta"] = slctPlanRuta( $Data, $id_ciudad_origen, $id_ciudad_destino );

				$result["content"]["body"]["tramos"] = listaTramosAgrupacion( $Data, $_POST["id"] );
			}
			/***** SE BUSCAN LAS ACTIVIDADES DEL MÓDULO *****/
			$sql = '

				SELECT 
					cia.id
				FROM 
					cmx_agrupaciones ca
					INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = ca.id
					INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cam.id_material_proyecto
					INNER JOIN cmx_agrupaciones_vehiculos cav ON cav.id_agrupacion = ca.id
				WHERE 
					cia.estado = 2
					AND ca.id = ' . $_POST["id"] . '
					AND cia.nombre = "Asignación de plan de ruta"
					AND cav.estado IN ("Planillado","Anticipo Asignado")
			';
			$request["actividades"] = $Data->getConsulta($sql);
			if ($request["actividades"]) {
				$id_actividades = "";
				foreach ($request["actividades"]["rowsData"] as $key => $value) {
					$id_actividades.= $value[0] . ",";
				}
				$result["actividades"] = $id_actividades;
			}
			break;

		case 'slct_origen_carga':
			$result["control"].= "Entro en slct_origen_carga\n";
			$sql = '
				SELECT 
					cts.id, crd.sigla ORIGEN, crd.direccion, CONCAT(cm.municipio, " (",cm.depto," - ", cm.pais, ")") MUNICIPIO
				FROM 
					cmx_tramo_solicitud cts
					INNER JOIN cmx_remitente_destinatario crd ON crd.id = cts.id_remitente_destinatario
					INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
				WHERE 
					cts.id_solicitud = ' . $_POST["id"] . '
					AND cts.tipo_operacion = "Cargue"
					AND cts.estado = 2
			';
			$request = $Data->getConsulta($sql);

			$select = '
				<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible">
					<div class="icon">
						<span class="mdi mdi-alert-triangle"></span>
					</div>
					<div class="message">
						<strong>Atención!</strong>
						<p>No se encontró tramos de carga en esta solicitud...</p>
					</div>
				</div>
			';

			if ( $request ) {
				$select = '
					<label>(*) Tramo Origen</label>
					<select class="form-control input-sm" name="id_origen" id="slct_origen" aria-hidden="true">
				';
				$select.= '<option value="" selected disabled>Seleccione</option>';
				foreach ($request["rowsData"] as $key => $value) {
					$select.= '<option value="' . $value[0] . '">' . $value["ORIGEN"] . ' ' . $value["direccion"] . ' | ' . $value["MUNICIPIO"] . '</option>';
				}
				$select.= '</select>';
			}
			$result["content"]["select"] = $select;
			break;

		case 'detalle_seguimiento_cargue':
			$result["control"].= "Entro en detalle_seguimiento_cargue\n";
			$sql = '
				SELECT 
					ca.id, ca.numero_agrupacion, 
					cv.placa, cv.placa_trailer, cv.tipo_carroceria, ctv.nombre TIPO_VEHICULO, cp.nombre, cp.numero_documento, cp.contacto, 
					SUM(cam.peso) peso_total
				FROM 
					cmx_agrupaciones ca
					INNER JOIN cmx_agrupacion_solicitudes cas ON cas.id_agrupacion = ca.id
					INNER JOIN cmx_mercancia_solicitud cms ON cms.id_solicitud = cas.id_solicitud
					INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = ca.id
					INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cam.id_material_proyecto AND cia.id_material = cms.id_material_proyecto
					INNER JOIN cmx_importacion_proyecto cip ON cip.id = cia.id_importacion
					INNER JOIN cmx_agrupaciones_vehiculos cav ON cav.id_agrupacion = ca.id
					INNER JOIN cmx_vehiculos cv ON cv.id = cav.id_vehiculo
					INNER JOIN cmx_proveedores cp ON cp.id = cv.id_conductor
					INNER JOIN cmx_tipo_vehiculos ctv ON ctv.id = cv.tipo_vehiculo
				WHERE 
					cia.estado = 2
					AND ca.id = ' . $_POST["id_agrupamiento"] . '
					AND cas.id_solicitud = ' . $_POST["id"] . '
					AND cia.tipo_actividad = "carga_inicial"
					AND cav.estado = "Aprobado"
				GROUP BY ca.id
			';
			$request["agrupaciones"] = $Data->getConsulta($sql);

			if ( $request["agrupaciones"] ) {
				foreach ($request["agrupaciones"]["rowsData"] as $key => $value) {
					/********* Se toma la información del seguimiento *********/
					// Contenido del Título
					$result["content"]["title"] = 'Información del Seguimiento de Descarga - ' . $value["numero_agrupacion"];

					// Contenido de la información general del Seguimiento 
					$result["content"]["body"]["general"] = '
						<span><strong>Información General</strong></span>
						<table class="table">
							<tbody>
								<tr>
									<td class="cell-detail">
										<div class="col-sm-6">
											<span>Agrupanción:</span>
											<span class="cell-detail-description">' . $value["numero_agrupacion"] . '</span>
										</div>
										<div class="col-sm-6">
											<span>Peso Total:</span>
											<span class="cell-detail-description">' . number_format($value["peso_total"], 2, ",", ".") . 'Kg.</span>
										</div>
									</td>
								</tr>
								<tr>
									<td class="cell-detail"></td>
								</tr>
							</tbody>
						</table>
					';

					// Contenido de la información general del Seguimiento 
					// Filtro de la placa del trailes si lo tiene 
					$_placa_trailer = '';
					if ( $value["placa_trailer"] ) {
						$_placa_trailer = '
							<span class="cell-detail-description">Trailer: ' . $value["placa_trailer"] . '</span>
						';
					}

					$_tipo_carroceria = '';
					if ( $value["placa_trailer"] ) {
						$_tipo_carroceria = '(' . $value["tipo_carroceria"] . ')';
					}

					$result["content"]["body"]["vehiculo"] = '
						<span><strong>Vehículo</strong></span>
						<table class="table">
							<tbody>
								<tr>
									<td class="cell-detail">
										<div class="col-sm-3"></div>
										<div class="col-sm-3">
											<span>Vehículo:</span>
											<span class="cell-detail-description">' . $value["placa"] . '</span>
											' . $_placa_trailer . '
											<span class="cell-detail-description">' . $value["TIPO_VEHICULO"] . '</span>
											' . $_tipo_carroceria . '
										</div>
										<div class="col-sm-3">
											<span>Conductor:</span>
											<span class="cell-detail-description">' . $value["nombre"] . '</span>
											<span class="cell-detail-description">Documento: ' . $value["numero_documento"] . '</span>
											<span class="cell-detail-description">Contacto: ' . $value["contacto"] . '</span>
										</div>
										<div class="col-sm-3"></div>
									</td>
								</tr>
								<tr>
									<td class="cell-detail"></td>
								</tr>
							</tbody>
						</table>
					';

					/********* Fin - Se toma la información del seguimiento *********/

					// Se busca la información de la solicitudes del agrupamiento
					$sql = '
						SELECT 
							cc.id, cc.nombre, CONCAT(cc.documento,"-",cc.digito_verificacion) DOCUMENTO, cc.direccion, CONCAT(cm.municipio," - (",cm.depto," - ",cm.pais,")") CIUDAD,
							cc.telefono
						FROM 
							cmx_solicitudes cs
							INNER JOIN cmx_agrupacion_solicitudes cas ON cs.id = cas.id_solicitud
							INNER JOIN cmx_agrupaciones ca ON cas.id_agrupacion = ca.id
							INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = ca.id
							INNER JOIN cmx_mercancia_solicitud cms ON cms.id_solicitud = cs.id
							INNER JOIN cmx_importacion_material cim ON cim.id = cam.id_material_proyecto AND cim.id = cms.id_material_proyecto
							INNER JOIN cmx_importacion_proyecto cip ON cip.id = cim.id_importacion
							INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
							INNER JOIN cmx_municipios cm ON cm.id = cc.ciudad
						WHERE 
							ca.id = ' . $value[0] . '
							AND cs.id = ' . $_POST["id"] . '
						GROUP BY cip.id_cliente;
					';
					$request["solicitudes"][ $value[0] ] = $Data->getConsulta($sql);

					if ( $request["solicitudes"][ $value[0] ] ) {
						$result["content"]["body"]["cliente"] = '<h3>Clientes</h3>';
						foreach ($request["solicitudes"][ $value[0] ]["rowsData"] as $key_01 => $value_01) {

							// Se busca la información de la solicitud de acuerdo con el cliente 
							$sql = '
								SELECT 
									cs.id, cs.numero_solicitud, cas.peso_parcial
								FROM 
									cmx_solicitudes cs
									INNER JOIN cmx_agrupacion_solicitudes cas ON cs.id = cas.id_solicitud
									INNER JOIN cmx_agrupaciones ca ON cas.id_agrupacion = ca.id
									INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = ca.id
									INNER JOIN cmx_mercancia_solicitud cms ON cms.id_solicitud = cs.id
									INNER JOIN cmx_importacion_material cim ON cim.id = cam.id_material_proyecto AND cim.id = cms.id_material_proyecto
									INNER JOIN cmx_importacion_proyecto cip ON cip.id = cim.id_importacion
								WHERE 
									ca.id = ' . $value[0] . '
									AND cip.id_cliente = ' . $value_01[0] . '
								GROUP BY cs.id;
							';
							$request["solicitudes"][ $value[0] ][ $value_01[0] ] = $Data->getConsulta($sql);

							if ( $request["solicitudes"][ $value[0] ][ $value_01[0] ] ) {
								$_table_cliente = '';
								foreach ($request["solicitudes"][ $value[0] ][ $value_01[0] ]["rowsData"] as $key_02 => $value_02) {

									// Se buscan los materiales de la solicitud
									$sql = '
										SELECT 
											cim.*,
											cam.peso
										FROM 
											cmx_agrupacion_solicitudes cas 
											INNER JOIN cmx_mercancia_solicitud cms ON cms.id_solicitud = cas.id_solicitud
											INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = cas.id_agrupacion
											INNER JOIN cmx_importacion_material cim ON cim.id = cam.id_material_proyecto AND cim.id = cms.id_material_proyecto
											INNER JOIN cmx_importacion_proyecto cip ON cip.id = cim.id_importacion
										WHERE 
											cip.id_cliente = ' . $value_01[0] . '
											AND cas.id_agrupacion = ' . $value[0] . '
											AND cas.id_solicitud = ' . $value_02[0] . ';
									';
									$request["solicitudes"][ $value[0] ][ $value_01[0] ][ $value_02[0] ] = $Data->getConsulta($sql);
									$_table_material = '';
									// Se llena la table de contenido de los materiales de la solicitud
									if ( $request["solicitudes"][ $value[0] ][ $value_01[0] ][ $value_02[0] ] ) {
										foreach ($request["solicitudes"][ $value[0] ][ $value_01[0] ][ $value_02[0] ]["rowsData"] as $key_03 => $value_03 ) {
											$_table_material.= '
												<tr>
													<td class="cell-detail">
														<span>' . $value_03["nombre"] . '</span>
														<span class="cell-detail-description">' . $value_03["codigo"] . '</span>
													</td>
													<td class="cell-detail">
														<span>UN ' . $value_03["codigoUN"] . '</span>
														<span class="cell-detail-description">Riesgo - ' . $value_03["rombos"] . '</span>
													</td>
													<td class="cell-detail">
														<span>' . $value_03["cantidad"] . ' Unid.</span>
													</td>
													<td class="cell-detail">
														<span>' . number_format($value_03["peso"], 2, ",", ".") . 'Kg.</span>
													</td>
												</tr>
											';
										}
									}

									$_table_cliente.= '
										<span><strong>Materiales de la Solicitud - ' . $value_02["numero_solicitud"] . '</strong></span>
										<table class="table">
											<thead>
												<tr class="nexos-encabezado">
													<th style="width: 55%;">Material</th>
													<th>Códigos</th>
													<th>Cantidad</th>
													<th>Peso</th>
												</tr>
											<thead>
											<tbody>
												' . $_table_material . '
											</tbody>
										</table>
									';
								}
							}

							$result["content"]["body"]["cliente"].= '
								<span><strong>' . $value_01["nombre"] . ' (' . $value_01["DOCUMENTO"] . ')</strong></span>
								<table class="table">
									<tbody>
										<tr>
											<td class="cell-detail">
												<div class="col-sm-4">
													<span>Dirección:</span>
													<span class="cell-detail-description">' . $value_01["direccion"] . '</span>
												</div>
												<div class="col-sm-4">
													<span>Ciudad:</span>
													<span class="cell-detail-description">' . $value_01["CIUDAD"] . '</span>
												</div>
												<div class="col-sm-4">
													<span>Teléfono:</span>
													<span class="cell-detail-description">' . $value_01["telefono"] . '</span>
												</div>
											</td>
										</tr>
										<tr>
											<td class="cell-detail">
												' . $_table_cliente . '
											</td>
										</tr>
									</tbody>
								</table>
							';
						}
					}
				}
			}

			// Se busca si el agrupamiento tiene seguimientos 
			$result["content"]["body"]["seguimientos"] = '
				<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible">
					<div class="icon">
						<span class="mdi mdi-alert-triangle"></span>
					</div>
					<div class="message">
						<strong>Atención!</strong>
						<p>No se han registrado seguimientos en esta solicitud...</p>
					</div>
				</div>
			';

			if ( isset( $_POST["id_actividad_seguimiento"] ) ) {
				$sql = '
					SELECT
						cisc.*,
						IF(
							cisc.id_tramo,
							(	SELECT CONCAT(TRIM(crd1.sigla), " ", TRIM(crd1.direccion), " | ",cm1.municipio, " (",cm1.depto," - ", cm1.pais, ")")
								FROM cmx_tramo_solicitud cts1
									INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cts1.id_remitente_destinatario
									INNER JOIN cmx_municipios cm1 ON cm1.id = crd1.id_ciudad
								WHERE cts1.id = cisc.id_tramo
							),
							NULL
						) TRAMO,
						cu.nom_usuario, cu.url_avatar
					FROM
						cmx_importacion_seguimiento_cargue cisc
						INNER JOIN cmx_usuarios cu ON cu.id = cisc.autor
					WHERE 
						cisc.id_actividad = ' . $_POST["id_actividad_seguimiento"] . '
					ORDER BY cisc.fecha_hora DESC;
				';
				$request["seguimientos"] = $Data->getConsulta($sql);

				$_table_seguimientos = '';
				foreach ($request["seguimientos"]["rowsData"] as $key => $value) {
					$_finalizacion = '';
					if ($value["fecha_hora_finalizacion"] != "0000-00-00 00:00:00") {
						$_finalizacion = $value["fecha_hora_finalizacion"];
					}
					$_table_seguimientos.= '
						<tr>
							<td class="user-avatar cell-detail user-info">
								<img src="' . BASE_URL . 'public/img/users/' . $value["url_avatar"] . '">
								<span>' . $value["nom_usuario"] . '</span>
								<span class="cell-detail-description">' . $value["fecha_hora"] . '</span>
							</td>
							<td class="cell-detail">
								<span>' . $value["tipo_seguimiento"] . ' <strong>' . $_finalizacion . '</strong></span>
								<span class="cell-detail-description"><strong>' . $value["TRAMO"] . '</strong></span>
							</td>
							<td class="cell-detail">
								<span class="cell-detail">' . $value["observacion"] . '</span>
								<span class="cell-detail-description" style="color: #ea4335;">' . $value["observacion_interna"] . '</span>
							</td>
						</tr>
					';
				}

				$result["content"]["body"]["seguimientos"] = '
					<h3>Seguimientos</h3>
					<div class="col-xs-12">
						<span><strong>Gestión Realizada</strong></span>
						<table class="table table-striped table-condensed">
							<thead>
								<tr class="nexos-encabezado">
									<th class="col-md-3">Autor</th>
									<th class="col-md-4">Seguimiento</th>
									<th class="col-md-5">Observación</th>
								</tr>
							</thead>
							<tbody>
								' . $_table_seguimientos . '
							</tbody>
						</table>
					</div>
				';
			}
			
			break;

		case 'busca_ruta_agrupamiento':
			$result["control"].= "Entro en busca_ruta_agrupamiento\n";
			$sql = '
				SELECT 
					cmrc.orden,
					cpc.*
				FROM 
					cmx_agrupaciones ca
					INNER JOIN cmx_mapas_ruta cmr ON cmr.id = ca.id_mapa_ruta
					INNER JOIN cmx_mapas_ruta_control cmrc ON cmrc.id_mapa_ruta = cmr.id
					INNER JOIN cmx_puntos_control cpc ON cpc.id = cmrc.id_punto_control
				WHERE 
					ca.estado = 1
					AND ca.id = ' . $_POST["id"] . '
				ORDER BY cmrc.orden
			';
			$request = $Data->getConsulta($sql);

			if ( $request ) {
				$i = 0;
				foreach ($request["rowsData"] as $key => $value) {
					$arrayPuntosControl[ $i ] = Array(
						"orden" => $value["orden"],
						"tipo_punto" => $value["tipo_punto"],
						"nombre" => $value["nombre"],
						"ubicacion" => $value["ubicacion"],
						"latitud" => $value["latitud"],
						"longitud" => $value["longitud"],
						"contacto" => $value["contacto"],
						"telefono" => $value["telefono"],
					);
					$i++;
				}
			}
			$result["ruta_control"] = $arrayPuntosControl;

			// Se busca el cuantos tramos existen
			$sql = '
				SELECT 
					COUNT(cts1.id) CUANTOS
				FROM 
					cmx_municipios cm1
					INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id_ciudad = cm1.id
					INNER JOIN cmx_tramo_solicitud cts1 ON cts1.id_remitente_destinatario = crd1.id
					INNER JOIN cmx_agrupacion_solicitudes cas1 ON cas1.id_solicitud = cts1.id_solicitud
				WHERE 
					cas1.id_agrupacion = ' . $_POST["id"] . '
			';
			$request = $Data->getConsulta($sql);

			$cuantos_tramos = $request["rowsData"][0]["CUANTOS"];

			// se busca la informacion del origen
			$sql = '
				SELECT 
					crd1.*
				FROM 
					cmx_remitente_destinatario crd1 
					INNER JOIN cmx_tramo_solicitud cts1 ON cts1.id_remitente_destinatario = crd1.id
					INNER JOIN cmx_tramos_orden cto1 ON cto1.id_tramo = cts1.id
				WHERE 
					cto1.orden = 1
					AND cto1.id_agrupacion = ' . $_POST["id"] . '
			';
			$request = $Data->getConsulta($sql);

			$result["origen"] = $request["rowsData"];

			// se busca la informacion del origen
			$sql = '
				SELECT 
					crd1.*
				FROM 
					cmx_remitente_destinatario crd1 
					INNER JOIN cmx_tramo_solicitud cts1 ON cts1.id_remitente_destinatario = crd1.id
					INNER JOIN cmx_tramos_orden cto1 ON cto1.id_tramo = cts1.id
				WHERE 
					cto1.orden = ' . $cuantos_tramos . '
					AND cto1.id_agrupacion = ' . $_POST["id"] . '
			';
			$request = $Data->getConsulta($sql);

			$result["destino"] = $request["rowsData"];
			break;

		case 'detalle_seguimiento_ruta':
			$result["control"].= "Entro en detalle_seguimiento_ruta\n";
			$sql = '
				SELECT 
					ca.id, ca.numero_agrupacion, caa.numero_manifiesto, 
					cv.placa, cv.placa_trailer, cv.tipo_carroceria, ctv.nombre TIPO_VEHICULO, cp.nombre, cp.numero_documento, cp.contacto, cp.celular,
					SUM(cam.peso) peso_total,
					IF(
						(SELECT COUNT(cisr1.id) FROM cmx_importacion_seguimiento_rutas cisr1 WHERE cisr1.id_actividad = cia.id ) > 0,
						1,
						0
					) ULTIMO_SEGUIMIENTO,
					IF(
						(SELECT COUNT(cisr1.id) FROM cmx_importacion_seguimiento_rutas cisr1 WHERE cisr1.id_actividad = cia.id ) > 0,
						(SELECT MAX(cisr1.fecha_hora) FROM cmx_importacion_seguimiento_rutas cisr1 WHERE cisr1.id_actividad = cia.id),
						cia.fecha_hora_inicio
					) ULTIMO_SEGUIMIENTO_FECHA,
					IF(
						(SELECT COUNT(cisr1.id) FROM cmx_importacion_seguimiento_rutas cisr1 WHERE cisr1.id_actividad = cia.id ) > 0,
						(	SELECT cisr1.ubicacion 
							FROM cmx_importacion_seguimiento_rutas cisr1 
							WHERE 
								cisr1.id_actividad = cia.id 
								AND cisr1.id = (	SELECT MAX(cisr2.id) 
														FROM cmx_importacion_seguimiento_rutas cisr2 
														WHERE cisr2.id_actividad = cia.id) ),
						(	SELECT crd1.sigla
							FROM cmx_tramos_orden cto1
								INNER JOIN cmx_tramo_solicitud cts1 ON cts1.id = cto1.id_tramo
								INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cts1.id_remitente_destinatario
							WHERE cto1.orden = 1
								AND cto1.id_agrupacion = 1
						)
					) ULTIMO_SEGUIMIENTO_UBICACION,
					IF(
						(SELECT COUNT(cisr1.id) FROM cmx_importacion_seguimiento_rutas cisr1 WHERE cisr1.id_actividad = cia.id ) > 0,
						(	SELECT cisr1.tipo_seguimiento_ruta 
							FROM cmx_importacion_seguimiento_rutas cisr1 
							WHERE 
								cisr1.id_actividad = cia.id 
								AND cisr1.id = (	SELECT MAX(cisr2.id) 
														FROM cmx_importacion_seguimiento_rutas cisr2 
														WHERE cisr2.id_actividad = cia.id) ),
						"Sin iniciar ruta"
					) ULTIMO_SEGUIMIENTO_TIPO_SEGUIMIENTO,
					IF(
						(SELECT COUNT(cisr1.id) FROM cmx_importacion_seguimiento_rutas cisr1 WHERE cisr1.id_actividad = cia.id ) > 0,
						(	SELECT cisr1.observacion 
							FROM cmx_importacion_seguimiento_rutas cisr1 
							WHERE 
								cisr1.id_actividad = cia.id 
								AND cisr1.id = (	SELECT MAX(cisr2.id) 
														FROM cmx_importacion_seguimiento_rutas cisr2 
														WHERE cisr2.id_actividad = cia.id) ),
						"Sin iniciar ruta"
					) ULTIMO_SEGUIMIENTO_OBSERVACION,
					IF(
						(SELECT COUNT(cisr1.id) FROM cmx_importacion_seguimiento_rutas cisr1 WHERE cisr1.id_actividad = cia.id ) > 0,
						(	SELECT cisr1.observacion_interna 
							FROM cmx_importacion_seguimiento_rutas cisr1 
							WHERE 
								cisr1.id_actividad = cia.id 
								AND cisr1.id = (	SELECT MAX(cisr2.id) 
														FROM cmx_importacion_seguimiento_rutas cisr2 
														WHERE cisr2.id_actividad = cia.id) ),
						""
					) ULTIMO_SEGUIMIENTO_OBSERVACION_INTERNA
				FROM 
					cmx_agrupaciones ca
					INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = ca.id
					INNER JOIN cmx_agrupacion_anticipo caa ON caa.id_agrupacion = ca.id
					INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cam.id_material_proyecto
					INNER JOIN cmx_importacion_proyecto cip ON cip.id = cia.id_importacion
					INNER JOIN cmx_agrupaciones_vehiculos cav ON cav.id_agrupacion = ca.id
					INNER JOIN cmx_vehiculos cv ON cv.id = cav.id_vehiculo
					INNER JOIN cmx_proveedores cp ON cp.id = cv.id_conductor
					INNER JOIN cmx_tipo_vehiculos ctv ON ctv.id = cv.tipo_vehiculo
				WHERE 
					cia.estado = 2
					AND ca.id = ' . $_POST["id"] . '
					AND cia.tipo_actividad = "seguimiento_ruta"
					AND cav.estado = "Anticipo Asignado"
				GROUP BY ca.id
			';
			$request["agrupaciones"] = $Data->getConsulta($sql);

			if ( $request["agrupaciones"] ) {
				foreach ($request["agrupaciones"]["rowsData"] as $key => $value) {
					/********* Se toma la información del seguimiento *********/
					// Contenido del Título
					$result["content"]["title"] = 'Información del Seguimiento de Ruta - ' . $value["numero_manifiesto"];

					// Contenido de la información general del Seguimiento 
					$result["content"]["body"]["general"] = '
						<span><strong>Información General</strong></span>
						<table class="table">
							<tbody>
								<tr>
									<td class="cell-detail">
										<div class="col-sm-4">
											<span>Manifiesto:</span>
											<span class="cell-detail-description">' . $value["numero_manifiesto"] . '</span>
										</div>
										<div class="col-sm-4">
											<span>Agrupanción:</span>
											<span class="cell-detail-description">' . $value["numero_agrupacion"] . '</span>
										</div>
										<div class="col-sm-4">
											<span>Peso Total:</span>
											<span class="cell-detail-description">' . number_format($value["peso_total"], 2, ",", ".") . 'Kg.</span>
										</div>
									</td>
								</tr>
								<tr>
									<td class="cell-detail"></td>
								</tr>
							</tbody>
						</table>
					';

					// Contenido de la información general del Seguimiento 
					// Filtro de la placa del trailes si lo tiene 
					$_placa_trailer = '';
					if ( $value["placa_trailer"] ) {
						$_placa_trailer = '
							<span class="cell-detail-description">Trailer: ' . $value["placa_trailer"] . '</span>
						';
					}

					$_tipo_carroceria = '';
					if ( $value["placa_trailer"] ) {
						$_tipo_carroceria = '(' . $value["tipo_carroceria"] . ')';
					}

					// Se filtra el contacto del conductor
					$_contacto = "";
					if ( $value["contacto"] ) {
						$_contacto = '
							<span class="cell-detail-description">Fijo: ' . $value["contacto"] . '</span>
						';
					}
					$_celular = "";
					if ( $value["celular"] ) {
						$_celular = '
							<span class="cell-detail-description">Celular: ' . $value["celular"] . '</span>
						';
					}

					$result["content"]["body"]["vehiculo"] = '
						<span><strong>Vehículo</strong></span>
						<table class="table">
							<tbody>
								<tr>
									<td class="cell-detail">
										<div class="col-sm-4">
											<span>Vehículo:</span>
											<span class="cell-detail-description">' . $value["placa"] . '</span>
											' . $_placa_trailer . '
											<span class="cell-detail-description">' . $value["TIPO_VEHICULO"] . '</span>
											' . $_tipo_carroceria . '
										</div>
										<div class="col-sm-4">
											<span>Conductor:</span>
											<span class="cell-detail-description">' . $value["nombre"] . '</span>
											<span class="cell-detail-description">Documento: ' . $value["numero_documento"] . '</span>
										</div>
										<div class="col-sm-4">
											<span>Contacto Conductor:</span>
											' . $_contacto . '
											' . $_celular . '
										</div>
									</td>
								</tr>
								<tr>
									<td class="cell-detail"></td>
								</tr>
							</tbody>
						</table>
					';
					/********* Fin - Se toma la información del seguimiento *********/

					// Se busca la información de la solicitudes del agrupamiento
					$sql = '
						SELECT 
							cc.id, cc.nombre, CONCAT(cc.documento,"-",cc.digito_verificacion) DOCUMENTO, cc.direccion, CONCAT(cm.municipio," - (",cm.depto," - ",cm.pais,")") CIUDAD,
							cc.telefono
						FROM 
							cmx_solicitudes cs
							INNER JOIN cmx_agrupacion_solicitudes cas ON cs.id = cas.id_solicitud
							INNER JOIN cmx_agrupaciones ca ON cas.id_agrupacion = ca.id
							INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = ca.id
							INNER JOIN cmx_mercancia_solicitud cms ON cms.id_solicitud = cs.id AND cms.id = cam.id_material
							INNER JOIN cmx_importacion_material cim ON cim.id = cam.id_material_proyecto
							INNER JOIN cmx_importacion_proyecto cip ON cip.id = cim.id_importacion
							INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
							INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
							INNER JOIN cmx_municipios cm ON cm.id = cc.ciudad
						WHERE 
							ca.id = ' . $value[0] . '
							AND cia.estado = 2
							AND cia.tipo_actividad = "seguimiento_ruta"
						GROUP BY cip.id_cliente
					';
					$request["solicitudes"][ $value[0] ] = $Data->getConsulta($sql);

					if ( $request["solicitudes"][ $value[0] ] ) {
						$result["content"]["body"]["cliente"] = '<h3>Clientes</h3>';
						foreach ($request["solicitudes"][ $value[0] ]["rowsData"] as $key_01 => $value_01) {
							// Se busca la información de la solicitud de acuerdo con el cliente 
							$sql = '
								SELECT 
									cs.id, cs.numero_solicitud, cas.peso_parcial
								FROM 
									cmx_solicitudes cs
									INNER JOIN cmx_agrupacion_solicitudes cas ON cs.id = cas.id_solicitud
									INNER JOIN cmx_agrupaciones ca ON cas.id_agrupacion = ca.id
									INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = ca.id
									INNER JOIN cmx_mercancia_solicitud cms ON cms.id_solicitud = cs.id AND cms.id = cam.id_material
									INNER JOIN cmx_importacion_material cim ON cim.id = cam.id_material_proyecto
									INNER JOIN cmx_importacion_proyecto cip ON cip.id = cim.id_importacion
								WHERE 
									ca.id = ' . $value[0] . '
									AND cip.id_cliente = ' . $value_01[0] . '
								GROUP BY cs.id
							';
							$request["solicitudes"][ $value[0] ][ $value_01[0] ] = $Data->getConsulta($sql);

							if ( $request["solicitudes"][ $value[0] ][ $value_01[0] ] ) {
								$_table_cliente = '';
								foreach ($request["solicitudes"][ $value[0] ][ $value_01[0] ]["rowsData"] as $key_02 => $value_02) {
									// Se buscan los materiales de la solicitud
									$sql = '
										SELECT 
											cim.*,
											cam.peso
										FROM 
											cmx_agrupacion_solicitudes cas 
											INNER JOIN cmx_mercancia_solicitud cms ON cms.id_solicitud = cas.id_solicitud
											INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = cas.id_agrupacion AND cam.id_material = cms.id
											INNER JOIN cmx_importacion_material cim ON cim.id = cam.id_material_proyecto 
											INNER JOIN cmx_importacion_proyecto cip ON cip.id = cim.id_importacion
										WHERE 
											cip.id_cliente = ' . $value_01[0] . '
											AND cas.id_agrupacion = ' . $value[0] . '
											AND cas.id_solicitud = ' . $value_02[0] . ';
									';
									$request["solicitudes"][ $value[0] ][ $value_01[0] ][ $value_02[0] ] = $Data->getConsulta($sql);

									// Se llena la table de contenido de los materiales de la solicitud
									$_table_material = '';
									if ( $request["solicitudes"][ $value[0] ][ $value_01[0] ][ $value_02[0] ] ) {
										foreach ($request["solicitudes"][ $value[0] ][ $value_01[0] ][ $value_02[0] ]["rowsData"] as $key_03 => $value_03 ) {
											$_table_material.= '
												<tr>
													<td class="cell-detail">
														<span>' . $value_03["nombre"] . '</span>
														<span class="cell-detail-description">' . $value_03["codigo"] . '</span>
													</td>
													<td class="cell-detail">
														<span>UN ' . $value_03["codigoUN"] . '</span>
														<span class="cell-detail-description">Riesgo - ' . $value_03["rombos"] . '</span>
													</td>
													<td class="cell-detail">
														<span>' . $value_03["cantidad"] . ' Unid.</span>
													</td>
													<td class="cell-detail">
														<span>' . number_format($value_03["peso"], 2, ",", ".") . 'Kg.</span>
													</td>
												</tr>
											';
										}
									}

									$_table_cliente.= '
										<span><strong>Materiales de la Solicitud - ' . $value_02["numero_solicitud"] . '</strong></span>
										<table class="table">
											<thead>
												<tr class="nexos-encabezado">
													<th style="width: 55%;">Material</th>
													<th>Codigos</th>
													<th>Cantidad</th>
													<th>Peso</th>
												</tr>
											<thead>
											<tbody>
												' . $_table_material . '
											</tbody>
										</table>
									';
								}
							}

							$result["content"]["body"]["cliente"].= '
								<span><strong>' . $value_01["nombre"] . ' (' . $value_01["DOCUMENTO"] . ')</strong></span>
								<table class="table">
									<tbody>
										<tr>
											<td class="cell-detail">
												<div class="col-sm-4">
													<span>Dirección:</span>
													<span class="cell-detail-description">' . $value_01["direccion"] . '</span>
												</div>
												<div class="col-sm-4">
													<span>Ciudad:</span>
													<span class="cell-detail-description">' . $value_01["CIUDAD"] . '</span>
												</div>
												<div class="col-sm-4">
													<span>Teléfono:</span>
													<span class="cell-detail-description">' . $value_01["telefono"] . '</span>
												</div>
											</td>
										</tr>
										<tr>
											<td class="cell-detail">
												' . $_table_cliente . '
											</td>
										</tr>
									</tbody>
								</table>
							';
						}
					}
				}
			}
			break;

		case 'slct_clientes_destino':
			$result["control"].= "Entro en slct_clientes_destino\n";
			$result["content"] = slctBuscarClientesAgrupamiento( $Data, $_POST["id"] );
			break;

		case 'busca_coordenadas':
			$result["control"].= "Entro en busca_coordenadas\n";

			$sql = '
				SELECT 
					crd.longitud, crd.latitud
				FROM 
					cmx_remitente_destinatario crd
				WHERE 
					crd.id = ' . $_POST["id"] . '
			';
			$request = $Data->getConsulta($sql);

			if ($request) {
				$ubicacion = $request["rowsData"][0];
				$result["content"]["longitud"] = $ubicacion["longitud"];
				$result["content"]["latitud"] = $ubicacion["latitud"];
			}
			break;

		case 'detalle_seguimiento_descargue':
			$result["control"].= "Entro en detalle_seguimiento_descargue\n";
			$sql = '
				SELECT 
					ca.id, ca.numero_agrupacion, caa.numero_manifiesto, 
					cv.placa, cv.placa_trailer, cv.tipo_carroceria, ctv.nombre TIPO_VEHICULO, cp.nombre, cp.numero_documento, cp.contacto, 
					SUM(cam.peso) peso_total
				FROM 
					cmx_agrupaciones ca
					INNER JOIN cmx_agrupacion_solicitudes cas ON cas.id_agrupacion = ca.id
					INNER JOIN cmx_mercancia_solicitud cms ON cms.id_solicitud = cas.id_solicitud
					INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = ca.id AND cam.id_material = cms.id
					INNER JOIN cmx_agrupacion_anticipo caa ON caa.id_agrupacion = ca.id
					INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cam.id_material_proyecto
					INNER JOIN cmx_importacion_proyecto cip ON cip.id = cia.id_importacion
					INNER JOIN cmx_agrupaciones_vehiculos cav ON cav.id_agrupacion = ca.id
					INNER JOIN cmx_vehiculos cv ON cv.id = cav.id_vehiculo
					INNER JOIN cmx_proveedores cp ON cp.id = cv.id_conductor
					INNER JOIN cmx_tipo_vehiculos ctv ON ctv.id = cv.tipo_vehiculo
				WHERE 
					cia.estado = 2
					AND ca.id = ' . $_POST["id_agrupamiento"] . '
					AND cas.id_solicitud = ' . $_POST["id"] . '
					AND cia.tipo_actividad = "seguimiento_descarga"
					AND cav.estado = "Anticipo Asignado"
				GROUP BY ca.id
			';
			$request["agrupaciones"] = $Data->getConsulta($sql);

			if ( $request["agrupaciones"] ) {
				foreach ($request["agrupaciones"]["rowsData"] as $key => $value) {
					/********* Se toma la información del seguimiento *********/
					// Contenido del Título
					$result["content"]["title"] = 'Información del Seguimiento de Descarga - ' . $value["numero_manifiesto"];

					// Contenido de la información general del Seguimiento 
					$result["content"]["body"]["general"] = '
						<span><strong>Información General</strong></span>
						<table class="table">
							<tbody>
								<tr>
									<td class="cell-detail">
										<div class="col-sm-4">
											<span>Manifiesto:</span>
											<span class="cell-detail-description">' . $value["numero_manifiesto"] . '</span>
										</div>
										<div class="col-sm-4">
											<span>Agrupanción:</span>
											<span class="cell-detail-description">' . $value["numero_agrupacion"] . '</span>
										</div>
										<div class="col-sm-4">
											<span>Peso Total:</span>
											<span class="cell-detail-description">' . number_format($value["peso_total"], 2, ",", ".") . 'Kg.</span>
										</div>
									</td>
								</tr>
								<tr>
									<td class="cell-detail"></td>
								</tr>
							</tbody>
						</table>
					';

					// Contenido de la información general del Seguimiento 
					// Filtro de la placa del trailes si lo tiene 
					$_placa_trailer = '';
					if ( $value["placa_trailer"] ) {
						$_placa_trailer = '
							<span class="cell-detail-description">Trailer: ' . $value["placa_trailer"] . '</span>
						';
					}

					$_tipo_carroceria = '';
					if ( $value["placa_trailer"] ) {
						$_tipo_carroceria = '(' . $value["tipo_carroceria"] . ')';
					}

					$result["content"]["body"]["vehiculo"] = '
						<span><strong>Vehículo</strong></span>
						<table class="table">
							<tbody>
								<tr>
									<td class="cell-detail">
										<div class="col-sm-3"></div>
										<div class="col-sm-3">
											<span>Vehículo:</span>
											<span class="cell-detail-description">' . $value["placa"] . '</span>
											' . $_placa_trailer . '
											<span class="cell-detail-description">' . $value["TIPO_VEHICULO"] . '</span>
											' . $_tipo_carroceria . '
										</div>
										<div class="col-sm-3">
											<span>Conductor:</span>
											<span class="cell-detail-description">' . $value["nombre"] . '</span>
											<span class="cell-detail-description">Documento: ' . $value["numero_documento"] . '</span>
											<span class="cell-detail-description">Contacto: ' . $value["contacto"] . '</span>
										</div>
										<div class="col-sm-3"></div>
									</td>
								</tr>
								<tr>
									<td class="cell-detail"></td>
								</tr>
							</tbody>
						</table>
					';

					/********* Fin - Se toma la información del seguimiento *********/

					// Se busca la información de la solicitudes del agrupamiento
					$sql = '
						SELECT 
							cc.id, cc.nombre, CONCAT(cc.documento,"-",cc.digito_verificacion) DOCUMENTO, cc.direccion, CONCAT(cm.municipio," - (",cm.depto," - ",cm.pais,")") CIUDAD,
							cc.telefono
						FROM 
							cmx_solicitudes cs
							INNER JOIN cmx_agrupacion_solicitudes cas ON cs.id = cas.id_solicitud
							INNER JOIN cmx_agrupaciones ca ON cas.id_agrupacion = ca.id
							INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = ca.id
							INNER JOIN cmx_mercancia_solicitud cms ON cms.id_solicitud = cs.id
							INNER JOIN cmx_importacion_material cim ON cim.id = cam.id_material_proyecto AND cim.id = cms.id_material_proyecto
							INNER JOIN cmx_importacion_proyecto cip ON cip.id = cim.id_importacion
							INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
							INNER JOIN cmx_municipios cm ON cm.id = cc.ciudad
						WHERE 
							ca.id = ' . $value[0] . '
							AND cs.id = ' . $_POST["id"] . '
						GROUP BY cip.id_cliente;
					';
					$request["solicitudes"][ $value[0] ] = $Data->getConsulta($sql);

					if ( $request["solicitudes"][ $value[0] ] ) {
						$result["content"]["body"]["cliente"] = '<h3>Clientes</h3>';
						foreach ($request["solicitudes"][ $value[0] ]["rowsData"] as $key_01 => $value_01) {

							// Se busca la información de la solicitud de acuerdo con el cliente 
							$sql = '
								SELECT 
									cs.id, cs.numero_solicitud, cas.peso_parcial
								FROM 
									cmx_solicitudes cs
									INNER JOIN cmx_agrupacion_solicitudes cas ON cs.id = cas.id_solicitud
									INNER JOIN cmx_agrupaciones ca ON cas.id_agrupacion = ca.id
									INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = ca.id
									INNER JOIN cmx_mercancia_solicitud cms ON cms.id_solicitud = cs.id
									INNER JOIN cmx_importacion_material cim ON cim.id = cam.id_material_proyecto AND cim.id = cms.id_material_proyecto
									INNER JOIN cmx_importacion_proyecto cip ON cip.id = cim.id_importacion
								WHERE 
									ca.id = ' . $value[0] . '
									AND cip.id_cliente = ' . $value_01[0] . '
								GROUP BY cs.id;
							';
							$request["solicitudes"][ $value[0] ][ $value_01[0] ] = $Data->getConsulta($sql);

							if ( $request["solicitudes"][ $value[0] ][ $value_01[0] ] ) {
								$_table_cliente = '';
								foreach ($request["solicitudes"][ $value[0] ][ $value_01[0] ]["rowsData"] as $key_02 => $value_02) {

									// Se buscan los materiales de la solicitud
									$sql = '
										SELECT 
											cim.*,
											cam.peso
										FROM 
											cmx_agrupacion_solicitudes cas 
											INNER JOIN cmx_mercancia_solicitud cms ON cms.id_solicitud = cas.id_solicitud
											INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = cas.id_agrupacion
											INNER JOIN cmx_importacion_material cim ON cim.id = cam.id_material_proyecto AND cim.id = cms.id_material_proyecto
											INNER JOIN cmx_importacion_proyecto cip ON cip.id = cim.id_importacion
										WHERE 
											cip.id_cliente = ' . $value_01[0] . '
											AND cas.id_agrupacion = ' . $value[0] . '
											AND cas.id_solicitud = ' . $value_02[0] . ';
									';

									$request["solicitudes"][ $value[0] ][ $value_01[0] ][ $value_02[0] ] = $Data->getConsulta($sql);
									$_table_material = '';
									// Se llena la table de contenido de los materiales de la solicitud
									if ( $request["solicitudes"][ $value[0] ][ $value_01[0] ][ $value_02[0] ] ) {
										foreach ($request["solicitudes"][ $value[0] ][ $value_01[0] ][ $value_02[0] ]["rowsData"] as $key_03 => $value_03 ) {
											$_table_material.= '
												<tr>
													<td class="cell-detail">
														<span>' . $value_03["nombre"] . '</span>
														<span class="cell-detail-description">' . $value_03["codigo"] . '</span>
													</td>
													<td class="cell-detail">
														<span>UN ' . $value_03["codigoUN"] . '</span>
														<span class="cell-detail-description">Riesgo - ' . $value_03["rombos"] . '</span>
													</td>
													<td class="cell-detail">
														<span>' . $value_03["cantidad"] . ' Unid.</span>
													</td>
													<td class="cell-detail">
														<span>' . number_format($value_03["peso"], 2, ",", ".") . 'Kg.</span>
													</td>
												</tr>
											';
										}
									}

									$_table_cliente.= '
										<span><strong>Materiales de la Solicitud - ' . $value_02["numero_solicitud"] . '</strong></span>
										<table class="table">
											<thead>
												<tr class="nexos-encabezado">
													<th style="width: 55%;">Material</th>
													<th>Códigos</th>
													<th>Cantidad</th>
													<th>Peso</th>
												</tr>
											<thead>
											<tbody>
												' . $_table_material . '
											</tbody>
										</table>
									';
								}
							}

							$result["content"]["body"]["cliente"].= '
								<span><strong>' . $value_01["nombre"] . ' (' . $value_01["DOCUMENTO"] . ')</strong></span>
								<table class="table">
									<tbody>
										<tr>
											<td class="cell-detail">
												<div class="col-sm-4">
													<span>Dirección:</span>
													<span class="cell-detail-description">' . $value_01["direccion"] . '</span>
												</div>
												<div class="col-sm-4">
													<span>Ciudad:</span>
													<span class="cell-detail-description">' . $value_01["CIUDAD"] . '</span>
												</div>
												<div class="col-sm-4">
													<span>Teléfono:</span>
													<span class="cell-detail-description">' . $value_01["telefono"] . '</span>
												</div>
											</td>
										</tr>
										<tr>
											<td class="cell-detail">
												' . $_table_cliente . '
											</td>
										</tr>
									</tbody>
								</table>
							';
						}
					}
				}
			}

			// Se busca si el agrupamiento tiene seguimientos 
			$result["content"]["body"]["seguimientos"] = '
				<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible">
					<div class="icon">
						<span class="mdi mdi-alert-triangle"></span>
					</div>
					<div class="message">
						<strong>Atención!</strong>
						<p>No se han registrado seguimientos en esta solicitud...</p>
					</div>
				</div>
			';

			if ( isset( $_POST["id_actividad_seguimiento"] ) ) {
				$sql = '
					SELECT
						cisd.*,
						IF(
							cisd.id_tramo,
							(	SELECT CONCAT(TRIM(crd1.sigla), " ", TRIM(crd1.direccion), " | ",cm1.municipio, " (",cm1.depto," - ", cm1.pais, ")")
								FROM cmx_tramo_solicitud cts1
									INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cts1.id_remitente_destinatario
									INNER JOIN cmx_municipios cm1 ON cm1.id = crd1.id_ciudad
								WHERE cts1.id = cisd.id_tramo
							),
							NULL
						) TRAMO,
						cu.nom_usuario, cu.url_avatar
					FROM
						cmx_importacion_seguimiento_descargue cisd
						INNER JOIN cmx_usuarios cu ON cu.id = cisd.autor
					WHERE 
						cisd.id_actividad = ' . $_POST["id_actividad_seguimiento"] . '
					ORDER BY cisd.fecha_hora DESC;
				';
				$request["seguimientos"] = $Data->getConsulta($sql);

				$_table_seguimientos = '';
				foreach ($request["seguimientos"]["rowsData"] as $key => $value) {
					$_finalizacion = '';
					if ($value["fecha_hora_finalizacion"] != "0000-00-00 00:00:00") {
						$_finalizacion = $value["fecha_hora_finalizacion"];
					}
					$_table_seguimientos.= '
						<tr>
							<td class="user-avatar cell-detail user-info">
								<img src="' . BASE_URL . 'public/img/users/' . $value["url_avatar"] . '">
								<span>' . $value["nom_usuario"] . '</span>
								<span class="cell-detail-description">' . $value["fecha_hora"] . '</span>
							</td>
							<td class="cell-detail">
								<span>' . $value["tipo_seguimiento"] . ' <strong>' . $_finalizacion . '</strong></span>
								<span class="cell-detail-description"><strong>' . $value["TRAMO"] . '</strong></span>
							</td>
							<td class="cell-detail">
								<span class="cell-detail">' . $value["observacion"] . '</span>
								<span class="cell-detail-description" style="color: #ea4335;">' . $value["observacion_interna"] . '</span>
							</td>
						</tr>
					';
				}

				$result["content"]["body"]["seguimientos"] = '
					<h3>Seguimientos</h3>
					<div class="col-xs-12">
						<span><strong>Gestión Realizada</strong></span>
						<table class="table table-striped table-condensed">
							<thead>
								<tr class="nexos-encabezado">
									<th class="col-md-3">Autor</th>
									<th class="col-md-4">Seguimiento</th>
									<th class="col-md-5">Observación</th>
								</tr>
							</thead>
							<tbody>
								' . $_table_seguimientos . '
							</tbody>
						</table>
					</div>
				';
			}
			
			break;

		case 'slct_destino_descarga':
			$result["control"].= "Entro en slct_destino_descarga\n";
			$sql = '
				SELECT 
					cts.id, crd.sigla DESTINO, crd.direccion, CONCAT(cm.municipio, " (",cm.depto," - ", cm.pais, ")") MUNICIPIO
				FROM 
					cmx_tramo_solicitud cts
					INNER JOIN cmx_remitente_destinatario crd ON crd.id = cts.id_remitente_destinatario
					INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
				WHERE 
					cts.id_solicitud = ' . $_POST["id"] . '
					AND cts.tipo_operacion = "Descargue"
					AND cts.estado = 1
			';
			$request = $Data->getConsulta($sql);

			$select = '
				<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible">
					<div class="icon">
						<span class="mdi mdi-alert-triangle"></span>
					</div>
					<div class="message">
						<strong>Atención!</strong>
						<p>No se encontró tramos de descarga en esta solicitud...</p>
					</div>
				</div>
			';

			if ( $request ) {
				$select = '
					<label>(*) Tramo Destino</label>
					<select class="form-control input-sm" name="id_destino" id="slct_destino" aria-hidden="true">
				';
				$select.= '<option value="" selected disabled>Seleccione</option>';
				foreach ($request["rowsData"] as $key => $value) {
					$select.= '<option value="' . $value[0] . '">' . $value["DESTINO"] . ' ' . $value["direccion"] . ' | ' . $value["MUNICIPIO"] . '</option>';
				}
				$select.= '</select>';
			}
			$result["content"]["select"] = $select;
			break;

		default:
			$result["control"].= "Error en la selección de acción de archivo";
			break;
	}

	echo json_encode( $result );

	function buscaIdCiudadPlanRuta( $Data, $id_agrupamiento, $orden ){
		// Tomo el id de la ciudad del primer tramo del agrupamiento 
		$sql = '
			SELECT 
				cm.id
			FROM 
				cmx_municipios cm
				INNER JOIN cmx_remitente_destinatario crd ON crd.id_ciudad = cm.id
				INNER JOIN cmx_tramo_solicitud cts ON cts.id_remitente_destinatario = crd.id
				INNER JOIN cmx_tramos_orden cto ON cto.id_tramo = cts.id
			WHERE 
				cto.orden = ' . $orden . '
				AND cto.id_agrupacion = ' . $id_agrupamiento . '
		';
		$request = $Data->getConsulta($sql);
		return $request["rowsData"][0]["id"];
	}

	function slctPlanRuta( $Data, $id_ciudad_origen, $id_ciudad_destino ){
		$origen = buscarCiudad( $Data, $id_ciudad_origen );
		$destino = buscarCiudad( $Data, $id_ciudad_destino );

		$slct_plan_ruta = slctBuscarPlanRuta( $Data, $id_ciudad_origen, $id_ciudad_destino );

		$select = '
			<div class="row"></div>
			<div class="col-sm-1"></div>
			<div class="col-sm-10">
				<table class="table">
					<tbody>
						<tr>
							<td class="cell-detail">
								<div class="col-sm-6">
									<span>Primer Tramo:</span>
									<span class="cell-detail-description">' . $origen . '</span>
								</div>
								<div class="col-sm-6">
									<span>Último Tramo:</span>
									<span class="cell-detail-description">' . $destino . '</span>
								</div>
							</td>
						</tr>
						<tr>
							<td class="form-group">
								' . $slct_plan_ruta . '
							</td>
						</tr>
						<tr>
							<td class="cell-detail"></td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="col-sm-1"></div>
		';
		return $select;
	}

	function buscarCiudad( $Data, $id ){
		$sql = '
			SELECT 
				CONCAT(cm.municipio," (",cm.depto," - ",cm.pais,")") CIUDAD
			FROM 
				cmx_municipios cm
			WHERE 
				cm.id = ' . $id . '
		';
		$request = $Data->getConsulta($sql);
		return $request["rowsData"][0]["CIUDAD"];
	}

	function slctBuscarPlanRuta( $Data, $origen, $destino ){
		$select = '<p class="text-danger"><strong>No exiten planes de ruta para el origen y destino.</strong></p>';
		$sql = '
			SELECT 
				*
			FROM 
				cmx_mapas_ruta cmr
			WHERE 
				cmr.estado = 1
				AND cmr.origen = ' . $origen . '
				AND cmr.destino = ' . $destino . '
		';
		$request = $Data->getConsulta($sql);
		if ( $request ) {
				$select = '
					<label>(*) Plan de Ruta</label>
					<select class="form-control" name="id_plan_ruta" id="slct_plan_ruta" aria-hidden="true">
				';
				$select.= '<option value="" selected disabled>Seleccione</option>';
			foreach ($request["rowsData"] as $key => $value) {
				$select.= '<option value="' . $value[0] . '">' . $value["nombre"] . '</option>';
			}
			$select.= '</select>';
		}
		return $select;
	}

	function slctBuscarClientesAgrupamiento( $Data, $id_agrupamiento ){
		$select = '<p class="text-danger"><strong>No exiten Destinos.</strong></p>';
		$sql = '
			SELECT 
				DISTINCT(cas.id_solicitud), CONCAT(TRIM(crd.nombre)," (",TRIM(cc.nombre),")") nombre,
				crd.id ID_DESTINO, cts.id ID_TRAMO
			FROM 
				cmx_agrupacion_solicitudes cas
				INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = cas.id_agrupacion
				INNER JOIN cmx_mercancia_solicitud cms ON cms.id_solicitud = cas.id_solicitud AND cms.id = cam.id_material
				INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cam.id_material_proyecto
				INNER JOIN cmx_importacion_proyecto cip ON cip.id = cia.id_importacion
				INNER JOIN cmx_agrupaciones_vehiculos cav ON cav.id_agrupacion = cas.id_agrupacion
				INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
				INNER JOIN cmx_tramo_solicitud cts ON cts.id_solicitud = cms.id_solicitud
				INNER JOIN cmx_remitente_destinatario crd ON crd.id = cts.id_remitente_destinatario
			WHERE 
				cas.id_agrupacion = ' . $id_agrupamiento . '
				AND cav.estado = "Anticipo Asignado"
				AND cia.tipo_actividad = "seguimiento_ruta"
				AND cia.estado = 2
				AND cts.tipo_operacion = "Descargue"
				AND cts.estado = 2
		';
		$request = $Data->getConsulta($sql);

		if ( $request ) {
			$select = '
				<label>(*) Cliente Destino</label>
				<select class="form-control input-sm slct_clientes_destino" name="id_solicitud" id="slct_solicitud" aria-hidden="true">
			';
			$select.= '<option value="" selected disabled>Seleccione</option>';
			foreach ($request["rowsData"] as $key => $value) {
				$select.= '<option value="' . $value[0] . '" data-id_destino="' . $value["ID_DESTINO"] . '" data-id_tramo="' . $value["ID_TRAMO"] . '">' . str_replace('  ', ' ', str_replace('  ', ' ', $value["nombre"]) ) . '</option>';
			}
			$select.= '</select>';
		}

		return $select;
	}

	function listaTramosAgrupacion( $Data, $id ){
		// Se busca la información de la solicitudes del agrupamiento
		$sql = '
			SELECT 
				cts.id, cto.orden, cts.tipo_operacion, 
				cm.municipio CIUDAD, CONCAT("(",cm.depto," - ",cm.pais,")") DEPTO
			FROM 
				cmx_municipios cm
				INNER JOIN cmx_remitente_destinatario crd ON crd.id_ciudad = cm.id
				INNER JOIN cmx_tramo_solicitud cts ON cts.id_remitente_destinatario = crd.id
				INNER JOIN cmx_tramos_orden cto ON cto.id_tramo = cts.id
			WHERE 
				cto.id_agrupacion = ' . $id . '
			ORDER BY cto.orden
		';
		$request = $Data->getConsulta($sql);

		if ( $request ) {
			$table_content = '';
			foreach ($request["rowsData"] as $key => $value) {
				$table_content.= '
					<tr>
						<td class="cell-detail">
							<span class="label label-default">' . $value["orden"] . '</span>
						</td>
						<td class="cell-detail">
							<span>' . $value["CIUDAD"] . '</span>
							<span class="cell-detail-description">' . $value["DEPTO"] . '</span>
						</td>
						<td class="cell-detail">
							<span>' . $value["tipo_operacion"] . '</span>
						</td>
					</tr>
				';
			}
		}

		$table = '
			<div class="row"></div>
			<div class="col-sm-2"></div>
			<div class="col-sm-8">
				<span><strong>Tramos</strong></span>
				<table class="table table-striped">
					<thead>
						<tr class="nexos-encabezado">
							<th style="width: 10%;">Orden</th>
							<th>Ciudad</th>
							<th style="width: 25%;">Tipo Operación</th>
						</tr>
					</thead>
					<tbody>
						' . $table_content . '
						<tr><td></td><td></td><td></td></tr>
					</tbody>
				</table>
			</div>
			<div class="col-sm-2"></div>
		';
		return $table;
	}

?>