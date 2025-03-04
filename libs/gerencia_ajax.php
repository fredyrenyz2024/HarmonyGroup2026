<?php
include("../application/Config.php");
include '../application/Conexion.php';
include '../application/Model.php';
session_start();
$Data = new Consultas;
switch ($_REQUEST['action']) {

	case 'consultar_tablas':
		$fi = $_POST["fi"];
		$ff = $_POST["ff"];
		$sql = "SELECT cab.n_cotizacion, nombre_cliente,estado, autorizado_por
				FROM cmx_cotizaciones_serviciocliente cab
				INNER JOIN cmx_detalle_mercancia2 mer
				ON cab.n_cotizacion=mer.n_cotizacion
				WHERE cab.fecha_creacion 
				BETWEEN '" . $fi . "' AND '" . $ff . "'";
		$result = $Data->getConsulta($sql);
		// $return["result"] = $result["rowsData"];
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}

		$sql2 = "SELECT f.*, ef.estado, ef.usuario
		FROM 				
		cmx_operaciones_flete f
		INNER JOIN cmx_operaciones_estadoflete ef
		ON f.id=ef.id_fletepropuesto 
		WHERE 
		f.fecha BETWEEN '" . $fi . "' AND '" . $ff . "'
		 AND ef.estado IN(1,4)";
		$result2 = $Data->getConsulta($sql2);
		if ($result2 > 1) {
			$return["result2"] = $result2["rowsData"];
		} else {
			$return["result2"] = $result2;
		}
		break;


	case 'traer_datos_aprobacion':
		$id = $_POST["id"];
		$idtb_propuesto = $_POST["idtb_propuesto"];
		$sql = "SELECT a.nombre_cliente, 
		v.tipo_carga, v.tipo_mercancia, v.peso_bruto_kg,
		v.peso_neto_kg, v.peso_neto_tn, v.flete, a.tmer_utili,
		s.id, pv.nombre AS 'tipovehiculo', v.total_tarifa,
		v.utilidad, v.rentabilidad, a.total_cotizacion,
		sf.num_estudioseguridad, sf.placa, sf.flete_sugerido, sf.flete_propuesto
		FROM cmx_cotizaciones_serviciocliente a
		INNER JOIN cmx_detalle_mercancia2 v
		ON a.n_cotizacion=v.n_cotizacion
		INNER JOIN cmx_para_tipo_vehiculo pv
		ON v.tipo_vehiculo=pv.id
		LEFT JOIN cmx_solicitud_vehiculo2 s
		ON a.n_cotizacion=s.n_cotizacion
		LEFT JOIN cmx_subasta_solicitud_servicio so
		ON s.id=so.numer_solservicio
		LEFT JOIN cmx_subasta_flete sf
		ON so.id=sf.id_suba_servicio
		WHERE a.n_cotizacion=" . $id . "
		AND sf.id=" . $idtb_propuesto;
		$result = $Data->getConsulta($sql);
		// $return["result"] = $result["rowsData"];
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}
		break;

	case 'Registrar_Aprobacion':
		$estado = $_POST["estado"];
		$idtb = $_POST["idtb"];
		$idsubasta = $_POST["idsubasta"];
		//$ofletenew=$_POST["ofletenew"];
		$hora = date('G:i:s');
		$fecha = date('Y-m-d');
		$id_usuario = $_SESSION["usuario"]["nom_usuario"];

		if ($estado == 'aprobado_gerencia') { //pasa a aprobar la tarifa de servicio al cliente
			$sqla = "UPDATE cmx_estado_subasta_flete e
			INNER JOIN cmx_subasta_flete s
			ON e.id_suba_flete=s.id		
			 SET estado='" . $estado . "'
			 WHERE s.id=" . $idtb;
			$result = $Data->ejecuteRegistro($sqla);
		}
		if ($estado == 'rechazado') {
			$sqla = "UPDATE cmx_estado_subasta_flete e
			INNER JOIN cmx_subasta_flete s
			ON e.id_suba_flete=s.id		
			 SET estado='" . $estado . "'
			 WHERE s.id=" . $idtb;
			$result = $Data->ejecuteRegistro($sqla);

			$sqlb = "UPDATE cmx_estado_subasta
				SET estado=3
				WHERE id_subasta=" . $idsubasta;
			$resultb = $Data->ejecuteRegistro($sqlb);
		}
		//Actualizar el estado del flete
		// $return["result"] = $result["rowsData"];
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}
		break;


	case 'Registrar_Aprobacion_Tarifa':
		$estado = $_POST["estado"];
		$idtb = $_POST["idtb"];
		$idsubasta = $_POST["idsubasta"];
		$tarifa = $_POST["tarifa"];
		$flet = $_POST["flet"];
		$util = $_POST["util"];
		$renta = $_POST["renta"];
		$placa = $_POST["placa"];
		//$ofletenew=$_POST["ofletenew"];
		$hora = date('G:i:s');
		$fecha = date('Y-m-d');
		$id_usuario = $_SESSION["usuario"]["nom_usuario"];

		if ($estado == 'aprobado_gerencia') { //pasa a aprobar la tarifa de servicio al cliente
			$sql8 = "INSERT INTO cmx_operacion_subasta(id,n_subasta,flete_ganador,tarifa_ganador,rentabilidad,utilidad,placa,fecha,hora,usuario,area,estado_letra)
				VALUES(null,$idsubasta,'" . $flet . "','" . $tarifa . "','" . $renta . "','" . $util . "','" . $placa . "','" . $fecha . "','" . $hora . "','" . $id_usuario . "','GE','Ganador')";
			$resultm = $Data->ejecuteRegistro($sql8);

			$sqla = "UPDATE cmx_estado_subasta_flete e
			INNER JOIN cmx_subasta_flete s
			ON e.id_suba_flete=s.id		
			 SET estado_tarifa='" . $estado . "',
			 estado_final='Ganador',
			 estado='Ganador'
			 WHERE s.id=" . $idtb;
			$result = $Data->ejecuteRegistro($sqla);
			//descontar la disponibilidad de la solicitud de estudio
			$sqlb = "UPDATE cmx_solicitud_vehiculo2 a
			INNER JOIN  cmx_subasta_solicitud_servicio b
			ON a.id=b.numer_solservicio
			SET a.cant_disponible=(a.cant_disponible-1),
			a.estado_secundario='Ganador'
			WHERE b.id_subasta=" . $idsubasta;
			$result2 = $Data->ejecuteRegistro($sqlb);
		}
		if ($estado == 'rechazado') {
			$sql8 = "INSERT INTO cmx_operacion_subasta(id,n_subasta,flete_ganador,tarifa_ganador,rentabilidad,utilidad,placa,fecha,hora,usuario,area,estado_letra)
				VALUES(null,$idsubasta,'" . $flet . "','" . $tarifa . "','" . $renta . "','" . $util . "','" . $placa . "','" . $fecha . "','" . $hora . "','" . $id_usuario . "','GE','no_aprueba_ge')";
			//echo $sql8;		
			$resultm = $Data->ejecuteRegistro($sql8);

			$sqla = "UPDATE cmx_estado_subasta_flete e
			INNER JOIN cmx_subasta_flete s
			ON e.id_suba_flete=s.id		
			 SET e.estado_tarifa='" . $estado . "',
			 e.estado='no_aprueba_ge'
			 WHERE s.id=" . $idtb;
			$result = $Data->ejecuteRegistro($sqla);

			$sqlb = "UPDATE cmx_solicitud_vehiculo2 a
			INNER JOIN  cmx_subasta_solicitud_servicio b
			ON a.id=b.numer_solservicio
			SET a.cant_disponible=(a.cant_disponible-1),
			a.estado_secundario='no_aprueba_ge'
			WHERE b.id_subasta=" . $idsubasta;
			$result2 = $Data->ejecuteRegistro($sqlb);
		}
		//Actualizar el estado del flete
		// $return["result"] = $result["rowsData"];
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}
		break;




		//gerencia -select
	case 'guardar_apro_cotizacion':
		$select = $_REQUEST["select"];
		if ($_REQUEST["nota"]) {
			$nota = $_REQUEST["nota"];
		} else {
			$nota = '';
		}
		$estado = $_REQUEST["estado"];
		$cotizacion = $_REQUEST["cotizacion"];
		$usuario = $_REQUEST["usuario"];
		$hora = date('G:i:s');
		$fecha = date('Y-m-d');
		$total = $_POST["total"];
		$flete = $_POST["flete"];
		$tarifa = $_POST["tarifa"];
		$rentabilidad = $_POST["rentabilidad"];
		$utilidad = $_POST["utilidad"];
		$sql = "INSERT INTO cmx_respuestas_cotizaciones
			(id,idcotizacion,idestado,idselect,nota,fecha,hora,usuario)
			VALUES(null," . $cotizacion . "," . $select . ",'razon','" . $nota . "','" . $fecha . "','" . $hora . "','" . $usuario . "')";
		$result = $Data->ejecuteRegistro($sql);
		if ($result) {
			$sql1 = "SELECT max(id) AS id_respuesta 
				FROM cmx_respuestas_cotizaciones WHERE idcotizacion=" . $cotizacion;
			$result_respu = $Data->getConsulta($sql1);
			if ($result_respu) {
				$id_rta = $result_respu["rowsData"][0]["id_respuesta"];
				$sql2 = "INSERT INTO cotizacion_valores
					(id,n_cotizacion,id_respuesta_gerencia,total_coti,total_flete,total_tarifa,total_utili,total_rent)VALUES(null,$cotizacion,$id_rta,'" . $total . "','" . $flete . "','" . $tarifa . "','" . $utilidad . "','" . $rentabilidad . "')";
				$result2 = $Data->ejecuteRegistro($sql2);
			}
		}
		// $return["result"] = $result["rowsData"];
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}
		break;

	case 'traer_select':
		$tipo = $_REQUEST["tipo"];
		$nombre_ventana = $_REQUEST["nombre_ventana"];

		$sql = "
			SELECT op.id,  op.nombre_opcion FROM cmx_opciones op
			INNER JOIN cmx_ventana_opciones vo
			ON op.id=vo.id_opcion
			INNER JOIN cmx_ventana v
			ON vo.id_ventana=v.id
			WHERE op.tipo='" . $tipo . "'  
			AND v.nombre='" . $nombre_ventana . "'  ";
		$result = $Data->getConsulta($sql);
		// $return["result"] = $result["rowsData"];
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}
		break;
		//historico de cotización
	case 'historico_cotizacion':
		$id = $_REQUEST["ncotizar"];
		$sql = '
				SELECT e.*, m.id AS pareja, m.item, m.proceso FROM cmx_estados_cotizacion e
				INNER JOIN cmx_detalle_mercancia2 m
				ON e.n_cotizacion=m.n_cotizacion
				WHERE e.n_cotizacion=' . $id . ' 
				ORDER BY m.item ASC
			';
		$result = $Data->getConsulta($sql);
		// $return["result"] = $result["rowsData"];
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}
		break;

	case 'tsolicitudservicio':
		$ncotiza = $_REQUEST["n_cotizar"];
		$sql = "
			SELECT s.id,s.fecha, s.hora, s.estado, s.usuario_auditor, 
			s.proceso, m.n_cotizacion, m.id AS pareja,m.item
			FROM cmx_solicitud_vehiculo2 s
			INNER JOIN cmx_detalle_mercancia2 m
			ON s.idpareja_origen_destino=m.id
			WHERE s.n_cotizacion=" . $ncotiza . "
				";
		$result = $Data->getConsulta($sql);
		// $return["result"] = $result["rowsData"];
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}
		break;

		//Traer valores para el formulario de editar cotizacion 
	case 'update_aprobacion':
		$num_cotizacion = $_REQUEST['cotizar'];
		$aprueba = $_REQUEST['aprueba'];
		$estado = $_REQUEST["estado"];
		$f = $_REQUEST["f"];
		$sql = '
					UPDATE cmx_cotizaciones_serviciocliente SET 
					estado="' . $f . '",
					estado_autorizado="' . $estado . '" , autorizado_por="' . $aprueba . '"
					WHERE n_cotizacion=' . $num_cotizacion . '
				';
		// echo $sql;
		$result = $Data->ejecuteRegistro($sql);
		// $return["result"] = $result["rowsData"];
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}
		break;

	case 'insert_aprobacion':
		$num_cotizacion = $_REQUEST['cotizar'];
		$aprueba = $_REQUEST['aprueba'];
		$hora = date('G:i:s');
		$fecha = date('Y-m-d');
		$sql = '
				INSERT INTO cmx_estados_cotizacion 
				(id,n_cotizacion,estado,
				estado_autorizado,hora,fecha,user_log)
				VALUES(null,' . $num_cotizacion . ',"F1","autorizado","' . $hora . '",
				"' . $fecha . '","' . $aprueba . '");';
		// echo $sql;
		$result = $Data->ejecuteRegistro($sql);
		// $return["result"] = $result["rowsData"];
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}
		break;

	case 'insert_rechazo':
		$num_cotizacion = $_REQUEST['cotizar'];
		$aprueba = $_REQUEST['aprueba'];
		$hora = date('G:i:s');
		$fecha = date('Y-m-d');
		$sql = '
				INSERT INTO cmx_estados_cotizacion 
				(id,n_cotizacion,estado,
				estado_autorizado,hora,fecha,user_log)
				VALUES(null,' . $num_cotizacion . ',"F6","No autorizado","' . $hora . '",
				"' . $fecha . '","' . $aprueba . '");';
		// echo $sql;
		$result = $Data->ejecuteRegistro($sql);
		// $return["result"] = $result["rowsData"];
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}
		break;

	case 'ver':
		$numero_cotizacion = $_REQUEST['ncotizar'];
		$sql = '
					SELECT * FROM 
					cmx_cotizaciones_serviciocliente ccs 
					WHERE ccs.n_cotizacion=' . $numero_cotizacion . ' ';

		$result = $Data->getConsulta($sql);
		// $return["result"] = $result["rowsData"];
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}
		break;

	case 'ver_mer':
		$numero_cotizacion = $_REQUEST['ncotizar1'];
		$sql = "
						SELECT cdm.*, tv.nombre, 
						CONCAT(C1.municipio,'-',C1.depto) AS orig, 
						CONCAT(C2.municipio,'-',C2.depto) AS dest ,
						e.empaque
						FROM cmx_detalle_mercancia2 cdm
						INNER JOIN cmx_para_tipo_vehiculo tv
						ON cdm.tipo_vehiculo=tv.id
						INNER JOIN cmx_municipios C1
						ON cdm.origen=C1.rndc_codigo_ciudad
						INNER JOIN cmx_municipios C2
						ON cdm.destino=C2.rndc_codigo_ciudad
						INNER JOIN cmx_para_tipo_empaque e
						ON cdm.tipo_empaque=e.id
						WHERE cdm.n_cotizacion=" . $numero_cotizacion . "

					";
		$result = $Data->getConsulta($sql);
		// $return["result"] = $result["rowsData"];
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}
		break;

	case 'ver_espe':
		$numero_cotizacion = $_REQUEST['ncotizar2'];
		$sql = "
					SELECT * FROM 
					cmx_detalle_servespecial2 cde
					WHERE cde.n_cotizacion=" . $numero_cotizacion . " ";
		$result = $Data->getConsulta($sql);
		// $return["result"] = $result["rowsData"];
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}
		break;

	case 'status_iruta':
		$id = $_REQUEST["codini"];
		$sql = "SELECT * FROM cmx_inici_manifiesto_estado
				WHERE cod_ini_ruta=" . $id . "  ";
		$result = $Data->getConsulta($sql);
		// $return["result"] = $result["rowsData"];
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}
		break;

	case 'consultar_seguimientos':
		$idmani = $_POST["idmani"];
		$sql = "
				SELECT tipo_contacto, tipo_seguimiento, 
					tipo_proceso,observacion, CONCAT(mn.municipio,'-',mn.depto) as lugar
				 FROM cmx_inicio_seguimiento  s
				 INNER JOIN cmx_municipios mn
				 ON s.detalle_tipo=mn.id
				 WHERE s.cod_man_estado=" . $idmani . "
			";
		$result = $Data->getConsulta($sql);
		// $return["result"] = $result["rowsData"];
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}
		break;


	case 'consulta_aprobacion_sac':
		$cotizacion = $_POST["cotizacion"];
		$idtb_propuesto = $_POST["idtb_propuesto"];
		$id_subasta = $_POST["id_subasta"];
		$sql = "
				SELECT se.placa, se.flete_propuesto, 
					se.num_estudioseguridad, d.tarifa_subasta,
					d.responsable_ts, so.numer_solservicio,
					se.flete_sugerido
					FROM cmx_subasta_flete se
					INNER JOIN cmx_subasta_solicitud_servicio so
					ON se.id_suba_servicio=so.id
					INNER JOIN cmx_solicitud_vehiculo2 ser
					ON so.numer_solservicio=ser.id
					INNER JOIN cmx_detalle_mercancia2  d
					ON ser.idpareja_origen_destino=d.id
					INNER JOIN cmx_estado_subasta_flete e
					ON se.id=e.id_suba_flete
					WHERE ser.n_cotizacion=" . $cotizacion . "  
					AND se.id=" . $idtb_propuesto . "
					AND se.id_suba=" . $id_subasta;
		$result = $Data->getConsulta($sql);
		// $return["result"] = $result["rowsData"];
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}
		break;


	case 'aprobar_Anticipo':
		$num_manifiesto = $_POST["num_manifiesto"];
		$num_anticipo = $_POST["num_anticipo"];
		$anticipo = $_POST["anticipo"];
		$estado = $_POST["estado"];

		$sqlb = "update cmx_estado_mnf_anticipo 
				set estado=" . $estado . "   
				where  id_anticipo=" . $num_anticipo;
		$result = $Data->ejecuteRegistro($sqlb);
		// $return["result"] = $result["rowsData"];
		if ($result > 1) {
			$return["result"] = $result["rowsData"];
		} else {
			$return["result"] = $result;
		}
		break;



	default:
		break;
}

// $return["result"] = $result["rowsData"];
if ($result > 1) {
	$return["result"] = $result["rowsData"];
} else {
	$return["result"] = $result;
}
echo json_encode($return);
