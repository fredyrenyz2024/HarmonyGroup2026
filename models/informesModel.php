<?php
class informesModel extends Model
{

	public function __construct()
	{
		parent::__construct();
	}

	/******** CONSULTAS DE REPORTE DE ACTIVIDADES **********/
	public function getActividadesReporte($id, $grupo)
	{

		$sql = "SELECT COUNT(cim.id) as total 
			FROM cmx_importacion_proyecto cip
			INNER JOIN cmx_importacion_material cim ON cim.id_importacion = cip.id
			WHERE cim.estado = 1 AND cim.id_importacion = :id";

		$result_sql = $this->_db3->prepare($sql);
		$result_sql->bindParam(':id', $id, PDO::PARAM_INT); // Enlazar el parámetro de forma segura
		$result_sql->execute();
		$result = $result_sql->fetch(PDO::FETCH_ASSOC);

		if ($result['total']  > 0) { // Si el proyecto es nacional y reporta materiales
			$_filtro_grupo = "";
			if ($grupo) {
				$_filtro_grupo = " AND cia.grupo = :grupo ";
			}

			$sql = "SELECT cia.*,cip.numero_importacion, cip.id_cliente, cip.tipo_operacion,cim.id_importacion, cia.fecha_hora_inicio,cmo.codigo, cmo.id AS ID_MONEDA,
							(SELECT cp.nombre_perfil FROM cmx_perfiles cp WHERE cp.id = cia.perfil_responsable) AS nom_perfil, 
							(SELECT cp.tipo_perfil FROM cmx_perfiles cp WHERE cp.id = cia.perfil_responsable) AS TIPO_PERFIL, 
							COALESCE((SELECT MAX(ciap.fecha_hora_aplazamiento) FROM cmx_importacion_aplazamientos ciap WHERE ciap.id_actividad = cia.id), 
							cia.fecha_hora_inicio) AS FECHA_HORA_INICIAL
					FROM 	cmx_importacion_proyecto cip
							INNER JOIN cmx_importacion_material cim ON cim.id_importacion = cip.id
							INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cim.id
							INNER JOIN cmx_monedas cmo ON cmo.id = cia.moneda
					WHERE 
							cim.estado = 1
							AND cia.estado IN (1)
							AND cia.id_material IS NOT NULL
							AND cim.id_importacion = :id
							$_filtro_grupo
					GROUP BY cia.nombre, cia.id, cip.numero_importacion, cip.id_cliente, cip.tipo_operacion,
									 cim.id_importacion, cia.fecha_hora_inicio, cmo.codigo, cmo.id
					ORDER BY cia.orden
			";

			$actividades_sql = $this->_db3->prepare($sql);
			$actividades_sql->bindParam(':id', $id, PDO::PARAM_INT);

			if ($grupo) {
				$actividades_sql->bindParam(':grupo', $grupo, PDO::PARAM_INT);
			}

			$actividades_sql->execute();
			$actividades['actividades'] = $actividades_sql->fetchAll(PDO::FETCH_ASSOC);

			if ($actividades['actividades']) {
				foreach ($actividades['actividades'] as $key => $value) {
					if ($value["perfil_responsable"] and $value["tipo_operacion"] and $value["id_cliente"]) {
						if ($value["TIPO_PERFIL"] == "ADMINISTRATIVO") {
							if ($value["perfil_responsable"] == 13) {
								switch ($value["tipo_operacion"]) {
									case 'IMPORTACION':
										$_servicio_contratado = 'Transporte de Carga Internacional';
										break;

									case 'EXPORTACION':
										$_servicio_contratado = 'Transporte de Carga Internacional';
										break;

									case 'NACIONAL':
										$_servicio_contratado = 'Transporte de Carga Nacional';
										break;

									case 'URBANO':
										$_servicio_contratado = 'Transporte de Carga Nacional';
										break;

									case 'NACIONAL_AEREO':
										$_servicio_contratado = 'Transporte de Carga Internacional';
										break;
								}
								if (isset($_servicio_contratado)) {
									$sql = 'SELECT cu.url_avatar, cu.nom_usuario
											FROM cmx_clientes_serv_contratados ccsc
												INNER JOIN cmx_clientes_serv_responsables ccsr ON ccsr.id_serv_contratado = ccsc.id
												INNER JOIN cmx_usuarios cu ON cu.id = ccsr.id_usuario
												INNER JOIN cmx_usuario_cliente cus ON cus.id_usuario = cu.id
											WHERE 
												ccsc.id_cliente = ' . $value["id_cliente"] . '
												AND ccsc.servicio = "' . $_servicio_contratado . '"
												AND ccsr.tipo_ejecutivo = "Ejecutivo Comercial"
												AND cus.id_perfil = ' . $value["perfil_responsable"] . '
												AND ccsr.estado = 1;
										';
									// $result = $this->_db->getConsulta($sql);
									$result = $this->_db3->prepare($sql);
									$result->execute();
									$result = $result->fetchAll(PDO::FETCH_ASSOC);
								}
							} else {
								$sql = 'SELECT cu.url_avatar, cu.nom_usuario
										FROM cmx_usuario_cliente cus
											INNER JOIN cmx_usuarios cu ON cu.id = cus.id_usuario
										WHERE 
											cus.id_perfil = ' . $value["perfil_responsable"] . '
											AND cu.estado = 1
											AND cus.estado = 1;
									';
								$result = $this->_db3->prepare($sql);
								$result->execute();
								$result = $result->fetchAll(PDO::FETCH_ASSOC);
							}
						} else {
							switch ($value["tipo_operacion"]) {
								case 'IMPORTACION':
									$_servicio_contratado = 'Transporte de Carga Internacional';
									break;

								case 'EXPORTACION':
									$_servicio_contratado = 'Transporte de Carga Internacional';
									break;

								case 'NACIONAL':
									$_servicio_contratado = 'Transporte de Carga Nacional';
									break;

								case 'URBANO':
									$_servicio_contratado = 'Transporte de Carga Nacional';
									break;

								case 'NACIONAL_AEREO':
									$_servicio_contratado = 'Transporte de Carga Internacional';
									break;
							}
							if (isset($_servicio_contratado)) {
								$sql = 'SELECT cu.url_avatar, cu.nom_usuario
										FROM cmx_clientes_serv_contratados ccsc
											INNER JOIN cmx_clientes_serv_responsables ccsr ON ccsr.id_serv_contratado = ccsc.id
											INNER JOIN cmx_usuarios cu ON cu.id = ccsr.id_usuario
											INNER JOIN cmx_usuario_cliente cus ON cus.id_usuario = cu.id
										WHERE 
											ccsc.id_cliente = ' . $value["id_cliente"] . '
											AND ccsc.servicio = "' . $_servicio_contratado . '"
											AND ccsr.tipo_ejecutivo = "Ejecutivo Servicio al Cliente"
											AND cus.id_perfil = ' . $value["perfil_responsable"] . '
											AND ccsr.estado = 1;
									';
								$result = $this->_db3->prepare($sql);
								$result->execute();
								$result = $result->fetchAll(PDO::FETCH_ASSOC);
							}
						}

						if ($result) {
							foreach ($result as $key_01 => $value_01) {
								$actividades["responsables"][$value['id']][] = $value_01;
							}
						}
					}
				}
			}
		} else { // Si en el proyecto no se han reportado materiales 
			$sql = 'SELECT cia.*,cip.numero_importacion, cia.fecha_hora_inicio, cip.id_cliente, cip.tipo_operacion,cmo.codigo, cmo.id AS ID_MONEDA,
					(SELECT cp.nombre_perfil FROM cmx_perfiles cp WHERE cp.id = cia.perfil_responsable) AS nom_perfil, 
					(SELECT cp.tipo_perfil FROM cmx_perfiles cp WHERE cp.id = cia.perfil_responsable) AS TIPO_PERFIL, 
					IF ((SELECT COUNT(id) FROM cmx_importacion_aplazamientos ciap WHERE ciap.id_actividad = cia.id) > 0,
							(SELECT MAX(ciap.fecha_hora_aplazamiento) FROM cmx_importacion_aplazamientos ciap WHERE ciap.id_actividad = cia.id),
							cia.fecha_hora_inicio
					) AS FECHA_HORA_INICIAL
				FROM cmx_importacion_proyecto cip
				INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
				INNER JOIN cmx_monedas cmo ON cmo.id = cia.moneda
				WHERE cia.estado IN (1)
				AND cia.id_material IS NULL
				AND cip.id = :id
				GROUP BY cia.nombre
				ORDER BY cia.orden';

			$sql_actividades = $this->_db3->prepare($sql);
			$sql_actividades->bindParam(':id', $id, PDO::PARAM_INT);
			$sql_actividades->execute();
			$actividades["actividades"] = $sql_actividades->fetchAll(PDO::FETCH_ASSOC);

			if ($actividades["actividades"]) {
				foreach ($actividades["actividades"] as $key => $value) {
					if ($value["perfil_responsable"] and $value["tipo_operacion"] and $value["id_cliente"]) {
						if ($value["TIPO_PERFIL"] == "ADMINISTRATIVO") {
							if ($value["perfil_responsable"] == 13) {
								switch ($value["tipo_operacion"]) {
									case 'IMPORTACION':
										$_servicio_contratado = 'Transporte de Carga Internacional';
										break;

									case 'EXPORTACION':
										$_servicio_contratado = 'Transporte de Carga Internacional';
										break;

									case 'NACIONAL':
										$_servicio_contratado = 'Transporte de Carga Nacional';
										break;

									case 'URBANO':
										$_servicio_contratado = 'Transporte de Carga Nacional';
										break;

									case 'NACIONAL_AEREO':
										$_servicio_contratado = 'Transporte de Carga Internacional';
										break;
								}
								if (isset($_servicio_contratado)) {
									$sql = 'SELECT cu.url_avatar, cu.nom_usuario
											FROM cmx_clientes_serv_contratados ccsc
												INNER JOIN cmx_clientes_serv_responsables ccsr ON ccsr.id_serv_contratado = ccsc.id
												INNER JOIN cmx_usuarios cu ON cu.id = ccsr.id_usuario
												INNER JOIN cmx_usuario_cliente cus ON cus.id_usuario = cu.id
											WHERE 
												ccsc.id_cliente = ' . $value["id_cliente"] . '
												AND ccsc.servicio = "' . $_servicio_contratado . '"
												AND ccsr.tipo_ejecutivo = "Ejecutivo Comercial"
												AND cus.id_perfil = ' . $value["perfil_responsable"] . '
												AND ccsr.estado = 1;
										';
									$result = $this->_db3->prepare($sql);
									$result->execute();
									$result = $result->fetchAll(PDO::FETCH_ASSOC);
								}
							} else {
								$sql = 'SELECT cu.url_avatar, cu.nom_usuario
										FROM cmx_usuario_cliente cus
											INNER JOIN cmx_usuarios cu ON cu.id = cus.id_usuario
										WHERE 
											cus.id_perfil = ' . $value["perfil_responsable"] . '
											AND cu.estado = 1
											AND cus.estado = 1;
									';
								$result = $this->_db3->prepare($sql);
								$result->execute();
								$result = $result->fetchAll(PDO::FETCH_ASSOC);
							}
						} else {
							switch ($value["tipo_operacion"]) {
								case 'IMPORTACION':
									$_servicio_contratado = 'Transporte de Carga Internacional';
									break;

								case 'EXPORTACION':
									$_servicio_contratado = 'Transporte de Carga Internacional';
									break;

								case 'NACIONAL':
									$_servicio_contratado = 'Transporte de Carga Nacional';
									break;

								case 'URBANO':
									$_servicio_contratado = 'Transporte de Carga Nacional';
									break;

								case 'NACIONAL_AEREO':
									$_servicio_contratado = 'Transporte de Carga Internacional';
									break;
							}
							if (isset($_servicio_contratado)) {
								$sql = '
										SELECT 
											cu.url_avatar, cu.nom_usuario
										FROM 
											cmx_clientes_serv_contratados ccsc
											INNER JOIN cmx_clientes_serv_responsables ccsr ON ccsr.id_serv_contratado = ccsc.id
											INNER JOIN cmx_usuarios cu ON cu.id = ccsr.id_usuario
											INNER JOIN cmx_usuario_cliente cus ON cus.id_usuario = cu.id
										WHERE 
											ccsc.id_cliente = ' . $value["id_cliente"] . '
											AND ccsc.servicio = "' . $_servicio_contratado . '"
											AND ccsr.tipo_ejecutivo = "Ejecutivo Servicio al Cliente"
											AND cus.id_perfil = ' . $value["perfil_responsable"] . '
											AND ccsr.estado = 1;
									';
								$result = $this->_db3->prepare($sql);
								$result->execute();
								$result = $result->fetchAll(PDO::FETCH_ASSOC);
							}
						}

						if ($result) {
							foreach ($result as $key_01 => $value_01) {
								$actividades["responsables"][$value['id']][] = $value_01;
							}
						}
					}
				}
			}

			// Se busca los materiales del proyecto (para los casos de internacional)
			$sql = 'SELECT citm.*, 
						IF(	citm.id_riesgo IS NOT NULL,
						(	SELECT crm1.numero_riesgo
							FROM cmx_riesgo_material crm1	
							WHERE crm1.id = citm.id_riesgo),
						NULL ) RIESGO,
						IF(	citm.id_riesgo IS NOT NULL,
						(	SELECT crm1.nom_riesgo_material
							FROM cmx_riesgo_material crm1	
							WHERE crm1.id = citm.id_riesgo),
						NULL ) NOM_RIESGO,
						IF(	citm.id_riesgo IS NOT NULL,
						(	SELECT crm1.url
							FROM cmx_riesgo_material crm1	
							WHERE crm1.id = citm.id_riesgo),
						NULL ) URL_RIESGO,
						cit.guia, cis.tipo_transporte,
						(citm.largo * citm.alto * citm.ancho) VOLUMEN,
						(	CASE
							WHEN cis.tipo_transporte = "AÉREO" THEN (citm.largo * citm.alto * citm.ancho) / 5000
							WHEN cis.tipo_transporte = "MARÍTIMO" THEN (citm.largo * citm.alto * citm.ancho) / 1000000
							ELSE CONCAT(citm.largo, " x ", citm.alto, " x ",citm.ancho)
							END
						) PESO_VOLUMETRICO,
						crd.nombre, crd.sigla, crd.direccion,
						cm.municipio, cm.depto, cm.pais
					FROM 
						cmx_importacion_proyecto cip
						INNER JOIN cmx_intr_solicitudes cis ON cis.id_proyecto = cip.id
						INNER JOIN cmx_intr_tramos cit ON cit.id_intr_proyecto = cis.id
						INNER JOIN cmx_intr_tramo_materiales citm ON citm.id_tramo = cit.id
						INNER JOIN cmx_remitente_destinatario crd ON crd.id = cit.id_remitente_destinatario
						INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
					WHERE 
						cis.id_proyecto = ' . $id . '
				';
			$result_sql = $this->_db3->prepare($sql);
			$result_sql->execute();
			$result = $result_sql->fetchAll(PDO::FETCH_ASSOC);

			if ($result) {
				foreach ($result as $key => $value) {
					$actividades["materiales"][$value["id_tramo"]][] = $value;
				}
			}
		}

		// Se busca la información general del cliente 
		$sql = 'SELECT cc.*, cm.municipio, cm.depto, cm.pais, cm.rndc_codigo_ciudad,
							SUM(
								( -- Datos básicos del cliente
									SELECT (COUNT(*) - 11) DATOS_OBLIGATORIOS
									FROM information_schema.columns 
									WHERE table_name = "cmx_clientes" 
								) + ( -- Documentos básicos obligatorios del cliente
									SELECT COUNT(cctd1.id) DOCUMENTOS_OBLIGATORIOS
									FROM cmx_clientes_tipo_documento cctd1
									WHERE cctd1.id IN (4,5,15,17,18,20)
								) + ( -- Cantidad de referencias comerciales del cliente
									IF(
										(	SELECT COUNT(ccd1.id) CANTIDAD_REF_COMERCIALES
											FROM cmx_clientes_documentos ccd1
											WHERE 
												ccd1.id_tipo_documento = 6
												AND ccd1.id_cliente = cc.id
												AND ccd1.estado != "0"
										) > 0,
										(	SELECT COUNT(ccd1.id) CANTIDAD_REF_COMERCIALES
											FROM cmx_clientes_documentos ccd1
											WHERE 
												ccd1.id_tipo_documento = 6
												AND ccd1.id_cliente = cc.id
												AND ccd1.estado != "0"
										), 1
									)
								) + ( -- Cantidad de referencias bancarias del cliente
									IF(
										(	SELECT COUNT(ccb1.id) CANTIDAD_REF_BANCARIAS
											FROM cmx_clientes_bancos ccb1
											WHERE 
												ccb1.id_cliente = cc.id
												AND ccb1.estado = "activo"
										) > 0,
										(	SELECT COUNT(ccb1.id) CANTIDAD_REF_BANCARIAS
											FROM cmx_clientes_bancos ccb1
											WHERE 
												ccb1.id_cliente = cc.id
												AND ccb1.estado = "activo"
										), 1
									)
								) + ( -- Cantidad de documentos del representante legal
									IF(
										(	SELECT ( COUNT(ccm1.id) * 3 ) CANTIDAD_DOC_REP_LEGAL
											FROM cmx_clientes_miembros ccm1
											WHERE 
												ccm1.id_cliente = cc.id
												AND ccm1.tipo_miembro = "Representante Legal"
												AND ccm1.estado = 1
										) > 0,
										(	SELECT ( COUNT(ccm1.id) * 3 ) CANTIDAD_DOC_REP_LEGAL
											FROM cmx_clientes_miembros ccm1
											WHERE 
												ccm1.id_cliente = cc.id
												AND ccm1.tipo_miembro = "Representante Legal"
												AND ccm1.estado = 1
										), 3
									)
								) + ( -- Cantidad de documentos de los socios
									SELECT 
										( COUNT(ccm1.id) * 3 ) CANTIDAD_DOC_SOCIOS
									FROM 
										cmx_clientes_miembros ccm1
									WHERE 
										ccm1.id_cliente = cc.id
										AND ccm1.tipo_miembro = "Socio"
										AND ccm1.estado = 1
								) + ( -- Cantidad de documentos de los servicios contratados
									IF(
										(	SELECT ( COUNT(ccsc1.id) * 3 )
											FROM cmx_clientes_serv_contratados ccsc1
											WHERE 
												ccsc1.id_cliente = cc.id
												AND ccsc1.estado = 1
										) > 0,
										(	SELECT ( COUNT(ccsc1.id) * 3 )
											FROM cmx_clientes_serv_contratados ccsc1
											WHERE 
												ccsc1.id_cliente = cc.id
												AND ccsc1.estado = 1
										), 3
									)
								) 
								+
								( -- Cantidad de responsables de los servicios contratados
									IF(
										(	
											SELECT ( COUNT(ccsc1.id) * 2 )
											FROM cmx_clientes_serv_contratados ccsc1
											WHERE 
												ccsc1.id_cliente = cc.id
												AND ccsc1.estado = 1
										) > 0,
										(	SELECT ( COUNT(ccsc1.id) * 2 )
											FROM cmx_clientes_serv_contratados ccsc1
											WHERE 
												ccsc1.id_cliente = cc.id
												AND ccsc1.estado = 1
										), 2
									)
								) 
							) OBLIGATORIOS,
							SUM(
								-- Datos básicos del cliente
								IF ( -- Campo documento
									(cc.documento) IS NOT NULL, 1, 0
								) + 
								IF ( -- Campo digito_verificacion
									(cc.digito_verificacion) IS NOT NULL, 1, 0
								) + 
								IF ( -- Campo tipo_documento
									(cc.tipo_documento) IS NOT NULL AND (cc.tipo_documento) != ""  , 1, 0
								) + 
								IF ( -- Campo regimen
									(cc.regimen) IS NOT NULL AND (cc.regimen) != ""  , 1, 0
								) + 
								IF ( -- Campo tipo_sociedad
									(cc.tipo_sociedad) IS NOT NULL AND (cc.tipo_sociedad) != ""  , 1, 0
								) + 
								IF ( -- Campo nombre
									(cc.nombre) IS NOT NULL AND (cc.nombre) != ""  , 1, 0
								) + 
								IF ( -- Campo sigla
									(cc.sigla) IS NOT NULL AND (cc.sigla) != ""  , 1, 0
								) + 
								IF ( -- Campo actividad_cliente
									(cc.actividad_cliente) IS NOT NULL AND (cc.actividad_cliente) != ""  , 1, 0
								) + 
								IF ( -- Campo ciudad
									(cc.ciudad) IS NOT NULL, 1, 0
								) + 
								IF ( -- Campo direccion
									(cc.direccion) IS NOT NULL AND (cc.direccion) != ""  , 1, 0
								) + 
								IF ( -- Campo telefono
									(cc.telefono) IS NOT NULL AND (cc.telefono) != ""  , 1, 0
								) + 
								IF ( -- Campo email
									(cc.email) IS NOT NULL AND (cc.email) != ""  , 1, 0
								) + 
								IF ( -- Campo ingreso_neto_mensual
									(cc.ingreso_neto_mensual) IS NOT NULL, 1, 0
								) + 
								IF ( -- Campo pasivos_corrientes
									(cc.pasivos_corrientes) IS NOT NULL, 1, 0
								) + 
								IF ( -- Campo pasivos_no_corrientes
									(cc.pasivos_no_corrientes) IS NOT NULL, 1, 0
								) + 
								IF ( -- Campo capacidad_endeudamiento
									(cc.capacidad_endeudamiento) IS NOT NULL, 1, 0
								) + 
								IF ( -- Campo cupo_credito_base
									(cc.cupo_credito_base) IS NOT NULL, 1, 0
								) + 
								IF ( -- Campo seg_cond_cargue
									(cc.seg_cond_cargue) IS NOT NULL AND (cc.seg_cond_cargue) != ""  , 1, 0
								) + 
								IF ( -- Campo seg_cond_seguridad
									(cc.seg_cond_seguridad) IS NOT NULL AND (cc.seg_cond_seguridad) != ""  , 1, 0
								) + 
								IF ( -- Campo op_cond_planillar
									(cc.op_cond_planillar) IS NOT NULL AND (cc.op_cond_planillar) != ""  , 1, 0
								) + 
								IF ( -- Campo op_cond_cumplir
									(cc.op_cond_cumplir) IS NOT NULL AND (cc.op_cond_cumplir) != ""  , 1, 0
								) + 
								IF ( -- Campo fac_cond_cumplir
									(cc.fac_cond_cumplir) IS NOT NULL AND (cc.fac_cond_cumplir) != ""  , 1, 0
								) + 
								IF ( -- Campo fac_cond_facturar
									(cc.fac_cond_facturar) IS NOT NULL AND (cc.fac_cond_facturar) != ""  , 1, 0
								) + 
								IF ( -- Campo fac_dia_max_facturacion
									(cc.fac_dia_max_facturacion) IS NOT NULL AND (cc.fac_dia_max_facturacion) != ""  , 1, 0
								) + 
								IF ( -- Campo fac_horario_atencion
									(cc.fac_horario_atencion) IS NOT NULL AND (cc.fac_horario_atencion) != ""  , 1, 0
								) + 
								IF ( -- Campo fac_direccion_radicacion
									(cc.fac_direccion_radicacion) IS NOT NULL AND (cc.fac_direccion_radicacion) != ""  , 1, 0
								) + 
								IF ( -- Campo tes_plazo_pagos
									(cc.tes_plazo_pagos) IS NOT NULL, 1, 0
								) + 
								IF ( -- Campo tes_dias_pagos
									(cc.tes_dias_pagos) IS NOT NULL AND (cc.tes_dias_pagos) != ""  , 1, 0
								) + 
								IF ( -- Campo tes_dias_informacion
									(cc.tes_dias_informacion) IS NOT NULL AND (cc.tes_dias_informacion) != ""  , 1, 0
								) + 
								IF ( -- Campo tes_instruccion_pago
									(cc.tes_instruccion_pago) IS NOT NULL AND (cc.tes_instruccion_pago) != ""  , 1, 0
								) 
								+ 
								(	-- Se cuentan los documentos vigentes del cliente menos el rut
									SELECT 
										COUNT(ccd1.id) CANTIDAD
									FROM 
										cmx_clientes_documentos ccd1
										INNER JOIN cmx_clientes_tipo_documento cctd1 ON cctd1.id = ccd1.id_tipo_documento
									WHERE 
										ccd1.id_tipo_documento IN (4,5,15,17,18)
										AND ccd1.id_cliente = cc.id
										AND ccd1.estado != "0"
										AND ( TIMESTAMPDIFF(MONTH,ccd1.fecha_expedicion,CURDATE()) < cctd1.vigencia OR cctd1.vigencia IS NULL )
								) + 	(	-- Se cuentan el rut del cliente
									SELECT 
										COUNT(ccd1.id) CANTIDAD
									FROM 
										cmx_clientes_documentos ccd1
										INNER JOIN cmx_clientes_tipo_documento cctd1 ON cctd1.id = ccd1.id_tipo_documento
										INNER JOIN cmx_clientes_rut ccr1 ON ccr1.id_documento = ccd1.id
									WHERE 
										ccd1.id_tipo_documento IN (20)
										AND ccd1.id_cliente = cc.id
										AND ccd1.estado != "0"
										AND ( TIMESTAMPDIFF(MONTH,ccd1.fecha_expedicion,CURDATE()) < cctd1.vigencia OR cctd1.vigencia IS NULL )
								) + 	(	-- Se cuentan la referencias comerciales
									SELECT 
										COUNT(ccd1.id) CANTIDAD_REF_COMERCIALES
									FROM 
										cmx_clientes_documentos ccd1
										INNER JOIN cmx_clientes_tipo_documento cctd1 ON cctd1.id = ccd1.id_tipo_documento
									WHERE 
										ccd1.id_tipo_documento = 6
										AND ccd1.id_cliente = cc.id
										AND ccd1.estado != "0"
										AND ( TIMESTAMPDIFF(MONTH,ccd1.fecha_expedicion,CURDATE()) < cctd1.vigencia OR cctd1.vigencia IS NULL )
								) + 	(	-- Se cuentan las referencias bancarias
									SELECT COUNT(ccb1.id) CANTIDAD
									FROM cmx_clientes_bancos ccb1
									WHERE 
										ccb1.id_cliente = cc.id
										AND ccb1.estado = "activo"
								) + ( -- Se cuentan los documentos del representante legal
									SELECT 
										COUNT(ccm1.id) CANTIDAD
									FROM 
										cmx_clientes_miembros ccm1
										INNER JOIN cmx_clientes_miembros_documentos ccmd1 ON ccmd1.id_miembro = ccm1.id
										INNER JOIN cmx_clientes_tipo_documento cctd1 ON cctd1.id = ccmd1.id_tipo_documento
									WHERE 
										ccm1.id_cliente = cc.id
										AND ccm1.tipo_miembro = "Representante Legal"
										AND ccm1.estado = 1
										AND ccmd1.estado = 1
										AND ( TIMESTAMPDIFF(MONTH,ccmd1.fecha_expedicion,CURDATE()) < cctd1.vigencia OR cctd1.vigencia IS NULL )
								) + ( -- Se pregunta cuantos socios hay registrados
									SELECT 
										COUNT(ccm1.id) CANTIDAD
									FROM 
										cmx_clientes_miembros ccm1
									WHERE 
										ccm1.id_cliente = cc.id
										AND ccm1.tipo_miembro = "Socio"
										AND ccm1.documento IS NOT NULL 
										AND ccm1.documento != ""
										AND ccm1.nombre_miembro IS NOT NULL 
										AND ccm1.nombre_miembro != ""
										AND ccm1.estado = 1
								) + ( -- Se cuentan los documentos de los socios
									SELECT 
										COUNT(ccm1.id) CANTIDAD
									FROM 
										cmx_clientes_miembros ccm1
										INNER JOIN cmx_clientes_miembros_documentos ccmd1 ON ccmd1.id_miembro = ccm1.id
										INNER JOIN cmx_clientes_tipo_documento cctd1 ON cctd1.id = ccmd1.id_tipo_documento
									WHERE 
										ccm1.id_cliente = cc.id
										AND ccm1.tipo_miembro = "Socio"
										AND ccm1.estado = 1
										AND ccmd1.estado = 1
										AND ( TIMESTAMPDIFF(MONTH,ccmd1.fecha_expedicion,CURDATE()) < cctd1.vigencia OR cctd1.vigencia IS NULL )
								) + ( -- Cantidad de documentos de los servicios contratados
									SELECT 
										COUNT(DISTINCT(ccd1.id)) CANTIDAD
									FROM 
										cmx_clientes_documentos ccd1
										INNER JOIN cmx_clientes_tipo_documento cctd1 ON cctd1.id = ccd1.id_tipo_documento
										INNER JOIN cmx_clientes_serv_contratados ccsc1 ON ccsc1.id_cliente = ccd1.id_cliente
									WHERE 
										ccd1.id_tipo_documento IN (12,13,14,23,24,25,26,27,28,29,30,31)
										AND ccd1.id_cliente = cc.id
										AND ccd1.estado != "0"
										AND ( TIMESTAMPDIFF(MONTH,ccd1.fecha_expedicion,CURDATE()) < cctd1.vigencia OR cctd1.vigencia IS NULL )
								) + ( -- Cantidad de responsables de los servicios contratados
									SELECT 
									COUNT(ccsc1.id)
									FROM 
										cmx_clientes_serv_contratados ccsc1
										INNER JOIN cmx_clientes_serv_responsables ccsr1 ON ccsr1.id_serv_contratado = ccsc1.id
									WHERE 
										ccsc1.id_cliente = cc.id
										AND ccsc1.estado = 1
										AND ccsr1.estado = 1
								)
							) REGISTRADOS
						FROM 
							cmx_importacion_proyecto cip
							INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
							INNER JOIN cmx_municipios cm ON cm.id = cc.ciudad
						WHERE 
							cip.id = ' . $id . '
					';
		// $actividades["cliente"] = $this->_db->getConsulta($sql);
		$sql_actividades = $this->_db3->prepare($sql);
		$sql_actividades->execute();
		$actividades["cliente"] = $sql_actividades->fetchAll(PDO::FETCH_ASSOC);

		// Información general del proyecto
		$sql = 'SELECT 
				cia.id_importacion, 
				cip.numero_importacion, 
				cip.importacion, 
				cip.tipo_operacion, 
				cip.contenedor, 
				cip.id_contrato,
				cia.fecha_creacion, 
				cia.grupo,
				ctc.nombre AS TIPO_CARGA,
				cc.nombre AS CLIENTE,
				IF (cip.id_contrato IS NOT NULL,
						(SELECT ccc1.cod_contrato
						 FROM cmx_contrato_cliente ccc1
						 WHERE ccc1.id = cip.id_contrato
						 LIMIT 1),
						NULL
				) AS CONTRATO,
				IF (cip.id_origen IS NOT NULL,
						(SELECT crd1.nombre
						 FROM cmx_remitente_destinatario crd1
						 WHERE crd1.id = cip.id_origen
						 LIMIT 1),
						NULL
				) AS PUERTO,
				IF( 
						(cip.tipo_operacion = "EXPORTACION") OR (cip.tipo_operacion = "IMPORTACION"),
						IF(
								(SELECT ccr1.actividad_aduanera
								 FROM cmx_clientes_documentos ccd1 
								 INNER JOIN cmx_clientes_rut ccr1 ON ccr1.id_documento = ccd1.id
								 WHERE ccd1.id_cliente = cc.id AND ccd1.estado != "0"
								 LIMIT 1),
								"BIEN",
								NULL
						),
						"BIEN"
				) AS ADUANERO,
				IF ((SELECT cis1.id
						 FROM cmx_intr_solicitudes cis1
						 WHERE cis1.id_proyecto = cip.id
						 LIMIT 1),
						true,
						false
				) AS FLAG_INTERNACIONAL,
				IF ((SELECT cis1.id
						 FROM cmx_intr_solicitudes cis1
						 WHERE cis1.id_proyecto = cip.id
						 LIMIT 1),
						(
								SELECT CONCAT("(", cii1.sigla, ") ", cii1.nombre) AS INCOTERM
								FROM cmx_intr_solicitudes cis1
								INNER JOIN cmx_intr_incoterms cii1 ON cii1.sigla = cis1.incoterm
								WHERE cis1.id_proyecto = cip.id
								LIMIT 1
						),
						NULL
				) AS INCOTERM,
				IF ((SELECT cis1.id
						 FROM cmx_intr_solicitudes cis1
						 WHERE cis1.id_proyecto = cip.id
						 LIMIT 1),
						(
								SELECT cis1.tipo_transporte AS TIPO_TRANSPORTE
								FROM cmx_intr_solicitudes cis1
								WHERE cis1.id_proyecto = cip.id
								LIMIT 1
						),
						NULL
				) AS TIPO_TRANSPORTE
		FROM 
				cmx_importacion_proyecto cip
				INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
				INNER JOIN cmx_tipo_carga ctc ON ctc.id = cip.id_tipo_carga
				INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
		WHERE 
				cip.estado = 1
				AND cip.id = :id
				AND cia.grupo = :grupo
		';

		// Preparar y ejecutar la consulta
		$result = $this->_db3->prepare($sql);
		$result->bindValue(':id', $id, PDO::PARAM_INT);
		$result->bindValue(':grupo', $grupo, PDO::PARAM_INT);
		$result->execute();
		$result = $result->fetchAll(PDO::FETCH_ASSOC);
		$actividades["proyecto"] = $result;

		// Información de los proveedores de las cotizaciones aprobadas
		$sql = 'SELECT DISTINCT cico.id_proveedor, cico.proveedor, cis.id ID_INTR_PROYECTO,
							(SELECT COUNT(cico1.id_proveedor) CUANTOS
								FROM 
									cmx_intr_cotizaciones cico1
								WHERE 
									cico1.estado = 1
									AND cico1.id_concepto != 11
									AND cico1.sobrecosto = "0"
									AND cico1.id_proveedor = cico.id_proveedor
									AND cico1.id_intr_proyecto = cico.id_intr_proyecto
							) CUANTOS
						FROM cmx_intr_cotizaciones cico 
							INNER JOIN cmx_intr_solicitudes cis ON cis.id = cico.id_intr_proyecto
							INNER JOIN cmx_importacion_proyecto cip ON cip.id = cis.id_proyecto
							INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
						WHERE 
							cico.estado = 1
							AND cico.id_concepto != 11
							AND cip.id = ' . $id . '
							AND cia.grupo = ' . $grupo . '
						GROUP BY cico.id_proveedor
					';
		$sql_proveedores = $this->_db3->prepare($sql);
		$sql_proveedores->execute();
		$sql_proveedores = $sql_proveedores->fetchAll(PDO::FETCH_ASSOC);
		$proveedores["proveedores"] = $sql_proveedores;

		// Se buscan las cotizaciones del proveedor 
		if ($proveedores["proveedores"]) {
			$arrayCotizaciones = [];
			$arrayFacturas = [];
			foreach ($proveedores["proveedores"] as $key => $value) {
				// Se busca las cotizaciones realizadas en el proyecto del concepto
				$sql = 'SELECT cico.*,
									IF( cico.id_moneda = 2,
										cico.valor,
										IF(	(	SELECT cmt1.valor
												FROM cmx_monedas_trm cmt1
												WHERE cmt1.id_moneda = cico.id_moneda
													AND cmt1.fecha = cico.fecha_cotizacion
											),
											(	SELECT cmt1.valor
												FROM cmx_monedas_trm cmt1
												WHERE cmt1.id_moneda = cico.id_moneda
													AND cmt1.fecha = cico.fecha_cotizacion
											) * cico.valor,
											NULL
										)
									) VALOR_PESOS,
									IF ( cico.id_moneda = 1,
										cico.valor,
										IF ( cico.id_moneda = 2,
											IF ((	SELECT cmt1.valor
													FROM cmx_monedas_trm cmt1
													WHERE cmt1.id_moneda = 1
														AND cmt1.fecha = cico.fecha_cotizacion
												),
												cico.valor / (
													SELECT cmt1.valor
													FROM cmx_monedas_trm cmt1
													WHERE cmt1.id_moneda = 1
														AND cmt1.fecha = cico.fecha_cotizacion
												),
												NULL
											),
											IF(	(	SELECT cmt1.valor
													FROM cmx_monedas_trm cmt1
													WHERE cmt1.id_moneda = cico.id_moneda
														AND cmt1.fecha = cico.fecha_cotizacion
												),
												(	(	SELECT cmt1.valor
														FROM cmx_monedas_trm cmt1
														WHERE cmt1.id_moneda = cico.id_moneda
															AND cmt1.fecha = cico.fecha_cotizacion
													) * cico.valor
												) / (	SELECT cmt1.valor
														FROM cmx_monedas_trm cmt1
														WHERE cmt1.id_moneda = 1
															AND cmt1.fecha = cico.fecha_cotizacion
												),
												NULL
											)
										)
									) VALOR_USD,
									cm.nom_moneda, cm.codigo, cic.nombre CONCEPTO, cic.descripcion DESCRIPCION_CONCEPTO
								FROM 
									cmx_intr_cotizaciones cico
									INNER JOIN cmx_monedas cm ON cm.id = cico.id_moneda
									INNER JOIN cmx_intr_conceptos cic ON cic.id = cico.id_concepto
								WHERE 
									cic.id != 11
									AND cico.id_intr_proyecto = ' . $value["ID_INTR_PROYECTO"] . '
									AND cico.id_proveedor = ' . $value['id_proveedor'] . '
									AND cico.estado = 1
								ORDER BY cico.id_factura
							';
				$cotizaciones = $this->_db3->prepare($sql);
				$cotizaciones->execute();
				$cotizaciones = $cotizaciones->fetchAll(PDO::FETCH_ASSOC);

				if ($cotizaciones) {
					$arrayCotizaciones[$value['id_proveedor']] = $cotizaciones;
				}

				$sql = 'SELECT DISTINCT(cif.id), cif.*, cico.id_intr_proyecto, cico.id_proveedor, cm.nom_moneda, cm.codigo, 
										IF( cif.id_moneda = 2, cif.valor, 
										IF( ( SELECT cmt1.valor FROM cmx_monedas_trm cmt1 
										WHERE cmt1.id_moneda = cif.id_moneda AND cmt1.fecha = cif.fecha_factura ), 
										( SELECT cmt1.valor FROM cmx_monedas_trm cmt1 WHERE cmt1.id_moneda = cif.id_moneda AND cmt1.fecha = cif.fecha_factura ) * cif.valor, NULL ) ) 
										VALOR_PESOS, IF ( cif.id_moneda = 1, cif.valor, IF ( cif.id_moneda = 2, 
										IF (( SELECT cmt1.valor FROM cmx_monedas_trm cmt1 WHERE cmt1.id_moneda = 1 AND cmt1.fecha = cif.fecha_factura ), cif.valor / 
										( SELECT cmt1.valor FROM cmx_monedas_trm cmt1 WHERE cmt1.id_moneda = 1 AND cmt1.fecha = cif.fecha_factura ), NULL ), 
										IF( ( SELECT cmt1.valor FROM cmx_monedas_trm cmt1 WHERE cmt1.id_moneda = cif.id_moneda AND cmt1.fecha = cif.fecha_factura ), 
										( ( SELECT cmt1.valor FROM cmx_monedas_trm cmt1 WHERE cmt1.id_moneda = cif.id_moneda AND cmt1.fecha = cif.fecha_factura ) * cif.valor ) / 
										( SELECT cmt1.valor FROM cmx_monedas_trm cmt1 WHERE cmt1.id_moneda = 1 AND cmt1.fecha = cif.fecha_factura ), NULL ) ) ) 
										VALOR_USD,iegp.url_egreso
										FROM cmx_intr_cotizaciones cico 
										INNER JOIN cmx_intr_facturas cif ON cif.id = cico.id_factura 
										INNER JOIN cmx_monedas cm ON cm.id = cif.id_moneda 
										LEFT JOIN cmx_intr_egresos ieg
										ON id_egreso=ieg.id 
										LEFT JOIN cmx_intr_egresos_pagos iegp
										ON ieg.id_pago=iegp.id
								WHERE 
								cico.id_intr_proyecto = ' . $value["ID_INTR_PROYECTO"] . '
									AND cico.id_proveedor = ' . $value['id_proveedor'] . '
									AND cico.id_concepto != 11
							';

				$facturas = $this->_db3->prepare($sql);
				$facturas->execute();
				$facturas = $facturas->fetchAll(PDO::FETCH_ASSOC);

				if ($facturas) {
					$arrayFacturas[$value['id_proveedor']] = $facturas;
				}
			}
			$actividades["proveedor_cotizaciones"] = $arrayCotizaciones;
			$actividades["proveedor_facturas"] = $arrayFacturas;
		}

		// Se busca si existen impuestos creados
		$sql = 'SELECT cif.*, cm.nom_moneda, cm.codigo, cico.id_proveedor, cico.descripcion, cp.abreviatura, cic.nombre
						FROM cmx_intr_cotizaciones cico
							INNER JOIN cmx_intr_facturas cif ON cif.id = cico.id_factura
							INNER JOIN cmx_monedas cm ON cm.id = cif.id_moneda
							INNER JOIN cmx_proveedores cp ON cp.id = cico.id_proveedor
							INNER JOIN cmx_intr_conceptos cic ON cic.id = cico.id_concepto
							INNER JOIN cmx_intr_solicitudes cis ON cis.id = cico.id_intr_proyecto
							INNER JOIN cmx_importacion_proyecto cip ON cip.id = cis.id_proyecto
							INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
						WHERE 
							cico.id_concepto = 11
							AND cip.id = ' . $id . '
							AND cia.grupo = ' . $grupo . '
					';
		// $impuestos = $this->_db->getConsulta($sql);
		$impuestos = $this->_db3->prepare($sql);
		$impuestos->execute();
		$impuestos = $impuestos->fetchAll(PDO::FETCH_ASSOC);

		if ($impuestos) {
			foreach ($impuestos as $key => $value) {
				$actividades["impuestos"][] = $value;
			}
		}

		// Se buscan las ofertas comerciales presentadas
		$sql = 'SELECT cioc.*, CONCAT(cm.nom_moneda," (",cm.codigo,")") MONEDA,
							cis.estado ESTADO_SOLICITUD,
							IF ( (	SELECT cia1.estado
										FROM cmx_importacion_actividades cia1
										WHERE cia1.estado
											AND cia1.id_importacion = cis.id_proyecto
											AND cia1.tipo_actividad = "intr_oferta_comercial"
								) = 1,
								(	SELECT cia1.fecha_hora_finalizacion
										FROM cmx_importacion_actividades cia1
										WHERE cia1.estado
											AND cia1.id_importacion = cis.id_proyecto
											AND cia1.tipo_actividad = "intr_oferta_comercial"
								),
								NULL
							) APROBADO
						FROM 
							cmx_intr_oferta_comercial cioc
							INNER JOIN cmx_intr_solicitudes cis ON cis.id = cioc.id_intr_proyecto
							INNER JOIN cmx_monedas cm ON cm.id = cioc.id_moneda
						WHERE 
							cis.id_proyecto = ' . $id . '
					';

		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetchAll(PDO::FETCH_ASSOC);
		$actividades["oferta_comercial"] = $result;

		$sql = 'SELECT cico.*, CONCAT(cm.nom_moneda," (",cm.codigo,")") MONEDA, cic.nombre,cic.descripcion,
							IF( cico.id_moneda = 2,
								cico.valor,
								IF(	(	SELECT cmt1.valor
										FROM cmx_monedas_trm cmt1
										WHERE cmt1.id_moneda = cico.id_moneda
											AND cmt1.fecha = cico.fecha_cotizacion
									),
									(	SELECT cmt1.valor
										FROM cmx_monedas_trm cmt1
										WHERE cmt1.id_moneda = cico.id_moneda
											AND cmt1.fecha = cico.fecha_cotizacion
									) * cico.valor,
									NULL
								)
							) VALOR_PESOS,
							IF ( cico.id_moneda = 1,
								cico.valor,
								IF ( cico.id_moneda = 2,
									IF ((	SELECT cmt1.valor
											FROM cmx_monedas_trm cmt1
											WHERE cmt1.id_moneda = 1
												AND cmt1.fecha = cico.fecha_cotizacion
										),
										cico.valor / (
											SELECT cmt1.valor
											FROM cmx_monedas_trm cmt1
											WHERE cmt1.id_moneda = 1
												AND cmt1.fecha = cico.fecha_cotizacion
										),
										NULL
									),
									IF(	(	SELECT cmt1.valor
											FROM cmx_monedas_trm cmt1
											WHERE cmt1.id_moneda = cico.id_moneda
												AND cmt1.fecha = cico.fecha_cotizacion
										),
										(	(	SELECT cmt1.valor
												FROM cmx_monedas_trm cmt1
												WHERE cmt1.id_moneda = cico.id_moneda
													AND cmt1.fecha = cico.fecha_cotizacion
											) * cico.valor
										) / (	SELECT cmt1.valor
												FROM cmx_monedas_trm cmt1
												WHERE cmt1.id_moneda = 1
													AND cmt1.fecha = cico.fecha_cotizacion
										),
										NULL
									)
								)
							) VALOR_USD
						FROM 
							cmx_intr_solicitudes cis
							INNER JOIN cmx_intr_cotizaciones cico ON cico.id_intr_proyecto = cis.id
							INNER JOIN cmx_monedas cm ON cm.id = cico.id_moneda
							INNER JOIN cmx_intr_conceptos cic ON cic.id = cico.id_concepto
						WHERE 
							cis.id_proyecto = ' . $id . '
						ORDER BY cico.estado DESC, cico.fecha_cotizacion DESC
					';

		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetchAll(PDO::FETCH_ASSOC);
		$actividades["cotizaciones"] = $result;

		return $actividades;
	}

