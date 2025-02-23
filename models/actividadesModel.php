<?php
	class actividadesModel extends Model
	{
		
		public function __construct(){
			parent::__construct();
		}

		public function getActividades(){
			$actividad = $this->_db->getConsulta("SELECT * FROM cmx_actividades");
			return $actividad;
		}

		public function getTabla( $id_plantilla , $id_cliente ){
			$id_cliente = 4; // Quitar cuando se establesca las sesiones de usuarios y se de por sesion el cliente del usuario activo 
			$sql = '
				SELECT 
					cac.*
				FROM 
					cmx_plantillas cpl
					INNER JOIN cmx_actividades_plantilla cap ON cpl.id = cap.id_plantilla
					INNER JOIN cmx_actividades cac ON cac.id = cap.id_actividad
				WHERE
					cpl.estado = 1
					AND cap.estado = 1
					AND cac.estado = 1
					AND cpl.id = ' . $id_plantilla . '
					AND cac.id_cliente IN (1,' . $id_cliente . ');
			';
			$actividad = $this->_db->getConsulta($sql);
			return $actividad;
		}

		public function getHtmlSelect($name,$id){

			if ($name) {

				$query = 'SELECT * FROM cmx_actividades cpl';

				// echo $query;
				$array = $this->_db->getConsulta($query);

				// Se recorre contenido de la consulta
				if ($array) {
					// print_r($array);
					$select = '
						<select class="select2 select2-hidden-accessible" name="' . $name . '" id="slct_actividad_'. $id . '" aria-hidden="true">
					';
					$select.= '<option value="" selected disabled>Seleccione</option>';

					foreach ($array['rowsData'] as $key => $value) {

						if ($value[0] == $id) {
							$select.= '<option value="' . $value[0] . '" selected="">' . $value[2] . '</option>';
						}else{
							$select.= '<option value="' . $value[0] . '">' . $value[2] . '</option>';
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

	}
?>