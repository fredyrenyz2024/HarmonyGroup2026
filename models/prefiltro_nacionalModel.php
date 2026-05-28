<?php
class prefiltro_nacionalModel extends Model
{

	public function __construct()
	{
		parent::__construct();
	}

	public function getasignarvehiculo($id_usuario, $filtro, $fecha_inicial, $fecha_final, $estado, $cliente, $empresa, $filtros)
	{
		$response = [];
		if ($filtro === "todos") {
			if ($estado == "Todas") {
				if ($filtros == '1') {
					/* Se cambia la de tabla de donde se saca el el estado par controlar las solicitudes de servicio l.estado por csv.estado */
					$sql_datos = "SELECT g.item,g.tipo_mercancia,g.flete,g.peso_neto_tn,csv.estado AS esoli,csv.nundoc_solicitud AS elid, csv.fecha,csv.hora, csv.origen, csv.destino, csv.tipo_vehiculo, csv.estado,csv.idpareja_origen_destino, csv.fecha, csv.hora,
					pp.nombre, g.id AS idnegocio,csv.peso_kg,CONCAT (M.municipio,' - ',M.depto) AS origen_solicitud,CONCAT(M2.municipio,' - ',M2.depto) AS destino_solicitud,
					csc.* ,csv.cant_vehiculo, csv.cant_disponible,g.tipo_servicio_mer,g.peso_bruto_kg,g.total_tarifa,M.rndc_codigo_ciudad AS origen_rndc,g.itr,csv.nundoc_solicitud,csv.prioritaria,cli.empresa,csv.escenario_id,csv.origen AS Origen_Enturnar,
					pe.fecha_estimada_entrega AS fecha_cargue, pe.hora_estimada AS hora_cargue,M.rndc_codigo_ciudad AS Rndc_Origen, M2.rndc_codigo_ciudad AS Rndc_Destino,M.latitud AS latitud_origen,M.longitud as longitud_origen, cli.id AS Cliente_Id,g.peso_neto_kg,
					dp.nivel,
					dp.motivo,
					dp.usuario,
					CONCAT(dp.fecha,' ',dp.hora) AS FechaPrioridad,
					dp.usuario_aprueba,
					CONCAT(dp.fecha_aprueba,' ',dp.hora_aprueba) AS FechaAprueba
					FROM cmx_cotizaciones_serviciocliente AS csc
					INNER JOIN cmx_solicitud_vehiculo2 csv 	ON csc.n_cotizacion=csv.n_cotizacion 
					INNER JOIN cmx_log_solicitudvehiculo l ON csv.nundoc_solicitud=l.id_solictud
					INNER JOIN cmx_detalle_mercancia2 g ON csv.idpareja_origen_destino=g.id
					INNER JOIN cmx_para_tipo_vehiculo pp ON csv.tipo_vehiculo=pp.id
					INNER JOIN cmx_agencia_usuario uno ON csv.agencia=uno.id_agencia
					INNER JOIN cmx_municipios M ON csv.origen=M.rndc_codigo_ciudad
					INNER JOIN cmx_municipios M2 ON csv.destino=M2.rndc_codigo_ciudad
					INNER JOIN cmx_clientes cli ON csc.id_cliente = cli.id
					LEFT JOIN cmx_orden_cargue oc ON csv.nundoc_solicitud=oc.mer_idservicio
					LEFT JOIN cmx_remesa_ordencargue ro ON oc.id=ro.id_orden_cargue
					LEFT JOIN cmx_remesa rm ON ro.id_remesa=rm.id
					LEFT JOIN cmx_manifiesto_remesa mr ON rm.id=mr.id_remesa
					LEFT JOIN cmx_manifiesto ma ON mr.id_manifiesto=ma.id
					LEFT JOIN  cmx_ruta_puntosentrega pe ON csv.nundoc_solicitud = pe.cod_ini_ruta
					LEFT JOIN cmx_detalle_prioridad dp ON csv.nundoc_solicitud=dp.numdoc_solicitud
					WHERE csv.estado IN('Pendiente','Realizada','En_subasta','asignada','en_tramite','aprobado_prefiltro')
					AND csc.estado='F3' AND estado_autorizado='autorizado' AND uno.id_usuario=' . $id_usuario . ' AND uno.estado='Activo' AND csv.fecha BETWEEN :fi AND :ff AND oc.mer_idservicio IS NULL AND csv.cant_vehiculo>0";
					// AND csc.estado="F3" AND estado_autorizado="autorizado" AND uno.id_usuario=' . $id_usuario . ' AND uno.estado="Activo" AND csv.fecha>= :Fi AND oc.mer_idservicio IS NULL';

					// Filtros opcionales
					if ($cliente !== null) {
						$sql_datos .= " AND cli.id = :cliente";
					}

					if ($empresa !== null) {
						$sql_datos .= " AND cli.empresa = :empresa";
					}

					// $query .= " GROUP BY coti.n_cotizacion ORDER BY coti.id DESC";
					$sql_datos .= " GROUP BY csv.nundoc_solicitud ORDER BY csv.nundoc_solicitud DESC";
					// Preparar y ejecutar consulta principal
					$sql = $this->_db3->prepare($sql_datos);
					// $params_main = [':Fi' => "2025-01-01"];
					$params_main = [':fi' => $fecha_inicial, ':ff' => $fecha_final];
					if (!empty($cliente)) {
						$params_main[':cliente'] = $cliente;
					}
					if (!empty($empresa)) {
						$params_main[':empresa'] = $empresa;
					}

					$sql->execute($params_main);

					$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);

					// $sql_datos->execute();
					// $resultado = $sql_datos->fetchAll(PDO::FETCH_ASSOC);
					if ($resultado) {
						foreach ($resultado as  $value) {
							$sql_contador = $this->_db3->prepare("SELECT COUNT(*) AS numero_placas FROM cmx_solicitud_vehiculo2 csv2 
							INNER JOIN cmx_preestudio_solicitudes_servicio psv ON csv2.nundoc_solicitud = psv.id_servicio_cliente 
							INNER JOIN cmx_cotizaciones_serviciocliente csc ON csc.n_cotizacion=csv2.n_cotizacion
							INNER JOIN cmx_agencia_usuario uno ON csv2.agencia=uno.id_agencia
							WHERE csv2.nundoc_solicitud='" . $value['nundoc_solicitud'] . "' AND csc.estado='F3' AND estado_autorizado='autorizado' AND uno.id_usuario='" . $id_usuario . "' AND uno.estado='Activo' AND csv2.fecha BETWEEN '" . $fecha_inicial . "' AND '" . $fecha_final . "'");
							$sql_contador->execute();
							$resultado_contador = $sql_contador->fetchAll(PDO::FETCH_ASSOC);
							// Combinar los resultados
							$value['numero_placas'] = $resultado_contador[0]['numero_placas'];

							// Añadir al array de respuesta
							$response[] = $value;
						}
					}
				} elseif ($filtros == '0') {
					/* Se cambia la de tabla de donde se saca el el estado par controlar las solicitudes de servicio l.estado por csv.estado */
					$sql_datos = "SELECT g.item,g.tipo_mercancia,g.flete,g.peso_neto_tn,csv.estado AS esoli,csv.nundoc_solicitud AS elid, csv.fecha,csv.hora, csv.origen, csv.destino, csv.tipo_vehiculo, csv.estado,csv.idpareja_origen_destino, csv.fecha, csv.hora,
					pp.nombre, g.id AS idnegocio,csv.peso_kg,CONCAT (M.municipio,' - ',M.depto) AS origen_solicitud,CONCAT(M2.municipio,' - ',M2.depto) AS destino_solicitud,
					csc.* ,csv.cant_vehiculo, csv.cant_disponible,g.tipo_servicio_mer,g.peso_bruto_kg,g.total_tarifa,M.rndc_codigo_ciudad AS origen_rndc,g.itr,csv.nundoc_solicitud,csv.prioritaria,cli.empresa,csv.escenario_id,csv.origen AS Origen_Enturnar,
					pe.fecha_estimada_entrega AS fecha_cargue, pe.hora_estimada AS hora_cargue,M.rndc_codigo_ciudad AS Rndc_Origen, M2.rndc_codigo_ciudad AS Rndc_Destino,M.latitud AS latitud_origen,M.longitud as longitud_origen, cli.id AS Cliente_Id,g.peso_neto_kg,
					dp.nivel,
					dp.motivo,
					dp.usuario,
					CONCAT(dp.fecha,' ',dp.hora) AS FechaPrioridad,
					dp.usuario_aprueba,
					CONCAT(dp.fecha_aprueba,' ',dp.hora_aprueba) AS FechaAprueba

					FROM cmx_cotizaciones_serviciocliente AS csc
					INNER JOIN cmx_solicitud_vehiculo2 csv 	ON csc.n_cotizacion=csv.n_cotizacion 
					LEFT JOIN cmx_log_solicitudvehiculo l ON csv.nundoc_solicitud=l.id_solictud
					INNER JOIN cmx_detalle_mercancia2 g ON csv.idpareja_origen_destino=g.id
					INNER JOIN cmx_para_tipo_vehiculo pp ON csv.tipo_vehiculo=pp.id
					INNER JOIN cmx_agencia_usuario uno ON csv.agencia=uno.id_agencia
					INNER JOIN cmx_municipios M ON csv.origen=M.rndc_codigo_ciudad
					INNER JOIN cmx_municipios M2 ON csv.destino=M2.rndc_codigo_ciudad
					INNER JOIN cmx_clientes cli ON csc.id_cliente = cli.id
					LEFT JOIN cmx_orden_cargue oc ON csv.nundoc_solicitud=oc.mer_idservicio
					LEFT JOIN cmx_remesa_ordencargue ro ON oc.id=ro.id_orden_cargue
					LEFT JOIN cmx_remesa rm ON ro.id_remesa=rm.id
					LEFT JOIN cmx_manifiesto_remesa mr ON rm.id=mr.id_remesa
					LEFT JOIN cmx_manifiesto ma ON mr.id_manifiesto=ma.id
					LEFT JOIN  cmx_ruta_puntosentrega pe ON csv.nundoc_solicitud = pe.cod_ini_ruta
					LEFT JOIN cmx_detalle_prioridad dp ON csv.nundoc_solicitud=dp.numdoc_solicitud
					WHERE csv.estado IN('Pendiente','Realizada','En_subasta','asignada','en_tramite','aprobado_prefiltro')
					AND csc.estado='F3' AND estado_autorizado='autorizado' AND uno.id_usuario=' . $id_usuario . ' AND uno.estado='Activo' AND csv.fecha BETWEEN :fi AND :ff AND oc.mer_idservicio IS NULL AND l.id_solictud IS NULL";
					// AND csc.estado="F3" AND estado_autorizado="autorizado" AND uno.id_usuario=' . $id_usuario . ' AND uno.estado="Activo" AND csv.fecha>= :Fi AND oc.mer_idservicio IS NULL';

					// Filtros opcionales
					if ($cliente !== null) {
						$sql_datos .= " AND cli.id = :cliente";
					}

					if ($empresa !== null) {
						$sql_datos .= " AND cli.empresa = :empresa";
					}

					// $query .= " GROUP BY coti.n_cotizacion ORDER BY coti.id DESC";
					$sql_datos .= " GROUP BY csv.nundoc_solicitud ORDER BY csv.nundoc_solicitud DESC";
					// Preparar y ejecutar consulta principal
					$sql = $this->_db3->prepare($sql_datos);
					// $params_main = [':Fi' => "2025-01-01"];
					$params_main = [':fi' => $fecha_inicial, ':ff' => $fecha_final];
					if (!empty($cliente)) {
						$params_main[':cliente'] = $cliente;
					}
					if (!empty($empresa)) {
						$params_main[':empresa'] = $empresa;
					}

					$sql->execute($params_main);

					$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);

					// $sql_datos->execute();
					// $resultado = $sql_datos->fetchAll(PDO::FETCH_ASSOC);
					if ($resultado) {
						foreach ($resultado as  $value) {
							$sql_contador = $this->_db3->prepare("SELECT COUNT(*) AS numero_placas FROM cmx_solicitud_vehiculo2 csv2 
							INNER JOIN cmx_preestudio_solicitudes_servicio psv ON csv2.nundoc_solicitud = psv.id_servicio_cliente 
							INNER JOIN cmx_cotizaciones_serviciocliente csc ON csc.n_cotizacion=csv2.n_cotizacion
							INNER JOIN cmx_agencia_usuario uno ON csv2.agencia=uno.id_agencia
							WHERE csv2.nundoc_solicitud='" . $value['nundoc_solicitud'] . "' AND csc.estado='F3' AND estado_autorizado='autorizado' AND uno.id_usuario='" . $id_usuario . "' AND uno.estado='Activo' AND csv2.fecha BETWEEN '" . $fecha_inicial . "' AND '" . $fecha_final . "'");
							$sql_contador->execute();
							$resultado_contador = $sql_contador->fetchAll(PDO::FETCH_ASSOC);
							// Combinar los resultados
							$value['numero_placas'] = $resultado_contador[0]['numero_placas'];

							// Añadir al array de respuesta
							$response[] = $value;
						}
					}
				} elseif ($filtros == 'Propuesta') {
					/* Se cambia la de tabla de donde se saca el el estado par controlar las solicitudes de servicio l.estado por csv.estado */
					$sql_datos = "SELECT g.item,g.tipo_mercancia,g.flete,g.peso_neto_tn,csv.estado AS esoli,csv.nundoc_solicitud AS elid, csv.fecha,csv.hora, csv.origen, csv.destino, csv.tipo_vehiculo, csv.estado,csv.idpareja_origen_destino, csv.fecha, csv.hora,
					pp.nombre, g.id AS idnegocio,csv.peso_kg,CONCAT (M.municipio,' - ',M.depto) AS origen_solicitud,CONCAT(M2.municipio,' - ',M2.depto) AS destino_solicitud,
					csc.* ,csv.cant_vehiculo, csv.cant_disponible,g.tipo_servicio_mer,g.peso_bruto_kg,g.total_tarifa,M.rndc_codigo_ciudad AS origen_rndc,g.itr,csv.nundoc_solicitud,csv.prioritaria,cli.empresa,csv.escenario_id,csv.origen AS Origen_Enturnar,
					pe.fecha_estimada_entrega AS fecha_cargue, pe.hora_estimada AS hora_cargue,M.rndc_codigo_ciudad AS Rndc_Origen, M2.rndc_codigo_ciudad AS Rndc_Destino,M.latitud AS latitud_origen,M.longitud as longitud_origen, cli.id AS Cliente_Id,g.peso_neto_kg,
					dp.nivel,
					dp.motivo,
					dp.usuario,
					CONCAT(dp.fecha,' ',dp.hora) AS FechaPrioridad,
					dp.usuario_aprueba,
					CONCAT(dp.fecha_aprueba,' ',dp.hora_aprueba) AS FechaAprueba
					FROM cmx_cotizaciones_serviciocliente AS csc
					INNER JOIN cmx_solicitud_vehiculo2 csv 	ON csc.n_cotizacion=csv.n_cotizacion 
					LEFT JOIN cmx_log_solicitudvehiculo l ON csv.nundoc_solicitud=l.id_solictud
					INNER JOIN cmx_detalle_mercancia2 g ON csv.idpareja_origen_destino=g.id
					INNER JOIN cmx_para_tipo_vehiculo pp ON csv.tipo_vehiculo=pp.id
					INNER JOIN cmx_agencia_usuario uno ON csv.agencia=uno.id_agencia
					INNER JOIN cmx_municipios M ON csv.origen=M.rndc_codigo_ciudad
					INNER JOIN cmx_municipios M2 ON csv.destino=M2.rndc_codigo_ciudad
					INNER JOIN cmx_clientes cli ON csc.id_cliente = cli.id
					LEFT JOIN cmx_orden_cargue oc ON csv.nundoc_solicitud=oc.mer_idservicio
					LEFT JOIN cmx_remesa_ordencargue ro ON oc.id=ro.id_orden_cargue
					LEFT JOIN cmx_remesa rm ON ro.id_remesa=rm.id
					LEFT JOIN cmx_manifiesto_remesa mr ON rm.id=mr.id_remesa
					LEFT JOIN cmx_manifiesto ma ON mr.id_manifiesto=ma.id
					LEFT JOIN  cmx_ruta_puntosentrega pe ON csv.nundoc_solicitud = pe.cod_ini_ruta
					LEFT JOIN cmx_detalle_prioridad dp ON csv.nundoc_solicitud=dp.numdoc_solicitud
					WHERE csv.estado IN('Pendiente','Realizada','En_subasta','asignada','en_tramite','aprobado_prefiltro')
					AND csc.estado='F3' AND estado_autorizado='autorizado' AND uno.id_usuario=' . $id_usuario . ' AND uno.estado='Activo' AND csv.fecha BETWEEN :fi AND :ff AND oc.mer_idservicio IS NULL AND csv.prioritaria='Propuesta'";

					$sql_datos .= " GROUP BY csv.nundoc_solicitud ORDER BY csv.nundoc_solicitud DESC";
					// Preparar y ejecutar consulta principal
					$sql = $this->_db3->prepare($sql_datos);
					$params_main = [':fi' => $fecha_inicial, ':ff' => $fecha_final];

					$sql->execute($params_main);

					$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
					if ($resultado) {
						foreach ($resultado as  $value) {
							$sql_contador = $this->_db3->prepare("SELECT COUNT(*) AS numero_placas FROM cmx_solicitud_vehiculo2 csv2 
							INNER JOIN cmx_preestudio_solicitudes_servicio psv ON csv2.nundoc_solicitud = psv.id_servicio_cliente 
							INNER JOIN cmx_cotizaciones_serviciocliente csc ON csc.n_cotizacion=csv2.n_cotizacion
							INNER JOIN cmx_agencia_usuario uno ON csv2.agencia=uno.id_agencia
							WHERE csv2.nundoc_solicitud='" . $value['nundoc_solicitud'] . "' AND csc.estado='F3' AND estado_autorizado='autorizado' AND uno.id_usuario='" . $id_usuario . "' AND uno.estado='Activo' AND csv2.fecha BETWEEN '" . $fecha_inicial . "' AND '" . $fecha_final . "'");
							$sql_contador->execute();
							$resultado_contador = $sql_contador->fetchAll(PDO::FETCH_ASSOC);
							// Combinar los resultados
							$value['numero_placas'] = $resultado_contador[0]['numero_placas'];

							// Añadir al array de respuesta
							$response[] = $value;
						}
					}
				} elseif ($filtros == 'Aprobada') {
					/* Se cambia la de tabla de donde se saca el el estado par controlar las solicitudes de servicio l.estado por csv.estado */
					$sql_datos = "SELECT g.item,g.tipo_mercancia,g.flete,g.peso_neto_tn,csv.estado AS esoli,csv.nundoc_solicitud AS elid, csv.fecha,csv.hora, csv.origen, csv.destino, csv.tipo_vehiculo, csv.estado,csv.idpareja_origen_destino, csv.fecha, csv.hora,
					pp.nombre, g.id AS idnegocio,csv.peso_kg,CONCAT (M.municipio,' - ',M.depto) AS origen_solicitud,CONCAT(M2.municipio,' - ',M2.depto) AS destino_solicitud,
					csc.* ,csv.cant_vehiculo, csv.cant_disponible,g.tipo_servicio_mer,g.peso_bruto_kg,g.total_tarifa,M.rndc_codigo_ciudad AS origen_rndc,g.itr,csv.nundoc_solicitud,csv.prioritaria,cli.empresa,csv.escenario_id,csv.origen AS Origen_Enturnar,
					pe.fecha_estimada_entrega AS fecha_cargue, pe.hora_estimada AS hora_cargue,M.rndc_codigo_ciudad AS Rndc_Origen, M2.rndc_codigo_ciudad AS Rndc_Destino,M.latitud AS latitud_origen,M.longitud as longitud_origen, cli.id AS Cliente_Id,g.peso_neto_kg,
					dp.nivel,
					dp.motivo,
					dp.usuario,
					CONCAT(dp.fecha,' ',dp.hora) AS FechaPrioridad,
					dp.usuario_aprueba,
					CONCAT(dp.fecha_aprueba,' ',dp.hora_aprueba) AS FechaAprueba
					FROM cmx_cotizaciones_serviciocliente AS csc
					INNER JOIN cmx_solicitud_vehiculo2 csv 	ON csc.n_cotizacion=csv.n_cotizacion 
					LEFT JOIN cmx_log_solicitudvehiculo l ON csv.nundoc_solicitud=l.id_solictud
					INNER JOIN cmx_detalle_mercancia2 g ON csv.idpareja_origen_destino=g.id
					INNER JOIN cmx_para_tipo_vehiculo pp ON csv.tipo_vehiculo=pp.id
					INNER JOIN cmx_agencia_usuario uno ON csv.agencia=uno.id_agencia
					INNER JOIN cmx_municipios M ON csv.origen=M.rndc_codigo_ciudad
					INNER JOIN cmx_municipios M2 ON csv.destino=M2.rndc_codigo_ciudad
					INNER JOIN cmx_clientes cli ON csc.id_cliente = cli.id
					LEFT JOIN cmx_orden_cargue oc ON csv.nundoc_solicitud=oc.mer_idservicio
					LEFT JOIN cmx_remesa_ordencargue ro ON oc.id=ro.id_orden_cargue
					LEFT JOIN cmx_remesa rm ON ro.id_remesa=rm.id
					LEFT JOIN cmx_manifiesto_remesa mr ON rm.id=mr.id_remesa
					LEFT JOIN cmx_manifiesto ma ON mr.id_manifiesto=ma.id
					LEFT JOIN  cmx_ruta_puntosentrega pe ON csv.nundoc_solicitud = pe.cod_ini_ruta
					LEFT JOIN cmx_detalle_prioridad dp ON csv.nundoc_solicitud=dp.numdoc_solicitud
					WHERE csv.estado IN('Pendiente','Realizada','En_subasta','asignada','en_tramite','aprobado_prefiltro')
					AND csc.estado='F3' AND estado_autorizado='autorizado' AND uno.id_usuario=' . $id_usuario . ' AND uno.estado='Activo' AND csv.fecha BETWEEN :fi AND :ff AND oc.mer_idservicio IS NULL AND csv.prioritaria='Aprobada'";

					$sql_datos .= " GROUP BY csv.nundoc_solicitud ORDER BY csv.nundoc_solicitud DESC";
					// Preparar y ejecutar consulta principal
					$sql = $this->_db3->prepare($sql_datos);
					$params_main = [':fi' => $fecha_inicial, ':ff' => $fecha_final];

					$sql->execute($params_main);

					$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);

					if ($resultado) {
						foreach ($resultado as  $value) {
							$sql_contador = $this->_db3->prepare("SELECT COUNT(*) AS numero_placas FROM cmx_solicitud_vehiculo2 csv2 
							INNER JOIN cmx_preestudio_solicitudes_servicio psv ON csv2.nundoc_solicitud = psv.id_servicio_cliente 
							INNER JOIN cmx_cotizaciones_serviciocliente csc ON csc.n_cotizacion=csv2.n_cotizacion
							INNER JOIN cmx_agencia_usuario uno ON csv2.agencia=uno.id_agencia
							WHERE csv2.nundoc_solicitud='" . $value['nundoc_solicitud'] . "' AND csc.estado='F3' AND estado_autorizado='autorizado' AND uno.id_usuario='" . $id_usuario . "' AND uno.estado='Activo' AND csv2.fecha BETWEEN '" . $fecha_inicial . "' AND '" . $fecha_final . "'");
							$sql_contador->execute();
							$resultado_contador = $sql_contador->fetchAll(PDO::FETCH_ASSOC);
							// Combinar los resultados
							$value['numero_placas'] = $resultado_contador[0]['numero_placas'];

							// Añadir al array de respuesta
							$response[] = $value;
						}
					}
				} else {
					/* Se cambia la de tabla de donde se saca el el estado par controlar las solicitudes de servicio l.estado por csv.estado */
					$sql_datos = "SELECT g.item,g.tipo_mercancia,g.flete,g.peso_neto_tn,csv.estado AS esoli,csv.nundoc_solicitud AS elid, csv.fecha,csv.hora, csv.origen, csv.destino, csv.tipo_vehiculo, csv.estado,csv.idpareja_origen_destino, csv.fecha, csv.hora,
					pp.nombre, g.id AS idnegocio,csv.peso_kg,CONCAT (M.municipio,' - ',M.depto) AS origen_solicitud,CONCAT(M2.municipio,' - ',M2.depto) AS destino_solicitud,
					csc.* ,csv.cant_vehiculo, csv.cant_disponible,g.tipo_servicio_mer,g.peso_bruto_kg,g.total_tarifa,M.rndc_codigo_ciudad AS origen_rndc,g.itr,csv.nundoc_solicitud,csv.prioritaria,cli.empresa,csv.escenario_id,csv.origen AS Origen_Enturnar,
					pe.fecha_estimada_entrega AS fecha_cargue, pe.hora_estimada AS hora_cargue,M.rndc_codigo_ciudad AS Rndc_Origen, M2.rndc_codigo_ciudad AS Rndc_Destino,M.latitud AS latitud_origen,M.longitud as longitud_origen, cli.id AS Cliente_Id,g.peso_neto_kg,
					dp.nivel,
					dp.motivo,
					dp.usuario,
					CONCAT(dp.fecha,' ',dp.hora) AS FechaPrioridad,
					dp.usuario_aprueba,
					CONCAT(dp.fecha_aprueba,' ',dp.hora_aprueba) AS FechaAprueba
					FROM cmx_cotizaciones_serviciocliente AS csc
					INNER JOIN cmx_solicitud_vehiculo2 csv 	ON csc.n_cotizacion=csv.n_cotizacion 
					LEFT JOIN cmx_log_solicitudvehiculo l ON csv.nundoc_solicitud=l.id_solictud
					INNER JOIN cmx_detalle_mercancia2 g ON csv.idpareja_origen_destino=g.id
					INNER JOIN cmx_para_tipo_vehiculo pp ON csv.tipo_vehiculo=pp.id
					INNER JOIN cmx_agencia_usuario uno ON csv.agencia=uno.id_agencia
					INNER JOIN cmx_municipios M ON csv.origen=M.rndc_codigo_ciudad
					INNER JOIN cmx_municipios M2 ON csv.destino=M2.rndc_codigo_ciudad
					INNER JOIN cmx_clientes cli ON csc.id_cliente = cli.id
					LEFT JOIN cmx_orden_cargue oc ON csv.nundoc_solicitud=oc.mer_idservicio
					LEFT JOIN cmx_remesa_ordencargue ro ON oc.id=ro.id_orden_cargue
					LEFT JOIN cmx_remesa rm ON ro.id_remesa=rm.id
					LEFT JOIN cmx_manifiesto_remesa mr ON rm.id=mr.id_remesa
					LEFT JOIN cmx_manifiesto ma ON mr.id_manifiesto=ma.id
					LEFT JOIN  cmx_ruta_puntosentrega pe ON csv.nundoc_solicitud = pe.cod_ini_ruta
					LEFT JOIN cmx_detalle_prioridad dp ON csv.nundoc_solicitud=dp.numdoc_solicitud
					WHERE csv.estado IN('Pendiente','Realizada','En_subasta','asignada','en_tramite','aprobado_prefiltro')
					AND csc.estado='F3' AND estado_autorizado='autorizado' AND uno.id_usuario=$id_usuario  AND uno.estado='Activo' AND csv.fecha BETWEEN :fi AND :ff AND oc.mer_idservicio IS NULL";
					// AND csc.estado="F3" AND estado_autorizado="autorizado" AND uno.id_usuario=' . $id_usuario . ' AND uno.estado="Activo" AND csv.fecha>= :Fi AND oc.mer_idservicio IS NULL';

					// Filtros opcionales
					if ($cliente !== null) {
						$sql_datos .= " AND cli.id = :cliente";
					}

					if ($empresa !== null) {
						$sql_datos .= " AND cli.empresa = :empresa";
					}

					// $query .= " GROUP BY coti.n_cotizacion ORDER BY coti.id DESC";
					$sql_datos .= " GROUP BY csv.nundoc_solicitud ORDER BY csv.nundoc_solicitud DESC";
					// Preparar y ejecutar consulta principal
					$sql = $this->_db3->prepare($sql_datos);
					// $params_main = [':Fi' => "2025-01-01"];
					$params_main = [':fi' => $fecha_inicial, ':ff' => $fecha_final];
					if (!empty($cliente)) {
						$params_main[':cliente'] = $cliente;
					}
					if (!empty($empresa)) {
						$params_main[':empresa'] = $empresa;
					}

					$sql->execute($params_main);

					$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);

					if ($resultado) {
						foreach ($resultado as  $value) {
							$sql_contador = $this->_db3->prepare("SELECT COUNT(*) AS numero_placas FROM cmx_solicitud_vehiculo2 csv2 
							INNER JOIN cmx_preestudio_solicitudes_servicio psv ON csv2.nundoc_solicitud = psv.id_servicio_cliente 
							INNER JOIN cmx_cotizaciones_serviciocliente csc ON csc.n_cotizacion=csv2.n_cotizacion
							INNER JOIN cmx_agencia_usuario uno ON csv2.agencia=uno.id_agencia
							WHERE csv2.nundoc_solicitud='" . $value['nundoc_solicitud'] . "' AND csc.estado='F3' AND estado_autorizado='autorizado' AND uno.id_usuario='" . $id_usuario . "' AND uno.estado='Activo' AND csv2.fecha BETWEEN '" . $fecha_inicial . "' AND '" . $fecha_final . "'");
							$sql_contador->execute();
							$resultado_contador = $sql_contador->fetchAll(PDO::FETCH_ASSOC);
							// Combinar los resultados
							$value['numero_placas'] = $resultado_contador[0]['numero_placas'];

							// Añadir al array de respuesta
							$response[] = $value;
						}
					}
				}
			} else if ($estado == "Prioritaria") {
				// Construcción de la consulta base
				$sql = 'SELECT g.item, g.tipo_mercancia, g.flete, g.peso_neto_tn, csv.estado AS esoli, csv.nundoc_solicitud AS elid, 
											csv.fecha, csv.hora, csv.origen, csv.destino, csv.tipo_vehiculo, csv.estado, csv.idpareja_origen_destino, 
											pp.nombre, g.id AS idnegocio, csv.peso_kg, 
											CONCAT(M.municipio, "-", M.depto) AS origen_solicitud, 
											CONCAT(M2.municipio, "-", M2.depto) AS destino_solicitud, 
											csc.*, csv.cant_vehiculo, csv.cant_disponible, g.tipo_servicio_mer, g.peso_bruto_kg, g.total_tarifa, 
											M.rndc_codigo_ciudad AS origen_rndc, g.itr, csv.nundoc_solicitud,csv.prioritaria,cli.empresa,csv.escenario_id
								FROM cmx_cotizaciones_serviciocliente AS csc
								INNER JOIN cmx_solicitud_vehiculo2 csv ON csc.n_cotizacion = csv.n_cotizacion AND (csv.prioritaria = "Propuesta" OR csv.prioritaria = "Aprobada")
								INNER JOIN cmx_detalle_mercancia2 g ON csv.idpareja_origen_destino = g.id
								INNER JOIN cmx_para_tipo_vehiculo pp ON csv.tipo_vehiculo = pp.id
								INNER JOIN cmx_agencia_usuario uno ON csv.agencia = uno.id_agencia
								INNER JOIN cmx_municipios M ON csv.origen = M.rndc_codigo_ciudad
								INNER JOIN cmx_municipios M2 ON csv.destino = M2.rndc_codigo_ciudad
								INNER JOIN cmx_clientes cli ON csc.id_cliente = cli.id
								LEFT JOIN cmx_orden_cargue oc ON csv.nundoc_solicitud=oc.mer_idservicio
								LEFT JOIN cmx_remesa_ordencargue ro ON oc.id=ro.id_orden_cargue
								LEFT JOIN cmx_remesa rm ON ro.id_remesa=rm.id
								LEFT JOIN cmx_manifiesto_remesa mr ON rm.id=mr.id_remesa
								LEFT JOIN cmx_manifiesto ma ON mr.id_manifiesto=ma.id
								LEFT JOIN cmx_log_solicitudvehiculo l ON csv.nundoc_solicitud=l.id_solictud
								WHERE csv.estado IN ("Pendiente", "Realizada", "En_subasta", "asignada", "en_tramite", "aprobado_prefiltro") 
								AND csc.estado = "F3" 
								AND estado_autorizado = "autorizado" 
								AND uno.id_usuario = :id_usuario 
								AND uno.estado = "Activo"';

				// Parámetros de la consulta
				$params = [
					':id_usuario' => $id_usuario
				];

				// Agregar filtro por cliente si está definido
				if (!empty($cliente)) {
					$sql .= " AND cli.id = :cliente";
					$params[':cliente'] = $cliente;
				}

				// Finalizar la consulta con GROUP BY y ORDER BY
				$sql .= " GROUP BY csv.nundoc_solicitud ORDER BY csv.nundoc_solicitud DESC";

				// Preparar y ejecutar la consulta principal
				try {
					$stmt = $this->_db3->prepare($sql);
					$stmt->execute($params);
					$resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);

					$response = [];

					if ($resultado) {
						foreach ($resultado as $value) {
							// Consulta para contar placas
							$sql_contador = "
									SELECT COUNT(*) AS numero_placas 
									FROM cmx_solicitud_vehiculo2 csv2 
									INNER JOIN cmx_preestudio_solicitudes_servicio psv ON csv2.nundoc_solicitud = psv.id_servicio_cliente 
									INNER JOIN cmx_cotizaciones_serviciocliente csc ON csc.n_cotizacion = csv2.n_cotizacion
									INNER JOIN cmx_agencia_usuario uno ON csv2.agencia = uno.id_agencia
									WHERE csv2.nundoc_solicitud = :nundoc_solicitud 
									AND csc.estado = 'F3' 
									AND estado_autorizado = 'autorizado' 
									AND uno.id_usuario = :id_usuario 
									AND uno.estado = 'Activo'
									AND csv2.fecha BETWEEN :fecha_inicial AND :fecha_final";

							$stmt_contador = $this->_db3->prepare($sql_contador);
							$stmt_contador->execute([
								':nundoc_solicitud' => $value['nundoc_solicitud'],
								':id_usuario' => $id_usuario,
								':fecha_inicial' => $fecha_inicial,
								':fecha_final' => $fecha_final
							]);

							$resultado_contador = $stmt_contador->fetch(PDO::FETCH_ASSOC);
							$value['numero_placas'] = $resultado_contador['numero_placas'] ?? 0;

							// Agregar al array de respuesta
							$response[] = $value;
						}
					}
				} catch (PDOException $e) {
					error_log("Error en la consulta SQL: " . $e->getMessage());
					$response = ['error' => 'Error al obtener los datos'];
				}
			} else if ($estado == "Pendiente") {
				/* Se cambia la de tabla de donde se saca el el estado par controlar las solicitudes de servicio l.estado por csv.estado */
				$sql_datos = 'SELECT g.item,g.tipo_mercancia,g.flete,g.peso_neto_tn,csv.estado AS esoli,csv.nundoc_solicitud AS elid, csv.fecha,csv.hora, csv.origen, csv.destino, csv.tipo_vehiculo, csv.estado,csv.idpareja_origen_destino, csv.fecha, csv.hora,
								pp.nombre, g.id AS idnegocio,csv.peso_kg,CONCAT (M.municipio,"-",M.depto) AS origen_solicitud,CONCAT(M2.municipio,"-",M2.depto) AS destino_solicitud,
									csc.* ,csv.cant_vehiculo, csv.cant_disponible,g.tipo_servicio_mer,g.peso_bruto_kg,g.total_tarifa,M.rndc_codigo_ciudad AS origen_rndc,g.itr,csv.nundoc_solicitud,csv.prioritaria,cli.empresa,csv.escenario_id
									FROM cmx_cotizaciones_serviciocliente AS csc
									INNER JOIN cmx_solicitud_vehiculo2 csv 	ON csc.n_cotizacion=csv.n_cotizacion
									LEFT JOIN cmx_log_solicitudvehiculo l ON csv.nundoc_solicitud=l.id_solictud
									INNER JOIN cmx_detalle_mercancia2 g ON csv.idpareja_origen_destino=g.id
									INNER JOIN cmx_para_tipo_vehiculo pp ON csv.tipo_vehiculo=pp.id
									INNER JOIN cmx_agencia_usuario uno ON csv.agencia=uno.id_agencia
									INNER JOIN cmx_municipios M ON csv.origen=M.rndc_codigo_ciudad
									INNER JOIN cmx_municipios M2 ON csv.destino=M2.rndc_codigo_ciudad
									INNER JOIN cmx_clientes cli ON csc.id_cliente = cli.id
									WHERE csv.estado="Pendiente"
									AND csc.estado="F3" AND estado_autorizado="autorizado" AND uno.id_usuario=' . $id_usuario . ' AND uno.estado="Activo" AND csv.fecha >= "2025-01-01"';

				// Parámetros de la consulta
				$params = [];

				// Agregar filtro por cliente si está definido
				if (!empty($cliente)) {
					$sql_datos .= " AND cli.id = :cliente";
					$params[':cliente'] = $cliente;
				}

				// Finalizar la consulta con GROUP BY y ORDER BY
				$sql_datos .= " GROUP BY csv.nundoc_solicitud ORDER BY csv.nundoc_solicitud DESC";

				$stmt = $this->_db3->prepare($sql_datos);
				$stmt->execute($params);
				$resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);

				if ($resultado) {
					foreach ($resultado as  $value) {
						$sql_contador = $this->_db3->prepare("SELECT COUNT(*) AS numero_placas FROM cmx_solicitud_vehiculo2 csv2 
																	INNER JOIN cmx_preestudio_solicitudes_servicio psv ON csv2.nundoc_solicitud = psv.id_servicio_cliente 
																	INNER JOIN cmx_cotizaciones_serviciocliente csc ON csc.n_cotizacion=csv2.n_cotizacion
																	INNER JOIN cmx_agencia_usuario uno ON csv2.agencia=uno.id_agencia
																	WHERE csv2.nundoc_solicitud='" . $value['nundoc_solicitud'] . "' AND csc.estado='F3' AND estado_autorizado='autorizado' AND uno.id_usuario='" . $id_usuario . "' AND uno.estado='Activo' AND csv2.fecha BETWEEN '" . $fecha_inicial . "' AND '" . $fecha_final . "'");
						$sql_contador->execute();
						$resultado_contador = $sql_contador->fetchAll(PDO::FETCH_ASSOC);
						// Combinar los resultados
						$value['numero_placas'] = $resultado_contador[0]['numero_placas'];

						// Añadir al array de respuesta
						$response[] = $value;
					}
				}
			} else if ($estado == "En_Curso") {
				/* Se cambia la de tabla de donde se saca el el estado par controlar las solicitudes de servicio l.estado por csv.estado */
				$sql_datos = 'SELECT g.item,g.tipo_mercancia,g.flete,g.peso_neto_tn,csv.estado AS esoli,csv.nundoc_solicitud AS elid, csv.fecha,csv.hora, csv.origen, csv.destino, csv.tipo_vehiculo, csv.estado,csv.idpareja_origen_destino, csv.fecha, csv.hora,
								pp.nombre, g.id AS idnegocio,csv.peso_kg, CONCAT (M.municipio,"-",M.depto) AS origen_solicitud,CONCAT(M2.municipio,"-",M2.depto) AS destino_solicitud,csc.*,csv.cant_vehiculo, csv.cant_disponible,
								g.tipo_servicio_mer,g.peso_bruto_kg,g.total_tarifa,	M.rndc_codigo_ciudad AS origen_rndc,g.itr,csv.nundoc_solicitud,
								CASE 
										WHEN ec.estado IS NOT NULL THEN ec.estado 
										WHEN ses.estado IS NOT NULL THEN ses.estado 
										ELSE "Sin Estado"
								END AS estado_estudio,cli.empresa,csv.escenario_id
								FROM cmx_cotizaciones_serviciocliente AS csc
								INNER JOIN cmx_solicitud_vehiculo2 csv ON csc.n_cotizacion=csv.n_cotizacion
								LEFT JOIN cmx_log_solicitudvehiculo l ON csv.nundoc_solicitud=l.id_solictud
								INNER JOIN cmx_detalle_mercancia2 g ON csv.idpareja_origen_destino=g.id
								INNER JOIN cmx_para_tipo_vehiculo pp ON csv.tipo_vehiculo=pp.id
								INNER JOIN cmx_agencia_usuario uno ON csv.agencia=uno.id_agencia
								INNER JOIN cmx_municipios M ON csv.origen=M.rndc_codigo_ciudad
								INNER JOIN cmx_municipios M2 ON csv.destino=M2.rndc_codigo_ciudad
								INNER JOIN cmx_clientes cli ON csc.id_cliente = cli.id
								LEFT JOIN cmx_preestudio_solicitudes_servicio se ON csv.nundoc_solicitud = se.id_servicio_cliente
	            LEFT JOIN cmx_estudiov_completo ec ON se.id_solicitudpreestudio = ec.id_estudio AND ec.estado_actu = 1
	            LEFT JOIN cmx_solicitudes_estados ses ON se.id_solicitudpreestudio = ses.id_solicitud AND ses.estado_actual = 1
								WHERE csv.estado IN("En_subasta","asignada","en_tramite","aprobado_prefiltro") 
								AND csc.estado="F3" AND estado_autorizado="autorizado" AND uno.id_usuario=' . $id_usuario . ' AND uno.estado="Activo" AND csv.fecha >= "2025-01-01"';

				// Parámetros de la consulta
				$params = [];

				// Agregar filtro por cliente si está definido
				if (!empty($cliente)) {
					$sql_datos .= " AND cli.id = :cliente";
					$params[':cliente'] = $cliente;
				}

				// Finalizar la consulta con GROUP BY y ORDER BY
				$sql_datos .= " GROUP BY csv.nundoc_solicitud ORDER BY csv.nundoc_solicitud DESC";

				$stmt = $this->_db3->prepare($sql_datos);
				$stmt->execute($params);
				$resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);

				if ($resultado) {
					foreach ($resultado as  $value) {
						$sql_contador = $this->_db3->prepare("SELECT COUNT(*) AS numero_placas FROM cmx_solicitud_vehiculo2 csv2 
									INNER JOIN cmx_preestudio_solicitudes_servicio psv ON csv2.nundoc_solicitud = psv.id_servicio_cliente 
									INNER JOIN cmx_cotizaciones_serviciocliente csc ON csc.n_cotizacion=csv2.n_cotizacion
									INNER JOIN cmx_agencia_usuario uno ON csv2.agencia=uno.id_agencia
									WHERE csv2.nundoc_solicitud='" . $value['nundoc_solicitud'] . "' AND csc.estado='F3' AND estado_autorizado='autorizado' AND uno.id_usuario='" . $id_usuario . "' AND uno.estado='Activo' AND csv2.fecha BETWEEN '" . $fecha_inicial . "' AND '" . $fecha_final . "'");
						$sql_contador->execute();
						$resultado_contador = $sql_contador->fetchAll(PDO::FETCH_ASSOC);

						// Combinar los resultados
						$value['numero_placas'] = $resultado_contador[0]['numero_placas'];

						// Añadir al array de respuesta
						$response[] = $value;
					}
				}
			} else {
				/* Se cambia la de tabla de donde se saca el el estado par controlar las solicitudes de servicio l.estado por csv.estado */
				$sql_datos = $this->_db3->prepare('SELECT g.item,g.tipo_mercancia,g.flete,g.peso_neto_tn,csv.estado AS esoli,csv.nundoc_solicitud AS elid, csv.fecha,csv.hora, csv.origen, csv.destino, csv.tipo_vehiculo, csv.estado,csv.idpareja_origen_destino, csv.fecha, csv.hora,
							pp.nombre, g.id AS idnegocio,csv.peso_kg, CONCAT (M.municipio,"-",M.depto) AS origen_solicitud,CONCAT(M2.municipio,"-",M2.depto) AS destino_solicitud,csc.*,csv.cant_vehiculo, csv.cant_disponible,
								g.tipo_servicio_mer,g.peso_bruto_kg,g.total_tarifa,	M.rndc_codigo_ciudad AS origen_rndc,g.itr,csv.nundoc_solicitud,csv.escenario_id
								FROM cmx_cotizaciones_serviciocliente AS csc
								INNER JOIN cmx_solicitud_vehiculo2 csv ON csc.n_cotizacion=csv.n_cotizacion
								LEFT JOIN cmx_log_solicitudvehiculo l ON csv.nundoc_solicitud=l.id_solictud
								INNER JOIN cmx_detalle_mercancia2 g ON csv.idpareja_origen_destino=g.id
								INNER JOIN cmx_para_tipo_vehiculo pp ON csv.tipo_vehiculo=pp.id
								INNER JOIN cmx_agencia_usuario uno ON csv.agencia=uno.id_agencia
								INNER JOIN cmx_municipios M ON csv.origen=M.rndc_codigo_ciudad
								INNER JOIN cmx_municipios M2 ON csv.destino=M2.rndc_codigo_ciudad
								WHERE csv.estado IN("Pendiente","Realizada","En_subasta","asignada","en_tramite","aprobado_prefiltro") 
								AND csc.estado="F3" AND estado_autorizado="autorizado" AND uno.id_usuario=' . $id_usuario . ' AND uno.estado="Activo" AND csv.fecha BETWEEN "' . $fecha_inicial . '" AND "' . $fecha_final . '" AND csv.estado="' . $filtro . '"
								GROUP BY csv.nundoc_solicitud ORDER BY csv.nundoc_solicitud DESC');
				$sql_datos->execute();
				$resultado = $sql_datos->fetchAll(PDO::FETCH_ASSOC);

				if ($resultado) {
					foreach ($resultado as  $value) {
						$sql_contador = $this->_db3->prepare("SELECT COUNT(*) AS numero_placas FROM cmx_solicitud_vehiculo2 csv2 
									INNER JOIN cmx_preestudio_solicitudes_servicio psv ON csv2.nundoc_solicitud = psv.id_servicio_cliente 
									INNER JOIN cmx_cotizaciones_serviciocliente csc ON csc.n_cotizacion=csv2.n_cotizacion
									INNER JOIN cmx_agencia_usuario uno ON csv2.agencia=uno.id_agencia
									WHERE csv2.nundoc_solicitud='" . $value['nundoc_solicitud'] . "' AND csc.estado='F3' AND estado_autorizado='autorizado' AND uno.id_usuario='" . $id_usuario . "' AND uno.estado='Activo' AND csv2.fecha BETWEEN '" . $fecha_inicial . "' AND '" . $fecha_final . "'");
						$sql_contador->execute();
						$resultado_contador = $sql_contador->fetchAll(PDO::FETCH_ASSOC);

						// Combinar los resultados
						$value['numero_placas'] = $resultado_contador[0]['numero_placas'];

						// Añadir al array de respuesta
						$response[] = $value;
					}
				}
			}
		}
		return $response;
	}

	// public function getasignarvehiculo($id_usuario, $filtro, $fecha_inicial, $fecha_final)
	// {
	// 	$response = [];
	// 	if ($filtro === "todos") {
	// 		/* Se cambia la de tabla de donde se saca el el estado par controlar las solicitudes de servicio l.estado por csv.estado */
	// 		$sql_datos = $this->_db3->prepare('SELECT g.item,g.tipo_mercancia,g.flete,g.peso_neto_tn,csv.estado AS esoli,csv.nundoc_solicitud AS elid, csv.fecha,csv.hora, csv.origen, csv.destino, csv.tipo_vehiculo, csv.estado,csv.idpareja_origen_destino, csv.fecha, csv.hora,
	// 					pp.nombre, g.id AS idnegocio,csv.peso_kg, CONCAT (M.municipio,"-",M.depto) AS origen_solicitud, CONCAT(M2.municipio,"-",M2.depto) AS destino_solicitud,
	// 						csc.*,csv.cant_vehiculo, csv.cant_disponible,g.tipo_servicio_mer,g.peso_bruto_kg,g.total_tarifa,M.rndc_codigo_ciudad AS origen_rndc,g.itr,csv.nundoc_solicitud,csv.escenario_id
	// 						FROM cmx_cotizaciones_serviciocliente AS csc
	// 						INNER JOIN cmx_solicitud_vehiculo2 csv ON csc.n_cotizacion=csv.n_cotizacion
	// 						INNER JOIN cmx_detalle_mercancia2 g ON csv.idpareja_origen_destino=g.id
	// 						INNER JOIN cmx_para_tipo_vehiculo pp ON csv.tipo_vehiculo=pp.id
	// 						INNER JOIN cmx_agencia_usuario uno ON csv.agencia=uno.id_agencia
	// 						INNER JOIN cmx_municipios M ON csv.origen=M.rndc_codigo_ciudad
	// 						INNER JOIN cmx_municipios M2 ON csv.destino=M2.rndc_codigo_ciudad
	// 						LEFT JOIN cmx_orden_cargue oc ON csv.nundoc_solicitud=oc.mer_idservicio
	// 						LEFT JOIN cmx_remesa_ordencargue ro ON oc.id=ro.id_orden_cargue
	// 						LEFT JOIN cmx_remesa rm ON ro.id_remesa=rm.id
	// 						LEFT JOIN cmx_manifiesto_remesa mr ON rm.id=mr.id_remesa
	// 						LEFT JOIN cmx_manifiesto ma ON mr.id_manifiesto=ma.id
	// 						LEFT JOIN cmx_log_solicitudvehiculo l ON csv.nundoc_solicitud=l.id_solictud
	// 						WHERE csv.estado IN("Pendiente","Realizada","En_subasta","asignada","en_tramite","aprobado_prefiltro") 
	// 						AND csc.estado="F3" AND estado_autorizado="autorizado" AND uno.id_usuario=' . $id_usuario . ' AND uno.estado="Activo" AND csv.fecha BETWEEN "' . $fecha_inicial . '" AND "' . $fecha_final . '" AND oc.mer_idservicio IS NULL
	// 						GROUP BY csv.nundoc_solicitud ORDER BY csv.nundoc_solicitud DESC');
	// 		$sql_datos->execute();
	// 		$resultado = $sql_datos->fetchAll(PDO::FETCH_ASSOC);
	// 		if ($resultado) {
	// 			foreach ($resultado as  $value) {
	// 				$sql_contador = $this->_db3->prepare("SELECT COUNT(*) AS numero_placas FROM cmx_solicitud_vehiculo2 csv2 
	// 			INNER JOIN cmx_preestudio_solicitudes_servicio psv ON csv2.nundoc_solicitud = psv.id_servicio_cliente 
	// 			INNER JOIN cmx_cotizaciones_serviciocliente csc ON csc.n_cotizacion=csv2.n_cotizacion
	// 			INNER JOIN cmx_agencia_usuario uno ON csv2.agencia=uno.id_agencia
	// 			WHERE csv2.nundoc_solicitud='" . $value['nundoc_solicitud'] . "' AND csc.estado='F3' AND estado_autorizado='autorizado' AND uno.id_usuario='" . $id_usuario . "' AND uno.estado='Activo' AND csv2.fecha BETWEEN '" . $fecha_inicial . "' AND '" . $fecha_final . "'");
	// 				$sql_contador->execute();
	// 				$resultado_contador = $sql_contador->fetchAll(PDO::FETCH_ASSOC);
	// 				// Combinar los resultados
	// 				$value['numero_placas'] = $resultado_contador[0]['numero_placas'];

	// 				// Añadir al array de respuesta
	// 				$response[] = $value;
	// 			}
	// 		}
	// 	} else {
	// 		/* Se cambia la de tabla de donde se saca el el estado par controlar las solicitudes de servicio l.estado por csv.estado */
	// 		$sql_datos = $this->_db3->prepare('SELECT g.item,g.tipo_mercancia,g.flete,g.peso_neto_tn,csv.estado AS esoli,csv.nundoc_solicitud AS elid, csv.fecha,csv.hora, csv.origen, csv.destino, csv.tipo_vehiculo, csv.estado,csv.idpareja_origen_destino, csv.fecha, csv.hora,
	// 						pp.nombre, g.id AS idnegocio,csv.peso_kg, CONCAT (M.municipio,"-",M.depto) AS origen_solicitud,CONCAT(M2.municipio,"-",M2.depto) AS destino_solicitud,csc.*,csv.cant_vehiculo, csv.cant_disponible,
	// 							g.tipo_servicio_mer,g.peso_bruto_kg,g.total_tarifa,	M.rndc_codigo_ciudad AS origen_rndc,g.itr,csv.nundoc_solicitud,csv.escenario_id
	// 							FROM cmx_cotizaciones_serviciocliente AS csc
	// 							INNER JOIN cmx_solicitud_vehiculo2 csv ON csc.n_cotizacion=csv.n_cotizacion
	// 							INNER JOIN cmx_detalle_mercancia2 g ON csv.idpareja_origen_destino=g.id
	// 							INNER JOIN cmx_para_tipo_vehiculo pp ON csv.tipo_vehiculo=pp.id
	// 							INNER JOIN cmx_agencia_usuario uno ON csv.agencia=uno.id_agencia
	// 							INNER JOIN cmx_municipios M ON csv.origen=M.rndc_codigo_ciudad
	// 							INNER JOIN cmx_municipios M2 ON csv.destino=M2.rndc_codigo_ciudad
	// 							LEFT JOIN cmx_orden_cargue oc ON csv.nundoc_solicitud=oc.mer_idservicio
	// 							LEFT JOIN cmx_remesa_ordencargue ro ON oc.id=ro.id_orden_cargue
	// 							LEFT JOIN cmx_remesa rm ON ro.id_remesa=rm.id
	// 							LEFT JOIN cmx_manifiesto_remesa mr ON rm.id=mr.id_remesa
	// 							LEFT JOIN cmx_manifiesto ma ON mr.id_manifiesto=ma.id
	// 							LEFT JOIN cmx_log_solicitudvehiculo l ON csv.nundoc_solicitud=l.id_solictud
	// 							WHERE csv.estado IN("Pendiente","Realizada","En_subasta","asignada","en_tramite","aprobado_prefiltro") 
	// 							AND csc.estado="F3" AND estado_autorizado="autorizado" AND uno.id_usuario=' . $id_usuario . ' AND uno.estado="Activo" AND csv.fecha BETWEEN "' . $fecha_inicial . '" AND "' . $fecha_final . '" AND oc.mer_idservicio IS NULL AND csv.estado="' . $filtro . '"
	// 							GROUP BY csv.nundoc_solicitud ORDER BY csv.nundoc_solicitud DESC');
	// 		$sql_datos->execute();
	// 		$resultado = $sql_datos->fetchAll(PDO::FETCH_ASSOC);

	// 		if ($resultado) {
	// 			foreach ($resultado as  $value) {
	// 				$sql_contador = $this->_db3->prepare("SELECT COUNT(*) AS numero_placas FROM cmx_solicitud_vehiculo2 csv2 
	// 								INNER JOIN cmx_preestudio_solicitudes_servicio psv ON csv2.nundoc_solicitud = psv.id_servicio_cliente 
	// 								INNER JOIN cmx_cotizaciones_serviciocliente csc ON csc.n_cotizacion=csv2.n_cotizacion
	// 								INNER JOIN cmx_agencia_usuario uno ON csv2.agencia=uno.id_agencia
	// 								WHERE csv2.nundoc_solicitud='" . $value['nundoc_solicitud'] . "' AND csc.estado='F3' AND estado_autorizado='autorizado' AND uno.id_usuario='" . $id_usuario . "' AND uno.estado='Activo' AND csv2.fecha BETWEEN '" . $fecha_inicial . "' AND '" . $fecha_final . "'");
	// 				$sql_contador->execute();
	// 				$resultado_contador = $sql_contador->fetchAll(PDO::FETCH_ASSOC);

	// 				// Combinar los resultados
	// 				$value['numero_placas'] = $resultado_contador[0]['numero_placas'];

	// 				// Añadir al array de respuesta
	// 				$response[] = $value;
	// 			}
	// 		}
	// 	}

	// 	return $response;
	// }

	public function getsolicitudes($ssn_id_perfil)
	{
		$fecha = date('Y-m-d');
		$fec2 = date("Y-m-d", strtotime($fecha . "- 5 days"));
		$sql = "SELECT sol.*, 
       es.estado AS elesta, 
       CONCAT(C1.municipio, '-', C1.depto) AS ori, 
       CONCAT(C2.municipio, '-', C2.depto) AS des, 
       g.item, g.tipo_mercancia, g.flete, g.peso_neto_tn, 
       g.tipo_servicio_mer, g.total_tarifa
			FROM cmx_solicitud_vehiculo2 sol
			LEFT JOIN cmx_log_solicitudvehiculo es ON sol.id = es.id_solictud
			INNER JOIN cmx_municipios C1 ON sol.origen = C1.rndc_codigo_ciudad
			INNER JOIN cmx_municipios C2 ON sol.destino = C2.rndc_codigo_ciudad
			INNER JOIN cmx_detalle_mercancia2 g ON sol.idpareja_origen_destino = g.id
			INNER JOIN cmx_agencia_usuario agu ON sol.agencia = agu.id_agencia
			INNER JOIN cmx_usuario_cliente uscli ON agu.id_usuario = uscli.id_usuario
			LEFT JOIN cmx_consolidacion_solicitudes agru ON sol.id = agru.solicitud_servicio
			WHERE uscli.id_perfil = :ssn_id_perfil
				AND g.tipo_servicio_mer = 'Consolidado'
				AND sol.fecha BETWEEN :fec2 AND :fecha
				AND agru.solicitud_servicio IS NULL
			ORDER BY sol.id DESC";

		$stmt = $this->_db3->prepare($sql);
		$stmt->bindParam(':ssn_id_perfil', $ssn_id_perfil);
		$stmt->bindParam(':fec2', $fec2);
		$stmt->bindParam(':fecha', $fecha);
		$stmt->execute();
		$return = $stmt->fetchAll(PDO::FETCH_ASSOC);
		return $return;
	}

	public function getvehiculos()
	{
		$sql = '
			SELECT v.id, v.placa, v.tipo_vehiculo, t.nombre, t.peso_maximo, 
				vd.vence_soat, d.tecno_fecha_vigencia,
				pepe.rndc_numero_licencia, pepe.rndc_vencimiento_licencia
				FROM cmx_para_tipo_vehiculo AS t
				INNER JOIN cmx_vehiculos AS v
				INNER JOIN cmx_vehiculo2 AS vd
				INNER JOIN cmx_detalle_vehiculo AS d
				INNER JOIN cmx_proveedores pepe
				ON t.id=v.tipo_vehiculo AND v.id=vd.id_vehiculo AND pepe.id=v.id_conductor
				AND vd.id_vehiculo=d.id_vehiculo				
			';


		$return = $this->_db->getConsulta($sql);
		return $return;
	}

	public function GetEstudioVehiculos()
	{
		$sql = '
				SELECT 	v.id AS elid, v.*, a.vence_soat, d.tecno_fecha_vigencia, d.fecha_vence_licencia, 
				lo.placa AS lo_placa , lo.estado, lo.id_solictud,
				pepe.nombre, pepe.rndc_numero_licencia, pepe.rndc_vencimiento_licencia
				FROM 	cmx_log_solicitudvehiculo lo
				RIGHT JOIN cmx_vehiculos v
				ON lo.placa=v.placa
				INNER JOIN cmx_vehiculo2 a
				ON v.id=a.id_vehiculo
				INNER JOIN cmx_detalle_vehiculo d
				ON a.id_vehiculo=d.id_vehiculo	
				INNER JOIN cmx_proveedores  pepe
				ON v.id_conductor=pepe.id	
			';
		$return = $this->_db->getConsulta($sql);
		return $return;
	}

	public function getasignarvehiculosolo()
	{
		$sql = '
				SELECT * FROM 	cmx_log_solicitudvehiculo 
			WHERE estado_solo="0"
			';
		$return = $this->_db->getConsulta($sql);
		return $return;
	}

	public function consulta_remitentes($numero_cotizacion, $solicitud_servicio)
	{
		$response = [];

		$sql = "SELECT a.id, rd.nombre, a.direccion_entrega, a.fecha_estimada_entrega,
			a.observacion, a.hora_estimada, a.tipo, a.telefono,
			a.peso, a.lugar, mn.municipio
			FROM cmx_ruta_puntosentrega a
			INNER JOIN cmx_remitente_destinatario rd ON a.cliente=rd.id
			INNER JOIN cmx_municipios mn ON a.municipio_entrega=mn.id
			WHERE a.cod_ini_ruta=" . $solicitud_servicio;
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$resultado = $result->fetchAll(PDO::FETCH_ASSOC);


		$sql2 = "SELECT remi.id AS remitente,
			inf.*, des.nombre, mn.municipio
			FROM cmx_destinatarios_ss inf
			INNER JOIN cmx_remitente_destinatario des ON inf.cliente=des.id
			INNER JOIN cmx_ruta_puntosentrega remi ON inf.solicitud_servicio=cod_ini_ruta /*AND inf.id_punto=remi.id_punto*/
			INNER JOIN cmx_municipios mn ON inf.municipio_entrega=mn.id
			WHERE inf.solicitud_servicio=" . $solicitud_servicio;
		$result2 = $this->_db3->prepare($sql2);
		$result2->execute();
		$resultado2 = $result2->fetchAll(PDO::FETCH_ASSOC);
		$response = ['result' => $resultado, 'result2' => $resultado2];
		return $response;
	}

	// public function consulta_contenedores_vacios($fecha_inicial, $fecha_final)
	// {
	// 	$sqlContenedoresVacios = $this->_db3->prepare("SELECT
	// 			ag.nombre AS Agencia,
	// 			ss.devol_dias,
	// 			-- ss.devol_municipio,
	// 			CONCAT(m.municipio,' - ',m.depto) AS Municipio,
	// 			ss.devol_direccion,
	// 			-- ss.devol_tipocont,
	// 			tc.nombre AS tipo_contenedor,
	// 			ss.devol_numcont,
	// 			ss.devol_comodato,
	// 			ss.devol_pesovacio,
	// 			-- Estado numérico: 1 = vencido, 2 = vence hoy, 0 = no vencido
	// 			CASE
	// 				WHEN DATE(ss.devol_dias) < CURDATE() THEN 1         -- Vencido
	// 				WHEN DATE(ss.devol_dias) = CURDATE() THEN 2         -- Vence hoy
	// 				ELSE 0                                               -- No vencido
	// 			END AS esta_vencido,

	// 			-- Días vencido: solo si está vencido
	// 			CASE
	// 				WHEN DATE(ss.devol_dias) < CURDATE() THEN DATEDIFF(CURDATE(), DATE(ss.devol_dias))
	// 				ELSE 0
	// 			END AS dias_vencido,
	// 			ss.estado_devolucion,
	// 			ss.devol_numcont,
	// 			ss.nombre_cliente,
	// 			ss.nundoc_solicitud,
	// 			v.placa,
	// 			CONCAT(cond.nombre,' ',cond.apellido1,' ',cond.apellido2) AS Conductor,
	// 			cond.celular,
	// 			hfc.estado_gestion,
	// 			hfc.mismo_vehiculo,
	// 			hfc.placa AS Placa_Devolucion,
	// 			hfc.manifiesto,
	// 			hfc.numdoc_Solicitud
	// 		FROM
	// 			cmx_solicitud_vehiculo2 ss
	// 			INNER JOIN cmx_agencias ag ON ss.agencia = ag.id
	// 			INNER JOIN cmx_tipo_contenedor tc ON ss.devol_tipocont=tc.id
	// 			INNER JOIN cmx_municipios m ON ss.devol_municipio = m.id
	// 			INNER JOIN cmx_orden_cargue oc ON ss.nundoc_solicitud=oc.mer_idservicio
	// 			INNER JOIN cmx_subasta_flete sf ON oc.id=sf.numero_orden
	// 			INNER JOIN cmx_vehiculos v ON sf.placa=v.placa
	// 			INNER JOIN cmx_proveedores cond ON v.id_conductor=cond.numdoc_nexos
	// 			LEFT JOIN cmx_historico_fecha_contenedor hfc ON ss.nundoc_solicitud=hfc.solicitud_id
	// 		WHERE
	// 			ss.devol_contenedor = 1 AND ss.fecha BETWEEN :Fecha_Inicio AND :Fecha_Final
	// 		ORDER BY ss.fecha DESC");
	// 	$sqlContenedoresVacios->bindParam(':Fecha_Inicio', $fecha_inicial);
	// 	$sqlContenedoresVacios->bindParam(':Fecha_Final', $fecha_final);

	// 	$sqlContenedoresVacios->execute();
	// 	return $sqlContenedoresVacios->fetchAll(PDO::FETCH_ASSOC);
	// }

	public function consulta_contenedores_vacios($fecha_inicial, $fecha_final)
	{
		$sqlContenedoresVacios = $this->_db3->prepare("SELECT
                ag.nombre AS Agencia,
                ss.devol_dias,
                CONCAT(m.municipio,' - ',m.depto) AS Municipio,
                ss.devol_direccion,
                tc.nombre AS tipo_contenedor,
                ss.devol_numcont,
                ss.devol_comodato,
                ss.devol_pesovacio,
                -- Estado numérico
                CASE
                    WHEN DATE(ss.devol_dias) < CURDATE() THEN 1 
                    WHEN DATE(ss.devol_dias) = CURDATE() THEN 2 
                    ELSE 0 
                END AS esta_vencido,
                -- Días vencido
                CASE
                    WHEN DATE(ss.devol_dias) < CURDATE() THEN DATEDIFF(CURDATE(), DATE(ss.devol_dias))
                    ELSE 0
                END AS dias_vencido,
                ss.estado_devolucion,
                ss.devol_numcont,
                ss.nombre_cliente,
                ss.nundoc_solicitud,
                v.placa,
                CONCAT(cond.nombre,' ',cond.apellido1,' ',cond.apellido2) AS Conductor,
                cond.celular,
                
                -- 🛑 CAMPOS DEL HISTÓRICO (ÚLTIMO REGISTRO)
                hfc.estado_gestion,
                hfc.mismo_vehiculo,
                hfc.placa AS Placa_Devolucion,
                hfc.manifiesto,
                hfc.numdoc_Solicitud
            FROM
                cmx_solicitud_vehiculo2 ss
                INNER JOIN cmx_agencias ag ON ss.agencia = ag.id
                INNER JOIN cmx_tipo_contenedor tc ON ss.devol_tipocont = tc.id
                INNER JOIN cmx_municipios m ON ss.devol_municipio = m.id
                INNER JOIN cmx_orden_cargue oc ON ss.nundoc_solicitud = oc.mer_idservicio
                INNER JOIN cmx_subasta_flete sf ON oc.id = sf.numero_orden
                INNER JOIN cmx_vehiculos v ON sf.placa = v.placa
                INNER JOIN cmx_proveedores cond ON v.id_conductor = cond.numdoc_nexos
                
                -- 🛑 CORRECCIÓN CLAVE: LEFT JOIN solo con el ID MÁXIMO del histórico
                LEFT JOIN cmx_historico_fecha_contenedor hfc ON hfc.id = (
                    SELECT MAX(hfc_max.id)
                    FROM cmx_historico_fecha_contenedor hfc_max
                    WHERE hfc_max.solicitud_id = ss.nundoc_solicitud
                    -- Opcional: Asegurar que el ID del contenedor también coincida
                    -- AND hfc_max.devol_numcont = ss.devol_numcont
                )

            WHERE
                ss.devol_contenedor = 1 AND ss.fecha BETWEEN :Fecha_Inicio AND :Fecha_Final
            ORDER BY ss.fecha DESC");

		// Resto del código de la función (se mantiene)
		$sqlContenedoresVacios->bindParam(':Fecha_Inicio', $fecha_inicial);
		$sqlContenedoresVacios->bindParam(':Fecha_Final', $fecha_final);

		$sqlContenedoresVacios->execute();
		return $sqlContenedoresVacios->fetchAll(PDO::FETCH_ASSOC);
	}

	// public function ActualizarEstadoContenedorVacio($SolicitudId, $estado, $DiasVencidos)
	// {
	// 	try {
	// 		$this->_db3->beginTransaction();

	// 		$sqlUpdate = $this->_db3->prepare("UPDATE cmx_solicitud_vehiculo2 SET estado_devolucion = :estado_devolucion, dias_vencido = :dias_vencido
	//         WHERE nundoc_solicitud = :nundoc_solicitud");
	// 		$sqlUpdate->bindParam(':estado_devolucion', $estado);
	// 		$sqlUpdate->bindParam(':nundoc_solicitud', $SolicitudId);
	// 		$sqlUpdate->bindParam(':dias_vencido', $DiasVencidos);

	// 		if ($sqlUpdate->execute()) {
	// 			$this->_db3->commit();
	// 			return [
	// 				'status' => true,
	// 				'mensaje' => 'Estado actualizado correctamente.'
	// 			];
	// 		} else {
	// 			$this->_db3->rollBack();
	// 			return [
	// 				'status' => false,
	// 				'mensaje' => 'No se pudo actualizar el estado del contenedor.'
	// 			];
	// 		}
	// 	} catch (PDOException $e) {
	// 		$this->_db3->rollBack();
	// 		return [
	// 			'status' => false,
	// 			'mensaje' => 'Error al actualizar el estado: ' . $e->getMessage()
	// 		];
	// 	}
	// }
	// Asumimos que la carpeta base para uploads es accesible y se define aquí
	const UPLOAD_DIR = 'public/files/contenedores/';
	protected $_db3;

	/**
	 * Sube un archivo de forma segura.
	 * @param array $fileData El array del archivo de $_FILES.
	 * @param string $solicitudId ID de la solicitud para nombrar la carpeta/archivo.
	 * @param string $tipo 'tirilla' o 'soporte'.
	 * @return string|null La ruta relativa del archivo guardado, o null si no hay archivo.
	 * @throws Exception Si la subida falla.
	 */
	protected function subirArchivo(?array $fileData, int $solicitudId, string $tipo): ?string
	{
		// 1. 🚨 MANEJO DE ARCHIVO OPCIONAL (NULL O VACÍO)
		// Si el archivo no fue enviado (es NULL) o el campo temporal está vacío,
		// NO hacemos nada y retornamos NULL.
		if ($fileData === null || !isset($fileData['tmp_name']) || empty($fileData['tmp_name'])) {
			return null;
		}

		// 2. SEGURIDAD: Validar errores de subida
		if ($fileData['error'] !== UPLOAD_ERR_OK) {
			throw new Exception("Error al subir el archivo {$tipo}. Código: {$fileData['error']}");
		}

		// 3. Definir la subcarpeta por ID de solicitud y TIPO
		// Usamos $tipo para la carpeta, haciendo la ruta dinámica.
		$targetDir = self::UPLOAD_DIR . strtolower($tipo) . '/' . $solicitudId . '/';

		// 4. Crear el directorio si no existe
		if (!is_dir($targetDir)) {
			// Establecer permisos recursivamente
			if (!mkdir($targetDir, 0777, true)) {
				throw new Exception("Fallo la creación del directorio: {$targetDir}");
			}
		}

		// 5. Generar nombre de archivo único
		$ext = pathinfo($fileData['name'], PATHINFO_EXTENSION);
		$fileName = $tipo . '_' . time() . '.' . $ext;
		$targetFile = $targetDir . $fileName;

		// 6. Mover el archivo subido
		if (!move_uploaded_file($fileData['tmp_name'], $targetFile)) {
			throw new Exception("Fallo la operación move_uploaded_file para el archivo {$tipo}.");
		}

		// 7. Devolver la ruta relativa (útil para guardar en la DB)
		// Formato: tirilla/ID/nombre_archivo.ext (para simplificar la ruta absoluta en la DB)
		return strtolower($tipo) . '/' . $solicitudId . '/' . $fileName;
	}

	public function guardarGestionContenedor(array $datos): array
	{
		$user = $_SESSION["usuario"]["nom_usuario"] ?? 'SYSTEM_USER';
		$empresa_id = $_SESSION['usuario']['empresa_id'] ?? null;
		$fecha_db = date('Y-m-d');
		$hora_db = date('H:i:s');

		// Inicializamos las rutas de archivo
		$rutaTirilla = null;
		$rutaSoporte = null;
		$fecha_devolucion = empty($datos['fecha_devolucion']) ? NULL : $datos['fecha_devolucion'];
		$fecha_nueva = empty($datos['fecha_nueva']) ? NULL : $datos['fecha_nueva'];
		$fecha_cita = empty($datos['fecha_cita']) ? NULL : $datos['fecha_cita'];
		$estado = 'Completado';


		$this->_db3->beginTransaction();

		try {
			// --- 1. Subida de Archivos (antes de la BD) ---
			$rutaTirilla = $this->subirArchivo($datos['tirilla_file'], $datos['solicitud_id'], 'tirilla');
			$rutaSoporte = $this->subirArchivo($datos['soporte_file'], $datos['solicitud_id'], 'soporte');

			// --- 2. Inserción en la Base de Datos ---
			// En tu archivo: /models/ContenedorVacioModel.php (función guardarGestionContenedor)

			// En tu archivo: /models/ContenedorVacioModel.php (función guardarGestionContenedor)

			$sql = "INSERT INTO cmx_historico_fecha_contenedor (
				-- 1. Solicitud
				solicitud_id, 
				-- 2-4. Campos de Fecha/Tiempo (que serán NULL)
				tiempo_transcurrido, 
				fecha_historico, 
				fecha_nueva, 
				-- 5. Archivos
				tirilla_soporte,    
				-- 6-10. Datos de Gestión (FECHA_CITA ELIMINADA)
				fecha_devolucion, 
				patio, 
				ciudad, 
				estado_gestion, 
				redireccion, 
				-- 11. Observación
				observacion, 
				mismo_vehiculo,
				placa,
				manifiesto,
				numdoc_solicitud,

				-- 12-15. Auditoría
				usuario, fecha, hora, empresa_id
			) VALUES (
				-- 1. Solicitud
				:solicitud_id, 
				-- 2-4. Campos de Fecha/Tiempo (Usamos NULL)
				:tiempo_transcurrido, 
				:fecha_historico, 
				:fecha_nueva,
				-- 5. Archivos
				:tirilla_soporte_path, 
				-- 6-10. Datos de Gestión (FECHA_CITA ELIMINADA)
				:fecha_devolucion, 
				:patio, 
				:ciudad, 
				:estado_gestion, 
				:redireccion, 
				-- 11. Observación
				:observacion, 
				:mismo_vehiculo, 
				:placa, 
				:manifiesto, 
				:numdoc_solicitud, 
				-- 12-15. Auditoría
				:usuario, 
				:fecha, 
				:hora, 
				:empresa_id
			)";
			// --------------------------------------------------------------------------------
			// Lógica de Vinculación de Parámetros
			// --------------------------------------------------------------------------------

			$stmt = $this->_db3->prepare($sql);

			// Vinculación de Parámetros
			$stmt->bindParam(':solicitud_id', $datos['solicitud_id'], PDO::PARAM_INT);
			$stmt->bindParam(':tiempo_transcurrido', $datos['tiempo_transcurrido']);
			$stmt->bindParam(':fecha_historico', $datos['fecha_historico']);
			$stmt->bindParam(':fecha_nueva', $fecha_nueva);
			$stmt->bindParam(':estado_gestion', $datos['estado_gestion']);
			$stmt->bindParam(':fecha_devolucion', $fecha_devolucion);
			$stmt->bindParam(':patio', $datos['patio']);
			$stmt->bindParam(':ciudad', $datos['municipio']);
			$stmt->bindParam(':redireccion', $datos['redireccion']);
			$stmt->bindParam(':observacion', $datos['observacion']);
			$stmt->bindParam(':mismo_vehiculo', $datos['DevolucionMismoVehiculo']);
			$stmt->bindParam(':placa', $datos['nueva_placa']);
			$stmt->bindParam(':manifiesto', $datos['manifiesto']);
			$stmt->bindParam(':numdoc_solicitud', $datos['numdoc_solicitud']);

			// 🚨 BINDING DE ARCHIVO: Usar el nombre de placeholder correcto
			$stmt->bindParam(':tirilla_soporte_path', $rutaTirilla);

			// (El binding para fecha_cita ha sido eliminado correctamente)

			// Datos de Auditoría
			$stmt->bindParam(':usuario', $user);
			$stmt->bindParam(':fecha', $fecha_db);
			$stmt->bindParam(':hora', $hora_db);
			$stmt->bindParam(':empresa_id', $empresa_id, PDO::PARAM_INT);

			$stmt->execute();

			$historicoId = $this->_db3->lastInsertId();

			if ($datos['redireccion'] === 'Si') {
				$sql = 'INSERT INTO cmx_redireccion_contenedor (solicitud_id,historico_id,fecha_cita,soporte_cita,patio_cita,usuario,fecha,hora,empresa_id) VALUES (:solicitud_id,:historico_id,:fecha_cita,:soporte_cita,:patio_cita,:usuario,:fecha,:hora,:empresa_id)';
				$stmt = $this->_db3->prepare($sql);
				$stmt->bindParam(':solicitud_id', $datos['solicitud_id'], PDO::PARAM_INT);
				$stmt->bindParam(':historico_id', $historicoId, PDO::PARAM_INT);
				$stmt->bindParam(':fecha_cita', $fecha_cita);
				$stmt->bindParam(':soporte_cita', $rutaSoporte);
				$stmt->bindParam(':patio_cita', $datos['patio_redireccion']);
				$stmt->bindParam(':usuario', $user);
				$stmt->bindParam(':fecha', $fecha_db);
				$stmt->bindParam(':hora', $hora_db);
				$stmt->bindParam(':empresa_id', $empresa_id, PDO::PARAM_INT);
				$stmt->execute();
			}


			//Vlidar si el estado es finalizado para completar este contenedor
			if ($datos['estado_gestion'] == 'Finalizado') {
				$sqlUpdate = $this->_db3->prepare("UPDATE cmx_solicitud_vehiculo2 SET estado_devolucion = :estado_devolucion, dias_vencido = :dias_vencido
				        WHERE nundoc_solicitud = :nundoc_solicitud");
				$sqlUpdate->bindParam(':estado_devolucion', $estado);
				$sqlUpdate->bindParam(':nundoc_solicitud', $datos['solicitud_id']);
				$sqlUpdate->bindParam(':dias_vencido', $datos['tiempo_transcurrido']);
				$sqlUpdate->execute();
			}

			$this->_db3->commit();

			return ['status' => true, 'mensaje' => 'Gestión del contenedor guardada correctamente.'];
		} catch (\Exception $e) {
			if ($this->_db3->inTransaction()) {
				$this->_db3->rollBack();
			}
			// Aquí puedes agregar lógica para ELIMINAR el archivo si la BD falla

			return ['status' => false, 'mensaje' => 'Error: Falló la gestión (archivo/BD). ' . $e->getMessage()];
		}
	}


	public function Listar_Recursos_Enturnar($origenEnturnar)
	{
		$sqlisatrDisponibles = $this->_db3->prepare("SELECT                                      
			ma.id AS Numero_Manifiesto,              
			ma.placa,                                
			CONCAT(mun.municipio, ' - ', mun.depto,' / ', mun2.municipio,' ',mun2.depto) AS Ruta,
			CONCAT(cond.nombre, ' ', IFNULL(cond.apellido1, ''), ' ', IFNULL(cond.apellido2, '')) AS Conductor,
			CONCAT(cond.celular) AS Celular, cond.numdoc_nexos
		FROM                                        
			cmx_manifiesto ma                        
			INNER JOIN cmx_municipios mun ON ma.origen_viaje = mun.id
			INNER JOIN cmx_municipios mun2 ON ma.destino_viaje = mun2.id
			INNER JOIN cmx_proveedores cond ON ma.conductor_manifiesto = cond.numero_documento
			INNER JOIN cmx_actividad_proveedor ap ON cond.numdoc_nexos = ap.id_proveedor
			AND ap.actividad = 'Conductor'           
		WHERE                                       
			mun.rndc_codigo_ciudad = :Origen      
			AND ma.estado_seguimiento = 'SEGUIMIENTO'");
		// AND ma.estado_seguimiento = 'SEGUIMIENTO' AND ma.fecha_expedicion > '2025-01-01'");
		$sqlisatrDisponibles->bindParam(':Origen', $origenEnturnar);
		$sqlisatrDisponibles->execute();
		return $sqlisatrDisponibles->fetchAll(PDO::FETCH_ASSOC);
	}

	public function Insertar_Enturnamiento($ConductorId, $Origen, $Destino, $NudocSolicitud, $Placa, $Conductor, $Lugar)
	{
		$response = [];
		try {
			$empresa_id = $_SESSION["usuario"]["empresa_id"];
			$user = $_SESSION["usuario"]["nom_usuario"];

			$date = new DateTime('now', new DateTimeZone('America/Bogota'));
			$fecha = $date->format('Y-m-d');
			$hora = $date->format('H:i:s');
			$estado_enturnamiento = 'Pendiente';

			// Inicia transacción
			$this->_db3->beginTransaction();

			$sql = $this->_db3->prepare("
			INSERT INTO cmx_gestion_vehiculo 
				(placa, ubicacion_actual, conductor_id, solicitud_id, estado_enturnamiento, usuario, fecha, hora, empresa_id) 
			VALUES 
				(:placa, :ubicacion_actual, :conductor_id, :solicitud_id, :estado_enturnamiento, :usuario, :fecha, :hora, :empresa_id)
			");

			$sql->bindParam(':placa', $Placa);
			$sql->bindParam(':ubicacion_actual', $Lugar);
			$sql->bindParam(':conductor_id', $ConductorId);
			$sql->bindParam(':solicitud_id', $NudocSolicitud);
			$sql->bindParam(':estado_enturnamiento', $estado_enturnamiento);
			$sql->bindParam(':usuario', $user);
			$sql->bindParam(':fecha', $fecha);
			$sql->bindParam(':hora', $hora);
			$sql->bindParam(':empresa_id', $empresa_id);

			if ($sql->execute()) {
				// Confirmar transacción
				$this->_db3->commit();

				$response = [
					"estado" => 200,
					"mensaje" => "Enturnamiento registrado correctamente",
					"datos" => [
						"placa" => $Placa,
						"solicitud_id" => $NudocSolicitud,
						"conductor" => $Conductor
					]
				];
			} else {
				$this->_db3->rollBack();
				$response = [
					"estado" => 500,
					"mensaje" => "Error al registrar el enturnamiento"
				];
			}
		} catch (Exception $e) {
			$this->_db3->rollBack();
			$response = [
				"estado" => 500,
				"mensaje" => "Excepción: " . $e->getMessage()
			];
		}

		return $response;
	}

	public function ListarEnturnadosOperacion()
	{
		$sqlEnrutados = $this->_db3->prepare("SELECT
			ev.id AS GestionId,
			CONCAT(cond.nombre,' ',IFNULL(cond.apellido1, ''),' ',IFNULL(cond.apellido2, '')) AS Conductor,
			cond.celular,
			ev.placa,
			IFNULL(ev.ubicacion_actual,'-') AS ubicacion,
			ag.nombre AS Agencia,
			ev.solicitud_id AS Solicitud_Servicio,
			CONCAT(m1.municipio,' - ',m1.depto) AS Origen,
			CONCAT(m2.municipio,' - ',m2.depto) AS Destino,
			ev.usuario AS Solicitante,
			ev.estado_enturnamiento,
			ev.estado_respuesta
		FROM
			cmx_gestion_vehiculo ev
			INNER JOIN cmx_proveedores cond ON ev.conductor_id = cond.numdoc_nexos
			INNER JOIN cmx_actividad_proveedor ap ON cond.numdoc_nexos = ap.id_proveedor AND ap.actividad = 'Conductor'
			INNER JOIN cmx_solicitud_vehiculo2 ss ON ev.solicitud_id = ss.nundoc_solicitud
			INNER JOIN cmx_detalle_mercancia2 dm ON ss.n_cotizacion=dm.n_cotizacion
			INNER JOIN cmx_municipios m1 ON dm.origen=m1.rndc_codigo_ciudad
			INNER JOIN cmx_municipios m2 ON dm.destino=m2.rndc_codigo_ciudad
			INNER JOIN cmx_agencias ag ON ss.agencia = ag.id
			ORDER BY ev.id DESC");

		// $sqlEnrutados = $this->_db3->prepare("SELECT
		// 	ev.placa,
		// 	ag.nombre AS Agencia,
		// 	CONCAT(cond.nombre,' ',IFNULL(cond.apellido1, ''),' ',IFNULL(cond.apellido2, '')) AS Conductor,
		// 	cond.celular,
		// 	ev.solicitud_id AS Solicitud_Servicio,
		// 	ev.usuario AS Solicitante,
		// 	ev.estado_enturnamiento
		// FROM
		// 	cmx_gestion_vehiculo ev
		// 	INNER JOIN cmx_proveedores cond ON ev.conductor_id = cond.numdoc_nexos
		// 	INNER JOIN cmx_actividad_proveedor ap ON cond.numdoc_nexos = ap.id_proveedor AND ap.actividad = 'Conductor'
		// 	INNER JOIN cmx_solicitud_vehiculo2 ss ON ev.solicitud_id = ss.nundoc_solicitud
		// 	INNER JOIN cmx_agencias ag ON ss.agencia = ag.id");
		$sqlEnrutados->execute();
		return $sqlEnrutados->fetchAll(PDO::FETCH_ASSOC);
	}

	/**
	 * Actualiza la fecha de vencimiento de la solicitud en la base de datos.
	 * @param int $solicitudId ID de la solicitud.
	 * @param string $fechaNueva La nueva fecha de vencimiento (YYYY-MM-DD).
	 * @return array Resultado de la operación.
	 */
	public function updateFechaVencimiento(int $solicitudId, string $fechaNueva, string $fecha_actual, int $dias_vencidos): array
	{
		$response = ['status' => false, 'message' => 'Error desconocido.'];

		// 1. Obtener datos de la sesión para el registro histórico
		$nom_usuario = $_SESSION['usuario']['nom_usuario'] ?? 'SYSTEM_USER';
		$session_empresa_id = $_SESSION['usuario']['empresa_id'] ?? null;

		// 2. Preparar fecha y hora actuales
		try {
			$date = new DateTime('now', new DateTimeZone('America/Bogota'));
		} catch (Exception $e) {
			return ['status' => false, 'message' => 'Error de zona horaria.'];
		}
		$fecha_actual_db = $date->format('Y-m-d');
		$hora_actual_db = $date->format('H:i:s');

		try {
			$this->_db3->beginTransaction(); // 👈 Iniciar Transacción

			// A. Paso 1: Actualizar la nueva fecha de vencimiento en la tabla principal
			$sql_update = "UPDATE cmx_solicitud_vehiculo2 
                       SET devol_dias = :fecha_nueva
                       WHERE nundoc_solicitud = :solicitud_id";

			$stmt_update = $this->_db3->prepare($sql_update);
			$stmt_update->bindParam(':fecha_nueva', $fechaNueva);
			$stmt_update->bindParam(':solicitud_id', $solicitudId, PDO::PARAM_INT);
			$stmt_update->execute();

			// B. Paso 2: Insertar en cmx_historico_fecha_contenedor
			$sql_historico = "INSERT INTO cmx_historico_fecha_contenedor (solicitud_id, tiempo_transcurrido, fecha_historico, fecha_nueva, usuario, fecha, hora, empresa_id) 
                          	  VALUES (:solicitud_id, :tiempo_transcurrido, :fecha_anterior, :fecha_nueva, :usuario, :fecha, :hora, :empresa_id)";

			$stmt_historico = $this->_db3->prepare($sql_historico);

			// 🚨 ASUMIMOS tiempo_transcurrido = NULL, o cámbialo si tienes un valor exacto
			// $tiempo_transcurrido = NULL;

			$stmt_historico->bindParam(':solicitud_id', $solicitudId, PDO::PARAM_INT);
			$stmt_historico->bindParam(':tiempo_transcurrido', $dias_vencidos); // NULL o valor INT
			$stmt_historico->bindParam(':fecha_anterior', $fecha_actual); // La fecha que tenía antes de la actualización
			$stmt_historico->bindParam(':fecha_nueva', $fechaNueva); // La fecha que tenía antes de la actualización
			$stmt_historico->bindParam(':usuario', $nom_usuario);
			$stmt_historico->bindParam(':fecha', $fecha_actual_db);
			$stmt_historico->bindParam(':hora', $hora_actual_db);
			$stmt_historico->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_INT);
			$stmt_historico->execute();

			$this->_db3->commit(); // 👈 Commit de la Transacción

			$response = ['status' => true, 'message' => 'Fecha de vencimiento y registro histórico guardados correctamente.'];
		} catch (PDOException $e) {
			if ($this->_db3->inTransaction()) {
				$this->_db3->rollBack(); // Rollback en caso de error
			}
			$response = ['status' => false, 'message' => "Error BD: Falló la actualización o el registro histórico. " . $e->getMessage()];
		}

		return $response;
	}

	public function HistoricoUpdateContenedor($solicitudId)
	{
		try {
			$this->_db3->beginTransaction(); // 👈 Iniciar Transacción

			$stmt = $this->_db3->prepare("SELECT hs.*, rc.*, hs.usuario,hs.hora,hs.fecha FROM cmx_historico_fecha_contenedor hs
			LEFT JOIN cmx_redireccion_contenedor rc ON hs.id=rc.historico_id
			WHERE hs.solicitud_id = :solicitudId ");
			$stmt->bindParam(":solicitudId", $solicitudId);
			$stmt->execute();
			$resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
			$this->_db3->commit();
			$response = ["status" => true, "data" => $resultado];
			return $response;
		} catch (Exception $e) {
			$this->_db3->rollBack();
			$response = ["status" => false, "message" => $e->getMessage()];
			return $response;
		}
	}

	/**
	 * Obtiene los vehículos en seguimiento (activos) y los últimos 50 finalizados
	 * para una ciudad de destino específica (Origen).
	 *
	 * @param string $Origen El código RNDC de la ciudad de destino (ej. '11001000').
	 * @return array Un array asociativo con dos claves:
	 * 'en_curso'    => [lista de vehículos en seguimiento]
	 * 'finalizados' => [lista de últimos 50 vehículos finalizados]
	 * 'error'       => (string|null) Mensaje de error si algo falla.
	 */
	public function Viajes_Vehiculos($Origen, $Destino)
	{
		// El array único que contendrá ambas respuestas
		$resultados = [
			'en_curso' => [],
			'finalizados' => [],
			'error' => null
		];

		// --- 1. Consulta para viajes EN SEGUIMIENTO ---
		$sql_en_curso = "
            SELECT
                CONCAT(cond.nombre,' ',cond.apellido1,' ',cond.apellido2) AS Conductor,
				cond.celular,
                m.placa,
                CONCAT(vc.nombre,'-',vc.descripcion) AS Configuracion,
                cr.descripcion AS Carroceria,
                IFNULL(t.placa,'-') AS Trailer
            FROM
                cmx_manifiesto m
                INNER JOIN cmx_municipios mu ON m.destino_viaje = mu.id
                INNER JOIN cmx_vehiculos v ON m.placa=v.placa
                INNER JOIN cmx_vehiculo2 v2 ON v.numdoc_vehiculo=v2.id_vehiculo
                INNER JOIN cmx_proveedores cond ON m.conductor_manifiesto=cond.numero_documento
                INNER JOIN cmx_rndc_vehiculos_configuracion vc ON v2.configuracion=vc.id
                INNER JOIN cmx_rndc_vehiculos_carroceria cr ON v.tipo_carroceria=cr.id
				INNER JOIN cmx_inicio_ruta ir ON m.id=ir.num_manifiesto
                INNER JOIN cmx_inicio_seguimiento s1 ON ir.cod_inicio=s1.cod_ini_ruta
                INNER JOIN cmx_ultimo_seguimiento us ON s1.id= us.seguimiento_id
                LEFT JOIN cmx_trailer_vehiculo tv ON v.numdoc_vehiculo=tv.id_vehiculo
                LEFT JOIN cmx_trailer t ON tv.id_trailer=t.id
            WHERE
                mu.rndc_codigo_ciudad = :origen_curso
                AND m.estado_seguimiento = 'SEGUIMIENTO'
                AND m.estadomnf_actual = 1
			GROUP BY 
         		m.placa
        ";

		// --- 2. Consulta para viajes FINALIZADOS (últimos 50) ---
		$sql_finalizados = "
            SELECT
                CONCAT(cond.nombre,' ',cond.apellido1,' ',cond.apellido2) AS Conductor,
				cond.celular,
                m.placa,
                CONCAT(vc.nombre,'-',vc.descripcion) AS Configuracion,
                cr.descripcion AS Carroceria,
                IFNULL(t.placa,'-') AS Trailer,
                m.fecha_expedicion
            FROM
                cmx_manifiesto m
                INNER JOIN cmx_municipios mu1 ON m.origen_viaje = mu1.id
                INNER JOIN cmx_municipios mu2 ON m.destino_viaje = mu2.id
                INNER JOIN cmx_vehiculos v ON m.placa=v.placa
                INNER JOIN cmx_vehiculo2 v2 ON v.numdoc_vehiculo=v2.id_vehiculo
                INNER JOIN cmx_proveedores cond ON m.conductor_manifiesto=cond.numero_documento
                INNER JOIN cmx_rndc_vehiculos_configuracion vc ON v2.configuracion=vc.id
                INNER JOIN cmx_rndc_vehiculos_carroceria cr ON v.tipo_carroceria=cr.id
                LEFT JOIN cmx_trailer_vehiculo tv ON v.numdoc_vehiculo=tv.id_vehiculo
                LEFT JOIN cmx_trailer t ON tv.id_trailer=t.id
            WHERE
                mu1.rndc_codigo_ciudad = :origen_finalizado
                AND mu2.rndc_codigo_ciudad = :destino_finalizado
                AND m.estado_seguimiento IN('FINALIZADO','CUMPLIDO')
                AND m.estadomnf_actual = 1
                AND m.fecha_expedicion >= '2025-01-01'
            ORDER BY m.fecha_expedicion DESC
            LIMIT 50
        ";

		try {
			// --- Ejecutar la primera consulta ---
			$stmt1 = $this->_db3->prepare($sql_en_curso);
			// Usamos bindParam para vincular la variable $Origen
			$stmt1->bindParam(':origen_curso', $Origen, PDO::PARAM_STR);
			$stmt1->execute();
			// Guardamos los resultados en su clave correspondiente
			$resultados['en_curso'] = $stmt1->fetchAll(PDO::FETCH_ASSOC);

			// --- Ejecutar la segunda consulta ---
			$stmt2 = $this->_db3->prepare($sql_finalizados);
			// Reutilizamos la misma variable $Origen para el segundo parámetro
			$stmt2->bindParam(':origen_finalizado', $Origen, PDO::PARAM_STR);
			$stmt2->bindParam(':destino_finalizado', $Destino, PDO::PARAM_STR);
			$stmt2->execute();
			// Guardamos los resultados en su clave correspondiente
			$resultados['finalizados'] = $stmt2->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			// Es buena práctica manejar errores
			$resultados['error'] = "Error en la consulta: " . $e->getMessage();
			// En un entorno de producción, deberías registrar este error en un log
			// error_log($e->getMessage());
		}

		// Devolvemos el array único con toda la información
		return $resultados;
	}

	public function Insertar_Gestion_Vehiculo($estado, $observaciones, $gestion_id)
	{
		// Usuario autenticado o por defecto
		$usuario = $_SESSION['usuario']['nom_usuario'] ?? 'SYSTEM_USER';

		// Fecha y hora actuales
		try {
			$date = new DateTime('now', new DateTimeZone('America/Bogota'));
			$fecha_actual_db = $date->format('Y-m-d');
			$hora_actual_db = $date->format('H:i:s');
		} catch (Exception $e) {
			return [
				'status' => false,
				'message' => 'Error al obtener la zona horaria: ' . $e->getMessage()
			];
		}

		try {
			$this->_db3->beginTransaction();

			//Update estado de la tabla cabezera 
			$sqlUpdate = $this->_db3->prepare("UPDATE cmx_gestion_vehiculo SET estado_enturnamiento = :estado_enturnamiento WHERE id = :gestion_id");
			$sqlUpdate->bindParam(':estado_enturnamiento', $estado);
			$sqlUpdate->bindParam(':gestion_id', $gestion_id, PDO::PARAM_INT);
			$sqlUpdate->execute();

			if (!$sqlUpdate) throw new Exception("Error al procesar gestion del vehiculo");

			$sql = "INSERT INTO cmx_gestionados 
                (gestionado_id, estado_gestion, observacion, usuario, fecha, hora) 
                VALUES (:gestionado_id, :estado, :observaciones, :usuario, :fecha, :hora)";

			$stmt = $this->_db3->prepare($sql);
			$stmt->bindParam(':gestionado_id', $gestion_id, PDO::PARAM_INT);
			$stmt->bindParam(':estado', $estado);
			$stmt->bindParam(':observaciones', $observaciones);
			$stmt->bindParam(':usuario', $usuario);
			$stmt->bindParam(':fecha', $fecha_actual_db);
			$stmt->bindParam(':hora', $hora_actual_db);

			if ($stmt->execute()) {
				$this->_db3->commit();
				return [
					'status' => true,
					'message' => '✅ Gestión registrada exitosamente.',
					'data' => [
						'gestionado_id' => $gestion_id,
						'usuario' => $usuario,
						'fecha' => $fecha_actual_db,
						'hora' => $hora_actual_db
					]
				];
			} else {
				$this->_db3->rollBack();
				return [
					'status' => false,
					'message' => '❌ No se pudo registrar la gestión (sin cambios).'
				];
			}
		} catch (Exception $e) {
			$this->_db3->rollBack();
			return [
				'status' => false,
				'message' => '❌ Error al insertar la gestión: ' . $e->getMessage()
			];
		}
	}

	public function HistoricoGestion($gestionId)
	{
		$sql = "SELECT gv.id AS gestion_id, gv.estado_enturnamiento, ge.observacion, ge.usuario, ge.fecha, ge.hora
            FROM cmx_gestion_vehiculo gv
            INNER JOIN cmx_gestionados ge ON gv.id = ge.gestionado_id
            WHERE gv.id = :gestionId
            ORDER BY ge.id DESC";

		$stmt = $this->_db3->prepare($sql);
		$stmt->bindParam(':gestionId', $gestionId, PDO::PARAM_INT);
		$stmt->execute();

		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public function BuscarPorPlaca($placa)
	{
		$sql = "SELECT
			v.placa,
   			v.web_satelital,
			v.usuario_satelital,
   			v.clave_satelital,
			pro.numero_documento AS Documento_Propietario,
			CONCAT(pro.nombre,' ',IFNULL(pro.apellido1, ''),' ',IFNULL(pro.apellido2, '')) AS Propietario,
			ten.numero_documento AS Documento_Tenedor,
			CONCAT(ten.nombre,' ',IFNULL(ten.apellido1, ''),' ',IFNULL(ten.apellido2, '')) AS Tenedor,
			cond.numero_documento AS Documento_Conductor,
			CONCAT(cond.nombre,' ',IFNULL(cond.apellido1, ''),' ',IFNULL(cond.apellido2, '')) AS Conductor,
			IFNULL(t.placa,'-') AS Trailer,
			prot.numero_documento AS Documento_Propietario_Trailer,
			CONCAT(prot.nombre,' ',IFNULL(prot.apellido1, ''),' ',IFNULL(prot.apellido2, '')) AS Propietario_Trailer,
			tent.numero_documento AS Documento_Poseedor_Trailer,
			CONCAT(tent.nombre,' ',IFNULL(tent.apellido1, ''),' ',IFNULL(tent.apellido2, '')) AS Propietario_Trailer
		FROM
			cmx_vehiculos v
			INNER JOIN cmx_proveedores pro ON v.id_propietario = pro.numdoc_nexos
			INNER JOIN cmx_proveedores ten ON v.id_tenedor = ten.numdoc_nexos
			INNER JOIN cmx_proveedores cond ON v.id_conductor = cond.numdoc_nexos
			INNER JOIN cmx_vehiculo2 v2 ON v.id = v2.id_vehiculo
			LEFT JOIN cmx_trailer_vehiculo tv ON v.numdoc_vehiculo=tv.id_vehiculo
			LEFT JOIN cmx_trailer  t ON tv.id_trailer=t.id
			LEFT JOIN cmx_proveedores prot ON t.doc_propietario = prot.numdoc_nexos
			LEFT JOIN cmx_proveedores tent ON t.doc_poseedor = tent.numdoc_nexos
		WHERE v.placa= :placa
            LIMIT 1";
		$stmt = $this->_db3->prepare($sql);
		$stmt->bindParam(':placa', $placa);
		$stmt->execute();

		return $stmt->fetch(PDO::FETCH_ASSOC);
	}

	public function insertarEntrunamientoVehiculos($data)
	{
		try {
			// Iniciar transacción
			$this->_db3->beginTransaction();

			$sql = "INSERT INTO cmx_enturnamiento_vehiculo (
                        placa_vehiculo, configuracion_vehiculo, documento_propietario, nombre_propietario,
                        documento_tenedor, nombre_tenedor, documento_conductor, nombre_conductor,
                        Trailer, placa_trailer, documento_propietario_trailer, nombre_propietario_trailer,
												origen_enturnar, destino_enturnar, ubicacion_actual, agencia, estado, usuario, fecha, hora, empresa_id
                    ) VALUES (
                        :placa_vehiculo, :configuracion_vehiculo, :documento_propietario, :nombre_propietario,
                        :documento_tenedor, :nombre_tenedor, :documento_conductor, :nombre_conductor,
                        :Trailer, :placa_trailer, :documento_propietario_trailer, :nombre_propietario_trailer,
												:origen_enturnar, :destino_enturnar, :ubicacion_actual, :agencia, :estado, :usuario, :fecha, :hora, :empresa_id
                    )";

			$stmt = $this->_db3->prepare($sql);

			$fecha = date('Y-m-d');
			$hora  = date('H:i:s');
			$usuario = $_SESSION['usuario']['nom_usuario'] ?? 'SYSTEM_USER';
			$empresa_id = $_SESSION['usuario']['empresa_id'] ?? 1;

			$stmt->execute([
				':placa_vehiculo' => $data['placa_vehiculo'],
				':configuracion_vehiculo' => $data['configuracion_vehiculo'],
				':documento_propietario' => $data['documento_propietario'],
				':nombre_propietario' => $data['nombre_propietario'],
				':documento_tenedor' => $data['documento_tenedor'],
				':nombre_tenedor' => $data['nombre_tenedor'],
				':documento_conductor' => $data['documento_conductor'],
				':nombre_conductor' => $data['nombre_conductor'],
				':Trailer' => $data['Trailer'],
				':placa_trailer' => $data['placa_trailer'] ?: null,
				':documento_propietario_trailer' => $data['documento_propietario_trailer'] ?: null,
				':nombre_propietario_trailer' => $data['nombre_propietario_trailer'] ?: null,
				':origen_enturnar' => $data['origen_enturnar'] ?: null,
				':destino_enturnar' => $data['destino_enturnar'] ?: null,
				':ubicacion_actual' => $data['ubicacion_actual'] ?: null,
				':agencia' => null,
				':estado' => 'Enturnado',
				':usuario' => $usuario,
				':fecha' => $fecha,
				':hora' => $hora,
				':empresa_id' => $empresa_id
			]);

			// Confirmar transacción
			$this->_db3->commit();

			// Retornar mensaje de éxito
			return [
				'status' => true,
				'message' => '✅ Registro insertado correctamente.',
				'placa' => $data['placa_vehiculo']
			];
		} catch (PDOException $e) {
			// Revertir transacción
			$this->_db3->rollBack();

			// Retornar mensaje de error
			return [
				'status' => false,
				'message' => '❌ Error al insertar el registro: ' . $e->getMessage()
			];
		}
	}

	// public function ListarVehiculosEnturnados()
	// {
	// 	try {
	// 		$sql = "SELECT
	// 			v.id,
	// 			v.placa_vehiculo,
	// 			CONCAT(c.nombre,' ', IFNULL(c.apellido1, ''),' ', IFNULL(c.apellido2, '')) AS conductor,
	// 			c.celular,
	// 			v.usuario,
	// 			v.estado,
	// 			v.ubicacion_actual,
	// 			v.agencia,
	// 			CONCAT(ori.municipio, ' - ', ori.depto) AS Origen,
	// 			CONCAT(des.municipio, ' - ', des.depto) AS Destino
	// 		FROM
	// 			cmx_enturnamiento_vehiculo v
	// 			LEFT JOIN cmx_vehiculos vh ON v.placa_vehiculo = vh.placa
	// 			LEFT JOIN cmx_proveedores c ON vh.id_conductor = c.numdoc_nexos
	// 			LEFT JOIN cmx_municipios ori ON v.origen_enturnar = ori.rndc_codigo_ciudad
	// 			LEFT JOIN cmx_municipios des ON v.destino_enturnar = des.rndc_codigo_ciudad
	// 		WHERE v.estado='Enturnado' AND v.estado_gestion='Pendiente'
	// 		ORDER BY
	// 			v.id DESC";

	// 		$stmt = $this->_db3->prepare($sql);
	// 		$stmt->execute();
	// 		$vehiculos = $stmt->fetchAll(PDO::FETCH_ASSOC);

	// 		return [
	// 			'status' => true,
	// 			'data' => $vehiculos
	// 		];
	// 	} catch (PDOException $e) {
	// 		return [
	// 			'status' => false,
	// 			'message' => 'Error al listar vehículos enturnados: ' . $e->getMessage()
	// 		];
	// 	}
	// }

	public function ListarVehiculosEnturnados($filtros = [])
	{
		try {
			$where = [];
			$params = [];

			$sql = "
								SELECT
										v.id,
										v.placa_vehiculo,
										CONCAT(c.nombre,' ', IFNULL(c.apellido1,''),' ', IFNULL(c.apellido2,'')) AS conductor,
										c.celular,
										v.usuario,
										v.estado,
										v.ubicacion_actual,
										v.agencia,
										CONCAT(v.fecha,' ',v.hora) AS Fecha_Enturnar,
										CONCAT(ori.municipio,' - ',ori.depto) AS Origen,
										CONCAT(des.municipio,' - ',des.depto) AS Destino
								FROM cmx_enturnamiento_vehiculo v
								LEFT JOIN cmx_vehiculos vh ON v.placa_vehiculo = vh.placa
								LEFT JOIN cmx_proveedores c ON vh.id_conductor = c.numdoc_nexos
								LEFT JOIN cmx_municipios ori ON v.origen_enturnar = ori.rndc_codigo_ciudad
								LEFT JOIN cmx_municipios des ON v.destino_enturnar = des.rndc_codigo_ciudad
								WHERE v.estado = 'Enturnado'
								AND v.estado_gestion = 'Pendiente'
        			";

			if (!empty($filtros['origen'])) {
				$where[] = "v.origen_enturnar = :origen";
				$params[':origen'] = $filtros['origen'];
			}

			if (!empty($filtros['destino'])) {
				$where[] = "v.destino_enturnar = :destino";
				$params[':destino'] = $filtros['destino'];
			}

			if (!empty($filtros['fecha_inicio']) && !empty($filtros['fecha_final'])) {
				// $where[] = "DATE(v.created_at) BETWEEN :fi AND :ff";
				$where[] = "DATE(v.fecha) BETWEEN :fi AND :ff";
				$params[':fi'] = $filtros['fecha_inicio'];
				$params[':ff'] = $filtros['fecha_final'];
			}

			if ($where) {
				$sql .= ' AND ' . implode(' AND ', $where);
			}

			$sql .= " ORDER BY v.id DESC";

			$stmt = $this->_db3->prepare($sql);
			$stmt->execute($params);

			return [
				'status' => true,
				'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)
			];
		} catch (PDOException $e) {
			return [
				'status' => false,
				'message' => $e->getMessage()
			];
		}
	}

	public function ActualizarGestion($id, $estado, $motivo, $usuario, $fecha, $hora)
	{
		$sql = "UPDATE cmx_enturnamiento_vehiculo 
            SET 
								estado         = :estado_enturnado
                estado_gestion = :estado,
                motivo_gestion = :motivo,
                usuario_gestion = :usuario,
                fecha_gestion = :fecha,
                hora_gestion = :hora
            WHERE id = :id";

		$stmt = $this->_db3->prepare($sql);
		$stmt->bindParam(':estado_enturnado', $estado);
		$stmt->bindParam(':estado', $estado);
		$stmt->bindParam(':motivo', $motivo);
		$stmt->bindParam(':usuario', $usuario);
		$stmt->bindParam(':fecha', $fecha);
		$stmt->bindParam(':hora', $hora);
		$stmt->bindParam(':id', $id);

		return $stmt->execute();
	}

	public function ListarVehiculosHistoricoEnturnados()
	{
		try {
			$sql = "SELECT
				v.id,
				v.placa_vehiculo,
				CONCAT(c.nombre,' ', IFNULL(c.apellido1, ''),' ', IFNULL(c.apellido2, '')) AS conductor,
				c.celular,
				v.usuario,
				v.estado,
				v.ubicacion_actual,
				v.agencia,
				CONCAT(ori.municipio, ' - ', ori.depto) AS Origen,
				CONCAT(des.municipio, ' - ', des.depto) AS Destino
			FROM
				cmx_enturnamiento_vehiculo v
				LEFT JOIN cmx_vehiculos vh ON v.placa_vehiculo = vh.placa
				LEFT JOIN cmx_proveedores c ON vh.id_conductor = c.numdoc_nexos
				LEFT JOIN cmx_municipios ori ON v.origen_enturnar = ori.rndc_codigo_ciudad
				LEFT JOIN cmx_municipios des ON v.destino_enturnar = des.rndc_codigo_ciudad
			WHERE v.estado <> 'Enturnado' AND v.estado_gestion <> 'Pendiente'
			ORDER BY
				v.id DESC";

			$stmt = $this->_db3->prepare($sql);
			$stmt->execute();
			$vehiculos = $stmt->fetchAll(PDO::FETCH_ASSOC);

			return [
				'status' => true,
				'data' => $vehiculos
			];
		} catch (PDOException $e) {
			return [
				'status' => false,
				'message' => 'Error al listar vehículos enturnados: ' . $e->getMessage()
			];
		}
	}


	/*********** FIN - FUNCIONES PARA LA CREACIÓN DE SELECTS **********/
}
