<?php

class servicio_especialModel extends Model
{

	public function __construct()
	{
		parent::__construct();
	}

	public function Consulta_Tabla($tipo_doc, $numdoc)
	{
		try {
			if ($tipo_doc == 'cot') {
				$sql = "SELECT id, estado
					FROM cmx_cotizaciones_serviciocliente
					WHERE id=" . $numdoc;
			}

			if ($tipo_doc == 'ss') {
				$sql = "SELECT a.nundoc_solicitud AS id, a.estado
						FROM cmx_solicitud_vehiculo2 a
						INNER JOIN cmx_detalle_mercancia2 b ON a.idpareja_origen_destino=b.id
						WHERE a.nundoc_solicitud=" . $numdoc;
			}

			if ($tipo_doc == 'oc') {
				$sql = "SELECT id,estado 
						FROM cmx_orden_cargue
						WHERE id=" . $numdoc;
			}

			if ($tipo_doc == 'rm') {
				$sql = "SELECT
					r.id,
					m.placa,
					CONCAT(ten.nombre, ' ', ten.apellido1, ' ',ten.apellido2) AS Poseedor,
					CONCAT(ori.municipio, ' ', ori.depto) AS Origen,
					CONCAT(des.municipio, ' ', des.depto) AS Destino,
					CONCAT(m.fecha_expedicion, ' ', m.hora_expedicion) AS Fecha_Expedicion,
					r.estado
				FROM
					cmx_remesa r
					INNER JOIN cmx_manifiesto_remesa mr ON r.id = mr.id_remesa
					INNER JOIN cmx_manifiesto m ON mr.id_manifiesto = m.id
					INNER JOIN cmx_proveedores ten ON m.titular_manifiesto = ten.numero_documento
					INNER JOIN cmx_municipios ori ON m.origen_viaje = ori.id
					INNER JOIN cmx_municipios des ON m.destino_viaje = des.id
				WHERE
					r.id =" . $numdoc;

				// $sql = "SELECT id,estado 
				// 	FROM cmx_remesa
				// 	WHERE id=" . $numdoc;
			}

			if ($tipo_doc == 'mnf') {
				$sql = "SELECT
					m.id,
					m.placa,
					CONCAT(ten.nombre,' ',ten.apellido1,' ',ten.apellido2) AS Poseedor,
					CONCAT(ori.municipio,' ',ori.depto) AS Origen,
					CONCAT(des.municipio,' ',des.depto) AS Destino,
					CONCAT(m.fecha_expedicion,' ',m.hora_expedicion) AS Fecha_Expedicion,
					m.estadomnf_actual AS estado
				FROM
					cmx_manifiesto m
					INNER JOIN cmx_proveedores ten ON m.titular_manifiesto=ten.numero_documento
					INNER JOIN cmx_municipios ori ON m.origen_viaje=ori.id
					INNER JOIN cmx_municipios des ON m.destino_viaje=des.id
				WHERE
					m.id=" . $numdoc;
				// $sql = "SELECT id, estadomnf_actual AS estado
				// 		FROM cmx_manifiesto
				// 		WHERE id=" . $numdoc;
			}

			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetch();
		} catch (PDOException $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function Consulta_Servicios()
	{
		try {
			$sql = 'SELECT * FROM 
					cmx_para_tipo_sevicio 
					WHERE tipificacion="Especial"
					 AND estado="activo"';
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOException $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function Consulta_Usuarios()
	{
		try {
			$sql = 'SELECT * FROM 
					cmx_usuarios 
					WHERE estado= 1';
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchAll();
		} catch (PDOException $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function valor_servicio($servicio)
	{
		try {
			$sql = "SELECT costo FROM cmx_para_tipo_sevicio WHERE nombre='" . $servicio . "'";
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetch();
		} catch (PDOException $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function pareja_servicio($numero, $tipo)
	{
		try {
			$sql = "";
			switch ($tipo) {
				case 1:
					$sql = "SELECT id, tipo_mercancia 
                        FROM cmx_detalle_mercancia2 
                        WHERE n_cotizacion = :numero";
					break;

				case 2:
					$sql = "SELECT b.id, b.tipo_mercancia 
                        FROM cmx_solicitud_vehiculo2 a
                        INNER JOIN cmx_detalle_mercancia2 b 
                            ON a.idpareja_origen_destino = b.id
                        WHERE a.nundoc_solicitud = :numero";
					break;

				case 3:
					$sql = "SELECT se.idpareja_origen_destino AS id, de.tipo_mercancia
                        FROM cmx_orden_cargue oc
                        INNER JOIN cmx_solicitud_vehiculo2 se 
                            ON oc.mer_idservicio = se.nundoc_solicitud
                        INNER JOIN cmx_detalle_mercancia2 de 
                            ON se.idpareja_origen_destino = de.id
                        WHERE oc.id = :numero";
					break;

				case 4:
					$sql = "SELECT a.idpareja_origen_destino AS id, d.tipo_mercancia
                        FROM cmx_remesa re
                        INNER JOIN cmx_solicitud_vehiculo2 a 
                            ON re.mer_idservicio = a.nundoc_solicitud
                        INNER JOIN cmx_detalle_mercancia2 d 
                            ON a.idpareja_origen_destino = d.id
                        WHERE re.id = :numero";
					break;

				case 5:
					$sql = "SELECT a.idpareja_origen_destino AS id, d.tipo_mercancia
                        FROM cmx_manifiesto ma
                        INNER JOIN cmx_manifiesto_remesa mr 
                            ON ma.id = mr.id_manifiesto
                        INNER JOIN cmx_remesa re 
                            ON mr.id_remesa = re.id
                        INNER JOIN cmx_solicitud_vehiculo2 a 
                            ON re.mer_idservicio = a.nundoc_solicitud
                        INNER JOIN cmx_detalle_mercancia2 d 
                            ON a.idpareja_origen_destino = d.id
                        WHERE ma.id = :numero";
					break;
			}

			if (empty($sql)) {
				return []; // si no hay tipo válido
			}

			$stmt = $this->_db3->prepare($sql);
			$stmt->bindValue(":numero", $numero, PDO::PARAM_INT);
			$stmt->execute();

			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			$error = $e->getMessage();
			// Si usas transacciones, asegúrate de que haya una activa antes de hacer rollback
			if ($this->_db3->inTransaction()) {
				$this->_db3->rollBack();
			}
			throw new Exception("Error en pareja_servicio: " . $error);
		}
	}

	// public function registra_servicio($tipo, $cant, $costo, $tarifa, $costototal, $tarifatotal, $rentabi, $utilidad, $conexion, $documento, $numdoc_documento)
	// {
	// 	$resultado = $this->_db2->conectar();
	// 	try {
	// 		$resultado->prepare("INSERT INTO cmx_detalle_servespecial2 (tipo_servicio,cantidad,valor_unitario,total_servicio,tarifa,utilidad,rentabilidad,tarifa_unitaria,id_pareja,estado)
	// 				VALUE(:tipo,:canti,:costo,:totals,:tarifat,:util,:renta,:tariuni,:pareja,:estado)")
	// 			->execute(
	// 				[
	// 					':tipo' => $tipo,
	// 					':canti' => $cant,
	// 					':costo' => $costo,
	// 					':totals' => $costototal,
	// 					':tarifat' => $tarifatotal,
	// 					':util' => $utilidad,
	// 					':renta' => $rentabi,
	// 					':tariuni' => $tarifa,
	// 					':pareja' => $conexion,
	// 					':estado' => 'Activo'
	// 				]
	// 			);
	// 		if ($resultado) {
	// 			return true;
	// 		} else {
	// 			return false;
	// 		}
	// 	} catch (PDOException $e) {
	// 		$error = $e->getMessage();
	// 		$this->_db3->rollBack();
	// 	}
	// }

	public function registra_servicio(
		$tipo,
		$cant,
		$costo,
		$tarifa,
		$costototal,
		$tarifatotal,
		$rentabi,
		$utilidad,
		$conexion,
		$documento,
		$numdoc_documento,
		$numdoc_documento_avansat
	) {
		$resultado = $this->_db2->conectar();

		try {

			$fecha = date("Y-m-d");
			$hora  = date("H:i:s");
			$usuario = $_SESSION["usuario"]["nom_usuario"];
			$empresa = $_SESSION["usuario"]["empresa_id"];

			// ======================================
			// 1️⃣ INSERT SEGÚN TIPO DE DOCUMENTO
			// ======================================

			if ($documento == 'ss') {

				// INSERT PARA SOLICITUD DE SERVICIO (SS)
				// $sql = "
				//         INSERT INTO cmx_detalle_servespecial2 
				//         (tipo_servicio, cantidad, valor_unitario, total_servicio, tarifa, utilidad, rentabilidad, tarifa_unitaria, id_pareja, estado)
				//         VALUES (:tipo, :cant, :costo, :totals, :tarifat, :util, :renta, :tariuni, :pareja, 'Activo')
				//     ";

				// $resultado->prepare($sql)->execute([
				// 	':tipo' => $tipo,
				// 	':cant' => $cant,
				// 	':costo' => $costo,
				// 	':totals' => $costototal,
				// 	':tarifat' => $tarifatotal,
				// 	':util' => $utilidad,
				// 	':renta' => $rentabi,
				// 	':tariuni' => $tarifa,
				// 	':pareja' => $conexion
				// ]);

				$sql = "
                INSERT INTO cmx_servicios_especiales_remesa
                (tipo_servicio, referencia, cantidad, valor_unitario, valor_total, estado, usuario_crea, fecha, hora, empresa_id)
                VALUES (:tipo, :ref, :cant, :costo, :totals, 'Pendiente', :usuario, :fecha, :hora, :empresa)
            ";

				$resultado->prepare($sql)->execute([
					// ':id' => $numdoc_documento,
					':tipo' => $tipo,
					':ref' => $numdoc_documento,
					':cant' => $cant,
					':costo' => $costo,
					':totals' => $costototal,
					':usuario' => $usuario,
					// ':numdoc_avansat' => $numdoc_documento_avansat,
					':fecha' => $fecha,
					':hora' => $hora,
					':empresa' => $empresa
				]);

				// $sql = "
				//         INSERT INTO cmx_servicios_especiales_remesa
				//         (tipo_servicio, referencia, cantidad, valor_unitario, valor_total, estado, usuario_crea, numdoc_avansat, fecha, hora, empresa_id)
				//         VALUES (:tipo, :ref, :cant, :costo, :totals, 'Pendiente', :usuario, :numdoc_avansat, :fecha, :hora, :empresa)
				//     ";

				// $resultado->prepare($sql)->execute([
				// 	// ':id' => $numdoc_documento,
				// 	':tipo' => $tipo,
				// 	':ref' => $numdoc_documento,
				// 	':cant' => $cant,
				// 	':costo' => $costo,
				// 	':totals' => $costototal,
				// 	':usuario' => $usuario,
				// 	':numdoc_avansat' => $numdoc_documento_avansat,
				// 	':fecha' => $fecha,
				// 	':hora' => $hora,
				// 	':empresa' => $empresa
				// ]);

			} elseif ($documento == 'rm') {

				// INSERT PARA REMESA
				// $sql = "
				//         INSERT INTO cmx_servicios_especiales_remesa
				//         (remesa_id, tipo_servicio, cantidad, valor_unitario, valor_total, estado, usuario_crea, numdoc_avansat, fecha, hora, empresa_id)
				//         VALUES (:id, :tipo, :cant, :costo, :totals, 'Pendiente', :usuario, :numdoc_avansat, :fecha, :hora, :empresa)
				//     ";

				// $resultado->prepare($sql)->execute([
				// 	':id' => $numdoc_documento,
				// 	':tipo' => $tipo,
				// 	':cant' => $cant,
				// 	':costo' => $costo,
				// 	':totals' => $costototal,
				// 	':usuario' => $usuario,
				// 	':numdoc_avansat' => $numdoc_documento_avansat,
				// 	':fecha' => $fecha,
				// 	':fecha' => $fecha,
				// 	':hora' => $hora,
				// 	':empresa' => $empresa
				// ]);

				$sql = "
                INSERT INTO cmx_servicios_especiales_remesa
                (remesa_id, tipo_servicio, cantidad, valor_unitario, valor_total, estado, usuario_crea, fecha, hora, empresa_id)
                VALUES (:id, :tipo, :cant, :costo, :totals, 'Pendiente', :usuario, :fecha, :hora, :empresa)
            ";

				$resultado->prepare($sql)->execute([
					':id' => $numdoc_documento,
					':tipo' => $tipo,
					':cant' => $cant,
					':costo' => $costo,
					':totals' => $costototal,
					':usuario' => $usuario,
					// ':numdoc_avansat' => $numdoc_documento_avansat,
					':fecha' => $fecha,
					':fecha' => $fecha,
					':hora' => $hora,
					':empresa' => $empresa
				]);
			} elseif ($documento == 'mnf') {

				// INSERT PARA MANIFIESTO
				$sql = "
                INSERT INTO cmx_servicios_especiales_manifiesto
                (manifiesto_id, tipo_servicio, cantidad, valor_unitario, valor_total, estado, usuario_crea, fecha, hora, empresa_id)
                VALUES (:id, :tipo, :cant, :costo, :totals, 'Pendiente', :usuario, :fecha, :hora, :empresa)
            ";

				$resultado->prepare($sql)->execute([
					':id' => $numdoc_documento,
					':tipo' => $tipo,
					':cant' => $cant,
					':costo' => $costo,
					':totals' => $costototal,
					':usuario' => $usuario,
					// ':numdoc_avansat' => $numdoc_documento_avansat,
					':fecha' => $fecha,
					':hora' => $hora,
					':empresa' => $empresa
				]);

				// $sql = "
				//         INSERT INTO cmx_servicios_especiales_manifiesto
				//         (manifiesto_id, tipo_servicio, cantidad, valor_unitario, valor_total, estado, usuario_crea, numdoc_avansat, fecha, hora, empresa_id)
				//         VALUES (:id, :tipo, :cant, :costo, :totals, 'Pendiente', :usuario, :numdoc_avansat, :fecha, :hora, :empresa)
				//     ";

				// $resultado->prepare($sql)->execute([
				// 	':id' => $numdoc_documento,
				// 	':tipo' => $tipo,
				// 	':cant' => $cant,
				// 	':costo' => $costo,
				// 	':totals' => $costototal,
				// 	':usuario' => $usuario,
				// 	':numdoc_avansat' => $numdoc_documento_avansat,
				// 	':fecha' => $fecha,
				// 	':hora' => $hora,
				// 	':empresa' => $empresa
				// ]);
			}

			return true;
		} catch (PDOException $e) {
			return ["error" => $e->getMessage()];
		}
	}

	public function listar_clientes()
	{
		try {
			$sql = "SELECT * FROM cmx_clientes";
			$resultado = $this->_db3->query($sql);
			return $resultado->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			if ($this->_db3->inTransaction()) {
				$this->_db3->rollBack();
			}
			return ["error" => $e->getMessage()];
		}
	}

	public function ListarServiciosEspecialesModel($tipo, $fecha_ini, $fecha_fin, $numdoc, $cliente, $servicio_especial, $usuario)
	{
		$cn = $this->_db3;

		try {

			// =========================
			// CONSULTA BASE
			// =========================
			if ($tipo == "Todos") {

				$sql = "
            SELECT
                r.id,
                m.placa,
                CONCAT(ten.nombre, ' ', IFNULL(ten.apellido1,' '), ' ', IFNULL(ten.apellido2,' ')) AS Poseedor,
                CONCAT(ori.municipio, ' ', ori.depto) AS Origen,
                CONCAT(des.municipio, ' ', des.depto) AS Destino,
                CONCAT(m.fecha_expedicion, ' ', m.hora_expedicion) AS Fecha_Expedicion,
                r.estado,
                GROUP_CONCAT(
                    DISTINCT CONCAT(r.id, '|', ss.nundoc_solicitud)
                    ORDER BY r.id SEPARATOR ','
                ) AS remesa_solicitud,
                m.id AS Manifiesto,
								sr.numdoc_avansat,
								'Remesa' AS tipo_documento
            FROM cmx_remesa r
            INNER JOIN cmx_manifiesto_remesa mr ON r.id = mr.id_remesa
            INNER JOIN cmx_manifiesto m ON mr.id_manifiesto = m.id
            INNER JOIN cmx_solicitud_vehiculo2 ss ON r.mer_idservicio = ss.nundoc_solicitud
            INNER JOIN cmx_proveedores ten ON m.titular_manifiesto = ten.numero_documento
            INNER JOIN cmx_municipios ori ON m.origen_viaje = ori.id
            INNER JOIN cmx_municipios des ON m.destino_viaje = des.id
            LEFT JOIN cmx_servicios_especiales_remesa sr ON r.id = sr.remesa_id
            WHERE sr.fecha BETWEEN :ini_r AND :fin_r
            GROUP BY r.id

            UNION ALL

            SELECT
                m.id,
                m.placa,
                CONCAT(ten.nombre, ' ', IFNULL(ten.apellido1,' '), ' ', IFNULL(ten.apellido2,' ')) AS Poseedor,
                CONCAT(ori.municipio, ' ', ori.depto) AS Origen,
                CONCAT(des.municipio, ' ', des.depto) AS Destino,
                CONCAT(m.fecha_expedicion, ' ', m.hora_expedicion) AS Fecha_Expedicion,
                m.estadomnf_actual AS estado,
                GROUP_CONCAT(
                    CONCAT('Rem: ', mr.id_remesa, ' | Ref: ', ss.nundoc_solicitud)
                    ORDER BY mr.id_remesa SEPARATOR ', '
                ) AS remesa_solicitud,
                m.id AS Manifiesto,
								sm.numdoc_avansat,
								'Manifiesto' AS tipo_documento
            FROM cmx_manifiesto m
            INNER JOIN cmx_servicios_especiales_manifiesto sm ON m.id = sm.manifiesto_id
            INNER JOIN cmx_manifiesto_remesa mr ON m.id = mr.id_manifiesto
            INNER JOIN cmx_remesa rm ON mr.id_remesa = rm.id
            INNER JOIN cmx_solicitud_vehiculo2 ss ON rm.mer_idservicio = ss.nundoc_solicitud
            INNER JOIN cmx_proveedores ten ON m.titular_manifiesto = ten.numero_documento
            INNER JOIN cmx_municipios ori ON m.origen_viaje = ori.id
            INNER JOIN cmx_municipios des ON m.destino_viaje = des.id
            WHERE sm.fecha BETWEEN :ini_m AND :fin_m
            GROUP BY m.id
            ";
			} elseif ($tipo == "Cliente") {

				$sql = "
            SELECT
                r.id,
                m.placa,
                CONCAT(ten.nombre, ' ', IFNULL(ten.apellido1,' '), ' ', IFNULL(ten.apellido2,' ')) AS Poseedor,
                CONCAT(ori.municipio, ' ', ori.depto) AS Origen,
                CONCAT(des.municipio, ' ', des.depto) AS Destino,
                CONCAT(m.fecha_expedicion, ' ', m.hora_expedicion) AS Fecha_Expedicion,
                r.estado,
                GROUP_CONCAT(DISTINCT CONCAT(r.id, '|', ss.nundoc_solicitud) ORDER BY r.id SEPARATOR ',') AS remesa_solicitud,
                m.id AS Manifiesto,
								sr.numdoc_avansat,
								'Remesa' AS tipo_documento
            FROM cmx_remesa r
            INNER JOIN cmx_manifiesto_remesa mr ON r.id = mr.id_remesa
            INNER JOIN cmx_manifiesto m ON mr.id_manifiesto = m.id
            INNER JOIN cmx_solicitud_vehiculo2 ss ON r.mer_idservicio = ss.nundoc_solicitud
            INNER JOIN cmx_cotizaciones_serviciocliente cs ON ss.n_cotizacion = cs.n_cotizacion
            INNER JOIN cmx_proveedores ten ON m.titular_manifiesto = ten.numero_documento
            INNER JOIN cmx_municipios ori ON m.origen_viaje = ori.id
            INNER JOIN cmx_municipios des ON m.destino_viaje = des.id
            LEFT JOIN cmx_servicios_especiales_remesa sr ON r.id = sr.remesa_id
            WHERE sr.fecha BETWEEN :ini_r AND :fin_r
              AND cs.id_cliente = :cli
            GROUP BY r.id

            UNION ALL

            SELECT
                m.id,
                m.placa,
                CONCAT(ten.nombre, ' ', IFNULL(ten.apellido1,' '), ' ', IFNULL(ten.apellido2,' ')) AS Poseedor,
                CONCAT(ori.municipio, ' ', ori.depto) AS Origen,
                CONCAT(des.municipio, ' ', des.depto) AS Destino,
                CONCAT(m.fecha_expedicion, ' ', m.hora_expedicion) AS Fecha_Expedicion,
                m.estadomnf_actual AS estado,
                GROUP_CONCAT(CONCAT('Rem: ', mr.id_remesa, ' | Ref: ', ss.nundoc_solicitud) ORDER BY mr.id_remesa SEPARATOR ', ') AS remesa_solicitud,
                m.id AS Manifiesto,
								sm.numdoc_avansat,
								'Manifiesto' AS tipo_documento
            FROM cmx_manifiesto m
            INNER JOIN cmx_servicios_especiales_manifiesto sm ON m.id = sm.manifiesto_id
            INNER JOIN cmx_manifiesto_remesa mr ON m.id = mr.id_manifiesto
            INNER JOIN cmx_remesa rm ON mr.id_remesa = rm.id
            INNER JOIN cmx_solicitud_vehiculo2 ss ON rm.mer_idservicio = ss.nundoc_solicitud
            INNER JOIN cmx_cotizaciones_serviciocliente cs ON ss.n_cotizacion = cs.n_cotizacion
            INNER JOIN cmx_proveedores ten ON m.titular_manifiesto = ten.numero_documento
            INNER JOIN cmx_municipios ori ON m.origen_viaje = ori.id
            INNER JOIN cmx_municipios des ON m.destino_viaje = des.id
            WHERE sm.fecha BETWEEN :ini_m AND :fin_m
              AND cs.id_cliente = :cli
            GROUP BY m.id
            ";
			} elseif ($tipo == "Servicio Especial") {
				$sql = "
            SELECT
                r.id,
                m.placa,
                CONCAT(ten.nombre, ' ', IFNULL(ten.apellido1,' '), ' ', IFNULL(ten.apellido2,' ')) AS Poseedor,
                CONCAT(ori.municipio, ' ', ori.depto) AS Origen,
                CONCAT(des.municipio, ' ', des.depto) AS Destino,
                CONCAT(m.fecha_expedicion, ' ', m.hora_expedicion) AS Fecha_Expedicion,
                r.estado,
                GROUP_CONCAT(DISTINCT CONCAT(r.id, '|', ss.nundoc_solicitud) ORDER BY r.id SEPARATOR ',') AS remesa_solicitud,
                m.id AS Manifiesto,
								sr.numdoc_avansat,
								'Remesa' AS tipo_documento
            FROM cmx_remesa r
            INNER JOIN cmx_manifiesto_remesa mr ON r.id = mr.id_remesa
            INNER JOIN cmx_manifiesto m ON mr.id_manifiesto = m.id
            INNER JOIN cmx_solicitud_vehiculo2 ss ON r.mer_idservicio = ss.nundoc_solicitud
            INNER JOIN cmx_cotizaciones_serviciocliente cs ON ss.n_cotizacion = cs.n_cotizacion
            INNER JOIN cmx_proveedores ten ON m.titular_manifiesto = ten.numero_documento
            INNER JOIN cmx_municipios ori ON m.origen_viaje = ori.id
            INNER JOIN cmx_municipios des ON m.destino_viaje = des.id
            LEFT JOIN cmx_servicios_especiales_remesa sr ON r.id = sr.remesa_id
            WHERE sr.fecha BETWEEN :ini_r AND :fin_r
              AND sr.tipo_servicio = :ser
            GROUP BY r.id

            UNION ALL

            SELECT
                m.id,
                m.placa,
                CONCAT(ten.nombre, ' ', IFNULL(ten.apellido1,' '), ' ', IFNULL(ten.apellido2,' ')) AS Poseedor,
                CONCAT(ori.municipio, ' ', ori.depto) AS Origen,
                CONCAT(des.municipio, ' ', des.depto) AS Destino,
                CONCAT(m.fecha_expedicion, ' ', m.hora_expedicion) AS Fecha_Expedicion,
                m.estadomnf_actual AS estado,
                GROUP_CONCAT(CONCAT('Rem: ', mr.id_remesa, ' | Ref: ', ss.nundoc_solicitud) ORDER BY mr.id_remesa SEPARATOR ', ') AS remesa_solicitud,
                m.id AS Manifiesto,
								sm.numdoc_avansat,
								'Manifiesto' AS tipo_documento
            FROM cmx_manifiesto m
            INNER JOIN cmx_servicios_especiales_manifiesto sm ON m.id = sm.manifiesto_id
            INNER JOIN cmx_manifiesto_remesa mr ON m.id = mr.id_manifiesto
            INNER JOIN cmx_remesa rm ON mr.id_remesa = rm.id
            INNER JOIN cmx_solicitud_vehiculo2 ss ON rm.mer_idservicio = ss.nundoc_solicitud
            INNER JOIN cmx_cotizaciones_serviciocliente cs ON ss.n_cotizacion = cs.n_cotizacion
            INNER JOIN cmx_proveedores ten ON m.titular_manifiesto = ten.numero_documento
            INNER JOIN cmx_municipios ori ON m.origen_viaje = ori.id
            INNER JOIN cmx_municipios des ON m.destino_viaje = des.id
            WHERE sm.fecha BETWEEN :ini_m AND :fin_m
              AND sm.tipo_servicio = :ser
            GROUP BY m.id
            ";
			} elseif ($tipo == "Usuario") {
				$sql = "
            SELECT
                r.id,
                m.placa,
                CONCAT(ten.nombre, ' ', IFNULL(ten.apellido1,' '), ' ', IFNULL(ten.apellido2,' ')) AS Poseedor,
                CONCAT(ori.municipio, ' ', ori.depto) AS Origen,
                CONCAT(des.municipio, ' ', des.depto) AS Destino,
                CONCAT(m.fecha_expedicion, ' ', m.hora_expedicion) AS Fecha_Expedicion,
                r.estado,
                GROUP_CONCAT(DISTINCT CONCAT(r.id, '|', ss.nundoc_solicitud) ORDER BY r.id SEPARATOR ',') AS remesa_solicitud,
                m.id AS Manifiesto,
								sr.numdoc_avansat,
								'Remesa' AS tipo_documento
            FROM cmx_remesa r
            INNER JOIN cmx_manifiesto_remesa mr ON r.id = mr.id_remesa
            INNER JOIN cmx_manifiesto m ON mr.id_manifiesto = m.id
            INNER JOIN cmx_solicitud_vehiculo2 ss ON r.mer_idservicio = ss.nundoc_solicitud
            INNER JOIN cmx_cotizaciones_serviciocliente cs ON ss.n_cotizacion = cs.n_cotizacion
            INNER JOIN cmx_proveedores ten ON m.titular_manifiesto = ten.numero_documento
            INNER JOIN cmx_municipios ori ON m.origen_viaje = ori.id
            INNER JOIN cmx_municipios des ON m.destino_viaje = des.id
            LEFT JOIN cmx_servicios_especiales_remesa sr ON r.id = sr.remesa_id
            WHERE sr.fecha BETWEEN :ini_r AND :fin_r
              AND sr.usuario_crea = :user
            GROUP BY r.id

            UNION ALL

            SELECT
                m.id,
                m.placa,
                CONCAT(ten.nombre, ' ', IFNULL(ten.apellido1,' '), ' ', IFNULL(ten.apellido2,' ')) AS Poseedor,
                CONCAT(ori.municipio, ' ', ori.depto) AS Origen,
                CONCAT(des.municipio, ' ', des.depto) AS Destino,
                CONCAT(m.fecha_expedicion, ' ', m.hora_expedicion) AS Fecha_Expedicion,
                m.estadomnf_actual AS estado,
                GROUP_CONCAT(CONCAT('Rem: ', mr.id_remesa, ' | Ref: ', ss.nundoc_solicitud) ORDER BY mr.id_remesa SEPARATOR ', ') AS remesa_solicitud,
                m.id AS Manifiesto,
								sm.numdoc_avansat,
								'Manifiesto' AS tipo_documento
            FROM cmx_manifiesto m
            INNER JOIN cmx_servicios_especiales_manifiesto sm ON m.id = sm.manifiesto_id
            INNER JOIN cmx_manifiesto_remesa mr ON m.id = mr.id_manifiesto
            INNER JOIN cmx_remesa rm ON mr.id_remesa = rm.id
            INNER JOIN cmx_solicitud_vehiculo2 ss ON rm.mer_idservicio = ss.nundoc_solicitud
            INNER JOIN cmx_cotizaciones_serviciocliente cs ON ss.n_cotizacion = cs.n_cotizacion
            INNER JOIN cmx_proveedores ten ON m.titular_manifiesto = ten.numero_documento
            INNER JOIN cmx_municipios ori ON m.origen_viaje = ori.id
            INNER JOIN cmx_municipios des ON m.destino_viaje = des.id
            WHERE sm.fecha BETWEEN :ini_m AND :fin_m
              AND sm.usuario_crea = :user
            GROUP BY m.id
            ";
			} elseif ($tipo == "Remesa") {
				$sql = "
            SELECT
                r.id,
                m.placa,
                CONCAT(ten.nombre, ' ', IFNULL(ten.apellido1,' '), ' ', IFNULL(ten.apellido2,' ')) AS Poseedor,
                CONCAT(ori.municipio, ' ', ori.depto) AS Origen,
                CONCAT(des.municipio, ' ', des.depto) AS Destino,
                CONCAT(m.fecha_expedicion, ' ', m.hora_expedicion) AS Fecha_Expedicion,
                r.estado,
                GROUP_CONCAT(DISTINCT CONCAT(r.id, '|', ss.nundoc_solicitud) ORDER BY r.id SEPARATOR ',') AS remesa_solicitud,
                m.id AS Manifiesto,
								sr.numdoc_avansat,
								'Remesa' AS tipo_documento
            FROM cmx_remesa r
            INNER JOIN cmx_manifiesto_remesa mr ON r.id = mr.id_remesa
            INNER JOIN cmx_manifiesto m ON mr.id_manifiesto = m.id
            INNER JOIN cmx_solicitud_vehiculo2 ss ON r.mer_idservicio = ss.nundoc_solicitud
            INNER JOIN cmx_proveedores ten ON m.titular_manifiesto = ten.numero_documento
            INNER JOIN cmx_municipios ori ON m.origen_viaje = ori.id
            INNER JOIN cmx_municipios des ON m.destino_viaje = des.id
            LEFT JOIN cmx_servicios_especiales_remesa sr ON r.id = sr.remesa_id
            WHERE sr.fecha BETWEEN :ini AND :fin
            ";
			} elseif ($tipo == "Manifiesto") {
				$sql = "
            SELECT
                m.id,
                m.placa,
                CONCAT(ten.nombre, ' ', IFNULL(ten.apellido1,' '), ' ', IFNULL(ten.apellido2,' ')) AS Poseedor,
                CONCAT(ori.municipio, ' ', ori.depto) AS Origen,
                CONCAT(des.municipio, ' ', des.depto) AS Destino,
                CONCAT(m.fecha_expedicion, ' ', m.hora_expedicion) AS Fecha_Expedicion,
                m.estadomnf_actual AS estado,
                GROUP_CONCAT(CONCAT('Rem: ', mr.id_remesa, ' | Ref: ', ss.nundoc_solicitud) ORDER BY mr.id_remesa SEPARATOR ', ') AS remesa_solicitud,
								sm.numdoc_avansat,
								'Manifiesto' AS tipo_documento
            FROM cmx_manifiesto m
            INNER JOIN cmx_servicios_especiales_manifiesto sm ON m.id = sm.manifiesto_id
            INNER JOIN cmx_manifiesto_remesa mr ON m.id = mr.id_manifiesto
            INNER JOIN cmx_remesa rm ON mr.id_remesa = rm.id
            INNER JOIN cmx_solicitud_vehiculo2 ss ON rm.mer_idservicio = ss.nundoc_solicitud
            INNER JOIN cmx_proveedores ten ON m.titular_manifiesto = ten.numero_documento
            INNER JOIN cmx_municipios ori ON m.origen_viaje = ori.id
            INNER JOIN cmx_municipios des ON m.destino_viaje = des.id
            WHERE sm.fecha BETWEEN :ini AND :fin
            ";
			}

			// =========================
			// VALIDAR USO DE numdoc
			// =========================
			$usarNumdoc = false;

			if (!empty($numdoc)) {
				if ($tipo === 'Remesa' || $tipo === 'Manifiesto') {
					$usarNumdoc = true;
				}
			}

			// =========================
			// PREPARE Y BIND
			// =========================
			$stmt = $cn->prepare($sql);

			if (strpos($sql, ':ini_r') !== false) {
				$stmt->bindParam(':ini_r', $fecha_ini);
				$stmt->bindParam(':fin_r', $fecha_fin);
				$stmt->bindParam(':ini_m', $fecha_ini);
				$stmt->bindParam(':fin_m', $fecha_fin);
			} else {
				$stmt->bindParam(':ini', $fecha_ini);
				$stmt->bindParam(':fin', $fecha_fin);
			}

			if (!empty($cliente) && strpos($sql, ':cli') !== false) {
				$stmt->bindParam(':cli', $cliente);
			}

			// if (!empty($numdoc) && strpos($sql, ':numdoc') !== false) {
			// 	$stmt->bindParam(':numdoc', $numdoc);
			// }

			if ($usarNumdoc && strpos($sql, ':numdoc') !== false) {
				$stmt->bindParam(':numdoc', $numdoc);
			}

			if (!empty($servicio_especial) && strpos($sql, ':ser') !== false) {
				$stmt->bindParam(':ser', $servicio_especial);
			}

			if (!empty($usuario) && strpos($sql, ':user') !== false) {
				$stmt->bindParam(':user', $usuario);
			}

			$stmt->execute();

			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			return ["error" => $e->getMessage()];
		}
	}

	public function ObtenerDetalleDocumento($id)
	{
		$cn = $this->_db3;

		// 1. Datos del manifiesto
		$sqlMan = $cn->prepare("
        SELECT 
            m.id,
            m.placa,
            CONCAT(ori.municipio, ' ', ori.depto) AS Origen,
            CONCAT(des.municipio, ' ', des.depto) AS Destino,
            m.fecha_expedicion,
            m.hora_expedicion
        FROM cmx_manifiesto m
        INNER JOIN cmx_municipios ori ON m.origen_viaje = ori.id
        INNER JOIN cmx_municipios des ON m.destino_viaje = des.id
        WHERE m.id = :id
    ");
		$sqlMan->execute([":id" => $id]);
		$manifiesto = $sqlMan->fetch(PDO::FETCH_ASSOC);

		// 2. Servicios especiales del manifiesto
		$sqlSM = $cn->prepare("
        SELECT tipo_servicio, valor_total, numdoc_avansat, id, manifiesto_id
        FROM cmx_servicios_especiales_manifiesto
        WHERE manifiesto_id = :id
    ");
		$sqlSM->execute([":id" => $id]);
		$servicios_manifiesto = $sqlSM->fetchAll(PDO::FETCH_ASSOC);

		// 3. Remesas asociadas
		$sqlRem = $cn->prepare("
        SELECT 
            r.id,
            r.fecha_creacion,
            r.estado
        FROM cmx_remesa r
        INNER JOIN cmx_manifiesto_remesa mr ON r.id = mr.id_remesa
        WHERE mr.id_manifiesto = :id
    ");
		$sqlRem->execute([":id" => $id]);
		$remesas = $sqlRem->fetchAll(PDO::FETCH_ASSOC);

		// 4. Servicios especiales por cada remesa
		foreach ($remesas as &$remesa) {

			$sqlSER = $cn->prepare("
            SELECT tipo_servicio, valor_total, numdoc_avansat, id, remesa_id
            FROM cmx_servicios_especiales_remesa
            WHERE remesa_id = :rid
        ");
			$sqlSER->execute([":rid" => $remesa["id"]]);

			$remesa["servicios"] = $sqlSER->fetchAll(PDO::FETCH_ASSOC);
		}

		return [
			"manifiesto" => $manifiesto,
			"servicios_manifiesto" => $servicios_manifiesto,
			"remesas" => $remesas
		];
	}

	public function ObtenerDetalleRemesa($id)
	{
		$cn = $this->_db3;

		// ======================================================
		// 1. OBTENER DATOS DE LA REMESA
		// ======================================================
		$sqlRem = $cn->prepare("
        SELECT 
            r.id,
            r.fecha_creacion AS fecha_expedicion,
            r.hora_creacion AS hora_expedicion,
            r.estado,
            m.id AS manifiesto_id,
            m.placa,
            CONCAT(ori.municipio, ' ', ori.depto) AS Origen,
            CONCAT(des.municipio, ' ', des.depto) AS Destino
        FROM cmx_remesa r
        LEFT JOIN cmx_manifiesto_remesa mr ON r.id = mr.id_remesa
        LEFT JOIN cmx_manifiesto m ON mr.id_manifiesto = m.id
        LEFT JOIN cmx_municipios ori ON m.origen_viaje = ori.id
        LEFT JOIN cmx_municipios des ON m.destino_viaje = des.id
        WHERE r.id = :id
    ");
		$sqlRem->execute([":id" => $id]);

		$remesa = $sqlRem->fetch(PDO::FETCH_ASSOC);

		if (!$remesa) {
			return ["error" => "La remesa no existe"];
		}

		// ======================================================
		// 2. SERVICIOS ESPECIALES DE LA REMESA
		// ======================================================
		$sqlSER = $cn->prepare("
        SELECT tipo_servicio, valor_total, numdoc_avansat, id, remesa_id
        FROM cmx_servicios_especiales_remesa
        WHERE remesa_id = :id
    ");
		$sqlSER->execute([":id" => $id]);
		$servicios_remesa = $sqlSER->fetchAll(PDO::FETCH_ASSOC);

		// ======================================================
		// 3. SERVICIOS DEL MANIFIESTO (solo si existe)
		// ======================================================
		$servicios_manifiesto = [];

		if (!empty($remesa["manifiesto_id"])) {
			$sqlSM = $cn->prepare("
            SELECT tipo_servicio, valor_total, numdoc_avansat, id, manifiesto_id
            FROM cmx_servicios_especiales_manifiesto
            WHERE manifiesto_id = :mid
        ");
			$sqlSM->execute([":mid" => $remesa["manifiesto_id"]]);

			$servicios_manifiesto = $sqlSM->fetchAll(PDO::FETCH_ASSOC);
		}

		// ======================================================
		// 4. RESPUESTA FINAL
		// ======================================================
		return [
			"remesa" => $remesa,
			"servicios_remesa" => $servicios_remesa,
			"servicios_manifiesto" => $servicios_manifiesto
		];
	}

	/**
	 * Actualiza el número Avansat según el tipo de documento
	 */
	public function actualizarAvansat(int $id, string $tipo, string $numdoc): bool
	{
		switch ($tipo) {

			case 'manifiesto':
				$sql = "UPDATE cmx_servicios_especiales_manifiesto
                        SET numdoc_avansat = :numdoc
                        WHERE id = :id";
				break;

			case 'remesa':
				$sql = "UPDATE cmx_servicios_especiales_remesa
                        SET numdoc_avansat = :numdoc
                        WHERE id = :id";
				break;

			default:
				throw new InvalidArgumentException('Tipo de documento no válido');
		}

		$stmt = $this->_db3->prepare($sql);
		$stmt->bindParam(':numdoc', $numdoc, PDO::PARAM_STR);
		$stmt->bindParam(':id', $id, PDO::PARAM_INT);

		return $stmt->execute();
	}
}
