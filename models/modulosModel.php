<?php
	class modulosModel extends Model
	{
		
		public function __construct(){
			parent::__construct();
		}

		/***** FUNCIONES DEL MODULO DE MODULOS *****/
		// Función para tomar los datos de la tabla 
		public function getTabla(){
			$sql = 'SELECT * FROM cmx_modulos';
			$result = $this->_db->getConsulta($sql);
			return $result;
		}

		// Funcion para tomar los datos de un registro
		public function getDatos( $id ){
			$sql = '
				SELECT * 
				FROM cmx_modulos
				WHERE id = ' . $id . ';
			';
			$result = $this->_db->getConsulta($sql);
			return $result;
		}

		// Función para crear un módulo por id 
		public function setModulo($array){
			$result = $this->_db->setRegistro("cmx_modulos", $array);
			return $result;
		}

		// Función para actualizar los registros de un módulo 
		public function updateModulo($array, $id){
			$result = $this->_db->updateRegistro("cmx_modulos", $array, (int)$id);
			return $result;
		}

		public function getHtmlSelect($name,$id){
			if ($name) {
				$query = '
					SELECT * 
					FROM cmx_modulos cmo
					WHERE cmo.estado = 1
					ORDER BY cmo.nombre
				';
				$array = $this->_db->getConsulta($query);

				// Se recorre contenido de la consulta
				if ($array) {
					// print_r($array);
					$select = '
						<select class="select2 select2-hidden-accessible" name="' . $name . '" id="slct_modulo_'. $id . '" aria-hidden="true">
					';
					$select.= '<option value="" selected disabled>Seleccione</option>';

					foreach ($array['rowsData'] as $key => $value) {
						if ($value[0] == $id) {
							$select.= '<option value="' . $value[0] . '" selected="">' . $value["nombre"] . '</option>';
						}else{
							$select.= '<option value="' . $value[0] . '">' . $value["nombre"] . '</option>';
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

		/***** FUNCIONES DEL MODULO DE MENÚ *****/
		public function getMenu(){
			$sql = '
				SELECT *,
					(	SELECT COUNT(cs1.id)
						FROM cmx_submenu cs1
						WHERE cs1.id_menu = cm.id
					) CUANTOS
				FROM cmx_menu cm
				ORDER BY cm.orden
			';
			$result = $this->_db->getConsulta($sql);
			return $result;
		}

		public function setMenu($array){
			$id = $this->_db->setRegistro("cmx_menu", $array);

			$array = Array();
			$array["orden"] = $id;
			$result = $this->_db->updateRegistro("cmx_menu", $array, (int)$id);
		}

		public function updateMenu($array, $id){
			$result = $this->_db->updateRegistro("cmx_menu", $array, (int)$id);
			return $result;
		}

		/***** FUNCIONES DEL MODULO DE SUBMENÚ *****/
		public function getSubmenu($id){
			$sql = '
				SELECT *
				FROM cmx_submenu cs
				WHERE cs.id_menu = ' . $id . '
				ORDER BY cs.orden
			';
			$result = $this->_db->getConsulta($sql);
			$return["general"] = $result["rowsData"];

			if ($result) {
				foreach ($result["rowsData"] as $key => $value) {
					// Se busca si el submenú pertenece a la línea de negocio 
					$sql = '
						SELECT *,
							(	SELECT COUNT(cms1.id_submenu)
								FROM cmx_modulos_submenu cms1
								WHERE cms1.id_modulo = cm.id
									AND cms1.id_submenu = ' . $value[0] . '
							) CUANTOS
						FROM cmx_modulos cm
						WHERE cm.estado = "Activo"
					';
					$result = $this->_db->getConsulta($sql);
					$return["lineas_negocio"][$value[0]] = $result["rowsData"];
				}

				// Se buscan los menú a los que no pertenece el submenu
				$sql = '
					SELECT *,
					(	SELECT COUNT(cs1.id) + 1
						FROM cmx_submenu cs1
						WHERE cs1.id_menu = cm.id
					) CUANTOS
					FROM cmx_menu cm
					WHERE cm.estado = 1
						AND cm.id != ' . $id . '
					ORDER BY cm.orden
				';
				$result = $this->_db->getConsulta($sql);
				$return["menus"] = $result["rowsData"];
			}
			return $return;
		}

		public function setSubmenu($array){
			$result = $this->_db->setRegistro("cmx_submenu", $array);
		}

		public function updateSubmenu($array, $id){
			$result = $this->_db->updateRegistro("cmx_submenu", $array, (int)$id);
			return $result;
		}

		public function ejecuteSubmenu($sql){
			$result = $this->_db->ejecuteRegistro($sql);
			return $result;
		}

		public function asignaModulo($array, $id_submenu, $id_usuario){
			$_time = date('Y-m-d H:i:s', time());
			$sql = '
				DELETE FROM cmx_modulos_submenu
				WHERE id_submenu = ' . $id_submenu . '
			';
			$this->_db->ejecuteRegistro($sql);

			foreach ($array as $key => $value) {
				$array = Array();
				$array["id_submenu"] = $id_submenu;
				$array["id_modulo"] = $value["id_modulo"];
				$array["fecha_hora"] = $_time;
				$array["usuario_auditor"] = $id_usuario;
				$result = $this->_db->setRegistro("cmx_modulos_submenu", $array);
			}
		}

	}
?>