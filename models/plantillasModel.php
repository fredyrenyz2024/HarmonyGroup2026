<?php
class plantillasModel extends Model
{

	public function __construct()
	{
		parent::__construct();
	}

	public function getPlantillas()
	{
		$plantilla = $this->_db->getConsulta("SELECT * FROM cmx_plantillas");
		return $plantilla;
	}

	public function getTabla($id_cliente)
	{
		$sql = $this->_db3->prepare('SELECT * 
				FROM cmx_plantillas
				WHERE id_cliente = ' . $id_cliente . '
				ORDER BY estado DESC');
		$sql->execute();
		$plantilla = $sql->fetchAll(PDO::FETCH_ASSOC);
		// $plantilla = $this->_db->getConsulta($sql);
		// print_r($plantilla);
		return $plantilla;
	}

	public function getCantidadActividades($id)
	{
		$sql = $this->_db3->prepare('SELECT COUNT(cap.id) AS cantidad_actividades FROM cmx_plantillas cp 
					INNER JOIN cmx_actividades_plantilla cap ON cap.id_plantilla = cp.id
					WHERE cap.id_plantilla =:id');
		$sql->bindParam(':id', $id, PDO::PARAM_INT);
		$sql->execute();
		$plantilla = $sql->fetch(PDO::FETCH_ASSOC);
		// $plantilla = $this->_db->getConsulta($sql);
		return $plantilla;
	}

	public function getDatos($id)
	{
		$sql = '
				SELECT * 
				FROM 
					cmx_plantillas
				WHERE 
					id = ' . $id . ';
			';
		$plantilla = $this->_db->getConsulta($sql);
		return $plantilla;
	}

	public function getHtmlSelect($name, $id, $orden)
	{

		if ($name) {
			$query = '
					SELECT * 
					FROM cmx_plantillas cpl
					WHERE cpl.estado = 1
				';

			// echo $query;
			$array = $this->_db->getConsulta($query);

			// Se recorre contenido de la consulta
			if ($array) {
				// print_r($array);
				$select = '
						<select class="select2 select2-hidden-accessible" name="' . $name . '" id="slct_plantilla_' . $id . '" aria-hidden="true">
					';
				$select .= '<option value="" selected disabled>Seleccione</option>';

				foreach ($array['rowsData'] as $key => $value) {

					if ($value[0] == $id) {
						$select .= '<option value="' . $value[0] . '" selected="">' . $value["nom_plantilla"] . '</option>';
					} else {
						$select .= '<option value="' . $value[0] . '">' . $value["nom_plantilla"] . '</option>';
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

	public function getHtmlSelectConActividades($name, $id, $id_cliente)
	{

		if ($name) {

			$query = '
					SELECT 
						cpl.* 
					FROM 
						cmx_plantillas cpl
						INNER JOIN cmx_actividades_plantilla cap ON cpl.id = cap.id_plantilla
					WHERE 
						cpl.estado = 1
						AND cap.estado = 1
						AND cpl.id_cliente IN (1 , ' . $id_cliente . ')
					GROUP BY cpl.id
				';

			// echo $query;
			// $array = $this->_db->getConsulta($query);
			$array = $this->_db3->prepare($query);
			$array->execute();
			$array = $array->fetchAll(PDO::FETCH_ASSOC);

			// Se recorre contenido de la consulta
			if ($array) {
				// print_r($array);
				$select = '
						<select class="select2 select2-hidden-accessible" name="' . $name . '" id="slct_plantilla_' . $id . '" aria-hidden="true">
					';
				$select .= '<option value="" selected disabled>Seleccione</option>';

				foreach ($array as $key => $value) {

					if ($value['id'] == $id) {
						$select .= '<option value="' . $value['id'] . '" selected="">' . $value["nom_plantilla"] . '</option>';
					} else {
						$select .= '<option value="' . $value['id'] . '">' . $value["nom_plantilla"] . '</option>';
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

	public function getEnumSlctTipoOperacion($name, $id, $value_select)
	{
		$sql = "
                SHOW COLUMNS FROM 
                    cmx_plantillas 
                LIKE 'tipo_proyecto' 
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
                <select class="select2 select2-hidden-accessible" name="' . $name . '" id="slct_tipo_proyecto_' . $id . '" aria-hidden="true">
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
