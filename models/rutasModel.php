<?php
class rutasModel extends Model
{

	public function __construct()
	{
		parent::__construct();
	}

	/********** CONSULTAS PARA EL MÓDULO DE PUNTOS DE CONTROL **********/
	public function getPuntosControl()
	{
		$sql = $this->_db3->prepare('SELECT cpc.*
				FROM cmx_puntos_control cpc
				ORDER BY cpc.nombre');
		$sql->execute();
		$result = $sql->fetchAll(PDO::FETCH_ASSOC);
		// $result = $this->_db->getConsulta($sql);
		return $result;
	}

	public function getEnumSlctTipoPunto($name, $id, $value_select)
	{
		$sql = "
				SHOW COLUMNS FROM 
					cmx_puntos_control 
				LIKE 'tipo_punto' 
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
				<select class="form-control" name="' . $name . '" id="slct_' . $name . '_' . $id . '">
			';
		foreach ($arrayTipoActividad as $key => $value) {
			$select .= '<option value="' . $value . '">' . $value . '</option>';
		}
		$select .= '</select>';

		return $select;
	}

	public function getBuscaPuntoControl($id)
	{
		$sql = $this->_db3->prepare('SELECT cpc.* FROM cmx_puntos_control cpc WHERE cpc.id = ' . $id . '');
		$sql->execute();
		$result = $sql->fetch(PDO::FETCH_ASSOC);
		// $result = $this->_db->getConsulta($sql);
		return $result;
	}
	/********** FIN CONSULTAS PARA EL MÓDULO DE PUNTOS DE CONTROL **********/

	/********** CONSULTAS PARA EL MÓDULO DE MAPAS DE RUTA **********/
	public function getRutas()
	{
		$sql = '
				SELECT 
					cmr.*,
					CONCAT(cmo.municipio ," (",cmo.depto, ")") ORIGEN,
					CONCAT(cmd.municipio ," (",cmd.depto, ")") DESTINO,
					(
						SELECT 
							COUNT(cmrc.id)
						FROM 
							cmx_mapas_ruta_control cmrc
						WHERE 
							cmrc.id_mapa_ruta = cmr.id
					) CUANTOS
				FROM 
					cmx_mapas_ruta cmr
					INNER JOIN cmx_municipios cmo ON cmo.id = cmr.origen
					INNER JOIN cmx_municipios cmd ON cmd.id = cmr.destino
				ORDER BY cmr.nombre
			';
		$result = $this->_db->getConsulta($sql);
		return $result;
	}
	/********** FIN CONSULTAS PARA EL MÓDULO DE MAPAS DE RUTA **********/


	/********** CONSULTAS PARA EL MÓDULO DE CONTROL DE MAPAS DE RUTA **********/
	public function getFilteredTabla($id)
	{
		$sql = '
				SELECT 
					cmr.*,
					CONCAT(cm_origen.municipio , " (" , cm_origen.depto , ")" ) ORIGEN,
					CONCAT(cm_destino.municipio , " (" , cm_destino.depto , ")" ) DESTINO,
					SUM(cmrc.tiempo_estimado) TIEMPO_ESTIMADO
				FROM 
					cmx_mapas_ruta cmr 
					INNER JOIN cmx_mapas_ruta_control cmrc ON cmrc.id_mapa_ruta = cmr.id
					INNER JOIN cmx_municipios cm_origen ON cm_origen.id = cmr.origen
					INNER JOIN cmx_municipios cm_destino ON cm_destino.id = cmr.destino
				WHERE 
					cmr.id = ' . $id . '
					AND cmr.estado != 0;
			';
		$result["ruta"] = $this->_db->getConsulta($sql);


		$sql = '
				SELECT 
					cmrc.*,
					cpc.*,
					CONCAT(cm_origen.municipio , " (" , cm_origen.depto , ")" ) ORIGEN,
					CONCAT(cm_destino.municipio , " (" , cm_destino.depto , ")" ) DESTINO,
					cmr.nombre NOMBRE_RUTA, cmr.estado ESTADO_MAPA_RUTA
				FROM 
					cmx_mapas_ruta cmr 
					INNER JOIN cmx_mapas_ruta_control cmrc ON cmrc.id_mapa_ruta = cmr.id
					INNER JOIN cmx_puntos_control cpc ON cpc.id = cmrc.id_punto_control
					INNER JOIN cmx_municipios cm_origen ON cm_origen.id = cmr.origen
					INNER JOIN cmx_municipios cm_destino ON cm_destino.id = cmr.destino
				WHERE 
					cmr.id = ' . $id . '
					AND cmr.estado != 0
				ORDER BY cmrc.orden; 
			';
		$result["puntos_control"] = $this->_db->getConsulta($sql);
		return $result;
	}

	public function getActividadesPrevias($id, $orden)
	{
		$sql = "
				SELECT 
					(	
						SELECT 
							cpc1.nombre
						FROM
							cmx_mapas_ruta_control cmrc1
							INNER JOIN cmx_puntos_control cpc1 ON cpc1.id = cmrc1.id_punto_control
						WHERE 
							cmrc1.orden IN (cmrc.control_previo)
							AND cmrc1.id_mapa_ruta = cmr.id
							AND cmrc1.estado != 0 
						GROUP BY cpc1.nombre
					) CONTROL_PREVIO
				FROM
					cmx_mapas_ruta_control cmrc
					INNER JOIN cmx_mapas_ruta cmr ON cmr.id = cmrc.id_mapa_ruta
				WHERE 
					cmr.id = '" . $id . "'
					AND cmrc.orden = '" . $orden . "'
					AND cmrc.estado != 0
					AND cmr.estado = 1
			";
		$actividadesPrevias = $this->_db->getConsulta($sql);
		return $actividadesPrevias;
	}

	// SELECT MULTIPLE GENERICO DE ACTIVIDADES
	public function getHtmlSelect($name, $id, $orden)
	{
		$filtro_orden = "";
		if ($orden) {
			$filtro_orden = " AND cmrc.orden != " . $orden . " ";
		}
		if ($name) {
			$sql = '
					SELECT 
						cmrc.orden, cpc.nombre,
						cmr.estado
					FROM 
						cmx_mapas_ruta cmr 
						INNER JOIN cmx_mapas_ruta_control cmrc ON cmrc.id_mapa_ruta = cmr.id
						INNER JOIN cmx_puntos_control cpc ON cpc.id = cmrc.id_punto_control
					WHERE 
						cmr.id = "' . $id . '"
						AND cmr.estado != 0
						' . $filtro_orden .  '
					GROUP BY cmrc.orden;
				';
			// echo "<p>" . $sql . "</p>";
			$array = $this->_db->getConsulta($sql);
			// print_r("<pre>");
			// print_r($array);
			// print_r("</pre>");

			$sql = '
					SELECT 
						COUNT(cmrc.id) ACTIVOS
					FROM 
						cmx_mapas_ruta_control cmrc
						INNER JOIN cmx_mapas_ruta cmr ON cmr.id = cmrc.id_mapa_ruta
					WHERE 
						cmr.id = "' . $id . '"
						AND cmrc.estado != 0
						AND cmr.estado != 0
				;';
			// echo "<p>" . $sql . "</p>";
			$arrayCantidad = $this->_db->getConsulta($sql);
			// print_r("<pre>");
			// print_r($arrayCantidad);
			// print_r("</pre>");

			// Se recorre contenido de la consulta
			if ($array) {
				// print_r("<pre>");
				// print_r($array);
				// print_r("</pre>");
				$select = '
						<select class="form-control" name="' . $name . '" id="slct_punto_control_' . $id . $orden . '" aria-hidden="true">
					';
				$select .= '<option value="nada" readonly>seleccione</option>';
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
				$select = "<p>Aún no se han creado puntos de control en esta ruta...</p>";
			}
		} else {
			$select = "<p class='text-danger'>Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función.</p>";
		}

		return $select;
	}

	public function getHtmlSelectPuntosDeControl($name, $id, $not_in)
	{
		if ($name) {
			$sql = '
					SELECT 
						cpc.id, cpc.tipo_punto, cpc.nombre, cpc.ubicacion
					FROM 
						cmx_puntos_control cpc
					WHERE 
						cpc.id NOT IN (' . $not_in . '0)
					ORDER BY cpc.nombre;
				';
			// echo "<p>" . $sql . "</p>";
			$array = $this->_db->getConsulta($sql);
			// print_r("<pre>");
			// print_r($array);
			// print_r("</pre>");

			// Se recorre contenido de la consulta
			if ($array) {
				$select = '
						<select class="form-control" name="' . $name . '" id="slct_nuevo_punto_control_' . $id . '" aria-hidden="true">
					';
				$select .= '<option value="" readonly>seleccione</option>';
				foreach ($array['rowsData'] as $key => $value) {
					$select .= '<option value="' . $value["id"] . '">' . $value["nombre"] . ' (' . $value["ubicacion"] . ') - [' . $value["tipo_punto"] . ']</option>';
				}
				$select .= '</select>';
			} else {
				$select = '<p class="text-danger">No hay datos en esta tabla...</p>';
			}
		} else {
			$select = '<p class="text-danger">Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función</p>';
		}

		return $select;
	}

	/********** FIN CONSULTAS PARA EL MÓDULO DE CONTROL DE MAPAS DE RUTA **********/
}
