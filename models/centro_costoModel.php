<?php
class centro_costoModel extends Model
{

	public function __construct()
	{
		parent::__construct();
	}


	public function getCentro_costo()
	{
		$centro_costo = $this->_db->getConsulta("select * from cmx_centro_costo");
		return $centro_costo;
	}


	public function getTabla($id_cliente)
	{
		$sql = $this->_db3->prepare('SELECT ccc.* FROM cmx_centro_costo ccc
					INNER JOIN cmx_clientes ccl ON ccl.id = ccc.id_cliente
					AND ccl.id = "' . $id_cliente . '"');
		$sql->execute();
		$centro_costo = $sql->fetchAll(PDO::FETCH_ASSOC);
		// $centro_costo = $this->_db->getConsulta($sql);
		return $centro_costo;
	}


	public function getHtmlSelect($name, $id, $id_cliente)
	{
		if ($name) {
			$query = $this->_db3->prepare('SELECT * FROM cmx_centro_costo ccc
					WHERE ccc.estado = 1 AND ccc.id_cliente = ' . $id_cliente . '');
			$query->execute();
			$array = $query->fetchAll(PDO::FETCH_ASSOC);

			// $array = $this->_db->getConsulta($query);

			// Se recorre contenido de la consulta
			if ($array) {
				$select = '<select class="select2 select2-hidden-accessible" name="' . $name . '" id="slct_centro_costo_' . $id . '" aria-hidden="true">';
				$select .= '<option value="" selected disabled>Seleccione</option>';

				foreach ($array as $key => $value) {
					if ($value['id'] == $id) {
						$select .= '<option value="' . $value['id'] . '" selected="">' . $value["nombre"] . '</option>';
					} else {
						$select .= '<option value="' . $value['id'] . '">' . $value["nombre"] . '</option>';
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
