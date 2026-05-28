<?php

class informeModel extends Model
{

    public function Aplicar_Filtro($FECHA_INCIAL, $FECHA_FINAL, $NUM_REMESA, $NUN_MANIFIESTO)
    {
        try {
            if ($FECHA_INCIAL && $FECHA_FINAL && !$NUM_REMESA && !$NUN_MANIFIESTO) {
                $sql = $this->_db3->prepare("CALL INFORME_REMESAS_FECHAS_SC(:FECHA_INICIAL, :FECHA_FINAL)");
                // Vincular los parámetros
                $sql->bindParam(':FECHA_INICIAL', $FECHA_INCIAL, PDO::PARAM_STR);
                $sql->bindParam(':FECHA_FINAL', $FECHA_FINAL, PDO::PARAM_STR);
                $resultado = $sql->execute();
                $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
                return $resultado;
            } elseif ($NUM_REMESA) {
                $sql = $this->_db3->prepare("CALL INFORME_REMESA_SC_REMESAS(:NUM_REMESA)");
                $sql->bindParam(':NUM_REMESA', $NUM_REMESA, PDO::PARAM_INT);
                // Ejecutar el procedimiento almacenado
                $resultado = $sql->execute();
                $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
                return $resultado;
            } elseif ($NUN_MANIFIESTO) {
                $sql = $this->_db3->prepare("CALL INFORME_REMESA_SC_MANIFIESTO(:NUN_MANIFIESTO)");
                $sql->bindParam(':NUN_MANIFIESTO', $NUN_MANIFIESTO, PDO::PARAM_INT);
                // Ejecutar el procedimiento almacenado
                $resultado = $sql->execute();
                $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
                return $resultado;
            } elseif (!$FECHA_INCIAL && !$FECHA_FINAL && !$NUM_REMESA && !$NUN_MANIFIESTO) {
                $sql = $this->_db3->prepare("SELECT * FROM INFORME_REMESAS_SC");
                // Ejecutar el procedimiento almacenado
                $resultado = $sql->execute();
                $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
                return $resultado;
            }
        } catch (\Throwable $th) {
            echo 'Error en la consulta: ' . $th->getMessage();
        }
    }

