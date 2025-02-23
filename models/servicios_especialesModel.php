<?php
class servicios_especialesModel extends Model
{

	public function __construct()
	{
		parent::__construct();
	}

	public function getTabla()
	{
		$sql = $this->_db3->prepare('SELECT ccc.*, (SELECT COUNT(cccu1.id) FROM cmx_contabilidad_cuentas cccu1 WHERE cccu1.id_concepto = ccc.id) CUANTOS
				FROM cmx_contabilidad_conceptos ccc
				GROUP BY ccc.id');
		$sql->execute();
		$conceptos = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $conceptos;
		// $return = $this->_db->getConsulta($sql);
		// return $return;
	}

	public function getEnumSlctTipoServicio_sm($name, $id, $value_select)
	{
		$sql = "
				SHOW COLUMNS FROM 
				cmx_contabilidad_conceptos 
				LIKE 'tipo_servicio' 
			";
		$result = $this->_db->getConsulta($sql);

		foreach ($result["rowsData"] as $key => $value) {
			$value["Type"] = str_replace("enum(", "", $value["Type"]);
			$value["Type"] = str_replace(")", "", $value["Type"]);
			$value["Type"] = str_replace("'", "", $value["Type"]);

			$array = explode(",", $value["Type"]);
		}
		// print_r("<pre>");
		// print_r($array);
		// print_r("</pre>");

		$select = '<select class="form-control input-sm" name="' . $name . '" id="slct_tipo_operacion_' . $id . '">';
		$select .= '<option disabled selected>Seleccione</option>';
		foreach ($array as $key => $value) {
			if ($value == $value_select) {
				$select .= '<option value="' . $value . '" selected="">' . $value . '</option>';
			} else {
				$select .= '<option value="' . $value . '">' . $value . '</option>';
			}
		}
		$select .= '</select>';
		return $select;
	}


	public function Consulta_Tabla($tipo_doc, $numdoc)
	{
		try {
			$resultado = $this->_db2->conectar();
			if ($tipo_doc == "cot") {
				$sql = "";
			}
			if ($tipo_doc == "ss") {
				$sql = "";
			}
			if ($tipo_doc == "oc") {
				$sql = "";
			}
			if ($tipo_doc == "rm") {
				$sql = "";
			}
			if ($tipo_doc == "mnf") {
				$sql = "";
			}
			if ($tipo_doc == "cu") {
				$sql = "";
			}
			$consulta = $resultado->query($sql);
			return $consulta->fetch();
		} catch (PDOExeption $e) {
			$error = $e->getMessage();
			// $this->_db2->rollBack();
		}
	}
}