	public function getOfertaComercialLista($cotizaciones)
	{
		$array = [];
		foreach ($cotizaciones as $key => $value) {
			if (!isset($array[$value["estado"]][$value["id_proveedor"]][$value["id_moneda"]])) {
				$array[$value["estado"]][$value["id_proveedor"]][$value["id_moneda"]] = true;
				$array[$value["estado"]][$value["id_proveedor"]]["PROVEEDOR"] = $value["proveedor"];

				$array[$value["estado"]][$value["id_proveedor"]]["TOTAL"][$value["id_moneda"]]["cuantos"] = 1;
				$array[$value["estado"]][$value["id_proveedor"]]["TOTAL"][$value["id_moneda"]]["MONEDA"] = $value["MONEDA"];
				$array[$value["estado"]][$value["id_proveedor"]]["TOTAL"][$value["id_moneda"]]["total_cotizacion"] = (float)$value["valor"];
				// Se valida el valor en pesos 
				$array[$value["estado"]][$value["id_proveedor"]]["TOTAL"][$value["id_moneda"]]["SUMA_VALOR_PESOS"] = $value["VALOR_PESOS"];
				if (!$value["VALOR_PESOS"]) {
					$array[$value["estado"]][$value["id_proveedor"]]["TOTAL"][$value["id_moneda"]]["SUMA_VALOR_PESOS"] = NULL;
				}

				// Se valida el valor en USD
				$array[$value["estado"]][$value["id_proveedor"]]["TOTAL"][$value["id_moneda"]]["SUMA_VALOR_USD"] = $value["VALOR_USD"];
				if (!$value["VALOR_USD"]) {
					$array[$value["estado"]][$value["id_proveedor"]]["TOTAL"][$value["id_moneda"]]["SUMA_VALOR_USD"] = NULL;
				}

				$array[$value["estado"]][$value["id_proveedor"]]["cotizacion"][] = $value;
			} else {
				$array[$value["estado"]][$value["id_proveedor"]]["TOTAL"][$value["id_moneda"]]["cuantos"]++;
				$array[$value["estado"]][$value["id_proveedor"]]["TOTAL"][$value["id_moneda"]]["total_cotizacion"] += (float)$value["valor"];

				// Se valida el valor en pesos 
				if ($value["VALOR_PESOS"] and $array[$value["estado"]][$value["id_proveedor"]]["TOTAL"][$value["id_moneda"]]["SUMA_VALOR_PESOS"]) {
					$array[$value["estado"]][$value["id_proveedor"]]["TOTAL"][$value["id_moneda"]]["SUMA_VALOR_PESOS"] += $value["VALOR_PESOS"];
				} else {
					$array[$value["estado"]][$value["id_proveedor"]]["TOTAL"][$value["id_moneda"]]["SUMA_VALOR_PESOS"] = NULL;
				}

				// Se valida el valor en USD
				if ($value["VALOR_USD"] and $array[$value["estado"]][$value["id_proveedor"]]["TOTAL"][$value["id_moneda"]]["SUMA_VALOR_USD"]) {
					$array[$value["estado"]][$value["id_proveedor"]]["TOTAL"][$value["id_moneda"]]["SUMA_VALOR_USD"] += $value["VALOR_USD"];
				} else {
					$array[$value["estado"]][$value["id_proveedor"]]["TOTAL"][$value["id_moneda"]]["SUMA_VALOR_USD"] = NULL;
				}

				$array[$value["estado"]][$value["id_proveedor"]]["cotizacion"][] = $value;
			}
		}
		return $array;
	}


