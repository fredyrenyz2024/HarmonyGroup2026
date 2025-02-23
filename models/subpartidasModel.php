<?php
	class subpartidasModel extends Model
	{
		
		public function __construct(){
			parent::__construct();
		}

		public function getSubpartidas(){
			$subpartida = $this->_db->getConsulta("select * from cmx_requisitos_comex;");
			return $subpartida;
		}

		public function getTabla(){
			$subpartida = $this->_db->getConsulta("SELECT * FROM cmx_requisitos_comex crc;");
			return $subpartida;
		}

	}
?>