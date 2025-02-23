<?php
class tipo_vehiculoModel extends Model
{

	public function __construct()
	{
		parent::__construct();
	}

	public function getTipo_vehiculo()
	{
		$tipo_vehiculo = $this->_db->getConsulta("select * from cmx_tipo_vehiculo");
		return $tipo_vehiculo;
	}

	public function getTabla()
	{
		$tipo_vehiculo = $this->_db->getConsulta("
			");
		return $tipo_vehiculo;
	}

	public function getHtmlSelect($name, $id)
	{

		if ($name) {
			$query = $this->_db3->prepare('SELECT * FROM cmx_tipo_vehiculos ctv');
			$query->execute();
			$array = $query->fetchAll(PDO::FETCH_ASSOC);

			// echo $query;
			// $array = $this->_db->getConsulta($query);

			// Se recorre contenido de la consulta
			if ($array) {
				$select = '<select class="form-control" name="' . $name . '" id="slct_tipo_vehiculo_' . $id . '" aria-hidden="false">';
				$select .= '<option value="" disabled="disabled" selected= "selected">Seleccione</option>';

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

	//TABLA VEHICULOS NUEVA
	public function getHtmlSelect2($name, $id)
	{

		if ($name) {
			$query = 'SELECT * FROM cmx_para_tipo_vehiculo ctv';

			// echo $query;
			// $array = $this->_db->getConsulta($query);
			$sql = $this->_db3->prepare($query);
			$sql->execute();
			$array = $sql->fetchAll(PDO::FETCH_ASSOC);

			// Se recorre contenido de la consulta
			if ($array) {
				// print_r($array);
				$select = '
						<select class="form-control" name="' . $name . '" id="slct_tipo_vehiculo_' . $id . '" aria-hidden="false">
					';
				$select .= '<option value="" disabled="disabled" selected= "selected">Seleccione</option>';

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
}