	public function getIntrTramosContrato($id)
	{
		$sql = '
				SELECT 
					cct.id, cct.id_ciudad, cct.tipo_tramo, CONCAT(cm.municipio," (",cm.depto," - ",cm.pais,")") MUNICIPIO
				FROM 
					cmx_contrato_tramos cct
					INNER JOIN cmx_municipios cm ON cm.id = cct.id_ciudad
				WHERE 
					cct.id_contrato = ' . $id . '
			';
		$request = $this->_db3->prepare($sql);
		$request->execute();
		$request = $request->fetchAll(PDO::FETCH_ASSOC);
		return $request;
	}

	public function getIntrTramosProyecto($id)
	{
		$sql = '
				SELECT
					cit.tipo_tramo, crd.sigla, CONCAT(cm.municipio," (",cm.depto," - ",cm.pais,")") MUNICIPIO
				FROM 
					cmx_importacion_proyecto cip
					INNER JOIN cmx_intr_solicitudes cis ON cis.id_proyecto = cip.id
					INNER JOIN cmx_intr_tramos cit ON cit.id_intr_proyecto = cis.id
					INNER JOIN cmx_remitente_destinatario crd ON crd.id = cit.id_remitente_destinatario
					INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
				WHERE 
					cip.id = ' . $id . '
			';
		$request = $this->_db3->prepare($sql);
		$request->execute();
		$request = $request->fetchAll(PDO::FETCH_ASSOC);
		return $request;
	}
	/******** FIN CONSULTAS DE REPORTE DE ACTIVIDADES **********/

