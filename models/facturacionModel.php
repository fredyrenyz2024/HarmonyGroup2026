<?php
class facturacionModel extends Model
{

	public function __construct()
	{
		parent::__construct();
	}

	public function getListaInstrucciones()
	{
		$return = NULL;
		$usuario = $_SESSION["usuario"];
		if ($this->validaAdministrador($usuario["id_perfil"])) {
			$sql = '
					SELECT
						cip.id, cip.numero_importacion, cip.importacion, cia.grupo,
						ccc.cod_contrato, ctc.nombre TIPO_CONTRATO,
						cc.id ID_CLIENTE, cc.cod_cliente, CONCAT(cc.documento,"-",cc.digito_verificacion) DOCUMENTO_CLIENTE, cc.sigla, cc.nombre,
						COUNT(DISTINCT(cam.id)) CANT_REMESAS, SUM(cam.peso) PESO, SUM(cam.valor_declarado) VALOR_DECLARADO
					FROM 
						cmx_agrupacion_anticipo caa
						INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = caa.id_agrupacion
						INNER JOIN cmx_mercancia_solicitud cms ON cms.id = cam.id_material
						INNER JOIN cmx_importacion_material cim ON cim.id = cam.id_material_proyecto AND cim.id = cms.id_material_proyecto
						INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cim.id
						INNER JOIN cmx_importacion_proyecto cip ON cip.id = cim.id_importacion AND cip.id = cia.id_importacion
						INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
						INNER JOIN cmx_contrato_cliente ccc ON ccc.id = cip.id_contrato
						INNER JOIN cmx_tipo_contrato ctc ON ctc.id = ccc.tipo_contrato
					WHERE cip.estado = 1
						AND cia.tipo_actividad = "instruccion_factura"
						AND cia.estado = 2
					GROUP BY cip.id, cia.grupo;
				';
		} else {
			$sql = '
					SELECT
						cip.id, cip.numero_importacion, cip.importacion, cia.grupo,
						ccc.cod_contrato, ctc.nombre,
						cc.id ID_CLIENTE, cc.cod_cliente, CONCAT(cc.documento,"-",cc.digito_verificacion) DOCUMENTO_CLIENTE, cc.sigla, cc.nombre,
						COUNT(DISTINCT(cam.id)) CANT_REMESAS, SUM(cam.peso) PESO, SUM(cam.valor_declarado) VALOR_DECLARADO
					FROM 
						cmx_agrupacion_anticipo caa
						INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = caa.id_agrupacion
						INNER JOIN cmx_mercancia_solicitud cms ON cms.id = cam.id_material
						INNER JOIN cmx_importacion_material cim ON cim.id = cam.id_material_proyecto AND cim.id = cms.id_material_proyecto
						INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cim.id
						INNER JOIN cmx_importacion_proyecto cip ON cip.id = cim.id_importacion AND cip.id = cia.id_importacion
						INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
						INNER JOIN cmx_contrato_cliente ccc ON ccc.id = cip.id_contrato
						INNER JOIN cmx_tipo_contrato ctc ON ctc.id = ccc.tipo_contrato
					WHERE cip.estado = 1
						AND cia.tipo_actividad = "instruccion_factura"
						AND cia.estado = 2
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
					GROUP BY cip.id, cia.grupo;
				';
		}
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetchAll(PDO::FETCH_ASSOC);

		if ($result) {
			$return["general"] = $result;
		}

		return $return;
	}

