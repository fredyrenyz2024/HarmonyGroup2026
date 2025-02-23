<?php
class unidades_medidaModel extends Model
{

	public function __construct()
	{
		parent::__construct();
	}

	public function getUnidades_medida()
	{
		$unidades_medida = $this->_db->getConsulta("SELECT * FROM cmx_unidades_medida");
		return $unidades_medida;
	}

	public function getTabla()
	{
		$unidades_medida = $this->_db->getConsulta("SELECT * FROM cmx_unidades_medida");
		return $unidades_medida;
	}

	public function getHtmlSelect($name, $id)
	{

		if ($name) {
			$query = 'SELECT * FROM cmx_unidades_medida cum';

			// echo $query;
			// $array = $this->_db->getConsulta($query);
			$array = $this->_db3->prepare($query);
			$array->execute();
			$array = $array->fetchAll(PDO::FETCH_ASSOC);

			// Se recorre contenido de la consulta
			// Se recorre contenido de la consulta
			if ($array) {
				// print_r($array);
				$select = '
						<select class="select2 select2-hidden-accessible" name="' . $name . '" id="slct_servicios_operador_' . $id . '" aria-hidden="true">
					';
				$select .= '<option value="" selected disabled>Seleccione</option>';

				foreach ($array as $key => $value) {

					if ($value['id'] == $id) {
						$select .= '<option value="' . $value['id'] . '" selected="">' . $value['nom_unidad_medida'] . '</option>';
					} else {
						$select .= '<option value="' . $value['id'] . '">' . $value['nom_unidad_medida'] . '</option>';
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

	public function getHtmlSelectMultiple($name, $id)
	{

		if ($name) {
			$query = 'SELECT * FROM cmx_unidades_medida cum';

			// echo $query;
			$array = $this->_db->getConsulta($query);

			// Se recorre contenido de la consulta
			if ($array) {
				// print_r($array);
				$select = '
						<select class="tags" multiple="multiple" name="' . $name . '" id="slct_unidades_medida_' . $id . '" aria-hidden="true">
					';
				foreach ($array['rowsData'] as $key => $value) {

					if ($value[0] == $id) {
						$select .= '<option value="' . $value[0] . '" selected="">' . $value[1] . '</option>';
					} else {
						$select .= '<option value="' . $value[0] . '">' . $value[1] . '</option>';
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

	public function getEnumSlctTipoUnidad($name, $id, $value_select)
	{
		$sql = "
				SHOW COLUMNS FROM 
					cmx_unidades_medida 
				LIKE 'tipo_unidad' 
			";
		// echo "<p>" . $sql . "</p>";
		$result = $this->_db->getConsulta($sql);

		foreach ($result["rowsData"] as $key => $value) {
			$value["Type"] = str_replace("enum(", "", $value["Type"]);
			$value["Type"] = str_replace(")", "", $value["Type"]);
			$value["Type"] = str_replace("'", "", $value["Type"]);

			$arrayTipoActividad = explode(",", $value["Type"]);
		}
		// print_r("<pre>");
		// print_r($arrayTipoActividad);
		// print_r("</pre>");

		$select = '
				<select class="select2 select2-hidden-accessible" name="' . $name . '" id="slct_tipo_unidad_' . $id . '" aria-hidden="true">
			';
		$select .= '<option disabled selected>Seleccione</option>';
		foreach ($arrayTipoActividad as $key => $value) {
			if ($value == $value_select) {
				$select .= '<option value="' . $value . '" selected="">' . $value . '</option>';
			} else {
				$select .= '<option value="' . $value . '">' . $value . '</option>';
			}
		}
		$select .= '</select>';

		return $select;
	}
}