	/******** CONSULTAS DE REPORTE DE CARGUE DE MATERIAL **********/
	public function getSeguimientoCargueActividad($id_actividad)
	{
		$arrayId_actividad = explode(",", $id_actividad);
		$sql = "
				SELECT 
					cisc.*,
					cu.nom_usuario, cu.url_avatar
				FROM 
					cmx_importacion_seguimiento_cargue cisc
					INNER JOIN cmx_usuarios cu ON cu.id = cisc.autor
				WHERE 
					cisc.id_actividad = " . $arrayId_actividad[0] . "
					AND cisc.estado = 1
				ORDER BY cisc.fecha_hora DESC;
			";
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetchAll(PDO::FETCH_ASSOC);
		return $result;
	}
	/******** FIN CONSULTAS DE REPORTE DE CARGUE DE MATERIAL **********/


	/******** CONSULTAS DE REPORTE DE VERIFICACION DE MATERIAL **********/
	public function getDetalleVerificacionMaterial($id_actividad, $id_cliente)
	{
		$_filtro_cliente = "";
		if ($id_cliente != 1) {
			$_filtro_cliente = ' AND cip.id_cliente =  ' . $id_cliente . ' ';
		}
		$sql = '
				SELECT 
					cia.*, cia.estado, cip.importacion, cip.numero_importacion, cip.tipo_operacion, cc.nombre CLIENTE, 
					crd.nombre NOMBRE_ORIGEN, CONCAT(cm.municipio," (",cm.depto," - ",cm.pais,")") CIUDAD_ORIGEN, 
					cas.id_solicitud, cas.id_agrupacion,
					( 
						SELECT 
							SUM(cam1.peso)
						FROM 
							cmx_agrupacion_material cam1 
						WHERE 
							cam1.id_agrupamiento = cam.id_agrupamiento 
					) PESO, 
					( 
						SELECT
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
					) CANTIDAD_MATERIALES 
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
					AND cto.orden = 1
					AND cia.id = ' . $id_actividad . '
					' . $_filtro_cliente . '
					AND cia.estado != 3
					AND cia.id_material IS NOT NULL
			';
		$sql_result = $this->_db3->prepare($sql);
		$sql_result->execute();
		$result["seguimiento"] = $sql_result->fetchAll(PDO::FETCH_ASSOC);

		if ($result["seguimiento"]) {
			foreach ($result["seguimiento"] as $key => $value) {
				// Se busca los materiales del proyecto
				$sql = '
						SELECT 
							cim.*, 
							IF(
								( SELECT COUNT(ciom.id) FROM cmx_importacion_obsevacion_material ciom WHERE ciom.id = cim.id ) > 0 , 
								( SELECT ciom.observacion FROM cmx_importacion_obsevacion_material ciom WHERE ciom.id = cim.id ), 
								"N/A" 
							) OBSERVACIONES 
						FROM 
							cmx_importacion_material cim 
							INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cim.id_importacion 
							INNER JOIN cmx_agrupacion_material cam ON cam.id_material_proyecto = cim.id
							INNER JOIN cmx_agrupacion_solicitudes cas ON cas.id_agrupacion = cam.id_agrupamiento
						WHERE 
							cia.id = ' . $value['id'] . '
							AND cas.id_solicitud = ' . $value["id_solicitud"] . '
							AND cas.id_agrupacion = ' . $value["id_agrupacion"] . '
					;';
				// echo "<pre>" . $sql . "</pre>";
				// $result["seguimiento_material"][$value['id']] = $this->_db->getConsulta($sql);
				$result = $this->_db3->prepare($sql);
				$result->execute();
				$result["seguimiento_material"][$value['id']] = $result->fetchAll(PDO::FETCH_ASSOC);

				// Se buscan las imágenes del seguimiento de carga
				$sql = '
						SELECT 
							ciia.*
						FROM 
							cmx_importacion_imagen_actividad ciia
						WHERE 
							ciia.id_actividad = ' . $value['id'] . '
					;';
				// echo "<pre>" . $sql . "</pre>";
				// $result["seguimiento_imagenes"][$value[0]] = $this->_db->getConsulta($sql);
				$result = $this->_db3->prepare($sql);
				$result->execute();
				$result["seguimiento_imagenes"][$value['id']] = $result->fetchAll(PDO::FETCH_ASSOC);
			}
		}

		return $result;
	}
	/******** FIN CONSULTAS DE REPORTE DE VERIFICACION DE MATERIAL **********/


