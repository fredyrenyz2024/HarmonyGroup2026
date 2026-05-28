<?php

include "../application/Config.php";

include '../application/Conexion.php';

include '../application/Model.php';

// $Prefiltro = new servicioclienteModel;

$Data = new Consultas;
// $conexion = new Conexion;

$facil = new Conexion;

session_start();

switch ($_REQUEST['action']) {

    //tabla de cotizaciones de CLIENTES

    case 'consulta_datos_remitente':

        $idremite = $_POST["idremite"];
        $sql = "SELECT rd.direccion, celular, m.municipio, m.depto ,
        rd.descripcion_actividad, m.id as id_municipio,
        rd.estado_actualizacion_rndc, LENGTH(rd.nombre) AS long_name,
        LENGTH(rd.direccion) AS long_address, LENGTH(rd.celular) AS long_cel
        FROM cmx_remitente_destinatario rd
        INNER JOIN cmx_municipios m ON rd.id_ciudad=m.id
        WHERE rd.id=" . $idremite;

        $result = $Data->getConsulta($sql);

        $return["result"] = $result["rowsData"];
        break;

    case 'traer_numero_bloque':

        $num_cotizacion = $_POST["num_cotizacion"];

        $sql = "SELECT MAX(item) AS cantidad_actual

		FROM cmx_detalle_mercancia2	WHERE n_cotizacion=" . $num_cotizacion;

        $result = $Data->getConsulta($sql);

        $return["result"] = $result["rowsData"];

        break;

    case 'traer_tipo_empaque':

        $sql = "SELECT * FROM cmx_para_tipo_empaque";

        $result = $Data->getConsulta($sql);

        $return["result"] = $result["rowsData"];

        break;

    case 'tipo_cont':
        $sql = "SELECT id,nombre FROM cmx_tipo_contenedor";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'traer_agencia':

        $sql = "SELECT  * FROM cmx_agencias

				WHERE estado='Activo'   ";

        $result = $Data->getConsulta($sql);

        $return["result"] = $result["rowsData"];

        break;

    case 'num_cotizacion':

        $sql = "SELECT max(n_cotizacion)+1 AS nco FROM cmx_cotizaciones_serviciocliente";

        $result = $Data->getConsulta($sql);

        $return["result"] = $result["rowsData"][0]['nco'];

        break;

    case 'num_solicitud':

        $sql = "SELECT max(id) AS nco

			FROM cmx_solicitud_vehiculo2";

        $result = $Data->getConsulta($sql);

        $return["result"] = $result["rowsData"][0]['nco'];

        break;

    case 'Guardar_puntoentrega':

        $solicitud_servicio1 = $_POST["solicitud_servicio1"];
        $id_punto = $_POST["idpuntrem"];
        $mentrega = $_POST["mentrega"];
        $dire = $_POST["dire"];
        $cliente = $_POST["clientea"];
        $fentrega = $_POST["fentrega"];
        $obs = $_POST["obs"];
        $hora_estimada = $_POST["hora"];
        $tipo = $_POST["tipo"];
        $orden = $_POST["orden"];
        $pun = $_POST["pun"];
        $user = $_SESSION["usuario"]["nom_usuario"];
        $hora = date('H:i:s');
        $fecha = date('Y-m-d');
        $telefono = $_POST["telefono"];
        $peso = $_POST["peso"];
        $sitio = $_POST["sitio"];

        $sql = "INSERT INTO cmx_ruta_puntosentrega (id,cod_ini_ruta,municipio_entrega,direccion_entrega,cliente,fecha_estimada_entrega,observacion,fecha,hora,usuario,hora_estimada,tipo,orden,telefono,peso,lugar,id_punto)
				VALUES(null,'$solicitud_servicio1','$mentrega','$dire', '$cliente','$fentrega','$obs','$fecha','$hora','$user','$hora_estimada','$tipo','$orden','$telefono','$peso','$sitio','$id_punto')";
        $result = $Data->ejecuteRegistro($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        // var_dump($result["rowsData"]);
        // exit();


        break;

    // case 'Registrar_Destinatarios':

    //     $insertdesti = json_decode($_POST['datos_destinatario']);
    //     $numero_solicita = $_POST["num_servicio"];
    //     $nFilas = $_POST["nFilas"];
    //     $user = $_SESSION["usuario"]["nom_usuario"];
    //     $hora = date('H:i:s');
    //     $fecha = date('Y-m-d');

    //     for ($z = 0; $z < $nFilas; $z++) {
    //         $idpunto = $insertdesti->idrem[$z];
    //         $desti = $insertdesti->destinatario[$z];
    //         $ciu = $insertdesti->ciudad[$z];
    //         $direcci = $insertdesti->direccion[$z];
    //         $tel = $insertdesti->telefono[$z];
    //         $fech = $insertdesti->fecha[$z];

    //         $peso = $insertdesti->pesobruto[$z];
    //         $lugar = $insertdesti->lugar[$z];
    //         $horades = $insertdesti->hora[$z];
    //         $observacion = $insertdesti->observacion[$z];
    //         $estado_destinatario = 'PENDIENTE';

    //         $sql = "INSERT INTO cmx_destinatarios_ss(solicitud_servicio,municipio_entrega,direccion_entrega,cliente,fecha_estimada_entrega,observacion,fecha,hora,usuario,hora_estimada,tipo,orden,telefono,peso,lugar,id_punto,estado_destinatario)
    //     	VALUES('$numero_solicita','$ciu','$direcci','$desti','$fech','$observacion','$fecha','$hora','$user','$horades','punto entrega','0','$tel','$peso','$lugar','$idpunto','$estado_destinatario')";
    //         $result = $Data->ejecuteRegistro($sql);
    //         print_r($sql);
    //     }
    //     exit(0);

    //     if ($result > 1) {
    //         $return["result"] = $result["rowsData"];
    //     } else {
    //         $return["result"] = $result;
    //     }

    //     break;

    case 'Registrar_Destinatarios':

        $insertdesti = json_decode($_POST['datos_destinatario']);
        $numero_solicita = $_POST["num_servicio"];
        $nFilas = $_POST["nFilas"];
        $user = $_SESSION["usuario"]["nom_usuario"];
        $hora = date('H:i:s');
        $fecha = date('Y-m-d');

        for ($z = 0; $z < $nFilas; $z++) {
            $idpunto = $insertdesti->idrem[$z];
            $desti = $insertdesti->destinatario[$z];
            $ciu = $insertdesti->ciudad[$z];
            $direcci = $insertdesti->direccion[$z];
            $tel = $insertdesti->telefono[$z];
            $fech = $insertdesti->fecha[$z];
            $peso = $insertdesti->pesobruto[$z];
            $lugar = $insertdesti->lugar[$z];
            $horades = $insertdesti->hora[$z];
            $observacion = $insertdesti->observacion[$z];
            $estado_destinatario = 'PENDIENTE';

            $sql = "INSERT INTO cmx_destinatarios_ss(
                        solicitud_servicio,
                        municipio_entrega,
                        direccion_entrega,
                        cliente,
                        fecha_estimada_entrega,
                        observacion,
                        fecha,
                        hora,
                        usuario,
                        hora_estimada,
                        tipo,
                        orden,
                        telefono,
                        peso,
                        lugar,
                        id_punto,
                        estado_destinatario
                    ) VALUES (
                        '$numero_solicita',
                        '$ciu',
                        '$direcci',
                        '$desti',
                        '$fech',
                        '$observacion',
                        '$fecha',
                        '$hora',
                        '$user',
                        '$horades',
                        'punto entrega',
                        '0',
                        '$tel',
                        '$peso',
                        '$lugar',
                        '$idpunto',
                        '$estado_destinatario'
                    )";

            try {
                $result = $Data->ejecuteRegistro($sql);
                if ($result === false) {
                    throw new Exception($Data->getLastError()); // Suponiendo que tienes un método para obtener el último error
                }
                // print_r($sql); // Para depuración, imprime la consulta SQL
            } catch (mysqli_sql_exception $e) {
                echo "Error en la consulta SQL: " . $e->getMessage();
                // Opcional: registrar el error en un archivo de log
                error_log("Error en la consulta SQL: " . $e->getMessage() . "\nConsulta: " . $sql);
            } catch (Exception $e) {
                echo "Error al ejecutar la consulta: " . $e->getMessage();
                error_log("Error al ejecutar la consulta: " . $e->getMessage() . "\nConsulta: " . $sql);
            }
        }
        // exit(0);

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        break;


    case 'consultar_solicitud_servicio':

        $idsolicitud = $_POST["idsolicitud"];

        $sql = "SELECT se.*,

			CONCAT(a.municipio,'-',a.depto) AS origenes,

			CONCAT(b.municipio,'-',b.depto) AS destinos,

			cli.documento AS doc_cliente

			FROM cmx_solicitud_vehiculo2 se

			INNER JOIN cmx_municipios a ON se.origen=a.rndc_codigo_ciudad

			INNER JOIN cmx_municipios b ON se.destino=b.rndc_codigo_ciudad

			INNER JOIN cmx_clientes cli ON se.nombre_cliente=cli.nombre

			WHERE se.nundoc_solicitud=" . $idsolicitud . "";

        $result = $Data->getConsulta($sql);

        // $return["result"] = $result["rowsData"];
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        $sql2 = "SELECT a.*, rd.nombre

			FROM cmx_ruta_puntosentrega a

			INNER JOIN cmx_remitente_destinatario rd ON a.cliente=rd.id

				WHERE a.cod_ini_ruta=" . $idsolicitud . "";

        $result2 = $Data->getConsulta($sql2);

        if ($result2) {

            $sqlm = "SELECT * FROM cmx_municipios";

            $resultm = $Data->getConsulta($sqlm);

            $sqlc = "SELECT * FROM cmx_clientes WHERE estado=1";

            $resultc = $Data->getConsulta($sqlc);

            $array_muni = array();

            $array_cliente = array();

            $array_destinata = array();

            foreach ($resultm["rowsData"] as $index => $element) {

                if (strcasecmp($element['id'], $result2["rowsData"][0]['municipio_entrega']) == 0) {

                    $array_muni[$index]['selected'] = true;
                } else {

                    $array_muni[$index]['selected'] = false;
                }

                $array_muni[$index]['numerito'] = $element['id'];

                $array_muni[$index]['muni'] = $element['municipio'];
            }

            $result2["rowsData"][0]['municipio_entregita'] = $array_muni;

            foreach ($resultc["rowsData"] as $index => $element) {

                if (strcasecmp($element['id'], $result2["rowsData"][0]['cliente']) == 0) {

                    $array_cliente[$index]['selected'] = true;
                } else {

                    $array_cliente[$index]['selected'] = false;
                }

                $array_cliente[$index]['id'] = $element['id'];

                $array_cliente[$index]['nombre'] = $element['nombre'];
            }

            $result2["rowsData"][0]['clienten'] = $array_cliente;
        }

        // $return["result2"] = $result2["rowsData"];
        if ($result2 > 1) {
            $return["result2"] = $result2["rowsData"];
        } else {
            $return["result2"] = $result2;
        }

        $sql3 = "SELECT a.*, g.nombre_grupo FROM  cmx_grupocliente_servicio a

			INNER JOIN cmx_grupo g

			ON a.id_grupo=g.id

			WHERE a.id_servicio=" . $idsolicitud . "";

        $result3 = $Data->getConsulta($sql3);

        // $return["result3"] = $result3["rowsData"];
        if ($result3 > 1) {
            $return["result3"] = $result3["rowsData"];
        } else {
            $return["result3"] = $result3;
        }

        break;

    case 'elininar_puntoentrega':

        $codigo = $_POST["codigo"];

        $sql = "DELETE FROM cmx_ruta_puntosentrega

		 	 WHERE id=" . $codigo . "";

        $result = $Data->ejecuteRegistro($sql);

        // $return["result"] = $result["rowsData"];
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        break;

    case 'buscar_cotizacion':

        $estado = $_REQUEST["estado"];

        $idcliente = $_REQUEST["idcliente"];

        $inicia = $_REQUEST["fi"];

        $fina = $_REQUEST["ff"];

        $sql = "

			SELECT C.* FROM cmx_cotizaciones_serviciocliente C

			INNER JOIN cmx_estados_cotizacion E

			ON C.n_cotizacion=E.n_cotizacion

			INNER JOIN cmx_clientes CL

			ON C.nombre_cliente=CL.nombre

			WHERE  CL.id=" . $idcliente . "

			AND C.fecha_creacion

			BETWEEN '" . $inicia . "' AND '" . $fina . "';

		";

        //echo $sql;

        $result = $Data->getConsulta($sql);

        // $return["result"] = $result["rowsData"];
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        break;

    //traer solicitudes

    case 'tabla_solicitudes':

        $id = $_POST['id'];

        $sql = "SELECT a.id, b.id AS parejaod, a.*, b.tipo_servicio_mer,

						b.origen,

						b.destino, b.peso_neto_kg, b.tipo_vehiculo, b.flete,

						b.item, b.tipo_carga, b.tipo_transporte, b.cant_vehiculo, b.cant_gastar,

						soli.idpareja_origen_destino, soli.id AS soliid,

						soli.estado, b.tipo_mercancia, a.id_cliente, b.tipo_transporte

						FROM cmx_cotizaciones_serviciocliente a

						INNER JOIN cmx_detalle_mercancia2 b

						ON a.n_cotizacion=b.n_cotizacion

						LEFT JOIN cmx_solicitud_vehiculo2 soli

						ON b.id=soli.idpareja_origen_destino

						AND soli.estado IN('Pendiente', 'Realizada','En_subasta','asignada','en_tramite','aprobado_prefiltro')

						WHERE a.n_cotizacion=" . $id . " AND

							a.estado_autorizado='autorizado'

							AND a.estado='F3'";

        $result = $Data->getConsulta($sql);

        // $return["result"] = $result["rowsData"];
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        break;

    //TRAER FLETE PARA INSERTAR COTIZACION

    case 'consulte_movimientos':

        $id = $_REQUEST["idcotizar"];

        $idpareja = $_REQUEST["idpareja"];

        $idsolicitud = $_REQUEST["idsolicitud"];

        //movimiento de atencion al cliente

        $sql = 'SELECT s.n_cotizacion, s.fecha, s.hora,s.estado,s.usuario_auditor,s.proceso,m.n_cotizacion, m.id AS pareja,m.item
				FROM cmx_solicitud_vehiculo2 s
				INNER JOIN cmx_detalle_mercancia2 m ON s.idpareja_origen_destino=m.id
				WHERE s.n_cotizacion=' . $id . ' AND s.idpareja_origen_destino=' . $idpareja . '
			';

        $result = $Data->getConsulta($sql);

        $sql2 = 'SELECT a.n_cotizacion, a.fecha, a.hora, a.usuario_auditor,b.estado FROM cmx_solicitud_vehiculo2 a
				INNER JOIN cmx_log_solicitudvehiculo b ON a.id=b.id_solictud
				WHERE a.id=' . $idsolicitud . ' ';
        $result2 = $Data->getConsulta($sql2);

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        if ($result2 > 1) {
            $return["result2"] = $result2["rowsData"];
        } else {
            $return["result2"] = $result2;
        }
        break;

    case 'traer_flete':
        //PASAR LOS ORIGEN DESTINO VEHICULO  A NUMERO NO A LETRA
        $ori = $_REQUEST["origen"];
        $des = $_REQUEST["destino"];
        $vehiculo = $_REQUEST["vehiculo"];

        $sql4 = "SELECT * FROM cmx_fletes_nacional WHERE origen = '" . $ori . "' AND destino = '" . $des . "' AND tipo_vehiculo = '" . $vehiculo . "' AND estado=1";
        $result = $Data->getConsulta($sql4);
        if ($result) {
            $return["result"] = $result["rowsData"];
        }
        break;

    case 'historico_cotizacion':

        $id = $_REQUEST["ncotizar"];

        $sql = 'SELECT e.*, m.id AS pareja, m.item, m.proceso, m.tipo_mercancia FROM cmx_estados_cotizacion e
				INNER JOIN cmx_detalle_mercancia2 m ON e.n_cotizacion=m.n_cotizacion
				WHERE e.n_cotizacion=' . $id . ' ORDER BY e.fecha , e.hora DESC';

        $result = $Data->getConsulta($sql);

        if ($result) {
            $sql2 = 'SELECT * FROM cmx_respuestas_cotizaciones WHERE idcotizacion=' . $id;
            $result2 = $Data->getConsulta($sql2);
            if ($result > 1) {
                $return["result"] = $result["rowsData"];
            } else {
                $return["result"] = $result;
            }
        }

        if ($result2 > 1) {
            $return["result2"] = $result2["rowsData"];
        } else {
            $return["result2"] = $result2;
        }
        break;

    case 'traer_estado':

        $num = $_REQUEST["num_cotizacion"];

        $sql = 'SELECT estado, estado_autorizado FROM cmx_cotizaciones_serviciocliente cab
				WHERE cab.n_cotizacion= ' . $num . '';

        $result = $Data->getConsulta($sql);

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        break;
    //TRAER DATOS PARA EL MODAL EDITAR QUE SI SE VA A ACTUALIZAR CO
    //TRAER DATOS PARA FORMULARIO DE INSERTAR COTIZACIONES
    //select Tipos de servicio especial

    case 'traer_especial':
        $sql = 'SELECT * FROM cmx_para_tipo_sevicio WHERE tipificacion="Especial" AND estado="activo"';
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'traer_costo':
        $servicio = $_REQUEST["servicio"];
        // $sql = "SELECT costo FROM cmx_para_tipo_sevicio WHERE nombre='" . $servicio . "'";
        $sql = "SELECT
                pt.id AS proveedor_id,
                pt.razon_social
            FROM
                cmx_para_tipo_sevicio ts
                INNER JOIN cmx_detalle_servicio_especial ds ON ts.id = ds.servicio_id
                INNER JOIN cmx_proveedor_torre_control pt ON ts.proveedor_id = pt.id
                AND tipo_proveedor = 'Proveedor servicio especial'
            WHERE
                nombre = '" . $servicio . "'
            GROUP BY
                pt.id";
        $result = $Data->getConsulta($sql);

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }


        break;

    case 'traer_costo_proveedor':
        $proveedor = $_REQUEST["proveedor"];
        $ciudad = $_REQUEST["ciudad"];

        // $sql = "SELECT costo FROM cmx_para_tipo_sevicio WHERE nombre='" . $servicio . "'";
        
        $sql = "SELECT
            ds.costo
            FROM
                cmx_para_tipo_sevicio ts
                INNER JOIN cmx_detalle_servicio_especial ds ON ts.id = ds.servicio_id
                INNER JOIN cmx_proveedor_torre_control pt ON ts.proveedor_id = pt.id
                AND tipo_proveedor = 'Proveedor servicio especial'
            WHERE
                ts.proveedor_id = .$proveedor.
                AND ds.ciudad='" . $ciudad . "'
            GROUP BY
                pt.id";
        $result = $Data->getConsulta($sql);

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }


        break;

    //select de tipos de vehiculo CREAR cotizacion

    case 'traer_tipos':

        $sql = 'SELECT * FROM cmx_para_tipo_vehiculo WHERE estado="activo"';

        $result = $Data->getConsulta($sql);

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }


        break;

    //select de municipios de origen y destino CREAR COTIZACION

    case 'traer_municipios':

        $sql = 'SELECT * FROM cmx_municipios WHERE estado_nacional="Activa"';

        $result = $Data->getConsulta($sql);

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }


        break;

    case 'cont_muncipio':

        $sql = 'SELECT * FROM cmx_municipios';

        $result = $Data->getConsulta($sql);

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }


        break;

    //select de tipo mercancia CREAR COTIZACION

    case 'traer_tipo_mercancia':

        $sql = 'SELECT b.nombre, a.codigo, a.partida,b.id

						FROM cmx_rndc_codificacion_producto a

						INNER JOIN cmx_para_tipo_mercancia b ON a.id=b.id_producto_mn

						WHERE b.estado="Activo"

						ORDER BY b.nombre ASC';

        $result = $Data->getConsulta($sql);

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }


        break;

    case 'traer_naturaleza':

        $id = $_POST["id_mercancia"];

        $sql = "SELECT b.tipo

			FROM cmx_para_tipo_mercancia a

			INNER JOIN cmx_rndc_codificacion_producto b

			ON a.id_producto_mn=b.id

			WHERE a.id=" . $id;

        $result = $Data->getConsulta($sql);

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }


        break;

    //actualizar cotización NO EDITAR

    case 'update_cotizacion':

        $cotizacion = $_REQUEST["n_coti"];

        $estado = $_REQUEST["estado"];

        $total_cotizacion = $_REQUEST["total_cotizacion"];

        $tottarifa = $_REQUEST["tottarifa"];

        $totflete = $_REQUEST["totflete"];

        $totutil = $_REQUEST["totutil"];

        $totren = $_REQUEST["totren"];

        $contador = $_POST["contador"];

        $estado_autorizacion = $_POST["estado_autorizacion"];

        $merca = json_decode($_POST["dato_bloque"]);

        if ($estado_autorizacion == 'autorizado') {

            if ($estado == "F5") { //cancelada

                $sql = 'UPDATE cmx_cotizaciones_serviciocliente

				SET estado="' . $estado . '",

				total_cotizacion="' . $total_cotizacion . '",

				total_transporte="' . $tottarifa . '",

				tmer_flete="' . $totflete . '",

				tmer_utili="' . $totren . '",

				tmer_rent="' . $totutil . '"

				WHERE n_cotizacion="' . $cotizacion . '"';

                $result = $Data->ejecuteRegistro($sql);

                $contador = ($contador - 1);
            }

            if ($estado == "F2") { //entregada

                $sql = 'UPDATE cmx_cotizaciones_serviciocliente

				SET estado="' . $estado . '",

				total_cotizacion="' . $total_cotizacion . '",

				total_transporte="' . $tottarifa . '",

				tmer_flete="' . $totflete . '",

				tmer_utili="' . $totren . '",

				tmer_rent="' . $totutil . '"

				WHERE n_cotizacion="' . $cotizacion . '"';

                $result = $Data->ejecuteRegistro($sql);
            }

            if ($estado == "F3") { //ganada

                $sql = 'UPDATE cmx_cotizaciones_serviciocliente

				SET estado="' . $estado . '",

				total_cotizacion="' . $total_cotizacion . '",

				total_transporte="' . $tottarifa . '",

				tmer_flete="' . $totflete . '",

				tmer_utili="' . $totren . '",

				tmer_rent="' . $totutil . '"

				WHERE n_cotizacion="' . $cotizacion . '"';

                $result = $Data->ejecuteRegistro($sql);
            }

            if ($estado == "F4") { //perdida

                $sql = 'UPDATE cmx_cotizaciones_serviciocliente

				SET estado="' . $estado . '",

				total_cotizacion="' . $total_cotizacion . '",

				total_transporte="' . $tottarifa . '",

				tmer_flete="' . $totflete . '",

				tmer_utili="' . $totren . '",

				tmer_rent="' . $totutil . '"

				WHERE n_cotizacion="' . $cotizacion . '"';

                $result = $Data->ejecuteRegistro($sql);
            }
        }

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }


        break;

    //insertar en el registro de estados NO EDITAR cotizacion

    case 'insert_estado_cotizacion':
        $cotizacion = $_REQUEST["n_coti_in"];
        $estado = $_REQUEST["estado_in"];
        $user = $_REQUEST["user"];
        $estado_autorizado = $_REQUEST["estado_autorizado"];
        $fecha = date('Y-m-d');
        $hora = date('G:i:s');
        $sql = 'INSERT INTO cmx_estados_cotizacion (id,n_cotizacion,estado,estado_autorizado,hora,fecha,user_log)
						VALUES (null,' . $cotizacion . ', "' . $estado . '", "' . $estado_autorizado . '", "' . $hora . '", "' . $fecha . '", "' . $user . '")';
        $result = $Data->ejecuteRegistro($sql);

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    //solicitar un vehoculo prefiltro serviciocliente

    case 'solicitud_vehiculo':

        $fecha_reg = date('Y-m-d');
        $hora_reg = date('G:i:s');
        $user = $_SESSION["usuario"]["nom_usuario"];
        $cotizacion = $_REQUEST["numero"];

        $estado = $_REQUEST["estado"];

        $tipo_veh = $_REQUEST["tipo_veh"];

        $ori = $_REQUEST["ori"];

        $dest = $_REQUEST["dest"];

        $peso = $_REQUEST["peso"];

        $flete = $_REQUEST["flete"];

        $cliente = $_REQUEST["cliente"];

        $pareja = $_REQUEST["pareja"];

        $observacion = $_REQUEST["observacion"];

        $agencia = $_REQUEST["agencia"];

        $cant_solicitada = $_REQUEST["cant_solicitada"];

        $cant_disponible = $_REQUEST["cant_disponible"];

        if (isset($_REQUEST["cont_opcion"])) {
            $cont_opcion = $_REQUEST["cont_opcion"];
        } else {
            $cont_opcion = '';
        }

        if (isset($_REQUEST["cont_dias"]) && !empty($_REQUEST["cont_dias"])) {
            $cont_dias = $_REQUEST["cont_dias"];
        } else {
            $cont_dias = date('Y-m-d');
        }

        if (isset($_REQUEST["cont_municipio"]) && !empty($_REQUEST["cont_municipio"])) {
            $cont_municipio = $_REQUEST["cont_municipio"];
        } else {
            $cont_municipio = 0;
        }

        if (isset($_REQUEST["cont_direccion"]) && !empty($_REQUEST["cont_direccion"])) {
            $cont_direccion = $_REQUEST["cont_direccion"];
        } else {
            $cont_direccion = '';
        }

        if (isset($_REQUEST["cont_tipo"]) && !empty($_REQUEST["cont_tipo"])) {
            $cont_tipo = $_REQUEST["cont_tipo"];
        } else {
            $cont_tipo = 0;
        }

        if (isset($_REQUEST["cont_num"]) && !empty($_REQUEST["cont_num"])) {
            $cont_num = $_REQUEST["cont_num"];
        } else {
            $cont_num = '';
        }

        if (isset($_REQUEST["cont_comodato"]) && !empty($_REQUEST["cont_comodato"])) {

            $cont_comodato = $_REQUEST["cont_comodato"];
        } else {
            $cont_comodato = date('Y-m-d');
        }

        if (isset($_REQUEST["cont_peso"]) && !empty($_REQUEST["cont_peso"])) {
            $cont_peso = $_REQUEST["cont_peso"];
        } else {
            $cont_peso = 0;
        }


        $conexion = $facil->conectar();
        $sql = $conexion->prepare("INSERT INTO cmx_solicitud_vehiculo2(id,n_cotizacion,fecha,hora,estado,usuario_auditor,origen,destino,peso_kg,nombre_cliente,tipo_vehiculo,flete,idpareja_origen_destino,observaciones,proceso,agencia,devol_contenedor,devol_dias,devol_municipio,devol_direccion,devol_tipocont,devol_numcont,devol_comodato,cant_vehiculo,cant_disponible,devol_pesovacio)
        VALUES(:id,:cotizacion,:fecha_reg,:hora_reg,:estado,:user,:ori,:dest,:peso,:cliente,:tipo_veh,:flete,:pareja,:observacion,:estado_pen,:agencia,:cont_opcion,:cont_dias,:cont_municipio,:cont_direccion,:cont_tipo,:cont_num,:cont_comodato,:cant_solicitada,:cant_disponible,:cont_peso)")
            ->execute(array(':id' => null, ':cotizacion' => $cotizacion, ':fecha_reg' => $fecha_reg, ':hora_reg' => $hora_reg, ':estado' => $estado, ':user' => $user, ':ori' => $ori, ':dest' => $dest, ':peso' => $peso, ':cliente' => $cliente, ':tipo_veh' => $tipo_veh, ':flete' => $flete, ':pareja' => $pareja, ':observacion' => $observacion, ':estado_pen' => 'Pen-Sol-PreS', ':agencia' => $agencia, ':cont_opcion' => $cont_opcion, ':cont_dias' => $cont_dias, ':cont_municipio' => $cont_municipio, ':cont_direccion' => $cont_direccion, ':cont_tipo' => $cont_tipo, ':cont_num' => $cont_num, ':cont_comodato' => $cont_comodato, ':cant_solicitada' => $cant_solicitada, ':cant_disponible' => $cant_disponible, ':cont_peso' => $cont_peso));
        if ($sql) {
            //actualizar estado negocio
            $sql2 = "UPDATE cmx_detalle_mercancia2 SET proceso='Rea-Sol-Ser' WHERE id=" . $pareja . " ";
            $Data->ejecuteRegistro($sql2);

            $sqlf = "SELECT max(id) as ids FROM cmx_solicitud_vehiculo2";
            $result = $Data->getConsulta($sqlf);
            $id_servicio = $result["rowsData"][0]['ids'];
            //insertar grupo de clientes seleccionado
            $grupo = $_POST["grupo"]; //Array
            for ($i = 0; $i < count($grupo); $i++) {
                $gseleccionado = $grupo[$i];
                $sqlg = "INSERT INTO cmx_grupocliente_servicio (id,id_grupo,id_servicio)
        						VALUES(null," . $gseleccionado . "," . $id_servicio . ")";
                $Data->ejecuteRegistro($sqlg);
            }

            //insertar horas
            $horacliente = $_POST["horacliente"];
            for ($m = 0; $m < count($horacliente); $m++) {
                $mseleccionado = $horacliente[$m];
                $sqlm = "INSERT INTO cmx_horacliente_servicio
        				(id,hora_email,id_servicio,usuario,fecha,hora)VALUES(null,'" . $mseleccionado . "'," . $id_servicio . ",'" . $user . "','" . $fecha_reg . "','" . $hora_reg . "')";
                $Data->ejecuteRegistro($sqlm);
            }
        }
        $return["result"] = $sql;
        break;

    //consultar cotizaciones aprobadas que se convertiran en solictudes de servicio- servicio cliente

    case 'consulte_aprobacion':
        $num_cotizacion = $_REQUEST['doc'];
        $fecha_inicia = $_REQUEST['fecha_inicia'];
        $fecha_final = $_REQUEST['fecha_final'];
        $sql = 'SELECT  a.id, b.id AS parejaod, a.*, b.tipo_servicio_mer, b.origen,
					b.destino, b.peso_neto_kg, b.tipo_vehiculo,
					b.flete, b.item, b.tipo_carga, b.tipo_transporte,b.tipo_mercancia,  soli.idpareja_origen_destino,
					soli.id AS soliid, soli.fecha,soli.hora, soli.estado, soli.estado_secundario
					FROM cmx_cotizaciones_serviciocliente a
					INNER JOIN cmx_detalle_mercancia2 b ON a.n_cotizacion=b.n_cotizacion
					INNER JOIN cmx_solicitud_vehiculo2 AS soli ON b.id=soli.idpareja_origen_destino
					WHERE soli.fecha BETWEEN "' . $fecha_inicia . '" AND "' . $fecha_final . '"
					AND a.estado_autorizado="autorizado" AND a.estado="F3"
					ORDER BY soli.fecha, soli.hora DESC';
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'municipiostable':

        $origen = $_REQUEST['origes'];

        $destino = $_REQUEST['destinos'];

        $cotizacion = $_REQUEST['cotizar'];

        $sql = 'SELECT CONCAT(municipio,"-",depto) AS origi

					FROM cmx_detalle_mercancia2 a

					INNER JOIN cmx_municipios b

					ON a.origen=b.rndc_codigo_ciudad

					WHERE b.rndc_codigo_ciudad=' . $origen . '

					AND a.n_cotizacion=' . $cotizacion . '  ';

        $result = $Data->getConsulta($sql);

        $sql2 = 'SELECT CONCAT(municipio,"-",depto) AS desti

					FROM cmx_detalle_mercancia2 a

					INNER JOIN cmx_municipios b

					ON a.destino=b.rndc_codigo_ciudad

					WHERE b.rndc_codigo_ciudad=' . $destino . '

					AND a.n_cotizacion=' . $cotizacion . '  ';

        $result1 = $Data->getConsulta($sql2);

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }


        // $return["result1"] = $result1["rowsData"];
        if ($result1 > 1) {
            $return["result1"] = $result1["rowsData"];
        } else {
            $return["result1"] = $result1;
        }

        break;

    //TRAER ORIGEN Y DESTINO VER COTIZACION - cotizaciones aprobadas

    case 'muni_cotizacion':

        $origen = $_REQUEST['origen'];

        $destino = $_REQUEST['destino'];

        $cotizacion = $_REQUEST['cotizacion'];

        $sql = 'SELECT CONCAT(municipio,"-",depto) AS origi

					FROM cmx_detalle_mercancia2 a

					INNER JOIN cmx_municipios b

					ON a.origen=b.rndc_codigo_ciudad

					WHERE b.rndc_codigo_ciudad=' . $origen . '

					AND a.n_cotizacion=' . $cotizacion . '  ';

        $result = $Data->getConsulta($sql);

        $sql2 = 'SELECT CONCAT(municipio,"-",depto) AS desti

					FROM cmx_detalle_mercancia2 a

					INNER JOIN cmx_municipios b

					ON a.destino=b.rndc_codigo_ciudad

					WHERE b.rndc_codigo_ciudad=' . $destino . '

					AND a.n_cotizacion=' . $cotizacion . '  ';

        $result1 = $Data->getConsulta($sql2);

        // $return["result"] = $result["rowsData"];

        // $return["result1"] = $result1["rowsData"];

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }


        // $return["result1"] = $result1["rowsData"];
        if ($result1 > 1) {
            $return["result1"] = $result1["rowsData"];
        } else {
            $return["result1"] = $result1;
        }


        break;

    //------------------------------EDITAR COTIZACION

    //traer datos para las nuevas filas agregadas del editar

    case 'agregar_select_editar':

        //select tipo servicio

        $sql = 'SELECT * FROM cmx_para_tipo_sevicio

					WHERE tipificacion="Mercancia"';

        $result = $Data->getConsulta($sql);

        //select origen y destino

        // $return["result"] = $result["rowsData"];

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        break;

    //consultar datos para editar la cotizacion , de los que ya estan

    case 'consulte':

        $num_cotizacion = $_REQUEST['cotizar'];

        $sql = '

					SELECT * FROM cmx_cotizaciones_serviciocliente cab

					WHERE cab.n_cotizacion= ' . $num_cotizacion . '

				';

        $result = $Data->getConsulta($sql);

        $sql1 = '

					SELECT * FROM cmx_para_procedencia_cotizacion;

					';

        $resultSelect = $Data->getConsulta($sql1);

        $sql2 = '

					SELECT * from cmx_para_tipo_mercancia;

				';

        $resultmerca = $Data->getConsulta($sql2);

        $tmpSelector = array();

        $arreglo_merca = array();

        foreach ($resultSelect["rowsData"] as $index => $element) {

            //tipo de procedencia

            if (strcasecmp($element['nombre'], $result["rowsData"][0]['procedencia_cotizacion']) == 0) {

                $tmpSelector[$index]['selected'] = true;
            } else {

                $tmpSelector[$index]['selected'] = false;
            }

            $tmpSelector[$index]['nombre'] = $element['nombre'];
        }

        $result["rowsData"][0]['procedencia_cotizacion'] = $tmpSelector;

        foreach ($resultmerca["rowsData"] as $index => $element) {

            //tipo de mercancia dato adicional

            if (strcasecmp($element['nombre'], $result["rowsData"][0]['tipo_mercancia']) == 0) {

                $arreglo_merca[$index]['selected'] = true;
            } else {

                $arreglo_merca[$index]['selected'] = false;
            }

            $arreglo_merca[$index]['adicional'] = $element['nombre'];
        }

        $result["rowsData"][0]['tipo_mercancia'] = $arreglo_merca;

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        break;

    case 'consultem':

        $num_cotizacion = $_REQUEST['cotizarm'];

        $sql = '

					SELECT * FROM

					 cmx_detalle_mercancia2  mer

					WHERE mer.n_cotizacion= ' . $num_cotizacion . '

				';

        $result = $Data->getConsulta($sql);

        //municipios

        $sql1 = 'SELECT * FROM cmx_municipios';

        $resultmuni = $Data->getConsulta($sql1);

        //tipos de servicio

        $sql2 = 'SELECT * FROM cmx_para_tipo_sevicio WHERE tipificacion="Mercancia"';

        $resulttipos = $Data->getConsulta($sql2);

        //tipo de vehiculo

        $sql3 = 'SELECT nombre FROM cmx_para_tipo_vehiculo WHERE estado="activo"';

        $resultvehiculo = $Data->getConsulta($sql3);

        foreach ($result["rowsData"] as $index1 => $element1) {

            $arreglo = array();

            $arreglo_d = array();

            $arreglo_t = array();

            $arreglo_vehiculo = array();

            foreach ($resultmuni["rowsData"] as $index => $element) {

                $com = $element['municipio'] . '-' . $element['depto'];

                if (strcasecmp($com, $result["rowsData"][$index1]['origen']) == 0) {

                    $arreglo[$index]['selected'] = true;
                } else {

                    $arreglo[$index]['selected'] = false;
                }

                $arreglo[$index]['cualquier'] = $com;

                //destino

                if (strcasecmp($com, $result["rowsData"][$index1]['destino']) == 0) {

                    $arreglo_d[$index]['selected'] = true;
                } else {

                    $arreglo_d[$index]['selected'] = false;
                }

                $arreglo_d[$index]['destino'] = $com;
            }

            $result["rowsData"][$index1]['origen'] = $arreglo;

            $result["rowsData"][$index1]['destino'] = $arreglo_d;

            //TIPOS DE SERVICIO

            foreach ($resulttipos["rowsData"] as $index => $element) {

                if (strcasecmp($element['nombre'], $result["rowsData"][$index1]['tipo_servicio_mer']) == 0) {

                    $arreglo_t[$index]['selected'] = true;
                } else {

                    $arreglo_t[$index]['selected'] = false;
                }

                $arreglo_t[$index]['primero'] = $element['nombre'];
            }
            $result["rowsData"][$index1]['tipo_servicio_mer'] = $arreglo_t;

            //TIPOS DE VEHICULO

            foreach ($resultvehiculo["rowsData"] as $index => $element) {

                if (strcasecmp($element['nombre'], $result["rowsData"][$index1]['tipo_vehiculo']) == 0) {

                    $arreglo_vehiculo[$index]['selected'] = true;
                } else {

                    $arreglo_vehiculo[$index]['selected'] = false;
                }

                $arreglo_vehiculo[$index]['carro'] = $element['nombre'];
            }

            $result["rowsData"][$index1]['tipo_vehiculo'] = $arreglo_vehiculo;
        }

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        break;

    case 'consulteE':

        $num_cotizacion = $_REQUEST['cotizare'];

        $sql = 'SELECT * FROM cmx_detalle_servespecial2  espe

					WHERE espe.n_cotizacion= ' . $num_cotizacion . '';

        $result = $Data->getConsulta($sql);

        $sql2 = '

					SELECT nombre FROM cmx_para_tipo_sevicio

					WHERE tipificacion="Especial"';

        $resultespecial = $Data->getConsulta($sql2);

        foreach ($result["rowsData"] as $index1 => $element1) {

            $arreglo_especial = array();

            foreach ($resultespecial["rowsData"] as $index => $element) {

                if (strcasecmp($element['nombre'], $result["rowsData"][$index1]['tipo_servicio']) == 0) {

                    $arreglo_especial[$index]['selected'] = true;
                } else {

                    $arreglo_especial[$index]['selected'] = false;
                }

                $arreglo_especial[$index]['espe'] = $element['nombre'];
            }

            $result["rowsData"][$index1]['tipo_servicio'] = $arreglo_especial;
        }

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        break;

    //CASOS PARA SOLO VER EL EDITAR DE COTIZACION

    case 'cabecera_no_editar':

        $num_cotizacion = $_REQUEST['n_cotizar'];

        $sql = '

					SELECT * FROM cmx_cotizaciones_serviciocliente cab

					WHERE cab.n_cotizacion= ' . $num_cotizacion . '

				';

        $result = $Data->getConsulta($sql);

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        break;

    case 'consultem_no':

        $num_cotizacion = $_REQUEST['cotizarm_no'];

        $sql = "SELECT cdm.*, cdm.id as idm, tv.id, tv.nombre ,

				 CONCAT(C1.municipio,'-',C1.depto)AS o ,

				CONCAT(C2.municipio,'-',C2.depto) AS d,

				e.empaque

				FROM cmx_detalle_mercancia2 cdm

				INNER JOIN cmx_para_tipo_vehiculo tv

				ON cdm.tipo_vehiculo=tv.id

				INNER JOIN cmx_municipios C1

				ON cdm.origen=C1.rndc_codigo_ciudad

				INNER JOIN cmx_municipios C2

				ON cdm.destino=C2.rndc_codigo_ciudad

				INNER JOIN cmx_para_tipo_empaque e

				ON cdm.tipo_empaque=e.id

				WHERE cdm.n_cotizacion=" . $num_cotizacion . " ";

        $result = $Data->getConsulta($sql);

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        break;

    case 'vehiculo_solservi':

        $idv = $_REQUEST["veh"];

        $sql = "SELECT nombre FROM cmx_para_tipo_vehiculo

			WHERE id=" . $idv . "    ";

        $result = $Data->getConsulta($sql);

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        break;

    case 'tsolicitudservicio':

        $ncotiza = $_REQUEST["n_cotizar"];

        $sql = "SELECT s.id,s.fecha, s.hora, s.estado, s.usuario_auditor,s.proceso, m.n_cotizacion, m.id AS pareja,m.item,m.tipo_mercancia
			FROM cmx_solicitud_vehiculo2 s
			INNER JOIN cmx_detalle_mercancia2 m ON s.idpareja_origen_destino=m.id
			WHERE s.n_cotizacion=" . $ncotiza . "";
        $result = $Data->getConsulta($sql);

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'traer_municipios_edit':

        $origen = $_REQUEST['origenes'];

        $destino = $_REQUEST['destinos'];

        $sqlo = "SELECT  CONCAT(municipio,'-',depto)

					AS 'origenm' FROM cmx_municipios

					WHERE rndc_codigo_ciudad=" . $origen . "	";

        $result = $Data->getConsulta($sqlo);

        $sqld = "SELECT  CONCAT(municipio,'-',depto) AS 'destinom'

					FROM cmx_municipios

					WHERE rndc_codigo_ciudad=" . $destino . "	";

        $result1 = $Data->getConsulta($sqld);

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        // $return["result1"] = $result1["rowsData"];
        if ($result1 > 1) {
            $return["result1"] = $result1["rowsData"];
        } else {
            $return["result1"] = $result1;
        }

        break;

    case 'no_consulteE':

        $num_cotizacion = $_REQUEST['cotizare_no'];
        $sql = 'SELECT * FROM  cmx_detalle_servespecial2  espe WHERE espe.n_cotizacion= ' . $num_cotizacion . '';
        $result = $Data->getConsulta($sql);

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    //Consultar la cotizacion segun el estado (informes)

    case 'consulte_estado_cotizacion':

        $estado = $_REQUEST['estado_cotice'];

        $sql = '

					SELECT ccs.*, cdm.* FROM

					cmx_cotizaciones_serviciocliente ccs INNER JOIN

					cmx_detalle_mercancia2 cdm ON ccs.n_cotizacion=cdm.n_cotizacion

					WHERE ccs.estado="' . $estado . '"

					GROUP BY ccs.n_cotizacion

					ORDER BY ccs.n_cotizacion DESC

					  ';

        $result = $Data->getConsulta($sql);

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        break;

    //VER LA COTIZACIÓN

    case 'ver':
        $numero_cotizacion = $_REQUEST['ncotizar'];
        $sql = 'SELECT * FROM cmx_cotizaciones_serviciocliente ccs WHERE ccs.n_cotizacion=' . $numero_cotizacion . ' ';
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'ver_mer':
        $numero_cotizacion = $_REQUEST['ncotizar1'];
        $sql = "SELECT cdm.*, tv.nombre, CONCAT(C1.municipio,'-',C1.depto) AS orig, CONCAT(C2.municipio,'-',C2.depto) AS dest , e.empaque
						FROM cmx_detalle_mercancia2 cdm
						INNER JOIN cmx_para_tipo_vehiculo tv ON cdm.tipo_vehiculo=tv.id
						INNER JOIN cmx_municipios C1 ON cdm.origen=C1.rndc_codigo_ciudad
						INNER JOIN cmx_municipios C2 ON cdm.destino=C2.rndc_codigo_ciudad
						INNER JOIN cmx_para_tipo_empaque e ON cdm.tipo_empaque=e.id
						WHERE cdm.n_cotizacion=" . $numero_cotizacion . " ";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'traermunicipiover':

        $origen = $_REQUEST['origen'];

        $destino = $_REQUEST['destino'];

        $sqlo = "SELECT  CONCAT(municipio,'-',depto) as 'origenmv' FROM cmx_municipios

					WHERE rndc_codigo_ciudad=" . $origen . "	";

        $result = $Data->getConsulta($sqlo);

        $sqld = "SELECT  CONCAT(municipio,'-',depto) as 'destinomv' FROM cmx_municipios

					WHERE rndc_codigo_ciudad=" . $destino . "	";

        $result1 = $Data->getConsulta($sqld);

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        // $return["result1"] = $result1["rowsData"];

        if ($result1 > 1) {
            $return["result1"] = $result1["rowsData"];
        } else {
            $return["result1"] = $result1;
        }

        break;

    case 'ver_espe':
        $numero_cotizacion = $_REQUEST['ncotizar2'];
        $sql = "SELECT * FROM cmx_detalle_servespecial2 cde WHERE cde.n_cotizacion=" . $numero_cotizacion . " ";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    // case 'solicitud_servicio':  
    //     $soli_servi = $_REQUEST["soli_servi"];
    //     $sql = "SELECT s.*, a.nombre,pe.fecha_estimada_entrega AS fecha_cargue,pe.hora_estimada AS hora_cargue,
    //     rm.nombre AS remitente, des.nombre AS destinatario, ds.fecha_estimada_entrega AS fecha_descargue,
    //      ds.hora_estimada AS hora_descargue, pe.id_punto AS punto_rem, ds.id_punto AS punto_des,s.numero_contenedor,s.agrupable,ds.observacion,s.escenario_id
    //     FROM cmx_solicitud_vehiculo2  s
    //     INNER JOIN cmx_agencias a ON s.agencia=a.id
    //     INNER JOIN cmx_ruta_puntosentrega pe ON s.nundoc_solicitud=pe.cod_ini_ruta
    //     INNER JOIN cmx_remitente_destinatario rm ON pe.cliente=rm.id
    //     LEFT JOIN  cmx_destinatarios_ss ds ON pe.cod_ini_ruta=ds.solicitud_servicio
    //    -- AND  pe.id_punto=ds.id_punto
    //     LEFT JOIN cmx_remitente_destinatario des ON ds.cliente=des.id

    //     WHERE s.nundoc_solicitud=" . $soli_servi;
    //     $result = $Data->getConsulta($sql);
    //     if ($result > 1) {
    //         $return["result"] = $result["rowsData"];
    //     } else {
    //         $return["result"] = $result;
    //     }
    //     break;

    case 'Consultar_grupo':

        $fecha = date('Y-m-d');

        $cliente = $_POST["cliente"];

        $sql = "SELECT g.*

				FROM cmx_grupo g

				INNER JOIN cmx_clientes cl

				ON g.id_cliente=cl.id

				WHERE g.estado=1 AND

				cl.nombre='" . $cliente . "'";

        $result = $Data->getConsulta($sql);

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        $sql2 = "

			SELECT g.*,cl.nombre FROM cmx_cliente_hora g

			INNER JOIN cmx_clientes cl

			ON g.id_cliente=cl.id

			WHERE cl.nombre='" . $cliente . "'";

        $result2 = $Data->getConsulta($sql2);

        if ($result2) {

            // $return["result2"] = $result2["rowsData"];
            if ($result2 > 1) {
                $return["result2"] = $result2["rowsData"];
            } else {
                $return["result2"] = $result2;
            }
        } else {

            $sql2 = "

				SELECT g.*,cl.nombre FROM cmx_cliente_hora g

			INNER JOIN cmx_clientes cl

			ON g.id_cliente=cl.id

			WHERE cl.nombre='Todos S.A.'";

            $result2 = $Data->getConsulta($sql2);

            // $return["result2"] = $result2["rowsData"];
            if ($result2 > 1) {
                $return["result2"] = $result2["rowsData"];
            } else {
                $return["result2"] = $result2;
            }
        }

        break;

    //HORAS CLIENTE - correos automaticos

    case 'Registrohora_envio_correo':

        $cliente = $_POST["cliente"];

        $per = $_POST["per"];

        $user = $_SESSION["usuario"]["nom_usuario"];

        $hora = date('H:i:s');

        $fecha = date('Y-m-d');

        $fechaff = (date('Y-m-d') . '-12-31');

        if ($per == 1) {

            //eliminar horas que no sean permanentes

            // $sqldele = "DELETE FROM cmx_cliente_hora
            // 			WHERE id_cliente=" . $cliente . "
            // 			AND permanencia=0";
            // $resultdele = $Data->ejecuteRegistro($sqldele);

            //primera hora

            $sql1 = "INSERT INTO cmx_cliente_hora

			(id,id_cliente,hora_envio,fecha_inicio,fecha_final,permanencia,usuario,fecha,hora)

			VALUES(null," . $cliente . ",'08:00:00','" . $fecha . "','" . $fechaff . "'," . $per . ",'" . $user . "','" . $fecha . "','" . $hora . "')";

            $result1 = $Data->ejecuteRegistro($sql1);

            //segunda hora

            $sql2 = "INSERT INTO cmx_cliente_hora

			(id,id_cliente,hora_envio,fecha_inicio,fecha_final,permanencia,usuario,fecha,hora)

			VALUES(null," . $cliente . ",'12:00:00','" . $fecha . "','" . $fechaff . "'," . $per . ",'" . $user . "','" . $fecha . "','" . $hora . "')";

            $result2 = $Data->ejecuteRegistro($sql2);

            //tercera hora

            $sql3 = "INSERT INTO cmx_cliente_hora

			(id,id_cliente,hora_envio,fecha_inicio,fecha_final,permanencia,usuario,fecha,hora)

			VALUES(null," . $cliente . ",'17:00:00','" . $fecha . "','" . $fechaff . "'," . $per . ",'" . $user . "','" . $fecha . "','" . $hora . "')";

            $result = $Data->ejecuteRegistro($sql3);
        } else {

            $hora_e = $_POST["hora"];

            $fi = $_POST["fi"];

            $ff = $_POST["ff"];

            // $sqldele = "DELETE FROM cmx_cliente_hora
            // 		WHERE id_cliente=" . $cliente . "
            // 		AND permanencia=1";
            // $resultdele = $Data->ejecuteRegistro($sqldele);

            $sql = "INSERT INTO cmx_cliente_hora

			(id,id_cliente,hora_envio,fecha_inicio,fecha_final,permanencia,usuario,fecha,hora)

			VALUES(null," . $cliente . ",'" . $hora_e . "','" . $fi . "','" . $ff . "'," . $per . ",'" . $user . "','" . $fecha . "','" . $hora . "')";

            $result = $Data->ejecuteRegistro($sql);
        }

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'validar_registro':

        $cliente_sl = $_POST["cliente_sl"];

        $sql = "SELECT COUNT(id) AS canidad

			FROM cmx_cliente_hora

			WHERE id_cliente=" . $cliente_sl . "

			AND permanencia=1";

        $result = $Data->getConsulta($sql);

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        break;

    case 'buscar_hora_cliente':

        $cliente_hora = $_POST["cliente_hora"];

        $sql = "SELECT ch.*, cl.nombre, cl.documento ,

			cl.id AS idcliente

			FROM cmx_cliente_hora ch

			INNER JOIN cmx_clientes cl

			ON ch.id_cliente=cl.id

			WHERE ch.id_cliente=" . $cliente_hora;

        $result = $Data->getConsulta($sql);

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        break;

    case 'ver_horacliente':

        $id = $_POST["id"];

        $sql = "SELECT ch.*, cl.nombre, cl.documento

				FROM cmx_cliente_hora ch

				INNER JOIN cmx_clientes cl

				ON ch.id_cliente=cl.id

				WHERE ch.id=" . $id . "";

        $result = $Data->getConsulta($sql);

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        break;

    case 'edita_horacliente':

        $id = $_POST["id"]; //id tabla de horas

        $sql = "SELECT ch.*

				FROM cmx_cliente_hora ch

				WHERE ch.id=" . $id . "";

        $result = $Data->getConsulta($sql);

        if ($result) {

            $sqlm = "SELECT * FROM cmx_clientes";

            $resultm = $Data->getConsulta($sqlm);

            $sqlc = "SELECT * FROM cmx_clientes";

            $resultc = $Data->getConsulta($sqlc);

            $array_cliente = array();

            foreach ($resultc["rowsData"] as $index => $element) {

                if (strcasecmp($element['id'], $result["rowsData"][0]['id_cliente']) == 0) {

                    $array_cliente[$index]['selected'] = true;
                } else {

                    $array_cliente[$index]['selected'] = false;
                }

                $array_cliente[$index]['id'] = $element['id'];

                $array_cliente[$index]['nombre'] = $element['nombre'];
            }

            $result["rowsData"][0]['clientene'] = $array_cliente;
        }

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        break;

    case 'Actualiza_horaenvio':

        $cliente = $_POST["cliente"];

        $fini = $_POST["fini"];

        $ffin = $_POST["ffin"];

        $perma = $_POST["perma"];

        $horae = $_POST["horae"];

        $idtb = $_POST["idtb"];

        $user = $_SESSION["usuario"]["nom_usuario"];

        $hora = date('H:i:s');

        $fecha = date('Y-m-d');

        $fechaff = (date('Y') . '-12-31');

        if ($perma == '1') {

            $sqldele = "DELETE FROM cmx_cliente_hora

					WHERE id_cliente=" . $cliente;

            $resultdele = $Data->ejecuteRegistro($sqldele);

            $sql1 = "INSERT INTO cmx_cliente_hora

			(id,id_cliente,hora_envio,fecha_inicio,fecha_final,permanencia,usuario,fecha,hora)VALUES(null,'" . $cliente . "','08:00:00','" . $fecha . "','" . $fechaff . "'," . $perma . ",'" . $user . "','" . $fecha . "','" . $hora . "')";

            $result1 = $Data->ejecuteRegistro($sql1);

            $sql2 = "INSERT INTO cmx_cliente_hora

			(id,id_cliente,hora_envio,fecha_inicio,fecha_final,permanencia,usuario,fecha,hora)VALUES(null,'" . $cliente . "','12:00:00','" . $fecha . "','" . $fechaff . "'," . $perma . ",'" . $user . "','" . $fecha . "','" . $hora . "')";

            $result2 = $Data->ejecuteRegistro($sql2);

            $sql3 = "INSERT INTO cmx_cliente_hora

			(id,id_cliente,hora_envio,fecha_inicio,fecha_final,permanencia,usuario,fecha,hora)VALUES(null,'" . $cliente . "','17:00:00','" . $fecha . "','" . $fechaff . "'," . $perma . ",'" . $user . "','" . $fecha . "','" . $hora . "')";

            $result = $Data->ejecuteRegistro($sql3);
        } else {

            $sqldele = "DELETE FROM cmx_cliente_hora

					WHERE id_cliente=" . $cliente . "

					AND permanencia=1";

            $resultdele = $Data->ejecuteRegistro($sqldele);

            $sql = "INSERT INTO cmx_cliente_hora

			(id,id_cliente,hora_envio,fecha_inicio,fecha_final,permanencia,usuario,fecha,hora)VALUES(null," . $cliente . ",'" . $horae . "','" . $fini . "','" . $ffin . "'," . $perma . ",'" . $user . "','" . $fecha . "','" . $hora . "')";

            $result = $Data->ejecuteRegistro($sql);
        }

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        break;

    //AGREGAR MAS BLOQUES A LA COTIZACIÓN

    case 'traer_valores_totales':

        $idcotizacion = $_POST["idcotizacion"];

        $sql = "SELECT total_transporte, total_especial, total_cotizacion, tmer_flete, tmer_utili,

		tmer_rent, tes_flete, tes_tarifa, tes_util, tes_renta

		FROM cmx_cotizaciones_serviciocliente

		WHERE n_cotizacion=" . $idcotizacion;

        $result = $Data->getConsulta($sql);

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        break;

    //VERIFICAR EL
    case 'requiere_cancelacion':
        $idsolicitud = $_POST["idsolicitud"];
        $sql = "SELECT pse.id FROM cmx_solicitud_vehiculo2 se
			LEFT JOIN cmx_preestudio_solicitudes_servicio pse ON se.nundoc_solicitud=pse.id_servicio_cliente
			WHERE pse.id_servicio_cliente=" . $idsolicitud;
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'Cancelar_Solicitud':

        $numero_solicitud_servicio = $_POST["n_servicio"];

        $sql = "UPDATE cmx_solicitud_vehiculo2

				SET estado='Cancelada'

				WHERE nundoc_solicitud=" . $numero_solicitud_servicio;

        $result = $Data->ejecuteRegistro($sql);

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        break;

    // case 'consulta_datos_subasta':

    //     $n_servicio = $_POST["n_servicio"];

    //     $sql = "

    // 		SELECT a.num_estudioseguridad, a.placa, a.flete_sugerido, a.flete_propuesto,

    // 		ss.numer_solservicio, ser.nombre_cliente, d.total_tarifa, b.estado,a.id_suba, a.id as idflete, b.id as idestadoflete,

    // 		d.id as parejaorigen, b.acepta_flete, a.tarifa_promedio

    // 		FROM cmx_subasta_flete a

    // 		INNER JOIN cmx_estado_subasta_flete b

    // 		ON a.id=b.id_suba_flete

    // 		AND b.estado IN('pendiente_aprobacion','aprueba_flete_sac','no_aprueba_ge')

    // 		INNER JOIN cmx_subasta_solicitud_servicio ss

    // 		ON a.id_suba_servicio=ss.id

    // 		LEFT JOIN cmx_solicitud_vehiculo2 ser

    // 		ON ss.numer_solservicio=ser.nundoc_solicitud

    // 		LEFT JOIN cmx_detalle_mercancia2 d

    // 		ON ser.idpareja_origen_destino=d.id

    // 		WHERE ss.numer_solservicio=" . $n_servicio;

    //     $result = $Data->getConsulta($sql);

    //     if ($result > 1) {
    //         $return["result"] = $result["rowsData"];
    //     } else {
    //         $return["result"] = $result;
    //     }

    //     break;

    case 'Aprueba_Sac':

        // $user = $_SESSION["usuario"]["nom_usuario"];
        // $hora = date('H:i:s');
        // $fecha = date('Y-m-d');
        // $sidflete = $_POST["sidflete"];
        // $subasta = $_POST["subasta"];
        // $tarifa = $_POST["tarifa"];
        // $estado = $_POST["estado"];
        // $idpareja = $_POST["idpareja"];
        // $responsable = $fecha . ' ' . $hora . ' ' . $user;

        //update en el campo nuevo de estado estado_sac
        //insert en el campo nuevo de detalle de mercancia
        // tarifa_subasta  responsable

        if ($_POST["estado"] == 'aprobado_sac') {
            $sql8 = "INSERT INTO cmx_operacion_subasta(id,n_subasta,flete_ganador,tarifa_ganador,fecha,hora,usuario,area,estado_letra)
				VALUES(null,$subasta,'" . $sidflete . "','" . $tarifa . "','" . $fecha . "','" . $hora . "','" . $user . "','SAC','Ganador')";
            $resultm = $Data->ejecuteRegistro($sql8);
            $sql = "UPDATE cmx_estado_subasta_flete ef
			INNER JOIN cmx_subasta_flete sf ON ef.id_suba_flete=sf.id
			SET ef.estado_sac='aprobado_sac', ef.estado_final='Ganador', ef.estado='Ganador', sf.tarifa_promedio='" . $tarifa . "' WHERE ef.id_suba_flete=" . $sidflete;

            $result3 = $Data->ejecuteRegistro($sql);

            if ($result3) {
                $sql2 = "UPDATE cmx_detalle_mercancia2 SET tarifa_subasta='" . $tarifa . "', responsable_ts='" . $responsable . "' WHERE id=" . $idpareja;
                $result = $Data->ejecuteRegistro($sql2);
                $sql4 = "UPDATE cmx_solicitud_vehiculo2 SET estado_secundario='Ganador' WHERE idpareja_origen_destino=" . $idpareja;
                $result4 = $Data->ejecuteRegistro($sql4);
            }
        }

        if ($_POST["estado"] == 'no_aprobado_sac') {

            $sql8 = "INSERT INTO cmx_operacion_subasta(id,n_subasta,flete_ganador,tarifa_ganador,fecha,hora,usuario,area,estado_letra)
				    VALUES(null,$subasta,'" . $sidflete . "','" . $tarifa . "','" . $fecha . "','" . $hora . "','" . $user . "','SAC','pendiente_aprobacion_ge')";
            $resultm = $Data->ejecuteRegistro($sql8);

            $sql = "UPDATE cmx_estado_subasta_flete ef
			INNER JOIN cmx_subasta_flete sf ON ef.id_suba_flete=sf.id
			SET ef.estado_sac='no_aprobado_sac', ef.estado='pendiente_aprobacion_ge', sf.tarifa_promedio='" . $tarifa . "' WHERE ef.id_suba_flete=" . $sidflete;

            $result3 = $Data->ejecuteRegistro($sql);

            if ($result3) {
                $sql2 = "UPDATE cmx_detalle_mercancia2 SET tarifa_subasta='" . $tarifa . "', responsable_ts='" . $responsable . "' WHERE id=" . $idpareja;
                $result = $Data->ejecuteRegistro($sql2);
                $sql4 = "UPDATE cmx_solicitud_vehiculo2 SET estado_secundario='pendiente_aprobacion_gerencia' WHERE idpareja_origen_destino=" . $idpareja;
                $result4 = $Data->ejecuteRegistro($sql4);
            }
        }

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        break;

    case 'validar_solser_subasta':

        $numsolicitud = $_POST["numsolicitud"];

        $sql = "SELECT soli.id, es.estado, su.fecha_finaliza,

						su.hora_finaliza

						FROM cmx_solicitud_vehiculo2 soli

						LEFT JOIN cmx_subasta_solicitud_servicio sse

						ON soli.nundoc_solicitud=sse.numer_solservicio

						LEFT JOIN cmx_estado_subasta es

						ON sse.id_subasta=es.id_subasta

						LEFT JOIN cmx_subasta su

						ON es.id_subasta=su.id

						WHERE soli.nundoc_solicitud=" . $numsolicitud . "

						GROUP BY sse.id_subasta";

        $result = $Data->getConsulta($sql);

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        break;

    //SOLICITUD DE SERVICIO NUEVO DESIGN

    case 'consulta_servicio':

        $cotizar = $_POST["cotizar"];

        $item = $_POST["item"];

        $sql = 'SELECT

			 CONCAT(b.municipio,"-",b.depto) AS origi,

			  CONCAT(c.municipio,"-",c.depto) AS desti,

			  ve.nombre

			FROM cmx_detalle_mercancia2 a

			INNER JOIN cmx_municipios b

			ON a.origen=b.rndc_codigo_ciudad

			INNER JOIN  cmx_municipios c

			ON a.destino=c.rndc_codigo_ciudad

			INNER JOIN cmx_para_tipo_vehiculo ve

			ON a.tipo_vehiculo=ve.id

			WHERE a.n_cotizacion=' . $cotizar . '

			AND a.item=' . $item;

        $result = $Data->getConsulta($sql);

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        break;

    case 'consulta_serviciob':

        $numero_cotizacion = $_POST["cotizar"];

        $solicitud_servicio = $_POST["solicitud"];

        $sql = "SELECT se.nundoc_solicitud,

			se.n_cotizacion, se.nombre_cliente, se.peso_kg,

			mno.municipio AS origen, mnd.municipio AS destino, ag.nombre AS agencia,

			se.devol_contenedor, se.devol_dias, se.devol_municipio,

			se.devol_direccion, se.devol_tipocont,

			se.devol_numcont, se. devol_comodato,

			veh.nombre, mer.tipo_mercancia

			FROM cmx_solicitud_vehiculo2 se

			INNER JOIN cmx_detalle_mercancia2 mer

			ON se.idpareja_origen_destino=mer.id

			INNER JOIN cmx_municipios mno

			ON se.origen=mno.rndc_codigo_ciudad

			INNER JOIN cmx_municipios mnd

			ON se.destino=mnd.rndc_codigo_ciudad

			INNER JOIN cmx_agencias ag

			ON se.agencia=ag.id

			INNER JOIN cmx_para_tipo_vehiculo veh

			ON se.tipo_vehiculo = veh.id

			WHERE se.nundoc_solicitud=" . $solicitud_servicio;

        $result = $Data->getConsulta($sql);

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        break;

    case 'consulta_remitente':

        $numero_cotizacion = $_POST["cotizar"];

        $solicitud_servicio = $_POST["solicitud"];

        $sql = "SELECT a.id, rd.nombre, a.direccion_entrega, a.fecha_estimada_entrega,

			a.observacion, a.hora_estimada, a.tipo, a.telefono,

			a.peso, a.lugar, mn.municipio

			FROM cmx_ruta_puntosentrega a

			INNER JOIN cmx_remitente_destinatario rd

			ON a.cliente=rd.id

			INNER JOIN cmx_municipios mn

			ON a.municipio_entrega=mn.id

			WHERE

			a.cod_ini_ruta=" . $solicitud_servicio;

        $result = $Data->getConsulta($sql);

        $sql2 = "

			SELECT remi.id AS remitente,

			inf.*, des.nombre, mn.municipio

			FROM cmx_destinatarios_ss inf

			INNER JOIN cmx_remitente_destinatario des

			ON inf.cliente=des.id

			INNER JOIN cmx_ruta_puntosentrega remi

			ON inf.solicitud_servicio=cod_ini_ruta

			AND inf.id_punto=remi.id_punto

			INNER JOIN cmx_municipios mn

			ON inf.municipio_entrega=mn.id

			WHERE

			inf.solicitud_servicio=" . $solicitud_servicio;

        $result2 = $Data->getConsulta($sql2);

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        // $return["result2"] = $result2["rowsData"];
        if ($result2 > 1) {
            $return["result2"] = $result2["rowsData"];
        } else {
            $return["result2"] = $result2;
        }

        break;

    // case 'respuesta_flete':

    //     $flete_propu = $_POST["flete_propu"];

    //     $tarifa_pro = $_POST["tarifa_pro"];

    //     $utilidad = $_POST["utilidad"];

    //     $rentabili = $_POST["rentabili"];

    //     $subasta = $_POST["subasta"];

    //     $estado = $_POST["estado"];

    //     $sidflete = $_POST["sidflete"];

    //     $user = $_SESSION["usuario"]["nom_usuario"];

    //     $servicio = $_POST["nservicio"];

    //     $hora = date('H:i:s');

    //     $fecha = date('Y-m-d');

    //     if ($_POST["estado"] == 1) {

    //         $statu = 'Aceptado';

    //         $estado = 'aprueba_flete_sac';
    //     } else {

    //         $statu = 'No aceptado';

    //         $estado = 'no_aprueba_flete_sac';
    //     }

    //     $sql = "INSERT INTO cmx_operacion_subasta(id,n_subasta,flete_ganador,tarifa_ganador,rentabilidad,utilidad,estado,fecha,hora,usuario,area,estado_letra)

    // 	VALUES(null,'" . $subasta . "','" . $flete_propu . "','" . $tarifa_pro . "','" . $rentabili . "','" . $utilidad . "','" . $estado . "','" . $fecha . "','" . $hora . "','" . $user . "','SAC','" . $estado . "')";

    //     $result = $Data->ejecuteRegistro($sql);

    //     if ($result) {

    //         //actualizar estado en subasta

    //         $sql2 = "UPDATE cmx_estado_subasta_flete

    // 			SET acepta_flete='" . $statu . "',

    // 			estado='" . $estado . "'

    // 		WHERE id_suba='" . $subasta . "' AND

    // 		id_suba_flete=" . $sidflete;

    //         $result2 = $Data->ejecuteRegistro($sql2);

    //         //Actualizar estado en sac

    //         $sql3 = "UPDATE cmx_solicitud_vehiculo2

    // 		SET estado_secundario='" . $estado . "'

    // 		WHERE nundoc_solicitud=" . $servicio;

    //         $result3 = $Data->ejecuteRegistro($sql3);
    //     }

    //     break;

    case 'cantidad_solicitud':

        $fecha_inicial = $_POST["fecha_inicia"];
        $fecha_final = $_POST["fecha_final"];

        $sql = "SELECT  COUNT(soli.id) AS cantidad FROM cmx_solicitud_vehiculo2 AS soli
		WHERE soli.fecha BETWEEN '" . $fecha_inicial . "' AND '" . $fecha_final . "'";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        break;

    case 'traza_solicitud':
        $solicitud = $_POST["idsolicitud"];
        $idpareja = $_POST["idpareja"];
        $sql = "SELECT ss.nundoc_solicitud AS 'servicio', ps.id_solicitudpreestudio,
            CONCAT(ps.fecha,'<br>',ps.hora) AS 'fec_prefiltro', eps.id_solicitudpreestudio AS id_estudio,
            CONCAT(eps.fecha,'<br>',eps.hora) AS 'fec_estudio', sf.placa,
            oc.id AS 'numero_orden', CONCAT(oc.fecha_orden,' <br>',oc.hora_orden) AS 'fec_orden',
            rme.id_remesa AS 'numero_remesa', CONCAT(re.fecha_creacion,' <br>',re.hora_creacion) AS 'fec_remesa',
            mfr.id_manifiesto AS 'numero_manifiesto', CONCAT(mfr.fecha,' <br>',mfr.hora) AS 'fec_manifiesto',
            cita.numero_cita, plan.cod_plan
            FROM cmx_solicitud_vehiculo2 ss
            LEFT JOIN cmx_preestudio_solicitudes_servicio ps
            ON ss.nundoc_solicitud=ps.id_servicio_cliente AND ps.es=1 AND ps.clasificacion='P'
            LEFT JOIN cmx_preestudio_solicitudes_servicio eps
            ON ss.nundoc_solicitud=eps.id_servicio_cliente AND eps.es=1 AND eps.clasificacion='E'
            LEFT JOIN cmx_subasta_solicitud_servicio sub
            ON sub.numer_solservicio=ss.nundoc_solicitud
            LEFT JOIN cmx_subasta_flete sf
            ON sub.id=sf.id_suba_servicio AND sub.id_subasta=sf.id_suba
            LEFT JOIN cmx_estado_subasta_flete esf
            ON sf.id=esf.id_suba_flete AND sf.id_suba=esf.id_suba AND esf.estado='Ganador'
            LEFT JOIN cmx_estudiov_completo ev
            ON sf.num_estudioseguridad=ev.id_estudio AND ev.estado='Aprobado' AND ev.estado_actu=1
            LEFT JOIN cmx_orden_cargue oc
            ON sf.numero_orden=oc.id
            LEFT JOIN cmx_remesa_ordencargue rme
            ON oc.id=rme.id_orden_cargue AND rme.estado=1
            LEFT JOIN cmx_remesa re
            ON rme.id_remesa=re.id
            LEFT JOIN cmx_manifiesto_remesa mfr
            ON rme.id_remesa=mfr.id_remesa AND mfr.estado=1
            LEFT JOIN cmx_asigancio_cita cita
            ON  mfr.id_manifiesto=cita.manifiesto
            LEFT JOIN cmx_inicio_ruta plan
            ON mfr.id_manifiesto=plan.num_manifiesto
            WHERE ss.nundoc_solicitud=" . $solicitud;
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;
    default:

        break;
}

if ($return["result"] > 1) {
    $return["result"] = $result["rowsData"];
} else {
    $return["result"] = $result;
}

echo json_encode($return);
