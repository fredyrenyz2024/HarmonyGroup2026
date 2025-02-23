<?php
session_start();
class manifiesteModel extends Model
{
    public function __construct()
    {
        parent::__construct();
    }

    public function getPruebas()
    {
        $sql = "";
        $result = $this->_db->getConsulta($sql);
        return $result;
    }

    public function Consultar_ambientes()
    {
        $user_id = $_SESSION['usuario']['id_usuario'];
        $empresa_id = $_SESSION['usuario']['empresa_id'];

        $sql_empresa_usuario = $this->_db3->prepare("SELECT eu.empresa_id FROM cmx_usuarios u 
        INNER JOIN cmx_empresa_usuario eu ON u.id=eu.usuario_id 
        WHERE eu.usuario_id=:usuario_id AND eu.empresa_id=:empresa_id");
        $sql_empresa_usuario->bindParam(':usuario_id', $user_id);
        $sql_empresa_usuario->bindParam(':empresa_id', $empresa_id);
        $sql_empresa_usuario->execute();
        $resultado_empresa_id = $sql_empresa_usuario->fetch(PDO::FETCH_ASSOC);

        if ($resultado_empresa_id) {
            $sql = $this->_db3->prepare("SELECT ab.nombre_ambiente,ep.nombre_empresa,ep.id AS empresa_id FROM cmx_empresas ep
			INNER JOIN cmx_ambiente ab ON ep.id=ab.empresa_id WHERE ep.id=:empresa_id");
            $sql->bindParam(':empresa_id', $resultado_empresa_id['empresa_id']);
            $sql->execute();
            $resultado = $sql->fetch(PDO::FETCH_ASSOC);
            return $resultado;
        } else {
            $mensajeError = 'Error al consultar el codigo de la agencia';
            error_log($mensajeError, 3, "error_log.txt");
        }
    }

    public function consulte_munipios($id_vehi)
    {
        // try {
        //     $fechah = date('Y-m-d');
        //     $sqlr = "SELECT ori.id AS idorigen,ori.* FROM cmx_remesa re
        // 	INNER JOIN cmx_remesa_ordencargue roc ON re.id=roc.id_remesa AND roc.estado=1
        // 	LEFT JOIN cmx_orden_cargue o ON roc.id_orden_cargue=o.id
        // 	LEFT JOIN cmx_ruta_puntosentrega remitente ON  o.mer_idservicio=remitente.cod_ini_ruta
        // 	LEFT JOIN cmx_remitente_destinatario rem ON remitente.cliente=rem.id
        // 	LEFT JOIN cmx_municipios ori ON rem.id_ciudad=ori.id
        // 	LEFT JOIN cmx_vehiculos ve ON o.ve_idcarro=ve.numdoc_vehiculo
        // 	WHERE o.ve_idcarro=" . $id_vehi . " AND re.fecha_creacion='" . $fechah . "'";
        //     $resultado = $this->_db3->query($sqlr);
        //     $resultado->setFetchMode(PDO::FETCH_ASSOC);
        //     $result = $resultado->fetchall();
        //     return $result;
        // } catch (PDOException $e) {
        //     $error = $e->getMessage();
        //     $this->_db3->rollBack();
        // }

        try {
            $fechah = date('Y-m-d');
            $sqlr = "SELECT ori.id AS idorigen,ori.*
        	FROM cmx_remesa re
        	INNER JOIN cmx_remesa_ordencargue roc ON re.id=roc.id_remesa AND roc.estado=1 AND re.fecha_creacion='" . $fechah . "'
        	INNER JOIN cmx_orden_cargue o ON roc.id_orden_cargue=o.id
        	INNER JOIN cmx_ruta_puntosentrega remitente ON  o.mer_idservicio=remitente.cod_ini_ruta
        	INNER JOIN cmx_remitente_destinatario rem ON remitente.cliente=rem.id
        	INNER JOIN cmx_municipios ori ON rem.id_ciudad=ori.id
        	INNER JOIN cmx_vehiculos ve ON o.ve_idcarro=ve.numdoc_vehiculo
        	WHERE o.ve_idcarro IN(" . $id_vehi . ")";
            $resultado = $this->_db3->query($sqlr);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            $result = $resultado->fetchall();
            return $result;
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function consulte_destino($id_vehi)
    {
        try {
            $fechah = date('Y-m-d');
            $sqlr = "SELECT dest.id AS iddestino,dest.*
        	FROM cmx_remesa re
        	INNER JOIN cmx_remesa_ordencargue roc
        	ON re.id=roc.id_remesa
        	AND roc.estado=1
        	AND re.fecha_creacion='" . $fechah . "'
        	INNER JOIN cmx_orden_cargue o
        	ON roc.id_orden_cargue=o.id
        	INNER JOIN cmx_ruta_puntosentrega remitente
        	ON  o.mer_idservicio=remitente.cod_ini_ruta
        	AND remitente.tipo='punto recogida'
        	INNER JOIN cmx_destinatarios_ss destinat
        	ON o.mer_idservicio=destinat.solicitud_servicio
        	AND remitente.id_punto=destinat.id_punto
        	INNER JOIN cmx_remitente_destinatario rd
        	ON destinat.cliente=rd.id
        	INNER JOIN cmx_municipios dest
        	ON destinat.municipio_entrega=dest.id
        	WHERE
        	o.ve_idcarro IN(" . $id_vehi . ")
        	GROUP BY re.id, dest.rndc_codigo_ciudad";
            $resultado = $this->_db3->query($sqlr);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }

        // try {
        //     $fechah = date('Y-m-d');
        //     $sqlr = "SELECT dest.id AS iddestino,dest.*
        // 	FROM cmx_remesa re
        // 	INNER JOIN cmx_remesa_ordencargue roc
        // 	ON re.id=roc.id_remesa AND roc.estado=1
        // 	INNER JOIN cmx_orden_cargue o
        // 	ON roc.id_orden_cargue=o.id
        // 	INNER JOIN cmx_ruta_puntosentrega remitente
        // 	ON  o.mer_idservicio=remitente.cod_ini_ruta
        // 	AND remitente.tipo='punto recogida'
        // 	INNER JOIN cmx_destinatarios_ss destinat
        // 	ON o.mer_idservicio=destinat.solicitud_servicio
        // 	AND remitente.id_punto=destinat.id_punto
        // 	INNER JOIN cmx_remitente_destinatario rd
        // 	ON destinat.cliente=rd.id
        // 	INNER JOIN cmx_municipios dest
        // 	ON destinat.municipio_entrega=dest.id
        // 	WHERE o.ve_idcarro=" . $id_vehi . " AND re.fecha_creacion='" . $fechah . "' GROUP BY re.id, dest.rndc_codigo_ciudad";
        //     $resultado = $this->_db3->query($sqlr);
        //     $resultado->setFetchMode(PDO::FETCH_ASSOC);
        //     return $resultado->fetchall();
        // } catch (PDOException $e) {
        //     $error = $e->getMessage();
        //     $this->_db3->rollBack();
        // }
    }

    public function consulte_remesas()
    {
        try {
            $fecha = date('Y-m-d');

            $sql3 = "SELECT r.*, r.id as idremesa, o.id, ve.placa, se.nundoc_solicitud AS servicio, ve.numdoc_vehiculo as id_vehiculo,dt.itr
			FROM cmx_remesa r
			INNER JOIN cmx_remesa_ordencargue ro ON  r.id=ro.id_remesa
			INNER JOIN cmx_orden_cargue o ON ro.id_orden_cargue=o.id
			INNER JOIN cmx_solicitud_vehiculo2 se ON o.mer_idservicio=se.nundoc_solicitud
			INNER JOIN cmx_vehiculos ve ON o.ve_idcarro=ve.numdoc_vehiculo
            INNER JOIN cmx_detalle_mercancia2 dt ON se.idpareja_origen_destino=dt.id 
			WHERE r.fecha_creacion='" . $fecha . "'
			AND r.estado=1 AND r.estado_manifiesto='pendiente' GROUP BY ve.placa";
            $resultado = $this->_db3->query($sql3);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function consulte_conductor_vehiculo($vehiculo)
    {
        // try {
        //     $fechah = date('Y-m-d');
        //     $sql3 = "SELECT co.nombre AS nomconductor,
        // 	co.apellido1 AS coape1, co.apellido2 AS coape2,
        // 	co.numero_documento, co.direccion, co.celular,
        // 	mn.municipio, co.rndc_numero_licencia,
        // 	ve.placa,ma.marca, ve2.configuracion, conf.nombre, ve2.peso,
        // 	ase.nombre AS aseguradora, ve2.capacidad_tn,
        // 	ve2.vence_soat, ve2.num_soat, tra.placa AS placa_trailer,
        // 	ten.nombre AS nomtenedor,
        // 	ten.apellido1, ten.apellido2,
        // 	ten.numero_documento AS numtenedor,
        // 	ten.direccion AS tendireccion,
        // 	ten.celular AS tencelular,
        // 	mnt.municipio AS tenmunicipio,
        // 	max(o.ve_fletepactado) AS ve_fletepactado,
        // 	age.nombre AS nomagencia,
        // 	conf.nombre AS confletra,
        // 	ve2.tipo_vinculacion
        // 	FROM cmx_remesa r
        // 	INNER JOIN cmx_remesa_ordencargue ro
        // 	ON  r.id=ro.id_remesa
        // 	AND ro.estado=1

        // 	INNER JOIN cmx_orden_cargue o ON ro.id_orden_cargue=o.id
        // 	INNER JOIN cmx_solicitud_vehiculo2 se ON o.mer_idservicio=se.nundoc_solicitud
        // 	INNER JOIN cmx_agencias age ON se.agencia=age.id
        // 	INNER JOIN cmx_vehiculos ve ON o.ve_idcarro=ve.numdoc_vehiculo
        // 	INNER JOIN cmx_vehiculo2 ve2 ON o.ve_idcarro=ve2.id_vehiculo
        // 	INNER JOIN cmx_proveedores co ON ve.id_conductor=co.numdoc_nexos
        // 	INNER JOIN cmx_municipios mn ON co.id_municipio=mn.id
        // 	INNER JOIN cmx_rndc_vehiculos_configuracion conf ON ve2.configuracion=conf.id
        // 	INNER JOIN cmx_rndc_vehiculos_marcas ma ON ve2.marca=ma.id
        // 	INNER JOIN cmx_rndc_aseguradoras ase ON ve2.aseguradora=ase.id
        // 	INNER JOIN cmx_proveedores ten ON ve.id_tenedor=ten.numdoc_nexos
        // 	INNER JOIN cmx_municipios mnt ON ten.id_municipio=mnt.id
        // 	LEFT JOIN cmx_trailer_vehiculo tve ON ve.numdoc_vehiculo=tve.id_vehiculo AND tve.estado=1
        // 	LEFT JOIN cmx_trailer tra ON tve.id_trailer=tra.numdoc_trailer
        // 	WHERE o.ve_idcarro=" . $vehiculo . " AND r.fecha_creacion='" . $fechah . "'";
        //     $resultado = $this->_db3->query($sql3);
        //     $resultado->setFetchMode(PDO::FETCH_ASSOC);
        //     return $resultado->fetch();
        // } catch (PDOException $e) {
        //     $error = $e->getMessage();
        //     $this->_db3->rollBack();
        // }

        try {
            $fechah = date('Y-m-d');
            $sql3 = "SELECT co.nombre AS nomconductor,
        	co.apellido1 AS coape1, co.apellido2 AS coape2,
        	co.numero_documento, co.direccion, co.celular,
        	mn.municipio, co.rndc_numero_licencia,
        	ve.placa,ma.marca, ve2.configuracion, conf.nombre, ve2.peso,
        	ase.nombre AS aseguradora, ve2.capacidad_tn,
        	ve2.vence_soat, ve2.num_soat, tra.placa AS placa_trailer,
        	ten.nombre AS nomtenedor,
        	ten.apellido1, ten.apellido2,
        	ten.numero_documento AS numtenedor,
        	ten.direccion AS tendireccion,
        	ten.celular AS tencelular,
        	mnt.municipio AS tenmunicipio,
        	max(o.ve_fletepactado) AS ve_fletepactado,
        	age.nombre AS nomagencia,
        	conf.nombre AS confletra,
        	ve2.tipo_vinculacion,o.id
        	FROM cmx_remesa r
        	INNER JOIN cmx_remesa_ordencargue ro ON  r.id=ro.id_remesa AND ro.estado=1 AND r.fecha_creacion='" . $fechah . "' AND r.estado_manifiesto='pendiente'
        	INNER JOIN cmx_orden_cargue o ON ro.id_orden_cargue=o.id
        	INNER JOIN cmx_solicitud_vehiculo2 se ON o.mer_idservicio=se.nundoc_solicitud
        	INNER JOIN cmx_agencias age ON se.agencia=age.id
        	INNER JOIN cmx_vehiculos ve ON o.ve_idcarro=ve.numdoc_vehiculo
        	INNER JOIN cmx_vehiculo2 ve2 ON o.ve_idcarro=ve2.id_vehiculo
        	INNER JOIN cmx_proveedores co ON ve.id_conductor=co.numdoc_nexos
        	INNER JOIN cmx_municipios mn ON co.id_municipio=mn.id
        	LEFT JOIN cmx_trailer_vehiculo tve ON ve.numdoc_vehiculo=tve.id_vehiculo AND tve.estado=1
        	LEFT JOIN cmx_trailer tra ON tve.id_trailer=tra.numdoc_trailer
        	INNER JOIN cmx_rndc_vehiculos_configuracion conf ON ve2.configuracion=conf.id
        	INNER JOIN cmx_rndc_vehiculos_marcas ma ON ve2.marca=ma.id
        	INNER JOIN cmx_rndc_aseguradoras ase ON ve2.aseguradora=ase.id
        	INNER JOIN cmx_proveedores ten ON ve.id_tenedor=ten.numdoc_nexos
        	INNER JOIN cmx_municipios mnt ON ten.id_municipio=mnt.id
        	WHERE o.ve_idcarro IN(" . $vehiculo . ")";
            $resultado = $this->_db3->query($sql3);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetch();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function consulta_tabla_remesa($vehiculo)
    {
        try {
            $fechah = date('Y-m-d');
            $sql = "SELECT r.id, r.cantidad_real_cargada,d.tipo_servicio_mer, d.cantidad_empaque,d.naturaleza, d.tipo_mercancia,te.empaque, co.nombre_cliente,
        	rd.nombre AS nomdest, rd.documento AS docdest,
        	de.nombre AS nomrem, de.documento AS docrem, CONCAT(mnori.municipio,'-',mnori.depto) AS origen_rem, CONCAT(mn.municipio,'-',mn.depto) AS destino_rem, o.mer_volumen,d.itr,
            mnori.rndc_codigo_ciudad AS codigo_origen,mn.rndc_codigo_ciudad AS codigo_destino
        	FROM cmx_remesa r
        	INNER JOIN cmx_remesa_ordencargue ro ON r.id=ro.id_remesa AND ro.estado=1 AND r.fecha_creacion='" . $fechah . "' AND r.estado_manifiesto='pendiente'
        	INNER JOIN cmx_orden_cargue o ON ro.id_orden_cargue=o.id
        	INNER JOIN cmx_solicitud_vehiculo2 se ON o.mer_idservicio=se.nundoc_solicitud
        	INNER JOIN cmx_ruta_puntosentrega m ON o.id_remitente=m.id
        	INNER JOIN cmx_remitente_destinatario rd ON m.cliente=rd.id
        	INNER JOIN cmx_municipios mnori ON rd.id_ciudad=mnori.id
        	INNER JOIN cmx_destinatarios_ss desti ON se.nundoc_solicitud=desti.solicitud_servicio AND m.id_punto=desti.id_punto
        	INNER JOIN cmx_remitente_destinatario de ON desti.cliente=de.id
        	INNER JOIN cmx_municipios mn ON desti.municipio_entrega=mn.id
        	INNER JOIN cmx_detalle_mercancia2 d ON se.idpareja_origen_destino=d.id
        	INNER JOIN cmx_para_tipo_empaque te ON te.id=d.tipo_empaque
        	INNER JOIN cmx_cotizaciones_serviciocliente co ON d.n_cotizacion=co.n_cotizacion
        	WHERE o.ve_idcarro IN(" . $vehiculo . ") GROUP BY r.id";
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function consulta_configuracion_vehiculo($vehiculo_id)
    {
        try {
            $fechah = date('Y-m-d');
            $sql = "SELECT g.nombre FROM cmx_vehiculos v
            INNER JOIN cmx_vehiculo2 v2 ON v.numdoc_vehiculo=v2.id_vehiculo
            INNER JOIN cmx_detalle_vehiculo dv ON v.numdoc_vehiculo=dv.id_vehiculo
            INNER JOIN cmx_rndc_vehiculos_configuracion g ON v2.configuracion=g.id
            WHERE v.numdoc_vehiculo=" . $vehiculo_id . " GROUP BY v.placa";
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetch();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function consulta_por_anticipo()
    {
        try {
            $sql = "SELECT valor FROM cmx_para_porcentaje_anticipo
				  WHERE estado=1";
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    // public function Insertar_manifiesto(
    //     $placa,
    //     $fecha_expe,
    //     $tipo_mnf,
    //     $origen,
    //     $destino,
    //     $posee_num,
    //     $condu_identifi,
    //     $tot_viaje,
    //     $v_rete,
    //     $v_reteica,
    //     $v_neto,
    //     $saldo,
    //     $agencia_manifiesto,
    //     $fec_pago,
    //     $cargue,
    //     $descargue,
    //     $obs,
    //     $r_anti,
    //     $porcentaje,
    //     $valor,
    //     $metodo,
    //     $total_peso,
    //     $total_volumen,
    //     $rem,
    //     $manitr
    // ) {
    //     // $resultado = $this->_db2->conectar();
    //     // $resultadoa = $this->_db2->conectar();
    //     // $resultadom = $this->_db2->conectar();
    //     $factual = date('Y-m-d');
    //     $horactual = date('H:i:s');
    //     $id_usuario = $_SESSION["usuario"]["nom_usuario"];
    //     $_msg_error = "";
    //     //santizar
    //     (int) $posee_num;
    //     (int) $condu_identifi;
    //     (int) $r_anti;
    //     (float) $tot_viaje;
    //     (float) $v_rete;
    //     (float) $v_reteica;
    //     (float) $v_neto;
    //     (float) $saldo;

    //     try {

    //         $empresa_id = $_SESSION['usuario']['empresa_id'];
    //             $sqlm = $this->_db3->prepare(" SELECT numero_actual FROM cmx_maestro  WHERE tipo = :tipo AND numero_actual >= numero_inicial AND numero_actual <= numero_final AND empresa_id = :empresa_id");

    //                 // Asignar valores a los placeholders
    //                 $tipo = 'MNF';
    //                 $sqlm->bindValue(':tipo', $tipo);
    //                 $sqlm->bindValue(':empresa_id', $empresa_id);
    //             // Ejecutar la consulta
    //             $sqlm->execute();

    //             // Obtener el resultado
    //             $number1 = $sqlm->fetch(PDO::FETCH_ASSOC);

    //         if ($number1) {
    //             // Calcular el nuevo número
    //             $number2 = $number1['numero_actual'];
    //             $operacion = $number2 + 1;

    //             // Prepara la consulta de actualización
    //             $sqlupdate = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual = :numero WHERE tipo = :tipo  AND empresa_id = :empresa_id");>
    //             // Ejecutar la consulta con los valores
    //             $sqlupdate->execute([
    //                 ':numero' => $operacion,
    //                 ':tipo' => $tipo,
    //                 ':empresa_id' => $empresa_id
    //             ]);

    //         }

    //         //tabla principal
    //         $resultadom->prepare("insert into cmx_manifiesto(id,placa,fecha_expedicion,tipo_manifiesto,origen_viaje,destino_viaje,titular_manifiesto,conductor_manifiesto,valor_total_viaje,retencion_fuente,rete_ica,neto_pagar,saldo,Lugar,fecha_pago,cargue_pagado,descargue_pagado,observacion,anticipo_reque,estadomnf_actual,estadoant_actual,hora_expedicion,total_peso,total_volumen,empresa_id,manifiesto_itr) 
    //         values(:num_mnf,:placam,:expedicion,:tipo_mnf,:origen,:destino,:titular,:condu,:valor_viaje,:retefuente,:reteica,:neto,:saldo,:place,:f_pago,:cargue,:descargue,:obsn,:requiere_anticipo,:status_mnf,:status_anti,:hora_expe,:totpeso,:totvolumen,:empresa_id,:manifiesto_itr)")->execute(
    //             array(
    //                 ':num_mnf' => $number2,
    //                 ':placam' => $placa,
    //                 ':expedicion' => $fecha_expe,
    //                 ':tipo_mnf' => $tipo_mnf,
    //                 ':origen' => $origen,
    //                 ':destino' => $destino,
    //                 ':titular' => $posee_num,
    //                 ':condu' => $condu_identifi,
    //                 ':valor_viaje' => $tot_viaje,
    //                 ':retefuente' => $v_rete,
    //                 ':reteica' => $v_reteica,
    //                 ':neto' => $v_neto,
    //                 ':saldo' => $saldo,
    //                 ':place' => $agencia_manifiesto,
    //                 ':f_pago' => $fec_pago,
    //                 ':cargue' => $cargue,
    //                 ':descargue' => $descargue,
    //                 ':obsn' => $obs,
    //                 ':requiere_anticipo' => $r_anti,
    //                 ':status_mnf' => '1', //guardado
    //                 ':status_anti' => '1', //guardado
    //                 ':hora_expe' => $horactual,
    //                 ':totpeso' => $total_peso,
    //                 ':totvolumen' => $total_volumen,
    //                 ':empresa_id' => $empresa_id,
    //                 ':manifiesto_itr' =>  $manitr,
    //             )
    //         );

    //         if ($resultadom) { //si registro manifiesto
    //             //registrar manifiesto remesa
    //             $m = 0;
    //             while ($m < count($rem->id_remesa)) {
    //                 $estado_mnf = 'completado';
    //                 $numremesa = $rem->id_remesa[$m];
    //                 $resultado->prepare("insert into cmx_manifiesto_remesa
    // 					(id,id_manifiesto,id_remesa,fecha,hora,usuario,estado) values(null,:id_mnf,:id_rem,:fecha,:hour,:user,:status)")->execute(
    //                     array(
    //                         ':id_mnf' => $number2,
    //                         ':id_rem' => $numremesa,
    //                         ':fecha' => $factual,
    //                         ':hour' => $horactual,
    //                         ':user' => $id_usuario,
    //                         ':status' => 1,
    //                     )
    //                 );
    //                 if ($resultado) { //actualizacion de remesa
    //                     $resultado->prepare("update cmx_remesa set estado_manifiesto=:estado_manifiesto where id=:remesa")->execute(
    //                         array(
    //                             ':estado_manifiesto' => $estado_mnf,
    //                             ':remesa' => $numremesa
    //                         )
    //                     );
    //                 }
    //                 $m++;
    //             }

    //             //registro de estado del manifiesto
    //             $resultado->prepare("insert into cmx_manifiesto_estado
    // 				(id,id_manifiesto,estado,fecha,hora,usuario)
    // 				values(null,:id_mnf,:status,:fecha,:hour,:user)")->execute(
    //                 array(
    //                     ':id_mnf' => $number2,
    //                     ':status' => 1,
    //                     ':fecha' => $factual,
    //                     ':hour' => $horactual,
    //                     ':user' => $id_usuario,
    //                 )
    //             );
    //         }

    //         //si registro manifiesto y requiere anticipo
    //         if ($resultadom && $r_anti == 1) {

    //             $resultadoa->prepare("insert into cmx_manifiesto_anticipo
    // 				(id,beneficiario,porcentaje,valor_anticipo,metodo_desembolso,id_manifiesto)
    // 				values(:id,:bene,:porcentaj,:valor,:metodo,:id_mnf)")->execute(array(
    //                 ':id' => null,
    //                 ':bene' => $condu_identifi,
    //                 ':porcentaj' => $porcentaje,
    //                 ':valor' => $valor,
    //                 ':metodo' => $metodo,
    //                 ':id_mnf' => $number2,
    //             ));

    //             //
    //             if ($resultadoa) {
    //                 $sqlanti = "select MAX(id) AS id_anticipo FROM cmx_manifiesto_anticipo
    // 					where id_manifiesto=" . $number2;
    //                 $num = $resultado->query($sqlanti);
    //                 $id1 = $num->fetch();
    //                 $numero_anticipo = $id1['id_anticipo'];
    //                 if ($numero_anticipo) {
    //                     $estad = 1;
    //                     $resultado->prepare("insert into cmx_estado_mnf_anticipo(id,id_anticipo,id_manifiesto,estado,fecha,hora,usuario)
    // 						values(null,:num_anti,:id_mnf,:statu,:fecha,:hora,:user)")->execute(
    //                         array(
    //                             ':num_anti' => $numero_anticipo,
    //                             ':id_mnf' => $number2,
    //                             ':statu' => $estad,
    //                             ':fecha' => $factual,
    //                             ':hora' => $horactual,
    //                             ':user' => $id_usuario,
    //                         )
    //                     );
    //                 }
    //             }
    //         }

    //         if ($resultado && $resultadoa && $resultadom) {
    //             $return["status"] = true;
    //             $return["numero_documento"] = $number2;
    //             $return["error"] = $_msg_error;
    //             return $return;
    //         } else {
    //             $_msg_error = "Error";
    //             $return["status"] = false;
    //             $return["numero_documento"] = "";
    //             $return["error"] = $_msg_error;
    //             return $return;
    //         }
    //     } catch (PDOException $e) {
    //         $error = $e->getMessage();
    //         $this->_db3->rollBack();
    //         return 'false';
    //     }
    // }

    public function Insertar_manifiesto(
        $placa,
        $fecha_expe,
        $tipo_mnf,
        $origen,
        $destino,
        $posee_num,
        $condu_identifi,
        $tot_viaje,
        $v_rete,
        $v_reteica,
        $v_neto,
        $saldo,
        $agencia_manifiesto,
        $fec_pago,
        $cargue,
        $descargue,
        $obs,
        $r_anti,
        $porcentaje,
        $valor,
        $metodo,
        $total_peso,
        $total_volumen,
        $rem,
        $manitr
    ) {
        $factual = date('Y-m-d');
        $horactual = date('H:i:s');
        $id_usuario = $_SESSION["usuario"]["nom_usuario"];
        $empresa_id = $_SESSION['usuario']['empresa_id'];
        $_msg_error = "";

        try {
            // Inicia la transacción
            $this->_db3->beginTransaction();

            // 1. Obtener el número actual del manifiesto
            $sqlm = $this->_db3->prepare(" SELECT numero_actual FROM cmx_maestro WHERE tipo = :tipo  AND numero_actual >= numero_inicial  AND numero_actual <= numero_final AND empresa_id = :empresa_id");
            $sqlm->execute([
                ':tipo' => 'MNF',
                ':empresa_id' => $empresa_id,
            ]);
            $number1 = $sqlm->fetch(PDO::FETCH_ASSOC);

            if (!$number1) {
                throw new Exception("No se encontró un número actual disponible.");
            }

            $number2 = $number1['numero_actual'];
            $operacion = $number2 + 1;

            // 2. Actualizar el número actual en cmx_maestro
            $sqlupdate = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual = :numero  WHERE tipo = :tipo AND empresa_id = :empresa_id");
            $sqlupdate->execute([
                ':numero' => $operacion,
                ':tipo' => 'MNF',
                ':empresa_id' => $empresa_id,
            ]);

            // 3. Insertar el manifiesto en cmx_manifiesto
            $sqlInsertManifiesto = $this->_db3->prepare("
                INSERT INTO cmx_manifiesto (
                    id, placa, fecha_expedicion, tipo_manifiesto, origen_viaje, destino_viaje, 
                    titular_manifiesto, conductor_manifiesto, valor_total_viaje, retencion_fuente, 
                    rete_ica, neto_pagar, saldo, Lugar, fecha_pago, cargue_pagado, 
                    descargue_pagado, observacion, anticipo_reque, estadomnf_actual, estadoant_actual, 
                    hora_expedicion, total_peso, total_volumen, empresa_id, manifiesto_itr
                ) VALUES (
                    :num_mnf, :placa, :fecha_expedicion, :tipo_mnf, :origen, :destino, 
                    :titular, :conductor, :valor_total, :retencion_fuente, :rete_ica, 
                    :neto_pagar, :saldo, :Lugar, :fecha_pago, :cargue_pagado, :descargue_pagado, 
                    :observacion, :anticipo_reque, :estadomnf_actual, :estadoant_actual, 
                    :hora_expedicion, :total_peso, :total_volumen, :empresa_id, :manifiesto_itr
                )
            ");
            $sqlInsertManifiesto->execute([
                ':num_mnf' => $number2,
                ':placa' => $placa,
                ':fecha_expedicion' => $fecha_expe,
                ':tipo_mnf' => $tipo_mnf,
                ':origen' => $origen,
                ':destino' => $destino,
                ':titular' => $posee_num,
                ':conductor' => $condu_identifi,
                ':valor_total' => $tot_viaje,
                ':retencion_fuente' => $v_rete,
                ':rete_ica' => $v_reteica,
                ':neto_pagar' => $v_neto,
                ':saldo' => $saldo,
                ':Lugar' => $agencia_manifiesto,
                ':fecha_pago' => $fec_pago,
                ':cargue_pagado' => $cargue,
                ':descargue_pagado' => $descargue,
                ':observacion' => $obs,
                ':anticipo_reque' => $r_anti,
                ':estadomnf_actual' => 1,
                ':estadoant_actual' => 1,
                ':hora_expedicion' => $horactual,
                ':total_peso' => $total_peso,
                ':total_volumen' => $total_volumen,
                ':empresa_id' => $empresa_id,
                ':manifiesto_itr' => $manitr,
            ]);

            // 4. Insertar manifiesto-remesa
            foreach ($rem->id_remesa as $numremesa) {
                $sqlManifiestoRemesa = $this->_db3->prepare("INSERT INTO cmx_manifiesto_remesa (id, id_manifiesto, id_remesa, fecha, hora, usuario, estado) 
                VALUES (null, :id_manifiesto, :id_remesa, :fecha, :hora, :usuario, :estado)");
                $sqlManifiestoRemesa->execute([
                    ':id_manifiesto' => $number2,
                    ':id_remesa' => $numremesa,
                    ':fecha' => $factual,
                    ':hora' => $horactual,
                    ':usuario' => $id_usuario,
                    ':estado' => 1,
                ]);
            }

            // Finalizar transacción
            $this->_db3->commit();

            return [
                'status' => true,
                'numero_documento' => $number2,
                'error' => $_msg_error,
            ];
        } catch (Exception $e) {
            $this->_db3->rollBack();
            return [
                'status' => false,
                'numero_documento' => null,
                'error' => $e->getMessage(),
            ];
        }
    }

    // public function consulta_manifiestos($finicia, $ffinal)
    // {
    //     try {
    //         $sql = "SELECT mnf.id, mnf.placa, mnf.conductor_manifiesto,
    // 		mnf.tipo_manifiesto, mnf.observacion,
    // 		mnf.estadomnf_actual, mnf.estadoant_actual, cu.estado AS cumplido
    // 		FROM cmx_manifiesto mnf
    // 		INNER JOIN cmx_manifiesto_estado mnfe
    // 		ON mnf.id=mnfe.id_manifiesto
    //         LEFT JOIN cmx_cumplido cu
    //         ON mnf.id=cu.manifiesto
    // 		WHERE mnfe.estado=1 AND  mnf.estadomnf_actual=1
    // 		AND mnfe.fecha
    // 		BETWEEN '" . $finicia . "' AND '" . $ffinal . "'";

    //         $sql_total_manifiesto = "SELECT COUNT(*) AS total_manifiestos
    // 		FROM cmx_manifiesto mnf
    // 		INNER JOIN cmx_manifiesto_estado mnfe
    // 		ON mnf.id=mnfe.id_manifiesto
    //         LEFT JOIN cmx_cumplido cu
    //         ON mnf.id=cu.manifiesto
    // 		WHERE mnfe.estado=1 AND  mnf.estadomnf_actual=1
    // 		AND mnfe.fecha
    // 		BETWEEN '" . $finicia . "' AND '" . $ffinal . "'";
    //         $response = [
    //             'manifiestos' => $this->_db3->query($sql)->fetchAll(),
    //             'total_manifiestos' => $this->_db3->query($sql_total_manifiesto)->fetch()['total_manifiestos'],
    //         ];
    //         return $response;
    //     } catch (PDOException $e) {
    //         $error = $e->getMessage();
    //         $this->_db3->rollBack();
    //     }
    // }

    public function consulta_manifiestos($finicia, $ffinal)
    {
        try {
            // Inicia la transacción
            $this->_db3->beginTransaction();

            $sql = "SELECT mnf.id, mnf.placa, mnf.conductor_manifiesto,
            mnf.tipo_manifiesto, mnf.observacion,
            mnf.estadomnf_actual, mnf.estadoant_actual, cu.estado AS cumplido
            FROM cmx_manifiesto mnf
            INNER JOIN cmx_manifiesto_estado mnfe ON mnf.id = mnfe.id_manifiesto
            LEFT JOIN cmx_cumplido cu ON mnf.id = cu.manifiesto
            WHERE mnfe.estado = 1 AND mnf.estadomnf_actual = 1
            AND mnfe.fecha
            BETWEEN :finicia AND :ffinal";

            $sql_total_manifiesto = "SELECT COUNT(*) AS total_manifiestos
            FROM cmx_manifiesto mnf
            INNER JOIN cmx_manifiesto_estado mnfe ON mnf.id = mnfe.id_manifiesto
            LEFT JOIN cmx_cumplido cu ON mnf.id = cu.manifiesto
            WHERE mnfe.estado = 1 AND mnf.estadomnf_actual = 1
            AND mnfe.fecha
            BETWEEN :finicia AND :ffinal";

            // Preparar y ejecutar las consultas
            $stmt1 = $this->_db3->prepare($sql);
            $stmt1->bindParam(':finicia', $finicia);
            $stmt1->bindParam(':ffinal', $ffinal);
            $stmt1->execute();
            $manifiestos = $stmt1->fetchAll();

            $stmt2 = $this->_db3->prepare($sql_total_manifiesto);
            $stmt2->bindParam(':finicia', $finicia);
            $stmt2->bindParam(':ffinal', $ffinal);
            $stmt2->execute();
            $total_manifiestos = $stmt2->fetch()['total_manifiestos'];

            // Confirmar la transacción
            $this->_db3->commit();

            return [
                'manifiestos' => $manifiestos,
                'total_manifiestos' => $total_manifiestos,
            ];
        } catch (PDOException $e) {
            // Revertir los cambios si ocurre un error
            $this->_db3->rollBack();

            // Registrar o manejar el error
            return [
                'error' => true,
                'message' => $e->getMessage(),
            ];
        }
    }

    public function consulta_manifiesto($nummani)
    {
        try {
            $sql = "SELECT ma.id,ma.placa,ma.tipo_manifiesto,ma.valor_total_viaje,
				ma.retencion_fuente,ma.rete_ica,ma.neto_pagar,ma.saldo,ma.Lugar,
				ma.fecha_pago,ma.cargue_pagado,ma.descargue_pagado,
				ma.observacion, CONCAT(mn.municipio,' ',mn.depto) AS origen,
				CONCAT(mnd.municipio,' ',mnd.depto) AS destino,
				con.nombre AS conductor,
				con.apellido1 AS conape1, con.apellido2 AS conape2,
				con.numero_documento, con.direccion, con.celular, con.rndc_categoria_licencia, CONCAT(mcon.municipio,'',mcon.depto) AS cityconductor,
				ten.nombre, ten.apellido1, ten.apellido2,
				ten.numero_documento AS docten, ten.direccion AS direten, ten.celular AS celten, CONCAT(mten.municipio,'',mten.depto) cityten,
				mak.marca, conf.nombre AS configuracion, ve2.peso, ve2.num_soat, ase.nombre AS aseguradora,
				ve2.vence_soat, tra.placa AS placa_trailer, mantici.valor_anticipo
				FROM cmx_manifiesto ma
				INNER JOIN cmx_municipios mn ON ma.origen_viaje=mn.id
				INNER JOIN cmx_municipios mnd ON ma.destino_viaje=mnd.id
				INNER JOIN cmx_proveedores con ON ma.conductor_manifiesto=con.numero_documento
				INNER JOIN cmx_municipios mcon ON con.id_municipio=mcon.id
				INNER JOIN cmx_proveedores ten ON ma.titular_manifiesto=ten.numero_documento
				INNER JOIN cmx_municipios mten ON ten.id_municipio=mten.id
				INNER JOIN cmx_vehiculos ve ON ma.placa=ve.placa
				INNER JOIN cmx_vehiculo2 ve2 ON ve.numdoc_vehiculo=ve2.id_vehiculo
				INNER JOIN cmx_rndc_vehiculos_configuracion conf ON ve2.configuracion=conf.id
				INNER JOIN cmx_rndc_vehiculos_marcas mak ON ve2.marca=mak.id
				INNER JOIN cmx_rndc_vehiculos_color colou ON ve2.color=colou.id
				INNER JOIN cmx_rndc_aseguradoras ase ON ve2.aseguradora=ase.id
				LEFT JOIN cmx_trailer_vehiculo tv ON ve.numdoc_vehiculo=tv.id_vehiculo AND tv.estado=1
				LEFT JOIN cmx_trailer tra ON tv.id_trailer=tra.id
				LEFT JOIN cmx_manifiesto_anticipo mantici ON ma.id=mantici.id_manifiesto
				LEFT JOIN cmx_estado_mnf_anticipo eant ON ma.id=eant.id_manifiesto
				AND mantici.id=eant.id_anticipo AND eant.estado=1 WHERE ma.id=" . $nummani;
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function consultaremesa($nummani)
    {
        try {
            $sql = "SELECT r.id, d.tipo_servicio_mer, d.cantidad_empaque,
			d.naturaleza, d.tipo_mercancia, te.empaque,
			co.nombre_cliente,
			aa.nombre AS nomdest, aa.documento AS docdest,
			bb.nombre AS nomrem, bb.documento AS docrem,
			CONCAT(ori.municipio,'-',ori.depto) AS origen_rem,
			CONCAT(dest.municipio,'-',dest.depto) AS destino_rem
			FROM cmx_manifiesto_remesa  mr
			INNER JOIN cmx_remesa r ON mr.id_remesa=r.id
			INNER JOIN cmx_remesa_ordencargue ro ON  r.id=ro.id_remesa
			INNER JOIN cmx_orden_cargue o ON ro.id_orden_cargue=o.id
			INNER JOIN cmx_solicitud_vehiculo2 se ON o.mer_idservicio=se.nundoc_solicitud
			INNER JOIN cmx_destinatarios_ss des ON r.id_destinatario=des.id
			INNER JOIN cmx_remitente_destinatario aa ON des.cliente=aa.id
			INNER JOIN cmx_ruta_puntosentrega rem ON o.id_remitente=rem.id
			INNER JOIN cmx_remitente_destinatario bb ON rem.cliente=bb.id
			INNER JOIN cmx_detalle_mercancia2 d ON se.idpareja_origen_destino=d.id
			INNER JOIN cmx_para_tipo_empaque te ON te.id=d.tipo_empaque
			INNER JOIN cmx_cotizaciones_serviciocliente co ON d.n_cotizacion=co.n_cotizacion
			INNER JOIN cmx_municipios ori ON d.origen=ori.rndc_codigo_ciudad
			INNER JOIN cmx_municipios dest ON d.destino=dest.rndc_codigo_ciudad
			INNER JOIN cmx_vehiculos ve ON o.ve_idcarro=ve.numdoc_vehiculo
			WHERE mr.id_manifiesto=" . $nummani;
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Anula_Manifiesto($nummani)
    {
        try {
            $resultado = $this->_db2->conectar();
            $factual = date('Y-m-d');
            $horactual = date('H:i:s');
            $id_usuario = $_SESSION["usuario"]["nom_usuario"];
            $resultado->prepare("insert into cmx_manifiesto_estado
				(id,id_manifiesto,estado,fecha,hora,usuario)
				values(null,:manifiesto,:statu,:fecha,:hour,:user)")->execute(
                array(
                    ':manifiesto' => $nummani,
                    ':statu' => 0,
                    ':fecha' => $factual,
                    ':hour' => $horactual,
                    ':user' => $id_usuario,
                )
            );
            if ($resultado) { //actualizar
                $resultado->prepare("update cmx_manifiesto
					set estadoant_actual=:status
					where id=:manifiesto
					")->execute(array(
                    ':manifiesto' => $nummani,
                    ':status' => 0,
                ));
            }
            return 'true';
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Consulta_Anticipos($id_manif)
    {
        try {
            $sql = "SELECT an.*,em.estado, con.nombre
				FROM cmx_manifiesto_anticipo an
				INNER JOIN cmx_estado_mnf_anticipo em
				ON an.id=em.id_anticipo
				INNER JOIN cmx_proveedores con
				ON an.beneficiario=con.numero_documento
				WHERE an.id_manifiesto=" . $id_manif;
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Consulta_Valor_Tot($id_manif)
    {
        try {
            $sql = "SELECT valor_total_viaje,id,
			conductor_manifiesto
			 FROM cmx_manifiesto
				WHERE id=" . $id_manif;
            //echo $sql;
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetch();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Insertar_anticipo($mani, $vtotal, $vlim, $por, $anticipo, $desem, $bene)
    {
        //echo 'modelo anticipo';
        $resultado = $this->_db2->conectar();
        $resultadob = $this->_db2->conectar();
        $factual = date('Y-m-d');
        $horactual = date('H:i:s');
        $id_usuario = $_SESSION["usuario"]["nom_usuario"];
        //santizar
        (int) $mani;
        (int) $por;
        (float) $vtotal;
        (float) $vlim;
        (float) $anticipo;

        try {

            $resultado->prepare("insert into cmx_manifiesto_anticipo(id,beneficiario,porcentaje,valor_anticipo,metodo_desembolso,id_manifiesto) values(null,:beneficiario,:porcentaje,:anticipo,:met_desembolso,:id_mani)")->execute(
                array(
                    ':beneficiario' => $bene,
                    ':porcentaje' => $por,
                    ':anticipo' => $anticipo,
                    ':met_desembolso' => $desem,
                    ':id_mani' => $mani,
                )
            );

            //si registro el anticipo, poner los anteriores en 0 y el nuevo validar con que estado según el porcentaje
            if ($resultado) {
                $estado;
                if ($por >= 65) {
                    $estado = 2;
                }
                if ($por < 65) {
                    $estado = 1;
                }
                //traer el id del último anticipo
                $sqlanti = "select MAX(id) AS id_anticipo FROM cmx_manifiesto_anticipo
						where id_manifiesto=" . $mani;
                $num = $resultado->query($sqlanti);
                $id1 = $num->fetch();
                $numero_anticipo = $id1['id_anticipo'];
                //poner los demas anticipos inactivos
                $resultadob->prepare("update cmx_estado_mnf_anticipo
					set estado=:estad
					where id_manifiesto=:id_mnf")->execute(
                    array(
                        ':estad' => 0,
                        ':id_mnf' => $mani,
                    )
                );

                if ($numero_anticipo) { //insertar manifiesto
                    $resultado->prepare("insert into
					cmx_estado_mnf_anticipo(id,id_anticipo,id_manifiesto,estado,fecha,hora,usuario)
					values(null,:id_anticipo,:manifiesto,:status,:fecha,:hora,:user)")->execute(
                        array(
                            ':id_anticipo' => $numero_anticipo,
                            ':manifiesto' => $mani,
                            ':status' => $estado,
                            ':fecha' => $factual,
                            ':hora' => $horactual,
                            ':user' => $id_usuario,
                        )
                    );
                }
                return 'true';
            }
        } catch (PDOExeption $e) {
            $error = $e->getMessage();
            $this->_db2->rollBack();
            return 'false';
        }
    }

    public function Consulta_Pdf_Mnf($id_manif)
    {
        try {
            //datos basicos
            $sql = "SELECT ma.id,ma.placa,ma.tipo_manifiesto,ma.valor_total_viaje,
			ma.retencion_fuente,ma.rete_ica,ma.neto_pagar,ma.saldo,ma.Lugar,
			ma.fecha_pago,ma.cargue_pagado,ma.descargue_pagado,
			ma.observacion, CONCAT(mn.municipio,' ',mn.depto) AS origen,
			CONCAT(mnd.municipio,' ',mnd.depto) AS destino,
			con.nombre AS conductor, con.apellido1 AS conape1,
			con.apellido2 AS conape2,
			con.numero_documento, con.direccion, con.celular, con.rndc_numero_licencia,
			CONCAT(mcon.municipio,'',mcon.depto) AS cityconductor,
			ten.nombre, ten.apellido1, ten.apellido2,
			ten.numero_documento AS docten, ten.direccion AS direten,
			ten.celular AS celten, CONCAT(mten.municipio,' ',mten.depto) cityten,
			marq.marca, conf.nombre AS configuracion, ve2.peso, ve2.num_soat,
			ase.nombre AS aseguradora, ve2.vence_soat,
			tra.placa AS placa_remolque,
			MAX(mnfa.valor_anticipo) AS anticipo_actual,
			ma.num_autorizacion,ma.fecha_expedicion
			FROM cmx_manifiesto ma
			INNER JOIN cmx_municipios mn ON ma.origen_viaje=mn.id
			INNER JOIN cmx_municipios mnd ON ma.destino_viaje=mnd.id
			INNER JOIN cmx_proveedores con ON ma.conductor_manifiesto=con.numero_documento
			INNER JOIN cmx_municipios mcon ON con.id_municipio=mcon.id
			INNER JOIN cmx_proveedores ten ON ma.titular_manifiesto=ten.numero_documento
			INNER JOIN cmx_municipios mten ON ten.id_municipio=mten.id
			INNER JOIN cmx_vehiculos ve ON ma.placa=ve.placa
			INNER JOIN cmx_vehiculo2 ve2 ON ve.numdoc_vehiculo=ve2.id_vehiculo
			INNER JOIN cmx_rndc_vehiculos_configuracion  conf ON ve2.configuracion=conf.id
			LEFT JOIN cmx_rndc_vehiculos_marcas marq ON ve2.marca=marq.id
			LEFT JOIN cmx_rndc_aseguradoras ase ON ve2.aseguradora=ase.id
			LEFT JOIN cmx_trailer_vehiculo	tr ON ve.numdoc_vehiculo=tr.id_vehiculo AND tr.estado=1
			LEFT JOIN cmx_trailer tra ON tra.id=tr.id_trailer
			LEFT JOIN cmx_manifiesto_anticipo mnfa ON ma.id=mnfa.id_manifiesto
			LEFT JOIN cmx_estado_mnf_anticipo mnfae ON mnfa.id=mnfae.id_anticipo AND mnfae.estado=1
			WHERE ma.id=" . $id_manif;
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetch();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Consulta_pdf_reme($id_manif)
    {
        try {
            $sql = "SELECT r.id AS id_remesa, d.tipo_servicio_mer,
			d.cantidad_empaque,d.naturaleza, d.tipo_mercancia,
			te.empaque, co.nombre_cliente,
			aa.nombre AS nomdest, aa.documento AS docdest,
			bb.nombre AS nomrem, bb.documento AS docrem,
			CONCAT(ori.municipio,'-',ori.depto) AS origen_rem,
			CONCAT(dest.municipio,'-',dest.depto) AS destino_rem
			FROM cmx_manifiesto_remesa  mr
			INNER JOIN cmx_remesa r
			ON mr.id_remesa=r.id
			INNER JOIN cmx_remesa_ordencargue ro
			ON  r.id=ro.id_remesa
			INNER JOIN cmx_orden_cargue o
			ON ro.id_orden_cargue=o.id
			INNER JOIN cmx_solicitud_vehiculo2 se ON o.mer_idservicio=se.nundoc_solicitud
			INNER JOIN cmx_destinatarios_ss des ON r.id_destinatario=des.id
			INNER JOIN cmx_remitente_destinatario aa ON des.cliente=aa.id
			INNER JOIN cmx_ruta_puntosentrega rem ON o.id_remitente=rem.id 
            INNER JOIN cmx_remitente_destinatario bb ON rem.cliente=bb.id
			INNER JOIN cmx_detalle_mercancia2 d ON se.idpareja_origen_destino=d.id
			INNER JOIN cmx_para_tipo_empaque te ON te.id=d.tipo_empaque
			INNER JOIN cmx_cotizaciones_serviciocliente co ON d.n_cotizacion=co.n_cotizacion
			INNER JOIN cmx_municipios ori ON d.origen=ori.rndc_codigo_ciudad
			INNER JOIN cmx_municipios dest ON d.destino=dest.rndc_codigo_ciudad
			INNER JOIN cmx_vehiculos ve ON o.ve_idcarro=ve.numdoc_vehiculo
			WHERE mr.id_manifiesto=" . $id_manif;
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Remesa_Rndc($manifiesto)
    {
        try {
            $sql = 'SELECT
			id_manifiesto,
			COUNT(id_remesa) AS can_remesa,
			(SELECT COUNT(estado_rem_rndc) FROM cmx_manifiesto_remesa
			WHERE id_manifiesto=' . $manifiesto . ' AND estado_rem_rndc=1) AS can_re_rndc
			FROM cmx_manifiesto_remesa
			WHERE id_manifiesto=' . $manifiesto . '
			AND estado=1';
            $resultado = $this->_db3->query($sql);
            return $resultado->fetch();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }
}