	/******** CONSULTAS DE REPORTE DE RUTAS **********/
	public function getSeguimientoRutaActividad($id_actividad)
	{
		$arrayId_actividad = explode(",", $id_actividad);
		$sql = "
				SELECT 
					cisr.*,
					cu.nom_usuario, cu.url_avatar
				FROM 
					cmx_importacion_seguimiento_rutas cisr
					INNER JOIN cmx_usuarios cu ON cu.id = cisr.autor
				WHERE 
					cisr.id_actividad = " . $arrayId_actividad[0] . "
					AND cisr.estado = 1
				ORDER BY cisr.fecha_hora DESC;
			";
		// echo "<pre>" . $sql . "</pre>";
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$return["seguimientos"] = $result->fetchAll(PDO::FETCH_ASSOC);
		// $return["seguimientos"] = $result;

		$sql = '
				SELECT
					SUM(cmrc.tiempo_estimado)
				FROM 
					cmx_importacion_actividades cia
					INNER JOIN cmx_mercancia_solicitud cms ON cms.id_material_proyecto = cia.id_material
					INNER JOIN cmx_agrupacion_solicitudes cas ON cas.id_solicitud = cms.id_solicitud
					INNER JOIN cmx_agrupaciones ca ON ca.id = cas.id_agrupacion
					INNER JOIN cmx_mapas_ruta cmr ON cmr.id = ca.id_mapa_ruta
					INNER JOIN cmx_mapas_ruta_control cmrc ON cmrc.id_mapa_ruta = cmr.id
				WHERE 
					cia.id = ' . $arrayId_actividad[0] . '
			';
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetchAll(PDO::FETCH_ASSOC);
		$return["tiempo_ruta"] = $result[0];

		return $return;
	}

