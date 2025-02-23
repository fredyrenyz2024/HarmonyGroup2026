<?php
	class gerenciaModel extends Model
	{
	
		public function __construct(){
			parent::__construct();
		}

		public function tabla_Cotizacion(){
			$sql = '
				SELECT cab.n_cotizacion, cab.nombre_cliente,cab.estado, mer.origen, mer.destino, espe.tipo_servicio, 
				cab.total_transporte, cab.total_cotizacion, cab.tmer_flete, cab.tmer_rent, cab.tmer_utili
				FROM cmx_cotizaciones_serviciocliente cab
				INNER JOIN cmx_detalle_mercancia2 mer
				ON cab.n_cotizacion=mer.n_cotizacion
				LEFT JOIN cmx_detalle_servespecial2 espe
				ON mer.n_cotizacion=espe.n_cotizacion
				WHERE cab.estado_autorizado in("por autorizar", "No autorizado") AND cab.estado in ("F1", "F6") GROUP BY cab.n_cotizacion;';
			$result = $this->_db->getConsulta($sql);//viene de confinguraciones funciones establecidas por defecto para consultas, eliminar, registrar... (getconsuktas SOLO para consultar algo)
			return $result;
		}


		public function tabla_aprobacionflete(){
			$sql="
			SELECT s.id  AS idsubasta, s.fecha_inicio, s.fecha_finaliza,
				so.numer_solservicio, se.num_estudioseguridad, se.placa,
				se.flete_propuesto, se.usuario, se.fecha, se.hora, sef.estado,
				se.id AS idflete, ser.nombre_cliente, se.flete_sugerido,
				ser.n_cotizacion, sef.estado
				FROM cmx_subasta s
				INNER JOIN cmx_subasta_flete se
				ON s.id=se.id_suba
				INNER JOIN cmx_subasta_solicitud_servicio so
				ON se.id_suba_servicio=so.id
				INNER JOIN cmx_estado_subasta_flete sef
				ON se.id=sef.id_suba_flete AND 	sef.estado='pendiente_aprobacion'
				LEFT JOIN cmx_solicitud_vehiculo2  ser
				ON so.numer_solservicio=ser.id	
				";
			$result = $this->_db->getConsulta($sql);
			return $result;
		}

		public function tabla_aprobaciontarifa(){
			$sql="
			SELECT s.id  AS idsubasta, s.fecha_inicio, s.fecha_finaliza,
				so.numer_solservicio, se.num_estudioseguridad, se.placa,
				se.flete_propuesto, se.usuario, se.fecha, se.hora, sef.estado,
				se.id AS idflete, ser.nombre_cliente, se.flete_sugerido,
				ser.n_cotizacion, sef.estado, sef.estado_sac
				FROM cmx_subasta s
				INNER JOIN cmx_subasta_flete se
				ON s.id=se.id_suba
				INNER JOIN cmx_subasta_solicitud_servicio so
				ON se.id_suba_servicio=so.id
				INNER JOIN cmx_estado_subasta_flete sef
				ON se.id=sef.id_suba_flete AND 	sef.estado='pendiente_aprobacion_ge'
				AND sef.estado_sac='no_aprobado_sac'
				LEFT JOIN cmx_solicitud_vehiculo2  ser
				ON so.numer_solservicio=ser.id
				";
			$result = $this->_db->getConsulta($sql);
			return $result;
		}

		//seguimiento ruta
		public function seguimiento_ruta(){
				$sql="
						SELECT r.*, e.id AS med, e.cod_ini_ruta, e.estado, 
					e.actual, e.observacion, e.fecha, e.hora, e.usuario,p.nombre,
					MAX(e.estado) AS ultimo
					FROM cmx_inicio_ruta AS r
					INNER JOIN cmx_inici_manifiesto_estado AS e
					ON r.cod_inicio=e.cod_ini_ruta
					LEFT JOIN cmx_proveedores AS p
					ON p.numero_documento=r.cond_cedula
					WHERE e.estado IN('2','5')
					GROUP BY e.cod_ini_ruta
				";
				$result = $this->_db->getConsulta($sql);
				return $result;
		}

		//anticipos del manifiesto
		public function tabla_aprobacionanticipo(){
			$sql="SELECT man.id,man.placa, man.valor_total_viaje,
			an.valor_anticipo, an.porcentaje, es.estado, an.id as idanticipo
			FROM cmx_manifiesto man INNER JOIN 
			cmx_manifiesto_anticipo an
			ON man.id=an.id_manifiesto
			INNER JOIN cmx_estado_mnf_anticipo es
			ON an.id=es.id_anticipo AND es.estado=2";
			$result = $this->_db->getConsulta($sql);
			return $result;
		}
	

	}
?>