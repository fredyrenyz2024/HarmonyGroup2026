<?php
class preestudio_nacionalModel extends Model
{

    public function __construct()
    {
        parent::__construct();
    }

    public function getTabla_principal()
    {
        $sql = '
				SELECT * FROM cmx_tipo_estudio
			';
        $result = $this->_db->getConsulta($sql); //viene de confinguraciones funciones establecidas por defecto para consultas, eliminar, registrar... (getconsuktas SOLO para consultar algo)
        return $result;
    }

    public function tabla_solicitud_dia()
    {
        $sql = '
				SELECT * FROM cmx_tipo_estudio
			';
        $result = $this->_db->getConsulta($sql);
        return $result;

    }

    public function num_consecutivo()
    {
        $sql = 'SELECT MAX(codigo)+1 AS nco
			FROM cmx_vehiculos_preestudio;					';
        $result = $this->_db->getConsulta($sql);
        return $result;
    }

    public function consecutivo_solicitud()
    {
        $sql = 'SELECT MAX(consecutivo_solicitud)+1 AS nco
			FROM cmx_solicitudes_preestudio;';
        $result = $this->_db->getConsulta($sql);
        return $result;
    }

    public function getsolicitudes()
    {
        $sql = "
				SELECT sol.*, es.estado AS elesta ,
				CONCAT(C1.municipio,'-',C1.depto) AS ori,
				CONCAT(C2.municipio,'-',C2.depto) AS des,
				m.n_cotizacion, m.item, m.tipo_mercancia
				FROM cmx_solicitud_vehiculo2 sol
				LEFT JOIN cmx_log_solicitudvehiculo  es
				ON sol.id=es.id_solictud
				INNER JOIN cmx_municipios C1
				ON sol.origen=C1.rndc_codigo_ciudad
				INNER JOIN cmx_municipios C2
				ON sol.destino=C2.rndc_codigo_ciudad
				INNER JOIN cmx_detalle_mercancia2 m
				ON sol.idpareja_origen_destino=m.id
			";

        $return = $this->_db->getConsulta($sql);
        return $return;
    }

}
