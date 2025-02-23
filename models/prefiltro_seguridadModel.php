<?php
	class prefiltro_seguridadModel extends Model
	{
	
		public function __construct(){
			parent::__construct();
		}

		public function getsolicitud(){
			$sql = '
				SELECT csv.id, csv.tipo_vehiculo ,clv.placa ,cv.estado as ev, clv.estado FROM cmx_solicitud_vehiculo2 csv
				INNER JOIN cmx_log_solicitudvehiculo clv
				INNER JOIN cmx_vehiculos cv
				ON csv.id=clv.id_solictud AND clv.placa=cv.placa
			';
			$result = $this->_db->getConsulta($sql);//viene de confinguraciones funciones establecidas por defecto para consultas, eliminar, registrar... (getconsuktas SOLO para consultar algo)
			return $result;
			}


		public function getestudio(){
			$sql = "
				SELECT csv.id, csv.tipo_vehiculo ,clv.estado_ruta,clv.placa ,cv.estado AS ev,
 				clv.estado,cv.id_conductor,cv.id AS 'idvehi', csv.id AS 'idsoli',
 				tv.nombre
				 FROM cmx_solicitud_vehiculo2 csv
				 INNER JOIN cmx_para_tipo_vehiculo tv
				 ON csv.tipo_vehiculo=tv.id
				 INNER JOIN cmx_preestudio_solicitudes_servicio sp
				 ON csv.id=sp.id_servicio_cliente
				INNER JOIN cmx_log_solicitudvehiculo2 clv
				INNER JOIN cmx_vehiculos cv
				ON sp.id_solicitudpreestudio=clv.id_solictud AND clv.placa=cv.placa
				ORDER BY clv.fecha_asignacion, clv.hora_asignacion DESC
				";

			// 	$sql = "
			// 	SELECT csv.id, csv.tipo_vehiculo ,clv.placa ,cv.estado as ev, clv.estado,cv.id_conductor,cv.id as 'idvehi', csv.id as 'idsoli'
			// 	 FROM cmx_solicitud_vehiculo2 csv
			// 	INNER JOIN cmx_log_solicitudvehiculo clv
			// 	INNER JOIN cmx_vehiculos cv
				
			// ";


			$result = $this->_db->getConsulta($sql);//viene de confinguraciones funciones establecidas por defecto para consultas, eliminar, registrar... (getconsuktas SOLO para consultar algo)
			return $result;
			}	

			public function estadoestudio($id_solicitud){
				$id_solicitu=$id_solicitud;
				$sql='SELECT ec.estado,ee.id_solicitud FROM 
					cmx_estudio_vehiculo ee
					INNER JOIN cmx_estudiov_completo ec			
					ON ee.id=ec.id_estudio			
					WHERE ee.id_solicitud='.$id_solicitu.'
					 AND NOT estado="iniciado"  ';
				$result = $this->_db->getConsulta($sql);	
				return $result;
			}

			public function num_estudio(){
			$sql='SELECT id AS nco 
			FROM cmx_estudio_vehiculo;';
			$result=$this->_db->getConsulta($sql);
			return $result;
			}

			//METODOS PARA E PREESTUDIO
			public function getTabla_principal(){
				/*$sql="SELECT v.*, s.id as id_sol ,s.fecha, s.hora, s.usuario, e.estado, e.estado_actual
						FROM  cmx_vehiculos_preestudio v
						LEFT JOIN cmx_referencias_preestudio r
						ON v.id=r.id_conductor
						INNER JOIN cmx_solicitudes_preestudio s
						ON v.id=s.id_preestudio
						INNER JOIN cmx_solicitudes_estados e
						ON s.id=e.id_solicitud
						WHERE e.estado IN('Pendiente','iniciado','rechazado para modificar')
						and e.estado_actual=1
						GROUP BY v.id";*/

				$sql="SELECT v.*, s.id as id_sol ,s.fecha, s.hora, s.usuario, e.estado, e.estado_actual
						FROM  cmx_vehiculos_preestudio v
						INNER JOIN cmx_solicitudes_preestudio s
						ON v.id=s.id_preestudio
						INNER JOIN cmx_solicitudes_estados e
						ON s.id=e.id_solicitud
						WHERE e.estado IN('Pendiente','iniciado','rechazado para modificar')
						and e.estado_actual=1
						GROUP BY v.id";		
				$result=$this->_db->getConsulta($sql);
				return $result;
			}

			public function consultar_v_preestudio(){
				$sql="
				SELECT a.*
				FROM cmx_vehiculos_preestudio a
				";
				$result=$this->_db->getConsulta($sql);
				return $result;
			}





		}
?>