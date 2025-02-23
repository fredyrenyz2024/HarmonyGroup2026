<?php
	class tipo_mercanciaModel extends Model
	{
	
		public function __construct(){
			parent::__construct();
		}

		public function getTabla(){
			$sql = '
				SELECT * FROM cmx_para_tipo_mercancia
				ORDER BY nombre asc
			';
			$result = $this->_db->getConsulta($sql);//viene de confinguraciones funciones establecidas por defecto para consultas, eliminar, registrar... (getconsuktas SOLO para consultar algo)
			return $result;
			}

		public function Productos_Ministerio(){
			/*$sql="SELECT b.descripcion, a.codigo AS id_rndc,
			a.capitulo, a.tipo, a.partida, b.naturaleza,
			a.id, b.id as cod_capitulo
			FROM cmx_rndc_codificacion_producto a
			INNER JOIN cmx_rndc_mercancia b
			ON  a.tipo=b.naturaleza
			ORDER BY b.descripcion, a.codigo ASC LIMIT 3600";*/
			$sql="SELECT 
				a.partida as descripcion, 
				a.codigo AS id_rndc, a.capitulo, a.tipo, a.partida, b.naturaleza, a.id, b.id as cod_capitulo
				FROM cmx_rndc_codificacion_producto a
				INNER JOIN cmx_rndc_mercancia b
				ON a.capitulo IN (b.descripcion)
				ORDER BY a.partida ASC
				LIMIT 5000";
			$result = $this->_db->getConsulta($sql);
			return $result;
		}

		}
?>