<?php
	class riesgo_comercializacionModel extends Model
	{
		
		public function __construct(){
			parent::__construct();
		}

		public function getriesgo_comercializacion(){
			$riesgo_comercializacion = $this->_db->getConsulta("SELECT * FROM cmx_riesgo_comercializacion");
			return $riesgo_comercializacion;
		}

		public function getTabla(){
			$riesgo_comercializacion = $this->_db->getConsulta("SELECT * FROM cmx_riesgo_comercializacion");
			return $riesgo_comercializacion;
		}

		public function getHtmlSelect( $name , $id ){

			if ($name) {
				$sql = '
					SELECT * 
					FROM cmx_riesgo_comercializacion cue
					WHERE 
						cue.estado = 1
				';

				// echo $sql;
				$array = $this->_db->getConsulta($sql);

				// Se recorre contenido de la consulta
				if ($array) {
					// print_r($array);
					$select = '
						<select class="select2 select2-hidden-accessible" name="' . $name . '" id="slct_monedas_'. $id . '" aria-hidden="true">
					';
					$select.= '<option value="" selected disabled>Seleccione</option>';

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

		public function getHtmlSelectMultiple($name,$id){

			if ($name) {
				$sql = '
					SELECT * 
					FROM cmx_riesgo_comercializacion cue
					WHERE 
						cue.estado = 1
				';

				// echo $sql;
				$array = $this->_db->getConsulta($sql);

				// Se recorre contenido de la consulta
				if ($array) {
					// print_r($array);
					$select = '
						<select class="tags" multiple="multiple" name="' . $name . '" id="slct_monedas_'. $id . '" aria-hidden="true">
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


	}
?>