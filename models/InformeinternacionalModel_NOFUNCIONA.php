<?php
session_start();
class InformeinternacionalModel extends Model
{

	public function __construct(){
			parent::__construct();
	}

	/*public function getPruebas(){
		$sql="";
		$result = $this->_db->getConsulta($sql);
		return $result;
	}*/

	public function GeneralInternacional($filtro,$nota,$fec2,$dato3,$filtop1){
		$resultado= $this->_db2->conectar();
		try {

			if($filtop1==1){//DETALLE
				if($filtro==1){
					$sqlint="SELECT  pr.numero_importacion AS 'do', cl.nombre, coti.id, fac.num_factura,fac.valor AS valor_factura,
					pro.nombre AS proveedor,coti.id_proveedor, fac.id_proveedor,pr.estado,
					mo.nom_moneda,  eg.numero_egreso, eg.valor AS valor_egreso,
					of.valor AS valor_cliente, monf.nom_moneda AS monedaoferta,
					facl.total AS valor_factura_cliente, facl.num_factura AS num_fac_cliente,
					 moncot.nom_moneda AS moneda_cotizacion, 
					 coti.valor AS total_cotizacion
					 FROM cmx_importacion_proyecto  pr
					 INNER JOIN cmx_clientes cl
					 ON pr.id_cliente=cl.id
					INNER JOIN cmx_importacion_actividades a
					 ON pr.id=a.id_importacion AND a.tipo_actividad='intr_cotizacion'
					 AND a.estado=1 
					INNER JOIN cmx_importacion_actividades a2
					 ON pr.id=a2.id_importacion AND a2.tipo_actividad='intr_oferta_comercial'
					 AND a2.estado=1 
					 INNER JOIN cmx_intr_solicitudes so
					 ON pr.id=so.id_proyecto
					LEFT JOIN cmx_intr_oferta_comercial of
					ON so.id=of.id_intr_proyecto
					LEFT JOIN cmx_monedas monf
					ON of.id_moneda=monf.id
					LEFT JOIN cmx_intr_cotizaciones coti
					ON so.id=coti.id_intr_proyecto 	AND coti.estado=1
					LEFT JOIN cmx_monedas moncot ON coti.id_moneda=moncot.id
					LEFT JOIN cmx_intr_facturas fac
					ON coti.id_factura=fac.id
					LEFT JOIN cmx_proveedores pro
					ON fac.id_proveedor=pro.id
					LEFT JOIN cmx_monedas mo
					ON fac.id_moneda=mo.id
					LEFT JOIN cmx_intr_egresos eg
					ON fac.id_egreso=eg.id
					LEFT JOIN cmx_intr_factura_cliente facl
					ON so.id_factura=facl.id
					WHERE pr.id_cliente=".$nota."
					 AND so.do IS NOT NULL 
					 AND pr.estado=1
					GROUP BY pro.nombre, so.do 
					ORDER BY so.do";

					/*$sqlint="SELECT so.do, cl.nombre, of.valor AS valor_cliente,
					facl.num_factura AS factura_venta, facl.total AS valor_facturado,
					coti.valor as valor_cotizacion, pro.nombre AS proveedor_coti,
					fac.num_factura, fac.valor AS valor_factura,
					mo.codigo,eg.numero_egreso, eg.valor AS valor_egreso, mon.nom_moneda
					 FROM cmx_importacion_proyecto  pr
					 INNER JOIN cmx_clientes cl
					 ON pr.id_cliente=cl.id
					INNER JOIN cmx_importacion_actividades a
					 ON pr.id=a.id_importacion AND a.tipo_actividad='intr_cotizacion'
					 AND a.estado=1 
					INNER JOIN cmx_importacion_actividades a2
					 ON pr.id=a2.id_importacion AND a2.tipo_actividad='intr_oferta_comercial'
					 AND a2.estado=1 
					 INNER JOIN cmx_intr_solicitudes so
					 ON pr.id=so.id_proyecto
					LEFT JOIN cmx_intr_oferta_comercial of
					ON so.id=of.id_intr_proyecto
					LEFT JOIN cmx_monedas mon
					ON of.id_moneda=mon.id
					LEFT JOIN cmx_intr_cotizaciones coti
					ON so.id=coti.id_intr_proyecto
					LEFT JOIN cmx_proveedores pro
					ON coti.id_proveedor=pro.id
					LEFT JOIN cmx_intr_facturas fac
					ON coti.id_factura=fac.id
					LEFT JOIN cmx_monedas mo
					ON fac.id_moneda=mo.id
					LEFT JOIN cmx_intr_egresos eg
					ON fac.id_egreso=eg.id
					LEFT JOIN cmx_intr_factura_cliente facl
					ON so.id_factura=facl.id
					WHERE pr.id_cliente=".$nota."
					 AND so.do IS NOT NULL 
					 AND pr.estado=1
					GROUP BY pro.nombre, so.do 
					ORDER BY so.do";*/
				}

				if($filtro==2){
					$hoy=date('Y-m-d');
					$sqlint="SELECT 
						pr.numero_importacion AS 'do', cl.nombre,coti.id,fac.num_factura, 
						fac.valor AS valor_factura,pro.nombre AS proveedor,
						coti.id_proveedor,fac.id_proveedor,pr.estado, mon.nom_moneda,
						eg.numero_egreso, eg.valor AS valor_egreso,of.valor AS valor_cliente,
						monf.nom_moneda AS monedaoferta, facl.total AS valor_factura_cliente,
						facl.num_factura AS num_fac_cliente,moncot.nom_moneda AS moneda_cotizacion,
						coti.valor AS total_cotizacion,
						FROM_UNIXTIME(pr.numero_importacion,'%Y-%m-%d')AS 'fecha_parcial'
					 FROM cmx_importacion_proyecto  pr
					 INNER JOIN cmx_clientes cl
					 ON pr.id_cliente=cl.id
					 INNER JOIN cmx_importacion_actividades a
					 ON pr.id=a.id_importacion AND a.tipo_actividad='intr_cotizacion'
					 AND a.estado=1 
					INNER JOIN cmx_importacion_actividades a2
					 ON pr.id=a2.id_importacion AND a2.tipo_actividad='intr_oferta_comercial'
					 AND a2.estado=1 
					INNER JOIN cmx_intr_solicitudes so
					 ON pr.id=so.id_proyecto
					LEFT JOIN cmx_intr_oferta_comercial of
					ON so.id=of.id_intr_proyecto 
					LEFT JOIN cmx_monedas monf
					ON of.id_moneda=monf.id 
					LEFT JOIN cmx_intr_cotizaciones coti
					ON so.id=coti.id_intr_proyecto AND coti.estado=1
					LEFT JOIN cmx_monedas moncot 
					ON coti.id_moneda=moncot.id
					LEFT JOIN cmx_intr_facturas fac
					ON coti.id_factura=fac.id
					LEFT JOIN cmx_proveedores pro
					ON fac.id_proveedor=pro.id
					LEFT JOIN cmx_monedas mon
					ON fac.id_moneda=mon.id
					LEFT JOIN cmx_intr_egresos eg
					ON fac.id_egreso=eg.id
					LEFT JOIN cmx_intr_factura_cliente facl
					ON so.id_factura=facl.id 	
					WHERE 
					so.do IS NOT NULL
					AND pr.estado=1
					GROUP BY pro.nombre, so.do
					HAVING fecha_parcial  
					BETWEEN '".$nota."' AND '".$fec2."' 
					ORDER BY so.do";

					/*$sqlint="SELECT so.do, cl.nombre, of.valor AS valor_cliente,
					facl.num_factura AS factura_venta, facl.total AS valor_facturado,
					coti.valor as valor_cotizacion, pro.nombre AS proveedor_coti,
					fac.num_factura, fac.valor AS valor_factura,
					mo.codigo,eg.numero_egreso, eg.valor AS valor_egreso,
					FROM_UNIXTIME(pr.numero_importacion,'%Y-%m-%d')AS 'fecha_parcial'
					 FROM cmx_importacion_proyecto  pr
					 INNER JOIN cmx_clientes cl
					 ON pr.id_cliente=cl.id
					 INNER JOIN cmx_intr_solicitudes so
					 ON pr.id=so.id_proyecto
					LEFT JOIN cmx_intr_oferta_comercial of
					ON so.id=of.id_intr_proyecto
					LEFT JOIN cmx_intr_cotizaciones coti
					ON so.id=coti.id_intr_proyecto
					LEFT JOIN cmx_proveedores pro
					ON coti.id_proveedor=pro.id
					LEFT JOIN cmx_intr_facturas fac
					ON coti.id_factura=fac.id
					LEFT JOIN cmx_monedas mo
					ON fac.id_moneda=mo.id
					LEFT JOIN cmx_intr_egresos eg
					ON fac.id_egreso=eg.id
					LEFT JOIN cmx_intr_factura_cliente facl
					ON so.id_factura=facl.id 	
					HAVING fecha_parcial BETWEEN '".$nota."' AND '".$fec2."'";*/
				}	

				if($filtro==3){
					$sqlint="	SELECT 
					pr.numero_importacion AS 'do', cl.nombre, coti.id,
					fac.num_factura,fac.valor AS valor_factura,
					pro.nombre AS proveedor, coti.id_proveedor, fac.id_proveedor,
					pr.estado, mon.nom_moneda,eg.numero_egreso, eg.valor AS valor_egreso,
					of.valor AS valor_cliente, monf.nom_moneda AS monedaoferta,
					facl.total AS valor_factura_cliente, facl.num_factura AS num_fac_cliente,
					moncot.nom_moneda AS moneda_cotizacion,
					coti.valor AS total_cotizacion
					 FROM cmx_importacion_proyecto  pr
					 INNER JOIN cmx_clientes cl
					 ON pr.id_cliente=cl.id
					 INNER JOIN cmx_importacion_actividades a
					 ON pr.id=a.id_importacion AND a.tipo_actividad='intr_cotizacion'
					 AND a.estado=1 
					INNER JOIN cmx_importacion_actividades a2
					 ON pr.id=a2.id_importacion AND a2.tipo_actividad='intr_oferta_comercial'
					 AND a2.estado=1 
					 INNER JOIN cmx_intr_solicitudes so
					 ON pr.id=so.id_proyecto
					LEFT JOIN cmx_intr_oferta_comercial of
					ON so.id=of.id_intr_proyecto
					LEFT JOIN cmx_monedas monf
					ON of.id_moneda=monf.id
					LEFT JOIN cmx_intr_cotizaciones coti
					ON so.id=coti.id_intr_proyecto AND coti.estado=1
					LEFT JOIN cmx_monedas moncot ON coti.id_moneda=moncot.id
					LEFT JOIN cmx_intr_facturas fac
					ON coti.id_factura=fac.id
					LEFT JOIN cmx_proveedores pro
					ON fac.id_proveedor=pro.id
					LEFT JOIN cmx_monedas mon
					ON fac.id_moneda=mon.id
					LEFT JOIN cmx_intr_egresos eg
					ON fac.id_egreso=eg.id
					LEFT JOIN cmx_intr_factura_cliente facl
					ON so.id_factura=facl.id
					WHERE pr.numero_importacion=".$nota."
					 AND so.do IS NOT NULL 
					 AND pr.estado=1
					GROUP BY pro.nombre, so.do ORDER BY so.do";

					/*$sqlint="SELECT so.do, cl.nombre, of.valor AS valor_cliente,
					facl.num_factura AS factura_venta, facl.total AS valor_facturado,
					coti.valor as valor_cotizacion, pro.nombre AS proveedor_coti,
					fac.num_factura, fac.valor AS valor_factura,
					mo.codigo,eg.numero_egreso, eg.valor AS valor_egreso
					 FROM cmx_importacion_proyecto  pr
					 INNER JOIN cmx_clientes cl
					 ON pr.id_cliente=cl.id
					 INNER JOIN cmx_intr_solicitudes so
					 ON pr.id=so.id_proyecto
					LEFT JOIN cmx_intr_oferta_comercial of
					ON so.id=of.id_intr_proyecto
					LEFT JOIN cmx_intr_cotizaciones coti
					ON so.id=coti.id_intr_proyecto
					LEFT JOIN cmx_proveedores pro
					ON coti.id_proveedor=pro.id
					LEFT JOIN cmx_intr_facturas fac
					ON coti.id_factura=fac.id
					LEFT JOIN cmx_monedas mo
					ON fac.id_moneda=mo.id
					LEFT JOIN cmx_intr_egresos eg
					ON fac.id_egreso=eg.id
					LEFT JOIN cmx_intr_factura_cliente facl
					ON so.id_factura=facl.id
					WHERE pr.numero_importacion=".$nota;*/
				}

				if($filtro==4){
					/*echo 'F'.$filtro; echo 'DQ1'.$nota;
					echo 'dq2'.$fec2; echo 'DQ3'.$dato3;*/
					$hora=date('H:i:s');

					$sqlint="SELECT cip.numero_importacion AS 'do', cc.nombre, coti.id, fac.num_factura, fac.valor AS valor_factura, pro.nombre AS proveedor, coti.id_proveedor, fac.id_proveedor, cip.estado, FROM_UNIXTIME(cip.numero_importacion,'%Y-%m-%d')AS 'fecha_parcial',
						mon.nom_moneda, eg.numero_egreso, eg.valor AS valor_egreso,
						of.valor AS valor_cliente, monf.nom_moneda AS monedaoferta,
						 facl.total AS valor_factura_cliente, 
						 facl.num_factura AS num_fac_cliente,
						 moncot.nom_moneda AS moneda_cotizacion,
						 coti.valor AS total_cotizacion
						 FROM cmx_importacion_proyecto cip 
						INNER JOIN cmx_importacion_actividades cia 
							ON cip.id=cia.id_importacion 
						INNER JOIN cmx_importacion_actividades a
					 		ON cip.id=a.id_importacion AND a.tipo_actividad='intr_cotizacion'
							 AND a.estado=1 
						INNER JOIN cmx_importacion_actividades a2
					 		ON cip.id=a2.id_importacion 
							AND a2.tipo_actividad='intr_oferta_comercial'
					 		AND a2.estado=1 
						LEFT JOIN cmx_intr_solicitudes so ON cip.id = so.id_proyecto 
						LEFT JOIN cmx_clientes cc ON cip.id_cliente=cc.id 
						
						LEFT JOIN cmx_intr_oferta_comercial of ON so.id=of.id_intr_proyecto
						LEFT JOIN cmx_monedas monf ON of.id_moneda=monf.id
						
						LEFT JOIN cmx_intr_cotizaciones coti ON so.id=coti.id_intr_proyecto AND coti.estado=1
						LEFT JOIN cmx_monedas moncot ON coti.id_moneda=moncot.id
						LEFT JOIN cmx_intr_facturas fac ON coti.id_factura=fac.id 
						LEFT JOIN cmx_monedas mon ON fac.id_moneda=mon.id
						LEFT JOIN cmx_proveedores pro ON fac.id_proveedor=pro.id
						LEFT JOIN cmx_intr_egresos eg ON fac.id_egreso=eg.id
						LEFT JOIN cmx_intr_factura_cliente facl ON so.id_factura=facl.id 
						WHERE 
						 cia.tipo_actividad = 'intr_sube_facturas' 
						 AND cip.id_cliente=".$dato3."
						 AND so.do IS NOT NULL 
					 	 AND cip.estado=1
						 GROUP BY pro.nombre , so.do
						 HAVING fecha_parcial     
						BETWEEN '".$nota."' AND '".$fec2."'   
						ORDER BY so.do";

					/*$sqlint="SELECT cip.numero_importacion AS 'do', cc.nombre, coti.id, fac.num_factura, fac.valor AS valor_factura, pro.nombre AS proveedor, coti.id_proveedor, fac.id_proveedor, cip.estado, FROM_UNIXTIME(cip.numero_importacion,'%Y-%m-%d')AS 'fecha_parcial',
						mon.nom_moneda, eg.numero_egreso, eg.valor AS valor_egreso
						 FROM cmx_importacion_proyecto cip 
						INNER JOIN cmx_importacion_actividades cia 
							ON cip.id=cia.id_importacion 
						INNER JOIN cmx_importacion_actividades a
					 		ON cip.id=a.id_importacion AND a.tipo_actividad='intr_cotizacion'
							 AND a.estado=1 
						INNER JOIN cmx_importacion_actividades a2
					 		ON cip.id=a2.id_importacion 
							AND a2.tipo_actividad='intr_oferta_comercial'
					 		AND a2.estado=1 
						LEFT JOIN cmx_intr_solicitudes so ON cip.id = so.id_proyecto 
						LEFT JOIN cmx_clientes cc ON cip.id_cliente=cc.id 
						LEFT JOIN cmx_intr_cotizaciones coti ON so.id=coti.id_intr_proyecto 
						LEFT JOIN cmx_intr_facturas fac ON coti.id_factura=fac.id 
						LEFT JOIN cmx_monedas mon ON fac.id_moneda=mon.id
						LEFT JOIN cmx_proveedores pro ON fac.id_proveedor=pro.id
						LEFT JOIN cmx_intr_egresos eg ON fac.id_egreso=eg.id
						LEFT JOIN cmx_intr_factura_cliente facl ON so.id_factura=facl.id 
						WHERE 
						 cia.tipo_actividad = 'intr_sube_facturas' 
						 AND cip.id_cliente=".$dato3."
						 AND so.do IS NOT NULL 
					 	 AND cip.estado=1
						 GROUP BY pro.nombre , so.do
						 HAVING fecha_parcial   
						BETWEEN '".$nota."' AND '".$fec2."' 
						ORDER BY so.do";*/
				}
			}

			if($filtop1==2){//CONSOLIDADO
				if($filtro==1){
					$sqlint="SELECT  pr.numero_importacion AS 'do', cl.nombre, 
					facl.num_factura AS num_fac_cliente,
					IF( coti.id_moneda = 2,
					coti.valor,
					IF((	SELECT cmt1.valor
							FROM cmx_monedas_trm cmt1
							WHERE cmt1.id_moneda = coti.id_moneda
								AND coti.estado=1
								AND cmt1.fecha = coti.fecha_cotizacion),
						(	SELECT cmt1.valor
							FROM cmx_monedas_trm cmt1
							WHERE cmt1.id_moneda = coti.id_moneda
								AND cmt1.fecha = coti.fecha_cotizacion
								AND coti.estado=1
						) * coti.valor,
						NULL
					)
					) VALOR_PESOS_COT,
					IF ( coti.id_moneda = 1,
						coti.valor,
						IF ( coti.id_moneda = 2,
							IF ((	SELECT cmt1.valor
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = 1
										AND cmt1.fecha = coti.fecha_cotizacion),
								coti.valor / (
									SELECT cmt1.valor
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = 1
										AND cmt1.fecha = coti.fecha_cotizacion),
								NULL
							),
							IF((	SELECT cmt1.valor
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = coti.id_moneda
										AND cmt1.fecha = coti.fecha_cotizacion),
								((	SELECT cmt1.valor
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = coti.id_moneda
										AND cmt1.fecha = coti.fecha_cotizacion
								) * coti.valor
								) / (	SELECT cmt1.valor
										FROM cmx_monedas_trm cmt1
										WHERE cmt1.id_moneda = 1
											AND cmt1.fecha = coti.fecha_cotizacion),
								NULL
							)
						)
					) VALOR_USD_COT,
					
						  SUM(eg.valor) AS 'total_egreso',
						  
						CASE monf.nom_moneda WHEN 'Peso Colombiano' 
						 THEN SUM(of.valor) ELSE 0 END AS valor_COP_of,
						 	CASE monf.nom_moneda WHEN 'Dollar US' 
						 THEN SUM(of.valor) ELSE 0 END AS valor_US_of,
						 
						 CASE mo.nom_moneda WHEN 'Dollar US' 
						 THEN SUM(fac.valor) ELSE 0 END AS valor_US_prov,
						 CASE mo.nom_moneda WHEN 'Peso Colombiano' 
						 THEN SUM(fac.valor) ELSE 0 END AS valor_COP_prov,
						 
						 SUM(facl.total) AS 'total_factura_cliente'
						 
						 FROM cmx_importacion_proyecto  pr
						 INNER JOIN cmx_clientes cl
						 ON pr.id_cliente=cl.id
						INNER JOIN cmx_importacion_actividades a
						 ON pr.id=a.id_importacion AND a.tipo_actividad='intr_cotizacion'
						 AND a.estado=1 
						INNER JOIN cmx_importacion_actividades a2
						 ON pr.id=a2.id_importacion 
						 AND a2.tipo_actividad='intr_oferta_comercial'
						 AND a2.estado=1 
						 INNER JOIN cmx_intr_solicitudes so
						 ON pr.id=so.id_proyecto
						LEFT JOIN cmx_intr_oferta_comercial of
						ON so.id=of.id_intr_proyecto
						LEFT JOIN cmx_monedas monf
						ON of.id_moneda=monf.id
						LEFT JOIN cmx_intr_cotizaciones coti
						ON so.id=coti.id_intr_proyecto 	AND coti.estado=1
						LEFT JOIN cmx_monedas moncot ON coti.id_moneda=moncot.id
						LEFT JOIN cmx_intr_facturas fac
						ON coti.id_factura=fac.id
						LEFT JOIN cmx_proveedores pro
						ON fac.id_proveedor=pro.id
						LEFT JOIN cmx_monedas mo
						ON fac.id_moneda=mo.id
						LEFT JOIN cmx_intr_egresos eg
						ON fac.id_egreso=eg.id
						LEFT JOIN cmx_intr_factura_cliente facl
						ON so.id_factura=facl.id
						WHERE pr.id_cliente=".$nota."
						 AND so.do IS NOT NULL 
						 AND pr.estado=1
						GROUP BY  pr.numero_importacion, cl.nombre, num_fac_cliente";

					/*
					$sqlint="SELECT  pr.numero_importacion AS 'do', cl.nombre, coti.id, fac.num_factura,fac.valor AS valor_factura,
					pro.nombre AS proveedor,coti.id_proveedor, fac.id_proveedor,pr.estado,
					mo.nom_moneda,  eg.numero_egreso, eg.valor AS valor_egreso,
					of.valor AS valor_cliente, monf.nom_moneda AS monedaoferta,
					facl.total AS valor_factura_cliente, facl.num_factura AS num_fac_cliente,
					 moncot.nom_moneda AS moneda_cotizacion, 
					 SUM(coti.valor) AS total_cotizacion
					 FROM cmx_importacion_proyecto  pr
					 INNER JOIN cmx_clientes cl
					 ON pr.id_cliente=cl.id
					INNER JOIN cmx_importacion_actividades a
					 ON pr.id=a.id_importacion AND a.tipo_actividad='intr_cotizacion'
					 AND a.estado=1 
					INNER JOIN cmx_importacion_actividades a2
					 ON pr.id=a2.id_importacion AND a2.tipo_actividad='intr_oferta_comercial'
					 AND a2.estado=1 
					 INNER JOIN cmx_intr_solicitudes so
					 ON pr.id=so.id_proyecto
					LEFT JOIN cmx_intr_oferta_comercial of
					ON so.id=of.id_intr_proyecto
					LEFT JOIN cmx_monedas monf
					ON of.id_moneda=monf.id
					LEFT JOIN cmx_intr_cotizaciones coti
					ON so.id=coti.id_intr_proyecto 	AND coti.estado=1
					LEFT JOIN cmx_monedas moncot ON coti.id_moneda=moncot.id
					LEFT JOIN cmx_intr_facturas fac
					ON coti.id_factura=fac.id
					LEFT JOIN cmx_proveedores pro
					ON fac.id_proveedor=pro.id
					LEFT JOIN cmx_monedas mo
					ON fac.id_moneda=mo.id
					LEFT JOIN cmx_intr_egresos eg
					ON fac.id_egreso=eg.id
					LEFT JOIN cmx_intr_factura_cliente facl
					ON so.id_factura=facl.id
					WHERE pr.id_cliente=".$nota."
					 AND so.do IS NOT NULL 
					 AND pr.estado=1
					GROUP BY pro.nombre, so.do 
					ORDER BY so.do";*/
				}

				if($filtro==2){
					$hoy=date('Y-m-d');
					$sqlint="SELECT 
						pr.numero_importacion AS 'do', cl.nombre, 
						facl.num_factura AS num_fac_cliente,
							IF( coti.id_moneda = 2,
						coti.valor,
						IF((	SELECT cmt1.valor
								FROM cmx_monedas_trm cmt1
								WHERE cmt1.id_moneda = coti.id_moneda
									AND coti.estado=1
									AND cmt1.fecha = coti.fecha_cotizacion),
							(	SELECT cmt1.valor
								FROM cmx_monedas_trm cmt1
								WHERE cmt1.id_moneda = coti.id_moneda
									AND cmt1.fecha = coti.fecha_cotizacion
									AND coti.estado=1
							) * coti.valor,
							NULL
						)
					) VALOR_PESOS_COT,
						IF ( coti.id_moneda = 1,
						coti.valor,
						IF ( coti.id_moneda = 2,
							IF ((	SELECT cmt1.valor
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = 1
										AND cmt1.fecha = coti.fecha_cotizacion),
								coti.valor / (
									SELECT cmt1.valor
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = 1
										AND cmt1.fecha = coti.fecha_cotizacion),
								NULL
							),
							IF((	SELECT cmt1.valor
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = coti.id_moneda
										AND cmt1.fecha = coti.fecha_cotizacion),
								((	SELECT cmt1.valor
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = coti.id_moneda
										AND cmt1.fecha = coti.fecha_cotizacion
								) * coti.valor
								) / (	SELECT cmt1.valor
										FROM cmx_monedas_trm cmt1
										WHERE cmt1.id_moneda = 1
											AND cmt1.fecha = coti.fecha_cotizacion),
								NULL
							)
						)
					) VALOR_USD_COT,
					SUM(eg.valor) AS 'total_egreso',
						CASE monf.nom_moneda WHEN 'Peso Colombiano' 
						 THEN SUM(of.valor) ELSE 0 END AS valor_COP_of,
						CASE monf.nom_moneda WHEN 'Dollar US' 
						 THEN SUM(of.valor) ELSE 0 END AS valor_US_of,
						 CASE mo.nom_moneda WHEN 'Dollar US' 
						 THEN SUM(fac.valor) ELSE 0 END AS valor_US_prov,
						 CASE mo.nom_moneda WHEN 'Peso Colombiano' 
						 THEN SUM(fac.valor) ELSE 0 END AS valor_COP_prov,
						 SUM(facl.total) AS 'total_factura_cliente',
						FROM_UNIXTIME(pr.numero_importacion,'%Y-%m-%d')AS 'fecha_parcial'
						 FROM cmx_importacion_proyecto  pr
						 INNER JOIN cmx_clientes cl
						 ON pr.id_cliente=cl.id
						 INNER JOIN cmx_importacion_actividades a
						 ON pr.id=a.id_importacion AND a.tipo_actividad='intr_cotizacion'
						 AND a.estado=1 
						INNER JOIN cmx_importacion_actividades a2
						 ON pr.id=a2.id_importacion AND a2.tipo_actividad='intr_oferta_comercial'
						 AND a2.estado=1 
						INNER JOIN cmx_intr_solicitudes so
						 ON pr.id=so.id_proyecto
						LEFT JOIN cmx_intr_oferta_comercial of
						ON so.id=of.id_intr_proyecto 
						LEFT JOIN cmx_monedas monf
						ON of.id_moneda=monf.id 
						LEFT JOIN cmx_intr_cotizaciones coti
						ON so.id=coti.id_intr_proyecto AND coti.estado=1
						LEFT JOIN cmx_monedas moncot 
						ON coti.id_moneda=moncot.id
						LEFT JOIN cmx_intr_facturas fac
						ON coti.id_factura=fac.id
						LEFT JOIN cmx_proveedores pro
						ON fac.id_proveedor=pro.id
						LEFT JOIN cmx_monedas mo
						ON fac.id_moneda=mo.id
						LEFT JOIN cmx_intr_egresos eg
						ON fac.id_egreso=eg.id
						LEFT JOIN cmx_intr_factura_cliente facl
						ON so.id_factura=facl.id 	
						WHERE 
						so.do IS NOT NULL
						AND pr.estado=1
						GROUP BY pro.nombre, so.do
						HAVING fecha_parcial  
						BETWEEN '".$nota."' AND '".$fec2."' 
						ORDER BY so.do";

					/*$sqlint="SELECT so.do, cl.nombre, of.valor AS valor_cliente,
					facl.num_factura AS factura_venta, facl.total AS valor_facturado,
					coti.valor as valor_cotizacion, pro.nombre AS proveedor_coti,
					fac.num_factura, fac.valor AS valor_factura,
					mo.codigo,eg.numero_egreso, eg.valor AS valor_egreso,
					FROM_UNIXTIME(pr.numero_importacion,'%Y-%m-%d')AS 'fecha_parcial'
					 FROM cmx_importacion_proyecto  pr
					 INNER JOIN cmx_clientes cl
					 ON pr.id_cliente=cl.id
					 INNER JOIN cmx_intr_solicitudes so
					 ON pr.id=so.id_proyecto
					LEFT JOIN cmx_intr_oferta_comercial of
					ON so.id=of.id_intr_proyecto
					LEFT JOIN cmx_intr_cotizaciones coti
					ON so.id=coti.id_intr_proyecto
					LEFT JOIN cmx_proveedores pro
					ON coti.id_proveedor=pro.id
					LEFT JOIN cmx_intr_facturas fac
					ON coti.id_factura=fac.id
					LEFT JOIN cmx_monedas mo
					ON fac.id_moneda=mo.id
					LEFT JOIN cmx_intr_egresos eg
					ON fac.id_egreso=eg.id
					LEFT JOIN cmx_intr_factura_cliente facl
					ON so.id_factura=facl.id 	
					HAVING fecha_parcial BETWEEN '".$nota."' AND '".$fec2."'";*/
				}	

				if($filtro==3){
					$sqlint="SELECT  pr.numero_importacion AS 'do', cl.nombre,  
						facl.num_factura AS num_fac_cliente,
						IF( coti.id_moneda = 2,
						coti.valor,
						IF((	SELECT cmt1.valor
								FROM cmx_monedas_trm cmt1
								WHERE cmt1.id_moneda = coti.id_moneda
									AND coti.estado=1
									AND cmt1.fecha = coti.fecha_cotizacion),
							(	SELECT cmt1.valor
								FROM cmx_monedas_trm cmt1
								WHERE cmt1.id_moneda = coti.id_moneda
									AND cmt1.fecha = coti.fecha_cotizacion
									AND coti.estado=1
							) * coti.valor,
							NULL
						)
					) VALOR_PESOS_COT,
						IF ( coti.id_moneda = 1,
						coti.valor,
						IF ( coti.id_moneda = 2,
							IF ((	SELECT cmt1.valor
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = 1
										AND cmt1.fecha = coti.fecha_cotizacion),
								coti.valor / (
									SELECT cmt1.valor
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = 1
										AND cmt1.fecha = coti.fecha_cotizacion),
								NULL
							),
							IF((	SELECT cmt1.valor
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = coti.id_moneda
										AND cmt1.fecha = coti.fecha_cotizacion),
								((	SELECT cmt1.valor
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = coti.id_moneda
										AND cmt1.fecha = coti.fecha_cotizacion
								) * coti.valor
								) / (	SELECT cmt1.valor
										FROM cmx_monedas_trm cmt1
										WHERE cmt1.id_moneda = 1
											AND cmt1.fecha = coti.fecha_cotizacion),
								NULL
							)
						)
					) VALOR_USD_COT,
					 SUM(eg.valor) AS 'total_egreso',
					 	CASE monf.nom_moneda WHEN 'Peso Colombiano' 
						 THEN SUM(of.valor) ELSE 0 END AS valor_COP_of,
						 	CASE monf.nom_moneda WHEN 'Dollar US' 
						 THEN SUM(of.valor) ELSE 0 END AS valor_US_of,
						 CASE mo.nom_moneda WHEN 'Dollar US' 
						 THEN SUM(fac.valor) ELSE 0 END AS valor_US_prov,
						 CASE mo.nom_moneda WHEN 'Peso Colombiano' 
						 THEN SUM(fac.valor) ELSE 0 END AS valor_COP_prov,
						  SUM(facl.total) AS 'total_factura_cliente'
						 FROM cmx_importacion_proyecto  pr
						 INNER JOIN cmx_clientes cl
						 ON pr.id_cliente=cl.id
						 INNER JOIN cmx_importacion_actividades a
						 ON pr.id=a.id_importacion AND a.tipo_actividad='intr_cotizacion'
						 AND a.estado=1 
						INNER JOIN cmx_importacion_actividades a2
						 ON pr.id=a2.id_importacion AND a2.tipo_actividad='intr_oferta_comercial'
						 AND a2.estado=1 
						 INNER JOIN cmx_intr_solicitudes so
						 ON pr.id=so.id_proyecto
						LEFT JOIN cmx_intr_oferta_comercial of
						ON so.id=of.id_intr_proyecto
						LEFT JOIN cmx_monedas monf
						ON of.id_moneda=monf.id
						LEFT JOIN cmx_intr_cotizaciones coti
						ON so.id=coti.id_intr_proyecto AND coti.estado=1
						LEFT JOIN cmx_monedas moncot ON coti.id_moneda=moncot.id
						LEFT JOIN cmx_intr_facturas fac
						ON coti.id_factura=fac.id
						LEFT JOIN cmx_proveedores pro
						ON fac.id_proveedor=pro.id
						LEFT JOIN cmx_monedas mo
						ON fac.id_moneda=mo.id
						LEFT JOIN cmx_intr_egresos eg
						ON fac.id_egreso=eg.id
						LEFT JOIN cmx_intr_factura_cliente facl
						ON so.id_factura=facl.id
						WHERE pr.numero_importacion=".$nota."
						 AND so.do IS NOT NULL 
						 AND pr.estado=1
						GROUP BY pro.nombre, so.do ORDER BY so.do";

					/*$sqlint="SELECT so.do, cl.nombre, of.valor AS valor_cliente,
					facl.num_factura AS factura_venta, facl.total AS valor_facturado,
					coti.valor as valor_cotizacion, pro.nombre AS proveedor_coti,
					fac.num_factura, fac.valor AS valor_factura,
					mo.codigo,eg.numero_egreso, eg.valor AS valor_egreso
					 FROM cmx_importacion_proyecto  pr
					 INNER JOIN cmx_clientes cl
					 ON pr.id_cliente=cl.id
					 INNER JOIN cmx_intr_solicitudes so
					 ON pr.id=so.id_proyecto
					LEFT JOIN cmx_intr_oferta_comercial of
					ON so.id=of.id_intr_proyecto
					LEFT JOIN cmx_intr_cotizaciones coti
					ON so.id=coti.id_intr_proyecto
					LEFT JOIN cmx_proveedores pro
					ON coti.id_proveedor=pro.id
					LEFT JOIN cmx_intr_facturas fac
					ON coti.id_factura=fac.id
					LEFT JOIN cmx_monedas mo
					ON fac.id_moneda=mo.id
					LEFT JOIN cmx_intr_egresos eg
					ON fac.id_egreso=eg.id
					LEFT JOIN cmx_intr_factura_cliente facl
					ON so.id_factura=facl.id
					WHERE pr.numero_importacion=".$nota;*/
				}

				if($filtro==4){
					/*echo 'F'.$filtro; echo 'DQ1'.$nota;
					echo 'dq2'.$fec2; echo 'DQ3'.$dato3;*/
					$hora=date('H:i:s');

					$sqlint="SELECT  
					cip.numero_importacion AS 'do', cc.nombre, 
							facl.num_factura AS num_fac_cliente,
							IF( coti.id_moneda = 2,
							coti.valor,
							IF((	SELECT cmt1.valor
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = coti.id_moneda
										AND coti.estado=1
										AND cmt1.fecha = coti.fecha_cotizacion),
								(	SELECT cmt1.valor
									FROM cmx_monedas_trm cmt1
									WHERE cmt1.id_moneda = coti.id_moneda
										AND cmt1.fecha = coti.fecha_cotizacion
										AND coti.estado=1
								) * coti.valor,
								NULL
							)
						) VALOR_PESOS_COT,
							IF ( coti.id_moneda = 1,
							coti.valor,
							IF ( coti.id_moneda = 2,
								IF ((	SELECT cmt1.valor
										FROM cmx_monedas_trm cmt1
										WHERE cmt1.id_moneda = 1
											AND cmt1.fecha = coti.fecha_cotizacion),
									coti.valor / (
										SELECT cmt1.valor
										FROM cmx_monedas_trm cmt1
										WHERE cmt1.id_moneda = 1
											AND cmt1.fecha = coti.fecha_cotizacion),
									NULL
								),
								IF((	SELECT cmt1.valor
										FROM cmx_monedas_trm cmt1
										WHERE cmt1.id_moneda = coti.id_moneda
											AND cmt1.fecha = coti.fecha_cotizacion),
									((	SELECT cmt1.valor
										FROM cmx_monedas_trm cmt1
										WHERE cmt1.id_moneda = coti.id_moneda
											AND cmt1.fecha = coti.fecha_cotizacion
									) * coti.valor
									) / (	SELECT cmt1.valor
											FROM cmx_monedas_trm cmt1
											WHERE cmt1.id_moneda = 1
												AND cmt1.fecha = coti.fecha_cotizacion),
									NULL
								)
							)
						) VALOR_USD_COT,
						 SUM(eg.valor) AS 'total_egreso',
						 CASE monf.nom_moneda WHEN 'Peso Colombiano' 
							 THEN SUM(of.valor) ELSE 0 END AS valor_COP_of,
							 	CASE monf.nom_moneda WHEN 'Dollar US' 
							 THEN SUM(of.valor) ELSE 0 END AS valor_US_of,
							 
							 CASE mo.nom_moneda WHEN 'Dollar US' 
							 THEN SUM(fac.valor) ELSE 0 END AS valor_US_prov,
							 CASE mo.nom_moneda WHEN 'Peso Colombiano' 
							 THEN SUM(fac.valor) ELSE 0 END AS valor_COP_prov,
							 SUM(facl.total) AS 'total_factura_cliente',
						FROM_UNIXTIME(cip.numero_importacion,'%Y-%m-%d')AS 'fecha_parcial'
						 FROM cmx_importacion_proyecto cip 
						INNER JOIN cmx_importacion_actividades cia 
							ON cip.id=cia.id_importacion 
						INNER JOIN cmx_importacion_actividades a
					 		ON cip.id=a.id_importacion AND a.tipo_actividad='intr_cotizacion'
							 AND a.estado=1 
						INNER JOIN cmx_importacion_actividades a2
					 		ON cip.id=a2.id_importacion 
							AND a2.tipo_actividad='intr_oferta_comercial'
					 		AND a2.estado=1 
						LEFT JOIN cmx_intr_solicitudes so ON cip.id = so.id_proyecto 
						LEFT JOIN cmx_clientes cc ON cip.id_cliente=cc.id 
						
						LEFT JOIN cmx_intr_oferta_comercial of ON so.id=of.id_intr_proyecto
						LEFT JOIN cmx_monedas monf ON of.id_moneda=monf.id
						LEFT JOIN cmx_intr_cotizaciones coti 
						ON so.id=coti.id_intr_proyecto AND coti.estado=1
						LEFT JOIN cmx_monedas moncot ON coti.id_moneda=moncot.id
						LEFT JOIN cmx_intr_facturas fac ON coti.id_factura=fac.id 
						LEFT JOIN cmx_monedas mo ON fac.id_moneda=mo.id
						LEFT JOIN cmx_proveedores pro ON fac.id_proveedor=pro.id
						LEFT JOIN cmx_intr_egresos eg ON fac.id_egreso=eg.id
						LEFT JOIN cmx_intr_factura_cliente facl ON so.id_factura=facl.id 
						WHERE 
						 cia.tipo_actividad = 'intr_sube_facturas' 
						 AND cip.id_cliente=".$dato3."
						 AND so.do IS NOT NULL 
					 	 AND cip.estado=1
						 GROUP BY pro.nombre , so.do
						 HAVING fecha_parcial     
						BETWEEN '".$nota."' AND '".$fec2."'   
						ORDER BY so.do";

					/*$sqlint="SELECT cip.numero_importacion AS 'do', cc.nombre, coti.id, fac.num_factura, fac.valor AS valor_factura, pro.nombre AS proveedor, coti.id_proveedor, fac.id_proveedor, cip.estado, FROM_UNIXTIME(cip.numero_importacion,'%Y-%m-%d')AS 'fecha_parcial',
						mon.nom_moneda, eg.numero_egreso, eg.valor AS valor_egreso
						 FROM cmx_importacion_proyecto cip 
						INNER JOIN cmx_importacion_actividades cia 
							ON cip.id=cia.id_importacion 
						INNER JOIN cmx_importacion_actividades a
					 		ON cip.id=a.id_importacion AND a.tipo_actividad='intr_cotizacion'
							 AND a.estado=1 
						INNER JOIN cmx_importacion_actividades a2
					 		ON cip.id=a2.id_importacion 
							AND a2.tipo_actividad='intr_oferta_comercial'
					 		AND a2.estado=1 
						LEFT JOIN cmx_intr_solicitudes so ON cip.id = so.id_proyecto 
						LEFT JOIN cmx_clientes cc ON cip.id_cliente=cc.id 
						LEFT JOIN cmx_intr_cotizaciones coti ON so.id=coti.id_intr_proyecto 
						LEFT JOIN cmx_intr_facturas fac ON coti.id_factura=fac.id 
						LEFT JOIN cmx_monedas mon ON fac.id_moneda=mon.id
						LEFT JOIN cmx_proveedores pro ON fac.id_proveedor=pro.id
						LEFT JOIN cmx_intr_egresos eg ON fac.id_egreso=eg.id
						LEFT JOIN cmx_intr_factura_cliente facl ON so.id_factura=facl.id 
						WHERE 
						 cia.tipo_actividad = 'intr_sube_facturas' 
						 AND cip.id_cliente=".$dato3."
						 AND so.do IS NOT NULL 
					 	 AND cip.estado=1
						 GROUP BY pro.nombre , so.do
						 HAVING fecha_parcial   
						BETWEEN '".$nota."' AND '".$fec2."' 
						ORDER BY so.do";*/
				}

				
				//echo $sqlint;

			}
			//echo $sqlint;
			$resultado=$this->_db3->query($sqlint);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();	

		} catch (PDOException $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function GeneralSobrecosto($inicia,$fin){
		$resultado= $this->_db2->conectar();
		try {
			$sqls="SELECT so.do, cl.nombre,  pro.nombre as nomproveedor, coti.fecha_cotizacion,
			coti.sobrecosto,
			fac.num_factura, fac.valor, mo.codigo, of.valor AS valor_cliente,
			facl.num_factura, facl.total,
			FROM_UNIXTIME(pr.numero_importacion,'%Y-%m-%d')AS 'fecha_parcial'
			 FROM cmx_importacion_proyecto  pr
			 INNER JOIN cmx_clientes cl
			 ON pr.id_cliente=cl.id
			 INNER JOIN cmx_intr_solicitudes so
			 ON pr.id=so.id_proyecto
			LEFT JOIN cmx_intr_cotizaciones coti
			ON so.id=coti.id_intr_proyecto
			LEFT JOIN cmx_intr_facturas fac
			ON coti.id_factura=fac.id 
			 LEFT JOIN cmx_proveedores pro
			 ON fac.id_proveedor=pro.id
			LEFT JOIN cmx_monedas mo
			ON fac.id_moneda=mo.id
			LEFT JOIN cmx_intr_oferta_comercial of
			 ON so.id=of.id_intr_proyecto
			LEFT JOIN cmx_intr_factura_cliente facl
			ON so.id_factura=facl.id
			HAVING fecha_parcial BETWEEN '".$inicia."' AND '".$fin."'";
			/*$consults=$resultado->query($sqls);
			return $consults->fetchall();	*/

			$resultado=$this->_db3->query($sqls);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();	

		}catch (PDOException $e){
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function ConsultarCliente(){
		//$resultado= $this->_db2->conectar();
		try {
			$sqlc="SELECT id, documento, digito_verificacion, nombre 
			 FROM cmx_clientes WHERE estado=1
			 ORDER BY nombre ASC
			 ";
			$resultado=$this->_db3->query($sqlc);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();

		} catch (PDOException $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

}
?>