<?php
class servicioclienteModel extends Model
{

	public function __construct()
	{
		parent::__construct();
	}

	public $listado;

	public function getPruebas()
	{
		$sql = '
				SELECT * FROM cmx_cotizaciones_serviciocliente cab
				INNER JOIN cmx_detalle_mercancia2 mer
				ON cab.n_cotizacion=mer.n_cotizacion
				INNER JOIN cmx_detalle_servespecial2 espe
				ON mer.n_cotizacion=espe.n_cotizacion
			';
		$result = $this->_db->getConsulta($sql); //viene de confinguraciones funciones establecidas por defecto para consultas, eliminar, registrar... (getconsuktas SOLO para consultar algo)
		return $result;
	}


	public function getPrueba($tipo, $cliente, $fi, $ff)
	{
		//$fi=$fi;
		//$ff=$ff;
		$tipo = $tipo;
		if ($tipo == '1') {
			$cl = $cliente;
			$sql = '
				SELECT * FROM cmx_cotizaciones_serviciocliente coti
				INNER JOIN cmx_detalle_mercancia2 m
				ON coti.n_cotizacion=m.n_cotizacion
				WHERE nit=' . $cl . '
				GROUP BY coti.n_cotizacion
				ORDER BY  coti.id DESC';
			$result = $this->_db->getConsulta($sql);
			return $result;
		}
		if ($tipo == '2') {
			$sql = "SELECT * FROM cmx_cotizaciones_serviciocliente coti
					INNER JOIN cmx_detalle_mercancia2 m ON coti.n_cotizacion=m.n_cotizacion
					WHERE coti.fecha_creacion BETWEEN '" . $fi . "' AND '" . $ff . "'
					GROUP BY coti.n_cotizacion ORDER BY  coti.id DESC";
			$result = $this->_db->getConsulta($sql);
			return $result;
		}

		/*	$sql='
				SELECT * FROM cmx_cotizaciones_serviciocliente coti
				INNER JOIN cmx_detalle_mercancia2 m
				ON coti.n_cotizacion=m.n_cotizacion
			
				GROUP BY coti.n_cotizacion
				ORDER BY  coti.id DESC
			';
			$result = $this->_db->getConsulta($sql);
			return $result;*/


		/*$sql='
				SELECT * FROM cmx_cotizaciones_serviciocliente coti
				INNER JOIN cmx_detalle_mercancia2 m
				ON coti.n_cotizacion=m.n_cotizacion
				GROUP BY coti.n_cotizacion
				ORDER BY  coti.id DESC
			';*/

		//echo $sql;
	}

	public function clientes()
	{
		$sql = '
				SELECT cli.documento,cli.nombre
				FROM cmx_clientes cli
				INNER JOIN cmx_clientes_serv_contratados ccsc
				ON cli.id=ccsc.id_cliente
				WHERE cli.estado=1 
				AND ccsc.servicio IN ("Transporte de Carga Nacional","Transporte de Carga Internacional") 
				GROUP BY cli.id
				ORDER BY cli.nombre ASC';
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	//clientes
	public function traercliente_modal()
	{
		$sql = "SELECT cli.*,ep.nombre_empresa,ep.id AS empresa_id FROM cmx_clientes cli
			INNER JOIN cmx_clientes_serv_contratados ccsc ON cli.id=ccsc.id_cliente
			INNER JOIN cmx_empresas ep on cli.empresa=ep.id
			WHERE cli.estado=1 
			AND ccsc.servicio IN ('Transporte de Carga Nacional','Transporte de Carga Internacional') 
			GROUP BY cli.id ORDER BY cli.nombre ASC";
		$result = $this->_db->getConsulta($sql);
		return $result;
	}
	//municipios
	public function select()
	{
		$sql = '
				SELECT * FROM cmx_municipios
			';
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	//n° cotizacion
	public function num_cotizacion()
	{
		$sql = 'SELECT max(n_cotizacion)+1 AS nco FROM cmx_cotizaciones_serviciocliente';
		$result = $this->_db->getConsulta($sql);
		return $result;
	}
	//consulta para traer los datos a editar
	public function cotizacion_editar($id)
	{
		$id = $id;
		$sql = "SELECT * from cmx_cotizaciones_serviciocliente
			WHERE id=" . $id . " ";
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	//UPDATE DE COTIZACION
	public function update_cotizar() {}
	//conteo de cotizaciones
	public function conteo_cotizacion($tipo, $cliente, $fi, $ff)
	{
		if ($tipo == 1) {
			$sql = "SELECT COUNT(id) AS cantidad FROM cmx_cotizaciones_serviciocliente
					  WHERE nit='" . $cliente . "'";
		}
		if ($tipo == 2) {
			$sql = "SELECT COUNT(id) AS cantidad FROM cmx_cotizaciones_serviciocliente 
				WHERE fecha_creacion BETWEEN '" . $fi . "' AND '" . $ff . "'";
		}
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	//MULTISELECT 
	// class serviciocliente{
	public function ObtenerMunicipios()
	{
		$model    = new Conexion;
		$conexion = $model->conectar();
		$sql      = " SELECT * FROM cmx_municipios ";
		$consulta = $conexion->prepare($sql);
		$consulta->execute();
		$total = $consulta->rowCount();
		$this->mensaje = $total;
		if ($total == 0) {
			$this->respuesta = "BAD";
		} else {
			$this->respuesta = "GOOD";
			while ($datos_municipio = $consulta->fetch()) {
				$this->listado[] = $datos_municipio;
			}
		}
	}
}
