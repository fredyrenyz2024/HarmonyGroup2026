<?php

include '../application/Conexion.php';
require_once '../application/Config.php';
session_start();
class Solicitudes
{

    public $user_log;
    public $pass;
    public $mensaje;
    public $respuesta;
    public $email;
    public $listado;

    public function ObtenerclientesUsuario()
    {
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "   SELECT id, nombre FROM cmx_clientes ";
        $consulta = $conexion->prepare($sql);
        $consulta->execute();
        $total         = $consulta->rowCount();
        $this->mensaje = $total;
        if ($total == 0) {
            $this->respuesta = "BAD";
        } else {
            $this->respuesta = "GOOD";
            while ($datos_clientes = $consulta->fetch()) {
                $this->listado[] = $datos_clientes;
            }
        }
    }

    public function crearSolicitud()
    {
        $cliente = $_POST["cliente"];
        $origen = $_POST["origen"];
        $destino = $_POST["destino"];
        $orden_compra = $_POST["orden_compra"];
        $tipo_operacion = $_POST["tipo_operacion"];
        $tipo_vehiculo = $_POST["tipo_vehiculo"];
        $numero_bl = $_POST["num_bl"];
        $tipo_vehiculo = $_POST["tipo_vehiculo"];
        $numero_solicitud = "SLC-" . time();
        $id_usuario = $_SESSION["usuario"]["id_usuario"];
        $mercancia = $_POST["mercancia"];
        $tramos = $_POST["tramos"];
        $adicionales = $_POST["adicionales"];
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = " INSERT INTO cmx_solicitudes (id_cliente,numero_solicitud, origen,destino,tipo_operacion,numero_orden,numero_bl,tipo_vehiculo, fecha_solicitud,estado)
            VALUES ($cliente,'$numero_solicitud','$origen','$destino','$tipo_operacion','$orden_compra','$numero_bl','$tipo_vehiculo','" . date('Y-m-d H:i:s', time()) . "','Activa')";
        $crear_solicitud = $conexion->prepare($sql);
        $result = $crear_solicitud->execute();
        if ($result) {
            $sql      = " INSERT INTO cmx_usuario_solicitud (id_solicitud, id_usuario, operacion, fecha_hora_operacion) VALUES ((SELECT MAX(id) FROM cmx_solicitudes),$id_usuario,'Crear','" . date('Y-m-d H:i:s', time()) . "') ";
            $crear_oper_sol = $conexion->prepare($sql);
            $result = $crear_oper_sol->execute();

            for ($i = 0; $i < count($mercancia); $i++) {
                $sql      = " INSERT INTO cmx_mercancia_solicitud (id_solicitud, tipo_mercancia, tara_contenedor, peso_total, unidades, valor_declarado, tipo_movilizacion) VALUES ((SELECT MAX(id) FROM cmx_solicitudes),'" . $mercancia[$i]["tipo_mercancia"] . "','" . $mercancia[$i]["tara_contenedor"] . "','" . $mercancia[$i]["peso_total"] . "','" . $mercancia[$i]["unidades"] . "','" . $mercancia[$i]["valor_declarado"] . "','" . $mercancia[$i]["tipo_movilizacion"] . "')";
                $crear_mercancia = $conexion->prepare($sql);
                $resultmercancia = $crear_mercancia->execute();
            }
            for ($i = 0; $i < count($tramos); $i++) {
                if ($tramos[$i]["sumaflete"] == 'true') {
                    $tramos[$i]["sumaflete"] = '1';
                } else if ($tramos[$i]["sumaflete"] == 'false') {
                    $tramos[$i]["sumaflete"] = '0';
                }
                if ($tramos[$i]["personal"] == 'true') {
                    $tramos[$i]["personal"] = '1';
                } else if ($tramos[$i]["personal"] == 'false') {
                    $tramos[$i]["personal"] = '0';
                }
                if ($tramos[$i]["id_remitente_destinatario"] == "") {
                    $sql = "INSERT INTO cmx_remitente_destinatario (id_cliente,direccion, nombre,contacto ) VALUES ($cliente,'" . $tramos[$i]["direccion"] . "','" . $tramos[$i]["remitente_destinatario"] . "','" . $tramos[$i]["contacto"] . "')";
                    $crear_remitente = $conexion->prepare($sql);
                    $resultremitente = $crear_remitente->execute();

                    $sql      = "INSERT INTO cmx_tramo_solicitud (id_solicitud,id_remitente_destinatario,fecha_hora_operacion,tipo_operacion,peso,unidades,valor_venta,valor_compra,personal,suma_flete) VALUES ((SELECT MAX(id) FROM cmx_solicitudes),(SELECT MAX(id) FROM cmx_remitente_destinatario),'" . $tramos[$i]["fecha_hora_tramo"] . "','" . $tramos[$i]["tipo_tramo"] . "','" . $tramos[$i]["peso_tramo"] . "','" . $tramos[$i]["unidades_tramo"] . "','" . $tramos[$i]["valor_venta_tramo"] . "','" . $tramos[$i]["valor_compra_tramo"] . "','" . $tramos[$i]["personal"] . "','" . $tramos[$i]["sumaflete"] . "')";
                    $crear_tramo = $conexion->prepare($sql);
                    $resulttramo = $crear_tramo->execute();
                } else {
                    $sql      = "INSERT INTO cmx_tramo_solicitud (id_solicitud,id_remitente_destinatario,fecha_hora_operacion,tipo_operacion,peso,unidades,valor_venta,valor_compra,personal,suma_flete) VALUES ((SELECT MAX(id) FROM cmx_solicitudes)," . $tramos[$i]["id_remitente_destinatario"] . ",'" . $tramos[$i]["fecha_hora_tramo"] . "','" . $tramos[$i]["tipo_tramo"] . "','" . $tramos[$i]["peso_tramo"] . "','" . $tramos[$i]["unidades_tramo"] . "','" . $tramos[$i]["valor_venta_tramo"] . "','" . $tramos[$i]["valor_compra_tramo"] . "','" . $tramos[$i]["personal"] . "','" . $tramos[$i]["sumaflete"] . "')";
                    $crear_tramo = $conexion->prepare($sql);
                    $resulttramo = $crear_tramo->execute();
                }
            }
            for ($i = 0; $i < count($adicionales); $i++) {
                $sql      = " INSERT INTO cmx_servicio_adicional_tramo (id_solicitud, tipo_servicio, valor_venta,valor_compra) VALUES ((SELECT MAX(id) FROM cmx_solicitudes),'" . $adicionales[$i]["tipo_servicio"] . "','" . $adicionales[$i]["valor_venta"] . "','" . $adicionales[$i]["valor_compra"] . "')";
                $crearservicio = $conexion->prepare($sql);
                $resultadicionales = $crearservicio->execute();
            }
            $return["content"] = $sql;
            $return["success"] = true;
        } else {
            $return['success'] = false;
            $return['error'] = "Error al generar la solicitud";
        }
        return $return;
    }

    public function listarSolicitudes()
    {
        $id_usuario = $_SESSION["usuario"]["id_usuario"];

        $Data = new Consultas;

        $sql = "
			SELECT 
				csol.id as 'id_solicitud',csol.*,cc.nombre as 'nombre_cliente',
				((	SELECT SUM(cms.peso_total) 
					FROM cmx_mercancia_solicitud cms 
					WHERE cms.id_solicitud = csol.id)+csol.tara_contenedor
				) as 'peso_total_solicitud'
			FROM 
				cmx_solicitudes csol, cmx_clientes cc, cmx_usuario_solicitud cus
			WHERE 
				cus.id_usuario = $id_usuario
				AND cc.id = csol.id_cliente
				AND cus.id_solicitud = csol.id
				AND csol.estado != 'En proceso'
			GROUP BY csol.id 
			ORDER BY csol.fecha_solicitud ASC";
        $result = $Data->getConsulta($sql);

        if ($result) {
            $this->respuesta = "GOOD";
            $total = $result["rowsNum"];
            foreach ($result["rowsData"] as $key => $value) {
                $this->listado[] = $value;
            }
        } else {
            $this->respuesta = "BAD";
            $total = 0;
        }
    }

    public function obtenerdatossolicitud()
    {
        $id_usuario = $_SESSION["usuario"]["id_usuario"];
        $id_solicitud = $_POST["id_solicitud"];
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "  SELECT csol.id as 'id_solicitud',csol.*,cc.nombre as 'nombre_cliente',cu.nom_usuario as 'nombre_usuario' 
                        FROM cmx_solicitudes csol, cmx_clientes cc,
                        cmx_usuarios cu,cmx_usuario_solicitud cus
                        WHERE cc.id = csol.id_cliente 
                        AND csol.id = $id_solicitud 
                        AND cu.id = cus.id_usuario
                        GROUP BY csol.id ";
        $buscar_solicitud = $conexion->prepare($sql);
        $buscar_solicitud->execute();
        $total         = $buscar_solicitud->rowCount();
        $datos_solicitudes = $buscar_solicitud->fetch();
        if ($buscar_solicitud) {
            $return['success'] = true;
            $return['content'] = $datos_solicitudes;
        } else {
            $return['success'] = false;
            $return['error'] = "Error al generar la solicitud";
        }
        return $return;
    }

