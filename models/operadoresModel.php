<?php
class operadoresModel extends Model
{

	public function __construct()
	{
		parent::__construct();
	}

	public function getTabla($id_cliente)
	{
		$sql = '
				SELECT 
					cpa.*
				FROM 
					cmx_operadores cpa
				WHERE 
					id_cliente = ' . $id_cliente . '
			';
		// $operador = $this->_db->getConsulta($sql);
		$operador = $this->_db3->prepare($sql);
		$operador->execute();
		return $operador->fetchAll(PDO::FETCH_ASSOC);
		// return $operador;
	}

	public function getOperadores()
	{
		// $operador = $this->_db->getConsulta("SELECT * FROM cmx_operadores");
		$operador = $this->_db3->prepare("SELECT * FROM cmx_operadores");
		$operador->execute();
		return $operador->fetchAll(PDO::FETCH_ASSOC);
		// return $operador;
	}

	public function getOperador($id_operador)
	{
		$sql = '
				SELECT 
					* 
				FROM 
					cmx_operadores
				WHERE 
					id = ' . $id_operador . ';
			';
		// $operador = $this->_db->getConsulta($sql);
		$operador = $this->_db3->prepare($sql);
		$operador->execute();
		return $operador->fetch(PDO::FETCH_ASSOC);
		// return $operador
	}
}
