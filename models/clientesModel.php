<?php

class clientesModel extends Model
{

	public function __construct()
	{
		parent::__construct();
	}

	public function getClientes($name)
	{

		//if($name!=''){
		$sql = 'SELECT cc.*, 
					cm.municipio, cm.depto, cm.pais, cm.rndc_codigo_ciudad,
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
							IF((	SELECT COUNT(ccd1.id) CANTIDAD_REF_COMERCIALES
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
							IF((	SELECT COUNT(ccb1.id) CANTIDAD_REF_BANCARIAS
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
							IF((	SELECT ( COUNT(ccm1.id) * 2 ) CANTIDAD_DOC_REP_LEGAL
									FROM cmx_clientes_miembros ccm1
									WHERE 
										ccm1.id_cliente = cc.id
										AND ccm1.tipo_miembro = "Representante Legal"
										AND ccm1.estado = 1
								) > 0,
								(	SELECT ( COUNT(ccm1.id) * 2 ) CANTIDAD_DOC_REP_LEGAL
									FROM cmx_clientes_miembros ccm1
									WHERE 
										ccm1.id_cliente = cc.id
										AND ccm1.tipo_miembro = "Representante Legal"
										AND ccm1.estado = 1
								), 3
							)
						) + ( -- Cantidad de documentos del revisor fiscal
							IF((	SELECT ( COUNT(ccm1.id) * 2 ) CANTIDAD_DOC_REP_LEGAL
									FROM cmx_clientes_miembros ccm1
									WHERE 
										ccm1.id_cliente = cc.id
										AND ccm1.tipo_miembro = "Revisor Fiscal"
										AND ccm1.estado = 1
								) > 0,
								(	SELECT ( COUNT(ccm1.id) * 2 ) CANTIDAD_DOC_REP_LEGAL
									FROM cmx_clientes_miembros ccm1
									WHERE 
										ccm1.id_cliente = cc.id
										AND ccm1.tipo_miembro = "Revisor Fiscal"
										AND ccm1.estado = 1
								), 3
							)
						) + ( -- Cantidad de documentos de los socios
							SELECT ( COUNT(ccm1.id) * 2 ) CANTIDAD_DOC_SOCIOS
							FROM cmx_clientes_miembros ccm1
							WHERE 
								ccm1.id_cliente = cc.id
								AND ccm1.tipo_miembro = "Socio"
								AND ccm1.estado = 1
						) + ( -- Cantidad de documentos de los servicios contratados
							IF((	SELECT ( COUNT(ccsc1.id) * 3 )
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
						) + ( -- Cantidad de responsables de los servicios contratados
							IF((	SELECT ( COUNT(ccsc1.id) * 2 )
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
						IF ( -- Campo cupo_credito_basedump
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
						) + (	-- Se cuentan los documentos vigentes del cliente menos el rut
							SELECT COUNT(ccd1.id) CANTIDAD
							FROM cmx_clientes_documentos ccd1
								INNER JOIN cmx_clientes_tipo_documento cctd1 ON cctd1.id = ccd1.id_tipo_documento
							WHERE ccd1.id_tipo_documento IN (4,5,15,17,18)
								AND ccd1.id_cliente = cc.id
								AND ccd1.estado != "0"
								AND ( TIMESTAMPDIFF(MONTH,ccd1.fecha_expedicion,CURDATE()) < cctd1.vigencia OR cctd1.vigencia IS NULL )
						) + (	-- Se cuentan el rut del cliente
							SELECT COUNT(ccd1.id) CANTIDAD
							FROM cmx_clientes_documentos ccd1
								INNER JOIN cmx_clientes_tipo_documento cctd1 ON cctd1.id = ccd1.id_tipo_documento
								INNER JOIN cmx_clientes_rut ccr1 ON ccr1.id_documento = ccd1.id
							WHERE 
								ccd1.id_tipo_documento IN (20)
								AND ccd1.id_cliente = cc.id
								AND ccd1.estado != "0"
								AND ( TIMESTAMPDIFF(MONTH,ccd1.fecha_expedicion,CURDATE()) < cctd1.vigencia OR cctd1.vigencia IS NULL )
						) + (	-- Se cuentan la referencias comerciales
							SELECT COUNT(ccd1.id) CANTIDAD_REF_COMERCIALES
							FROM cmx_clientes_documentos ccd1
								INNER JOIN cmx_clientes_tipo_documento cctd1 ON cctd1.id = ccd1.id_tipo_documento
							WHERE 
								ccd1.id_tipo_documento = 6
								AND ccd1.id_cliente = cc.id
								AND ccd1.estado != "0"
								AND ( TIMESTAMPDIFF(MONTH,ccd1.fecha_expedicion,CURDATE()) < cctd1.vigencia OR cctd1.vigencia IS NULL )
						) + (	-- Se cuentan las referencias bancarias
							SELECT COUNT(ccb1.id) CANTIDAD
							FROM cmx_clientes_bancos ccb1
							WHERE 
								ccb1.id_cliente = cc.id
								AND ccb1.estado = "activo"
						) + ( -- Se cuentan los documentos del representante legal
							SELECT COUNT(ccm1.id) CANTIDAD
							FROM cmx_clientes_miembros ccm1
								INNER JOIN cmx_clientes_miembros_documentos ccmd1 ON ccmd1.id_miembro = ccm1.id
								INNER JOIN cmx_clientes_tipo_documento cctd1 ON cctd1.id = ccmd1.id_tipo_documento
							WHERE ccm1.id_cliente = cc.id
								AND ccm1.tipo_miembro = "Representante Legal"
								AND ccm1.estado = 1
								AND ccmd1.estado = 1
								AND ( TIMESTAMPDIFF(MONTH,ccmd1.fecha_expedicion,CURDATE()) < cctd1.vigencia OR cctd1.vigencia IS NULL )
						) + ( -- Se cuentan los documentos del revisor fiscal
							SELECT COUNT(ccm1.id) CANTIDAD
							FROM cmx_clientes_miembros ccm1
								INNER JOIN cmx_clientes_miembros_documentos ccmd1 ON ccmd1.id_miembro = ccm1.id
								INNER JOIN cmx_clientes_tipo_documento cctd1 ON cctd1.id = ccmd1.id_tipo_documento
							WHERE ccm1.id_cliente = cc.id
								AND ccm1.tipo_miembro = "Revisor Fiscal"
								AND ccm1.estado = 1
								AND ccmd1.estado = 1
								AND ( TIMESTAMPDIFF(MONTH,ccmd1.fecha_expedicion,CURDATE()) < cctd1.vigencia OR cctd1.vigencia IS NULL )
						) + ( -- Se pregunta cuantos socios hay registrados
							SELECT COUNT(ccm1.id) CANTIDAD
							FROM cmx_clientes_miembros ccm1
							WHERE 
								ccm1.id_cliente = cc.id
								AND ccm1.tipo_miembro = "Socio"
								AND ccm1.documento IS NOT NULL 
								AND ccm1.documento != ""
								AND ccm1.nombre_miembro IS NOT NULL 
								AND ccm1.nombre_miembro != ""
								AND ccm1.estado = 1
						) + ( -- Se cuentan los documentos de los socios
							SELECT COUNT(ccm1.id) CANTIDAD
							FROM cmx_clientes_miembros ccm1
								INNER JOIN cmx_clientes_miembros_documentos ccmd1 ON ccmd1.id_miembro = ccm1.id
								INNER JOIN cmx_clientes_tipo_documento cctd1 ON cctd1.id = ccmd1.id_tipo_documento
							WHERE 
								ccm1.id_cliente = cc.id
								AND ccm1.tipo_miembro = "Socio"
								AND ccm1.estado = 1
								AND ccmd1.estado = 1
								AND ( TIMESTAMPDIFF(MONTH,ccmd1.fecha_expedicion,CURDATE()) < cctd1.vigencia OR cctd1.vigencia IS NULL )
						) + ( -- Cantidad de documentos de los servicios contratados
							SELECT COUNT(DISTINCT(ccd1.id)) CANTIDAD
							FROM cmx_clientes_documentos ccd1
								INNER JOIN cmx_clientes_tipo_documento cctd1 ON cctd1.id = ccd1.id_tipo_documento
								INNER JOIN cmx_clientes_serv_contratados ccsc1 ON ccsc1.id_cliente = ccd1.id_cliente
							WHERE 
								ccd1.id_tipo_documento IN (12,13,14,23,24,25,26,27,28,29,30,31)
								AND ccd1.id_cliente = cc.id
								AND ccd1.estado != "0"
								AND ( TIMESTAMPDIFF(MONTH,ccd1.fecha_expedicion,CURDATE()) < cctd1.vigencia OR cctd1.vigencia IS NULL )
						) + ( -- Cantidad de responsables de los servicios contratados
							SELECT COUNT(ccsc1.id)
							FROM cmx_clientes_serv_contratados ccsc1
								INNER JOIN cmx_clientes_serv_responsables ccsr1 ON ccsr1.id_serv_contratado = ccsc1.id
							WHERE 
								ccsc1.id_cliente = cc.id
								AND ccsc1.estado = 1
								AND ccsr1.estado = 1
						)
					) REGISTRADOS,ep.nombre_empresa
				FROM 
					cmx_clientes cc
					INNER JOIN cmx_municipios cm ON cm.id = cc.ciudad
					INNER JOIN cmx_empresas ep ON cc.empresa=ep.id
					WHERE cc.nombre LIKE "%' . $name . '%"
				GROUP BY cc.id
				ORDER BY cc.rndc_id DESC, cc.estado DESC';
		/*}else{
					$sql='';	
				}*/

		$return = $this->_db->getConsulta($sql);
		return $return;
	}

	public function getTabla()
	{
		$sql = 'SELECT * FROM cmx_clientes';
		$cliente = $this->_db->getConsulta($sql);
		return $cliente;
	}

	public function getClienteByDocumento($documento)
	{
		$sql = '
				SELECT * 
				FROM cmx_clientes cc
				WHERE cc.documento = ' . $documento . '
			';
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	public function getCiudadById($id)
	{
		$sql = '
				SELECT rndc_codigo_ciudad 
				FROM cmx_municipios cc
				WHERE cc.id = ' . $id . '
			';
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	public function getClienteInfoCompleta($id)
	{
		// Se busca la información general del cliente 
		$sql = 'SELECT cc.*, 
					cm.municipio, cm.depto, cm.pais, cm.rndc_codigo_ciudad,emp.id AS empresa_cliente,
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
							IF((	SELECT COUNT(ccd1.id) CANTIDAD_REF_COMERCIALES
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
							IF((	SELECT COUNT(ccb1.id) CANTIDAD_REF_BANCARIAS
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
							IF((	SELECT ( COUNT(ccm1.id) * 2 ) CANTIDAD_DOC_REP_LEGAL
									FROM cmx_clientes_miembros ccm1
									WHERE 
										ccm1.id_cliente = cc.id
										AND ccm1.tipo_miembro = "Representante Legal"
										AND ccm1.estado = 1
								) > 0,
								(	SELECT ( COUNT(ccm1.id) * 2 ) CANTIDAD_DOC_REP_LEGAL
									FROM cmx_clientes_miembros ccm1
									WHERE 
										ccm1.id_cliente = cc.id
										AND ccm1.tipo_miembro = "Representante Legal"
										AND ccm1.estado = 1
								), 3
							)
						) + ( -- Cantidad de documentos del revisor fiscal
							IF((	SELECT ( COUNT(ccm1.id) * 2 ) CANTIDAD_DOC_REP_LEGAL
									FROM cmx_clientes_miembros ccm1
									WHERE 
										ccm1.id_cliente = cc.id
										AND ccm1.tipo_miembro = "Revisor Fiscal"
										AND ccm1.estado = 1
								) > 0,
								(	SELECT ( COUNT(ccm1.id) * 2 ) CANTIDAD_DOC_REP_LEGAL
									FROM cmx_clientes_miembros ccm1
									WHERE 
										ccm1.id_cliente = cc.id
										AND ccm1.tipo_miembro = "Revisor Fiscal"
										AND ccm1.estado = 1
								), 3
							)
						) + ( -- Cantidad de documentos de los socios
							SELECT ( COUNT(ccm1.id) * 2 ) CANTIDAD_DOC_SOCIOS
							FROM cmx_clientes_miembros ccm1
							WHERE 
								ccm1.id_cliente = cc.id
								AND ccm1.tipo_miembro = "Socio"
								AND ccm1.estado = 1
						) + ( -- Cantidad de documentos de los servicios contratados
							IF((	SELECT ( COUNT(ccsc1.id) * 3 )
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
						) + ( -- Cantidad de responsables de los servicios contratados
							IF((	SELECT ( COUNT(ccsc1.id) * 2 )
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
						) + (	-- Se cuentan los documentos vigentes del cliente menos el rut
							SELECT COUNT(ccd1.id) CANTIDAD
							FROM cmx_clientes_documentos ccd1
								INNER JOIN cmx_clientes_tipo_documento cctd1 ON cctd1.id = ccd1.id_tipo_documento
							WHERE ccd1.id_tipo_documento IN (4,5,15,17,18)
								AND ccd1.id_cliente = cc.id
								AND ccd1.estado != "0"
								AND ( TIMESTAMPDIFF(MONTH,ccd1.fecha_expedicion,CURDATE()) < cctd1.vigencia OR cctd1.vigencia IS NULL )
						) + (	-- Se cuentan el rut del cliente
							SELECT COUNT(ccd1.id) CANTIDAD
							FROM cmx_clientes_documentos ccd1
								INNER JOIN cmx_clientes_tipo_documento cctd1 ON cctd1.id = ccd1.id_tipo_documento
								INNER JOIN cmx_clientes_rut ccr1 ON ccr1.id_documento = ccd1.id
							WHERE 
								ccd1.id_tipo_documento IN (20)
								AND ccd1.id_cliente = cc.id
								AND ccd1.estado != "0"
								AND ( TIMESTAMPDIFF(MONTH,ccd1.fecha_expedicion,CURDATE()) < cctd1.vigencia OR cctd1.vigencia IS NULL )
						) + (	-- Se cuentan la referencias comerciales
							SELECT COUNT(ccd1.id) CANTIDAD_REF_COMERCIALES
							FROM cmx_clientes_documentos ccd1
								INNER JOIN cmx_clientes_tipo_documento cctd1 ON cctd1.id = ccd1.id_tipo_documento
							WHERE 
								ccd1.id_tipo_documento = 6
								AND ccd1.id_cliente = cc.id
								AND ccd1.estado != "0"
								AND ( TIMESTAMPDIFF(MONTH,ccd1.fecha_expedicion,CURDATE()) < cctd1.vigencia OR cctd1.vigencia IS NULL )
						) + (	-- Se cuentan las referencias bancarias
							SELECT COUNT(ccb1.id) CANTIDAD
							FROM cmx_clientes_bancos ccb1
							WHERE 
								ccb1.id_cliente = cc.id
								AND ccb1.estado = "activo"
						) + ( -- Se cuentan los documentos del representante legal
							SELECT COUNT(ccm1.id) CANTIDAD
							FROM cmx_clientes_miembros ccm1
								INNER JOIN cmx_clientes_miembros_documentos ccmd1 ON ccmd1.id_miembro = ccm1.id
								INNER JOIN cmx_clientes_tipo_documento cctd1 ON cctd1.id = ccmd1.id_tipo_documento
							WHERE ccm1.id_cliente = cc.id
								AND ccm1.tipo_miembro = "Representante Legal"
								AND ccm1.estado = 1
								AND ccmd1.estado = 1
								AND ( TIMESTAMPDIFF(MONTH,ccmd1.fecha_expedicion,CURDATE()) < cctd1.vigencia OR cctd1.vigencia IS NULL )
						) + ( -- Se cuentan los documentos del revisor fiscal
							SELECT COUNT(ccm1.id) CANTIDAD
							FROM cmx_clientes_miembros ccm1
								INNER JOIN cmx_clientes_miembros_documentos ccmd1 ON ccmd1.id_miembro = ccm1.id
								INNER JOIN cmx_clientes_tipo_documento cctd1 ON cctd1.id = ccmd1.id_tipo_documento
							WHERE ccm1.id_cliente = cc.id
								AND ccm1.tipo_miembro = "Revisor Fiscal"
								AND ccm1.estado = 1
								AND ccmd1.estado = 1
								AND ( TIMESTAMPDIFF(MONTH,ccmd1.fecha_expedicion,CURDATE()) < cctd1.vigencia OR cctd1.vigencia IS NULL )
						) + ( -- Se pregunta cuantos socios hay registrados
							SELECT COUNT(ccm1.id) CANTIDAD
							FROM cmx_clientes_miembros ccm1
							WHERE 
								ccm1.id_cliente = cc.id
								AND ccm1.tipo_miembro = "Socio"
								AND ccm1.documento IS NOT NULL 
								AND ccm1.documento != ""
								AND ccm1.nombre_miembro IS NOT NULL 
								AND ccm1.nombre_miembro != ""
								AND ccm1.estado = 1
						) + ( -- Se cuentan los documentos de los socios
							SELECT COUNT(ccm1.id) CANTIDAD
							FROM cmx_clientes_miembros ccm1
								INNER JOIN cmx_clientes_miembros_documentos ccmd1 ON ccmd1.id_miembro = ccm1.id
								INNER JOIN cmx_clientes_tipo_documento cctd1 ON cctd1.id = ccmd1.id_tipo_documento
							WHERE 
								ccm1.id_cliente = cc.id
								AND ccm1.tipo_miembro = "Socio"
								AND ccm1.estado = 1
								AND ccmd1.estado = 1
								AND ( TIMESTAMPDIFF(MONTH,ccmd1.fecha_expedicion,CURDATE()) < cctd1.vigencia OR cctd1.vigencia IS NULL )
						) + ( -- Cantidad de documentos de los servicios contratados
							SELECT COUNT(DISTINCT(ccd1.id)) CANTIDAD
							FROM cmx_clientes_documentos ccd1
								INNER JOIN cmx_clientes_tipo_documento cctd1 ON cctd1.id = ccd1.id_tipo_documento
								INNER JOIN cmx_clientes_serv_contratados ccsc1 ON ccsc1.id_cliente = ccd1.id_cliente
							WHERE 
								ccd1.id_tipo_documento IN (12,13,14,23,24,25,26,27,28,29,30,31)
								AND ccd1.id_cliente = cc.id
								AND ccd1.estado != "0"
								AND ( TIMESTAMPDIFF(MONTH,ccd1.fecha_expedicion,CURDATE()) < cctd1.vigencia OR cctd1.vigencia IS NULL )
						) + ( -- Cantidad de responsables de los servicios contratados
							SELECT COUNT(ccsc1.id)
							FROM cmx_clientes_serv_contratados ccsc1
								INNER JOIN cmx_clientes_serv_responsables ccsr1 ON ccsr1.id_serv_contratado = ccsc1.id
							WHERE 
								ccsc1.id_cliente = cc.id
								AND ccsc1.estado = 1
								AND ccsr1.estado = 1
						)
					) REGISTRADOS
				FROM cmx_clientes cc
					INNER JOIN cmx_municipios cm ON cm.id = cc.ciudad
					INNER JOIN cmx_empresas emp ON cc.empresa=emp.id
				WHERE cc.id = ' . $id . '
			';
		$result["general"] = $this->_db->getConsulta($sql);

		// Se busca la información de los servicios ofrecidos al cliente
		$sql = '
				SELECT *
				FROM cmx_clientes_serv_contratados ccsc
				WHERE ccsc.id_cliente = ' . $id . '
					AND ccsc.estado = 1
			';
		$result["servicios"] = $this->_db->getConsulta($sql);

		// Se busca los responsables de los servicio del cliente 
		if ($result["servicios"]) {
			foreach ($result["servicios"]["rowsData"] as $key => $value) {
				// Se buscan los ejecutivos comerciales de los servicios prestados a los clientes 
				$result["ejecutivo_comercial"][$value["id"]] = $this->getResponsableServicio($value["id"], "Ejecutivo Comercial", "13,7,22,23,24,1");

				// Se buscan los ejecutivos de servicio al cliente de los servicios prestados a los clientes 
				$result["ejecutivo_cliente"][$value["id"]] = $this->getResponsableServicio($value["id"], "Ejecutivo Servicio al Cliente", "5,6,7,8,9,10,11,12,22,23,24,25,26,1");
			}
		}

		// Se busca los últimos documentos disponibles del cliente 
		$sql = '
				SELECT ccd.id,
					cc.documento DOC_CLIENTE,
					ccd.numero_documento, ccd.fecha_expedicion, ccd.url_documento, ccd.novedad,
					cctd.id ID_TIPO_DOCUMENTO,
					cctd.nombre, cctd.folder, cctd.descripcion, cctd.vigencia,
					TIMESTAMPDIFF(MONTH,ccd.fecha_expedicion,CURDATE()) TIEMPO_MESES
				FROM cmx_clientes cc
					LEFT JOIN cmx_clientes_documentos ccd ON ccd.id_cliente = cc.id
					LEFT JOIN cmx_clientes_tipo_documento cctd ON cctd.id = ccd.id_tipo_documento
				WHERE ccd.id_cliente = ' . $id . '
					AND ccd.estado != "0"
					AND ccd.fecha_expedicion = (
						SELECT MAX(ccd1.fecha_expedicion)
						FROM cmx_clientes_documentos ccd1
						WHERE ccd1.id_cliente = ccd.id_cliente
							AND ccd1.id_tipo_documento = ccd.id_tipo_documento
					)
				HAVING TIEMPO_MESES < cctd.vigencia OR cctd.vigencia IS NULL
				ORDER BY cctd.id, ccd.fecha_expedicion DESC
			';
		$result["documentos"] = $this->_db->getConsulta($sql);

		// Se busca el RUT disponible del cliente 
		if ($result["documentos"]) {
			$documento = $this->buscarDocumento($result["documentos"], 20);
			if ($documento["flag"]) {
				$sql = '
						SELECT ccr.id ID_RUT, ccr.ciiu_principal, ccr.actividad_aduanera 
						FROM cmx_clientes_rut ccr 
						WHERE ccr.id_documento = ' . $documento["content"]["id"] . '
					';
				$resultRut = $this->_db->getConsulta($sql);

				if ($resultRut) {
					foreach ($resultRut["rowsData"] as $key => $value) {
						$result["RUT"] = array_merge($documento["content"], $value);
					}
				}
			}
		}

		// Se busca la información de la Cámara de comercio del cliente 
		$sql = '
				SELECT cccc.id,
					cc.documento DOC_CLIENTE,
					ccd.numero_documento, ccd.url_documento,
					cctd.id ID_TIPO_DOCUMENTO,
					cctd.nombre, cctd.folder, cctd.descripcion, cctd.vigencia,
					cccc.fecha_constitucion, cccc.capital_pagado, cccc.capital_suscrito, cccc.capital_autorizado,
					IF(	TIMESTAMPDIFF(MONTH,ccd.fecha_expedicion,CURDATE()) < cctd.vigencia,
						ccd.fecha_expedicion,
						NULL
					) fecha_expedicion
				FROM cmx_clientes cc
					INNER JOIN cmx_clientes_documentos ccd ON ccd.id_cliente = cc.id
					INNER JOIN cmx_clientes_tipo_documento cctd ON cctd.id = ccd.id_tipo_documento
					INNER JOIN cmx_clientes_cam_comercio cccc ON cccc.id_cliente = ccd.id_cliente
				WHERE ccd.id_cliente = ' . $id . '
					AND cctd.id = 4
					AND ccd.fecha_expedicion = (
						SELECT MAX(ccd1.fecha_expedicion)
						FROM cmx_clientes_documentos ccd1
						WHERE ccd1.id_cliente = ccd.id_cliente
							AND ccd1.id_tipo_documento = ccd.id_tipo_documento
					)
				ORDER BY cctd.id, ccd.fecha_expedicion DESC
			';
		$result["camara_comercio"] = $this->_db->getConsulta($sql);

		// Se busca el representante legal del cliente
		$sql = '
				SELECT ccm.id, cc.documento DOC_CLIENTE, ccm.documento, ccm.nombre_miembro, ccm.tipo_miembro,
					ccmd.url, ccmd.fecha_expedicion,
					cctd.nombre, cctd.folder
				FROM cmx_clientes cc
					INNER JOIN cmx_clientes_miembros ccm ON ccm.id_cliente = cc.id
					INNER JOIN cmx_clientes_miembros_documentos ccmd ON ccmd.id_miembro = ccm.id
					INNER JOIN cmx_clientes_tipo_documento cctd ON cctd.id = ccmd.id_tipo_documento
				WHERE ccm.id_cliente = ' . $id . '
					AND ccm.tipo_miembro = "Representante Legal"
					AND ccm.estado = 1
					AND ccmd.id_tipo_documento = 1
			';
		$result["representante_legal"] = $this->_db->getConsulta($sql);

		// Se busca el revisor fiscal del cliente
		$sql = '
				SELECT ccm.id, cc.documento DOC_CLIENTE, ccm.documento, ccm.nombre_miembro, ccm.tipo_miembro,
					ccmd.url, ccmd.fecha_expedicion,
					cctd.nombre, cctd.folder
				FROM cmx_clientes cc
					INNER JOIN cmx_clientes_miembros ccm ON ccm.id_cliente = cc.id
					INNER JOIN cmx_clientes_miembros_documentos ccmd ON ccmd.id_miembro = ccm.id
					INNER JOIN cmx_clientes_tipo_documento cctd ON cctd.id = ccmd.id_tipo_documento
				WHERE ccm.id_cliente = ' . $id . '
					AND ccm.tipo_miembro = "Revisor Fiscal"
					AND ccm.estado = 1
					AND ccmd.id_tipo_documento = 1
			';
		$result["revisor_fiscal"] = $this->_db->getConsulta($sql);

		// Se buscan los socios del cliente 
		$sql = '
				SELECT ccm.id, ccm.documento, ccm.nombre_miembro, ccm.tipo_miembro
				FROM cmx_clientes_miembros ccm
				WHERE ccm.id_cliente = ' . $id . '
					AND ccm.tipo_miembro = "Socio"
					AND ccm.estado = 1
			';
		$result["socios"] = $this->_db->getConsulta($sql);

		// Se busca los bancos disponibles del cliente 
		$sql = '
				SELECT ccb.*,
					cc.documento DOC_CLIENTE
				FROM cmx_clientes cc
					INNER JOIN cmx_clientes_bancos ccb ON ccb.id_cliente = cc.id
				WHERE ccb.id_cliente = ' . $id . '
					AND ccb.estado = "activo"
			';
		$result["bancos"] = $this->_db->getConsulta($sql);

		// Se busca los estados financieros disponibles del cliente 
		if ($result["documentos"]) {
			$documento = $this->buscarDocumento($result["documentos"], 5);
			if ($documento !== false) { //CAMBIO se agrego esta linea
				if ($documento["flag"]) {
					$result["estado_financiero"] = $documento["content"];
				}
			}
		}

		// Se busca la información de los seguros disponibles del cliente 
		if ($result["documentos"]) {
			$documento = $this->buscarDocumento($result["documentos"], 19);
			if ($documento !== false) { //CAMBIO se agrego esta linea
				if ($documento["flag"]) {
					$sql = '
							SELECT 
								ccs.id ID_SEGURO, ccs.aseguradora, ccs.solicitante, ccs.monto, ccs.horario_transito, 
								ccs.modelo_minimo_vehiculo, ccs.interes_asegurable
							FROM cmx_clientes_seguros ccs 
							WHERE ccs.id_documento = ' . $documento["content"]["id"] . '
						';
					$resultSeguro = $this->_db->getConsulta($sql);

					if ($resultSeguro) {
						foreach ($resultSeguro["rowsData"] as $key => $value) {
							$result["seguro"] = array_merge($documento["content"], $value);
						}
					}
				}
			}
		}

		// Se busca las referencias comerciales disponibles del cliente 
		$sql = '
				SELECT ccd.id,
					cc.documento DOC_CLIENTE,
					ccd.numero_documento, ccd.fecha_expedicion, ccd.url_documento,
					cctd.id ID_TIPO_DOCUMENTO,
					cctd.nombre, cctd.folder, cctd.descripcion, cctd.vigencia
				FROM cmx_clientes cc
					LEFT JOIN cmx_clientes_documentos ccd ON ccd.id_cliente = cc.id
					LEFT JOIN cmx_clientes_tipo_documento cctd ON cctd.id = ccd.id_tipo_documento
				WHERE ccd.id_cliente = ' . $id . '
					AND ccd.id_tipo_documento = 6
					AND ccd.estado IN ("1","2")
			';
		$result["referencias_comerciales"] = $this->_db->getConsulta($sql);

		// Se busca el certificado BASC disponible del cliente 
		if ($result["documentos"]) {
			$documento = $this->buscarDocumento($result["documentos"], 7);
			if ($documento !== false) { //CAMBIO se agrego esta linea
				if ($documento["flag"]) {
					$result["basc"] = $documento["content"];
				}
			}
		}

		// Se busca el certificado CT-PAT disponible del cliente 
		if ($result["documentos"]) {
			$documento = $this->buscarDocumento($result["documentos"], 8);
			if ($documento !== false) { //CAMBIO se agrego esta linea
				if ($documento["flag"]) {
					$result["ct_pat"] = $documento["content"];
				}
			}
		}

		// Se busca el certificado OEA disponible del cliente 
		if ($result["documentos"]) {
			$documento = $this->buscarDocumento($result["documentos"], 9);
			if ($documento !== false) { //CAMBIO se agrego esta linea
				if ($documento["flag"]) {
					$result["oea"] = $documento["content"];
				}
			}
		}

		// Se busca el certificado ISO28000 disponible del cliente 
		if ($result["documentos"]) {
			$documento = $this->buscarDocumento($result["documentos"], 10);
			if ($documento !== false) { //CAMBIO se agrego esta linea
				if ($documento["flag"]) {
					$result["ISO28000"] = $documento["content"];
				}
			}
		}

		// Se busca el certificado ISO9001 disponible del cliente 
		if ($result["documentos"]) {
			$documento = $this->buscarDocumento($result["documentos"], 11);
			if ($documento !== false) { //CAMBIO se agrego esta linea
				if ($documento["flag"]) {
					$result["ISO9001"] = $documento["content"];
				}
			}
		}

		// Se busca el OFAC disponible del cliente 
		if ($result["documentos"]) {
			$documento = $this->buscarDocumento($result["documentos"], 15);
			if ($documento !== false) { //CAMBIO se agrego esta linea
				if ($documento["flag"]) {
					$result["OFAC"] = $documento["content"];
				}
			}
		}

		// Se busca el CIFIN disponible del cliente 
		if ($result["documentos"]) {
			$documento = $this->buscarDocumento($result["documentos"], 17);
			if ($documento !== false) { //CAMBIO se agrego esta linea
				if ($documento["flag"]) {
					$result["CIFIN"] = $documento["content"];

					// Se buscan las calificaciones del documento 
					$sql = '
							SELECT *
							FROM cmx_clientes_cifin ccc
							WHERE ccc.id_cliente_documento = ' . $result["CIFIN"][0] . '
						';
					$result["calificaciones_CIFIN"] = $this->_db->getConsulta($sql);
				}
			}
		}

		// Se busca el RUES disponible del cliente 
		if ($result["documentos"]) {
			$documento = $this->buscarDocumento($result["documentos"], 18);
			if ($documento !== false) { //CAMBIO se agrego esta linea
				if ($documento["flag"]) {
					$result["RUES"] = $documento["content"];
				}
			}
		}

		// Se busca los formatos BASC del cliente 
		if ($result["documentos"]) {
			$array_formatos = [12, 13, 14, 23, 24, 25, 26, 27, 28, 29, 30, 31];
			foreach ($array_formatos as $key => $value) {
				$documento = $this->buscarDocumento($result["documentos"], $value);
				if ($documento !== false) { //CAMBIO se agrego esta linea
					if ($documento["flag"]) {
						$result[str_replace("-", "_", $documento["content"]["folder"])] = $documento["content"];
					}
				}
			}
		}

		// Se busca los últimos documentos disponibles de los miembros del cliente 
		$sql = '
				SELECT 
					ccmd.id, ccm.id ID_MIEMBRO, cctd.id ID_TIPO_DOCUMENTO, 
					cc.documento DOC_CLIENTE,
					ccm.documento, ccm.nombre_miembro, ccm.tipo_miembro, 
					cctd.nombre, cctd.folder, cctd.descripcion, cctd.vigencia,
					ccmd.url, ccmd.fecha_expedicion, ccmd.observaciones, ccmd.novedad,
					TIMESTAMPDIFF(MONTH,ccmd.fecha_expedicion,CURDATE()) TIEMPO_MESES
				FROM cmx_clientes cc
					INNER JOIN cmx_clientes_miembros ccm ON ccm.id_cliente = cc.id
					INNER JOIN cmx_clientes_miembros_documentos ccmd ON ccmd.id_miembro = ccm.id
					INNER JOIN cmx_clientes_tipo_documento cctd ON cctd.id = ccmd.id_tipo_documento
				WHERE ccm.id_cliente = ' . $id . '
					AND ccm.estado = 1
					AND ccmd.estado = 1
					AND ccmd.fecha_expedicion = (
						SELECT MAX(ccmd1.fecha_expedicion)
						FROM cmx_clientes_miembros_documentos ccmd1
						WHERE ccmd1.id_miembro = ccmd.id_miembro
							AND ccmd1.id_tipo_documento = ccmd.id_tipo_documento
					)
				HAVING TIEMPO_MESES < cctd.vigencia OR cctd.vigencia IS NULL
				ORDER BY cctd.id, ccmd.fecha_expedicion DESC;
			';
		$result["documentos_miembros"] = $this->_db->getConsulta($sql);

		// Se busca los antecenentes policiales disponible del representante legal del cliente 
		if ($result["documentos_miembros"]) {
			$documento = $this->buscarDocumentoRespresentante($result["documentos_miembros"], 16, "Representante Legal");
			if ($documento !== false) {
				if ($documento["flag"]) {
					$result["repres_antecedentes"] = $documento["content"];
				}
			}
		}

		// Se busca el OFAC disponible del representante legal del cliente 
		if ($result["documentos_miembros"]) {
			$documento = $this->buscarDocumentoRespresentante($result["documentos_miembros"], 15, "Representante Legal");
			if ($documento !== false) {
				if ($documento["flag"]) {
					$result["repres_OFAC"] = $documento["content"];
				}
			}
		}

		// Se busca los antecenentes policiales disponible del revisor fiscal del cliente 
		if ($result["documentos_miembros"]) {
			$documento = $this->buscarDocumentoRespresentante($result["documentos_miembros"], 16, "Revisor Fiscal");
			if ($documento !== false) {
				if ($documento["flag"]) {
					$result["revisor_antecedentes"] = $documento["content"];
				}
			}
		}

		// Se busca el OFAC disponible del revisor fiscal del cliente 
		if ($result["documentos_miembros"]) {
			$documento = $this->buscarDocumentoRespresentante($result["documentos_miembros"], 15, "Revisor Fiscal");
			if ($documento !== false) {
				if ($documento["flag"]) {
					$result["revisor_OFAC"] = $documento["content"];
				}
			}
		}

		// Se busca los documentos disponibles de los socios del cliente 
		if ($result["socios"]) {
			if ($result["documentos_miembros"]) {
				foreach ($result["socios"]["rowsData"] as $key_socios => $value_socios) {
					$documento = $this->buscarDocumentoSocio($result["documentos_miembros"], $value_socios["id"], 16, "Socio");
					if ($documento !== false) {
						if ($documento["flag"]) {
							$result["documentos_socios"][$value_socios["id"]][16] = $documento["content"];
						}
					}
					$documento = $this->buscarDocumentoSocio($result["documentos_miembros"], $value_socios["id"], 15, "Socio");
					if ($documento !== false) {
						if ($documento["flag"]) {
							$result["documentos_socios"][$value_socios["id"]][15] = $documento["content"];
						}
					}
				}
			}
		}

		// Se busca el documento de aprobación del cliente 
		if ($result["documentos"]) {
			$documento = $this->buscarDocumento($result["documentos"], 22);
			if ($documento !== false) { //CAMBIO se agrego esta linea
				if ($documento["flag"]) {
					$result["aprobacion"] = $documento["content"];
				}
			}
		}

		//Se busca las sedes del cliente -VER - EDITAR Cliente
		$sqls = 'SELECT cs.id, cs.nombre_sede, mn.municipio, mn.depto,
					cs.direccion, cs.encargado, cs.correo, cs.telefono,
					cs.correo, cs.condicion_facturacion, cs.condicion_pago,
					cs.dia_informacion,cs.restriccion_acceso, cs.instruccion_especial,
					ot.descripcion, cs.ciudad, cs.obligacion_tributaria
					FROM cmx_cliente_sede cs
					INNER JOIN cmx_municipios mn
					ON cs.ciudad=mn.id
					LEFT JOIN cmx_para_obligacion_tributaria ot
					ON cs.obligacion_tributaria=ot.id
					WHERE cs.id_cliente=' . $id . '
					AND cs.estado=1';
		$result["sedes_cliente"] = $this->_db->getConsulta($sqls);


		$result["contratos"] = $this->getContratosCliente($id);
		return $result;
	}

	//Funciones para consultar  para consultar los demás datos

	public function getmunicipiosede($id_municipio, $idsede)
	{
		$sql = "SELECT * FROM cmx_municipios";
		$array = $this->_db->getConsulta($sql);
		$select = '<select id="munisede' . $idsede . '" class="form-control input-sm emunicipio"  aria-hidden="true">';
		if ($array) {
			$select .= '<option value="" disabled="disabled" selected= "selected">Seleccione</option>';
			foreach ($array['rowsData'] as $key => $value) {
				if ($value["id"] == $id_municipio) {
					$option = 'selected=""selected';
				} else {
					$option = '';
				}
				$select .= '<option value="' . $value['id'] . '" ' . $option . '>' . $value['municipio'] . '</option>';
			}
			$select .= '</select>';
		}

		return $select;
	}

	public function getObligacionTributaria($idobligacion, $idsede)
	{
		$sql = "SELECT * 
			FROM cmx_para_obligacion_tributaria 
			WHERE estado=1";
		$array = $this->_db->getConsulta($sql);
		$select = '<select id="oblisede' . $idsede . '" class="form-control input-sm eobligaciones"  aria-hidden="true">';
		if ($array) {
			$select .= '<option value="" disabled="disabled" selected= "selected">Seleccione</option>';
			foreach ($array['rowsData'] as $key => $value) {
				if ($value["id"] == $idobligacion) {
					$option = 'selected=""selected';
				} else {
					$option = '';
				}
				$select .= '<option value="' . $value['id'] . '" ' . $option . '>' . $value["descripcion"] . '</option>';
			}
			$select .= '</select>';
		}

		return $select;
	}

	//Obetener empresa a la que esta asociado el cliente
	public function getEmpresaCliente($empresa_cliente, $idsede)
	{
		$sql = "SELECT * 
			FROM cmx_empresas 
			WHERE estado_empresa='ACTIVA'";
		$array = $this->_db->getConsulta($sql);
		$select = '<select id="e_empresa' . $idsede . '" class="form-control input-sm e_empresa"  aria-hidden="true">';
		if ($array) {
			$select .= '<option value="" disabled="disabled" selected= "selected">Seleccione</option>';
			foreach ($array['rowsData'] as $key => $value) {
				if ($value["id"] == $empresa_cliente) {
					$option = 'selected=""selected';
				} else {
					$option = '';
				}
				$select .= '<option value="' . $value['id'] . '" ' . $option . '>' . $value["nombre_empresa"] . '</option>';
			}
			$select .= '</select>';
		}

		return $select;
	}

	public function getCamComercioCliente($id)
	{
		$sql = '
				SELECT * 
				FROM cmx_clientes_cam_comercio cccc
				WHERE cccc.id_cliente = ' . $id . '
			';
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	public function getHtmlSelect($name, $id, $status)
	{
		if ($name) {
			$_filter = "";
			$_where = "";

			if ($id) {
				if ($id != "1") {
					$_filter .= " ccl.id = " . $id . " ";
				}
			}
			if ($status) {
				if ($_filter) {
					$_filter .= " AND ccl.estado IN (" . $status . ") ";
				} else {
					$_filter .= " ccl.estado IN (" . $status . ") ";
				}
			}
			if ($_filter) {
				$_where = " WHERE ";
			}

			$sql = '
					SELECT *
					FROM cmx_clientes ccl
					' . $_where . '
					' . $_filter . '
					ORDER BY ccl.nombre;
				';
			$array = $this->_db->getConsulta($sql);

			// Se recorre contenido de la consulta
			if ($array) {
				// print_r($array);
				$select = '<select class="form-control" name="' . $name . '" id="slct_' . $name . '" aria-hidden="true">';
				$select .= '<option value="" selected>Seleccione</option>';
				foreach ($array['rowsData'] as $key => $value) {
					if ($value[0] == $id) {
						$select .= '<option value="' . $value[0] . '" selected="">' . $value["nombre"] . '</option>';
					} else {
						$select .= '<option value="' . $value[0] . '">' . $value["nombre"] . '</option>';
					}
				}
				$select .= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}
		return $select;
	}

	public function getHtmlSelectClientesRemiDest($name, $id, $status, $id_usuario, $ssn_id_perfil)
	{
		if ($name) {
			$_filter = "";
			$_where = "";

			if ($id) {
				if ($id != "1") {
					$_filter .= " ccl.id = " . $id . " ";
				}
			}
			if ($status) {
				if ($_filter) {
					$_filter .= " AND ccl.estado IN (" . $status . ") ";
				} else {
					$_filter .= " ccl.estado IN (" . $status . ") ";
				}
			}

			if ($ssn_id_perfil == 22 || $ssn_id_perfil == 23 || $ssn_id_perfil == 24 || $ssn_id_perfil == 25 || $ssn_id_perfil == 26 || $ssn_id_perfil == 27) {
				$sql = '
						SELECT ccl.*
						FROM cmx_clientes ccl
							INNER JOIN cmx_clientes_serv_contratados ccsc ON ccsc.id_cliente = ccl.id
						WHERE 
							 ' . $_filter . '
							AND ccsc.servicio IN ("Transporte de Carga Nacional","Transporte de Carga Internacional")
						GROUP BY ccl.id
						ORDER BY ccl.nombre;';
			} else {
				$sql = '
						SELECT ccl.*
						FROM cmx_clientes ccl
							INNER JOIN cmx_clientes_serv_contratados ccsc ON ccsc.id_cliente = ccl.id
							INNER JOIN cmx_clientes_serv_responsables ccsr1 
							ON ccsc.id=ccsr1.id_serv_contratado
						WHERE 
							 ' . $_filter . '
							 AND ccsr1.id_usuario=' . $id_usuario . '
							AND ccsc.servicio IN ("Transporte de Carga Nacional","Transporte de Carga Internacional")
						GROUP BY ccl.id
						ORDER BY ccl.nombre;';
			}
			$array = $this->_db->getConsulta($sql);

			// Se recorre contenido de la consulta
			if ($array) {
				$select = '<select class="form-control input-sm" name="' . $name . '" id="slct_' . $name . '" aria-hidden="true">';
				$select .= '<option value="" selected>Seleccione</option>';
				foreach ($array['rowsData'] as $key => $value) {
					// if (isset($value[0])) {
					// } else {
					// 	// Maneja el caso donde $value[0] no existe, si es necesario
					// 	// Por ejemplo, podrías agregar una opción vacía o continuar sin hacer nada
					// }
					if ($value['id'] == $id) {
						$select .= '<option value="' . $value['id'] . '" selected="">' . $value["nombre"] . '</option>';
					} else {
						$select .= '<option value="' . $value['id'] . '">' . $value["nombre"] . '</option>';
					}
				}
				// foreach ($array['rowsData'] as $key => $value) {
				// 	if ($value[0] == $id) {
				// 		$select.= '<option value="' . $value[0] . '" selected="">' . $value["nombre"] . '</option>';
				// 	}else{
				// 		$select.= '<option value="' . $value[0] . '">' . $value["nombre"] . '</option>';
				// 	}
				// }
				$select .= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}
		return $select;
	}

	public function getHtmlSelect_sm($name, $id, $status)
	{
		if ($name) {
			$_filter = "";
			$_where = "";

			if ($id) {
				if ($id != "1") {
					$_filter .= " ccl.id = " . $id . " ";
				}
			}
			if ($status) {
				if ($_filter) {
					$_filter .= " AND ccl.estado IN (" . $status . ") ";
				} else {
					$_filter .= " ccl.estado IN (" . $status . ") ";
				}
			}
			if ($_filter) {
				$_where = " WHERE ";
				$_filter .= " AND ccl.rndc_id IS NOT NULL ";
			}

			$sql = $this->_db3->prepare('SELECT * FROM cmx_clientes ccl ' . $_where . ' ' . $_filter . ' ORDER BY ccl.nombre');
			$sql->execute();
			$array = $sql->fetchAll(PDO::FETCH_ASSOC);
			// $array = $this->_db->getConsulta($sql);

			// Se recorre contenido de la consulta
			if ($array) {
				$select = '<select class="form-control input-sm" name="' . $name . '" id="slct_' . $name . '" aria-hidden="true">';
				$select .= '<option value="" selected>Seleccione</option>';
				foreach ($array as $key => $value) {
					if ($value['id'] == $id) {
						$select .= '<option value="' . $value['id'] . '" selected="">' . $value["nombre"] . '</option>';
					} else {
						$select .= '<option value="' . $value['id'] . '">' . $value["nombre"] . '</option>';
					}
				}
				$select .= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}
		return $select;
	}


	public function getHtmlSelectInternacional_sm($name, $id, $status)
	{
		if ($name) {
			$_filter = "";
			$_where = "";

			if ($id) {
				if ($id != "1") {
					$_filter .= " ccl.id = " . $id . " ";
				}
			}
			if ($status) {
				if ($_filter) {
					$_filter .= " AND ccl.estado IN (" . $status . ") ";
				} else {
					$_filter .= " ccl.estado IN (" . $status . ") ";
				}
			}
			if ($_filter) {
				$_where = " WHERE ";
				$_filter .= " 
						AND ccl.id IN (
							SELECT ccsc1.id_cliente
							FROM cmx_clientes_serv_contratados ccsc1
							WHERE ccsc1.id_cliente = ccl.id
								AND ccsc1.servicio IN ('Agenciamiento Aduanero','Transporte de Carga Internacional')
						)
					";
			}

			$sql = '
					SELECT *
					FROM cmx_clientes ccl
					' . $_where . '
					' . $_filter . '
					ORDER BY ccl.nombre;
				';
			// $array = $this->_db->getConsulta($sql);
			$sql_array = $this->_db3->prepare($sql);
			$sql_array->execute();
			$array = $sql_array->fetchAll(PDO::FETCH_ASSOC);

			// Se recorre contenido de la consulta
			if ($array) {
				$select = '<select class="form-control input-sm" name="' . $name . '" id="slct_' . $name . '" aria-hidden="true">';
				$select .= '<option value="" selected>Seleccione</option>';
				foreach ($array as $key => $value) {
					if ($value['id'] == $id) {
						$select .= '<option value="' . $value['id'] . '" selected="">' . $value["nombre"] . '</option>';
					} else {
						$select .= '<option value="' . $value['id'] . '">' . $value["nombre"] . '</option>';
					}
				}
				$select .= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}
		return $select;
	}

	public function getEnumSlctTipoDocumento($name, $id, $value_select)
	{
		$sql = "
				SHOW COLUMNS FROM 
					cmx_clientes 
				LIKE 'tipo_documento' 
			";
		$result = $this->_db->getConsulta($sql);

		foreach ($result["rowsData"] as $key => $value) {
			$value["Type"] = str_replace("enum(", "", $value["Type"]);
			$value["Type"] = str_replace(")", "", $value["Type"]);
			$value["Type"] = str_replace("'", "", $value["Type"]);

			$arrayTipoActividad = explode(",", $value["Type"]);
		}

		$select = '<select class="select2 select2-hidden-accessible" name="' . $name . '" id="slct_' . $name . '_' . $id . '" aria-hidden="true">';
		$select .= '<option value="" selected>Seleccione</option>';
		foreach ($arrayTipoActividad as $key => $value) {
			if ($value == $value_select) {
				$select .= '<option value="' . $value . '" selected="">' . $value . '</option>';
			} else {
				$select .= '<option value="' . $value . '">' . $value . '</option>';
			}
		}
		$select .= '</select>';
		return $select;
	}

	public function getEnumTipoServicio()
	{
		$sql = "SHOW COLUMNS FROM cmx_clientes_serv_contratados LIKE 'servicio'";
		$result = $this->_db->getConsulta($sql);

		foreach ($result["rowsData"] as $key => $value) {
			$value["Type"] = str_replace("enum(", "", $value["Type"]);
			$value["Type"] = str_replace(")", "", $value["Type"]);
			$value["Type"] = str_replace("'", "", $value["Type"]);

			$arrayServicio = explode(",", $value["Type"]);
		}
		return $arrayServicio;
	}

	public function getEnumCheckTipoServicio($class, $id_cliente)
	{
		$sql = "
				SHOW COLUMNS FROM 
					cmx_clientes_serv_contratados 
				LIKE 'servicio' 
			";
		$result = $this->_db->getConsulta($sql);

		foreach ($result["rowsData"] as $key => $value) {
			$value["Type"] = str_replace("enum(", "", $value["Type"]);
			$value["Type"] = str_replace(")", "", $value["Type"]);
			$value["Type"] = str_replace("'", "", $value["Type"]);

			$arrayServicio = explode(",", $value["Type"]);
		}
		$content = '
				<div class="form-group col-xs-12">
					<label>Servicios</label><br>
			';
		foreach ($arrayServicio as $key => $value) {
			$_flag_checked = '';
			if ($id_cliente) {
				if ($this->getServicioCliente($id_cliente, $value)) {
					$_flag_checked = 'checked';
				}
			}
			$content .= '
					<div class="be-checkbox inline">
						<input class="' . $class . '" id="' . $value . '" type="checkbox" ' . $_flag_checked . '>
						<label for="' . $value . '">' . $value . '</label>
					</div>
				';
		}
		$content .= '
				</div>
			';
		return $content;
	}

	public function getServicioCliente($id_cliente, $servicio)
	{
		// Se busca el servicio del cliente 
		$sql = '
				SELECT *
				FROM cmx_clientes_serv_contratados ccsc
				WHERE ccsc.id_cliente = ' . $id_cliente . '
					AND ccsc.servicio = "' . $servicio . '"
			';
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	public function getEnumSlctTipoDocumento_sm($name, $id, $value_select)
	{
		$sql = "
				SHOW COLUMNS FROM 
					cmx_clientes 
				LIKE 'tipo_documento' 
			";
		$result = $this->_db->getConsulta($sql);

		foreach ($result["rowsData"] as $key => $value) {
			$value["Type"] = str_replace("enum(", "", $value["Type"]);
			$value["Type"] = str_replace(")", "", $value["Type"]);
			$value["Type"] = str_replace("'", "", $value["Type"]);

			$arrayTipoActividad = explode(",", $value["Type"]);
		}
		$select = '<select class="form-control input-sm" name="' . $name . '" id="slct_' . $name . '_' . $id . '">';
		$select .= '<option value="" disabled selected>Seleccione</option>';
		foreach ($arrayTipoActividad as $key => $value) {
			if ($value == $value_select) {
				$select .= '<option value="' . $value . '" selected="">' . $value . '</option>';
			} else {
				$select .= '<option value="' . $value . '">' . $value . '</option>';
			}
		}
		$select .= '</select>';
		return $select;
	}

	public function getEnumSlctRegimen($name, $id, $value_select)
	{
		$sql = "
				SHOW COLUMNS FROM 
					cmx_clientes 
				LIKE 'regimen' 
			";
		$result = $this->_db->getConsulta($sql);

		foreach ($result["rowsData"] as $key => $value) {
			$value["Type"] = str_replace("enum(", "", $value["Type"]);
			$value["Type"] = str_replace(")", "", $value["Type"]);
			$value["Type"] = str_replace("'", "", $value["Type"]);

			$arrayTipoActividad = explode(",", $value["Type"]);
		}
		$select = '<select class="select2 select2-hidden-accessible" name="' . $name . '" id="slct_' . $name . '_' . $id . '" aria-hidden="true">';
		$select .= '<option value="" selected>Seleccione</option>';
		foreach ($arrayTipoActividad as $key => $value) {
			if ($value == $value_select) {
				$select .= '<option value="' . $value . '" selected="">' . $value . '</option>';
			} else {
				$select .= '<option value="' . $value . '">' . $value . '</option>';
			}
		}
		$select .= '</select>';
		return $select;
	}

	public function getEnumSlctRegimen_sm($name, $id, $value_select)
	{
		$sql = "
				SHOW COLUMNS FROM 
					cmx_clientes 
				LIKE 'regimen' 
			";
		$result = $this->_db->getConsulta($sql);

		foreach ($result["rowsData"] as $key => $value) {
			$value["Type"] = str_replace("enum(", "", $value["Type"]);
			$value["Type"] = str_replace(")", "", $value["Type"]);
			$value["Type"] = str_replace("'", "", $value["Type"]);

			$arrayTipoActividad = explode(",", $value["Type"]);
		}
		$select = '<select class="form-control input-sm" name="' . $name . '" id="slct_' . $name . '_' . $id . '" aria-hidden="true">';
		$select .= '<option value="" disabled selected>Seleccione</option>';
		foreach ($arrayTipoActividad as $key => $value) {
			if ($value == $value_select) {
				$select .= '<option value="' . $value . '" selected="">' . $value . '</option>';
			} else {
				$select .= '<option value="' . $value . '">' . $value . '</option>';
			}
		}
		$select .= '</select>';
		return $select;
	}

	public function getEnumSlctTipoCuenta_sm($name, $id, $value_select)
	{
		$sql = "
				SHOW COLUMNS FROM 
					cmx_clientes_bancos 
				LIKE 'tipo_cuenta' 
			";
		$result = $this->_db->getConsulta($sql);

		foreach ($result["rowsData"] as $key => $value) {
			$value["Type"] = str_replace("enum(", "", $value["Type"]);
			$value["Type"] = str_replace(")", "", $value["Type"]);
			$value["Type"] = str_replace("'", "", $value["Type"]);

			$arrayTipoActividad = explode(",", $value["Type"]);
		}
		$select = '<select class="form-control input-sm" name="' . $name . '" id="slct_' . $name . '_' . $id . '">';
		$select .= '<option value="" disabled selected>Seleccione</option>';
		foreach ($arrayTipoActividad as $key => $value) {
			if ($value == $value_select) {
				$select .= '<option value="' . $value . '" selected="">' . $value . '</option>';
			} else {
				$select .= '<option value="' . $value . '">' . $value . '</option>';
			}
		}
		$select .= '</select>';
		return $select;
	}

	public function getEnumSlctTipoSociedad_sm($name, $id, $value_select)
	{
		$sql = "
				SHOW COLUMNS FROM 
					cmx_clientes 
				LIKE 'tipo_sociedad' 
			";
		$result = $this->_db->getConsulta($sql);

		foreach ($result["rowsData"] as $key => $value) {
			$value["Type"] = str_replace("enum(", "", $value["Type"]);
			$value["Type"] = str_replace(")", "", $value["Type"]);
			$value["Type"] = str_replace("'", "", $value["Type"]);

			$arrayTipoActividad = explode(",", $value["Type"]);
		}
		$select = '<select class="form-control input-sm" name="' . $name . '" id="slct_' . $name . '_' . $id . '">';
		$select .= '<option value="" disabled selected>Seleccione</option>';
		foreach ($arrayTipoActividad as $key => $value) {
			if ($value == $value_select) {
				$select .= '<option value="' . $value . '" selected="">' . $value . '</option>';
			} else {
				$select .= '<option value="' . $value . '">' . $value . '</option>';
			}
		}
		$select .= '</select>';
		return $select;
	}

	public function getEnumSlctCifinCalificacion_sm($name, $id, $value_select)
	{
		$sql = "
				SHOW COLUMNS FROM 
					cmx_clientes_cifin 
				LIKE 'calificacion' 
			";
		$result = $this->_db->getConsulta($sql);

		foreach ($result["rowsData"] as $key => $value) {
			$value["Type"] = str_replace("enum(", "", $value["Type"]);
			$value["Type"] = str_replace(")", "", $value["Type"]);
			$value["Type"] = str_replace("'", "", $value["Type"]);

			$arrayTipoActividad = explode(",", $value["Type"]);
		}
		$select = '<select class="form-control input-sm" name="' . $name . '" id="slct_' . $name . '_' . $id . '">';
		$select .= '<option value="" disabled selected>Seleccione</option>';
		foreach ($arrayTipoActividad as $key => $value) {
			if ($value == $value_select) {
				$select .= '<option value="' . $value . '" selected="">' . $value . '</option>';
			} else {
				$select .= '<option value="' . $value . '">' . $value . '</option>';
			}
		}
		$select .= '</select>';
		return $select;
	}

	/******* FUNCIONES DEL MÓDULO DE CLIENTES *******/
	// Función para guardar archivos de documentos en el servidor
	public function setDocumentoCliente($file, $id_adjunto, $array)
	{
		$return["file"] = $file;
		$return["array"] = $array;
		if ($file[$id_adjunto]["error"] == 0) {
			$tmp_file = $file[$id_adjunto]["tmp_name"];
			$extension = $this->get_extension_archivo($file[$id_adjunto]["name"]);
			$archivo_temporal = "../public/files/tmp/tmp_file." . $extension;
			if (move_uploaded_file($tmp_file, $archivo_temporal)) {
				// Se crean las carpetas de destino del archivo
				$carpeta_destino = "../public/files/clientes";
				if (!file_exists($carpeta_destino)) {
					mkdir($carpeta_destino, 0777, true);
				}

				$carpeta_destino_1 = $carpeta_destino . "/" . $array["documento"];
				if (!file_exists($carpeta_destino_1)) {
					mkdir($carpeta_destino_1, 0777, true);
				}

				$sql = '
						SELECT cctd.folder
						FROM cmx_clientes_tipo_documento cctd
						WHERE cctd.id = ' . $array["tipo_documento"] . '
					';
				$result = $this->_db->getConsulta($sql);

				$carpeta_destino_2 = $carpeta_destino_1 . "/" . $result["rowsData"][0]["folder"];
				if (!file_exists($carpeta_destino_2)) {
					mkdir($carpeta_destino_2, 0777, true);
				}

				$archivo_destino = $array["fecha_expedicion"] . "-" . $array["id_cliente"] . "." . $extension;
				$destino = $carpeta_destino_2 . "/" . $archivo_destino;

				if (copy($archivo_temporal, $destino)) {
					$return["result"] = true;
				} else {
					$return["result"] = false;
				}
			}
			if (file_exists($archivo_temporal)) {
				unlink($archivo_temporal);
			}
		} else {
			$return["result"] = false;
		}
		return $return;
	}

	// Función para guardar archivos de documentos en el servidor
	public function setDocumentoMiembro($file, $id_adjunto, $array)
	{
		if ($file[$id_adjunto]["error"] == 0) {
			$tmp_file = $file[$id_adjunto]["tmp_name"];
			$extension = $this->get_extension_archivo($file[$id_adjunto]["name"]);
			$archivo_temporal = "../public/files/tmp/tmp_file." . $extension;
			if (move_uploaded_file($tmp_file, $archivo_temporal)) {
				// Se crean las carpetas de destino del archivo
				$carpeta_destino = "../public/files/clientes";
				if (!file_exists($carpeta_destino)) {
					mkdir($carpeta_destino, 0777, true);
				}

				$carpeta_destino_1 = $carpeta_destino . "/" . $array["documento"];
				if (!file_exists($carpeta_destino_1)) {
					mkdir($carpeta_destino_1, 0777, true);
				}

				$carpeta_destino_2 = $carpeta_destino_1 . "/" . $array["tipo_miembro"];
				if (!file_exists($carpeta_destino_2)) {
					mkdir($carpeta_destino_2, 0777, true);
				}

				$carpeta_destino_3 = $carpeta_destino_2 . "/" . $array["documento_miembro"];
				if (!file_exists($carpeta_destino_3)) {
					mkdir($carpeta_destino_3, 0777, true);
				}

				$carpeta_destino_4 = $carpeta_destino_3 . "/" . $array["tipo_documento"];
				if (!file_exists($carpeta_destino_4)) {
					mkdir($carpeta_destino_4, 0777, true);
				}

				$archivo_destino = $array["fecha_expedicion"] . "-" . $array["id_miembro"] . "." . $extension;
				$destino = $carpeta_destino_4 . "/" . $archivo_destino;

				if (copy($archivo_temporal, $destino)) {
					$return["result"] = true;
				} else {
					$return["result"] = false;
				}
			}
			if (file_exists($archivo_temporal)) {
				unlink($archivo_temporal);
			}
		} else {
			$return["result"] = false;
		}
		return $return;
	}

	// Función para guardar archivos del banco en el servidor
	public function setBancosCliente($file, $id_adjunto, $array)
	{
		$return["result"] = false;

		if ($file[$id_adjunto]["error"] == 0) {
			$tmp_file = $file[$id_adjunto]["tmp_name"];
			$extension = $this->get_extension_archivo($file[$id_adjunto]["name"]);
			$archivo_temporal = "../public/files/tmp/tmp_file." . $extension;
			if (move_uploaded_file($tmp_file, $archivo_temporal)) {
				// Se crean las carpetas de destino del archivo
				$carpeta_destino = "../public/files/clientes";
				if (!file_exists($carpeta_destino)) {
					mkdir($carpeta_destino, 0777, true);
				}

				$carpeta_destino_1 = $carpeta_destino . "/" . $array["documento"];
				if (!file_exists($carpeta_destino_1)) {
					mkdir($carpeta_destino_1, 0777, true);
				}

				$carpeta_destino_2 = $carpeta_destino_1 . "/bancos";
				if (!file_exists($carpeta_destino_2)) {
					mkdir($carpeta_destino_2, 0777, true);
				}

				$archivo_destino = $array["numero_cuenta"] . "-" . $array["id_cliente"] . "." . $extension;
				$destino = $carpeta_destino_2 . "/" . $archivo_destino;

				if (copy($archivo_temporal, $destino)) {
					$return["result"] = true;
				} else {
					$return["result"] = false;
				}
			}
			unlink($archivo_temporal);
		}
		return $return;
	}

	// Función para determinar si el cliente ya tiene algún documento específico registrado en la base de datos
	/*public function buscarDocumento($array, $tipo_documento)
	 {
		 $return = false;

		 foreach ($array["rowsData"] as $key => $value) {
			 if ($value["ID_TIPO_DOCUMENTO"] == $tipo_documento) {
				 $return["flag"] = true;
				 $return["content"] = $value;
				 break;
			 }
		 }
		 return $return;
	 }*/


	public function buscarDocumento($array, $tipo_documento)
	{
		$return = false;
		foreach ($array["rowsData"] as $key => $value) {
			if ($value["ID_TIPO_DOCUMENTO"] == $tipo_documento) {
				$return = [
					"flag" => true,
					"content" => $value
				];
				break;
			}
		}
		return $return;
	}


	// Función para buscar información básica de los responsables de los servicios
	public function getResponsable($id_servicio, $tipo_ejecutivo, $id_usuario)
	{
		$sql = '
				SELECT  *
				FROM  cmx_clientes_serv_responsables ccsr
				WHERE  ccsr.id_serv_contratado = ' . $id_servicio . '
					AND ccsr.id_usuario = ' . $id_usuario . '
					AND ccsr.tipo_ejecutivo = "' . $tipo_ejecutivo . '"
			';
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	// Función para buscar los responsables de los servicios ofrecidos al cliente
	public function getResponsableServicio($id_servicio, $tipo_ejecutivo, $id_perfil)
	{
		$sql = '
				SELECT  ccsr.id, ccsr.tipo_ejecutivo, ccsr.participacion,
					cu.id ID_USUARIO, cu.nom_usuario, cu.user_log, cu.email, 
					cp.id ID_PERFIL, cp.nombre_perfil
				FROM cmx_clientes_serv_responsables ccsr
					INNER JOIN cmx_usuarios cu ON cu.id = ccsr.id_usuario
					INNER JOIN cmx_usuario_cliente cuc ON cuc.id_usuario = cu.id
					INNER JOIN cmx_perfiles cp ON cp.id = cuc.id_perfil
				WHERE  ccsr.id_serv_contratado = ' . $id_servicio . '
					AND ccsr.tipo_ejecutivo = "' . $tipo_ejecutivo . '"
					AND cp.id IN (' . $id_perfil . ')
					AND ccsr.estado = 1
					AND cu.estado = 1
					AND cuc.estado = 1
					AND cp.estado = 1
			';
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	// Función para buscar tipo de documentos de una lista de id de tipo de documento  
	public function getListaTipoDocumentoById($lista_documentos)
	{
		$sql = '
				SELECT * 
				FROM cmx_clientes_tipo_documento cctd
				WHERE cctd.id IN (' . $lista_documentos . ')
			';
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	// Función para buscar documentos por el numero de documento 
	public function buscarDocumentoByNumDocumento($id_cliente, $documento, $tipo_documento)
	{
		$sql = '
				SELECT * 
				FROM cmx_clientes_documentos ccd
				WHERE ccd.id_cliente = ' . $id_cliente . '
					AND ccd.numero_documento = "' . $documento . '"
					AND ccd.id_tipo_documento = "' . $tipo_documento . '"
					AND ccd.estado IN ("1","2")
			';
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	// Función para buscar documentos por la fecha de expedición 
	public function buscarDocumentoByFecha($id_cliente, $fecha, $tipo_documento)
	{
		$sql = '
				SELECT * 
				FROM cmx_clientes_documentos ccd
				WHERE ccd.id_cliente = ' . $id_cliente . '
					AND ccd.fecha_expedicion = "' . $fecha . '"
					AND ccd.id_tipo_documento = ' . $tipo_documento . '
					AND ccd.estado IN ("1","2")
			';
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	// Función para determinar si el cliente ya tiene algún documento específico registrado en la base de datos
	public function buscarDocumentoRespresentante($array, $tipo_documento, $tipo_miembro)
	{
		$return = false;
		foreach ($array["rowsData"] as $key => $value) {
			if ($value["ID_TIPO_DOCUMENTO"] == $tipo_documento and $value["tipo_miembro"] == $tipo_miembro) {
				$return["flag"] = true;
				$return["content"] = $value;
				break;
			}
		}
		return $return;
	}

	// Función para determinar si el cliente ya tiene algún documento específico registrado en la base de datos
	public function buscarDocumentoSocio($array, $id_socio, $tipo_documento, $tipo_miembro)
	{
		$return = false;
		foreach ($array["rowsData"] as $key => $value) {
			if ($value["ID_TIPO_DOCUMENTO"] == $tipo_documento and $value["tipo_miembro"] == $tipo_miembro and $value["ID_MIEMBRO"] == $id_socio) {
				$return["flag"] = true;
				$return["content"] = $value;
				break;
			}
		}
		return $return;
	}

	// Función para buscar miembros del cliente 
	public function getMiembroClienteActivo($id_cliente, $documento, $tipo_miembro)
	{
		$sql = '
				SELECT * 
				FROM cmx_clientes_miembros ccm
				WHERE id_cliente = ' . $id_cliente . '
					AND estado IN (1,2)
					AND documento = "' . $documento . '"
					AND tipo_miembro = "' . $tipo_miembro . '"
			';
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	// Funcion para buscar documentos de los miembros del cliente 
	public function buscarDocumentoMiembro($id_cliente, $tipo_documento, $tipo_miembro)
	{
		$sql = '
				SELECT ccmd.*
				FROM cmx_clientes_miembros ccm
					INNER JOIN cmx_clientes_miembros_documentos ccmd ON ccmd.id_miembro = ccm.id
				WHERE ccm.tipo_miembro = "' . $tipo_miembro . '"
					AND ccm.id_cliente = ' . $id_cliente . '
					AND ccmd.id_tipo_documento = ' . $tipo_documento . '
					AND ccm.estado = 1
					AND ccmd.estado = 1
			';
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	// Función para guardar los datos de los documentos del cliente 
	public function guardarDatosDocumentos($array, $id_cliente)
	{
		if (isset($array["numero_documento"])) {
			$_flag_documento = $this->buscarDocumentoByNumDocumento($id_cliente, $array["numero_documento"], $array["id_tipo_documento"]);
		} else {
			$_flag_documento = $this->buscarDocumentoByFecha($id_cliente, $array["fecha_expedicion"], $array["id_tipo_documento"]);
		}

		if (!$_flag_documento) {
			// Se inactiva el los registros anteriores de la cámara de comercio 
			$sql = '
					UPDATE cmx_clientes_documentos 
					SET estado = "0"
					WHERE 
						id_cliente = ' . $id_cliente . '
						AND id_tipo_documento = ' . $array["id_tipo_documento"] . '
				';
			$this->_db->ejecuteRegistro($sql);

			$arrayDocumento = array();
			$arrayDocumento["id_cliente"] = $id_cliente;
			$arrayDocumento["id_tipo_documento"] = $array["id_tipo_documento"];

			// Se valida si tiene un número de documento registrado
			if (isset($array["numero_documento"])) {
				$arrayDocumento["numero_documento"] = $array["numero_documento"];
			}

			// Se valida si tiene una fecha de expedición registrada
			if (isset($array["fecha_expedicion"])) {
				$arrayDocumento["fecha_expedicion"] = $array["fecha_expedicion"];
				$arrayDocumento["url_documento"] = $array["fecha_expedicion"] . "-" . $id_cliente . "." . $this->get_extension_archivo($array["url_documento"]);
			} else {
				$time = time();
				$arrayDocumento["fecha_expedicion"] = date("Y-m-d", $time);
				$arrayDocumento["url_documento"] = date("Y-m-d", $time) . "-" . $id_cliente . "." . $this->get_extension_archivo($array["url_documento"]);
			}

			// Se valida si el documento tiene novedades
			if (isset($array["novedad"])) {
				if ($array["novedad"] and $array["novedad"] != "Sin novedad") {
					$arrayDocumento["novedad"] = $array["novedad"];
				}
			}
			$id_documento = $this->_db->setRegistro("cmx_clientes_documentos", $arrayDocumento);

			// Se adiciona la información adicional de los documentos 
			switch ($array["id_tipo_documento"]) {
				case 19:
					$arraySeguro = array();
					$arraySeguro["id_documento"] = $id_documento;
					$arraySeguro["aseguradora"] = $array["aseguradora"];
					$arraySeguro["solicitante"] = $array["solicitante"];
					$arraySeguro["monto"] = $array["monto"];
					$arraySeguro["horario_transito"] = $array["horario_transito"];
					$arraySeguro["modelo_minimo_vehiculo"] = $array["modelo_minimo_vehiculo"];
					$arraySeguro["interes_asegurable"] = $array["interes_asegurable"];
					$this->_db->setRegistro("cmx_clientes_seguros", $arraySeguro);
					break;
			}
		} else {
			// Actualizacion del registro exclusivo para modificar el archivo
			if ($array["url_documento"]) {
				// Se actualiza el registro del documento
				$arrayDocumento = array();
				// Se valida si el documento tiene novedades
				if (isset($array["novedad"])) {
					if ($array["novedad"] and $array["novedad"] != "Sin novedad") {
						$arrayDocumento["novedad"] = $array["novedad"];
					}
				}
				if (!$array["fecha_expedicion"]) {
					$array["fecha_expedicion"] = date('Y-m-d', time());
				}
				$arrayDocumento["fecha_expedicion"] = $array["fecha_expedicion"];
				$arrayDocumento["url_documento"] = $array["fecha_expedicion"] . "-" . $id_cliente . "." . $this->get_extension_archivo($array["url_documento"]);
				$this->_db->updateRegistro("cmx_clientes_documentos", $arrayDocumento, (int) $_flag_documento["rowsData"][0][0]);
			}

			// Se adiciona la información adicional de los documentos 
			switch ($array["id_tipo_documento"]) {
				case 19:
					$arraySeguro = array();
					$arraySeguro["horario_transito"] = $array["horario_transito"];
					$arraySeguro["modelo_minimo_vehiculo"] = $array["modelo_minimo_vehiculo"];
					$this->_db->updateRegistro("cmx_clientes_seguros", $arraySeguro, (int) $array["id_seguro"]);
					break;
			}
		}
	}

	// Funcion para buscar documentos de los miembros del cliente 
	public function buscarDocumentoMiembroById($id_miembro, $tipo_documento, $tipo_miembro, $fecha_expedicion)
	{
		$sql = '
				SELECT ccmd.*
				FROM cmx_clientes_miembros ccm
					INNER JOIN cmx_clientes_miembros_documentos ccmd ON ccmd.id_miembro = ccm.id
				WHERE ccm.tipo_miembro = "' . $tipo_miembro . '"
					AND ccmd.id_miembro = ' . $id_miembro . '
					AND ccmd.id_tipo_documento = ' . $tipo_documento . '
					AND ccmd.fecha_expedicion = "' . $fecha_expedicion . '"
					AND ccm.estado = 1
					AND ccmd.estado = 1
			';
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	// Función para guardar los documentos de los miembros del cliente  
	public function guardarDatosDocumentosMiembros($array, $tipo_miembro)
	{
		if (isset($array["url_documento"]) and $array["url_documento"]) {
			$_flag_documento = $this->buscarDocumentoMiembroById($array["id_miembro"], $array["id_tipo_documento"], $tipo_miembro, $array["fecha_expedicion"]);
			if (!$_flag_documento) {
				// Se inactiva el los registros anteriores de la cámara de comercio 
				$sql = '
						UPDATE cmx_clientes_miembros_documentos 
						SET estado = "0"
						WHERE 
							id_miembro = ' . $array["id_miembro"] . '
							AND id_tipo_documento = ' . $array["id_tipo_documento"] . '
					';
				$this->_db->ejecuteRegistro($sql);

				// Se guarda el registro del documento
				$arrayDocumento = array();
				$arrayDocumento["id_miembro"] = $array["id_miembro"];
				$arrayDocumento["id_tipo_documento"] = $array["id_tipo_documento"];
				// Se valida si el arreglo trae novedades
				if (isset($array["novedad"]) and $array["novedad"] and $array["novedad"] != "Sin novedad") {
					$arrayDocumento["novedad"] = $array["novedad"];
				}
				// Se valida si existe una fecha de expedición
				if (isset($array["fecha_expedicion"]) and $array["fecha_expedicion"]) {
					$arrayDocumento["fecha_expedicion"] = $array["fecha_expedicion"];
					$arrayDocumento["url"] = $array["fecha_expedicion"] . "-" . $array["id_miembro"] . "." . $this->get_extension_archivo($array["url_documento"]);
				} else {
					$time = time();
					$arrayDocumento["fecha_expedicion"] = date("Y-m-d", $time);
					$arrayDocumento["url"] = date("Y-m-d", $time) . "-" . $array["id_miembro"] . "." . $this->get_extension_archivo($array["url_documento"]);
				}
				$this->_db->setRegistro("cmx_clientes_miembros_documentos", $arrayDocumento);
			} else {
				// Se guarda el registro del documento
				$arrayDocumento = array();
				// Se valida si el arreglo trae novedades
				if (isset($array["novedad"]) and $array["novedad"] and $array["novedad"] != "Sin novedad") {
					$arrayDocumento["novedad"] = $array["novedad"];
				}
				// Se valida si existe una fecha de expedición
				if (isset($array["fecha_expedicion"]) and $array["fecha_expedicion"]) {
					$arrayDocumento["fecha_expedicion"] = $array["fecha_expedicion"];
					$arrayDocumento["url"] = $array["fecha_expedicion"] . "-" . $array["id_miembro"] . "." . $this->get_extension_archivo($array["url_documento"]);
				} else {
					$time = time();
					$arrayDocumento["fecha_expedicion"] = date("Y-m-d", $time);
					$arrayDocumento["url"] = date("Y-m-d", $time) . "-" . $array["id_miembro"] . "." . $this->get_extension_archivo($array["url_documento"]);
				}
				$this->_db->updateRegistro("cmx_clientes_miembros_documentos", $arrayDocumento, (int) $_flag_documento["rowsData"][0][0]);
			}
		}
	}

	// Funcion para guardar los datos de las referencias comerciales del cliente 
	public function guardarDatosRefComercial($array, $id_cliente)
	{
		if (isset($array["id"]) and $array["id"]) {
			if ($array["url_documento"]) {
				// Se actualiza el registro de la referencia comercial
				$arrayRefComercial = array();
				$arrayRefComercial["numero_documento"] = $array["numero_documento"];
				$arrayRefComercial["fecha_expedicion"] = $array["fecha_expedicion"];
				$arrayRefComercial["url_documento"] = $array["fecha_expedicion"] . "-" . $id_cliente . "." . $this->get_extension_archivo($array["url_documento"]);
				$this->_db->updateRegistro("cmx_clientes_documentos", $arrayRefComercial, (int) $array["id"]);
				return (int) $array["id"];
			}
		} else {
			// Se guarda el registro de la referencia comercial
			$arrayRefComercial = array();
			$arrayRefComercial["id_cliente"] = $id_cliente;
			$arrayRefComercial["id_tipo_documento"] = $array["id_tipo_documento"];
			$arrayRefComercial["numero_documento"] = $array["numero_documento"];
			$arrayRefComercial["fecha_expedicion"] = $array["fecha_expedicion"];
			$arrayRefComercial["url_documento"] = $array["fecha_expedicion"] . "-" . $id_cliente . "." . $this->get_extension_archivo($array["url_documento"]);
			return $this->_db->setRegistro("cmx_clientes_documentos", $arrayRefComercial);
		}
	}

	// Función para inactivar las referencias comerciales que no sean usadas por los clientes  
	public function setInactivaRefComercial($id_cliente, $referencias)
	{
		$sql = '
				UPDATE cmx_clientes_documentos ccd
				SET estado = "0"
				WHERE 
					ccd.id_cliente = ' . $id_cliente . '
					AND ccd.id_tipo_documento = 6
					AND ccd.id NOT IN (' . $referencias . '0)
			';
		$this->_db->ejecuteRegistro($sql);
	}

	// Función para buscar cuentas bancarias de los clientes 
	public function getBancosCliente($id_cliente, $num_cuenta)
	{
		$sql = '
				SELECT * 
				FROM cmx_clientes_bancos ccb
				WHERE id_cliente = ' . $id_cliente . '
					AND numero_cuenta = "' . $num_cuenta . '"
			';
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	// Funcion para guardar los datos de las referencias bancarias del cliente 
	public function guardarDatosBanco($array, $id_cliente)
	{
		if (isset($array["id_referencia"]) and $array["id_referencia"]) {
			if ($array["url_certificado"]) {
				// Se actualiza el registro del banco
				$arrayBanco = array();
				$arrayBanco["numero_cuenta"] = $array["numero_cuenta"];
				$arrayBanco["url_certificado"] = $array["numero_cuenta"] . "-" . $id_cliente . "." . $this->get_extension_archivo($array["url_certificado"]);
				$this->_db->updateRegistro("cmx_clientes_bancos", $arrayBanco, (int) $array["id_referencia"]);
			}
		} else {
			// Se guarda el registro del banco
			$arrayBanco = array();
			$arrayBanco["id_cliente"] = $id_cliente;
			$arrayBanco["banco"] = $array["banco"];
			$arrayBanco["tipo_cuenta"] = $array["tipo_cuenta"];
			$arrayBanco["numero_cuenta"] = $array["numero_cuenta"];
			$arrayBanco["url_certificado"] = $array["numero_cuenta"] . "-" . $id_cliente . "." . $this->get_extension_archivo($array["url_certificado"]);
			$this->_db->setRegistro("cmx_clientes_bancos", $arrayBanco);
		}
	}

	// Función para inactivar las cuentas bancarias que no sean usadas por los clientes  
	public function setInactivaCuentasCliente($id_cliente, $cuentas)
	{
		$sql = '
				UPDATE cmx_clientes_bancos ccb
				SET estado = "Inactivo"
				WHERE ccb.id_cliente = ' . $id_cliente . '
					AND ccb.numero_cuenta NOT IN (' . $cuentas . ')
			';
		$this->_db->ejecuteRegistro($sql);
	}

	// Función que determina si ya el cliente tiene registrado todos los documentos para su aprobación  
	public function getValidaDocumentosAprobacion($result)
	{
		/****** REFERENCIAS COMERCIALES ******/
		$_referencias_flag = false;
		if (isset($result["referencias_comerciales"]) and $result["referencias_comerciales"] and isset($result["bancos"]) and $result["bancos"]) {
			$_referencias_flag = true;
		}

		/****** FORMATOS ******/
		$_formatos_flag = true;
		$certificaciones = $this->getListaTipoDocumentoById("12,13,14");
		foreach ($certificaciones["rowsData"] as $key => $value) {
			if ($result["documentos"]) {
				$_flag_documento = $this->buscarDocumento($result["documentos"], $value["id"]);
				if (!$_flag_documento) {
					$_formatos_flag = false;
					break;
				}
			} else {
				$_formatos_flag = false;
			}
		}

		/****** SEGURIDAD ******/
		$_seguridad_flag = true;

		// Cliente
		$_cliente_rows = "";
		$seguridad = $this->getListaTipoDocumentoById("15,17,18");
		foreach ($seguridad["rowsData"] as $key => $value) {
			if ($result["documentos"]) {
				$_flag_documento = $this->buscarDocumento($result["documentos"], $value["id"]);
				if (!$_flag_documento) {
					$_seguridad_flag = false;
					break;
				}
			} else {
				$_seguridad_flag = false;
			}
		}

		// Representante legal 
		if ($_seguridad_flag) {
			if ($result["representante_legal"]) {
				$seguridad = $this->getListaTipoDocumentoById("16,15");
				foreach ($seguridad["rowsData"] as $key => $value) {
					if ($result["documentos_miembros"]) {
						$_flag_documento = $this->buscarDocumentoRespresentante($result["documentos_miembros"], $value[0], "Representante Legal");
						if (!$_flag_documento["flag"]) {
							$_seguridad_flag = false;
							break;
						}
					} else {
						$_seguridad_flag = false;
						break;
					}
				}
			}
		}

		// Socios  
		if ($_seguridad_flag) {
			if ($result["socios"]) {
				$_socios_table = '';
				$seguridad = $this->getListaTipoDocumentoById("16,15");
				foreach ($result["socios"]["rowsData"] as $key_socios => $value_socios) {
					foreach ($seguridad["rowsData"] as $key => $value) {
						if ($result["documentos_miembros"]) {
							$_flag_documento = $this->buscarDocumentoSocio($result["documentos_miembros"], $value_socios[0], $value[0], "Socio");
							if (!$_flag_documento["flag"]) {
								$_seguridad_flag = false;
								break;
							}
						} else {
							$_seguridad_flag = false;
							break;
						}
					}
				}
			}
		}

		/****** FICHA TÉCNICA ******/
		$ficha_tecnica = $result["general"]["rowsData"][0];
		$_ficha_tecnica_flag = false;
		if ($ficha_tecnica["fac_cond_cumplir"] and $ficha_tecnica["fac_cond_facturar"] and $ficha_tecnica["fac_dia_max_facturacion"] and $ficha_tecnica["fac_horario_atencion"] and $ficha_tecnica["fac_direccion_radicacion"] and $ficha_tecnica["tes_plazo_pagos"] and $ficha_tecnica["tes_dias_pagos"] and $ficha_tecnica["tes_dias_informacion"] and $ficha_tecnica["tes_instruccion_pago"]) {
			$_ficha_tecnica_flag = true;
		}

		/****** FINANZAS ******/
		$_flag_calificaciones = false;
		if (isset($result["calificaciones_CIFIN"]) and $result["calificaciones_CIFIN"]) {
			$_flag_calificaciones = true;
		}

		$finanzas_flag = false;
		if ($ficha_tecnica["ingreso_neto_mensual"] and $ficha_tecnica["pasivos_corrientes"] and $ficha_tecnica["pasivos_no_corrientes"] and $ficha_tecnica["capacidad_endeudamiento"] and $ficha_tecnica["cupo_credito_base"] and $_flag_calificaciones) {
			$finanzas_flag = true;
		}

		$result = false;
		if ($_referencias_flag and $_formatos_flag and $_seguridad_flag and $_ficha_tecnica_flag and $finanzas_flag) {
			$result = true;
		}
		return $result;
	}

	// Función para buscar si un documetno ya tiene registrado las calificaciones CIFIN 
	public function getVerificaCifin($id_documento, $entidad_financiera, $calificacion)
	{
		$sql = '
				SELECT * 
				FROM cmx_clientes_cifin ccc
				WHERE ccc.id_cliente_documento = ' . $id_documento . '
					AND ccc.entidad_financiera = "' . $entidad_financiera . '"
					AND ccc.calificacion = "' . $calificacion . '"
			';
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	// Funcion para generar la lista de formatos BASC según el servicio prestado al cliente
	public function getFormFormatoBASC($documento, $result, $servicio, $id_formatos, $_flag_cambia_archivo)
	{
		$_lista_formatos = '<div class="form-group col-sm-12"></div>';
		$formatos = $this->getListaTipoDocumentoById($id_formatos);

		foreach ($formatos["rowsData"] as $key_01 => $value_01) {
			$_folder_formato = str_replace("-", "_", $value_01["folder"]);

			// Se pregunta si ya se registró el formato del cliente 
			$expedicion = "";
			$_file = '
					<div class="form-group col-sm-3">
						<label class="control-label">(*) Documento:</label><br />
						<input type="file" name="' . $_folder_formato . '_file" id="' . $_folder_formato . '_file" class="inputfile ' . $_folder_formato . '_formato">
						<label for="' . $_folder_formato . '_file" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
					</div>
				';

			if (isset($result[$_folder_formato]) and $result[$_folder_formato]) {
				$expedicion = $result[$_folder_formato]["fecha_expedicion"];

				$_cambia_archivo = '';
				if ($_flag_cambia_archivo) {
					$_cambia_archivo = '
							<div class="form-group col-sm-1 div_' . $_folder_formato . '_file">
								<br />
								<table class="table">
									<tbody>
										<tr>
											<td class="actions-nexos hint--top-left" data-hint="Ajustar Archivo">
												<center>
													<a href="javascript:" onclick="cambiaArchivos(\'link_' . $_folder_formato . '_file\')" class="cell-detail">
														<span class="icon mdi mdi-edit link_' . $_folder_formato . '_file" id="link_' . $_folder_formato . '_file"></span>
													</a>
												</center>
											</td>
										</tr>
										<tr><td></td></tr>
									</tbody>
								</table>
							</div>
						';
				}

				$_file = '
						<div class="form-group col-sm-3" id="div_' . $_folder_formato . '_file" style="display: none;">
							<label class="control-label">(*) Documento:</label><br />
							<input type="file" name="' . $_folder_formato . '_file" id="' . $_folder_formato . '_file" class="inputfile ' . $_folder_formato . '_formato">
							<label for="' . $_folder_formato . '_file" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
						</div>
						<div class="form-group col-sm-2 div_' . $_folder_formato . '_file">
							<div class="icon-container">
								<a href="' . BASE_URL . 'public/files/clientes/' . $documento . '/' . $result[$_folder_formato]["folder"] . '/' . $result[$_folder_formato]["url_documento"] . '" target="_blank" class="icon hint--top-left" data-hint="Descargar">
									<span class="mdi mdi-download"></span>
								</a>
							</div>
						</div>
						' . $_cambia_archivo . '
					';
			}

			$_lista_formatos .= '
					<div class="form-group col-sm-1"></div>
					<div class="form-group col-sm-4">
						<input type="hidden" value="' . $_folder_formato . '" class="nombre_formato">
						<input type="hidden" value="' . $value_01["id"] . '" id="' . $_folder_formato . '_documento" class="' . $_folder_formato . '_formato">
						<input type="hidden" value="' . $value_01["nombre"] . '" id="' . $_folder_formato . '_nombre">
						<strong>' . $value_01["nombre"] . '</strong>
					</div>
					<div class="form-group col-sm-3">
						<label class="control-label">(*) Fecha Expedición:</label>
						<div data-min-view="2" data-start-view="4" data-date-format="yyyy-mm-dd" data-link-field="dtp_input1" class="input-group date datetimepicker" style="padding: 0">
							<input size="10" type="text" value="' . $expedicion . '" name="' . $_folder_formato . '_expedicion" id="' . $_folder_formato . '_expedicion" readonly="" class="form-control input-sm ' . $_folder_formato . '_formato">
							<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
						</div>
					</div>
					' . $_file . '
					<div class="form-group col-sm-1"></div>
					<div class="form-group col-sm-12"></div>
				';
		}

		$_formatos = '
				<div class="panel panel-default title_servicios">
					<div class="panel-heading">
						<h4 class="panel-title">
							<a data-toggle="collapse" data-parent="#accordion1" href="#serv_cliente_' . strtolower(str_replace(" ", "_", $servicio)) . '" class="collapsed"><i class="icon mdi mdi-chevron-down"></i> Formatos BASC - ' . $servicio . '</a>
						</h4>
					</div>
					<div id="serv_cliente_' . strtolower(str_replace(" ", "_", $servicio)) . '" class="panel-collapse collapse">
						<div class="panel-body">
							' . $_lista_formatos . ' 
						</div>
					</div>
				</div>
			';
		return $_formatos;
	}

	/***** FUNCIONES PARA EL POPUP DE ADMINISTRACIÓN DE CONTRATOS EN EL MÓDULO DE CLIENTES *****/
	// Función para buscar la informacion de los contratos del cliente 
	public function getContratosCliente($id)
	{
		$return = NULL;
		// Se pregunta si el cliente tiene contratos registrados 
		$sql = '
				SELECT ccc.*, ctc.nombre, ctc.descripcion, cc.documento
				FROM cmx_clientes cc
					INNER JOIN cmx_contrato_cliente ccc ON ccc.id_cliente = cc.id
					INNER JOIN cmx_tipo_contrato ctc ON ctc.id = ccc.tipo_contrato
				WHERE ccc.id_cliente = ' . $id . '
					AND ccc.estado != 4
				ORDER BY ccc.fecha_fin DESC
			';
		$result = $this->_db->getConsulta($sql);

		if ($result) {
			$return["contratos"] = $result["rowsData"];
			foreach ($result["rowsData"] as $key => $value) {
				// Se busca las cargas del contrato 
				$sql = '
						SELECT cct.id, cct.id_ciudad, cm.municipio CIUDAD, CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") MUNICIPIO, 
							cct.tipo_tramo
						FROM cmx_contrato_tramos cct
							INNER JOIN cmx_municipios cm ON cm.id = cct.id_ciudad
						WHERE cct.id_contrato = ' . $value["id"] . '
							AND cct.tipo_tramo = "Cargue"
					';
				$res = $this->_db->getConsulta($sql);
				if ($res) {
					$return["cargues"][$value["id"]] = $res["rowsData"];
				}

				// Se busca las cargas del descargue 
				$sql = '
						SELECT cct.id, cct.id_ciudad, cm.municipio CIUDAD, CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") MUNICIPIO, 
							cct.tipo_tramo
						FROM cmx_contrato_tramos cct
							INNER JOIN cmx_municipios cm ON cm.id = cct.id_ciudad
						WHERE cct.id_contrato = ' . $value["id"] . '
							AND cct.tipo_tramo = "Descargue"
					';
				$res = $this->_db->getConsulta($sql);
				if ($res) {
					$return["descargues"][$value["id"]] = $res["rowsData"];
				}

				// Se busca los tipos de vehículo del contrato
				$sql = '
						SELECT ccv.id, ccv.id_vehiculo, ccv.flete_maximo, ctv.nombre
						FROM cmx_contrato_vehiculo ccv
							INNER JOIN cmx_tipo_vehiculos ctv ON ctv.id = ccv.id_vehiculo
						WHERE ccv.id_contrato = ' . $value["id"] . '
							AND ctv.estado = 1
					';
				$res = $this->_db->getConsulta($sql);
				if ($res) {
					$return["tipos_vehiculo"][$value["id"]] = $res["rowsData"];
				}

				// Se busca las condiciones del contrato
				$sql = '
						SELECT 
							ccc.id, ccc.descripcion, ccc.id_condicion, ctcc.nombre, ctcc.descripcion PARAM_DESC_CONDICION, ctcc.tipo_dato
						FROM cmx_contrato_condiciones ccc
							INNER JOIN cmx_tipo_contrato_condicion ctcc ON ctcc.id = ccc.id_condicion
						WHERE ccc.id_contrato = ' . $value["id"] . '
					';
				$res = $this->_db->getConsulta($sql);
				if ($res) {
					$return["condiciones"][$value["id"]] = $res["rowsData"];
				}
			}
		}
		return $return;
	}

	// Función para la creación del select de tipos de contrato
	public function getEnumSlctTipoContrato_sm($name, $id, $value_select)
	{
		$sql = "
				SELECT ctc.id, ctc.nombre
				FROM cmx_tipo_contrato ctc
				WHERE ctc.estado = 1
			";
		$result = $this->_db->getConsulta($sql);

		$select = '<select class="form-control input-sm" name="' . $name . '" id="slct_' . $name . '_' . $id . '">';
		$select .= '<option value="" disabled selected>Seleccione</option>';
		foreach ($result["rowsData"] as $key => $value) {
			if ($value["id"] == $value_select) {
				$select .= '<option value="' . $value["id"] . '" selected="">' . $value["nombre"] . '</option>';
			} else {
				$select .= '<option value="' . $value["id"] . '">' . $value["nombre"] . '</option>';
			}
		}
		$select .= '</select>';
		return $select;
	}

	// Función para la creación del select de tipos de vehículo
	public function getHtmlSlctTipoVehiculos_multi($name, $id)
	{
		if ($name) {
			$query = '
					SELECT ctv.id, ctv.nombre
					FROM cmx_tipo_vehiculos ctv
					WHERE ctv.estado = 1
					ORDER BY ctv.nombre
				';
			$array = $this->_db->getConsulta($query);

			if ($array) {
				$select = '<select multiple="" class="tags tarifas" name="' . $name . '" id="slct_' . $name . '_' . $id . '">';
				foreach ($array['rowsData'] as $key => $value) {
					if ($value["id"] == $id) {
						$select .= '<option value="' . $value["id"] . '" selected="">' . $value["nombre"] . '</option>';
					} else {
						$select .= '<option value="' . $value["id"] . '">' . $value["nombre"] . '</option>';
					}
				}
				$select .= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}
		return $select;
	}

	// Función para generar las condiciones del contrato
	public function getCondicionesContrato()
	{
		$sql = '
				SELECT *
				FROM cmx_tipo_contrato_condicion ctcc
				WHERE ctcc.estado = 1
				ORDER BY ctcc.nombre
			';
		$result = $this->_db->getConsulta($sql);

		$content = '';
		if ($result) {
			foreach ($result["rowsData"] as $key => $value) {
				$_campo = '';
				switch ($value["tipo_dato"]) {
					case 'Número':
						$_campo = '<input type="number" min="0" class="form-control input-sm" name="condicion_' . $value["id"] . '_val" id="condicion_' . $value["id"] . '_val" placeholder="' . $value["nombre"] . '">';
						break;

					case 'Texto':
						$_campo = '<input type="text" class="form-control condicion_form input-sm" name="condicion_' . $value["id"] . '_val" id="condicion_' . $value["id"] . '_val" placeholder="' . $value["nombre"] . '">';
						break;

					default:
						$_campo = '<span class="text-danger"></span>';
						break;
				}
				$content .= '
						<div class="col-xs-12 col-sm-12 col-md-12">
							<div class="be-checkbox">
								<input class="condiciones param_condiciones" id="condicion_' . $value["id"] . '" type="checkbox" value="' . $value["id"] . '">
								<label for="condicion_' . $value["id"] . '">' . $value["nombre"] . '</label>
							</div>
						</div>
						<div class="form-group col-xs-12 col-sm-12 col-md-12" id="condicion_' . $value["id"] . '_content">
							<div class="col-xs-12 col-sm-12 col-md-12">
								<label class="control-label" for="condicion_' . $value["id"] . '_val">(*) ' . $value["nombre"] . ':</label>
								' . $_campo . '
							</div>
						</div>
					';
			}
		}
		return $content;
	}
	/***** FIN - FUNCIONES PARA EL POPUP DE ADMINISTRACIÓN DE CONTRATOS EN EL MÓDULO DE CLIENTES *****/

	// Función para buscar la informacion de los contratos del cliente 
	public function getDatosContrato($id)
	{
		$return = NULL;
		// Se pregunta si el cliente tiene contratos registrados 
		$sql = '
				SELECT ccc.*, ctc.nombre, ctc.descripcion
				FROM cmx_contrato_cliente ccc
					INNER JOIN cmx_tipo_contrato ctc ON ctc.id = ccc.tipo_contrato
				WHERE ccc.id = ' . $id . '
					AND ccc.estado != 4
			';
		$result = $this->_db->getConsulta($sql);

		if ($result) {
			$return["contratos"] = $result["rowsData"];
			foreach ($result["rowsData"] as $key => $value) {
				// Se busca las cargas del contrato 
				$sql = '
						SELECT cct.id, cct.id_ciudad, cm.municipio CIUDAD, CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") MUNICIPIO, 
							cct.tipo_tramo
						FROM cmx_contrato_tramos cct
							INNER JOIN cmx_municipios cm ON cm.id = cct.id_ciudad
						WHERE cct.id_contrato = ' . $value[0] . '
							AND cct.tipo_tramo = "Cargue"
					';
				$res = $this->_db->getConsulta($sql);
				if ($res) {
					$return["cargues"][$value[0]] = $res["rowsData"];
				}

				// Se busca las cargas del descargue 
				$sql = '
						SELECT cct.id, cct.id_ciudad, cm.municipio CIUDAD, CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") MUNICIPIO, 
							cct.tipo_tramo
						FROM cmx_contrato_tramos cct
							INNER JOIN cmx_municipios cm ON cm.id = cct.id_ciudad
						WHERE cct.id_contrato = ' . $value[0] . '
							AND cct.tipo_tramo = "Descargue"
					';
				$res = $this->_db->getConsulta($sql);
				if ($res) {
					$return["descargues"][$value[0]] = $res["rowsData"];
				}

				// Se busca los tipos de vehículo del contrato
				$sql = '
						SELECT ccv.id, ccv.id_vehiculo, ccv.flete_maximo, ctv.nombre
						FROM cmx_contrato_vehiculo ccv
							INNER JOIN cmx_tipo_vehiculos ctv ON ctv.id = ccv.id_vehiculo
						WHERE ccv.id_contrato = ' . $value[0] . '
							AND ctv.estado = 1
					';
				$res = $this->_db->getConsulta($sql);
				if ($res) {
					$return["tipos_vehiculo"][$value[0]] = $res["rowsData"];
				}

				// Se busca las condiciones del contrato
				$sql = '
						SELECT ccc.id, ccc.descripcion, ccc.id_condicion, ctcc.nombre, ctcc.descripcion PARAM_DESC_CONDICION, ctcc.tipo_dato
						FROM cmx_contrato_condiciones ccc
							INNER JOIN cmx_tipo_contrato_condicion ctcc ON ctcc.id = ccc.id_condicion
						WHERE ccc.id_contrato = ' . $value[0] . '
					';
				$res = $this->_db->getConsulta($sql);
				if ($res) {
					$return["condiciones"][$value[0]] = $res["rowsData"];
				}
			}
		}
		return $return;
	}

	public function Insertar_Sedes($idcliente, $sedes)
	{
		session_start();
		$resultado = $this->_db2->conectar();
		$factual = date('Y-m-d');
		$horactual = date('H:i:s');
		$id_usuario = $_SESSION["usuario"]["nom_usuario"];
		try {
			//registrar sedes
			$i = 0;
			while ($i < count($sedes->instruccion)) {
				$name = $sedes->nombre[$i];
				$municipio = $sedes->municipio[$i];
				$dire = $sedes->direccion[$i];
				$tel = $sedes->telefono[$i];
				$persona = $sedes->encargado[$i];
				$correo = $sedes->correo[$i];
				$cod_postal = $sedes->cod_postal[$i];
				$atencion = $sedes->informacion[$i];
				$condi_pago = $sedes->cond_pago[$i];
				$condi_factu = $sedes->cond_factu[$i];
				$restriccion = $sedes->restri_acceso[$i];
				$instru = $sedes->instruccion[$i];
				$tribut = $sedes->tributaria[$i];

				$resultado->prepare("insert into cmx_cliente_sede(id,id_cliente,nombre_sede,ciudad,direccion,telefono,encargado,correo,codigo_postal,estado,condicion_facturacion,condicion_pago,dia_informacion,restriccion_acceso,instruccion_especial,obligacion_tributaria)values(null,:cliente,:sede,:city,:direccion,:telefono,:persona,:email,:postal,:statu,:condi_factu,:condi_pago,:atencion,:restriccion,:instruccion,:tributario)")->execute(
					array(
						':cliente' => $idcliente,
						':sede' => $name,
						':city' => $municipio,
						':direccion' => $dire,
						':telefono' => $tel,
						':persona' => $persona,
						':email' => $correo,
						':postal' => $cod_postal,
						':statu' => 1,
						':condi_factu' => $condi_factu,
						':condi_pago' => $condi_pago,
						':atencion' => $atencion,
						':restriccion' => $restriccion,
						':instruccion' => $instru,
						':tributario' => $tribut
					)
				);
				$i++;
			}
			if ($resultado) {
				return 'true';
			}
		} catch (PDOExeption $e) {
			$error = $e->getMessage();
			$this->_db2->rollBack();
			return 'false';
		}
	}


	public function Obligacion_Tributaria()
	{
		$sql = "SELECT  id,codigo, descripcion
						FROM cmx_para_obligacion_tributaria
						WHERE estado=1";
		$result = $this->_db->getConsulta($sql);
		$select = '<select class="form-control input-sm" id="slct_sede_otributaria">';
		$select .= '<option value="" disabled selected>Seleccione</option>';
		foreach ($result["rowsData"] as $key => $value) {
			$select .= '<option  value="' . $value['id'] . '">' . $value['codigo'] . ' ' . $value['descripcion'] . '</option>';
		}
		$select .= '</select>';
		return $select;
	}


	//Funcion para cargar las empresas para asociarlas al cliente
	public function Listar_Empresas()
	{
		$sql = "SELECT  * FROM cmx_empresas WHERE estado_empresa='ACTIVA'";
		$result = $this->_db->getConsulta($sql);
		$select = '<select class="form-control input-sm" id="slct_cliente_empresa">';
		$select .= '<option value="" disabled selected>Seleccione</option>';
		foreach ($result["rowsData"] as $key => $value) {
			$select .= '<option  value="' . $value['id'] . '">' . $value['cor_empresa'] . ' ' . $value['nombre_empresa'] . '</option>';
		}
		$select .= '</select>';
		return $select;
	}

	public function getClienteById($id)
	{
		$sql = 'SELECT id
				FROM cmx_clientes cc
				WHERE cc.documento =' . $id;
		$result = $this->_db->getConsulta($sql);
		return $result;
	}


	public function getSedeCliente($tipo, $id, $digito)
	{
		if ($tipo == "NIT") {
			$sql = 'SELECT codigo_sede FROM cmx_clientes WHERE documento=' . $id . '
				AND digito_verificacion=' . $digito . '';
		} else {
			$sql = 'SELECT codigo_sede FROM cmx_clientes WHERE documento=' . $id . '';
		}
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	public function getSedeClienteE($tipo, $id, $digito)
	{
		if ($tipo == "Juridico") {
			$sql = 'SELECT codigo_sede FROM cmx_clientes WHERE documento=' . $id . '
				AND digito_verificacion=' . $digito . '';
		} else {
			$sql = 'SELECT codigo_sede FROM cmx_clientes WHERE documento=' . $id . '';
		}
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	public function getSedeRem($tipo, $id, $digito)
	{
		if ($tipo == "NIT") {
			$sql = 'SELECT codigo_sede FROM cmx_remitente_destinatario WHERE documento=' . $id . '
				AND digito_verificacion=' . $digito . '';
		} else {
			$sql = 'SELECT codigo_sede FROM cmx_remitente_destinatario WHERE documento=' . $id . '';
		}
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	public function getSedeRemE($tipo, $id, $digito)
	{
		if ($tipo == "NIT") {
			$sql = 'SELECT codigo_sede FROM cmx_remitente_destinatario WHERE documento=' . $id . '
				AND digito_verificacion=' . $digito . '';
		} else {
			$sql = 'SELECT codigo_sede FROM cmx_remitente_destinatario WHERE documento=' . $id . '';
		}
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	/**
	 * Valida si la empresa asociada al cliente ha sido cambiada
	 * @param int $empresa id de la empresa
	 * @param int $clinete id del cliente
	 * @return array resultados de la consulta
	 */
	public function ValidarEmpresaCambio($empresa, $clinete)
	{
		$sql = 'SELECT empresa FROM cmx_clientes WHERE id=' . $clinete . '';
		$result = $this->_db->getConsulta($sql);
		// var_dump($result["rowsData"][0]["empresa"]);
		return $result;
	}
}
