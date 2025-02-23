<?php
class operacionesModel extends Model
{

	public function __construct(){
			parent::__construct();
	}

	public function getPruebas(){
		$sql="";
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	public function getEstudios($fecha,$fechaf){

		$sql="SELECT soli.placa, ev.estado
		FROM cmx_log_solicitudvehiculo2  soli
		LEFT JOIN cmx_estudio_vehiculo es
		ON soli.id=es.id_solicitud
		LEFT JOIN cmx_estudiov_completo ev
		ON es.id=ev.id_estudio AND ev.estado_actu=1 
		AND ev.estado='Aprobado'
		LEFT JOIN cmx_logestudio_com lg
		ON ev.id=lg.id_completo 
		WHERE lg.fecha BETWEEN '2021-04-12' AND '2021-04-12';";

		$return = $this->_db->getConsulta($sql);
		return $return;
	}

	public function getProveedores($tipo,$numero,$nombre){
		$tipo=$tipo;
		if($tipo=='1'){//nombre
			$name=$nombre;
			$sql='SELECT 
					cp.*
					FROM 
						cmx_proveedores cp
						INNER JOIN cmx_municipios cm ON cp.id_municipio = cm.id
					 WHERE cp.nombre like "%'.$name.'%"';
			$return = $this->_db->getConsulta($sql);
			return $return;	
		}

		if($tipo=='2'){//documento
			$docu=$numero;

			$sql='
				SELECT 
					cp.*
					FROM 
						cmx_proveedores cp
						INNER JOIN cmx_municipios cm ON cp.id_municipio = cm.id
						WHERE cp.numero_documento='.$docu.'
				ORDER BY cp.id DESC
			';			
					
			$return = $this->_db->getConsulta($sql);
			return $return;	
		}	
	}

	



}
?>