<?php
include "../application/Config.php";
include '../application/Conexion.php';
include '../application/Model.php';
// $Prefiltro = new servicioclienteModel;
$Data = new Consultas;
session_start();
switch ($_REQUEST['action']) {

    case 'ciudades_solicitudtodos':
        $ori = $_REQUEST["origen"];
        $des = $_REQUEST["destino"];
        $sql = '
		SELECT CONCAT(municipio,"-",depto) AS origi
		 FROM cmx_municipios
		WHERE rndc_codigo_ciudad=' . $ori . '
		';
        $result = $Data->getConsulta($sql);

        $sql2 = '
			SELECT CONCAT(municipio,"-",depto) AS desti
			 FROM cmx_municipios
			WHERE rndc_codigo_ciudad=' . $des . '
		';
        $result1 = $Data->getConsulta($sql2);

        //$return["result"] = $result["rowsData"];
        //$return["result1"] = $result1["rowsData"];
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        if ($result2 > 1) {
            $return["result"] = $result2["rowsData"];
        } else {
            $return["result"] = $result2;
        }

        break;

    case 'datos_sugerencia':
        $idcotizacion = $_REQUEST["idcotizacion"];
        $idservicio = $_REQUEST["idservicio"];
        $sql = "SELECT a.nombre_cliente,
		v.tipo_carga, v.tipo_mercancia, v.peso_bruto_kg,
		v.peso_neto_kg, v.peso_neto_tn, v.flete, a.tmer_utili,
		s.id, pv.nombre AS 'tipovehiculo', v.total_tarifa
		FROM cmx_cotizaciones_serviciocliente a
		INNER JOIN cmx_detalle_mercancia2 v ON a.n_cotizacion=v.n_cotizacion
		INNER JOIN cmx_para_tipo_vehiculo pv ON v.tipo_vehiculo=pv.id
		LEFT JOIN cmx_solicitud_vehiculo2 s ON a.n_cotizacion=s.n_cotizacion
		WHERE a.n_cotizacion=" . $idcotizacion;
        $result = $Data->getConsulta($sql);
        //$return["result"] = $result["rowsData"];
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'consulta_fletespropuesto':
        $idcotizacion = $_REQUEST["idcotizacion"];
        $idservicio = $_REQUEST["idservicio"];
        $sql = "SELECT f.id, ef.id as idestado, ef.estado, ef.fecha, ef.hora, ef.usuario,f.flete_nuevo, ef.estado_actual
				FROM cmx_operaciones_flete f
				INNER JOIN cmx_operaciones_estadoflete ef
				ON f.id=ef.id_fletepropuesto
				WHERE f.n_cotizacion=" . $idcotizacion . "
				AND f.id_servicio=" . $idservicio . "
				ORDER BY fecha, hora ASC  ";
        $result = $Data->getConsulta($sql);
        //$return["result"] = $result["rowsData"];
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'Anular_Propuesta':
        $idtbpropuesta = $_POST["idtbpropuesta"];
        $idtbestado = $_POST["idtbestado"];
        $sql = "UPDATE cmx_operaciones_estadoflete
			SET estado=3,
			estado_actual=0
			WHERE id_fletepropuesto=$idtbpropuesta
			AND id=$idtbestado";
        $result = $Data->ejecuteRegistro($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'Consultar_estado':
        $s_cotizacion = $_POST["s_cotizacion"];
        $s_idservicio = $_POST["s_idservicio"];
        $sql = "SELECT * FROM
			cmx_operaciones_flete aa INNER JOIN
			cmx_operaciones_estadoflete bb ON
			aa.id_servicio=bb.id_servicio
			WHERE bb.id_servicio=" . $s_idservicio . " AND bb.estado=2 AND bb.estado_actual=1";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'Crear_Sugerencia':
        $fecha = date('Y-m-d');
        $hora = date('G:i:s');
        $id_usuario = $_SESSION["usuario"]["nom_usuario"];
        $s_cotizacion = $_REQUEST["s_cotizacion"];
        $s_idservicio = $_REQUEST["s_idservicio"];
        $s_fletecep = $_REQUEST["s_fletecep"];
        $s_tarifa = $_REQUEST["s_tarifa"];
        $s_calculo = $_REQUEST["s_calculo"];
        $s_renta = $_REQUEST["s_renta"];
        $s_rentab = $_REQUEST["s_rentab"];
        $s_cliente = $_REQUEST["s_cliente"];
        //$s_total=$_REQUEST["s_total"];
        $s_total = 0;
        //poner los anteriores en cero y el actual en 1
        $sqld = "SELECT id as idestados
			FROM cmx_operaciones_estadoflete
			WHERE n_cotizacion=$s_cotizacion
			AND id_servicio=$s_idservicio
			";
        $resultz = $Data->getConsulta($sqld);
        if ($resultz) {
            foreach ($resultz["rowsData"] as $key => $value) {
                $idestado = $value["idestados"];
                //actualizar todos a cero
                $sqlu = "UPDATE cmx_operaciones_estadoflete
						SET estado_actual=0
						WHERE id=$idestado";
                $resultu = $Data->ejecuteRegistro($sqlu);
            }
        }
        $sql = "INSERT INTO cmx_operaciones_flete
			(id,n_cotizacion,id_servicio,flete_nuevo,
			tarifa_anterior,utilidad_nueva,rentabilidad_anterior,
			rentabilidad_nueva,total,fecha,hora,usuario,cliente)
			VALUES(null,$s_cotizacion,$s_idservicio,$s_fletecep,$s_tarifa,
			$s_calculo,$s_renta,$s_rentab,$s_total,'$fecha','$hora','$id_usuario',
			'$s_cliente')";
        $result = $Data->ejecuteRegistro($sql);
        if ($result) {
            $sqlm = "SELECT max(id) AS idf FROM cmx_operaciones_flete
				WHERE n_cotizacion=$s_cotizacion AND id_servicio=$s_idservicio";
            $resultf = $Data->getConsulta($sqlm);
            $idpropuesto = $resultf["rowsData"][0]["idf"];
            if ($resultf) {
                $sql2 = "INSERT INTO cmx_operaciones_estadoflete(id,id_fletepropuesto,n_cotizacion,id_servicio,estado,fecha,hora,usuario,estado_actual)
			 		VALUES(null,$idpropuesto,$s_cotizacion,$s_idservicio,2,'$fecha',
			 		'$hora','$id_usuario',1)";
                $result2 = $Data->ejecuteRegistro($sql2);
            }
        }
        $return["result"] = $result["rowsData"];
        break;

    case 'consultarfechas':
        $id = $_REQUEST["idvehiculo"];
        $sql = "
			SELECT  v.id AS elid, a.num_soat,
				a.vence_soat,d.tecnomecanica, d.tecno_fecha_vigencia,
				pepe.nombre, pepe.rndc_numero_licencia,
				pepe.rndc_vencimiento_licencia
			FROM cmx_vehiculos v
			INNER JOIN cmx_vehiculo2 a
			ON v.id=a.id_vehiculo
			INNER JOIN cmx_detalle_vehiculo d
			ON a.id_vehiculo=d.id_vehiculo
			INNER JOIN cmx_proveedores pepe
			ON pepe.id=v.id_conductor
			WHERE v.id=" . $id . "";

        $result = $Data->getConsulta($sql);
        //$return["result"] = $result["rowsData"];
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'consultarvehiculo':
        $idvehiculo = $_REQUEST["idvehiculo"];
        $sql = "
			SELECT v.*, a.*, d.*
			FROM cmx_vehiculos v
			INNER JOIN cmx_vehiculo2 a
			ON v.id=a.id_vehiculo
			INNER JOIN cmx_detalle_vehiculo d
			ON a.id_vehiculo=d.id_vehiculo
			WHERE v.id=" . $idvehiculo . "
		";
        $result = $Data->getConsulta($sql);

        $sql2 = "
				SELECT
					cv.*,
					IF( ( SELECT COUNT(cp1.id) FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_propietario ) > 0,
						( SELECT cp1.numero_documento FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_propietario ),
						NULL
					) 'documento_propietario',
					IF( ( SELECT COUNT(cp1.id) FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_propietario ) > 0,
						( SELECT cp1.nombre FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_propietario ),
						NULL
					) 'nombre_propietario',
					IF( ( SELECT COUNT(cp1.id) FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_tenedor ) > 0,
						( SELECT cp1.numero_documento FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_tenedor ),
						NULL
					) 'documento_tenedor',
					IF( ( SELECT COUNT(cp1.id) FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_tenedor ) > 0,
						( SELECT cp1.nombre FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_tenedor ),
						NULL
					) 'nombre_tenedor',
					IF( ( SELECT COUNT(cp1.id) FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_conductor ) > 0,
						( SELECT cp1.numero_documento FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_conductor ),
						NULL
					) 'documento_conductor',
					IF( ( SELECT COUNT(cp1.id) FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_conductor ) > 0,
						( SELECT cp1.nombre FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_conductor ),
						NULL
					) 'nombre_conductor'
				FROM
					cmx_vehiculos cv
				WHERE cv.id=" . $idvehiculo . "
			";
        $result2 = $Data->getConsulta($sql2);

        $return["result"] = $result["rowsData"];
        $return["result2"] = $result2["rowsData"];
        break;

    case 'asinar_vehiculo_solicitud':
        $placa = $_REQUEST["placa"];
        $num_solicitud = $_REQUEST["n_solicitud"];
        $tipovehiculo = $_REQUEST["vehiculo"];
        $user = $_REQUEST["user"];
        $observe = $_REQUEST["observe"];
        $fecha = date('Y-m-d');
        $hora = date('G:i:s');
        $estado = 'Realizada';
        $sql = '
			INSERT INTO cmx_log_solicitudvehiculo
			(id,id_solictud,placa,user_log,observacion, fecha_asignacion,hora_asignacion,estado)
			VALUES(null,' . $num_solicitud . ',"' . $placa . '","' . $user . '","' . $observe . '","' . $fecha . '","' . $hora . '","' . $estado . '");
			';
        // echo $sql;
        $result = $Data->ejecuteRegistro($sql);
        //$return["result"] = $result["rowsData"];
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'asinar_vehiculo_solicitud_solo':
        //Como el vehículo no va ligado a una solicitud de servicio generada por servicio al cliente, el numero de solicitud para este caso será el id que el  vehículo tenga en la tabla
        $placa = $_REQUEST["placa"];
        $user = $_REQUEST["user"];
        $tipo_vehiculo = $_REQUEST["tipovehiculo"];
        $num_solo = '0';
        //id del vehiculo
        $id_solicitud = $_REQUEST["idsolicitud"];
        $observe = $_REQUEST["observacion"];
        $fecha = date('Y-m-d');
        $hora = date('G:i:s');
        $estado = 'Realizada';
        $sql = 'INSERT INTO cmx_log_solicitudvehiculo
			(id,id_solictud,placa,user_log,observacion,fecha_asignacion,hora_asignacion,estado,estado_solo )
			VALUES(NULL,"' . $id_solicitud . '","' . $placa . '","' . $user . '","' . $observe . '","' . $fecha . '","' . $hora . '","' . $estado . '","' . $num_solo . '" )';
        $result = $Data->ejecuteRegistro($sql);
        //$return["result"] = $result["rowsData"];
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'consulte_movimientos':
        $id = $_REQUEST["idcotizar"];
        $soli = $_REQUEST["solicitud"];
        //movimiento de atencion al cliente
        $sql = 'SELECT s.nundoc_solicitud, s.n_cotizacion, s.fecha, s.hora,s.estado,s.usuario_auditor ,
				m.item, m.id AS pareja, m.n_cotizacion, s.proceso
				FROM cmx_solicitud_vehiculo2 s
				INNER JOIN cmx_detalle_mercancia2 m ON s.idpareja_origen_destino=m.id
				WHERE s.n_cotizacion=' . $id . '
			';
        $result = $Data->getConsulta($sql);
        //movimiento de operaciones
        $sql2 = 'SELECT * FROM cmx_log_solicitudvehiculo WHERE id_solictud=' . $soli . '';
        $result2 = $Data->getConsulta($sql2);
        //movimiento de seguridad

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        if ($result2 > 1) {
            $return["result2"] = $result2["rowsData"];
        } else {
            $return["result2"] = $result2;
        }
        break;

    case 'consulte_cotizar':
        $c = $_REQUEST["idcotizar"];
        $sql = "
			SELECT s.n_cotizacion, s.estado,s.fecha_creacion, s.hora_creacion,
			 s.elaborado_por, m.item, m.id AS pareja, m.proceso
			 FROM cmx_cotizaciones_serviciocliente s
			INNER JOIN cmx_detalle_mercancia2 m
			ON s.n_cotizacion=m.n_cotizacion
			WHERE s.n_cotizacion=" . $c . "
		";
        $result = $Data->getConsulta($sql);
        //$return["result"] = $result["rowsData"];
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

        //consultar movimientos de la sarea para solicitud individual
        //sin proceso de cotizacion ni contrato
    case 'consultecarroindividual':
        $placa = $_REQUEST["placa"];
        //movimiento de operaciones
        $sql = '
			SELECT * FROM cmx_log_solicitudvehiculo
				WHERE placa="' . $placa . '"
		';
        $result = $Data->getConsulta($sql);
        //movimiento de seguridad
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

        //cotizaciones y solicitud de servicio
    case 'ver':
        $numero_cotizacion = $_REQUEST['ncotizar'];
        $sql = '
					SELECT * FROM
					cmx_cotizaciones_serviciocliente ccs
					WHERE ccs.n_cotizacion=' . $numero_cotizacion . ' ';

        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case '  consult consult             ':
        $numero_cotizacion = $_REQUEST['ncotizar1'];
        $id_mercancia = $_REQUEST["id_bloque"];
        $sql = "SELECT cdm.*, tv.nombre, CONCAT(C1.municipio,'-',C1.depto) AS orig,CONCAT(C2.municipio,'-',C2.depto) AS dest,e.empaque
						FROM cmx_detalle_mercancia2 cdm
						INNER JOIN cmx_para_tipo_vehiculo tv ON cdm.tipo_vehiculo=tv.id
						INNER JOIN cmx_municipios C1 ON cdm.origen=C1.rndc_codigo_ciudad
						INNER JOIN cmx_municipios C2 ON cdm.destino=C2.rndc_codigo_ciudad
						INNER JOIN cmx_para_tipo_empaque e ON cdm.tipo_empaque=e.id
						WHERE cdm.n_cotizacion=" . $numero_cotizacion . " AND cdm.id=" . $id_mercancia;
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'ver_espe':
        $numero_cotizacion = $_REQUEST['ncotizar2'];
        $id_bloque = $_REQUEST["id_bloque"];
        $sql = "
					SELECT cde.* FROM
					cmx_detalle_servespecial2 cde
					INNER JOIN cmx_detalle_mercancia2 a
					ON cde.item_mercancia=a.item
					WHERE cde.n_cotizacion=" . $numero_cotizacion . "
					AND a.id=" . $id_bloque;
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'solicitud_servicio':
        $nso = $_REQUEST["idsol"];
        $sql = "
			SELECT c.nundoc_solicitud,c.peso_kg, c.fecha,c.hora,c.estado,
			c.usuario_auditor,c.tipo_empaque, c.cantidad_empaque, c.flete,
				c.idpareja_origen_destino, c.n_cotizacion,c.proceso,c.agencia,a.nombre,
				d.estado, r.item,
				c.devol_contenedor,c.devol_dias,c.devol_direccion,c.devol_numcont,c.devol_comodato, c.cant_vehiculo, c.cant_disponible,
				CONCAT(C1.municipio,'-',C1.depto) AS municipio_contenedor, TC.nombre AS nombre_contenedor
				 FROM cmx_solicitud_vehiculo2 c
				 INNER JOIN cmx_agencias a ON c.agencia=a.id
				  LEFT JOIN cmx_log_solicitudvehiculo d ON c.nundoc_solicitud=d.id_solictud
				  INNER JOIN cmx_detalle_mercancia2 r ON c.idpareja_origen_destino=r.id
				  LEFT JOIN cmx_municipios C1 ON c.devol_municipio=C1.id
				  LEFT JOIN cmx_tipo_contenedor TC ON c.devol_tipocont=TC.id
				WHERE c.nundoc_solicitud=" . $nso . "";
        //echo $sql;
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];

        $sql2 = "SELECT P.*, CONCAT(M.municipio,'-',M.depto) AS municipio_punto
				FROM cmx_ruta_puntosentrega  P
				LEFT JOIN cmx_municipios M
				ON P.municipio_entrega=M.id
				WHERE cod_ini_ruta=" . $nso . "
				";
        $result2 = $Data->getConsulta($sql2);
        $return["result2"] = $result2["rowsData"];

        $sql3 = "SELECT a.id, a.solicitud_servicio, a.direccion_entrega,
				a.fecha_estimada_entrega, a.observacion, a.hora_estimada,a.telefono, a.peso, a.id_punto, mn.municipio AS municipio_punto, a.tipo
				FROM cmx_destinatarios_ss a
				INNER JOIN cmx_remitente_destinatario d
				ON a.cliente=d.id
				INNER JOIN cmx_municipios mn
				ON a.municipio_entrega=mn.id
				WHERE solicitud_servicio=" . $nso;
        $result3 = $Data->getConsulta($sql3);
        $return["result3"] = $result3["rowsData"];

        break;

    case 'consulta_serviciob':
        $numero_cotizacion = $_POST["cotizar"];
        $solicitud_servicio = $_POST["solicitud"];
        $sql = "SELECT se.nundoc_solicitud,
                se.n_cotizacion, se.nombre_cliente, se.peso_kg, 
                mno.municipio AS origen, mnd.municipio AS destino, ag.nombre AS agencia,
                se.devol_contenedor, se.devol_dias, se.devol_municipio,
                se.devol_direccion, se.devol_tipocont,
                se.devol_numcont, se. devol_comodato,
                veh.nombre, mer.tipo_mercancia,
                se.cant_vehiculo, se. cant_disponible,
                mer.volumen_total, mer.cantidad_empaque, se.observaciones,mer.observacion
                FROM cmx_solicitud_vehiculo2 se
                INNER JOIN cmx_detalle_mercancia2 mer ON se.idpareja_origen_destino=mer.id
                INNER JOIN cmx_municipios mno ON se.origen=mno.rndc_codigo_ciudad 
                INNER JOIN cmx_municipios mnd  ON se.destino=mnd.rndc_codigo_ciudad
                INNER JOIN cmx_agencias ag ON se.agencia=ag.id
                INNER JOIN cmx_para_tipo_vehiculo veh ON se.tipo_vehiculo = veh.id
                WHERE se.nundoc_solicitud=" . $solicitud_servicio;
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }


        break;

    case 'consulta_remitente':
        $numero_cotizacion = $_POST["cotizar"];
        $solicitud_servicio = $_POST["solicitud"];
        $sql = "SELECT a.id, rd.nombre, a.direccion_entrega, a.fecha_estimada_entrega,
			a.observacion, a.hora_estimada, a.tipo, a.telefono,
			a.peso, a.lugar, mn.municipio
			FROM cmx_ruta_puntosentrega a
			INNER JOIN cmx_remitente_destinatario rd ON a.cliente=rd.id
			INNER JOIN cmx_municipios mn ON a.municipio_entrega=mn.id
			WHERE a.cod_ini_ruta=" . $solicitud_servicio;
        $result = $Data->getConsulta($sql);

        $sql2 = "SELECT remi.id AS remitente,
			inf.*, des.nombre, mn.municipio
			FROM cmx_destinatarios_ss inf
			INNER JOIN cmx_remitente_destinatario des ON inf.cliente=des.id
			INNER JOIN cmx_ruta_puntosentrega remi ON inf.solicitud_servicio=cod_ini_ruta
			AND inf.id_punto=remi.id_punto
			INNER JOIN cmx_municipios mn ON inf.municipio_entrega=mn.id
			WHERE inf.solicitud_servicio=" . $solicitud_servicio;
        $result2 = $Data->getConsulta($sql2);

        // $return["result"] = $result["rowsData"];
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        // $return["result2"] = $result2["rowsData"];
        if ($result2 > 1) {
            $return["result2"] = $result2["rowsData"];
        } else {
            $return["result2"] = $result2;
        }
        break;

        //preestudio
    case 'consulte_preestudio':
        //id solicitud de servicio
        $ids = $_REQUEST["solicitud"];
        $sql = "SELECT a.id_servicio_cliente, b.* FROM cmx_preestudio_solicitudes_servicio a
					INNER JOIN cmx_solicitudes_preestudio b ON a.id_solicitudpreestudio=b.id
					WHERE a.id_servicio_cliente=" . $ids . " ";
        $result = $Data->getConsulta($sql);

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'validar_solicitud_subasta':
        $id_sol_servicio = $_POST["id_sol_servicio"];
        $sql = "SELECT a.* FROM cmx_subasta_solicitud_servicio a
			INNER JOIN cmx_estado_subasta b
			ON a.id_subasta=b.id_subasta
			WHERE a.numer_solservicio=" . $id_sol_servicio . "
			AND b.estado=1";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'consultar_fechacargue':
        $id_sol_servicio = $_POST["id_sol_servicio"];
        $sql = "SELECT p.id, p.cod_ini_ruta, p.fecha_estimada_entrega,
				p.hora_estimada,
				p.peso, CONCAT(mu.municipio,' / ',mu.depto) AS muni,
				p.lugar, p.direccion_entrega
				FROM cmx_ruta_puntosentrega p
				INNER JOIN cmx_municipios mu ON p.municipio_entrega=mu.id
				INNER JOIN cmx_solicitud_vehiculo2 se ON p.cod_ini_ruta=se.nundoc_solicitud
				INNER JOIN cmx_detalle_mercancia2 m ON se.idpareja_origen_destino=m.id
				WHERE p.cod_ini_ruta=" . $id_sol_servicio . " AND p.tipo='punto recogida'";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'valida_numero_subasta':
        $id_sol_servicio = $_POST["numservicio"];
        /*$sql="SELECT id_subasta FROM cmx_subasta_solicitud_servicio
        WHERE numer_solservicio=".$id_sol_servicio;*/
        $sql = "SELECT ss.id_subasta FROM cmx_subasta_solicitud_servicio ss
				INNER JOIN cmx_subasta_flete sb
				ON ss.id=sb.id_suba_servicio
				AND sb.estado_vigencia<>'cancelada'
				WHERE numer_solservicio=" . $id_sol_servicio;
        $result = $Data->getConsulta($sql);


        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else if ($result == 1) {
            $return["result"] = $result;
        } else {
            $return["result"] = NULL;
        }
        break;

    case 'consulta_solicitudes_anidadas':
        $num_subasta = $_POST["num_subasta"];
        $num_servicio = $_POST["num_servicio"];
        $sql = "SELECT DISTINCT
			ss.numer_solservicio, d.tipo_servicio_mer, d.n_cotizacion, d.item,
			d.id, s.nombre_cliente, d.flete, d.peso_neto_tn,
			d.tipo_mercancia, d.total_tarifa
			FROM cmx_subasta_solicitud_servicio ss
			INNER JOIN cmx_subasta su ON su.id=ss.id_subasta
			INNER JOIN  cmx_solicitud_vehiculo2 s ON ss.numer_solservicio=s.nundoc_solicitud
			INNER JOIN cmx_detalle_mercancia2 d ON s.idpareja_origen_destino=d.id
			WHERE su.estado='iniciado'
			AND  ss.id_subasta=" . $num_subasta . "
			AND  ss.numer_solservicio NOT IN(" . $num_servicio . ")";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'consulte_preestudio_estados':
        $idcotizar = $_POST["idcotizar"];
        $sql = "SELECT esv.placa,esv.usuario,CONCAT(esv.fecha,'-',esv.hora) AS fecha_solicitud,esv.operacion FROM cmx_preestudio_solicitudes_servicio ps
        INNER JOIN cmx_estudio_vehiculo esv ON ps.id_solicitudpreestudio=esv.id_estudio
        WHERE ps.id_servicio_cliente=" . $idcotizar;
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'Consulta_Historial_Estudios':
        $id = $_POST["id"];
        $sql = "SELECT sol.id, sol.placa, se.estado, CONCAT(se.fecha,' ',se.hora) AS traza, se.area
			FROM cmx_solicitudes_preestudio sol
			LEFT JOIN cmx_solicitudes_estados se
			ON sol.id=se.id_solicitud
			WHERE sol.id=" . $id . "
			ORDER BY se.fecha, se.hora desc";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;
}

if ($result > 1) {
    $return["result"] = $result["rowsData"];
} else if ($result == 1) {
    $return["result"] = $result;
} else {
    $return["result"] = NULL;
}

echo json_encode($return);
