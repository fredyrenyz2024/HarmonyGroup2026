<?php

class municipiosModel extends Model
{
	public function __construct()
	{
		parent::__construct();
	}

	public function getMunicipios()
	{
		$sql = '
				SELECT * 
				FROM cmx_municipios cm
				WHERE cm.depto IS NOT NULL AND cm.depto != "" 
					AND cm.municipio IS NOT NULL AND cm.municipio != ""
				ORDER BY cm.pais, cm.depto, cm.municipio
				';
		$return = $this->_db->getConsulta($sql);
		return $return;
	}

	public function getHtmlSelect_pos()
	{
		$sql = 'SELECT * FROM cmx_para_codigo_postal';
		$array = $this->_db->getConsulta($sql);
		if ($array) {
			$select = '<select class="form-select form-select-sm" id="slct_codigo_postal" aria-hidden="true">';
			$select .= '<option value="" selected>Seleccione</option>';
			foreach ($array['rowsData'] as $key => $value) {
				$select .= '<option value="' . $value['codigo'] . '" selected="">' . $value["codigo"] . '</option>';
			}
			$select .= '</select>';
		}
		return $select;
	}


	public function getMunicipiosById($id)
	{
		$sql = '
				SELECT * 
				FROM cmx_municipios cm
				WHERE cm.id = ' . $id . '
			';
		$return = $this->_db->getConsulta($sql);
		return $return;
	}

	public function getPais($pais)
	{
		$sql = '
				SELECT * 
				FROM cmx_municipios cm
				WHERE cm.pais = "' . $pais . '"
			';
		$return = $this->_db->getConsulta($sql);
		return $return;
	}

	public function crearPais($pais)
	{
		$array = array();
		$array["pais"] = $pais;
		return $this->_db->setRegistro("cmx_municipios", $array);
	}

	public function getDepto($pais, $depto)
	{
		$sql = '
				SELECT * 
				FROM cmx_municipios cm
				WHERE cm.pais = "' . $pais . '"
					AND cm.depto = "' . $depto . '"
			';
		$return = $this->_db->getConsulta($sql);
		return $return;
	}

	public function crearDepto($pais, $depto)
	{
		$return = false;
		// Se pregunta si exite un registro del pais sin datos 
		$sql = '
				SELECT * 
				FROM cmx_municipios cm
				WHERE cm.depto = "" 
					AND cm.municipio = ""
					AND cm.pais = "' . $pais . '"
			';
		$result = $this->_db->getConsulta($sql);
		// Si exite el pais sin tener depto y municipio sin registrar se actuualiza el registro
		if ($result) {
			$id_municipio = $result["rowsData"][0]["id"];

			$array = array();
			$array["depto"] = $depto;
			if ($this->_db->updateRegistro("cmx_municipios", $array, (int)$id_municipio)) {
				$return = true;
			}
		} else {
			$array = array();
			$array["pais"] = $pais;
			$array["depto"] = $depto;
			if ($this->_db->setRegistro("cmx_municipios", $array)) {
				$return = true;
			}
		}
		return $return;
	}

	public function getMunicipio($pais, $depto, $municipio)
	{
		$sql = '
				SELECT * 
				FROM cmx_municipios cm
				WHERE cm.pais = "' . $pais . '"
					AND cm.depto = "' . $depto . '"
					AND cm.municipio = "' . $municipio . '"
			';
		$return = $this->_db->getConsulta($sql);
		return $return;
	}

	public function crearMunicipio($pais, $depto, $municipio, $valor_ica, $latitud, $longitud)
	{
		$return = false;
		// Se pregunta si exite un registro del pais sin datos 
		$sql = '
				SELECT * 
				FROM cmx_municipios cm
				WHERE cm.municipio = ""
					AND cm.depto = "' . $depto . '" 
					AND cm.pais = "' . $pais . '"
			';
		$result = $this->_db->getConsulta($sql);
		// Si exite el pais sin tener depto y municipio sin registrar se actuualiza el registro
		if ($result) {
			$id_municipio = $result["rowsData"][0]["id"];
			$array = array();
			$array["depto"] = $depto;
			$array["municipio"] = $municipio;
			$array["valor_ica"] = $valor_ica;
			$array["latitud"] = $latitud;
			$array["longitud"] = $longitud;
			$array["estado"] = "Activa";
			if ($this->_db->updateRegistro("cmx_municipios", $array, (int)$id_municipio)) {
				$return = true;
			}
		} else {
			$array = array();
			$array["pais"] = $pais;
			$array["depto"] = $depto;
			$array["municipio"] = $municipio;
			$array["valor_ica"] = $valor_ica;
			$array["latitud"] = $latitud;
			$array["longitud"] = $longitud;
			$array["estado"] = "Activa";
			if ($this->_db->setRegistro("cmx_municipios", $array)) {
				$return = true;
			}
		}
		return $return;
	}

