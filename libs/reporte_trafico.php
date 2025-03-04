<?php
include("../application/Config.php");
include '../application/Conexion.php';
include '../application/Model.php';
session_start();
$Data = new Consultas;
switch($_REQUEST['action']) {

	case 'consultar_datos':
		$f=$_POST["f"];
		if($f=='1'){
			$fechai=$_POST["fechai"];
			$fechaf=$_POST["fechaf"];

			$sql="SELECT  plu.id_servicio AS 'idservicio',plu.orden_cargue, 
			plu.remesa,i.id,pla.placa, tra.placa AS 'placatrailer',
			pro.nombre, se.nombre_cliente, pla.n_manifiesto, pla.fecha_manifiesto,
			i.id, pla.id AS 'idplanilla', pro.numero_documento, cle.estado
			FROM cmx_inicio_ruta i
			INNER JOIN cmx_planilla pla ON i.id_estudio_seguridad=pla.id
			INNER JOIN cmx_planilla_detalle1 plu ON pla.id=plu.id_planilla
			LEFT JOIN cmx_vehiculos v ON pla.placa=v.placa
			LEFT JOIN cmx_trailer_vehiculo tv ON v.id=tv.id_vehiculo AND tv. estado=1
			LEFT JOIN cmx_trailer tra ON tv.id_trailer=tra.id	
			INNER JOIN cmx_proveedores pro ON i.cond_cedula=pro.numero_documento
			INNER JOIN cmx_solicitud_vehiculo2 se ON plu.id_servicio=se.id
			INNER JOIN cmx_cliente_envio cle ON i.id=cle.cod_ini_ruta AND plu.id_servicio=cle.id_servicio	
			WHERE i.fecha 
			BETWEEN '".$fechai."' AND '".$fechaf."'
			ORDER BY  i.id DESC";
		}
		$result=$Data->getConsulta($sql);	
		$return["result"] = $result["rowsData"];
	break;


	case 'case_estados':
			$sql="
			SELECT  plu.id_servicio AS 'idservicio',plu.orden_cargue, 
				plu.remesa,i.id,pla.placa, tra.placa AS 'placatrailer',
				pro.nombre, se.nombre_cliente, pla.n_manifiesto, pla.fecha_manifiesto,
				i.id, pla.id AS 'idplanilla', pro.numero_documento, cle.estado
				FROM cmx_inicio_ruta i
				INNER JOIN cmx_planilla pla
				ON i.id_estudio_seguridad=pla.id
				INNER JOIN cmx_planilla_detalle1 plu
				ON pla.id=plu.id_planilla
				LEFT JOIN cmx_vehiculos v
				ON pla.placa=v.placa
				LEFT JOIN cmx_trailer_vehiculo tv
				ON v.id=tv.id_vehiculo AND tv. estado=1
				LEFT JOIN cmx_trailer tra
				ON tv.id_trailer=tra.id	
				INNER JOIN cmx_proveedores pro
				ON i.cond_cedula=pro.numero_documento
				INNER JOIN cmx_solicitud_vehiculo2 se
				ON plu.id_servicio=se.id
				INNER JOIN cmx_cliente_envio cle
				ON i.id=cle.cod_ini_ruta AND plu.id_servicio=cle.id_servicio	
				WHERE cle.estado <>3
				ORDER BY  i.id DESC";
		$result=$Data->getConsulta($sql);	
		$return["result"] = $result["rowsData"];
	break;

	case 'case_conteos':
		$sql="SELECT COUNT(DISTINCT( plu.id_servicio)) AS 'numpedido', COUNT(DISTINCT(pla.placa)) AS 'numvehiculoruta'
				FROM cmx_inicio_ruta i
				INNER JOIN cmx_planilla pla
				ON i.id_estudio_seguridad=pla.id
				INNER JOIN cmx_planilla_detalle1 plu
				ON pla.id=plu.id_planilla
				LEFT JOIN cmx_vehiculos v
				ON pla.placa=v.placa
				LEFT JOIN cmx_trailer_vehiculo tv
				ON v.id=tv.id_vehiculo AND tv. estado=1
				LEFT JOIN cmx_trailer tra
				ON tv.id_trailer=tra.id	
				INNER JOIN cmx_proveedores pro
				ON i.cond_cedula=pro.numero_documento
				INNER JOIN cmx_solicitud_vehiculo2 se
				ON plu.id_servicio=se.id
				INNER JOIN cmx_cliente_envio cle
				ON i.id=cle.cod_ini_ruta AND plu.id_servicio=cle.id_servicio	
				WHERE cle.estado <>3";
		$result=$Data->getConsulta($sql);	
		$return["result"] = $result["rowsData"];		
	break;


	case 'consultar_grupos':
		$fhoy=date('Y-m-d');
		$codini=$_POST["codini"];
		$plani=$_POST["plani"];
		$cliente=$_POST["cliente"];
		$servi=$_POST["servi"];
		$sql="SELECT gc.*, gs.id_servicio, cl.nombre
		 	FROM cmx_planilla p
			INNER JOIN cmx_estudio_vehiculo e
			ON p.id_estudio=e.id
			INNER JOIN cmx_log_solicitudvehiculo2 se
			ON e.id_solicitud=se.id
			INNER JOIN  cmx_preestudio_solicitudes_servicio sp
			ON se.id_solictud=sp.id_solicitudpreestudio
			INNER JOIN cmx_grupocliente_servicio gs
			ON sp.id_servicio_cliente=gs.id_servicio
			INNER JOIN cmx_grupo_contacto_cliente gc
			ON gs.id_grupo=gc.idgrupo
			INNER JOIN cmx_clientes cl
			ON gc.idcliente=cl.id
			WHERE p.id=".$plani."";

		$result=$Data->getConsulta($sql);	
		$return["result"] = $result["rowsData"];


		$sql2="SELECT se.id,se.tipo_seguimiento,
				se. observacion,
				se.fecha, se.hora, se.usuario,se.reporte_cliente,
				mn.municipio, n.novedad
				FROM 	
				cmx_inicio_seguimiento se
				LEFT JOIN  cmx_municipios mn
				ON se.detalle_tipo=mn.id
				LEFT JOIN cmx_para_novedades_seguimiento n
				ON se.novedad=n.id
				WHERE se.cod_ini_ruta=".$codini." AND se.reporte_cliente='si';";
			$result2=$Data->getConsulta($sql2);	
			$return["result2"] = $result2["rowsData"];


		$sql3="SELECT pe.estado, e.fecha, e.hora, e.usuario
			FROM cmx_inici_manifiesto_estado e	
			INNER JOIN cmx_estado_segui pe
			ON e.estado=pe.id	
			WHERE cod_ini_ruta=".$codini." 
			AND reporte_cliente='si'";	
		$result3=$Data->getConsulta($sql3);	
		$return["result3"] = $result3["rowsData"];	

		$sql4="SELECT cl.*, a.nombre
			FROM cmx_horacliente_servicio cs
			INNER JOIN cmx_cliente_hora cl
			ON cs.hora_email=cl.id
			INNER JOIN cmx_clientes a
			ON cl.id_cliente=a.id
			WHERE cs.id_servicio=".$servi."
			AND '".$fhoy."' 
			BETWEEN cl.fecha_inicio AND cl.fecha_final
			";
		$result4=$Data->getConsulta($sql4);	
		if($result4){
			$return["result4"] = $result4["rowsData"];	
		}else{
			$sql4="SELECT ch.*,cl.nombre 
			FROM cmx_cliente_hora ch
			INNER JOIN cmx_clientes cl
			ON ch.id_cliente=cl.id
			WHERE cl.nombre='Todos S.A.' 
			AND '".$fhoy."' BETWEEN ch.fecha_inicio
			AND ch.fecha_final";
			$result4=$Data->getConsulta($sql4);
			$return["result4"] = $result4["rowsData"];	
		}

		$sql5="SELECT a.id_servicio,a.fecha,a.usuario,a.hora, 
		b.fecha_inicio, b.fecha_final, b.hora_envio, a.modalidad
		FROM cmx_mail_enviados a
		LEFT JOIN cmx_cliente_hora b
		ON a.id_fecha_parametro=b.id
		WHERE id_servicio=".$servi."";
		$result5=$Data->getConsulta($sql5);
		$return["result5"] = $result5["rowsData"];	

	break;

	case 'consultar_grupos2':
		$codini=$_POST["codini"];
		$plani=$_POST["plani"];
		$servi=$_POST["servi"];
		$sql="SELECT gc.*, gs.id_servicio, cl.nombre
		 	FROM cmx_planilla p
			INNER JOIN cmx_estudio_vehiculo e
			ON p.id_estudio=e.id
			INNER JOIN cmx_log_solicitudvehiculo2 se
			ON e.id_solicitud=se.id
			INNER JOIN  cmx_preestudio_solicitudes_servicio sp
			ON se.id_solictud=sp.id_solicitudpreestudio
			INNER JOIN cmx_grupocliente_servicio gs
			ON sp.id_servicio_cliente=gs.id_servicio
			INNER JOIN cmx_grupo_contacto_cliente gc
			ON gs.id_grupo=gc.idgrupo
			INNER JOIN cmx_clientes cl
			ON gc.idcliente=cl.id
			WHERE p.id=".$plani."  AND sp.id_servicio_cliente=".$servi."";

		$result=$Data->getConsulta($sql);	
		$return["result"] = $result["rowsData"];


		$sql2="SELECT se.id,se.tipo_seguimiento,
				se. observacion,
				se.fecha, se.hora, se.usuario,se.reporte_cliente,
				mn.municipio, n.novedad, ser.id_servicio
				FROM 	
				cmx_inicio_seguimiento se
				LEFT JOIN  cmx_municipios mn
				ON se.detalle_tipo=mn.id
				LEFT JOIN cmx_para_novedades_seguimiento n
				ON se.novedad=n.id
				INNER JOIN cmx_seguimiento_servicio ser
				ON se.id=ser.id_seguimiento 
				WHERE se.cod_ini_ruta=".$codini." AND se.reporte_cliente='si'
				AND ser.id_servicio=".$servi."";
			$result2=$Data->getConsulta($sql2);	
			$return["result2"] = $result2["rowsData"];


		$sql3="SELECT pe.estado, e.fecha, e.hora, e.usuario
			FROM cmx_inici_manifiesto_estado e	
			INNER JOIN cmx_estado_segui pe
			ON e.estado=pe.id	
			WHERE cod_ini_ruta=".$codini." 
			AND reporte_cliente='si'";	
		$result3=$Data->getConsulta($sql3);	
		$return["result3"] = $result3["rowsData"];	

	break;

	case 'suspender_correo':
		$user=$_SESSION["usuario"]["nom_usuario"];
		$hora=date('H:i:s');
		$fecha=date('Y-m-d');
		$status=$_POST["status"];
		$codini=$_POST["codini"];
		$sr=$_POST["service"];
		$sql="UPDATE cmx_cliente_envio
			SET estado=".$status.",
				fecha='".$fecha."',
				hora='".$hora."',
				usuario='".$user."'
			WHERE cod_ini_ruta=".$codini."
			  AND id_servicio=".$sr."";
		$result=$Data->ejecuteRegistro($sql);
		$return["result"] = $result["rowsData"];
	break;




}
$return["result"] = $result["rowsData"];
echo json_encode($return);
?>