<?php
class justificacionesModel extends Model
{

	public function __construct()
	{
		parent::__construct();
	}

	public function getJustificaciones()
	{
		$plantilla = $this->_db->getConsulta("SELECT * FROM cmx_justificaciones");
		return $plantilla;
	}

	public function getTabla()
	{
		// $plantilla = $this->_db->getConsulta("SELECT * FROM cmx_justificaciones");
		// return $plantilla;
		$plantilla = $this->_db3->prepare("SELECT * FROM cmx_justificaciones");
		$plantilla->execute();
		$plantilla = $plantilla->fetchAll(PDO::FETCH_ASSOC);
		return $plantilla;
		// print_r($plantilla);
		// exit(0);
	}

	public function getDatos($id)
	{
		$plantilla = $this->_db->getConsulta("
				SELECT * 
				FROM 
					cmx_justificaciones
				WHERE 
					id = " . $id . ";
			");
		return $plantilla;
	}

	public function getHtmlSelect($name, $id)
	{

		if ($name) {

			$query = '
					SELECT * 
					FROM cmx_justificaciones cj
					WHERE cj.estado = 1
					ORDER BY cj.nombre';
			// $array = $this->_db->getConsulta($query);
			$array = $this->_db3->prepare($query);
			$array->execute();
			$array = $array->fetchAll(PDO::FETCH_ASSOC);

			// Se recorre contenido de la consulta
			if ($array) {
				$select = '<select class="select2 select2-hidden-accessible" name="' . $name . '" id="slct_plantilla_' . $id . '" aria-hidden="true">';
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
