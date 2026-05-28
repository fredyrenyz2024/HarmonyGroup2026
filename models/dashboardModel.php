<?php
class dashboardModel extends Model
{

	public function __construct()
	{
		parent::__construct();
	}

	/****** CONSULTAS DE LISTADO DE MATERIAL PENDIENTE ******/
	public function getSolicitudesPendientes()
	{
		$sql = " 
				SELECT 
					(
						SELECT 
							COUNT(cia1.id) CUANTOS
						FROM 
							cmx_importacion_actividades cia1
						WHERE 
							cia1.estado != 3
							AND cia1.id_importacion = cip.id
						HAVING CUANTOS = 0
					) ACTIVIDADES_INICIADAS
				FROM 
					cmx_importacion_proyecto cip 
				WHERE 
					cip.estado NOT IN (0,4)
				HAVING ACTIVIDADES_INICIADAS = 0
			";
		$request = $this->_db->getConsulta($sql);
		return $request;
	}

	public function getProyectosIniciados()
	{
		$sql = "
				SELECT 
					COUNT(DISTINCT(cip.numero_importacion))
				FROM 
					cmx_importacion_proyecto cip 
					INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
				WHERE 
					cia.estado = 2
					AND cip.estado NOT IN (0,4)
					GROUP BY cip.numero_importacion;
			";
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	public function getMaterialPendiente()
	{
		$sql = "
				SELECT 
					cip.numero_importacion NUM_ORDEN, cc.nombre CLIENTE,
					crd.nombre DESTINO, CONCAT(cm.municipio,' (',cm.depto,' - ',cm.pais,')') CIUDAD_DESTINO,
					cms.tipo_mercancia MATERIAL,
					IF (
						(   SELECT COUNT(cav1.id) CUANTOS1 
							FROM cmx_agrupaciones_vehiculos cav1 
							INNER JOIN cmx_agrupacion_material cam1 ON cam1.id_agrupamiento = cav1.id_agrupacion
							WHERE 
								cam1.id_material_proyecto = cim.id
							HAVING CUANTOS1 > 0
						),
						(
							IF (
								(   SELECT cav1.id 
									FROM cmx_agrupaciones_vehiculos cav1 
									INNER JOIN cmx_agrupacion_material cam1 ON cam1.id_agrupamiento = cav1.id_agrupacion
									WHERE 
										cam1.id_material_proyecto = cim.id
										AND cav1.estado IN ('Cancelado','Aprobado','Anticipo Asignado','Planillado')
								),'NO HAY', 'MOSTRAR'
							)
						), 'MOSTRAR'
					) HAY_VEHICULO_ASIGNADO,
					ctm.*
				FROM 
					cmx_tramo_solicitud cts
					INNER JOIN cmx_solicitudes cs ON cs.id = cts.id_solicitud
					INNER JOIN cmx_tramo_material ctm ON ctm.id_tramo = cts.id
					INNER JOIN cmx_mercancia_solicitud cms ON cms.id = ctm.id_material
					INNER JOIN cmx_remitente_destinatario crd ON crd.id = cts.id_remitente_destinatario
					INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
					INNER JOIN cmx_importacion_material cim ON cim.id = ctm.id_material_proyecto
					INNER JOIN cmx_importacion_proyecto cip ON cip.id = cim.id_importacion
					INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
				WHERE
					cts.tipo_operacion = 'Descargue'
					AND ctm.peso_pendiente > 0
					AND cip.estado NOT IN (0,4)
				HAVING HAY_VEHICULO_ASIGNADO = 'MOSTRAR'
			";
		$result = $this->_db->getConsulta($sql);
		return $result;
	}
	/****** FIN CONSULTAS DE LISTADO DE MATERIAL PENDIENTE ******/

	/****** CONSULTAS DE LISTADO CARGUES ******/
	public function getSeguimientoCargue($id_cliente)
	{
		$filtro_cliente = "";
		$filtro_estado_actividad  = " cia.estado = 2 ";
		if ($id_cliente != 1) {
			$filtro_cliente = " AND cip.id_cliente = " . $id_cliente . " ";
			$filtro_estado_actividad  = " cia.estado IN (1,2) ";
		}

		$sql = '
				SELECT 
					cia.id ID_ACTIVIDAD, cip.numero_importacion, cip.importacion, cc.nombre NOMBRE_CLIENTE, 
					crd.nombre ORIGEN, CONCAT(cm.municipio," (", cm.depto," - ", cm.pais,")") CIUDAD_ORIGEN, 
					IF( 
						(SELECT COUNT(cisc1.id) FROM cmx_importacion_seguimiento_cargue cisc1 WHERE cisc1.id_actividad = cia.id ) > 0, 
						1, 
						0 
					) ULTIMO_SEGUIMIENTO, 
					IF( 
						(SELECT COUNT(cisc1.id) FROM cmx_importacion_seguimiento_cargue cisc1 WHERE cisc1.id_actividad = cia.id ) > 0, 
						(SELECT MAX(cisc1.fecha_hora) FROM cmx_importacion_seguimiento_cargue cisc1 WHERE cisc1.id_actividad = cia.id), 
						cia.fecha_hora_inicio 
					) ULTIMO_SEGUIMIENTO_FECHA, 
					IF( 
						(SELECT COUNT(cisc1.id) FROM cmx_importacion_seguimiento_cargue cisc1 WHERE cisc1.id_actividad = cia.id ) > 0, 
						(
							SELECT cisc1.tipo_seguimiento 
							FROM cmx_importacion_seguimiento_cargue cisc1 
							WHERE 
								cisc1.id_actividad = cia.id 
								AND cisc1.id = (
									SELECT MAX(cisc2.id) 
									FROM cmx_importacion_seguimiento_cargue cisc2 
									WHERE cisc2.id_actividad = cia.id) ), 
						"" 
					) ULTIMO_SEGUIMIENTO_TIPO_SEGUIMIENTO, 
					IF( 
						(SELECT COUNT(cisc1.id) FROM cmx_importacion_seguimiento_cargue cisc1 WHERE cisc1.id_actividad = cia.id ) > 0, 
						(
							SELECT cisc1.observacion 
							FROM cmx_importacion_seguimiento_cargue cisc1 
							WHERE cisc1.id_actividad = cia.id 
							AND cisc1.id = (	
								SELECT MAX(cisc2.id) 
								FROM cmx_importacion_seguimiento_cargue cisc2 
								WHERE cisc2.id_actividad = cia.id
							) 
						), 
						"No se han registrado seguimientos" 
					) ULTIMO_SEGUIMIENTO_OBSERVACION, 
					IF( 
						(SELECT COUNT(cisc1.id) FROM cmx_importacion_seguimiento_cargue cisc1 WHERE cisc1.id_actividad = cia.id ) > 0, 
						(
							SELECT cisc1.observacion_interna 
							FROM cmx_importacion_seguimiento_cargue cisc1 
							WHERE 
								cisc1.id_actividad = cia.id 
								AND cisc1.id = (	
									SELECT MAX(cisc2.id) 
									FROM cmx_importacion_seguimiento_cargue cisc2 
									WHERE cisc2.id_actividad = cia.id
								) 
						), 
						"" 
					) ULTIMO_SEGUIMIENTO_OBSERVACION_INTERNA, 
					SUM( cam.peso ) PESO, ctv.nombre TIPO_VEHICULO, cia.estado ESTADO_ACTIVIDAD 
				FROM 
					cmx_importacion_actividades cia 
					INNER JOIN cmx_importacion_proyecto cip ON cip.id = cia.id_importacion 
					INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente 
					INNER JOIN cmx_agrupacion_material cam ON cam.id_material_proyecto = cia.id_material 
					INNER JOIN cmx_agrupaciones_vehiculos cav ON cav.id_agrupacion = cam.id_agrupamiento 
					INNER JOIN cmx_vehiculos cv ON cav.id_vehiculo = cv.id 
					INNER JOIN cmx_tipo_vehiculos ctv ON ctv.id = cv.tipo_vehiculo 
					INNER JOIN cmx_importacion_material cim ON cim.id = cia.id_material
					INNER JOIN cmx_mercancia_solicitud cms ON cms.id_material_proyecto = cim.id
					INNER JOIN cmx_tramo_solicitud cts ON cts.id_solicitud = cms.id_solicitud
					INNER JOIN cmx_remitente_destinatario crd ON crd.id = cts.id_remitente_destinatario
					INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
				WHERE 
					' . $filtro_estado_actividad . '
					AND cia.tipo_actividad = "carga_inicial"
					AND cip.estado NOT IN (0,4)
					AND cav.estado = "Aprobado"
					' . $filtro_cliente . '
				GROUP BY cia.id_importacion, cia.grupo
				ORDER BY cia.estado DESC, cia.id_importacion;
			';
		// echo "<pre>" . $sql . "</pre>";
		$request = $this->_db->getConsulta($sql);
		return $request;
	}
	/****** FIN CONSULTAS DE LISTADO CARGUES ******/

	/****** CONSULTAS DE LISTADO DE VERIFICACION DE MATERIALES ******/
	public function getVerificacionMaterial($id_cliente)
	{
		$_filter_cliente = '';
		$_filter_estado = ' AND cia.estado = 2 ';

		if ($id_cliente != 1) {
			$_filter_cliente = ' AND cip.id_cliente = ' . $id_cliente . ' ';
			$_filter_estado = ' AND cia.estado != 3 ';
		}

		// Consulta para registro de cargue 
		$sql = 'SELECT cia.id, cia.estado, cip.importacion, cc.nombre CLIENTE, 
					crd.nombre, CONCAT(cm.municipio," (",cm.depto," - ",cm.pais,")") CIUDAD_ORIGEN, 
					SUM( cam.peso ) PESO, 
					(SELECT
							COUNT( DISTINCT(cia1.id_material) )
						FROM
							cmx_importacion_proyecto cip1
							INNER JOIN cmx_importacion_actividades cia1 ON cia1.id_importacion = cip1.id
							INNER JOIN cmx_agrupacion_material cam1 ON cam1.id_material_proyecto = cia1.id_material
							INNER JOIN cmx_mercancia_solicitud cms1 ON cms1.id_material_proyecto = cia1.id_material
							INNER JOIN cmx_agrupacion_solicitudes cas1 ON cas1.id_solicitud = cms1.id_solicitud AND cas1.id_agrupacion = cam1.id_agrupamiento
						WHERE
							cip1.id = cip.id
							AND cia1.id_material IS NOT NULL
							AND cas1.id_agrupacion = cas.id_agrupacion
							AND cas1.id_solicitud = cas.id_solicitud
					) CANTIDAD_MATERIALES, 
					( SELECT COUNT(ciia1.id) FROM cmx_importacion_imagen_actividad ciia1 WHERE ciia1.id_actividad = cia.id ) CANTIDAD_IMAGENES 
				FROM 
					cmx_importacion_proyecto cip 
					INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id 
					INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente 
					INNER JOIN cmx_agrupacion_material cam ON cam.id_material_proyecto = cia.id_material 
					INNER JOIN cmx_mercancia_solicitud cms ON cms.id_material_proyecto = cia.id_material
					INNER JOIN cmx_agrupacion_solicitudes cas ON cas.id_solicitud = cms.id_solicitud AND cas.id_agrupacion = cam.id_agrupamiento
					INNER JOIN cmx_tramo_solicitud cts ON cts.id_solicitud = cms.id_solicitud
					INNER JOIN cmx_tramos_orden cto ON cto.id_tramo = cts.id
					INNER JOIN cmx_remitente_destinatario crd ON crd.id = cts.id_remitente_destinatario
					INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
				WHERE 
					cia.tipo_actividad = "verificacion_mercancia"
					' . $_filter_cliente . '
					' . $_filter_estado . '
					AND cia.id_material IS NOT NULL
					AND cip.estado NOT IN (0,4)
				GROUP BY cia.id_importacion, cia.grupo, cia.orden 
				ORDER BY cia.fecha_hora_finalizacion DESC
				LIMIT 20
			';
		// echo "<pre>" . $sql . "</pre>";
		// $request = $this->_db->getConsulta($sql);
		$request = $this->_db3->prepare($sql);
		$request->execute();
		$request = $request->fetchAll(PDO::FETCH_ASSOC);

		return $request;
	}
	/****** FIN CONSULTAS DE LISTADO DE VERIFICACION DE MATERIALES ******/

	/****** CONSULTAS DE LISTADO DE RUTAS EN TRÁNSITO ******/
	public function getSeguimientoRutas($id_cliente)
	{
		$fecha_hora_actual = date('Y-m-d H:i:s', time());
		$filtro_cliente = "";
		$filtro_estado_actividad  = " cia.estado = 2 ";
		if ($id_cliente != 1) {
			$filtro_cliente = " AND cip.id_cliente = " . $id_cliente . " ";
			$filtro_estado_actividad  = " cia.estado IN (1,2) ";
		}

		$sql = '
				SELECT 
					cia.id ID_ACTIVIDAD,
					cip.numero_importacion, cip.importacion,  
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
					TIMESTAMPDIFF(HOUR, 
						IF(
							(SELECT COUNT(cisr1.id) FROM cmx_importacion_seguimiento_rutas cisr1 WHERE cisr1.id_actividad = cia.id ) > 0,
							(SELECT MAX(cisr1.fecha_hora) FROM cmx_importacion_seguimiento_rutas cisr1 WHERE cisr1.id_actividad = cia.id),
							cia.fecha_hora_inicio
						),
						"' . $fecha_hora_actual . '"
					) DIFERENCIA,
					IF(
						(SELECT COUNT(cisr1.id) FROM cmx_importacion_seguimiento_rutas cisr1 WHERE cisr1.id_actividad = cia.id ) > 0,
						(	SELECT cisr1.ubicacion 
							FROM cmx_importacion_seguimiento_rutas cisr1 
							WHERE 
								cisr1.id_actividad = cia.id 
								AND cisr1.id = (	SELECT MAX(cisr2.id) 
														FROM cmx_importacion_seguimiento_rutas cisr2 
														WHERE cisr2.id_actividad = cia.id) ),
						crd.sigla
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
					ctv.nombre TIPO_VEHICULO,
					cia.estado ESTADO_ACTIVIDAD
				FROM 
					cmx_importacion_actividades cia
					INNER JOIN cmx_importacion_proyecto cip ON cip.id = cia.id_importacion
					INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
					INNER JOIN cmx_agrupacion_material cam ON cam.id_material_proyecto = cia.id_material
					INNER JOIN cmx_agrupaciones_vehiculos cav ON cav.id_agrupacion = cam.id_agrupamiento
					INNER JOIN cmx_vehiculos cv ON cav.id_vehiculo = cv.id
					INNER JOIN cmx_tipo_vehiculos ctv ON ctv.id = cv.tipo_vehiculo
					INNER JOIN cmx_importacion_material cim ON cim.id = cia.id_material
					INNER JOIN cmx_mercancia_solicitud cms ON cms.id_material_proyecto = cim.id
					INNER JOIN cmx_tramo_solicitud cts ON cts.id_solicitud = cms.id_solicitud
					INNER JOIN cmx_tramos_orden cto ON cto.id_tramo = cts.id
					INNER JOIN cmx_remitente_destinatario crd ON crd.id = cts.id_remitente_destinatario
					INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
				WHERE
					' . $filtro_estado_actividad . '
					AND cia.tipo_actividad = "seguimiento_ruta"
					AND cip.estado NOT IN (0,4)
					' . $filtro_cliente . '
				GROUP BY cia.id_importacion, cia.grupo
				ORDER BY cia.estado DESC, cia.id_importacion
				LIMIT 20;
			';
		// echo "<pre>" . $sql . "</pre>";
		$request = $this->_db->getConsulta($sql);
		return $request;
	}
	/****** FIN CONSULTAS DE LISTADO DE RUTAS EN TRÁNSITO ******/

	/****** CONSULTAS DE LISTADO DESCARGUES ******/
	public function getSeguimientoDescargue($id_cliente)
	{
		$filtro_cliente = "";
		$filtro_estado_actividad  = " cia.estado = 2 ";
		if ($id_cliente != 1) {
			$filtro_cliente = " AND cip.id_cliente = " . $id_cliente . " ";
			$filtro_estado_actividad  = " cia.estado IN (1,2) ";
		}

		$sql = '
				SELECT 
					cia.id ID_ACTIVIDAD, cip.numero_importacion, cip.importacion, cc.nombre NOMBRE_CLIENTE, 
					crd.nombre ORIGEN, CONCAT(cm.municipio," (", cm.depto," - ", cm.pais,")") CIUDAD_ORIGEN, 
					IF( 
						(SELECT COUNT(cisd1.id) FROM cmx_importacion_seguimiento_descargue cisd1 WHERE cisd1.id_actividad = cia.id ) > 0, 
						1, 
						0 
					) ULTIMO_SEGUIMIENTO, 
					IF( 
						(SELECT COUNT(cisd1.id) FROM cmx_importacion_seguimiento_descargue cisd1 WHERE cisd1.id_actividad = cia.id ) > 0, 
						(SELECT MAX(cisd1.fecha_hora) FROM cmx_importacion_seguimiento_descargue cisd1 WHERE cisd1.id_actividad = cia.id), 
						cia.fecha_hora_inicio 
					) ULTIMO_SEGUIMIENTO_FECHA, 
					IF( 
						(SELECT COUNT(cisd1.id) FROM cmx_importacion_seguimiento_descargue cisd1 WHERE cisd1.id_actividad = cia.id ) > 0, 
						(
							SELECT cisd1.tipo_seguimiento 
							FROM cmx_importacion_seguimiento_descargue cisd1 
							WHERE 
								cisd1.id_actividad = cia.id 
								AND cisd1.id = ( 
									SELECT MAX(cisd2.id) 
									FROM cmx_importacion_seguimiento_descargue cisd2 
									WHERE cisd2.id_actividad = cia.id
								) 
						),
						"" 
					) ULTIMO_SEGUIMIENTO_TIPO_SEGUIMIENTO, 
					IF( 
						(SELECT COUNT(cisd1.id) FROM cmx_importacion_seguimiento_descargue cisd1 WHERE cisd1.id_actividad = cia.id ) > 0, 
						(
							SELECT cisd1.observacion 
							FROM cmx_importacion_seguimiento_descargue cisd1 
							WHERE 
								cisd1.id_actividad = cia.id 
								AND cisd1.id = (	
									SELECT MAX(cisd2.id) 
									FROM cmx_importacion_seguimiento_descargue cisd2 
									WHERE cisd2.id_actividad = cia.id 
								) 
						), 
						"No se han registrado seguimientos" 
					) ULTIMO_SEGUIMIENTO_OBSERVACION, 
					IF( 
						(SELECT COUNT(cisd1.id) FROM cmx_importacion_seguimiento_descargue cisd1 WHERE cisd1.id_actividad = cia.id ) > 0, 
						(
							SELECT cisd1.observacion_interna 
							FROM cmx_importacion_seguimiento_descargue cisd1 
							WHERE 
								cisd1.id_actividad = cia.id 
								AND cisd1.id = (	
									SELECT MAX(cisd2.id) 
									FROM cmx_importacion_seguimiento_descargue cisd2 
									WHERE cisd2.id_actividad = cia.id 
								) 
						), 
						"" 
					) ULTIMO_SEGUIMIENTO_OBSERVACION_INTERNA, 
					SUM( cam.peso ) PESO, ctv.nombre TIPO_VEHICULO, cia.estado ESTADO_ACTIVIDAD 
				FROM 
					cmx_importacion_actividades cia 
					INNER JOIN cmx_importacion_proyecto cip ON cip.id = cia.id_importacion 
					INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente 
					INNER JOIN cmx_agrupacion_material cam ON cam.id_material_proyecto = cia.id_material 
					INNER JOIN cmx_agrupaciones_vehiculos cav ON cav.id_agrupacion = cam.id_agrupamiento 
					INNER JOIN cmx_vehiculos cv ON cav.id_vehiculo = cv.id 
					INNER JOIN cmx_tipo_vehiculos ctv ON ctv.id = cv.tipo_vehiculo 
					INNER JOIN cmx_importacion_material cim ON cim.id = cia.id_material
					INNER JOIN cmx_mercancia_solicitud cms ON cms.id_material_proyecto = cim.id
					INNER JOIN cmx_tramo_solicitud cts ON cts.id_solicitud = cms.id_solicitud
					INNER JOIN cmx_tramos_orden cto ON cto.id_tramo = cts.id
					INNER JOIN cmx_remitente_destinatario crd ON crd.id = cts.id_remitente_destinatario
					INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
				WHERE 
					' . $filtro_estado_actividad . '
					AND cia.tipo_actividad = "seguimiento_descarga"
					AND cip.estado NOT IN (0,4)
					' . $filtro_cliente . '
				GROUP BY cia.id_importacion, cia.grupo
				ORDER BY cia.estado DESC, cia.id_importacion
				LIMIT 20;
			';
		// echo "<pre>" . $sql . "</pre>";
		$request = $this->_db->getConsulta($sql);
		return $request;
	}
	/****** FIN CONSULTAS DE LISTADO DESCARGUES ******/

	/****** CONSULTAS DE SEGUIMIENTOS INTERNACIONAL ******/
	public function getIntrSeguimientos($usuario)
	{
		if ($usuario["id_perfil"] == 1 or $usuario["id_perfil"] == 13 or $usuario["id_perfil"] == 21 or $usuario["id_perfil"] == 25 or $usuario["id_perfil"] == 29 or $usuario["id_perfil"] == 22 or $usuario["id_perfil"] == 32 or $usuario["id_perfil"] == 33) {
			$sql = '
					SELECT 
						cip.id ID_PROYECTO, cip.numero_importacion, cip.importacion, cip.tipo_operacion, cis.id ID_PROYECTO_INTERNACIONAL,
						cc.id ID_CLIENTE, cc.nombre, cc.cod_cliente,
						-- SEGUIMEINTO OPERACIONES
						(	SELECT DISTINCT(cia1.id)
							FROM cmx_importacion_actividades cia1
							WHERE cia1.id_importacion = cip.id
								AND cia1.tipo_actividad = "seguimiento" 
								AND cia1.fecha_hora_inicio IS NOT NULL
						) ID_ACTIVIDAD_OPERACIONES,
						(	SELECT DISTINCT(cia1.nombre)
							FROM cmx_importacion_actividades cia1
							WHERE cia1.id_importacion = cip.id
								AND cia1.tipo_actividad = "seguimiento" 
						) ACTIVIDAD_OPERACIONES,
						IF (
							( 	SELECT COUNT(cis1.id)
								FROM cmx_importacion_seguimiento cis1
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento" 
									AND cia1.id_importacion = cip.id
									AND cis1.id_seguimiento IS NULL
							) > 0,
							(	SELECT MAX(cis1.fecha_hora)
								FROM cmx_importacion_seguimiento cis1
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento" 
									AND cia1.id_importacion = cip.id
									AND cis1.id_seguimiento IS NULL
							),
							(	SELECT DISTINCT(cia1.fecha_hora_inicio)
								FROM cmx_importacion_actividades cia1
								WHERE cia1.id_importacion = cip.id
									AND cia1.tipo_actividad = "seguimiento" 
									AND cia1.fecha_hora_inicio IS NOT NULL
							)
						) ULTIMO_SEGUIMIENTO_OPERACIONES,
						IF (
							( 	SELECT COUNT(cis1.id)
								FROM cmx_importacion_seguimiento cis1
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento" 
									AND cia1.fecha_hora_inicio IS NOT NULL
									AND cia1.id_importacion = cip.id
									AND cis1.id_seguimiento IS NULL
							) > 0,
							(	SELECT DISTINCT(cis1.observacion)
								FROM cmx_importacion_seguimiento cis1
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento" 
									AND cia1.id_importacion = cip.id
									AND cia1.fecha_hora_inicio IS NOT NULL
									AND cis1.id_seguimiento IS NULL
									AND cis1.fecha_hora = (
										SELECT MAX(cis2.fecha_hora)
										FROM cmx_importacion_seguimiento cis2
										WHERE cis2.id_actividad = cia1.id
											AND cis2.id_seguimiento IS NULL
									)
							),
							NULL
						) MENSAJE_SEGUIMIENTO_OPERACIONES,
						IF (
							( 	SELECT COUNT(cis1.id)
								FROM cmx_importacion_seguimiento cis1
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento" 
									AND cia1.fecha_hora_inicio IS NOT NULL
									AND cia1.id_importacion = cip.id
									AND cis1.id_seguimiento IS NULL
							) > 0,
							(	SELECT DISTINCT(cu1.nom_usuario)
								FROM cmx_usuarios cu1
									INNER JOIN cmx_importacion_seguimiento cis1 ON cis1.autor = cu1.id
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento" 
									AND cia1.id_importacion = cip.id
									AND cia1.fecha_hora_inicio IS NOT NULL
									AND cis1.id_seguimiento IS NULL
									AND cis1.fecha_hora = (
										SELECT MAX(cis2.fecha_hora)
										FROM cmx_importacion_seguimiento cis2
										WHERE cis2.id_actividad = cia1.id
											AND cis2.id_seguimiento IS NULL
									)
							),
							NULL
						) AUTOR_SEGUIMIENTO_OPERACIONES,
						IF (
							( 	SELECT COUNT(cis1.id)
								FROM cmx_importacion_seguimiento cis1
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento" 
									AND cia1.fecha_hora_inicio IS NOT NULL
									AND cia1.id_importacion = cip.id
									AND cis1.id_seguimiento IS NULL
							) > 0,
							(	SELECT DISTINCT(cu1.url_avatar)
								FROM cmx_usuarios cu1
									INNER JOIN cmx_importacion_seguimiento cis1 ON cis1.autor = cu1.id
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento" 
									AND cia1.id_importacion = cip.id
									AND cia1.fecha_hora_inicio IS NOT NULL
									AND cis1.id_seguimiento IS NULL
									AND cis1.fecha_hora = (
										SELECT MAX(cis2.fecha_hora)
										FROM cmx_importacion_seguimiento cis2
										WHERE cis2.id_actividad = cia1.id
											AND cis2.id_seguimiento IS NULL
									)
							),
							NULL
						) URL_AUTOR_SEGUIMIENTO_OPERACIONES,
						IF(
							(
								DATEDIFF(
									CURDATE(),
									IF (
										( 	SELECT COUNT(cis1.id)
											FROM cmx_importacion_seguimiento cis1
												INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
											WHERE cia1.tipo_actividad = "seguimiento" 
												AND cia1.fecha_hora_inicio IS NOT NULL
												AND cia1.id_importacion = cip.id
												AND cis1.id_seguimiento IS NULL
										) > 0,
										(	SELECT MAX(cis1.fecha_hora)
											FROM cmx_importacion_seguimiento cis1
												INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
											WHERE cia1.tipo_actividad = "seguimiento" 
												AND cia1.fecha_hora_inicio IS NOT NULL
												AND cia1.id_importacion = cip.id
												AND cis1.id_seguimiento IS NULL
										),
										(	SELECT cia1.fecha_hora_inicio
											FROM cmx_importacion_actividades cia1
											WHERE cia1.id_importacion = cip.id
												AND cia1.tipo_actividad = "seguimiento" 
												AND cia1.fecha_hora_inicio IS NOT NULL
										)
									) 
								) 
							) > 0,
							(
								DATEDIFF(
									CURDATE(),
									IF (
										( 	SELECT COUNT(cis1.id)
											FROM cmx_importacion_seguimiento cis1
												INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
											WHERE cia1.tipo_actividad = "seguimiento" 
												AND cia1.fecha_hora_inicio IS NOT NULL
												AND cia1.id_importacion = cip.id
												AND cis1.id_seguimiento IS NULL
										) > 0,
										(	SELECT MAX(cis1.fecha_hora)
											FROM cmx_importacion_seguimiento cis1
												INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
											WHERE cia1.tipo_actividad = "seguimiento" 
												AND cia1.fecha_hora_inicio IS NOT NULL
												AND cia1.id_importacion = cip.id
												AND cis1.id_seguimiento IS NULL
										),
										(	SELECT cia1.fecha_hora_inicio
											FROM cmx_importacion_actividades cia1
											WHERE cia1.id_importacion = cip.id
												AND cia1.tipo_actividad = "seguimiento" 
												AND cia1.fecha_hora_inicio IS NOT NULL
										)
									) 
								) 
							),
							0
						)DIAS_OPERACIONES,
						(	SELECT DISTINCT(cia1.estado)
							FROM cmx_importacion_actividades cia1
							WHERE cia1.id_importacion = cip.id
								AND cia1.tipo_actividad = "seguimiento" 
								AND cia1.fecha_hora_inicio IS NOT NULL
						) ESTADO_ACTIVIDAD_OPERACIONES,
						-- SEGUIMEINTO CLIENTES
						(	SELECT DISTINCT(cia1.id)
							FROM cmx_importacion_actividades cia1
							WHERE cia1.id_importacion = cip.id
								AND cia1.tipo_actividad = "seguimiento_cliente" 
								AND cia1.fecha_hora_inicio IS NOT NULL
						) ID_ACTIVIDAD_CLIENTE,
						(	SELECT DISTINCT(cia1.nombre)
							FROM cmx_importacion_actividades cia1
							WHERE cia1.id_importacion = cip.id
								AND cia1.tipo_actividad = "seguimiento_cliente" 
						) ACTIVIDAD_CLIENTE,
						IF (
							( 	SELECT COUNT(cis1.id)
								FROM cmx_importacion_seguimiento cis1
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento_cliente" 
									AND cia1.id_importacion = cip.id
									AND cis1.id_seguimiento IS NULL
							) > 0,
							(	SELECT MAX(cis1.fecha_hora)
								FROM cmx_importacion_seguimiento cis1
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento_cliente" 
									AND cia1.id_importacion = cip.id
									AND cis1.id_seguimiento IS NULL
							),
							(	SELECT cia1.fecha_hora_inicio
								FROM cmx_importacion_actividades cia1
								WHERE cia1.id_importacion = cip.id
									AND cia1.tipo_actividad = "seguimiento_cliente" 
									AND cia1.fecha_hora_inicio IS NOT NULL
							)
						) ULTIMO_SEGUIMIENTO_CLIENTE,
						IF (
							( 	SELECT COUNT(cis1.id)
								FROM cmx_importacion_seguimiento cis1
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento_cliente" 
									AND cia1.fecha_hora_inicio IS NOT NULL
									AND cia1.id_importacion = cip.id
									AND cis1.id_seguimiento IS NULL
							) > 0,
							(	SELECT DISTINCT(cis1.observacion)
								FROM cmx_importacion_seguimiento cis1
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento_cliente" 
									AND cia1.fecha_hora_inicio IS NOT NULL
									AND cia1.id_importacion = cip.id
									AND cis1.id_seguimiento IS NULL
									AND cis1.fecha_hora = (
										SELECT MAX(cis2.fecha_hora)
										FROM cmx_importacion_seguimiento cis2
										WHERE cis2.id_actividad = cia1.id
											AND cis2.id_seguimiento IS NULL
									)
							),
							NULL
						) MENSAJE_SEGUIMIENTO_CLIENTE,
						IF (
							( 	SELECT COUNT(cis1.id)
								FROM cmx_importacion_seguimiento cis1
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento_cliente" 
									AND cia1.fecha_hora_inicio IS NOT NULL
									AND cia1.id_importacion = cip.id
									AND cis1.id_seguimiento IS NULL
							) > 0,
							(	SELECT DISTINCT(cu1.nom_usuario)
								FROM cmx_usuarios cu1
									INNER JOIN cmx_importacion_seguimiento cis1 ON cis1.autor = cu1.id
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento_cliente" 
									AND cia1.id_importacion = cip.id
									AND cia1.fecha_hora_inicio IS NOT NULL
									AND cis1.id_seguimiento IS NULL
									AND cis1.fecha_hora = (
										SELECT MAX(cis2.fecha_hora)
										FROM cmx_importacion_seguimiento cis2
										WHERE cis2.id_actividad = cia1.id
											AND cis2.id_seguimiento IS NULL
									)
							),
							NULL
						) AUTOR_SEGUIMIENTO_CLIENTE,
						IF (
							( 	SELECT COUNT(cis1.id)
								FROM cmx_importacion_seguimiento cis1
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento_cliente" 
									AND cia1.fecha_hora_inicio IS NOT NULL
									AND cia1.id_importacion = cip.id
									AND cis1.id_seguimiento IS NULL
							) > 0,
							(	SELECT DISTINCT(cu1.url_avatar)
								FROM cmx_usuarios cu1
									INNER JOIN cmx_importacion_seguimiento cis1 ON cis1.autor = cu1.id
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento_cliente" 
									AND cia1.id_importacion = cip.id
									AND cia1.fecha_hora_inicio IS NOT NULL
									AND cis1.id_seguimiento IS NULL
									AND cis1.fecha_hora = (
										SELECT MAX(cis2.fecha_hora)
										FROM cmx_importacion_seguimiento cis2
										WHERE cis2.id_actividad = cia1.id
											AND cis2.id_seguimiento IS NULL
									)
							),
							NULL
						) URL_AUTOR_SEGUIMIENTO_CLIENTE,
						IF ( 
						 (
							DATEDIFF(
								CURDATE(),
								IF (
									( 	SELECT COUNT(cis1.id)
										FROM cmx_importacion_seguimiento cis1
											INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
										WHERE cia1.tipo_actividad = "seguimiento_cliente" 
											AND cia1.fecha_hora_inicio IS NOT NULL
											AND cia1.id_importacion = cip.id
											AND cis1.id_seguimiento IS NULL
									) > 0,
									(	SELECT MAX(cis1.fecha_hora)
										FROM cmx_importacion_seguimiento cis1
											INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
										WHERE cia1.tipo_actividad = "seguimiento_cliente" 
											AND cia1.id_importacion = cip.id
											AND cia1.fecha_hora_inicio IS NOT NULL
											AND cis1.id_seguimiento IS NULL
									),
									(	SELECT cia1.fecha_hora_inicio
										FROM cmx_importacion_actividades cia1
										WHERE cia1.id_importacion = cip.id
											AND cia1.tipo_actividad = "seguimiento_cliente" 
											AND cia1.fecha_hora_inicio IS NOT NULL
									)
								) 
							)
						 ) > 0,
						 (
							DATEDIFF(
								CURDATE(),
								IF (
									( 	SELECT COUNT(cis1.id)
										FROM cmx_importacion_seguimiento cis1
											INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
										WHERE cia1.tipo_actividad = "seguimiento_cliente" 
											AND cia1.fecha_hora_inicio IS NOT NULL
											AND cia1.id_importacion = cip.id
											AND cis1.id_seguimiento IS NULL
									) > 0,
									(	SELECT MAX(cis1.fecha_hora)
										FROM cmx_importacion_seguimiento cis1
											INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
										WHERE cia1.tipo_actividad = "seguimiento_cliente" 
											AND cia1.id_importacion = cip.id
											AND cia1.fecha_hora_inicio IS NOT NULL
											AND cis1.id_seguimiento IS NULL
									),
									(	SELECT cia1.fecha_hora_inicio
										FROM cmx_importacion_actividades cia1
										WHERE cia1.id_importacion = cip.id
											AND cia1.tipo_actividad = "seguimiento_cliente" 
											AND cia1.fecha_hora_inicio IS NOT NULL
									)
								) 
							)
						 )
						 ,
						 0
						) DIAS_CLIENTE,
						(	SELECT DISTINCT(cia1.estado)
							FROM cmx_importacion_actividades cia1
							WHERE cia1.id_importacion = cip.id
								AND cia1.tipo_actividad = "seguimiento_cliente" 
								AND cia1.fecha_hora_inicio IS NOT NULL
						) ESTADO_ACTIVIDAD_CLIENTE
					FROM 
						cmx_importacion_proyecto cip 
						INNER JOIN cmx_intr_solicitudes cis ON cis.id_proyecto = cip.id
						INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
					WHERE 
						cip.estado NOT IN (0,4)
					HAVING 
						(ESTADO_ACTIVIDAD_OPERACIONES = 2 OR ESTADO_ACTIVIDAD_CLIENTE = 2)
				';
		} elseif ($usuario["id_perfil"] == 23 || $usuario["id_perfil"] == 24) {
			$sql = '
					SELECT 
						cip.id ID_PROYECTO, cip.numero_importacion, cip.importacion, cip.tipo_operacion, cis.id ID_PROYECTO_INTERNACIONAL,
						cc.id ID_CLIENTE, cc.nombre, cc.cod_cliente,
						-- SEGUIMEINTO OPERACIONES
						(	SELECT DISTINCT(cia1.id)
							FROM cmx_importacion_actividades cia1
							WHERE cia1.id_importacion = cip.id
								AND cia1.tipo_actividad = "seguimiento" 
								AND cia1.fecha_hora_inicio IS NOT NULL
						) ID_ACTIVIDAD_OPERACIONES,
						(	SELECT DISTINCT(cia1.nombre)
							FROM cmx_importacion_actividades cia1
							WHERE cia1.id_importacion = cip.id
								AND cia1.tipo_actividad = "seguimiento" 
						) ACTIVIDAD_OPERACIONES,
						IF (
							( 	SELECT COUNT(cis1.id)
								FROM cmx_importacion_seguimiento cis1
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento" 
									AND cia1.id_importacion = cip.id
									AND cis1.id_seguimiento IS NULL
							) > 0,
							(	SELECT MAX(cis1.fecha_hora)
								FROM cmx_importacion_seguimiento cis1
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento" 
									AND cia1.id_importacion = cip.id
									AND cis1.id_seguimiento IS NULL
							),
							(	SELECT DISTINCT(cia1.fecha_hora_inicio)
								FROM cmx_importacion_actividades cia1
								WHERE cia1.id_importacion = cip.id
									AND cia1.tipo_actividad = "seguimiento" 
									AND cia1.fecha_hora_inicio IS NOT NULL
							)
						) ULTIMO_SEGUIMIENTO_OPERACIONES,
						IF (
							( 	SELECT COUNT(cis1.id)
								FROM cmx_importacion_seguimiento cis1
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento" 
									AND cia1.fecha_hora_inicio IS NOT NULL
									AND cia1.id_importacion = cip.id
									AND cis1.id_seguimiento IS NULL
							) > 0,
							(	SELECT DISTINCT(cis1.observacion)
								FROM cmx_importacion_seguimiento cis1
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento" 
									AND cia1.id_importacion = cip.id
									AND cia1.fecha_hora_inicio IS NOT NULL
									AND cis1.id_seguimiento IS NULL
									AND cis1.fecha_hora = (
										SELECT MAX(cis2.fecha_hora)
										FROM cmx_importacion_seguimiento cis2
										WHERE cis2.id_actividad = cia1.id
											AND cis2.id_seguimiento IS NULL
									)
							),
							NULL
						) MENSAJE_SEGUIMIENTO_OPERACIONES,
						IF (
							( 	SELECT COUNT(cis1.id)
								FROM cmx_importacion_seguimiento cis1
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento" 
									AND cia1.fecha_hora_inicio IS NOT NULL
									AND cia1.id_importacion = cip.id
									AND cis1.id_seguimiento IS NULL
							) > 0,
							(	SELECT DISTINCT(cu1.nom_usuario)
								FROM cmx_usuarios cu1
									INNER JOIN cmx_importacion_seguimiento cis1 ON cis1.autor = cu1.id
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento" 
									AND cia1.id_importacion = cip.id
									AND cia1.fecha_hora_inicio IS NOT NULL
									AND cis1.id_seguimiento IS NULL
									AND cis1.fecha_hora = (
										SELECT MAX(cis2.fecha_hora)
										FROM cmx_importacion_seguimiento cis2
										WHERE cis2.id_actividad = cia1.id
											AND cis2.id_seguimiento IS NULL
									)
							),
							NULL
						) AUTOR_SEGUIMIENTO_OPERACIONES,
						IF (
							( 	SELECT COUNT(cis1.id)
								FROM cmx_importacion_seguimiento cis1
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento" 
									AND cia1.fecha_hora_inicio IS NOT NULL
									AND cia1.id_importacion = cip.id
									AND cis1.id_seguimiento IS NULL
							) > 0,
							(	SELECT DISTINCT(cu1.url_avatar)
								FROM cmx_usuarios cu1
									INNER JOIN cmx_importacion_seguimiento cis1 ON cis1.autor = cu1.id
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento" 
									AND cia1.id_importacion = cip.id
									AND cia1.fecha_hora_inicio IS NOT NULL
									AND cis1.id_seguimiento IS NULL
									AND cis1.fecha_hora = (
										SELECT MAX(cis2.fecha_hora)
										FROM cmx_importacion_seguimiento cis2
										WHERE cis2.id_actividad = cia1.id
											AND cis2.id_seguimiento IS NULL
									)
							),
							NULL
						) URL_AUTOR_SEGUIMIENTO_OPERACIONES,
						IF(
							(
								DATEDIFF(
									CURDATE(),
									IF (
										( 	SELECT COUNT(cis1.id)
											FROM cmx_importacion_seguimiento cis1
												INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
											WHERE cia1.tipo_actividad = "seguimiento" 
												AND cia1.fecha_hora_inicio IS NOT NULL
												AND cia1.id_importacion = cip.id
												AND cis1.id_seguimiento IS NULL
										) > 0,
										(	SELECT MAX(cis1.fecha_hora)
											FROM cmx_importacion_seguimiento cis1
												INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
											WHERE cia1.tipo_actividad = "seguimiento" 
												AND cia1.fecha_hora_inicio IS NOT NULL
												AND cia1.id_importacion = cip.id
												AND cis1.id_seguimiento IS NULL
										),
										(	SELECT cia1.fecha_hora_inicio
											FROM cmx_importacion_actividades cia1
											WHERE cia1.id_importacion = cip.id
												AND cia1.tipo_actividad = "seguimiento" 
												AND cia1.fecha_hora_inicio IS NOT NULL
										)
									) 
								) 
							) > 0,
							(
								DATEDIFF(
									CURDATE(),
									IF (
										( 	SELECT COUNT(cis1.id)
											FROM cmx_importacion_seguimiento cis1
												INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
											WHERE cia1.tipo_actividad = "seguimiento" 
												AND cia1.fecha_hora_inicio IS NOT NULL
												AND cia1.id_importacion = cip.id
												AND cis1.id_seguimiento IS NULL
										) > 0,
										(	SELECT MAX(cis1.fecha_hora)
											FROM cmx_importacion_seguimiento cis1
												INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
											WHERE cia1.tipo_actividad = "seguimiento" 
												AND cia1.fecha_hora_inicio IS NOT NULL
												AND cia1.id_importacion = cip.id
												AND cis1.id_seguimiento IS NULL
										),
										(	SELECT cia1.fecha_hora_inicio
											FROM cmx_importacion_actividades cia1
											WHERE cia1.id_importacion = cip.id
												AND cia1.tipo_actividad = "seguimiento" 
												AND cia1.fecha_hora_inicio IS NOT NULL
										)
									) 
								) 
							),
							0
						)DIAS_OPERACIONES,
						(	SELECT DISTINCT(cia1.estado)
							FROM cmx_importacion_actividades cia1
							WHERE cia1.id_importacion = cip.id
								AND cia1.tipo_actividad = "seguimiento" 
								AND cia1.fecha_hora_inicio IS NOT NULL
						) ESTADO_ACTIVIDAD_OPERACIONES,
						-- SEGUIMEINTO CLIENTES
						(	SELECT DISTINCT(cia1.id)
							FROM cmx_importacion_actividades cia1
							WHERE cia1.id_importacion = cip.id
								AND cia1.tipo_actividad = "seguimiento_cliente" 
								AND cia1.fecha_hora_inicio IS NOT NULL
						) ID_ACTIVIDAD_CLIENTE,
						(	SELECT DISTINCT(cia1.nombre)
							FROM cmx_importacion_actividades cia1
							WHERE cia1.id_importacion = cip.id
								AND cia1.tipo_actividad = "seguimiento_cliente" 
						) ACTIVIDAD_CLIENTE,
						IF (
							( 	SELECT COUNT(cis1.id)
								FROM cmx_importacion_seguimiento cis1
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento_cliente" 
									AND cia1.id_importacion = cip.id
									AND cis1.id_seguimiento IS NULL
							) > 0,
							(	SELECT MAX(cis1.fecha_hora)
								FROM cmx_importacion_seguimiento cis1
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento_cliente" 
									AND cia1.id_importacion = cip.id
									AND cis1.id_seguimiento IS NULL
							),
							(	SELECT cia1.fecha_hora_inicio
								FROM cmx_importacion_actividades cia1
								WHERE cia1.id_importacion = cip.id
									AND cia1.tipo_actividad = "seguimiento_cliente" 
									AND cia1.fecha_hora_inicio IS NOT NULL
							)
						) ULTIMO_SEGUIMIENTO_CLIENTE,
						IF (
							( 	SELECT COUNT(cis1.id)
								FROM cmx_importacion_seguimiento cis1
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento_cliente" 
									AND cia1.fecha_hora_inicio IS NOT NULL
									AND cia1.id_importacion = cip.id
									AND cis1.id_seguimiento IS NULL
							) > 0,
							(	SELECT DISTINCT(cis1.observacion)
								FROM cmx_importacion_seguimiento cis1
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento_cliente" 
									AND cia1.fecha_hora_inicio IS NOT NULL
									AND cia1.id_importacion = cip.id
									AND cis1.id_seguimiento IS NULL
									AND cis1.fecha_hora = (
										SELECT MAX(cis2.fecha_hora)
										FROM cmx_importacion_seguimiento cis2
										WHERE cis2.id_actividad = cia1.id
											AND cis2.id_seguimiento IS NULL
									)
							),
							NULL
						) MENSAJE_SEGUIMIENTO_CLIENTE,
						IF (
							( 	SELECT COUNT(cis1.id)
								FROM cmx_importacion_seguimiento cis1
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento_cliente" 
									AND cia1.fecha_hora_inicio IS NOT NULL
									AND cia1.id_importacion = cip.id
									AND cis1.id_seguimiento IS NULL
							) > 0,
							(	SELECT DISTINCT(cu1.nom_usuario)
								FROM cmx_usuarios cu1
									INNER JOIN cmx_importacion_seguimiento cis1 ON cis1.autor = cu1.id
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento_cliente" 
									AND cia1.id_importacion = cip.id
									AND cia1.fecha_hora_inicio IS NOT NULL
									AND cis1.id_seguimiento IS NULL
									AND cis1.fecha_hora = (
										SELECT MAX(cis2.fecha_hora)
										FROM cmx_importacion_seguimiento cis2
										WHERE cis2.id_actividad = cia1.id
											AND cis2.id_seguimiento IS NULL
									)
							),
							NULL
						) AUTOR_SEGUIMIENTO_CLIENTE,
						IF (
							( 	SELECT COUNT(cis1.id)
								FROM cmx_importacion_seguimiento cis1
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento_cliente" 
									AND cia1.fecha_hora_inicio IS NOT NULL
									AND cia1.id_importacion = cip.id
									AND cis1.id_seguimiento IS NULL
							) > 0,
							(	SELECT DISTINCT(cu1.url_avatar)
								FROM cmx_usuarios cu1
									INNER JOIN cmx_importacion_seguimiento cis1 ON cis1.autor = cu1.id
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento_cliente" 
									AND cia1.id_importacion = cip.id
									AND cia1.fecha_hora_inicio IS NOT NULL
									AND cis1.id_seguimiento IS NULL
									AND cis1.fecha_hora = (
										SELECT MAX(cis2.fecha_hora)
										FROM cmx_importacion_seguimiento cis2
										WHERE cis2.id_actividad = cia1.id
											AND cis2.id_seguimiento IS NULL
									)
							),
							NULL
						) URL_AUTOR_SEGUIMIENTO_CLIENTE,
						IF ( 
							(
								DATEDIFF(
									CURDATE(),
									IF (
										( 	SELECT COUNT(cis1.id)
											FROM cmx_importacion_seguimiento cis1
												INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
											WHERE cia1.tipo_actividad = "seguimiento_cliente" 
												AND cia1.fecha_hora_inicio IS NOT NULL
												AND cia1.id_importacion = cip.id
												AND cis1.id_seguimiento IS NULL
										) > 0,
										(	SELECT MAX(cis1.fecha_hora)
											FROM cmx_importacion_seguimiento cis1
												INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
											WHERE cia1.tipo_actividad = "seguimiento_cliente" 
												AND cia1.id_importacion = cip.id
												AND cia1.fecha_hora_inicio IS NOT NULL
												AND cis1.id_seguimiento IS NULL
										),
										(	SELECT cia1.fecha_hora_inicio
											FROM cmx_importacion_actividades cia1
											WHERE cia1.id_importacion = cip.id
												AND cia1.tipo_actividad = "seguimiento_cliente" 
												AND cia1.fecha_hora_inicio IS NOT NULL
										)
									) 
								)
							) > 0,
							(
								DATEDIFF(
									CURDATE(),
									IF (
										( 	SELECT COUNT(cis1.id)
											FROM cmx_importacion_seguimiento cis1
												INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
											WHERE cia1.tipo_actividad = "seguimiento_cliente" 
												AND cia1.fecha_hora_inicio IS NOT NULL
												AND cia1.id_importacion = cip.id
												AND cis1.id_seguimiento IS NULL
										) > 0,
										(	SELECT MAX(cis1.fecha_hora)
											FROM cmx_importacion_seguimiento cis1
												INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
											WHERE cia1.tipo_actividad = "seguimiento_cliente" 
												AND cia1.id_importacion = cip.id
												AND cia1.fecha_hora_inicio IS NOT NULL
												AND cis1.id_seguimiento IS NULL
										),
										(	SELECT cia1.fecha_hora_inicio
											FROM cmx_importacion_actividades cia1
											WHERE cia1.id_importacion = cip.id
												AND cia1.tipo_actividad = "seguimiento_cliente" 
												AND cia1.fecha_hora_inicio IS NOT NULL
										)
									) 
								)
							),
							0
						) DIAS_CLIENTE,
						(	SELECT DISTINCT(cia1.estado)
							FROM cmx_importacion_actividades cia1
							WHERE cia1.id_importacion = cip.id
								AND cia1.tipo_actividad = "seguimiento_cliente" 
								AND cia1.fecha_hora_inicio IS NOT NULL
						) ESTADO_ACTIVIDAD_CLIENTE
					FROM 
						cmx_importacion_proyecto cip 
						INNER JOIN cmx_intr_solicitudes cis ON cis.id_proyecto = cip.id
						INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
					WHERE 
						cip.estado NOT IN (0,4)
						HAVING 
						(ESTADO_ACTIVIDAD_OPERACIONES = 2 OR ESTADO_ACTIVIDAD_CLIENTE = 2)
					/*HAVING 
						(ESTADO_ACTIVIDAD_OPERACIONES = 2)
						AND (
							SELECT
								COUNT(cia1.perfil_responsable)
							FROM cmx_importacion_actividades cia1
								INNER JOIN cmx_usuario_cliente cus1 ON cus1.id_perfil = cia1.perfil_responsable
								LEFT JOIN cmx_clientes_serv_responsables ccdr1 ON ccdr1.id_usuario = cus1.id_usuario
								INNER JOIN cmx_clientes_serv_contratados ccsc1 ON ccsc1.id = ccdr1.id_serv_contratado
							WHERE cia1.id_importacion = cip.id
								AND ccsc1.id_cliente = cip.id_cliente
								AND ccsc1.servicio = "Transporte de Carga Internacional"
								AND ccdr1.estado = 1
								AND ccsc1.estado = 1
								AND cus1.id_perfil = ' . $usuario["id_perfil"] . '
								AND ccdr1.id_usuario = ' . $usuario["id_usuario"] . '
						) > 0*/
				';
		} else {
			$sql = '
					SELECT 
						cip.id ID_PROYECTO, cip.numero_importacion, cip.importacion, cip.tipo_operacion, cis.id ID_PROYECTO_INTERNACIONAL,
						cc.id ID_CLIENTE, cc.nombre, cc.cod_cliente,
						-- SEGUIMEINTO OPERACIONES
						(	SELECT DISTINCT(cia1.id)
							FROM cmx_importacion_actividades cia1
							WHERE cia1.id_importacion = cip.id
								AND cia1.tipo_actividad = "seguimiento" 
								AND cia1.fecha_hora_inicio IS NOT NULL
						) ID_ACTIVIDAD_OPERACIONES,
						(	SELECT DISTINCT(cia1.nombre)
							FROM cmx_importacion_actividades cia1
							WHERE cia1.id_importacion = cip.id
								AND cia1.tipo_actividad = "seguimiento" 
						) ACTIVIDAD_OPERACIONES,
						IF (
							( 	SELECT COUNT(cis1.id)
								FROM cmx_importacion_seguimiento cis1
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento" 
									AND cia1.id_importacion = cip.id
									AND cis1.id_seguimiento IS NULL
							) > 0,
							(	SELECT MAX(cis1.fecha_hora)
								FROM cmx_importacion_seguimiento cis1
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento" 
									AND cia1.id_importacion = cip.id
									AND cis1.id_seguimiento IS NULL
							),
							(	SELECT DISTINCT(cia1.fecha_hora_inicio)
								FROM cmx_importacion_actividades cia1
								WHERE cia1.id_importacion = cip.id
									AND cia1.tipo_actividad = "seguimiento" 
									AND cia1.fecha_hora_inicio IS NOT NULL
							)
						) ULTIMO_SEGUIMIENTO_OPERACIONES,
						IF (
							( 	SELECT COUNT(cis1.id)
								FROM cmx_importacion_seguimiento cis1
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento" 
									AND cia1.fecha_hora_inicio IS NOT NULL
									AND cia1.id_importacion = cip.id
									AND cis1.id_seguimiento IS NULL
							) > 0,
							(	SELECT DISTINCT(cis1.observacion)
								FROM cmx_importacion_seguimiento cis1
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento" 
									AND cia1.id_importacion = cip.id
									AND cia1.fecha_hora_inicio IS NOT NULL
									AND cis1.id_seguimiento IS NULL
									AND cis1.fecha_hora = (
										SELECT MAX(cis2.fecha_hora)
										FROM cmx_importacion_seguimiento cis2
										WHERE cis2.id_actividad = cia1.id
											AND cis2.id_seguimiento IS NULL
									)
							),
							NULL
						) MENSAJE_SEGUIMIENTO_OPERACIONES,
						IF (
							( 	SELECT COUNT(cis1.id)
								FROM cmx_importacion_seguimiento cis1
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento" 
									AND cia1.fecha_hora_inicio IS NOT NULL
									AND cia1.id_importacion = cip.id
									AND cis1.id_seguimiento IS NULL
							) > 0,
							(	SELECT DISTINCT(cu1.nom_usuario)
								FROM cmx_usuarios cu1
									INNER JOIN cmx_importacion_seguimiento cis1 ON cis1.autor = cu1.id
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento" 
									AND cia1.id_importacion = cip.id
									AND cia1.fecha_hora_inicio IS NOT NULL
									AND cis1.id_seguimiento IS NULL
									AND cis1.fecha_hora = (
										SELECT MAX(cis2.fecha_hora)
										FROM cmx_importacion_seguimiento cis2
										WHERE cis2.id_actividad = cia1.id
											AND cis2.id_seguimiento IS NULL
									)
							),
							NULL
						) AUTOR_SEGUIMIENTO_OPERACIONES,
						IF (
							( 	SELECT COUNT(cis1.id)
								FROM cmx_importacion_seguimiento cis1
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento" 
									AND cia1.fecha_hora_inicio IS NOT NULL
									AND cia1.id_importacion = cip.id
									AND cis1.id_seguimiento IS NULL
							) > 0,
							(	SELECT DISTINCT(cu1.url_avatar)
								FROM cmx_usuarios cu1
									INNER JOIN cmx_importacion_seguimiento cis1 ON cis1.autor = cu1.id
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento" 
									AND cia1.id_importacion = cip.id
									AND cia1.fecha_hora_inicio IS NOT NULL
									AND cis1.id_seguimiento IS NULL
									AND cis1.fecha_hora = (
										SELECT MAX(cis2.fecha_hora)
										FROM cmx_importacion_seguimiento cis2
										WHERE cis2.id_actividad = cia1.id
											AND cis2.id_seguimiento IS NULL
									)
							),
							NULL
						) URL_AUTOR_SEGUIMIENTO_OPERACIONES,
						DATEDIFF(
							CURDATE(),
							IF (
								( 	SELECT COUNT(cis1.id)
									FROM cmx_importacion_seguimiento cis1
										INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
									WHERE cia1.tipo_actividad = "seguimiento" 
										AND cia1.fecha_hora_inicio IS NOT NULL
										AND cia1.id_importacion = cip.id
										AND cis1.id_seguimiento IS NULL
								) > 0,
								(	SELECT MAX(cis1.fecha_hora)
									FROM cmx_importacion_seguimiento cis1
										INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
									WHERE cia1.tipo_actividad = "seguimiento" 
										AND cia1.fecha_hora_inicio IS NOT NULL
										AND cia1.id_importacion = cip.id
										AND cis1.id_seguimiento IS NULL
								),
								(	SELECT cia1.fecha_hora_inicio
									FROM cmx_importacion_actividades cia1
									WHERE cia1.id_importacion = cip.id
										AND cia1.tipo_actividad = "seguimiento" 
										AND cia1.fecha_hora_inicio IS NOT NULL
								)
							) 
						) DIAS_OPERACIONES,
						(	SELECT DISTINCT(cia1.estado)
							FROM cmx_importacion_actividades cia1
							WHERE cia1.id_importacion = cip.id
								AND cia1.tipo_actividad = "seguimiento" 
								AND cia1.fecha_hora_inicio IS NOT NULL
						) ESTADO_ACTIVIDAD_OPERACIONES,
						-- SEGUIMEINTO CLIENTES
						(	SELECT DISTINCT(cia1.id)
							FROM cmx_importacion_actividades cia1
							WHERE cia1.id_importacion = cip.id
								AND cia1.tipo_actividad = "seguimiento_cliente" 
								AND cia1.fecha_hora_inicio IS NOT NULL
						) ID_ACTIVIDAD_CLIENTE,
						(	SELECT DISTINCT(cia1.nombre)
							FROM cmx_importacion_actividades cia1
							WHERE cia1.id_importacion = cip.id
								AND cia1.tipo_actividad = "seguimiento_cliente" 
						) ACTIVIDAD_CLIENTE,
						IF (
							( 	SELECT COUNT(cis1.id)
								FROM cmx_importacion_seguimiento cis1
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento_cliente" 
									AND cia1.id_importacion = cip.id
									AND cis1.id_seguimiento IS NULL
							) > 0,
							(	SELECT MAX(cis1.fecha_hora)
								FROM cmx_importacion_seguimiento cis1
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento_cliente" 
									AND cia1.id_importacion = cip.id
									AND cis1.id_seguimiento IS NULL
							),
							(	SELECT cia1.fecha_hora_inicio
								FROM cmx_importacion_actividades cia1
								WHERE cia1.id_importacion = cip.id
									AND cia1.tipo_actividad = "seguimiento_cliente" 
									AND cia1.fecha_hora_inicio IS NOT NULL
							)
						) ULTIMO_SEGUIMIENTO_CLIENTE,
						IF (
							( 	SELECT COUNT(cis1.id)
								FROM cmx_importacion_seguimiento cis1
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento_cliente" 
									AND cia1.fecha_hora_inicio IS NOT NULL
									AND cia1.id_importacion = cip.id
									AND cis1.id_seguimiento IS NULL
							) > 0,
							(	SELECT DISTINCT(cis1.observacion)
								FROM cmx_importacion_seguimiento cis1
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento_cliente" 
									AND cia1.fecha_hora_inicio IS NOT NULL
									AND cia1.id_importacion = cip.id
									AND cis1.id_seguimiento IS NULL
									AND cis1.fecha_hora = (
										SELECT MAX(cis2.fecha_hora)
										FROM cmx_importacion_seguimiento cis2
										WHERE cis2.id_actividad = cia1.id
											AND cis2.id_seguimiento IS NULL
									)
							),
							NULL
						) MENSAJE_SEGUIMIENTO_CLIENTE,
						IF (
							( 	SELECT COUNT(cis1.id)
								FROM cmx_importacion_seguimiento cis1
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento_cliente" 
									AND cia1.fecha_hora_inicio IS NOT NULL
									AND cia1.id_importacion = cip.id
									AND cis1.id_seguimiento IS NULL
							) > 0,
							(	SELECT DISTINCT(cu1.nom_usuario)
								FROM cmx_usuarios cu1
									INNER JOIN cmx_importacion_seguimiento cis1 ON cis1.autor = cu1.id
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento_cliente" 
									AND cia1.id_importacion = cip.id
									AND cia1.fecha_hora_inicio IS NOT NULL
									AND cis1.id_seguimiento IS NULL
									AND cis1.fecha_hora = (
										SELECT MAX(cis2.fecha_hora)
										FROM cmx_importacion_seguimiento cis2
										WHERE cis2.id_actividad = cia1.id
											AND cis2.id_seguimiento IS NULL
									)
							),
							NULL
						) AUTOR_SEGUIMIENTO_CLIENTE,
						IF (
							( 	SELECT COUNT(cis1.id)
								FROM cmx_importacion_seguimiento cis1
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento_cliente" 
									AND cia1.fecha_hora_inicio IS NOT NULL
									AND cia1.id_importacion = cip.id
									AND cis1.id_seguimiento IS NULL
							) > 0,
							(	SELECT DISTINCT(cu1.url_avatar)
								FROM cmx_usuarios cu1
									INNER JOIN cmx_importacion_seguimiento cis1 ON cis1.autor = cu1.id
									INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
								WHERE cia1.tipo_actividad = "seguimiento_cliente" 
									AND cia1.id_importacion = cip.id
									AND cia1.fecha_hora_inicio IS NOT NULL
									AND cis1.id_seguimiento IS NULL
									AND cis1.fecha_hora = (
										SELECT MAX(cis2.fecha_hora)
										FROM cmx_importacion_seguimiento cis2
										WHERE cis2.id_actividad = cia1.id
											AND cis2.id_seguimiento IS NULL
									)
							),
							NULL
						) URL_AUTOR_SEGUIMIENTO_CLIENTE,
						DATEDIFF(
							CURDATE(),
							IF (
								( 	SELECT COUNT(cis1.id)
									FROM cmx_importacion_seguimiento cis1
										INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
									WHERE cia1.tipo_actividad = "seguimiento_cliente" 
										AND cia1.fecha_hora_inicio IS NOT NULL
										AND cia1.id_importacion = cip.id
										AND cis1.id_seguimiento IS NULL
								) > 0,
								(	SELECT MAX(cis1.fecha_hora)
									FROM cmx_importacion_seguimiento cis1
										INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
									WHERE cia1.tipo_actividad = "seguimiento_cliente" 
										AND cia1.id_importacion = cip.id
										AND cia1.fecha_hora_inicio IS NOT NULL
										AND cis1.id_seguimiento IS NULL
								),
								(	SELECT cia1.fecha_hora_inicio
									FROM cmx_importacion_actividades cia1
									WHERE cia1.id_importacion = cip.id
										AND cia1.tipo_actividad = "seguimiento_cliente" 
										AND cia1.fecha_hora_inicio IS NOT NULL
								)
							) 
						) DIAS_CLIENTE,
						(	SELECT DISTINCT(cia1.estado)
							FROM cmx_importacion_actividades cia1
							WHERE cia1.id_importacion = cip.id
								AND cia1.tipo_actividad = "seguimiento_cliente" 
								AND cia1.fecha_hora_inicio IS NOT NULL
						) ESTADO_ACTIVIDAD_CLIENTE
					FROM 
						cmx_importacion_proyecto cip 
						INNER JOIN cmx_intr_solicitudes cis ON cis.id_proyecto = cip.id
						INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
					WHERE 
						cip.estado NOT IN (0,4)
					HAVING 
						(ESTADO_ACTIVIDAD_OPERACIONES = 2 OR ESTADO_ACTIVIDAD_CLIENTE = 2)
						AND (
							SELECT
								COUNT(cia1.perfil_responsable)
							FROM cmx_importacion_actividades cia1
								INNER JOIN cmx_usuario_cliente cus1 ON cus1.id_perfil = cia1.perfil_responsable
								INNER JOIN cmx_clientes_serv_responsables ccdr1 ON ccdr1.id_usuario = cus1.id_usuario
								INNER JOIN cmx_clientes_serv_contratados ccsc1 ON ccsc1.id = ccdr1.id_serv_contratado
							WHERE cia1.id_importacion = cip.id
								AND ccsc1.id_cliente = cip.id_cliente
								AND ccsc1.servicio = "Transporte de Carga Internacional"
								AND ccdr1.estado = 1
								AND ccsc1.estado = 1
								AND cus1.id_perfil = ' . $usuario["id_perfil"] . '
								AND ccdr1.id_usuario = ' . $usuario["id_usuario"] . '
						) > 0
				';
		}
		// $request["general"] = $this->_db->getConsulta($sql);
		$requestsql = $this->_db3->prepare($sql);
		$requestsql->execute();
		// Número de filas encontradas
		$rowCount = $requestsql->rowCount();
		$request["general"] = $requestsql->fetchAll(PDO::FETCH_ASSOC);
		// Puedes incluir el rowCount si quieres usarlo después
		$request["total_rows"] = $rowCount;
		// print_r("<pre>");
		// print_r($request["general"]);
		// print_r("</pre>");


		if ($request["general"]) {
			$origen = [];
			$destino = [];
			foreach ($request["general"] as $key => $value) {
				// Se busca los origenes
				// print_r($value[0]);
				$sql = '
						SELECT 
							cit.id, cit.tipo_tramo, crd.sigla,
							CONCAT(cm.municipio," (",cm.depto," - ",cm.pais,")") MUNICIPIO
						FROM 
							cmx_intr_solicitudes cis
							INNER JOIN cmx_intr_tramos cit ON cit.id_intr_proyecto = cis.id
							INNER JOIN cmx_remitente_destinatario crd ON crd.id = cit.id_remitente_destinatario
							INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
						WHERE 
							cis.id_proyecto = ' . $value['ID_PROYECTO'] . '
							AND cit.tipo_tramo = "Cargue"
					';
				// $result = $this->_db->getConsulta($sql);
				$result_sql = $this->_db3->prepare($sql);
				$result_sql->execute();
				$result = $result_sql->fetchAll(PDO::FETCH_ASSOC);

				if ($result) {
					foreach ($result as $key_01 => $value_01) {
						$origen[$value['ID_PROYECTO']][] = $value_01;
					}
				}

				// Se busca los destinos
				$sql = '
						SELECT 
							cit.id, cit.tipo_tramo, crd.sigla,
							CONCAT(cm.municipio," (",cm.depto," - ",cm.pais,")") MUNICIPIO
						FROM 
							cmx_intr_solicitudes cis
							INNER JOIN cmx_intr_tramos cit ON cit.id_intr_proyecto = cis.id
							INNER JOIN cmx_remitente_destinatario crd ON crd.id = cit.id_remitente_destinatario
							INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
						WHERE 
							cis.id_proyecto = ' . $value['ID_PROYECTO'] . '
							AND cit.tipo_tramo = "Descargue"
					';
				// $result = $this->_db->getConsulta($sql);
				$result = $this->_db3->prepare($sql);
				$result->execute();
				$result = $result->fetchAll(PDO::FETCH_ASSOC);
				if ($result) {
					foreach ($result as $key_01 => $value_01) {
						$destino[$value['ID_PROYECTO']][] = $value_01;
					}
				}

				if ($value["ID_PROYECTO_INTERNACIONAL"]) {
					$sql = '
							SELECT 
								IF((	SELECT COUNT(cioc1.id)
										FROM cmx_intr_oferta_comercial cioc1
										WHERE cioc1.id_intr_proyecto = cis.id
											AND cioc1.estado = 1),
									IF((	SELECT MIN(cia1.estado)
											FROM cmx_importacion_actividades cia1 
												INNER JOIN cmx_importacion_proyecto cip1 ON cip1.id = cia1.id_importacion
												INNER JOIN cmx_intr_solicitudes cis1 ON cis1.id_proyecto = cip1.id
											WHERE cis1.id = cis.id
												AND cia1.tipo_actividad = "intr_cotizacion") = 1,
										"OCA", "OCP"
									), "OCN"
								) OFERTA_COMERCIAL,
								IF((	SELECT COUNT(cic1.id)
										FROM cmx_intr_cotizaciones cic1
										WHERE cic1.id_intr_proyecto = cis.id
									),
									IF((	SELECT MIN(cia1.estado)
											FROM cmx_importacion_actividades cia1 
												INNER JOIN cmx_importacion_proyecto cip1 ON cip1.id = cia1.id_importacion
												INNER JOIN cmx_intr_solicitudes cis1 ON cis1.id_proyecto = cip1.id
											WHERE cis1.id = cis.id
												AND cia1.tipo_actividad = "intr_cotizacion") != 1,
										IF((	SELECT COUNT( DISTINCT(cic1.id_concepto) )
												FROM cmx_intr_cotizaciones cic1
												WHERE cic1.id_intr_proyecto = cis.id
													AND cic1.estado = 1),
											"CPA", "CP"
										), "CA"
									), "SC"
								) COTIZACION_PROVEEDORES,
								IF((	SELECT COUNT(cisd1.id)
										FROM cmx_intr_solicitud_documentos cisd1
										WHERE cisd1.estado = 1
											AND cisd1.id_intr_proyecto = cis.id
											AND cisd1.id_tipo_documento = 20),
									"PEE", "PEP"
								) PRUEBA_ENTREGA,
								IF(((	SELECT MIN(cia1.estado)
										FROM cmx_importacion_actividades cia1 
											INNER JOIN cmx_importacion_proyecto cip1 ON cip1.id = cia1.id_importacion
											INNER JOIN cmx_intr_solicitudes cis1 ON cis1.id_proyecto = cip1.id
										WHERE cis1.id = cis.id
											AND cia1.tipo_actividad = "intr_instruccion_factura") = 1) 
											AND cis.id_factura IS NOT NULL,
									"IFR", "IFP"
								) INSTRUCCION_FACTURA,
								IF(((	SELECT MIN(cia1.estado)
										FROM cmx_importacion_actividades cia1 
											INNER JOIN cmx_importacion_proyecto cip1 ON cip1.id = cia1.id_importacion
											INNER JOIN cmx_intr_solicitudes cis1 ON cis1.id_proyecto = cip1.id
										WHERE cis1.id = cis.id
											AND cia1.tipo_actividad = "intr_factura") = 1
											AND cis.id_factura IS NOT NULL ),
									"FR", "FP"
								) FACTURA
							FROM 
								cmx_intr_solicitudes cis
							WHERE cis.id = ' . $value["ID_PROYECTO_INTERNACIONAL"] . '
						';
					// $result = $this->_db->getConsulta($sql);
					$result = $this->_db3->prepare($sql);
					$result->execute();
					$result = $result->fetch(PDO::FETCH_ASSOC);
					$array[$value['ID_PROYECTO']] = $result;
				}
			}


			$request["info_internacional"] = $array;

			// print_r("<pre>");
			// print_r($array);
			// print_r("</pre>");
			$request["origen"] = $origen;
			$request["destino"] = $destino;
		}
		return $request;
	}
	/****** FIN CONSULTAS DE SEGUIMIENTOS INTERNACIONAL ******/


	/****** CONSULTAS DE SEGUIMIENTOS INTERNACIONAL ******/
	public function getIntrSeguimientosCliente($usuario)
	{
		$sql = '
				SELECT 
					cip.id ID_PROYECTO, cip.numero_importacion, cip.importacion, cis.do, cip.tipo_operacion,
					cc.id ID_CLIENTE, cc.nombre, cc.cod_cliente,
					-- SEGUIMEINTO CLIENTES
					(	SELECT DISTINCT(cia1.id)
						FROM cmx_importacion_actividades cia1
						WHERE cia1.id_importacion = cip.id
							AND cia1.tipo_actividad = "seguimiento_cliente" 
							AND cia1.fecha_hora_inicio IS NOT NULL
					) ID_ACTIVIDAD_CLIENTE,
					(	SELECT DISTINCT(cia1.nombre)
						FROM cmx_importacion_actividades cia1
						WHERE cia1.id_importacion = cip.id
							AND cia1.tipo_actividad = "seguimiento_cliente" 
					) ACTIVIDAD_CLIENTE,
					IF (
						( 	SELECT COUNT(cis1.id)
							FROM cmx_importacion_seguimiento cis1
								INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
							WHERE cia1.tipo_actividad = "seguimiento_cliente" 
								AND cia1.id_importacion = cip.id
								AND cis1.id_seguimiento IS NULL
						) > 0,
						(	SELECT MAX(cis1.fecha_hora)
							FROM cmx_importacion_seguimiento cis1
								INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
							WHERE cia1.tipo_actividad = "seguimiento_cliente" 
								AND cia1.id_importacion = cip.id
								AND cis1.id_seguimiento IS NULL
						),
						(	SELECT cia1.fecha_hora_inicio
							FROM cmx_importacion_actividades cia1
							WHERE cia1.id_importacion = cip.id
								AND cia1.tipo_actividad = "seguimiento_cliente" 
								AND cia1.fecha_hora_inicio IS NOT NULL
						)
					) ULTIMO_SEGUIMIENTO_CLIENTE,
					IF (
						( 	SELECT COUNT(cis1.id)
							FROM cmx_importacion_seguimiento cis1
								INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
							WHERE cia1.tipo_actividad = "seguimiento_cliente" 
								AND cia1.fecha_hora_inicio IS NOT NULL
								AND cia1.id_importacion = cip.id
								AND cis1.id_seguimiento IS NULL
						) > 0,
						(	SELECT cis1.observacion
							FROM cmx_importacion_seguimiento cis1
								INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
							WHERE cia1.tipo_actividad = "seguimiento_cliente" 
								AND cia1.fecha_hora_inicio IS NOT NULL
								AND cia1.id_importacion = cip.id
								AND cis1.id_seguimiento IS NULL
								AND cis1.fecha_hora = (
									SELECT MAX(cis2.fecha_hora)
									FROM cmx_importacion_seguimiento cis2
									WHERE cis2.id_actividad = cia1.id
										AND cis2.id_seguimiento IS NULL
								)
						),
						NULL
					) MENSAJE_SEGUIMIENTO_CLIENTE,
					IF (
						( 	SELECT COUNT(cis1.id)
							FROM cmx_importacion_seguimiento cis1
								INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
							WHERE cia1.tipo_actividad = "seguimiento_cliente" 
								AND cia1.fecha_hora_inicio IS NOT NULL
								AND cia1.id_importacion = cip.id
								AND cis1.id_seguimiento IS NULL
						) > 0,
						(	SELECT cis1.url
							FROM cmx_importacion_seguimiento cis1
								INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
							WHERE cia1.tipo_actividad = "seguimiento_cliente" 
								AND cia1.fecha_hora_inicio IS NOT NULL
								AND cia1.id_importacion = cip.id
								AND cis1.id_seguimiento IS NULL
								AND cis1.fecha_hora = (
									SELECT MAX(cis2.fecha_hora)
									FROM cmx_importacion_seguimiento cis2
									WHERE cis2.id_actividad = cia1.id
										AND cis2.id_seguimiento IS NULL
								)
						),
						NULL
					) ENTREGABLE_SEGUIMIENTO_CLIENTE,
					IF (
						( 	SELECT COUNT(cis1.id)
							FROM cmx_importacion_seguimiento cis1
								INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
							WHERE cia1.tipo_actividad = "seguimiento_cliente" 
								AND cia1.fecha_hora_inicio IS NOT NULL
								AND cia1.id_importacion = cip.id
								AND cis1.id_seguimiento IS NULL
						) > 0,
						(	SELECT cu1.nom_usuario
							FROM cmx_usuarios cu1
								INNER JOIN cmx_importacion_seguimiento cis1 ON cis1.autor = cu1.id
								INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
							WHERE cia1.tipo_actividad = "seguimiento_cliente" 
								AND cia1.id_importacion = cip.id
								AND cia1.fecha_hora_inicio IS NOT NULL
								AND cis1.id_seguimiento IS NULL
								AND cis1.fecha_hora = (
									SELECT MAX(cis2.fecha_hora)
									FROM cmx_importacion_seguimiento cis2
									WHERE cis2.id_actividad = cia1.id
										AND cis2.id_seguimiento IS NULL
								)
						),
						NULL
					) AUTOR_SEGUIMIENTO_CLIENTE,
					IF (
						( 	SELECT COUNT(cis1.id)
							FROM cmx_importacion_seguimiento cis1
								INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
							WHERE cia1.tipo_actividad = "seguimiento_cliente" 
								AND cia1.fecha_hora_inicio IS NOT NULL
								AND cia1.id_importacion = cip.id
								AND cis1.id_seguimiento IS NULL
						) > 0,
						(	SELECT cu1.url_avatar
							FROM cmx_usuarios cu1
								INNER JOIN cmx_importacion_seguimiento cis1 ON cis1.autor = cu1.id
								INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
							WHERE cia1.tipo_actividad = "seguimiento_cliente" 
								AND cia1.id_importacion = cip.id
								AND cia1.fecha_hora_inicio IS NOT NULL
								AND cis1.id_seguimiento IS NULL
								AND cis1.fecha_hora = (
									SELECT MAX(cis2.fecha_hora)
									FROM cmx_importacion_seguimiento cis2
									WHERE cis2.id_actividad = cia1.id
										AND cis2.id_seguimiento IS NULL
								)
						),
						NULL
					) URL_AUTOR_SEGUIMIENTO_CLIENTE,
					IF ( 
					 (
						DATEDIFF(
							CURDATE(),
							IF (
								( 	SELECT COUNT(cis1.id)
									FROM cmx_importacion_seguimiento cis1
										INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
									WHERE cia1.tipo_actividad = "seguimiento_cliente" 
										AND cia1.fecha_hora_inicio IS NOT NULL
										AND cia1.id_importacion = cip.id
										AND cis1.id_seguimiento IS NULL
								) > 0,
								(	SELECT MAX(cis1.fecha_hora)
									FROM cmx_importacion_seguimiento cis1
										INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
									WHERE cia1.tipo_actividad = "seguimiento_cliente" 
										AND cia1.id_importacion = cip.id
										AND cia1.fecha_hora_inicio IS NOT NULL
										AND cis1.id_seguimiento IS NULL
								),
								(	SELECT cia1.fecha_hora_inicio
									FROM cmx_importacion_actividades cia1
									WHERE cia1.id_importacion = cip.id
										AND cia1.tipo_actividad = "seguimiento_cliente" 
										AND cia1.fecha_hora_inicio IS NOT NULL
								)
							) 
						)
					 ) > 0,
					 (
						DATEDIFF(
							CURDATE(),
							IF (
								( 	SELECT COUNT(cis1.id)
									FROM cmx_importacion_seguimiento cis1
										INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
									WHERE cia1.tipo_actividad = "seguimiento_cliente" 
										AND cia1.fecha_hora_inicio IS NOT NULL
										AND cia1.id_importacion = cip.id
										AND cis1.id_seguimiento IS NULL
								) > 0,
								(	SELECT MAX(cis1.fecha_hora)
									FROM cmx_importacion_seguimiento cis1
										INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cis1.id_actividad
									WHERE cia1.tipo_actividad = "seguimiento_cliente" 
										AND cia1.id_importacion = cip.id
										AND cia1.fecha_hora_inicio IS NOT NULL
										AND cis1.id_seguimiento IS NULL
								),
								(	SELECT cia1.fecha_hora_inicio
									FROM cmx_importacion_actividades cia1
									WHERE cia1.id_importacion = cip.id
										AND cia1.tipo_actividad = "seguimiento_cliente" 
										AND cia1.fecha_hora_inicio IS NOT NULL
								)
							) 
						)
					 )
					 ,
					 0
					) DIAS_CLIENTE,
					(	SELECT DISTINCT(cia1.estado)
						FROM cmx_importacion_actividades cia1
						WHERE cia1.id_importacion = cip.id
							AND cia1.tipo_actividad = "seguimiento_cliente" 
							AND cia1.fecha_hora_inicio IS NOT NULL
					) ESTADO_ACTIVIDAD_CLIENTE
				FROM 
					cmx_importacion_proyecto cip 
					INNER JOIN cmx_intr_solicitudes cis ON cis.id_proyecto = cip.id
					INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
				WHERE 
					cip.estado = 1
					AND cip.id_cliente = ' . $usuario["id_cliente"] . '
				HAVING 
					ESTADO_ACTIVIDAD_CLIENTE IS NOT NULL
			';
		// echo "<pre>" . $sql . "<pre>";
		$request["general"] = $this->_db->getConsulta($sql);

		if ($request["general"]) {
			$origen = array();
			$destino = array();
			foreach ($request["general"]["rowsData"] as $key => $value) {
				// Se busca los origenes
				$sql = '
						SELECT 
							cit.id, cit.tipo_tramo, crd.sigla,
							CONCAT(cm.municipio," (",cm.depto," - ",cm.pais,")") MUNICIPIO
						FROM 
							cmx_intr_solicitudes cis
							INNER JOIN cmx_intr_tramos cit ON cit.id_intr_proyecto = cis.id
							INNER JOIN cmx_remitente_destinatario crd ON crd.id = cit.id_remitente_destinatario
							INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
						WHERE 
							cis.id_proyecto = ' . $value[0] . '
							AND cit.tipo_tramo = "Cargue"
					';
				$result = $this->_db->getConsulta($sql);
				if ($result) {
					foreach ($result["rowsData"] as $key_01 => $value_01) {
						$origen[$value[0]][] = $value_01;
					}
				}

				// Se busca los destinos
				$sql = '
						SELECT 
							cit.id, cit.tipo_tramo, crd.sigla,
							CONCAT(cm.municipio," (",cm.depto," - ",cm.pais,")") MUNICIPIO
						FROM 
							cmx_intr_solicitudes cis
							INNER JOIN cmx_intr_tramos cit ON cit.id_intr_proyecto = cis.id
							INNER JOIN cmx_remitente_destinatario crd ON crd.id = cit.id_remitente_destinatario
							INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
						WHERE 
							cis.id_proyecto = ' . $value[0] . '
							AND cit.tipo_tramo = "Descargue"
					';
				$result = $this->_db->getConsulta($sql);
				if ($result) {
					foreach ($result["rowsData"] as $key_01 => $value_01) {
						$destino[$value[0]][] = $value_01;
					}
				}
			}

			$request["origen"] = $origen;
			$request["destino"] = $destino;
		}
		return $request;
	}

	/****** FIN CONSULTAS DE SEGUIMIENTOS INTERNACIONAL ******/
	public function getInitials($nombres)
	{
		if (!$nombres) {
			return '';
		}
		$words = explode(' ', $nombres);
		$initials = '';
		foreach ($words as $word) {
			$initials .= strtoupper($word[0]);
		}
		return $initials;
	}


	/**
	 * Obtiene el primer Ejecutivo Comercial y el primer Ejecutivo de Servicio al Cliente 
	 * para un cliente específico que tienen estado activo, usando subconsulta correlacionada.
	 *
	 * @param int $cliente El ID del cliente a consultar.
	 * @return array Retorna un array con los responsables encontrados (máx. 2) o un array vacío.
	 */
	public function getComercialSac(int $cliente): array
	{
		// Usamos una subconsulta correlacionada en el WHERE para encontrar el registro
		// cuyo ID es el mínimo para su respectivo tipo_ejecutivo.
		$sql = "SELECT
                t1.id AS id_responsable,
                t1.tipo_ejecutivo,
                u.nom_usuario
            FROM
                cmx_clientes_serv_responsables t1
                INNER JOIN cmx_usuarios u ON t1.id_usuario = u.id
                INNER JOIN cmx_clientes_serv_contratados sc ON sc.id = t1.id_serv_contratado
            WHERE
                sc.id_cliente = :cliente
                AND t1.estado = 1
                AND t1.tipo_ejecutivo IN ('Ejecutivo Comercial', 'Ejecutivo Servicio al Cliente')
                
                -- 🛑 LÓGICA CLAVE: Solo selecciona t1 si su ID es el ID MÍNIMO para ese TIPO DE EJECUTIVO
                AND t1.id = (
                    SELECT MIN(csr_min.id)
                    FROM cmx_clientes_serv_responsables csr_min
                    INNER JOIN cmx_clientes_serv_contratados sc_min ON sc_min.id = csr_min.id_serv_contratado
                    WHERE sc_min.id_cliente = sc.id_cliente  -- Correlaciona por cliente
                    AND csr_min.tipo_ejecutivo = t1.tipo_ejecutivo -- Correlaciona por tipo de ejecutivo
                    AND csr_min.estado = 1
                )
                
            -- Opcional: ORDER BY para asegurar que el orden de los tipos sea consistente (Comercial, SAC)
            ORDER BY t1.tipo_ejecutivo";

		try {
			$stmt = $this->_db3->prepare($sql);

			// Vinculación del parámetro
			$stmt->bindParam(':cliente', $cliente, PDO::PARAM_INT);

			$stmt->execute();

			// Devuelve las dos filas (Comercial y SAC)
			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			error_log("Error en getComercialSac (Subconsulta Correlacionada): " . $e->getMessage());
			// Si tienes el error de comillas, asegúrate de que no haya espacios extra o saltos de línea 
			// en la cadena SQL cuando la construyes fuera de esta función.
			return [];
		}
	}
}
