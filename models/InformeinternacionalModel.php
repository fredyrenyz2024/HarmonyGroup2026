<?php
session_start();
class InformeinternacionalModel extends Model
{

	public function __construct()
	{
		parent::__construct();
	}

	/*public function getPruebas(){
		$sql="";
		$result = $this->_db->getConsulta($sql);
		return $result;
	}*/

	public function GeneralInternacional($filtro, $nota, $fec2, $dato3, $filtop1)
	{
		$resultado = $this->_db2->conectar();
		try {

			if ($filtop1 == 1) { //DETALLE
				if ($filtro == 1) {
					$sqlint = "	SELECT 
					pr.numero_importacion AS 'do', cl.nombre AS cliente,
					pcot.nombre AS prove_coti,
					(SELECT  SUM(coti2.valor)
					 FROM cmx_intr_cotizaciones coti2
					 WHERE coti2.id_intr_proyecto=so.id
					 AND coti2.estado=1 
					 AND coti2.id_proveedor=coti.id_proveedor
					 AND coti2.id_concepto<>11
					 ) AS val_coti_prove,  moncot.nom_moneda AS moneda_coti,
					 pro.nombre AS prove_factu, 
						(SELECT  SUM(fac2.valor)
								FROM cmx_intr_facturas fac2
								WHERE fac2.id_intr_proyecto=so.id
								AND fac2.id_proveedor=fac.id_proveedor
								AND fac2.id NOT IN (
								SELECT  fac3.id
								FROM cmx_intr_facturas fac3
								inner JOIN cmx_intr_cotizaciones coti3
								ON fac3.id=coti3.id_factura
								WHERE coti3.id_intr_proyecto=so.id
								AND coti3.id_proveedor=fac.id_proveedor
								AND coti3.id_concepto=11
								)
							)AS val_factu_prove,
					 mon.nom_moneda AS moneda_factu,
					 of.valor AS valor_oferta, monf.nom_moneda AS monedaoferta,
					(SELECT  SUM(eg.valor)
					FROM cmx_intr_egresos eg
					INNER JOIN cmx_intr_facturas fact3
					ON eg.id=fact3.id_egreso
					WHERE fact3.id_intr_proyecto=so.id AND 
					fact3.id_proveedor=fac.id_proveedor
					AND eg.estado=1) AS valor_egreso,
					 facl.total AS valor_factura_cliente, 
					 facl.num_factura AS num_fac_cliente
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
					ON so.id=of.id_intr_proyecto AND of.estado=1
					LEFT JOIN cmx_monedas monf
					ON of.id_moneda=monf.id
					LEFT JOIN cmx_intr_cotizaciones coti
					ON so.id=coti.id_intr_proyecto AND coti.estado=1
					AND coti.id_concepto<>11
					LEFT JOIN cmx_proveedores pcot
					ON coti.id_proveedor=pcot.id
					LEFT JOIN cmx_monedas moncot ON coti.id_moneda=moncot.id
					LEFT JOIN cmx_intr_facturas fac
					ON coti.id_factura=fac.id 
					AND coti.id_proveedor=fac.id_proveedor
					LEFT JOIN cmx_proveedores pro
					ON fac.id_proveedor=pro.id
					LEFT JOIN cmx_monedas mon
					ON fac.id_moneda=mon.id
					LEFT JOIN cmx_intr_factura_cliente facl
					ON so.id_factura=facl.id
					WHERE pr.id_cliente=" . $nota . "
					 AND so.do IS NOT NULL 
					 AND pr.estado=1
					GROUP BY 
					 	pr.numero_importacion, cl.nombre,
					 	pcot.nombre, pro.nombre,
					 	moncot.nom_moneda, mon.nom_moneda,
					 	of.valor,monf.nom_moneda,
					 	facl.num_factura, facl.total
					ORDER BY so.do";
					/*$sqlint="SELECT  pr.numero_importacion AS 'do', cl.nombre, coti.id, fac.num_factura,fac.valor AS valor_factura,
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
					ORDER BY so.do"; */
				}

				if ($filtro == 2) {
					$hoy = date('Y-m-d');
					$sqlint = "SELECT 
					pr.numero_importacion AS 'do', cl.nombre AS cliente,
					pcot.nombre AS prove_coti,
					(SELECT  SUM(coti2.valor)
					 FROM cmx_intr_cotizaciones coti2
					 WHERE coti2.id_intr_proyecto=so.id
					 AND coti2.estado=1 
					 AND coti2.id_proveedor=coti.id_proveedor
					 AND coti2.id_concepto<>11
					 ) AS val_coti_prove,  moncot.nom_moneda AS moneda_coti,
					 pro.nombre AS prove_factu,
				 	(SELECT  SUM(fac2.valor)
								FROM cmx_intr_facturas fac2
								WHERE fac2.id_intr_proyecto=so.id
								AND fac2.id_proveedor=fac.id_proveedor
								AND fac2.id NOT IN (
								SELECT  fac3.id
								FROM cmx_intr_facturas fac3
								inner JOIN cmx_intr_cotizaciones coti3
								ON fac3.id=coti3.id_factura
								WHERE coti3.id_intr_proyecto=so.id
								AND coti3.id_proveedor=fac.id_proveedor
								AND coti3.id_concepto=11
								)
							)AS val_factu_prove,
					 mon.nom_moneda AS moneda_factu,
					 of.valor AS valor_oferta, monf.nom_moneda AS monedaoferta,
					(SELECT  SUM(eg.valor)
					FROM cmx_intr_egresos eg
					INNER JOIN cmx_intr_facturas fact3
					ON eg.id=fact3.id_egreso
					WHERE fact3.id_intr_proyecto=so.id AND 
					fact3.id_proveedor=fac.id_proveedor
					AND eg.estado=1) AS valor_egreso,
					 facl.total AS valor_factura_cliente, 
					 facl.num_factura AS num_fac_cliente,
					 FROM_UNIXTIME(pr.numero_importacion,'%Y-%m-%d')AS 'fecha_parcial'
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
					ON so.id=of.id_intr_proyecto AND of.estado=1
					LEFT JOIN cmx_monedas monf
					ON of.id_moneda=monf.id
					LEFT JOIN cmx_intr_cotizaciones coti
					ON so.id=coti.id_intr_proyecto AND coti.estado=1
					AND coti.id_concepto<>11
					LEFT JOIN cmx_proveedores pcot
					ON coti.id_proveedor=pcot.id
					LEFT JOIN cmx_monedas moncot ON coti.id_moneda=moncot.id
					LEFT JOIN cmx_intr_facturas fac
					ON coti.id_factura=fac.id 
					AND coti.id_proveedor=fac.id_proveedor
					LEFT JOIN cmx_proveedores pro
					ON fac.id_proveedor=pro.id
					LEFT JOIN cmx_monedas mon
					ON fac.id_moneda=mon.id
					LEFT JOIN cmx_intr_factura_cliente facl
					ON so.id_factura=facl.id
					WHERE 
					 so.do IS NOT NULL 
					 AND pr.estado=1
					 GROUP BY 
					 	pr.numero_importacion, cl.nombre,
					 	pcot.nombre, pro.nombre,
					 	moncot.nom_moneda, mon.nom_moneda,
					 	of.valor,monf.nom_moneda,
					 	facl.num_factura, facl.total
					HAVING fecha_parcial  
					BETWEEN '" . $nota . "' AND '" . $fec2 . "'    	
					ORDER BY so.do";

					/*$sqlint="SELECT 
						pr.numero_importacion AS 'do', cl.nombre,coti.id,fac.num_factura, 
						fac.valor AS valor_factura,pro.nombre AS proveedor,
						coti.id_proveedor,fac.id_proveedor,pr.estado, mon.nom_moneda,
						eg.numero_egreso, eg.valor AS valor_egreso,of.valor AS valor_cliente,
						monf.nom_moneda AS monedaoferta, facl.total AS valor_factura_cliente,
						facl.num_factura AS num_fac_cliente,moncot.nom_moneda AS moneda_cotizacion,
						SUM(coti.valor) AS total_cotizacion,
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
					ORDER BY so.do";*/
				}

				if ($filtro == 3) {
					$sqlint = "SELECT 
					pr.numero_importacion AS 'do', cl.nombre AS cliente,
					pcot.nombre AS prove_coti,
					(SELECT  SUM(coti2.valor)
					 FROM cmx_intr_cotizaciones coti2
					 WHERE coti2.id_intr_proyecto=so.id
					 AND coti2.estado=1 
					 AND coti2.id_proveedor=coti.id_proveedor
					 AND coti2.id_concepto<>11
					 ) AS val_coti_prove,  moncot.nom_moneda AS moneda_coti,
					 pro.nombre AS prove_factu, 
						(SELECT  SUM(fac2.valor)
								FROM cmx_intr_facturas fac2
								WHERE fac2.id_intr_proyecto=so.id
								AND fac2.id_proveedor=fac.id_proveedor
								AND fac2.id NOT IN (
								SELECT  fac3.id
								FROM cmx_intr_facturas fac3
								inner JOIN cmx_intr_cotizaciones coti3
								ON fac3.id=coti3.id_factura
								WHERE coti3.id_intr_proyecto=so.id
								AND coti3.id_proveedor=fac.id_proveedor
								AND coti3.id_concepto=11
								)
							)AS val_factu_prove,
						  mon.nom_moneda AS moneda_factu,
						 of.valor AS valor_oferta, monf.nom_moneda AS monedaoferta,
					(SELECT  SUM(eg.valor)
					FROM cmx_intr_egresos eg
					INNER JOIN cmx_intr_facturas fact3
					ON eg.id=fact3.id_egreso
					WHERE fact3.id_intr_proyecto=so.id AND 
					fact3.id_proveedor=fac.id_proveedor
					AND eg.estado=1) AS valor_egreso,
					 facl.total AS valor_factura_cliente, 
					 facl.num_factura AS num_fac_cliente
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
					ON so.id=of.id_intr_proyecto AND of.estado=1
					LEFT JOIN cmx_monedas monf
					ON of.id_moneda=monf.id
					LEFT JOIN cmx_intr_cotizaciones coti
					ON so.id=coti.id_intr_proyecto AND coti.estado=1
					AND coti.id_concepto<>11
					LEFT JOIN cmx_proveedores pcot
					ON coti.id_proveedor=pcot.id
					LEFT JOIN cmx_monedas moncot ON coti.id_moneda=moncot.id
					LEFT JOIN cmx_intr_facturas fac
					ON coti.id_factura=fac.id 
					AND coti.id_proveedor=fac.id_proveedor
					LEFT JOIN cmx_proveedores pro
					ON fac.id_proveedor=pro.id
					LEFT JOIN cmx_monedas mon
					ON fac.id_moneda=mon.id
					LEFT JOIN cmx_intr_factura_cliente facl
					ON so.id_factura=facl.id
					WHERE pr.numero_importacion=" . $nota . "
					AND so.do IS NOT NULL 
					AND pr.estado=1
					GROUP BY 
					 	pr.numero_importacion, cl.nombre,
					 	pcot.nombre, pro.nombre,
					 	moncot.nom_moneda, mon.nom_moneda,
					 	of.valor,monf.nom_moneda,
					 	facl.num_factura, facl.total
					ORDER BY so.do";

					/*
					$sqlint="	SELECT 
					pr.numero_importacion AS 'do', cl.nombre, coti.id,
					fac.num_factura,fac.valor AS valor_factura,
					pro.nombre AS proveedor, coti.id_proveedor, fac.id_proveedor,
					pr.estado, mon.nom_moneda,eg.numero_egreso, eg.valor AS valor_egreso,
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
					*/
				}

				if ($filtro == 4) {
					/*echo 'F'.$filtro; echo 'DQ1'.$nota;
					echo 'dq2'.$fec2; echo 'DQ3'.$dato3;*/
					$hora = date('H:i:s');

					$sqlint = "SELECT 
					pr.numero_importacion AS 'do', cl.nombre AS cliente,
					pcot.nombre AS prove_coti,
					(SELECT  SUM(coti2.valor)
					 FROM cmx_intr_cotizaciones coti2
					 WHERE coti2.id_intr_proyecto=so.id
					 AND coti2.estado=1 
					 AND coti2.id_proveedor=coti.id_proveedor
					 AND coti2.id_concepto<>11
					 ) AS val_coti_prove,  moncot.nom_moneda AS moneda_coti,
					 pro.nombre AS prove_factu, 
					 (SELECT  SUM(fac2.valor)
								FROM cmx_intr_facturas fac2
								WHERE fac2.id_intr_proyecto=so.id
								AND fac2.id_proveedor=fac.id_proveedor
								AND fac2.id NOT IN (
								SELECT  fac3.id
								FROM cmx_intr_facturas fac3
								inner JOIN cmx_intr_cotizaciones coti3
								ON fac3.id=coti3.id_factura
								WHERE coti3.id_intr_proyecto=so.id
								AND coti3.id_proveedor=fac.id_proveedor
								AND coti3.id_concepto=11
								)
							)AS val_factu_prove,
						  mon.nom_moneda AS moneda_factu,
						 of.valor AS valor_oferta, monf.nom_moneda AS monedaoferta,
					(SELECT  SUM(eg.valor)
					FROM cmx_intr_egresos eg
					INNER JOIN cmx_intr_facturas fact3
					ON eg.id=fact3.id_egreso
					WHERE fact3.id_intr_proyecto=so.id AND 
					fact3.id_proveedor=fac.id_proveedor
					AND eg.estado=1) AS valor_egreso,
					 facl.total AS valor_factura_cliente, 
					 facl.num_factura AS num_fac_cliente,
					 FROM_UNIXTIME(pr.numero_importacion,'%Y-%m-%d')AS 'fecha_parcial'
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
					ON so.id=of.id_intr_proyecto AND of.estado=1
					LEFT JOIN cmx_monedas monf
					ON of.id_moneda=monf.id
					LEFT JOIN cmx_intr_cotizaciones coti
					ON so.id=coti.id_intr_proyecto AND coti.estado=1
					AND coti.id_concepto<>11
					LEFT JOIN cmx_proveedores pcot
					ON coti.id_proveedor=pcot.id
					LEFT JOIN cmx_monedas moncot ON coti.id_moneda=moncot.id
					LEFT JOIN cmx_intr_facturas fac
					ON coti.id_factura=fac.id 
					AND coti.id_proveedor=fac.id_proveedor
					LEFT JOIN cmx_proveedores pro
					ON fac.id_proveedor=pro.id
					LEFT JOIN cmx_monedas mon
					ON fac.id_moneda=mon.id
					LEFT JOIN cmx_intr_factura_cliente facl
					ON so.id_factura=facl.id
					WHERE  pr.id_cliente=" . $dato3 . "
					 AND so.do IS NOT NULL 
					 AND pr.estado=1
					 GROUP BY 
					 	pr.numero_importacion, cl.nombre,
					 	pcot.nombre, pro.nombre,
					 	moncot.nom_moneda, mon.nom_moneda,
					 	of.valor,monf.nom_moneda,
					 	facl.num_factura, facl.total
					HAVING fecha_parcial     
					BETWEEN '" . $nota . "' AND '" . $fec2 . "'  	
					ORDER BY so.do";
					/*
					$sqlint="SELECT cip.numero_importacion AS 'do', cc.nombre, coti.id, fac.num_factura, fac.valor AS valor_factura, pro.nombre AS proveedor, coti.id_proveedor, fac.id_proveedor, cip.estado, FROM_UNIXTIME(cip.numero_importacion,'%Y-%m-%d')AS 'fecha_parcial',
						mon.nom_moneda, eg.numero_egreso, eg.valor AS valor_egreso,
						of.valor AS valor_cliente, monf.nom_moneda AS monedaoferta,
						 facl.total AS valor_factura_cliente, 
						 facl.num_factura AS num_fac_cliente,
						 moncot.nom_moneda AS moneda_cotizacion,
						 SUM(coti.valor) AS total_cotizacion
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
						ORDER BY so.do";*/
				}
			}

			if ($filtop1 == 2) { //CONSOLIDADO
				if ($filtro == 1) {
					$sqlint = "SELECT 
					pr.numero_importacion AS 'do', cl.nombre AS cliente,
						IF( moncot.nom_moneda = 'Dollar US',
						(SELECT SUM(coti2.valor)  
						FROM cmx_intr_cotizaciones coti2
						INNER JOIN cmx_monedas mone2
						ON coti2.id_moneda=mone2.id
						AND mone2.codigo='USD'
						WHERE coti2.id_intr_proyecto=so.id
						AND coti2.estado=1 
						AND coti2.id_concepto<>11), 
							IF( moncot.nom_moneda = 'Peso Colombiano',
							(SELECT SUM(coti2.valor)  
							FROM cmx_intr_cotizaciones coti2
							INNER JOIN cmx_monedas mone2
							ON coti2.id_moneda=mone2.id
							AND mone2.codigo='COP'
							WHERE coti2.id_intr_proyecto=so.id
							AND coti2.estado=1 
							AND coti2.id_concepto<>11),
							IF( moncot.nom_moneda = 'Euro',
							(SELECT SUM(coti2.valor)  
							FROM cmx_intr_cotizaciones coti2
							INNER JOIN cmx_monedas mone2
							ON coti2.id_moneda=mone2.id
							AND mone2.codigo='EUR'
							WHERE coti2.id_intr_proyecto=so.id
							AND coti2.estado=1 
							AND coti2.id_concepto<>11),0
											 )	 				 
								 )
								  
							) AS val_coti_prove,  
					 moncot.nom_moneda AS moneda_coti,
					 IF( mon.nom_moneda = 'Dollar US',
					 	(
					 	SELECT 
						 	SUM(fac2.valor)
						 FROM cmx_intr_facturas fac2
						 INNER JOIN cmx_monedas moni
						 ON fac2.id_moneda=moni.id
						 AND moni.codigo='USD'
						WHERE fac2.id_intr_proyecto=so.id
						--	AND fac2.id_proveedor IN(fac.id_proveedor)
						AND fac2.id 
						NOT IN (
						SELECT  fac3.id
						FROM cmx_intr_facturas fac3
						inner JOIN cmx_intr_cotizaciones coti3
						ON fac3.id=coti3.id_factura
						WHERE coti3.id_intr_proyecto=so.id
						--	AND coti3.id_proveedor IN(coti.id_proveedor)
						AND coti3.id_concepto=11)
						),
						IF(mon.nom_moneda = 'Peso Colombiano',
						(SELECT SUM(fac2.valor)
						FROM cmx_intr_facturas fac2
						INNER JOIN cmx_monedas moni
						ON fac2.id_moneda=moni.id
						AND moni.codigo='COP'
						WHERE fac2.id_intr_proyecto=so.id
						--	AND fac2.id_proveedor IN(fac.id_proveedor)
						AND fac2.id 
						NOT IN (SELECT  fac3.id
							FROM cmx_intr_facturas fac3
							inner JOIN cmx_intr_cotizaciones coti3
							ON fac3.id=coti3.id_factura
							WHERE coti3.id_intr_proyecto=so.id
							--	AND coti3.id_proveedor IN(coti.id_proveedor)
							AND coti3.id_concepto=11)
						),
								
						IF(mon.nom_moneda = 'Euro',
							(SELECT SUM(fac2.valor)
								FROM cmx_intr_facturas fac2
								INNER JOIN cmx_monedas moni
								ON fac2.id_moneda=moni.id
								AND moni.codigo='EUR'
								WHERE fac2.id_intr_proyecto=so.id
								--	AND fac2.id_proveedor IN(fac.id_proveedor)
								AND fac2.id 
								NOT IN (SELECT  fac3.id
									FROM cmx_intr_facturas fac3
									inner JOIN cmx_intr_cotizaciones coti3
									ON fac3.id=coti3.id_factura
									WHERE coti3.id_intr_proyecto=so.id
								--	AND coti3.id_proveedor IN(coti.id_proveedor)
									AND coti3.id_concepto=11)
									),0
							) ))AS val_factu_prove,
						  mon.nom_moneda AS moneda_factu,
						 of.valor AS valor_oferta, monf.nom_moneda AS monedaoferta,
					(SELECT  SUM(eg.valor)
					FROM cmx_intr_egresos eg
					INNER JOIN cmx_intr_facturas fact3
					ON eg.id=fact3.id_egreso
					WHERE fact3.id_intr_proyecto=so.id AND 
					fact3.id_proveedor=fac.id_proveedor
					AND eg.estado=1) AS valor_egreso,
					 facl.total AS valor_factura_cliente, 
					 facl.num_factura AS num_fac_cliente
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
					ON so.id=of.id_intr_proyecto AND of.estado=1
					LEFT JOIN cmx_monedas monf
					ON of.id_moneda=monf.id
					LEFT JOIN cmx_intr_cotizaciones coti
					ON so.id=coti.id_intr_proyecto AND coti.estado=1
					AND coti.id_concepto<>11
					LEFT JOIN cmx_proveedores pcot
					ON coti.id_proveedor=pcot.id
					LEFT JOIN cmx_monedas moncot ON coti.id_moneda=moncot.id
					LEFT JOIN cmx_intr_facturas fac
					ON coti.id_factura=fac.id 
					AND coti.id_proveedor=fac.id_proveedor
					LEFT JOIN cmx_proveedores pro
					ON fac.id_proveedor=pro.id
					LEFT JOIN cmx_monedas mon
					ON fac.id_moneda=mon.id
					LEFT JOIN cmx_intr_factura_cliente facl
					ON so.id_factura=facl.id
					WHERE 
					pr.id_cliente=" . $nota . " 
					AND so.do IS NOT NULL 
					AND pr.estado=1
					GROUP BY 
					 	pr.numero_importacion, cl.nombre,
					 	moncot.nom_moneda, mon.nom_moneda,
					 	of.valor,monf.nom_moneda,
					 	facl.num_factura, facl.total
					ORDER BY so.do";


					/*
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
						*/
				}

				if ($filtro == 2) {
					$hoy = date('Y-m-d');

					$sqlint = "SELECT 
					pr.numero_importacion AS 'do', cl.nombre AS cliente,
						(SELECT SUM(coti2.valor)  
						FROM cmx_intr_cotizaciones coti2
						INNER JOIN cmx_monedas mone2
						ON coti2.id_moneda=mone2.id
						AND mone2.codigo='USD'
								 WHERE coti2.id_intr_proyecto=so.id
								 AND coti2.estado=1 
								 AND coti2.id_concepto<>11) AS valor_dolar,
							(SELECT SUM(coti2.valor)  
							FROM cmx_intr_cotizaciones coti2
							INNER JOIN cmx_monedas mone2
							ON coti2.id_moneda=mone2.id
							AND mone2.codigo='COP'
							WHERE coti2.id_intr_proyecto=so.id
							AND coti2.estado=1 
							AND coti2.id_concepto<>11) AS valor_pesos,
							(SELECT SUM(coti2.valor)  
								FROM cmx_intr_cotizaciones coti2
								INNER JOIN cmx_monedas mone2
								ON coti2.id_moneda=mone2.id
								AND mone2.codigo='EUR'
								WHERE coti2.id_intr_proyecto=so.id
								AND coti2.estado=1 
								AND coti2.id_concepto<>11) AS valor_euro, 
								 
					 IF( mon.nom_moneda = 'Dollar US',
					 	(
					 	SELECT 
						 	SUM(fac2.valor)
						 FROM cmx_intr_facturas fac2
						 INNER JOIN cmx_monedas moni
						 ON fac2.id_moneda=moni.id
						 AND moni.codigo='USD'
						WHERE fac2.id_intr_proyecto=so.id
							--	AND fac2.id_proveedor IN(fac.id_proveedor)
								AND fac2.id 
								NOT IN (
								SELECT  fac3.id
								FROM cmx_intr_facturas fac3
								inner JOIN cmx_intr_cotizaciones coti3
								ON fac3.id=coti3.id_factura
								WHERE coti3.id_intr_proyecto=so.id
							--	AND coti3.id_proveedor IN(coti.id_proveedor)
								AND coti3.id_concepto=11)
								),
						IF(mon.nom_moneda = 'Peso Colombiano',
						(SELECT SUM(fac2.valor)
							FROM cmx_intr_facturas fac2
							INNER JOIN cmx_monedas moni
							ON fac2.id_moneda=moni.id
							AND moni.codigo='COP'
							WHERE fac2.id_intr_proyecto=so.id
							--	AND fac2.id_proveedor IN(fac.id_proveedor)
							AND fac2.id 
							NOT IN (
							SELECT  fac3.id
							FROM cmx_intr_facturas fac3
							inner JOIN cmx_intr_cotizaciones coti3
							ON fac3.id=coti3.id_factura
							WHERE coti3.id_intr_proyecto=so.id
							--	AND coti3.id_proveedor IN(coti.id_proveedor)
							AND coti3.id_concepto=11)
							),	
							IF(mon.nom_moneda = 'Euro',
								(SELECT SUM(fac2.valor)
								FROM cmx_intr_facturas fac2
								INNER JOIN cmx_monedas moni
								ON fac2.id_moneda=moni.id
								AND moni.codigo='EUR'
								WHERE fac2.id_intr_proyecto=so.id
								--	AND fac2.id_proveedor IN(fac.id_proveedor)
								AND fac2.id 
								NOT IN (SELECT  fac3.id
								FROM cmx_intr_facturas fac3
								inner JOIN cmx_intr_cotizaciones coti3
								ON fac3.id=coti3.id_factura
								WHERE coti3.id_intr_proyecto=so.id
								AND coti3.id_concepto=11)
								),0
								) ))AS val_factu_prove,
						  mon.nom_moneda AS moneda_factu,
						 of.valor AS valor_oferta, 
						 monf.nom_moneda AS monedaoferta,
					(SELECT  SUM(eg.valor)
					FROM cmx_intr_egresos eg
					INNER JOIN cmx_intr_facturas fact3
					ON eg.id=fact3.id_egreso
					WHERE fact3.id_intr_proyecto=so.id AND 
					fact3.id_proveedor=fac.id_proveedor
					AND eg.estado=1) AS valor_egreso,
					 facl.total AS valor_factura_cliente, 
					 facl.num_factura AS num_fac_cliente,
					 FROM_UNIXTIME(pr.numero_importacion,'%Y-%m-%d')AS 'fecha_parcial'
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
					ON so.id=of.id_intr_proyecto AND of.estado=1
					LEFT JOIN cmx_monedas monf
					ON of.id_moneda=monf.id
					LEFT JOIN cmx_intr_cotizaciones coti
					ON so.id=coti.id_intr_proyecto AND coti.estado=1
					AND coti.id_concepto<>11
					LEFT JOIN cmx_proveedores pcot
					ON coti.id_proveedor=pcot.id
					LEFT JOIN cmx_monedas moncot ON coti.id_moneda=moncot.id
					LEFT JOIN cmx_intr_facturas fac
					ON coti.id_factura=fac.id 
					AND coti.id_proveedor=fac.id_proveedor
					LEFT JOIN cmx_proveedores pro
					ON fac.id_proveedor=pro.id
					LEFT JOIN cmx_monedas mon
					ON fac.id_moneda=mon.id
					LEFT JOIN cmx_intr_factura_cliente facl
					ON so.id_factura=facl.id
					WHERE 
					so.do IS NOT NULL 
					AND pr.estado=1
					GROUP BY 
					 	pr.numero_importacion, cl.nombre,
					 --	moncot.nom_moneda, mon.nom_moneda,
					 	of.valor, 
						 -- monf.nom_moneda,
					 	facl.num_factura, facl.total,
					 	valor_dolar, valor_pesos, valor_euro
					 HAVING fecha_parcial     
					BETWEEN '" . $nota . "' AND '" . $fec2 . "'	
					ORDER BY so.do";

					/*
					$sqlint="SELECT 
					pr.numero_importacion AS 'do', cl.nombre AS cliente,
						IF( moncot.nom_moneda = 'Dollar US',
						(	SELECT SUM(coti2.valor)  
						FROM cmx_intr_cotizaciones coti2
						INNER JOIN cmx_monedas mone2
						ON coti2.id_moneda=mone2.id
						AND mone2.codigo='USD'
								 WHERE coti2.id_intr_proyecto=so.id
								 AND coti2.estado=1 
								 AND coti2.id_concepto<>11), 
						IF( moncot.nom_moneda = 'Peso Colombiano',
							(SELECT SUM(coti2.valor)  
							FROM cmx_intr_cotizaciones coti2
							INNER JOIN cmx_monedas mone2
							ON coti2.id_moneda=mone2.id
							AND mone2.codigo='COP'
							WHERE coti2.id_intr_proyecto=so.id
							AND coti2.estado=1 
							AND coti2.id_concepto<>11),
						IF( moncot.nom_moneda = 'Euro',
							(SELECT SUM(coti2.valor)  
								FROM cmx_intr_cotizaciones coti2
								INNER JOIN cmx_monedas mone2
								ON coti2.id_moneda=mone2.id
								AND mone2.codigo='EUR'
								WHERE coti2.id_intr_proyecto=so.id
								AND coti2.estado=1 
								AND coti2.id_concepto<>11),0
							)	 				 
						)) AS val_coti_prove,  
					 moncot.nom_moneda AS moneda_coti,
					 IF( mon.nom_moneda = 'Dollar US',
					 	(
					 	SELECT 
						 	SUM(fac2.valor)
						 FROM cmx_intr_facturas fac2
						 INNER JOIN cmx_monedas moni
						 ON fac2.id_moneda=moni.id
						 AND moni.codigo='USD'
						WHERE fac2.id_intr_proyecto=so.id
							--	AND fac2.id_proveedor IN(fac.id_proveedor)
								AND fac2.id 
								NOT IN (
								SELECT  fac3.id
								FROM cmx_intr_facturas fac3
								inner JOIN cmx_intr_cotizaciones coti3
								ON fac3.id=coti3.id_factura
								WHERE coti3.id_intr_proyecto=so.id
							--	AND coti3.id_proveedor IN(coti.id_proveedor)
								AND coti3.id_concepto=11)
								),
						IF(mon.nom_moneda = 'Peso Colombiano',
						(SELECT SUM(fac2.valor)
							FROM cmx_intr_facturas fac2
							INNER JOIN cmx_monedas moni
							ON fac2.id_moneda=moni.id
							AND moni.codigo='COP'
							WHERE fac2.id_intr_proyecto=so.id
							--	AND fac2.id_proveedor IN(fac.id_proveedor)
							AND fac2.id 
							NOT IN (
							SELECT  fac3.id
							FROM cmx_intr_facturas fac3
							inner JOIN cmx_intr_cotizaciones coti3
							ON fac3.id=coti3.id_factura
							WHERE coti3.id_intr_proyecto=so.id
							--	AND coti3.id_proveedor IN(coti.id_proveedor)
							AND coti3.id_concepto=11)
							),	
							IF(mon.nom_moneda = 'Euro',
								(SELECT SUM(fac2.valor)
								FROM cmx_intr_facturas fac2
								INNER JOIN cmx_monedas moni
								ON fac2.id_moneda=moni.id
								AND moni.codigo='EUR'
								WHERE fac2.id_intr_proyecto=so.id
								--	AND fac2.id_proveedor IN(fac.id_proveedor)
								AND fac2.id 
								NOT IN (SELECT  fac3.id
								FROM cmx_intr_facturas fac3
								inner JOIN cmx_intr_cotizaciones coti3
								ON fac3.id=coti3.id_factura
								WHERE coti3.id_intr_proyecto=so.id
								--	AND coti3.id_proveedor IN(coti.id_proveedor)
								AND coti3.id_concepto=11)
								),0
								) ))AS val_factu_prove,
						  mon.nom_moneda AS moneda_factu,
						 of.valor AS valor_oferta, monf.nom_moneda AS monedaoferta,
					(SELECT  SUM(eg.valor)
					FROM cmx_intr_egresos eg
					INNER JOIN cmx_intr_facturas fact3
					ON eg.id=fact3.id_egreso
					WHERE fact3.id_intr_proyecto=so.id AND 
					fact3.id_proveedor=fac.id_proveedor
					AND eg.estado=1) AS valor_egreso,
					 facl.total AS valor_factura_cliente, 
					 facl.num_factura AS num_fac_cliente,
					 FROM_UNIXTIME(pr.numero_importacion,'%Y-%m-%d')AS 'fecha_parcial'
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
					ON so.id=of.id_intr_proyecto AND of.estado=1
					LEFT JOIN cmx_monedas monf
					ON of.id_moneda=monf.id
					LEFT JOIN cmx_intr_cotizaciones coti
					ON so.id=coti.id_intr_proyecto AND coti.estado=1
					AND coti.id_concepto<>11
					LEFT JOIN cmx_proveedores pcot
					ON coti.id_proveedor=pcot.id
					LEFT JOIN cmx_monedas moncot ON coti.id_moneda=moncot.id
					LEFT JOIN cmx_intr_facturas fac
					ON coti.id_factura=fac.id 
					AND coti.id_proveedor=fac.id_proveedor
					LEFT JOIN cmx_proveedores pro
					ON fac.id_proveedor=pro.id
					LEFT JOIN cmx_monedas mon
					ON fac.id_moneda=mon.id
					LEFT JOIN cmx_intr_factura_cliente facl
					ON so.id_factura=facl.id
					WHERE 
					so.do IS NOT NULL 
					AND pr.estado=1
					GROUP BY 
					 	pr.numero_importacion, cl.nombre,
					 	moncot.nom_moneda, mon.nom_moneda,
					 	of.valor,monf.nom_moneda,
					 	facl.num_factura, facl.total
					 HAVING fecha_parcial     
					BETWEEN '".$nota."' AND '".$fec2."'	
					ORDER BY so.do";*/
				}

				if ($filtro == 3) {
					$sqlint = "SELECT 
					pr.numero_importacion AS 'do', cl.nombre AS cliente,
						IF( moncot.nom_moneda = 'Dollar US',
						(SELECT SUM(coti2.valor)  
						FROM cmx_intr_cotizaciones coti2
						INNER JOIN cmx_monedas mone2
						ON coti2.id_moneda=mone2.id
						AND mone2.codigo='USD'
						WHERE coti2.id_intr_proyecto=so.id
						AND coti2.estado=1 
						AND coti2.id_concepto<>11), 
						IF( moncot.nom_moneda = 'Peso Colombiano',
							(SELECT SUM(coti2.valor)  
							FROM cmx_intr_cotizaciones coti2
							INNER JOIN cmx_monedas mone2
							ON coti2.id_moneda=mone2.id
							AND mone2.codigo='COP'
							WHERE coti2.id_intr_proyecto=so.id
							AND coti2.estado=1 
							AND coti2.id_concepto<>11),
						IF( moncot.nom_moneda = 'Euro',
							(SELECT SUM(coti2.valor)  
							FROM cmx_intr_cotizaciones coti2
							INNER JOIN cmx_monedas mone2
							ON coti2.id_moneda=mone2.id
							AND mone2.codigo='EUR'
							WHERE coti2.id_intr_proyecto=so.id
							AND coti2.estado=1 
							AND coti2.id_concepto<>11),0
									)	 				 
								 )
								  
							) AS val_coti_prove,  
					 moncot.nom_moneda AS moneda_coti,
					 IF( mon.nom_moneda = 'Dollar US',
					 	(
					 	SELECT 
						 	SUM(fac2.valor)
						 FROM cmx_intr_facturas fac2
						 INNER JOIN cmx_monedas moni
						 ON fac2.id_moneda=moni.id
						 AND moni.codigo='USD'
						WHERE fac2.id_intr_proyecto=so.id
						--	AND fac2.id_proveedor IN(fac.id_proveedor)
						AND fac2.id 
						NOT IN (
						SELECT  fac3.id
						FROM cmx_intr_facturas fac3
						inner JOIN cmx_intr_cotizaciones coti3
						ON fac3.id=coti3.id_factura
						WHERE coti3.id_intr_proyecto=so.id
						--	AND coti3.id_proveedor IN(coti.id_proveedor)
						AND coti3.id_concepto=11)
						),
					IF(mon.nom_moneda = 'Peso Colombiano',
						(SELECT  SUM(fac2.valor)
							FROM cmx_intr_facturas fac2
							INNER JOIN cmx_monedas moni
							ON fac2.id_moneda=moni.id
							AND moni.codigo='COP'
							WHERE fac2.id_intr_proyecto=so.id
							--	AND fac2.id_proveedor IN(fac.id_proveedor)
							AND fac2.id 
							NOT IN (
							SELECT  fac3.id
							FROM cmx_intr_facturas fac3
							inner JOIN cmx_intr_cotizaciones coti3
							ON fac3.id=coti3.id_factura
							WHERE coti3.id_intr_proyecto=so.id
							--	AND coti3.id_proveedor IN(coti.id_proveedor)
							AND coti3.id_concepto=11)
						),
						IF(mon.nom_moneda = 'Euro',
							(SELECT SUM(fac2.valor)
								FROM cmx_intr_facturas fac2
								INNER JOIN cmx_monedas moni
								ON fac2.id_moneda=moni.id
								AND moni.codigo='EUR'
								WHERE fac2.id_intr_proyecto=so.id
								--	AND fac2.id_proveedor IN(fac.id_proveedor)
								AND fac2.id 
								NOT IN (SELECT  fac3.id
								FROM cmx_intr_facturas fac3
								inner JOIN cmx_intr_cotizaciones coti3
								ON fac3.id=coti3.id_factura
								WHERE coti3.id_intr_proyecto=so.id
								--	AND coti3.id_proveedor IN(coti.id_proveedor)
								AND coti3.id_concepto=11)
							),0
						)
						))AS val_factu_prove,
						  mon.nom_moneda AS moneda_factu,
						 of.valor AS valor_oferta, monf.nom_moneda AS monedaoferta,
					(SELECT  SUM(eg.valor)
					FROM cmx_intr_egresos eg
					INNER JOIN cmx_intr_facturas fact3
					ON eg.id=fact3.id_egreso
					WHERE fact3.id_intr_proyecto=so.id AND 
					fact3.id_proveedor=fac.id_proveedor
					AND eg.estado=1) AS valor_egreso,
					 facl.total AS valor_factura_cliente, 
					 facl.num_factura AS num_fac_cliente
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
					ON so.id=of.id_intr_proyecto AND of.estado=1
					LEFT JOIN cmx_monedas monf
					ON of.id_moneda=monf.id
					LEFT JOIN cmx_intr_cotizaciones coti
					ON so.id=coti.id_intr_proyecto AND coti.estado=1
					AND coti.id_concepto<>11
					LEFT JOIN cmx_proveedores pcot
					ON coti.id_proveedor=pcot.id
					LEFT JOIN cmx_monedas moncot ON coti.id_moneda=moncot.id
					LEFT JOIN cmx_intr_facturas fac
					ON coti.id_factura=fac.id 
					AND coti.id_proveedor=fac.id_proveedor
					LEFT JOIN cmx_proveedores pro
					ON fac.id_proveedor=pro.id
					LEFT JOIN cmx_monedas mon
					ON fac.id_moneda=mon.id
					LEFT JOIN cmx_intr_factura_cliente facl
					ON so.id_factura=facl.id
					WHERE pr.numero_importacion=" . $nota . "
					AND so.do IS NOT NULL 
					AND pr.estado=1
					GROUP BY 
					 	pr.numero_importacion, cl.nombre,
					 	moncot.nom_moneda, mon.nom_moneda,
					 	of.valor,monf.nom_moneda,
					 	facl.num_factura, facl.total
					ORDER BY so.do";


					/*
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
						*/
				}

				if ($filtro == 4) {
					/*echo 'F'.$filtro; echo 'DQ1'.$nota;
					echo 'dq2'.$fec2; echo 'DQ3'.$dato3;*/
					$hora = date('H:i:s');

					$sqlint = "	SELECT 
					pr.numero_importacion AS 'do', cl.nombre AS cliente,
						IF( moncot.nom_moneda = 'Dollar US',
						(SELECT SUM(coti2.valor)  
						FROM cmx_intr_cotizaciones coti2
						INNER JOIN cmx_monedas mone2
						ON coti2.id_moneda=mone2.id
						AND mone2.codigo='USD'
						WHERE coti2.id_intr_proyecto=so.id
						AND coti2.estado=1 
						AND coti2.id_concepto<>11), 
						IF( moncot.nom_moneda = 'Peso Colombiano',
						(SELECT SUM(coti2.valor)  
						FROM cmx_intr_cotizaciones coti2
						INNER JOIN cmx_monedas mone2
						ON coti2.id_moneda=mone2.id
						AND mone2.codigo='COP'
						WHERE coti2.id_intr_proyecto=so.id
						AND coti2.estado=1 
						AND coti2.id_concepto<>11),
						IF( moncot.nom_moneda = 'Euro',
						(SELECT SUM(coti2.valor)  
						FROM cmx_intr_cotizaciones coti2
						INNER JOIN cmx_monedas mone2
						ON coti2.id_moneda=mone2.id
						AND mone2.codigo='EUR'
						WHERE coti2.id_intr_proyecto=so.id
						AND coti2.estado=1 
						AND coti2.id_concepto<>11),0
						)	 				 
						)		  
						) AS val_coti_prove,  
					 moncot.nom_moneda AS moneda_coti,
					 IF( mon.nom_moneda = 'Dollar US',
					 	(
					 	SELECT 
						 	SUM(fac2.valor)
						 FROM cmx_intr_facturas fac2
						 INNER JOIN cmx_monedas moni
						 ON fac2.id_moneda=moni.id
						 AND moni.codigo='USD'
						WHERE fac2.id_intr_proyecto=so.id
						--	AND fac2.id_proveedor IN(fac.id_proveedor)
						AND fac2.id 
						NOT IN (
						SELECT  fac3.id
						FROM cmx_intr_facturas fac3
						inner JOIN cmx_intr_cotizaciones coti3
						ON fac3.id=coti3.id_factura
						WHERE coti3.id_intr_proyecto=so.id
						--	AND coti3.id_proveedor IN(coti.id_proveedor)
						AND coti3.id_concepto=11)
						),
						IF(mon.nom_moneda = 'Peso Colombiano',
							(SELECT SUM(fac2.valor)
							FROM cmx_intr_facturas fac2
							INNER JOIN cmx_monedas moni
							ON fac2.id_moneda=moni.id
							AND moni.codigo='COP'
							WHERE fac2.id_intr_proyecto=so.id
							--	AND fac2.id_proveedor IN(fac.id_proveedor)
							AND fac2.id 
							NOT IN (SELECT  fac3.id
							FROM cmx_intr_facturas fac3
							inner JOIN cmx_intr_cotizaciones coti3
							ON fac3.id=coti3.id_factura
							WHERE coti3.id_intr_proyecto=so.id
							--	AND coti3.id_proveedor IN(coti.id_proveedor)
							AND coti3.id_concepto=11)
							),
						IF(mon.nom_moneda = 'Euro',
						(SELECT SUM(fac2.valor)
						FROM cmx_intr_facturas fac2
						INNER JOIN cmx_monedas moni
						ON fac2.id_moneda=moni.id
						AND moni.codigo='EUR'
						WHERE fac2.id_intr_proyecto=so.id
						--	AND fac2.id_proveedor IN(fac.id_proveedor)
						AND fac2.id 
						NOT IN (SELECT  fac3.id
						FROM cmx_intr_facturas fac3
						inner JOIN cmx_intr_cotizaciones coti3
						ON fac3.id=coti3.id_factura
						WHERE coti3.id_intr_proyecto=so.id
						--	AND coti3.id_proveedor IN(coti.id_proveedor)
						AND coti3.id_concepto=11)
						),0
						)
					))AS val_factu_prove,
						  mon.nom_moneda AS moneda_factu,
						 of.valor AS valor_oferta, monf.nom_moneda AS monedaoferta,
					(SELECT  SUM(eg.valor)
					FROM cmx_intr_egresos eg
					INNER JOIN cmx_intr_facturas fact3
					ON eg.id=fact3.id_egreso
					WHERE fact3.id_intr_proyecto=so.id AND 
					fact3.id_proveedor=fac.id_proveedor
					AND eg.estado=1) AS valor_egreso,
					 facl.total AS valor_factura_cliente, 
					 facl.num_factura AS num_fac_cliente,
					 FROM_UNIXTIME(pr.numero_importacion,'%Y-%m-%d')AS 'fecha_parcial'
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
					ON so.id=of.id_intr_proyecto AND of.estado=1
					LEFT JOIN cmx_monedas monf
					ON of.id_moneda=monf.id
					LEFT JOIN cmx_intr_cotizaciones coti
					ON so.id=coti.id_intr_proyecto AND coti.estado=1
					AND coti.id_concepto<>11
					LEFT JOIN cmx_proveedores pcot
					ON coti.id_proveedor=pcot.id
					LEFT JOIN cmx_monedas moncot ON coti.id_moneda=moncot.id
					LEFT JOIN cmx_intr_facturas fac
					ON coti.id_factura=fac.id 
					AND coti.id_proveedor=fac.id_proveedor
					LEFT JOIN cmx_proveedores pro
					ON fac.id_proveedor=pro.id
					LEFT JOIN cmx_monedas mon
					ON fac.id_moneda=mon.id
					LEFT JOIN cmx_intr_factura_cliente facl
					ON so.id_factura=facl.id
					WHERE pr.id_cliente=" . $dato3 . "
					AND so.do IS NOT NULL 
					AND pr.estado=1
					GROUP BY 
					 	pr.numero_importacion, cl.nombre,
					 	moncot.nom_moneda, mon.nom_moneda,
					 	of.valor,monf.nom_moneda,
					 	facl.num_factura, facl.total
					 HAVING fecha_parcial     
					BETWEEN '" . $nota . "' AND '" . $fec2 . "' 	
					ORDER BY so.do";

					/*	
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
						*/
				}
			}
			//echo $sqlint;
			$resultado = $this->_db3->query($sqlint);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOException $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function GeneralSobrecosto($inicia, $fin)
	{
		$resultado = $this->_db2->conectar();
		try {
			$sqls = "SELECT so.do, cl.nombre,  pro.nombre as nomproveedor, coti.fecha_cotizacion,
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
			HAVING fecha_parcial BETWEEN '" . $inicia . "' AND '" . $fin . "'";
			/*$consults=$resultado->query($sqls);
			return $consults->fetchall();	*/

			$resultado = $this->_db3->query($sqls);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOException $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function ConsultarCliente()
	{
		//$resultado= $this->_db2->conectar();
		try {
			$sqlc = "SELECT id, documento, digito_verificacion, nombre 
			 FROM cmx_clientes WHERE estado=1
			 ORDER BY nombre ASC
			 ";
			$resultado = $this->_db3->query($sqlc);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOException $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function Informe_de_ventas($datos)
	{
		try {
			$this->_db3->beginTransaction();
			$sql = $this->_db3->prepare("SELECT cl.nombre AS cliente_servicio,ip.numero_importacion AS nro_do,ip.fecha_hora AS fecha_do,
			ip.tipo_operacion AS tipo_operacion,ins.tipo_transporte AS tipo_transporte,tc.nombre AS tipo_carga,
			tcnt.nombre as contenedor,tcnt.tara AS tara,
			ip.contenedor AS cantidad,
			ins.incoterm AS prefijo_tipo_transporte,mo.nom_moneda AS tipo_moneda,mt.valor as trm_do, 
			oc.fecha AS fecha_oferta_comercial,oc.valor AS valor_oferta_comercial,
			mtf.valor AS factura_trm,
			fc.num_factura AS nro_factura_cliente,fc.fecha AS fecha_factura_cliente,
			fc.num_proforma AS factura_preforma,fc.subtotal AS factura_subtotal,fc.iva AS factura_iva,
			fc.total AS factura_total,
			ins.valor_sobrecosto AS valor_sobrecosto
			FROM cmx_importacion_proyecto ip 
			INNER JOIN cmx_clientes cl ON ip.id_cliente = cl.id
			INNER JOIN cmx_tipo_carga tc ON ip.id_tipo_carga = tc.id
			LEFT JOIN cmx_intr_solicitudes ins ON ip.id = ins.id_proyecto
			LEFT JOIN cmx_monedas mo ON ins.id_moneda = mo.id 
			LEFT JOIN cmx_monedas_trm mt ON mo.id = mt.id_moneda AND DATE_FORMAT(ip.fecha_hora,'%y-%m-%d') = mt.fecha 
			LEFT JOIN cmx_intr_oferta_comercial oc ON ins.id = oc.id_intr_proyecto AND oc.estado = 1
			LEFT JOIN cmx_intr_factura_cliente fc ON ins.id_factura = fc.id
			LEFT JOIN cmx_tipo_contenedor tcnt ON ip.tipo_contenedor = tcnt.id
			LEFT JOIN cmx_monedas_trm mtf ON mo.id = mtf.id_moneda AND DATE_FORMAT(fc.fecha,'%y-%m-%d') = mtf.fecha
			WHERE ip.fecha_hora BETWEEN :fecha_inicio AND :fecha_fin AND ip.estado = 1 
			ORDER BY ip.numero_importacion");
			$sql->bindParam(':fecha_inicio', $datos['fecha_inicial']);
			$sql->bindParam(':fecha_fin', $datos['fecha_final']);
			$sql->execute();
			$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
			$this->_db3->commit();
			return $resultado;
		} catch (\Throwable $th) {
			//throw $th;
		}
	}

	public function Informe_de_costos($datos)
	{
		try {
			$this->_db3->beginTransaction();
			$sql = $this->_db3->prepare("SELECT cl.nombre AS cliente_servicio,ip.numero_importacion AS nro_do,ip.fecha_hora AS fecha_do,
			oc.fecha AS fecha_oferta_comercial,ct.proveedor AS proveedor,cp.nombre AS concepto,
			mo.nom_moneda AS moneda,mt.valor AS cotizacion_trm,ct.valor AS valor_cotizacion,
			fc.num_factura AS nro_factura,fc.fecha_factura,fc.valor,mof.nom_moneda AS moneda_factura,
			ct.descripcion AS observaciones
			FROM cmx_importacion_proyecto ip 
			INNER JOIN cmx_clientes cl ON ip.id_cliente = cl.id
			INNER JOIN cmx_tipo_carga tc ON ip.id_tipo_carga = tc.id
			LEFT JOIN cmx_intr_solicitudes ins ON ip.id = ins.id_proyecto
			LEFT JOIN cmx_intr_oferta_comercial oc ON ins.id = oc.id_intr_proyecto AND oc.estado = 1
			LEFT JOIN cmx_intr_cotizaciones ct ON ins.id = ct.id_intr_proyecto AND ct.estado = 1
			LEFT JOIN cmx_intr_conceptos cp ON ct.id_concepto = cp.id 
			LEFT JOIN cmx_monedas mo ON ct.id_moneda = mo.id 
			LEFT JOIN cmx_monedas_trm mt ON mo.id = mt.id_moneda 
			AND DATE_FORMAT(ct.fecha_cotizacion,'%y-%m-%d') = mt.fecha 
			LEFT JOIN cmx_intr_facturas fc ON ct.id_factura = fc.id
			LEFT JOIN cmx_monedas mof ON fc.id_moneda = mof.id
			WHERE ip.fecha_hora
			BETWEEN :fecha_inicio AND :fecha_fin
			AND ip.estado = 1 
			ORDER BY ip.numero_importacion");
			$sql->bindParam(':fecha_inicio', $datos['fecha_inicial']);
			$sql->bindParam(':fecha_fin', $datos['fecha_final']);
			$sql->execute();
			$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
			$this->_db3->commit();
			return $resultado;
		} catch (\Throwable $th) {
			//throw $th;
		}
	}
}
