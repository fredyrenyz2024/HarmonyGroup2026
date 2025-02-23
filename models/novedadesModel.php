<?php
	class novedadesModel extends Model
	{
	
		public function __construct(){
			parent::__construct();
		}

		public function num_novedad(){
			$sql = '
				SELECT max(codigo_nove)+1 AS nco FROM 
				cmx_novedades2
			';
			$result = $this->_db->getConsulta($sql);//viene de confinguraciones funciones establecidas por defecto para consultas, eliminar, registrar... (getconsuktas SOLO para consultar algo)
			return $result;
			}


	}
?>