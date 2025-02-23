<?php
	class informes_operacionesModel extends Model
	{

		public function __construct(){
			parent::__construct();
		}

		public function informes(){
			$sql="SELECT * FROM cmx_tipo_estudio";

			$result = $this->_db->getConsulta($sql);
			return $result;
		}
			




	}




?>