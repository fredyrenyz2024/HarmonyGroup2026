<?php
session_start();
class transporteModel extends Model
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

    //ORDEN DE CARGUE
    public function estudios_seguridad()
    {
        $sql = "SELECT * FROM cmx_planilla";
        $result = $this->_db->getConsulta($sql);
        return $result;
    }

    public function Seleccion_Placa2()
    {
        /*$sql="SELECT placa FROM
        cmx_vehiculos";*/
        $fecha = date('Y-m-d');
        $sql =
            "SELECT es.id AS idestudi, soli.id , soli.id_solictud,  soli.placa, ev.estado,
			lg.fecha, lg.hora, p.nombre, p.numero_documento,
			cv.clase, tra.id AS 'id_trailer', tra.placa AS 'trailer'
			FROM cmx_log_solicitudvehiculo2  soli
			LEFT JOIN cmx_estudio_vehiculo es ON soli.id=es.id_solicitud
			LEFT JOIN cmx_estudiov_completo ev
			ON es.id=ev.id_estudio AND ev.estado_actu=1
			AND ev.estado='Aprobado'
			LEFT JOIN cmx_logestudio_com lg ON ev.id=lg.id_completo
			LEFT JOIN cmx_proveedores p ON ev.id_conductor=p.id
			LEFT JOIN cmx_vehiculos vv ON ev.id_vehiculo=vv.numdoc_vehiculo
			LEFT JOIN cmx_vehiculo2 v2 ON vv.id=v2.id_vehiculo
			LEFT JOIN cmx_rndc_clase_vehiculo cv ON v2.clase_vehiculo=cv.id
			LEFT JOIN cmx_trailer_vehiculo tv ON ev.id=tv.id_vehiculo
			LEFT JOIN cmx_trailer tra ON tv.id_trailer=tra.id
			WHERE lg.fecha BETWEEN '" . $fecha . "' AND '" . $fecha . "'";
        $result = $this->_db->getConsulta($sql);
        return $result;
    }

    //DATOS CON NUEVA FORMA
    public function prueba()
    {
        try {
            $fecha = date('Y-m-d');
            $hora = date('H:i:s');
            $sql = "SELECT  DISTINCT(remi.id),
            sf.placa, sf.num_estudioseguridad,
            ps.id_servicio_cliente,remi.id AS idremitente, remi.lugar,
            sf.flete_propuesto, su.id AS idsubasta, es.id AS idestudi,remi.id_punto,
            rm.nombre, remi.peso AS peso_remitente,sf.tarifa_promedio,
            sf.id AS id_subastaflete, es.id AS id_estadoflete,
            ef.estado_final, sf.id,  sf.estado_orden, remi.id
            FROM cmx_subasta su
            INNER JOIN cmx_subasta_solicitud_servicio ss ON su.id=ss.id_subasta
            INNER JOIN cmx_subasta_flete sf ON ss.id=sf.id_suba_servicio AND ss.id_subasta=sf.id_suba
            INNER JOIN cmx_estado_subasta_flete ef ON sf.id=ef.id_suba_flete
            INNER JOIN cmx_estudio_vehiculo es ON  sf.num_estudioseguridad=es.id_estudio
            INNER JOIN cmx_estudiov_completo eco ON es.id_estudio=eco.id_estudio AND eco.estado_actu=1
            INNER JOIN cmx_preestudio_solicitudes_servicio ps ON es.id_estudio=ps.id_solicitudpreestudio AND ss.numer_solservicio=ps.id_servicio_cliente AND ps.clasificacion='E'
            INNER JOIN cmx_solicitud_vehiculo2 se ON ps.id_servicio_cliente=se.nundoc_solicitud
            INNER JOIN cmx_detalle_mercancia2 detalle ON se.idpareja_origen_destino=detalle.id
            INNER JOIN cmx_ruta_puntosentrega remi ON remi.cod_ini_ruta=se.nundoc_solicitud  and remi.tipo='punto recogida'
            INNER JOIN cmx_remitente_destinatario rm ON remi.cliente=rm.id
            WHERE eco.estado='Aprobado' AND eco.estado_actu=1  AND eco.fecha='" . $fecha . "'
            AND ef.estado_final='Ganador' AND sf.estado_orden='pendiente'
            AND su.fecha_finaliza >='" . $fecha . "'
            GROUP BY remi.id";
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOExeption $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Datos_placa($placa)
    {
        try {
            $resultado = $this->_db2->conectar();

            $sql =
                "SELECT v.numdoc_vehiculo AS idvehiculo, v.placa, rvc.descripcion AS tipo_carroceria, vmar.marca,
			b.anio_fabricacion, colou.color, b.tipo_vinculacion,b.vence_soat, b.capacidad_tn, m.tecno_fecha_vigencia,p.numdoc_nexos as id_pro,
			p.tipo_documento AS prodoc, p.numero_documento AS pronum, p.nombre AS pronom, p.apellido1 AS proape1, p.apellido2 AS proape2,
			te.tipo_documento AS tedoc , te.numero_documento AS tenum, te.nombre AS tenom, te.apellido1 AS teape1, te.apellido2 AS teape2, te.numdoc_nexos as id_ten,
			co.tipo_documento AS condoc, co.numero_documento AS connum, co.nombre AS connom,co.apellido1 AS conape1, co.apellido2 AS conape2,co.numdoc_nexos as id_con,
			co.celular,dc.celular2, co.rndc_vencimiento_licencia,dc.fecha_vence_eps, dc.vence_curso,cl.clase,
			tra.id AS 'idtrailer',tra.placa AS 'placatrailer'
			FROM cmx_vehiculos v
			INNER JOIN cmx_proveedores p ON v.id_propietario=p.numdoc_nexos
			INNER JOIN cmx_proveedores te ON v.id_tenedor=te.numdoc_nexos
			INNER JOIN cmx_proveedores co ON v.id_conductor=co.numdoc_nexos
			LEFT JOIN cmx_vehiculo2 b ON b.id_vehiculo=v.numdoc_vehiculo
			LEFT JOIN cmx_detalle_vehiculo m ON m.id_vehiculo=m.id
			LEFT JOIN cmx_detalle_conductor dc ON dc.id_proveedor=co.id
			LEFT JOIN cmx_rndc_vehiculos_carroceria rvc ON v.tipo_carroceria=rvc.id
			LEFT JOIN cmx_rndc_clase_vehiculo cl ON b.clase_vehiculo=cl.id
			LEFT JOIN cmx_rndc_vehiculos_marcas vmar ON  b.marca=vmar.id
			LEFT JOIN cmx_rndc_vehiculos_color colou ON b.color=colou.id
			LEFT JOIN cmx_trailer_vehiculo tv ON v.numdoc_vehiculo=tv.id_vehiculo
			LEFT JOIN cmx_trailer tra ON tv.id_trailer=tra.id
			WHERE v.placa='" . $placa . "'";

            $consulta = $resultado->query($sql);
            return $consulta->fetch();
        } catch (PDOExeption $e) {
            $error = $e->getMessage();
            $this->_db2->rollBack();
        }
    }

    public function Datos_servicio($id_servicio)
    {
        try {
            $resultado = $this->_db2->conectar();
            $sql = "SELECT d.tipo_mercancia, em.empaque,
						d.volumen_total, d.cantidad_empaque,
						s.devol_numcont,
						cl.id AS id_cliente, cl.nombre, cl.documento,
						cl.digito_verificacion, cl.direccion,
						cl.telefono, CONCAT(mn.depto,' - ',mn.municipio) AS 'ciudad',cl.seg_cond_cargue,
						s.flete, s.peso_kg
			FROM cmx_solicitud_vehiculo2 s
			LEFT JOIN cmx_detalle_mercancia2 d ON s.n_cotizacion=d.n_cotizacion AND s.idpareja_origen_destino=d.id
			LEFT JOIN cmx_para_tipo_empaque em ON d.tipo_empaque=em.id
			LEFT JOIN cmx_cotizaciones_serviciocliente co ON co.n_cotizacion=s.n_cotizacion
			LEFT JOIN cmx_clientes cl ON cl.documento=co.nit
			LEFT JOIN cmx_municipios mn ON cl.ciudad=mn.id
			WHERE s.nundoc_solicitud=" . $id_servicio;
            $consulta = $resultado->query($sql);
            return $consulta->fetch();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db2->rollBack();
        }
    }

    public function Datos_remi_dest($id_servicio, $idremite)
    {
        try {
            $resultado = $this->_db2->conectar();
            $sql =
                "SELECT p.id, p.direccion_entrega, p.fecha_estimada_entrega,
				p.observacion,
 				p.hora_estimada, m.municipio, m.depto, m.rndc_codigo_ciudad,
 				rd.nombre,
 				rd.documento, p.telefono
	 			FROM cmx_ruta_puntosentrega p
				INNER JOIN cmx_municipios m
				ON p.municipio_entrega=m.id
				INNER JOIN cmx_remitente_destinatario rd
				ON p.cliente=rd.id
				WHERE p.cod_ini_ruta=" . $id_servicio . "
				AND p.id=" . $idremite . "
				AND p.tipo='punto recogida'";
            $consult = $resultado->query($sql);
            return $consult->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db2->rollBack();
        }
    }

    public function Dato_destino($n_servicio, $idpunto)
    {
        try {
            $resultado = $this->_db2->conectar();
            $sql =
                "SELECT p.id, p.direccion_entrega,
			p.fecha_estimada_entrega, p.observacion,
		 	p.hora_estimada,mn.id AS idmunicipio,
		 	mn.municipio, mn.depto, mn.rndc_codigo_ciudad,
		 	rd.nombre,rd.documento, p.telefono
			FROM
			cmx_destinatarios_ss p
			INNER JOIN cmx_remitente_destinatario  rd
			ON p.cliente=rd.id
			INNER JOIN cmx_municipios mn
			ON rd.id_ciudad=mn.id
			WHERE p.solicitud_servicio=" . $n_servicio . "
			AND p.id_punto=" . $idpunto;
            $consult = $resultado->query($sql);
            return $consult->fetchall();
        } catch (PDOExeption $e) {
            $error = $e->getMessage();
            $this->_db2->rollBack();
        }
    }
    //DATOS PARAMETRICOS
    public function consulte_munipios()
    {
        try {
            $resultado = $this->_db2->conectar();
            $sql2 = "SELECT id, municipio, depto
			FROM cmx_municipios WHERE pais='COLOMBIA' LIMIT 200";
            $consul = $resultado->query($sql2);
            return $consul->fetchall();
            /*while($dato= $consul->fetch()){
        $return["content"][]= $dato;
        }
        return $return;*/
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db2->rollBack();
        }
    }

    public function consulte_cliente($num_servicio)
    {
        try {
            $resultado = $this->_db2->conectar();
            $sql3 =
                "SELECT cl.id, cl.nombre FROM cmx_solicitud_vehiculo2 s
			INNER JOIN cmx_cotizaciones_serviciocliente c
			ON s.n_cotizacion=c.n_cotizacion
			INNER JOIN cmx_clientes cl
			ON c.nit=cl.documento
			AND c.digito=cl.digito_verificacion
			WHERE s.nundoc_solicitud=" . $num_servicio;
            $consult = $resultado->query($sql3);
            return $consult->fetch();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db2->rollBack();
        }
    }

    public function Busqueda_lugares()
    {
        try {
            $resultado = $this->_db2->conectar();
            $sql4 = "SELECT mun.id, mun.municipio, mun.depto
			FROM cmx_municipios mun WHERE pais='COLOMBIA'
			LIMIT 200";
            /*$consulte= $resultado->query($sql);
            $datos_municipios = $consulte->fetchall();
            $return[] = $datos_municipios;
            return $return;*/
            $consultm = $resultado->query($sql4);
            return $consultm->fetchall();
        } catch (PDOExeption $e) {
            $error = $e->getMessage();
            $this->_db2->rollBack();
        }
    }

    public function Eliminar_Remitente($id_remitent)
    {
        try {
            $resultado = $this->_db2->conectar();
            $sql9 = "DELETE FROM cmx_ruta_puntosentrega
					WHERE id=" . $id_remitent;
            $resultado->prepare($sql9)->execute();
            return 'true';
        } catch (PDOExeption $e) {
            $error = $e->getMessage();
            $this->_db2->rollBack();
            return 'false';
        }
    }

    public function Insertar_orden(
        $n_ordene,
        $idcliente,
        $id_vehiculo,
        $id_trailer,
        $idconductor,
        $pesovehiculo,
        $flete,
        $fletepactado,
        $num_estudio,
        $num_servicio,
        $mercancia,
        $empaque,
        $cant,
        $peso_mer,
        $volumen,
        $cont1,
        $cont2,
        $condicionk,
        $obscarga,
        $emabalajek,
        $pesok,
        $id_remitente,
        $id_puntorem,
        $dat,
        $renuevo,
        $actudesty,
        $insertdes,
        $precinto,
        $cnt_dias2,
        $cnt_muni2,
        $cnt_direccion,
        $cnt_tpo,
        $cnt_comodato,
        $cnt_vacio,
        $id_propietario,
        $id_tenedor,
        $tarifapropuesta,
        $id_subasta_flete,
        $id_esubasta_flete
    ) {

        // echo (int)$cnt_dias2;
        // exit();
        $resultado = $this->_db2->conectar();
        $resultadoo = $this->_db2->conectar();
        $factual = date('Y-m-d');
        $horactual = date('H:i:s');
        $id_usuario = $_SESSION["usuario"]["nom_usuario"];
        $_msg_error = "";
        //santizar
        (int) $n_ordene;
        (int) $idcliente;
        (int) $id_vehiculo;
        (int) $id_trailer;
        (int) $idconductor;
        (int) $pesovehiculo;
        (float) $flete;
        (float) $fletepactado;
        (int) $num_estudio;
        (int) $num_servicio;
        (int) $cant;
        (int) $peso_mer;
        (int) $volumen;
        (int) $pesok;
        (int) $id_remitente;

        if ($cnt_dias2) {
            $cont_dias = $cnt_dias2;
        } else {
            $cont_dias = NULL;
        }

        $cont_municipio = (int)$cnt_dias2;
        if (isset($cnt_direccion)) {
            $cont_direccion = $cnt_direccion;
        } else {
            $cont_direccion = '';
        }
        $cont_tipo = (int)$cnt_tpo;

        if ($cnt_comodato) {
            $cont_comodato = $cnt_comodato;
        } else {
            $cont_comodato = NULL;
        }
        if ($cnt_vacio) {
            $cont_peso = $cnt_vacio;
        } else {
            $cont_peso = (int)0;
        }

        try {
            $empresa_id = $_SESSION['usuario']['empresa_id'];
            $sqlm = "select numero_actual from cmx_maestro where tipo='OC' and numero_actual>=numero_inicial and numero_actual<=numero_final and empresa_id='" . $empresa_id . "'";
            $number = $resultado->query($sqlm);
            $number1 = $number->fetch();
            $number2 = $number1['numero_actual'];
            $operacion = ($number2 + 1);
            $resultado->prepare('update cmx_maestro set numero_actual=:numero where tipo=:tipo and empresa_id=:empresa')->execute(array(':numero' => $operacion, ':tipo' => 'OC', ':empresa' => $empresa_id));

            //actualizar datos del remitente
            $i = 0;
            while ($i < count($dat->idremi)) {
                $dir = $dat->dire[$i];
                $tele = $dat->tel[$i];
                $fecha = $dat->fech[$i];
                $hora = $dat->hor[$i];
                $obser = $dat->obs[$i];
                $idremi = $dat->idremi[$i];

                $resultado->prepare("update cmx_ruta_puntosentrega set direccion_entrega=:dir,
					fecha_estimada_entrega=:fecha,
					observacion=:obsre,
					hora_estimada=:horarecoge
					where id=:idremi")->execute(
                    array(
                        ':dir' => $dir,
                        'idremi' => $idremi,
                        ':fecha' => $fecha,
                        'obsre' => $obser,
                        'horarecoge' => $hora,
                    )
                );
                $i++;
            }

            //insertar remitentes
            $a = 0;
            while ($a < count($renuevo->p_ciudad)) {
                $p_ciudad = $renuevo->p_ciudad[$a];
                $clientea = $renuevo->clientea[$a];
                $dire = $renuevo->dire[$a];
                $fechar = $renuevo->fecha[$a];
                $observa = $renuevo->observa[$a];
                $horar = $renuevo->hora[$a];
                $tipor = $renuevo->tipo[$a];
                $orden = $renuevo->orden[$a];
                $num_servicio = $num_servicio;

                $resultado->prepare("insert into cmx_ruta_puntosentrega(id,cod_ini_ruta,municipio_entrega,direccion_entrega,cliente,fecha_estimada_entrega,observacion,fecha,hora,usuario,hora_estimada,tipo,orden)values(null,:id_servicio,:municipio,:direc,:cliente,:fecremite,:nota,:fhoy,:hhoy,:user,:horare,:tipo,:orden)")
                    ->execute(
                        array(
                            ':id_servicio' => $num_servicio,
                            ':municipio' => $p_ciudad,
                            ':direc' => $dire,
                            ':cliente' => $clientea,
                            ':fecremite' => $fechar,
                            ':nota' => $observa,
                            ':fhoy' => $factual,
                            ':hhoy' => $horactual,
                            ':user' => $id_usuario,
                            ':horare' => $horar,
                            ':tipo' => $tipor,
                            ':orden' => $orden,
                        )
                    );
                $a++;
            }

            //actualizar destinatario
            $m = 0;
            while ($m < count($actudesty->iddest)) {
                $direccion = $actudesty->direccion[$m];
                $destino = $actudesty->destino[$m];
                $fecha_entrega = $actudesty->fecha_entrega[$m];
                $horaentre = $actudesty->horaentre[$m];
                $observacion = $actudesty->observacion[$m];
                $iddest = $actudesty->iddest[$m];

                $resultado->prepare("update cmx_ruta_puntosentrega set
					municipio_entrega=:ciudad,
					direccion_entrega=:direccion,
					fecha_estimada_entrega=:fecha,
					observacion=:obs,
					hora_estimada=:horad
					where id=:idtb")->execute(
                    array(
                        ':ciudad' => $destino,
                        ':direccion' => $direccion,
                        ':fecha' => $fecha_entrega,
                        ':horad' => $horaentre,
                        ':obs' => $observacion,
                        ':idtb' => $iddest,
                    )
                );
                $m++;
            }

            //insertar destinantario nuevo
            $z = 0;
            while ($z < count($insertdes->p_ciudadd)) {
                $p_ciudadd = $insertdes->p_ciudadd[$z];
                $clientead = $insertdes->clientead[$z];
                $dired = $insertdes->dired[$z];
                $fechad = $insertdes->fechad[$z];
                $observad = $insertdes->observad[$z];
                $horad = $insertdes->horad[$z];
                $tipod = $insertdes->tipod[$z];
                $ordend = $insertdes->ordend[$z];

                $resultado->prepare("insert into cmx_ruta_puntosentrega
					(id,cod_ini_ruta,municipio_entrega,direccion_entrega,cliente,fecha_estimada_entrega,observacion,fecha,hora,usuario,hora_estimada,tipo,orden)values(null,:id_service,:municipio,:direc,:cliente,:fecha,:obse,:fhoy,:hhoy,:user,:horaesti,:type,:orden)")
                    ->execute(
                        array(
                            ':id_service' => $num_servicio,
                            ':municipio' => $p_ciudadd,
                            ':direc' => $dired,
                            ':cliente' => $clientead,
                            ':fecha' => $fechad,
                            ':obse' => $observad,
                            ':fhoy' => $factual,
                            ':hhoy' => $horactual,
                            ':user' => $id_usuario,
                            ':horaesti' => $horad,
                            ':type' => $tipod,
                            ':orden' => $ordend,
                        )
                    );
                $z++;
            }

            //insertar precintos
            $u = 0;
            while ($u < count($precinto->num_preci)) {
                $tipo_prec = $precinto->tipoprecinto[$u];
                $num_preci = $precinto->num_preci[$u];
                $num_ordenk = $number2;

                $resultado->prepare("insert into cmx_planilla_detalle2(id,id_planilla,serie_precinto,tipo_precinto,hora,fecha,usuario) values(null,:num_orden,:num_precinto,:tipo_precinto,:hhoy,:fhoy,:user)")
                    ->execute(
                        array(
                            ':num_orden' => $number2,
                            ':num_precinto' => $num_preci,
                            ':tipo_precinto' => $tipo_prec,
                            ':fhoy' => $factual,
                            ':hhoy' => $horactual,
                            ':user' => $id_usuario,
                        )
                    );
                $u++;
            }

            $resultadoo->prepare("INSERT INTO cmx_orden_cargue(id,cli_id,ve_idcarro,ve_idtrailer,ve_id_conductor,ve_pesototal,ve_fletecotizacion,ve_fletepactado,ve_idestudiosegu,mer_idservicio,mer_producto,mer_empaque,mer_cantidad,mer_pesomercancia,
            mer_volumen,mer_contenedor1,mer_contenedor2,ca_condiciones,ca_observacion,ca_embalaje,ca_pesocargue,fecha_orden,usuario_orden,hora_orden,estado,id_remitente,id_punto_remitente,devol_dias2,devol_municipio2,devol_direccion2,devol_tipocont2,
            devol_comodato,devol_pesovacio,ve_tarifacalculada,ve_id_propietario,ve_id_poseedor,estado_remesa,empresa)
            VALUES(:num_orden,:idcliente,:idvehiculo,:idtrailer,:idconductor,:peso_vehiculo,:flete,:fletepactado,:id_estudio,:id_servicio,:producto,:empaque,:cantidad,:peso_mercancia,:volumen,:contenedor1,:contenedor2,:condi_carga,:observacion_carga,
            :emabalaje_carga,:peso_cargue,:fecha,:usuario,:hora,1,:idremite,:punto_remi,:teu_dias,:teu_munici,:teu_direc,:teu_tipo,:teu_comodato,:teo_peso,:tarifa,:propietario,:tenedor,:estado_orden,:empresa)")
                ->execute(
                    array(
                        ':num_orden' => $number2,
                        ':idcliente' => $idcliente,
                        ':idvehiculo' => $id_vehiculo,
                        ':idtrailer' => $id_trailer == '' ? 0 :  $id_trailer,
                        ':idconductor' => $idconductor,
                        ':peso_vehiculo' => $pesovehiculo,
                        ':flete' => $flete,
                        ':fletepactado' => $fletepactado,
                        ':id_estudio' => $num_estudio,
                        ':id_servicio' => $num_servicio,
                        ':producto' => $mercancia,
                        ':empaque' => $empaque,
                        ':cantidad' => $cant,
                        ':peso_mercancia' => $peso_mer,
                        ':volumen' => $volumen,
                        ':contenedor1' => $cont1,
                        ':contenedor2' => $cont2,
                        ':condi_carga' => $condicionk,
                        ':observacion_carga' => $obscarga,
                        ':emabalaje_carga' => $emabalajek,
                        ':peso_cargue' => $pesok,
                        ':idremite' => $id_remitente,
                        ':fecha' => $factual,
                        ':usuario' => $id_usuario,
                        ':hora' => $horactual,
                        ':punto_remi' => $id_puntorem,
                        ':teu_dias' => $cont_dias,
                        ':teu_munici' => $cont_municipio,
                        ':teu_direc' => $cont_direccion,
                        ':teu_tipo' => $cont_tipo,
                        ':teu_comodato' => $cont_comodato,
                        ':teo_peso' => $cont_peso,
                        ':tarifa' => $tarifapropuesta,
                        ':propietario' => $id_propietario,
                        ':tenedor' => $id_tenedor,
                        ':estado_orden' => 'pendiente',
                        ':empresa' => $empresa_id,
                    )
                );

            if ($resultadoo) { //si registro orden de cargue
                $resultado->prepare('insert into cmx_estado_ordencargue(id,id_orden,estado,fecha,hora,usuario)
					values(:id,:orden,:estado,:fecha,:hora,:usuario)')->execute(
                    array(
                        ':id' => null,
                        ':orden' => $number2,
                        ':estado' => 1,
                        ':fecha' => $factual,
                        ':usuario' => $id_usuario,
                        ':hora' => $horactual,
                    )
                );

                //actualizar cmx_subasta_flete
                $resultado->prepare('update cmx_subasta_flete
					set estado_orden=:estado_orden, numero_orden=:orden
					where id=:id')->execute(
                    array(
                        ':id' => $id_subasta_flete,
                        ':estado_orden' => 'completado',
                        ':orden' => $number2,
                    )
                );
            }

            $return["status"] = true;
            $return["numero_documento"] = $number2;
            $return["error"] = $_msg_error;
            return $return;
        } catch (PDOExeption $e) {
            $error = $e->getMessage();
            $this->_db2->rollBack();
            $_msg_error = "Error";
            $return["status"] = false;
            $return["numero_documento"] = "";
            $return["error"] = $_msg_error;
            return $return;
        }
    }

    //consulta al PDF
    public function Consulta_pdf($id)
    {
        try {
            $resultado = $this->_db2->conectar();
            $sqlp = "SELECT id, cli_id
			FROM cmx_orden_cargue WHERE id=" . $id;
            $consultm = $resultado->query($sqlp);
            return $consultm->fetch();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db2->rollBack();
        }
    }

    //CONSULTA CLIENTES
    public function Consultar_Cliente()
    {
        try {
            $resultado = $this->_db2->conectar();
            $sql = "SELECT  id, documento, digito_verificacion, nombre
				FROM cmx_clientes
				WHERE estado=1
				ORDER BY nombre ASC";
            $consult = $resultado->query($sql);
            $consult->setFetchMode(PDO::FETCH_ASSOC);
            return $consult->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db2->rollBack();
        }
    }

    //CONSULTAS TABLA ORDENES DE CARGUE
    public function BuscarOrden($fi, $ff, $cliente, $tipo)
    {
        try {
            $resultado = $this->_db2->conectar();
            if ($tipo == 1) {
                $sqlo = "SELECT o.id, o.ca_condiciones, o.ca_fechacargue,
				o.ca_horacargue, o.ca_pesocargue, o.estado,
				o.mer_idservicio,
				v.placa, pro.nombre, pro.apellido1, pro.apellido2,
				t.placa AS placatrailer,
				cl.nombre AS cliente
				FROM cmx_orden_cargue o
				INNER JOIN cmx_vehiculos v ON o.ve_idcarro=v.numdoc_vehiculo
				INNER JOIN cmx_proveedores pro ON o.ve_id_conductor=pro.numdoc_nexos
				INNER JOIN cmx_clientes cl ON o.cli_id=cl.id
				LEFT JOIN cmx_trailer t ON o.ve_idtrailer=t.id
				WHERE o.fecha_orden
				BETWEEN '" . $fi . "' AND '" . $ff . "'";
                $sql_total_ordenes = "SELECT COUNT(*) AS total_ordenes FROM cmx_orden_cargue WHERE fecha_orden
				BETWEEN '" . $fi . "' AND '" . $ff . "'";
            }
            if ($tipo == 2) {
                $sqlo = "SELECT o.id, o.ca_condiciones, o.ca_fechacargue,
				o.ca_horacargue, o.ca_pesocargue, o.estado,
				o.mer_idservicio,
				v.placa, pro.nombre, pro.apellido1, pro.apellido2,
				t.placa AS placatrailer,
				cl.nombre AS cliente
				FROM cmx_orden_cargue o
				INNER JOIN cmx_vehiculos v ON o.ve_idcarro=v.numdoc_vehiculo
				INNER JOIN cmx_proveedores pro ON o.ve_id_conductor=pro.numdoc_nexos
				INNER JOIN cmx_clientes cl ON o.cli_id=cl.id
				LEFT JOIN cmx_trailer t
				ON o.ve_idtrailer=t.id
				WHERE o.cli_id=" . $cliente;
                $sql_total_ordenes = "SELECT COUNT(*) AS total_ordenes FROM cmx_orden_cargue
				WHERE cli_id=" . $cliente;
            }
            if ($tipo == 3) {
                $sqlo =
                    "SELECT o.id, o.ca_condiciones, o.ca_fechacargue,
				o.ca_horacargue, o.ca_pesocargue, o.estado,
				o.mer_idservicio,
				v.placa, pro.nombre, pro.apellido1, pro.apellido2,
				t.placa AS placatrailer,
				cl.nombre AS cliente
				FROM cmx_orden_cargue o
				INNER JOIN cmx_vehiculos v ON o.ve_idcarro=v.numdoc_vehiculo
				INNER JOIN cmx_proveedores pro ON o.ve_id_conductor=pro.numdoc_nexos
				INNER JOIN cmx_clientes cl ON o.cli_id=cl.id
				LEFT JOIN cmx_trailer t ON o.ve_idtrailer=t.id
				WHERE o.cli_id=" . $cliente . "
				AND o.fecha_orden
				BETWEEN '" . $fi . "'
				AND '" . $ff . "'";
                $sql_total_ordenes = "SELECT COUNT(*) AS total_ordenes FROM cmx_orden_cargue
				WHERE cli_id=" . $cliente . " AND fecha_orden BETWEEN '" . $fi . "' AND '" . $ff . "'";
            }
            $consultm = $resultado->query($sqlo);
            $consultotal = $resultado->query($sql_total_ordenes);
            $response = [
                'ordenes' => $consultm->fetchall(),
                'total_ordenes' => $consultotal->fetchall()[0]['total_ordenes'],
            ];
            return $response;
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db2->rollBack();
        }
    }

    public function AnularOrdenCargue($numero)
    {
        $resultado = $this->_db2->conectar();
        try {
            $resultado->prepare("update cmx_orden_cargue
				set estado=:status
				where id=:idorden")->execute(
                array(
                    ':status' => 0,
                    ':idorden' => $numero,
                )
            );
            return 'true';
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db2->rollBack();
            return 'false';
        }
    }

    public function Valida_Anulacion($numero)
    {
        try {
            $sql = "SELECT roc.*
			FROM cmx_remesa_ordencargue roc
			INNER JOIN cmx_remesa re
			ON roc.id_remesa=re.id AND re.estado=1
			INNER JOIN cmx_estado_remesa er
			ON re.id=er.id_remesa AND er.estado=1
			WHERE
			roc.id_orden_cargue=" . $numero . "
			AND roc.estado=1";
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetch();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db2->rollBack();
        }
    }

    public function InquirirOrden($id)
    {
        $resultado = $this->_db2->conectar();
        try {
            $sql =
                "SELECT oc.id, oc.ve_fletecotizacion, oc.ve_fletepactado,
				oc.ve_idestudiosegu, oc.mer_idservicio, oc.mer_producto,
				oc.mer_empaque, oc.mer_cantidad, oc.mer_pesomercancia,
				oc.mer_volumen, oc.mer_contenedor1, oc.mer_contenedor2,
				oc.ca_condiciones, oc.ca_observacion, oc.ca_embalaje,
				oc.ca_fechacargue, oc.ca_horacargue, oc.ca_pesocargue,
				ve.placa, colou.color, b.anio_fabricacion, mak.marca, roce.descripcion AS tipo_carroceria,
				b.tipo_vinculacion, b.clase_vehiculo, co.nombre, co.apellido1, co.apellido2, co.numero_documento, co.celular, cl.clase, t.placa AS placatrailer
				FROM cmx_orden_cargue oc
				INNER JOIN cmx_vehiculos ve ON oc.ve_idcarro=ve.numdoc_vehiculo
				INNER JOIN cmx_vehiculo2 b ON ve.numdoc_vehiculo=b.id_vehiculo
				LEFT JOIN cmx_rndc_clase_vehiculo cl ON b.clase_vehiculo=cl.id
				LEFT JOIN cmx_rndc_vehiculos_color colou ON b.color=colou.id
				LEFT JOIN cmx_rndc_vehiculos_marcas mak ON b.marca=mak.id
				LEFT JOIN cmx_rndc_vehiculos_carroceria roce ON ve.tipo_carroceria=roce.id
				INNER JOIN cmx_proveedores co ON oc.ve_id_conductor=co.numdoc_nexos
				LEFT JOIN cmx_trailer t ON oc.ve_idtrailer=t.id
				WHERE oc.id=" . $id;
            $consultm = $resultado->query($sql);
            return $consultm->fetch();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db2->rollBack();
        }
    }

    public function BuscarRemitente($id, $orden)
    {
        $resultado = $this->_db2->conectar();
        try {
            $sqlr = "SELECT a.direccion_entrega, a.fecha_estimada_entrega,
				a.observacion, a.hora_estimada, a.tipo, b.nombre, a.telefono,
				m.municipio, m.depto
				FROM cmx_ruta_puntosentrega a
				INNER JOIN cmx_remitente_destinatario b
				ON a.cliente=b.id
				INNER JOIN cmx_municipios m
				ON a.municipio_entrega=m.id
				INNER JOIN cmx_orden_cargue oc
				ON a.id=oc.id_remitente
				WHERE a.cod_ini_ruta=" . $id . "
				AND oc.id=" . $orden . "
				ORDER BY a.tipo";
            $consultm = $resultado->query($sqlr);
            return $consultm->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db2->rollBack();
        }
    }

    public function BuscarDestinatarios($id, $orden)
    {
        $resultado = $this->_db2->conectar();
        try {
            $sqlr = "SELECT
				bdes.solicitud_servicio, bdes.direccion_entrega,
				bdes.fecha_estimada_entrega, bdes.observacion,
				bdes.hora_estimada, bdes.telefono, bdes.peso,
				bdes.lugar, mn.municipio, mn.depto,
				pa.nombre AS destinatario
				FROM cmx_ruta_puntosentrega a
				LEFT JOIN cmx_destinatarios_ss	bdes
				ON a.id_punto=bdes.id_punto
				AND bdes.solicitud_servicio=" . $id . "
				LEFT JOIN cmx_municipios mn
				ON bdes.municipio_entrega=mn.id
				LEFT JOIN cmx_remitente_destinatario pa
				ON bdes.cliente=pa.id
				INNER JOIN cmx_orden_cargue oc
				ON a.id=oc.id_remitente
				WHERE a.cod_ini_ruta=" . $id . "
				AND oc.id=" . $orden . "
				ORDER BY a.tipo, bdes.tipo";
            $consultm = $resultado->query($sqlr);

            return $consultm->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db2->rollBack();
        }
    }

    // public function Buscarordenpdf($id)
    // {
    //     $resultado = $this->_db2->conectar();
    //     try {
    //         $sqlpdf =
    //             "SELECT oc.id, oc.ve_fletecotizacion, oc.ve_fletepactado,
    // 			oc.ve_idestudiosegu, oc.mer_idservicio, oc.mer_producto,
    // 			oc.mer_empaque, oc.mer_cantidad, oc.mer_pesomercancia,
    // 			oc.mer_volumen, oc.mer_contenedor1, oc.mer_contenedor2,
    // 			oc.ca_condiciones, oc.ca_observacion, oc.ca_embalaje,
    // 			oc.ca_fechacargue, oc.ca_horacargue, oc.ca_pesocargue,
    // 			ve.placa, b.color, b.anio_fabricacion, b.marca, b.cod_rndc_carroceria,
    // 			b.tipo_vinculacion, b.clase_vehiculo,
    // 			co.nombre AS nombreconductor, co.apellido1, co.apellido2,
    // 			co.numero_documento, co.celular,
    // 			cli.nombre AS cliente, cli.documento, t.placa AS placatrailer,
    // 			rd.nombre, rtp.direccion_entrega, rtp.telefono,
    // 			mre.municipio AS origen,
    // 			colo.color AS color_texto,
    // 			desi.nombre AS destinatario,
    // 			bdes.direccion_entrega AS dire_destinatario,
    // 			bdes.telefono AS tel_destinatario,
    // 			mde.municipio AS destino,
    // 			ma.marca AS marca_letra,oc.mer_idservicio AS solicitud_servicio,ag.nombre AS Nombre_Agencia,ss.nundoc_solicitud
    // 			FROM cmx_orden_cargue oc
    // 			INNER JOIN cmx_vehiculos ve ON oc.ve_idcarro=ve.numdoc_vehiculo
    // 			INNER JOIN cmx_vehiculo2 b ON ve.numdoc_vehiculo=b.id_vehiculo
    // 			LEFT JOIN cmx_rndc_clase_vehiculo cl ON b.clase_vehiculo=cl.id
    // 			LEFT JOIN cmx_rndc_vehiculos_color colo ON b.color=colo.id
    // 			LEFT JOIN cmx_rndc_vehiculos_marcas ma ON b.marca=ma.id
    // 			INNER JOIN cmx_proveedores co ON oc.ve_id_conductor=co.numdoc_nexos
    // 			INNER JOIN cmx_clientes cli ON oc.cli_id=cli.id
    // 			LEFT JOIN cmx_trailer t ON oc.ve_idtrailer=t.id
    // 			LEFT JOIN cmx_ruta_puntosentrega rtp ON oc.id_remitente=rtp.id
    // 			LEFT JOIN cmx_remitente_destinatario rd ON rtp.cliente=rd.id
    // 			LEFT JOIN cmx_municipios mre ON rtp.municipio_entrega=mre.id
    // 			LEFT JOIN cmx_destinatarios_ss bdes ON rtp.id_punto=bdes.id_punto AND bdes.solicitud_servicio=oc.mer_idservicio
    // 			LEFT JOIN cmx_remitente_destinatario desi ON bdes.cliente=desi.id
    // 			LEFT JOIN cmx_municipios mde ON bdes.municipio_entrega=mde.id
    //             LEFT JOIN cmx_solicitud_vehiculo2 ss ON oc.mer_idservicio=ss.id
    //             LEFT JOIN cmx_agencias ag ON ss.agencia=ag.id
    // 			WHERE oc.id=" . $id;
    //         $consultpdf = $resultado->query($sqlpdf);
    //         return $consultpdf->fetch();
    //     } catch (PDOException $e) {
    //         $error = $e->getMessage();
    //         $this->_db2->rollBack();
    //     }
    // }

    public function Buscarprecipdf($id)
    {
        $resultado = $this->_db2->conectar();
        try {
            $sql = "SELECT * FROM cmx_planilla_detalle2 WHERE id_planilla=" . $id;
            $consultpdf = $resultado->query($sql);
            return $consultpdf->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db2->rollBack();
        }
    }

    public function Buscarsubasta($dato)
    {

        $resultado = $this->_db2->conectar();
        try {
            $sql =
                "SELECT s.id, s.fecha_inicio, s.fecha_finaliza,s.hora_finaliza, so.numer_solservicio,
				su.num_estudioseguridad, su.placa, su.flete_propuesto, su.usuario,
				su.fecha, su.hora,
				TIMESTAMPDIFF(HOUR, NOW(), CONCAT(s.fecha_finaliza,' ',s.hora_finaliza)) AS diferencia
				FROM cmx_subasta_flete su
				INNER JOIN cmx_subasta s
				ON su.id_suba=s.id
				INNER JOIN cmx_subasta_solicitud_servicio so
				ON s.id=so.id_subasta  AND su.id_suba_servicio=so.id
				WHERE su.placa LIKE '%" . $dato . "%'";
            $consultm = $resultado->query($sql);
            return $consultm->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db2->rollBack();
        }
    }

    public function Buscarflete($idservicio, $idsegu)
    {
        $resultado = $this->_db2->conectar();
        try {
            $sql =
                "SELECT id, placa, flete_propuesto
					FROM
					cmx_subasta_flete
					WHERE id_suba=" . $idservicio . "
					AND num_estudioseguridad=" . $idsegu;

            $consulta = $resultado->query($sql);
            return $consulta->fetch();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db2->rollBack();
        }
    }

    public function Actualiza_flete($id, $flete)
    {
        $resultado = $this->_db2->conectar();
        try {
            $resultado->prepare("update cmx_subasta_flete
				set flete_propuesto=:valor
				where id=:id")->execute(
                array(
                    ':valor' => $flete,
                    ':id' => $id,
                )
            );
            return 'true';
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db2->rollBack();
        }
    }

    public function Val_Subasta($idsuba)
    {
        $resultado = $this->_db2->conectar();
        try {

            $sqlv =
                " SELECT a.id AS id_flete
			 FROM cmx_subasta_flete a
			 INNER JOIN cmx_estado_subasta_flete b
			 ON a.id_suba_servicio=b.id_suba_flete
			 WHERE b.estado='Aprobado'
			 AND a.id_suba_servicio=" . $idsuba;
            $consultv = $resultado->query($sqlv);
            return $consultv->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db2->rollBack();
        }
    }

    public function Fin_Subasta($idsuba)
    {
        $resultado = $this->_db2->conectar();
        try {
            //cerrar la subasta, si hay algún flete aprobado
            $resultado->prepare("update cmx_estado_subasta_flete
				set estado=:valor
				where id_suba_flete=:id")->execute(
                array(
                    ':valor' => 'terminado',
                    ':id' => $idsuba,
                )
            );

            $resultado->prepare("update cmx_subasta
				set estado=:valor
				where id=:id")->execute(
                array(
                    ':valor' => 'terminado',
                    ':id' => $idsuba,
                )
            );

            return 'true';
            //cerrar los fletes

        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db2->rollBack();
        }
    }

    public function Validaestadof($id_suba)
    {
        $resultado = $this->_db2->conectar();
        try {
            $sql3 =
                "SELECT MAX(b.estado) AS uestado
			FROM
			cmx_subasta_flete a
			INNER JOIN cmx_estado_subasta_flete b
			ON a.id_suba=b.id_suba AND a.id=b.id_suba_flete
			WHERE a.id_suba=" . $id_suba;
            $consultv = $resultado->query($sql3);
            return $consultv->fetch();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db2->rollBack();
        }
    }

    public function Consultarsubasta($inicia, $final)
    {

        //$resultado= $this->_db3->conectar();
        try {
            $sql = "SELECT s.*, e.estado,
			TIMESTAMPDIFF(HOUR, NOW(),CONCAT(s.fecha_finaliza,'',s.hora_finaliza))
			FROM cmx_subasta s
			INNER JOIN cmx_estado_subasta e
			ON s.id=e.id_subasta
			WHERE
			s.fecha BETWEEN '" . $inicia . "' AND '" . $final . "'
			ORDER BY s.fecha, s.hora DESC";
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Consultarsubasta2($filtro, $inicia, $fin, $placa, $servicio)
    {
        $factual = date('Y-m-d');
        try {
            $this->_db3->beginTransaction();
            if ($filtro == 'fecha') {
                //Vencer la subasta si es del dia anterior
                // $sql_vencimiento = $this->_db3->prepare("SELECT s.id,sf.id_suba_flete FROM cmx_subasta s 
                // INNER JOIN cmx_estado_subasta_flete sf ON s.id=sf.id_suba
                // WHERE s.fecha BETWEEN '" . $inicia . "' AND '" . $fin . "' AND (TIMESTAMPDIFF(DAY, s.fecha, '" . $factual . "')>=1) AND s.estado='iniciado'");
                // Definir fechas para la prueba
                // $inicia = '2024-08-12';
                // $fin = '2024-08-13';
                // $factual = '2024-08-13';

                // // Consulta para obtener los registros que cumplen con las condiciones
                // $sql_vencimiento = $this->_db3->prepare("SELECT s.id, sf.id_suba_flete FROM cmx_subasta s 
                // INNER JOIN cmx_estado_subasta_flete sf ON s.id = sf.id_suba
                // WHERE s.fecha BETWEEN :inicia AND :fin AND (TIMESTAMPDIFF(DAY, s.fecha, :factual) >= 1) AND s.estado = 'iniciado'
                // ");
                // $sql_vencimiento->execute([':inicia' => $inicia, ':fin' => $fin, ':factual' => $factual]);
                // $resultados = $sql_vencimiento->fetchAll(PDO::FETCH_ASSOC);

                // // Si hay registros que cumplen la condición
                // if ($resultados) {
                //     foreach ($resultados as $subasta) {

                //         $subasta_id = $subasta['id'];
                //         $subasta_flete_id = $subasta['id_suba_flete'];
                //         $this->VenceSubasta($subasta_flete_id, $subasta_id);
                //     }
                // } else {
                //     // throw new Exception("No se encontraron subastas que cumplan con las condiciones.");
                //     // exit();
                //     $sql = "SELECT s.*, e.estado, TIMESTAMPDIFF(HOUR, NOW(),CONCAT(s.fecha_finaliza,'',s.hora_finaliza))
                //     FROM cmx_subasta s
                //     INNER JOIN cmx_estado_subasta e ON s.id=e.id_subasta
                //     WHERE s.fecha BETWEEN '" . $inicia . "' AND '" . $fin . "' ORDER BY s.fecha, s.hora DESC";
                //     $resultado = $this->_db3->query($sql);
                //     $resultado->setFetchMode(PDO::FETCH_ASSOC);

                //     return $resultado->fetchAll();
                // }

                // $sql = "SELECT s.*, e.estado, TIMESTAMPDIFF(HOUR, NOW(),CONCAT(s.fecha_finaliza,'',s.hora_finaliza))
                // FROM cmx_subasta s
                // INNER JOIN cmx_estado_subasta e ON s.id=e.id_subasta
                // WHERE s.fecha BETWEEN '" . $inicia . "' AND '" . $fin . "' ORDER BY s.fecha, s.hora DESC";
                // $resultado = $this->_db3->query($sql);
                // $resultado->setFetchMode(PDO::FETCH_ASSOC);

                $sql = "SELECT s.*, e.estado, TIMESTAMPDIFF(HOUR, NOW(), CONCAT(s.fecha_finaliza, ' ', s.hora_finaliza)) AS horas_restantes,
                        CASE 
                            WHEN TIMESTAMPDIFF(SECOND, NOW(), CONCAT(s.fecha_finaliza, ' ', s.hora_finaliza)) <= 0 THEN 1 
                        ELSE 0 
                        END AS subasta_vencida
                    FROM cmx_subasta s
                    INNER JOIN cmx_estado_subasta e ON s.id = e.id_subasta
                    WHERE s.fecha BETWEEN :inicia AND :fin
                    ORDER BY s.fecha, s.hora DESC";
                $resultado = $this->_db3->prepare($sql);
                $resultado->bindParam(':inicia', $inicia, PDO::PARAM_STR);
                $resultado->bindParam(':fin', $fin, PDO::PARAM_STR);
                $resultado->execute();
                $resultado->setFetchMode(PDO::FETCH_ASSOC);


                return $resultado->fetchAll();
            }

            if ($filtro == 'placa') {
                $sql = "SELECT s.*, e.estado,TIMESTAMPDIFF(HOUR, NOW(),CONCAT(s.fecha_finaliza,'',s.hora_finaliza))
                FROM cmx_subasta s
                INNER JOIN cmx_estado_subasta e ON s.id=e.id_subasta
                INNER JOIN cmx_subasta_flete sf ON s.id=sf.id_suba
                WHERE sf.placa='" . $placa . "' ORDER BY s.fecha, s.hora DESC";
                $resultado = $this->_db3->query($sql);
                $resultado->setFetchMode(PDO::FETCH_ASSOC);
                return $resultado->fetchall();
            }

            if ($filtro == 'ss') {
                $sql = "SELECT s.*, e.estado,TIMESTAMPDIFF(HOUR, NOW(),CONCAT(s.fecha_finaliza,'',s.hora_finaliza))
                FROM cmx_subasta s
                INNER JOIN cmx_estado_subasta e ON s.id=e.id_subasta
                INNER JOIN cmx_subasta_flete sf ON s.id=sf.id_suba
                INNER JOIN cmx_subasta_solicitud_servicio ss ON sf.id_suba_servicio=ss.id
                WHERE ss.numer_solservicio=" . $servicio . " ORDER BY s.fecha, s.hora DESC";
                $resultado = $this->_db3->query($sql);
                $resultado->setFetchMode(PDO::FETCH_ASSOC);
                return $resultado->fetchall();
            }
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Consulta_placas2($filtro, $inicia, $fin, $placa, $servicio)
    {
        try {
            if ($filtro == 'fecha') {
                $sql = "SELECT se.id_suba, se.placa FROM cmx_subasta s
                INNER JOIN cmx_subasta_flete se ON s.id=se.id_suba
                INNER JOIN cmx_estado_subasta e ON s.id=e.id_subasta
                WHERE s.fecha BETWEEN '" . $inicia . "' AND '" . $fin . "'
                GROUP BY se.id_suba, se.placa ORDER BY s.fecha_finaliza DESC";
                $resultado = $this->_db3->query($sql);
                $resultado->setFetchMode(PDO::FETCH_ASSOC);
                return $resultado->fetchall();
            }

            if ($filtro == 'placa') {
                $sql = "SELECT se.id_suba, se.placa FROM cmx_subasta_flete se
                INNER JOIN cmx_subasta s  ON se.id_suba=s.id
                INNER JOIN cmx_estado_subasta e ON s.id=e.id_subasta
                WHERE  se.placa='" . $placa . "'  GROUP BY se.num_estudioseguridad, se.id_suba, se.placa ORDER BY s.fecha_finaliza  DESC";
                $resultado = $this->_db3->query($sql);
                $resultado->setFetchMode(PDO::FETCH_ASSOC);
                return $resultado->fetchall();
            }

            if ($filtro == 'ss') {
                $sql = "SELECT se.id_suba, se.placa FROM cmx_subasta_flete se
                INNER JOIN cmx_subasta s  ON se.id_suba=s.id
                INNER JOIN cmx_estado_subasta e ON s.id=e.id_subasta
                INNER JOIN cmx_subasta_solicitud_servicio ss ON se.id_suba_servicio=ss.id
                WHERE ss.numer_solservicio=" . $servicio . " GROUP BY se.num_estudioseguridad, se.id_suba, se.placa ORDER BY s.fecha_finaliza  DESC";
                $resultado = $this->_db3->query($sql);
                $resultado->setFetchMode(PDO::FETCH_ASSOC);
                return $resultado->fetchall();
            }
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    #Consulta pera traser las solicitudes de servicio qeu tienen una subasta

    public function Consulta_solicitudes_Servicio($filtro, $inicia, $fin, $placa, $servicio)
    {
        try {
            // $this->_db3->beginTransaction();

            if ($filtro == 'fecha') {
                $sql = "SELECT DISTINCT ss.numer_solservicio AS 'solicitud_servicio', s.id AS 'subasta_id',pe.fecha_estimada_entrega AS fecha_cargue,pe.hora_estimada AS hora_cargue
                FROM cmx_subasta s
                INNER JOIN cmx_estado_subasta e ON s.id = e.id_subasta
                INNER JOIN cmx_subasta_solicitud_servicio ss ON s.id = ss.id_subasta
                 INNER JOIN cmx_solicitud_vehiculo2 se ON ss.numer_solservicio = se.nundoc_solicitud
                        INNER JOIN cmx_ruta_puntosentrega pe ON se.nundoc_solicitud=pe.cod_ini_ruta
                WHERE s.fecha BETWEEN :inicia AND :fin
                ORDER BY s.fecha DESC, s.hora DESC";
                $stmt = $this->_db3->prepare($sql);
                $stmt->bindParam(':inicia', $inicia);
                $stmt->bindParam(':fin', $fin);
                $stmt->execute();
                $stmt->setFetchMode(PDO::FETCH_ASSOC);
                $result = $stmt->fetchAll();
            } elseif ($filtro == 'placa') {
                $sql = "SELECT DISTINCT ss.numer_solservicio AS 'solicitud_servicio', s.id AS 'subasta_id',pe.fecha_estimada_entrega AS fecha_cargue,pe.hora_estimada AS hora_cargue
                        FROM cmx_subasta s
                        INNER JOIN cmx_estado_subasta e ON s.id = e.id_subasta
                        INNER JOIN cmx_subasta_flete sf ON s.id = sf.id_suba
                        INNER JOIN cmx_subasta_solicitud_servicio ss ON s.id = ss.id_subasta
                        INNER JOIN cmx_solicitud_vehiculo2 se ON ss.numer_solservicio = se.nundoc_solicitud
                        INNER JOIN cmx_ruta_puntosentrega pe ON se.nundoc_solicitud=pe.cod_ini_ruta
                        WHERE sf.placa = :placa
                        ORDER BY s.fecha, s.hora DESC";
                $stmt = $this->_db3->prepare($sql);
                $stmt->bindParam(':placa', $placa);
                $stmt->execute();
                $stmt->setFetchMode(PDO::FETCH_ASSOC);
                $result = $stmt->fetchAll();
            } elseif ($filtro == 'ss') {
                $sql = "SELECT  DISTINCT ss.numer_solservicio AS 'solicitud_servicio', s.id AS 'subasta_id'
                        FROM cmx_subasta s
                        INNER JOIN cmx_estado_subasta e ON s.id = e.id_subasta
                        INNER JOIN cmx_subasta_flete sf ON s.id = sf.id_subasta
                        INNER JOIN cmx_subasta_solicitud_servicio ss ON sf.id_suba_servicio = ss.id
                        WHERE ss.numer_solservicio = :servicio
                        ORDER BY s.fecha, s.hora DESC";
                $stmt = $this->_db3->prepare($sql);
                $stmt->bindParam(':servicio', $servicio);
                $stmt->execute();
                $stmt->setFetchMode(PDO::FETCH_ASSOC);
                $result = $stmt->fetchAll();
            }
            return $result;
        } catch (PDOException $e) {
            // $this->_db3->rollBack();
            // Manejo del error, como lanzar una excepción personalizada o registrar el error.
            throw new Exception("Error al realizar la consulta: " . $e->getMessage());
        }
    }


    public function Consultarsubasta_servicio($num_subasta)
    {
        try {
            $sql = "SELECT * FROM cmx_subasta_solicitud_servicio
 			WHERE id_subasta=" . $num_subasta . " GROUP BY numer_solservicio";
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Consultarsubastat($num_subasta)
    {
        try {
            $sqla = "SELECT sf.id, sf.num_estudioseguridad, sf.placa,sf.flete_sugerido, sf.flete_propuesto,
			se.estado AS estado_flete,se.acepta_flete, se.estado_sac, se.estado_final, sf.tarifa_promedio,
			CONCAT(pro.nombre,' ',pro.apellido1,' ',pro.apellido2) AS 'nombre_conductor',
			pro.numero_documento AS 'documento_conductor',ev.usuario
			FROM cmx_subasta s
			INNER JOIN cmx_subasta_flete sf ON s.id=sf.id_suba
			INNER JOIN cmx_estado_subasta_flete	se ON sf.id=se.id_suba_flete
			INNER JOIN cmx_estudio_vehiculo ev ON sf.num_estudioseguridad=ev.id_estudio
			INNER JOIN cmx_estudiov_completo evc ON ev.id_estudio=evc.id_estudio /*AND evc.estado='Aprobado'*/
			INNER JOIN cmx_proveedores pro ON evc.id_conductor=pro.numdoc_nexos
			WHERE s.id=" . $num_subasta . " GROUP BY sf.placa";
            /*WHERE s.id=" . $num_subasta . " AND sf.estado_vigencia=1 GROUP BY sf.placa";*/
            $resultado = $this->_db3->query($sqla);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function ValidarSubasta($num_subasta)
    {
        try {
            $sql = "SELECT se.* FROM cmx_subasta_flete sm
			INNER JOIN cmx_estado_subasta_flete se ON sm.id=se.id_suba_flete
			WHERE sm.id_suba=" . $num_subasta . " AND se.id = (SELECT MAX(t2.id)
			FROM cmx_estado_subasta_flete t2 WHERE t2.id_suba=" . $num_subasta . ")";
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function CanceleSubasta($idflete, $id_subasta)
    {
        $response = [];
        $resultado = $this->_db2->conectar();

        try {
            // Iniciar transacción
            $resultado->beginTransaction();

            // 1. Actualizar estado en la tabla `cmx_subasta`
            $sqlCancelaSub = "UPDATE cmx_subasta SET estado = :estado WHERE id = :idsub";
            $stmtCancelaSub = $resultado->prepare($sqlCancelaSub);
            $stmtCancelaSub->execute([':estado' => 'cancelada', ':idsub' => $id_subasta]);

            if ($stmtCancelaSub->rowCount() > 0) {
                // 2. Actualizar estado en la tabla `cmx_estado_subasta`
                $sqlStatusSuba = "UPDATE cmx_estado_subasta SET estado = :valor WHERE id_subasta = :id_sub";
                $stmtStatusSuba = $resultado->prepare($sqlStatusSuba);
                $stmtStatusSuba->execute([':valor' => 0, ':id_sub' => $id_subasta]);

                if ($stmtStatusSuba->rowCount() > 0) {
                    // 3. Actualizar estado en la tabla `cmx_subasta_flete`
                    $sqlSubaFlet = "UPDATE cmx_subasta_flete SET estado_vigencia = :estado WHERE id_suba = :idsub";
                    $stmtSubaFlet = $resultado->prepare($sqlSubaFlet);
                    $stmtSubaFlet->execute([':estado' => 'cancelada', ':idsub' => $id_subasta]);

                    if ($stmtSubaFlet->rowCount() > 0) {
                        // 4. Actualizar estado en la tabla `cmx_estado_subasta_flete`
                        $sqlEstSub = "UPDATE cmx_estado_subasta_flete d SET d.estado = :statu 
                        WHERE d.id_suba = :id_suba AND d.id_suba_flete=:id_flete";
                        // WHERE d.id_suba = :id_suba AND d.id_suba_flete NOT IN (:id_flete)";
                        $stmtEstSub = $resultado->prepare($sqlEstSub);
                        $stmtEstSub->execute([':statu' => 'terminado', ':id_suba' => $id_subasta, ':id_flete' => $idflete]);

                        if ($stmtEstSub->rowCount() > 0) {
                            // 5. Colocar en pendiente la solicitud de servicio
                            $sqlLibreSS = "UPDATE cmx_log_solicitudvehiculo sols
                            INNER JOIN cmx_solicitud_vehiculo2 ss ON sols.id_solictud = ss.nundoc_solicitud
                            INNER JOIN cmx_subasta_solicitud_servicio subss ON ss.nundoc_solicitud = subss.numer_solservicio
                            INNER JOIN cmx_subasta_flete sbf ON subss.id = sbf.id_suba_servicio
                            SET sols.estado = :estado WHERE sbf.id_suba = :sub";
                            $stmtLibreSS = $resultado->prepare($sqlLibreSS);
                            $stmtLibreSS->execute([':estado' => 'Pendiente', ':sub' => $id_subasta]);

                            if ($stmtLibreSS->rowCount() > 0) {
                                // 6. Actualizar estado en la tabla `cmx_estudiov_completo`
                                $sqlLibreEstudio = "UPDATE cmx_estudiov_completo evc
                                INNER JOIN cmx_subasta_flete sf ON evc.id_estudio=sf.num_estudioseguridad
                                SET evc.estado_subasta = 'cancelado_subasta', evc.estado_actu=0 WHERE sf.id_suba =:id_suba";
                                //     $sqlLibreEstudio = " UPDATE cmx_estudiov_completo evc
                                // INNER JOIN cmx_estudio_vehiculo ev ON evc.id_estudio = ev.id_estudio
                                // -- LEFT  JOIN cmx_log_solicitudvehiculo2 sl ON ev.id_solicitud = sl.id
                                // INNER JOIN cmx_subasta_solicitud_servicio ss ON 
                                // INNER JOIN cmx_subasta_flete sf ON sl.id_solictud = sf.num_estudioseguridad
                                // SET evc.estado_subasta = 'cancelado_subasta', evc.estado_actu = 0
                                // WHERE sf.id_suba = :id_suba";
                                $stmtLibreEstudio = $resultado->prepare($sqlLibreEstudio);
                                $stmtLibreEstudio->execute([':id_suba' => $id_subasta]);

                                if ($stmtLibreEstudio->rowCount() > 0) {
                                    // Confirmar transacción
                                    $resultado->commit();
                                    $response = ['success' => true, 'message' => "Subasta Cancelada Sin Novedades"];
                                } else {
                                    throw new Exception("Error al actualizar la tabla cmx_estudiov_completo");
                                }
                            } else {
                                throw new Exception("Error al actualizar la tabla cmx_log_solicitudvehiculo");
                            }
                        } else {
                            throw new Exception("Error al actualizar la tabla cmx_estado_subasta_flete");
                        }
                    } else {
                        throw new Exception("Error al actualizar la tabla cmx_subasta_flete");
                    }
                } else {
                    throw new Exception("Error al actualizar la tabla cmx_estado_subasta");
                }
            } else {
                throw new Exception("Error al actualizar la tabla cmx_subasta");
            }
        } catch (Exception $th) {
            // Rollback en caso de error
            $resultado->rollBack();

            // Registrar el error en un archivo de log
            $errorMessage = "Error en la transacción al cancelar la subasta: " . $th->getMessage() . " " . date("Y-m-d H:i:s") . " " . $_SESSION["usuario"]["nom_usuario"] . "\n";
            $logFilePath = 'error_log.txt'; // Ajusta la ruta según la estructura de tu proyecto
            error_log($errorMessage, 3, $logFilePath);

            // Verificar si el archivo de log se ha escrito correctamente
            if (!file_exists($logFilePath)) {
                error_log("No se pudo crear el archivo de log: $logFilePath\n", 3, $logFilePath);
            }

            // Mostrar un mensaje amigable al usuario
            $response = ['success' => false, 'message' => 'Ha ocurrido un error al cancelar la subasta. Por favor, inténtelo nuevamente más tarde.</br>Por favor, comuníquese con el equipo de desarrollo.'];
        }

        // Cerrar subasta
        return $response;

        // $response = [];
        // $resultado = $this->_db2->conectar();
        // try {
        //     $resultado->beginTransaction();
        //     //actualizar estado decisorio en cmx_subasta
        //     $cancela_sub = $resultado->prepare("UPDATE cmx_subasta SET estado=:estado WHERE id=:idsub")->execute([':estado' => 'cancelada', ':idsub' => $id_subasta]);
        //     if ($cancela_sub) {
        //         //estados de subasta
        //         $status_suba = $resultado->prepare("UPDATE cmx_estado_subasta SET estado=:valor WHERE id_subasta=:id_sub")->execute([':valor' => 0, ':id_sub' => $id_subasta]);
        //         if ($status_suba) {
        //             //actualizar cmx_subasta_flete
        //             $suba_flet = $resultado->prepare("UPDATE cmx_subasta_flete SET estado_vigencia=:estado WHERE id_suba=:idsub")->execute([':estado' => 'cancelada', ':idsub' => $id_subasta]);
        //             if ($suba_flet) {
        //                 //terminacion de subasta
        //                 $estsub = $resultado->prepare("UPDATE cmx_estado_subasta_flete d SET d.estado=:statu WHERE d.id_suba=:id_suba AND d.id_suba_flete NOT IN(:id_flete)")
        //                     ->execute([
        //                         ':statu' => 'terminado',
        //                         ':id_suba' => $id_subasta,
        //                         ':id_flete' => $idflete,
        //                     ]);
        //                 if ($estsub) {
        //                     //colocar en pendiente la solicitud de servicio
        //                     $libre_ss = $resultado->prepare("UPDATE cmx_log_solicitudvehiculo sols
        // 						INNER JOIN cmx_solicitud_vehiculo2 ss on sols.id_solictud=ss.nundoc_solicitud
        // 						INNER JOIN cmx_subasta_solicitud_servicio subss on ss.nundoc_solicitud=subss.numer_solservicio
        // 						INNER JOIN cmx_subasta_flete sbf on subss.id=sbf.id_suba_servicio
        // 						SET sols.estado=:estado WHERE sbf.id_suba=:sub")->execute([':estado' => 'Pendiente', ':sub' => $id_subasta]);

        //                     if ($libre_ss) {
        //                         $libre_estudio = $resultado->prepare("UPDATE cmx_estudiov_completo evc
        // 							INNER JOIN cmx_estudio_vehiculo ev ON evc.id_estudio=ev.id
        // 							INNER JOIN cmx_log_solicitudvehiculo2 sl ON ev.id_solicitud=sl.id
        // 							INNER JOIN cmx_subasta_flete sf ON sl.id_solictud=sf.num_estudioseguridad
        // 							SET evc.estado_subasta='cancelado_subasta', evc.estado_actu=0
        // 							WHERE sf.id_suba=:id_suba")->execute([':id_suba' => $id_subasta]);
        //                         if ($libre_estudio) {
        //                             $resultado->commit();
        //                             $response = ['success' => true, 'mesage' => "Subasta Cancelada Sin Novedades"];
        //                         } else {
        //                             $response = ['success' => false, 'mesage' => "Subasta no cancelada"];
        //                         }
        //                     } else {
        //                         $response = "No se ejecuto tabla cmx_estudiov_completo";
        //                     }
        //                 } else {
        //                     $response = "No se ejecuto la actualizacion de la tabla cmx_estado_subasta_flete";
        //                 }
        //             } else {
        //                 //return mensaje cmx_subasta_flete
        //                 $response = "No se ejecuto la actualizacion de la tabla cmx_subasta_flete";
        //             }
        //         } else {
        //             //return mensaje cmx_estado_subasta
        //             $response = "No se ejecuto la actualizacion de la tabla cmx_estado_subasta";
        //         }
        //     } else {
        //         //resturn mensaje cmx_subasta
        //         $response = "No se ejecuto la actualizacion de la tabla cmx_subasta";
        //     }

        //     // if ($cancela_sub && $status_suba && $suba_flet && $estsub && $libre_ss) {
        //     //     $response = "Subasta Cancelada Sin Novedades";
        //     // }
        //     // return $response;
        // } catch (PDOException $th) {
        //     // $error = $e->getMessage();
        //     $resultado->rollBack();
        //     // Registrar el error en un archivo de log en la raíz del proyecto
        //     $errorMessage = "Error en la transacción al cancelar la subasta: " . $th->getMessage() . " " . date("Y-m-d H:i:s") . " " . $_SESSION["usuario"]["nom_usuario"] . "\n";
        //     $logFilePath = 'error_log.txt'; // Ajusta la ruta según la estructura de tu proyecto
        //     error_log($errorMessage, 3, $logFilePath);

        //     // Verificar si el archivo de log se ha escrito correctamente
        //     if (!file_exists($logFilePath)) {
        //         error_log("No se pudo crear el archivo de log: $logFilePath\n", 3, $logFilePath);
        //     }

        //     // Mostrar un mensaje amigable al usuario
        //     $response = ['success' => false, 'message' => 'Ha ocurrido un error al cancelar subasta. Por favor, inténtelo nuevamente más tarde.</br>Por favor comunicarse con el equipo de desarrollo.'];
        // }
        // //cerrar subasta
        // return $response;
    }

    //Vencimiento de subasta
    public function VenceSubasta($idflete, $id_subasta)
    {

        var_dump($idflete);
        var_dump($id_subasta);
        exit();

        // 1. Actualizar estado en la tabla `cmx_subasta`
        $sqlCancelaSub = $this->_db3->prepare("UPDATE cmx_subasta SET estado = 'vencida' WHERE id = :subasta_id");
        $sqlCancelaSub->execute([':subasta_id' => $id_subasta]);

        if ($sqlCancelaSub) {
            // 2. Actualizar estado en la tabla `cmx_estado_subasta`
            $sqlStatusSuba = "UPDATE cmx_estado_subasta SET estado = :valor WHERE id_subasta = :id_sub";
            $stmtStatusSuba = $this->_db3->prepare($sqlStatusSuba);
            $stmtStatusSuba->execute([':valor' => 0, ':id_sub' => $id_subasta]);

            if ($stmtStatusSuba->rowCount() > 0) {
                // 3. Actualizar estado en la tabla `cmx_subasta_flete`
                $sqlSubaFlet = "UPDATE cmx_subasta_flete SET estado_vigencia = :estado WHERE id_suba = :idsub";
                $stmtSubaFlet = $this->_db3->prepare($sqlSubaFlet);
                $stmtSubaFlet->execute([':estado' => 'cancelada', ':idsub' => $id_subasta]);

                if ($stmtSubaFlet->rowCount() > 0) {
                    // 4. Actualizar estado en la tabla `cmx_estado_subasta_flete`
                    $sqlEstSub = "UPDATE cmx_estado_subasta_flete SET estado = :statu WHERE id_suba = :id_suba AND id_suba_flete = :id_flete";
                    $stmtEstSub = $this->_db3->prepare($sqlEstSub);
                    $stmtEstSub->execute([':statu' => 'terminado', ':id_suba' => $id_subasta, ':id_flete' => $idflete]);

                    if ($stmtEstSub->rowCount() > 0) {
                        // 5. Colocar en pendiente la solicitud de servicio
                        $sqlLibreSS = "UPDATE cmx_log_solicitudvehiculo sols
                                    INNER JOIN cmx_solicitud_vehiculo2 ss ON sols.id_solictud = ss.nundoc_solicitud
                                    INNER JOIN cmx_subasta_solicitud_servicio subss ON ss.nundoc_solicitud = subss.numer_solservicio
                                    INNER JOIN cmx_subasta_flete sbf ON subss.id = sbf.id_suba_servicio
                                    SET sols.estado = :estado WHERE sbf.id_suba = :sub";
                        $stmtLibreSS = $this->_db3->prepare($sqlLibreSS);
                        $stmtLibreSS->execute([':estado' => 'Pendiente', ':sub' => $id_subasta]);

                        if ($stmtLibreSS->rowCount() > 0) {
                            // 6. Actualizar estado en la tabla `cmx_estudiov_completo`
                            $sqlLibreEstudio = "UPDATE cmx_estudiov_completo evc
                                        INNER JOIN cmx_subasta_flete sf ON evc.id_estudio = sf.num_estudioseguridad
                                        SET evc.estado_subasta = 'cancelado_subasta', evc.estado_actu = 0 WHERE sf.id_suba = :id_suba";
                            $stmtLibreEstudio = $this->_db3->prepare($sqlLibreEstudio);
                            $stmtLibreEstudio->execute([':id_suba' => $id_subasta]);
                        } else {
                            throw new Exception("Error al actualizar la tabla cmx_log_solicitudvehiculo");
                        }
                    } else {
                        throw new Exception("Error al actualizar la tabla cmx_estado_subasta_flete");
                    }
                } else {
                    throw new Exception("Error al actualizar la tabla cmx_subasta_flete");
                }
            } else {
                throw new Exception("Error al actualizar la tabla cmx_estado_subasta");
            }
        } else {
            throw new Exception("Error al actualizar la tabla cmx_subasta");
        }
    }


    public function Consulta_estado_estudio($id_suba)
    {
        try {
            $sql = "SELECT s.id, sf.id_suba_servicio,
				v.placa,
				pro.numero_documento,
				concat(pro.nombre,' ',pro.apellido1) AS 'nombre',
				ev.id_estudio,
				evc.estado, sf.flete_propuesto
				FROM cmx_subasta s
				INNER JOIN cmx_subasta_flete sf ON s.id=sf.id_suba
				INNER JOIN cmx_estudio_vehiculo ev ON sf.num_estudioseguridad=ev.id_estudio
				INNER JOIN cmx_estudiov_completo evc ON ev.id_estudio=evc.id_estudio AND evc.estado='Aprobado'	AND evc.estado_actu=1
				INNER JOIN cmx_vehiculos v ON evc.id_vehiculo=v.numdoc_vehiculo
				INNER JOIN cmx_proveedores pro ON v.id_conductor=pro.numdoc_nexos
				WHERE s.id=" . $id_suba;
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Consulta_fletes($id_suba)
    {
        try {
            //ENCUENTRA EL MENOR FLETE PROPUESTO QUE ESTE APROBADO
            $sql = "SELECT a.id AS id_flete, a.id_suba, a.num_estudioseguridad, a.placa,
			a.flete_sugerido, a.flete_propuesto AS mfletepropuesto, vv.cant_viajes,
			a.tarifa_promedio AS total_tarifa,
			max(lg.fecha) AS 'fecha', max(lg.hora) AS 'hora'
			FROM cmx_subasta_flete a
			INNER JOIN cmx_subasta_solicitud_servicio se ON a.id_suba_servicio=se.id
			INNER JOIN cmx_estudio_vehiculo ev ON a.num_estudioseguridad=ev.id_estudio
			INNER JOIN cmx_estudiov_completo ec ON ev.id_estudio=ec.id_estudio AND ec.estado='Aprobado' AND ec.estado_actu=1
			INNER JOIN cmx_logestudio_com lg ON ec.id_estudio_c=lg.id_completo
			INNER JOIN cmx_solicitud_vehiculo2  ser ON se.numer_solservicio=ser.nundoc_solicitud
			INNER JOIN cmx_detalle_mercancia2 d ON ser.idpareja_origen_destino=d.id
			INNER JOIN cmx_vehiculos vv ON a.placa=vv.placa
			WHERE a.id_suba=" . $id_suba . "
			AND a.flete_propuesto=
			(SELECT  MIN(b.flete_propuesto)
			FROM cmx_subasta_flete b
			INNER JOIN cmx_subasta_solicitud_servicio se ON b.id_suba_servicio=se.id
			INNER JOIN cmx_estudio_vehiculo ev ON b.num_estudioseguridad=ev.id_estudio
			INNER JOIN cmx_estudiov_completo ec ON ev.id_estudio=ec.id_estudio AND ec.estado='Aprobado' AND ec.estado_actu=1
			INNER JOIN cmx_vehiculos vv ON b.placa=vv.placa
			INNER JOIN cmx_solicitud_vehiculo2  ser ON se.numer_solservicio=ser.nundoc_solicitud
			INNER JOIN cmx_detalle_mercancia2 d ON ser.idpareja_origen_destino=d.id
			WHERE b.id_suba=" . $id_suba . ")
			GROUP BY a.id_suba, a.num_estudioseguridad";
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Actualiza_subasta1($id_subasta, $id_flete, $estado, $placa)
    {
        $resultado = $this->_db2->conectar();
        $factual = date('Y-m-d');
        $horactual = date('H:i:s');
        $id_usuario = $_SESSION["usuario"]["nom_usuario"];
        try {
            //Actualizar todos los fletes excepto el ganador
            $resultado->prepare("update cmx_estado_subasta_flete e
                SET e.estado=:statu
                WHERE e.id_suba=:idsubasta  AND
                e.id_suba_flete NOT IN(:idflete)
                ")->execute(
                array(
                    ':statu' => 'terminado',
                    ':idsubasta' => $id_subasta,
                    ':idflete' => $id_flete,
                )
            );

            //Actualiza el flete ganador
            $resultado->prepare("update cmx_estado_subasta_flete e
            inner join cmx_subasta_flete sf
            on e.id_suba_flete=sf.id
            set e.estado=:statu
            where sf.placa=:placa and e.id_suba=:idsubasta")->execute(
                array(
                    ':statu' => $estado,
                    ':placa' => $placa,
                    ':idsubasta' => $id_subasta,
                )
            );

            if ($estado == 'Ganador') {
                //estado subasta
                $resultado->prepare("
                update cmx_estado_subasta_flete e
                inner join cmx_subasta_flete sf
                on e.id_suba_flete=sf.id
                set e.estado=:statu,
                e.estado_final=:estfinal
                where sf.placa=:placa and e.id_suba=:idsubasta
                ")->execute(
                    array(
                        ':statu' => $estado,
                        ':estfinal' => 'Ganador',
                        ':placa' => $placa,
                        ':idsubasta' => $id_subasta,
                    )
                );
                //estado de la solicitud en bandeja de operaciones
                $resultado->prepare("update cmx_solicitud_vehiculo2 a
                    INNER JOIN cmx_subasta_solicitud_servicio b
                    ON a.nundoc_solicitud=b.numer_solservicio
                    INNER JOIN cmx_log_solicitudvehiculo c
                    ON a.id=c.id_solictud
                    SET a.estado=:estado,
                    c.estado=:estado
                    WHERE b.id_subasta=:idsub")->execute(
                    array(
                        ':estado' => 'Realizada',
                        ':idsub' => $id_subasta,
                    )
                );
                //descontar disponibilidad de solicitud de estudio
                $resultado->prepare("update cmx_solicitud_vehiculo2 a
                    INNER JOIN  cmx_subasta_solicitud_servicio b
                    ON a.nundoc_solicitud=b.numer_solservicio
                    SET a.cant_disponible=(a.cant_disponible-1)
                    WHERE b.id_subasta=:idsub")->execute(
                    array(
                        ':idsub' => $id_subasta,
                    )
                );
            }

            if ($estado == 'pendiente_aprobacion') {

                $resultado->prepare("update cmx_estado_subasta_flete e
                inner join cmx_subasta_flete sf
                on e.id_suba_flete=sf.id
                set e.estado=:statu
                where sf.placa=:placa and e.id_suba=:idsubasta
                ")->execute(
                    array(
                        ':statu' => $estado,
                        ':placa' => $placa,
                        ':idsubasta' => $id_subasta,
                    )
                );

                $resultado->prepare("update cmx_solicitud_vehiculo2 a
                    INNER JOIN cmx_subasta_solicitud_servicio b
                    ON a.nundoc_solicitud=b.numer_solservicio
                    INNER JOIN cmx_log_solicitudvehiculo c
                    ON a.nundoc_solicitud=c.id_solictud
                    SET a.estado=:estado,
                    a.estado_secundario=:estado_secundario,
                    c.estado=:estado
                    WHERE b.id_subasta=:idsub
                ")->execute(
                    array(
                        ':estado' => 'En_subasta',
                        ':idsub' => $id_subasta,
                        ':estado_secundario' => 'pendiente_aprobacion_sac',
                    )
                );
            }

            $resultado->prepare("update cmx_estado_subasta
                set estado=:est
                where id_subasta=:idsubasta
                ")->execute(
                array(
                    ':est' => 3,
                    ':idsubasta' => $id_subasta,
                )
            );

            $resultado->prepare("insert into cmx_operacion_subasta(id,n_subasta,fecha,hora,usuario,area,estado_letra)
            values(:in,:subasta,:fecha,:hora,:usuario,:area,:estado_letra)")->execute(
                array(
                    ':in' => null,
                    ':subasta' => $id_subasta,
                    ':area' => 'OP',
                    ':fecha' => $factual,
                    ':hora' => $horactual,
                    ':usuario' => $id_usuario,
                    ':estado_letra' => $estado,
                )
            );

            return 'true';
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db2->rollBack();
        }
    }

    public function Busca_Regla()
    {
        try {
            $sql = "SELECT valor FROM cmx_reglas_modulo
					WHERE nombre_modulo='ES'";
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetch();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Datos_sujetos_vencimiento($num_estudio)
    {
        try {
            $sql = "SELECT v.num_soat,
			v.vence_soat,
			dv.tecnomecanica,
			dv.tecno_fecha_vigencia,
			con.nombre_eps,
			con.fecha_vence_eps,
			pro.rndc_categoria_licencia,
			pro.rndc_numero_licencia,
			pro.rndc_vencimiento_licencia,
			con.nombre_entidad,
			con.vence_curso
			FROM cmx_estudiov_completo  es
			INNER JOIN cmx_vehiculo2 v
			ON  es.id_vehiculo=v.id_vehiculo
			INNER JOIN cmx_proveedores pro
			ON es.id_conductor=pro.numdoc_nexos
			INNER JOIN cmx_detalle_vehiculo dv
			ON v.id_vehiculo=dv.id_vehiculo
			INNER JOIN cmx_detalle_conductor con
			ON es.id_conductor=con.id_proveedor
			WHERE es.id_estudio=" . $num_estudio . "
			AND es.estado='Aprobado'";
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetch();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Valida_Vigencia_Estudio($num_estudio, $placa)
    {
        try {
            $sql = "SELECT sp.fecha, sp.hora, ec.estado
				FROM cmx_subasta_flete s
				INNER JOIN cmx_solicitudes_preestudio sp
				ON  s.num_estudioseguridad=sp.id
				INNER JOIN cmx_log_solicitudvehiculo2 se
				ON sp.id=se.id_solictud
				INNER JOIN cmx_estudio_vehiculo ev
				ON se.id=ev.id_solicitud
				INNER JOIN cmx_estudiov_completo ec
				ON ev.id=ec.id_estudio AND ec.estado_actu=1
				INNER JOIN cmx_vehiculos v
				ON ec.id_vehiculo=v.numdoc_vehiculo
				WHERE sp.id=" . $num_estudio . " AND sp.placa='" . $placa . "'
				GROUP BY s.num_estudioseguridad";
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Valida_aprobacion_flete($id_subasta)
    {
        try {
            $sql =
                "SELECT sf.*
			FROM cmx_subasta_flete su
			INNER JOIN cmx_estado_subasta_flete sf
			ON su.id=sf.id_suba_flete
			WHERE su.id_suba=" . $id_subasta . "
			AND sf.id_suba=" . $id_subasta;
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Consulta_orden_enremesa()
    {
        try {
            $fecha = date('Y-m-d');
            $sql = "SELECT oc.id, pe1.id AS id_remitente,
			pe2.id AS id_destinatario, oc.mer_idservicio,
			oc.ca_pesocargue, pe1.id_punto,
			rema.nombre AS remitente,
			desa.nombre AS destinatario,
            v.placa AS placa
			FROM cmx_orden_cargue oc
			INNER JOIN cmx_ruta_puntosentrega pe1
			ON oc.mer_idservicio=pe1.cod_ini_ruta
			AND oc.id_remitente=pe1.id
			INNER JOIN cmx_remitente_destinatario rema
			ON pe1.cliente=rema.id
			INNER JOIN cmx_destinatarios_ss pe2
			ON oc.mer_idservicio=pe2.solicitud_servicio
			AND pe1.id_punto=pe2.id_punto
			INNER JOIN cmx_remitente_destinatario desa
			ON pe2.cliente=desa.id
            INNER JOIN cmx_vehiculos v ON oc.ve_id_conductor=v.id_conductor
            WHERE pe1.tipo='punto recogida' AND
			pe2.tipo='punto entrega' AND (oc.estado_remesa='pendiente' OR pe2.estado_destinatario='PENDIENTE')
			AND oc.estado=1 AND oc.fecha_orden='" . $fecha . "' AND v.numdoc_vehiculo=oc.ve_idcarro";
            // -- WHERE pe1.tipo='punto recogida'  AND
            // -- 	pe2.tipo='punto entrega' AND
            // -- 	oc.estado_remesa='pendiente' AND
            // --     pe2.estado_destinatario='PENDIENTE' AND
            // -- 	oc.estado=1 AND oc.fecha_orden='" . $fecha . "' AND v.numdoc_vehiculo=oc.ve_idcarro";
            // -- // oc.estado=1 AND oc.fecha_orden='" . $fecha . "' GROUP BY oc.mer_idservicio";
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }


    public function Consulta_dato_solicitud($idservicio)
    {
        try {

            $sql =
                "SELECT a.nombre as nombrea, p.empaque,
				d.tipo_carga, d.valor_mercancia,
				d.naturaleza,d.cantidad_empaque, d.volumen_total,
				d.peso_neto_tn, d.tipo_mercancia,
				cli.nombre,
				cli.documento, cli.digito_verificacion,
				cli.direccion, CONCAT(mn.municipio,'-',mn.depto) ciudad,
				cli.tipo_documento, d.tipo_servicio_mer, cli.codigo_postal,
                se.observaciones
				FROM cmx_solicitud_vehiculo2 se
				INNER JOIN cmx_agencias a
				ON se.agencia=a.id
				INNER JOIN cmx_detalle_mercancia2 d
				ON se.idpareja_origen_destino=d.id
				INNER JOIN cmx_para_tipo_empaque p
				ON d.tipo_empaque=p.id
				INNER JOIN cmx_cotizaciones_serviciocliente co
				ON d.n_cotizacion=co.n_cotizacion
				INNER JOIN cmx_clientes cli
				ON co.nit=cli.documento
				INNER JOIN cmx_municipios mn
				ON cli.ciudad=mn.id
				WHERE se.nundoc_solicitud=" . $idservicio;
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Consulta_rem_dest($idservicio)
    {
        try {
            $sql =
                "SELECT CONCAT(m.municipio,'/',m.depto) as city, cl.nombre,
			p1.direccion_entrega, p1.fecha_estimada_entrega,
			p1.hora_estimada, p1.tipo, p1.telefono, p1.lugar
			FROM
			cmx_solicitud_vehiculo2  se
			INNER JOIN cmx_ruta_puntosentrega p1
			ON se.nundoc_solicitud=p1.cod_ini_ruta
			INNER JOIN cmx_municipios m
			ON p1.municipio_entrega=m.id
			INNER JOIN cmx_remitente_destinatario cl
			ON p1.cliente=cl.id
			WHERE  se.nundoc_solicitud=" . $idservicio;
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Consulta_origen_destino($idservicio)
    {
        try {
            $sql =
                "SELECT CONCAT(mn.municipio,'-',mn.depto) AS origen,
			CONCAT(md.municipio,'-',md.depto) AS destino
			FROM cmx_solicitud_vehiculo2  se
			INNER JOIN cmx_detalle_mercancia2 dt
			ON se.idpareja_origen_destino=dt.id
			INNER JOIN cmx_municipios mn
			ON dt.origen=mn.rndc_codigo_ciudad
			INNER JOIN cmx_municipios md
			ON dt.destino=md.rndc_codigo_ciudad
			WHERE se.nundoc_solicitud=" . $idservicio;
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Consulta_Remitente($idservicio, $remit)
    {
        try {
            $sqlr =
                "SELECT
			pr.direccion_entrega, pr.fecha_estimada_entrega,
			pr.hora_estimada, pr.tipo, pr.telefono, pr.lugar, CONCAT(m.municipio,'-',m.depto)ciudad,
			cl.nombre, cl.documento
			FROM cmx_ruta_puntosentrega pr
			INNER JOIN cmx_municipios m
			ON pr.municipio_entrega=m.id
			INNER JOIN cmx_remitente_destinatario cl
			ON pr.cliente=cl.id
			WHERE pr.id=" . $remit . " AND
			pr.cod_ini_ruta=" . $idservicio;
            $resultado = $this->_db3->query($sqlr);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Consulta_Destinatario($idservicio, $remit, $destina)
    {
        try {
            $sqlr = "SELECT
			pr.direccion_entrega, pr.fecha_estimada_entrega,
			pr.hora_estimada, pr.tipo, pr.telefono, pr.lugar,
			CONCAT(m.municipio,'-',m.depto)ciudad,
			cl.nombre, cl.documento, pr.observacion
			FROM cmx_destinatarios_ss pr
			INNER JOIN cmx_municipios m
			ON pr.municipio_entrega=m.id
			INNER JOIN cmx_remitente_destinatario cl
			ON pr.cliente=cl.id
			WHERE pr.id=" . $destina . " AND
			pr.solicitud_servicio=" . $idservicio;
            $resultado = $this->_db3->query($sqlr);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Datos_vehiculo($orden)
    {
        try {
            $sql =
                "SELECT v.placa, p.numero_documento,
				p.digito_verificacion,
				p.nombre, p.apellido1, p.apellido2
				FROM cmx_orden_cargue oc
				INNER JOIN cmx_vehiculos v
				ON oc.ve_idcarro=v.numdoc_vehiculo
				INNER JOIN cmx_proveedores p
				ON oc.ve_id_conductor=p.numdoc_nexos
				WHERE oc.id=" . $orden;
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Datos_precinto($orden)
    {
        try {
            $sqlp = "SELECT * FROM cmx_planilla_detalle2
			WHERE id_planilla=" . $orden;
            $resultado = $this->_db3->query($sqlp);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Insertar_remesa($num_orden, $id_remite, $id_dest, $sol_servicio, $r_contado, $rcontra_remesa, $valor, $seguro, $hcargue, $fcargue, $hdescarga, $fdescarga, $cantidad_real, $tipo_nove, $desc_nove, $facturara, $fecha_creacion, $hora_creacion, $nomarchivo, $id_puntorem, $horaspactocargue, $minutospactocargue, $horaspactodescargue, $minutospactodescargue, $obsercliente)
    {
        $resultado = $this->_db2->conectar();
        $resultado2 = $this->_db2->conectar();
        //santizar
        (int) $num_orden;
        (int) $id_remite;
        (int) $id_dest;
        (int) $sol_servicio;
        (int) $r_contado;
        (int) $rcontra_remesa;
        (int) $valor;
        (int) $seguro;
        (int) $cantidad_real;

        try {
            $factual = date('Y-m-d');
            $horactual = date('H:i:s');
            $id_usuario = $_SESSION["usuario"]["nom_usuario"];

            $empresa_id = $_SESSION['usuario']['empresa_id'];
            $sqlm = "select numero_actual from cmx_maestro where tipo='RM' and numero_actual>=numero_inicial and numero_actual<=numero_final and empresa_id='" . $empresa_id . "'";
            $number = $resultado->query($sqlm);
            $number1 = $number->fetch();
            $number2 = $number1['numero_actual'];
            $operacion = ($number2 + 1);
            $resultado->prepare('update cmx_maestro set numero_actual=:numero where tipo=:tipo and empresa_id=:empresa')->execute(array(':numero' => $operacion, ':tipo' => 'RM', ':empresa' => $empresa_id));

            $ruta = "../public/files/remesa/" . $number2 . "/";
            $rutab = "public/files/remesa/" . $number2 . "/";
            $estado_manifi = 'pendiente';

            //registro
            $resultado2->prepare("insert into cmx_remesa(id,id_destinatario,remesa_contado,remesa_contraentrega,valor_declarado,aplica_seguro,hora_cargue,fecha_cargue,hora_descarga,fecha_descargue,cantidad_real_cargada,tipo_novedad,descripcion_novedad,
			soporte_novedad,nombre_archivo,facturar_a,fecha_creacion,hora_creacion,usuario_creacion,estado,mer_idservicio,id_remitente,id_punto_remitente,horaspactocarga,minutospactocarga,horaspactodescargue,minutospactodescargue,estado_manifiesto,empresa_id,obs_cliente) 
            values(:num_orden,:id_dest,:r_contado,
			:rcontra_remesa,:valor,:seguro,:hcargue,:fcargue,:hdescarga,:fdescarga,:creal,:tipo_nove,:desc_nove,:ruta,:namearchivo,
			:facturara,:factual,:horactual,:id_usuario,:statu,:solicitud_servicio,:id_remitente,:puntorem,:can_horas_cargue,:can_min_cargue,:can_horas_descargue,:can_min_descargue,:estado_manifiesto,:empresa_id,:obscliente)")
                ->execute(
                    array(
                        ':num_orden' => $number2,
                        ':id_dest' => $id_dest,
                        ':r_contado' => $r_contado,
                        ':rcontra_remesa' => $rcontra_remesa,
                        ':valor' => $valor,
                        ':seguro' => $seguro == '' ? '0' : $seguro,
                        ':hcargue' => $hcargue,
                        ':fcargue' => $fcargue,
                        ':hdescarga' => $hdescarga,
                        ':fdescarga' => $fdescarga,
                        ':creal' => $cantidad_real,
                        ':tipo_nove' => $tipo_nove,
                        ':desc_nove' => $desc_nove,
                        ':facturara' => $facturara,
                        ':factual' => $factual,
                        ':horactual' => $horactual,
                        ':id_usuario' => $id_usuario,
                        ':ruta' => $rutab,
                        ':namearchivo' => $nomarchivo,
                        ':statu' => 1,
                        ':solicitud_servicio' => $sol_servicio,
                        ':id_remitente' => $id_remite,
                        ':puntorem' => $id_puntorem,
                        ':can_horas_cargue' => $horaspactocargue,
                        ':can_min_cargue' => $minutospactocargue,
                        ':can_horas_descargue' => $horaspactodescargue,
                        ':can_min_descargue' => $minutospactodescargue,
                        ':estado_manifiesto' => $estado_manifi,
                        ':empresa_id' => $empresa_id,
                        ':obscliente' => $obsercliente

                    )
                );

            if ($resultado2) {
                //insertar remsa+orden
                $resultado->prepare("insert into cmx_remesa_ordencargue
					(id,id_orden_cargue,id_remesa,estado)
					values(null,:orden,:remesa,:status)")->execute(
                    array(
                        ':orden' => $num_orden,
                        ':remesa' => $number2,
                        ':status' => 1,
                    )
                );
                //crear estado remesa
                $resultado->prepare("insert into cmx_estado_remesa
					(id,id_remesa,estado,fecha,hora,usuario)values(null,:idremesa,:statu,:fecha,:hora,:usuario)")->execute(
                    array(
                        ':idremesa' => $number2,
                        ':statu' => 1,
                        ':fecha' => $factual,
                        ':hora' => $horactual,
                        ':usuario' => $id_usuario,
                    )
                );
                //crear directorio
                if (!file_exists($rutab)) {
                    mkdir($rutab, 0777, true);
                }

                /* Actualizar el estado del destinatarios */
                $estado_destinatario = 'REALIZADO';
                $resultado->prepare("update cmx_destinatarios_ss set estado_destinatario=:estado_destinatario where id=:detinatario_id")->execute(
                    array(
                        ':detinatario_id' => $id_dest,
                        ':estado_destinatario' => $estado_destinatario,
                    )
                );

                //actualizar estado de la orden de cargue asociada a la remesa
                $estadoremi = 'completado';
                $resultado->prepare("update cmx_orden_cargue set estado_remesa=:estadoremesa where id=:orden")->execute(
                    array(
                        ':orden' => $num_orden,
                        ':estadoremesa' => $estadoremi,
                    )
                );
            }

            $return["status"] = true;
            $return["numero_documento"] = $number2;
            $return["error"] = "";
            return $return;
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db2->rollBack();
            $_msg_error = "Error";
            $return["status"] = false;
            $return["numero_documento"] = "";
            $return["error"] = $_msg_error;
            return $return;
        }
    }

    public function Dato_Id_Remesa($idorden, $remit, $dest)
    {
        try {
            $sql = "SELECT rm.id as id_remesa
			FROM cmx_remesa rm
			INNER JOIN cmx_remesa_ordencargue rmo
			ON rm.id=rmo.id_remesa
			INNER JOIN cmx_orden_cargue oc
			ON rmo.id_orden_cargue=oc.id
			WHERE rmo.id_orden_cargue=" . $idorden . "
			AND rm.id_destinatario=" . $dest . "
			AND oc.id_remitente=" . $remit . "
			AND rm.estado=1";
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetch();
        } catch (Exception $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Consulta_Remesatb($ini, $hasta, $cliente, $filtro)
    {
        try {
            if ($filtro == 1) {
                $sql =
                    "SELECT ro.id_remesa, ro.id_orden_cargue,
				r.descripcion_novedad,  r.fecha_creacion, r.hora_creacion, ro.estado,
				o.mer_idservicio, v.placa, pro.nombre,
				pro.apellido1, pro.apellido2,
				t.placa AS placatrailer
				FROM cmx_remesa r
				INNER JOIN cmx_remesa_ordencargue ro ON r.id=ro.id_remesa
				INNER JOIN cmx_orden_cargue o ON o.id=ro.id_orden_cargue
				INNER JOIN cmx_vehiculos v ON o.ve_idcarro=v.numdoc_vehiculo
				INNER JOIN cmx_proveedores pro ON o.ve_id_conductor=pro.numdoc_nexos
				INNER JOIN cmx_clientes cl ON o.cli_id=cl.id
				LEFT JOIN cmx_trailer t ON o.ve_idtrailer=t.id
				WHERE r.fecha_creacion BETWEEN '" . $ini . "' AND '" . $hasta . "'";
                $sql_total_remesas = "SELECT COUNT(*) AS total_remesas FROM cmx_remesa WHERE fecha_creacion BETWEEN '" . $ini . "' AND '" . $hasta . "'";
            }
            if ($filtro == 2) {
                $sql =
                    "SELECT ro.id_remesa, ro.id_orden_cargue,
				r.descripcion_novedad,  r.fecha_creacion, r.hora_creacion, ro.estado,
				o.mer_idservicio, v.placa, pro.nombre,
				pro.apellido1, pro.apellido2,
				t.placa AS placatrailer
				FROM cmx_remesa r
				INNER JOIN cmx_remesa_ordencargue ro ON r.id=ro.id_remesa
				INNER JOIN cmx_orden_cargue o ON o.id=ro.id_orden_cargue
				INNER JOIN cmx_vehiculos v ON o.ve_idcarro=v.numdoc_vehiculo
				INNER JOIN cmx_proveedores pro ON o.ve_id_conductor=pro.numdoc_nexos
				INNER JOIN cmx_clientes cl ON o.cli_id=cl.id
				LEFT JOIN cmx_trailer t ON o.ve_idtrailer=t.id
				WHERE
				cl.id=" . $cliente;

                $sql_total_remesas = "SELECT COUNT(*) AS total_remesas
				FROM cmx_remesa r
				INNER JOIN cmx_remesa_ordencargue ro ON r.id=ro.id_remesa
				INNER JOIN cmx_orden_cargue o ON o.id=ro.id_orden_cargue
				INNER JOIN cmx_vehiculos v ON o.ve_idcarro=v.numdoc_vehiculo
				INNER JOIN cmx_proveedores pro ON o.ve_id_conductor=pro.numdoc_nexos
				INNER JOIN cmx_clientes cl ON o.cli_id=cl.id
				LEFT JOIN cmx_trailer t ON o.ve_idtrailer=t.id
				WHERE
				cl.id=" . $cliente;
            }
            if ($filtro == 3) {
                $sql =
                    "SELECT ro.id_remesa, ro.id_orden_cargue,
				r.descripcion_novedad,  r.fecha_creacion, r.hora_creacion, ro.estado,
				o.mer_idservicio, v.placa, pro.nombre,
				pro.apellido1, pro.apellido2,
				t.placa AS placatrailer
				FROM cmx_remesa r
				INNER JOIN cmx_remesa_ordencargue ro ON r.id=ro.id_remesa
				INNER JOIN cmx_orden_cargue o ON o.id=ro.id_orden_cargue
				INNER JOIN cmx_vehiculos v ON o.ve_idcarro=v.numdoc_vehiculo
				INNER JOIN cmx_proveedores pro ON o.ve_id_conductor=pro.numdoc_nexos
				INNER JOIN cmx_clientes cl ON o.cli_id=cl.id
				LEFT JOIN cmx_trailer t ON o.ve_idtrailer=t.id
				WHERE cl.id=" . $cliente . " AND
				r.fecha_creacion BETWEEN '" . $ini . "' AND '" . $hasta . "'";
                $sql_total_remesas = "SELECT COUNT(*) AS total_remesas 
				FROM cmx_remesa r
				INNER JOIN cmx_remesa_ordencargue ro ON r.id=ro.id_remesa
				INNER JOIN cmx_orden_cargue o ON o.id=ro.id_orden_cargue
				INNER JOIN cmx_vehiculos v ON o.ve_idcarro=v.numdoc_vehiculo
				INNER JOIN cmx_proveedores pro ON o.ve_id_conductor=pro.numdoc_nexos
				INNER JOIN cmx_clientes cl ON o.cli_id=cl.id
				LEFT JOIN cmx_trailer t ON o.ve_idtrailer=t.id
				WHERE cl.id=" . $cliente . " AND
				r.fecha_creacion BETWEEN '" . $ini . "' AND '" . $hasta . "'";
                // $sql_total_remesas = "SELECT COUNT(*) AS total_remesas FROM cmx_remesa WHERE id=" . $cliente . " AND fecha_creacion BETWEEN '" . $ini . "' AND '" . $hasta . "'";

            }
            $response = [
                'remesas' => $this->_db3->query($sql)->fetchall(),
                'total_remesas' => $this->_db3->query($sql_total_remesas)->fetch()['total_remesas']
            ];
            return $response;
        } catch (Exception $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function ver_Remesa($rem, $ord)
    {
        try {
            $sql =
                "SELECT ro.id_remesa, ro.id_orden_cargue,
					r.fecha_creacion, r.aplica_seguro, r.descripcion_novedad,
					r.remesa_contado, r.remesa_contraentrega,
					ag.nombre AS agencia,
					ve.placa,
					pro.nombre, pro.apellido1, pro.apellido2, pro.numero_documento,
					rr.direccion_entrega AS remdireccion, cli.nombre AS remnombre, mn.municipio AS remcity,
					rd.direccion_entrega AS desdireccion, clid.nombre AS desnombre, mnd.municipio AS descity,
					r.valor_declarado,
					b.tipo_mercancia, b.naturaleza, ser.nundoc_solicitud,
					r.soporte_novedad, r.nombre_archivo
					FROM cmx_remesa r
					INNER JOIN cmx_remesa_ordencargue ro ON r.id=ro.id_remesa
					INNER JOIN cmx_orden_cargue o ON o.id=ro.id_orden_cargue
					INNER JOIN cmx_solicitud_vehiculo2 ser ON o.mer_idservicio=ser.nundoc_solicitud
					INNER JOIN cmx_agencias ag ON ser.agencia=ag.id
					INNER JOIN cmx_vehiculos ve ON o.ve_idcarro=ve.numdoc_vehiculo
					INNER JOIN cmx_proveedores pro ON o.ve_id_conductor=pro.numdoc_nexos
					INNER JOIN cmx_ruta_puntosentrega rr ON o.id_remitente=rr.id
					INNER JOIN cmx_remitente_destinatario cli ON rr.cliente=cli.id
					INNER JOIN cmx_municipios mn ON rr.municipio_entrega=mn.id
					INNER JOIN cmx_destinatarios_ss rd ON r.id_destinatario=rd.id
					INNER JOIN cmx_remitente_destinatario clid ON rd.cliente=clid.id
					INNER JOIN cmx_municipios mnd ON rd.municipio_entrega=mnd.id
					INNER JOIN cmx_detalle_mercancia2 b ON ser.idpareja_origen_destino=b.id
					WHERE ro.id_remesa=" . $rem . "
					AND ro.id_orden_cargue=" . $ord;
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetch();
        } catch (Exception $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Anula_Remesa($id_remesa)
    {
        //la anulación de la remsa se da cuando no tiene ningun manifiesto
        $resultado = $this->_db2->conectar();
        try {
            $resultado->prepare("update cmx_remesa_ordencargue
				set  estado=:status
				where id_remesa=:id")->execute(
                array(
                    ':status' => 0,
                    ':id' => $id_remesa,
                )
            );
            return 'true';
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db2->rollBack();
            return 'false';
        }
    }

    public function Cliente_lista()
    {
        try {
            $sql = "SELECT id, nombre, documento
			FROM cmx_clientes
			WHERE estado=1
			ORDER BY nombre ASC";
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (Exception $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function ValidaRemMan($id_remesa)
    {
        try {
            $sql = "SELECT * FROM cmx_manifiesto_remesa
			WHERE id_remesa=" . $id_remesa . " AND estado=1";
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetch();
        } catch (Exception $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Actualiza_Remesa($id_remesa, $seguro, $contad, $contra)
    {
        $resultado = $this->_db2->conectar();
        try {
            $resultado->prepare("update cmx_remesa
				set  remesa_contado=:conta,
				remesa_contraentrega=:b,
				aplica_seguro=:seg
				where id=:id")->execute(
                array(
                    ':conta' => $contad,
                    ':b' => $contra,
                    ':seg' => $seguro,
                    ':id' => $id_remesa,
                )
            );
            return 'true';
        } catch (Exception $e) {
            $error = $e->getMessage();
            $this->_db2->rollBack();
        }
    }

    public function Consulta_Remesapdf($remesa, $orden)
    {
        try {
            $sql =
                "SELECT ro.id_remesa, ro.id_orden_cargue,
				r.fecha_creacion, r.aplica_seguro, r.descripcion_novedad,
				r.remesa_contado, r.remesa_contraentrega,
				ag.nombre AS agencia,
				ve.placa,
				pro.nombre, pro.apellido1, pro.apellido2, pro.numero_documento,
				rr.direccion_entrega AS remdireccion, cli.nombre AS remnombre, mn.municipio AS remcity,
				rd.direccion_entrega AS desdireccion, clid.nombre AS desnombre, mnd.municipio AS descity,
				r.valor_declarado,b.tipo_mercancia, b.naturaleza, b.cantidad_empaque, b.peso_neto_tn, b.volumen_total,
				em.empaque, ser.nundoc_solicitud,o.mer_idservicio,rt.rta_ministerio,rd.observacion
                FROM cmx_remesa r
                INNER JOIN cmx_remesa_ordencargue ro ON r.id=ro.id_remesa
                INNER JOIN cmx_orden_cargue o ON o.id=ro.id_orden_cargue
                INNER JOIN cmx_solicitud_vehiculo2 ser ON o.mer_idservicio=ser.nundoc_solicitud
                INNER JOIN cmx_agencias ag ON ser.agencia=ag.id
                INNER JOIN cmx_vehiculos ve ON o.ve_idcarro=ve.numdoc_vehiculo
                INNER JOIN cmx_proveedores pro ON o.ve_id_conductor=pro.numdoc_nexos
                INNER JOIN cmx_ruta_puntosentrega rr ON o.id_remitente=rr.id
                INNER JOIN cmx_remitente_destinatario cli ON rr.cliente=cli.id
                INNER JOIN cmx_municipios mn ON rr.municipio_entrega=mn.id
                INNER JOIN cmx_destinatarios_ss rd ON r.id_destinatario=rd.id
                INNER JOIN cmx_remitente_destinatario clid ON rd.cliente=clid.id
                INNER JOIN cmx_municipios mnd ON rd.municipio_entrega=mnd.id
                INNER JOIN cmx_detalle_mercancia2 b ON ser.idpareja_origen_destino=b.id
                INNER JOIN cmx_para_tipo_empaque em ON b.tipo_empaque=em.id
                LEFT JOIN cmx_manifiesto_remesa mr ON mr.id_remesa=r.id
                LEFT JOIN cmx_manifiesto m ON m.id=mr.id_manifiesto
                LEFT JOIN cmx_remesas_transmision rt ON rt.id_remesa=r.id
					WHERE ro.id_remesa=" . $remesa . " AND ro.id_orden_cargue=" . $orden;
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetch();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Busca_Tipo_Contenedor()
    {
        try {
            $sql = "SELECT * FROM cmx_tipo_contenedor
			WHERE estado=1 ORDER BY nombre";
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (Exception $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Municio_Contenedor()
    {
        try {
            $sql = "SELECT * FROM cmx_municipios
			WHERE pais='COLOMBIA' ORDER BY depto, municipio";
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (Exception $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function respuesta_operaciones($subasta, $prop, $tari, $rent, $util, $placa_gana, $numsubasta)
    {
        try {
            $factual = date('Y-m-d');
            $horactual = date('H:i:s');
            $id_usuario = $_SESSION["usuario"]["nom_usuario"];
            if ($util > 15) { //Ganador
                $sql = "INSERT INTO cmx_operacion_subasta(id,n_subasta,flete_ganador,tarifa_ganador,rentabilidad,utilidad,placa,estado,fecha,hora,usuario,area,estado_letra)
                VALUES(null,'" . $subasta . "','" . $prop . "','" . $tari . "','" . $rent . "','" . $util . "','" . $placa_gana . "',1,'" . $factual . "','" . $horactual . "','" . $id_usuario . "','OP','Ganador')";
                $resultado = $this->_db3->query($sql);
                if ($resultado) {
                    $sql2 = "UPDATE cmx_subasta_flete
                           SET flete_propuesto=" . $prop . "
                           WHERE id=" . $subasta;

                    $resultado2 = $this->_db3->query($sql2);

                    $sql3 = "UPDATE cmx_estado_subasta_flete e
                       inner join cmx_subasta_flete sf
                       on e.id_suba_flete=sf.id
                       set e.estado='Ganador',
                       e.estado_final='Ganador'
                       where sf.placa='" . $placa_gana . "' and e.id_suba=" . $numsubasta;

                    $resultado3 = $this->_db3->query($sql3);

                    $sql4 = "UPDATE cmx_solicitud_vehiculo2  ser
                    INNER JOIN cmx_subasta_solicitud_servicio ss
                    ON ser.nundoc_solicitud=ss.numer_solservicio
                    INNER JOIN cmx_subasta_flete f
                    ON ss.id=f.id_suba_servicio
                    INNER JOIN cmx_estado_subasta_flete e
                    ON f.id=e.id_suba_flete
                    SET ser.estado_secundario='Ganador'
                    WHERE e.id_suba=" . $numsubasta;

                    $resultado4 = $this->_db3->query($sql4);
                }
                if ($resultado && $resultado2 && $resultado3) {
                    return 'true';
                } else {
                    return 'false';
                }
            } else { //devolver a sac
                $sql = "INSERT INTO cmx_operacion_subasta(id,n_subasta,flete_ganador,tarifa_ganador,rentabilidad,utilidad,placa,estado,fecha,hora,usuario,area,estado_letra)
                VALUES(null,'" . $subasta . "','" . $prop . "','" . $tari . "','" . $rent . "','" . $util . "','" . $placa_gana . "',0,'" . $factual . "','" . $horactual . "','" . $id_usuario . "','OP','pendiente_aprobacion')";
                $resultado = $this->_db3->query($sql);
                if ($resultado) {
                    $sql2 = "UPDATE cmx_subasta_flete
                    SET flete_propuesto=" . $prop . "
                    WHERE id=" . $subasta;
                    $resultado2 = $this->_db3->query($sql2);

                    $sql3 = "UPDATE cmx_estado_subasta_flete e
                    inner join cmx_subasta_flete sf
                    on e.id_suba_flete=sf.id
                    set e.estado='pendiente_aprobacion'
                    where sf.placa='" . $placa_gana . "' and e.id_suba=" . $numsubasta;
                    $resultado3 = $this->_db3->query($sql3);

                    $sql4 = "UPDATE cmx_solicitud_vehiculo2  ser
                    INNER JOIN cmx_subasta_solicitud_servicio ss
                    ON ser.nundoc_solicitud=ss.numer_solservicio
                    INNER JOIN cmx_subasta_flete f
                    ON ss.id=f.id_suba_servicio
                    INNER JOIN cmx_estado_subasta_flete e
                    ON f.id=e.id_suba_flete
                    SET ser.estado_secundario='pendiente_aprobacion_sac'
                    WHERE e.id_suba=" . $numsubasta;
                    $resultado4 = $this->_db3->query($sql4);
                }
                if (
                    $resultado && $resultado2 && $resultado3
                ) {
                    return 'true';
                } else {
                    return 'false';
                }
            }
        } catch (Exception $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    /* fUNCIONES PARA ASIGNACION DE CITAS --AND dt.itr='Si'*/
    public function Validar_Numero_Manifiesto($manifiesto)
    {
        $sql = $this->_db3->prepare("SELECT m.id FROM cmx_manifiesto m
        INNER JOIN cmx_manifiesto_remesa mr ON m.id=mr.id_manifiesto
        INNER JOIN cmx_remesa_ordencargue ro ON mr.id_remesa=ro.id_remesa
        INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue=oc.id
        INNER JOIN cmx_solicitud_vehiculo2 ss ON oc.mer_idservicio=ss.nundoc_solicitud
        INNER JOIN cmx_detalle_mercancia2 dt ON ss.idpareja_origen_destino=dt.id AND dt.itr='Si'
        WHERE m.id=:manifiesto");
        $sql->bindParam(':manifiesto', $manifiesto, PDO::PARAM_STR);
        $sql->execute();
        $resultado = $sql->fetch(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Validar_Manifiesto_Cita($manifiesto)
    {
        $estado = 'ACTIVO';
        $fecha = date('Y-m-d');
        $sql = $this->_db3->prepare("SELECT manifiesto FROM cmx_asigancio_cita WHERE manifiesto=:manifiesto AND esatdo_cita=:estado_cita AND fecha=:fecha");
        $sql->bindParam(':manifiesto', $manifiesto, PDO::PARAM_STR);
        $sql->bindParam(':estado_cita', $estado, PDO::PARAM_STR);
        $sql->bindParam(':fecha', $fecha, PDO::PARAM_STR);
        $sql->execute();
        $resultado = $sql->fetch(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Asignar_citas($datos)
    {
        $response = [];
        // $documento = null;
        $ruta = 'public/files/citas/' . $datos['numero_cita'] . '/';
        // Verificar si la carpeta ya existe
        if (!is_dir($ruta)) {
            // Crear la carpeta
            if (mkdir($ruta, 0777, true)) {
                if ($datos['documento_cita'] !== null) {
                    $nombre = $datos['documento_cita']['name'];
                    $rutaTemporal = $datos['documento_cita']['tmp_name'];
                    $carpeta = $ruta;
                    $src = $carpeta . $nombre;
                    move_uploaded_file($rutaTemporal, $src);
                    $sql = $this->_db3->prepare("INSERT INTO cmx_asigancio_cita(puerto,numero_cita,fecha_cita,hora_cita,manifiesto,documento,ruta_documento,usuario,fecha,hora,esatdo_cita) VALUES(:puerto,:numero_cita,:fecha_cita,:hora_cita,:manifiesto,:documento,:ruta_documento,:usuario,:fecha,:hora,:esatdo_cita)");
                    $sql->bindParam(':puerto', $datos['puerto'], PDO::PARAM_STR);
                    $sql->bindParam(':numero_cita', $datos['numero_cita'], PDO::PARAM_STR);
                    $sql->bindParam(':fecha_cita', $datos['fecha_cita'], PDO::PARAM_STR);
                    $sql->bindParam(':hora_cita', $datos['hora_cita'], PDO::PARAM_STR);
                    $sql->bindParam(':manifiesto', $datos['maniesto'], PDO::PARAM_STR);
                    $sql->bindParam(':documento', $nombre, PDO::PARAM_STR);
                    $sql->bindParam(':ruta_documento',  $ruta, PDO::PARAM_STR);
                    $sql->bindParam(':usuario', $datos['user'], PDO::PARAM_STR);
                    $sql->bindParam(':fecha', $datos['fecha'], PDO::PARAM_STR);
                    $sql->bindParam(':hora', $datos['hora'], PDO::PARAM_STR);
                    $sql->bindParam(':esatdo_cita', $datos['estado'], PDO::PARAM_STR);
                    $sql->execute();
                    if ($sql) {
                        $response =  true;
                    } else {
                        $response =  false;
                    }
                } else {
                    // Cuando no hay documentos para subir
                    $mensajeError = "No se han proporcionado documentos para subir." . date("Y-m-d");
                    error_log($mensajeError . "\n", 3, "error_log.txt");
                    // throw new Exception("Error al guardar proveedor 1");
                }
            } else {
                $response = "Hubo un error al crear la carpeta ' $ruta'.";
            }
        } else {
            // $response = 'Error al guardar';
            if ($datos['documento_cita'] !== null) {
                $nombre = $datos['documento_cita']['name'];
                $rutaTemporal = $datos['documento_cita']['tmp_name'];
                $carpeta = $ruta;
                $src = $carpeta . $nombre;
                move_uploaded_file($rutaTemporal, $src);
                $sql = $this->_db3->prepare("INSERT INTO cmx_asigancio_cita(puerto,numero_cita,fecha_cita,hora_cita,manifiesto,documento,ruta_documento,usuario,fecha,hora,esatdo_cita) VALUES(:puerto,:numero_cita,:fecha_cita,:hora_cita,:manifiesto,:documento,:ruta_documento,:usuario,:fecha,:hora,:esatdo_cita)");
                $sql->bindParam(':puerto', $datos['puerto'], PDO::PARAM_STR);
                $sql->bindParam(':numero_cita', $datos['numero_cita'], PDO::PARAM_STR);
                $sql->bindParam(':fecha_cita', $datos['fecha_cita'], PDO::PARAM_STR);
                $sql->bindParam(':hora_cita', $datos['hora_cita'], PDO::PARAM_STR);
                $sql->bindParam(':manifiesto', $datos['maniesto'], PDO::PARAM_STR);
                $sql->bindParam(':documento', $nombre, PDO::PARAM_STR);
                $sql->bindParam(':ruta_documento',  $ruta, PDO::PARAM_STR);
                $sql->bindParam(':usuario', $datos['user'], PDO::PARAM_STR);
                $sql->bindParam(':fecha', $datos['fecha'], PDO::PARAM_STR);
                $sql->bindParam(':hora', $datos['hora'], PDO::PARAM_STR);
                $sql->bindParam(':esatdo_cita', $datos['estado'], PDO::PARAM_STR);
                $sql->execute();
                if ($sql) {
                    $response =  true;
                } else {
                    $response =  false;
                }
            } else {
                // Cuando no hay documentos para subir
                $mensajeError = "No se han proporcionado documentos para subir." . date("Y-m-d");
                error_log($mensajeError . "\n", 3, "error_log.txt");
                // throw new Exception("Error al guardar proveedor 1");
            }
        }
        return $response;
    }

    public function Listar_citas_asignadas()
    {
        $sql = $this->_db3->prepare("SELECT * FROM cmx_asigancio_cita");
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Confirmar_Cita_Puertos($num_cita)
    {
        $esatdo = 'ACTIVO';
        $confirmacion = 'Confirmada';
        $sql = $this->_db3->prepare("UPDATE cmx_asigancio_cita SET esatdo_cita=:estado, confirmacion=:confirmacion WHERE id=:num_cita");
        $sql->bindParam(':estado', $esatdo, PDO::PARAM_STR);
        $sql->bindParam(':confirmacion', $confirmacion, PDO::PARAM_STR);
        $sql->bindParam(':num_cita', $num_cita, PDO::PARAM_STR);
        $sql->execute();
        if ($sql) {
            return 'true';
        } else {
            return 'false';
        }
    }

    public function Cancelar_Cita_Puerto($num_cita)
    {
        $esatdo = 'CANCELADO';
        $sql = $this->_db3->prepare("UPDATE cmx_asigancio_cita SET esatdo_cita=:estado WHERE id=:num_cita");
        $sql->bindParam(':estado', $esatdo, PDO::PARAM_STR);
        $sql->bindParam(':num_cita', $num_cita, PDO::PARAM_STR);
        $sql->execute();
        if ($sql) {
            return 'true';
        } else {
            return 'false';
        }
    }

    public function Vencer_Cita_Puerto($num_cita)
    {
        $esatdo = 'VENCIDA';
        $sql = $this->_db3->prepare("UPDATE cmx_asigancio_cita SET esatdo_cita=:estado WHERE id=:num_cita");
        $sql->bindParam(':estado', $esatdo, PDO::PARAM_STR);
        $sql->bindParam(':num_cita', $num_cita, PDO::PARAM_STR);
        $sql->execute();
        if ($sql) {
            return 'true';
        } else {
            return 'false';
        }
    }

    public function Buscar_cita_numero($buscador)
    {
        $sql = $this->_db3->prepare("SELECT * FROM cmx_asigancio_cita WHERE numero_cita=:buscador");
        $sql->bindParam(':buscador', $buscador, PDO::PARAM_STR);
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Buscar_cita_manifiesto($buscador)
    {
        $sql = $this->_db3->prepare("SELECT * FROM cmx_asigancio_cita WHERE manifiesto=:buscador");
        $sql->bindParam(':buscador', $buscador, PDO::PARAM_STR);
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }
}
