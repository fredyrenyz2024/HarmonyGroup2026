<?php
class gestion_cambio_procesoModel extends Model
{

	public function __construct()
	{
		parent::__construct();
	}

	public function Consulta_Proceso($modulo, $id_tabla)
	{
		try {
			if ($modulo == 'CO') {
				$sql = "SELECT n_cotizacion AS 'id', nombre_cliente AS 'cliente', fecha_creacion AS 'fecha_realizacion'
					FROM cmx_cotizaciones_serviciocliente
					WHERE id=" . $id_tabla;
			}
			if ($modulo == 'SS') {
				$sql = "SELECT id, nombre_cliente AS 'cliente', fecha AS 'fecha_realizacion', hora
					FROM cmx_solicitud_vehiculo2
					WHERE id=" . $id_tabla;
			}
			if ($modulo == 'ES') {
				$sql = "SELECT pre.id, pre.placa, pre.fecha AS 'fecha_realizacion', pre.hora,
					sss.nombre_cliente AS 'cliente'
					FROM  cmx_solicitudes_preestudio pre
					INNER JOIN cmx_preestudio_solicitudes_servicio press
					ON pre.id=press.id_solicitudpreestudio
					INNER JOIN cmx_solicitud_vehiculo2 sss
					ON press.id_servicio_cliente=sss.id
					WHERE pre.id=" . $id_tabla;
			}
			if ($modulo == 'OC') {
				$sql = "SELECT orde.id, orde.cli_id, orde.fecha_orden AS 'fecha_realizacion', orde.hora_orden,cli.nombre AS 'cliente'
						FROM cmx_orden_cargue orde
						INNER JOIN cmx_clientes cli
						ON orde.cli_id=cli.id
						WHERE orde.id=" . $id_tabla;
			}
			if ($modulo == 'RM') {
				$sql = "SELECT rem.id, rem.fecha_creacion AS 'fecha_realizacion',
						rem.hora_creacion, cli.nombre AS 'cliente'
						FROM cmx_remesa rem
						INNER JOIN cmx_remesa_ordencargue roc
						ON rem.id=roc.id_remesa
						INNER JOIN cmx_orden_cargue oc
						ON roc.id_orden_cargue=oc.id
						INNER JOIN cmx_clientes cli
						ON oc.cli_id=cli.id
						WHERE rem.id=" . $id_tabla;
			}
			if ($modulo == 'MNF') {
				$sql = "SELECT ma.id, ma.fecha_expedicion AS 'fecha_realizacion',
					cli.nombre AS 'cliente'
					FROM cmx_manifiesto ma
					INNER JOIN cmx_manifiesto_remesa mnr
					ON ma.id=mnr.id_manifiesto AND mnr.estado=1
					INNER JOIN cmx_remesa_ordencargue roc
					ON mnr.id_remesa=roc.id_remesa AND roc.estado=1
					INNER JOIN cmx_orden_cargue oc
					ON roc.id_orden_cargue=oc.id
					INNER JOIN cmx_clientes cli
					ON oc.cli_id=cli.id
					WHERE ma.id=" . $id_tabla;
			}
			if ($modulo == 'CU') {
				$sql = "SELECT cu.id, cu.fecha AS 'fecha_realizacion', cu.hora,
						cli.nombre AS 'cliente'
						FROM cmx_cumplido cu
						INNER JOIN cmx_cumplido_remesa cur
						ON cu.id=cur.id_cumplido AND cur.estado=1
						INNER JOIN cmx_remesa_ordencargue roc
						ON cur.id_remesa=roc.id_remesa AND roc.estado=1
						INNER JOIN cmx_orden_cargue oc
						ON roc.id_orden_cargue=oc.id
						INNER JOIN cmx_clientes cli
						ON oc.cli_id=cli.id
						WHERE cu.id=" . $id_tabla;
			}
			if ($modulo == 'LQ') {
				$sql = "";
			}
			if ($modulo == 'SB') {
				$sql = "SELECT su.id, su.fecha AS 'fecha_realizacion', sss.nombre_cliente AS 'cliente'
					FROM cmx_subasta su
					INNER JOIN cmx_subasta_solicitud_servicio su_sss
					ON su.id=su_sss.id_subasta
					INNER JOIN cmx_solicitud_vehiculo2 sss
					ON su_sss.numer_solservicio=sss.id
					WHERE su.id=" . $id_tabla;
			}
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOExeption $e) {
			$this->_db3->rollBack();
			$error = $e->getMessage();
		}
	}
	//COTIZACION
	public function Cotizacion_Encabezado($modulo, $id_documento)
	{
		try {
			$sql = "SELECT * 
				FROM cmx_cotizaciones_serviciocliente ccs 
				WHERE ccs.n_cotizacion=" . $id_documento;
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOExeption $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function Cotizacion_Mercancia($modulo, $id_documento)
	{
		try {
			$sql = "SELECT cdm.*, tv.nombre, 
						CONCAT(C1.municipio,'-',C1.depto) AS orig, 
						CONCAT(C2.municipio,'-',C2.depto) AS dest ,
						e.empaque
						FROM cmx_detalle_mercancia2 cdm
						INNER JOIN cmx_para_tipo_vehiculo tv ON cdm.tipo_vehiculo=tv.id
						INNER JOIN cmx_municipios C1 ON cdm.origen=C1.rndc_codigo_ciudad
						INNER JOIN cmx_municipios C2 ON cdm.destino=C2.rndc_codigo_ciudad
						INNER JOIN cmx_para_tipo_empaque e ON cdm.tipo_empaque=e.id
						WHERE cdm.n_cotizacion=" . $id_documento;
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOExeption $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function Cotizacion_Especial($modulo, $id_documento)
	{
		try {
			$sql = "SELECT * FROM 
					cmx_detalle_servespecial2 cde
					WHERE cde.n_cotizacion=" . $id_documento;
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOExeption $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}
	//SOLICITUD SERVICIO
	public function Solicitud_Servicio($modulo, $id_documento)
	{
		try {
			$sql = "SELECT se.id, se.n_cotizacion, se.peso_kg,
					se.nombre_cliente, se.flete,
					mn.municipio AS origen,
					mnd.municipio AS destino,
					tcar.nombre
					FROM cmx_solicitud_vehiculo2 se
					INNER JOIN cmx_municipios mn ON se.origen=mn.rndc_codigo_ciudad
					INNER JOIN cmx_municipios mnd ON se.destino=mnd.rndc_codigo_ciudad
					INNER JOIN cmx_para_tipo_vehiculo tcar ON se.tipo_vehiculo=tcar.id
					WHERE se.id=" . $id_documento;
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOExeption $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function Solicitud_Servicio_Remitente($modulo, $id_documento)
	{
		try {
			$sql = "SELECT remss.direccion_entrega,
				remss.fecha_estimada_entrega,
				remss.hora_estimada,
				remss.telefono,
				remss.peso,
				remss.lugar,
				mn.municipio,
				mn.depto,
				remp.nombre,
				remss.id_punto
				FROM cmx_ruta_puntosentrega remss
				INNER JOIN cmx_remitente_destinatario remp ON remss.cliente=remp.id
				INNER JOIN cmx_municipios mn ON remss.municipio_entrega=mn.id
				WHERE remss.cod_ini_ruta=" . $id_documento;
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOExeption $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function Solicitud_Servicio_Destinatario($modulo, $id_documento)
	{
		try {
			$sql = "SELECT des_ss.direccion_entrega,
				des_ss.fecha_estimada_entrega,
				des_ss.hora_estimada,
				des_ss.observacion,
				des_ss.telefono,
				des_ss.peso,
				des_ss.lugar,
				mn.municipio,
				mn.depto,
				desti.nombre,
				des_ss.id_punto 
				FROM cmx_destinatarios_ss des_ss
				INNER JOIN cmx_remitente_destinatario desti ON des_ss.cliente= desti.id
				INNER JOIN cmx_municipios mn ON des_ss.municipio_entrega=mn.id
				WHERE des_ss.solicitud_servicio=" . $id_documento;
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOExeption $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}
	//ESTUDIO SEGURIDAD
	public function Ver_Estudio($modulo, $id_documento)
	{
		try {
			$sql = "SELECT estu.*
				FROM cmx_solicitudes_preestudio so
				INNER JOIN cmx_log_solicitudvehiculo2 sol ON so.id=sol.id_solictud
				LEFT JOIN cmx_estudio_vehiculo cev ON sol.id=cev.id_solicitud
				LEFT JOIN cmx_aprobacion_estudio estu ON cev.id=estu.id_estudio
				WHERE so.id=" . $id_documento;
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOExeption $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}
	//ORDEN DE CARGUE
	public function Ver_Orden_Cargue($modulo, $id_documento)
	{
		try {
			$sql = "SELECT oc.id, oc.ve_fletecotizacion, oc.ve_fletepactado,
				oc.ve_idestudiosegu, oc.mer_idservicio, oc.mer_producto,
				oc.mer_empaque, oc.mer_cantidad, oc.mer_pesomercancia, 
				oc.mer_volumen, oc.mer_contenedor1, oc.mer_contenedor2,
				oc.ca_condiciones, oc.ca_observacion, oc.ca_embalaje,
				oc.ca_fechacargue, oc.ca_horacargue, oc.ca_pesocargue,
				ve.placa, colou.color, b.anio_fabricacion, mak.marca, 
				roce.descripcion AS tipo_carroceria,
				b.tipo_vinculacion, b.clase_vehiculo, co.nombre, co.apellido1, co.apellido2, co.numero_documento, co.celular, cl.clase, t.placa AS placatrailer
				FROM cmx_orden_cargue oc
				INNER JOIN cmx_vehiculos ve ON oc.ve_idcarro=ve.id
				INNER JOIN cmx_vehiculo2 b ON ve.id=b.id_vehiculo
				LEFT JOIN cmx_rndc_clase_vehiculo cl	 ON b.clase_vehiculo=cl.id
				LEFT JOIN cmx_rndc_vehiculos_color colou ON b.color=colou.id
				LEFT JOIN cmx_rndc_vehiculos_marcas mak ON b.marca=mak.id
				LEFT JOIN cmx_rndc_vehiculos_carroceria roce ON ve.tipo_carroceria=roce.id
				INNER JOIN cmx_proveedores co ON oc.ve_id_conductor=co.id
				LEFT JOIN cmx_trailer t ON oc.ve_idtrailer=t.id
				WHERE oc.id=" . $id_documento;
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOExeption $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function Ver_Orden_Rem($modulo, $id_documento)
	{
		try {
			$sql = "SELECT a.direccion_entrega, a.fecha_estimada_entrega,
				a.observacion, a.hora_estimada, a.tipo, b.nombre, a.telefono,
				m.municipio, m.depto
				FROM cmx_ruta_puntosentrega a
				INNER JOIN cmx_remitente_destinatario b ON a.cliente=b.id
				INNER JOIN cmx_municipios m ON a.municipio_entrega=m.id
				INNER JOIN cmx_orden_cargue oc ON a.id=oc.id_remitente
				WHERE 
				oc.id=" . $id_documento . "
				ORDER BY a.tipo";
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOExeption $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function Ver_Orden_Dest($modulo, $id_documento)
	{
		try {
			$sql = "SELECT 
				bdes.solicitud_servicio, bdes.direccion_entrega, 
				bdes.fecha_estimada_entrega, bdes.observacion,
				bdes.hora_estimada, bdes.telefono, bdes.peso,
				bdes.lugar, mn.municipio, mn.depto,
				pa.nombre AS destinatario
				FROM cmx_ruta_puntosentrega a
				LEFT JOIN cmx_destinatarios_ss	bdes  ON a.cod_ini_ruta=bdes.solicitud_servicio AND a.id_punto=bdes.id_punto
				LEFT JOIN cmx_municipios mn ON bdes.municipio_entrega=mn.id
				LEFT JOIN cmx_remitente_destinatario pa ON bdes.cliente=pa.id
				INNER JOIN cmx_orden_cargue oc ON a.id=oc.id_remitente
				WHERE oc.id=" . $id_documento . "
				ORDER BY a.tipo, bdes.tipo";
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOExeption $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}
	//REMESA
	public function Ver_Remesa($modulo, $id_documento)
	{
		try {
			$sql = "SELECT ro.id_remesa, ro.id_orden_cargue,
					r.fecha_creacion, r.aplica_seguro, r.descripcion_novedad,
					r.remesa_contado, r.remesa_contraentrega,
					ag.nombre AS agencia,
					ve.placa,
					pro.nombre, pro.apellido1, pro.apellido2, pro.numero_documento,
					rr.direccion_entrega AS remdireccion, cli.nombre AS remnombre, mn.municipio AS remcity,
					rd.direccion_entrega AS desdireccion, clid.nombre AS desnombre, mnd.municipio AS descity,
					r.valor_declarado,
					b.tipo_mercancia, b.naturaleza, ser.id,
					r.soporte_novedad, r.nombre_archivo
					FROM cmx_remesa r
					INNER JOIN cmx_remesa_ordencargue ro ON r.id=ro.id_remesa
					INNER JOIN cmx_orden_cargue o ON o.id=ro.id_orden_cargue
					INNER JOIN cmx_solicitud_vehiculo2 ser ON o.mer_idservicio=ser.id
					INNER JOIN cmx_agencias ag ON ser.agencia=ag.id
					INNER JOIN cmx_vehiculos ve ON o.ve_idcarro=ve.id
					INNER JOIN cmx_proveedores pro ON o.ve_id_conductor=pro.id
					INNER JOIN cmx_ruta_puntosentrega rr ON o.id_remitente=rr.id
					INNER JOIN cmx_remitente_destinatario cli ON rr.cliente=cli.id
					INNER JOIN cmx_municipios mn ON rr.municipio_entrega=mn.id
					INNER JOIN cmx_destinatarios_ss rd ON r.id_destinatario=rd.id
					INNER JOIN cmx_remitente_destinatario clid ON rd.cliente=clid.id	
					INNER JOIN cmx_municipios mnd ON rd.municipio_entrega=mnd.id
					INNER JOIN cmx_detalle_mercancia2 b ON ser.idpareja_origen_destino=b.id
					WHERE ro.id_remesa=" . $id_documento;
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOExeption $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}
	//MANIFIESTO
	public function Ver_Manifiesto($modulo, $id_documento)
	{
		try {
			$sql = "SELECT ma.id,ma.placa,ma.tipo_manifiesto,ma.valor_total_viaje,
				ma.retencion_fuente,ma.rete_ica,ma.neto_pagar,ma.saldo,ma.Lugar,
				ma.fecha_pago,ma.cargue_pagado,ma.descargue_pagado,
				ma.observacion, CONCAT(mn.municipio,' ',mn.depto) AS origen,
				CONCAT(mnd.municipio,' ',mnd.depto) AS destino, 
				con.nombre AS conductor, 
				con.apellido1 AS conape1, con.apellido2 AS conape2,
				con.numero_documento, con.direccion, con.celular, con.rndc_categoria_licencia, CONCAT(mcon.municipio,'',mcon.depto) AS cityconductor,
				ten.nombre, ten.apellido1, ten.apellido2,
				ten.numero_documento AS docten, ten.direccion AS direten, ten.celular AS celten, CONCAT(mten.municipio,'',mten.depto) cityten,
				mak.marca, conf.nombre AS configuracion, ve2.peso, ve2.num_soat, ase.nombre AS aseguradora,
				ve2.vence_soat, tra.placa AS placa_trailer, mantici.valor_anticipo
				FROM cmx_manifiesto ma
				INNER JOIN cmx_municipios mn ON ma.origen_viaje=mn.id
				INNER JOIN cmx_municipios mnd ON ma.destino_viaje=mnd.id
				INNER JOIN cmx_proveedores con ON ma.conductor_manifiesto=con.numero_documento
				INNER JOIN cmx_municipios mcon ON con.id_municipio=mcon.id
				INNER JOIN cmx_proveedores ten ON ma.titular_manifiesto=ten.numero_documento
				INNER JOIN cmx_municipios mten ON ten.id_municipio=mten.id
				INNER JOIN cmx_vehiculos ve ON ma.placa=ve.placa
				INNER JOIN cmx_vehiculo2 ve2 ON ve.id=ve2.id_vehiculo
				INNER JOIN cmx_rndc_vehiculos_configuracion conf ON ve2.configuracion=conf.id
				INNER JOIN cmx_rndc_vehiculos_marcas mak ON ve2.marca=mak.id
				INNER JOIN cmx_rndc_vehiculos_color colou ON ve2.color=colou.id
				INNER JOIN cmx_rndc_aseguradoras ase ON ve2.aseguradora=ase.id
				LEFT JOIN cmx_trailer_vehiculo tv ON ve.id=tv.id_vehiculo AND tv.estado=1
				LEFT JOIN cmx_trailer tra ON tv.id_trailer=tra.id
				LEFT JOIN cmx_manifiesto_anticipo mantici ON ma.id=mantici.id_manifiesto
				LEFT JOIN cmx_estado_mnf_anticipo eant ON ma.id=eant.id_manifiesto
				AND mantici.id=eant.id_anticipo
				AND eant.estado=1
				WHERE ma.id=" . $id_documento;
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOExeption $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function Manifiesto_Remesas($modulo, $id_documento)
	{
		try {
			$sql = "SELECT r.id, d.tipo_servicio_mer, d.cantidad_empaque,
			d.naturaleza, d.tipo_mercancia, te.empaque, 
			co.nombre_cliente,
			aa.nombre AS nomdest, aa.documento AS docdest,
			bb.nombre AS nomrem, bb.documento AS docrem,
			CONCAT(ori.municipio,'-',ori.depto) AS origen_rem,
			CONCAT(dest.municipio,'-',dest.depto) AS destino_rem
			FROM cmx_manifiesto_remesa  mr
			INNER JOIN cmx_remesa r ON mr.id_remesa=r.id
			INNER JOIN cmx_remesa_ordencargue ro ON  r.id=ro.id_remesa 
			INNER JOIN cmx_orden_cargue o ON ro.id_orden_cargue=o.id
			INNER JOIN cmx_solicitud_vehiculo2 se ON o.mer_idservicio=se.id	
			INNER JOIN cmx_destinatarios_ss des ON r.id_destinatario=des.id	
			INNER JOIN cmx_remitente_destinatario aa ON des.cliente=aa.id	
			INNER JOIN cmx_ruta_puntosentrega rem ON o.id_remitente=rem.id
			INNER JOIN cmx_remitente_destinatario bb ON rem.cliente=bb.id
			INNER JOIN cmx_detalle_mercancia2 d ON se.idpareja_origen_destino=d.id
			INNER JOIN cmx_para_tipo_empaque te ON te.id=d.tipo_empaque
			INNER JOIN cmx_cotizaciones_serviciocliente co ON d.n_cotizacion=co.n_cotizacion
			INNER JOIN cmx_municipios ori ON d.origen=ori.rndc_codigo_ciudad
			INNER JOIN cmx_municipios dest ON d.destino=dest.rndc_codigo_ciudad
			INNER JOIN cmx_vehiculos ve ON o.ve_idcarro=ve.id 
			WHERE mr.id_manifiesto=" . $id_documento;
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOExeption $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}
	//CUMPLIDO
	public function Cumplido($modulo, $id_documento)
	{
		try {
			$sql = "SELECT cu.id, cu.placa, 
				cu.manifiesto, cu.valor_multa,
				pro.nombre namepro,
				pro.apellido1 AS proape1,
				pro.apellido2 AS proape2,
				pro.numero_documento docprop,
				te.nombre namete,
				te.apellido1 AS teape1,
				te.apellido2 AS teape2,
				te.numero_documento docte,
				con.nombre namecondu,
				con.apellido1 AS conape1,
				con.apellido2 AS conape2,
				con.numero_documento doccondu,
				cu.novedad
				FROM cmx_cumplido cu
				INNER JOIN cmx_vehiculos ve ON cu.placa=ve.placa
				INNER JOIN cmx_proveedores pro ON ve.id_propietario=pro.id
				INNER JOIN cmx_proveedores te ON ve.id_tenedor=te.id
				INNER JOIN cmx_proveedores con ON ve.id_conductor=con.id
				WHERE cu.id=" . $id_documento;
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOExeption $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function Cumplido_Remesa($modulo, $id_documento)
	{
		try {
			$sql = "SELECT id_remesa, fecha, hora, 
					observacion, tipo_fecha
					FROM cmx_cumplido_remesa
					WHERE id_cumplido=" . $id_documento;
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOExeption $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}
	//SUBASTA
	public function Subasta($modulo, $id_documento)
	{
		try {
			$sql = "SELECT sf.id, sf.id_suba, sf.num_estudioseguridad, sf.placa, 
				sf.flete_sugerido, sf.flete_propuesto, 
				vp.nombre_conductor, vp.documento_conductor,
				se.estado AS estado_flete
				FROM cmx_subasta s
				INNER JOIN cmx_subasta_flete sf ON s.id=sf.id_suba
				INNER JOIN cmx_estado_subasta_flete	se ON sf.id=se.id_suba_flete
				LEFT JOIN cmx_solicitudes_preestudio so ON so.id=sf.num_estudioseguridad
				LEFT JOIN cmx_vehiculos_preestudio vp ON so.id_preestudio=vp.id
				WHERE s.id=" . $id_documento . " GROUP BY sf.placa";
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOExeption $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function Consultar_placa_trailer($placa)
	{
		$sql = $this->_db3->prepare("SELECT t.numdoc_trailer,t.placa,t.marca,t.estado,tv.estado AS estado_asociacion, v.placa AS placa_vehiculo, 
		p.nombre, IFNULL(p.apellido1,' ') AS apellido1 , IFNULL(p.apellido2,' ') AS apellido2,v.numdoc_vehiculo FROM cmx_trailer t
		INNER JOIN cmx_trailer_vehiculo tv ON t.numdoc_trailer=tv.id_trailer
		INNER JOIN cmx_vehiculos v ON tv.id_vehiculo=v.numdoc_vehiculo
		INNER JOIN cmx_proveedores p ON v.id_conductor=p.numdoc_nexos
		WHERE t.placa=:placa ORDER BY t.numdoc_trailer ASC");
		$sql->bindParam(':placa', $placa, PDO::PARAM_STR);
		$sql->execute();
		$resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $resultados;
	}

	public function Liberar_placa_trailer($trailerId, $vehiculoId)
	{
		$estado = 0;
		$estado_solicitud = 'Disponible';
		$sql_liberar = $this->_db3->prepare("UPDATE cmx_trailer_vehiculo v 
		INNER JOIN cmx_trailer t ON v.id_trailer=t.numdoc_trailer
		SET v.estado=:estado,t.estado_solicitud=:estado_solicitud WHERE id_vehiculo=:id_vehiculo AND id_trailer=:id_trailer");
		$sql_liberar->bindParam(':estado', $estado, PDO::PARAM_STR);
		$sql_liberar->bindParam(':estado_solicitud', $estado_solicitud, PDO::PARAM_STR);
		$sql_liberar->bindParam(':id_vehiculo', $vehiculoId, PDO::PARAM_STR);
		$sql_liberar->bindParam(':id_trailer', $trailerId, PDO::PARAM_STR);
		$sql_liberar->execute();
		if ($sql_liberar) {
			return true;
		} else {
			return false;
		}
	}
}
