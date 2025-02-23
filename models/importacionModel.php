<?php
class importacionModel extends Model
{

	public function __construct()
	{
		parent::__construct();
	}

	public function getTabla()
	{
		// $request = $this->_db->getConsulta("SELECT * FROM cmx_importacion_proyecto");
		$request = $this->_db3->prepare("SELECT * FROM cmx_importacion_proyecto");
		$request->execute();
		$request = $request->fetchAll(PDO::FETCH_ASSOC);
		return $request;
	}

	public function consultar_clientes()
	{
		// $request = $this->_db->getConsulta("SELECT id,documento,nombre FROM cmx_clientes WHERE estado=1");
		$request = $this->_db3->prepare("SELECT id,documento,nombre FROM cmx_clientes WHERE estado=1");
		$request->execute();
		$result = $request->fetchAll(PDO::FETCH_ASSOC);
		return $result;
	}

	public function getProyectosImportacionActivos($usuario, $tipo, $cliente, $fi)
	{

		if ($tipo == '1') { //cliente
			$cl = $cliente;
			$mas = 'cip.id_cliente=' . $cl . '';
		}

		if ($tipo == '2') { //fechas
			$d = $fi;
			$mas = ' cip.numero_importacion=' . $d;
		}

		if ($usuario["id_perfil"] == 1 or $usuario["id_perfil"] == 13 or $usuario["id_perfil"] == 21 or $usuario["id_perfil"] == 29 or $usuario["id_perfil"] == 22 or $usuario["id_perfil"] == 32) {
			// echo "HOLA MUNDO DESDE AQUI";
			// exit();
			// $sql = 'SELECT cip.*,
			// 			IF (cip.id_contrato IS NOT NULL,
			// 				IF((SELECT ccc1.estado FROM cmx_contrato_cliente ccc1 WHERE ccc1.id = cip.id_contrato) = 1, TRUE,FALSE), TRUE) FLAG_CONTRATO,
			// 			IF(cip.id_contrato IS NOT NULL,
			// 			(SELECT ccc1.cod_contrato FROM cmx_contrato_cliente ccc1 WHERE ccc1.id = cip.id_contrato), NULL) NUM_CONTRATO,ctc.id ID_CARGA, ctc.nombre TIPO_CARGA,cc.id ID_CLIENTE, cc.nombre CLIENTE,
			// 			(	SELECT ctc.nombre FROM cmx_tipo_contenedor ctc WHERE ctc.id = cip.tipo_contenedor) NOM_CONTENEDOR,
			// 			(	SELECT ctc.tara FROM cmx_tipo_contenedor ctc WHERE ctc.id = cip.tipo_contenedor) TARA_CONTENEDOR,
			// 			IF((SELECT COUNT(cis1.id) CUANTOS 
			// 					FROM cmx_intr_solicitudes cis1
			// 					WHERE cis1.id_proyecto = cip.id
			// 				) > 0,
			// 				(	SELECT cis1.id
			// 					FROM cmx_intr_solicitudes cis1
			// 					WHERE cis1.id_proyecto = cip.id
			// 				), NULL
			// 			) ID_PROYECTO_INTERNACIONAL,
			// 			IF((	SELECT COUNT(cis1.id) CUANTOS 
			// 					FROM cmx_intr_solicitudes cis1
			// 					WHERE cis1.id_proyecto = cip.id
			// 				) > 0,
			// 				(	SELECT cis1.do
			// 					FROM cmx_intr_solicitudes cis1
			// 					WHERE cis1.id_proyecto = cip.id
			// 				), NULL
			// 			) DO_PROYECTO,
			// 			IF((	SELECT COUNT(cis1.id) CUANTOS 
			// 					FROM cmx_intr_solicitudes cis1
			// 					WHERE cis1.id_proyecto = cip.id
			// 				) > 0,
			// 				(	SELECT COUNT(citm1.id) CUANTOS
			// 					FROM cmx_intr_solicitudes cis1
			// 						INNER JOIN cmx_intr_tramos cit1 ON cit1.id_intr_proyecto = cis1.id
			// 						INNER JOIN cmx_intr_tramo_materiales citm1 ON citm1.id_tramo = cit1.id
			// 					WHERE cis1.id_proyecto = cip.id),
			// 				( 	SELECT COUNT(DISTINCT(cia.id_material))
			// 					FROM cmx_importacion_actividades cia
			// 					WHERE cia.id_material IS NOT NULL
			// 						AND cia.id_importacion = cip.id)
			// 			) MATERIALES_PROYECTO,
			// 			(	SELECT COUNT(cioc1.id) CUANTOS
			// 				FROM cmx_intr_solicitudes cis1
			// 					INNER JOIN cmx_intr_oferta_comercial cioc1 ON cioc1.id_intr_proyecto = cis1.id
			// 				WHERE cis1.id_proyecto = cip.id
			// 					AND cioc1.estado = 1
			// 			) INTR_COTIZACION_PRESENTADA,
			// 			IF((	SELECT cis1.id
			// 					FROM cmx_intr_solicitudes cis1
			// 					WHERE cis1.id_proyecto = cip.id
			// 				),
			// 				(	SELECT CONCAT("(",cii1.sigla,") ",cii1.nombre) INCOTERM 
			// 					FROM cmx_intr_solicitudes cis1
			// 						INNER JOIN cmx_intr_incoterms cii1 ON cii1.sigla = cis1.incoterm
			// 					WHERE cis1.id_proyecto = cip.id
			// 				), NULL
			// 			) INCOTERM,
			// 			IF((	SELECT cis1.id
			// 					FROM cmx_intr_solicitudes cis1
			// 					WHERE cis1.id_proyecto = cip.id
			// 				),
			// 				(	SELECT cis1.tipo_transporte TIPO_TRANSPORTE 
			// 					FROM cmx_intr_solicitudes cis1
			// 					WHERE cis1.id_proyecto = cip.id
			// 				), NULL
			// 			) TIPO_TRANSPORTE,
			// 			IF((	SELECT cis1.id
			// 					FROM cmx_intr_solicitudes cis1
			// 					WHERE cis1.id_proyecto = cip.id),
			// 				IF((	SELECT cis1.estado 
			// 						FROM cmx_intr_solicitudes cis1
			// 						WHERE cis1.id_proyecto = cip.id) = 0,
			// 					(	SELECT cia1.respuesta 
			// 						FROM cmx_importacion_actividades cia1
			// 						WHERE cia1.id_importacion = cip.id
			// 							AND cia1.tipo_actividad = "intr_cotizacion"
			// 					), NULL
			// 				), NULL
			// 			) INTR_ESTADO_PROYECTO,
			// 			IF((	SELECT COUNT(cia1.id)
			// 					FROM cmx_importacion_actividades cia1
			// 					WHERE cia1.id_importacion = cip.id
			// 						AND cia1.id_material IS NOT NULL
			// 				) > 0,
			// 				(	SELECT COUNT(cia1.id)
			// 					FROM cmx_importacion_actividades cia1
			// 					WHERE cia1.id_importacion = cip.id
			// 						AND cia1.id_material IS NOT NULL),
			// 				(	SELECT COUNT(cia1.id)
			// 					FROM cmx_importacion_actividades cia1
			// 					WHERE cia1.id_importacion = cip.id)
			// 			) ACTIVIDADES,
			// 			IF((	SELECT COUNT(cia1.id)
			// 					FROM cmx_importacion_actividades cia1
			// 					WHERE cia1.id_importacion = cip.id
			// 						AND cia1.id_material IS NOT NULL
			// 				) > 0,
			// 				(	SELECT COUNT(cia1.id)
			// 					FROM cmx_importacion_actividades cia1
			// 					WHERE cia1.id_importacion = cip.id
			// 						AND cia1.id_material IS NOT NULL
			// 						AND cia1.estado = 2),
			// 				(	SELECT COUNT(cia1.id)
			// 					FROM cmx_importacion_actividades cia1
			// 					WHERE cia1.id_importacion = cip.id
			// 						AND cia1.estado = 2)
			// 			) ACTIVIDADES_ACTIVAS,
			// 			IF((	SELECT COUNT(cia1.id)
			// 					FROM cmx_importacion_actividades cia1
			// 					WHERE cia1.id_importacion = cip.id
			// 						AND cia1.id_material IS NOT NULL
			// 				) > 0,
			// 				(	SELECT COUNT(cia1.id)
			// 					FROM cmx_importacion_actividades cia1
			// 					WHERE cia1.id_importacion = cip.id
			// 						AND cia1.id_material IS NOT NULL
			// 						AND cia1.estado = 1),
			// 				(	SELECT COUNT(cia1.id)
			// 					FROM cmx_importacion_actividades cia1
			// 					WHERE cia1.id_importacion = cip.id
			// 						AND cia1.estado = 1)
			// 			) ACTIVIDADES_TERMINADAS
			// 		FROM 
			// 			cmx_importacion_proyecto cip
			// 			INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
			// 			INNER JOIN cmx_tipo_carga ctc ON ctc.id = cip.id_tipo_carga
			// 		WHERE 
			// 			cip.estado = 1 
			// 		HAVING 
			// 			INTR_ESTADO_PROYECTO IS NULL
			// 			AND ACTIVIDADES != ACTIVIDADES_TERMINADAS
			// 			AND' . $mas . '
			// 		ORDER BY cip.numero_importacion DESC';
			$sql = '
			SELECT cip.*,
				IF (cip.id_contrato IS NOT NULL,
					IF((	SELECT ccc1.estado
							FROM cmx_contrato_cliente ccc1
							WHERE ccc1.id = cip.id_contrato
						) = 1,
						TRUE,FALSE
					), TRUE
				) FLAG_CONTRATO,
				IF(cip.id_contrato IS NOT NULL,
					(	SELECT ccc1.cod_contrato
						FROM cmx_contrato_cliente ccc1
						WHERE ccc1.id = cip.id_contrato
					), NULL
				) NUM_CONTRATO,
				ctc.id ID_CARGA, ctc.nombre TIPO_CARGA,
				cc.id ID_CLIENTE, cc.nombre CLIENTE,
				(	SELECT ctc.nombre
					FROM cmx_tipo_contenedor ctc
					WHERE ctc.id = cip.tipo_contenedor
				) NOM_CONTENEDOR,
				(	SELECT ctc.tara
					FROM cmx_tipo_contenedor ctc
					WHERE ctc.id = cip.tipo_contenedor
				) TARA_CONTENEDOR,
				IF((	SELECT COUNT(cis1.id) CUANTOS 
						FROM cmx_intr_solicitudes cis1
						WHERE cis1.id_proyecto = cip.id
					) > 0,
					(	SELECT cis1.id
						FROM cmx_intr_solicitudes cis1
						WHERE cis1.id_proyecto = cip.id
					), NULL
				) ID_PROYECTO_INTERNACIONAL,
				IF((	SELECT COUNT(cis1.id) CUANTOS 
						FROM cmx_intr_solicitudes cis1
						WHERE cis1.id_proyecto = cip.id
					) > 0,
					(	SELECT cis1.do
						FROM cmx_intr_solicitudes cis1
						WHERE cis1.id_proyecto = cip.id
					), NULL
				) DO_PROYECTO,
				IF((	SELECT COUNT(cis1.id) CUANTOS 
						FROM cmx_intr_solicitudes cis1
						WHERE cis1.id_proyecto = cip.id
					) > 0,
					(	SELECT COUNT(citm1.id) CUANTOS
						FROM cmx_intr_solicitudes cis1
							INNER JOIN cmx_intr_tramos cit1 ON cit1.id_intr_proyecto = cis1.id
							INNER JOIN cmx_intr_tramo_materiales citm1 ON citm1.id_tramo = cit1.id
						WHERE cis1.id_proyecto = cip.id),
					( 	SELECT COUNT(DISTINCT(cia.id_material))
						FROM cmx_importacion_actividades cia
						WHERE cia.id_material IS NOT NULL
							AND cia.id_importacion = cip.id)
				) MATERIALES_PROYECTO,
				(	SELECT COUNT(cioc1.id) CUANTOS
					FROM cmx_intr_solicitudes cis1
						INNER JOIN cmx_intr_oferta_comercial cioc1 ON cioc1.id_intr_proyecto = cis1.id
					WHERE cis1.id_proyecto = cip.id
						AND cioc1.estado = 1
				) INTR_COTIZACION_PRESENTADA,
				IF((	SELECT cis1.id
						FROM cmx_intr_solicitudes cis1
						WHERE cis1.id_proyecto = cip.id
					),
					(	SELECT CONCAT("(",cii1.sigla,") ",cii1.nombre) INCOTERM 
						FROM cmx_intr_solicitudes cis1
							INNER JOIN cmx_intr_incoterms cii1 ON cii1.sigla = cis1.incoterm
						WHERE cis1.id_proyecto = cip.id
					), NULL
				) INCOTERM,
				IF((	SELECT cis1.id
						FROM cmx_intr_solicitudes cis1
						WHERE cis1.id_proyecto = cip.id
					),
					(	SELECT cis1.tipo_transporte TIPO_TRANSPORTE 
						FROM cmx_intr_solicitudes cis1
						WHERE cis1.id_proyecto = cip.id
					), NULL
				) TIPO_TRANSPORTE,
				IF((	SELECT cis1.id
						FROM cmx_intr_solicitudes cis1
						WHERE cis1.id_proyecto = cip.id),
					IF((	SELECT cis1.estado 
							FROM cmx_intr_solicitudes cis1
							WHERE cis1.id_proyecto = cip.id) = 0,
						(	SELECT cia1.respuesta 
							FROM cmx_importacion_actividades cia1
							WHERE cia1.id_importacion = cip.id
								AND cia1.tipo_actividad = "intr_cotizacion"
						), NULL
					), NULL
				) INTR_ESTADO_PROYECTO,
				IF((	SELECT COUNT(cia1.id)
						FROM cmx_importacion_actividades cia1
						WHERE cia1.id_importacion = cip.id
							AND cia1.id_material IS NOT NULL
					) > 0,
					(	SELECT COUNT(cia1.id)
						FROM cmx_importacion_actividades cia1
						WHERE cia1.id_importacion = cip.id
							AND cia1.id_material IS NOT NULL),
					(	SELECT COUNT(cia1.id)
						FROM cmx_importacion_actividades cia1
						WHERE cia1.id_importacion = cip.id)
				) ACTIVIDADES,
				IF((	SELECT COUNT(cia1.id)
						FROM cmx_importacion_actividades cia1
						WHERE cia1.id_importacion = cip.id
							AND cia1.id_material IS NOT NULL
					) > 0,
					(	SELECT COUNT(cia1.id)
						FROM cmx_importacion_actividades cia1
						WHERE cia1.id_importacion = cip.id
							AND cia1.id_material IS NOT NULL
							AND cia1.estado = 2),
					(	SELECT COUNT(cia1.id)
						FROM cmx_importacion_actividades cia1
						WHERE cia1.id_importacion = cip.id
							AND cia1.estado = 2)
				) ACTIVIDADES_ACTIVAS,
				IF((	SELECT COUNT(cia1.id)
						FROM cmx_importacion_actividades cia1
						WHERE cia1.id_importacion = cip.id
							AND cia1.id_material IS NOT NULL
					) > 0,
					(	SELECT COUNT(cia1.id)
						FROM cmx_importacion_actividades cia1
						WHERE cia1.id_importacion = cip.id
							AND cia1.id_material IS NOT NULL
							AND cia1.estado = 1),
					(	SELECT COUNT(cia1.id)
						FROM cmx_importacion_actividades cia1
						WHERE cia1.id_importacion = cip.id
							AND cia1.estado = 1)
				) ACTIVIDADES_TERMINADAS
			FROM 
				cmx_importacion_proyecto cip
				INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
				INNER JOIN cmx_tipo_carga ctc ON ctc.id = cip.id_tipo_carga
			WHERE 
				cip.estado = 1 
			HAVING 
				INTR_ESTADO_PROYECTO IS NULL
				AND ACTIVIDADES != ACTIVIDADES_TERMINADAS
				AND    ' . $mas . '
			ORDER BY cip.numero_importacion DESC';
		} else {
			// echo "ENTRO AL ELSE DEL IF";
			// exit();
			// $sql = 'SELECT cip.*,
			// 			IF(	cip.id_contrato IS NOT NULL,
			// 				IF((	SELECT ccc1.estado
			// 						FROM cmx_contrato_cliente ccc1
			// 						WHERE ccc1.id = cip.id_contrato
			// 					) = 1,
			// 					TRUE,FALSE
			// 				), TRUE
			// 			) FLAG_CONTRATO,
			// 			IF(	cip.id_contrato IS NOT NULL,
			// 				(	SELECT ccc1.cod_contrato
			// 					FROM cmx_contrato_cliente ccc1
			// 					WHERE ccc1.id = cip.id_contrato
			// 				), NULL
			// 			) NUM_CONTRATO,
			// 			ctc.id ID_CARGA, ctc.nombre TIPO_CARGA,
			// 			cc.id ID_CLIENTE, cc.nombre CLIENTE,
			// 			(	SELECT ctc.nombre
			// 				FROM cmx_tipo_contenedor ctc
			// 				WHERE ctc.id = cip.tipo_contenedor
			// 			) NOM_CONTENEDOR,
			// 			(	SELECT ctc.tara
			// 				FROM cmx_tipo_contenedor ctc
			// 				WHERE ctc.id = cip.tipo_contenedor
			// 			) TARA_CONTENEDOR,
			// 			IF((	SELECT COUNT(cis1.id) CUANTOS 
			// 					FROM cmx_intr_solicitudes cis1
			// 					WHERE cis1.id_proyecto = cip.id
			// 				) > 0,
			// 				(	SELECT cis1.id
			// 					FROM cmx_intr_solicitudes cis1
			// 					WHERE cis1.id_proyecto = cip.id
			// 				), NULL
			// 			) ID_PROYECTO_INTERNACIONAL,
			// 			IF((	SELECT COUNT(cis1.id) CUANTOS 
			// 					FROM cmx_intr_solicitudes cis1
			// 					WHERE cis1.id_proyecto = cip.id
			// 				) > 0,
			// 				(	SELECT cis1.do
			// 					FROM cmx_intr_solicitudes cis1
			// 					WHERE cis1.id_proyecto = cip.id
			// 				),NULL
			// 			) DO_PROYECTO,
			// 			IF((	SELECT COUNT(cis1.id) CUANTOS 
			// 					FROM cmx_intr_solicitudes cis1
			// 					WHERE cis1.id_proyecto = cip.id
			// 				) > 0,
			// 				(	SELECT COUNT(citm1.id) CUANTOS
			// 					FROM cmx_intr_solicitudes cis1
			// 						INNER JOIN cmx_intr_tramos cit1 ON cit1.id_intr_proyecto = cis1.id
			// 						INNER JOIN cmx_intr_tramo_materiales citm1 ON citm1.id_tramo = cit1.id
			// 					WHERE cis1.id_proyecto = cip.id
			// 				),
			// 				( 	SELECT COUNT(DISTINCT(cia.id_material))
			// 					FROM cmx_importacion_actividades cia
			// 					WHERE cia.id_material IS NOT NULL
			// 						AND cia.id_importacion = cip.id
			// 				)
			// 			) MATERIALES_PROYECTO,
			// 			(	SELECT COUNT(cioc1.id) CUANTOS
			// 				FROM cmx_intr_solicitudes cis1
			// 					INNER JOIN cmx_intr_oferta_comercial cioc1 ON cioc1.id_intr_proyecto = cis1.id
			// 				WHERE cis1.id_proyecto = cip.id
			// 					AND cioc1.estado = 1
			// 			) INTR_COTIZACION_PRESENTADA,
			// 			IF ((	SELECT cis1.id
			// 					FROM cmx_intr_solicitudes cis1
			// 					WHERE cis1.id_proyecto = cip.id
			// 				),
			// 				(	SELECT CONCAT("(",cii1.sigla,") ",cii1.nombre) INCOTERM 
			// 					FROM cmx_intr_solicitudes cis1
			// 						INNER JOIN cmx_intr_incoterms cii1 ON cii1.sigla = cis1.incoterm
			// 					WHERE cis1.id_proyecto = cip.id
			// 				), NULL
			// 			) INCOTERM,
			// 			IF ((	SELECT cis1.id
			// 					FROM cmx_intr_solicitudes cis1
			// 					WHERE cis1.id_proyecto = cip.id
			// 				),
			// 				(	SELECT cis1.tipo_transporte TIPO_TRANSPORTE 
			// 					FROM cmx_intr_solicitudes cis1
			// 					WHERE cis1.id_proyecto = cip.id
			// 				),
			// 				NULL
			// 			) TIPO_TRANSPORTE,
			// 			IF((	SELECT cis1.id
			// 					FROM cmx_intr_solicitudes cis1
			// 					WHERE cis1.id_proyecto = cip.id
			// 				),
			// 				IF((	SELECT cis1.estado 
			// 						FROM cmx_intr_solicitudes cis1
			// 						WHERE cis1.id_proyecto = cip.id
			// 					) = 0,
			// 					(	SELECT cia1.respuesta 
			// 						FROM cmx_importacion_actividades cia1
			// 						WHERE cia1.id_importacion = cip.id
			// 							AND cia1.tipo_actividad = "intr_cotizacion"
			// 					), NULL
			// 				), NULL
			// 			) INTR_ESTADO_PROYECTO,
			// 			IF((	SELECT COUNT(cia1.id)
			// 					FROM cmx_importacion_actividades cia1
			// 					WHERE cia1.id_importacion = cip.id
			// 						AND cia1.id_material IS NOT NULL
			// 				) > 0,
			// 				(	SELECT COUNT(cia1.id)
			// 					FROM cmx_importacion_actividades cia1
			// 					WHERE cia1.id_importacion = cip.id
			// 						AND cia1.id_material IS NOT NULL
			// 				),
			// 				(	SELECT COUNT(cia1.id)
			// 					FROM cmx_importacion_actividades cia1
			// 					WHERE cia1.id_importacion = cip.id
			// 				)
			// 			) ACTIVIDADES,
			// 			IF((	SELECT COUNT(cia1.id)
			// 					FROM cmx_importacion_actividades cia1
			// 					WHERE cia1.id_importacion = cip.id
			// 						AND cia1.id_material IS NOT NULL
			// 				) > 0,
			// 				(	SELECT COUNT(cia1.id)
			// 					FROM cmx_importacion_actividades cia1
			// 					WHERE cia1.id_importacion = cip.id
			// 						AND cia1.id_material IS NOT NULL
			// 						AND cia1.estado = 2
			// 				),
			// 				(	SELECT COUNT(cia1.id)
			// 					FROM cmx_importacion_actividades cia1
			// 					WHERE cia1.id_importacion = cip.id
			// 						AND cia1.estado = 2
			// 				)
			// 			) ACTIVIDADES_ACTIVAS,
			// 			IF((	SELECT COUNT(cia1.id)
			// 					FROM cmx_importacion_actividades cia1
			// 					WHERE cia1.id_importacion = cip.id
			// 						AND cia1.id_material IS NOT NULL
			// 				) > 0,
			// 				(	SELECT COUNT(cia1.id)
			// 					FROM cmx_importacion_actividades cia1
			// 					WHERE cia1.id_importacion = cip.id
			// 						AND cia1.id_material IS NOT NULL
			// 						AND cia1.estado = 1
			// 				),
			// 				(	SELECT COUNT(cia1.id)
			// 					FROM cmx_importacion_actividades cia1
			// 					WHERE cia1.id_importacion = cip.id
			// 						AND cia1.estado = 1
			// 				)
			// 			) ACTIVIDADES_TERMINADAS
			// 		FROM 
			// 			cmx_importacion_proyecto cip
			// 			INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
			// 			INNER JOIN cmx_tipo_carga ctc ON ctc.id = cip.id_tipo_carga
			// 		WHERE 
			// 			cip.estado = 1
			// 		HAVING (SELECT
			// 					COUNT(cia1.perfil_responsable)
			// 				FROM cmx_importacion_actividades cia1
			// 					INNER JOIN cmx_usuario_cliente cus1 ON cus1.id_perfil = cia1.perfil_responsable
			// 					INNER JOIN cmx_clientes_serv_responsables ccdr1 ON ccdr1.id_usuario = cus1.id_usuario
			// 					INNER JOIN cmx_clientes_serv_contratados ccsc1 ON ccsc1.id = ccdr1.id_serv_contratado
			// 				WHERE cia1.id_importacion = cip.id
			// 					AND ccsc1.id_cliente = cip.id_cliente
			// 					AND ccsc1.servicio IN ("Transporte de Carga Internacional","Transporte de Carga Nacional")
			// 					AND ccdr1.estado = 1
			// 					AND ccsc1.estado = 1
			// 					AND cus1.id_perfil = ' . $usuario["id_perfil"] . '
			// 					AND ccdr1.id_usuario = ' . $usuario["id_usuario"] . '
			// 			) > 0
			// 			AND INTR_ESTADO_PROYECTO IS NULL
			// 			AND ACTIVIDADES != ACTIVIDADES_TERMINADAS
			// 			AND   ' . $mas . '
			// 		ORDER BY cip.numero_importacion DESC
			// 	';
			$sql = '
					SELECT 
						cip.*,
						IF(	cip.id_contrato IS NOT NULL,
							IF((	SELECT ccc1.estado
									FROM cmx_contrato_cliente ccc1
									WHERE ccc1.id = cip.id_contrato
								) = 1,
								TRUE,FALSE
							), TRUE
						) FLAG_CONTRATO,
						IF(	cip.id_contrato IS NOT NULL,
							(	SELECT ccc1.cod_contrato
								FROM cmx_contrato_cliente ccc1
								WHERE ccc1.id = cip.id_contrato
							), NULL
						) NUM_CONTRATO,
						ctc.id ID_CARGA, ctc.nombre TIPO_CARGA,
						cc.id ID_CLIENTE, cc.nombre CLIENTE,
						(	SELECT ctc.nombre
							FROM cmx_tipo_contenedor ctc
							WHERE ctc.id = cip.tipo_contenedor
						) NOM_CONTENEDOR,
						(	SELECT ctc.tara
							FROM cmx_tipo_contenedor ctc
							WHERE ctc.id = cip.tipo_contenedor
						) TARA_CONTENEDOR,
						IF((	SELECT COUNT(cis1.id) CUANTOS 
								FROM cmx_intr_solicitudes cis1
								WHERE cis1.id_proyecto = cip.id
							) > 0,
							(	SELECT cis1.id
								FROM cmx_intr_solicitudes cis1
								WHERE cis1.id_proyecto = cip.id
							), NULL
						) ID_PROYECTO_INTERNACIONAL,
						IF((	SELECT COUNT(cis1.id) CUANTOS 
								FROM cmx_intr_solicitudes cis1
								WHERE cis1.id_proyecto = cip.id
							) > 0,
							(	SELECT cis1.do
								FROM cmx_intr_solicitudes cis1
								WHERE cis1.id_proyecto = cip.id
							),NULL
						) DO_PROYECTO,
						IF((	SELECT COUNT(cis1.id) CUANTOS 
								FROM cmx_intr_solicitudes cis1
								WHERE cis1.id_proyecto = cip.id
							) > 0,
							(	SELECT COUNT(citm1.id) CUANTOS
								FROM cmx_intr_solicitudes cis1
									INNER JOIN cmx_intr_tramos cit1 ON cit1.id_intr_proyecto = cis1.id
									INNER JOIN cmx_intr_tramo_materiales citm1 ON citm1.id_tramo = cit1.id
								WHERE cis1.id_proyecto = cip.id
							),
							( 	SELECT COUNT(DISTINCT(cia.id_material))
								FROM cmx_importacion_actividades cia
								WHERE cia.id_material IS NOT NULL
									AND cia.id_importacion = cip.id
							)
						) MATERIALES_PROYECTO,
						(	SELECT COUNT(cioc1.id) CUANTOS
							FROM cmx_intr_solicitudes cis1
								INNER JOIN cmx_intr_oferta_comercial cioc1 ON cioc1.id_intr_proyecto = cis1.id
							WHERE cis1.id_proyecto = cip.id
								AND cioc1.estado = 1
						) INTR_COTIZACION_PRESENTADA,
						IF ((	SELECT cis1.id
								FROM cmx_intr_solicitudes cis1
								WHERE cis1.id_proyecto = cip.id
							),
							(	SELECT CONCAT("(",cii1.sigla,") ",cii1.nombre) INCOTERM 
								FROM cmx_intr_solicitudes cis1
									INNER JOIN cmx_intr_incoterms cii1 ON cii1.sigla = cis1.incoterm
								WHERE cis1.id_proyecto = cip.id
							), NULL
						) INCOTERM,
						IF ((	SELECT cis1.id
								FROM cmx_intr_solicitudes cis1
								WHERE cis1.id_proyecto = cip.id
							),
							(	SELECT cis1.tipo_transporte TIPO_TRANSPORTE 
								FROM cmx_intr_solicitudes cis1
								WHERE cis1.id_proyecto = cip.id
							),
							NULL
						) TIPO_TRANSPORTE,
						IF((	SELECT cis1.id
								FROM cmx_intr_solicitudes cis1
								WHERE cis1.id_proyecto = cip.id
							),
							IF((	SELECT cis1.estado 
									FROM cmx_intr_solicitudes cis1
									WHERE cis1.id_proyecto = cip.id
								) = 0,
								(	SELECT cia1.respuesta 
									FROM cmx_importacion_actividades cia1
									WHERE cia1.id_importacion = cip.id
										AND cia1.tipo_actividad = "intr_cotizacion"
								), NULL
							), NULL
						) INTR_ESTADO_PROYECTO,
						IF((	SELECT COUNT(cia1.id)
								FROM cmx_importacion_actividades cia1
								WHERE cia1.id_importacion = cip.id
									AND cia1.id_material IS NOT NULL
							) > 0,
							(	SELECT COUNT(cia1.id)
								FROM cmx_importacion_actividades cia1
								WHERE cia1.id_importacion = cip.id
									AND cia1.id_material IS NOT NULL
							),
							(	SELECT COUNT(cia1.id)
								FROM cmx_importacion_actividades cia1
								WHERE cia1.id_importacion = cip.id
							)
						) ACTIVIDADES,
						IF((	SELECT COUNT(cia1.id)
								FROM cmx_importacion_actividades cia1
								WHERE cia1.id_importacion = cip.id
									AND cia1.id_material IS NOT NULL
							) > 0,
							(	SELECT COUNT(cia1.id)
								FROM cmx_importacion_actividades cia1
								WHERE cia1.id_importacion = cip.id
									AND cia1.id_material IS NOT NULL
									AND cia1.estado = 2
							),
							(	SELECT COUNT(cia1.id)
								FROM cmx_importacion_actividades cia1
								WHERE cia1.id_importacion = cip.id
									AND cia1.estado = 2
							)
						) ACTIVIDADES_ACTIVAS,
						IF((	SELECT COUNT(cia1.id)
								FROM cmx_importacion_actividades cia1
								WHERE cia1.id_importacion = cip.id
									AND cia1.id_material IS NOT NULL
							) > 0,
							(	SELECT COUNT(cia1.id)
								FROM cmx_importacion_actividades cia1
								WHERE cia1.id_importacion = cip.id
									AND cia1.id_material IS NOT NULL
									AND cia1.estado = 1
							),
							(	SELECT COUNT(cia1.id)
								FROM cmx_importacion_actividades cia1
								WHERE cia1.id_importacion = cip.id
									AND cia1.estado = 1
							)
						) ACTIVIDADES_TERMINADAS
					FROM 
						cmx_importacion_proyecto cip
						INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
						INNER JOIN cmx_tipo_carga ctc ON ctc.id = cip.id_tipo_carga
					WHERE 
						cip.estado = 1
					HAVING (SELECT
								COUNT(cia1.perfil_responsable)
							FROM cmx_importacion_actividades cia1
								INNER JOIN cmx_usuario_cliente cus1 ON cus1.id_perfil = cia1.perfil_responsable
								INNER JOIN cmx_clientes_serv_responsables ccdr1 ON ccdr1.id_usuario = cus1.id_usuario
								INNER JOIN cmx_clientes_serv_contratados ccsc1 ON ccsc1.id = ccdr1.id_serv_contratado
							WHERE cia1.id_importacion = cip.id
								AND ccsc1.id_cliente = cip.id_cliente
								AND ccsc1.servicio IN ("Transporte de Carga Internacional","Transporte de Carga Nacional")
								AND ccdr1.estado = 1
								AND ccsc1.estado = 1
								AND cus1.id_perfil = ' . $usuario["id_perfil"] . '
								AND ccdr1.id_usuario = ' . $usuario["id_usuario"] . '
						) > 0
						AND INTR_ESTADO_PROYECTO IS NULL
						AND ACTIVIDADES != ACTIVIDADES_TERMINADAS
						AND   ' . $mas . '
					ORDER BY cip.numero_importacion DESC
				';
		}
		// $return["proyectos"] = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$return["proyectos"] = $result->fetchAll(PDO::FETCH_ASSOC);
		if ($return["proyectos"]) {
			$array = array();
			$array_01 = array();
			foreach ($return["proyectos"] as $key => $value) {
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
								IF((	SELECT COUNT(cioc1.id)
										FROM cmx_intr_oferta_comercial cioc1
										WHERE cioc1.id_intr_proyecto = cis.id
											AND cioc1.estado = 1),
									(
										SELECT cioc1.valor 
										FROM cmx_intr_oferta_comercial cioc1
											INNER JOIN cmx_monedas cm1 ON cm1.id = cioc1.id_moneda
										WHERE cioc1.id_intr_proyecto = cis.id
											AND cioc1.estado = 1
									), NULL
								) VALOR_OFERTA,
								IF((	SELECT COUNT(cioc1.id)
										FROM cmx_intr_oferta_comercial cioc1
										WHERE cioc1.id_intr_proyecto = cis.id
											AND cioc1.estado = 1),
									(
										SELECT CONCAT("(",cm1.codigo,")") VALOR
										FROM cmx_intr_oferta_comercial cioc1
											INNER JOIN cmx_monedas cm1 ON cm1.id = cioc1.id_moneda
										WHERE cioc1.id_intr_proyecto = cis.id
											AND cioc1.estado = 1
									), NULL
								) MONEDA_OFERTA,
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
							WHERE cis.id = ' . $value["ID_PROYECTO_INTERNACIONAL"] . '';
					// $result = $this->_db->getConsulta($sql);
					// $array[$value[0]] = $result["rowsData"][0];
					$result = $this->_db3->prepare($sql);
					$result->execute();
					$array_01 = $result->fetch(PDO::FETCH_ASSOC);
					$array[$value["ID_PROYECTO_INTERNACIONAL"]] = $array_01;
				}
			}
			$return["info_internacional"] = $array;
		}
		return $return;
	}

	public function getProyectosImportacion($usuario)
	{
		if ($usuario["id_perfil"] == 1 or $usuario["id_perfil"] == 13 or $usuario["id_perfil"] == 21 or $usuario["id_perfil"] == 32) {
			$sql = '
					SELECT cip.*,
						IF(	cip.id_contrato IS NOT NULL,
							IF((	SELECT ccc1.estado
									FROM cmx_contrato_cliente ccc1
									WHERE ccc1.id = cip.id_contrato
								) = 1,
								TRUE,FALSE
							), TRUE
						) FLAG_CONTRATO,
						IF(	cip.id_contrato IS NOT NULL,
							(	SELECT ccc1.cod_contrato
								FROM cmx_contrato_cliente ccc1
								WHERE ccc1.id = cip.id_contrato
							), NULL
						) NUM_CONTRATO,
						ctc.id ID_CARGA, ctc.nombre TIPO_CARGA,
						cc.id ID_CLIENTE, cc.nombre CLIENTE,
						(	SELECT ctc.nombre
							FROM cmx_tipo_contenedor ctc
							WHERE ctc.id = cip.tipo_contenedor
						) NOM_CONTENEDOR,
						(	SELECT ctc.tara
							FROM cmx_tipo_contenedor ctc
							WHERE ctc.id = cip.tipo_contenedor
						) TARA_CONTENEDOR,
						IF((	SELECT COUNT(cis1.id) CUANTOS 
								FROM cmx_intr_solicitudes cis1
								WHERE cis1.id_proyecto = cip.id
							) > 0,
							(	SELECT cis1.id
								FROM cmx_intr_solicitudes cis1
								WHERE cis1.id_proyecto = cip.id
							), NULL
						) ID_PROYECTO_INTERNACIONAL,
						IF((	SELECT COUNT(cis1.id) CUANTOS 
								FROM cmx_intr_solicitudes cis1
								WHERE cis1.id_proyecto = cip.id
							) > 0,
							(	SELECT cis1.do
								FROM cmx_intr_solicitudes cis1
								WHERE cis1.id_proyecto = cip.id
							),
							NULL
						) DO_PROYECTO,
						IF((	SELECT COUNT(cis1.id) CUANTOS 
								FROM cmx_intr_solicitudes cis1
								WHERE cis1.id_proyecto = cip.id
							) > 0,
							(	SELECT COUNT(citm1.id) CUANTOS
								FROM cmx_intr_solicitudes cis1
									INNER JOIN cmx_intr_tramos cit1 ON cit1.id_intr_proyecto = cis1.id
									INNER JOIN cmx_intr_tramo_materiales citm1 ON citm1.id_tramo = cit1.id
								WHERE cis1.id_proyecto = cip.id
							),
							( 	SELECT COUNT(DISTINCT(cia.id_material))
								FROM cmx_importacion_actividades cia
								WHERE cia.id_material IS NOT NULL
									AND cia.id_importacion = cip.id
							)
						) MATERIALES_PROYECTO,
						(	SELECT COUNT(cioc1.id) CUANTOS
							FROM cmx_intr_solicitudes cis1
								INNER JOIN cmx_intr_oferta_comercial cioc1 ON cioc1.id_intr_proyecto = cis1.id
							WHERE cis1.id_proyecto = cip.id
								AND cioc1.estado = 1
						) INTR_COTIZACION_PRESENTADA,
						IF((	SELECT cis1.id
								FROM cmx_intr_solicitudes cis1
								WHERE cis1.id_proyecto = cip.id
							),
							(	SELECT CONCAT("(",cii1.sigla,") ",cii1.nombre) INCOTERM 
								FROM cmx_intr_solicitudes cis1
									INNER JOIN cmx_intr_incoterms cii1 ON cii1.sigla = cis1.incoterm
								WHERE cis1.id_proyecto = cip.id
							),
							NULL
						) INCOTERM,
						IF((	SELECT cis1.id
								FROM cmx_intr_solicitudes cis1
								WHERE cis1.id_proyecto = cip.id
							),
							(	SELECT cis1.tipo_transporte TIPO_TRANSPORTE 
								FROM cmx_intr_solicitudes cis1
								WHERE cis1.id_proyecto = cip.id
							),
							NULL
						) TIPO_TRANSPORTE,
						IF((	SELECT cis1.id
								FROM cmx_intr_solicitudes cis1
								WHERE cis1.id_proyecto = cip.id
							),
							IF((	SELECT cis1.estado 
									FROM cmx_intr_solicitudes cis1
									WHERE cis1.id_proyecto = cip.id
								) = 0,
								(	SELECT cia1.respuesta 
									FROM cmx_importacion_actividades cia1
									WHERE cia1.id_importacion = cip.id
										AND cia1.tipo_actividad = "intr_cotizacion"
								),
								NULL
							),NULL
						) INTR_ESTADO_PROYECTO,
						(	SELECT COUNT(cia1.id)
							FROM cmx_importacion_actividades cia1
							WHERE cia1.id_importacion = cip.id
						) CONT_ACTIVIDADES
					FROM cmx_importacion_proyecto cip
						INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
						INNER JOIN cmx_tipo_carga ctc ON ctc.id = cip.id_tipo_carga
					WHERE cip.estado != 4
					HAVING CONT_ACTIVIDADES > 0
					ORDER BY cip.numero_importacion DESC
				';
		} else {
			$sql = '
					SELECT cip.*,
						IF(	cip.id_contrato IS NOT NULL,
							IF((	SELECT ccc1.estado
									FROM cmx_contrato_cliente ccc1
									WHERE ccc1.id = cip.id_contrato
								) = 1,
								TRUE, FALSE
							), TRUE
						) FLAG_CONTRATO,
						IF(	cip.id_contrato IS NOT NULL,
							(	SELECT ccc1.cod_contrato
								FROM cmx_contrato_cliente ccc1
								WHERE ccc1.id = cip.id_contrato
							), NULL
						) NUM_CONTRATO,
						ctc.id ID_CARGA, ctc.nombre TIPO_CARGA,
						cc.id ID_CLIENTE, cc.nombre CLIENTE,
						(	SELECT ctc.nombre
							FROM cmx_tipo_contenedor ctc
							WHERE ctc.id = cip.tipo_contenedor
						) NOM_CONTENEDOR,
						(	SELECT ctc.tara
							FROM cmx_tipo_contenedor ctc
							WHERE ctc.id = cip.tipo_contenedor
						) TARA_CONTENEDOR,
						IF((	SELECT COUNT(cis1.id) CUANTOS 
								FROM cmx_intr_solicitudes cis1
								WHERE cis1.id_proyecto = cip.id
							) > 0,
							(	SELECT cis1.id
								FROM cmx_intr_solicitudes cis1
								WHERE cis1.id_proyecto = cip.id
							), NULL
						) ID_PROYECTO_INTERNACIONAL,
						IF((	SELECT COUNT(cis1.id) CUANTOS 
								FROM cmx_intr_solicitudes cis1
								WHERE cis1.id_proyecto = cip.id
							) > 0,
							(	SELECT cis1.do
								FROM cmx_intr_solicitudes cis1
								WHERE cis1.id_proyecto = cip.id
							), NULL
						) DO_PROYECTO,
						(	SELECT COUNT(DISTINCT(cia.id_material))
							FROM cmx_importacion_actividades cia
							WHERE cia.id_material IS NOT NULL
								AND cia.id_importacion = cip.id
						) MATERIALES_PROYECTO,
						(	SELECT COUNT(cioc1.id) CUANTOS
							FROM cmx_intr_solicitudes cis1
								INNER JOIN cmx_intr_oferta_comercial cioc1 ON cioc1.id_intr_proyecto = cis1.id
							WHERE cis1.id_proyecto = cip.id
								AND cioc1.estado = 1
						) INTR_COTIZACION_PRESENTADA,
						IF ((	SELECT cis1.id
								FROM cmx_intr_solicitudes cis1
								WHERE cis1.id_proyecto = cip.id
							),
							(	SELECT CONCAT("(",cii1.sigla,") ",cii1.nombre) INCOTERM 
								FROM cmx_intr_solicitudes cis1
									INNER JOIN cmx_intr_incoterms cii1 ON cii1.sigla = cis1.incoterm
								WHERE cis1.id_proyecto = cip.id
							), NULL
						) INCOTERM,
						IF ((	SELECT cis1.id
								FROM cmx_intr_solicitudes cis1
								WHERE cis1.id_proyecto = cip.id
							),
							(	SELECT cis1.tipo_transporte TIPO_TRANSPORTE 
								FROM cmx_intr_solicitudes cis1
								WHERE cis1.id_proyecto = cip.id
							), NULL
						) TIPO_TRANSPORTE,
						IF((	SELECT cis1.id
								FROM cmx_intr_solicitudes cis1
								WHERE cis1.id_proyecto = cip.id
							),
							IF((	SELECT cis1.estado 
									FROM cmx_intr_solicitudes cis1
									WHERE cis1.id_proyecto = cip.id
								) = 0,
								(	SELECT cia1.respuesta 
									FROM cmx_importacion_actividades cia1
									WHERE cia1.id_importacion = cip.id
										AND cia1.tipo_actividad = "intr_cotizacion"
								), NULL
							), NULL
						) INTR_ESTADO_PROYECTO,
						(	SELECT COUNT(cia1.id)
							FROM cmx_importacion_actividades cia1
							WHERE cia1.id_importacion = cip.id
						) CONT_ACTIVIDADES
					FROM cmx_importacion_proyecto cip
						INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
						INNER JOIN cmx_tipo_carga ctc ON ctc.id = cip.id_tipo_carga
					WHERE cip.estado != 4
					HAVING (
						SELECT COUNT(cia1.perfil_responsable)
						FROM cmx_importacion_actividades cia1
							INNER JOIN cmx_usuario_cliente cus1 ON cus1.id_perfil = cia1.perfil_responsable
							INNER JOIN cmx_clientes_serv_responsables ccdr1 ON ccdr1.id_usuario = cus1.id_usuario
							INNER JOIN cmx_clientes_serv_contratados ccsc1 ON ccsc1.id = ccdr1.id_serv_contratado
						WHERE cia1.id_importacion = cip.id
							AND ccsc1.id_cliente = cip.id_cliente
							AND ccsc1.servicio IN ("Transporte de Carga Internacional","Transporte de Carga Nacional")
							AND ccdr1.estado = 1
							AND ccsc1.estado = 1
							AND cus1.id_perfil = ' . $usuario["id_perfil"] . '
							AND ccdr1.id_usuario = ' . $usuario["id_usuario"] . '
					) > 0
					AND CONT_ACTIVIDADES > 0
					ORDER BY cip.numero_importacion DESC
				';
		}

		// $return["proyectos"] = $this->_db->getConsulta($sql);
		$sql_proyectos = $this->_db3->prepare($sql);
		$sql_proyectos->execute();
		$return["proyectos"] = $sql_proyectos->fetchAll(PDO::FETCH_ASSOC);
		// return $return;
		if ($return["proyectos"]) {
			$array = array();
			foreach ($return["proyectos"] as $key => $value) {
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
								IF((	SELECT COUNT(cioc1.id)
										FROM cmx_intr_oferta_comercial cioc1
										WHERE cioc1.id_intr_proyecto = cis.id
											AND cioc1.estado = 1),
									(
										SELECT cioc1.valor 
										FROM cmx_intr_oferta_comercial cioc1
											INNER JOIN cmx_monedas cm1 ON cm1.id = cioc1.id_moneda
										WHERE cioc1.id_intr_proyecto = cis.id
											AND cioc1.estado = 1
									), NULL
								) VALOR_OFERTA,
								IF((	SELECT COUNT(cioc1.id)
										FROM cmx_intr_oferta_comercial cioc1
										WHERE cioc1.id_intr_proyecto = cis.id
											AND cioc1.estado = 1),
									(
										SELECT CONCAT("(",cm1.codigo,")") VALOR
										FROM cmx_intr_oferta_comercial cioc1
											INNER JOIN cmx_monedas cm1 ON cm1.id = cioc1.id_moneda
										WHERE cioc1.id_intr_proyecto = cis.id
											AND cioc1.estado = 1
									), NULL
								) MONEDA_OFERTA,
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
					$result = $result->fetchAll(PDO::FETCH_ASSOC);
					$array[$value["ID_PROYECTO_INTERNACIONAL"]] = $result[0];
					// $array[$value[0]] = $result["rowsData"][0];
				}
			}
			$return["info_internacional"] = $array;
		}
		return $return;
	}

	public function getEstadoActividades($id_proyecto)
	{
		$request["estado"] = "actions";
		$request["terminado"] = false;

		// Se cuenta cuantas actividades tiene el proyecto
		$sql = '
				SELECT 
					cip.id, cip.estado,
					COUNT(cia.id) CUANTOS,
					IF(
						(	SELECT COUNT(cia1.id)
							FROM cmx_importacion_actividades cia1
							WHERE cia1.id_importacion = cip.id
								AND cia1.id_material IS NOT NULL
						) > 0,
						(	SELECT COUNT(cia1.id)
							FROM cmx_importacion_actividades cia1
							WHERE cia1.id_importacion = cip.id
								AND cia1.id_material IS NOT NULL
						),
						(	SELECT COUNT(cia1.id)
							FROM cmx_importacion_actividades cia1
							WHERE cia1.id_importacion = cip.id
						)
					) ACTIVIDADES,
					IF(
						(	SELECT COUNT(cia1.id)
							FROM cmx_importacion_actividades cia1
							WHERE cia1.id_importacion = cip.id
								AND cia1.id_material IS NOT NULL
						) > 0,
						(	SELECT COUNT(cia1.id)
							FROM cmx_importacion_actividades cia1
							WHERE cia1.id_importacion = cip.id
								AND cia1.id_material IS NOT NULL
								AND cia1.estado = 2
						),
						(	SELECT COUNT(cia1.id)
							FROM cmx_importacion_actividades cia1
							WHERE cia1.id_importacion = cip.id
								AND cia1.estado = 2
						)
					) ACTIVIDADES_ACTIVAS,
					IF(
						(	SELECT COUNT(cia1.id)
							FROM cmx_importacion_actividades cia1
							WHERE cia1.id_importacion = cip.id
								AND cia1.id_material IS NOT NULL
						) > 0,
						(	SELECT COUNT(cia1.id)
							FROM cmx_importacion_actividades cia1
							WHERE cia1.id_importacion = cip.id
								AND cia1.id_material IS NOT NULL
								AND cia1.estado = 1
						),
						(	SELECT COUNT(cia1.id)
							FROM cmx_importacion_actividades cia1
							WHERE cia1.id_importacion = cip.id
								AND cia1.estado = 1
						)
					) ACTIVIDADES_TERMINADAS
				FROM 
					cmx_importacion_proyecto cip
					INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
				WHERE 
					cip.id = ' . $id_proyecto . ';
			';
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetchAll(PDO::FETCH_ASSOC);
		// $actividades = $result->fetchAll(PDO::FETCH_ASSOC);
		$actividades = $result[0];

		// $actividades = $result["rowsData"][0];
		$request["estado"] = "actions";
		if ($actividades["estado"] == 1) { //estado general del proyecto
			if ($actividades["ACTIVIDADES_ACTIVAS"] == 0 and $actividades["ACTIVIDADES_TERMINADAS"] == 0) {
				$request["estado"] = "actions";
			}

			if ($actividades["ACTIVIDADES"] == $actividades["ACTIVIDADES_TERMINADAS"]) {
				$request["terminado"] = true;
				$request["estado"] = "nexos-txt-success";
			}

			if ($actividades["ACTIVIDADES"] != $actividades["ACTIVIDADES_TERMINADAS"] and $actividades["ACTIVIDADES_ACTIVAS"] > 0) {
				$sql = '
						SELECT 
							cia.*
						FROM 
							cmx_importacion_proyecto cip
							INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
						WHERE
							cip.id = ' . $id_proyecto . '
							AND cia.estado = 2
						ORDER BY cia.orden DESC;
					';
				// $request_10 = $this->_db->getConsulta($sql);
				$request_10 = $this->_db3->prepare($sql);
				$request_10->execute();
				$request_10 = $request_10->fetchAll(PDO::FETCH_ASSOC);

				if ($request_10) {
					foreach ($request_10 as $key => $value) {
						// foreach ($request_10["rowsData"] as $key => $value) {
						// Se buscan aplazamientos
						$aplazamientos = $this->getAplazamientos($value["id"]);

						$vencimiento_actividad = $value["fecha_hora_inicio"];
						if ($aplazamientos) {
							$vencimiento_actividad = $aplazamientos["rowsData"][$aplazamientos["rowsNum"] - 1]["fecha_hora_aplazamiento"];
						}

						// Se calcula el tiempo de plazo de la siguiente actividad
						$fecha_plazo = strtotime('+' . $value["tiempo_aprobado"] . ' minute', strtotime($vencimiento_actividad));
						$fecha_plazo = date("Y-m-d H:i:s", $fecha_plazo);

						// se define el color del borde de acuerdo si esta retrasada el desarrollo de la actividad
						if ($request["estado"] != "nexos-txt-danger") {
							if (date("Y-m-d H:i:s", time()) > $fecha_plazo) {
								$request["estado"] = "nexos-txt-danger";
							} else {
								$request["estado"] = "nexos-txt-warning";
							}
						}
					}
				}
			}
		}
		return $request;
	}

	public function getHtmlSelectTipoCarga($name, $id)
	{
		if ($name) {
			$query = '
					SELECT * 
					FROM cmx_tipo_carga ctc
					WHERE ctc.estado = 1
				';
			// echo $query;
			// $array = $this->_db->getConsulta($query);
			$array = $this->_db3->prepare($query);
			$array->execute();
			$array = $array->fetchAll(PDO::FETCH_ASSOC);

			// Se recorre contenido de la consulta
			if ($array) {
				// print_r($array);
				$select = '
						<select class="select2 select2-hidden-accessible" name="' . $name . '" id="slct_tipo_cargas_' . $id . '" aria-hidden="true">
					';
				$select .= '<option value="" selected disabled>Seleccione</option>';

				foreach ($array['rowsData'] as $key => $value) {
					if ($value['id'] == $id) {
						$select .= '<option value="' . $value['id'] . '" selected="">' . $value['nombre'] . '</option>';
					} else {
						$select .= '<option value="' . $value['id'] . '">' . $value['nombre'] . '</option>';
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

	public function getHtmlSelectTipoCarga_sm($name, $id)
	{
		if ($name) {
			$query = $this->_db3->prepare('SELECT * FROM cmx_tipo_carga ctc WHERE ctc.estado = 1');
			$query->execute();
			$array = $query->fetchAll(PDO::FETCH_ASSOC);

			// Se recorre contenido de la consulta
			if ($array) {
				// print_r($array);
				$select = '<select class="form-control input-sm" name="' . $name . '" id="slct_tipo_cargas_' . $id . '" aria-hidden="true">';
				$select .= '<option value="" selected disabled>Seleccione</option>';
				foreach ($array as $key => $value) {
					if ($value['id'] == $id) {
						$select .= '<option value="' . $value['id'] . '" selected="">' . $value['nombre'] . '</option>';
					} else {
						$select .= '<option value="' . $value['id'] . '">' . $value['nombre'] . '</option>';
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

	public function getEnumSlctTipoOperacion($name, $id, $value_select)
	{
		$sql = "
                SHOW COLUMNS FROM 
                    cmx_importacion_proyecto 
                LIKE 'tipo_operacion' 
            ";
		// echo "<p>" . $sql . "</p>";
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetchAll(PDO::FETCH_ASSOC);

		foreach ($result as $key => $value) {
			$value["Type"] = str_replace("enum(", "", $value["Type"]);
			$value["Type"] = str_replace(")", "", $value["Type"]);
			$value["Type"] = str_replace("'", "", $value["Type"]);

			$arrayTipoActividad = explode(",", $value["Type"]);
		}

		$select = '<select class="select2 select2-hidden-accessible" name="' . $name . '" id="slct_tipo_operacion_' . $id . '" aria-hidden="true">';
		$select .= '<option disabled selected>Seleccione</option>';
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

	public function getEnumSlctTipoOperacion_sm($name, $id, $value_select)
	{
		$sql = "
		        SHOW COLUMNS FROM 
		            cmx_importacion_proyecto 
		        LIKE 'tipo_operacion' 
		    ";
		// echo "<p>" . $sql . "</p>";
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetchAll(PDO::FETCH_ASSOC);

		foreach ($result as $key => $value) {
			$value["Type"] = str_replace("enum(", "", $value["Type"]);
			$value["Type"] = str_replace(")", "", $value["Type"]);
			$value["Type"] = str_replace("'", "", $value["Type"]);

			$arrayTipoActividad = explode(",", $value["Type"]);
		}

		$select = '
		        <select class="form-control input-sm" name="' . $name . '" id="slct_tipo_operacion_' . $id . '" aria-hidden="true">
		    ';
		$select .= '<option disabled selected>Seleccione</option>';
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

	public function getEnumSlctTipoTransporte($name, $id, $value_select)
	{
		$sql = "
				SHOW COLUMNS FROM 
					cmx_intr_solicitudes 
				LIKE 'tipo_transporte' 
			";
		// echo "<pre>" . $sql . "</pre>";
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetchAll(PDO::FETCH_ASSOC);

		foreach ($result as $key => $value) {
			$value["Type"] = str_replace("enum(", "", $value["Type"]);
			$value["Type"] = str_replace(")", "", $value["Type"]);
			$value["Type"] = str_replace("'", "", $value["Type"]);

			$arrayTipoActividad = explode(",", $value["Type"]);
		}

		$select = '<select class="form-control input-sm" name="' . $name . '" id="slct_tipo_transporte_' . $id . '" aria-hidden="true">';
		$select .= '<option disabled selected>Seleccione</option>';
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

	public function getEnumSlctTipoTramo($name, $id, $value_select)
	{
		$sql = "SHOW COLUMNS FROM cmx_intr_tramos LIKE 'tipo_tramo'";
		// echo "<pre>" . $sql . "</pre>";
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$array = $result->fetchAll(PDO::FETCH_ASSOC);

		foreach ($array as $key => $value) {
			$value["Type"] = str_replace("enum(", "", $value["Type"]);
			$value["Type"] = str_replace(")", "", $value["Type"]);
			$value["Type"] = str_replace("'", "", $value["Type"]);

			$arrayTipoActividad = explode(",", $value["Type"]);
		}

		$select = '
				<select class="form-control input-sm" name="' . $name . '" id="slct_tipo_tramo_' . $id . '" aria-hidden="true">
			';
		$select .= '<option disabled selected>Seleccione</option>';
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

	public function getHtmlSelectIncoterm($name, $id)
	{
		if ($name) {
			$query = '
					SELECT * 
					FROM cmx_intr_incoterms cii
				';
			// echo $query;
			// $array = $this->_db->getConsulta($query);
			$array = $this->_db3->prepare($query);
			$array->execute();
			$array = $array->fetchAll(PDO::FETCH_ASSOC);

			// Se recorre contenido de la consulta
			if ($array) {
				// print_r($array);
				$select = '<select class="form-control input-sm" name="' . $name . '" id="slct_incoterms_' . $id . '" aria-hidden="true">';
				$select .= '<option value="" selected disabled>Seleccione</option>';

				foreach ($array as $key => $value) {

					if ($value['sigla'] == $id) {
						$select .= '<option value="' . $value['sigla'] . '" selected="">' . $value['sigla'] . ' (' . $value['nombre'] . ')</option>';
					} else {
						$select .= '<option value="' . $value['sigla'] . '">' . $value['sigla'] . ' (' . $value['nombre'] . ')</option>';
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

	public function getCuentaActividadesMatrial($id, $grupo)
	{
		$_filtro_grupo = '';
		$_filtro_grupo_1 = '';
		if ($grupo) {
			$_filtro_grupo = ' AND cia.grupo = ' . $grupo . ' ';
			$_filtro_grupo_1 = ' AND cia1.grupo = ' . $grupo . ' ';
		}

		$sql = '
				SELECT COUNT(cip.id) CUANTOS, 
					(	SELECT COUNT(cip1.id)
						FROM cmx_importacion_proyecto cip1
							INNER JOIN cmx_importacion_material cim1 ON cim1.id_importacion = cip1.id
							INNER JOIN cmx_importacion_actividades cia1 ON cia1.id_material = cim1.id
						WHERE cip1.estado = 1
							AND cia1.estado = 1
							AND cip1.numero_importacion = cip.numero_importacion
							' . $_filtro_grupo_1 . '
					) COMPLETADOS
				FROM cmx_importacion_proyecto cip
					INNER JOIN cmx_importacion_material cim ON cim.id_importacion = cip.id
					INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cim.id
				WHERE cip.estado = 1 AND cip.numero_importacion = ' . $id . ' ' . $_filtro_grupo . ' 
			';
		// $request = $this->_db->getConsulta($sql);
		$request = $this->_db3->prepare($sql);
		$request->execute();
		$request = $request->fetchAll(PDO::FETCH_ASSOC);
		return $request;
	}

	public function getImportacionMaterial($id, $grupo, $flag_completados)
	{
		$_filtro_grupo = '';
		if ($grupo) {
			$_filtro_grupo = ' AND cia.grupo = ' . $grupo . ' ';
		}

		$_filtro_completado = '';
		if ($flag_completados) {
			$_filtro_completado = ' AND cia.estado NOT IN (1) ';
		}

		$sql = '
				SELECT cim.*,
					cip.numero_importacion, cip.importacion, cip.tipo_operacion, cip.contenedor, cip.id_contrato,
					cia.fecha_creacion, cia.grupo,
					ctc.nombre TIPO_CARGA,
					cc.nombre CLIENTE,
					IF ( cip.id_contrato IS NOT NULL,
						(	SELECT ccc1.cod_contrato
							FROM cmx_contrato_cliente ccc1
							WHERE ccc1.id = cip.id_contrato
						),
						NULL
					) CONTRATO,
					IF ( cip.id_origen IS NOT NULL,
						(	SELECT crd1.nombre
							FROM cmx_remitente_destinatario crd1
							WHERE crd1.id = cip.id_origen
						),
						NULL
					) PUERTO,
					IF( 
						(cip.tipo_operacion = "EXPORTACION") OR (cip.tipo_operacion = "IMPORTACION"),
						IF(
							(SELECT ccr1.actividad_aduanera
							FROM cmx_clientes_documentos ccd1 
								INNER JOIN cmx_clientes_rut ccr1 ON ccr1.id_documento = ccd1.id
							WHERE ccd1.id_cliente = cc.id
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
						(	SELECT CONCAT("(",cii1.sigla,") ",cii1.nombre) INCOTERM 
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
						(	SELECT cis1.tipo_transporte TIPO_TRANSPORTE 
							FROM cmx_intr_solicitudes cis1
							WHERE cis1.id_proyecto = cip.id
						),
						NULL
					) TIPO_TRANSPORTE,
					(	SELECT cms.id_solicitud
						FROM cmx_mercancia_solicitud cms
						WHERE cms.id_material_proyecto = cim.id
					) ID_SOLICITUD
				FROM cmx_importacion_proyecto cip
					INNER JOIN cmx_importacion_material cim ON cim.id_importacion = cip.id
					INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cim.id
					INNER JOIN cmx_tipo_carga ctc ON ctc.id = cip.id_tipo_carga
					INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
				WHERE cip.estado = 1
					' . $_filtro_completado . '
					AND cip.numero_importacion = ' . $id . '
					' . $_filtro_grupo . '
				GROUP BY cim.id;
			';
		// $request = $this->_db->getConsulta($sql);
		$request = $this->_db3->prepare($sql);
		$request->execute();
		$request = $request->fetchAll(PDO::FETCH_ASSOC);
		return $request;
	}

	// public function getImportacionProyecto($id, $grupo)
	// {
	// 	$_filtro_grupo = '';
	// 	if ($grupo) {
	// 		$_filtro_grupo = ' AND cia.grupo = ' . $grupo . ' ';
	// 	}

	// 	$sql = '
	// 			SELECT 
	// 				cia.id_importacion, cip.numero_importacion, cip.importacion, cip.tipo_operacion, cip.contenedor, cip.id_contrato,
	// 				cia.fecha_creacion, cia.grupo,
	// 				ctc.nombre TIPO_CARGA,
	// 				cc.nombre CLIENTE,
	// 				IF ( cip.id_contrato IS NOT NULL,
	// 					(	SELECT ccc1.cod_contrato
	// 						FROM cmx_contrato_cliente ccc1
	// 						WHERE ccc1.id = cip.id_contrato
	// 					),
	// 					NULL
	// 				) CONTRATO,
	// 				IF ( cip.id_origen IS NOT NULL,
	// 					(	SELECT crd1.nombre
	// 						FROM cmx_remitente_destinatario crd1
	// 						WHERE crd1.id = cip.id_origen
	// 					),
	// 					NULL
	// 				) PUERTO,
	// 				IF( 
	// 					(cip.tipo_operacion = "EXPORTACION") OR (cip.tipo_operacion = "IMPORTACION"),
	// 					IF(
	// 						(SELECT ccr1.actividad_aduanera
	// 						FROM cmx_clientes_documentos ccd1 
	// 							INNER JOIN cmx_clientes_rut ccr1 ON ccr1.id_documento = ccd1.id
	// 						WHERE ccd1.id_cliente = cc.id AND ccd1.estado != "0"
	// 						),
	// 						"BIEN",
	// 						NULL
	// 					),
	// 					"BIEN"
	// 				) ADUANERO,
	// 				IF ((	SELECT cis1.id
	// 						FROM cmx_intr_solicitudes cis1
	// 						WHERE cis1.id_proyecto = cip.id
	// 					),
	// 					true,
	// 					false
	// 				) FLAG_INTERNACIONAL,
	// 				IF ((	SELECT cis1.id
	// 						FROM cmx_intr_solicitudes cis1
	// 						WHERE cis1.id_proyecto = cip.id
	// 					),
	// 					(	SELECT CONCAT("(",cii1.sigla,") ",cii1.nombre) INCOTERM 
	// 						FROM cmx_intr_solicitudes cis1
	// 							INNER JOIN cmx_intr_incoterms cii1 ON cii1.sigla = cis1.incoterm
	// 						WHERE cis1.id_proyecto = cip.id
	// 					),
	// 					NULL
	// 				) INCOTERM,
	// 				IF ((	SELECT cis1.id
	// 						FROM cmx_intr_solicitudes cis1
	// 						WHERE cis1.id_proyecto = cip.id
	// 					),
	// 					(	SELECT cis1.tipo_transporte TIPO_TRANSPORTE 
	// 						FROM cmx_intr_solicitudes cis1
	// 						WHERE cis1.id_proyecto = cip.id
	// 					),
	// 					NULL
	// 				) TIPO_TRANSPORTE
	// 			FROM cmx_importacion_proyecto cip
	// 				INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
	// 				INNER JOIN cmx_tipo_carga ctc ON ctc.id = cip.id_tipo_carga
	// 				INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
	// 			WHERE cip.estado = 1
	// 				AND cip.numero_importacion = ' . $id . '
	// 				' . $_filtro_grupo . '
	// 		';
	// 	// $request = $this->_db->getConsulta($sql);
	// 	$request = $this->_db3->prepare($sql);
	// 	$request->execute();
	// 	$request = $request->fetchAll(PDO::FETCH_ASSOC);
	// 	return $request;
	// }

	public function getImportacionProyecto($id, $grupo)
	{
		$_filtro_grupo = '';
		if ($grupo) {
			$_filtro_grupo = ' AND cia.grupo = ' . $grupo . ' ';
		}

		$sql = '
            SELECT 
                cia.id_importacion, cip.numero_importacion, cip.importacion, cip.tipo_operacion, cip.contenedor, cip.id_contrato,
                cia.fecha_creacion, cia.grupo,
                ctc.nombre TIPO_CARGA,
                cc.nombre CLIENTE,
                IF ( cip.id_contrato IS NOT NULL,
                    (   SELECT ccc1.cod_contrato
                        FROM cmx_contrato_cliente ccc1
                        WHERE ccc1.id = cip.id_contrato
                        LIMIT 1
                    ),
                    NULL
                ) CONTRATO,
                IF ( cip.id_origen IS NOT NULL,
                    (   SELECT crd1.nombre
                        FROM cmx_remitente_destinatario crd1
                        WHERE crd1.id = cip.id_origen
                        LIMIT 1
                    ),
                    NULL
                ) PUERTO,
                IF( 
                    (cip.tipo_operacion = "EXPORTACION") OR (cip.tipo_operacion = "IMPORTACION"),
                    IF(
                        (   SELECT ccr1.actividad_aduanera
                            FROM cmx_clientes_documentos ccd1 
                            INNER JOIN cmx_clientes_rut ccr1 ON ccr1.id_documento = ccd1.id
                            WHERE ccd1.id_cliente = cc.id AND ccd1.estado != "0"
                            LIMIT 1
                        ),
                        "BIEN",
                        NULL
                    ),
                    "BIEN"
                ) ADUANERO,
                IF (( SELECT cis1.id
                      FROM cmx_intr_solicitudes cis1
                      WHERE cis1.id_proyecto = cip.id
                      LIMIT 1
                    ),
                    true,
                    false
                ) FLAG_INTERNACIONAL,
                IF (( SELECT cis1.id
                      FROM cmx_intr_solicitudes cis1
                      WHERE cis1.id_proyecto = cip.id
                      LIMIT 1
                    ),
                    (   SELECT CONCAT("(",cii1.sigla,") ",cii1.nombre) INCOTERM 
                        FROM cmx_intr_solicitudes cis1
                        INNER JOIN cmx_intr_incoterms cii1 ON cii1.sigla = cis1.incoterm
                        WHERE cis1.id_proyecto = cip.id
                        LIMIT 1
                    ),
                    NULL
                ) INCOTERM,
                IF (( SELECT cis1.id
                      FROM cmx_intr_solicitudes cis1
                      WHERE cis1.id_proyecto = cip.id
                      LIMIT 1
                    ),
                    (   SELECT cis1.tipo_transporte TIPO_TRANSPORTE 
                        FROM cmx_intr_solicitudes cis1
                        WHERE cis1.id_proyecto = cip.id
                        LIMIT 1
                    ),
                    NULL
                ) TIPO_TRANSPORTE
            FROM cmx_importacion_proyecto cip
                INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
                INNER JOIN cmx_tipo_carga ctc ON ctc.id = cip.id_tipo_carga
                INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
            WHERE cip.estado = 1
                AND cip.numero_importacion = ' . $id . '
                ' . $_filtro_grupo . '
        ';

		// $request = $this->_db->getConsulta($sql);
		$request = $this->_db3->prepare($sql);
		$request->execute();
		$request = $request->fetchAll(PDO::FETCH_ASSOC);
		return $request;
	}


	public function getIntrTramosContrato($id)
	{
		$sql = '
				SELECT 
					cct.id, cct.id_ciudad, cct.tipo_tramo, CONCAT(cm.municipio," (",cm.depto," - ",cm.pais,")") MUNICIPIO
				FROM cmx_contrato_tramos cct
					INNER JOIN cmx_municipios cm ON cm.id = cct.id_ciudad
				WHERE cct.id_contrato = ' . $id . '
			';
		// echo "<pre>" . $sql . "</pre>";
		// $request = $this->_db->getConsulta($sql);
		// return $request;
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
				FROM cmx_importacion_proyecto cip
					INNER JOIN cmx_intr_solicitudes cis ON cis.id_proyecto = cip.id
					INNER JOIN cmx_intr_tramos cit ON cit.id_intr_proyecto = cis.id
					INNER JOIN cmx_remitente_destinatario crd ON crd.id = cit.id_remitente_destinatario
					INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
				WHERE cip.id = ' . $id . '
			';
		// echo "<pre>" . $sql . "</pre>";
		// $request = $this->_db->getConsulta($sql);
		// return $request;
		$request = $this->_db3->prepare($sql);
		$request->execute();
		$request = $request->fetchAll(PDO::FETCH_ASSOC);
		return $request;
	}

	// public function getGrupoActividadesMaterial($id)
	// {
	// 	$sql = "
	// 			SELECT cia.grupo
	// 			FROM cmx_importacion_actividades cia
	// 				INNER JOIN cmx_importacion_material cim ON cia.id_material = cim.id
	// 			WHERE cim.id_importacion = " . $id . "
	// 			GROUP BY cia.grupo;
	// 		";
	// 	// echo "<pre>" . $sql . "</pre>";
	// 	// $result = $this->_db->getConsulta($sql);
	// 	// return $result;
	// 	$result = $this->_db3->prepare($sql);
	// 	$result->execute();
	// 	// $result = $result->fetchAll(PDO::FETCH_ASSOC);
	// 	$result->rowCount();
	// 	return $result;
	// }

	public function getGrupoActividadesMaterial($id)
	{
		$sql = "
        SELECT cia.grupo 
        FROM cmx_importacion_actividades cia
        INNER JOIN cmx_importacion_material cim 
            ON cia.id_material = cim.id
        WHERE cim.id_importacion = :id
        GROUP BY cia.grupo;
    ";

		try {
			$stmt = $this->_db3->prepare($sql);
			$stmt->bindParam(':id', $id, PDO::PARAM_INT);
			$stmt->execute();

			$data = $stmt->fetchAll(PDO::FETCH_ASSOC);
			$rowCount = count($data); // Mejor práctica que rowCount() para SELECT

			return [
				'count' => $rowCount,
				'data' => $data
			];

		} catch (PDOException $e) {
			// Manejo de errores (loggear y/o devolver error)
			error_log("Error en getGrupoActividadesMaterial: " . $e->getMessage());
			return [
				'count' => 0,
				'data' => [],
				'error' => $e->getMessage()
			];
		}
	}

	// public function getGrupoActividadesProyecto($id)
	// {
	// 	$sql = "
	// 			SELECT cia.grupo
	// 			FROM cmx_importacion_actividades cia
	// 				INNER JOIN cmx_importacion_proyecto cip ON cia.id_importacion = cip.id
	// 			WHERE cia.id_importacion = " . $id . "
	// 			GROUP BY cia.grupo;
	// 		";
	// 	// echo "<pre>" . $sql . "</pre>";
	// 	// $result = $this->_db->getConsulta($sql);
	// 	$result = $this->_db3->prepare($sql);
	// 	$result->execute();
	// 	$result = $result->fetchAll(PDO::FETCH_ASSOC);
	// 	return $result;
	// }

	public function getGrupoActividadesProyecto($id)
	{
		$sql = "
        SELECT cia.grupo 
        FROM cmx_importacion_actividades cia
        INNER JOIN cmx_importacion_proyecto cip 
            ON cia.id_importacion = cip.id
        WHERE cia.id_importacion = :id
        GROUP BY cia.grupo;
    ";

		try {
			$stmt = $this->_db3->prepare($sql);
			$stmt->bindParam(':id', $id, PDO::PARAM_INT);
			$stmt->execute();

			$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

			return [
				'count' => count($data),
				'data' => $data
			];

		} catch (PDOException $e) {
			error_log("Error en getGrupoActividadesProyecto: " . $e->getMessage());
			return [
				'count' => 0,
				'data' => [],
				'error' => $e->getMessage()
			];
		}
	}

	public function getActividadesMaterial($id, $grupo)
	{
		$_filtro_grupo = "";
		if ($grupo) {
			$_filtro_grupo = ' AND cia.grupo = ' . $grupo . ' ';
		}
		$sql = "
				SELECT cia.*,
					cip.numero_importacion, cip.id_cliente, cip.tipo_operacion,
					cim.id_importacion, cia.fecha_hora_inicio,
					cmo.codigo,cmo.id ID_MONEDA,
					(	SELECT cp.nombre_perfil
						FROM cmx_perfiles cp
						WHERE cp.id = cia.perfil_responsable) nom_perfil, 
					(	SELECT cp.tipo_perfil
						FROM cmx_perfiles cp
						WHERE cp.id = cia.perfil_responsable) TIPO_PERFIL, 
					IF ((SELECT COUNT('id') FROM cmx_importacion_aplazamientos ciap WHERE ciap.id_actividad = cia.id) > 0,
					(SELECT MAX(ciap.fecha_hora_aplazamiento) FROM cmx_importacion_aplazamientos ciap WHERE ciap.id_actividad = cia.id),
					cia.fecha_hora_inicio) FECHA_HORA_INICIAL
				FROM cmx_importacion_proyecto cip
					INNER JOIN cmx_importacion_material cim ON cim.id_importacion = cip.id
					INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cim.id
					INNER JOIN cmx_monedas cmo ON cmo.id = cia.moneda
				WHERE cim.estado = 1
					AND cia.estado NOT IN (0)
					AND cim.id_importacion = " . $id . "
					" . $_filtro_grupo . "
				GROUP BY cia.orden
				ORDER BY cia.orden
			";
		// echo "<pre>" . $sql . "</pre>";
		// $actividades = $this->_db->getConsulta($sql);
		$actividades = $this->_db3->prepare($sql);
		$actividades->execute();
		$actividades = $actividades->fetchAll(PDO::FETCH_ASSOC);

		if ($actividades) {
			foreach ($actividades as $key => $value) {
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
										SELECT cu.url_avatar, cu.nom_usuario
										FROM cmx_clientes_serv_contratados ccsc
											INNER JOIN cmx_clientes_serv_responsables ccsr ON ccsr.id_serv_contratado = ccsc.id
											INNER JOIN cmx_usuarios cu ON cu.id = ccsr.id_usuario
											INNER JOIN cmx_usuario_cliente cus ON cus.id_usuario = cu.id
										  WHERE ccsc.id_cliente = ' . $value["id_cliente"] . '
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
							$sql = '
									SELECT cu.url_avatar, cu.nom_usuario
									FROM cmx_usuario_cliente cus
										INNER JOIN cmx_usuarios cu ON cu.id = cus.id_usuario
									WHERE cus.id_perfil = ' . $value["perfil_responsable"] . '
										AND cu.estado = 1
										AND cus.estado = 1;
								';
							// $result = $this->_db->getConsulta($sql);
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
									SELECT cu.url_avatar, cu.nom_usuario
									FROM cmx_clientes_serv_contratados ccsc
										INNER JOIN cmx_clientes_serv_responsables ccsr ON ccsr.id_serv_contratado = ccsc.id
										INNER JOIN cmx_usuarios cu ON cu.id = ccsr.id_usuario
										INNER JOIN cmx_usuario_cliente cus ON cus.id_usuario = cu.id
									  WHERE ccsc.id_cliente = ' . $value["id_cliente"] . '
										AND ccsc.servicio = "' . $_servicio_contratado . '"
										AND ccsr.tipo_ejecutivo = "Ejecutivo Servicio al Cliente"
										AND cus.id_perfil = ' . $value["perfil_responsable"] . '
										AND ccsr.estado = 1;
								';
							// $result = $this->_db->getConsulta($sql);
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
		return $actividades;
	}

	public function getActividadesProyecto($id, $grupo)
	{
		$_filtro_grupo = "";
		if ($grupo) {
			$_filtro_grupo = ' AND cia.grupo = ' . $grupo . ' ';
		}
		$sql = "
				SELECT 
					cia.*,
					cia.fecha_hora_inicio,
					cip.numero_importacion, cip.id_cliente, cip.tipo_operacion,
					cmo.codigo,cmo.id ID_MONEDA,
					(	SELECT cp.nombre_perfil
						FROM cmx_perfiles cp
						WHERE cp.id = cia.perfil_responsable) nom_perfil, 
					(	SELECT cp.tipo_perfil
						FROM cmx_perfiles cp
						WHERE cp.id = cia.perfil_responsable) TIPO_PERFIL, 
						IF ((SELECT COUNT('id') FROM cmx_importacion_aplazamientos ciap WHERE ciap.id_actividad = cia.id) > 0,
						(SELECT MAX(ciap.fecha_hora_aplazamiento) FROM cmx_importacion_aplazamientos ciap WHERE ciap.id_actividad = cia.id),
						cia.fecha_hora_inicio) FECHA_HORA_INICIAL
				FROM 
					cmx_importacion_proyecto cip
					INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
					INNER JOIN cmx_monedas cmo ON cmo.id = cia.moneda
				WHERE 
					cip.estado = 1
					AND cia.estado NOT IN (0)
					AND cia.id_importacion = " . $id . "
					" . $_filtro_grupo . "
				GROUP BY cia.orden
				ORDER BY cia.orden
			";
		// echo "<pre>" . $sql . "</pre>";
		// $actividades = $this->_db->getConsulta($sql);
		$sl_actividades = $this->_db3->prepare($sql);
		$sl_actividades->execute();
		$actividades["actividades"] = $sl_actividades->fetchAll(PDO::FETCH_ASSOC);

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
								$result = $result->fetchAll(PDO::FETCH_ASSOC);
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
										AND cus.estado = 1
								';
							// $result = $this->_db->getConsulta($sql);
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
										AND ccsr.estado = 1
								';
							// $result = $this->_db->getConsulta($sql);
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

		return $actividades;
	}

	public function getIdActividadesMaterial($id, $orden, $grupo)
	{
		$sql = "
				SELECT 
					cia.id,
					cia.orden
				FROM 
					cmx_importacion_material cim
					INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cim.id
				WHERE 
					cim.estado = 1
					AND cia.estado IN (1,2,3)
					AND cim.id_importacion = '" . $id . "'
					AND cia.grupo = '" . $grupo . "'
					AND cia.orden = '" . $orden . "';
			";
		// $actividades = $this->_db->getConsulta($sql);
		$actividades = $this->_db3->prepare($sql);
		$actividades->execute();
		$actividades = $actividades->fetchAll(PDO::FETCH_ASSOC);
		return $actividades;
	}

	public function getIdActividadesProyecto($id, $orden, $grupo)
	{
		$sql = "
				SELECT 
					cia.id,
					cia.orden
				FROM 
					cmx_importacion_proyecto cip
					INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
				WHERE 
					cip.estado = 1
					AND cia.estado IN (1,2,3)
					AND cia.id_importacion = '" . $id . "'
					AND cia.grupo = '" . $grupo . "'
					AND cia.orden = '" . $orden . "';
			";
		// $actividades = $this->_db->getConsulta($sql);
		$actividades = $this->_db3->prepare($sql);
		$actividades->execute();
		$actividades = $actividades->fetchAll(PDO::FETCH_ASSOC);
		return $actividades;
	}

	public function getOrdenActividadesMaterial($id, $grupo)
	{
		$sql = "
				SELECT 
					cia.id, cia.orden, cia.estado, cia.id_centro_costo
				FROM 
					cmx_importacion_material cim
					INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cim.id
				WHERE 
					cia.estado != 0
					AND cim.id_importacion = " . $id . "
					AND cia.grupo = " . $grupo . "
					ORDER BY cia.estado asc;
			";
		// echo "<pre>" . $sql . "</pre>";
		// $orden_compra = $this->_db->getConsulta($sql);
		$orden_compra = $this->_db3->prepare($sql);
		$orden_compra->execute();
		$orden_compra = $orden_compra->fetchAll(PDO::FETCH_ASSOC);
		return $orden_compra;
	}

	public function getOrdenActividadesProyecto($id, $grupo)
	{
		$sql = "
				SELECT 
					cia.id, cia.orden, cia.estado, cia.id_centro_costo
				FROM 
					cmx_importacion_proyecto cip
					INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
				WHERE 
					cia.estado != 0
					AND cia.id_importacion = " . $id . "
					AND cia.grupo = " . $grupo . "
					ORDER BY cia.estado asc;
			";
		// echo "<pre>" . $sql . "</pre>";
		// $orden_compra = $this->_db->getConsulta($sql);
		$orden_compra = $this->_db3->prepare($sql);
		$orden_compra->execute();
		$orden_compra = $orden_compra->fetchAll(PDO::FETCH_ASSOC);
		return $orden_compra;
	}

	public function getActividadesIncompletas($id, $grupo)
	{
		$sql = "
				SELECT 
					COUNT(cia.id) INACTIVAS
				FROM 
					cmx_importacion_material cim
					INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cim.id
				WHERE 
					cim.estado = 1
					AND cia.estado NOT IN (0,1)
					AND cim.id_importacion = " . $id . "
					AND cia.grupo = " . $grupo . ";
			";
		// $actividades = $this->_db->getConsulta($sql);
		$actividades = $this->_db3->prepare($sql);
		$actividades->execute();
		$actividades = $actividades->fetchAll(PDO::FETCH_ASSOC);
		return $actividades;
	}

	public function getFlagInstrucciones($id, $grupo)
	{
		$sql = '
				SELECT COUNT(cia.id) CUANTOS
				FROM cmx_importacion_material cim
					INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cim.id
				WHERE cim.estado = 1
					AND cia.tipo_actividad = "instruccion_factura"
					AND cia.estado NOT IN (0,1)
					AND cim.id_importacion = ' . $id . '
					AND cia.grupo = ' . $grupo . ';
			';
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetchAll(PDO::FETCH_ASSOC);
		$return = false;
		if ($result[0] > 0) {
			$return = true;
		}
		return $return;
	}

	// SELECT MULTIPLE GENERICO DE ACTIVIDADES
	public function getHtmlSelectMultiple($name, $id, $orden, $bloque)
	{

		$_filtro_orden = "";
		if ($orden) {
			$_filtro_orden = " AND cia.orden != " . $orden . " ";
		}
		if ($name) {
			$sql = '
					SELECT 
						cia.orden, cia.nombre,
						cia.estado 
					FROM 
						cmx_importacion_actividades cia
						INNER JOIN cmx_importacion_material cim ON cim.id = cia.id_material
					WHERE 
						cia.orden >= (SELECT MIN(cia1.orden) FROM cmx_importacion_actividades cia1 WHERE cia1.estado IN (2,3))
						AND cim.id_importacion = "' . $id . '"
						AND cia.estado != 0
						AND cia.bloque IN (0,' . $bloque . ')
						' . $_filtro_orden . '
					GROUP BY cia.orden;
				';
			// echo $sql;
			// $array = $this->_db->getConsulta($sql);
			$array = $this->_db3->prepare($sql);
			$array->execute();
			$array = $array->fetchAll(PDO::FETCH_ASSOC);

			$sql = '
					SELECT 
						COUNT(cia.id) ACTIVOS
					FROM 
						cmx_importacion_actividades cia
						INNER JOIN cmx_importacion_material cim ON cim.id = cia.id_material
					WHERE 
						cia.orden >= (SELECT MIN(cia1.orden) FROM cmx_importacion_actividades cia1 WHERE cia1.estado IN (2,3))
						AND cia.estado IN (1,2)
						AND cim.id_importacion = "' . $id . '";
				';
			// echo $sql;
			// $arrayCantidad = $this->_db->getConsulta($sql);
			$arrayCantidad = $this->_db3->prepare($sql);
			$arrayCantidad->execute();
			$arrayCantidad = $arrayCantidad->fetchAll(PDO::FETCH_ASSOC);

			// Se recorre contenido de la consulta
			if ($array) {
				// print_r("<pre>");
				// print_r($array);
				// print_r("</pre>");
				$select = '
						<select class="tags" multiple="multiple" name="' . $name . '" id="slct_actividades_plantilla_' . $id . $orden . '" aria-hidden="true">
					';
				$select .= '<option value="" disabled>seleccione</option>';
				$option_primer_actividad = '';
				if ($arrayCantidad[0]['ACTIVOS'] == 0) {
					$option_primer_actividad = '<option value="0">Primer Actividad</option>';
				}
				foreach ($array as $key => $value) {

					if ($value["orden"] == 1) {
						$select .= $option_primer_actividad;
					}
					if ($orden == $value["orden"]) {
						$select .= '<option value="' . $value["orden"] . '" selected="">(' . $value["orden"] . ') - ' . $value["nombre"] . '</option>';
					} else {
						$select .= '<option value="' . $value["orden"] . '">(' . $value["orden"] . ') - ' . $value["nombre"] . '</option>';
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

	public function getActividadesPrevias($id, $orden, $grupo)
	{
		$sql = "
				SELECT 
					(	
						SELECT 
							cia1.nombre
						FROM
							cmx_importacion_actividades cia1
							INNER JOIN cmx_importacion_material cim1 ON cim1.id = cia1.id_material
						WHERE 
							cia1.orden IN (cia.actividad_previa)
							AND cia1.estado != 0 
						GROUP BY cia.nombre
					) ACTIVIDAD_PREVIA
				FROM
					cmx_importacion_actividades cia
					INNER JOIN cmx_importacion_material cim ON cim.id = cia.id_material
				WHERE 
					cim.id_importacion = '" . $id . "'
					AND cia.orden = '" . $orden . "'
					AND cia.estado != 0
					AND cia.grupo = '" . $grupo . "'
				GROUP BY cia.nombre;
			";
		// $actividadesPrevias = $this->_db->getConsulta($sql);
		$actividadesPrevias = $this->_db3->prepare($sql);
		$actividadesPrevias->execute();
		$actividadesPrevias = $actividadesPrevias->fetch(PDO::FETCH_ASSOC);
		return $actividadesPrevias;
	}

	public function getActividadActiva($id, $grupo)
	{
		$_filtro_grupo = "";
		if ($grupo) {
			$_filtro_grupo = ' AND cia.grupo = ' . $grupo . ' ';
		}
		$sql = "
				SELECT 
					cia.*
				FROM 
					cmx_importacion_material cim
					INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cim.id
				WHERE 
					cim.estado = 1
					AND cia.estado IN (2)
					AND cim.id_importacion = " . $id . "
					" . $_filtro_grupo . "
					GROUP BY cia.nombre
			";
		// $actividades = $this->_db->getConsulta($sql);
		$actividades = $this->_db3->prepare($sql);
		$actividades->execute();
		$actividades = $actividades->fetchAll(PDO::FETCH_ASSOC);
		return $actividades;
	}

	public function getActividadesTerminadas($id, $grupo)
	{
		$sql = "
				SELECT 
					COUNT(DISTINCT(cia.nombre)) TERMINADAS
				FROM 
					cmx_importacion_material cim
					INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cim.id
				WHERE 
					cim.estado = 1
					AND cia.estado IN (1)
					AND cim.id_importacion = " . $id . "
					AND cia.grupo = " . $grupo . ";
			";
		// $actividades = $this->_db->getConsulta($sql);
		$actividades = $this->_db3->prepare($sql);
		$actividades->execute();
		$actividades = $actividades->fetch(PDO::FETCH_ASSOC);
		return $actividades;
	}

	public function getAplazamientos($id)
	{
		$sql = "
				SELECT 
					ciap.*, 
					CONCAT('../public/files/importaciones/aplazamientos/',ciap.id_actividad,'/',ciap.url) URL_FILE,
					cj.nombre, cj.descripcion 
				FROM 
					cmx_importacion_aplazamientos ciap 
					INNER JOIN cmx_justificaciones cj ON cj.id = ciap.id_justificacion
				WHERE 
					ciap.id_actividad = '" . $id . "'
				ORDER BY ciap.id DESC;
			";
		// $aplazamientos = $this->_db->getConsulta($sql);
		$aplazamiento_sql = $this->_db3->prepare($sql);
		$aplazamiento_sql->execute();
		$aplazamientos = $aplazamiento_sql->fetchAll(PDO::FETCH_ASSOC);
		return $aplazamientos;
	}

	public function getEntregableActividad($id, $orden, $grupo)
	{
		$sql = '
				SELECT cie.* 
				FROM 
					cmx_importacion_proyecto cip 
					INNER JOIN cmx_importacion_actividades cia ON cip.id = cia.id_importacion 
					INNER JOIN cmx_importacion_entregables cie ON cie.id_actividad = cia.id 
				WHERE cip.id = ' . $id . '
					AND cia.orden = ' . $orden . ' 
					AND cia.grupo = ' . $grupo . ' 
				UNION
				SELECT cie.* 
				FROM 
					cmx_importacion_material cim 
					INNER JOIN cmx_importacion_actividades cia ON cim.id = cia.id_material 
					INNER JOIN cmx_importacion_entregables cie ON cie.id_actividad = cia.id 
				WHERE 
					cim.id_importacion = ' . $id . ' 
					AND cia.orden = ' . $orden . ' 
					AND cia.grupo = ' . $grupo . ' 
				LIMIT 1;
			';
		// echo "<pre>" . $sql . "</pre>";
		// $entregables = $this->_db->getConsulta($sql);
		$entregables = $this->_db3->prepare($sql);
		$entregables->execute();
		$entregables = $entregables->fetch(PDO::FETCH_ASSOC);
		return $entregables;
	}

	public function buscaDatosProyecto($_id_importacion, $grupo)
	{
		$content = "";

		$array = $this->getDatosProyecto($_id_importacion, $grupo);

		if (isset($array["content"]) && $array["content"]) {
			$content .= '
					<div class="row">
						' . $array["content"] . '
					</div>
				';
		}
		return $content;
	}

	private function getDatosProyecto($id, $grupo)
	{
		$return["content"] = "";

		/****** INFORMACIÓN DE LA SOLICITUD ******/
		if ($grupo == 1) {
			$sql = '
					SELECT 
						DISTINCT(cs.id),cs.numero_solicitud, cs.fecha_solicitud, cs.peso_total,
						IF(	cs.tipo_vehiculo,
							(	SELECT ctv1.nombre
								FROM cmx_tipo_vehiculos ctv1
								WHERE ctv1.id = cs.tipo_vehiculo
							),
							NULL
						) TIPO_VEHICULO,
						IF(	cs.tipo_carroceria,
							(	SELECT crvc1.descripcion
								FROM cmx_rndc_vehiculos_carroceria crvc1
								WHERE crvc1.id = cs.tipo_carroceria
							),
							NULL
						) TIPO_CARROCERIA
					FROM 
						cmx_importacion_proyecto cip
						INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
						INNER JOIN cmx_mercancia_solicitud cms ON cms.id_material_proyecto = cia.id_material
						INNER JOIN cmx_solicitudes cs ON cs.id = cms.id_solicitud
					WHERE
						cip.id = ' . $id . '
						AND cia.grupo = ' . $grupo . ' 
						AND cia.id_material IS NOT NULL
				';
		} else {
			$sql = '
					SELECT 
						DISTINCT(cs.id),cs.numero_solicitud, cs.fecha_solicitud, cs.peso_total,
						IF(	cs.tipo_vehiculo,
							(	SELECT ctv1.nombre
								FROM cmx_tipo_vehiculos ctv1
								WHERE ctv1.id = cs.tipo_vehiculo
							),
							NULL
						) TIPO_VEHICULO,
						IF(	cs.tipo_carroceria,
							(	SELECT crvc1.descripcion
								FROM cmx_rndc_vehiculos_carroceria crvc1
								WHERE crvc1.id = cs.tipo_carroceria
							),
							NULL
						) TIPO_CARROCERIA
					FROM 
						cmx_importacion_proyecto cip
						INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
						INNER JOIN cmx_agrupacion_material cam ON cam.id_material_proyecto = cia.id_material
						INNER JOIN cmx_mercancia_solicitud cms ON cms.id = cam.id_material
						INNER JOIN cmx_solicitudes cs ON cs.id = cms.id_solicitud
					WHERE
						cip.id = ' . $id . '
						AND cia.grupo = ' . $grupo . ' 
						AND cia.id_material IS NOT NULL
				';
		}
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetchAll(PDO::FETCH_ASSOC);

		if ($result) {
			foreach ($result as $key => $value) {
				// Se busca si la solicitud tiene servicio adicionales 
				$sql = '
						SELECT 
							*
						FROM 
							cmx_servicio_adicional_tramo csat
							INNER JOIN cmx_contabilidad_conceptos ccc ON ccc.id = csat.id_servicio
						WHERE
							csat.id_solicitud = ' . $value['id'] . '
							AND ccc.tipo_servicio != "BASICO";
					';
				// $result_1 = $this->_db->getConsulta($sql);
				$result_1 = $this->_db3->prepare($sql);
				$result_1->execute();
				$result_1 = $result_1->fetchAll(PDO::FETCH_ASSOC);

				$_servicio_adicional = '';
				if ($result_1) {
					$_servicio_adicional = '
							<table class="table table-condensed table-striped table-hover">
								<thead>
									<tr>
										<th>Servicio</th>
										<th>Valor Venta</th>
										<th>Valor Compra</th>
									</tr>
								</thead>
								<tbody>
						';
					foreach ($result_1 as $key_1 => $value_1) {
						$_sobrecosto = "";
						if ($value_1["sobrecosto"] == 1) {
							$_sobrecosto = '<label><small class="text-muted"><strong class="text-danger">(Se cobra al cliente)</strong></small></label>';
						}
						$_servicio_adicional .= '
								<tr>
									<td>' . $_sobrecosto . ' ' . $value_1["nom_servicios_especial"] . '</td>
									<td>' . number_format($value_1["valor_venta"], 2, ",", ".") . '</td>
									<td>' . number_format($value_1["valor_compra"], 2, ",", ".") . '</td>
								</tr>
							';
					}
					$_servicio_adicional .= '
								</tbody>
							</table>
						';
				}

				$vehiculo_propuesto = "";
				$_flag_tipo_vehiculo = "";
				$_flag_tipo_carroceria = "";
				if ($value["TIPO_VEHICULO"]) {
					$_flag_tipo_vehiculo = $value["TIPO_VEHICULO"];
				}

				if ($value["TIPO_CARROCERIA"]) {
					$_flag_tipo_carroceria = "(" . $value["TIPO_CARROCERIA"] . ")";
				}

				if ($_flag_tipo_vehiculo || $_flag_tipo_carroceria) {
					$vehiculo_propuesto = '
							<div class="col-sm-4">
								<span>Vehículo Propuesto:</span>
								<span class="cell-detail-description">' . $_flag_tipo_vehiculo . ' ' . $_flag_tipo_carroceria . '</span>
							</div>
						';
				}

				$return["content"] .= '
						<div class="col-sm-6">
							<div class="panel panel-contrast">
								<div class="panel-heading panel-heading-contrast">
									Solicitud - ' . $value["numero_solicitud"] . '
									<span class="panel-subtitle">' . date('Y-m-d', strtotime($value["fecha_solicitud"])) . '</span>
								</div>
								<div class="panel-body">
									<div class="col-sm-4">
										<span>Peso:</span>
										<span class="cell-detail-description">' . number_format($value["peso_total"], 2, ",", ".") . ' Kg.</span>
									</div>
									' . $vehiculo_propuesto . '
								</div>
									' . $_servicio_adicional . '
							</div>
						</div>
					';
			}
		}
		/****** FIN - INFORMACIÓN DE LA SOLICITUD ******/

		/****** INFORMACIÓN DE LA AGRUPACIÓN ******/
		$sql = '
				SELECT 
					DISTINCT(ca.id), ca.numero_agrupacion, ca.codigo_rojo, ca.fecha_hora_operacion,
					(
						SELECT 
							COUNT(cas1.id)
						FROM 
							cmx_agrupacion_solicitudes cas1
						WHERE 
							cas1.id_agrupacion = ca.id
					) CUANTOS
				FROM 
					cmx_importacion_proyecto cip
					INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
					INNER JOIN cmx_agrupacion_material cam ON cam.id_material_proyecto = cia.id_material
					INNER JOIN cmx_agrupaciones ca ON ca.id = cam.id_agrupamiento
				WHERE
					cip.id = ' . $id . '
					AND cia.grupo = ' . $grupo . ' 
					AND cia.id_material IS NOT NULL
			';
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetchAll(PDO::FETCH_ASSOC);

		if ($result) {
			foreach ($result as $key => $value) {
				$_css_style = "actions-nexos";
				$_data_hint_text = "No es código rojo";
				if ($value["codigo_rojo"] == 1) {
					$_css_style = "nexos-txt-danger";
					$_data_hint_text = "Es código rojo";
				}

				$return["content"] .= '
						<div class="col-sm-6">
							<div class="panel panel-contrast">
								<div class="panel-heading panel-heading-contrast">
									Agrupación - ' . $value["numero_agrupacion"] . '
									<span class="panel-subtitle">' . date('Y-m-d', strtotime($value["fecha_hora_operacion"])) . '</span>
								</div>
								<div class="panel-body">
									<div class="col-sm-2">
										<table>
											<tr>
												<td class="' . $_css_style . '">
													<a data-toggle="modal" class="cell-detail md-trigger hint--top" data-hint="' . $_data_hint_text . '">
														<span class="icon mdi mdi-truck"></span>
													</a>
												</td>
											</tr>
										</table>
									</div>
									<div class="col-sm-8">
										<span># Solicitudes en agrupación:</span>
										<span class="cell-detail-description">' . $value["CUANTOS"] . '</span>
									</div>
								</div>
							</div>
						</div>
					';
			}
		}
		/****** FIN - INFORMACIÓN DE LA AGRUPACIÓN ******/

		/****** INFORMACIÓN DEL MANIFIESTO ******/
		$_flag_manifiesto = false;
		$sql = '
				SELECT 
					DISTINCT(caa.numero_manifiesto), cav.estado, cv.placa, ctv.nombre, cv.tipo_carroceria,
					IF(
						conductor.tipo_documento = "NIT",
						CONCAT(conductor.numero_documento,"-",conductor.digito_verificacion),
						conductor.numero_documento
					) DOCUMENTO_CONDUCTOR,
					conductor.nombre NOMBRE_CONDUCTOR,
					IF(
						tenedor.tipo_documento = "NIT",
						CONCAT(tenedor.numero_documento,"-",tenedor.digito_verificacion),
						tenedor.numero_documento
					) DOCUMENTO_TENEDOR,
					tenedor.nombre NOMBRE_TENEDOR,
					IF(
						propietario.tipo_documento = "NIT",
						CONCAT(propietario.numero_documento,"-",propietario.digito_verificacion),
						propietario.numero_documento
					) DOCUMENTO_PROPIETARIO,
					propietario.nombre NOMBRE_PROPIETARIO
				FROM 
					cmx_importacion_proyecto cip
					INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
					INNER JOIN cmx_agrupacion_material cam ON cam.id_material_proyecto = cia.id_material
					INNER JOIN cmx_agrupaciones ca ON ca.id = cam.id_agrupamiento
					INNER JOIN cmx_agrupacion_anticipo caa ON caa.id_agrupacion = ca.id
					INNER JOIN cmx_agrupaciones_vehiculos cav ON cav.id_agrupacion = ca.id
					INNER JOIN cmx_vehiculos cv ON cv.id = cav.id_vehiculo
					INNER JOIN cmx_tipo_vehiculos ctv ON ctv.id = cv.tipo_vehiculo
					INNER JOIN cmx_proveedores conductor ON conductor.id = cv.id_conductor
					INNER JOIN cmx_proveedores tenedor ON tenedor.id = cv.id_tenedor
					INNER JOIN cmx_proveedores propietario ON propietario.id = cv.id_propietario
				WHERE
					cip.id = ' . $id . '
					AND cia.grupo = ' . $grupo . ' 
					AND cia.id_material IS NOT NULL
					AND cav.estado NOT IN  ("Asignado","Propuesto","Preaprobado","Pendiente","No Aprobado","Cancelado","Aprobado","Verificacion Flete")
			';
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetchAll(PDO::FETCH_ASSOC);

		if ($result) {
			$_flag_manifiesto = true;
			foreach ($result as $key => $value) {
				$array_manifiesto = explode("-", $value["numero_manifiesto"]);
				$_tipo_carroceria = "";
				if ($value["tipo_carroceria"]) {
					$_tipo_carroceria = "(" . $value["tipo_carroceria"] . ")";
				}

				$return["content"] .= '
						<div class="col-sm-12"></div>
						<div class="col-sm-6">
							<div class="panel panel-contrast">
								<div class="panel-heading panel-heading-contrast">
									Manifiesto - ' . $value["numero_manifiesto"] . '
									<span class="panel-subtitle">' . date('Y-m-d', $array_manifiesto[1]) . '</span>
								</div>
								<div class="panel-body">
									<div class="row">
										<div class="col-sm-4">
											<span>' . $value["placa"] . '</span>
											<span class="cell-detail-description">' . $value["nombre"] . ' ' . $_tipo_carroceria . '</span>
										</div>
										<div class="col-sm-8">
											<span>Estado:</span>
											<span class="cell-detail-description">' . $value["estado"] . '</span>
										</div>
									</div><br />
									<div class="row">
										<div class="col-sm-6">
											<span>Propietario:</span>
											<span class="cell-detail-description">' . $value["NOMBRE_PROPIETARIO"] . '</span>
											<span class="cell-detail-description">' . $value["DOCUMENTO_PROPIETARIO"] . '</span>
										</div>
										<div class="col-sm-6">
											<span>Tenedor:</span>
											<span class="cell-detail-description">' . $value["NOMBRE_TENEDOR"] . '</span>
											<span class="cell-detail-description">' . $value["DOCUMENTO_TENEDOR"] . '</span>
										</div>
									</div><br />
									<div class="row">
										<div class="col-sm-6">
											<span>Conductor:</span>
											<span class="cell-detail-description">' . $value["NOMBRE_CONDUCTOR"] . '</span>
											<span class="cell-detail-description">' . $value["DOCUMENTO_CONDUCTOR"] . '</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					';
			}
		}
		/****** FIN - INFORMACIÓN DEL MANIFIESTO ******/

		/****** INFORMACIÓN DE LAS REMESAS ******/
		if ($_flag_manifiesto) {
			$sql = '
					SELECT 
						DISTINCT(cam.numero_remesa), cim.nombre, cim.peso_bruto, cim.peso_neto, cim.cantidad
					FROM 
						cmx_importacion_proyecto cip
						INNER JOIN cmx_importacion_material cim ON cim.id_importacion = cip.id
						INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cim.id
						INNER JOIN cmx_agrupacion_material cam ON cam.id_material_proyecto = cia.id_material
					WHERE
						cip.id = ' . $id . '
						AND cia.grupo = ' . $grupo . ' 
						AND cia.id_material IS NOT NULL
				';
			// $result = $this->_db->getConsulta($sql);
			$result = $this->_db3->prepare($sql);
			$result->execute();
			$result = $result->fetchAll(PDO::FETCH_ASSOC);

			if ($result) {
				// Se crea la tabla de remesas  
				$_remesas = '
						<table class="table table-condensed table-striped">
							<thead>
								<tr>
									<th>Remesa</th>
									<th>Material</th>
									<th>Cantidad</th>
									<th>Peso</th>
								</tr>
							</thead>
							<tbody>
					';
				foreach ($result as $key => $value) {
					$_remesas .= '
							<tr>
								<td>' . $value["numero_remesa"] . '</td>
								<td>' . $value["nombre"] . '</td>
								<td>' . $value["cantidad"] . '</td>
								<td>
									<span class="cell-detail-description">Bruto: ' . number_format($value["peso_bruto"], 2, ",", ".") . ' Kg.</span>
									<span class="cell-detail-description">Neto: ' . number_format($value["peso_neto"], 2, ",", ".") . ' Kg.</span>
								</td>
							</tr>
						';
				}
				$_remesas .= '
							</tbody>
						</table>
					';

				$return["content"] .= '
						<div class="col-sm-6">
							<div class="panel panel-default panel-table">
								<div class="panel-heading">Remesas
									<div class="tools"></div>
								</div>
								<div class="panel-body">
									' . $_remesas . '
								</div>
							</div>
						</div>
					';
			}
		}
		/****** FIN - INFORMACIÓN DE LAS REMESAS ******/

		/****** INFORMACIÓN DE LOS TRAMOS ******/
		$sql = '
				SELECT 
					DISTINCT(cts.id), 
					cts.tipo_operacion, cts.fecha_hora_operacion, 
					(
						SELECT
							SUM(ctm1.unidades)
						FROM
							cmx_tramo_material ctm1
						WHERE
							
							ctm1.id_tramo IN (
								SELECT 
									cts2.id
								FROM 
									cmx_tramo_solicitud cts2
								WHERE 
									cts2.id = cts.id
							)
					) CANTIDAD,
					(
						SELECT
							SUM(ctm1.peso)
						FROM
							cmx_tramo_material ctm1
						WHERE
							ctm1.id_tramo IN (
								SELECT 
									cts2.id
								FROM 
									cmx_tramo_solicitud cts2
								WHERE 
									cts2.id = cts.id
							)
					) PESO,
					crd.nombre, crd.direccion, CONCAT(cm.municipio," (",cm.depto," - ",cm.pais,")") MUNICIPIO
				FROM 
					cmx_importacion_proyecto cip
					INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
					INNER JOIN cmx_agrupacion_material cam ON cam.id_material_proyecto = cia.id_material
					INNER JOIN cmx_mercancia_solicitud cms ON cms.id = cam.id_material
					INNER JOIN cmx_solicitudes cs ON cs.id = cms.id_solicitud
					INNER JOIN cmx_tramo_solicitud cts ON cts.id_solicitud = cs.id
					INNER JOIN cmx_remitente_destinatario crd ON crd.id = cts.id_remitente_destinatario
					INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
				WHERE
					cip.id = ' . $id . '
					AND cia.grupo = ' . $grupo . ' 
					AND cia.id_material IS NOT NULL
			';
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetchAll(PDO::FETCH_ASSOC);

		if ($result) {
			$_table_tramos = '
					<table class="table table-condensed table-striped">
						<thead>
							<tr>
								<th>Operación</th>
								<th>Remitente - Destinatario</th>
								<th>Peso</th>
								<th>Unidades</th>
								<th>Ubicación</th>
							</tr>
						</thead>
						<tbody>
				';
			foreach ($result as $key => $value) {
				$_table_tramos .= '
						<tr>
							<td>
								<span>' . $value["tipo_operacion"] . '</span>
								<span class="cell-detail-description">' . $value["fecha_hora_operacion"] . '</span>
							</td>
							<td>
								<span>' . $value["nombre"] . '</span>
							</td>
							<td>
								<span>' . number_format($value["PESO"], 2, ",", ".") . ' Kg.</span>
							</td>
							<td class="text-center">
								<span>' . $value["CANTIDAD"] . '</span>
							</td>
							<td>
								<span>' . $value["direccion"] . '</span>
								<span class="cell-detail-description">' . $value["MUNICIPIO"] . '</span>
							</td>
						</tr>
					';
			}
			$_table_tramos .= '
						</tbody>
					</table>
				';

			$return["content"] .= '
					<div class="col-sm-12">
						<div class="panel panel-default panel-table">
							<div class="panel-heading">
								Tramos
								<div class="tools"></div>
							</div>
							<div class="panel-body">
								' . $_table_tramos . '
							</div>
						</div>
					</div>
				';
		}
		/****** FIN - INFORMACIÓN DE LOS TRAMOS ******/

		return $return;
	}

	// Select multiple de conceptos contables 
	public function getHtmlSelectCostosMultiple($name)
	{

		if ($name) {
			$sql = '
					SELECT 
						ccc.*
					FROM 
						cmx_contabilidad_conceptos ccc
					WHERE 
						ccc.tipo_servicio != "BASICO"
						AND ccc.estado = 1
					ORDER BY ccc.nom_servicios_especial
				';
			// $result = $this->_db->getConsulta($sql);
			$result = $this->_db3->prepare($sql);
			$result->execute();
			$result = $result->fetchAll(PDO::FETCH_ASSOC);

			// Se recorre contenido de la consulta
			if ($result) {

				$select = '
						<label>Servicios Adicionales</label>
						<select multiple="" class="select2 select2-hidden-accessible" name="' . $name . '" id="slct_' . $name . '" aria-hidden="true" tabindex="-1">
					';
				foreach ($result as $key => $value) {
					$select .= '<option value="' . $value['id'] . '">' . $value["nom_servicios_especial"] . '</option>';
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

	/******** CONSULTAS DEL TIPO DE ACTIVIDAD VERIFICACIÓN DE MERCANCÍA **********/
	public function getVerificacionMercanciaObservaciones($id_actividad)
	{
		$sql = '
				SELECT 
					ciom.id, cim.nombre, cim.codigo, ciom.observacion
				FROM 
					cmx_importacion_actividades cia
					INNER JOIN cmx_importacion_obsevacion_material ciom ON ciom.id_actividad = cia.id
					INNER JOIN cmx_importacion_material cim ON cim.id = ciom.id_material
				WHERE
					cia.id = ' . $id_actividad . ';
			';
		// echo "<pre>" . $sql . "</pre>";
		// $entregables = $this->_db->getConsulta($sql);
		$entregables = $this->_db3->prepare($sql);
		$entregables->execute();
		$entregables = $entregables->fetchAll(PDO::FETCH_ASSOC);
		return $entregables;
	}

	public function getVerificacionMercanciaImagenes($id_actividad)
	{
		$sql = '
				SELECT 
					CONCAT("public/files/importaciones/verificacion/",cia.id,"/",ciia.url) IMG_URL
				FROM 
					cmx_importacion_actividades cia
					INNER JOIN cmx_importacion_imagen_actividad ciia ON ciia.id_actividad = cia.id
				WHERE
					cia.id = ' . $id_actividad . ';
			';
		// echo "<pre>" . $sql . "</pre>";
		// $entregables = $this->_db->getConsulta($sql);
		$entregables = $this->_db3->prepare($sql);
		$entregables->execute();
		$entregables = $entregables->fetchAll(PDO::FETCH_ASSOC);
		return $entregables;
	}
	/******** FIN CONSULTAS DEL TIPO DE ACTIVIDAD VERIFICACIÓN DE MERCANCÍA **********/

	public function getActividadIntegradaSoluciones($id)
	{
		$sql = "
				SELECT 
					COUNT(cisi.id) CUANTOS
				FROM 
					cmx_importacion_actividades cia 
					INNER JOIN cmx_integracion_soluc_import cisi ON cisi.id_importacion_actividad = cia.id
				WHERE 
					cia.id = " . $id . ";
			";
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetchAll(PDO::FETCH_ASSOC);
		return $result;
	}

	/******** CONSULTAS DE TIPO DE ACTIVIDAD ANTICIPO **********/
	public function getCargasSolicitud($id_actividad)
	{
		$sql = '
				SELECT 
					ca.numero_agrupacion
				FROM 
					cmx_agrupaciones ca
					INNER JOIN cmx_agrupacion_solicitudes cas ON cas.id_agrupacion = ca.id
					INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = ca.id
					INNER JOIN cmx_mercancia_solicitud cms ON cms.id_solicitud = cas.id_solicitud
					INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cam.id_material_proyecto AND cia.id_material = cms.id_material_proyecto
				WHERE 
					cia.id = ' . $id_actividad . '
			;';
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetchAll(PDO::FETCH_ASSOC);
		return $result;
	}

	public function getAgrupamientosCarga($importacion, $agrupamiento)
	{
		$_filtro_grupo = "";
		if (isset($importacion[1])) {
			$_filtro_grupo = ' AND cia.grupo = ' . $importacion[1] . ' ';
		}
		$sql = "
				SELECT 
					DISTINCT(cv.id) ID_VEHICULO, 
					cp.nombre, CONCAT(cp.numero_documento,'-',cp.digito_verificacion) DOCUMENTO,
					cv.placa, ctv.nombre TIPO_VEHICULO, cv.tipo_carroceria,
					caa.numero_manifiesto, caa.flete, caa.anticipo, caa.numero_manifiesto, 
					caa.pin_tarjeta, caa.clave, caa.estado
				FROM 
					cmx_importacion_actividades cia 
					INNER JOIN cmx_importacion_proyecto cip ON cip.id = cia.id_importacion 
					INNER JOIN cmx_agrupacion_material cam ON cam.id_material_proyecto = cia.id_material
					INNER JOIN cmx_agrupaciones ca ON ca.id = cam.id_agrupamiento
					INNER JOIN cmx_agrupacion_anticipo caa ON caa.id_agrupacion = ca.id
					INNER JOIN cmx_agrupaciones_vehiculos cav ON cav.id_agrupacion = ca.id 
					INNER JOIN cmx_vehiculos cv ON cv.id = cav.id_vehiculo
					INNER JOIN cmx_proveedores cp ON cp.id = cv.id_conductor
					INNER JOIN cmx_tipo_vehiculos ctv ON ctv.id = cv.tipo_vehiculo
				WHERE 
					cia.tipo_actividad = 'seguimiento_ruta' 
					AND cip.numero_importacion = " . $importacion[0] . " 
					AND ca.numero_agrupacion = '" . $agrupamiento . "' 
					AND cav.estado = 'Anticipo Asignado'
					" . $_filtro_grupo . "
			";
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetchAll(PDO::FETCH_ASSOC);
		return $result;
	}
	/******** FIN CONSULTAS DE TIPO DE ACTIVIDAD ANTICIPO **********/

	/******** CONSULTAS DE TIPO DE ACTIVIDAD carga_inicial **********/
	public function getActividadesCargasImpotacion($id_importacion, $grupo)
	{
		$_filtro_grupo = "";
		if ($grupo) {
			$_filtro_grupo = ' AND cia.grupo = ' . $grupo . ' ';
		}
		$sql = "
				SELECT 
					DISTINCT(cts.id_solicitud)
				FROM 
					cmx_importacion_proyecto cip
					INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
					INNER JOIN cmx_integracion_soluc_import cisi ON cisi.id_importacion_actividad = cia.id
					INNER JOIN cmx_solicitudes cs ON cs.id = cisi.id_solucion
					INNER JOIN cmx_tramo_solicitud cts ON cts.id_solicitud = cs.id
				WHERE 
					cip.id = " . $id_importacion . "
					AND cia.tipo_actividad = 'carga_inicial'
					" . $_filtro_grupo . "
			";
		// echo "<p>$sql</p>";
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetchAll(PDO::FETCH_ASSOC);
		return $result;
	}

	public function getTramosCarga($id_solicitud)
	{
		$sql = "
				SELECT 
					cts.*,
					crd.nombre, CONCAT(crd.documento,'-',crd.digito_verificacion) DOCUMENTO,
					crd.contacto
				FROM 
					cmx_tramo_solicitud cts
					INNER JOIN cmx_remitente_destinatario crd ON crd.id = cts.id_remitente_destinatario
				WHERE 
					cts.id_solicitud = " . $id_solicitud . "
					AND cts.tipo_operacion = 'Cargue'
					AND cts.estado = 2;
			";
		// echo "<pre>" . $sql . "</pre>";
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetchAll(PDO::FETCH_ASSOC);
		return $result;
	}

	public function getTramosCargados($id_solicitud)
	{
		$sql = "
				SELECT 
					COUNT(cts.id) CUANTOS
				FROM 
					cmx_tramo_solicitud cts
				WHERE 
					cts.id_solicitud = " . $id_solicitud . "
					AND cts.estado = 1;
			";
		// echo "<pre>" . $sql . "</pre>";
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetch(PDO::FETCH_ASSOC);
		return $result;
	}
	/******** FIN CONSULTAS DE TIPO DE ACTIVIDAD carga_inicial **********/

	/******** CONSULTAS DE TIPO DE ACTIVIDAD seguimiento **********/
	public function getSeguimientoActividad($id_actividad)
	{
		$arrayId_actividad = explode(",", $id_actividad);

		// print_r($arrayId_actividad);

		$sql = "
				SELECT 
					cis.*,
					cu.nom_usuario, cu.url_avatar
				FROM 
					cmx_importacion_seguimiento cis
					INNER JOIN cmx_usuarios cu ON cu.id = cis.autor
				WHERE 
					cis.id_actividad = " . $arrayId_actividad[0] . "
					AND cis.estado = 1
					AND cis.id_seguimiento IS NULL
				ORDER BY cis.fecha_hora DESC;
			";
		// echo "<pre>" . $sql . "</pre>";
		// $result = $this->_db->getConsulta($sql);}
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetchAll(PDO::FETCH_ASSOC);

		$return["seguimientos"] = $result;

		if ($return["seguimientos"]) {
			$arrayComentarios = [];
			foreach ($return["seguimientos"] as $key => $value) {
				$sql = "
						SELECT 
							cis.*,
							cu.nom_usuario, cu.url_avatar
						FROM 
							cmx_importacion_seguimiento cis
							INNER JOIN cmx_usuarios cu ON cu.id = cis.autor
						WHERE 
							cis.id_actividad = " . $arrayId_actividad[0] . "
							AND cis.estado = 1
							AND cis.id_seguimiento = " . $value['id'] . "
						ORDER BY cis.fecha_hora DESC;
					";
				// echo "<pre>" . $sql . "</pre>";
				// $result_01 = $this->_db->getConsulta($sql);
				$result_01 = $this->_db3->prepare($sql);
				$result_01->execute();
				$result_01 = $result_01->fetchAll(PDO::FETCH_ASSOC);

				if ($result_01) {
					foreach ($result_01 as $key_01 => $value_01) {
						$arrayComentarios[$value['id']][] = $value_01;
					}
				}
			}
			$return["comentarios"] = $arrayComentarios;
		}

		return $return;
	}
	/******** FIN CONSULTAS DE TIPO DE ACTIVIDAD seguimiento **********/

	/******** CONSULTAS DE TIPO DE ACTIVIDAD oferta_comercial **********/
	public function getOfertaComercialActividad($id_actividad)
	{
		$arrayId_actividad = explode(",", $id_actividad);
		$sql = '
				SELECT 
					cioc.*, CONCAT(cm.nom_moneda," (",cm.codigo,")") MONEDA,
					cis.estado
				FROM 
					cmx_intr_oferta_comercial cioc
					INNER JOIN cmx_intr_solicitudes cis ON cis.id = cioc.id_intr_proyecto
					INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cis.id_proyecto
					INNER JOIN cmx_monedas cm ON cm.id = cioc.id_moneda
				WHERE 
					cia.id = ' . $arrayId_actividad[0] . '
					AND cioc.estado = 1
			';
		// echo "<pre>" . $sql . "</pre>";
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetchAll(PDO::FETCH_ASSOC);
		$return["oferta_comercial"] = $result;

		$sql = '
				SELECT 
					cico.*,
					CONCAT(cm.nom_moneda," (",cm.codigo,")") MONEDA, cic.nombre,cic.descripcion,
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
					cmx_importacion_actividades cia 
					INNER JOIN cmx_intr_solicitudes cis ON cis.id_proyecto = cia.id_importacion
					INNER JOIN cmx_intr_cotizaciones cico ON cico.id_intr_proyecto = cis.id
					INNER JOIN cmx_monedas cm ON cm.id = cico.id_moneda
					INNER JOIN cmx_intr_conceptos cic ON cic.id = cico.id_concepto
				WHERE 
					cia.id = ' . $arrayId_actividad[0] . '
					-- AND cico.estado != 2
				ORDER BY cico.estado DESC, cico.fecha_cotizacion DESC
			';
		// echo "<pre>" . $sql . "</pre>";
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetchAll(PDO::FETCH_ASSOC);
		$return["cotizaciones"] = $result;
		return $return;
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
				$array[$value["estado"]][$value["id_proveedor"]]["TOTAL"][$value["id_moneda"]]["total_cotizacion"] = (float) $value["valor"];
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
				$array[$value["estado"]][$value["id_proveedor"]]["TOTAL"][$value["id_moneda"]]["total_cotizacion"] += (float) $value["valor"];

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
	/******** FIN CONSULTAS DE TIPO DE ACTIVIDAD oferta_comercial **********/

	/******** CONSULTAS DE TIPO DE ACTIVIDAD seguimiento ruta **********/
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
		$return = $result->fetchAll(PDO::FETCH_ASSOC);
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
					cia.id = ' . $arrayId_actividad[0] . '
					AND cts.tipo_operacion = "Cargue";
			';
		// echo "<pre>" . $sql . "</pre>";
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetch(PDO::FETCH_ASSOC);
		return $result;
	}
	/******** FIN CONSULTAS DE TIPO DE ACTIVIDAD seguimiento ruta **********/

	/******** CONSULTAS DE TIPO DE ACTIVIDAD intr_documentos_envio **********/
	public function getDocumentosEnvio($id_actividad)
	{
		$arrayId_actividad = explode(",", $id_actividad);
		$sql = '
				SELECT 
					cisd.*,
					citd.nombre, citd.descripcion
				FROM 
					cmx_importacion_actividades cia
					INNER JOIN cmx_intr_solicitudes cis ON cis.id_proyecto = cia.id_importacion
					INNER JOIN cmx_intr_solicitud_documentos cisd ON cisd.id_intr_proyecto = cis.id
					INNER JOIN cmx_intr_tipo_documento citd ON citd.id = cisd.id_tipo_documento
				WHERE 
					cia.id = ' . $arrayId_actividad[0] . '
			';
		// echo "<pre>" . $sql . "</pre>";
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetchAll(PDO::FETCH_ASSOC);
		return $result;
	}
	/******** FIN CONSULTAS DE TIPO DE ACTIVIDAD intr_documentos_envio **********/

	/******** CONSULTAS DE TIPO DE ACTIVIDAD intr_instruccion_factura **********/
	public function getIntrInstruccionFactura($id_actividad)
	{
		$arrayId_actividad = explode(",", $id_actividad);
		$id = $arrayId_actividad[0];

		// Información del cliente
		$sql = '
				SELECT 
					cc.*, 
					cm.municipio, cm.depto, cm.pais, cm.rndc_codigo_ciudad
				FROM 
					cmx_importacion_actividades cia
					INNER JOIN cmx_importacion_proyecto cip ON cip.id = cia.id_importacion
					INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
					INNER JOIN cmx_municipios cm ON cm.id = cc.ciudad
				WHERE 
					cia.id = ' . $id . '
			';
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$return = $result->fetch(PDO::FETCH_ASSOC);
		$return["cliente"] = $return;

		// Se buscan las facturas asociadas para el proyecto
		$sql = '
				SELECT cis.id_factura
				FROM cmx_importacion_proyecto cip
					INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
					INNER JOIN cmx_intr_solicitudes cis ON cis.id_proyecto = cip.id
				WHERE 
					cia.id = ' . $id . '
			';
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetch(PDO::FETCH_ASSOC);
		$id_factura = $result['id_factura'];

		// Información de los proyectos facturados con esta actividad
		if ($id_factura) {
			$sql = '
					SELECT 
						cis.id ID_PROYECTO_INTERNACIONAL, cip.id ID_PROYECTO,
						cip.tipo_operacion, cip.numero_importacion, cip.importacion, cip.contenedor,
						ctc.nombre TIPO_CARGA,
						cis.do, cis.tipo_transporte, cis.valor_facturado, cis.valor_agenciamiento,
						cifc.num_proforma, cifc.subtotal, cifc.iva, cifc.retefuente, cifc.total, 
						cifc.num_factura, cifc.fecha FECHA_FACTURA, cifc.fecha_vencimiento, 
						cioc.fecha FECHA_OFERTA, cioc.valor VALOR_OFERTA, cioc.url, cioc.id_moneda ID_MONEDA_OFERTA,
						(	SELECT CONCAT( cm.nom_moneda, " (", cm.codigo, ")" )
							FROM cmx_monedas cm 
							WHERE cm.id = cioc.id_moneda
						) MONEDA_OFERTA,
						cia.id ID_ACTIVIDAD, cia.orden, cia.fecha_hora_inicio, cia.id_importacion, cia.bloque, cia.grupo, cia.simultaneo, cia.tipo_actividad, 
						cia.costo_real, cia.respuesta 
					FROM 
						cmx_importacion_proyecto cip
						INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
						INNER JOIN cmx_tipo_carga ctc ON ctc.id = cip.id_tipo_carga
						INNER JOIN cmx_intr_solicitudes cis ON cis.id_proyecto = cip.id
						INNER JOIN cmx_intr_oferta_comercial cioc ON cioc.id_intr_proyecto = cis.id
						INNER JOIN cmx_intr_factura_cliente cifc ON cifc.id = cis.id_factura
					WHERE 
						cia.tipo_actividad = "intr_factura"
						AND cip.estado = 1
						AND cifc.id = ' . $id_factura . '
						AND cis.estado = 1
				';
			// $result = $this->_db->getConsulta($sql);
			$result = $this->_db3->prepare($sql);
			$result->execute();
			$result = $result->fetchAll(PDO::FETCH_ASSOC);
			$return["proyectos"] = $result;

			if ($result) {
				/***** Datos para el contenido del total de la factura *****/
				// Se busca las trm usadas para la factura
				$sql = '
						SELECT cift.valor, CONCAT(cm.nom_moneda," (",cm.codigo,")") MONEDA
						FROM 
							cmx_importacion_actividades cia
							INNER JOIN cmx_importacion_proyecto cip ON cip.id = cia.id_importacion
							INNER JOIN cmx_intr_solicitudes cis ON cis.id_proyecto = cip.id
							INNER JOIN cmx_intr_factura_trm cift ON cift.id_factura = cis.id_factura
							INNER JOIN cmx_monedas cm ON cm.id = cift.id_moneda
						WHERE cia.id = ' . $id . ';
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
					$arrayDocumentosEnvio[$value['ID_PROYECTO_INTERNACIONAL']] = $this->getDocumentosEnvio_1($value['ID_PROYECTO_INTERNACIONAL']);
					$arrayConceptos[$value['ID_PROYECTO_INTERNACIONAL']] = $this->getConceptosProyecto($value['ID_PROYECTO_INTERNACIONAL']);

					// Se busca los impuestos generados en el proyecto
					$sql = '
							SELECT
								cif.*,
								IF (
									(	SELECT cm1.id
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
								cico.id ID_COTIZACION, cico.proveedor, cico.descripcion, cico.valor_facturado
							FROM 
								cmx_intr_facturas cif
								INNER JOIN cmx_intr_cotizaciones cico ON cico.id_factura = cif.id
								INNER JOIN cmx_intr_conceptos cic ON cic.id = cico.id_concepto
							WHERE
								cico.id_intr_proyecto = ' . $value['ID_PROYECTO_INTERNACIONAL'] . '
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

					// Se busca los impuestos generados en el proyecto
					$sql = '
							SELECT
								cif.*,
								IF (
									(	SELECT cm1.id
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
								cico.id ID_COTIZACION, cico.proveedor, cico.descripcion, cico.valor_facturado
							FROM 
								cmx_intr_facturas cif
								INNER JOIN cmx_intr_cotizaciones cico ON cico.id_factura = cif.id
								INNER JOIN cmx_intr_conceptos cic ON cic.id = cico.id_concepto
							WHERE
								cico.id_intr_proyecto = ' . $value['ID_PROYECTO_INTERNACIONAL'] . '
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
				$arrayFactura["trm"] = $arrayTrm;
				$return["factura"] = $arrayFactura;
			}
		}

		return $return;
	}

	public function getIntrFactura($id_actividad)
	{
		$arrayId_actividad = explode(",", $id_actividad);
		$id = $arrayId_actividad[0];

		// Información del cliente
		$sql = '
				SELECT 
					cc.*, 
					cm.municipio, cm.depto, cm.pais, cm.rndc_codigo_ciudad
				FROM 
					cmx_importacion_actividades cia
					INNER JOIN cmx_importacion_proyecto cip ON cip.id = cia.id_importacion
					INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
					INNER JOIN cmx_municipios cm ON cm.id = cc.ciudad
				WHERE 
					cia.id = ' . $id . ';
			';
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetch(PDO::FETCH_ASSOC);
		$return["cliente"] = $result;

		// Se buscan las facturas asociadas para el proyecto
		$sql = '
				SELECT cifc.*
				FROM cmx_importacion_proyecto cip
					INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
					INNER JOIN cmx_intr_solicitudes cis ON cis.id_proyecto = cip.id
					INNER JOIN cmx_intr_factura_cliente cifc ON cifc.id = cis.id_factura
				WHERE 
					cia.id = ' . $id . '
			';
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetchAll(PDO::FETCH_ASSOC);
		$return["datos_factura"] = $result[0];
		return $return;
	}

	// Función para tomar tramos y materiales de un proyecto 
	public function getTramosMaterialProyecto($id_intr_proyecto)
	{
		$sql = '
				SELECT 
					cit.*,
					cm.municipio,
					CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") CIUDAD,
					crd.*
				FROM 
					cmx_importacion_proyecto cip
					INNER JOIN cmx_intr_solicitudes cis ON cis.id_proyecto = cip.id
					INNER JOIN cmx_intr_tramos cit ON cit.id_intr_proyecto = cis.id
					INNER JOIN cmx_remitente_destinatario crd ON crd.id = cit.id_remitente_destinatario
					INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
				WHERE 
					cis.id = ' . $id_intr_proyecto . '
					AND cip.estado = 1
					AND cis.estado != 0
					AND cit.estado = 1
				ORDER BY cit.tipo_tramo
			';
		// $return["tramos"] = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetchAll(PDO::FETCH_ASSOC);
		$return["tramos"] = $result;

		if ($return["tramos"]) {
			foreach ($return["tramos"] as $key => $value) {
				$sql = '
						SELECT 
							citm.*,
							cue.nom_unidad_empaque
						FROM 
							cmx_intr_tramos cit 
							INNER JOIN cmx_intr_tramo_materiales citm ON citm.id_tramo = cit.id
							INNER JOIN cmx_unidad_empaque cue ON cue.id = citm.id_empaque
						WHERE 
							cit.id = ' . $value['id'] . '
							AND cit.estado = 1
						ORDER BY cit.tipo_tramo
					';
				// $return["material"][$value[0]][] = $this->_db->getConsulta($sql);
				$result = $this->_db3->prepare($sql);
				$result->execute();
				$return["material"][$value['id']][0] = $result->fetchAll(PDO::FETCH_ASSOC);
			}
		}
		return $return;
	}

	// Función para buscar los documentos de envío de materiales en un proyecto internacional 
	public function getDocumentosEnvio_1($id)
	{
		$sql = '
				SELECT 
					cisd.id, cisd.id_intr_proyecto, cis.do, cisd.id_tipo_documento, cisd.soporte_facturacion, citd.nombre, citd.descripcion, 
					MAX(cisd.fecha) FECHA, cisd.url, cisd.estado
				FROM 
					cmx_intr_solicitudes cis
					INNER JOIN cmx_intr_solicitud_documentos cisd ON cisd.id_intr_proyecto = cis.id
					INNER JOIN cmx_intr_tipo_documento citd ON citd.id = cisd.id_tipo_documento
				WHERE
					cisd.id_intr_proyecto = ' . $id . '
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

	// Función para tomar la información de los conceptos de un proyecto 
	public function getConceptosProyecto($id_intr_proyecto)
	{
		// Información de los proyectos pendientes de facturación del cliente
		$sql = '
				SELECT 
					cico.id, cico.id_intr_proyecto, cic.nombre, cico.fecha_cotizacion, cico.valor, CONCAT(cm.nom_moneda," (",cm.codigo,")"), 
					cico.estado, cico.fct_muestra_concepto
				FROM 
					cmx_intr_cotizaciones cico
					INNER JOIN cmx_intr_conceptos cic ON cic.id = cico.id_concepto
					INNER JOIN cmx_monedas cm ON cm.id = cico.id_moneda
				WHERE 
					cico.id_concepto != 11
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
	/******** FIN CONSULTAS DE TIPO DE ACTIVIDAD intr_instruccion_factura **********/
}
