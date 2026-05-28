<?php
date_default_timezone_set('America/Bogota');
session_start();

class indicadoresModel extends Model
{
    public function __construct()
    {
        parent::__construct();
    }

    //Funciones de los precintos
    public function Graficos_General_Precintos()
    {
        $sql = $this->_db3->prepare("WITH RECURSIVE movimientos_rangos AS (
			SELECT 
				CAST(SUBSTRING_INDEX(codigo_precinto, '-', 1) AS UNSIGNED) AS inicio,
				CAST(SUBSTRING_INDEX(codigo_precinto, '-', -1) AS UNSIGNED) AS fin
			FROM cmx_precintos_movimientos
			WHERE fecha BETWEEN :Fecha_inicio AND :Fecha_Final
		),
		numeros_movimientos AS (
			SELECT inicio AS numero, fin FROM movimientos_rangos
			UNION ALL
			SELECT numero + 1, fin FROM numeros_movimientos
			WHERE numero + 1 <= fin
		),
		todos_precintos AS (
			-- Precintos existentes
			SELECT 
				codigo_precinto COLLATE utf8mb4_unicode_ci AS codigo_precinto,
				estado_precinto,
				agencia_asignada
			FROM cmx_precinto
			
			UNION ALL
			
			-- Precintos de movimientos que no existen en cmx_precinto
			SELECT 
				CAST(nm.numero AS CHAR) COLLATE utf8mb4_unicode_ci AS codigo_precinto,
				NULL AS estado_precinto,
				NULL AS agencia_asignada
			FROM numeros_movimientos nm
			WHERE NOT EXISTS (
				SELECT 1 FROM cmx_precinto p 
				WHERE CAST(p.codigo_precinto AS UNSIGNED) = nm.numero
			)
		),
		resultados_agencias AS (
			SELECT 
				p.agencia_asignada AS agencia,
				COUNT(p.codigo_precinto) AS ingreso,
				COUNT(CASE WHEN p.estado_precinto = 'disponible' THEN 1 END) AS disponibles,
				COUNT(CASE WHEN p.estado_precinto = 'asignado' THEN 1 END) AS asignados,
				0 AS almacen
			FROM todos_precintos p
			WHERE p.agencia_asignada IS NOT NULL
			GROUP BY p.agencia_asignada
		),
		total_general AS (
			SELECT 
				'TOTAL' AS agencia,
				SUM(ingreso) AS ingreso,
				SUM(disponibles) AS disponibles,
				SUM(asignados) AS asignados,
				0 AS almacen
			FROM resultados_agencias
		),
		almacen_row AS (
			SELECT 
				'ALMACEN' AS agencia,
				0 AS ingreso,
				0 AS disponibles,
				0 AS asignados,
				COUNT(p.codigo_precinto) AS almacen
			FROM todos_precintos p
			WHERE p.agencia_asignada IS NULL
		)
		SELECT * FROM resultados_agencias
		UNION ALL
		SELECT * FROM total_general
		UNION ALL
		SELECT * FROM almacen_row
		ORDER BY 
			CASE agencia 
				WHEN 'TOTAL' THEN 3
				WHEN 'ALMACEN' THEN 2
				ELSE 1
			END,
			agencia");

        $Fecha_Inicio = '2025-06-01';
        $Fecha_Final = date('Y-m-d');

        $sql->bindParam(":Fecha_inicio", $Fecha_Inicio);
        $sql->bindParam(":Fecha_Final", $Fecha_Final);
        $sql->execute();
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function Graficos_Agencia_Precintos($Agencia)
    {
        $Fecha_Inicio = '2025-06-01';
        $Fecha_Final = date('Y-m-d');
        try {
            // --- PRECINTOS DISPONIBLES ---
            $sql_disponibles = $this->_db3->prepare("
                WITH RECURSIVE rangos AS ( 
                    SELECT 
                        CAST(SUBSTRING_INDEX(pm.codigo_precinto, '-', 1) AS UNSIGNED) AS inicio,
                        CAST(SUBSTRING_INDEX(pm.codigo_precinto, '-', -1) AS UNSIGNED) AS fin
                    FROM cmx_precintos_movimientos AS pm
                    WHERE pm.fecha BETWEEN :Fecha_Inicio AND :Fecha_Final
                ),
                numeros AS (
                    SELECT inicio AS numero, fin FROM rangos
                    UNION ALL
                    SELECT numero + 1, fin FROM numeros
                    WHERE numero + 1 <= fin
                )
                SELECT 
                    p.codigo_precinto AS precintos_asignados,
                    p.agencia_asignada,
                    p.tipo_precinto
                FROM numeros AS npm
                INNER JOIN cmx_precinto AS p ON CAST(p.codigo_precinto AS UNSIGNED) = npm.numero
                WHERE p.estado_precinto = 'disponible'
                AND p.agencia_asignada = :Agencia
                ORDER BY p.agencia_asignada, p.codigo_precinto
            ");

            $sql_disponibles->execute([
                ':Fecha_Inicio' => $Fecha_Inicio,
                ':Fecha_Final'  => $Fecha_Final,
                ':Agencia'      => $Agencia
            ]);
            $rows_disponibles = $sql_disponibles->fetchAll(PDO::FETCH_ASSOC);


            // --- PRECINTOS ASIGNADOS ---
            $sql_asignados = $this->_db3->prepare("
                WITH RECURSIVE rangos AS ( 
                    SELECT 
                        CAST(SUBSTRING_INDEX(pm.codigo_precinto, '-', 1) AS UNSIGNED) AS inicio,
                        CAST(SUBSTRING_INDEX(pm.codigo_precinto, '-', -1) AS UNSIGNED) AS fin
                    FROM cmx_precintos_movimientos AS pm
                    WHERE pm.fecha BETWEEN :Fecha_Inicio AND :Fecha_Final
                ),
                numeros AS (
                    SELECT inicio AS numero, fin FROM rangos
                    UNION ALL
                    SELECT numero + 1, fin FROM numeros
                    WHERE numero + 1 <= fin
                )
                SELECT 
                    p.codigo_precinto AS 'Precintos Asignados',
                    p.agencia_asignada AS 'Agencia Asignada',
                    p.tipo_precinto AS 'Tipo Precinto',
                    ma.placa,
                    CONCAT(cond.nombre,'',cond.apellido1,'',cond.apellido2) AS Conductor,
                    pd.id_planilla AS 'Orden Cargue',
                    ro.id_remesa AS Remesa,
                    mr.id_manifiesto AS Manifiesto,
                    CONCAT(oc.fecha_orden,' ',oc.hora_orden) AS Fecha
                FROM numeros AS npm
                INNER JOIN cmx_precinto AS p ON CAST(p.codigo_precinto AS UNSIGNED) = npm.numero
                INNER JOIN cmx_planilla_detalle2 pd ON p.codigo_precinto=pd.serie_precinto
                INNER JOIN cmx_remesa_ordencargue ro ON pd.id_planilla=ro.id_orden_cargue
                INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue=oc.id
                INNER JOIN cmx_manifiesto_remesa mr ON ro.id_remesa=mr.id_remesa
                INNER JOIN cmx_manifiesto ma ON mr.id_manifiesto=ma.id
                INNER JOIN cmx_proveedores cond ON ma.conductor_manifiesto=cond.numero_documento
                WHERE p.estado_precinto = 'asignado'
                AND p.agencia_asignada = :Agencia
                ORDER BY p.agencia_asignada, p.codigo_precinto
            ");

            $sql_asignados->execute([
                ':Fecha_Inicio' => $Fecha_Inicio,
                ':Fecha_Final'  => $Fecha_Final,
                ':Agencia'      => $Agencia
            ]);
            $rows_asignados = $sql_asignados->fetchAll(PDO::FETCH_ASSOC);

            // --- Contar y devolver ---
            $resultados[] = [
                "agencia_asignada" => $Agencia,
                "disponibles"      => count($rows_disponibles),
                "asignados"        => count($rows_asignados),
                "ingreso"          => count($rows_disponibles) + count($rows_asignados),
                "detalle_disponibles" => $rows_disponibles,
                "detalle_asignados"   => $rows_asignados
            ];

            // al final
            return $resultados;
        } catch (\Throwable $e) {
            return ["error" => $e->getMessage()];
        }
    }

    public function Graficos_General_Manifiestos($Fecha_Inicio, $Fecha_Final)
    {
        try {
            // Normalizar fechas a Bogotá
            $inicio = (new DateTime($Fecha_Inicio, new DateTimeZone('America/Bogota')))->format('Y-m-d');
            $fin    = (new DateTime($Fecha_Final, new DateTimeZone('America/Bogota')))->format('Y-m-d');

            $sql = "
                SELECT
                    COUNT(m.id) AS total_manifiestos,
                    SUM(
                        CASE WHEN m.estadomnf_actual = 1 THEN 1 ELSE 0 END
                    ) AS total_activos,
                    SUM(
                        CASE WHEN m.estadomnf_actual = 0 THEN 1 ELSE 0 END
                    ) AS total_inactivos
                FROM
                    cmx_manifiesto m
                WHERE
                    m.fecha_expedicion BETWEEN :inicio
                    AND :fin
        	";

            $stmt = $this->_db3->prepare($sql);
            $stmt->bindParam(':inicio', $inicio);
            $stmt->bindParam(':fin', $fin);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return [
                'error'   => true,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    public function Graficos_Detalle_Manifiestos($fecha_inicio, $fecha_final, $estado)
    {
        try {
            // =======================
            // 1) Query detalle
            // =======================
            $sqlDetalle = "SELECT 
                m.id AS Manifiesto,
                m.placa, 
                CONCAT(cd.nombre,' ',cd.apellido1,' ',cd.apellido2) AS Conductor,
                CONCAT(ori.municipio,' - ',ori.depto) AS Origen, 
                CONCAT(des.municipio ,' - ', des.depto) AS Destino,
                m.valor_total_viaje AS Total_Manifiesto,
                CAST(REPLACE(IFNULL(man.valor_anticipo,'-'), ',', '') AS DECIMAL(15,2)) AS Anticipo, 
                ag.nombre AS Agencia,
                m.fecha_expedicion,
                m.estadomnf_actual,
                COALESCE(cv.clase, 'SIN DEFINIR') AS tipo_vehiculo
				FROM
					cmx_manifiesto m
					INNER JOIN cmx_proveedores cd ON m.conductor_manifiesto = cd.numero_documento
					INNER JOIN cmx_municipios ori ON m.origen_viaje = ori.id
					INNER JOIN cmx_municipios des ON m.destino_viaje = des.id
					INNER JOIN cmx_agencias ag ON m.Lugar = ag.nombre
					INNER JOIN cmx_vehiculos v ON m.placa=v.placa
					INNER JOIN cmx_vehiculo2 v2 ON v.numdoc_vehiculo=v2.id_vehiculo
					INNER JOIN cmx_rndc_clase_vehiculo cv ON v2.clase_vehiculo=cv.id
					/*INNER JOIN cmx_manifiesto_estado mnfe ON m.id = mnfe.id_manifiesto*/
					LEFT JOIN cmx_manifiesto_anticipo man ON m.id = man.id_manifiesto
                WHERE m.fecha_expedicion BETWEEN STR_TO_DATE(:fecha_inicio, '%Y-%m-%d') AND STR_TO_DATE(:fecha_final, '%Y-%m-%d') ORDER BY m.id ASC";

            // Filtro dinámico según estado
            if ($estado == 'activos') {
                $sqlDetalle .= " AND m.estadomnf_actual = 1";
            } elseif ($estado == 'anulados') {
                $sqlDetalle .= " AND m.estadomnf_actual = 0";
            }

            $sqlDetalle .= " ORDER BY Origen ASC";

            // =======================
            // 2) Query resumen
            // =======================
            $sqlResumen = "SELECT 
                IFNULL(ag.nombre,'TOTAL') AS Agencia,
                SUM(m.valor_total_viaje) AS Total_Manifiesto,
                SUM(CAST(REPLACE(man.valor_anticipo, ',', '') AS DECIMAL(15,2))) AS Total_Anticipo
				FROM
					cmx_manifiesto m
					INNER JOIN cmx_proveedores cd ON m.conductor_manifiesto = cd.numero_documento
					INNER JOIN cmx_municipios ori ON m.origen_viaje = ori.id
					INNER JOIN cmx_municipios des ON m.destino_viaje = des.id
					INNER JOIN cmx_agencias ag ON m.Lugar = ag.nombre
					INNER JOIN cmx_vehiculos v ON m.placa=v.placa
					INNER JOIN cmx_vehiculo2 v2 ON v.numdoc_vehiculo=v2.id_vehiculo
					INNER JOIN cmx_rndc_clase_vehiculo cv ON v2.clase_vehiculo=cv.id
					/*INNER JOIN cmx_manifiesto_estado mnfe ON m.id = mnfe.id_manifiesto*/
					LEFT JOIN cmx_manifiesto_anticipo man ON m.id = man.id_manifiesto
                WHERE m.fecha_expedicion BETWEEN STR_TO_DATE(:fecha_inicio, '%Y-%m-%d') AND STR_TO_DATE(:fecha_final, '%Y-%m-%d')";

            if ($estado == 'activos') {
                $sqlResumen .= " AND m.estadomnf_actual = 1";
            } elseif ($estado == 'anulados') {
                $sqlResumen .= " AND m.estadomnf_actual = 0";
            }

            $sqlResumen .= " GROUP BY ag.nombre WITH ROLLUP";

            // =======================
            // Ejecutar consultas
            // =======================
            $inicio = (new DateTime($fecha_inicio, new DateTimeZone('America/Bogota')))->format('Y-m-d H:i:s');
            $fin    = (new DateTime($fecha_final, new DateTimeZone('America/Bogota')))->format('Y-m-d H:i:s');

            // --- Detalle ---
            $stmtDetalle = $this->_db3->prepare($sqlDetalle);
            $stmtDetalle->bindParam(':fecha_inicio', $inicio, PDO::PARAM_STR);
            $stmtDetalle->bindParam(':fecha_final', $fin, PDO::PARAM_STR);
            $stmtDetalle->execute();
            $detalle = $stmtDetalle->fetchAll(PDO::FETCH_ASSOC);

            // --- Resumen ---
            $stmtResumen = $this->_db3->prepare($sqlResumen);
            $stmtResumen->bindParam(':fecha_inicio', $inicio, PDO::PARAM_STR);
            $stmtResumen->bindParam(':fecha_final', $fin, PDO::PARAM_STR);
            $stmtResumen->execute();
            $resumen = $stmtResumen->fetchAll(PDO::FETCH_ASSOC);

            // 🚀 Retorno combinado
            return [
                'detalle' => $detalle,
                'resumen' => $resumen
            ];
        } catch (PDOException $e) {
            return ['error' => $e->getMessage()];
        }
    }

    public function Detalle_Manifiestos_Graficos($Fecha_Inicio, $Fecha_Final)
    {
        try {
            // ================================
            // 1. Cumplidos vs Sin Cumplir
            // ================================
            $sql_cumplido = $this->_db3->prepare("
                SELECT 
                    CASE 
                        WHEN cu.manifiesto IS NULL THEN 'Sin Cumplir'
                        ELSE 'Cumplidos'
                    END AS estado,
                    COUNT(m.id) AS cantidad
                FROM cmx_manifiesto m
                /*INNER JOIN cmx_manifiesto_estado mnfe ON m.id = mnfe.id_manifiesto*/
                LEFT JOIN cmx_cumplido cu ON m.id = cu.manifiesto
                WHERE m.fecha_expedicion BETWEEN :inicio AND :fin
                AND m.estadomnf_actual = 1
                GROUP BY estado
                ");

            $inicio = (new DateTime($Fecha_Inicio, new DateTimeZone('America/Bogota')))->format('Y-m-d H:i:s');
            $fin    = (new DateTime($Fecha_Final, new DateTimeZone('America/Bogota')))->format('Y-m-d H:i:s');
            $sql_cumplido->bindParam(':inicio', $inicio);
            $sql_cumplido->bindParam(':fin', $fin);
            $sql_cumplido->execute();
            $cumplidos = $sql_cumplido->fetchAll(PDO::FETCH_ASSOC);

            // ================================
            // 2. Origen → Destino
            // ================================
            // 	$sql_origen_destino = $this->_db3->prepare("
            //     SELECT 
            //         CONCAT(ori.municipio, ' - ', ori.depto, ' → ', des.municipio, ' - ', des.depto) AS ruta,
            //         COUNT(*) AS cantidad
            //     FROM cmx_manifiesto m
            //     INNER JOIN cmx_municipios ori ON m.origen_viaje = ori.id
            //     INNER JOIN cmx_municipios des ON m.destino_viaje = des.id
            //     WHERE m.fecha_expedicion BETWEEN :inicio AND :fin
            //     AND m.estado_seguimiento IN ('CUMPLIDO','FINALIZADO','SEGUIMIENTO')
            //     GROUP BY ruta
            //     ORDER BY cantidad DESC
            // ");
            // 	$sql_origen_destino->bindParam(':inicio', $Fecha_Inicio);
            // 	$sql_origen_destino->bindParam(':fin', $Fecha_Final);
            // 	$sql_origen_destino->execute();
            // 	$origen_destino = $sql_origen_destino->fetchAll(PDO::FETCH_ASSOC);

            // ================================
            // 3. Tipo de vehículo
            // ================================
            // 	$sql_tipo_vehiculo = $this->_db3->prepare("
            // 		SELECT
            // 			COALESCE(tv.nombre, 'SIN DEFINIR') AS tipo_vehiculo,
            // 			COUNT(*) AS cantidad
            // 		FROM
            // 			cmx_manifiesto m
            // 			INNER JOIN cmx_manifiesto_remesa mr ON m.id = mr.id_manifiesto
            // 			INNER JOIN cmx_remesa_ordencargue ro ON mr.id_remesa = ro.id_remesa
            // 			INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue = oc.id
            // 			INNER JOIN cmx_solicitud_vehiculo2 ss ON oc.mer_idservicio = ss.nundoc_solicitud
            // 			INNER JOIN cmx_detalle_mercancia2 dm ON dm.n_cotizacion=ss.n_cotizacion
            // 			INNER JOIN cmx_para_tipo_vehiculo tv ON dm.tipo_vehiculo=tv.id
            //     WHERE m.fecha_expedicion BETWEEN :inicio AND :fin
            //     AND m.estado_seguimiento IN ('CUMPLIDO','FINALIZADO','SEGUIMIENTO')
            //     GROUP BY tipo_vehiculo
            //     ORDER BY cantidad DESC
            // ");
            // 	$sql_tipo_vehiculo->bindParam(':inicio', $Fecha_Inicio);
            // 	$sql_tipo_vehiculo->bindParam(':fin', $Fecha_Final);
            // 	$sql_tipo_vehiculo->execute();
            // 	$tipo_vehiculo = $sql_tipo_vehiculo->fetchAll(PDO::FETCH_ASSOC);

            // ================================
            // 4. Agencia
            // ================================
            $sql_agencia = $this->_db3->prepare("SELECT
				m.lugar AS agencia,
				COUNT(*) AS cantidad
			FROM
				cmx_manifiesto m
				/*INNER JOIN cmx_manifiesto_estado mnfe ON m.id = mnfe.id_manifiesto*/
			WHERE
				m.fecha_expedicion BETWEEN :inicio AND :fin 
				AND m.estadomnf_actual = 1
			GROUP BY 
				m.lugar
			ORDER BY cantidad DESC
        	");

            $sql_agencia->bindParam(':inicio', $Fecha_Inicio);
            $sql_agencia->bindParam(':fin', $Fecha_Final);
            $sql_agencia->execute();
            $agencias = $sql_agencia->fetchAll(PDO::FETCH_ASSOC);

            // ================================
            // Un solo array de salida
            // ================================
            return [
                'cumplidos'      => $cumplidos,
                // 'origen_destino' => $origen_destino,
                // 'tipo_vehiculo'  => $tipo_vehiculo,
                'agencias'       => $agencias,
            ];
        } catch (PDOException $e) {
            return [
                'error' => true,
                'message' => $e->getMessage()
            ];
        }
    }

    public function Detalle_Manifiestos_Cumplido($Estado, $Fecha_Inicio, $Fecha_Final)
    {
        try {
            $sql = "SELECT 
                    m.id AS Manifiesto, 
                    m.placa, 
                    CONCAT(cd.nombre,' ',cd.apellido1,' ',cd.apellido2) AS Conductor,
                    CONCAT(ori.municipio,' - ',ori.depto) AS Origen, 
                    CONCAT(des.municipio ,' - ', des.depto) AS Destino,
                    m.valor_total_viaje AS Total_Manifiesto,
                    CAST(REPLACE(IFNULL(man.valor_anticipo,'-'), ',', '') AS DECIMAL(15,2)) AS Anticipo, 
                    ag.nombre AS Agencia,
                    m.fecha_expedicion,
                    m.estadomnf_actual,
                COALESCE(cv.clase, 'SIN DEFINIR') AS tipo_vehiculo
				FROM
					cmx_manifiesto m
					INNER JOIN cmx_proveedores cd ON m.conductor_manifiesto = cd.numero_documento
					INNER JOIN cmx_municipios ori ON m.origen_viaje = ori.id
					INNER JOIN cmx_municipios des ON m.destino_viaje = des.id
					INNER JOIN cmx_agencias ag ON m.Lugar = ag.nombre
					INNER JOIN cmx_vehiculos v ON m.placa=v.placa
					INNER JOIN cmx_vehiculo2 v2 ON v.numdoc_vehiculo=v2.id_vehiculo
					INNER JOIN cmx_rndc_clase_vehiculo cv ON v2.clase_vehiculo=cv.id
					INNER JOIN cmx_manifiesto_estado mnfe ON m.id = mnfe.id_manifiesto";

            if ($Estado == 'Cumplidos') {
                $sql .= " INNER JOIN cmx_cumplido cu ON m.id = cu.manifiesto
                      LEFT JOIN cmx_manifiesto_anticipo man ON m.id = man.id_manifiesto
                      WHERE cu.fecha BETWEEN :fecha_inicio AND :fecha_final 
                      AND m.estadomnf_actual = 1";
            } elseif ($Estado == 'Sin Cumplir') {
                $sql .= " LEFT JOIN cmx_cumplido cu ON m.id = cu.manifiesto
                      LEFT JOIN cmx_manifiesto_anticipo man ON m.id = man.id_manifiesto
                      WHERE m.fecha_expedicion BETWEEN :fecha_inicio AND :fecha_final 
                      AND m.estadomnf_actual = 1
                      AND cu.manifiesto IS NULL";
            }

            $sql .= " ORDER BY Origen ASC";

            $inicio = (new DateTime($Fecha_Inicio, new DateTimeZone('America/Bogota')))->format('Y-m-d H:i:s');
            $fin    = (new DateTime($Fecha_Final, new DateTimeZone('America/Bogota')))->format('Y-m-d H:i:s');

            $stmt = $this->_db3->prepare($sql);
            $stmt->bindParam(':fecha_inicio', $inicio, PDO::PARAM_STR);
            $stmt->bindParam(':fecha_final', $fin, PDO::PARAM_STR);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return ['error' => $e->getMessage()];
        }
    }

    public function Detalle_Manifiestos_Agencia($Agencia, $Fecha_Inicio, $Fecha_Final)
    {
        try {
            $sql = "SELECT 
                    m.id AS Manifiesto, 
                    m.placa, 
                    CONCAT(cd.nombre,' ',cd.apellido1,' ',cd.apellido2) AS Conductor,
                    CONCAT(ori.municipio,' - ',ori.depto) AS Origen, 
                    CONCAT(des.municipio ,' - ', des.depto) AS Destino,
                    m.valor_total_viaje AS Total_Manifiesto,
                    CAST(REPLACE(IFNULL(man.valor_anticipo,'-'), ',', '') AS DECIMAL(15,2)) AS Anticipo, 
                    ag.nombre AS Agencia,
                    m.fecha_expedicion,
                    m.estadomnf_actual,
                COALESCE(cv.clase, 'SIN DEFINIR') AS tipo_vehiculo
				FROM
					cmx_manifiesto m
					INNER JOIN cmx_proveedores cd ON m.conductor_manifiesto = cd.numero_documento
					INNER JOIN cmx_municipios ori ON m.origen_viaje = ori.id
					INNER JOIN cmx_municipios des ON m.destino_viaje = des.id
					INNER JOIN cmx_agencias ag ON m.Lugar = ag.nombre
					INNER JOIN cmx_vehiculos v ON m.placa=v.placa
					INNER JOIN cmx_vehiculo2 v2 ON v.numdoc_vehiculo=v2.id_vehiculo
					INNER JOIN cmx_rndc_clase_vehiculo cv ON v2.clase_vehiculo=cv.id
					INNER JOIN cmx_manifiesto_estado mnfe ON m.id = mnfe.id_manifiesto
                    LEFT JOIN cmx_cumplido cu ON m.id = cu.manifiesto
                    LEFT JOIN cmx_manifiesto_anticipo man ON m.id = man.id_manifiesto
                    WHERE m.fecha_expedicion BETWEEN :fecha_inicio AND :fecha_final 
                      AND m.estadomnf_actual = 1";

            $sql .= " AND m.Lugar = :Agencia";

            $sql .= " ORDER BY Origen ASC";

            $inicio = (new DateTime($Fecha_Inicio, new DateTimeZone('America/Bogota')))->format('Y-m-d H:i:s');
            $fin    = (new DateTime($Fecha_Final, new DateTimeZone('America/Bogota')))->format('Y-m-d H:i:s');

            $stmt = $this->_db3->prepare($sql);
            $stmt->bindParam(':fecha_inicio', $inicio, PDO::PARAM_STR);
            $stmt->bindParam(':fecha_final', $fin, PDO::PARAM_STR);
            $stmt->bindParam(':Agencia', $Agencia, PDO::PARAM_STR);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return ['error' => $e->getMessage()];
        }
    }

    public function Graficos_General_Solicitudes($Fecha_Inicio, $Fecha_Final)
    {
        try {
            // Normalizar fechas a Bogotá
            $inicio = (new DateTime($Fecha_Inicio, new DateTimeZone('America/Bogota')))->format('Y-m-d');
            $fin    = (new DateTime($Fecha_Final, new DateTimeZone('America/Bogota')))->format('Y-m-d');

            $sql = "
                SELECT 
                    'TOTAL' AS tipo,
                    COUNT(*) AS cantidad
                FROM cmx_solicitud_vehiculo2 ss
                INNER JOIN cmx_preestudio_solicitudes_servicio se 
                    ON ss.nundoc_solicitud = se.id_servicio_cliente 
                AND se.clasificacion = 'E'
                INNER JOIN cmx_estudiov_completo ev 
                    ON se.id_solicitudpreestudio = ev.id_estudio
                WHERE ss.fecha BETWEEN :inicio AND :fin
                AND ev.estado_actu = 1

                UNION ALL

                SELECT 
                    ev.estado AS tipo,
                    COUNT(*) AS cantidad
                FROM cmx_solicitud_vehiculo2 ss
                INNER JOIN cmx_preestudio_solicitudes_servicio se 
                    ON ss.nundoc_solicitud = se.id_servicio_cliente 
                AND se.clasificacion = 'E'
                INNER JOIN cmx_estudiov_completo ev 
                    ON se.id_solicitudpreestudio = ev.id_estudio
                WHERE ss.fecha BETWEEN :inicio AND :fin
                AND ev.estado_actu = 1
                GROUP BY ev.estado
                ORDER BY cantidad ASC";

            $stmt = $this->_db3->prepare($sql);
            $stmt->bindParam(':inicio', $inicio);
            $stmt->bindParam(':fin', $fin);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return [
                'error'   => true,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    public function Graficos_Estudio_Responsable($Fecha_Inicio, $Fecha_Final, $Estado)
    {
        try {
            // === Resumen por responsable ===
            $sqlConteo = $this->_db3->prepare("
                SELECT 
                    u.nom_usuario AS responsable,
                    COUNT(DISTINCT CONCAT(ev.placa, '-', m.id)) AS total_vehiculos,
                    u.id AS usuario_id
                FROM cmx_estudio_vehiculo ev
                INNER JOIN cmx_estudiov_completo ec ON ev.id_estudio = ec.id_estudio
                INNER JOIN cmx_usuarios u ON ev.responsable = u.id
                INNER JOIN cmx_subasta_flete sf ON ec.id_estudio = sf.num_estudioseguridad
                INNER JOIN cmx_orden_cargue oc ON sf.numero_orden = oc.id
                INNER JOIN cmx_remesa_ordencargue ro ON oc.id = ro.id_orden_cargue
                INNER JOIN cmx_remesa r ON ro.id_remesa = r.id
                INNER JOIN cmx_manifiesto_remesa mr ON r.id = mr.id_remesa
                INNER JOIN cmx_manifiesto m ON mr.id_manifiesto = m.id
                WHERE ec.estado_actu = 1
                AND ec.estado = :estado
                AND m.estadomnf_actual = 1      -- ✅ excluir anulados
                AND ec.fecha BETWEEN :inicio AND :fin
                GROUP BY u.nom_usuario
                ORDER BY total_vehiculos DESC
            ");

            $sqlConteo->bindParam(':estado', $Estado, PDO::PARAM_STR);
            $sqlConteo->bindParam(':inicio', $Fecha_Inicio, PDO::PARAM_STR);
            $sqlConteo->bindParam(':fin', $Fecha_Final, PDO::PARAM_STR);
            $sqlConteo->execute();
            $resumen = $sqlConteo->fetchAll(PDO::FETCH_ASSOC);

            // === Detalle de vehículos ===
            // $sqlDetalle = $this->_db3->prepare("
            //     SELECT
            //         u.nom_usuario AS responsable,
            //         ev.placa,
            //         ev.usuario AS usuario_postulador,
            //         ev.operacion,
            //         ev.fecha
            //     FROM cmx_estudio_vehiculo ev
            //     INNER JOIN cmx_estudiov_completo ec ON ev.id_estudio = ec.id_estudio
            //     INNER JOIN cmx_usuarios u ON ev.responsable = u.id
            //     WHERE ec.estado_actu = 1
            //     AND ec.estado = :estado
            //     AND ec.fecha BETWEEN :inicio AND :fin
            //     ORDER BY u.nom_usuario, ev.placa
            // ");

            // $sqlDetalle->bindParam(':estado', $Estado, PDO::PARAM_STR);
            // $sqlDetalle->bindParam(':inicio', $Fecha_Inicio, PDO::PARAM_STR);
            // $sqlDetalle->bindParam(':fin', $Fecha_Final, PDO::PARAM_STR);
            // $sqlDetalle->execute();
            // $detalle = $sqlDetalle->fetchAll(PDO::FETCH_ASSOC);

            return [
                'resumen' => $resumen,
                // 'detalle' => $detalle
            ];
        } catch (PDOException $e) {
            return ['error' => $e->getMessage()];
        }
    }

    public function Detalle_Estudios_Responsable($Fecha_Inicio, $Fecha_Final, $Estado, $Responsable)
    {
        // === Detalle de vehículos ===
        $sqlDetalle = $this->_db3->prepare("
            SELECT DISTINCT
                u.nom_usuario AS responsable,
                ev.placa,
                ev.usuario AS usuario_postulador,
                ev.operacion,
                ev.fecha,
                m.id AS Manifiesto
            FROM cmx_estudio_vehiculo ev
            INNER JOIN cmx_estudiov_completo ec ON ev.id_estudio = ec.id_estudio
            INNER JOIN cmx_usuarios u ON ev.responsable = u.id
            INNER JOIN cmx_subasta_flete sf ON ec.id_estudio = sf.num_estudioseguridad
            INNER JOIN cmx_orden_cargue oc ON sf.numero_orden = oc.id
            INNER JOIN cmx_remesa_ordencargue ro ON oc.id = ro.id_orden_cargue
            INNER JOIN cmx_remesa r ON ro.id_remesa = r.id
            INNER JOIN cmx_manifiesto_remesa mr ON r.id = mr.id_remesa
            INNER JOIN cmx_manifiesto m ON mr.id_manifiesto = m.id
            WHERE ec.estado_actu = 1
            AND ec.estado = :estado
            AND ec.fecha BETWEEN :inicio AND :fin
            AND ev.responsable= :Responsable
            AND m.estadomnf_actual = 1
            ORDER BY u.nom_usuario, ev.placa
        ");
        $sqlDetalle->bindParam(':estado', $Estado, PDO::PARAM_STR);
        $sqlDetalle->bindParam(':inicio', $Fecha_Inicio, PDO::PARAM_STR);
        $sqlDetalle->bindParam(':fin', $Fecha_Final, PDO::PARAM_STR);
        $sqlDetalle->bindParam(':Responsable', $Responsable, PDO::PARAM_STR);
        $sqlDetalle->execute();
        $detalle = $sqlDetalle->fetchAll(PDO::FETCH_ASSOC);
        return $detalle;
    }

    public function GraficosGeneralIndicadoresSolicitudes($fecha_inicio, $fecha_final)
    {
        try {
            // 🔹 Total solicitudes
            $sqlTotal = "
            SELECT COUNT(DISTINCT csv.nundoc_solicitud) AS total_solicitudes
            FROM cmx_cotizaciones_serviciocliente csc
            INNER JOIN cmx_solicitud_vehiculo2 csv ON csc.n_cotizacion = csv.n_cotizacion
            WHERE csv.fecha BETWEEN :fecha_inicio AND :fecha_final
              AND csc.estado = 'F3'
              AND csc.estado_autorizado = 'autorizado'
        ";

            // 🔹 Solicitudes con remesa
            $sqlConManifiesto = "
            SELECT COUNT(DISTINCT csv.nundoc_solicitud) AS solicitudes_con_manifiesto
            FROM cmx_cotizaciones_serviciocliente AS csc
            INNER JOIN cmx_solicitud_vehiculo2 csv ON csc.n_cotizacion = csv.n_cotizacion
            INNER JOIN cmx_detalle_mercancia2 g ON csv.idpareja_origen_destino = g.id
            INNER JOIN cmx_orden_cargue oc ON csv.nundoc_solicitud = oc.mer_idservicio AND oc.estado = 1
            INNER JOIN cmx_remesa_ordencargue ro ON oc.id = ro.id_orden_cargue AND ro.estado = 1
            INNER JOIN cmx_remesa rm ON ro.id_remesa = rm.id AND rm.estado = 1
            INNER JOIN cmx_manifiesto_remesa mr ON rm.id = mr.id_remesa AND mr.estado = 1
            INNER JOIN cmx_manifiesto ma ON mr.id_manifiesto = ma.id
            INNER JOIN cmx_ruta_puntosentrega pe ON csv.nundoc_solicitud = pe.cod_ini_ruta
            WHERE csv.fecha BETWEEN :fecha_inicio AND :fecha_final
              AND csc.estado = 'F3'
              AND csc.estado_autorizado = 'autorizado'
        ";

            // 🔹 Solicitudes sin remesa
            $sqlSinManifiesto = "
            SELECT COUNT(csv.nundoc_solicitud) AS solicitudes_sin_manifiesto
            FROM cmx_cotizaciones_serviciocliente AS csc
            INNER JOIN cmx_solicitud_vehiculo2 csv ON csc.n_cotizacion = csv.n_cotizacion
            INNER JOIN cmx_detalle_mercancia2 g ON csv.idpareja_origen_destino = g.id
            LEFT JOIN cmx_orden_cargue oc ON csv.nundoc_solicitud = oc.mer_idservicio
            LEFT JOIN cmx_remesa_ordencargue ro ON oc.id = ro.id_orden_cargue
            LEFT JOIN cmx_remesa rm ON ro.id_remesa = rm.id
            LEFT JOIN cmx_manifiesto_remesa mr ON rm.id = mr.id_remesa
            LEFT JOIN cmx_manifiesto ma ON mr.id_manifiesto = ma.id
            LEFT JOIN cmx_ruta_puntosentrega pe ON csv.nundoc_solicitud = pe.cod_ini_ruta
            WHERE csv.estado IN ('Pendiente','Realizada','En_subasta','asignada','en_tramite','aprobado_prefiltro')
              AND csv.fecha BETWEEN :fecha_inicio AND :fecha_final
              AND csc.estado = 'F3'
              AND csc.estado_autorizado = 'autorizado'
              AND oc.mer_idservicio IS NULL
        ";

            // Ejecutar consultas
            $stmt = $this->_db3->prepare($sqlTotal);
            $stmt->execute([':fecha_inicio' => $fecha_inicio, ':fecha_final' => $fecha_final]);
            $total = $stmt->fetchColumn();

            $stmt = $this->_db3->prepare($sqlConManifiesto);
            $stmt->execute([':fecha_inicio' => $fecha_inicio, ':fecha_final' => $fecha_final]);
            $conManifiesto = $stmt->fetchColumn();

            $stmt = $this->_db3->prepare($sqlSinManifiesto);
            $stmt->execute([':fecha_inicio' => $fecha_inicio, ':fecha_final' => $fecha_final]);
            $sinManifiesto = $stmt->fetchColumn();

            // 🔹 Retornar en un solo array
            return [
                'total_solicitudes' => (int)$total,
                'solicitudes_con_manifiesto' => (int)$conManifiesto,
                'solicitudes_sin_manifiesto' => (int)$sinManifiesto
            ];
        } catch (PDOException $e) {
            return ['error' => $e->getMessage()];
        }
    }

    public function GraficosSolicitudesPorAgencia($fecha_inicio, $fecha_final, $tipo)
    {
        try {
            $resultados = [];

            // 🔹 SQL base para "sin manifiesto"
            $sqlSinManifiesto = "
            SELECT
                a.nombre AS agencia,
                COUNT(DISTINCT csv.nundoc_solicitud) AS solicitudes_sin_manifiesto
            FROM cmx_cotizaciones_serviciocliente AS csc
            INNER JOIN cmx_solicitud_vehiculo2 csv ON csc.n_cotizacion = csv.n_cotizacion
            INNER JOIN cmx_detalle_mercancia2 g ON csv.idpareja_origen_destino = g.id
            INNER JOIN cmx_para_tipo_vehiculo pp ON csv.tipo_vehiculo = pp.id
            INNER JOIN cmx_agencias a ON csv.agencia = a.id
            LEFT JOIN cmx_orden_cargue oc ON csv.nundoc_solicitud = oc.mer_idservicio
            LEFT JOIN cmx_remesa_ordencargue ro ON oc.id = ro.id_orden_cargue
            LEFT JOIN cmx_remesa rm ON ro.id_remesa = rm.id
            LEFT JOIN cmx_manifiesto_remesa mr ON rm.id = mr.id_remesa
            LEFT JOIN cmx_manifiesto ma ON mr.id_manifiesto = ma.id
            LEFT JOIN cmx_ruta_puntosentrega pe ON csv.nundoc_solicitud = pe.cod_ini_ruta
            WHERE csv.estado IN(
                'Pendiente', 'Realizada', 'En_subasta',
                'asignada', 'en_tramite', 'aprobado_prefiltro'
            )
            AND csc.estado = 'F3'
            AND csc.estado_autorizado = 'autorizado'
            AND csv.fecha BETWEEN :fecha_inicio AND :fecha_final
            AND oc.mer_idservicio IS NULL
            GROUP BY a.nombre
        ";

            // 🔹 SQL base para "con manifiesto"
            $sqlConManifiesto = "
            SELECT
                a.nombre AS agencia,
                COUNT(DISTINCT csv.nundoc_solicitud) AS solicitudes_con_manifiesto
            FROM cmx_cotizaciones_serviciocliente AS csc
            INNER JOIN cmx_solicitud_vehiculo2 csv ON csc.n_cotizacion = csv.n_cotizacion
            INNER JOIN cmx_detalle_mercancia2 g ON csv.idpareja_origen_destino = g.id
            INNER JOIN cmx_para_tipo_vehiculo pp ON csv.tipo_vehiculo = pp.id
            INNER JOIN cmx_agencias a ON csv.agencia = a.id
            INNER JOIN cmx_orden_cargue oc ON csv.nundoc_solicitud = oc.mer_idservicio AND oc.estado=1
            INNER JOIN cmx_remesa_ordencargue ro ON oc.id = ro.id_orden_cargue AND ro.estado=1
            INNER JOIN cmx_remesa rm ON ro.id_remesa = rm.id AND rm.estado=1
            INNER JOIN cmx_manifiesto_remesa mr ON rm.id = mr.id_remesa AND mr.estado=1
            INNER JOIN cmx_manifiesto ma ON mr.id_manifiesto = ma.id
            INNER JOIN cmx_ruta_puntosentrega pe ON csv.nundoc_solicitud = pe.cod_ini_ruta
            INNER JOIN cmx_vehiculos v ON ma.placa=v.placa
            INNER JOIN cmx_vehiculo2 v2 ON v.numdoc_vehiculo=v2.id_vehiculo
            INNER JOIN cmx_rndc_clase_vehiculo cv ON v2.clase_vehiculo=cv.id
            INNER JOIN cmx_preestudio_solicitudes_servicio se ON csv.nundoc_solicitud=se.id_servicio_cliente AND se.clasificacion='E'
            INNER JOIN cmx_estudio_vehiculo ev ON se.id_solicitudpreestudio=ev.id_estudio
            
            WHERE csc.estado = 'F3'
            AND csc.estado_autorizado = 'autorizado'
            AND csv.fecha BETWEEN :fecha_inicio AND :fecha_final
            GROUP BY a.nombre
        ";

            // INNER JOIN cmx_usuarios u ON ev.responsable=u.id

            // 🔹 Ejecutar según el tipo
            if ($tipo === 'Sin Manifiesto') {
                $stmt = $this->_db3->prepare($sqlSinManifiesto);
                $stmt->execute([
                    ':fecha_inicio' => $fecha_inicio,
                    ':fecha_final' => $fecha_final
                ]);
                $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } elseif ($tipo === 'Con Manifiesto') {
                $stmt = $this->_db3->prepare($sqlConManifiesto);
                $stmt->execute([
                    ':fecha_inicio' => $fecha_inicio,
                    ':fecha_final' => $fecha_final
                ]);
                $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                // 🔹 Si no envías tipo, se ejecutan ambos y se retornan separados
                $stmt = $this->_db3->prepare($sqlSinManifiesto);
                $stmt->execute([
                    ':fecha_inicio' => $fecha_inicio,
                    ':fecha_final' => $fecha_final
                ]);
                $sinManifiesto = $stmt->fetchAll(PDO::FETCH_ASSOC);

                $stmt = $this->_db3->prepare($sqlConManifiesto);
                $stmt->execute([
                    ':fecha_inicio' => $fecha_inicio,
                    ':fecha_final' => $fecha_final
                ]);
                $conManifiesto = $stmt->fetchAll(PDO::FETCH_ASSOC);

                $resultados = [
                    'sin_manifiesto' => $sinManifiesto,
                    'con_manifiesto' => $conManifiesto
                ];
            }

            return $resultados;
        } catch (PDOException $e) {
            return ['error' => $e->getMessage()];
        }
    }

    public function Detalle_Solicitudes($fecha_inicio, $fecha_final, $estado, $agencia = '')
    {
        $sql = "
            SELECT DISTINCT 
                csv.nundoc_solicitud,
                a.nombre AS Agencia,
                csc.nombre_cliente,
                g.tipo_mercancia,
                te.empaque,
                pp.nombre AS tipo_vehiculo,
                ma.placa,
                ma.id AS Manifiesto,
                cv.clase,
                csv.usuario_auditor,
                CONCAT(csv.fecha,' ',csv.hora) AS Fecha_Solicitud,
                CONCAT(ma.fecha_expedicion,' ',ma.hora_expedicion) AS Fecha_Expedicion,
                TIMESTAMPDIFF(DAY, CONCAT(csv.fecha,' ',csv.hora), CONCAT(ma.fecha_expedicion,' ',ma.hora_expedicion)) AS Diferencia_dias,
                TIMESTAMPDIFF(HOUR, CONCAT(csv.fecha,' ',csv.hora), CONCAT(ma.fecha_expedicion,' ',ma.hora_expedicion)) AS Diferencia_horas,
                TIMESTAMPDIFF(MINUTE, CONCAT(csv.fecha,' ',csv.hora), CONCAT(ma.fecha_expedicion,' ',ma.hora_expedicion)) AS Diferencia_minutos,
                u.nom_usuario AS Responsable
            FROM cmx_cotizaciones_serviciocliente AS csc
            INNER JOIN cmx_solicitud_vehiculo2 csv ON csc.n_cotizacion=csv.n_cotizacion                                      
            INNER JOIN cmx_detalle_mercancia2 g ON csv.idpareja_origen_destino=g.id                                          
            INNER JOIN cmx_agencias a ON csv.agencia = a.id                                                                 
            INNER JOIN cmx_para_tipo_empaque te ON g.tipo_empaque=te.id                                                     
            INNER JOIN cmx_para_tipo_vehiculo pp ON csv.tipo_vehiculo=pp.id                                                 
            INNER JOIN cmx_orden_cargue oc ON csv.nundoc_solicitud = oc.mer_idservicio AND oc.estado=1                      
            INNER JOIN cmx_remesa_ordencargue ro ON oc.id = ro.id_orden_cargue AND ro.estado=1                   
            INNER JOIN cmx_remesa rm ON ro.id_remesa = rm.id AND rm.estado=1                                     
            INNER JOIN cmx_manifiesto_remesa mr ON rm.id = mr.id_remesa AND mr.estado=1                          
            INNER JOIN cmx_manifiesto ma ON mr.id_manifiesto = ma.id                                             
            INNER JOIN cmx_ruta_puntosentrega pe ON csv.nundoc_solicitud = pe.cod_ini_ruta
            INNER JOIN cmx_vehiculos v ON ma.placa=v.placa
            INNER JOIN cmx_vehiculo2 v2 ON v.numdoc_vehiculo=v2.id_vehiculo
            INNER JOIN cmx_rndc_clase_vehiculo cv ON v2.clase_vehiculo=cv.id
            INNER JOIN cmx_preestudio_solicitudes_servicio se ON csv.nundoc_solicitud=se.id_servicio_cliente AND se.clasificacion='E'
            INNER JOIN cmx_estudio_vehiculo ev ON se.id_solicitudpreestudio=ev.id_estudio
            INNER JOIN cmx_usuarios u ON ev.responsable=u.id          
            WHERE csc.estado = 'F3'
            AND csc.estado_autorizado = 'autorizado'
            AND csv.fecha BETWEEN :fecha_inicio AND :fecha_final
        ";

        // Si viene agencia, la agregamos al WHERE
        $params = [
            ':fecha_inicio' => $fecha_inicio,
            ':fecha_final'  => $fecha_final,
        ];

        if (!empty($agencia)) {
            // $sql .= " AND ma.lugar = :agencia";
            $sql .= " AND a.nombre = :agencia";
            $params[':agencia'] = $agencia;
        }

        $sql .= " ORDER BY csv.nundoc_solicitud DESC";

        // Ejecutar con PDO
        $stmt = $this->_db3->prepare($sql);

        if ($estado === 'Con Manifiesto') {
            $stmt->execute($params);
        }

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function GraficosTipoVehiculos($Fecha_Inicio, $Fecha_Final)
    {
        try {
            // 🔹 Total solicitudes
            $sqlTotal = "
                SELECT
                    CONCAT(g.nombre, ' - ', g.descripcion) AS Configuracion,
                    g.nombre AS Configuracion_Simple,
                    COUNT(DISTINCT m.id) AS Total_Vehiculos,
                    g.id AS configuracion_id
                FROM
                    cmx_manifiesto m
                    INNER JOIN cmx_vehiculos v ON m.placa = v.placa
                    INNER JOIN cmx_vehiculo2 v2 ON v.numdoc_vehiculo = v2.id_vehiculo
                    INNER JOIN cmx_rndc_vehiculos_configuracion g ON v2.configuracion = g.id
                WHERE
                    m.fecha_expedicion BETWEEN :fecha_inicio AND :fecha_final
                    AND m.estadomnf_actual = 1
                GROUP BY
                    g.nombre
            ";

            // Ejecutar consultas
            $stmt = $this->_db3->prepare($sqlTotal);
            $stmt->execute([':fecha_inicio' => $Fecha_Inicio, ':fecha_final' => $Fecha_Final]);
            $total = $stmt->fetchAll();

            // 🔹 Retornar en un solo array
            return $total;
        } catch (PDOException $e) {
            return ['error' => $e->getMessage()];
        }
    }

    public function GraficasTipoVehiculosAgencia($Fecha_Inicio, $Fecha_Final, $Configuracion_id)
    {
        try {
            $sql = "
            SELECT
                m.lugar AS agencia,
                COUNT(DISTINCT m.id) AS total_vehiculos
            FROM cmx_manifiesto m
            INNER JOIN cmx_vehiculos v ON m.placa = v.placa
            INNER JOIN cmx_vehiculo2 v2 ON v.numdoc_vehiculo = v2.id_vehiculo
            INNER JOIN cmx_rndc_vehiculos_configuracion g ON v2.configuracion = g.id
            WHERE m.fecha_expedicion BETWEEN :fecha_inicio AND :fecha_final
              AND m.estadomnf_actual = 1
              AND g.id = :configuracion_id
            GROUP BY m.lugar
        ";

            $stmt = $this->_db3->prepare($sql);
            $stmt->execute([
                ':fecha_inicio'     => $Fecha_Inicio,
                ':fecha_final'      => $Fecha_Final,
                ':configuracion_id' => $Configuracion_id
            ]);

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return ['error' => $e->getMessage()];
        }
    }

    public function GraficasVehiculosPorResponsable($fecha_inicio, $fecha_final, $configuracion_id)
    {
        try {
            $sql = "
        SELECT
            t.Responsable,
            COUNT(*) AS Total_Vehiculos
        FROM (
            SELECT
                m.id AS manifiesto_id,
                (
                    SELECT u2.nom_usuario
                    FROM cmx_estudio_vehiculo ev2
                    INNER JOIN cmx_estudiov_completo evc2
                        ON ev2.id_estudio = evc2.id_estudio
                        AND evc2.estado_actu = 1
                    INNER JOIN cmx_usuarios u2
                        ON ev2.responsable = u2.id
                    WHERE ev2.placa = m.placa
                    ORDER BY evc2.fecha DESC
                    LIMIT 1
                ) AS Responsable
            FROM cmx_manifiesto m
            INNER JOIN cmx_vehiculos v ON m.placa = v.placa
            INNER JOIN cmx_vehiculo2 v2 ON v.numdoc_vehiculo = v2.id_vehiculo
            INNER JOIN cmx_rndc_vehiculos_configuracion g ON v2.configuracion = g.id
            WHERE m.fecha_expedicion BETWEEN :fecha_inicio AND :fecha_final
              AND m.estadomnf_actual = 1
              AND g.id = :configuracion_id
        ) AS t
        WHERE t.Responsable IS NOT NULL
        GROUP BY t.Responsable
        ORDER BY Total_Vehiculos DESC
        ";

            $stmt = $this->_db3->prepare($sql);
            $stmt->execute([
                ':fecha_inicio'     => $fecha_inicio,
                ':fecha_final'      => $fecha_final,
                ':configuracion_id' => $configuracion_id
            ]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return ['error' => $e->getMessage()];
        }
    }

    public function obtenerDetalleVehiculos($fecha_inicio, $fecha_fin)
    {
        try {
            $sql = "
                SELECT DISTINCT
                    m.id AS Manifiesto,
                    m.placa,
                    CONCAT(cond.nombre,' ',cond.apellido1,' ',cond.apellido2) AS Conductor,
                    cond.celular,
                    m.Lugar,
                    CONCAT(m.fecha_expedicion, ' ', m.hora_expedicion) AS Fecha_Expedicion,
                    CONCAT(g.nombre, ' - ', g.descripcion) AS Configuracion,
                    cv.clase,
                    CONCAT (ori.municipio, ' - ', ori.depto) AS Origen,
                    CONCAT (des.municipio, ' - ', des.depto) AS Destino
                FROM cmx_manifiesto m
                INNER JOIN cmx_vehiculos v ON m.placa = v.placa
                INNER JOIN cmx_vehiculo2 v2 ON v.numdoc_vehiculo = v2.id_vehiculo
                INNER JOIN cmx_proveedores cond ON v.id_conductor=cond.numdoc_nexos
                INNER JOIN cmx_rndc_vehiculos_configuracion g ON v2.configuracion = g.id
                INNER JOIN cmx_rndc_clase_vehiculo cv ON v2.clase_vehiculo = cv.id
                INNER JOIN cmx_municipios ori ON m.origen_viaje = ori.id
                INNER JOIN cmx_municipios des ON m.destino_viaje = des.id 
                INNER JOIN cmx_estudio_vehiculo ev ON m.placa = ev.placa
                INNER JOIN cmx_estudiov_completo evc ON ev.id_estudio = evc.id_estudio AND evc.estado_actu = 1
                INNER JOIN cmx_usuarios u ON ev.responsable = u.id
                WHERE m.fecha_expedicion BETWEEN :fecha_inicio AND :fecha_fin
                  AND m.estadomnf_actual = 1
            ";

            $stmt = $this->_db3->prepare($sql);
            $stmt->execute([
                ':fecha_inicio' => $fecha_inicio,
                ':fecha_fin'    => $fecha_fin
            ]);

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return ['error' => $e->getMessage()];
        }
    }

    // 🔹iNSTRCIONES DE FACUTRACION
    public function getInstruccionesFacturacion($fechaInicio, $fechaFinal)
    {
        $sql = "
            SELECT
                SUM(inf.total_factura) AS total_instrucciones,
                SUM(inf.total_servicios_especiales) AS total_servicios_especiales_mes,

                SUM(CASE WHEN inf.estado_instruccion IN ('Pendiente','Pendiente Facturar') 
                         THEN inf.total_factura ELSE 0 END) AS total_pendientes,

                SUM(CASE WHEN inf.estado_instruccion IN ('Pendiente','Pendiente Facturar') 
                         THEN inf.total_servicios_especiales ELSE 0 END) AS total_servicios_especiales_pendiente,

                SUM(CASE WHEN inf.estado_instruccion = 'Completada' 
                         THEN inf.total_factura ELSE 0 END) AS total_facturadas,

                SUM(CASE WHEN inf.estado_instruccion = 'Completada' 
                         THEN inf.total_servicios_especiales ELSE 0 END) AS total_servicios_especiales_facturado

            FROM cmx_instruccion_facturacion inf
            WHERE inf.fecha BETWEEN :fechaInicio AND :fechaFinal
        ";

        $stmt = $this->_db3->prepare($sql);
        $stmt->bindParam(":fechaInicio", $fechaInicio);
        $stmt->bindParam(":fechaFinal", $fechaFinal);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // 👉 Instrucciones facturación por cliente
    public function getFacturacionPorCliente($fechaInicio, $fechaFinal, $estado)
    {
        $sql = "
            SELECT 
                cl.nombre AS cliente,
                SUM(inf.total_factura) AS total_facturar
            FROM cmx_instruccion_facturacion inf
            INNER JOIN cmx_clientes cl ON inf.cliente_id = cl.id
            WHERE inf.fecha BETWEEN :fechaInicio AND :fechaFinal
            AND inf.estado_instruccion = :estado
            GROUP BY cl.nombre
            ORDER BY total_facturar DESC
        ";

        $estado_instruccion = $estado == 'Pendientes' ? 'Pendiente' : 'Completada';

        $stmt = $this->_db3->prepare($sql);
        $stmt->bindParam(":fechaInicio", $fechaInicio);
        $stmt->bindParam(":fechaFinal", $fechaFinal);
        $stmt->bindParam(":estado", $estado_instruccion);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getFacturacionPorComercial($fechaInicio, $fechaFinal, $estado)
    {
        $sql = "
                SELECT 
                    u.nom_usuario AS Usuario,
                    SUM(inf.total_instruccion) AS total_instruccion,
                    SUM(inf.total_servicios_especiales) AS total_servicio_especial,
                    SUM(inf.total_factura) AS total_facturacion
                FROM cmx_instruccion_facturacion inf
                INNER JOIN cmx_usuarios u ON inf.comercial_id=u.id
                WHERE inf.fecha BETWEEN :fechaInicio AND :fechaFinal
                AND inf.estado_instruccion = :estado
                GROUP BY u.nom_usuario
                ORDER BY total_facturacion DESC
            ";

        $estado_instruccion = $estado == 'Pendientes' ? 'Pendiente' : 'Completada';

        $stmt = $this->_db3->prepare($sql);
        $stmt->bindParam(":fechaInicio", $fechaInicio);
        $stmt->bindParam(":fechaFinal", $fechaFinal);
        $stmt->bindParam(":estado", $estado_instruccion);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // INDICADORES DE REMESAS
    public function getInstruccionesRemesas($fechaInicio, $fechaFinal)
    {
        $sql = $this->_db3->prepare("
            SELECT
                COUNT(*) AS total_remesas,
                SUM(dm.total_tarifa) AS total_valor,
                SUM(CASE WHEN r.estado_facturacion = 'Facturada' THEN dm.total_tarifa ELSE 0 END) AS total_facturadas,
                SUM(CASE WHEN r.estado_facturacion = 'Instruccion' THEN dm.total_tarifa ELSE 0 END) AS total_instruccion,
                SUM(CASE WHEN r.estado_facturacion = 'Pendiente' THEN dm.total_tarifa ELSE 0 END) AS total_pendientes
            FROM cmx_remesa r
            INNER JOIN cmx_solicitud_vehiculo2 ss ON r.mer_idservicio = ss.nundoc_solicitud
            INNER JOIN cmx_detalle_mercancia2 dm ON ss.n_cotizacion = dm.n_cotizacion
            WHERE r.fecha_creacion BETWEEN :fechaInicio AND :fechaFinal
        ");
        $sql->bindParam(":fechaInicio", $fechaInicio);
        $sql->bindParam(":fechaFinal", $fechaFinal);
        $sql->execute();

        return $sql->fetch(PDO::FETCH_ASSOC); // ← un solo registro
    }

    public function getInstruccionesRemesasAgencia($fechaInicio, $fechaFinal, $estado_instruccion)
    {
        $sql = $this->_db3->prepare("SELECT
            ag.nombre AS agencia,
            COUNT(DISTINCT r.id) AS 'total remesas'
        FROM
            cmx_remesa r
            INNER JOIN cmx_solicitud_vehiculo2 ss ON r.mer_idservicio = ss.nundoc_solicitud
            INNER JOIN cmx_agencias ag ON ss.agencia = ag.id
        WHERE
            r.fecha_creacion BETWEEN :fechaInicio
            AND :fechaFinal
            AND r.estado_facturacion= :estado -- Estado
        GROUP BY
            ag.nombre");

        $mapa = [
            'Pendientes' => 'Pendiente',
            'Facturadas' => 'Facturada'
        ];

        $estado = $mapa[$estado_instruccion] ?? $estado_instruccion;

        $sql->bindParam(":fechaInicio", $fechaInicio);
        $sql->bindParam(":fechaFinal", $fechaFinal);
        $sql->bindParam(":estado", $estado);
        $sql->execute();

        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getInstruccionesRemesasClientes($fechaInicio, $fechaFinal, $estado_instruccion)
    {
        $sql = $this->_db3->prepare("SELECT
            cl.nombre AS cliente,
            COUNT(DISTINCT r.id) AS 'total remesas'
        FROM
            cmx_remesa r
            INNER JOIN cmx_solicitud_vehiculo2 ss ON r.mer_idservicio = ss.nundoc_solicitud
            INNER JOIN cmx_remesa_ordencargue ro ON r.id=ro.id_remesa
            INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue=oc.id
            INNER JOIN cmx_clientes cl ON oc.cli_id=cl.id
        WHERE
            r.fecha_creacion BETWEEN :fechaInicio
            AND :fechaFinal
            AND r.estado_facturacion= :estado -- Estado
        GROUP BY
            cl.nombre");

        $mapa = [
            'Pendientes' => 'Pendiente',
            'Facturadas' => 'Facturada'
        ];

        $estado = $mapa[$estado_instruccion] ?? $estado_instruccion;

        $sql->bindParam(":fechaInicio", $fechaInicio);
        $sql->bindParam(":fechaFinal", $fechaFinal);
        $sql->bindParam(":estado", $estado);
        $sql->execute();

        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getDetalleRemesas($fechaInicio, $fechaFinal, $estado_instruccion)
    {
        $sql = $this->_db3->prepare("SELECT
            r.id AS Remesa,
            CONCAT(r.fecha_creacion,' ',r.hora_creacion) AS Fecha_remesa,
            cl.nombre AS cliente,
            ag.nombre AS agencia,
            dm.total_tarifa,
            CASE 
                WHEN cr.id IS NULL THEN 'No cumplida'
                WHEN cr.estado = 1 THEN 'Cumplida'
                ELSE 'No cumplida'
            END AS Estado_Remesa,
            CONCAT(cr.fecha,' ',cr.hora) AS Fecha_cumplido
        FROM cmx_remesa r
            INNER JOIN cmx_solicitud_vehiculo2 ss ON r.mer_idservicio = ss.nundoc_solicitud
            INNER JOIN cmx_remesa_ordencargue ro ON r.id=ro.id_remesa
            INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue=oc.id
            INNER JOIN cmx_clientes cl ON oc.cli_id=cl.id
            INNER JOIN cmx_detalle_mercancia2 dm ON ss.n_cotizacion=dm.n_cotizacion
            INNER JOIN cmx_agencias ag ON ss.agencia = ag.id
            LEFT JOIN cmx_cumplido_remesa cr ON r.id = cr.id_remesa -- 👈 LEFT JOIN para ver las que no existen
        WHERE
            r.fecha_creacion BETWEEN :fechaInicio AND :fechaFinal
            AND r.estado_facturacion = :estado
        GROUP BY
            r.id");

        $mapa = [
            'Pendientes' => 'Pendiente',
            'Facturadas' => 'Facturada'
        ];

        $estado = $mapa[$estado_instruccion] ?? $estado_instruccion;

        $sql->bindParam(":fechaInicio", $fechaInicio);
        $sql->bindParam(":fechaFinal", $fechaFinal);
        $sql->bindParam(":estado", $estado);
        $sql->execute();

        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    // public function getEstudiosYPrefiltros($fecha_inicio, $fecha_fin, $analista)
    public function getEstudiosYPrefiltros($fecha_inicio, $fecha_fin)
    {
        $sql = "
            SELECT
                -- Total de estudios en el rango
                (SELECT COUNT(ev.id) 
                 FROM cmx_estudio_vehiculo ev
                 WHERE ev.fecha BETWEEN :inicio AND :fin
                ) AS total_estudios,

                -- Prefiltros sin evolucionar a estudio
                (SELECT COUNT(DISTINCT pre.placa_vehiculo) 
                 FROM cmx_vehiculos_preestudio pre
                 LEFT JOIN cmx_log_solicitudvehiculo2 lop 
                        ON pre.id = lop.id_solictud
                 WHERE lop.id_solictud IS NULL
                   AND pre.fecha BETWEEN :inicio AND :fin
                ) AS total_prefiltros
        ";

        $stmt = $this->_db3->prepare($sql);
        $stmt->bindParam(':inicio', $fecha_inicio);
        $stmt->bindParam(':fin', $fecha_fin);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function DetalleSolicitudesEstudio($Estado, $fecha_inicio, $fecha_fin, $Analista)
    {

        if ($Estado == 'Total Estudios') {

            if (empty($Analista)) {
                $sql = $this->_db3->prepare("SELECT
                    ev.id_estudio,
                    v.placa,
                    cd.numero_documento,
                    CONCAT(cd.nombre, ' ', cd.apellido1, ' ', cd.apellido2) AS Conductor,
                    ec.estado,
                    CONCAT(ev.fecha, ' ', ev.hora) AS Fecha_Registro,
                    CONCAT(ec.fecha, ' ', ec.hora) AS Fecha_Respuesta,
                    u.nom_usuario AS Responsable,
                    ec.usuario AS Analista,
                    CASE 
                        WHEN TIME(STR_TO_DATE(CONCAT(ec.fecha, ' ', ec.hora), '%Y-%m-%d %H:%i:%s')) = '24:00:00'
                        THEN CONCAT_WS(' ',
                            CASE WHEN TIMESTAMPDIFF(DAY, CONCAT(ev.fecha, ' ', ev.hora), DATE_ADD(STR_TO_DATE(CONCAT(ec.fecha, ' ', '23:59:59'), '%Y-%m-%d %H:%i:%s'), INTERVAL 1 SECOND)) > 0 
                                THEN CONCAT(TIMESTAMPDIFF(DAY, CONCAT(ev.fecha, ' ', ev.hora), DATE_ADD(STR_TO_DATE(CONCAT(ec.fecha, ' ', '23:59:59'), '%Y-%m-%d %H:%i:%s'), INTERVAL 1 SECOND)), ' días')
                                ELSE NULL END,
                            CASE WHEN TIMESTAMPDIFF(HOUR, CONCAT(ev.fecha, ' ', ev.hora), DATE_ADD(STR_TO_DATE(CONCAT(ec.fecha, ' ', '23:59:59'), '%Y-%m-%d %H:%i:%s'), INTERVAL 1 SECOND)) % 24 > 0 
                                THEN CONCAT(TIMESTAMPDIFF(HOUR, CONCAT(ev.fecha, ' ', ev.hora), DATE_ADD(STR_TO_DATE(CONCAT(ec.fecha, ' ', '23:59:59'), '%Y-%m-%d %H:%i:%s'), INTERVAL 1 SECOND)) % 24, ' horas')
                                ELSE NULL END,
                            CASE WHEN TIMESTAMPDIFF(MINUTE, CONCAT(ev.fecha, ' ', ev.hora), DATE_ADD(STR_TO_DATE(CONCAT(ec.fecha, ' ', '23:59:59'), '%Y-%m-%d %H:%i:%s'), INTERVAL 1 SECOND)) % 60 > 0 
                                THEN CONCAT(TIMESTAMPDIFF(MINUTE, CONCAT(ev.fecha, ' ', ev.hora), DATE_ADD(STR_TO_DATE(CONCAT(ec.fecha, ' ', '23:59:59'), '%Y-%m-%d %H:%i:%s'), INTERVAL 1 SECOND)) % 60, ' minutos')
                                ELSE NULL END
                        )
                        ELSE CONCAT_WS(' ',
                            CASE WHEN TIMESTAMPDIFF(DAY, CONCAT(ev.fecha, ' ', ev.hora), CONCAT(ec.fecha, ' ', ec.hora)) > 0 
                                THEN CONCAT(TIMESTAMPDIFF(DAY, CONCAT(ev.fecha, ' ', ev.hora), CONCAT(ec.fecha, ' ', ec.hora)), ' días')
                                ELSE NULL END,
                            CASE WHEN TIMESTAMPDIFF(HOUR, CONCAT(ev.fecha, ' ', ev.hora), CONCAT(ec.fecha, ' ', ec.hora)) % 24 > 0 
                                THEN CONCAT(TIMESTAMPDIFF(HOUR, CONCAT(ev.fecha, ' ', ev.hora), CONCAT(ec.fecha, ' ', ec.hora)) % 24, ' horas')
                                ELSE NULL END,
                            CASE WHEN TIMESTAMPDIFF(MINUTE, CONCAT(ev.fecha, ' ', ev.hora), CONCAT(ec.fecha, ' ', ec.hora)) % 60 > 0 
                                THEN CONCAT(TIMESTAMPDIFF(MINUTE, CONCAT(ev.fecha, ' ', ev.hora), CONCAT(ec.fecha, ' ', ec.hora)) % 60, ' minutos')
                                ELSE NULL END
                        )
                    END AS Tiempo_Transcurrido
                FROM
                    cmx_estudio_vehiculo ev
                    INNER JOIN (
                        SELECT *,
                            ROW_NUMBER() OVER (PARTITION BY id_estudio ORDER BY fecha DESC, hora DESC) as rn
                        FROM cmx_estudiov_completo 
                        WHERE estado_actu = 1 AND estado='Aprobado'
                    ) ec ON ev.id_estudio = ec.id_estudio AND ec.rn = 1
                    INNER JOIN cmx_vehiculos v ON ec.id_vehiculo = v.numdoc_vehiculo
                    INNER JOIN cmx_proveedores cd ON ec.id_conductor = cd.numdoc_nexos
                    INNER JOIN cmx_usuarios u ON ev.responsable = u.id
                WHERE
                    ev.fecha BETWEEN :Fecha_Inicio AND :Fecha_Fin");
            } else {
                $sql = $this->_db3->prepare("SELECT
                    ev.id_estudio,
                    v.placa,
                    cd.numero_documento,
                    CONCAT(cd.nombre, ' ', cd.apellido1, ' ', cd.apellido2) AS Conductor,
                    ec.estado,
                    CONCAT(ev.fecha, ' ', ev.hora) AS Fecha_Registro,
                    CONCAT(ec.fecha, ' ', ec.hora) AS Fecha_Respuesta,
                    u.nom_usuario AS Responsable,
                    ec.usuario AS Analista,
                    CASE 
                        WHEN TIME(STR_TO_DATE(CONCAT(ec.fecha, ' ', ec.hora), '%Y-%m-%d %H:%i:%s')) = '24:00:00'
                        THEN CONCAT_WS(' ',
                            CASE WHEN TIMESTAMPDIFF(DAY, CONCAT(ev.fecha, ' ', ev.hora), DATE_ADD(STR_TO_DATE(CONCAT(ec.fecha, ' ', '23:59:59'), '%Y-%m-%d %H:%i:%s'), INTERVAL 1 SECOND)) > 0 
                                THEN CONCAT(TIMESTAMPDIFF(DAY, CONCAT(ev.fecha, ' ', ev.hora), DATE_ADD(STR_TO_DATE(CONCAT(ec.fecha, ' ', '23:59:59'), '%Y-%m-%d %H:%i:%s'), INTERVAL 1 SECOND)), ' días')
                                ELSE NULL END,
                            CASE WHEN TIMESTAMPDIFF(HOUR, CONCAT(ev.fecha, ' ', ev.hora), DATE_ADD(STR_TO_DATE(CONCAT(ec.fecha, ' ', '23:59:59'), '%Y-%m-%d %H:%i:%s'), INTERVAL 1 SECOND)) % 24 > 0 
                                THEN CONCAT(TIMESTAMPDIFF(HOUR, CONCAT(ev.fecha, ' ', ev.hora), DATE_ADD(STR_TO_DATE(CONCAT(ec.fecha, ' ', '23:59:59'), '%Y-%m-%d %H:%i:%s'), INTERVAL 1 SECOND)) % 24, ' horas')
                                ELSE NULL END,
                            CASE WHEN TIMESTAMPDIFF(MINUTE, CONCAT(ev.fecha, ' ', ev.hora), DATE_ADD(STR_TO_DATE(CONCAT(ec.fecha, ' ', '23:59:59'), '%Y-%m-%d %H:%i:%s'), INTERVAL 1 SECOND)) % 60 > 0 
                                THEN CONCAT(TIMESTAMPDIFF(MINUTE, CONCAT(ev.fecha, ' ', ev.hora), DATE_ADD(STR_TO_DATE(CONCAT(ec.fecha, ' ', '23:59:59'), '%Y-%m-%d %H:%i:%s'), INTERVAL 1 SECOND)) % 60, ' minutos')
                                ELSE NULL END
                        )
                        ELSE CONCAT_WS(' ',
                            CASE WHEN TIMESTAMPDIFF(DAY, CONCAT(ev.fecha, ' ', ev.hora), CONCAT(ec.fecha, ' ', ec.hora)) > 0 
                                THEN CONCAT(TIMESTAMPDIFF(DAY, CONCAT(ev.fecha, ' ', ev.hora), CONCAT(ec.fecha, ' ', ec.hora)), ' días')
                                ELSE NULL END,
                            CASE WHEN TIMESTAMPDIFF(HOUR, CONCAT(ev.fecha, ' ', ev.hora), CONCAT(ec.fecha, ' ', ec.hora)) % 24 > 0 
                                THEN CONCAT(TIMESTAMPDIFF(HOUR, CONCAT(ev.fecha, ' ', ev.hora), CONCAT(ec.fecha, ' ', ec.hora)) % 24, ' horas')
                                ELSE NULL END,
                            CASE WHEN TIMESTAMPDIFF(MINUTE, CONCAT(ev.fecha, ' ', ev.hora), CONCAT(ec.fecha, ' ', ec.hora)) % 60 > 0 
                                THEN CONCAT(TIMESTAMPDIFF(MINUTE, CONCAT(ev.fecha, ' ', ev.hora), CONCAT(ec.fecha, ' ', ec.hora)) % 60, ' minutos')
                                ELSE NULL END
                        )
                    END AS Tiempo_Transcurrido
                FROM
                    cmx_estudio_vehiculo ev
                    INNER JOIN (
                        SELECT *,
                            ROW_NUMBER() OVER (PARTITION BY id_estudio ORDER BY fecha DESC, hora DESC) as rn
                        FROM cmx_estudiov_completo 
                        WHERE estado_actu = 1 AND estado='Aprobado'
                    ) ec ON ev.id_estudio = ec.id_estudio AND ec.rn = 1
                    INNER JOIN cmx_vehiculos v ON ec.id_vehiculo = v.numdoc_vehiculo
                    INNER JOIN cmx_proveedores cd ON ec.id_conductor = cd.numdoc_nexos
                    INNER JOIN cmx_usuarios u ON ev.responsable = u.id
                WHERE
                    ev.fecha BETWEEN :Fecha_Inicio AND :Fecha_Fin AND ec.usuario=:Analista");
            }
        } else if ($Estado == 'Prefiltros sin Estudio') {

            $sql = $this->_db3->prepare("SELECT 
                vp.id AS id_estudio, 
                vp.placa_vehiculo AS placa,
                vp.documento_conductor AS numero_documento,
                vp.nombre_conductor AS Conductor,
                se.estado,
                CONCAT(vp.fecha, ' ', vp.hora) AS Fecha_Registro,
                CONCAT(se.fecha, ' ', se.hora) AS Fecha_Respuesta,
                u.nom_usuario AS Responsable,
                se.usuario AS Analista,
                -- ⏱ Tiempo Transcurrido en formato dinámico
                CASE
                    WHEN TIMESTAMPDIFF(DAY, CONCAT(vp.fecha, ' ', vp.hora), CONCAT(se.fecha, ' ', se.hora)) > 0 
                        THEN CONCAT(
                            TIMESTAMPDIFF(DAY, CONCAT(vp.fecha, ' ', vp.hora), CONCAT(se.fecha, ' ', se.hora)), ' días ',
                            MOD(TIMESTAMPDIFF(HOUR, CONCAT(vp.fecha, ' ', vp.hora), CONCAT(se.fecha, ' ', se.hora)), 24), ' horas ',
                            MOD(TIMESTAMPDIFF(MINUTE, CONCAT(vp.fecha, ' ', vp.hora), CONCAT(se.fecha, ' ', se.hora)), 60), ' minutos'
                        )
                    WHEN TIMESTAMPDIFF(HOUR, CONCAT(vp.fecha, ' ', vp.hora), CONCAT(se.fecha, ' ', se.hora)) > 0 
                        THEN CONCAT(
                            TIMESTAMPDIFF(HOUR, CONCAT(vp.fecha, ' ', vp.hora), CONCAT(se.fecha, ' ', se.hora)), ' horas ',
                            MOD(TIMESTAMPDIFF(MINUTE, CONCAT(vp.fecha, ' ', vp.hora), CONCAT(se.fecha, ' ', se.hora)), 60), ' minutos'
                        )
                    ELSE CONCAT(
                        TIMESTAMPDIFF(MINUTE, CONCAT(vp.fecha, ' ', vp.hora), CONCAT(se.fecha, ' ', se.hora)), ' minutos'
                    )
                END AS Tiempo_Transcurrido

            FROM cmx_vehiculos_preestudio vp
            INNER JOIN (
                SELECT *,
                    ROW_NUMBER() OVER (PARTITION BY id_solicitud ORDER BY fecha DESC) as rn
                FROM cmx_solicitudes_estados 
                WHERE estado_actual = 1
            ) se ON vp.id = se.id_solicitud AND se.rn = 1
            INNER JOIN cmx_usuarios u ON vp.responsable = u.id
            LEFT JOIN cmx_log_solicitudvehiculo2 lop ON vp.id = lop.id_solictud
            WHERE
                vp.fecha BETWEEN :Fecha_Inicio AND :Fecha_Fin AND lop.id_solictud IS NULL
            GROUP BY vp.placa_vehiculo");
        }

        $sql->bindParam(':Fecha_Inicio', $fecha_inicio);
        $sql->bindParam(':Fecha_Fin', $fecha_fin);

        if ($Analista) $sql->bindParam(':Analista', $Analista);

        $sql->execute();

        return $sql->fetchAll(PDO::FETCH_ASSOC); // 👈 IMPORTANTE
    }

    public function TotalViajes($fecha_inicio, $fecha_fin, $placa)
    {
        $sql = $this->_db3->prepare("SELECT 
            COUNT(*) AS total_viajes,
            COUNT(CASE WHEN m.estadomnf_actual IN (1) THEN m.id ELSE NULL END) AS viajes_activos,
            COUNT(CASE WHEN m.estadomnf_actual IN (0) THEN m.id ELSE NULL END) AS viajes_anulados
        FROM cmx_manifiesto m 
        WHERE m.placa = :placa AND m.fecha_expedicion BETWEEN :Fecha_Inicio AND :Fecha_Final");

        $sql->bindParam(':placa', $placa);
        $sql->bindParam(':inicio', $fecha_inicio);
        $sql->bindParam(':fin', $fecha_fin);
        $sql->execute();

        return $sql->fetch(PDO::FETCH_ASSOC);
    }

    public function GetPlacasFiltros()
    {
        $sql = $this->_db3->prepare("SELECT id, placa FROM cmx_vehiculos ORDER BY placa ASC");
        $sql->execute();

        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function GetMunicipiosFiltros()
    {
        $sql = $this->_db3->prepare("SELECT id, CONCAT(municipio,' ',depto) AS Destino FROM cmx_municipios ORDER BY municipio ASC");
        $sql->execute();

        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function GetClientesFiltros()
    {
        $sql = $this->_db3->prepare("SELECT id, nombre FROM cmx_clientes ORDER BY nombre ASC");
        $sql->execute();

        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function GetConfiguracionFiltros()
    {
        $sql = $this->_db3->prepare("SELECT c.nombre, CONCAT(c.nombre,' - ',c.descripcion) AS Configuracion FROM cmx_rndc_vehiculos_configuracion c WHERE c.tipo='Completa' ORDER BY c.nombre ASC");
        $sql->execute();

        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function DetalleAnaliticaDatos($placa, $conductor, $fecha_inicio, $fecha_fin)
    {
        $data = [];

        if (empty($placa)) {

            // 📌 Placas
            $sql = $this->_db3->prepare("
            SELECT 
                COUNT(*) AS total_viajes,
                COUNT(CASE WHEN m.estadomnf_actual = 1 THEN m.id END) AS viajes_activos,
                COUNT(CASE WHEN m.estadomnf_actual = 0 THEN m.id END) AS viajes_anulados
            FROM cmx_manifiesto m 
            WHERE m.conductor_manifiesto = :Conductor AND m.fecha_expedicion BETWEEN :Fecha_Inicio AND :Fecha_Final
        ");
            $sql->bindParam(':Conductor', $conductor);
            $sql->bindParam(':Fecha_Inicio', $fecha_inicio);
            $sql->bindParam(':Fecha_Final', $fecha_fin);
            $sql->execute();
            $data['placas'] = $sql->fetch(PDO::FETCH_ASSOC);

            // 📌 Destinos
            $sql = $this->_db3->prepare("
            SELECT 
                CONCAT(des.municipio,' - ',des.depto) AS destino,
                COUNT(DISTINCT m.id) AS total_viajes
            FROM cmx_manifiesto m 
            INNER JOIN cmx_municipios des ON m.destino_viaje=des.id
            WHERE m.conductor_manifiesto = :Conductor AND m.fecha_expedicion BETWEEN :Fecha_Inicio AND :Fecha_Final
            GROUP BY m.destino_viaje
        ");
            $sql->bindParam(':Conductor', $conductor);
            $sql->bindParam(':Fecha_Inicio', $fecha_inicio);
            $sql->bindParam(':Fecha_Final', $fecha_fin);
            $sql->execute();
            $data['destinos'] = $sql->fetchAll(PDO::FETCH_ASSOC);

            // 📌 Clientes
            $sql = $this->_db3->prepare("
            SELECT 
                cl.id AS cliente_id,
                cl.nombre AS cliente_nombre,
                COUNT(DISTINCT m.id) AS total_viajes
            FROM cmx_manifiesto m 
            INNER JOIN cmx_manifiesto_remesa mr ON m.id = mr.id_manifiesto
            INNER JOIN cmx_remesa r ON mr.id_remesa = r.id
            INNER JOIN cmx_remesa_ordencargue ro ON r.id = ro.id_remesa
            INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue = oc.id
            INNER JOIN cmx_clientes cl ON oc.cli_id = cl.id
            WHERE m.conductor_manifiesto = :Conductor AND m.fecha_expedicion BETWEEN :Fecha_Inicio AND :Fecha_Final
            GROUP BY cl.id, cl.nombre
        ");
            $sql->bindParam(':Conductor', $conductor);
            $sql->bindParam(':Fecha_Inicio', $fecha_inicio);
            $sql->bindParam(':Fecha_Final', $fecha_fin);
            $sql->execute();
            $data['clientes'] = $sql->fetchAll(PDO::FETCH_ASSOC);
        } else {
            // 📌 Placas
            $sql = $this->_db3->prepare("
                        SELECT 
                            COUNT(*) AS total_viajes,
                            COUNT(CASE WHEN m.estadomnf_actual = 1 THEN m.id END) AS viajes_activos,
                            COUNT(CASE WHEN m.estadomnf_actual = 0 THEN m.id END) AS viajes_anulados
                        FROM cmx_manifiesto m 
                        WHERE m.placa = :Placa AND m.fecha_expedicion BETWEEN :Fecha_Inicio AND :Fecha_Final
                    ");
            $sql->bindParam(':Placa', $placa);
            $sql->bindParam(':Fecha_Inicio', $fecha_inicio);
            $sql->bindParam(':Fecha_Final', $fecha_fin);
            $sql->execute();
            $data['placas'] = $sql->fetch(PDO::FETCH_ASSOC);

            // 📌 Destinos
            $sql = $this->_db3->prepare("
                        SELECT 
                            CONCAT(des.municipio,' - ',des.depto) AS destino,
                            COUNT(DISTINCT m.id) AS total_viajes
                        FROM cmx_manifiesto m 
                        INNER JOIN cmx_municipios des ON m.destino_viaje=des.id
                        WHERE m.placa = :Placa AND m.fecha_expedicion BETWEEN :Fecha_Inicio AND :Fecha_Final
                        GROUP BY m.destino_viaje
                    ");
            $sql->bindParam(':Placa', $placa);
            $sql->bindParam(':Fecha_Inicio', $fecha_inicio);
            $sql->bindParam(':Fecha_Final', $fecha_fin);
            $sql->execute();
            $data['destinos'] = $sql->fetchAll(PDO::FETCH_ASSOC);

            // 📌 Clientes
            $sql = $this->_db3->prepare("
                        SELECT 
                            cl.id AS cliente_id,
                            cl.nombre AS cliente_nombre,
                            COUNT(DISTINCT m.id) AS total_viajes
                        FROM cmx_manifiesto m 
                        INNER JOIN cmx_manifiesto_remesa mr ON m.id = mr.id_manifiesto
                        INNER JOIN cmx_remesa r ON mr.id_remesa = r.id
                        INNER JOIN cmx_remesa_ordencargue ro ON r.id = ro.id_remesa
                        INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue = oc.id
                        INNER JOIN cmx_clientes cl ON oc.cli_id = cl.id
                        WHERE m.placa = :Placa AND m.fecha_expedicion BETWEEN :Fecha_Inicio AND :Fecha_Final
                        GROUP BY cl.id, cl.nombre
                    ");
            $sql->bindParam(':Placa', $placa);
            $sql->bindParam(':Fecha_Inicio', $fecha_inicio);
            $sql->bindParam(':Fecha_Final', $fecha_fin);
            $sql->execute();
            $data['clientes'] = $sql->fetchAll(PDO::FETCH_ASSOC);
        }

        return $data;
    }

    public function Detalle_Analitica($placa, $conductor, $fecha_inicio, $fecha_fin)
    {
        if (empty($placa)) {
            $sql = $this->_db3->prepare("SELECT 
            m.id AS Manifiesto,
            m.num_autorizacion AS Radicado,
            CONCAT(ori.municipio,' - ',ori.depto) AS Origen,
            CONCAT(des.municipio,' - ',des.depto) AS Destino,
            CONCAT(m.fecha_expedicion, ' ', m.hora_expedicion) AS Fecha_Expedicion,
            CONCAT(cod.nombre, ' ', IFNULL(cod.apellido1, ''), ' ', IFNULL(cod.apellido2, '')) AS Conductor,
            CASE m.estadomnf_actual
                WHEN 1 THEN 'Activo'
                WHEN 0 THEN 'Inactivo'
                ELSE 'Desconocido'
            END AS Estado_Manifiesto,
            me.usuario AS Planillador
        FROM cmx_manifiesto m 
        INNER JOIN cmx_manifiesto_remesa mr ON m.id = mr.id_manifiesto
        INNER JOIN cmx_remesa r ON mr.id_remesa = r.id
        INNER JOIN cmx_remesa_ordencargue ro ON r.id = ro.id_remesa
        INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue = oc.id
        INNER JOIN cmx_clientes cl ON oc.cli_id = cl.id
        INNER JOIN cmx_proveedores cod ON m.conductor_manifiesto = cod.numero_documento
        INNER JOIN cmx_manifiesto_estado me ON m.id=me.id_manifiesto
        INNER JOIN cmx_municipios ori ON m.origen_viaje=ori.id
        INNER JOIN cmx_municipios des ON m.destino_viaje=des.id
        WHERE m.conductor_manifiesto = :Conductor 
        AND m.fecha_expedicion BETWEEN :Fecha_Inicio AND :Fecha_Final
        GROUP BY m.id, m.num_autorizacion, m.fecha_expedicion, m.hora_expedicion, 
                cod.nombre, cod.apellido1, cod.apellido2, m.estadomnf_actual,
                cl.id, cl.nombre");
            $sql->bindParam(':Conductor', $conductor);
            $sql->bindParam(':Fecha_Inicio', $fecha_inicio);
            $sql->bindParam(':Fecha_Final', $fecha_fin);
            $sql->execute();
            // return $sql->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $sql = $this->_db3->prepare("SELECT 
            m.id AS Manifiesto,
            m.num_autorizacion AS Radicado,
            CONCAT(ori.municipio,' - ',ori.depto) AS Origen,
            CONCAT(des.municipio,' - ',des.depto) AS Destino,
            CONCAT(m.fecha_expedicion, ' ', m.hora_expedicion) AS Fecha_Expedicion,
            CONCAT(cod.nombre, ' ', IFNULL(cod.apellido1, ''), ' ', IFNULL(cod.apellido2, '')) AS Conductor,
            CASE m.estadomnf_actual
                WHEN 1 THEN 'Activo'
                WHEN 0 THEN 'Inactivo'
                ELSE 'Desconocido'
            END AS Estado_Manifiesto,
            me.usuario AS Planillador
        FROM cmx_manifiesto m 
        INNER JOIN cmx_manifiesto_remesa mr ON m.id = mr.id_manifiesto
        INNER JOIN cmx_remesa r ON mr.id_remesa = r.id
        INNER JOIN cmx_remesa_ordencargue ro ON r.id = ro.id_remesa
        INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue = oc.id
        INNER JOIN cmx_clientes cl ON oc.cli_id = cl.id
        INNER JOIN cmx_proveedores cod ON m.conductor_manifiesto = cod.numero_documento
        INNER JOIN cmx_manifiesto_estado me ON m.id=me.id_manifiesto
        INNER JOIN cmx_municipios ori ON m.origen_viaje=ori.id
        INNER JOIN cmx_municipios des ON m.destino_viaje=des.id
        WHERE m.placa = :Placa 
        AND m.fecha_expedicion BETWEEN :Fecha_Inicio AND :Fecha_Final
        GROUP BY m.id, m.num_autorizacion, m.fecha_expedicion, m.hora_expedicion, 
                cod.nombre, cod.apellido1, cod.apellido2, m.estadomnf_actual,
                cl.id, cl.nombre");
            $sql->bindParam(':Placa', $filtro);
            $sql->bindParam(':Fecha_Inicio', $fecha_inicio);
            $sql->bindParam(':Fecha_Final', $fecha_fin);
            $sql->execute();
        }
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function Listar_Conductores()
    {
        $sql = $this->_db3->prepare("SELECT
            p.numero_documento,
            CONCAT(
                p.nombre,
                ' ',
                IFNULL(p.apellido1, ''),
                ' ',
                IFNULL(p.apellido2, '')
            ) AS Nombre
        FROM
            cmx_proveedores p
            INNER JOIN cmx_actividad_proveedor ap ON p.numdoc_nexos = ap.id_proveedor
        WHERE
            ap.actividad = 'Conductor'
        ORDER BY
            p.nombre ASC");
        $sql->execute();
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function GetDatosFiltrados($fecha_inicio, $fecha_fin, $origen, $destino, $configuracion, $cliente)
    {
        if ($origen && $destino && empty($configuracion) && empty($cliente)) {
            // 🔹 Solo origen y destino
            $sql = $this->_db3->prepare("SELECT 
                m.id,
                CONCAT(ori.municipio,' - ',ori.depto) AS Origen,
                CONCAT(des.municipio,' - ',des.depto) AS Destino,
                m.placa, 
                CONCAT(cod.nombre, ' ', IFNULL(cod.apellido1, ''), ' ', IFNULL(cod.apellido2, '')) AS Conductor,
                cod.numero_documento,
                cod.celular,
                CONCAT(cv.nombre,' - ',cv.descripcion) AS Configuracion,
                clv.clase
            FROM cmx_manifiesto m
                INNER JOIN cmx_vehiculos v ON m.placa = v.placa
                INNER JOIN cmx_vehiculo2 v2 ON v.numdoc_vehiculo = v2.id_vehiculo
                INNER JOIN cmx_rndc_vehiculos_configuracion cv ON v2.configuracion = cv.id
                INNER JOIN cmx_proveedores cod ON m.conductor_manifiesto=cod.numero_documento
                INNER JOIN cmx_rndc_clase_vehiculo clv ON v2.clase_vehiculo=clv.id
                INNER JOIN cmx_municipios ori ON m.origen_viaje=ori.id
                INNER JOIN cmx_municipios des ON m.destino_viaje=des.id
            WHERE m.fecha_expedicion BETWEEN :Fecha_Inicio AND :Fecha_Final
            AND m.origen_viaje = :Origen
            AND m.destino_viaje = :Destino");

            $sql->bindParam(":Origen", $origen);
            $sql->bindParam(":Destino", $destino);
        } elseif (empty($origen) && empty($destino) && !empty($configuracion) && empty($cliente)) {
            // 🔹 Solo configuración
            $sql = $this->_db3->prepare("SELECT 
                m.id,
                CONCAT(ori.municipio,' - ',ori.depto) AS Origen,
                CONCAT(des.municipio,' - ',des.depto) AS Destino,
                m.placa, 
                CONCAT(cod.nombre, ' ', IFNULL(cod.apellido1, ''), ' ', IFNULL(cod.apellido2, '')) AS Conductor,
                cod.numero_documento,
                cod.celular,
                CONCAT(cv.nombre,' - ',cv.descripcion) AS Configuracion,
                clv.clase
            FROM cmx_manifiesto m
                INNER JOIN cmx_vehiculos v ON m.placa=v.placa
                INNER JOIN cmx_vehiculo2 v2 ON v.numdoc_vehiculo=v2.id_vehiculo
                INNER JOIN cmx_rndc_vehiculos_configuracion cv ON v2.configuracion=cv.id
                INNER JOIN cmx_proveedores cod ON m.conductor_manifiesto=cod.numero_documento
                INNER JOIN cmx_rndc_clase_vehiculo clv ON v2.clase_vehiculo=clv.id
                INNER JOIN cmx_municipios ori ON m.origen_viaje=ori.id
                INNER JOIN cmx_municipios des ON m.destino_viaje=des.id
            WHERE m.fecha_expedicion BETWEEN :Fecha_Inicio AND :Fecha_Final
            AND cv.nombre= :Configuracion");

            $sql->bindParam(":Configuracion", $configuracion);
        } elseif (empty($origen) && empty($destino) && empty($configuracion) && !empty($cliente)) {
            // 🔹 Solo cliente
            $sql = $this->_db3->prepare("SELECT 
                m.id,
                CONCAT(ori.municipio,' - ',ori.depto) AS Origen,
                CONCAT(des.municipio,' - ',des.depto) AS Destino,
                m.placa, 
                CONCAT(cod.nombre, ' ', IFNULL(cod.apellido1, ''), ' ', IFNULL(cod.apellido2, '')) AS Conductor,
                cod.numero_documento,
                cod.celular,
                CONCAT(cv.nombre,' - ',cv.descripcion) AS Configuracion,
                clv.clase
            FROM cmx_manifiesto m
                INNER JOIN cmx_manifiesto_remesa mr ON m.id=mr.id_manifiesto
                INNER JOIN cmx_remesa r ON mr.id_remesa=r.id
                INNER JOIN cmx_remesa_ordencargue ro ON r.id=ro.id_remesa
                INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue=oc.id
                INNER JOIN cmx_clientes cl ON oc.cli_id=cl.id
                INNER JOIN cmx_vehiculos v ON m.placa=v.placa
                INNER JOIN cmx_vehiculo2 v2 ON v.numdoc_vehiculo=v2.id_vehiculo
                INNER JOIN cmx_rndc_vehiculos_configuracion cv ON v2.configuracion=cv.id
                INNER JOIN cmx_proveedores cod ON m.conductor_manifiesto=cod.numero_documento
                INNER JOIN cmx_rndc_clase_vehiculo clv ON v2.clase_vehiculo=clv.id
                INNER JOIN cmx_municipios ori ON m.origen_viaje=ori.id
                INNER JOIN cmx_municipios des ON m.destino_viaje=des.id
            WHERE m.fecha_expedicion BETWEEN :Fecha_Inicio AND :Fecha_Final
            AND cl.id= :Cliente");

            $sql->bindParam(":Cliente", $cliente);
        } elseif ($origen && $destino && $configuracion && $cliente) {
            // 🔹 Todos los filtros
            $sql = $this->_db3->prepare("SELECT 
                m.id,
                CONCAT(ori.municipio,' - ',ori.depto) AS Origen,
                CONCAT(des.municipio,' - ',des.depto) AS Destino,
                m.placa, 
                CONCAT(cod.nombre, ' ', IFNULL(cod.apellido1, ''), ' ', IFNULL(cod.apellido2, '')) AS Conductor,
                cod.numero_documento,
                cod.celular,
                CONCAT(cv.nombre,' - ',cv.descripcion) AS Configuracion,
                clv.clase
            FROM cmx_manifiesto m
                -- Joins para configuración del vehículo
                INNER JOIN cmx_vehiculos v ON m.placa = v.placa
                INNER JOIN cmx_vehiculo2 v2 ON v.numdoc_vehiculo = v2.id_vehiculo
                INNER JOIN cmx_rndc_vehiculos_configuracion cv ON v2.configuracion = cv.id
                INNER JOIN cmx_proveedores cod ON m.conductor_manifiesto=cod.numero_documento
                INNER JOIN cmx_rndc_clase_vehiculo clv ON v2.clase_vehiculo=clv.id
                -- Joins para clientes
                INNER JOIN cmx_manifiesto_remesa mr ON m.id = mr.id_manifiesto
                INNER JOIN cmx_remesa r ON mr.id_remesa = r.id
                INNER JOIN cmx_remesa_ordencargue ro ON r.id = ro.id_remesa
                INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue = oc.id
                INNER JOIN cmx_clientes cl ON oc.cli_id = cl.id
                INNER JOIN cmx_municipios ori ON m.origen_viaje=ori.id
                INNER JOIN cmx_municipios des ON m.destino_viaje=des.id
            WHERE m.fecha_expedicion BETWEEN :Fecha_Inicio AND :Fecha_Final
            AND m.origen_viaje = :Origen
            AND m.destino_viaje = :Destino
            AND cv.nombre = :Configuracion
            AND cl.id = :Cliente");

            $sql->bindParam(":Origen", $origen);
            $sql->bindParam(":Destino", $destino);
            $sql->bindParam(":Configuracion", $configuracion);
            $sql->bindParam(":Cliente", $cliente);
        }

        // 🔹 Enlazar parámetros obligatorios (fechas)
        $sql->bindParam(":Fecha_Inicio", $fecha_inicio);
        $sql->bindParam(":Fecha_Final", $fecha_fin);

        // Ejecutar y devolver resultados
        $sql->execute();
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * 1. Cuenta el total de instrucciones agrupadas por estado.
     */
    public function getInstruccionesEstados(string $fechaInicio, string $fechaFinal): array
    {
        $sql = "
            SELECT 
                estado_instruccion,
                COUNT(*) AS total_instrucciones
            FROM 
                cmx_instruccion_facturacion 
            WHERE 
                fecha BETWEEN :fecha_inicio AND :fecha_final
            GROUP BY 
                estado_instruccion
        ";

        try {
            $stmt = $this->_db3->prepare($sql);
            $stmt->bindParam(':fecha_inicio', $fechaInicio);
            $stmt->bindParam(':fecha_final', $fechaFinal);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception("Error BD al contar por estados: " . $e->getMessage());
        }
    }

    /**
     * 2. Obtiene el listado completo de instrucciones para un estado específico.
     * @param string $estado El estado de instrucción a filtrar (e.g., 'Completada').
     */
    public function getInstruccionesListado(string $estado, string $fechaInicio, string $fechaFinal): array
    {
        $sql = "
            SELECT 
                ifa.*, 
                cl.nombre AS nombre_cliente 
            FROM 
                cmx_instruccion_facturacion ifa
            INNER JOIN 
                cmx_clientes cl ON ifa.cliente_id = cl.id
            WHERE 
                ifa.fecha BETWEEN :fecha_inicio AND :fecha_final
                AND ifa.estado_instruccion = :estado
            ORDER BY
                ifa.fecha DESC, ifa.hora DESC
        ";

        try {
            $stmt = $this->_db3->prepare($sql);
            $stmt->bindParam(':fecha_inicio', $fechaInicio);
            $stmt->bindParam(':fecha_final', $fechaFinal);
            $stmt->bindParam(':estado', $estado); // 👈 BindParam para el estado
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception("Error BD al obtener listado por estado: " . $e->getMessage());
        }
    }

    /**
     * 3. Cuenta el total de instrucciones agrupadas por cliente para un estado específico.
     * @param string $estado El estado de instrucción a filtrar.
     */
    public function getInstruccionesConteoPorCliente(string $estado, string $fechaInicio, string $fechaFinal): array
    {
        $sql = "
            SELECT 
                cl.nombre AS nombre_cliente, 
                ifa.estado_instruccion,
                COUNT(ifa.id) AS total_instrucciones_cliente 
            FROM 
                cmx_instruccion_facturacion ifa
            INNER JOIN 
                cmx_clientes cl ON ifa.cliente_id = cl.id
            WHERE 
                ifa.fecha BETWEEN :fecha_inicio AND :fecha_final
                AND ifa.estado_instruccion = :estado
            GROUP BY 
                cl.nombre, 
                ifa.estado_instruccion 
            ORDER BY 
                total_instrucciones_cliente DESC
        ";

        try {
            $stmt = $this->_db3->prepare($sql);
            $stmt->bindParam(':fecha_inicio', $fechaInicio);
            $stmt->bindParam(':fecha_final', $fechaFinal);
            $stmt->bindParam(':estado', $estado); // 👈 BindParam para el estado
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception("Error BD al contar por cliente: " . $e->getMessage());
        }
    }

    public function Listar_Analistas()
    {
        $sql = $this->_db3->prepare("SELECT u.id,u.nom_usuario FROM cmx_usuarios u
        INNER JOIN cmx_usuario_cliente uc ON u.id=uc.id_usuario
        INNER JOIN cmx_perfiles p ON uc.id_perfil=p.id
        WHERE p.id IN (10,11) AND u.estado=1");
        $sql->execute();
        $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultados;
    }

    /**
     * Consulta la suma total de ventas (tarifas) y costos (valor total del viaje)
     * dentro de un rango de fechas específico.
     *
     * @param string $fechaInicio Fecha de inicio del rango (YYYY-MM-DD).
     * @param string $fechaFin Fecha de fin del rango (YYYY-MM-DD).
     * @return array Retorna un array con 'Ventas' y 'Costos', o un array vacío en caso de error.
     */
    public function GetVentasCostos(string $fechaInicio, string $fechaFin): array
    {
        // Consulta Segura: Usamos placeholders :fecha_inicio y :fecha_fin para el rango.

        // 1. Consulta de Ventas (Total_Venta)
        $sqlVentas = "SELECT
            SUM(dm.total_tarifa) AS Total_Venta
        FROM
            cmx_detalle_mercancia2 dm
            INNER JOIN cmx_solicitud_vehiculo2 ss ON dm.n_cotizacion = ss.n_cotizacion
            INNER JOIN cmx_cotizaciones_serviciocliente cs ON ss.n_cotizacion = cs.n_cotizacion
            INNER JOIN cmx_remesa rm ON ss.nundoc_solicitud=rm.mer_idservicio
        WHERE
            ss.fecha BETWEEN :fecha_inicio AND :fecha_fin
            AND rm.estado_facturacion='Facturada'
            AND rm.estado=1
            AND cs.estado='F3'";

        // 2. Consulta de Costos (Valor total del viaje)
        // $sqlCostos = "SELECT
        //     SUM(DISTINCT m.valor_total_viaje) AS Total_Costo -- Renombrado a Total_Costo para claridad
        // FROM
        //     cmx_manifiesto m
        //     INNER JOIN cmx_manifiesto_remesa mr ON m.id=mr.id_manifiesto
        //     INNER JOIN cmx_remesa rm ON mr.id_remesa=rm.id
        // WHERE
        //     m.fecha_expedicion BETWEEN :fecha_inicio AND :fecha_fin
        //     AND rm.estado_facturacion='Facturada'
        //     AND rm.estado=1";

        $sqlCostos = "SELECT
            SUM(m.valor_total_viaje) AS Total_Costo 
            -- 🛑 NOTA: Ya no necesitamos DISTINCT aquí, porque no hacemos JOIN con cmx_manifiesto_remesa
        FROM
            cmx_manifiesto m
        WHERE
            m.fecha_expedicion BETWEEN :fecha_inicio AND :fecha_fin
            -- 🛑 FILTRO CLAVE: Usamos EXISTS para asegurar que el manifiesto esté vinculado
            -- a al menos una remesa facturada (estado=1) sin duplicar las filas del manifiesto.
            AND EXISTS (
                SELECT 1
                FROM cmx_manifiesto_remesa mr
                INNER JOIN cmx_remesa rm ON mr.id_remesa = rm.id
                WHERE mr.id_manifiesto = m.id
                AND rm.estado_facturacion = 'Facturada'
                AND rm.estado = 1
            )";

        try {
            // --- 1. Ejecutar Ventas ---
            $stmtVentas = $this->_db3->prepare($sqlVentas);
            $stmtVentas->bindParam(':fecha_inicio', $fechaInicio, PDO::PARAM_STR);
            $stmtVentas->bindParam(':fecha_fin', $fechaFin, PDO::PARAM_STR);
            $stmtVentas->execute();

            $ventas = $stmtVentas->fetch(PDO::FETCH_ASSOC);

            // --- 2. Ejecutar Costos ---
            $stmtCostos = $this->_db3->prepare($sqlCostos);
            $stmtCostos->bindParam(':fecha_inicio', $fechaInicio, PDO::PARAM_STR);
            $stmtCostos->bindParam(':fecha_fin', $fechaFin, PDO::PARAM_STR);
            $stmtCostos->execute();

            $costos = $stmtCostos->fetch(PDO::FETCH_ASSOC);

            // 3. Devolver los resultados combinados
            return [
                'Ventas' => (float)($ventas['Total_Venta'] ?? 0),
                'Costos' => (float)($costos['Total_Costo'] ?? 0),
            ];
        } catch (PDOException $e) {
            error_log("Error en GetVentasCostos: " . $e->getMessage());
            return [
                'Ventas' => 0.0,
                'Costos' => 0.0,
                'Error' => $e->getMessage(), // Opcional: Para debug en el controlador
            ];
        }
    }

    /**
     * Detalle de Ventas agrupado por Cliente.
     */
    public function GetDetalleVentas(string $fechaInicio, string $fechaFin): array
    {
        $sql = "SELECT
            cl.id AS ID_Cliente,
            cl.nombre AS Nombre_Cliente,
            SUM(dm.total_tarifa) AS Total_Venta_Por_Cliente
        FROM
            cmx_detalle_mercancia2 dm
            INNER JOIN cmx_solicitud_vehiculo2 ss ON dm.n_cotizacion = ss.n_cotizacion
            INNER JOIN cmx_cotizaciones_serviciocliente cs ON ss.n_cotizacion = cs.n_cotizacion
            INNER JOIN cmx_remesa rm ON ss.nundoc_solicitud = rm.mer_idservicio
            INNER JOIN cmx_clientes cl ON cs.id_cliente = cl.id
        WHERE 
            ss.fecha BETWEEN :fecha_inicio AND :fecha_fin
            AND rm.estado_facturacion = 'Facturada'
            AND rm.estado = 1
            AND cs.estado='F3'
        GROUP BY
            cl.id, cl.nombre 
        ORDER BY
            Total_Venta_Por_Cliente DESC";

        try {
            $stmt = $this->_db3->prepare($sql);
            $stmt->bindParam(':fecha_inicio', $fechaInicio, PDO::PARAM_STR);
            $stmt->bindParam(':fecha_fin', $fechaFin, PDO::PARAM_STR);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error DetalleVentas: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Detalle de Costos agrupado por Placa.
     */
    // public function GetDetalleCostos(string $fechaInicio, string $fechaFin): array
    // {
    //     $sql = "SELECT
    //         m.placa AS Placa,
    //         SUM(DISTINCT m.valor_total_viaje) AS Total_Pagado_Placa
    //     FROM
    //         cmx_manifiesto m
    //         INNER JOIN cmx_manifiesto_remesa mr ON m.id = mr.id_manifiesto
    //         INNER JOIN cmx_remesa rm ON mr.id_remesa = rm.id
    //     WHERE
    //         m.fecha_expedicion BETWEEN :fecha_inicio AND :fecha_fin
    //         AND rm.estado_facturacion = 'Facturada'
    //         AND rm.estado = 1
    //     GROUP BY
    //         m.placa";

    //     try {
    //         $stmt = $this->_db3->prepare($sql);
    //         $stmt->bindParam(':fecha_inicio', $fechaInicio, PDO::PARAM_STR);
    //         $stmt->bindParam(':fecha_fin', $fechaFin, PDO::PARAM_STR);
    //         $stmt->execute();
    //         return $stmt->fetchAll(PDO::FETCH_ASSOC);
    //     } catch (PDOException $e) {
    //         error_log("Error DetalleCostos: " . $e->getMessage());
    //         return [];
    //     }
    // }

    /**
     * Detalle de Costos agrupado por Placa.
     * Utiliza EXISTS para filtrar por remesa facturada sin duplicar filas del manifiesto.
     *
     * @param string $fechaInicio Fecha de inicio del rango (YYYY-MM-DD).
     * @param string $fechaFin Fecha de fin del rango (YYYY-MM-DD).
     * @return array Retorna un array de resultados agrupados por placa o un array vacío.
     */
    public function GetDetalleCostos(string $fechaInicio, string $fechaFin): array
    {
        $sql = "SELECT
            m.placa AS Placa,
            -- 🛑 SUMAMOS SIN DISTINCT, ya que el cuerpo principal solo trae manifiestos únicos
            SUM(m.valor_total_viaje) AS Total_Pagado_Placa 
        FROM
            cmx_manifiesto m
        WHERE
            m.fecha_expedicion BETWEEN :fecha_inicio AND :fecha_fin
            -- 🛑 FILTRO CLAVE: Usamos EXISTS para aplicar el filtro de remesa (facturada y activa)
            AND EXISTS (
                SELECT 1
                FROM cmx_manifiesto_remesa mr
                INNER JOIN cmx_remesa rm ON mr.id_remesa = rm.id
                WHERE mr.id_manifiesto = m.id -- Correlaciona con el manifiesto principal (m)
                AND rm.estado_facturacion = 'Facturada'
                AND rm.estado = 1
            )
        GROUP BY
            m.placa";

        try {
            $stmt = $this->_db3->prepare($sql);
            $stmt->bindParam(':fecha_inicio', $fechaInicio, PDO::PARAM_STR);
            $stmt->bindParam(':fecha_fin', $fechaFin, PDO::PARAM_STR);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error DetalleCostos: " . $e->getMessage());
            return [];
        }
    }
}
