<?php
include("../application/Config.php");
include '../application/Conexion.php';
include '../application/Model.php';
session_start();
$Data = new Consultas;

switch($_REQUEST['action']) {

	case 'consultar_inicioruta':
		$selec=$_POST["selec"];
		if($selec=='p'){
			$pk=$_POST["pk"];
			$sql="";
		}

		if($selec=='c'){
			$numero=$_POST["numero"];
			$sql="";
		}

		if($selec=='f'){
			$fechai=$_POST["fechai"];
			$fechab=$_POST["fechab"];
			$est=$_POST["est"];
			/*$sql="SELECT i.*, p.nombre, est.id AS med,
					e.estado
					FROM  cmx_inicio_ruta i
					INNER JOIN cmx_inici_manifiesto_estado est
					ON i.cod_inicio=est.cod_ini_ruta  AND est.ultimo_estado=1
					INNER JOIN cmx_proveedores p
					ON i.cond_cedula=p.numero_documento
					INNER JOIN cmx_estado_segui e
					ON est.estado=e.id
					WHERE i.fecha BETWEEN
					'".$fechai."'AND '".$fechab."';";*/

			$sql="SELECT i.*, p.nombre, est.id AS med,
					e.estado, CONCAT(mn1.municipio,'-', mn1.depto) AS 'origin',
					CONCAT(mn2.municipio,'-', mn2.depto) AS 'destini', est.fecha AS 'ufecha',est.hora AS 'uhora'
					FROM  cmx_inicio_ruta i
					INNER JOIN cmx_inici_manifiesto_estado est
					ON i.cod_inicio=est.cod_ini_ruta  AND est.ultimo_estado=1 
						".$est."
					INNER JOIN cmx_proveedores p
					ON i.cond_cedula=p.numero_documento
					INNER JOIN cmx_estado_segui e
					ON est.estado=e.id
					INNER JOIN cmx_plan_ruta pl
					ON i.cod_plan=pl.cod_plan
					INNER JOIN cmx_rutas ru
					ON pl.cod_ruta=ru.id	
					INNER JOIN cmx_municipios mn1
					ON ru.cod_ciudad_origen=mn1.id
					INNER JOIN cmx_municipios mn2
					ON ru.cod_ciudad_destino=mn2.id
					WHERE i.fecha BETWEEN
					'".$fechai."'AND '".$fechab."'";
					

		}
		$result=$Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
	break;




	case 'consultar_clientes':
		$id_planilla=$_POST["id_planilla"];
		/*sql="SELECT cl.*
			FROM cmx_planilla p
			INNER JOIN cmx_estudio_vehiculo e
			ON p.id_estudio=e.id
			INNER JOIN cmx_log_solicitudvehiculo2 se
			ON e.id_solicitud=se.id
			INNER JOIN  cmx_preestudio_solicitudes_servicio sp
			ON se.id_solictud=sp.id_solicitudpreestudio
			INNER JOIN cmx_ruta_puntosentrega pe
			ON sp.id_servicio_cliente=pe.cod_ini_ruta
			INNER JOIN cmx_clientes cl
			ON pe.cliente=cl.id	
			WHERE p.id=".$id_planilla."
			GROUP BY cl.id";*/

		$sql="SELECT cl.*, bb.remesa, bb.fecha_remesa
			FROM cmx_planilla p
			INNER JOIN cmx_planilla_detalle1 bb
			ON p.id=bb.id_planilla
			LEFT JOIN cmx_estudio_vehiculo e
			ON p.id_estudio=e.id
			INNER JOIN cmx_log_solicitudvehiculo2 se
			ON e.id_solicitud=se.id
			INNER JOIN  cmx_preestudio_solicitudes_servicio sp
			ON se.id_solictud=sp.id_solicitudpreestudio
			INNER JOIN cmx_ruta_puntosentrega pe
			ON sp.id_servicio_cliente=pe.cod_ini_ruta
			INNER JOIN cmx_clientes cl
			ON pe.cliente=cl.id	
			WHERE p.id=".$id_planilla."
			GROUP BY cl.id";	

		$result=$Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
	break;

	case 'consultar_pentrega':
		$id_planilla=$_POST["id_planilla"];
		$sql="SELECT sp.id_servicio_cliente, 
			pe.*, mun.municipio,mun.depto,cl.nombre AS nom
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
			WHERE p.id=".$id_planilla."";
		$result=$Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
	break;

	case 'consultar_pcontrol':
		$id_plan=$_POST["id_plan"];
		$sql="SELECT * FROM cmx_plan_ruta p
			INNER JOIN cmx_rutas ru
			ON p.cod_ruta=ru.id
			INNER JOIN cmx_planruta_detalle d
			ON p.cod_plan=d.cod_plan
			INNER JOIN cmx_municipios m
			ON d.cod_ciudad=m.id
			WHERE p.cod_plan=".$id_plan."
			AND d.tipo_punto='punto control'";
		$result=$Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
	break;

	case 'consultar_pgeografico':
		$id_plan=$_POST["id_plan"];
		$sql="SELECT * FROM cmx_plan_ruta p
			INNER JOIN cmx_rutas ru
			ON p.cod_ruta=ru.id
			INNER JOIN cmx_planruta_detalle d
			ON p.cod_plan=d.cod_plan
			INNER JOIN cmx_municipios m
			ON d.cod_ciudad=m.id
			WHERE p.cod_plan=".$id_plan."
			AND d.tipo_punto='punto geografico'";
		$result=$Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
	break;


	case 'estado_max':
		$id=$_REQUEST["id"];
		// $sql="SELECT e.estado
		// FROM cmx_inici_manifiesto_estado e
		// WHERE e.cod_ini_ruta=".$id." AND e.ultimo_estado=1 ";
		$sql="
				SELECT e.estado, s.estado as letra
				FROM cmx_inici_manifiesto_estado e
				INNER JOIN  cmx_estado_segui s
				ON e.estado=s.id
				WHERE e.cod_ini_ruta=".$id."
				 AND e.ultimo_estado=1 
		";

		$result=$Data->getConsulta($sql);	
		$return["result"] = $result["rowsData"];
	break;

	case 'estado_select':
		$actual=$_REQUEST["actual"];
		if($actual=='2'){//enturnado
			$sql="
				SELECT id,estado
				FROM cmx_estado_segui
				WHERE id   IN (3)
			";
		}
		if($actual=='3'){//cargue
			$sql="	
				SELECT id,estado
				FROM cmx_estado_segui
				WHERE id   IN (5); 
			";
		}
		if($actual=='5'){//en ruta
			$sql="
				SELECT id,estado
				FROM cmx_estado_segui
				WHERE id   IN (4); 
			";
		}
		if($actual=='4'){//descargue
			$sql="
				SELECT id,estado
				FROM cmx_estado_segui
				WHERE id  IN (8); 
			";
		}
		if($actual=='8'){//devolucion
			$sql="
				SELECT id,estado
				FROM cmx_estado_segui
				WHERE id   IN (6); 
			";
		}
			
		if($actual=='6'){//entregado
			$sql="
				SELECT id,estado
				FROM cmx_estado_segui
				WHERE id   IN (7); 
			";
		}	

		$result=$Data->getConsulta($sql);	
		$return["result"] = $result["rowsData"];
	break;


	//GESTION
	case 'puntos_controls':
		$idplan=$_REQUEST["idplan"];
		$sql="
			SELECT r.*, mun.municipio, mun.depto,
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
			WHERE pr.cod_plan=".$idplan."
			AND r.tipo_punto='punto control'
		";	
		// echo $sql;
		$result=$Data->getConsulta($sql);	
		$return["result"] = $result["rowsData"];
	break;


	case 'puntos_geografia':
		$idplan=$_REQUEST["idplan"];
		$sql="
			SELECT r.*, mun.municipio, mun.depto,
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
			WHERE pr.cod_plan=".$idplan."
			AND r.tipo_punto='punto geografico'
		";	
		// echo $sql;
		$result=$Data->getConsulta($sql);	
		$return["result"] = $result["rowsData"];
	break;


	case 'punto_entrega':
		$planilla=$_POST["planilla"];
		$sql="SELECT  
			pe.*, mun.municipio,mun.depto, cl.nombre
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
			WHERE p.id=".$planilla."";
		$result=$Data->getConsulta($sql);	
		$return["result"] = $result["rowsData"];
	break;

	case 'traer_ciudad':
		$sql="
		SELECT * FROM cmx_municipios
		WHERE pais='COLOMBIA'   ";
		$result=$Data->getConsulta($sql);	
		$return["result"] = $result["rowsData"];	
	break;



	case 'consultar_conteos':
		$id_planilla=$_POST["id_planilla"];
		$codigo_plan=$_POST["codigo_plan"];
		$sql="SELECT COUNT(pe.id) AS amountpe
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
			WHERE p.id=".$id_planilla."";
		$result=$Data->getConsulta($sql);	
		$return["result"] = $result["rowsData"];	

		$sql2="SELECT COUNT(d.id)AS amountpc
			FROM cmx_plan_ruta p
			INNER JOIN cmx_planruta_detalle d
			ON p.cod_plan=d.cod_plan
			INNER JOIN cmx_municipios m
			ON d.cod_ciudad=m.id
			WHERE p.cod_plan=".$codigo_plan."
			AND d.tipo_punto='punto control'";
		$result2=$Data->getConsulta($sql2);	
		$return["result2"] = $result2["rowsData"];	

		$sql3="SELECT COUNT(cl.id) AS amountcl
			FROM cmx_planilla p
			INNER JOIN cmx_estudio_vehiculo e
			ON p.id_estudio=e.id
			INNER JOIN cmx_log_solicitudvehiculo2 se
			ON e.id_solicitud=se.id
			INNER JOIN  cmx_preestudio_solicitudes_servicio sp
			ON se.id_solictud=sp.id_solicitudpreestudio
			INNER JOIN cmx_ruta_puntosentrega pe
			ON sp.id_servicio_cliente=pe.cod_ini_ruta
			INNER JOIN cmx_clientes cl
			ON pe.cliente=cl.id	
			WHERE p.id=".$id_planilla."";
		$result3=$Data->getConsulta($sql3);	
		$return["result3"] = $result3["rowsData"];	

		$sql4="SELECT COUNT(d.id)AS amountpg
			FROM cmx_plan_ruta p
			INNER JOIN cmx_planruta_detalle d
			ON p.cod_plan=d.cod_plan
			INNER JOIN cmx_municipios m
			ON d.cod_ciudad=m.id
			WHERE p.cod_plan=".$codigo_plan."
			AND d.tipo_punto='punto geografico'";
		$result4=$Data->getConsulta($sql4);	
		$return["result4"] = $result4["rowsData"];

	break;


	case 'linea_puntoentrega':
		$id_planilla=$_POST["idplanilla"];
		$idinicio=$_POST["idinicio"];
		$sql="
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
			ON pe.id=seg.detalle_tipo 
			AND seg.tipo_proceso='seguimiento'
			AND seg.cod_ini_ruta=".$idinicio." 
			WHERE p.id=".$id_planilla."
			ORDER BY pe.cod_ini_ruta,  pe.id";
		$result=$Data->getConsulta($sql);	
		$return["result"] = $result["rowsData"];
	break;

	case 'valida_puntoe':
		$identrega=$_REQUEST["identrega"];
		$sql="SELECT COUNT(detalle_tipo) AS numero 
			FROM cmx_inicio_seguimiento
			WHERE 	tipo_seguimiento='punto entrega' 
			AND detalle_tipo=".$identrega." ";
			// echo $sql;
		$result=$Data->getConsulta($sql);	
		$return["result"] = $result["rowsData"];
	break;

	case 'pintar_pc':
		$idplan=$_REQUEST["id_plan"];
		$idinicio=$_REQUEST["idinicio"];
		$sql="
			SELECT d.*, CONCAT(m.municipio,'-',m.depto) AS city, se.tipo_proceso, se.cod_ini_ruta FROM 
		cmx_plan_ruta p INNER JOIN cmx_planruta_detalle d ON p.cod_plan=d.cod_plan 
		INNER JOIN cmx_municipios m 
		ON d.cod_ciudad=m.id 
		LEFT JOIN cmx_inicio_seguimiento se 
		ON d.id=se.detalle_tipo 
		AND se.tipo_proceso='seguimiento' 
		AND cod_ini_ruta=".$idinicio."
		WHERE p.cod_plan=".$idplan."
		AND d.tipo_punto='punto control' 
		ORDER BY d.id";
		$result=$Data->getConsulta($sql);	
		$return["result"] = $result["rowsData"];
	break;

	case 'valida_puntoc':
		$punto=$_REQUEST["punto"];
		$sql="
			SELECT COUNT(detalle_tipo) AS numero 
			FROM cmx_inicio_seguimiento
			WHERE 	tipo_seguimiento='punto control' 
			AND detalle_tipo=".$punto."
		";
		$result=$Data->getConsulta($sql);	
		$return["result"] = $result["rowsData"];
	break;


	case 'consultar_novedades':
		//estados
		$codigo_inicio=$_POST["codigo_inicio"];
		$mani=$_POST["mani"];
		$sql="SELECT * FROM cmx_inici_manifiesto_estado 
		WHERE cod_ini_ruta=".$codigo_inicio."
		ORDER BY id";
		$result=$Data->getConsulta($sql);	
		$return["result"] = $result["rowsData"];

		//seguimientos
		$sql2="	SELECT a.*, b.id_servicio
			FROM cmx_inicio_seguimiento a
			INNER JOIN cmx_seguimiento_servicio b
			ON a.id=b.id_seguimiento
			WHERE a.cod_ini_ruta=".$codigo_inicio;
		$result2=$Data->getConsulta($sql2);	
		$return["result2"] = $result2["rowsData"];	
	break;

	case 'consultar_seguimiento_punto':
		$idpunto=$_POST["idpunto"];
		$idplan=$_POST["idplan"];
		$codini=$_POST["codini"];
		$sql="SELECT a.*,b.tipo_punto AS 'clasepunto'
		FROM  cmx_inicio_seguimiento a
		INNER JOIN cmx_planruta_detalle b
		ON a.detalle_tipo=b.id
		WHERE a.detalle_tipo=".$idpunto."
		AND b.cod_plan=".$idplan." 
		AND a.cod_ini_ruta=".$codini;
		$result=$Data->getConsulta($sql);	
		$return["result"] = $result["rowsData"];	
	break;

	case 'consultar_seguimiento_puntoe':
		$idpentrega=$_POST["idpentrega"];
		$id_planilla=$_POST["id_planilla"];
		$idruta=$_POST["idruta"];
		$sql="SELECT a.*, b.tipo
			FROM  cmx_inicio_seguimiento a
			INNER JOIN cmx_inicio_ruta u
			ON a.cod_ini_ruta=u.cod_inicio
			LEFT JOIN cmx_ruta_puntosentrega b
			ON a.detalle_tipo=b.id
			WHERE a.cod_ini_ruta=".$idruta." AND a.detalle_tipo=".$idpentrega."
			AND u.id_estudio_seguridad=".$id_planilla."";
		$result=$Data->getConsulta($sql);	
		$return["result"] = $result["rowsData"];
	break;

	case 'novedad_general':
		$sql="SELECT * FROM cmx_para_novedades_seguimiento";
		$result=$Data->getConsulta($sql);	
		$return["result"] = $result["rowsData"];
	break;

	case 'validar_tipoproceso':
		$cod_iniruta=$_POST["cod_iniruta"];
		$estado=$_POST["estado"];
		$segui=$_POST["segui"];
		$detalle=$_POST["detalle"];
		$proce=$_POST["proce"];
		$sql="			
		SELECT i.* 
		FROM cmx_inicio_seguimiento i
		INNER JOIN cmx_inici_manifiesto_estado e
		ON i.cod_man_estado=e.id
		WHERE i.cod_ini_ruta=".$cod_iniruta." 
		AND i.tipo_seguimiento='".$segui."'
		AND i.detalle_tipo=".$detalle."  
		AND i.tipo_proceso='completado'
		AND e.estado=".$estado."";
		$result=$Data->getConsulta($sql);	
		$return["result"] = $result["rowsData"];
	break;

	case 'consulta_puntocontrol':
		$codini=$_POST["codini"];	
		//AUTOMÁTICO
		/*$sql="SELECT ru.latitud_origen,ru.latitud_destino,ru.longitud_origen,longitud_destino,
				d.* FROM cmx_inicio_seguimiento s
				INNER  JOIN cmx_planruta_detalle  d
				ON s.detalle_tipo=d.id
				INNER JOIN cmx_plan_ruta pl
				ON d.cod_plan=pl.id
				INNER JOIN cmx_rutas ru
				ON pl.cod_ruta=ru.id
				WHERE s.cod_ini_ruta=".$codini." AND s.tipo_seguimiento IN('punto control','punto geografico')
				AND s.id IN(SELECT MAX(s.id) FROM cmx_inicio_seguimiento s
				INNER  JOIN cmx_planruta_detalle  d 
				ON s.detalle_tipo=d.id
				INNER JOIN cmx_plan_ruta pl
				ON d.cod_plan=pl.id
				INNER JOIN cmx_rutas ru
				ON pl.cod_ruta=ru.id
				WHERE s.cod_ini_ruta=".$codini." 
				AND s.tipo_seguimiento 
				IN('punto control','punto geografico'))";*/
		//MANUAL
		$sql="SELECT ru.latitud_origen,ru.latitud_destino,
		ru.longitud_origen,ru.longitud_destino, 
		a.latitud,a.longitud	
		FROM cmx_iniruta_ubicacion a
		INNER JOIN cmx_inicio_ruta b
		ON a.cod_ini_ruta=b.cod_inicio
		INNER JOIN cmx_plan_ruta pl
		ON b.cod_plan=pl.id
		INNER JOIN cmx_rutas ru
		ON pl.cod_ruta=ru.id	
		WHERE b.cod_inicio=".$codini."
		AND a.id 
		IN(SELECT MAX(a.id) FROM cmx_iniruta_ubicacion a 
		WHERE a.cod_ini_ruta=".$codini.")";		
		$result=$Data->getConsulta($sql);	
		$return["result"] = $result["rowsData"];
	break;

	case 'ultima_novedad':
		$cod_inicia=$_POST["codini"];
		$sql="SELECT s.*, n.color_alerta, n.novedad
				FROM cmx_inicio_seguimiento s
				INNER JOIN cmx_para_novedades_seguimiento n
				ON s.novedad=n.id
				WHERE s.cod_ini_ruta=".$cod_inicia."
				AND s.tipo_proceso IN('seguimiento')
				AND s.id IN(SELECT MAX(s.id) FROM cmx_inicio_seguimiento s
				WHERE s.cod_ini_ruta=".$cod_inicia."
				AND s.tipo_proceso 
				IN('seguimiento'));
				";
		$result=$Data->getConsulta($sql);	
		$return["result"] = $result["rowsData"];
	break;

	case 'consulta_semaforo':
		$codini=$_POST["codini"];
		$sql="SELECT s.fecha, s.hora, 1
			FROM cmx_inicio_seguimiento s
			WHERE s.cod_ini_ruta=".$codini."
			AND s.tipo_proceso IN('seguimiento')
			AND s.id IN(SELECT MAX(s.id) FROM cmx_inicio_seguimiento s
			WHERE s.cod_ini_ruta=".$codini."
			AND s.tipo_proceso 
			IN('seguimiento'));";
			$result=$Data->getConsulta($sql);	
		if($result){
			$return["result"] = $result["rowsData"];
		}else{//consulta conra el primer estado
			$sql="SELECT est.fecha, est.hora, 2
			FROM 	cmx_inicio_ruta i
			INNER JOIN cmx_inici_manifiesto_estado est
			ON i.cod_inicio=est.cod_ini_ruta  
			WHERE i.id=".$codini." AND est.estado=2";
			$result=$Data->getConsulta($sql);
			$return["result"] = $result["rowsData"];
		}
	break;



	//BARRAS
	case 'consultar_barras':
		$codini=$_POST["codini"];
		$sql="SELECT u.*, 1
		FROM cmx_iniruta_ubicacion u
			WHERE u.cod_ini_ruta=".$codini."
			AND u.id IN(SELECT MAX(s.id) FROM cmx_iniruta_ubicacion s
			WHERE s.cod_ini_ruta=".$codini."
			);";	
		echo $sql;	
		$result=$Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
	break;

	case 'consultar_barraentrega':
		$codini=$_POST["codini"];
		$sql="SELECT COUNT(DISTINCT pe.id) AS 'numero',
			(SELECT COUNT(DISTINCT detalle_tipo) 
			FROM cmx_inicio_seguimiento 
			WHERE 	cod_ini_ruta=".$codini."
			AND tipo_seguimiento='punto entrega')AS 'numero2'
			FROM cmx_inicio_ruta i
			INNER JOIN cmx_planilla p
			ON i.id_estudio_seguridad=p.id
			INNER JOIN cmx_planilla_detalle1 bb
			ON p.id=bb.id_planilla
			LEFT JOIN cmx_estudio_vehiculo e
			ON p.id_estudio=e.id
			INNER JOIN cmx_log_solicitudvehiculo2 se
			ON e.id_solicitud=se.id
			INNER JOIN  cmx_preestudio_solicitudes_servicio sp
			ON se.id_solictud=sp.id_solicitudpreestudio
			INNER JOIN cmx_ruta_puntosentrega pe
			ON sp.id_servicio_cliente=pe.cod_ini_ruta	
			WHERE i.id=".$codini."";
		$result=$Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
	break;

	case 'registraubicacion':
		$user=$_SESSION["usuario"]["nom_usuario"];
		$hora=date('H:i:s');
		$fecha=date('Y-m-d');
		$latitud=$_POST["latitud"];
		$longitud=$_POST["longitud"];
		$iniru=$_POST["codini"];
		$sql="INSERT INTO cmx_iniruta_ubicacion
			(id,cod_ini_ruta,latitud,longitud,usuario,fecha,hora)
			VALUES(null,".$iniru.",'".$latitud."','".$longitud."','".$user."','".$fecha."','".$hora."')";
		$result=$Data->ejecuteRegistro($sql);
		$return["result"] = $result["rowsData"];
	break;

	case 'consultar_ubicacion':
		$codinio=$_POST["codini"];
		$sql="SELECT * FROM cmx_iniruta_ubicacion	
			WHERE cod_ini_ruta=".$codinio;
		$result=$Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
	break;

	case 'consultar_solicitudes':
		$nplanilla=$_POST["idplanilla"];
		$sql="SELECT p.id_servicio, s.nombre_cliente
			FROM cmx_planilla_detalle1 p
			INNER JOIN cmx_solicitud_vehiculo2 s
			ON p.id_servicio=s.id
			WHERE p.id_planilla=".$nplanilla;
		$result=$Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
	break;


}

$return["result"] = $result["rowsData"];
echo json_encode($return);
?>