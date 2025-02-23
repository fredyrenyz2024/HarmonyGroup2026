<?php
class contenedoresModel extends Model
{

	public function __construct()
	{
		parent::__construct();
	}

	public function getContenedores()
	{
		$monedas = $this->_db->getConsulta("SELECT * FROM ctc_tipo_contenedor");
		return $monedas;
	}

	public function getTabla()
	{
		$monedas = $this->_db->getConsulta("SELECT * FROM ctc_tipo_contenedor");
		return $monedas;
	}

	public function getHtmlSelect($name, $id)
	{

		if ($name) {
			$query = 'SELECT * FROM cmx_tipo_contenedor ctc';

			// echo $query;
			$array = $this->_db->getConsulta($query);

			// Se recorre contenido de la consulta
			if ($array) {
				// print_r($array);
				$select = '
						<select class="form-control" name="' . $name . '" id="slct_tipo_contenedor_1' . $id . '">
					';
				$select .= '<option value="" selected disabled>Seleccione</option>';

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

	public function getHtmlSelect_sm($name, $id)
	{

		if ($name) {
			$query = $this->_db3->prepare('SELECT * FROM cmx_tipo_contenedor ctc');
			$query->execute();
			$array = $query->fetchAll(PDO::FETCH_ASSOC);

			// echo $query;
			// $array = $this->_db->getConsulta($query);

			// Se recorre contenido de la consulta
			if ($array) {
				$select = '<select class="form-control input-sm" name="' . $name . '" id="slct_tipo_contenedor_1' . $id . '">';
				$select .= '<option value="" selected disabled>Seleccione</option>';

				foreach ($array as $key => $value) {
					if ($value['id'] == $id) {
						$select .= '<option value="' . $value['id'] . '" selected="">' . $value['nombre'] . '</option>';
					} else {
						$select .= '<option value="' . $value['id'] . '">' . $value['nombre'] . '</option>';
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
			$query = 'SELECT * FROM cmx_tipo_contenedor ctc';

			// echo $query;
			$array = $this->_db->getConsulta($query);

			// Se recorre contenido de la consulta
			if ($array) {
				// print_r($array);
				$select = '
						<select class="tags" multiple="multiple" name="' . $name . '" id="slct_tipo_contenedor_' . $id . '" aria-hidden="true">
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
}
