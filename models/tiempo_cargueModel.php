<?php
session_start();
class tiempo_cargueModel extends Model
{

    public function __construct()
    {
        parent::__construct();
    }

    public function Mani_ordenes_pendiente()
    {
        try {
            $sql = "SELECT mn.* FROM cmx_manifiesto mn
			INNER JOIN cmx_inicio_ruta i
			ON mn.id=i.num_manifiesto
			WHERE mn.id NOT IN(
				SELECT t2.num_manifiesto FROM cmx_tiempo_cargue t2
			)";

            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Datos_Manifiesto($idmnf)
    {
        try {
            $sql = "SELECT ma.id, ma.placa,
				mak.marca, colou.color, ve.anio_fabricacion,
				con.nombre as conductor, con.apellido1 as conape1, con.apellido2 as conape2,
				con.numero_documento as docconductor, con.celular,
				pro.nombre as propietario, pro.apellido1, pro.apellido2,
				pro.numero_documento as docpropietario
				FROM cmx_manifiesto ma
				INNER JOIN cmx_inicio_ruta i ON ma.id=i.num_manifiesto
				INNER JOIN cmx_vehiculos v ON ma.placa=v.placa
				INNER JOIN cmx_vehiculo2 ve ON v.numdoc_vehiculo=ve.id_vehiculo
				INNER JOIN cmx_rndc_vehiculos_marcas mak ON  ve.marca=mak.id
				INNER JOIN cmx_rndc_vehiculos_color colou ON ve.color=colou.id
				INNER JOIN cmx_proveedores con ON ma.conductor_manifiesto=con.numero_documento
				INNER JOIN cmx_proveedores pro ON v.id_propietario=pro.id
				WHERE ma.id=" . $idmnf;
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetch();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Ordenes_Asociadas($manifi)
    {
        try {
            $sql = "CALL INFORMACION_ORDEN_CARGE($manifi)";
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }
    public function Ordenes_Asociadas_detalle($manifi, $orden_cargue)
    {
        try {
            $sql = "CALL INFORMACION_ORDEN_CARGE_DETALLE($manifi,$orden_cargue)";
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Validar_Orden_Cargue($manifiesto)
    {
        // $fecha = date("Y-m-d");
        $sqlm = $this->_db3->prepare("SELECT num_manifiesto FROM cmx_tiempo_cargue WHERE num_manifiesto=:manifiesto /*AND fecha=:fecha*/");
        $sqlm->bindParam(":manifiesto", $manifiesto);
        // $sqlm->bindParam(":fecha", $fecha);
        $sqlm->execute();
        $number_manifiesto = $sqlm->fetch(PDO::FETCH_ASSOC);
        if ($number_manifiesto) {
            return true;
        } else {
            return false;
        }
    }

    public function Insertar_Tiempo(
        $manifiesto,
        $placa,
        $tipofechallega,
        $fllegcargar,
        $hllegcargar,
        $tipofechaentro,
        $fentrocarga,
        $hentrocarga,
        $tipofechasali,
        $fsalidacarga,
        $hsalidacarga,
        $num_orden
    ) {
        $factual = date('Y-m-d');
        $horactual = date('H:i:s');
        $id_usuario = $_SESSION["usuario"]["nom_usuario"];
        //Santizar
        (int) $manifiesto;

        $sqlm = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='TIM_CAR' AND numero_actual>=numero_inicial AND numero_actual<=numero_final");
        $sqlm->execute();
        $number1 = $sqlm->fetch(PDO::FETCH_ASSOC);
        $number2 = $number1['numero_actual'];

        try {
            $this->_db3->beginTransaction();

            $valor = str_replace(',', ' ', $num_orden);
            $datos = explode(' ', $valor);
            $sql_tiempo = $this->_db3->prepare("INSERT INTO cmx_tiempo_cargue(id,num_manifiesto,placa,fecha,hora,usuario,estado) VALUES(:id,:num_mnf,:placa,:fec_registro,:hor_registro,:user,:estado)")
                ->execute(array(':id' => $number2, ':num_mnf' => $manifiesto, ':fec_registro' => $factual, ':hor_registro' => $horactual, ':user' => $id_usuario, ':estado' => 1, ':placa' => $placa));
            if ($sql_tiempo) {
                $i = 0; //registrar ordenes
                for ($i = 0; $i < count($datos); $i++) {
                    $numero_orden = $datos[$i];
                    //fecha para ir a cargar
                    $sql_fecha1 = $this->_db3->prepare('INSERT INTO cmx_tiempo_cargue_ordenes (id,id_cargue,id_orden_cargue,fecha_cargue,hora_cargue,obs_cargue,tipo_fecha,fecha_registro,hora_registro,usuario,estado) VALUES(:id,:id_cargue,:id_orden,:fecha_ir_cargar,:hora_ir_cargar,:obs_ir,:clase,:fecregistro,:horaregistro,:user,:estado)')
                        ->execute(array(':id' => null, ':id_cargue' => $number2, ':id_orden' => $numero_orden, ':estado' => 1, ':fecha_ir_cargar' => $fllegcargar, ':hora_ir_cargar' => $hllegcargar, ':obs_ir' => 'NULL', ':clase' => 'fecha_ircargue', ':fecregistro' => $factual, ':horaregistro' => $horactual, ':user' => $id_usuario));
                    if ($sql_fecha1) {
                        $f1 = 1;
                        //fecha llegar a cargar
                        $sql_fecha2 = $this->_db3->prepare('INSERT INTO cmx_tiempo_cargue_ordenes (id,id_cargue,id_orden_cargue,fecha_cargue,hora_cargue,obs_cargue,tipo_fecha,fecha_registro,hora_registro,usuario,estado) VALUES(:id,:id_cargue,:id_orden,:fecha_lleg_cargar,:hora_lleg_cargar,:obs_lleg,:clase,:fecregistro,:horaregistro,:user,:estado)')
                            ->execute(array(':id' => null, ':id_cargue' => $number2, ':id_orden' => $numero_orden, ':estado' => 1, ':fecha_lleg_cargar' => $fllegcargar, ':hora_lleg_cargar' => $hllegcargar, ':obs_lleg' => 'NULL', ':clase' => 'fec_llegada', ':fecregistro' => $factual, ':horaregistro' => $horactual, ':user' => $id_usuario));
                        if ($sql_fecha2) {
                            $f2 = 1;
                            //fecha entrada a cargar
                            $sql_fecha3 = $this->_db3->prepare('INSERT INTO cmx_tiempo_cargue_ordenes (id,id_cargue,id_orden_cargue,fecha_cargue,hora_cargue,obs_cargue,tipo_fecha,fecha_registro,hora_registro,usuario,estado)VALUES(:id,:id_cargue,:id_orden,:fecha_ent_cargar,:hora_ent_cargar,:obs_entr,:clase,:fecregistro,:horaregistro,:user,:estado)')
                                ->execute(array(':id' => null, ':id_cargue' => $number2, ':id_orden' => $numero_orden, ':estado' => 1, ':fecha_ent_cargar' => $fentrocarga, ':hora_ent_cargar' => $hentrocarga, ':obs_entr' => 'NULL', ':clase' => 'fec_entrada', ':fecregistro' => $factual, ':horaregistro' => $horactual, ':user' => $id_usuario));
                            if ($sql_fecha3) {
                                $f3 = 1;
                                //fecha salida a cargar
                                //fecha entrada a cargar
                                $sql_fecha4 = $this->_db3->prepare('INSERT INTO cmx_tiempo_cargue_ordenes (id,id_cargue,id_orden_cargue,fecha_cargue,hora_cargue,obs_cargue,tipo_fecha,fecha_registro,hora_registro,usuario,estado)VALUES(:id,:id_cargue,:id_orden,:fecha_ent_sal,:hora_ent_sal,:obs_salida,:clase,:fecregistro,:horaregistro,:user,:estado)')
                                    ->execute(array(':id' => null, ':id_cargue' => $number2, ':id_orden' => $numero_orden, ':estado' => 1, ':fecha_ent_sal' => $fsalidacarga, ':hora_ent_sal' => $hsalidacarga, ':obs_salida' => 'NULL', ':clase' => 'fec_salida', ':fecregistro' => $factual, ':horaregistro' => $horactual, ':user' => $id_usuario));
                                if ($sql_fecha4) {
                                    $f4 = 1;
                                    //numero de salida
                                    $sqlm1 = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='SAL' AND numero_actual>=numero_inicial AND numero_actual<=numero_final");
                                    $sqlm1->execute();
                                    $numbersalida = $sqlm1->fetch(PDO::FETCH_ASSOC);
                                    $number3 = $numbersalida['numero_actual'];
                                    if ($number3) {
                                        //registro en tabla de salida
                                        $sql_salida = $this->_db3->prepare("INSERT INTO cmx_salida_vehiculo (id,num_manifiesto,placa,fecha_salida,hora_salida,usuario,fecha,hora,estado)VALUES(:id,:manifi,:placa,:fecha_salida,:hora_salida,:usuario,:fecha,:hora,:estado)")
                                            ->execute(array(':id' => $number3, ':manifi' => $manifiesto, ':placa' => $placa, ':fecha_salida' => $fsalidacarga, ':hora_salida' => $hsalidacarga, ':usuario' => $id_usuario, ':fecha' => $factual, ':hora' => $horactual, ':estado' => 1));
                                        if ($sql_salida) {
                                            //estado tabla de salida
                                            $sql_estado_salida = $this->_db3->prepare("INSERT INTO cmx_estado_salida_vehiculo(id,id_salida,estado,fecha,hora,usuario)VALUES(:id,:num_salida,:estado,:fecha,:hora,:user)")
                                                ->execute(array(':id' => $number3, ':num_salida' => $number3, ':estado' => 1, ':fecha' => $factual, ':hora' => $horactual, ':user' => $id_usuario));
                                            if ($sql_estado_salida) {
                                                $operacion_final = ($number3 + 1);
                                                $sql_update_maestro = $this->_db3->prepare('UPDATE cmx_maestro SET numero_actual=:numero WHERE tipo=:tipo')->execute(array(':numero' => $operacion_final, ':tipo' => 'SAL'));
                                                if ($sql_update_maestro) {
                                                    $sql_ordenes = $this->_db3->prepare('INSERT INTO cmx_cargue_ordenes (id,orden,manifiesto,f_ir,f_ent,f_lleg,f_sal,proceso)VALUES(:id,:orden,:manifi,:f_ir,:f_ent,:f_lleg,:f_sal,:proceso)')
                                                        ->execute(array(':id' => null, ':orden' => $numero_orden, ':manifi' => $manifiesto, ':f_ir' => $f1, ':f_ent' => $f2, ':f_lleg' => $f3, ':f_sal' => $f4, ':proceso' => 2));
                                                    if ($sql_ordenes) {
                                                        $operacion = ($number2 + 1);
                                                        $sql_update_maestro_1 = $this->_db3->prepare('update cmx_maestro set numero_actual=:numero where tipo=:tipo')->execute(array(':numero' => $operacion, ':tipo' => 'TIM_CAR'));
                                                        if ($sql_update_maestro_1) {
                                                            $this->_db3->commit();
                                                            $response = array(
                                                                'numero' => 200,
                                                                'mensaje' => 'Tiempos logisticos de cargue registrados exitosamente en el sistema',
                                                            );
                                                        } else {
                                                            $this->_db3->commit();
                                                            $response = array(
                                                                'numero' => 400,
                                                                'mensaje' => 'Tiempos logisticos de cargue no registrados en el sistema',
                                                            );
                                                        }
                                                    } else {
                                                        $mensajeError = "error al actualizar el maestro de salidas";
                                                        error_log($mensajeError . "\n", 3, "error_log.txt");
                                                    }
                                                } else {
                                                    $mensajeError = "No se pudo insertar la tabla estado salida";
                                                    error_log($mensajeError . "\n", 3, "error_log.txt");
                                                }
                                            } else {
                                                $mensajeError = "No se pudo insertar la tabla estado salida";
                                                error_log($mensajeError . "\n", 3, "error_log.txt");
                                            }
                                        } else {
                                            $mensajeError = "No se pudo insertar la tabla salida";
                                            error_log($mensajeError . "\n", 3, "error_log.txt");
                                        }
                                    } else {
                                        $mensajeError = "Error de consecutvo de salida";
                                        error_log($mensajeError . "\n", 3, "error_log.txt");
                                    }
                                } else {
                                    $f4 = 0;
                                    $mensajeError = "No se pudo insertar la fecha de salir al cargue";
                                    error_log($mensajeError . "\n", 3, "error_log.txt");
                                }
                            } else {
                                $f3 = 0;
                                $mensajeError = "No se pudo insertar la fecha de entrada al cargue";
                                error_log($mensajeError . "\n", 3, "error_log.txt");
                            }
                        } else {
                            $f2 = 0;
                            $mensajeError = "No se pudo insertar la fecha de llegar al cargue";
                            error_log($mensajeError . "\n", 3, "error_log.txt");
                        }
                    } else {
                        $f1 = 0;
                        $mensajeError = "No se pudo insertar la fecha de ir al cargue";
                        error_log($mensajeError . "\n", 3, "error_log.txt");
                    }
                }
            }
            return $response;
        } catch (Throwable $e) {
            $this->_db3->rollBack();
            echo $error = $e->getMessage();
            error_log($error . "\n", 3, "error_log.txt");
            // return 'false';
        }
    }

    public function Id_Principal($manifies)
    {
        try {
            $sql = "SELECT id FROM cmx_tiempo_cargue
			WHERE num_manifiesto=" . $manifies . "
			AND estado=1
			";
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetch();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    //CREAR-EDITAR TIEMPOS DE CARGUE
    public function Busqueda_Manifiesto()
    {
        try {
            $sql = "SELECT mn2.id, placa
			FROM cmx_manifiesto mn2
			WHERE mn2.id IN(
			SELECT mn.id
			FROM cmx_manifiesto mn
			INNER JOIN cmx_inicio_ruta i
			ON mn.id=i.num_manifiesto
			INNER JOIN cmx_manifiesto_remesa rm
			ON mn.id=rm.id_manifiesto
			INNER JOIN cmx_remesa_ordencargue oc
			ON rm.id_remesa=oc.id_remesa
			INNER JOIN cmx_tiempo_cargue_ordenes tc
			ON oc.id_orden_cargue=tc.id_orden_cargue
			AND tc.tipo_fecha IN('fecha_ircargue')
			WHERE mn.estadomnf_actual=1
			GROUP BY mn.id)";
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Datos_Manifiesto_a($mani)
    {
        try {
            $sql = "SELECT ma.id, ma.placa,
				mak.marca, colou.color, ve.anio_fabricacion,
				con.nombre AS conductor,
				con.numero_documento AS docconductor, con.celular,
				pro.nombre AS propietario, pro.apellido1,
				pro.apellido2,
				pro.numero_documento AS docpropietario
				FROM cmx_manifiesto ma
				INNER JOIN cmx_inicio_ruta i
				ON ma.id=i.num_manifiesto
				INNER JOIN cmx_vehiculos v
				ON ma.placa=v.placa
				INNER JOIN cmx_vehiculo2 ve
				ON v.id=ve.id_vehiculo
				INNER JOIN  cmx_rndc_vehiculos_marcas mak
				ON ve.marca=mak.id
				INNER JOIN cmx_rndc_vehiculos_color colou
				ON ve.color=colou.id
				INNER JOIN cmx_proveedores con
				ON ma.conductor_manifiesto=con.numero_documento
				INNER JOIN cmx_proveedores pro
				ON v.id_propietario=pro.id
				WHERE ma.id=" . $mani;
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetch();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            // $this->_db3->rollBack();
        }
    }

    public function Buscar_Ordenes($manifi, $fecha)
    {
        try {
            $fil;
            $anterior;
            if ($fecha == 'fec_entrada') {
                $fil = "v.f_ent=0 AND v.f_lleg=1 AND v.f_sal=0";
                $anterior = 'fec_llegada';
            }
            if ($fecha == 'fec_llegada') {
                $fil = "v.f_ent=0 AND v.f_lleg=0 AND v.f_sal=0";
                $anterior = 'fecha_ircargue';
            }
            if ($fecha == 'fec_salida') {
                $fil = "v.f_ent=1 AND v.f_lleg=1 AND v.f_sal=0";
                $anterior = 'fec_entrada';
            }

            $sql = "SELECT oca.id AS id_orden, a.id AS idrem,
			cli.nombre AS 'remite', clid.nombre AS 'destino',
			oca.mer_producto, oca.ca_pesocargue, tc.id_cargue,
			tc.tipo_fecha,tc.fecha_cargue, tc.hora_cargue
			FROM cmx_manifiesto mn
			INNER JOIN cmx_manifiesto_remesa rm
			ON mn.id=rm.id_manifiesto
			INNER JOIN cmx_remesa_ordencargue oc
			ON rm.id_remesa=oc.id_remesa
			-- AGREGAR REMESA
			INNER JOIN cmx_remesa a
			ON oc.id_remesa=a.id
			INNER JOIN cmx_destinatarios_ss rd
			ON a.id_destinatario=rd.id
			INNER JOIN cmx_remitente_destinatario clid
			ON rd.cliente=clid.id
			INNER JOIN cmx_orden_cargue oca
			ON oc.id_orden_cargue=oca.id
			INNER JOIN cmx_ruta_puntosentrega rr
			ON oca.id_remitente=rr.id
			INNER JOIN cmx_remitente_destinatario cli
			ON rr.cliente=cli.id
			INNER JOIN cmx_tiempo_cargue_ordenes tc
			ON oca.id=tc.id_orden_cargue
			AND tc.tipo_fecha='" . $anterior . "'
			INNER JOIN cmx_cargue_ordenes v
			ON oca.id=v.orden
			AND v.f_ir=1 AND $fil
			WHERE mn.id=" . $manifi;
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Insertar_Tiempos($manifi, $placa, $fecha_c, $hora_c, $obser, $num_ordenes, $id_cargue, $clase)
    {
        $resultado = $this->_db2->conectar();
        $factual = date('Y-m-d');
        $horactual = date('H:i:s');
        $id_usuario = $_SESSION["usuario"]["nom_usuario"];
        //santizar
        (int) $id_cargue;
        (int) $manifi;
        try {
            if ($clase == 'fec_entrada') {
                $fecor = 'f_ent';
                $var = 1;
            }
            if ($clase == 'fec_llegada') {
                $fecor = 'f_lleg';
                $var = 1;
            }
            if ($clase == 'fec_salida') {
                $fecor = 'f_sal';
            }

            $valor = str_replace(',', ' ', $num_ordenes);
            $datos = explode(' ', $valor);
            $i = 0;
            for ($i = 0; $i < count($datos); $i++) {
                $numero_orden = $datos[$i];
                $resultado->prepare('insert into cmx_tiempo_cargue_ordenes
				(id,id_cargue,id_orden_cargue,fecha_cargue,hora_cargue,obs_cargue,tipo_fecha,fecha_registro,hora_registro,usuario,estado)
				values(:idtb,:id_cargue,:num_orden,:fecha,:hora,:obs,:tipofec,:fecha_registra,:hora_registra,:user,:statu)')->execute(
                    array(
                        ':idtb' => null,
                        ':id_cargue' => $id_cargue,
                        ':num_orden' => $numero_orden,
                        ':fecha' => $fecha_c,
                        ':hora' => $hora_c,
                        ':obs' => $obser,
                        ':tipofec' => $clase,
                        ':fecha_registra' => $factual,
                        ':hora_registra' => $horactual,
                        ':user' => $id_usuario,
                        ':statu' => 1,
                    )
                );
                $resultado->prepare('update cmx_cargue_ordenes
					set ' . $fecor . '=1
					where
					orden=:numorden
					AND manifiesto=:manifi')->execute(
                    array(
                        ':numorden' => $numero_orden,
                        ':manifi' => $manifi,
                    )
                );

                $sql = $this->_db3->query("select COUNT(oc.id)AS numero FROM cmx_orden_cargue oc INNER JOIN cmx_remesa_ordencargue acr ON oc.id = acr.id_orden_cargue AND acr.estado = 1
	            INNER JOIN cmx_manifiesto_remesa mr ON acr.id_remesa = mr.id_remesa AND mr.estado = 1 WHERE id_manifiesto =" . $manifi);
                $row = $sql->fetch();

                $sql2 = $this->_db3->query("select  COUNT(id)AS numero FROM cmx_cargue_ordenes WHERE manifiesto =" . $manifi . " and f_sal = 1");
                $row2 = $sql2->fetch();

                if ($row == $row2) {
                    $var = 2;
                } else {
                    $var = 1;
                }

                $resultado->prepare('update cmx_cargue_ordenes
					set proceso = :var
					where
					manifiesto=:manifi')->execute(
                    array(
                        ':manifi' => $manifi,
                        ':var' => $var,

                    )
                );
            }
            return 'true';
        } catch (PDOExeption $e) {
            $error = $e->getMessage();
            // $this->_db2->rollBack();
            return 'false';
        }
    }

    public function Verificar_Tiempos_Logisticos($orden_cargue, $manifiesto)
    {
        $fecha_registro = date("Y-m-d");
        $sql = $this->_db3->prepare("SELECT fecha_cargue,hora_cargue,tipo_fecha FROM cmx_tiempo_cargue_ordenes tco 
        INNER JOIN cmx_tiempo_cargue tc ON tco.id_cargue=tc.id WHERE id_orden_cargue=:Orden_Cargue AND tc.num_manifiesto=:Manifiesto AND fecha_registro=:fecha_registro");
        $sql->bindParam(":Orden_Cargue", $orden_cargue);
        $sql->bindParam(":Manifiesto", $manifiesto);
        $sql->bindParam(":fecha_registro", $fecha_registro);
        $sql->execute();
        $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultados;
    }
}
