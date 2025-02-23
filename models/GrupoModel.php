<?php
	class GrupoModel extends Model
	{

		public function __construct(){
			parent::__construct();
		}


		public function getTabla(){
			$sql = 'SELECT * FROM cmx_clientes';
			$cliente = $this->_db->getConsulta($sql);
			return $cliente;
		}


	}
?>