    public function verdatossolicitud()
    {
        $id_usuario = $_SESSION["usuario"]["id_usuario"];
        $id_solicitud = $_POST["id_solicitud"];

        $Data = new Consultas;

        // Se busca la información general de la solicitud
        $sql = '
			SELECT 
				DISTINCT(cs.id) ID_SOLICITUD, cs.*, cip.id ID_PROYECTO, cip.id_contrato,
				cc.nombre NOMBRE_CLIENTE, 
				cu.nom_usuario NOMBRE_USUARIO, cu.url_avatar, cus.operacion, 
				IF(
					(	SELECT COUNT(crvc1.id)
						FROM cmx_rndc_vehiculos_carroceria crvc1
						WHERE crvc1.id = cs.tipo_carroceria) > 0
					,(	SELECT crvc1.descripcion
						FROM cmx_rndc_vehiculos_carroceria crvc1
						WHERE crvc1.id = cs.tipo_carroceria)
					, NULL
				) CARROCERIA,
				IF(
					(	SELECT COUNT(ctv1.id)
						FROM cmx_tipo_vehiculos ctv1
						WHERE ctv1.id = cs.tipo_vehiculo) > 0
					,(	SELECT ctv1.nombre
						FROM cmx_tipo_vehiculos ctv1
						WHERE ctv1.id = cs.tipo_vehiculo)
					, NULL
				) TIPO_VEHICULO
			FROM 
				cmx_solicitudes cs
				INNER JOIN cmx_clientes cc ON cc.id = cs.id_cliente
				INNER JOIN cmx_usuario_solicitud cus ON cus.id_solicitud = cs.id
				INNER JOIN cmx_usuarios cu ON cu.id = cus.id_usuario
				INNER JOIN cmx_integracion_soluc_import cisi ON cisi.id_solucion = cs.id
				INNER JOIN cmx_importacion_actividades cia ON cia.id = cisi.id_importacion_actividad
				INNER JOIN cmx_importacion_proyecto cip ON cip.id = cia.id_importacion
			WHERE 
				cs.id = ' . $id_solicitud . '
				AND cus.operacion = "Crear";
		';
        $result = $Data->getConsulta($sql);

        if ($result) {
            $info_general = $result["rowsData"][0];
            $return["info_general"] = $info_general;

            // Se buscan los tipos de vehículo
            $return["tipos_vehiculo"] = $this->cargartiposvehiculos();
            // Se buscan los tipos de carrocería
            $return["tipos_carroceria"] = $this->cargartiposcarroceria();
            // Se buscan los servicios adicionales ofrecidos
            $return["serv_adicionales"] = $this->verParamServiciosAdicionales($Data);

            // Se buscan los proveedores
            $return["proveedores"] = $this->cargarprovedores();

            // Se busca el material de la solicitud 
            $sql = '  
				SELECT * 
				FROM cmx_mercancia_solicitud 
				WHERE id_solicitud = ' . $info_general["ID_SOLICITUD"] . ';
			';
            $result = $Data->getConsulta($sql);
            $return["material"] = $result;

            // Se busca la información del contrato 
            if ($info_general["id_contrato"]) {
                // $return["contrato"]["info"] = $result["rowsData"][0];
                $return["contrato"]["info"] = $this->verContratoSolicitud($Data, $info_general["id_contrato"]);

                // Se buscan los tramos del contrato
                $return["contrato"]["tramos"] = $this->verContratoTramos($Data, $info_general["id_contrato"], $info_general["id_cliente"]);

                // Se buscan los tipo de vehiculo del contrato
                $return["contrato"]["tipos_vehiculo"] = $this->verContratoTipoVehiculos($Data, $info_general["id_contrato"]);

                // Se buscan las condiciones del contrato
                $return["contrato"]["condiciones"] = $this->verContratoCondiciones($Data, $info_general["id_contrato"]);
            }
        }
        return $return;
    }

    /***** FUNCIONES PARA TOMAR INFORMACIÓN DE CONTRATOS *****/
    public function verContratoSolicitud($Data, $id_contrato)
    {
        $sql = '  
			SELECT 
				ccc.*,
				ctc.nombre, ctc.descripcion
			FROM 
				cmx_contrato_cliente ccc
				INNER JOIN cmx_tipo_contrato ctc ON ctc.id = ccc.tipo_contrato
			WHERE 
				ccc.id = ' . $id_contrato . ';
		';
        $result = $Data->getConsulta($sql);
        return $result["rowsData"][0];
    }

    public function verContratoTramos($Data, $id_contrato, $id_cliente)
    {
        $sql = '  
			SELECT 
				cct.*,
				CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais,")") MUNICIPIO, cm.rndc_codigo_ciudad
			FROM 
				cmx_contrato_tramos cct
				INNER JOIN cmx_municipios cm ON cm.id = cct.id_ciudad
			WHERE 
				cct.id_contrato = ' . $id_contrato . ';
		';
        $result["ciudades"] = $Data->getConsulta($sql);

