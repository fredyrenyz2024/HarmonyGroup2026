<?php

session_start();

class validacion_parametroModel extends Model
{

    public function __construct()
    {

        parent::__construct();
    }

    /* Nueva Funcion para valsdiar los datos del vehiculo */
    public function buscar_datos_hojas_vida($placa)
    {
        $response = [];
        try {
            $sql = $this->_db3->prepare("SELECT v2.vence_soat,dv.tecno_fecha_vigencia,cond.rndc_vencimiento_licencia,v.numdoc_vehiculo,cond.rndc_numero_licencia,
            CONCAT(cond.nombre,' ',cond.apellido1,' ',cond.apellido2) AS 'Conductor',cond.numero_documento,dv.fecha_vencimiento_preoperacional FROM cmx_vehiculos v
            INNER JOIN cmx_vehiculo2 v2 ON v.numdoc_vehiculo=v2.id_vehiculo
            INNER JOIN cmx_detalle_vehiculo dv ON v.numdoc_vehiculo=dv.id_vehiculo
            INNER JOIN cmx_proveedores cond ON v.id_conductor=cond.numdoc_nexos
            WHERE v.placa=:placa");
            $sql->bindParam(':placa', $placa, PDO::PARAM_STR);
            $sql->execute();
            $datos = $sql->fetch(PDO::FETCH_ASSOC);
            // $datos = $sql->fetchAll(PDO::FETCH_ASSOC);
            $response = $datos;
        } catch (\Throwable $th) {
            throw $th;
        }
        return $response;
    }

    public function buscar_vehiculo($placa_vehiculo)
    {
        $response = [];
        try {
            $factual = date('Y-m-d');
            $msg = "";
            $estado_vigencia = "";
            /* VALIDAR COMO PRIMERA REGLA QUE EL VEHICHULO NO ESTE EN SEGUIMIENTO ACTIVO */
            $sql_valida_seguimiento = $this->_db3->prepare("SELECT inr.placa,inr.cod_inicio,ma.id AS manifiesto FROM cmx_manifiesto ma
                INNER JOIN cmx_proveedores pro ON ma.conductor_manifiesto = pro.numero_documento
                INNER JOIN cmx_municipios mn1 ON ma.origen_viaje = mn1.id
                INNER JOIN cmx_municipios mn2 ON ma.destino_viaje = mn2.id
                LEFT JOIN cmx_cumplido cu ON ma.id = cu.manifiesto
                LEFT JOIN cmx_inicio_ruta inr ON ma.id = inr.num_manifiesto
                INNER JOIN cmx_manifiesto_remesa mr ON mr.id_manifiesto = ma.id
                INNER JOIN cmx_remesa r ON r.id = mr.id_remesa
                INNER JOIN cmx_remesa_ordencargue ro ON ro.id_remesa = r.id
                INNER JOIN cmx_orden_cargue oc ON oc.id = ro.id_orden_cargue
                INNER JOIN cmx_clientes cl ON cl.id = oc.cli_id
                INNER JOIN cmx_cotizaciones_serviciocliente cs ON cs.id = oc.mer_idservicio
                INNER JOIN cmx_detalle_mercancia2 dm ON dm.n_cotizacion = cs.n_cotizacion
                LEFT JOIN cmx_inicio_seguimiento ins ON ins.cod_ini_ruta = inr.cod_inicio
                WHERE cu.manifiesto IS NULL AND ma.estado_seguimiento = 'SEGUIMIENTO' AND inr.placa='" . $placa_vehiculo . "'");
            $sql_valida_seguimiento->execute();
            $resultado_seguimiento = $sql_valida_seguimiento->fetch(PDO::FETCH_ASSOC);
            /* Validar si la consuta trae alguna placa debe informar que no peude solicitar este vehiculo ya que esta en seguiento actualmente */
            if ($resultado_seguimiento) {
                $mensaje = "El vehículo de placa:  <strong>" . $resultado_seguimiento['placa'] . " </strong>  esta actualmente en un seguimiento con el numero de manifiesto: <strong>" . $resultado_seguimiento['manifiesto'] . " </strong>, para vovler a solicitarlo debe ser cumplido en nuestras oficinas";
                $estado_vigencia = "seguimiento";
                $response = array(
                    'evaluacion' => 'estudio',
                    'estado_vigencia' => $estado_vigencia,
                    'mensaje' => $mensaje,
                );
            } else {
                $consulta = "SELECT B.estado_proceso AS 'estado_vigencia_veh',C.estado_proceso AS 'estado_vigencia_con',veh.numdoc_vehiculo,veh.estado_vehiculo,veh.id_conductor,veh.placa
                    FROM cmx_vehiculos veh
                    INNER JOIN cmx_proveedores pro ON veh.id_conductor=pro.numdoc_nexos
                    INNER JOIN cmx_estado_bloqueo B ON veh.numdoc_vehiculo=B.id_objeto AND B.tipo_objeto='vehiculo'
                    INNER JOIN cmx_estado_bloqueo C ON pro.numdoc_nexos=C.id_objeto AND C.tipo_objeto='proveedor'
                    WHERE veh.placa='" . $placa_vehiculo . "'";
                $sql = $this->_db3->prepare($consulta);
                $sql->execute();
                // $resultadoa =  $sql->fetch() != false ? $sql->fetch() : null;
                $resultadoa = $sql->fetch(PDO::FETCH_ASSOC);
                if (isset($resultadoa['placa'])) { //ESTUDIO
                    $mensaje = "";
                    if ($resultadoa['estado_vigencia_veh'] == 'desbloqueado' && $resultadoa['estado_vigencia_con'] == 'desbloqueado') {
                        $estado_vigencia = "desbloqueado";
                        $consult4 = "SELECT es.placa, es.id_estudio AS 'id_solictud', c.id_estudio, c.estado, c.id_vehiculo, c.id_conductor,ec.fecha,ec.hora,
                        DATEDIFF('" . $factual . "',ec.fecha) AS dif_solicitud, MAX(ec.hora) FROM cmx_estudio_vehiculo es
                            INNER JOIN cmx_estudiov_completo c ON es.id_estudio=c.id_estudio AND c.estado_actu=1
                            INNER JOIN  cmx_logestudio_com ec ON c.id_estudio=ec.id_estudio AND c.id_estudio_c=ec.id_completo
                            WHERE es.placa='" . $placa_vehiculo . "' AND es.id_estudio = (SELECT MAX(id_estudio) FROM cmx_estudio_vehiculo WHERE placa='" . $placa_vehiculo . "')
                            GROUP BY es.placa, es.id_estudio, c.id_estudio, c.estado, c.id_vehiculo, c.id_conductor, ec.fecha, ec.hora";
                        $sql4 = $this->_db3->prepare($consult4);
                        $sql4->execute();
                        $resultado_solicitud = $sql4->fetch(PDO::FETCH_ASSOC);
                        // if ($resultado_solicitud['id_solictud'] != null && $resultado_solicitud['dif_solicitud'] == 0) {
                        if ($resultado_solicitud && $resultado_solicitud['id_solictud'] != null && $resultado_solicitud['dif_solicitud'] == 0) {
                            if ($resultado_solicitud['estado'] == 'pendiente_iniciar') {
                                $mensaje = "El vehículo de placa: " . $placa_vehiculo . "  tiene estudio " . $resultado_solicitud['id_solictud'] . " pendiente de iniciar del día " . $resultado_solicitud['fecha'];
                            }

                            if ($resultado_solicitud['estado'] == 'Aprobado') {
                                $mensaje = "El vehículo de placa: " . $placa_vehiculo . "  tiene estudio " . $resultado_solicitud['id_solictud'] . " Aprobado del día " . $resultado_solicitud['fecha'];
                            }

                            if ($resultado_solicitud['estado'] == 'Rechazado') {
                                $mensaje = 'autorizado';
                            }

                            if ($resultado_solicitud['estado'] == 'Pendiente') {
                                $mensaje = "El vehículo de placa: " . $placa_vehiculo . "  tiene estudio " . $resultado_solicitud['id_solictud'] . " Pendiente del día" . $resultado_solicitud['fecha'];
                            }

                            if ($resultado_solicitud['estado'] == 'iniciado') {
                                $mensaje = "El vehículo de placa: " . $placa_vehiculo . "  tiene estudio " . $resultado_solicitud['id_solictud'] . " Iniciado del día " . $resultado_solicitud['fecha'];
                            }

                            if ($resultado_solicitud['estado'] == 'Rechazado_modificar') {
                                $mensaje = "El vehículo de placa: " . $placa_vehiculo . "  tiene estudio " . $resultado_solicitud['id_solictud'] . " Rechazado para modificar del día " . $resultado_solicitud['fecha'];
                            }

                            if ($resultado_solicitud['estado'] == 'Cancelado') {
                                // $mensaje = "El vehículo de placa: " . $placa_vehiculo . "  tiene estudio " . $resultado_solicitud['id_solictud'] . " Cancelado del día " . $resultado_solicitud['fecha'];
                                $mensaje = 'autorizado';
                            }
                        } else {
                            //no ha tenido estudios - registrar
                            // validar estudio con prefiltro y si tiene evolucion
                            $consulta3 = "SELECT a.id, b.estado AS 'estadoactualidad',DATEDIFF('" . $factual . "',b.fecha) AS 'dif_dias'
                                FROM cmx_solicitudes_preestudio a INNER JOIN cmx_solicitudes_estados b ON a.id=b.id_solicitud AND b.estado_actual=1
                                WHERE a.id=(SELECT id FROM cmx_solicitudes_preestudio WHERE placa='" . $placa_vehiculo . "' ORDER BY id DESC LIMIT 1)";
                            $sql2 = $this->_db3->prepare($consulta3);
                            $resultado_estado = $sql2->execute();
                            $resultado_estado = $sql2->fetch(PDO::FETCH_ASSOC);
                            $resultado = '';
                            $total = $sql2->rowCount();
                            if ($total == 0) {
                                $mensaje = 'autorizado';
                            } else {
                                $diferencia = abs($resultado_estado['dif_dias']);
                                if ($resultado_estado['estadoactualidad'] != 'vencida' && $diferencia == 0) {
                                    $mensaje = 'Debe trámitar la solicitud de estudio por el módulo de operaciones: Seguridad - prefiltro';
                                } else if ($resultado_estado['estadoactualidad'] == 'vencida' && $diferencia > 0) { //puede solicitr estudio de seguridad
                                    $mensaje = 'autorizado';
                                } else if ($resultado_estado['estadoactualidad'] == 'aprobado' && $diferencia > 0) {
                                    $mensaje = 'autorizado';
                                }
                            }
                        }
                    } else {
                        $estado_vigencia = "bloqueado";
                    }
                    $response = array(
                        'evaluacion' => 'estudio',
                        'estado_vigencia' => $estado_vigencia,
                        'mensaje' => $mensaje,
                    );
                } else {
                    // PREFILTRO
                    $consult = "SELECT se.id, se.estado, se.fecha, se.hora, sp.id_preestudio
                    FROM cmx_solicitudes_preestudio sp
                    INNER JOIN cmx_solicitudes_estados se ON sp.id=se.id_solicitud AND se.estado_actual=1
                    WHERE sp.placa=:placa AND sp.id_preestudio = (SELECT MAX(id_preestudio)  FROM cmx_solicitudes_preestudio WHERE placa=:placa)
                    AND se.id = ( SELECT MAX(se_inner.id) FROM cmx_solicitudes_estados se_inner WHERE se_inner.id_solicitud = sp.id)";
                    // $consult = "SELECT MAX(se.id), se.estado, se.fecha, se.hora, sp.id_preestudio
                    //     FROM cmx_solicitudes_preestudio sp
                    //     INNER JOIN cmx_solicitudes_estados se ON sp.id=se.id_solicitud AND se.estado_actual=1
                    //     WHERE sp.placa=:placa  AND sp.id_preestudio= (SELECT MAX(id_preestudio) FROM cmx_solicitudes_preestudio WHERE placa=:placa)
                    //     GROUP BY se.estado, se.fecha, se.hora, sp.id_preestudioGROUP BY se.estado, se.fecha, se.hora, sp.id_preestudio";
                    $sql = $this->_db3->prepare($consult);
                    $sql->bindParam(':placa', $placa_vehiculo, PDO::PARAM_STR);
                    $sql->execute();
                    $resultado = $sql->fetch(PDO::FETCH_ASSOC);
                    $response = array(
                        'respuesta' => $resultado,
                        'mensaje' => $msg,
                        'evaluacion' => 'prefiltro',
                    );
                }
            }
        } catch (Exception $e) {
            throw $e;
        }
        return $response;
    }

    /* Buscar vehiculo para hacer itr */
    public function buscar_vehiculo_itr($placa_vehiculo)
    {
        $response = [];
        try {
            $factual = date('Y-m-d');
            $msg = "";
            $estado_vigencia = "";
            $consulta = "SELECT B.estado_proceso AS 'estado_vigencia_veh',C.estado_proceso AS 'estado_vigencia_con',veh.id,veh.estado_vehiculo,veh.id_conductor,veh.placa
                FROM cmx_vehiculos veh
                INNER JOIN cmx_proveedores  pro ON veh.id_conductor=pro.numdoc_nexos
                INNER JOIN cmx_estado_bloqueo B ON veh.numdoc_vehiculo=B.id_objeto AND B.tipo_objeto='vehiculo'
                INNER JOIN cmx_estado_bloqueo C ON pro.numdoc_nexos=C.id_objeto AND C.tipo_objeto='proveedor'
                WHERE veh.placa='" . $placa_vehiculo . "'";
            $sql = $this->_db3->prepare($consulta);
            $resultadoa = $sql->execute();
            // $resultadoa =  $sql->fetch() != false ? $sql->fetch() : null;
            $resultadoa = $sql->fetch(PDO::FETCH_ASSOC);
            if (isset($resultadoa['placa'])) {
                // Estudio
                if ($resultadoa['estado_vigencia_veh'] == 'desbloqueado' && $resultadoa['estado_vigencia_con'] == 'desbloqueado') {
                    $estado_vigencia = "desbloqueado";
                    /* validar que no este e un estudio que no sea itr */
                    $consult4 = "SELECT es.placa, es.id_estudio AS 'id_solictud', c.id_estudio, c.estado, c.id_vehiculo, c.id_conductor,
                    ec.fecha,ec.hora,  DATEDIFF('" . $factual . "',ec.fecha) AS dif_solicitud, MAX(ec.hora)
                    FROM  cmx_estudio_vehiculo es
                    INNER JOIN cmx_estudiov_completo c ON es.id_estudio=c.id_estudio AND c.estado_actu=1
                    INNER JOIN  cmx_logestudio_com ec ON c.id_estudio=ec.id_estudio AND c.id_estudio_c=ec.id_completo
                    WHERE es.placa='" . $placa_vehiculo . "' AND es.itr='NO' AND es.id_estudio = (SELECT MAX(id_estudio) FROM cmx_estudio_vehiculo WHERE placa='" . $placa_vehiculo . "')
                    GROUP BY es.placa, es.id_estudio, c.id_estudio, c.estado, c.id_vehiculo, c.id_conductor, ec.fecha, ec.hora";
                    $sql4 = $this->_db3->prepare($consult4);
                    $sql4->execute();
                    $resultado_solicitud = $sql4->fetch(PDO::FETCH_ASSOC);
                    // if ($resultado_solicitud['id_solictud'] != null && $resultado_solicitud['dif_solicitud'] == 0) {
                    if ($resultado_solicitud && $resultado_solicitud['id_solictud'] != null && $resultado_solicitud['dif_solicitud'] == 0) {
                        if ($resultado_solicitud['estado'] == 'pendiente_iniciar') {
                            $mensaje = "El vehículo de placa: " . $placa_vehiculo . " no puede hacer servicio Itr, tiene estudio " . $resultado_solicitud['id_solictud'] . " pendiente de iniciar del día " . $resultado_solicitud['fecha'];
                        }

                        if ($resultado_solicitud['estado'] == 'Aprobado') {
                            $mensaje = "El vehículo de placa: " . $placa_vehiculo . " no puede hacer servicio Itr, tiene estudio " . $resultado_solicitud['id_solictud'] . " Aprobado del día " . $resultado_solicitud['fecha'];
                        }

                        if ($resultado_solicitud['estado'] == 'Rechazado') {
                            $mensaje = 'autorizado';
                        }

                        if ($resultado_solicitud['estado'] == 'Pendiente') {
                            $mensaje = "El vehículo de placa: " . $placa_vehiculo . " no puede hacer servicio Itr, tiene estudio " . $resultado_solicitud['id_solictud'] . " Pendiente del día" . $resultado_solicitud['fecha'];
                        }

                        if ($resultado_solicitud['estado'] == 'iniciado') {
                            $mensaje = "El vehículo de placa: " . $placa_vehiculo . " no puede hacer servicio Itr, tiene estudio " . $resultado_solicitud['id_solictud'] . " Iniciado del día " . $resultado_solicitud['fecha'];
                        }

                        if ($resultado_solicitud['estado'] == 'Rechazado_modificar') {
                            $mensaje = "El vehículo de placa: " . $placa_vehiculo . " no puede hacer servicio Itr, tiene estudio " . $resultado_solicitud['id_solictud'] . " Rechazado para modificar del día " . $resultado_solicitud['fecha'];
                        }

                        if ($resultado_solicitud['estado'] == 'Cancelado') {
                            $mensaje = "El vehículo de placa: " . $placa_vehiculo . " no puede hacer servicio Itr, tiene estudio " . $resultado_solicitud['id_solictud'] . " Cancelado del día " . $resultado_solicitud['fecha'];
                        }
                    } else {
                        /* VALIDAR SI LA PLACA ESTA EN UN ESTUDIO CON SERVICIO ITR  */
                        /* validar que no este e un estudio que no sea itr */
                        $consult4 = "SELECT es.placa, es.id_estudio AS 'id_solictud', c.id_estudio, c.estado, c.id_vehiculo, c.id_conductor, ec.fecha,ec.hora,  DATEDIFF('" . $factual . "',ec.fecha) AS dif_solicitud, MAX(ec.hora),es.viaje_itr,es.itr
                        FROM  cmx_estudio_vehiculo es
                        INNER JOIN cmx_estudiov_completo c ON es.id_estudio=c.id_estudio AND c.estado_actu=1
                        INNER JOIN  cmx_logestudio_com ec ON c.id_estudio=ec.id_estudio AND c.id_estudio_c=ec.id_completo
                        WHERE es.placa='" . $placa_vehiculo . "' AND es.itr='SI' AND es.id_estudio = (SELECT MAX(id_estudio) FROM cmx_estudio_vehiculo WHERE placa='" . $placa_vehiculo . "' AND es.fecha='" . $factual . "')";
                        $sql4 = $this->_db3->prepare($consult4);
                        $sql4->execute();
                        $resultado_solicitud_itr = $sql4->fetch(PDO::FETCH_ASSOC);
                        // var_dump($resultado_solicitud_itr);
                        // exit(0);

                        if ($resultado_solicitud_itr['viaje_itr'] > 0 && $resultado_solicitud_itr['viaje_itr'] < 4) {
                            /* Drater datos de los proveedores del vehiculo solicitado */
                            $mensaje = "El vehículo de placa: " . $placa_vehiculo . " ya tiene estudio " . $resultado_solicitud_itr['id_solictud'] . " de Itr al del dia" . $resultado_solicitud_itr['fecha'] . " Verificar datos para este nuevo servicio";
                            $sql_datos = $this->_db3->prepare("SELECT  CONCAT(pro.nombre, ' ', IFNULL(pro.apellido1, ''), ' ', IFNULL(pro.apellido2, '')) AS Propietario,
                            CONCAT(prop.nombre, ' ', IFNULL(prop.apellido1, ''), ' ', IFNULL(prop.apellido2, '')) AS Poseedor,
                            CONCAT(cond.nombre, ' ', cond.apellido1, ' ', cond.apellido2) AS Conductor,
                            CONCAT(prot.nombre, ' ', IFNULL(prot.apellido1, ''), ' ', IFNULL(prot.apellido2, '')) AS Propietario_trailer,
                            dc.celular2,
                            cond.celular,
                            pro.celular AS Celular_propietario,
                            prop.celular AS Celular_poseedor,
                            pro.numero_documento AS cedula_propietario,
                            prop.numero_documento AS cedula_poseedor,
                            cond.numero_documento AS cedula_conductor,
                            prot.numero_documento AS cedula_propietario_trailer,
                            prot.celular AS celuar_propietario_trailer
                            FROM cmx_vehiculos v
                            INNER JOIN cmx_proveedores pro ON v.id_propietario=pro.numdoc_nexos
                            INNER JOIN cmx_proveedores prop ON v.id_tenedor=prop.numdoc_nexos
                            INNER JOIN cmx_proveedores cond ON v.id_conductor=cond.numdoc_nexos
                            INNER JOIN cmx_detalle_conductor dc ON v.id_conductor=dc.id_proveedor
                            LEFT JOIN cmx_trailer_vehiculo tv ON v.numdoc_vehiculo=tv.id_vehiculo
                            LEFT JOIN cmx_trailer t ON tv.id_trailer=t.numdoc_trailer
                            LEFT JOIN cmx_proveedores prot ON t.doc_propietario=prot.numdoc_nexos
                            WHERE v.placa='" . $placa_vehiculo . "'");
                            $sql_datos->execute();
                            $resultado_estado = $sql_datos->fetch(PDO::FETCH_ASSOC);
                        } else {
                            //no ha tenido estudios - registrar primer viaje
                            // validar estudio con prefiltro y si tiene evolucion
                            $consulta3 = "SELECT a.id, b.estado AS 'estadoactualidad',DATEDIFF('" . $factual . "',b.fecha) AS 'dif_dias'
                            FROM cmx_solicitudes_preestudio a INNER JOIN cmx_solicitudes_estados b ON a.id=b.id_solicitud AND b.estado_actual=1
                            WHERE a.id=(SELECT id FROM cmx_solicitudes_preestudio WHERE placa='" . $placa_vehiculo . "' ORDER BY id DESC LIMIT 1)";
                            $sql2 = $this->_db3->prepare($consulta3);
                            $resultado_estado = $sql2->execute();
                            $resultado_estado = $sql2->fetch(PDO::FETCH_ASSOC);
                            $resultado = '';
                            $total = $sql2->rowCount();
                            if ($total == 0) {
                                $mensaje = 'autorizado';
                            } else {
                                $diferencia = abs($resultado_estado['dif_dias']);
                                if ($resultado_estado['estadoactualidad'] != 'vencida' && $diferencia == 0) {
                                    $mensaje = 'Debe trámitar la solicitud de estudio por el módulo de operaciones: Seguridad - prefiltro';
                                } else if ($resultado_estado['estadoactualidad'] == 'vencida' && $diferencia > 0) { //puede solicitr estudio de seguridad
                                    $mensaje = 'autorizado';
                                } else if ($resultado_estado['estadoactualidad'] == 'aprobado' && $diferencia > 0) {
                                    $mensaje = 'autorizado';
                                }
                            }
                        }
                    }
                } else {
                    $estado_vigencia = "bloqueado";
                }
                $response = array(
                    'evaluacion' => 'estudio',
                    'estado_vigencia' => $estado_vigencia,
                    'mensaje' => $mensaje,
                    'itr' => $resultado_estado,
                );
            } else {
                // PREFILTRO
                $consult = "SELECT MAX(se.id), se.estado, se.fecha, se.hora, sp.id_preestudio
                    FROM cmx_solicitudes_preestudio sp
                    INNER JOIN cmx_solicitudes_estados se ON sp.id=se.id_solicitud AND se.estado_actual=1
                    WHERE sp.placa=:placa   AND sp.id_preestudio= (SELECT MAX(id_preestudio) FROM cmx_solicitudes_preestudio WHERE placa=:placa)";
                $sql = $this->_db3->prepare($consult);
                $sql->bindParam(':placa', $placa_vehiculo, PDO::PARAM_STR);
                $sql->execute();
                $resultado = $sql->fetch(PDO::FETCH_ASSOC);
                $response = array(
                    'respuesta' => $resultado,
                    'mensaje' => $msg,
                    'evaluacion' => 'prefiltro',
                );
                // exit();
            }
        } catch (\Throwable $th) {
            throw $th;
        }
        return $response;
    }

    public function consulta_vehiculo($placa_vehiculo)
    {

        try {
            $sql = "SELECT v.id, v.estado_vehiculo,

				tra.placa, v.web_satelital, v.usuario_satelital, v.clave_satelital,

				CONCAT(pro.nombre,' ',pro.apellido1,' ',pro.apellido2) AS propietario,

				pro.numero_documento AS documento_propietario,

				CONCAT(ten.nombre,' ',ten.apellido1,' ',ten.apellido2) AS poseedor,

				ten.numero_documento AS documento_poseedor,

				CONCAT(cond.nombre,' ',cond.apellido1,' ',cond.apellido2) AS conductor,

				cond.numero_documento AS documento_conductor,

				v2.capacidad_tn

				FROM cmx_vehiculos AS v

				INNER JOIN cmx_vehiculo2 v2	ON v.numdoc_vehiculo=v2.id_vehiculo

				LEFT JOIN cmx_trailer_vehiculo AS tr ON v.numdoc_vehiculo=tr.id_vehiculo

				LEFT JOIN cmx_trailer tra ON tr.id_trailer=tra.numdoc_trailer AND tra.estado=1

				INNER JOIN cmx_proveedores pro ON v.id_propietario=pro.id

				LEFT JOIN cmx_proveedores ten ON v.id_tenedor=ten.id

				INNER JOIN cmx_proveedores cond ON v.id_conductor=cond.id

				WHERE v.placa='" . $placa_vehiculo . "'";

            $resultado = $this->_db3->query($sql);

            $resultado->setFetchMode(PDO::FETCH_ASSOC);

            return $resultado->fetch();

            // return $resultado->fetchall();

        } catch (Exception $e) {

            throw $e;
        }
    }

    public function Insertar_vehiculo_nuevo($datos)
    {
        $user = $_SESSION["usuario"]["nom_usuario"];
        // $empresa_id = $_SESSION['usuario']['empresa_id'];
        // Consultar maestro de Solicitud de prefiltro de vehiculo nuevo
        $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='SPVN' AND numero_actual>numero_inicial");
        $resultado_consecutivo = $sql_consecutivo->execute();
        $resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
        $numdoc = $resultado_consecutivo['numero_actual'];
        $numdoc_actualizar = $resultado_consecutivo['numero_actual'] + 1;
        // Consultar Maestro de Vehiculos preestudios
        $sql_consecutivo_vehiculo_preestudio = $this->_db3->prepare("SELECT numero_actual AS consecutivo FROM cmx_maestro WHERE tipo='VHP' AND numero_actual>numero_inicial");
        $resultado_consecutivo_vehiculo_prefiltro = $sql_consecutivo_vehiculo_preestudio->execute();
        $resultado_consecutivo_vehiculo_prefiltro = $sql_consecutivo_vehiculo_preestudio->fetch(PDO::FETCH_ASSOC);
        $numdoc_vehiculo_prefiltro = $resultado_consecutivo_vehiculo_prefiltro['consecutivo'];
        $numdoc_actualizar_vehiculo_prefiltro = $resultado_consecutivo_vehiculo_prefiltro['consecutivo'] + 1;

        try {
            $this->_db3->beginTransaction();
            if ($numdoc != 0 && $numdoc_vehiculo_prefiltro != 0) {
                // Actualizar Maestro de Solicitud de prefiltro de vehiculo nuevo
                $sql_updata_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numdoc_actualizar WHERE tipo='SPVN'");
                $resultado_consecutivo_update = $sql_updata_maestro->execute();
                // Actuaizar Maestro de Vehiculos preestudios
                $sql_updata_maestro_vehiculo_prefiltro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numdoc_actualizar_vehiculo_prefiltro WHERE tipo='VHP'");
                $resultado_consecutivo_update_vehiculo_prefiltro = $sql_updata_maestro_vehiculo_prefiltro->execute();
                if ($resultado_consecutivo_update && $resultado_consecutivo_update_vehiculo_prefiltro) {
                    $sql = $this->_db3->prepare("INSERT INTO cmx_vehiculos_preestudio (id,placa_vehiculo,placa_trailer,nombre_propietario,
                    documento_propietario,nombre_tenedor,documento_tenedor,nombre_conductor,documento_conductor,nombre_propietario_trailer,documento_propietario_trailer,web_satelital,usuario_satelital,
                    clave_satelital,fecha,hora,usuario,trailer,itr,responsable,empresa_id) VALUES(:id,:placa,:trailer,:propietario,:docu_pro,:tenedor,:docu_tene,:conductor,:docu_condu,:nombre_propietario_trailer,:documento_propietario_trailer,:web,:useri,:clave,
                    :fecha,:hora,:usuario,:tiene_trailer,:itr,:responsable,:empresa_id)");
                    $sql->bindParam(':id', $numdoc_vehiculo_prefiltro);
                    $sql->bindParam(':placa', $datos['placa_vehiculo']);
                    $sql->bindParam(':trailer', $datos['placa_trailer']);
                    $sql->bindParam(':propietario', $datos['nombre_propietario']);
                    $sql->bindParam(':docu_pro', $datos['documento_propietario']);
                    $sql->bindParam(':tenedor', $datos['nombre_tenedor']);
                    $sql->bindParam(':docu_tene', $datos['documento_tene']);
                    $sql->bindParam(':conductor', $datos['nombre_conductor']);
                    $sql->bindParam(':docu_condu', $datos['documento_conductor']);
                    $sql->bindParam(':nombre_propietario_trailer', $datos['propietario_trailer']);
                    $sql->bindParam(':documento_propietario_trailer', $datos['documento_propietario_trailer']);
                    $sql->bindParam(':web', $datos['web_satelital']);
                    $sql->bindParam(':useri', $datos['usuario_satelital']);
                    $sql->bindParam(':clave', $datos['clave_satelital']);
                    $sql->bindParam(':fecha', $datos['fecha']);
                    $sql->bindParam(':hora', $datos['hora']);
                    $sql->bindParam(':usuario', $user);
                    $sql->bindParam(':tiene_trailer', $datos['tiene_trailer']);
                    $sql->bindParam(':itr', $datos['itr']);
                    $sql->bindParam(':responsable', $datos['responsable_vehiculo']);
                    $sql->bindParam(':empresa_id',  $datos['empresa_cliente']);
                    $sql->execute();

                    if ($sql) {
                        $documento_conductor = $datos['documento_conductor'];
                        $solicitudes = $datos["solicitudes"];
                        $papel = $datos["Papel"];
                        //conductor se busca las referencias laborales si existe actualizar si no registrar , esta medida cuida las interidad
                        $sql_conduconsul = $this->_db3->prepare("SELECT id_conductor AS cantidad_referencias FROM cmx_referencias_preestudio
                        WHERE id_conductor=:docu_conductor");
                        $sql_conduconsul->bindParam(':docu_conductor', $documento_conductor);
                        $sql_conduconsul->execute();
                        // $total = $sql_conduconsul->rowCount();
                        $total = $sql_conduconsul->fetch();
                        // $id_referencia = $datos_referencia["cantidad_referencias"];
                        $referencia3 = 0;
                        if ($total) { //actualizar referencias
                            $estr1 = 1;
                            $docemp1 = null;
                            $namdoc1 = null;
                            $sql_consulta1 = $this->_db3->prepare("SELECT id FROM cmx_referencias_preestudio
                            WHERE id_conductor=:docu_conductor ORDER BY id ASC");
                            $sql_consulta1->bindParam(':docu_conductor', $documento_conductor);
                            $resultado = $sql_consulta1->execute();
                            $resultado = $sql_consulta1->fetchAll(PDO::FETCH_ASSOC);
                            if ($resultado) {
                                //foreach ($resultado as $value){
                                //referencia1
                                $id1 = $resultado[0]['id'];
                                $sql_Ref1 = $this->_db3->prepare("UPDATE cmx_referencias_preestudio SET
                                    nombre_empresa=:nombre_empresa,
                                    fecha_ingreso=:fecha_ingreso,
                                    fecha_retiro=:fecha_retiro,
                                    persona_contacto=:persona_contacto,
                                    celular=:celular,
                                    cargo=:cargo,
                                    id_conductor=:id_conductor,
                                    antiguedad=:antiguedad,
                                    fecha=:fecha,
                                    hora=:hora,
                                    usuario=:usuario
                                    WHERE id=:id");
                                $sql_Ref1->bindParam(':nombre_empresa', $datos['empre1']);
                                $sql_Ref1->bindParam(':fecha_ingreso', $datos['ingreso1']);
                                $sql_Ref1->bindParam(':fecha_retiro', $datos['retiro1']);
                                $sql_Ref1->bindParam(':persona_contacto', $datos['persona1']);
                                $sql_Ref1->bindParam(':celular', $datos['num1']);
                                $sql_Ref1->bindParam(':cargo', $datos['cargo1']);
                                $sql_Ref1->bindParam(':id_conductor', $documento_conductor);
                                $sql_Ref1->bindParam(':antiguedad', $datos['anti1']);
                                $sql_Ref1->bindParam(':fecha', $datos['fecha']);
                                $sql_Ref1->bindParam(':hora', $datos['hora']);
                                $sql_Ref1->bindParam(':usuario', $user);
                                $sql_Ref1->bindParam(':id', $id1);
                                $sql_Ref1->execute();
                                if ($sql_Ref1) {
                                    $id2 = $resultado[1]['id'];
                                    $estr2 = 1;
                                    $docemp2 = null;
                                    $namdoc2 = null;
                                    $sql_Ref2 = $this->_db3->prepare("UPDATE cmx_referencias_preestudio SET
                                        nombre_empresa=:nombre_empresa2,
                                        fecha_ingreso=:fecha_ingreso2,
                                        fecha_retiro=:fecha_retiro2,
                                        persona_contacto=:persona_contacto2,
                                        celular=:celular2,
                                        cargo=:cargo2,
                                        id_conductor=:id_conductor2,
                                        antiguedad=:antiguedad2,
                                        fecha=:fecha2,
                                        hora=:hora2,
                                        usuario=:usuario2
                                        WHERE id=:id2");
                                    $sql_Ref2->bindParam(':nombre_empresa2', $datos['empre2']);
                                    $sql_Ref2->bindParam(':fecha_ingreso2', $datos['ingreso2']);
                                    $sql_Ref2->bindParam(':fecha_retiro2', $datos['retiro2']);
                                    $sql_Ref2->bindParam(':persona_contacto2', $datos['persona2']);
                                    $sql_Ref2->bindParam(':celular2', $datos['num2']);
                                    $sql_Ref2->bindParam(':cargo2', $datos['cargo2']);
                                    $sql_Ref2->bindParam(':id_conductor2', $documento_conductor);
                                    $sql_Ref2->bindParam(':antiguedad2', $datos['anti2']);
                                    $sql_Ref2->bindParam(':fecha2', $datos['fecha']);
                                    $sql_Ref2->bindParam(':hora2', $datos['hora']);
                                    $sql_Ref2->bindParam(':usuario2', $user);
                                    $sql_Ref2->bindParam(':id2', $id2);
                                    $sql_Ref2->execute();
                                }
                                if ($sql_Ref2) {
                                    $id3 = $resultado[2]['id'];
                                    $estr3 = 1;
                                    $docemp3 = null;
                                    $namdoc3 = null;
                                    $sql_Ref3 = $this->_db3->prepare("UPDATE cmx_referencias_preestudio SET
                                        nombre_empresa=:nombre_empresa3,
                                        fecha_ingreso=:fecha_ingreso3,
                                        fecha_retiro=:fecha_retiro3,
                                        persona_contacto=:persona_contacto3,
                                        celular=:celular3,
                                        cargo=:cargo3,
                                        id_conductor=:id_conductor3,
                                        antiguedad=:antiguedad3,
                                        fecha=:fecha3,
                                        hora=:hora3,
                                        usuario=:usuario3
                                        WHERE id=:id3");
                                    $sql_Ref3->bindParam(':nombre_empresa3', $datos['empre3']);
                                    $sql_Ref3->bindParam(':fecha_ingreso3', $datos['ingreso3']);
                                    $sql_Ref3->bindParam(':fecha_retiro3', $datos['retiro3']);
                                    $sql_Ref3->bindParam(':persona_contacto3', $datos['persona3']);
                                    $sql_Ref3->bindParam(':celular3', $datos['num3']);
                                    $sql_Ref3->bindParam(':cargo3', $datos['cargo3']);
                                    $sql_Ref3->bindParam(':id_conductor3', $documento_conductor);
                                    $sql_Ref3->bindParam(':antiguedad3', $datos['anti3']);
                                    $sql_Ref3->bindParam(':fecha3', $datos['fecha']);
                                    $sql_Ref3->bindParam(':hora3', $datos['hora']);
                                    $sql_Ref3->bindParam(':usuario3', $user);
                                    $sql_Ref3->bindParam(':id3', $id3);
                                    $sql_Ref3->execute();
                                    if ($sql_Ref3) {
                                        $referencia3 = 1;
                                    } else {
                                        $referencia3 = 0;
                                    }
                                }
                                //}
                            }
                        } else { //insertar referencias
                            $estr1 = 1;
                            $docemp1 = null;
                            $namdoc1 = null;
                            $sql_Ref11 = $this->_db3->prepare("INSERT INTO cmx_referencias_preestudio(id,nombre_empresa,fecha_ingreso,fecha_retiro,persona_contacto,celular,cargo,id_conductor,antiguedad,documento_empresarial,name_documento,fecha,hora,usuario,estado)
                            VALUES(null,:nombre_empresa,:fecha_ingreso,:fecha_retiro,:persona_contacto,:celular,:cargo,:id_conductor,:antiguedad,:documento_empresarial,:name_documento,:fecha,:hora,:usuario,:estado)");
                            $sql_Ref11->bindParam(':nombre_empresa', $datos['empre1']);
                            $sql_Ref11->bindParam(':fecha_ingreso', $datos['ingreso1']);
                            $sql_Ref11->bindParam(':fecha_retiro', $datos['retiro1']);
                            $sql_Ref11->bindParam(':persona_contacto', $datos['persona1']);
                            $sql_Ref11->bindParam(':celular', $datos['num1']);
                            $sql_Ref11->bindParam(':cargo', $datos['cargo1']);
                            $sql_Ref11->bindParam(':id_conductor', $datos['documento_conductor']);
                            $sql_Ref11->bindParam(':antiguedad', $datos['anti1']);
                            $sql_Ref11->bindParam(':documento_empresarial', $docemp1);
                            $sql_Ref11->bindParam(':name_documento', $namdoc1);
                            $sql_Ref11->bindParam(':fecha', $datos['fecha']);
                            $sql_Ref11->bindParam(':hora', $datos['hora']);
                            $sql_Ref11->bindParam(':usuario', $user);
                            $sql_Ref11->bindParam(':estado', $estr1);
                            $sql_Ref11->execute();
                            if ($sql_Ref11) {
                                $estr2 = 1;
                                $docemp2 = null;
                                $namdoc2 = null;
                                $sql_Ref2 = $this->_db3->prepare("INSERT INTO cmx_referencias_preestudio (id,nombre_empresa,fecha_ingreso,fecha_retiro,persona_contacto,celular,cargo,id_conductor,antiguedad,documento_empresarial,name_documento,fecha,hora,usuario,estado)
                                VALUES(null,:nombre_empresa,:fecha_ingreso,:fecha_retiro,:persona_contacto,:celular,:cargo,:id_conductor,:antiguedad,:documento_empresarial,:name_documento,:fecha,:hora,:usuario,:estado)");
                                $sql_Ref2->bindParam(':nombre_empresa', $datos['empre2']);
                                $sql_Ref2->bindParam(':fecha_ingreso', $datos['ingreso2']);
                                $sql_Ref2->bindParam(':fecha_retiro', $datos['retiro2']);
                                $sql_Ref2->bindParam(':persona_contacto', $datos['persona2']);
                                $sql_Ref2->bindParam(':celular', $datos['num2']);
                                $sql_Ref2->bindParam(':cargo', $datos['cargo2']);
                                $sql_Ref2->bindParam(':id_conductor', $datos['documento_conductor']);
                                $sql_Ref2->bindParam(':antiguedad', $datos['anti2']);
                                $sql_Ref2->bindParam(':documento_empresarial', $docemp2);
                                $sql_Ref2->bindParam(':name_documento', $namdoc2);
                                $sql_Ref2->bindParam(':fecha', $datos['fecha']);
                                $sql_Ref2->bindParam(':hora', $datos['hora']);
                                $sql_Ref2->bindParam(':usuario', $user);
                                $sql_Ref2->bindParam(':estado', $estr2);
                                $sql_Ref2->execute();
                            }
                            if ($sql_Ref2) {
                                $estr3 = 1;
                                $docemp3 = null;
                                $namdoc3 = null;
                                $sql_Ref3 = $this->_db3->prepare("INSERT INTO cmx_referencias_preestudio(id,nombre_empresa,fecha_ingreso,fecha_retiro,persona_contacto,celular,cargo,id_conductor,antiguedad,documento_empresarial,name_documento,fecha,hora,usuario,estado)
                                VALUES(null,:nombre_empresa,:fecha_ingreso,:fecha_retiro,:persona_contacto,:celular,:cargo,:id_conductor,:antiguedad,:documento_empresarial,:name_documento,:fecha,:hora,:usuario,:estado)");
                                $sql_Ref3->bindParam(':nombre_empresa', $datos['empre3']);
                                $sql_Ref3->bindParam(':fecha_ingreso', $datos['ingreso3']);
                                $sql_Ref3->bindParam(':fecha_retiro', $datos['retiro3']);
                                $sql_Ref3->bindParam(':persona_contacto', $datos['persona3']);
                                $sql_Ref3->bindParam(':celular', $datos['num3']);
                                $sql_Ref3->bindParam(':cargo', $datos['cargo3']);
                                $sql_Ref3->bindParam(':id_conductor', $datos['documento_conductor']);
                                $sql_Ref3->bindParam(':antiguedad', $datos['anti3']);
                                $sql_Ref3->bindParam(':documento_empresarial', $docemp3);
                                $sql_Ref3->bindParam(':name_documento', $namdoc3);
                                $sql_Ref3->bindParam(':fecha', $datos['fecha']);
                                $sql_Ref3->bindParam(':hora', $datos['hora']);
                                $sql_Ref3->bindParam(':usuario', $user);
                                $sql_Ref3->bindParam(':estado', $estr3);
                                $sql_Ref3->execute();
                                if ($sql_Ref3) {
                                    $referencia3 = 1;
                                } else {
                                    $referencia3 = 0;
                                }
                            }
                        }
                        //Finalizacion de referencias laborales y
                        if ($referencia3 == 1) {
                            $est = 'Desbloquear';

                            $estf = 1;

                            $causalidades = null;

                            $obs = null;

                            $sqlev = $this->_db3->prepare("INSERT INTO cmx_vehiculos_preestudio_estado (vehiculo_preestudio,estado_vehiculo,fecha,hora,usuario,causalidades,observacion,estado_final)
                            VALUES(:vehiculo_preestudio,:estado_vehiculo,:fecha,:hora,:usuario,:causalidades,:observacion,:estado_final)");
                            $sqlev->bindParam(':vehiculo_preestudio', $numdoc_vehiculo_prefiltro);
                            $sqlev->bindParam(':estado_vehiculo', $est);
                            $sqlev->bindParam(':fecha', $datos['fecha']);
                            $sqlev->bindParam(':hora', $datos['hora']);
                            $sqlev->bindParam(':usuario', $user);
                            $sqlev->bindParam(':causalidades', $causalidades);
                            $sqlev->bindParam(':observacion', $obs);
                            $sqlev->bindParam(':estado_final', $estf);
                            $sqlev->execute();
                            if ($sqlev) {

                                //INSERT SOLICITUD PREESTUDIO
                                $estac = 'Pen_Sol_PreR';
                                $estap = 1;
                                $sql4 = $this->_db3->prepare("INSERT INTO cmx_solicitudes_preestudio (id,id_preestudio,placa,fecha,hora,usuario,observacion,estado_actual_sol,proceso,operacion,pesoneto_total)
                                VALUES(:id,:id_preestudio,:placa,:fecha,:hora,:usuario,:observacion,:estado_actual_sol,:proceso,:operacion,:pesoneto_total)");
                                $sql4->bindParam(':id', $numdoc);
                                $sql4->bindParam(':id_preestudio', $numdoc_vehiculo_prefiltro);
                                $sql4->bindParam(':placa', $datos['placa_vehiculo']);
                                $sql4->bindParam(':fecha', $datos['fecha']);
                                $sql4->bindParam(':hora', $datos['hora']);
                                $sql4->bindParam(':usuario', $datos['usuario']);
                                $sql4->bindParam(':observacion', $datos['observacion']);
                                $sql4->bindParam(':estado_actual_sol', $$estap);
                                $sql4->bindParam(':proceso', $estac);
                                $sql4->bindParam(':operacion', $datos['tipo_operacion']);
                                $sql4->bindParam(':pesoneto_total', $datos['peso_neto']);
                                $sql4->execute();

                                if ($sql4) {
                                    //insertar estado
                                    $area = 'operaciones';
                                    $est1 = 'pendiente_iniciar';
                                    $estda = 1;
                                    $sqle = $this->_db3->prepare("INSERT cmx_solicitudes_estados (id,estado,id_solicitud,fecha,hora,usuario,estado_actual,area)
                                    VALUES(null,:estado,:id_solicitud,:fecha,:hora,:usuario,:estado_actual,:area)");
                                    $sqle->bindParam(':estado', $est1);
                                    $sqle->bindParam(':id_solicitud', $numdoc);
                                    $sqle->bindParam(':fecha', $datos['fecha']);
                                    $sqle->bindParam(':hora', $datos['hora']);
                                    $sqle->bindParam(':usuario', $user);
                                    $sqle->bindParam(':estado_actual', $estda);
                                    $sqle->bindParam(':area', $area);
                                    $resultado_solestado = $sqle->execute();

                                    if ($resultado_solestado) {
                                        $estss = 1;
                                        $p = 'P';
                                        $solicitudesb = $datos["solicitudes"];
                                        foreach ($solicitudesb as $value) {
                                            $sqlss = $this->_db3->prepare("INSERT INTO cmx_preestudio_solicitudes_servicio(id,id_servicio_cliente,id_solicitudpreestudio,fecha,hora,usuario,es,clasificacion)
                                            VALUES(null,:servicio,:idsolicitud,:fecha,:hora,:usuario,:es,:p)");
                                            $sqlss->bindParam(':servicio', $value);
                                            $sqlss->bindParam(':idsolicitud', $numdoc);
                                            $sqlss->bindParam(':fecha', $datos['fecha']);
                                            $sqlss->bindParam(':hora', $datos['hora']);
                                            $sqlss->bindParam(':usuario', $user);
                                            $sqlss->bindParam(':es', $estss);
                                            $sqlss->bindParam(':p', $p);
                                            $resultado_solicitudes_servicio = $sqlss->execute();
                                        }
                                        if ($resultado_solicitudes_servicio) {
                                            foreach ($solicitudesb as $value) {
                                                //cambiar estado de la solicitud para servicio al cliente
                                                $sqlu = $this->_db3->prepare("UPDATE cmx_solicitud_vehiculo2 SET estado='asignada' WHERE nundoc_solicitud=" . $value);
                                                $result = $sqlu->execute();
                                            }
                                            if ($result) {
                                                foreach ($solicitudesb as $value) {
                                                    //cambiar estado de la solicitud para operaciones
                                                    $estado = 'asignada';
                                                    $sqlo = $this->_db3->prepare("INSERT INTO cmx_log_solicitudvehiculo(id,id_solictud,user_log,fecha_asignacion,hora_asignacion,estado)
                                                        VALUES(null,:servicio,:usuario,:fecha,:hora,:statu)");
                                                    $sqlo->bindParam(':servicio', $value);
                                                    $sqlo->bindParam(':usuario', $user);
                                                    $sqlo->bindParam(':fecha', $datos['fecha']);
                                                    $sqlo->bindParam(':hora', $datos['hora']);
                                                    $sqlo->bindParam(':statu', $estado);
                                                    $resultado_log = $sqlo->execute();
                                                }
                                                if ($resultado_log) {
                                                    $valor1 = 0;
                                                    $valor2 = 0;
                                                    $sqlsu = $this->_db3->prepare("INSERT INTO cmx_subasta_temporal (id,fecha_inicio,numero_estudio,placa,flete,tarifa)
                                                        VALUES(null,:fechase,:numpre,:placa,:flete,:tarifa)");
                                                    $sqlsu->bindParam(':fechase', $datos['fecha']);
                                                    $sqlsu->bindParam(':numpre', $numdoc);
                                                    $sqlsu->bindParam(':placa', $datos['placa_vehiculo']);
                                                    $sqlsu->bindParam(':flete', $datos["flete_subasta"]);
                                                    $sqlsu->bindParam(':tarifa', $datos["tarifa_subasta"]);
                                                    $resultadosubasta = $sqlsu->execute();
                                                    if ($resultadosubasta) {
                                                        //hacer conslidacion de solicitudes de servicio
                                                        $rta_agrupa;
                                                        $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='AGRU_SS' AND numero_actual>numero_inicial");
                                                        $resultado_consecutivo = $sql_consecutivo->execute();
                                                        $resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
                                                        $numdoc_agru = $resultado_consecutivo['numero_actual'];
                                                        $numero_agrupacion = $resultado_consecutivo['numero_actual'] + 1;
                                                        if ($numdoc_agru) {
                                                            //$solicitudes = $datos["solicitudes"];
                                                            foreach ($solicitudesb as $value) {
                                                                $sql_consecutivo2 = $this->_db3->prepare("SELECT solicitud_servicio FROM cmx_consolidacion_solicitudes WHERE solicitud_servicio=$value");
                                                                $resultado_consecutivo = $sql_consecutivo2->execute();
                                                                $total = $sql_consecutivo2->rowCount();
                                                                if ($total == 0) {
                                                                    $sql_updata_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numero_agrupacion WHERE tipo='AGRU_SS'");
                                                                    $resultado_consecutivo_update = $sql_updata_maestro->execute();
                                                                    if ($resultado_consecutivo_update) {
                                                                        $sql_agrupacion = $this->_db3->prepare("INSERT INTO cmx_consolidacion_solicitudes(id,solicitud_servicio,agrupacion)
                                                                                        VALUES(null,:id_servicio,:agrupacion)");
                                                                        $sql_agrupacion->bindParam(':id_servicio', $value);
                                                                        $sql_agrupacion->bindParam(':agrupacion', $numdoc_agru);
                                                                        $resultado_agrupacion = $sql_agrupacion->execute();
                                                                        if ($resultado_agrupacion) {
                                                                            $rta_agrupa = 1;
                                                                        } else {
                                                                            $rta_agrupa = 0;
                                                                        }
                                                                    }
                                                                } else {
                                                                    $rta_agrupa = 1;
                                                                }
                                                            }
                                                        }

                                                        //insercion de archivos
                                                        if ($papel !== false) {
                                                            $archivos = $datos["archivos"];
                                                            $res_doc = $this->insertar_documentos_prefiltro($numdoc, $archivos, $datos['papeles'], $datos['fecha'], $datos['hora'], $user);
                                                            if ($res_doc === true) {
                                                                $this->_db3->commit();
                                                                $msg = "Datos Registrados Exitosamente, Preestudio " . $numdoc;
                                                                return json_encode($msg);
                                                            } else {
                                                                $msg = "Datos no han sido registrados.";
                                                                return json_encode($msg);
                                                            }
                                                        } else {
                                                            if ($resultado_log && $rta_agrupa === 1) {
                                                                $this->_db3->commit();
                                                                $msg = "Datos Registrados Exitosamente, Preestudio " . $numdoc;
                                                                return json_encode($msg);
                                                            } else {
                                                                $msg = "Datos no han sido registrados";
                                                                return json_encode($msg);
                                                            }
                                                        }
                                                        // Fin de saber si hay documentos a subir
                                                    } else {
                                                        $mensajeError = 'Error en la insersion subasta temporal';
                                                        error_log($mensajeError, 3, "error_log.txt");
                                                    }
                                                } else {
                                                    $mensajeError = 'Error en la insersiondel log';
                                                    error_log($mensajeError, 3, "error_log.txt");
                                                }
                                            } else {
                                                $mensajeError = 'No actualiza estado solicitud en operaciones';
                                                error_log($mensajeError, 3, "error_log.txt");
                                            }
                                            //}
                                            // Fin Foreach
                                        } else {
                                            $mensajeError = 'No actualiza estado solicitud en servicio al cliente';
                                            error_log($mensajeError, 3, "error_log.txt");
                                        }
                                    } else {
                                        $mensajeError = "No resultado en solicitudes estado";
                                        error_log($mensajeError, 3, "error_log.txt");
                                    }
                                } else {
                                    $mensajeError = "No resultado en solicitudes preestudio";
                                    error_log($mensajeError, 3, "error_log.txt");
                                }
                            } else {
                                $mensajeError = "No resultado par el vehiculos preestudio  estadoo";
                                error_log($mensajeError, 3, "error_log.txt");
                            }
                        } else {
                            $mensajeError = "No resultado par las referencias del vehiculos";
                            error_log($mensajeError, 3, "error_log.txt");
                        }
                    } else {
                        $mensajeError = "No resultado par el preestudio del vehiculo";
                        error_log($mensajeError, 3, "error_log.txt");
                    }
                } else {
                    $mensajeError = "No actualizo consecutivo maestro";
                    error_log($mensajeError, 3, "error_log.txt");
                }
            } else {
                $mensajeError = "No resultado de consecuivo";
                error_log($mensajeError, 3, "error_log.txt");
            }
        } catch (\Throwable $th) {
            // Si ocurre algún error, deshacemos la transacción
            $this->_db3->rollBack();
            echo "Error en la transacción: " . $th->getMessage();
        }
    }

    // Funciopn para ejecutar el inser de documentos
    public function insertar_documentos_prefiltro($numdoc, $archivos, $papeles, $fecha, $hora, $user)
    {

        for ($i = 0; $i < count($archivos->tipohoja); $i++) {

            $sqlc = $this->_db3->prepare("INSERT INTO cmx_documeto_preestudio (id,id_sol_prees,tipo_hv,clase,ruta,nombre_archivo,fecha,hora,usuario)

						VALUES(null,:id_s,:tipohv_docu,:clase,:ruta,:nombre_archivo,:fecha,:hora,:usuario)");

            $sqlc->bindParam(':id_s', $numdoc);

            $sqlc->bindParam(':tipohv_docu', $archivos->tipohoja[$i]);

            $sqlc->bindParam(':clase', $archivos->clase[$i]);

            $sqlc->bindParam(':ruta', $archivos->ruta[$i]);

            $sqlc->bindParam(':nombre_archivo', $archivos->namearchivo[$i]);

            $sqlc->bindParam(':fecha', $fecha);

            $sqlc->bindParam(':hora', $hora);

            $sqlc->bindParam(':usuario', $user);

            $resultado_doc = $sqlc->execute();

            $ruta2 = $archivos->ruta[$i] . '/';

            if (!file_exists($ruta2)) {

                mkdir($ruta2, 0777, true);
            }
            //papeles
            // $total = count($papeles['name'][$i]);
            // for ($a = 0; $a < $total; $a++) {}
            $file = $papeles["name"][$i];

            $tipo = $papeles["type"][$i];

            $ruta_provisional = $papeles["tmp_name"][$i];

            $carpeta = $ruta2;

            $src = $carpeta . $file;

            move_uploaded_file($ruta_provisional, $src);
        }

        if ($resultado_doc) {

            return true;
        } else {

            return true;
        }
    }

    public function Estado_Conductor($placa)
    {

        $sql = "SELECT B.estado_proceso AS estado_conductor

		FROM cmx_vehiculos UNO

		INNER JOIN cmx_estado_bloqueo B ON UNO.numdoc_vehiculo=B.id_objeto

		WHERE UNO.placa='" . $placa . "'";

        $resultado = $this->_db3->query($sql);

        $resultado->setFetchMode(PDO::FETCH_ASSOC);

        return $resultado->fetchAll();
    }

    public function Estado_Vehiculo($placa)
    {

        $sql = "SELECT B.estado_proceso AS estado_vehiculo

		FROM cmx_vehiculos UNO

		INNER JOIN cmx_estado_bloqueo B ON UNO.numdoc_vehiculo=B.id_objeto

		WHERE UNO.placa='" . $placa . "'";

        $resultado = $this->_db3->query($sql);

        $resultado->setFetchMode(PDO::FETCH_ASSOC);

        return $resultado->fetch();
    }

    // Funciones para la parte de seguridad
    public function Consultar_solicitudes($datos)
    {
        $estado = $datos["estado"];
        $fecha_inicial = $datos["fecha_inicial"];
        $fecha_final = $datos["fecha_final"];
        $placa = $datos["placa"];

        $factual = date('Y-m-d');
        $hactual = date('G:i:s');
        $user = $_SESSION["usuario"]["nom_usuario"];
        if ($datos["operacion"] === "prefiltro_seguridad") {
            try {
                if ($estado === "t") {
                    $sql = $this->_db3->prepare("SELECT e.id AS idestados,s.id AS 'idsolitu', p.id_servicio_cliente
					FROM cmx_solicitudes_preestudio s
					INNER JOIN cmx_solicitudes_estados e ON s.id=e.id_solicitud	AND e.estado_actual=1
					LEFT JOIN cmx_preestudio_solicitudes_servicio p ON s.id=p.id_solicitudpreestudio
					WHERE (TIMESTAMPDIFF(DAY, s.fecha, '" . $factual . "')>=1) AND (e.estado = 'iniciado' OR e.estado = 'pendiente' OR  e.estado = 'pendiente_iniciar'  OR  e.estado = 'rechazado_para_modificar')");
                    $resultado = $sql->execute();
                    $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
                    if ($resultado) {
                        foreach ($resultado as $value) {
                            $actual_id = $value['idestados'];
                            $solicitud_id = $value['idsolitu'];
                            //Actualizar los estados de la solicitud a cero para poder ponerlas vencidas porque ya pasaron la fecha vigente de 24 horas
                            $sqla = $this->_db3->prepare("UPDATE cmx_solicitudes_estados SET estado_actual=0 WHERE  id=" . $actual_id . "");
                            $sqla->execute();
                        }

                        $nuevafecha = strtotime('-1 day', strtotime($factual));
                        $nuevafecha = date('Y-m-d', $nuevafecha);
                        $sqli = $this->_db3->prepare("INSERT cmx_solicitudes_estados (id,estado,id_solicitud,fecha,hora,usuario,estado_actual,area)
												VALUES(null,'vencida'," . $solicitud_id . ",'" . $nuevafecha . "','24:00:00','" . $user . "',1,'sistema')");
                        $sqli->execute();
                    } else {
                        $mensajeError = "No se ejecuto la consulta select en la tabla cmx_solicitudes_preestudio en el if " . date("Y-m-d") . $user;
                        error_log($mensajeError . "\n", 3, "error_log.txt");
                    }
                    // Se consultan las solicitdes vihentes
                    $sqle = $this->_db3->prepare("SELECT vp.id AS idv, s.id AS esoli, s.*, e.* ,/* se.id, */
				    CONCAT(prov.nombre,' ',prov.apellido1,' ',prov.apellido2) name_conductor, e.estado_actual,
				    CASE e.estado WHEN 'aprobado' THEN 'Autorizado HV' ELSE e.estado END AS campo,
				    CASE WHEN v.id IS NULL THEN 0 ELSE v.id  END AS 'idvehi',
				    CASE WHEN v.id_conductor IS NULL THEN 0 ELSE v.id_conductor END AS 'id_conductor',s.itr
				    FROM cmx_solicitudes_preestudio s
				    INNER JOIN cmx_solicitudes_estados e ON s.id=e.id_solicitud
				    INNER JOIN cmx_vehiculos_preestudio vp ON s.id_preestudio=vp.id
				    LEFT JOIN cmx_vehiculos v ON vp.placa_vehiculo=v.placa
				    LEFT JOIN cmx_proveedores prov ON v.id_conductor=prov.id
					WHERE e.estado_actual='1' AND e.fecha BETWEEN '" . $fecha_inicial . "' AND '" . $fecha_final . "' ORDER BY s.id DESC");
                    $resultado_ssp = $sqle->execute();
                    $resultado_ssp = $sqle->fetchAll(PDO::FETCH_ASSOC);
                    return $resultado_ssp;
                } else if ($estado == "placa") {
                    $sql = $this->_db3->prepare("SELECT e.id AS idestados,s.id AS 'idsolitu', p.id_servicio_cliente
                    FROM cmx_solicitudes_preestudio s
                    INNER JOIN cmx_solicitudes_estados e ON s.id=e.id_solicitud	AND e.estado_actual=1
                    LEFT JOIN cmx_preestudio_solicitudes_servicio p ON s.id=p.id_solicitudpreestudio
                    WHERE (TIMESTAMPDIFF(DAY, s.fecha, '" . $factual . "')>=1) AND (e.estado = 'iniciado' OR e.estado = 'pendiente' OR  e.estado = 'pendiente_iniciar'  OR  e.estado = 'rechazado_para_modificar')");
                    $resultado = $sql->execute();
                    $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
                    if ($resultado) {
                        foreach ($resultado as $value) {
                            $actual_id = $value['estados_id'];
                            $solicitud_id = $value['solitu_id'];
                            //Actualizar los estados de la solicitud a cero para poder ponerlas vencidas porque ya pasaron la fecha vigente de 24 horas
                            $sqla = $this->_db3->prepare("UPDATE cmx_solicitudes_estados SET estado_actual=0 WHERE  id=" . $actual_id . "");
                            $sqla->execute();
                        }
                        $nuevafecha = strtotime('-1 day', strtotime($factual));
                        $nuevafecha = date('Y-m-d', $nuevafecha);
                        $sqli = $this->_db3->prepare("INSERT cmx_solicitudes_estados (id,estado,id_solicitud,fecha,hora,usuario,estado_actual,area)
                            VALUES(null,'vencida'," . $solicitud_id . ",'" . $nuevafecha . "','24:00:00','" . $user . "',1,'sistema')");
                        $sqli->execute();
                    } else {
                        $mensajeError = "No se ejecuto el select de la tabla cmx_solicitudes_preestudio " . date("Y-m-d") . $user;
                        error_log($mensajeError . "\n", 3, "error_log.txt");
                    }
                    $sqle = $this->_db3->prepare("SELECT vp.id AS idv, s.id AS esoli, s.*, e.* ,/* se.id, */
                    CONCAT(prov.nombre,' ',prov.apellido1,' ',prov.apellido2) name_conductor, e.estado_actual,
                    CASE e.estado WHEN 'aprobado' THEN 'Autorizado HV' ELSE e.estado END AS campo,
                    CASE WHEN v.id   IS NULL THEN 0 ELSE v.id  END AS 'idvehi',
                    CASE WHEN v.id_conductor IS NULL THEN 0 ELSE v.id_conductor END AS 'id_conductor',s.itr
                    FROM cmx_solicitudes_preestudio s
                    INNER JOIN cmx_solicitudes_estados e ON s.id=e.id_solicitud
                    INNER JOIN cmx_vehiculos_preestudio vp ON s.id_preestudio=vp.id
                    LEFT JOIN cmx_vehiculos v ON vp.placa_vehiculo=v.placa
                    LEFT JOIN cmx_proveedores prov ON v.id_conductor=prov.id
                    WHERE e.estado_actual='1' AND e.fecha BETWEEN '" . $fecha_inicial . "' AND '" . $fecha_final . "' AND s.placa='" . $placa . "'
                    ORDER BY s.id DESC");
                    $resultado_ssp = $sqle->execute();
                    $resultado_ssp = $sqle->fetchAll(PDO::FETCH_ASSOC);
                    return $resultado_ssp;
                } else if ($estado === "aprobado" || $estado === "pendiente_iniciar" || $estado === "iniciado" || $estado === "rechazado" || $estado === "cancelado" || $estado === "rechazado_para_modificar" || $estado === "vencida") {
                    $sql = $this->_db3->prepare("SELECT e.id AS idestados,s.id AS 'idsolitu', p.id_servicio_cliente
										FROM cmx_solicitudes_preestudio s
										INNER JOIN cmx_solicitudes_estados e ON s.id=e.id_solicitud	AND e.estado_actual=1
										LEFT JOIN cmx_preestudio_solicitudes_servicio p ON s.id=p.id_solicitudpreestudio
										WHERE (TIMESTAMPDIFF(DAY, s.fecha, '" . $factual . "')>=1) AND (e.estado = 'iniciado' OR e.estado = 'pendiente' OR  e.estado = 'pendiente_iniciar'  OR  e.estado = 'rechazado_para_modificar')");
                    $resultado = $sql->execute();
                    $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
                    if ($resultado) {
                        foreach ($resultado as $value) {
                            $actual_id = $value['estados_id'];
                            $solicitud_id = $value['solitu_id'];
                            //Actualizar los estados de la solicitud a cero para poder ponerlas vencidas porque ya pasaron la fecha vigente de 24 horas
                            $sqla = $this->_db3->prepare("UPDATE cmx_solicitudes_estados SET estado_actual=0 WHERE  id=" . $actual_id . "");
                            $sqla->execute();
                        }
                        $nuevafecha = strtotime('-1 day', strtotime($factual));
                        $nuevafecha = date('Y-m-d', $nuevafecha);
                        $sqli = $this->_db3->prepare("INSERT cmx_solicitudes_estados (id,estado,id_solicitud,fecha,hora,usuario,estado_actual,area)
												VALUES(null,'vencida'," . $solicitud_id . ",'" . $nuevafecha . "','24:00:00','" . $user . "',1,'sistema')");
                        $sqli->execute();
                    } else {
                        $mensajeError = "No se ejecuto el select de la tabla cmx_solicitudes_preestudio " . date("Y-m-d") . $user;
                        error_log($mensajeError . "\n", 3, "error_log.txt");
                    }
                    $sqle = $this->_db3->prepare("SELECT vp.id AS idv, s.id AS esoli, s.*, e.* ,/* se.id, */
					CONCAT(prov.nombre,' ',prov.apellido1,' ',prov.apellido2) name_conductor, e.estado_actual,
					CASE e.estado WHEN 'aprobado' THEN 'Autorizado HV' ELSE e.estado END AS campo,
					CASE WHEN v.id   IS NULL THEN 0 ELSE v.id  END AS 'idvehi',
					CASE WHEN v.id_conductor IS NULL THEN 0 ELSE v.id_conductor END AS 'id_conductor',s.itr
					FROM cmx_solicitudes_preestudio s
					INNER JOIN cmx_solicitudes_estados e ON s.id=e.id_solicitud
					INNER JOIN cmx_vehiculos_preestudio vp ON s.id_preestudio=vp.id
					LEFT JOIN cmx_vehiculos v ON vp.placa_vehiculo=v.placa
					LEFT JOIN cmx_proveedores prov ON v.id_conductor=prov.id
					WHERE e.estado_actual='1' AND e.fecha BETWEEN '" . $fecha_inicial . "' AND '" . $fecha_final . "' AND e.estado='" . $estado . "'
					ORDER BY s.id DESC");
                    $resultado_ssp = $sqle->execute();
                    $resultado_ssp = $sqle->fetchAll(PDO::FETCH_ASSOC);
                    return $resultado_ssp;
                }
            } catch (\Throwable $th) {
                //throw $th;
                $mensajeError = "Error en la transacción: " . $th->getMessage() . date("Y-m-d") . $user;
                error_log($mensajeError . "\n", 3, "error_log.txt");
            }
        } else {
            if ($estado === "t") {
                //Entro como consulta de Estudio de seguridad
                $sqlm = $this->_db3->prepare("SELECT es.id_estudio,etp.id_estudio_c,etp.id_vehiculo,etp.id_conductor,etp.proceso FROM cmx_estudio_vehiculo es
								INNER JOIN cmx_estudiov_completo etp ON etp.id_estudio=es.id_estudio AND etp.estado_actu=1
								WHERE (TIMESTAMPDIFF(DAY, etp.fecha, '" . $factual . "')>=1) AND (etp.estado = 'iniciado' OR etp.estado = 'pendiente' OR  etp.estado = 'pendiente_iniciar'
								OR etp.estado = 'rechazado_para_modificar')");
                $resultado_m = $sqlm->execute();
                $resultado_m = $sqlm->fetchAll(PDO::FETCH_ASSOC);
                if ($resultado_m) {
                    foreach ($resultado_m as $value) {
                        // $actual_id = $value['idestados'];
                        $solicitud_id = $value['id_estudio_c'];
                        $id_estudio = $value['id_estudio'];
                        $id_vehiculo = $value['id_vehiculo'];
                        $id_conductor = $value['id_conductor'];
                        $proceso = $value['proceso'];

                        //Actualizar los estados de la solicitud a cero para poder ponerlas vencidas porque ya pasaron la fecha vigente de 24 horas
                        $sqla = $this->_db3->prepare("UPDATE cmx_estudiov_completo SET estado_actu=0 WHERE id_estudio_c='" . $solicitud_id . "'");
                        $sqla->execute();
                        $nuevafecha = strtotime('-1 day', strtotime($factual));
                        $nuevafecha = date('Y-m-d', $nuevafecha);
                        $sqli = $this->_db3->prepare("INSERT cmx_estudiov_completo (id_estudio_c,id_estudio,estado,id_vehiculo,id_conductor,observacion,proceso,fecha,hora,usuario,estado_actu,estado_subasta)
												VALUES('" . $solicitud_id . "','" . $id_estudio . "','vencida','" . $id_vehiculo . "','" . $id_conductor . "','NULL','" . $proceso . "','" . $nuevafecha . "','24:00:00','" . $user . "','1','Inactivo')");
                        $sqli->execute();
                    }
                } else {
                    $mensajeError = "No se ejecuto el select de estudio de seguridad para la tabla cmx_estudio_vehiculo " . date("Y-m-d") . $user;
                    error_log($mensajeError . "\n", 3, "error_log.txt");
                }
                $sql = $this->_db3->prepare("SELECT estv.id_estudio,estc.id_estudio_c,estc.fecha,estv.hora,estv.hora_respuesta,estv.placa,estv.operacion,estc.estado,estc.estado_actu,pro.nombre,pro.apellido1,pro.numero_documento,estc.id_vehiculo,estc.id_conductor,
                pa.estado_prefiltro,pro.numdoc_nexos,estv.itr,estv.observacion_general,pa.estado_creacion
				FROM  cmx_estudio_vehiculo estv
				INNER JOIN cmx_estudiov_completo estc ON estc.id_estudio=estv.id_estudio AND estc.estado_actu=1
                INNER JOIN cmx_vehiculos vh ON estv.placa=vh.placa
				INNER JOIN cmx_proveedores pro ON vh.id_conductor=pro.numdoc_nexos
                LEFT  JOIN cmx_prefiltro_actualizar pa ON estv.id_estudio=pa.id_solicitud_u
                 WHERE  estc.fecha BETWEEN '" . $fecha_inicial . "' AND '" . $fecha_final . "' ORDER BY estv.hora DESC");
                // -- WHERE  estc.fecha BETWEEN '" . $fecha_inicial . "' AND '" . $fecha_final . "' ORDER BY estv.hora_respuesta DESC, estv.id_estudio DESC");
                $resultado_ssp = $sql->execute();
                $resultado_ssp = $sql->fetchAll(PDO::FETCH_ASSOC);
                $response = array(
                    "Estudio_Seguridad" => "Estudio_de_Seguridad",
                    "respuesta" => $resultado_ssp,
                );
                return $response;
            } else if ($estado == "Placa_e") {
                $sqlm = $this->_db3->prepare("SELECT es.id_estudio,etp.id_estudio_c,etp.id_vehiculo,etp.id_conductor,etp.proceso
				FROM cmx_estudio_vehiculo es
				INNER JOIN cmx_estudiov_completo etp ON etp.id_estudio=es.id_estudio AND etp.estado_actu=1
			    WHERE (TIMESTAMPDIFF(DAY, etp.fecha, '" . $factual . "')>=1) AND (etp.estado = 'iniciado' OR etp.estado = 'pendiente' OR  etp.estado = 'pendiente_iniciar'
				OR  etp.estado = 'rechazado_para_modificar')");
                $resultado_m = $sqlm->execute();
                $resultado_m = $sqlm->fetchAll(PDO::FETCH_ASSOC);
                if ($resultado_m) {
                    foreach ($resultado_m as $value) {
                        // $actual_id = $value['idestados'];
                        $solicitud_id = $value['id_estudio_c'];
                        $id_estudio = $value['id_estudio'];
                        $id_vehiculo = $value['id_vehiculo'];
                        $id_conductor = $value['id_conductor'];
                        $proceso = $value['proceso'];
                        //Actualizar los estados de la solicitud a cero para poder ponerlas vencidas porque ya pasaron la fecha vigente de 24 horas
                        $sqla = $this->_db3->prepare("UPDATE cmx_estudiov_completo SET estado_actu=0 WHERE  id_estudio_c='" . $solicitud_id . "'");
                        $sqla->execute();
                        $nuevafecha = strtotime('-1 day', strtotime($factual));
                        $nuevafecha = date('Y-m-d', $nuevafecha);
                        $sqli = $this->_db3->prepare("INSERT cmx_estudiov_completo (id_estudio_c,id_estudio,estado,id_vehiculo,id_conductor,observacion,proceso,fecha,hora,usuario,estado_actu,estado_subasta)
									VALUES('" . $solicitud_id . "','" . $id_estudio . "','vencida','" . $id_vehiculo . "','" . $id_conductor . "','NULL','" . $proceso . "','" . $nuevafecha . "','24:00:00','" . $user . "','1','Inactivo')");
                        $sqli->execute();
                    }
                } else {
                    $mensajeError = "No se ejecuto la consulta 2 </br>";
                    error_log($mensajeError, 3, "error_log.txt");
                }
                $sql = $this->_db3->prepare("SELECT estv.id_estudio,estc.id_estudio_c,estc.fecha,estc.hora,estv.hora_respuesta,estv.placa,estv.operacion,estc.estado,estc.estado_actu,pro.nombre,pro.apellido1,pro.numero_documento,estc.id_vehiculo,estc.id_conductor,
                pa.estado_prefiltro,pro.numdoc_nexos,estv.itr,estv.observacion_general,pa.estado_creacion
				FROM  cmx_estudio_vehiculo estv
                INNER JOIN cmx_estudiov_completo estc ON estc.id_estudio=estv.id_estudio AND estc.estado_actu=1
                INNER JOIN cmx_vehiculos vh ON estv.placa=vh.placa
                INNER JOIN cmx_proveedores pro ON estc.id_conductor=pro.numdoc_nexos
                INNER JOIN cmx_actividad_proveedor acp ON acp.id_proveedor=pro.numdoc_nexos
                LEFT  JOIN cmx_prefiltro_actualizar pa ON estv.id_estudio=pa.id_solicitud_u
                WHERE  estc.fecha BETWEEN '" . $fecha_inicial . "' AND '" . $fecha_final . "' AND vh.placa='" . $placa . "' ORDER BY estv.hora_respuesta DESC,estv.id_estudio DESC");
                // -- WHERE vh.placa='" . $placa . "' ORDER BY estv.hora_respuesta DESC,estv.id_estudio DESC");
                $resultado_ssp = $sql->execute();
                $resultado_ssp = $sql->fetchAll(PDO::FETCH_ASSOC);
                $response = array(
                    "Estudio_Seguridad" => "Estudio_de_Seguridad",
                    "respuesta" => $resultado_ssp,
                );
                return $response;
            } else {
                //Entro como consulta de Estudio de seguridad
                // Filtro para estudio de seguridad
                if ($estado === "pendiente_iniciar_e") {
                    $estado = "pendiente_iniciar";
                } else if ($estado === "Aprobado_e") {
                    $estado = "Aprobado";
                } else if ($estado === "iniciado_e") {
                    $estado = "iniciado";
                } else if ($estado === "Pendiente_e") {
                    $estado = "pendiente";
                } else if ($estado === "Rechazado_e") {
                    $estado = "rechazado";
                } else if ($estado === "Rechazado_modificar_e") {
                    $estado = "rechazado_modificar";
                } else if ($estado === "Cancelado_e") {
                    $estado = "Cancelado";
                }

                $sqlm = $this->_db3->prepare("SELECT es.id_estudio,etp.id_estudio_c,etp.id_vehiculo,etp.id_conductor,etp.proceso
				FROM cmx_estudio_vehiculo es
				INNER JOIN cmx_estudiov_completo etp ON etp.id_estudio=es.id_estudio AND etp.estado_actu=1
			    WHERE (TIMESTAMPDIFF(DAY, etp.fecha, '" . $factual . "')>=1) AND (etp.estado = 'iniciado' OR etp.estado = 'pendiente' OR  etp.estado = 'pendiente_iniciar'
				OR  etp.estado = 'rechazado_para_modificar')");
                $resultado_m = $sqlm->execute();
                $resultado_m = $sqlm->fetchAll(PDO::FETCH_ASSOC);
                if ($resultado_m) {
                    foreach ($resultado_m as $value) {
                        // $actual_id = $value['idestados'];
                        $solicitud_id = $value['id_estudio_c'];
                        $id_estudio = $value['id_estudio'];
                        $id_vehiculo = $value['id_vehiculo'];
                        $id_conductor = $value['id_conductor'];
                        $proceso = $value['proceso'];
                        //Actualizar los estados de la solicitud a cero para poder ponerlas vencidas porque ya pasaron la fecha vigente de 24 horas
                        $sqla = $this->_db3->prepare("UPDATE cmx_estudiov_completo SET estado_actu=0 WHERE  id_estudio_c='" . $solicitud_id . "'");
                        $sqla->execute();
                        $nuevafecha = strtotime('-1 day', strtotime($factual));
                        $nuevafecha = date('Y-m-d', $nuevafecha);
                        $sqli = $this->_db3->prepare("INSERT cmx_estudiov_completo (id_estudio_c,id_estudio,estado,id_vehiculo,id_conductor,observacion,proceso,fecha,hora,usuario,estado_actu,estado_subasta)
									VALUES('" . $solicitud_id . "','" . $id_estudio . "','vencida','" . $id_vehiculo . "','" . $id_conductor . "','NULL','" . $proceso . "','" . $nuevafecha . "','24:00:00','" . $user . "','1','Inactivo')");
                        $sqli->execute();
                    }
                } else {
                    $mensajeError = "No se ejecuto la consulta 2 </br>";
                    error_log($mensajeError, 3, "error_log.txt");
                }
                $sql = $this->_db3->prepare("SELECT estv.id_estudio,estc.id_estudio_c,estc.fecha,estc.hora,estv.hora_respuesta,estv.placa,estv.operacion,estc.estado,estc.estado_actu,pro.nombre,pro.apellido1,pro.numero_documento,estc.id_vehiculo,estc.id_conductor,
                pa.estado_prefiltro,pro.numdoc_nexos,estv.itr,estv.observacion_general,pa.estado_creacion
				FROM  cmx_estudio_vehiculo estv
                INNER JOIN cmx_estudiov_completo estc ON estc.id_estudio=estv.id_estudio AND estc.estado_actu=1
                INNER JOIN cmx_vehiculos vh ON estv.placa=vh.placa
                INNER JOIN cmx_proveedores pro ON estc.id_conductor=pro.numdoc_nexos
                INNER JOIN cmx_actividad_proveedor acp ON acp.id_proveedor=pro.numdoc_nexos
                LEFT  JOIN cmx_prefiltro_actualizar pa ON estv.id_estudio=pa.id_solicitud_u
                WHERE  estc.fecha BETWEEN '" . $fecha_inicial . "' AND '" . $fecha_final . "' AND estc.estado='" . $estado . "' ORDER BY estv.hora_respuesta DESC,estv.id_estudio DESC");
                // --  WHERE  estc.fecha BETWEEN '" . $fecha_inicial . "' AND '" . $fecha_final . "' AND estc.estado='" . $estado . "' ORDER BY estv.id_estudio DESC");
                $resultado_ssp = $sql->execute();
                $resultado_ssp = $sql->fetchAll(PDO::FETCH_ASSOC);
                $response = array(
                    "Estudio_Seguridad" => "Estudio_de_Seguridad",
                    "respuesta" => $resultado_ssp,
                );
                return $response;
            }
        }
    }

    public function Iniciar_prefiltro($Solicitud)
    {
        $user = $_SESSION["usuario"]["nom_usuario"];
        $sql = $this->_db3->prepare("SELECT * FROM cmx_solicitudes_estados WHERE id_solicitud=" . $Solicitud . " AND estado_actual='1'");
        $resultado = $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        if ($resultado) {
            $sql = "SELECT id FROM cmx_solicitudes_estados WHERE id_solicitud = :variable ORDER BY id DESC LIMIT 1";
            $stmt = $this->_db3->prepare($sql);
            $stmt->bindParam(':variable', $Solicitud, PDO::PARAM_STR);
            $stmt->execute();
            $resultado_id = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($resultado_id) {
                $sql_update_estado = $this->_db3->prepare("UPDATE cmx_solicitudes_estados SET estado_actual='0' WHERE id=" . $resultado_id['id'] . "");
                $resultado_update = $sql_update_estado->execute();
                if ($resultado_update) {
                    $estadon = "iniciado";
                    $fechan = date("Y-m-d");
                    $horan = date('H:i:s');
                    $estadoan = 1;
                    $area = 'seguridad';
                    $sqlinsert = $this->_db3->prepare("INSERT INTO cmx_solicitudes_estados (id,estado,id_solicitud,fecha,hora,usuario,estado_actual,area)
										VALUES(NULL,:estado,:solicitud,:fecha,:hora_c,:id_usuario,:estado_actual,:area)");
                    $sqlinsert->bindParam(':estado', $estadon);
                    $sqlinsert->bindParam(':solicitud', $Solicitud);
                    $sqlinsert->bindParam(':fecha', $fechan);
                    $sqlinsert->bindParam(':hora_c', $horan);
                    $sqlinsert->bindParam(':id_usuario', $user);
                    $sqlinsert->bindParam(':estado_actual', $estadoan);
                    $sqlinsert->bindParam(':area', $area);
                    $resultado_insert = $sqlinsert->execute();
                    if ($resultado_insert) {
                        $ope = "Ini_Sol_PreR";
                        $sql2 = $this->_db3->prepare("UPDATE cmx_solicitudes_preestudio SET proceso=:proceso WHERE id=:id_solicitud");
                        $sql2->bindParam(':proceso', $ope);
                        $sql2->bindParam(':id_solicitud', $Solicitud);
                        $resultado_update = $sql2->execute();
                        if ($resultado_update) {
                            //cambiar estado de solicitud en operaciones
                            $estado_up = 'en_tramite';
                            $sql3 = $this->_db3->prepare("UPDATE cmx_log_solicitudvehiculo sol
														INNER JOIN cmx_solicitud_vehiculo2 ss ON sol.id_solictud=ss.nundoc_solicitud
														INNER JOIN cmx_preestudio_solicitudes_servicio pss ON ss.nundoc_solicitud=pss.id_servicio_cliente
														SET sol.estado=:estadoup, ss.estado=:estadoup
														WHERE pss.id_solicitudpreestudio=:solicitud_id");
                            $sql3->bindParam(':solicitud_id', $Solicitud);
                            $sql3->bindParam(':estadoup', $estado_up);
                            $resultado_ss = $sql3->execute();
                            if ($resultado_ss) {
                                $msg = "Prefiltro Iniciado Exitosamente" . $Solicitud;
                                return json_encode($msg);
                            } else {
                                $msg = "Error al Iniciar Prefiltro" . $Solicitud;
                                return json_encode($msg);
                            }
                        } else {
                            $mensajeError = 'Error al actualizar estado de solicitud de servicio y op ' . date("Y-m-d") . $user;
                            error_log($mensajeError . "\n", 3, "error_log.txt");
                        }
                    } else {
                        $mensajeError = 'Error al insetar el estado ' . date("Y-m-d") . $user;
                        error_log($mensajeError . "\n", 3, "error_log.txt");
                    }
                } else {
                    $mensajeError = 'Error al actuaizar el estado anterior' . date("Y-m-d") . $user;
                    error_log($mensajeError . "\n", 3, "error_log.txt");
                }
            } else {
                $mensajeError = 'Error en traer ulrimo id ' . date("Y-m-d") . $user;
                error_log($mensajeError . "\n", 3, "error_log.txt");
            }
        } else {
            $mensajeError = 'Error en traer ulrimo estado ' . date("Y-m-d") . $user;
            error_log($mensajeError . "\n", 3, "error_log.txt");
        }
    }

    public function Traer_preestudio_servicio_agrupacion($solicitud_servicio_id)
    {

        $sql = $this->_db3->prepare("SELECT a.* FROM cmx_consolidacion_solicitudes a

		WHERE a.solicitud_servicio=" . $solicitud_servicio_id . " AND estado=1");

        $sql->execute();

        $resultado_id = $sql->fetch(PDO::FETCH_ASSOC);

        return $resultado_id;
    }

    public function Consulta_fecha_cargue($agrupacion_id, $solicitud_servicio_id)
    {

        if (empty($agrupacion_id)) {

            $sql = $this->_db3->prepare("SELECT p.id, p.cod_ini_ruta, p.fecha_estimada_entrega,
			p.hora_estimada, p.peso, CONCAT(mu.municipio,' / ',mu.depto) AS muni,
			p.lugar, p.direccion_entrega FROM cmx_ruta_puntosentrega p
			INNER JOIN cmx_municipios mu ON p.municipio_entrega=mu.id
			INNER JOIN cmx_solicitud_vehiculo2 se ON p.cod_ini_ruta=se.nundoc_solicitud
			INNER JOIN cmx_detalle_mercancia2 m ON se.idpareja_origen_destino=m.id
			WHERE p.cod_ini_ruta=" . $solicitud_servicio_id . " AND p.tipo='punto recogida'");
            $sql->execute();
            $resultado_fecha_id = $sql->fetchAll(PDO::FETCH_ASSOC);
            return $resultado_fecha_id;
        } else {

            $sql = $this->_db3->prepare("SELECT  DISTINCT

			p.id, p.cod_ini_ruta, p.fecha_estimada_entrega,

			p.hora_estimada, p.peso, CONCAT(mu.municipio,' / ',mu.depto) AS muni,

			p.lugar, p.direccion_entrega

			FROM cmx_consolidacion_solicitudes su

			INNER JOIN  cmx_solicitud_vehiculo2 s

			ON su.solicitud_servicio=s.nundoc_solicitud

			INNER JOIN cmx_ruta_puntosentrega p

			ON s.nundoc_solicitud= p.cod_ini_ruta

			INNER JOIN cmx_municipios mu	ON p.municipio_entrega=mu.id

			INNER JOIN cmx_detalle_mercancia2 m ON s.idpareja_origen_destino=m.id

			WHERE su.estado=1

			AND su.agrupacion=" . $agrupacion_id . " AND p.tipo='punto recogida'");

            $sql->execute();

            $resultado_fecha_id = $sql->fetchAll(PDO::FETCH_ASSOC);

            return $resultado_fecha_id;
        }
    }

    public function Consultar_solicitudes_anidadas($datos)
    {

        $sql2 = "SELECT  DISTINCT

		su.solicitud_servicio, su.agrupacion,

		d.tipo_servicio_mer, d.n_cotizacion, d.item,

		d.id, s.nombre_cliente, d.flete, d.peso_neto_tn,

		d.tipo_mercancia, d.total_tarifa

		FROM cmx_consolidacion_solicitudes su

		INNER JOIN  cmx_solicitud_vehiculo2 s

		ON su.solicitud_servicio=s.nundoc_solicitud

		INNER JOIN cmx_detalle_mercancia2 d

		ON s.idpareja_origen_destino=d.id

		WHERE su.estado=1

		AND su.agrupacion=" . $datos["id_agrupacion"] . "

		AND su.solicitud_servicio NOT IN(" . $datos["num_servicio"] . ")";

        $sql = $this->_db3->prepare($sql2);

        $sql->execute();

        $resultado_solicitudes_anidadas = $sql->fetchAll(PDO::FETCH_ASSOC);

        return $resultado_solicitudes_anidadas;
    }

    public function Ver_seguridad($datos)
    {
        $sql = $this->_db3->prepare("SELECT v.*, s.*, v.usuario AS usuario, pro.numero_documento AS Propietario, pos.numero_documento AS Poseedor,con.numero_documento AS Conductor,pt.numero_documento AS Propietario_Trailer FROM cmx_vehiculos_preestudio v
			INNER JOIN cmx_solicitudes_preestudio s ON v.id=s.id_preestudio
			LEFT JOIN cmx_solicitudes_estados e ON s.id=e.id_solicitud
            LEFT JOIN cmx_proveedores pro ON v.documento_propietario=pro.numero_documento
            LEFT JOIN cmx_proveedores pos ON v.documento_tenedor=pos.numero_documento
            LEFT JOIN cmx_proveedores con ON v.documento_conductor=con.numero_documento
            LEFT JOIN cmx_proveedores pt ON v.documento_propietario_trailer=pt.numero_documento
			WHERE s.id_preestudio=:preestudio AND s.id=:solicitud GROUP BY v.placa_vehiculo");
        $sql->bindParam(':preestudio', $datos["preestudio"], PDO::PARAM_STR);
        $sql->bindParam(':solicitud', $datos["solicitud"], PDO::PARAM_STR);
        $sql->execute();
        $ver_seguridad = $sql->fetch(PDO::FETCH_ASSOC);

        if ($ver_seguridad) {
            //2 tipos de referencia : a. id del conductor b. numero del conductor
            $idcon = $ver_seguridad["documento_conductor"];
            //si existe result2,buscar por el id la referencia , si no existe buscar referencia por numero documento
            $sql4 = $this->_db3->prepare("SELECT * FROM cmx_referencias_preestudio WHERE id_conductor=" . $idcon . "");
            $sql4->execute();
            $resultado_referencias = $sql4->fetchAll(PDO::FETCH_ASSOC);

            $sql3 = $this->_db3->prepare("SELECT a.nundoc_solicitud, a.peso_kg, a.nombre_cliente, a.tipo_vehiculo, a.fecha, a.hora, a.usuario_auditor,
				CONCAT(C1.municipio,'-',C1.depto) AS orige, CONCAT(C2.municipio,'-',C2.depto) AS dest,a.observaciones,a.devol_numcont,a.devol_tipocont,a.devol_dias,
                CONCAT(C3.municipio,'-',C3.depto) AS devolucion_contenedor,a.devol_direccion
                FROM cmx_preestudio_solicitudes_servicio z
				INNER JOIN cmx_solicitud_vehiculo2 a ON z.id_servicio_cliente=a.nundoc_solicitud
				INNER JOIN cmx_municipios C1 ON a.origen=C1.rndc_codigo_ciudad
				INNER JOIN cmx_municipios C2 ON a.destino=C2.rndc_codigo_ciudad
				LEFT JOIN cmx_municipios C3 ON a.devol_municipio=C3.id
				WHERE z.id_solicitudpreestudio=:solicitud AND z.es=1");
            $sql3->bindParam(':solicitud', $datos["solicitud"], PDO::PARAM_STR);
            $sql3->execute();
            $resultado_preestudio = $sql3->fetchAll(PDO::FETCH_ASSOC);

            // Consulatr Documentos si el prefiltro los contiene
            $sql4 = $this->_db3->prepare("SELECT * FROM cmx_documeto_preestudio WHERE id_sol_prees=:solicitud");
            $sql4->bindParam(':solicitud', $datos["solicitud"], PDO::PARAM_STR);
            $sql4->execute();
            $resultado_documentos = $sql4->fetchAll(PDO::FETCH_ASSOC);

            $sql5 = $this->_db3->prepare("SELECT * FROM cmx_respuestasseguridad_preestudio WHERE id_solicitud=:solicitud");
            $sql5->bindParam(':solicitud', $datos["solicitud"], PDO::PARAM_STR);
            $sql5->execute();
            $resultado_observacion = $sql5->fetchAll(PDO::FETCH_ASSOC);

            /* Listar tipos de contenedor */
            if (isset($resultado_preestudio[0]["devol_tipocont"]) && $resultado_preestudio[0]["devol_tipocont"] != 0) {
                $sql_tipo_contenedor = $this->_db3->prepare("SELECT * FROM cmx_tipo_contenedor");
                $sql_tipo_contenedor->execute();
                $resultado_tipo_contenedor = $sql_tipo_contenedor->fetchAll(PDO::FETCH_ASSOC);

                foreach ($resultado_tipo_contenedor as $value) {
                    if ($value["id"] == $resultado_preestudio[0]["devol_tipocont"]) {
                        $nombre_contenedor = $value["nombre"];
                    }
                }
            } else {
                $nombre_contenedor = '';
            }
        }

        $resultados = array(
            "ver_seguridad" => $ver_seguridad,
            "resultado_referencias" => $resultado_referencias,
            "resultado_preestudio" => $resultado_preestudio,
            "resultado_documentos" => $resultado_documentos,
            "resultado_observacion" => $resultado_observacion,
            "nombre_contenedor" => $nombre_contenedor,
        );
        return $resultados;
    }

    public function Ver_datos_nuevos_prefiltro($solicitud)
    {
        // $sql = $this->_db3->prepare("SELECT * FROM cmx_estudio_vehiculo WHERE id_estudio=:estudio_id");
        $fecha = date('Y-m-d');
        $sql = $this->_db3->prepare("SELECT e.id_estudio,e.placa AS placa_vehiculo,e.fecha,e.hora,e.usuario,p.propietario,p.name_propietario,p.documento_propietario,p.poseedor,p.name_poseedor,p.documento_poseedor,p.conductor,p.name_conductor,p.documento_conductor,
        p.empresa1,p.empresa2,p.empresa3,p.feca1,p.feca2,p.fecb1,p.fecb2,p.fecc1,p.fecc2,p.cel1,p.cel2,p.cel3,p.cargo1,p.cargo2,p.cargo3,p.persona1,p.persona2,p.persona3,p.trailer,placa_trailer,p.name_propietario_trailer,p.documento_propi_trailer,p.estado_prefiltro,
        p.token_actual,p.estado_token,p.fecha_vigencia
        FROM cmx_estudio_vehiculo e
        INNER JOIN cmx_prefiltro_actualizar p ON e.id_estudio=p.id_solicitud_u WHERE e.fecha BETWEEN '" . $fecha . "' AND '" . $fecha . "' AND e.id_estudio=:estudio_id");
        $sql->bindParam(':estudio_id', $solicitud, PDO::PARAM_STR);
        $sql->execute();
        $resultados = $sql->fetch(PDO::FETCH_ASSOC);
        return $resultados;
    }

    public function Ver_datos_actuales_nuevos_prefiltro($placa)
    {
        $sql = $this->_db3->prepare("SELECT CONCAT(pro.nombre,'',IFNULL(pro.apellido1, ''),' ',IFNULL(pro.apellido2, '')) AS Propietario,CONCAT(pos.nombre,'',IFNULL(pos.apellido1, ''),' ',IFNULL(pos.apellido2, ''))AS Poseedor,
        CONCAT(con.nombre,'',con.apellido1,'',con.apellido2)AS Conductor,CONCAT(prot.nombre,'',prot.apellido1,'',prot.apellido2)AS Propietario_Trailer,
        pro.numero_documento AS cedula_propietario,pos.numero_documento AS cedula_poseedor,con.numero_documento AS cedula_conductor,
        prot.numero_documento AS cedula_propietario_trailer,v.web_satelital,v.usuario_satelital,v.clave_satelital,t.placa AS Placa_Trailer
        FROM cmx_vehiculos v
        INNER JOIN cmx_proveedores pro ON v.id_propietario=pro.numdoc_nexos
        INNER JOIN cmx_proveedores pos ON v.id_tenedor=pos.numdoc_nexos
        INNER JOIN cmx_proveedores con ON v.id_conductor=con.numdoc_nexos
        LEFT JOIN cmx_trailer_vehiculo tv ON v.numdoc_vehiculo=tv.id_vehiculo AND tv.estado=1
        LEFT JOIN cmx_trailer t ON tv.id_trailer=t.numdoc_trailer
        LEFT JOIN cmx_proveedores prot ON t.doc_propietario=prot.numdoc_nexos
        WHERE v.placa=:placa");
        $sql->bindParam(':placa', $placa, PDO::PARAM_STR);
        $sql->execute();
        $resultados = $sql->fetch(PDO::FETCH_ASSOC);
        return $resultados;
    }

    public function ver_logs_prefiltro_nuevo($placa, $solicitud_id)
    {
        $sql = $this->_db3->prepare("SELECT * FROM cmx_historial_actualizar_recurso_nuevo WHERE placa=:placa AND solicitud=:solicitud");
        $sql->bindParam(':placa', $placa, PDO::PARAM_STR);
        $sql->bindParam(':solicitud', $solicitud_id, PDO::PARAM_STR);
        $sql->execute();
        $resultado_logs = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado_logs;
    }

    public function guardar_datos_nuevos_prefiltro($solicitud, $estado, $observacion, $placa)
    {
        $response = []; // Inicializa la variable de respuesta
        try {
            // Iniciar la transacción
            $this->_db3->beginTransaction();
            if ($estado == "Iniciado") {
                $sql = $this->_db3->prepare("UPDATE cmx_prefiltro_actualizar SET estado_prefiltro=:estados, observacion=:observacion WHERE  id_solicitud_u=:idsolicitud");
                $sql->bindParam(':estados', $estado, PDO::PARAM_STR);
                $sql->bindParam(':idsolicitud', $solicitud, PDO::PARAM_STR);
                $sql->bindParam(':observacion', $observacion, PDO::PARAM_STR);
                $resultado_update = $sql->execute();
                if ($resultado_update) {
                    // Éxito en la actualización, confirmar la transacción
                    $this->_db3->commit();
                    $response = array('numero' => 200, 'mensaje' => 'Prefiltro <strong>' . $estado . '</strong> correctamente en NexosApp.');
                    $this->Insertar_log_recurso_nuevo($solicitud, $estado, $observacion, $placa);
                } else {
                    // Falla en la actualización, revertir la transacción
                    $this->_db3->rollBack();
                    $response = array('numero' => 400, 'mensaje' => 'Prefiltro no <strong>' . $estado . '</strong> correctamente en NexosApp.');
                    // Puedes lanzar una excepción específica aquí si lo deseas
                    $mensajeError = "Error al actualizar la base de datos." . date("Y-m.d");
                    error_log($mensajeError . "\n", 3, "error_log.txt");
                    throw new Exception("Error al actualizar la base de datos");
                }
            } else if ($estado == "Rechazado") {
                // Código para otros casos si es necesario
                $sql = $this->_db3->prepare("UPDATE cmx_prefiltro_actualizar SET estado_prefiltro=:estados,observacion=:observacion WHERE  id_solicitud_u=:idsolicitud");
                $sql->bindParam(':estados', $estado, PDO::PARAM_STR);
                $sql->bindParam(':idsolicitud', $solicitud, PDO::PARAM_STR);
                $sql->bindParam(':observacion', $observacion, PDO::PARAM_STR);
                $resultado_update = $sql->execute();
                if ($resultado_update) {
                    // Éxito en la actualización, confirmar la transacción
                    $this->_db3->commit();
                    $response = array('numero' => 200, 'mensaje' => 'Prefiltro <strong>' . $estado . '</strong> correctamente en NexosApp.');
                    $this->Insertar_log_recurso_nuevo($solicitud, $estado, $observacion, $placa);
                } else {
                    // Falla en la actualización, revertir la transacción
                    $this->_db3->rollBack();
                    $response = array('numero' => 400, 'mensaje' => 'Prefiltro no <strong>' . $estado . '</strong> correctamente en NexosApp.');
                    // Puedes lanzar una excepción específica aquí si lo deseas
                    $mensajeError = "Error al actualizar la base de datos." . date("Y-m.d");
                    error_log($mensajeError . "\n", 3, "error_log.txt");
                    throw new Exception("Error al actualizar la base de datos");
                }
            } else if ($estado == "Aprobado") {
                // Código para otros casos si es necesario
                $sql = $this->_db3->prepare("UPDATE cmx_prefiltro_actualizar SET estado_prefiltro=:estados,observacion=:observacion WHERE  id_solicitud_u=:idsolicitud");
                $sql->bindParam(':estados', $estado, PDO::PARAM_STR);
                $sql->bindParam(':idsolicitud', $solicitud, PDO::PARAM_STR);
                $sql->bindParam(':observacion', $observacion, PDO::PARAM_STR);
                $resultado_update = $sql->execute();
                if ($resultado_update) {
                    $expiryTime = strtotime('today midnight') + (60 * 60 * 12); // 12 horas desde la medianoche
                    $token = md5(uniqid(rand(), true));
                    $fechaexpiracion = date('Y-m-d H:i:s', $expiryTime);
                    $estado = 'Activo';
                    $sql_update_token = $this->_db3->prepare("UPDATE cmx_prefiltro_actualizar SET token_actual=:token_actual,fecha_vigencia=:fecha_vigencia,estado_token=:estado_token WHERE  id_solicitud_u=:idsolicitud");
                    $sql_update_token->bindParam(':token_actual', $token, PDO::PARAM_STR);
                    $sql_update_token->bindParam(':fecha_vigencia', $fechaexpiracion, PDO::PARAM_STR);
                    $sql_update_token->bindParam(':estado_token', $estado, PDO::PARAM_STR);
                    $sql_update_token->bindParam(':idsolicitud', $solicitud, PDO::PARAM_STR);
                    $resultado_update_token = $sql_update_token->execute();
                    if ($resultado_update_token) {
                        // Éxito en la actualización, confirmar la transacción
                        $this->_db3->commit();
                        $response = array('numero' => 200, 'mensaje' => 'Prefiltro <strong>' . $estado . '</strong> correctamente en NexosApp.');
                        $this->Insertar_log_recurso_nuevo($solicitud, $estado, $observacion, $placa);
                    } else {
                        $this->_db3->rollBack();
                        $response = array('numero' => 400, 'mensaje' => 'Prefiltro no <strong>' . $estado . '</strong> correctamente en NexosApp para el prefiltro <strong>' . $solicitud . '</strong>.');
                    }
                } else {
                    // Falla en la actualización, revertir la transacción
                    $this->_db3->rollBack();
                    $response = array('numero' => 400, 'mensaje' => 'Prefiltro no <strong>' . $estado . '</strong> correctamente en NexosApp.');
                    // Puedes lanzar una excepción específica aquí si lo deseas
                    $mensajeError = "Error al actualizar la base de datos." . date("Y-m.d");
                    error_log($mensajeError . "\n", 3, "error_log.txt");
                    throw new Exception("Error al actualizar la base de datos");
                }
            }
        } catch (\Throwable $th) {
            // Manejar la excepción
            // Puedes mostrar un mensaje de error o registrar la excepción en un archivo de registro
            // echo "Error: " . $th->getMessage();
            // O simplemente relanzar la excepción si deseas propagarla
            $mensajeError = "Error en el proceso." . date("Y-m.d");
            error_log($mensajeError . "\n", 3, "error_log.txt");
            throw $th;
        }
        // Devolver la respuesta
        // echo json_encode($response);
        return $response;
    }

    /* Funcion para insertar el log de los estudios de actualizar */
    public function Insertar_log_recurso_nuevo($solicitud, $estado, $observacion, $placa)
    {
        $fecha = date("Y-m-d");
        $hora = date('H:i:s');
        $user = $_SESSION["usuario"]["nom_usuario"];
        $sql = $this->_db3->prepare(("INSERT INTO cmx_historial_actualizar_recurso_nuevo (solicitud,estado,observacion,placa,usuario,fecha,hora) VALUES (:solicitud,:estado,:observacion,:placa,:usuario,:fecha,:hora)"));
        $sql->bindParam(':solicitud', $solicitud, PDO::PARAM_STR);
        $sql->bindParam(':estado', $estado, PDO::PARAM_STR);
        $sql->bindParam(':observacion', $observacion, PDO::PARAM_STR);
        $sql->bindParam(':placa', $placa, PDO::PARAM_STR);
        $sql->bindParam(':usuario', $user, PDO::PARAM_STR);
        $sql->bindParam(':fecha', $fecha, PDO::PARAM_STR);
        $sql->bindParam(':hora', $hora, PDO::PARAM_STR);
        $sql->execute();
    }

    public function validar_prefiltro($solicitud_id)
    {
        $sql = $this->_db3->prepare("SELECT estado, estado_actual FROM cmx_solicitudes_estados WHERE id_solicitud=:solicitud AND estado_actual=1");
        $sql->bindParam(':solicitud', $solicitud_id, PDO::PARAM_STR);
        $sql->execute();
        $resultado_estado_actual = $sql->fetch(PDO::FETCH_ASSOC);
        return $resultado_estado_actual;
    }

    //Consulta de prefiltro
    public function Consulta_estado_prefiltro($placa)
    {

        $sql = $this->_db3->prepare("SELECT MAX(se.id), se.estado, se.fecha, se.hora, sp.id_preestudio
			FROM cmx_solicitudes_preestudio sp
			INNER JOIN cmx_solicitudes_estados se ON sp.id=se.id_solicitud AND se.estado_actual=1
			WHERE sp.placa=:placa");
        $sql->bindParam(':placa', $placa, PDO::PARAM_STR);
        $sql->execute();
        $resultado = $sql->fetch(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function vencer_prefiltro()
    {
        $fecha_actual = date('Y-m-d');
        $sql = $this->_db3->prepare("SELECT  e.id AS idestados,s.id AS 'idsolitu'
				FROM cmx_solicitudes_preestudio s
				INNER JOIN cmx_solicitudes_estados e ON s.id=e.id_solicitud	AND e.estado_actual=1
				LEFT JOIN cmx_preestudio_solicitudes_servicio p ON s.id=p.id_solicitudpreestudio
				WHERE TIMESTAMPDIFF(DAY,s.fecha,:fecha)>=1 AND e.estado <> 'vencida' AND  e.estado <> 'aprobado' AND  e.estado <> 'cancelado'  AND  e.estado <> 'rechazado'");
        $sql->bindParam(':fecha', $fecha_actual, PDO::PARAM_STR);
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);

        if ($resultado) {
            foreach ($resultado as $key => $value) {
                $est1 = 0;
                $sql2 = $this->_db3->prepare("UPDATE cmx_solicitudes_estados SET estado_actual=:estados WHERE id_solicitud=:idsolicitud");
                $valor_solicitud = $value["idsolitu"];
                $sql2->bindParam(':estados', $est1, PDO::PARAM_STR);
                $sql2->bindParam(':idsolicitud', $valor_solicitud, PDO::PARAM_STR);
                $resultado_update = $sql2->execute();

                if ($resultado_update) {
                    $stad = 'vencida';
                    $nuevafecha = strtotime('-1 day', strtotime($fecha_actual));
                    $nuevafecha = date('Y-m-d', $nuevafecha);
                    $horanueva = '24:00:00';
                    $user = $_SESSION["usuario"]["nom_usuario"];
                    $uno = 1;
                    $sistema = 'sistema';
                    $sql3 = $this->_db3->prepare("INSERT cmx_solicitudes_estados (id,estado,id_solicitud,fecha,hora,usuario,estado_actual,area) VALUES(null,:estado_ant,:solicitud,:nuevafecha,:horanueva,:user,:estado,:area)");
                    $sql3->bindParam(':estado_ant', $stad, PDO::PARAM_STR);
                    $sql3->bindParam(':solicitud', $value["idsolitu"], PDO::PARAM_STR);
                    $sql3->bindParam(':nuevafecha', $nuevafecha, PDO::PARAM_STR);
                    $sql3->bindParam(':horanueva', $horanueva, PDO::PARAM_STR);
                    $sql3->bindParam(':user', $user, PDO::PARAM_STR);
                    $sql3->bindParam(':estado', $uno, PDO::PARAM_STR);
                    $sql3->bindParam(':area', $sistema, PDO::PARAM_STR);
                    $resultado_insert = $sql3->execute();
                    if ($resultado_insert) {
                        return json_encode(1);
                    } else {
                        return json_encode(0);
                        // $mensajeError = "No se ejecuto el inser en la tabla de cmx_solicitudes_estados." . date("Y-m.d");
                        // error_log($mensajeError . "\n", 3, "error_log.txt");
                    }
                } else {
                    $mensajeError = "No se ejecuto la actualizacion en la tabla cmx_solicitudes_estados." . date("Y-m-d");
                    error_log($mensajeError . "\n", 3, "error_log.txt");
                }
            }
        } else {
            $mensajeError = "Datos vencidos " . date("Y-m-d");
            error_log($mensajeError . "\n", 3, "error_log.txt");
        }
    }

    public function Traer_solicitudes($solicitud)
    {
        $sql = $this->_db3->prepare("SELECT * FROM  cmx_vehiculos_preestudio v
		LEFT JOIN cmx_solicitudes_preestudio s	ON v.id=s.id_preestudio WHERE s.id=:solicitud");
        $sql->bindParam(':solicitud', $solicitud, PDO::PARAM_STR);
        $sql->execute();
        $resultado_solicitudes = $sql->fetch(PDO::FETCH_ASSOC);
        if ($resultado_solicitudes) {
            //2 tipos de referencia : a. id del conductor b. numero del conductor
            $idcon = $resultado_solicitudes["documento_conductor"];
            //si existe result2,buscar por el id la referencia , si no existe buscar referencia por numero documento
            $sql4 = $this->_db3->prepare("SELECT * FROM cmx_referencias_preestudio WHERE id_conductor=" . $idcon . "");
            $sql4->execute();
            $resultado_referencias = $sql4->fetchAll(PDO::FETCH_ASSOC);
            $sql3 = $this->_db3->prepare("SELECT  a.nundoc_solicitud, a.peso_kg, a.nombre_cliente, a.tipo_vehiculo, a.fecha, a.hora, a.usuario_auditor,
			CONCAT(C1.municipio,'-',C1.depto) AS orige, CONCAT(C2.municipio,'-',C2.depto) AS dest, pt.nombre AS tipo_carro FROM cmx_preestudio_solicitudes_servicio z
			INNER JOIN cmx_solicitud_vehiculo2 a ON z.id_servicio_cliente=a.nundoc_solicitud
			INNER JOIN cmx_municipios C1 ON a.origen=C1.rndc_codigo_ciudad
			INNER JOIN cmx_municipios C2 ON a.destino=C2.rndc_codigo_ciudad
			INNER JOIN cmx_para_tipo_vehiculo pt ON a.tipo_vehiculo=pt.id
			WHERE z.id_solicitudpreestudio=:solicitud AND z.es=1");
            $sql3->bindParam(':solicitud', $solicitud, PDO::PARAM_STR);
            $sql3->execute();
            $resultado_preestudio = $sql3->fetchAll(PDO::FETCH_ASSOC);
        }

        $resultados = array(
            "resultado_solicitudes" => $resultado_solicitudes,
            "resultado_referencias" => $resultado_referencias,
            "resultado_preestudio" => $resultado_preestudio,
        );

        return $resultados;
    }

    public function Guardar_prefiltro($datos)
    {

        $fecha = date('Y-m-d');
        $hora_c = date('H:i:s');
        $estado_ac = 1;
        $area = "seguridad";
        $estado = $datos['estado'];
        $id_usuario = $_SESSION["usuario"]["nom_usuario"];
        try {

            $this->_db3->beginTransaction();
            $sql_idsol = $this->_db3->prepare("SELECT id_solicitud AS ID_SOLICITUD FROM cmx_solicitudes_estados WHERE id_solicitud =:solicitud_id ORDER BY id_solicitud DESC LIMIT 1");
            $sql_idsol->bindParam(':solicitud_id', $datos['solicitud'], PDO::PARAM_STR);
            $resultado_idsol = $sql_idsol->execute();
            $resultado_idsol = $sql_idsol->fetch(PDO::FETCH_ASSOC);
            if ($resultado_idsol) {
                $sol_id = $resultado_idsol["ID_SOLICITUD"];
                $sql2 = $this->_db3->prepare("UPDATE cmx_solicitudes_estados SET estado_actual='0' WHERE id_solicitud=:soli_num");
                $sql2->bindParam(':soli_num', $sol_id, PDO::PARAM_STR);
                $resultado_update = $sql2->execute();

                if ($resultado_update) {
                    $sql1 = $this->_db3->prepare("INSERT INTO cmx_solicitudes_estados (id,estado,id_solicitud,fecha,hora,usuario,estado_actual,area/* ,token,tiempo_validacion */)
					VALUES(NULL,:estado,:solicitud,:fecha,:hora_c,:id_usuario,:estado_actual,:area/*, :token,:tiempo_validacion */)");
                    $sql1->bindParam(':estado', $datos['estado']);
                    $sql1->bindParam(':solicitud', $datos['solicitud']);
                    $sql1->bindParam(':fecha', $fecha);
                    $sql1->bindParam(':hora_c', $hora_c);
                    $sql1->bindParam(':id_usuario', $id_usuario);
                    $sql1->bindParam(':estado_actual', $estado_ac);
                    $sql1->bindParam(':area', $area);
                    $sql1->execute();

                    if ($sql1) {
                        $sql3 = $this->_db3->prepare("SELECT id AS ID_ACT FROM cmx_solicitudes_estados WHERE id_solicitud = :solicitud_id ORDER BY id DESC LIMIT 1");
                        $sql3->bindParam(':solicitud_id', $datos['solicitud'], PDO::PARAM_STR);
                        $sql3->execute();
                        $resultado_ = $sql3->fetch(PDO::FETCH_ASSOC);
                        $idactu = $resultado_["ID_ACT"];
                        $causalidad = 0;
                        if ($idactu) {
                            $sqla = $this->_db3->prepare("INSERT INTO cmx_respuestasseguridad_preestudio (id,causalidad,observacion,id_estado,id_solicitud,usuario,fecha,hora)
							VALUES(null,:causalidad,:observacion,:id_sol,:id_solicitud,:usuario,:fecha,:hora)");
                            $sqla->bindParam(':causalidad', $causalidad);
                            $sqla->bindParam(':observacion', $datos['observacion']);
                            $sqla->bindParam(':id_sol', $idactu);
                            $sqla->bindParam(':id_solicitud', $datos['solicitud']);
                            $sqla->bindParam(':usuario', $id_usuario);
                            $sqla->bindParam(':fecha', $fecha);
                            $sqla->bindParam(':hora', $hora_c);
                            $sqla->execute();

                            if ($sqla) {
                                $sqlp = $this->_db3->prepare("UPDATE cmx_solicitudes_preestudio SET proceso=:proceso WHERE id_preestudio=:solicitud_id");
                                $sqlp->bindParam(':proceso', $datos['proceso']);
                                $sqlp->bindParam(':solicitud_id', $datos['solicitud']);
                                $sqlp->execute();
                                if ($sqlp) {
                                    if ($estado === 'aprobado') {
                                        $estpa = "aprobado_prefiltro";
                                        $expiryTime = strtotime('today midnight') + (60 * 60 * 12); // 12 horas desde la medianoche
                                        $token = md5(uniqid(rand(), true));
                                        $fechaexpiracion = date('Y-m-d H:i:s', $expiryTime);
                                        $sqlupdatetoken = $this->_db3->prepare("UPDATE cmx_solicitudes_estados SET token='" . $token . "',token_valido='" . $fechaexpiracion . "',estado_token='Activo' WHERE id='" . $idactu . "'");
                                        $sqlupdatetoken->execute();
                                    }

                                    if ($estado === 'rechazado') {
                                        $estpa = "Pendiente";
                                    }

                                    $sqlupdate_ss = $this->_db3->prepare("UPDATE cmx_solicitud_vehiculo2 ss
									INNER JOIN cmx_preestudio_solicitudes_servicio ps ON ss.nundoc_solicitud=ps.id_servicio_cliente
									INNER JOIN cmx_solicitudes_preestudio sp ON sp.id=ps.id_solicitudpreestudio
									INNER JOIN cmx_log_solicitudvehiculo log on log.id_solictud=ss.id
									SET ss.estado=:estado_prefiltro,log.estado=:estado_prefiltro_log
									WHERE sp.id_preestudio=:preestudio");
                                    $sqlupdate_ss->bindParam(':estado_prefiltro', $estpa);
                                    $sqlupdate_ss->bindParam(':estado_prefiltro_log', $estpa);
                                    $sqlupdate_ss->bindParam(':preestudio', $datos['solicitud']);
                                    $sqlupdate_ss->execute();

                                    if ($sqlupdate_ss) {
                                        $this->_db3->commit();
                                        $msg = "Datos Registrados Exitosamente, Prefiltro: " . $datos['solicitud'];
                                        return json_encode($msg);
                                    } else {
                                        $msg = "Datos no han sido registrados";
                                        return json_encode($msg);
                                    }
                                } else {
                                    $mensajeError = "Consulta no se ejecuto del la actualizcion de solicitides preestudio";
                                    $er = error_log($mensajeError, 3, "error_log.txt", "</br>");
                                    return json_encode($er);
                                }
                            } else {
                                $mensajeError = "Consulta no se ejecuto del ultimo registro de solicitud de respuesta de seguridad";
                                $er = error_log($mensajeError, 3, "error_log.txt", "</br>");
                                return json_encode($er);
                            }
                        } else {
                            $mensajeError = "Consulta no se ejecuto del ultimo registro de solicitud";
                            $er = error_log($mensajeError, 3, "error_log.txt", "</br>");
                            return json_encode($er);
                        }
                    } else {
                        $mensajeError = "Consulta no se ejecuto la consulta de insert tabla estados";
                        $er = error_log($mensajeError, 3, "error_log.txt", "</br>");
                        return json_encode($er);
                    }
                    // -------------------------------//
                } else {
                    $mensajeError = "Consulta no se ejecuto";
                    $er = error_log($mensajeError, 3, "error_log.txt", "</br>");
                    return json_encode($er);
                }
            } else {
                $mensajeError = "Consulta no se ejecuto traer ultima solicitud de servicio";
                $er = error_log($mensajeError, 3, "error_log.txt", "</br>");
                return json_encode($er);
            }
        } catch (\Throwable $th) {
            // Si ocurre algún error, deshacemos la transacción
            $this->_db3->rollBack();
            echo "Error en la transacción: " . $th->getMessage();
        }
    }
    // Fin Guardar Prefiltro
    // Fin Guardar Prefiltro
    public function Consultar_solicitudes_operaciones($datos)
    {
        $estado = $datos['estado'];
        $fecha_inicial = $datos["fecha_inicial"];
        $fecha_final = $datos["fecha_final"];
        $factual = date('Y-m-d');
        $hactual = date('G:i:s');
        $user = $_SESSION["usuario"]["nom_usuario"];
        if ($datos["operacion"] === "prefiltro_seguridad") {
            //"Entro como consulta de prefiltros";
            try {
                if ($estado === "t") {
                    $sql = $this->_db3->prepare("SELECT e.id AS idestados,s.id AS 'idsolitu', p.id_servicio_cliente FROM cmx_solicitudes_preestudio s
										INNER JOIN cmx_solicitudes_estados e ON s.id=e.id_solicitud	AND e.estado_actual=1
										LEFT JOIN cmx_preestudio_solicitudes_servicio p ON s.id=p.id_solicitudpreestudio
										WHERE (TIMESTAMPDIFF(DAY, s.fecha, '" . $factual . "')>=1) AND (e.estado = 'iniciado' OR e.estado = 'pendiente' OR  e.estado = 'pendiente_iniciar'  OR  e.estado = 'rechazado_para_modificar')");
                    $resultado = $sql->execute();
                    $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
                    if ($resultado) {
                        foreach ($resultado as $value) {
                            $actual_id = $value['idestados'];
                            $solicitud_id = $value['idsolitu'];
                            //Actualizar los estados de la solicitud a cero para poder ponerlas vencidas porque ya pasaron la fecha vigente de 24 horas
                            $sqla = $this->_db3->prepare("UPDATE cmx_solicitudes_estados SET estado_actual='0' WHERE id='.$actual_id.'");
                            $sqla->execute();
                        }
                        $nuevafecha = strtotime('-1 day', strtotime($factual));
                        $nuevafecha = date('Y-m-d', $nuevafecha);
                        $sqli = $this->_db3->prepare("INSERT cmx_solicitudes_estados (id,estado,id_solicitud,fecha,hora,usuario,estado_actual,area) VALUES(null,'vencida','.$solicitud_id.','.$nuevafecha.','24:00:00','.$user.',1,'sistema')");
                        $sqli->execute();
                    } else {
                        $mensajeError = "No se ejecuto el select a la tabla cmx_solicitudes_preestudio" . date("Y-m-d") . $user;
                        error_log($mensajeError . "\n", 3, "error_log.txt");
                    }

                    $sql = $this->_db3->prepare("SELECT s.id AS esoli, s.id_preestudio, s.placa, s.fecha, s.hora, s.usuario,s.observacion, s.proceso,s.operacion, e.estado, e.estado_actual,v.placa_trailer,v.documento_propietario_trailer,
										CASE e.estado WHEN 'aprobado' THEN 'Autorizado HV' ELSE e.estado END AS campo,
										CASE WHEN ve.id   IS NULL THEN 0 ELSE ve.id  END AS 'idvehi',
										CASE WHEN ve.id_conductor IS NULL THEN 0 ELSE ve.id_conductor END AS 'id_conductor',
										CASE WHEN v.documento_propietario IS NULL THEN 0 ELSE v.documento_propietario END AS 'documento_propietario',
										CASE WHEN v.documento_tenedor IS NULL THEN 0 ELSE v.documento_tenedor END AS 'documento_tenedor',
										CASE WHEN v.documento_conductor IS NULL THEN 0 ELSE v.documento_conductor END AS 'documento_conductor',
										CASE WHEN soli.id IS NULL THEN 0 ELSE 1 END AS 'existe_estudio',v.itr,u.nom_usuario AS responsable_vehiculo,u.id AS usuario_responsable_vehiculo
										FROM cmx_solicitudes_preestudio s
										INNER JOIN cmx_vehiculos_preestudio v ON s.id_preestudio=v.id
										INNER JOIN cmx_solicitudes_estados e ON s.id=e.id_solicitud
                                        INNER JOIN cmx_usuarios u ON v.responsable=u.id
										LEFT JOIN cmx_vehiculos ve ON v.placa_vehiculo=ve.placa
										LEFT JOIN cmx_log_solicitudvehiculo2 soli ON s.id=soli.id_solictud AND soli.estado_actu=1
                                        LEFT JOIN cmx_preestudio_solicitudes_servicio n ON e.id_solicitud=n.id_solicitudpreestudio
		                                LEFT JOIN cmx_solicitud_vehiculo2 pp ON n.id_servicio_cliente=pp.nundoc_solicitud

										WHERE e.estado_actual='1' AND e.fecha BETWEEN '" . $fecha_inicial . "' AND '" . $fecha_final . "' ORDER BY s.id DESC");
                    $resultado_ssp = $sql->execute();
                    $resultado_ssp = $sql->fetchAll(PDO::FETCH_ASSOC);
                    return $resultado_ssp;
                } else if ($estado === "aprobado" || $estado === "pendiente_iniciar" || $estado === "iniciado" || $estado === "rechazado" || $estado === "cancelado" || $estado === "rechazado_para_modificar" || $estado === "vencida") {
                    $sqlm = $this->_db3->prepare("SELECT e.id AS idestados,s.id AS 'idsolitu', p.id_servicio_cliente
										FROM cmx_solicitudes_preestudio s
										INNER JOIN cmx_solicitudes_estados e ON s.id=e.id_solicitud	AND e.estado_actual=1
										LEFT JOIN cmx_preestudio_solicitudes_servicio p ON s.id=p.id_solicitudpreestudio
										WHERE (TIMESTAMPDIFF(DAY, s.fecha, '" . $factual . "')>=1) AND (e.estado = 'iniciado' OR e.estado = 'pendiente' OR  e.estado = 'pendiente_iniciar'  OR  e.estado = 'rechazado_para_modificar')");
                    $resultado_m = $sqlm->execute();
                    $resultado_m = $sqlm->fetchAll(PDO::FETCH_ASSOC);
                    if ($resultado_m) {
                        foreach ($resultado_m as $value) {
                            $actual_id = $value['idestados'];
                            $solicitud_id = $value['idsolitu'];
                            //Actualizar los estados de la solicitud a cero para poder ponerlas vencidas porque ya pasaron la fecha vigente de 24 horas

                            $sqla = $this->_db3->prepare("UPDATE cmx_solicitudes_estados SET estado_actual=0 WHERE  id=" . $actual_id . "");
                            $sqla->execute();
                        }
                        $nuevafecha = strtotime('-1 day', strtotime($factual));
                        $nuevafecha = date('Y-m-d', $nuevafecha);
                        $sqli = $this->_db3->prepare("INSERT cmx_solicitudes_estados (id,estado,id_solicitud,fecha,hora,usuario,estado_actual,area) VALUES(null,'vencida'," . $solicitud_id . ",'" . $nuevafecha . "','24:00:00','" . $user . "',1,'sistema')");
                        $sqli->execute();
                    } else {
                        $mensajeError = "No se ejecuto el select a la tabla  cmx_solicitudes_preestudio en el ele if " . date("Y-m-d") . $user;
                        error_log($mensajeError . "\n", 3, "error_log.txt");
                    }

                    $sql = $this->_db3->prepare("SELECT s.id AS esoli, s.id_preestudio, s.placa, s.fecha, s.hora, s.usuario,
										s.observacion, s.proceso,s.operacion, e.estado, e.estado_actual,
										CASE e.estado WHEN 'aprobado' THEN 'Autorizado HV' ELSE e.estado END AS campo,
										CASE WHEN ve.id   IS NULL THEN 0 ELSE ve.id  END AS 'idvehi',
										CASE WHEN ve.id_conductor IS NULL THEN 0 ELSE ve.id_conductor END AS 'id_conductor',
										CASE WHEN v.documento_propietario IS NULL THEN 0 ELSE v.documento_propietario END AS 'documento_propietario',
										CASE WHEN v.documento_tenedor IS NULL THEN 0 ELSE v.documento_tenedor END AS 'documento_tenedor',
										CASE WHEN v.documento_conductor IS NULL THEN 0 ELSE v.documento_conductor END AS 'documento_conductor',
										CASE WHEN soli.id IS NULL THEN 0 ELSE 1 END AS 'existe_estudio',v.itr
										FROM cmx_solicitudes_preestudio s
										INNER JOIN cmx_vehiculos_preestudio v ON s.id_preestudio=v.id
										INNER JOIN cmx_solicitudes_estados e ON s.id=e.id_solicitud
										LEFT JOIN cmx_vehiculos ve ON v.placa_vehiculo=ve.placa
										LEFT JOIN cmx_log_solicitudvehiculo2 soli ON s.id_preestudio=soli.id_solictud AND soli.estado_actu=1
										WHERE e.estado_actual='1' AND e.fecha BETWEEN '" . $fecha_inicial . "' AND '" . $fecha_final . "' ORDER BY s.id DESC");
                    $resultado_ssp = $sql->execute();
                    $resultado_ssp = $sql->fetchAll(PDO::FETCH_ASSOC);
                    return $resultado_ssp;
                }
            } catch (\Throwable $th) {
                //throw $th;
                $mensajeError = "Error en la transacción: " . $th->getMessage() . date("Y-m-d") . $user;
                error_log($mensajeError . "\n", 3, "error_log.txt");
            }
        } else {
            if ($estado === "t") {
                //Entro como consulta de Estudio de seguridad
                $sqlm = $this->_db3->prepare("SELECT es.id_estudio,etp.id_estudio_c,etp.id_vehiculo,etp.id_conductor,etp.proceso FROM cmx_estudio_vehiculo es
								INNER JOIN cmx_estudiov_completo etp ON etp.id_estudio=es.id_estudio AND etp.estado_actu=1
								WHERE (TIMESTAMPDIFF(DAY, etp.fecha, '" . $factual . "')>=1) AND (etp.estado = 'iniciado' OR etp.estado = 'pendiente' OR  etp.estado = 'pendiente_iniciar'
								OR  etp.estado = 'rechazado_para_modificar')");
                $resultado_m = $sqlm->execute();
                $resultado_m = $sqlm->fetchAll(PDO::FETCH_ASSOC);
                if ($resultado_m) {
                    foreach ($resultado_m as $value) {
                        $solicitud_id = $value['id_estudio_c'];
                        $id_estudio = $value['id_estudio'];
                        $id_vehiculo = $value['id_vehiculo'];
                        $id_conductor = $value['id_conductor'];
                        $proceso = $value['proceso'];
                        //Actualizar los estados de la solicitud a cero para poder ponerlas vencidas porque ya pasaron la fecha vigente de 24 horas
                        $sqla = $this->_db3->prepare("UPDATE cmx_estudiov_completo SET estado_actu=0 WHERE  id_estudio_c='" . $solicitud_id . "'");
                        $sqla->execute();
                        $nuevafecha = strtotime('-1 day', strtotime($factual));
                        $nuevafecha = date('Y-m-d', $nuevafecha);
                        $sqli = $this->_db3->prepare("INSERT cmx_estudiov_completo (id_estudio_c,id_estudio,estado,id_vehiculo,id_conductor,observacion,proceso,fecha,hora,usuario,estado_actu,estado_subasta)
								VALUES('" . $solicitud_id . "','" . $id_estudio . "','vencida','" . $id_vehiculo . "','" . $id_conductor . "','NULL','" . $proceso . "','" . $nuevafecha . "','24:00:00','" . $user . "','1','Inactivo')");
                        $sqli->execute();
                    }
                } else {
                    $mensajeError = "No se ejecuto el select a la tabla cmx_estudio_vehiculo" . date("Y-m-d") . $user;
                    error_log($mensajeError . "\n", 3, "error_log.txt");
                }
                $sql = $this->_db3->prepare("SELECT estv.id_estudio,estc.id_estudio_c,estc.fecha,estc.hora,estv.placa,estv.operacion,estc.estado,estc.estado_actu,pro.nombre,pro.apellido1,estc.id_vehiculo,estc.id_conductor,estc.observacion,pro.numero_documento,
                pa.estado_prefiltro,estv.itr,pa.estado_creacion,u.nom_usuario AS responsable_vehiculo
				FROM  cmx_estudio_vehiculo estv
				INNER JOIN cmx_estudiov_completo estc ON estc.id_estudio=estv.id_estudio AND estc.estado_actu=1
				INNER JOIN cmx_proveedores pro ON estc.id_conductor=pro.numdoc_nexos
                INNER JOIN cmx_usuarios u ON estv.responsable=u.id
                LEFT  JOIN cmx_prefiltro_actualizar pa ON estv.id_estudio=pa.id_solicitud_u
				WHERE  estc.fecha BETWEEN '" . $fecha_inicial . "' AND '" . $fecha_final . "' ORDER BY estv.hora DESC");
                $resultado_ssp = $sql->execute();
                $resultado_ssp = $sql->fetchAll(PDO::FETCH_ASSOC);
                $response = array(
                    "Estudio_Seguridad" => "Estudio_de_Seguridad",
                    "respuesta" => $resultado_ssp,
                );
                return $response;
            } else {
                //Entro como consulta de Estudio de seguridad
                // Filtro para estudio de seguridad
                if ($estado === "pendiente_iniciar_e") {
                    $estado = "pendiente_iniciar";
                } else if ($estado === "Aprobado_e") {
                    $estado = "aprobado";
                } else if ($estado === "iniciado_e") {
                    $estado = "iniciado";
                } else if ($estado === "Pendiente_e") {
                    $estado = "pendiente";
                } else if ($estado === "Rechazado_e") {
                    $estado = "rechazado";
                } else if ($estado === "Rechazado_modificar_e") {
                    $estado = "rechazado_modificar";
                } else if ($estado === "Cancelado_e") {
                    $estado = "Cancelado";
                }

                $sqlm = $this->_db3->prepare("SELECT es.id_estudio,etp.id_estudio_c,etp.id_vehiculo,etp.id_conductor,etp.proceso
				FROM cmx_estudio_vehiculo es
				INNER JOIN cmx_estudiov_completo etp ON etp.id_estudio=es.id_estudio AND etp.estado_actu=1
			    WHERE (TIMESTAMPDIFF(DAY, etp.fecha, '" . $factual . "')>=1) AND (etp.estado = 'iniciado' OR etp.estado = 'pendiente' OR  etp.estado = 'pendiente_iniciar' OR  etp.estado = 'rechazado_para_modificar')");
                $resultado_m = $sqlm->execute();
                $resultado_m = $sqlm->fetchAll(PDO::FETCH_ASSOC);
                if ($resultado_m) {
                    foreach ($resultado_m as $value) {
                        $solicitud_id = $value['id_estudio_c'];
                        $id_estudio = $value['id_estudio'];
                        $id_vehiculo = $value['id_vehiculo'];
                        $id_conductor = $value['id_conductor'];
                        $proceso = $value['proceso'];
                        //Actualizar los estados de la solicitud a cero para poder ponerlas vencidas porque ya pasaron la fecha vigente de 24 horas
                        $sqla = $this->_db3->prepare("UPDATE cmx_estudiov_completo SET estado_actu=0 WHERE  id_estudio_c='" . $solicitud_id . "'");
                        $sqla->execute();
                        $nuevafecha = strtotime('-1 day', strtotime($factual));
                        $nuevafecha = date('Y-m-d', $nuevafecha);
                        $sqli = $this->_db3->prepare("INSERT cmx_estudiov_completo (id_estudio_c,id_estudio,estado,id_vehiculo,id_conductor,observacion,proceso,fecha,hora,usuario,estado_actu,estado_subasta)
									VALUES('" . $solicitud_id . "','" . $id_estudio . "','vencida','" . $id_vehiculo . "','" . $id_conductor . "','NULL','" . $proceso . "','" . $nuevafecha . "','24:00:00','" . $user . "','1','Inactivo')");
                        $sqli->execute();
                    }
                } else {
                    $mensajeError = "No se ejecuto el select a la tablar cmx_estudio_vehiculo en el else" . date("Y-m-d") . $user;
                    error_log($mensajeError . "\n", 3, "error_log.txt");
                }
                $sql = $this->_db3->prepare("SELECT estv.id_estudio,estc.id_estudio_c,estc.fecha,estc.hora,estv.placa,estv.operacion,estc.estado,estc.estado_actu,pro.nombre,pro.apellido1,estc.id_vehiculo,estc.id_conductor,estc.observacion,pro.numero_documento,
                pa.estado_prefiltro,estv.itr,pa.estado_creacion
				FROM  cmx_estudio_vehiculo estv
				INNER JOIN cmx_estudiov_completo estc ON estc.id_estudio=estv.id_estudio AND estc.estado_actu=1
				INNER JOIN cmx_proveedores pro ON estc.id_conductor=pro.numdoc_nexos
                LEFT  JOIN cmx_prefiltro_actualizar pa ON estv.id_estudio=pa.id_solicitud_u
				WHERE  estc.fecha BETWEEN '" . $fecha_inicial . "' AND '" . $fecha_final . "' AND estc.estado='" . $estado . "' ORDER BY estv.id DESC");
                $resultado_ssp = $sql->execute();
                $resultado_ssp = $sql->fetchAll(PDO::FETCH_ASSOC);
                $response = array(
                    "Estudio_Seguridad" => "Estudio_de_Seguridad",
                    "respuesta" => $resultado_ssp,
                );
                return $response;
            }
        }
    }

    public function Validar_Solicitud_operaciones($placa, $solicitud)
    {
        $sql = $this->_db3->prepare(" SELECT v.*, s.* , s.id AS soli_prees, pp.nombre_cliente , s.usuario AS usuario_operaciones,pro.numero_documento AS Propietario, pos.numero_documento AS Poseedor,con.numero_documento AS Conductor,pt.numero_documento AS Propietario_Trailer  FROM cmx_solicitudes_preestudio s
		INNER JOIN cmx_vehiculos_preestudio v ON s.id_preestudio=v.id
		LEFT JOIN cmx_solicitudes_estados e ON s.id=e.id_solicitud
		LEFT JOIN cmx_preestudio_solicitudes_servicio AS n ON e.id_solicitud=n.id_solicitudpreestudio
		LEFT JOIN cmx_solicitud_vehiculo2 pp ON n.id_servicio_cliente=pp.nundoc_solicitud
        LEFT JOIN cmx_proveedores pro ON v.documento_propietario=pro.numero_documento
        LEFT JOIN cmx_proveedores pos ON v.documento_tenedor=pos.numero_documento
        LEFT JOIN cmx_proveedores con ON v.documento_conductor=con.numero_documento
        LEFT JOIN cmx_proveedores pt ON v.documento_propietario_trailer=pt.numero_documento
		WHERE   s.id='" . $solicitud . "' AND s.placa='" . $placa . "' GROUP BY s.placa ");
        $resultado_ssp = $sql->execute();
        $resultado_ssp = $sql->fetch(PDO::FETCH_ASSOC);
        if ($resultado_ssp) {
            $idcon = $resultado_ssp["documento_conductor"];
            $sql4 = $this->_db3->prepare("SELECT * FROM cmx_referencias_preestudio WHERE id_conductor=" . $idcon . "");
            $sql4->execute();
            $resultado_referencias = $sql4->fetchAll(PDO::FETCH_ASSOC);
            $sql3 = $this->_db3->prepare(" SELECT a.nundoc_solicitud, a.peso_kg, a.nombre_cliente, a.tipo_vehiculo, a.fecha, a.hora, a.usuario_auditor, tv.nombre AS tipovehiculo,
			CONCAT(C1.municipio,'-',C1.depto) AS orige, CONCAT(C2.municipio,'-',C2.depto) AS dest, a.usuario_auditor
			FROM cmx_preestudio_solicitudes_servicio z
			INNER JOIN cmx_solicitud_vehiculo2 a ON z.id_servicio_cliente=a.nundoc_solicitud
			INNER JOIN cmx_municipios C1 ON a.origen=C1.rndc_codigo_ciudad
			INNER JOIN cmx_municipios C2 ON a.destino=C2.rndc_codigo_ciudad
			INNER JOIN cmx_para_tipo_vehiculo tv ON a.tipo_vehiculo=tv.id
			WHERE z.id_solicitudpreestudio=:solicitud AND z.es=1");
            $sql3->bindParam(':solicitud', $solicitud, PDO::PARAM_STR);
            $sql3->execute();
            $resultado_preestudio = $sql3->fetchAll(PDO::FETCH_ASSOC);
            // Consulatr Documentos si el prefiltro los contiene
            $sql4 = $this->_db3->prepare("SELECT * FROM cmx_documeto_preestudio WHERE id_sol_prees=:solicitud");
            $sql4->bindParam(':solicitud', $solicitud, PDO::PARAM_STR);
            $sql4->execute();
            $resultado_documentos = $sql4->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $mensajeError = "Sin respuesta";
            $er = error_log($mensajeError, 3, "error_log.txt");
            return json_encode($er);
        }

        $resultados = array(
            "ver_seguridad" => $resultado_ssp,
            "resultado_referencias" => $resultado_referencias,
            "resultado_preestudio" => $resultado_preestudio,
            "resultado_documentos" => $resultado_documentos,
        );
        return $resultados;
    }

    public function Consular_campos_actualizar_operaciones($placa, $solicitud)
    {
        $sql = $this->_db3->prepare("SELECT * FROM cmx_actualiza_seguridad WHERE id_sol_prees=:solicitud");
        $sql->bindParam(':solicitud', $solicitud, PDO::PARAM_STR);
        $sql->execute();
        $resultado_campos_actualizar = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado_campos_actualizar;
    }

    public function Consular_documentos_actualizar_operaciones($placa, $solicitud)
    {
        $sql = $this->_db3->prepare("SELECT * FROM cmx_actualiza_seguridad WHERE id_sol_prees=:solicitud");
        $sql->bindParam(':solicitud', $solicitud, PDO::PARAM_STR);
        $sql->execute();
        $resultado_documento_actualizar = $sql->fetchAll(PDO::FETCH_ASSOC);

        $sql3 = $this->_db3->prepare(" SELECT a.nundoc_solicitud, a.peso_kg, a.nombre_cliente, a.tipo_vehiculo, a.fecha, a.hora, a.usuario_auditor, tv.nombre AS tipovehiculo,
		CONCAT(C1.municipio,'-',C1.depto) AS orige, CONCAT(C2.municipio,'-',C2.depto) AS dest, a.usuario_auditor,a.observaciones,a.devol_numcont,a.devol_tipocont,a.devol_dias,
        CONCAT(C3.municipio,'-',C3.depto) AS devolucion_contenedor,a.devol_direccion
		FROM cmx_preestudio_solicitudes_servicio z
		INNER JOIN cmx_solicitud_vehiculo2 a ON z.id_servicio_cliente=a.nundoc_solicitud
		INNER JOIN cmx_municipios C1 ON a.origen=C1.rndc_codigo_ciudad
		INNER JOIN cmx_municipios C2 ON a.destino=C2.rndc_codigo_ciudad
		INNER JOIN cmx_para_tipo_vehiculo tv ON a.tipo_vehiculo=tv.id
        LEFT JOIN cmx_municipios C3 ON a.devol_municipio=C3.id
		WHERE z.id_solicitudpreestudio=:solicitud AND z.es=1");
        $sql3->bindParam(':solicitud', $solicitud, PDO::PARAM_STR);
        $sql3->execute();
        $resultado_preestudio = $sql3->fetchAll(PDO::FETCH_ASSOC);
        /* Listar tipos de contenedor */
        $sql_tipo_contenedor = $this->_db3->prepare("SELECT * FROM cmx_tipo_contenedor");
        $sql_tipo_contenedor->execute();
        $resultado_tipo_contenedor = $sql_tipo_contenedor->fetchAll(PDO::FETCH_ASSOC);
        $nombre_contenedor = '';
        if (isset($resultado_preestudio[0]["devol_tipocont"])) {
            foreach ($resultado_tipo_contenedor as $value) {
                if ($value["id"] == $resultado_preestudio[0]["devol_tipocont"]) {
                    $nombre_contenedor = $value["nombre"];
                }
            }
        } else {
            $nombre_contenedor = '';
        }

        $resultados = array(
            "resultado_documento_actualizar" => $resultado_documento_actualizar,
            "resultado_preestudio" => $resultado_preestudio,
            "nombre_contenedor" => $nombre_contenedor,
        );
        return $resultados;
        // return $resultado_documento_actualizar;
    }

    public function Consular_respuesta_seguridad_operaciones($placa, $solicitud)
    {
        // $sql = $this->_db3->prepare("SELECT res.id,es.estado, es.fecha, es.hora, es.usuario, cau.respuesta,res.observacion,
        $sql = $this->_db3->prepare("SELECT res.id,es.estado, es.fecha, es.hora, es.usuario,res.observacion,
		es.token,es.token_valido,vp.placa_vehiculo FROM cmx_respuestasseguridad_preestudio res
		INNER JOIN cmx_solicitudes_estados es ON res.id_estado=es.id
		-- INNER JOIN cmx_solicitudpreestudio_respuestas cau ON res.causalidad=cau.id
		INNER JOIN cmx_vehiculos_preestudio vp ON vp.id=es.id_solicitud
		WHERE res.id_solicitud=:solicitud");
        $sql->bindParam(':solicitud', $solicitud, PDO::PARAM_STR);
        $sql->execute();
        $respuesta_seguridad = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $respuesta_seguridad;
    }

    public function Validar_estudio_seguridad_operaciones($datos)
    {
        $placa = $datos['placa'];
        $conductor = $datos['conductor'];
        $propietario = $datos['propietario'];
        $tenedor = $datos['tenedor'];
        $propietario_trailer = $datos['propietario_trailer'];
        $trailer = $datos['trailer'];

        // Validar Vehiculo
        $sql = $this->_db3->prepare("SELECT * FROM cmx_vehiculos WHERE placa=:placa");
        $sql->bindParam(':placa', $placa, PDO::PARAM_STR);
        $sql->execute();
        $respuesta_vehiculo = $sql->fetch(PDO::FETCH_ASSOC);

        $sql_coductor = $this->_db3->prepare("SELECT p.* FROM cmx_proveedores  p
		INNER JOIN cmx_actividad_proveedor a ON p.numdoc_nexos=a.id_proveedor
		WHERE a.actividad='Conductor'AND  p.numero_documento=:conductor");
        $sql_coductor->bindParam(':conductor', $conductor, PDO::PARAM_STR);
        $sql_coductor->execute();

        $respuesta_conductor = $sql_coductor->fetch(PDO::FETCH_ASSOC);
        $sql_propietario = $this->_db3->prepare("SELECT p.* FROM cmx_proveedores  p
				INNER JOIN cmx_actividad_proveedor a ON p.numdoc_nexos=a.id_proveedor
				WHERE a.actividad='Propietario Vehiculo' AND  p.numero_documento=:propietario");
        $sql_propietario->bindParam(':propietario', $propietario, PDO::PARAM_STR);
        $sql_propietario->execute();
        $respuesta_propietario = $sql_propietario->fetch(PDO::FETCH_ASSOC);

        $sql_tenedor = $this->_db3->prepare("SELECT p.* FROM cmx_proveedores  p
		INNER JOIN cmx_actividad_proveedor a ON p.numdoc_nexos=a.id_proveedor
		WHERE a.actividad='Poseedor Vehiculo' AND  p.numero_documento=:tenedor");
        $sql_tenedor->bindParam(':tenedor', $tenedor, PDO::PARAM_STR);
        $sql_tenedor->execute();
        $respuesta_tenedor = $sql_tenedor->fetch(PDO::FETCH_ASSOC);

        $sql_propietario_triler = $this->_db3->prepare("SELECT p.* FROM cmx_proveedores  p
		INNER JOIN cmx_actividad_proveedor a ON p.numdoc_nexos=a.id_proveedor
		WHERE a.actividad='Propietario Trailer' AND  p.numero_documento=:propietario_trailer");
        $sql_propietario_triler->bindParam(':propietario_trailer', $propietario_trailer, PDO::PARAM_STR);
        $sql_propietario_triler->execute();
        $respuesta_propietario_trailer = $sql_propietario_triler->fetch(PDO::FETCH_ASSOC);

        $sql_trailer = $this->_db3->prepare("SELECT * FROM cmx_trailer WHERE placa=:placa");
        $sql_trailer->bindParam(':placa', $trailer, PDO::PARAM_STR);
        $sql_trailer->execute();
        $respuesta_trailer = $sql_trailer->fetch(PDO::FETCH_ASSOC);

        $resultados = [
            "respuesta_propietario" => $respuesta_propietario,
            "respuesta_tenedor" => $respuesta_tenedor,
            "respuesta_vehiculo" => $respuesta_vehiculo,
            "respuesta_conductor" => $respuesta_conductor,
            "respuesta_propietario_trailer" => $respuesta_propietario_trailer,
            "respuesta_trailer" => $respuesta_trailer,
        ];

        return $resultados;
    }

    public function Validar_Token_seguridad($datos)
    {
        $fechaHoraActual = date("Y-m-d H:i:s");
        $estado = "aprobado";
        $estadoactual = 1;
        $formatoFecha = 'Y-m-d H:i:s';

        $sql = $this->_db3->prepare("SELECT se.id_solicitud,se.token,sp.placa, se.token_valido,vp.documento_propietario,vp.documento_tenedor,vp.documento_conductor FROM cmx_solicitudes_estados se
    	INNER JOIN cmx_solicitudes_preestudio sp ON sp.id_preestudio=se.id_solicitud
        INNER JOIN cmx_vehiculos_preestudio vp ON sp.placa=vp.placa_vehiculo
        WHERE se.estado=:estado AND se.id_solicitud=:solicitud AND se.token=:token AND sp.placa=:placa
        AND vp.documento_propietario=:documento_propietario AND vp.documento_tenedor=:documento_tenedor AND vp.documento_conductor=:documento_conductor");
        $sql->bindParam(':estado', $estado, PDO::PARAM_STR);
        $sql->bindParam(':solicitud', $datos['numsoli'], PDO::PARAM_STR);
        $sql->bindParam(':token', $datos['token'], PDO::PARAM_STR);
        $sql->bindParam(':placa', $datos['placa'], PDO::PARAM_STR);
        $sql->bindParam(':documento_propietario', $datos['propietario'], PDO::PARAM_STR);
        $sql->bindParam(':documento_tenedor', $datos['tenedor'], PDO::PARAM_STR);
        $sql->bindParam(':documento_conductor', $datos['conductor'], PDO::PARAM_STR);
        $resultado = $sql->execute();
        $resultado = $sql->fetch(PDO::FETCH_ASSOC);
        $fechaDateTime = DateTime::createFromFormat($formatoFecha, $resultado['token_valido']);
        $fechahorabd = DateTime::createFromFormat($formatoFecha, $fechaHoraActual);
        if ($resultado !== false) {
            // Dividir la fecha y hora en dos partes
            $partesactual = explode(' ', $fechaHoraActual);
            $fecha_actual = $partesactual[0];
            $hora_actual = $partesactual[1];
            $partes = explode(' ', $resultado['token_valido']);
            $fecha = $partes[0];
            $hora = $partes[1];
            if ($fecha_actual > $fecha) {
                // Calcular Diferencia de las fechas
                $fechahorabd = date_create($fechaHoraActual);
                // Calcular la diferencia
                $diferencia = $fechahorabd->diff($fechaDateTime);
                $response = array(
                    'numero' => 400,
                    'mensaje' => " Token Vencio Hace : " . $diferencia->format('%d días, %h horas, %i minutos, %s segundos, solicitar nuevo prefiltro a la placa <strong>' . $datos['placa'] . '</strong>'),
                );
            } else {
                $sql_update_estado_token = $this->_db3->prepare("UPDATE cmx_solicitudes_estados SET estado_token='Ocupado' WHERE token=:token AND id_solicitud=:solicitud AND estado_token='Activo'");
                $sql_update_estado_token->bindParam(':token', $datos['token'], PDO::PARAM_STR);
                $sql_update_estado_token->bindParam(':solicitud', $datos['numsoli'], PDO::PARAM_STR);
                $resultado_update = $sql_update_estado_token->execute();
                if ($resultado_update) {
                    $response = array(
                        'numero' => 200,
                        'mensaje' => 'Token Valido Hasta hoy : ' . $resultado['token_valido'] . ' para el prefiltro <strong>' . $datos['numsoli'] . '</strong> con la placa <strong>' . $resultado['placa'] . '</strong>',
                    );
                } else {
                    $response = array(
                        'numero' => 400,
                        'mensaje' => 'Este token <strong>' . $datos['token'] . '</strong>, ya esta en uso no se permiten mas acciones con el token <strong>' . $datos['token'] . '</strong>.',
                    );
                }
            }
        } else {
            $response = array(
                'numero' => 400,
                'mensaje' => 'Este token <strong>' . $datos['token'] . '</strong>, no pertenece al prefiltro <strong>' . $datos['numsoli'] . '</strong> liago a la placa <strong>' . $datos['placa'] . '</strong>.',
            );
        }
        return $response;
    }

    public function cancela_preestudio($numero_pre, $placa, $motivo, $nota, $accion_actividad, $estudioc, $vehiculo_cancelar, $coductor_cancelar)
    {
        $factual = date('Y-m-d');
        $hactual = date('G:i:s');
        $user = $_SESSION["usuario"]["nom_usuario"];
        $stado_estudio = 'Cancelado';
        $stado = 'cancelado';
        $stado_actual = 1;
        $area = 'Operaciones';
        $estado_subasta = 'Inactivo';
        $proceso = 'Can_Sol_Rut';
        $estado_actual = 0;
        //vencer anterior
        if ($accion_actividad == 'Estudio de Seguridad') {
            $sql2 = $this->_db3->prepare("UPDATE cmx_estudiov_completo SET estado_actu=:estado_actual WHERE id_estudio=:id_solicitud");
            $sql2->bindParam(':estado_actual', $estado_actual, PDO::PARAM_STR);
            $sql2->bindParam(':id_solicitud', $numero_pre, PDO::PARAM_STR);
            $resultado2 = $sql2->execute();
            if ($resultado2) {
                $sql_insert_estudio_completo = $this->_db3->prepare("INSERT INTO cmx_estudiov_completo(id_estudio_c,id_estudio,estado,id_vehiculo,id_conductor,observacion,proceso,fecha,hora,usuario,estado_actu,estado_subasta)
                                                VALUES(:id_estudio_c,:id_estudio,:estado,:id_vehiculo,:id_conductor,:observacion,:proceso,:fecha,:hora,:usuario,:estado_actu,:estado_subasta)");
                $sql_insert_estudio_completo->bindParam(':id_estudio_c', $estudioc, PDO::PARAM_STR);
                $sql_insert_estudio_completo->bindParam(':id_estudio', $numero_pre, PDO::PARAM_STR);
                $sql_insert_estudio_completo->bindParam(':estado', $stado_estudio, PDO::PARAM_STR);
                $sql_insert_estudio_completo->bindParam(':id_vehiculo', $vehiculo_cancelar, PDO::PARAM_STR);
                $sql_insert_estudio_completo->bindParam(':id_conductor', $coductor_cancelar, PDO::PARAM_STR);
                $sql_insert_estudio_completo->bindParam(':observacion', $nota, PDO::PARAM_STR);
                $sql_insert_estudio_completo->bindParam(':proceso', $proceso, PDO::PARAM_STR);
                $sql_insert_estudio_completo->bindParam(':fecha', $factual, PDO::PARAM_STR);
                $sql_insert_estudio_completo->bindParam(':hora', $hactual, PDO::PARAM_STR);
                $sql_insert_estudio_completo->bindParam(':usuario', $user, PDO::PARAM_STR);
                $sql_insert_estudio_completo->bindParam(':estado_actu', $stado_actual, PDO::PARAM_STR);
                $sql_insert_estudio_completo->bindParam(':estado_subasta', $estado_subasta, PDO::PARAM_STR);
                $resultado_estudiov_completo = $sql_insert_estudio_completo->execute();
                if ($resultado_estudiov_completo) {
                    /* insertar en la tabla vitacora para el estudoi cancelado o anulado */
                    $sql_insert = $this->_db3->prepare("INSERT INTO cmx_anulaciones_estudios (operacion,placa,numero,motivo,accion,nota,fecha,hora,usuario)VALUES(:operacion,:placa,:numero,:motivo,:accion,:nota,:fecha,:hora,:usuario)");
                    $sql_insert->bindParam(':operacion', $accion_actividad, PDO::PARAM_STR);
                    $sql_insert->bindParam(':placa', $placa, PDO::PARAM_STR);
                    $sql_insert->bindParam(':numero', $numero_pre, PDO::PARAM_STR);
                    $sql_insert->bindParam(':motivo', $motivo, PDO::PARAM_STR);
                    $sql_insert->bindParam(':accion', $stado_estudio, PDO::PARAM_STR);
                    $sql_insert->bindParam(':nota', $nota, PDO::PARAM_STR);
                    $sql_insert->bindParam(':fecha', $factual, PDO::PARAM_STR);
                    $sql_insert->bindParam(':hora', $hactual, PDO::PARAM_STR);
                    $sql_insert->bindParam(':usuario', $user, PDO::PARAM_STR);
                    $resultado_trazabilidad = $sql_insert->execute();
                    if ($resultado_trazabilidad) {
                        return $resultado_trazabilidad;
                    } else {
                        $mensajeError = "transaccion fallo:ingreso estado nuevo";
                        $er = error_log($mensajeError, 3, "error_log.txt");
                        return json_encode($er);
                    }
                } else {
                    $mensajeError = "transaccion fallo:ingreso estado nuevo";
                    $er = error_log($mensajeError, 3, "error_log.txt");
                    return json_encode($er);
                }
            } else {
                $mensajeError = "transaccion fallo: en update estado";
                $er = error_log($mensajeError, 3, "error_log.txt");
            }
        } else {
            $sql2 = $this->_db3->prepare("UPDATE cmx_solicitudes_estados SET estado_actual=:estado_actual WHERE id_solicitud=:id_solicitud");
            $sql2->bindParam(':estado_actual', $estado_actual, PDO::PARAM_STR);
            $sql2->bindParam(':id_solicitud', $numero_pre, PDO::PARAM_STR);
            $resultado2 = $sql2->execute();
            if ($resultado2) {
                //registrar nuevo estado
                $sql = $this->_db3->prepare("INSERT INTO cmx_solicitudes_estados (id,estado,id_solicitud,fecha,hora,usuario,estado_actual,area) VALUES(null,:estado,:preestudio,:fecha,:hora,:usuario,:estado_actual,:area)");
                $sql->bindParam(':preestudio', $numero_pre, PDO::PARAM_STR);
                $sql->bindParam(':estado', $stado, PDO::PARAM_STR);
                $sql->bindParam(':fecha', $factual, PDO::PARAM_STR);
                $sql->bindParam(':hora', $hactual, PDO::PARAM_STR);
                $sql->bindParam(':usuario', $user, PDO::PARAM_STR);
                $sql->bindParam(':estado_actual', $stado_actual, PDO::PARAM_STR);
                $sql->bindParam(':area', $area, PDO::PARAM_STR);
                $resultado = $sql->execute();
                if ($resultado) {
                    /* insertar en la tabla vitacora para el estudoi cancelado o anulado */
                    $sql_insert = $this->_db3->prepare("INSERT INTO cmx_anulaciones_estudios (operacion,placa,numero,motivo,accion,nota,fecha,hora,usuario)VALUES(:operacion,:placa,:numero,:motivo,:accion,:nota,:fecha,:hora,:usuario)");
                    $sql_insert->bindParam(':operacion', $accion_actividad, PDO::PARAM_STR);
                    $sql_insert->bindParam(':placa', $placa, PDO::PARAM_STR);
                    $sql_insert->bindParam(':numero', $numero_pre, PDO::PARAM_STR);
                    $sql_insert->bindParam(':motivo', $motivo, PDO::PARAM_STR);
                    $sql_insert->bindParam(':accion', $stado, PDO::PARAM_STR);
                    $sql_insert->bindParam(':nota', $nota, PDO::PARAM_STR);
                    $sql_insert->bindParam(':fecha', $factual, PDO::PARAM_STR);
                    $sql_insert->bindParam(':hora', $hactual, PDO::PARAM_STR);
                    $sql_insert->bindParam(':usuario', $user, PDO::PARAM_STR);
                    $resultado_trazabilidad = $sql_insert->execute();
                    if ($resultado_trazabilidad) {
                        return $resultado;
                    } else {
                        $mensajeError = "transaccion fallo:ingreso estado nuevo";
                        $er = error_log($mensajeError, 3, "error_log.txt");
                        return json_encode($er);
                    }
                } else {
                    $mensajeError = "transaccion fallo:ingreso estado nuevo";
                    $er = error_log($mensajeError, 3, "error_log.txt");
                    return json_encode($er);
                }
            } else {
                $mensajeError = "transaccion fallo: en update estado";
                $er = error_log($mensajeError, 3, "error_log.txt");
                return json_encode($er);
            }
        }
    }

    public function Validar_hojas_de_vida($datos)
    {
        $response = [];
        if ($datos["propietario_trailer"] == "" && $datos["trailer"] == "No aplica") {
            $sql = $this->_db3->prepare("SELECT * FROM cmx_proveedores WHERE numero_documento IN (:dconductor, :dpropietario, :dtenedor)");
            $sql->bindParam(':dconductor', $datos["conductor"], PDO::PARAM_STR);
            $sql->bindParam(':dpropietario', $datos["propietario"], PDO::PARAM_STR);
            $sql->bindParam(':dtenedor', $datos["tenedor"], PDO::PARAM_STR);
            $sql->execute();
            $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);

            // if (count($resultados) == 3) { // Verificar si se encontraron todas las filas buscadas
            if ($resultados) { // Verificar si se encontraron todas las filas buscadas
                $sql_placa = $this->_db3->prepare("SELECT * FROM cmx_vehiculos WHERE placa=:placa");
                $sql_placa->bindParam(':placa', $datos["placa"], PDO::PARAM_STR);
                $sql_placa->execute();
                $resultados_placas = $sql_placa->fetch(PDO::FETCH_ASSOC);

                if ($resultados_placas) {
                    $estado_token = 'Cerrado';
                    $sql_update_estado_token = $this->_db3->prepare("UPDATE cmx_solicitudes_estados SET estado_token=:Estado_T WHERE token=:token AND id_solicitud=:solicitud AND estado_token='Activo'");
                    $sql_update_estado_token->bindParam(':Estado_T', $estado_token, PDO::PARAM_STR);
                    $sql_update_estado_token->bindParam(':token', $datos['token'], PDO::PARAM_STR);
                    $sql_update_estado_token->bindParam(':solicitud', $datos['numsoli'], PDO::PARAM_STR);
                    $sql_update_estado_token->execute();
                    $response = array(
                        'numero' => 200,
                        'mensaje' => 'Datos Verificados Correctamente, Generar Solicitud de estudio para la placa <strong>' . $datos['placa'] . '</strong>',
                    );
                } else {
                    $response = array(
                        'numero' => 400,
                        'mensaje' => 'Faltan Hojas de vida por diligenciar',
                    );
                }
            } else {
                $response = array(
                    'numero' => 400,
                    'mensaje' => 'Faltan Hojas de vida por diligenciar',
                );
            }
        } else {
            // echo "Hola Mundo";
            $sql = $this->_db3->prepare("SELECT * FROM cmx_proveedores WHERE numero_documento IN (:dconductor, :dpropietario, :dtenedor,:dpropietario_trailer)");
            $sql->bindParam(':dconductor', $datos["conductor"], PDO::PARAM_STR);
            $sql->bindParam(':dpropietario', $datos["propietario"], PDO::PARAM_STR);
            $sql->bindParam(':dtenedor', $datos["tenedor"], PDO::PARAM_STR);
            $sql->bindParam(':dpropietario_trailer', $datos["propietario_trailer"], PDO::PARAM_STR);
            $sql->execute();
            $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);

            // if (count($resultados) == 3) { // Verificar si se encontraron todas las filas buscadas
            if ($resultados) { // Verificar si se encontraron todas las filas buscadas
                /* Validar el trailer */
                $sql_trailer = $this->_db3->prepare("SELECT * FROM cmx_trailer WHERE placa=:placa_trailer");
                $sql_trailer->bindParam(':placa_trailer', $datos["trailer"], PDO::PARAM_STR);
                $sql_trailer->execute();
                $resultados_placa_trailer = $sql_trailer->fetch(PDO::FETCH_ASSOC);
                if ($resultados_placa_trailer) {
                    $sql_placa = $this->_db3->prepare("SELECT * FROM cmx_vehiculos WHERE placa=:placa");
                    $sql_placa->bindParam(':placa', $datos["placa"], PDO::PARAM_STR);
                    $sql_placa->execute();
                    $resultados_placas = $sql_placa->fetch(PDO::FETCH_ASSOC);
                    if ($resultados_placas) {
                        $estado_token = 'Cerrado';
                        $sql_update_estado_token = $this->_db3->prepare("UPDATE cmx_solicitudes_estados SET estado_token=:Estado_T WHERE token=:token AND id_solicitud=:solicitud AND estado_token='Activo'");
                        $sql_update_estado_token->bindParam(':Estado_T', $estado_token, PDO::PARAM_STR);
                        $sql_update_estado_token->bindParam(':token', $datos['token'], PDO::PARAM_STR);
                        $sql_update_estado_token->bindParam(':solicitud', $datos['numsoli'], PDO::PARAM_STR);
                        $sql_update_estado_token->execute();
                        $response = array(
                            'numero' => 200,
                            'mensaje' => 'Datos Verificados Correctamente, Generar Solicitud de estudio para la placa <strong>' . $datos['placa'] . '</strong>',
                        );
                    } else {
                        $response = array(
                            'numero' => 400,
                            'mensaje' => 'Faltan Hojas de vida por diligenciar',
                        );
                    }
                } else {
                    $response = array(
                        'numero' => 400,
                        'mensaje' => 'Faltan Hojas de vida por diligenciar',
                    );
                }
            } else {
                $response = array(
                    'numero' => 400,
                    'mensaje' => 'Faltan Hojas de vida por diligenciar',
                );
            }
        }
        return $response;
    }

    public function Validar_hojas_de_vida_nuevo_recurso($datos)
    {
        $response = [];
        if (($datos['propietario'] != "Sin Datos" && $datos['tenedor'] != "Sin Datos" && $datos['conductor'] != "Sin Datos") && $datos['Propietario_Trailer'] != "Sin Datos") {

            $combinaciones = [
                'Propietario_Trailer' => ['propietario', 'tenedor', 'conductor'],
                '' => ['propietario', 'tenedor'],
                '' => ['propietario', 'conductor'],
                '' => ['tenedor', 'conductor'],
                '' => ['propietario'],
                '' => ['tenedor'],
                '' => ['conductor']
            ];

            foreach ($combinaciones as $actividad => $campos) {
                $valido = true;
                $documento = null;

                foreach ($campos as $campo) {
                    if ($datos[$campo] == "Sin Datos") {
                        $valido = false;
                        break;
                    }
                    if (is_null($documento)) {
                        $documento = $datos[$campo];
                    } else if ($documento != $datos[$campo]) {
                        $valido = false;
                        break;
                    }
                }

                if ($valido) {
                    $sql = $this->_db3->prepare("SELECT * FROM cmx_proveedores p INNER JOIN cmx_actividad_proveedor acp ON p.numdoc_nexos=acp.id_proveedor WHERE numero_documento=:Documento");
                    $sql->bindParam(':Documento', $documento, PDO::PARAM_STR);
                    $sql->execute();
                    $resultado = $sql->fetch(PDO::FETCH_ASSOC);
                    if ($resultado) {
                        /* Actualizar los el estado de los proveedores nuevos */
                        $sql_update = $this->_db3->prepare("UPDATE cmx_prefiltro_actualizar SET estado_creacion='TERCERO CREADO' WHERE id_solicitud_u=:id_solicitud");
                        $sql_update->bindParam(':id_solicitud', $datos['estudio'], PDO::PARAM_STR);
                        $sql_update->execute();
                        if ($sql_update) {
                            $response = true;
                        } else {
                            $response = false;
                        }
                    } else {
                        $response = false;
                    }

                    break;
                }
            }
        } else if ($datos['propietario'] != "Sin Datos" && $datos['tenedor'] != "Sin Datos" && $datos['conductor'] == "Sin Datos" && $datos['Propietario_Trailer'] == "Sin Datos") {
            $sql = $this->_db3->prepare("SELECT * FROM cmx_proveedores WHERE numero_documento IN (:dpropietario, :dtenedor)");
            $sql->bindParam(':dpropietario', $datos["propietario"], PDO::PARAM_STR);
            $sql->bindParam(':dtenedor', $datos["tenedor"], PDO::PARAM_STR);
            $sql->execute();
            $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
            if ($resultados) {
                /* Actualizar los el estado de los proveedores nuevos */
                $sql_update = $this->_db3->prepare("UPDATE cmx_prefiltro_actualizar SET estado_creacion='TERCERO CREADO' WHERE id_solicitud_u=:id_solicitud");
                $sql_update->bindParam(':id_solicitud', $datos['estudio'], PDO::PARAM_STR);
                $sql_update->execute();
                if ($sql_update) {
                    $response = true;
                } else {
                    $response = false;
                }
            } else {
                $response = false;
            }
            // $response = !empty($resultados);
        } else if ($datos['propietario'] != "Sin Datos" && $datos['conductor'] != "Sin Datos" && $datos['tenedor'] == "Sin Datos" && $datos['Propietario_Trailer'] == "Sin Datos") {
            $sql = $this->_db3->prepare("SELECT * FROM cmx_proveedores WHERE numero_documento IN (:dpropietario, :dconductor)");
            $sql->bindParam(':dpropietario', $datos["propietario"], PDO::PARAM_STR);
            $sql->bindParam(':dconductor', $datos["conductor"], PDO::PARAM_STR);
            $sql->execute();
            $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
            if ($resultados) {
                /* Actualizar los el estado de los proveedores nuevos */
                $sql_update = $this->_db3->prepare("UPDATE cmx_prefiltro_actualizar SET estado_creacion='TERCERO CREADO' WHERE id_solicitud_u=:id_solicitud");
                $sql_update->bindParam(':id_solicitud', $datos['estudio'], PDO::PARAM_STR);
                $sql_update->execute();
                if ($sql_update) {
                    $response = true;
                } else {
                    $response = false;
                }
            } else {
                $response = false;
            }
            // $response = !empty($resultados);
        } else if ($datos['tenedor'] != "Sin Datos" && $datos['conductor'] != "Sin Datos" && $datos['propietario'] == "Sin Datos" && $datos['Propietario_Trailer'] == "Sin Datos") {
            $sql = $this->_db3->prepare("SELECT * FROM cmx_proveedores WHERE numero_documento IN (:dtenedor, :dconductor)");
            $sql->bindParam(':dtenedor', $datos["tenedor"], PDO::PARAM_STR);
            $sql->bindParam(':dconductor', $datos["conductor"], PDO::PARAM_STR);
            $sql->execute();
            $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
            if ($resultados) {
                /* Actualizar los el estado de los proveedores nuevos */
                $sql_update = $this->_db3->prepare("UPDATE cmx_prefiltro_actualizar SET estado_creacion='TERCERO CREADO' WHERE id_solicitud_u=:id_solicitud");
                $sql_update->bindParam(':id_solicitud', $datos['estudio'], PDO::PARAM_STR);
                $sql_update->execute();
                if ($sql_update) {
                    $response = true;
                } else {
                    $response = false;
                }
            } else {
                $response = false;
            }
            // $response = !empty($resultados);
        } elseif ($datos['propietario'] != "Sin Datos" && $datos['tenedor'] == "Sin Datos" && $datos['conductor'] == "Sin Datos" && $datos['Propietario_Trailer'] == "Sin Datos") {
            // Realizar la consulta utilizando solo propietario
            $actividad = 'Propietario Vehiculo';
            $sql = $this->_db3->prepare("SELECT * FROM cmx_proveedores p INNER JOIN cmx_actividad_proveedor acp ON p.numdoc_nexos=acp.id_proveedor WHERE numero_documento=:Documento AND acp.actividad=:actividad");
            $sql->bindParam(':Documento', $datos['propietario'], PDO::PARAM_STR);
            $sql->bindParam(':actividad', $actividad, PDO::PARAM_STR);
            $sql->execute();
            $resultado = $sql->fetch(PDO::FETCH_ASSOC);
            if ($resultado) {
                /* Actualizar los el estado de los proveedores nuevos */
                $sql_update = $this->_db3->prepare("UPDATE cmx_prefiltro_actualizar SET estado_creacion='TERCERO CREADO' WHERE id_solicitud_u=:id_solicitud");
                $sql_update->bindParam(':id_solicitud', $datos['estudio'], PDO::PARAM_STR);
                $sql_update->execute();
                if ($sql_update) {
                    $response = true;
                } else {
                    $response = false;
                }
            } else {
                $response = false;
            }
            // Código de consulta para solo propietario
        } elseif ($datos['tenedor'] != "Sin Datos" && $datos['propietario'] == "Sin Datos" && $datos['conductor'] == "Sin Datos" && $datos['Propietario_Trailer'] == "Sin Datos") {
            // Realizar la consulta utilizando solo tenedor
            $actividad = 'Poseedor Vehiculo';
            $sql = $this->_db3->prepare("SELECT * FROM cmx_proveedores p INNER JOIN cmx_actividad_proveedor acp ON p.numdoc_nexos=acp.id_proveedor WHERE numero_documento=:Documento AND acp.actividad=:actividad");
            $sql->bindParam(':Documento', $datos['propietario'], PDO::PARAM_STR);
            $sql->bindParam(':actividad', $actividad, PDO::PARAM_STR);
            $sql->execute();
            $resultado = $sql->fetch(PDO::FETCH_ASSOC);
            if ($resultado) {
                // $response = true;
                /* Actualizar los el estado de los proveedores nuevos */
                $sql_update = $this->_db3->prepare("UPDATE cmx_prefiltro_actualizar SET estado_creacion='TERCERO CREADO' WHERE id_solicitud_u=:id_solicitud");
                $sql_update->bindParam(':id_solicitud', $datos['estudio'], PDO::PARAM_STR);
                $sql_update->execute();
                $resultado_update = $sql_update->fetch(PDO::FETCH_ASSOC);
                if ($resultado_update) {
                    $response = true;
                } else {
                    $response = false;
                }
            } else {
                $response = false;
            }
            // Código de consulta para solo tenedor
        } elseif ($datos['conductor'] != "Sin Datos" && $datos['tenedor'] == "Sin Datos" && $datos['propietario'] == "Sin Datos"  && $datos['Propietario_Trailer'] == "Sin Datos") {
            // Realizar la consulta utilizando solo conductor
            $actividad = 'Conductor';
            $sql = $this->_db3->prepare("SELECT * FROM cmx_proveedores p INNER JOIN cmx_actividad_proveedor acp ON p.numdoc_nexos=acp.id_proveedor WHERE numero_documento=:Documento AND acp.actividad=:actividad");
            $sql->bindParam(':Documento', $datos['conductor'], PDO::PARAM_STR);
            $sql->bindParam(':actividad', $actividad, PDO::PARAM_STR);
            $sql->execute();
            $resultado = $sql->fetch(PDO::FETCH_ASSOC);
            if ($resultado) {
                /* Actualizar los el estado de los proveedores nuevos */
                $sql_update = $this->_db3->prepare("UPDATE cmx_prefiltro_actualizar SET estado_creacion='TERCERO CREADO' WHERE id_solicitud_u=:id_solicitud");
                $sql_update->bindParam(':id_solicitud', $datos['estudio'], PDO::PARAM_STR);
                $sql_update->execute();
                if ($sql_update) {
                    $response = true;
                } else {
                    $response = false;
                }
            } else {
                $response = false;
            }
            // Código de consulta para solo conductor
        } elseif ($datos['Propietario_Trailer'] != "Sin Datos" && $datos['propietario'] == "Sin Datos" && $datos['tenedor'] == "Sin Datos" && $datos['conductor'] == "Sin Datos") {
            // Realizar la consulta utilizando solo conductor
            $actividad = 'Propietario Trailer';
            $sql = $this->_db3->prepare("SELECT * FROM cmx_proveedores p INNER JOIN cmx_actividad_proveedor acp ON p.numdoc_nexos=acp.id_proveedor WHERE numero_documento=:Documento AND acp.actividad=:actividad");
            $sql->bindParam(':Documento', $datos['Propietario_Trailer'], PDO::PARAM_STR);
            $sql->bindParam(':actividad', $actividad, PDO::PARAM_STR);
            $sql->execute();
            $resultado = $sql->fetch(PDO::FETCH_ASSOC);
            if ($resultado) {
                /* Actualizar los el estado de los proveedores nuevos */
                $sql_update = $this->_db3->prepare("UPDATE cmx_prefiltro_actualizar SET estado_creacion='TERCERO CREADO' WHERE id_solicitud_u=:id_solicitud");
                $sql_update->bindParam(':id_solicitud', $datos['estudio'], PDO::PARAM_STR);
                $sql_update->execute();
                if ($sql_update) {
                    $response = true;
                } else {
                    $response = false;
                }
            } else {
                $response = false;
            }
            // Código de consulta para solo conductor
        } else if ($datos['propietario'] == "Sin Datos" && $datos['tenedor'] == "Sin Datos" && $datos['conductor'] != "Sin Datos" && $datos['Propietario_Trailer'] != "Sin Datos") {
            // En caso de que ninguno de los campos esté lleno
            // Manejo de caso en el que ningún campo está lleno

            $sql = $this->_db3->prepare("SELECT * FROM cmx_proveedores WHERE numero_documento IN (:dpropietariotrailer, :dconductor)");
            $sql->bindParam(':dpropietariotrailer', $datos["Propietario_Trailer"], PDO::PARAM_STR);
            $sql->bindParam(':dconductor', $datos["conductor"], PDO::PARAM_STR);
            $sql->execute();
            $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
            if ($resultados) {
                /* Actualizar los el estado de los proveedores nuevos */
                $sql_update = $this->_db3->prepare("UPDATE cmx_prefiltro_actualizar SET estado_creacion='TERCERO CREADO' WHERE id_solicitud_u=:id_solicitud");
                $sql_update->bindParam(':id_solicitud', $datos['estudio'], PDO::PARAM_STR);
                $sql_update->execute();
                if ($sql_update) {
                    $response = true;
                } else {
                    $response = false;
                }
            } else {
                $response = false;
            }
        } else if ($datos['propietario'] != "Sin Datos" && $datos['tenedor'] != "Sin Datos" && $datos['conductor'] != "Sin Datos" && $datos['Propietario_Trailer'] == "Sin Datos") {
            $sql = $this->_db3->prepare("SELECT * FROM cmx_proveedores WHERE numero_documento IN (:dpropietario, :dtenedor,:dconductor)");
            $sql->bindParam(':dpropietario', $datos["propietario"], PDO::PARAM_STR);
            $sql->bindParam(':dtenedor', $datos["tenedor"], PDO::PARAM_STR);
            $sql->bindParam(':dconductor', $datos["conductor"], PDO::PARAM_STR);
            $sql->execute();
            $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
            if ($resultados) {
                /* Actualizar los el estado de los proveedores nuevos */
                $sql_update = $this->_db3->prepare("UPDATE cmx_prefiltro_actualizar SET estado_creacion='TERCERO CREADO' WHERE id_solicitud_u=:id_solicitud");
                $sql_update->bindParam(':id_solicitud', $datos['estudio'], PDO::PARAM_STR);
                $sql_update->execute();
                if ($sql_update) {
                    $response = true;
                } else {
                    $response = false;
                }
            } else {
                $response = false;
            }
        }
        return $response;
    }

    public function Guardar_estudio_seguridad($datos)
    {
        $empresa_id = $_SESSION['usuario']['empresa_id'];
        try {
            $this->_db3->beginTransaction();
            $sql = $this->_db3->prepare("SELECT * FROM cmx_log_solicitudvehiculo2 WHERE id_solictud=:solicitud AND placa=:placa");
            $sql->bindParam(':solicitud', $datos["preestudio"], PDO::PARAM_STR);
            $sql->bindParam(':placa', $datos["placa"], PDO::PARAM_STR);
            $resultado = $sql->execute();
            $resultado = $sql->fetch(PDO::FETCH_ASSOC);
            if ($resultado) {
                $response = array(
                    'numero' => 400,
                    'mensaje' => 'Ya existe una solicitud de estudio de seguridad para la placa <strong>' . $datos['placa'] . '</strong>.',
                );
                return $response;
            } else {
                // Consultar maestro de Estudio de seguridad cabecera
                $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='EST_SEG_CAB' AND numero_actual>numero_inicial");
                $resultado_consecutivo = $sql_consecutivo->execute();
                $resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
                $numdoc_cabecera = $resultado_consecutivo['numero_actual'];
                $numdoc_actualizar_cabecera = $resultado_consecutivo['numero_actual'] + 1;

                if ($numdoc_cabecera) {
                    // Actualizar Maestro de Estudio segurdad cabecera
                    $sql_updata_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numdoc_actualizar_cabecera WHERE tipo='EST_SEG_CAB'");
                    $resultado_consecutivo_update_cabecera = $sql_updata_maestro->execute();
                    if ($resultado_consecutivo_update_cabecera) {
                        $estado = null;
                        $estado_solo = null;
                        $estado_ruta = 'Pendiente';
                        $estado_actu = 1;
                        $sql_insert = $this->_db3->prepare("INSERT INTO cmx_log_solicitudvehiculo2(id,id_solictud,placa,user_log,fecha_asignacion,hora_asignacion,estado,estado_solo,proceso,estado_ruta,estado_actu)
                        VALUES(:id,:solicitud,:placa,:usuario,:fecha,:hora,:estado,:estado_solo,:proceso,:estado_ruta,:estado_actu)");
                        $sql_insert->bindParam(':id', $numdoc_cabecera, PDO::PARAM_STR);
                        $sql_insert->bindParam(':solicitud', $datos["preestudio"], PDO::PARAM_STR);
                        $sql_insert->bindParam(':placa', $datos["placa"], PDO::PARAM_STR);
                        $sql_insert->bindParam(':usuario', $datos["usuario"], PDO::PARAM_STR);
                        $sql_insert->bindParam(':fecha', $datos["fecha"], PDO::PARAM_STR);
                        $sql_insert->bindParam(':hora', $datos["hora"], PDO::PARAM_STR);
                        $sql_insert->bindParam(':estado', $estado, PDO::PARAM_STR);
                        $sql_insert->bindParam(':estado_solo', $estado_solo, PDO::PARAM_STR);
                        $sql_insert->bindParam(':proceso', $datos['proceso'], PDO::PARAM_STR);
                        $sql_insert->bindParam(':estado_ruta', $estado_ruta, PDO::PARAM_STR);
                        $sql_insert->bindParam(':estado_actu', $estado_actu, PDO::PARAM_STR);
                        $resultado_insert = $sql_insert->execute();
                        if ($resultado_insert) {
                            // Consultar maestro de Estudio de seguridad
                            $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='EST_SEG' AND numero_actual>numero_inicial");
                            $resultado_consecutivo = $sql_consecutivo->execute();
                            $resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
                            $numdoc = $resultado_consecutivo['numero_actual'];
                            $numdoc_actualizar = $resultado_consecutivo['numero_actual'] + 1;

                            if ($numdoc) {
                                // Actualizar Maestro de Estudio segurdad
                                $sql_updata_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numdoc_actualizar WHERE tipo='EST_SEG'");
                                $resultado_consecutivo_update = $sql_updata_maestro->execute();
                                if ($resultado_consecutivo_update) {
                                    $null = null;
                                    $operacion_evolucion = "Nuevo";
                                    $viaje_itr = 1;
                                    $sql_insert_estudio_vh = $this->_db3->prepare("INSERT INTO cmx_estudio_vehiculo(id_estudio,id_solicitud,observacion_vehiculo,observacion_conductor,observacion_tenedor,observacion_general,usuario,fecha,hora,operacion,placa,fecha_respuesta,hora_respuesta,viaje_itr,itr,responsable,empresa_id)
                                    VALUES(:id_estudio,:id_solicitud,:observacion_vehiculo,:observacion_conductor,:observacion_tenedor,:observacion_general,:usuario,:fecha,:hora,:operacion,:placa,:fecha_respuesta,:hora_respuesta,:viaje_itr,:itr,:responsable,:empresa_id)");
                                    $sql_insert_estudio_vh->bindParam(':id_estudio', $numdoc, PDO::PARAM_STR);
                                    $sql_insert_estudio_vh->bindParam(':id_solicitud', $numdoc_cabecera, PDO::PARAM_STR);
                                    $sql_insert_estudio_vh->bindParam(':observacion_vehiculo', $null, PDO::PARAM_STR);
                                    $sql_insert_estudio_vh->bindParam(':observacion_conductor', $null, PDO::PARAM_STR);
                                    $sql_insert_estudio_vh->bindParam(':observacion_tenedor', $null, PDO::PARAM_STR);
                                    $sql_insert_estudio_vh->bindParam(':observacion_general', $datos['observacion_prefiltro'], PDO::PARAM_STR);
                                    $sql_insert_estudio_vh->bindParam(':usuario', $datos["usuario"], PDO::PARAM_STR);
                                    $sql_insert_estudio_vh->bindParam(':fecha', $datos["fecha"], PDO::PARAM_STR);
                                    $sql_insert_estudio_vh->bindParam(':hora', $datos["hora"], PDO::PARAM_STR);
                                    $sql_insert_estudio_vh->bindParam(':operacion', $operacion_evolucion, PDO::PARAM_STR);
                                    $sql_insert_estudio_vh->bindParam(':placa', $datos["placa"], PDO::PARAM_STR);
                                    $sql_insert_estudio_vh->bindParam(':fecha_respuesta', $datos["fecha_respuesta"], PDO::PARAM_STR);
                                    $sql_insert_estudio_vh->bindParam(':hora_respuesta', $datos["hora"], PDO::PARAM_STR);
                                    $sql_insert_estudio_vh->bindParam(':viaje_itr', $viaje_itr, PDO::PARAM_STR);
                                    $sql_insert_estudio_vh->bindParam(':itr', $datos["proceso_prefiltro_itr"], PDO::PARAM_STR);
                                    $sql_insert_estudio_vh->bindParam(':responsable', $datos['responsable_vehiculo'], PDO::PARAM_STR);
                                    $sql_insert_estudio_vh->bindParam(':empresa_id', $empresa_id, PDO::PARAM_STR);
                                    $resultado_insert_estudio_vh = $sql_insert_estudio_vh->execute();
                                    if ($resultado_insert_estudio_vh) {
                                        // Consultar maestro de Estudio de seguridad Completo
                                        $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='EST_SEG_COMP' AND numero_actual>numero_inicial");
                                        $resultado_consecutivo_completo = $sql_consecutivo->execute();
                                        $resultado_consecutivo_completo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
                                        $numdoc_completo = $resultado_consecutivo_completo['numero_actual'];
                                        $numdoc_actualizar_completo = $resultado_consecutivo_completo['numero_actual'] + 1;
                                        if ($numdoc_completo) {
                                            $sql_updata_maestro_completo = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numdoc_actualizar_completo WHERE tipo='EST_SEG_COMP'");
                                            $resultado_consecutivo_update_completo = $sql_updata_maestro_completo->execute();
                                            if ($resultado_consecutivo_update_completo) {
                                                $estado_estudio_seguridad = "pendiente_iniciar";
                                                $estado_actu = 1;
                                                $estado_subasta = "Activo";
                                                $observacion = null;
                                                $proceso = "Pen_Sol_Rut";
                                                $sql_conductor_vehiculo = $this->_db3->prepare("SELECT id, id_conductor,numdoc_vehiculo FROM cmx_vehiculos WHERE placa=:placa");
                                                $sql_conductor_vehiculo->bindParam(':placa', $datos["placa"], PDO::PARAM_STR);
                                                $resultado = $sql_conductor_vehiculo->execute();
                                                $resultado = $sql_conductor_vehiculo->fetch(PDO::FETCH_ASSOC);
                                                $sql_insert_estudio_completo = $this->_db3->prepare("INSERT INTO cmx_estudiov_completo(id_estudio_c,id_estudio,estado,id_vehiculo,id_conductor,observacion,proceso,fecha,hora,usuario,estado_actu,estado_subasta)
                                                VALUES(:id_estudio_c,:id_estudio,:estado,:id_vehiculo,:id_conductor,:observacion,:proceso,:fecha,:hora,:usuario,:estado_actu,:estado_subasta)");
                                                $sql_insert_estudio_completo->bindParam(':id_estudio_c', $numdoc_completo, PDO::PARAM_STR);
                                                $sql_insert_estudio_completo->bindParam(':id_estudio', $numdoc, PDO::PARAM_STR);
                                                $sql_insert_estudio_completo->bindParam(':estado', $estado_estudio_seguridad, PDO::PARAM_STR);
                                                $sql_insert_estudio_completo->bindParam(':id_vehiculo', $resultado["numdoc_vehiculo"], PDO::PARAM_STR);
                                                $sql_insert_estudio_completo->bindParam(':id_conductor', $resultado["id_conductor"], PDO::PARAM_STR);
                                                $sql_insert_estudio_completo->bindParam(':observacion', $observacion, PDO::PARAM_STR);
                                                $sql_insert_estudio_completo->bindParam(':proceso', $proceso, PDO::PARAM_STR);
                                                $sql_insert_estudio_completo->bindParam(':fecha', $datos["fecha"], PDO::PARAM_STR);
                                                $sql_insert_estudio_completo->bindParam(':hora', $datos["hora"], PDO::PARAM_STR);
                                                $sql_insert_estudio_completo->bindParam(':usuario', $datos["usuario"], PDO::PARAM_STR);
                                                $sql_insert_estudio_completo->bindParam(':estado_actu', $estado_actu, PDO::PARAM_STR);
                                                $sql_insert_estudio_completo->bindParam(':estado_subasta', $estado_subasta, PDO::PARAM_STR);
                                                $resultado_estudiov_completo = $sql_insert_estudio_completo->execute();
                                                if ($resultado_estudiov_completo) {
                                                    $estado_log = "Crear";
                                                    $sql_insert_log = $this->_db3->prepare("INSERT INTO cmx_logestudio_com(id_completo,id_estudio,fecha,hora,id_usuario,estado)
                                                    VALUES(:id_completo,:id_estudio,:fecha,:hora,:id_usuario,:estado)");
                                                    $sql_insert_log->bindParam(':id_completo', $numdoc_completo, PDO::PARAM_STR);
                                                    $sql_insert_log->bindParam(':id_estudio', $numdoc, PDO::PARAM_STR);
                                                    $sql_insert_log->bindParam(':fecha', $datos["fecha"], PDO::PARAM_STR);
                                                    $sql_insert_log->bindParam(':hora', $datos["hora"], PDO::PARAM_STR);
                                                    $sql_insert_log->bindParam(':id_usuario', $datos["usuario"], PDO::PARAM_STR);
                                                    $sql_insert_log->bindParam(':estado', $estado_log, PDO::PARAM_STR);
                                                    $resultado_estudio_log = $sql_insert_log->execute();
                                                    if ($resultado_estudio_log) {
                                                        $tipo = 'P';
                                                        $sql_foreach = $this->_db3->prepare("SELECT id_servicio_cliente FROM cmx_preestudio_solicitudes_servicio
                                                        WHERE id_solicitudpreestudio=:id_preestudio AND clasificacion=:tipologia");
                                                        $sql_foreach->bindParam(':id_preestudio', $datos["preestudio"]);
                                                        $sql_foreach->bindParam(':tipologia', $tipo);
                                                        $sql_foreach->execute();
                                                        if ($sql_foreach) {
                                                            $resultado_consulta = $sql_foreach->fetchall(PDO::FETCH_ASSOC);
                                                            foreach ($resultado_consulta as $key => $value) {
                                                                $p = 'E';
                                                                $estss = 1;
                                                                $sqlss = $this->_db3->prepare("INSERT INTO cmx_preestudio_solicitudes_servicio(id,id_servicio_cliente,id_solicitudpreestudio,fecha,hora,usuario,es,clasificacion)
                                                                VALUES(null,:servicio,:idsolicitud,:fecha,:hora,:usuario,:es,:p)");
                                                                $sqlss->bindParam(':servicio', $value['id_servicio_cliente']);
                                                                $sqlss->bindParam(':idsolicitud', $numdoc);
                                                                $sqlss->bindParam(':fecha', $datos['fecha']);
                                                                $sqlss->bindParam(':hora', $datos['hora']);
                                                                $sqlss->bindParam(':usuario', $datos["usuario"]);
                                                                $sqlss->bindParam(':es', $estss);
                                                                $sqlss->bindParam(':p', $p);
                                                                $resultado_solicitudes_servicio = $sqlss->execute();
                                                            }
                                                            if ($resultado_solicitudes_servicio) {
                                                                foreach ($resultado_consulta as $key => $value) {
                                                                    $estado_log = 'asignada';
                                                                    $sqlo = $this->_db3->prepare("INSERT INTO cmx_log_solicitudvehiculo(id,id_solictud,user_log,fecha_asignacion,hora_asignacion,estado)
                                                                        VALUES(null,:servicio,:usuario,:fecha,:hora,:statu)");
                                                                    $sqlo->bindParam(':servicio', $value['id_servicio_cliente']);
                                                                    $sqlo->bindParam(':usuario', $datos["usuario"]);
                                                                    $sqlo->bindParam(':fecha', $datos['fecha']);
                                                                    $sqlo->bindParam(':hora', $datos['hora']);
                                                                    $sqlo->bindParam(':statu', $estado_log);
                                                                    $resultado_log = $sqlo->execute();
                                                                }
                                                                if ($resultado_log) { //actualizar subasta temporal
                                                                    $sqlsu = $this->_db3->prepare("UPDATE cmx_subasta_temporal SET numero_estudio=:num_estudio WHERE numero_estudio=:preestudio_num");
                                                                    $sqlsu->bindParam(':preestudio_num', $datos["preestudio"]);
                                                                    $sqlsu->bindParam(':num_estudio', $numdoc);
                                                                    $resultado_sub = $sqlsu->execute();
                                                                    if ($resultado_sub) {
                                                                        $this->_db3->commit();
                                                                        $response = array(
                                                                            'numero' => 200,
                                                                            'mensaje' => 'Solicitud de estudio para la placa <strong>' . $datos['placa'] . '</strong> resgistrada exitosamente.',
                                                                        );
                                                                        return $response;
                                                                    } else {
                                                                        $this->_db3->commit();
                                                                        $response = array(
                                                                            'numero' => 400,
                                                                            'mensaje' => 'No se puedo actualizar la subasta temp para la placa <strong>' . $datos['placa'] . '</strong>',
                                                                        );
                                                                        return $response;
                                                                    }
                                                                } else {
                                                                    $response = array(
                                                                        'numero' => 400,
                                                                        'mensaje' => 'No se puedo registrar la solicitud para operaciones de la placa <strong>' . $datos['placa'] . '</strong>',
                                                                    );
                                                                    return $response;
                                                                }
                                                            } else {
                                                                $response = array(
                                                                    'numero' => 400,
                                                                    'mensaje' => 'No se puedo resgistrar la solicitud de servicio para la placa <strong>' . $datos['placa'] . '</strong>',
                                                                );
                                                                return $response;
                                                            }
                                                            //}//foreach
                                                        } else {
                                                            $response = array(
                                                                'numero' => 400,
                                                                'mensaje' => 'No consulto solicitudes de servicio para la placa <strong>' . $datos['placa'] . '</strong>',
                                                            );
                                                            return $response;
                                                        }
                                                    } else {
                                                        $response = array(
                                                            'numero' => 400,
                                                            'mensaje' => 'No se puedo resgistrar la solicitud de estudio para la placa <strong>' . $datos['placa'] . '</strong>',
                                                        );
                                                        return $response;
                                                    }
                                                } else {
                                                    $response = array(
                                                        'numero' => 400,
                                                        'mensaje' => 'No se puedo resgistrar la solicitud de estudio para la placa <strong>' . $datos['placa'] . '</strong>',
                                                    );
                                                    $mensajeError = "transaccion fallo: insertar estado completo vehiculo";
                                                    $er = error_log($mensajeError, 3, "error_log.txt");
                                                }
                                            } else {
                                                $mensajeError = "transaccion fallo: en Actualizar maestro estudio seguridad completo";
                                                $er = error_log($mensajeError, 3, "error_log.txt");
                                                return json_encode($er);
                                            }
                                        } else {
                                            $mensajeError = "transaccion fallo: en solicitar maestro estudio seguridad completo";
                                            $er = error_log($mensajeError, 3, "error_log.txt");
                                            return json_encode($er);
                                        }
                                    } else {
                                        $response = array(
                                            'numero' => 400,
                                            'mensaje' => 'No se puedo resgistrar la solicitud de estudio para la placa <strong>' . $datos['placa'] . '</strong>',
                                        );
                                        $mensajeError = "transaccion fallo: insertar estudio vehiculo";
                                        $er = error_log($mensajeError, 3, "error_log.txt");
                                    }
                                } else {
                                    $mensajeError = "transaccion fallo: en Actualizar maestro estudio seguridad";
                                    $er = error_log($mensajeError, 3, "error_log.txt");
                                    return json_encode($er);
                                }
                            } else {
                                $mensajeError = "transaccion fallo: en solicitar maestro estudio seguridad";
                                $er = error_log($mensajeError, 3, "error_log.txt");
                                return json_encode($er);
                            }
                        } else {
                            $response = array(
                                'numero' => 400,
                                'mensaje' => 'No se puedo resgistrar la solicitud de estudio para la placa <strong>' . $datos['placa'] . '</strong>',
                            );
                        }
                    } else {
                        $mensajeError = "transaccion fallo: en Actualizar maestro estudio seguridad";
                        $er = error_log($mensajeError, 3, "error_log.txt");
                        return json_encode($er);
                    }
                } else {
                    $mensajeError = "transaccion fallo: en solicitar maestro estudio seguridad";
                    $er = error_log($mensajeError, 3, "error_log.txt");
                    return json_encode($er);
                }
            }
        } catch (\Throwable $th) {
            // Si ocurre algún error, deshacemos la transacción
            $this->_db3->rollBack();
            echo "Error en la transacción: " . $th->getMessage();
        }
    }

    public function Consulta_preestudio($placa)
    {

        try {

            $sql = $this->_db3->prepare("SELECT v.placa, t.placa AS placa_trailer,
							v.web_satelital, v.usuario_satelital,
							v.clave_satelital, v.id_conductor,
							pro.nombre AS nombre_propietario,
							pro.numero_documento AS documento_propietario,
							pro.subir_licencia, pro.n_docu_licencia,
							te.nombre AS nombre_tenedor,
							te.numero_documento AS documento_tenedor,
							co.nombre AS nombre_conductor,
							co.numero_documento AS documento_conductor,
							prot.nombre AS nombre_propietario_trailer,
							prot.numero_documento AS documento_propietario_trailer,
							dc.id AS id_detacondu,
							dc.documento_eps, dc.n_docu_eps,
							dc.documento_arl, dc.n_docu_arl,
							dc.carnet_curso, dc.n_docu_curso,
							dc.documento_rut, dc.n_docu_rut,
							vv.capacidad_tn,
							pro.apellido1 AS proape1, pro.apellido2 AS proape2,
							te.apellido1 AS teape1, te.apellido2 AS teape2,
							co.apellido1 AS coape1, co.apellido2 AS coape2,
							prot.apellido1 AS protape1, prot.apellido2 AS protape2
                            FROM cmx_vehiculos v
                            INNER JOIN cmx_proveedores pro ON v.id_propietario=pro.numdoc_nexos
                            INNER JOIN cmx_proveedores te ON v.id_tenedor=te.numdoc_nexos
                            INNER JOIN cmx_proveedores co ON v.id_conductor=co.numdoc_nexos
                            INNER JOIN cmx_detalle_conductor dc ON v.id_conductor=dc.id_proveedor
                            INNER JOIN cmx_vehiculo2 vv ON v.numdoc_vehiculo=vv.id_vehiculo
                            LEFT JOIN cmx_trailer_vehiculo tra ON v.numdoc_vehiculo=tra.id_vehiculo
                            LEFT JOIN cmx_trailer t ON tra.id_trailer=t.numdoc_trailer
                            LEFT JOIN cmx_proveedores prot ON t.doc_propietario=prot.numdoc_nexos
                            WHERE v.placa=:placa_vehicular");
            $sql->bindParam(':placa_vehicular', $placa, PDO::PARAM_STR);
            $sql->execute();
            $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);

            return $resultado;
        } catch (\Throwable $th) {

            $this->_db3->rollBack();

            echo "Error en la transacción: " . $th->getMessage();
        }
    }

    public function Consulta_Referencia($placa)
    {
        try {

            $sql = $this->_db3->prepare("SELECT r.* FROM cmx_vehiculos v INNER JOIN cmx_proveedores p ON v.id_conductor=p.numdoc_nexos

				INNER JOIN cmx_referencias_preestudio r ON p.numero_documento=r.id_conductor WHERE v.placa=:placa_vehicular");

            $sql->bindParam(':placa_vehicular', $placa, PDO::PARAM_STR);

            $sql->execute();

            $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);

            return $resultado;
        } catch (\Throwable $th) {

            $this->_db3->rollBack();

            echo "Error en la transacción: " . $th->getMessage();
        }
    }

    public function Consulta_Referencia_Personal($placa)
    {
        try {
            $sql = $this->_db3->prepare("SELECT pe.* FROM cmx_vehiculos v
			INNER JOIN cmx_proveedores p ON v.id_conductor=p.numdoc_nexos
			INNER JOIN cmx_referencias_personales pe ON p.numdoc_nexos=pe.id_conductor WHERE v.placa=:placa_vehicular");
            $sql->bindParam(':placa_vehicular', $placa, PDO::PARAM_STR);
            $sql->execute();
            $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
            return $resultado;
        } catch (\Throwable $th) {
            $this->_db3->rollBack();
            echo "Error en la transacción: " . $th->getMessage();
        }
    }

    // Inicio de estudio de seguridad
    public function Inicio_de_estudio_de_seguridad($datos)
    {

        $user = $_SESSION["usuario"]["nom_usuario"];

        $estado_log = "Crear";

        $sql_update = $this->_db3->prepare("UPDATE cmx_estudiov_completo SET estado_actu=0 WHERE id_estudio=:id_estudio");

        $sql_update->bindParam(':id_estudio', $datos['numsoli']);

        $resultado_update = $sql_update->execute();

        if ($resultado_update) {

            // Validar si hay restro de estudio de seguridad

            $sql2 = $this->_db3->prepare("INSERT INTO cmx_estudiov_completo(id,id_estudio_c,id_estudio,estado,id_vehiculo,id_conductor,observacion,proceso,fecha,hora,usuario,estado_actu,estado_subasta)

			VALUES(null,:id_estudio_c,:id_estudio,:estado,:vehiculo,:conductor,:observacion,:proceso,:fecha,:hora,:usuario,:estado_actu,:estado_subasta)");

            $sql2->bindParam(':id_estudio_c', $datos['estudio_id_c']);

            $sql2->bindParam(':id_estudio', $datos['numsoli']);

            $sql2->bindParam(':estado', $datos['estado']);

            $sql2->bindParam(':vehiculo', $datos['id_vehiculo']);

            $sql2->bindParam(':conductor', $datos['id_conductor']);

            $sql2->bindParam(':observacion', $datos['observacion']);

            $sql2->bindParam(':proceso', $datos['proceso']);

            $sql2->bindParam(':fecha', $datos['fecha']);

            $sql2->bindParam(':hora', $datos['hora']);

            $sql2->bindParam(':usuario', $user);

            $sql2->bindParam(':estado_actu', $datos['estado_actual']);

            $sql2->bindParam(':estado_subasta', $datos['estado_subasta']);

            $resultado = $sql2->execute();

            if ($resultado) {

                $sql3 = $this->_db3->prepare(" INSERT INTO cmx_logestudio_com (id,id_completo,id_estudio,fecha,hora,id_usuario,estado) VALUES (null,:id_completo,:id_estudio,:fecha,:hora,:id_usuario,:estado)");

                $sql3->bindParam(':id_completo', $datos['estudio_id_c']);

                $sql3->bindParam(':id_estudio', $datos['numsoli']);

                $sql3->bindParam(':fecha', $datos['fecha']);

                $sql3->bindParam(':hora', $datos['hora']);

                $sql3->bindParam(':id_usuario', $user);

                $sql3->bindParam(':estado', $estado_log);

                $resultado_log = $sql3->execute();

                if ($resultado_log) {

                    $response = array(

                        'numero' => 200,

                        'mensaje' => 'Estudio de seguridad iniciado correctamente con el numero <strong>' . $datos['estudio_id_c'] . '</strong>',

                    );
                } else {

                    $response = array(

                        'numero' => 400,

                        'mensaje' => 'Estudio de seguridad no iniciado',

                    );
                }

                return $response;
            } else {

                $mensajeError = "No inserto en la tabla de estudio completo.";

                error_log($mensajeError, 3, "error_log.txt");
            }
        } else {

            $mensajeError = "No actualizo es estado actual del estudio de seguridad.";

            error_log($mensajeError, 3, "error_log.txt");
        }
    }

    //Funcion para validar si la placa esta en un estudio o no por algun error generado

    // public function Buscar_placa_estudios($placa) {}

    public function Insert_estudio($datos, $datos_nuevos)
    {
        // $placas_insert = $datos['placa'];
        $empresa_session_id = $_SESSION['usuario']['empresa_id'];
        $response = [];
        try {
            $this->_db3->beginTransaction();
            //obtener id de agrupacion
            $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo = :tipo AND numero_actual > numero_inicial AND empresa_id=:empresa_id");
            $sql_consecutivo->execute([
                ':tipo' => 'AGRU_SS',
                ':empresa_id' => $empresa_session_id
            ]);

            $resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
            $numdoc_agru = $resultado_consecutivo['numero_actual'] ?? 0;
            $numero_agrupacion = $numdoc_agru + 1;

            //consulta la solicitud de servicio
            $solicitudes_servicio = $datos["solicitudes"];
            foreach ($solicitudes_servicio as $value) {
                $sql_consecutivo2 = $this->_db3->prepare("SELECT solicitud_servicio FROM cmx_consolidacion_solicitudes WHERE solicitud_servicio=$value");
                $resultado_consecutivo = $sql_consecutivo2->execute();
                $total = $sql_consecutivo2->rowCount();
                if ($total == 0) {
                    //insertar agrupacion de solicitudes
                    if ($numdoc_agru) {
                        $sql_update_maestro = $this->_db3->prepare("UPDATE cmx_maestro  SET numero_actual=:numero_actual WHERE tipo=:tipo AND empresa_id=:empresa_id");
                        $resultado_consecutivo_update = $sql_update_maestro->execute([
                            ':numero_actual' => $numero_agrupacion,
                            ':tipo' => 'AGRU_SS',
                            ':empresa_id' => $empresa_session_id
                        ]);

                        if ($resultado_consecutivo_update) {
                            foreach ($solicitudes_servicio as $value) {
                                $sql_agrupacion = $this->_db3->prepare("INSERT INTO cmx_consolidacion_solicitudes(id,solicitud_servicio,agrupacion) VALUES(null,:id_servicio,:agrupacion)");
                                $sql_agrupacion->bindParam(':id_servicio', $value);
                                $sql_agrupacion->bindParam(':agrupacion', $numdoc_agru);
                                $resultado_agrupacion = $sql_agrupacion->execute();
                            }

                            if ($resultado_agrupacion) {
                                //insertar habilitar y actualizar
                                // Consultar maestro de Estudio de seguridad
                                $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo=:tipo AND numero_actual > numero_inicial  AND empresa_id=:empresa_id");
                                $sql_consecutivo->execute([
                                    ':tipo' => 'EST_SEG',
                                    ':empresa_id' => $empresa_session_id
                                ]);
                                $resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
                                $numdoc = $resultado_consecutivo['numero_actual'] ?? 0;
                                $numdoc_actualizar = $numdoc + 1;

                                if ($numdoc) {
                                    // Actualizar Maestro de Estudio segurdad
                                    $sql_update_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=:numdoc_actualizar WHERE tipo=:tipo AND empresa_id=:empresa_id");
                                    $resultado_consecutivo_update = $sql_update_maestro->execute([
                                        ':numdoc_actualizar' => $numdoc_actualizar,
                                        ':tipo' => 'EST_SEG',
                                        ':empresa_id' => $empresa_session_id
                                    ]);

                                    if ($resultado_consecutivo_update) {
                                        $null = null;
                                        $viaje = null;
                                        $itr = 'NO';
                                        $sql_insert_estudio_vh = $this->_db3->prepare("INSERT INTO cmx_estudio_vehiculo(id_estudio,id_solicitud,observacion_vehiculo,observacion_conductor,observacion_tenedor,observacion_general,usuario,fecha,hora,operacion,placa,viaje_itr,itr,responsable,empresa_id)
                                                                                VALUES(:id_estudio,:id_solicitud,:observacion_vehiculo,:observacion_conductor,:observacion_tenedor,:observacion_general,:usuario,:fecha,:hora,:operacion,:placa,:viaje_itr,:itr,:responsable,:empresa_id)");
                                        $sql_insert_estudio_vh->bindParam(':id_estudio', $numdoc, PDO::PARAM_STR);
                                        $sql_insert_estudio_vh->bindParam(':id_solicitud', $numdoc_cabecera, PDO::PARAM_STR);
                                        $sql_insert_estudio_vh->bindParam(':observacion_vehiculo', $null, PDO::PARAM_STR);
                                        $sql_insert_estudio_vh->bindParam(':observacion_conductor', $null, PDO::PARAM_STR);
                                        $sql_insert_estudio_vh->bindParam(':observacion_tenedor', $null, PDO::PARAM_STR);
                                        $sql_insert_estudio_vh->bindParam(':observacion_general', $datos['observacion'], PDO::PARAM_STR);
                                        $sql_insert_estudio_vh->bindParam(':usuario', $datos["usuario"], PDO::PARAM_STR);
                                        $sql_insert_estudio_vh->bindParam(':fecha', $datos["fecha"], PDO::PARAM_STR);
                                        $sql_insert_estudio_vh->bindParam(':hora', $datos["hora"], PDO::PARAM_STR);
                                        $sql_insert_estudio_vh->bindParam(':operacion', $datos["tipo_operacion"], PDO::PARAM_STR);
                                        $sql_insert_estudio_vh->bindParam(':placa', $datos["placa"], PDO::PARAM_STR);
                                        $sql_insert_estudio_vh->bindParam(':viaje_itr', $viaje, PDO::PARAM_STR);
                                        $sql_insert_estudio_vh->bindParam(':itr', $itr, PDO::PARAM_STR);
                                        $sql_insert_estudio_vh->bindParam(':responsable', $datos['responsable_vehiculo'], PDO::PARAM_STR);
                                        $sql_insert_estudio_vh->bindParam(':empresa_id', $datos['empresa_cliente'], PDO::PARAM_STR);
                                        $resultado_insert_estudio_vh = $sql_insert_estudio_vh->execute();
                                        if ($resultado_insert_estudio_vh) {
                                            // Consultar maestro de Estudio de seguridad Completo
                                            $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo=:tipo AND numero_actual > numero_inicial AND empresa_id=:empresa_id");
                                            $sql_consecutivo->execute([
                                                ':tipo' => 'EST_SEG_COMP',
                                                ':empresa_id' => $empresa_session_id
                                            ]);

                                            $resultado_consecutivo_completo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
                                            $numdoc_completo = $resultado_consecutivo_completo['numero_actual'] ?? 0;
                                            $numdoc_actualizar_completo = $numdoc_completo + 1;

                                            if ($numdoc_completo) {
                                                $sql_updata_maestro_completo = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=:numdoc_actualizar WHERE tipo=:tipo AND empresa_id=:empresa_id");

                                                $resultado_consecutivo_update_completo = $sql_updata_maestro_completo->execute([
                                                    ':numdoc_actualizar' => $numdoc_actualizar_completo,
                                                    ':tipo' => 'EST_SEG_COMP',
                                                    ':empresa_id' => $empresa_session_id
                                                ]);

                                                if ($resultado_consecutivo_update_completo) {
                                                    $estado_estudio_seguridad = "pendiente_iniciar";
                                                    $estado_actu = 1;
                                                    $estado_subasta = "Activo";
                                                    $observacion = null;
                                                    $proceso = "Pen_Sol_Rut";
                                                    $sql_conductor_vehiculo = $this->_db3->prepare("SELECT id, id_conductor,numdoc_vehiculo FROM cmx_vehiculos WHERE placa=:placa");
                                                    $sql_conductor_vehiculo->bindParam(':placa', $datos["placa"], PDO::PARAM_STR);
                                                    $resultado = $sql_conductor_vehiculo->execute();
                                                    $resultado = $sql_conductor_vehiculo->fetch(PDO::FETCH_ASSOC);
                                                    $sql_insert_estudio_completo = $this->_db3->prepare("INSERT INTO cmx_estudiov_completo(id_estudio_c,id_estudio,estado,id_vehiculo,id_conductor,observacion,proceso,fecha,hora,usuario,estado_actu,estado_subasta)
                                                    VALUES(:id_estudio_c,:id_estudio,:estado,:id_vehiculo,:id_conductor,:observacion,:proceso,:fecha,:hora,:usuario,:estado_actu,:estado_subasta)");
                                                    $sql_insert_estudio_completo->bindParam(':id_estudio_c', $numdoc_completo, PDO::PARAM_STR);
                                                    $sql_insert_estudio_completo->bindParam(':id_estudio', $numdoc, PDO::PARAM_STR);
                                                    $sql_insert_estudio_completo->bindParam(':estado', $estado_estudio_seguridad, PDO::PARAM_STR);
                                                    $sql_insert_estudio_completo->bindParam(':id_vehiculo', $resultado["numdoc_vehiculo"], PDO::PARAM_STR);
                                                    $sql_insert_estudio_completo->bindParam(':id_conductor', $resultado["id_conductor"], PDO::PARAM_STR);
                                                    $sql_insert_estudio_completo->bindParam(':observacion', $datos['observacion'], PDO::PARAM_STR);
                                                    $sql_insert_estudio_completo->bindParam(':proceso', $proceso, PDO::PARAM_STR);
                                                    $sql_insert_estudio_completo->bindParam(':fecha', $datos["fecha"], PDO::PARAM_STR);
                                                    $sql_insert_estudio_completo->bindParam(':hora', $datos["hora"], PDO::PARAM_STR);
                                                    $sql_insert_estudio_completo->bindParam(':usuario', $datos["usuario"], PDO::PARAM_STR);
                                                    $sql_insert_estudio_completo->bindParam(':estado_actu', $estado_actu, PDO::PARAM_STR);
                                                    $sql_insert_estudio_completo->bindParam(':estado_subasta', $estado_subasta, PDO::PARAM_STR);
                                                    $resultado_estudiov_completo = $sql_insert_estudio_completo->execute();
                                                    if ($resultado_estudiov_completo) {
                                                        $estado_log = "Crear";
                                                        $sql_insert_log = $this->_db3->prepare("INSERT INTO cmx_logestudio_com(id_completo,id_estudio,fecha,hora,id_usuario,estado) 
                                                        VALUES(:id_completo,:id_estudio,:fecha,:hora,:id_usuario,:estado)");
                                                        $sql_insert_log->bindParam(':id_completo', $numdoc_completo, PDO::PARAM_STR);
                                                        $sql_insert_log->bindParam(':id_estudio', $numdoc, PDO::PARAM_STR);
                                                        $sql_insert_log->bindParam(':fecha', $datos["fecha"], PDO::PARAM_STR);
                                                        $sql_insert_log->bindParam(':hora', $datos["hora"], PDO::PARAM_STR);
                                                        $sql_insert_log->bindParam(':id_usuario', $datos["usuario"], PDO::PARAM_STR);
                                                        $sql_insert_log->bindParam(':estado', $estado_log, PDO::PARAM_STR);
                                                        $resultado_estudio_log = $sql_insert_log->execute();
                                                        if ($resultado_estudio_log) {
                                                            //registrar solicitudes de servicio
                                                            $estss = 1;
                                                            $p = 'E';
                                                            $solicitudes = $datos["solicitudes"];
                                                            foreach ($solicitudes as $value) {
                                                                $sqlss = $this->_db3->prepare("INSERT INTO cmx_preestudio_solicitudes_servicio(id,id_servicio_cliente,id_solicitudpreestudio,fecha,hora,usuario,es,clasificacion) 
                                                                VALUES(null,:servicio,:idsolicitud,:fecha,:hora,:usuario,:es,:p)");
                                                                $sqlss->bindParam(':servicio', $value);
                                                                $sqlss->bindParam(':idsolicitud', $numdoc);
                                                                $sqlss->bindParam(':fecha', $datos['fecha']);
                                                                $sqlss->bindParam(':hora', $datos['hora']);
                                                                $sqlss->bindParam(':usuario', $datos["usuario"]);
                                                                $sqlss->bindParam(':es', $estss);
                                                                $sqlss->bindParam(':p', $p);
                                                                $resultado_solicitudes_servicio = $sqlss->execute();
                                                            }
                                                            if ($resultado_solicitudes_servicio) {
                                                                foreach ($solicitudes as $value) {
                                                                    $estado_log = 'asignada';
                                                                    $sqlo = $this->_db3->prepare("INSERT INTO cmx_log_solicitudvehiculo(id,id_solictud,user_log,fecha_asignacion,hora_asignacion,estado) 
                                                                    VALUES(null,:servicio,:usuario,:fecha,:hora,:statu)");
                                                                    $sqlo->bindParam(':servicio', $value);
                                                                    $sqlo->bindParam(':usuario', $datos["usuario"]);
                                                                    $sqlo->bindParam(':fecha', $datos['fecha']);
                                                                    $sqlo->bindParam(':hora', $datos['hora']);
                                                                    $sqlo->bindParam(':statu', $estado_log);
                                                                    $resultado_log = $sqlo->execute();
                                                                }
                                                                if ($resultado_log) {
                                                                    $valor = 0;
                                                                    $sql_subasta = $this->_db3->prepare("INSERT INTO cmx_subasta_temporal(id,fecha_inicio,numero_estudio,placa,flete,tarifa) 
                                                                    VALUES(null,:fechasu,:numerosu,:placa_su,:fletesu,:tarifasu)");
                                                                    $sql_subasta->bindParam(':fechasu', $datos["fecha"]);
                                                                    $sql_subasta->bindParam(':numerosu', $numdoc);
                                                                    $sql_subasta->bindParam(':placa_su', $datos["placa"]);
                                                                    $sql_subasta->bindParam(':fletesu', $datos["flete"]);
                                                                    $sql_subasta->bindParam(':tarifasu', $datos["tarifa"]);
                                                                    $resultado_subasta = $sql_subasta->execute();
                                                                    if ($resultado_subasta) {
                                                                        if ($datos["tipo_operacion"] == 'Actualizar') {
                                                                            if ($datos["dinamicos"] == "si") {
                                                                                $id_s = $numdoc;
                                                                                $papeles = $datos["papeles"];
                                                                                $archivos = $datos["archivos"];
                                                                                (int) $tol = count($archivos->tipohojahv);
                                                                                $ruta = 'public/files/seguridad_actualiza/' . $id_s . '/';
                                                                                if (!is_dir($ruta)) {
                                                                                    // Crear la carpeta
                                                                                    if ($papeles != "Sin_datos") {
                                                                                        // Crear la carpeta para los archivos si no existe
                                                                                        if (mkdir($ruta, 0777, true)) {
                                                                                            // Realizar inserciones en la base de datos
                                                                                            (int) $tol = count($archivos->tipohojahv);
                                                                                            for ($i = 0; $i < $tol; $i++) {
                                                                                                $inse_update = $this->_db3->prepare("INSERT INTO cmx_actualiza_seguridad(id_sol_prees,tipo_hv,tipo_campo,info_campo,fecha,hora,usuario,ruta_archivo,name_archivo)
                                                                                                VALUES(:solicitud, :tipohv, :campo, :dato, :fecha, :hora, :usuario, :ruta_archivo, :name_archivo)");
                                                                                                $inse_update->bindParam(':solicitud', $numdoc);
                                                                                                $inse_update->bindParam(':tipohv', $archivos->tipohojahv[$i]);
                                                                                                $inse_update->bindParam(':campo', $archivos->campos[$i]);
                                                                                                $inse_update->bindParam(':dato', $archivos->datos[$i]);
                                                                                                $inse_update->bindParam(':fecha', $datos['fecha']);
                                                                                                $inse_update->bindParam(':hora', $datos['hora']);
                                                                                                $inse_update->bindParam(':usuario', $datos["usuario"]);
                                                                                                $inse_update->bindParam(':ruta_archivo', $ruta);
                                                                                                $inse_update->bindParam(':name_archivo', $archivos->namearchivo[$i]);
                                                                                                $resultado_update = $inse_update->execute();
                                                                                            }

                                                                                            // Verificar que las inserciones en la base de datos se realizaron correctamente
                                                                                            if ($resultado_update) {
                                                                                                // Verificar si $papeles['name'] es un array (varios archivos)
                                                                                                if (is_array($papeles)) {
                                                                                                    foreach ($papeles['name'] as $key => $fileName) {
                                                                                                        $ruta_provisional = $papeles['tmp_name'][$key]; // Ruta temporal
                                                                                                        $carpeta = $ruta;
                                                                                                        $src = $carpeta . $fileName;

                                                                                                        // Intentar mover el archivo subido
                                                                                                        if (!move_uploaded_file($ruta_provisional, $src)) {
                                                                                                            // Si falla la subida, lanzar una excepción para detener el proceso
                                                                                                            throw new Exception("Error al subir el archivo: $fileName");
                                                                                                        }
                                                                                                    }
                                                                                                } else {
                                                                                                    // Si es un solo archivo
                                                                                                    $file = $papeles['name'];
                                                                                                    $ruta_provisional = $papeles['tmp_name'];
                                                                                                    $carpeta = $ruta;
                                                                                                    $src = $carpeta . $file;

                                                                                                    // Intentar mover el archivo subido
                                                                                                    if (!move_uploaded_file($ruta_provisional, $src)) {
                                                                                                        throw new Exception("Error al subir el archivo: $file");
                                                                                                    }
                                                                                                }

                                                                                                // Si todo ha ido bien, confirmar la transacción
                                                                                                // $this->_db3->commit();   
                                                                                                $response = [
                                                                                                    'numero' => 200,
                                                                                                    'mensaje' => 'Solicitud de estudio para la placa registrada exitosamente.',
                                                                                                ];
                                                                                            } else {
                                                                                                // Si las inserciones en la base de datos fallan, hacer rollback
                                                                                                // $this->_db3->rollback();
                                                                                                $response = [
                                                                                                    'numero' => 400,
                                                                                                    'mensaje' => 'No se pudo registrar los datos a actualizar para la placa.',
                                                                                                ];
                                                                                            }

                                                                                            // return $response;
                                                                                        } else {
                                                                                            // Si no se pudo crear la carpeta
                                                                                            $response = [
                                                                                                'numero' => 400,
                                                                                                'mensaje' => "No se pudo crear la carpeta.",
                                                                                            ];
                                                                                            // return $response;
                                                                                        }
                                                                                    } else {
                                                                                        (int) $tol = count($archivos->tipohojahv);
                                                                                        for ($i = 0; $i < count($archivos->tipohojahv); $i++) {
                                                                                            $inse_update = $this->_db3->prepare("INSERT INTO cmx_actualiza_seguridad(id_sol_prees,tipo_hv,tipo_campo,info_campo,fecha,hora,usuario,ruta_archivo,name_archivo)
                                                                                            VALUES(:solicitud,:tipohv,:campo,:dato,:fecha,:hora,:usuario,:ruta_archivo,:name_archivo)");
                                                                                            $inse_update->bindParam(':solicitud', $numdoc);
                                                                                            $inse_update->bindParam(':tipohv', $archivos->tipohojahv[$i]);
                                                                                            $inse_update->bindParam(':campo', $archivos->campos[$i]);
                                                                                            $inse_update->bindParam(':dato', $archivos->datos[$i]);
                                                                                            $inse_update->bindParam(':fecha', $datos['fecha']);
                                                                                            $inse_update->bindParam(':hora', $datos['hora']);
                                                                                            $inse_update->bindParam(':usuario', $datos["usuario"]);
                                                                                            $inse_update->bindParam(':ruta_archivo', $ruta);
                                                                                            $inse_update->bindParam(':name_archivo', $archivos->namearchivo[$i]);
                                                                                            $resultado_update = $inse_update->execute();
                                                                                        }
                                                                                        if ($resultado_update) {
                                                                                            // $this->_db3->commit();
                                                                                            $response = ['numero' => 200, 'mensaje' => 'Solicitud de estudio para la placa ' . $datos['placa'] . ' registrada exitosamente.'];
                                                                                            // return $response;
                                                                                        } else {
                                                                                            $response = [
                                                                                                'numero' => 400,
                                                                                                'mensaje' => 'No se puedo registrar los datos a actualizar para la placa',
                                                                                            ];
                                                                                        }
                                                                                    }
                                                                                } else {
                                                                                    //pasar el archivo
                                                                                    $total = count($papeles['name']);
                                                                                    for ($a = 0; $a < $total; $a++) {
                                                                                        if (isset($datos["papeles"])) {
                                                                                            $file = $papeles["name"][$a];
                                                                                            $tipo = $papeles["type"][$a];
                                                                                            $ruta_provisional = $papeles["tmp_name"][$a];
                                                                                            $carpeta = $ruta;
                                                                                            $src = $carpeta . $file;
                                                                                            move_uploaded_file($ruta_provisional, $src);
                                                                                        }
                                                                                    }
                                                                                    if ($resultado_subasta) {
                                                                                        // $this->_db3->commit();
                                                                                        $response = [
                                                                                            'numero' => 200,
                                                                                            'mensaje' => 'Solicitud de estudio para la placa  registrada exitosamente.',
                                                                                        ];
                                                                                        // return $response;
                                                                                    } else {
                                                                                        // $this->_db3->commit();
                                                                                        $response = [
                                                                                            'numero' => 400,
                                                                                            'mensaje' => 'No se puedo registrar los datos a actualizar para la placa',
                                                                                        ];
                                                                                        // return $response;
                                                                                    }
                                                                                }
                                                                            } else {
                                                                                /* Cuando se valla a unsertar un prefiltro para un nuevo recurso */
                                                                                $evalua_pro = $datos_nuevos["propietario_check"];
                                                                                $checkpro = ($evalua_pro == 'true') ? 1 : 0;
                                                                                $name_pro = $checkpro ? $datos_nuevos["nombre_propietario"] : null;
                                                                                $doc_pro = $checkpro ? $datos_nuevos["docu_propi"] : null;

                                                                                $evalua_pose = $datos_nuevos["tipo_posee"];
                                                                                $checkpose = ($evalua_pose == 'true') ? 1 : 0;
                                                                                $name_pose = $checkpose ? $datos_nuevos["nombre_poseedor"] : null;
                                                                                $doc_pose = $checkpose ? $datos_nuevos["docu_posee"] : null;

                                                                                $evalua_veh = $datos_nuevos["vehi_check"];
                                                                                $checkcarro = ($evalua_veh == 'true') ? 1 : 0;
                                                                                $placa_carro = $checkcarro ? $datos_nuevos["placa_vehiculo"] : null;
                                                                                $satelital = $checkcarro ? $datos_nuevos["satelital"] : null;
                                                                                $url_satelital = $checkcarro ? $datos_nuevos["url_satelital"] : null;
                                                                                $clave_satelital = $checkcarro ? $datos_nuevos["clave_satelital"] : null;

                                                                                $evalua_trai = $datos_nuevos["trailer_check"];
                                                                                $checktrai = ($evalua_trai == 'true') ? 1 : 0;
                                                                                $placa_trailer = $checktrai ? $datos_nuevos["placa_trailer"] : null;
                                                                                $pro_trailer = $checktrai ? $datos_nuevos["propi_trailer"] : null;
                                                                                $pro_doctrailer = $checktrai ? $datos_nuevos["propidoc_trailer"] : null;

                                                                                $evalua_condu = $datos_nuevos["conductor_check"];
                                                                                $checkcondu = ($evalua_condu == 'true') ? 1 : 0;
                                                                                $name_condu = $checkcondu ? $datos_nuevos["nombre_conductor"] : null;
                                                                                $docu_condu = $checkcondu ? $datos_nuevos["docu_condu"] : null;

                                                                                $referencias = [];
                                                                                for ($i = 1; $i <= 3; $i++) {
                                                                                    $referencias[] = [
                                                                                        'refe' => $checkcondu ? $datos_nuevos["refe$i"] : null,
                                                                                        'contacto' => $checkcondu ? $datos_nuevos["contacto$i"] : null,
                                                                                        'celular' => $checkcondu ? $datos_nuevos["celular$i"] : null,
                                                                                        'cargo' => $checkcondu ? $datos_nuevos["cargo$i"] : null,
                                                                                        'fecha1' => $checkcondu ? $datos_nuevos["fecha" . chr(96 + $i) . "1"] : null,
                                                                                        'fecha2' => $checkcondu ? $datos_nuevos["fecha" . chr(96 + $i) . "2"] : null,
                                                                                        'antiguedad' => $checkcondu ? $datos_nuevos["anti$i"] : null
                                                                                    ];
                                                                                }

                                                                                $query = "INSERT INTO cmx_prefiltro_actualizar 
                                                                                (id, id_solicitud_u, propietario, name_propietario, documento_propietario, poseedor, name_poseedor, documento_poseedor,
                                                                                    vehiculo, placa, satelital, clave_satelital, url_satelital, user_satelital, trailer, placa_trailer,
                                                                                    name_propietario_trailer, documento_propi_trailer, conductor, name_conductor, documento_conductor,
                                                                                    empresa1, persona1, cel1, cargo1, feca1, feca2, antiguedad1,
                                                                                    empresa2, persona2, cel2, cargo2, fecb1, fecb2, antiguedad2,
                                                                                    empresa3, persona3, cel3, cargo3, fecc1, fecc2, antiguedad3
                                                                                ) VALUES (null, :id_solicitud, :prop, :name_propi, :doc_propietario, :tene, :name_poseedor, :docpose,
                                                                                    :carro, :placa_carro, :satelite, :clave_sate, :url_satelite, :user_satelital, :trailercheck, :trailerplaca,
                                                                                    :nomprotrail, :docuproptrail, :conductor, :namecondu, :doccondu,
                                                                                    :ref1, :contacto1, :cel1, :cargo1, :feca1, :feca2, :antigue1,
                                                                                    :empresa2, :person2, :celu2, :cargo2, :fechab1, :fechab2, :anti2,
                                                                                    :empre3, :contacto3, :celu3, :cargo3, :fecc1, :fecc2, :anti3
                                                                                )";

                                                                                $this->_db3->prepare($query)->execute([
                                                                                    ':id_solicitud' => $numdoc,
                                                                                    ':prop' => $checkpro,
                                                                                    ':name_propi' => $name_pro,
                                                                                    ':doc_propietario' => $doc_pro,
                                                                                    ':tene' => $checkpose,
                                                                                    ':name_poseedor' => $name_pose,
                                                                                    ':docpose' => $doc_pose,
                                                                                    ':carro' => $checkcarro,
                                                                                    ':placa_carro' => $placa_carro,
                                                                                    ':satelite' => $satelital,
                                                                                    ':clave_sate' => $clave_satelital,
                                                                                    ':url_satelite' => $url_satelital,
                                                                                    ':user_satelital' => $clave_satelital,
                                                                                    ':trailercheck' => $checktrai,
                                                                                    ':trailerplaca' => $placa_trailer,
                                                                                    ':nomprotrail' => $pro_trailer,
                                                                                    ':docuproptrail' => $pro_doctrailer,
                                                                                    ':conductor' => $checkcondu,
                                                                                    ':namecondu' => $name_condu,
                                                                                    ':doccondu' => $docu_condu,
                                                                                    ':ref1' => $referencias[0]['refe'],
                                                                                    ':contacto1' => $referencias[0]['contacto'],
                                                                                    ':cel1' => $referencias[0]['celular'],
                                                                                    ':cargo1' => $referencias[0]['cargo'],
                                                                                    ':feca1' => $referencias[0]['fecha1'],
                                                                                    ':feca2' => $referencias[0]['fecha2'],
                                                                                    ':antigue1' => $referencias[0]['antiguedad'],
                                                                                    ':empresa2' => $referencias[1]['refe'],
                                                                                    ':person2' => $referencias[1]['contacto'],
                                                                                    ':celu2' => $referencias[1]['celular'],
                                                                                    ':cargo2' => $referencias[1]['cargo'],
                                                                                    ':fechab1' => $referencias[1]['fecha1'],
                                                                                    ':fechb2' => $referencias[1]['fecha2'],
                                                                                    ':anti2' => $referencias[1]['antiguedad'],
                                                                                    ':empre3' => $referencias[2]['refe'],
                                                                                    ':contacto3' => $referencias[2]['contacto'],
                                                                                    ':celu3' => $referencias[2]['celular'],
                                                                                    ':cargo3' => $referencias[2]['cargo'],
                                                                                    ':fecc1' => $referencias[2]['fecha1'],
                                                                                    ':fecc2' => $referencias[2]['fecha2'],
                                                                                    ':anti3' => $referencias[2]['antiguedad'],
                                                                                ]);

                                                                                // $this->_db3->commit();
                                                                                $response = [
                                                                                    'numero' => 200,
                                                                                    'mensaje' => 'Inserto prefiltro en actualizar registrado exitosamente.',
                                                                                ];
                                                                                // return $response;
                                                                            }
                                                                        } else {
                                                                            // $this->_db3->commit();
                                                                            $response = [
                                                                                'numero' => 200,
                                                                                'mensaje' => 'Solicitud de estudio para la placa registrada exitosamente.',
                                                                            ];
                                                                            // return $response;
                                                                        }
                                                                    } else {
                                                                        // $this->_db3->commit();
                                                                        $response = [
                                                                            'numero' => 400,
                                                                            'mensaje' => 'No se puedo registrar la asociacion de estudio para la placa',
                                                                        ];
                                                                        // return $response;
                                                                    }
                                                                } else {
                                                                    // $this->_db3->commit();
                                                                    $response = [
                                                                        'numero' => 400,
                                                                        'mensaje' => 'No se puedo registrar la subasta temporal de estudio para la placa',
                                                                    ];
                                                                    // return $response;
                                                                }
                                                            } else {
                                                                // $this->_db3->commit();
                                                                $response = [
                                                                    'numero' => 400,
                                                                    'mensaje' => 'No se puedo registrar log de ss con operaciones',
                                                                ];
                                                            }
                                                            // }
                                                        } else {
                                                            // $this->_db3->commit();
                                                            $response = [
                                                                'numero' => 400,
                                                                'mensaje' => 'No se puedo registrar la solicitud de estudio para la placa',
                                                            ];
                                                            // return $response;
                                                        }
                                                    } else {
                                                        $response = [
                                                            'numero' => 400,
                                                            'mensaje' => 'No se puedo resgistrar la solicitud de estudio para la placa',
                                                        ];
                                                        // $logFile = __DIR__ . "/logs/error_log_" . date("Y-m-d") . ".log"; // Log diario
                                                        $logFile = "error_log.txt"; // Definir el archivo de log
                                                        $mensajeError = "[" . date("Y-m-d H:i:s") . "] ERROR: Transacción falló al insertar vehículo. Usuario: " . $datos["usuario"];
                                                        error_log($mensajeError . PHP_EOL, 3, $logFile);
                                                    }
                                                } else {
                                                    $logFile = "error_log.txt"; // Definir el archivo de log
                                                    $mensajeError = "[" . date("Y-m-d H:i:s") . "] ERROR: Transacción falló en actualizar maestro estudio seguridad completo. Usuario: " . $datos["usuario"];
                                                    error_log($mensajeError . PHP_EOL, 3, $logFile);
                                                }
                                            } else {
                                                $logFile = "error_log.txt"; // Definir el archivo de log
                                                $mensajeError = "[" . date("Y-m-d H:i:s") . "] ERROR: Transacción falló en solicitar maestro estudio seguridad completo. Usuario: " . $datos["usuario"];
                                                error_log($mensajeError . PHP_EOL, 3, $logFile);
                                            }
                                        } else {
                                            $response = [
                                                'numero' => 400,
                                                'mensaje' => 'No se puedo resgistrar la solicitud de estudio para la placa',
                                            ];
                                            $logFile = "error_log.txt"; // Definir el archivo de log
                                            $mensajeError = "[" . date("Y-m-d H:i:s") . "] ERROR: Transacción falló en insertar estudio vehículo. Usuario: " . $datos["usuario"];
                                            error_log($mensajeError . PHP_EOL, 3, $logFile);
                                        }
                                    } else {
                                        $logFile = "error_log.txt"; // Definir el archivo de log
                                        $mensajeError = "[" . date("Y-m-d H:i:s") . "] ERROR: Transacción falló en actualizar maestro estudio seguridad. Usuario: " . $datos["usuario"];
                                        error_log($mensajeError . PHP_EOL, 3, $logFile);
                                    }
                                } else {
                                    $logFile = "error_log.txt"; // Definir el archivo de log
                                    $mensajeError = "[" . date("Y-m-d H:i:s") . "] ERROR: Transacción falló en solicitar maestro estudio seguridad. Usuario: " . $datos["usuario"];
                                    error_log($mensajeError . PHP_EOL, 3, $logFile);
                                }
                            } else {
                                // $this->_db3->commit();
                                $response = [
                                    'numero' => 400,
                                    'mensaje' => 'No se pudo registrar la consolidacion de solicitudes',
                                ];
                                // return $response;
                                $logFile = "error_log.txt"; // Definir el archivo de log
                                $mensajeError = "[" . date("Y-m-d H:i:s") . "] ERROR: No se pudo registrar la consolidacion de solicitudes. Usuario: " . $datos["usuario"];
                                error_log($mensajeError . PHP_EOL, 3, $logFile);
                            }
                        } else {
                            // $this->_db3->commit();
                            $response = [
                                'numero' => 400,
                                'mensaje' => 'No actualizo maestro para la agrupacion',
                            ];
                            // return $response;
                            $logFile = "error_log.txt"; // Definir el archivo de log
                            $mensajeError = "[" . date("Y-m-d H:i:s") . "] ERROR: No actualizo maestro para la agrupacion. Usuario: " . $datos["usuario"];
                            error_log($mensajeError . PHP_EOL, 3, $logFile);
                        }
                    }
                } else {
                    //insertar habilitar y actualizar
                    // Consultar maestro de Estudio de seguridad
                    $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo=:tipo AND numero_actual > numero_inicial  AND empresa_id=:empresa_id");
                    $sql_consecutivo->execute([
                        ':tipo' => 'EST_SEG',
                        ':empresa_id' => $empresa_session_id
                    ]);
                    $resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
                    $numdoc = $resultado_consecutivo['numero_actual'] ?? 0;
                    $numdoc_actualizar = $numdoc + 1;

                    if ($numdoc) {
                        // Actualizar Maestro de Estudio segurdad
                        $sql_update_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=:numdoc_actualizar WHERE tipo=:tipo AND empresa_id=:empresa_id");
                        $resultado_consecutivo_update = $sql_update_maestro->execute([
                            ':numdoc_actualizar' => $numdoc_actualizar,
                            ':tipo' => 'EST_SEG',
                            ':empresa_id' => $empresa_session_id
                        ]);

                        if ($resultado_consecutivo_update) {
                            $null = null;
                            $viaje = null;
                            $itr = 'NO';

                            $sql_insert_estudio_vh = $this->_db3->prepare("INSERT INTO cmx_estudio_vehiculo(id_estudio,id_solicitud,observacion_vehiculo,observacion_conductor,observacion_tenedor,observacion_general,usuario,fecha,hora,operacion,placa,viaje_itr,itr,responsable,empresa_id)
                            VALUES(:id_estudio,:id_solicitud,:observacion_vehiculo,:observacion_conductor,:observacion_tenedor,:observacion_general,:usuario,:fecha,:hora,:operacion,:placa,:viaje_itr,:itr,:responsable,:empresa_id)");
                            $sql_insert_estudio_vh->bindParam(':id_estudio', $numdoc, PDO::PARAM_STR);
                            $sql_insert_estudio_vh->bindParam(':id_solicitud', $numdoc_cabecera, PDO::PARAM_STR);
                            $sql_insert_estudio_vh->bindParam(':observacion_vehiculo', $null, PDO::PARAM_STR);
                            $sql_insert_estudio_vh->bindParam(':observacion_conductor', $null, PDO::PARAM_STR);
                            $sql_insert_estudio_vh->bindParam(':observacion_tenedor', $null, PDO::PARAM_STR);
                            $sql_insert_estudio_vh->bindParam(':observacion_general', $datos['observacion'], PDO::PARAM_STR);
                            $sql_insert_estudio_vh->bindParam(':usuario', $datos["usuario"], PDO::PARAM_STR);
                            $sql_insert_estudio_vh->bindParam(':fecha', $datos["fecha"], PDO::PARAM_STR);
                            $sql_insert_estudio_vh->bindParam(':hora', $datos["hora"], PDO::PARAM_STR);
                            $sql_insert_estudio_vh->bindParam(':operacion', $datos["tipo_operacion"], PDO::PARAM_STR);
                            $sql_insert_estudio_vh->bindParam(':placa', $datos["placa"], PDO::PARAM_STR);
                            $sql_insert_estudio_vh->bindParam(':viaje_itr', $viaje, PDO::PARAM_STR);
                            $sql_insert_estudio_vh->bindParam(':itr', $itr, PDO::PARAM_STR);
                            $sql_insert_estudio_vh->bindParam(':responsable', $datos['responsable_vehiculo'], PDO::PARAM_STR);
                            $sql_insert_estudio_vh->bindParam(':empresa_id', $empresa_id, PDO::PARAM_STR);
                            $resultado_insert_estudio_vh = $sql_insert_estudio_vh->execute();

                            if ($resultado_insert_estudio_vh) {
                                // Consultar maestro de Estudio de seguridad Completo
                                $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo=:tipo AND numero_actual > numero_inicial AND empresa_id=:empresa_id");
                                $sql_consecutivo->execute([
                                    ':tipo' => 'EST_SEG_COMP',
                                    ':empresa_id' => $empresa_session_id
                                ]);
                                $resultado_consecutivo_completo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
                                $numdoc_completo = $resultado_consecutivo_completo['numero_actual'] ?? 0;
                                $numdoc_actualizar_completo = $numdoc_completo + 1;

                                if ($numdoc_completo) {
                                    $sql_updata_maestro_completo = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=:numdoc_actualizar WHERE tipo=:tipo AND empresa_id=:empresa_id");
                                    $resultado_consecutivo_update_completo = $sql_updata_maestro_completo->execute([
                                        ':numdoc_actualizar' => $numdoc_actualizar_completo,
                                        ':tipo' => 'EST_SEG_COMP',
                                        ':empresa_id' => $empresa_session_id
                                    ]);

                                    if ($resultado_consecutivo_update_completo) {

                                        $estado_estudio_seguridad = "pendiente_iniciar";
                                        $estado_actu = 1;
                                        $estado_subasta = "Activo";
                                        $observacion = null;
                                        $proceso = "Pen_Sol_Rut";

                                        $sql_conductor_vehiculo = $this->_db3->prepare("SELECT id, id_conductor,numdoc_vehiculo FROM cmx_vehiculos WHERE placa=:placa");
                                        $sql_conductor_vehiculo->bindParam(':placa', $datos["placa"], PDO::PARAM_STR);
                                        $resultado = $sql_conductor_vehiculo->execute();
                                        $resultado = $sql_conductor_vehiculo->fetch(PDO::FETCH_ASSOC);

                                        $sql_insert_estudio_completo = $this->_db3->prepare("INSERT INTO cmx_estudiov_completo(id_estudio_c,id_estudio,estado,id_vehiculo,id_conductor,observacion,proceso,fecha,hora,usuario,estado_actu,estado_subasta)
                                        VALUES(:id_estudio_c,:id_estudio,:estado,:id_vehiculo,:id_conductor,:observacion,:proceso,:fecha,:hora,:usuario,:estado_actu,:estado_subasta)");
                                        $sql_insert_estudio_completo->bindParam(':id_estudio_c', $numdoc_completo, PDO::PARAM_STR);
                                        $sql_insert_estudio_completo->bindParam(':id_estudio', $numdoc, PDO::PARAM_STR);
                                        $sql_insert_estudio_completo->bindParam(':estado', $estado_estudio_seguridad, PDO::PARAM_STR);
                                        $sql_insert_estudio_completo->bindParam(':id_vehiculo', $resultado["numdoc_vehiculo"], PDO::PARAM_STR);
                                        $sql_insert_estudio_completo->bindParam(':id_conductor', $resultado["id_conductor"], PDO::PARAM_STR);
                                        $sql_insert_estudio_completo->bindParam(':observacion', $observacion, PDO::PARAM_STR);
                                        $sql_insert_estudio_completo->bindParam(':proceso', $proceso, PDO::PARAM_STR);
                                        $sql_insert_estudio_completo->bindParam(':fecha', $datos["fecha"], PDO::PARAM_STR);
                                        $sql_insert_estudio_completo->bindParam(':hora', $datos["hora"], PDO::PARAM_STR);
                                        $sql_insert_estudio_completo->bindParam(':usuario', $datos["usuario"], PDO::PARAM_STR);
                                        $sql_insert_estudio_completo->bindParam(':estado_actu', $estado_actu, PDO::PARAM_STR);
                                        $sql_insert_estudio_completo->bindParam(':estado_subasta', $estado_subasta, PDO::PARAM_STR);
                                        $resultado_estudiov_completo = $sql_insert_estudio_completo->execute();

                                        if ($resultado_estudiov_completo) {

                                            $estado_log = "Crear";
                                            $sql_insert_log = $this->_db3->prepare("INSERT INTO cmx_logestudio_com(id_completo,id_estudio,fecha,hora,id_usuario,estado)
                                            VALUES(:id_completo,:id_estudio,:fecha,:hora,:id_usuario,:estado)");
                                            $sql_insert_log->bindParam(':id_completo', $numdoc_completo, PDO::PARAM_STR);
                                            $sql_insert_log->bindParam(':id_estudio', $numdoc, PDO::PARAM_STR);
                                            $sql_insert_log->bindParam(':fecha', $datos["fecha"], PDO::PARAM_STR);
                                            $sql_insert_log->bindParam(':hora', $datos["hora"], PDO::PARAM_STR);
                                            $sql_insert_log->bindParam(':id_usuario', $datos["usuario"], PDO::PARAM_STR);
                                            $sql_insert_log->bindParam(':estado', $estado_log, PDO::PARAM_STR);
                                            $resultado_estudio_log = $sql_insert_log->execute();

                                            if ($resultado_estudio_log) {
                                                //registrar solicitudes de servicio
                                                $estss = 1;
                                                $p = 'E';
                                                $solicitudes = $datos["solicitudes"];

                                                foreach ($solicitudes as $value) {
                                                    $sqlss = $this->_db3->prepare("INSERT INTO cmx_preestudio_solicitudes_servicio(id,id_servicio_cliente,id_solicitudpreestudio,fecha,hora,usuario,es,clasificacion)
                                                            VALUES(null,:servicio,:idsolicitud,:fecha,:hora,:usuario,:es,:p)");
                                                    $sqlss->bindParam(':servicio', $value);
                                                    $sqlss->bindParam(':idsolicitud', $numdoc);
                                                    $sqlss->bindParam(':fecha', $datos['fecha']);
                                                    $sqlss->bindParam(':hora', $datos['hora']);
                                                    $sqlss->bindParam(':usuario', $datos["usuario"]);
                                                    $sqlss->bindParam(':es', $estss);
                                                    $sqlss->bindParam(':p', $p);
                                                    $resultado_solicitudes_servicio = $sqlss->execute();
                                                }

                                                if ($resultado_solicitudes_servicio) {
                                                    foreach ($solicitudes as $value) {
                                                        $estado_sql = 'asignada';
                                                        $sqlo = $this->_db3->prepare("INSERT INTO cmx_log_solicitudvehiculo(id,id_solictud,user_log,fecha_asignacion,hora_asignacion,estado)
                                                            VALUES(null,:servicio,:usuario,:fecha,:hora,:statu)");
                                                        $sqlo->bindParam(':servicio', $value);
                                                        $sqlo->bindParam(':usuario', $datos["usuario"]);
                                                        $sqlo->bindParam(':fecha', $datos['fecha']);
                                                        $sqlo->bindParam(':hora', $datos['hora']);
                                                        $sqlo->bindParam(':statu', $estado_sql);
                                                        $resultado_log = $sqlo->execute();
                                                    }
                                                    if ($resultado_log) {
                                                        $valor = 0;
                                                        $sql_subasta = $this->_db3->prepare("INSERT INTO cmx_subasta_temporal(id,fecha_inicio,numero_estudio,placa,flete,tarifa)
                                                                VALUES(null,:fechasu,:numerosu,:placa_su,:fletesu,:tarifasu)");
                                                        $sql_subasta->bindParam(':fechasu', $datos["fecha"]);
                                                        $sql_subasta->bindParam(':numerosu', $numdoc);
                                                        $sql_subasta->bindParam(':placa_su', $datos["placa"]);
                                                        $sql_subasta->bindParam(':fletesu', $datos["flete"]);
                                                        $sql_subasta->bindParam(':tarifasu', $datos["tarifa"]);
                                                        $resultado_subasta = $sql_subasta->execute();
                                                        if ($resultado_subasta) {
                                                            if ($datos["tipo_operacion"] == 'Actualizar') {
                                                                if ($datos["dinamicos"] == "si") {
                                                                    $id_s = $numdoc;
                                                                    $papeles = $datos["papeles"];
                                                                    $archivos = $datos["archivos"];
                                                                    $ruta = 'public/files/seguridad_actualiza/' . $id_s . '/';
                                                                    if (!is_dir($ruta)) {
                                                                        // Crear la carpeta
                                                                        // Verificar si $papeles no es "Sin_datos"
                                                                        if ($papeles != "Sin_datos") {
                                                                            // Crear la carpeta para los archivos si no existe
                                                                            if (mkdir($ruta, 0777, true)) {
                                                                                // Realizar inserciones en la base de datos
                                                                                (int) $tol = count($archivos->tipohojahv);
                                                                                for ($i = 0; $i < $tol; $i++) {
                                                                                    $inse_update = $this->_db3->prepare("INSERT INTO cmx_actualiza_seguridad(id_sol_prees,tipo_hv,tipo_campo,info_campo,fecha,hora,usuario,ruta_archivo,name_archivo)
                                                                                        VALUES(:solicitud, :tipohv, :campo, :dato, :fecha, :hora, :usuario, :ruta_archivo, :name_archivo)");
                                                                                    $inse_update->bindParam(':solicitud', $numdoc);
                                                                                    $inse_update->bindParam(':tipohv', $archivos->tipohojahv[$i]);
                                                                                    $inse_update->bindParam(':campo', $archivos->campos[$i]);
                                                                                    $inse_update->bindParam(':dato', $archivos->datos[$i]);
                                                                                    $inse_update->bindParam(':fecha', $datos['fecha']);
                                                                                    $inse_update->bindParam(':hora', $datos['hora']);
                                                                                    $inse_update->bindParam(':usuario', $datos["usuario"]);
                                                                                    $inse_update->bindParam(':ruta_archivo', $ruta);
                                                                                    $inse_update->bindParam(':name_archivo', $archivos->namearchivo[$i]);
                                                                                    $resultado_update = $inse_update->execute();
                                                                                }

                                                                                // Verificar que las inserciones en la base de datos se realizaron correctamente
                                                                                if ($resultado_update) {
                                                                                    // Verificar si $papeles['name'] es un array (varios archivos)
                                                                                    if (is_array($papeles)) {
                                                                                        foreach ($papeles['name'] as $key => $fileName) {
                                                                                            $ruta_provisional = $papeles['tmp_name'][$key]; // Ruta temporal
                                                                                            $carpeta = $ruta;
                                                                                            $src = $carpeta . $fileName;

                                                                                            // Intentar mover el archivo subido
                                                                                            if (!move_uploaded_file($ruta_provisional, $src)) {
                                                                                                // Si falla la subida, lanzar una excepción para detener el proceso
                                                                                                throw new Exception("Error al subir el archivo: $fileName");
                                                                                            }
                                                                                        }
                                                                                    } else {
                                                                                        // Si es un solo archivo
                                                                                        $file = $papeles['name'];
                                                                                        $ruta_provisional = $papeles['tmp_name'];
                                                                                        $carpeta = $ruta;
                                                                                        $src = $carpeta . $file;

                                                                                        // Intentar mover el archivo subido
                                                                                        if (!move_uploaded_file($ruta_provisional, $src)) {
                                                                                            throw new Exception("Error al subir el archivo: $file");
                                                                                        }
                                                                                    }

                                                                                    // Si todo ha ido bien, confirmar la transacción
                                                                                    $this->_db3->commit();
                                                                                    $response = array(
                                                                                        'numero' => 200,
                                                                                        'mensaje' => 'Solicitud de estudio para la placa registrada exitosamente.',
                                                                                    );
                                                                                } else {
                                                                                    // Si las inserciones en la base de datos fallan, hacer rollback
                                                                                    $this->_db3->rollback();
                                                                                    $response = array(
                                                                                        'numero' => 400,
                                                                                        'mensaje' => 'No se pudo registrar los datos a actualizar para la placa.',
                                                                                    );
                                                                                }

                                                                                return $response;
                                                                            } else {
                                                                                // Si no se pudo crear la carpeta
                                                                                $response = array(
                                                                                    'numero' => 400,
                                                                                    'mensaje' => "No se pudo crear la carpeta.",
                                                                                );
                                                                                return $response;
                                                                            }
                                                                        } else {
                                                                            (int) $tol = count($archivos->tipohojahv);
                                                                            for ($i = 0; $i < count($archivos->tipohojahv); $i++) {
                                                                                $inse_update = $this->_db3->prepare("INSERT INTO cmx_actualiza_seguridad(id_sol_prees,tipo_hv,tipo_campo,info_campo,fecha,hora,usuario,ruta_archivo,name_archivo)
                                                                                                                    VALUES(:solicitud,:tipohv,:campo,:dato,:fecha,:hora,:usuario,:ruta_archivo,:name_archivo)");
                                                                                $inse_update->bindParam(':solicitud', $numdoc);
                                                                                $inse_update->bindParam(':tipohv', $archivos->tipohojahv[$i]);
                                                                                $inse_update->bindParam(':campo', $archivos->campos[$i]);
                                                                                $inse_update->bindParam(':dato', $archivos->datos[$i]);
                                                                                $inse_update->bindParam(':fecha', $datos['fecha']);
                                                                                $inse_update->bindParam(':hora', $datos['hora']);
                                                                                $inse_update->bindParam(':usuario', $datos["usuario"]);
                                                                                $inse_update->bindParam(':ruta_archivo', $ruta);
                                                                                $inse_update->bindParam(':name_archivo', $archivos->namearchivo[$i]);
                                                                                $resultado_update = $inse_update->execute();
                                                                            }
                                                                            if ($resultado_update) {
                                                                                $this->_db3->commit();
                                                                                $response = array('numero' => 200, 'mensaje' => 'Solicitud de estudio para la placa ' . $datos['placa'] . ' registrada exitosamente.');
                                                                                return $response;
                                                                            } else {
                                                                                $response = array(
                                                                                    'numero' => 400,
                                                                                    'mensaje' => 'No se puedo registrar los datos a actualizar para la placa',
                                                                                );
                                                                                return $response;
                                                                            }
                                                                        }
                                                                    } else {
                                                                        //pasar el archivo
                                                                        $total = count($papeles['name']);
                                                                        for ($a = 0; $a < $total; $a++) {
                                                                            if (isset($datos["papeles"])) {
                                                                                $file = $papeles["name"][$a];
                                                                                $tipo = $papeles["type"][$a];
                                                                                $ruta_provisional = $papeles["tmp_name"][$a];
                                                                                $carpeta = $ruta;
                                                                                $src = $carpeta . $file;
                                                                                move_uploaded_file($ruta_provisional, $src);
                                                                            }
                                                                        }
                                                                        if ($resultado_subasta) {
                                                                            $this->_db3->commit();
                                                                            $response = array(
                                                                                'numero' => 200,
                                                                                'mensaje' => 'Solicitud de estudio para la placa  registrada exitosamente.',
                                                                            );
                                                                            return $response;
                                                                        } else {
                                                                            $this->_db3->commit();
                                                                            $response = array(
                                                                                'numero' => 400,
                                                                                'mensaje' => 'No se puedo registrar los datos a actualizar para la placa',
                                                                            );
                                                                            return $response;
                                                                        }
                                                                    }
                                                                } else {
                                                                    /* Cuando se valla a unsertar un prefiltro para un nuevo recurso */
                                                                    $evalua_pro = $datos_nuevos["propietario_check"];
                                                                    $checkpro = ($evalua_pro == 'true') ? 1 : 0;
                                                                    $name_pro = $checkpro ? $datos_nuevos["nombre_propietario"] : null;
                                                                    $doc_pro = $checkpro ? $datos_nuevos["docu_propi"] : null;

                                                                    $evalua_pose = $datos_nuevos["tipo_posee"];
                                                                    $checkpose = ($evalua_pose == 'true') ? 1 : 0;
                                                                    $name_pose = $checkpose ? $datos_nuevos["nombre_poseedor"] : null;
                                                                    $doc_pose = $checkpose ? $datos_nuevos["docu_posee"] : null;

                                                                    $evalua_veh = $datos_nuevos["vehi_check"];
                                                                    $checkcarro = ($evalua_veh == 'true') ? 1 : 0;
                                                                    $placa_carro = $checkcarro ? $datos_nuevos["placa_vehiculo"] : null;
                                                                    $satelital = $checkcarro ? $datos_nuevos["satelital"] : null;
                                                                    $url_satelital = $checkcarro ? $datos_nuevos["url_satelital"] : null;
                                                                    $clave_satelital = $checkcarro ? $datos_nuevos["clave_satelital"] : null;

                                                                    $evalua_trai = $datos_nuevos["trailer_check"];
                                                                    $checktrai = ($evalua_trai == 'true') ? 1 : 0;
                                                                    $placa_trailer = $checktrai ? $datos_nuevos["placa_trailer"] : null;
                                                                    $pro_trailer = $checktrai ? $datos_nuevos["propi_trailer"] : null;
                                                                    $pro_doctrailer = $checktrai ? $datos_nuevos["propidoc_trailer"] : null;

                                                                    $evalua_condu = $datos_nuevos["conductor_check"];
                                                                    $checkcondu = ($evalua_condu == 'true') ? 1 : 0;
                                                                    $name_condu = $checkcondu ? $datos_nuevos["nombre_conductor"] : null;
                                                                    $docu_condu = $checkcondu ? $datos_nuevos["docu_condu"] : null;

                                                                    $referencias = [];
                                                                    for ($i = 1; $i <= 3; $i++) {
                                                                        $referencias[] = [
                                                                            'refe' => $checkcondu ? $datos_nuevos["refe$i"] : null,
                                                                            'contacto' => $checkcondu ? $datos_nuevos["contacto$i"] : null,
                                                                            'celular' => $checkcondu ? $datos_nuevos["celular$i"] : null,
                                                                            'cargo' => $checkcondu ? $datos_nuevos["cargo$i"] : null,
                                                                            'fecha1' => $checkcondu ? $datos_nuevos["fecha" . chr(96 + $i) . "1"] : null,
                                                                            'fecha2' => $checkcondu ? $datos_nuevos["fecha" . chr(96 + $i) . "2"] : null,
                                                                            'antiguedad' => $checkcondu ? $datos_nuevos["anti$i"] : null
                                                                        ];
                                                                    }

                                                                    $query = "INSERT INTO cmx_prefiltro_actualizar 
                                                                    (id, id_solicitud_u, propietario, name_propietario, documento_propietario, poseedor, name_poseedor, documento_poseedor,
                                                                        vehiculo, placa, satelital, clave_satelital, url_satelital, user_satelital, trailer, placa_trailer,
                                                                        name_propietario_trailer, documento_propi_trailer, conductor, name_conductor, documento_conductor,
                                                                        empresa1, persona1, cel1, cargo1, feca1, feca2, antiguedad1,
                                                                        empresa2, persona2, cel2, cargo2, fecb1, fecb2, antiguedad2,
                                                                        empresa3, persona3, cel3, cargo3, fecc1, fecc2, antiguedad3
                                                                    ) VALUES (null, :id_solicitud, :prop, :name_propi, :doc_propietario, :tene, :name_poseedor, :docpose,
                                                                        :carro, :placa_carro, :satelite, :clave_sate, :url_satelite, :user_satelital, :trailercheck, :trailerplaca,
                                                                        :nomprotrail, :docuproptrail, :conductor, :namecondu, :doccondu,
                                                                        :ref1, :contacto1, :cel1, :cargo1, :feca1, :feca2, :antigue1,
                                                                        :empresa2, :person2, :celu2, :cargo2, :fechab1, :fechab2, :anti2,
                                                                        :empre3, :contacto3, :celu3, :cargo3, :fecc1, :fecc2, :anti3
                                                                    )";

                                                                    $this->_db3->prepare($query)->execute([
                                                                        ':id_solicitud' => $numdoc,
                                                                        ':prop' => $checkpro,
                                                                        ':name_propi' => $name_pro,
                                                                        ':doc_propietario' => $doc_pro,
                                                                        ':tene' => $checkpose,
                                                                        ':name_poseedor' => $name_pose,
                                                                        ':docpose' => $doc_pose,
                                                                        ':carro' => $checkcarro,
                                                                        ':placa_carro' => $placa_carro,
                                                                        ':satelite' => $satelital,
                                                                        ':clave_sate' => $clave_satelital,
                                                                        ':url_satelite' => $url_satelital,
                                                                        ':user_satelital' => $clave_satelital,
                                                                        ':trailercheck' => $checktrai,
                                                                        ':trailerplaca' => $placa_trailer,
                                                                        ':nomprotrail' => $pro_trailer,
                                                                        ':docuproptrail' => $pro_doctrailer,
                                                                        ':conductor' => $checkcondu,
                                                                        ':namecondu' => $name_condu,
                                                                        ':doccondu' => $docu_condu,
                                                                        ':ref1' => $referencias[0]['refe'],
                                                                        ':contacto1' => $referencias[0]['contacto'],
                                                                        ':cel1' => $referencias[0]['celular'],
                                                                        ':cargo1' => $referencias[0]['cargo'],
                                                                        ':feca1' => $referencias[0]['fecha1'],
                                                                        ':feca2' => $referencias[0]['fecha2'],
                                                                        ':antigue1' => $referencias[0]['antiguedad'],
                                                                        ':empresa2' => $referencias[1]['refe'],
                                                                        ':person2' => $referencias[1]['contacto'],
                                                                        ':celu2' => $referencias[1]['celular'],
                                                                        ':cargo2' => $referencias[1]['cargo'],
                                                                        ':fechab1' => $referencias[1]['fecha1'],
                                                                        ':fechb2' => $referencias[1]['fecha2'],
                                                                        ':anti2' => $referencias[1]['antiguedad'],
                                                                        ':empre3' => $referencias[2]['refe'],
                                                                        ':contacto3' => $referencias[2]['contacto'],
                                                                        ':celu3' => $referencias[2]['celular'],
                                                                        ':cargo3' => $referencias[2]['cargo'],
                                                                        ':fecc1' => $referencias[2]['fecha1'],
                                                                        ':fecc2' => $referencias[2]['fecha2'],
                                                                        ':anti3' => $referencias[2]['antiguedad'],
                                                                    ]);

                                                                    // $this->_db3->commit();
                                                                    $response = [
                                                                        'numero' => 200,
                                                                        'mensaje' => 'insert prefiltro en actualizar registrado exitosamente.',
                                                                    ];
                                                                    // return $response;
                                                                }
                                                            } else {
                                                                // $this->_db3->commit();
                                                                $response = [
                                                                    'numero' => 200,
                                                                    'mensaje' => 'Solicitud de estudio para la placa ' . $datos['placa'] . ' registrada exitosamente.',
                                                                ];
                                                                // return $response;
                                                            }
                                                        } else {
                                                            // $this->_db3->commit();
                                                            $response = [
                                                                'numero' => 400,
                                                                'mensaje' => 'No se puedo registrar la asociacion de estudio',
                                                            ];
                                                            // return $response;
                                                        }
                                                    } else {
                                                        // $this->_db3->commit();
                                                        $response = [
                                                            'numero' => 400,
                                                            'mensaje' => 'No se pudo registrar ss para operaciones',
                                                        ];
                                                        // return $response;
                                                    }
                                                } else {
                                                    // $this->_db3->commit();
                                                    $response = [
                                                        'numero' => 400,
                                                        'mensaje' => 'No se puedo registrar la subasta temporal de estudio',
                                                    ];
                                                    // return $response;
                                                }
                                            } else {

                                                // $this->_db3->commit();
                                                $response = [
                                                    'numero' => 400,
                                                    'mensaje' => 'No se puedo registrar la solicitud de estudio',
                                                ];
                                                // return $response;
                                            }
                                        } else {
                                            $response = [
                                                'numero' => 400,
                                                'mensaje' => 'No se puedo resgistrar la solicitud de estudio',
                                            ];
                                            $mensajeError = "transaccion fallo: insertar estado completo vehiculo" . date("Y-m-d") . $datos["usuario"];
                                            error_log($mensajeError . "\n", 3, "error_log.txt");
                                        }
                                    } else {
                                        $mensajeError = "transaccion fallo: en Actualizar maestro estudio seguridad completo" . date("Y-m-d") . $datos["usuario"];
                                        error_log($mensajeError . "\n", 3, "error_log.txt");
                                    }
                                } else {
                                    $mensajeError = "transaccion fallo: en solicitar maestro estudio seguridad completo" . date("Y-m-d") . $datos["usuario"];
                                    error_log($mensajeError . "\n", 3, "error_log.txt");
                                }
                            } else {
                                $response = [
                                    'numero' => 400,
                                    'mensaje' => 'No se puedo resgistrar la solicitud de estudio',
                                ];
                                $mensajeError = "transaccion fallo: insertar estudio vehiculo" . date("Y-m-d") . $datos["usuario"];
                                error_log($mensajeError . "\n", 3, "error_log.txt");
                            }
                        } else {
                            $mensajeError = "transaccion fallo: en Actualizar maestro estudio seguridad" . date("Y-m-d") . $datos["usuario"];
                            error_log($mensajeError . "\n", 3, "error_log.txt");
                        }
                    } else {
                        $mensajeError = "transaccion fallo: en solicitar maestro estudio seguridad" . date("Y-m-d") . $datos["usuario"];
                        error_log($mensajeError . "\n", 3, "error_log.txt");
                    }
                }
            }
        } catch (\Throwable $th) {
            // Si ocurre algún error, deshacemos la transacción
            $this->_db3->rollBack();
            echo "Error en la transacción: " . $th->getMessage();
            $mensajeError = $th->getMessage() . date("Y-m-d") . $datos["usuario"];
            error_log($mensajeError . "\n", 3, "error_log.txt");
        }
    }

    /* Funcion para insertar el estudio como itr */
    public function Insert_estudio_Itr($datos, $datos_nuevos)
    {
        // $empresa_id = $_SESSION['usuario']['empresa_id'];
        try {

            $this->_db3->beginTransaction();
            //obtener id de agrupacion
            $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='AGRU_SS' AND numero_actual>numero_inicial");
            $resultado_consecutivo = $sql_consecutivo->execute();
            $resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
            $numdoc_agru = $resultado_consecutivo['numero_actual'];
            $numero_agrupacion = $resultado_consecutivo['numero_actual'] + 1;
            //consulta la solicitud de servicio
            $solicitudes_servicio = $datos["solicitudes"];
            foreach ($solicitudes_servicio as $value) {
                $sql_consecutivo2 = $this->_db3->prepare("SELECT solicitud_servicio FROM cmx_consolidacion_solicitudes WHERE solicitud_servicio=$value");
                $resultado_consecutivo = $sql_consecutivo2->execute();
                $total = $sql_consecutivo2->rowCount();
                if ($total == 0) {
                    //insertar agrupacion de solicitudes
                    if ($numdoc_agru) {
                        $sql_updata_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numero_agrupacion WHERE tipo='AGRU_SS'");
                        $resultado_consecutivo_update = $sql_updata_maestro->execute();
                        if ($resultado_consecutivo_update) {
                            // $this->_db3->commit();
                            foreach ($solicitudes_servicio as $value) {
                                $sql_agrupacion = $this->_db3->prepare("INSERT INTO cmx_consolidacion_solicitudes(id,solicitud_servicio,agrupacion) VALUES(null,:id_servicio,:agrupacion)");
                                $sql_agrupacion->bindParam(':id_servicio', $value);
                                $sql_agrupacion->bindParam(':agrupacion', $numdoc_agru);
                                $resultado_agrupacion = $sql_agrupacion->execute();
                            }
                            if ($resultado_agrupacion) {
                                //insertar habilitar y actualizar
                                // Consultar maestro de Estudio de seguridad
                                $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='EST_SEG' AND numero_actual>numero_inicial");
                                $resultado_consecutivo = $sql_consecutivo->execute();
                                $resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
                                $numdoc = $resultado_consecutivo['numero_actual'];
                                $numdoc_actualizar = $resultado_consecutivo['numero_actual'] + 1;
                                if ($numdoc) {

                                    // Actualizar Maestro de Estudio segurdad
                                    $sql_updata_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numdoc_actualizar WHERE tipo='EST_SEG'");
                                    $resultado_consecutivo_update = $sql_updata_maestro->execute();
                                    if ($resultado_consecutivo_update) {
                                        $null = null;
                                        $viaje = 1;
                                        $itr = 'SI';
                                        $sql_insert_estudio_vh = $this->_db3->prepare("INSERT INTO cmx_estudio_vehiculo(id_estudio,id_solicitud,observacion_vehiculo,observacion_conductor,observacion_tenedor,observacion_general,usuario,fecha,hora,operacion,placa,viaje_itr,itr,responsable,empresa_id)
                                        VALUES(:id_estudio,:id_solicitud,:observacion_vehiculo,:observacion_conductor,:observacion_tenedor,:observacion_general,:usuario,:fecha,:hora,:operacion,:placa,:viaje_itr,:itr,:responsable,:empresa_id)");
                                        $sql_insert_estudio_vh->bindParam(':id_estudio', $numdoc, PDO::PARAM_STR);
                                        $sql_insert_estudio_vh->bindParam(':id_solicitud', $numdoc_cabecera, PDO::PARAM_STR);
                                        $sql_insert_estudio_vh->bindParam(':observacion_vehiculo', $null, PDO::PARAM_STR);
                                        $sql_insert_estudio_vh->bindParam(':observacion_conductor', $null, PDO::PARAM_STR);
                                        $sql_insert_estudio_vh->bindParam(':observacion_tenedor', $null, PDO::PARAM_STR);
                                        $sql_insert_estudio_vh->bindParam(':observacion_general', $datos['observacion'], PDO::PARAM_STR);
                                        $sql_insert_estudio_vh->bindParam(':usuario', $datos["usuario"], PDO::PARAM_STR);
                                        $sql_insert_estudio_vh->bindParam(':fecha', $datos["fecha"], PDO::PARAM_STR);
                                        $sql_insert_estudio_vh->bindParam(':hora', $datos["hora"], PDO::PARAM_STR);
                                        $sql_insert_estudio_vh->bindParam(':operacion', $datos["tipo_operacion"], PDO::PARAM_STR);
                                        $sql_insert_estudio_vh->bindParam(':placa', $datos["placa"], PDO::PARAM_STR);
                                        $sql_insert_estudio_vh->bindParam(':viaje_itr', $viaje, PDO::PARAM_STR);
                                        $sql_insert_estudio_vh->bindParam(':itr', $itr, PDO::PARAM_STR);
                                        $sql_insert_estudio_vh->bindParam(':responsable', $datos['responsable_vehiculo'], PDO::PARAM_STR);
                                        $sql_insert_estudio_vh->bindParam(':empresa_id', $datos['empresa_cliente'], PDO::PARAM_STR);
                                        $resultado_insert_estudio_vh = $sql_insert_estudio_vh->execute();
                                        if ($resultado_insert_estudio_vh) {
                                            // Consultar maestro de Estudio de seguridad Completo
                                            $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='EST_SEG_COMP' AND numero_actual>numero_inicial");
                                            $resultado_consecutivo_completo = $sql_consecutivo->execute();
                                            $resultado_consecutivo_completo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
                                            $numdoc_completo = $resultado_consecutivo_completo['numero_actual'];
                                            $numdoc_actualizar_completo = $resultado_consecutivo_completo['numero_actual'] + 1;
                                            if ($numdoc_completo) {
                                                $sql_updata_maestro_completo = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numdoc_actualizar_completo WHERE tipo='EST_SEG_COMP'");
                                                $resultado_consecutivo_update_completo = $sql_updata_maestro_completo->execute();
                                                if ($resultado_consecutivo_update_completo) {
                                                    $estado_estudio_seguridad = "pendiente_iniciar";
                                                    $estado_actu = 1;
                                                    $estado_subasta = "Activo";
                                                    $observacion = null;
                                                    $proceso = "Pen_Sol_Rut";
                                                    $sql_conductor_vehiculo = $this->_db3->prepare("SELECT id, id_conductor,numdoc_vehiculo FROM cmx_vehiculos WHERE placa=:placa");
                                                    $sql_conductor_vehiculo->bindParam(':placa', $datos["placa"], PDO::PARAM_STR);
                                                    $resultado = $sql_conductor_vehiculo->execute();
                                                    $resultado = $sql_conductor_vehiculo->fetch(PDO::FETCH_ASSOC);
                                                    $sql_insert_estudio_completo = $this->_db3->prepare("INSERT INTO cmx_estudiov_completo(id_estudio_c,id_estudio,estado,id_vehiculo,id_conductor,observacion,proceso,fecha,hora,usuario,estado_actu,estado_subasta)
                                                                                                        VALUES(:id_estudio_c,:id_estudio,:estado,:id_vehiculo,:id_conductor,:observacion,:proceso,:fecha,:hora,:usuario,:estado_actu,:estado_subasta)");
                                                    $sql_insert_estudio_completo->bindParam(':id_estudio_c', $numdoc_completo, PDO::PARAM_STR);
                                                    $sql_insert_estudio_completo->bindParam(':id_estudio', $numdoc, PDO::PARAM_STR);
                                                    $sql_insert_estudio_completo->bindParam(':estado', $estado_estudio_seguridad, PDO::PARAM_STR);
                                                    $sql_insert_estudio_completo->bindParam(':id_vehiculo', $resultado["numdoc_vehiculo"], PDO::PARAM_STR);
                                                    $sql_insert_estudio_completo->bindParam(':id_conductor', $resultado["id_conductor"], PDO::PARAM_STR);
                                                    $sql_insert_estudio_completo->bindParam(':observacion', $observacion, PDO::PARAM_STR);
                                                    $sql_insert_estudio_completo->bindParam(':proceso', $proceso, PDO::PARAM_STR);
                                                    $sql_insert_estudio_completo->bindParam(':fecha', $datos["fecha"], PDO::PARAM_STR);
                                                    $sql_insert_estudio_completo->bindParam(':hora', $datos["hora"], PDO::PARAM_STR);
                                                    $sql_insert_estudio_completo->bindParam(':usuario', $datos["usuario"], PDO::PARAM_STR);
                                                    $sql_insert_estudio_completo->bindParam(':estado_actu', $estado_actu, PDO::PARAM_STR);
                                                    $sql_insert_estudio_completo->bindParam(':estado_subasta', $estado_subasta, PDO::PARAM_STR);
                                                    $resultado_estudiov_completo = $sql_insert_estudio_completo->execute();
                                                    if ($resultado_estudiov_completo) {
                                                        $estado_log = "Crear";
                                                        $sql_insert_log = $this->_db3->prepare("INSERT INTO cmx_logestudio_com(id_completo,id_estudio,fecha,hora,id_usuario,estado) VALUES(:id_completo,:id_estudio,:fecha,:hora,:id_usuario,:estado)");
                                                        $sql_insert_log->bindParam(':id_completo', $numdoc_completo, PDO::PARAM_STR);
                                                        $sql_insert_log->bindParam(':id_estudio', $numdoc, PDO::PARAM_STR);
                                                        $sql_insert_log->bindParam(':fecha', $datos["fecha"], PDO::PARAM_STR);
                                                        $sql_insert_log->bindParam(':hora', $datos["hora"], PDO::PARAM_STR);
                                                        $sql_insert_log->bindParam(':id_usuario', $datos["usuario"], PDO::PARAM_STR);
                                                        $sql_insert_log->bindParam(':estado', $estado_log, PDO::PARAM_STR);
                                                        $resultado_estudio_log = $sql_insert_log->execute();
                                                        if ($resultado_estudio_log) {
                                                            //registrar solicitudes de servicio
                                                            $estss = 1;
                                                            $p = 'E';
                                                            $solicitudes = $datos["solicitudes"];

                                                            foreach ($solicitudes as $value) {
                                                                $sqlss = $this->_db3->prepare("INSERT INTO cmx_preestudio_solicitudes_servicio(id,id_servicio_cliente,id_solicitudpreestudio,fecha,hora,usuario,es,clasificacion)VALUES(null,:servicio,:idsolicitud,:fecha,:hora,:usuario,:es,:p)");
                                                                $sqlss->bindParam(':servicio', $value);
                                                                $sqlss->bindParam(':idsolicitud', $numdoc);
                                                                $sqlss->bindParam(':fecha', $datos['fecha']);
                                                                $sqlss->bindParam(':hora', $datos['hora']);
                                                                $sqlss->bindParam(':usuario', $datos["usuario"]);
                                                                $sqlss->bindParam(':es', $estss);
                                                                $sqlss->bindParam(':p', $p);
                                                                $resultado_solicitudes_servicio = $sqlss->execute();
                                                            }
                                                            if ($resultado_solicitudes_servicio) {
                                                                foreach ($solicitudes as $value) {
                                                                    $estado_log = 'asignada';
                                                                    $sqlo = $this->_db3->prepare("INSERT INTO cmx_log_solicitudvehiculo(id,id_solictud,user_log,fecha_asignacion,hora_asignacion,estado) VALUES(null,:servicio,:usuario,:fecha,:hora,:statu)");
                                                                    $sqlo->bindParam(':servicio', $value);
                                                                    $sqlo->bindParam(':usuario', $datos["usuario"]);
                                                                    $sqlo->bindParam(':fecha', $datos['fecha']);
                                                                    $sqlo->bindParam(':hora', $datos['hora']);
                                                                    $sqlo->bindParam(':statu', $estado_log);
                                                                    $resultado_log = $sqlo->execute();
                                                                }
                                                                if ($resultado_log) {
                                                                    $valor = 0;
                                                                    $sql_subasta = $this->_db3->prepare("INSERT INTO cmx_subasta_temporal(id,fecha_inicio,numero_estudio,placa,flete,tarifa) VALUES(null,:fechasu,:numerosu,:placa_su,:fletesu,:tarifasu)");
                                                                    $sql_subasta->bindParam(':fechasu', $datos["fecha"]);
                                                                    $sql_subasta->bindParam(':numerosu', $numdoc);
                                                                    $sql_subasta->bindParam(':placa_su', $datos["placa"]);
                                                                    $sql_subasta->bindParam(':fletesu', $datos["flete"]);
                                                                    $sql_subasta->bindParam(':tarifasu', $datos["tarifa"]);
                                                                    $resultado_subasta = $sql_subasta->execute();
                                                                    if ($resultado_subasta) {
                                                                        if ($datos["tipo_operacion"] == 'Actualizar') {
                                                                            if ($datos["dinamicos"] == "si") {
                                                                                $id_s = $numdoc;
                                                                                $papeles = $datos["papeles"];
                                                                                $archivos = $datos["archivos"];
                                                                                (int) $tol = count($archivos->tipohojahv);
                                                                                $ruta = 'public/files/seguridad_actualiza/' . $id_s . '/';
                                                                                if (!is_dir($ruta)) {
                                                                                    // Crear la carpeta
                                                                                    if ($papeles !== "Sin_datos") {
                                                                                        if (mkdir($ruta, 0777, true)) {
                                                                                            for ($i = 0; $i < count($archivos->tipohojahv); $i++) {
                                                                                                $inse_update = $this->_db3->prepare("INSERT INTO cmx_actualiza_seguridad(id_sol_prees,tipo_hv,tipo_campo,info_campo,fecha,hora,usuario,ruta_archivo,name_archivo)
                                                                                                                                                                                                VALUES(:solicitud,:tipohv,:campo,:dato,:fecha,:hora,:usuario,:ruta_archivo,:name_archivo)");
                                                                                                $inse_update->bindParam(':solicitud', $numdoc);
                                                                                                $inse_update->bindParam(':tipohv', $archivos->tipohojahv[$i]);
                                                                                                $inse_update->bindParam(':campo', $archivos->campos[$i]);
                                                                                                $inse_update->bindParam(':dato', $archivos->datos[$i]);
                                                                                                $inse_update->bindParam(':fecha', $datos['fecha']);
                                                                                                $inse_update->bindParam(':hora', $datos['hora']);
                                                                                                $inse_update->bindParam(':usuario', $datos["usuario"]);
                                                                                                $inse_update->bindParam(':ruta_archivo', $ruta);
                                                                                                $inse_update->bindParam(':name_archivo', $archivos->namearchivo[$i]);
                                                                                                $resultado_update = $inse_update->execute();
                                                                                            }
                                                                                            //pasar el archivo
                                                                                            // Si $papeles['name'] es un array, entonces es una carga de múltiples archivos
                                                                                            if (is_array($papeles['name'])) {
                                                                                                // Recorrer los archivos subidos
                                                                                                foreach ($papeles['name'] as $key => $fileName) {
                                                                                                    $ruta_provisional = $papeles['tmp_name'][$key]; // Obtener la ruta temporal del archivo
                                                                                                    $carpeta = $ruta;
                                                                                                    $src = $carpeta . $fileName;

                                                                                                    // Verificar que la carga del archivo fue exitosa
                                                                                                    if (move_uploaded_file($ruta_provisional, $src)) {
                                                                                                        if ($resultado_update) {
                                                                                                            $this->_db3->commit();
                                                                                                            $response = array(
                                                                                                                'numero' => 200,
                                                                                                                'mensaje' => 'Solicitud de estudio para la placa  registrada exitosamente.',
                                                                                                            );
                                                                                                            return $response;
                                                                                                        } else {
                                                                                                            $this->_db3->commit();
                                                                                                            $response = array(
                                                                                                                'numero' => 400,
                                                                                                                'mensaje' => 'No se puedo registrar los datos a actualizar para la placa',
                                                                                                            );
                                                                                                            return $response;
                                                                                                        }
                                                                                                    } else {
                                                                                                        // echo "Error al subir el archivo: $fileName";
                                                                                                        $response = array(
                                                                                                            'numero' => 400,
                                                                                                            'mensaje' => "Error al subir el archivo: $fileName",
                                                                                                        );
                                                                                                        return $response;
                                                                                                    }
                                                                                                }
                                                                                            } else {
                                                                                                // Si solo es un archivo (sin atributo multiple)
                                                                                                $file = $papeles['name'];
                                                                                                $ruta_provisional = $papeles['tmp_name'];
                                                                                                $carpeta = $ruta;
                                                                                                $src = $carpeta . $file;

                                                                                                if (move_uploaded_file($ruta_provisional, $src)) {
                                                                                                    // echo "Archivo subido correctamente: $file";
                                                                                                    if ($resultado_update) {
                                                                                                        $this->_db3->commit();
                                                                                                        $response = array(
                                                                                                            'numero' => 200,
                                                                                                            'mensaje' => 'Solicitud de estudio para la placa  registrada exitosamente.',
                                                                                                        );
                                                                                                        return $response;
                                                                                                    } else {
                                                                                                        $this->_db3->commit();
                                                                                                        $response = array(
                                                                                                            'numero' => 400,
                                                                                                            'mensaje' => 'No se puedo registrar los datos a actualizar para la placa',
                                                                                                        );
                                                                                                        return $response;
                                                                                                    }
                                                                                                } else {
                                                                                                    // echo "Error al subir el archivo.";
                                                                                                    $response = array(
                                                                                                        'numero' => 400,
                                                                                                        'mensaje' => "Error al subir el archivo.",
                                                                                                    );
                                                                                                    return $response;
                                                                                                }
                                                                                            }
                                                                                            // if ($resultado_update) {
                                                                                            //     $this->_db3->commit();
                                                                                            //     $response = array(
                                                                                            //         'numero' => 200,
                                                                                            //         'mensaje' => 'Solicitud de estudio para la placa  registrada exitosamente.',
                                                                                            //     );
                                                                                            //     return $response;
                                                                                            // } else {
                                                                                            //     $this->_db3->commit();
                                                                                            //     $response = array(
                                                                                            //         'numero' => 400,
                                                                                            //         'mensaje' => 'No se puedo registrar los datos a actualizar para la placa',
                                                                                            //     );
                                                                                            //     return $response;
                                                                                            // }
                                                                                        } else {
                                                                                            echo "No se pudo crear la carpeta 2.";
                                                                                        }
                                                                                    } else {
                                                                                        (int) $tol = count($archivos->tipohojahv);
                                                                                        for ($i = 0; $i < count($archivos->tipohojahv); $i++) {
                                                                                            $inse_update = $this->_db3->prepare("INSERT INTO cmx_actualiza_seguridad(id_sol_prees,tipo_hv,tipo_campo,info_campo,fecha,hora,usuario,ruta_archivo,name_archivo)
                                                                                                                                VALUES(:solicitud,:tipohv,:campo,:dato,:fecha,:hora,:usuario,:ruta_archivo,:name_archivo)");
                                                                                            $inse_update->bindParam(':solicitud', $numdoc);
                                                                                            $inse_update->bindParam(':tipohv', $archivos->tipohojahv[$i]);
                                                                                            $inse_update->bindParam(':campo', $archivos->campos[$i]);
                                                                                            $inse_update->bindParam(':dato', $archivos->datos[$i]);
                                                                                            $inse_update->bindParam(':fecha', $datos['fecha']);
                                                                                            $inse_update->bindParam(':hora', $datos['hora']);
                                                                                            $inse_update->bindParam(':usuario', $datos["usuario"]);
                                                                                            $inse_update->bindParam(':ruta_archivo', $ruta);
                                                                                            $inse_update->bindParam(':name_archivo', $archivos->namearchivo[$i]);
                                                                                            $resultado_update = $inse_update->execute();
                                                                                        }
                                                                                        if ($resultado_update) {
                                                                                            $this->_db3->commit();
                                                                                            $response = array('numero' => 200, 'mensaje' => 'Solicitud de estudio para la placa ' . $datos['placa'] . ' registrada exitosamente.');
                                                                                            return $response;
                                                                                        } else {
                                                                                            $response = array(
                                                                                                'numero' => 400,
                                                                                                'mensaje' => 'No se puedo registrar los datos a actualizar para la placa',
                                                                                            );
                                                                                            return $response;
                                                                                        }
                                                                                    }
                                                                                } else {
                                                                                    //pasar el archivo
                                                                                    $total = count($papeles['name']);
                                                                                    for ($a = 0; $a < $total; $a++) {
                                                                                        if (isset($datos["papeles"])) {
                                                                                            $file = $papeles["name"][$a];
                                                                                            $tipo = $papeles["type"][$a];
                                                                                            $ruta_provisional = $papeles["tmp_name"][$a];
                                                                                            $carpeta = $ruta;
                                                                                            $src = $carpeta . $file;
                                                                                            move_uploaded_file($ruta_provisional, $src);
                                                                                        }
                                                                                    }
                                                                                    if ($resultado_subasta) {
                                                                                        $this->_db3->commit();
                                                                                        $response = array(
                                                                                            'numero' => 200,
                                                                                            'mensaje' => 'Solicitud de estudio para la placa  registrada exitosamente.',
                                                                                        );
                                                                                        return $response;
                                                                                    } else {
                                                                                        $this->_db3->commit();
                                                                                        $response = array(
                                                                                            'numero' => 400,
                                                                                            'mensaje' => 'No se puedo registrar los datos a actualizar para la placa',
                                                                                        );
                                                                                        return $response;
                                                                                    }
                                                                                }
                                                                            } else {
                                                                                /* Cuando se valla a unsertar un prefiltro para un nuevo recurso */
                                                                                // if($datos["nuevo_recurso"]=="si"){}
                                                                                $evalua_pro = $datos_nuevos["propietario_check"];
                                                                                if ($evalua_pro == 'true') {
                                                                                    $checkpro = 1;
                                                                                    $name_pro = $datos_nuevos["nombre_propietario"];
                                                                                    $doc_pro = $datos_nuevos["docu_propi"];
                                                                                } else {
                                                                                    $checkpro = 0;
                                                                                    $name_pro = null;
                                                                                    $doc_pro = null;
                                                                                }
                                                                                $evalua_pose = $datos_nuevos["tipo_posee"];
                                                                                if ($evalua_pose == 'true') {
                                                                                    $checkpose = 1;
                                                                                    $name_pose = $datos_nuevos["nombre_poseedor"];
                                                                                    $doc_pose = $datos_nuevos["docu_posee"];
                                                                                } else {
                                                                                    $checkpose = 0;
                                                                                    $name_pose = null;
                                                                                    $doc_pose = null;
                                                                                }

                                                                                $evalua_veh = $datos_nuevos["vehi_check"];
                                                                                if ($evalua_veh == 'true') {
                                                                                    $checkcarro = 1;
                                                                                    $placa_carro = $datos_nuevos["placa_vehiculo"];
                                                                                    $satelital = $datos_nuevos["satelital"];
                                                                                    $url_satelital = $datos_nuevos["url_satelital"];
                                                                                    $clave_satelital = $datos_nuevos["clave_satelital"];
                                                                                } else {
                                                                                    $checkcarro = 0;
                                                                                    $placa_carro = null;
                                                                                    $satelital = null;
                                                                                    $url_satelital = null;
                                                                                    $clave_satelital = null;
                                                                                }

                                                                                $evalua_trai = $datos_nuevos["trailer_check"];
                                                                                if ($evalua_trai == 'true') {
                                                                                    $checktrai = 1;
                                                                                    $placa_trailer = $datos_nuevos["placa_trailer"];
                                                                                    // $placa_trailer = null;
                                                                                    $pro_trailer = $datos_nuevos["propi_trailer"];
                                                                                    $pro_doctrailer = $datos_nuevos["propidoc_trailer"];
                                                                                } else {
                                                                                    $checktrai = 0;
                                                                                    $placa_trailer = null;
                                                                                    $pro_trailer = null;
                                                                                    $pro_doctrailer = null;
                                                                                }

                                                                                //conductor
                                                                                $evalua_condu = $datos_nuevos["conductor_check"];
                                                                                if ($evalua_condu == 'true') {
                                                                                    $checkcondu = 1;
                                                                                    $name_condu = $datos_nuevos["nombre_conductor"];
                                                                                    $docu_condu = $datos_nuevos["docu_condu"];

                                                                                    $refe1 = $datos_nuevos["refe1"];
                                                                                    $contacto1 = $datos_nuevos["contacto1"];
                                                                                    $celular1 = $datos_nuevos["celular1"];
                                                                                    $cargo1 = $datos_nuevos["cargo1"];
                                                                                    $fechaa1 = empty($datos_nuevos["fechaa1"]) ? null : $datos_nuevos["fechaa1"];
                                                                                    $fechaa2 = empty($datos_nuevos["fechaa2"]) ? null : $datos_nuevos["fechaa2"];
                                                                                    $anti1 = empty($datos_nuevos["anti1"]) ? null : $datos_nuevos["anti1"];

                                                                                    $refe2 = $datos_nuevos["refe2"];
                                                                                    $contacto2 = $datos_nuevos["contacto2"];
                                                                                    $celular2 = $datos_nuevos["celular2"];
                                                                                    $cargo2 = $datos_nuevos["cargo2"];
                                                                                    $fechab1 = empty($datos_nuevos["fechab1"]) ? null : $datos_nuevos["fechab1"];
                                                                                    $fechab2 = empty($datos_nuevos["fechab2"]) ? null : $datos_nuevos["fechab2"];
                                                                                    $anti2 = empty($datos_nuevos["anti2"]) ? null : $datos_nuevos["anti2"];

                                                                                    $refe3 = $datos_nuevos["refe3"];
                                                                                    $contacto3 = $datos_nuevos["contacto3"];
                                                                                    $celular3 = $datos_nuevos["celular3"];
                                                                                    $cargo3 = $datos_nuevos["cargo3"];
                                                                                    $fechac1 = empty($datos_nuevos["fechac1"]) ? null : $datos_nuevos["fechac1"];
                                                                                    $fechac2 = empty($datos_nuevos["fechac2"]) ? null : $datos_nuevos["fechac2"];
                                                                                    $anti3 = empty($datos_nuevos["anti2"]) ? null : $datos_nuevos["anti2"];
                                                                                } else {
                                                                                    $checkcondu = 0;
                                                                                    $name_condu = null;
                                                                                    $docu_condu = null;

                                                                                    $refe1 = null;
                                                                                    $contacto1 = null;
                                                                                    $celular1 = null;
                                                                                    $cargo1 = null;
                                                                                    $fechaa1 = null;
                                                                                    $fechaa2 = null;
                                                                                    $anti1 = null;

                                                                                    $refe2 = null;
                                                                                    $contacto2 = null;
                                                                                    $celular2 = null;
                                                                                    $cargo2 = null;
                                                                                    $fechab1 = null;
                                                                                    $fechab2 = null;
                                                                                    $anti2 = null;

                                                                                    $refe3 = null;
                                                                                    $contacto3 = null;
                                                                                    $celular3 = null;
                                                                                    $cargo3 = null;
                                                                                    $fechac1 = null;
                                                                                    $fechac2 = null;
                                                                                    $anti3 = null;
                                                                                }
                                                                                $this->_db3->prepare("INSERT INTO cmx_prefiltro_actualizar(id,id_solicitud_u,propietario,name_propietario,documento_propietario,poseedor,name_poseedor,documento_poseedor,vehiculo,
                                                                                placa,satelital,clave_satelital,url_satelital,user_satelital,trailer,placa_trailer,name_propietario_trailer,documento_propi_trailer,conductor,name_conductor,documento_conductor,
                                                                                empresa1,persona1,cel1,cargo1,feca1,feca2,antiguedad1,empresa2,persona2,cel2,cargo2,fecb1,fecb2,antiguedad2,empresa3,persona3,cel3,cargo3,fecc1,fecc2,antiguedad3)
                                                                                VALUES(null,:id_solicitud,:prop,:name_propi,:doc_propietario,:tene,:name_poseedor,:docpose,:carro,:placa_carro,:satelite,:clave_sate,:url_satelite,:user_satelital,:trailercheck,
                                                                                :trailerplaca,:nomprotrail,:docuproptrail,:conductor,:namecondu,:doccondu,:ref1,:contacto1,:cel1,:cargo1,:feca1,:feca2,:antigue1,:empresa2,:person2,:celu2,:cargo2,:fechab1,:fechab2,
                                                                                :anti2,:empre3,:contacto3,:celu3,:cargo3,:fecc1,:fecc2,:anti3)")
                                                                                    ->execute(
                                                                                        array(
                                                                                            ':id_solicitud' => $numdoc,
                                                                                            ':prop' => $checkpro,
                                                                                            ':name_propi' => $name_pro,
                                                                                            ':doc_propietario' => $doc_pro,
                                                                                            ':tene' => $checkpose,
                                                                                            ':name_poseedor' => $name_pose,
                                                                                            ':docpose' => $doc_pose,
                                                                                            ':carro' => $checkcarro,
                                                                                            ':placa_carro' => $placa_carro,
                                                                                            ':satelite' => $satelital,
                                                                                            ':clave_sate' => $clave_satelital,
                                                                                            ':url_satelite' => $url_satelital,
                                                                                            ':user_satelital' => $clave_satelital,
                                                                                            ':trailercheck' => $checktrai,
                                                                                            ':trailerplaca' => $placa_trailer,
                                                                                            ':nomprotrail' => $pro_trailer,
                                                                                            ':docuproptrail' => $pro_doctrailer,
                                                                                            ':conductor' => $checkcondu,
                                                                                            ':namecondu' => $name_condu,
                                                                                            ':doccondu' => $docu_condu,
                                                                                            ':ref1' => $refe1,
                                                                                            ':contacto1' => $contacto1,
                                                                                            ':cel1' => $celular1,
                                                                                            ':cargo1' => $cargo1,
                                                                                            ':feca1' => $fechaa1,
                                                                                            ':feca2' => $fechaa2,
                                                                                            ':antigue1' => $anti1,
                                                                                            ':empresa2' => $refe2,
                                                                                            ':person2' => $contacto2,
                                                                                            ':celu2' => $celular2,
                                                                                            ':cargo2' => $cargo2,
                                                                                            ':fechab1' => $fechab1,
                                                                                            ':fechab2' => $fechab2,
                                                                                            ':anti2' => $anti2,
                                                                                            ':empre3' => $refe3,
                                                                                            ':contacto3' => $contacto3,
                                                                                            ':celu3' => $celular3,
                                                                                            ':cargo3' => $cargo3,
                                                                                            ':fecc1' => $fechac1,
                                                                                            ':fecc2' => $fechac2,
                                                                                            ':anti3' => $anti3,
                                                                                        )
                                                                                    );

                                                                                $this->_db3->commit();
                                                                                $response = array(
                                                                                    'numero' => 200,
                                                                                    'mensaje' => 'insert prefiltro en actualizar registrado exitosamente.',
                                                                                );
                                                                                return $response;
                                                                            }
                                                                        } else {
                                                                            $this->_db3->commit();
                                                                            $response = array(
                                                                                'numero' => 200,
                                                                                'mensaje' => 'Solicitud de estudio para la placa  registrada exitosamente.',
                                                                            );
                                                                            return $response;
                                                                        }
                                                                    } else {
                                                                        $this->_db3->commit();
                                                                        $response = array(
                                                                            'numero' => 400,
                                                                            'mensaje' => 'No se puedo registrar la asociacion de estudio para la placa',
                                                                        );
                                                                        return $response;
                                                                    }
                                                                } else {
                                                                    $this->_db3->commit();
                                                                    $response = array(
                                                                        'numero' => 400,
                                                                        'mensaje' => 'No se puedo registrar la subasta temporal de estudio para la placa',
                                                                    );
                                                                    return $response;
                                                                }
                                                            } else {
                                                                $this->_db3->commit();
                                                                $response = array(
                                                                    'numero' => 400,
                                                                    'mensaje' => 'No se puedo registrar log de ss con operaciones',
                                                                );
                                                            }
                                                            // }
                                                        } else {
                                                            $this->_db3->commit();
                                                            $response = array(
                                                                'numero' => 400,
                                                                'mensaje' => 'No se puedo registrar la solicitud de estudio para la placa',
                                                            );
                                                            return $response;
                                                        }
                                                    } else {
                                                        $response = array(
                                                            'numero' => 400,
                                                            'mensaje' => 'No se puedo resgistrar la solicitud de estudio para la placa',
                                                        );
                                                        $mensajeError = "transaccion fallo: insertar estado completo vehiculo" . date("Y-m-d") . $datos["usuario"];
                                                        $er = error_log($mensajeError . "\n", 3, "error_log.txt");
                                                    }
                                                } else {
                                                    $mensajeError = "transaccion fallo: en Actualizar maestro estudio seguridad completo" . date("Y-m-d") . $datos["usuario"];
                                                    $er = error_log($mensajeError . "\n", 3, "error_log.txt");
                                                }
                                            } else {
                                                $mensajeError = "transaccion fallo: en solicitar maestro estudio seguridad completo" . date("Y-m-d") . $datos["usuario"];
                                                $er = error_log($mensajeError . "\n", 3, "error_log.txt");
                                            }
                                        } else {
                                            $response = array(
                                                'numero' => 400,
                                                'mensaje' => 'No se puedo resgistrar la solicitud de estudio para la placa',
                                            );
                                            $mensajeError = "transaccion fallo: insertar estudio vehiculo" . date("Y-m-d") . $datos["usuario"];
                                            $er = error_log($mensajeError . "\n", 3, "error_log.txt");
                                        }
                                    } else {
                                        $mensajeError = "transaccion fallo: en Actualizar maestro estudio seguridad" . date("Y-m-d") . $datos["usuario"];
                                        $er = error_log($mensajeError, 3, "error_log.txt");
                                    }
                                } else {
                                    $mensajeError = "transaccion fallo: en solicitar maestro estudio seguridad" . date("Y-m-d") . $datos["usuario"];
                                    $er = error_log($mensajeError, 3, "error_log.txt");
                                }
                            } else {
                                $this->_db3->commit();
                                $response = array(
                                    'numero' => 400,
                                    'mensaje' => 'No se pudo registrar la consolidacion de solicitudes',
                                );
                                return $response;
                            }
                        } else {
                            $this->_db3->commit();
                            $response = array(
                                'numero' => 400,
                                'mensaje' => 'No actualizo maestro para la agrupacion',
                            );
                            return $response;
                        }
                    }
                } else {
                    //insertar habilitar y actualizar
                    // Consultar maestro de Estudio de seguridad
                    $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='EST_SEG' AND numero_actual>numero_inicial");
                    $resultado_consecutivo = $sql_consecutivo->execute();
                    $resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
                    $numdoc = $resultado_consecutivo['numero_actual'];
                    $numdoc_actualizar = $resultado_consecutivo['numero_actual'] + 1;
                    if ($numdoc) {
                        // Actualizar Maestro de Estudio segurdad
                        $sql_updata_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numdoc_actualizar WHERE tipo='EST_SEG'");
                        $resultado_consecutivo_update = $sql_updata_maestro->execute();
                        if ($resultado_consecutivo_update) {
                            $null = null;
                            $viaje = 1;
                            $itr = 'SI';

                            $sql_insert_estudio_vh = $this->_db3->prepare("INSERT INTO cmx_estudio_vehiculo(id_estudio,id_solicitud,observacion_vehiculo,observacion_conductor,observacion_tenedor,observacion_general,usuario,fecha,hora,operacion,placa,viaje_itr,itr,responsable,empresa_id)
                            VALUES(:id_estudio,:id_solicitud,:observacion_vehiculo,:observacion_conductor,:observacion_tenedor,:observacion_general,:usuario,:fecha,:hora,:operacion,:placa,:viaje_itr,:itr,:responsable,:empresa_id)");
                            $sql_insert_estudio_vh->bindParam(':id_estudio', $numdoc, PDO::PARAM_STR);
                            $sql_insert_estudio_vh->bindParam(':id_solicitud', $numdoc_cabecera, PDO::PARAM_STR);
                            $sql_insert_estudio_vh->bindParam(':observacion_vehiculo', $null, PDO::PARAM_STR);
                            $sql_insert_estudio_vh->bindParam(':observacion_conductor', $null, PDO::PARAM_STR);
                            $sql_insert_estudio_vh->bindParam(':observacion_tenedor', $null, PDO::PARAM_STR);
                            $sql_insert_estudio_vh->bindParam(':observacion_general', $datos['observacion'], PDO::PARAM_STR);
                            $sql_insert_estudio_vh->bindParam(':usuario', $datos["usuario"], PDO::PARAM_STR);
                            $sql_insert_estudio_vh->bindParam(':fecha', $datos["fecha"], PDO::PARAM_STR);
                            $sql_insert_estudio_vh->bindParam(':hora', $datos["hora"], PDO::PARAM_STR);
                            $sql_insert_estudio_vh->bindParam(':operacion', $datos["tipo_operacion"], PDO::PARAM_STR);
                            $sql_insert_estudio_vh->bindParam(':placa', $datos["placa"], PDO::PARAM_STR);
                            $sql_insert_estudio_vh->bindParam(':viaje_itr', $viaje, PDO::PARAM_STR);
                            $sql_insert_estudio_vh->bindParam(':itr', $itr, PDO::PARAM_STR);
                            $sql_insert_estudio_vh->bindParam(':responsable', $datos['responsable_vehiculo'], PDO::PARAM_STR);
                            $sql_insert_estudio_vh->bindParam(':empresa_id', $empresa_id, PDO::PARAM_STR);
                            $resultado_insert_estudio_vh = $sql_insert_estudio_vh->execute();

                            if ($resultado_insert_estudio_vh) {
                                // Consultar maestro de Estudio de seguridad Completo
                                $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='EST_SEG_COMP' AND numero_actual>numero_inicial");
                                $resultado_consecutivo_completo = $sql_consecutivo->execute();
                                $resultado_consecutivo_completo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
                                $numdoc_completo = $resultado_consecutivo_completo['numero_actual'];
                                $numdoc_actualizar_completo = $resultado_consecutivo_completo['numero_actual'] + 1;
                                if ($numdoc_completo) {
                                    $sql_updata_maestro_completo = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numdoc_actualizar_completo WHERE tipo='EST_SEG_COMP'");
                                    $resultado_consecutivo_update_completo = $sql_updata_maestro_completo->execute();
                                    if ($resultado_consecutivo_update_completo) {
                                        $estado_estudio_seguridad = "pendiente_iniciar";
                                        $estado_actu = 1;
                                        $estado_subasta = "Activo";
                                        $observacion = null;
                                        $proceso = "Pen_Sol_Rut";
                                        $sql_conductor_vehiculo = $this->_db3->prepare("SELECT id, id_conductor,numdoc_vehiculo FROM cmx_vehiculos WHERE placa=:placa");
                                        $sql_conductor_vehiculo->bindParam(':placa', $datos["placa"], PDO::PARAM_STR);
                                        $resultado = $sql_conductor_vehiculo->execute();
                                        $resultado = $sql_conductor_vehiculo->fetch(PDO::FETCH_ASSOC);
                                        $sql_insert_estudio_completo = $this->_db3->prepare("INSERT INTO cmx_estudiov_completo(id_estudio_c,id_estudio,estado,id_vehiculo,id_conductor,observacion,proceso,fecha,hora,usuario,estado_actu,estado_subasta)
                                                VALUES(:id_estudio_c,:id_estudio,:estado,:id_vehiculo,:id_conductor,:observacion,:proceso,:fecha,:hora,:usuario,:estado_actu,:estado_subasta)");
                                        $sql_insert_estudio_completo->bindParam(':id_estudio_c', $numdoc_completo, PDO::PARAM_STR);
                                        $sql_insert_estudio_completo->bindParam(':id_estudio', $numdoc, PDO::PARAM_STR);
                                        $sql_insert_estudio_completo->bindParam(':estado', $estado_estudio_seguridad, PDO::PARAM_STR);
                                        $sql_insert_estudio_completo->bindParam(':id_vehiculo', $resultado["numdoc_vehiculo"], PDO::PARAM_STR);
                                        $sql_insert_estudio_completo->bindParam(':id_conductor', $resultado["id_conductor"], PDO::PARAM_STR);
                                        $sql_insert_estudio_completo->bindParam(':observacion', $observacion, PDO::PARAM_STR);
                                        $sql_insert_estudio_completo->bindParam(':proceso', $proceso, PDO::PARAM_STR);
                                        $sql_insert_estudio_completo->bindParam(':fecha', $datos["fecha"], PDO::PARAM_STR);
                                        $sql_insert_estudio_completo->bindParam(':hora', $datos["hora"], PDO::PARAM_STR);
                                        $sql_insert_estudio_completo->bindParam(':usuario', $datos["usuario"], PDO::PARAM_STR);
                                        $sql_insert_estudio_completo->bindParam(':estado_actu', $estado_actu, PDO::PARAM_STR);
                                        $sql_insert_estudio_completo->bindParam(':estado_subasta', $estado_subasta, PDO::PARAM_STR);
                                        $resultado_estudiov_completo = $sql_insert_estudio_completo->execute();
                                        if ($resultado_estudiov_completo) {

                                            $estado_log = "Crear";

                                            $sql_insert_log = $this->_db3->prepare("INSERT INTO cmx_logestudio_com(id_completo,id_estudio,fecha,hora,id_usuario,estado)

                                                    VALUES(:id_completo,:id_estudio,:fecha,:hora,:id_usuario,:estado)");

                                            $sql_insert_log->bindParam(':id_completo', $numdoc_completo, PDO::PARAM_STR);

                                            $sql_insert_log->bindParam(':id_estudio', $numdoc, PDO::PARAM_STR);

                                            $sql_insert_log->bindParam(':fecha', $datos["fecha"], PDO::PARAM_STR);

                                            $sql_insert_log->bindParam(':hora', $datos["hora"], PDO::PARAM_STR);

                                            $sql_insert_log->bindParam(':id_usuario', $datos["usuario"], PDO::PARAM_STR);

                                            $sql_insert_log->bindParam(':estado', $estado_log, PDO::PARAM_STR);

                                            $resultado_estudio_log = $sql_insert_log->execute();

                                            if ($resultado_estudio_log) {

                                                //registrar solicitudes de servicio

                                                $estss = 1;
                                                $p = 'E';
                                                $solicitudes = $datos["solicitudes"];

                                                foreach ($solicitudes as $value) {

                                                    $sqlss = $this->_db3->prepare("INSERT INTO cmx_preestudio_solicitudes_servicio(id,id_servicio_cliente,id_solicitudpreestudio,fecha,hora,usuario,es,clasificacion)

                                                            VALUES(null,:servicio,:idsolicitud,:fecha,:hora,:usuario,:es,:p)");

                                                    $sqlss->bindParam(':servicio', $value);

                                                    $sqlss->bindParam(':idsolicitud', $numdoc);

                                                    $sqlss->bindParam(':fecha', $datos['fecha']);

                                                    $sqlss->bindParam(':hora', $datos['hora']);

                                                    $sqlss->bindParam(':usuario', $datos["usuario"]);

                                                    $sqlss->bindParam(':es', $estss);
                                                    $sqlss->bindParam(':p', $p);

                                                    $resultado_solicitudes_servicio = $sqlss->execute();
                                                }

                                                if ($resultado_solicitudes_servicio) {
                                                    foreach ($solicitudes as $value) {
                                                        $estado_sql = 'asignada';
                                                        $sqlo = $this->_db3->prepare("INSERT INTO cmx_log_solicitudvehiculo(id,id_solictud,user_log,fecha_asignacion,hora_asignacion,estado)
                                                            VALUES(null,:servicio,:usuario,:fecha,:hora,:statu)");
                                                        $sqlo->bindParam(':servicio', $value);
                                                        $sqlo->bindParam(':usuario', $datos["usuario"]);
                                                        $sqlo->bindParam(':fecha', $datos['fecha']);
                                                        $sqlo->bindParam(':hora', $datos['hora']);
                                                        $sqlo->bindParam(':statu', $estado_sql);
                                                        $resultado_log = $sqlo->execute();
                                                    }
                                                    if ($resultado_log) {
                                                        $valor = 0;
                                                        $sql_subasta = $this->_db3->prepare("INSERT INTO cmx_subasta_temporal(id,fecha_inicio,numero_estudio,placa,flete,tarifa)
                                                                VALUES(null,:fechasu,:numerosu,:placa_su,:fletesu,:tarifasu)");
                                                        $sql_subasta->bindParam(':fechasu', $datos["fecha"]);
                                                        $sql_subasta->bindParam(':numerosu', $numdoc);
                                                        $sql_subasta->bindParam(':placa_su', $datos["placa"]);
                                                        $sql_subasta->bindParam(':fletesu', $datos["flete"]);
                                                        $sql_subasta->bindParam(':tarifasu', $datos["tarifa"]);
                                                        $resultado_subasta = $sql_subasta->execute();
                                                        if ($resultado_subasta) {
                                                            if ($datos["tipo_operacion"] == 'Actualizar') {
                                                                if ($datos["dinamicos"] == "si") {
                                                                    $id_s = $numdoc;
                                                                    $papeles = $datos["papeles"];
                                                                    $archivos = $datos["archivos"];
                                                                    $ruta = 'public/files/seguridad_actualiza/' . $id_s . '/';
                                                                    // $total = count($papeles);
                                                                    if (!is_dir($ruta)) {
                                                                        // Crear la carpeta
                                                                        if ($papeles !== "Sin_datos") {
                                                                            if (mkdir($ruta, 0777, true)) {
                                                                                (int) $tol = count($archivos->tipohojahv);
                                                                                for ($i = 0; $i < count($archivos->tipohojahv); $i++) {
                                                                                    $inse_update = $this->_db3->prepare("INSERT INTO cmx_actualiza_seguridad(id_sol_prees,tipo_hv,tipo_campo,info_campo,fecha,hora,usuario,ruta_archivo,name_archivo)
                                                                                                                                                                                    VALUES(:solicitud,:tipohv,:campo,:dato,:fecha,:hora,:usuario,:ruta_archivo,:name_archivo)");
                                                                                    $inse_update->bindParam(':solicitud', $numdoc);
                                                                                    $inse_update->bindParam(':tipohv', $archivos->tipohojahv[$i]);
                                                                                    $inse_update->bindParam(':campo', $archivos->campos[$i]);
                                                                                    $inse_update->bindParam(':dato', $archivos->datos[$i]);
                                                                                    $inse_update->bindParam(':fecha', $datos['fecha']);
                                                                                    $inse_update->bindParam(':hora', $datos['hora']);
                                                                                    $inse_update->bindParam(':usuario', $datos["usuario"]);
                                                                                    $inse_update->bindParam(':ruta_archivo', $ruta);
                                                                                    $inse_update->bindParam(':name_archivo', $archivos->namearchivo[$i]);
                                                                                    $resultado_update = $inse_update->execute();
                                                                                }
                                                                                //pasar el archivo
                                                                                // Si $papeles['name'] es un array, entonces es una carga de múltiples archivos
                                                                                if (is_array($papeles['name'])) {
                                                                                    // Recorrer los archivos subidos
                                                                                    foreach ($papeles['name'] as $key => $fileName) {
                                                                                        $ruta_provisional = $papeles['tmp_name'][$key]; // Obtener la ruta temporal del archivo
                                                                                        $carpeta = $ruta;
                                                                                        $src = $carpeta . $fileName;

                                                                                        // Verificar que la carga del archivo fue exitosa
                                                                                        if (move_uploaded_file($ruta_provisional, $src)) {
                                                                                            if ($resultado_update) {
                                                                                                $this->_db3->commit();
                                                                                                $response = array(
                                                                                                    'numero' => 200,
                                                                                                    'mensaje' => 'Solicitud de estudio para la placa  registrada exitosamente.',
                                                                                                );
                                                                                                return $response;
                                                                                            } else {
                                                                                                $this->_db3->commit();
                                                                                                $response = array(
                                                                                                    'numero' => 400,
                                                                                                    'mensaje' => 'No se puedo registrar los datos a actualizar para la placa',
                                                                                                );
                                                                                                return $response;
                                                                                            }
                                                                                        } else {
                                                                                            // echo "Error al subir el archivo: $fileName";
                                                                                            $response = array(
                                                                                                'numero' => 400,
                                                                                                'mensaje' => "Error al subir el archivo: $fileName",
                                                                                            );
                                                                                            return $response;
                                                                                        }
                                                                                    }
                                                                                } else {
                                                                                    // Si solo es un archivo (sin atributo multiple)
                                                                                    $file = $papeles['name'];
                                                                                    $ruta_provisional = $papeles['tmp_name'];
                                                                                    $carpeta = $ruta;
                                                                                    $src = $carpeta . $file;

                                                                                    if (move_uploaded_file($ruta_provisional, $src)) {
                                                                                        // echo "Archivo subido correctamente: $file";
                                                                                        if ($resultado_update) {
                                                                                            $this->_db3->commit();
                                                                                            $response = array(
                                                                                                'numero' => 200,
                                                                                                'mensaje' => 'Solicitud de estudio para la placa  registrada exitosamente.',
                                                                                            );
                                                                                            return $response;
                                                                                        } else {
                                                                                            $this->_db3->commit();
                                                                                            $response = array(
                                                                                                'numero' => 400,
                                                                                                'mensaje' => 'No se puedo registrar los datos a actualizar para la placa',
                                                                                            );
                                                                                            return $response;
                                                                                        }
                                                                                    } else {
                                                                                        // echo "Error al subir el archivo.";
                                                                                        $response = array(
                                                                                            'numero' => 400,
                                                                                            'mensaje' => "Error al subir el archivo.",
                                                                                        );
                                                                                        return $response;
                                                                                    }
                                                                                }
                                                                            } else {
                                                                                // echo "No se pudo crear la carpeta 2.";
                                                                                $response = array(
                                                                                    'numero' => 400,
                                                                                    'mensaje' => "No se pudo crear la carpeta.",
                                                                                );
                                                                                return $response;
                                                                            }
                                                                        } else {
                                                                            (int) $tol = count($archivos->tipohojahv);
                                                                            for ($i = 0; $i < count($archivos->tipohojahv); $i++) {
                                                                                $inse_update = $this->_db3->prepare("INSERT INTO cmx_actualiza_seguridad(id_sol_prees,tipo_hv,tipo_campo,info_campo,fecha,hora,usuario,ruta_archivo,name_archivo)
                                                                                                                    VALUES(:solicitud,:tipohv,:campo,:dato,:fecha,:hora,:usuario,:ruta_archivo,:name_archivo)");
                                                                                $inse_update->bindParam(':solicitud', $numdoc);
                                                                                $inse_update->bindParam(':tipohv', $archivos->tipohojahv[$i]);
                                                                                $inse_update->bindParam(':campo', $archivos->campos[$i]);
                                                                                $inse_update->bindParam(':dato', $archivos->datos[$i]);
                                                                                $inse_update->bindParam(':fecha', $datos['fecha']);
                                                                                $inse_update->bindParam(':hora', $datos['hora']);
                                                                                $inse_update->bindParam(':usuario', $datos["usuario"]);
                                                                                $inse_update->bindParam(':ruta_archivo', $ruta);
                                                                                $inse_update->bindParam(':name_archivo', $archivos->namearchivo[$i]);
                                                                                $resultado_update = $inse_update->execute();
                                                                            }
                                                                            if ($resultado_update) {
                                                                                $this->_db3->commit();
                                                                                $response = array('numero' => 200, 'mensaje' => 'Solicitud de estudio para la placa ' . $datos['placa'] . ' registrada exitosamente.');
                                                                                return $response;
                                                                            } else {
                                                                                $response = array(
                                                                                    'numero' => 400,
                                                                                    'mensaje' => 'No se puedo registrar los datos a actualizar para la placa',
                                                                                );
                                                                                return $response;
                                                                            }
                                                                        }
                                                                    } else {
                                                                        //pasar el archivo
                                                                        $total = count($papeles['name']);
                                                                        for ($a = 0; $a < $total; $a++) {
                                                                            if (isset($datos["papeles"])) {
                                                                                $file = $papeles["name"][$a];
                                                                                $tipo = $papeles["type"][$a];
                                                                                $ruta_provisional = $papeles["tmp_name"][$a];
                                                                                $carpeta = $ruta;
                                                                                $src = $carpeta . $file;
                                                                                move_uploaded_file($ruta_provisional, $src);
                                                                            }
                                                                        }
                                                                        if ($resultado_subasta) {
                                                                            $this->_db3->commit();
                                                                            $response = array(
                                                                                'numero' => 200,
                                                                                'mensaje' => 'Solicitud de estudio para la placa  registrada exitosamente.',
                                                                            );
                                                                            return $response;
                                                                        } else {
                                                                            $this->_db3->commit();
                                                                            $response = array(
                                                                                'numero' => 400,
                                                                                'mensaje' => 'No se puedo registrar los datos a actualizar para la placa',
                                                                            );
                                                                            return $response;
                                                                        }
                                                                    }
                                                                } else {
                                                                    /* Cuando se valla a unsertar un prefiltro para un nuevo recurso */
                                                                    $evalua_pro = $datos_nuevos["propietario_check"];
                                                                    if ($evalua_pro == 'true') {
                                                                        $checkpro = 1;
                                                                        $name_pro = $datos_nuevos["nombre_propietario"];
                                                                        $doc_pro = $datos_nuevos["docu_propi"];
                                                                    } else {
                                                                        $checkpro = 0;
                                                                        $name_pro = null;
                                                                        $doc_pro = null;
                                                                    }
                                                                    $evalua_pose = $datos_nuevos["tipo_posee"];
                                                                    if ($evalua_pose == 'true') {
                                                                        $checkpose = 1;
                                                                        $name_pose = $datos_nuevos["nombre_poseedor"];
                                                                        $doc_pose = $datos_nuevos["docu_posee"];
                                                                    } else {
                                                                        $checkpose = 0;
                                                                        $name_pose = null;
                                                                        $doc_pose = null;
                                                                    }

                                                                    $evalua_veh = $datos_nuevos["vehi_check"];
                                                                    if ($evalua_veh == 'true') {
                                                                        $checkcarro = 1;
                                                                        $placa_carro = $datos_nuevos["placa_vehiculo"];
                                                                        $satelital = $datos_nuevos["satelital"];
                                                                        $url_satelital = $datos_nuevos["url_satelital"];
                                                                        $clave_satelital = $datos_nuevos["clave_satelital"];
                                                                    } else {
                                                                        $checkcarro = 0;
                                                                        $placa_carro = null;
                                                                        $satelital = null;
                                                                        $url_satelital = null;
                                                                        $clave_satelital = null;
                                                                    }

                                                                    $evalua_trai = $datos_nuevos["trailer_check"];
                                                                    if ($evalua_trai == 'true') {
                                                                        $checktrai = 1;
                                                                        $placa_trailer = $datos_nuevos["placa_trailer"];
                                                                        $pro_trailer = $datos_nuevos["propi_trailer"];
                                                                        $pro_doctrailer = $datos_nuevos["propidoc_trailer"];
                                                                    } else {
                                                                        $checktrai = 0;
                                                                        $placa_trailer = null;
                                                                        $pro_trailer = null;
                                                                        $pro_doctrailer = null;
                                                                    }

                                                                    //conductor
                                                                    $evalua_condu = $datos_nuevos["conductor_check"];
                                                                    if ($evalua_condu == 'true') {
                                                                        $checkcondu = 1;
                                                                        $name_condu = $datos_nuevos["nombre_conductor"];
                                                                        $docu_condu = $datos_nuevos["docu_condu"];

                                                                        $refe1 = $datos_nuevos["refe1"];
                                                                        $contacto1 = $datos_nuevos["contacto1"];
                                                                        $celular1 = $datos_nuevos["celular1"];
                                                                        $cargo1 = $datos_nuevos["cargo1"];
                                                                        $fechaa1 = empty($datos_nuevos["fechaa1"]) ? null : $datos_nuevos["fechaa1"];
                                                                        $fechaa2 = empty($datos_nuevos["fechaa2"]) ? null : $datos_nuevos["fechaa2"];
                                                                        $anti1 = empty($datos_nuevos["anti1"]) ? null : $datos_nuevos["anti1"];

                                                                        $refe2 = $datos_nuevos["refe2"];
                                                                        $contacto2 = $datos_nuevos["contacto2"];
                                                                        $celular2 = $datos_nuevos["celular2"];
                                                                        $cargo2 = $datos_nuevos["cargo2"];
                                                                        $fechab1 = empty($datos_nuevos["fechab1"]) ? null : $datos_nuevos["fechab1"];
                                                                        $fechab2 = empty($datos_nuevos["fechab2"]) ? null : $datos_nuevos["fechab2"];
                                                                        $anti2 = empty($datos_nuevos["anti2"]) ? null : $datos_nuevos["anti2"];

                                                                        $refe3 = $datos_nuevos["refe3"];
                                                                        $contacto3 = $datos_nuevos["contacto3"];
                                                                        $celular3 = $datos_nuevos["celular3"];
                                                                        $cargo3 = $datos_nuevos["cargo3"];
                                                                        $fechac1 = empty($datos_nuevos["fechac1"]) ? null : $datos_nuevos["fechac1"];
                                                                        $fechac2 = empty($datos_nuevos["fechac2"]) ? null : $datos_nuevos["fechac2"];
                                                                        $anti3 = empty($datos_nuevos["anti2"]) ? null : $datos_nuevos["anti2"];
                                                                    } else {
                                                                        $checkcondu = 0;
                                                                        $name_condu = null;
                                                                        $docu_condu = null;

                                                                        $refe1 = null;
                                                                        $contacto1 = null;
                                                                        $celular1 = null;
                                                                        $cargo1 = null;
                                                                        $fechaa1 = null;
                                                                        $fechaa2 = null;
                                                                        $anti1 = null;

                                                                        $refe2 = null;
                                                                        $contacto2 = null;
                                                                        $celular2 = null;
                                                                        $cargo2 = null;
                                                                        $fechab1 = null;
                                                                        $fechab2 = null;
                                                                        $anti2 = null;

                                                                        $refe3 = null;
                                                                        $contacto3 = null;
                                                                        $celular3 = null;
                                                                        $cargo3 = null;
                                                                        $fechac1 = null;
                                                                        $fechac2 = null;
                                                                        $anti3 = null;
                                                                    }
                                                                    $this->_db3->prepare("INSERT INTO cmx_prefiltro_actualizar(id,id_solicitud_u,propietario,name_propietario,documento_propietario,poseedor,name_poseedor,documento_poseedor,vehiculo,
                                                                    placa,satelital,clave_satelital,url_satelital,user_satelital,trailer,placa_trailer,name_propietario_trailer,documento_propi_trailer,conductor,name_conductor,documento_conductor,
                                                                    empresa1,persona1,cel1,cargo1,feca1,feca2,antiguedad1,empresa2,persona2,cel2,cargo2,fecb1,fecb2,antiguedad2,empresa3,persona3,cel3,cargo3,fecc1,fecc2,antiguedad3)
                                                                    VALUES(null,:id_solicitud,:prop,:name_propi,:doc_propietario,:tene,:name_poseedor,:docpose,:carro,:placa_carro,:satelite,:clave_sate,:url_satelite,:user_satelital,:trailercheck,
                                                                    :trailerplaca,:nomprotrail,:docuproptrail,:conductor,:namecondu,:doccondu,:ref1,:contacto1,:cel1,:cargo1,:feca1,:feca2,:antigue1,:empresa2,:person2,:celu2,:cargo2,:fechab1,:fechab2,
                                                                    :anti2,:empre3,:contacto3,:celu3,:cargo3,:fecc1,:fecc2,:anti3)")
                                                                        ->execute(
                                                                            array(
                                                                                ':id_solicitud' => $numdoc,
                                                                                ':prop' => $checkpro,
                                                                                ':name_propi' => $name_pro,
                                                                                ':doc_propietario' => $doc_pro,
                                                                                ':tene' => $checkpose,
                                                                                ':name_poseedor' => $name_pose,
                                                                                ':docpose' => $doc_pose,
                                                                                ':carro' => $checkcarro,
                                                                                ':placa_carro' => $placa_carro,
                                                                                ':satelite' => $satelital,
                                                                                ':clave_sate' => $clave_satelital,
                                                                                ':url_satelite' => $url_satelital,
                                                                                ':user_satelital' => $clave_satelital,
                                                                                ':trailercheck' => $checktrai,
                                                                                ':trailerplaca' => $placa_trailer,
                                                                                ':nomprotrail' => $pro_trailer,
                                                                                ':docuproptrail' => $pro_doctrailer,
                                                                                ':conductor' => $checkcondu,
                                                                                ':namecondu' => $name_condu,
                                                                                ':doccondu' => $docu_condu,
                                                                                ':ref1' => $refe1,
                                                                                ':contacto1' => $contacto1,
                                                                                ':cel1' => $celular1,
                                                                                ':cargo1' => $cargo1,
                                                                                ':feca1' => $fechaa1,
                                                                                ':feca2' => $fechaa2,
                                                                                ':antigue1' => $anti1,
                                                                                ':empresa2' => $refe2,
                                                                                ':person2' => $contacto2,
                                                                                ':celu2' => $celular2,
                                                                                ':cargo2' => $cargo2,
                                                                                ':fechab1' => $fechab1,
                                                                                ':fechab2' => $fechab2,
                                                                                ':anti2' => $anti2,
                                                                                ':empre3' => $refe3,
                                                                                ':contacto3' => $contacto3,
                                                                                ':celu3' => $celular3,
                                                                                ':cargo3' => $cargo3,
                                                                                ':fecc1' => $fechac1,
                                                                                ':fecc2' => $fechac2,
                                                                                ':anti3' => $anti3,
                                                                            )
                                                                        );

                                                                    $this->_db3->commit();
                                                                    $response = array(
                                                                        'numero' => 200,
                                                                        'mensaje' => 'insert prefiltro en actualizar registrado exitosamente.',
                                                                    );
                                                                    return $response;
                                                                }
                                                                // $id_s = $numdoc;
                                                                // $papeles = $datos["papeles"];
                                                                // $archivos = $datos["archivos"];
                                                                // $ruta = 'public/files/seguridad_actualiza/' . $id_s . '/';
                                                                // // $total1 = count($datos['tipohv_ac']);
                                                                // if (!is_dir($ruta)) {
                                                                //     // Crear la carpeta
                                                                //     if ($papeles !== "Sin_datos") {
                                                                //         if (mkdir($ruta, 0777, true)) {
                                                                //             for ($i = 0; $i < count($archivos->tipohojahv); $i++) {
                                                                //                 $inse_update = $this->_db3->prepare("INSERT INTO cmx_actualiza_seguridad(id_sol_prees,tipo_hv,tipo_campo,info_campo,fecha,hora,usuario,ruta_archivo,name_archivo)
                                                                //                 VALUES(:solicitud,:tipohv,:campo,:dato,:fecha,:hora,:usuario,:ruta_archivo,:name_archivo)");
                                                                //                 $inse_update->bindParam(':solicitud', $numdoc);
                                                                //                 $inse_update->bindParam(':tipohv', $archivos->tipohojahv[$i]);
                                                                //                 $inse_update->bindParam(':campo', $archivos->campos[$i]);
                                                                //                 $inse_update->bindParam(':dato', $archivos->datos[$i]);
                                                                //                 $inse_update->bindParam(':fecha', $datos['fecha']);
                                                                //                 $inse_update->bindParam(':hora', $datos['hora']);
                                                                //                 $inse_update->bindParam(':usuario', $datos["usuario"]);
                                                                //                 $inse_update->bindParam(':ruta_archivo', $ruta);
                                                                //                 $inse_update->bindParam(':name_archivo', $archivos->namearchivo[$i]);
                                                                //                 $resultado_update = $inse_update->execute();
                                                                //             }
                                                                //             //pasar el archivo
                                                                //             // $total = count($papeles['name']);
                                                                //             $total = count(isset($papeles) ? $papeles : $papeles["name"]);
                                                                //             for ($a = 0; $a < $total; $a++) {
                                                                //                 if (isset($datos["papeles"])) {
                                                                //                     $file = $papeles["name"][$a];
                                                                //                     $tipo = $papeles["type"][$a];
                                                                //                     $ruta_provisional = $papeles["tmp_name"][$a];
                                                                //                     $carpeta = $ruta;
                                                                //                     $src = $carpeta . $file;
                                                                //                     move_uploaded_file($ruta_provisional, $src);
                                                                //                 }
                                                                //             }
                                                                //             if ($resultado_update) {
                                                                //                 $this->_db3->commit();
                                                                //                 $response = array(
                                                                //                     'numero' => 200,
                                                                //                     'mensaje' => 'Solicitud de estudio para la placa ' . $datos['placa'] . ' registrada exitosamente.',
                                                                //                 );
                                                                //                 return $response;
                                                                //             } else {
                                                                //                 $this->_db3->commit();
                                                                //                 $response = array(
                                                                //                     'numero' => 400,
                                                                //                     'mensaje' => 'No se puedo registrar los datos a actualizar para la placa <strong>' . $datos['placa'] . '</strong>',
                                                                //                 );
                                                                //                 return $response;
                                                                //             }
                                                                //         } else {
                                                                //             echo "No se pudo crear la carpeta 2.";
                                                                //         }
                                                                //     } else {
                                                                //         $this->_db3->commit();
                                                                //         $response = array(
                                                                //             'numero' => 200,
                                                                //             'mensaje' => 'Solicitud de estudio para la placa ' . $datos['placa'] . ' registrada exitosamente.',
                                                                //         );
                                                                //         return $response;
                                                                //     }
                                                                // } else {
                                                                //     //pasar el archivo
                                                                //     $total = count($papeles['name']);
                                                                //     for ($a = 0; $a < $total; $a++) {
                                                                //         if (isset($datos["papeles"])) {
                                                                //             $file = $papeles["name"][$a];
                                                                //             $tipo = $papeles["type"][$a];
                                                                //             $ruta_provisional = $papeles["tmp_name"][$a];
                                                                //             $carpeta = $ruta;
                                                                //             $src = $carpeta . $file;
                                                                //             move_uploaded_file($ruta_provisional, $src);
                                                                //         }
                                                                //     }

                                                                //     if ($resultado_subasta) {
                                                                //         $this->_db3->commit();
                                                                //         $response = array(
                                                                //             'numero' => 200,
                                                                //             'mensaje' => 'Solicitud de estudio para la placa ' . $datos['placa'] . ' registrada exitosamente.',
                                                                //         );
                                                                //         return $response;
                                                                //     } else {
                                                                //         $this->_db3->commit();
                                                                //         $response = array(
                                                                //             'numero' => 400,
                                                                //             'mensaje' => 'No se puedo registrar los datos a actualizar para la placa <strong>' . $datos['placa'] . '</strong>',
                                                                //         );
                                                                //         return $response;
                                                                //     }
                                                                // }
                                                            } else {
                                                                $this->_db3->commit();
                                                                $response = array(
                                                                    'numero' => 200,
                                                                    'mensaje' => 'Solicitud de estudio para la placa ' . $datos['placa'] . ' registrada exitosamente.',
                                                                );
                                                                return $response;
                                                            }
                                                        } else {

                                                            $this->_db3->commit();

                                                            $response = array(

                                                                'numero' => 400,

                                                                'mensaje' => 'No se puedo registrar la asociacion de estudio',

                                                            );

                                                            return $response;
                                                        }
                                                    } else {
                                                        $this->_db3->commit();
                                                        $response = array(
                                                            'numero' => 400,
                                                            'mensaje' => 'No se pudo registrar ss para operaciones',
                                                        );
                                                        return $response;
                                                    }
                                                } else {

                                                    $this->_db3->commit();

                                                    $response = array(
                                                        'numero' => 400,
                                                        'mensaje' => 'No se puedo registrar la subasta temporal de estudio',
                                                    );
                                                    return $response;
                                                }
                                                //}
                                            } else {

                                                $this->_db3->commit();
                                                $response = array(
                                                    'numero' => 400,
                                                    'mensaje' => 'No se puedo registrar la solicitud de estudio',
                                                );
                                                return $response;
                                            }
                                        } else {

                                            $response = array(
                                                'numero' => 400,
                                                'mensaje' => 'No se puedo resgistrar la solicitud de estudio',
                                            );

                                            $mensajeError = "transaccion fallo: insertar estado completo vehiculo" . date("Y-m-d") . $datos["usuario"];
                                            error_log($mensajeError . "\n", 3, "error_log.txt");
                                        }
                                    } else {
                                        $mensajeError = "transaccion fallo: en Actualizar maestro estudio seguridad completo" . date("Y-m-d") . $datos["usuario"];
                                        error_log($mensajeError . "\n", 3, "error_log.txt");
                                    }
                                } else {
                                    $mensajeError = "transaccion fallo: en solicitar maestro estudio seguridad completo" . date("Y-m-d") . $datos["usuario"];
                                    error_log($mensajeError . "\n", 3, "error_log.txt");
                                }
                            } else {
                                $response = array(
                                    'numero' => 400,
                                    'mensaje' => 'No se puedo resgistrar la solicitud de estudio',
                                );
                                $mensajeError = "transaccion fallo: insertar estudio vehiculo" . date("Y-m-d") . $datos["usuario"];
                                error_log($mensajeError . "\n", 3, "error_log.txt");
                            }
                        } else {
                            $mensajeError = "transaccion fallo: en Actualizar maestro estudio seguridad" . date("Y-m-d") . $datos["usuario"];
                            error_log($mensajeError . "\n", 3, "error_log.txt");
                        }
                    } else {
                        $mensajeError = "transaccion fallo: en solicitar maestro estudio seguridad" . date("Y-m-d") . $datos["usuario"];
                        error_log($mensajeError . "\n", 3, "error_log.txt");
                    }
                }
            }
        } catch (\Throwable $th) {
            // Si ocurre algún error, deshacemos la transacción
            $this->_db3->rollBack();
            echo "Error en la transacción: " . $th->getMessage();
            $mensajeError = $th->getMessage() . date("Y-m-d") . $datos["usuario"];
            error_log($mensajeError . "\n", 3, "error_log.txt");
        }
    }

    public function insert_estudio_itr_subasta($datos)
    {
        $response = [];
        $this->_db3->beginTransaction();
        try {
            //insertar habilitar y actualizar
            // Consultar maestro de Estudio de seguridad
            $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='EST_SEG' AND numero_actual>numero_inicial");
            $resultado_consecutivo = $sql_consecutivo->execute();
            $resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
            $numdoc = $resultado_consecutivo['numero_actual'];
            $numdoc_actualizar = $resultado_consecutivo['numero_actual'] + 1;
            if ($numdoc) {
                // Actualizar Maestro de Estudio segurdad
                $sql_updata_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numdoc_actualizar WHERE tipo='EST_SEG'");
                $resultado_consecutivo_update = $sql_updata_maestro->execute();
                $sql_placa = $this->_db3->prepare("SELECT placa, viaje_itr,id_estudio FROM cmx_estudio_vehiculo WHERE placa=:placa ORDER BY id_estudio DESC  LIMIT 1");
                $sql_placa->bindParam(':placa', $datos["placa"]);
                // $sql_placa->bindParam(':fecha_actual', $fecha);
                $sql_placa->execute();
                $resultado_placa = $sql_placa->fetch(PDO::FETCH_ASSOC);
                if ($resultado_consecutivo_update) {
                    $null = null;
                    $viaje = 1;
                    $itr = 'SI';
                    $sql_insert_estudio_vh = $this->_db3->prepare("INSERT INTO cmx_estudio_vehiculo(id_estudio,id_solicitud,observacion_vehiculo,observacion_conductor,observacion_tenedor,usuario,fecha,hora,operacion,placa,viaje_itr,itr,responsable,empresa_id)
                                                    VALUES(:id_estudio,:id_solicitud,:observacion_vehiculo,:observacion_conductor,:observacion_tenedor,:usuario,:fecha,:hora,:operacion,:placa,:viaje_itr,:itr,:responsable,:empresa_id)");
                    $sql_insert_estudio_vh->bindParam(':id_estudio', $numdoc, PDO::PARAM_STR);
                    $sql_insert_estudio_vh->bindParam(':id_solicitud', $numdoc_cabecera, PDO::PARAM_STR);
                    $sql_insert_estudio_vh->bindParam(':observacion_vehiculo', $null, PDO::PARAM_STR);
                    $sql_insert_estudio_vh->bindParam(':observacion_conductor', $null, PDO::PARAM_STR);
                    $sql_insert_estudio_vh->bindParam(':observacion_tenedor', $null, PDO::PARAM_STR);
                    $sql_insert_estudio_vh->bindParam(':usuario', $datos["usuario"], PDO::PARAM_STR);
                    $sql_insert_estudio_vh->bindParam(':fecha', $datos["fecha"], PDO::PARAM_STR);
                    $sql_insert_estudio_vh->bindParam(':hora', $datos["hora"], PDO::PARAM_STR);
                    $sql_insert_estudio_vh->bindParam(':operacion', $datos["tipo_operacion"], PDO::PARAM_STR);
                    $sql_insert_estudio_vh->bindParam(':placa', $datos["placa"], PDO::PARAM_STR);
                    $sql_insert_estudio_vh->bindParam(':viaje_itr', $viaje, PDO::PARAM_STR);
                    $sql_insert_estudio_vh->bindParam(':itr', $itr, PDO::PARAM_STR);
                    $sql_insert_estudio_vh->bindParam(':responsable', $datos['responsable_vehiculo'], PDO::PARAM_STR);
                    $sql_insert_estudio_vh->bindParam(':empresa_id', $datos['empresa_cliente'], PDO::PARAM_STR);
                    $resultado_insert_estudio_vh = $sql_insert_estudio_vh->execute();
                    if ($resultado_insert_estudio_vh) {
                        // Consultar maestro de Estudio de seguridad Completo
                        $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='EST_SEG_COMP' AND numero_actual>numero_inicial");
                        $resultado_consecutivo_completo = $sql_consecutivo->execute();
                        $resultado_consecutivo_completo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
                        $numdoc_completo = $resultado_consecutivo_completo['numero_actual'];
                        $numdoc_actualizar_completo = $resultado_consecutivo_completo['numero_actual'] + 1;
                        if ($numdoc_completo) {
                            $sql_updata_maestro_completo = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numdoc_actualizar_completo WHERE tipo='EST_SEG_COMP'");
                            $resultado_consecutivo_update_completo = $sql_updata_maestro_completo->execute();
                            if ($resultado_consecutivo_update_completo) {
                                $estado_estudio_seguridad = "pendiente_iniciar";
                                $estado_actu = 1;
                                $estado_subasta = "Activo";
                                $observacion = null;
                                $proceso = "Pen_Sol_Rut";
                                $sql_conductor_vehiculo = $this->_db3->prepare("SELECT id, id_conductor,numdoc_vehiculo FROM cmx_vehiculos WHERE placa=:placa");
                                $sql_conductor_vehiculo->bindParam(':placa', $datos["placa"], PDO::PARAM_STR);
                                $resultado = $sql_conductor_vehiculo->execute();
                                $resultado = $sql_conductor_vehiculo->fetch(PDO::FETCH_ASSOC);
                                $sql_insert_estudio_completo = $this->_db3->prepare("INSERT INTO cmx_estudiov_completo(id_estudio_c,id_estudio,estado,id_vehiculo,id_conductor,observacion,proceso,fecha,hora,usuario,estado_actu,estado_subasta)
                                                VALUES(:id_estudio_c,:id_estudio,:estado,:id_vehiculo,:id_conductor,:observacion,:proceso,:fecha,:hora,:usuario,:estado_actu,:estado_subasta)");
                                $sql_insert_estudio_completo->bindParam(':id_estudio_c', $numdoc_completo, PDO::PARAM_STR);
                                $sql_insert_estudio_completo->bindParam(':id_estudio', $numdoc, PDO::PARAM_STR);
                                $sql_insert_estudio_completo->bindParam(':estado', $estado_estudio_seguridad, PDO::PARAM_STR);
                                $sql_insert_estudio_completo->bindParam(':id_vehiculo', $resultado["numdoc_vehiculo"], PDO::PARAM_STR);
                                $sql_insert_estudio_completo->bindParam(':id_conductor', $resultado["id_conductor"], PDO::PARAM_STR);
                                $sql_insert_estudio_completo->bindParam(':observacion', $observacion, PDO::PARAM_STR);
                                $sql_insert_estudio_completo->bindParam(':proceso', $proceso, PDO::PARAM_STR);
                                $sql_insert_estudio_completo->bindParam(':fecha', $datos["fecha"], PDO::PARAM_STR);
                                $sql_insert_estudio_completo->bindParam(':hora', $datos["hora"], PDO::PARAM_STR);
                                $sql_insert_estudio_completo->bindParam(':usuario', $datos["usuario"], PDO::PARAM_STR);
                                $sql_insert_estudio_completo->bindParam(':estado_actu', $estado_actu, PDO::PARAM_STR);
                                $sql_insert_estudio_completo->bindParam(':estado_subasta', $estado_subasta, PDO::PARAM_STR);
                                $resultado_estudiov_completo = $sql_insert_estudio_completo->execute();
                                if ($resultado_estudiov_completo) {
                                    $estado_log = "Crear";
                                    $sql_insert_log = $this->_db3->prepare("INSERT INTO cmx_logestudio_com(id_completo,id_estudio,fecha,hora,id_usuario,estado)
                                                    VALUES(:id_completo,:id_estudio,:fecha,:hora,:id_usuario,:estado)");
                                    $sql_insert_log->bindParam(':id_completo', $numdoc_completo, PDO::PARAM_STR);
                                    $sql_insert_log->bindParam(':id_estudio', $numdoc, PDO::PARAM_STR);
                                    $sql_insert_log->bindParam(':fecha', $datos["fecha"], PDO::PARAM_STR);
                                    $sql_insert_log->bindParam(':hora', $datos["hora"], PDO::PARAM_STR);
                                    $sql_insert_log->bindParam(':id_usuario', $datos["usuario"], PDO::PARAM_STR);
                                    $sql_insert_log->bindParam(':estado', $estado_log, PDO::PARAM_STR);
                                    $resultado_estudio_log = $sql_insert_log->execute();
                                    if ($resultado_estudio_log) {
                                        //registrar solicitudes de servicio
                                        $estss = 1;
                                        $p = 'E';
                                        $solicitudes = $datos["solicitudes"];
                                        foreach ($solicitudes as $value) {
                                            $sqlss = $this->_db3->prepare("INSERT INTO cmx_preestudio_solicitudes_servicio(id,id_servicio_cliente,id_solicitudpreestudio,fecha,hora,usuario,es,clasificacion)
                                                            VALUES(null,:servicio,:idsolicitud,:fecha,:hora,:usuario,:es,:p)");
                                            $sqlss->bindParam(':servicio', $value);
                                            $sqlss->bindParam(':idsolicitud', $numdoc);
                                            $sqlss->bindParam(':fecha', $datos['fecha']);
                                            $sqlss->bindParam(':hora', $datos['hora']);
                                            $sqlss->bindParam(':usuario', $datos["usuario"]);
                                            $sqlss->bindParam(':es', $estss);
                                            $sqlss->bindParam(':p', $p);
                                            $resultado_solicitudes_servicio = $sqlss->execute();
                                        }

                                        if ($resultado_solicitudes_servicio) {
                                            foreach ($solicitudes as $value) {
                                                $estado_sql = 'asignada';
                                                $sqlo = $this->_db3->prepare("INSERT INTO cmx_log_solicitudvehiculo(id,id_solictud,user_log,fecha_asignacion,hora_asignacion,estado)
                                                            VALUES(null,:servicio,:usuario,:fecha,:hora,:statu)");
                                                $sqlo->bindParam(':servicio', $value);
                                                $sqlo->bindParam(':usuario', $datos["usuario"]);
                                                $sqlo->bindParam(':fecha', $datos['fecha']);
                                                $sqlo->bindParam(':hora', $datos['hora']);
                                                $sqlo->bindParam(':statu', $estado_sql);
                                                $resultado_log = $sqlo->execute();
                                            }
                                            if ($resultado_log) {
                                                $valor = 0;
                                                $sql_subasta = $this->_db3->prepare("INSERT INTO cmx_subasta_temporal(id,fecha_inicio,numero_estudio,placa,flete,tarifa)
                                                                VALUES(null,:fechasu,:numerosu,:placa_su,:fletesu,:tarifasu)");
                                                $sql_subasta->bindParam(':fechasu', $datos["fecha"]);
                                                $sql_subasta->bindParam(':numerosu', $numdoc);
                                                $sql_subasta->bindParam(':placa_su', $datos["placa"]);
                                                $sql_subasta->bindParam(':fletesu', $datos["flete"]);
                                                $sql_subasta->bindParam(':tarifasu', $datos["tarifa"]);
                                                $resultado_subasta = $sql_subasta->execute();
                                                if ($resultado_subasta) {
                                                    $sql_estudio_c = $this->_db3->prepare("SELECT id_estudio_c FROM cmx_estudiov_completo WHERE id_estudio=:estudio");
                                                    $sql_estudio_c->bindParam(':estudio', $numdoc);
                                                    $sql_estudio_c->execute();
                                                    $resultado_estudio_c = $sql_estudio_c->fetch(PDO::FETCH_ASSOC);
                                                    $aprobacion = $this->Aprobacion_total_estudio_itr($datos, $numdoc, $resultado["id"], $resultado["id_conductor"], $resultado_estudio_c['id_estudio_c']);
                                                    if ($aprobacion == true) {
                                                        $cantidad = $resultado_placa["viaje_itr"] + 1;
                                                        $sql_update_viajes = $this->_db3->prepare("UPDATE cmx_estudio_vehiculo SET viaje_itr=:viaje_itr WHERE placa=:placas AND id_estudio=:estudio_id");
                                                        $sql_update_viajes->bindParam(':viaje_itr', $cantidad);
                                                        $sql_update_viajes->bindParam(':estudio_id', $numdoc);
                                                        $sql_update_viajes->bindParam(':placas', $resultado_placa["placa"]);
                                                        $sql_update_viajes->execute();
                                                        if ($sql_update_viajes) {
                                                            $this->_db3->commit();
                                                            $response = array(
                                                                'numero' => 200,
                                                                'mensaje' => 'Solicitud de estudio para la placa ' . $datos['placa'] . ' registrada exitosamente.',
                                                            );
                                                            return $response;
                                                        } else {
                                                            $this->_db3->commit();
                                                            $response = array(
                                                                'numero' => 400,
                                                                'mensaje' => 'No se puedo registrar la asociacion de estudio desde actualziar la cantidad de viajes',
                                                            );
                                                            return $response;
                                                        }
                                                    } else {
                                                        $this->_db3->commit();
                                                        $response = array(
                                                            'numero' => 400,
                                                            'mensaje' => 'No se puedo registrar la asociacion de estudio desde aprobacion',
                                                        );
                                                        return $response;
                                                    }
                                                } else {
                                                    $this->_db3->commit();
                                                    $response = array(
                                                        'numero' => 400,
                                                        'mensaje' => 'No se puedo registrar la asociacion de estudio',
                                                    );
                                                    return $response;
                                                }
                                            } else {
                                                $this->_db3->commit();
                                                $response = array(
                                                    'numero' => 400,
                                                    'mensaje' => 'No se pudo registrar ss para operaciones',
                                                );
                                                return $response;
                                            }
                                        } else {
                                            $this->_db3->commit();
                                            $response = array(
                                                'numero' => 400,
                                                'mensaje' => 'No se puedo registrar la subasta temporal de estudio',
                                            );
                                            return $response;
                                        }
                                        //}
                                    } else {
                                        $this->_db3->commit();
                                        $response = array(
                                            'numero' => 400,
                                            'mensaje' => 'No se puedo registrar la solicitud de estudio',
                                        );
                                        return $response;
                                    }
                                } else {
                                    $response = array(
                                        'numero' => 400,
                                        'mensaje' => 'No se puedo resgistrar la solicitud de estudio',
                                    );

                                    $mensajeError = "transaccion fallo: insertar estado completo vehiculo" . date("Y-m-d") . $datos["usuario"];
                                    error_log($mensajeError . "\n", 3, "error_log.txt");
                                }
                            } else {
                                $mensajeError = "transaccion fallo: en Actualizar maestro estudio seguridad completo" . date("Y-m-d") . $datos["usuario"];
                                error_log($mensajeError . "\n", 3, "error_log.txt");
                            }
                        } else {
                            $mensajeError = "transaccion fallo: en solicitar maestro estudio seguridad completo" . date("Y-m-d") . $datos["usuario"];
                            error_log($mensajeError . "\n", 3, "error_log.txt");
                        }
                    } else {
                        $response = array(
                            'numero' => 400,
                            'mensaje' => 'No se puedo resgistrar la solicitud de estudio',
                        );
                        $mensajeError = "transaccion fallo: insertar estudio vehiculo" . date("Y-m-d") . $datos["usuario"];
                        error_log($mensajeError . "\n", 3, "error_log.txt");
                    }
                } else {
                    $mensajeError = "transaccion fallo: en Actualizar maestro estudio seguridad" . date("Y-m-d") . $datos["usuario"];
                    error_log($mensajeError . "\n", 3, "error_log.txt");
                }
            } else {
                $mensajeError = "transaccion fallo: en solicitar maestro estudio seguridad" . date("Y-m-d") . $datos["usuario"];
                error_log($mensajeError . "\n", 3, "error_log.txt");
            }
        } catch (\Throwable $th) {
            // Si ocurre algún error, deshacemos la transacción
            $this->_db3->rollBack();
            echo "Error en la transacción: " . $th->getMessage();
            $mensajeError = $th->getMessage() . date("Y-m-d") . $datos["usuario"];
            error_log($mensajeError . "\n", 3, "error_log.txt");
        }
    }

    public function Aprobacion_total_estudio_itr($datos, $numdoc, $vehiculo, $conductor, $id_estudio_c)
    {
        $response = [];
        try {
            $usuario = $_SESSION["usuario"]["nom_usuario"];
            $estado_sub = "Activo";
            $estado_de_registro = "Aprobado";
            $id_estudio = $numdoc;
            $obser = 'aprobado';
            $proceso_estudio = 'Pen_Sol_Rut';
            $fecha = date('Y-m-d');
            $hora = date('H-m-s');
            $estado_actu = 1;
            $operacion = 'Crear';
            //actualizar el estado iniciado a cero
            $sqla = "UPDATE cmx_estudiov_completo SET estado_actu=0 WHERE id_estudio=:idestudio AND id_vehiculo=:idcarro AND id_conductor=:idcondu";
            $update_ante = $this->_db3->prepare($sqla);
            $update_ante->bindParam(':idestudio', $numdoc, PDO::PARAM_STR);
            $update_ante->bindParam(':idcarro', $vehiculo, PDO::PARAM_STR);
            $update_ante->bindParam(':idcondu', $conductor, PDO::PARAM_STR);
            $resulta = $update_ante->execute();
            if ($resulta) {
                //insertar estado nuevo
                $sql = "INSERT INTO  cmx_estudiov_completo (id,id_estudio_c,id_estudio,estado,id_vehiculo,id_conductor,observacion,proceso,fecha,hora,usuario,estado_actu,estado_subasta,causalidad)
				VALUES(null,:id_estudio_c,:id_estudio,:estado,:id_vehiculo,:id_conductor,:observacion,:proceso,:fecha,:hora,:usuario,:estado_actu,:estado_subasta,:causalidad)";
                $crear_estudiocompl = $this->_db3->prepare($sql);
                $crear_estudiocompl->bindParam(':id_estudio_c', $id_estudio_c, PDO::PARAM_STR);
                $crear_estudiocompl->bindParam(':id_estudio', $numdoc, PDO::PARAM_STR);
                $crear_estudiocompl->bindParam(':estado', $estado_de_registro, PDO::PARAM_STR);
                $crear_estudiocompl->bindParam(':id_vehiculo', $vehiculo, PDO::PARAM_STR);
                $crear_estudiocompl->bindParam(':id_conductor', $conductor, PDO::PARAM_STR);
                $crear_estudiocompl->bindParam(':observacion', $obser, PDO::PARAM_STR);
                $crear_estudiocompl->bindParam(':proceso', $proceso_estudio, PDO::PARAM_STR);
                $crear_estudiocompl->bindParam(':fecha', $fecha, PDO::PARAM_STR);
                $crear_estudiocompl->bindParam(':hora', $hora, PDO::PARAM_STR);
                $crear_estudiocompl->bindParam(':usuario', $usuario, PDO::PARAM_STR);
                $crear_estudiocompl->bindParam(':estado_actu', $estado_actu, PDO::PARAM_STR);
                $crear_estudiocompl->bindParam(':estado_subasta', $estado_sub, PDO::PARAM_STR);
                $crear_estudiocompl->bindParam(':causalidad', $obser, PDO::PARAM_STR);
                $result = $crear_estudiocompl->execute();

                if ($result) {
                    $sql2 = "INSERT INTO cmx_logestudio_com (id,id_completo,id_estudio,fecha,hora,id_usuario,estado)
					VALUES(null,:id_completo,:idestudio,:fecha,:hora,:usuario,:operacion)";
                    $crear_log = $this->_db3->prepare($sql2);
                    $crear_log->bindParam(':id_completo', $id_estudio_c, PDO::PARAM_STR);
                    $crear_log->bindParam(':idestudio', $numdoc, PDO::PARAM_STR);
                    $crear_log->bindParam(':fecha', $fecha, PDO::PARAM_STR);
                    $crear_log->bindParam(':hora', $hora, PDO::PARAM_STR);
                    $crear_log->bindParam(':usuario', $usuario, PDO::PARAM_STR);
                    $crear_log->bindParam(':operacion', $operacion, PDO::PARAM_STR);
                    $result1 = $crear_log->execute();
                    if ($result1) {
                        //registrar subasta
                        $datos = $id_estudio;
                        $subasta = $this->Insert_subasta_final_itr($datos);
                        foreach ($subasta as $value) {
                            if ($value == 'si_inserto') {
                                $response = true;
                                // $response = array(
                                //     'numero' => 200, 'mensaje' => 'Estudio de seguridad ' . $estado_msg . ' para el estudio de seguridad con numero <strong>' . $datos . '</strong>',
                                // );
                            } else {
                                $response = false;
                                // $mensajeError = "transaccion fallo: No ejecuto la insersion del movimiento actual para la aprobacion del estudio";
                                // error_log($mensajeError, 3, "error_log.txt");
                            }
                        }
                    } else {
                        $response = array(
                            'numero' => 400,
                            'mensaje' => 'Estudio de se guridad no ' . $datos['estado'] . ' para el estudio de seguridad con numero <strong>' . $datos['idestudio'] . '</strong>',
                        );
                    }
                    return $response;
                } else {
                    $mensajeError = "transaccion fallo: No ejecuto la insersion del movimiento actual para la aprobacion del estudio";
                    error_log($mensajeError, 3, "error_log.txt");
                }
            } else {
                $mensajeError = "transaccion fallo: No ejecuto la actualizacion del estado actual para la aprobacion del estudio";
                error_log($mensajeError, 3, "error_log.txt");
            }
        } catch (\Throwable $th) {

            throw $th;
        }

        return $response;
    }

    public function Insert_Subasta_Final($datos)
    {
        $n = [];
        try {
            $fechaHoraActual = date("G:i:s");
            $fecha_actual = date('Y-m-d');
            $user = $_SESSION["usuario"]["nom_usuario"];
            $status = 1; //consultar el numero de subasta
            $clasifica = 'E';
            $sql2 = $this->_db3->prepare("SELECT ss.id_subasta FROM cmx_subasta_solicitud_servicio ss
            INNER JOIN cmx_subasta_flete sb ON ss.id=sb.id_suba_servicio AND sb.estado_vigencia<>'cancelada' AND sb.estado_vigencia<>'vencida'
            INNER JOIN cmx_preestudio_solicitudes_servicio ps ON ss.numer_solservicio=ps.id_servicio_cliente
            INNER JOIN cmx_estado_subasta es ON ss.id_subasta=es.id_subasta AND es.estado<>0
            INNER JOIN cmx_subasta s ON es.id_subasta=s.id AND s.estado<>'cancelada' AND s.estado<>'vencida'
            WHERE ps.id_solicitudpreestudio=:numero_estudio AND clasificacion=:clasifica");
            $sql2->bindParam(':numero_estudio', $datos, PDO::PARAM_STR);
            $sql2->bindParam(':clasifica', $clasifica, PDO::PARAM_STR);
            $sql2->execute();
            $resultadob = $sql2->fetch(PDO::FETCH_ASSOC);

            if ($resultadob) {
                $numsub = $resultadob['id_subasta'];
            } else {
                // Aquí maneja el caso donde no hay resultados
                $numsub = null;
            }

            if ($numsub !== null) {
                //si existe numero de subasta
                $estado_ps = 1;
                $sql_ps = $this->_db3->prepare("SELECT z.flete, z.tarifa, a.id_servicio_cliente, c.fecha_estimada_entrega,
                                            c.hora_estimada, z.placa,
                                            (SELECT SUM(b.flete)
                                            FROM cmx_preestudio_solicitudes_servicio a
                                            INNER JOIN cmx_subasta_temporal z ON a.id_solicitudpreestudio=z.numero_estudio
                                            INNER JOIN cmx_solicitud_vehiculo2 b ON a.id_servicio_cliente=b.nundoc_solicitud
                                            INNER JOIN cmx_ruta_puntosentrega c ON b.nundoc_solicitud=c.cod_ini_ruta AND c.cod_ini_ruta
                                            WHERE a.id_solicitudpreestudio=:numerops AND a.es=:estadops AND a.clasificacion='E') AS 'flete_sug'
                                            FROM cmx_preestudio_solicitudes_servicio a
                                            INNER JOIN cmx_subasta_temporal z ON a.id_solicitudpreestudio=z.numero_estudio
                                            INNER JOIN cmx_solicitud_vehiculo2 b ON a.id_servicio_cliente=b.nundoc_solicitud
                                            INNER JOIN cmx_ruta_puntosentrega c ON b.nundoc_solicitud=c.cod_ini_ruta AND c.cod_ini_ruta
                                            WHERE a.id_solicitudpreestudio=:numerops AND a.es=:estadops
                                            AND a.clasificacion='E'");
                $sql_ps->bindParam(':numerops', $datos, PDO::PARAM_STR);
                $sql_ps->bindParam(':estadops', $estado_ps, PDO::PARAM_STR);
                $sql_ps->execute();
                $resultados = $sql_ps->fetchAll(PDO::FETCH_ASSOC);

                if ($resultados) {
                    foreach ($resultados as $value) {
                        //consulta maestro de subasta para solicitudes de servicio
                        $sql_subss = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='SUB_SS' AND numero_actual>numero_inicial");
                        $resultado_consecutivo_ss = $sql_subss->execute();
                        $resultado_consecutivo_ss = $sql_subss->fetch(PDO::FETCH_ASSOC);
                        $numero_subss = $resultado_consecutivo_ss['numero_actual'];
                        $numero_subss2 = $resultado_consecutivo_ss['numero_actual'] + 1; // Disponible
                        if ($numero_subss) {
                            //actualizacion de maestro para solicitudes de servicio en subasta
                            $sql_updat_ss = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numero_subss2 WHERE tipo='SUB_SS'");
                            $result_updatss = $sql_updat_ss->execute();
                            if ($result_updatss) {
                                $sql3_subasta = $this->_db3->prepare("INSERT INTO cmx_subasta_solicitud_servicio(id,id_subasta,numer_solservicio,fecha,hora,usuario)
                                                                VALUES(:id_privado,:id_subasta,:solicituservicio,:fecha_hoy,:hora_hoy,:usuario)");
                                $sql3_subasta->bindParam(':id_privado', $numero_subss);
                                $sql3_subasta->bindParam(':id_subasta', $numsub);
                                $sql3_subasta->bindParam(':solicituservicio', $value['id_servicio_cliente']);
                                $sql3_subasta->bindParam(':fecha_hoy', $fecha_actual);
                                $sql3_subasta->bindParam(':hora_hoy', $fechaHoraActual);
                                $sql3_subasta->bindParam(':usuario', $user);
                                $resultado_ss = $sql3_subasta->execute();
                                //despues de realizar la última inserción, sacar la menor fecha de la solciitud de servicio
                                //y actualizar la subasta
                                if ($resultado_ss) {
                                    //consulta maestro de subasta para tabla de fletes
                                    $sql_subff = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='SUB_FLE' AND numero_actual>numero_inicial");
                                    $resultado_consecutivo_ff = $sql_subff->execute();
                                    $resultado_consecutivo_ff = $sql_subff->fetch(PDO::FETCH_ASSOC);
                                    $numero_subff = $resultado_consecutivo_ff['numero_actual'];
                                    $numero_subff2 = $resultado_consecutivo_ff['numero_actual'] + 1;
                                    if ($numero_subff) {
                                        //actualizacion de maestro para solicitudes de servicio en subasta
                                        $sql_updat_ff = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numero_subff2 WHERE tipo='SUB_FLE'");
                                        $result_updatff = $sql_updat_ff->execute();
                                        //Registrar fletes
                                        $estadi_vigencia = 1;
                                        $estadorden = 'pendiente';
                                        $sql4_subasta = $this->_db3->prepare("INSERT INTO cmx_subasta_flete(id,id_suba,num_estudioseguridad,placa,flete_sugerido,flete_propuesto,fecha,
                                                                                    hora,usuario,id_suba_servicio,tarifa_promedio,estado_vigencia,estado_orden)VALUES(:subastaflete,:num_subasta,:num_estudio,:placa_subasta,:flete_sugiere,:flete_prop,:fecha_hoy,:hora_hoy,:usuario,:id_subservicio,:tarifa_prom,:estadovig,:estado_orden)");
                                        $sql4_subasta->bindParam(':subastaflete', $numero_subff);
                                        $sql4_subasta->bindParam(':num_subasta', $numsub);
                                        $sql4_subasta->bindParam(':num_estudio', $datos);
                                        $sql4_subasta->bindParam(':placa_subasta', $value["placa"]);
                                        $sql4_subasta->bindParam(':flete_sugiere', $value["flete_sug"]);
                                        $sql4_subasta->bindParam(':flete_prop', $value["flete"]);
                                        $sql4_subasta->bindParam(':fecha_hoy', $fecha_actual);
                                        $sql4_subasta->bindParam(':hora_hoy', $fechaHoraActual);
                                        $sql4_subasta->bindParam(':usuario', $user);
                                        $sql4_subasta->bindParam(':id_subservicio', $numero_subss);
                                        $sql4_subasta->bindParam(':tarifa_prom', $value['tarifa']);
                                        $sql4_subasta->bindParam(':estadovig', $estadi_vigencia);
                                        $sql4_subasta->bindParam(':estado_orden', $estadorden);
                                        $resultado_fletes = $sql4_subasta->execute();
                                        if ($resultado_fletes) {
                                            $estado_fle = 'pendiente';
                                            $sql5_subasta = $this->_db3->prepare("INSERT INTO cmx_estado_subasta_flete(id,id_suba,estado,fecha,hora,usuario,id_suba_flete)
                                                                                            VALUES(null,:num_subasta,:estado,:fecha_hoy,:hora_hoy,:usuario,:id_suba_flete)");
                                            $sql5_subasta->bindParam(':num_subasta', $numsub);
                                            $sql5_subasta->bindParam(':estado', $estado_fle);
                                            $sql5_subasta->bindParam(':fecha_hoy', $fecha_actual);
                                            $sql5_subasta->bindParam(':hora_hoy', $fechaHoraActual);
                                            $sql5_subasta->bindParam(':usuario', $user);
                                            $sql5_subasta->bindParam(':id_suba_flete', $numero_subff);
                                            $resultado_estadoflete = $sql5_subasta->execute();
                                            // var_dump( $resultado_estadoflete);
                                            if ($resultado_estadoflete) {
                                                // $response = "Datos Registrados Exitosamente";
                                                $n = array(
                                                    "operacion" => true,
                                                    "mensajo" => "si_inserto",
                                                );
                                                // return $n;
                                            } else {
                                                $mensajeError = "transaccion fallo: No ejecuto insercion subasta 4";
                                                error_log($mensajeError, 3, "error_log.txt");
                                            }
                                        } else {
                                            $mensajeError = "transaccion fallo: No ejecuto insercion subasta flete";
                                            error_log($mensajeError, 3, "error_log.txt");
                                        }
                                    } else {
                                        $mensajeError = "transaccion fallo: No trae numero subasta flete";
                                        error_log($mensajeError, 3, "error_log.txt");
                                    }
                                } else {
                                    $mensajeError = "transaccion fallo: No ejecuto insercion subasta 4";
                                    error_log($mensajeError, 3, "error_log.txt");
                                }
                            } else {
                                $mensajeError = "transaccion fallo: No ejecuto maestro de solicitudes de servicio para subasta B";
                                error_log($mensajeError, 3, "error_log.txt");
                            }
                        } else {
                            $mensajeError = "transaccion fallo: No ejecuto maestro de solicitudes de servicio para subasta A";
                            error_log($mensajeError, 3, "error_log.txt");
                        }
                    }
                } else {
                    $mensajeError = "transaccion fallo: No ejecuto actualizacion de maestro";
                    error_log($mensajeError, 3, "error_log.txt");
                }
            } else {
                //si no existe numero de subasta
                $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='SUB_CAB' AND numero_actual>numero_inicial");
                $resultado_consecutivo_completo = $sql_consecutivo->execute();
                $resultado_consecutivo_completo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
                $maestro_sub = $resultado_consecutivo_completo['numero_actual'];
                $maestro_sub2 = $resultado_consecutivo_completo['numero_actual'] + 1;
                if ($maestro_sub) {
                    $sql_updata_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$maestro_sub2 WHERE tipo='SUB_CAB'");
                    $resultado_consecutivo_update = $sql_updata_maestro->execute();
                    if ($resultado_consecutivo_update) {
                        //registrar en cabecera de subasta 1 sola vez
                        //obtener la menor fecha de cargue
                        $esta = 'iniciado';
                        // $fecha_menor = "0000-00-00";
                        $fecha_menor = date("Y-m-d");
                        $hora_menor = null;
                        // $hora_menor = "00:00:00";
                        $sql_subasta = $this->_db3->prepare("INSERT INTO cmx_subasta(id,fecha_inicio,hora_inicio,fecha_finaliza,hora_finaliza,estado,usuario,fecha,hora)
                            VALUES(:id_subasta,:fecha_inicio,:hora_inicio,:fecha_fin,:hora_fin,:estado,:usuario,:fecha,:hora)");
                        $sql_subasta->bindParam(':id_subasta', $maestro_sub);
                        $sql_subasta->bindParam(':fecha_inicio', $fecha_actual);
                        $sql_subasta->bindParam(':hora_inicio', $fechaHoraActual);
                        $sql_subasta->bindParam(':fecha_fin', $fecha_menor);
                        $sql_subasta->bindParam(':hora_fin', $hora_menor);
                        $sql_subasta->bindParam(':estado', $esta);
                        $sql_subasta->bindParam(':usuario', $user);
                        $sql_subasta->bindParam(':fecha', $fecha_actual);
                        $sql_subasta->bindParam(':hora', $fechaHoraActual);
                        $resultado_subasta = $sql_subasta->execute();

                        if ($resultado_subasta) {
                            $es_sub = 1;
                            $sql2_subasta = $this->_db3->prepare("INSERT INTO cmx_estado_subasta(id,id_subasta,estado,fecha,hora,usuario)
                                VALUES(null,:id_subasta,:estado_sub,:fecha_hoy,:hora_hoy,:usuario)");
                            $sql2_subasta->bindParam(':id_subasta', $maestro_sub);
                            $sql2_subasta->bindParam(':estado_sub', $es_sub);
                            $sql2_subasta->bindParam(':fecha_hoy', $fecha_actual);
                            $sql2_subasta->bindParam(':hora_hoy', $fechaHoraActual);
                            $sql2_subasta->bindParam(':usuario', $user);
                            $resultado_estado = $sql2_subasta->execute();

                            if ($resultado_estado) {
                                //consltar todas las solictudes de servicio asociadas para registro en tablas multiples
                                $estado_ps = 1;
                                $sql_ps = $this->_db3->prepare("SELECT z.flete, z.tarifa, a.id_servicio_cliente, c.fecha_estimada_entrega,
                                    c.hora_estimada, z.placa,
                                    (SELECT SUM(b.flete)
                                    FROM cmx_preestudio_solicitudes_servicio a
                                    INNER JOIN cmx_subasta_temporal z
                                    ON a.id_solicitudpreestudio=z.numero_estudio
                                    INNER JOIN cmx_solicitud_vehiculo2 b ON a.id_servicio_cliente=b.nundoc_solicitud
                                    INNER JOIN cmx_ruta_puntosentrega c ON b.nundoc_solicitud=c.cod_ini_ruta AND c.cod_ini_ruta
                                    WHERE a.id_solicitudpreestudio=:numerops AND a.es=:estadops
                                    AND a.clasificacion='E') AS 'flete_sug'
                                    FROM cmx_preestudio_solicitudes_servicio a
                                    INNER JOIN cmx_subasta_temporal z
                                    ON a.id_solicitudpreestudio=z.numero_estudio
                                    INNER JOIN cmx_solicitud_vehiculo2 b ON a.id_servicio_cliente=b.nundoc_solicitud
                                    INNER JOIN cmx_ruta_puntosentrega c ON b.nundoc_solicitud=c.cod_ini_ruta AND c.cod_ini_ruta
                                    WHERE a.id_solicitudpreestudio=:numerops AND a.es=:estadops
                                    AND a.clasificacion='E'");
                                $sql_ps->bindParam(':numerops', $datos, PDO::PARAM_STR);
                                $sql_ps->bindParam(':estadops', $estado_ps, PDO::PARAM_STR);
                                $resultado_ps = $sql_ps->execute();
                                $resultado_ps = $sql_ps->fetchAll(PDO::FETCH_ASSOC);

                                if ($resultado_ps) {
                                    // $resultado_ps = $sql_ps->fetchAll(PDO::FETCH_ASSOC);
                                    foreach ($resultado_ps as $value) {
                                        //$contador = count($value["id_servicio_cliente"]);
                                        //consulta maestro de subasta para solicitudes de servicio
                                        $sql_subss = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='SUB_SS' AND numero_actual>numero_inicial");
                                        $resultado_consecutivo_ss = $sql_subss->execute();
                                        $resultado_consecutivo_ss = $sql_subss->fetch(PDO::FETCH_ASSOC);
                                        $numero_subss = $resultado_consecutivo_ss['numero_actual'];
                                        $numero_subss2 = $resultado_consecutivo_ss['numero_actual'] + 1;
                                        if ($numero_subss) {

                                            //actualizacion de maestro para solicitudes de servicio en subasta
                                            $sql_updat_ss = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numero_subss2 WHERE tipo='SUB_SS'");
                                            $result_updatss = $sql_updat_ss->execute();
                                            if ($result_updatss) {
                                                $sql3_subasta = $this->_db3->prepare("INSERT INTO cmx_subasta_solicitud_servicio(id,id_subasta,numer_solservicio,fecha,hora,usuario)
                                                    VALUES(:id_privado,:id_subasta,:solicituservicio,:fecha_hoy,:hora_hoy,:usuario)");
                                                $sql3_subasta->bindParam(':id_privado', $numero_subss);
                                                $sql3_subasta->bindParam(':id_subasta', $maestro_sub);
                                                $sql3_subasta->bindParam(':solicituservicio', $value['id_servicio_cliente']);
                                                $sql3_subasta->bindParam(':fecha_hoy', $fecha_actual);
                                                $sql3_subasta->bindParam(':hora_hoy', $fechaHoraActual);
                                                $sql3_subasta->bindParam(':usuario', $user);
                                                $resultado_ss = $sql3_subasta->execute();
                                                if ($resultado_ss) {
                                                    //registrar fecha y hora de finalización de subasta
                                                    $sql_submin = $this->_db3->prepare("SELECT
                                                    MIN(c.fecha_estimada_entrega) AS 'fecha_menor',
                                                    MIN(c.hora_estimada) AS 'hora_menor'
                                                    FROM cmx_preestudio_solicitudes_servicio m
                                                    INNER JOIN cmx_solicitud_vehiculo2 b ON m.id_servicio_cliente=b.nundoc_solicitud
                                                    INNER JOIN cmx_ruta_puntosentrega c ON b.nundoc_solicitud=c.cod_ini_ruta AND c.cod_ini_ruta
                                                    WHERE m.es=1 AND m.clasificacion='E' AND m.id_solicitudpreestudio=:id_estudio");
                                                    $sql_submin->bindParam(':id_estudio', $datos);
                                                    $resultado_fecha = $sql_submin->execute();
                                                    $resultado_fecha = $sql_submin->fetch(PDO::FETCH_ASSOC);
                                                    if ($resultado_fecha) {
                                                        $fecha_menor = $resultado_fecha['fecha_menor'];
                                                        $hora_menor = $resultado_fecha['hora_menor'];
                                                        $sql_finalizacion = $this->_db3->prepare("UPDATE cmx_subasta SET fecha_finaliza=:fechafinalsub, hora_finaliza=:horafinalsub WHERE id=:id_subasta");
                                                        $sql_finalizacion->bindParam(':id_subasta', $maestro_sub);
                                                        $sql_finalizacion->bindParam(':fechafinalsub', $fecha_menor);
                                                        $sql_finalizacion->bindParam(':horafinalsub', $hora_menor);
                                                        $resultado_finalizacion = $sql_finalizacion->execute();
                                                        if ($resultado_finalizacion) {
                                                            //consulta maestro de subasta para tabla de fletes
                                                            $sql_subff = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='SUB_FLE' AND numero_actual>numero_inicial");
                                                            $resultado_consecutivo_ff = $sql_subff->execute();
                                                            $resultado_consecutivo_ff = $sql_subff->fetch(PDO::FETCH_ASSOC);
                                                            $numero_subff = $resultado_consecutivo_ff['numero_actual'];
                                                            $numero_subff2 = $resultado_consecutivo_ff['numero_actual'] + 1;
                                                            if ($numero_subff) {
                                                                //actualizacion de maestro para solicitudes de servicio en subasta
                                                                $sql_updat_ff = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numero_subff2 WHERE tipo='SUB_FLE'");
                                                                $result_updatff = $sql_updat_ff->execute();
                                                                //Registrar fletes
                                                                $estadi_vigencia = 1;
                                                                $estadorden = 'pendiente';
                                                                $sql4_subasta = $this->_db3->prepare("INSERT INTO cmx_subasta_flete(id,id_suba,num_estudioseguridad,placa,flete_sugerido,flete_propuesto,fecha,
                                                                        hora,usuario,id_suba_servicio,tarifa_promedio,estado_vigencia,estado_orden)
                                                                        VALUES(:subastaflete,:num_subasta,:num_estudio,:placa_subasta,:flete_sugiere,:flete_prop,:fecha_hoy,:hora_hoy,:usuario,:id_subservicio,:tarifa_prom,:estadovig,:estado_orden)");
                                                                $sql4_subasta->bindParam(':subastaflete', $numero_subff);
                                                                $sql4_subasta->bindParam(':num_subasta', $maestro_sub);
                                                                $sql4_subasta->bindParam(':num_estudio', $datos);
                                                                $sql4_subasta->bindParam(':placa_subasta', $value["placa"]);
                                                                $sql4_subasta->bindParam(':flete_sugiere', $value["flete_sug"]);
                                                                $sql4_subasta->bindParam(':flete_prop', $value["flete"]);
                                                                $sql4_subasta->bindParam(':fecha_hoy', $fecha_actual);
                                                                $sql4_subasta->bindParam(':hora_hoy', $fechaHoraActual);
                                                                $sql4_subasta->bindParam(':usuario', $user);
                                                                $sql4_subasta->bindParam(':id_subservicio', $numero_subss);
                                                                $sql4_subasta->bindParam(':tarifa_prom', $value['tarifa']);
                                                                $sql4_subasta->bindParam(':estadovig', $estadi_vigencia);
                                                                $sql4_subasta->bindParam(':estado_orden', $estadorden);
                                                                $resultado_fletes = $sql4_subasta->execute();
                                                                if ($resultado_fletes) {
                                                                    $estado_fle = 'pendiente';
                                                                    $sql5_subasta = $this->_db3->prepare("INSERT INTO cmx_estado_subasta_flete(id,id_suba,estado,fecha,hora,usuario,id_suba_flete)
                                                                                VALUES(null,:num_subasta,:estado,:fecha_hoy,:hora_hoy,:usuario,:id_suba_flete)");
                                                                    $sql5_subasta->bindParam(':num_subasta', $maestro_sub);
                                                                    $sql5_subasta->bindParam(':estado', $estado_fle);
                                                                    $sql5_subasta->bindParam(':fecha_hoy', $fecha_actual);
                                                                    $sql5_subasta->bindParam(':hora_hoy', $fechaHoraActual);
                                                                    $sql5_subasta->bindParam(':usuario', $user);
                                                                    $sql5_subasta->bindParam(':id_suba_flete', $numero_subff);
                                                                    $resultado_estadoflete = $sql5_subasta->execute();
                                                                    if ($resultado_estadoflete) {
                                                                        // $response = "Datos Registrados Exitosamente";
                                                                        $n = array(
                                                                            "operacion" => true,
                                                                            "mensajo" => "si_inserto",
                                                                        );
                                                                        // return $n;
                                                                    } else {
                                                                        $mensajeError = "transaccion fallo: No ejecuto insercion subasta 4";
                                                                        error_log($mensajeError, 3, "error_log.txt");
                                                                    }
                                                                } else {
                                                                    $mensajeError = "transaccion fallo: No ejecuto insercion subasta flete";
                                                                    error_log($mensajeError, 3, "error_log.txt");
                                                                }
                                                            } else {
                                                                $mensajeError = "transaccion fallo: No trae numero subasta flete";
                                                                error_log($mensajeError, 3, "error_log.txt");
                                                            }
                                                        } else {
                                                            $mensajeError = "transaccion fallo: No actualizo fecha finalizacion subasta";
                                                            error_log($mensajeError, 3, "error_log.txt");
                                                        }
                                                    } else {
                                                        $mensajeError = "transaccion fallo: No consulto fecha finalizacion subasta";
                                                        error_log($mensajeError, 3, "error_log.txt");
                                                    }
                                                } else {
                                                    $mensajeError = "transaccion fallo: No ejecuto insercion subasta 4";
                                                    error_log($mensajeError, 3, "error_log.txt");
                                                }
                                            } else {
                                                $mensajeError = "transaccion fallo: No ejecuto maestro de solicitudes de servicio para subasta B";
                                                error_log($mensajeError, 3, "error_log.txt");
                                            }
                                        } else {
                                            $mensajeError = "transaccion fallo: No ejecuto maestro de solicitudes de servicio para subasta A";
                                            error_log($mensajeError, 3, "error_log.txt");
                                        }
                                    }
                                    // exit();
                                } else {
                                    $mensajeError = "transaccion fallo: No ejecuto actualizacion de maestro";
                                    error_log($mensajeError, 3, "error_log.txt");
                                }
                            } else {
                                $mensajeError = "transaccion fallo: No registro en subasta 2";
                                error_log($mensajeError, 3, "error_log.txt");
                            }
                        } else {
                            $mensajeError = "transaccion fallo: No registro en subasta 1";
                            error_log($mensajeError, 3, "error_log.txt");
                        }
                    } else {
                        $mensajeError = "transaccion fallo: No ejecuto actualizacion de maestro";
                        error_log($mensajeError, 3, "error_log.txt");
                    }
                } else {
                    $mensajeError = "transaccion fallo: No ejecuto maestro";
                    error_log($mensajeError, 3, "error_log.txt");
                }
            } //cierre del else principal
            return $n;
        } catch (\Throwable $th) {
            $this->_db3->rollBack();
            echo "Error en la transacción: " . $th->getMessage();
        }
    }

    /* Inser de subasta itr */
    public function Insert_subasta_final_itr($datos)
    {
        $response = [];

        try {
            $fechaHoraActual = date("H:i:s");
            $fecha_actual = date('Y-m-d');
            $user = $_SESSION["usuario"]["nom_usuario"];
            $status = 1; //consultar el numero de subasta
            $clasifica = 'E';
            //si no existe numero de subasta
            $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='SUB_CAB' AND numero_actual>numero_inicial");
            $resultado_consecutivo_completo = $sql_consecutivo->execute();
            $resultado_consecutivo_completo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
            $maestro_sub = $resultado_consecutivo_completo['numero_actual'];
            $maestro_sub2 = $resultado_consecutivo_completo['numero_actual'] + 1;
            if ($maestro_sub) {
                $sql_updata_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$maestro_sub2 WHERE tipo='SUB_CAB'");
                $resultado_consecutivo_update = $sql_updata_maestro->execute();
                if ($resultado_consecutivo_update) {
                    //registrar en cabecera de subasta 1 sola vez
                    //obtener la menor fecha de cargue
                    $esta = 'iniciado';
                    // $fecha_menor = "0000-00-00";
                    $fecha_menor = date("Y-m-d");
                    $hora_menor = null;
                    // $hora_menor = "00:00:00";
                    $sql_subasta = $this->_db3->prepare("INSERT INTO cmx_subasta(id,fecha_inicio,hora_inicio,fecha_finaliza,hora_finaliza,estado,usuario,fecha,hora)
                                        VALUES(:id_subasta,:fecha_inicio,:hora_inicio,:fecha_fin,:hora_fin,:estado,:usuario,:fecha,:hora)");
                    $sql_subasta->bindParam(':id_subasta', $maestro_sub);
                    $sql_subasta->bindParam(':fecha_inicio', $fecha_actual);
                    $sql_subasta->bindParam(':hora_inicio', $fechaHoraActual);
                    $sql_subasta->bindParam(':fecha_fin', $fecha_menor);
                    $sql_subasta->bindParam(':hora_fin', $hora_menor);
                    $sql_subasta->bindParam(':estado', $esta);
                    $sql_subasta->bindParam(':usuario', $user);
                    $sql_subasta->bindParam(':fecha', $fecha_actual);
                    $sql_subasta->bindParam(':hora', $fechaHoraActual);
                    $resultado_subasta = $sql_subasta->execute();
                    if ($resultado_subasta) {
                        $es_sub = 1;
                        $sql2_subasta = $this->_db3->prepare("INSERT INTO cmx_estado_subasta(id,id_subasta,estado,fecha,hora,usuario)
                                            VALUES(null,:id_subasta,:estado_sub,:fecha_hoy,:hora_hoy,:usuario)");
                        $sql2_subasta->bindParam(':id_subasta', $maestro_sub);
                        $sql2_subasta->bindParam(':estado_sub', $es_sub);
                        $sql2_subasta->bindParam(':fecha_hoy', $fecha_actual);
                        $sql2_subasta->bindParam(':hora_hoy', $fechaHoraActual);
                        $sql2_subasta->bindParam(':usuario', $user);
                        $resultado_estado = $sql2_subasta->execute();
                        if ($resultado_estado) {
                            //consltar todas las solictudes de servicio asociadas para registro en tablas multiples
                            $estado_ps = 1;
                            $sql_ps = $this->_db3->prepare("SELECT z.flete, z.tarifa, a.id_servicio_cliente, c.fecha_estimada_entrega,
                                                c.hora_estimada, z.placa, (SELECT SUM(b.flete) FROM cmx_preestudio_solicitudes_servicio a
                                                INNER JOIN cmx_subasta_temporal z ON a.id_solicitudpreestudio=z.numero_estudio
                                                INNER JOIN cmx_solicitud_vehiculo2 b ON a.id_servicio_cliente=b.nundoc_solicitud
                                                INNER JOIN cmx_ruta_puntosentrega c ON b.nundoc_solicitud=c.cod_ini_ruta AND c.cod_ini_ruta
                                                WHERE a.id_solicitudpreestudio=:numerops AND a.es=:estadops AND a.clasificacion='E') AS 'flete_sug'
                                                FROM cmx_preestudio_solicitudes_servicio a
                                                INNER JOIN cmx_subasta_temporal z ON a.id_solicitudpreestudio=z.numero_estudio
                                                INNER JOIN cmx_solicitud_vehiculo2 b ON a.id_servicio_cliente=b.nundoc_solicitud
                                                INNER JOIN cmx_ruta_puntosentrega c ON b.nundoc_solicitud=c.cod_ini_ruta AND c.cod_ini_ruta
                                                WHERE a.id_solicitudpreestudio=:numerops AND a.es=:estadops
                                                AND a.clasificacion='E'");
                            $sql_ps->bindParam(':numerops', $datos, PDO::PARAM_STR);
                            $sql_ps->bindParam(':estadops', $estado_ps, PDO::PARAM_STR);
                            $resultado_ps = $sql_ps->execute();
                            $resultado_ps = $sql_ps->fetchAll(PDO::FETCH_ASSOC);
                            if ($resultado_ps) {
                                foreach ($resultado_ps as $value) {
                                    //consulta maestro de subasta para solicitudes de servicio
                                    $sql_subss = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='SUB_SS' AND numero_actual>numero_inicial");
                                    $resultado_consecutivo_ss = $sql_subss->execute();
                                    $resultado_consecutivo_ss = $sql_subss->fetch(PDO::FETCH_ASSOC);
                                    $numero_subss = $resultado_consecutivo_ss['numero_actual'];
                                    $numero_subss2 = $resultado_consecutivo_ss['numero_actual'] + 1;
                                    if ($numero_subss) {
                                        //actualizacion de maestro para solicitudes de servicio en subasta
                                        $sql_updat_ss = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numero_subss2 WHERE tipo='SUB_SS'");
                                        $result_updatss = $sql_updat_ss->execute();
                                        if ($result_updatss) {
                                            $sql3_subasta = $this->_db3->prepare("INSERT INTO cmx_subasta_solicitud_servicio(id,id_subasta,numer_solservicio,fecha,hora,usuario)
                                                                VALUES(:id_privado,:id_subasta,:solicituservicio,:fecha_hoy,:hora_hoy,:usuario)");
                                            $sql3_subasta->bindParam(':id_privado', $numero_subss);
                                            $sql3_subasta->bindParam(':id_subasta', $maestro_sub);
                                            $sql3_subasta->bindParam(':solicituservicio', $value['id_servicio_cliente']);
                                            $sql3_subasta->bindParam(':fecha_hoy', $fecha_actual);
                                            $sql3_subasta->bindParam(':hora_hoy', $fechaHoraActual);
                                            $sql3_subasta->bindParam(':usuario', $user);
                                            $resultado_ss = $sql3_subasta->execute();

                                            if ($resultado_ss) {
                                                //registrar fecha y hora de finalización de subasta
                                                $sql_submin = $this->_db3->prepare("SELECT
                                                                MIN(c.fecha_estimada_entrega) AS 'fecha_menor',
                                                                MIN(c.hora_estimada) AS 'hora_menor'
                                                                FROM cmx_preestudio_solicitudes_servicio m
                                                                INNER JOIN cmx_solicitud_vehiculo2 b ON m.id_servicio_cliente=b.nundoc_solicitud
                                                                INNER JOIN cmx_ruta_puntosentrega c ON b.nundoc_solicitud=c.cod_ini_ruta AND c.cod_ini_ruta
                                                                WHERE m.es=1 AND m.clasificacion='E' AND m.id_solicitudpreestudio=:id_estudio");
                                                $sql_submin->bindParam(':id_estudio', $datos);
                                                $resultado_fecha = $sql_submin->execute();
                                                $resultado_fecha = $sql_submin->fetch(PDO::FETCH_ASSOC);
                                                if ($resultado_fecha) {
                                                    $fecha_menor = $resultado_fecha['fecha_menor'];
                                                    $hora_menor = $resultado_fecha['hora_menor'];
                                                    $sql_finalizacion = $this->_db3->prepare("UPDATE cmx_subasta SET fecha_finaliza=:fechafinalsub, hora_finaliza=:horafinalsub WHERE id=:id_subasta");
                                                    $sql_finalizacion->bindParam(':id_subasta', $maestro_sub);
                                                    $sql_finalizacion->bindParam(':fechafinalsub', $fecha_menor);
                                                    $sql_finalizacion->bindParam(':horafinalsub', $hora_menor);
                                                    $resultado_finalizacion = $sql_finalizacion->execute();
                                                    if ($resultado_finalizacion) {
                                                        //consulta maestro de subasta para tabla de fletes
                                                        $sql_subff = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='SUB_FLE' AND numero_actual>numero_inicial");
                                                        $resultado_consecutivo_ff = $sql_subff->execute();
                                                        $resultado_consecutivo_ff = $sql_subff->fetch(PDO::FETCH_ASSOC);
                                                        $numero_subff = $resultado_consecutivo_ff['numero_actual'];
                                                        $numero_subff2 = $resultado_consecutivo_ff['numero_actual'] + 1;
                                                        if ($numero_subff) {
                                                            //actualizacion de maestro para solicitudes de servicio en subasta
                                                            $sql_updat_ff = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numero_subff2 WHERE tipo='SUB_FLE'");
                                                            $result_updatff = $sql_updat_ff->execute();
                                                            //Registrar fletes
                                                            $estadi_vigencia = 1;
                                                            $estadorden = 'pendiente';
                                                            $sql4_subasta = $this->_db3->prepare("INSERT INTO cmx_subasta_flete(id,id_suba,num_estudioseguridad,placa,flete_sugerido,flete_propuesto,fecha,
                                                                                    hora,usuario,id_suba_servicio,tarifa_promedio,estado_vigencia,estado_orden)
                                                                                    VALUES(:subastaflete,:num_subasta,:num_estudio,:placa_subasta,:flete_sugiere,:flete_prop,:fecha_hoy,:hora_hoy,:usuario,:id_subservicio,:tarifa_prom,:estadovig,:estado_orden)");
                                                            $sql4_subasta->bindParam(':subastaflete', $numero_subff);
                                                            $sql4_subasta->bindParam(':num_subasta', $maestro_sub);
                                                            $sql4_subasta->bindParam(':num_estudio', $datos);
                                                            $sql4_subasta->bindParam(':placa_subasta', $value["placa"]);
                                                            $sql4_subasta->bindParam(':flete_sugiere', $value["flete_sug"]);
                                                            $sql4_subasta->bindParam(':flete_prop', $value["flete"]);
                                                            $sql4_subasta->bindParam(':fecha_hoy', $fecha_actual);
                                                            $sql4_subasta->bindParam(':hora_hoy', $fechaHoraActual);
                                                            $sql4_subasta->bindParam(':usuario', $user);
                                                            $sql4_subasta->bindParam(':id_subservicio', $numero_subss);
                                                            $sql4_subasta->bindParam(':tarifa_prom', $value['tarifa']);
                                                            $sql4_subasta->bindParam(':estadovig', $estadi_vigencia);
                                                            $sql4_subasta->bindParam(':estado_orden', $estadorden);
                                                            $resultado_fletes = $sql4_subasta->execute();
                                                            if ($resultado_fletes) {
                                                                $estado_fle = 'pendiente';
                                                                $sql5_subasta = $this->_db3->prepare("INSERT INTO cmx_estado_subasta_flete(id,id_suba,estado,fecha,hora,usuario,id_suba_flete)
                                                                                            VALUES(null,:num_subasta,:estado,:fecha_hoy,:hora_hoy,:usuario,:id_suba_flete)");
                                                                $sql5_subasta->bindParam(':num_subasta', $maestro_sub);
                                                                $sql5_subasta->bindParam(':estado', $estado_fle);
                                                                $sql5_subasta->bindParam(':fecha_hoy', $fecha_actual);
                                                                $sql5_subasta->bindParam(':hora_hoy', $fechaHoraActual);
                                                                $sql5_subasta->bindParam(':usuario', $user);
                                                                $sql5_subasta->bindParam(':id_suba_flete', $numero_subff);
                                                                $resultado_estadoflete = $sql5_subasta->execute();
                                                                if ($resultado_estadoflete) {
                                                                    // $response = "Datos Registrados Exitosamente";
                                                                    $response = array(
                                                                        "operacion" => true,
                                                                        "mensajo" => "si_inserto",
                                                                    );
                                                                    // return $n;
                                                                } else {
                                                                    $mensajeError = "transaccion fallo: No ejecuto insercion subasta 4";
                                                                    error_log($mensajeError, 3, "error_log.txt");
                                                                }
                                                            } else {
                                                                $mensajeError = "transaccion fallo: No ejecuto insercion subasta flete";
                                                                error_log($mensajeError, 3, "error_log.txt");
                                                            }
                                                        } else {
                                                            $mensajeError = "transaccion fallo: No trae numero subasta flete";
                                                            error_log($mensajeError, 3, "error_log.txt");
                                                        }
                                                    } else {
                                                        $mensajeError = "transaccion fallo: No actualizo fecha finalizacion subasta";
                                                        error_log($mensajeError, 3, "error_log.txt");
                                                    }
                                                } else {
                                                    $mensajeError = "transaccion fallo: No consulto fecha finalizacion subasta";
                                                    error_log($mensajeError, 3, "error_log.txt");
                                                }
                                            } else {
                                                $mensajeError = "transaccion fallo: No ejecuto insercion subasta 4";
                                                error_log($mensajeError, 3, "error_log.txt");
                                            }
                                        } else {
                                            $mensajeError = "transaccion fallo: No ejecuto maestro de solicitudes de servicio para subasta B";
                                            error_log($mensajeError, 3, "error_log.txt");
                                        }
                                    } else {
                                        $mensajeError = "transaccion fallo: No ejecuto maestro de solicitudes de servicio para subasta A";
                                        error_log($mensajeError, 3, "error_log.txt");
                                    }
                                }
                            } else {
                                $mensajeError = "transaccion fallo: No ejecuto actualizacion de maestro";
                                error_log($mensajeError, 3, "error_log.txt");
                            }
                        } else {
                            $mensajeError = "transaccion fallo: No registro en subasta 2";
                            error_log($mensajeError, 3, "error_log.txt");
                        }
                    } else {
                        $mensajeError = "transaccion fallo: No registro en subasta 1";
                        error_log($mensajeError, 3, "error_log.txt");
                    }
                } else {
                    $mensajeError = "transaccion fallo: No ejecuto actualizacion de maestro";
                    error_log($mensajeError, 3, "error_log.txt");
                }
            } else {
                $mensajeError = "transaccion fallo: No ejecuto maestro";
                error_log($mensajeError, 3, "error_log.txt");
            }
        } catch (\Throwable $th) {
            // $this->_db3->rollBack();
            throw $th;
        }
        return $response;
    }

    public function Ver_estudio_seguridad($datos)
    {

        $sql = $this->_db3->prepare("SELECT a.*, CASE WHEN ec.estado IS NULL THEN 'gray' ELSE ec.estado END AS 'estadototal'

		FROM cmx_aprobacion_estudio a

		INNER JOIN cmx_estudio_vehiculo e ON a.id_estudio=e.id_estudio AND a.activo=1

		LEFT JOIN cmx_estudiov_completo ec ON e.id_estudio=ec.id_estudio AND estado_actu=1

		WHERE a.id_vehiculo=:vehiculo AND a.id_conductor=:conductor AND e.id_estudio=:solicitud");

        $sql->bindParam(':vehiculo', $datos["vehiculo"], PDO::PARAM_STR);

        $sql->bindParam(':conductor', $datos["conductor"], PDO::PARAM_STR);

        $sql->bindParam(':solicitud', $datos["solicitud"], PDO::PARAM_STR);

        $sql->execute();

        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);

        return $resultado;
    }

    public function Ver_vehiculo_seguridad($id_vehiculo)
    {

        $sql = $this->_db3->prepare("SELECT 
        v.*, TE.nombre AS nom_te, TE.numero_documento AS docu_te, TE.celular AS celular_tenedor,
        PRO.nombre AS nom_pro, PRO.numero_documento AS docu_pro, PRO.celular AS celular_propietario,
        d.tecnomecanica, d.tecno_fecha_vigencia,
        mac.marca,line.descripcion AS linea,vv.anio_fabricacion,col.color,vv.peso,
        kr.descripcion AS cod_rndc_carroceria,vv.num_chasis, vv.cod_tipo_combustible,
        vv.num_soat, vv.vence_soat,
        ase.nombre AS aseguradora,vv.num_motor, vv.poliza_responsabilidad,
        vv.vence_poliza, vv.repotenciado, vv.tipo_vinculacion,
        vv.fecha_mant_gps, vv.capacidad_tn,vv.pesobruto_kg, CONCAT(c.nombre,'-',c.descripcion) AS configure, c.descripcion,
        d.foto_vehiculo, d.name_frontal, d.foto_derecha, d.name_derecha, d.foto_izquierda, d.name_izquierda,
        d.foto_atras, d.name_atras, d.foto_soat,d.name_soat,d.foto_tecno,d.name_tecno,d.foto_transito,d.name_transito,
        cl.clase, d.licencia_transito,TE.apellido1 AS teape1, TE.apellido2 teape2,
        PRO.apellido1 AS proape1, PRO.apellido2	proape2,
        vv.f_matricula, d.tecno_fecha_expedida, vv.num_motor,
        vv.num_chasis, vv.repotenciado, vv.tipo_vinculacion,
        v.cant_viajes, vv.poliza_responsabilidad,
        v.empresa_gps, vv.fecha_mant_gps, reg.operador_gps,reg.nit,
        TE.tipo_documento AS 'Tipo_documento_tenedor', PRO.tipo_documento AS 'Tipo_documento_propietario',
        TE.digito_verificacion AS 'Digito_verificacion_tenedor',PRO.digito_verificacion AS 'Digito_verificacion_propietario',
         COND.numero_documento AS docu_cond, COND.tipo_documento AS 'Tipo_documento_conductor',d.documento_preopeacional,d.nombre_preopeacional,
         d.documento_kit,d.nombre_kit
		FROM cmx_vehiculos v
        INNER JOIN cmx_proveedores TE ON v.id_tenedor=TE.numdoc_nexos
        INNER JOIN cmx_proveedores PRO ON v.id_propietario=PRO.numdoc_nexos
        INNER JOIN cmx_proveedores COND ON v.id_conductor= COND.numdoc_nexos
        INNER JOIN cmx_detalle_vehiculo d ON v.numdoc_vehiculo=d.id_vehiculo
        INNER JOIN cmx_vehiculo2 vv ON v.numdoc_vehiculo=vv.id_vehiculo
        INNER JOIN cmx_rndc_vehiculos_configuracion c ON vv.configuracion=c.id
        LEFT JOIN cmx_rndc_clase_vehiculo cl ON vv.clase_vehiculo=cl.id
        LEFT JOIN cmx_rndc_vehiculos_marcas mac ON vv.marca=mac.id
        LEFT JOIN cmx_rndc_vehiculos_linea line ON mac.rndc_id=line.id_marca AND vv.linea=line.id
        LEFT JOIN cmx_rndc_vehiculos_color col ON vv.color=col.id
        LEFT JOIN cmx_rndc_vehiculos_carroceria kr ON v.tipo_carroceria=kr.id
        LEFT JOIN cmx_rndc_aseguradoras ase ON vv.aseguradora=ase.id
        LEFT JOIN cmx_rndc_empresa_gps reg ON v.empresa_gps=reg.id
		WHERE v.numdoc_vehiculo=:vehiculo");
        $sql->bindParam(':vehiculo', $id_vehiculo, PDO::PARAM_STR);
        $sql->execute();

        $resultado = $sql->fetch(PDO::FETCH_ASSOC);
        if ($resultado) {
            //traer trailer
            $sql2 = $this->_db3->prepare("SELECT t.*,k.descripcion AS ceria,ma.marca AS mark, CONCAT(co.nombre,'-',co.tipo)AS confi, ase.nombre AS aseguradora,PROT.numero_documento AS docu_prot,PROT.tipo_documento AS Tipo_documento_propietario_trailer
				FROM cmx_trailer_vehiculo a
				INNER JOIN cmx_trailer t ON a.id_trailer=t.numdoc_trailer
				-- INNER JOIN cmx_rndc_trailertramites tt ON t.tipo_tramite=tt.id
				INNER JOIN cmx_rndc_vehiculos_carroceria k ON t.carroceria=k.id
				INNER JOIN cmx_rndc_trailermarcas ma ON t.marca=ma.id
				INNER JOIN cmx_rndc_vehiculos_configuracion co ON t.configuracion=co.id
				LEFT JOIN  cmx_rndc_aseguradoras ase ON t.aseguradora=ase.id
                LEFT JOIN cmx_proveedores PROT ON t.doc_propietario=PROT.numdoc_nexos
				WHERE a.id_vehiculo=:vehiculo AND a.estado=1");

            $sql2->bindParam(':vehiculo', $id_vehiculo, PDO::PARAM_STR);

            $sql2->execute();

            $resultado2 = $sql2->fetch(PDO::FETCH_ASSOC);
        }

        $resultados = array(

            "vehiculo" => $resultado,

            "trailer" => $resultado2,

        );

        return $resultados;
    }

    public function aprovar_hoja_vida_vehiculo_seguridad($datos)
    {

        $sqlm = "SELECT id  AS 'id' FROM cmx_estudio_vehiculo WHERE id_solicitud=:idsoli";

        $consulta_solic_vehic = $this->_db3->prepare($sqlm);

        $consulta_solic_vehic->bindParam(':idsoli', $datos['idsoli'], PDO::PARAM_STR);

        $consulta_solic_vehic->execute();

        $datos_proveedor = $consulta_solic_vehic->fetch();

        // $id_estudio = $datos_proveedor["id"];

        $sql2 = "SELECT * FROM cmx_aprobacion_estudio WHERE estudio='hoja de vida vehiculo' AND id_vehiculo=:id_vehiculo AND id_conductor=:id_conductor AND id_estudio=:id_estudio AND activo=1";

        $consulta_aprobac = $this->_db3->prepare($sql2);

        $consulta_aprobac->bindParam(':id_vehiculo', $datos['id_vehiculo'], PDO::PARAM_STR);

        $consulta_aprobac->bindParam(':id_conductor', $datos['id_conductor'], PDO::PARAM_STR);

        $consulta_aprobac->bindParam(':id_estudio', $datos['idsoli'], PDO::PARAM_STR);

        $consulta_aprobac->execute();

        $total = $consulta_aprobac->rowCount();

        if ($total == 0) {

            //aprobacion estudio

            $aprobo = '1';

            $sql = "INSERT INTO cmx_aprobacion_estudio(id,id_vehiculo,id_conductor,estudio,id_tipo,estado,observacion,id_estudio,fecha,hora,usuario,activo)

					VALUES(null,:id_vehiculo,:id_conductor,'hoja de vida vehiculo',:idtipo,:aprobo,:obser_vehiculo,:id_estudio,:fecha,:hora,:usuario,:activo)";

            $crear_solicitud = $this->_db3->prepare($sql);

            $crear_solicitud->bindParam(':id_vehiculo', $datos['id_vehiculo'], PDO::PARAM_STR);

            $crear_solicitud->bindParam(':id_conductor', $datos['id_conductor'], PDO::PARAM_STR);

            $crear_solicitud->bindParam(':idtipo', $datos['idtipo'], PDO::PARAM_STR);

            $crear_solicitud->bindParam(':aprobo', $aprobo, PDO::PARAM_STR);

            $crear_solicitud->bindParam(':obser_vehiculo', $datos['observeheciulo'], PDO::PARAM_STR);

            $crear_solicitud->bindParam(':id_estudio', $datos['idsoli'], PDO::PARAM_STR);

            $crear_solicitud->bindParam(':fecha', $datos['fecha'], PDO::PARAM_STR);

            $crear_solicitud->bindParam(':hora', $datos['hora'], PDO::PARAM_STR);

            $crear_solicitud->bindParam(':usuario', $datos['user'], PDO::PARAM_STR);

            $crear_solicitud->bindParam(':activo', $aprobo, PDO::PARAM_STR);

            $result = $crear_solicitud->execute();
        } else {

            //cambiar anteriores a 0 e insertar en 1

            $sql3 = "UPDATE cmx_aprobacion_estudio SET activo='0' WHERE estudio='hoja de vida vehiculo' AND id_vehiculo=:id_vehiculo AND id_conductor=:id_conductor AND id_estudio=:id_estudio";

            $crear_update = $this->_db3->prepare($sql3);

            $crear_update->bindParam(':id_vehiculo', $datos['id_vehiculo'], PDO::PARAM_STR);

            $crear_update->bindParam(':id_conductor', $datos['id_conductor'], PDO::PARAM_STR);

            $crear_update->bindParam(':id_estudio', $datos['idsoli'], PDO::PARAM_STR);

            $result = $crear_update->execute();

            if ($result) {

                $aprobo = '1';

                $sql = "INSERT INTO cmx_aprobacion_estudio(id,id_vehiculo,id_conductor,estudio,id_tipo,estado,observacion,id_estudio,fecha,hora,usuario,activo)

					VALUES(null,:id_vehiculo,:id_conductor,'hoja de vida vehiculo',:idtipo,:aprobo,:obser_vehiculo,:id_estudio,:fecha,:hora,:usuario,:activo)";

                $crear_solicitud = $this->_db3->prepare($sql);

                $crear_solicitud->bindParam(':id_vehiculo', $datos['id_vehiculo'], PDO::PARAM_STR);

                $crear_solicitud->bindParam(':id_conductor', $datos['id_conductor'], PDO::PARAM_STR);

                $crear_solicitud->bindParam(':idtipo', $datos['idtipo'], PDO::PARAM_STR);

                $crear_solicitud->bindParam(':aprobo', $aprobo, PDO::PARAM_STR);

                $crear_solicitud->bindParam(':obser_vehiculo', $datos['observeheciulo'], PDO::PARAM_STR);

                $crear_solicitud->bindParam(':id_estudio', $datos['idsoli'], PDO::PARAM_STR);

                $crear_solicitud->bindParam(':fecha', $datos['fecha'], PDO::PARAM_STR);

                $crear_solicitud->bindParam(':hora', $datos['hora'], PDO::PARAM_STR);

                $crear_solicitud->bindParam(':usuario', $datos['user'], PDO::PARAM_STR);

                $crear_solicitud->bindParam(':activo', $aprobo, PDO::PARAM_STR);

                $result = $crear_solicitud->execute();
            }
        }

        if ($result) {

            $response = array(

                'numero' => 200,
                'mensaje' => 'Hoja de vida de vehiculo aprobada para el estudio de seguridad con numero<strong>' . $datos['idsoli'] . '</strong>',

            );
        } else {

            $response = array(

                'numero' => 400,
                'mensaje' => 'Hoja de vida de vehiculo no aprobada para el estudio de seguridad con numero<strong>' . $datos['idsoli'] . '</strong>',

            );
        }

        return $response;
    }

    public function desaprovar_hoja_vida_vehiculo_seguridad($datos)
    {

        $sqlm = "SELECT id  AS 'id' FROM cmx_estudio_vehiculo WHERE id_solicitud=:idsoli";

        $consulta_solic_vehic = $this->_db3->prepare($sqlm);

        $consulta_solic_vehic->bindParam(':idsoli', $datos['idsoli'], PDO::PARAM_STR);

        $consulta_solic_vehic->execute();

        $datos_proveedor = $consulta_solic_vehic->fetch();

        // $id_estudio = $datos_proveedor["id"];

        $sql2 = "SELECT * FROM cmx_aprobacion_estudio WHERE estudio='hoja de vida vehiculo' AND id_vehiculo=:id_vehiculo AND id_conductor=:id_conductor AND id_estudio=:id_estudio AND activo=1";

        $consulta_aprobac = $this->_db3->prepare($sql2);

        $consulta_aprobac->bindParam(':id_vehiculo', $datos['id_vehiculo'], PDO::PARAM_STR);

        $consulta_aprobac->bindParam(':id_conductor', $datos['id_conductor'], PDO::PARAM_STR);

        $consulta_aprobac->bindParam(':id_estudio', $datos['idsoli'], PDO::PARAM_STR);

        $consulta_aprobac->execute();

        $total = $consulta_aprobac->rowCount();

        if ($total == 0) {

            //aprobacion estudio

            $aprobo = '0';

            $activo = '1';

            $sql = "INSERT INTO cmx_aprobacion_estudio(id,id_vehiculo,id_conductor,estudio,id_tipo,estado,observacion,id_estudio,fecha,hora,usuario,activo)

					VALUES(null,:id_vehiculo,:id_conductor,'hoja de vida vehiculo',:idtipo,:aprobo,:obser_vehiculo,:id_estudio,:fecha,:hora,:usuario,:activo)";

            $crear_solicitud = $this->_db3->prepare($sql);

            $crear_solicitud->bindParam(':id_vehiculo', $datos['id_vehiculo'], PDO::PARAM_STR);

            $crear_solicitud->bindParam(':id_conductor', $datos['id_conductor'], PDO::PARAM_STR);

            $crear_solicitud->bindParam(':idtipo', $datos['idtipo'], PDO::PARAM_STR);

            $crear_solicitud->bindParam(':aprobo', $aprobo, PDO::PARAM_STR);

            $crear_solicitud->bindParam(':obser_vehiculo', $datos['observeheciulo'], PDO::PARAM_STR);

            $crear_solicitud->bindParam(':id_estudio', $datos['idsoli'], PDO::PARAM_STR);

            $crear_solicitud->bindParam(':fecha', $datos['fecha'], PDO::PARAM_STR);

            $crear_solicitud->bindParam(':hora', $datos['hora'], PDO::PARAM_STR);

            $crear_solicitud->bindParam(':usuario', $datos['user'], PDO::PARAM_STR);

            $crear_solicitud->bindParam(':activo', $activo, PDO::PARAM_STR);

            $result = $crear_solicitud->execute();
        } else {

            //cambiar anteriores a 0 e insertar en 1

            $sql3 = "UPDATE cmx_aprobacion_estudio SET activo='0' WHERE estudio='hoja de vida vehiculo' AND id_vehiculo=:id_vehiculo AND id_conductor=:id_conductor AND id_estudio=:id_estudio";

            $crear_update = $this->_db3->prepare($sql3);

            $crear_update->bindParam(':id_vehiculo', $datos['id_vehiculo'], PDO::PARAM_STR);

            $crear_update->bindParam(':id_conductor', $datos['id_conductor'], PDO::PARAM_STR);

            $crear_update->bindParam(':id_estudio', $datos['idsoli'], PDO::PARAM_STR);

            $result = $crear_update->execute();

            if ($result) {

                $aprobo = '0';

                $activo = '1';

                $sql = "INSERT INTO cmx_aprobacion_estudio(id,id_vehiculo,id_conductor,estudio,id_tipo,estado,observacion,id_estudio,fecha,hora,usuario,activo)

					VALUES(null,:id_vehiculo,:id_conductor,'hoja de vida vehiculo',:idtipo,:aprobo,:obser_vehiculo,:id_estudio,:fecha,:hora,:usuario,:activo)";

                $crear_solicitud = $this->_db3->prepare($sql);

                $crear_solicitud->bindParam(':id_vehiculo', $datos['id_vehiculo'], PDO::PARAM_STR);

                $crear_solicitud->bindParam(':id_conductor', $datos['id_conductor'], PDO::PARAM_STR);

                $crear_solicitud->bindParam(':idtipo', $datos['idtipo'], PDO::PARAM_STR);

                $crear_solicitud->bindParam(':aprobo', $aprobo, PDO::PARAM_STR);

                $crear_solicitud->bindParam(':obser_vehiculo', $datos['observeheciulo'], PDO::PARAM_STR);

                $crear_solicitud->bindParam(':id_estudio', $datos['idsoli'], PDO::PARAM_STR);

                $crear_solicitud->bindParam(':fecha', $datos['fecha'], PDO::PARAM_STR);

                $crear_solicitud->bindParam(':hora', $datos['hora'], PDO::PARAM_STR);

                $crear_solicitud->bindParam(':usuario', $datos['user'], PDO::PARAM_STR);

                $crear_solicitud->bindParam(':activo', $activo, PDO::PARAM_STR);

                $result = $crear_solicitud->execute();
            }
        }

        if ($result) {

            $response = array(

                'numero' => 200,
                'mensaje' => 'Hoja de vida de vehiculo rechazada para el estudio de seguridad con numero<strong>' . $datos['idsoli'] . '</strong>',

            );
        } else {

            $response = array(

                'numero' => 400,
                'mensaje' => 'Hoja de vida de vehiculo no rechazada para el estudio de seguridad con numero<strong>' . $datos['idsoli'] . '</strong>',

            );
        }

        return $response;
    }

    public function Ver_conductor_seguridad($id_conductor, $num_documento)
    {

        $sql = $this->_db3->prepare("SELECT p.*, CONCAT(mu.municipio,'-',mu.depto) AS cipio, d.*

			FROM cmx_proveedores p

			INNER JOIN cmx_municipios mu ON p.id_municipio=mu.id

			LEFT JOIN cmx_detalle_conductor d ON p.numdoc_nexos=d.id_proveedor

			WHERE p.numero_documento=:id_conductor");

        $sql->bindParam(':id_conductor', $num_documento, PDO::PARAM_STR);

        $sql->execute();

        $resultado = $sql->fetch(PDO::FETCH_ASSOC);

        if ($resultado) {

            $sql2 = $this->_db3->prepare("SELECT * FROM cmx_referencias_preestudio WHERE id_conductor=:id_conductor");

            $sql2->bindParam(':id_conductor', $num_documento, PDO::PARAM_STR);

            $sql2->execute();

            $resultado_ref_preestudio = $sql2->fetchAll(PDO::FETCH_ASSOC);

            $sql3 = $this->_db3->prepare("SELECT * FROM cmx_referencias_personales WHERE id_conductor=:id_conductor");

            $sql3->bindParam(':id_conductor', $id_conductor, PDO::PARAM_STR);

            $sql3->execute();

            $resultado_ref_personal = $sql3->fetchAll(PDO::FETCH_ASSOC);
        }

        $resultados = array(

            "proveedores" => $resultado,

            "referencia_laboral" => $resultado_ref_preestudio,

            "referencia_personales" => $resultado_ref_personal,

        );

        return $resultados;
    }

    public function aprovar_hoja_vida_conductor_seguridad($datos)
    {

        $sql2 = "SELECT * FROM cmx_aprobacion_estudio WHERE estudio='hoja de vida conductor' AND id_vehiculo=:id_vehiculo AND id_conductor=:id_conductor AND id_estudio=:id_estudio AND activo=1";

        $consulta_aprobac = $this->_db3->prepare($sql2);

        $consulta_aprobac->bindParam(':id_vehiculo', $datos['id_vehiculo'], PDO::PARAM_STR);

        $consulta_aprobac->bindParam(':id_conductor', $datos['id_conductor'], PDO::PARAM_STR);

        $consulta_aprobac->bindParam(':id_estudio', $datos['idsoli'], PDO::PARAM_STR);

        $consulta_aprobac->execute();

        $total = $consulta_aprobac->rowCount();

        if ($total == 0) {

            //insertar aprobacion

            $sql = "INSERT INTO cmx_aprobacion_estudio(id,id_vehiculo,id_conductor,estudio,id_tipo,observacion,estado,id_estudio,fecha,hora,usuario,activo)

			VALUES(null,:id_vehiculo,:id_conductor,'hoja de vida conductor',:idtipo,:obse_condu,:aprobo,:id_estudio,:fecha,:hora,:usuario,:activo)";

            $crear_aprobacion = $this->_db3->prepare($sql);

            $crear_aprobacion->bindParam(':id_vehiculo', $datos['id_vehiculo'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':id_conductor', $datos['id_conductor'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':idtipo', $datos['idtipo'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':aprobo', $datos['aprobo'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':obse_condu', $datos['obse_condu'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':id_estudio', $datos['idsoli'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':fecha', $datos['fecha'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':hora', $datos['hora'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':usuario', $datos['user'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':activo', $datos['aprobo'], PDO::PARAM_STR);

            $result = $crear_aprobacion->execute();
        } else {

            //dejar los demas en cero e insertar

            $sql3 = "UPDATE cmx_aprobacion_estudio SET activo='0' WHERE estudio='hoja de vida conductor' AND id_vehiculo=:id_vehiculo AND id_conductor=:id_conductor AND id_estudio=:id_estudio";

            $crear_update = $this->_db3->prepare($sql3);

            $crear_update->bindParam(':id_vehiculo', $datos['id_vehiculo'], PDO::PARAM_STR);

            $crear_update->bindParam(':id_conductor', $datos['id_conductor'], PDO::PARAM_STR);

            $crear_update->bindParam(':id_estudio', $datos['idsoli'], PDO::PARAM_STR);

            $result = $crear_update->execute();

            if ($result) {

                //insertar aprobacion

                $sql = "INSERT INTO cmx_aprobacion_estudio(id,id_vehiculo,id_conductor,estudio,id_tipo,observacion,estado,id_estudio,fecha,hora,usuario,activo)

				VALUES(null,:id_vehiculo,:id_conductor,'hoja de vida conductor',:idtipo,:obse_condu,:aprobo,:id_estudio,:fecha,:hora,:usuario,:activo)";

                $crear_aprobacion = $this->_db3->prepare($sql);

                $crear_aprobacion->bindParam(':id_vehiculo', $datos['id_vehiculo'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':id_conductor', $datos['id_conductor'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':idtipo', $datos['idtipo'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':aprobo', $datos['aprobo'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':obse_condu', $datos['obse_condu'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':id_estudio', $datos['idsoli'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':fecha', $datos['fecha'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':hora', $datos['hora'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':usuario', $datos['user'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':activo', $datos['aprobo'], PDO::PARAM_STR);

                $result = $crear_aprobacion->execute();
            }
        }

        if ($result) {

            $response = array(

                'numero' => 200,
                'mensaje' => 'Hoja de vida de conductor aprobada para el estudio de seguridad con numero<strong>' . $datos['idsoli'] . '</strong>',

            );
        } else {

            $response = array(

                'numero' => 400,
                'mensaje' => 'Hoja de vida de conductor no aprobada para el estudio de seguridad con numero<strong>' . $datos['idsoli'] . '</strong>',

            );
        }

        return $response;
    }

    public function desaprovar_hoja_vida_conductor_seguridad($datos)
    {

        $sql2 = "SELECT * FROM cmx_aprobacion_estudio WHERE estudio='hoja de vida conductor' AND id_vehiculo=:id_vehiculo AND id_conductor=:id_conductor AND id_estudio=:id_estudio AND activo=1";

        $consulta_aprobac = $this->_db3->prepare($sql2);

        $consulta_aprobac->bindParam(':id_vehiculo', $datos['id_vehiculo'], PDO::PARAM_STR);

        $consulta_aprobac->bindParam(':id_conductor', $datos['id_conductor'], PDO::PARAM_STR);

        $consulta_aprobac->bindParam(':id_estudio', $datos['idsoli'], PDO::PARAM_STR);

        $consulta_aprobac->execute();

        $total = $consulta_aprobac->rowCount();

        if ($total == 0) {

            //insertar aprobacion

            $sql = "INSERT INTO cmx_aprobacion_estudio(id,id_vehiculo,id_conductor,estudio,id_tipo,observacion,estado,id_estudio,fecha,hora,usuario,activo)

			VALUES(null,:id_vehiculo,:id_conductor,'hoja de vida conductor',:idtipo,:obse_condu,:aprobo,:id_estudio,:fecha,:hora,:usuario,:activo)";

            $crear_aprobacion = $this->_db3->prepare($sql);

            $crear_aprobacion->bindParam(':id_vehiculo', $datos['id_vehiculo'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':id_conductor', $datos['id_conductor'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':idtipo', $datos['idtipo'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':aprobo', $datos['aprobo'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':obse_condu', $datos['obse_condu'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':id_estudio', $datos['idsoli'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':fecha', $datos['fecha'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':hora', $datos['hora'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':usuario', $datos['user'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':activo', $datos['activo'], PDO::PARAM_STR);

            $result = $crear_aprobacion->execute();
        } else {

            //dejar los demas en cero e insertar

            $sql3 = "UPDATE cmx_aprobacion_estudio SET activo='0' WHERE estudio='hoja de vida conductor' AND id_vehiculo=:id_vehiculo AND id_conductor=:id_conductor AND id_estudio=:id_estudio";

            $crear_update = $this->_db3->prepare($sql3);

            $crear_update->bindParam(':id_vehiculo', $datos['id_vehiculo'], PDO::PARAM_STR);

            $crear_update->bindParam(':id_conductor', $datos['id_conductor'], PDO::PARAM_STR);

            $crear_update->bindParam(':id_estudio', $datos['idsoli'], PDO::PARAM_STR);

            $result = $crear_update->execute();

            if ($result) {

                //insertar aprobacion

                $sql = "INSERT INTO cmx_aprobacion_estudio(id,id_vehiculo,id_conductor,estudio,id_tipo,observacion,estado,id_estudio,fecha,hora,usuario,activo)

				VALUES(null,:id_vehiculo,:id_conductor,'hoja de vida conductor',:idtipo,:obse_condu,:aprobo,:id_estudio,:fecha,:hora,:usuario,:activo)";

                $crear_aprobacion = $this->_db3->prepare($sql);

                $crear_aprobacion->bindParam(':id_vehiculo', $datos['id_vehiculo'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':id_conductor', $datos['id_conductor'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':idtipo', $datos['idtipo'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':aprobo', $datos['aprobo'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':obse_condu', $datos['obse_condu'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':id_estudio', $datos['idsoli'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':fecha', $datos['fecha'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':hora', $datos['hora'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':usuario', $datos['user'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':activo', $datos['activo'], PDO::PARAM_STR);

                $result = $crear_aprobacion->execute();
            }
        }

        if ($result) {

            $response = array(

                'numero' => 200,
                'mensaje' => 'Hoja de vida de conductor aprobada para el estudio de seguridad con numero<strong>' . $datos['idsoli'] . '</strong>',

            );
        } else {

            $response = array(

                'numero' => 400,
                'mensaje' => 'Hoja de vida de conductor no aprobada para el estudio de seguridad con numero<strong>' . $datos['idsoli'] . '</strong>',

            );
        }

        return $response;
    }

    public function aprovar_risk_seguridad($datos)
    {

        $miruta = $datos['ruta_eviden'] . '/' . $datos['idsoli'] . '/';

        $miruta2 = $datos['ruta_eviden'] . '/' . $datos['idsoli'] . '/';

        $aleatorio1 = rand(10000, 90000);

        $aleatorio2 = rand(10000, 90000);

        $name_eviden = $datos['name_eviden'];

        if ($name_eviden) {

            $name_eviden = $name_eviden;
        } else {

            $name_eviden = '';
        }

        $evi_plataforma = $datos['evi_plataforma'];

        $sql2 = "SELECT * FROM cmx_aprobacion_estudio WHERE estudio=:estudio AND id_vehiculo=:id_vehiculo AND id_conductor=:id_conductor AND id_estudio=:id_estudio AND activo=1";

        $consulta_aprobac = $this->_db3->prepare($sql2);

        $consulta_aprobac->bindParam(':estudio', $datos['estudio'], PDO::PARAM_STR);

        $consulta_aprobac->bindParam(':id_vehiculo', $datos['id_vehiculo'], PDO::PARAM_STR);

        $consulta_aprobac->bindParam(':id_conductor', $datos['id_conductor'], PDO::PARAM_STR);

        $consulta_aprobac->bindParam(':id_estudio', $datos['idsoli'], PDO::PARAM_STR);

        $consulta_aprobac->execute();

        $total = $consulta_aprobac->rowCount();

        if ($total == 0) {

            $sql = "INSERT INTO cmx_aprobacion_estudio(id,id_vehiculo,id_conductor,estudio,id_tipo,observacion,estado,id_estudio,ruta_evidencia,name_evidencia,fecha,hora,usuario,activo)

					VALUES(null,:id_vehiculo,:id_conductor,:estudio,:idtipo,:obse_todo,:aprobo,:id_estudio,:miruta2,:name_eviden,:fecha,:hora,:usuario,:activo)";

            $crear_aprobacion = $this->_db3->prepare($sql);

            $crear_aprobacion->bindParam(':id_vehiculo', $datos['id_vehiculo'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':id_conductor', $datos['id_conductor'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':estudio', $datos['estudio'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':idtipo', $datos['idtipo'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':obse_todo', $datos['obse_todo'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':aprobo', $datos['aprobo'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':id_estudio', $datos['idsoli'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':miruta2', $miruta2, PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':name_eviden', $name_eviden, PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':fecha', $datos['fecha'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':hora', $datos['hora'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':usuario', $datos['user'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':activo', $datos['aprobo'], PDO::PARAM_STR);

            $result = $crear_aprobacion->execute();

            if ($result) {

                // Verificar si la carpeta ya existe

                if ($evi_plataforma !== "") {

                    if (!is_dir($miruta)) {

                        // Crear la carpeta

                        if (mkdir($miruta, 0777, true)) {

                            $file = $evi_plataforma;

                            $nombre = $file["name"];

                            $tipo = $file["type"];

                            $ruta_provisional = $file["tmp_name"];

                            $carpeta = $miruta;

                            $src = $carpeta . $nombre;

                            move_uploaded_file($ruta_provisional, $src);
                        } else {

                            echo "No se pudo crear la carpeta 2.";
                        }
                    } else {

                        $file = $evi_plataforma;

                        $nombre = $file["name"];

                        $tipo = $file["type"];

                        $ruta_provisional = $file["tmp_name"];

                        $carpeta = $miruta;

                        $src = $carpeta . $nombre;

                        move_uploaded_file($ruta_provisional, $src);
                    }
                }
            }
        } else {

            //cambiar anteriores a 0 e insertar en 1

            $sql3 = "UPDATE cmx_aprobacion_estudio SET activo='0' WHERE estudio=:estudio AND id_vehiculo=:id_vehiculo AND id_conductor=:id_conductor AND id_estudio=:id_estudio";

            $crear_update = $this->_db3->prepare($sql3);

            $crear_update->bindParam(':estudio', $datos['estudio'], PDO::PARAM_STR);

            $crear_update->bindParam(':id_vehiculo', $datos['id_vehiculo'], PDO::PARAM_STR);

            $crear_update->bindParam(':id_conductor', $datos['id_conductor'], PDO::PARAM_STR);

            $crear_update->bindParam(':id_estudio', $datos['idsoli'], PDO::PARAM_STR);

            $result3 = $crear_update->execute();

            if ($result3) {

                $sql = "INSERT INTO cmx_aprobacion_estudio(id,id_vehiculo,id_conductor,estudio,id_tipo,observacion,estado,id_estudio,ruta_evidencia,name_evidencia,fecha,hora,usuario,activo)

						VALUES(null,:id_vehiculo,:id_conductor,:estudio,:idtipo,:obse_todo,:aprobo,:id_estudio,:miruta2,:name_eviden,:fecha,:hora,:usuario,:activo)";

                $crear_aprobacion = $this->_db3->prepare($sql);

                $crear_aprobacion->bindParam(':id_vehiculo', $datos['id_vehiculo'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':id_conductor', $datos['id_conductor'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':estudio', $datos['estudio'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':idtipo', $datos['idtipo'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':obse_todo', $datos['obse_todo'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':aprobo', $datos['aprobo'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':id_estudio', $datos['idsoli'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':miruta2', $miruta2, PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':name_eviden', $datos['name_eviden'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':fecha', $datos['fecha'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':hora', $datos['hora'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':usuario', $datos['user'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':activo', $datos['aprobo'], PDO::PARAM_STR);

                $result = $crear_aprobacion->execute();

                if ($result) {

                    if ($evi_plataforma !== "") {

                        // Verificar si la carpeta ya existe

                        if (!is_dir($miruta)) {

                            // Crear la carpeta

                            if (mkdir($miruta, 0777, true)) {

                                $file = $evi_plataforma;

                                $nombre = $file["name"];

                                $tipo = $file["type"];

                                $ruta_provisional = $file["tmp_name"];

                                $carpeta = $miruta;

                                $src = $carpeta . $nombre;

                                move_uploaded_file($ruta_provisional, $src);
                            } else {

                                echo "No se pudo crear la carpeta 2.";
                            }
                        } else {

                            $file = $evi_plataforma;

                            $nombre = $file["name"];

                            $tipo = $file["type"];

                            $ruta_provisional = $file["tmp_name"];

                            $carpeta = $miruta;

                            $src = $carpeta . $nombre;

                            move_uploaded_file($ruta_provisional, $src);
                        }
                    }
                }
            }
        }

        if ($result) {

            $response = array(

                'numero' => 200,
                'mensaje' => '' . $datos['estudio'] . ' aprobado para el estudio de seguridad con numero <strong>' . $datos['idsoli'] . '</strong>',

            );
        } else {

            $response = array(

                'numero' => 400,
                'mensaje' => '' . $datos['estudio'] . '  no aprobado para el estudio de seguridad con numero <strong>' . $datos['idsoli'] . '</strong>',

            );
        }

        return $response;
    }

    public function desaprovar_risk_seguridad($datos)
    {

        $miruta = $datos['ruta_eviden'] . '/' . $datos['idsoli'] . '/';

        $miruta2 = $datos['ruta_eviden'] . '/' . $datos['idsoli'] . '/';

        $aleatorio1 = rand(10000, 90000);

        $aleatorio2 = rand(10000, 90000);

        $name_eviden = $datos['name_eviden'];

        if ($name_eviden) {

            $name_eviden = $aleatorio1 . $name_eviden . $aleatorio2;
        } else {

            $name_eviden = '';
        }

        $evi_plataforma = $datos['evi_plataforma'];

        $sql2 = "SELECT * FROM cmx_aprobacion_estudio WHERE estudio=:estudio AND id_vehiculo=:id_vehiculo AND id_conductor=:id_conductor AND id_estudio=:id_estudio AND activo=1";

        $consulta_aprobac = $this->_db3->prepare($sql2);

        $consulta_aprobac->bindParam(':estudio', $datos['estudio'], PDO::PARAM_STR);

        $consulta_aprobac->bindParam(':id_vehiculo', $datos['id_vehiculo'], PDO::PARAM_STR);

        $consulta_aprobac->bindParam(':id_conductor', $datos['id_conductor'], PDO::PARAM_STR);

        $consulta_aprobac->bindParam(':id_estudio', $datos['idsoli'], PDO::PARAM_STR);

        $consulta_aprobac->execute();

        $total = $consulta_aprobac->rowCount();

        if ($total == 0) {

            $sql = "INSERT INTO cmx_aprobacion_estudio(id,id_vehiculo,id_conductor,estudio,id_tipo,observacion,estado,id_estudio,ruta_evidencia,name_evidencia,fecha,hora,usuario,activo)

					VALUES(null,:id_vehiculo,:id_conductor,:estudio,:idtipo,:obse_todo,:aprobo,:id_estudio,:miruta2,:name_eviden,:fecha,:hora,:usuario,:activo)";

            $crear_aprobacion = $this->_db3->prepare($sql);

            $crear_aprobacion->bindParam(':id_vehiculo', $datos['id_vehiculo'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':id_conductor', $datos['id_conductor'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':estudio', $datos['estudio'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':idtipo', $datos['idtipo'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':obse_todo', $datos['obse_todo'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':aprobo', $datos['aprobo'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':id_estudio', $datos['idsoli'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':miruta2', $miruta2, PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':name_eviden', $datos['name_eviden'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':fecha', $datos['fecha'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':hora', $datos['hora'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':usuario', $datos['user'], PDO::PARAM_STR);

            $crear_aprobacion->bindParam(':activo', $datos['activo'], PDO::PARAM_STR);

            $result = $crear_aprobacion->execute();

            if ($result) {

                // Verificar si la carpeta ya existe

                if ($evi_plataforma !== "") {

                    if (!is_dir($miruta)) {

                        // Crear la carpeta

                        if (mkdir($miruta, 0777, true)) {

                            $file = $evi_plataforma;

                            $nombre = $file["name"];

                            $tipo = $file["type"];

                            $ruta_provisional = $file["tmp_name"];

                            $carpeta = $miruta;

                            $src = $carpeta . $nombre;

                            move_uploaded_file($ruta_provisional, $src);
                        } else {

                            echo "No se pudo crear la carpeta 2.";
                        }
                    } else {

                        $file = $evi_plataforma;

                        $nombre = $file["name"];

                        $tipo = $file["type"];

                        $ruta_provisional = $file["tmp_name"];

                        $carpeta = $miruta;

                        $src = $carpeta . $nombre;

                        move_uploaded_file($ruta_provisional, $src);
                    }
                }
            }
        } else {

            //cambiar anteriores a 0 e insertar en 1

            $sql3 = "UPDATE cmx_aprobacion_estudio SET activo='0' WHERE estudio=:estudio AND id_vehiculo=:id_vehiculo AND id_conductor=:id_conductor AND id_estudio=:id_estudio";

            $crear_update = $this->_db3->prepare($sql3);

            $crear_update->bindParam(':estudio', $datos['estudio'], PDO::PARAM_STR);

            $crear_update->bindParam(':id_vehiculo', $datos['id_vehiculo'], PDO::PARAM_STR);

            $crear_update->bindParam(':id_conductor', $datos['id_conductor'], PDO::PARAM_STR);

            $crear_update->bindParam(':id_estudio', $datos['idsoli'], PDO::PARAM_STR);

            $result3 = $crear_update->execute();

            if ($result3) {

                $sql = "INSERT INTO cmx_aprobacion_estudio(id,id_vehiculo,id_conductor,estudio,id_tipo,observacion,estado,id_estudio,ruta_evidencia,name_evidencia,fecha,hora,usuario,activo)

						VALUES(null,:id_vehiculo,:id_conductor,:estudio,:idtipo,:obse_todo,:aprobo,:id_estudio,:miruta2,:name_eviden,:fecha,:hora,:usuario,:activo)";

                $crear_aprobacion = $this->_db3->prepare($sql);

                $crear_aprobacion->bindParam(':id_vehiculo', $datos['id_vehiculo'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':id_conductor', $datos['id_conductor'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':estudio', $datos['estudio'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':idtipo', $datos['idtipo'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':obse_todo', $datos['obse_todo'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':aprobo', $datos['aprobo'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':id_estudio', $datos['idsoli'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':miruta2', $miruta2, PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':name_eviden', $datos['name_eviden'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':fecha', $datos['fecha'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':hora', $datos['hora'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':usuario', $datos['user'], PDO::PARAM_STR);

                $crear_aprobacion->bindParam(':activo', $datos['activo'], PDO::PARAM_STR);

                $result = $crear_aprobacion->execute();

                if ($result) {

                    // Verificar si la carpeta ya existe

                    if ($evi_plataforma !== "") {

                        if (!is_dir($miruta)) {

                            // Crear la carpeta

                            if (mkdir($miruta, 0777, true)) {

                                $file = $evi_plataforma;

                                $nombre = $file["name"];

                                $tipo = $file["type"];

                                $ruta_provisional = $file["tmp_name"];

                                $carpeta = $miruta;

                                $src = $carpeta . $nombre;

                                move_uploaded_file($ruta_provisional, $src);
                            } else {

                                echo "No se pudo crear la carpeta 2.";
                            }
                        } else {

                            $file = $evi_plataforma;

                            $nombre = $file["name"];

                            $tipo = $file["type"];
                            $ruta_provisional = $file["tmp_name"];

                            $carpeta = $miruta;

                            $src = $carpeta . $nombre;

                            move_uploaded_file($ruta_provisional, $src);
                        }
                    }
                }
            }
        }

        if ($result) {

            $response = array(

                'numero' => 200,
                'mensaje' => ' ' . $datos['estudio'] . ' desaprobado para el estudio de seguridad con numero <strong>' . $datos['idsoli'] . '</strong>',

            );
        } else {

            $response = array(

                'numero' => 400,
                'mensaje' => ' ' . $datos['estudio'] . ' no desaprobado para el estudio de seguridad con numero <strong>' . $datos['idsoli'] . '</strong>',

            );
        }

        return $response;
    }

    public function tipos_estudios($idestudio)
    {

        $sql = $this->_db3->prepare("SELECT a.id_tipo, a.estudio, a.estado, t.requerido,t.id, t.nombre

			FROM  cmx_tipo_estudio t

			INNER JOIN cmx_aprobacion_estudio a ON a.id_tipo=t.id AND a.activo=1 AND a.id_estudio=:idestudio");

        $sql->bindParam(':idestudio', $idestudio, PDO::PARAM_STR);

        $sql->execute();

        $resultado2 = $sql->fetchAll(PDO::FETCH_ASSOC);

        return $resultado2;
    }

    public function Aprobacion_total_estudio($datos)
    {
        try {
            $this->_db3->beginTransaction();

            $usuario = $_SESSION["usuario"]["nom_usuario"];
            $estado_sub = "Activo";
            $estado_de_registro = $datos['estado'];
            $id_estudio = $datos['idestudio'];

            // Actualizar el estado iniciado a cero
            $sqla = "UPDATE cmx_estudiov_completo SET estado_actu=0 WHERE id_estudio=:idestudio AND id_vehiculo=:idcarro AND id_conductor=:idcondu";
            $update_ante = $this->_db3->prepare($sqla);
            $update_ante->bindParam(':idestudio', $datos['idestudio'], PDO::PARAM_STR);
            $update_ante->bindParam(':idcarro', $datos['idcarro'], PDO::PARAM_STR);
            $update_ante->bindParam(':idcondu', $datos['idcondu'], PDO::PARAM_STR);
            $resulta = $update_ante->execute();

            if (!$resulta) {
                throw new Exception("No se pudo actualizar el estado actual");
            }

            // Insertar estado nuevo
            $sql = "INSERT INTO cmx_estudiov_completo (id, id_estudio_c, id_estudio, estado, id_vehiculo, id_conductor, observacion, proceso, fecha, hora, usuario, estado_actu, estado_subasta, causalidad)
                VALUES (null, :id_estudio_c, :id_estudio, :estado, :id_vehiculo, :id_conductor, :observacion, :proceso, :fecha, :hora, :usuario, :estado_actu, :estado_subasta, :causalidad)";
            $crear_estudiocompl = $this->_db3->prepare($sql);
            $crear_estudiocompl->bindParam(':id_estudio_c', $datos['id_estudio_c'], PDO::PARAM_STR);
            $crear_estudiocompl->bindParam(':id_estudio', $datos['idestudio'], PDO::PARAM_STR);
            $crear_estudiocompl->bindParam(':estado', $datos['estado'], PDO::PARAM_STR);
            $crear_estudiocompl->bindParam(':id_vehiculo', $datos['idcarro'], PDO::PARAM_STR);
            $crear_estudiocompl->bindParam(':id_conductor', $datos['idcondu'], PDO::PARAM_STR);
            $crear_estudiocompl->bindParam(':observacion', $datos['obser'], PDO::PARAM_STR);
            $crear_estudiocompl->bindParam(':proceso', $datos['proceso_estudio'], PDO::PARAM_STR);
            $crear_estudiocompl->bindParam(':fecha', $datos['fecha'], PDO::PARAM_STR);
            $crear_estudiocompl->bindParam(':hora', $datos['hora'], PDO::PARAM_STR);
            $crear_estudiocompl->bindParam(':usuario', $usuario, PDO::PARAM_STR);
            $crear_estudiocompl->bindParam(':estado_actu', $datos['estado_actu'], PDO::PARAM_STR);
            $crear_estudiocompl->bindParam(':estado_subasta', $estado_sub, PDO::PARAM_STR);
            $crear_estudiocompl->bindParam(':causalidad', $datos['obser'], PDO::PARAM_STR);
            $result = $crear_estudiocompl->execute();

            if (!$result) {
                throw new Exception("No se pudo insertar el nuevo estado");
            }

            // Crear log
            $sql2 = "INSERT INTO cmx_logestudio_com (id, id_completo, id_estudio, fecha, hora, id_usuario, estado)
                 VALUES (null, :id_completo, :idestudio, :fecha, :hora, :usuario, :operacion)";
            $crear_log = $this->_db3->prepare($sql2);
            $crear_log->bindParam(':id_completo', $datos['id_estudio_c'], PDO::PARAM_STR);
            $crear_log->bindParam(':idestudio', $datos['idestudio'], PDO::PARAM_STR);
            $crear_log->bindParam(':fecha', $datos['fecha'], PDO::PARAM_STR);
            $crear_log->bindParam(':hora', $datos['hora'], PDO::PARAM_STR);
            $crear_log->bindParam(':usuario', $usuario, PDO::PARAM_STR);
            $crear_log->bindParam(':operacion', $datos['operacion'], PDO::PARAM_STR);
            $result1 = $crear_log->execute();

            if (!$result1) {
                throw new Exception("No se pudo crear el log");
            }
            // Registrar subasta si está aprobado
            if ($estado_de_registro == 'Aprobado') {
                $subasta = $this->Insert_Subasta_Final($id_estudio);
                foreach ($subasta as $value) {
                    if ($value == 'si_inserto') {
                        $this->_db3->commit();
                        return [
                            'numero' => 200,
                            'mensaje' => 'Estudio de seguridad ' . $estado_de_registro . ' para el estudio de seguridad con numero <strong>' . $id_estudio . '</strong>',
                        ];
                    } else {
                        throw new Exception("No se pudo insertar el movimiento actual para la aprobación del estudio");
                    }
                }
            } else {
                // $this->_db3->commit();
                return [
                    'numero' => 200,
                    'mensaje' => 'Estudio de seguridad ' . $estado_de_registro . ' para el estudio de seguridad con numero <strong>' . $datos['idestudio'] . '</strong>',
                ];
            }
        } catch (\Throwable $th) {
            if ($this->_db3->inTransaction()) {
                $this->_db3->rollBack();
            }
            echo "Error en la transacción: " . $th->getMessage();
        }
    }

    public function Ver_estudio_operaciones($datos)
    {

        $sql2 = $this->_db3->prepare("SELECT e.id_solicitud , a.*, CASE WHEN ec.estado IS NULL THEN 'gray' ELSE ec.estado  END AS 'estadototal'
		FROM cmx_aprobacion_estudio a
		INNER JOIN cmx_estudio_vehiculo e ON a.id_estudio=e.id_estudio AND a.activo=1
		LEFT JOIN cmx_estudiov_completo ec ON e.id_estudio=ec.id_estudio AND estado_actu=1
		WHERE a.id_vehiculo=:idv AND a.id_conductor=:idc AND e.id_estudio=:idsoli");
        $sql2->bindParam(':idv', $datos['idv'], PDO::PARAM_STR);
        $sql2->bindParam(':idc', $datos['idc'], PDO::PARAM_STR);
        $sql2->bindParam(':idsoli', $datos['idsoli'], PDO::PARAM_STR);
        $sql2->execute();
        $resultado = $sql2->fetchAll(PDO::FETCH_ASSOC);

        $sql3 = $this->_db3->prepare("SELECT ec.id, ec.observacion, ec.fecha,ec.hora,ec.usuario,ec.estado FROM cmx_aprobacion_estudio ap
        INNER JOIN cmx_estudiov_completo ec ON ec.id_estudio=ap.id_estudio
        WHERE ap.id_estudio=:idsolicitud GROUP BY ec.observacion ORDER BY ap.fecha, ap.hora DESC");
        $sql3->bindParam(':idsolicitud', $datos['idsoli'], PDO::PARAM_STR);
        $sql3->execute();
        $resultado_observacion = $sql3->fetchAll(PDO::FETCH_ASSOC);

        $response = array(
            "resultado" => $resultado,
            "resultado_observacion" => $resultado_observacion,
        );

        return $response;
        // return $resultado;
    }
    public function Consultar_respuesta_operaciones($idstu)
    {
        //Operaciones
        $sql = $this->_db3->prepare("SELECT * FROM cmx_respuesta_operacion WHERE id_estudio=:idsolicitud  ORDER BY fecha, hora DESC");
        $sql->bindParam(':idsolicitud', $idstu, PDO::PARAM_STR);
        $sql->execute();
        $resultado_operaciones = $sql->fetchAll(PDO::FETCH_ASSOC);

        //Seguridad
        $sql2 = $this->_db3->prepare("SELECT * FROM cmx_aprobacion_estudio WHERE id_estudio=:idsolicitud ORDER BY fecha, hora DESC");
        $sql2->bindParam(':idsolicitud', $idstu, PDO::PARAM_STR);
        $sql2->execute();
        $resultado_seguridad = $sql2->fetchAll(PDO::FETCH_ASSOC);

        $sql3 = $this->_db3->prepare("SELECT ec.id, ec.observacion, ec.fecha,ec.hora,ec.usuario,ec.estado FROM cmx_aprobacion_estudio ap
        INNER JOIN cmx_estudiov_completo ec ON ec.id_estudio=ap.id_estudio
        WHERE ap.id_estudio=:idsolicitud GROUP BY ec.observacion ORDER BY ap.fecha, ap.hora DESC");
        $sql3->bindParam(':idsolicitud', $idstu, PDO::PARAM_STR);
        $sql3->execute();
        $resultado_observacion = $sql3->fetchAll(PDO::FETCH_ASSOC);

        $response = array(
            "respuesta_operaciones" => $resultado_operaciones,
            "respuesta_seguridad" => $resultado_seguridad,
            "resultado_observacion" => $resultado_observacion,
        );

        return $response;
    }

    public function reactivar_estudio_operaciones($datos)
    {
        $user = $_SESSION["usuario"]["nom_usuario"];
        $sql1 = "UPDATE cmx_estudiov_completo SET estado_actu=0 WHERE id_estudio=:id_estudio";
        $update_vc = $this->_db3->prepare($sql1);
        $update_vc->bindParam(':id_estudio', $datos['num_estudio'], PDO::PARAM_STR);
        $result_update = $update_vc->execute();

        if ($result_update) {
            $sql = "INSERT INTO cmx_estudiov_completo (id,id_estudio_c,id_estudio,estado,id_vehiculo,id_conductor,observacion,proceso,fecha,hora,usuario,estado_actu,estado_subasta)
			VALUES(null,:id_estudio_c,:id_estudio,:estado,:id_vehiculo,:id_conductor,:observacion,:proceso,:fecha,:hora,:usuario,:estado_actu,:estado_subasta)";
            $crear_estudiocompl = $this->_db3->prepare($sql);
            $crear_estudiocompl->bindParam(':id_estudio_c', $datos['id_estudio_c'], PDO::PARAM_STR);
            $crear_estudiocompl->bindParam(':id_estudio', $datos['num_estudio'], PDO::PARAM_STR);
            $crear_estudiocompl->bindParam(':estado', $datos['estado'], PDO::PARAM_STR);
            $crear_estudiocompl->bindParam(':id_vehiculo', $datos['id_vehiculo'], PDO::PARAM_STR);
            $crear_estudiocompl->bindParam(':id_conductor', $datos['id_conductor'], PDO::PARAM_STR);
            $crear_estudiocompl->bindParam(':observacion', $datos['observacion'], PDO::PARAM_STR);
            $crear_estudiocompl->bindParam(':proceso', $datos['proceso'], PDO::PARAM_STR);
            $crear_estudiocompl->bindParam(':fecha', $datos['fecha'], PDO::PARAM_STR);
            $crear_estudiocompl->bindParam(':hora', $datos['hora'], PDO::PARAM_STR);
            $crear_estudiocompl->bindParam(':usuario', $user, PDO::PARAM_STR);
            $crear_estudiocompl->bindParam(':estado_actu', $datos['estado_actual'], PDO::PARAM_STR);
            $crear_estudiocompl->bindParam(':estado_subasta', $datos['estado_subasta'], PDO::PARAM_STR);
            $result = $crear_estudiocompl->execute();

            if ($result) {
                $sql2 = "INSERT INTO cmx_logestudio_com (id,id_completo,id_estudio,fecha,hora,id_usuario,estado)
				VALUES(null,:id_completo,:idestudio,:fecha,:hora,:usuario,:estado)";
                $crear_log = $this->_db3->prepare($sql2);
                $crear_log->bindParam(':id_completo', $datos['id_estudio_c'], PDO::PARAM_STR);
                $crear_log->bindParam(':idestudio', $datos['num_estudio'], PDO::PARAM_STR);
                $crear_log->bindParam(':fecha', $datos['fecha'], PDO::PARAM_STR);
                $crear_log->bindParam(':hora', $datos['hora'], PDO::PARAM_STR);
                $crear_log->bindParam(':usuario', $user, PDO::PARAM_STR);
                $crear_log->bindParam(':estado', $datos['estado_log'], PDO::PARAM_STR);
                $result_log = $crear_log->execute();
                if ($result_log) {
                    $hora = date('H:m:s');
                    // Actualizar hora del estudio cuando le dan respuesta
                    $sql_update_hora = $this->_db3->prepare("UPDATE cmx_estudio_vehiculo SET hora=:hora WHERE id_estudio=:id_estudio");
                    $sql_update_hora->bindParam(':hora', $hora, PDO::PARAM_STR);
                    $sql_update_hora->bindParam(':id_estudio', $datos['num_estudio'], PDO::PARAM_STR);
                    $result_update = $sql_update_hora->execute();
                    if ($result_update) {
                        $response = array(
                            'numero' => 200,
                            'mensaje' => 'Estudio de seguridad retornado para seguridad con el numero <strong>' . $datos['num_estudio'] . '</strong>',
                        );
                    } else {
                        $response = array(
                            'numero' => 400,
                            'mensaje' => 'Estudio de se guridad no ' . $datos['estado'] . ' para el estudio de seguridad con numero <strong>' . $datos['idestudio'] . '</strong>',
                        );
                    }
                } else {
                    $response = array(
                        'numero' => 400,
                        'mensaje' => 'Estudio de seguridad no retornado para seguridad <strong>' . $datos['num_estudio'] . '</strong>',
                    );
                }
                return $response;
            } else {

                $mensajeError = "transaccion fallo:No se puede insertar el log de los estudio de renovacion";
                error_log($mensajeError, 3, "error_log.txt");
            }
        } else {

            $mensajeError = "transaccion fallo:No se puede actualizar estado actual del estudio de seguridad";
            error_log($mensajeError, 3, "error_log.txt");
        }

        $usuario = $_SESSION["usuario"]["nom_usuario"];
        $estado_sub = "Activo";
        //actualizar el estado iniciado a cero
        $sqla = "UPDATE cmx_estudiov_completo SET estado_actu=0 WHERE id_estudio=:idestudio AND id_vehiculo=:idcarro AND id_conductor=:idcondu";
        $update_ante = $this->_db3->prepare($sqla);
        $update_ante->bindParam(':idestudio', $datos['idestudio'], PDO::PARAM_STR);
        $update_ante->bindParam(':idcarro', $datos['idcarro'], PDO::PARAM_STR);
        $update_ante->bindParam(':idcondu', $datos['idcondu'], PDO::PARAM_STR);
        $resulta = $update_ante->execute();
        if ($resulta) {
            //insertar estado nuevo
            $sql = "INSERT INTO cmx_estudiov_completo (id,id_estudio_c,id_estudio,estado,id_vehiculo,id_conductor,observacion,proceso,fecha,hora,usuario,estado_actu,estado_subasta)
			VALUES(null,:id_estudio_c,:id_estudio,:estado,:id_vehiculo,:id_conductor,:observacion,:proceso,:fecha,:hora,:usuario,:estado_actu,:estado_subasta)";
            $crear_estudiocompl = $this->_db3->prepare($sql);
            $crear_estudiocompl->bindParam(':id_estudio_c', $datos['id_estudio_c'], PDO::PARAM_STR);
            $crear_estudiocompl->bindParam(':id_estudio', $datos['idestudio'], PDO::PARAM_STR);
            $crear_estudiocompl->bindParam(':estado', $datos['estado'], PDO::PARAM_STR);
            $crear_estudiocompl->bindParam(':id_vehiculo', $datos['idcarro'], PDO::PARAM_STR);
            $crear_estudiocompl->bindParam(':id_conductor', $datos['idcondu'], PDO::PARAM_STR);
            $crear_estudiocompl->bindParam(':observacion', $datos['obser'], PDO::PARAM_STR);
            $crear_estudiocompl->bindParam(':proceso', $datos['proceso_estudio'], PDO::PARAM_STR);
            $crear_estudiocompl->bindParam(':fecha', $datos['fecha'], PDO::PARAM_STR);
            $crear_estudiocompl->bindParam(':hora', $datos['hora'], PDO::PARAM_STR);
            $crear_estudiocompl->bindParam(':usuario', $usuario, PDO::PARAM_STR);
            $crear_estudiocompl->bindParam(':estado_actu', $datos['estado_actu'], PDO::PARAM_STR);
            $crear_estudiocompl->bindParam(':estado_subasta', $estado_sub, PDO::PARAM_STR);
            $result = $crear_estudiocompl->execute();

            if ($result) {
                $sql2 = "INSERT INTO cmx_logestudio_com (id,id_completo,id_estudio,fecha,hora,id_usuario,estado)
				VALUES(null,:id_completo,:idestudio,:fecha,:hora,:usuario,:operacion)";
                $crear_log = $this->_db3->prepare($sql2);
                $crear_log->bindParam(':id_completo', $datos['id_estudio_c'], PDO::PARAM_STR);
                $crear_log->bindParam(':idestudio', $datos['idestudio'], PDO::PARAM_STR);
                $crear_log->bindParam(':fecha', $datos['fecha'], PDO::PARAM_STR);
                $crear_log->bindParam(':hora', $datos['hora'], PDO::PARAM_STR);
                $crear_log->bindParam(':usuario', $usuario, PDO::PARAM_STR);
                $crear_log->bindParam(':operacion', $datos['operacion'], PDO::PARAM_STR);
                $result1 = $crear_log->execute();

                if ($result1) {
                    $hora = date('H:m:s');
                    // Actualizar hora del estudio cuando le dan respuesta
                    $sql_update_hora = $this->_db3->prepare("UPDATE cmx_estudio_vehiculo SET hora=:hora WHERE id_estudio=:id_estudio");
                    $sql_update_hora->bindParam(':hora', $hora, PDO::PARAM_STR);
                    $sql_update_hora->bindParam(':id_estudio', $datos['num_estudio'], PDO::PARAM_STR);
                    $result_update = $sql_update_hora->execute();
                    if ($result_update) {
                        $response = array(
                            'numero' => 200,
                            'mensaje' => 'Estudio de seguridad ' . $datos['estado'] . ' para el estudio de seguridad con numero <strong>' . $datos['idestudio'] . '</strong>',
                        );
                    } else {
                        $response = array(
                            'numero' => 400,
                            'mensaje' => 'Estudio de se guridad no ' . $datos['estado'] . ' para el estudio de seguridad con numero <strong>' . $datos['idestudio'] . '</strong>',
                        );
                    }
                } else {
                    $response = array(
                        'numero' => 400,
                        'mensaje' => 'Estudio de se guridad no ' . $datos['estado'] . ' para el estudio de seguridad con numero <strong>' . $datos['idestudio'] . '</strong>',
                    );
                }

                return $response;
            } else {
                $mensajeError = "transaccion fallo: No ejecuto la insersion del movimiento actual para la aprobacion del estudio";
                error_log($mensajeError, 3, "error_log.txt");
            }
        } else {
            $mensajeError = "transaccion fallo: No ejecuto la actualizacion del estado actual para la aprobacion del estudio";
            error_log($mensajeError, 3, "error_log.txt");
        }
    }

    public function registrar_respuesta_operacion($datos)
    {

        $user = $_SESSION["usuario"]["nom_usuario"];

        $sql = "INSERT INTO cmx_respuesta_operacion (id,id_estudio,id_movimiento,estudio_letra,nota,fecha,hora,usuario)

		VALUES(null,:nestudio,:ntipo,:estudio,:rta,:fecha,:hora,:user);";

        $crear_rta = $this->_db3->prepare($sql);
        $crear_rta->bindParam(':nestudio', $datos['nestudio'], PDO::PARAM_STR);
        $crear_rta->bindParam(':ntipo', $datos['ntipo'], PDO::PARAM_STR);
        $crear_rta->bindParam(':estudio', $datos['estudio'], PDO::PARAM_STR);
        $crear_rta->bindParam(':rta', $datos['rta'], PDO::PARAM_STR);
        $crear_rta->bindParam(':fecha', $datos['fecha'], PDO::PARAM_STR);
        $crear_rta->bindParam(':hora', $datos['hora'], PDO::PARAM_STR);
        $crear_rta->bindParam(':user', $user, PDO::PARAM_STR);
        $result = $crear_rta->execute();
        $ruta_empresarial2 = "public/files/estudioseguridad/respuesta_operaciones/" . $datos['nestudio'] . "/";
        $ruta_empresarial22 = "public/files/estudioseguridad/respuesta_operaciones/" . $datos['nestudio'] . "/";

        if ($result) {

            $sql = "SELECT max(id) as 'id' FROM cmx_respuesta_operacion";
            $consulta_solic_vehic = $this->_db3->prepare($sql);
            $consulta_solic_vehic->execute();
            $datos_proveedor = $consulta_solic_vehic->fetch();
            $id_respuesta = $datos_proveedor["id"];

            if (file_exists($ruta_empresarial2)) {

                if (file_exists($ruta_empresarial2) && $datos['nomarchivo'] != '') {

                    $aleatorio1 = rand(10000, 90000);
                    $nom1 = $aleatorio1 . $datos['nomarchivo'];
                    $sql2 = "UPDATE cmx_respuesta_operacion SET archivo=:ruta_empresarial22, nom_archivo=:nom1 WHERE id=:id_respuesta";
                    $consulta_act_archivo = $this->_db3->prepare($sql2);
                    $consulta_act_archivo->bindParam(':ruta_empresarial22', $ruta_empresarial22, PDO::PARAM_STR);
                    $consulta_act_archivo->bindParam(':nom1', $nom1, PDO::PARAM_STR);
                    $consulta_act_archivo->bindParam(':id_respuesta', $id_respuesta, PDO::PARAM_STR);
                    $consulta_act_archivo->execute();

                    if ($consulta_act_archivo) {
                        if (!file_exists($ruta_empresarial2)) {
                            mkdir($ruta_empresarial2, 0777, true);
                        }
                        $file = $datos['archivo'];
                        $nombre = $aleatorio1 . $file["name"];
                        $tipo = $file["type"];
                        $ruta_provisional = $file["tmp_name"];
                        $carpeta = $ruta_empresarial2;
                        $src = $carpeta . $nombre;
                        move_uploaded_file($ruta_provisional, $src);
                    }
                }
            } else {

                mkdir($ruta_empresarial2, 0777, true);

                if (file_exists($ruta_empresarial2) && $datos['nomarchivo'] != '') {

                    $aleatorio1 = rand(10000, 90000);
                    $nom1 = $aleatorio1 . $datos['nomarchivo'];
                    $sql2 = "UPDATE cmx_respuesta_operacion SET archivo=:ruta_empresarial22, nom_archivo=:nom1 WHERE id=:id_respuesta";
                    $consulta_act_archivo = $this->_db3->prepare($sql2);
                    $consulta_act_archivo->bindParam(':ruta_empresarial22', $ruta_empresarial22, PDO::PARAM_STR);
                    $consulta_act_archivo->bindParam(':nom1', $nom1, PDO::PARAM_STR);
                    $consulta_act_archivo->bindParam(':id_respuesta', $id_respuesta, PDO::PARAM_STR);
                    $consulta_act_archivo->execute();

                    if ($consulta_act_archivo) {
                        if (!file_exists($ruta_empresarial2)) {
                            mkdir($ruta_empresarial2, 0777, true);
                        }
                        $file = $datos['archivo'];
                        $nombre = $aleatorio1 . $file["name"];
                        $tipo = $file["type"];
                        $ruta_provisional = $file["tmp_name"];
                        $carpeta = $ruta_empresarial2;
                        $src = $carpeta . $nombre;
                        move_uploaded_file($ruta_provisional, $src);
                    }
                }
            }

            if ($consulta_act_archivo) {
                $response = array(
                    'numero' => 200,
                    'mensaje' => 'Respuesta ingresada correctamente, se diligenciara en seguridad nuevamente <strong>' . $datos['estudio'] . '</strong>',
                );
            } else {
                $response = array(
                    'numero' => 400,
                    'mensaje' => 'Respuesta no ingresada, por favor intentarlo nuevamente <strong>' . $datos['estudio'] . '</strong>',
                );
            }
        } else {
            $response = array(
                'numero' => 400,
                'mensaje' => 'Respuesta no ingresada, por favor intentarlo nuevamente <strong>' . $datos['estudio'] . '</strong>',
            );
        }

        return $response;
    }

    public function busca_referencias($documento_conductor)
    {
        $sql2 = $this->_db3->prepare("SELECT nombre_empresa,fecha_ingreso,fecha_retiro,persona_contacto,celular,cargo,antiguedad
		FROM cmx_referencias_preestudio WHERE id_conductor=:numero AND estado=1");
        $sql2->bindParam(':numero', $documento_conductor, PDO::PARAM_STR);
        $sql2->execute();
        $resultado = $sql2->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Validar_Propietarios($documento)
    {
        $sql = $this->_db3->prepare("SELECT pro.numero_documento,pro.nombre, pro.nombre,pro.apellido1,pro.apellido2 ,ap.actividad
        FROM cmx_proveedores pro
        INNER JOIN cmx_actividad_proveedor ap ON pro.numdoc_nexos=ap.id_proveedor AND ap.actividad='Propietario Vehiculo'
        WHERE numero_documento=:Documento");
        $sql->bindParam(':Documento', $documento, PDO::PARAM_STR);
        $sql->execute();
        $resultado = $sql->fetch(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Validar_Poseedor($documento)
    {
        $sql = $this->_db3->prepare("SELECT pro.numero_documento,pro.nombre, pro.nombre,pro.apellido1,pro.apellido2,ap.actividad
        FROM cmx_proveedores pro
        INNER JOIN cmx_actividad_proveedor ap ON pro.numdoc_nexos=ap.id_proveedor AND ap.actividad='Poseedor Vehiculo'
        WHERE numero_documento=:Documento");
        $sql->bindParam(':Documento', $documento, PDO::PARAM_STR);
        $sql->execute();
        $resultado = $sql->fetch(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Validar_Conductor($documento)
    {
        $sql = $this->_db3->prepare("SELECT pro.numero_documento,pro.nombre, pro.nombre,pro.apellido1,pro.apellido2,ap.actividad
        FROM cmx_proveedores pro
        INNER JOIN cmx_actividad_proveedor ap ON pro.numdoc_nexos=ap.id_proveedor AND ap.actividad='Conductor'
        WHERE numero_documento=:Documento");
        $sql->bindParam(':Documento', $documento, PDO::PARAM_STR);
        $sql->execute();
        $resultado = $sql->fetch(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Validar_Trailer($placa_trailer)
    {
        $sql = $this->_db3->prepare("SELECT v.placa AS placa_vehiculo,CONCAT(pr.nombre,' ',pr.apellido1,' ',pr.apellido2) AS Nombre_propietario,pr.numero_documento FROM cmx_trailer t
        LEFT JOIN cmx_trailer_vehiculo vt ON t.numdoc_trailer=vt.id_trailer
        LEFT JOIN cmx_vehiculos v ON vt.id_vehiculo=v.numdoc_vehiculo AND vt.estado=1
        INNER JOIN cmx_proveedores pr ON t.doc_propietario=pr.numdoc_nexos
        WHERE t.placa=:Placa");
        $sql->bindParam(':Placa', $placa_trailer, PDO::PARAM_STR);
        $sql->execute();
        $resultado = $sql->fetch(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Validar_vigencia_Solicitud($solicitud_servicio)
    {
        $sql_vigencia = $this->_db3->prepare("SELECT pe.fecha_estimada_entrega AS fecha_cargue,pe.hora_estimada AS hora_cargue FROM cmx_solicitud_vehiculo2 s
        INNER JOIN cmx_agencias a ON s.agencia=a.id
        INNER JOIN cmx_ruta_puntosentrega pe ON s.nundoc_solicitud=pe.cod_ini_ruta
        WHERE s.nundoc_solicitud=:solicitud");
        $sql_vigencia->bindParam(':solicitud', $solicitud_servicio, PDO::PARAM_STR);
        $sql_vigencia->execute();
        $resultado = $sql_vigencia->fetch(PDO::FETCH_ASSOC);
        return $resultado;
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
}
