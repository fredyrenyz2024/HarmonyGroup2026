<?php
include "../application/Config.php";
include '../application/Conexion.php';
include '../application/Model.php';
// $Prefiltro = new servicioclienteModel;
$Data = new Consultas;

switch ($_REQUEST['action']) {
    //traer cotizacion y solicitud de servicio
    case 'cotizacion_es':
        $numero_solicitud = $_REQUEST['idsoli'];
        $sql = '
						SELECT co.* FROM cmx_cotizaciones_serviciocliente co
						INNER JOIN cmx_solicitud_vehiculo2 se
						ON co.n_cotizacion=se.n_cotizacion
						WHERE se.id=' . $numero_solicitud . '

					 ';

        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'ver_mer':
        $idsoli = $_REQUEST["idsoli"];
        $sql = "

				SELECT dm.* , CONCAT(C1.municipio,'-',C1.depto) AS orig,
				 CONCAT(C2.municipio,'-',C2.depto) AS dest, v.nombre
				FROM cmx_cotizaciones_serviciocliente co
				INNER JOIN cmx_detalle_mercancia2 dm
				ON co.n_cotizacion=dm.n_cotizacion
				INNER JOIN cmx_municipios C1
				ON dm.origen=C1.rndc_codigo_ciudad
				INNER JOIN cmx_municipios C2
				ON dm.destino=C2.rndc_codigo_ciudad
				INNER JOIN cmx_para_tipo_vehiculo v
				ON dm.tipo_vehiculo=v.id
				INNER JOIN cmx_solicitud_vehiculo2 se
				ON co.n_cotizacion=se.n_cotizacion
				WHERE se.id=" . $idsoli . "

			";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'ver_espe':
        $idsoli = $_REQUEST["idsoli"];
        $sql = '
				SELECT es.*
				FROM  cmx_detalle_servespecial2 es
				INNER JOIN cmx_solicitud_vehiculo2 se
				ON es.n_cotizacion=se.n_cotizacion
				WHERE se.id=' . $idsoli . '
			';
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'solicitud_servicio':
        $idsoli = $_REQUEST["idsoli"];
        $sql = "
				SELECT se.*, p.nombre FROM cmx_solicitud_vehiculo2 se
				INNER JOIN cmx_para_tipo_vehiculo p
				ON se.tipo_vehiculo=p.id
				WHERE se.id=" . $idsoli . "
			";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'solicitudpreestudio':
        $idsoli = $_REQUEST["idsoli"];
        $sql = "
					SELECT p.*, p.proceso, k.id as serv  FROM cmx_solicitudes_preestudio p
					INNER JOIN cmx_preestudio_solicitudes_servicio m
					ON p.id_preestudio=m.id_solicitudpreestudio
					INNER JOIN cmx_solicitud_vehiculo2 k
					ON m.id_servicio_cliente=k.id
					WHERE m.id=" . $idsoli . "
			";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;
    //cargar los tipos de estudio al select principal
    case 'cargue_select':
        $sql = "SELECT * FROM cmx_tipo_estudio;";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;
    //validar siya este una inciiacionde estudio
    case 'verifiar_boton':
        $id = $_REQUEST["id_soli"];
        $sql = "
			SELECT b.estado, b.id_estudio
			FROM cmx_estudio_vehiculo a
			INNER JOIN cmx_estudiov_completo b
			ON a.id=b.id_estudio
			WHERE a.id_solicitud=" . $id . "
		";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;
    //validar inicio de estudio de seguridad
    case 'validar_inicio':
        $id = $_REQUEST["idsoli"];
        $sql = "SELECT * FROM cmx_estudio_vehiculo WHERE id_solicitud=" . $id . " ";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    //INFORME PRODUCTVIDAD
    case 'informe_productivo':
        $fi = $_REQUEST["finicia"];
        $ff = $_REQUEST["ffinal"];
        $sql = "
			SELECT  COUNT(ec.estado)as 'cestado',  ec.*, clog.id_usuario
			FROM cmx_estudiov_completo AS ec
			LEFT JOIN cmx_logestudio_com AS clog
			ON ec.id_estudio=clog.id_estudio
			WHERE fecha BETWEEN '" . $fi . "' AND '" . $ff . "'
			GROUP BY ec.estado
		";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;
    //HISTORIAL DE ESTUDIOS
    case 'ver_estudio_historial':
        $a = $_REQUEST["id_estudio"];
        $sql = " SELECT a.estudio, a.estado, a.observacion, a.usuario, a.fecha, a.hora, c.estado AS 'esta_total'
			 FROM cmx_aprobacion_estudio a
			INNER JOIN cmx_estudiov_completo c
			ON a.id_estudio=c.id_estudio
			WHERE a.id_estudio=" . $a . "
			GROUP BY a.estudio
 ";
        // echo $sql;
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    //
    case 'historico_estudio':
        $fi = $_REQUEST["finicia"];
        $ff = $_REQUEST["ffinal"];
        $op = $_REQUEST["option"];
        if ($op == 't') {
            $opt = '("Aprobado" , "Rechazado" , "Pendiente")';
        }

        if ($op == 'Aprobado') {
            $opt = '("Aprobado")';
        }

        if ($op == 'Pendiente') {
            $opt = '("Pendiente")';
        }

        if ($op == 'Rechazado') {
            $opt = '("Rechazado")';
        }

        $sql = "
			SELECT a.id_estudio AS 'id_preliminar', a.estado AS 'estadoes', a.*,b.* , v.placa
			FROM cmx_estudiov_completo a
			INNER JOIN cmx_logestudio_com b
			INNER JOIN cmx_vehiculos v
			ON a.id_vehiculo=v.id
			WHERE b.fecha BETWEEN '" . $fi . "' AND '" . $ff . "'
			AND a.estado IN " . $opt . "
			GROUP BY a.id_estudio;
		";
        // echo $sql;
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'verVehiculo':

        $id_vehiculo = $_REQUEST["id_vehiculo"];
        $sql = "SELECT v.*,
				TE.nombre AS nom_te, TE.numero_documento AS docu_te,
				TE.celular AS celular_tenedor,
				PRO.nombre AS nom_pro, PRO.numero_documento AS docu_pro, PRO.celular AS celular_propietario,
				d.tecnomecanica, d.tecno_fecha_vigencia,
				mac.marca,line.descripcion AS linea,vv.anio_fabricacion,col.color,vv.peso,
				kr.descripcion AS cod_rndc_carroceria,vv.num_chasis, vv.cod_tipo_combustible,
				vv.num_soat, vv.vence_soat,
				ase.nombre AS aseguradora,vv.num_motor, vv.poliza_responsabilidad,
				vv.vence_poliza, vv.repotenciado, vv.tipo_vinculacion,
				vv.fecha_mant_gps, vv.capacidad_tn,vv.pesobruto_kg,
				CONCAT(c.nombre,'-',c.descripcion) AS configure, c.descripcion,
				d.foto_vehiculo, d.name_frontal, d.foto_derecha,
				d.name_derecha, d.foto_izquierda, d.name_izquierda,
				d.foto_atras, d.name_atras,
				cl.clase, d.licencia_transito,
				TE.apellido1 AS teape1, TE.apellido2 teape2,
				PRO.apellido1 AS proape1, PRO.apellido2	proape2
				FROM cmx_vehiculos v
				INNER JOIN cmx_proveedores TE ON v.id_tenedor=TE.id
				INNER JOIN cmx_proveedores PRO ON v.id_propietario=PRO.id
				INNER JOIN cmx_detalle_vehiculo d	ON v.id=d.id_vehiculo
				INNER JOIN cmx_vehiculo2 vv ON v.id=vv.id_vehiculo
				INNER JOIN cmx_rndc_vehiculos_configuracion c ON vv.configuracion=c.id
				LEFT JOIN cmx_rndc_clase_vehiculo cl	ON vv.clase_vehiculo=cl.id
				LEFT JOIN cmx_rndc_vehiculos_marcas mac ON vv.marca=mac.id
				LEFT JOIN cmx_rndc_vehiculos_linea line	ON mac.rndc_id=line.id_marca AND vv.linea=line.id
				LEFT JOIN cmx_rndc_vehiculos_color col	ON vv.color=col.id
				LEFT JOIN cmx_rndc_vehiculos_carroceria kr ON v.tipo_carroceria=kr.id
				LEFT JOIN cmx_rndc_aseguradoras ase ON vv.aseguradora=ase.id
				WHERE 	v.id=" . $id_vehiculo . "";
        $result = $Data->getConsulta($sql);
        if ($result) {
            //traer trailer
            $sql2 = "SELECT t.*,tt.tramite AS tramitee,	k.descripcion AS ceria,	ma.marca AS mark,
				CONCAT(co.nombre,'-',co.tipo)AS confi, ase.nombre AS aseguradora
				FROM cmx_trailer_vehiculo a
				INNER JOIN cmx_trailer t ON a.id_trailer=t.id
				INNER JOIN cmx_rndc_trailertramites tt ON t.tipo_tramite=tt.id
				INNER JOIN cmx_rndc_vehiculos_carroceria k ON t.carroceria=k.id
				INNER JOIN cmx_rndc_trailermarcas ma ON t.marca=ma.id
				INNER JOIN cmx_rndc_vehiculos_configuracion co ON t.configuracion=co.id
				LEFT JOIN  cmx_rndc_aseguradoras ase ON t.aseguradora=ase.id
				WHERE a.id_vehiculo=" . $id_vehiculo . " AND a.estado=1";
            $result2 = $Data->getConsulta($sql2);
            $return["result2"] = $result2["rowsData"];
        }
        $return["result"] = $result["rowsData"];
        break;

    case 'verconductor':
        $id_conductor = $_REQUEST["id_conductor"];
        // echo 'entro a la consultita';
        /*$sql="
        SELECT * FROM cmx_proveedores p
        LEFT JOIN cmx_detalle_conductor d
        ON p.id=d.id_proveedor
        WHERE p.id=".$id_conductor."
        ";*/

        $sql = "SELECT p.*,
			CONCAT(mu.municipio,'-',mu.depto) AS cipio,
			d.*
			FROM cmx_proveedores p
			INNER JOIN cmx_municipios mu
			ON p.id_municipio=mu.id
			LEFT JOIN cmx_detalle_conductor d
			ON p.id=d.id_proveedor
			WHERE p.id=" . $id_conductor . " ";
        $result = $Data->getConsulta($sql);

        if ($result) {
            //referencias laborales y personales
            $sql2 = "SELECT * FROM cmx_referencias_preestudio
					WHERE id_conductor=" . $id_conductor . "  ";
            $result2 = $Data->getConsulta($sql2);
            $return["result2"] = $result2["rowsData"];

            $sql3 = "SELECT * FROM cmx_referencias_personales
					WHERE id_conductor=" . $id_conductor . "  ";
            $result3 = $Data->getConsulta($sql3);
            $return["result3"] = $result3["rowsData"];
        }
        $return["result"] = $result["rowsData"];
        break;
    //LISTA DE COMPROBACION
    case 'verlista':
        $id_vehiculo = $_REQUEST["id_v"];
        $id_conductor = $_REQUEST["id_c"];
        $idsoli = $_REQUEST["id_soli"];
        $sql = "
			SELECT a.estudio, a. estado, a.id_estudio, b.id_solicitud
			 FROM cmx_aprobacion_estudio a
			INNER JOIN cmx_estudio_vehiculo b
			ON a.id_estudio=b.id
			WHERE	a.id_vehiculo=" . $id_vehiculo . "
			AND a.id_conductor=" . $id_conductor . "
			AND b.id_solicitud=" . $idsoli . "
		";
        // echo $sql;
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;
    //CONSULTA LA LISTA DE APROBACION
    case 'verestudio':
        $idv = $_REQUEST["idv"];
        $idc = $_REQUEST["idc"];
        $idsoli = $_REQUEST["idsoli"];

        $sql2 = "SELECT  a.*,
		CASE WHEN ec.estado IS NULL THEN 'gray' ELSE ec.estado  END AS 'estadototal'
		FROM cmx_aprobacion_estudio a
		INNER JOIN 	cmx_estudio_vehiculo e 	ON a.id_estudio=e.id AND a.activo=1
		LEFT JOIN cmx_estudiov_completo ec ON e.id=ec.id_estudio AND estado_actu=1
		WHERE a.id_vehiculo=" . $idv . " AND a.id_conductor=" . $idc . " AND e.id_solicitud=" . $idsoli . "";

        $result = $Data->getConsulta($sql2);
        $return["result"] = $result["rowsData"];
        break;
    //consulta de campos requeridos sean aprobados para aprobar estudio completo

    case 'tipos_estudio':
        $idestudio = $_POST["idestudio"];
        $sql = "SELECT  a.id_tipo, a.estudio, a.estado, t.requerido,t.id, t.nombre
				FROM  cmx_tipo_estudio t
				LEFT JOIN cmx_aprobacion_estudio a ON a.id_tipo=t.id AND a.activo=1 AND a.id_estudio=" . $idestudio . " ";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'tipo_estudy':
        $idtipos = $_REQUEST["idtipos"];
        //$respu=$_REQUEST["respu"];
        $sql2 = "SELECT *
			FROM cmx_tipo_estudio
			WHERE id=" . $idtipos . "
			and requerido=1   ";
        $result = $Data->getConsulta($sql2);
        $return["result"] = $result["rowsData"];
        break;

    case 'verinciados':
        $idsoli = $_POST["idsoli"];
        //sacar el id del estudio
        $sql = "
			SELECT id AS elid
			FROM cmx_estudio_vehiculo
			WHERE id_solicitud=" . $idsoli . "
		";
        $result = $Data->getConsulta($sql);
        $id = $result["rowsData"][0]["elid"];

        $sql2 = "
			SELECT a.estudio, a.estado, a.id_estudio FROM cmx_aprobacion_estudio a
			LEFT JOIN cmx_tipo_estudio t
			ON a.estudio=t.nombre
			WHERE a.id_estudio=" . $id . "
		";
        $result2 = $Data->getConsulta($sql2);
        $return["result2"] = $result2["rowsData"];
        break;

    case 'validar_estudio':
        $idv = $_REQUEST["id_vehiculo"];
        $idc = $_REQUEST["idconductor"];
        $idestu = $_REQUEST["idestudio"];
        $sql = "
		SELECT * FROM cmx_aprobacion_estudio
		 WHERE id_vehiculo=" . $idv . "  AND
		 id_conductor=" . $idc . " AND id_estudio=" . $idestu . "
	";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'status_security':
        $solicitud = $_POST["idsoli"];
        $vehiculo = $_POST["idc"];
        $conductor = $_POST["idv"];
        $sql = "

			SELECT b.user_log, b.observacion, b.fecha_asignacion, b.hora_asignacion, b.id_solictud
			FROM cmx_solicitud_vehiculo2  a
			INNER JOIN cmx_log_solicitudvehiculo b
			ON a.id=b.id_solictud
			WHERE b.id_solictud=" . $solicitud . "
		";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;
    //validaciones para evitar duplicado de informacion y respuesta a los aestudios de segridad
    case 'valida_vehiculoa':

        $sql2 = "SELECT max(id) as id FROM cmx_estudio_vehiculo";
        $result2 = $Data->getConsulta($sql2);
        $id = $result2["rowsData"][0]["id"];
        if ($result2) {
            $vehiculo = $_REQUEST["vehiculo"];
            $conductor = $_REQUEST["conductor"];
            $plataforma = $_REQUEST["plataforma"];
            $sql = "
				SELECT * FROM cmx_aprobacion_estudio
				WHERE estudio='" . $plataforma . "'
				AND id_vehiculo=" . $vehiculo . "
				 AND id_conductor=" . $conductor . "
				 AND id_estudio=" . $id . "
			";

            $result = $Data->getConsulta($sql);
            $return["result"] = $result["rowsData"];
        }
        break;

    case 'valida_conductor':
        $sql2 = "SELECT max(id) as id FROM cmx_estudio_vehiculo";
        $result2 = $Data->getConsulta($sql2);
        $id = $result2["rowsData"][0]["id"];
        if ($result2) {
            $vehiculo = $_REQUEST["vehiculo"];
            $conductor = $_REQUEST["conductor"];
            $plataforma = $_REQUEST["plataforma"];
            $sql = "SELECT * FROM cmx_aprobacion_estudio
				WHERE estudio='" . $plataforma . "'
				AND id_vehiculo=" . $vehiculo . "
				 AND id_conductor=" . $conductor . "
				 AND id_estudio=" . $id . "";
            $result = $Data->getConsulta($sql);
            $return["result"] = $result["rowsData"];
        }
        break;

    case 'valida_otros':
        $sql2 = "SELECT max(id) as id FROM cmx_estudio_vehiculo";
        $result2 = $Data->getConsulta($sql2);
        if ($result2) {
            $id = $result2["rowsData"][0]["id"];
            $vehiculo = $_REQUEST["vehiculo"];
            $conductor = $_REQUEST["conductor"];
            $plataforma = $_REQUEST["plataforma"];
            $sql = "SELECT * FROM cmx_aprobacion_estudio
				WHERE estudio='" . $plataforma . "' AND
				id_vehiculo=" . $vehiculo . "  AND id_conductor=" . $conductor . "  AND id_estudio=" . $id . "";

            $result = $Data->getConsulta($sql);
            $return["result"] = $result["rowsData"];
        }

        break;

    default:
        break;
}
$return["result"] = $result["rowsData"];
echo json_encode($return);