	public function getHtmlSelect($name, $id)
	{
		if ($name) {
			$rndc_id_municipio = "";
			$_flag_rndc_id_municipio = true;
			if (!$id) {
				$_flag_rndc_id_municipio = false;
			}
			$sql = '
					SELECT * 
					FROM cmx_municipios cm
					WHERE cm.depto IS NOT NULL AND cm.depto != "" 
						AND cm.municipio IS NOT NULL AND cm.municipio != ""
					ORDER BY cm.pais, cm.depto, cm.municipio
				';
			$array = $this->_db->getConsulta($sql);

			// Se recorre contenido de la consulta
			if ($array) {
				$select = '<select class="form-select form-select-sm" name="' . $name . '" id="slct_municipios_' . $id . '" aria-hidden="true">';
				$select .= '<option value="" disabled="disabled" selected= "selected">Seleccione</option>';
				foreach ($array['rowsData'] as $key => $value) {
					if ($value["id"] == $id || $_flag_rndc_id_municipio) {
						$select .= '<option value="' . $value["id"] . '" selected="">' . $value["municipio"] . ' (' . $value["depto"] . ' - ' . $value["pais"] . ')</option>';
						$rndc_id_municipio = $value["rndc_codigo_ciudad"];
						$_flag_rndc_id_municipio = false;
					} else {
						$select .= '<option value="' . $value["id"] . '">' . $value["municipio"] . ' (' . $value["depto"] . ' - ' . $value["pais"] . ')</option>';
					}
				}
				$select .= '</select>';
				$select .= '<input type="hidden" id="rndc_id_municipio" name="rndc_id_municipio" value=' . $rndc_id_municipio . ' >';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}
		return $select;
	}

	public function getHtmlSelectnew()
	{
		$sql = 'SELECT * 
					FROM cmx_municipios cm
					WHERE cm.depto IS NOT NULL AND cm.depto != "" 
						AND cm.municipio IS NOT NULL AND cm.municipio != "" AND cm.pais="COLOMBIA"
					ORDER BY cm.pais, cm.depto, cm.municipio
				';
		$array = $this->_db->getConsulta($sql);
		// $select = '<select class="form-select" aria-label="Example select with button addon" name="slct_municipios" id="slct_municipios" aria-hidden="true">';
		$select = '<select class="w-100" aria-label="Example select with button addon" name="slct_municipios" id="slct_municipios" aria-hidden="true">';
		$select .= '<option value="" disabled="disabled" selected>Seleccione</option>';
		// Se recorre contenido de la consulta
		if ($array) {
			// $select .= '<option value="" disabled="disabled" selected>Seleccione</option>';
			foreach ($array['rowsData'] as $key => $value) {
				$select .= '<option value="' . $value["rndc_codigo_ciudad"] . '">    ' . $value["municipio"] . ' (' . $value["depto"] . ' - ' . $value["pais"] . ')</option>';
			}
			$select .= '</select>';
		} else {
			$select = "No hay datos en esta tabla...";
		}

		return $select;
	}

	public function getHtmlSelectnew2()
	{
		$sql = 'SELECT * 
					FROM cmx_municipios cm
					WHERE cm.depto IS NOT NULL AND cm.depto != "" 
						AND cm.municipio IS NOT NULL AND cm.municipio != "" AND cm.pais="COLOMBIA"
					ORDER BY cm.pais, cm.depto, cm.municipio
				';
		$array = $this->_db->getConsulta($sql);
		// $select = '<select class="form-select" aria-label="Example select with button addon" name="slct_municipios2" id="slct_municipios2" aria-hidden="true">';
		$select = '<select class="w-100" aria-label="Example select with button addon" name="slct_municipios2" id="slct_municipios2" aria-hidden="true">';
		$select .= '<option value="" disabled="disabled" selected>Seleccione</option>';
		// Se recorre contenido de la consulta
		if ($array) {
			// $select .= '<option value="" disabled="disabled" selected= "selected">Seleccione</option>';
			foreach ($array['rowsData'] as $key => $value) {
				$select .= '<option value="' . $value["rndc_codigo_ciudad"] . '">    ' . $value["municipio"] . ' (' . $value["depto"] . ' - ' . $value["pais"] . ')</option>';
			}
			$select .= '</select>';
		} else {
			$select = "No hay datos en esta tabla...";
		}

		return $select;
	}


	public function getHtmlSelect_sm($name, $id, $id_ciudad)
	{
		if ($name) {
			$rndc_id_municipio = "";
			$_flag_rndc_id_municipio = true;
			if (!$id) {
				$_flag_rndc_id_municipio = false;
			}
			$sql = '
					SELECT * 
					FROM cmx_municipios cm
					WHERE cm.depto IS NOT NULL AND cm.depto != "" 
						AND cm.municipio IS NOT NULL AND cm.municipio != ""
					ORDER BY cm.pais, cm.depto, cm.municipio
				';
			$array = $this->_db->getConsulta($sql);

			// Se recorre contenido de la consulta
			if ($array) {
				$select = '<select class="form-select form-select-sm" name="' . $name . '" id="slct_municipios_' . $id . '" aria-hidden="true">';
				$select .= '<option value="" disabled="disabled" selected= "selected">Seleccione</option>';
				foreach ($array['rowsData'] as $key => $value) {
					if ($value["id"] == $id_ciudad || $_flag_rndc_id_municipio) {
						$select .= '<option value="' . $value["id"] . '" selected="">' . $value["municipio"] . ' (' . $value["depto"] . ' - ' . $value["pais"] . ')</option>';
						$rndc_id_municipio = $value["rndc_codigo_ciudad"];
						$_flag_rndc_id_municipio = false;
					} else {
						$select .= '<option value="' . $value["id"] . '">' . $value["municipio"] . ' (' . $value["depto"] . ' - ' . $value["pais"] . ')</option>';
					}
				}
				$select .= '</select>';
				$select .= '<input type="hidden" id="rndc_id_municipio" name="rndc_id_municipio" value=' . $rndc_id_municipio . ' >';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}
		return $select;
	}

	public function getHtmlSelect_sede($name, $id, $id_ciudad)
	{
		if ($name) {
			$rndc_id_municipio = "";
			$_flag_rndc_id_municipio = true;
			if (!$id) {
				$_flag_rndc_id_municipio = false;
			}
			$sql = '
					SELECT * 
					FROM cmx_municipios cm
					WHERE cm.depto IS NOT NULL AND cm.depto != "" 
					AND cm.municipio IS NOT NULL AND cm.municipio != ""
					ORDER BY cm.municipio, cm.depto, cm.pais
				';
			$array = $this->_db->getConsulta($sql);

			// Se recorre contenido de la consulta
			if ($array) {
				$select = '<select class="form-select form-select-sm" name="' . $name . '" id="slct_municipios_sede_' . $id . '" aria-hidden="true">';
				$select .= '<option value="" disabled="disabled" selected= "selected">Seleccione</option>';
				foreach ($array['rowsData'] as $key => $value) {
					if ($value["id"] == $id_ciudad || $_flag_rndc_id_municipio) {
						$select .= '<option value="' . $value["id"] . '" selected="">' . $value["municipio"] . ' (' . $value["depto"] . ' - ' . $value["pais"] . ')</option>';
						$rndc_id_municipio = $value["rndc_codigo_ciudad"];
						$_flag_rndc_id_municipio = false;
					} else {
						$select .= '<option value="' . $value["id"] . '">' . $value["municipio"] . ' (' . $value["depto"] . ' - ' . $value["pais"] . ')</option>';
					}
				}
				$select .= '</select>';
				$select .= '<input type="hidden" id="rndc_id_municipio" name="rndc_id_municipio" value=' . $rndc_id_municipio . ' >';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}
		return $select;
	}
}