    /* Funcoies para informe general */
    public function Listar_origenes()
    {
        $sql = $this->_db3->prepare("SELECT mun.*
      FROM cmx_municipios mun
      INNER JOIN cmx_rutas rut ON mun.id=rut.cod_ciudad_origen
      GROUP BY mun.id ORDER BY mun.municipio ASC;");
        $resultado = $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Listar_destinos()
    {
        $sql = $this->_db3->prepare("SELECT mun.*
      FROM cmx_municipios mun
      INNER JOIN cmx_rutas rut ON mun.id=rut.cod_ciudad_destino
      GROUP BY mun.id ORDER BY mun.municipio ASC;");
        $resultado = $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Listar_Clientes()
    {
        $sql = $this->_db3->prepare("SELECT id, documento, nombre FROM cmx_clientes ORDER BY nombre ASC");
        $sql->execute();
        $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultados;
    }

    public function Listar_Conductores()
    {
        $sql = $this->_db3->prepare("SELECT pr.numero_documento,pr.nombre,pr.apellido1,pr.apellido2,pr.id AS conductor_id FROM cmx_proveedores pr INNER JOIN cmx_actividad_proveedor ap ON ap.id_proveedor=pr.id WHERE ap.actividad='Conductor'");
        $sql->execute();
        $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultados;
    }


    public function Listar_Placas_Asignadas($fecha_inicial, $fecha_final)
    {
        $sql = $this->_db3->prepare("SELECT ss.nundoc_solicitud,c.nombre,CONCAT(ori.municipio,' - ',ori.depto) AS ORIGEN, CONCAT(dest.municipio,' - ',dest.depto) AS DESTINO,clv.clase,dm.flete AS flete_propuesto,
        st.flete AS flete_subasta,v.placa,CONCAT(pss.fecha,'-',pss.hora)AS fecha_estudio_vehiculos,CONCAT(esf.fecha,' - ',esf.hora) AS fecha_asignacion_placa,
		  CONCAT(m.fecha_expedicion,'-',m.hora_expedicion) AS fecha_expedicion_manifiesto,m.id AS numero_manifiesto
		  FROM cmx_solicitud_vehiculo2 ss 
        INNER JOIN cmx_cotizaciones_serviciocliente cs ON ss.n_cotizacion=cs.n_cotizacion
        INNER JOIN cmx_detalle_mercancia2 dm ON cs.n_cotizacion=dm.n_cotizacion
        INNER JOIN cmx_clientes c ON c.id = cs.id_cliente
        INNER JOIN cmx_municipios ori ON  ss.origen = ori.rndc_codigo_ciudad
        INNER JOIN cmx_municipios dest ON  ss.destino = dest.rndc_codigo_ciudad
        LEFT JOIN cmx_preestudio_solicitudes_servicio pss ON ss.nundoc_solicitud=pss.id_servicio_cliente
        LEFT JOIN cmx_subasta_temporal st ON pss.id_solicitudpreestudio=st.numero_estudio
        LEFT JOIN cmx_vehiculos v ON st.placa=v.placa
        LEFT JOIN cmx_vehiculo2 v2 ON v.numdoc_vehiculo= v2.id_vehiculo
        LEFT JOIN cmx_rndc_clase_vehiculo clv ON v2.clase_vehiculo = clv.id
        LEFT JOIN cmx_subasta_solicitud_servicio sss ON ss.nundoc_solicitud = sss.numer_solservicio  
        LEFT JOIN cmx_subasta sb ON sss.id_subasta = sb.id
        LEFT JOIN cmx_subasta_flete sf ON sb.id = sf.id_suba
        LEFT JOIN cmx_estado_subasta_flete esf ON sf.id=esf.id_suba_flete AND esf.estado='Ganador' AND esf.estado_final='Ganador'
        LEFT JOIN cmx_orden_cargue oc ON ss.nundoc_solicitud=oc.mer_idservicio
        LEFT JOIN cmx_remesa_ordencargue ro ON oc.id=ro.id_orden_cargue
        LEFT JOIN cmx_remesa r ON ro.id_remesa=r.id
        LEFT JOIN cmx_manifiesto_remesa mr ON r.id=mr.id_remesa
        LEFT JOIN cmx_manifiesto m ON mr.id_manifiesto=m.id
        WHERE ss.fecha BETWEEN '" . $fecha_inicial . "' AND '" . $fecha_final . "' GROUP BY ss.nundoc_solicitud ORDER BY ss.nundoc_solicitud DESC");

        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);

        $sql_count = $this->_db3->prepare("SELECT COUNT(*) AS total FROM cmx_solicitud_vehiculo2 WHERE fecha BETWEEN :fecha_inicial AND :fecha_final");
        $sql_count->bindParam(':fecha_inicial', $fecha_inicial);
        $sql_count->bindParam(':fecha_final', $fecha_final);
        $sql_count->execute();
        $resultado_count = $sql_count->fetch();

        $sql_diligencidas = $this->_db3->prepare("SELECT COUNT(*) AS total_diligenciado FROM cmx_subasta s
        INNER JOIN cmx_operacion_subasta os ON os.n_subasta=s.id
        WHERE s.fecha BETWEEN :fecha_inicial AND :fecha_final AND os.estado_letra='Ganador'");
        $sql_diligencidas->bindParam(':fecha_inicial', $fecha_inicial);
        $sql_diligencidas->bindParam(':fecha_final', $fecha_final);
        $sql_diligencidas->execute();
        $resultado_diligenciado = $sql_diligencidas->fetch();

        $response = [
            'resultado' => $resultado,
            'resultado_contador' => $resultado_count['total'],
            'resultado_diligenciado' => $resultado_diligenciado['total_diligenciado']
        ];

        return $response;
    }

    public function Listar_Placas_Fac($fecha_inicial, $fecha_final)
    {
        $consulta = "SELECT ma.id AS 'numero_manifiesto', ma.fecha_expedicion, ma.placa,
        ma.valor_total_viaje,ant.valor_anticipo,
        concat(m1.municipio,' ',m1.depto) AS origen,
        concat(m2.municipio,' ',m2.depto) AS destino,
        re.id AS 'numero_remesa', ss.nombre_cliente,
        age.nombre AS agencia,
        cu.fecha AS 'fecha_cumplido',
        (SELECT max(oet.estado_envio_oet) 
          FROM web_service_oet oet WHERE oet.codigo_proceso IN (ma.id)
          ORDER BY oet.codigo_proceso DESC LIMIT 1) AS estado_oet,
          (SELECT MAX(rndc.estado_envio_rndc) 
          FROM web_service_rndc2 rndc 
          WHERE rndc.codigo_proceso IN(ma.id)
          ORDER BY rndc.codigo_proceso DESC LIMIT 1) AS estado_rndc
        FROM cmx_manifiesto ma
        INNER JOIN cmx_manifiesto_remesa mr  ON ma.id=mr.id_manifiesto AND mr.estado=1
        INNER JOIN cmx_remesa re  ON mr.id_remesa=re.id
        INNER JOIN cmx_municipios m1  ON ma.origen_viaje=m1.id
        INNER JOIN cmx_municipios m2  ON ma.destino_viaje=m2.id
        INNER JOIN cmx_solicitud_vehiculo2 ss  ON re.mer_idservicio=ss.nundoc_solicitud
        INNER JOIN cmx_agencias age  ON ss.agencia=age.id
        LEFT JOIN cmx_manifiesto_anticipo ant  ON ma.id=ant.id_manifiesto
        LEFT JOIN cmx_cumplido cu  ON ma.id=cu.manifiesto
        WHERE ma.fecha_expedicion  BETWEEN  '" . $fecha_inicial . "' AND '" . $fecha_final . "'
        ORDER BY ma.id ASC";
        $sql = $this->_db3->prepare($consulta);
        $sql->execute();
        $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        $response = [
            'resultado' => $resultados
        ];
        return $response;
    }

    public function Informe_Calidad($fecha_inicial, $fecha_final)
    {
        try {
            $fecha_inicial1 = $fecha_inicial . ' 00:00:00';
            $fecha_final1   = $fecha_final . ' 23:59:00';
            $inicio = (new DateTime($fecha_inicial, new DateTimeZone('America/Bogota')))->format('Y-m-d');
            $fin    = (new DateTime($fecha_final, new DateTimeZone('America/Bogota')))->format('Y-m-d');
            // Consulta 1: Datos del manifiesto y vehículo
            $stmt1 = $this->_db3->prepare("SELECT
            ma.id AS numero_manifiesto, ma.fecha_expedicion, ma.placa, IFNULL(t.placa, '-') AS Trailer, vc.nombre AS Configuracion, v2.tipo_vinculacion, v2.num_chasis
                FROM cmx_manifiesto ma
                INNER JOIN cmx_vehiculos v ON ma.placa = v.placa
                INNER JOIN cmx_vehiculo2 v2 ON v.numdoc_vehiculo = v2.id_vehiculo
                INNER JOIN cmx_rndc_vehiculos_configuracion vc ON v2.configuracion = vc.id
                INNER JOIN cmx_manifiesto_remesa mr ON ma.id=mr.id_manifiesto
                LEFT JOIN cmx_trailer_vehiculo tv ON v.numdoc_vehiculo = tv.id_vehiculo AND tv.estado=1
                LEFT JOIN cmx_trailer t ON tv.id_trailer = t.id
                WHERE ma.fecha_expedicion BETWEEN :fecha_inicio
                    AND :fecha_fin");
            $stmt1->bindParam(':fecha_inicio', $inicio);
            $stmt1->bindParam(':fecha_fin', $fin);
            $stmt1->execute();
            $manifiestoData = $stmt1->fetchAll(PDO::FETCH_ASSOC);

            $stmt2 = $this->_db3->prepare("SELECT
                    mr.id_manifiesto,
                    mr.id_remesa,
                    ro.id_orden_cargue,
                    CONCAT(
                        rm.fecha_creacion, ' ', rm.hora_creacion
                    ) AS fecha_remesa,
                    IFNULL(
                        CONCAT(c.fecha, ' ', c.hora),
                        '-'
                    ) AS fecha_cumplido,
                    CONCAT(
                        IF(
                            tco.tipo_fecha = 'fec_llegada',
                            CONCAT(
                                tco.fecha_cargue, ' ', tco.hora_cargue
                            ),
                            ''
                        )
                    ) AS fecha_llegada_cargue,
                    CONCAT(
                        IF(
                            tco2.tipo_fecha = 'fec_salida',
                            CONCAT(
                                tco2.fecha_cargue, ' ', tco2.hora_cargue
                            ),
                            ''
                        )
                    ) AS fecha_salida_cargue,
                    CONCAT(
                        IF (
                            tdr.tipo_fecha = 'fec_llegada',
                            CONCAT(
                                tdr.fecha_descargue, ' ', tdr.hora_descargue
                            ),
                            ''
                        )
                    ) AS fecha_llegada_descargue,
                    CONCAT(
                        IF(
                            tdr2.tipo_fecha = 'fec_salida',
                            CONCAT(
                                tdr2.fecha_descargue, ' ', tdr2.hora_descargue
                            ),
                            ''
                        )
                    ) AS fecha_salida_descargue,
                    rm.cantidad_real_cargada
                FROM
                    cmx_manifiesto m
                    INNER JOIN cmx_manifiesto_remesa mr ON m.id = mr.id_manifiesto
                    INNER JOIN cmx_remesa rm ON mr.id_remesa = rm.id
                    INNER JOIN cmx_remesa_ordencargue ro ON rm.id = ro.id_remesa
                    INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue = oc.id
                    LEFT JOIN cmx_cumplido c ON m.id = c.manifiesto
                    AND c.estado = 1
                    LEFT JOIN cmx_cumplido_remesa cr ON c.id = cr.id_cumplido
                    AND cr.tipo_fecha = 'fec_salida'
                    LEFT JOIN cmx_tiempo_cargue_ordenes tco ON ro.id_orden_cargue = tco.id_orden_cargue
                    AND tco.tipo_fecha = 'fec_llegada'
                    LEFT JOIN cmx_tiempo_cargue_ordenes tco2 ON ro.id_orden_cargue = tco2.id_orden_cargue
                    AND tco2.tipo_fecha = 'fec_salida'
                    LEFT JOIN cmx_tiempo_descargue_rem tdr ON rm.id = tdr.id_remesa
                    AND tdr.tipo_fecha = 'fec_llegada'
                    LEFT JOIN cmx_tiempo_descargue_rem tdr2 ON rm.id = tdr2.id_remesa
                    AND tdr2.tipo_fecha = 'fec_salida'
                WHERE
                    m.fecha_expedicion BETWEEN STR_TO_DATE(:fecha_inicio, '%Y-%m-%d')
                    AND STR_TO_DATE(:fecha_fin, '%Y-%m-%d')
                GROUP BY
                    m.id,
                    rm.id");

            $stmt2->bindParam(':fecha_inicio', $fecha_inicial);
            $stmt2->bindParam(':fecha_fin', $fecha_final);
            $stmt2->execute();
            $remesaData = $stmt2->fetchAll(PDO::FETCH_ASSOC);

            // Consulta 3: Datos de clientes, órdenes de cargue y mercancías
            $stmt3 = $this->_db3->prepare("SELECT oc.id AS id_orden_cargue, cl.nombre, ma.Lugar AS Agencia,
                CONCAT(ori.municipio,'-',ori.depto) AS origen_rem,
                CONCAT(dest.municipio,'-',dest.depto) AS destino_rem,dm.tipo_mercancia,cond.numero_documento AS cedula_conductor,
                cond.celular AS celular_conductor,CONCAT(cond.nombre,' ',IFNULL(cond.apellido1,''),' ',IFNULL(cond.apellido2,' ')) AS Conductor,
                CONCAT(pose.nombre,' ',IFNULL(pose.apellido1,''),' ',IFNULL(pose.apellido2,' ')) AS Poseedor,
                pose.numero_documento AS cedula_poseedor,pose.celular AS celular_poseedor,mr.usuario AS elaborado,
                -- IF(ma.estadomnf_actual = 1, 'Activo', 'Anulado') AS estado_manifiesto,
                CASE WHEN ma.estado_seguimiento = 'CUMPLIDO' THEN 'Activo'
                WHEN ma.estado_seguimiento = 'FINALIZADO' THEN 'Activo'
                WHEN ma.estado_seguimiento = 'ANULADO' THEN 'Anulado'
                WHEN ma.estado_seguimiento = 'SEGUIMIENTO' THEN 'Seguimiento'
                WHEN ma.estado_seguimiento = 'LLEGADA' THEN 'Llegada'
                WHEN ma.estado_seguimiento = 'SALIDA' THEN 'Salida'
                ELSE 'Desconocido' END AS estado_manifiesto,
                ss.nundoc_solicitud
                FROM cmx_orden_cargue oc
                INNER JOIN cmx_clientes cl ON oc.cli_id = cl.id
                INNER JOIN cmx_solicitud_vehiculo2 ss ON oc.mer_idservicio = ss.nundoc_solicitud
                INNER JOIN cmx_cotizaciones_serviciocliente cs ON ss.n_cotizacion = cs.n_cotizacion
                INNER JOIN cmx_detalle_mercancia2 dm ON cs.n_cotizacion = dm.n_cotizacion
                INNER JOIN cmx_remesa_ordencargue ro ON oc.id = ro.id_orden_cargue
                INNER JOIN cmx_manifiesto_remesa mr ON ro.id_remesa = mr.id_remesa
                INNER JOIN cmx_manifiesto ma ON mr.id_manifiesto = ma.id
                INNER JOIN cmx_municipios ori ON dm.origen=ori.rndc_codigo_ciudad
                INNER JOIN cmx_municipios dest ON dm.destino=dest.rndc_codigo_ciudad
                INNER JOIN cmx_proveedores cond ON ma.conductor_manifiesto=cond.numero_documento
                INNER JOIN cmx_proveedores pose ON ma.titular_manifiesto=pose.numero_documento
                WHERE ma.fecha_expedicion BETWEEN STR_TO_DATE(:fecha_inicio, '%Y-%m-%d') AND STR_TO_DATE(:fecha_fin, '%Y-%m-%d')");

            $stmt3->bindParam(':fecha_inicio', $fecha_inicial);
            $stmt3->bindParam(':fecha_fin', $fecha_final);
            $stmt3->execute();
            $clienteData = $stmt3->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            echo "Error en la conexión: " . $e->getMessage();
        }

        // Paso 1: Combinar los datos del manifiesto con los datos de remesas
        foreach ($manifiestoData as $manifiesto) {
            $numeroManifiesto = $manifiesto['numero_manifiesto'];

            // Inicializa la entrada de manifiesto en el array combinado
            $combinedData[$numeroManifiesto] = [
                'numero_manifiesto' => $manifiesto['numero_manifiesto'],
                'fecha_expedicion' => $manifiesto['fecha_expedicion'],
                'placa' => $manifiesto['placa'],
                'Trailer' => $manifiesto['Trailer'],
                'Configuracion' => $manifiesto['Configuracion'],
                'tipo_vinculacion' => $manifiesto['tipo_vinculacion'],
                'num_chasis' => $manifiesto['num_chasis'],
                'remesas' => [],  // Inicializamos el array de remesas
            ];

            // Paso 2: Añadir datos de remesas relacionados con el manifiesto
            foreach ($remesaData as $remesa) {
                if ($remesa['id_manifiesto'] == $numeroManifiesto) {
                    $combinedData[$numeroManifiesto]['remesas'][] = [
                        'id_remesa' => $remesa['id_remesa'],
                        'id_orden_cargue' => $remesa['id_orden_cargue'],
                        'fecha_remesa' => $remesa['fecha_remesa'],
                        'fecha_cumplido' => $remesa['fecha_cumplido'],
                        'fecha_llegada_cargue' => $remesa['fecha_llegada_cargue'],
                        'fecha_salida_cargue' => $remesa['fecha_salida_cargue'],
                        'fecha_llegada_descargue' => $remesa['fecha_llegada_descargue'],
                        'fecha_salida_descargue' => $remesa['fecha_salida_descargue'],
                        'cantidad_real_cargada' => $remesa['cantidad_real_cargada']
                    ];
                }
            }
        }

        // // Paso 3: Añadir datos de clientes a las órdenes de cargue correspondientes
        foreach ($clienteData as $cliente) {
            $idOrdenCargue = $cliente['id_orden_cargue'];
            // Itera a través del array combinado para añadir los datos del cliente a la orden de cargue correspondiente
            foreach ($combinedData as &$manifiesto) {
                foreach ($manifiesto['remesas'] as &$remesa) {
                    if ($remesa['id_orden_cargue'] == $idOrdenCargue) {
                        // Añadir datos del cliente
                        // $remesa['mer_empaque'] = $cliente['Espaque'];
                        // $remesa['peso_pedido'] = $cliente['peso_pedido'];
                        $remesa['nombre_cliente'] = $cliente['nombre'];
                        // $remesa['nom_sede'] = $cliente['nom_sede'];
                        $remesa['Agencia'] = $cliente['Agencia'];
                        // $toneladas = $this->kilolitrosAToneladas($cliente['mer_pesomercancia']);
                        // $remesa['mer_pesomercancia'] = $toneladas;
                        // $toneladas_cumplido = $this->kilolitrosAToneladas((int) $cliente['total_peso']);
                        // $remesa['total_peso'] = $toneladas_cumplido;
                        $remesa['origen_rem'] = $cliente['origen_rem'];
                        $remesa['destino_rem'] = $cliente['destino_rem'];
                        $remesa['tipo_mercancia'] = $cliente['tipo_mercancia'];
                        $remesa['Conductor'] = $cliente['Conductor'];
                        $remesa['cedula_conductor'] = $cliente['cedula_conductor'];
                        $remesa['celular_conductor'] = $cliente['celular_conductor'];
                        $remesa['Poseedor'] = $cliente['Poseedor'];
                        $remesa['cedula_poseedor'] = $cliente['cedula_poseedor'];
                        $remesa['celular_poseedor'] = $cliente['celular_poseedor'];
                        $remesa['elaborado'] = $cliente['elaborado'];
                        $remesa['estado_manifiesto'] = $cliente['estado_manifiesto'];
                        $remesa['nundoc_solicitud'] = $cliente['nundoc_solicitud'];
                    }
                }
            }
        }

        // Paso 4: Convertir el array combinado a JSON para retornarlo en una respuesta AJAX
        $response = array_values($combinedData); // Convertir a JSON
        return $response; // Retornar la respuesta JSON
    }

    #Informe de operaciones
    public function Informe_operacion($fecha_inicial, $fecha_final)
    {
        $consulta = "SELECT m.id AS Manifiesto,CONCAT(m.fecha_expedicion,'',m.hora_expedicion) AS Fecha_Espedicion,m.placa,
        CONCAT(pro.nombre,' ',IFNULL(pro.apellido1,' '),' ',IFNULL(pro.apellido2,' ')) AS Propietario,pro.celular AS Celular_Propietario,
        CONCAT(cond.nombre,' ',IFNULL(cond.apellido1,' '),' ',IFNULL(cond.apellido2,' ')) AS Conductor,cond.celular AS Celular_Conductor,
        cl.nombre AS Cliente,m.Lugar AS Agencia,CONCAT(ori.municipio,' - ',ori.depto) AS Origen,CONCAT(des.municipio,' - ',des.depto) AS Destino,
        m.valor_total_viaje AS Flete
        FROM cmx_manifiesto m
        INNER JOIN cmx_manifiesto_remesa mr ON m.id=mr.id_manifiesto
        INNER JOIN cmx_remesa rm ON mr.id_remesa=rm.id
        INNER JOIN cmx_remesa_ordencargue ro ON rm.id=ro.id_remesa
        INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue=oc.id
        -- INNER JOIN cmx_solicitud_vehiculo2 ss ON oc.mer_idservicio=ss.nundoc_solicitud
        INNER JOIN cmx_clientes cl ON oc.cli_id=cl.id
        INNER JOIN cmx_vehiculos v ON m.placa=v.placa
        INNER JOIN cmx_proveedores pro ON v.id_propietario=pro.numdoc_nexos
        INNER JOIN cmx_proveedores cond ON v.id_conductor=cond.numdoc_nexos
        INNER JOIN cmx_municipios ori ON m.origen_viaje=ori.id
        INNER JOIN cmx_municipios des ON m.destino_viaje= des.id
        WHERE m.fecha_expedicion BETWEEN  '" . $fecha_inicial . "' AND '" . $fecha_final . "' ORDER BY m.id ASC";
        $sql = $this->_db3->prepare($consulta);
        $sql->execute();
        $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        $response = [
            'resultado' => $resultados
        ];
        return $response;
    }

    public function Informe_precintos($fecha_inicial, $fecha_final)
    {
        $consulta = "SELECT m.id AS MANIFIESTO, rm.id AS REMESA_ID, oc.id AS ORDEN_CARGUE, GROUP_CONCAT(pre.serie_precinto ORDER BY pre.serie_precinto SEPARATOR ', ') AS PRECINTOS, 
        CONCAT(pre.fecha,' ',pre.hora) AS FECHA_PRECINTO, pre.tipo_precinto AS TIPO_PRECINTO,m.placa AS PLACA, CONCAT(ori.municipio,' - ',ori.depto) AS ORIGEN, CONCAT(des.municipio,' - ',des.depto) AS DESTINO, m.Lugar AS AGENCIA
        FROM cmx_manifiesto m
        INNER JOIN cmx_manifiesto_remesa mr ON m.id = mr.id_manifiesto
        INNER JOIN cmx_remesa rm ON mr.id_remesa = rm.id
        INNER JOIN cmx_remesa_ordencargue ro ON rm.id = ro.id_remesa
        INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue = oc.id
        INNER JOIN cmx_planilla_detalle2 pre ON oc.id = pre.id_planilla
        INNER JOIN cmx_municipios ori ON m.origen_viaje=ori.id
        INNER JOIN cmx_municipios des ON m.destino_viaje= des.id
        WHERE oc.fecha_orden BETWEEN  '" . $fecha_inicial . "' AND '" . $fecha_final . "' GROUP BY m.id, oc.id ORDER BY m.id, oc.id";
        $sql = $this->_db3->prepare($consulta);
        $sql->execute();
        $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        $response = [
            'resultado' => $resultados
        ];
        return $response;
    }

    #Funciones de reporte de genrencia
    public function Informe_Totales($fecha_inicial, $fecha_final, $cliente, $filtro)
    {
        $response = [];

        try {
            if ($filtro == "Fecha") {
                // CONSULTA 1: Cantidad de remesas
                $sql1 = $this->_db3->prepare("
                    SELECT COUNT(rm.id) AS Cantidad_remesas
                    FROM cmx_remesa rm
                    LEFT JOIN cmx_remesa_ordencargue ro ON rm.id = ro.id_remesa
                    LEFT JOIN cmx_orden_cargue oc ON ro.id_orden_cargue = oc.id
                    WHERE rm.fecha_creacion BETWEEN STR_TO_DATE(:fecha_inicio, '%Y-%m-%d') 
                    AND STR_TO_DATE(:fecha_fin, '%Y-%m-%d')
                    AND rm.estado = 1 AND oc.estado = 1
                ");

                $sql1->bindParam(':fecha_inicio', $fecha_inicial);
                $sql1->bindParam(':fecha_fin', $fecha_final);
                $sql1->execute();
                $data1 = $sql1->fetch(PDO::FETCH_ASSOC);

                // CONSULTA 2: Suma del valor de remesas
                $sql2 = $this->_db3->prepare("
                    SELECT SUM(oc.ve_tarifacalculada) AS Total_valor_remesa
                    FROM cmx_remesa rm
                    INNER JOIN cmx_remesa_ordencargue ro ON rm.id = ro.id_remesa
                    INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue = oc.id
                    INNER JOIN cmx_manifiesto_remesa mr ON rm.id = mr.id_remesa
                    AND mr.estado = 1
                    INNER JOIN cmx_manifiesto ma ON mr.id_manifiesto = ma.id
                    INNER JOIN cmx_solicitud_vehiculo2 ss ON oc.mer_idservicio=ss.nundoc_solicitud
                    WHERE rm.fecha_creacion BETWEEN STR_TO_DATE(:fecha_inicio, '%Y-%m-%d') 
                    AND STR_TO_DATE(:fecha_fin, '%Y-%m-%d')
                    AND rm.estado = 1
                    AND oc.estado = 1
                    AND ro.estado = 1
                    AND ma.estadomnf_actual = 1
                    AND ma.estado_seguimiento = 'CUMPLIDO'
                    AND ss.estado='Realizada'
                ");

                $sql2->bindParam(':fecha_inicio', $fecha_inicial);
                $sql2->bindParam(':fecha_fin', $fecha_final);
                $sql2->execute();
                $data2 = $sql2->fetch(PDO::FETCH_ASSOC);

                // CONSTRUCCIÓN DE RESPUESTA
                if ($data1 && $data1['Cantidad_remesas'] > 0) {
                    $response = [
                        'status' => 200,
                        'message' => 'Operación exitosa',
                        'data' => [
                            'Cantidad_remesas' => $data1['Cantidad_remesas'],
                            'Total_valor_remesa' => $data2['Total_valor_remesa'] ?? 0
                        ]
                    ];
                } else {
                    $response = [
                        'status' => 204,
                        'message' => 'No hay datos para el filtro seleccionado',
                        'data' => null
                    ];
                }
            } elseif ($filtro == 'Cliente') {
                // Lógica adicional si es necesario
                $sql = $this->_db3->prepare(" SELECT COUNT(rm.id) AS Cantidad_remesas, SUM(oc.ve_tarifacalculada) AS Total_valor_remesa 
                FROM cmx_remesa rm
                LEFT JOIN cmx_remesa_ordencargue ro ON rm.id = ro.id_remesa
                LEFT JOIN cmx_orden_cargue oc ON ro.id_orden_cargue = oc.id
                WHERE oc.cli_id=:cliente AND rm.estado = 1 AND oc.estado = 1");

                $sql->bindParam(':cliente', $cliente);
                // $sql->bindParam(':fecha_fin', $fecha_final);
                $sql->execute();

                $data = $sql->fetch(PDO::FETCH_ASSOC);

                if ($data && $data['Cantidad_remesas'] > 0) {
                    $response = [
                        'status' => 200,
                        'message' => 'Operación exitosa',
                        'data' => [
                            'Cantidad_remesas' => $data['Cantidad_remesas'],
                            'Total_valor_remesa' => $data['Total_valor_remesa']
                        ]
                    ];
                } else {
                    $response = [
                        'status' => 204,
                        'message' => 'No hay datos para el filtro seleccionado',
                        'data' => null
                    ];
                }
            } elseif ($filtro == 'fecha_cliente') {
                $sql = $this->_db3->prepare(" SELECT COUNT(rm.id) AS Cantidad_remesas, SUM(oc.ve_tarifacalculada) AS Total_valor_remesa 
                FROM cmx_remesa rm
                LEFT JOIN cmx_remesa_ordencargue ro ON rm.id = ro.id_remesa
                LEFT JOIN cmx_orden_cargue oc ON ro.id_orden_cargue = oc.id
                WHERE rm.fecha_creacion BETWEEN :fecha_inicio AND :fecha_fin AND oc.cli_id=:cliente AND rm.estado = 1 AND oc.estado = 1");

                $sql->bindParam(':fecha_inicio', $fecha_inicial);
                $sql->bindParam(':fecha_fin', $fecha_final);
                $sql->bindParam(':cliente', $cliente);
                $sql->execute();

                $data = $sql->fetch(PDO::FETCH_ASSOC);

                if ($data && $data['Cantidad_remesas'] > 0) {
                    $response = [
                        'status' => 200,
                        'message' => 'Operación exitosa',
                        'data' => [
                            'Cantidad_remesas' => $data['Cantidad_remesas'],
                            'Total_valor_remesa' => $data['Total_valor_remesa']
                        ]
                    ];
                } else {
                    $response = [
                        'status' => 204,
                        'message' => 'No hay datos para el filtro seleccionado',
                        'data' => null
                    ];
                }
            } elseif ($filtro == 'Mes') {
                $sql = $this->_db3->prepare(" SELECT COUNT(rm.id) AS Cantidad_remesas, SUM(oc.ve_tarifacalculada) AS Total_valor_remesa 
                FROM cmx_remesa rm
                LEFT JOIN cmx_remesa_ordencargue ro ON rm.id = ro.id_remesa
                LEFT JOIN cmx_orden_cargue oc ON ro.id_orden_cargue = oc.id
                WHERE rm.fecha_creacion BETWEEN :fecha_inicio AND :fecha_fin 
                AND rm.estado = 1 AND oc.estado = 1");

                $sql->bindParam(':fecha_inicio', $fecha_inicial);
                $sql->bindParam(':fecha_fin', $fecha_final);
                $sql->execute();

                $data = $sql->fetch(PDO::FETCH_ASSOC);

                if ($data && $data['Cantidad_remesas'] > 0) {
                    $response = [
                        'status' => 200,
                        'message' => 'Operación exitosa',
                        'data' => [
                            'Cantidad_remesas' => $data['Cantidad_remesas'],
                            'Total_valor_remesa' => $data['Total_valor_remesa']
                        ]
                    ];
                } else {
                    $response = [
                        'status' => 204,
                        'message' => 'No hay datos para el filtro seleccionado',
                        'data' => null
                    ];
                }
            }
        } catch (PDOException $e) {
            $response = [
                'status' => 500,
                'message' => 'Error en la consulta: ' . $e->getMessage(),
                'data' => null
            ];
        }
        return $response;
    }

    public function InformeTotalesManifiestos($fecha_inicial, $fecha_final, $cliente, $filtro)
    {
        $response = [];

        try {
            if ($filtro == "Fecha") {
                $sql = $this->_db3->prepare("SELECT COUNT(m.id) AS Cantidad_manifiestos, SUM(m.valor_total_viaje) AS Total_valor_manifiestos
                FROM cmx_orden_cargue oc
                INNER JOIN cmx_remesa_ordencargue ro ON oc.id=ro.id_orden_cargue
                INNER JOIN cmx_remesa rm ON ro.id_remesa=rm.id
                INNER JOIN cmx_manifiesto_remesa mr ON rm.id=mr.id_remesa
                INNER JOIN cmx_manifiesto m ON mr.id_manifiesto=m.id
                WHERE oc.fecha_orden BETWEEN STR_TO_DATE(:fecha_inicio, '%Y-%m-%d') 
                    AND STR_TO_DATE(:fecha_fin, '%Y-%m-%d') AND rm.estado=1 AND oc.estado=1  AND m.estadomnf_actual=1 AND mr.estado=1");

                $sql->bindParam(':fecha_inicio', $fecha_inicial);
                $sql->bindParam(':fecha_fin', $fecha_final);
                $sql->execute();

                $data = $sql->fetch(PDO::FETCH_ASSOC);

                if ($data && $data['Cantidad_manifiestos'] > 0) {
                    $response = [
                        'status' => 200,
                        'message' => 'Operación exitosa',
                        'data' => [
                            'Cantidad_manifiestos' => $data['Cantidad_manifiestos'],
                            'Total_valor_manifiestos' => $data['Total_valor_manifiestos']
                        ]
                    ];
                } else {
                    $response = [
                        'status' => 204,
                        'message' => 'No hay datos para el filtro seleccionado',
                        'data' => null
                    ];
                }
            } elseif ($filtro == 'Cliente') {
                // Lógica adicional si es necesario
                $sql = $this->_db3->prepare("SELECT COUNT(m.id) AS Cantidad_manifiestos, SUM(m.valor_total_viaje) AS Total_valor_manifiestos
                FROM cmx_orden_cargue oc
                INNER JOIN cmx_remesa_ordencargue ro ON oc.id=ro.id_orden_cargue
                INNER JOIN cmx_remesa rm ON ro.id_remesa=rm.id
                INNER JOIN cmx_manifiesto_remesa mr ON rm.id=mr.id_remesa
                INNER JOIN cmx_manifiesto m ON mr.id_manifiesto=m.id
                WHERE oc.cli_id=:cliente AND rm.estado=1 AND oc.estado=1  AND m.estadomnf_actual=1 AND mr.estado=1");

                $sql->bindParam(':cliente', $cliente);
                $sql->execute();

                $data = $sql->fetch(PDO::FETCH_ASSOC);

                if ($data && $data['Cantidad_manifiestos'] > 0) {
                    $response = [
                        'status' => 200,
                        'message' => 'Operación exitosa',
                        'data' => [
                            'Cantidad_manifiestos' => $data['Cantidad_manifiestos'],
                            'Total_valor_manifiestos' => $data['Total_valor_manifiestos']
                        ]
                    ];
                } else {
                    $response = [
                        'status' => 204,
                        'message' => 'No hay datos para el filtro seleccionado',
                        'data' => null
                    ];
                }
            } elseif ($filtro == 'fecha_cliente') {
                $sql = $this->_db3->prepare("SELECT COUNT(m.id) AS Cantidad_manifiestos, SUM(m.valor_total_viaje) AS Total_valor_manifiestos
                FROM cmx_orden_cargue oc
                INNER JOIN cmx_remesa_ordencargue ro ON oc.id=ro.id_orden_cargue
                INNER JOIN cmx_remesa rm ON ro.id_remesa=rm.id
                INNER JOIN cmx_manifiesto_remesa mr ON rm.id=mr.id_remesa
                INNER JOIN cmx_manifiesto m ON mr.id_manifiesto=m.id
                WHERE oc.fecha_orden BETWEEN :fecha_inicio AND :fecha_fin AND oc.cli_id=:cliente AND rm.estado=1 AND oc.estado=1  AND m.estadomnf_actual=1 AND mr.estado=1");

                $sql->bindParam(':fecha_inicio', $fecha_inicial);
                $sql->bindParam(':fecha_fin', $fecha_final);
                $sql->bindParam(':cliente', $cliente);
                $sql->execute();

                $data = $sql->fetch(PDO::FETCH_ASSOC);

                if ($data && $data['Cantidad_manifiestos'] > 0) {
                    $response = [
                        'status' => 200,
                        'message' => 'Operación exitosa',
                        'data' => [
                            'Cantidad_manifiestos' => $data['Cantidad_manifiestos'],
                            'Total_valor_manifiestos' => $data['Total_valor_manifiestos']
                        ]
                    ];
                } else {
                    $response = [
                        'status' => 204,
                        'message' => 'No hay datos para el filtro seleccionado',
                        'data' => null
                    ];
                }
            } elseif ($filtro == 'Mes') {
                $sql = $this->_db3->prepare("SELECT COUNT(m.id) AS Cantidad_manifiestos, SUM(m.valor_total_viaje) AS Total_valor_manifiestos
                FROM cmx_orden_cargue oc
                INNER JOIN cmx_remesa_ordencargue ro ON oc.id=ro.id_orden_cargue
                INNER JOIN cmx_remesa rm ON ro.id_remesa=rm.id
                INNER JOIN cmx_manifiesto_remesa mr ON rm.id=mr.id_remesa
                INNER JOIN cmx_manifiesto m ON mr.id_manifiesto=m.id
                WHERE oc.fecha_orden BETWEEN :fecha_inicio AND :fecha_fin AND rm.estado=1 AND oc.estado=1  AND m.estadomnf_actual=1 AND mr.estado=1");

                $sql->bindParam(':fecha_inicio', $fecha_inicial);
                $sql->bindParam(':fecha_fin', $fecha_final);
                $sql->execute();

                $data = $sql->fetch(PDO::FETCH_ASSOC);

                if ($data && $data['Cantidad_manifiestos'] > 0) {
                    $response = [
                        'status' => 200,
                        'message' => 'Operación exitosa',
                        'data' => [
                            'Cantidad_manifiestos' => $data['Cantidad_manifiestos'],
                            'Total_valor_manifiestos' => $data['Total_valor_manifiestos']
                        ]
                    ];
                } else {
                    $response = [
                        'status' => 204,
                        'message' => 'No hay datos para el filtro seleccionado',
                        'data' => null
                    ];
                }
            }
        } catch (PDOException $e) {
            $response = [
                'status' => 500,
                'message' => 'Error en la consulta: ' . $e->getMessage(),
                'data' => null
            ];
        }
        return $response;
    }

    public function InformeTotalesAnticipos($fecha_inicial, $fecha_final, $cliente, $filtro)
    {
        $response = [];

        try {
            if ($filtro == "Fecha") {
                $sql = $this->_db3->prepare("SELECT COUNT(ma.id) AS Cantidad_anticipos, SUM(CAST(
                REPLACE(ma.valor_anticipo, ',', '') AS DECIMAL(15,2))) AS Total_valor_anticipos
                FROM cmx_orden_cargue oc
                INNER JOIN cmx_remesa_ordencargue ro ON oc.id=ro.id_orden_cargue
                INNER JOIN cmx_remesa rm ON ro.id_remesa=rm.id
                INNER JOIN cmx_manifiesto_remesa mr ON rm.id=mr.id_remesa
                INNER JOIN cmx_manifiesto m ON mr.id_manifiesto=m.id
                INNER JOIN cmx_manifiesto_anticipo ma ON m.id=ma.id_manifiesto
                WHERE m.fecha_expedicion BETWEEN :fecha_inicio AND :fecha_fin AND rm.estado=1 AND oc.estado=1 AND m.estadomnf_actual=1 AND mr.estado=1 AND m.estado_seguimiento = 'CUMPLIDO'");

                $sql->bindParam(':fecha_inicio', $fecha_inicial);
                $sql->bindParam(':fecha_fin', $fecha_final);
                $sql->execute();
                $data = $sql->fetch(PDO::FETCH_ASSOC);

                if ($data && $data['Cantidad_anticipos'] > 0) {
                    $response = [
                        'status' => 200,
                        'message' => 'Operación exitosa',
                        'data' => [
                            'Cantidad_anticipos' => $data['Cantidad_anticipos'],
                            'Total_valor_anticipos' => $data['Total_valor_anticipos']
                        ]
                    ];
                } else {
                    $response = [
                        'status' => 204,
                        'message' => 'No hay datos para el filtro seleccionado',
                        'data' => null
                    ];
                }
            } elseif ($filtro == 'Cliente') {
                // Lógica adicional si es necesario
                $sql = $this->_db3->prepare("SELECT COUNT(m.id) AS Cantidad_anticipos, SUM(CAST(
                    REPLACE(ma.valor_anticipo, ',', '') AS DECIMAL(15,2))) AS Total_valor_anticipos
                    FROM cmx_orden_cargue oc
                    INNER JOIN cmx_remesa_ordencargue ro ON oc.id=ro.id_orden_cargue
                    INNER JOIN cmx_remesa rm ON ro.id_remesa=rm.id
                    INNER JOIN cmx_manifiesto_remesa mr ON rm.id=mr.id_remesa
                    INNER JOIN cmx_manifiesto m ON mr.id_manifiesto=m.id
                    INNER JOIN cmx_manifiesto_anticipo ma ON m.id=ma.id_manifiesto
                    WHERE oc.cli_id=:cliente AND rm.estado=1 AND oc.estado=1 AND m.estadomnf_actual=1 AND mr.estado=1 AND m.estado_seguimiento = 'CUMPLIDO'");

                $sql->bindParam(':cliente', $cliente);
                $sql->execute();

                $data = $sql->fetch(PDO::FETCH_ASSOC);

                if ($data && $data['Cantidad_anticipos'] > 0) {
                    $response = [
                        'status' => 200,
                        'message' => 'Operación exitosa',
                        'data' => [
                            'Cantidad_anticipos' => $data['Cantidad_anticipos'],
                            'Total_valor_anticipos' => $data['Total_valor_anticipos']
                        ]
                    ];
                } else {
                    $response = [
                        'status' => 204,
                        'message' => 'No hay datos para el filtro seleccionado',
                        'data' => null
                    ];
                }
            } elseif ($filtro == 'fecha_cliente') {
                $sql = $this->_db3->prepare("SELECT COUNT(m.id) AS Cantidad_anticipos, SUM(CAST(
                    REPLACE(ma.valor_anticipo, ',', '') AS DECIMAL(15,2))) AS Total_valor_anticipos
                    FROM cmx_orden_cargue oc
                    INNER JOIN cmx_remesa_ordencargue ro ON oc.id=ro.id_orden_cargue
                    INNER JOIN cmx_remesa rm ON ro.id_remesa=rm.id
                    INNER JOIN cmx_manifiesto_remesa mr ON rm.id=mr.id_remesa
                    INNER JOIN cmx_manifiesto m ON mr.id_manifiesto=m.id
                    INNER JOIN cmx_manifiesto_anticipo ma ON m.id=ma.id_manifiesto
                    WHERE oc.fecha_orden BETWEEN :fecha_inicio AND :fecha_fin AND oc.cli_id=:cliente AND rm.estado=1 AND oc.estado=1 
                    AND m.estadomnf_actual=1 AND mr.estado=1 AND m.estado_seguimiento = 'CUMPLIDO'");

                $sql->bindParam(':fecha_inicio', $fecha_inicial);
                $sql->bindParam(':fecha_fin', $fecha_final);
                $sql->bindParam(':cliente', $cliente);
                $sql->execute();

                $data = $sql->fetch(PDO::FETCH_ASSOC);

                if ($data && $data['Cantidad_anticipos'] > 0) {
                    $response = [
                        'status' => 200,
                        'message' => 'Operación exitosa',
                        'data' => [
                            'Cantidad_anticipos' => $data['Cantidad_anticipos'],
                            'Total_valor_anticipos' => $data['Total_valor_anticipos']
                        ]
                    ];
                } else {
                    $response = [
                        'status' => 204,
                        'message' => 'No hay datos para el filtro seleccionado',
                        'data' => null
                    ];
                }
            } elseif ($filtro == 'Mes') {
                $sql = $this->_db3->prepare("SELECT COUNT(ma.id) AS Cantidad_anticipos, SUM(CAST(
                    REPLACE(ma.valor_anticipo, ',', '') AS DECIMAL(15,2))) AS Total_valor_anticipos
                    FROM cmx_orden_cargue oc
                    INNER JOIN cmx_remesa_ordencargue ro ON oc.id=ro.id_orden_cargue
                    INNER JOIN cmx_remesa rm ON ro.id_remesa=rm.id
                    INNER JOIN cmx_manifiesto_remesa mr ON rm.id=mr.id_remesa
                    INNER JOIN cmx_manifiesto m ON mr.id_manifiesto=m.id
                    INNER JOIN cmx_manifiesto_anticipo ma ON m.id=ma.id_manifiesto
                    WHERE m.fecha_expedicion BETWEEN :fecha_inicio AND :fecha_fin AND rm.estado=1 AND oc.estado=1 AND m.estadomnf_actual=1 AND mr.estado=1 AND m.estado_seguimiento = 'CUMPLIDO'");

                $sql->bindParam(':fecha_inicio', $fecha_inicial);
                $sql->bindParam(':fecha_fin', $fecha_final);
                $sql->execute();
                $data = $sql->fetch(PDO::FETCH_ASSOC);

                if ($data && $data['Cantidad_anticipos'] > 0) {
                    $response = [
                        'status' => 200,
                        'message' => 'Operación exitosa',
                        'data' => [
                            'Cantidad_anticipos' => $data['Cantidad_anticipos'],
                            'Total_valor_anticipos' => $data['Total_valor_anticipos']
                        ]
                    ];
                } else {
                    $response = [
                        'status' => 204,
                        'message' => 'No hay datos para el filtro seleccionado',
                        'data' => null
                    ];
                }
            }
        } catch (PDOException $e) {
            $response = [
                'status' => 500,
                'message' => 'Error en la consulta: ' . $e->getMessage(),
                'data' => null
            ];
        }
        return $response;
    }

    public function Listar_remesas_general($fecha_inicial, $fecha_final)
    {
        // Consulta que obtiene los clientes y sus respectivas remesas, así como el total de remesas por cliente
        $stmt = $this->_db3->prepare("SELECT cl.id as cliente_id, cl.nombre, rm.id AS remesa_id, COUNT(rm.id) OVER (PARTITION BY cl.id) AS total_remesas, SUM(oc.ve_tarifacalculada) OVER (PARTITION BY cl.id) AS total_tarifacalculada
            FROM cmx_orden_cargue oc
            INNER JOIN cmx_remesa_ordencargue ro ON oc.id = ro.id_orden_cargue
            INNER JOIN cmx_remesa rm ON ro.id_remesa = rm.id
            INNER JOIN cmx_clientes cl ON oc.cli_id = cl.id
            WHERE oc.fecha_orden BETWEEN :fecha_inicio AND :fecha_fin
            AND rm.estado = 1  AND oc.estado = 1 ORDER BY cl.id, rm.id");
        $stmt->bindParam(':fecha_inicio', $fecha_inicial);
        $stmt->bindParam(':fecha_fin', $fecha_final);
        $stmt->execute();
        $clientesRemesas = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Array para almacenar los datos
        $combinedData = [];

        foreach ($clientesRemesas as $row) {
            $cliente_id = $row['cliente_id'];

            // Inicializa la entrada del cliente si no existe en el array combinado
            if (!isset($combinedData[$cliente_id])) {
                $combinedData[$cliente_id] = [
                    'cliente_id' => $cliente_id,
                    'nombre' => $row['nombre'],
                    'total_valores_remesas' => $row['total_tarifacalculada'],
                    'cantidad_remesas' => $row['total_remesas'], // Total de remesas por cliente
                    'remesas' => [], // Inicializamos el array de remesas vacío
                ];
            }

            // Añadir remesas relacionadas con este cliente
            if (!empty($row['remesa_id'])) {
                $combinedData[$cliente_id]['remesas'][] = [
                    'id_remesa' => $row['remesa_id'],
                ];
            }
        }

        // Convertir el array combinado a JSON y retornar la respuesta
        $response = array_values($combinedData); // Elimina las claves numéricas
        return $response;
    }

    public function Listar_manifiestos_general($fecha_inicial, $fecha_final)
    {
        // Consulta que obtiene los clientes y sus respectivas remesas, así como el total de remesas por cliente
        $stmt = $this->_db3->prepare("SELECT cl.id AS cliente_id, cl.nombre, COUNT(ma.id) OVER (PARTITION BY cl.id) AS total_manifiestos, SUM(ma.valor_total_viaje) OVER (PARTITION BY cl.id) AS total_tarifa_viaje
        FROM cmx_orden_cargue oc
        INNER JOIN cmx_remesa_ordencargue ro ON oc.id = ro.id_orden_cargue
        INNER JOIN cmx_remesa rm ON ro.id_remesa = rm.id
        INNER JOIN cmx_clientes cl ON oc.cli_id = cl.id
        INNER JOIN cmx_manifiesto_remesa mr ON rm.id = mr.id_remesa
        INNER JOIN cmx_manifiesto ma ON mr.id_manifiesto = ma.id
        WHERE ma.fecha_expedicion BETWEEN :fecha_inicio AND :fecha_fin 
        AND rm.estado = 1  AND oc.estado = 1 AND ma.estadomnf_actual = 1 
        AND ma.estado_seguimiento = 'CUMPLIDO'
        ORDER BY total_tarifa_viaje DESC");
        $stmt->bindParam(':fecha_inicio', $fecha_inicial);
        $stmt->bindParam(':fecha_fin', $fecha_final);
        $stmt->execute();
        $clientesRemesas = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Array para almacenar los datos
        $combinedData = [];

        foreach ($clientesRemesas as $row) {
            $cliente_id = $row['cliente_id'];

            // Inicializa la entrada del cliente si no existe en el array combinado
            if (!isset($combinedData[$cliente_id])) {
                $combinedData[$cliente_id] = [
                    'cliente_id' => $cliente_id,
                    'nombre' => $row['nombre'],
                    'total_tarifa_viaje' => $row['total_tarifa_viaje'],
                    'cantidad_manifiestos' => $row['total_manifiestos'], // Total de remesas por cliente
                    // 'remesas' => [], // Inicializamos el array de remesas vacío
                ];
            }
        }

        // Convertir el array combinado a JSON y retornar la respuesta
        $response = array_values($combinedData); // Elimina las claves numéricas
        return $response;
    }

    public function Listar_anticipos_general($fecha_inicial, $fecha_final)
    {
        // Consulta que obtiene los clientes y sus respectivas remesas, así como el total de remesas por cliente
        $stmt = $this->_db3->prepare("SELECT cl.id AS cliente_id,
        cl.nombre, COUNT(man.id) OVER (PARTITION BY cl.id) AS total_anticipos, /*SUM(man.valor_anticipo) OVER (PARTITION BY cl.id) AS*/SUM(CAST(
        REPLACE(man.valor_anticipo, ',', '') AS DECIMAL(15,2))) OVER (PARTITION BY cl.id) AS total_tarifa_anticipo
        FROM cmx_orden_cargue oc
        INNER JOIN cmx_remesa_ordencargue ro ON oc.id = ro.id_orden_cargue
        INNER JOIN cmx_remesa rm ON ro.id_remesa = rm.id
        INNER JOIN cmx_clientes cl ON oc.cli_id = cl.id
        INNER JOIN cmx_manifiesto_remesa mr ON rm.id = mr.id_remesa
        INNER JOIN cmx_manifiesto ma ON mr.id_manifiesto = ma.id
        INNER JOIN cmx_manifiesto_anticipo man ON ma.id=man.id_manifiesto
        WHERE ma.fecha_expedicion BETWEEN :fecha_inicio AND :fecha_fin AND rm.estado = 1 AND oc.estado = 1 AND ma.estadomnf_actual = 1 AND ma.estado_seguimiento = 'CUMPLIDO'
        ORDER BY total_anticipos DESC");
        // $stmt = $this->_db3->prepare("SELECT cl.id AS cliente_id, cl.nombre, COUNT(ma.id) OVER (PARTITION BY cl.id) AS total_manifiestos, SUM(ma.valor_total_viaje) OVER (PARTITION BY cl.id) AS total_tarifa_viaje
        // FROM cmx_orden_cargue oc
        // INNER JOIN cmx_remesa_ordencargue ro ON oc.id = ro.id_orden_cargue
        // INNER JOIN cmx_remesa rm ON ro.id_remesa = rm.id
        // INNER JOIN cmx_clientes cl ON oc.cli_id = cl.id
        // INNER JOIN cmx_manifiesto_remesa mr ON rm.id = mr.id_remesa
        // INNER JOIN cmx_manifiesto ma ON mr.id_manifiesto = ma.id
        // WHERE ma.fecha_expedicion BETWEEN :fecha_inicio AND :fecha_fin 
        // AND rm.estado = 1  AND oc.estado = 1 AND ma.estadomnf_actual = 1 
        // AND ma.estado_seguimiento = 'CUMPLIDO'
        // ORDER BY total_tarifa_viaje DESC");

        $stmt->bindParam(':fecha_inicio', $fecha_inicial);
        $stmt->bindParam(':fecha_fin', $fecha_final);
        $stmt->execute();
        $clientesRemesas = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Array para almacenar los datos
        $combinedData = [];

        foreach ($clientesRemesas as $row) {
            $cliente_id = $row['cliente_id'];

            // Inicializa la entrada del cliente si no existe en el array combinado
            if (!isset($combinedData[$cliente_id])) {
                $combinedData[$cliente_id] = [
                    'cliente_id' => $cliente_id,
                    'nombre' => $row['nombre'],
                    'total_tarifa_anticipo' => $row['total_tarifa_anticipo'],
                    'cantidad_anticipos' => $row['total_anticipos'], // Total de remesas por cliente
                    // 'remesas' => [], // Inicializamos el array de remesas vacío
                ];
            }
        }

        // Convertir el array combinado a JSON y retornar la respuesta
        $response = array_values($combinedData); // Elimina las claves numéricas
        return $response;
    }

    public function Listar_remesas_general_cliente($fecha_inicial, $fecha_final, $cliente_id)
    {
        // Consulta que obtiene los clientes y sus respectivas remesas, así como el total de remesas por cliente
        $stmt = $this->_db3->prepare("SELECT cl.id as cliente_id, cl.nombre, rm.id AS remesa_id, COUNT(rm.id) OVER (PARTITION BY cl.id) AS total_remesas, SUM(oc.ve_tarifacalculada) OVER (PARTITION BY cl.id) AS total_tarifacalculada
                FROM cmx_orden_cargue oc
                INNER JOIN cmx_remesa_ordencargue ro ON oc.id = ro.id_orden_cargue
                INNER JOIN cmx_remesa rm ON ro.id_remesa = rm.id
                INNER JOIN cmx_clientes cl ON oc.cli_id = cl.id
                WHERE oc.fecha_orden BETWEEN :fecha_inicio AND :fecha_fin AND cl.id=:cliente_id
                AND rm.estado = 1  AND oc.estado = 1 ORDER BY cl.id, rm.id");
        $stmt->bindParam(':fecha_inicio', $fecha_inicial);
        $stmt->bindParam(':fecha_fin', $fecha_final);
        $stmt->bindParam(':cliente_id', $cliente_id);
        $stmt->execute();
        $clientesRemesas = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Array para almacenar los datos
        $combinedData = [];

        foreach ($clientesRemesas as $row) {
            $cliente_id = $row['cliente_id'];

            // Inicializa la entrada del cliente si no existe en el array combinado
            if (!isset($combinedData[$cliente_id])) {
                $combinedData[$cliente_id] = [
                    'cliente_id' => $cliente_id,
                    'nombre' => $row['nombre'],
                    'total_valores_remesas' => $row['total_tarifacalculada'],
                    'cantidad_remesas' => $row['total_remesas'], // Total de remesas por cliente
                    'remesas' => [], // Inicializamos el array de remesas vacío
                ];
            }

            // Añadir remesas relacionadas con este cliente
            if (!empty($row['remesa_id'])) {
                $combinedData[$cliente_id]['remesas'][] = [
                    'id_remesa' => $row['remesa_id'],
                ];
            }
        }

        // Convertir el array combinado a JSON y retornar la respuesta
        $response = array_values($combinedData); // Elimina las claves numéricas
        return $response;
    }

    public function Listar_remesas_cliente($fecha_inicial, $fecha_final, $cliente_id)
    {
        $response = [];
        // Consulta que obtiene los clientes y sus respectivas remesas, así como el total de remesas por cliente
        $stmt = $this->_db3->prepare("SELECT cl.id AS cliente_id, cl.nombre, rm.id AS remesa_id, oc.ve_tarifacalculada AS total_tarifacalculada, 
                CONCAT(cond.nombre,' ',cond.apellido1,' ',cond.apellido2) AS conductor,v.placa,dm.tipo_mercancia,rm.cantidad_real_cargada,
                CONCAT(rm.fecha_creacion,' ',rm.hora_creacion) AS feha_remesa
                FROM cmx_orden_cargue oc
                INNER JOIN cmx_remesa_ordencargue ro ON oc.id = ro.id_orden_cargue
                INNER JOIN cmx_remesa rm ON ro.id_remesa = rm.id
                INNER JOIN cmx_clientes cl ON oc.cli_id = cl.id
                INNER JOIN cmx_vehiculos v ON oc.ve_idcarro=v.numdoc_vehiculo
                INNER JOIN cmx_proveedores cond ON oc.ve_id_conductor=cond.numdoc_nexos
                INNER JOIN cmx_solicitud_vehiculo2 ss ON oc.mer_idservicio= ss.nundoc_solicitud
                INNER JOIN cmx_detalle_mercancia2 dm ON ss.n_cotizacion=dm.n_cotizacion
                WHERE oc.fecha_orden BETWEEN :fecha_inicio AND :fecha_fin AND cl.id=:cliente_id AND rm.estado = 1  AND oc.estado = 1  GROUP BY rm.id ORDER BY cl.id, rm.id");
        $stmt->bindParam(':fecha_inicio', $fecha_inicial);
        $stmt->bindParam(':fecha_fin', $fecha_final);
        $stmt->bindParam(':cliente_id', $cliente_id);
        $stmt->execute();
        $clientesRemesas = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $response = ['resultados' => $clientesRemesas];
        return $response;
    }

    public function Listar_manifiestos_cliente($fecha_inicial, $fecha_final, $cliente_id)
    {
        $response = [];
        // Consulta que obtiene los clientes y sus respectivas remesas, así como el total de remesas por cliente
        $stmt = $this->_db3->prepare("SELECT cl.id AS cliente_id, cl.nombre, ma.id AS manifiesto_id, ma.valor_total_viaje AS total_tarifa_manifiesto, CONCAT(cond.nombre,' ',cond.apellido1,' ',cond.apellido2) AS conductor,v.placa, 
        CONCAT(ma.fecha_expedicion,' ',ma.hora_expedicion) AS feha_manifiesto,CONCAT(ori.municipio,' - ',ori.depto) AS Origen,CONCAT(des.municipio,' - ',des.depto) AS Destino
        FROM cmx_orden_cargue oc
        INNER JOIN cmx_remesa_ordencargue ro ON oc.id = ro.id_orden_cargue
        INNER JOIN cmx_remesa rm ON ro.id_remesa = rm.id
        INNER JOIN cmx_clientes cl ON oc.cli_id = cl.id
        INNER JOIN cmx_vehiculos v ON oc.ve_idcarro=v.numdoc_vehiculo
        INNER JOIN cmx_proveedores cond ON oc.ve_id_conductor=cond.numdoc_nexos
        INNER JOIN cmx_solicitud_vehiculo2 ss ON oc.mer_idservicio= ss.nundoc_solicitud
        INNER JOIN cmx_detalle_mercancia2 dm ON ss.n_cotizacion=dm.n_cotizacion
        INNER JOIN cmx_manifiesto_remesa mr ON rm.id = mr.id_remesa
        INNER JOIN cmx_manifiesto ma ON mr.id_manifiesto = ma.id
        INNER JOIN cmx_municipios ori ON ma.origen_viaje=ori.id
        INNER JOIN cmx_municipios des ON ma.destino_viaje=des.id
        WHERE ma.fecha_expedicion  BETWEEN :fecha_inicio AND :fecha_fin AND cl.id=:cliente_id AND rm.estado = 1  AND oc.estado = 1 AND ma.estadomnf_actual = 1 
        AND ma.estado_seguimiento = 'CUMPLIDO' GROUP BY rm.id ORDER BY cl.id, rm.id");
        $stmt->bindParam(':fecha_inicio', $fecha_inicial);
        $stmt->bindParam(':fecha_fin', $fecha_final);
        $stmt->bindParam(':cliente_id', $cliente_id);
        $stmt->execute();
        $clientesRemesas = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $response = ['resultados' => $clientesRemesas];
        return $response;
    }
    public function Listar_anticipos_cliente($fecha_inicial, $fecha_final, $cliente_id)
    {
        $response = [];
        // Consulta que obtiene los clientes y sus respectivas remesas, así como el total de remesas por cliente
        $stmt = $this->_db3->prepare("SELECT cl.id AS cliente_id, cl.nombre, man.id_manifiesto AS manifiesto_id,CAST(REPLACE(man.valor_anticipo, ',', '') AS DECIMAL(15,2)) AS total_tari_anticipo, /*man.valor_anticipo AS total_tari_anticipo,*/
        CONCAT(cond.nombre,' ',cond.apellido1,' ',cond.apellido2) AS conductor,v.placa, CONCAT(ma.fecha_expedicion,' ',ma.hora_expedicion) AS feha_manifiesto,
        CONCAT(ori.municipio,' - ',ori.depto) AS Origen,CONCAT(des.municipio,' - ',des.depto) AS Destino
        FROM cmx_orden_cargue oc
        INNER JOIN cmx_remesa_ordencargue ro ON oc.id = ro.id_orden_cargue
        INNER JOIN cmx_remesa rm ON ro.id_remesa = rm.id
        INNER JOIN cmx_clientes cl ON oc.cli_id = cl.id
        INNER JOIN cmx_vehiculos v ON oc.ve_idcarro=v.numdoc_vehiculo
        INNER JOIN cmx_proveedores cond ON oc.ve_id_conductor=cond.numdoc_nexos
        INNER JOIN cmx_solicitud_vehiculo2 ss ON oc.mer_idservicio= ss.nundoc_solicitud
        INNER JOIN cmx_detalle_mercancia2 dm ON ss.n_cotizacion=dm.n_cotizacion
        INNER JOIN cmx_manifiesto_remesa mr ON rm.id = mr.id_remesa
        INNER JOIN cmx_manifiesto ma ON mr.id_manifiesto = ma.id
        INNER JOIN cmx_manifiesto_anticipo man ON ma.id=man.id_manifiesto
        INNER JOIN cmx_municipios ori ON ma.origen_viaje=ori.id
        INNER JOIN cmx_municipios des ON ma.destino_viaje=des.id
        WHERE ma.fecha_expedicion BETWEEN :fecha_inicio AND :fecha_fin AND cl.id=:cliente_id AND rm.estado = 1 AND oc.estado = 1 /*AND ma.estado_seguimiento = 'CUMPLIDO'*/
        GROUP BY man.id_manifiesto ORDER BY cl.id, man.id_manifiesto");

        // $stmt = $this->_db3->prepare("SELECT cl.id AS cliente_id, cl.nombre, ma.id AS manifiesto_id, ma.valor_total_viaje AS total_tarifa_manifiesto, CONCAT(cond.nombre,' ',cond.apellido1,' ',cond.apellido2) AS conductor,v.placa, 
        // CONCAT(ma.fecha_expedicion,' ',ma.hora_expedicion) AS feha_manifiesto,CONCAT(ori.municipio,' - ',ori.depto) AS Origen,CONCAT(des.municipio,' - ',des.depto) AS Destino
        // FROM cmx_orden_cargue oc
        // INNER JOIN cmx_remesa_ordencargue ro ON oc.id = ro.id_orden_cargue
        // INNER JOIN cmx_remesa rm ON ro.id_remesa = rm.id
        // INNER JOIN cmx_clientes cl ON oc.cli_id = cl.id
        // INNER JOIN cmx_vehiculos v ON oc.ve_idcarro=v.numdoc_vehiculo
        // INNER JOIN cmx_proveedores cond ON oc.ve_id_conductor=cond.numdoc_nexos
        // INNER JOIN cmx_solicitud_vehiculo2 ss ON oc.mer_idservicio= ss.nundoc_solicitud
        // INNER JOIN cmx_detalle_mercancia2 dm ON ss.n_cotizacion=dm.n_cotizacion
        // INNER JOIN cmx_manifiesto_remesa mr ON rm.id = mr.id_remesa
        // INNER JOIN cmx_manifiesto ma ON mr.id_manifiesto = ma.id
        // INNER JOIN cmx_municipios ori ON ma.origen_viaje=ori.id
        // INNER JOIN cmx_municipios des ON ma.destino_viaje=des.id
        // WHERE ma.fecha_expedicion  BETWEEN :fecha_inicio AND :fecha_fin AND cl.id=:cliente_id AND rm.estado = 1  AND oc.estado = 1 AND ma.estadomnf_actual = 1 
        // AND ma.estado_seguimiento = 'CUMPLIDO' GROUP BY rm.id ORDER BY cl.id, rm.id");
        $stmt->bindParam(':fecha_inicio', $fecha_inicial);
        $stmt->bindParam(':fecha_fin', $fecha_final);
        $stmt->bindParam(':cliente_id', $cliente_id);
        $stmt->execute();
        $clientesRemesas = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $response = ['resultados' => $clientesRemesas];
        return $response;
    }

    public function Buscar_cliente($busqueda)
    {
        $stmt = $this->_db3->prepare("SELECT * FROM cmx_clientes WHERE nombre LIKE :busqueda OR documento LIKE :busqueda");
        $busqueda = "%" . $busqueda . "%";
        $stmt->bindParam(':busqueda', $busqueda);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function Listar_clientes_seguimiento()
    {
        $stmt = $this->_db3->prepare("SELECT * FROM cmx_clientes");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function listar_meses_informe()
    {
        $stmt = $this->_db3->prepare("SELECT * FROM cmx_mes");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function listar_mes_kpi($mes)
    {
        $stmt = $this->_db3->prepare("SELECT m.fecha_inicio,m.fecha_fin,obj.kpi,k.nombre_kpi,k.tipo_kpi,k.operacion_kpi FROM cmx_mes m 
        INNER JOIN cmx_objetivos obj ON m.id=obj.mes_id
        INNER JOIN cmx_kpi k ON obj.kpi_id=k.id 
        WHERE m.id=:mes");
        $stmt->bindParam(":mes", $mes);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Función para convertir kilolitros a toneladas
    function kilolitrosAToneladas($kilolitros, $densidad = 1000)
    {
        // Convertimos kilolitros a toneladas usando la densidad
        return $kilolitros / $densidad;
    }

    //Informe de servicios especiales
    public function Informe_servicios_especiales($fecha_inicial, $fecha_final)
    {
        $sql = $this->_db3->prepare("SELECT serv.id AS numdoc_servicio,CONCAT(ct.fecha_creacion,' - ',ct.hora_creacion) AS fecha_servicio,cl.nombre AS clientes,serv.tipo_servicio AS concepto,ss.nundoc_solicitud,
        CONCAT(ss.fecha,' - ',ss.hora) AS fecha_solicitud,m.id AS numdoc_manifiesto,CONCAT(m.fecha_expedicion,'-',m.hora_expedicion) AS fecha_manifiesto,serv.tarifa_unitaria AS valor_servicio
        FROM cmx_detalle_servespecial2 serv
        INNER JOIN cmx_cotizaciones_serviciocliente ct ON serv.n_cotizacion=ct.n_cotizacion
        INNER JOIN cmx_solicitud_vehiculo2 ss ON serv.n_cotizacion=ss.n_cotizacion
        INNER JOIN cmx_orden_cargue oc ON ss.nundoc_solicitud=oc.mer_idservicio
        INNER JOIN cmx_remesa_ordencargue ro ON oc.id=ro.id_orden_cargue
        INNER JOIN cmx_remesa rm ON ro.id_remesa=rm.id
        INNER JOIN cmx_manifiesto_remesa mr ON rm.id=mr.id_remesa
        INNER JOIN cmx_manifiesto m ON mr.id_manifiesto=m.id
        INNER JOIN cmx_clientes cl ON oc.cli_id=cl.id
        WHERE ss.fecha BETWEEN :fecha_inicio AND :fecha_fin AND ss.estado='Realizada'");
        $sql->bindParam(':fecha_inicio', $fecha_inicial);
        $sql->bindParam(':fecha_fin', $fecha_final);
        $sql->execute();
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    //Informe de estudios de seguridad

    public function Informe_estudios_seguridad($fecha_inicial, $fecha_final)
    {
        $sql = $this->_db3->prepare("SELECT 
        SUM(CASE WHEN estado = 'Aprobado' THEN 1 ELSE 0 END) AS Aprobados,
        SUM(CASE WHEN estado = 'Pendiente' THEN 1 ELSE 0 END) AS Pendientes,
        SUM(CASE WHEN estado = 'Rechazado' THEN 1 ELSE 0 END) AS Rechazados,
        SUM(CASE WHEN estado IN ('Aprobado', 'Pendiente', 'Rechazado') THEN 1 ELSE 0 END) AS Total_Parcial
        FROM cmx_estudiov_completo ec
        WHERE DATE_FORMAT(ec.fecha,'%Y-%m-%d') BETWEEN :fecha_inicio AND :fecha_fin");
        $sql->bindParam(':fecha_inicio', $fecha_inicial);
        $sql->bindParam(':fecha_fin', $fecha_final);
        $sql->execute();
        return $sql->fetch(PDO::FETCH_ASSOC);
    }


    public function Informe_estudios_seguridad_estados($fecha_inicial, $fecha_final, $estado)
    {
        $sql = $this->_db3->prepare("SELECT estv.id_estudio,estv.placa,estv.operacion,CONCAT(estv.fecha,'-',estv.hora) AS fecha_solicitud, cl.nombre AS Cliente,estv.usuario,estc.estado
				FROM  cmx_estudio_vehiculo estv
                INNER JOIN cmx_estudiov_completo estc ON estc.id_estudio=estv.id_estudio
                INNER JOIN cmx_vehiculos vh ON estv.placa=vh.placa
                INNER JOIN cmx_proveedores pro ON estc.id_conductor=pro.numdoc_nexos
                INNER JOIN cmx_actividad_proveedor acp ON acp.id_proveedor=pro.numdoc_nexos
                INNER JOIN cmx_preestudio_solicitudes_servicio prs ON estv.id_estudio=prs.id_solicitudpreestudio
                INNER JOIN cmx_solicitud_vehiculo2 ss ON prs.id_servicio_cliente=ss.nundoc_solicitud
                INNER JOIN cmx_cotizaciones_serviciocliente cs ON ss.n_cotizacion=cs.n_cotizacion
                INNER JOIN cmx_clientes cl ON cs.id_cliente=cl.id
                LEFT  JOIN cmx_prefiltro_actualizar pa ON estv.id_estudio=pa.id_solicitud_u
                WHERE  estc.fecha BETWEEN '" . $fecha_inicial . "' AND '" . $fecha_final . "' AND estc.estado='" . $estado . "' GROUP BY estv.id_estudio ORDER BY estv.id_estudio DESC");
        $resultado_ssp = $sql->execute();
        $resultado_ssp = $sql->fetchAll(PDO::FETCH_ASSOC);
        $response = ["respuesta" => $resultado_ssp];
        return $response;
    }

    public function Informe_responsable_placas($fecha_inicial, $fecha_final, $responsable)
    {
        if ($responsable) {
            $sql = $this->_db3->prepare("SELECT ma.id AS numdoc_manifiesto,CONCAT(ma.fecha_expedicion,' - ',ma.hora_expedicion) AS fecha_manifiesto,u.nom_usuario AS responsable,ma.placa,cs.nombre_cliente,tv.clase AS tipo_vehiculo, 
            CAST(REPLACE(ma.valor_total_viaje, ',', '') AS DECIMAL(15,2)) AS Flete,
            CONCAT(ori.municipio, ' - ', ori.depto) AS Origen, 
            CONCAT(des.municipio, ' - ', des.depto) AS Destino
            FROM cmx_manifiesto ma 
            INNER JOIN cmx_manifiesto_estado me ON ma.id= me.id_manifiesto AND me.estado=1
            INNER JOIN cmx_manifiesto_remesa mr ON ma.id=mr.id_manifiesto
            INNER JOIN cmx_remesa rm ON mr.id_remesa=rm.id
            INNER JOIN cmx_remesa_ordencargue ro ON rm.id=ro.id_remesa
            INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue=oc.id
            INNER JOIN cmx_subasta_flete sf ON oc.id= sf.numero_orden
            INNER JOIN cmx_subasta_solicitud_servicio sse ON sf.id_suba=sse.id_subasta
            INNER JOIN cmx_solicitud_vehiculo2 ss ON sse.numer_solservicio = ss.nundoc_solicitud
            INNER JOIN cmx_cotizaciones_serviciocliente cs ON ss.n_cotizacion = cs.n_cotizacion
            INNER JOIN cmx_vehiculos v ON ma.placa = v.placa
            INNER JOIN cmx_vehiculo2 v2 ON v.numdoc_vehiculo = v2.id_vehiculo
            INNER JOIN cmx_municipios ori ON ma.origen_viaje = ori.id
            INNER JOIN cmx_municipios des ON ma.destino_viaje = des.id
            --  INNER JOIN cmx_para_tipo_vehiculo tv ON v2.clase_vehiculo = tv.id
            INNER JOIN cmx_rndc_clase_vehiculo tv ON v2.clase_vehiculo=tv.id
            INNER JOIN cmx_estudio_vehiculo es ON sf.num_estudioseguridad=es.id_estudio
            INNER JOIN cmx_estudiov_completo ec ON es.id_estudio = ec.id_estudio
            LEFT JOIN cmx_usuarios u ON es.responsable=u.id AND u.estado=1
            WHERE ma.fecha_expedicion BETWEEN :fecha_inicio AND :fech_fin AND u.id = :responsable  AND ma.estadomnf_actual=1 GROUP BY ma.id");
            $sql->bindParam(':fecha_inicio', $fecha_inicial);
            $sql->bindParam(':fech_fin', $fecha_final);
            $sql->bindParam(':responsable', $responsable);
            $sql->execute();
            return $sql->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $sql = $this->_db3->prepare("SELECT ma.id AS numdoc_manifiesto,CONCAT(ma.fecha_expedicion,' - ',ma.hora_expedicion) AS fecha_manifiesto,u.nom_usuario AS responsable,ma.placa,cs.nombre_cliente,tv.clase AS tipo_vehiculo, 
            CAST(REPLACE(ma.valor_total_viaje, ',', '') AS DECIMAL(15,2)) AS Flete,
            CONCAT(ori.municipio, ' - ', ori.depto) AS Origen, 
            CONCAT(des.municipio, ' - ', des.depto) AS Destino
            FROM cmx_manifiesto ma 
            INNER JOIN cmx_manifiesto_estado me ON ma.id= me.id_manifiesto AND me.estado=1
            INNER JOIN cmx_manifiesto_remesa mr ON ma.id=mr.id_manifiesto
            INNER JOIN cmx_remesa rm ON mr.id_remesa=rm.id
            INNER JOIN cmx_remesa_ordencargue ro ON rm.id=ro.id_remesa
            INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue=oc.id
            INNER JOIN cmx_subasta_flete sf ON oc.id= sf.numero_orden
            INNER JOIN cmx_subasta_solicitud_servicio sse ON sf.id_suba=sse.id_subasta
            INNER JOIN cmx_solicitud_vehiculo2 ss ON sse.numer_solservicio = ss.nundoc_solicitud
            INNER JOIN cmx_cotizaciones_serviciocliente cs ON ss.n_cotizacion = cs.n_cotizacion
            INNER JOIN cmx_vehiculos v ON ma.placa = v.placa
            INNER JOIN cmx_vehiculo2 v2 ON v.numdoc_vehiculo = v2.id_vehiculo
            INNER JOIN cmx_municipios ori ON ma.origen_viaje = ori.id
            INNER JOIN cmx_municipios des ON ma.destino_viaje = des.id
            --  INNER JOIN cmx_para_tipo_vehiculo tv ON v2.clase_vehiculo = tv.id
            INNER JOIN cmx_rndc_clase_vehiculo tv ON v2.clase_vehiculo=tv.id
            INNER JOIN cmx_estudio_vehiculo es ON sf.num_estudioseguridad=es.id_estudio
            INNER JOIN cmx_estudiov_completo ec ON es.id_estudio = ec.id_estudio
            LEFT JOIN cmx_usuarios u ON es.responsable=u.id AND u.estado=1
            WHERE ma.fecha_expedicion BETWEEN :fecha_inicio AND :fech_fin  AND ma.estadomnf_actual=1 GROUP BY ma.id");
            $sql->bindParam(':fecha_inicio', $fecha_inicial);
            $sql->bindParam(':fech_fin', $fecha_final);
            $sql->execute();
            return $sql->fetchAll(PDO::FETCH_ASSOC);
        }
    }

    public function Consultar_responsables_vehiculo()
    {
        $sql_responsable = $this->_db3->prepare("SELECT u.user_log,u.nom_usuario,u.id AS usuario_responsable_id FROM cmx_usuarios u 
        INNER JOIN cmx_usuario_cliente uc ON u.id=uc.id_usuario
        INNER JOIN cmx_perfiles p ON uc.id_perfil=p.id
        WHERE p.tipo_perfil='CARGO' AND (p.id=8 OR p.id=9 OR p.id=34) AND u.estado=1");
        $sql_responsable->execute();
        $resultado = $sql_responsable->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Informe_pedidos(/* $fecha_inicial, $fecha_final, */$num_pedido)
    {
        $response = [];
        $sql = $this->_db3->prepare("SELECT tot.nombre_opcion,CONCAT(dop.fecha_creacion,' ',dop.hora) AS Fecha_registro,dop.costo_actividad,dop.costo_promedio,dop.estado_actividad
        FROM cmx_trazabilidad_proceso tp
        INNER JOIN cmx_detalle_opcion_trazabilidad dop  ON tp.numdoc = dop.numdoc_detalle_opcion
        INNER JOIN cmx_tipo_opcion_trazabilidad tot ON dop.detalle_proceso = tot.id
        WHERE referencia = :referencia");
        $sql->bindParam(':referencia', $num_pedido);
        $sql->execute();
        $datos = $sql->fetchAll(PDO::FETCH_ASSOC);

        $sql1 = $this->_db3->prepare("SELECT MAX(ps.fecha) AS fecha_gestion FROM cmx_trazabilidad_proceso tp 
        INNER JOIN cmx_pedidos_solicitudes_detalles ps ON tp.numdoc=ps.num_pedido
        INNER JOIN cmx_detalle_opcion_trazabilidad dop ON tp.numdoc = dop.numdoc_detalle_opcion
        WHERE tp.referencia = :referencia AND tp.estado='ACTIVO' AND dop.estado_actividad='COMPLETADO'");

        // $sql1 = $this->_db3->prepare("SELECT MAX(ps.fecha) AS fecha_gestion 
        // FROM cmx_trazabilidad_proceso tp 
        // INNER JOIN cmx_pedidos_solicitudes_detalles ps  ON tp.numdoc = ps.num_pedido

        // WHERE tp.referencia = :referencia");
        $sql1->bindParam(':referencia', $num_pedido);
        $sql1->execute();
        $datos1 = $sql1->fetchAll(PDO::FETCH_ASSOC);

        // Asegurar que la lista de gestión esté bien indexada
        $fechas_gestion = array_column($datos1, 'fecha_gestion');

        // Combinar resultados en un solo array
        $response = [];
        foreach ($datos as $key => $dato) {
            // // Convertir las fechas a objetos DateTime
            // $fecha_registro = new DateTime($dato["Fecha_registro"]);
            // $fecha_gestion = isset($fechas_gestion[$key]) ? new DateTime($fechas_gestion[$key]) : null;

            // // Si la fecha de gestión no está disponible, asignar 'No gestionada'
            // if ($fecha_gestion) {
            //     // Calcular la diferencia
            //     $diferencia = $fecha_registro->diff($fecha_gestion);

            //     // Crear un string con la diferencia en formato legible (días, horas, minutos)
            //     $diferencia_formateada = $diferencia->days . ' días, ' . $diferencia->h . ' horas, ' . $diferencia->i . ' minutos';
            // } else {
            //     $diferencia_formateada = 'No gestionada';
            // }

            // Convertir las fechas a objetos DateTime
            $fecha_registro = new DateTime($dato["Fecha_registro"]);

            // Si no hay fecha de gestión, usar la fecha actual
            $fecha_gestion = isset($fechas_gestion[$key]) ? new DateTime($fechas_gestion[$key]) : new DateTime();

            // Calcular la diferencia
            $diferencia = $fecha_registro->diff($fecha_gestion);

            // Crear un string con la diferencia en formato legible (días, horas, minutos)
            $diferencia_formateada = $diferencia->days . ' días, ' . $diferencia->h . ' horas, ' . $diferencia->i . ' minutos';

            // Añadir los resultados al array de respuesta
            $response[] = [
                "nombre_opcion" => $dato["nombre_opcion"],
                "fecha_registro" => $dato["Fecha_registro"],
                "costo_actividad" => $dato["costo_actividad"],
                "costo_promedio" => $dato["costo_promedio"],
                "estado_actividad" => $dato["estado_actividad"],
                "fecha_gestion" => isset($fechas_gestion[$key]) ? $fechas_gestion[$key] : 'No gestionada',
                "diferencia" => $diferencia_formateada
            ];
        }

        return $response;
    }

    public function Informe_cumplidos($fecha_inicial, $fecha_final, $num_pedido)
    {
        if ($fecha_inicial !== "" && $fecha_final !== "" && $num_pedido !== "") {
            // $fecha_inicial = $fecha_inicial . ' 06:00:00';
            // $fecha_final   = $fecha_final . ' 23:00:00';
            $sql = $this->_db3->prepare("SELECT m.placa, m.id AS manifesto,m.fecha_expedicion,rem.id AS remesa, cl.nombre AS Cliente,
            CONCAT(ori.municipio,'-',ori.depto) AS Origen, CONCAT(des.municipio,'-',des.depto) AS Destino,m.Lugar AS Agencia,me.usuario AS Planillador,
            me.estado AS Estado_Manifiesto,rme.estado AS Estado_Remesa, eoc.estado AS Estado_Orden_Cargue,cu.id AS cumplido, 
            CONCAT(cu.fecha,' ',cu.hora) AS fecha_cumplido,cu.usuario,m.estado_seguimiento,cu.novedad AS observacion
            FROM  cmx_manifiesto m 
            INNER JOIN cmx_manifiesto_estado me ON m.id=me.id_manifiesto
            INNER JOIN cmx_manifiesto_remesa mr ON m.id=mr.id_manifiesto
            INNER JOIN cmx_remesa rem ON mr.id_remesa=rem.id
            INNER JOIN cmx_estado_remesa rme ON rem.id=rme.id_remesa
            INNER JOIN cmx_remesa_ordencargue ro ON rem.id=ro.id_remesa
            INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue=oc.id 
            INNER JOIN cmx_estado_ordencargue eoc ON oc.id=eoc.id_orden
            INNER JOIN cmx_clientes cl ON oc.cli_id=cl.id
            INNER JOIN cmx_municipios ori ON m.origen_viaje=ori.id
            INNER JOIN cmx_municipios des ON m.destino_viaje=des.id
            LEFT  JOIN cmx_cumplido cu ON cu.manifiesto=m.id
            LEFT  JOIN cmx_cumplido_remesa cr ON cu.id=cr.id_cumplido
            WHERE
                m.fecha_expedicion BETWEEN STR_TO_DATE(:Fecha_inicio, '%Y-%m-%d' ) 
                AND STR_TO_DATE(:Fecha_final, '%Y-%m-%d' )
            GROUP BY m.id ORDER BY m.id DESC");
            // WHERE m.id=:dato OR rem.id=:dato OR m.placa=:dato AND m.fecha_expedicion BETWEEN :Fecha_inicio AND :Fecha_final
            // WHERE DATE_FORMAT(m.fecha_expedicion,'%Y-%m-%d') BETWEEN :Fecha_inicio AND :Fecha_final");
            $sql->bindParam(':dato', $num_pedido);
            $sql->bindParam(':Fecha_inicio', $fecha_inicial);
            $sql->bindParam(':Fecha_final', $fecha_final);
            // $sql->bindParam(':dato', $num_pedido);
            $sql->execute();
            $datos = $sql->fetchAll(PDO::FETCH_ASSOC);
            return $datos;
        } else if ($fecha_inicial !== "" && $fecha_final !== "" && $num_pedido === "") {
            $fecha_inicial = $fecha_inicial . ' 06:00:00';
            $fecha_final   = $fecha_final . ' 23:00:00';
            $sql = $this->_db3->prepare("SELECT m.placa,m.id AS manifesto, m.fecha_expedicion, rem.id AS remesa, cl.nombre AS Cliente,
            CONCAT(ori.municipio,'-',ori.depto) AS Origen, CONCAT(des.municipio,'-',des.depto) AS Destino,m.Lugar AS Agencia,me.usuario AS Planillador,
            me.estado AS Estado_Manifiesto,rme.estado AS Estado_Remesa, eoc.estado AS Estado_Orden_Cargue,cu.id AS cumplido, 
            CONCAT(cu.fecha,' ',cu.hora) AS fecha_cumplido,cu.usuario,m.estado_seguimiento,cu.novedad AS observacion
            FROM  cmx_manifiesto m 
            INNER JOIN cmx_manifiesto_estado me ON m.id=me.id_manifiesto
            INNER JOIN cmx_manifiesto_remesa mr ON m.id=mr.id_manifiesto
            INNER JOIN cmx_remesa rem ON mr.id_remesa=rem.id
            INNER JOIN cmx_estado_remesa rme ON rem.id=rme.id_remesa
            INNER JOIN cmx_remesa_ordencargue ro ON rem.id=ro.id_remesa
            INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue=oc.id 
            INNER JOIN cmx_estado_ordencargue eoc ON oc.id=eoc.id_orden
            INNER JOIN cmx_clientes cl ON oc.cli_id=cl.id
            INNER JOIN cmx_municipios ori ON m.origen_viaje=ori.id
            INNER JOIN cmx_municipios des ON m.destino_viaje=des.id
            LEFT  JOIN cmx_cumplido cu ON cu.manifiesto=m.id
            LEFT  JOIN cmx_cumplido_remesa cr ON cu.id=cr.id_cumplido
            WHERE m.fecha_expedicion BETWEEN :Fecha_inicio AND :Fecha_final
            GROUP BY m.id ORDER BY m.id DESC");
            $sql->bindParam(':Fecha_inicio', $fecha_inicial);
            $sql->bindParam(':Fecha_final', $fecha_final);
            // $sql->bindParam(':dato', $num_pedido);
            $sql->execute();
            $datos = $sql->fetchAll(PDO::FETCH_ASSOC);
            return $datos;
        } else {
            $sql = $this->_db3->prepare("SELECT m.placa,m.id AS manifesto,m.fecha_expedicion,rem.id AS remesa, cl.nombre AS Cliente,
            CONCAT(ori.municipio,'-',ori.depto) AS Origen, CONCAT(des.municipio,'-',des.depto) AS Destino,m.Lugar AS Agencia,me.usuario AS Planillador,
            me.estado AS Estado_Manifiesto,rme.estado AS Estado_Remesa, eoc.estado AS Estado_Orden_Cargue,cu.id AS cumplido, 
            CONCAT(cu.fecha,' ',cu.hora) AS fecha_cumplido,cu.usuario,m.estado_seguimiento,cu.novedad AS observacion
            FROM  cmx_manifiesto m 
            INNER JOIN cmx_manifiesto_estado me ON m.id=me.id_manifiesto
            INNER JOIN cmx_manifiesto_remesa mr ON m.id=mr.id_manifiesto
            INNER JOIN cmx_remesa rem ON mr.id_remesa=rem.id
            INNER JOIN cmx_estado_remesa rme ON rem.id=rme.id_remesa
            INNER JOIN cmx_remesa_ordencargue ro ON rem.id=ro.id_remesa
            INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue=oc.id 
            INNER JOIN cmx_estado_ordencargue eoc ON oc.id=eoc.id_orden
            INNER JOIN cmx_clientes cl ON oc.cli_id=cl.id
            INNER JOIN cmx_municipios ori ON m.origen_viaje=ori.id
            INNER JOIN cmx_municipios des ON m.destino_viaje=des.id
            LEFT  JOIN cmx_cumplido cu ON cu.manifiesto=m.id
            LEFT  JOIN cmx_cumplido_remesa cr ON cu.id=cr.id_cumplido
            WHERE m.id=:dato OR rem.id=:dato OR m.placa=:dato AND m.fecha_expedicion>='2024-08-02' GROUP BY m.id ORDER BY m.id DESC");
            $sql->bindParam(':dato', $num_pedido);
            $sql->execute();
            $datos = $sql->fetchAll(PDO::FETCH_ASSOC);
            return $datos;
        }
    }

    public function Informe_historico_seguimiento($fecha_inicial, $fecha_final, $criterio_busqueda)
    {
        if ($fecha_inicial && $fecha_final !== "" && $criterio_busqueda !== "") {
            $sql = $this->_db3->prepare("SELECT COUNT(m.id) AS Total_Viajes, m.id AS Manifiesto,mr.id_remesa AS Remesa,cl.nombre AS Cliente,m.fecha_expedicion,m.placa,CONCAT(cond.nombre,' ',cond.apellido1,' ',cond.apellido2) AS Conductor,
            CONCAT(ori.municipio,'-',ori.depto) AS Origen, CONCAT(des.municipio,'-',des.depto) AS Destino,m.Lugar AS Agencia FROM cmx_manifiesto m 
            -- INNER JOIN cmx_manifiesto_estado me ON m.id=me.id_manifiesto
            INNER JOIN cmx_manifiesto_remesa mr ON m.id=mr.id_manifiesto
            INNER JOIN cmx_remesa rem ON mr.id_remesa=rem.id
            -- INNER JOIN cmx_estado_remesa rme ON rem.id=rme.id_remesa
            INNER JOIN cmx_remesa_ordencargue ro ON rem.id=ro.id_remesa
            INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue=oc.id 
            -- INNER JOIN cmx_estado_ordencargue eoc ON oc.id=eoc.id_orden
            INNER JOIN cmx_clientes cl ON oc.cli_id=cl.id
            INNER JOIN cmx_municipios ori ON m.origen_viaje=ori.id
            INNER JOIN cmx_municipios des ON m.destino_viaje=des.id
            INNER JOIN cmx_vehiculos v ON m.placa=v.placa
            INNER JOIN cmx_proveedores cond ON m.conductor_manifiesto=cond.numero_documento
            WHERE m.placa=:placa AND m.fecha_expedicion BETWEEN :Fecha_inicio AND :Fecha_final AND m.fecha_expedicion>='2024-08-02' GROUP BY 
            m.id, mr.id_remesa, cl.nombre, m.fecha_expedicion, m.placa, 
            cond.nombre, cond.apellido1, cond.apellido2, ori.municipio, 
            ori.depto, des.municipio, des.depto, m.Lugar");
            $sql->bindParam(':placa', $criterio_busqueda);
            $sql->bindParam(':Fecha_inicio', $fecha_inicial);
            $sql->bindParam(':Fecha_final', $fecha_final);
            // $sql->bindParam(':dato', $num_pedido);
            $sql->execute();
            $datos = $sql->fetchAll(PDO::FETCH_ASSOC);
            return $datos;
        } else {
            $sql = $this->_db3->prepare("SELECT COUNT(m.id) AS Total_Viajes, m.id AS Manifiesto,mr.id_remesa AS Remesa,cl.nombre AS Cliente,m.fecha_expedicion,m.placa,CONCAT(cond.nombre,' ',cond.apellido1,' ',cond.apellido2) AS Conductor,
            CONCAT(ori.municipio,'-',ori.depto) AS Origen, CONCAT(des.municipio,'-',des.depto) AS Destino,m.Lugar AS Agencia FROM cmx_manifiesto m 
            -- INNER JOIN cmx_manifiesto_estado me ON m.id=me.id_manifiesto
            INNER JOIN cmx_manifiesto_remesa mr ON m.id=mr.id_manifiesto
            INNER JOIN cmx_remesa rem ON mr.id_remesa=rem.id
            -- INNER JOIN cmx_estado_remesa rme ON rem.id=rme.id_remesa
            INNER JOIN cmx_remesa_ordencargue ro ON rem.id=ro.id_remesa
            INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue=oc.id 
            -- INNER JOIN cmx_estado_ordencargue eoc ON oc.id=eoc.id_orden
            INNER JOIN cmx_clientes cl ON oc.cli_id=cl.id
            INNER JOIN cmx_municipios ori ON m.origen_viaje=ori.id
            INNER JOIN cmx_municipios des ON m.destino_viaje=des.id
            INNER JOIN cmx_vehiculos v ON m.placa=v.placa
            INNER JOIN cmx_proveedores cond ON m.conductor_manifiesto=cond.numero_documento
            WHERE m.id=:dato OR rem.id=:dato OR m.placa=:dato AND m.fecha_expedicion>='2024-08-02' GROUP BY 
            m.id, mr.id_remesa, cl.nombre, m.fecha_expedicion, m.placa, 
            cond.nombre, cond.apellido1, cond.apellido2, ori.municipio, 
            ori.depto, des.municipio, des.depto, m.Lugar");
            $sql->bindParam(':dato', $criterio_busqueda);
            $sql->execute();
            $datos = $sql->fetchAll(PDO::FETCH_ASSOC);
            return $datos;
        }
    }

    public function Informe_Vehiculos($fecha_inicial, $fecha_final)
    {
        if ($fecha_inicial && $fecha_final !== "") {
            $sql = $this->_db3->prepare("SELECT
                v.placa,
                cv.clase,
                vca.descripcion AS tipo_vehiculo,
                vco.descripcion AS configuracion,
                CONCAT( cond.nombre, ' ', cond.apellido1, ' ', cond.apellido2 ) AS Conductor,
                CONCAT(cond.celular,' - ',dc.celular2) AS Celular,
                CONCAT( pose.nombre, ' ', pose.apellido1, ' ', pose.apellido2 ) AS Poseedor,
                pose.celular AS Celular_Poseedor,
                v.estado
            FROM
                cmx_vehiculos v
                INNER JOIN cmx_vehiculo2 v2 ON v.numdoc_vehiculo = v2.id_vehiculo
                INNER JOIN cmx_rndc_vehiculos_carroceria vca ON v.tipo_carroceria = vca.id
                INNER JOIN cmx_rndc_vehiculos_configuracion vco ON v2.configuracion = vco.id
                INNER JOIN cmx_rndc_clase_vehiculo cv ON v2.clase_vehiculo = cv.id
                INNER JOIN cmx_proveedores cond ON v.id_conductor = cond.numdoc_nexos
                INNER JOIN cmx_detalle_conductor dc ON cond.numdoc_nexos = dc.id_proveedor
                INNER JOIN cmx_proveedores pose ON v.id_conductor = pose.numdoc_nexos
                INNER JOIN cmx_log_vehiculos logv ON v.numdoc_vehiculo = logv.id_vehiculo AND logv.operacion = 'Crear'
            WHERE
                DATE(logv.fecha_hora_operacion) BETWEEN :fecha_inicio AND :fecha_final GROUP BY v.placa");

            $sql->bindParam(':fecha_inicio', $fecha_inicial);
            $sql->bindParam(':fecha_final', $fecha_final);
            $sql->execute();
            $datos = $sql->fetchAll(PDO::FETCH_ASSOC);
            return $datos;
        }
    }

    public function Informe_instruccion_facturacion($fecha_inicial = null, $fecha_final = null, $criterio_busqueda = null)
    {
        $sql = "
            SELECT
                cl.nombre AS Cliente,
                rm.id AS Remesa,
                mr.id_manifiesto AS Manifiesto,
                CONCAT(rm.fecha_creacion, ' ', rm.hora_creacion) AS Fecha_Remesa,
                ifa.id AS Instruccion,
                CONCAT(ifa.fecha, ' ', ifa.hora) AS Fecha_Instruccion,
                ifa.estado_instruccion AS Estado_Instruccion
            FROM cmx_instruccion_facturacion ifa
            INNER JOIN cmx_detalle_instruccion_facturacion dif 
                ON ifa.id = dif.instruccion_id
            INNER JOIN cmx_clientes cl 
                ON ifa.cliente_id = cl.id
            INNER JOIN cmx_remesa rm 
                ON dif.remesa_id = rm.id
            LEFT JOIN cmx_manifiesto_remesa mr 
                ON mr.id_remesa = rm.id
            WHERE 1 = 1
        ";

        $params = [];

        // 🔹 Filtro por rango de fechas
        if (!empty($fecha_inicial) && !empty($fecha_final) && empty($criterio_busqueda)) {
            $sql .= " AND ifa.fecha BETWEEN :fecha_inicio AND :fecha_final ";
            $params[':fecha_inicio'] = $fecha_inicial;
            $params[':fecha_final']  = $fecha_final;
        }

        // 🔹 Filtro por remesa o manifiesto
        if (!empty($criterio_busqueda)) {
            $sql .= "
            AND (
                rm.id = :criterio
                OR mr.id_manifiesto = :criterio
            )
        ";
            $params[':criterio'] = $criterio_busqueda;
        }

        $stmt = $this->_db3->prepare($sql);
        $stmt->execute($params);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
