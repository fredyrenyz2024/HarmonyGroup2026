<?php
	class tarifasModel extends Model
	{
		
		public function __construct(){
			parent::__construct();
		}

		public function getTarifas(){
			$tarifa = $this->_db->getConsulta("select * from cmx_tarifas");
			return $tarifa;
		}

		public function getTabla(){
			$tarifa = $this->_db->getConsulta("
			SELECT
				cta.id,
				ccl.nombre,
				cmu1.id id_origen,cmu1.municipio municipio_origen,cmu1.depto depto_origen,cmu1.pais pais_origen,
				cmu2.id id_destino,cmu2.municipio municipio_destino,cmu2.depto depto_destino,cmu2.pais pais_destino,
				ctv.id,ctv.nom_tipo_vehiculo,
				cta.valor,cta.vigencia,cta.estado
			FROM
				cmx_tarifas cta
				INNER JOIN cmx_clientes ccl ON cta.id_cliente = ccl.id
				INNER JOIN cmx_municipios cmu1 ON cta.id_ciudad_origen = cmu1.id
				INNER JOIN cmx_municipios cmu2 ON cta.id_ciudad_destino = cmu2.id
				INNER JOIN cmx_tipo_vehiculo ctv ON cta.id_tipo_vehiculo = ctv.id
			WHERE 
				ccl.id != '1';
			");
			return $tarifa;
		}

	}
?>