<?php
	class tipo_estudioModel extends Model
	{
	
		public function __construct(){
			parent::__construct();
		}

		public function getTabla(){
			$sql = '
				SELECT * FROM cmx_tipo_estudio
			';
			$result = $this->_db->getConsulta($sql);//viene de confinguraciones funciones establecidas por defecto para consultas, eliminar, registrar... (getconsuktas SOLO para consultar algo)
			return $result;
			}

		}

?>