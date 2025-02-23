<?php

class prefiltro_cotizarModel extends Model
{

	public function __construct()
	{
		parent::__construct();
	}

	public function getcotizaciones()
	{
		$sql = 'SELECT * FROM cmx_cotizaciones_serviciocliente cab
				INNER JOIN cmx_detalle_mercancia2 mer ON cab.n_cotizacion=mer.n_cotizacion
				INNER JOIN cmx_detalle_servespecial2 espe ON mer.n_cotizacion=espe.n_cotizacion
			';
		$result = $this->_db->getConsulta($sql); //viene de confinguraciones funciones establecidas por defecto para consultas, eliminar, registrar... (getconsuktas SOLO para consultar algo)
		return $result;
	}
}
