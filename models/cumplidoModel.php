<?php

class cumplidoModel extends Model
{
    public function __construct()
    {
        parent::__construct();
    }

    public function Consulta_Manifiesto()
    {
        try {
            /*$sql = "SELECT DISTINCT a.manifiesto,
				ma.id, ma.placa, ma.num_autorizacion
				FROM cmx_descargue_remesas a
				INNER JOIN cmx_manifiesto ma
				ON a.manifiesto=ma.id AND ma.estadomnf_actual=1
				LEFT JOIN cmx_cumplido cum
				ON ma.id=cum.manifiesto -- AND cum.estado=1
				WHERE a.proceso=2 AND a.f_sal=1
				AND ma.estado_seguimiento='FINALIZADO'";*/
            $sql = "SELECT DISTINCT a.manifiesto,
				ma.id, ma.placa, ma.num_autorizacion, ma.fecha_expedicion
				FROM cmx_descargue_remesas a
				INNER JOIN cmx_manifiesto ma
				ON a.manifiesto=ma.id AND ma.estadomnf_actual=1
				LEFT JOIN cmx_cumplido cum
				ON ma.id=cum.manifiesto -- AND cum.estado=1
				WHERE a.proceso=2 AND a.f_sal=1
				AND ma.estado_seguimiento='FINALIZADO'
				/* AND ma.fecha_expedicion >= '2024-08-01' */
				AND ma.num_autorizacion!=''";
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (Exception $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Datos_Manifiesto($idmanifi)
    {
        try {
            $sql = "SELECT ma.id, ma.fecha_expedicion,
				ma.tipo_manifiesto, ma.placa,
				m1.municipio as ori, m2.municipio as dest,
				pose.nombre nameposeedor,
				pose.apellido1 as poseape1,
				pose.apellido2 as poseape2,
				pose.numero_documento docposeedor,
				pro.nombre namepropi,
				pro.apellido1 as proape1,
				pro.apellido2 as proape2,
				pro.numero_documento docpropi,
				condu.nombre nameconduc,
				condu.apellido1 as conduape1,
				condu.apellido2 as conduape2,
				condu.numero_documento docucondu,
				ma.lugar,ma.fecha_pago
				FROM cmx_manifiesto ma
				INNER JOIN cmx_municipios m1
				ON ma.origen_viaje=m1.id
				INNER JOIN cmx_municipios m2
				ON ma.destino_viaje=m2.id
				INNER JOIN cmx_vehiculos ve
				ON ma.placa=ve.placa
				INNER JOIN cmx_proveedores pose
				ON ve.id_tenedor=pose.numdoc_nexos
				INNER JOIN cmx_proveedores pro
				ON ve.id_propietario=pro.numdoc_nexos
				INNER JOIN cmx_proveedores condu
				ON ve.id_conductor=condu.numdoc_nexos
				WHERE ma.id=" . $idmanifi;
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetch();
        } catch (Exception $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Remesa_Cumplido($idmanifi)
    {
        try {
            $sql = "SELECT tee.id_remesa, tee.fecha_descargue, tee.hora_descargue,
			tee.obs_descargue, tee.tipo_fecha
			FROM
			cmx_manifiesto ma
			INNER JOIN
			cmx_tiempo_descargue td
			ON ma.id=td.num_manifiesto
			INNER JOIN cmx_tiempo_descargue_rem tee
			ON td.id=tee.id_descargue
			WHERE ma.id=" . $idmanifi . "
			ORDER BY tee.id_remesa";
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (Exception $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Ordenes_Cumplido($idmanifi)
    {
        try {
            $sql = "SELECT too.id_orden_cargue, too.fecha_cargue,
			too.hora_cargue, too.obs_cargue, too.tipo_fecha
			FROM
			cmx_manifiesto ma
			INNER JOIN cmx_tiempo_cargue b
			ON ma.id=b.num_manifiesto
			INNER JOIN cmx_tiempo_cargue_ordenes too
			ON b.id=too.id_cargue
			WHERE ma.id=" . $idmanifi . "
			ORDER BY too.id_orden_cargue";
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (Exception $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Insertar_cumplido($manifi, $placa, $cantim, $tarim, $valorm, $remesa, $nove)
    {
        $resultado = $this->_db2->conectar();
        $resultadoo = $this->_db2->conectar();
        $factual = date('Y-m-d');
        $horactual = date('H:i:s');
        $id_usuario = $_SESSION["usuario"]["nom_usuario"];
        (int) $manifi;
        (int) $cantim;
        $_msg_error = "";

        try {
            $empresa_id = $_SESSION['usuario']['empresa_id'];
            $sqlm = "select numero_actual from cmx_maestro where tipo='CUM' and numero_actual>=numero_inicial and numero_actual<=numero_final and empresa_id='" . $empresa_id . "'";
            $number = $resultado->query($sqlm);
            $number1 = $number->fetch();
            $number2 = $number1['numero_actual'];
            $operacion = ($number2 + 1);
            $resultado->prepare('update cmx_maestro set numero_actual=:numero where tipo=:tipo and empresa_id=:empresa_id')->execute(array(':numero' => $operacion, ':tipo' => 'CUM', ':empresa_id' => '' . $empresa_id . ''));

            $resultado->prepare("insert into cmx_cumplido
					(id,manifiesto,placa,cantidad_multa,tarifa_multa,valor_multa,novedad,fecha,hora,usuario,estado)
					values(:id,:manifi,:pk,:canti,:tarifa,:valor,:nove,:fecharegistro,:horaregistro,:user,:statu)")->execute(
                array(
                    ':id' => $number2,
                    ':manifi' => $manifi,
                    ':pk' => $placa,
                    ':canti' => $cantim,
                    ':tarifa' => $tarim,
                    ':valor' => $valorm,
                    ':nove' => $nove,
                    ':fecharegistro' => $factual,
                    ':horaregistro' => $horactual,
                    ':user' => $id_usuario,
                    ':statu' => 1,
                )
            );
            if ($resultado) {
                $u = 0;
                while ($u < count($remesa->idremesa)) {
                    $idremesa = $remesa->idremesa[$u];
                    $fecha_rem = $remesa->fecha[$u];
                    $hora_rem = $remesa->hora[$u];
                    $observa_rem = $remesa->obs[$u];
                    $clase_fecha = $remesa->tipo[$u];

                    $resultado->prepare("insert into cmx_cumplido_remesa
					(id,id_cumplido,id_remesa,fecha,hora,observacion,tipo_fecha,fecha_reg,hora_reg,usuario,estado)
					values(:id,:idforaneo,:remesa,:fechades,:horades,:observades,:tfechades,:fecharegistro,:horaregistro,:user,:satu)")->execute(
                        array(
                            ':id' => null,
                            ':idforaneo' => $number2,
                            ':remesa' => $idremesa,
                            ':fechades' => $fecha_rem,
                            ':horades' => $hora_rem,
                            ':observades' => $observa_rem,
                            ':tfechades' => $clase_fecha,
                            ':fecharegistro' => $factual,
                            ':horaregistro' => $horactual,
                            ':user' => $id_usuario,
                            ':satu' => 1,
                        )
                    );
                    $u++;
                }

                /* Actualizar el estado en la tabla se manifiestos */
                $sql = $this->_db3->prepare("UPDATE cmx_manifiesto SET estado_seguimiento='CUMPLIDO' WHERE id=:manifiesto");
                $sql->bindParam(":manifiesto", $manifi);
                $sql->execute();
            }

            if ($resultado) {
                $return["status"] = true;
                $return["numero_documento"] = $number2;
                $return["error"] = $_msg_error;
                return $return;
            } else {
                $_msg_error = "Error";
                $return["status"] = false;
                $return["numero_documento"] = "";
                $return["error"] = $_msg_error;
                return $return;
            }
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
            return 'false';
        }
    }

    public function Buscar_Tabla($filtro, $num, $fec1, $fec2)
    {
        try {
            if ($filtro == 1) {
                $donde = 'manifiesto = :num';
            } elseif ($filtro == 2) {
                $donde = 'fecha BETWEEN :fec1 AND :fec2';
            } else {
                throw new Exception("Filtro no válido");
            }

            $sql = "SELECT id, manifiesto, placa, estado 
                FROM cmx_cumplido 
                WHERE $donde";

            $stmt = $this->_db3->prepare($sql);

            if ($filtro == 1) {
                $stmt->bindParam(':num', $num, PDO::PARAM_INT);
            } elseif ($filtro == 2) {
                $stmt->bindParam(':fec1', $fec1);
                $stmt->bindParam(':fec2', $fec2);
            }

            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return [
                "total" => count($rows), // contador
                "data"  => $rows
            ];
        } catch (Exception $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
            return ["error" => $error];
        }
    }


    public function Consulta_Cumplido($numma)
    {
        try {
            $sql = "SELECT cu.id, ma.id AS manifiesto, cu.placa, ma.conductor_manifiesto,
			cu.novedad, concat(con.nombre,'',con.apellido1,'',con.apellido2) AS conductor,
			con.numero_documento AS doccondu,
			CONCAT(pro.nombre,'',pro.apellido1,'',pro.apellido2) AS propietaro,
			pro.numero_documento AS docprop,
			CONCAT(ten .nombre,'',ten.apellido1,'',ten.apellido2) AS tenedor,
			ten.numero_documento AS docte
			FROM cmx_manifiesto ma
			INNER JOIN cmx_manifiesto_remesa mre ON ma.id=mre.id_manifiesto
			INNER JOIN cmx_cumplido cu ON ma.id=cu.manifiesto
			INNER JOIN cmx_vehiculos ve ON cu.placa=ve.placa
			INNER JOIN cmx_proveedores con ON ma.conductor_manifiesto=con.numero_documento
			INNER JOIN cmx_proveedores pro ON ve.id_propietario=pro.numdoc_nexos
			INNER JOIN cmx_proveedores ten ON ve.id_tenedor=ten.numdoc_nexos
			WHERE ma.id=" . $numma;
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetch();
        } catch (Exception $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Consulta_Remesas($numcu)
    {
        try {
            $sql = "SELECT cr.id_remesa, cr.fecha, cr.hora,cr.observacion, cr.tipo_fecha FROM cmx_cumplido_remesa cr
            INNER JOIN cmx_cumplido c ON cr.id_cumplido=c.id
			WHERE c.manifiesto=$numcu GROUP BY id_remesa";
            // WHERE id_cumplido=$numcu GROUP BY id_remesa";
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (Exception $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Revertir_cumplido($numcu)
    {
        $resultado = $this->_db2->conectar();
        $factual = date('Y-m-d');
        $horactual = date('H:i:s');
        $id_usuario = $_SESSION["usuario"]["nom_usuario"];
        (int) $numcu;
        try {

            $resultado->prepare("update cmx_cumplido
				set estado=:estad
				where id=:idcumplido
			")->execute(
                array(
                    ':estad' => 0,
                    ':idcumplido' => $numcu,
                )
            );
            return 'true';
            // } catch (PDOExeption $e) {
        } catch (Exception $e) {
            $error = $e->getMessage();
            // $this->_db2->rollBack();
            return 'false';
        }
    }

    public function CumplidoConsultar($idcumplido)
    {
        // $resultado = $this->_db2->conectar();
        (int) $idcumplido;
        try {
            $sql = $this->_db3->prepare("SELECT cu.id, cu.placa,
			cu.manifiesto, cu.valor_multa,
			pro.nombre namepro,
            IFNULL(pro.apellido1,'') AS proape1,
            IFNULL(pro.apellido2,'') AS proape2,
			pro.numero_documento docprop,
			pro.tipo_documento,
			te.nombre namete,
			te.apellido1 AS teape1,
			te.apellido2 AS teape2,
			te.numero_documento docte,
			con.nombre namecondu,
			con.apellido1 AS conape1,
			con.apellido2 AS conape2,
			con.numero_documento doccondu,
			con.celular AS celular_condu,
			cu.novedad, cu.cantidad_multa,
			cu.manifiesto,
			ma.marca, veh.anio_fabricacion,
			m1.municipio AS 'origen',
			m2.municipio AS 'destino',
			mnf.total_peso, mnf.total_volumen,DATE_ADD(mnf.fecha_expedicion, INTERVAL 15 DAY) AS nueva_fecha,
            cu.fecha AS fecha_cumplido
			FROM cmx_cumplido cu
			INNER JOIN cmx_vehiculos ve ON cu.placa=ve.placa
			INNER JOIN cmx_proveedores pro ON ve.id_propietario=pro.numdoc_nexos
			INNER JOIN cmx_proveedores te ON ve.id_tenedor=te.numdoc_nexos
			INNER JOIN cmx_proveedores con ON ve.id_conductor=con.numdoc_nexos
			INNER JOIN cmx_vehiculo2 veh ON ve.numdoc_vehiculo=veh.id_vehiculo
			INNER JOIN cmx_rndc_vehiculos_marcas ma ON veh.marca=ma.id
			INNER JOIN cmx_manifiesto mnf ON cu.manifiesto=mnf.id
			INNER JOIN cmx_municipios m1 ON mnf.origen_viaje=m1.id
			INNER JOIN cmx_municipios m2 ON mnf.destino_viaje=m2.id
			WHERE cu.id=" . $idcumplido);
            $sql->execute();
            $result = $sql->fetch(PDO::FETCH_ASSOC);

            return $result;
            // $resultado = $this->_db3->query($sql);
            // $resultado->setFetchMode(PDO::FETCH_ASSOC);
            // var_dump($resultado);
            // exit(0);

            // return $resultado->fetch();
        } catch (Exception $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Consulta_Cumplido_Cu($id)
    {
        try {
            $sql = "SELECT ma.origen_viaje, ma.destino_viaje,ma.id AS 'Numero_manifiesto' FROM cmx_manifiesto ma
            WHERE ma.id=" . $id;

            // $sql = "SELECT cu.*, ma.origen_viaje, ma.destino_viaje,ma.id AS 'Numero_manifiesto' FROM cmx_cumplido cu 
            // INNER JOIN cmx_manifiesto ma ON cu.manifiesto=ma.id
            // WHERE cu.manifiesto=" . $id;
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetch();
        } catch (Exception $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }


    public function Consulta_Cumplido_forrndc($numma)
    {
        try {
            $sql = "SELECT ma.id AS manifiesto, re.id AS idremesa, re.cantidad_real_cargada, 
			re2.fecha_descargue AS 'fecha_llegada', re2.hora_descargue AS 'hora_llegada',
			re3.fecha_descargue AS 'fecha_entrada', re3.hora_descargue AS 'hora_entrada',
			re4.fecha_descargue AS 'fecha_salida', re4.hora_descargue AS 'hora_salida',
			re.cantidad_real_cargada,
			ta.fecha_cargue AS 'fec_ca_lleg', ta.hora_cargue AS 'fec_ca_hor', 
			ta1.fecha_cargue AS 'fec_ca_ent', ta1.hora_cargue AS 'fec_ent_hor', 
			ta2.fecha_cargue AS 'fec_ca_sal', ta2.hora_cargue AS 'fec_sal_hor',
            ma.origen_viaje,ma.destino_viaje
			FROM cmx_manifiesto ma
			INNER JOIN cmx_manifiesto_remesa mre ON ma.id=mre.id_manifiesto
			INNER JOIN cmx_remesa re  ON mre.id_remesa=re.id
			INNER JOIN cmx_remesa_ordencargue ro ON re.id=ro.id_remesa
			INNER JOIN cmx_tiempo_cargue_ordenes ta ON ro.id_orden_cargue=ta.id_orden_cargue AND ta.tipo_fecha='fec_llegada'
			INNER JOIN cmx_tiempo_cargue_ordenes ta1 ON ro.id_orden_cargue=ta1.id_orden_cargue AND ta1.tipo_fecha='fec_entrada'
			INNER JOIN cmx_tiempo_cargue_ordenes ta2 ON ro.id_orden_cargue=ta2.id_orden_cargue AND ta2.tipo_fecha='fec_salida'
			INNER JOIN cmx_tiempo_descargue_rem re2 ON re.id=re2.id_remesa AND re2.tipo_fecha='fec_llegada'
			INNER JOIN cmx_tiempo_descargue_rem re3 ON re.id=re3.id_remesa AND re3.tipo_fecha='fec_entrada'
			INNER JOIN cmx_tiempo_descargue_rem re4 ON re.id=re4.id_remesa AND re4.tipo_fecha='fec_salida'
			WHERE ma.id=$numma GROUP BY re.id";
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (Exception $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }
}
