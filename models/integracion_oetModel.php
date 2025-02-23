<?php
// session_start();
class integracion_oetModel extends Model
{
	public function __construct()
	{
		parent::__construct();
	}


	public function Consultar_ambientes()
	{
		$user_id = $_SESSION['usuario']['id_usuario'];
		$empresa_id = $_SESSION['usuario']['empresa_id'];

		$sql_empresa_usuario = $this->_db3->prepare("SELECT eu.empresa_id FROM cmx_usuarios u 
			INNER JOIN cmx_empresa_usuario eu ON u.id=eu.usuario_id 
			WHERE eu.usuario_id=:usuario_id AND eu.empresa_id=:empresa_id");
		$sql_empresa_usuario->bindParam(':usuario_id', $user_id);
		$sql_empresa_usuario->bindParam(':empresa_id', $empresa_id);
		$sql_empresa_usuario->execute();
		$resultado_empresa_id = $sql_empresa_usuario->fetch(PDO::FETCH_ASSOC);

		if ($resultado_empresa_id) {
			$sql = $this->_db3->prepare("SELECT ab.nombre_ambiente,ep.nombre_empresa,ep.id AS empresa_id FROM cmx_empresas ep
		INNER JOIN cmx_ambiente ab ON ep.id=ab.empresa_id WHERE ep.id=:empresa_id");
			$sql->bindParam(':empresa_id', $resultado_empresa_id['empresa_id']);
			$sql->execute();
			$resultado = $sql->fetch(PDO::FETCH_ASSOC);
			return $resultado;
		} else {
			$mensajeError = 'Error al consultar el codigo de la agencia';
			error_log($mensajeError, 3, "error_log.txt");
		}
	}

	public function Conexion_Proveedor($ambiente, $empresa)
	{

		if ($ambiente == 'PRODUCCION') {
			$sql = $this->_db3->prepare("SELECT amb.URL_CONEXION_PRINCIPAL,amb.URL_CONSULTA_TERCERO_PRINCIPAL,amb.URL_CONSULTA_VEHICULO_PRINCIPAL,amb.URL_DOCUMENTO_PROPIETARIO_PRINCIPAL,
			amb.URL_CONSULTA_PLACA_TRAILER_PRINCIPAL,amb.URL_CONSULTA_DOCUMENTO_PROPIETARIO_TRAILER_PRINCIPAL,amb.URL_CONSULTA_ORDEN_CARGUE_PRINCIPAL,amb.URL_CONSULTA_CLIENTE_PRINCIPAL,
			amb.URL_CONSULTA_PROPIETARIO_PRINCIPAL,amb.URL_CONSULTA_POSEEDOR_PRINCIPAL,amb.URL_CONSULTA_CONDUCTOR_PRINCIPAL,amb.URL_CONSULTA_VEHICULOS_PRINCIPAL,amb.URL_CONSULTA_TRAILER_PRINCIPAL,
			amb.URL_CONSULTAR_ORDEN_CARGUE_PRINCIPAL,amb.URL_CONSULTAR_ORDEN_CARGUE_REMESA_PRINCIPAL,amb.URL_MEDIADO_ORDEN_CARGUE_PRINCIPAL,amb.URL_MEDIADOR_REMESA_PRINCIPAL,amb.URL_MEDIADOR_MANIFIESTO_PRINCIPAL,
			amb.URL_MEDIADOR_CUMPLIDO_PRINCIPAL FROM cmx_ambiente amb 
			INNER JOIN cmx_empresas ep ON amb.empresa_id=ep.id
			WHERE amb.nombre_ambiente=:ambiente AND ep.id=:empresa");
			$sql->bindParam(':ambiente', $ambiente);
			$sql->bindParam(':empresa', $empresa);
			$sql->execute();
			$resultado = $sql->fetch(PDO::FETCH_ASSOC);
		} else {
			$sql = $this->_db3->prepare("SELECT amb.URL_CONEXION_PRUEBA,amb.URL_CONSULTA_TERCERO_PRUEBA,amb.URL_CONSULTA_VEHICULO_PRUEBA,amb.URL_DOCUMENTO_PROPIETARIO_PRUEBA,
			amb.URL_CONSULTA_PLACA_TRAILER_PRUEBA,amb.URL_CONSULTA_DOCUMENTO_PROPIETARIO_TRAILER_PRUEBA,amb.URL_CONSULTA_ORDEN_CARGUE_PRUEBA,amb.URL_CONSULTA_CLIENTE_PRUEBA,
			amb.URL_CONSULTA_PROPIETARIO_PRUEBA,amb.URL_CONSULTA_POSEEDOR_PRUEBA,amb.URL_CONSULTA_CONDUCTOR_PRUEBA,amb.URL_CONSULTA_VEHICULOS_PRUEBA,amb.URL_CONSULTA_TRAILER_PRUEBA,
			amb.URL_CONSULTAR_ORDEN_CARGUE_PRUEBA,amb.URL_CONSULTAR_ORDEN_CARGUE_REMESA_PRUEBA,amb.URL_MEDIADO_ORDEN_CARGUE_PRUEBA,amb.URL_MEDIADOR_REMESA_PRUEBA,amb.URL_MEDIADOR_MANIFIESTO_PRUEBA,
			amb.URL_MEDIADOR_CUMPLIDO_PRUEBA FROM cmx_ambiente amb 
			INNER JOIN cmx_empresas ep ON amb.empresa_id=ep.id 
			WHERE amb.nombre_ambiente=:ambiente AND ep.id=:empresa");
			$sql->bindParam(':ambiente', $ambiente);
			$sql->bindParam(':empresa', $empresa);
			$sql->execute();
			$resultado = $sql->fetch(PDO::FETCH_ASSOC);
		}
		return $resultado;
	}

	public function Consulta_Recurso($tiporecurso, $filtro, $numero, $placa)
	{
		try {
			if ($tiporecurso == 1 && $filtro == 1) {
				$sql = "SELECT  id,
					tipo_documento,regimen,documento,
					digito_verificacion, nombre,
					actividad_cliente as descripcion_actividad,
					direccion,
					telefono, email
					FROM
					cmx_clientes
					WHERE documento=" . $numero;
			}
			if ($tiporecurso == 1 && $filtro == 2) {
				$sql = "SELECT id,
					tipo_documento,
					documento,digito_verificacion,
					nombre, descripcion_actividad,
					direccion, celular as telefono
					FROM
					cmx_remitente_destinatario
					WHERE
					documento=" . $numero . "
					AND estado=1";
			}
			if ($tiporecurso == 1 && $filtro == 3) {
				$sql = "SELECT p.id,
						p.tipo_documento, p.numero_documento AS 'documento', p.digito_verificacion,
						p.nombre, p.apellido1, p.apellido2,
						p.celular AS 'telefono', p.email, p.direccion
						FROM cmx_proveedores p
						INNER JOIN cmx_actividad_proveedor ap
						ON p.numdoc_nexos=ap.id_proveedor
						WHERE
						p.estado='Activo'
						AND ap.actividad='Propietario Vehiculo'
						AND p.numero_documento=" . $numero;
			}
			if ($tiporecurso == 1 && $filtro == 4) {
				$sql = "SELECT p.id,
						p.tipo_documento, p.numero_documento AS 'documento', p.digito_verificacion,
						p.nombre, p.apellido1, p.apellido2,p.celular AS 'telefono', p.email, p.direccion,
						p.rndc_categoria_licencia, p.rndc_numero_licencia, p.rndc_vencimiento_licencia
						FROM cmx_proveedores p
						INNER JOIN cmx_actividad_proveedor ap
						ON p.numdoc_nexos=ap.id_proveedor
						WHERE
						p.estado='Activo'
						AND ap.actividad='Conductor'
						AND p.numero_documento=" . $numero;
			}

			if ($tiporecurso == 1 && $filtro == 5) {
				$sql = "SELECT p.id,
						p.tipo_documento, p.numero_documento AS 'documento', p.digito_verificacion,
						p.nombre, p.apellido1, p.apellido2,p.celular AS 'telefono', p.email, p.direccion
						FROM cmx_proveedores p
						INNER JOIN cmx_actividad_proveedor ap
						ON p.numdoc_nexos=ap.id_proveedor
						WHERE
						p.estado='Activo'
						AND ap.actividad='Poseedor Vehiculo'
						AND p.numero_documento=" . $numero;
			}

			if ($tiporecurso == 2 && $filtro == 6) { //placa
				$sql = "SELECT ve.id,
					ve.placa, ve.web_satelital,
					ve.usuario_satelital,
					ve.clave_satelital,
					pro.nombre,
					ten.nombre AS poseedor,
					condu.nombre AS conductor,
					ca.descripcion AS carroceria,
					gp.operador_gps AS gpss,
					ve2.anio_fabricacion
					FROM cmx_vehiculos ve
					INNER JOIN cmx_proveedores pro
					ON ve.id_propietario=pro.numdoc_nexos
					INNER JOIN cmx_proveedores ten
					ON ve.id_tenedor=ten.numdoc_nexos
					INNER JOIN cmx_proveedores condu
					ON ve.id_conductor=condu.numdoc_nexos
					INNER JOIN cmx_rndc_vehiculos_carroceria ca
					ON ve.tipo_carroceria=ca.id
					INNER JOIN cmx_rndc_empresa_gps gp
					ON ve.empresa_gps=gp.id
					INNER JOIN cmx_vehiculo2 ve2
					ON ve.numdoc_vehiculo=ve2.id_vehiculo
					WHERE ve.placa='" . $placa . "'";
			}

			if ($tiporecurso == 2 && $filtro == 7) { //numero propietario
				$sql = "SELECT ve.id,
					ve.placa, ve.web_satelital,
					ve.usuario_satelital,
					ve.clave_satelital,
					pro.nombre,
					ten.nombre AS poseedor,
					condu.nombre AS conductor,
					ca.descripcion AS carroceria,
					gp.operador_gps AS gpss,
					ve2.anio_fabricacion
					FROM cmx_vehiculos ve
					INNER JOIN cmx_proveedores pro
					ON ve.id_propietario=pro.numdoc_nexos
					INNER JOIN cmx_proveedores ten
					ON ve.id_tenedor=ten.numdoc_nexos
					INNER JOIN cmx_proveedores condu
					ON ve.id_conductor=condu.numdoc_nexos
					INNER JOIN cmx_rndc_vehiculos_carroceria ca
					ON ve.tipo_carroceria=ca.id
					INNER JOIN cmx_rndc_empresa_gps gp
					ON ve.empresa_gps=gp.id
					INNER JOIN cmx_vehiculo2 ve2
					ON ve.numdoc_vehiculo=ve2.id_vehiculo
					WHERE ve.placa='" . $placa . "'";
			}

			if ($tiporecurso == 3 && $filtro == 8) { //placa
				$sql = "SELECT tra.id, tra.placa, tma.codigo,
					tra.peso_vacio, tra.volumen,
					tra.tipo_tramite, tra.serie_chasis,
					vc.nombre, tra.modelo, tra.alto,
					tra.largo, tra.ancho, tra.capacidad,
					ca.rndc_id AS rndc_carroceria,
					tra.caracteristica,
					pro.numero_documento,
					tra.numero_civil, ase.rndc_id AS rndc_aseguradora,
					tra.fecha_vence
					FROM cmx_trailer tra
					INNER JOIN cmx_rndc_trailermarcas tma
					ON tra.marca=tma.id
					INNER JOIN cmx_rndc_vehiculos_configuracion vc
					ON tra.configuracion=vc.id
					INNER JOIN cmx_rndc_vehiculos_carroceria ca
					ON tra.carroceria=ca.id
					INNER JOIN cmx_proveedores pro
					ON tra.doc_propietario=pro.numdoc_nexos
					INNER JOIN cmx_rndc_aseguradoras ase
					ON tra.aseguradora=ase.id
					WHERE tra.placa='" . $placa . "'";
			}
			if ($tiporecurso == 3 && $filtro == 9) {
				$sql = "SELECT tra.id, tra.placa, tma.codigo,
					tra.peso_vacio, tra.volumen,
					tra.tipo_tramite, tra.serie_chasis,
					vc.nombre, tra.modelo, tra.alto,
					tra.largo, tra.ancho, tra.capacidad,
					ca.rndc_id AS rndc_carroceria,
					tra.caracteristica,
					pro.numero_documento,
					tra.numero_civil, ase.rndc_id AS rndc_aseguradora,
					tra.fecha_vence
					FROM cmx_trailer tra
					INNER JOIN cmx_rndc_trailermarcas tma
					ON tra.marca=tma.id
					INNER JOIN cmx_rndc_vehiculos_configuracion vc
					ON tra.configuracion=vc.id
					INNER JOIN cmx_rndc_vehiculos_carroceria ca
					ON tra.carroceria=ca.id
					INNER JOIN cmx_proveedores pro
					ON tra.doc_propietario=pro.numdoc_nexos
					INNER JOIN cmx_rndc_aseguradoras ase
					ON tra.aseguradora=ase.id
					WHERE pro.numero_documento=" . $placa;
			}
			//echo $sql;
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchAll();
		} catch (PDOException $e) {
			$error = $e->getMessage();
			//$error = throw New Exception( $e->getMessage() );
			$this->_db3->rollBack();
			return $resultado = $error;
		}
	}

	public function Consulta_Tipo($tiporecurso, $filtro, $numero, $placa)
	{
		try {

			if ($tiporecurso == 1 && $filtro == 1) {
				$sql = "SELECT  cli.id,
					cli.tipo_documento,cli.regimen,cli.documento,
					cli.digito_verificacion, cli.nombre,
					cli.actividad_cliente AS 'descripcion_actividad',
					cli.direccion,
					cli.telefono,cli.email,cli.regimen, CONCAT(mnc.municipio,'',mnc.depto) AS lugar,
					cr.ciiu_principal, cr.actividad_aduanera
					FROM
					cmx_clientes cli
					INNER JOIN cmx_municipios mnc
					ON cli.ciudad=mnc.id
					LEFT JOIN cmx_clientes_documentos clid
					ON clid.id_cliente=cli.id
					LEFT JOIN cmx_clientes_rut cr
					ON clid.id=cr.id_documento
					WHERE cli.documento=" . $numero;
			}
			if ($tiporecurso == 1 && $filtro == 2) {
				$sql = "SELECT id,
					tipo_documento,
					documento,digito_verificacion,
					nombre, descripcion_actividad,
					direccion, celular as telefono
					FROM
					cmx_remitente_destinatario
					WHERE
					documento=" . $numero . "
					AND estado=1";
			}
			if ($tiporecurso == 1 && $filtro == 3) {
				$sql = "SELECT p.id,
						p.tipo_documento, p.numero_documento AS 'documento', p.digito_verificacion,
						p.nombre, p.apellido1, p.apellido2,
						p.celular AS 'telefono', p.email, p.direccion,
						p.abreviatura, p.contacto,
						CONCAT(mn.municipio,'',mn.depto) AS lugar
						FROM cmx_proveedores p
						INNER JOIN cmx_actividad_proveedor ap
						ON p.numdoc_nexos=ap.id_proveedor
						INNER JOIN cmx_municipios mn
						ON p.id_municipio=mn.id
						WHERE
						p.estado='Activo'
						AND ap.actividad='Propietario Vehiculo'
						AND p.numero_documento=" . $numero;
			}
			if ($tiporecurso == 1 && $filtro == 5) {
				$sql = "SELECT p.id,
						p.tipo_documento, p.numero_documento AS 'documento', p.digito_verificacion,
						p.nombre, p.apellido1, p.apellido2,
						p.celular AS 'telefono', p.email, p.direccion,
						p.abreviatura, p.contacto,
						CONCAT(mn.municipio,'',mn.depto) AS lugar
						FROM cmx_proveedores p
						INNER JOIN cmx_actividad_proveedor ap
						ON p.numdoc_nexos=ap.id_proveedor
						INNER JOIN cmx_municipios mn
						ON p.id_municipio=mn.id
						WHERE
						p.estado='Activo'
						AND ap.actividad='Poseedor Vehiculo'
						AND p.numero_documento=" . $numero;
			}
			if ($tiporecurso == 1 && $filtro == 4) {
				$sql = "SELECT p.id,
					p.tipo_documento, p.numero_documento, p.digito_verificacion,
					p.nombre, p.apellido1, p.apellido2,p.contacto, p.celular, p.email, p.direccion,
					p.rndc_categoria_licencia, p.rndc_numero_licencia, p.rndc_vencimiento_licencia,
					condu.celular2, condu.sexo, condu.grupo_sanguineo, condu.fecha_nacimiento,
					condu.nombre_eps, condu.fecha_vence_eps, condu.nombre_entidad, condu.vence_curso,
					mn.municipio
					FROM cmx_proveedores p
					INNER JOIN cmx_actividad_proveedor ap
					ON p.numdoc_nexos=ap.id_proveedor
					INNER JOIN cmx_detalle_conductor condu
					ON p.id=condu.id_proveedor
					INNER JOIN cmx_municipios mn
					ON p.id_municipio=mn.id
					WHERE
					p.estado='Activo'
					AND ap.actividad='Conductor'
					AND p.numero_documento=" . $numero;
			}
			if ($tiporecurso == 2 && $filtro == 6) {
				$sql = "SELECT ve.id,
					ve.placa, ve.web_satelital,
					ve.usuario_satelital,
					ve.clave_satelital,
					pro.nombre,
					ten.nombre AS poseedor,
					condu.nombre AS conductor,
					ca.descripcion AS carroceria,
					gp.operador_gps AS gpss,
					ve2.anio_fabricacion,
					cf.nombre AS configuracion,
					mc.marca, lin.descripcion,
					col.color, ve2.anio_fabricacion,
					ve2.peso, ve2.num_chasis, ve2.num_soat,
					ve2.vence_soat, ve2.num_motor,
					ve2.poliza_responsabilidad, ve2.tipo_vinculacion,
					ve2.capacidad_tn, ve2.pesobruto_kg,
					ve2.f_matricula, ase.nombre AS aseguradora,
					ve2.cod_tipo_combustible,
					ve2.anio_fabricacion,
					cla.clase,
					cri.descripcion,
					ve2.capacidad_tn, ve2.pesobruto_kg,
					ve2.num_soat, ve2.vence_soat,
					gp.nit AS nit_gps,
					dve.tecnomecanica,
					dve.tecno_fecha_expedida,
					dve.tecno_fecha_vigencia,
					ve2.num_chasis,
					pro.numero_documento AS 'docpro',
					ten.numero_documento AS 'docten',
					condu.numero_documento AS 'doccondu'
					FROM cmx_vehiculos ve
					INNER JOIN cmx_proveedores pro
					ON ve.id_propietario=pro.numdoc_nexos
					INNER JOIN cmx_proveedores ten
					ON ve.id_tenedor=ten.numdoc_nexos
					INNER JOIN cmx_proveedores condu
					ON ve.id_conductor=condu.numdoc_nexos
					INNER JOIN cmx_rndc_vehiculos_carroceria ca
					ON ve.tipo_carroceria=ca.id
					INNER JOIN cmx_rndc_empresa_gps gp
					ON ve.empresa_gps=gp.id
					INNER JOIN cmx_vehiculo2 ve2
					ON ve.numdoc_vehiculo=ve2.id_vehiculo
					INNER JOIN cmx_rndc_vehiculos_configuracion cf
					ON ve2.configuracion=cf.id
					INNER JOIN cmx_rndc_vehiculos_marcas mc
					ON ve2.marca=mc.id
					INNER JOIN cmx_rndc_vehiculos_linea lin
					ON ve2.linea=lin.id
					INNER JOIN cmx_rndc_vehiculos_color col
					ON ve2.color=col.id
					INNER JOIN cmx_rndc_aseguradoras ase
					ON ve2.aseguradora=ase.id
					INNER JOIN cmx_rndc_clase_vehiculo cla
					ON ve2.clase_vehiculo=cla.id
					INNER JOIN cmx_rndc_vehiculos_carroceria cri
					ON ve.tipo_carroceria=cri.id
					INNER JOIN cmx_detalle_vehiculo dve
					ON ve.numdoc_vehiculo=dve.id_vehiculo
					WHERE ve.placa='" . $placa . "'";
			}

			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOException $e) {
			$error = $e->getMessage();
			//$error = throw New Exception( $e->getMessage() );
			$this->_db3->rollBack();
			return $resultado = $error;
		}
	}

	public function Consulta_Financiero($tiporecurso, $filtro, $numero)
	{
		try {
			if ($tiporecurso == 1 && $filtro == 3) {
				$sql = "SELECT pf.tipo_cuenta, pf.numero_cuenta,
					t.descripcion AS tributaria,
					bank.nombre, ac.descripcion
					FROM cmx_proveedor_financieros pf
					INNER JOIN cmx_para_bancos bank
					ON pf.banco=bank.id
					INNER JOIN cmx_para_actividad_economica ac
					ON pf.actividad_economica=ac.id
					INNER JOIN cmx_para_obligacion_tributaria t
					ON pf.obliga_tributaria=t.id
					WHERE pf.id_proveedor=" . $numero;
			}
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOException $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
			return $resultado = $error;
		}
	}

	public function Consulta_Especifica($numero, $person, $id_filtro)
	{
		try {
			if ($id_filtro == 3 || $id_filtro == 5) {
				$sql = "SELECT pf.tipo_cuenta, pf.numero_cuenta,
						t.descripcion AS tributaria,
						bank.nombre, ac.descripcion
						FROM cmx_proveedor_financieros pf
						INNER JOIN cmx_para_bancos bank
						ON pf.banco=bank.id
						INNER JOIN cmx_para_actividad_economica ac
						ON pf.actividad_economica=ac.id
						INNER JOIN cmx_para_obligacion_tributaria t
						ON pf.obliga_tributaria=t.id
						WHERE pf.id_proveedor=" . $numero;
			}
			if ($id_filtro == 4) {
				$sql = "SELECT nombre_empresa, fecha_ingreso,
					fecha_retiro,persona_contacto,celular,cargo
					FROM cmx_referencias_preestudio WHERE id_conductor=" . $numero;
			}
			if ($id_filtro == 6) {
				$sql = "SELECT tra.placa AS 'placa_trailer'
					FROM cmx_trailer_vehiculo tv
					INNER JOIN cmx_trailer tra
					ON tv.id_trailer=tra.id
					WHERE tv.id_vehiculo=" . $numero . "
					AND tv.estado=1";
			}
			if ($id_filtro == 4 && $person == 1) {
				$sql = "SELECT nombre_personal,fecha_personal,
					parentezco,tel_personal
					FROM cmx_referencias_personales
					WHERE id_conductor=" . $numero;
			}
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOException $e) {
			$error = $e->getMessage();
			//$error = throw New Exception( $e->getMessage() );
			$this->_db3->rollBack();
			return $resultado = $error;
		}
	}

	/*public function Conexion_Oet(){
    $jwt  = Consultas::Conexion_Oet();
    }*/

	/**************   OET -Avansat   ************************/
	public function Datos_Tercero($recurso, $datorecurso)
	{
		try {
			if ($recurso == 1) { //cliente
				$sql = "SELECT cl.tipo_documento, cl.documento,
					cl.digito_verificacion,
					cl.nombre, mn.rndc_codigo_ciudad,
					cl.direccion, cl.telefono, cl.email,
					clr.ciiu_principal, cl.regimen,
					po.codigo AS obligacion
					FROM cmx_clientes cl
					INNER JOIN cmx_municipios mn ON cl.ciudad=mn.id
					INNER JOIN cmx_clientes_documentos cld ON cl.id=cld.id_cliente
					INNER JOIN cmx_clientes_rut clr ON cld.id=clr.id_documento
					INNER JOIN cmx_para_obligacion_tributaria po ON cl.obligacion_tributaria=po.id
					WHERE cl.documento=" . $datorecurso . "";
			}
			if ($recurso == 3) { //propietario
				$sql = "SELECT
						pro.tipo_documento,
						pro.numero_documento,
						pro.digito_verificacion,
						pro.nombre,
						pro.apellido1,
						pro.apellido2,
						pro.abreviatura,
						pro.contacto,
						pro.celular,
						pro.direccion,
						pro.email,
						mn.rndc_codigo_ciudad
						FROM cmx_proveedores pro
						INNER JOIN cmx_municipios mn ON pro.id_municipio=mn.id
						WHERE pro.numero_documento=" . $datorecurso . "
						AND pro.estado='Activo'";
			}
			if ($recurso == 4) { //conductor
				$sql = "SELECT a.tipo_documento, a.numero_documento, a.digito_verificacion,
					a.nombre, a.apellido1, a.apellido2, a.abreviatura,a.contacto, a.celular,
					a.direccion, a.email, m.rndc_codigo_ciudad,
					b.celular2, b.fecha_nacimiento, b.grupo_sanguineo,
					b.sexo, a.rndc_categoria_licencia,
					a.rndc_numero_licencia, a.rndc_vencimiento_licencia,
					MIN(ref.id),ref.id,
					ref.nombre_empresa, ref.fecha_ingreso, ref.fecha_retiro,
					ref.persona_contacto, ref.celular,
					ref.cargo, ref.antiguedad,
					MIN(per.id),
					per.id, per.nombre_personal,
					per.parentezco, per.tel_personal
					FROM cmx_proveedores a
					INNER JOIN cmx_municipios m ON a.id_municipio=m.id
					INNER JOIN cmx_detalle_conductor b ON a.numdoc_nexos=b.id_proveedor
					INNER JOIN cmx_referencias_preestudio ref ON a.numero_documento=ref.id_conductor
					INNER JOIN cmx_referencias_personales per ON a.numdoc_nexos=per.id_conductor
					WHERE a.numero_documento=" . $datorecurso . "";
			}
			if ($recurso == 5) { //poseedor
				$sql = "SELECT
					pro.tipo_documento,
					pro.numero_documento,
					pro.digito_verificacion,
					pro.nombre,
					pro.apellido1,
					pro.apellido2,
					pro.abreviatura,
					pro.contacto,
					pro.celular,
					pro.direccion,
					pro.email,
					mn.rndc_codigo_ciudad
					FROM cmx_proveedores pro
					INNER JOIN cmx_municipios mn ON pro.id_municipio=mn.id
					WHERE pro.numero_documento=" . $datorecurso . "
					AND pro.estado='Activo'";
			}
			if ($recurso == 6) { //veh placa
				$sql = "SELECT v.placa,
					 conf.nombre AS rndc_configuracion,col.rndc_id AS id_color_avansat,
					 ma.rndc_id AS id_marca_avansat, lin.rndc_id AS id_linea_avansat, ve2.cod_tipo_combustible, ve2.anio_fabricacion,
					ve2.clase_vehiculo, ca.id_carroc_avansat,
					ve2.peso, ve2.capacidad_tn,ve2.num_soat, ve2.vence_soat, ase.rndc_id AS rndc_aseguradora,
					dv.tecno_fecha_vigencia,gps.nit, v.usuario_satelital, v.clave_satelital, ve2.fecha_mant_gps,
					ve2.num_motor, ve2.num_chasis, ve2.poliza_responsabilidad,
					ve2.vence_poliza,ve2.tipo_vinculacion, dv.licencia_transito,
					p.numero_documento AS propietario,
					pe.numero_documento AS poseedor,
					co.numero_documento AS conductor,
					dv.tecnomecanica
					FROM cmx_vehiculos v
					INNER JOIN cmx_proveedores p ON v.id_propietario=p.numdoc_nexos
					INNER JOIN cmx_proveedores pe ON v.id_tenedor=pe.numdoc_nexos
					INNER JOIN cmx_proveedores co ON v.id_conductor=co.numdoc_nexos
					INNER JOIN cmx_vehiculo2 ve2 ON v.numdoc_vehiculo=ve2.id_vehiculo
					INNER JOIN cmx_rndc_vehiculos_configuracion conf ON ve2.configuracion=conf.id
					INNER JOIN cmx_rndc_vehiculos_color col ON ve2.color=col.id
					INNER JOIN cmx_rndc_vehiculos_marcas ma ON ve2.marca=ma.id
					INNER JOIN cmx_rndc_vehiculos_linea lin ON ve2.linea=lin.id
					INNER JOIN cmx_rndc_vehiculos_carroceria ca ON v.tipo_carroceria=ca.id
					INNER JOIN cmx_rndc_aseguradoras ase ON ve2.aseguradora=ase.id
					INNER JOIN cmx_detalle_vehiculo dv ON v.numdoc_vehiculo=dv.id_vehiculo
					INNER JOIN cmx_rndc_empresa_gps gps ON v.empresa_gps=gps.id
					WHERE v.placa='" . $datorecurso . "'";
			}
			if ($recurso == 7) {
				$sql = "SELECT v.placa,
					 conf.nombre AS rndc_configuracion,col.rndc_id AS id_color_avansat,
					 ma.id_marca_avansat, lin.rndc_id AS id_linea_avansat ,ve2.cod_tipo_combustible, ve2.anio_fabricacion,
					ve2.clase_vehiculo, ca.id_carroc_avansat,
					ve2.peso, ve2.capacidad_tn,ve2.num_soat, ve2.vence_soat, ase.rndc_id AS rndc_aseguradora,
					dv.tecno_fecha_vigencia,gps.nit, v.usuario_satelital, v.clave_satelital, ve2.fecha_mant_gps,
					ve2.num_motor, ve2.num_chasis, ve2.poliza_responsabilidad,
					ve2.vence_poliza,ve2.tipo_vinculacion, dv.licencia_transito,
					p.numero_documento AS propietario,
					pe.numero_documento AS poseedor,
					co.numero_documento AS conductor, dv.tecnomecanica
					FROM cmx_vehiculos v
					INNER JOIN cmx_proveedores p
					ON v.id_propietario=p.numdoc_nexos
					INNER JOIN cmx_proveedores pe
					ON v.id_tenedor=pe.numdoc_nexos
					INNER JOIN cmx_proveedores co
					ON v.id_conductor=co.numdoc_nexos
					INNER JOIN cmx_vehiculo2 ve2
					ON v.numdoc_vehiculo=ve2.id_vehiculo
					INNER JOIN cmx_rndc_vehiculos_configuracion conf
					ON ve2.configuracion=conf.id
					INNER JOIN cmx_rndc_vehiculos_color col
					ON ve2.color=col.id
					INNER JOIN cmx_rndc_vehiculos_marcas ma
					ON ve2.marca=ma.id
					INNER JOIN cmx_rndc_vehiculos_linea lin
					ON ve2.linea=lin.id
					INNER JOIN cmx_rndc_vehiculos_carroceria ca
					ON v.tipo_carroceria=ca.id
					INNER JOIN cmx_rndc_aseguradoras ase
					ON ve2.aseguradora=ase.id
					INNER JOIN cmx_detalle_vehiculo dv
					ON v.numdoc_vehiculo=dv.id_vehiculo
					INNER JOIN cmx_rndc_empresa_gps gps
					ON v.empresa_gps=gps.id
					WHERE p.numero_documento=" . $datorecurso;
			}
			if ($recurso == 8) { //trailer
				$sql = "SELECT tra.placa, tma.id_avansat,
					tra.peso_vacio, tra.volumen,
					tra.tipo_tramite, tra.serie_chasis,
					vc.nombre AS rndc_configuacion, tra.modelo, tra.alto,
					tra.largo, tra.ancho, tra.capacidad,
					ca.rndc_id AS rndc_carroceria,
					tra.caracteristica,
					pro.numero_documento,
					tra.numero_civil, ase.rndc_id AS rndc_aseguradora,
					tra.fecha_vence, tma.codigo AS rndc_marca
					FROM cmx_trailer tra
					INNER JOIN cmx_rndc_trailermarcas tma ON tra.marca=tma.id
					INNER JOIN cmx_rndc_vehiculos_configuracion vc ON tra.configuracion=vc.id
					INNER JOIN cmx_rndc_vehiculos_carroceria ca ON tra.carroceria=ca.id
					INNER JOIN cmx_proveedores pro ON tra.doc_propietario=pro.numdoc_nexos
					LEFT JOIN cmx_rndc_aseguradoras ase ON tra.aseguradora=ase.id
					WHERE tra.placa='" . $datorecurso . "'";
			}
			if ($recurso == 9) {
				$sql = "SELECT tra.placa, tma.id_avansat,
					tra.peso_vacio, tra.volumen,
					tra.tipo_tramite, tra.serie_chasis,
					vc.nombre AS rndc_configuacion, tra.modelo, tra.alto,
					tra.largo, tra.ancho, tra.capacidad,
					ca.rndc_id AS rndc_carroceria,
					tra.caracteristica,
					pro.numero_documento,
					tra.numero_civil, ase.rndc_id AS rndc_aseguradora,
					tra.fecha_vence, tma.codigo AS rndc_marca
					FROM cmx_trailer tra
					INNER JOIN cmx_rndc_trailermarcas tma
					ON tra.marca=tma.id
					INNER JOIN cmx_rndc_vehiculos_configuracion vc
					ON tra.configuracion=vc.id
					INNER JOIN cmx_rndc_vehiculos_carroceria ca
					ON tra.carroceria=ca.id
					INNER JOIN cmx_proveedores pro
					ON tra.doc_propietario=pro.numdoc_nexos
					LEFT JOIN cmx_rndc_aseguradoras ase
					ON tra.aseguradora=ase.id
					WHERE pro.numero_documento=" . $datorecurso;
			}
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetch();
		} catch (PDOException $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
			return $resultado = $error;
		}
	}

	public function Consulta_Documento_Carga($filtro, $numero)
	{
		try {
			if ($filtro == 1) {
				$sql = "SELECT oc.id,  cli.nombre,
						ve.placa
						FROM cmx_orden_cargue oc
						INNER JOIN cmx_clientes cli
						ON oc.cli_id=cli.id
						INNER JOIN cmx_vehiculos ve
						ON oc.ve_idcarro=ve.numdoc_vehiculo
						WHERE oc.id=" . $numero;
				//echo $sql;
				$resultado = $this->_db3->query($sql);
				$resultado->setFetchMode(PDO::FETCH_ASSOC);
				return $resultado->fetchall();
			}
			if ($filtro == 2) {
				$sql = "SELECT re.id, cli.nombre,ve.placa
						FROM cmx_remesa re
						INNER JOIN cmx_remesa_ordencargue roc
						ON re.id=roc.id_remesa AND roc.estado=1
						INNER JOIN cmx_orden_cargue oc
						ON roc.id_orden_cargue=oc.id AND roc.estado=1
						INNER JOIN cmx_clientes cli
						ON oc.cli_id=cli.id
						INNER JOIN cmx_vehiculos ve
						ON oc.ve_idcarro=ve.numdoc_vehiculo
						WHERE re.id=" . $numero;
				//echo $sql;
				$resultado = $this->_db3->query($sql);
				$resultado->setFetchMode(PDO::FETCH_ASSOC);
				return $resultado->fetchall();
			}
		} catch (PDOException $e) {
			$this->_db3->rollBack();
			return $resultado = $error;
		}
	}

	public function Consul_Num_Orden($numero)
	{
		try {
			/*$sql="SELECT id_orden_cargue FROM cmx_remesa_ordencargue
            WHERE id_orden_cargue=".$numero." AND estado=1";*/
			$sql = "SELECT id_orden_cargue FROM cmx_remesa_ordencargue ro
					INNER JOIN cmx_manifiesto_remesa mr
					ON ro.id_remesa=mr.id_remesa
					WHERE mr.id_manifiesto=" . $numero . " AND mr.estado=1";
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOException $e) {
			$this->_db3->rollBack();
			return $resultado = $error;
		}
	}

	public function Datos_Documento($recurso, $numero)
	{
		try {
			if ($recurso == 1) {
				$sql = "SELECT oc.fecha_orden,DATE_FORMAT(oc.hora_orden,'%h:%i')
					AS hora_orden,oc.id, me.tipo_servicio_mer, ss.agencia, age.codigo,
					ve.placa, cond.numero_documento AS documento_conductor,
					pro.numero_documento AS documento_propietario, ten.numero_documento AS documento_poseedor,
					me.cantidad_empaque, me.tipo_empaque,
					oc.mer_volumen, oc.ve_pesototal,oc.ca_pesocargue,
					ss.devol_numcont,oc.mer_contenedor2,
					oc.ca_observacion, oc.ve_fletepactado,oc.ve_tarifacalculada,
					b.tipo_documento AS td_rem, b.documento AS doc_rem, b.nombre AS nom_rem,
					mnb.rndc_codigo_ciudad AS ciu_rem, b.celular AS tel_rem, b.direccion AS dir_rem,
					rem.fecha_estimada_entrega,
					pa.tipo_documento AS td_des, pa.documento AS num_des, pa.nombre AS nom_des,
					mnpa.rndc_codigo_ciudad AS ciu_des, pa.celular AS tel_des,
					pa.direccion AS dir_des,
					pree.serie_precinto, pree.tipo_precinto, coti.nit AS nit_cliente,
					merk.id_avansat AS mercancia_avansat
					FROM cmx_orden_cargue oc
					INNER JOIN cmx_solicitud_vehiculo2 ss
					ON oc.mer_idservicio=ss.nundoc_solicitud
					INNER JOIN cmx_agencias age
					ON ss.agencia=age.id
					INNER JOIN cmx_detalle_mercancia2 me
					ON ss.n_cotizacion=me.n_cotizacion
					INNER JOIN cmx_vehiculos ve
					ON oc.ve_idcarro=ve.numdoc_vehiculo
					INNER JOIN cmx_proveedores cond
					ON oc.ve_id_conductor=cond.numdoc_nexos
					INNER JOIN cmx_proveedores pro
					ON ve.id_propietario=pro.numdoc_nexos
					INNER JOIN cmx_proveedores ten
					ON ve.id_tenedor=ten.numdoc_nexos
					LEFT JOIN cmx_planilla_detalle2 pree
					ON oc.id=pree.id_planilla
					INNER JOIN cmx_para_tipo_empaque emp
					ON me.tipo_empaque=emp.id
					INNER JOIN cmx_para_tipo_mercancia merk
					ON me.id_mercancia=merk.id
					INNER JOIN cmx_ruta_puntosentrega rem
					ON rem.id=oc.id_remitente
					INNER JOIN cmx_remitente_destinatario b
					ON rem.cliente=b.id
					INNER JOIN cmx_municipios mnb
					ON b.id_ciudad=mnb.id
					INNER JOIN cmx_ruta_puntosentrega des
					ON des.id=oc.id_remitente
					INNER JOIN cmx_destinatarios_ss bdes
					ON des.id_punto=bdes.id_punto
					AND bdes.solicitud_servicio=ss.nundoc_solicitud
					INNER JOIN cmx_remitente_destinatario pa
					ON bdes.cliente=pa.id
					INNER JOIN cmx_municipios mnpa
					ON pa.id_ciudad=mnpa.id
					INNER JOIN cmx_cotizaciones_serviciocliente coti
					ON me.n_cotizacion=coti.n_cotizacion
					WHERE oc.id=" . $numero;
			}

			if ($recurso == 2) {
				$sql = "SELECT re.fecha_creacion,
						DATE_FORMAT(re.hora_creacion,'%h:%i') AS hora_remesa,
						re.id AS num_remesa, roc.id_orden_cargue, re.remesa_contado, re.valor_declarado,
						re.aplica_seguro, re.remesa_contraentrega,
						re.fecha_cargue, re.cantidad_real_cargada,
						DATE_FORMAT(re.hora_cargue,'%h:%i') AS hora_cargue,
						re.horaspactocarga, re.minutospactocarga,
						re.fecha_descargue,
						DATE_FORMAT(re.hora_descarga,'%h:%i') AS hora_descarga,
						re.horaspactodescargue, re.minutospactodescargue,
						oc.mer_cantidad, de.tipo_servicio_mer,
						de.tipo_carga, de.total_tarifa, dest.observacion AS observacion_cliente
						FROM cmx_manifiesto_remesa mr INNER JOIN
						cmx_remesa AS re ON mr.id_remesa=re.id
						AND mr.estado=1
						INNER JOIN cmx_remesa_ordencargue roc
						ON re.id=roc.id_remesa AND roc.estado=1
						INNER JOIN cmx_orden_cargue oc
						ON roc.id_orden_cargue=oc.id AND roc.estado=1
						INNER JOIN cmx_solicitud_vehiculo2 se
						ON oc.mer_idservicio=se.nundoc_solicitud
						INNER JOIN cmx_detalle_mercancia2 de
						ON se.idpareja_origen_destino=de.id
						LEFT JOIN cmx_ruta_puntosentrega rp
						ON se.nundoc_solicitud=rp.cod_ini_ruta
						LEFT JOIN cmx_destinatarios_ss dest
						ON rp.cod_ini_ruta=dest.solicitud_servicio
						AND rp.id_punto=dest.id_punto
						WHERE
						mr.id_manifiesto=" . $numero;
			}

			if ($recurso == 3) {
				$sql = "SELECT ma.id, ma.placa, ma.conductor_manifiesto,
					ma.fecha_expedicion, ma.tipo_manifiesto,
					mn.rndc_codigo_ciudad AS 'origen',
					des.rndc_codigo_ciudad AS 'destino',
					ma.cargue_pagado, ma.descargue_pagado,
					ma.observacion,
					ma.valor_total_viaje,
					ma.retencion_fuente,
					ma.rete_ica,
					ma.neto_pagar,
					ma.fecha_pago,
					CONCAT(propi.nombre,' ',propi.apellido1,' ',propi.apellido2) AS nombre_propietario,
					mre.id_remesa, ma.hora_expedicion,
					IF(trai.placa IS NULL,'no',trai.placa) AS placa_trailer,
					IF(mant.valor_anticipo IS NULL,'no',mant.valor_anticipo) AS anticipo
					FROM cmx_manifiesto ma
					INNER JOIN cmx_municipios mn
					ON  ma.origen_viaje=mn.id
					INNER JOIN cmx_municipios des
					ON ma.destino_viaje=des.id
					INNER JOIN cmx_manifiesto_remesa mre
					ON ma.id=mre.id_manifiesto AND mre.estado=1
					INNER JOIN cmx_remesa_ordencargue reo
					ON mre.id_remesa=reo.id_remesa
					AND reo.estado=1
					INNER JOIN cmx_orden_cargue oc
					ON reo.id_orden_cargue=oc.id
					LEFT JOIN cmx_proveedores propi
					ON oc.ve_id_propietario=propi.numdoc_nexos
					LEFT JOIN cmx_trailer trai
					ON oc.ve_idtrailer=trai.id
					LEFT JOIN cmx_manifiesto_anticipo mant
					ON ma.id=mant.id_manifiesto
					WHERE ma.id=" . $numero;
			}

			if ($recurso == 4) {
				$sql = "SELECT ma.id, ma.fecha_expedicion,cum.cantidad_multa,cum.valor_multa,ma.lugar,ma.fecha_pago, CONCAT(too.fecha_cargue,' ',too.hora_cargue) AS fca_llegada, CONCAT(too2.fecha_cargue,' ',too2.hora_cargue) AS fca_entrada, CONCAT(too3.fecha_cargue,' ',too3.hora_cargue) AS fca_salida, CONCAT(te1.fecha_descargue,' ',te1.hora_descargue) AS fdc_llegada, CONCAT(te2.fecha_descargue,' ',te2.hora_descargue) AS fdc_entrada, CONCAT(te3.fecha_descargue,' ',te3.hora_descargue) AS fdc_salida,
					te1.id_remesa,mc.rta_ministerio
					FROM cmx_manifiesto ma
					INNER  JOIN cmx_cumplido cum ON ma.id=cum.manifiesto AND cum.estado=1
					INNER JOIN cmx_tiempo_cargue b ON ma.id=b.num_manifiesto
					INNER JOIN cmx_tiempo_cargue_ordenes too ON b.id=too.id_cargue AND too.tipo_fecha='fec_llegada'
					INNER JOIN cmx_tiempo_cargue_ordenes too2 ON b.id=too2.id_cargue AND too2.tipo_fecha='fec_entrada'
					INNER JOIN cmx_tiempo_cargue_ordenes too3 ON b.id=too3.id_cargue AND too3.tipo_fecha='fec_salida'
					INNER JOIN cmx_tiempo_descargue tm1 ON ma.id=tm1.num_manifiesto
					INNER JOIN cmx_tiempo_descargue_rem te1 ON tm1.id=te1.id_descargue AND te1.tipo_fecha='fec_llegada'
					INNER JOIN cmx_tiempo_descargue_rem te2 ON tm1.id=te2.id_descargue AND te2.tipo_fecha='fec_entrada'
					INNER JOIN cmx_tiempo_descargue_rem te3 ON tm1.id=te3.id_descargue AND te3.tipo_fecha='fec_salida'
					INNER JOIN web_service_rndc_cu mc ON ma.id=mc.codigo_proceso
					WHERE ma.id=" . $numero . " AND estado_envio_rndc='1' GROUP BY te1.id_remesa";

				// $sql = "SELECT ma.id, ma.fecha_expedicion,
				// 		cum.cantidad_multa,cum.valor_multa,
				// 		ma.lugar,ma.fecha_pago,
				// 		CONCAT(too.fecha_cargue,' ',too.hora_cargue) AS fca_llegada,
				// 		CONCAT(too2.fecha_cargue,' ',too2.hora_cargue) AS fca_entrada,
				// 		CONCAT(too3.fecha_cargue,' ',too3.hora_cargue) AS fca_salida,
				// 		CONCAT(te1.fecha_descargue,' ',te1.hora_descargue) AS fdc_llegada,
				// 		CONCAT(te2.fecha_descargue,' ',te2.hora_descargue) AS fdc_entrada,
				// 		CONCAT(te3.fecha_descargue,' ',te3.hora_descargue) AS fdc_salida,
				// 		te1.id_remesa,mc.rta_ministerio
				// 		FROM cmx_manifiesto ma
				// 		LEFT JOIN cmx_cumplido cum ON ma.id=cum.manifiesto AND cum.estado=1
				// 		LEFT JOIN cmx_tiempo_cargue b ON ma.id=b.num_manifiesto
				// 		LEFT JOIN cmx_tiempo_cargue_ordenes too ON b.id=too.id_cargue AND too.tipo_fecha='fec_llegada'
				// 		LEFT JOIN cmx_tiempo_cargue_ordenes too2 ON b.id=too2.id_cargue AND too2.tipo_fecha='fec_entrada'
				// 		LEFT JOIN cmx_tiempo_cargue_ordenes too3 ON b.id=too3.id_cargue AND too3.tipo_fecha='fec_salida'
				// 		LEFT JOIN cmx_tiempo_descargue tm1 ON ma.id=tm1.num_manifiesto
				// 		LEFT JOIN cmx_tiempo_descargue_rem te1 ON tm1.id=te1.id_descargue AND te1.tipo_fecha='fec_llegada'
				// 		LEFT JOIN cmx_tiempo_descargue_rem te2 ON tm1.id=te2.id_descargue AND te2.tipo_fecha='fec_entrada'
				// 		LEFT JOIN cmx_tiempo_descargue_rem te3 ON tm1.id=te3.id_descargue AND te3.tipo_fecha='fec_salida'
				// 		LEFT JOIN web_service_rndc_cu mc ON ma.id=mc.codigo_proceso
				// 		WHERE ma.id=" . $numero . " GROUP BY te1.id_remesa";
			}
			// $resultado = $this->_db3->query($sql);
			$consulta = $this->_db3->prepare($sql);
			$consulta->execute();

			// $resultado->setFetchMode(PDO::FETCH_ASSOC);
			$resultados = $consulta->fetchAll(PDO::FETCH_ASSOC);
			// var_dump($resultados);
			// exit();
			return $resultados;
		} catch (PDOException $e) {
			$this->_db3->rollBack();
			return $resultado = $error;
		}
	}

	public function Cant_Remesa($recurso, $numero)
	{
		try {
			$sql = "SELECT mr.id_remesa,rt.rta_ministerio FROM cmx_manifiesto_remesa mr
				INNER JOIN cmx_remesas_transmision rt ON mr.id_remesa=rt.id_remesa AND rt.estado=1
		 	  WHERE mr.estado=1 AND mr.id_manifiesto=" . $numero;
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOException $e) {
			$this->_db3->rollBack();
			return $resultado = $e;
		}
	}

	public function log_avansat($documento, $cadena, $rta_oet, $usuario, $estado, $identi, $agencia)
	{
		try {

			if ($identi == 'Propietario' || $identi == 'Poseedor' || $identi == 'Conductor') {
				$tipob = 'Tercero';
			} else if ($identi == 'Trailer') {
				$tipob = 'Remolque';
			} else if ($identi == 'Vehiculos') {
				$tipob = 'Vehiculo';
			} else if ($identi == 'Cliente') {
				$tipob = 'Cliente';
			} else if ($identi = 'Manifiesto') {
				$tipob = 'Manifiesto';
			} else if ($identi = 'Remesa') {
				$tipob = 'Remesa';
			} else if ($identi = 'OrdenCargue') {
				$tipob = 'OrdenCargue';
			} else if ($identi = 'Cumplido') {
				$tipob = 'Cumplido';
			}

			// Convertir el array a una cadena JSON
			$jsonString = json_encode($rta_oet);
			// Convertir el array a una cadena serializada
			$serializedString = serialize($jsonString);
			// var_dump($jsonString);
			// exit();

			$resultado = $this->_db2->conectar();
			$resultado->prepare("INSERT INTO web_service_oet(codigo_proceso,tipo,estado_envio_oet,estado,cadena,rta_oet,identificatorio,accion,fecha,usuario,agencia) VALUES(:documento,:tipo,:estado_envio_oet,:estado,:cadena,:rta_oet,:identificatorio,:accion,:fecha,:usuario,:agencia)")->execute(
				array(
					':documento' => $documento,
					':tipo' => $tipob,
					':estado_envio_oet' => $estado,
					':estado' => 1,
					':cadena' => $cadena,
					':rta_oet' => $serializedString,
					':identificatorio' => $identi,
					':accion' => 'Crear',
					':fecha' => date('Y-m-d H:i:s'),
					':usuario' => $usuario,
					':agencia' => $agencia
				)
			);





			if ($resultado) {
				return true;
			} else {
				return false;
			}
		} catch (PDOException $e) {
			$this->_db3->rollBack();
			return $resultado = $e;
		}
	}

	/********  RETRANSMISION OET  ********************** */
	public function Actividad_Tercero($documento)
	{
		try {
			$sql = "SELECT acp.actividad FROM cmx_proveedores pro
				INNER JOIN cmx_actividad_proveedor acp
				ON pro.numdoc_nexos=acp.id_proveedor
				WHERE pro.numero_documento=" . $documento;
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOException $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
			return $resultado = $error;
		}
	}

	public function Consulta_Documento_Carga2($filtro, $numero, $opcion, $fecha)
	{
		try {
			if ($filtro == 1) { //orden cargue
				if ($opcion == 'f') {
					$sql = "SELECT  oc.id  AS numero, oc.id AS valor, cli.nombre,
					ve.placa, oet.estado_envio_oet,
					oet.rta_oet
					FROM cmx_orden_cargue oc
					INNER JOIN cmx_clientes cli
					ON oc.cli_id=cli.id
					INNER JOIN cmx_vehiculos ve
					ON oc.ve_idcarro=ve.numdoc_vehiculo
					LEFT JOIN web_service_oet	oet
					ON oc.id=oet.codigo_proceso AND oet.identificatorio='OrdenCargue'
					WHERE oc.fecha_orden=" . $fecha . "
					ORDER BY oet.id DESC LIMIT 1";
					$resultado = $this->_db3->query($sql);
					$resultado->setFetchMode(PDO::FETCH_ASSOC);
					return $resultado->fetchall();
				}
				if ($opcion == 'n') {
					$sql = "SELECT  oc.id  AS numero, oc.id AS valor, cli.nombre,
					ve.placa, oet.estado_envio_oet,
					oet.rta_oet
					FROM cmx_orden_cargue oc
					INNER JOIN cmx_clientes cli
					ON oc.cli_id=cli.id
					INNER JOIN cmx_vehiculos ve
					ON oc.ve_idcarro=ve.numdoc_vehiculo
					LEFT JOIN web_service_oet	oet
					ON oc.id=oet.codigo_proceso AND oet.identificatorio='OrdenCargue'
					WHERE oc.id=" . $numero . "
					ORDER BY oet.id DESC LIMIT 1";
					$resultado = $this->_db3->query($sql);
					$resultado->setFetchMode(PDO::FETCH_ASSOC);
					return $resultado->fetchall();
				}
			}

			if ($filtro == 2) { //remesa
				if ($opcion == 'f') {
					$sql = "SELECT  re.id  AS numero, re.id AS valor, cli.nombre,ve.placa , oet.rta_oet,
						oet.estado_envio_oet
						FROM cmx_remesa re
						INNER JOIN cmx_remesa_ordencargue roc
						ON re.id=roc.id_remesa AND roc.estado=1
						INNER JOIN cmx_orden_cargue oc
						ON roc.id_orden_cargue=oc.id AND roc.estado=1
						INNER JOIN cmx_clientes cli
						ON oc.cli_id=cli.id
						INNER JOIN cmx_vehiculos ve
						ON oc.ve_idcarro=ve.numdoc_vehiculo
						LEFT JOIN 	web_service_oet oet
						ON re.id=oet.codigo_proceso AND oet.identificatorio='Remesa'
						WHERE re.fecha_creacion='" . $fecha . "'
						ORDER BY oet.id DESC LIMIT 1";
					$resultado = $this->_db3->query($sql);
					$resultado->setFetchMode(PDO::FETCH_ASSOC);
					return $resultado->fetchall();
				}
				if ($opcion == 'n') {
					$sql = "SELECT  re.id  AS numero, re.id AS valor, cli.nombre,ve.placa,oet.rta_oet, oet.estado_envio_oet
						FROM cmx_remesa re
						INNER JOIN cmx_remesa_ordencargue roc
						ON re.id=roc.id_remesa AND roc.estado=1
						INNER JOIN cmx_orden_cargue oc
						ON roc.id_orden_cargue=oc.id AND roc.estado=1
						INNER JOIN cmx_clientes cli
						ON oc.cli_id=cli.id
						INNER JOIN cmx_vehiculos ve
						ON oc.ve_idcarro=ve.numdoc_vehiculo
						LEFT JOIN 	web_service_oet oet
						ON re.id=oet.codigo_proceso AND oet.identificatorio='Remesa'
						WHERE re.id=" . $numero . "
						ORDER BY oet.id DESC LIMIT 1";
					$resultado = $this->_db3->query($sql);
					$resultado->setFetchMode(PDO::FETCH_ASSOC);
					return $resultado->fetchall();
				}
			}

			if ($filtro == 3) { // manifiesto
				if ($opcion == 'f') {
					$sql = "SELECT mn.id  AS numero, mn.id AS valor,oet.rta_oet, oet.estado_envio_oet
					 FROM cmx_manifiesto mn
					 LEFT JOIN web_service_oet oet ON mn.id=oet.codigo_proceso AND oet.identificatorio='Manifiesto'
					 WHERE mn.fecha_expedicion='" . $fecha . "' ORDER BY oet.id DESC LIMIT 1";
					$resultado = $this->_db3->query($sql);
					$resultado->setFetchMode(PDO::FETCH_ASSOC);
					return $resultado->fetchall();
				}

				if ($opcion == 'n') {
					$sql = "SELECT mn.id  AS numero, mn.id AS valor,
					oet.rta_oet, oet.estado_envio_oet
					 FROM cmx_manifiesto mn
					 LEFT JOIN web_service_oet oet
					 ON mn.id=oet.codigo_proceso AND oet.identificatorio='Manifiesto'
					 WHERE mn.id=" . $numero . " ORDER BY oet.id DESC LIMIT 1";
					$resultado = $this->_db3->query($sql);
					$resultado->setFetchMode(PDO::FETCH_ASSOC);
					return $resultado->fetchall();
				}
			}

			if ($filtro == 4) { //cumplido
				if ($opcion == 'n') {
					$sql = "SELECT cu.id  AS numero, cu.manifiesto AS valor,
						oet.estado_envio_oet, oet.rta_oet
						FROM cmx_cumplido cu
						LEFT JOIN web_service_oet oet ON cu.manifiesto=oet.codigo_proceso
						AND oet.identificatorio='Cumplido'
						WHERE cu.manifiesto=" . $numero . "
						ORDER BY oet.id DESC LIMIT 1";
					$resultado = $this->_db3->query($sql);
					$resultado->setFetchMode(PDO::FETCH_ASSOC);
					return $resultado->fetchall();
				}

				if ($opcion == 'f') {
					$sql = "SELECT MAX(oet.id), cu.id  AS numero, cu.manifiesto AS valor,
						oet.estado_envio_oet, oet.rta_oet
						FROM cmx_cumplido cu
						INNER JOIN web_service_oet oet
						ON cu.manifiesto=oet.codigo_proceso
						AND oet.identificatorio='Cumplido'
						WHERE cu.fecha='" . $fecha . "'
						ORDER BY oet.id desc";
					$resultado = $this->_db3->query($sql);
					$resultado->setFetchMode(PDO::FETCH_ASSOC);
					return $resultado->fetchall();
				}
			}

			if ($filtro == 5) { //cliente
				if ($opcion == 'n') {
					$sql = "SELECT  cli.documento  AS numero, cli.documento AS valor,
					cli.nombre AS namet, oet.rta_oet, oet.estado_envio_oet,
					cli.digito_verificacion AS digito
				 FROM  cmx_clientes cli
				 LEFT JOIN web_service_oet oet
				 ON cli.documento=oet.codigo_proceso
				 WHERE  cli.documento=" . $numero . "
				 ORDER BY oet.id DESC LIMIT 1";
					$resultado = $this->_db3->query($sql);
					$resultado->setFetchMode(PDO::FETCH_ASSOC);
					return $resultado->fetchall();
				}
			}

			if ($filtro == 6) { //terceros
				if ($opcion == 'n') {
					$sql = "SELECT pro.numero_documento  AS numero, pro.numero_documento AS valor,
					oet.estado_envio_oet, oet.rta_oet, pro.digito_verificacion AS digito,
					CONCAT(pro.nombre,' ',pro.apellido1) AS namet
				 FROM cmx_proveedores pro
				 INNER JOIN cmx_actividad_proveedor ac
				 ON pro.numdoc_nexos=ac.id_proveedor
				 LEFT JOIN web_service_oet oet
				 ON pro.numero_documento=oet.codigo_proceso
				 WHERE pro.numero_documento=" . $numero . "
				 ORDER BY oet.id DESC LIMIT 1";
					$resultado = $this->_db3->query($sql);
					$resultado->setFetchMode(PDO::FETCH_ASSOC);
					return $resultado->fetchall();
				}
			}

			if ($filtro == 7) { //trailer
				if ($opcion == 'n') {
					$sql = "SELECT tra.placa AS numero, oet.estado_envio_oet, oet.rta_oet, tra.placa AS valor
					FROM cmx_trailer tra
					LEFT JOIN web_service_oet oet
					ON tra.id=oet.codigo_proceso
					WHERE tra.placa='" . $numero . "'
					ORDER BY oet.id DESC LIMIT 1";
					$resultado = $this->_db3->query($sql);
					$resultado->setFetchMode(PDO::FETCH_ASSOC);
					return $resultado->fetchall();
				}
			}

			if ($filtro == 8) { //vehiculo
				if ($opcion == 'n') {
					$sql = "SELECT ve.placa AS numero, oet.estado_envio_oet, oet.rta_oet, ve.placa AS valor
					FROM cmx_vehiculos ve
					LEFT JOIN web_service_oet oet
					ON ve.numdoc_vehiculo=oet.codigo_proceso
					WHERE ve.placa='" . $numero . "'
					ORDER BY oet.id DESC LIMIT 1";
					$resultado = $this->_db3->query($sql);
					$resultado->setFetchMode(PDO::FETCH_ASSOC);
					return $resultado->fetchall();
				}
			}
		} catch (PDOException $e) {
			$this->_db3->rollBack();
			return $resultado = $error;
		}
	}

	public function Datos_Documento_Retransmite($recurso, $numero)
	{
		try {
			if ($recurso == 1) {
				$sql = "SELECT oc.fecha_orden,DATE_FORMAT(oc.hora_orden,'%h:%i')
					AS hora_orden,oc.id,
										me.tipo_servicio_mer, ss.agencia, age.codigo,
										ve.placa, cond.numero_documento AS documento_conductor,
										pro.numero_documento AS documento_propietario, ten.numero_documento AS documento_poseedor,
										me.cantidad_empaque, me.tipo_empaque,
										oc.mer_volumen, oc.ve_pesototal,oc.ca_pesocargue,
										ss.devol_numcont,oc.mer_contenedor2,
										oc.ca_observacion, oc.ve_fletepactado,
										oc.ve_tarifacalculada,
										b.tipo_documento AS td_rem, b.documento AS doc_rem, b.nombre AS nom_rem,
										mnb.rndc_codigo_ciudad AS ciu_rem, b.celular AS tel_rem, b.direccion AS dir_rem,
										rem.fecha_estimada_entrega,
										pa.tipo_documento AS td_des, pa.documento AS num_des, pa.nombre AS nom_des,
										mnpa.rndc_codigo_ciudad AS ciu_des, pa.celular AS tel_des,
										pa.direccion AS dir_des,
										pree.serie_precinto, pree.tipo_precinto, coti.nit AS nit_cliente,
										merk.id_avansat AS mercancia_avansat
										FROM cmx_orden_cargue oc
										INNER JOIN cmx_solicitud_vehiculo2 ss ON oc.mer_idservicio=ss.nundoc_solicitud
										INNER JOIN cmx_agencias age ON ss.agencia=age.id
										INNER JOIN cmx_detalle_mercancia2 me ON ss.n_cotizacion=me.n_cotizacion
										INNER JOIN cmx_vehiculos ve ON oc.ve_idcarro=ve.numdoc_vehiculo
										INNER JOIN cmx_proveedores cond ON oc.ve_id_conductor=cond.numdoc_nexos
										INNER JOIN cmx_proveedores pro ON ve.id_propietario=pro.numdoc_nexos
										INNER JOIN cmx_proveedores ten ON ve.id_tenedor=ten.numdoc_nexos
										LEFT JOIN cmx_planilla_detalle2 pree ON oc.id=pree.id_planilla
										INNER JOIN cmx_para_tipo_empaque emp ON me.tipo_empaque=emp.id
										INNER JOIN cmx_para_tipo_mercancia merk ON me.id_mercancia=merk.id
										INNER JOIN cmx_ruta_puntosentrega rem ON rem.id=oc.id_remitente
										INNER JOIN cmx_remitente_destinatario b ON rem.cliente=b.id
										INNER JOIN cmx_municipios mnb ON b.id_ciudad=mnb.id
										INNER JOIN cmx_ruta_puntosentrega des ON des.id=oc.id_remitente
										INNER JOIN cmx_destinatarios_ss bdes ON des.id_punto=bdes.id_punto AND bdes.solicitud_servicio=ss.nundoc_solicitud
										INNER JOIN cmx_remitente_destinatario pa ON bdes.cliente=pa.id
										INNER JOIN cmx_municipios mnpa ON pa.id_ciudad=mnpa.id
										INNER JOIN cmx_cotizaciones_serviciocliente coti ON me.n_cotizacion=coti.n_cotizacion
										WHERE oc.id=" . $numero;
			}

			if ($recurso == 2) {
				$sql = "SELECT re.fecha_creacion,
						DATE_FORMAT(re.hora_creacion,'%h:%i') AS hora_remesa,
						re.id AS num_remesa, roc.id_orden_cargue, re.remesa_contado, re.valor_declarado,
						re.aplica_seguro, re.remesa_contraentrega,
						re.fecha_cargue, re.cantidad_real_cargada,
						DATE_FORMAT(re.hora_cargue,'%h:%i') AS hora_cargue,
						re.horaspactocarga, re.minutospactocarga,
						re.fecha_descargue,
						DATE_FORMAT(re.hora_descarga,'%h:%i') AS hora_descarga,
						re.horaspactodescargue, re.minutospactodescargue,
						oc.mer_cantidad, de.tipo_servicio_mer,
						de.tipo_carga, de.total_tarifa, dest.observacion AS observacion_cliente
						FROM cmx_manifiesto_remesa mr INNER JOIN
						cmx_remesa AS re ON mr.id_remesa=re.id
						AND mr.estado=1
						INNER JOIN cmx_remesa_ordencargue roc
						ON re.id=roc.id_remesa AND roc.estado=1
						INNER JOIN cmx_orden_cargue oc
						ON roc.id_orden_cargue=oc.id AND roc.estado=1
						INNER JOIN cmx_solicitud_vehiculo2 se
						ON oc.mer_idservicio=se.nundoc_solicitud
						INNER JOIN cmx_detalle_mercancia2 de
						ON se.idpareja_origen_destino=de.id
						LEFT JOIN cmx_ruta_puntosentrega rp
						ON se.nundoc_solicitud=rp.cod_ini_ruta
						LEFT JOIN cmx_destinatarios_ss dest
						ON rp.cod_ini_ruta=dest.solicitud_servicio
						AND rp.id_punto=dest.id_punto
						WHERE mr.id_remesa=" . $numero;
			}

			if ($recurso == 3) {
				$sql = "SELECT
					ma.id, ma.placa, ma.conductor_manifiesto,
					ma.fecha_expedicion, ma.tipo_manifiesto,
					mn.rndc_codigo_ciudad AS 'origen',
					des.rndc_codigo_ciudad AS 'destino',
					ma.cargue_pagado, ma.descargue_pagado,
					ma.observacion,
					ma.valor_total_viaje,
					ma.retencion_fuente,
					ma.rete_ica,
					ma.neto_pagar,
					ma.fecha_pago, CONCAT(propi.nombre,' ',propi.apellido1,' ',propi.apellido2) AS nombre_propietario,
					mre.id_remesa, ma.hora_expedicion,
					IF(trai.placa IS NULL,'no',trai.placa) AS placa_trailer,
					IF(mant.valor_anticipo IS NULL,'no',mant.valor_anticipo) AS anticipo,rt.rta_ministerio,ma.num_autorizacion,
					ss.agencia,ag.nombre AS 'Agencia_generacion',ag.id_extermo
					FROM cmx_manifiesto ma
					INNER JOIN cmx_municipios mn ON ma.origen_viaje=mn.id
					INNER JOIN cmx_municipios des ON ma.destino_viaje=des.id
					INNER JOIN cmx_manifiesto_remesa mre ON ma.id=mre.id_manifiesto AND mre.estado=1
					INNER JOIN cmx_remesa_ordencargue reo ON mre.id_remesa=reo.id_remesa AND reo.estado=1
					INNER JOIN cmx_orden_cargue oc ON reo.id_orden_cargue=oc.id
					INNER JOIN cmx_remesa rm ON reo.id_remesa=rm.id
					INNER JOIN cmx_remesas_transmision rt ON rm.id=rt.id_remesa
					-- Nueva consulta para poder traer la agencia de generacion del documento
					INNER JOIN cmx_solicitud_vehiculo2 ss ON oc.mer_idservicio=ss.nundoc_solicitud
					INNER JOIN cmx_agencias ag ON ss.agencia=ag.id
					LEFT JOIN cmx_proveedores propi ON oc.ve_id_propietario=propi.numdoc_nexos
					LEFT JOIN cmx_trailer trai ON oc.ve_idtrailer=trai.id
					LEFT JOIN cmx_manifiesto_anticipo mant ON ma.id=mant.id_manifiesto
					WHERE ma.id=" . $numero;
				// $sql = "SELECT
				// 	ma.id, ma.placa, ma.conductor_manifiesto,
				// 	ma.fecha_expedicion, ma.tipo_manifiesto,
				// 	mn.rndc_codigo_ciudad AS 'origen',
				// 	des.rndc_codigo_ciudad AS 'destino',
				// 	ma.cargue_pagado, ma.descargue_pagado,
				// 	ma.observacion,
				// 	ma.valor_total_viaje,
				// 	ma.retencion_fuente,
				// 	ma.rete_ica,
				// 	ma.neto_pagar,
				// 	ma.fecha_pago,
				// 	CONCAT(propi.nombre,' ',propi.apellido1,' ',propi.apellido2) AS nombre_propietario,
				// 	mre.id_remesa, ma.hora_expedicion,
				// 	IF(trai.placa IS NULL,'no',trai.placa) AS placa_trailer,
				// 	IF(mant.valor_anticipo IS NULL,'no',mant.valor_anticipo) AS anticipo
				// 	FROM cmx_manifiesto ma
				// 	INNER JOIN cmx_municipios mn ON  ma.origen_viaje=mn.id
				// 	INNER JOIN cmx_municipios des ON ma.destino_viaje=des.id
				// 	INNER JOIN cmx_manifiesto_remesa mre ON ma.id=mre.id_manifiesto AND mre.estado=1
				// 	INNER JOIN cmx_remesa_ordencargue reo ON mre.id_remesa=reo.id_remesa AND reo.estado=1
				// 	INNER JOIN cmx_orden_cargue oc ON reo.id_orden_cargue=oc.id
				// 	LEFT JOIN cmx_proveedores propi ON oc.ve_id_propietario=propi.numdoc_nexos
				// 	LEFT JOIN cmx_trailer trai ON oc.ve_idtrailer=trai.id
				// 	LEFT JOIN cmx_manifiesto_anticipo mant ON ma.id=mant.id_manifiesto
				// 	WHERE ma.id=" . $numero;
			}

			if ($recurso == 4) {
				$sql = "SELECT ma.id, ma.fecha_expedicion,cum.cantidad_multa,cum.valor_multa,ma.lugar,ma.fecha_pago, CONCAT(too.fecha_cargue,' ',too.hora_cargue) AS fca_llegada, CONCAT(too2.fecha_cargue,' ',too2.hora_cargue) AS fca_entrada, CONCAT(too3.fecha_cargue,' ',too3.hora_cargue) AS fca_salida, CONCAT(te1.fecha_descargue,' ',te1.hora_descargue) AS fdc_llegada, CONCAT(te2.fecha_descargue,' ',te2.hora_descargue) AS fdc_entrada, CONCAT(te3.fecha_descargue,' ',te3.hora_descargue) AS fdc_salida,
				te1.id_remesa,mc.rta_ministerio
				FROM cmx_manifiesto ma
				INNER  JOIN cmx_cumplido cum ON ma.id=cum.manifiesto AND cum.estado=1
				INNER JOIN cmx_tiempo_cargue b ON ma.id=b.num_manifiesto
				INNER JOIN cmx_tiempo_cargue_ordenes too ON b.id=too.id_cargue AND too.tipo_fecha='fec_llegada'
				INNER JOIN cmx_tiempo_cargue_ordenes too2 ON b.id=too2.id_cargue AND too2.tipo_fecha='fec_entrada'
				INNER JOIN cmx_tiempo_cargue_ordenes too3 ON b.id=too3.id_cargue AND too3.tipo_fecha='fec_salida'
				INNER JOIN cmx_tiempo_descargue tm1 ON ma.id=tm1.num_manifiesto
				INNER JOIN cmx_tiempo_descargue_rem te1 ON tm1.id=te1.id_descargue AND te1.tipo_fecha='fec_llegada'
				INNER JOIN cmx_tiempo_descargue_rem te2 ON tm1.id=te2.id_descargue AND te2.tipo_fecha='fec_entrada'
				INNER JOIN cmx_tiempo_descargue_rem te3 ON tm1.id=te3.id_descargue AND te3.tipo_fecha='fec_salida'
				INNER JOIN web_service_rndc_cu mc ON ma.id=mc.codigo_proceso
				WHERE ma.id=" . $numero . " AND estado_envio_rndc='1' GROUP BY te1.id_remesa";
			}

			if ($recurso == 7) {
				$sql = "SELECT tra.placa, tma.id_avansat,
				tra.peso_vacio, tra.volumen,
				tra.tipo_tramite, tra.serie_chasis,
				vc.nombre AS rndc_configuacion, tra.modelo, tra.alto,
				tra.largo, tra.ancho, tra.capacidad,
				ca.rndc_id AS rndc_carroceria,
				tra.caracteristica,
				pro.numero_documento,
				tra.numero_civil, ase.rndc_id AS rndc_aseguradora,
				tra.fecha_vence, tma.codigo AS rndc_marca
				FROM cmx_trailer tra
				INNER JOIN cmx_rndc_trailermarcas tma ON tra.marca=tma.id
				INNER JOIN cmx_rndc_vehiculos_configuracion vc ON tra.configuracion=vc.id
				INNER JOIN cmx_rndc_vehiculos_carroceria ca ON tra.carroceria=ca.id
				INNER JOIN cmx_proveedores pro ON tra.doc_propietario=pro.numdoc_nexos
				LEFT JOIN cmx_rndc_aseguradoras ase ON tra.aseguradora=ase.id
				WHERE tra.placa='" . $numero . "'";
			}

			if ($recurso == 8) {
				$sql = "SELECT v.placa, conf.nombre AS rndc_configuracion,col.rndc_id AS id_color_avansat,
				ma.rndc_id AS id_marca_avansat, Lin.rndc_id AS id_linea_avansat, ve2.cod_tipo_combustible, ve2.anio_fabricacion, ve2.clase_vehiculo, ca.id_carroc_avansat,
				 ve2.peso, ve2.capacidad_tn,ve2.num_soat, ve2.vence_soat, ase.rndc_id AS rndc_aseguradora,
				 dv.tecno_fecha_vigencia,gps.nit, v.usuario_satelital, v.clave_satelital, ve2.fecha_mant_gps,
				 ve2.num_motor, ve2.num_chasis, ve2.poliza_responsabilidad,
				 ve2.vence_poliza,ve2.tipo_vinculacion, dv.licencia_transito,p.numero_documento AS propietario,pe.numero_documento AS poseedor,co.numero_documento AS conductor,dv.tecnomecanica
				 FROM cmx_vehiculos v
				 INNER JOIN cmx_proveedores p ON v.id_propietario=p.numdoc_nexos
				 INNER JOIN cmx_proveedores pe ON v.id_tenedor=pe.numdoc_nexos
				 INNER JOIN cmx_proveedores co ON v.id_conductor=co.numdoc_nexos
				 INNER JOIN cmx_vehiculo2 ve2 ON v.numdoc_vehiculo=ve2.id_vehiculo
				 INNER JOIN cmx_rndc_vehiculos_configuracion conf ON ve2.configuracion=conf.id
				 INNER JOIN cmx_rndc_vehiculos_color col ON ve2.color=col.id
				 INNER JOIN cmx_rndc_vehiculos_marcas ma ON ve2.marca=ma.id
				 INNER JOIN cmx_rndc_vehiculos_linea Lin ON ve2.linea=Lin.id
				 INNER JOIN cmx_rndc_vehiculos_carroceria ca ON v.tipo_carroceria=ca.id
				 INNER JOIN cmx_rndc_aseguradoras ase ON ve2.aseguradora=ase.id
				 INNER JOIN cmx_detalle_vehiculo dv ON v.numdoc_vehiculo=dv.id_vehiculo
				 INNER JOIN cmx_rndc_empresa_gps gps ON v.empresa_gps=gps.id
				 WHERE v.placa='" . $numero . "'";
			}
			$consulta = $this->_db3->prepare($sql);
			$consulta->execute();
			$resultados = $consulta->fetchAll(PDO::FETCH_ASSOC);
			return $resultados;
		} catch (PDOException $e) {
			$this->_db3->rollBack();
			return $resultado = $error;
		}
	}
}
