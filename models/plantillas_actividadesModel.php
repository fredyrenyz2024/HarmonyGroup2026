<?php
class plantillas_actividadesModel extends Model
{

	public function __construct()
	{
		parent::__construct();
	}

	public function getPlantillas_actividades()
	{
		$plantilla = $this->_db->getConsulta("SELECT * FROM cmx_actividades_plantilla");
		return $plantilla;
	}

	public function getTabla()
	{
		$plantilla = $this->_db->getConsulta("SELECT * FROM cmx_actividades_plantilla");
		return $plantilla;
	}

	public function getFilteredTabla($id)
	{
		$sql = $this->_db3->prepare('SELECT cap.*, cpl.nom_plantilla,cmo.nom_moneda, cmo.codigo
				FROM cmx_actividades_plantilla cap
					INNER JOIN cmx_plantillas cpl ON cpl.id = cap.id_plantilla
					INNER JOIN cmx_monedas cmo ON cmo.id = cap.moneda
				WHERE cap.estado != 0 AND cap.id_plantilla = ' . $id . ' ORDER BY cap.orden');
		$sql->execute();
		$plantilla = $sql->fetchAll(PDO::FETCH_ASSOC);
		// $plantilla = $this->_db->getConsulta($sql);
		return $plantilla;
	}

	public function getMaxBloque($id)
	{
		$sql = $this->_db3->prepare('SELECT MAX(cap.bloque) MAXIMO FROM cmx_actividades_plantilla cap WHERE cap.id_plantilla = ' . $id . '');
		$sql->execute();
		$plantilla = $sql->fetch(PDO::FETCH_ASSOC);
		// $plantilla = $this->_db->getConsulta($sql);
		return $plantilla;
	}


	public function getActividadesPrevias($id, $orden)
	{
		$sql = "
				SELECT 
					(	
						SELECT 
							cap1.nombre
						FROM
							cmx_actividades_plantilla cap1
						WHERE 
							cap1.orden IN (cap.actividad_previa)
							AND cap1.id_plantilla = cpl.id
							AND cap1.estado != 0 
						GROUP BY cap.nombre
					) ACTIVIDAD_PREVIA
				FROM
					cmx_actividades_plantilla cap
					INNER JOIN cmx_plantillas cpl ON cpl.id = cap.id_plantilla
				WHERE 
					cpl.id = '" . $id . "'
					AND cap.orden = '" . $orden . "'
					AND cap.estado != 0
				GROUP BY cap.nombre;
			";
		$actividadesPrevias = $this->_db->getConsulta($sql);
		return $actividadesPrevias;
	}

	public function getHtmlSelect($name, $id)
	{

		if ($name) {

			$query = 'SELECT * FROM cmx_actividades_plantilla';

			$array = $this->_db->getConsulta($query);

			// Se recorre contenido de la consulta
			if ($array) {
				// print_r($array);
				$select = '
						<select class="select2 select2-hidden-accessible" name="' . $name . '" id="slct_proveedor_actividad_' . $id . '" aria-hidden="true">
					';
				$select .= '<option value="0" selected disabled>Seleccione</option>';
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

	// SELECT MULTIPLE GENERICO DE ACTIVIDADES
	public function getHtmlSelectMultiple($name, $id, $orden, $bloque)
	{
		$filtro_orden = "";
		if ($orden) {
			$filtro_orden = " AND cac.orden != " . $orden . " ";
		}
		if ($name) {
			$sql = '
					SELECT 
						cac.orden, cac.nombre,
						cac.estado 
					FROM 
						cmx_actividades_plantilla cac
						INNER JOIN cmx_plantillas coc ON coc.id = cac.id_plantilla
					WHERE 
						coc.id = "' . $id . '"
						AND cac.estado != 0
						AND cac.bloque IN (0,' . $bloque . ')
						' . $filtro_orden .  '
					GROUP BY cac.orden;
				';
			// echo "<p>" . $sql . "</p>";
			$array = $this->_db->getConsulta($sql);

			$sql = '
					SELECT 
						COUNT(cac.id) ACTIVOS
					FROM 
						cmx_actividades_plantilla cac
						INNER JOIN cmx_plantillas coc ON coc.id = cac.id_plantilla
					WHERE 
						cac.estado != 0
						AND coc.id = "' . $id . '";
				';
			// echo "<p>" . $sql . "</p>";
			$arrayCantidad = $this->_db->getConsulta($sql);

			// Se recorre contenido de la consulta
			if ($array) {
				// print_r("<pre>");
				// print_r($array);
				// print_r("</pre>");
				$select = '
						<select class="tags" multiple="multiple" name="' . $name . '" id="slct_actividades_plantilla_' . $id . $orden . '" aria-hidden="true">
					';
				$select .= '<option value="" readonly>seleccione</option>';
				$option_primer_actividad = '';

				if ($arrayCantidad['rowsData'][0]['ACTIVOS'] > 0) {
					$option_primer_actividad = '<option value="0">Primer Actividad</option>';
				}
				foreach ($array['rowsData'] as $key => $value) {

					if ($value["orden"] == 1) {
						$select .= $option_primer_actividad;
					}
					if ($orden == $value["orden"]) {
						$select .= '<option value="' . $value["orden"] . '" selected="">(' . $value["orden"] . ') - ' . $value["nombre"] . '</option>';
					} else {
						$select .= '<option value="' . $value["orden"] . '">(' . $value["orden"] . ') - ' . $value["nombre"] . '</option>';
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

	public function getEnumSlctTipoActividad($name, $id, $value_select)
	{
		$sql = "
				SHOW COLUMNS FROM 
					cmx_actividades_plantilla 
				LIKE 'tipo_actividad' 
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
				<select class="select2 select2-hidden-accessible" name="' . $name . '" id="slct_tipo_actividad_' . $id . '" aria-hidden="true">
			';
		$select .= '<option value="0" selected>Seleccione</option>';
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

	public function getEnumSlctIntegracion($name, $id, $value_select)
	{
		$sql = "
				SHOW COLUMNS FROM 
					cmx_actividades_plantilla 
				LIKE 'integracion' 
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
				<select class="select2 select2-hidden-accessible" name="' . $name . '" id="slct_integracion_' . $id . '" aria-hidden="true">
			';
		$select .= '<option value="" selected>Seleccione</option>';
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

	public function getEnumSlctSimultaneo($name, $id, $value_select)
	{
		$sql = "
				SHOW COLUMNS FROM 
					cmx_actividades_plantilla 
				LIKE 'simultaneo' 
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
				<select class="select2 select2-hidden-accessible" name="' . $name . '" id="slct_simultaneo_' . $id . '" aria-hidden="true">
			';
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
