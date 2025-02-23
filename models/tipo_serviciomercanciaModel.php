<?php
	class tipo_serviciomercanciaModel extends Model
	{
	
		public function __construct(){
			parent::__construct();
		}

		public function getTabla(){
			$sql = '
				SELECT * FROM  cmx_para_tipo_sevicio

			';
			$result = $this->_db->getConsulta($sql);//viene de confinguraciones funciones establecidas por defecto para consultas, eliminar, registrar... (getconsuktas SOLO para consultar algo)
			return $result;
			}

		}

?>