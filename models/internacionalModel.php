<?php
class internacionalModel extends Model
{

	public function __construct()
	{
		parent::__construct();
	}

	public function getConceptos()
	{
		// Se busca los conceptos disponibles
		$sql = 'SELECT * FROM cmx_intr_conceptos cic WHERE cic.estado = 1';
		$result = $this->_db3->prepare($sql);
		$result->execute();
		return $result->fetchAll(PDO::FETCH_ASSOC);

		// $result = $this->_db->getConsulta($sql);
		// return $result;
	}

	/********* FUNCIONES DEL MÓDULO DE TRM MONEDAS *********/
	public function getTrmMonedas()
	{
		// Se busca los conceptos disponibles
		$sql = $this->_db3->prepare('SELECT ctm.id, ctm.fecha, ctm.valor, cm.nom_moneda, cm.codigo
			FROM cmx_monedas_trm ctm
			INNER JOIN cmx_monedas cm ON cm.id = ctm.id_moneda
			WHERE cm.estado = 1
			ORDER BY ctm.fecha DESC, cm.nom_moneda');
		$sql->execute();

		// return $sql->fetch(PDO::FETCH_ASSOC);
		return $sql->fetchAll(PDO::FETCH_ASSOC);

		// $result = $this->_db->getConsulta($sql);
		// return $result;
	}
	/********* FIN - FUNCIONES DEL MÓDULO DE TRM MONEDAS *********/

	/********* FUNCIONES DEL MÓDULO DE COTIZACIONES *********/
	public function getProyectosCotizacion()
	{
		$usuario = $_SESSION["usuario"];
		$_falg_serv_cliente = false;
		if ($usuario["id_perfil"] == 22 or $usuario["id_perfil"] == 25 or $usuario["id_perfil"] == 26 or $usuario["id_perfil"] == 29  or $usuario["id_perfil"] == 1) {
			$_falg_serv_cliente = true;
		}

		if ($this->validaAdministrador($usuario["id_perfil"], $_falg_serv_cliente)) {
			$sql = 'SELECT cis.id ID_PROYECTO_INTERNACIONAL, 
					cip.tipo_operacion, cip.numero_importacion, cip.importacion, cip.fecha_hora, cia.fecha_hora_inicio,
					cc.cod_cliente, CONCAT(cc.documento, "-", cc.digito_verificacion) DOC_CLIENTE, cc.sigla, cc.nombre,
					cis.tipo_transporte, cis.incoterm, cis.valor_declarado, 
					IF( cis.id_moneda IS NOT NULL,
						(	SELECT CONCAT( cm.nom_moneda, " (", cm.codigo, ")" )
							FROM cmx_monedas cm 
							WHERE cm.id = cis.id_moneda
						),
						NULL 
					) MONEDA,
					(	SELECT COUNT( DISTINCT(cic1.id_concepto) ) CUANTOS
						FROM cmx_intr_cotizaciones cic1
						WHERE cic1.id_intr_proyecto = cis.id
						AND cic1.estado != 2
					) CONCEPTOS_COTIZADOS,
					(	SELECT COUNT( DISTINCT(cic1.id_concepto) ) CUANTOS
						FROM cmx_intr_cotizaciones cic1
						WHERE cic1.id_intr_proyecto = cis.id
						AND cic1.estado = 1
					) COTIZACIONES_APROBADAS,
					IF((	SELECT COUNT(cic1.id)
							FROM cmx_intr_cotizaciones cic1
							WHERE cic1.id_intr_proyecto = cis.id
							AND cic1.estado != 2 ) > 0,
							IF((	SELECT COUNT( DISTINCT(cic1.id_concepto) ) CUANTOS
									FROM cmx_intr_cotizaciones cic1
									WHERE cic1.id_intr_proyecto = cis.id
									AND cic1.estado != 2
								) = (	SELECT COUNT( DISTINCT(cic1.id_concepto) ) CUANTOS
										FROM cmx_intr_cotizaciones cic1
										WHERE cic1.id_intr_proyecto = cis.id
											AND cic1.estado = 1
								)
							,2,1),
							0
					) COTIZACIONES,
					(	SELECT COUNT(cit1.id)
						FROM cmx_intr_tramos cit1
						WHERE cit1.id_intr_proyecto = cis.id
							AND cit1.tipo_tramo = "Descargue"
					) DESTINOS,
					(	SELECT COUNT(cioc1.id)
						FROM cmx_intr_oferta_comercial cioc1
						WHERE cioc1.id_intr_proyecto = cis.id
							AND cioc1.estado = 1
					) CANT_OFERTA_COMERCIAL,
					(	SELECT cioc1.fecha
						FROM cmx_intr_oferta_comercial cioc1
						WHERE cioc1.id_intr_proyecto = cis.id
							AND cioc1.estado = 1
					) FECHA_OFERTA_COMERCIAL,
					(	SELECT cioc1.url
						FROM cmx_intr_oferta_comercial cioc1
						WHERE cioc1.id_intr_proyecto = cis.id
							AND cioc1.estado = 1
					) URL_OFERTA_COMERCIAL,
					(	SELECT cioc1.valor
						FROM cmx_intr_oferta_comercial cioc1
						WHERE cioc1.id_intr_proyecto = cis.id
							AND cioc1.estado = 1
					) VALOR_OFERTA_COMERCIAL,
					(	SELECT cm1.codigo
						FROM cmx_intr_oferta_comercial cioc1
							INNER JOIN cmx_monedas cm1 ON cm1.id = cioc1.id_moneda
						WHERE cioc1.id_intr_proyecto = cis.id
							AND cioc1.estado = 1
					) MONEDA_OFERTA_COMERCIAL,
					IF((	SELECT COUNT(cic1.id)
							FROM cmx_intr_cotizaciones cic1
							WHERE cic1.id_intr_proyecto = cis.id
								AND cic1.estado != 2
						) > 0,
						(	SELECT MIN(cic1.fecha_cotizacion)
							FROM cmx_intr_cotizaciones cic1
							WHERE cic1.id_intr_proyecto = cis.id
								AND cic1.estado != 2
								AND cic1.id = (
									SELECT MIN(cic2.id)
									FROM cmx_intr_cotizaciones cic2
									WHERE cic2.id = cic1.id
								)
						), NULL
					) FECHA_PRIMER_COTIZACION,
					IF((SELECT COUNT(cic1.id)
							FROM cmx_intr_cotizaciones cic1
							WHERE cic1.id_intr_proyecto = cis.id
								AND cic1.estado != 2
						)> 0,
					(SELECT MIN(cic1.hora_cotizacion)
							FROM cmx_intr_cotizaciones cic1
							WHERE cic1.id_intr_proyecto = cis.id
								AND cic1.estado != 2
								AND cic1.id = (
									SELECT MIN(cic2.id)
									FROM cmx_intr_cotizaciones cic2
									WHERE cic2.id = cic1.id
								)
						), NULL
					) HORA_PRIMER_COTIZACION,
					(	
						SELECT COUNT( cic1.id ) CUANTOS
						FROM cmx_intr_cotizaciones cic1
						WHERE cic1.id_intr_proyecto = cis.id
						AND cic1.estado IN(0,1,2)
					)CANT_COTIZACINES,
					(	
						SELECT COUNT(cic1.id) CUANTOS
						FROM cmx_intr_cotizaciones cic1
						INNER JOIN cmx_intr_conceptos con
						ON cic1.id_concepto=con.id 
						WHERE cic1.id_concepto=1
						AND cic1.id_intr_proyecto = cis.id
					)CANT_COTIZACINES_INLAND,
					(	
						SELECT COUNT(cic1.id) CUANTOS
						FROM cmx_intr_cotizaciones cic1
						INNER JOIN cmx_intr_conceptos con
						ON cic1.id_concepto=con.id 
						WHERE cic1.id_concepto=2
						AND cic1.id_intr_proyecto = cis.id
					)CANT_COTIZACINES_FLETE


				FROM cmx_importacion_proyecto cip
					INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
					INNER JOIN cmx_intr_solicitudes cis ON cis.id_proyecto = cip.id
					INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
				WHERE cip.estado = 1
					AND cia.tipo_actividad = "intr_cotizacion"
					AND cia.estado = 2
			';
		} else {
			$sql = 'SELECT cis.id ID_PROYECTO_INTERNACIONAL, 
					cip.tipo_operacion, cip.numero_importacion, cip.importacion, cia.fecha_hora_inicio,
					cc.cod_cliente, CONCAT(cc.documento, "-", cc.digito_verificacion) DOC_CLIENTE, cc.sigla, cc.nombre,
					cis.tipo_transporte, cis.incoterm, cis.valor_declarado, 
					IF( cis.id_moneda IS NOT NULL,
						(	SELECT CONCAT( cm.nom_moneda, " (", cm.codigo, ")" )
							FROM cmx_monedas cm 
							WHERE cm.id = cis.id_moneda
						), NULL 
					) MONEDA,
					(	SELECT COUNT( DISTINCT(cic1.id_concepto) ) CUANTOS
						FROM cmx_intr_cotizaciones cic1
						WHERE cic1.id_intr_proyecto = cis.id
						AND cic1.estado != 2
					) CONCEPTOS_COTIZADOS,
					(	SELECT COUNT( DISTINCT(cic1.id_concepto) ) CUANTOS
						FROM cmx_intr_cotizaciones cic1
						WHERE cic1.id_intr_proyecto = cis.id
						AND cic1.estado = 1
					) COTIZACIONES_APROBADAS,
					IF((	SELECT COUNT(cic1.id)
							FROM cmx_intr_cotizaciones cic1
							WHERE cic1.id_intr_proyecto = cis.id
							AND cic1.estado != 2 ) > 0,
						IF((	SELECT COUNT( DISTINCT(cic1.id_concepto) ) CUANTOS
								FROM cmx_intr_cotizaciones cic1
								WHERE cic1.id_intr_proyecto = cis.id
								AND cic1.estado != 2
						) = (	SELECT COUNT( DISTINCT(cic1.id_concepto) ) CUANTOS
								FROM cmx_intr_cotizaciones cic1
								WHERE cic1.id_intr_proyecto = cis.id
									AND cic1.estado = 1
						)
						,2,1),
						0
					) COTIZACIONES,
					(	SELECT COUNT(cit1.id)
						FROM cmx_intr_tramos cit1
						WHERE cit1.id_intr_proyecto = cis.id
							AND cit1.tipo_tramo = "Descargue"
					) DESTINOS,
					(	SELECT COUNT(cioc1.id)
						FROM cmx_intr_oferta_comercial cioc1
						WHERE cioc1.id_intr_proyecto = cis.id
							AND cioc1.estado = 1
					) CANT_OFERTA_COMERCIAL,
					(	SELECT cioc1.fecha
						FROM cmx_intr_oferta_comercial cioc1
						WHERE cioc1.id_intr_proyecto = cis.id
							AND cioc1.estado = 1
					) FECHA_OFERTA_COMERCIAL,
					(	SELECT cioc1.url
						FROM cmx_intr_oferta_comercial cioc1
						WHERE cioc1.id_intr_proyecto = cis.id
							AND cioc1.estado = 1
					) URL_OFERTA_COMERCIAL,
					(	SELECT cioc1.valor
						FROM cmx_intr_oferta_comercial cioc1
						WHERE cioc1.id_intr_proyecto = cis.id
							AND cioc1.estado = 1
					) VALOR_OFERTA_COMERCIAL,
					(	SELECT cm1.codigo
						FROM cmx_intr_oferta_comercial cioc1
							INNER JOIN cmx_monedas cm1 ON cm1.id = cioc1.id_moneda
						WHERE cioc1.id_intr_proyecto = cis.id
							AND cioc1.estado = 1
					) MONEDA_OFERTA_COMERCIAL,
					IF((	SELECT COUNT(cic1.id)
							FROM cmx_intr_cotizaciones cic1
							WHERE cic1.id_intr_proyecto = cis.id
								AND cic1.estado != 2
						) > 0,
						(	SELECT MIN(cic1.fecha_cotizacion)
							FROM cmx_intr_cotizaciones cic1
							WHERE cic1.id_intr_proyecto = cis.id
								AND cic1.estado != 2
								AND cic1.id = (
									SELECT MIN(cic2.id)
									FROM cmx_intr_cotizaciones cic2
									WHERE cic2.id = cic1.id
								)
						),
						NULL
					) FECHA_PRIMER_COTIZACION,
					IF((SELECT COUNT(cic1.id)
							FROM cmx_intr_cotizaciones cic1
							WHERE cic1.id_intr_proyecto = cis.id
								AND cic1.estado != 2
						)> 0,
					(SELECT MIN(cic1.hora_cotizacion)
							FROM cmx_intr_cotizaciones cic1
							WHERE cic1.id_intr_proyecto = cis.id
								AND cic1.estado != 2
								AND cic1.id = (
									SELECT MIN(cic2.id)
									FROM cmx_intr_cotizaciones cic2
									WHERE cic2.id = cic1.id
								)
						), NULL
					) HORA_PRIMER_COTIZACION,
					(	
						SELECT COUNT( cic1.id ) CUANTOS
						FROM cmx_intr_cotizaciones cic1
						WHERE cic1.id_intr_proyecto = cis.id
						AND cic1.estado IN(0,1,2)
					)CANT_COTIZACINES
				FROM cmx_importacion_proyecto cip
					INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
					INNER JOIN cmx_intr_solicitudes cis ON cis.id_proyecto = cip.id
					INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
				WHERE cip.estado = 1
					AND cia.tipo_actividad = "intr_cotizacion"
					AND cia.estado = 2
					AND cip.estado = 1
					AND cia.perfil_responsable IN(
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
			';
		}
		// $result = $this->_db->getConsulta($sql);
		// return $result;
		$result = $this->_db3->prepare($sql);
		$result->execute();
		return $result->fetchAll(PDO::FETCH_ASSOC);
	}

	public function getDatosCotizacion($id)
	{
		// Validar que el ID sea válido
		if (!is_numeric($id) || $id <= 0) {
			throw new InvalidArgumentException('El ID debe ser un número válido.');
		}

		$result = [];

		try {
			// Se busca la información básica de la cotización
			$sql = 'SELECT cis.id ID_PROYECTO_INTERNACIONAL,
                cip.tipo_operacion, cip.numero_importacion, cip.importacion,
                IF(cip.tipo_contenedor,
                    (   SELECT CONCAT(cip.contenedor, " (", ctc1.nombre, ")")
                        FROM cmx_tipo_contenedor ctc1
                        WHERE ctc1.id = cip.tipo_contenedor
                    ),
                    NULL
                ) CONTENEDOR,
                cc.cod_cliente, CONCAT(cc.documento, "-", cc.digito_verificacion) DOC_CLIENTE, 
                cc.sigla, cc.nombre,
                cis.tipo_transporte, cis.incoterm, cis.valor_declarado, 
                IF(cis.id_moneda IS NOT NULL,
                    (   SELECT CONCAT(cm.nom_moneda, " (", cm.codigo, ")")
                        FROM cmx_monedas cm 
                        WHERE cm.id = cis.id_moneda
                    ),
                    NULL
                ) MONEDA,
                cia.id ID_ACTIVIDAD, cia.orden, cia.fecha_hora_inicio, cia.id_importacion, 
                cia.bloque, cia.grupo, cia.simultaneo, cia.tipo_actividad, 
                cia.costo_real, cia.respuesta 
            FROM cmx_importacion_proyecto cip
            INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
            INNER JOIN cmx_intr_solicitudes cis ON cis.id_proyecto = cip.id
            INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
            WHERE cis.id = :id
              AND cia.tipo_actividad = "intr_cotizacion"
              AND cia.estado = 2';

			$stmt = $this->_db3->prepare($sql);
			$stmt->execute(['id' => $id]);
			$result["general"] = $stmt->fetch(PDO::FETCH_ASSOC);

			// Se busca los tramos del proyecto
			$result["tramos"] = $this->getTramosMaterialProyecto($id);

			// Se busca los materiales del proyecto
			$result["materiales"] = $this->getMaterialProyecto($id);

			// Se liquida los valores de las cotizaciones
			$result["calcula_cotizacion"] = $this->getCalculaCotizacion($id);

			// Se busca la oferta comercial ofrecida al cliente
			$sql = 'SELECT cioc.*, CONCAT(cm.nom_moneda, " (", cm.codigo, ")") AS MONEDA
                FROM cmx_intr_oferta_comercial cioc
                INNER JOIN cmx_monedas cm ON cm.id = cioc.id_moneda
                WHERE cioc.id_intr_proyecto = :id
                  AND cioc.estado = 1';
			$stmt = $this->_db3->prepare($sql);
			$stmt->execute(['id' => $id]);
			$result['oferta_comercial'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

			// Se buscan las cotizaciones realizadas del proyecto
			$sql = 'SELECT * FROM cmx_intr_conceptos cic WHERE cic.estado = 1';
			$stmt = $this->_db3->query($sql);
			$conceptos = $stmt->fetchAll(PDO::FETCH_ASSOC);

			$array_cotizaciones = [];
			$array_proveedores = [];

			foreach ($conceptos as $concepto) {
				// Se buscan las cotizaciones realizadas en el proyecto del concepto
				$sql = 'SELECT * 
                    FROM cmx_intr_cotizaciones cico 
                    WHERE cico.id_intr_proyecto = :id_proyecto 
                      AND cico.id_concepto = :id_concepto  
                      AND cico.estado != 2';
				$stmt = $this->_db3->prepare($sql);
				$stmt->execute([
					'id_proyecto' => $id,
					'id_concepto' => $concepto['id']
				]);
				$cotizaciones = $stmt->fetchAll(PDO::FETCH_ASSOC);

				if ($cotizaciones) {
					$array_cotizaciones[$concepto['id']] = $cotizaciones;

					// Se busca el proveedor de la cotización
					foreach ($cotizaciones as $cotizacion) {
						if (!empty($cotizacion['id_proveedor'])) {
							$sql = 'SELECT cp.*, cap.actividad, cm.municipio, cm.depto, cm.pais, 
                                       CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS CIUDAD 
                                FROM cmx_proveedores cp
                                INNER JOIN cmx_actividad_proveedor cap ON cap.id_proveedor = cp.id
                                INNER JOIN cmx_municipios cm ON cm.id = cp.id_municipio
                                WHERE cp.id = :id_proveedor 
                                  AND cp.estado = "Activo" 
                                  AND cap.actividad = "Proveedor"';
							$stmt = $this->_db3->prepare($sql);
							$stmt->execute(['id_proveedor' => $cotizacion['id_proveedor']]);
							$proveedor = $stmt->fetchAll(PDO::FETCH_ASSOC);
							$array_proveedores[$concepto['id']][$cotizacion['id']] = $proveedor;
						}
					}
				}
			}

			$result['cotizaciones'] = $array_cotizaciones;
			$result['proveedores'] = $array_proveedores;
		} catch (PDOException $e) {
			// Manejo de errores de base de datos
			error_log('Error en getDatosCotizacion: ' . $e->getMessage());
			throw new RuntimeException('Ocurrió un error al obtener los datos de la cotización.');
		}

		return $result;
	}


	public function setInactivaCotizaciones($id_intr_proyecto, $id_concepto)
	{
		$sql = '
			SELECT cico.id
			FROM cmx_intr_cotizaciones cico
			WHERE cico.id_intr_proyecto = ' . $id_intr_proyecto . '	
				AND cico.id_concepto = ' . $id_concepto . '
				AND cico.estado != 2
		';
		$result = $this->_db->getConsulta($sql);

		if ($result) {
			foreach ($result["rowsData"] as $key => $value) {
				$array = array();
				$array["estado"] = 0;
				$this->_db->updateRegistro("cmx_intr_cotizaciones", $array, (int)$value[0]);
			}
		}
	}
	/********* FIN - FUNCIONES DEL MÓDULO DE COTIZACIONES *********/

	/********* FUNCIONES DEL MÓDULO DE SUBIR FACTURAS PROVEEDOR *********/
	public function getProyectosSubeFacturas()
	{
		$usuario = $_SESSION["usuario"];
		$_falg_perfil = false;
		if (
			$usuario["id_perfil"] == 24 or $usuario["id_perfil"] == 22 or $usuario["id_perfil"] == 25
			or $usuario["id_perfil"] == 29 or $usuario["id_perfil"] == 31 or $usuario["id_perfil"] == 32
		) {
			$_falg_perfil = true;
		}

		if ($this->validaAdministrador($usuario["id_perfil"], $_falg_perfil)) {
			$sql = '
				SELECT cis.id ID_PROYECTO_INTERNACIONAL, 
					cip.tipo_operacion, cip.numero_importacion, cip.importacion, cis.do,
					cc.cod_cliente, CONCAT(cc.documento, "-", cc.digito_verificacion) DOC_CLIENTE, cc.sigla, cc.nombre,
					cis.tipo_transporte, cis.incoterm, cis.valor_declarado, cia.fecha_hora_inicio,
					IF( cis.id_moneda IS NOT NULL,
						(	SELECT CONCAT( cm.nom_moneda, " (", cm.codigo, ")" )
							FROM cmx_monedas cm 
							WHERE cm.id = cis.id_moneda
						),
						NULL 
					) MONEDA
				FROM cmx_importacion_proyecto cip
					INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
					INNER JOIN cmx_intr_solicitudes cis ON cis.id_proyecto = cip.id
					INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
				WHERE cia.tipo_actividad = "intr_sube_facturas"
					AND cip.estado = 1
					AND cia.estado = 2
					AND cis.estado = 1
			';
		} else {
			$sql = '
				SELECT cis.id ID_PROYECTO_INTERNACIONAL, 
					cip.tipo_operacion, cip.numero_importacion, cip.importacion, cis.do,
					cc.cod_cliente, CONCAT(cc.documento, "-", cc.digito_verificacion) DOC_CLIENTE, cc.sigla, cc.nombre,
					cis.tipo_transporte, cis.incoterm, cis.valor_declarado, cia.fecha_hora_inicio,
					IF( cis.id_moneda IS NOT NULL,
						(	SELECT CONCAT( cm.nom_moneda, " (", cm.codigo, ")" )
							FROM cmx_monedas cm 
							WHERE cm.id = cis.id_moneda
						),
						NULL 
					) MONEDA
				FROM cmx_importacion_proyecto cip
					INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
					INNER JOIN cmx_intr_solicitudes cis ON cis.id_proyecto = cip.id
					INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
				WHERE cia.tipo_actividad = "intr_sube_facturas"
					AND cia.estado = 2
					AND cis.estado = 1
					AND cip.estado = 1
					AND cia.perfil_responsable IN(
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
			';
		}
		// $result["general"] = $this->_db->getConsulta($sql);
		$result1 = $this->_db3->prepare($sql);
		$result1->execute();
		$result["general"] = $result1->fetchAll(PDO::FETCH_ASSOC);


		// Se verifica si la actividad de subida de facturas de puede gestionar
		if ($result["general"]) {
			foreach ($result["general"] as $key => $value) {
				$result["conceptos"][$value['ID_PROYECTO_INTERNACIONAL']] = $this->getFacturasSinAdjunto($value['ID_PROYECTO_INTERNACIONAL']);
			}
		}
		return $result;
	}

	public function getDatosSubeFacturas($id)
	{
		// Se busca la información básica de la cotización
		$sql = '
			SELECT cis.id ID_PROYECTO_INTERNACIONAL, cis.do, 
				cip.tipo_operacion, cip.numero_importacion, cip.importacion,
				IF(	cip.tipo_contenedor,
					(	SELECT CONCAT(cip.contenedor," (", ctc1.nombre,")")
						FROM cmx_tipo_contenedor ctc1
						WHERE ctc1.id = cip.tipo_contenedor
					),
					NULL
				) CONTENEDOR,
				cc.cod_cliente, CONCAT(cc.documento, "-", cc.digito_verificacion) DOC_CLIENTE, cc.sigla, cc.nombre,
				cis.tipo_transporte, cis.incoterm, cis.valor_declarado, 
				IF( cis.id_moneda IS NOT NULL,
					(	SELECT CONCAT( cm.nom_moneda, " (", cm.codigo, ")" )
						FROM cmx_monedas cm 
						WHERE cm.id = cis.id_moneda
					),
					NULL 
				) MONEDA,
				cia.id ID_ACTIVIDAD, cia.orden, cia.fecha_hora_inicio, cia.id_importacion, cia.bloque, cia.grupo, cia.simultaneo, 
				cia.tipo_actividad, cia.costo_real, cia.respuesta 
			FROM cmx_importacion_proyecto cip
				INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
				INNER JOIN cmx_intr_solicitudes cis ON cis.id_proyecto = cip.id
				INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
			WHERE cis.id =' . $id . '
				AND cia.tipo_actividad = "intr_sube_facturas"
				AND cia.estado = 2';
		$result1 = $this->_db3->prepare($sql);
		$result1->execute();
		$result["general"] = $result1->fetchAll(PDO::FETCH_ASSOC);

		// Se busca los tramos del proyecto
		$result["tramos"] = $this->getTramosMaterialProyecto($id);

		// Se busca los materiales del proyecto
		$result["materiales"] = $this->getMaterialProyecto($id);

		// Se buscan los proveedores a los que se le aprobó cotizaciones 
		$sql = '
			SELECT DISTINCT cico.id_proveedor, cico.proveedor, 
				(	SELECT COUNT(cico1.id_proveedor) CUANTOS
					FROM cmx_intr_cotizaciones cico1
					WHERE cico1.estado = 1
						AND cico1.id_concepto != 11
						AND cico1.sobrecosto = "0"
						AND cico1.id_proveedor = cico.id_proveedor
						AND cico1.id_intr_proyecto = cico.id_intr_proyecto
				) CUANTOS
			FROM cmx_intr_cotizaciones cico 
			WHERE cico.estado = 1
				AND cico.id_concepto != 11
				AND cico.id_intr_proyecto = ' . $id . '
			GROUP BY cico.id_proveedor
		';
		// $proveedores = $this->_db->getConsulta($sql);
		$proveedores = $this->_db3->prepare($sql);
		$proveedores->execute();
		$proveedores = $proveedores->fetchAll(PDO::FETCH_ASSOC);

		// Se buscan las cotizaciones del proveedor 
		if ($proveedores) {
			$result["proveedores"] = $proveedores;
			$arrayCotizaciones = [];
			$arrayFacturas = [];
			foreach ($proveedores as $key => $value) {
				// Se busca las cotizaciones realizadas en el proyecto del concepto
				$sql = '
					SELECT cico.*,
						IF( cico.id_moneda = 2,
							cico.valor,
							IF((	SELECT cmt1.valor
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
						IF(	cico.id_moneda = 1,
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
						AND cico.id_intr_proyecto = ' . $id . '
						AND cico.id_proveedor = ' . $value['id_proveedor'] . '
						AND cico.estado = 1
					ORDER BY cico.id_factura
				';
				// $cotizaciones = $this->_db->getConsulta($sql);
				$cotizaciones = $this->_db3->prepare($sql);
				$cotizaciones->execute();
				$cotizaciones = $cotizaciones->fetchAll(PDO::FETCH_ASSOC);

				if ($cotizaciones) {
					$arrayCotizaciones[$value['id_proveedor']] = $cotizaciones;
				}

				// Se busca las facturas registrados en el proyecto
				$sql = '
					SELECT DISTINCT(cif.id),
						cif.*, cico.id_intr_proyecto, cico.id_proveedor, cm.nom_moneda, cm.codigo,
						IF( cif.id_moneda = 2,
							cif.valor,
							IF((	SELECT cmt1.valor
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = cif.id_moneda
										AND cmt1.fecha = cif.fecha_factura
								),
								(	SELECT cmt1.valor
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = cif.id_moneda
										AND cmt1.fecha = cif.fecha_factura
								) * cif.valor,
								NULL
							)
						) VALOR_PESOS,
						IF ( cif.id_moneda = 1,
							cif.valor,
							IF ( cif.id_moneda = 2,
								IF ((	SELECT cmt1.valor
										FROM cmx_monedas_trm cmt1
										WHERE cmt1.id_moneda = 1
											AND cmt1.fecha = cif.fecha_factura
									),
									cif.valor / (
										SELECT cmt1.valor
										FROM cmx_monedas_trm cmt1
										WHERE cmt1.id_moneda = 1
											AND cmt1.fecha = cif.fecha_factura
									),
									NULL
								),
								IF(	(	SELECT cmt1.valor
										FROM cmx_monedas_trm cmt1
										WHERE cmt1.id_moneda = cif.id_moneda
											AND cmt1.fecha = cif.fecha_factura
									),
									(	(	SELECT cmt1.valor
											FROM cmx_monedas_trm cmt1
											WHERE cmt1.id_moneda = cif.id_moneda
												AND cmt1.fecha = cif.fecha_factura
										) * cif.valor
									) / (	SELECT cmt1.valor
											FROM cmx_monedas_trm cmt1
											WHERE cmt1.id_moneda = 1
												AND cmt1.fecha = cif.fecha_factura
									),
									NULL
								)
							)
						) VALOR_USD
					FROM cmx_intr_cotizaciones cico
						INNER JOIN cmx_intr_facturas cif ON cif.id = cico.id_factura
						INNER JOIN cmx_monedas cm ON cm.id = cif.id_moneda
					WHERE cico.id_intr_proyecto = ' . $id . '
						AND cico.id_proveedor = ' . $value['id_proveedor'] . '
						AND cico.id_concepto != 11
				';
				// $facturas = $this->_db->getConsulta($sql);
				$facturas = $this->_db3->prepare($sql);
				$facturas->execute();
				$facturas = $facturas->fetchAll(PDO::FETCH_ASSOC);

				if ($facturas) {
					$arrayFacturas[$value['id_proveedor']] = $facturas;
				}
			}
			$result["proveedor_cotizaciones"] = $arrayCotizaciones;
			$result["proveedor_facturas"] = $arrayFacturas;
		}

		// Se busca si existen impuestos creados
		$sql = '
			SELECT cif.*, cm.nom_moneda, cm.codigo,
				cico.id_proveedor, cico.descripcion, cp.abreviatura, cic.nombre
			FROM cmx_intr_cotizaciones cico
				INNER JOIN cmx_intr_facturas cif ON cif.id = cico.id_factura
				INNER JOIN cmx_monedas cm ON cm.id = cif.id_moneda
				INNER JOIN cmx_proveedores cp ON cp.id = cico.id_proveedor
				INNER JOIN cmx_intr_conceptos cic ON cic.id = cico.id_concepto
			WHERE cico.id_concepto = 11
				AND cico.id_intr_proyecto = ' . $id . '
		';
		// $impuestos = $this->_db->getConsulta($sql);
		$impuestos = $this->_db3->prepare($sql);
		$impuestos->execute();
		$impuestos = $impuestos->fetchAll(PDO::FETCH_ASSOC);

		if ($impuestos) {
			foreach ($impuestos as $key => $value) {
				$result["impuestos"][] = $value;
			}
		}
		return $result;
	}

	// public function getFacturasSinAdjunto($id_intr_proyecto)
	// {
	// 	// Se buscan las cotizaciones realizadas del proyecto
	// 	$sql = 'SELECT DISTINCT(cico.id_proveedor) FROM cmx_intr_cotizaciones cico WHERE cico.id_intr_proyecto = ' . $id_intr_proyecto . ' AND cico.estado = 1';
	// 	// $conceptos = $this->_db->getConsulta($sql);
	// 	$conceptos = $this->_db3->prepare($sql);
	// 	$conceptos->execute();
	// 	$conceptos = $conceptos->fetchAll(PDO::FETCH_ASSOC);

	// 	$array_cotizaciones = array();
	// 	$array_facturas = array();
	// 	$_flag_gestiona = true;
	// 	if ($conceptos) {
	// 		foreach ($conceptos as $key => $value) {
	// 			// Se busca las cotizaciones realizadas en el proyecto del concepto
	// 			$sql = 'SELECT cico.*,
	// 					cm.nom_moneda, cm.codigo, cic.nombre CONCEPTO, cic.descripcion DESCRIPCION_CONCEPTO,
	// 					(SELECT COUNT(cif1.id)
	// 						FROM cmx_intr_facturas cif1
	// 						WHERE cif1.id = cico.id_factura
	// 					) CANT_FACTURAS,
	// 					(	SELECT SUM(cif1.valor)
	// 						FROM cmx_intr_facturas cif1
	// 						WHERE cif1.id = cico.id_factura
	// 					) VALOR_FACTURAS,
	// 					(	SELECT COUNT(cico1.id)
	// 						FROM cmx_intr_cotizaciones cico1
	// 						WHERE cico1.id_intr_proyecto = cico.id_intr_proyecto
	// 						AND cico1.id_proveedor = cico.id_proveedor
	// 						AND cico1.estado = cico.estado
	// 						AND cico1.id_factura IS NULL
	// 					) COTIZ_SIN_FACTURA
	// 				FROM cmx_intr_cotizaciones cico
	// 					INNER JOIN cmx_monedas cm ON cm.id = cico.id_moneda
	// 					INNER JOIN cmx_intr_conceptos cic ON cic.id = cico.id_concepto
	// 				WHERE cico.id_intr_proyecto = ' . $id_intr_proyecto . '
	// 					AND cico.id_proveedor = ' . $value["id_proveedor"] . '
	// 					AND cico.estado = 1';
	// 			// $cotizaciones = $this->_db->getConsulta($sql);
	// 			$cotizaciones = $this->_db3->prepare($sql);
	// 			$cotizaciones->execute();
	// 			$cotizaciones = $cotizaciones->fetchAll(PDO::FETCH_ASSOC);

	// 			if ($cotizaciones) {
	// 				$array_cotizaciones[$value['id_proveedor']] = $cotizaciones[0]['id'];
	// 				// print_r($array_cotizaciones);
	// 				// exit();

	// 				// Se buscan las facturas de la cotización
	// 				$sql = 'SELECT cif.*, 
	// 						CONCAT(cm.nom_moneda," (",cm.codigo,")") MONEDA,
	// 						IF(	cif.id_moneda = 2,
	// 							1,
	// 							IF((	SELECT COUNT(cmt1.id)
	// 									FROM cmx_monedas_trm cmt1
	// 									WHERE 
	// 										cmt1.id_moneda = cm.id
	// 										AND cmt1.fecha = cif.fecha_factura
	// 								) > 0,
	// 								(	SELECT cmt1.valor
	// 									FROM cmx_monedas_trm cmt1
	// 									WHERE cmt1.id_moneda = cm.id
	// 										AND cmt1.fecha = cif.fecha_factura
	// 								),NULL
	// 							)
	// 						) TRM_FACTURA_PROVEEDOR
	// 					FROM cmx_intr_facturas cif
	// 						INNER JOIN cmx_monedas cm ON cm.id = cif.id_moneda
	// 					WHERE cif.id = ' . $cotizaciones[0]['id'] . '
	// 				';
	// 				// $factura = $this->_db->getConsulta($sql);
	// 				$factura = $this->_db3->prepare($sql);
	// 				$factura->execute();
	// 				$factura = $factura->fetchAll(PDO::FETCH_ASSOC);
	// 				if ($factura) {
	// 					$array_facturas[$cotizaciones[0]['id']] = $factura;
	// 				}

	// 				print_r($array_cotizaciones[$value['id_proveedor']]["CANT_FACTURAS"]);
	// 				exit();
	// 				// Se valida si el proyecto se puede dar por terminado 
	// 				if ($array_cotizaciones[$value['id_proveedor']]["CANT_FACTURAS"] == 0) {
	// 					$_flag_gestiona = false;
	// 				} elseif ($array_cotizaciones[$value['id_proveedor']]["COTIZ_SIN_FACTURA"] > 0) {
	// 					$_flag_gestiona = false;
	// 				}
	// 			} else {
	// 				$_flag_gestiona = false;
	// 			}
	// 		}
	// 	} else {
	// 		$_flag_gestiona = false;
	// 	}

	// 	$result["cotizaciones"] = $array_cotizaciones;
	// 	$result["facturas"] = $array_facturas;
	// 	$result["flag_gestiona"] = $_flag_gestiona;
	// 	return $result;
	// }

	public function getFacturasSinAdjunto($id_intr_proyecto)
	{
		// Manejo de errores en PDO
		$this->_db3->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

		// Se buscan las cotizaciones realizadas del proyecto
		$sql = 'SELECT DISTINCT(cico.id_proveedor) 
            FROM cmx_intr_cotizaciones cico 
            WHERE cico.id_intr_proyecto = :id_intr_proyecto 
              AND cico.estado = 1';

		$stmt = $this->_db3->prepare($sql);
		$stmt->execute([':id_intr_proyecto' => $id_intr_proyecto]);
		$conceptos = $stmt->fetchAll(PDO::FETCH_ASSOC);

		$array_cotizaciones = [];
		$array_facturas = [];
		$_flag_gestiona = true;

		if ($conceptos) {
			foreach ($conceptos as $value) {
				$id_proveedor = $value['id_proveedor'] ?? null;

				if (!$id_proveedor) {
					$_flag_gestiona = false;
					continue;
				}

				// Se buscan las cotizaciones realizadas para el proveedor
				$sql = 'SELECT cico.*,
                        cm.nom_moneda, cm.codigo, cic.nombre CONCEPTO, cic.descripcion DESCRIPCION_CONCEPTO,
                        (SELECT COUNT(cif1.id) 
                         FROM cmx_intr_facturas cif1 
                         WHERE cif1.id = cico.id_factura) CANT_FACTURAS,
                        (SELECT COUNT(cico1.id)
                         FROM cmx_intr_cotizaciones cico1 
                         WHERE cico1.id_intr_proyecto = cico.id_intr_proyecto
                           AND cico1.id_proveedor = cico.id_proveedor
                           AND cico1.estado = cico.estado
                           AND cico1.id_factura IS NULL) COTIZ_SIN_FACTURA
                    FROM cmx_intr_cotizaciones cico
                        INNER JOIN cmx_monedas cm ON cm.id = cico.id_moneda
                        INNER JOIN cmx_intr_conceptos cic ON cic.id = cico.id_concepto
                    WHERE cico.id_intr_proyecto = :id_intr_proyecto 
                      AND cico.id_proveedor = :id_proveedor 
                      AND cico.estado = 1';

				$stmt = $this->_db3->prepare($sql);
				$stmt->execute([':id_intr_proyecto' => $id_intr_proyecto, ':id_proveedor' => $id_proveedor]);
				$cotizaciones = $stmt->fetchAll(PDO::FETCH_ASSOC);

				if ($cotizaciones) {
					$array_cotizaciones[$id_proveedor] = [
						"CANT_FACTURAS" => $cotizaciones[0]['CANT_FACTURAS'] ?? 0,
						"COTIZ_SIN_FACTURA" => $cotizaciones[0]['COTIZ_SIN_FACTURA'] ?? 0
					];

					// Se buscan las facturas de la cotización
					$sql = 'SELECT cif.*, 
                            CONCAT(cm.nom_moneda," (",cm.codigo,")") MONEDA
                        FROM cmx_intr_facturas cif
                            INNER JOIN cmx_monedas cm ON cm.id = cif.id_moneda
                        WHERE cif.id = :id_factura';

					$stmt = $this->_db3->prepare($sql);
					$stmt->execute([':id_factura' => $cotizaciones[0]['id']]);
					$factura = $stmt->fetchAll(PDO::FETCH_ASSOC);

					if ($factura) {
						$array_facturas[$cotizaciones[0]['id']] = $factura;
					}

					// Validaciones para gestionar el proyecto
					if ($array_cotizaciones[$id_proveedor]["CANT_FACTURAS"] == 0) {
						$_flag_gestiona = false;
					} elseif ($array_cotizaciones[$id_proveedor]["COTIZ_SIN_FACTURA"] > 0) {
						$_flag_gestiona = false;
					}
				} else {
					$_flag_gestiona = false;
				}
			}
		} else {
			$_flag_gestiona = false;
		}

		return [
			"cotizaciones" => $array_cotizaciones,
			"facturas" => $array_facturas,
			"flag_gestiona" => $_flag_gestiona
		];
	}


	public function activaActividades($id_intr_proyecto, $id_proveedor)
	{
		$sql = '
			SELECT cia.id ID_ACTIVIDAD,
				(	SELECT cia1.id
					FROM cmx_importacion_actividades cia1
					WHERE cia1.id_importacion = cip.id
						AND cia1.orden > cia.orden
						AND cia1.simultaneo = cia.simultaneo
						AND cia1.tipo_actividad = "intr_solicita_egreso"
				) ACTIVIDAD_EGRESO,
				(	SELECT cia1.estado
					FROM cmx_importacion_actividades cia1
					WHERE cia1.id_importacion = cip.id
						AND cia1.orden > cia.orden
						AND cia1.simultaneo = cia.simultaneo
						AND cia1.tipo_actividad = "intr_solicita_egreso"
				) ESTADO_ACTIVIDAD_EGRESO,
				(	SELECT cia1.id
					FROM cmx_importacion_actividades cia1
					WHERE cia1.id_importacion = cip.id
						AND cia1.orden > cia.orden
						AND cia1.simultaneo = cia.simultaneo
						AND cia1.tipo_actividad = "intr_pago_proveedor"
				) ACTIVIDAD_ANTICIPO,
				(	SELECT cia1.estado
					FROM cmx_importacion_actividades cia1
					WHERE cia1.id_importacion = cip.id
						AND cia1.orden > cia.orden
						AND cia1.simultaneo = cia.simultaneo
						AND cia1.tipo_actividad = "intr_pago_proveedor"
				) ESTADO_ACTIVIDAD_ANTICIPO,
				(	SELECT cia1.id
					FROM cmx_importacion_actividades cia1
					WHERE cia1.id_importacion = cip.id
						AND cia1.orden > cia.orden
						AND cia1.simultaneo = cia.simultaneo
						AND cia1.tipo_actividad = "intr_registro_egreso"
				) ACTIVIDAD_REGISTRA_EGRESO,
				(	SELECT cia1.estado
					FROM cmx_importacion_actividades cia1
					WHERE cia1.id_importacion = cip.id
						AND cia1.orden > cia.orden
						AND cia1.simultaneo = cia.simultaneo
						AND cia1.tipo_actividad = "intr_registro_egreso"
				) ESTADO_REGISTRA_EGRESO
			FROM cmx_intr_cotizaciones cico 
				INNER JOIN cmx_intr_solicitudes cis ON cis.id = cico.id_intr_proyecto
				INNER JOIN cmx_importacion_proyecto cip ON cip.id = cis.id_proyecto
				INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
			WHERE cico.id_proveedor = ' . $id_proveedor . '
				AND cico.id_intr_proyecto = ' . $id_intr_proyecto . '
				AND cia.estado = 2
				AND cia.tipo_actividad = "intr_sube_facturas"
		';
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$actividades = $result->fetchAll(PDO::FETCH_ASSOC);


		// $gestion = $result["rowsData"][0];
		$gestion = $actividades[0];

		if ($gestion["ESTADO_ACTIVIDAD_EGRESO"] == 1) {
			$array = array();
			$array["fecha_hora_finalizacion"] = NULL;
			$array["tiempo_real"] = 0;
			$array["estado"] = 2;
			$this->_db->updateRegistro("cmx_importacion_actividades", $array, (int)$gestion["ACTIVIDAD_EGRESO"]);
		}

		if ($gestion["ESTADO_ACTIVIDAD_ANTICIPO"] == 1) {
			$array = array();
			$array["fecha_hora_finalizacion"] = NULL;
			$array["tiempo_real"] = 0;
			$array["estado"] = 2;
			$this->_db->updateRegistro("cmx_importacion_actividades", $array, (int)$gestion["ACTIVIDAD_ANTICIPO"]);
		}

		if ($gestion["ESTADO_REGISTRA_EGRESO"] == 1) {
			$array = array();
			$array["fecha_hora_finalizacion"] = NULL;
			$array["tiempo_real"] = 0;
			$array["estado"] = 2;
			$this->_db->updateRegistro("cmx_importacion_actividades", $array, (int)$gestion["ACTIVIDAD_REGISTRA_EGRESO"]);
		}
	}
	/********* FIN -  FUNCIONES DEL MÓDULO DE SUBIR FACTURAS PROVEEDOR *********/

	/********* FUNCIONES DEL MÓDULO DE SOLICITAR EGRESO *********/
	public function getProyectosSolicitaEgreso()
	{
		$usuario = $_SESSION["usuario"];

		if ($this->validaAdministrador($usuario["id_perfil"])) {
			$sql = '
				SELECT cif.id_proveedor,
					IF(	cif.id_proveedor,
						(	SELECT cp1.nombre
							FROM cmx_proveedores cp1
							WHERE cp1.id = cif.id_proveedor
						),
						"OTROS"
					) PROVEEDOR,
					-- INFORMACIÓN DE FACTURAS 
					cif.id ID_FACTURA,
					cif.valor, cif.id_moneda, cif.fecha_factura,
					COUNT( DISTINCT(cif.id) ) CANT_FACTURAS,
					SUM(
						IF(	cif.id_moneda = 2,
							cif.valor,
							IF((	SELECT cmt1.valor
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = cif.id_moneda
										AND cmt1.fecha = cif.fecha_factura
								),
								(	SELECT cmt1.valor
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = cif.id_moneda
										AND cmt1.fecha = cif.fecha_factura
								) * cif.valor,
								0
							)
						)
					) VALOR_FACTURA_PESOS
				FROM cmx_intr_facturas cif
					INNER JOIN cmx_intr_solicitudes cis ON cis.id = cif.id_intr_proyecto
					INNER JOIN cmx_importacion_proyecto cip ON cip.id = cis.id_proyecto
					INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
					INNER JOIN cmx_intr_cotizaciones cico ON cico.id_factura = cif.id
				WHERE cia.tipo_actividad = "intr_solicita_egreso"
					AND cia.estado = 2
					AND cif.id_egreso IS NULL
				GROUP BY cif.id_proveedor;
			';
		} else {
			$sql = '
				SELECT cif.id_proveedor,
					IF(	cif.id_proveedor,
						(	SELECT cp1.nombre
							FROM cmx_proveedores cp1
							WHERE cp1.id = cif.id_proveedor
						),
						"OTROS"
					) PROVEEDOR,
					-- INFORMACIÓN DE FACTURAS 
					cif.id ID_FACTURA,
					cif.valor, cif.id_moneda, cif.fecha_factura,
					COUNT( DISTINCT(cif.id) ) CANT_FACTURAS,
					SUM(
						IF(	cif.id_moneda = 2,
							cif.valor,
							IF((	SELECT cmt1.valor
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = cif.id_moneda
										AND cmt1.fecha = cif.fecha_factura
								),
								(	SELECT cmt1.valor
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = cif.id_moneda
										AND cmt1.fecha = cif.fecha_factura
								) * cif.valor,
								0
							)
						)
					) VALOR_FACTURA_PESOS
				FROM cmx_intr_facturas cif
					INNER JOIN cmx_intr_solicitudes cis ON cis.id = cif.id_intr_proyecto
					INNER JOIN cmx_importacion_proyecto cip ON cip.id = cis.id_proyecto
					INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
					INNER JOIN cmx_intr_cotizaciones cico ON cico.id_factura = cif.id
				WHERE cia.tipo_actividad = "intr_solicita_egreso"
					AND cia.estado = 2
					AND cif.id_egreso IS NULL
					AND cip.estado = 1
					AND cia.perfil_responsable IN(
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
				GROUP BY cif.id_proveedor;
			';
		}
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$return = $result->fetchAll(PDO::FETCH_ASSOC);
		return $return;


		// return $result;
	}

	public function getDatosSolicitaEgreso($id)
	{
		// Se busca la información del porveedor
		$sql = '
			SELECT cp.*,
				cap.actividad,
				cm.municipio, cm.depto, cm.pais,
				CONCAT(cm.municipio," (", cm.depto," - ",cm.pais,")") CIUDAD
			FROM cmx_proveedores cp
				INNER JOIN cmx_actividad_proveedor cap ON cap.id_proveedor = cp.id
				INNER JOIN cmx_municipios cm ON cm.id = cp.id_municipio
			WHERE cp.id = ' . $id . '
				AND cp.estado = "Activo"
				AND cap.actividad = "Proveedor"
		';
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$return["proveedor"] = $result->fetch(PDO::FETCH_ASSOC);
		// $return["proveedor"] = $result;


		// Se busca la información de las facturas presentadas por el proveedor
		$sql = '
			SELECT DISTINCT(cif.id),
				cif.*,
				cico.id_intr_proyecto, cico.id_proveedor,
				IF( cif.id_moneda IS NOT NULL,
					(	SELECT CONCAT( cm.nom_moneda, " (", cm.codigo, ")" )
						FROM cmx_monedas cm 
						WHERE cm.id = cif.id_moneda
					),
					NULL 
				) MONEDA_FACTURA,
				IF(	cif.id_moneda = 2,
					1,
					IF((	SELECT COUNT(cmt1.id)
							FROM cmx_monedas_trm cmt1
							WHERE cmt1.id_moneda = cif.id_moneda
								AND cmt1.fecha = cif.fecha_factura
						) > 0,
						(	SELECT cmt1.valor
							FROM cmx_monedas_trm cmt1
							WHERE cmt1.id_moneda = cif.id_moneda
								AND cmt1.fecha = cif.fecha_factura
						),
						NULL
					)
				) TRM_FACTURA_PROVEEDOR,
				cip.tipo_operacion, cip.numero_importacion, cip.importacion, cis.do,
				cis.tipo_transporte, cis.incoterm, cis.valor_declarado,
				IF( cis.id_moneda IS NOT NULL,
					(	SELECT CONCAT( cm.nom_moneda, " (", cm.codigo, ")" )
						FROM cmx_monedas cm 
						WHERE cm.id = cis.id_moneda
					),
					NULL 
				) MONEDA_VALOR_DECLARADO,
				cia.id ID_ACTIVIDAD, cia.orden, cia.fecha_hora_inicio, cia.id_importacion, cia.bloque, cia.grupo, 
				cia.simultaneo, cia.tipo_actividad, cia.costo_real, cia.respuesta 
			FROM cmx_intr_facturas cif
				INNER JOIN cmx_intr_cotizaciones cico ON cico.id_factura = cif.id
				INNER JOIN cmx_intr_solicitudes cis ON cis.id = cico.id_intr_proyecto
				INNER JOIN cmx_importacion_proyecto cip ON cip.id = cis.id_proyecto
				INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
			WHERE cico.id_proveedor = ' . $id . '
				AND cia.tipo_actividad = "intr_solicita_egreso"
				AND cia.estado = 2
				AND cif.id_egreso IS NULL
		';
		// $result = $this->_db->getConsulta($sql);
		$result1 = $this->_db3->prepare($sql);
		$result1->execute();
		$return["facturas"] = $result1->fetchAll(PDO::FETCH_ASSOC);
		// $return["facturas"] = $result;

		// Se busca la información de las cotizaciones de la factura 
		if ($return) {
			foreach ($return["facturas"] as $key => $value) {
				$sql = '
					SELECT cico.*,
						IF( cico.id_moneda IS NOT NULL,
							(	SELECT CONCAT( cm.nom_moneda, " (", cm.codigo, ")" )
								FROM cmx_monedas cm 
								WHERE cm.id = cico.id_moneda
							),
							NULL 
						) MONEDA_COTIZACION,
						IF(	cico.id_moneda = 2,
							1,
							IF((	SELECT COUNT(cmt1.id)
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = cico.id_moneda
										AND cmt1.fecha = cico.fecha_cotizacion
								) > 0,
								(	SELECT cmt1.valor
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = cico.id_moneda
										AND cmt1.fecha = cico.fecha_cotizacion
								),
								NULL
							)
						) TRM_COTIZACION,
						cico.descripcion DESCRIPCION_COTIZACION, cico.url URL_COTIZACION,
						cic.nombre CONCEPTO, cic.descripcion DESCRIPCION_CONCEPTO
					FROM cmx_intr_cotizaciones cico 
						INNER JOIN cmx_intr_conceptos cic ON cic.id = cico.id_concepto
					WHERE cico.id_factura = ' . $value['id'] . '
						AND cico.estado = 1;
				';
				// $result_01 = $this->_db->getConsulta($sql);
				$result_01 = $this->_db3->prepare($sql);
				$result_01->execute();
				$return["cotizaciones"][$value['id']] = $result_01->fetchAll(PDO::FETCH_ASSOC);
				// $return["cotizaciones"][$value[0]] = $result_01;
			}
		} else {
			echo "no entro";
		}
		return $return;
	}

	public function validaGestionActividadEgreso($id)
	{
		$sql = '
			SELECT 
				(	SELECT COUNT(cif1.id) CUANTOS
					FROM cmx_intr_facturas cif1
					WHERE cif1.id_intr_proyecto = cif.id_intr_proyecto
						AND cif1.id_egreso IS NULL
				) EGRESOS_PENDIENTES,
				cis.id ID_INTR_PROYECTO,
				cia.id ID_ACTIVIDAD, cia.nombre, cia.orden, cia.fecha_hora_inicio, cia.id_importacion, cia.bloque, cia.grupo, 
				cia.simultaneo, cia.tipo_actividad, cia.costo_real, cia.respuesta 
			FROM cmx_intr_facturas cif 
				INNER JOIN cmx_intr_solicitudes cis ON cis.id = cif.id_intr_proyecto
				INNER JOIN cmx_importacion_proyecto cip ON cip.id = cis.id_proyecto
				INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
			WHERE cif.id = ' . $id . '
				AND cia.tipo_actividad = "intr_solicita_egreso"
				AND cia.estado = 2
		';
		$result = $this->_db->getConsulta($sql);
		$return["egresos_pendientes"] = $result["rowsData"][0];

		// Se valida si la actividad de subir facturas se encuentra para gestionar 
		$id_intr_proyecto = $return["egresos_pendientes"]["ID_INTR_PROYECTO"];
		$flag_gestiona_subir_facturas = $this->getFacturasSinAdjunto($id_intr_proyecto);
		$return["flag_gestiona_subir_facturas"] = $flag_gestiona_subir_facturas["flag_gestiona"];
		return $return;
	}
	/********* FIN - FUNCIONES DEL MÓDULO DE SOLICITAR EGRESO *********/

	/********* FUNCIONES DEL MÓDULO DE REGISTRAR EGRESOS *********/
	public function getEgresosProveedores()
	{
		$usuario = $_SESSION["usuario"];
		$_falg_perfil = false;
		if ($usuario["id_perfil"] == 25 || $usuario["id_perfil"] == 22) {
			$_falg_perfil = true;
		}

		if ($this->validaAdministrador($usuario["id_perfil"], $_falg_perfil)) {
			$sql = 'SELECT 
					DISTINCT(cie.id), cie.numero_egreso, cie.fecha_egreso, cie.valor, cif.id_proveedor, cp.abreviatura,
					COUNT(cif.id) CUANTOS,
					cif.id_moneda, CONCAT(cm.nom_moneda," (",cm.codigo,")") MONEDA
				FROM cmx_intr_egresos cie
					INNER JOIN cmx_intr_facturas cif ON cif.id_egreso = cie.id
					INNER JOIN cmx_monedas cm ON cm.id = cif.id_moneda
					INNER JOIN cmx_proveedores cp ON cp.id = cif.id_proveedor
					INNER JOIN cmx_intr_solicitudes cis ON cis.id = cif.id_intr_proyecto
					INNER JOIN cmx_importacion_proyecto cip ON cip.id = cis.id_proyecto
					INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
				WHERE cie.estado = 2
					AND cia.tipo_actividad = "intr_registro_egreso"
					AND cia.estado = 2
					AND cip.estado = 1
				GROUP BY cie.id';
		} else {
			$sql = 'SELECT 
					DISTINCT(cie.id), cie.numero_egreso, cie.fecha_egreso, cie.valor, cif.id_proveedor, cp.abreviatura,
					COUNT(cif.id) CUANTOS,
					cif.id_moneda, CONCAT(cm.nom_moneda," (",cm.codigo,")") MONEDA
				FROM cmx_intr_egresos cie
					INNER JOIN cmx_intr_facturas cif ON cif.id_egreso = cie.id
					INNER JOIN cmx_monedas cm ON cm.id = cif.id_moneda
					INNER JOIN cmx_proveedores cp ON cp.id = cif.id_proveedor
					INNER JOIN cmx_intr_solicitudes cis ON cis.id = cif.id_intr_proyecto
					INNER JOIN cmx_importacion_proyecto cip ON cip.id = cis.id_proyecto
					INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
				WHERE cie.estado = 2
					AND cia.tipo_actividad = "intr_registro_egreso"
					AND cia.estado = 2
					AND cip.estado = 1
					AND cia.perfil_responsable IN(
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
				GROUP BY cie.id';
		}
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		return $result->fetchAll(PDO::FETCH_ASSOC);
		// return $result;
	}

	public function getDatosAnticiposProveedores($id)
	{
		// Se busca la información del proveedor de egreso generado
		$sql = '
			SELECT cp.*,
				cap.actividad,
				cm.municipio, cm.depto, cm.pais,
				CONCAT(cm.municipio," (", cm.depto," - ",cm.pais,")") CIUDAD
			FROM cmx_intr_egresos cie
				INNER JOIN cmx_intr_facturas cif ON cif.id_egreso = cie.id
				INNER JOIN cmx_proveedores cp ON cp.id = cif.id_proveedor
				INNER JOIN cmx_actividad_proveedor cap ON cap.id_proveedor = cp.id
				INNER JOIN cmx_municipios cm ON cm.id = cp.id_municipio
			WHERE cie.id = ' . $id . '
				AND cp.estado = "Activo"
				AND cap.actividad = "Proveedor";
		';

		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetch(PDO::FETCH_ASSOC);
		$return["proveedor"] = $result;

		// Se busca la información de las facturas presentadas por el proveedor
		$sql = '
			SELECT cif.*,
				cie.numero_egreso, cie.fecha_egreso, 
				cc.sigla NOM_CLIENTE, 
				IF( cif.id_moneda IS NOT NULL,
					(	SELECT CONCAT( cm.nom_moneda, " (", cm.codigo, ")" )
						FROM cmx_monedas cm 
						WHERE cm.id = cif.id_moneda
					),
					NULL 
				) MONEDA_FACTURA,
				IF(	cif.id_moneda = 2,
					1,
					IF((	SELECT COUNT(cmt1.id)
							FROM cmx_monedas_trm cmt1
							WHERE cmt1.id_moneda = cif.id_moneda
								AND cmt1.fecha = cif.fecha_factura
						) > 0,
						(	SELECT cmt1.valor
							FROM cmx_monedas_trm cmt1
							WHERE cmt1.id_moneda = cif.id_moneda
								AND cmt1.fecha = cif.fecha_factura
						),
						NULL
					)
				) TRM_FACTURA_PROVEEDOR,
				cip.tipo_operacion, cip.numero_importacion, cip.importacion, cis.do,
				cis.tipo_transporte, cis.incoterm, cis.valor_declarado,
				IF( cis.id_moneda IS NOT NULL,
					(	SELECT CONCAT( cm.nom_moneda, " (", cm.codigo, ")" )
						FROM cmx_monedas cm 
						WHERE cm.id = cis.id_moneda
					),
					NULL 
				) MONEDA_VALOR_DECLARADO
			FROM cmx_intr_egresos cie
				INNER JOIN cmx_intr_facturas cif ON cif.id_egreso = cie.id
				INNER JOIN cmx_intr_solicitudes cis ON cis.id = cif.id_intr_proyecto
				INNER JOIN cmx_importacion_proyecto cip ON cip.id = cis.id_proyecto
				INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
			WHERE cie.id = ' . $id . '
				AND cie.estado = 2
		';
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$return["facturas"] = $result->fetchAll(PDO::FETCH_ASSOC);
		// $return["facturas"] = $result;

		// Se busca la información de las cotizaciones de la factura 
		if ($return) {
			// foreach ($result["rowsData"] as $key => $value) {
			foreach ($return["facturas"] as $key => $value) {
				$sql = '
					SELECT cico.*,
						IF( cico.id_moneda IS NOT NULL,
							(	SELECT CONCAT( cm.nom_moneda, " (", cm.codigo, ")" )
								FROM cmx_monedas cm 
								WHERE cm.id = cico.id_moneda
							),
							NULL 
						) MONEDA_COTIZACION,
						IF(	cico.id_moneda = 2,
							1,
							IF((	SELECT COUNT(cmt1.id)
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = cico.id_moneda
										AND cmt1.fecha = cico.fecha_cotizacion
								) > 0,
								(	SELECT cmt1.valor
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = cico.id_moneda
										AND cmt1.fecha = cico.fecha_cotizacion
								),
								NULL
							)
						) TRM_COTIZACION,
						cico.descripcion DESCRIPCION_COTIZACION, cico.url URL_COTIZACION,
						cic.nombre CONCEPTO, cic.descripcion DESCRIPCION_CONCEPTO
					FROM cmx_intr_cotizaciones cico 
						INNER JOIN cmx_intr_conceptos cic ON cic.id = cico.id_concepto
					WHERE cico.id_factura = ' . $value['id'] . '
						AND cico.estado = 1;
				';

				// $result_01 = $this->_db->getConsulta($sql);
				// $return["cotizaciones"][$value[0]] = $result_01;
				$result_01 = $this->_db3->prepare($sql);
				$result_01->execute();
				$return["cotizaciones"][$value['id']] = $result_01->fetchAll(PDO::FETCH_ASSOC);
			}
		}

		// Se busca la información de la sumatoria de las facturas por moneda
		$sql = '
			SELECT 
				cm.id, CONCAT(cm.nom_moneda," (",cm.codigo,")") MONEDA,
				SUM(cif.valor) VALOR
			FROM cmx_intr_egresos cie
				INNER JOIN cmx_intr_facturas cif ON cif.id_egreso = cie.id
				INNER JOIN cmx_monedas cm ON cm.id = cif.id_moneda
			WHERE cie.id = ' . $id . '
			GROUP BY cm.id;
		';
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$return["sumatoria_monedas"] = $result->fetchAll(PDO::FETCH_ASSOC);
		// $return["total_monedas"] = $result;
		return $return;
	}

	public function validaGestionActividadRegistroEgreso($id)
	{
		$sql = '
			SELECT 
				DISTINCT(
					SELECT (	
						SELECT COUNT(cie2.id)
						FROM cmx_intr_cotizaciones cico2
							INNER JOIN cmx_intr_facturas cif2 ON cif2.id = cico2.id_factura
							INNER JOIN cmx_intr_egresos cie2 ON cie2.id = cif2.id_egreso
						WHERE cico2.id_intr_proyecto = cico1.id_intr_proyecto
							AND cie2.id_pago IS NULL
					) CUANTOS
					FROM cmx_intr_cotizaciones cico1
					WHERE cico1.id = cico.id
				) PAGOS_PENDIENTES,
				(	SELECT (	
						SELECT COUNT(cif2.id)
							FROM cmx_intr_cotizaciones cico2
								INNER JOIN cmx_intr_facturas cif2 ON cif2.id = cico2.id_factura
							WHERE cico2.id_intr_proyecto = cico1.id_intr_proyecto
								AND cif2.id_egreso IS NULL
						) CUANTOS
					FROM cmx_intr_cotizaciones cico1
					WHERE cico1.id = cico.id
				) EGRESOS_PENDIENTES,
				cis.id ID_INTR_PROYECTO,
				cia.id ID_ACTIVIDAD, cia.nombre, cia.orden, cia.fecha_hora_inicio, cia.id_importacion, cia.bloque, cia.grupo, 
				cia.simultaneo, cia.tipo_actividad, cia.costo_real, cia.respuesta 
			FROM cmx_intr_egresos cie
				INNER JOIN cmx_intr_facturas cif ON cif.id_egreso = cie.id
				INNER JOIN cmx_intr_cotizaciones cico ON cico.id_factura = cif.id
				INNER JOIN cmx_intr_solicitudes cis ON cis.id = cico.id_intr_proyecto
				INNER JOIN cmx_importacion_proyecto cip ON cip.id = cis.id_proyecto
				INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
			WHERE cie.id = ' . $id . '
				AND cia.tipo_actividad = "intr_registro_egreso"
				AND cia.estado = 2
		';
		$result = $this->_db->getConsulta($sql);
		$return["registros_pendientes"] = $result["rowsData"];

		if ($return["registros_pendientes"]) {
			foreach ($return["registros_pendientes"] as $key => $value) {
				// Se valida si la actividad de subir facturas se encuentra para gestionar 
				$id_intr_proyecto = $value["ID_INTR_PROYECTO"];
				$flag_gestiona_subir_facturas = $this->getFacturasSinAdjunto($id_intr_proyecto);
				$return["flag_gestiona_subir_facturas"][$key] = $flag_gestiona_subir_facturas["flag_gestiona"];
			}
		}
		return $return;
	}
	/********* FIN - FUNCIONES DEL MÓDULO DE REGISTRAR EGRESOS *********/

	/********* FUNCIONES DEL MÓDULO DE REGISTRO DE PAGO A PROVEEDORES *********/
	public function getPagosPendientes()
	{
		$usuario = $_SESSION["usuario"];
		$_falg_perfil = false;
		if ($usuario["id_perfil"] == 25) {
			$_falg_perfil = true;
		}

		if ($this->validaAdministrador($usuario["id_perfil"], $_falg_perfil)) {
			$sql = '
				SELECT ciep.*,
					COUNT( DISTINCT(cie.id) ) CUANTOS,
					cif.id_moneda, CONCAT(cm.nom_moneda," (",cm.codigo,")") MONEDA
				FROM cmx_intr_egresos_pagos ciep
					INNER JOIN cmx_intr_egresos cie ON cie.id_pago = ciep.id
					INNER JOIN cmx_intr_facturas cif ON cif.id_egreso = cie.id
					INNER JOIN cmx_monedas cm ON cm.id = cif.id_moneda
					INNER JOIN cmx_intr_solicitudes cis ON cis.id = cif.id_intr_proyecto
					INNER JOIN cmx_importacion_proyecto cip ON cip.id = cis.id_proyecto
					INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
				WHERE ciep.estado = 2
					AND cia.tipo_actividad = "intr_pago_proveedor"
					AND cia.estado = 2
					AND cip.estado = 1
				GROUP BY ciep.id
			';
		} else {
			$sql = '
				SELECT ciep.*,
					COUNT( DISTINCT(cie.id) ) CUANTOS,
					cif.id_moneda, CONCAT(cm.nom_moneda," (",cm.codigo,")") MONEDA
				FROM cmx_intr_egresos_pagos ciep
					INNER JOIN cmx_intr_egresos cie ON cie.id_pago = ciep.id
					INNER JOIN cmx_intr_facturas cif ON cif.id_egreso = cie.id
					INNER JOIN cmx_monedas cm ON cm.id = cif.id_moneda
					INNER JOIN cmx_intr_solicitudes cis ON cis.id = cif.id_intr_proyecto
					INNER JOIN cmx_importacion_proyecto cip ON cip.id = cis.id_proyecto
					INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
				WHERE ciep.estado = 2
					AND cia.tipo_actividad = "intr_pago_proveedor"
					AND cia.estado = 2
					AND cip.estado = 1
					AND cia.perfil_responsable IN(
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
				GROUP BY ciep.id
			';
		}

		$result = $this->_db3->prepare($sql);
		$result->execute();
		$return["general"] = $result->fetchAll(PDO::FETCH_ASSOC);

		// $result = $this->_db->getConsulta($sql);
		// $return["general"] = $result;

		$arrayEgreso = array();
		// if (isset($result["rowsData"])) {
		if (isset($return["general"])) {
			// foreach ($result["rowsData"] as $key => $value) {
			foreach ($return["general"] as $key => $value) {
				$sql = 'SELECT cie.id FROM cmx_intr_egresos cie WHERE cie.id_pago = ' . $value['id'] . '';
				// $result = $this->_db->getConsulta($sql);
				$result = $this->_db3->prepare($sql);
				$result->execute();
				// $return["egresos"][$value[0]] = $result->fetchAll(PDO::FETCH_COLUMN, 0);
				$result = $result->fetchAll(PDO::FETCH_ASSOC);

				$id_egreso = "";
				foreach ($result as $key_01 => $value_01) {
					$id_egreso .= $value_01['id'] . ",";
				}
				$arrayEgreso[$value['id']] = $id_egreso;
			}
		}
		$return["egresos"] = $arrayEgreso;
		return $return;
	}

	public function getInfoPago($id)
	{
		$sql = '
			SELECT ciep.*,
				COUNT( DISTINCT(cie.id) ) CUANTOS,
				SUM(cif.valor) TOTAL_FACTURAS,
				cif.id_moneda, CONCAT(cm.nom_moneda," (",cm.codigo,")") MONEDA
			FROM cmx_intr_egresos_pagos ciep
				INNER JOIN cmx_intr_egresos cie ON cie.id_pago = ciep.id
				INNER JOIN cmx_intr_facturas cif ON cif.id_egreso = cie.id
				INNER JOIN cmx_monedas cm ON cm.id = cif.id_moneda
			WHERE ciep.estado = 2
				AND ciep.id = ' . $id . '
			GROUP BY ciep.id
		';
		// $result = $this->_db->getConsulta($sql);
		// $return = $result;
		// return $return;
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$return = $result->fetchAll(PDO::FETCH_ASSOC);
		return $return;
	}

	public function getDatosPagos($id)
	{
		// Se busca la información del proveedor de egreso generado
		$sql = '
			SELECT DISTINCT(cp.id), cp.*,
				cap.actividad,
				cm.municipio, cm.depto, cm.pais,
				CONCAT(cm.municipio," (", cm.depto," - ",cm.pais,")") CIUDAD
			FROM cmx_intr_egresos cie
				INNER JOIN cmx_intr_facturas cif ON cif.id_egreso = cie.id
				INNER JOIN cmx_intr_cotizaciones cico ON cico.id_factura = cif.id
				INNER JOIN cmx_proveedores cp ON cp.id = cico.id_proveedor
				INNER JOIN cmx_actividad_proveedor cap ON cap.id_proveedor = cp.id
				INNER JOIN cmx_municipios cm ON cm.id = cp.id_municipio
			WHERE cie.id = ' . $id . '
				AND cp.estado = "Activo"
				AND cap.actividad = "Proveedor";
		';
		// $result = $this->_db->getConsulta($sql);
		// $return["proveedor"] = $result;
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$return["proveedor"] = $result->fetchAll(PDO::FETCH_ASSOC);
		// $return["proveedor"] = $result;

		// Se busca la información de las facturas presentadas por el proveedor
		$sql = '
			SELECT cif.*,
				cie.numero_egreso, cie.fecha_egreso, 
				cc.sigla NOM_CLIENTE, 
				IF( cif.id_moneda IS NOT NULL,
					(	SELECT CONCAT( cm.nom_moneda, " (", cm.codigo, ")" )
						FROM cmx_monedas cm 
						WHERE cm.id = cif.id_moneda
					),
					NULL 
				) MONEDA_FACTURA,
				IF(	cif.id_moneda = 2,
					1,
					IF((	SELECT COUNT(cmt1.id)
							FROM cmx_monedas_trm cmt1
							WHERE cmt1.id_moneda = cif.id_moneda
								AND cmt1.fecha = cif.fecha_factura
						) > 0,
						(	SELECT cmt1.valor
							FROM cmx_monedas_trm cmt1
							WHERE cmt1.id_moneda = cif.id_moneda
								AND cmt1.fecha = cif.fecha_factura
						),
						NULL
					)
				) TRM_FACTURA_PROVEEDOR,
				cip.tipo_operacion, cip.numero_importacion, cip.importacion, cis.do,
				cis.tipo_transporte, cis.incoterm, cis.valor_declarado,
				IF( cis.id_moneda IS NOT NULL,
					(	SELECT CONCAT( cm.nom_moneda, " (", cm.codigo, ")" )
						FROM cmx_monedas cm 
						WHERE cm.id = cis.id_moneda
					),
					NULL 
				) MONEDA_VALOR_DECLARADO
			FROM cmx_intr_egresos cie
				INNER JOIN cmx_intr_facturas cif ON cif.id_egreso = cie.id
				INNER JOIN cmx_intr_solicitudes cis ON cis.id = cif.id_intr_proyecto
				INNER JOIN cmx_importacion_proyecto cip ON cip.id = cis.id_proyecto
				INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
			WHERE cie.id = ' . $id . '
				AND cie.estado = 1
				AND cie.id_pago IS NOT NULL
		';
		// $result = $this->_db->getConsulta($sql);
		// $return["facturas"] = $result;
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$return["facturas"] = $result->fetchAll(PDO::FETCH_ASSOC);

		// Se busca la información de las cotizaciones de la factura 
		// if ($result) {
		if ($return["facturas"]) {
			// foreach ($result["rowsData"] as $key => $value) {
			foreach ($return["facturas"] as $key => $value) {
				$sql = '
					SELECT cico.*,
						IF( cico.id_moneda IS NOT NULL,
							(	SELECT CONCAT( cm.nom_moneda, " (", cm.codigo, ")" )
								FROM cmx_monedas cm 
								WHERE cm.id = cico.id_moneda
							),
							NULL 
						) MONEDA_COTIZACION,
						IF(	cico.id_moneda = 2,
							1,
							IF((	SELECT COUNT(cmt1.id)
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = cico.id_moneda
										AND cmt1.fecha = cico.fecha_cotizacion
								) > 0,
								(	SELECT cmt1.valor
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = cico.id_moneda
										AND cmt1.fecha = cico.fecha_cotizacion
								),
								NULL
							)
						) TRM_COTIZACION,
						cico.descripcion DESCRIPCION_COTIZACION, cico.url URL_COTIZACION,
						cic.nombre CONCEPTO, cic.descripcion DESCRIPCION_CONCEPTO
					FROM cmx_intr_cotizaciones cico 
						INNER JOIN cmx_intr_conceptos cic ON cic.id = cico.id_concepto
					WHERE cico.id_factura = ' . $value['id'] . '
						AND cico.estado = 1;
				';
				// $result_01 = $this->_db->getConsulta($sql);
				// $return["cotizaciones"][$value[0]] = $result_01;
				$result_01 = $this->_db3->prepare($sql);
				$result_01->execute();
				$return["cotizaciones"][$value['id']] = $result_01->fetchAll(PDO::FETCH_ASSOC);
			}
		}

		// Se busca la información de la sumatoria de las facuras por moneda
		$sql = '
			SELECT 
				cm.id, CONCAT(cm.nom_moneda," (",cm.codigo,")") MONEDA,
				SUM(cif.valor) VALOR
			FROM cmx_intr_egresos cie
				INNER JOIN cmx_intr_facturas cif ON cif.id_egreso = cie.id
				INNER JOIN cmx_monedas cm ON cm.id = cif.id_moneda
			WHERE cie.id = ' . $id . '
			GROUP BY cm.id;
		';
		// $result = $this->_db->getConsulta($sql);
		// $return["total_monedas"] = $result;
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$return["total_monedas"] = $result->fetchAll(PDO::FETCH_ASSOC);
		return $return;
	}

	public function getDatosRegistraPagoProveedores($id)
	{
		// Se busca la información general del egreso generado
		$sql = '
			SELECT cif.*,
				IF( cif.id_moneda IS NOT NULL,
					(	SELECT CONCAT( cm.nom_moneda, " (", cm.codigo, ")" )
						FROM cmx_monedas cm 
						WHERE cm.id = cif.id_moneda
					),
					NULL 
				) MONEDA_FACTURA,
				IF(	cif.id_moneda = 2,
					1,
					IF((	SELECT COUNT(cmt1.id)
							FROM cmx_monedas_trm cmt1
							WHERE cmt1.id_moneda = cif.id_moneda
								AND cmt1.fecha = cif.fecha_factura
						) > 0,
						(	SELECT cmt1.valor
							FROM cmx_monedas_trm cmt1
							WHERE cmt1.id_moneda = cif.id_moneda
								AND cmt1.fecha = cif.fecha_factura
						),
						NULL
					)
				) TRM_FACTURA_PROVEEDOR,
				cico.id_concepto, cico.id_proveedor, cico.proveedor, cico.fecha_cotizacion, cico.valor VALOR_COTIZACION, 
				cico.id_moneda ID_MONEDA_COTIZACION, cico.sobrecosto,
				IF( cico.id_moneda IS NOT NULL,
					(	SELECT CONCAT( cm.nom_moneda, " (", cm.codigo, ")" )
						FROM cmx_monedas cm 
						WHERE cm.id = cico.id_moneda
					),
					NULL 
				) MONEDA_COTIZACION,
				IF(	cico.id_moneda = 2,
					1,
					IF((	SELECT COUNT(cmt1.id)
							FROM cmx_monedas_trm cmt1
							WHERE cmt1.id_moneda = cico.id_moneda
								AND cmt1.fecha = cico.fecha_cotizacion
						) > 0,
						(	SELECT cmt1.valor
							FROM cmx_monedas_trm cmt1
							WHERE cmt1.id_moneda = cico.id_moneda
								AND cmt1.fecha = cico.fecha_cotizacion
						),
						NULL
					)
				) TRM_COTIZACION,
				cie.numero_egreso,
				cico.descripcion DESCRIPCION_COTIZACION, cico.url URL_COTIZACION,
				cic.nombre CONCEPTO, cic.descripcion DESCRIPCION_CONCEPTO,
				cis.id ID_PROYECTO_INTERNACIONAL, 
				cip.tipo_operacion, cip.numero_importacion, cip.importacion, cis.do,
				cc.cod_cliente, CONCAT(cc.documento, "-", cc.digito_verificacion) DOC_CLIENTE, cc.sigla, cc.nombre,
				cis.tipo_transporte, cis.incoterm, cis.valor_declarado,
				IF( cis.id_moneda IS NOT NULL,
					(	SELECT CONCAT( cm.nom_moneda, " (", cm.codigo, ")" )
						FROM cmx_monedas cm 
						WHERE cm.id = cis.id_moneda
					),
					NULL 
				) MONEDA_VALOR_DECLARADO
			FROM cmx_importacion_proyecto cip
				INNER JOIN cmx_intr_solicitudes cis ON cis.id_proyecto = cip.id
				INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
				INNER JOIN cmx_intr_cotizaciones cico ON cico.id_intr_proyecto = cis.id
				INNER JOIN cmx_intr_conceptos cic ON cic.id = cico.id_concepto
				INNER JOIN cmx_intr_facturas cif ON cif.id = cico.id_factura
				INNER JOIN cmx_intr_egresos cie ON cie.id = cif.id_egreso
			WHERE cie.id = ' . $id . '
				AND cie.estado = 1
		';
		$result = $this->_db->getConsulta($sql);
		$return["general"] = $result;

		// Se busca la información del proveedor de egreso generado
		$sql = '
			SELECT DISTINCT(cp.id), cp.*,
				cap.actividad,
				cm.municipio, cm.depto, cm.pais,
				CONCAT(cm.municipio," (", cm.depto," - ",cm.pais,")") CIUDAD
			FROM cmx_intr_egresos cie
				INNER JOIN cmx_intr_facturas cif ON cif.id_egreso = cie.id
				INNER JOIN cmx_proveedores cp ON cp.id = cif.id_proveedor
				INNER JOIN cmx_actividad_proveedor cap ON cap.id_proveedor = cp.id
				INNER JOIN cmx_municipios cm ON cm.id = cp.id_municipio
			WHERE cie.id = ' . $id . '
				AND cp.estado = "Activo"
				AND cap.actividad = "Proveedor";
		';
		$result = $this->_db->getConsulta($sql);
		$return["proveedor"] = $result;

		// Se busca la información de la sumatoria de las facuras por moneda
		$sql = '
			SELECT 
				cm.id, CONCAT(cm.nom_moneda," (",cm.codigo,")") MONEDA,
				SUM(cif.valor) VALOR
			FROM cmx_intr_egresos cie
				INNER JOIN cmx_intr_facturas cif ON cif.id_egreso = cie.id
				INNER JOIN cmx_monedas cm ON cm.id = cif.id_moneda
			WHERE cie.id = ' . $id . '
			GROUP BY cm.id;
		';
		$result = $this->_db->getConsulta($sql);
		$return["total_monedas"] = $result;
		return $return;
	}

	public function validaGestionActividadPagoProveedor($id)
	{
		$sql = '
			SELECT DISTINCT(cis.id) ID_INTR_PROYECTO,
				(	SELECT(	
						SELECT COUNT(cis2.id)
						FROM cmx_intr_solicitudes cis2
							INNER JOIN cmx_intr_cotizaciones cico2 ON cico2.id_intr_proyecto = cis2.id
							INNER JOIN cmx_intr_facturas cif2 ON cif2.id_intr_proyecto = cico2.id_intr_proyecto AND cif2.id_proveedor = cico2.id_proveedor
							INNER JOIN cmx_intr_egresos cie2 ON cie2.id = cif2.id_egreso
							INNER JOIN cmx_intr_egresos_pagos ciep2 ON ciep2.id = cie2.id_pago
						WHERE cis2.id = cis.id
							AND ciep2.estado = 2
						) CUANTOS
					FROM cmx_intr_egresos_pagos ciep1
					WHERE ciep1.id = ciep.id
				) REGISTROS_PENDIENTES,
				(	SELECT(	
						SELECT COUNT(cie2.id)
						FROM cmx_intr_cotizaciones cico2
							INNER JOIN cmx_intr_facturas cif2 ON cif2.id_intr_proyecto = cico2.id_intr_proyecto AND cif2.id_proveedor = cico2.id_proveedor
							INNER JOIN cmx_intr_egresos cie2 ON cie2.id = cif2.id_egreso
						WHERE cico2.id_intr_proyecto = cico1.id_intr_proyecto
							AND cie2.id_pago IS NULL
						) CUANTOS
					FROM cmx_intr_cotizaciones cico1
					WHERE cico1.id = cico.id
				) PAGOS_PENDIENTES,
				(	SELECT(	
						SELECT COUNT(cif2.id)
						FROM cmx_intr_cotizaciones cico2
							INNER JOIN cmx_intr_facturas cif2 ON cif2.id_intr_proyecto = cico2.id_intr_proyecto AND cif2.id_proveedor = cico2.id_proveedor
						WHERE cico2.id_intr_proyecto = cico1.id_intr_proyecto
							AND cif2.id_egreso IS NULL
						) CUANTOS
					FROM cmx_intr_cotizaciones cico1
					WHERE cico1.id = cico.id
				) EGRESOS_PENDIENTES,
				cia.id ID_ACTIVIDAD, cia.nombre, cia.orden, cia.fecha_hora_inicio, cia.id_importacion, cia.bloque, cia.grupo, cia.simultaneo, cia.tipo_actividad, 
				cia.costo_real, cia.respuesta 
			FROM cmx_intr_egresos_pagos ciep
				INNER JOIN cmx_intr_egresos cie ON cie.id_pago = ciep.id
				INNER JOIN cmx_intr_facturas cif ON cif.id_egreso = cie.id
				INNER JOIN cmx_intr_cotizaciones cico ON cico.id_intr_proyecto = cif.id_intr_proyecto AND cico.id_proveedor = cif.id_proveedor
				INNER JOIN cmx_intr_solicitudes cis ON cis.id = cico.id_intr_proyecto
				INNER JOIN cmx_importacion_proyecto cip ON cip.id = cis.id_proyecto
				INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
			WHERE ciep.id = ' . $id . '
				AND cia.tipo_actividad = "intr_pago_proveedor"
				AND cia.estado = 2
		';
		$result = $this->_db->getConsulta($sql);
		$return["pagos_pendientes"] = $result["rowsData"][0];

		$result = $this->_db->getConsulta($sql);
		$return["pagos_pendientes"] = $result["rowsData"];

		if ($return["pagos_pendientes"]) {
			foreach ($return["pagos_pendientes"] as $key => $value) {
				// Se valida si la actividad de subir facturas se encuentra para gestionar 
				$id_intr_proyecto = $value["ID_INTR_PROYECTO"];
				$flag_gestiona_subir_facturas = $this->getFacturasSinAdjunto($id_intr_proyecto);
				$return["flag_gestiona_subir_facturas"][$key] = $flag_gestiona_subir_facturas["flag_gestiona"];
			}
		}
		return $return;
	}
	/********* FIN - FUNCIONES DEL MÓDULO DE REGISTRO DE PAGO A PROVEEDORES *********/

	/********* FUNCIONES DEL MÓDULO DE REGISTRO DE MATERIALES DE LOS PROYECTOS *********/
	public function getProyectosSinMaterial()
	{
		$usuario = $_SESSION["usuario"];
		$_falg_serv_cliente = false;
		if ($usuario["id_perfil"] == 25) {
			$_falg_serv_cliente = true;
		}
		if ($this->validaAdministrador($usuario["id_perfil"], $_falg_serv_cliente)) {
			$sql = 'SELECT cis.id, cis.tipo_transporte, cis.incoterm, cis.valor_declarado, 
					IF(	cis.id_moneda IS NOT NULL,
						(	SELECT CONCAT(cm1.nom_moneda," (",cm1.codigo,")")
							FROM cmx_monedas cm1
							WHERE cm1.id = cis.id_moneda
						),
						NULL
					) MONEDA,
					cip.numero_importacion, cip.importacion, cip.tipo_operacion, cia.fecha_hora_inicio,
					CONCAT(cc.documento,"-",cc.digito_verificacion) DOCUMENTO_CLIENTE, cc.nombre, cc.sigla, cc.cod_cliente,
					(	SELECT COUNT(cit1.id)
						FROM cmx_intr_tramos cit1
						WHERE cit1.id_intr_proyecto = cis.id
							AND cit1.tipo_tramo = "Descargue"
					) CANT_DESTINOS
				FROM cmx_intr_solicitudes cis
					INNER JOIN cmx_importacion_proyecto cip ON cip.id = cis.id_proyecto
					INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
					INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
				WHERE cia.tipo_actividad = "intr_material_envio"
					AND cia.estado = 2
					AND cip.estado = 1
			';
		} else {
			$sql = 'SELECT cis.id, cis.tipo_transporte, cis.incoterm, cis.valor_declarado, 
					IF(	cis.id_moneda IS NOT NULL,
						(	SELECT CONCAT(cm1.nom_moneda," (",cm1.codigo,")")
							FROM cmx_monedas cm1
							WHERE cm1.id = cis.id_moneda
						),
						NULL
					) MONEDA,
					cip.numero_importacion, cip.importacion, cip.tipo_operacion, cia.fecha_hora_inicio,
					CONCAT(cc.documento,"-",cc.digito_verificacion) DOCUMENTO_CLIENTE, cc.nombre, cc.sigla, cc.cod_cliente,
					(	SELECT COUNT(cit1.id)
						FROM cmx_intr_tramos cit1
						WHERE cit1.id_intr_proyecto = cis.id
							AND cit1.tipo_tramo = "Descargue"
					) CANT_DESTINOS
				FROM cmx_intr_solicitudes cis
					INNER JOIN cmx_importacion_proyecto cip ON cip.id = cis.id_proyecto
					INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
					INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
				WHERE cia.tipo_actividad = "intr_material_envio"
					AND cia.estado = 2
					AND cip.estado = 1
					AND cia.perfil_responsable IN(
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
			';
		}
		$result = $this->_db3->prepare($sql);
		$result->execute();
		return $result->fetchAll(PDO::FETCH_ASSOC);
	}

	// public function getDestinosProyecto($id)
	// {
	// 	$sql = 'SELECT cis.id, cis.tipo_transporte, cis.incoterm, cis.valor_declarado, 
	// 			IF(	cis.id_moneda IS NOT NULL,
	// 				(	SELECT CONCAT(cm1.nom_moneda," (",cm1.codigo,")")
	// 					FROM cmx_monedas cm1
	// 					WHERE cm1.id = cis.id_moneda
	// 				),
	// 				NULL
	// 			) MONEDA,
	// 			cip.numero_importacion, cip.importacion, cip.tipo_operacion,
	// 			CONCAT(cc.documento,"-",cc.digito_verificacion) DOCUMENTO_CLIENTE, cc.nombre, cc.sigla, cc.cod_cliente,
	// 			(	SELECT COUNT(cit1.id)
	// 				FROM cmx_intr_tramos cit1
	// 				WHERE cit1.id_intr_proyecto = cis.id
	// 					AND cit1.tipo_tramo = "Descargue"
	// 			) CANT_DESTINOS
	// 		FROM cmx_intr_solicitudes cis
	// 			INNER JOIN cmx_importacion_proyecto cip ON cip.id = cis.id_proyecto
	// 			INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
	// 			INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
	// 		WHERE cis.id = ' . $id . '
	// 			AND cia.tipo_actividad = "intr_material_envio"
	// 			AND cia.estado = 2
	// 			AND cip.estado = 1;
	// 	';
	// 	$return["general"] = $this->_db->getConsulta($sql);

	// 	$sql = 'SELECT DISTINCT(cm.id), cm.municipio, cm.depto, cm.pais
	// 		FROM cmx_intr_tramos cit
	// 			INNER JOIN cmx_remitente_destinatario crd ON crd.id = cit.id_remitente_destinatario
	// 			INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
	// 		WHERE cit.id_intr_proyecto = ' . $id . '
	// 			AND cit.tipo_tramo = "Descargue"
	// 	';
	// 	$return["ciudades_destino"] = $this->_db->getConsulta($sql);

	// 	foreach ($return["ciudades_destino"]["rowsData"] as $key => $value) {
	// 		$sql = 'SELECT cit.id ID_TRAMO, crd.*
	// 			FROM cmx_intr_tramos cit
	// 				INNER JOIN cmx_remitente_destinatario crd ON crd.id = cit.id_remitente_destinatario
	// 				INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
	// 			WHERE cit.id_intr_proyecto = ' . $id . '
	// 				AND cm.id = ' . $value[0] . '
	// 				AND cit.tipo_tramo = "Descargue"
	// 		';
	// 		$return["destinos"][$value[0]] = $this->_db->getConsulta($sql);
	// 	}
	// 	return $return;
	// }

	public function getDestinosProyecto($id)
	{
		$return = [];

		// Primera consulta
		$sql = 'SELECT cis.id, cis.tipo_transporte, cis.incoterm, cis.valor_declarado, 
                IF(cis.id_moneda IS NOT NULL,
                    (SELECT CONCAT(cm1.nom_moneda, " (", cm1.codigo, ")")
                     FROM cmx_monedas cm1
                     WHERE cm1.id = cis.id_moneda),
                    NULL
                ) AS MONEDA,
                cip.numero_importacion, cip.importacion, cip.tipo_operacion,
                CONCAT(cc.documento, "-", cc.digito_verificacion) AS DOCUMENTO_CLIENTE, 
                cc.nombre, cc.sigla, cc.cod_cliente,
                (SELECT COUNT(cit1.id)
                 FROM cmx_intr_tramos cit1
                 WHERE cit1.id_intr_proyecto = cis.id
                   AND cit1.tipo_tramo = "Descargue") AS CANT_DESTINOS
            FROM cmx_intr_solicitudes cis
                INNER JOIN cmx_importacion_proyecto cip ON cip.id = cis.id_proyecto
                INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
                INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
            WHERE cis.id = :id
              AND cia.tipo_actividad = "intr_material_envio"
              AND cia.estado = 2
              AND cip.estado = 1';

		$stmt = $this->_db3->prepare($sql);
		$stmt->execute(['id' => $id]);
		$return["general"] = $stmt->fetchAll(PDO::FETCH_ASSOC);

		// Segunda consulta
		$sql = 'SELECT DISTINCT(cm.id), cm.municipio, cm.depto, cm.pais
            FROM cmx_intr_tramos cit
                INNER JOIN cmx_remitente_destinatario crd ON crd.id = cit.id_remitente_destinatario
                INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
            WHERE cit.id_intr_proyecto = :id
              AND cit.tipo_tramo = "Descargue"';

		$stmt = $this->_db3->prepare($sql);
		$stmt->execute(['id' => $id]);
		$return["ciudades_destino"] = $stmt->fetchAll(PDO::FETCH_ASSOC);

		// Tercera consulta para cada ciudad destino
		$return["destinos"] = [];
		foreach ($return["ciudades_destino"] as $key => $value) {
			$sql = 'SELECT cit.id AS ID_TRAMO, crd.*
                FROM cmx_intr_tramos cit
                    INNER JOIN cmx_remitente_destinatario crd ON crd.id = cit.id_remitente_destinatario
                    INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
                WHERE cit.id_intr_proyecto = :id
                  AND cm.id = :ciudad_id
                  AND cit.tipo_tramo = "Descargue"';

			$stmt = $this->_db3->prepare($sql);
			$stmt->execute(['id' => $id, 'ciudad_id' => $value['id']]);
			$return["destinos"][$value['id']] = $stmt->fetchAll(PDO::FETCH_ASSOC);
		}

		return $return;
	}


	public function validaGestionActividadMateriales($id)
	{
		$sql = '
			SELECT DISTINCT(cis.id) ID_INTR_PROYECTO,
				cia.id ID_ACTIVIDAD, cia.nombre, cia.orden, cia.fecha_hora_inicio, cia.id_importacion, cia.bloque, cia.grupo, 
				cia.simultaneo, cia.tipo_actividad, cia.costo_real, cia.respuesta 
			FROM cmx_intr_solicitudes cis 
				INNER JOIN cmx_importacion_proyecto cip ON cip.id = cis.id_proyecto
				INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
			WHERE cis.id = ' . $id . '
				AND cia.tipo_actividad = "intr_material_envio"
				AND cia.estado = 2
		';
		$result = $this->_db->getConsulta($sql);
		$return = $result["rowsData"][0];
		return $return;
	}
	/********* FIN - FUNCIONES DEL MÓDULO DE REGISTRO DE MATERIALES DE LOS PROYECTOS *********/

	/********* FUNCIONES DEL MÓDULO DE REGISTRO DE MATERIALES DE LOS PROYECTOS *********/
	public function getProyectosDocumentos()
	{
		$usuario = $_SESSION["usuario"];
		$_falg_prising = false;
		if ($usuario["id_perfil"] == 24 or $usuario["id_perfil"] == 23 or $usuario["id_perfil"] == 25 or $usuario["id_perfil"] == 29 or $usuario["id_perfil"] == 31 or $usuario["id_perfil"] == 32) {
			$_falg_prising = true;
		}

		if ($this->validaAdministrador($usuario["id_perfil"], $_falg_prising)) {
			$sql = 'SELECT cis.id, cis.do, cis.tipo_transporte, cis.incoterm, cis.valor_declarado, 
					IF(	cis.id_moneda IS NOT NULL,
						(	SELECT CONCAT(cm1.nom_moneda," (",cm1.codigo,")")
							FROM cmx_monedas cm1
							WHERE cm1.id = cis.id_moneda
						),
						NULL
					) MONEDA,
					cip.numero_importacion, cip.importacion, cip.tipo_operacion,
					CONCAT(cc.documento,"-",cc.digito_verificacion) DOCUMENTO_CLIENTE, cc.nombre, cc.sigla, cc.cod_cliente,
					(	SELECT COUNT(cit1.id)
						FROM cmx_intr_tramos cit1
						WHERE cit1.id_intr_proyecto = cis.id
							AND cit1.tipo_tramo = "Descargue"
					) CANT_DESTINOS,
					(	SELECT COUNT(cisd.id)
						FROM cmx_intr_solicitud_documentos cisd
						WHERE cisd.id_intr_proyecto = cis.id
							AND cisd.id_tipo_documento = 20 -- (Prueba de entrega)
					) CANT_DOCUMENTOS
				FROM cmx_intr_solicitudes cis
					INNER JOIN cmx_importacion_proyecto cip ON cip.id = cis.id_proyecto
					INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
					INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
				WHERE cia.tipo_actividad = "intr_documentos_envio"
					AND cia.estado = 2
					AND cip.estado = 1
				ORDER BY cis.do DESC
			';
		} else {
			$sql = 'SELECT cis.id, cis.do, cis.tipo_transporte, cis.incoterm, cis.valor_declarado, 
					IF(	cis.id_moneda IS NOT NULL,
						(	SELECT CONCAT(cm1.nom_moneda," (",cm1.codigo,")")
							FROM cmx_monedas cm1
							WHERE cm1.id = cis.id_moneda
						),
						NULL
					) MONEDA,
					cip.numero_importacion, cip.importacion, cip.tipo_operacion,
					CONCAT(cc.documento,"-",cc.digito_verificacion) DOCUMENTO_CLIENTE, cc.nombre, cc.sigla, cc.cod_cliente,
					(	SELECT COUNT(cit1.id)
						FROM cmx_intr_tramos cit1
						WHERE cit1.id_intr_proyecto = cis.id
							AND cit1.tipo_tramo = "Descargue"
					) CANT_DESTINOS,
					(	SELECT COUNT(cisd.id)
						FROM cmx_intr_solicitud_documentos cisd
						WHERE cisd.id_intr_proyecto = cis.id
							AND cisd.id_tipo_documento = 20 -- (Prueba de entrega)
					) CANT_DOCUMENTOS
				FROM cmx_intr_solicitudes cis
					INNER JOIN cmx_importacion_proyecto cip ON cip.id = cis.id_proyecto
					INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
					INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
				WHERE cia.tipo_actividad = "intr_documentos_envio"
					AND cia.estado = 2
					AND cip.estado = 1
					AND cia.perfil_responsable IN(
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
				ORDER BY cis.do DESC
			';
		}
		$return = $this->_db3->prepare($sql);
		$return->execute();
		return $return->fetchAll(PDO::FETCH_ASSOC);
	}

	// public function getDocumentosProyecto($id)
	// {
	// 	$sql = 'SELECT cis.id, cis.do, cis.tipo_transporte, cis.incoterm, cis.valor_declarado, 
	// 			IF(	cis.id_moneda IS NOT NULL,
	// 				(	SELECT CONCAT(cm1.nom_moneda," (",cm1.codigo,")")
	// 					FROM cmx_monedas cm1
	// 					WHERE cm1.id = cis.id_moneda
	// 				),
	// 				NULL
	// 			) MONEDA,
	// 			cip.numero_importacion, cip.importacion, cip.tipo_operacion,
	// 			CONCAT(cc.documento,"-",cc.digito_verificacion) DOCUMENTO_CLIENTE, cc.nombre, cc.sigla, cc.cod_cliente,
	// 			(	SELECT COUNT(cit1.id)
	// 				FROM cmx_intr_tramos cit1
	// 				WHERE cit1.id_intr_proyecto = cis.id
	// 					AND cit1.tipo_tramo = "Descargue"
	// 			) CANT_DESTINOS,
	// 			cia.id ID_ACTIVIDAD, cia.orden, cia.fecha_hora_inicio, cia.id_importacion, cia.bloque, cia.grupo, cia.simultaneo, 
	// 			cia.tipo_actividad, cia.costo_real, cia.respuesta 
	// 		FROM cmx_intr_solicitudes cis
	// 			INNER JOIN cmx_importacion_proyecto cip ON cip.id = cis.id_proyecto
	// 			INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
	// 			INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
	// 		WHERE cis.id = ' . $id . '
	// 			AND cia.tipo_actividad = "intr_documentos_envio"
	// 			AND cia.estado = 2
	// 			AND cip.estado = 1;
	// 	';
	// 	// $return["general"] = $this->_db->getConsulta($sql);
	// 	$return = $this->_db3->prepare($sql);
	// 	$return->execute();
	// 	$return["general"]= $return->fetchAll(PDO::FETCH_ASSOC);


	// 	// Se busca la informacion de los materiales 
	// 	$return["tramos"] = $this->getTramosMaterialProyecto($id);
	// 	$return["materiales"] = $this->getMaterialProyecto($id);

	// 	// Se busca la informacion de los documentos 
	// 	$return["tipo_documentos"] = $this->getTipoDocumentosEnvio();
	// 	$return["documentos"] = $this->getDocumentosEnvio($id);
	// 	return $return;
	// }

	public function getDocumentosProyecto($id)
	{

		try {
			// Construcción de la consulta SQL
			$sql = 'SELECT cis.id, cis.do, cis.tipo_transporte, cis.incoterm, cis.valor_declarado, 
                    IF(cis.id_moneda IS NOT NULL, (SELECT CONCAT(cm1.nom_moneda," (",cm1.codigo,")") FROM cmx_monedas cm1 WHERE cm1.id = cis.id_moneda),NULL) AS MONEDA,
                    cip.numero_importacion, cip.importacion, cip.tipo_operacion, CONCAT(cc.documento,"-",cc.digito_verificacion) AS DOCUMENTO_CLIENTE, cc.nombre, cc.sigla, cc.cod_cliente,
                    (SELECT COUNT(cit1.id) FROM cmx_intr_tramos cit1 WHERE cit1.id_intr_proyecto = cis.id AND cit1.tipo_tramo = "Descargue") AS CANT_DESTINOS,
                    cia.id AS ID_ACTIVIDAD, cia.orden, cia.fecha_hora_inicio, cia.id_importacion, cia.bloque, cia.grupo, cia.simultaneo, cia.tipo_actividad, cia.costo_real, cia.respuesta 
                FROM cmx_intr_solicitudes cis
                INNER JOIN cmx_importacion_proyecto cip ON cip.id = cis.id_proyecto
                INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
                INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
                WHERE cis.id=:id AND cia.tipo_actividad = "intr_documentos_envio" AND cia.estado = 2 AND cip.estado = 1';

			// Preparar y ejecutar la consulta
			$stmt = $this->_db3->prepare($sql);
			$stmt->execute(['id' => $id]);
			// $stmt->execute();

			// Obtener resultados
			$return = [];
			$return["general"] = $stmt->fetchAll(PDO::FETCH_ASSOC);

			// Buscar información adicional
			$return["tramos"] = $this->getTramosMaterialProyecto($id);
			$return["materiales"] = $this->getMaterialProyecto($id);

			// Buscar información de documentos
			$return["tipo_documentos"] = $this->getTipoDocumentosEnvio();
			$return["documentos"] = $this->getDocumentosEnvio($id);

			return $return;
		} catch (PDOException $e) {
			// Manejo de errores
			error_log("Error en getDocumentosProyecto: " . $e->getMessage());
			return [
				'error' => true,
				'message' => 'Error al obtener los documentos del proyecto. Por favor, inténtelo más tarde.'
			];
		}
	}

	/********* FIN - FUNCIONES DEL MÓDULO DE REGISTRO DE MATERIALES DE LOS PROYECTOS *********/

	/********* FUNCIONES DEL MÓDULO DE REGISTRO DE INSTRUCCIONES DE FACTURACIÓN INTERNACIONAL *********/
	public function getProyectosInstruccionFactura()
	{
		$return = false;
		$hoy = date("Y-m-d", time());
		$usuario = $_SESSION["usuario"];
		$_falg_perfil = false;
		if ($usuario["id_perfil"] == 25) {
			$_falg_perfil = true;
		}

		if ($this->validaAdministrador($usuario["id_perfil"], $_falg_perfil)) {
			$sql = '
				SELECT 
					cc.id, cc.sigla, CONCAT(cc.documento,"-",cc.digito_verificacion) DOCUMENTO, cc.cod_cliente,
					IF( cioc.id_moneda = 2,
						cioc.valor,
						IF((	SELECT cmt1.valor
								FROM cmx_monedas_trm cmt1
								WHERE cmt1.id_moneda = cioc.id_moneda
									AND cmt1.fecha = "' . $hoy . '"
							),
							(	SELECT cmt1.valor + 25
								FROM cmx_monedas_trm cmt1
								WHERE cmt1.id_moneda = cioc.id_moneda
									AND cmt1.fecha = "' . $hoy . '"
							) * cioc.valor,
							NULL
						)
					) VALOR_PESOS,
					IF ( cioc.id_moneda = 1,
						cioc.valor,
						IF ( cioc.id_moneda = 2,
							IF ((	SELECT cmt1.valor
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = 1
										AND cmt1.fecha = "' . $hoy . '"
								),
								cioc.valor / (
									SELECT cmt1.valor + 25
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = 1
										AND cmt1.fecha = "' . $hoy . '"
								),
								NULL
							),
							IF(	(	SELECT cmt1.valor
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = cioc.id_moneda
										AND cmt1.fecha = "' . $hoy . '"
								),
								(	(	SELECT cmt1.valor + 25
										FROM cmx_monedas_trm cmt1
										WHERE cmt1.id_moneda = cioc.id_moneda
											AND cmt1.fecha = "' . $hoy . '"
									) * cioc.valor
								) / (	SELECT cmt1.valor + 25
										FROM cmx_monedas_trm cmt1
										WHERE cmt1.id_moneda = 1
											AND cmt1.fecha = "' . $hoy . '"
								),
								NULL
							)
						)
					) VALOR_USD
				FROM 
					cmx_intr_solicitudes cis
					INNER JOIN cmx_importacion_proyecto cip ON cip.id = cis.id_proyecto
					INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
					INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
					INNER JOIN cmx_intr_oferta_comercial cioc ON cioc.id_intr_proyecto = cis.id
					INNER JOIN cmx_monedas cm ON cm.id = cioc.id_moneda
				WHERE 
					cia.tipo_actividad = "intr_instruccion_factura"
					AND cip.estado = 1
					AND cis.estado = 1
					AND cia.estado = 2
					AND cioc.estado = 1
			';
		} else {
			$sql = '
				SELECT 
					cc.id, cc.sigla, CONCAT(cc.documento,"-",cc.digito_verificacion) DOCUMENTO, cc.cod_cliente,
					IF( cioc.id_moneda = 2,
						cioc.valor,
						IF(	(	SELECT cmt1.valor
								FROM cmx_monedas_trm cmt1
								WHERE cmt1.id_moneda = cioc.id_moneda
									AND cmt1.fecha = "' . $hoy . '"
							),
							(	SELECT cmt1.valor + 25
								FROM cmx_monedas_trm cmt1
								WHERE cmt1.id_moneda = cioc.id_moneda
									AND cmt1.fecha = "' . $hoy . '"
							) * cioc.valor,
							NULL
						)
					) VALOR_PESOS,
					IF ( cioc.id_moneda = 1,
						cioc.valor,
						IF ( cioc.id_moneda = 2,
							IF ((	SELECT cmt1.valor
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = 1
										AND cmt1.fecha = "' . $hoy . '"
								),
								cioc.valor / (
									SELECT cmt1.valor + 25
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = 1
										AND cmt1.fecha = "' . $hoy . '"
								),
								NULL
							),
							IF(	(	SELECT cmt1.valor
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = cioc.id_moneda
										AND cmt1.fecha = "' . $hoy . '"
								),
								(	(	SELECT cmt1.valor + 25
										FROM cmx_monedas_trm cmt1
										WHERE cmt1.id_moneda = cioc.id_moneda
											AND cmt1.fecha = "' . $hoy . '"
									) * cioc.valor
								) / (	SELECT cmt1.valor + 25
										FROM cmx_monedas_trm cmt1
										WHERE cmt1.id_moneda = 1
											AND cmt1.fecha = "' . $hoy . '"
								),
								NULL
							)
						)
					) VALOR_USD
				FROM cmx_intr_solicitudes cis
					INNER JOIN cmx_importacion_proyecto cip ON cip.id = cis.id_proyecto
					INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
					INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
					INNER JOIN cmx_intr_oferta_comercial cioc ON cioc.id_intr_proyecto = cis.id
					INNER JOIN cmx_monedas cm ON cm.id = cioc.id_moneda
				WHERE cia.tipo_actividad = "intr_instruccion_factura"
					AND cip.estado = 1
					AND cis.estado = 1
					AND cia.estado = 2
					AND cioc.estado = 1
					AND cia.perfil_responsable IN(
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
			';
		}
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetchAll(PDO::FETCH_ASSOC);

		if ($result) {
			$arrayClientes = array();
			foreach ($result as $key => $value) {
				if (! isset($arrayClientes[$value['id']])) {
					$arrayClientes[$value['id']]["id"] = $value['id'];
					$arrayClientes[$value['id']]["cliente"] = $value["sigla"];
					$arrayClientes[$value['id']]["DOCUMENTO"] = $value["DOCUMENTO"];
					$arrayClientes[$value['id']]["cod_cliente"] = $value["cod_cliente"];

					$arrayClientes[$value['id']]["cant_proyectos"] = 1;

					if (!$value["VALOR_PESOS"]) {
						$arrayClientes[$value['id']]["VALOR_PESOS"] = NULL;
					} else {
						$arrayClientes[$value['id']]["VALOR_PESOS"] = $value["VALOR_PESOS"];
					}

					if (!$value["VALOR_USD"]) {
						$arrayClientes[$value['id']]["VALOR_USD"] = NULL;
					} else {
						$arrayClientes[$value['id']]["VALOR_USD"] = $value["VALOR_USD"];
					}
				} else {
					$arrayClientes[$value['id']]["cant_proyectos"]++;

					if (!$arrayClientes[$value['id']]["VALOR_PESOS"] or !$value["VALOR_PESOS"]) {
						$arrayClientes[$value['id']]["VALOR_PESOS"] = NULL;
					} else {
						$arrayClientes[$value['id']]["VALOR_PESOS"] += $value["VALOR_PESOS"];
					}

					if (!$arrayClientes[$value['id']]["VALOR_USD"] or !$value["VALOR_USD"]) {
						$arrayClientes[$value['id']]["VALOR_USD"] = NULL;
					} else {
						$arrayClientes[$value['id']]["VALOR_USD"] += $value["VALOR_USD"];
					}
				}
			}
			$return["general"] = $arrayClientes;
		}
		return $return;
	}

	public function getDatosClienteInstruccion($id_cliente)
	{
		// TRM del día para liquidación de facturas
		$return["trm"] = $this->getTrmHoyFacturas();

		// Información del cliente
		$sql = '
			SELECT cc.*, 
				cm.municipio, cm.depto, cm.pais, cm.rndc_codigo_ciudad
			FROM cmx_clientes cc
				INNER JOIN cmx_municipios cm ON cm.id = cc.ciudad
			WHERE cc.id = ' . $id_cliente . '
		';
		// $result = $this->_db->getConsulta($sql);
		// $return["cliente"] = $result;
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$return["cliente"] = $result->fetch(PDO::FETCH_ASSOC);
		$hoy = date("Y-m-d", time());

		// Información de los proyectos pendientes de facturación del cliente
		$sql = '
			SELECT cis.id ID_PROYECTO_INTERNACIONAL, cip.id ID_PROYECTO,
				cip.tipo_operacion, cip.numero_importacion, cip.importacion, cip.contenedor,
				ctc.nombre TIPO_CARGA,
				cis.do, cis.tipo_transporte, cis.incoterm, cis.valor_declarado,
				cioc.id ID_OFERTA, cioc.fecha FECHA_OFERTA, cioc.valor VALOR_OFERTA, cioc.url, cioc.id_moneda ID_MONEDA_OFERTA,
				(	SELECT CONCAT( cm.nom_moneda, " (", cm.codigo, ")" )
					FROM cmx_monedas cm 
					WHERE cm.id = cioc.id_moneda
				) MONEDA_OFERTA,
				IF( cioc.id_moneda = 2,
					cioc.valor,
					IF(	(	SELECT cmt1.valor
							FROM cmx_monedas_trm cmt1
							WHERE cmt1.id_moneda = cioc.id_moneda
								AND cmt1.fecha = cioc.fecha
						),
						(	SELECT cmt1.valor
							FROM cmx_monedas_trm cmt1
							WHERE cmt1.id_moneda = cioc.id_moneda
								AND cmt1.fecha = cioc.fecha
						) * cioc.valor,
						NULL
					)
				) VALOR_PESOS,
				IF( cioc.id_moneda = 2,
					cioc.valor,
					IF(	(	SELECT cmt1.valor
							FROM cmx_monedas_trm cmt1
							WHERE cmt1.id_moneda = cioc.id_moneda
								AND cmt1.fecha = "' . $hoy . '"
						),
						(	SELECT (cmt1.valor + 25)
							FROM cmx_monedas_trm cmt1
							WHERE cmt1.id_moneda = cioc.id_moneda
								AND cmt1.fecha = "' . $hoy . '"
						) * cioc.valor,
						NULL
					)
				) VALOR_PESOS_FACTURA,
				IF ( cioc.id_moneda = 1,
					cioc.valor,
					IF ( cioc.id_moneda = 2,
						IF ((	SELECT cmt1.valor
								FROM cmx_monedas_trm cmt1
								WHERE cmt1.id_moneda = 1
									AND cmt1.fecha = cioc.fecha
							),
							cioc.valor / (
								SELECT cmt1.valor
								FROM cmx_monedas_trm cmt1
								WHERE cmt1.id_moneda = 1
									AND cmt1.fecha = cioc.fecha
							),
							NULL
						),
						IF(	(	SELECT cmt1.valor
								FROM cmx_monedas_trm cmt1
								WHERE cmt1.id_moneda = cioc.id_moneda
									AND cmt1.fecha = cioc.fecha
							),
							(	(	SELECT cmt1.valor
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = cioc.id_moneda
										AND cmt1.fecha = cioc.fecha
								) * cioc.valor
							) / (	SELECT cmt1.valor
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = 1
										AND cmt1.fecha = cioc.fecha
							),
							NULL
						)
					)
				) VALOR_USD,
				IF ( cioc.id_moneda = 1,
					cioc.valor,
					IF ( cioc.id_moneda = 2,
						IF ((	SELECT cmt1.valor + 25
								FROM cmx_monedas_trm cmt1
								WHERE cmt1.id_moneda = 1
									AND cmt1.fecha = "' . $hoy . '"
							),
							cioc.valor / (
								SELECT cmt1.valor + 25
								FROM cmx_monedas_trm cmt1
								WHERE cmt1.id_moneda = 1
									AND cmt1.fecha = "' . $hoy . '"
							),
							NULL
						),
						IF(	(	SELECT cmt1.valor
								FROM cmx_monedas_trm cmt1
								WHERE cmt1.id_moneda = cioc.id_moneda
									AND cmt1.fecha = "' . $hoy . '"
							),
							(	(	SELECT cmt1.valor + 25
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = cioc.id_moneda
										AND cmt1.fecha = "' . $hoy . '"
								) * cioc.valor
							) / (	SELECT cmt1.valor + 25
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = 1
										AND cmt1.fecha = "' . $hoy . '"
							),
							NULL
						)
					)
				) VALOR_USD_FACTURA,
				cia.id ID_ACTIVIDAD, cia.orden, cia.fecha_hora_inicio, cia.id_importacion, cia.bloque, cia.grupo, cia.simultaneo, cia.tipo_actividad, 
				cia.costo_real, cia.respuesta 
			FROM 
				cmx_importacion_proyecto cip
				INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
				INNER JOIN cmx_tipo_carga ctc ON ctc.id = cip.id_tipo_carga
				INNER JOIN cmx_intr_solicitudes cis ON cis.id_proyecto = cip.id
				INNER JOIN cmx_intr_oferta_comercial cioc ON cioc.id_intr_proyecto = cis.id
			WHERE 
				cia.tipo_actividad = "intr_instruccion_factura"
				AND cip.estado = 1
				AND cip.id_cliente = ' . $id_cliente . '
				AND cis.estado = 1
				AND cia.estado = 2
				AND cioc.estado = 1
		';
		// $result = $this->_db->getConsulta($sql);
		// $return["proyectos"] = $result;
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$return["proyectos"] = $result->fetchAll(PDO::FETCH_ASSOC);

		if ($return["proyectos"]) {
			$arrayTramos = array();
			$arrayDocumentosEnvio = array();
			$arrayImpuestos = array();
			$arraySobrecostos = array();
			// foreach ($result["rowsData"] as $key => $value) {
			foreach ($return["proyectos"] as $key => $value) {
				$arrayTramos[$value['ID_PROYECTO_INTERNACIONAL']] = $this->getTramosMaterialProyecto($value['ID_PROYECTO_INTERNACIONAL']);
				$arrayDocumentosEnvio[$value['ID_PROYECTO_INTERNACIONAL']] = $this->getDocumentosEnvio($value['ID_PROYECTO_INTERNACIONAL']);
				$arrayConceptos[$value['ID_PROYECTO_INTERNACIONAL']] = $this->getConceptosProyecto($value['ID_PROYECTO_INTERNACIONAL']);

				// Se busca los impuestos generados en el proyecto
				$sql = '
					SELECT cif.*,
						IF((	SELECT cm1.id
								FROM cmx_monedas cm1
								WHERE cm1.id = cif.id_moneda
							),
							(	SELECT CONCAT(cm1.nom_moneda," (",cm1.codigo,")")
								FROM cmx_monedas cm1
								WHERE cm1.id = cif.id_moneda
							),
							NULL
						) MONEDA,
						cic.nombre, cic.descripcion,
						cico.id ID_COTIZACION, cico.proveedor, cico.descripcion,
						IF( cif.id_moneda = 2,
							cif.valor,
							IF(	(	SELECT cmt1.valor
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = cif.id_moneda
										AND cmt1.fecha = "' . $hoy . '"
								),
								(	SELECT (cmt1.valor + 25)
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = cif.id_moneda
										AND cmt1.fecha = "' . $hoy . '"
								) * cif.valor,
								NULL
							)
						) VALOR_PESOS_FACTURA,
						IF ( cif.id_moneda = 1,
							cif.valor,
							IF ( cif.id_moneda = 2,
								IF ((	SELECT cmt1.valor + 25
										FROM cmx_monedas_trm cmt1
										WHERE cmt1.id_moneda = 1
											AND cmt1.fecha = "' . $hoy . '"
									),
									cif.valor / (
										SELECT cmt1.valor + 25
										FROM cmx_monedas_trm cmt1
										WHERE cmt1.id_moneda = 1
											AND cmt1.fecha = "' . $hoy . '"
									),
									NULL
								),
								IF(	(	SELECT cmt1.valor
										FROM cmx_monedas_trm cmt1
										WHERE cmt1.id_moneda = cif.id_moneda
											AND cmt1.fecha = "' . $hoy . '"
									),
									(	(	SELECT cmt1.valor + 25
											FROM cmx_monedas_trm cmt1
											WHERE cmt1.id_moneda = cif.id_moneda
												AND cmt1.fecha = "' . $hoy . '"
										) * cif.valor
									) / (	SELECT cmt1.valor + 25
											FROM cmx_monedas_trm cmt1
											WHERE cmt1.id_moneda = 1
												AND cmt1.fecha = "' . $hoy . '"
									),
									NULL
								)
							)
						) VALOR_USD_FACTURA
					FROM cmx_intr_facturas cif
						INNER JOIN cmx_intr_cotizaciones cico ON cico.id_factura = cif.id
						INNER JOIN cmx_intr_conceptos cic ON cic.id = cico.id_concepto
					WHERE cico.id_intr_proyecto = ' . $value['ID_PROYECTO_INTERNACIONAL'] . '
						AND cico.id_concepto = 11
						AND cico.estado = 1
				';
				// $result_01 = $this->_db->getConsulta($sql);
				$result_01 = $this->_db3->prepare($sql);
				$result_01->execute();
				$result_01 = $result_01->fetchAll(PDO::FETCH_ASSOC);

				if ($result_01) {
					$arrayImpuestos[$value['ID_PROYECTO_INTERNACIONAL']] = $result_01;
				}

				// Se busca los sobrecostos generados en el proyecto
				$sql = '
					SELECT cif.*,
						IF((	SELECT cm1.id
								FROM cmx_monedas cm1
								WHERE cm1.id = cif.id_moneda
							),
							(	SELECT CONCAT(cm1.nom_moneda," (",cm1.codigo,")")
								FROM cmx_monedas cm1
								WHERE cm1.id = cif.id_moneda
							),
							NULL
						) MONEDA,
						cic.nombre, cic.descripcion,
						cico.id ID_COTIZACION, cico.proveedor, cico.descripcion,
						IF( cif.id_moneda = 2,
							cif.valor,
							IF((	SELECT cmt1.valor
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = cif.id_moneda
										AND cmt1.fecha = "' . $hoy . '"
								),
								(	SELECT (cmt1.valor + 25)
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = cif.id_moneda
										AND cmt1.fecha = "' . $hoy . '"
								) * cif.valor,
								NULL
							)
						) VALOR_PESOS_FACTURA,
						IF ( cif.id_moneda = 1,
							cif.valor,
							IF ( cif.id_moneda = 2,
								IF ((	SELECT cmt1.valor + 25
										FROM cmx_monedas_trm cmt1
										WHERE cmt1.id_moneda = 1
											AND cmt1.fecha = "' . $hoy . '"
									),
									cif.valor / (
										SELECT cmt1.valor + 25
										FROM cmx_monedas_trm cmt1
										WHERE cmt1.id_moneda = 1
											AND cmt1.fecha = "' . $hoy . '"
									),
									NULL
								),
								IF(	(	SELECT cmt1.valor
										FROM cmx_monedas_trm cmt1
										WHERE cmt1.id_moneda = cif.id_moneda
											AND cmt1.fecha = "' . $hoy . '"
									),
									(	(	SELECT cmt1.valor + 25
											FROM cmx_monedas_trm cmt1
											WHERE cmt1.id_moneda = cif.id_moneda
												AND cmt1.fecha = "' . $hoy . '"
										) * cif.valor
									) / (	SELECT cmt1.valor + 25
											FROM cmx_monedas_trm cmt1
											WHERE cmt1.id_moneda = 1
												AND cmt1.fecha = "' . $hoy . '"
									),
									NULL
								)
							)
						) VALOR_USD_FACTURA
					FROM cmx_intr_facturas cif
						INNER JOIN cmx_intr_cotizaciones cico ON cico.id_factura = cif.id
						INNER JOIN cmx_intr_conceptos cic ON cic.id = cico.id_concepto
					WHERE cico.id_intr_proyecto = ' . $value['ID_PROYECTO_INTERNACIONAL'] . '
						AND cico.id_concepto != 11
						AND cico.sobrecosto = 1
						AND cico.estado = 1
				';
				// $result_01 = $this->_db->getConsulta($sql);
				$result_01 = $this->_db3->prepare($sql);
				$result_01->execute();
				$result_01 = $result_01->fetchAll(PDO::FETCH_ASSOC);
				if ($result_01) {
					$arraySobrecostos[$value['ID_PROYECTO_INTERNACIONAL']] = $result_01;
				}
			}
			$return["tramos"] = $arrayTramos;
			$return["documentos_envio"] = $arrayDocumentosEnvio;
			$return["impuestos"] = $arrayImpuestos;
			$return["sobrecostos"] = $arraySobrecostos;
			$return["conceptos"] = $arrayConceptos;
		}
		return $return;
	}

	public function getDatosProyectosFactura($id_intr_proyecto)
	{
		$sql = '
			SELECT cis.*, cip.tipo_operacion, 
				cioc.fecha, CONCAT(cm.nom_moneda," (",cm.codigo,")") MONEDA, cioc.valor
			FROM cmx_intr_solicitudes cis 
				INNER JOIN cmx_importacion_proyecto cip ON cip.id = cis.id_proyecto
				INNER JOIN cmx_intr_oferta_comercial cioc ON cioc.id_intr_proyecto = cis.id
				INNER JOIN cmx_monedas cm ON cm.id = cioc.id_moneda
			WHERE cis.id = ' . $id_intr_proyecto . '
				AND cioc.estado = 1
		';
		$return["general"] = $this->_db->getConsulta($sql);

		$return["tramos"] = $this->getTramosMaterialProyecto($id_intr_proyecto);
		return $return;
	}
	/********* FIN - FUNCIONES DEL MÓDULO DE REGISTRO DE INSTRUCCIONES DE FACTURACIÓN INTERNACIONAL *********/

	/********* FUNCIONES DEL MÓDULO DE REGISTRO DE FACTURACIÓN INTERNACIONAL *********/
	public function getProyectosIntrFacturacion()
	{
		$return = false;
		$usuario = $_SESSION["usuario"];

		$_falg_perfil = false;
		if ($usuario["id_perfil"] == 22 or $usuario["id_perfil"] == 14) {
			$_falg_perfil = true;
		}
		if ($this->validaAdministrador($usuario["id_perfil"], $_falg_perfil)) {
			$sql = '
				SELECT cifc.*,
					COUNT(cis.id_factura) CUANTOS_DO,
					cc.sigla, CONCAT(cc.documento,"-",cc.digito_verificacion) DOCUMENTO, cc.cod_cliente
				FROM cmx_intr_factura_cliente cifc
					INNER JOIN cmx_intr_solicitudes cis ON cis.id_factura = cifc.id
					INNER JOIN cmx_importacion_proyecto cip ON cip.id = cis.id_proyecto
					INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
					INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
				WHERE cia.tipo_actividad = "intr_factura"
					AND cip.estado = 1
					AND cis.estado = 1
					AND cia.estado = 2
				GROUP BY cifc.id
			';
			// $result = $this->_db->getConsulta($sql);
			$result = $this->_db3->prepare($sql);
			$result->execute();
			$result = $result->fetchAll(PDO::FETCH_ASSOC);
			if ($result) {
				$return["general"] = $result;
				foreach ($result as $key => $value) {
					$sql = '
						SELECT cis.do
						FROM cmx_intr_solicitudes cis
						WHERE cis.id_factura = ' . $value['id'] . '
					';
					// $result_01 = $this->_db->getConsulta($sql);
					$result_01 = $this->_db3->prepare($sql);
					$result_01->execute();
					$result_01 = $result_01->fetchAll(PDO::FETCH_ASSOC);
					if ($result_01) {
						foreach ($result_01 as $key_01 => $value_01) {
							$return["do"][$value['id']][] = $value_01['do'];
						}
					}
				}
			}
		}
		return $return;
	}

	public function getDatosInstruccionFactura($id_factura)
	{
		// Información del cliente
		$sql = '
			SELECT cc.*, 
				cm.municipio, cm.depto, cm.pais, cm.rndc_codigo_ciudad
			FROM cmx_intr_factura_cliente cifc
				INNER JOIN cmx_clientes cc ON cc.id = cifc.id_cliente
				INNER JOIN cmx_municipios cm ON cm.id = cc.ciudad
			WHERE cifc.id = ' . $id_factura . '
		';
		// $result = $this->_db->getConsulta($sql);
		// $return["cliente"] = $result;
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$return["cliente"] = $result->fetch(PDO::FETCH_ASSOC);
		$hoy = date("Y-m-d", time());

		// Información de los proyectos pendientes de facturación del cliente
		$sql = '
			SELECT cis.id ID_PROYECTO_INTERNACIONAL, cip.id ID_PROYECTO,
				cip.tipo_operacion, cip.numero_importacion, cip.importacion, cip.contenedor,
				ctc.nombre TIPO_CARGA,
				cis.do, cis.tipo_transporte, cis.valor_facturado, cis.valor_agenciamiento, cis.comodin_facturacion,
				cifc.num_proforma, cifc.subtotal, cifc.iva, cifc.retefuente, cifc.total, 
				cifc.num_factura, cifc.fecha FECHA_FACTURA, cifc.fecha_vencimiento, 
				cioc.id ID_OFERTA, cioc.fecha FECHA_OFERTA, cioc.valor VALOR_OFERTA, cioc.url, cioc.id_moneda ID_MONEDA_OFERTA,
				(	SELECT CONCAT( cm.nom_moneda, " (", cm.codigo, ")" )
					FROM cmx_monedas cm 
					WHERE cm.id = cioc.id_moneda
				) MONEDA_OFERTA,
				cia.id ID_ACTIVIDAD, cia.orden, cia.fecha_hora_inicio, cia.id_importacion, cia.bloque, cia.grupo, cia.simultaneo, cia.tipo_actividad, 
				cia.costo_real, cia.respuesta 
			FROM cmx_importacion_proyecto cip
				INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
				INNER JOIN cmx_tipo_carga ctc ON ctc.id = cip.id_tipo_carga
				INNER JOIN cmx_intr_solicitudes cis ON cis.id_proyecto = cip.id
				INNER JOIN cmx_intr_oferta_comercial cioc ON cioc.id_intr_proyecto = cis.id
				INNER JOIN cmx_intr_factura_cliente cifc ON cifc.id = cis.id_factura
			WHERE cia.tipo_actividad = "intr_factura"
				AND cip.estado = 1
				AND cifc.id = ' . $id_factura . '
				AND cis.estado = 1
				AND cia.estado = 2
				AND cioc.estado = 1
		';
		// $result = $this->_db->getConsulta($sql);
		// $return["proyectos"] = $result;
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$return["proyectos"] = $result->fetchAll(PDO::FETCH_ASSOC);

		if ($result) {
			/***** Datos para el contenido del total de la factura *****/
			// Se busca las trm usadas para la factura
			$sql = '
				SELECT cift.valor, CONCAT(cm.nom_moneda," (",cm.codigo,")") MONEDA
				FROM cmx_intr_factura_trm cift
					INNER JOIN cmx_monedas cm ON cm.id = cift.id_moneda
				WHERE cift.id_factura = ' . $id_factura . '
			';
			// $result_01 = $this->_db->getConsulta($sql);
			$result_01 = $this->_db3->prepare($sql);
			$result_01->execute();
			$result_01 = $result_01->fetchAll(PDO::FETCH_ASSOC);
			if ($result_01) {
				$arrayTrm = [];
				foreach ($result_01 as $key => $value) {
					$arrayTrm[] = $value;
				}
			}

			$arrayTramos = [];
			$arrayDocumentosEnvio = [];
			$arrayImpuestos = [];
			$arraySobrecostos = [];
			foreach ($return["proyectos"] as $key => $value) {
				$arrayTramos[$value['ID_PROYECTO_INTERNACIONAL']] = $this->getTramosMaterialProyecto($value['ID_PROYECTO_INTERNACIONAL']);
				$arrayDocumentosEnvio[$value['ID_PROYECTO_INTERNACIONAL']] = $this->getDocumentosEnvio($value['ID_PROYECTO_INTERNACIONAL']);
				$arrayConceptos[$value['ID_PROYECTO_INTERNACIONAL']] = $this->getConceptosProyecto($value['ID_PROYECTO_INTERNACIONAL']);

				// Se busca los impuestos generados en el proyecto
				$sql = '
					SELECT cif.*,
						IF(	(	SELECT cm1.id
								FROM cmx_monedas cm1
								WHERE cm1.id = cif.id_moneda),
							(	SELECT CONCAT(cm1.nom_moneda," (",cm1.codigo,")")
								FROM cmx_monedas cm1
								WHERE cm1.id = cif.id_moneda),
							NULL
						) MONEDA,
						cic.nombre, cic.descripcion,
						cico.id ID_COTIZACION, cico.proveedor, cico.descripcion, cico.valor_facturado,
						IF( cif.id_moneda = 2,
							cif.valor,
							IF(	(	SELECT cmt1.valor
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = cif.id_moneda
										AND cmt1.fecha = "' . $hoy . '"),
								(	SELECT (cmt1.valor + 25)
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = cif.id_moneda
										AND cmt1.fecha = "' . $hoy . '"
								) * cif.valor,
								NULL
							)
						) VALOR_PESOS_FACTURA,
						IF ( cif.id_moneda = 1,
							cif.valor,
							IF ( cif.id_moneda = 2,
								IF(	(	SELECT cmt1.valor + 25
										FROM cmx_monedas_trm cmt1
										WHERE cmt1.id_moneda = 1
											AND cmt1.fecha = "' . $hoy . '"),
									cif.valor / (
										SELECT cmt1.valor + 25
										FROM cmx_monedas_trm cmt1
										WHERE cmt1.id_moneda = 1
											AND cmt1.fecha = "' . $hoy . '"),
									NULL
								),
								IF(	(	SELECT cmt1.valor
										FROM cmx_monedas_trm cmt1
										WHERE cmt1.id_moneda = cif.id_moneda
											AND cmt1.fecha = "' . $hoy . '"),
									((	SELECT cmt1.valor + 25
										FROM cmx_monedas_trm cmt1
										WHERE cmt1.id_moneda = cif.id_moneda
											AND cmt1.fecha = "' . $hoy . '"
									) * cif.valor
									) / (	SELECT cmt1.valor + 25
											FROM cmx_monedas_trm cmt1
											WHERE cmt1.id_moneda = 1
												AND cmt1.fecha = "' . $hoy . '"),
									NULL
								)
							)
						) VALOR_USD_FACTURA
					FROM cmx_intr_facturas cif
						INNER JOIN cmx_intr_cotizaciones cico ON cico.id_factura = cif.id
						INNER JOIN cmx_intr_conceptos cic ON cic.id = cico.id_concepto
					WHERE cico.id_intr_proyecto = ' . $value['ID_PROYECTO_INTERNACIONAL'] . '
						AND cico.id_concepto = 11
						AND cico.estado = 1
				';
				// $result_01 = $this->_db->getConsulta($sql);
				$result_01 = $this->_db3->prepare($sql);
				$result_01->execute();
				$result_01 = $result_01->fetchAll(PDO::FETCH_ASSOC);
				// $return["proyectos"][$key]["impuestos"] = $result_01->fetchAll(PDO::FETCH_ASSOC);
				if ($result_01) {
					$arrayImpuestos[$value['ID_PROYECTO_INTERNACIONAL']] = $result_01;
				}

				// Se busca los impuestos generados en el proyecto
				$sql = '
					SELECT cif.*,
						IF((	SELECT cm1.id
								FROM cmx_monedas cm1
								WHERE cm1.id = cif.id_moneda),
							(	SELECT CONCAT(cm1.nom_moneda," (",cm1.codigo,")")
								FROM cmx_monedas cm1
								WHERE cm1.id = cif.id_moneda),
							NULL
						) MONEDA,
						cic.nombre, cic.descripcion,
						cico.id ID_COTIZACION, cico.proveedor, cico.descripcion, cico.valor_facturado,
						IF( cif.id_moneda = 2,
							cif.valor,
							IF(	(	SELECT cmt1.valor
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = cif.id_moneda
										AND cmt1.fecha = "' . $hoy . '"),
								(	SELECT (cmt1.valor + 25)
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = cif.id_moneda
										AND cmt1.fecha = "' . $hoy . '"
								) * cif.valor,
								NULL
							)
						) VALOR_PESOS_FACTURA,
						IF ( cif.id_moneda = 1,
							cif.valor,
							IF ( cif.id_moneda = 2,
								IF(	(	SELECT cmt1.valor + 25
										FROM cmx_monedas_trm cmt1
										WHERE cmt1.id_moneda = 1
											AND cmt1.fecha = "' . $hoy . '"),
									cif.valor / (
										SELECT cmt1.valor + 25
										FROM cmx_monedas_trm cmt1
										WHERE cmt1.id_moneda = 1
											AND cmt1.fecha = "' . $hoy . '"),
									NULL
								),
								IF(	(	SELECT cmt1.valor
										FROM cmx_monedas_trm cmt1
										WHERE cmt1.id_moneda = cif.id_moneda
											AND cmt1.fecha = "' . $hoy . '"),
									(	(	SELECT cmt1.valor + 25
											FROM cmx_monedas_trm cmt1
											WHERE cmt1.id_moneda = cif.id_moneda
												AND cmt1.fecha = "' . $hoy . '"
										) * cif.valor
									) / (	SELECT cmt1.valor + 25
											FROM cmx_monedas_trm cmt1
											WHERE cmt1.id_moneda = 1
												AND cmt1.fecha = "' . $hoy . '"),
									NULL
								)
							)
						) VALOR_USD_FACTURA
					FROM cmx_intr_facturas cif
						INNER JOIN cmx_intr_cotizaciones cico ON cico.id_factura = cif.id
						INNER JOIN cmx_intr_conceptos cic ON cic.id = cico.id_concepto
					WHERE cico.id_intr_proyecto = ' . $value['ID_PROYECTO_INTERNACIONAL'] . '
						AND cico.id_concepto != 11
						AND cico.sobrecosto = 1
						AND cico.estado = 1
				';
				// $result_01 = $this->_db->getConsulta($sql);
				$result_01 = $this->_db3->prepare($sql);
				$result_01->execute();
				$result_01 = $result_01->fetchAll(PDO::FETCH_ASSOC);
				if ($result_01) {
					$arraySobrecostos[$value['ID_PROYECTO_INTERNACIONAL']] = $result_01;
				}
			}
			$return["tramos"] = $arrayTramos;
			$return["documentos_envio"] = $arrayDocumentosEnvio;
			$return["impuestos"] = $arrayImpuestos;
			$return["sobrecostos"] = $arraySobrecostos;
			$return["conceptos"] = $arrayConceptos;

			// Se toma la información para los totales de la factura
			// $factura = $result["rowsData"][0];
			$factura = $return["proyectos"][0];
			$arrayFactura = array();
			$arrayFactura["num_proforma"] = $factura["num_proforma"];
			$arrayFactura["subtotal"] = $factura["subtotal"];
			$arrayFactura["iva"] = $factura["iva"];
			$arrayFactura["retefuente"] = $factura["retefuente"];
			$arrayFactura["total"] = $factura["total"];
			$arrayFactura["num_factura"] = $factura["num_factura"];
			$arrayFactura["fecha"] = $factura["FECHA_FACTURA"];
			$arrayFactura["fecha_vencimiento"] = $factura["fecha_vencimiento"];
			if (isset($arrayTrm)) {
				$arrayFactura["trm"] = $arrayTrm;
			}
			$return["factura"] = $arrayFactura;
		}
		return $return;
	}
	/********* FIN - FUNCIONES DEL MÓDULO DE REGISTRO DE FACTURACIÓN INTERNACIONAL *********/

	/********* FUNCIONES DEL MÓDULO DE CARTERA INTERNACIONAL *********/
	public function getDatosInternacionalCartera()
	{
		$return = false;
		$usuario = $_SESSION["usuario"];
		$_falg_perfil = false;

		if ($this->validaAdministrador($usuario["id_perfil"], $_falg_perfil)) {
			$sql = '
				SELECT cc.id,
					cc.cod_cliente, cc.sigla, cc.regimen, CONCAT(cc.documento,"-",cc.digito_verificacion) DOCUMENTO,
					SUM((	SELECT COUNT(DISTINCT(cis1.id_factura))
							FROM cmx_intr_solicitudes cis1
							WHERE cis1.id_factura = cifc.id
					)) CANT_DO,
					SUM((
						SELECT DISTINCT(cifc1.total)
						FROM cmx_intr_factura_cliente cifc1
							INNER JOIN cmx_intr_solicitudes cis1 ON cis1.id_factura = cifc1.id
						WHERE cis1.id_factura = cifc.id
					)) SUMA
				FROM cmx_intr_factura_cliente cifc
					INNER JOIN cmx_clientes cc ON  cc.id = cifc.id_cliente
				WHERE cifc.cartera = "Pendiente"
					AND cifc.fecha IS NOT NULL
				GROUP BY cc.id
				HAVING CANT_DO > 0
			';
		} else {
			$sql = '
				SELECT cc.id,
					cc.cod_cliente, cc.sigla, cc.regimen, CONCAT(cc.documento,"-",cc.digito_verificacion) DOCUMENTO,
					SUM((	SELECT COUNT(DISTINCT(cis1.id_factura))
							FROM cmx_intr_solicitudes cis1
							WHERE cis1.id_factura = cifc.id
					)) CANT_DO,
					SUM(cifc.total) SUMA
				FROM 
					cmx_intr_factura_cliente cifc
					INNER JOIN cmx_clientes cc ON  cc.id = cifc.id_cliente
				WHERE cifc.cartera = "Pendiente"
					AND cifc.fecha IS NOT NULL
					AND cifc.id_cliente IN (
						SELECT ccsc1.id_cliente
						FROM cmx_clientes_serv_contratados ccsc1
							INNER JOIN cmx_clientes_serv_responsables ccsr1 ON ccsr1.id_serv_contratado = ccsc1.id
						WHERE ccsc1.id_cliente = cc.id
							AND ccsc1.servicio = "Transporte de Carga Internacional"
							AND ccsr1.estado = 1
							AND ccsr1.id_usuario = ' . $usuario["id_usuario"] . '
					)
				GROUP BY cc.id
				HAVING CANT_DO > 0
			';
		}
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$return = $result->fetchAll(PDO::FETCH_ASSOC);
		$return["general"] = $return;
		// $return["general"] = $result["rowsData"];
		// $result = $this->_db->getConsulta($sql);
		// $return["general"] = $result["rowsData"];

		if ($return["general"]) {
			foreach ($return["general"] as $key => $value) {
				$sql = '
					SELECT cis.do
					FROM cmx_intr_factura_cliente cifc
						INNER JOIN cmx_intr_solicitudes cis ON cis.id_factura = cifc.id
					WHERE cifc.id = ' . $value['id'] . '
				';
			}
			// $result = $this->_db->getConsulta($sql);
			// $return["do"][$value[0]] = $result["rowsData"];
			$result = $this->_db3->prepare($sql);
			$result->execute();
			$return["do"][$value["id"]] = $result->fetchAll(PDO::FETCH_ASSOC);
		}
		return $return;
	}

	public function getDatosInternacionalCarteraCliente($id_cliente)
	{
		$sql = '
			SELECT cifc.id,
				cc.cod_cliente, cc.sigla, cc.regimen, CONCAT(cc.documento,"-",cc.digito_verificacion) DOCUMENTO,
				(	SELECT COUNT(DISTINCT(cis1.id_factura))
					FROM cmx_intr_solicitudes cis1
					WHERE cis1.id_factura = cifc.id
				) CANT_DO,
				cifc.num_proforma, cifc.num_factura, cifc.fecha, cifc.fecha_vencimiento, cifc.total, cifc.url
			FROM cmx_intr_factura_cliente cifc
				INNER JOIN cmx_clientes cc ON cc.id = cifc.id_cliente
			WHERE cifc.cartera = "Pendiente"
				AND cifc.fecha IS NOT NULL
				AND cc.id = ' . $id_cliente . '
			HAVING CANT_DO > 0
			ORDER BY cifc.fecha_vencimiento
		';
		// $result = $this->_db->getConsulta($sql);
		// $return["general"] = $result["rowsData"];
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$return["general"] = $result->fetchAll(PDO::FETCH_ASSOC);

		if ($return["general"]) {
			foreach ($return["general"] as $key => $value) {
				$sql = '
					SELECT cis.do
					FROM cmx_intr_factura_cliente cifc
						INNER JOIN cmx_intr_solicitudes cis ON cis.id_factura = cifc.id
					WHERE cifc.id = ' . $value['id'] . '
				';
				// $result = $this->_db->getConsulta($sql);
				// $return["do"][$value[0]] = $result["rowsData"];
				$result = $this->_db3->prepare($sql);
				$result->execute();
				$return["do"][$value["id"]] = $result->fetchAll(PDO::FETCH_ASSOC);
			}
		}
		return $return;
	}

	public function getDatosCartera($id_factura)
	{
		// Información del cliente
		$sql = '
			SELECT cc.*, 
				cm.municipio, cm.depto, cm.pais, cm.rndc_codigo_ciudad
			FROM cmx_intr_factura_cliente cifc
				INNER JOIN cmx_clientes cc ON cc.id = cifc.id_cliente
				INNER JOIN cmx_municipios cm ON cm.id = cc.ciudad
			WHERE cifc.id = ' . $id_factura . '
		';
		// $result = $this->_db->getConsulta($sql);
		// $return["cliente"] = $result;
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$return["cliente"] = $result->fetch(PDO::FETCH_ASSOC);
		$hoy = date("Y-m-d", time());

		// Información de los proyectos pendientes de facturación del cliente
		$sql = '
			SELECT cis.id ID_PROYECTO_INTERNACIONAL, cip.id ID_PROYECTO,
				cip.tipo_operacion, cip.numero_importacion, cip.importacion, cip.contenedor,
				ctc.nombre TIPO_CARGA,
				cis.do, cis.tipo_transporte, cis.valor_facturado, cis.valor_agenciamiento, cis.comodin_facturacion,
				cifc.num_proforma, cifc.subtotal, cifc.iva, cifc.retefuente, cifc.total, 
				cifc.num_factura, cifc.fecha FECHA_FACTURA, cifc.fecha_vencimiento, 
				cioc.id ID_OFERTA, cioc.fecha FECHA_OFERTA, cioc.valor VALOR_OFERTA, cioc.url, cioc.id_moneda ID_MONEDA_OFERTA,
				(	SELECT CONCAT( cm.nom_moneda, " (", cm.codigo, ")" )
					FROM cmx_monedas cm 
					WHERE cm.id = cioc.id_moneda
				) MONEDA_OFERTA 
			FROM cmx_importacion_proyecto cip
				INNER JOIN cmx_tipo_carga ctc ON ctc.id = cip.id_tipo_carga
				INNER JOIN cmx_intr_solicitudes cis ON cis.id_proyecto = cip.id
				INNER JOIN cmx_intr_oferta_comercial cioc ON cioc.id_intr_proyecto = cis.id
				INNER JOIN cmx_intr_factura_cliente cifc ON cifc.id = cis.id_factura
			WHERE cip.estado = 1
				AND cifc.id = ' . $id_factura . '
				AND cis.estado = 1
				AND cioc.estado = 1
		';
		// $result = $this->_db->getConsulta($sql);
		// $return["proyectos"] = $result;
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$return["proyectos"] = $result->fetchAll(PDO::FETCH_ASSOC);

		if ($result) {
			/***** Datos para el contenido del total de la factura *****/
			// Se busca las trm usadas para la factura
			$sql = '
				SELECT cift.valor, CONCAT(cm.nom_moneda," (",cm.codigo,")") MONEDA
				FROM cmx_intr_factura_trm cift
					INNER JOIN cmx_monedas cm ON cm.id = cift.id_moneda
				WHERE cift.id_factura = ' . $id_factura . '
			';
			// $result_01 = $this->_db->getConsulta($sql);
			$result_01 = $this->_db3->prepare($sql);
			$result_01->execute();
			$result_01 = $result_01->fetchAll(PDO::FETCH_ASSOC);

			if ($result_01) {
				$arrayTrm = [];
				foreach ($result_01 as $key => $value) {
					$arrayTrm[] = $value;
				}
			}

			$arrayTramos = [];
			$arrayDocumentosEnvio = [];
			$arrayImpuestos = [];
			$arraySobrecostos = [];
			foreach ($return["proyectos"] as $key => $value) {
				// foreach ($result["rowsData"] as $key => $value) {
				$arrayTramos[$value['ID_PROYECTO_INTERNACIONAL']] = $this->getTramosMaterialProyecto($value['ID_PROYECTO_INTERNACIONAL']);
				$arrayDocumentosEnvio[$value['ID_PROYECTO_INTERNACIONAL']] = $this->getDocumentosEnvio($value['ID_PROYECTO_INTERNACIONAL']);
				$arrayConceptos[$value['ID_PROYECTO_INTERNACIONAL']] = $this->getConceptosProyecto($value['ID_PROYECTO_INTERNACIONAL']);

				// Se busca los impuestos generados en el proyecto
				$sql = '
					SELECT cif.*,
						IF(	(	SELECT cm1.id
								FROM cmx_monedas cm1
								WHERE cm1.id = cif.id_moneda),
							(	SELECT CONCAT(cm1.nom_moneda," (",cm1.codigo,")")
								FROM cmx_monedas cm1
								WHERE cm1.id = cif.id_moneda),
							NULL
						) MONEDA,
						cic.nombre, cic.descripcion,
						cico.id ID_COTIZACION, cico.proveedor, cico.descripcion, cico.valor_facturado,
						IF( cif.id_moneda = 2,
							cif.valor,
							IF(	(	SELECT cmt1.valor
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = cif.id_moneda
										AND cmt1.fecha = "' . $hoy . '"),
								(	SELECT (cmt1.valor + 25)
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = cif.id_moneda
										AND cmt1.fecha = "' . $hoy . '"
								) * cif.valor,
								NULL
							)
						) VALOR_PESOS_FACTURA,
						IF ( cif.id_moneda = 1,
							cif.valor,
							IF ( cif.id_moneda = 2,
								IF(	(	SELECT cmt1.valor + 25
										FROM cmx_monedas_trm cmt1
										WHERE cmt1.id_moneda = 1
											AND cmt1.fecha = "' . $hoy . '"),
									cif.valor / (
										SELECT cmt1.valor + 25
										FROM cmx_monedas_trm cmt1
										WHERE cmt1.id_moneda = 1
											AND cmt1.fecha = "' . $hoy . '"),
									NULL
								),
								IF(	(	SELECT cmt1.valor
										FROM cmx_monedas_trm cmt1
										WHERE cmt1.id_moneda = cif.id_moneda
											AND cmt1.fecha = "' . $hoy . '"),
									((	SELECT cmt1.valor + 25
										FROM cmx_monedas_trm cmt1
										WHERE cmt1.id_moneda = cif.id_moneda
											AND cmt1.fecha = "' . $hoy . '"
									) * cif.valor
									) / (	SELECT cmt1.valor + 25
											FROM cmx_monedas_trm cmt1
											WHERE cmt1.id_moneda = 1
												AND cmt1.fecha = "' . $hoy . '"),
									NULL
								)
							)
						) VALOR_USD_FACTURA
					FROM cmx_intr_facturas cif
						INNER JOIN cmx_intr_cotizaciones cico ON cico.id_factura = cif.id
						INNER JOIN cmx_intr_conceptos cic ON cic.id = cico.id_concepto
					WHERE cico.id_intr_proyecto = ' . $value['ID_PROYECTO_INTERNACIONAL'] . '
						AND cico.id_concepto = 11
						AND cico.estado = 1
				';
				// $result_01 = $this->_db->getConsulta($sql);
				$result_01 = $this->_db3->prepare($sql);
				$result_01->execute();
				$result_01 = $result_01->fetchAll(PDO::FETCH_ASSOC);
				// $return["impuestos"][$value['ID_PROYECTO_INTERNACIONAL']] = $result_01->fetchAll(PDO::FETCH_ASSOC);
				if ($result_01) {
					$arrayImpuestos[$value['ID_PROYECTO_INTERNACIONAL']] = $result_01;
				}

				// Se busca los impuestos generados en el proyecto
				$sql = '
					SELECT cif.*,
						IF((	SELECT cm1.id
								FROM cmx_monedas cm1
								WHERE cm1.id = cif.id_moneda),
							(	SELECT CONCAT(cm1.nom_moneda," (",cm1.codigo,")")
								FROM cmx_monedas cm1
								WHERE cm1.id = cif.id_moneda),
							NULL
						) MONEDA,
						cic.nombre, cic.descripcion,
						cico.id ID_COTIZACION, cico.proveedor, cico.descripcion, cico.valor_facturado,
						IF( cif.id_moneda = 2,
							cif.valor,
							IF(	(	SELECT cmt1.valor
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = cif.id_moneda
										AND cmt1.fecha = "' . $hoy . '"),
								(	SELECT (cmt1.valor + 25)
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = cif.id_moneda
										AND cmt1.fecha = "' . $hoy . '"
								) * cif.valor,
								NULL
							)
						) VALOR_PESOS_FACTURA,
						IF ( cif.id_moneda = 1,
							cif.valor,
							IF ( cif.id_moneda = 2,
								IF(	(	SELECT cmt1.valor + 25
										FROM cmx_monedas_trm cmt1
										WHERE cmt1.id_moneda = 1
											AND cmt1.fecha = "' . $hoy . '"),
									cif.valor / (
										SELECT cmt1.valor + 25
										FROM cmx_monedas_trm cmt1
										WHERE cmt1.id_moneda = 1
											AND cmt1.fecha = "' . $hoy . '"),
									NULL
								),
								IF(	(	SELECT cmt1.valor
										FROM cmx_monedas_trm cmt1
										WHERE cmt1.id_moneda = cif.id_moneda
											AND cmt1.fecha = "' . $hoy . '"),
									(	(	SELECT cmt1.valor + 25
											FROM cmx_monedas_trm cmt1
											WHERE cmt1.id_moneda = cif.id_moneda
												AND cmt1.fecha = "' . $hoy . '"
										) * cif.valor
									) / (	SELECT cmt1.valor + 25
											FROM cmx_monedas_trm cmt1
											WHERE cmt1.id_moneda = 1
												AND cmt1.fecha = "' . $hoy . '"),
									NULL
								)
							)
						) VALOR_USD_FACTURA
					FROM cmx_intr_facturas cif
						INNER JOIN cmx_intr_cotizaciones cico ON cico.id_factura = cif.id
						INNER JOIN cmx_intr_conceptos cic ON cic.id = cico.id_concepto
					WHERE cico.id_intr_proyecto = ' . $value['ID_PROYECTO_INTERNACIONAL'] . '
						AND cico.id_concepto != 11
						AND cico.sobrecosto = 1
						AND cico.estado = 1
				';
				// $result_01 = $this->_db->getConsulta($sql);
				$result_01 = $this->_db3->prepare($sql);
				$result_01->execute();
				$result_01 = $result_01->fetchAll(PDO::FETCH_ASSOC);
				if ($result_01) {
					$arraySobrecostos[$value['ID_PROYECTO_INTERNACIONAL']] = $result_01;
				}
			}
			$return["tramos"] = $arrayTramos;
			$return["documentos_envio"] = $arrayDocumentosEnvio;
			$return["impuestos"] = $arrayImpuestos;
			$return["sobrecostos"] = $arraySobrecostos;
			$return["conceptos"] = $arrayConceptos;

			// Se toma la información para los totales de la factura
			// $factura = $result["rowsData"][0];
			$factura = $return["proyectos"][0];
			$arrayFactura = array();
			$arrayFactura["num_proforma"] = $factura["num_proforma"];
			$arrayFactura["subtotal"] = $factura["subtotal"];
			$arrayFactura["iva"] = $factura["iva"];
			$arrayFactura["retefuente"] = $factura["retefuente"];
			$arrayFactura["total"] = $factura["total"];
			$arrayFactura["num_factura"] = $factura["num_factura"];
			$arrayFactura["fecha"] = $factura["FECHA_FACTURA"];
			$arrayFactura["fecha_vencimiento"] = $factura["fecha_vencimiento"];
			if (isset($arrayTrm)) {
				$arrayFactura["trm"] = $arrayTrm;
			}
			$return["factura"] = $arrayFactura;
		}
		return $return;
	}

	public function getHtmlSelectYearCartera($name, $year)
	{
		if ($name) {
			$query = '
				SELECT DATE_FORMAT(cipc.fecha_pago, "%Y") YEAR
				FROM cmx_intr_pago_cartera cipc
				WHERE cipc.fecha_pago IS NOT NULL
				UNION 
				SELECT DATE_FORMAT(cifc.fecha_vencimiento, "%Y") YEAR
				FROM cmx_intr_factura_cliente cifc
				WHERE cifc.fecha_vencimiento IS NOT NULL
			;';
			// $array = $this->_db->getConsulta($query);
			$array = $this->_db3->prepare($query);
			$array->execute();
			$array = $array->fetchAll(PDO::FETCH_ASSOC);

			// Se recorre contenido de la consulta
			if ($array) {
				$select = '<select class="form-control input-sm" name="' . $name . '" id="slct_year" aria-hidden="true">';
				$select .= '<option value="" selected disabled>Seleccione</option>';

				foreach ($array as $key => $value) {
					if ($value['YEAR'] == $year) {
						$select .= '<option value="' . $value['YEAR'] . '" selected="">' . $value['YEAR'] . '</option>';
					} else {
						$select .= '<option value="' . $value['YEAR'] . '">' . $value['YEAR'] . '</option>';
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

	public function getDatosInternacionalCarteraPagada($year)
	{
		// $return = false;
		$sql = '
			SELECT cc.id,cc.cod_cliente, cc.sigla, cc.regimen, CONCAT(cc.documento,"-",cc.digito_verificacion) DOCUMENTO,
				DATE_FORMAT(cifc.fecha, "%Y") YEAR, SUM(cifc.total) TOTAL_FACTURADO
			FROM cmx_intr_factura_cliente cifc
				INNER JOIN cmx_clientes cc ON  cc.id = cifc.id_cliente
			WHERE cifc.cartera = "Pagado" AND cifc.fecha IS NOT NULL
				AND DATE_FORMAT(cifc.fecha, "%Y") = "' . $year . '"
			GROUP BY cc.id';
		// $result = $this->_db->getConsulta($sql);
		// $return["general"] = $result["rowsData"];
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetchAll(PDO::FETCH_ASSOC);
		$return["general"] = $result;

		if ($return["general"]) {
			foreach ($return["general"] as $key => $value) {
				$sql = '
					SELECT SUM(cipc.valor_pagado) TOTAL_PAGADO
					FROM cmx_intr_pago_cartera cipc
					WHERE cipc.id = (
							SELECT DISTINCT(cifc1.id_pago) ID
							FROM cmx_intr_factura_cliente cifc1
							WHERE cifc1.id_pago = cipc.id
								AND cifc1.id_cliente = ' . $value['id'] . '
						)
						AND DATE_FORMAT(cipc.fecha_pago, "%Y") = ' . $year . '
				';
				// $result = $this->_db->getConsulta($sql);
				$result = $this->_db3->prepare($sql);
				$result->execute();
				$result = $result->fetchAll(PDO::FETCH_ASSOC);
				if ($result) {
					// $return["pagado"][$value['id']] = $result["rowsData"][0][0];
					$return["pagado"][$value['id']] = $result[0][0];
				}
			}
		}
		return $return;
	}

	public function getDatosInternacionalCarteraPagadaCliente($id_cliente, $year)
	{
		$sql = '
			SELECT cipc.*,
				(SELECT DISTINCT(cifc1.id_cliente)
					FROM cmx_intr_factura_cliente cifc1 
					WHERE cifc1.id_pago = cipc.id
				) ID_CLIENTE,
				(SELECT COUNT(cifc1.id_cliente)
					FROM cmx_intr_factura_cliente cifc1 
					WHERE cifc1.id_pago = cipc.id
				) CANT_FACTURAS,
				(SELECT SUM(cifc1.total)
					FROM cmx_intr_factura_cliente cifc1 
					WHERE cifc1.id_pago = cipc.id
				) TOTAL_FACTURADO,
				(SELECT DISTINCT(cc1.sigla)
					FROM cmx_intr_factura_cliente cifc1 
						INNER JOIN cmx_clientes cc1 ON cc1.id = cifc1.id_cliente 
					WHERE cifc1.id_pago = cipc.id
				) CLIENTE
			FROM cmx_intr_pago_cartera cipc
			WHERE DATE_FORMAT(cipc.fecha_pago, "%Y") = "' . $year . '"
			HAVING ID_CLIENTE = ' . $id_cliente . '
		';
		// $result = $this->_db->getConsulta($sql);
		// $return["general"] = $result["rowsData"];
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetchAll(PDO::FETCH_ASSOC);
		$return["general"] = $result;

		if ($return["general"]) {
			foreach ($return["general"] as $key => $value) {
				$sql = '
					SELECT cifc.id,
						(	SELECT COUNT(cis1.id_factura)
							FROM cmx_intr_solicitudes cis1
							WHERE cis1.id_factura = cifc.id
						) CANT_DO,
						cifc.num_proforma, cifc.num_factura, cifc.fecha, cifc.fecha_vencimiento, cifc.total, cifc.url
					FROM cmx_intr_factura_cliente cifc
					WHERE cifc.id_pago = "' . $value['id'] . '"
					ORDER BY cifc.fecha_vencimiento
				';
				// $result = $this->_db->getConsulta($sql);
				// $return["facturas"][$value[0]] = $result["rowsData"];
				$result = $this->_db3->prepare($sql);
				$result->execute();
				$result = $result->fetchAll(PDO::FETCH_ASSOC);
				$return["facturas"][$value['id']] = $result;

				if ($return["facturas"][$value['id']]) {
					foreach ($return["facturas"][$value['id']] as $key_01 => $value_01) {
						$sql = '
							SELECT 
								cis.do, cioc.valor, cm.codigo,
								IF(	cioc.id_moneda = 2,
									cioc.valor,
									IF((	SELECT cmt1.valor
											FROM cmx_monedas_trm cmt1
											WHERE cmt1.id_moneda = cioc.id_moneda
												AND cmt1.fecha = cioc.fecha
										),
										(	SELECT cmt1.valor
											FROM cmx_monedas_trm cmt1
											WHERE cmt1.id_moneda = cioc.id_moneda
												AND cmt1.fecha = cioc.fecha
										) * cioc.valor,
										NULL
									)
								) VALOR_OFERTA_PESOS,
								cioc.id_intr_proyecto, cioc.url
							FROM cmx_intr_factura_cliente cifc
								INNER JOIN cmx_intr_solicitudes cis ON cis.id_factura = cifc.id
								INNER JOIN cmx_intr_oferta_comercial cioc ON cioc.id_intr_proyecto = cis.id
								INNER JOIN cmx_monedas cm ON cm.id = cioc.id_moneda
							WHERE cifc.id = ' . $value_01['id'] . '
								AND cioc.estado = 1
						';
						// $result = $this->_db->getConsulta($sql);
						// $return["do"][$value[0]][$value_01[0]] = $result["rowsData"];
						$result = $this->_db3->prepare($sql);
						$result->execute();
						$result = $result->fetchAll(PDO::FETCH_ASSOC);
						$return["do"][$value['id']][$value_01['id']] = $result;
					}
				}
			}
		}
		return $return;
	}
	/********* FIN - FUNCIONES DEL MÓDULO DE CARTERA INTERNACIONAL *********/

	// Función para tomar tramos y materiales de un proyecto 
	// public function getTramosMaterialProyecto($id_intr_proyecto)
	// {
	// 	$sql = 'SELECT cit.*,
	// 			cm.municipio,
	// 			CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") CIUDAD,
	// 			crd.*
	// 		FROM cmx_importacion_proyecto cip
	// 			INNER JOIN cmx_intr_solicitudes cis ON cis.id_proyecto = cip.id
	// 			INNER JOIN cmx_intr_tramos cit ON cit.id_intr_proyecto = cis.id
	// 			INNER JOIN cmx_remitente_destinatario crd ON crd.id = cit.id_remitente_destinatario
	// 			INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
	// 		WHERE cis.id = ' . $id_intr_proyecto . '
	// 			AND cip.estado = 1
	// 			AND cis.estado != 0
	// 			AND cit.estado = 1
	// 		ORDER BY cit.tipo_tramo
	// 	';
	// 	// $return["tramos"] = $this->_db->getConsulta($sql);
	// 	$return = $this->_db3->prepare($sql);
	// 	$return->execute();
	// 	$return["tramos"] = $return->fetchAll(PDO::FETCH_ASSOC);

	// 	if ($return["tramos"]) {
	// 		foreach ($return["tramos"] as $key => $value) {
	// 			$sql = 'SELECT citm.*, cue.nom_unidad_empaque
	// 				FROM cmx_intr_tramos cit 
	// 					INNER JOIN cmx_intr_tramo_materiales citm ON citm.id_tramo = cit.id
	// 					INNER JOIN cmx_unidad_empaque cue ON cue.id = citm.id_empaque
	// 				WHERE cit.id = ' . $value['id'] . ' AND cit.estado = 1 ORDER BY cit.tipo_tramo
	// 			';
	// 			// $return["material"][$value[0]][] = $this->_db->getConsulta($sql);
	// 			$return["material"][$value[0]][] = $this->_db->getConsulta($sql);
	// 		}
	// 	}
	// 	return $return;
	// }

	public function getTramosMaterialProyecto($id_intr_proyecto)
	{
		$return = [];

		// Consulta principal para obtener los tramos
		$sql = 'SELECT cit.*,
                cm.municipio,
                CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS CIUDAD,
                crd.*
            FROM cmx_importacion_proyecto cip
                INNER JOIN cmx_intr_solicitudes cis ON cis.id_proyecto = cip.id
                INNER JOIN cmx_intr_tramos cit ON cit.id_intr_proyecto = cis.id
                INNER JOIN cmx_remitente_destinatario crd ON crd.id = cit.id_remitente_destinatario
                INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
            WHERE cis.id = :id_intr_proyecto
              AND cip.estado = 1
              AND cis.estado != 0
              AND cit.estado = 1
            ORDER BY cit.tipo_tramo';

		$stmt = $this->_db3->prepare($sql);
		$stmt->execute(['id_intr_proyecto' => $id_intr_proyecto]);
		$return["tramos"] = $stmt->fetchAll(PDO::FETCH_ASSOC);

		// Verificar si se obtuvieron tramos
		if (!empty($return["tramos"])) {
			foreach ($return["tramos"] as $key => $value) {
				// Consulta para obtener materiales asociados al tramo
				$sql = 'SELECT citm.*, cue.nom_unidad_empaque FROM cmx_intr_tramos cit 
                        INNER JOIN cmx_intr_tramo_materiales citm ON citm.id_tramo = cit.id
                        INNER JOIN cmx_unidad_empaque cue ON cue.id = citm.id_empaque
                    WHERE cit.id = :id_tramo AND cit.estado = 1 ORDER BY cit.tipo_tramo';
				$stmt = $this->_db3->prepare($sql);
				$stmt->execute(['id_tramo' => $value['id']]);
				$return["material"][$value['id']] = $stmt->fetchAll(PDO::FETCH_ASSOC);
			}
		}

		return $return;
	}


	// Función para tomar la información de los materiales con sus pesos
	// public function getMaterialProyecto($id_intr_proyecto)
	// {
	// 	$sql = '
	// 		SELECT citm.*, 
	// 			IF(	citm.id_riesgo IS NOT NULL,
	// 			(	SELECT crm1.numero_riesgo
	// 				FROM cmx_riesgo_material crm1	
	// 				WHERE crm1.id = citm.id_riesgo),
	// 			NULL ) RIESGO,
	// 			IF(	citm.id_riesgo IS NOT NULL,
	// 				(	SELECT crm1.nom_riesgo_material
	// 					FROM cmx_riesgo_material crm1	
	// 					WHERE crm1.id = citm.id_riesgo),
	// 				NULL 
	// 			) NOM_RIESGO,
	// 			IF(	citm.id_riesgo IS NOT NULL,
	// 				(	SELECT crm1.url
	// 					FROM cmx_riesgo_material crm1	
	// 					WHERE crm1.id = citm.id_riesgo),
	// 				NULL 
	// 			) URL_RIESGO,
	// 			cit.guia, cis.tipo_transporte,
	// 			(citm.largo * citm.alto * citm.ancho) VOLUMEN,
	// 			(	CASE
	// 				WHEN cis.tipo_transporte = "AÉREO" THEN (citm.largo * citm.alto * citm.ancho) / 5000
	// 				WHEN cis.tipo_transporte = "MARÍTIMO" THEN (citm.largo * citm.alto * citm.ancho) / 1000000
	// 				ELSE CONCAT(citm.largo, " x ", citm.alto, " x ",citm.ancho)
	// 				END
	// 			) PESO_VOLUMETRICO,
	// 			crd.nombre, crd.sigla, crd.direccion,
	// 			cm.municipio, cm.depto, cm.pais
	// 		FROM cmx_importacion_proyecto cip
	// 			INNER JOIN cmx_intr_solicitudes cis ON cis.id_proyecto = cip.id
	// 			INNER JOIN cmx_intr_tramos cit ON cit.id_intr_proyecto = cis.id
	// 			INNER JOIN cmx_intr_tramo_materiales citm ON citm.id_tramo = cit.id
	// 			INNER JOIN cmx_remitente_destinatario crd ON crd.id = cit.id_remitente_destinatario
	// 			INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
	// 		WHERE cis.id = ' . $id_intr_proyecto . '
	// 	';
	// 	$result = $this->_db->getConsulta($sql);

	// 	$return = NULL;
	// 	if ($result) {
	// 		foreach ($result["rowsData"] as $key => $value) {
	// 			$return[$value["id_tramo"]][] = $value;
	// 		}
	// 	}
	// 	return $return;
	// }


	public function getMaterialProyecto($id_intr_proyecto)
	{
		$sql = '
        SELECT citm.*, 
            IF(citm.id_riesgo IS NOT NULL,
                (SELECT crm1.numero_riesgo
                 FROM cmx_riesgo_material crm1
                 WHERE crm1.id = citm.id_riesgo),
                NULL) AS RIESGO,
            IF(citm.id_riesgo IS NOT NULL,
                (SELECT crm1.nom_riesgo_material
                 FROM cmx_riesgo_material crm1
                 WHERE crm1.id = citm.id_riesgo),
                NULL) AS NOM_RIESGO,
            IF(citm.id_riesgo IS NOT NULL,
                (SELECT crm1.url
                 FROM cmx_riesgo_material crm1
                 WHERE crm1.id = citm.id_riesgo),
                NULL) AS URL_RIESGO,
            cit.guia, 
            cis.tipo_transporte,
            (citm.largo * citm.alto * citm.ancho) AS VOLUMEN,
            (CASE
                WHEN cis.tipo_transporte = "AÉREO" THEN (citm.largo * citm.alto * citm.ancho) / 5000
                WHEN cis.tipo_transporte = "MARÍTIMO" THEN (citm.largo * citm.alto * citm.ancho) / 1000000
                ELSE CONCAT(citm.largo, " x ", citm.alto, " x ", citm.ancho)
            END) AS PESO_VOLUMETRICO,
            crd.nombre, crd.sigla, crd.direccion,
            cm.municipio, cm.depto, cm.pais
        FROM cmx_importacion_proyecto cip
            INNER JOIN cmx_intr_solicitudes cis ON cis.id_proyecto = cip.id
            INNER JOIN cmx_intr_tramos cit ON cit.id_intr_proyecto = cis.id
            INNER JOIN cmx_intr_tramo_materiales citm ON citm.id_tramo = cit.id
            INNER JOIN cmx_remitente_destinatario crd ON crd.id = cit.id_remitente_destinatario
            INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
        WHERE cis.id = :id_intr_proyecto
    ';

		// Preparar y ejecutar la consulta
		$stmt = $this->_db3->prepare($sql);
		$stmt->execute(['id_intr_proyecto' => $id_intr_proyecto]);
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

		// Organizar los datos por id_tramo
		$return = [];
		if (!empty($result)) {
			foreach ($result as $row) {
				$return[$row["id_tramo"]][] = $row;
			}
		}

		return $return;
	}

	// Función para tomar la información de los conceptos de un proyecto 
	public function getConceptosProyecto($id_intr_proyecto)
	{
		// Información de los proyectos pendientes de facturación del cliente
		$sql = '
			SELECT 
				cico.id, cico.id_intr_proyecto, cic.nombre, cico.fecha_cotizacion, cico.valor, CONCAT(cm.nom_moneda," (",cm.codigo,")"), 
				cico.estado, cico.fct_muestra_concepto
			FROM cmx_intr_cotizaciones cico
				INNER JOIN cmx_intr_conceptos cic ON cic.id = cico.id_concepto
				INNER JOIN cmx_monedas cm ON cm.id = cico.id_moneda
			WHERE cico.id_concepto != 11
				AND cico.id_intr_proyecto = ' . $id_intr_proyecto . '
		';
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetchAll(PDO::FETCH_ASSOC);

		$arrayConceptos = array();
		if ($result) {
			foreach ($result as $key => $value) {
				$arrayConceptos[$value["estado"]][] = $value;
			}
		}
		return $arrayConceptos;
	}

	// Función para calcular el valor total de una cotización
	// public function getCalculaCotizacion($id_intr_proyecto)
	// {
	// 	$sql = '
	// 		SELECT 
	// 			cm.id, CONCAT(cm.nom_moneda, " (",cm.codigo,")") MONEDA, 
	// 			cico.valor,
	// 			IF( cico.id_moneda = 2,
	// 				cico.valor,
	// 				IF((	SELECT cmt1.valor
	// 						FROM cmx_monedas_trm cmt1
	// 						WHERE cmt1.id_moneda = cico.id_moneda
	// 							AND cmt1.fecha = cico.fecha_cotizacion),
	// 					(	SELECT cmt1.valor
	// 						FROM cmx_monedas_trm cmt1
	// 						WHERE cmt1.id_moneda = cico.id_moneda
	// 							AND cmt1.fecha = cico.fecha_cotizacion
	// 					) * cico.valor,
	// 					NULL
	// 				)
	// 			) VALOR_PESOS,
	// 			IF ( cico.id_moneda = 1,
	// 				cico.valor,
	// 				IF ( cico.id_moneda = 2,
	// 					IF ((	SELECT cmt1.valor
	// 							FROM cmx_monedas_trm cmt1
	// 							WHERE cmt1.id_moneda = 1
	// 								AND cmt1.fecha = cico.fecha_cotizacion),
	// 						cico.valor / (
	// 							SELECT cmt1.valor
	// 							FROM cmx_monedas_trm cmt1
	// 							WHERE cmt1.id_moneda = 1
	// 								AND cmt1.fecha = cico.fecha_cotizacion),
	// 						NULL
	// 					),
	// 					IF((	SELECT cmt1.valor
	// 							FROM cmx_monedas_trm cmt1
	// 							WHERE cmt1.id_moneda = cico.id_moneda
	// 								AND cmt1.fecha = cico.fecha_cotizacion),
	// 						((	SELECT cmt1.valor
	// 							FROM cmx_monedas_trm cmt1
	// 							WHERE cmt1.id_moneda = cico.id_moneda
	// 								AND cmt1.fecha = cico.fecha_cotizacion
	// 						) * cico.valor
	// 						) / (	SELECT cmt1.valor
	// 								FROM cmx_monedas_trm cmt1
	// 								WHERE cmt1.id_moneda = 1
	// 									AND cmt1.fecha = cico.fecha_cotizacion),
	// 						NULL
	// 					)
	// 				)
	// 			) VALOR_USD
	// 		FROM cmx_intr_cotizaciones cico
	// 			INNER JOIN cmx_monedas cm ON cm.id = cico.id_moneda
	// 		WHERE cico.id_intr_proyecto = ' . $id_intr_proyecto . '
	// 			AND cico.estado = 1
	// 	';

	// 	//echo 'SQLTRM'.$sql;

	// 	$result = $this->_db->getConsulta($sql);
	// 	$return["lista_valor_cotizaciones"] = $result;

	// 	$return["total_cotizaciones"] = NULL;
	// 	if ($result) {
	// 		$arrayTotales = array();
	// 		foreach ($result["rowsData"] as $key => $value) {
	// 			if (!isset($arrayTotales[$value[0]])) {
	// 				$arrayTotales[$value[0]]["cuantos"] = 1;
	// 				$arrayTotales[$value[0]]["moneda"] = $value["MONEDA"];
	// 				$arrayTotales[$value[0]]["valor_cotizacion"] = (float)$value["valor"];

	// 				if (!$value["VALOR_PESOS"]) {
	// 					$arrayTotales[$value[0]]["valor_pesos"] = NULL;
	// 					$arrayTotales[$value[0]]["valor_usd"] = NULL;
	// 				} else {
	// 					$arrayTotales[$value[0]]["valor_pesos"] = (float)$value["VALOR_PESOS"];
	// 					$arrayTotales[$value[0]]["valor_usd"] = (float)$value["VALOR_USD"];
	// 				}
	// 			} else {
	// 				$arrayTotales[$value[0]]["cuantos"]++;
	// 				$arrayTotales[$value[0]]["valor_cotizacion"] = (float)$arrayTotales[$value[0]]["valor_cotizacion"] + (float)$value["valor"];

	// 				// Se valida los valores en pesos
	// 				if ($value["VALOR_PESOS"] and $arrayTotales[$value[0]]["valor_pesos"]) {
	// 					$arrayTotales[$value[0]]["valor_pesos"] = (float)$arrayTotales[$value[0]]["valor_pesos"] + (float)$value["VALOR_PESOS"];
	// 				} else {
	// 					$arrayTotales[$value[0]]["valor_pesos"] = NULL;
	// 				}

	// 				// Se valida los valores en USD
	// 				if ($value["VALOR_PESOS"] and $arrayTotales[$value[0]]["valor_usd"]) {
	// 					$arrayTotales[$value[0]]["valor_usd"] = (float)$arrayTotales[$value[0]]["valor_usd"] + (float)$value["VALOR_USD"];
	// 				} else {
	// 					$arrayTotales[$value[0]]["valor_usd"] = NULL;
	// 				}
	// 			}
	// 		}
	// 		$return["total_cotizaciones"] = $arrayTotales;
	// 	}
	// 	return $return;
	// }

	public function getCalculaCotizacion($id_intr_proyecto)
	{
		$sql = '
        SELECT 
            cm.id, CONCAT(cm.nom_moneda, " (",cm.codigo,")") AS MONEDA, 
            cico.valor,
            IF( cico.id_moneda = 2,
                cico.valor,
                IF((	SELECT cmt1.valor
                        FROM cmx_monedas_trm cmt1
                        WHERE cmt1.id_moneda = cico.id_moneda
                            AND cmt1.fecha = cico.fecha_cotizacion),
                    (	SELECT cmt1.valor
                        FROM cmx_monedas_trm cmt1
                        WHERE cmt1.id_moneda = cico.id_moneda
                            AND cmt1.fecha = cico.fecha_cotizacion
                    ) * cico.valor,
                    NULL
                )
            ) AS VALOR_PESOS,
            IF ( cico.id_moneda = 1,
                cico.valor,
                IF ( cico.id_moneda = 2,
                    IF ((	SELECT cmt1.valor
                            FROM cmx_monedas_trm cmt1
                            WHERE cmt1.id_moneda = 1
                                AND cmt1.fecha = cico.fecha_cotizacion),
                        cico.valor / (
                            SELECT cmt1.valor
                            FROM cmx_monedas_trm cmt1
                            WHERE cmt1.id_moneda = 1
                                AND cmt1.fecha = cico.fecha_cotizacion),
                        NULL
                    ),
                    IF((	SELECT cmt1.valor
                            FROM cmx_monedas_trm cmt1
                            WHERE cmt1.id_moneda = cico.id_moneda
                                AND cmt1.fecha = cico.fecha_cotizacion),
                        ((
                            SELECT cmt1.valor
                            FROM cmx_monedas_trm cmt1
                            WHERE cmt1.id_moneda = cico.id_moneda
                                AND cmt1.fecha = cico.fecha_cotizacion
                        ) * cico.valor
                        ) / (	SELECT cmt1.valor
                                FROM cmx_monedas_trm cmt1
                                WHERE cmt1.id_moneda = 1
                                    AND cmt1.fecha = cico.fecha_cotizacion),
                        NULL
                    )
                )
            ) AS VALOR_USD
        FROM cmx_intr_cotizaciones cico
        INNER JOIN cmx_monedas cm ON cm.id = cico.id_moneda
        WHERE cico.id_intr_proyecto = :id_intr_proyecto
            AND cico.estado = 1
    ';

		try {
			$stmt = $this->_db3->prepare($sql);
			$stmt->bindParam(':id_intr_proyecto', $id_intr_proyecto, PDO::PARAM_INT);
			$stmt->execute();

			$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
			$return["lista_valor_cotizaciones"] = $result;

			$return["total_cotizaciones"] = null;
			if ($result) {
				$arrayTotales = [];
				foreach ($result as $value) {
					$id = $value["id"];
					if (!isset($arrayTotales[$id])) {
						$arrayTotales[$id] = [
							"cuantos" => 1,
							"moneda" => $value["MONEDA"],
							"valor_cotizacion" => (float)$value["valor"],
							"valor_pesos" => $value["VALOR_PESOS"] ? (float)$value["VALOR_PESOS"] : null,
							"valor_usd" => $value["VALOR_USD"] ? (float)$value["VALOR_USD"] : null,
						];
					} else {
						$arrayTotales[$id]["cuantos"]++;
						$arrayTotales[$id]["valor_cotizacion"] += (float)$value["valor"];
						$arrayTotales[$id]["valor_pesos"] = ($value["VALOR_PESOS"] && $arrayTotales[$id]["valor_pesos"]) ?
							$arrayTotales[$id]["valor_pesos"] + (float)$value["VALOR_PESOS"] : null;
						$arrayTotales[$id]["valor_usd"] = ($value["VALOR_PESOS"] && $arrayTotales[$id]["valor_usd"]) ?
							$arrayTotales[$id]["valor_usd"] + (float)$value["VALOR_USD"] : null;
					}
				}
				$return["total_cotizaciones"] = $arrayTotales;
			}
			return $return;
		} catch (PDOException $e) {
			throw new Exception("Error al calcular cotización: " . $e->getMessage());
		}
	}

	// Función para listar los documentos de envío de materiales en un proyecto internacional 
	public function getTipoDocumentosEnvio()
	{
		$sql = 'SELECT * FROM cmx_intr_tipo_documento citd WHERE citd.estado = 1 ORDER BY citd.nombre';
		$return = $this->_db3->prepare($sql);
		$return->execute();
		$result = $return->fetchAll(PDO::FETCH_ASSOC);
		return $result;
		// $return = $this->_db->getConsulta($sql);
		// return $return;
	}

	// Función para buscar los documentos de envío de materiales en un proyecto internacional 
	public function getDocumentosEnvio($id)
	{
		$sql = 'SELECT cisd.id, cisd.id_intr_proyecto, cis.do, cisd.id_tipo_documento, cisd.soporte_facturacion, citd.nombre, citd.descripcion, 
				MAX(cisd.fecha) FECHA, cisd.fecha_gestion, cisd.url, cisd.estado
			FROM cmx_intr_solicitudes cis
				INNER JOIN cmx_intr_solicitud_documentos cisd ON cisd.id_intr_proyecto = cis.id
				INNER JOIN cmx_intr_tipo_documento citd ON citd.id = cisd.id_tipo_documento
			WHERE cisd.id_intr_proyecto = ' . $id . '
			GROUP BY cisd.id_tipo_documento
		';
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetchAll(PDO::FETCH_ASSOC);
		$return = NULL;
		if ($result) {
			foreach ($result as $key => $value) {
				$return[$value["id_tipo_documento"]] = $value;
			}
		}
		return $return;
	}
}
