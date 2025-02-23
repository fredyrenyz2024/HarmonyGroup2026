<?php
class prefiltro_nacionalModel extends Model
{

	public function __construct()
	{
		parent::__construct();
	}

	public function getasignarvehiculo($id_usuario, $filtro, $fecha_inicial, $fecha_final)
	{
		$response = [];
		if ($filtro === "todos") {
			/* Se cambia la de tabla de donde se saca el el estado par controlar las solicitudes de servicio l.estado por csv.estado */
			$sql_datos = $this->_db3->prepare('SELECT g.item,g.tipo_mercancia,g.flete,g.peso_neto_tn,csv.estado AS esoli,csv.nundoc_solicitud AS elid, csv.fecha,csv.hora, csv.origen, csv.destino, csv.tipo_vehiculo, csv.estado,csv.idpareja_origen_destino, csv.fecha, csv.hora,
						pp.nombre, g.id AS idnegocio,csv.peso_kg,CONCAT (M.municipio,"-",M.depto) AS origen_solicitud,CONCAT(M2.municipio,"-",M2.depto) AS destino_solicitud,
							csc.* ,csv.cant_vehiculo, csv.cant_disponible,g.tipo_servicio_mer,g.peso_bruto_kg,g.total_tarifa,M.rndc_codigo_ciudad AS origen_rndc,g.itr,csv.nundoc_solicitud
							FROM cmx_cotizaciones_serviciocliente AS csc
							INNER JOIN cmx_solicitud_vehiculo2 csv 	ON csc.n_cotizacion=csv.n_cotizacion
							LEFT JOIN cmx_log_solicitudvehiculo l ON csv.nundoc_solicitud=l.id_solictud
							INNER JOIN cmx_detalle_mercancia2 g ON csv.idpareja_origen_destino=g.id
							INNER JOIN cmx_para_tipo_vehiculo pp ON csv.tipo_vehiculo=pp.id
							INNER JOIN cmx_agencia_usuario uno ON csv.agencia=uno.id_agencia
							INNER JOIN cmx_municipios M ON csv.origen=M.rndc_codigo_ciudad
							INNER JOIN cmx_municipios M2 ON csv.destino=M2.rndc_codigo_ciudad
							WHERE csv.estado IN("Pendiente","Realizada","En_subasta","asignada","en_tramite","aprobado_prefiltro") 
							AND csc.estado="F3" AND estado_autorizado="autorizado" AND uno.id_usuario=' . $id_usuario . ' AND uno.estado="Activo" AND csv.fecha BETWEEN "' . $fecha_inicial . '" AND "' . $fecha_final . '" 
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
		} else {
			/* Se cambia la de tabla de donde se saca el el estado par controlar las solicitudes de servicio l.estado por csv.estado */
			$sql_datos = $this->_db3->prepare('SELECT g.item,g.tipo_mercancia,g.flete,g.peso_neto_tn,csv.estado AS esoli,csv.nundoc_solicitud AS elid, csv.fecha,csv.hora, csv.origen, csv.destino, csv.tipo_vehiculo, csv.estado,csv.idpareja_origen_destino, csv.fecha, csv.hora,
							pp.nombre, g.id AS idnegocio,csv.peso_kg, CONCAT (M.municipio,"-",M.depto) AS origen_solicitud,CONCAT(M2.municipio,"-",M2.depto) AS destino_solicitud,csc.*,csv.cant_vehiculo, csv.cant_disponible,
								g.tipo_servicio_mer,g.peso_bruto_kg,g.total_tarifa,	M.rndc_codigo_ciudad AS origen_rndc,g.itr,csv.nundoc_solicitud
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

		return $response;
	}

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


	/*********** FIN - FUNCIONES PARA LA CREACIÓN DE SELECTS **********/
}
