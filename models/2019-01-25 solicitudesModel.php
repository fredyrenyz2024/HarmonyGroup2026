<?php
	class solicitudesModel extends Model
	{
		
		public function __construct(){
			parent::__construct();
		}

		public function getMonedas(){
			$monedas = $this->_db->getConsulta("SELECT * FROM cmx_solicitudes ");
			return $monedas;
		}

		public function getTabla(){
			$monedas = $this->_db->getConsulta("SELECT * FROM cmx_solicitudes ");
			return $monedas;
		}

		public function getHtmlSelect( $name , $id ){

			if ($name) {
				$query = 'SELECT * FROM cmx_monedas cmo';

				// echo $query;
				$array = $this->_db->getConsulta($query);

				// Se recorre contenido de la consulta
				if ($array) {
					// print_r($array);
					$select = '
						<select class="select2 select2-hidden-accessible" name="' . $name . '" id="slct_monedas_'. $id . '" aria-hidden="true">
					';
					$select.= '<option value="" selected disabled>Seleccione</option>';

					foreach ($array['rowsData'] as $key => $value) {

						if ($value[0] == $id) {
							$select.= '<option value="' . $value[0] . '" selected="">' . $value[1] . '</option>';
						}else{
							$select.= '<option value="' . $value[0] . '">' . $value[1] . '</option>';
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

		public function getHtmlSelectMultiple($name,$id){

			if ($name) {
				$query = 'SELECT * FROM cmx_monedas cmo';

				// echo $query;
				$array = $this->_db->getConsulta($query);

				// Se recorre contenido de la consulta
				if ($array) {
					// print_r($array);
					$select = '
						<select class="tags" multiple="multiple" name="' . $name . '" id="slct_monedas_'. $id . '" aria-hidden="true">
					';
					foreach ($array['rowsData'] as $key => $value) {

						if ($value[0] == $id) {
							$select.= '<option value="' . $value[0] . '" selected="">' . $value[1] . '</option>';
						}else{
							$select.= '<option value="' . $value[0] . '">' . $value[1] . '</option>';
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

		/****** CONSULTAS DE ANTICIPOS Y PLANILLAS ******/
		public function getPlanillas(){
			$sql = '
				SELECT 
					ca.*,
					cas.tipo_vehiculo, ctv.nombre TIPO_VEHICULO, ctv.trailer, cv.id ID_VEHICULO, cv.placa_trailer, cav.flete,
					(
						SELECT 
							COUNT(cia1.id)
						FROM 
							cmx_agrupaciones ca1
							INNER JOIN cmx_agrupacion_material cam1 ON cam1.id_agrupamiento = ca1.id
							INNER JOIN cmx_importacion_actividades cia1 ON cia1.id_material = cam1.id_material_proyecto
						WHERE 
							ca1.id = ca.id 
							AND cia1.orden = cia.orden
							AND cia1.estado = cia.estado
					) SUMA_ACTIVIDADES,
					(
						SELECT 
							COUNT(cia1.id)
						FROM 
							cmx_agrupaciones ca1
							INNER JOIN cmx_agrupacion_material cam1 ON cam1.id_agrupamiento = ca1.id
							INNER JOIN cmx_importacion_actividades cia1 ON cia1.id_material = cam1.id_material_proyecto
						WHERE 
							ca1.id = ca.id 
							AND cia1.estado = cia.estado
							AND cia1.orden = cia.orden
							AND cia1.nombre = "Planillar Vehículo"
					) SUMA_ACTIVIDADES_PLANILLAR,
					IF(
						(SELECT 
							COUNT(caa1.id)
						FROM 
							cmx_agrupacion_anticipo caa1
						WHERE 
							caa1.id_agrupacion = ca.id) > 0,
							(SELECT 
								caa1.numero_manifiesto
							FROM 
								cmx_agrupacion_anticipo caa1
							WHERE 
								caa1.id_agrupacion = ca.id),
							NULL
					) MANIFIESTO
				FROM 
					cmx_importacion_proyecto cip
					INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
					INNER JOIN cmx_agrupacion_material cam ON cam.id_material_proyecto = cia.id_material
					INNER JOIN cmx_agrupacion_solicitudes cas ON cas.id_agrupacion = cam.id_agrupamiento
					INNER JOIN cmx_mercancia_solicitud cms ON cms.id_solicitud = cas.id_solicitud AND cms.id = cam.id_material
					INNER JOIN cmx_agrupaciones ca ON ca.id = cas.id_agrupacion
					INNER JOIN cmx_agrupaciones_vehiculos cav ON cas.id_agrupacion = cav.id_agrupacion
					INNER JOIN cmx_vehiculos cv ON cv.id = cav.id_vehiculo
					INNER JOIN cmx_tipo_vehiculos ctv ON ctv.id = cv.tipo_vehiculo
				WHERE 
					cia.estado = 2
					AND cia.nombre = "Planillar Vehículo"
					AND cav.estado = "Aprobado"
					AND cip.estado = 1
				GROUP BY ca.codigo_rojo DESC, ca.fecha_hora_operacion ASC, ca.id ASC
			';
			// echo "<p>" . $sql . "</p>";
			$request = $this->_db->getConsulta($sql);
			return $request;
		}

		public function getDatosPlanillas($id_agrupacion){
			$sql = '
				SELECT 
					*
				FROM 
					cmx_agrupacion_anticipo
				WHERE 
					id_agrupacion = ' . $id_agrupacion . '
			';
			$request = $this->_db->getConsulta($sql);
			return $request;
		}

		public function getSolicitudPlanillas($id){
			$sql = "
				SELECT 
					cs.id,
					CONCAT('<span>',cs.numero_solicitud,'</span><span class= \"\cell-detail-description\"\>(Peso: ',FORMAT(cas.peso_parcial,2),' Kg)<br>','(',cs.origen,' - ',cs.destino,')</span>') as 'numero_solicitud',
					cip.id_tipo_carga,
					IF(cip.id_tipo_carga = 1,
					(
						SELECT 
							ctc1.nombre
						FROM 
							cmx_tipo_contenedor ctc1
						WHERE 
							ctc1.id = cip.tipo_contenedor
					),
					''
					) TIPO_CONTENEDOR,
					IF(cip.id_tipo_carga = 1,
					(
						SELECT 
							ctc1.tara
						FROM 
							cmx_tipo_contenedor ctc1
						WHERE 
							ctc1.id = cip.tipo_contenedor
					),
					''
					) PESO_CONTENEDOR,
					(
						SELECT 
							crd1.id
						FROM 
							cmx_tramo_solicitud cts1
							INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cts1.id_remitente_destinatario
						WHERE 
							cts1.id_solicitud = cs.id
							AND cts1.tipo_operacion = 'Cargue'
					) RNDC_SEDE_REMITENTE,
					IF(
						(
							SELECT 
								crd1.tipo_documento
							FROM 
								cmx_tramo_solicitud cts1
								INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cts1.id_remitente_destinatario
							WHERE 
								cts1.id_solicitud = cs.id
								AND cts1.tipo_operacion = 'Cargue'
						) = 'NIT',
						(
							SELECT 
								CONCAT(crd1.documento,crd1.digito_verificacion)
							FROM 
								cmx_tramo_solicitud cts1
								INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cts1.id_remitente_destinatario
							WHERE 
								cts1.id_solicitud = cs.id
								AND cts1.tipo_operacion = 'Cargue'
						),
						(
							SELECT 
								crd1.documento
							FROM 
								cmx_tramo_solicitud cts1
								INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cts1.id_remitente_destinatario
							WHERE 
								cts1.id_solicitud = cs.id
								AND cts1.tipo_operacion = 'Cargue'
						)
					) RNDC_DOC_REMITENTE,
					(
						SELECT 
							crd1.id
						FROM 
							cmx_tramo_solicitud cts1
							INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cts1.id_remitente_destinatario
						WHERE 
							cts1.id_solicitud = cs.id
							AND cts1.tipo_operacion = 'Descargue'
								ORDER BY cts1.fecha_hora_operacion DESC
								LIMIT 1
					) RNDC_SEDE_DESTINATARIO,
					IF(
						(
							SELECT 
								crd1.tipo_documento
							FROM 
								cmx_tramo_solicitud cts1
								INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cts1.id_remitente_destinatario
							WHERE 
								cts1.id_solicitud = cs.id
								AND cts1.tipo_operacion = 'Descargue'
									ORDER BY cts1.fecha_hora_operacion DESC
									LIMIT 1
						) = 'NIT',
						(
							SELECT 
								CONCAT(crd1.documento,crd1.digito_verificacion)
							FROM 
								cmx_tramo_solicitud cts1
								INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cts1.id_remitente_destinatario
							WHERE 
								cts1.id_solicitud = cs.id
								AND cts1.tipo_operacion = 'Descargue'
									ORDER BY cts1.fecha_hora_operacion DESC
									LIMIT 1
						),
						(
							SELECT 
								crd1.documento
							FROM 
								cmx_tramo_solicitud cts1
								INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cts1.id_remitente_destinatario
							WHERE 
								cts1.id_solicitud = cs.id
								AND cts1.tipo_operacion = 'Descargue'
									ORDER BY cts1.fecha_hora_operacion DESC
									LIMIT 1
						)
					) RNDC_DOC_DESTINATARIO
				FROM 
					cmx_importacion_proyecto cip
					INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
					INNER JOIN cmx_agrupacion_material cam ON cam.id_material_proyecto = cia.id_material
					INNER JOIN cmx_agrupacion_solicitudes cas ON cas.id_agrupacion = cam.id_agrupamiento
					INNER JOIN cmx_mercancia_solicitud cms ON cms.id_solicitud = cas.id_solicitud AND cms.id = cam.id_material
					INNER JOIN cmx_agrupaciones ca ON ca.id = cas.id_agrupacion
					INNER JOIN cmx_solicitudes cs ON cs.id = cas.id_solicitud
				WHERE 
					ca.id = " . $id . "
				GROUP BY cs.id
			";
			$request = $this->_db->getConsulta($sql);
			return $request;
		}

		public function getVehiculoPlanillas($id){
			$sql = "
				SELECT 
					cv.placa, cv.placa_trailer, 
					ctv.nombre, cv.tipo_carroceria,
					(
						SELECT 
							cp.nombre
						FROM 
							cmx_proveedores cp
						WHERE 
							cp.id = cv.id_conductor
					) CONDUCTOR
				FROM 
					cmx_agrupaciones ca
					INNER JOIN cmx_agrupaciones_vehiculos cav ON cav.id_agrupacion = ca.id 
					INNER JOIN cmx_vehiculos cv ON cv.id = cav.id_vehiculo
					INNER JOIN cmx_tipo_vehiculos ctv ON ctv.id = cv.tipo_vehiculo
				WHERE 
					cav.estado = 'Aprobado'
					AND ca.id = " . $id . "
			";
			$request = $this->_db->getConsulta($sql);
			return $request;
		}

		public function getEnumSlctMetodoDesembolso( $name , $id , $value_select ){
			$sql = "
				SHOW COLUMNS FROM 
					cmx_agrupacion_anticipo 
				LIKE 'metodo_desembolso' 
			";
			// echo "<p>" . $sql . "</p>";
			$result = $this->_db->getConsulta($sql);

			foreach ($result["rowsData"] as $key => $value) {
				$value["Type"] = str_replace("enum(", "", $value["Type"]);
				$value["Type"] = str_replace(")", "", $value["Type"]);
				$value["Type"] = str_replace("'", "", $value["Type"]);

				$arrayTipoActividad = explode(",", $value["Type"]);
			}
			// print_r("<pre>");
			// print_r($arrayTipoActividad);
			// print_r("</pre>");

			$select = '
				<select class="select2 select2-hidden-accessible" name="' . $name . '" id="slct_metodo_desembolso_'. $id . '" aria-hidden="true">
			';
			$select.= '<option value="0" disabled selected>Seleccione</option>';
			foreach ( $arrayTipoActividad as $key => $value ) {
				if ($value == $value_select) {
					$select.= '<option value="' . $value . '" selected="">' . $value . '</option>';
				}else{
					$select.= '<option value="' . $value . '">' . $value . '</option>';
				}
			}
			$select.= '</select>';

			return $select;
		}

		public function getEnumSlctPorcentajeAnticipo( $name , $id , $value_select ){
			$sql = "
				SHOW COLUMNS FROM 
					cmx_agrupacion_anticipo 
				LIKE 'porcentaje_anticipo' 
			";
			// echo "<p>" . $sql . "</p>";
			$result = $this->_db->getConsulta($sql);

			foreach ($result["rowsData"] as $key => $value) {
				$value["Type"] = str_replace("enum(", "", $value["Type"]);
				$value["Type"] = str_replace(")", "", $value["Type"]);
				$value["Type"] = str_replace("'", "", $value["Type"]);

				$arrayTipoActividad = explode(",", $value["Type"]);
			}
			// print_r("<pre>");
			// print_r($arrayTipoActividad);
			// print_r("</pre>");

			$select = '
				<select class="select2 select2-hidden-accessible" name="' . $name . '" id="slct_porcentaje_anticipo_'. $id . '" aria-hidden="true">
			';
			$select.= '<option value="0" disabled selected>Seleccione</option>';
			foreach ( $arrayTipoActividad as $key => $value ) {
				if ($value == $value_select) {
					$select.= '<option value="' . $value . '" selected="">' . $value . '%</option>';
				}else{
					$select.= '<option value="' . $value . '">' . $value . '%</option>';
				}
			}
			$select.= '</select>';

			return $select;
		}

		public function getSlctBeneficiario( $name, $id, $id_vehiculo ){
			$sql = '
				SELECT 
					cp.id,
					IF(
						cp.tipo_documento = "NIT",
						CONCAT("Propietario (",cp.numero_documento,"-",cp.digito_verificacion," - ",cp.nombre,")"),
						CONCAT("Propietario (",cp.numero_documento," - ",cp.nombre,")")
					) NOMBRE
				FROM 
					cmx_vehiculos cv
					INNER JOIN cmx_proveedores cp ON cp.id = cv.id_propietario 
				WHERE 
					cv.id = ' . $id_vehiculo . '
				UNION 
				SELECT 
					cp.id,
					IF(
						cp.tipo_documento = "NIT",
						CONCAT("Conductor (",cp.numero_documento,"-",cp.digito_verificacion," - ",cp.nombre,")"),
						CONCAT("Conductor (",cp.numero_documento," - ",cp.nombre,")")
					) NOMBRE
				FROM 
					cmx_vehiculos cv
					INNER JOIN cmx_proveedores cp ON cp.id = cv.id_conductor 
				WHERE 
					cv.id = ' . $id_vehiculo . '
			';
			$request = $this->_db->getConsulta($sql);

			$select = '
				<select class="select2" name="' . $name . '" id="slct_beneficiario_'. $id . '" aria-hidden="true">
			';

			$select.= '<option value="" disabled selected>Seleccione</option>';
			foreach ($request["rowsData"] as $key => $value) {
				$select.= '<option value="' . $value[0] . '">' . $value["NOMBRE"] . '</option>';
			}
			$select.= '</select>';

			return $select;
		}

		public function getTramos( $id ){
			$sql = '
				SELECT 
					cts.id,
					cs.id ID_SOLICITUD,
					cc.nombre NOMBRE_CLIENTE,
					crd.nombre NOMBRE_ORIGEN, crd.direccion,
					cts.tipo_operacion, cts.fecha_hora_operacion,
					CONCAT(cm.municipio," - (",cm.depto," - ",cm.pais,")") CIUDAD,
					cm.rndc_codigo_ciudad RNDC_ID_CIUDAD
				FROM
					cmx_agrupaciones ca
					INNER JOIN cmx_agrupacion_solicitudes cas ON cas.id_agrupacion = ca.id
					INNER JOIN cmx_solicitudes cs ON cs.id = cas.id_solicitud
					INNER JOIN cmx_clientes cc ON cc.id = cs.id_cliente
					INNER JOIN cmx_tramo_solicitud cts ON cts.id_solicitud = cs.id
					INNER JOIN cmx_remitente_destinatario crd ON crd.id = cts.id_remitente_destinatario
					INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
				WHERE
					ca.id = ' . $id . '
					AND cts.estado = 2
				ORDER BY cts.fecha_hora_operacion
			';
			// echo "<p>" . $sql . "</p>";
			$result = $this->_db->getConsulta($sql);

			return $result;
		}

		public function getSlctOrdenTramo( $name , $id , $value_select, $limit, $class){
			$select = '
				<select class="select2 orden_' . $class . '" name="' . $name . '" id="slct_orden_tramo_'. $id . '" aria-hidden="true">
			';
			$select.= '<option value="0" disabled selected>Seleccione</option>';
			for ($i=1; $i <= $limit; $i++) { 
				if ($i == $value_select) {
					$select.= '<option value="' . $i . '" selected="">' . $i . '</option>';
				}else{
					$select.= '<option value="' . $i . '">' . $i . '</option>';
				}
			}
			$select.= '</select>';

			return $select;
		}

		public function getMaterialPlanilla($id){
			$sql = "
				SELECT 
					cam.id, cam.id_material, cam.id_material_proyecto,
					ca.numero_agrupacion,
					cms.tipo_mercancia, cc.nombre, cam.valor_declarado, cam.peso,
					cs.numero_solicitud, cam.numero_remesa, cam.numero_remesa
				FROM 
					cmx_agrupaciones ca
					INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = ca.id
					INNER JOIN cmx_mercancia_solicitud cms ON cms.id = cam.id_material
					INNER JOIN cmx_solicitudes cs ON cs.id = cms.id_solicitud
					INNER JOIN cmx_clientes cc ON cc.id = cs.id_cliente
				WHERE 
					ca.id = " . $id . "
			";
			$request = $this->_db->getConsulta($sql);
			return $request;
		}

		public function getContenedorPlanilla($id){
			$sql = "
				SELECT 
					DISTINCT(cs.id), cip.devolucion, CONCAT(cip.contenedor,' (',ctc.nombre,')') CONTENEDOR, 
					cip.numero_remesa, ctc.tara, ctc.tamano,
					CONCAT(cc.documento,cc.digito_verificacion) DOCUMENTO_CLIENTE, cc.nombre NOMBRE_CLIENTE,
					cs.numero_solicitud
				FROM
					cmx_importacion_proyecto cip
					INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
					INNER JOIN cmx_mercancia_solicitud cms ON cms.id_material_proyecto = cia.id_material
					INNER JOIN cmx_agrupacion_material cam ON cam.id_material_proyecto = cia.id_material
					INNER JOIN cmx_tipo_contenedor ctc ON ctc.id = cip.tipo_contenedor
					INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
					INNER JOIN cmx_solicitudes cs ON cs.id = cms.id_solicitud
				WHERE
					cam.id_agrupamiento = " . $id . "
					AND cip.devolucion = 1
			";

			$request = $this->_db->getConsulta($sql);
			return $request;
		}

		public function getMaterialProyecto($id, $origen){
			$sql = "
				SELECT 
					ca.id ID_AGRUPACION,
					cam.orden_actividad,
					cia.*
				FROM 
					cmx_agrupaciones ca
					INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = ca.id
					INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cam.id_material_proyecto
				WHERE 
					ca.id = " . $id . "
					AND cia.estado = 2
					AND cia.nombre = '" . $origen . "';
			";
			// print_r("<p>" . $sql . "</p>");
			$request = $this->_db->getConsulta($sql);
			// print_r("<pre>");
			// print_r($request);
			// print_r("</pre>");

			$i = 0;
			$return = "";
			if( $request ){
				foreach ($request["rowsData"] as $key => $value) {
					$_flag_actividad = false;

					$arrayActividadesBloque = explode(",", $value["orden_actividad"] );
					foreach ($arrayActividadesBloque as $key_01 => $value_01) {
						if ($value["orden"] == $value_01) {
							$_flag_actividad = true;
							break;
						}
					}

					if ($_flag_actividad) {
						$return.= '
							<input type="hidden" id="id_' . $id . '_' . $i . '" value="' . $value["id"] . '" class="form-control">
							<input type="hidden" id="id_importacion_' . $id . '_' . $i . '" value="' . $value["id_importacion"] . '" class="form-control">
							<input type="hidden" id="id_material_' . $id . '_' . $i . '" value="' . $value["id_material"] . '" class="form-control">
							<input type="hidden" id="orden_' . $id . '_' . $i . '" value="' . $value["orden"] . '" class="form-control">
							<input type="hidden" id="tipo_actividad_' . $id . '_' . $i . '" value="' . $value["tipo_actividad"] . '" class="form-control">
							<input type="hidden" id="fecha_hora_inicio_' . $id . '_' . $i . '" value="' . $value["fecha_hora_inicio"] . '" class="form-control">
							<input type="hidden" id="costo_real_' . $id . '_' . $i . '" value="' . $value["costo_real"] . '" class="form-control">
							<input type="hidden" id="respuesta_' . $id . '_' . $i . '" value="' . $value["respuesta"] . '" class="form-control">
						';
						$i++;
					}
				}
				$return.= '
					<input type="hidden" id="cant_materiales_' . $id . '" value="' . $i . '" class="form-control">
				';
			}
			return $return;
		}

		public function getAnticipos(){
			$sql = '
				SELECT 
					cag.*, cags.tipo_vehiculo, 
					ctv.nombre TIPO_VEHICULO, 
					cav.flete, 
					IF(
						(SELECT 
							COUNT(cv1.id)
						FROM
							cmx_vehiculos cv1
						WHERE 
							cv1.id_propietario = caa.beneficiario
							AND cv1.id = cav.id_vehiculo) > 0,
						"Propietario",
						"Conductor"
					) BENEFICIARIO,
					IF(
						(SELECT 
							COUNT(cv1.id)
						FROM
							cmx_vehiculos cv1
						WHERE 
							cv1.id_propietario = caa.beneficiario
							AND cv1.id = cav.id_vehiculo) > 0,
						(
							SELECT 
								IF(
									cp1.tipo_documento = "NIT",
									CONCAT(cp1.numero_documento,"-",cp1.digito_verificacion),
									cp1.numero_documento
								)
							FROM 
								cmx_proveedores cp1
								INNER JOIN cmx_vehiculos cv2 ON cv2.id_propietario = cp1.id
							WHERE 
								cp1.id = caa.beneficiario
								AND cv2.id = cav.id_vehiculo
						),
						(
							SELECT 
								IF(
									cp1.tipo_documento = "NIT",
									CONCAT(cp1.numero_documento,"-",cp1.digito_verificacion),
									cp1.numero_documento
								)
							FROM 
								cmx_proveedores cp1
								INNER JOIN cmx_vehiculos cv2 ON cv2.id_conductor = cp1.id
							WHERE 
								cp1.id = caa.beneficiario
								AND cv2.id = cav.id_vehiculo
						)
					) DOCUMENTO_BENEFICIARIO,
					IF(
						(SELECT 
							COUNT(cv1.id)
						FROM
							cmx_vehiculos cv1
						WHERE 
							cv1.id_propietario = caa.beneficiario
							AND cv1.id = cav.id_vehiculo) > 0,
						(
							SELECT 
								cp1.nombre
							FROM 
								cmx_proveedores cp1
								INNER JOIN cmx_vehiculos cv2 ON cv2.id_propietario = cp1.id
							WHERE 
								cp1.id = caa.beneficiario
								AND cv2.id = cav.id_vehiculo
						),
						(
							SELECT 
								cp1.nombre
							FROM 
								cmx_proveedores cp1
								INNER JOIN cmx_vehiculos cv2 ON cv2.id_conductor = cp1.id
							WHERE 
								cp1.id = caa.beneficiario
								AND cv2.id = cav.id_vehiculo
						)
					) NOMBRE_BENEFICIARIO
				FROM 
					cmx_agrupaciones cag
					INNER JOIN cmx_agrupacion_solicitudes cags ON cag.id = cags.id_agrupacion
					INNER JOIN cmx_agrupaciones_vehiculos cav ON cag.id = cav.id_agrupacion
					INNER JOIN cmx_tipo_vehiculos ctv ON ctv.id = cags.tipo_vehiculo
					INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = cag.id
					INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cam.id_material_proyecto
					INNER JOIN cmx_importacion_proyecto cip ON cip.id = cia.id_importacion
					INNER JOIN cmx_agrupacion_anticipo caa ON caa.id_agrupacion = cag.id
				WHERE 
					cav.estado = "Planillado"
					AND cia.estado = 2
					AND cia.nombre = "Generar Anticipo"
					AND cip.estado = 1
				GROUP BY 
					cag.codigo_rojo DESC, cag.fecha_hora_operacion ASC, cag.id ASC;
			';
			$request = $this->_db->getConsulta($sql);
			return $request;
		}

		public function getDatosAnticipo($id_agrupacion){
			$sql = '
				SELECT 
					*
				FROM 
					cmx_agrupacion_anticipo
				WHERE 
					id_agrupacion = ' . $id_agrupacion . '
			';
			$request = $this->_db->getConsulta($sql);
			return $request;
		}

		public function getSolicitudAnticipos($id){
			$sql = "
				SELECT 
                    CONCAT('<span>',cs.numero_solicitud,'</span><span class= \"\cell-detail-description\"\>(Peso: ',FORMAT(cas.peso_parcial,2),' Kg)<br>','(',cs.origen,' - ',cs.destino,')</span>') as 'numero_solicitud'
				FROM 
					cmx_solicitudes cs
					INNER JOIN cmx_agrupacion_solicitudes cas ON cs.id = cas.id_solicitud
					INNER JOIN cmx_agrupaciones ca ON cas.id_agrupacion = ca.id
				WHERE 
					ca.id = " . $id . "
				GROUP BY cs.id
			";
			$request = $this->_db->getConsulta($sql);
			return $request;
		}

		public function getVehiculoAnticipos($id){
			$sql = "
                SELECT 
                    cv.placa, cv.placa_trailer, 
                    ctv.nombre, cv.tipo_carroceria,
                    (
                        SELECT 
                            cp.nombre
                        FROM 
                            cmx_proveedores cp
                        WHERE 
                            cp.id = cv.id_conductor
                    ) CONDUCTOR
                FROM 
                    cmx_agrupaciones ca
                    INNER JOIN cmx_agrupaciones_vehiculos cav ON cav.id_agrupacion = ca.id 
                    INNER JOIN cmx_vehiculos cv ON cv.id = cav.id_vehiculo
                    INNER JOIN cmx_tipo_vehiculos ctv ON ctv.id = cv.tipo_vehiculo
                WHERE 
                    cav.estado = 'Planillado'
					AND ca.id = " . $id . "
			";
			$request = $this->_db->getConsulta($sql);
			return $request;
		}
		/****** FIN CONSULTAS DE ANTICIPOS Y PLANILLAS ******/

		/****** CONSULTAS DE LISTA DE ANTICIPOS PARA EXCEL ******/
		public function getAnticiposExcel($descargado){
			$_filter = "";
			if ( $descargado == "0" ) {
				$_filter = ' AND cada.descargado = ' . $descargado;
			}

			$sql = '
				SELECT 
					ca.id ID_AGRUPACION, caa.numero_manifiesto, caa.flete, caa.anticipo,
					cp.numero_documento, cp.digito_verificacion, cp.nombre, cada.descargado
				FROM 
					cmx_agrupaciones ca
					INNER JOIN cmx_agrupacion_anticipo caa ON caa.id_agrupacion = ca.id
					INNER JOIN cmx_agrupaciones_vehiculos cav ON cav.id_agrupacion = ca.id
					INNER JOIN cmx_vehiculos cv ON cv.id = cav.id_vehiculo
					INNER JOIN cmx_proveedores cp ON cp.id = cv.id_conductor
					INNER JOIN cmx_agrupacion_descarga_anticipos cada ON cada.id_agrupamiento = ca.id
				WHERE 
					cav.estado IN ("Planillado","Anticipo Asignado")
					' . $_filter . '
			';
			$request = $this->_db->getConsulta($sql);

			return $request;
		}
		/****** FIN CONSULTAS DE LISTA DE ANTICIPOS PARA EXCEL ******/

		/****** CONSULTAS DE DASHBOARD ******/
		public function getSolicitudesPendientes(){
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
					cip.estado = 1
				HAVING ACTIVIDADES_INICIADAS = 0
			";
			$request = $this->_db->getConsulta($sql);
			return $request;
		}

		public function getProyectosIniciados(){
			$sql = "
				SELECT 
					COUNT(DISTINCT(cip.numero_importacion))
				FROM 
					cmx_importacion_proyecto cip 
					INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
				WHERE 
					cia.estado = 2
					AND cip.estado = 1
				GROUP BY cip.numero_importacion;
			";
			$result = $this->_db->getConsulta($sql);
			return $result;
		}

		public function getMaterialPendiente(){
			$sql = "
				SELECT 
					cip.numero_importacion NUM_ORDEN, cc.nombre CLIENTE,
					cs.origen ORIGEN, CONCAT(cm_origen.municipio,' (',cm_origen.depto,' - ',cm_origen.pais,')') CIUDAD_ORIGEN,
					crd.nombre DESTINO, CONCAT(cm.municipio,' (',cm.depto,' - ',cm.pais,')') CIUDAD_DESTINO,
					cms.tipo_mercancia MATERIAL,
					IF (
						(   SELECT cav1.id 
							FROM cmx_agrupaciones_vehiculos cav1 
							INNER JOIN cmx_agrupacion_material cam1 ON cam1.id_agrupamiento = cav1.id_agrupacion
							WHERE cam1.id_material_proyecto = cim.id
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
					INNER JOIN cmx_remitente_destinatario crd_origen ON crd_origen.nombre = cs.origen
					INNER JOIN cmx_municipios cm_origen ON cm_origen.id = crd_origen.id_ciudad
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
					AND cip.estado = 1
				HAVING HAY_VEHICULO_ASIGNADO = 'MOSTRAR'
			";
			$result = $this->_db->getConsulta($sql);
			return $result;
		}
		/****** FIN CONSULTAS DE DASHBOARD ******/

        /********** CONSULTAS MÓDULO ENTUNAMIENTOS **********/
		public function getTurnos(){
			$sql = '
				SELECT 
					DATEDIFF( NOW() , cae.fecha_ubicacion ) DIAS,
					cp.id ID_PROVEEDOR, cv.id ID_VEHICULO, cae.id ID_TURNO, cae.estado, 
					IF(
						(SELECT 
							COUNT(cae1.id)
						FROM
							cmx_app_enturnamientos cae1
						WHERE 
							cae1.id_conductor = cv.id_conductor
							AND cae1.estado = "ENTURNADO"
							AND DATEDIFF( NOW() , cae1.fecha_ubicacion ) < 4
						) > 0,
						(SELECT 
							(SELECT 
								COUNT(cae2.id)
							FROM 
								cmx_app_enturnamientos cae2
							WHERE 
								cae2.fecha_ubicacion <= cae1.fecha_ubicacion
								AND cae2.estado = "ENTURNADO"
								AND DATEDIFF( NOW() , cae2.fecha_ubicacion ) < 4
							) CUANTOS
						FROM 
							cmx_app_enturnamientos cae1
						WHERE 
							cae1.id_conductor = cv.id_conductor
							AND cae1.estado = "ENTURNADO"
							AND DATEDIFF( NOW() , cae1.fecha_ubicacion ) < 4
						),
						"N/A"
					) TURNO,
					cp.numero_documento, cp.nombre, cp.direccion, cp.contacto,
					cae.observacion, cae.latitud, cae.longitud
				FROM 
					cmx_proveedores cp
					INNER JOIN cmx_vehiculos cv ON cp.id = cv.id_conductor
					INNER JOIN cmx_app_enturnamientos cae ON cae.id_conductor = cv.id_conductor
				WHERE 
					cp.estado = "Activo"
					AND cv.estado = "Activo"
				GROUP BY TURNO, cae.estado
				HAVING DIAS < 4
				ORDER BY cae.fecha_ubicacion, cae.estado
            ';
			$result = $this->_db->getConsulta($sql);
			return $result;
        }
        /********** FIN CONSULTAS MÓDULO ENTUNAMIENTOS **********/

	}

    class Solicitudes{

        public $user_log;
        public $pass;
        public $mensaje;
        public $respuesta;
        public $email;
        public $listado;

        public function ObtenerclientesUsuario()
        {
            $model    = new Conexion;
            $conexion = $model->conectar();
            $sql      = "   SELECT id, nombre FROM cmx_clientes ";
            $consulta = $conexion->prepare($sql);
            $consulta->execute();
            $total         = $consulta->rowCount();
            $this->mensaje = $total;
            if ($total == 0) {
                $this->respuesta = "BAD";
            } else {
                $this->respuesta = "GOOD";
                while ($datos_clientes = $consulta->fetch()) {
                        $this->listado[] = $datos_clientes;
                }
            }
        }

        public function crearSolicitud (){
            $cliente = $_POST["cliente"];
            $origen = $_POST["origen"];
            $destino = $_POST["destino"];
            $orden_compra = $_POST["orden_compra"];
            $tipo_operacion = $_POST["tipo_operacion"];
            $tipo_vehiculo = $_POST["tipo_vehiculo"];
            $num_importacion = $_POST["num_importacion"];
            $num_exportacion = $_POST["num_exportacion"];
            $numero_bl = $_POST["num_bl"];
            $tipo_vehiculo = $_POST["tipo_vehiculo"];
            $numero_solicitud = "SLC-".time();
            $id_usuario = $_SESSION["usuario"]["id_usuario"];
            $mercancia = $_POST["mercancia"];
            $tramos = $_POST["tramos"];
            $adicionales = $_POST["adicionales"];
            $model    = new Conexion;
            $conexion = $model->conectar();
            $sql      = " INSERT INTO cmx_solicitudes (id_cliente,numero_solicitud, origen,destino,tipo_operacion,numero_orden,numero_exportacion,numero_importacion, numero_bl,tipo_vehiculo, fecha_solicitud,estado)
                VALUES ($cliente,'$numero_solicitud','$origen','$destino','$tipo_operacion','$orden_compra','$num_exportacion','$num_importacion','$numero_bl','$tipo_vehiculo',NOW(),'Activa')";
            $crear_solicitud = $conexion->prepare($sql);
            $result=$crear_solicitud->execute();
            if ($result) {
                $sql      = " INSERT INTO cmx_usuario_solicitud (id_solicitud, id_usuario, operacion, fecha_hora_operacion) VALUES ((SELECT MAX(id) FROM cmx_solicitudes),$id_usuario,'Crear',NOW()) ";
                $crear_oper_sol = $conexion->prepare($sql);
                $result=$crear_oper_sol->execute();

                for ($i=0;$i< count($mercancia);$i++){
                    $sql      = " INSERT INTO cmx_mercancia_solicitud (id_solicitud, tipo_mercancia, tara_contenedor, peso_total, unidades, valor_declarado, tipo_movilizacion) VALUES ((SELECT MAX(id) FROM cmx_solicitudes),'".$mercancia[$i]["tipo_mercancia"]."','".$mercancia[$i]["tara_contenedor"]."','".$mercancia[$i]["peso_total"]."','".$mercancia[$i]["unidades"]."','".$mercancia[$i]["valor_declarado"]."','".$mercancia[$i]["tipo_movilizacion"]."')";
                    $crear_mercancia = $conexion->prepare($sql);
                    $resultmercancia = $crear_mercancia->execute();   
                }
                for ($i=0;$i< count($tramos);$i++){
                    if ($tramos[$i]["sumaflete"] == 'true'){
                        $tramos[$i]["sumaflete"]= '1';
                    }
                    else if ($tramos[$i]["sumaflete"] == 'false'){
                        $tramos[$i]["sumaflete"]= '0';
                    }
                    if ($tramos[$i]["personal"] == 'true'){
                        $tramos[$i]["personal"]= '1';
                    }
                    else if ($tramos[$i]["personal"] == 'false'){
                        $tramos[$i]["personal"]= '0';
                    }
                    if($tramos[$i]["id_remitente_destinatario"] == ""){
                        $sql = "INSERT INTO cmx_remitente_destinatario (id_cliente,direccion, nombre,contacto ) VALUES ($cliente,'".$tramos[$i]["direccion"]."','".$tramos[$i]["remitente_destinatario"]."','".$tramos[$i]["contacto"]."')";
                        $crear_remitente = $conexion->prepare($sql);
                        $resultremitente = $crear_remitente->execute();  

                        $sql      = "INSERT INTO cmx_tramo_solicitud (id_solicitud,id_remitente_destinatario,fecha_hora_operacion,tipo_operacion,peso,unidades,valor_venta,valor_compra,personal,suma_flete) VALUES ((SELECT MAX(id) FROM cmx_solicitudes),(SELECT MAX(id) FROM cmx_remitente_destinatario),'".$tramos[$i]["fecha_hora_tramo"]."','".$tramos[$i]["tipo_tramo"]."','".$tramos[$i]["peso_tramo"]."','".$tramos[$i]["unidades_tramo"]."','".$tramos[$i]["valor_venta_tramo"]."','".$tramos[$i]["valor_compra_tramo"]."','".$tramos[$i]["personal"]."','".$tramos[$i]["sumaflete"]."')";
                        $crear_tramo = $conexion->prepare($sql);
                        $resulttramo = $crear_tramo->execute(); 
                    }
                    else{
                        $sql      = "INSERT INTO cmx_tramo_solicitud (id_solicitud,id_remitente_destinatario,fecha_hora_operacion,tipo_operacion,peso,unidades,valor_venta,valor_compra,personal,suma_flete) VALUES ((SELECT MAX(id) FROM cmx_solicitudes),".$tramos[$i]["id_remitente_destinatario"].",'".$tramos[$i]["fecha_hora_tramo"]."','".$tramos[$i]["tipo_tramo"]."','".$tramos[$i]["peso_tramo"]."','".$tramos[$i]["unidades_tramo"]."','".$tramos[$i]["valor_venta_tramo"]."','".$tramos[$i]["valor_compra_tramo"]."','".$tramos[$i]["personal"]."','".$tramos[$i]["sumaflete"]."')";
                        $crear_tramo = $conexion->prepare($sql);
                        $resulttramo = $crear_tramo->execute(); 
                    }
                }
                for ($i=0;$i< count($adicionales);$i++){
                    $sql      = " INSERT INTO cmx_servicio_adicional_tramo (id_solicitud, tipo_servicio, valor_venta,valor_compra) VALUES ((SELECT MAX(id) FROM cmx_solicitudes),'".$adicionales[$i]["tipo_servicio"]."','".$adicionales[$i]["valor_venta"]."','".$adicionales[$i]["valor_compra"]."')";
                    $crearservicio = $conexion->prepare($sql);
                    $resultadicionales = $crearservicio->execute();   
                }  
                $return["content"] = $sql;
                $return["success"]= true;
            } else {
                $return['success'] = false;
                $return['error'] = "Error al generar la solicitud";
            }
            return $return;
        }

        public function listarSolicitudes (){
            $id_usuario = $_SESSION["usuario"]["id_usuario"];
            $model    = new Conexion;
            $conexion = $model->conectar();
            $sql = "
                SELECT 
                    csol.id as 'id_solicitud',csol.*,cc.nombre as 'nombre_cliente', cip.numero_importacion,
                    ((
                        SELECT SUM(cms.peso_total) 
                        FROM cmx_mercancia_solicitud cms 
                        WHERE cms.id_solicitud = csol.id)+csol.tara_contenedor) as 'peso_total_solicitud'
                FROM 
                    cmx_solicitudes csol
                    INNER JOIN cmx_integracion_soluc_import cisi ON cisi.id_solucion = csol.id
                    INNER JOIN cmx_importacion_actividades cia ON cia.id = cisi.id_importacion_actividad
                    INNER JOIN cmx_importacion_proyecto cip ON cip.id = cia.id_importacion
                    INNER JOIN cmx_clientes cc ON cc.id = csol.id_cliente
                WHERE 
                    csol.estado != 'En proceso'
                GROUP BY csol.id 
                ORDER BY csol.fecha_solicitud ASC
            ";
            $consulta = $conexion->prepare($sql);
            $consulta->execute();
            $total         = $consulta->rowCount();
            $this->mensaje = $total;
            if ($total == 0) {
                $this->respuesta = "BAD";
            } else {
                $this->respuesta = "GOOD";
                while ($datos_solicitudes = $consulta->fetch()) {
                    if($datos_solicitudes["tipo_vehiculo"]== ""){
                        $datos_solicitudes["tipo_vehiculo"] = "";
                    }
                    else{
                        $sql      = " SELECT * FROM cmx_tipo_vehiculos WHERE id = ".$datos_solicitudes["tipo_vehiculo"]." LIMIT 1";
                        $consulta_vehiculo = $conexion->prepare($sql);
                        $consulta_vehiculo->execute();
                        $total_vehiculo = $consulta_vehiculo->rowCount();
                        $datos_vehiculo = $consulta_vehiculo->fetch();
                        
                        if($total_vehiculo == 0){
                            $datos_solicitudes["tipo_vehiculo"]="";
                        }
                        else{
                            $datos_solicitudes["tipo_vehiculo"]=$datos_vehiculo["nombre"];
                        }
                        
                    }
                    $this->listado[] = $datos_solicitudes;
                }
            }   
        }
    }
?>
