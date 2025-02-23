<?php
session_start();
class planrutaModel extends Model
{
    public function __construct()
    {
        parent::__construct();
    }

    public function Consultar_Puntos()
    {
        $sql = $this->_db3->prepare("SELECT rut.cod_ciudad_origen, mun.municipio, mun.depto FROM cmx_rutas rut
        INNER JOIN cmx_municipios mun  ON rut.cod_ciudad_origen=mun.id
        WHERE rut.estado='habilitado' GROUP BY rut.cod_ciudad_origen ORDER BY mun.municipio ASC");
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Consultar_Puntos_Destino($origen)
    {
        $sql = $this->_db3->prepare("SELECT rut.cod_ciudad_destino, mun.municipio, mun.depto
        FROM cmx_rutas rut
        INNER JOIN cmx_municipios mun ON rut.cod_ciudad_destino=mun.id
        WHERE rut.estado='habilitado' AND cod_ciudad_origen=:Origen ORDER BY mun.municipio ASC");
        $sql->bindParam(':Origen', $origen, PDO::PARAM_STR);
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Filtro_Planes($origen_ruta, $destino_ruta)
    {
        $sql = $this->_db3->prepare("SELECT ru.id AS idruta, ru.*,pl.*, CONCAT(c1.municipio,'-',c1.depto) AS o,CONCAT(c2.municipio,'-',c2.depto) AS d
        FROM cmx_rutas AS ru
        INNER JOIN cmx_plan_ruta AS pl ON ru.id=pl.cod_ruta
        INNER JOIN cmx_municipios AS c1 ON ru.cod_ciudad_origen=c1.id
        INNER JOIN cmx_municipios AS c2 ON ru.cod_ciudad_destino=c2.id
        WHERE ru.cod_ciudad_origen=:origen_ruta AND ru.cod_ciudad_destino=:destino_ruta");
        $sql->bindParam(':origen_ruta', $origen_ruta, PDO::PARAM_STR);
        $sql->bindParam(':destino_ruta', $destino_ruta, PDO::PARAM_STR);
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Ver_puntos_ruta($plan_id)
    {
        $sql = $this->_db3->prepare("SELECT r.*, mun.municipio, mun.depto,ps.posicion
        FROM cmx_planruta_detalle r
        INNER JOIN cmx_municipios mun ON r.cod_ciudad=mun.id
        INNER JOIN cmx_posiciones_puntos ps ON ps.cod_punto=r.cod_punto
        WHERE r.cod_plan=:plan_id AND r.tipo_punto='punto geografico' ORDER BY ps.posicion ASC");
        $sql->bindParam(':plan_id', $plan_id, PDO::PARAM_STR);
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Crear_Plan_Ruta($datos)
    {
        $user = $_SESSION["usuario"]["nom_usuario"];
        $estado = "Activo";

        try {
            $this->_db3->beginTransaction();

            /*-------Insertar Cabecera--------*/
            $sql = "INSERT INTO cmx_plan_ruta (id,cod_plan,nombre_plan,cod_ruta,estado, observacion,fecha,hora,usuario)
            VALUES(null,:cod_plan,:name_plan,:id_ruta,:estado,:detallep,:fplan,:hplan,:uplan)";
            $crearplan = $this->_db3->prepare($sql);
            $crearplan->bindParam(':cod_plan', $datos['cod_plan'], PDO::PARAM_STR);
            $crearplan->bindParam(':name_plan', $datos['name_plan'], PDO::PARAM_STR);
            $crearplan->bindParam(':id_ruta', $datos['ruta_id'], PDO::PARAM_STR);
            $crearplan->bindParam(':estado', $estado, PDO::PARAM_STR);
            $crearplan->bindParam(':detallep', $datos['detallep'], PDO::PARAM_STR);
            $crearplan->bindParam(':fplan', $datos['fplan'], PDO::PARAM_STR);
            $crearplan->bindParam(':hplan', $datos['hplan'], PDO::PARAM_STR);
            $crearplan->bindParam(':uplan', $datos['uplan'], PDO::PARAM_STR);
            $result = $crearplan->execute();

            /*----------------------------------*/
            $notas = json_decode($datos['notas']);
            if ($result) {
                $estado_detalle = "habilitado";
                $estado_posicion = 1;
                for ($i = 0; $i < count($notas->punto); $i++) {
                    $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='PUNTO_RUTA' AND numero_actual>numero_inicial");
                    $resultado_consecutivo = $sql_consecutivo->execute();
                    $resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
                    $numdoc_agru = $resultado_consecutivo['numero_actual'];
                    $numero_punto_ruta = $resultado_consecutivo['numero_actual'] + 1;
                    if ($numdoc_agru) {
                        $sql_updata_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numero_punto_ruta WHERE tipo='PUNTO_RUTA'");
                        $resultado_consecutivo_update = $sql_updata_maestro->execute();
                        if ($resultado_consecutivo_update) {
                            $sql3 = "INSERT INTO cmx_planruta_detalle (id,cod_plan,cod_ciudad,cod_punto,nombre_punto,descripcion_punto,tiempo_estimacion,estado,fecha,hora,usuario,orden,tipo_punto,latitud,longitud,km_estimacion)
                            VALUES(null,:cod_plan,:ciudad,:cod_punto,:name_punto,:descri,:tiempo,:estado,:fecha,:hora,:user,:orden,:tipo_punto,:latitud,:longitud,:kilometros)";
                            $crearplan = $this->_db3->prepare($sql3);
                            $crearplan->bindParam(':cod_plan', $datos['cod_plan'], PDO::PARAM_STR);
                            $crearplan->bindParam(':ciudad', $notas->city[$i], PDO::PARAM_STR);
                            $crearplan->bindParam(':cod_punto', $numdoc_agru, PDO::PARAM_STR);
                            $crearplan->bindParam(':name_punto', $notas->punto[$i], PDO::PARAM_STR);
                            $crearplan->bindParam(':descri', $notas->descri[$i], PDO::PARAM_STR);
                            $crearplan->bindParam(':tiempo', $notas->tiempo[$i], PDO::PARAM_STR);
                            $crearplan->bindParam(':estado', $nestado_detalle, PDO::PARAM_STR);
                            $crearplan->bindParam(':fecha', $datos['fecha'], PDO::PARAM_STR);
                            $crearplan->bindParam(':hora', $datos['hora'], PDO::PARAM_STR);
                            $crearplan->bindParam(':user', $user, PDO::PARAM_STR);
                            $crearplan->bindParam(':orden', $notas->orden[$i], PDO::PARAM_STR);
                            $crearplan->bindParam(':tipo_punto', $notas->tpunto[$i], PDO::PARAM_STR);
                            $crearplan->bindParam(':latitud', $notas->latitud[$i], PDO::PARAM_STR);
                            $crearplan->bindParam(':longitud', $notas->longitud[$i], PDO::PARAM_STR);
                            $crearplan->bindParam(':kilometros', $notas->kilometro[$i], PDO::PARAM_STR);
                            $resultados = $crearplan->execute();
                            if ($resultados) {
                                $sql_posiciones = "INSERT INTO cmx_posiciones_puntos (cod_punto,posicion,estado_posicion,fecha_create,fecha_update) VALUES(:cod_punto,:posicion,:estado_posicion,:fecha_create,:fecha_update)";
                                $sql_posicion = $this->_db3->prepare($sql_posiciones);
                                $sql_posicion->bindParam(':cod_punto', $numdoc_agru, PDO::PARAM_STR);
                                $sql_posicion->bindParam(':posicion', $notas->orden[$i], PDO::PARAM_STR);
                                $sql_posicion->bindParam(':estado_posicion', $estado_posicion, PDO::PARAM_STR);
                                $sql_posicion->bindParam(':fecha_create', $datos['fecha'], PDO::PARAM_STR);
                                $sql_posicion->bindParam(':fecha_update', $datos['fecha'], PDO::PARAM_STR);
                                $resultado_pisicion = $sql_posicion->execute();
                            }
                        } else {
                            $mensajeError = 'Error al actualizar consecutivos';
                            error_log($mensajeError, 3, "error_log.txt");
                        }
                    } else {
                        $mensajeError = 'Error consultar consecutivo';
                        error_log($mensajeError, 3, "error_log.txt");
                    }
                }

                $sql_consecutivo_destino = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='PUNTO_RUTA' AND numero_actual>numero_inicial");
                $resultado_consecutivo_destino = $sql_consecutivo_destino->execute();
                $resultado_consecutivo_destino = $sql_consecutivo_destino->fetch(PDO::FETCH_ASSOC);
                $numdoc_agru_destino = $resultado_consecutivo_destino['numero_actual'];
                $numero_punto_ruta_destino = $resultado_consecutivo_destino['numero_actual'] + 1;
                if ($numdoc_agru_destino) {
                    $sql_updata_maestro_destino = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numero_punto_ruta_destino WHERE tipo='PUNTO_RUTA'");
                    $resultado_consecutivo_update_destino = $sql_updata_maestro_destino->execute();
                    if ($resultado_consecutivo_update_destino) {
                        $sql4 = "INSERT INTO cmx_planruta_detalle (id,cod_plan,cod_ciudad,cod_punto,nombre_punto,descripcion_punto,tiempo_estimacion,estado,fecha,hora,usuario,orden,tipo_punto,latitud,longitud,km_estimacion)
                        VALUES(null,:cod_plan,:ciudad,:cod_punto,:name_punto,:descri,:tiempo,:estado,:fecha,:hora,:user,:orden,:tipo_punto,:latitud,:longitud,:kilometros)";
                        $sqlcrear_plan = $this->_db3->prepare($sql4);
                        $sqlcrear_plan->bindParam(':cod_plan', $datos['cod_plan'], PDO::PARAM_STR);
                        $sqlcrear_plan->bindParam(':ciudad', $datos['ubicacion'], PDO::PARAM_STR);
                        $sqlcrear_plan->bindParam(':cod_punto', $numdoc_agru_destino, PDO::PARAM_STR);
                        $sqlcrear_plan->bindParam(':name_punto', $datos['puntofinal'], PDO::PARAM_STR);
                        $sqlcrear_plan->bindParam(':descri', $datos['descripfinal'], PDO::PARAM_STR);
                        $sqlcrear_plan->bindParam(':tiempo', $datos['tiempofinal'], PDO::PARAM_STR);
                        $sqlcrear_plan->bindParam(':estado', $nestado_detalle, PDO::PARAM_STR);
                        $sqlcrear_plan->bindParam(':fecha', $datos['fecha'], PDO::PARAM_STR);
                        $sqlcrear_plan->bindParam(':hora', $datos['hora'], PDO::PARAM_STR);
                        $sqlcrear_plan->bindParam(':user', $user, PDO::PARAM_STR);
                        $sqlcrear_plan->bindParam(':orden', $datos['ordenfinal'], PDO::PARAM_STR);
                        $sqlcrear_plan->bindParam(':tipo_punto', $datos['tpfinal'], PDO::PARAM_STR);
                        $sqlcrear_plan->bindParam(':latitud', $datos['latitudfinal'], PDO::PARAM_STR);
                        $sqlcrear_plan->bindParam(':longitud', $datos['longifinal'], PDO::PARAM_STR);
                        $sqlcrear_plan->bindParam(':kilometros', $datos['kmfinal'], PDO::PARAM_STR);
                        $result = $sqlcrear_plan->execute();
                        if ($result) {
                            $this->_db3->commit();
                            $response = 'Plan de ruta resgistrado con exito con el numero: ' . $datos['cod_plan'] . '';
                        } else {
                            $this->_db3->commit();
                            $response = 'No se registro el plan de ruta en el sistema.';
                        }
                        return $response;
                    } else {
                        # code...
                    }
                } else {
                }
            } else {
                $mensajeError = 'Error al insertar la cabecera';
                error_log($mensajeError, 3, "error_log.txt");
            }
        } catch (\Throwable $th) {
            // Si ocurre algún error, deshacemos la transacción
            $this->_db3->rollBack();
            echo "Error en la transacción: " . $th->getMessage();
        }
    }

    public function Consutar_puntos_ruta($plan)
    {
        $sql = $this->_db3->prepare("SELECT *, p.nombre_plan ,p.observacion,p.estado as pes, mun.municipio, mun.depto
			FROM cmx_planruta_detalle r
			INNER JOIN cmx_municipios mun ON r.cod_ciudad=mun.id
			INNER JOIN cmx_plan_ruta p ON r.cod_plan=p.cod_plan
            INNER JOIN cmx_posiciones_puntos ps ON ps.cod_punto=r.cod_punto
			WHERE r.cod_plan=" . $plan . " ORDER BY ps.posicion ASC");
        $sql->execute();
        $resultado_puntos = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado_puntos;
    }

    public function Consultar_base($plan_id)
    {
        $sql_base = $this->_db3->prepare("SELECT id, municipio, depto FROM cmx_municipios WHERE pais='COLOMBIA'");
        $sql_base->execute();
        $resultado_base = $sql_base->fetchAll(PDO::FETCH_ASSOC);

        $sql_ultima_posicion = $this->_db3->prepare("SELECT posicion FROM cmx_plan_ruta pr
        INNER JOIN cmx_planruta_detalle prd ON prd.cod_plan=pr.cod_plan
        INNER JOIN cmx_posiciones_puntos psp ON psp.cod_punto=prd.cod_punto
        WHERE pr.cod_plan=:plan_id ORDER BY posicion DESC LIMIT 1");
        $sql_ultima_posicion->bindParam(':plan_id', $plan_id, PDO::PARAM_STR);
        $sql_ultima_posicion->execute();
        $resultado_posicion = $sql_ultima_posicion->fetch(PDO::FETCH_ASSOC);
        $numero = $resultado_posicion['posicion'] + 1;
        $response = array(
            "resultado_base" => $resultado_base,
            "numero" => $numero,
        );
        return $response;
    }

    public function Consultar_base_crear()
    {
        $sql = $this->_db3->prepare("SELECT id, municipio, depto FROM cmx_municipios WHERE pais='COLOMBIA' ORDER BY municipio ASC");
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Agregar_Punto($puntos)
    {
        $user = $_SESSION["usuario"]["nom_usuario"];
        $estado_detalle = "habilitado";
        $fecha = date('Y-m-d');
        $hora = date('H:i:s');

        for ($i = 0; $i < count($puntos->orden); $i++) {

            // Validar existencia del punto
            $sqlvalidar = $this->_db3->prepare("SELECT cod_plan,nombre_punto FROM cmx_planruta_detalle WHERE cod_plan=:cod_plan AND nombre_punto=:nombre_punto");
            $sqlvalidar->bindParam(':cod_plan', $puntos->id_plan[$i], PDO::PARAM_STR);
            $sqlvalidar->bindParam(':nombre_punto', $puntos->nombrepunto[$i], PDO::PARAM_STR);
            $sqlvalidar->execute();
            $resultado_existe = $sqlvalidar->fetch(PDO::FETCH_ASSOC);
            if ($resultado_existe['cod_plan'] == $puntos->id_plan[$i] && $resultado_existe['nombre_punto'] == $puntos->nombrepunto[$i]) {
                // $response = 'Uno o varios puntos ya estan registrados en el plan de ruta';
                $response = array(
                    'numero' => 405, 'mensaje' => 'Uno o varios puntos ya estan registrados en el plan de ruta.',
                );
            } else {
                $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='PUNTO_RUTA' AND numero_actual>numero_inicial");
                $resultado_consecutivo = $sql_consecutivo->execute();
                $resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
                $numdoc_agru = $resultado_consecutivo['numero_actual'];
                $numero_punto_ruta = $resultado_consecutivo['numero_actual'] + 1;
                if ($numdoc_agru) {
                    $sql_updata_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numero_punto_ruta WHERE tipo='PUNTO_RUTA'");
                    $resultado_consecutivo_update = $sql_updata_maestro->execute();
                    if ($resultado_consecutivo_update) {
                        $sql = "INSERT INTO cmx_planruta_detalle (id,cod_plan,cod_ciudad,cod_punto,nombre_punto,descripcion_punto,tiempo_estimacion,estado,fecha,hora,usuario,orden,tipo_punto,latitud,longitud,km_estimacion)
                        VALUES(null,:cod_plan,:ciudad,:cod_punto,:name_punto,:descri,:tiempo,:estado,:fecha,:hora,:user,:orden,:tipo_punto,:latitud,:longitud,:kilometros)";
                        $crearplan = $this->_db3->prepare($sql);
                        $crearplan->bindParam(':cod_plan', $puntos->id_plan[$i], PDO::PARAM_STR);
                        $crearplan->bindParam(':ciudad', $puntos->ciudad[$i], PDO::PARAM_STR);
                        $crearplan->bindParam(':cod_punto', $numdoc_agru, PDO::PARAM_STR);
                        $crearplan->bindParam(':name_punto', $puntos->nombrepunto[$i], PDO::PARAM_STR);
                        $crearplan->bindParam(':descri', $puntos->decri[$i], PDO::PARAM_STR);
                        $crearplan->bindParam(':tiempo', $puntos->tiempo[$i], PDO::PARAM_STR);
                        $crearplan->bindParam(':estado', $estado_detalle, PDO::PARAM_STR);
                        $crearplan->bindParam(':fecha', $fecha, PDO::PARAM_STR);
                        $crearplan->bindParam(':hora', $hora, PDO::PARAM_STR);
                        $crearplan->bindParam(':user', $user, PDO::PARAM_STR);
                        $crearplan->bindParam(':orden', $puntos->orden[$i], PDO::PARAM_STR);
                        $crearplan->bindParam(':tipo_punto', $puntos->tipopunto[$i], PDO::PARAM_STR);
                        $crearplan->bindParam(':latitud', $puntos->lati[$i], PDO::PARAM_STR);
                        $crearplan->bindParam(':longitud', $puntos->long[$i], PDO::PARAM_STR);
                        $crearplan->bindParam(':kilometros', $puntos->kilome[$i], PDO::PARAM_STR);
                        $resultados = $crearplan->execute();

                        if ($resultados) {
                            $sql_posiciones = "INSERT INTO cmx_posiciones_puntos (cod_punto,posicion,estado_posicion,fecha_create,fecha_update) VALUES(:cod_punto,:posicion,:estado_posicion,:fecha_create,:fecha_update)";
                            $sql_posicion = $this->_db3->prepare($sql_posiciones);
                            $sql_posicion->bindParam(':cod_punto', $numdoc_agru, PDO::PARAM_STR);
                            $sql_posicion->bindParam(':posicion', $puntos->orden[$i], PDO::PARAM_STR);
                            $sql_posicion->bindParam(':estado_posicion', $estado_posicion, PDO::PARAM_STR);
                            $sql_posicion->bindParam(':fecha_create', $fecha, PDO::PARAM_STR);
                            $sql_posicion->bindParam(':fecha_update', $fecha, PDO::PARAM_STR);
                            $resultado_pisicion = $sql_posicion->execute();
                            if ($resultado_pisicion) {
                                $response = array(
                                    'numero' => 200, 'mensaje' => 'Puntos agregados al plan de ruta exitosamente.',
                                );
                            } else {
                                $response = array(
                                    'numero' => 400, 'mensaje' => 'No se registrar los puntos al plan de ruta en el sistema.',
                                );
                            }
                        }
                    } else {
                        $mensajeError = 'Error al actualizar consecutivos';
                        error_log($mensajeError, 3, "error_log.txt");
                    }
                } else {
                    $mensajeError = 'Error consultar consecutivo';
                    error_log($mensajeError, 3, "error_log.txt");
                }
            }
        }
        if (isset($resultado_pisicion) || isset($resultado_existe)) {
            // $this->_db3->commit();
            // $response = 'Puntos agregados al plan de ruta exitosamente';
            $response;
        }
        return $response;
    }

    public function Actualizar_puntos_ruta($posiciones)
    {
        // Consulta SQL de actualización con INNER JOIN
        for ($i = 0; $i < count($posiciones->cod_puntos); $i++) {
            $numero = (int) $posiciones->posiciones[$i];
            $cod = (int) $posiciones->cod_puntos[$i];
            $tiempo = (int) $posiciones->tiempos[$i];

            $sql = $this->_db3->prepare("UPDATE cmx_posiciones_puntos SET posicion=$numero WHERE cod_punto=$cod");
            $resultados = $sql->execute();
            if ($resultados) {
                $sql_update = $this->_db3->prepare("UPDATE cmx_planruta_detalle SET tiempo_estimacion=$tiempo WHERE cod_punto=$cod");
                $resultados_tiempo = $sql_update->execute();
            } else {
                # code...
            }
        }
        if ($resultados_tiempo) {
            $response = 'Puntos actualizados en el plan de ruta exitosamente';
        } else {
            $response = 'No se registrar los puntos al plan de ruta en el sistema.';
        }
        return $response;
    }

    public function Consultar_Punto_Para($id_punto)
    {
        $sql = $this->_db3->prepare("SELECT r.id, mr.id as id_muni, mr.municipio,mr.depto, r.nom_punto,r.latitud, r.longitud, r.estado, r.descripcion_punto
        FROM  cmx_para_punto_ruta r
        INNER JOIN cmx_municipios mr ON r.cod_ciudad=mr.id
        WHERE r.id=:id_punto");
        $sql->bindParam(':id_punto', $id_punto);
        $sql->execute();
        $resultados = $sql->fetch(PDO::FETCH_ASSOC);
        return $resultados;
    }

    public function Update_Estado_plan($datos)
    {
        $sql = "UPDATE cmx_plan_ruta SET nombre_plan=:namplan,observacion=:detaplan,estado=:es_plan
        WHERE cod_plan=:id_plan";
        $updateplan = $this->_db3->prepare($sql);
        $updateplan->bindParam(':namplan', $datos["namplan"]);
        $updateplan->bindParam(':detaplan', $datos["detaplan"]);
        $updateplan->bindParam(':es_plan', $datos["es_plan"]);
        $updateplan->bindParam(':id_plan', $datos["id_plan"]);
        $resultado = $updateplan->execute();
        if ($resultado) {
            $response = array(
                'numero' => 200, 'mensaje' => '<strong>Mensaje!</strong> Detalle plande de ruta actualizado correctamente',
            );
        } else {
            $response = array(
                'numero' => 400, 'mensaje' => '<strong>Mensaje!</strong> Detalle plan de ruta no actualizado',
            );
        }
        return $response;
    }

    public function Borrar_Punto_Control($id)
    {
        $sql = $this->_db3->prepare("DELETE cmx_planruta_detalle
        FROM cmx_planruta_detalle
        INNER JOIN cmx_posiciones_puntos ON cmx_planruta_detalle.cod_punto=cmx_posiciones_puntos.cod_punto
        WHERE cmx_planruta_detalle.cod_punto=:Id");
        $sql->bindParam(':Id', $id);
        $resultado = $sql->execute();
        if ($resultado) {
            $response = array(
                'numero' => 200, 'mensaje' => '<strong>Mensaje!</strong> Punto de control eliminado Correctamente ',
            );
        } else {
            $response = array(
                'numero' => 400, 'mensaje' => '<strong>Mensaje!</strong> Error al eliminar el punto de control',
            );
        }
        return $response;
    }

    public function Listar_plan_de_ruta_seguimiento($plan_id, $condigo_inicio, $manifiesto)
    {
        $response = [];

        $sql_plan_ruta = $this->_db3->prepare("SELECT d.cod_plan, d.id, d.nombre_punto, d.descripcion_punto, d.tiempo_estimacion, d.tipo_punto, d.km_estimacion, d.latitud, d.longitud, d.cod_punto, d.orden, m.municipio, m.depto, pp.posicion, m.id AS idmunicipio, ins.novedad
        FROM cmx_plan_ruta p
        INNER JOIN cmx_rutas ru ON p.cod_ruta=ru.id
        INNER JOIN cmx_planruta_detalle d ON p.cod_plan=d.cod_plan
        INNER JOIN cmx_municipios m ON d.cod_ciudad=m.id
        INNER JOIN cmx_inicio_ruta ir ON p.cod_plan=ir.cod_plan
        INNER JOIN cmx_manifiesto mf ON ir.num_manifiesto=mf.id
        LEFT  JOIN cmx_posiciones_puntos pp ON pp.cod_punto=d.cod_punto
        LEFT JOIN cmx_inicio_seguimiento ins ON ins.codigo_punto = d.cod_punto AND ins.cod_ini_ruta=:codigo_ini
        WHERE p.cod_plan=:cod_plan AND mf.id=:manifiesto GROUP BY d.orden ORDER BY d.orden,pp.posicion ASC");
        $sql_plan_ruta->bindParam(':codigo_ini', $condigo_inicio);
        $sql_plan_ruta->bindParam(':cod_plan', $plan_id);
        $sql_plan_ruta->bindParam(':manifiesto', $manifiesto);
        $sql_plan_ruta->execute();
        $resultado_plan = $sql_plan_ruta->fetchAll(PDO::FETCH_ASSOC);

        /* Listar todas la notas */
        $sql_notas = $this->_db3->prepare("SELECT d.cod_plan, d.id, d.nombre_punto, d.descripcion_punto, d.tiempo_estimacion, d.tipo_punto, d.km_estimacion, d.latitud, d.longitud, d.cod_punto, d.orden, m.municipio, m.depto, pp.posicion, m.id AS idmunicipio, CONCAT(ins.fecha,'-',ins.hora) AS Hora_gestion, ins.usuario, ins.novedad, ins.novedad, CASE WHEN d.nombre_punto = 'Lugar Llegada' THEN MAX(mf.estado_seguimiento) ELSE NULL END AS estado_seguimiento, ins.estado_punto
            FROM cmx_plan_ruta p
            INNER JOIN cmx_rutas ru ON p.cod_ruta = ru.id
            INNER JOIN cmx_planruta_detalle d ON p.cod_plan = d.cod_plan
            INNER JOIN cmx_municipios m ON d.cod_ciudad = m.id
            INNER JOIN cmx_inicio_ruta ir ON p.cod_plan = ir.cod_plan
            LEFT JOIN cmx_manifiesto mf ON ir.num_manifiesto = mf.id
            LEFT JOIN cmx_posiciones_puntos pp ON pp.cod_punto = d.cod_punto
            LEFT JOIN cmx_inicio_seguimiento ins ON ins.codigo_punto = d.cod_punto
            WHERE p.cod_plan =:cod_plan 
            AND ins.cod_ini_ruta =:codigo_ini 
            AND mf.id = (SELECT id FROM cmx_manifiesto WHERE id=:manifiesto)
            GROUP BY d.cod_punto, ins.observacion ORDER BY d.orden, pp.posicion ASC");
        $sql_notas->bindParam(':cod_plan', $plan_id);
        $sql_notas->bindParam(':codigo_ini', $condigo_inicio);
        $sql_notas->bindParam(':manifiesto', $manifiesto);
        $sql_notas->execute();
        $resultados_notas = $sql_notas->fetchAll(PDO::FETCH_ASSOC);
        $response = [
            "plan_ruta" => $resultado_plan,
            "notas_puntos" => $resultados_notas
        ];
        return $response;
    }

    public function Buscar_Puntos($datos)
    {
        $sql = $this->_db3->prepare("SELECT r.id, mr.municipio,mr.depto,r.nom_punto,r.latitud,r.longitud,r.estado,mr.id AS idmunicipio,r.cod_ciudad FROM cmx_para_punto_ruta r
        INNER JOIN cmx_municipios mr ON r.cod_ciudad=mr.id  WHERE r.nom_punto LIKE '%' :datos '%' ORDER BY nom_punto ASC");
        $sql->bindParam(':datos', $datos, PDO::PARAM_STR);
        $sql->execute();
        $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultados;
    }
}
