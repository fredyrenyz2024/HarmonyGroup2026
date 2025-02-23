<?php
class servicios_operadorModel extends Model
{

	public function __construct()
	{
		parent::__construct();
	}

	public function getTabla($id_operador)
	{
		$sql = '
				SELECT 
					cso.*, 
					co.nombre_proveedor,
					cum.nom_unidad_medida,
					ccc.nom_servicios_especial,
					cm.codigo,
					cm1.municipio MUNICIPIO_ORIGEN, cm1.depto DEPTO_ORIGEN, cm1.pais PAIS_ORIGEN,
					cm2.municipio MUNICIPIO_DESTINO, cm2.depto DEPTO_DESTINO, cm2.pais PAIS_DESTINO
				FROM 
					cmx_servicios_operador cso
					INNER JOIN cmx_operadores co ON co.id = cso.id_operador
					INNER JOIN cmx_unidades_medida cum ON cum.id = cso.id_unidad_medida
					INNER JOIN cmx_contabilidad_conceptos ccc ON ccc.id = cso.id_servicio_especial
					INNER JOIN cmx_municipios cm1 ON cm1.id = cso.origen
					INNER JOIN cmx_municipios cm2 ON cm2.id = cso.destino
					INNER JOIN cmx_monedas cm ON cm.id = cso.id_moneda
				WHERE 
					id_operador = ' . $id_operador . ';
			';
		// $servicios_operador = $this->_db->getConsulta($sql);
		$servicios_operador = $this->_db3->prepare($sql);
		$servicios_operador->execute();
		$servicios_operador = $servicios_operador->fetchAll(PDO::FETCH_ASSOC);
		return $servicios_operador;
	}

	public function getHtmlSelect($name, $id)
	{

		if ($name) {

			$query = 'SELECT * FROM cmx_servicios_operador cmu';

			// echo $query;
			// $array = $this->_db->getConsulta($query);
			$array = $this->_db3->prepare($query);
			$array->execute();
			$array = $array->fetchAll(PDO::FETCH_ASSOC);

			// Se recorre contenido de la consulta
			if ($array) {
				// print_r($array);
				$select = '
						<select class="select2 select2-hidden-accessible" name="' . $name . '" id="slct_servicios_operador_' . $id . '" aria-hidden="true">
					';
				$select .= '<option value="" selected disabled>Seleccione</option>';

				foreach ($array as $key => $value) {

					if ($value['id'] == $id) {
						$select .= '<option value="' . $value['id'] . '" selected="">' . $value['id_operador'] . '</option>';
					} else {
						$select .= '<option value="' . $value['id'] . '">' . $value['id_operador'] . '</option>';
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
