<?php
	class materiales_clientesModel extends Model
	{
		
		public function __construct(){
			parent::__construct();
		}

		public function getMateriales_clientes(){
			$material_cliente = $this->_db->getConsulta("select * from cmx_materiales_clientes");
			return $material_cliente;
		}

		public function getMaterial($id_material){
			$sql = '
				SELECT 
					*
				FROM 
					cmx_material_cliente
				WHERE 
					id = "' . $id_material . '"

			';
			$material = $this->_db->getConsulta($sql);
			return $material;
		}

		public function getTabla($id_cliente){
			$filtro_materiales = '';
			if ($id_cliente != 1) {
				$filtro_materiales = '
				WHERE
					id_cliente = ' . $id_cliente . '
				';
			}

			$sql = '
				SELECT 
					cmc.*, 
					crm.numero_riesgo, crm.nom_riesgo_material, crm.descripcion DESCRIPCION_RIESGO, crm.url, 
					cc.nombre NOM_CLIENTE,
					cup.nom_unidad_presentacion,
					cum.nom_unidad_medida,
					cue.nom_unidad_empaque
				FROM 
					cmx_material_cliente cmc 
					INNER JOIN cmx_riesgo_material crm ON cmc.riesgo = crm.id 
					INNER JOIN cmx_clientes cc ON cc.id = cmc.id_cliente 
					INNER JOIN cmx_unidades_presentacion cup ON cup.id = cmc.presentacion
					INNER JOIN cmx_unidades_medida cum ON cum.id = cmc.unidad_presentacion
					INNER JOIN cmx_unidad_empaque cue ON cue.id = cmc.tipo_embalaje
					' . $filtro_materiales . '
			';
			// echo "<p>" . $sql . "</p>";
			$flete = $this->_db->getConsulta($sql);
			return $flete;
		}

		public function getHtmlSelect($name,$id){

			if ($name) {
				$query = '
					SELECT 
						cmc.id, cmc.descripcion 
					FROM 
						cmx_material_cliente cmc;
				';

				// echo $query;
				$array = $this->_db->getConsulta($query);

				// Se recorre contenido de la consulta
				if ($array) {
					// print_r($array);
					$select = '
						<select class="select2 select2-hidden-accessible" name="' . $name . '" id="slct_material_cliente_'. $id . '" aria-hidden="true">
					';

					foreach ($array['rowsData'] as $key => $value) {
						if ($value[0] == $id) {
							$select.= '<option value="' . $value[0] . '" selected="">' . $value[1] . '</option>';
						}else{
							$select.= '<option value="' . $value[0] . '">' . $value[1] . '</option>';
						}

					}
					$select.= '</select>';
				} else {
					$select = "No hay datos en esta tabla...";
				}
			} else {
				$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
			}
			
			return $select;
		}

		public function getHtmlSelectRiesgos($name,$id){
			if ($name) {
				$query = '
					SELECT 
						crm.id, crm.nom_riesgo_material, crm.numero_riesgo
					FROM 
						cmx_riesgo_material crm;
				';

				// echo $query;
				$array = $this->_db->getConsulta($query);

				// Se recorre contenido de la consulta
				if ($array) {
					// print_r($array);
					$select = '
						<select class="select2 select2-hidden-accessible" name="' . $name . '" id="slct_material_cliente_'. $id . '" aria-hidden="true">
					';

					foreach ($array['rowsData'] as $key => $value) {
						if ($value[0] == $id) {
							$select.= '<option value="' . $value[0] . '" selected="">(' . $value[2] . ') ' . $value[1] . '</option>';
						}else{
							$select.= '<option value="' . $value[0] . '">(' . $value[2] . ') ' . $value[1] . '</option>';
						}

					}
					$select.= '</select>';
				} else {
					$select = "No hay datos en esta tabla...";
				}
			} else {
				$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
			}
			
			return $select;
		}

		public function buscaRiesgoNumero($num_riesgo){
			$sql = '
				SELECT 
					*
				FROM 
					cmx_riesgo_material
				WHERE
					numero_riesgo = ' . $num_riesgo . ';
			';
			$riesgo = $this->_db->getConsulta($sql);
			return $riesgo;
		}

	}
?>