	public function getListaRemesasCliente()
	{
		// Se busca informacion de las remesas 
		$usuario = $_SESSION["usuario"];
		$_falg_tesoreria = false;
		if ($usuario["id_perfil"] == 15) {
			$_falg_tesoreria = true;
		}

		if ($this->validaAdministrador($usuario["id_perfil"], $_falg_tesoreria)) {
			$sql = '
					SELECT
						cam.id ID_REMESA, cam.numero_remesa, 
						cc.id ID_CLIENTE, cc.tipo_documento, cc.documento, cc.digito_verificacion, cc.nombre,
						caa.id ID_MANIFIESTO, caa.numero_manifiesto, cip.id ID_PROYECTO, cip.numero_importacion, cip.importacion,
						cms.id_solicitud, csat.valor_venta, FLOOR(cs.peso_total) PESO_TOTAL, cam.peso PESO_MATERIAL,
						FLOOR( ( csat.valor_venta * cam.peso ) / FLOOR(cs.peso_total) ) VALOR_PRORRATEO,
						(
							SELECT
								CONCAT(cm1.id,"_",cm1.municipio," (",cm1.depto," - ",cm1.pais,")")
							FROM 
								cmx_tramo_solicitud cts1
								INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cts1.id_remitente_destinatario
								INNER JOIN cmx_municipios cm1 ON cm1.id = crd1.id_ciudad
								INNER JOIN cmx_tramos_orden cto1 ON cto1.id_tramo = cts1.id
							WHERE 
								cts1.id_solicitud = cs.id
								AND cto1.orden = 1
								AND cts1.tipo_operacion = "Cargue"
						) ORIGEN,
						(
							SELECT 
								CONCAT(cm1.id,"_",cm1.municipio," (",cm1.depto," - ",cm1.pais,")")
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
										cmx_tramos_orden cto2
									WHERE 
										cto2.id_tramo = cto1.id_tramo
										AND cto1.id_agrupacion = ca.id
								) 
							ORDER BY cto1.orden DESC
							LIMIT 1
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
						cia.tipo_actividad = "factura"
						AND cip.estado = 1
						AND cia.estado = 2
						AND csat.id_servicio = 24
					ORDER BY cam.helisa_estado DESC, ID_MANIFIESTO, ID_REMESA
				;';
		} else {
			$sql = '
					SELECT 
						cam.id ID_REMESA, cam.numero_remesa, 
						cc.id ID_CLIENTE, cc.tipo_documento, cc.documento, cc.digito_verificacion, cc.nombre,
						caa.id ID_MANIFIESTO, caa.numero_manifiesto, cip.id ID_PROYECTO, cip.numero_importacion, cip.importacion,
						cms.id_solicitud, csat.valor_venta, FLOOR(cs.peso_total) PESO_TOTAL, cam.peso PESO_MATERIAL,
						FLOOR( ( csat.valor_venta * cam.peso ) / FLOOR(cs.peso_total) ) VALOR_PRORRATEO,
						(
							SELECT
								CONCAT(cm1.id,"_",cm1.municipio," (",cm1.depto," - ",cm1.pais,")")
							FROM 
								cmx_tramo_solicitud cts1
								INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cts1.id_remitente_destinatario
								INNER JOIN cmx_municipios cm1 ON cm1.id = crd1.id_ciudad
								INNER JOIN cmx_tramos_orden cto1 ON cto1.id_tramo = cts1.id
							WHERE 
								cts1.id_solicitud = cs.id
								AND cto1.orden = 1
								AND cts1.tipo_operacion = "Cargue"
						) ORIGEN,
						(
							SELECT 
								CONCAT(cm1.id,"_",cm1.municipio," (",cm1.depto," - ",cm1.pais,")")
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
										cmx_tramos_orden cto2
									WHERE 
										cto2.id_tramo = cto1.id_tramo
										AND cto1.id_agrupacion = ca.id
								) 
							ORDER BY cto1.orden DESC
							LIMIT 1
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
						cia.tipo_actividad = "factura"
						AND cia.estado = 2
						AND csat.id_servicio = 24
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
					ORDER BY cam.helisa_estado DESC, ID_MANIFIESTO, ID_REMESA
				;';
		}
		// $return = $this->_db->getConsulta($sql);
		// return $return;
		$return = $this->_db3->prepare($sql);
		$return->execute();
		return $return->fetchAll(PDO::FETCH_ASSOC);
	}

