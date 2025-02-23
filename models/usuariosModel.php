<?php
class usuariosModel extends Model
{

    public function __construct()
    {
        parent::__construct();
    }

    public function getUsuarios()
    {
        $sql = 'SELECT
					cu.id, cu.user_log, cu.nom_usuario, cu.email, cu.url_avatar, cu.estado ESTADO_USUARIO,
					cp.id ID_PERFIL, cp.nombre_perfil, cp.tipo_perfil,
					cc.id ID_CLIENTE, cc.sigla NOMBRE_CLIENTE,
					IF(	cuc.id_bodega IS NOT NULL,
						(	SELECT crd1.id
							FROM cmx_bodegas cb1
								INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cb1.id_remtente_destinatario
							WHERE cuc.id_bodega = crd1.id
						), NULL
					) ID_BODEGA,
					IF(	cuc.id_bodega IS NOT NULL,
						(	SELECT crd1.sigla
							FROM cmx_bodegas cb1
								INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cb1.id_remtente_destinatario
							WHERE cuc.id_bodega = crd1.id
						), NULL
					) BODEGA
				FROM
					cmx_usuarios cu
					INNER JOIN cmx_usuario_cliente cuc ON cuc.id_usuario = cu.id
					INNER JOIN cmx_perfiles cp ON cp.id = cuc.id_perfil
					INNER JOIN cmx_clientes cc ON cc.id = cuc.id_cliente
				ORDER BY cu.estado DESC, cp.tipo_perfil, cu.nom_usuario
			';
        $result = $this->_db->getConsulta($sql);
        return $result;
    }

    public function getTabla()
    {
        $result = $this->_db->getConsulta("");
        return $result;
    }

    public function contarClaves($id_usuario, $clave)
    {
        $sql = '
				SELECT COUNT(cuc.id) CUANTOS
				FROM cmx_usuarios_claves cuc
				WHERE cuc.id_usuario = "' . $id_usuario . '"
					AND cuc.pass = "' . sha1($clave) . '"
			';
        $result = $this->_db->getConsulta($sql);
        return $result["rowsData"][0]["CUANTOS"];
    }

    public function getcambioclave($id, $numdocumento, $email)
    {
        $sql = 'UPDATE cmx_usuarios SET pass=""
                WHERE user_log="' . $numdocumento . '" AND email="' . $email . '" ';

        $sql1 = 'UPDATE cmx_usuarios_claves SET  id_usuario="' . $id . '", pass=""
          		 WHERE autor="' . $id . '"  ';

        $result = $this->_db->updateRegistro($table, $sql, $id);
        $result1 = $this->_db->updateRegistro($table, $sql1, $id);
        return $result;
        return $result1;
    }

    // Se busca el id de usuario por el user_log
    public function getUserId($user_log)
    {
        $sql = '
				SELECT cu.id
				FROM cmx_usuarios cu
				WHERE cu.user_log = "' . $user_log . '"
			';
        $result = $this->_db->getConsulta($sql);
        return $result;
    }

    public function getHtmlSelect($name, $id, $id_cliente)
    {

        if ($name) {
            $query = '
					SELECT
						cus.id, cus.nom_usuario
					FROM
						cmx_usuarios cus
						INNER JOIN cmx_usuario_cliente cuc ON cus.id = cuc.id_usuario
						INNER JOIN cmx_clientes cc ON cc.id = cuc.id_cliente
					WHERE
						cus.estado = 1
						AND cuc.estado = 1
						AND cuc.id_perfil NOT IN (2 , 3)
						AND cc.estado = 1
						AND cc.id = ' . $id_cliente . ';
				';
            // echo $query;
            // $array = $this->_db->getConsulta($query);
            $array = $this->_db3->prepare($query);
            $array->execute();
            $array = $array->fetchAll(PDO::FETCH_ASSOC);


            // Se recorre contenido de la consulta
            if ($array) {
                // print_r($array);
                $select = '
						<select class="select2 select2-hidden-accessible" name="' . $name . '" id="slct_usuarios_' . $id . '" aria-hidden="true">
					';

                $select .= '<option value="" selected="" disabled="" >Seleccione</option>';
                foreach ($array as $key => $value) {
                    if ($value['id'] == $id) {
                        $select .= '<option value="' . $value['id'] . '" selected="">' . $value['nom_usuario'] . '</option>';
                    } else {
                        $select .= '<option value="' . $value['id'] . '">' . $value['nom_usuario'] . '</option>';
                    }
                }
                $select .= '</select>';
            } else {
                $select = "No hay datos en esta tabla...";
            }
        } else {
            $select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
        }

        return $select;
    }

