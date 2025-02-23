<?php
class bodegasModel extends Model
{

	public function __construct()
	{
		parent::__construct();
	}

	public function getBodegas($id_bodega)
	{
		$filtro = "";
		if ($id_bodega) {
			$filtro = "WHERE crd.id = " . $id_bodega . "";
		}

		$sql = $this->_db3->prepare('SELECT * FROM cmx_remitente_destinatario crd
					INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad ' . $filtro . '');
		$sql->execute();
		return $sql->fetch(PDO::FETCH_ASSOC);

		// $bodega = $this->_db->getConsulta($sql);
		// return $bodega;
	}

	public function getTabla($id_cliente)
	{
		$sql = $this->_db3->prepare('SELECT crd.*,crd.id AS remitente_destinatario_id,cmu.id id_municipio, cmu.municipio, cmu.depto, cmu.pais
				FROM cmx_remitente_destinatario crd
				INNER JOIN cmx_bodegas cb ON cb.id_remtente_destinatario = crd.id
				INNER JOIN cmx_municipios cmu ON crd.id_ciudad = cmu.id
				WHERE crd.id_cliente = ' . $id_cliente . '');
		// $bodega = $this->_db->getConsulta($sql);
		// return $bodega;
		$sql->execute();
		return $sql->fetchAll(PDO::FETCH_ASSOC);
		// print_r($sql->fetchAll(PDO::FETCH_ASSOC));
	}

	public function getTablaRemitentesDestinatarios($iduser, $ssn_id_perfil)
	{

		if ($ssn_id_perfil == 22 || $ssn_id_perfil == 23 || $ssn_id_perfil == 24 || $ssn_id_perfil == 25 || $ssn_id_perfil == 26 || $ssn_id_perfil == 27 || $ssn_id_perfil == 1) {
			$sql = 'SELECT crd.*,
					cc.nombre NOM_CLIENTE, CONCAT(cmu1.municipio,"</br>",cmu1.depto," - ",cmu1.pais) CIUDAD_CLIENTE,
					cc.sigla SIGLA_CLIENTE, cc.direccion DIRECCION_CLIENTE, cc.telefono TELEFONO_CLIENTE,
					cc.email EMAIL_CLIENTE, cc.indicaciones_llegada LLEGADA_CLIENTE,
					CONCAT(cmu.municipio,"</br>",cmu.depto," - ",cmu.pais) CIUDAD_REMITENTE,
					cmu.id id_municipio, cmu.municipio, cmu.depto, cmu.pais
				FROM cmx_remitente_destinatario crd
					INNER JOIN cmx_municipios cmu ON crd.id_ciudad = cmu.id
					INNER JOIN cmx_clientes cc ON cc.id = crd.id_cliente
					INNER JOIN cmx_municipios cmu1 ON cmu1.id = cc.ciudad
				ORDER BY crd.rndc_id DESC, crd.estado DESC, crd.id_cliente, crd.nombre';
		} else {
			$sql = 'SELECT crd.*,
					cc.nombre NOM_CLIENTE,
					CONCAT(cmu1.municipio,"</br>",cmu1.depto," - ",cmu1.pais) CIUDAD_CLIENTE,
					cc.sigla SIGLA_CLIENTE, cc.direccion DIRECCION_CLIENTE, cc.telefono TELEFONO_CLIENTE,
					cc.email EMAIL_CLIENTE, cc.indicaciones_llegada LLEGADA_CLIENTE,
					CONCAT(cmu.municipio,"</br>",cmu.depto," - ",cmu.pais) CIUDAD_REMITENTE,
					cmu.id id_municipio, cmu.municipio, cmu.depto, cmu.pais
				FROM
					cmx_remitente_destinatario crd
					INNER JOIN cmx_municipios cmu ON crd.id_ciudad = cmu.id
					INNER JOIN cmx_clientes cc ON cc.id = crd.id_cliente
					INNER JOIN cmx_municipios cmu1 ON cmu1.id = cc.ciudad
					INNER JOIN cmx_clientes cli ON crd.id_cliente=cli.id
					INNER JOIN cmx_clientes_serv_contratados ccsc1
					ON cc.id=ccsc1.id_cliente
					INNER JOIN cmx_clientes_serv_responsables ccsr1
					ON ccsr1.id_serv_contratado = ccsc1.id
					WHERE ccsr1.id_usuario=' . $iduser . '
					AND ccsc1.estado = 1
					AND ccsr1.estado = 1
				ORDER BY crd.rndc_id DESC, crd.estado DESC,
				crd.id_cliente, crd.nombre';
		}
		$bodega = $this->_db->getConsulta($sql);
		return $bodega;
	}

	public function getTablaById($id_bodega)
	{
		$sql = '
				SELECT
					crd.*,
					cmu.id id_municipio, cmu.municipio, cmu.depto, cmu.pais
				FROM
					cmx_remitente_destinatario crd
					INNER JOIN cmx_municipios cmu ON crd.id_ciudad = cmu.id
				WHERE
					crd.id = ' . $id_bodega . ';
			';
		$bodega = $this->_db->getConsulta($sql);
		return $bodega;
	}

	public function getCantUbicaciones($id_bodega)
	{
		$sql = '
				SELECT
					COUNT(cu.id) CUANTOS
				FROM
					cmx_ubicaciones cu
				WHERE
					cu.estado != 3
					AND cu.linea != 0
					AND cu.id_bodega = "' . $id_bodega . '"
			';
		$bodega = $this->_db->getConsulta($sql);
		return $bodega;
	}

	public function getHtmlSelect($name, $id, $cliente)
	{

		$_filtro = '';
		if ($cliente != 1) {
			$_filtro = 'AND cb.id_cliente IN (1 , ' . $cliente . ') ';
		}

		if ($name) {
			$sql = '
					SELECT crd.*
					FROM
						cmx_remitente_destinatario crd
						INNER JOIN cmx_bodegas cb ON cb.id_remtente_destinatario = crd.id
					WHERE crd.estado = 1
					' . $_filtro . '
				';

			// echo $sql;
			$array = $this->_db->getConsulta($sql);

			// Se recorre contenido de la consulta
			if ($array) {
				// print_r($array);
				$select = '
						<select class="select2 select2-hidden-accessible" name="' . $name . '" id="slct_bodega_' . $id . '" aria-hidden="true">
					';
				$select .= '<option value="" selected disabled>Seleccione</option>';

				foreach ($array['rowsData'] as $key => $value) {

					if ($value[0] == $id) {
						$select .= '<option value="' . $value[0] . '" selected="">' . $value["nombre"] . '</option>';
					} else {
						$select .= '<option value="' . $value[0] . '">' . $value["nombre"] . '</option>';
					}
				}
				$select .= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}

		return $select;
	}

	public function getHtmlSelectMaterial($name, $id, $id_cliente)
	{
		$filtro = '';
		if ($id_cliente != 1) {
			$filtro = '
					AND cmc.id_cliente = ' . $id_cliente . '
				';
		}

		if ($name) {
			$sql = '
					SELECT
						cmc.id, cmc.descripcion, cmc.codigo
					FROM
						cmx_material_cliente cmc
					WHERE
						cmc.estado = 1
						' . $filtro . '
						;
				';

			// echo $sql;
			$array = $this->_db->getConsulta($sql);

			// Se recorre contenido de la consulta
			if ($array) {
				// print_r($array);
				$select = '
						<select class="select2 select2-hidden-accessible" multiple="multiple" name="' . $name . '" id="slct_material_bodega_' . $id . '" aria-hidden="true">
					';

				foreach ($array['rowsData'] as $key => $value) {
					if ($value[0] == $id) {
						$select .= '<option value="' . $value[0] . '" selected="">' . $value[2] . ' - ' . $value[1] . '</option>';
					} else {
						$select .= '<option value="' . $value[0] . '">' . $value[2] . ' - ' . $value[1] . '</option>';
					}
				}
				$select .= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}

		return $select;
	}

	public function getPreIngreso($id_cliente, $id_bodega)
	{
		$_filter_query = '';
		if ($id_cliente != 1) {
			$_filter_query .= ' AND cmc.id_cliente = "' . $id_cliente . '" ';
		}

		if ($id_bodega) {
			$_filter_query .= ' AND cmb.id_bodega = "' . $id_bodega . '" ';
		}

		$sql = '
				SELECT
					cmb.*, crd.nombre
				FROM
					cmx_material_bodega cmb
					INNER JOIN cmx_material_cliente cmc ON cmc.id = cmb.id_material
					INNER JOIN cmx_remitente_destinatario crd ON crd.id = cmb.id_bodega
				WHERE
					cmb.estado IN (2)
					' . $_filter_query . '
				GROUP BY cmb.delivery, cmb.id_bodega;
			';
		// echo "<p>" . $sql . "</p>";
		$bodega = $this->_db->getConsulta($sql);
		return $bodega;
	}

	public function getPreEntradas($id_bodega)
	{
		$_filter_query = '';
		if ($id_bodega) {
			$_filter_query .= ' AND ci.id_bodega_destino = "' . $id_bodega . '" ';
		}

		$sql = '
				SELECT
					ci.*, crd.id ID_BODEGA, crd.nombre NOMBRE_BODEGA, crd.documento DOC_BODEGA, crd.digito_verificacion DIGIT_BODEGA, cc.nombre NOMBRE_CLIENTE,
					(SELECT
						COUNT(ce.id)
					FROM
						cmx_embalaje ce
						INNER JOIN cmx_material_bodega cmb ON cmb.id = ce.id_material_bodega
					WHERE
						cmb.id_ingreso = ci.id
						AND ce.grupo > 0
						AND ce.sub_estado = 2
						AND ce.estado = 2
					) ESTIBAS,
					(SELECT
						COUNT(ce.id)
					FROM
						cmx_embalaje ce
						INNER JOIN cmx_material_bodega cmb ON cmb.id = ce.id_material_bodega
					WHERE
						cmb.id_ingreso = ci.id
						AND ce.grupo > 0
					) TOTAL_ESTIBAS
				FROM
					cmx_ingresos ci
					INNER JOIN cmx_remitente_destinatario crd ON crd.id = ci.id_bodega_destino
					INNER JOIN cmx_clientes cc ON cc.id = ci.id_cliente
				WHERE
					ci.estado IN (1,0)
					' . $_filter_query . '
				HAVING ESTIBAS > 0;
			';
		$bodega = $this->_db->getConsulta($sql);
		return $bodega;
	}

	public function getMaterialPreEntrada($id_ingreso)
	{
		$sql = '
				SELECT
					DISTINCT(cmc.codigo), cmb.lote, cmc.descripcion, cmb.id,
					cmb.cantidad, cmb.fecha_vencimiento,
					(SELECT
						COUNT(ce.id)
					FROM
						cmx_embalaje ce
					WHERE
						ce.grupo > 0
						AND ce.id_material_bodega = cmb.id
						AND ce.cantidad_grupo = cmc.unidades_x_tendido * cmc.planchas_x_estiba
					) ESTIBAS_COMPLETAS,
					(SELECT
						SUM(ce.cantidad_grupo)
					FROM
						cmx_embalaje ce
					WHERE
						ce.grupo > 0
						AND ce.id_material_bodega = cmb.id
						AND ce.cantidad_grupo = cmc.unidades_x_tendido * cmc.planchas_x_estiba
					) UNIDADES_EC,
					(SELECT
						COUNT(ce.id)
					FROM
						cmx_embalaje ce
					WHERE
						ce.grupo > 0
						AND ce.id_material_bodega = cmb.id
						AND ce.cantidad_grupo < cmc.unidades_x_tendido * cmc.planchas_x_estiba
					) ESTIBAS_INCOMPLETAS,
					(SELECT
						SUM(ce.cantidad_grupo)
					FROM
						cmx_embalaje ce
					WHERE
						ce.grupo > 0
						AND ce.id_material_bodega = cmb.id
						AND ce.cantidad_grupo < cmc.unidades_x_tendido * cmc.planchas_x_estiba
					) UNIDADES_EP,
					cmc.unidades_x_tendido, cmc.planchas_x_estiba,
					(cmc.unidades_x_tendido * cmc.planchas_x_estiba) UNIDADES_X_ESTIBA,
					ci.numero_ingreso, ci.nom_conductor, ci.doc_conductor, ci.placa, ci.precinto
				FROM
					cmx_ingresos ci
					INNER JOIN cmx_remitente_destinatario crd ON crd.id = ci.id_bodega_destino
					INNER JOIN cmx_clientes cc ON cc.id = ci.id_cliente
					INNER JOIN cmx_material_bodega cmb ON cmb.id_ingreso = ci.id
					INNER JOIN cmx_embalaje ce ON ce.id_material_bodega = cmb.id
					INNER JOIN cmx_material_cliente cmc ON cmb.id_material = cmc.id
				WHERE
					ci.id = "' . $id_ingreso . '"
					AND ce.sub_estado = 2;
			';
		// echo "<p>" . $sql . "</p>";
		$bodega = $this->_db->getConsulta($sql);
		return $bodega;
	}

	public function getQrEstibasMaterial($id_material_bodega)
	{
		$sql = '
				SELECT
					CONCAT("public/img/qrMaterialesBodega/", ci.id_bodega_destino, "/", ci.numero_ingreso, "/", cmb.delivery, "/", cmc.codigo, "/", cmb.lote, "/estiba/", ce.url_qr) URL_QR,
					ce.grupo,ce.cantidad_grupo,
					cmc.descripcion, cmc.codigo, cmc.cant_contenido_interno, cmc.unidades_x_embalaje,
					cmb.lote, cmb.fecha_vencimiento,
					cue.nom_unidad_empaque,
					cup.nom_unidad_presentacion,
					cum.nom_unidad_medida,
					ce.sub_estado,
					CONCAT(cmb.lote,"-",ce.grupo) ESTIBA,
					(SELECT
						COUNT(ce1.id)
					FROM
						cmx_embalaje ce1
					WHERE
						ce1.grupo = 0
						AND ce1.sub_estado = 3
						AND ce1.estado IN (1)
						AND ce1.id_embalaje = ce.id
					) ESTIBAS_DESCARGADAS
				FROM
					cmx_ingresos ci
					INNER JOIN cmx_material_bodega cmb ON cmb.id_ingreso = ci.id
					INNER JOIN cmx_material_cliente cmc ON cmc.id = cmb.id_material
					INNER JOIN cmx_embalaje ce ON ce.id_material_bodega = cmb.id
					INNER JOIN cmx_unidad_empaque cue ON cue.id = cmc.tipo_embalaje
					INNER JOIN cmx_unidades_presentacion cup ON cup.id = cmc.presentacion
					INNER JOIN cmx_unidades_medida cum ON cum.id = cmc.unidad_presentacion
				WHERE
					ci.estado IN (1)
					AND ce.sub_estado IN (2,3)
					AND ce.estado IN (2, 1)
					AND ce.grupo > 0
					AND cmb.id = "' . $id_material_bodega . '"
				ORDER BY ce.sub_estado;
			';
		// echo "<p>" . $sql . "</p>";
		$qr_embalaje = $this->_db->getConsulta($sql);
		return $qr_embalaje;
	}

	public function getQrEmbalajesMaterial($id_material_bodega)
	{
		$sql = $this->_db3->prepare('SELECT CONCAT("public/img/qrMaterialesBodega/", ci.id_bodega_destino, "/", ci.numero_ingreso, "/", cmb.delivery, "/", cmc.codigo, "/", cmb.lote, "/embalaje/", ce.url_qr) URL_QR,
					ce.cantidad_grupo,
					cmc.descripcion, cmc.codigo, cmc.cant_contenido_interno, cmc.unidades_x_embalaje,
					cmb.lote, cmb.fecha_vencimiento,
					cue.nom_unidad_empaque,
					cup.nom_unidad_presentacion,
					cum.nom_unidad_medida
				FROM
					cmx_ingresos ci
					INNER JOIN cmx_material_bodega cmb ON cmb.id_ingreso = ci.id
					INNER JOIN cmx_material_cliente cmc ON cmc.id = cmb.id_material
					INNER JOIN cmx_embalaje ce ON ce.id_material_bodega = cmb.id
					INNER JOIN cmx_unidad_empaque cue ON cue.id = cmc.tipo_embalaje
					INNER JOIN cmx_unidades_presentacion cup ON cup.id = cmc.presentacion
					INNER JOIN cmx_unidades_medida cum ON cum.id = cmc.unidad_presentacion
				WHERE
					ci.estado IN (1)
					AND ce.sub_estado IN (2,3)
					AND ce.estado IN (2, 1)
					AND ce.grupo = 0
					AND cmb.id = "' . $id_material_bodega . '"');
		$sql->execute();
		$qr_embalajes = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $qr_embalajes;
	}

	public function getDatosBodega($id_bodega)
	{
		$sql = 'SELECT crd.* FROM cmx_remitente_destinatario crd WHERE crd.estado = 1 AND crd.id = ' . $id_bodega . '';
		$bodega = $this->_db->getConsulta($sql);
		return $bodega;
	}

	public function getCuentaEstibas($id_bodega)
	{
		$sql = $this->_db3->prepare('SELECT COUNT(ce.id) CUANTOS FROM cmx_ingresos ci
					INNER JOIN cmx_material_bodega cmb ON cmb.id_ingreso = ci.id
					INNER JOIN cmx_embalaje ce ON ce.id_material_bodega = cmb.id
				WHERE ce.sub_estado = 1 AND ce.estado = 1 AND ci.id_bodega_destino = "' . $id_bodega . '"');
		$sql->execute();
		$bodega = $sql->fetch(PDO::FETCH_ASSOC);
		return $bodega['CUANTOS'];
	}

	public function getUbicacionesBodega($id_bodega)
	{
		$sql = 'SELECT COUNT(cu.id) TOTAL,
					(SELECT COUNT(cu1.id) CUANTOS FROM cmx_ubicaciones cu1 WHERE cu1.id_bodega = cu.id_bodega AND cu1.estado != 3) UBICACIONES,
					(SELECT COUNT(cu1.id) CUANTOS FROM cmx_ubicaciones cu1 WHERE cu1.id_bodega = cu.id_bodega AND cu1.estado = 1) DISPONIBLES,
					(SELECT COUNT(cu1.id) CUANTOS FROM cmx_ubicaciones cu1 WHERE cu1.id_bodega = cu.id_bodega AND cu1.estado = 2) RESERVADAS,
					(SELECT COUNT(cu1.id) CUANTOS FROM cmx_ubicaciones cu1 WHERE cu1.id_bodega = cu.id_bodega AND cu1.estado = 0) OCUPADAS
				FROM cmx_ubicaciones cu WHERE cu.id_bodega = "' . $id_bodega . '"';
		$bodega = $this->_db->getConsulta($sql);
		return $bodega;
	}

	public function getMaterialBodega()
	{
		$sql = 'SELECT * FROM cmx_ingresos ci
					INNER JOIN cmx_material_bodega cmb ON cmb.id_ingreso = ci.id
					INNER JOIN cmx_material_cliente cmc ON cmb.id_material = cmc.id';
		$bodega = $this->_db->getConsulta($sql);
		return $bodega;
	}

	public function getEnvio($delivery, $id_bodega)
	{
		$_filter_query = '';
		if ($id_bodega) {
			$_filter_query .= ' AND cmb.id_bodega = "' . $id_bodega . '" ';
		}

		$sql = '
				SELECT
					cmb.*, cmc.*,
					cue.nom_unidad_empaque,
					cup.nom_unidad_presentacion,
					cum.nom_unidad_medida
				FROM
					cmx_material_bodega cmb
					INNER JOIN cmx_material_cliente cmc ON cmc.id = cmb.id_material
					INNER JOIN cmx_unidad_empaque cue ON cue.id = cmc.tipo_embalaje
					INNER JOIN cmx_unidades_presentacion cup ON cup.id = cmc.presentacion
					INNER JOIN cmx_unidades_medida cum ON cum.id = cmc.unidad_presentacion
				WHERE
					cmc.estado = 1
					AND cmb.estado = 2
					AND cue.estado = 1
					AND cmb.delivery = "' . $delivery . '"
					' . $_filter_query . '
			;';
		// echo "<p>" . $sql . "</p>";
		$material_envio = $this->_db->getConsulta($sql);
		return $material_envio;
	}

	public function getMaterialEnvio($delivery, $id_bodega)
	{
		$sql = '
				SELECT
					cmb.*, cmc.subpartida, cmc.codigo, cmc.ean13, cmc.codigoUN, cmc.riesgo, cmc.consolidable,
					cmc.url_ficha_tecnica, cmc.url_tarjeta_emergencia, cmc.url_hoja_seguridad, cmc.peso_unitario_bruto,
					cmc.peso_unitario_neto, cmc.largo, cmc.alto, cmc.ancho, cmc.volumen_terrestre, cmc.volumen_aereo,
					cmc.unidad_presentacion, cmc.cupo_autorizado, cmc.cant_contenido_interno, cmc.vida_util,
					cmc.codigo_antiguo, cmc.codigo_corto, cmc.nom_familia, cmc.nom_categoria, cmc.grupo,
					cmc.sub_grupo, cmc.descripcion, cmc.detalle, cmc.especificacion, cmc.caracteristica, cmc.talla,
					cmc.color, crm.numero_riesgo, crm.nom_riesgo_material, cmc.unidades_x_embalaje, cmc.tipo_embalaje,
					cmc.unidades_x_tendido, cmc.planchas_x_estiba, cmc.altura_estiba,
					crm.descripcion DESCRIPCION_RIESGO, crm.url, cue.nom_unidad_empaque, cup.nom_unidad_presentacion,
					cum.nom_unidad_medida
				FROM
					cmx_material_bodega cmb
					INNER JOIN cmx_material_cliente cmc ON cmb.id_material = cmc.id
					INNER JOIN cmx_riesgo_material crm ON cmc.riesgo = crm.id
					INNER JOIN cmx_unidad_empaque cue ON cue.id = cmc.tipo_embalaje
					INNER JOIN cmx_unidades_presentacion cup ON cup.id = cmc.presentacion
					INNER JOIN cmx_unidades_medida cum ON cum.id = cmc.unidad_presentacion
				WHERE
					cmb.delivery = "' . $delivery . '"
					AND cmb.estado IN (2)
					AND cmb.id_bodega = ' . $id_bodega . '
			;';
		// echo "<p>" . $sql . "</p>";
		$material_envio = $this->_db->getConsulta($sql);
		return $material_envio;
	}

	public function getQrEmbalajesIngreso($id_cliente, $numero_ingreso)
	{
		$sql = '
				SELECT
					CONCAT("public/img/qrMaterialesBodega/", ci.id_bodega_destino, "/", ci.numero_ingreso, "/", cmb.delivery, "/", cmc.codigo, "/", cmb.lote, "/embalaje/", ce.url_qr) URL_QR,
					ce.cantidad_grupo,
					cmc.descripcion, cmc.codigo, cmc.cant_contenido_interno, cmc.unidades_x_embalaje,
					cmb.lote, cmb.fecha_vencimiento,
					cue.nom_unidad_empaque,
					cup.nom_unidad_presentacion,
					cum.nom_unidad_medida
				FROM
					cmx_ingresos ci
					INNER JOIN cmx_material_bodega cmb ON cmb.id_ingreso = ci.id
					INNER JOIN cmx_material_cliente cmc ON cmc.id = cmb.id_material
					INNER JOIN cmx_embalaje ce ON ce.id_material_bodega = cmb.id
					INNER JOIN cmx_unidad_empaque cue ON cue.id = cmc.tipo_embalaje
					INNER JOIN cmx_unidades_presentacion cup ON cup.id = cmc.presentacion
					INNER JOIN cmx_unidades_medida cum ON cum.id = cmc.unidad_presentacion
				WHERE
					ci.estado IN (1)
					AND ce.sub_estado = 2
					AND ce.estado = 2
					AND ce.grupo = 0
					AND ci.id_cliente = "' . $id_cliente . '"
					AND ci.numero_ingreso = "' . $numero_ingreso . '";
			';
		$qr_embalaje = $this->_db->getConsulta($sql);
		return $qr_embalaje;
	}

	public function getQrEstibasIngreso($id_cliente, $numero_ingreso)
	{
		$sql = '
				SELECT
					CONCAT("public/img/qrMaterialesBodega/", ci.id_bodega_destino, "/", ci.numero_ingreso, "/", cmb.delivery, "/", cmc.codigo, "/", cmb.lote, "/estiba/", ce.url_qr) URL_QR,
					ce.cantidad_grupo,
					cmc.descripcion, cmc.codigo, cmc.cant_contenido_interno, cmc.unidades_x_embalaje,
					cmb.lote, cmb.fecha_vencimiento,
					cue.nom_unidad_empaque,
					cup.nom_unidad_presentacion,
					cum.nom_unidad_medida,
					ce.grupo, cmb.delivery
				FROM
					cmx_ingresos ci
					INNER JOIN cmx_material_bodega cmb ON cmb.id_ingreso = ci.id
					INNER JOIN cmx_material_cliente cmc ON cmc.id = cmb.id_material
					INNER JOIN cmx_embalaje ce ON ce.id_material_bodega = cmb.id
					INNER JOIN cmx_unidad_empaque cue ON cue.id = cmc.tipo_embalaje
					INNER JOIN cmx_unidades_presentacion cup ON cup.id = cmc.presentacion
					INNER JOIN cmx_unidades_medida cum ON cum.id = cmc.unidad_presentacion
				WHERE
					ci.estado IN (1,0)
					AND ce.sub_estado = 2
					AND ce.estado = 2
					AND ce.grupo > 0
					AND ci.id_cliente = "' . $id_cliente . '"
					AND ci.numero_ingreso = "' . $numero_ingreso . '";
			';
		// echo "<p>" . $sql . "</p>";
		$qr_embalaje = $this->_db->getConsulta($sql);
		return $qr_embalaje;
	}

	public function getQrEmbalajes($id_embalaje)
	{
		$sql = $this->_db3->prepare('SELECT ce.*,
					CONCAT("public/img/qrMaterialesBodega/", ci.id_bodega_destino, "/", ci.numero_ingreso, "/", cmb.delivery, "/", cmc.codigo, "/", cmb.lote, "/estiba/", ce.url_qr) URL_QR,
					ce.cantidad_grupo,
					cmc.descripcion, cmc.codigo, cmc.cant_contenido_interno, cmc.unidades_x_embalaje,
					cmb.lote, cmb.fecha_vencimiento,
					cue.nom_unidad_empaque,
					cup.nom_unidad_presentacion,
					cum.nom_unidad_medida
				FROM
					cmx_embalaje ce
					INNER JOIN cmx_material_bodega cmb ON ce.id_material_bodega = cmb.id
					INNER JOIN cmx_ingresos ci ON cmb.id_ingreso = ci.id
					INNER JOIN cmx_material_cliente cmc ON cmc.id = cmb.id_material
					INNER JOIN cmx_unidad_empaque cue ON cue.id = cmc.tipo_embalaje
					INNER JOIN cmx_unidades_presentacion cup ON cup.id = cmc.presentacion
					INNER JOIN cmx_unidades_medida cum ON cum.id = cmc.unidad_presentacion
				WHERE
					ce.id = "' . $id_embalaje . '"');
		$sql->execute();
		$request = $sql->fetch(PDO::FETCH_ASSOC);
		return $request;
	}

	public function getQrUbicacion($id_ubicacion)
	{
		$sql = $this->_db3->prepare('SELECT
					cu.*,
					CONCAT(cu.linea,"-",cu.columna,"-",cu.nivel) UBICACION,
					CONCAT("public/img/qrPosicionesBodega/", crd.id, "/", cu.linea, "/", cu.columna, "/", cu.nivel, "/", cu.qr_posicion) QR_UBICACION,
					crd.nombre
				FROM
					cmx_ubicaciones cu
					INNER JOIN cmx_remitente_destinatario crd ON crd.id = cu.id_bodega
				WHERE
					cu.id = "' . $id_ubicacion . '"');
		$sql->execute();
		$request = $sql->fetch(PDO::FETCH_ASSOC);
		return $request;
		// $request = $this->_db->getConsulta($sql);
		// return $request;
	}

	/****** Consultas para visualizacion de material descargado en bodega *****/
	public function getDescargas($id_cliente, $id_bodega)
	{
		$_filter_query = '';
		if ($id_cliente != 1) {
			$_filter_query .= ' AND cmc.id_cliente = "' . $id_cliente . '" ';
		}
		if ($id_bodega) {
			$_filter_query .= ' AND ci.id_bodega_destino = "' . $id_bodega . '" ';
		}

		$sql = '
				SELECT
					DISTINCT(ci.numero_ingreso),
					ci.id ID_INGRESO, ci.estado, ci.nom_conductor, ci.doc_conductor, ci.placa,
					crd.id ID_BODEGA, crd.nombre BODEGA, crd.documento DOC_BODEGA,
					crd.digito_verificacion DIGIT_BODEGA,
					(SELECT
						COUNT(ce1.id)
					FROM
						cmx_embalaje ce1
						INNER JOIN cmx_material_bodega cmb1 ON cmb1.id = ce1.id_material_bodega
						INNER JOIN cmx_ingresos ci1 ON ci1.id = cmb1.id_ingreso
					WHERE
						ci1.numero_ingreso = ci.numero_ingreso
						AND ce1.sub_estado IN (2,3,5,4)
						AND ce1.estado IN (1,2,3)
						AND ce1.grupo > 0
					) DESCARGADOS,
					(SELECT
						COUNT(ce1.id)
					FROM
						cmx_embalaje ce1
						INNER JOIN cmx_material_bodega cmb1 ON cmb1.id = ce1.id_material_bodega
						INNER JOIN cmx_ingresos ci1 ON ci1.id = cmb1.id_ingreso
					WHERE
						ci1.numero_ingreso = ci.numero_ingreso
						AND ce1.sub_estado IN (5)
						AND ce1.estado IN (1,2,3)
						AND ce1.grupo > 0
					) ALMACENADOS
				FROM
					cmx_ingresos ci
					INNER JOIN cmx_material_bodega cmb ON ci.id = cmb.id_ingreso
					INNER JOIN cmx_material_cliente cmc ON cmc.id = cmb.id_material
					INNER JOIN cmx_clientes cc ON cmc.id_cliente = cc.id
					INNER JOIN cmx_embalaje ce ON ce.id_material_bodega = cmb.id
					INNER JOIN cmx_remitente_destinatario crd ON crd.id = ci.id_bodega_destino
				WHERE
					ce.sub_estado IN (3,5)
					AND ce.estado IN (1,2)
					AND ce.grupo > 0
					AND ci.estado != 2
					' . $_filter_query . '
				HAVING
					(SELECT
						COUNT(ce1.id)
					FROM
						cmx_embalaje ce1
						INNER JOIN cmx_material_bodega cmb1 ON cmb1.id = ce1.id_material_bodega
					WHERE
						cmb1.id_ingreso = ci.id
						AND ce1.sub_estado IN (3)
						AND ce1.estado = 1
						AND ce1.grupo > 0
					) > 0
			';
		// echo "<p>" . $sql . "</p>";
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	public function getDetalleDescarga($numero_ingreso)
	{
		$sql = '
				SELECT
					cmc.codigo, cmc.descripcion, cmb.lote,
					cmb.id, cmb.cantidad, cmb.fecha_vencimiento,
					(SELECT
						COUNT(ce.id)
					FROM
						cmx_embalaje ce
					WHERE
						ce.grupo > 0
						AND ce.id_material_bodega = cmb.id
						AND ce.cantidad_grupo = cmc.unidades_x_tendido * cmc.planchas_x_estiba
					) ESTIBAS_COMPLETAS,
					(SELECT
						SUM(ce.cantidad_grupo)
					FROM
						cmx_embalaje ce
					WHERE
						ce.grupo > 0
						AND ce.id_material_bodega = cmb.id
						AND ce.cantidad_grupo = cmc.unidades_x_tendido * cmc.planchas_x_estiba
					) UNIDADES_EC,
					(SELECT
						COUNT(ce.id)
					FROM
						cmx_embalaje ce
					WHERE
						ce.grupo > 0
						AND ce.id_material_bodega = cmb.id
						AND ce.cantidad_grupo < cmc.unidades_x_tendido * cmc.planchas_x_estiba
					) ESTIBAS_INCOMPLETAS,
					(SELECT
						SUM(ce.cantidad_grupo)
					FROM
						cmx_embalaje ce
					WHERE
						ce.grupo > 0
						AND ce.id_material_bodega = cmb.id
						AND ce.cantidad_grupo < cmc.unidades_x_tendido * cmc.planchas_x_estiba
					) UNIDADES_EP,
					ci.numero_ingreso, ci.nom_conductor, ci.doc_conductor, ci.placa, ci.precinto,
					(SELECT
						COUNT(ce1.id)
					FROM
						cmx_embalaje ce1
					WHERE
						ce1.grupo = 0
						AND ce1.sub_estado IN (3,5,4)
						AND ce1.estado IN (1,2,3)
						AND ce1.id_material_bodega = cmb.id
					) DESCARGADOS,
					(SELECT
						COUNT(ce1.id)
					FROM
						cmx_embalaje ce1
					WHERE
						ce1.grupo = 0
						AND ce1.sub_estado = 5
						AND ce1.estado IN (1,2,3)
						AND ce1.id_material_bodega = cmb.id
					) ALMACENADOS
				FROM
					cmx_ingresos ci
					INNER JOIN cmx_remitente_destinatario crd ON crd.id = ci.id_bodega_destino
					INNER JOIN cmx_clientes cc ON cc.id = ci.id_cliente
					INNER JOIN cmx_material_bodega cmb ON cmb.id_ingreso = ci.id
					INNER JOIN cmx_material_cliente cmc ON cmb.id_material = cmc.id
				WHERE
					ci.numero_ingreso = ' . $numero_ingreso . ';
			';
		// echo "<p>" . $sql . "</p>";
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	public function getDetalleDescargaLote($numero_ingreso, $lote)
	{
		$sql = '
				SELECT
					cmc.codigo, cmc.descripcion,
					CONCAT(cmb.lote,"-",ce.grupo) ESTIBA,
					cmb.lote, ce.cantidad_grupo, ce.sub_estado,
					CONCAT("public/img/qrMaterialesBodega/", ci.id_bodega_destino, "/", ci.numero_ingreso, "/", cmb.delivery, "/", cmc.codigo, "/", cmb.lote, "/estiba/", ce.url_qr) URL_QR,
					ce.grupo,
					cmc.descripcion, cmc.codigo, cmc.cant_contenido_interno, cmc.unidades_x_embalaje,
					cmb.lote, cmb.fecha_vencimiento,
					cue.nom_unidad_empaque,
					cup.nom_unidad_presentacion,
					cum.nom_unidad_medida,
					(SELECT
						COUNT(ce1.id)
					FROM
						cmx_embalaje ce1
					WHERE
						ce1.grupo = 0
						AND ce1.sub_estado = 5
						AND ce1.estado IN (1,2,3)
						AND ce1.id_embalaje = ce.id
					) ESTIBAS_ALMACENADAS,
					IF (ce.ubicacion IS NOT NULL , (SELECT CONCAT(cu1.linea,"-",cu1.columna,"-",cu1.nivel) FROM cmx_ubicaciones cu1 WHERE cu1.id = ce.ubicacion) , "NO UBICADO") UBICACION
				FROM
					cmx_material_cliente cmc
					INNER JOIN cmx_material_bodega cmb ON cmb.id_material = cmc.id
					INNER JOIN cmx_embalaje ce ON ce.id_material_bodega = cmb.id
					INNER JOIN cmx_ingresos ci ON cmb.id_ingreso = ci.id
					INNER JOIN cmx_unidad_empaque cue ON cue.id = cmc.tipo_embalaje
					INNER JOIN cmx_unidades_presentacion cup ON cup.id = cmc.presentacion
					INNER JOIN cmx_unidades_medida cum ON cum.id = cmc.unidad_presentacion
				WHERE
					ce.grupo > 0
					AND ci.numero_ingreso = ' . $numero_ingreso . '
					AND cmb.lote = "' . $lote . '"
				ORDER BY ce.sub_estado;
			';
		// echo "<p>" . $sql . "</p>";
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	//Consultas para despachos y/o salidas
	public function getPreSalidas($id_cliente, $id_bodega)
	{
		$_filter_query = '';
		if ($id_cliente != 1) {
			$_filter_query .= ' AND cmc.id_cliente = "' . $id_cliente . '" ';
		}

		if ($id_bodega) {
			$_filter_query .= ' AND cmbs.id_bodega = "' . $id_bodega . '" ';
		}

		$sql = '
				SELECT
					cmbs.* , SUM(cmbs.cantidad) UNIDADES, crd.nombre
				FROM
					cmx_material_bodega_salida cmbs
					INNER JOIN cmx_material_cliente cmc ON cmc.id = cmbs.id_material
					INNER JOIN cmx_remitente_destinatario crd ON crd.id = cmbs.id_bodega
				WHERE
					cmbs.estado IN (2)
					' . $_filter_query . '
				    GROUP BY cmbs.delivery, cmbs.id_bodega;
			';
		// print_r($sql . "\n");
		$request = $this->_db->getConsulta($sql);
		return $request;
	}

	public function getMaterialSalida($delivery, $id_bodega)
	{
		$_filter_query = '';
		if ($id_bodega) {
			$_filter_query .= ' AND cmbs.id_bodega = "' . $id_bodega . '" ';
		}

		$sql = '
				SELECT
					cmbs.*, cmc.subpartida, cmc.codigo, cmc.ean13, cmc.codigoUN, cmc.riesgo, cmc.consolidable,
					cmc.url_ficha_tecnica, cmc.url_tarjeta_emergencia, cmc.url_hoja_seguridad, cmc.peso_unitario_bruto,
					cmc.peso_unitario_neto, cmc.largo, cmc.alto, cmc.ancho, cmc.volumen_terrestre, cmc.volumen_aereo,
					cmc.unidad_presentacion, cmc.cupo_autorizado, cmc.cant_contenido_interno, cmc.vida_util,
					cmc.codigo_antiguo, cmc.codigo_corto, cmc.nom_familia, cmc.nom_categoria, cmc.grupo,
					cmc.sub_grupo, cmc.descripcion, cmc.detalle, cmc.especificacion, cmc.caracteristica, cmc.talla,
					cmc.color, crm.numero_riesgo, crm.nom_riesgo_material, cmc.unidades_x_embalaje, cmc.tipo_embalaje,
					cmc.unidades_x_tendido, cmc.planchas_x_estiba, cmc.altura_estiba,
					crm.descripcion DESCRIPCION_RIESGO, crm.url, cue.nom_unidad_empaque, cup.nom_unidad_presentacion,
					cum.nom_unidad_medida
				FROM
					cmx_material_bodega_salida cmbs
					INNER JOIN cmx_material_cliente cmc ON cmbs.id_material = cmc.id
					INNER JOIN cmx_riesgo_material crm ON cmc.riesgo = crm.id
					INNER JOIN cmx_unidad_empaque cue ON cue.id = cmc.tipo_embalaje
					INNER JOIN cmx_unidades_presentacion cup ON cup.id = cmc.presentacion
					INNER JOIN cmx_unidades_medida cum ON cum.id = cmc.unidad_presentacion
				WHERE
					cmbs.delivery = "' . $delivery . '"
					' . $_filter_query . '
			;';
		// echo "<p>" . $sql . "</p>";
		$material_envio = $this->_db->getConsulta($sql);
		return $material_envio;
	}

	public function getEnvioSalidas($delivery)
	{
		$sql = '
				SELECT
					cmbs.*, cmc.*,
					cue.nom_unidad_empaque,
					cup.nom_unidad_presentacion,
					cum.nom_unidad_medida
				FROM
					cmx_material_bodega_salida cmbs
					INNER JOIN cmx_material_cliente cmc ON cmc.id = cmbs.id_material
					INNER JOIN cmx_unidad_empaque cue ON cue.id = cmc.tipo_embalaje
					INNER JOIN cmx_unidades_presentacion cup ON cup.id = cmc.presentacion
					INNER JOIN cmx_unidades_medida cum ON cum.id = cmc.unidad_presentacion
				WHERE
					cmc.estado = 1
					AND cmbs.estado = 2
					AND cue.estado = 1
					AND cmbs.delivery = "' . $delivery . '";
			';
		// echo "<p>" . $sql . "</p>";
		$material_envio = $this->_db->getConsulta($sql);
		return $material_envio;
	}

	public function getQrPreSalidas($delivery)
	{
		$sql = '
				SELECT
					ce.*,
					CONCAT(cu.linea,"-",cu.columna,"-",cu.nivel) UBICACION_ESTIBA,
					CONCAT("public/img/qrMaterialesBodega/", ci.id_bodega_destino, "/", ci.numero_ingreso, "/", cmb.delivery, "/", cmc.codigo, "/", cmb.lote, "/embalaje/", ce.url_qr) URL_QR,
					ce.cantidad_grupo,
					cmc.descripcion, cmc.codigo, cmc.cant_contenido_interno, cmc.unidades_x_embalaje,
					cmb.lote, cmb.fecha_vencimiento,
					cue.nom_unidad_empaque,
					cup.nom_unidad_presentacion,
					cum.nom_unidad_medida
				FROM
					cmx_embalaje ce
					INNER JOIN cmx_material_bodega_salida cmbs ON ce.id_material_bodega_salida = cmbs.id
					INNER JOIN cmx_material_bodega cmb ON ce.id_material_bodega = cmb.id
					INNER JOIN cmx_ingresos ci ON cmb.id_ingreso = ci.id
					INNER JOIN cmx_ubicaciones cu ON ce.ubicacion = cu.id
					INNER JOIN cmx_material_cliente cmc ON cmc.id = cmbs.id_material
					INNER JOIN cmx_unidad_empaque cue ON cue.id = cmc.tipo_embalaje
					INNER JOIN cmx_unidades_presentacion cup ON cup.id = cmc.presentacion
					INNER JOIN cmx_unidades_medida cum ON cum.id = cmc.unidad_presentacion
				WHERE
					ce.sub_estado = 6
					AND ce.estado = 1
					AND ce.id_embalaje IN (
						SELECT
							ce1.id
						FROM
							cmx_embalaje ce1
						WHERE
							ce1.sub_estado = 5
							AND ce1.estado IN (2,3)
							AND ce1.grupo > 0
					)
					AND cmbs.delivery = "' . $delivery . '"
				UNION
				SELECT
					ce.*,
					CONCAT(cu.linea,"-",cu.columna,"-",cu.nivel) UBICACION_ESTIBA,
					CONCAT("public/img/qrMaterialesBodega/", ci.id_bodega_destino, "/", ci.numero_ingreso, "/", cmb.delivery, "/", cmc.codigo, "/", cmb.lote, "/estiba/", ce.url_qr) URL_QR,
					ce.cantidad_grupo,
					cmc.descripcion, cmc.codigo, cmc.cant_contenido_interno, cmc.unidades_x_embalaje,
					cmb.lote, cmb.fecha_vencimiento,
					cue.nom_unidad_empaque,
					cup.nom_unidad_presentacion,
					cum.nom_unidad_medida
				FROM
					cmx_embalaje ce
					INNER JOIN cmx_material_bodega_salida cmbs ON ce.id_material_bodega_salida = cmbs.id
					INNER JOIN cmx_material_bodega cmb ON ce.id_material_bodega = cmb.id
					INNER JOIN cmx_ingresos ci ON cmb.id_ingreso = ci.id
					INNER JOIN cmx_ubicaciones cu ON ce.ubicacion = cu.id
					INNER JOIN cmx_material_cliente cmc ON cmc.id = cmbs.id_material
					INNER JOIN cmx_unidad_empaque cue ON cue.id = cmc.tipo_embalaje
					INNER JOIN cmx_unidades_presentacion cup ON cup.id = cmc.presentacion
					INNER JOIN cmx_unidades_medida cum ON cum.id = cmc.unidad_presentacion
				WHERE
					ce.grupo > 0
					AND ce.sub_estado = 6
					AND ce.estado = 1
					AND cmbs.delivery = "' . $delivery . '";
			';
		// echo "<p>" . $sql . "</p>";
		$request = $this->_db->getConsulta($sql);
		return $request;
	}

	//Consultas para alistamiento de mercancia
	public function getAlistamientos($id_cliente, $id_bodega)
	{
		$_filter_query = '';
		if ($id_cliente != 1) {
			$_filter_query .= ' AND cmc.id_cliente = "' . $id_cliente . '" ';
		}
		if ($id_bodega) {
			$_filter_query .= ' AND cmbs.id_bodega = "' . $id_bodega . '" ';
		}

		$sql = '
				SELECT
					DISTINCT(cs.id) ID_SALIDA, cs.*,
					crd.id ID_BODEGA, crd.nombre BODEGA, crd.documento DOC_BODEGA, crd.digito_verificacion DIGIT_BODEGA,
					ce.sub_estado SUB_ESTADO_ESTIBA, ce.estado ESTADO_ESTIBA,
					(SELECT
						COUNT(ce1.id)
					FROM
						cmx_embalaje ce1
						INNER JOIN cmx_material_bodega_salida cmbs1 ON cmbs1.id = ce1.id_material_bodega_salida
						INNER JOIN cmx_salidas cs1 ON cs1.id = cmbs1.id_salida
					WHERE
						ce1.sub_estado IN (6,7)
						AND ce1.grupo > 0
						AND cs1.id = cs.id
					) ESTIBAS_SOLICITADAS,
					(SELECT
						COUNT(ce1.id)
					FROM
						cmx_embalaje ce1
						INNER JOIN cmx_material_bodega_salida cmbs1 ON cmbs1.id = ce1.id_material_bodega_salida
						INNER JOIN cmx_salidas cs1 ON cs1.id = cmbs1.id_salida
					WHERE
						ce1.sub_estado IN (6,7)
						AND ce1.estado = 1
						AND ce1.grupo = 0
						AND cs1.id = cs.id
						AND ce1.id_embalaje = (
							SELECT ce2.id
							FROM cmx_embalaje ce2
							WHERE
								ce1.id_embalaje = ce2.id
								AND ce2.sub_estado = 5)
					) EMBALAJES_SOLICITADOS,
					(SELECT
						COUNT(ce1.id)
					FROM
						cmx_embalaje ce1
						INNER JOIN cmx_material_bodega_salida cmbs1 ON cmbs1.id = ce1.id_material_bodega_salida
						INNER JOIN cmx_salidas cs1 ON cs1.id = cmbs1.id_salida
					WHERE
						ce1.sub_estado = 7
						AND ce1.estado = 1
						AND ce1.grupo > 0
						AND cs1.id = cs.id
					) ESTIBAS_ALISTADAS,
					(SELECT
						COUNT(ce1.id)
					FROM
						cmx_embalaje ce1
						INNER JOIN cmx_material_bodega_salida cmbs1 ON cmbs1.id = ce1.id_material_bodega_salida
						INNER JOIN cmx_salidas cs1 ON cs1.id = cmbs1.id_salida
					WHERE
						ce1.sub_estado = 7
						AND ce1.estado = 1
						AND ce1.grupo = 0
						AND cs1.id = cs.id
						AND ce1.id_embalaje = (
							SELECT ce2.id
							FROM cmx_embalaje ce2
							WHERE
								ce1.id_embalaje = ce2.id
								AND ce2.sub_estado = 5)
					) EMBALAJES_ALISTADOS
				FROM
					cmx_salidas cs
					INNER JOIN cmx_material_bodega_salida cmbs ON cs.id = cmbs.id_salida
					INNER JOIN cmx_material_cliente cmc ON cmc.id = cmbs.id_material
					INNER JOIN cmx_embalaje ce ON ce.id_material_bodega_salida = cmbs.id
					INNER JOIN cmx_remitente_destinatario crd ON crd.id = cs.id_bodega
				WHERE
					ce.sub_estado IN (6)
					AND ce.estado = 1
					' . $_filter_query . '
					ORDER BY ce.sub_estado;
			';
		// echo "<p>" . $sql . "</p>";
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	public function getQrAlistamiento($numero_salida)
	{
		$sql = '
				SELECT
					ce.*,
					CONCAT (cmbs.lote,"-",(ce.id_embalaje-ce.id)) LOTE,
					CONCAT("public/img/qrMaterialesBodega/", ci.id_bodega_destino, "/", ci.numero_ingreso, "/", cmb.delivery, "/", cmc.codigo, "/", cmb.lote, "/embalaje/", ce.url_qr) URL_QR,
					CONCAT(cu.linea,"-",cu.columna,"-",cu.nivel) UBICACION,
					ce.cantidad_grupo, cmc.descripcion, cmc.codigo, cmc.cant_contenido_interno, cmc.unidades_x_embalaje,
					cmb.fecha_vencimiento, cue.nom_unidad_empaque, cup.nom_unidad_presentacion, cum.nom_unidad_medida
				FROM
					cmx_embalaje ce
					INNER JOIN cmx_ubicaciones cu ON ce.ubicacion = cu.id
					INNER JOIN cmx_material_bodega_salida cmbs ON ce.id_material_bodega_salida = cmbs.id
					INNER JOIN cmx_salidas cs ON cmbs.id_salida = cs.id
					INNER JOIN cmx_material_bodega cmb ON ce.id_material_bodega = cmb.id
					INNER JOIN cmx_ingresos ci ON cmb.id_ingreso = ci.id
					INNER JOIN cmx_material_cliente cmc ON cmc.id = cmbs.id_material
					INNER JOIN cmx_unidad_empaque cue ON cue.id = cmc.tipo_embalaje
					INNER JOIN cmx_unidades_presentacion cup ON cup.id = cmc.presentacion
					INNER JOIN cmx_unidades_medida cum ON cum.id = cmc.unidad_presentacion
				WHERE
					ce.sub_estado IN (6)
					AND ce.estado = 1
					AND ce.id_embalaje IN (
						SELECT ce1.id
						FROM cmx_embalaje ce1
						WHERE
							ce1.sub_estado = 5
							AND ce1.estado IN (2,3)
							AND ce1.grupo > 0 )
					AND cs.numero_salida = "' . $numero_salida . '"
				UNION
				SELECT
					ce.*,
					CONCAT (cmbs.lote,"-",ce.grupo) LOTE,
					CONCAT("public/img/qrMaterialesBodega/", ci.id_bodega_destino, "/", ci.numero_ingreso, "/", cmb.delivery, "/", cmc.codigo, "/", cmb.lote, "/estiba/", ce.url_qr) URL_QR,
					CONCAT(cu.linea,"-",cu.columna,"-",cu.nivel) UBICACION,
					ce.cantidad_grupo, cmc.descripcion, cmc.codigo, cmc.cant_contenido_interno, cmc.unidades_x_embalaje,
					cmb.fecha_vencimiento, cue.nom_unidad_empaque, cup.nom_unidad_presentacion, cum.nom_unidad_medida
				FROM
					cmx_embalaje ce
					INNER JOIN cmx_ubicaciones cu ON ce.ubicacion = cu.id
					INNER JOIN cmx_material_bodega_salida cmbs ON ce.id_material_bodega_salida = cmbs.id
					INNER JOIN cmx_salidas cs ON cmbs.id_salida = cs.id
					INNER JOIN cmx_material_bodega cmb ON ce.id_material_bodega = cmb.id
					INNER JOIN cmx_ingresos ci ON cmb.id_ingreso = ci.id
					INNER JOIN cmx_material_cliente cmc ON cmc.id = cmbs.id_material
					INNER JOIN cmx_unidad_empaque cue ON cue.id = cmc.tipo_embalaje
					INNER JOIN cmx_unidades_presentacion cup ON cup.id = cmc.presentacion
					INNER JOIN cmx_unidades_medida cum ON cum.id = cmc.unidad_presentacion
				WHERE
					ce.grupo > 0
					AND ce.sub_estado IN (6)
					AND ce.estado = 1
					AND cs.numero_salida = "' . $numero_salida . '" ;
			';
		// echo "<p>" . $sql . "</p>";
		$request = $this->_db->getConsulta($sql);
		return $request;
	}

	public function getQrEmbalajesAlistamiento($numero_salida)
	{
		$sql = '
				SELECT
					ce.*,
					CONCAT (cmbs.lote,"-",(ce.id_embalaje-ce.id)) LOTE,
					CONCAT("public/img/qrMaterialesBodega/", ci.id_bodega_destino, "/", ci.numero_ingreso, "/", cmb.delivery, "/", cmc.codigo, "/", cmb.lote, "/embalaje/", ce.url_qr) URL_QR,
					CONCAT(cu.linea,"-",cu.columna,"-",cu.nivel) UBICACION,
					ce.cantidad_grupo, cmc.descripcion, cmc.codigo, cmc.cant_contenido_interno, cmc.unidades_x_embalaje,
					cmb.fecha_vencimiento, cue.nom_unidad_empaque, cup.nom_unidad_presentacion, cum.nom_unidad_medida
				FROM
					cmx_embalaje ce
					INNER JOIN cmx_ubicaciones cu ON ce.ubicacion = cu.id
					INNER JOIN cmx_material_bodega_salida cmbs ON ce.id_material_bodega_salida = cmbs.id
					INNER JOIN cmx_salidas cs ON cmbs.id_salida = cs.id
					INNER JOIN cmx_material_bodega cmb ON ce.id_material_bodega = cmb.id
					INNER JOIN cmx_ingresos ci ON cmb.id_ingreso = ci.id
					INNER JOIN cmx_material_cliente cmc ON cmc.id = cmbs.id_material
					INNER JOIN cmx_unidad_empaque cue ON cue.id = cmc.tipo_embalaje
					INNER JOIN cmx_unidades_presentacion cup ON cup.id = cmc.presentacion
					INNER JOIN cmx_unidades_medida cum ON cum.id = cmc.unidad_presentacion
				WHERE
					ce.sub_estado IN (6)
					AND ce.estado = 1
					AND ce.id_embalaje IN (
						SELECT ce1.id
						FROM cmx_embalaje ce1
						WHERE
							ce1.sub_estado = 5
							AND ce1.estado IN (2,3)
							AND ce1.grupo > 0 )
					AND cs.numero_salida = "' . $numero_salida . '" ;
			';
		// echo "<p>" . $sql . "</p>";
		$request = $this->_db->getConsulta($sql);
		return $request;
	}

	public function getMaterialAlistamiento($numero_salida)
	{
		$sql = '
				SELECT
					ce.*, cmc.*, ce.grupo GRUPO,
					CONCAT(cu.linea,"-",cu.columna,"-",cu.nivel) UBICACION,
					ce.cantidad_grupo,
					cmb.lote, cmb.fecha_vencimiento, cue.nom_unidad_empaque, cup.nom_unidad_presentacion, cum.nom_unidad_medida,
					crm.numero_riesgo, crm.nom_riesgo_material, crm.descripcion DESCRIPCION_RIESGO, crm.url, cmbs.cantidad
				FROM
					cmx_embalaje ce
					INNER JOIN cmx_ubicaciones cu ON ce.ubicacion = cu.id
					INNER JOIN cmx_material_bodega_salida cmbs ON ce.id_material_bodega_salida = cmbs.id
					INNER JOIN cmx_salidas cs ON cmbs.id_salida = cs.id
					INNER JOIN cmx_material_bodega cmb ON ce.id_material_bodega = cmb.id
					INNER JOIN cmx_ingresos ci ON cmb.id_ingreso = ci.id
					INNER JOIN cmx_material_cliente cmc ON cmc.id = cmbs.id_material
					INNER JOIN cmx_riesgo_material crm ON cmc.riesgo = crm.id
					INNER JOIN cmx_unidad_empaque cue ON cue.id = cmc.tipo_embalaje
					INNER JOIN cmx_unidades_presentacion cup ON cup.id = cmc.presentacion
					INNER JOIN cmx_unidades_medida cum ON cum.id = cmc.unidad_presentacion
				WHERE
					ce.sub_estado IN (6)
					AND ce.estado = 1
					AND ce.id_embalaje IN (
						SELECT ce1.id
						FROM cmx_embalaje ce1
						WHERE
							ce1.sub_estado = 5
							AND ce1.estado IN (2,3)
							AND ce1.grupo > 0 )
					AND cs.numero_salida = "' . $numero_salida . '"
				UNION
				SELECT
					ce.*, cmc.*, ce.grupo GRUPO,
					CONCAT(cu.linea,"-",cu.columna,"-",cu.nivel) UBICACION,
					ce.cantidad_grupo,
					cmb.lote, cmb.fecha_vencimiento, cue.nom_unidad_empaque, cup.nom_unidad_presentacion, cum.nom_unidad_medida,
					crm.numero_riesgo, crm.nom_riesgo_material, crm.descripcion DESCRIPCION_RIESGO, crm.url, cmbs.cantidad
				FROM
					cmx_embalaje ce
					INNER JOIN cmx_ubicaciones cu ON ce.ubicacion = cu.id
					INNER JOIN cmx_material_bodega_salida cmbs ON ce.id_material_bodega_salida = cmbs.id
					INNER JOIN cmx_salidas cs ON cmbs.id_salida = cs.id
					INNER JOIN cmx_material_bodega cmb ON ce.id_material_bodega = cmb.id
					INNER JOIN cmx_ingresos ci ON cmb.id_ingreso = ci.id
					INNER JOIN cmx_material_cliente cmc ON cmc.id = cmbs.id_material
					INNER JOIN cmx_riesgo_material crm ON cmc.riesgo = crm.id
					INNER JOIN cmx_unidad_empaque cue ON cue.id = cmc.tipo_embalaje
					INNER JOIN cmx_unidades_presentacion cup ON cup.id = cmc.presentacion
					INNER JOIN cmx_unidades_medida cum ON cum.id = cmc.unidad_presentacion
				WHERE
					ce.grupo > 0
					AND ce.sub_estado IN (6)
					AND ce.estado = 1
					AND cs.numero_salida = "' . $numero_salida . '";
			';
		// echo "<p>" . $sql . "</p>";
		$material_envio = $this->_db->getConsulta($sql);
		return $material_envio;
	}

	/****** Consultas para visualizacion de despachos *****/
	public function getDespachos($id_cliente, $id_bodega)
	{
		$_filter_query = '';
		if ($id_cliente != 1) {
			$_filter_query .= ' AND cmc.id_cliente = "' . $id_cliente . '" ';
		}
		if ($id_bodega) {
			$_filter_query .= ' AND cmbs.id_bodega = "' . $id_bodega . '" ';
		}

		$sql = '
				SELECT
					cs.*, cc.nombre CLIENTE, cc.documento DOC_CLIENTE, cc.digito_verificacion DIGIT_CLIENTE,
					crd.id ID_BODEGA, crd.nombre BODEGA, crd.documento DOC_BODEGA, crd.digito_verificacion DIGIT_BODEGA,
					cmbs.delivery, ce.sub_estado, ce.estado ESTADO_EMBALAJE,
					(SELECT
						COUNT(ce1.id)
					FROM
						cmx_embalaje ce1
						INNER JOIN cmx_material_bodega_salida cmbs1 ON cmbs1.id = ce1.id_material_bodega_salida
						INNER JOIN cmx_salidas cs1 ON cs1.id = cmbs1.id_salida
					WHERE
						ce1.sub_estado IN (6,7,8)
						AND ce1.grupo > 0
						AND cs1.id = cs.id
					) ESTIBAS_SOLICITADAS,
					(SELECT
						COUNT(ce1.id)
					FROM
						cmx_embalaje ce1
						INNER JOIN cmx_material_bodega_salida cmbs1 ON cmbs1.id = ce1.id_material_bodega_salida
						INNER JOIN cmx_salidas cs1 ON cs1.id = cmbs1.id_salida
					WHERE
						ce1.sub_estado IN (6,7,8)
						AND ce1.estado = 1
						AND ce1.grupo = 0
						AND cs1.id = cs.id
						AND ce1.id_embalaje = (
							SELECT ce2.id
							FROM
								cmx_embalaje ce2
							WHERE
								ce1.id_embalaje = ce2.id
								AND ce2.grupo > 0
								AND ce2.sub_estado = 5)
					) EMBALAJES_SOLICITADOS,
					(SELECT
						COUNT(ce1.id)
					FROM
						cmx_embalaje ce1
						INNER JOIN cmx_material_bodega_salida cmbs1 ON cmbs1.id = ce1.id_material_bodega_salida
						INNER JOIN cmx_salidas cs1 ON cs1.id = cmbs1.id_salida
					WHERE
						ce1.sub_estado = 8
						AND ce1.estado = 1
						AND ce1.grupo > 0
						AND cs1.id = cs.id
					) ESTIBAS_DESPACHADAS,
					(SELECT
						COUNT(ce1.id)
					FROM
						cmx_embalaje ce1
						INNER JOIN cmx_material_bodega_salida cmbs1 ON cmbs1.id = ce1.id_material_bodega_salida
						INNER JOIN cmx_salidas cs1 ON cs1.id = cmbs1.id_salida
					WHERE
						ce1.sub_estado = 8
						AND ce1.estado = 1
						AND ce1.grupo = 0
						AND cs1.id = cs.id
						AND ce1.id_embalaje = (
							SELECT ce2.id
							FROM cmx_embalaje ce2
							WHERE
								ce1.id_embalaje = ce2.id
								AND ce2.sub_estado != 8)
					) EMBALAJES_DESPACHADOS
				FROM
					cmx_salidas cs
					INNER JOIN cmx_material_bodega_salida cmbs ON cs.id = cmbs.id_salida
					INNER JOIN cmx_material_cliente cmc ON cmc.id = cmbs.id_material
					INNER JOIN cmx_clientes cc ON cmc.id_cliente = cc.id
					INNER JOIN cmx_embalaje ce ON ce.id_material_bodega_salida = cmbs.id
					INNER JOIN cmx_remitente_destinatario crd ON crd.id = cs.id_bodega
				WHERE
					ce.sub_estado IN (7,8)
					AND ce.estado = 1
					' . $_filter_query . '
					GROUP BY cs.id
					ORDER BY ce.sub_estado;
			';
		// echo "<p>" . $sql . "</p>";
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	public function getQrDespachos($numero_salida, $codigo, $lote)
	{
		$sql = '
				SELECT
					ce.*,
					CONCAT("public/img/qrMaterialesBodega/", ci.id_bodega_destino, "/", ci.numero_ingreso, "/", cmb.delivery, "/", cmc.codigo, "/", cmb.lote, "/embalaje/", ce.url_qr) URL_QR,
					IF(ce.grupo = 0 , (ce.id_embalaje - ce.id) , ce.grupo) GRUPO_EMBALAJE,
					cmc.descripcion, cmc.codigo, cmc.cant_contenido_interno, cmc.unidades_x_embalaje,
					cmb.lote, cmb.fecha_vencimiento,
					cue.nom_unidad_empaque,
					cup.nom_unidad_presentacion,
					cum.nom_unidad_medida,
					IF(ce.ubicacion IS NOT NULL,
						(SELECT
							CONCAT(cu.linea,"-",cu.columna,"-",cu.nivel)
						FROM
							cmx_ubicaciones cu
						WHERE
							cu.id = ce.ubicacion),
						"NO UBICADO"
					) UBICACION
				FROM
					cmx_embalaje ce
					INNER JOIN cmx_material_bodega_salida cmbs ON ce.id_material_bodega_salida = cmbs.id
					INNER JOIN cmx_salidas cs ON cmbs.id_salida = cs.id
					INNER JOIN cmx_material_bodega cmb ON ce.id_material_bodega = cmb.id
					INNER JOIN cmx_ingresos ci ON cmb.id_ingreso = ci.id
					INNER JOIN cmx_material_cliente cmc ON cmc.id = cmbs.id_material
					INNER JOIN cmx_unidad_empaque cue ON cue.id = cmc.tipo_embalaje
					INNER JOIN cmx_unidades_presentacion cup ON cup.id = cmc.presentacion
					INNER JOIN cmx_unidades_medida cum ON cum.id = cmc.unidad_presentacion
				WHERE
					ce.sub_estado IN (6,7,8)
					AND ce.estado = 1
					AND ce.id_embalaje IN (
						SELECT
							ce1.id
						FROM
							cmx_embalaje ce1
						WHERE
							ce1.sub_estado = 5
							AND ce1.estado IN (2,3)
							AND ce1.grupo > 0
					)
					AND cs.numero_salida = "' . $numero_salida . '"
					AND cmc.codigo = "' . $codigo . '"
					AND cmbs.lote = "' . $lote . '"
				UNION
				SELECT
					ce.*,
					CONCAT("public/img/qrMaterialesBodega/", ci.id_bodega_destino, "/", ci.numero_ingreso, "/", cmb.delivery, "/", cmc.codigo, "/", cmb.lote, "/estiba/", ce.url_qr) URL_QR,
					IF(ce.grupo = 0 , (ce.id_embalaje - ce.id) , ce.grupo) GRUPO_EMBALAJE,
					cmc.descripcion, cmc.codigo, cmc.cant_contenido_interno, cmc.unidades_x_embalaje,
					cmb.lote, cmb.fecha_vencimiento,
					cue.nom_unidad_empaque,
					cup.nom_unidad_presentacion,
					cum.nom_unidad_medida,
					IF(ce.ubicacion IS NOT NULL,
						(SELECT
							CONCAT(cu.linea,"-",cu.columna,"-",cu.nivel)
						FROM
							cmx_ubicaciones cu
						WHERE
							cu.id = ce.ubicacion),
						"NO UBICADO"
					) UBICACION
				FROM
					cmx_embalaje ce
					INNER JOIN cmx_material_bodega_salida cmbs ON ce.id_material_bodega_salida = cmbs.id
					INNER JOIN cmx_salidas cs ON cmbs.id_salida = cs.id
					INNER JOIN cmx_material_bodega cmb ON ce.id_material_bodega = cmb.id
					INNER JOIN cmx_ingresos ci ON cmb.id_ingreso = ci.id
					INNER JOIN cmx_material_cliente cmc ON cmc.id = cmbs.id_material
					INNER JOIN cmx_unidad_empaque cue ON cue.id = cmc.tipo_embalaje
					INNER JOIN cmx_unidades_presentacion cup ON cup.id = cmc.presentacion
					INNER JOIN cmx_unidades_medida cum ON cum.id = cmc.unidad_presentacion
				WHERE
					ce.grupo > 0
					AND ce.sub_estado IN (6,7,8)
					AND ce.estado = 1
					AND cs.numero_salida = "' . $numero_salida . '"
					AND cmc.codigo = "' . $codigo . '"
					AND cmbs.lote = "' . $lote . '";
			';
		// echo "<p>" . $sql . "</p>";
		$request = $this->_db->getConsulta($sql);
		return $request;
	}

	public function getQrEmbalajesDespachos($numero_salida, $codigo, $lote)
	{
		$sql = '
				SELECT
					ce.*,
					CONCAT("public/img/qrMaterialesBodega/", ci.id_bodega_destino, "/", ci.numero_ingreso, "/", cmb.delivery, "/", cmc.codigo, "/", cmb.lote, "/embalaje/", ce.url_qr) URL_QR,
					IF(ce.grupo = 0 , (ce.id_embalaje - ce.id) , ce.grupo) GRUPO_EMBALAJE,
					cmc.descripcion, cmc.codigo, cmc.cant_contenido_interno, cmc.unidades_x_embalaje,
					cmb.lote, cmb.fecha_vencimiento,
					cue.nom_unidad_empaque,
					cup.nom_unidad_presentacion,
					cum.nom_unidad_medida,
					IF(ce.ubicacion IS NOT NULL,
						(SELECT
							CONCAT(cu.linea,"-",cu.columna,"-",cu.nivel)
						FROM
							cmx_ubicaciones cu
						WHERE
							cu.id = ce.ubicacion),
						"NO UBICADO"
					) UBICACION
				FROM
					cmx_embalaje ce
					INNER JOIN cmx_material_bodega_salida cmbs ON ce.id_material_bodega_salida = cmbs.id
					INNER JOIN cmx_salidas cs ON cmbs.id_salida = cs.id
					INNER JOIN cmx_material_bodega cmb ON ce.id_material_bodega = cmb.id
					INNER JOIN cmx_ingresos ci ON cmb.id_ingreso = ci.id
					INNER JOIN cmx_material_cliente cmc ON cmc.id = cmbs.id_material
					INNER JOIN cmx_unidad_empaque cue ON cue.id = cmc.tipo_embalaje
					INNER JOIN cmx_unidades_presentacion cup ON cup.id = cmc.presentacion
					INNER JOIN cmx_unidades_medida cum ON cum.id = cmc.unidad_presentacion
				WHERE
					ce.sub_estado IN (6,7,8)
					AND ce.estado = 1
					AND ce.id_embalaje IN (
						SELECT
							ce1.id
						FROM
							cmx_embalaje ce1
						WHERE
							ce1.sub_estado = 5
							AND ce1.estado IN (2,3)
							AND ce1.grupo > 0
					)
					AND cs.numero_salida = "' . $numero_salida . '"
					AND cmc.codigo = "' . $codigo . '"
					AND cmbs.lote = "' . $lote . '"
			';
		// echo "<p>" . $sql . "</p>";
		$request = $this->_db->getConsulta($sql);
		return $request;
	}

	public function getMaterialDespacho($numero_salida)
	{
		$sql = '
				SELECT
					DISTINCT(cmbs.id_salida),
					cmc.codigo, cmbs.lote, cmc.descripcion,
					cs.destino,
					(SELECT
						SUM(cmbs1.cantidad)
					FROM cmx_material_bodega_salida cmbs1
					WHERE
						cmbs1.id_salida = cs.id
						AND cmbs1.lote = cmbs.lote
					) cantidad,
					(SELECT
						COUNT(ce1.id)
					FROM cmx_embalaje ce1
					WHERE
						ce1.id_material_bodega_salida = cmbs.id
						AND ce1.grupo > 0
					) ESTIBAS_COMPLETAS,
					(SELECT
						SUM(ce1.cantidad_grupo)
					FROM cmx_embalaje ce1
					WHERE
						ce1.id_material_bodega_salida = cmbs.id
						AND ce1.grupo > 0
						) UNIDADES_EC,
					(SELECT
						COUNT(ce1.id)
					FROM
						cmx_embalaje ce1
						INNER JOIN cmx_material_bodega_salida cmbs1 ON ce1.id_material_bodega_salida = cmbs1.id
						INNER JOIN cmx_salidas cs1 ON cmbs1.id_salida = cs1.id
					WHERE
						ce1.grupo = 0
						AND cs1.id = cs.id
						AND cmbs1.lote = cmbs.lote
						AND ce1.id_embalaje IN (
							SELECT
								ce2.id
							FROM
								cmx_embalaje ce2
							WHERE
								ce2.id = ce1.id_embalaje
								AND ce2.sub_estado = 5
								AND ce2.estado = 2)
					) UNIDADES_EP,
					cmc.unidades_x_tendido,
					cmc.planchas_x_estiba, (cmc.unidades_x_tendido * cmc.planchas_x_estiba) UNIDADES_X_ESTIBA,
					cs.numero_salida, cs.nom_conductor, cs.doc_conductor, cs.placa, cs.precinto
				FROM
					cmx_salidas cs
					INNER JOIN cmx_clientes cc ON cc.id = cs.id_cliente
					INNER JOIN cmx_material_bodega_salida cmbs ON cmbs.id_salida = cs.id
					INNER JOIN cmx_embalaje ce ON ce.id_material_bodega_salida = cmbs.id
					INNER JOIN cmx_material_cliente cmc ON cmbs.id_material = cmc.id
				WHERE
					cs.numero_salida = "' . $numero_salida . '";
			';
		// echo "<p>" . $sql . "</p>";
		$material_envio = $this->_db->getConsulta($sql);
		return $material_envio;
	}

	/****** Consultas para el inventario *****/
	public function getListaBodegas($id_cliente)
	{
		$sql = '
				SELECT
					crd.*,
					cm.municipio, cm.depto, cm.pais,
					(SELECT COUNT(id) FROM cmx_ubicaciones cu1 WHERE estado != 3 AND cu1.id_bodega = cu.id_bodega) TOTAL_OCUPACIONES,
					(SELECT COUNT(id) FROM cmx_ubicaciones cu1 WHERE estado = 1 AND cu1.id_bodega = cu.id_bodega) DISPONIBLES,
					(SELECT COUNT(id) FROM cmx_ubicaciones cu1 WHERE estado = 0 AND cu1.id_bodega = cu.id_bodega) OCUPADAS,
					(SELECT COUNT(id) FROM cmx_ubicaciones cu1 WHERE estado = 2 AND cu1.id_bodega = cu.id_bodega) RESERVADOS
				FROM
					cmx_remitente_destinatario crd
					INNER JOIN cmx_inventario cin ON cin.id_bodega = crd.id
					INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
					INNER JOIN cmx_ubicaciones cu ON cu.id_bodega = crd.id
				WHERE
					crd.id_cliente = "' . $id_cliente . '"
				GROUP BY crd.id;
			';
		// echo "<p>" . $sql . "</p>";
		$lista_bodegas = $this->_db->getConsulta($sql);
		return $lista_bodegas;
	}

	public function getMaterialInvenatrio($id_bodega)
	{
		$sql = '
				SELECT
					cmc.*,
					cc.nombre NOM_CLIENTE,
					cin.cantidad,
					(	SELECT
							COUNT(ce.id)
						FROM
							cmx_embalaje ce
							INNER JOIN cmx_material_bodega cmb ON cmb.id = ce.id_material_bodega
							INNER JOIN cmx_ingresos ci ON ci.id = cmb.id_ingreso
						WHERE
							ce.grupo = 0
							AND ce.sub_estado = 5
							AND ce.estado IN (1,2,3)
							AND cmb.id_material = cmc.id
							AND ci.id_bodega_destino = cin.id_bodega
					) DISPONIBLE,
					crm.numero_riesgo, crm.nom_riesgo_material, crm.descripcion DESCRIPCION_RIESGO, crm.url,
					cup.nom_unidad_presentacion,
					cum.nom_unidad_medida,
					cue.nom_unidad_empaque
				FROM
					cmx_material_cliente cmc
					INNER JOIN cmx_inventario cin ON cin.id_material_cliente = cmc.id
					INNER JOIN cmx_clientes cc ON cc.id = cmc.id_cliente
					INNER JOIN cmx_riesgo_material crm ON cmc.riesgo = crm.id
					INNER JOIN cmx_unidades_presentacion cup ON cup.id = cmc.presentacion
					INNER JOIN cmx_unidades_medida cum ON cum.id = cmc.unidad_presentacion
					INNER JOIN cmx_unidad_empaque cue ON cue.id = cmc.tipo_embalaje
				WHERE
					cin.id_bodega = "' . $id_bodega . '"
					HAVING DISPONIBLE > 0
			;';
		// echo "<p>" . $sql . "</p>";
		$lista_inventario = $this->_db->getConsulta($sql);
		return $lista_inventario;
	}

	public function getMaterialInvenatrioLote($id_material, $id_bodega)
	{
		$sql = '
				SELECT
					cmc.codigo, cmc.descripcion, cmb.lote,
					cmc.unidades_x_tendido, cmc.planchas_x_estiba, (cmc.unidades_x_tendido * cmc.planchas_x_estiba) UNIDADES_X_ESTIBA,
					cmb.fecha_vencimiento,
					(SELECT
							COUNT(ce1.id)
						FROM
							cmx_embalaje ce1
							INNER JOIN cmx_material_bodega cmb1 ON cmb1.id = ce1.id_material_bodega
						WHERE
							ce1.grupo > 0
							AND ce1.sub_estado NOT IN (2,8,10)
							AND cmb1.lote = cmb.lote
							AND UNIDADES_X_ESTIBA = (
								SELECT
									COUNT(ce2.id)
								FROM
									cmx_embalaje ce2
									INNER JOIN cmx_material_bodega cmb2 ON cmb2.id = ce2.id_material_bodega
								WHERE
									ce2.id_embalaje = ce1.id
							)
					) ESTIBAS_COMPLETAS,
					(SELECT
						COUNT(ce1.id)
					FROM
						cmx_embalaje ce1
						INNER JOIN cmx_material_bodega cmb1 ON cmb1.id = ce1.id_material_bodega
					WHERE
						ce1.grupo = 0
						AND ce1.sub_estado NOT IN (2,8,10)
						AND cmb1.lote = cmb.lote


						AND ce1.id_embalaje = (
							SELECT
								ce2.id
							FROM
								cmx_embalaje ce2
							WHERE
								ce1.id_embalaje = ce2.id
								AND ce2.cantidad_grupo = UNIDADES_X_ESTIBA
						)


					) UNIDADES_EC,
					(SELECT
							COUNT(ce1.id)
						FROM
							cmx_embalaje ce1
							INNER JOIN cmx_material_bodega cmb1 ON cmb1.id = ce1.id_material_bodega
						WHERE
							ce1.grupo > 0
							AND ce1.sub_estado NOT IN (2,8,10)
							AND cmb1.id = cmb.id
							AND UNIDADES_X_ESTIBA > ce1.cantidad_grupo
					) ESTIBAS_INCOMPLETAS,
					(SELECT
							COUNT(ce1.id)
						FROM
							cmx_embalaje ce1
							INNER JOIN cmx_material_bodega cmb1 ON cmb1.id = ce1.id_material_bodega
						WHERE
							ce1.grupo = 0
							AND ce1.sub_estado NOT IN (2,8,10)
							AND cmb1.lote = cmb.lote
							AND ce1.id_embalaje = (
								SELECT
									ce2.id
								FROM
									cmx_embalaje ce2
								WHERE
									ce1.id_embalaje = ce2.id
									AND ce2.cantidad_grupo < UNIDADES_X_ESTIBA
							)
					) UNIDADES_EP
				FROM
					cmx_material_cliente cmc
					INNER JOIN cmx_material_bodega cmb ON cmb.id_material = cmc.id
					INNER JOIN cmx_embalaje ce ON ce.id_material_bodega = cmb.id
					INNER JOIN cmx_inventario cin ON cin.id_material_cliente = cmc.id
				WHERE
					cin.id_bodega = "' . $id_bodega . '"
					AND ce.sub_estado NOT IN (2,8,10)
					AND cmc.id = "' . $id_material . '"
				GROUP BY cmb.lote;
			';
		// echo "<p>" . $sql . "</p>";
		$lista_inventario = $this->_db->getConsulta($sql);
		return $lista_inventario;
	}

	public function getUbicacionLote($id_bodega, $id_material, $lote)
	{
		$sql = '
				SELECT
					ce.id,
					CONCAT(cu.linea,"-",cu.columna,"-",cu.nivel) UBICACION,
					CONCAT(cmb.lote,"-",ce.grupo) ESTIBA,
					(
						SELECT
							COUNT(ce1.id)
						FROM
							cmx_embalaje ce1
						WHERE
							ce1.id_embalaje = ce.id
					) EMBALAJES,
					(
						SELECT
							COUNT(ce1.id)
						FROM
							cmx_embalaje ce1
						WHERE
							ce1.id_embalaje = ce.id
							AND ce1.sub_estado = 5
							AND ce1.estado = 1
					) DISPONIBLES
				FROM
					cmx_embalaje ce
					INNER JOIN cmx_ubicaciones cu ON cu.id = ce.ubicacion
					INNER JOIN cmx_material_bodega cmb ON cmb.id = ce.id_material_bodega
					INNER JOIN cmx_ingresos ci ON ci.id = cmb.id_ingreso
					INNER JOIN cmx_material_cliente cmc ON cmc.id = cmb.id_material
				WHERE
					ce.grupo > 0
					AND ce.ubicacion IS NOT NULL
					AND ce.sub_estado = 5
					AND cmc.id = "' . $id_material . '"
					AND cmb.lote = "' . $lote . '"
					AND cu.id_bodega = ' . $id_bodega . '
				ORDER BY UBICACION
			';
		// echo "<p>" . $sql . "</p>";
		$ubicacion = $this->_db->getConsulta($sql);
		return $ubicacion;
	}

	public function getUbicacionMaterial($id_material)
	{
		$sql = '
				SELECT
					CONCAT(cu.linea,"-",cu.columna,"-",cu.nivel) UBICACION,
					cmb.lote, cmb.fecha_vencimiento
				FROM
					cmx_ubicaciones cu
					INNER JOIN cmx_embalaje ce ON ce.ubicacion = cu.id
					INNER JOIN cmx_material_bodega cmb ON ce.id_material_bodega = cmb.id
				WHERE
					ce.grupo > 0
					AND cmb.id_material = "' . $id_material . '";
			';
		// echo "<p>" . $sql . "</p>";
		$ubicacion = $this->_db->getConsulta($sql);
		return $ubicacion;
	}

	public function getLogMatrial($id_material)
	{
		$sql = '
				SELECT
					clmb.*,
					cu.nom_usuario, cu.url_avatar
				FROM
					cmx_log_material_bodega clmb
					INNER JOIN cmx_usuarios cu ON cu.id = clmb.id_usuario
					INNER JOIN cmx_embalaje ce ON ce.url_qr = clmb.qr_leido
					INNER JOIN cmx_material_bodega cmb ON cmb.id = ce.id_material_bodega
				WHERE
					cmb.id_material = "' . $id_material . '";
			';
		// echo "<p>" . $sql . "</p>";
		$ubicacion = $this->_db->getConsulta($sql);
		return $ubicacion;
	}

	public function getMaterialesUbicacion($id_ubicacion)
	{
		$sql = $this->_db3->prepare('
				SELECT
					cmc.codigo , cmc.descripcion, cmb.fecha_vencimiento,
					CONCAT(cmb.lote,"-",ce.grupo) ESTIBA,
					ce.cantidad_grupo, ce.id ID_ESTIBA,
					(
					SELECT
						COUNT(ce1.id)
					FROM
						cmx_embalaje ce1
					WHERE
						ce1.id_embalaje = ce.id
						AND ce1.sub_estado = 5
					) DISPONIBLES
				FROM
					cmx_embalaje ce
					INNER JOIN cmx_material_bodega cmb ON cmb.id = ce.id_material_bodega
					INNER JOIN cmx_material_cliente cmc ON cmc.id = cmb.id_material
				WHERE
					ce.ubicacion = ' . $id_ubicacion . '
					AND ce.grupo > 0');
		$sql->execute();
		$result = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $result;
	}
	/****** Fin Consultas para el inventario *****/

	/****** Consultas para ver configuracion de bodegas *****/
	public function getConfiguracionBodega($id_bodega)
	{
		$sql = $this->_db3->prepare('SELECT cu.id,
					CONCAT(cu.linea,"-",cu.columna,"-",cu.nivel) UBICACION, cu.tipo_ubicacion,
					CONCAT("public/img/qrPosicionesBodega/",cu.id_bodega,"/",cu.linea,"/",cu.columna,"/",cu.nivel,"/",cu.qr_posicion) URL_QR,
					crd.nombre, cu.estado,
					(SELECT COUNT(ce1.id) FROM cmx_embalaje ce1 WHERE ce1.ubicacion = cu.id AND ce1.grupo > 0 AND ce1.sub_estado = 5) CANTIDAD_ESTIBAS,
					IF((SELECT COUNT(ce1.id) FROM cmx_embalaje ce1 WHERE ce1.ubicacion = cu.id AND ce1.grupo > 0 AND ce1.sub_estado = 5),
						(SELECT CONCAT("<span>",cmc1.codigo," - ",cmc1.descripcion,"</span>") FROM cmx_embalaje ce1
								INNER JOIN cmx_material_bodega cmb1 ON cmb1.id = ce1.id_material_bodega
								INNER JOIN cmx_material_cliente cmc1 ON cmc1.id = cmb1.id_material
							WHERE
								ce1.ubicacion = cu.id
								AND ce1.grupo > 0
								AND ce1.sub_estado = 5
							LIMIT 1
						),
						"Disponible"
					) MATERIAL
				FROM
					cmx_ubicaciones cu
					INNER JOIN cmx_remitente_destinatario crd ON crd.id = cu.id_bodega
				WHERE
					cu.estado != "3"
					AND cu.id_bodega = "' . $id_bodega . '"
			');
		$sql->execute();
		$configuracion = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $configuracion;
	}

	public function getUbicacionVirtual($id_bodega)
	{
		$sql = $this->_db3->prepare('SELECT COUNT(cu.id) CUANTOS FROM cmx_ubicaciones cu
				WHERE cu.linea = "0" AND cu.id_bodega = "' . $id_bodega . '"');
		$sql->execute();
		$result = $sql->fetch(PDO::FETCH_ASSOC);
		$total_ubicaciones = $result['CUANTOS'];
		return $total_ubicaciones;

		// $result = $this->_db->getConsulta($sql);
		// return $result;
	}
	/****** Fin Consultas para ver configuracion de bodegas *****/

	/****** Consultas para visualizacion de traslados *****/
	public function getTraslados()
	{
		$sql = '
				SELECT
					ct.id, ct.estado ESTADO_TRASLADO , CONCAT(cmb.lote,"-",ce.grupo) as LOTE, cu.id_bodega,
					cmc.codigo, cmc.descripcion, ce.id ID_EMBALAJE,
				   (SELECT
						COUNT(ce.id)
					FROM
						cmx_embalaje ce
				   WHERE
						ce.id_embalaje = ct.id_embalaje
						AND ce.sub_estado= 5
						AND ce.estado = 1) EXISTENCIAS,
				   (SELECT
						COUNT(ce.id)
					FROM
						cmx_embalaje ce
				   WHERE
						ce.id_embalaje = ct.id_embalaje ) as PROVENIENTES,
				   clmb.fecha_hora, ct.estado, clmb.tipo_movimiento,ct.id_ubicacion_destino DESTINO, ce.ubicacion ORIGEN,
					(SELECT
						CONCAT
							(cu.linea,"-",cu.columna,"-",cu.nivel)
					FROM cmx_ubicaciones cu
					WHERE ce.ubicacion = cu.id ) as UBICACION_ORIGEN,
				   (SELECT CONCAT
						(cu.linea,"-",cu.columna,"-",cu.nivel)
					FROM
						cmx_ubicaciones cu
					WHERE ct.id_ubicacion_destino = cu.id ) as UBICACION_DESTINO,
					cmc.*,
					crm.numero_riesgo, crm.nom_riesgo_material, crm.descripcion DESCRIPCION_RIESGO, crm.url,
					cup.nom_unidad_presentacion,
					cum.nom_unidad_medida,
					cue.nom_unidad_empaque,
					cc.nombre CLIENTE, cc.documento DOC_CLIENTE, cc.digito_verificacion DIGIT_CLIENTE,
					crd.nombre BODEGA, crd.documento DOC_BODEGA, crd.digito_verificacion DIGIT_BODEGA,
					cmb.lote, cmb.fecha_vencimiento,
					ce.grupo GRUPO_ESTIBA
				FROM
					cmx_traslados ct
					INNER JOIN cmx_embalaje ce ON ce.id = ct.id_embalaje
					INNER JOIN cmx_material_bodega cmb ON cmb.id = ce.id_material_bodega
					INNER JOIN cmx_material_cliente cmc ON cmc.id= cmb.id_material
					INNER JOIN cmx_clientes cc ON cc.id= cmc.id_cliente
					INNER JOIN cmx_log_material_bodega clmb ON clmb.id_traslado  = ct.id
					INNER JOIN cmx_ubicaciones cu ON cu.id= ct.id_ubicacion_destino
					INNER JOIN cmx_remitente_destinatario crd ON crd.id= cu.id_bodega
					INNER JOIN cmx_riesgo_material crm ON cmc.riesgo = crm.id
					INNER JOIN cmx_unidades_presentacion cup ON cup.id = cmc.presentacion
					INNER JOIN cmx_unidades_medida cum ON cum.id = cmc.unidad_presentacion
					INNER JOIN cmx_unidad_empaque cue ON cue.id = cmc.tipo_embalaje
				WHERE
					ct.estado != 3
				GROUP BY ct.id
			';
		// echo "<p>" . $sql . "</p>";
		$result = $this->_db->getConsulta($sql);
		return $result;
	}
	/****** Fin Consultas para visualizacion de traslados *****/

	/****** Consultas para visualizacion de traslados *****/
	public function getListaInventario($id_bodega)
	{
		$_filter_query = "";
		if ($id_bodega) {
			$_filter_query .= ' AND crd.id = ' . $id_bodega . ' ';
		}

		$sql = '
				SELECT
					ce.id, ce.ubicacion ID_UBICACION_ORIGEN, ce.grupo GRUPO_ESTIBA, ce.url_qr,
					cmc.*,
					cc.nombre NOM_CLIENTE,
					crd.nombre NOM_BODEGA,
					crm.numero_riesgo, crm.nom_riesgo_material, crm.descripcion DESCRIPCION_RIESGO, crm.url,
					cup.nom_unidad_presentacion,
					cum.nom_unidad_medida,
					cue.nom_unidad_empaque,
					CONCAT(cu.linea,"-",cu.columna,"-",cu.nivel) UBICACION,
					cu.tipo_ubicacion, cu.id_bodega ID_BODEGA,
					(SELECT
						COUNT(ce1.id)
					FROM
						cmx_embalaje ce1
					WHERE
						ce1.grupo = 0
						AND ce1.sub_estado = 5
						AND ce1.estado IN (1,2,3)
						AND ce1.ubicacion = cu.id
					) DISPONIBLE,
					(cmc.unidades_x_tendido * cmc.planchas_x_estiba) CUPO_ESTIBA,
					cmb.lote, cmb.fecha_vencimiento
				FROM
					cmx_ubicaciones cu
					INNER JOIN cmx_remitente_destinatario crd ON crd.id = cu.id_bodega
					INNER JOIN cmx_embalaje ce ON ce.ubicacion = cu.id
					INNER JOIN cmx_material_bodega cmb ON cmb.id = ce.id_material_bodega
					INNER JOIN cmx_material_cliente cmc ON cmc.id = cmb.id_material
					INNER JOIN cmx_clientes cc ON cc.id = cmc.id_cliente
					INNER JOIN cmx_riesgo_material crm ON cmc.riesgo = crm.id
					INNER JOIN cmx_unidades_presentacion cup ON cup.id = cmc.presentacion
					INNER JOIN cmx_unidades_medida cum ON cum.id = cmc.unidad_presentacion
					INNER JOIN cmx_unidad_empaque cue ON cue.id = cmc.tipo_embalaje
				WHERE
					ce.sub_estado = 5
					AND ce.estado != 3
					AND ce.grupo > 0
					' . $_filter_query . '
			';
		// echo "<p>" . $sql . "</p>";
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	public function getUbicacionEstiba($id_estiba, $id_bodega)
	{
		$sql = '
				SELECT
					ce.id ID_ESTIBA, ce.ubicacion ID_UBICACION_ORIGEN, ce.grupo GRUPO_ESTIBA, ce.url_qr,
					cmc.*,
					cc.nombre NOM_CLIENTE,
					crd.nombre NOM_BODEGA,
					cin.cantidad,
					crm.numero_riesgo, crm.nom_riesgo_material, crm.descripcion DESCRIPCION_RIESGO, crm.url,
					cup.nom_unidad_presentacion,
					cum.nom_unidad_medida,
					cue.nom_unidad_empaque,
					CONCAT(cu.linea,"-",cu.columna,"-",cu.nivel) UBICACION,
					cu.tipo_ubicacion, cu.id_bodega ID_BODEGA,
					(SELECT
						COUNT(ce1.id)
					FROM
						cmx_embalaje ce1
					WHERE
						ce1.grupo = 0
						AND ce1.sub_estado = 5
						AND ce1.estado IN (1,2,3)
						AND ce1.ubicacion = cu.id
					) DISPONIBLE,
					(cmc.unidades_x_tendido * cmc.planchas_x_estiba) CUPO_ESTIBA,
					cmb.lote, cmb.fecha_vencimiento
				FROM
					cmx_material_cliente cmc
					INNER JOIN cmx_inventario cin ON cin.id_material_cliente = cmc.id
					INNER JOIN cmx_remitente_destinatario crd ON cin.id_bodega = crd.id
					INNER JOIN cmx_material_bodega cmb ON cmb.id_material = cmc.id
					INNER JOIN cmx_embalaje ce ON ce.id_material_bodega = cmb.id
					INNER JOIN cmx_ubicaciones cu ON ce.ubicacion = cu.id
					INNER JOIN cmx_clientes cc ON cc.id = cmc.id_cliente
					INNER JOIN cmx_riesgo_material crm ON cmc.riesgo = crm.id
					INNER JOIN cmx_unidades_presentacion cup ON cup.id = cmc.presentacion
					INNER JOIN cmx_unidades_medida cum ON cum.id = cmc.unidad_presentacion
					INNER JOIN cmx_unidad_empaque cue ON cue.id = cmc.tipo_embalaje
				WHERE
					ce.id = ' . $id_estiba . '
					AND crd.id = ' . $id_bodega . '
					AND ce.sub_estado = 5
					AND ce.estado != 3
					AND ce.grupo > 0
			';
		// echo "<p>" . $sql . "</p>";
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	public function getCuentaPosicionFull($id_bodega)
	{
		$sql = '
				SELECT
					COUNT(cu.id)
				FROM
					cmx_ubicaciones cu
				WHERE
					cu.estado = 1
					AND cu.tipo_ubicacion = "FULL"
					AND cu.id_bodega = ' . $id_bodega . ';
								';
		// echo "<p>" . $sql . "</p>";
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	public function getCuentaPosicionSaldo($id_bodega)
	{
		$sql = '
				SELECT
					COUNT(cu.id)
				FROM
					cmx_ubicaciones cu
				WHERE
					cu.estado = 1
					AND cu.tipo_ubicacion = "Saldos"
					AND cu.id_bodega = ' . $id_bodega . ';
								';
		// echo "<p>" . $sql . "</p>";
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	public function getHtmlSelectPosicionFull($name, $id, $id_name, $id_bodega)
	{
		if ($name) {
			$sql = '
					SELECT
						cu.id, CONCAT(cu.linea,"-",cu.columna,"-",cu.nivel) POSICION, cu.tipo_ubicacion
					FROM
						cmx_ubicaciones cu
					WHERE
						cu.tipo_ubicacion = "FULL"
						AND cu.estado = 1
						AND cu.id_bodega = ' . $id_bodega . '
				;';

			// echo $sql;
			$array = $this->_db->getConsulta($sql);

			// Se recorre contenido de la consulta
			if ($array) {
				// print_r($array);
				$select = '
						<select class="select2 select2-hidden-accessible" name="' . $name . '" id="slct_ubicacion_' . $id_name . '" aria-hidden="true">
						<option value="">Seleccione</option>
					';

				foreach ($array['rowsData'] as $key => $value) {
					if ($value[0] == $id) {
						$select .= '<option value="' . $value[0] . '" selected="">' . $value[1] . ' (' . $value[2] . ')</option>';
					} else {
						$select .= '<option value="' . $value[0] . '">' . $value[1] . ' (' . $value[2] . ')</option>';
					}
				}
				$select .= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}

		return $select;
	}

	public function getHtmlSelectPosicionSaldos($name, $id, $id_name, $id_bodega)
	{
		if ($name) {
			$sql = '
					SELECT
						cu.id, CONCAT(cu.linea,"-",cu.columna,"-",cu.nivel) POSICION, cu.tipo_ubicacion
					FROM
						cmx_ubicaciones cu
					WHERE
						cu.tipo_ubicacion = "Saldos"
						AND cu.estado = 1
						AND cu.id_bodega = ' . $id_bodega . '
						;
				';

			// echo $sql;
			$array = $this->_db->getConsulta($sql);

			// Se recorre contenido de la consulta
			if ($array) {
				$select = '
						<select class="select2 select2-hidden-accessible" name="' . $name . '" id="slct_ubicacion_' . $id_name . '" aria-hidden="true">
						<option value="">Seleccione</option>
					';

				foreach ($array['rowsData'] as $key => $value) {
					if ($value[0] == $id) {
						$select .= '<option value="' . $value[0] . '" selected="">' . $value[1] . ' (' . $value[2] . ')</option>';
					} else {
						$select .= '<option value="' . $value[0] . '">' . $value[1] . ' (' . $value[2] . ')</option>';
					}
				}
				$select .= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}
		return $select;
	}
	/****** Fin Consultas para visualizacion de traslados

    /****** Consultas para generación de devoluciones en ingreso de material *****/
	public function getNovedadIngreso($ingreso)
	{
		$sql = '
				SELECT
					ce.id,
					cmc.codigo, cmc.descripcion,
					CONCAT(cmb.lote,"-",ce.grupo) ESTIBA,
					(	SELECT
							COUNT(ce1.id)
						FROM
							cmx_embalaje ce1
						WHERE
							ce1.id_embalaje = ce.id
					) CANTIDAD,
					(	SELECT
							COUNT(ce1.id)
						FROM
							cmx_embalaje ce1
						WHERE
							ce1.id_embalaje = ce.id
							AND ce1.sub_estado = 2
							AND ce1.estado = 2
					) DISPONIBLES
				FROM
					cmx_ingresos ci
					INNER JOIN cmx_material_bodega cmb ON cmb.id_ingreso = ci.id
					INNER JOIN cmx_material_cliente cmc ON cmc.id = cmb.id_material
					INNER JOIN cmx_embalaje ce ON ce.id_material_bodega = cmb.id
				WHERE
					ci.numero_ingreso = "' . $ingreso . '"
					AND ce.sub_estado = 2
					AND ce.estado = 2
					AND ce.grupo > 0
			';
		// echo "<p>" . $sql . "</p>";
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	public function getHtmlSelectCausaNovedad($name, $id)
	{
		if ($name) {
			$sql = '
					SELECT *
					FROM cmx_tipo_causa_novedad ctcn
					WHERE ctcn.estado = 1
				';

			$array = $this->_db->getConsulta($sql);
			// print_r("<pre>");
			// print_r($array);
			// print_r("</pre>");

			// Se recorre contenido de la consulta
			if ($array) {
				// print_r($array);
				$select = '
						<select class="select2 select2-hidden-accessible" name="' . $name . '" id="slct_tipo_novedad_' . $id . '" aria-hidden="true">
					';
				$select .= '<option value="" selected disabled>Seleccione</option>';

				foreach ($array['rowsData'] as $key => $value) {

					if ($value[0] == $id) {
						$select .= '<option value="' . $value[0] . '" selected="">' . $value["nombre"] . '</option>';
					} else {
						$select .= '<option value="' . $value[0] . '">' . $value["nombre"] . '</option>';
					}
				}
				$select .= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}

		return $select;
	}

	/****** Fin Consultas para generación de devoluciones en ingreso de material *****/

	/****** Consultas para visualización de novedades en elingreso de material a las bodegas *****/
	public function getNovedades($id_cliente, $id_bodega)
	{
		$_filter_query = '';
		if ($id_cliente != 1) {
			$_filter_query .= ' AND cmc.id_cliente = "' . $id_cliente . '" ';
		}
		if ($id_bodega) {
			$_filter_query .= ' AND cmb.id_bodega = "' . $id_bodega . '" ';
		}

		$sql = '
				SELECT
					cn.*,
					COUNT(cne.id) EMBALAJES_AFECTADOS,
					ctcn.nombre,
					cmc.codigo, cmc.descripcion, cmb.lote,
					cu.nom_usuario, CONCAT("public/img/users/",cu.url_avatar) URL_AVATAR, cp.nombre_perfil,
					crd.nombre BODEGA, crd.documento DOC_BODEGA, crd.digito_verificacion DIGIT_BODEGA
				FROM
					cmx_novedades cn
					INNER JOIN cmx_tipo_causa_novedad ctcn ON ctcn.id = cn.causa_novedad
					INNER JOIN cmx_usuarios cu ON cu.id = cn.id_usuario
					INNER JOIN cmx_usuario_cliente cuc ON cuc.id_usuario = cu.id
					INNER JOIN cmx_perfiles cp ON cp.id = cuc.id_perfil
					INNER JOIN cmx_novedad_estiba cne ON cne.id_novedad = cn.id
					INNER JOIN cmx_embalaje ce ON ce.id = cne.id_embalaje
					INNER JOIN cmx_material_bodega cmb ON cmb.id = ce.id_material_bodega
					INNER JOIN cmx_remitente_destinatario crd ON crd.id = cmb.id_bodega
					INNER JOIN cmx_material_cliente cmc ON cmc.id = cmb.id_material
				WHERE
					cn.estado = 1
					' . $_filter_query . '
				GROUP BY cn.id
			';
		// echo "<p>" . $sql . "</p>";
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	/****** Consultas para visualización de novedades en elingreso de material a las bodegas *****/
	public function getMaterialNovedades($numero_novedad)
	{
		$sql = '
				SELECT
					cn.*,
					ctcn.nombre,
					cmc.codigo, cmc.descripcion, cmc.cant_contenido_interno, cmc.unidades_x_embalaje, cmb.lote, cmb.fecha_vencimiento,
					ce.grupo, ce.cantidad_grupo, cup.nom_unidad_presentacion, cue.nom_unidad_empaque, cum.nom_unidad_medida,
					IF(ce.grupo = 0 , (ce.id_embalaje - ce.id) , ce.grupo) GRUPO_EMBALAJE,
					IF(ce.grupo = 0 , cue.nom_unidad_empaque, "Estiba") TIPO_EMBALAJE,
					CONCAT("public/img/qrMaterialesBodega/", ci.id_bodega_destino, "/", ci.numero_ingreso, "/", cmb.delivery, "/", cmc.codigo, "/", cmb.lote, "/estiba/", ce.url_qr) URL_QR,
					cu.nom_usuario, CONCAT("public/img/users/",cu.url_avatar) URL_AVATAR, cp.nombre_perfil,
					crd.nombre BODEGA, crd.documento DOC_BODEGA, crd.digito_verificacion DIGIT_BODEGA
				FROM
					cmx_novedades cn
					INNER JOIN cmx_tipo_causa_novedad ctcn ON ctcn.id = cn.causa_novedad
					INNER JOIN cmx_usuarios cu ON cu.id = cn.id_usuario
					INNER JOIN cmx_usuario_cliente cuc ON cuc.id_usuario = cu.id
					INNER JOIN cmx_perfiles cp ON cp.id = cuc.id_perfil
					INNER JOIN cmx_novedad_estiba cne ON cne.id_novedad = cn.id
					INNER JOIN cmx_embalaje ce ON ce.id = cne.id_embalaje
					INNER JOIN cmx_material_bodega cmb ON cmb.id = ce.id_material_bodega
					INNER JOIN cmx_ingresos ci ON ci.id = cmb.id_ingreso
					INNER JOIN cmx_remitente_destinatario crd ON crd.id = cmb.id_bodega
					INNER JOIN cmx_material_cliente cmc ON cmc.id = cmb.id_material
					INNER JOIN cmx_unidad_empaque cue ON cue.id = cmc.tipo_embalaje
					INNER JOIN cmx_unidades_presentacion cup ON cup.id = cmc.presentacion
					INNER JOIN cmx_unidades_medida cum ON cum.id = cmc.unidad_presentacion
				WHERE
					cn.numero_novedad = ' . $numero_novedad . '
			';
		// echo "<p>" . $sql . "</p>";
		$result = $this->_db->getConsulta($sql);
		return $result;
	}
	/****** FIN Consultas para visualización de novedades en elingreso de material a las bodegas *****/
}