	public function getRemitente($id_actividad)
	{
		$arrayId_actividad = explode(",", $id_actividad);
		$sql = '
				SELECT 
					crd.nombre,
					crd.latitud, crd.longitud,
					CONCAT(cm.municipio," (",cm.depto," - ",cm.pais,")") UBICACION,
					cia.fecha_hora_inicio, MIN(cto.orden) ORDEN_TRAMO
				FROM 
					cmx_importacion_actividades cia
					INNER JOIN cmx_importacion_material cim ON cim.id = cia.id_material
					INNER JOIN cmx_mercancia_solicitud cms ON cms.id_material_proyecto = cim.id
					INNER JOIN cmx_tramo_solicitud cts ON cts.id_solicitud = cms.id_solicitud
					INNER JOIN cmx_tramos_orden cto ON cto.id_tramo = cts.id
					INNER JOIN cmx_remitente_destinatario crd ON crd.id = cts.id_remitente_destinatario
					INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
				WHERE
					cts.tipo_operacion = "Cargue"
					AND cia.id = ' . $arrayId_actividad[0] . ';
			';
		// echo "<pre>" . $sql . "</pre>";
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetchAll(PDO::FETCH_ASSOC);
		return $result;
	}
	/******** FIN CONSULTAS DE REPORTE DE RUTAS **********/

	/******** CONSULTAS DE REPORTE DE DESCARGUE DE MATERIAL **********/
	public function getSeguimientoDescargueActividad($id_actividad)
	{
		$arrayId_actividad = explode(",", $id_actividad);
		$sql = "
				SELECT 
					cisd.*,
					cu.nom_usuario, cu.url_avatar
				FROM 
					cmx_importacion_seguimiento_descargue cisd
					INNER JOIN cmx_usuarios cu ON cu.id = cisd.autor
				WHERE 
					cisd.id_actividad = " . $arrayId_actividad[0] . "
					AND cisd.estado = 1
				ORDER BY cisd.fecha_hora DESC;
			";
		// echo "<pre>" . $sql . "</pre>";
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetchAll(PDO::FETCH_ASSOC);
		return $result;
	}
	/******** FIN CONSULTAS DE REPORTE DE DESCARGUE DE MATERIAL **********/

