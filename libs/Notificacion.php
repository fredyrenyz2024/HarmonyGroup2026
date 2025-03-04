<?php
	include("../application/Config.php");
	date_default_timezone_set('America/Bogota');

	class Notificacion {

		public $user_log;
		public $listado;
		public $respuesta;

		public function notificar() {
			$model = new Conexion;
			$conexion = $model->conectar();
			$sql = "
				SELECT 
					cia.*,
					cip.numero_importacion, 
					TIMESTAMPDIFF(MINUTE, cia.fecha_hora_inicio, now()) as 'diferencia' 
				FROM 
					cmx_importacion_actividades cia
					INNER JOIN cmx_importacion_proyecto cip ON cip.id = cia.id_importacion
					INNER JOIN cmx_usuario_cliente cuc ON cuc.id_perfil = cia.perfil_responsable
					INNER JOIN cmx_clientes_serv_responsables ccsr ON ccsr.id_usuario = cuc.id_usuario
				WHERE 
					cuc.id_usuario = :user_log
					AND cia.estado = 2 
					AND cuc.estado = 1
					AND cia.notificado = '0' 
				GROUP BY cia.nombre
				UNION
				SELECT 
					cia.*,
					cip.numero_importacion, 
					TIMESTAMPDIFF(MINUTE, cia.fecha_hora_inicio, now()) as 'diferencia' 
				FROM 
					cmx_importacion_actividades cia
					INNER JOIN cmx_importacion_proyecto cip ON cip.id = cia.id_importacion
					INNER JOIN cmx_usuario_cliente cuc ON cuc.id_perfil = cia.perfil_responsable
					INNER JOIN cmx_perfiles cp ON cp.id = cuc.id_perfil
				WHERE 
					cuc.id_usuario = :user_log
					AND cia.estado = 2 
					AND cp.tipo_perfil = 'ADMINISTRATIVO'
					AND cuc.estado = 1
					AND cia.notificado = '0' 
				GROUP BY cia.nombre;
			";
			$consulta = $conexion->prepare($sql);
			$consulta->bindParam(':user_log', $this->user_log, PDO::PARAM_STR);
			$consulta->execute();
			$total = $consulta->rowCount();
			if ($total == 0) {
				$this->respuesta = "BAD";
			} else {
				$this->respuesta = "GOOD";
				while ($filas = $consulta->fetch()) {
					$filas['diferencia_restante'] = $this->calculartiempo($filas['tiempo_aprobado']);
					$filas['diferencia'];
					if($filas['diferencia']>=$filas['diferencia_restante']){
						//$this->listado[] = $filas;
					}
				}
			}
		}

		public function calculartiempo($tiempo_aprobado) {
			$tiempo_notificacion = 0;
			if ($tiempo_aprobado > 2160) {
				$tiempo_notificacion = 1440;
				return $tiempo_notificacion;
			} else if ($tiempo_aprobado > 120 && $tiempo_aprobado <= 2160) {
				$tiempo_notificacion = 120;
				return $tiempo_notificacion;
			} else if ($tiempo_aprobado > 0 && $tiempo_aprobado <= 120) {
				$tiempo_notificacion = $tiempo_aprobado*0.3;
				return $tiempo_notificacion;
			}
		}
	}
?>