<?php
session_start();
class tiempo_descargue_crear2Model extends Model
{


    public function __construct()
    {
        parent::__construct();
    }


    public function Buscar_Remesas()
    {
        try {
            /*$sql="SELECT mn2.*
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
			INNER JOIN cmx_tiempo_descargue_rem tc
			ON oc.id_remesa=tc.id_remesa
			AND tc.tipo_fecha IN('fec_llegada')
			WHERE mn.estadomnf_actual=1
			GROUP BY mn.id)";*/

            $sql = "SELECT ma.id, ma.placa
			FROM cmx_descargue_remesas b
			INNER JOIN cmx_manifiesto ma
			ON b.manifiesto=ma.id
			WHERE 
			b.f_sal=0 AND b.f_ent=1 AND b.f_lleg=1
			AND b.proceso=1";
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Buscar_Datosmnf($manifi)
    {
        try {
            $sql = "SELECT ma.id, ma.placa,
				ve.marca, ve.color, ve.anio_fabricacion,
				con.nombre as conductor,
				con.apellido1 as conape1,
				con.apellido2 as conape2,
				con.numero_documento as docconductor, con.celular,
				pro.nombre as propietario, pro.apellido1,
				pro.apellido2,
				pro.numero_documento as docpropietario
				FROM cmx_manifiesto ma
				INNER JOIN cmx_inicio_ruta i ON ma.id=i.num_manifiesto
				INNER JOIN cmx_vehiculos v ON ma.placa=v.placa
				INNER JOIN cmx_vehiculo2 ve ON v.id=ve.id_vehiculo
				INNER JOIN cmx_proveedores con ON ma.conductor_manifiesto=con.numero_documento
				INNER JOIN cmx_proveedores pro ON v.id_propietario=pro.id
				WHERE ma.id=" . $manifi;
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetch();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }


    public function Buscar_Remesa_I($manifi, $fecha)
    {
        try {
            $fil;
            if ($fecha == 'fec_entrada') {
                $fil = "v.f_ent=0";
            }
            if ($fecha == 'fec_salida') {
                $fil = "v.f_ent=1 AND f_sal=0";
            }

            $sql = "SELECT oca.id AS id_orden, a.id AS idrem, 
			cli.nombre AS 'remite', clid.nombre AS 'destino',
			oca.mer_producto, oca.ca_pesocargue, tc.id_descargue
			FROM cmx_manifiesto mn
			INNER JOIN cmx_manifiesto_remesa rm
			ON mn.id=rm.id_manifiesto
			INNER JOIN cmx_remesa_ordencargue oc
			ON rm.id_remesa=oc.id_remesa
			-- AGREGAR REMESA
			INNER JOIN cmx_remesa a
			ON oc.id_remesa=a.id
			INNER JOIN cmx_ruta_puntosentrega rd
			ON a.id_destinatario=rd.id
			INNER JOIN cmx_remitente_destinatario clid
			ON rd.cliente=clid.id
			INNER JOIN cmx_orden_cargue oca
			ON oc.id_orden_cargue=oca.id
			INNER JOIN cmx_ruta_puntosentrega rr
			ON oca.id_remitente=rr.id
			INNER JOIN cmx_remitente_destinatario cli
			ON rr.cliente=cli.id
			INNER JOIN cmx_tiempo_descargue_rem tc
			ON a.id=tc.id_remesa
			AND tc.tipo_fecha='fec_llegada'
			INNER JOIN cmx_descargue_remesas v
			ON a.id=v.remesa
			AND v.f_lleg=1  AND " . $fil . "
			WHERE mn.id=" . $manifi;
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }


    public function Insertar_Tiempo($manifi, $placa, $fecha, $hora, $observa, $tipo_fecha, $idtabla, $remesas)
    {
        $resultado = $this->_db2->conectar();
        $factual = date('Y-m-d');
        $horactual = date('H:i:s');
        $id_usuario = $_SESSION["usuario"]["nom_usuario"];

        (int)$manifi;
        try {

            $valor = str_replace(',', ' ', $remesas);
            $datos = explode(' ', $valor);
            $i = 0;
            for ($i = 0; $i < count($datos); $i++) {
                $numero_rem = $datos[$i];
                $resultado->prepare("insert into cmx_tiempo_descargue_rem
					(id,id_descargue,id_remesa,fecha_descargue,hora_descargue,obs_descargue,tipo_fecha,fecha_registro,hora_registro,usuario,estado)values(:id,:idfk,:remi,:fechi,:hour,:observa,:clase,:fecreg,:horreg,:user,:estado)")->execute(
                    array(
                        ':id' => null,
                        ':idfk' => $idtabla,
                        ':remi' => $numero_rem,
                        ':fechi' => $fecha,
                        ':hour' => $hora,
                        ':observa' => $observa,
                        ':clase' => $tipo_fecha,
                        ':fecreg' => $factual,
                        ':horreg' => $horactual,
                        ':user' => $id_usuario,
                        ':estado' => 1

                    )
                );

                $resultado->prepare("insert into cmx_descargue_remesas
							(id,remesa,manifiesto,f_lleg)
							values(:id,:remesa,:mani,:tipo)")->execute(
                    array(
                        ':id' => null,
                        ':remesa' => $numero_rem,
                        ':mani' => $manifi,
                        ':tipo' => 1
                    )
                );
            }
            if ($resultado) {
                return 'true';
            } else {
                return 'false';
            }
        } catch (PDOExeption $e) {
            $error = $e->getMessage();
            $this->_db2->rollBack();
            return 'false';
        }
    }

    public function Insertar_Tiempo_Salida($manifi, $placa, $fecha, $hora, $observa, $tipo_fecha, $idtabla, $remesas)
    {
        $resultado = $this->_db2->conectar();
        $factual = date('Y-m-d');
        $horactual = date('H:i:s');
        $id_usuario = $_SESSION["usuario"]["nom_usuario"];
        //santizar
        (int) $manifi;
        try {
            if ($idtabla != '' && $idtabla != null) { //hay un número
                $number2 = $idtabla;
                $valor = str_replace(',', ' ', $remesas);
                $datos = explode(' ', $valor);
                $i = 0;
                for ($i = 0; $i < count($datos); $i++) {
                    $numero_rem = $datos[$i];
                    $resultado->prepare('insert into cmx_tiempo_descargue_rem
							(id,id_descargue,id_remesa,fecha_descargue,hora_descargue,obs_descargue,tipo_fecha,fecha_registro,hora_registro,usuario,estado)values(:id,:id_tabla,:id_reme,:fecd,:hord,:obsd,:clase,:fechareg,:horareg,:userreg,:statu)')->execute(
                        array(
                            ':id' => null,
                            ':id_tabla' => $number2,
                            ':id_reme' => $numero_rem,
                            ':fecd' => $fecha,
                            ':hord' => $hora,
                            ':obsd' => $observa,
                            ':clase' => 'fec_salida',
                            ':fechareg' => $factual,
                            ':horareg' => $horactual,
                            ':userreg' => $id_usuario,
                            ':statu' => 1
                        )
                    );

                    $resultado->prepare('update cmx_descargue_remesas
							set 
							f_sal=:fecha
							where remesa=:remesa
							AND manifiesto=:mnf')->execute(
                        array(
                            ':remesa' => $numero_rem,
                            ':mnf' => $manifi,
                            ':fecha' => 1
                        )
                    );


                    $sql = $this->_db3->query("select COUNT(re.id)AS numero FROM cmx_remesa re
	            INNER JOIN cmx_manifiesto_remesa mr ON re.id=mr.id_remesa AND mr.estado = 1 WHERE mr.id_manifiesto =" . $manifi);
                    $row = $sql->fetch();

                    $sql2 = $this->_db3->query("select  COUNT(id)AS numero FROM cmx_descargue_remesas WHERE manifiesto =" . $manifi . " and f_sal = 1");
                    $row2 = $sql2->fetch();
                    if ($row == $row2) {
                        $var = 2;
                    } else {
                        $var = 1;
                    }

                    $resultado->prepare('update cmx_descargue_remesas
				set 
				proceso = :var
				where 
				manifiesto=:mnf')->execute(
                        array(
                            ':mnf' => $manifi,
                            ':var' => $var

                        )
                    );
                }
                if ($resultado) {
                    return 'true';
                } else {
                    return 'false';
                }
            } else { //No hay número
                $sqlm = "select numero_actual from cmx_maestro 
						where tipo='TIM_DESCAR' and numero_actual>=numero_inicial
						and numero_actual<=numero_final";
                $number = $resultado->query($sqlm);
                $number1 = $number->fetch();
                $number2 = $number1['numero_actual'];

                $valor = str_replace(',', ' ', $remesas);
                $datos = explode(' ', $valor);

                $resultado->prepare("insert into cmx_tiempo_descargue
					(id,num_manifiesto,placa,fecha,hora,usuario,estado)
					values(:id,:mani,:plak,:fecha,:hora,:user,:statu)")->execute(
                    array(
                        ':id' => $number2,
                        ':mani' => $manifi,
                        ':plak' => $placa,
                        ':fecha' => $factual,
                        ':hora' => $horactual,
                        ':user' => $id_usuario,
                        ':statu' => 1
                    )
                );

                if ($resultado) {
                    $i = 0;
                    for ($i = 0; $i < count($datos); $i++) {
                        $numero_rem = $datos[$i];
                        $resultado->prepare('insert into cmx_tiempo_descargue_rem
							(id,id_descargue,id_remesa,fecha_descargue,hora_descargue,obs_descargue,tipo_fecha,fecha_registro,hora_registro,usuario,estado)values(:id,:id_tabla,:id_reme,:fecd,:hord,:obsd,:clase,:fechareg,:horareg,:userreg,:statu)')->execute(
                            array(
                                ':id' => null,
                                ':id_tabla' => $number2,
                                ':id_reme' => $numero_rem,
                                ':fecd' => $fecha,
                                ':hord' => $hora,
                                ':obsd' => $observa,
                                ':clase' => 'fec_salida',
                                ':fechareg' => $factual,
                                ':horareg' => $horactual,
                                ':userreg' => $id_usuario,
                                ':statu' => 1
                            )
                        );
                        $resultado->prepare('update cmx_descargue_remesas
							set 
							f_sal=:fecha
							where remesa=:remesa
							AND manifiesto=:mnf')->execute(
                            array(
                                ':id' => null,
                                ':remesa' => $numero_rem,
                                ':mnf' => $manifi,
                                ':fecha' => 1
                            )
                        );
                    }
                }
                $operacion = ($number2 + 1);
                $resultado->prepare('update cmx_maestro set 
						numero_actual=:numero
						where tipo=:tipo')->execute(
                    array(
                        ':numero' => $operacion,
                        ':tipo' => 'TIM_DESCAR'
                    )
                );
                return 'true';
            }
        } catch (PDOExeption $e) {
            $error = $e->getMessage();
            $this->_db2->rollBack();
            return 'false';
        }
    }
}
