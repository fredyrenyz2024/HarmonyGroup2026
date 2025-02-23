<?php
class control_horasModel extends Model{

	public function __construct(){
			parent::__construct();
		}

		public function gethoras(){
			$return = $this->_db->getConsulta("select * from cmx_control_horas");
			return $return;
		}
}
?>