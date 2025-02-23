<?php

class planesModel extends Model
{

	public function __construct()
	{
		parent::__construct();
	}

	public function traerruta_modal()
	{
		$sql = 'SELECT * FROM cmx_rutas WHERE estado="habilitado"';
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	public function traer_lugar_origen($origen)
	{
		$origen = $origen;
		$sql = "SELECT municipio,depto FROM cmx_municipios
				WHERE id=" . $origen . " ";
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	public function traer_lugar_destino($destino)
	{
		$destino = $destino;
		$sql = "SELECT municipio,depto FROM cmx_municipios
				WHERE id=" . $destino . " ";
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	//select para elegir la ciudad del punto
	public function n_plan()
	{
		$sql = "SELECT max(cod_plan)+1 AS nco
			 FROM cmx_plan_ruta";
		$result = $this->_db->getConsulta($sql);
		return $result;
	}
}