	public function getListaRemesasDescargadas()
	{
		$sql = 'SELECT * FROM cmx_agrupacion_descarga_remesas cadr;';
		// $return["descargas"] = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$return["descargas"] = $result->fetchAll(PDO::FETCH_ASSOC);

		if ($return["descargas"]) {
			foreach ($return["descargas"] as $key => $value) {
				$arrayRemesas = explode(",", $value["lista_remesas"]);

				$return["cant_remesas"][$value['id']] = COUNT($arrayRemesas) - 1;

				$sql = '
						SELECT 
							COUNT( DISTINCT(caa.numero_manifiesto) ) CUANTOS
						FROM 
							cmx_agrupacion_material cam
							INNER JOIN cmx_agrupacion_anticipo caa ON caa.id_agrupacion = cam.id_agrupamiento
						WHERE 
							cam.id IN (' . $value["lista_remesas"] . '0)
					;';
				// $result = $this->_db->getConsulta($sql);
				$result = $this->_db3->prepare($sql);
				$result->execute();
				$return["cant_manifiestos"][$value['id']] = $result->fetch(PDO::FETCH_ASSOC)["CUANTOS"];
				// $return["cant_manifiestos"][$value[0]] = $result["rowsData"][0]["CUANTOS"];
			}
		}
		return $return;
	}

	public function getCostosProyectos()
	{
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
							SELECT 
								COUNT( cas1.id_agrupacion) CUANTOS
							FROM 
								cmx_agrupacion_solicitudes cas1
								INNER JOIN cmx_servicio_adicional_tramo csat1 ON csat1.id_solicitud = cas1.id_solicitud
							WHERE 
								cas1.id_agrupacion = cam.id_agrupamiento
								AND csat1.id_servicio != 24
						)
					) VALOR_COMPRA,
					(
						SELECT 
							crd1.nombre
						FROM 
							cmx_tramo_solicitud cts1
							INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cts1.id_remitente_destinatario
							INNER JOIN cmx_tramos_orden cto1 ON cto1.id_tramo = cts1.id
						WHERE 
							cts1.id_solicitud = cs.id
							AND cto1.orden = 1
					) ORIGEN,
					(
						SELECT 
							CONCAT(cm1.municipio," (",cm1.depto," - ",cm1.pais,")")
						FROM 
							cmx_tramo_solicitud cts1
							INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cts1.id_remitente_destinatario
							INNER JOIN cmx_municipios cm1 ON cm1.id = crd1.id_ciudad
							INNER JOIN cmx_tramos_orden cto1 ON cto1.id_tramo = cts1.id
						WHERE 
							cts1.id_solicitud = cs.id
							AND cto1.orden = 1
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
					LEFT JOIN cmx_agrupacion_descarga_costos cadc ON cadc.id_servicio_adicional = csat.id
					INNER JOIN cmx_solicitudes cs ON cs.id = cms.id_solicitud
					INNER JOIN cmx_clientes cc ON cc.id = cs.id_cliente
				WHERE 
					csat.id_servicio != 24
					AND cia.tipo_actividad = "instruccion_factura"
					AND cia.estado = 2
					AND cadc.id_servicio_adicional IS NULL
				HAVING VALOR_COMPRA > 0
			';
		// $return = $this->_db->getConsulta($sql);
		// return $return;
		$return = $this->_db3->prepare($sql);
		$return->execute();
		return $return->fetchAll(PDO::FETCH_ASSOC);
	}

	public function getArchivosCostosProyectos()
	{
		$sql = '
				SELECT 
					DISTINCT(csat.id), 
					caa.id ID_MANIFIESTO, caa.numero_manifiesto,
					cs.id ID_SOLICITUD, cs.numero_solicitud,
					cc.nombre NOMBRE_CLIENTE,
					csat.tipo_servicio, 
					FLOOR( 
						csat.valor_compra / (
							SELECT 
								COUNT( cas1.id_agrupacion) CUANTOS
							FROM 
								cmx_agrupacion_solicitudes cas1
								INNER JOIN cmx_servicio_adicional_tramo csat1 ON csat1.id_solicitud = cas1.id_solicitud
							WHERE 
								cas1.id_agrupacion = cam.id_agrupamiento
								AND csat1.id_servicio != 24
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
					csat.id_servicio != 24
					AND cia.tipo_actividad = "instruccion_factura"
					AND cia.estado = 2
				HAVING VALOR_COMPRA > 0
			';
		$return = $this->_db->getConsulta($sql);

		return $return;
	}
}
