<?php
date_default_timezone_set('America/Bogota');
class web_serviceModel extends Model
{

	public function __construct()
	{
		parent::__construct();
	}

	public function Genera_Consulta($filtro, $manifiesto)
	{ //TERCEROS
		$resultado = $this->_db2->conectar();
		try {

			if ($filtro == 1) { //conductor
				$sqls = "SELECT pro.nombre, pro.numero_documento,
					pro.tipo_documento, pro.celular, pro.direccion,
					mun.rndc_codigo_ciudad, 
					pro.rndc_numero_licencia,
					pro.rndc_vencimiento_licencia,
					pro.rndc_categoria_licencia
					FROM cmx_manifiesto ma
					INNER JOIN cmx_proveedores pro 
					ON ma.conductor_manifiesto=pro.numero_documento
					INNER JOIN cmx_municipios mun
					ON pro.id_municipio=mun.id
					WHERE ma.id=" . $manifiesto . "
					AND ma.estadomnf_actual=1";
			}
			if ($filtro == 2) { //propietario
				$sqls = "SELECT pro.nombre, pro.numero_documento,
					pro.tipo_documento, pro.celular, pro.direccion,
					mun.rndc_codigo_ciudad
					FROM cmx_manifiesto ma
					INNER JOIN cmx_vehiculos ve
					ON ma.placa=ve.placa
					INNER JOIN cmx_proveedores pro
					ON ve.id_propietario=pro.numdoc_nexos
					INNER JOIN cmx_municipios mun
					ON pro.id_municipio=mun.id
					WHERE ma.id=" . $manifiesto;
			}
			if ($filtro == 3) { //poseedor
				$sqls = "SELECT pro.nombre, pro.numero_documento,
					pro.tipo_documento, pro.celular, pro.direccion,
					mun.rndc_codigo_ciudad
					FROM cmx_manifiesto ma
					INNER JOIN cmx_vehiculos ve
					ON ma.placa=ve.placa
					INNER JOIN cmx_proveedores pro
					ON ve.id_tenedor=pro.numdoc_nexos
					INNER JOIN cmx_municipios mun
					ON pro.id_municipio=mun.id
					WHERE ma.id=" . $manifiesto;
			}
			if ($filtro == 4) { //destinatario
				$sqls = "SELECT aa.nombre, aa.documento,aa.tipo_documento,aa.celular,aa.contacto,aa.direccion, mn.rndc_codigo_ciudad
					FROM cmx_manifiesto_remesa  mr
					INNER JOIN cmx_remesa r
					ON mr.id_remesa=r.id
					INNER JOIN cmx_remesa_ordencargue ro
					ON  r.id=ro.id_remesa 
					INNER JOIN cmx_orden_cargue o
					ON ro.id_orden_cargue=o.id
					INNER JOIN cmx_solicitud_vehiculo2 se
					ON o.mer_idservicio=se.id	
					INNER JOIN cmx_destinatarios_ss des
					ON r.id_destinatario=des.id	
					INNER JOIN cmx_remitente_destinatario aa
					ON des.cliente=aa.id	
					INNER JOIN cmx_municipios mn
					ON aa.id_ciudad=mn.id
					WHERE mr.id_manifiesto=" . $manifiesto;
			}
			if ($filtro == 5) { //remitente
				$sqls = "SELECT rem.nombre, 
					rem.documento,
					rem.tipo_documento,
					rem.celular,
					rem.contacto,
					rem.direccion,
					mun.rndc_codigo_ciudad 
					FROM cmx_manifiesto ma
					INNER JOIN cmx_manifiesto_remesa mnr
					ON ma.id=mnr.id_manifiesto AND mnr.estado=1
					INNER JOIN cmx_remesa_ordencargue roc
					ON mnr.id_remesa=roc.id_remesa AND roc.estado=1
					INNER JOIN cmx_orden_cargue oc
					ON roc.id_orden_cargue=oc.id
					INNER JOIN cmx_ruta_puntosentrega b
					ON oc.id_remitente=b.id
					INNER JOIN cmx_remitente_destinatario rem
					ON b.cliente=rem.id
					INNER JOIN cmx_municipios mun
					ON rem.id_ciudad=mun.id
					WHERE ma.id=" . $manifiesto;
			}
			if ($filtro == 6) { //titular manifiesto - tenedor
				$sqls = "SELECT pro.nombre, pro.numero_documento,
					pro.tipo_documento, pro.celular, pro.direccion,
					mun.rndc_codigo_ciudad
					FROM cmx_manifiesto ma
					INNER JOIN cmx_proveedores pro
					ON ma.titular_manifiesto=pro.numero_documento
					INNER JOIN cmx_municipios mun
					ON pro.id_municipio=mun.id
					WHERE ma.id=" . $manifiesto;
			}
			if ($filtro == 7) { //generador de carga
				$sqls = "";
			}

			$resultado = $this->_db3->query($sqls);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOException $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function Genera_Consulta_vehiculo($filtro, $manifiesto)
	{
		$resultado = $this->_db2->conectar();
		try {
			if ($filtro == 1) { //vehículo
				$sql = "SELECT ma.placa,
					conf.rndc_id AS rndc_confi,
					mc.rndc_id AS rndc_marca,
					lin.rndc_id AS rndc_linea,
					ve2.anio_fabricacion,
					ve2.cod_tipo_combustible,
					ve2.peso,
					col.rndc_id AS rndc_color,
					carr.rndc_id AS rndc_carroceria,
					pro.tipo_documento,
					pro.numero_documento,
					ten.tipo_documento as tipotene,
					ten.numero_documento as numtene,
					ve2.num_soat, ve2.vence_soat, 
					ve2.aseguradora,
					tra.placa AS placa_trailer
					FROM cmx_manifiesto ma
					INNER JOIN cmx_vehiculos ve
					ON ma.placa=ve.placa
					INNER JOIN cmx_vehiculo2 ve2
					ON ve.id=ve2.id_vehiculo
					INNER JOIN cmx_rndc_vehiculos_configuracion conf
					ON ve2.configuracion=conf.id
					INNER JOIN cmx_rndc_vehiculos_marcas mc
					ON ve2.marca=mc.marca
					INNER JOIN cmx_rndc_vehiculos_linea lin
					ON ve2.linea=lin.descripcion 
					AND mc.rndc_id=lin.id_marca
					INNER JOIN cmx_rndc_vehiculos_color col
					ON ve2.color=col.color
					INNER JOIN cmx_rndc_vehiculos_carroceria carr
					ON ve.tipo_carroceria=carr.descripcion
					INNER JOIN cmx_proveedores pro
					ON ve.id_propietario=pro.numdoc_nexos
					INNER JOIN cmx_proveedores ten
					ON ve.id_tenedor=ten.numdoc_nexos
					LEFT JOIN cmx_trailer_vehiculo tv
					ON ve.id=tv.id_vehiculo AND tv.estado=1
					LEFT JOIN cmx_trailer tra
					ON tv.id_trailer=tra.id
					WHERE ma.id=" . $manifiesto;
			}
			if ($filtro == 2) { //semiremolque
				$sql = "SELECT ma.placa,
					tra.placa AS placa_trailer,
					conf.rndc_id AS rndc_confi,
					tm.codigo AS rndc_tra,
					tra.modelo,
					tra.peso_vacio,
					tra.capacidad,
					tram.id AS id_tramite,
					tcarro.rndc_id AS rndc_carroceria,
					pro.tipo_documento,
					pro.numero_documento,
					ten.tipo_documento AS tentipo,
					ten.numero_documento AS tendocu
					FROM cmx_manifiesto ma
					INNER JOIN cmx_vehiculos ve
					ON ma.placa=ve.placa
					LEFT JOIN cmx_trailer_vehiculo tv
					ON ve.id=tv.id_vehiculo AND tv.estado=1
					LEFT JOIN cmx_trailer tra
					ON tv.id_trailer=tra.id
					LEFT JOIN cmx_rndc_vehiculos_configuracion conf
					ON tra.configuracion=conf.id
					LEFT JOIN  cmx_rndc_trailermarcas tm
					ON tra.marca=tm.codigo
					LEFT JOIN cmx_rndc_trailertramites tram
					ON tra.tipo_tramite=tram.id
					LEFT JOIN cmx_rndc_vehiculos_carroceria tcarro
					ON tra.carroceria=tcarro.rndc_id
					LEFT JOIN cmx_proveedores pro
					ON tra.doc_propietario=pro.numero_documento
					LEFT JOIN cmx_proveedores ten
					ON ve.id_tenedor=ten.numdoc_nexos
					WHERE ma.id=" . $manifiesto;
			}
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOException $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	//consultas remesas
	public function Genera_Consulta_Retransmite($filtro, $opcion, $num_docu, $fecha)
	{
		try {

			if ($filtro == 1) { //REMESA
				if ($opcion == 3) {
					$sql = "SELECT  re.id AS id_documento, rt.rta_ministerio, rt.estado, rt.xml_remesa, MAX(rt.id)
					FROM cmx_remesa re LEFT JOIN cmx_remesas_transmision rt ON re.id=rt.id_remesa WHERE re.id=" . $num_docu;
				}
				if ($opcion == 4) {
					$sql = "SELECT  re.id AS id_documento, rt.rta_ministerio, rt.estado, rt.xml_remesa, MAX(rt.id)
					FROM cmx_remesa re LEFT JOIN cmx_remesas_transmision rt ON re.id=rt.id_remesa WHERE re.fecha_creacion='" . $fecha . "'";
				}
			}

			if ($filtro == 2) { //MANIFIESTO
				if ($opcion == 3) { //busca por numero
					$sql = "SELECT m.id AS id_documento, w.estado_envio_rndc AS estado, rta_ministerio, MAX(w.id) 
						FROM 	cmx_manifiesto m
						LEFT JOIN 	web_service_rndc2 w	 ON  m.id=w.codigo_proceso AND w.tipo='Manifiesto'	
						WHERE m.id=" . $num_docu;
				}
				if ($opcion == 4) { //busca por fecha
					$sql = "SELECT m.id AS id_documento, w.estado_envio_rndc AS estado, 
						rta_ministerio, MAX(w.id) 
						FROM 	cmx_manifiesto m
						LEFT JOIN 	web_service_rndc2 w	
						ON  m.id=w.codigo_proceso AND w.tipo='Manifiesto'	
						WHERE m.fecha_expedicion='" . $fecha . "'";
				}
			}
			
			if ($filtro == 3) { //CUMPLIDO
				if ($opcion == 3) {
					$sql = "SELECT cu.id AS id_documento, cu.manifiesto, 
					wcu.estado_envio_rndc AS estado, 
					wcu.rta_ministerio, MAX(wcu.id) 
					FROM cmx_cumplido cu
					LEFT JOIN web_service_rndc_cu wcu ON cu.manifiesto=wcu.codigo_proceso 
					AND wcu.tipo='cumplido manifiesto'
					WHERE cu.manifiesto=" . $num_docu;
				}
				if ($opcion == 4) {
					$sql = "SELECT cu.id AS id_documento, cu.manifiesto,
					wcu.estado_envio_rndc AS estado, 
					wcu.rta_ministerio, MAX(wcu.id)  
					FROM cmx_cumplido cu
					LEFT JOIN web_service_rndc_cu wcu
					ON cu.manifiesto=wcu.codigo_proceso 
					AND wcu.tipo='cumplido manifiesto'
					WHERE cu.fecha='" . $fecha . "'";
				}
			}
			if ($filtro == 4) { //CLIENTES
				if ($opcion == 3) {
					$sql = "SELECT cl.documento AS id_documento, 
					ws.estado_envio_rndc AS estado, 
					ws.rta_ministerio, MAX(ws.id)  
					FROM cmx_clientes cl
					LEFT JOIN web_service_rndc ws
					ON cl.documento=ws.codigo_proceso
					WHERE cl.documento=" . $num_docu;
				}
				if ($opcion == 4) {
					$sql = "";
				}
			}
			if ($filtro == 5) { //REMITENTES
				if ($opcion == 3) {
					$sql = "SELECT rm.documento AS id_documento, ws.estado_envio_rndc AS estado, 
					ws.rta_ministerio, MAX(ws.id)  
					FROM cmx_remitente_destinatario rm
					LEFT JOIN web_service_rndc ws
					ON rm.documento=ws.codigo_proceso
					WHERE rm.documento=" . $num_docu;
				}
			}

			if ($filtro == 6) { //Terceros
				if ($opcion == 3) {
					$sql = "SELECT pro.numero_documento AS id_documento, ws.estado_envio_rndc AS estado,
					ws.rta_ministerio, MAX(ws.id) 
					FROM cmx_proveedores pro
					LEFT JOIN web_service_rndc ws
					ON pro.numero_documento=ws.codigo_proceso
					WHERE pro.numero_documento=" . $num_docu;
				}
			}

			if ($filtro == 7) { //Trailer
				if ($opcion == 3) {
					$sql = "	SELECT tra.placa AS id_documento, ws.estado_envio_rndc AS estado,
					ws.rta_ministerio, MAX(ws.id)
					FROM cmx_trailer tra
					LEFT JOIN web_service_rndc ws
					ON tra.placa=ws.codigo_proceso
					WHERE tra.placa='" . $num_docu . "'";
				}
			}

			if ($filtro == 8) { //vehiculo
				if ($opcion == 3) {
					$sql = "SELECT ve.placa AS id_documento, 
					ws.estado_envio_rndc AS estado,
					ws.rta_ministerio, MAX(ws.id) 
					FROM cmx_vehiculos ve
					LEFT JOIN web_service_rndc ws
					ON ve.placa=ws.codigo_proceso
					WHERE ve.placa='" . $num_docu . "'";
				}
			}


			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOException $e) {
			$error = $e->getMessage();
			$this->_db2->rollBack();
		}
	}


	public function Consulta_rta_rndc($filtro, $opcion, $num_mnf, $fecha)
	{
		try {

			if ($filtro == 1) { //REMES
				if ($opcion == 3) {
				}
				if ($opcion == 4) {
				}
			}
			if ($filtro == 2) { //MANIFIESTO
				if ($opcion == 3) {
					$sql = "SELECT m.id, w.*, xm.* FROM 
						web_service_rndc2 w INNER JOIN 
						cmx_manifiesto m
						ON w.tipo='Manifiesto' AND w.codigo_proceso=m.id   
						INNER JOIN cmx_xml_manifiesto xm ON
						m.id=xm.num_manifiesto
						WHERE w.estado_envio_rndc=0 AND m.id=" . $num_docu;
				}
				if ($opcion == 4) {
					$sql = "SELECT m.id, w.*, xm.* FROM 
						web_service_rndc2 w INNER JOIN 
						cmx_manifiesto m
						ON w.tipo='Manifiesto' AND w.codigo_proceso=m.id   
						INNER JOIN cmx_xml_manifiesto xm ON
						m.id=xm.num_manifiesto
						WHERE w.estado_envio_rndc=0 
						AND m.fecha_expedicion='" . $fecha . "'";
				}
			}
			if ($filtro == 3) { //CUMPLIDO

			}

			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOException $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	//consultas manifiesto
	public function Genera_Consulta_Manifiesto($filtro, $num_docu)
	{
		$resultado = $this->_db2->conectar();
		try {
			$sql = "SELECT * FROM cmx_xml_manifiesto WHERE num_manifiesto=" . $num_docu;
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOException $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function bus_tercero($id)
	{
		(int) $id;
		try {
			$this->_db3->beginTransaction();
			$sql = "select count(*)as numero,tipo_documento 
				from cmx_proveedores where numero_documento = " . $id;
			$result = $this->_db3->query($sql);
			$this->_db3->commit();
			return $result->fetch();
		} catch (PDOException $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function Vehiculo_Ministerio($placa)
	{
		try {
			$this->_db3->beginTransaction();
			$sql = "SELECT ve.placa, ma.rndc_id AS rndc_marca, lin.rndc_id AS rndc_linea,
					pro.numero_documento AS doc_pro, pro.tipo_documento AS tdoc_pro,
					pro.digito_verificacion AS digito_prop,
					ten.numero_documento AS doc_ten, ten.tipo_documento AS tdoc_ten,
					ten.digito_verificacion AS dig_posee,
					col.rndc_id AS color, ve2.anio_fabricacion, 
					gu.rndc_id AS rndc_vehiculo, ve2.peso,
					ve2.capacidad_tn, carro.rndc_id AS rndc_carroceria,
					ve2.cod_tipo_combustible, ve2.num_soat, ve2.vence_soat,
					ase.rndc_id AS rndc_aseguradora, gu.rndc_id_trailer, gu.rndc_id AS ccompleta
					FROM cmx_vehiculos ve
					INNER JOIN cmx_vehiculo2 ve2
					ON ve.numdoc_vehiculo=ve2.id_vehiculo
					INNER JOIN cmx_rndc_vehiculos_marcas ma
					ON ve2.marca=ma.id
					INNER JOIN cmx_rndc_vehiculos_linea lin
					ON ve2.linea=lin.id
					INNER JOIN cmx_rndc_vehiculos_color col	
					ON ve2.color=col.id
					INNER JOIN cmx_rndc_vehiculos_configuracion gu
					ON ve2.configuracion=gu.id
					INNER JOIN cmx_rndc_vehiculos_carroceria carro
					ON ve.tipo_carroceria=carro.id
					INNER JOIN cmx_rndc_aseguradoras ase
					ON ve2.aseguradora=ase.id
					INNER JOIN cmx_proveedores pro
					ON ve.id_propietario=pro.numdoc_nexos
					INNER JOIN cmx_proveedores ten 
					ON ve.id_tenedor=ten.numdoc_nexos
					INNER JOIN cmx_proveedores condu
					ON ve.id_conductor=condu.numdoc_nexos
					WHERE ve.placa='" . $placa . "'";
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOException $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function Trailer_Ministerio($placa)
	{
		try {
			$this->_db3->beginTransaction();
			$sql = "SELECT placa,mk.codigo AS rndc_marca,tra.peso_vacio, 
					tra.modelo, confi.rndc_id AS rndc_configuracion,
					confi.nombre, tra.capacidad, ce.rndc_id AS rndc_carroceria,
					pro.tipo_documento AS tdoc_propietario, pro.numero_documento AS doc_propietario, pro.digito_verificacion AS digito_propietario,
					ten.tipo_documento AS tdoc_poseedor, ten.numero_documento AS doc_poseedor, ten.digito_verificacion AS digito_poseedor
					FROM cmx_trailer tra
					INNER JOIN cmx_rndc_trailermarcas mk
					ON tra.marca=mk.id
					INNER JOIN cmx_rndc_vehiculos_configuracion confi
					ON tra.configuracion=confi.id AND confi.tipo='Remolque'
					INNER JOIN cmx_rndc_vehiculos_carroceria ce
					ON tra.carroceria=ce.id
					INNER JOIN cmx_proveedores  pro
					ON tra.doc_propietario=pro.numdoc_nexos
					INNER JOIN cmx_proveedores ten
					ON tra.doc_poseedor=ten.numdoc_nexos
					WHERE tra.placa='" . $placa . "'";
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOException $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function Tercero_Ministerio($documento)
	{
		try {
			$sql = "SELECT p.id, p.tipo_documento, p.numero_documento, p.digito_verificacion, p.nombre,
					p.apellido1, p.apellido2, p.celular, p.contacto, p.direccion,
					mn.rndc_codigo_ciudad, p.rndc_categoria_licencia, p.rndc_numero_licencia,
					DATE_FORMAT(p.rndc_vencimiento_licencia, '%d/%m/%Y') AS flicencia_rndc,
					p.rndc_vencimiento_licencia
					FROM cmx_proveedores  p
					INNER JOIN cmx_municipios mn
					ON p.id_municipio=mn.id
					WHERE p.numero_documento=" . $documento;
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOException $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function Cliente_Ministerio($documento)
	{
		try {
			$sql = "SELECT cl.id, cl.tipo_documento, cl.documento, cl.digito_verificacion, cl.nombre,
			cl.telefono, cl.direccion, cl.codigo_sede, mn.rndc_codigo_ciudad, cls.nombre_sede,mn.municipio
			FROM cmx_clientes cl
			INNER JOIN cmx_municipios mn
			ON cl.ciudad=mn.id
			LEFT JOIN cmx_cliente_sede cls
			ON cl.id=cls.id_cliente
			WHERE cl.documento=" . $documento;

			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOException $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}


	public function Remitente_Ministerio($documento)
	{
		try {
			$sql = "SELECT rm.tipo_documento, rm.documento, rm.digito_verificacion,
			rm.nombre, rm.celular, rm.contacto, mn.rndc_codigo_ciudad, mn.municipio,
			rm.codigo_sede, mn.municipio AS nombre_sede, rm.direccion
			FROM cmx_remitente_destinatario rm
			INNER JOIN cmx_municipios mn
			ON rm.id_ciudad=mn.id
			WHERE rm.documento=" . $documento;
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (Exception $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}


	public function Transaccion_Nexos_Min($documento, $xml, $rta, $estadoterg, $accion)
	{
		try {
			if (!isset($_SESSION['usuario']['nom_usuario'])) {
				session_start();
				$id_usuario = $_SESSION["usuario"]["nom_usuario"];
			} else {
				$id_usuario = $_SESSION["usuario"]["nom_usuario"];
			}
			$resultado = $this->_db2->conectar();
			$factual = date('Y-m-d');
			$horactual = date('H:i:s');
			$resultado->prepare("insert into web_service_rndc(id,codigo_proceso,tipo,estado_envio_rndc,estado,cadena_xml,fecha,hora,usuario,rta_ministerio,accion)values(:id,:proceso,:tipologia,:estadoenvio,:estadodato,:cadena,:fecha,:hora,:usuario,:respuesta,:accion)
						")->execute(
				array(
					':id' => null,
					':proceso' => $documento,
					':tipologia' => 'Tercero',
					':estadoenvio' => $estadoterg,
					':estadodato' => 1,
					':cadena' => $xml,
					':fecha' => $factual,
					':hora' => $horactual,
					':usuario' => $id_usuario,
					':respuesta' => $rta,
					':accion' => $accion
				)
			);
			if ($resultado) {
				return true;
			} else {
				return false;
			}
			//session_destroy();
		} catch (PDOException $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	//transaccion de documentos de carga - planilla

	public function Transaccion_Nexos_Min2($documento, $xml, $respuesta, $estadoterg, $accion, $tipo)
	{
		try {
			if (!isset($_SESSION['usuario']['nom_usuario'])) {
				session_start();
				$id_usuario = $_SESSION["usuario"]["nom_usuario"];
			} else {
				$id_usuario = $_SESSION["usuario"]["nom_usuario"];
			}
			$resultado = $this->_db2->conectar();
			$factual = date('Y-m-d');
			$horactual = date('H:i:s');

			if ($tipo == 'Trailer') {
				$tipoa = 'Trailer';
			} else if ($tipo == 'Vehiculo') {
				$tipoa = 'Vehiculo';
			} else {
				$tipoa = '';
			}

			$resultado->prepare("insert into web_service_rndc(id,codigo_proceso,tipo,estado_envio_rndc,estado,cadena_xml,fecha,hora,usuario,rta_ministerio,tipo_tercero,accion)
			values(:id,:proceso,:tipo,:estado_envio,:estado,:cadena,:fecha,:hora,:user,:respuesta,:tipot,:accion)")->execute(
				array(
					':id' => null,
					':proceso' => $documento,
					':tipo' => $tipoa,
					':estado_envio' => $estadoterg,
					':estado' => 1,
					':cadena' => $xml,
					':fecha' => $factual,
					':hora' => $horactual,
					':user' => $id_usuario,
					':respuesta' => $respuesta,
					':tipot' => $tipoa,
					':accion' => $accion
				)
			);
			if ($resultado) {
				return true;
			} else {
				return false;
			}
			//session_destroy();
		} catch (PDOException $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function Remesa_Transmite($remesa, $rta, $estado, $xml)
	{
		try {
			if (!isset($_SESSION['usuario']['nom_usuario'])) {
				session_start();
				$id_usuario = $_SESSION["usuario"]["nom_usuario"];
			} else {
				$id_usuario = $_SESSION["usuario"]["nom_usuario"];
			}
			$resultado = $this->_db2->conectar();
			$factual = date('Y-m-d');
			$horactual = date('H:i:s');
			$resultado->prepare("insert into cmx_remesas_transmision(id,id_remesa,fecha,hora,usuario,estado,rta_ministerio,xml_remesa)
					values(:id,:id_remesa,:fecha,:hora,:user,:status,:respuesta,:xml)")->execute(
				array(
					':id' => null,
					':id_remesa' => $remesa,
					':fecha' => $factual,
					':hora' => $horactual,
					':user' => $id_usuario,
					':status' => $estado,
					':respuesta' => $rta,
					':xml' => $xml
				)
			);
			if ($resultado) {
				return true;
			} else {
				return false;
			}
		} catch (Exception $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function Consulta_Remesas_Mnf($manifiesto)
	{
		try {
			$sql = "SELECT id_remesa 
				FROM cmx_manifiesto_remesa 
				WHERE id_manifiesto=" . $manifiesto . " AND estado=1";
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchAll();
		} catch (Exception $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function Datos_Remesa($id_remesa)
	{
		try {
			$sql = "SELECT re.id,mr.id_manifiesto, me.naturaleza,
					re.cantidad_real_cargada, me.tipo_carga,
					me.tipo_mercancia,
					dest2.id AS sede_desti,
					dest2.tipo_documento,
					dest2.documento,
					dest2.digito_verificacion,
					dest2.id_ciudad,
					remi.id AS sede_remi,
					remi.tipo_documento AS tipo_documento_remi,
					remi.documento AS documento_remi,
					remi.digito_verificacion AS digito_remi,
					remi.id_ciudad AS id_ciudad_remi,
					re.fecha_cargue,
					re.hora_cargue,
					re.fecha_descargue,
					re.hora_descarga,
					oc.id AS idorden,
					tbmintran.codigo,	
					cli.id AS idcliente,
					cli.nombre AS nombre_cliente,
					cli.tipo_documento AS td_cliente,
					cli.documento AS documento_cliente,
					cli.digito_verificacion AS digito_cliente,
					re.horaspactocarga,
					re.minutospactocarga,	
					re.horaspactodescargue,
					re.minutospactodescargue,
					empa.codigo AS tipo_empaque,
					se.devol_pesovacio AS pesocontenedor1,
					oc.devol_pesovacio AS pesocontenedor2,
					se.origen,se.destino,
					ma.origen_viaje,
					ma.destino_viaje
					FROM cmx_remesa re
					INNER JOIN cmx_manifiesto_remesa mr ON re.id=mr.id_remesa AND mr.estado=1
					INNER JOIN cmx_manifiesto ma ON mr.id_manifiesto=ma.id 
					LEFT JOIN cmx_solicitud_vehiculo2 se ON re.mer_idservicio=se.nundoc_solicitud
					LEFT JOIN cmx_detalle_mercancia2 me ON se.idpareja_origen_destino=me.id
					LEFT JOIN cmx_destinatarios_ss desti ON re.id_destinatario=desti.id
					LEFT JOIN cmx_remitente_destinatario dest2 ON desti.cliente=dest2.id
					LEFT JOIN cmx_remesa_ordencargue remo ON remo.id_remesa=re.id
					LEFT JOIN cmx_orden_cargue oc ON remo.id_orden_cargue=oc.id
					LEFT JOIN cmx_ruta_puntosentrega rr ON oc.id_remitente=rr.id
					LEFT JOIN cmx_remitente_destinatario remi ON rr.cliente=remi.id
					LEFT JOIN cmx_para_tipo_mercancia mker ON me.id_mercancia=mker.id
					LEFT JOIN cmx_rndc_codificacion_producto tbmintran ON mker.id_producto_mn=tbmintran.id
					LEFT JOIN cmx_cotizaciones_serviciocliente coti ON se.n_cotizacion=coti.n_cotizacion
					LEFT JOIN cmx_clientes cli ON coti.nombre_cliente=cli.nombre
					LEFT JOIN cmx_para_tipo_empaque empa  ON me.tipo_empaque=empa.id
					WHERE re.id=" . $id_remesa;
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (Exception $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function Consulta_Informacion_carga($nummanifiesto)
	{
		try {
			$sql = "SELECT ro.id_orden_cargue,
				me.tipo_carga, empa.codigo AS tipo_empaque,
				me.naturaleza, me.tipo_mercancia,
				tbmintran.codigo, re.cantidad_real_cargada,
				oc.devol_pesovacio,
				dest2.id AS sede_dest,
				dest2.tipo_documento,
				dest2.documento,
				dest2.digito_verificacion,
				dest2.id_ciudad,
				remi.id AS sede_rem,
				remi.tipo_documento AS tipo_documento_remi,
				remi.documento AS documento_remi,
				remi.digito_verificacion AS digito_remi,
				remi.id_ciudad AS id_ciudad_remi,
				rr.fecha_estimada_entrega AS 'fecha_carga', rr.hora_estimada AS'hora_carga',
				desti.fecha_estimada_entrega AS 'fecha_descarga', desti.hora_estimada AS 'hora_descarga',
				re.horaspactocarga, re.minutospactocarga,
				re.horaspactodescargue, re.minutospactodescargue
				FROM cmx_manifiesto_remesa mre
				INNER JOIN cmx_remesa_ordencargue ro
				ON mre.id_remesa=ro.id_remesa
				LEFT JOIN cmx_orden_cargue oc
				ON ro.id_orden_cargue=oc.id
				LEFT JOIN cmx_remesa re
				ON ro.id_remesa=re.id
				LEFT JOIN cmx_solicitud_vehiculo2 se
				ON re.mer_idservicio=se.id
				LEFT JOIN cmx_detalle_mercancia2 me
				ON se.idpareja_origen_destino=me.id
				LEFT JOIN cmx_para_tipo_mercancia mker
				ON me.id_mercancia=mker.id
				LEFT JOIN cmx_para_tipo_empaque empa
				ON me.tipo_empaque=empa.id
				LEFT JOIN cmx_rndc_codificacion_producto tbmintran
				ON mker.id_producto_mn=tbmintran.id
				LEFT JOIN cmx_destinatarios_ss desti
				ON re.id_destinatario=desti.id	
				LEFT JOIN cmx_remitente_destinatario dest2
				ON desti.cliente=dest2.id
				LEFT JOIN cmx_ruta_puntosentrega rr
				ON oc.id_remitente=rr.id
				LEFT JOIN cmx_remitente_destinatario remi
				ON rr.cliente=remi.id
				WHERE mre.id_manifiesto=" . $nummanifiesto . " AND mre.estado=1";
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (Exception $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function Consulta_Informacion_viaje($nummanifiesto)
	{
		try {
			$sql = "";
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (Exception $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}


	public function Consulta_Manifiesto($manifiesto)
	{
		try {
			$sql = "SELECT ma.id, ma.fecha_expedicion,
			m1.rndc_codigo_ciudad AS origen,
			m2.rndc_codigo_ciudad AS destino,
			pro.tipo_documento AS tipo_titular,
			pro.numero_documento AS num_titular,
			pro.digito_verificacion AS digito_titular,
			ve.placa, tra.placa AS placa_trailer,
			cond.tipo_documento AS tipo_conductor,
			cond.numero_documento AS num_conductor,
			cond.digito_verificacion AS digito_conductor,
			ma.valor_total_viaje,
			FORMAT(ma.retencion_fuente,0) AS retencion_fuente,
			ma.rete_ica,
			man.valor_anticipo,
			ma.fecha_pago,
			ma.cargue_pagado,
			ma.descargue_pagado,
			ma.observacion,
			ma.tipo_manifiesto,
			ss.agencia
			FROM cmx_manifiesto ma
			INNER JOIN cmx_municipios m1 ON ma.origen_viaje=m1.id
			INNER JOIN cmx_municipios m2 ON ma.destino_viaje=m2.id
			INNER JOIN cmx_proveedores pro ON ma.titular_manifiesto=pro.numero_documento
			INNER JOIN cmx_proveedores cond ON ma.conductor_manifiesto=cond.numero_documento
			INNER JOIN cmx_vehiculos ve ON ma.placa=ve.placa
			INNER JOIN cmx_manifiesto_remesa mr ON ma.id=mr.id_manifiesto  AND mr.estado=1 AND mr.estado_rem_rndc=1
			INNER JOIN cmx_remesa rm ON mr.id_remesa=rm.id
			INNER JOIN cmx_remesa_ordencargue ro ON rm.id=ro.id_remesa
			INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue=oc.id
			INNER JOIN cmx_solicitud_vehiculo2 ss ON oc.mer_idservicio=ss.nundoc_solicitud
			LEFT JOIN cmx_trailer_vehiculo tve ON ve.numdoc_vehiculo=tve.id_vehiculo  AND tve.estado=1
			LEFT JOIN cmx_trailer tra ON tve.id_trailer=tra.id
			LEFT JOIN cmx_manifiesto_anticipo man ON ma.id=man.id_manifiesto
			WHERE ma.id=" . $manifiesto;
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (Exception $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	// public function Consulta_Remesa_Trans($num_mani)
	// {
	// 	try {
	// 		$sql = "SELECT mre.id_remesa FROM cmx_manifiesto ma
	// 				INNER JOIN cmx_manifiesto_remesa mre ON ma.id=mre.id_manifiesto
	// 				WHERE ma.id=" . $num_mani . " AND mre.estado=1";

	// 		$resultado = $this->_db3->query($sql);
	// 		$resultado->setFetchMode(PDO::FETCH_ASSOC);
	// 		return $resultado->fetchall();
	// 	} catch (Exception $e) {
	// 		$error = $e->getMessage();
	// 		$this->_db3->rollBack();
	// 	}
	// }

	public function Consulta_Remesa_Trans($num_mani)
	{
		try {
			$sql = "SELECT mre.id_remesa 
                FROM cmx_manifiesto ma
                INNER JOIN cmx_manifiesto_remesa mre ON ma.id = mre.id_manifiesto
                WHERE ma.id = :num_mani AND mre.estado = 1";

			$stmt = $this->_db3->prepare($sql);
			$stmt->bindParam(':num_mani', $num_mani, PDO::PARAM_INT);
			$stmt->execute();

			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		} catch (Exception $e) {
			// rollback solo si había transacción activa
			if ($this->_db3->inTransaction()) {
				$this->_db3->rollBack();
			}
			throw new Exception("Error en Consulta_Remesa_Trans: " . $e->getMessage());
		}
	}

	public function Remesa_Rndc($valor_remesa, $estado_rem)
	{
		try {
			$resultado = $this->_db2->conectar();
			$resultado->prepare("update cmx_manifiesto_remesa set estado_rem_rndc=:estado
						where id_remesa=:id_remesa")->execute(
				array(
					':id_remesa' => $valor_remesa,
					':estado' => $estado_rem
				)
			);
			if ($resultado) {
				return true;
			} else {
				return false;
			}
		} catch (Exception $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}


	public function numero_aprobacion($num_mani, $ingresoid)
	{
		try {
			$resultado = $this->_db2->conectar();
			$resultado->prepare("update cmx_manifiesto
						set num_autorizacion=:ingresoID
						where id=:id_manifiesto")->execute(
				array(
					':id_manifiesto' => $num_mani,
					':ingresoID' => $ingresoid
				)
			);
			if ($resultado) {
				return true;
			} else {
				return false;
			}
		} catch (Exception $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}


	public function Registro_Etiqueta($manifi, $user, $clave, $tipo, $proceso, $nitempresa, $mnfcarga, $operacion, $fecha, $origen, $destino, $titular, $numtitular, $placa, $remolque, $conductor, $numcondu, $flete, $rete, $retefu, $anti, $fechapag, $responcargue, $respondescargue, $obs, $pagosaldo, $aceptacion, $rem)
	{
		try {
			session_start();
			$resultado = $this->_db2->conectar();
			$resultado2 = $this->_db2->conectar();
			$factual = date('Y-m-d');
			$horactual = date('H:i:s');
			$id_usuario = $_SESSION["usuario"]["nom_usuario"];

			$resultado->prepare("insert into cmx_xml_manifiesto(id,num_manifiesto,username,pass_word,tipo,proceso,nitempresa,nummanifiestocarga,codoperaciontransporte,fechaexpedicionmanifiesto,codmunicipioorigenmanifiesto,codmunicipiodestinomanifiesto,codidtitularmanifiesto,munidtitularmanifiesto,numplaca,numplacaremolque,codidconductor,munidconductor,valorfletepactadoviaje,retencionicamanifiestocarga,retencionfuentemanifiesto,valoranticipomanifiesto,fechapagosaldomanifiesto,codresponsablepagocargue,cosresponsablepagodescargue,observaciones,codmunicipiopagosaldo,aceptacionelectronica)values(
					null,:nummnf,:user,:pwd,:type,:process,:nitnexos,:mnf,:operacion,:fecha,:origen,:destino,:codtitular,:numtitular,:placa,:trailer,:conduc,:numdocu,:flete,:reteica,:retefu,:anti,:fecsaldo,:respocargue,:respodescar,:observa,:munsaldo,:aceptar
				)")->execute(array(
				':nummnf' => $manifi,
				':user' => $user,
				':pwd' => $clave,
				':type' => $tipo,
				':process' => $proceso,
				':nitnexos' => $nitempresa,
				':mnf' => $mnfcarga,
				':operacion' => $operacion,
				':fecha' => $fecha,
				':origen' => $origen,
				':destino' => $destino,
				':codtitular' => $titular,
				':numtitular' => $numtitular,
				':placa' => $placa,
				':trailer' => $remolque,
				':conduc' => $conductor,
				':numdocu' => $numcondu,
				':flete' => $flete,
				':reteica' => $rete,
				':retefu' => $retefu,
				':anti' => $anti,
				':fecsaldo' => $fechapag,
				':respocargue' => $responcargue,
				':respodescar' => $respondescargue,
				':observa' => $obs,
				':munsaldo' => $pagosaldo,
				':aceptar' => $aceptacion
			));
			if ($resultado) {
				$index = 0;
				foreach ($rem as $valor) {
					$index++;
					$resultado2->prepare("insert into cmx_xml_remesas_mnf(id,consecutivoremesa,num_manifiesto)
							values(null,:valor,:nummnf)")->execute(array(
						':valor' => $valor['rem'],
						':nummnf' => $manifi
					));
				}
			}
			if ($resultado && $resultado2) {
				return true;
			} else {
				return false;
			}
			session_destroy();
		} catch (Exception $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function Registro_Trazabilidad($manifi, $xml_manifiesto, $result_manifiesto, $status)
	{
		try {
			if (!isset($_SESSION['usuario']['nom_usuario'])) {
				session_start();
				$id_usuario = $_SESSION["usuario"]["nom_usuario"];
			} else {
				$id_usuario = $_SESSION["usuario"]["nom_usuario"];
			}
			$resultado = $this->_db2->conectar();
			$factual = date('Y-m-d');
			$horactual = date('H:i:s');
			$id_usuario = $_SESSION["usuario"]["nom_usuario"];
			$resultado->prepare("insert into web_service_rndc2(id,codigo_proceso,tipo,estado_envio_rndc,estado_documento,cadena_xml,fecha,hora,usuario,rta_ministerio,accion)
				values(:id,:manifi,:tipo,:estado_rndc,:estado,:cadena,:fecha,:hora,:usuario,:rta_minis,:accion)")->execute(
				array(
					':id' => null,
					':manifi' => $manifi,
					':tipo' => 'Manifiesto',
					':estado_rndc' => $status,
					':estado' => 1,
					':cadena' => $xml_manifiesto,
					':fecha' => $factual,
					':hora' => $horactual,
					':usuario' => $id_usuario,
					':rta_minis' => $result_manifiesto,
					':accion' => 'Crear'
				)
			);
			if ($resultado) {
				return true;
			} else {
				return false;
			}
			session_destroy();
		} catch (Exception $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function Cumplido_Transmite($id, $rta, $estado, $xml)
	{
		try {
			if (!isset($_SESSION['usuario']['nom_usuario'])) {
				session_start();
				$id_usuario = $_SESSION["usuario"]["nom_usuario"];
			} else {
				$id_usuario = $_SESSION["usuario"]["nom_usuario"];
			}
			$resultado = $this->_db2->conectar();
			$factual = date('Y-m-d');
			$horactual = date('H:i:s');
			$resultado->prepare("insert into web_service_rndc_cu(id,codigo_proceso,tipo,estado_envio_rndc,estado_documento,
				cadena_xml,fecha,hora,usuario,rta_ministerio,accion)VALUES(:id,:id_proceso,:tipo,:statuse,:estado,:xml,:fecha,:hora,:user,:respuesta,:accion)")->execute(
				array(
					':id' => null,
					':id_proceso' => $id,
					':tipo' => 'cumplido manifiesto',
					':statuse' => $estado,
					':estado' => 1,
					':xml' => $xml,
					':fecha' => $factual,
					':hora' => $horactual,
					':user' => $id_usuario,
					':respuesta' => $rta,
					':accion' => 'crear'
				)
			);
			if ($resultado) {
				return true;
			} else {
				return false;
			}
		} catch (Exception $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function Estado_cliente_Rndc($id, $result_tercero, $estado_rem, $xml_tercero, $digito)
	{
		try {
			if (!isset($_SESSION['usuario']['nom_usuario'])) {
				session_start();
				$id_usuario = $_SESSION["usuario"]["nom_usuario"];
			} else {
				$id_usuario = $_SESSION["usuario"]["nom_usuario"];
			}
			$resultado = $this->_db2->conectar();
			$factual = date('Y-m-d');
			$horactual = date('H:i:s');

			$resultadob = $resultado->prepare("update cmx_clientes SET estado_actualizacion_rndc=:id WHERE documento=:id_proceso AND digito_verificacion=:digito")->execute(
				array(
					':id' => $estado_rem,
					':digito' => $digito,
					':id_proceso' => $id
				)
			);

			if ($resultadob) {
				$resultado->prepare("insert into web_service_rndc(id,codigo_proceso,tipo,estado_envio_rndc,estado,cadena_xml,fecha,hora,usuario,rta_ministerio,accion)VALUES(:id,:id_proceso,:tipo,:statuse,:estado,:xml,:fecha,:hora,:user,:respuesta,:accion)")->execute(
					array(
						':id' => null,
						':id_proceso' => $id,
						':tipo' => 'Tercero',
						':statuse' => $estado_rem,
						':estado' => 1,
						':xml' => $xml_tercero,
						':fecha' => $factual,
						':hora' => $horactual,
						':user' => $id_usuario,
						':respuesta' => $result_tercero,
						':accion' => 'crear'
					)
				);
				if ($resultado) {
					return true;
				} else {
					return false;
				}
			}
		} catch (Exception $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	//Datos del sicetac

	public function Consultar_detalle_servicios($solicitud_Id)
	{
		$date = date('Y-m-d');
		$sql = $this->_db3->prepare("SELECT tp.empaque,tm.nombre,dm.tipo_carga,tv.nombre FROM cmx_solicitud_vehiculo2 ss
			INNER JOIN cmx_cotizaciones_serviciocliente cs ON ss.n_cotizacion=cs.n_cotizacion
			INNER JOIN cmx_detalle_mercancia2 dm ON ss.n_cotizacion=dm.n_cotizacion
			INNER JOIN cmx_para_tipo_empaque tp ON dm.tipo_empaque=tp.id
			INNER JOIN cmx_para_tipo_mercancia tm ON dm.id_mercancia=tm.id
			INNER JOIN cmx_para_tipo_vehiculo tv ON dm.tipo_vehiculo=tv.id
			WHERE ss.nundoc_solicitud=:Solicitud");
		// 		$sql = $this->_db3->prepare("SELECT 
		//     r.id, 
		//     r.cantidad_real_cargada,
		//     d.tipo_servicio_mer, 
		//     d.cantidad_empaque,
		//     d.naturaleza, 
		//     d.tipo_mercancia,
		//     te.empaque, 
		//     co.nombre_cliente,
		//     rd.nombre AS nomdest, 
		//     rd.documento AS docdest,
		//     de.nombre AS nomrem, 
		//     de.documento AS docrem, 
		//     CONCAT(mnori.municipio, '-', mnori.depto) AS origen_rem, 
		//     CONCAT(mn.municipio, '-', mn.depto) AS destino_rem, 
		//     o.mer_volumen, 
		//     d.itr,
		//     mnori.rndc_codigo_ciudad AS codigo_origen,
		//     mn.rndc_codigo_ciudad AS codigo_destino,
		//     CASE 
		//         WHEN d.tipo_carga = 'G' THEN 'GENERAL'
		//         WHEN d.tipo_carga = 'V' THEN 'CONTENEDOR VACÍO'
		//         WHEN d.tipo_carga = 'C' THEN 'CONTENEDOR CARGADO'
		//         ELSE 'OTRO'
		//     END AS tipo_carga_descripcion
		// FROM 
		//     cmx_remesa r
		//     INNER JOIN cmx_remesa_ordencargue ro ON r.id = ro.id_remesa AND ro.estado = 1 AND r.fecha_creacion ='" . $date . "' AND r.estado_manifiesto = 'pendiente'
		//     INNER JOIN cmx_orden_cargue o ON ro.id_orden_cargue = o.id
		//     INNER JOIN cmx_solicitud_vehiculo2 se ON o.mer_idservicio = se.nundoc_solicitud
		//     INNER JOIN cmx_ruta_puntosentrega m ON o.id_remitente = m.id
		//     INNER JOIN cmx_remitente_destinatario rd ON m.cliente = rd.id
		//     INNER JOIN cmx_municipios mnori ON rd.id_ciudad = mnori.id
		//     INNER JOIN cmx_destinatarios_ss desti ON se.nundoc_solicitud = desti.solicitud_servicio AND m.id_punto = desti.id_punto
		//     INNER JOIN cmx_remitente_destinatario de ON desti.cliente = de.id
		//     INNER JOIN cmx_municipios mn ON desti.municipio_entrega = mn.id
		//     INNER JOIN cmx_detalle_mercancia2 d ON se.idpareja_origen_destino = d.id
		//     INNER JOIN cmx_para_tipo_empaque te ON te.id = d.tipo_empaque
		//     INNER JOIN cmx_cotizaciones_serviciocliente co ON d.n_cotizacion = co.n_cotizacion
		// WHERE 
		//     o.ve_idcarro IN (:vehiculo) 
		// GROUP BY 
		//     r.id");
		// $sql->bindParam(':fecha', $date, PDO::PARAM_STR);
		$sql->execute([':Solicitud' => $solicitud_Id]);
		return $sql->fetchAll(PDO::FETCH_ASSOC);
	}
}