        // Se buscan los remitentes destinatarios del cliente por ciudad 
        if ($result["ciudades"]) {
            foreach ($result["ciudades"]["rowsData"] as $key => $value) {
                $sql = '
					SELECT 
						crd.*, CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") MUNICIPIO
					FROM 
						cmx_remitente_destinatario crd
						INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
					WHERE 
						crd.id_cliente IN (1,' . $id_cliente . ')
						AND crd.id_ciudad = ' . $value["id_ciudad"] . '
						AND crd.rndc_id IS NOT NULL
						AND crd.estado = 1;
				';
                $result_01 = $Data->getConsulta($sql);
                $result["remi_dest"][$value["id_ciudad"]] = $result_01["rowsData"];
            }
        }
        return $result;
    }

    public function verContratoTipoVehiculos($Data, $id_contrato)
    {
        $sql = '
			SELECT 
				ccv.*,
				ctv.nombre, ctv.peso_maximo
			FROM 
				cmx_contrato_vehiculo ccv
				INNER JOIN cmx_tipo_vehiculos ctv ON ctv.id = ccv.id_vehiculo
			WHERE 
				ccv.id_contrato = ' . $id_contrato . ';
		';
        $result = $Data->getConsulta($sql);
        return $result;
    }

    public function verContratoCondiciones($Data, $id_contrato)
    {
        $sql = '  
			SELECT 
				ccc.*,
				ctcc.tipo_dato, ctcc.nombre, ctcc.descripcion DESCRIPCION_CONDICION
			FROM 
				cmx_contrato_condiciones ccc
				INNER JOIN cmx_tipo_contrato_condicion ctcc ON ctcc.id = ccc.id_condicion
			WHERE 
				ccc.id_contrato = ' . $id_contrato . ';
		';
        $result = $Data->getConsulta($sql);
        return $result;
    }

    public function verParamServiciosAdicionales($Data)
    {
        $sql = '  
			SELECT 
				ccc.*
			FROM 
				cmx_contabilidad_conceptos ccc
			WHERE 
				ccc.tipo_servicio != "BASICO"
				AND ccc.estado = 1
			ORDER BY ccc.nom_servicios_especial
		';
        $result = $Data->getConsulta($sql);

        if ($result) {
            $array = $result["rowsData"];
        }
        return $array;
    }
    /***** FIN - FUNCIONES PARA TOMAR INFORMACIÓN DE CONTRATOS *****/

    public function editarSolicitud()
    {
        $id_solicitud = $_POST["id_solicitud"];
        $cliente = $_POST["cliente"];
        $origen = $_POST["origen"];
        $orden_compra = $_POST["orden_compra"];
        $tipo_operacion = $_POST["tipo_operacion"];
        $tipo_vehiculo = $_POST["tipo_vehiculo"];
        $tipo_carroceria = $_POST["tipo_carroceria"];
        $numero_bl = $_POST["num_bl"];
        $id_usuario = $_SESSION["usuario"]["id_usuario"];
        $mercancia = $_POST["mercancia"];
        $tramos = $_POST["tramos"];
        $adicionales = $_POST["adicionales"];
        $total_mercancia = $_POST["total_mercancia"];
        $total_tramos = $_POST["total_tramos"];
        $total_adicionales = $_POST["total_adicionales"];
        $model    = new Conexion;
        $conexion = $model->conectar();
        if ($tipo_vehiculo == "") {
            $sql = "
                UPDATE cmx_solicitudes 
                SET 
                    id_cliente = $cliente, 
                    origen = '$origen', 
                    tipo_operacion = '$tipo_operacion', 
                    numero_orden = '$orden_compra', 
                    numero_bl = '$numero_bl',
                    estado = 'En proceso'
                WHERE id = $id_solicitud 
            ";
        } else {
            $flag_tipo_carroceria = "";
            if ($tipo_carroceria) {
                $flag_tipo_carroceria = " tipo_carroceria = '$tipo_carroceria', ";
            }
            $sql = "
                UPDATE cmx_solicitudes 
                SET 
                    id_cliente = $cliente, 
                    origen = '$origen', 
                    tipo_vehiculo = '$tipo_vehiculo', 
                    " . $flag_tipo_carroceria . " 
                    tipo_operacion = '$tipo_operacion', 
                    numero_orden = '$orden_compra', 
                    numero_bl = '$numero_bl',
                    estado = 'En proceso'
                WHERE id = $id_solicitud 
            ";
        }

        $actualizar_solicitud = $conexion->prepare($sql);
        $result = $actualizar_solicitud->execute();
        if ($result) {
            $sql = "
                INSERT INTO 
                    cmx_usuario_solicitud (id_solicitud, id_usuario, operacion, fecha_hora_operacion) 
                VALUES ($id_solicitud, $id_usuario,'Editar','" . date('Y-m-d H:i:s', time()) . "')
            ";
            $crear_oper_sol = $conexion->prepare($sql);
            $result = $crear_oper_sol->execute();
            if ($total_tramos > 0) {
                $sql = " 
                    DELETE
                    FROM 
                        cmx_tramo_material
                    WHERE
                        id_tramo IN (
                            SELECT 
                                id
                            FROM 
                                cmx_tramo_solicitud 
                            WHERE
                                id_solicitud = $id_solicitud
                        )
                ";
                $borrar_material_tramos = $conexion->prepare($sql);
                $result = $borrar_material_tramos->execute();

                $sql = " DELETE FROM cmx_tramo_solicitud WHERE id_solicitud = $id_solicitud ";
                $borrar_tramos = $conexion->prepare($sql);
                $result = $borrar_tramos->execute();


                $return["content"] = $tramos;

                for ($i = 0; $i < count($tramos); $i++) {
                    $id_actividades = "";
                    $id_material_proyecto = "";

                    if ($tramos[$i]["sumaflete"] == 'true') {
                        $tramos[$i]["sumaflete"] = '1';
                    } else if ($tramos[$i]["sumaflete"] == 'false') {
                        $tramos[$i]["sumaflete"] = '0';
                    }
                    if ($tramos[$i]["personal"] == 'true') {
                        $tramos[$i]["personal"] = '1';
                    } else if ($tramos[$i]["personal"] == 'false') {
                        $tramos[$i]["personal"] = '0';
                    }
                    // Si no existe el remitente destinatario registrado se agrega
                    if ($tramos[$i]["id_remitente_destinatario"] == "") {
                        $sql = "
                            INSERT INTO 
                                cmx_remitente_destinatario ( id_cliente, documento, direccion, id_ciudad, nombre, contacto ) 
                            VALUES 
                                (
                                    $cliente,
                                    " . TIME() . ",
                                    '" . $tramos[$i]["direccion"] . "',
                                    '" . $tramos[$i]["id_ciudad"] . "',
                                    '" . $tramos[$i]["remitente_destinatario"] . "',
                                    '" . $tramos[$i]["contacto"] . "'
                                )
                        ";
                        $crear_remitente = $conexion->prepare($sql);
                        $resultremitente = $crear_remitente->execute();

                        $sql = "
                            INSERT INTO 
                                cmx_tramo_solicitud (id_solicitud,id_remitente_destinatario,fecha_hora_operacion,tipo_operacion,peso,unidades,valor_venta,valor_compra,personal,suma_flete) 
                            VALUES 
                                (   $id_solicitud,
                                    (SELECT MAX(id) FROM cmx_remitente_destinatario),
                                    '" . $tramos[$i]["fecha_hora_tramo"] . "',
                                    '" . $tramos[$i]["tipo_tramo"] . "',
                                    '" . $tramos[$i]["peso_tramo"] . "',
                                    '" . $tramos[$i]["unidades_tramo"] . "',
                                    '" . $tramos[$i]["valor_venta_tramo"] . "',
                                    '" . $tramos[$i]["valor_compra_tramo"] . "',
                                    '" . $tramos[$i]["personal"] . "',
                                    '" . $tramos[$i]["sumaflete"] . "'
                                )
                        ";
                        $crear_tramo = $conexion->prepare($sql);
                        $resulttramo = $crear_tramo->execute();
                    } else {
                        $sql = " 
                            INSERT INTO 
                                cmx_tramo_solicitud (id_solicitud,id_remitente_destinatario,fecha_hora_operacion,tipo_operacion,peso,unidades,valor_venta,valor_compra,personal,suma_flete) 
                            VALUES 
                                (
                                    $id_solicitud,
                                    " . $tramos[$i]["id_remitente_destinatario"] . ",
                                    '" . $tramos[$i]["fecha_hora_tramo"] . "',
                                    '" . $tramos[$i]["tipo_tramo"] . "',
                                    '" . $tramos[$i]["peso_tramo"] . "',
                                    '" . $tramos[$i]["unidades_tramo"] . "',
                                    '" . $tramos[$i]["valor_venta_tramo"] . "',
                                    '" . $tramos[$i]["valor_compra_tramo"] . "',
                                    '" . $tramos[$i]["personal"] . "',
                                    '" . $tramos[$i]["sumaflete"] . "'
                                )
                        ";
                        $crear_tramo = $conexion->prepare($sql);
                        $resulttramo = $crear_tramo->execute();
                    }

                    // Se inserta el material del tramo 
                    for ($j = 0; $j < count($mercancia[$i]["mercancia"]); $j++) {
                        if ($mercancia[$i]["mercancia"][$j]["unidades"] > 0) {
                            $sql = " 
                                INSERT INTO 
                                    cmx_tramo_material ( id_tramo, id_material, id_material_proyecto, unidades, peso, peso_pendiente, valor_declarado, tipo_movilizacion ) 
                                VALUES 
                                    (   
                                        (SELECT MAX(id) FROM cmx_tramo_solicitud), 
                                        " . $mercancia[$i]["mercancia"][$j]["id"] . " , 
                                        " . $mercancia[$i]["mercancia"][$j]["id_material_proyecto"] . " , 
                                        " . $mercancia[$i]["mercancia"][$j]["unidades"] . " , 
                                        " . $mercancia[$i]["mercancia"][$j]["peso_total"] . " , 
                                        " . $mercancia[$i]["mercancia"][$j]["peso_total"] . " , 
                                        " . $mercancia[$i]["mercancia"][$j]["valor_declarado"] . " , 
                                        '" . $mercancia[$i]["mercancia"][$j]["tipo_movilizacion"] . "' 
                                    )
                            ";
                            $crear_material_tramo = $conexion->prepare($sql);
                            $result_material_tramo = $crear_material_tramo->execute();
                        }

                        // Se busca la informacion de las actividades del material para su gestion en proyectos
                        $sql = "
							SELECT 
								cia.*
							FROM 
								cmx_integracion_soluc_import cisi
								INNER JOIN cmx_importacion_actividades cia ON cia.id = cisi.id_importacion_actividad
								INNER JOIN cmx_importacion_material cim ON cim.id = cia.id_material
								INNER JOIN cmx_mercancia_solicitud cms ON cms.id_material_proyecto = cim.id
							WHERE 
								cisi.id_solucion = " . $id_solicitud . "
								AND cms.id = " . $mercancia[$i]["mercancia"][$j]["id"] . "
								AND cia.estado = 2;
                        ";

                        $busca_actividad = $conexion->prepare($sql);
                        $busca_actividad->execute();
                        while ($datos_actividad = $busca_actividad->fetch()) {
                            $id_actividades .= $datos_actividad["id"] . ",";
                            $id_material_proyecto .= $datos_actividad["id_material"] . ",";

                            $actividades["id_importacion"] = $datos_actividad["id_importacion"];
                            $actividades["orden"] = $datos_actividad["orden"];
                            $actividades["tipo_actividad"] = $datos_actividad["tipo_actividad"];
                            $actividades["fecha_hora_inicio"] = $datos_actividad["fecha_hora_inicio"];
                            $actividades["costo_real"] = $datos_actividad["costo_real"];
                            $actividades["respuesta"] = $datos_actividad["respuesta"];
                        }
                        $actividades["id"] = $id_actividades;
                        $actividades["id_material"] = $id_material_proyecto;
                    }
                }
            }
            $sql = " DELETE FROM cmx_servicio_adicional_tramo WHERE id_solicitud = $id_solicitud ";
            $borrar_adicionales = $conexion->prepare($sql);
            $result = $borrar_adicionales->execute();

            for ($i = 0; $i < count($adicionales); $i++) {
                if ($adicionales[$i]["tipo_servicio"] == "Transporte") {
                    $sql = " 
                        INSERT INTO 
                            cmx_servicio_adicional_tramo (id_solicitud, tipo_servicio, valor_venta,valor_compra) 
                        VALUES 
                            ($id_solicitud,'" . $adicionales[$i]["tipo_servicio"] . "','" . $adicionales[$i]["valor_venta"] . "','" . $adicionales[$i]["valor_compra"] . "')
                    ";
                    $crearservicio = $conexion->prepare($sql);
                    $resultadicionales = $crearservicio->execute();
                } else {
                    if ($adicionales[$i]["id_proveedor"] != "") {
                        $sql = " 
                            INSERT INTO 
                                cmx_servicio_adicional_tramo (id_solicitud, tipo_servicio, valor_venta,valor_compra,id_proveedor) 
                            VALUES 
                                ($id_solicitud,'" . $adicionales[$i]["tipo_servicio"] . "','" . $adicionales[$i]["valor_venta"] . "','" . $adicionales[$i]["valor_compra"] . "','" . $adicionales[$i]["id_proveedor"] . "')
                        ";
                    } else {
                        $sql = " 
                            INSERT INTO 
                                cmx_servicio_adicional_tramo (id_solicitud, tipo_servicio, valor_venta,valor_compra) 
                            VALUES 
                                ($id_solicitud,'" . $adicionales[$i]["tipo_servicio"] . "','" . $adicionales[$i]["valor_venta"] . "','" . $adicionales[$i]["valor_compra"] . "')
                        ";
                    }

                    $crearservicio = $conexion->prepare($sql);
                    $resultadicionales = $crearservicio->execute();
                }
            }

            $return["success"] = true;
            $return["content"] = $tramos;
            $return["actividades"] = $actividades;
        } else {
            $return['success'] = false;
            $return['error'] = "Error al editar la solicitud";
        }
        return $return;
    }

    public function editarSolicitud_1()
    {
        $_msg_error = '';
        $time = date('Y-m-d H:i:s', time());
        $id_usuario = $_SESSION["usuario"]["id_usuario"];
        $Data = new Consultas;

        if (isset($_POST["cmx_solicitudes"])) {
            $solicitud = $_POST["cmx_solicitudes"];
            $id_solicitud = $solicitud["id_solicitud"];

            // Se actualiza la solicitud
            $array = array();
            // $array["peso_pendiente"] = (float)$solicitud["peso_pendiente"];
            $array["estado"] = $solicitud["estado"];
            if (isset($solicitud["numero_bl"]) and $solicitud["numero_bl"]) {
                $array["numero_bl"] = (int)$solicitud["numero_bl"];
            }
            if ($solicitud["tipo_vehiculo"]) {
                $array["tipo_vehiculo"] = (int)$solicitud["tipo_vehiculo"];
            }
            if ($solicitud["tipo_carroceria"]) {
                $array["tipo_carroceria"] = (int)$solicitud["tipo_carroceria"];
            }

            // Se pregunta si se actualiza la solicitud
            if ($Data->updateRegistro("cmx_solicitudes", $array, (int)$id_solicitud)) {
                // Se crea el servicio adicional del transporte 
                $array = array();
                $array["id_solicitud"] = $id_solicitud;
                $array["id_servicio"] = 24;
                $array["valor_venta"] = (int)str_replace(",", ".", str_replace(".", "", $solicitud["valor_venta"]));
                $array["valor_compra"] = (int)str_replace(",", ".", str_replace(".", "", $solicitud["valor_compra"]));
                $Data->setRegistro("cmx_servicio_adicional_tramo", $array);

                // Se actualiza el tipo de movilizacion del material
                if (isset($_POST["cmx_mercancia_solicitud"]) and $_POST["cmx_mercancia_solicitud"]) {
                    $tipo_movilizacion = $_POST["cmx_mercancia_solicitud"];
                    foreach ($tipo_movilizacion as $key => $value) {
                        $array = array();
                        $array["tipo_movilizacion"] = $value["tipo_movilizacion"];
                        $Data->updateRegistro("cmx_mercancia_solicitud", $array, (int)$value["id"]);
                    }
                }

                // Se crean los tramos de la solicitud
                if (isset($_POST["cmx_tramo_solicitud"])) {
                    $tramos = $_POST["cmx_tramo_solicitud"];

                    foreach ($tramos as $key => $value) {
                        $array = array();
                        $array["id_solicitud"] = $id_solicitud;
                        $array["id_remitente_destinatario"] = $value["id_remitente_destinatario"];
                        $array["fecha_hora_operacion"] = $value["fecha_hora_operacion"];
                        $array["tipo_operacion"] = $value["tipo_operacion"];
                        $array["peso"] = $value["peso"];
                        $array["unidades"] = $value["unidades"];
                        $array["valor_venta"] = $value["valor_venta"];
                        $array["valor_compra"] = $value["valor_compra"];
                        $array["personal"] = $value["personal"];
                        $array["suma_flete"] = $value["suma_flete"];
                        $id_tramo = $Data->setRegistro("cmx_tramo_solicitud", $array);

                        // Se adiciona el material del tramo
                        if (isset($value["cmx_tramo_material"]) and $value["cmx_tramo_material"]) {
                            foreach ($value["cmx_tramo_material"] as $key_01 => $value_01) {
                                $array = array();
                                $array["id_tramo"] = $id_tramo;
                                $array["id_material"] = $value_01["id_material"];
                                $array["id_material_proyecto"] = $value_01["id_material_proyecto"];
                                $array["unidades"] = $value_01["unidades"];
                                $array["peso"] = $value_01["peso"];
                                $array["peso_pendiente"] = $value_01["peso_pendiente"];
                                $array["valor_declarado"] = $value_01["valor_declarado"];
                                $array["tipo_movilizacion"] = $value_01["tipo_movilizacion"];
                                $Data->setRegistro("cmx_tramo_material", $array);
                            }
                        }
                    }
                }

                // Se adiciona los servicios adicionales de la solicitud
                if (isset($_POST["cmx_servicio_adicional"]) and $_POST["cmx_servicio_adicional"]) {
                    $adicionales = $_POST["cmx_servicio_adicional"];
                    $this->adicionarCostos($Data, $adicionales, $id_solicitud);
                }

                // Se guarda el registro del usuario que gestiona la actividad 
                $array = array();
                $array["id_solicitud"] = $id_solicitud;
                $array["id_usuario"] = $id_usuario;
                $array["operacion"] = "Editar";
                $array["fecha_hora_operacion"] = $time;
                $Data->setRegistro("cmx_usuario_solicitud", $array);

                // Se busca la informacion de las actividades del material para su gestion en proyectos
                $sql = "
					SELECT 
						cia.*
					FROM 
						cmx_integracion_soluc_import cisi
						INNER JOIN cmx_importacion_actividades cia ON cia.id = cisi.id_importacion_actividad
						INNER JOIN cmx_importacion_material cim ON cim.id = cia.id_material
						INNER JOIN cmx_mercancia_solicitud cms ON cms.id_material_proyecto = cim.id
					WHERE 
						cisi.id_solucion = " . $id_solicitud . "
						AND cia.estado = 2;
				";
                $result = $Data->getConsulta($sql);

                if ($result) {
                    $id_actividades = "";
                    $id_material_proyecto = "";
                    $array = array();
                    foreach ($result["rowsData"] as $key => $value) {
                        $id_actividades .= $value["id"] . ",";
                        $id_material_proyecto .= $value["id_material"] . ",";

                        $array["id_importacion"] = $value["id_importacion"];
                        $array["orden"] = $value["orden"];
                        $array["tipo_actividad"] = $value["tipo_actividad"];
                        $array["fecha_hora_inicio"] = $value["fecha_hora_inicio"];
                        $array["costo_real"] = $value["costo_real"];
                        $array["respuesta"] = $value["respuesta"];
                    }
                    $array["id"] = $id_actividades;
                    $array["id_material"] = $id_material_proyecto;
                }
                $return["actividades"] = $array;
            } else {
                $_msg_error .= '<p>Error al actualizar el registro de la solicitud.</p>';
            }
        }

        if ($_msg_error) {
            $return["error"] = $_msg_error;
        }
        return $return;
    }

    public function crea_costo()
    {
        $Data = new Consultas;
        $this->adicionarCostos($Data, $_POST["cmx_servicio_adicional"], $_POST["id_solicitud"]);
    }

    private function adicionarCostos($Data, $adicionales, $id_solicitud)
    {
        foreach ($adicionales as $key => $value) {
            $array = array();
            $array["id_solicitud"] = $id_solicitud;
            $array["id_servicio"] = $value["id_servicio"];
            $array["valor_venta"] = (int)str_replace(",", ".", str_replace(".", "", $value["valor_venta"]));
            $array["valor_compra"] = (int)str_replace(",", ".", str_replace(".", "", $value["valor_compra"]));
            if (isset($value["id_proveedor"]) and $value["id_proveedor"]) {
                $array["id_proveedor"] = $value["id_proveedor"];
            }
            if (isset($value["id_tramo"]) and $value["id_tramo"]) {
                $array["id_tramo"] = $value["id_tramo"];
            }
            if ($value["sobrecosto"] == "1") {
                $array["sobrecosto"] = 1;
            }
            $Data->setRegistro("cmx_servicio_adicional_tramo", $array);
        }
    }

    public function cancelarSolicitud()
    {
        $id_solicitud = $_POST["id_solicitud"];
        $razon_cancelacion = $_POST["razon_cancelacion"];
        $id_usuario = $_SESSION["usuario"]["id_usuario"];
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "UPDATE cmx_solicitudes SET 
                    razon_cancelacion = :razon_cancelacion,
                    estado = 'Cancelada'  
                    WHERE id = $id_solicitud ";
        $actualizar_solicitud = $conexion->prepare($sql);
        $actualizar_solicitud->bindParam(':razon_cancelacion', $razon_cancelacion, PDO::PARAM_STR);
        $result = $actualizar_solicitud->execute();
        if ($result) {
            $sql      = " INSERT INTO cmx_usuario_solicitud (id_solicitud, id_usuario, operacion, fecha_hora_operacion) VALUES ($id_solicitud,$id_usuario,'Cancelar','" . date('Y-m-d H:i:s', time()) . "') ";
            $crear_oper_sol = $conexion->prepare($sql);
            $result = $crear_oper_sol->execute();
            $return['success'] = true;
            $return["content"] = $sql;
        } else {
            $return['success'] = false;
            $return['error'] = "Error al generar la solicitud";
        }
        return $return;
    }

    public function buscartramossolicitud()
    {
        $id_solicitud = $_POST["id_solicitud"];
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "    SELECT cts.*,cr.nombre as 'nombre_remitente',cd.nombre as 'nombre_destinatario'
          FROM cmx_tramo_solicitud cts,cmx_solicitudes cs, cmx_remitente cr,cmx_destinatario cd
          WHERE cts.id_solicitud = cs.id 
          AND cs.id = $id_solicitud 
          AND cd.id= cts.id_destinatario 
          AND cr.id= cts.id_remitente ";
        $b_tra_solict = $conexion->prepare($sql);
        $b_tra_solict->execute();
        $total         = $b_tra_solict->rowCount();

        if ($b_tra_solict) {
            if ($total > 0) {
                $return['success'] = true;
                while ($datos_tramo = $b_tra_solict->fetch()) {
                    $return["content"] = $datos_tramo;
                }
            } else {
                $return['success'] = false;
                $return['error'] = "No hay datos";
                $return['content'] = "<div class='row' >
                            <div class='col-sm-1'></div>
                            <div class='col-sm-10'>
                                <div  class='table-responsive noSwipe'>
                                    <table id='table1' class='table table-striped table-hover'>
                                        <thead>
                                            <tr class='nexos-encabezado'>
                                                <th style='width:10%;'>#</th>
                                                <th>Remitente</th>
                                                <th>Destinatario</th>
                                                <th>Contacto</th>
                                                <th>Operacion</th>
                                                <th>Fecha hora</th>
                                                <th>Peso</th>
                                                <th>Unidades</th>
                                                <th style='width:10%;min-width: 10%;'</th>
                                            </tr>
                                        </thead>
                                        <tbody >

                                        <td style='text-align:center 'colspan= '9'>No hay tramos para esta solicitud</td>

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>";
            }
        } else {
            $return['success'] = false;
            $return['error'] = "Error al generar la solicitud";
        }
        return $return;
    }

    public function cargarremitente()
    {
        $id_cliente = $_POST["id_cliente"];

        // Se crea filtro de la consulta 
        $filtro = "";
        if (isset($_POST["id_ciudad"])) {
            $sql = '
				SELECT 
					cm.depto
				FROM 
					cmx_municipios cm
				WHERE
					cm.id = ' . $_POST["id_ciudad"] . '
            ';
            $model    = new Conexion;
            $conexion = $model->conectar();
            $consulta = $conexion->prepare($sql);
            $consulta->execute();

            while ($datos_region = $consulta->fetch()) {
                $region = $datos_region[0];
            }
            $filtro = ' AND cm.depto = "' . $region . '" ';
        }
        $sql = "
			SELECT 
				DISTINCT(crd.nombre) 
			FROM 
				cmx_remitente_destinatario crd
				INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
			WHERE 
				crd.id_cliente IN (1, $id_cliente)
				AND crd.rndc_id IS NOT NULL
				AND crd.rndc_id != ''
				AND crd.estado = 1 
				$filtro
		";
        $model    = new Conexion;
        $conexion = $model->conectar();
        $consulta = $conexion->prepare($sql);
        $consulta->execute();
        $total         = $consulta->rowCount();
        if ($total == 0) {
            $return["success"] = false;
        } else {
            $return["success"] = true;
            while ($datos_remitente = $consulta->fetch()) {
                $return["content"][] = $datos_remitente;
            }
        }
        return $return;
    }

    public function obtenerdatosremitente()
    {
        $nombre_remitente = $_POST["nombre_remitente"];
        $id_cliente = $_POST["id_cliente"];

        $sql = "
            SELECT 
                crd.id, crd.nombre, crd.direccion, crd.contacto,
                cm.id ID_CIUDAD, CONCAT(cm.municipio,' - (',cm.depto,' - ',cm.pais,')') CIUDAD
            FROM 
                cmx_remitente_destinatario crd
                INNER JOIN cmx_municipios cm ON crd.id_ciudad = cm.id
            WHERE 
                crd.nombre = '$nombre_remitente' 
                AND crd.id_cliente IN (1, $id_cliente)
            LIMIT 1;
        ";
        $model    = new Conexion;
        $conexion = $model->conectar();
        $consulta = $conexion->prepare($sql);
        $consulta->execute();
        $total         = $consulta->rowCount();
        if ($total == 0) {
            $return["success"] = false;
        } else {
            $return["success"] = true;
            $return["content"] = $consulta->fetch();
        }
        return $return;
    }

    public function agregarTramoSolicitud()
    {
        $id_cliente = $_POST["id_cliente"];
        $cantidad_vehiculos = $_POST["cantidad_vehiculos"];
        $origen = $_POST["origen"];
        $destino = $_POST["destino"];
        $tipo_vehiculo = $_POST["tipo_vehiculo"];
        $tipo_carroceria = $_POST["tipo_carroceria"];
        $tipo_servicio = $_POST["tipo_servicio"];
        $tipo_operacion = $_POST["tipo_operacion"];
        $peso_total = $_POST["peso_total"];
        $unidades_totales = $_POST["unidades_totales"];
        $tipo_mercancia = $_POST["tipo_mercancia"];
        $numero_contenedor = $_POST["numero_contenedor"];
        $valor_declarado = $_POST["valor_declarado"];
        $id_usuario = $_SESSION["usuario"]["id_usuario"];
        $numero_solicitud = time();
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = " INSERT INTO cmx_solicitudes (id_cliente,numero_solicitud,cantidad_vehiculos,origen,destino,tipo_vehiculo,tipo_carroceria,tipo_servicio,tipo_operacion,peso_total,unidades_totales,tipo_mercancia,numero_contenedor,valor_declarado,fecha_solicitud,id_usuario,estado) VALUES ($cliente,'$numero_solicitud','$cantidad_vehiculos','$origen','$destino','$tipo_vehiculo','$tipo_carroceria','$tipo_servicio','$tipo_operacion','$peso_total','$unidades_totales','$tipo_mercancia','$numero_contenedor','$valor_declarado','" . date('Y-m-d H:i:s', time()) . "','$id_usuario','Activa')";
        $crear_solicitud = $conexion->prepare($sql);
        $result = $crear_solicitud->execute();
        if ($result) {
            $return['success'] = true;
        } else {
            $return['success'] = false;
            $return['error'] = "Error al generar la solicitud";
        }
        return $return;
    }

    public function cargarsolicitudesvehiculos()
    {
        $id_solicitud = $_POST["id_solicitud"];
        $sql = "SELECT csv.*,cv.placa,cs.tipo_vehiculo
                FROM cmx_solicitud_vehiculos csv, cmx_vehiculos cv,cmx_solicitudes cs
                WHERE csv.id_solicitud = $id_solicitud 
                AND cs.id = csv.id_solicitud 
                AND cv.id = csv.id_vehiculo";
        $model    = new Conexion;
        $conexion = $model->conectar();
        $consulta = $conexion->prepare($sql);
        $consulta->execute();
        $total         = $consulta->rowCount();
        if ($total == 0) {
            $return["success"] = false;
        } else {
            $return["success"] = true;
            while ($datos_solicitudes_vehiculos = $consulta->fetch()) {
                $return["content"][] = $datos_solicitudes_vehiculos;
            }
        }
        return $return;
    }

    public function cargarvehiculos()
    {
        $id_solicitud = $_POST["id_solicitud"];
        $sql = "SELECT cv.placa FROM cmx_vehiculos cv, cmx_solicitudes cs WHERE
            cs.id = $id_solicitud 
            AND cs.tipo_vehiculo= cv.tipo_vehiculo AND cv.estado= 'Activo' ";
        $model    = new Conexion;
        $conexion = $model->conectar();
        $consulta = $conexion->prepare($sql);
        $consulta->execute();
        $total         = $consulta->rowCount();
        if ($total == 0) {
            $sql = "SELECT cv.placa FROM cmx_vehiculos cv WHERE cv.estado= 'Activo'  ";
            $model    = new Conexion;
            $conexion = $model->conectar();
            $consulta_todos_vehic = $conexion->prepare($sql);
            $consulta_todos_vehic->execute();
            $todos_vehiculos         = $consulta_todos_vehic->rowCount();
            if ($todos_vehiculos == 0) {
                $return["success"] = false;
            } else {
                $return["success"] = true;
                while ($datos_todos_vehi = $consulta_todos_vehic->fetch()) {
                    $return["content"][] = $datos_todos_vehi;
                }
            }
        } else {
            $return["success"] = true;
            while ($datos_vehiculos = $consulta->fetch()) {
                $return["content"][] = $datos_vehiculos;
            }
        }
        return $return;
    }

    public function obtenerdatosvehiculo()
    {
        $placa = $_POST["placa"];
        $sql = "SELECT * FROM cmx_vehiculos 
                WHERE placa = '$placa' 
                LIMIT 1 ";
        $model    = new Conexion;
        $conexion = $model->conectar();
        $consulta = $conexion->prepare($sql);
        $consulta->execute();
        $total         = $consulta->rowCount();
        if ($total == 0) {
            $return["success"] = false;
        } else {
            $return["success"] = true;
            $return["content"] = $consulta->fetch();
        }
        return $return;
    }

    public function crearsolicitudVehiculo()
    {
        $id_solicitud = $_POST["id_solicitud"];
        $flete = $_POST["flete"];
        $id_vehiculo = $_POST["id_vehiculo"];
        $estado = $_POST["estado"];
        $calificacion = $_POST["calificacion"];
        $pendientes = $_POST["pendientes"];
        $cedula_tenedor = $_POST["cedula_tenedor"];
        $nombre_tenedor = $_POST["nombre_tenedor"];
        $cedula_conductor = $_POST["cedula_conductor"];
        $nombre_conductor = $_POST["nombre_conductor"];
        $referencias_empresariales = $_POST["referencias_empresariales"];
        $referencias_personales = $_POST["referencias_personales"];
        $id_usuario = $_SESSION["usuario"]["id_usuario"];
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = " INSERT INTO cmx_solicitud_vehiculos (id_solicitud,id_vehiculo,flete, fecha_postulacion,estado,calificacion,pendientes,cedula_tenedor,nombre_tenedor,nombre_conductor,cedula_conductor,referencias_empresariales,referencias_personales)
         VALUES ($id_solicitud,$id_vehiculo,'$flete','" . date('Y-m-d H:i:s', time()) . "','$estado','$calificacion','$pendientes','$cedula_tenedor','$nombre_tenedor','$nombre_conductor','$cedula_conductor','$referencias_empresariales','$referencias_personales')";
        $crear_solicitud = $conexion->prepare($sql);
        $result = $crear_solicitud->execute();
        $sql = "SELECT * FROM cmx_solicitudes 
                WHERE id = '$id_solicitud' 
                LIMIT 1 ";
        $model    = new Conexion;
        $conexion = $model->conectar();
        $consulta = $conexion->prepare($sql);
        $consulta->execute();
        $datos_solicitud = $consulta->fetch();
        $numero_solicitud = $datos_solicitud["numero_solicitud"];
        $sql = "SELECT max(id) as 'id' FROM cmx_solicitud_vehiculos WHERE id_solicitud = $id_solicitud  ";
        $consulta_solic_vehic = $conexion->prepare($sql);
        $consulta_solic_vehic->execute();
        $datos_solic_vehic = $consulta_solic_vehic->fetch();
        $numero_solic_vehic = $datos_solic_vehic["id"];
        $sql = "SELECT COUNT(*) AS 'total_asignaciones' FROM cmx_solicitud_vehiculos WHERE id_solicitud = $id_solicitud  ";
        $consulta_total_asig = $conexion->prepare($sql);
        $consulta_total_asig->execute();
        $total_asignaciones = $consulta_total_asig->fetch();
        $ruta = "../public/files/solicitudes/" . $numero_solicitud . "/" . $total_asignaciones["total_asignaciones"] . "/";
        $ruta_base = "public/files/solicitudes/" . $numero_solicitud . "/" . $total_asignaciones["total_asignaciones"] . "/";
        $sql = "UPDATE cmx_solicitud_vehiculos SET documentos_soporte = '$ruta_base' WHERE id = " . $datos_solic_vehic["id"] . "";
        $consulta_act_solic_vehic = $conexion->prepare($sql);
        $consulta_act_solic_vehic->execute();
        $sql      = " INSERT INTO cmx_log_solicitud_vehiculos (id_usuario,id_vehiculo,id_solicitud_vehiculos,operacion,fecha_hora_operacion) VALUES ($id_usuario,$id_vehiculo," . $datos_solic_vehic["id"] . ",'$estado','" . date('Y-m-d H:i:s', time()) . "')";
        $return["content"] = $sql;
        $crear_solicitud_vehiculos = $conexion->prepare($sql);
        $crear_solicitud_vehiculos->execute();
        if (!file_exists($ruta)) {
            mkdir($ruta, 0777, true);
        }
        for ($x = 0; $x < count($_FILES); $x++) {
            $file = $_FILES["documentos" . $x];
            $nombre = $file["name"];
            $tipo = $file["type"];
            $ruta_provisional = $file["tmp_name"];
            $carpeta = $ruta;
            $src = $carpeta . $nombre;
            move_uploaded_file($ruta_provisional, $src);
            //echo "<p style='color:red'>El archivo $nombre se ha subido correctamente";
        }
        $return["success"] = true;
        return $return;
    }

    public function editardatossolicitudvehiculos()
    {
        $id_solicitud_vehiculo = $_POST["id_solicitud_vehiculo"];
        $sql = "SELECT csv.*,cv.placa,cs.tipo_vehiculo
                FROM cmx_solicitud_vehiculos csv, cmx_vehiculos cv,cmx_solicitudes cs
                WHERE cs.id = csv.id_solicitud 
                AND cv.id = csv.id_vehiculo
                AND csv.id = $id_solicitud_vehiculo
                GROUP BY csv.id
                LIMIT 1 ";
        $model    = new Conexion;
        $conexion = $model->conectar();
        $consulta = $conexion->prepare($sql);
        $consulta->execute();
        $total         = $consulta->rowCount();
        if ($total == 0) {
            $return["success"] = false;
        } else {
            $return["success"] = true;
            $datos_asig = $consulta->fetch();
            $return["content"] = $datos_asig;
            $return["archivos"] = "<label>Archivos subidos</label><br>";
            $ficheros1  = scandir("../" . $return["content"]["documentos_soporte"]);
            for ($x = 2; $x < count($ficheros1); $x++) {
                $return["archivos"] .= "<a href='" . BASE_URL . $return["content"]["documentos_soporte"] . $ficheros1[$x] . "' target='_blank' >$ficheros1[$x]</a> <br>";
            }
        }
        return $return;
    }

    public function editarsolicitudVehiculo()
    {
        $id_solicitud = $_POST["id_solicitud"];
        $id_solicitud_vehiculo = $_POST["id_solicitud_vehiculo"];
        $flete = $_POST["flete"];
        $id_vehiculo = $_POST["id_vehiculo"];
        $estado = $_POST["estado"];
        $calificacion = $_POST["calificacion"];
        $pendientes = $_POST["pendientes"];
        $cedula_tenedor = $_POST["cedula_tenedor"];
        $nombre_tenedor = $_POST["nombre_tenedor"];
        $cedula_conductor = $_POST["cedula_conductor"];
        $nombre_conductor = $_POST["nombre_conductor"];
        $referencias_empresariales = $_POST["referencias_empresariales"];
        $referencias_personales = $_POST["referencias_personales"];
        $documentos_soporte = $_POST["documentos_soporte"];
        $id_usuario = $_SESSION["usuario"]["id_usuario"];
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = " UPDATE cmx_solicitud_vehiculos SET flete = '$flete', 
                    id_vehiculo = $id_vehiculo, estado = '$estado', 
                    calificacion = '$calificacion', 
                    pendientes = '$pendientes',
                    cedula_tenedor = '$cedula_conductor', 
                    nombre_tenedor = '$nombre_tenedor', 
                    cedula_conductor = '$cedula_conductor', 
                    nombre_conductor = '$nombre_conductor', 
                    referencias_empresariales = '$referencias_empresariales', 
                    referencias_personales = '$referencias_personales' 
                    WHERE id = $id_solicitud_vehiculo AND id_solicitud = $id_solicitud ";
        $crear_solicitud = $conexion->prepare($sql);
        $result = $crear_solicitud->execute();
        $sql      = " INSERT INTO cmx_log_solicitud_vehiculos (id_usuario,id_vehiculo,id_solicitud_vehiculos,operacion,fecha_hora_operacion) VALUES ($id_usuario,$id_vehiculo,$id_solicitud_vehiculo,'$estado','" . date('Y-m-d H:i:s', time()) . "')";
        $return["content"] = $sql;
        $crear_solicitud_vehiculos = $conexion->prepare($sql);
        $crear_solicitud_vehiculos->execute();
        $ruta = $documentos_soporte;
        if (!file_exists($ruta)) {
            mkdir($ruta, 0777, true);
        }
        for ($x = 0; $x < count($_FILES); $x++) {
            $file = $_FILES["documentos" . $x];
            $nombre = $file["name"];
            $tipo = $file["type"];
            $ruta_provisional = $file["tmp_name"];
            $carpeta = $ruta;
            $src = $carpeta . $nombre;
            move_uploaded_file($ruta_provisional, $src);
        }
        $return["success"] = true;
        return $return;
    }

    public function finalizarSolicitud()
    {
        $id_solicitud = $_POST["id_solicitud"];
        $id_usuario = $_SESSION["usuario"]["id_usuario"];
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "UPDATE cmx_solicitudes SET 
                    estado = 'Finalizada'  
                    WHERE id = $id_solicitud ";
        $actualizar_solicitud = $conexion->prepare($sql);
        $result = $actualizar_solicitud->execute();
        if ($result) {
            $sql      = " INSERT INTO cmx_usuario_solicitud (id_solicitud, id_usuario, operacion, fecha_hora_operacion) VALUES ($id_solicitud,$id_usuario,'Finalizar','" . date('Y-m-d H:i:s', time()) . "') ";
            $crear_oper_sol = $conexion->prepare($sql);
            $result = $crear_oper_sol->execute();
            $sql      = " SELECT * FROM cmx_integracion_soluc_import WHERE id_solucion = $id_solicitud ";
            $buscar_integracion = $conexion->prepare($sql);
            $buscar_integracion->execute();
            $total_integracion = $buscar_integracion->rowCount();
            if ($total_integracion > 0) {
                while ($datos_integracion = $buscar_integracion->fetch()) {
                    $sql      = "UPDATE cmx_importacion_actividades SET estado = 1 WHERE id = " . $datos_integracion["id_importacion_actividad"] . " ";
                    $actualizar_integracion = $conexion->prepare($sql);
                    $actualizar_integracion->execute();
                    $sql      = " SELECT * FROM cmx_importacion_actividades WHERE id = " . $datos_integracion["id_importacion_actividad"] . " ";
                    $buscar_import_activ = $conexion->prepare($sql);
                    $buscar_import_activ->execute();
                    $datos_import_activ = $buscar_import_activ->fetch();
                    $total_import_activ = $buscar_import_activ->rowCount();

                    if ($total_import_activ > 0) {
                        $sql      = "UPDATE cmx_importacion_actividades SET estado = 2, fecha_hora_inicio = '" . date('Y-m-d H:i:s', time()) . "'
                                     WHERE id_material = " . $datos_import_activ["id_material"] . " 
                                AND id_importacion = " . $datos_import_activ["id_importacion"] . " 
                                AND orden = " . (intval($datos_import_activ["orden"]) + 1) . " AND actividad_previa = '" . $datos_import_activ["orden"] . "' ";
                        $actualizar_integracion = $conexion->prepare($sql);
                        $actualizar_integracion->execute();
                    }
                }
                $return['success'] = true;
                $return["content"] = $sql;
            }
            $return['success'] = true;
            $return["content"] = $sql;
        } else {
            $return['success'] = false;
            $return['error'] = "Error al generar la solicitud";
        }
        return $return;
    }

    public function cargarprovedores()
    {
        $Data = new Consultas;

        $sql = "
            SELECT 
                CONCAT(cp.numero_documento,' - ',cp.nombre ) as 'nombre',
                cp.id,cp.numero_documento 
            FROM 
                cmx_proveedores cp
            WHERE 
                cp.estado = 'Activo'
        ";

        $array = $Data->getConsulta($sql);

        if (isset($array)) {
            $return["success"] = true;
            foreach ($array["rowsData"] as $key => $value) {
                $return["content"][] = $value;
            }
        } else {
            $return["success"] = false;
        }
        return $return;
    }

    public function obtenerdatosproveedor()
    {
        $numero_documento = $_POST["numero_documento"];
        $sql = "SELECT * FROM cmx_proveedores WHERE numero_documento = '$numero_documento' LIMIT 1";
        $model    = new Conexion;
        $conexion = $model->conectar();
        $consulta = $conexion->prepare($sql);
        $consulta->execute();
        $total         = $consulta->rowCount();
        if ($total == 0) {
            $return["success"] = false;
        } else {
            $return["success"] = true;
            $datos_proveedor = $consulta->fetch();
            $return["content"] = $datos_proveedor;
        }
        return $return;
    }

    public function cargartiposvehiculos()
    {
        $Data = new Consultas;
        $sql = "SELECT * FROM cmx_tipo_vehiculos ORDER BY nombre";
        $array = $Data->getConsulta($sql);

        if ($array) {
            $return["success"] = true;
            foreach ($array["rowsData"] as $key => $value) {
                $return["content"][] = $value;
            }
        } else {
            $return["success"] = false;
        }
        return $return;
    }

    public function obtenerdatosvehiculos()
    {
        $nombre = $_POST["nombre"];
        $sql = "SELECT * FROM cmx_tipo_vehiculos WHERE nombre = '$nombre' LIMIT 1";
        $model    = new Conexion;
        $conexion = $model->conectar();
        $consulta = $conexion->prepare($sql);
        $consulta->execute();
        $total         = $consulta->rowCount();
        if ($total == 0) {
            $return["success"] = false;
        } else {
            $return["success"] = true;
            $datos_proveedor = $consulta->fetch();
            $return["content"] = $datos_proveedor;
        }
        return $return;
    }

    public function cargartiposcarroceria()
    {
        $Data = new Consultas;
        $sql = "SELECT * FROM cmx_rndc_vehiculos_carroceria ORDER BY descripcion";
        $array = $Data->getConsulta($sql);

        if ($array) {
            $return["success"] = true;
            foreach ($array["rowsData"] as $key => $value) {
                $return["content"][] = $value;
            }
        } else {
            $return["success"] = false;
        }
        return $return;
    }

    public function obtenerdatoscarroceria()
    {
        $nombre = $_POST["nombre"];

        $Data = new Consultas;

        $sql = "SELECT * FROM cmx_rndc_vehiculos_carroceria WHERE descripcion = '$nombre' LIMIT 1";
        $array = $Data->getConsulta($sql);

        if ($array) {
            $return["success"] = true;
            foreach ($array["rowsData"] as $key => $value) {
                $return["content"] = $value;
            }
        } else {
            $return["success"] = false;
        }
        return $return;
    }

    public function cargarmunicipios()
    {
        $_filter = "";
        if (isset($_POST["id_ciudad"])) {
            $_filter = " WHERE id = " . $_POST["id_ciudad"] . " ";
        }
        $sql = "
            SELECT 
                id,
                CONCAT(municipio ,' - (',depto,' - ',pais,')') MUNICIPIO 
            FROM 
                cmx_municipios 
                " . $_filter . "
            LIMIT 2000;
        ";
        $model    = new Conexion;
        $conexion = $model->conectar();
        $consulta = $conexion->prepare($sql);
        $consulta->execute();
        $total = $consulta->rowCount();
        $return["content"] = array();

        if ($total == 0) {
            $return["success"] = false;
        } else {
            $return["success"] = true;
            while ($datos_municipio = $consulta->fetch()) {
                $return["content"][] = $datos_municipio;
            }
        }
        return $return;
    }

    public function obtenerdatosmunicipio()
    {
        $municipio = $_POST["ciudad"];
        $departamento = $_POST["departamento"];
        $sql = "
            SELECT 
                *
            FROM 
                cmx_municipios 
            WHERE 
                municipio = '$municipio'
                AND depto = '$departamento'
                ;
        ";
        $model    = new Conexion;
        $conexion = $model->conectar();
        $consulta = $conexion->prepare($sql);
        $consulta->execute();
        $total = $consulta->rowCount();
        $return["content"] = array();

        if ($total == 0) {
            $return["success"] = false;
        } else {
            $return["success"] = true;
            while ($datos_municipio = $consulta->fetch()) {
                $return["content"][] = $datos_municipio;
            }
        }
        return $return;
    }

    public function verSolicitudesDeAgrupamiento()
    {
        $return["control"] = "Entro en la accion verSolicitudesDeAgrupamiento.\n";
        $return["title"] = "Datos Agrupamiento # " . $_POST["agrupamiento"];
        $return["content"] = "";

        $Data = new Consultas;
        // Se consulta la información del agrupamiento
        $sql = '
            SELECT 
                ca.*, cas.tipo_vehiculo, ctv.nombre, ctv.peso_maximo,
                SUM(csat.valor_compra) valor_compra,
                SUM(csat.valor_venta) valor_venta,
                COUNT( DISTINCT(cas.id_solicitud) ) CANT_SOLICITUDES
            FROM 
                cmx_agrupaciones ca
                INNER JOIN cmx_agrupacion_solicitudes cas ON ca.id = cas.id_agrupacion
                INNER JOIN cmx_servicio_adicional_tramo csat ON csat.id_solicitud = cas.id_solicitud
                INNER JOIN cmx_tipo_vehiculos ctv ON ctv.id = cas.tipo_vehiculo
            WHERE 
                ca.estado = 2
                AND ca.id = ' . $_POST["id"] . '
            GROUP BY cas.id_agrupacion DESC
            ORDER BY ca.codigo_rojo DESC, ca.fecha_hora_operacion ASC;
        ';
        $result_agrupacion = $Data->getConsulta($sql);

        // Se busca las solicitudes asociadas al agrupamiento 
        $sql = '
            SELECT 
                DISTINCT( cs.id ) ID_SOLICITUD, cs.numero_solicitud, cc.nombre NOMBRE_CLIENTE, 
                cip.numero_importacion, cip.importacion, cip.tipo_operacion, ctc.nombre TIPO_CARGA,
                if(cs.tipo_vehiculo,
                (
                    SELECT 
                        ctv1.nombre
                    FROM 
                        cmx_tipo_vehiculos ctv1
                    WHERE 
                        ctv1.id = cs.tipo_vehiculo
                ),
                "NO PROPUESTO") TIPO_VEHICULO,
                if(cs.tipo_vehiculo,
                (
                    SELECT 
                        ctv1.peso_maximo
                    FROM 
                        cmx_tipo_vehiculos ctv1
                    WHERE
                        ctv1.id = cs.tipo_vehiculo
                ),
                "N/A") PESO_VEHICULO
            FROM 
                cmx_agrupacion_solicitudes cas
                INNER JOIN cmx_solicitudes cs ON cs.id = cas.id_solicitud
                INNER JOIN cmx_clientes cc ON cc.id = cs.id_cliente
                INNER JOIN cmx_integracion_soluc_import cisi ON cisi.id_solucion = cs.id
                INNER JOIN cmx_importacion_actividades cia ON cia.id = cisi.id_importacion_actividad
                INNER JOIN cmx_importacion_proyecto cip ON cip.id = cia.id_importacion
                INNER JOIN cmx_tipo_carga ctc ON ctc.id = cip.id_tipo_carga
            WHERE 
                cas.id_agrupacion = ' . $_POST["id"] . '
        ';
        $result_solicitudes = $Data->getConsulta($sql);

        if ($result_solicitudes) {
            foreach ($result_solicitudes["rowsData"] as $key => $value) {

                // SE BUSCA SI LA SOLICITUD TIENE SERVICIOS ADICIONALES
                $sql = '
                    SELECT 
                        *
                    FROM 
                        cmx_servicio_adicional_tramo csat
                        INNER JOIN cmx_proveedores cp ON cp.id = csat.id_proveedor
                    WHERE 
                        csat.id_proveedor IS NOT NULL
                        AND csat.id_solicitud = ' . $value[0] . '
                ;';
                $result_adicionales = $Data->getConsulta($sql);

                $_table_adicionales = "";
                if ($result_adicionales) {
                    $_table_adicionales .= '
                        <strong>Servicios Adicionales</strong>
                        <table class="table">
                            <thead>
                                <tr>
                                  <th>Servicio</th>
                                  <th>Valor Venta</th>
                                  <th>Valor Compra</th>
                                  <th>Proveedor</th>
                                </tr>
                            </thead>
                            <tbody>
                    ';

                    foreach ($result_adicionales["rowsData"] as $key_1 => $value_1) {
                        $_table_adicionales .= '
                            <tr>
                                <td class="cell-detail">
                                    <span>' . $value_1["tipo_servicio"] . '</span>
                                </td>
                                <td class="cell-detail text-right">
                                    <span>$ ' . number_format($value_1["valor_venta"], 2, ",", ".") . '</span>
                                </td>
                                <td class="cell-detail text-right">
                                    <span>$ ' . number_format($value_1["valor_compra"], 2, ",", ".") . '</span>
                                </td>
                                <td class="cell-detail">
                                    ' . $value_1["nombre"] . '
                                </td>
                            </tr>
                        ';
                    }

                    $_table_adicionales .= '
                                <tr><td></td><td></td><td></td><td></td></tr>
                            </tbody>
                        </table>
                    ';
                }

                // SE BUSCA EL MATERIAL DE LA SOLICITUD
                $sql = '
                    SELECT 
                        cms.*, cim.cantidad, cim.peso_bruto, cim.valor_declarado VLR_DECLARADO
                    FROM 
                        cmx_agrupacion_solicitudes cas
                        INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = cas.id_agrupacion
                        INNER JOIN cmx_importacion_material cim ON cim.id = cam.id_material_proyecto
                        INNER JOIN cmx_mercancia_solicitud cms ON cms.id_solicitud = cas.id_solicitud AND cms.id = cam.id_material
                        INNER JOIN cmx_importacion_material cim1 ON cim1.id = cms.id_material_proyecto
                    WHERE 
                        cas.id_solicitud = ' . $value[0] . '
                        AND cas.id_agrupacion = ' . $_POST["id"] . '
                ;';
                $result_materiales = $Data->getConsulta($sql);

                if ($result_materiales) {
                    $_table_materiales = '
                        <strong>Material Solicitud</strong>
                        <table class="table">
                            <thead>
                                <tr>
                                  <th>Material</th>
                                  <th>Código UN</th>
                                  <th>Peso</th>
                                  <th>Cantidad</th>
                                  <th>Valor Declarado</th>
                                  <th>Tipo Movilización</th>
                                </tr>
                            </thead>
                            <tbody>
                    ';

                    foreach ($result_materiales["rowsData"] as $key_1 => $value_1) {
                        $_table_materiales .= '
                            <tr>
                                <td class="cell-detail">
                                    <span>' . $value_1["tipo_mercancia"] . '</span>
                                </td>
                                <td class="cell-detail text-center">
                                    <span>' . $value_1["codigo_UN"] . '</span>
                                </td>
                                <td class="cell-detail text-right">
                                    <span>' . number_format($value_1["peso_bruto"], 2, ",", ".") . ' Kg</span>
                                </td>
                                <td class="cell-detail text-center">
                                    ' . $value_1["cantidad"] . '
                                </td>
                                <td class="cell-detail text-right">
                                    <span>$ ' . number_format($value_1["valor_declarado"], 0, ",", ".") . '</span>
                                </td>
                                <td class="cell-detail">
                                    ' . $value_1["tipo_movilizacion"] . '
                                </td>
                            </tr>
                        ';
                    }

                    $_table_materiales .= '
                                <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                            </tbody>
                        </table>
                    ';
                }

                // SE BUSCAN LOS TRAMOS DE LA SOLICITUD
                $sql = '
                    SELECT 
                        cts.*,
                        crd.nombre,
                        CONCAT(cm.municipio," (",cm.depto," - ",cm.pais,")") CIUDAD     
                    FROM 
                        cmx_solicitudes cs
                        INNER JOIN cmx_tramo_solicitud cts ON cts.id_solicitud = cs.id
                        INNER JOIN cmx_remitente_destinatario crd ON crd.id = cts.id_remitente_destinatario
                        INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
                    WHERE
                        cs.id = ' . $value[0] . '
                ;';
                $result_tramos = $Data->getConsulta($sql);

                if ($result_tramos) {
                    $_table_tramos = '
                        <strong>Tramos Solicitud</strong>
                        <table class="table">
                            <thead>
                                <tr>
                                  <th>Operación</th>
                                  <th>Remitente/Destinatario</th>
                                  <th>Fecha Hora Movilización</th>
                                  <th>Peso</th>
                                  <th>Cantidad</th>
                                  <th>Valor Venta</th>
                                  <th>Valor Compra</th>
                                  <th>Personal</th>
                                </tr>
                            </thead>
                            <tbody>
                    ';

                    foreach ($result_tramos["rowsData"] as $key_2 => $value_2) {
                        $_personal = "NO";
                        if ($value_2["personal"] == "1") {
                            $_personal = "SI";
                        }

                        $_table_tramos .= '
                            <tr>
                                <td class="cell-detail">
                                    <span>' . $value_2["tipo_operacion"] . '</span>
                                </td>
                                <td class="cell-detail">
                                    <span>' . $value_2["nombre"] . '</span>
                                    <span class="cell-detail-description">' . $value_2["CIUDAD"] . '</span>
                                </td>
                                <td class="cell-detail">
                                    <span>' . $value_2["fecha_hora_operacion"] . '</span>
                                </td>
                                <td class="cell-detail text-right">
                                    <span>' . number_format($value_2["peso"], 2, ",", ".") . ' Kg</span>
                                </td>
                                <td class="cell-detail text-center">
                                    <span>' . $value_2["unidades"] . '</span>
                                </td>
                                <td class="cell-detail text-right">
                                    <span>$ ' . number_format($value_2["valor_venta"], 0, ",", ".") . '</span>
                                </td>
                                <td class="cell-detail text-right">
                                    <span>$ ' . number_format($value_2["valor_compra"], 0, ",", ".") . '</span>
                                </td>
                                <td class="cell-detail text-center">
                                    <span>' . $_personal . '</span>
                                </td>
                            </tr>
                        ';
                    }

                    $_table_tramos .= '
                                <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                            </tbody>
                        </table>
                    ';
                }

                $_peso_vehiculo = "";
                if ($value["PESO_VEHICULO"] != "N/A") {
                    $_peso_vehiculo = number_format($value["PESO_VEHICULO"], 2, ",", ".") . " Kg";
                }

                // Se asigna el contenido del popup
                $return["content"] .= '
                    <div class="panel panel-border panel-contrast">
                        <div class="panel-heading panel-heading-contrast">
                            Solicitud # ' . $value["numero_solicitud"] . '
                            <span class="panel-subtitle"></span>
                        </div>
                        <div class="panel-body">
                            <strong>Información Solicitud</strong>
                            <table class="table">
                                <tbody>
                                    <tr>
                                        <td class="cell-detail">
                                            <div class="row">
                                                <div class="col-sm-3">
                                                    <span>Cliente</span>
                                                    <span class="cell-detail-description">' . $value["NOMBRE_CLIENTE"] . '</span>
                                                </div>
                                                <div class="col-sm-3">
                                                    <span>Tipo Operación</span>
                                                    <span class="cell-detail-description">' . $value["tipo_operacion"] . '</span>
                                                </div>
                                                <div class="col-sm-3">
                                                    <span># Orden</span>
                                                    <span class="cell-detail-description">' . $value["importacion"] . '</span>
                                                </div>
                                                <div class="col-sm-3">
                                                    <span># Importación</span>
                                                    <span class="cell-detail-description">' . $value["numero_importacion"] . '</span>
                                                </div>
                                                <div class="row"></div><br>
                                                <div class="col-sm-3">
                                                    <span>Tipo Vehículo</span>
                                                    <span class="cell-detail-description">' . $value["TIPO_VEHICULO"] . '</span>
                                                    <span class="cell-detail-description">' . $_peso_vehiculo . '</span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr><td></td></tr>
                                </tbody>
                            </table>
                            ' . $_table_adicionales . '
                            ' . $_table_materiales . '
                            ' . $_table_tramos . '
                        </div>
                    </div>
                ';
            }
        } else {
            $return["content"] .= '
                <h3 class="text-danger">No se encontró información de solicitudes para el agrupamiento ' . $_POST["agrupamiento"] . '</h3>
            ';
        }
        return $return;
    }
}