	/******** CONSULTAS DE REPORTE DE SEGUIMIENTOS A CLIENTES **********/
	public function getSeguimientosClienteReporte($id, $grupo)
	{
		$sql = "
				SELECT 
					COUNT(cim.id)
				FROM 
					cmx_importacion_proyecto cip
					INNER JOIN cmx_importacion_material cim ON cim.id_importacion = cip.id
				WHERE 
					cim.estado = 1
					AND cim.id_importacion = " . $id . "
			";
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetch(PDO::FETCH_ASSOC);


		if ($result > 0) { // Si el proyecto es nacional y reporta materiales
			$_filtro_grupo = "";
			if ($grupo) {
				$_filtro_grupo = ' AND cia.grupo = ' . $grupo . ' ';
			}
			$sql = "
					SELECT 
						cia.*,
						cip.numero_importacion, cip.id_cliente, cip.tipo_operacion,
						cim.id_importacion, cia.fecha_hora_inicio,
						cmo.codigo,cmo.id ID_MONEDA,
						(SELECT 
							cp.nombre_perfil
						FROM 
							cmx_perfiles cp
						WHERE 
							cp.id = cia.perfil_responsable) nom_perfil, 
						(SELECT 
							cp.tipo_perfil
						FROM 
							cmx_perfiles cp
						WHERE 
							cp.id = cia.perfil_responsable) TIPO_PERFIL, 
						IF ((SELECT COUNT('id') FROM cmx_importacion_aplazamientos ciap WHERE ciap.id_actividad = cia.id) > 0,
						(SELECT MAX(ciap.fecha_hora_aplazamiento) FROM cmx_importacion_aplazamientos ciap WHERE ciap.id_actividad = cia.id),
						cia.fecha_hora_inicio) FECHA_HORA_INICIAL
					FROM 
						cmx_importacion_proyecto cip
						INNER JOIN cmx_importacion_material cim ON cim.id_importacion = cip.id
						INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cim.id
						INNER JOIN cmx_monedas cmo ON cmo.id = cia.moneda
					WHERE 
						cim.estado = 1
						AND cia.estado IN (1)
						AND cia.id_material IS NOT NULL
						AND cim.id_importacion = " . $id . "
						" . $_filtro_grupo . "
						GROUP BY cia.nombre
						ORDER BY cia.orden
				";
			// $actividades = $this->_db->getConsulta($sql);
			$sql_actividades = $this->_db3->prepare($sql);
			$sql_actividades->execute();
			$actividades["actividades"] = $sql_actividades->fetchAll(PDO::FETCH_ASSOC);
			if ($actividades) {
				foreach ($actividades["actividades"] as $key => $value) {
					if ($value["perfil_responsable"] and $value["tipo_operacion"] and $value["id_cliente"]) {
						if ($value["TIPO_PERFIL"] == "ADMINISTRATIVO") {
							if ($value["perfil_responsable"] == 13) {
								switch ($value["tipo_operacion"]) {
									case 'IMPORTACION':
										$_servicio_contratado = 'Transporte de Carga Internacional';
										break;

									case 'EXPORTACION':
										$_servicio_contratado = 'Transporte de Carga Internacional';
										break;

									case 'NACIONAL':
										$_servicio_contratado = 'Transporte de Carga Nacional';
										break;

									case 'URBANO':
										$_servicio_contratado = 'Transporte de Carga Nacional';
										break;

									case 'NACIONAL_AEREO':
										$_servicio_contratado = 'Transporte de Carga Internacional';
										break;
								}
								if (isset($_servicio_contratado)) {
									$sql = '
											SELECT 
												cu.url_avatar, cu.nom_usuario
											FROM 
												cmx_clientes_serv_contratados ccsc
												INNER JOIN cmx_clientes_serv_responsables ccsr ON ccsr.id_serv_contratado = ccsc.id
												INNER JOIN cmx_usuarios cu ON cu.id = ccsr.id_usuario
												INNER JOIN cmx_usuario_cliente cus ON cus.id_usuario = cu.id
											WHERE 
												ccsc.id_cliente = ' . $value["id_cliente"] . '
												AND ccsc.servicio = "' . $_servicio_contratado . '"
												AND ccsr.tipo_ejecutivo = "Ejecutivo Comercial"
												AND cus.id_perfil = ' . $value["perfil_responsable"] . '
												AND ccsr.estado = 1;
										';
									// $result = $this->_db->getConsulta($sql);
									$result = $this->_db3->prepare($sql);
									$result->execute();
									$result = $result->fetch(PDO::FETCH_ASSOC);
								}
							} else {
								$sql = '
										SELECT 
											cu.url_avatar, cu.nom_usuario
										FROM 
											cmx_usuario_cliente cus
											INNER JOIN cmx_usuarios cu ON cu.id = cus.id_usuario
										WHERE 
											cus.id_perfil = ' . $value["perfil_responsable"] . '
											AND cu.estado = 1
											AND cus.estado = 1;
									';
								// $result = $this->_db->getConsulta($sql);
								$result = $this->_db3->prepare($sql);
								$result->execute();
								$result = $result->fetch(PDO::FETCH_ASSOC);
							}
						} else {
							switch ($value["tipo_operacion"]) {
								case 'IMPORTACION':
									$_servicio_contratado = 'Transporte de Carga Internacional';
									break;

								case 'EXPORTACION':
									$_servicio_contratado = 'Transporte de Carga Internacional';
									break;

								case 'NACIONAL':
									$_servicio_contratado = 'Transporte de Carga Nacional';
									break;

								case 'URBANO':
									$_servicio_contratado = 'Transporte de Carga Nacional';
									break;

								case 'NACIONAL_AEREO':
									$_servicio_contratado = 'Transporte de Carga Internacional';
									break;
							}
							if (isset($_servicio_contratado)) {
								$sql = '
										SELECT 
											cu.url_avatar, cu.nom_usuario
										FROM 
											cmx_clientes_serv_contratados ccsc
											INNER JOIN cmx_clientes_serv_responsables ccsr ON ccsr.id_serv_contratado = ccsc.id
											INNER JOIN cmx_usuarios cu ON cu.id = ccsr.id_usuario
											INNER JOIN cmx_usuario_cliente cus ON cus.id_usuario = cu.id
										WHERE 
											ccsc.id_cliente = ' . $value["id_cliente"] . '
											AND ccsc.servicio = "' . $_servicio_contratado . '"
											AND ccsr.tipo_ejecutivo = "Ejecutivo Servicio al Cliente"
											AND cus.id_perfil = ' . $value["perfil_responsable"] . '
											AND ccsr.estado = 1;
									';
								// $result = $this->_db->getConsulta($sql);
								$result = $this->_db3->prepare($sql);
								$result->execute();
								$result = $result->fetch(PDO::FETCH_ASSOC);
							}
						}
						if ($result) {
							foreach ($result as $key_01 => $value_01) {
								$actividades["responsables"][$value['id']][] = $value_01;
							}
						}
					}
				}
			}
		} else { // Si en el proyecto no se han reportado materiales 
			// Se buscan los seguimientos realizados
			$sql = '
					SELECT 
						cis.*,
						(SELECT cus.nom_usuario
						FROM cmx_usuarios cus
						WHERE cus.id = cis.autor) nom_usuario,
						(SELECT cus.url_avatar
						FROM cmx_usuarios cus
						WHERE cus.id = cis.autor) avatar
					FROM 
						cmx_importacion_actividades cia
						INNER JOIN cmx_importacion_seguimiento cis ON cis.id_actividad = cia.id
					WHERE 
						cia.id_importacion = ' . $id . '
						AND cia.id_material IS NULL
						AND cia.tipo_actividad = "seguimiento_cliente"
					ORDER BY cis.fecha_hora DESC
				';
			// $actividades = $this->_db->getConsulta($sql);
			$actividades = $this->_db3->prepare($sql);
			$actividades->execute();
			$actividades = $actividades->fetchAll(PDO::FETCH_ASSOC);

			// Se busca los materiales del proyecto (para los casos de internacional)
			$sql = '
					SELECT 
						citm.*, 
						IF(	citm.id_riesgo IS NOT NULL,
						(	SELECT crm1.numero_riesgo
							FROM cmx_riesgo_material crm1	
							WHERE crm1.id = citm.id_riesgo),
						NULL ) RIESGO,
						IF(	citm.id_riesgo IS NOT NULL,
						(	SELECT crm1.nom_riesgo_material
							FROM cmx_riesgo_material crm1	
							WHERE crm1.id = citm.id_riesgo),
						NULL ) NOM_RIESGO,
						IF(	citm.id_riesgo IS NOT NULL,
						(	SELECT crm1.url
							FROM cmx_riesgo_material crm1	
							WHERE crm1.id = citm.id_riesgo),
						NULL ) URL_RIESGO,
						cit.guia, cis.tipo_transporte,
						(citm.largo * citm.alto * citm.ancho) VOLUMEN,
						(	CASE
							WHEN cis.tipo_transporte = "AÉREO" THEN (citm.largo * citm.alto * citm.ancho) / 5000
							WHEN cis.tipo_transporte = "MARÍTIMO" THEN (citm.largo * citm.alto * citm.ancho) / 1000000
							ELSE CONCAT(citm.largo, " x ", citm.alto, " x ",citm.ancho)
							END
						) PESO_VOLUMETRICO,
						crd.nombre, crd.sigla, crd.direccion,
						cm.municipio, cm.depto, cm.pais
					FROM 
						cmx_importacion_proyecto cip
						INNER JOIN cmx_intr_solicitudes cis ON cis.id_proyecto = cip.id
						INNER JOIN cmx_intr_tramos cit ON cit.id_intr_proyecto = cis.id
						INNER JOIN cmx_intr_tramo_materiales citm ON citm.id_tramo = cit.id
						INNER JOIN cmx_remitente_destinatario crd ON crd.id = cit.id_remitente_destinatario
						INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
					WHERE 
						cis.id_proyecto = ' . $id . '
				';
			// $result = $this->_db->getConsulta($sql);
			$result = $this->_db3->prepare($sql);
			$result->execute();
			$result = $result->fetchAll(PDO::FETCH_ASSOC);

			if ($result) {
				foreach ($result as $key => $value) {
					$actividades["materiales"][$value["id_tramo"]][] = $value;
				}
			}
		}

		// Información general del proyecto
		$sql = '
				SELECT 
					cip.id, cip.numero_importacion, cip.importacion, cip.tipo_operacion, cip.contenedor, 
					ctc.nombre TIPO_CARGA,
					cc.nombre CLIENTE,
					crd.nombre PUERTO,
					IF( 
						(cip.tipo_operacion = "EXPORTACION") OR (cip.tipo_operacion = "IMPORTACION"),
						IF(
							(SELECT ccr1.actividad_aduanera
							FROM cmx_clientes_documentos ccd1 
								INNER JOIN cmx_clientes_rut ccr1 ON ccr1.id_documento = ccd1.id
							WHERE ccd1.id_cliente = cc.id AND ccd1.estado != "0"
							),
							"BIEN",
							NULL
						),
						"BIEN"
					) ADUANERO,
					IF ((	SELECT cis1.id
							FROM cmx_intr_solicitudes cis1
							WHERE cis1.id_proyecto = cip.id
						),
						(
							SELECT CONCAT("(",cii1.sigla,") ",cii1.nombre) INCOTERM 
							FROM cmx_intr_solicitudes cis1
								INNER JOIN cmx_intr_incoterms cii1 ON cii1.sigla = cis1.incoterm
							WHERE cis1.id_proyecto = cip.id
						),
						NULL
					) INCOTERM,
					IF ((	SELECT cis1.id
							FROM cmx_intr_solicitudes cis1
							WHERE cis1.id_proyecto = cip.id
						),
						(
							SELECT cis1.tipo_transporte TIPO_TRANSPORTE 
							FROM cmx_intr_solicitudes cis1
							WHERE cis1.id_proyecto = cip.id
						),
						NULL
					) TIPO_TRANSPORTE
				FROM 
					cmx_importacion_proyecto cip
					INNER JOIN cmx_tipo_carga ctc ON ctc.id = cip.id_tipo_carga
					INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
					INNER JOIN cmx_remitente_destinatario crd ON crd.id = cip.id_origen
				WHERE 
					cip.id = ' . $id . '
			';
		// echo "<pre>" . $sql . "</pre>";
		// $result = $this->_db->getConsulta($sql);
		// $actividades["proyecto"] = $result["rowsData"];
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$actividades["proyecto"] = $result->fetch(PDO::FETCH_ASSOC);

		return $actividades;
	}
	/******** FIN CONSULTAS DE REPORTE DE SEGUIMIENTOS A CLIENTES **********/

