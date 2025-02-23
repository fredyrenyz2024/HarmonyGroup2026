<?php

class lanzadorModel extends Model
{

    public function __construct()
    {
        parent::__construct();
    }

    public function getLanzador($id)
    { //aqui se puede poner cualquier nombre
        $idperfil = $id;
        $usuario = $_SESSION['usuario']['id_usuario'];
        $id_cliente = $_SESSION['usuario']['id_cliente'];
        $tipo_perfil = $_SESSION['usuario']['tipo_perfil'];

        if ($tipo_perfil == "CLIENTES") {
            $sql = 'SELECT *,mo.nombre, mo.id,usc.id_cliente AS CLIENTE_ID
			FROM cmx_modulos AS mo
			INNER JOIN cmx_modulos_perfil AS mp
			INNER JOIN cmx_perfiles AS per ON mo.id=mp.id_modulo AND mp.id_perfil=per.id
			INNER JOIN cmx_usuario_cliente usc ON usc.id_perfil=per.id
			INNER JOIN cmx_usuarios u ON u.id=usc.id_usuario
			INNER JOIN cmx_clientes c ON c.id=usc.id_cliente
			WHERE mp.id_perfil="' . $idperfil . '" AND per.id="' . $idperfil . '" AND c.id="' . $id_cliente . '" AND per.estado=1 AND mo.estado="Activo" GROUP BY mo.id ';
            $result = $this->_db->getConsulta($sql);
            //viene de configuraciones funciones establecidas por defecto para consultas, eliminar, registrar... (getconsuktas SOLO para consultar algo)
            if ($result > 1) {
                return $result["rowsData"];
            } else {
                return $result;
            }
            // return $result;
        } else {
            $sql = 'SELECT mo.nombre, mo.id,usc.id_cliente AS CLIENTE_ID
				FROM cmx_modulos AS mo
				INNER JOIN cmx_modulos_perfil AS mp
				INNER JOIN cmx_perfiles AS per ON mo.id=mp.id_modulo AND mp.id_perfil=per.id
				INNER JOIN cmx_usuario_cliente usc ON usc.id_usuario="' . $usuario . '"
				INNER JOIN cmx_usuarios u ON u.id=usc.id_usuario
				INNER JOIN cmx_clientes c ON c.id=usc.id_cliente
				WHERE mp.id_perfil="' . $idperfil . '" AND per.id="' . $idperfil . '" AND per.estado=1 AND mo.estado="Activo" GROUP BY mo.id ORDER BY mo.nombre ASC';
            $result = $this->_db->getConsulta($sql);
            if ($result > 1) {
                return $result["rowsData"];
            } else {
                return $result;
            }
            //viene de configuraciones funciones establecidas por defecto para consultas, eliminar, registrar... (getconsuktas SOLO para consultar algo)
        }
    }
}