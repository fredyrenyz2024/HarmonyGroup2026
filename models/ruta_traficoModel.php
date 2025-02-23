<?php

	class ruta_traficoModel extends Model
	{

		public function __construct(){
			parent::__construct();
		}

		public function getTabla($id_cliente){
			$sql = '
				SELECT 
					cpa.*
				FROM 
					cmx_operadores cpa
				WHERE 
					id_cliente = ' . $id_cliente . '
			';
			$operador = $this->_db->getConsulta($sql);
			return $operador;
		}




	}



?>