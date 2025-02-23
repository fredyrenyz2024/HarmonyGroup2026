<?php
class monedasModel extends Model
{

	public function __construct()
	{
		parent::__construct();
	}

	public function getMonedas()
	{
		$monedas = $this->_db->getConsulta("SELECT * FROM cmx_monedas");
		return $monedas;
	}

	public function getTabla()
	{
		// $monedas = $this->_db->getConsulta("SELECT * FROM cmx_monedas");
		$monedas = $this->_db3->prepare("SELECT * FROM cmx_monedas");
		$monedas->execute();
		$monedas = $monedas->fetchAll(PDO::FETCH_ASSOC);
		return $monedas;
	}

	public function getHtmlSelect($name, $id)
	{
		if ($name) {
			$query = $this->_db3->prepare('SELECT * FROM cmx_monedas cmo WHERE cmo.estado = 1');
			$query->execute();
			$array = $query->fetchAll(PDO::FETCH_ASSOC);
			// $array = $this->_db->getConsulta($query);
			if ($array) {
				$select = '<select class="select2 select2-hidden-accessible oferta-comercial" data-campo="id_moneda" name="' . $name . '" id="slct_monedas_' . $id . '" aria-hidden="true">';
				$select .= '<option value="" selected disabled>Seleccione</option>';
				foreach ($array as $key => $value) {
					if ($value['id'] == $id) {
						$select .= '<option value="' . $value['id'] . '" selected="">' . $value['nom_moneda'] . '</option>';
					} else {
						$select .= '<option value="' . $value['id'] . '">' . $value['nom_moneda'] . '</option>';
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
			$query = 'SELECT * FROM cmx_monedas cmo WHERE cmo.estado = 1';
			$array = $this->_db->getConsulta($query);
			if ($array) {
				// print_r($array);
				$select = '
						<select class="tags" multiple="multiple" name="' . $name . '" id="slct_monedas_' . $id . '" aria-hidden="true">
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
