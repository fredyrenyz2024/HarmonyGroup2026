<?php
class pruebaModel extends Model
{

	public function __construct()
	{
		parent::__construct();
	}

	public function getPruebas()
	{
		$sql = '
				SELECT cf.*,
					cmo.municipio MUNICIPIO_ORIGEN, cmo.depto DEPTO_ORIGEN, cmo.pais PAIS_ORIGEN,
					cmd.municipio MUNICIPIO_DESTINO, cmd.depto DEPTO_DESTINO, cmd.pais PAIS_DESTINO,
                    ctv.nom_tipo_vehiculo
				FROM cmx_fletes cf
					INNER JOIN cmx_municipios cmo ON cmo.id = cf.id_ciudad_origen
					INNER JOIN cmx_municipios cmd ON cmd.id = cf.id_ciudad_destino
                    INNER JOIN cmx_tipo_vehiculo ctv ON ctv.id = cf.id_tipo_vehiculo
			';

		$result = $this->_db->getConsulta($sql); //viene de confinguraciones funciones establecidas por defecto para consultas, eliminar, registrar... (getconsuktas SOLO para consultar algo)
		return $result;
	}

	public function elipruebas()
	{
		$table = 'cmx_fletes';

		//$sql='UPDATE cmx_fletes set estado=0 WHERE id= and estado=0';

		$result = $this->_db->updateRegistro($table, $array, $id); //viene de confinguraciones funciones establecidas por defecto para consultas, eliminar, registrar... (getconsuktas SOLO para consultar algo)
		return $result;
	}
}
