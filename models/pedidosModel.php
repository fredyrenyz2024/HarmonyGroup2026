<?php
session_start();
class pedidosModel extends Model
{
    public function __construct()
    {
        parent::__construct();
    }

    public function Listar_Cliente()
    {
        if ($_SESSION["usuario"]["tipo_perfil"] === 'CLIENTES' && $_SESSION["usuario"]["nombre_perfil"] === 'Clientes') {
            $sql = $this->_db3->prepare("SELECT id, documento, nombre FROM cmx_clientes WHERE id=:Cliente ORDER BY nombre ASC");
            $sql->bindParam(':Cliente', $_SESSION["usuario"]["id_cliente"], PDO::PARAM_INT);
            $sql->execute();
            $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $sql = $this->_db3->prepare("SELECT id, documento, nombre FROM cmx_clientes ORDER BY nombre ASC");
            $sql->execute();
            $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        }
        return $resultados;
    }

    public function Listar_Tipo_trazabilidad()
    {
        $sql = $this->_db3->prepare("SELECT * FROM cmx_tipo_trazabilidad WHERE estado_tipo='ACTIVO'");
        $sql->execute();
        $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultados;
    }

    public function Listar_tipo_opcion_trazabilidad($id)
    {
        $sql = $this->_db3->prepare("SELECT * FROM cmx_tipo_opcion_trazabilidad WHERE tipo_trazabilidad=:Id");
        $sql->bindParam(':Id', $id, PDO::PARAM_STR);
        $sql->execute();
        $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultados;
    }

    public function Validar_referenia($referencia, $cliente)
    {
        $sql = $this->_db3->prepare("SELECT cliente,referencia FROM cmx_trazabilidad_proceso WHERE cliente=:Cliente AND referencia=:Referencia");
        $sql->bindParam(':Cliente', $cliente, PDO::PARAM_STR);
        $sql->bindParam(':Referencia', $referencia, PDO::PARAM_STR);
        $sql->execute();
        $resultados = $sql->fetch(PDO::FETCH_ASSOC);
        return $resultados;
    }