	/******** CONSULTAS DE REPORTE DE RENTABILIDAD **********/
	public function getInfoRentabilidadInicial()
	{
		$array = array();
		$sql = '
				SELECT
					DATE_FORMAT( ciep.fecha_pago, "%Y") YEAR,
					DATE_FORMAT( ciep.fecha_pago, "%m") MES,
					SUM(ciep.valor_pago) EGRESO
				FROM 
					cmx_intr_egresos_pagos ciep
				WHERE 
					ciep.estado = 1
				GROUP BY YEAR, MES
				HAVING YEAR = DATE_FORMAT( CURDATE(), "%Y");
			';
		// $result = $this->_db->getConsulta($sql);
		// $egresos["data"] = $result["rowsData"];
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$egresos["data"] = $result->fetchAll(PDO::FETCH_ASSOC);

		if ($egresos["data"]) {
			foreach ($egresos["data"] as $key => $value) {
				$array[$value["YEAR"]][$value["MES"]]["egreso"] = $value["EGRESO"];

				// Se generar el arreglo de los años disponibles 
				if (!isset($years[$value["YEAR"]])) {
					$years[$value["YEAR"]] = $value["YEAR"];
				}

				// Se generar el arreglo de los meses disponibles 
				if (!isset($years[$value["MES"]])) {
					$meses[$value["MES"]]["numero"] = $value["MES"];
					$meses[$value["MES"]]["letra"] = $this->getMesEnLetra($value["MES"]);
				}
			}
		}

		$sql = '
				SELECT 
					DATE_FORMAT( FROM_UNIXTIME(cip.numero_importacion), "%Y") YEAR,
					DATE_FORMAT( FROM_UNIXTIME(cip.numero_importacion), "%m") MES,
					SUM(cifc.total) INGRESOS
				FROM 
					cmx_intr_factura_cliente cifc
					INNER JOIN cmx_intr_solicitudes cis ON cis.id_factura = cifc.id
					INNER JOIN cmx_importacion_proyecto cip ON cip.id = cis.id_proyecto
				WHERE 
					cip.estado NOT IN (0,4)
				GROUP BY YEAR, MES
				HAVING YEAR = DATE_FORMAT( CURDATE(), "%Y");
			';
		// $result = $this->_db->getConsulta($sql);
		// $ingresos["data"] = $result["rowsData"];
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$ingresos["data"] = $result->fetchAll(PDO::FETCH_ASSOC);

		if ($ingresos["data"]) {
			foreach ($ingresos["data"] as $key => $value) {
				$array[$value["YEAR"]][$value["MES"]]["ingreso"] = $value["INGRESOS"];

				// Se generar el arreglo de los años disponibles 
				if (!isset($years[$value["YEAR"]])) {
					$years[$value["YEAR"]] = $value["YEAR"];
				}

				// Se generar el arreglo de los meses disponibles 
				if (!isset($years[$value["MES"]])) {
					$meses[$value["MES"]]["numero"] = $value["MES"];
					$meses[$value["MES"]]["letra"] = $this->getMesEnLetra($value["MES"]);
				}
			}
		}

		$informe = [];
		if ($array) {
			$informe_tmp = [];
			foreach ($array as $key => $value) {
				foreach ($value as $key_01 => $value_01) {
					$_ingreso = 0;
					if (isset($value_01["ingreso"]) and $value_01["ingreso"]) {
						$_ingreso = $value_01["ingreso"];
					}
					$_egreso = 0;
					if (isset($value_01["egreso"]) and $value_01["egreso"]) {
						$_egreso = $value_01["egreso"];
					}
					$array_01 = array(
						'periodo' => $this->getMesEnLetra($key_01),
						// 'periodo' => (string)$key_01,
						'ingreso' => $_ingreso,
						'egreso' => $_egreso,
						'margen' => $_ingreso - $_egreso
					);
					$informe_tmp[$key_01] = $array_01;
				}
				ksort($informe_tmp);
				foreach ($informe_tmp as $key => $value) {
					$informe[] = $value;
				}
			}
		}
		$return["informe"] = $informe;


		/***** Se busca la información para los filtros *****/
		$years = [];
		$meses = [];
		$meses_ordenados = [];
		$clientes = [];
		$tipo_operacion = []; // NACIONAL O INTERNACIONAL
		$tipo_transporte = []; // TERRESTRE, AÉREO. ETC...

		$sql = '
				SELECT
					DISTINCT(DATE_FORMAT( ciep.fecha_pago, "%Y")) YEAR,
					DATE_FORMAT( ciep.fecha_pago, "%m") MES,
					cip.id_cliente, cc.sigla,
					cis.tipo_transporte, "Internacional" TIPO_OPERACION
				FROM 
					cmx_intr_egresos_pagos ciep
					INNER JOIN cmx_intr_egresos cie ON cie.id_pago = ciep.id
					INNER JOIN cmx_intr_facturas cif ON cif.id_egreso = cie.id
					INNER JOIN cmx_intr_solicitudes cis ON cis.id = cif.id_intr_proyecto
					INNER JOIN cmx_importacion_proyecto cip ON cip.id = cis.id_proyecto
					INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
				WHERE 
					ciep.estado = 1;
			';
		// $result = $this->_db->getConsulta($sql);
		// $egresos["data"] = $result["rowsData"];
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$egresos["data"] = $result->fetchAll(PDO::FETCH_ASSOC);

		if ($egresos["data"]) {
			foreach ($egresos["data"] as $key => $value) {
				// Se generar el arreglo de los años disponibles 
				if (!isset($years[$value["YEAR"]])) {
					$years[$value["YEAR"]] = $value["YEAR"];
				}

				// Se generar el arreglo de los meses disponibles 
				if (!isset($meses[$value["MES"]])) {
					$meses[$value["MES"]]["numero"] = $value["MES"];
					$meses[$value["MES"]]["letra"] = $this->getMesEnLetra($value["MES"]);
				}

				// Se generar el arreglo de los clientes disponibles 
				if (!isset($clientes[$value["id_cliente"]])) {
					$clientes[$value["id_cliente"]]["numero"] = $value["id_cliente"];
					$clientes[$value["id_cliente"]]["letra"] = $value["sigla"];
				}

				// Se generar el arreglo de los tipos de operación disponibles 
				if (!isset($tipo_operacion[$value["TIPO_OPERACION"]])) {
					$tipo_operacion[$value["TIPO_OPERACION"]] = $value["TIPO_OPERACION"];
				}

				// Se generar el arreglo de los tipos de transporte disponibles 
				if (!isset($tipo_transporte[$value["tipo_transporte"]])) {
					$tipo_transporte[$value["tipo_transporte"]] = $value["tipo_transporte"];
				}
			}
		}

		$sql = '
				SELECT 
					DISTINCT(DATE_FORMAT( FROM_UNIXTIME(cip.numero_importacion), "%Y")) YEAR,
					DATE_FORMAT( FROM_UNIXTIME(cip.numero_importacion), "%m") MES,
					cip.id_cliente, cc.sigla,
					cis.tipo_transporte, "Internacional" TIPO_OPERACION
				FROM 
					cmx_intr_factura_cliente cifc
					INNER JOIN cmx_intr_solicitudes cis ON cis.id_factura = cifc.id
					INNER JOIN cmx_importacion_proyecto cip ON cip.id = cis.id_proyecto
					INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
				WHERE 
					cip.estado NOT IN (0,4);
			';
		// $result = $this->_db->getConsulta($sql);
		// $ingresos["data"] = $result["rowsData"];
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$ingresos["data"] = $result->fetchAll(PDO::FETCH_ASSOC);

		if ($ingresos["data"]) {
			foreach ($ingresos["data"] as $key => $value) {
				// Se generar el arreglo de los años disponibles 
				if (!isset($years[$value["YEAR"]])) {
					$years[$value["YEAR"]] = $value["YEAR"];
				}

				// Se generar el arreglo de los meses disponibles 
				if (!isset($years[$value["MES"]])) {
					$meses[$value["MES"]]["numero"] = $value["MES"];
					$meses[$value["MES"]]["letra"] = $this->getMesEnLetra($value["MES"]);
				}

				// Se generar el arreglo de los clientes disponibles 
				if (!isset($clientes[$value["id_cliente"]])) {
					$clientes[$value["id_cliente"]]["numero"] = $value["id_cliente"];
					$clientes[$value["id_cliente"]]["letra"] = $value["sigla"];
				}

				// Se generar el arreglo de los tipos de operación disponibles 
				if (!isset($tipo_operacion[$value["TIPO_OPERACION"]])) {
					$tipo_operacion[$value["TIPO_OPERACION"]] = $value["TIPO_OPERACION"];
				}

				// Se generar el arreglo de los tipos de transporte disponibles 
				if (!isset($tipo_transporte[$value["tipo_transporte"]])) {
					$tipo_transporte[$value["tipo_transporte"]] = $value["tipo_transporte"];
				}
			}
		}
		$return["years"] = $years;
		ksort($meses);
		foreach ($meses as $key => $value) {
			$meses_ordenados[] = $value;
		}
		$return["meses"] = $meses_ordenados;
		$return["clientes"] = $clientes;
		$return["tipo_operacion"] = $tipo_operacion;
		$return["tipo_transporte"] = $tipo_transporte;


		/***** Fin - Se busca la información para los filtros *****/
		return $return;
	}

	public function getInfoRentabilidadFiltrado($array)
	{
		$_filtro_content_egreso = '';
		$_filtro_content_ingreso = '';
		if ($array) {
			// Se filtra el contenido de la consulta a la BD
			foreach ($array as $key => $value) {
				switch ($value["campo"]) {
					case 'year':
						$_filtro_content_egreso .= ' AND DATE_FORMAT( ciep.fecha_pago, "%Y") = "' . $value["value"] . '" ';
						$_filtro_content_ingreso .= ' AND DATE_FORMAT( FROM_UNIXTIME(cip.numero_importacion), "%Y") = "' . $value["value"] . '" ';
						break;

					case 'mes':
						$_filtro_content_egreso .= ' AND DATE_FORMAT( ciep.fecha_pago, "%m") = "' . $value["value"] . '" ';
						$_filtro_content_ingreso .= ' AND DATE_FORMAT( FROM_UNIXTIME(cip.numero_importacion), "%m") = "' . $value["value"] . '" ';
						break;

					case 'cliente':
						$_filtro_content_egreso .= ' AND cip.id_cliente = ' . $value["value"] . ' ';
						$_filtro_content_ingreso .= ' AND cip.id_cliente = ' . $value["value"] . ' ';
						break;

					case 'tipo_transporte':
						$_filtro_content_egreso .= ' AND cis.tipo_transporte = "' . $value["value"] . '" ';
						$_filtro_content_ingreso .= ' AND cis.tipo_transporte = "' . $value["value"] . '" ';
						break;

					case 'tipo_operacion':
						# code...
						break;
				}
			}

			$array = [];
			$sql = '
					SELECT
						DATE_FORMAT( ciep.fecha_pago, "%Y") YEAR,
						DATE_FORMAT( ciep.fecha_pago, "%m") MES,
						SUM(ciep.valor_pago) EGRESO
					FROM 
						cmx_intr_egresos_pagos ciep
						INNER JOIN cmx_intr_egresos cie ON cie.id_pago = ciep.id
						INNER JOIN cmx_intr_facturas cif ON cif.id_egreso = cie.id
						INNER JOIN cmx_intr_solicitudes cis ON cis.id = cif.id_intr_proyecto
						INNER JOIN cmx_importacion_proyecto cip ON cip.id = cis.id_proyecto
						INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
					WHERE 
						ciep.estado = 1
						' . $_filtro_content_egreso . '
					GROUP BY YEAR, MES
				';
			// $result = $this->_db->getConsulta($sql);
			// $egresos["data"] = $result["rowsData"];
			$result = $this->_db3->prepare($sql);
			$result->execute();
			$egresos["data"] = $result->fetchAll(PDO::FETCH_ASSOC);

			if ($egresos["data"]) {
				foreach ($egresos["data"] as $key => $value) {
					$array[$value["YEAR"]][$value["MES"]]["egreso"] = $value["EGRESO"];

					// Se generar el arreglo de los años disponibles 
					if (!isset($years[$value["YEAR"]])) {
						$years[$value["YEAR"]] = $value["YEAR"];
					}

					// Se generar el arreglo de los meses disponibles 
					if (!isset($years[$value["MES"]])) {
						$meses[$value["MES"]]["numero"] = $value["MES"];
						$meses[$value["MES"]]["letra"] = $this->getMesEnLetra($value["MES"]);
					}
				}
			}

			$sql = '
					SELECT 
						DATE_FORMAT( FROM_UNIXTIME(cip.numero_importacion), "%Y") YEAR,
						DATE_FORMAT( FROM_UNIXTIME(cip.numero_importacion), "%m") MES,
						SUM(cifc.total) INGRESOS
					FROM 
						cmx_intr_factura_cliente cifc
						INNER JOIN cmx_intr_solicitudes cis ON cis.id_factura = cifc.id
						INNER JOIN cmx_importacion_proyecto cip ON cip.id = cis.id_proyecto
					WHERE 
						cip.estado NOT IN (0,4)
						' . $_filtro_content_ingreso . '
					GROUP BY YEAR, MES
				';
			// $result = $this->_db->getConsulta($sql);
			// $ingresos["data"] = $result["rowsData"];
			$result = $this->_db3->prepare($sql);
			$result->execute();
			$ingresos["data"] = $result->fetchAll(PDO::FETCH_ASSOC);

			if ($ingresos["data"]) {
				foreach ($ingresos["data"] as $key => $value) {
					$array[$value["YEAR"]][$value["MES"]]["ingreso"] = $value["INGRESOS"];
				}
			}

			$informe = [];
			if ($array) {
				$informe_tmp = [];
				foreach ($array as $key => $value) {
					foreach ($value as $key_01 => $value_01) {
						$_ingreso = 0;
						if (isset($value_01["ingreso"]) and $value_01["ingreso"]) {
							$_ingreso = $value_01["ingreso"];
						}
						$_egreso = 0;
						if (isset($value_01["egreso"]) and $value_01["egreso"]) {
							$_egreso = $value_01["egreso"];
						}
						$array_01 = array(
							'periodo' => $this->getMesEnLetra($key_01),
							// 'periodo' => (string)$key_01,
							'ingreso' => $_ingreso,
							'egreso' => $_egreso,
							'margen' => $_ingreso - $_egreso
						);
						$informe_tmp[$key_01] = $array_01;
					}
					ksort($informe_tmp);
					foreach ($informe_tmp as $key => $value) {
						$informe[] = $value;
					}
				}
			}
			$return["informe"] = $informe;
		}

		return $return;
	}
	/******** FIN CONSULTAS DE REPORTE DE RENTABILIDAD **********/
}
