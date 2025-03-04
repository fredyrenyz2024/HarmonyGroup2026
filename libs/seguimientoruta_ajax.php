<?php
include "../application/Config.php";
include '../application/Conexion.php';
include '../application/Model.php';
session_start();
$Data = new Consultas;

switch ($_REQUEST['action']) {

	case 'consultar_inicioruta':
		$num_manifiesto = $_POST["manifiesto"];
		$sql = "SELECT i.*, p.nombre, p.apellido1, p.apellido2, est.id AS med,
					e.estado, CONCAT(mn1.municipio,'-', mn1.depto) AS 'origin',
					CONCAT(mn2.municipio,'-', mn2.depto) AS 'destini', est.fecha AS 'ufecha',est.hora AS 'uhora'
					FROM  cmx_inicio_ruta i -- PLAN DE RUTA
					INNER JOIN cmx_inici_manifiesto_estado est ON i.cod_inicio=est.cod_ini_ruta  AND est.ultimo_estado=1
					INNER JOIN cmx_proveedores p ON i.cond_cedula=p.numero_documento
					INNER JOIN cmx_estado_segui e ON est.estado=e.id
					INNER JOIN cmx_plan_ruta pl ON i.cod_plan=pl.cod_plan
					INNER JOIN cmx_rutas ru ON pl.cod_ruta=ru.id
					INNER JOIN cmx_municipios mn1 ON ru.cod_ciudad_origen=mn1.id
					INNER JOIN cmx_municipios mn2 ON ru.cod_ciudad_destino=mn2.id
					LEFT JOIN cmx_inicio_ruta inr ON i.num_manifiesto=inr.num_manifiesto
					WHERE i.num_manifiesto=" . $num_manifiesto;
		$result = $Data->getConsulta($sql);
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}
		break;

	case 'seguimiento_ruta':
		$num_manifiesto = $_POST["manifiesto"];
		// $sql = "CALL SEGUIMIENTO_RUTA($num_manifiesto)";
		$sql = "SELECT i.cod_inicio,i.num_manifiesto,i.cond_cedula,i.placa,i.fechasalida,i.horasalida,i.usuario,i.cod_plan,p.nombre, p.apellido1, p.apellido2,p.celular, est.id AS med,
		e.estado, CONCAT(mn1.municipio,'-', mn1.depto) AS 'origin', CONCAT(mn2.municipio,'-', mn2.depto) AS 'destini', est.fecha AS 'ufecha',est.hora AS 'uhora',
		pl.nombre_plan,vm.marca,vl.descripcion,vc.color,vcr.descripcion AS 'carrocerias',vcf.descripcion AS 'configuracion',eg.operador_gps,
		eg.id,eg.url,vh.usuario_satelital,vh.clave_satelital,v2.anio_fabricacion,tr.serie_chasis,tdes.fecha_descargue,tdes.hora_descargue,mn.Lugar
		FROM cmx_inicio_ruta i -- PLAN DE RUTA
		INNER JOIN cmx_inici_manifiesto_estado est ON i.cod_inicio=est.cod_ini_ruta AND est.ultimo_estado=1
		INNER JOIN cmx_proveedores p ON i.cond_cedula=p.numero_documento
		INNER JOIN cmx_estado_segui e ON est.estado=e.id
		INNER JOIN cmx_plan_ruta pl ON i.cod_plan=pl.cod_plan
		INNER JOIN cmx_rutas ru ON pl.cod_ruta=ru.id
		INNER JOIN cmx_municipios mn1 ON ru.cod_ciudad_origen=mn1.id
		INNER JOIN cmx_municipios mn2 ON ru.cod_ciudad_destino=mn2.id
		INNER JOIN cmx_vehiculos vh ON vh.placa=i.placa
		INNER JOIN cmx_vehiculo2 v2 ON v2.id_vehiculo=vh.id
		INNER JOIN cmx_rndc_vehiculos_marcas vm ON vm.id=v2.marca
		INNER JOIN cmx_rndc_vehiculos_linea vl ON v2.linea=vl.id
		INNER JOIN cmx_rndc_vehiculos_color vc ON v2.color=vc.id
		INNER JOIN cmx_rndc_vehiculos_carroceria vcr ON vh.tipo_carroceria=vcr.id
		INNER JOIN cmx_rndc_vehiculos_configuracion vcf ON v2.configuracion=vcf.id
		INNER JOIN cmx_rndc_empresa_gps eg ON eg.id=vh.empresa_gps
		LEFT JOIN cmx_trailer_vehiculo trv ON vh.id=trv.id_vehiculo
		LEFT JOIN cmx_trailer tr ON trv.id_trailer=tr.id
		LEFT JOIN cmx_manifiesto mn ON i.num_manifiesto=mn.id
		LEFT JOIN cmx_tiempo_descargue des ON des.num_manifiesto=i.num_manifiesto
		LEFT JOIN cmx_tiempo_descargue_rem tdes ON tdes.id_descargue=des.id
		AND tdes.tipo_fecha='fec_llegada' WHERE i.num_manifiesto=" . $num_manifiesto;
		$result = $Data->getConsulta($sql);
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}

		break;

	case 'consultar_clientes':
		$id_planilla = $_POST["id_planilla"];

		$sql = "SELECT cl.*, bb.remesa, bb.fecha_remesa
			FROM cmx_planilla p
			INNER JOIN cmx_planilla_detalle1 bb ON p.id=bb.id_planilla
			LEFT JOIN cmx_estudio_vehiculo e ON p.id_estudio=e.id
			INNER JOIN cmx_log_solicitudvehiculo2 se ON e.id_solicitud=se.id
			INNER JOIN  cmx_preestudio_solicitudes_servicio sp ON se.id_solictud=sp.id_solicitudpreestudio
			INNER JOIN cmx_ruta_puntosentrega pe ON sp.id_servicio_cliente=pe.cod_ini_ruta
			INNER JOIN cmx_clientes cl ON pe.cliente=cl.id
			WHERE p.id=" . $id_planilla . " GROUP BY cl.id";

		$result = $Data->getConsulta($sql);
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}

		break;

	case 'consultar_pentrega':
		$manifiesto = $_POST["manifiesto"];
		$sql = "SELECT
			a.nombre AS nameremi, remi.direccion_entrega, remi.fecha_estimada_entrega,
			remi.hora_estimada, remi.tipo,
			b.nombre AS namedest, dest.direccion_entrega AS diredest,
			dest.fecha_estimada_entrega AS fechadest,
			dest.hora_estimada AS horadest, dest.tipo AS tipodest,
			cli.nombre AS cliente
			FROM cmx_manifiesto ma
			INNER JOIN cmx_manifiesto_remesa rema ON ma.id=rema.id_manifiesto AND rema.estado=1
			INNER JOIN cmx_remesa_ordencargue roc ON rema.id_remesa=roc.id_remesa AND roc.estado=1
			INNER JOIN cmx_orden_cargue oc ON roc.id_orden_cargue=oc.id AND oc.estado=1
			INNER JOIN cmx_remesa re ON roc.id_remesa=re.id
			INNER JOIN cmx_ruta_puntosentrega remi ON oc.id_remitente=remi.id
			INNER JOIN cmx_remitente_destinatario a ON remi.cliente=a.id
			INNER JOIN cmx_destinatarios_ss dest ON re.id_destinatario=dest.id
			INNER JOIN cmx_remitente_destinatario b ON dest.cliente=b.id
			INNER JOIN cmx_clientes cli ON oc.cli_id=cli.id
			WHERE ma.id=" . $manifiesto;
		$result = $Data->getConsulta($sql);
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}

		break;

	case 'consultar_pcontrol':
		$id_plan = $_POST["id_plan"];
		$sql = "SELECT d.cod_plan, d.id, d.nombre_punto,
			d.descripcion_punto, d.tiempo_estimacion,
			d.tipo_punto, d.km_estimacion,
			d.latitud, d.longitud, m.municipio,
			m.depto
			FROM cmx_plan_ruta p
			INNER JOIN cmx_rutas ru ON p.cod_ruta=ru.id
			INNER JOIN cmx_planruta_detalle d ON p.cod_plan=d.cod_plan
			INNER JOIN cmx_municipios m ON d.cod_ciudad=m.id
			WHERE p.cod_plan=" . $id_plan . " ORDER BY d.km_estimacion ASC";
		$result = $Data->getConsulta($sql);
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}

		break;

	case 'consultar_pgeografico':
		$id_plan = $_POST["id_plan"];
		$sql = "SELECT * FROM cmx_plan_ruta p
			INNER JOIN cmx_rutas ru ON p.cod_ruta=ru.id
			INNER JOIN cmx_planruta_detalle d ON p.cod_plan=d.cod_plan
			INNER JOIN cmx_municipios m ON d.cod_ciudad=m.id
			WHERE p.cod_plan=" . $id_plan . " AND d.tipo_punto='punto geografico'";
		$result = $Data->getConsulta($sql);
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}

		break;

	case 'estado_max':
		$id = $_REQUEST["id"];
		$sql = "SELECT e.estado, s.estado as letra
				FROM cmx_inici_manifiesto_estado e
				INNER JOIN  cmx_estado_segui s ON e.estado=s.id
				WHERE e.cod_ini_ruta=" . $id . " AND e.ultimo_estado=1
		";
		$result = $Data->getConsulta($sql);
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}

		break;

	case 'estado_select':
		$actual = $_REQUEST["actual"];
		$sql = "SELECT id,estado FROM cmx_estado_segui WHERE estado_m=1";
		$result = $Data->getConsulta($sql);
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}

		break;

		//GESTION
	case 'puntos_controls':
		$idplan = $_REQUEST["idplan"];
		$sql = "SELECT r.*, mun.id AS 'idmunicipio' ,mun.municipio, mun.depto,
			pr.nombre_plan, CONCAT(CI.municipio,'-',CI.depto) AS origen,
			CONCAT(C2.municipio,'-',C2.depto) AS destino
			FROM cmx_planruta_detalle r
			INNER JOIN cmx_municipios mun
			ON r.cod_ciudad=mun.id
			INNER JOIN cmx_plan_ruta pr
			ON r.cod_plan=pr.cod_plan
			INNER JOIN cmx_rutas ru
			ON pr.cod_ruta=ru.id
			INNER JOIN cmx_municipios CI
			ON ru.cod_ciudad_origen=CI.id
			INNER JOIN cmx_municipios C2
			ON ru.cod_ciudad_destino=C2.id
			WHERE pr.cod_plan=" . $idplan . "
			AND r.tipo_punto='punto control'
		";
		// echo $sql;
		$result = $Data->getConsulta($sql);
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}

		break;

	case 'puntos_geografia':
		$idplan = $_POST["idplan"];
		$codini = $_POST["codini"];
		$sql = "SELECT p.*,
		mn.id AS 'idmunicipio',
		mn.depto,
		mn.municipio
		FROM cmx_planruta_detalle p
		LEFT JOIN cmx_inicio_seguimiento se
		ON p.cod_ciudad<>se.detalle_tipo
		AND se.cod_ini_ruta=" . $codini . "
		INNER JOIN cmx_municipios mn
		ON p.cod_ciudad=mn.id
		WHERE
		 p.cod_plan=" . $idplan . "
		GROUP BY p.cod_ciudad
		ORDER BY p.id";
		// echo $sql;
		$result = $Data->getConsulta($sql);
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}

		break;

	case 'punto_entrega':
		$manifi = $_POST["planilla"];
		$sql = "SELECT
			b.nombre, dest.direccion_entrega,
			dest.fecha_estimada_entrega AS fechadest,
			dest.hora_estimada AS horadest, dest.tipo,
			cli.nombre AS cliente,
			mn1.municipio, mn1.depto, mn1.id AS idmunicipio
			FROM cmx_manifiesto ma
			INNER JOIN cmx_manifiesto_remesa rema
			ON ma.id=rema.id_manifiesto AND rema.estado=1
			INNER JOIN cmx_remesa_ordencargue roc
			ON rema.id_remesa=roc.id_remesa AND roc.estado=1
			INNER JOIN cmx_orden_cargue oc
			ON roc.id_orden_cargue=oc.id AND oc.estado=1
			INNER JOIN cmx_remesa re
			ON roc.id_remesa=re.id
			INNER JOIN cmx_ruta_puntosentrega remi
			ON oc.id_remitente=remi.id
			INNER JOIN cmx_remitente_destinatario a
			ON remi.cliente=a.id
			INNER JOIN cmx_destinatarios_ss dest
			ON re.id_destinatario=dest.id
			INNER JOIN cmx_remitente_destinatario b
			ON dest.cliente=b.id
			INNER JOIN cmx_clientes cli
			ON oc.cli_id=cli.id
			INNER JOIN cmx_municipios mn1
			ON b.id_ciudad=mn1.id
			LEFT JOIN cmx_inicio_seguimiento se
			ON b.id_ciudad<>se.detalle_tipo
			WHERE ma.id=" . $manifi . "
			GROUP BY b.id_ciudad";
		$result = $Data->getConsulta($sql);
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}

		break;

	case 'traer_ciudad':
		$sql = "
		SELECT * FROM cmx_municipios
		WHERE pais='COLOMBIA'   ";
		$result = $Data->getConsulta($sql);
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}

		break;

	case 'consultar_conteos':
		$mnf = $_POST["mani"];
		$codigo_plan = $_POST["codigo_plan"];
		$id_planilla = 1;
		$sql = "SELECT COUNT(dest.id) AS amountpe
			FROM cmx_manifiesto ma
			INNER JOIN cmx_manifiesto_remesa rema
			ON ma.id=rema.id_manifiesto AND rema.estado=1
			INNER JOIN cmx_remesa_ordencargue roc
			ON rema.id_remesa=roc.id_remesa AND roc.estado=1
			INNER JOIN cmx_orden_cargue oc
			ON roc.id_orden_cargue=oc.id AND oc.estado=1
			INNER JOIN cmx_remesa re
			ON roc.id_remesa=re.id
			INNER JOIN cmx_ruta_puntosentrega remi
			ON oc.id_remitente=remi.id
			INNER JOIN cmx_remitente_destinatario a
			ON remi.cliente=a.id
			INNER JOIN cmx_destinatarios_ss dest
			ON re.id_destinatario=dest.id
			INNER JOIN cmx_remitente_destinatario b
			ON dest.cliente=b.id
			WHERE ma.id=" . $mnf;
		$result = $Data->getConsulta($sql);
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}


		$sql2 = "SELECT COUNT(d.id)AS amountpc
			FROM cmx_plan_ruta p
			INNER JOIN cmx_planruta_detalle d
			ON p.cod_plan=d.cod_plan
			INNER JOIN cmx_municipios m
			ON d.cod_ciudad=m.id
			WHERE p.cod_plan=" . $codigo_plan . "";
		$result2 = $Data->getConsulta($sql2);
		$return["result2"] = $result2["rowsData"];

		$sql3 = "SELECT
		COUNT( DISTINCT cl.id) AS amountcl
		FROM
		cmx_planilla p
		INNER JOIN cmx_planilla_detalle1 d
		ON p.id=d.id_planilla
		INNER JOIN cmx_ruta_puntosentrega pe
		ON d.id_servicio=pe.cod_ini_ruta
		INNER JOIN cmx_clientes cl
		ON pe.cliente=cl.id
		WHERE p.id=" . $id_planilla . "
		GROUP BY d.id_planilla";
		$result3 = $Data->getConsulta($sql3);
		$return["result3"] = $result3["rowsData"];

		$sql4 = "SELECT COUNT(d.id)AS amountpg
			FROM cmx_plan_ruta p
			INNER JOIN cmx_planruta_detalle d
			ON p.cod_plan=d.cod_plan
			INNER JOIN cmx_municipios m
			ON d.cod_ciudad=m.id
			WHERE p.cod_plan=" . $codigo_plan . "
			AND d.tipo_punto='punto geografico'";
		$result4 = $Data->getConsulta($sql4);
		$return["result4"] = $result4["rowsData"];

		break;

	case 'linea_puntoentrega':
		$id_planilla = $_POST["idplanilla"];
		$idinicio = $_POST["idinicio"];

		$sql = "
			SELECT
			pe.*, mun.municipio,mun.depto,cl.nombre AS nom,
			cl.nombre AS nomcliente, seg.tipo_proceso
			FROM cmx_planilla p
			INNER JOIN cmx_estudio_vehiculo e
			ON p.id_estudio=e.id
			INNER JOIN cmx_log_solicitudvehiculo2 se
			ON e.id_solicitud=se.id
			INNER JOIN  cmx_preestudio_solicitudes_servicio sp
			ON se.id_solictud=sp.id_solicitudpreestudio
			INNER JOIN cmx_ruta_puntosentrega pe
			ON sp.id_servicio_cliente=pe.cod_ini_ruta
			INNER JOIN cmx_municipios mun
			ON pe.municipio_entrega=mun.id
			INNER JOIN cmx_clientes cl
			ON pe.cliente=cl.id
			LEFT JOIN cmx_inicio_seguimiento seg
			ON pe.municipio_entrega=seg.detalle_tipo
			AND seg.tipo_proceso='seguimiento'
			AND seg.cod_ini_ruta=" . $idinicio . "
			WHERE p.id=" . $id_planilla . "
			ORDER BY pe.cod_ini_ruta,  pe.id";

		$result = $Data->getConsulta($sql);
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}

		break;

	case 'valida_puntoe':
		$identrega = $_REQUEST["identrega"];
		$sql = "SELECT COUNT(detalle_tipo) AS numero
			FROM cmx_inicio_seguimiento
			WHERE 	tipo_seguimiento='punto entrega'
			AND detalle_tipo=" . $identrega . " ";
		// echo $sql;
		$result = $Data->getConsulta($sql);
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}

		break;

	case 'pintar_pc':
		$idplan = $_REQUEST["id_plan"];
		$idinicio = $_REQUEST["idinicio"];

		$sql = "
			SELECT d.*, CONCAT(m.municipio,'-',m.depto) AS city, se.tipo_proceso, se.cod_ini_ruta FROM
		cmx_plan_ruta p INNER JOIN cmx_planruta_detalle d ON p.cod_plan=d.cod_plan
		INNER JOIN cmx_municipios m
		ON d.cod_ciudad=m.id
		LEFT JOIN cmx_inicio_seguimiento se
		ON d.cod_ciudad=se.detalle_tipo
		AND se.tipo_proceso='seguimiento'
		AND cod_ini_ruta=" . $idinicio . "
		WHERE p.cod_plan=" . $idplan . "
		AND d.tipo_punto='punto control'
		ORDER BY d.id";

		$result = $Data->getConsulta($sql);
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}

		break;

	case 'valida_puntoc':
		$punto = $_REQUEST["punto"];
		$sql = "
			SELECT COUNT(detalle_tipo) AS numero
			FROM cmx_inicio_seguimiento
			WHERE 	tipo_seguimiento='punto control'
			AND detalle_tipo=" . $punto . "
		";
		$result = $Data->getConsulta($sql);
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}

		break;

	case 'traer_municipio':
		$idplan = $_POST["idplan"];
		$codini = $_POST["codini"];

		$sql = "SELECT * FROM cmx_municipios WHERE pais='COLOMBIA'";
		$result = $Data->getConsulta($sql);
		$sql2 = "SELECT p.*,
		mn.id AS 'idmunicipio',
		mn.depto,
		mn.municipio
		FROM cmx_planruta_detalle p
		LEFT JOIN cmx_inicio_seguimiento se
		ON p.cod_ciudad<>se.detalle_tipo
		INNER JOIN cmx_municipios mn
		ON p.cod_ciudad=mn.id
		WHERE se.cod_ini_ruta=" . $codini . "
		AND p.cod_plan=" . $idplan . "
		GROUP BY p.cod_ciudad";
		$result2 = $Data->getConsulta($sql2);
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}

		$return["result2"] = $result2["rowsData"];
		break;

	case 'consultar_novedades':
		//estados
		$codigo_inicio = $_POST["codigo_inicio"];
		$mani = $_POST["mani"];
		$sql = "SELECT * FROM cmx_inici_manifiesto_estado
		WHERE cod_ini_ruta=" . $codigo_inicio . "
		ORDER BY id";
		$result = $Data->getConsulta($sql);
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}

		//seguimientos
		$sql2 = "	SELECT a.*, b.id_servicio
			FROM cmx_inicio_seguimiento a
			INNER JOIN cmx_seguimiento_servicio b
			ON a.id=b.id_seguimiento
			WHERE a.cod_ini_ruta=" . $codigo_inicio;
		$result2 = $Data->getConsulta($sql2);
		$return["result2"] = $result2["rowsData"];

		//fechas de cargue
		$sql3 = "SELECT too.id_orden_cargue, too.fecha_cargue,
		too.hora_cargue, too.obs_cargue, too.tipo_fecha
		FROM
		cmx_manifiesto ma
		INNER JOIN cmx_tiempo_cargue b
		ON ma.id=b.num_manifiesto
		INNER JOIN cmx_tiempo_cargue_ordenes too
		ON b.id=too.id_cargue
		WHERE ma.id=" . $mani . "
		ORDER BY too.id_orden_cargue";

		$result3 = $Data->getConsulta($sql3);
		$return["result3"] = $result3["rowsData"];
		//fechas de descargue
		$sql4 = "SELECT tee.id_remesa, tee.fecha_descargue, tee.hora_descargue,
		tee.obs_descargue, tee.tipo_fecha
		FROM cmx_manifiesto ma
		INNER JOIN cmx_tiempo_descargue td
		ON ma.id=td.num_manifiesto
		INNER JOIN cmx_tiempo_descargue_rem tee
		ON td.id=tee.id_descargue
		WHERE ma.id=" . $mani . "
		ORDER BY tee.id_remesa";

		$result4 = $Data->getConsulta($sql4);
		$return["result4"] = $result4["rowsData"];
		break;

	case 'consulta_seguimiento':
		$codigo_inicio = $_POST["codini"];
		$sql2 = "SELECT m.municipio,nov.novedad,a.tipo_seguimiento,a.fecha, a.hora,a.observacion,a.usuario,pc.punto_controlador FROM cmx_inicio_seguimiento a
			INNER JOIN cmx_seguimiento_servicio b ON a.id=b.id_seguimiento
			LEFT JOIN cmx_municipios m ON a.detalle_tipo=m.id
			LEFT JOIN cmx_para_novedades_seguimiento nov ON  a.novedad=nov.id
			LEFT JOIN cmx_puntos_controlador pc ON pc.seguimiento_id=a.id
			WHERE a.cod_ini_ruta=" . $codigo_inicio . " GROUP BY a.id ORDER BY a.id DESC";
		$result = $Data->getConsulta($sql2);
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}

		break;

	case 'consultar_seguimiento_punto':
		$idpunto = $_POST["idpunto"];
		$idplan = $_POST["idplan"];
		$codini = $_POST["codini"];

		$sql = "SELECT a.*,b.tipo_punto AS 'clasepunto'
		FROM cmx_inicio_seguimiento a
		INNER JOIN cmx_planruta_detalle b
		ON a.detalle_tipo=b.cod_ciudad
		WHERE a.detalle_tipo=" . $idpunto . "
		AND b.cod_plan=" . $idplan . "
		AND a.cod_ini_ruta=" . $codini;

		$result = $Data->getConsulta($sql);
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}

		break;

	case 'consultar_seguimiento_puntoe':
		$idpentrega = $_POST["idpentrega"];
		$id_planilla = $_POST["id_planilla"];
		$idruta = $_POST["idruta"];
		$idservicio = $_POST["idservicio"];
		$sql = "SELECT a.*, b.tipo
			FROM cmx_inicio_seguimiento a
			INNER JOIN cmx_inicio_ruta u
			ON a.cod_ini_ruta=u.cod_inicio
			LEFT JOIN cmx_ruta_puntosentrega b
			ON a.detalle_tipo=b.municipio_entrega
			WHERE a.detalle_tipo=" . $idpentrega . "
			AND a.cod_ini_ruta=" . $idruta . "
			AND u.id_estudio_seguridad=" . $id_planilla . "
			AND b.cod_ini_ruta IN (" . $idservicio . ")";

		$result = $Data->getConsulta($sql);
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}

		break;

	case 'novedad_general':
		$sql = "SELECT * FROM cmx_para_novedades_seguimiento ORDER BY novedad ASC";
		$result = $Data->getConsulta($sql);
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}

		break;

	case 'validar_tipoproceso':
		$cod_iniruta = $_POST["cod_iniruta"];
		// $estado = $_POST["estado"];
		$segui = $_POST["segui"];
		$detalle = $_POST["detalle"];
		$proce = $_POST["proce"];
		$sql = "SELECT i.* FROM cmx_inicio_seguimiento i
				INNER JOIN cmx_inici_manifiesto_estado e ON i.cod_man_estado=e.id
				WHERE i.cod_ini_ruta=" . $cod_iniruta . "
				AND i.tipo_seguimiento='" . $segui . "'
				AND i.detalle_tipo=" . $detalle . "
				AND i.tipo_proceso='completado'";
		// AND e.estado=" . $estado . "";
		$result = $Data->getConsulta($sql);
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}

		break;

	case 'consulta_puntocontrol':
		$codini = $_POST["codinin"];
		//MANUAL
		$sql = "SELECT ru.latitud_origen,ru.latitud_destino,
		ru.longitud_origen,ru.longitud_destino,
		a.latitud,a.longitud
		FROM cmx_iniruta_ubicacion a
		INNER JOIN cmx_inicio_ruta b ON a.cod_ini_ruta=b.cod_inicio
		INNER JOIN cmx_plan_ruta pl ON pl.id= b.cod_plan
		INNER JOIN cmx_rutas ru ON pl.cod_ruta=ru.id
		WHERE b.cod_inicio=" . $codini . " AND a.id IN(SELECT MAX(id) FROM cmx_iniruta_ubicacion WHERE cod_ini_ruta=" . $codini . ")";
		$result = $Data->getConsulta($sql);
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}

		break;

	case 'consulta_semaforo':
		$codini = $_POST["codini"];
		$sql = "SELECT s.fecha, s.hora, 1
			FROM cmx_inicio_seguimiento s
			WHERE s.cod_ini_ruta=" . $codini . "
			AND s.tipo_proceso IN('seguimiento')
			AND s.id IN(SELECT MAX(s.id) FROM cmx_inicio_seguimiento s
			WHERE s.cod_ini_ruta=" . $codini . "
			AND s.tipo_proceso
			IN('seguimiento'));";
		//echo $sql;
		$result = $Data->getConsulta($sql);
		if ($result) {
			if ($result > 1) {
				$return["result"] = $result["rowsData"];
			} else {
				$return["result"] = $result;
			}
		} else { //consulta conra el primer estado
			$sql = "SELECT est.fecha, est.hora, 2
			FROM 	cmx_inicio_ruta i
			INNER JOIN cmx_inici_manifiesto_estado est
			ON i.cod_inicio=est.cod_ini_ruta
			WHERE i.id=" . $codini . " AND est.estado=2";
			//echo $sql;
			$result = $Data->getConsulta($sql);
			if ($result > 1) {
				$return["result"] = $result["rowsData"];
			} else {
				$return["result"] = $result;
			}
		}
		break;
		//BARRAS
	case 'consultar_barras':
		$codini = $_POST["codini"];
		$sql = "SELECT COUNT(p.id) AS 'numero',
		(SELECT COUNT(DISTINCT detalle_tipo)
		FROM cmx_inicio_seguimiento
		WHERE cod_ini_ruta=" . $codini . "
		AND tipo_seguimiento='punto control') AS 'numero2'
		FROM  cmx_inicio_ruta r
		INNER JOIN cmx_planruta_detalle p
		ON r.cod_plan=p.cod_plan
		WHERE r.id=" . $codini . "";
		$result = $Data->getConsulta($sql);
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}

		break;

	case 'consultar_barraentrega':
		$codini = $_POST["codini"];
		$sql = "SELECT COUNT(DISTINCT de.id)AS 'numero',
			(SELECT COUNT(DISTINCT detalle_tipo)
				FROM cmx_inicio_seguimiento
				WHERE 	cod_ini_ruta=" . $codini . "
				AND tipo_seguimiento='punto entrega')AS 'numero2'
			FROM cmx_inicio_ruta i
			INNER JOIN cmx_manifiesto ma
			ON i.num_manifiesto=ma.id
			INNER JOIN cmx_manifiesto_remesa mr
			ON ma.id=mr.id_manifiesto
			INNER JOIN cmx_remesa re
			ON mr.id_remesa=re.id
			INNER JOIN cmx_destinatarios_ss de
			ON re.id_destinatario=de.id
			WHERE i.id=" . $codini . "";
		$result = $Data->getConsulta($sql);
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}

		break;

	case 'registraubicacion':
		$user = $_SESSION["usuario"]["nom_usuario"];
		$hora = date('H:i:s');
		$fecha = date('Y-m-d');
		$latitud = $_POST["latitud"];
		$longitud = $_POST["longitud"];
		$iniru = $_POST["codini"];
		$sql = "INSERT INTO cmx_iniruta_ubicacion
			(id,cod_ini_ruta,latitud,longitud,usuario,fecha,hora)
			VALUES(null," . $iniru . ",'" . $latitud . "','" . $longitud . "','" . $user . "','" . $fecha . "','" . $hora . "')";
		$result = $Data->ejecuteRegistro($sql);
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}

		break;

	case 'consultar_ubicacion':
		$codinio = $_POST["codini"];
		$sql = "SELECT u.*, s.observacion ,
		CONCAT(m.municipio, '-', m.depto) AS espacio
		FROM cmx_iniruta_ubicacion u
		INNER JOIN cmx_municipios m
		ON u.lugar=m.id
		LEFT JOIN cmx_inicio_seguimiento s
		ON u.id_seguimiento=s.id
			WHERE u.cod_ini_ruta=" . $codinio;
		$result = $Data->getConsulta($sql);
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}

		break;

	case 'consultar_solicitudes':
		$manifi = $_POST["idplanilla"];
		$sql = "SELECT oc.mer_idservicio , cli.nombre
		FROM cmx_manifiesto ma
		INNER JOIN cmx_manifiesto_remesa rema
		ON ma.id=rema.id_manifiesto AND rema.estado=1
		INNER JOIN cmx_remesa_ordencargue roc
		ON rema.id_remesa=roc.id_remesa AND roc.estado=1
		INNER JOIN cmx_orden_cargue oc
		ON roc.id_orden_cargue=oc.id AND oc.estado=1
		INNER JOIN cmx_clientes cli
		ON oc.cli_id=cli.id
		WHERE ma.id=" . $manifi . "
		GROUP BY oc.mer_idservicio";
		$result = $Data->getConsulta($sql);
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}

		break;

	case 'ubicacionactual':
		$idruta = $_POST["idruta"];
		$sql = "SELECT * FROM cmx_iniruta_ubicacion u
		WHERE u.cod_ini_ruta=" . $idruta . "
		AND u.id IN(SELECT MAX(s.id) FROM cmx_iniruta_ubicacion s
		WHERE s.cod_ini_ruta=" . $idruta . ");";
		$result = $Data->getConsulta($sql);
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}

		break;

	case 'Consulta_Cordenadas':
		$ciudad = $_POST['ciudad'];
		$sql = "SELECT latitud,longitud
		FROM cmx_municipios
		WHERE id=" . $ciudad;
		$result = $Data->getConsulta($sql);
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}

		break;
}

// if ($result > 1) {
// 	$return["result"] = $result["rowsData"];
// } else {
// 	$return["result"] = $result;
// }

// echo json_encode($return);


if ($result > 1) {
	$return["result"] = $result["rowsData"];
} else {
	$return["result"] = $result;
}

echo json_encode($return);