    public function Insertar_pedido_trazabilidad($datos)
    {
        $response = [];
        $user = $_SESSION["usuario"]["nom_usuario"];
        $fecha = date("Y-m-d");
        $hora = date("H:i:s");

        $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='PED_PRO' AND numero_actual>numero_inicial");
        $resultado_consecutivo = $sql_consecutivo->execute();
        $resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
        $numdoc = $resultado_consecutivo['numero_actual'];
        $numdoc_actualizar = $resultado_consecutivo['numero_actual'] + 1;

        #Numdoc para la plantila y poder identificarlos
        $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='PED_PLANTILLA' AND numero_actual>numero_inicial");
        $resultado_consecutivo_plantilla = $sql_consecutivo->execute();
        $resultado_consecutivo_plantilla = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
        $numdoc_plantilla = $resultado_consecutivo_plantilla['numero_actual'];
        $numdoc_actualizar_plantilla = $resultado_consecutivo_plantilla['numero_actual'] + 1;

        try {
            $this->_db3->beginTransaction();

            #GUARDAR CUANDO SEA CREAR EL PEDIDO Y LA PLANTILLA
            if ($datos["tipo"] == "Nueva" && $datos["configurar_plantilla"] == "guardar_como_plantilla") {
                if ($numdoc != 0 && $numdoc_plantilla != 0) {
                    // Actualizar Maestro de pedidos y procesos
                    $sql_updata_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numdoc_actualizar WHERE tipo='PED_PRO'");
                    $resultado_consecutivo_update = $sql_updata_maestro->execute();

                    if ($resultado_consecutivo_update) {
                        $estado = 'ACTIVO';
                        $sql = $this->_db3->prepare("INSERT INTO cmx_trazabilidad_proceso(numdoc,cliente,referencia,observacion,fecha_creacion,hora_creacion,usuario,estado) VALUES(:numdoc,:cliente,:referencia,:observacion,:fecha_creacion,:hora_creacion,:usuario,:estado)");
                        $sql->bindParam(':numdoc', $numdoc, PDO::PARAM_STR);
                        $sql->bindParam(':cliente', $datos["cliente"], PDO::PARAM_STR);
                        $sql->bindParam(':referencia', $datos["referencia"], PDO::PARAM_STR);
                        $sql->bindParam(':observacion', $datos["observacion"], PDO::PARAM_STR);
                        $sql->bindParam(':usuario', $user, PDO::PARAM_STR);
                        $sql->bindParam(':fecha_creacion', $fecha, PDO::PARAM_STR);
                        $sql->bindParam(':hora_creacion', $hora, PDO::PARAM_STR);
                        $sql->bindParam(':estado', $estado, PDO::PARAM_STR);
                        $resultados = $sql->execute();

                        if ($resultados) {
                            $proceso = $datos["procesos"];
                            $detalle_proceso = $datos["procesos_detalle"];
                            $posiciones_detalle = $datos["posiciones_detalle"];
                            $usuarios_responsable = $datos["usuarios_responsable"];

                            for ($i = 0; $i < count($proceso->tipo); $i++) {
                                $sql_detalle1 = $this->_db3->prepare("INSERT INTO cmx_tipo_detalle_trazabilidad(numdoc_detalle_trazabilidad,tipo_procesos_id,fecha_creacion)VALUES(:numdoc_detalle_trazabilidad,:tipo_procesos_id,:fecha_creacion)");
                                $sql_detalle1->bindParam(':numdoc_detalle_trazabilidad', $numdoc, PDO::PARAM_STR);
                                // $sql_detalle1->bindParam(':pedido_trazabilidad_id', $proceso_id, PDO::PARAM_STR);
                                $sql_detalle1->bindParam(':tipo_procesos_id', $proceso->tipo[$i], PDO::PARAM_STR);
                                $sql_detalle1->bindParam(':fecha_creacion', $fecha, PDO::PARAM_STR);
                                $resultados_detalle = $sql_detalle1->execute();
                            }
                            if ($resultados_detalle) {
                                $tiempo = 0;
                                for ($i = 0; $i < count($usuarios_responsable->usuario); $i++) {
                                    $detal = explode("/", $usuarios_responsable->posicion[$i]);
                                    $sql_detalle2 = $this->_db3->prepare("INSERT INTO cmx_detalle_opcion_trazabilidad(numdoc_detalle_opcion,detalle_proceso,posicion,usuario,fecha_creacion,hora,usuario_responsable,fecha_inicio,hora_inicio,tiempo_transcurrido,costo_promedio)
                                    VALUES(:numdoc_detalle_opcion,:detalle_proceso,:posicion,:usuario,:fecha_creacion,:hora,:usuario_responsable,:fecha_inicio,:hora_inicio,:tiempo_transcurrido,:costo_promedio)");
                                    $sql_detalle2->bindParam(':numdoc_detalle_opcion', $numdoc, PDO::PARAM_STR);
                                    $sql_detalle2->bindParam(':detalle_proceso', $detal[1], PDO::PARAM_STR);
                                    $sql_detalle2->bindParam(':posicion', $detal[0], PDO::PARAM_STR);
                                    $sql_detalle2->bindParam(':usuario', $user, PDO::PARAM_STR);
                                    $sql_detalle2->bindParam(':fecha_creacion', $fecha, PDO::PARAM_STR);
                                    $sql_detalle2->bindParam(':hora', $hora, PDO::PARAM_STR);
                                    // $sql_detalle2->bindParam(':usuario_responsable', $usuarios_responsable->usuario[$i], PDO::PARAM_STR);
                                    $sql_detalle2->bindParam(':usuario_responsable', $detal[2], PDO::PARAM_STR);
                                    $sql_detalle2->bindParam(':fecha_inicio', $usuarios_responsable->fecha[$i], PDO::PARAM_STR);
                                    $sql_detalle2->bindParam(':hora_inicio', $usuarios_responsable->hora[$i], PDO::PARAM_STR);
                                    $sql_detalle2->bindParam(':tiempo_transcurrido', $tiempo, PDO::PARAM_STR);
                                    $sql_detalle2->bindParam(':costo_promedio', $usuarios_responsable->costo[$i], PDO::PARAM_STR);
                                    $resultados_detalles = $sql_detalle2->execute();
                                }

                                if ($resultados_detalles) {
                                    //Acualizar maestro de plantillas
                                    $sql_updata_maestro_plantilla = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numdoc_actualizar_plantilla WHERE tipo='PED_PLANTILLA'");
                                    $resultado_consecutivo_update_plantilla = $sql_updata_maestro_plantilla->execute();
                                    if ($resultado_consecutivo_update_plantilla) {
                                        #CREAR PLANTILLA PARA MAS USOS DE FORMA RAPIDA
                                        $estado = "ACTIVA";
                                        $sql_insert_plantilla = $this->_db3->prepare("INSERT INTO cmx_plantilla(numdoc,nombre_plantilla,usuario,fecha,hora,estado_plantilla) VALUES(:numdoc,:nombre_plantilla,:usuario,:fecha,:hora,:estado_plantilla)");
                                        $sql_insert_plantilla->bindParam(':numdoc', $numdoc_plantilla, PDO::PARAM_STR);
                                        $sql_insert_plantilla->bindParam(':nombre_plantilla', $datos['nombre_plantilla'], PDO::PARAM_STR);
                                        $sql_insert_plantilla->bindParam(':usuario', $user, PDO::PARAM_STR);
                                        $sql_insert_plantilla->bindParam(':fecha', $fecha, PDO::PARAM_STR);
                                        $sql_insert_plantilla->bindParam(':hora', $hora, PDO::PARAM_STR);
                                        $sql_insert_plantilla->bindParam(':estado_plantilla', $estado, PDO::PARAM_STR);
                                        $resultados_insert_plantilla = $sql_insert_plantilla->execute();
                                        if ($resultados_insert_plantilla) {
                                            $proceso = $datos["procesos"];
                                            $estado_seleccion = "checked";
                                            for ($i = 0; $i < count($proceso->tipo); $i++) {
                                                $sql_insert_detalle_plantilla = $this->_db3->prepare("INSERT INTO cmx_detalle_plantilla_parametros(numdoc_plantilla,tipo_proceso_id,estado_seleccion,fecha_creacion,usuario)VALUES(:numdoc_plantilla,:tipo_proceso_id,:estado_seleccion,:fecha_creacion,:usuario)");
                                                $sql_insert_detalle_plantilla->bindParam(':numdoc_plantilla', $numdoc_plantilla, PDO::PARAM_STR);
                                                $sql_insert_detalle_plantilla->bindParam(':tipo_proceso_id', $proceso->tipo[$i], PDO::PARAM_STR);
                                                $sql_insert_detalle_plantilla->bindParam(':estado_seleccion', $estado_seleccion, PDO::PARAM_STR);
                                                $sql_insert_detalle_plantilla->bindParam(':fecha_creacion', $fecha, PDO::PARAM_STR);
                                                $sql_insert_detalle_plantilla->bindParam(':usuario', $user, PDO::PARAM_STR);
                                                $resultados_insert_detalle_plantilla = $sql_insert_detalle_plantilla->execute();
                                            }
                                            if ($resultados_insert_detalle_plantilla) {
                                                $estado_seleccion = "checked";
                                                $posiciones_detalle = $datos["posiciones_detalle"];
                                                for ($i = 0; $i < count($usuarios_responsable->usuario); $i++) {
                                                    $detal = explode("/", $usuarios_responsable->posicion[$i]);
                                                    $sql_insert_plantilla_actividad = $this->_db3->prepare("INSERT INTO cmx_plantilla_actividad(numdoc_detalle_plantilla,detalle_actividad_plantilla,posicion,estado_seleccion,usuario,fecha_creacion,hora)
                                                    VALUES(:numdoc_detalle_plantilla,:detalle_actividad_plantilla,:posicion,:estado_seleccion,:usuario,:fecha_creacion,:hora)");
                                                    $sql_insert_plantilla_actividad->bindParam(':numdoc_detalle_plantilla', $numdoc_plantilla, PDO::PARAM_STR);
                                                    $sql_insert_plantilla_actividad->bindParam(':detalle_actividad_plantilla', $detal[1], PDO::PARAM_STR);
                                                    $sql_insert_plantilla_actividad->bindParam(':posicion', $detal[0], PDO::PARAM_STR);
                                                    $sql_insert_plantilla_actividad->bindParam(':estado_seleccion', $estado_seleccion, PDO::PARAM_STR);
                                                    $sql_insert_plantilla_actividad->bindParam(':usuario', $user, PDO::PARAM_STR);
                                                    $sql_insert_plantilla_actividad->bindParam(':fecha_creacion', $fecha, PDO::PARAM_STR);
                                                    $sql_insert_plantilla_actividad->bindParam(':hora', $hora, PDO::PARAM_STR);
                                                    $resultados_insert_actividad_plantilla = $sql_insert_plantilla_actividad->execute();
                                                }
                                                if ($resultados_insert_actividad_plantilla) {
                                                    $this->_db3->commit();
                                                    $response = [
                                                        'numero' => 200,
                                                        'mensaje' => '<strong>Mensaje!</strong> Pedido generado exitosamente.',
                                                    ];
                                                } else {
                                                    $this->_db3->commit();
                                                    $response = [
                                                        'numero' => 400,
                                                        'mensaje' => '<strong>Mensaje!</strong> Error al generar el pedido.',
                                                    ];
                                                }
                                            } else {
                                                $mensajeError = "Error al insertar detalle 1 de plantilla";
                                                error_log($mensajeError . "\n", 3, "error_log.txt");
                                            }
                                        } else {
                                            $mensajeError = "Error al insertar cabecerra de plantilla";
                                            error_log($mensajeError . "\n", 3, "error_log.txt");
                                        }
                                    } else {
                                        $mensajeError = "No actualizo consecutivo maestro plantilla";
                                        error_log($mensajeError . "\n", 3, "error_log.txt");
                                    }
                                } else {
                                    $this->_db3->commit();
                                    $response = [
                                        'numero' => 400,
                                        'mensaje' => '<strong>Mensaje!</strong> Pedido no generado.',
                                    ];
                                }
                            } else {
                                $response = ['numero' => 400, 'mensaje' => 'Error de operación proceso no insertado'];
                                $mensajeError = "Error de operación proceso no insertado";
                                error_log($mensajeError . "\n", 3, "error_log.txt");
                            }
                        } else {
                            $response = ['numero' => 400, 'mensaje' => 'Error de operación proceso no insertado'];
                        }
                    } else {
                        $mensajeError = "No actualizo consecutivo maestro";
                        error_log($mensajeError . "\n", 3, "error_log.txt");
                    }
                } else {
                    $mensajeError = "No resultado de consecuivo";
                    error_log($mensajeError . "\n", 3, "error_log.txt");
                }
                #GUARDAR CUANDO SOLO SEA UN PEDIDO
            } elseif ($datos["tipo"] == "Nueva" && $datos["configurar_plantilla"] == "No") {
                if ($numdoc != 0) {
                    // Actualizar Maestro de pedidos y procesos
                    $sql_updata_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numdoc_actualizar WHERE tipo='PED_PRO'");
                    $resultado_consecutivo_update = $sql_updata_maestro->execute();
                    if ($resultado_consecutivo_update) {
                        $estado = 'ACTIVO';
                        $sql = $this->_db3->prepare("INSERT INTO cmx_trazabilidad_proceso(numdoc,cliente,referencia,observacion,fecha_creacion,hora_creacion,usuario,estado) 
                        VALUES(:numdoc,:cliente,:referencia,:observacion,:fecha_creacion,:hora_creacion,:usuario,:estado)");
                        $sql->bindParam(':numdoc', $numdoc, PDO::PARAM_STR);
                        $sql->bindParam(':cliente', $datos["cliente"], PDO::PARAM_STR);
                        $sql->bindParam(':referencia', $datos["referencia"], PDO::PARAM_STR);
                        $sql->bindParam(':observacion', $datos["observacion"], PDO::PARAM_STR);
                        $sql->bindParam(':usuario', $user, PDO::PARAM_STR);
                        $sql->bindParam(':fecha_creacion', $fecha, PDO::PARAM_STR);
                        $sql->bindParam(':hora_creacion', $hora, PDO::PARAM_STR);
                        $sql->bindParam(':estado', $estado, PDO::PARAM_STR);
                        $resultados = $sql->execute();
                        if ($resultados) {
                            $proceso = $datos["procesos"];
                            $detalle_proceso = $datos["procesos_detalle"];
                            $posiciones_detalle = $datos["posiciones_detalle"];
                            $usuarios_responsable = $datos["usuarios_responsable"];

                            for ($i = 0; $i < count($proceso->tipo); $i++) {
                                $sql_detalle1 = $this->_db3->prepare("INSERT INTO cmx_tipo_detalle_trazabilidad(numdoc_detalle_trazabilidad,tipo_procesos_id,fecha_creacion) 
                                VALUES(:numdoc_detalle_trazabilidad,:tipo_procesos_id,:fecha_creacion)");
                                $sql_detalle1->bindParam(':numdoc_detalle_trazabilidad', $numdoc, PDO::PARAM_STR);
                                // $sql_detalle1->bindParam(':pedido_trazabilidad_id', $proceso_id, PDO::PARAM_STR);
                                $sql_detalle1->bindParam(':tipo_procesos_id', $proceso->tipo[$i], PDO::PARAM_STR);
                                $sql_detalle1->bindParam(':fecha_creacion', $fecha, PDO::PARAM_STR);
                                $resultados_detalle = $sql_detalle1->execute();
                            }

                            if ($resultados_detalle) {
                                $tiempo = 0;
                                for ($i = 0; $i < count($usuarios_responsable->usuario); $i++) {
                                    $detal = explode("/", $usuarios_responsable->posicion[$i]);
                                    $sql_detalle2 = $this->_db3->prepare("INSERT INTO cmx_detalle_opcion_trazabilidad(numdoc_detalle_opcion,detalle_proceso,posicion,usuario,fecha_creacion,hora,usuario_responsable,fecha_inicio,hora_inicio,tiempo_transcurrido,costo_promedio)
                                    VALUES(:numdoc_detalle_opcion,:detalle_proceso,:posicion,:usuario,:fecha_creacion,:hora,:usuario_responsable,:fecha_inicio,:hora_inicio,:tiempo_transcurrido,:costo_promedio)");
                                    $sql_detalle2->bindParam(':numdoc_detalle_opcion', $numdoc, PDO::PARAM_STR);
                                    $sql_detalle2->bindParam(':detalle_proceso', $detal[1], PDO::PARAM_STR);
                                    $sql_detalle2->bindParam(':posicion', $detal[0], PDO::PARAM_STR);
                                    $sql_detalle2->bindParam(':usuario', $user, PDO::PARAM_STR);
                                    $sql_detalle2->bindParam(':fecha_creacion', $fecha, PDO::PARAM_STR);
                                    $sql_detalle2->bindParam(':hora', $hora, PDO::PARAM_STR);
                                    $sql_detalle2->bindParam(':usuario_responsable', $detal[2], PDO::PARAM_STR);
                                    $sql_detalle2->bindParam(':fecha_inicio', $usuarios_responsable->fecha[$i], PDO::PARAM_STR);
                                    $sql_detalle2->bindParam(':hora_inicio', $usuarios_responsable->hora[$i], PDO::PARAM_STR);
                                    $sql_detalle2->bindParam(':tiempo_transcurrido', $tiempo, PDO::PARAM_STR);
                                    $sql_detalle2->bindParam(':costo_promedio', $usuarios_responsable->costo[$i], PDO::PARAM_STR);
                                    $resultados_detalles = $sql_detalle2->execute();
                                }

                                if ($resultados_detalles) {
                                    $this->_db3->commit();
                                    $response = [
                                        'numero' => 200,
                                        'mensaje' => '<strong>Mensaje!</strong> Pedido generado exitosamente.',
                                    ];
                                } else {
                                    $this->_db3->commit();
                                    $response = [
                                        'numero' => 400,
                                        'mensaje' => '<strong>Mensaje!</strong> Pedido no generado.',
                                    ];
                                }
                            } else {
                                $response = ['numero' => 400, 'mensaje' => 'Error de operación proceso no insertado'];
                                $mensajeError = "Error de operación proceso no insertado";
                                error_log($mensajeError . "\n", 3, "error_log.txt");
                            }
                        } else {
                            $response = ['Numero' => 400, 'Mensaje' => 'Error de operación proceso no insertado'];
                        }
                    } else {
                        $mensajeError = "No actualizo consecutivo maestro";
                        error_log($mensajeError . "\n", 3, "error_log.txt");
                    }
                } else {
                    $mensajeError = "No resultado de consecuivo";
                    error_log($mensajeError . "\n", 3, "error_log.txt");
                }
            } else {
                # GUSRDAR CUANDO SOLO VENGA DE TIPO TEMPLATE
                if ($numdoc != 0) {
                    // Actualizar Maestro de pedidos y procesos
                    $sql_updata_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numdoc_actualizar WHERE tipo='PED_PRO'");
                    $resultado_consecutivo_update = $sql_updata_maestro->execute();
                    if ($resultado_consecutivo_update) {
                        $estado = 'ACTIVO';
                        $sql = $this->_db3->prepare("INSERT INTO cmx_trazabilidad_proceso(numdoc,cliente,referencia,observacion,fecha_creacion,hora_creacion,usuario,estado) 
                        VALUES(:numdoc,:cliente,:referencia,:observacion,:fecha_creacion,:hora_creacion,:usuario,:estado)");
                        $sql->bindParam(':numdoc', $numdoc, PDO::PARAM_STR);
                        $sql->bindParam(':cliente', $datos["cliente"], PDO::PARAM_STR);
                        $sql->bindParam(':referencia', $datos["referencia"], PDO::PARAM_STR);
                        $sql->bindParam(':observacion', $datos["observacion"], PDO::PARAM_STR);
                        $sql->bindParam(':usuario', $user, PDO::PARAM_STR);
                        $sql->bindParam(':fecha_creacion', $fecha, PDO::PARAM_STR);
                        $sql->bindParam(':hora_creacion', $hora, PDO::PARAM_STR);
                        $sql->bindParam(':estado', $estado, PDO::PARAM_STR);
                        $resultados = $sql->execute();
                        if ($resultados) {
                            $proceso = $datos["procesos"];
                            $detalle_proceso = $datos["procesos_detalle"];
                            $posiciones_detalle = $datos["posiciones_detalle"];
                            $usuarios_responsable = $datos["usuarios_responsable"];

                            for ($i = 0; $i < count($proceso->tipo); $i++) {
                                $sql_detalle1 = $this->_db3->prepare("INSERT INTO cmx_tipo_detalle_trazabilidad(numdoc_detalle_trazabilidad,tipo_procesos_id,fecha_creacion)
                                VALUES(:numdoc_detalle_trazabilidad,:tipo_procesos_id,:fecha_creacion)");
                                $sql_detalle1->bindParam(':numdoc_detalle_trazabilidad', $numdoc, PDO::PARAM_STR);
                                // $sql_detalle1->bindParam(':pedido_trazabilidad_id', $proceso_id, PDO::PARAM_STR);
                                $sql_detalle1->bindParam(':tipo_procesos_id', $proceso->tipo[$i], PDO::PARAM_STR);
                                $sql_detalle1->bindParam(':fecha_creacion', $fecha, PDO::PARAM_STR);
                                $resultados_detalle = $sql_detalle1->execute();
                            }
                            if ($resultados_detalle) {
                                $tiempo = 0;
                                for ($i = 0; $i < count($usuarios_responsable->usuario); $i++) {
                                    $detal = explode("/", $usuarios_responsable->posicion[$i]);
                                    $sql_detalle2 = $this->_db3->prepare("INSERT INTO cmx_detalle_opcion_trazabilidad(numdoc_detalle_opcion,detalle_proceso,posicion,usuario,fecha_creacion,hora,usuario_responsable,fecha_inicio,hora_inicio,tiempo_transcurrido,costo_promedio)
                                    VALUES(:numdoc_detalle_opcion,:detalle_proceso,:posicion,:usuario,:fecha_creacion,:hora,:usuario_responsable,:fecha_inicio,:hora_inicio,:tiempo_transcurrido,:costo_promedio)");
                                    $sql_detalle2->bindParam(':numdoc_detalle_opcion', $numdoc, PDO::PARAM_STR);
                                    $sql_detalle2->bindParam(':detalle_proceso', $detal[1], PDO::PARAM_STR);
                                    $sql_detalle2->bindParam(':posicion', $detal[0], PDO::PARAM_STR);
                                    $sql_detalle2->bindParam(':usuario', $user, PDO::PARAM_STR);
                                    $sql_detalle2->bindParam(':fecha_creacion', $fecha, PDO::PARAM_STR);
                                    $sql_detalle2->bindParam(':hora', $hora, PDO::PARAM_STR);
                                    // $sql_detalle2->bindParam(':usuario_responsable', $usuarios_responsable->usuario[$i], PDO::PARAM_STR);
                                    $sql_detalle2->bindParam(':usuario_responsable', $detal[2], PDO::PARAM_STR);
                                    $sql_detalle2->bindParam(':fecha_inicio', $usuarios_responsable->fecha[$i], PDO::PARAM_STR);
                                    $sql_detalle2->bindParam(':hora_inicio', $usuarios_responsable->hora[$i], PDO::PARAM_STR);
                                    $sql_detalle2->bindParam(':tiempo_transcurrido', $tiempo, PDO::PARAM_STR);
                                    $sql_detalle2->bindParam(':costo_promedio', $usuarios_responsable->costo[$i], PDO::PARAM_STR);
                                    $resultados_detalles = $sql_detalle2->execute();
                                }
                                if ($resultados_detalles) {
                                    $this->_db3->commit();
                                    $response = [
                                        'numero' => 200,
                                        'mensaje' => '<strong>Mensaje!</strong> Pedido generado exitosamente.',
                                    ];
                                } else {
                                    $this->_db3->commit();
                                    $response = [
                                        'numero' => 400,
                                        'mensaje' => '<strong>Mensaje!</strong> Pedido no generado.',
                                    ];
                                }
                            } else {
                                $response = ['numero' => 400, 'mensaje' => 'Error de operación proceso no insertado'];
                                $mensajeError = "Error de operación proceso no insertado";
                                error_log($mensajeError . "\n", 3, "error_log.txt");
                            }
                        } else {
                            $response = ['numero' => 400, 'mensaje' => 'Error de operación proceso no insertado'];
                        }
                    } else {
                        $mensajeError = "No actualizo consecutivo maestro";
                        error_log($mensajeError . "\n", 3, "error_log.txt");
                    }
                } else {
                    $mensajeError = "No resultado de consecuivo";
                    error_log($mensajeError . "\n", 3, "error_log.txt");
                }
            }
        } catch (\Throwable $th) {
            //throw $th;
            // Si ocurre algún error, deshacemos la transacción
            $this->_db3->rollBack();
            echo "Error en la transacción: " . $th->getMessage();
        }
        return $response;
    }

    public function Listar_Pedidos()
    {
        $user = $_SESSION["usuario"]["nom_usuario"];
        $estado = 'ACTIVO';

        // validar el perfil del usuario para los clientes
        if ($_SESSION["usuario"]["tipo_perfil"] === 'CLIENTES' && $_SESSION["usuario"]["nombre_perfil"] === 'Clientes' || $_SESSION["usuario"]["nombre_perfil"] === 'Cliente Externo') {
            $sql = $this->_db3->prepare("SELECT tp.numdoc,tp.referencia,tp.estado,tp.fecha_creacion,tp.hora_creacion,c.nombre FROM cmx_trazabilidad_proceso tp 
            INNER JOIN cmx_clientes c ON c.id=tp.cliente WHERE tp.cliente=:Cliente AND tp.estado='ACTIVO'");
            $sql->bindParam(':Cliente', $_SESSION["usuario"]["id_cliente"], PDO::PARAM_INT);
            // $sql->bindParam(':Estado', $estado, PDO::PARAM_INT);
            $sql->execute();
            $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $sql = $this->_db3->prepare("SELECT tp.numdoc,tp.referencia,tp.estado,tp.fecha_creacion,tp.hora_creacion,c.nombre FROM cmx_trazabilidad_proceso tp 
            INNER JOIN cmx_clientes c ON c.id=tp.cliente WHERE tp.estado='ACTIVO'");
            // $sql->bindParam(':Estado', $estado, PDO::PARAM_INT);
            $sql->execute();
            $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        }

        return $resultados;
    }

    public function Listar_pedidos_por_responsable()
    {
        if ($_SESSION["usuario"]["tipo_perfil"] === 'CLIENTES' && $_SESSION["usuario"]["nombre_perfil"] === 'Clientes' || $_SESSION["usuario"]["nombre_perfil"] === 'Cliente Externo') {
            $user = $_SESSION["usuario"]["id_usuario"];
            $user_name = $_SESSION["usuario"]["nom_usuario"];
            $sql = $this->_db3->prepare("SELECT tp.numdoc,tp.referencia,tp.estado,tp.fecha_creacion,tp.hora_creacion,c.nombre,tp.usuario FROM cmx_trazabilidad_proceso tp
            INNER JOIN cmx_clientes c ON c.id=tp.cliente
            INNER JOIN cmx_detalle_opcion_trazabilidad dot ON dot.numdoc_detalle_opcion=tp.numdoc
            WHERE dot.usuario_responsable=:Usuario AND LOWER(tp.usuario) != LOWER(:Nombre) AND  tp.cliente=:Cliente GROUP BY tp.numdoc");
            $sql->bindParam(':Usuario', $user, PDO::PARAM_STR);
            $sql->bindParam(':Nombre', $user_name, PDO::PARAM_STR);
            $sql->bindParam(':Cliente', $_SESSION["usuario"]["id_cliente"], PDO::PARAM_INT);
            $sql->execute();
            $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $user = $_SESSION["usuario"]["id_usuario"];
            $user_name = $_SESSION["usuario"]["nom_usuario"];
            $sql = $this->_db3->prepare("SELECT tp.numdoc,tp.referencia,tp.estado,tp.fecha_creacion,tp.hora_creacion,c.nombre,tp.usuario FROM cmx_trazabilidad_proceso tp
            INNER JOIN cmx_clientes c ON c.id=tp.cliente
            INNER JOIN cmx_detalle_opcion_trazabilidad dot ON dot.numdoc_detalle_opcion=tp.numdoc WHERE dot.usuario_responsable=:Usuario AND LOWER(tp.usuario) != LOWER(:Nombre) GROUP BY tp.numdoc");
            $sql->bindParam(':Usuario', $user, PDO::PARAM_STR);
            $sql->bindParam(':Nombre', $user_name, PDO::PARAM_STR);
            $sql->execute();
            $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        }

        return $resultados;
    }

    public function Lista_de_actividades($numdoc)
    {
        $sql = $this->_db3->prepare("SELECT dt.posicion,t.nombre_tipo,tt.nombre_opcion,u.nom_usuario,dt.fecha_inicio,dt.hora_inicio, dt.estado_actividad,
        t.id AS proceso_id,tt.id AS actividad_id,dt.detalle_proceso AS num_proceso,da.actividad AS actividad,da.actividad_dependiente,dt.costo_actividad
        FROM cmx_detalle_opcion_trazabilidad dt
        INNER JOIN cmx_trazabilidad_proceso tp ON tp.numdoc=dt.numdoc_detalle_opcion
        INNER JOIN cmx_tipo_opcion_trazabilidad tt ON tt.id=dt.detalle_proceso
        INNER JOIN cmx_tipo_trazabilidad t ON t.id=tt.tipo_trazabilidad
        INNER JOIN cmx_usuarios u ON u.id=dt.usuario_responsable
        LEFT JOIN  cmx_dependencia_actividad da ON tt.id=da.actividad
        WHERE dt.numdoc_detalle_opcion=:numdoc GROUP BY dt.posicion ORDER BY dt.posicion ASC");
        $sql->bindParam(':numdoc', $numdoc, PDO::PARAM_STR);
        $sql->execute();
        $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultados;
    }

    public function Lista_de_actividades_compartidos($numdoc)
    {
        $user = $_SESSION["usuario"]["id_usuario"];
        $sql = $this->_db3->prepare("SELECT dt.posicion,t.nombre_tipo,tt.nombre_opcion,u.nom_usuario,dt.fecha_inicio,dt.hora_inicio, dt.estado_actividad,t.id AS proceso_id,tt.id AS actividad_id,dt.detalle_proceso AS num_proceso,da.actividad AS actividad,
        da.actividad_dependiente,u.id  AS responsable_actividad_id
        FROM cmx_detalle_opcion_trazabilidad dt
        INNER JOIN cmx_trazabilidad_proceso tp ON tp.numdoc=dt.numdoc_detalle_opcion
        INNER JOIN cmx_tipo_opcion_trazabilidad tt ON tt.id=dt.detalle_proceso
        INNER JOIN cmx_tipo_trazabilidad t ON t.id=tt.tipo_trazabilidad
        INNER JOIN cmx_usuarios u ON u.id=dt.usuario_responsable
        LEFT JOIN  cmx_dependencia_actividad da ON tt.id=da.actividad
        WHERE dt.numdoc_detalle_opcion=:numdoc AND dt.usuario_responsable=:Usuario  GROUP BY dt.posicion ORDER BY dt.posicion ASC");
        $sql->bindParam(':numdoc', $numdoc, PDO::PARAM_STR);
        $sql->bindParam(':Usuario', $user, PDO::PARAM_STR);
        $sql->execute();
        $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultados;
    }

    public function Detalle_Pedidos($numdoc)
    {
        // $sql = $this->_db3->prepare("SELECT *
        $sql = $this->_db3->prepare("SELECT tp.cliente,tp.referencia,tp.observacion,td.tipo_procesos_id,dot.detalle_proceso,c.nombre
        FROM cmx_trazabilidad_proceso tp
        INNER JOIN cmx_clientes c ON c.id=tp.cliente
        INNER JOIN cmx_tipo_detalle_trazabilidad td ON tp.numdoc=td.numdoc_detalle_trazabilidad
        INNER JOIN cmx_detalle_opcion_trazabilidad dot ON tp.numdoc=dot.numdoc_detalle_opcion
        WHERE tp.numdoc=:numdco GROUP BY td.tipo_procesos_id");
        $sql->bindParam(':numdco', $numdoc, PDO::PARAM_STR);
        $sql->execute();
        $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultados;
    }

    public function Detalle_tipo_Pedidos($numdoc)
    {
        // $sql = $this->_db3->prepare("SELECT *
        $sql = $this->_db3->prepare("SELECT tp.cliente,tp.referencia,tp.observacion,dot.detalle_proceso
        FROM cmx_trazabilidad_proceso tp
        INNER JOIN cmx_detalle_opcion_trazabilidad dot ON tp.numdoc=dot.numdoc_detalle_opcion
        WHERE tp.numdoc=:numdco");
        $sql->bindParam(':numdco', $numdoc, PDO::PARAM_STR);
        $sql->execute();
        $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultados;
    }

    public function Actualizar_pedido_trazabilidad($datos)
    {
        $fecha = date("Y-m-d H:i:s");
        try {
            $this->_db3->beginTransaction();
            $sql_delete_detalle1 = $this->_db3->prepare("DELETE FROM cmx_tipo_detalle_trazabilidad WHERE numdoc_detalle_trazabilidad=:Nundoc");
            $sql_delete_detalle1->bindParam(':Nundoc', $datos["nundoc"], PDO::PARAM_STR);
            $resultado_delete_detalle1 = $sql_delete_detalle1->execute();
            if ($resultado_delete_detalle1) {
                $proceso = $datos["procesos"];
                $detalle_proceso = $datos["procesos_detalle"];
                for ($i = 0; $i < count($proceso->tipo); $i++) {
                    $sql_detalle1 = $this->_db3->prepare("INSERT INTO cmx_tipo_detalle_trazabilidad(numdoc_detalle_trazabilidad,tipo_procesos_id,fecha_creacion)VALUES(:numdoc_detalle_trazabilidad,:tipo_procesos_id,:fecha_creacion)");
                    $sql_detalle1->bindParam(':numdoc_detalle_trazabilidad', $datos["nundoc"], PDO::PARAM_STR);
                    $sql_detalle1->bindParam(':tipo_procesos_id', $proceso->tipo[$i], PDO::PARAM_STR);
                    $sql_detalle1->bindParam(':fecha_creacion', $fecha, PDO::PARAM_STR);
                    $resultados_detalle = $sql_detalle1->execute();
                }
                if ($resultados_detalle) {
                    for ($i = 0; $i < count($detalle_proceso->detalle); $i++) {
                        $sql_detalle2 = $this->_db3->prepare("INSERT INTO cmx_detalle_opcion_trazabilidad(numdoc_detalle_opcion,detalle_proceso,fecha_creacion)VALUES(:numdoc_detalle_opcion,:detalle_proceso,:fecha_creacion)");
                        $sql_detalle2->bindParam(':numdoc_detalle_opcion', $datos["nundoc"], PDO::PARAM_STR);
                        $sql_detalle2->bindParam(':detalle_proceso', $detalle_proceso->detalle[$i], PDO::PARAM_STR);
                        $sql_detalle2->bindParam(':fecha_creacion', $fecha, PDO::PARAM_STR);
                        $resultados_detalles = $sql_detalle2->execute();
                    }
                    if ($resultados_detalles) {
                        $this->_db3->commit();
                        $response = array(
                            'numero' => 200,
                            'mensaje' => '<strong>Mensaje!</strong> Pedido actualizado exitosamente.',
                        );
                        // return $response;
                    } else {
                        $this->_db3->commit();
                        $response = array(
                            'numero' => 400,
                            'mensaje' => '<strong>Mensaje!</strong> Pedido no actualizado.',
                        );
                    }
                    return $response;
                } else {
                    $mensajeError = "Error al momento de eliminar el segundo detalle";
                    error_log($mensajeError . "\n", 3, "error_log.txt");
                }
            } else {
                $mensajeError = "Error al momento de eliminar el segundo detalle";
                error_log($mensajeError . "\n", 3, "error_log.txt");
            }
        } catch (\Throwable $th) {
            //throw $th;
            $this->_db3->rollBack();
            echo "Error en la transacción: " . $th->getMessage();
        }
    }

    public function Listar_pedidos_clientes($cliente)
    {
        $sql = $this->_db3->prepare("SELECT pedido.id,pedido.numdoc,pedido.referencia,pedido.cliente FROM cmx_trazabilidad_proceso pedido
        INNER JOIN cmx_clientes clientes ON clientes.id=pedido.cliente WHERE pedido.cliente=:Cliente");
        $sql->bindParam(':Cliente', $cliente, PDO::PARAM_STR);
        $sql->execute();
        $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultados;
    }

    public function Listar_solicitudes_clientes($cliente)
    {
        $sql = $this->_db3->prepare("SELECT ss.nundoc_solicitud AS solicitud_servicio,ss.peso_kg AS PESO,dm.tipo_mercancia AS MERCANCIA FROM cmx_solicitud_vehiculo2 ss
                INNER JOIN	cmx_detalle_mercancia2 dm ON dm.id=ss.idpareja_origen_destino
                INNER JOIN cmx_cotizaciones_serviciocliente cs ON cs.n_cotizacion=ss.n_cotizacion
                INNER JOIN cmx_clientes c ON c.documento=cs.nit WHERE c.id=:Cliente");
        $sql->bindParam(':Cliente', $cliente, PDO::PARAM_STR);
        $sql->execute();
        $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultados;
    }

    public function Insertar_solicitud_pedido($solicitud, $pedido)
    {
        $fecha = date("Y-m-d H:i:s");
        $user = $_SESSION["usuario"]["nom_usuario"];
        $estado = "ACTIVO";
        $sql = $this->_db3->prepare("INSERT INTO cmx_solicitudes_pedidos(solicitud_id,pedido_id,fecha,usuario,estado) VALUES(:solicitud_id,:pedido_id,:fecha,:usuario,:estado)");
        $sql->bindParam(':solicitud_id', $solicitud, PDO::PARAM_STR);
        $sql->bindParam(':pedido_id', $pedido, PDO::PARAM_STR);
        $sql->bindParam(':fecha', $fecha, PDO::PARAM_STR);
        $sql->bindParam(':usuario', $user, PDO::PARAM_STR);
        $sql->bindParam(':estado', $estado, PDO::PARAM_STR);
        $resultado = $sql->execute();
        if ($resultado) {
            $response = array(
                'numero' => 200,
                'mensaje' => '<strong>Mensaje!</strong> Asosiacion generada exitosamente.',
            );
        } else {
            $response = array(
                'numero' => 400,
                'mensaje' => '<strong>Mensaje!</strong> Asosiacion no generada.',
            );
        }
        return $response;
    }

    public function Listar_puntos_parametro_gestion($nundoc)
    {
        $sql = $this->_db3->prepare("SELECT tt.id,tpt.numdoc_detalle_trazabilidad,tt.nombre_tipo FROM cmx_tipo_detalle_trazabilidad tpt
        INNER JOIN cmx_tipo_trazabilidad tt ON tt.id=tpt.tipo_procesos_id
        WHERE tpt.numdoc_detalle_trazabilidad=:Nundoc");
        $sql->bindParam(':Nundoc', $nundoc, PDO::PARAM_STR);
        $sql->execute();
        $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultados;
    }

    public function Listar_puntos_opcion_parametro_gestion($nundoc, $trazabilidad_id)
    {
        $sql = $this->_db3->prepare("SELECT top.id,top.nombre_opcion,dot.numdoc_detalle_opcion FROM cmx_detalle_opcion_trazabilidad dot
        INNER JOIN cmx_tipo_opcion_trazabilidad top ON top.id=dot.detalle_proceso
        WHERE dot.numdoc_detalle_opcion=:Nundoc AND top.tipo_trazabilidad=:Id_trazabilidad");
        $sql->bindParam(':Nundoc', $nundoc, PDO::PARAM_STR);
        $sql->bindParam(':Id_trazabilidad', $trazabilidad_id, PDO::PARAM_STR);
        $sql->execute();
        $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultados;
    }

    public function Insertar_gestion($datos)
    {
        $fecha = date("Y-m-d H:i:s");
        $user = $_SESSION["usuario"]["nom_usuario"];
        $ruta = 'public/files/gestion/' . $datos["nundoc"] . '/';

        if (!is_dir($ruta)) {
            if ($datos["documento"] !== "Sin_evidencia") {
                if (mkdir($ruta, 0777, true)) {
                    $sql_update = $this->_db3->prepare("UPDATE cmx_detalle_opcion_trazabilidad SET estado_actividad=:Estado WHERE numdoc_detalle_opcion=:Nundoc AND detalle_proceso=:Actividad");
                    $sql_update->bindParam(':Estado', $datos["estado_actividad"], PDO::PARAM_STR);
                    $sql_update->bindParam(':Nundoc', $datos["nundoc"], PDO::PARAM_STR);
                    $sql_update->bindParam(':Actividad', $datos["parametros_punto_pedido_opcion"], PDO::PARAM_STR);
                    $resultado_update = $sql_update->execute();
                    if ($resultado_update) {
                        $sql = $this->_db3->prepare("INSERT INTO cmx_pedidos_solicitudes_detalles(num_pedido,parametro_id,punto_opcion_id,observacion,documento,nombre_archivo,se_publica,fecha,usuario,estado)
                        VALUES(:num_pedido,:parametro_id,:punto_opcion_id,:observacion,:documento,:nombre_archivo,:se_publica,:fecha,:usuario,:estado)");
                        $sql->bindParam(':num_pedido', $datos["nundoc"], PDO::PARAM_STR);
                        $sql->bindParam(':parametro_id', $datos["parametros_pedido"], PDO::PARAM_STR);
                        $sql->bindParam(':punto_opcion_id', $datos["parametros_punto_pedido_opcion"], PDO::PARAM_STR);
                        $sql->bindParam(':observacion', $datos["observacion"], PDO::PARAM_STR);
                        $sql->bindParam(':documento', $ruta, PDO::PARAM_STR);
                        $sql->bindParam(':nombre_archivo', $datos["documento"]['name'], PDO::PARAM_STR);
                        $sql->bindParam(':se_publica', $datos["publicar"], PDO::PARAM_STR);
                        $sql->bindParam(':fecha', $fecha, PDO::PARAM_STR);
                        $sql->bindParam(':usuario', $user, PDO::PARAM_STR);
                        $sql->bindParam(':estado', $datos["estado"], PDO::PARAM_STR);
                        $resultado = $sql->execute();
                        $documento = $datos["documento"];
                        if (isset($datos["documento"])) {
                            $file = $documento["name"];
                            $tipo = $documento["type"];
                            $ruta_provisional = $documento["tmp_name"];
                            $carpeta = $ruta;
                            $src = $carpeta . $file;
                            move_uploaded_file($ruta_provisional, $src);
                        }
                        if ($resultado) {
                            $response = array(
                                'numero' => 200,
                                'mensaje' => '<strong>Mensaje!</strong> Gestion registrada exitosamente.',
                            );
                            // return $response;
                        } else {
                            $response = array(
                                'numero' => 400,
                                'mensaje' => '<strong>Mensaje!</strong> Gestion no registrada.',
                            );
                        }
                        return $response;
                    } else {
                        echo "ERROR DE UPDATE";
                    }
                } else {
                    echo "No se pudo crear la carpeta 2.";
                }
            } else {
                $sql_update = $this->_db3->prepare("UPDATE cmx_detalle_opcion_trazabilidad SET estado_actividad=:Estado WHERE numdoc_detalle_opcion=:Nundoc AND detalle_proceso=:Actividad");
                $sql_update->bindParam(':Estado', $datos["estado_actividad"], PDO::PARAM_STR);
                $sql_update->bindParam(':Nundoc', $datos["nundoc"], PDO::PARAM_STR);
                $sql_update->bindParam(':Actividad', $datos["parametros_punto_pedido_opcion"], PDO::PARAM_STR);
                $resultado_update = $sql_update->execute();
                if ($resultado_update) {
                    // Se inserta sin eveidencia la gestion
                    $sql = $this->_db3->prepare("INSERT INTO cmx_pedidos_solicitudes_detalles(num_pedido,parametro_id,punto_opcion_id,observacion,documento,nombre_archivo,se_publica,fecha,usuario,estado)
                VALUES(:num_pedido,:parametro_id,:punto_opcion_id,:observacion,:documento,:nombre_archivo,:se_publica,:fecha,:usuario,:estado)");
                    $sql->bindParam(':num_pedido', $datos["nundoc"], PDO::PARAM_STR);
                    $sql->bindParam(':parametro_id', $datos["parametros_pedido"], PDO::PARAM_STR);
                    $sql->bindParam(':punto_opcion_id', $datos["parametros_punto_pedido_opcion"], PDO::PARAM_STR);
                    $sql->bindParam(':observacion', $datos["observacion"], PDO::PARAM_STR);
                    $sql->bindParam(':documento', $ruta, PDO::PARAM_STR);
                    $sql->bindParam(':nombre_archivo', $datos["documento"], PDO::PARAM_STR);
                    $sql->bindParam(':se_publica', $datos["publicar"], PDO::PARAM_STR);
                    $sql->bindParam(':fecha', $fecha, PDO::PARAM_STR);
                    $sql->bindParam(':usuario', $user, PDO::PARAM_STR);
                    $sql->bindParam(':estado', $datos["estado"], PDO::PARAM_STR);
                    $resultado = $sql->execute();
                    if ($resultado) {
                        $response = array(
                            'numero' => 200,
                            'mensaje' => '<strong>Mensaje!</strong> Gestion registrada exitosamente.',
                        );
                        // return $response;
                    } else {
                        $response = array(
                            'numero' => 400,
                            'mensaje' => '<strong>Mensaje!</strong> Gestion no registrada.',
                        );
                    }
                    return $response;
                }
            }
        } else {
            if ($datos["documento"] !== "Sin_evidencia") {
                $sql_update = $this->_db3->prepare("UPDATE cmx_detalle_opcion_trazabilidad SET estado_actividad=:Estado WHERE numdoc_detalle_opcion=:Nundoc AND detalle_proceso=:Actividad");
                $sql_update->bindParam(':Estado', $datos["estado_actividad"], PDO::PARAM_STR);
                $sql_update->bindParam(':Nundoc', $datos["nundoc"], PDO::PARAM_STR);
                $sql_update->bindParam(':Actividad', $datos["parametros_punto_pedido_opcion"], PDO::PARAM_STR);
                $resultado_update = $sql_update->execute();
                if ($resultado_update) {
                    $sql = $this->_db3->prepare("INSERT INTO cmx_pedidos_solicitudes_detalles(num_pedido,parametro_id,punto_opcion_id,observacion,documento,nombre_archivo,se_publica,fecha,usuario,estado)
                    VALUES(:num_pedido,:parametro_id,:punto_opcion_id,:observacion,:documento,:nombre_archivo,:se_publica,:fecha,:usuario,:estado)");
                    $sql->bindParam(':num_pedido', $datos["nundoc"], PDO::PARAM_STR);
                    $sql->bindParam(':parametro_id', $datos["parametros_pedido"], PDO::PARAM_STR);
                    $sql->bindParam(':punto_opcion_id', $datos["parametros_punto_pedido_opcion"], PDO::PARAM_STR);
                    $sql->bindParam(':observacion', $datos["observacion"], PDO::PARAM_STR);
                    $sql->bindParam(':documento', $ruta, PDO::PARAM_STR);
                    $sql->bindParam(':nombre_archivo', $datos["documento"]['name'], PDO::PARAM_STR);
                    $sql->bindParam(':se_publica', $datos["publicar"], PDO::PARAM_STR);
                    $sql->bindParam(':fecha', $fecha, PDO::PARAM_STR);
                    $sql->bindParam(':usuario', $user, PDO::PARAM_STR);
                    $sql->bindParam(':estado', $datos["estado"], PDO::PARAM_STR);
                    $resultado = $sql->execute();
                    $documento = $datos["documento"];
                    if (isset($datos["documento"])) {
                        $file = $documento["name"];
                        $tipo = $documento["type"];
                        $ruta_provisional = $documento["tmp_name"];
                        $carpeta = $ruta;
                        $src = $carpeta . $file;
                        move_uploaded_file($ruta_provisional, $src);
                    }
                    if ($resultado) {
                        $response = array(
                            'numero' => 200,
                            'mensaje' => '<strong>Mensaje!</strong> Gestion registrada exitosamente.',
                        );
                        // return $response;
                    } else {
                        $response = array(
                            'numero' => 400,
                            'mensaje' => '<strong>Mensaje!</strong> Gestion no registrada.',
                        );
                    }
                    return $response;
                } else {
                    echo "ERROR DE UPDATE";
                }
            } else {
                // Se inserta sin eveidencia la gestion
                $sql_update = $this->_db3->prepare("UPDATE cmx_detalle_opcion_trazabilidad SET estado_actividad=:Estado WHERE numdoc_detalle_opcion=:Nundoc AND detalle_proceso=:Actividad");
                $sql_update->bindParam(':Estado', $datos["estado_actividad"], PDO::PARAM_STR);
                $sql_update->bindParam(':Nundoc', $datos["nundoc"], PDO::PARAM_STR);
                $sql_update->bindParam(':Actividad', $datos["parametros_punto_pedido_opcion"], PDO::PARAM_STR);
                $resultado_update = $sql_update->execute();
                if ($resultado_update) {
                    $sql = $this->_db3->prepare("INSERT INTO cmx_pedidos_solicitudes_detalles(num_pedido,parametro_id,punto_opcion_id,observacion,documento,nombre_archivo,se_publica,fecha,usuario,estado)
                                    VALUES(:num_pedido,:parametro_id,:punto_opcion_id,:observacion,:documento,:nombre_archivo,:se_publica,:fecha,:usuario,:estado)");
                    $sql->bindParam(':num_pedido', $datos["nundoc"], PDO::PARAM_STR);
                    $sql->bindParam(':parametro_id', $datos["parametros_pedido"], PDO::PARAM_STR);
                    $sql->bindParam(':punto_opcion_id', $datos["parametros_punto_pedido_opcion"], PDO::PARAM_STR);
                    $sql->bindParam(':observacion', $datos["observacion"], PDO::PARAM_STR);
                    $sql->bindParam(':documento', $ruta, PDO::PARAM_STR);
                    $sql->bindParam(':nombre_archivo', $datos["documento"], PDO::PARAM_STR);
                    $sql->bindParam(':se_publica', $datos["publicar"], PDO::PARAM_STR);
                    $sql->bindParam(':fecha', $fecha, PDO::PARAM_STR);
                    $sql->bindParam(':usuario', $user, PDO::PARAM_STR);
                    $sql->bindParam(':estado', $datos["estado"], PDO::PARAM_STR);
                    $resultado = $sql->execute();
                    if ($resultado) {
                        $response = array(
                            'numero' => 200,
                            'mensaje' => '<strong>Mensaje!</strong> Gestion registrada exitosamente.',
                        );
                        // return $response;
                    } else {
                        $response = array(
                            'numero' => 400,
                            'mensaje' => '<strong>Mensaje!</strong> Gestion no registrada.',
                        );
                    }
                    return $response;
                }
            }
        }
    }

    public function Detalle_gestion($nundoc)
    {
        $sql = $this->_db3->prepare("SELECT *,psd.id AS detalle_id,psd.num_pedido  FROM cmx_pedidos_solicitudes_detalles psd
        INNER JOIN cmx_tipo_trazabilidad tp ON tp.id=psd.parametro_id
        INNER JOIN cmx_tipo_opcion_trazabilidad tpt ON tpt.id=psd.punto_opcion_id
        WHERE psd.num_pedido=:Nundoc");
        $sql->bindParam(':Nundoc', $nundoc, PDO::PARAM_STR);
        $sql->execute();
        $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultados;
    }

    public function Detalle_gestion_actividad($nundoc, $actividad)
    {
        $sql = $this->_db3->prepare("SELECT *,psd.id AS detalle_id,psd.num_pedido  FROM cmx_pedidos_solicitudes_detalles psd
        INNER JOIN cmx_tipo_trazabilidad tp ON tp.id=psd.parametro_id
        INNER JOIN cmx_tipo_opcion_trazabilidad tpt ON tpt.id=psd.punto_opcion_id
        WHERE psd.num_pedido=:Nundoc AND psd.punto_opcion_id=:Actividad");
        $sql->bindParam(':Nundoc', $nundoc, PDO::PARAM_STR);
        $sql->bindParam(':Actividad', $actividad, PDO::PARAM_STR);
        $sql->execute();
        $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultados;
    }

    public function Actualizar_publicado($estado, $id)
    {
        $sql = $this->_db3->prepare("UPDATE cmx_pedidos_solicitudes_detalles SET se_publica=:Estado WHERE id=:Id");
        $sql->bindParam(':Estado', $estado, PDO::PARAM_STR);
        $sql->bindParam(':Id', $id, PDO::PARAM_STR);
        $resultado = $sql->execute();
        if ($resultado) {
            $response = array(
                'numero' => 200,
                'mensaje' => '<strong>Mensaje!</strong> Estado de publicado actualizado exitosamente.',
            );
        } else {
            $response = array(
                'numero' => 400,
                'mensaje' => '<strong>Mensaje!</strong> Publicado no actualizado.',
            );
        }
        return $response;
    }

    public function Buscar_usaurio_responsable($datos)
    {
        $sql = $this->_db3->prepare("SELECT user_log,id,nom_usuario,email FROM cmx_usuarios WHERE user_log LIKE '%' :datos '%' OR nom_usuario LIKE '%' :datos '%' ORDER BY nom_usuario ASC");
        $sql->bindParam(':datos', $datos, PDO::PARAM_STR);
        $sql->execute();
        $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultados;
    }

    public function Numero_de_actividades($nundoc)
    {
        $sql_numero_actividades = $this->_db3->prepare("SELECT COUNT(*) AS Cantidad_actividades FROM cmx_detalle_opcion_trazabilidad WHERE numdoc_detalle_opcion=:Numdoc");
        $sql_numero_actividades->bindParam(':Numdoc', $nundoc, PDO::PARAM_STR);
        $sql_numero_actividades->execute();
        $resultado_cantidad_actividades = $sql_numero_actividades->fetch(PDO::FETCH_ASSOC);

        $sql_numero_actividades_completas = $this->_db3->prepare("SELECT COUNT(*) AS Cantidad_actividades_completas FROM cmx_detalle_opcion_trazabilidad WHERE numdoc_detalle_opcion=:Numdoc AND estado_actividad='COMPLETADO'");
        $sql_numero_actividades_completas->bindParam(':Numdoc', $nundoc, PDO::PARAM_STR);
        $sql_numero_actividades_completas->execute();
        $resultado_cantidad_actividades_completas = $sql_numero_actividades_completas->fetch(PDO::FETCH_ASSOC);

        $sql_estado_actividades = $this->_db3->prepare("SELECT estado_actividad FROM cmx_detalle_opcion_trazabilidad WHERE numdoc_detalle_opcion=:Numdoc");
        $sql_estado_actividades->bindParam(':Numdoc', $nundoc, PDO::PARAM_STR);
        $sql_estado_actividades->execute();
        $resultado_estado_actividades = $sql_estado_actividades->fetchAll(PDO::FETCH_ASSOC);

        $response = array(
            "cantidad_actividades" => $resultado_cantidad_actividades,
            "cantidad_actividades_completas" => $resultado_cantidad_actividades_completas,
            "estado_actividades" => $resultado_estado_actividades,
        );

        return $response;
    }

    public function Listar_Plantillas_pedido()
    {
        $sql = $this->_db3->prepare("SELECT * FROM cmx_plantilla");
        $sql->execute();
        $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultados;
    }

    public function Pintar_Plantillas_pedido($numdoc_plantilla)
    {
        $sql = $this->_db3->prepare("SELECT * FROM cmx_plantilla p
        INNER JOIN cmx_detalle_plantilla_parametros dp ON dp.numdoc_plantilla=p.numdoc
        WHERE p.numdoc=:Numdoc");
        $sql->bindParam(':Numdoc', $numdoc_plantilla, PDO::PARAM_STR);
        $sql->execute();
        $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultados;
    }

    public function Pintar_Activiaddes_Plantilla($numdoc_plantilla)
    {
        $sql = $this->_db3->prepare("SELECT * FROM cmx_plantilla p
        -- INNER JOIN cmx_detalle_plantilla_parametros dp ON dp.numdoc_plantilla=p.numdoc
        INNER JOIN cmx_plantilla_actividad pa ON pa.numdoc_detalle_plantilla=p.numdoc
        WHERE p.numdoc=:Numdoc GROUP BY pa.detalle_actividad_plantilla ORDER BY pa.posicion ASC");
        $sql->bindParam(':Numdoc', $numdoc_plantilla, PDO::PARAM_STR);
        $sql->execute();
        $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultados;
    }

    public function Filtro_Buscar_Pedidos($datos)
    {
        $sql = $this->_db3->prepare("SELECT tra.referencia,tra.numdoc,tra.estado,tra.fecha_creacion,tra.hora_creacion,cli.nombre FROM cmx_trazabilidad_proceso tra INNER JOIN cmx_clientes cli ON cli.id=tra.cliente WHERE tra.referencia LIKE '%' :datos '%' OR cli.nombre LIKE '%' :datos '%' ORDER BY tra.referencia ASC");
        $sql->bindParam(':datos', $datos, PDO::PARAM_STR);
        $sql->execute();
        $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultados;
    }

    public function Actualizar_costo_actividad($actvidad_id, $valor, $nundoc)
    {
        $sql = $this->_db3->prepare("UPDATE cmx_detalle_opcion_trazabilidad SET costo_actividad=:Valor WHERE numdoc_detalle_opcion=:Nundoc AND detalle_proceso=:detalle_proceso");
        $sql->bindParam(':Valor', $valor, PDO::PARAM_STR);
        $sql->bindParam(':Nundoc', $nundoc, PDO::PARAM_STR);
        $sql->bindParam(':detalle_proceso', $actvidad_id, PDO::PARAM_STR);
        $resultado = $sql->execute();
        if ($resultado) {
            $response = [
                'status' => 200,
                'mensaje' => '<strong>Mensaje!</strong> Costo de actividad actualizado exitosamente.',
            ];
        } else {
            $response = [
                'status' => 400,
                'mensaje' => '<strong>Mensaje</strong> Costo de actividad no actualizado.',
            ];
        }
        return $response;
    }

    /* Listar responsables de activadaes para caambiar */

    public function Listar_usaurio_responsable()
    {
        $sql = $this->_db3->prepare("SELECT user_log,id,nom_usuario,email FROM cmx_usuarios WHERE estado=1 ORDER BY nom_usuario ASC");
        $sql->execute();
        $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultados;
    }

    public function actualizar_responsable($actividad_id, $responsable_actividad, $nuevo_responsable)
    {
        $response = [];

        /* Validar si el responsable actual si conide con la actividad a cambiar */
        $sql_validar_responsable = $this->_db3->prepare("SELECT id FROM cmx_detalle_opcion_trazabilidad WHERE usuario_responsable=:Responsable AND detalle_proceso=:detalle_proceso");
        $sql_validar_responsable->bindParam(':Responsable', $responsable_actividad, PDO::PARAM_STR);
        $sql_validar_responsable->bindParam(':detalle_proceso', $actividad_id, PDO::PARAM_STR);
        $sql_validar_responsable->execute();
        $validar_responsable = $sql_validar_responsable->fetch(PDO::FETCH_ASSOC);
        if ($validar_responsable) {
            $sql_update_responsable = $this->_db3->prepare("UPDATE cmx_detalle_opcion_trazabilidad SET usuario_responsable=:Responsable WHERE detalle_proceso=:detalle_proceso");
            $sql_update_responsable->bindParam(':Responsable', $nuevo_responsable, PDO::PARAM_STR);
            $sql_update_responsable->bindParam(':detalle_proceso', $actividad_id, PDO::PARAM_STR);
            $sql_update_responsable->execute();
            if ($sql_update_responsable) {
                $response = [
                    'status' => 200,
                    'mensaje' => '<strong>Mensaje!</strong> Responsable de actividad actualizado exitosamente.',
                ];
            } else {
                $response = [
                    'status' => 400,
                    'mensaje' => '<strong>Mensaje</strong> Responsable de actividad no actualizado.',
                ];
            }
            // $validar_responsable = $sql_update_responsable->fetch(PDO::FETCH_ASSOC);
        } else {
            $response = [
                'status' => 400,
                'mensaje' => '<strong>Mensaje</strong> Responsable actual no coincide con la actividad a cambiar.',
            ];
        }
        return $response;
    }

    public function Consultar_responsables()
    {
        $sql_responsable = $this->_db3->prepare("SELECT u.user_log,u.nom_usuario,u.id AS usuario_responsable_id FROM cmx_usuarios u 
        INNER JOIN cmx_usuario_cliente uc ON u.id=uc.id_usuario
        INNER JOIN cmx_perfiles p ON uc.id_perfil=p.id
        WHERE u.estado=1");
        $sql_responsable->execute();
        $resultado = $sql_responsable->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Insertar_cancelacion_pedido($datos)
    {
        $response = [];
        $empresa_id = $_SESSION['usuario']['empresa_id'];
        $usuario = $_SESSION["usuario"]["nom_usuario"];
        $update_estado = $this->_db3->prepare("UPDATE cmx_trazabilidad_proceso SET estado=:estado WHERE numdoc=:numdoc AND referencia=:referencia");
        $update_estado->bindParam(':estado', $datos['estado_cancelacion'], PDO::PARAM_STR);
        $update_estado->bindParam(':numdoc', $datos['numdoc'], PDO::PARAM_STR);
        $update_estado->bindParam(':referencia', $datos['referencia'], PDO::PARAM_STR);
        $update_estado->execute();
        if ($update_estado) {
            $insert_cancelacion = $this->_db3->prepare("INSERT INTO cmx_detalle_estado_trazabilidad (numdoc_trazabilidad, motivo, reposable, fecha,hora,usuario,empresa_id) 
            VALUES (:numdoc_trazabilidad, :motivo, :reposable, :fecha,:hora,:usuario,:empresa_id)");
            $insert_cancelacion->bindParam(':numdoc_trazabilidad', $datos['numdoc'], PDO::PARAM_STR);
            $insert_cancelacion->bindParam(':motivo', $datos['motivo_cancelacion'], PDO::PARAM_STR);
            $insert_cancelacion->bindParam(':reposable', $datos['responsable_cancelacion'], PDO::PARAM_STR);
            $insert_cancelacion->bindParam(':fecha', $datos['fecha_cancelacion'], PDO::PARAM_STR);
            $insert_cancelacion->bindParam(':hora', $datos['hora_cancelacion'], PDO::PARAM_STR);
            $insert_cancelacion->bindParam(':usuario', $usuario, PDO::PARAM_STR);
            $insert_cancelacion->bindParam(':empresa_id', $empresa_id, PDO::PARAM_INT);

            $insert_cancelacion->execute();
            if ($insert_cancelacion) {
                $response = [
                    'status' => 200,
                    'mensaje' => '<strong>Mensaje!</strong> Pedido cancelado exitosamente.',
                ];
            } else {
                $response = [
                    'status' => 400,
                    'mensaje' => '<strong>Mensaje</strong> Error al cancelar el pedido.',
                ];
            }
        } else {
            $response = [
                'status' => 400,
                'mensaje' => '<strong>Mensaje</strong> Error al actualizar el estado del pedido.',
            ];
        }
        return $response;
    }
}
