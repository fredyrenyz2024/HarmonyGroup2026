<?php
	class seguridadModel extends Model{
		
		public function __construct(){
			parent::__construct();
		}

		public function getFletes(){
			$return = $this->_db->getConsulta("select * from cmx_fletes");
			return $return;
		}

		public function getTabla(){
			$sql = '
				SELECT
					ct.id,
					cmu1.id id_origen,cmu1.municipio municipio_origen,cmu1.depto depto_origen,cmu1.pais pais_origen,
					cmu2.id id_destino,cmu2.municipio municipio_destino,cmu2.depto depto_destino,cmu2.pais pais_destino,
					ctv.id,ctv.nombre,
					ct.tarifa,ct.vigencia,ct.estado
				FROM
					cmx_tarifas ct
					INNER JOIN cmx_municipios cmu1 ON ct.origen = cmu1.id
					INNER JOIN cmx_municipios cmu2 ON ct.destino = cmu2.id
					INNER JOIN cmx_tipo_vehiculos ctv ON ct.tipo_vehiculo = ctv.id;
			';
			$return = $this->_db->getConsulta($sql);
			return $return;
		}

		public function getAsignacionRuta( $nombre_actividad ){
			$usuario = $_SESSION["usuario"];
			if ( $this->validaAdministrador( $usuario["id_perfil"]) ) {
				$sql = '
					SELECT 
						ca.id, ca.numero_agrupacion, caa.numero_manifiesto, 
						cv.placa, cv.placa_trailer, cv.tipo_carroceria, ctv.nombre TIPO_VEHICULO, 
						cp.nombre, cp.contacto, 
						SUM(cam.peso) peso_total, 
						(
							SELECT 
								COUNT(DISTINCT(cto1.id))
							FROM 
								cmx_municipios cm1
								INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id_ciudad = cm1.id
								INNER JOIN cmx_tramo_solicitud cts1 ON cts1.id_remitente_destinatario = crd1.id
								INNER JOIN cmx_tramos_orden cto1 ON cto1.id_tramo = cts1.id
							WHERE 
								cto1.id_agrupacion = ca.id
						) CANT_TRAMOS,
						(
							SELECT 
								DISTINCT(crd1.nombre)
							FROM 
								cmx_remitente_destinatario crd1 
								INNER JOIN cmx_tramo_solicitud cts1 ON cts1.id_remitente_destinatario = crd1.id
								INNER JOIN cmx_tramos_orden cto1 ON cto1.id_tramo = cts1.id
							WHERE 
								cto1.orden = 1
								AND cto1.id_agrupacion = ca.id
						) ORIGEN,
						(
							SELECT 
								DISTINCT(cm1.id)
							FROM 
								cmx_municipios cm1
								INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id_ciudad = cm1.id
								INNER JOIN cmx_tramo_solicitud cts1 ON cts1.id_remitente_destinatario = crd1.id
								INNER JOIN cmx_tramos_orden cto1 ON cto1.id_tramo = cts1.id
							WHERE 
								cto1.orden = 1
								AND cto1.id_agrupacion = ca.id
						) ID_CIUDAD_ORIGEN,
						(
							SELECT 
								DISTINCT( CONCAT(cm1.municipio," (",cm1.depto," - ",cm1.pais,")") )
							FROM 
								cmx_municipios cm1
								INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id_ciudad = cm1.id
								INNER JOIN cmx_tramo_solicitud cts1 ON cts1.id_remitente_destinatario = crd1.id
								INNER JOIN cmx_tramos_orden cto1 ON cto1.id_tramo = cts1.id
							WHERE 
								cto1.orden = 1
								AND cto1.id_agrupacion = ca.id
						) CIUDAD_ORIGEN,
						(
							SELECT 
								crd1.nombre
							FROM 
								cmx_remitente_destinatario crd1 
								INNER JOIN cmx_tramo_solicitud cts1 ON cts1.id_remitente_destinatario = crd1.id
								INNER JOIN cmx_tramos_orden cto1 ON cto1.id_tramo = cts1.id
							WHERE 
								cto1.orden = CANT_TRAMOS
								AND cto1.id_agrupacion = ca.id
						) DESTINO,
						(
							SELECT 
								cm1.id
							FROM 
								cmx_municipios cm1
								INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id_ciudad = cm1.id
								INNER JOIN cmx_tramo_solicitud cts1 ON cts1.id_remitente_destinatario = crd1.id
								INNER JOIN cmx_tramos_orden cto1 ON cto1.id_tramo = cts1.id
							WHERE 
								cto1.orden = CANT_TRAMOS
								AND cto1.id_agrupacion = ca.id
						) ID_CIUDAD_DESTINO,
						(
							SELECT 
								CONCAT(cm1.municipio," (",cm1.depto," - ",cm1.pais,")") 
							FROM 
								cmx_municipios cm1
								INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id_ciudad = cm1.id
								INNER JOIN cmx_tramo_solicitud cts1 ON cts1.id_remitente_destinatario = crd1.id
								INNER JOIN cmx_tramos_orden cto1 ON cto1.id_tramo = cts1.id
							WHERE 
								cto1.orden = CANT_TRAMOS
								AND cto1.id_agrupacion = ca.id
						) CIUDAD_DESTINO
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
						AND cia.nombre = "' . $nombre_actividad . '"
						AND cav.estado IN ("Planillado","Anticipo Asignado") 
					GROUP BY ca.id
				';
			} else {
				$sql = '
					SELECT 
						ca.id, ca.numero_agrupacion, caa.numero_manifiesto, 
						cv.placa, cv.placa_trailer, cv.tipo_carroceria, ctv.nombre TIPO_VEHICULO, 
						cp.nombre, cp.contacto, 
						SUM(cam.peso) peso_total, 
						(
							SELECT 
								COUNT(DISTINCT(cto1.id))
							FROM 
								cmx_municipios cm1
								INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id_ciudad = cm1.id
								INNER JOIN cmx_tramo_solicitud cts1 ON cts1.id_remitente_destinatario = crd1.id
								INNER JOIN cmx_tramos_orden cto1 ON cto1.id_tramo = cts1.id
							WHERE 
								cto1.id_agrupacion = ca.id
						) CANT_TRAMOS,
						(
							SELECT 
								DISTINCT(crd1.nombre)
							FROM 
								cmx_remitente_destinatario crd1 
								INNER JOIN cmx_tramo_solicitud cts1 ON cts1.id_remitente_destinatario = crd1.id
								INNER JOIN cmx_tramos_orden cto1 ON cto1.id_tramo = cts1.id
							WHERE 
								cto1.orden = 1
								AND cto1.id_agrupacion = ca.id
						) ORIGEN,
						(
							SELECT 
								DISTINCT(cm1.id)
							FROM 
								cmx_municipios cm1
								INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id_ciudad = cm1.id
								INNER JOIN cmx_tramo_solicitud cts1 ON cts1.id_remitente_destinatario = crd1.id
								INNER JOIN cmx_tramos_orden cto1 ON cto1.id_tramo = cts1.id
							WHERE 
								cto1.orden = 1
								AND cto1.id_agrupacion = ca.id
						) ID_CIUDAD_ORIGEN,
						(
							SELECT 
								DISTINCT( CONCAT(cm1.municipio," (",cm1.depto," - ",cm1.pais,")") )
							FROM 
								cmx_municipios cm1
								INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id_ciudad = cm1.id
								INNER JOIN cmx_tramo_solicitud cts1 ON cts1.id_remitente_destinatario = crd1.id
								INNER JOIN cmx_tramos_orden cto1 ON cto1.id_tramo = cts1.id
							WHERE 
								cto1.orden = 1
								AND cto1.id_agrupacion = ca.id
						) CIUDAD_ORIGEN,
						(
							SELECT 
								crd1.nombre
							FROM 
								cmx_remitente_destinatario crd1 
								INNER JOIN cmx_tramo_solicitud cts1 ON cts1.id_remitente_destinatario = crd1.id
								INNER JOIN cmx_tramos_orden cto1 ON cto1.id_tramo = cts1.id
							WHERE 
								cto1.orden = CANT_TRAMOS
								AND cto1.id_agrupacion = ca.id
						) DESTINO,
						(
							SELECT 
								cm1.id
							FROM 
								cmx_municipios cm1
								INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id_ciudad = cm1.id
								INNER JOIN cmx_tramo_solicitud cts1 ON cts1.id_remitente_destinatario = crd1.id
								INNER JOIN cmx_tramos_orden cto1 ON cto1.id_tramo = cts1.id
							WHERE 
								cto1.orden = CANT_TRAMOS
								AND cto1.id_agrupacion = ca.id
						) ID_CIUDAD_DESTINO,
						(
							SELECT 
								CONCAT(cm1.municipio," (",cm1.depto," - ",cm1.pais,")") 
							FROM 
								cmx_municipios cm1
								INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id_ciudad = cm1.id
								INNER JOIN cmx_tramo_solicitud cts1 ON cts1.id_remitente_destinatario = crd1.id
								INNER JOIN cmx_tramos_orden cto1 ON cto1.id_tramo = cts1.id
							WHERE 
								cto1.orden = CANT_TRAMOS
								AND cto1.id_agrupacion = ca.id
						) CIUDAD_DESTINO
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
						AND cia.nombre = "' . $nombre_actividad . '"
						AND cav.estado IN ("Planillado","Anticipo Asignado") 
						AND cip.estado = 1
						AND cia.perfil_responsable IN (
							SELECT cuc1.id_perfil
							FROM cmx_clientes_serv_contratados ccsc1 
								INNER JOIN cmx_clientes_serv_responsables ccsr1 ON ccsr1.id_serv_contratado = ccsc1.id
								INNER JOIN cmx_usuario_cliente cuc1 ON cuc1.id_usuario = ccsr1.id_usuario
							WHERE ccsc1.estado = 1
								AND ccsr1.estado = 1
								AND ccsc1.id_cliente = cip.id_cliente
								AND ccsr1.id_usuario = ' . $usuario["id_usuario"] . '
								AND cuc1.id_perfil = ' . $usuario["id_perfil"] . '
								AND ccsc1.servicio = (
									SELECT 
										CASE
											WHEN cip.tipo_operacion = "IMPORTACION" THEN "Transporte de Carga Internacional"
											WHEN cip.tipo_operacion = "EXPORTACION" THEN "Transporte de Carga Internacional"
											WHEN cip.tipo_operacion = "NACIONAL_AEREO" THEN "Transporte de Carga Internacional"
											WHEN cip.tipo_operacion = "NACIONAL" THEN "Transporte de Carga Nacional"
											WHEN cip.tipo_operacion = "URBANO" THEN "Transporte de Carga Nacional"
											ELSE "No definido"
										END
								)
						)
					GROUP BY ca.id
				';
			}
			// echo "<pre>" . $sql . "</pre>";
			$request["actividades"] = $this->_db->getConsulta($sql);

			if ( $request["actividades"] ) {
				foreach ($request["actividades"]["rowsData"] as $key => $value) {
					// Se busca la información de la solicitudes del agrupamiento
					$sql = '
						SELECT 
							cs.id, cs.numero_solicitud, cc.nombre, cas.peso_parcial
						FROM 
							cmx_solicitudes cs
							INNER JOIN cmx_agrupacion_solicitudes cas ON cs.id = cas.id_solicitud
							INNER JOIN cmx_agrupaciones ca ON cas.id_agrupacion = ca.id
							INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = ca.id
							INNER JOIN cmx_mercancia_solicitud cms ON cms.id = cam.id_material
							INNER JOIN cmx_importacion_material cim ON cim.id = cms.id_material_proyecto
							INNER JOIN cmx_importacion_proyecto cip ON cip.id = cim.id_importacion
							INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
						WHERE 
							ca.id = ' . $value[0] . '
						GROUP BY cs.id
					';
					$request["solicitudes"][ $value[0] ] = $this->_db->getConsulta($sql);

					// Se busca los id de actividades de las solicitudes del agrupamiento
					$sql = '
						SELECT 
							cia.id
						FROM 
							cmx_agrupaciones ca
							INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = ca.id
							INNER JOIN cmx_agrupacion_anticipo caa ON caa.id_agrupacion = ca.id
							INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cam.id_material_proyecto
							INNER JOIN cmx_importacion_proyecto cip ON cip.id = cia.id_importacion
							INNER JOIN cmx_agrupaciones_vehiculos cav ON cav.id_agrupacion = ca.id
						WHERE 
							cia.estado = 2
							AND cia.nombre = "' . $nombre_actividad . '"
							AND cav.estado = "Anticipo Asignado"
							AND ca.id = ' . $value[0] . '
					';
					$result = $this->_db->getConsulta($sql);

					$id_actividades = "";
					if ( $result ) {
						$_flag_busca_seguimiento = true;
						foreach ($result["rowsData"] as $key_01 => $value_01) {
							$id_actividades.= $value_01[0] . ",";
							if ( $_flag_busca_seguimiento ) {
								$_flag_busca_seguimiento = false;
								$id_actividad_seguimiento = $value_01[0]; 
							}
						}
					}
					$request["id_actividades"][ $value[0] ] = $id_actividades;
				}
			}
			return $request;
		}

		public function getInformarAnticipo( $nombre_actividad ){
			$usuario = $_SESSION["usuario"];
			if ( $this->validaAdministrador( $usuario["id_perfil"]) ) {
				$sql = '
					SELECT 
						caa.id, caa.numero_manifiesto, ca.id ID_AGRUPACION, ca.numero_agrupacion, cv.placa, cv.placa_trailer, cv.tipo_carroceria, ctv.nombre TIPO_VEHICULO, 
						cp.nombre, cp.contacto, cp.celular, SUM(cam.peso) peso_total, 
						caa.flete, caa.anticipo, caa.porcentaje_anticipo, caa.metodo_desembolso, cav.estado
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
						AND cia.nombre = "Informar asignación anticipo al conductor" 
						AND cav.estado IN ("Planillado","Anticipo Asignado") 
					GROUP BY ca.id
				';
			} else {
				$sql = '
					SELECT 
						caa.id, caa.numero_manifiesto, ca.id ID_AGRUPACION, ca.numero_agrupacion, cv.placa, cv.placa_trailer, cv.tipo_carroceria, ctv.nombre TIPO_VEHICULO, 
						cp.nombre, cp.contacto, cp.celular, SUM(cam.peso) peso_total, 
						caa.flete, caa.anticipo, caa.porcentaje_anticipo, caa.metodo_desembolso, cav.estado
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
						AND cia.nombre = "Informar asignación anticipo al conductor" 
						AND cav.estado IN ("Planillado","Anticipo Asignado") 
						AND cip.estado = 1
						AND cia.perfil_responsable IN (
							SELECT cuc1.id_perfil
							FROM cmx_clientes_serv_contratados ccsc1 
								INNER JOIN cmx_clientes_serv_responsables ccsr1 ON ccsr1.id_serv_contratado = ccsc1.id
								INNER JOIN cmx_usuario_cliente cuc1 ON cuc1.id_usuario = ccsr1.id_usuario
							WHERE ccsc1.estado = 1
								AND ccsr1.estado = 1
								AND ccsc1.id_cliente = cip.id_cliente
								AND ccsr1.id_usuario = ' . $usuario["id_usuario"] . '
								AND cuc1.id_perfil = ' . $usuario["id_perfil"] . '
								AND ccsc1.servicio = (
									SELECT 
										CASE
											WHEN cip.tipo_operacion = "IMPORTACION" THEN "Transporte de Carga Internacional"
											WHEN cip.tipo_operacion = "EXPORTACION" THEN "Transporte de Carga Internacional"
											WHEN cip.tipo_operacion = "NACIONAL_AEREO" THEN "Transporte de Carga Internacional"
											WHEN cip.tipo_operacion = "NACIONAL" THEN "Transporte de Carga Nacional"
											WHEN cip.tipo_operacion = "URBANO" THEN "Transporte de Carga Nacional"
											ELSE "No definido"
										END
								)
						)
					GROUP BY ca.id
				';
			}
			// echo "<p>" . $sql . "</p>";
			$request["actividades"] = $this->_db->getConsulta($sql);

			if ( $request["actividades"] ) {
				foreach ($request["actividades"]["rowsData"] as $key => $value) {
					// Se busca la información de la solicitudes del agrupamiento
					$sql = '
						SELECT 
							cs.id, cs.numero_solicitud, cc.nombre, cas.peso_parcial
						FROM 
							cmx_solicitudes cs
							INNER JOIN cmx_agrupacion_solicitudes cas ON cs.id = cas.id_solicitud
							INNER JOIN cmx_agrupaciones ca ON cas.id_agrupacion = ca.id
							INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = ca.id
							INNER JOIN cmx_mercancia_solicitud cms ON cms.id_solicitud = cs.id
							INNER JOIN cmx_importacion_material cim ON cim.id = cam.id_material_proyecto AND cim.id = cms.id_material_proyecto
							INNER JOIN cmx_importacion_proyecto cip ON cip.id = cim.id_importacion
							INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
						WHERE 
							ca.id = ' . $value["ID_AGRUPACION"] . '
						GROUP BY cs.id
					';
					$request["solicitudes"][ $value[0] ] = $this->_db->getConsulta($sql);

					// Se busca los id de actividades de las solicitudes del agrupamiento
					$sql = '
						SELECT 
							cia.id
						FROM 
							cmx_agrupaciones ca
							INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = ca.id
							INNER JOIN cmx_agrupacion_anticipo caa ON caa.id_agrupacion = ca.id
							INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cam.id_material_proyecto
							INNER JOIN cmx_importacion_proyecto cip ON cip.id = cia.id_importacion
							INNER JOIN cmx_agrupaciones_vehiculos cav ON cav.id_agrupacion = ca.id
						WHERE 
							cia.estado = 2
							AND cia.nombre = "' . $nombre_actividad . '"
							AND cav.estado = "Anticipo Asignado"
							AND ca.id = ' . $value["ID_AGRUPACION"] . '
					';
					$result = $this->_db->getConsulta($sql);

					$id_actividades = "";
					if ( $result ) {
						$_flag_busca_seguimiento = true;
						foreach ($result["rowsData"] as $key_01 => $value_01) {
							$id_actividades.= $value_01[0] . ",";
							if ( $_flag_busca_seguimiento ) {
								$_flag_busca_seguimiento = false;
								$id_actividad_seguimiento = $value_01[0]; 
							}
						}
					}
					$request["id_actividades"][ $value[0] ] = $id_actividades;
				}
			}
			return $request;
		}

		public function getSeguimientosCarga( $tipo_actividad ){
			$usuario = $_SESSION["usuario"];
			if ( $this->validaAdministrador( $usuario["id_perfil"]) ) {
				$sql = '
					SELECT 
						cs.id, cs.numero_solicitud, cc.nombre NOMBRE_CLIENTE, 
						(
							SELECT 
								cas1.peso_parcial
							FROM 
								cmx_agrupacion_solicitudes cas1
							WHERE 
								cas1.id_solicitud = cs.id
								AND cas1.id_agrupacion = ca.id
						) peso_parcial,
						ca.numero_agrupacion, ca.id ID_ASIGNACION, 
						cv.placa, cv.placa_trailer, cv.tipo_carroceria, ctv.nombre TIPO_VEHICULO, cp.nombre, cp.contacto, 
						SUM(cam.peso) peso_total, cts.id ID_TRAMO_SOLICITUD, cts.peso PESO_TRAMO,
						crd.nombre ORIGEN, crd.direccion, CONCAT(cm.municipio," (",cm.depto," - ",cm.pais,")") CIUDAD_ORIGEN,
						IF(
							(SELECT COUNT(cisc1.id) FROM cmx_importacion_seguimiento_cargue cisc1 WHERE cisc1.id_actividad = cia.id ) > 0,
							1,
							0
						) ULTIMO_SEGUIMIENTO,
						IF(
							(SELECT COUNT(cisc1.id) FROM cmx_importacion_seguimiento_cargue cisc1 WHERE cisc1.id_actividad = cia.id ) > 0,
							(SELECT MAX(cisc1.fecha_hora) FROM cmx_importacion_seguimiento_cargue cisc1 WHERE cisc1.id_actividad = cia.id),
							"N/A"
						) ULTIMO_SEGUIMIENTO_FECHA,
						IF(
							(SELECT COUNT(cisc1.id) FROM cmx_importacion_seguimiento_cargue cisc1 WHERE cisc1.id_actividad = cia.id ) > 0,
							(	SELECT cisc1.tipo_seguimiento 
								FROM cmx_importacion_seguimiento_cargue cisc1 
								WHERE 
									cisc1.id_actividad = cia.id 
									AND cisc1.id = (	SELECT MAX(cisc2.id) 
															FROM cmx_importacion_seguimiento_cargue cisc2 
															WHERE cisc2.id_actividad = cia.id) ),
							"No se ha registrado seguimientos"
						) ULTIMO_SEGUIMIENTO_TIPO_SEGUIMIENTO,
						IF(
							(SELECT COUNT(cisc1.id) FROM cmx_importacion_seguimiento_cargue cisc1 WHERE cisc1.id_actividad = cia.id ) > 0,
							(	SELECT cisc1.observacion 
								FROM cmx_importacion_seguimiento_cargue cisc1 
								WHERE 
									cisc1.id_actividad = cia.id 
									AND cisc1.id = (	SELECT MAX(cisc2.id) 
															FROM cmx_importacion_seguimiento_cargue cisc2 
															WHERE cisc2.id_actividad = cia.id) ),
							"No se ha registrado seguimientos"
						) ULTIMO_SEGUIMIENTO_OBSERVACION,
						IF(
							(SELECT COUNT(cisc1.id) FROM cmx_importacion_seguimiento_cargue cisc1 WHERE cisc1.id_actividad = cia.id ) > 0,
							(	SELECT cisc1.observacion_interna 
								FROM cmx_importacion_seguimiento_cargue cisc1 
								WHERE 
									cisc1.id_actividad = cia.id 
									AND cisc1.id = (	SELECT MAX(cisc2.id) 
															FROM cmx_importacion_seguimiento_cargue cisc2 
															WHERE cisc2.id_actividad = cia.id) ),
							""
						) ULTIMO_SEGUIMIENTO_OBSERVACION_INTERNA
					FROM 
						cmx_importacion_proyecto cip
						INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
						INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
						INNER JOIN cmx_agrupacion_material cam ON cam.id_material_proyecto = cia.id_material
						INNER JOIN cmx_agrupaciones_vehiculos cav ON cav.id_agrupacion = cam.id_agrupamiento
						INNER JOIN cmx_vehiculos cv ON cv.id = cav.id_vehiculo
						INNER JOIN cmx_proveedores cp ON cp.id = cv.id_conductor
						INNER JOIN cmx_tipo_vehiculos ctv ON ctv.id = cv.tipo_vehiculo
						INNER JOIN cmx_agrupaciones ca ON ca.id = cam.id_agrupamiento
						INNER JOIN cmx_mercancia_solicitud cms ON cms.id = cam.id_material
						INNER JOIN cmx_tramo_solicitud cts ON cts.id_solicitud = cms.id_solicitud
						INNER JOIN cmx_remitente_destinatario crd ON crd.id = cts.id_remitente_destinatario
						INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
						INNER JOIN cmx_solicitudes cs ON cs.id = cms.id_solicitud
					WHERE 
						cia.estado = 2
						AND cia.id_material IS NOT NULL
						AND cia.tipo_actividad = "carga_inicial"
						AND cts.tipo_operacion = "Cargue"
					GROUP BY cs.id, ca.id;
				';
			} else {
				$sql = '
					SELECT 
						cs.id, cs.numero_solicitud, cc.nombre NOMBRE_CLIENTE, 
						(
							SELECT 
								cas1.peso_parcial
							FROM 
								cmx_agrupacion_solicitudes cas1
							WHERE 
								cas1.id_solicitud = cs.id
								AND cas1.id_agrupacion = ca.id
						) peso_parcial,
						ca.numero_agrupacion, ca.id ID_ASIGNACION, 
						cv.placa, cv.placa_trailer, cv.tipo_carroceria, ctv.nombre TIPO_VEHICULO, cp.nombre, cp.contacto, 
						SUM(cam.peso) peso_total, cts.id ID_TRAMO_SOLICITUD, cts.peso PESO_TRAMO,
						crd.nombre ORIGEN, crd.direccion, CONCAT(cm.municipio," (",cm.depto," - ",cm.pais,")") CIUDAD_ORIGEN,
						IF(
							(SELECT COUNT(cisc1.id) FROM cmx_importacion_seguimiento_cargue cisc1 WHERE cisc1.id_actividad = cia.id ) > 0,
							1,
							0
						) ULTIMO_SEGUIMIENTO,
						IF(
							(SELECT COUNT(cisc1.id) FROM cmx_importacion_seguimiento_cargue cisc1 WHERE cisc1.id_actividad = cia.id ) > 0,
							(SELECT MAX(cisc1.fecha_hora) FROM cmx_importacion_seguimiento_cargue cisc1 WHERE cisc1.id_actividad = cia.id),
							"N/A"
						) ULTIMO_SEGUIMIENTO_FECHA,
						IF(
							(SELECT COUNT(cisc1.id) FROM cmx_importacion_seguimiento_cargue cisc1 WHERE cisc1.id_actividad = cia.id ) > 0,
							(	SELECT cisc1.tipo_seguimiento 
								FROM cmx_importacion_seguimiento_cargue cisc1 
								WHERE 
									cisc1.id_actividad = cia.id 
									AND cisc1.id = (	SELECT MAX(cisc2.id) 
															FROM cmx_importacion_seguimiento_cargue cisc2 
															WHERE cisc2.id_actividad = cia.id) ),
							"No se ha registrado seguimientos"
						) ULTIMO_SEGUIMIENTO_TIPO_SEGUIMIENTO,
						IF(
							(SELECT COUNT(cisc1.id) FROM cmx_importacion_seguimiento_cargue cisc1 WHERE cisc1.id_actividad = cia.id ) > 0,
							(	SELECT cisc1.observacion 
								FROM cmx_importacion_seguimiento_cargue cisc1 
								WHERE 
									cisc1.id_actividad = cia.id 
									AND cisc1.id = (	SELECT MAX(cisc2.id) 
															FROM cmx_importacion_seguimiento_cargue cisc2 
															WHERE cisc2.id_actividad = cia.id) ),
							"No se ha registrado seguimientos"
						) ULTIMO_SEGUIMIENTO_OBSERVACION,
						IF(
							(SELECT COUNT(cisc1.id) FROM cmx_importacion_seguimiento_cargue cisc1 WHERE cisc1.id_actividad = cia.id ) > 0,
							(	SELECT cisc1.observacion_interna 
								FROM cmx_importacion_seguimiento_cargue cisc1 
								WHERE 
									cisc1.id_actividad = cia.id 
									AND cisc1.id = (	SELECT MAX(cisc2.id) 
															FROM cmx_importacion_seguimiento_cargue cisc2 
															WHERE cisc2.id_actividad = cia.id) ),
							""
						) ULTIMO_SEGUIMIENTO_OBSERVACION_INTERNA
					FROM 
						cmx_importacion_proyecto cip
						INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
						INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
						INNER JOIN cmx_agrupacion_material cam ON cam.id_material_proyecto = cia.id_material
						INNER JOIN cmx_agrupaciones_vehiculos cav ON cav.id_agrupacion = cam.id_agrupamiento
						INNER JOIN cmx_vehiculos cv ON cv.id = cav.id_vehiculo
						INNER JOIN cmx_proveedores cp ON cp.id = cv.id_conductor
						INNER JOIN cmx_tipo_vehiculos ctv ON ctv.id = cv.tipo_vehiculo
						INNER JOIN cmx_agrupaciones ca ON ca.id = cam.id_agrupamiento
						INNER JOIN cmx_mercancia_solicitud cms ON cms.id = cam.id_material
						INNER JOIN cmx_tramo_solicitud cts ON cts.id_solicitud = cms.id_solicitud
						INNER JOIN cmx_remitente_destinatario crd ON crd.id = cts.id_remitente_destinatario
						INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
						INNER JOIN cmx_solicitudes cs ON cs.id = cms.id_solicitud
					WHERE 
						cia.estado = 2
						AND cia.id_material IS NOT NULL
						AND cia.tipo_actividad = "carga_inicial"
						AND cts.tipo_operacion = "Cargue"
						AND cip.estado = 1
						AND cia.perfil_responsable IN (
							SELECT cuc1.id_perfil
							FROM cmx_clientes_serv_contratados ccsc1 
								INNER JOIN cmx_clientes_serv_responsables ccsr1 ON ccsr1.id_serv_contratado = ccsc1.id
								INNER JOIN cmx_usuario_cliente cuc1 ON cuc1.id_usuario = ccsr1.id_usuario
							WHERE ccsc1.estado = 1
								AND ccsr1.estado = 1
								AND ccsc1.id_cliente = cip.id_cliente
								AND ccsr1.id_usuario = ' . $usuario["id_usuario"] . '
								AND cuc1.id_perfil = ' . $usuario["id_perfil"] . '
								AND ccsc1.servicio = (
									SELECT 
										CASE
											WHEN cip.tipo_operacion = "IMPORTACION" THEN "Transporte de Carga Internacional"
											WHEN cip.tipo_operacion = "EXPORTACION" THEN "Transporte de Carga Internacional"
											WHEN cip.tipo_operacion = "NACIONAL_AEREO" THEN "Transporte de Carga Internacional"
											WHEN cip.tipo_operacion = "NACIONAL" THEN "Transporte de Carga Nacional"
											WHEN cip.tipo_operacion = "URBANO" THEN "Transporte de Carga Nacional"
											ELSE "No definido"
										END
								)
						)
					GROUP BY cs.id, ca.id;
				';
			}
			// echo "<p>" . $sql . "</p>";
			$request["actividades"] = $this->_db->getConsulta($sql);

			if ( $request["actividades"] ) {
				foreach ($request["actividades"]["rowsData"] as $key => $value) {
					// Se busca los id de actividades de las solicitudes del agrupamiento
					$sql = '
						SELECT
							cia.id
						FROM 
							cmx_mercancia_solicitud cms 
							INNER JOIN cmx_agrupacion_material cam ON cam.id_material = cms.id
							INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cam.id_material_proyecto
						WHERE 
							cms.id_solicitud = ' . $value[0] . '
							AND cam.id_agrupamiento = ' . $value["ID_ASIGNACION"] . '
							AND cia.tipo_actividad = "carga_inicial"
							AND cia.estado = 2
					';
					$result = $this->_db->getConsulta($sql);

					$id_actividades = "";
					if ( $result ) {
						$_flag_busca_seguimiento = true;
						foreach ($result["rowsData"] as $key_01 => $value_01) {
							$id_actividades.= $value_01[0] . ",";
							if ( $_flag_busca_seguimiento ) {
								$_flag_busca_seguimiento = false;
								$id_actividad_seguimiento = $value_01[0]; 
							}
						}
					}
					$request["id_actividades"][ $value[0] ][ $value["ID_ASIGNACION"] ] = $id_actividades;

					// Se busca los seguimientos del agrupamiento de la actividad de descarga 
					$sql = '
						SELECT
							COUNT(cisc.id) CUANTOS
						FROM
							cmx_importacion_seguimiento_cargue cisc
						WHERE 
							cisc.id_actividad = ' . $id_actividad_seguimiento . '
						ORDER BY cisc.fecha_hora DESC;
					';
					$result = $this->_db->getConsulta($sql);

					if ( $result["rowsData"][0]["CUANTOS"] > 0 ) {
						$request["seguimientos"][ $value[0] ][ $value["ID_ASIGNACION"] ] = $id_actividad_seguimiento;
					}
				}
			}
			return $request;
		}

		public function getSeguimientosRuta( $tipo_actividad ){
			$usuario = $_SESSION["usuario"];
			$fecha_hora_actual = date('Y-m-d H:i:s', time());

			if ( $this->validaAdministrador( $usuario["id_perfil"]) ) {
				$sql = '
					SELECT 
						ca.id, ca.numero_agrupacion, caa.numero_manifiesto, 
						cv.placa, cv.placa_trailer, cv.tipo_carroceria, ctv.nombre TIPO_VEHICULO, cp.nombre, cp.contacto, cp.celular,
						SUM(cam.peso) peso_total,
						IF(
							(SELECT COUNT(cisr1.id) FROM cmx_importacion_seguimiento_rutas cisr1 WHERE cisr1.id_actividad = cia.id ) > 0,
							1, 0
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
								WHERE cisr1.id_actividad = cia.id 
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
								WHERE cisr1.id_actividad = cia.id 
									AND cisr1.id = (	SELECT MAX(cisr2.id) 
														FROM cmx_importacion_seguimiento_rutas cisr2 
														WHERE cisr2.id_actividad = cia.id) ),
							"Sin iniciar ruta"
						) ULTIMO_SEGUIMIENTO_TIPO_SEGUIMIENTO,
						IF(
							(SELECT COUNT(cisr1.id) FROM cmx_importacion_seguimiento_rutas cisr1 WHERE cisr1.id_actividad = cia.id ) > 0,
							(	SELECT cisr1.observacion 
								FROM cmx_importacion_seguimiento_rutas cisr1 
								WHERE cisr1.id_actividad = cia.id 
									AND cisr1.id = (	SELECT MAX(cisr2.id) 
														FROM cmx_importacion_seguimiento_rutas cisr2 
														WHERE cisr2.id_actividad = cia.id) ),
							"Sin iniciar ruta"
						) ULTIMO_SEGUIMIENTO_OBSERVACION,
						IF(
							(SELECT COUNT(cisr1.id) FROM cmx_importacion_seguimiento_rutas cisr1 WHERE cisr1.id_actividad = cia.id ) > 0,
							(	SELECT cisr1.observacion_interna 
								FROM cmx_importacion_seguimiento_rutas cisr1 
								WHERE cisr1.id_actividad = cia.id 
									AND cisr1.id = (	SELECT MAX(cisr2.id) 
														FROM cmx_importacion_seguimiento_rutas cisr2 
														WHERE cisr2.id_actividad = cia.id) ),
							""
						) ULTIMO_SEGUIMIENTO_OBSERVACION_INTERNA,
						IF(
							(SELECT COUNT(cisr1.id) FROM cmx_importacion_seguimiento_rutas cisr1 WHERE cisr1.id_actividad = cia.id ) > 0,
							(	SELECT cisr1.latitud 
								FROM cmx_importacion_seguimiento_rutas cisr1 
								WHERE cisr1.id_actividad = cia.id 
									AND cisr1.id = (	SELECT MAX(cisr2.id) 
														FROM cmx_importacion_seguimiento_rutas cisr2 
														WHERE cisr2.id_actividad = cia.id) ),
							(	SELECT crd1.latitud
								FROM cmx_tramo_solicitud cts1 
									INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cts1.id_remitente_destinatario
								WHERE cts1.fecha_hora_operacion = (
										SELECT cts2.fecha_hora_operacion
										FROM cmx_agrupaciones ca2 
											INNER JOIN cmx_agrupacion_solicitudes cas2 ON cas2.id_agrupacion = ca2.id
											INNER JOIN cmx_tramo_solicitud cts2 ON cts2.id_solicitud = cas2.id_solicitud
											INNER JOIN cmx_remitente_destinatario crd2 ON crd2.id = cts2.id_remitente_destinatario
											INNER JOIN cmx_tramos_orden cto2 ON cto2.id_tramo = cts2.id
										WHERE ca2.id = ca.id
											AND cas2.id_solicitud = cas.id_solicitud
											AND cto2.orden = 1
											AND crd1.id = crd2.id
											AND cts1.id = cts2.id
											AND cts2.tipo_operacion = "Cargue"
										HAVING cts2.fecha_hora_operacion = MIN(cts2.fecha_hora_operacion)
									)
							)
						) LATITUD,
						IF(
							(SELECT COUNT(cisr1.id) FROM cmx_importacion_seguimiento_rutas cisr1 WHERE cisr1.id_actividad = cia.id ) > 0,
							(	SELECT cisr1.longitud 
								FROM cmx_importacion_seguimiento_rutas cisr1 
								WHERE cisr1.id_actividad = cia.id 
									AND cisr1.id = (	SELECT MAX(cisr2.id) 
														FROM cmx_importacion_seguimiento_rutas cisr2 
														WHERE cisr2.id_actividad = cia.id) ),
							(	SELECT crd1.longitud
								FROM cmx_tramo_solicitud cts1 
									INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cts1.id_remitente_destinatario
								WHERE cts1.fecha_hora_operacion = (
										SELECT cts2.fecha_hora_operacion
										FROM cmx_agrupaciones ca2 
											INNER JOIN cmx_agrupacion_solicitudes cas2 ON cas2.id_agrupacion = ca2.id
											INNER JOIN cmx_tramo_solicitud cts2 ON cts2.id_solicitud = cas2.id_solicitud
											INNER JOIN cmx_remitente_destinatario crd2 ON crd2.id = cts2.id_remitente_destinatario
											INNER JOIN cmx_tramos_orden cto2 ON cto2.id_tramo = cts2.id
										WHERE ca2.id = ca.id
											AND cas2.id_solicitud = cas.id_solicitud
											AND cto2.orden = 1
											AND crd1.id = crd2.id
											AND cts1.id = cts2.id
											AND cts2.tipo_operacion = "Cargue"
										HAVING cts2.fecha_hora_operacion = MIN(cts2.fecha_hora_operacion)
									)
							)
						) LONGITUD,
						cia.id ID_ACTIVIDAD, cip.numero_importacion
					FROM cmx_agrupaciones ca
						INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = ca.id
						INNER JOIN cmx_agrupacion_solicitudes cas ON cas.id_agrupacion = ca.id
						INNER JOIN cmx_mercancia_solicitud cms ON cms.id_solicitud = cas.id_solicitud AND cms.id = cam.id_material
						INNER JOIN cmx_agrupacion_anticipo caa ON caa.id_agrupacion = ca.id
						INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cam.id_material_proyecto 
						INNER JOIN cmx_importacion_proyecto cip ON cip.id = cia.id_importacion
						INNER JOIN cmx_agrupaciones_vehiculos cav ON cav.id_agrupacion = ca.id
						INNER JOIN cmx_vehiculos cv ON cv.id = cav.id_vehiculo
						INNER JOIN cmx_proveedores cp ON cp.id = cv.id_conductor
						INNER JOIN cmx_tipo_vehiculos ctv ON ctv.id = cv.tipo_vehiculo
					WHERE cia.estado = 2
						AND cia.tipo_actividad = "seguimiento_ruta"
						AND cav.estado = "Anticipo Asignado"
					GROUP BY ca.id
				';
			} else {
				$sql = '
					SELECT 
						ca.id, ca.numero_agrupacion, caa.numero_manifiesto, 
						cv.placa, cv.placa_trailer, cv.tipo_carroceria, ctv.nombre TIPO_VEHICULO, cp.nombre, cp.contacto, cp.celular,
						SUM(cam.peso) peso_total,
						IF(
							(SELECT COUNT(cisr1.id) FROM cmx_importacion_seguimiento_rutas cisr1 WHERE cisr1.id_actividad = cia.id ) > 0,
							1, 0
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
						) ULTIMO_SEGUIMIENTO_OBSERVACION_INTERNA,
						IF(
							(SELECT COUNT(cisr1.id) FROM cmx_importacion_seguimiento_rutas cisr1 WHERE cisr1.id_actividad = cia.id ) > 0,
							(	SELECT cisr1.latitud 
								FROM cmx_importacion_seguimiento_rutas cisr1 
								WHERE 
									cisr1.id_actividad = cia.id 
									AND cisr1.id = (	SELECT MAX(cisr2.id) 
														FROM cmx_importacion_seguimiento_rutas cisr2 
														WHERE cisr2.id_actividad = cia.id) ),
							(
								SELECT crd1.latitud
								FROM cmx_tramo_solicitud cts1 
									INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cts1.id_remitente_destinatario
								WHERE cts1.fecha_hora_operacion = (
										SELECT cts2.fecha_hora_operacion
										FROM cmx_agrupaciones ca2 
											INNER JOIN cmx_agrupacion_solicitudes cas2 ON cas2.id_agrupacion = ca2.id
											INNER JOIN cmx_tramo_solicitud cts2 ON cts2.id_solicitud = cas2.id_solicitud
											INNER JOIN cmx_remitente_destinatario crd2 ON crd2.id = cts2.id_remitente_destinatario
											INNER JOIN cmx_tramos_orden cto2 ON cto2.id_tramo = cts2.id
										WHERE ca2.id = ca.id
											AND cas2.id_solicitud = cas.id_solicitud
											AND cto2.orden = 1
											AND crd1.id = crd2.id
											AND cts1.id = cts2.id
											AND cts2.tipo_operacion = "Cargue"
										HAVING cts2.fecha_hora_operacion = MIN(cts2.fecha_hora_operacion)
									)
							)
						) LATITUD,
						IF(
							(SELECT COUNT(cisr1.id) FROM cmx_importacion_seguimiento_rutas cisr1 WHERE cisr1.id_actividad = cia.id ) > 0,
							(	SELECT cisr1.longitud 
								FROM cmx_importacion_seguimiento_rutas cisr1 
								WHERE 
									cisr1.id_actividad = cia.id 
									AND cisr1.id = (	SELECT MAX(cisr2.id) 
														FROM cmx_importacion_seguimiento_rutas cisr2 
														WHERE cisr2.id_actividad = cia.id) ),
							(	SELECT crd1.longitud
								FROM cmx_tramo_solicitud cts1 
									INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cts1.id_remitente_destinatario
								WHERE cts1.fecha_hora_operacion = (
										SELECT cts2.fecha_hora_operacion
										FROM cmx_agrupaciones ca2 
											INNER JOIN cmx_agrupacion_solicitudes cas2 ON cas2.id_agrupacion = ca2.id
											INNER JOIN cmx_tramo_solicitud cts2 ON cts2.id_solicitud = cas2.id_solicitud
											INNER JOIN cmx_remitente_destinatario crd2 ON crd2.id = cts2.id_remitente_destinatario
											INNER JOIN cmx_tramos_orden cto2 ON cto2.id_tramo = cts2.id
										WHERE ca2.id = ca.id
											AND cas2.id_solicitud = cas.id_solicitud
											AND cto2.orden = 1
											AND crd1.id = crd2.id
											AND cts1.id = cts2.id
											AND cts2.tipo_operacion = "Cargue"
										HAVING cts2.fecha_hora_operacion = MIN(cts2.fecha_hora_operacion)
									)
							)
						) LONGITUD,
						cia.id ID_ACTIVIDAD, cip.numero_importacion
					FROM 
						cmx_agrupaciones ca
						INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = ca.id
						INNER JOIN cmx_agrupacion_solicitudes cas ON cas.id_agrupacion = ca.id
						INNER JOIN cmx_mercancia_solicitud cms ON cms.id_solicitud = cas.id_solicitud AND cms.id = cam.id_material
						INNER JOIN cmx_agrupacion_anticipo caa ON caa.id_agrupacion = ca.id
						INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cam.id_material_proyecto 
						INNER JOIN cmx_importacion_proyecto cip ON cip.id = cia.id_importacion
						INNER JOIN cmx_agrupaciones_vehiculos cav ON cav.id_agrupacion = ca.id
						INNER JOIN cmx_vehiculos cv ON cv.id = cav.id_vehiculo
						INNER JOIN cmx_proveedores cp ON cp.id = cv.id_conductor
						INNER JOIN cmx_tipo_vehiculos ctv ON ctv.id = cv.tipo_vehiculo
					WHERE 
						cia.estado = 2
						AND cia.tipo_actividad = "seguimiento_ruta"
						AND cav.estado = "Anticipo Asignado"
						AND cip.estado = 1
						AND cia.perfil_responsable IN (
							SELECT cuc1.id_perfil
							FROM cmx_clientes_serv_contratados ccsc1 
								INNER JOIN cmx_clientes_serv_responsables ccsr1 ON ccsr1.id_serv_contratado = ccsc1.id
								INNER JOIN cmx_usuario_cliente cuc1 ON cuc1.id_usuario = ccsr1.id_usuario
							WHERE ccsc1.estado = 1
								AND ccsr1.estado = 1
								AND ccsc1.id_cliente = cip.id_cliente
								AND ccsr1.id_usuario = ' . $usuario["id_usuario"] . '
								AND cuc1.id_perfil = ' . $usuario["id_perfil"] . '
								AND ccsc1.servicio = (
									SELECT 
										CASE
											WHEN cip.tipo_operacion = "IMPORTACION" THEN "Transporte de Carga Internacional"
											WHEN cip.tipo_operacion = "EXPORTACION" THEN "Transporte de Carga Internacional"
											WHEN cip.tipo_operacion = "NACIONAL_AEREO" THEN "Transporte de Carga Internacional"
											WHEN cip.tipo_operacion = "NACIONAL" THEN "Transporte de Carga Nacional"
											WHEN cip.tipo_operacion = "URBANO" THEN "Transporte de Carga Nacional"
											ELSE "No definido"
										END
								)
						)
					GROUP BY ca.id
				';
			}
			// echo "<pre>" . $sql . "</pre>";
			$request["actividades"] = $this->_db->getConsulta($sql);

			if ( $request["actividades"] ) {
				foreach ($request["actividades"]["rowsData"] as $key => $value) {
					// Se busca la información de la solicitudes activas del agrupamiento
					$sql = '
						SELECT 
							cs.id, cs.numero_solicitud, cc.nombre, cas.peso_parcial
						FROM cmx_solicitudes cs
							INNER JOIN cmx_agrupacion_solicitudes cas ON cs.id = cas.id_solicitud
							INNER JOIN cmx_agrupaciones ca ON cas.id_agrupacion = ca.id
							INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = ca.id
							INNER JOIN cmx_mercancia_solicitud cms ON cms.id_solicitud = cs.id AND cms.id = cam.id_material
							INNER JOIN cmx_importacion_material cim ON cim.id = cam.id_material_proyecto 
							INNER JOIN cmx_importacion_proyecto cip ON cip.id = cim.id_importacion
							INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
							INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
						WHERE ca.id = ' . $value[0] . '
							AND cia.estado = 2
							AND cia.tipo_actividad = "' . $tipo_actividad . '"
						GROUP BY cs.id
					';
					$request["solicitudes"][ $value[0] ] = $this->_db->getConsulta($sql);

					// Se busca los id de actividades de las solicitudes del agrupamiento
					$sql = '
						SELECT cia.id
						FROM cmx_agrupaciones ca
							INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = ca.id
							INNER JOIN cmx_agrupacion_anticipo caa ON caa.id_agrupacion = ca.id
							INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cam.id_material_proyecto
							INNER JOIN cmx_importacion_proyecto cip ON cip.id = cia.id_importacion
							INNER JOIN cmx_agrupaciones_vehiculos cav ON cav.id_agrupacion = ca.id
						WHERE cia.estado = 2
							AND cia.tipo_actividad = "' . $tipo_actividad . '"
							AND cav.estado = "Anticipo Asignado"
							AND ca.id = ' . $value[0] . '
					';
					$result = $this->_db->getConsulta($sql);

					$id_actividades = "";
					if ( $result ) {
						$_flag_busca_seguimiento = true;
						foreach ($result["rowsData"] as $key_01 => $value_01) {
							$id_actividades.= $value_01[0] . ",";
							if ( $_flag_busca_seguimiento ) {
								$_flag_busca_seguimiento = false;
								$id_actividad_seguimiento = $value_01[0]; 
							}
						}
					}
					$request["id_actividades"][ $value[0] ] = $id_actividades;

					// se filtra información de los seguimientos si existen 
					switch ( $tipo_actividad ) {
						case 'seguimiento_descarga':

							// Se busca los seguimientos del agrupamiento de la actividad de descarga 
							$sql = '
								SELECT COUNT(cisd.id) CUANTOS
								FROM cmx_importacion_seguimiento_descargue cisd
								WHERE cisd.id_actividad = ' . $id_actividad_seguimiento . '
								ORDER BY cisd.fecha_hora DESC;
							';
							$result = $this->_db->getConsulta($sql);

							if ( $result["rowsData"][0]["CUANTOS"] > 0 ) {
								$request["seguimientos"][ $value[0] ] = $id_actividad_seguimiento;
							}
							break;

						default:
							# code...
							break;
					}
				}
			}
			return $request;
		}

		public function getSeguimientosDescarga( $tipo_actividad ){
			$usuario = $_SESSION["usuario"];
			if ( $this->validaAdministrador( $usuario["id_perfil"]) ) {
				$sql = '
					SELECT 
						DISTINCT(cs.id), cs.numero_solicitud, cc.nombre NOMBRE_CLIENTE, 
						(	SELECT cas1.peso_parcial
							FROM cmx_agrupacion_solicitudes cas1 
							WHERE cas1.id_agrupacion = ca.id 
								AND cas1.id_solicitud = cs.id 
						) peso_parcial,
						ca.numero_agrupacion, ca.id ID_ASIGNACION, caa.numero_manifiesto, 
						cv.placa, cv.placa_trailer, cv.tipo_carroceria, ctv.nombre TIPO_VEHICULO, cp.nombre, cp.contacto, 
						SUM(cam.peso) peso_total,
						cts.id ID_TRAMO_SOLICITUD,
						(	SELECT SUM(cts1.peso)
							FROM cmx_solicitudes cs1
								INNER JOIN cmx_tramo_solicitud cts1 ON cts1.id_solicitud = cs1.id
							WHERE cs1.id = cs.id
								AND cts1.tipo_operacion = "Descargue"
						) PESO_TRAMO,
						crd.nombre DESTINO, crd.direccion, CONCAT(cm.municipio," (",cm.depto," - ",cm.pais,")") CIUDAD_DESTINO,
						IF(
							(SELECT COUNT(cisd1.id) FROM cmx_importacion_seguimiento_descargue cisd1 WHERE cisd1.id_actividad = cia.id ) > 0,
							1, 0
						) ULTIMO_SEGUIMIENTO,
						IF(
							(SELECT COUNT(cisd1.id) FROM cmx_importacion_seguimiento_descargue cisd1 WHERE cisd1.id_actividad = cia.id ) > 0,
							(SELECT MAX(cisd1.fecha_hora) FROM cmx_importacion_seguimiento_descargue cisd1 WHERE cisd1.id_actividad = cia.id),
							"N/A"
						) ULTIMO_SEGUIMIENTO_FECHA,
						IF(
							(SELECT COUNT(cisd1.id) FROM cmx_importacion_seguimiento_descargue cisd1 WHERE cisd1.id_actividad = cia.id ) > 0,
							(	SELECT cisd1.tipo_seguimiento 
								FROM cmx_importacion_seguimiento_descargue cisd1 
								WHERE cisd1.id_actividad = cia.id 
									AND cisd1.id = (	SELECT MAX(cisd2.id) 
														FROM cmx_importacion_seguimiento_descargue cisd2 
														WHERE cisd2.id_actividad = cia.id) ),
							"No se ha registrado seguimientos"
						) ULTIMO_SEGUIMIENTO_TIPO_SEGUIMIENTO,
						IF(
							(SELECT COUNT(cisd1.id) FROM cmx_importacion_seguimiento_descargue cisd1 WHERE cisd1.id_actividad = cia.id ) > 0,
							(	SELECT cisd1.observacion 
								FROM cmx_importacion_seguimiento_descargue cisd1 
								WHERE cisd1.id_actividad = cia.id 
									AND cisd1.id = (	SELECT MAX(cisd2.id) 
														FROM cmx_importacion_seguimiento_descargue cisd2 
														WHERE cisd2.id_actividad = cia.id) ),
							"No se ha registrado seguimientos"
						) ULTIMO_SEGUIMIENTO_OBSERVACION,
						IF(
							(SELECT COUNT(cisd1.id) FROM cmx_importacion_seguimiento_descargue cisd1 WHERE cisd1.id_actividad = cia.id ) > 0,
							(	SELECT cisd1.observacion_interna 
								FROM cmx_importacion_seguimiento_descargue cisd1 
								WHERE cisd1.id_actividad = cia.id 
									AND cisd1.id = (	SELECT MAX(cisd2.id) 
														FROM cmx_importacion_seguimiento_descargue cisd2 
														WHERE cisd2.id_actividad = cia.id) ),
							""
						) ULTIMO_SEGUIMIENTO_OBSERVACION_INTERNA
					FROM 
						cmx_importacion_proyecto cip					
						INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
						INNER JOIN cmx_agrupacion_material cam ON cam.id_material_proyecto = cia.id_material
						INNER JOIN cmx_agrupaciones ca ON ca.id = cam.id_agrupamiento
						INNER JOIN cmx_agrupacion_anticipo caa ON caa.id_agrupacion = cam.id_agrupamiento
						INNER JOIN cmx_agrupaciones_vehiculos cav ON cav.id_agrupacion = cam.id_agrupamiento
						INNER JOIN cmx_vehiculos cv ON cv.id = cav.id_vehiculo
						INNER JOIN cmx_proveedores cp ON cp.id = cv.id_conductor
						INNER JOIN cmx_tipo_vehiculos ctv ON ctv.id = cv.tipo_vehiculo
						INNER JOIN cmx_mercancia_solicitud cms ON cms.id = cam.id_material
						INNER JOIN cmx_solicitudes cs ON cs.id = cms.id_solicitud
						INNER JOIN cmx_tramo_solicitud cts ON cts.id_solicitud = cs.id
						INNER JOIN cmx_remitente_destinatario crd ON crd.id = cts.id_remitente_destinatario
						INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
						INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
					WHERE 
						cia.estado = 2
						AND cia.tipo_actividad = "seguimiento_descarga"
						AND cav.estado = "Anticipo Asignado"
						AND cts.tipo_operacion = "Descargue"
					GROUP BY cs.id, ca.id;
				';
			} else {
				$sql = '
					SELECT 
						DISTINCT(cs.id), cs.numero_solicitud, cc.nombre NOMBRE_CLIENTE, 
						(	SELECT cas1.peso_parcial
							FROM cmx_agrupacion_solicitudes cas1 
							WHERE cas1.id_agrupacion = ca.id 
								AND cas1.id_solicitud = cs.id 
						) peso_parcial,
						ca.numero_agrupacion, ca.id ID_ASIGNACION, caa.numero_manifiesto, 
						cv.placa, cv.placa_trailer, cv.tipo_carroceria, ctv.nombre TIPO_VEHICULO, cp.nombre, cp.contacto, 
						SUM(cam.peso) peso_total,
						cts.id ID_TRAMO_SOLICITUD,
						(	SELECT SUM(cts1.peso)
							FROM cmx_solicitudes cs1
								INNER JOIN cmx_tramo_solicitud cts1 ON cts1.id_solicitud = cs1.id
							WHERE cs1.id = cs.id
								AND cts1.tipo_operacion = "Descargue"
						) PESO_TRAMO,
						crd.nombre DESTINO, crd.direccion, CONCAT(cm.municipio," (",cm.depto," - ",cm.pais,")") CIUDAD_DESTINO,
						IF(
							(SELECT COUNT(cisd1.id) FROM cmx_importacion_seguimiento_descargue cisd1 WHERE cisd1.id_actividad = cia.id ) > 0,
							1, 0
						) ULTIMO_SEGUIMIENTO,
						IF(
							(SELECT COUNT(cisd1.id) FROM cmx_importacion_seguimiento_descargue cisd1 WHERE cisd1.id_actividad = cia.id ) > 0,
							(SELECT MAX(cisd1.fecha_hora) FROM cmx_importacion_seguimiento_descargue cisd1 WHERE cisd1.id_actividad = cia.id),
							"N/A"
						) ULTIMO_SEGUIMIENTO_FECHA,
						IF(
							(SELECT COUNT(cisd1.id) FROM cmx_importacion_seguimiento_descargue cisd1 WHERE cisd1.id_actividad = cia.id ) > 0,
							(	SELECT cisd1.tipo_seguimiento 
								FROM cmx_importacion_seguimiento_descargue cisd1 
								WHERE cisd1.id_actividad = cia.id 
									AND cisd1.id = (	SELECT MAX(cisd2.id) 
														FROM cmx_importacion_seguimiento_descargue cisd2 
														WHERE cisd2.id_actividad = cia.id) ),
							"No se ha registrado seguimientos"
						) ULTIMO_SEGUIMIENTO_TIPO_SEGUIMIENTO,
						IF(
							(SELECT COUNT(cisd1.id) FROM cmx_importacion_seguimiento_descargue cisd1 WHERE cisd1.id_actividad = cia.id ) > 0,
							(	SELECT cisd1.observacion 
								FROM cmx_importacion_seguimiento_descargue cisd1 
								WHERE cisd1.id_actividad = cia.id 
									AND cisd1.id = (	SELECT MAX(cisd2.id) 
														FROM cmx_importacion_seguimiento_descargue cisd2 
														WHERE cisd2.id_actividad = cia.id) ),
							"No se ha registrado seguimientos"
						) ULTIMO_SEGUIMIENTO_OBSERVACION,
						IF(
							(SELECT COUNT(cisd1.id) FROM cmx_importacion_seguimiento_descargue cisd1 WHERE cisd1.id_actividad = cia.id ) > 0,
							(	SELECT cisd1.observacion_interna 
								FROM cmx_importacion_seguimiento_descargue cisd1 
								WHERE cisd1.id_actividad = cia.id 
									AND cisd1.id = (	SELECT MAX(cisd2.id) 
														FROM cmx_importacion_seguimiento_descargue cisd2 
														WHERE cisd2.id_actividad = cia.id) ),
							""
						) ULTIMO_SEGUIMIENTO_OBSERVACION_INTERNA
					FROM 
						cmx_importacion_proyecto cip					
						INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
						INNER JOIN cmx_agrupacion_material cam ON cam.id_material_proyecto = cia.id_material
						INNER JOIN cmx_agrupaciones ca ON ca.id = cam.id_agrupamiento
						INNER JOIN cmx_agrupacion_anticipo caa ON caa.id_agrupacion = cam.id_agrupamiento
						INNER JOIN cmx_agrupaciones_vehiculos cav ON cav.id_agrupacion = cam.id_agrupamiento
						INNER JOIN cmx_vehiculos cv ON cv.id = cav.id_vehiculo
						INNER JOIN cmx_proveedores cp ON cp.id = cv.id_conductor
						INNER JOIN cmx_tipo_vehiculos ctv ON ctv.id = cv.tipo_vehiculo
						INNER JOIN cmx_mercancia_solicitud cms ON cms.id = cam.id_material
						INNER JOIN cmx_solicitudes cs ON cs.id = cms.id_solicitud
						INNER JOIN cmx_tramo_solicitud cts ON cts.id_solicitud = cs.id
						INNER JOIN cmx_remitente_destinatario crd ON crd.id = cts.id_remitente_destinatario
						INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
						INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
					WHERE 
						cia.estado = 2
						AND cia.tipo_actividad = "seguimiento_descarga"
						AND cav.estado = "Anticipo Asignado"
						AND cts.tipo_operacion = "Descargue"
						AND cip.estado = 1
						AND cia.perfil_responsable IN (
							SELECT cuc1.id_perfil
							FROM cmx_clientes_serv_contratados ccsc1 
								INNER JOIN cmx_clientes_serv_responsables ccsr1 ON ccsr1.id_serv_contratado = ccsc1.id
								INNER JOIN cmx_usuario_cliente cuc1 ON cuc1.id_usuario = ccsr1.id_usuario
							WHERE ccsc1.estado = 1
								AND ccsr1.estado = 1
								AND ccsc1.id_cliente = cip.id_cliente
								AND ccsr1.id_usuario = ' . $usuario["id_usuario"] . '
								AND cuc1.id_perfil = ' . $usuario["id_perfil"] . '
								AND ccsc1.servicio = (
									SELECT 
										CASE
											WHEN cip.tipo_operacion = "IMPORTACION" THEN "Transporte de Carga Internacional"
											WHEN cip.tipo_operacion = "EXPORTACION" THEN "Transporte de Carga Internacional"
											WHEN cip.tipo_operacion = "NACIONAL_AEREO" THEN "Transporte de Carga Internacional"
											WHEN cip.tipo_operacion = "NACIONAL" THEN "Transporte de Carga Nacional"
											WHEN cip.tipo_operacion = "URBANO" THEN "Transporte de Carga Nacional"
											ELSE "No definido"
										END
								)
						)
					GROUP BY cs.id, ca.id;
				';
			}
			// echo "<p>" . $sql . "</p>";
			$request["actividades"] = $this->_db->getConsulta($sql);

			if ( $request["actividades"] ) {
				foreach ($request["actividades"]["rowsData"] as $key => $value) {
					// Se busca los id de actividades de las solicitudes del agrupamiento
					$sql = '
						SELECT cia.id
						FROM cmx_agrupacion_solicitudes cas 
							INNER JOIN cmx_mercancia_solicitud cms ON cms.id_solicitud = cas.id_solicitud
							INNER JOIN cmx_agrupacion_material cam ON cam.id_material = cms.id
							INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cam.id_material_proyecto
						WHERE cas.id_solicitud = ' . $value[0] . '
							AND cas.id_agrupacion = ' . $value["ID_ASIGNACION"] . '
							AND cia.tipo_actividad = "seguimiento_descarga"
							AND cia.estado = 2
					';
					$result = $this->_db->getConsulta($sql);

					$id_actividades = "";
					if ( $result ) {
						$_flag_busca_seguimiento = true;
						foreach ($result["rowsData"] as $key_01 => $value_01) {
							$id_actividades.= $value_01[0] . ",";
							if ( $_flag_busca_seguimiento ) {
								$_flag_busca_seguimiento = false;
								$id_actividad_seguimiento = $value_01[0]; 
							}
						}
					}
					$request["id_actividades"][ $value[0] ][ $value["ID_ASIGNACION"] ] = $id_actividades;

					// Se busca los seguimientos del agrupamiento de la actividad de descarga 
					$sql = '
						SELECT COUNT(cisd.id) CUANTOS
						FROM cmx_importacion_seguimiento_descargue cisd
						WHERE cisd.id_actividad = ' . $id_actividad_seguimiento . '
						ORDER BY cisd.fecha_hora DESC;
					';
					$result = $this->_db->getConsulta($sql);

					if ( $result["rowsData"][0]["CUANTOS"] > 0 ) {
						$request["seguimientos"][ $value[0] ][ $value["ID_ASIGNACION"] ] = $id_actividad_seguimiento;
					}
				}
			}
			return $request;
		}


		/*********** FUNCIONES PARA LA CREACIÓN DE SELECTS **********/
		public function getHtmlSelectTipoSeguimiento( $name , $id, $tipo_movimiento ){
			if ($name) {
				$query = '
					SELECT *
					FROM cmx_tipo_seguimiento cts
					WHERE cts.estado = "' . $tipo_movimiento . '"
					ORDER BY cts.nombre;
				';
				// echo $query;
				$array = $this->_db->getConsulta($query);

				// Se recorre contenido de la consulta
				if ($array) {
					// print_r($array);
					$select = '<select class="form-control input-sm" name="' . $name . '" id="slct_tipo_seguimiento_'. $id . '" aria-hidden="true">';
					$select.= '<option value="" selected disabled>Seleccione</option>';

					foreach ($array['rowsData'] as $key => $value) {
						if ($value[0] == $id) {
							$select.= '<option value="' . $value[1] . '" selected="">' . $value[1] . '</option>';
						}else{
							$select.= '<option value="' . $value[1] . '">' . $value[1] . '</option>';
						}
					}
					$select.= '</select>';
				} else {
					$select = "No hay datos en esta tabla...";
				}
			} else {
				$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
			}
			return $select;
		}
		/*********** FIN - FUNCIONES PARA LA CREACIÓN DE SELECTS **********/
	}
?>
