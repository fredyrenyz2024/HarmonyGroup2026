<?php
class fletes_nacionalModel extends Model
{

	public function __construct()
	{
		parent::__construct();
	}

	public function getFletes()
	{
		$flete = $this->_db->getConsulta("select * from cmx_fletes");
		return $flete;
	}

	public function getFleteNacional()
	{
		$sql = "
			SELECT
				ct.id,
				cmu1.id id_origen,cmu1.municipio municipio_origen,cmu1.depto depto_origen,cmu1.pais pais_origen,
				cmu2.id id_destino,cmu2.municipio municipio_destino,cmu2.depto depto_destino,cmu2.pais pais_destino,
				ctv.id,ctv.nombre,
				ct.tarifa,ct.vigencia,ct.estado
			FROM
				cmx_fletes_nacional  ct
				INNER JOIN cmx_municipios cmu1 ON ct.origen = cmu1.rndc_codigo_ciudad
				INNER JOIN cmx_municipios cmu2 ON ct.destino = cmu2.rndc_codigo_ciudad
				INNER JOIN cmx_para_tipo_vehiculo ctv ON ct.tipo_vehiculo = ctv.id;
			";
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetchAll(PDO::FETCH_ASSOC);
		return $result;
	}

	public function getTabla()
	{
		$flete = $this->_db->getConsulta("
			SELECT
				ct.id,
				cmu1.id id_origen,cmu1.municipio municipio_origen,cmu1.depto depto_origen,cmu1.pais pais_origen,
				cmu2.id id_destino,cmu2.municipio municipio_destino,cmu2.depto depto_destino,cmu2.pais pais_destino,
				ctv.id,ctv.nombre,
				ct.tarifa,ct.vigencia,ct.estado
			FROM
				cmx_tarifas ct
				INNER JOIN cmx_municipios cmu1 ON ct.origen = cmu1.id
				INNER JOIN cmx_municipios cmu2 ON ct.destino = cmu2.id
				INNER JOIN cmx_tipo_vehiculos ctv ON ct.tipo_vehiculo = ctv.id;
			");
		return $flete;
	}
}
