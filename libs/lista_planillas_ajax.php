<?php
include("../application/Config.php");
include '../application/Conexion.php';
include '../application/Model.php';

$Data = new Consultas;

switch($_POST['action']) {

	case 'cargar_estudios_aprobados':
		$fi=$_POST["fecha_uno"];
		$ff=$_POST["fecha_dos"];
		/*
			$sql="SELECT soli.id , soli.id_solictud,  soli.placa, ev.estado,
			lg.fecha, lg.hora, p.nombre, p.numero_documento, tra.placa AS 'trailer',
			CASE WHEN pla.precinto IS NULL THEN '' ELSE  pla.precinto END AS 'precinto',
			CASE WHEN pla.anticipo IS NULL THEN '' ELSE  pla.anticipo END AS 'anticipo',
			CASE WHEN pla.id IS NULL THEN 0 ELSE  pla.id END AS 'idplanilla'
			FROM cmx_log_solicitudvehiculo2  soli
			LEFT JOIN cmx_estudio_vehiculo es ON soli.id=es.id_solicitud
			LEFT JOIN cmx_estudiov_completo ev
			ON es.id=ev.id_estudio AND ev.estado_actu=1 
			AND ev.estado='Aprobado'
			LEFT JOIN cmx_logestudio_com lg ON ev.id=lg.id_completo 
			LEFT JOIN cmx_proveedores p ON ev.id_conductor=p.id
			LEFT JOIN cmx_vehiculos vv ON ev.id_vehiculo=vv.id
			LEFT JOIN cmx_trailer_vehiculo tv ON ev.id=tv.id_vehiculo
			LEFT JOIN cmx_trailer tra ON tv.id_trailer=tra.id  
			LEFT JOIN cmx_planilla pla ON es.id=pla.id_estudio	
			WHERE lg.fecha BETWEEN '".$fi."' AND '".$ff."';"; */


			$sql="
			SELECT es.id AS idestudi, soli.id , soli.id_solictud,  soli.placa, ev.estado,
			lg.fecha, lg.hora, p.nombre, p.numero_documento, 
			cv.clase, tra.placa AS 'trailer', 
			CASE WHEN pla.precinto IS NULL THEN '' ELSE  pla.precinto END AS 'precinto',
			CASE WHEN pla.anticipo IS NULL THEN '' ELSE  pla.anticipo END AS 'anticipo',
			CASE WHEN pla.id IS NULL THEN 0 ELSE  pla.id END AS 'idplanilla',
			CASE WHEN pla.n_manifiesto IS NULL THEN 0 ELSE  pla.n_manifiesto END AS 'manifiesto',
			CASE WHEN sr.id IS NULL THEN 0 ELSE sr.id END AS 'idiniruta',
			CASE WHEN pla.num_tarjeta IS NULL THEN 0 ELSE pla.num_tarjeta END AS 'num_tarjeta',
			CASE WHEN iru.id IS NULL THEN 0 ELSE iru.id_estudio_seguridad END AS 'inicioruta'
			FROM cmx_log_solicitudvehiculo2  soli
			LEFT JOIN cmx_estudio_vehiculo es ON soli.id=es.id_solicitud
			LEFT JOIN cmx_estudiov_completo ev
			ON es.id=ev.id_estudio AND ev.estado_actu=1 
			AND ev.estado='Aprobado'
			LEFT JOIN cmx_logestudio_com lg ON ev.id=lg.id_completo 
			LEFT JOIN cmx_proveedores p ON ev.id_conductor=p.id
			LEFT JOIN cmx_vehiculos vv ON ev.id_vehiculo=vv.id
			LEFT JOIN cmx_vehiculo2 v2 ON vv.id=v2.id_vehiculo
			LEFT JOIN cmx_rndc_clase_vehiculo cv ON v2.clase_vehiculo=cv.id	
			LEFT JOIN cmx_trailer_vehiculo tv ON ev.id=tv.id_vehiculo
			LEFT JOIN cmx_trailer tra ON tv.id_trailer=tra.id  
			LEFT JOIN cmx_planilla pla ON es.id=pla.id_estudio	
			LEFT JOIN cmx_solicitar_inicio_ruta sr ON pla.id=sr.id_planilla
			LEFT JOIN cmx_inicio_ruta iru ON pla.id=iru.id_estudio_seguridad
			WHERE lg.fecha BETWEEN '".$fi."' AND '".$ff."';";

			$result = $Data->getConsulta($sql);
			$return["result"] = $result["rowsData"];
	break;

	case 'cargar_solicitudes_servicio2':
		$nestudio=$_POST["num_estudio"];
		$sql="SELECT a.id_servicio_cliente,
				b.devol_contenedor, 
				CONCAT(mu1.municipio,'-',mu1.depto) AS m1,
				CONCAT(mu2.municipio,'-',mu2.depto) AS m2
				FROM  cmx_preestudio_solicitudes_servicio a
				INNER JOIN cmx_solicitud_vehiculo2 b
				ON a.id_servicio_cliente=b.id
				LEFT JOIN cmx_detalle_mercancia2 c
				ON b.idpareja_origen_destino=c.id
				LEFT JOIN cmx_municipios mu1
				ON c.origen=mu1.rndc_codigo_ciudad
				LEFT JOIN cmx_municipios mu2
				ON c.destino=mu2.rndc_codigo_ciudad
				LEFT JOIN cmx_planilla_detalle1 ab
				ON a.id_servicio_cliente=ab.id_servicio
				WHERE a.id_solicitudpreestudio=".$nestudio."
				AND ab.id_servicio IS NULL";	
		$result = $Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
	break;

	

	case 'cargar_solicitudes_servicio':
			$nestudio=$_POST["n_estudio_user"];
		
			/*$sql="
				SELECT a.id_servicio_cliente, a.id_solicitudpreestudio, b.nombre_cliente, b.flete ,c.tipo_mercancia, 
				c.peso_bruto_kg, c.peso_neto_kg, c.peso_neto_tn,
				b.devol_contenedor
				FROM  cmx_preestudio_solicitudes_servicio a
				INNER JOIN cmx_solicitud_vehiculo2 b
				ON a.id_servicio_cliente=b.id
				LEFT JOIN cmx_detalle_mercancia2 c
				ON b.idpareja_origen_destino=c.id
				WHERE a.id_solicitudpreestudio=".$nestudio."";	*/

			$sql="SELECT a.id_servicio_cliente, a.id_solicitudpreestudio, 
			b.nombre_cliente, b.flete ,c.tipo_mercancia, 
				c.peso_bruto_kg, c.peso_neto_kg, c.peso_neto_tn,
				b.devol_contenedor, CONCAT(mu1.municipio,'-',mu1.depto) AS m1,
				CONCAT(mu2.municipio,'-',mu2.depto) AS m2
				FROM  cmx_preestudio_solicitudes_servicio a
				INNER JOIN cmx_solicitud_vehiculo2 b
				ON a.id_servicio_cliente=b.id
				LEFT JOIN cmx_detalle_mercancia2 c
				ON b.idpareja_origen_destino=c.id
				LEFT JOIN cmx_municipios mu1
				ON c.origen=mu1.rndc_codigo_ciudad
				LEFT JOIN cmx_municipios mu2
				ON c.destino=mu2.rndc_codigo_ciudad
				WHERE a.id_solicitudpreestudio=".$nestudio."";	

			$result = $Data->getConsulta($sql);
			$return["result"] = $result["rowsData"];
	break;

	case 'traer_tipo_precinto':
			$sql="SELECT * FROM cmx_para_tipo_precinto WHERE estado='Activo'";
			$result = $Data->getConsulta($sql);
			$return["result"] = $result["rowsData"];
	break;

	case 'cargar_datos_planilla':
			$numplanilla=$_POST["n_planilla"];
			$sql="SELECT p.*, CONCAT(mu1.municipio,'-',mu1.depto) AS origen, 
				CONCAT(mu2.municipio,'-',mu2.depto) AS destino, ve.nombre
				FROM cmx_planilla  p
				LEFT JOIN cmx_municipios  mu1
				ON p.origen_final=mu1.rndc_codigo_ciudad
				LEFT JOIN cmx_municipios mu2
				ON p.destino_final=mu2.rndc_codigo_ciudad
				LEFT JOIN cmx_para_tipo_vehiculo  ve
				ON p.tvehiculo_final=ve.id
				WHERE p.id=".$numplanilla."";

			$result = $Data->getConsulta($sql);
			if($result){

				$sql2="SELECT * FROM cmx_planilla_detalle1 
				WHERE id_planilla=".$numplanilla." ";
				$result2 = $Data->getConsulta($sql2);
				$return["result2"] = $result2["rowsData"];

				$sql3="SELECT * FROM cmx_planilla_detalle2 
				WHERE id_planilla=".$numplanilla." ";
				$result3 = $Data->getConsulta($sql3);
				$return["result3"] = $result3["rowsData"];
			}
			$return["result"] = $result["rowsData"];
	break;


	case 'ecargar_datos_planilla':
			$numplanilla=$_POST["n_planilla"];
			$sql="SELECT p.*, CONCAT(mu1.municipio,'-',mu1.depto) AS origen, 
				CONCAT(mu2.municipio,'-',mu2.depto) AS destino, ve.nombre
				FROM cmx_planilla  p
				LEFT JOIN cmx_municipios  mu1
				ON p.origen_final=mu1.rndc_codigo_ciudad
				LEFT JOIN cmx_municipios mu2
				ON p.destino_final=mu2.rndc_codigo_ciudad
				LEFT JOIN cmx_para_tipo_vehiculo  ve
				ON p.tvehiculo_final=ve.id
				WHERE p.id=".$numplanilla."";
			$result = $Data->getConsulta($sql);

			$sql1="SELECT * FROM cmx_municipios AS mu1";
			$resultSelect = $Data->getConsulta($sql1);

			$sql2="SELECT * FROM cmx_municipios AS mu2";
			$resultSelect2 = $Data->getConsulta($sql2);

			$sql3="SELECT * FROM cmx_para_tipo_vehiculo AS ve";
			$resultvehiculo = $Data->getConsulta($sql3);

			$tmpSelector = array();
			$destino= Array();
			$vehiculo= Array();

			foreach ($resultSelect["rowsData"] as $index => $element) {
				if(strcasecmp($element["rndc_codigo_ciudad"], $result["rowsData"][0]['origen_final'])==0){
					$tmpSelector[$index]['selected']=true;
				}else{
					$tmpSelector[$index]['selected']=false;
				}
				$tmpSelector[$index]['rndc_codigo_ciudad']=$element['rndc_codigo_ciudad'];
				$tmpSelector[$index]['municipio']= $element['municipio'];
				$tmpSelector[$index]['depto']= $element['depto'];
			}
			$result["rowsData"][0]['origen_final'] = $tmpSelector;

			foreach ($resultSelect2["rowsData"] as $index => $element2) {
				if(strcasecmp($element2["rndc_codigo_ciudad"], $result["rowsData"][0]['destino_final'])==0){
					$destino[$index]['selected']=true;
				}else{
					$destino[$index]['selected']=false;
				}
				$destino[$index]['rndc_codigo_ciudad']=$element2['rndc_codigo_ciudad'];
				$destino[$index]['municipio']= $element2['municipio'];
				$destino[$index]['depto']= $element2['depto'];
			}
			$result["rowsData"][0]['destino_final'] = $destino;

			foreach ($resultvehiculo["rowsData"] as $index => $element3) {
				if(strcasecmp($element3["id"], $result["rowsData"][0]['tvehiculo_final'])==0){
					$vehiculo[$index]['selected']= true;
				}else{
					$vehiculo[$index]['selected'] = false;
				}
				$vehiculo[$index]['id_vehiculo']= $element3['id'];
				$vehiculo[$index]['vehiculo'] = $element3['nombre'];
			}
			$result["rowsData"][0]['tvehiculo_final'] = $vehiculo;

			if($result){

				$sql2="SELECT * FROM cmx_planilla_detalle1 
				WHERE id_planilla=".$numplanilla." ";
				$result2 = $Data->getConsulta($sql2);
				$return["result2"] = $result2["rowsData"];

				$sql3="SELECT * FROM cmx_planilla_detalle2 
				WHERE id_planilla=".$numplanilla." ";
				$result3 = $Data->getConsulta($sql3);
				$return["result3"] = $result3["rowsData"];
			}
			$return["result"] = $result["rowsData"];
	break;


	case 'cargar_od_final':
		$sql="SELECT * FROM cmx_municipios WHERE pais='COLOMBIA'
			ORDER BY depto ASC";	
		$result = $Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
	break;

	case 'tipo_vehiculo':
		$sql="SELECT * FROM cmx_para_tipo_vehiculo WHERE estado='Activo'";	
		$result = $Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
	break;

	case 'cargar_flete':
		$origen=$_POST["origen"];
		$destino=$_POST["destino"];
		$vehiculo=$_POST["vhiculo"];
		$sql=" SELECT * FROM cmx_fletes_nacional 
			WHERE origen=".$origen." 
			AND destino=".$destino." 
			AND tipo_vehiculo=".$vehiculo."";	
		$result = $Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
	break;

	case 'recalcular_anticipo':
		$ori=$_POST["ori"];
		$des=$_POST["des"];
		$car=$_POST["car"];

		$sql=" SELECT * FROM cmx_fletes_nacional 
			WHERE origen=".$ori." 
			AND destino=".$des." 
			AND tipo_vehiculo=".$car."";
		$result = $Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
	break;

	case 'eliminar_asociacion':
		$codigo=$_POST["codigo"];
		$sql="DELETE FROM cmx_planilla_detalle1 
			WHERE id=".$codigo."";
		$result = $Data->ejecuteRegistro($sql);
		$return["result"] = $result["rowsData"];
	break;

	case 'eliminar_precinto':
		$codig=$_POST["codig"];
		$sql="DELETE FROM cmx_planilla_detalle2 
			WHERE id=".$codig."";
		$result = $Data->ejecuteRegistro($sql);
		$return["result"] = $result["rowsData"];
	break;

	case 'consultar_solicitud_ruta':
		$nruta=$_POST["nruta"];
		$sql="SELECT * FROM cmx_solicitar_inicio_ruta
				WHERE id=".$nruta."";
		$result = $Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
	break;

	case 'actualizar_soliruta':
		$idruta=$_POST["idruta"];
		$estado=$_POST["estado"];
		$ob=$_POST["ob"];

		$sql="UPDATE cmx_solicitar_inicio_ruta
			SET estado='".$estado."',
				observacion='".$ob."'
			WHERE id=".$idruta."";
		$result = $Data->ejecuteRegistro($sql);
		$return["result"] = $result["rowsData"];
	break;

	case 'cod_planilla':
		$idstudy=$_POST["idstudy"];
		$sql="SELECT max(id)+1 AS idplanilla
			FROM cmx_planilla
			WHERE id_estudio=".$idstudy;
		$result = $Data->ejecuteRegistro($sql);
		$return["result"] = $result["rowsData"];	
	break;


	default:
	break;
}

$return["result"] = $result["rowsData"];
echo json_encode($return);
?>