<?php
include "../application/Config.php";
include '../application/Conexion.php';
include "../application/Model.php";
require_once 'PHPMailer/class.phpmailer.php';
header("Content-Type: text/html;charset=utf-8");

$Data = new Consultas;
$body = '';

$sql = '
		SELECT 
			cip.id_cliente, cc.nombre
		FROM 
			cmx_importacion_actividades cia
			INNER JOIN cmx_importacion_proyecto cip ON cip.id = cia.id_importacion
			INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
		WHERE
			cia.estado = 2
			AND cia.tipo_actividad = "seguimiento_ruta"
		GROUP BY cip.id_cliente
	';

$request_10 = $Data->getConsulta($sql);

// print_r("<pre>");
// print_r($request_10);
// print_r("</pre>");

if ($request_10) {
	echo "<p>Si hay seguimientos de rutas </p>";
	foreach ($request_10["rowsData"] as $key_10 => $value_10) {
		echo "<p>id_cliente - " . $value_10["id_cliente"] . "</p>";

		// Se verifica si el cliente es nexos para que pregunte por todos los seguimientos
		$valida_cliente = "";
		if ($value_10["id_cliente"] != 1) {
			$valida_cliente = 'AND cip.id_cliente = ' . $value_10["id_cliente"] . ' ';
		}

		$sql = '
				SELECT 
					cia.id ID_ACTIVIDAD,
					cip.numero_importacion, 
					cc.nombre NOMBRE_CLIENTE,
					crd.nombre ORIGEN, CONCAT(cm.municipio," (", cm.depto," - ", cm.pais,")") CIUDAD_ORIGEN,
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
						crd.nombre
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
					) ULTIMO_SEGUIMIENTO_OBSERVACION_INTERNA,
					SUM( cam.peso ) PESO,
					ctv.nombre TIPO_VEHICULO
				FROM 
					cmx_importacion_actividades cia
					INNER JOIN cmx_importacion_proyecto cip ON cip.id = cia.id_importacion
					INNER JOIN cmx_remitente_destinatario crd ON crd.id = cip.id_origen
					INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
					INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
					INNER JOIN cmx_agrupacion_material cam ON cam.id_material_proyecto = cia.id_material
					INNER JOIN cmx_agrupaciones_vehiculos cav ON cav.id_agrupacion = cam.id_agrupamiento
					INNER JOIN cmx_vehiculos cv ON cav.id_vehiculo = cv.id
					INNER JOIN cmx_tipo_vehiculos ctv ON ctv.id = cv.tipo_vehiculo
				WHERE
					cia.estado = 2
					AND cia.tipo_actividad = "seguimiento_ruta"
					' . $valida_cliente . ' 
				GROUP BY cia.id_importacion, cia.grupo;
			';

		$verSeguimeintoRutas = $Data->getConsulta($sql);

		// print_r("<pre>");
		// print_r($verSeguimeintoRutas);
		// print_r("</pre>");


		$_tabla_seguimiento_rutas = "";
		if ($verSeguimeintoRutas) {
			foreach ($verSeguimeintoRutas["rowsData"] as $key => $value) {

				// // Se filtra el contenido del campo observación interna
				$_observacion_interna = "";
				// if ( $ssn_id_cliente == 1 ) {
				// 	$_observacion_interna = '
				// 		<span class="cell-detail-description" style="color: #ea4335;">' . $value["ULTIMO_SEGUIMIENTO_OBSERVACION_INTERNA"] . '</span>
				// 	';
				// }

				// Se pinta la tabla de material pendiente por descargar
				$_tabla_seguimiento_rutas .= '
						<tr style="display: table-row; vertical-align: inherit; border-color: inherit; font-size: 12px;">
							<td style="padding-top: 11px; padding-bottom: 11px; font-weight: 400; vertical-align: middle; padding: 12px 10px; line-height: 1.42857143; border-top: 1px solid #ddd; display: table-cell;">
								<span style="display: block;">' . $value["NOMBRE_CLIENTE"] . '</span>
							</td>
							<td style="padding-top: 11px; padding-bottom: 11px; font-weight: 400; vertical-align: middle; padding: 12px 10px; line-height: 1.42857143; border-top: 1px solid #ddd; display: table-cell;">
								<span style="display: block;">' . $value["ORIGEN"] . '</span>
								<span style="display: block; font-size: 10px; color: #777; line-height: 1.42857143;">' . $value["CIUDAD_ORIGEN"] . '</span>
							</td>
							<td style="padding-top: 11px; padding-bottom: 11px; font-weight: 400; vertical-align: middle; padding: 12px 10px; line-height: 1.42857143; border-top: 1px solid #ddd; display: table-cell;">
								<span style="display: block;">' . $value["TIPO_VEHICULO"] . '</span>
								<span style="display: block; font-size: 10px; color: #777; line-height: 1.42857143;"></span>
							</td>
							<td style="padding-top: 11px; padding-bottom: 11px; font-weight: 400; vertical-align: middle; padding: 12px 10px; line-height: 1.42857143; border-top: 1px solid #ddd; display: table-cell;">
								<span style="display: block;">' . $value["PESO"] . ' Kg</span>
								<span style="display: block; font-size: 10px; color: #777; line-height: 1.42857143;"></span>
							</td>
							<td style="padding-top: 11px; padding-bottom: 11px; font-weight: 400; vertical-align: middle; padding: 12px 10px; line-height: 1.42857143; border-top: 1px solid #ddd; display: table-cell;">
								<span style="display: block;">' . $value["ULTIMO_SEGUIMIENTO_FECHA"] . '</span>
								<span style="display: block; font-size: 10px; color: #777; line-height: 1.42857143;">' . $value["ULTIMO_SEGUIMIENTO_UBICACION"] . '</span>
							</td>
							<td style="padding-top: 11px; padding-bottom: 11px; font-weight: 400; vertical-align: middle; padding: 12px 10px; line-height: 1.42857143; border-top: 1px solid #ddd; display: table-cell;">
								<span style="display: block;">' . $value["ULTIMO_SEGUIMIENTO_TIPO_SEGUIMIENTO"] . '</span>
								<span style="display: block; font-size: 10px; color: #777; line-height: 1.42857143;">' . $value["ULTIMO_SEGUIMIENTO_OBSERVACION"] . '</span>
								<!--
									' . $_observacion_interna . '
								-->
							</td>
						</tr>
					';
			}
		}

		// Si es una consulta general se modifica el valor del nombre de cliente 
		$valida_titulo_cliente = $value["NOMBRE_CLIENTE"];
		if ($value_10["id_cliente"] == 1) {
			$valida_titulo_cliente = 'Clientes ' . APP_COMPANY;
		}

		if ($_tabla_seguimiento_rutas != "") {
			$body .= '
					<!-- Resumen de Seguimientos de Ruta - Responsive Table  -->
					<body style="font-family: \'Roboto\', Arial, sans-serif; font-size: 12px; line-height: 1.42857143; color: #404040;">
						<div style="font-family: \'Roboto\', Arial, sans-serif; font-size: 12px; line-height: 1.42857143; color: #404040;">
							<div style="background-color: #ffffff; margin-bottom: 25px; box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.04); border-width: 0; border-radius: 3px; border: 1px #aaa solid;">
								<div style="color: #333333; background-color: transparent; border-color: #ddd; font-size: 18px; font-weight: 300; padding-left: 0; padding-right: 0; margin: 0 20px; border-bottom-width: 0;border-radius: 3px 3px 0 0; padding: 20px 20px 10px; border-bottom: 1px solid transparent;">Resumen de Seguimientos de Ruta - <strong>' . $valida_titulo_cliente . '</strong>
								</div>
								<div style=" padding: 0; border-radius: 0 0 3px 3px;">
									<div style="border: 0; margin-bottom: 0; overflow-x: auto; min-height: 0.01%;">
										<table id="table1" class="table table-striped table-hover"
											style="margin-bottom: 0; width: 100%; max-width: 100%; background-color: transparent; border-collapse: collapse; border-spacing: 0;
												white-space: normal; line-height: normal; font-weight: normal; font-size: medium; font-style: normal; color: -internal-quirk-inherit; text-align: start; font-variant: normal; display: table; " >
											<thead style="display: table-header-group; vertical-align: middle; border-color: inherit; font-size: 14px;">
												<tr style="display: table-row; vertical-align: inherit; border-color: inherit;">
													<th style="border-top: 0; padding-left: 20px; padding-top: 15px; padding-bottom: 10px; border-bottom-width: 2px; font-weight: 700;vertical-align: bottom; border-bottom: 2px solid #ddd; padding: 12px 10px; line-height: 1.42857143;">
														Cliente
													</th>
													<th style="border-top: 0; padding-left: 20px; padding-top: 15px; padding-bottom: 10px; border-bottom-width: 2px; font-weight: 700;vertical-align: bottom; border-bottom: 2px solid #ddd; padding: 12px 10px; line-height: 1.42857143;">
														Origen
													</th>
													<th style="border-top: 0; padding-left: 20px; padding-top: 15px; padding-bottom: 10px; border-bottom-width: 2px; font-weight: 700;vertical-align: bottom; border-bottom: 2px solid #ddd; padding: 12px 10px; line-height: 1.42857143;">
														Vehículo
													</th>
													<th style="border-top: 0; padding-left: 20px; padding-top: 15px; padding-bottom: 10px; border-bottom-width: 2px; font-weight: 700;vertical-align: bottom; border-bottom: 2px solid #ddd; padding: 12px 10px; line-height: 1.42857143;">
														Peso Carga
													</th>
													<th style="border-top: 0; padding-left: 20px; padding-top: 15px; padding-bottom: 10px; border-bottom-width: 2px; font-weight: 700;vertical-align: bottom; border-bottom: 2px solid #ddd; padding: 12px 10px; line-height: 1.42857143;">
														Último Seguimiento
													</th>
													<th style="border-top: 0; padding-left: 20px; padding-top: 15px; padding-bottom: 10px; border-bottom-width: 2px; font-weight: 700;vertical-align: bottom; border-bottom: 2px solid #ddd; padding: 12px 10px; line-height: 1.42857143;">
														Úlitma Observación
													</th>
												</tr>
											</thead>
											<tbody style="display: table-row-group; vertical-align: middle;border-color: inherit;">
												' . $_tabla_seguimiento_rutas . ' 
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					</body>
				';
		}
	}
}


$mail = new PHPMailer();
$mail->Host = "localhost";
$mail->From = "noreply@nexosapp.com";
$mail->FromName = 'Seguimientos Nexosapp';
$mail->Subject = 'Informe de Seguimiento de Rutas ';
// $mail->addAddress('fgomez@ingecall.com');
// $mail->addAddress('sorjuela@imocom.com.co'); 

$mail->addAddress('desarrolladores@nexosgroup.com'); // correo de destino 
$mail->addAddress('soportenexosgroup@gmail.com');
$mail->Body = $body;
$mail->isHTML(true);
// Activo condificación utf-8
$mail->CharSet = 'UTF-8';
$msg = $mail->send();

if ($msg) {
	echo '<p>La queja se ha enviado exitosamente</p>';
} else {
	echo '<p>No se envió</p>';
	echo $body;
}