    public function getHtmlSelectPerfilesComercial($name, $id)
    {
        if ($name) {
            $query = $this->_db3->prepare('SELECT cp.id, cp.nombre_perfil FROM cmx_perfiles cp
					WHERE cp.estado = 1 AND cp.id NOT IN (1,2,3,17,18)
					ORDER BY cp.nombre_perfil');
            $query->execute();
            $array = $query->fetchAll(PDO::FETCH_ASSOC);

            // Se recorre contenido de la consulta
            if ($array) {
                $select = '<select class="select2 select2-hidden-accessible" name="' . $name . '" id="slct_perfil_' . $id . '" aria-hidden="true">';
                $select .= '<option value="" selected="" disabled="" >Seleccione</option>';

                foreach ($array as $key => $value) {
                    if ($value['id'] == $id) {
                        $select .= '<option value="' . $value['id'] . '" selected="">' . $value['nombre_perfil'] . '</option>';
                    } else {
                        $select .= '<option value="' . $value['id'] . '">' . $value['nombre_perfil'] . '</option>';
                    }
                }
                $select .= '</select>';
            } else {
                $select = "No hay datos en esta tabla...";
            }
        } else {
            $select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
        }

        return $select;
    }

    public function getUsuariosPerfil($id_cliente, $id_perfil)
    {
        $query = '
				SELECT
					cus.id, cus.nom_usuario, cp.nombre_perfil
				FROM
					cmx_usuarios cus
					INNER JOIN cmx_usuario_cliente cuc ON cus.id = cuc.id_usuario
					INNER JOIN cmx_clientes cc ON cc.id = cuc.id_cliente
					INNER JOIN cmx_perfiles cp ON cp.id = cuc.id_perfil
				WHERE
					cuc.id_perfil IN (' . $id_perfil . ')
					AND cc.id = ' . $id_cliente . '
					AND cus.estado = 1
					AND cuc.estado = 1
					AND cc.estado = 1;
			';
        $result = $this->_db->getConsulta($query);
        return $result;
    }

    public function getHtmlSelectUsuarioPerfil_sm($name, $id, $id_cliente, $id_perfil, $id_usuario)
    {
        if ($name) {
            $query = '
                SELECT 
                    cus.id, cus.nom_usuario, cp.nombre_perfil
                FROM 
                    cmx_usuarios cus 
                    INNER JOIN cmx_usuario_cliente cuc ON cus.id = cuc.id_usuario
                    INNER JOIN cmx_clientes cc ON cc.id = cuc.id_cliente
                    INNER JOIN cmx_perfiles cp ON cp.id = cuc.id_perfil
                WHERE 
                    cuc.id_perfil IN (' . $id_perfil . ', 1)
                    AND cc.id = ' . $id_cliente . '
                    AND cus.estado = 1
                    AND cuc.estado = 1
                    AND cc.estado = 1
                ORDER BY cp.nombre_perfil, cus.nom_usuario;
            ';
            $array = $this->_db->getConsulta($query);

            // Se recorre contenido de la consulta
            if ($array) {
                // print_r($array);
                $select = '<select class="form-control input-sm" name="' . $name . '" id="slct_' . $id . '">';

                $select .= '<option value="" selected="" disabled="" >Seleccione</option>';
                foreach ($array['rowsData'] as $key => $value) {
                    if ($value["id"] == $id_usuario) {
                        $select .= '<option value="' . $value["id"] . '" selected="">' . $value["nom_usuario"] . ' - ' . $value["nom_usuario"] . '</option>';
                    } else {
                        $select .= '<option value="' . $value["id"] . '">' . $value["nom_usuario"] . ' - ' . $value["nombre_perfil"] . '</option>';
                    }
                }
                $select .= '</select>';
            } else {
                $select = "No hay datos en esta tabla...";
            }
        } else {
            $select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
        }

        return $select;
    }

    /***** Funciones para el módulo de administrar perfiles *****/
    public function getPerfiles()
    {
        $sql = '
				SELECT *
				FROM cmx_perfiles cp
				ORDER BY cp.tipo_perfil, cp.nombre_perfil
			';
        $result = $this->_db->getConsulta($sql);
        return $result;
    }

    public function getEnumSlctTipoPerfil($name, $id, $value_select)
    {
        $sql = "
				SHOW COLUMNS FROM
					cmx_perfiles
				LIKE 'tipo_perfil'
			";
        // echo "<p>" . $sql . "</p>";
        $result = $this->_db->getConsulta($sql);

        foreach ($result["rowsData"] as $key => $value) {
            $value["Type"] = str_replace("enum(", "", $value["Type"]);
            $value["Type"] = str_replace(")", "", $value["Type"]);
            $value["Type"] = str_replace("'", "", $value["Type"]);

            $arrayTipoActividad = explode(",", $value["Type"]);
        }
        // print_r("<pre>");
        // print_r($arrayTipoActividad);
        // print_r("</pre>");

        $select = '
				<select class="form-control input-sm" name="' . $name . '" id="slct_' . $name . '_' . $id . '" aria-hidden="true">
			';
        $select .= '<option value="" selected disabled>Seleccione</option>';
        foreach ($arrayTipoActividad as $key => $value) {

            if ($value == $value_select) {
                $select .= '<option value="' . $value . '" selected="">' . $value . '</option>';
            } else {
                $select .= '<option value="' . $value . '">' . $value . '</option>';
            }
        }
        $select .= '</select>';

        return $select;
    }

    public function getAccesosPerfil($id)
    {
        $sql = '
				SELECT mn.nom_menu, sub.titulo from cmx_menu as mn
				inner join cmx_submenu as sub
				inner join cmx_menu_perfil mp
				on mn.id=sub.id_menu and sub.id=mp.id_submenu
				WHERE mp.id_perfil="' . $id . '"
			';
        $result = $this->_db->getConsulta($sql);
        return $result;
    }
}
