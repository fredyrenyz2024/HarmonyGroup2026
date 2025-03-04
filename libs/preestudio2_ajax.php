<?php
include "../application/Config.php";
include '../application/Conexion.php';
include '../application/Model.php';
session_start();
$Data = new Consultas;

switch ($_REQUEST['action']) {

    //INCIO casos para preestudio seguridad

    case 'documentos_actu':
        $soli = $_REQUEST["soli"];
        $sql = "SELECT * FROM cmx_documeto_preestudio
				WHERE id_sol_prees=" . $soli . "   ";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'campos_actu':
        $soli = $_REQUEST["soli"];
        $sql = "
			SELECT * FROM cmx_actualiza_seguridad
			WHERE id_sol_prees=" . $soli . " ";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'datos_causalidad':
        $estadohabil = $_REQUEST["estadohabil"];
        $sql = "SELECT id,respuesta FROM
		cmx_solicitudpreestudio_respuestas
		WHERE estado_pertenece='" . $estadohabil . "'
		and tipo='estado_seguridad'  ";
        // echo $sql;
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'datos_vehiculo':
        $id = $_REQUEST["id"];
        $placa = $_REQUEST["placa"];
        $sql = "SELECT * FROM cmx_vehiculos_preestudio
				WHERE id=" . $id . "  ";
        $result = $Data->getConsulta($sql);
        if ($result) {
            $sql2 = "SELECT * FROM cmx_referencias_preestudio
					WHERE consecutivo=" . $id . " ";
            $result2 = $Data->getConsulta($sql2);
        }
        $return["result"] = $result["rowsData"];
        $return["result2"] = $result2["rowsData"];
        break;

    case 'consultar_estado':
        $id = $_REQUEST["id"];
        $placa = $_REQUEST["placa"];
        $sql = "SELECT * FROM cmx_vehiculos_preestudio_estado
			WHERE vehiculo_preestudio=" . $id . "
			ORDER BY fecha, hora DESC   ";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'habilitar_vehiculopreestudio':
        $id = $_REQUEST["id"];
        $fecha = $_REQUEST["fecha"];
        $hora = $_REQUEST["hora"];
        $user = $_REQUEST["user"];

        $sql = "
			INSERT INTO cmx_vehiculos_preestudio_estado
			(id,vehiculo_preestudio,estado_vehiculo,fecha,hora,usuario)
			VALUES(null," . $id . ",'Habilitado','" . $fecha . "',
			'" . $hora . "','" . $user . "')
		";
        $result = $Data->ejecuteRegistro($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'inhabilitar_vehiculopreestudio':
        $id = $_REQUEST["id"];
        $fecha = $_REQUEST["fecha"];
        $hora = $_REQUEST["hora"];
        $user = $_REQUEST["user"];
        $estado = $_REQUEST["estado"];
        $causa = $_REQUEST["causa"];
        $observa = $_REQUEST["observa"];

        //actualizar los anteriores
        $sql2 = "UPDATE cmx_vehiculos_preestudio_estado
				SET estado_final='0'
				WHERE  vehiculo_preestudio=" . $id . "    ";
        $result2 = $Data->ejecuteRegistro($sql2);
        if ($result2) {
            $sql = "
			INSERT INTO cmx_vehiculos_preestudio_estado
			(id,vehiculo_preestudio,estado_vehiculo,fecha,hora,usuario,causalidades,observacion,estado_final)
			VALUES(null," . $id . ",'" . $estado . "','" . $fecha . "',
			'" . $hora . "','" . $user . "'," . $causa . ",'" . $observa . "','1')";
            $result = $Data->ejecuteRegistro($sql);
        }
        $return["result"] = $result["rowsData"];
        break;

    case 'ver_seguridad':
        $preestudio = $_REQUEST["pree"];
        $solicitud = $_REQUEST["soli"];

        $sql = "
			SELECT v.*, s.*
			FROM cmx_vehiculos_preestudio v INNER JOIN
			cmx_solicitudes_preestudio s
			ON v.id=s.id_preestudio
			 LEFT JOIN cmx_solicitudes_estados e
			ON s.id=e.id_solicitud
			WHERE s.id_preestudio=" . $preestudio . "
			AND s.id=" . $solicitud . " GROUP BY v.placa_vehiculo
		";
        // echo $sql;
        $result = $Data->getConsulta($sql);
        if ($result) {
            //2 tipos de referencia : a. id del conductor b. numero del conductor

            $idcon = $result["rowsData"][0]["documento_conductor"];
            $sql2 = "SELECT * FROM cmx_proveedores
				WHERE numero_documento=" . $idcon . " ";
            $result2 = $Data->getConsulta($sql2);
            //si existe result2,buscar por el id la referencia , si no existe buscar referencia por numero documento
            if ($result2) {
                $id = $result2["rowsData"][0]["id"];
                $sql4 = "SELECT * FROM cmx_referencias_preestudio
						WHERE id_conductor=" . $id . "  ";
                $result4 = $Data->getConsulta($sql4);
                $return["result4"] = $result4["rowsData"];
            } else {
                $sql4 = "SELECT * FROM cmx_referencias_preestudio
						WHERE id_conductor=" . $idcon . "  ";
                $result4 = $Data->getConsulta($sql4);
                $return["result4"] = $result4["rowsData"];
            }

            $sql3 = "SELECT a.id, a.peso_kg, a.nombre_cliente, a.tipo_vehiculo, a.fecha, a.hora, a.usuario_auditor,
				CONCAT(C1.municipio,'-',C1.depto) AS orige,
				CONCAT(C2.municipio,'-',C2.depto) AS dest
				FROM cmx_preestudio_solicitudes_servicio z
				INNER JOIN cmx_solicitud_vehiculo2 a
				ON z.id_servicio_cliente=a.id
				INNER JOIN cmx_municipios C1
				ON a.origen=C1.rndc_codigo_ciudad
				INNER JOIN cmx_municipios C2
				ON a.destino=C2.rndc_codigo_ciudad
				WHERE z.id_solicitudpreestudio=" . $solicitud . "
				AND z.es=1	";
            $result3 = $Data->getConsulta($sql3);
            $return["result3"] = $result3["rowsData"];

        }
        $return["result"] = $result["rowsData"];
        break;

    case 'trae_referencias':
        $id_solicitud = $_REQUEST["id_sol"];
        $sql2 = "SELECT * FROM cmx_vehiculos_preestudio
				WHERE id=" . $id_solicitud . " ";
        $result2 = $Data->getConsulta($sql2);
        if ($result2) {
            $documento = $result2["rowsData"][0]["documento_conductor"];

            $sql = "SELECT * FROM cmx_referencias_preestudio
					WHERE id_conductor=" . $documento . " ";

            $result = $Data->getConsulta($sql);
        }
        $return["result"] = $result["rowsData"];
        break;

    case 'traer_preestudio':
        $id_solicitud = $_REQUEST["id_sol"];
        $sql = "
			SELECT * FROM  cmx_vehiculos_preestudio v
			LEFT JOIN cmx_solicitudes_preestudio s
			ON v.id=s.id_preestudio
			WHERE s.id=" . $id_solicitud . "  ";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'trae_solicitudes':
        $id_solicitud = $_REQUEST["id_sol"];
        $sql = "
			SELECT a.id, a.peso_kg, a.nombre_cliente, a.tipo_vehiculo, a.fecha, a.hora, a.usuario_auditor,
				CONCAT(C1.municipio,'-',C1.depto) AS orige,
				CONCAT(C2.municipio,'-',C2.depto) AS dest,
				pt.nombre AS tipo_carro
				FROM cmx_preestudio_solicitudes_servicio z
				INNER JOIN cmx_solicitud_vehiculo2 a
				ON z.id_servicio_cliente=a.id
				INNER JOIN cmx_municipios C1
				ON a.origen=C1.rndc_codigo_ciudad
				INNER JOIN cmx_municipios C2
				ON a.destino=C2.rndc_codigo_ciudad
				INNER JOIN cmx_para_tipo_vehiculo pt
				ON a.tipo_vehiculo=pt.id
				WHERE z.id_solicitudpreestudio=" . $id_solicitud . "
				AND z.es=1
		";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'solicitudesp':
        $p = $_REQUEST["id"];
        $sql = "SELECT  a.*, b.estado FROM cmx_solicitudes_preestudio a
				INNER JOIN cmx_solicitudes_estados b
				ON a.id=b.id_solicitud
			WHERE a.placa='" . $p . "'  AND b.estado_actual=1 ";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    //CONSULTAR HOJAS DE VIDA DEL VEHÍCULO
    case 'buscar_hv':
        $placa = $_REQUEST["placa"];
        $factual = date('Y-m-d');
        $hactual = date('G:i:s');
        $user = $_SESSION["usuario"]["nom_usuario"];

        $sql = "SELECT v.placa, se.id_solictud,
			 c.*, ec.fecha, ec.hora, se.id AS 'idestudio',
			 vv.capacidad_tn
			FROM 	cmx_vehiculos	v
			LEFT JOIN  cmx_log_solicitudvehiculo2 se
			ON v.placa=se.placa AND se.estado_actu=1
			LEFT JOIN cmx_estudio_vehiculo es
			ON se.id=es.id_solicitud
			LEFT JOIN cmx_estudiov_completo c
			ON es.id=c.id_estudio AND c.estado_actu=1
			LEFT JOIN  cmx_logestudio_com ec
			ON c.id=ec.id_completo
			LEFT JOIN cmx_vehiculo2 vv
			ON v.id=vv.id_vehiculo
			WHERE v.placa='" . $placa . "'";

        /*$sql="
        SELECT v.placa, se.id_solictud,
        c.*, ec.fecha, ec.hora, se.id AS 'idestudio'
        FROM     cmx_vehiculos    v
        LEFT JOIN  cmx_log_solicitudvehiculo2 se
        ON v.placa=se.placa AND se.estado_actu=1
        LEFT JOIN cmx_estudio_vehiculo es
        ON se.id=es.id_solicitud
        LEFT JOIN cmx_estudiov_completo c
        ON es.id=c.id_estudio AND c.estado_actu=1
        LEFT JOIN  cmx_logestudio_com ec
        ON c.id=ec.id_completo
        WHERE v.placa='".$placa."'";    */

        /*    $sql="
        SELECT v.placa, se.id_solictud,
        c.*, ec.fecha, ec.hora, se.id AS 'idestudio',
        se.estado_actu AS 'estadoservi', c.estado_actu AS 'estadoestudio'
        FROM
        cmx_vehiculos    v
        LEFT JOIN  cmx_log_solicitudvehiculo2 se
        ON v.placa=se.placa AND se.estado_actu=1
        INNER JOIN cmx_solicitudes_preestudio sp
        ON se.id_solictud=sp.id AND sp.estado_actual_sol=1
        LEFT JOIN cmx_estudio_vehiculo es
        ON se.id=es.id_solicitud
        LEFT JOIN cmx_estudiov_completo c
        ON es.id=c.id_estudio AND c.estado_actu=1
        LEFT JOIN  cmx_logestudio_com ec
        ON c.id=ec.id_completo
        WHERE v.placa='".$placa."'";*/

        $result = $Data->getConsulta($sql);
        if ($result) {
            $return["result"] = $result["rowsData"];
        } else {

            $sqlm = "SELECT  e.id AS idestados,
				s.id AS 'idsolitu'
				FROM cmx_solicitudes_preestudio s
				INNER JOIN cmx_solicitudes_estados e
				ON s.id=e.id_solicitud	AND e.estado_actual=1
				WHERE TIMESTAMPDIFF(DAY, s.fecha, '" . $factual . "')>=1
				AND e.estado <> 'vencida' AND  e.estado <> 'aprobado'
				AND  e.estado <> 'cancelado'  AND  e.estado <> 'rechazado'   ";
            //echo $sqlm;
            $resultm = $Data->getConsulta($sqlm);
            if ($resultm) {
                foreach ($resultm["rowsData"] as $index1 => $element1) {
                    $idactu = $element1['idestados'];
                    $idsoli = $element1['idsolitu'];

                    //Actualizar los estados de la solicitud a cero para poder ponerlas vencidas porque ya pasaron la fecha vigente de 24 horas
                    $sqla = "UPDATE cmx_solicitudes_estados
					SET estado_actual=0
					WHERE  id=" . $idactu . "   ";
                    //echo $sqla;

                    $resulta = $Data->ejecuteRegistro($sqla);
                    //insertar
                    $nuevafecha = strtotime('-1 day', strtotime($factual));
                    $nuevafecha = date('Y-m-d', $nuevafecha);
                    $sqli = "INSERT cmx_solicitudes_estados
					(id,estado,id_solicitud,fecha,hora,usuario,estado_actual,area)
					VALUES(null,'vencida',$idsoli,'" . $nuevafecha . "','24:00:00','" . $user . "',1,'sistema')";
                    $resulti = $Data->ejecuteRegistro($sqli);
                    //PONER DELETE DE SOLICITUDES DE SERVICIO
                    //delete en cmx_preestudio_solicitudes_servicio
                    //delete en cmx_log_solicitudvehiculo

                    $idservi = $element1['id_servicio_cliente'];

                    /*$sqld="DELETE FROM
                cmx_preestudio_solicitudes_servicio
                WHERE id_servicio_cliente=".$idservi."
                AND id_solicitudpreestudio=".$idsoli." ";
                $resultps=$Data->ejecuteRegistro($sqld);

                $sqlser="DELETE FROM
                cmx_log_solicitudvehiculo
                WHERE id_solictud=".$idservi."    ";
                $resultservi=$Data->ejecuteRegistro($sqlser);*/
                }
            }

            $sql2 = "
				SELECT v.placa_vehiculo, v.documento_conductor ,s.id, s.fecha, s.hora,
				es.estado, es.estado_actual, es.fecha AS fechaes, es.hora AS horaes
				FROM cmx_vehiculos_preestudio v
				LEFT JOIN cmx_solicitudes_preestudio s
				ON v.id=s.id_preestudio
				LEFT JOIN cmx_solicitudes_estados es
				ON s.id=es.id_solicitud AND es.estado_actual=1
				WHERE v.placa_vehiculo='" . $placa . "'
				";
            $result2 = $Data->getConsulta($sql2);
            $return["result2"] = $result2["rowsData"];
            $return["result"] = $result["rowsData"];
        }
        break;

    case 'consultavprees':
        $placa = $_REQUEST["placa"];
        $sql = "SELECT *
				FROM cmx_vehiculos_preestudio v
				WHERE placa_vehiculo='" . $placa . "'";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'consultar_refe_R':
        $docuconductor = $_REQUEST["docuconductor"];
        $sql = "SELECT *
			FROM cmx_referencias_preestudio p
			WHERE id_conductor=" . $docuconductor . "  ";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    //

    case 'validar_masinicios':
        $solicitud = $_REQUEST["solicitud"];
        $sql = "SELECT *
		FROM cmx_solicitudes_estados
		WHERE  id_solicitud=" . $solicitud . " AND estado_actual='1' ";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'inicie_estudio1':
        //insertar el inicio del preestudio por el lado de seguridad
        $solicitud = $_REQUEST["solicitud"];
        $estado = $_REQUEST["estado"];
        $fecha = date('Y-m-d');
        $hora_c = date('H:i:s');
        $id_usuario = $_SESSION["usuario"]["nom_usuario"];
        $sql = "INSERT INTO cmx_solicitudes_estados
			(id,estado,id_solicitud,fecha,hora,usuario,estado_actual,area)
			VALUES(NULL,'" . $estado . "'," . $solicitud . ",'" . $fecha . "','" . $hora_c . "','" . $id_usuario . "',1,'seguridad')";
        // echo $sql;
        $result = $Data->ejecuteRegistro($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'inicie_estudio2':
        $solicitud = $_REQUEST["solicitud"];
        $sql = "SELECT MAX(id) AS ID_ACTUALIZAR
			FROM cmx_solicitudes_estados
			WHERE id_solicitud=" . $solicitud . "   ";
        // echo $sql;
        $result = $Data->getConsulta($sql);
        $idid = $result["rowsData"][0]["ID_ACTUALIZAR"];

        if ($result) {
            $sql = "UPDATE  cmx_solicitudes_estados
					SET estado_actual='0'
					WHERE id=" . $idid . "  ;
					";
            // echo $sql;
            $result2 = $Data->ejecuteRegistro($sql);
        }
        $return["result2"] = $result2["rowsData"];
        break;

    case 'update_proceso':
        $idsolicitud = $_REQUEST["solicitud"];
        $sql = "UPDATE cmx_solicitudes_preestudio
				SET proceso='Ini_Sol_PreR'
				WHERE id=" . $idsolicitud . "   ";
        $result = $Data->ejecuteRegistro($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'validar_prefiltro':
        $id_vpreestudio = $_REQUEST["id_vpreestudio"];
        $id_sol = $_REQUEST["id_sol"];
        $sql = "
			SELECT estado, estado_actual FROM cmx_solicitudes_estados
			WHERE id_solicitud=" . $id_sol . "
			AND estado_actual=1";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'insert_seguridad':
        $solicitud = $_REQUEST["solicitud"];
        $estado = $_REQUEST["estado"];
        $proceso = $_REQUEST["proceso"];

        if ($_REQUEST["respu"]) {
            $respu = $_REQUEST["respu"];
        } else {
            $respu = '';
        }
        if ($_REQUEST["observacion"]) {
            $observacion = $_REQUEST["observacion"];
        } else {
            $observacion = '';
        }
        $fecha = date('Y-m-d');
        $hora_c = date('H:i:s');
        $id_usuario = $_SESSION["usuario"]["nom_usuario"];
        $id_usuario;

        if ($estado == 'cancelado' || $estado == 'rechazado') {
            $factual = date('Y-m-d');

            $sqlm = "SELECT  p.id_servicio_cliente
				FROM cmx_solicitudes_preestudio s
				INNER JOIN cmx_preestudio_solicitudes_servicio p
				ON s.id=p.id_solicitudpreestudio
				INNER JOIN cmx_log_solicitudvehiculo l
				ON p.id_servicio_cliente=l.id_solictud
				WHERE s.id=" . $solicitud . " ";
            $resultm = $Data->getConsulta($sqlm);
            if ($resultm) {
                foreach ($resultm["rowsData"] as $index1 => $element1) {

                    //PONER DELETE DE SOLICITUDES DE SERVICIO
                    //delete en cmx_preestudio_solicitudes_servicio
                    //delete en cmx_log_solicitudvehiculo
                    $idservi = $element1['id_servicio_cliente'];
                    /*$sqld="DELETE FROM
                    cmx_preestudio_solicitudes_servicio
                    WHERE id_servicio_cliente=".$idservi."
                    ";
                    $resultps=$Data->ejecuteRegistro($sqld);*/

                    /*$sqld1="DELETE FROM
                cmx_log_solicitudvehiculo
                WHERE id_solictud=".$idservi."     ";
                $resultse=$Data->ejecuteRegistro($sqld1);*/

                }
            }
        }

        $sql = "SELECT MAX(id) AS ID_ACTUALIZAR FROM cmx_solicitudes_estados
			WHERE id_solicitud=" . $solicitud . " AND estado_actual=1 ";
        $result2 = $Data->getConsulta($sql);
        $idid = $result2["rowsData"][0]["ID_ACTUALIZAR"];
        if ($result2) {
            //actualizar el anterior
            $sql2 = "UPDATE  cmx_solicitudes_estados
					SET estado_actual='0'
					WHERE   id=" . $idid . "     ";
            // echo $sql2;
            $result3 = $Data->ejecuteRegistro($sql2);
            if ($result3) {
                //insertar estado nuevo
                $sql1 = "INSERT INTO cmx_solicitudes_estados
			(id,estado,id_solicitud,fecha,hora,usuario,
			estado_actual,area)
			VALUES(NULL,'" . $estado . "'," . $solicitud . ",'" . $fecha . "','" . $hora_c . "','" . $id_usuario . "','1','seguridad')  ";
                $result_estado = $Data->ejecuteRegistro($sql1);
                if ($result_estado) {
                    //consultar el id del ultimo estado registrado
                    $sqli = "SELECT MAX(id) AS ID FROM cmx_solicitudes_estados
				WHERE id_solicitud=" . $solicitud . " ";
                    $resultt = $Data->getConsulta($sqli);
                    $id_sol = $resultt["rowsData"][0]["ID"];
                    if ($id_sol) {
                        //insertar observacion de seguridad
                        $sqla = "INSERT INTO cmx_respuestasseguridad_preestudio
					(id,causalidad,observacion,id_estado)VALUES(null,'" . $respu . "','" . $observacion . "'," . $id_sol . ")";
                        $result = $Data->ejecuteRegistro($sqla);

                        //actualizar el campo proceso del preestudio
                        $sqlp = "UPDATE cmx_solicitudes_preestudio
						SET proceso='" . $proceso . "'
						WHERE id=" . $solicitud . " ";
                        $result5 = $Data->ejecuteRegistro($sqlp);

                        if ($estado == 'rechazado' || $estado == 'cancelado' || $estado == 'aprobado') {
                            $sqlac = "UPDATE cmx_solicitudes_preestudio
						SET estado_actual_sol='0'
						WHERE id=" . $solicitud . "  ";
                            $result4 = $Data->ejecuteRegistro($sqlac);

                        }
                    }
                }
            }
        }
        $return["result"] = $result["rowsData"];
        break;

    case 'consutar_solicitudes_seguridad':
        $estado = $_REQUEST["estado"];
        $finicial = $_REQUEST["finicial"];
        $ffinal = $_REQUEST["ffinal"];
        $factual = date('Y-m-d');
        $hactual = date('G:i:s');
        $user = $_SESSION["usuario"]["nom_usuario"];
        if ($estado == 't') {
            //estado vencidas: liberar solicitudes de servicio
            $sqlm = "SELECT  e.id AS idestados,
				s.id AS 'idsolitu', p.id_servicio_cliente
				FROM cmx_solicitudes_preestudio s
				INNER JOIN cmx_solicitudes_estados e
				ON s.id=e.id_solicitud	AND e.estado_actual=1
				LEFT JOIN cmx_preestudio_solicitudes_servicio p
				ON s.id=p.id_solicitudpreestudio
				WHERE TIMESTAMPDIFF(DAY, s.fecha, '" . $factual . "')>=1
				AND e.estado <> 'vencida' AND  e.estado <> 'aprobado'
				AND  e.estado <> 'cancelado'  AND  e.estado <> 'rechazado' ";
            $resultm = $Data->getConsulta($sqlm);
            if ($resultm) {
                foreach ($resultm["rowsData"] as $index1 => $element1) {
                    $idactu = $element1['idestados'];
                    $idsoli = $element1['idsolitu'];

                    //Actualizar los estados de la solicitud a cero para poder ponerlas vencidas porque ya pasaron la fecha vigente de 24 horas
                    $sqla = "UPDATE cmx_solicitudes_estados
						SET estado_actual=0
						WHERE  id=" . $idactu . "   ";
                    //echo $sqla;

                    $resulta = $Data->ejecuteRegistro($sqla);

                    //PONER DELETE DE SOLICITUDES DE SERVICIO
                    //delete en cmx_preestudio_solicitudes_servicio
                    //delete en cmx_log_solicitudvehiculo
                    $idservi = $element1['id_servicio_cliente'];

                    /*$sqld="DELETE FROM
                cmx_preestudio_solicitudes_servicio
                WHERE id_servicio_cliente=".$idservi."
                AND id_solicitudpreestudio=".$idsoli." ";
                $resultps=$Data->ejecuteRegistro($sqld);

                $sqlser="DELETE FROM
                cmx_log_solicitudvehiculo
                WHERE id_solictud=".$idservi." ";
                $resultservi=$Data->ejecuteRegistro($sqlser);*/

                }
                $nuevafecha = strtotime('-1 day', strtotime($factual));
                $nuevafecha = date('Y-m-d', $nuevafecha);
                $sqli = "INSERT cmx_solicitudes_estados
						(id,estado,id_solicitud,fecha,hora,usuario,estado_actual,area)
						VALUES(null,'vencida'," . $idsoli . ",'" . $nuevafecha . "','24:00:00','" . $user . "',1,'sistema')";
                $resulti = $Data->ejecuteRegistro($sqli);

            }

            $sql = "SELECT vp.id AS idv, s.id AS esoli, s.*,
					e.* ,se.id,
					CONCAT(prov.nombre,' ',prov.apellido1,' ',prov.apellido2) name_conductor,
					CASE
					e.estado WHEN 'aprobado'
					THEN 'Autorizado HV'
					ELSE e.estado
					END AS campo,
					CASE  WHEN v.id   IS NULL THEN 0 ELSE v.id  END AS 'idvehi',
					CASE WHEN v.id_conductor IS NULL THEN 0 ELSE v.id_conductor END AS 'id_conductor',
					CASE WHEN se.id IS NULL THEN 0 ELSE se.id END AS 'idestudioseguridad',
					CASE WHEN se.id  IS NULL THEN 'NO' ELSE 'SI' END AS soli_estudio,
					CASE WHEN esv.estado IS NULL THEN 'gray' ELSE esv.estado  END AS estadoseguridad,
					CASE WHEN esv.id_estudio IS NULL THEN 0 ELSE esv.id_estudio  END AS id_estudiooriginal
					FROM cmx_solicitudes_preestudio s
					INNER JOIN cmx_solicitudes_estados e
					ON s.id=e.id_solicitud
					INNER JOIN cmx_vehiculos_preestudio vp
					ON s.id_preestudio=vp.id
					LEFT JOIN cmx_vehiculos v
					ON vp.placa_vehiculo=v.placa
					LEFT JOIN cmx_proveedores prov
					ON v.id_conductor=prov.id
					LEFT JOIN cmx_log_solicitudvehiculo2 se
					ON s.id=se.id_solictud
					LEFT JOIN cmx_estudio_vehiculo ev
					ON se.id=ev.id_solicitud
					LEFT JOIN cmx_estudiov_completo esv
					ON ev.id=esv.id_estudio AND esv.estado_actu=1
					WHERE e.estado_actual='1'
					AND e.fecha BETWEEN
					'" . $finicial . "' AND '" . $ffinal . "'
					ORDER BY  s.id DESC";

            /* 2021-02-08

            $sql="
            SELECT v.id AS idv, s.id AS esoli, s.*, e.* ,
            ser.id AS servi, me.n_cotizacion, me.item,se.id,cv.id_conductor,cv.id AS 'idvehi',
            c.estado as estadoestudio,
            CASE
            e.estado WHEN 'aprobado'
            THEN 'Autorizado HV'

            ELSE e.estado
            END AS campo,
            CASE WHEN se.id  IS NULL THEN 'NO' ELSE 'SI' END AS soli_estudio

            FROM  cmx_vehiculos_preestudio v
            INNER JOIN cmx_solicitudes_preestudio AS s
            ON v.id=s.id_preestudio
            INNER JOIN cmx_solicitudes_estados AS e
            ON s.id=e.id_solicitud
            -- unir con tabla intermedia de solicitudes
            INNER JOIN cmx_preestudio_solicitudes_servicio p
            ON s.id=p.id_solicitudpreestudio
            -- unir con tabla de solicitudes
            INNER  JOIN cmx_solicitud_vehiculo2 ser
            ON p.id_servicio_cliente=ser.id
            INNER JOIN cmx_detalle_mercancia2 AS me
            ON ser.n_cotizacion=me.n_cotizacion AND ser.idpareja_origen_destino = me.id
            LEFT JOIN cmx_log_solicitudvehiculo2 se  ON s.id = se.id_solictud
            LEFT JOIN cmx_vehiculos cv ON se.placa=cv.placa
            LEFT JOIN cmx_estudio_vehiculo est
            ON se.id=est.id_solicitud
            LEFT JOIN cmx_estudiov_completo c
            ON est.id=c.id_estudio

            WHERE e.estado_actual='1'
            AND e.fecha BETWEEN
            '".$finicial."' AND '".$ffinal."'
            ORDER BY  e.fecha, e.hora  DESC";*/

            /* segunda
            $sql="SELECT v.id AS idv, s.id AS esoli, s.*, e.* ,
            ser.id AS servi, me.n_cotizacion, me.item,se.id,cv.id_conductor,cv.id AS 'idvehi',
            CASE
            e.estado WHEN 'aprobado'
            THEN 'Autorizado HV'

            ELSE e.estado
            END AS campo,
            CASE WHEN se.id  IS NULL THEN 'NO' ELSE 'SI' END AS soli_estudio

            FROM  cmx_vehiculos_preestudio v
            INNER JOIN cmx_solicitudes_preestudio AS s
            ON v.id=s.id_preestudio
            INNER JOIN cmx_solicitudes_estados AS e
            ON s.id=e.id_solicitud
            -- unir con tabla intermedia de solicitudes
            INNER JOIN cmx_preestudio_solicitudes_servicio p
            ON s.id=p.id_solicitudpreestudio
            -- unir con tabla de solicitudes
            INNER  JOIN cmx_solicitud_vehiculo2 ser
            ON p.id_servicio_cliente=ser.id
            INNER JOIN cmx_detalle_mercancia2 AS me
            ON ser.n_cotizacion=me.n_cotizacion AND ser.idpareja_origen_destino = me.id
            LEFT JOIN cmx_log_solicitudvehiculo2 se  ON s.id = se.id_solictud
            LEFT JOIN cmx_vehiculos cv ON se.placa=cv.placa
            WHERE e.estado_actual='1'
            AND e.fecha BETWEEN
            '".$finicial."' AND '".$ffinal."'
            ORDER BY  e.fecha, e.hora  DESC";*/

            /*    primera

            $sql="SELECT v.id AS idv, s.id AS esoli, s.*, e.* ,
            ser.id AS servi, me.n_cotizacion, me.item,
            CASE
            e.estado WHEN 'aprobado'
            THEN 'Autorizado HV'
            ELSE e.estado
            END AS campo
            FROM  cmx_vehiculos_preestudio v
            INNER JOIN cmx_solicitudes_preestudio AS s
            ON v.id=s.id_preestudio
            INNER JOIN cmx_solicitudes_estados AS e
            ON s.id=e.id_solicitud
            -- unir con tabla intermedia de solicitudes
            INNER JOIN cmx_preestudio_solicitudes_servicio p
            ON s.id=p.id_solicitudpreestudio
            -- unir con tabla de solicitudes
            INNER  JOIN cmx_solicitud_vehiculo2 ser
            ON p.id_servicio_cliente=ser.id
            INNER JOIN cmx_detalle_mercancia2 AS me
            ON ser.n_cotizacion=me.n_cotizacion AND ser.idpareja_origen_destino = me.id
            WHERE e.estado_actual='1'
            AND e.fecha BETWEEN
            '".$finicial."' AND '".$ffinal."'
            ORDER BY  e.fecha, e.hora  DESC";  */

            //echo $sql;

        }

        if ($estado != 't') {
            $sql = "
					SELECT v.id AS idv, s.id AS esoli, s.*, e.* ,
			ser.id AS servi, me.n_cotizacion, me.item,se.id,cv.id_conductor,cv.id AS 'idvehi',
			c.estado as estadoestudio,
			CASE
				e.estado WHEN 'aprobado'
				THEN 'Autorizado HV'

				ELSE e.estado
			END AS campo,
			CASE WHEN se.id  IS NULL THEN 'NO' ELSE 'SI' END AS soli_estudio

			FROM  cmx_vehiculos_preestudio v
			INNER JOIN cmx_solicitudes_preestudio AS s
			ON v.id=s.id_preestudio
			INNER JOIN cmx_solicitudes_estados AS e
			ON s.id=e.id_solicitud
			-- unir con tabla intermedia de solicitudes
			INNER JOIN cmx_preestudio_solicitudes_servicio p
			ON s.id=p.id_solicitudpreestudio
			-- unir con tabla de solicitudes
		        INNER  JOIN cmx_solicitud_vehiculo2 ser
			ON p.id_servicio_cliente=ser.id
			INNER JOIN cmx_detalle_mercancia2 AS me
			ON ser.n_cotizacion=me.n_cotizacion AND ser.idpareja_origen_destino = me.id
		        LEFT JOIN cmx_log_solicitudvehiculo2 se  ON s.id = se.id_solictud
		        LEFT JOIN cmx_vehiculos cv ON se.placa=cv.placa
			LEFT JOIN cmx_estudio_vehiculo est
			ON se.id=est.id_solicitud
			LEFT JOIN cmx_estudiov_completo c
			ON est.id=c.id_estudio

			WHERE e.estado='" . $estado . "' and  e.estado_actual='1'
			AND e.fecha BETWEEN
			'" . $finicial . "' AND '" . $ffinal . "'
			ORDER BY  e.fecha, e.hora  DESC
			";
            /*
            primera
            $sql="SELECT s.id as esoli, s.*, e.* FROM cmx_solicitudes_preestudio AS s
            INNER JOIN cmx_solicitudes_estados AS e
            ON s.id=e.id_solicitud
            WHERE e.estado='".$estado."' and e.estado_actual=1
            AND e.fecha BETWEEN
            '".$finicial."' AND '".$ffinal."' "; */

            /*$sql="SELECT v.id AS idv, s.id AS esoli, s.*, e.* ,
            ser.id AS servi, me.n_cotizacion, me.item,
            CASE
            e.estado WHEN 'aprobado'
            THEN 'Autorizado HV'
            ELSE e.estado
            END AS campo
            FROM  cmx_vehiculos_preestudio v
            INNER JOIN cmx_solicitudes_preestudio AS s
            ON v.id=s.id_preestudio
            INNER JOIN cmx_solicitudes_estados AS e
            ON s.id=e.id_solicitud
            -- unir con tabla intermedia de solicitudes
            INNER JOIN cmx_preestudio_solicitudes_servicio p
            ON s.id=p.id_solicitudpreestudio
            -- unir con tabla de solicitudes
            INNER  JOIN cmx_solicitud_vehiculo2 ser
            ON p.id_servicio_cliente=ser.id
            INNER JOIN cmx_detalle_mercancia2 AS me
            ON ser.n_cotizacion=me.n_cotizacion AND ser.idpareja_origen_destino = me.id
            WHERE e.estado='".$estado."' and  e.estado_actual='1'
            AND e.fecha BETWEEN
            '".$finicial."' AND '".$ffinal."'
            ORDER BY  e.fecha, e.hora  DESC";*/

            /*
        segunda
        $sql="SELECT v.id AS idv, s.id AS esoli, s.*, e.* ,
        ser.id AS servi, me.n_cotizacion, me.item,se.id,cv.id_conductor,cv.id AS 'idvehi',
        CASE
        e.estado WHEN 'aprobado'
        THEN 'Autorizado HV'

        ELSE e.estado
        END AS campo,
        CASE WHEN se.id IS NULL THEN 'NO' ELSE 'SI' END AS soli_estudio

        FROM  cmx_vehiculos_preestudio v
        INNER JOIN cmx_solicitudes_preestudio AS s
        ON v.id=s.id_preestudio
        INNER JOIN cmx_solicitudes_estados AS e
        ON s.id=e.id_solicitud
        -- unir con tabla intermedia de solicitudes
        INNER JOIN cmx_preestudio_solicitudes_servicio p
        ON s.id=p.id_solicitudpreestudio
        -- unir con tabla de solicitudes
        INNER  JOIN cmx_solicitud_vehiculo2 ser
        ON p.id_servicio_cliente=ser.id
        INNER JOIN cmx_detalle_mercancia2 AS me
        ON ser.n_cotizacion=me.n_cotizacion AND ser.idpareja_origen_destino = me.id
        LEFT JOIN cmx_log_solicitudvehiculo2 se  ON s.id = se.id_solictud
        LEFT JOIN cmx_vehiculos cv ON se.placa=cv.placa
        WHERE e.estado='".$estado."' and  e.estado_actual='1'
        AND e.fecha BETWEEN
        '".$finicial."' AND '".$ffinal."'
        ORDER BY  e.fecha, e.hora  DESC"; */
        }

        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'status_seguridad':
        $pree = $_REQUEST["pree"];
        $soli = $_REQUEST["soli"];
        $sql = "
			SELECT * FROM cmx_solicitudes_estados
			WHERE id_solicitud=" . $soli . "
			ORDER BY  fecha, hora DESC
		";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    //cotizacion
    case 'buscar_cotizacion':
        $soli = $_REQUEST["soli"];
        $sql = "
				SELECT S.*, S.proceso as prepro, m.id, m.n_cotizacion,  m.proceso AS pprees , m.idpareja_origen_destino,
				d.item, d.proceso AS pcoti, es.fecha, es.hora , es.estado_autorizado, es.user_log
				FROM cmx_solicitudes_preestudio S
				INNER JOIN cmx_preestudio_solicitudes_servicio p
				ON S.id=p.id_solicitudpreestudio
				INNER JOIN cmx_solicitud_vehiculo2 m
				ON p.id_servicio_cliente=m.id
				INNER JOIN cmx_detalle_mercancia2 d
				ON m.n_cotizacion=d.n_cotizacion
				INNER JOIN cmx_estados_cotizacion es
				ON m.n_cotizacion=es.n_cotizacion
				WHERE S.id=" . $soli . "  ;
		";
        //echo $sql;

        /*$sql="
        SELECT res.*,es.estado , es.fecha, es.hora, es.usuario , cau.respuesta
        FROM cmx_respuestasseguridad_preestudio res
        INNER JOIN cmx_solicitudes_estados es
        ON res.id_estado=es.id
        INNER JOIN cmx_solicitudpreestudio_respuestas cau
        ON res.causalidad=cau.id
        WHERE es.id_solicitud=".$id_solicitud."
        "; */

        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;
    //solicitud de servicio

    //
    case 'llenar_causalidad':
        $estado = $_REQUEST["estado"];
        $sql = "SELECT * FROM cmx_solicitudpreestudio_respuestas
			WHERE estado_pertenece='" . $estado . "'
			and tipo='preestudio'";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;
    //FIN casos para preestudio seguridad

    case 'consultar_respuesta_seguridad':
        $id_solicitud = $_REQUEST["num_solicitud"];
        $sql = "
				SELECT res.*,es.estado , es.fecha, es.hora, es.usuario , cau.respuesta
				FROM cmx_respuestasseguridad_preestudio res
				INNER JOIN cmx_solicitudes_estados es
				ON res.id_estado=es.id
				INNER JOIN cmx_solicitudpreestudio_respuestas cau
				ON res.causalidad=cau.id
				WHERE es.id_solicitud=" . $id_solicitud . "
		";
        // echo $sql;
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'parametro_controlhora':
        $sql = "SELECT * FROM cmx_control_horas
				WHERE estado='Activo'";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'estado_vehiculos':
        $placa = $_REQUEST["placa"];
        $sql = "
			SELECT es.* FROM cmx_vehiculos_preestudio_estado es
			INNER JOIN cmx_vehiculos_preestudio ve
			ON es.vehiculo_preestudio=ve.id
			WHERE ve.placa_vehiculo='" . $placa . "'";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'vsolicitud_preestudio':
        $placa = $_REQUEST["placa"];
        $soli = $_REQUEST["solicitud"];
        /*$sql="
        SELECT v.*, s.* FROM
        cmx_vehiculos_preestudio v INNER JOIN
        cmx_solicitudes_preestudio s
        ON v.id=s.id_preestudio
        LEFT JOIN cmx_solicitudes_estados e
        ON s.id=e.id_solicitud
        WHERE s.id_preestudio=".$conse." AND s.id=".$soli."
        "; */

        $sql = "
			SELECT v.*, s.* , s.id AS soli_prees,
			pp.nombre_cliente
			FROM cmx_solicitudes_preestudio s
			INNER JOIN cmx_vehiculos_preestudio v
			ON s.id_preestudio=v.id
			LEFT JOIN cmx_solicitudes_estados e
			ON s.id=e.id_solicitud
			LEFT JOIN cmx_preestudio_solicitudes_servicio AS n
			ON e.id_solicitud=n.id_solicitudpreestudio
			LEFT JOIN cmx_solicitud_vehiculo2 pp
			ON n.id_servicio_cliente=pp.id
			WHERE   s.id='" . $soli . "' AND s.placa='" . $placa . "'
			GROUP BY s.placa  ";

        // echo $sql;
        $result = $Data->getConsulta($sql);
        if ($result) {

            /*$sql2="SELECT * FROM cmx_referencias_preestudio
            WHERE consecutivo=".$conse."
            and estado='1' ";
            $result2=$Data->getConsulta($sql2);*/

            $idcon = $result["rowsData"][0]["documento_conductor"];
            $sql2 = "SELECT * FROM cmx_proveedores
				WHERE numero_documento=" . $idcon . " ";
            $result4 = $Data->getConsulta($sql2);
            //si existe result2,buscar por el id la referencia , si no existe buscar referencia por numero documento
            if ($result4) {
                $id = $result4["rowsData"][0]["id"];
                $sql4 = "SELECT * FROM cmx_referencias_preestudio
						WHERE id_conductor=" . $id . "  ";
                $result2 = $Data->getConsulta($sql4);
                $return["result2"] = $result2["rowsData"];
            } else {
                $sql4 = "SELECT * FROM cmx_referencias_preestudio
						WHERE id_conductor=" . $idcon . "  ";
                $result2 = $Data->getConsulta($sql4);
                $return["result2"] = $result2["rowsData"];
            }

            //consultar las solicitudes de servicio al cliente

            $sql3 = "
				SELECT a.peso_kg, a.nombre_cliente, a.tipo_vehiculo, a.fecha, a.hora, a.usuario_auditor, tv.nombre AS tipovehiculo,
				CONCAT(C1.municipio,'-',C1.depto) AS orige,
				CONCAT(C2.municipio,'-',C2.depto) AS dest
				FROM cmx_preestudio_solicitudes_servicio z
				INNER JOIN cmx_solicitud_vehiculo2 a
				ON z.id_servicio_cliente=a.id
				INNER JOIN cmx_municipios C1
				ON a.origen=C1.rndc_codigo_ciudad
				INNER JOIN cmx_municipios C2
				ON a.destino=C2.rndc_codigo_ciudad
				INNER JOIN cmx_para_tipo_vehiculo tv
				ON a.tipo_vehiculo=tv.id
				WHERE z.id_solicitudpreestudio=" . $soli . "
				AND z.es=1


			  ";
            $result3 = $Data->getConsulta($sql3);

        }

        $return["result"] = $result["rowsData"];
        //$return["result2"] = $result2["rowsData"];
        $return["result3"] = $result3["rowsData"];

        break;

    case 'esolicitud_preestudio':
        $placa = $_REQUEST["placa"];
        $soli = $_REQUEST["solicitud"];
        $sql = "
			SELECT v.*, s.* , s.id as 'soli_pres'
			FROM cmx_solicitudes_preestudio s
			INNER JOIN cmx_vehiculos_preestudio v
			ON s.id_preestudio=v.id
			 LEFT JOIN cmx_solicitudes_estados e
			ON s.id=e.id_solicitud
			WHERE  s.id=" . $soli . " AND s.placa='" . $placa . "'
		";
        // echo $sql;
        $result = $Data->getConsulta($sql);
        if ($result) {

            //referencias laborales
            $idcon = $result["rowsData"][0]["documento_conductor"];
            $sql2 = "SELECT * FROM cmx_proveedores
				WHERE numero_documento=" . $idcon . " ";
            $result6 = $Data->getConsulta($sql2);
            //si existe result2,buscar por el id la referencia , si no existe buscar referencia por numero documento
            if ($result6) {
                $id = $result6["rowsData"][0]["id"];
                $sql4 = "SELECT * FROM cmx_referencias_preestudio
						WHERE id_conductor=" . $id . "  ";
                $result2 = $Data->getConsulta($sql4);
                $return["result2"] = $result2["rowsData"];
            } else {
                $sql4 = "SELECT * FROM cmx_referencias_preestudio
						WHERE id_conductor=" . $idcon . "  ";
                $result2 = $Data->getConsulta($sql4);
                $return["result2"] = $result2["rowsData"];
            }

            //solicitudes de servicio al cliente

            $sql3 = "
				SELECT a.peso_kg, a.nombre_cliente, a.tipo_vehiculo, a.fecha, a.hora, a.usuario_auditor, z.id,
				CONCAT(C1.municipio,'-',C1.depto) AS orige,
				CONCAT(C2.municipio,'-',C2.depto) AS dest
				FROM cmx_preestudio_solicitudes_servicio z
				INNER JOIN cmx_solicitud_vehiculo2 a
				ON z.id_servicio_cliente=a.id
				INNER JOIN cmx_municipios C1
				ON a.origen=C1.rndc_codigo_ciudad
				INNER JOIN cmx_municipios C2
				ON a.destino=C2.rndc_codigo_ciudad
				WHERE z.id_solicitudpreestudio=" . $soli . " and z.es=1
			";
            $result3 = $Data->getConsulta($sql3);

            //documentos

            $sql5 = "SELECT id, id_sol_prees, tipo_hv, clase, ruta, nombre_archivo
			FROM cmx_documeto_preestudio
			WHERE id_sol_prees=" . $soli . "  ";
            $result5 = $Data->getConsulta($sql5);

        }

        $sql4 = "
			SELECT observacion FROM cmx_edicion_preestudio t1
			WHERE t1.id = (SELECT MAX(t2.id)
			FROM cmx_edicion_preestudio t2 WHERE t2.id_Solicitud=$soli )
			 ";
        $result4 = $Data->getConsulta($sql4);

        $return["result"] = $result["rowsData"];
        //$return["result2"] = $result2["rowsData"];
        $return["result3"] = $result3["rowsData"];
        $return["result4"] = $result4["rowsData"];
        $return["result5"] = $result5["rowsData"];

        break;

    case 'consulte_solicitud':
        $tipo = $_REQUEST["tipo"];
        $fi = $_REQUEST["fini"];
        $ff = $_REQUEST["ffin"];

        if ($tipo == 't') {

            /*$sql="SELECT s.id as esoli, s.*, e.*
            FROM cmx_solicitudes_preestudio AS s
            INNER JOIN cmx_solicitudes_estados AS e
            ON s.id=e.id_solicitud
            WHERE e.estado_actual='1'
            AND e.fecha BETWEEN
            '".$fi."' AND '".$ff."'  ";  */

            /*$sql="
            SELECT s.id AS esoli, s.*, e.* ,
            ser.id AS servi, me.n_cotizacion, me.item
            FROM cmx_solicitudes_preestudio AS s
            INNER JOIN cmx_solicitudes_estados AS e
            ON s.id=e.id_solicitud
            -- unir con tabla intermedia de solicitudes
            INNER JOIN cmx_preestudio_solicitudes_servicio p
            ON s.id=p.id_solicitudpreestudio
            -- unir con tabla de solicitudes
            INNER  JOIN cmx_solicitud_vehiculo2 ser
            ON p.id_servicio_cliente=ser.id
            INNER JOIN cmx_detalle_mercancia2 AS me
            ON ser.n_cotizacion=me.n_cotizacion AND ser.idpareja_origen_destino = me.id
            WHERE e.estado_actual='1'
            AND e.fecha BETWEEN
            '".$fi."' AND '".$ff."'   "; */

            /*$sql="
            SELECT    s.id AS esoli, s.*, e.* ,
            ser.id AS servi, me.n_cotizacion, me.item,
            v.documento_propietario, v.documento_tenedor,
            v.documento_conductor,
            se.id AS idsoliestudio,cv.id_conductor,
            cv.id AS 'idvehi',
            c.estado as estadoestudio,
            CASE
            e.estado WHEN 'aprobado'
            THEN 'Autorizado HV'
            ELSE e.estado
            END AS campo,
            CASE WHEN se.id  IS NULL THEN 'NO'
            ELSE 'SI' END AS soli_estudio

            FROM
            cmx_vehiculos_preestudio AS v INNER JOIN
            cmx_solicitudes_preestudio AS s
            ON v.id=s.id_preestudio
            INNER JOIN cmx_solicitudes_estados AS e
            ON s.id=e.id_solicitud

            INNER JOIN cmx_preestudio_solicitudes_servicio p
            ON s.id=p.id_solicitudpreestudio

            INNER  JOIN cmx_solicitud_vehiculo2 ser
            ON p.id_servicio_cliente=ser.id
            INNER JOIN cmx_detalle_mercancia2 AS me
            ON ser.n_cotizacion=me.n_cotizacion AND ser.idpareja_origen_destino = me.id

            LEFT JOIN cmx_log_solicitudvehiculo2 se  ON s.id = se.id_solictud
            LEFT JOIN cmx_vehiculos cv ON se.placa=cv.placa
            LEFT JOIN cmx_estudio_vehiculo est
            ON se.id=est.id_solicitud
            LEFT JOIN cmx_estudiov_completo c
            ON est.id=c.id_estudio

            WHERE e.estado_actual='1'
            AND e.fecha BETWEEN
            '".$fi."' AND '".$ff."'
            ORDER BY e.fecha, e.hora DESC
            ";*/

            $factual = date('Y-m-d');
            $hactual = date('G:i:s');
            $user = $_SESSION["usuario"]["nom_usuario"];
            $sqlm = "SELECT  e.id AS idestados,
				s.id AS 'idsolitu', p.id_servicio_cliente
				FROM cmx_solicitudes_preestudio s
				INNER JOIN cmx_solicitudes_estados e
				ON s.id=e.id_solicitud	AND e.estado_actual=1
				LEFT JOIN cmx_preestudio_solicitudes_servicio p
				ON s.id=p.id_solicitudpreestudio
				WHERE TIMESTAMPDIFF(DAY, s.fecha, '" . $factual . "')>=1
				AND e.estado <> 'vencida' AND  e.estado <> 'aprobado'
				AND  e.estado <> 'cancelado'  AND  e.estado <> 'rechazado' ";
            $resultm = $Data->getConsulta($sqlm);
            if ($resultm) {
                foreach ($resultm["rowsData"] as $index1 => $element1) {

                    $idactu = $element1['idestados'];
                    $idsoli = $element1['idsolitu'];

                    //Actualizar los estados de la solicitud a cero para poder ponerlas vencidas porque ya pasaron la fecha vigente de 24 horas
                    $sqla = "UPDATE cmx_solicitudes_estados
						SET estado_actual=0
						WHERE  id=" . $idactu . "   ";
                    //echo $sqla;

                    $resulta = $Data->ejecuteRegistro($sqla);
                    //insertar

                    //PONER DELETE DE SOLICITUDES DE SERVICIO
                    //delete en cmx_preestudio_solicitudes_servicio
                    //delete en cmx_log_solicitudvehiculo
                    $idservi = $element1['id_servicio_cliente'];

                    /*$sqld="DELETE FROM
                cmx_preestudio_solicitudes_servicio
                WHERE id_servicio_cliente=".$idservi."
                AND id_solicitudpreestudio=".$idsoli." ";
                $resultps=$Data->ejecuteRegistro($sqld);

                $sqlser="DELETE FROM
                cmx_log_solicitudvehiculo
                WHERE id_solictud=".$idservi."    ";
                $resultservi=$Data->ejecuteRegistro($sqlser);    */
                }
                $nuevafecha = strtotime('-1 day', strtotime($factual));
                $nuevafecha = date('Y-m-d', $nuevafecha);
                /* ESTE ESTA BIEN - el de abajo es para probar
                $sqli="INSERT cmx_solicitudes_estados
                (id,estado,id_solicitud,fecha,hora,usuario,estado_actual,area)
                VALUES(null,'vencida',".$idsoli.",'".$factual."','".$hactual."','".$user."',1,'sistema')";*/
                $sqli = "INSERT cmx_solicitudes_estados
						(id,estado,id_solicitud,fecha,hora,usuario,estado_actual,area)
						VALUES(null,'vencida'," . $idsoli . ",'" . $nuevafecha . "','24:00:00','" . $user . "',1,'sistema')";
                $resulti = $Data->ejecuteRegistro($sqli);
            }
            //consulta de la tabla

            $sql = "
				SELECT
				s.id AS esoli,
				s.id_preestudio,s.placa, s.fecha, s.hora, s.usuario,
				s.observacion, s.proceso,s.operacion ,e.estado, e.estado_actual,
				CASE
				e.estado WHEN 'aprobado'
				THEN 'Autorizado HV'
				ELSE e.estado
				END AS campo,
				CASE  WHEN ve.id   IS NULL THEN 0 ELSE ve.id  END AS 'idvehi',
				CASE WHEN ve.id_conductor IS NULL THEN 0 ELSE ve.id_conductor END AS 'id_conductor',
				CASE WHEN v.documento_propietario IS NULL THEN 0 ELSE v.documento_propietario END AS 'documento_propietario',
				CASE WHEN v.documento_tenedor IS NULL THEN 0 ELSE v.documento_tenedor END AS 'documento_tenedor',
				CASE WHEN v.documento_conductor IS NULL THEN 0 ELSE v.documento_conductor END AS 'documento_conductor',
				CASE WHEN est.id IS NULL THEN 0 ELSE est.id  END AS 'idsoliestudio',
				CASE WHEN eg.estado IS NULL THEN 'Sin iniciar' ELSE eg.estado END AS 'estado_seguridad',
				CASE WHEN eg.id IS NULL THEN 0 ELSE eg.id END AS 'idvcompleto',
				CASE WHEN eg.observacion IS NULL THEN '' ELSE eg.observacion END AS 'vobse', e.id AS ide,
				CASE WHEN se.id IS NULL THEN 'NO' ELSE 'SI' END AS 'estudiosegu'
				FROM cmx_solicitudes_preestudio AS s
				INNER JOIN cmx_vehiculos_preestudio AS v
				ON s.id_preestudio=v.id
				INNER JOIN cmx_solicitudes_estados AS e
				ON s.id=e.id_solicitud
				LEFT JOIN cmx_vehiculos ve
				ON v.placa_vehiculo=ve.placa
				LEFT JOIN cmx_log_solicitudvehiculo2 se
				ON s.id=se.id_solictud
				LEFT JOIN cmx_estudio_vehiculo est
				ON se.id=est.id_solicitud
				LEFT JOIN cmx_estudiov_completo eg
				ON est.id=eg.id_estudio AND eg.estado_actu=1
				WHERE e.estado_actual='1'
				AND e.fecha BETWEEN
				'" . $fi . "' AND '" . $ff . "'
				ORDER BY s.id DESC
		 ";

            //echo $sql;

        }
        if ($tipo != 't') {

            /*    $sql="SELECT s.id as esoli, s.*, e.*
            FROM cmx_solicitudes_preestudio AS s
            INNER JOIN cmx_solicitudes_estados AS e
            ON s.id=e.id_solicitud
            WHERE e.estado='".$tipo."' and e.estado_actual=1
            AND e.fecha BETWEEN
            '".$fi."' AND '".$ff."'  "; */

            /*$sql="SELECT s.id AS esoli, s.*, e.* ,
            ser.id AS servi, me.n_cotizacion, me.item
            FROM cmx_solicitudes_preestudio AS s
            INNER JOIN cmx_solicitudes_estados AS e
            ON s.id=e.id_solicitud
            -- unir con tabla intermedia de solicitudes
            INNER JOIN cmx_preestudio_solicitudes_servicio p
            ON s.id=p.id_solicitudpreestudio
            -- unir con tabla de solicitudes
            INNER  JOIN cmx_solicitud_vehiculo2 ser
            ON p.id_servicio_cliente=ser.id
            INNER JOIN cmx_detalle_mercancia2 AS me
            ON ser.n_cotizacion=me.n_cotizacion AND ser.idpareja_origen_destino = me.id
            WHERE e.estado='".$tipo."' and e.estado_actual='1'
            AND e.fecha BETWEEN
            '".$fi."' AND '".$ff."'   "; */

            $sql = "
							SELECT    s.id AS esoli, s.*, e.* ,
						ser.id AS servi, me.n_cotizacion, me.item,
						v.documento_propietario, v.documento_tenedor, v.documento_conductor,

						se.id  AS idsoliestudio,cv.id_conductor,cv.id AS 'idvehi',
						c.estado as estadoestudio,
						CASE
						e.estado WHEN 'aprobado'
						THEN 'Autorizado HV'
						ELSE e.estado
						END AS campo,
						CASE WHEN se.id  IS NULL THEN 'NO'
						ELSE 'SI' END AS soli_estudio



						FROM
						cmx_vehiculos_preestudio AS v INNER JOIN
						cmx_solicitudes_preestudio AS s
						ON v.id=s.id_preestudio
						INNER JOIN cmx_solicitudes_estados AS e
						ON s.id=e.id_solicitud

						INNER JOIN cmx_preestudio_solicitudes_servicio p
						ON s.id=p.id_solicitudpreestudio
					        INNER  JOIN cmx_solicitud_vehiculo2 ser
						ON p.id_servicio_cliente=ser.id
						INNER JOIN cmx_detalle_mercancia2 AS me
						ON ser.n_cotizacion=me.n_cotizacion AND ser.idpareja_origen_destino = me.id




						LEFT JOIN cmx_log_solicitudvehiculo2 se  ON s.id = se.id_solictud
						LEFT JOIN cmx_vehiculos cv ON se.placa=cv.placa
						LEFT JOIN cmx_estudio_vehiculo est
						ON se.id=est.id_solicitud
						LEFT JOIN cmx_estudiov_completo c
						ON est.id=c.id_estudio



						WHERE e.estado='" . $tipo . "' and
						 e.estado_actual='1'
						AND e.fecha BETWEEN
						'" . $fi . "' AND '" . $ff . "'
						ORDER BY e.fecha, e.hora DESC
			";

            //echo $slq;

        }
        // echo $sql;
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;
    //Pasar el estudio de seguridad que esta rechazado para modificar a pendiente

    //VALIDACIONES DEL ESTUDIO DE SEGURIDAD

    case 'valida_placa':
        $placa = $_REQUEST["placa"];
        $sql = "SELECT * FROM cmx_vehiculos
			WHERE placa='" . $placa . "'  ";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'verestudio':
        $idv = $_REQUEST["idv"];
        $idc = $_REQUEST["idc"];
        $idsoli = $_REQUEST["idsoli"];

        $sql2 = "
			SELECT  e.id_solicitud , a.*,
		CASE WHEN ec.estado IS NULL THEN 'gray' ELSE ec.estado  END AS 'estadototal'
		FROM cmx_aprobacion_estudio a
		INNER JOIN
		cmx_estudio_vehiculo e
		ON a.id_estudio=e.id
		LEFT JOIN cmx_estudiov_completo ec
		ON e.id=ec.id_estudio AND estado_actu=1
		WHERE a.id_vehiculo=" . $idv . "
		AND a.id_conductor=" . $idc . "
		 AND e.id=" . $idsoli . " ";

        //echo $sql2;
        $result = $Data->getConsulta($sql2);
        $return["result"] = $result["rowsData"];

        break;

    //lista comprobacion de operaciones
    case 'verestudio_operaciones':
        $idv = $_REQUEST["idv"];
        $idc = $_REQUEST["idc"];
        $idsoli = $_REQUEST["idsoli"];

        $sql2 = "
			SELECT  e.id_solicitud , a.*,
		CASE WHEN ec.estado IS NULL THEN 'gray'
		ELSE ec.estado  END AS 'estadototal'
		FROM cmx_aprobacion_estudio a
		INNER JOIN
		cmx_estudio_vehiculo e
		ON a.id_estudio=e.id AND a.activo=1
		LEFT JOIN cmx_estudiov_completo ec
		ON e.id=ec.id_estudio AND estado_actu=1
		WHERE a.id_vehiculo=" . $idv . "
		AND a.id_conductor=" . $idc . "
		 AND e.id=" . $idsoli . " ";

        //echo $sql2;
        $result = $Data->getConsulta($sql2);
        $return["result"] = $result["rowsData"];

        break;

    case 'valida_condu':
        $documento = $_REQUEST["conductor"];
        $sql = "SELECT p.* FROM cmx_proveedores  p
			INNER JOIN cmx_actividad_proveedor a
			ON p.id=a.id_proveedor
			WHERE a.actividad='Conductor'
			AND  p.numero_documento=" . $documento . "   ";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'valida_propi':
        $documento = $_REQUEST["propietario"];
        $sql = "SELECT p.* FROM cmx_proveedores  p
			INNER JOIN cmx_actividad_proveedor a
			ON p.id=a.id_proveedor
			WHERE a.actividad='Propietario Vehiculo'
			AND  p.numero_documento=" . $documento . "   ";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'valida_tenedor':
        $documento = $_REQUEST["tenedor"];
        $sql = "
				SELECT p.* FROM cmx_proveedores  p
				INNER JOIN cmx_actividad_proveedor a
				ON p.id=a.id_proveedor
				WHERE a.actividad='Poseedor Vehiculo'
				AND  p.numero_documento=" . $documento . "   ";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'vincular':
        $placa = $_REQUEST["placa"];
        $dpropi = $_REQUEST["propietario"];
        $dtene = $_REQUEST["tenedor"];
        $dcondu = $_REQUEST["conductor"];
        $sql = "
			SELECT v.* FROM cmx_vehiculos v
			INNER JOIN cmx_proveedores CON
			ON   v.id_conductor=CON.id
			INNER JOIN cmx_proveedores PRO
			ON v.id_propietario=PRO.id
			INNER JOIN cmx_proveedores TENE
			ON v.id_tenedor=TENE.id
			WHERE v.placa='" . $placa . "'
			AND CON.numero_documento=" . $dcondu . "
			AND PRO.numero_documento=" . $dpropi . "
			AND TENE.numero_documento=" . $dtene . "   ";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    //

    case 'actualizar_hora':
        $hora = $_REQUEST["hora"];
        $estado = $_REQUEST["estado"];
        $id = $_REQUEST["id"];
        $fecha = date('Y-m-d');
        $hora_c = date('H:i:s');
        $id_usuario = $_SESSION["usuario"]["nom_usuario"];
        $sql = "UPDATE cmx_control_horas
			SET hora='" . $hora . "', estado='" . $estado . "',
			fecha='" . $fecha . "', hora_creacion='" . $hora_c . "',
			usuario='" . $id_usuario . "'
			WHERE id=" . $id . "  ";
        $result = $Data->ejecuteRegistro($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'inactivar_horas_update':
        $id = $_REQUEST["valor"];
        $sql = "
			UPDATE cmx_control_horas
			SET estado='Inactivo'
			WHERE id NOT IN(" . $id . ")";
        $result = $Data->ejecuteRegistro($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'existe_hora':
        $sql = "SELECT * FROM cmx_control_horas";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'crear_hora_preestudio':
        //PARAMETROS
        $hora = $_REQUEST["hora"];
        $estado = $_REQUEST["estado"];
        $fecha = date('Y-m-d');
        $hora_c = date('H:i:s');
        $id_usuario = $_SESSION["usuario"]["nom_usuario"];
        $sql = "INSERT INTO cmx_control_horas(id,hora,estado,fecha,hora_creacion,usuario)
		VALUES(null," . $hora . ",'" . $estado . "','" . $fecha . "','" . $hora_c . "','" . $id_usuario . "')";
        $result = $Data->ejecuteRegistro($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'update_horas':
        $sql = "SELECT max(id) as ID_INGRESADO FROM cmx_control_horas  ";
        $result = $Data->getConsulta($sql);
        $idsalida = $result["rowsData"][0]["ID_INGRESADO"];
        if ($result) {
            $sql = "
			UPDATE cmx_control_horas
			SET estado='Inactivo'
			WHERE id<=" . $idsalida . "   ";
            $result2 = $Data->ejecuteRegistro($sql);
        }
        $return["result"] = $result2["rowsData"];
        break;

    //consultar si la placa y el vehiculo estan desbloqueados

    case 'consultar_bloqueo':
        $placa = $_REQUEST["id"];
        $sql = "SELECT B.estado_proceso AS estado_vehiculo
			FROM cmx_vehiculos UNO
				INNER JOIN cmx_estado_bloqueo B
				ON UNO.id=B.id_objeto
				WHERE UNO.placa='" . $placa . "'";
        $result = $Data->getConsulta($sql);

        $sql2 = "SELECT C.estado_proceso AS estado_conductor
			FROM cmx_vehiculos UNO
			INNER JOIN cmx_estado_bloqueo C
			ON UNO.id_conductor=C.id_objeto
			WHERE UNO.placa='" . $placa . "'";

        $result2 = $Data->getConsulta($sql2);

        $return["result"] = $result["rowsData"];
        $return["result2"] = $result2["rowsData"];
        break;

    case 'consultar_vp':
        $placa = $_REQUEST["id"];
        $sql = "
			SELECT a.id AS idv, a.*,cc.estado_vehiculo,
			b.id AS idsolu,b.estado_actual_sol ,b.observacion, e.estado, e.estado_actual
			FROM cmx_vehiculos_preestudio a
			INNER JOIN cmx_vehiculos_preestudio_estado cc
			ON a.id=cc.vehiculo_preestudio
			INNER JOIN cmx_solicitudes_preestudio b
			ON a.id=b.id_preestudio
			LEFT JOIN cmx_solicitudes_estados e
			ON b.id=e.id_solicitud
			WHERE a.placa_vehiculo='" . $placa . "'
			AND e.estado_actual='1' AND cc.estado_final='1'

		";
        $result = $Data->getConsulta($sql);

        if ($result) {
            //traer solictudes de servicio
            $idso = $result["rowsData"][0]["idsolu"];
            $sql2 = "
				SELECT a.peso_kg, a.nombre_cliente, a.tipo_vehiculo, a.fecha, a.hora, a.usuario_auditor,
				CONCAT(C1.municipio,'-',C1.depto) AS orige,
				CONCAT(C2.municipio,'-',C2.depto) AS dest
				FROM cmx_preestudio_solicitudes_servicio z
				INNER JOIN cmx_solicitud_vehiculo2 a
				ON z.id_servicio_cliente=a.id
				INNER JOIN cmx_municipios C1
				ON a.origen=C1.rndc_codigo_ciudad
				INNER JOIN cmx_municipios C2
				ON a.destino=C2.rndc_codigo_ciudad
				WHERE z.id_solicitudpreestudio=" . $idso . "
				and z.es=1
			";
            $result2 = $Data->getConsulta($sql2);
            $return["result2"] = $result2["rowsData"];

            //traer referencias preestudio
            $idconductor = $result["rowsData"][0]["documento_conductor"];
            $sql3 = "
				SELECT * FROM cmx_referencias_preestudio
				WHERE id_conductor=" . $idconductor . "
			";
            $result3 = $Data->getConsulta($sql3);
            $return["result3"] = $result3["rowsData"];
        }

        $return["result"] = $result["rowsData"];
        break;

    case 'consultar_vp2':
        $isoli = $_REQUEST["id"];
        $sql = "
			SELECT a.id AS idv, a.*,cc.estado_vehiculo,
			b.id AS idsolu,b.estado_actual_sol ,b.observacion, e.estado, e.estado_actual
			FROM cmx_vehiculos_preestudio a
			INNER JOIN cmx_vehiculos_preestudio_estado cc
			ON a.id=cc.vehiculo_preestudio
			INNER JOIN cmx_solicitudes_preestudio b
			ON a.id=b.id_preestudio
			LEFT JOIN cmx_solicitudes_estados e
			ON b.id=e.id_solicitud
			WHERE b.id='" . $isoli . "'
			AND e.estado_actual='1' AND cc.estado_final='1'

		";
        $result = $Data->getConsulta($sql);

        if ($result) {
            //traer solictudes de servicio
            $idso = $result["rowsData"][0]["idsolu"];
            $sql2 = "
				SELECT a.peso_kg, a.nombre_cliente, a.tipo_vehiculo, a.fecha, a.hora, a.usuario_auditor,
				CONCAT(C1.municipio,'-',C1.depto) AS orige,
				CONCAT(C2.municipio,'-',C2.depto) AS dest
				FROM cmx_preestudio_solicitudes_servicio z
				INNER JOIN cmx_solicitud_vehiculo2 a
				ON z.id_servicio_cliente=a.id
				INNER JOIN cmx_municipios C1
				ON a.origen=C1.rndc_codigo_ciudad
				INNER JOIN cmx_municipios C2
				ON a.destino=C2.rndc_codigo_ciudad
				WHERE z.id_solicitudpreestudio=" . $idso . "
				and z.es=1
			";
            $result2 = $Data->getConsulta($sql2);
            $return["result2"] = $result2["rowsData"];

            //traer referencias preestudio
            $idconductor = $result["rowsData"][0]["documento_conductor"];
            $sql3 = "
				SELECT * FROM cmx_referencias_preestudio
				WHERE id_conductor=" . $idconductor . "
			";
            $result3 = $Data->getConsulta($sql3);
            $return["result3"] = $result3["rowsData"];
        }

        $return["result"] = $result["rowsData"];
        break;

    //traer solo los datos de la placa que ya tiene hojas de vida
    case 'consultar_preestudio2':
        $placa = $_REQUEST["id"];
        /*$sql="
        SELECT a.id AS idv, a.*,cc.estado_vehiculo,
        b.id AS idsolu,b.estado_actual_sol ,b.observacion, e.estado, e.estado_actual
        FROM cmx_vehiculos_preestudio a
        INNER JOIN cmx_vehiculos_preestudio_estado cc
        ON a.id=cc.vehiculo_preestudio
        INNER JOIN cmx_solicitudes_preestudio b
        ON a.id=b.id_preestudio
        LEFT JOIN cmx_solicitudes_estados e
        ON b.id=e.id_solicitud
        WHERE a.placa_vehiculo='".$placa."'
        AND e.estado_actual='1' AND cc.estado_final='1'
        ";
        $result = $Data->getConsulta($sql);*/

        //traer datos del vehiculo
        $sql2 = "SELECT v.placa, t.placa AS placa_trailer,
				v.web_satelital, v.usuario_satelital,
				v.clave_satelital, v.id_conductor,
				pro.nombre AS nombre_propietario,
				pro.numero_documento AS documento_propietario,
				pro.subir_licencia, pro.n_docu_licencia,
				te.nombre AS nombre_tenedor,
				te.numero_documento AS documento_tenedor,
				co.nombre AS nombre_conductor,
				co.numero_documento AS documento_conductor,
				dc.id AS id_detacondu,
				dc.documento_eps, dc.n_docu_eps,
				dc.documento_arl, dc.n_docu_arl,
				dc.carnet_curso, dc.n_docu_curso,
				dc.documento_rut, dc.n_docu_rut,
				vv.capacidad_tn,
				pro.apellido1 AS proape1, pro.apellido2 AS proape2,
				te.apellido1 AS teape1, te.apellido2 AS teape2,
				co.apellido1 AS coape1, co.apellido1 AS coape2
				FROM cmx_vehiculos v
				LEFT JOIN cmx_trailer_vehiculo tra
				ON v.id=tra.id_vehiculo
				LEFT JOIN cmx_trailer t
				ON tra.id_trailer=t.id
				INNER JOIN cmx_proveedores pro
				ON v.id_propietario=pro.id
				INNER JOIN cmx_proveedores te
				ON v.id_tenedor=te.id
				INNER JOIN cmx_proveedores co
				ON v.id_conductor=co.id
				INNER JOIN cmx_detalle_conductor dc
				ON v.id_conductor=dc.id_proveedor
				LEFT JOIN cmx_vehiculo2 vv
				ON v.id=vv.id_vehiculo
				WHERE v.placa='" . $placa . "'";
        $result = $Data->getConsulta($sql2);
        $return["result"] = $result["rowsData"];

        //traer referencias laborales si existe un vehiculo
        $sqlr = "SELECT r.* FROM cmx_vehiculos v
						INNER JOIN cmx_proveedores p
						ON v.id_conductor=p.id
						INNER JOIN cmx_referencias_preestudio r
						ON p.id=r.id_conductor
						WHERE v.placa='" . $placa . "'";

        //echo $sqlr;
        $result3 = $Data->getConsulta($sqlr);
        $return["result3"] = $result3["rowsData"];

        //traer referencias personales si existe un vehiculo
        $sqlpe = "SELECT pe.* FROM cmx_vehiculos v
						INNER JOIN cmx_proveedores p
						ON v.id_conductor=p.id
						INNER JOIN cmx_referencias_personales pe
						ON p.id=pe.id_conductor
						WHERE v.placa='" . $placa . "'";
        $result33 = $Data->getConsulta($sqlpe);
        $return["result33"] = $result33["rowsData"];

        //$return["result"] = $result["rowsData"];*/

        break;

    case 'consultar_preestudio':
        $placa = $_REQUEST["id"];

        //consulte viejita
        // $sql="SELECT a.id AS idv, a.*,b.id as idsolu, b.cliente,b.estado_actual_sol ,b.observacion, e.estado, e.estado_actual
        //     FROM cmx_vehiculos_preestudio a
        //     INNER JOIN cmx_solicitudes_preestudio b
        //     ON a.id=b.id_preestudio
        //     LEFT JOIN cmx_solicitudes_estados e
        //      ON b.id=e.id_solicitud
        //     WHERE a.placa_vehiculo='".$placa."'
        //     AND e.estado_actual='1'   ";

        //consulta nueva traer solicitudes de preestudio
        $sql = "
			SELECT a.id AS idv, a.*,cc.estado_vehiculo,
			b.id AS idsolu,b.estado_actual_sol ,b.observacion, e.estado, e.estado_actual
			FROM cmx_vehiculos_preestudio a
			INNER JOIN cmx_vehiculos_preestudio_estado cc
			ON a.id=cc.vehiculo_preestudio
			INNER JOIN cmx_solicitudes_preestudio b
			ON a.id=b.id_preestudio
			LEFT JOIN cmx_solicitudes_estados e
			ON b.id=e.id_solicitud
			WHERE a.placa_vehiculo='" . $placa . "'
			AND e.estado_actual='1' AND cc.estado_final='1'
		";
        //echo $sql;
        $result = $Data->getConsulta($sql);

        /*$sql2="SELECT v.placa, t.placa AS placa_trailer,
        v.web_satelital, v.usuario_satelital, v.clave_satelital,
        pro.nombre AS nombre_propietario,
        pro.numero_documento AS documento_propietario,
        te.nombre AS nombre_tenedor,
        te.numero_documento AS documento_tenedor,
        co.nombre AS nombre_conductor,
        co.numero_documento AS documento_conductor
        FROM cmx_vehiculos v
        LEFT JOIN cmx_trailer_vehiculo tra
        ON v.id=tra.id_vehiculo
        LEFT JOIN cmx_trailer t
        ON tra.id_trailer=t.id
        INNER JOIN cmx_proveedores pro
        ON v.id_propietario=pro.id
        INNER JOIN cmx_proveedores te
        ON v.id_tenedor=te.id
        INNER JOIN cmx_proveedores co
        ON v.id_conductor=co.id
        WHERE v.placa='".$placa."'    "; */

        $sql2 = "SELECT v.placa, t.placa AS placa_trailer,
				v.web_satelital, v.usuario_satelital,
				v.clave_satelital, v.id_conductor,
				pro.nombre AS nombre_propietario,
				pro.numero_documento AS documento_propietario,
				pro.subir_licencia, pro.n_docu_licencia,
				te.nombre AS nombre_tenedor,
				te.numero_documento AS documento_tenedor,
				co.nombre AS nombre_conductor,
				co.numero_documento AS documento_conductor,
				dc.id AS id_detacondu,
				dc.documento_eps, dc.n_docu_eps,
				dc.documento_arl, dc.n_docu_arl,
				dc.carnet_curso, dc.n_docu_curso,
				dc.documento_rut, dc.n_docu_rut
				FROM cmx_vehiculos v
				LEFT JOIN cmx_trailer_vehiculo tra
				ON v.id=tra.id_vehiculo
				LEFT JOIN cmx_trailer t
				ON tra.id_trailer=t.id
				INNER JOIN cmx_proveedores pro
				ON v.id_propietario=pro.id
				INNER JOIN cmx_proveedores te
				ON v.id_tenedor=te.id
				INNER JOIN cmx_proveedores co
				ON v.id_conductor=co.id
				INNER JOIN cmx_detalle_conductor dc
				ON v.id_conductor=dc.id_proveedor
				WHERE v.placa='" . $placa . "'	";

        $result2 = $Data->getConsulta($sql2);
        if ($result2) {
            //traer referencias laborales si existe un vehiculo
            $sqlr = "SELECT r.* FROM cmx_vehiculos v
						INNER JOIN cmx_proveedores p
						ON v.id_conductor=p.id
						INNER JOIN cmx_referencias_preestudio r
						ON p.id=r.id_conductor
						WHERE v.placa='" . $placa . "'";
            //echo $sqlr;
            $result3 = $Data->getConsulta($sqlr);
            $return["result3"] = $result3["rowsData"];

            //traer referencias personales si existe un vehiculo
            $sqlpe = "SELECT pe.* FROM cmx_vehiculos v
						INNER JOIN cmx_proveedores p
						ON v.id_conductor=p.id
						INNER JOIN cmx_referencias_personales pe
						ON p.id=pe.id_conductor
						WHERE v.placa='" . $placa . "'";
            $result33 = $Data->getConsulta($sqlpe);
            $return["result33"] = $result33["rowsData"];

        }

        //echo $sql2;
        if ($result) {
            //traer id de la placa
            /*    $sqli="SELECT id as id
            FROM cmx_vehiculos_preestudio
            WHERE placa_vehiculo='".$placa."' ";
            $result3=$Data->getConsulta($sqli);
            $id= $result3["rowsData"][0]["id"];
            $idvehiculo = $result["rowsData"][0]["idv"];
            $sqlr="SELECT * FROM cmx_referencias_preestudio
            WHERE consecutivo=".$idvehiculo."";
            //echo $sqlr;
            $result3=$Data->getConsulta($sqlr);
            $return["result3"] = $result3["rowsData"];*/

            //referencias CAMBIO QUE HICE 24-01-2021

            /*$sqli="SELECT   p.id as id
            FROM cmx_vehiculos_preestudio v
            INNER JOIN cmx_proveedores p
            ON v.documento_conductor=p.numero_documento
            WHERE placa_vehiculo='".$placa."'";
            /*$result5=$Data->getConsulta($sqli);
            $id= $result5["rowsData"][0]["id"];    */

            //NUEVO- traer referencias laborales para solitud nueva
            //cmx_vehiculos_preestudio
            $sqlr = "SELECT r.* FROM cmx_vehiculos v
						INNER JOIN cmx_proveedores p
						ON v.id_conductor=p.id
						INNER JOIN cmx_referencias_preestudio r
						ON p.numero_conductor.=r.id_conductor
						WHERE v.placa='" . $placa . "'";
            //echo $sqlr;
            $result3 = $Data->getConsulta($sqlr);
            $return["result3"] = $result3["rowsData"];

            //solicitudes de servicio
            $idso = $result["rowsData"][0]["idsolu"];
            $sqls = "
				SELECT a.peso_kg, a.nombre_cliente, a.tipo_vehiculo, a.fecha, a.hora, a.usuario_auditor,
				CONCAT(C1.municipio,'-',C1.depto) AS orige,
				CONCAT(C2.municipio,'-',C2.depto) AS dest
				FROM cmx_preestudio_solicitudes_servicio z
				INNER JOIN cmx_solicitud_vehiculo2 a
				ON z.id_servicio_cliente=a.id
				INNER JOIN cmx_municipios C1
				ON a.origen=C1.rndc_codigo_ciudad
				INNER JOIN cmx_municipios C2
				ON a.destino=C2.rndc_codigo_ciudad
				WHERE z.id_solicitudpreestudio=" . $idso . "
				and z.es=1
			";
            $result4 = $Data->getConsulta($sqls);
            $return["result4"] = $result4["rowsData"];

        }

        $return["result"] = $result["rowsData"];
        $return["result2"] = $result2["rowsData"];

        break;

    case 'datos_propietario':
        $sql = "
			SELECT p.id, p.tipo_documento, p.numero_documento, p.digito_verificacion, p.nombre FROM cmx_proveedores p
			INNER JOIN cmx_actividad_proveedor a
			ON p.id=a.id_proveedor
			WHERE a.actividad='Propietario Vehiculo' AND p.estado='Activo';
		";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'datos_tenedor':
        $sql = "
			SELECT p.id, p.tipo_documento, p.numero_documento, p.digito_verificacion, p.nombre FROM cmx_proveedores p
			INNER JOIN cmx_actividad_proveedor a
			ON p.id=a.id_proveedor
			WHERE a.actividad='Poseedor Vehiculo' AND p.estado='Activo';
		";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;
    case 'datos_conductor':
        $sql = "
			SELECT p.id, p.tipo_documento, p.numero_documento, p.digito_verificacion, p.nombre FROM cmx_proveedores p
			INNER JOIN cmx_actividad_proveedor a
			ON p.id=a.id_proveedor
			WHERE a.actividad='Conductor' AND p.estado='Activo';
		";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'consulte_estado':
        $placa = $_REQUEST["placa"];
        $sql = "

		SELECT es.estado_vehiculo FROM cmx_vehiculos_preestudio_estado es
		INNER JOIN cmx_vehiculos_preestudio v
		ON es.vehiculo_preestudio=v.id
		WHERE v.placa_vehiculo='" . $placa . "'
				";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'traer_fila':
        $prees = $_REQUEST["prees"];
        $sql = "
			SELECT id, nombre_empresa, fecha_ingreso, fecha_retiro, persona_contacto, celular, cargo
			FROM  cmx_referencias_preestudio
			WHERE consecutivo=" . $prees . " and estado=1
		";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'inactivasol_servicio':
        $id_soli = $_REQUEST["idservi"];
        $sql = "UPDATE cmx_preestudio_solicitudes_servicio
			SET es='0'
			WHERE id=" . $id_soli . "  ";
        $result = $Data->ejecuteRegistro($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'inactivar_referencia':
        $id_refe = $_REQUEST["id_refe"];
        $sql = "UPDATE cmx_referencias_preestudio
			SET estado='0'
			WHERE id=" . $id_refe . "  ";
        $result = $Data->ejecuteRegistro($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'id_vehic':
        $sql = "SELECT max(id) as 'id' FROM cmx_vehiculos_preestudio";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'respuesta_operaciones':
        $idsolicitud = $_REQUEST["id"];
        $sql = "SELECT * FROM  cmx_edicion_preestudio
			WHERE id_Solicitud=" . $idsolicitud . " ";
        // echo $sql;
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    //creacion solicitud de estudio de seguridad
    case 'valida_solicitudestudio':
        $idpress = $_REQUEST["idprees"];
        $placa = $_REQUEST["placa"];
        $sql = "SELECT * FROM cmx_log_solicitudvehiculo2
			WHERE id_solictud=" . $idpress . " AND placa='" . $placa . "' ";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'solictud_estudio_seg':
        $placa = $_REQUEST["placa"];
        $idprees = $_REQUEST["idprees"];
        $user = $_REQUEST["user"];
        $fecha = $_REQUEST["fecha"];
        $hora = $_REQUEST["hora"];
        $proceso = $_REQUEST["proceso"];

        $sql = "INSERT INTO cmx_log_solicitudvehiculo2(id, id_solictud,placa,user_log,fecha_asignacion,hora_asignacion,estado,proceso,estado_ruta,estado_actu)VALUES(null," . $idprees . ",'" . $placa . "','" . $user . "','" . $fecha . "','" . $hora . "','','" . $proceso . "','Pendiente',1)";
        $result = $Data->ejecuteRegistro($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'consultar_respuesta_operaciones':
        $idstu = $_POST["idstu"];
        $sql = "SELECT * FROM cmx_respuesta_operacion
			WHERE id_estudio=" . $idstu . "
			ORDER BY fecha, hora DESC";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'consulta_rta_operaciones':
        $idstu = $_POST["idestudio"];
        $sql = "SELECT * FROM cmx_respuesta_operacion
			WHERE id_estudio=" . $idstu . "
			ORDER BY fecha, hora DESC";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        //seguridad
        $sql2 = "SELECT * FROM cmx_aprobacion_estudio
			WHERE id_estudio=" . $idstu . "
			ORDER BY fecha, hora DESC";
        $result2 = $Data->getConsulta($sql2);
        $return["result2"] = $result2["rowsData"];
        break;

}
$return["result"] = $result["rowsData"];
echo json_encode($return);
