<?php
class clientes_newModel extends Model
{

	public function __construct()
	{
		parent::__construct();
	}


	public function seguimiento_ruta()
	{
		$sql = "
			SELECT r.*, e.id AS med, e.cod_ini_ruta, e.estado, 
					e.actual, e.observacion, e.fecha, e.hora, e.usuario,p.nombre,
					MAX(e.estado) AS ultimo
					FROM cmx_inicio_ruta AS r
					INNER JOIN cmx_inici_manifiesto_estado AS e
					ON r.cod_inicio=e.cod_ini_ruta
					LEFT JOIN cmx_proveedores AS p
					ON p.numero_documento=r.cond_cedula
					WHERE e.estado IN('Enturnado','en ruta')
					
					GROUP BY e.cod_ini_ruta
				";
		$result = $this->_db->getConsulta($sql);
		return $result;
	}


	public function gettablass()
	{

		$sql = "
		
	SELECT au.*, u.nom_usuario, a.nombre
	FROM cmx_agencia_usuario au
	INNER JOIN cmx_usuarios u
	ON au.id_usuario=u.id
	INNER JOIN cmx_agencias a
	ON au.id_agencia=a.id
	GROUP BY au.id_usuario
	
";

		$result = $this->_db->getConsulta($sql);
		return $result;
	}


	public function getagencia2($id_usuario)
	{
		$sql = "
	SELECT a.* FROM cmx_agencias a
	LEFT JOIN cmx_agencia_usuario au
	ON a.id=au.id_agencia
	WHERE au.id_usuario=" . $id_usuario . " ;	
";
		$result = $this->_db->getConsulta($sql);
		return $result;
	}


	public function getusuario()
	{
		$sql = "
	SELECT id,nom_usuario,user_log 
	FROM cmx_usuarios
";
		$result = $this->_db->getConsulta($sql);
		return $result;
	}
}
