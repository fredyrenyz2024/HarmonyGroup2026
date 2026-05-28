<?php
//session_start();
class tiempo_descargueModel extends Model
{

    //3202926926
    public function __construct()
    {
        parent::__construct();
    }

    public function Mani_ordenes_pendientes()
    {
        try {
            $sql = "SELECT DISTINCT  ma.id, ma.placa, i.id AS salida
			FROM cmx_salida_vehiculo s
			INNER JOIN cmx_manifiesto ma ON s.num_manifiesto=ma.id
			INNER JOIN cmx_inicio_ruta i ON ma.id=i.num_manifiesto
			INNER JOIN cmx_manifiesto_remesa r ON ma.id = r.id_manifiesto AND r.estado = 1
			LEFT JOIN cmx_llegada_vehiculo ll ON s.num_manifiesto = ll.num_manifiesto
			LEFT JOIN cmx_tiempo_descargue_rem td ON r.id_remesa = td.id_remesa
			WHERE td.id_remesa IS NULL";
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function DatosManifiesto($idmnf)
    {
        try {
            $sql = "SELECT ma.id, ma.placa,
				ve.marca, ve.color, ve.anio_fabricacion,
				con.nombre as conductor, con.apellido1, con.apellido2,
				con.numero_documento as docconductor, con.celular,
				pro.nombre as propietario, pro.numero_documento as docpropietario
				FROM cmx_manifiesto ma
				INNER JOIN cmx_inicio_ruta i ON ma.id=i.num_manifiesto
				INNER JOIN cmx_vehiculos v ON ma.placa=v.placa
				INNER JOIN cmx_vehiculo2 ve ON v.id=ve.id_vehiculo
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

    public function Buscar_remesa($numnani, $remesa)
    {
        try {
            $sql = "CALL INFORMACION_ORDEN_DESCARGUE($numnani,$remesa)";
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Insertar_Tiempos(
        $manifiesto,
        $placa,
        $tipofechallega,
        $fllegcargar,
        $hllegcargar,
        $obserllego,
        $tipofechaentro,
        $fentrocarga,
        $hentrocarga,
        $obsentro,
        $tipofechasali,
        $fsalidacarga,
        $hsalidacarga,
        $obssalio,
        $num_remesa
    ) {
        $factual = date('Y-m-d');
        $horactual = date('H:i:s');
        $id_usuario = $_SESSION["usuario"]["nom_usuario"];

        // Consulta de la última fecha y hora de salida registrada
        // $sql_fecha_Salida = $this->_db3->prepare("SELECT tco.fecha_cargue AS fecha, tco.hora_cargue AS hora FROM cmx_tiempo_cargue tc 
        //     INNER JOIN cmx_tiempo_cargue_ordenes tco ON tc.id=tco.id_cargue
        //     WHERE tco.tipo_fecha = 'fec_salida' AND tc.num_manifiesto = :num_mani
        //     ORDER BY tco.fecha_cargue DESC, tco.hora_cargue DESC LIMIT 1");

        // var_dump($sql_fecha_Salida);


        // $sql_fecha_Salida = $this->_db3->prepare("    SELECT tipo_fecha, fecha_cargue, hora_cargue
        // FROM (
        //     SELECT 
        //         tco.tipo_fecha,
        //         tco.fecha_cargue,
        //         tco.hora_cargue,
        //         ROW_NUMBER() OVER (
        //             PARTITION BY tco.tipo_fecha 
        //             ORDER BY tco.fecha_cargue DESC, tco.hora_cargue DESC
        //         ) AS rn
        //     FROM cmx_tiempo_cargue tc
        //     INNER JOIN cmx_tiempo_cargue_ordenes tco ON tc.id = tco.id_cargue
        //     WHERE tco.tipo_fecha IN ('fec_salida','fec_llegada','fec_entrada')
        //     AND tc.num_manifiesto = :num_mani
        // ) sub
        // WHERE rn = 1");


        // $sql_fecha_Salida->bindParam(':num_mani', $manifiesto, PDO::PARAM_INT);
        // $sql_fecha_Salida->execute();
        // $fecha_Salida = $sql_fecha_Salida->fetchAll(PDO::FETCH_ASSOC);

        // print_r($fecha_Salida);
        // exit();

        // if ($fecha_Salida) {
        //     $fecha_llegada = $fllegcargar;   // viene de tu POST / variable
        //     $hora_llegada  = $hllegcargar;

        //     // Comparar fecha y hora completas
        //     if ($fecha_Salida['fecha'] === $fecha_llegada && $fecha_Salida['hora'] === $hora_llegada) {
        //         return [
        //             'numero'  => 400,
        //             'mensaje' => ' La fecha y hora de llegada no pueden ser iguales a la última fecha y hora de salida de cargue.',
        //         ];
        //     }

        //     // Comparar solo horas (si las fechas son diferentes pero la hora coincide)
        //     if ($fecha_Salida['hora'] === $hora_llegada) {
        //         return [
        //             'numero'  => 401,
        //             'mensaje' => 'La hora de llegada no puede ser igual a la última hora de salida',
        //         ];
        //     }
        // }

        $sql = $this->_db3->prepare("
            SELECT tipo_fecha, fecha_cargue, hora_cargue
            FROM (
                SELECT 
                    tco.tipo_fecha,
                    tco.fecha_cargue,
                    tco.hora_cargue,
                    ROW_NUMBER() OVER (
                        PARTITION BY tco.tipo_fecha 
                        ORDER BY tco.fecha_cargue DESC, tco.hora_cargue DESC
                    ) AS rn
                FROM cmx_tiempo_cargue tc
                INNER JOIN cmx_tiempo_cargue_ordenes tco ON tc.id = tco.id_cargue
                WHERE tco.tipo_fecha IN ('fec_salida','fec_llegada','fec_entrada')
                AND tc.num_manifiesto = :num_mani
            ) sub
            WHERE rn = 1");
        $sql->bindParam(':num_mani', $manifiesto, PDO::PARAM_INT);
        $sql->execute();
        $ultimos = $sql->fetchAll(PDO::FETCH_ASSOC);

        // Mapeamos todas las últimas fechas y horas
        $ultimosData = [];
        foreach ($ultimos as $row) {
            $ultimosData[] = [
                'tipo'  => $row['tipo_fecha'],
                'fecha' => $row['fecha_cargue'],
                'hora'  => $row['hora_cargue']
            ];
        }

        // Variables nuevas (POST)
        $nuevos = [
            ['tipo' => 'fec_llegada', 'fecha' => $fllegcargar, 'hora' => $hllegcargar],
            ['tipo' => 'fec_entrada', 'fecha' => $fentrocarga, 'hora' => $hentrocarga],
            ['tipo' => 'fec_salida',  'fecha' => $fsalidacarga, 'hora' => $hsalidacarga],
        ];

        // Mapeo de nombres para mostrar al usuario
        $labels = [
            'fec_llegada' => 'Fecha Llegada',
            'fec_salida'  => 'Fecha Salida',
            'fec_entrada' => 'Fecha Entrada'
        ];

        $errores = [];

        foreach ($nuevos as $nuevo) {
            foreach ($ultimosData as $ult) {
                $labelNuevo = $labels[$nuevo['tipo']] ?? $nuevo['tipo'];
                $labelUlt   = $labels[$ult['tipo']] ?? $ult['tipo'];

                // Comparar fecha y hora
                if ($ult['fecha'] === $nuevo['fecha'] && $ult['hora'] === $nuevo['hora']) {
                    $errores[] = " La <b>$labelNuevo Descargue</b> es igual a la última registrada de <b>$labelUlt Cargue</b> ({$ult['fecha']} {$ult['hora']}).";
                }
                // Comparar solo hora
                elseif ($ult['hora'] === $nuevo['hora']) {
                    $errores[] = " La hora de <b>$labelNuevo Descargue</b> es igual a la última registrada de <b>$labelUlt Cargue</b> ({$ult['hora']}).";
                }
            }
        }

        if (!empty($errores)) {
            return [
                'numero'  => 400,
                'mensaje' => implode("<br>", $errores)
            ];
        }

        //
        $sqlm = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='TIM_DESCAR' AND numero_actual>=numero_inicial AND numero_actual<=numero_final");
        $sqlm->execute();
        $number1 = $sqlm->fetch(PDO::FETCH_ASSOC);
        $number2 = $number1['numero_actual'];
        try {
            $this->_db3->beginTransaction();

            $valor = str_replace(',', ' ', $num_remesa);
            $datos = explode(' ', $valor);

            $sql_tiempo = $this->_db3->prepare("INSERT INTO cmx_tiempo_descargue (id,num_manifiesto,placa,fecha,hora,usuario,estado) VALUES(:id,:mani,:plak,:fecha,:hora,:user,:statu)")
                ->execute(array(':id' => $number2, ':mani' => $manifiesto, ':plak' => $placa, ':fecha' => $factual, ':hora' => $horactual, ':user' => $id_usuario, ':statu' => 1));

            if ($sql_tiempo) {
                $i = 0;
                // $f1; // $f2;// $f3;
                for ($i = 0; $i < count($datos); $i++) {
                    $numero_rem = $datos[$i];
                    //registro de fecha de llegada a descargue
                    $sql_fecha1 = $this->_db3->prepare("INSERT INTO cmx_tiempo_descargue_rem(id,id_descargue,id_remesa,fecha_descargue,hora_descargue,obs_descargue,tipo_fecha,fecha_registro,hora_registro,usuario,estado)
							VALUES(:id,:id_tabla,:id_reme,:fechacapturada,:horacapturada,:observacion,:tipofecha,:fecregistro,:horaregistro,:user,:estado)")
                        ->execute(array(':id' => null, ':id_tabla' => $number2, ':id_reme' => $numero_rem, ':fechacapturada' => $fllegcargar, ':horacapturada' => $hllegcargar, ':observacion' => $obserllego, ':tipofecha' => 'fec_llegada', ':fecregistro' => $factual, ':horaregistro' => $horactual, ':user' => $id_usuario, ':estado' => 1));
                    if ($sql_fecha1) {
                        $f1 = 1;
                        //registro de fecha entrada al descargue
                        $sql_fecha2 = $this->_db3->prepare("INSERT INTO cmx_tiempo_descargue_rem(id,id_descargue,id_remesa,fecha_descargue,hora_descargue,obs_descargue,tipo_fecha,fecha_registro,hora_registro,usuario,estado)
                                VALUES(:id,:id_tabla,:id_reme,:fechacapturada,:horacapturada,:observacion,:tipofecha,:fecregistro,:horaregistro,:user,:estado)")
                            ->execute(array(':id' => null, ':id_tabla' => $number2, ':id_reme' => $numero_rem, ':fechacapturada' => $fentrocarga, ':horacapturada' => $hentrocarga, ':observacion' => $obsentro, ':tipofecha' => 'fec_entrada', ':fecregistro' => $factual, ':horaregistro' => $horactual, ':user' => $id_usuario, ':estado' => 1));
                        if ($sql_fecha2) {
                            $f2 = 1;
                            //registro de fecha de salida del descargue
                            $sql_fecha3 = $this->_db3->prepare("INSERT INTO cmx_tiempo_descargue_rem(id,id_descargue,id_remesa,fecha_descargue,hora_descargue,obs_descargue,tipo_fecha,fecha_registro,hora_registro,usuario,estado)
                                    VALUES(:id,:id_tabla,:id_reme,:fechacapturada,:horacapturada,:observacion,:tipofecha,:fecregistro,:horaregistro,:user,:estado)")
                                ->execute(array(':id' => null, ':id_tabla' => $number2, ':id_reme' => $numero_rem, ':fechacapturada' => $fsalidacarga, ':horacapturada' => $hsalidacarga, ':observacion' => $obssalio, ':tipofecha' => 'fec_salida', ':fecregistro' => $factual, ':horaregistro' => $horactual, ':user' => $id_usuario, ':estado' => 1));
                            if ($sql_fecha3) {
                                $f3 = 1;
                                $sql_descargue_remesa = $this->_db3->prepare('INSERT INTO cmx_descargue_remesas (id,remesa,manifiesto,f_ent,f_lleg,f_sal,proceso) VALUES(:id,:remesa,:mnf,:f1,:f2,:f3,:proceso)')
                                    ->execute(array(':id' => null, ':remesa' => $numero_rem, ':mnf' => $manifiesto, ':f1' => $f1, ':f2' => $f2, ':f3' => $f3, ':proceso' => 2));
                                if ($sql_descargue_remesa) {
                                    $operacion = ($number2 + 1);
                                    $sql_update_maestro = $this->_db3->prepare('UPDATE cmx_maestro SET numero_actual=:numero WHERE tipo=:tipo')->execute(array(':numero' => $operacion, ':tipo' => 'TIM_DESCAR'));
                                    if ($sql_update_maestro) {
                                        $this->_db3->commit();
                                        $response = array(
                                            'numero' => 200,
                                            'mensaje' => 'Tiempos logisticos de descargue registrados exitosamente en el sistema',
                                        );
                                    } else {
                                        $this->_db3->commit();
                                        $response = array(
                                            'numero' => 400,
                                            'mensaje' => 'Tiempos logisticos de descargue no registrados en el sistema',
                                        );
                                    }
                                } else {
                                    $mensajeError = "No se pudo insertar la en descargue remesas";
                                    error_log($mensajeError . "\n", 3, "error_log.txt");
                                }
                            } else {
                                $f3 = 0;
                                $mensajeError = "No se pudo insertar la fecha de entrada al descargue";
                                error_log($mensajeError . "\n", 3, "error_log.txt");
                            }
                        } else {
                            $f2 = 0;
                            $mensajeError = "No se pudo insertar la fecha de llegar al descargue";
                            error_log($mensajeError . "\n", 3, "error_log.txt");
                        }
                    } else {
                        $f1 = 0;
                        $mensajeError = "No se pudo insertar la fecha de ir al descargue";
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

    public function Buscar_Idprincipal($manifies)
    {
        try {
            $sql = "SELECT id FROM cmx_tiempo_descargue
				WHERE num_manifiesto=" . $manifies;
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetch();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Verificar_Tiempos_Logisticos($remesa)
    {
        $fecha_registro = date("Y-m-d");
        $sql = $this->_db3->prepare("SELECT fecha_descargue,hora_descargue,tipo_fecha FROM cmx_tiempo_descargue_rem WHERE id_remesa=:Remesa AND fecha_registro=:fecha_registro");
        $sql->bindParam(":Remesa", $remesa);
        $sql->bindParam(":fecha_registro", $fecha_registro);
        $sql->execute();
        $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultados;
    }
}
