<?php
session_start();
class servicioclienteiModel extends Model
{

    public function __construct()
    {
        parent::__construct();
    }

    /* Consultar conedor */
    public function Get_Conedores()
    {
        $sql = $this->_db3->prepare("SELECT id,nombre FROM cmx_tipo_contenedor");
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Get_Municipios()
    {
        // $sql = $this->_db3->prepare("SELECT * FROM cmx_para_tipo_vehiculo WHERE estado='activo'");
        $sql = $this->_db3->prepare("SELECT * FROM cmx_municipios ORDER BY municipio ASC");
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }
    public function Get_Vehiculos()
    {
        $sql = $this->_db3->prepare("SELECT * FROM cmx_para_tipo_vehiculo WHERE estado='activo'");
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Get_Tipo_Mercancia()
    {
        $sql = $this->_db3->prepare("SELECT b.nombre, a.codigo, a.partida,b.id FROM cmx_rndc_codificacion_producto a
     INNER JOIN cmx_para_tipo_mercancia b ON a.id=b.id_producto_mn
     WHERE b.estado='Activo' ORDER BY b.nombre ASC");
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Get_Municipio()
    {
        $sql = $this->_db3->prepare("SELECT * FROM cmx_municipios WHERE estado_nacional='Activa'");
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Get_Tipo_Empaque()
    {
        $sql = $this->_db3->prepare("SELECT * FROM cmx_para_tipo_empaque");
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Get_Flete($ori, $des, $vehiculo)
    {
        $vigencia = date('Y'); // Devuelve el año actual, por ejemplo: 2025
        $mes = (int) date('m'); // Devuelve el mes actual en 2 dígitos, por ejemplo: 03

        $sql = $this->_db3->prepare("SELECT * FROM cmx_fletes_nacional WHERE origen = '" . $ori . "' AND destino = '" . $des . "' AND tipo_vehiculo = '" . $vehiculo . "' AND vigencia='" . $vigencia . "' AND mes='" . $mes . "' AND estado=1");
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Get_Naturaleza($id)
    {
        $sql = $this->_db3->prepare("SELECT b.tipo FROM cmx_para_tipo_mercancia a
        INNER JOIN cmx_rndc_codificacion_producto b ON a.id_producto_mn=b.id
        WHERE a.id='" . $id . "'");
        $sql->execute();
        $resultado = $sql->fetch(PDO::FETCH_ASSOC);
        return $resultado;
    }

    /* Validar tarifas sicetac */

    public function Validar_trafifa_Sicetac($datos)
    {

        $sumaArray = [];
        foreach ($datos->configuracion_vehiculo as $index => $merca) {
            $sql = $this->_db3->prepare("SELECT valor_tarifa, valor_hora FROM cmx_maestro_tarifas_sicetac 
                                WHERE configuracion = :configuracion 
                                  AND id_unidad_transporte = :id_unidad_transporte 
                                  AND id_tipo_carga = :id_tipo_carga 
                                  AND id_origen = :id_origen 
                                  AND id_destino = :id_destino");
            $sql->bindParam(':configuracion', $datos->configuracion_vehiculo[$index]);
            $sql->bindParam(':id_unidad_transporte', $datos->unidad_transporte[$index]);
            $sql->bindParam(':id_tipo_carga', $datos->tipo_carga[$index]);
            $sql->bindParam(':id_origen', $datos->origen_sicetac[$index]);
            $sql->bindParam(':id_destino', $datos->destino_sicetac[$index]);
            $sql->execute();
            $resultado = $sql->fetch();

            // Solo imprimimos si hay un resultado válido (opcional, para depurar)
            if ($resultado !== false) {
                // Multiplicar valor_hora por 8 y sumar con valor_tarifa
                $valor_hora_multiplicado = $resultado['valor_hora'] * 8;
                $Suma = $valor_hora_multiplicado + $resultado['valor_tarifa'];
                $sumaArray[] = $Suma;
            }
        }
        return $sumaArray;
    }

    public function Insertar_Cotizacion(
        $nit,
        $digito,
        $dire,
        $telefono,
        $procedencia,
        $observacion,
        $usuario,
        $check,
        $total_transporte,
        $Ttotal_cotizacion,
        $Tcosto_flete,
        $Tutilidad,
        $Trentabilidad,
        $Tcosto_especial,
        $Ttarifa_especial,
        $Tutilidad_especial,
        $Trenta_especial,
        $name_cliente,
        $mercancias,
        $especial,
        $idcliente,
        $empresa_id,
        $escenario_id
    ) {
        $response = [];
        $lastInsertId = 0;
        $session_empresa_id = $_SESSION['usuario']['empresa_id'];
        // Obtener la fecha y hora actuales
        $fecha = date('Y-m-d');
        $hora = date('G:i:s');
        try {
            // Iniciar la conexión
            $this->_db3->beginTransaction();

            // SELECCIONAR EL MAESTRO DISPONIBLE PARA CREAR LA COTIZACION
            $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='COTIZACION' AND numero_actual>numero_inicial AND empresa_id=:empresa_id");
            $sql_consecutivo->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
            $sql_consecutivo->execute();
            $resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);

            if ($resultado_consecutivo !== false && isset($resultado_consecutivo['numero_actual'])) {
                $numdoc_cabecera = $resultado_consecutivo['numero_actual'];
                $numdoc_actualizar_cabecera = $numdoc_cabecera + 1;

                // Actualizar Maestro de Estudio seguridad cabecera
                $sql_updata_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=:numdoc_actualizar_cabecera WHERE tipo='COTIZACION' AND empresa_id=:empresa_id");
                $sql_updata_maestro->bindParam(':numdoc_actualizar_cabecera', $numdoc_actualizar_cabecera, PDO::PARAM_INT);
                $sql_updata_maestro->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
                $sql_updata_maestro->execute();

                // Preparar la primera inserción
                $stmt1 = $this->_db3->prepare("INSERT INTO cmx_cotizaciones_serviciocliente (n_cotizacion, nit, digito, nombre_cliente, direccion, telefono, procedencia_cotizacion, observaciones, elaborado_por, autorizado_por, linea_negocio, estado, user_log, estado_autorizado, total_transporte, total_especial, total_cotizacion, tmer_flete, tmer_utili, tmer_rent, tes_flete, tes_tarifa, tes_util, tes_renta, fecha_creacion, hora_creacion, id_cliente,escenario_id,empresa_id)
                VALUES (:cotizacion, :nit, :digito, :nombre, :direccion, :telefono, :procede, :obs, :elaborado, :autorizado, :linea, :statu, :usuario, :estado_autoriza, :total_trans, :tarifa_especial, :total_cotizacion, :tmer, :tutilidad, :trentable, :tcosto_especial, :ttarifa_especial, :ttutil_especial, :trenta_especial, :fecha_creacion, :hora_creacion, :idcliente, :escenario_id, :empresa_id)");

                $stmt1->execute([
                    ':cotizacion' => $numdoc_cabecera,
                    ':nit' => $nit,
                    ':digito' => $digito,
                    ':nombre' => $name_cliente,
                    ':direccion' => $dire,
                    ':telefono' => $telefono,
                    ':procede' => $procedencia,
                    ':obs' => $observacion,
                    ':elaborado' => $usuario = 'undefined' ? $_SESSION['usuario']['nom_usuario'] : $usuario,
                    ':autorizado' => 'sistema',
                    ':linea' => 0,
                    ':statu' => 'F3',
                    ':usuario' => $usuario = 'undefined' ? $_SESSION['usuario']['nom_usuario'] : $usuario,
                    ':estado_autoriza' => 'autorizado',
                    ':total_trans' => $total_transporte,
                    ':tarifa_especial' => $Ttarifa_especial,
                    ':total_cotizacion' => $Ttotal_cotizacion,
                    ':tmer' => $Tcosto_flete,
                    ':tutilidad' => $Tutilidad,
                    ':trentable' => $Trentabilidad,
                    ':tcosto_especial' => $Tcosto_especial,
                    ':ttarifa_especial' => $Ttarifa_especial,
                    ':ttutil_especial' => $Tutilidad_especial,
                    ':trenta_especial' => $Trenta_especial,
                    ':fecha_creacion' => $fecha,
                    ':hora_creacion' => $hora,
                    ':idcliente' => $idcliente,
                    ':escenario_id' => $escenario_id,
                    ':empresa_id' => $empresa_id,
                ]);

                // Insertar en cmx_estados_cotizacion
                $stmt2 = $this->_db3->prepare("INSERT INTO cmx_estados_cotizacion (id, n_cotizacion, estado, estado_autorizado, hora, fecha, user_log)
                VALUES (:id, :n_cotizacion, :estado, :estado_autoriza, :hora_creacion, :fecha_creacion, :usuario)");
                $stmt2->execute([
                    ':id' => null,
                    ':n_cotizacion' =>  $numdoc_cabecera,
                    ':estado' => 'F3',
                    ':estado_autoriza' => 'autorizado',
                    ':hora_creacion' => $hora,
                    ':fecha_creacion' => $fecha,
                    ':usuario' => $usuario
                ]);

                // Validar utilidad y actualizar estados si es necesario
                if ($Tutilidad < 15 && $nit != '900808391' && $digito != '9') {
                    $stmt3 = $this->_db3->prepare("UPDATE cmx_cotizaciones_serviciocliente SET estado_autorizado = :estado_autoriza, estado = :estado WHERE n_cotizacion = :num_cotizacion");
                    $stmt3->execute([
                        ':estado_autoriza' => 'por autorizar',
                        ':estado' => 'F1',
                        ':num_cotizacion' =>  $numdoc_cabecera
                    ]);

                    $stmt4 = $this->_db3->prepare("UPDATE cmx_estados_cotizacion SET estado = :estado, estado_autorizado = :estadoautoriza WHERE n_cotizacion = :num_cotizacion");
                    $stmt4->execute([
                        ':estado' => 'F1',
                        ':estadoautoriza' => 'por autorizar',
                        ':num_cotizacion' => $numdoc_cabecera
                    ]);
                }

                // Insertar datos de mercancía
                foreach ($mercancias->mercanc as $index => $merca) {
                    $stmt5 = $this->_db3->prepare("INSERT INTO cmx_detalle_mercancia2 (id, n_cotizacion, tipo_servicio_mer, origen, destino, tipo_vehiculo, peso_bruto_kg, peso_neto_kg, peso_neto_tn, alto, largo, ancho, volumen_total, flete, utilidad, total_tarifa, rentabilidad, tipo_carga, tipo_transporte, item, proceso, tipo_mercancia, valor_mercancia, cantidad_empaque, tipo_empaque, naturaleza, observacion, cant_vehiculo, cant_gastar, id_mercancia, itr)
                                VALUES (:id_tabla, :n_cotizacion, :tipo_servic, :origin, :destini, :vehiculo, :pbrutokg, :pneto, :pbrutotn, :alto, :largo, :ancho, :volumen, :flete, :util, :tarifa, :rentable, :ti_carga, :tipo_transporte, :item, :process, :mercancia, :val_merca, :canti_e, :tipo_empaq, :natura, :obs, :canti_veh, :cant_gasta, :id_producto, :itr)");
                    $stmt5->execute([
                        ':id_tabla' => null,
                        ':n_cotizacion' =>  $numdoc_cabecera,
                        ':tipo_servic' => $mercancias->servicio[$index],
                        ':origin' => $mercancias->origen[$index],
                        ':destini' => $mercancias->destino[$index],
                        ':vehiculo' => $mercancias->vehiculo[$index],
                        ':pbrutokg' => $mercancias->pesobruto[$index],
                        ':pneto' => $mercancias->pesoneto[$index],
                        ':pbrutotn' => $mercancias->brutotn[$index],
                        ':alto' => $mercancias->alto[$index],
                        ':largo' => $mercancias->largo[$index],
                        ':ancho' => $mercancias->ancho[$index],
                        ':volumen' => $mercancias->volumen[$index],
                        ':flete' => $mercancias->flete[$index],
                        ':util' => $mercancias->utilidad[$index],
                        ':tarifa' => $mercancias->tarifa[$index],
                        ':rentable' => $mercancias->rentable[$index],
                        ':ti_carga' => $mercancias->operacion[$index],
                        ':tipo_transporte' => $mercancias->trnsporte[$index],
                        ':item' => $mercancias->itemm[$index],
                        ':process' => 'Pen-Sol-Ser',
                        ':mercancia' => $merca,
                        ':val_merca' => $mercancias->valor[$index],
                        ':canti_e' => $mercancias->cantidad[$index],
                        ':tipo_empaq' => $mercancias->empaque[$index],
                        ':natura' => $mercancias->natura[$index],
                        ':obs' => $mercancias->observa[$index],
                        ':canti_veh' => $mercancias->cant_vehic[$index] = 'undefined' ? 1 : $mercancias->cant_vehic[$index],
                        ':cant_gasta' => $mercancias->cant_vehic[$index] = 'undefined' ? 1 : $mercancias->cant_vehic[$index],
                        ':id_producto' => $mercancias->idproducto[$index],
                        ':itr' => $mercancias->itr[$index]
                    ]);

                    // Obtener el último ID insertado
                    $lastInsertId = $this->_db3->lastInsertId();
                    $mercancias->parejaid[$index] = $lastInsertId;

                    /* Insertar la cantidad e vehiculos por solicitud de servicio o cotización */
                    $sql_insert_cantidad = $this->_db3->prepare("INSERT INTO cmx_vehiculos_solicitud_servicio (id, solicitud_id, cantidad_vehiculo, cantidad_gestionada, estado_gestion, usuario, fecha, hora, empresa_id) 
                    VALUES (NULL, :solicitud_id, :cantidad_vehiculo, :cantidad_gestionada, :estado_gestion, :usuario, :fecha, :hora, :empresa_id)");
                    $sql_insert_cantidad->execute([
                        ':solicitud_id' => $numdoc_cabecera,
                        ':cantidad_vehiculo' => $mercancias->cant_vehic[$index] = 'undefined' ? 1 : $mercancias->cant_vehic[$index],
                        ':cantidad_gestionada' => 0,
                        ':estado_gestion' => 'Activo',
                        ':usuario' => $_SESSION['usuario']['nom_usuario'],
                        ':fecha' => $fecha,
                        ':hora' => $hora,
                        ':empresa_id' => $session_empresa_id
                    ]);
                }

                // Insertar datos especiales si están definidos
                // if (isset($especial)) {
                //     foreach ($especial->item_especial as $index => $item_espe) {
                //         $stmt6 = $this->_db3->prepare("INSERT INTO cmx_detalle_servespecial2 (id, tipo_servicio, cantidad, valor_unitario, total_servicio, tarifa, utilidad, rentabilidad, n_cotizacion, tarifa_unitaria, item_mercancia, item_especial)
                //         VALUES (:idt, :tipo_servicio, :canti, :valuni, :total, :tarif, :utilid, :renta, :n_cotizacion, :tariuni, :itemmerca, :itemespe)");
                //         $stmt6->execute([
                //             ':idt' => null,
                //             ':tipo_servicio' => $especial->tipo_servicio[$index],
                //             ':canti' => $especial->cant[$index],
                //             ':valuni' => $especial->costo_uni[$index],
                //             ':total' => $especial->calculo[$index],
                //             ':tarif' => $especial->tarifa[$index],
                //             ':utilid' => $especial->utilidad[$index],
                //             ':renta' => $especial->rentabi[$index],
                //             ':n_cotizacion' =>  $numdoc_cabecera,
                //             ':tariuni' => $especial->tarifa_uni[$index],
                //             ':itemmerca' => $especial->item_mercancia[$index],
                //             ':itemespe' => $item_espe
                //         ]);
                //     }
                // }

                // Todo ha ido bien, se puede hacer commit
                $this->_db3->commit();
                $response = ['success' => true, 'message' => 'La cotización se ha creado exitosamente.', 'numero_cotizacion' => $numdoc_cabecera, 'pareja' => $lastInsertId];
            } else {
                // No hay números disponibles, lanzar excepción o manejar el caso de otra manera
                // Registrar el error en un archivo de log en la raíz del proyecto
                $errorMessage = "Error en la transacción al seleccionar el maestro: " . "No hay números disponibles para crear una nueva cotización." . " " . date("Y-m-d H:i:s") . " " . $usuario . "\n";
                $logFilePath = 'error_log.txt'; // Ajusta la ruta según la estructura de tu proyecto
                error_log($errorMessage, 3, $logFilePath);

                // Verificar si el archivo de log se ha escrito correctamente
                if (!file_exists($logFilePath)) {
                    error_log("No se pudo crear el archivo de log: $logFilePath\n", 3, $logFilePath);
                }
                $response = ['success' => false, 'message' => 'Ha ocurrido un error al crear la cotización. Por favor, inténtelo nuevamente más tarde.</br>Por favor comunicarse con el equipo de desarrollo.'];
            }
        } catch (PDOException $e) {
            // Algo salió mal, se hace rollback
            $this->_db3->rollBack();
            // Registrar el error en un archivo de log en la raíz del proyecto
            $errorMessage = "Error en la transacción al crear la cotización: " . $e->getMessage() . " " . date("Y-m-d H:i:s") . " " . $usuario . "\n";
            $logFilePath = 'error_log.txt'; // Ajusta la ruta según la estructura de tu proyecto
            error_log($errorMessage, 3, $logFilePath);

            // Verificar si el archivo de log se ha escrito correctamente
            if (!file_exists($logFilePath)) {
                error_log("No se pudo crear el archivo de log: $logFilePath\n", 3, $logFilePath);
            }

            // Mostrar un mensaje amigable al usuario
            $response = ['success' => false, 'message' => 'Ha ocurrido un error al crear la cotización. Por favor, inténtelo nuevamente más tarde.</br>Por favor comunicarse con el equipo de desarrollo.'];
        }
        return $response;
    }

    public function getPrueba($tipo, $fi, $ff, $estado, $cliente, $empresa, $comercial)
    {

        $response = [];

        if ($tipo == '2') {
            if ($estado == "Todas") {
                try {
                    //Validar el perfil para el sql
                    if ($_SESSION['usuario']['id_perfil'] === 7) {
                        // if ($_SESSION['usuario']['id_perfil'] == 7 || $_SESSION['usuario']['id_perfil'] == 1) {
                        $query = "SELECT ss.nundoc_solicitud, coti.nombre_cliente, m.itr, coti.estado AS estado_autorizacion, 
                            m.tipo_servicio_mer, m.peso_neto_kg, CONCAT(ss.fecha, '-', ss.hora) AS fecha_solicitud_servicio,
                            ss.estado, coti.id, coti.n_cotizacion, m.tipo_transporte, m.tipo_mercancia, coti.estado_autorizado,
                            ss.prioritaria, emp.nombre_empresa,cl.id AS Cliente_Id,
                            CASE 
                                WHEN ec.estado IS NOT NULL THEN ec.estado 
                                WHEN ses.estado IS NOT NULL THEN ses.estado 
                                ELSE 'Sin Estado'
                            END AS estado_estudio,
                            coti.elaborado_por
                        FROM cmx_cotizaciones_serviciocliente coti
                        INNER JOIN cmx_detalle_mercancia2 m ON coti.n_cotizacion = m.n_cotizacion
                        INNER JOIN cmx_solicitud_vehiculo2 ss ON coti.n_cotizacion = ss.n_cotizacion
                        INNER JOIN cmx_clientes cl ON coti.id_cliente = cl.id
                        INNER JOIN cmx_empresas emp ON cl.empresa = emp.id
                        LEFT JOIN cmx_preestudio_solicitudes_servicio se ON ss.nundoc_solicitud = se.id_servicio_cliente
                        LEFT JOIN cmx_estudiov_completo ec ON se.id_solicitudpreestudio = ec.id_estudio AND ec.estado_actu = 1
                        LEFT JOIN cmx_solicitudes_estados ses ON se.id_solicitudpreestudio = ses.id_solicitud AND ses.estado_actual = 1
                        WHERE coti.fecha_creacion BETWEEN :fi AND :ff AND coti.elaborado_por = :comercial";

                        $query .= " GROUP BY coti.n_cotizacion ORDER BY coti.id DESC";
                        // Preparar y ejecutar consulta principal
                        $sql = $this->_db3->prepare($query);
                        $params_main = [':fi' => $fi, ':ff' => $ff];

                        $params_main[':comercial'] = empty($comercial) ? $_SESSION['usuario']['nom_usuario'] : $comercial;
                        $sql->execute($params_main);
                        $result_cotizaciones = $sql->fetchAll(PDO::FETCH_ASSOC);
                    } else {
                        $query = "SELECT ss.nundoc_solicitud, coti.nombre_cliente, m.itr, coti.estado AS estado_autorizacion, 
                            m.tipo_servicio_mer, m.peso_neto_kg, CONCAT(ss.fecha, '-', ss.hora) AS fecha_solicitud_servicio,
                            ss.estado, coti.id, coti.n_cotizacion, m.tipo_transporte, m.tipo_mercancia, coti.estado_autorizado,
                            ss.prioritaria, emp.nombre_empresa,cl.id AS Cliente_Id,
                            CASE 
                                WHEN ec.estado IS NOT NULL THEN ec.estado 
                                WHEN ses.estado IS NOT NULL THEN ses.estado 
                                ELSE 'Sin Estado'
                            END AS estado_estudio,
                            coti.elaborado_por
                        FROM cmx_cotizaciones_serviciocliente coti
                        INNER JOIN cmx_detalle_mercancia2 m ON coti.n_cotizacion = m.n_cotizacion
                        INNER JOIN cmx_solicitud_vehiculo2 ss ON coti.n_cotizacion = ss.n_cotizacion
                        INNER JOIN cmx_clientes cl ON coti.id_cliente = cl.id
                        INNER JOIN cmx_empresas emp ON cl.empresa = emp.id
                        LEFT JOIN cmx_preestudio_solicitudes_servicio se ON ss.nundoc_solicitud = se.id_servicio_cliente
                        LEFT JOIN cmx_estudiov_completo ec ON se.id_solicitudpreestudio = ec.id_estudio AND ec.estado_actu = 1
                        LEFT JOIN cmx_solicitudes_estados ses ON se.id_solicitudpreestudio = ses.id_solicitud AND ses.estado_actual = 1
                        WHERE coti.fecha_creacion BETWEEN :fi AND :ff";

                        // Filtros opcionales
                        if ($cliente != null) {
                            $query .= " AND coti.id_cliente = :cliente";
                        }

                        if ($empresa != null) {
                            $query .= " AND emp.id = :empresa";
                        }

                        if ($comercial != null) {
                            $query .= " AND coti.elaborado_por= :comercial";
                        }

                        $query .= " GROUP BY coti.n_cotizacion ORDER BY coti.id DESC";

                        // Preparar y ejecutar consulta principal
                        $sql = $this->_db3->prepare($query);
                        $params_main = [':fi' => $fi, ':ff' => $ff];
                        if (!empty($cliente)) {
                            $params_main[':cliente'] = $cliente;
                        }

                        if (!empty($empresa)) {
                            $params_main[':empresa'] = $empresa;
                        }

                        if (!empty($comercial)) {
                            // $query .= " AND coti.elaborado_por = :comercial";
                            $params_main[':comercial'] = $comercial;
                        }

                        $sql->execute($params_main);
                        $result_cotizaciones = $sql->fetchAll(PDO::FETCH_ASSOC);
                    }

                    // Consulta de conteo
                    $query_cantidad = "SELECT COUNT(coti.id) AS total_cotizaciones 
                        FROM cmx_cotizaciones_serviciocliente coti
                        LEFT JOIN cmx_clientes cl ON coti.id_cliente = cl.id
                        LEFT JOIN cmx_empresas emp ON cl.empresa = emp.id
                        WHERE fecha_creacion BETWEEN :fi AND :ff";

                    if (!empty($cliente)) {
                        $query_cantidad .= " AND coti.id_cliente = :cliente";
                    }

                    if (!empty($empresa)) {
                        $query_cantidad .= " AND emp.id = :empresa";
                    }

                    if (!empty($comercial)) {
                        $query .= " AND coti.elaborado_por = :comercial";
                    }

                    $sql_cantidad = $this->_db3->prepare($query_cantidad);
                    $params_count = [':fi' => $fi, ':ff' => $ff];
                    if (!empty($cliente)) {
                        $params_count[':cliente'] = $cliente;
                    }

                    if (!empty($empresa)) {
                        $params_count[':empresa'] = $empresa;
                    }

                    if (!empty($comercial)) {
                        $params_main[':comercial'] = $comercial;
                    }

                    $sql_cantidad->execute($params_count);
                    $result_cantidad_cotizaciones = $sql_cantidad->fetch(PDO::FETCH_ASSOC);

                    return [
                        'resultado' => $result_cotizaciones,
                        'resultado_cantidad' => $result_cantidad_cotizaciones,
                    ];
                } catch (PDOException $e) {
                    error_log("Error en la consulta SQL: " . $e->getMessage());
                    return [
                        'error' => 'Ocurrió un error al ejecutar la consulta.',
                        'detalles' => $e->getMessage()
                    ];
                }
            } else if ($estado == "Pendiente") {
                try {
                    //Validar el perfil para el sql
                    if ($_SESSION['usuario']['id_perfil'] == 7) {
                        // if ($_SESSION['usuario']['id_perfil'] == 7 || $_SESSION['usuario']['id_perfil'] == 1) {
                        // Construir la consulta en una variable de tipo string
                        $query = "SELECT ss.nundoc_solicitud, 
                                coti.nombre_cliente, 
                                m.itr, 
                                coti.estado AS estado_autorizacion, 
                                m.tipo_servicio_mer, 
                                m.peso_neto_kg, 
                                CONCAT(ss.fecha, '-', ss.hora) AS fecha_solicitud_servicio,
                                ss.estado, 
                                coti.id, 
                                coti.n_cotizacion, 
                                m.tipo_transporte, 
                                m.tipo_mercancia, 
                                coti.estado_autorizado, 
                                emp.nombre_empresa,
                                CASE 
                                    WHEN ec.estado IS NOT NULL THEN ec.estado 
                                    WHEN ses.estado IS NOT NULL THEN ses.estado 
                                    ELSE 'Sin Estado'
                                END AS estado_estudio
                            FROM cmx_cotizaciones_serviciocliente coti
                            INNER JOIN cmx_detalle_mercancia2 m ON coti.n_cotizacion = m.n_cotizacion
                            INNER JOIN cmx_solicitud_vehiculo2 ss ON coti.n_cotizacion = ss.n_cotizacion
                            INNER JOIN cmx_clientes cl ON coti.id_cliente = cl.id
                            INNER JOIN cmx_empresas emp ON cl.empresa = emp.id
                            LEFT JOIN cmx_preestudio_solicitudes_servicio se ON ss.nundoc_solicitud = se.id_servicio_cliente
                            LEFT JOIN cmx_estudiov_completo ec ON se.id_solicitudpreestudio = ec.id_estudio 
                                                                AND ec.estado_actu = 1 
                                                                AND ec.estado = 'vencida'
                            LEFT JOIN cmx_solicitudes_estados ses ON se.id_solicitudpreestudio = ses.id_solicitud 
                                                                AND ses.estado_actual = 1 
                                                                AND ses.estado = 'vencida'
                            WHERE coti.fecha_creacion >= '2025-01-01' 
                            AND ss.estado = 'Pendiente' AND coti.elaborado_por = :comercial";

                        // Parámetros para la consulta
                        $params = [];

                        // Agregar filtro por cliente si está definido
                        if ($cliente !== null) {
                            $query .= " AND coti.id_cliente = :cliente";
                            $params[':cliente'] = $cliente;
                        }

                        if ($comercial !== null) {
                            $query .= " AND coti.elaborado_por = :comercial";
                            $params[':comercial'] = $comercial;
                        }
                        $query .= " GROUP BY coti.n_cotizacion ORDER BY coti.id DESC";

                        // Preparar la consulta usando la cadena construida
                        $sql = $this->_db3->prepare($query);

                        // Ejecutar la consulta con los parámetros
                        $sql->execute($params);
                        $result_cotizaciones = $sql->fetchAll(PDO::FETCH_ASSOC);

                        $response = [
                            'resultado' => $result_cotizaciones
                        ];
                        return $response;
                    } else {
                        // Construir la consulta en una variable de tipo string
                        $query = "SELECT ss.nundoc_solicitud, 
                    coti.nombre_cliente, 
                    m.itr, 
                    coti.estado AS estado_autorizacion, 
                    m.tipo_servicio_mer, 
                    m.peso_neto_kg, 
                    CONCAT(ss.fecha, '-', ss.hora) AS fecha_solicitud_servicio,
                    ss.estado, 
                    coti.id, 
                    coti.n_cotizacion, 
                    m.tipo_transporte, 
                    m.tipo_mercancia, 
                    coti.estado_autorizado, 
                    emp.nombre_empresa,
                    CASE 
                        WHEN ec.estado IS NOT NULL THEN ec.estado 
                        WHEN ses.estado IS NOT NULL THEN ses.estado 
                        ELSE 'Sin Estado'
                    END AS estado_estudio
                FROM cmx_cotizaciones_serviciocliente coti
                INNER JOIN cmx_detalle_mercancia2 m ON coti.n_cotizacion = m.n_cotizacion
                INNER JOIN cmx_solicitud_vehiculo2 ss ON coti.n_cotizacion = ss.n_cotizacion
                INNER JOIN cmx_clientes cl ON coti.id_cliente = cl.id
                INNER JOIN cmx_empresas emp ON cl.empresa = emp.id
                LEFT JOIN cmx_preestudio_solicitudes_servicio se ON ss.nundoc_solicitud = se.id_servicio_cliente
                LEFT JOIN cmx_estudiov_completo ec ON se.id_solicitudpreestudio = ec.id_estudio 
                                                    AND ec.estado_actu = 1 
                                                    AND ec.estado = 'vencida'
                LEFT JOIN cmx_solicitudes_estados ses ON se.id_solicitudpreestudio = ses.id_solicitud 
                                                    AND ses.estado_actual = 1 
                                                    AND ses.estado = 'vencida'
                WHERE coti.fecha_creacion >= '2025-01-01' 
                AND ss.estado = 'Pendiente'";

                        // Parámetros para la consulta
                        $params = [];

                        // Agregar filtro por cliente si está definido
                        if ($cliente !== null) {
                            $query .= " AND coti.id_cliente = :cliente";
                            $params[':cliente'] = $cliente;
                        }

                        $query .= " GROUP BY coti.n_cotizacion ORDER BY coti.id DESC";

                        // Preparar la consulta usando la cadena construida
                        $sql = $this->_db3->prepare($query);

                        // Ejecutar la consulta con los parámetros
                        $sql->execute($params);
                        $result_cotizaciones = $sql->fetchAll(PDO::FETCH_ASSOC);

                        $response = [
                            'resultado' => $result_cotizaciones
                        ];
                        return $response;
                    }
                    // Construir la consulta en una variable de tipo string
                    $query = "SELECT ss.nundoc_solicitud, 
                    coti.nombre_cliente, 
                    m.itr, 
                    coti.estado AS estado_autorizacion, 
                    m.tipo_servicio_mer, 
                    m.peso_neto_kg, 
                    CONCAT(ss.fecha, '-', ss.hora) AS fecha_solicitud_servicio,
                    ss.estado, 
                    coti.id, 
                    coti.n_cotizacion, 
                    m.tipo_transporte, 
                    m.tipo_mercancia, 
                    coti.estado_autorizado, 
                    emp.nombre_empresa,
                    CASE 
                        WHEN ec.estado IS NOT NULL THEN ec.estado 
                        WHEN ses.estado IS NOT NULL THEN ses.estado 
                        ELSE 'Sin Estado'
                    END AS estado_estudio
                FROM cmx_cotizaciones_serviciocliente coti
                INNER JOIN cmx_detalle_mercancia2 m ON coti.n_cotizacion = m.n_cotizacion
                INNER JOIN cmx_solicitud_vehiculo2 ss ON coti.n_cotizacion = ss.n_cotizacion
                INNER JOIN cmx_clientes cl ON coti.id_cliente = cl.id
                INNER JOIN cmx_empresas emp ON cl.empresa = emp.id
                LEFT JOIN cmx_preestudio_solicitudes_servicio se ON ss.nundoc_solicitud = se.id_servicio_cliente
                LEFT JOIN cmx_estudiov_completo ec ON se.id_solicitudpreestudio = ec.id_estudio 
                                                    AND ec.estado_actu = 1 
                                                    AND ec.estado = 'vencida'
                LEFT JOIN cmx_solicitudes_estados ses ON se.id_solicitudpreestudio = ses.id_solicitud 
                                                    AND ses.estado_actual = 1 
                                                    AND ses.estado = 'vencida'
                WHERE coti.fecha_creacion >= '2025-01-01' 
                AND ss.estado = 'Pendiente'";

                    // Parámetros para la consulta
                    $params = [];

                    // Agregar filtro por cliente si está definido
                    if ($cliente !== null) {
                        $query .= " AND coti.id_cliente = :cliente";
                        $params[':cliente'] = $cliente;
                    }

                    $query .= " GROUP BY coti.n_cotizacion ORDER BY coti.id DESC";

                    // Preparar la consulta usando la cadena construida
                    $sql = $this->_db3->prepare($query);

                    // Ejecutar la consulta con los parámetros
                    $sql->execute($params);
                    $result_cotizaciones = $sql->fetchAll(PDO::FETCH_ASSOC);

                    $response = [
                        'resultado' => $result_cotizaciones
                    ];
                    return $response;
                } catch (PDOException $e) {
                    // Manejar el error
                    error_log("Error en la consulta SQL: " . $e->getMessage());
                    return [
                        'error' => 'Ocurrió un error al ejecutar la consulta.',
                        'detalles' => $e->getMessage()
                    ];
                }
            } else if ($estado == "Prioritarias") { // Prioritarias
                try {
                    // Construcción dinámica de la consulta
                    $sqlBase = "SELECT ss.nundoc_solicitud, coti.nombre_cliente, m.itr, coti.estado AS estado_autorizacion, 
                                m.tipo_servicio_mer, m.peso_neto_kg, CONCAT(ss.fecha, '-', ss.hora) AS fecha_solicitud_servicio,
                                ss.estado, coti.id, coti.n_cotizacion, m.tipo_transporte, m.tipo_mercancia, 
                                coti.estado_autorizado, ss.prioritaria, emp.nombre_empresa,
                                    CASE 
                                        WHEN ec.estado IS NOT NULL THEN ec.estado 
                                        WHEN ses.estado IS NOT NULL THEN ses.estado 
                                        ELSE 'Sin Estado'
                                    END AS estado_estudio
                                FROM cmx_cotizaciones_serviciocliente coti
                                INNER JOIN cmx_detalle_mercancia2 m ON coti.n_cotizacion = m.n_cotizacion
                                INNER JOIN cmx_solicitud_vehiculo2 ss ON coti.n_cotizacion = ss.n_cotizacion
                                INNER JOIN cmx_clientes cl ON coti.id_cliente = cl.id
                                INNER JOIN cmx_empresas emp ON cl.empresa = emp.id
                                LEFT JOIN cmx_preestudio_solicitudes_servicio se ON ss.nundoc_solicitud = se.id_servicio_cliente
                                LEFT JOIN cmx_estudiov_completo ec ON se.id_solicitudpreestudio = ec.id_estudio AND ec.estado_actu = 1
                                LEFT JOIN cmx_solicitudes_estados ses ON se.id_solicitudpreestudio = ses.id_solicitud AND ses.estado_actual = 1
                                WHERE coti.fecha_creacion >= '2025-01-01'
                                AND (ss.prioritaria = 'Propuesta' OR ss.prioritaria = 'Aprobada')";

                    // Parámetros para la consulta
                    $params = [];

                    // Agregar filtro por cliente si está definido
                    if (!empty($cliente)) {
                        $sqlBase .= " AND coti.id_cliente = :cliente";
                        $params[':cliente'] = $cliente;
                    }

                    $sqlBase .= " GROUP BY coti.n_cotizacion ORDER BY coti.id DESC";

                    // Preparar la consulta
                    $sql = $this->_db3->prepare($sqlBase);

                    // Ejecutar la consulta con los parámetros
                    $sql->execute($params);
                    $result_cotizaciones = $sql->fetchAll(PDO::FETCH_ASSOC);

                    $response = [
                        'resultado' => $result_cotizaciones
                    ];
                    return $response;
                } catch (PDOException $e) {
                    error_log("Error en la consulta SQL: " . $e->getMessage());
                    return [
                        'error' => 'Ocurrió un error al ejecutar la consulta.',
                        'detalles' => $e->getMessage()
                    ];
                }
            } else if ($estado == "En_Curso") {
                try {
                    // Base de la consulta
                    $sqlBase = "SELECT 
                                    ss.nundoc_solicitud, 
                                    coti.nombre_cliente, 
                                    m.itr, 
                                    coti.estado AS estado_autorizacion, 
                                    m.tipo_servicio_mer, 
                                    m.peso_neto_kg, 
                                    CONCAT(ss.fecha, '-', ss.hora) AS fecha_solicitud_servicio,
                                    ss.estado, 
                                    coti.id, 
                                    coti.n_cotizacion, 
                                    m.tipo_transporte, 
                                    m.tipo_mercancia,
                                    coti.estado_autorizado,
                                    ss.prioritaria,
                                    emp.nombre_empresa,
                                    CASE 
                                        WHEN ec.estado IS NOT NULL THEN ec.estado 
                                        WHEN ses.estado IS NOT NULL THEN ses.estado 
                                        ELSE 'Sin Estado'
                                    END AS estado_estudio
                                FROM cmx_cotizaciones_serviciocliente coti
                                INNER JOIN cmx_detalle_mercancia2 m ON coti.n_cotizacion = m.n_cotizacion
                                INNER JOIN cmx_solicitud_vehiculo2 ss ON coti.n_cotizacion = ss.n_cotizacion
                                INNER JOIN cmx_clientes cl ON coti.id_cliente = cl.id
                                INNER JOIN cmx_empresas emp ON cl.empresa = emp.id
                                INNER JOIN cmx_preestudio_solicitudes_servicio se ON ss.nundoc_solicitud = se.id_servicio_cliente
                                LEFT JOIN cmx_estudiov_completo ec ON se.id_solicitudpreestudio = ec.id_estudio AND ec.estado_actu= 1 
								AND (ec.estado='Pendiente' OR ec.estado='iniciado' OR ec.estado='pendiente_iniciar')
                                LEFT JOIN cmx_solicitudes_estados ses ON se.id_solicitudpreestudio = ses.id_solicitud 
								AND ses.estado_actual = 1 AND (ses.estado='iniciado' OR ses.estado='pendiente_iniciar')	
                                WHERE coti.fecha_creacion >= :fecha_creacion AND (ec.estado IS NOT NULL OR ses.estado IS NOT NULL)";

                    // Array de parámetros
                    $params = [
                        ':fecha_creacion' => '2025-01-01',
                        // ':fecha_inicial' => date('Y-m-d'),
                        // ':fecha_final' => date('Y-m-d')
                    ];

                    // Agregar filtro por cliente si está definido
                    if (!empty($cliente)) {
                        $sqlBase .= " AND coti.id_cliente = :cliente";
                        $params[':cliente'] = $cliente;
                    }

                    // Agregar GROUP BY y ORDER BY
                    $sqlBase .= " GROUP BY 
                                        coti.n_cotizacion,
                                        ss.nundoc_solicitud,
                                        coti.nombre_cliente,
                                        m.itr,
                                        coti.estado,
                                        m.tipo_servicio_mer,
                                        m.peso_neto_kg,
                                        ss.fecha,
                                        ss.hora,
                                        ss.estado,
                                        coti.id,
                                        m.tipo_transporte,
                                        m.tipo_mercancia,
                                        coti.estado_autorizado,
                                        ss.prioritaria,
                                        emp.nombre_empresa
                                ORDER BY coti.id DESC";

                    // Preparar y ejecutar la consulta
                    $sql = $this->_db3->prepare($sqlBase);
                    $sql->execute($params);

                    $result_cotizaciones = $sql->fetchAll(PDO::FETCH_ASSOC);

                    $response = [
                        'resultado' => $result_cotizaciones,
                    ];
                    return $response;
                } catch (PDOException $e) {
                    error_log("Error en la consulta SQL: " . $e->getMessage());
                    return [
                        'error' => 'Ocurrió un error al ejecutar la consulta.',
                        'detalles' => $e->getMessage()
                    ];
                }
            }
        }
    }

    public function Editar_Cabecera($num_cotizacion)
    {
        $sql = $this->_db3->prepare('SELECT * FROM cmx_cotizaciones_serviciocliente cab WHERE cab.n_cotizacion= ' . $num_cotizacion . '');
        $sql->execute();
        $resultado = $sql->fetch(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Consultem_No($num_cotizacion)
    {
        $sql = $this->_db3->prepare("SELECT cdm.*, cdm.id as idm, tv.id, tv.nombre , CONCAT(C1.municipio,'-',C1.depto)AS o ,CONCAT(C2.municipio,'-',C2.depto) AS d,e.empaque
       FROM cmx_detalle_mercancia2 cdm
       INNER JOIN cmx_para_tipo_vehiculo tv ON cdm.tipo_vehiculo=tv.id
       INNER JOIN cmx_municipios C1 ON cdm.origen=C1.rndc_codigo_ciudad
       INNER JOIN cmx_municipios C2 ON cdm.destino=C2.rndc_codigo_ciudad
       INNER JOIN cmx_para_tipo_empaque e ON cdm.tipo_empaque=e.id
       WHERE cdm.n_cotizacion=" . $num_cotizacion . "");
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function No_Consulta_E($num_cotizacion)
    {
        $sql = $this->_db3->prepare('SELECT * FROM  cmx_detalle_servespecial2  espe WHERE espe.n_cotizacion= ' . $num_cotizacion . '');
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Visualizar_cotizacion($numero_cotizacion)
    {
        $sql = $this->_db3->prepare('SELECT * FROM cmx_cotizaciones_serviciocliente ccs WHERE ccs.n_cotizacion=' . $numero_cotizacion . ' ');
        $sql->execute();
        $resultado = $sql->fetch(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Visualizar_Mercancias($numero_cotizacion)
    {
        $sql = $this->_db3->prepare("SELECT cdm.*, tv.nombre, CONCAT(C1.municipio,'-',C1.depto) AS orig, CONCAT(C2.municipio,'-',C2.depto) AS dest , e.empaque,
        C1.rndc_codigo_ciudad AS Codigo_Origen, C2.rndc_codigo_ciudad AS Codigo_Destino
    					FROM cmx_detalle_mercancia2 cdm
    					INNER JOIN cmx_para_tipo_vehiculo tv ON cdm.tipo_vehiculo=tv.id
    					INNER JOIN cmx_municipios C1 ON cdm.origen=C1.rndc_codigo_ciudad
    					INNER JOIN cmx_municipios C2 ON cdm.destino=C2.rndc_codigo_ciudad
    					INNER JOIN cmx_para_tipo_empaque e ON cdm.tipo_empaque=e.id
    					WHERE cdm.n_cotizacion=" . $numero_cotizacion . "");
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Visualizar_Servicios_Especiales($numero_cotizacion)
    {
        $sql = $this->_db3->prepare("SELECT * FROM cmx_detalle_servespecial2 cde WHERE cde.n_cotizacion=" . $numero_cotizacion . " ");
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Historico_Cotizaciones($id)
    {
        $response = [];
        $sql = $this->_db3->prepare('SELECT e.estado,e.n_cotizacion,e.fecha,e.hora,e.user_log, m.id AS pareja, m.item, m.proceso, m.tipo_mercancia FROM cmx_estados_cotizacion e
				INNER JOIN cmx_detalle_mercancia2 m ON e.n_cotizacion=m.n_cotizacion
				WHERE e.n_cotizacion=' . $id . ' ORDER BY e.fecha , e.hora DESC');
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        if ($resultado) {
            $sql2 = $this->_db3->prepare('SELECT * FROM cmx_respuestas_cotizaciones WHERE idcotizacion=' . $id . '');
            $sql2->execute();
            $resultado2 = $sql2->fetchAll(PDO::FETCH_ASSOC);
        }

        $response = [
            'resultado' => $resultado,
            'resultado2' => $resultado2,
        ];
        return $response;
    }

    public function T_Solicitudes_Servicio($ncotiza)
    {
        $sql = $this->_db3->prepare("SELECT s.nundoc_solicitud AS id,s.fecha, s.hora, s.estado, s.usuario_auditor,s.proceso, m.n_cotizacion, m.id AS pareja,m.item, m.tipo_mercancia
			FROM cmx_solicitud_vehiculo2 s
			INNER JOIN cmx_detalle_mercancia2 m ON s.idpareja_origen_destino=m.id
			WHERE s.n_cotizacion=" . $ncotiza . "");
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function listado_Solicitudes_Servicio($id)
    {
        $sql = $this->_db3->prepare("SELECT a.id, a.n_cotizacion,a.nombre_cliente,a.estado_autorizado,b.id AS parejaod,b.tipo_servicio_mer, b.origen,
        b.destino, b.peso_neto_kg, b.tipo_vehiculo, b.flete,
        b.item, b.tipo_carga, b.tipo_transporte, b.cant_vehiculo, b.cant_gastar,
        soli.idpareja_origen_destino, soli.nundoc_solicitud AS soliid,
        soli.estado, b.tipo_mercancia, a.id_cliente, b.tipo_transporte,soli.nundoc_solicitud
        FROM cmx_cotizaciones_serviciocliente a
        INNER JOIN cmx_detalle_mercancia2 b ON a.n_cotizacion=b.n_cotizacion
        LEFT JOIN cmx_solicitud_vehiculo2 soli ON b.id=soli.idpareja_origen_destino
        AND soli.estado IN('Pendiente', 'Realizada','En_subasta','asignada','en_tramite','aprobado_prefiltro')
        WHERE a.n_cotizacion=" . $id . " AND a.estado_autorizado='autorizado' AND a.estado='F3'");
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Consulta_Solictude_Servicio($numero_cotizacion, $solicitud_servicio)
    {
        $sql =  $this->_db3->prepare("SELECT se.nundoc_solicitud AS id, se.n_cotizacion, se.nombre_cliente, se.peso_kg,
        mno.municipio AS origen, mnd.municipio AS destino, ag.nombre AS agencia,
        se.devol_contenedor, se.devol_dias, se.devol_municipio,se.devol_direccion, se.devol_tipocont,
        se.devol_numcont, se. devol_comodato,veh.nombre, mer.tipo_mercancia
        FROM cmx_solicitud_vehiculo2 se
        INNER JOIN cmx_detalle_mercancia2 mer ON se.idpareja_origen_destino=mer.id
        INNER JOIN cmx_municipios mno ON se.origen=mno.rndc_codigo_ciudad
        INNER JOIN cmx_municipios mnd ON se.destino=mnd.rndc_codigo_ciudad
        INNER JOIN cmx_agencias ag ON se.agencia=ag.id
        INNER JOIN cmx_para_tipo_vehiculo veh ON se.tipo_vehiculo = veh.id
        WHERE se.nundoc_solicitud=" . $solicitud_servicio);
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Consulta_Remitentes($numero_cotizacion, $solicitud_servicio)
    {
        $response = [];
        $sql =  $this->_db3->prepare("SELECT a.id, rd.nombre, a.direccion_entrega, a.fecha_estimada_entrega,
        a.observacion, a.hora_estimada, a.tipo, a.telefono,
        a.peso, a.lugar, mn.municipio
        FROM cmx_ruta_puntosentrega a
        INNER JOIN cmx_remitente_destinatario rd ON a.cliente=rd.id
        INNER JOIN cmx_municipios mn ON a.municipio_entrega=mn.id
        WHERE a.cod_ini_ruta=" . $solicitud_servicio);
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);

        $sql2 =  $this->_db3->prepare("SELECT remi.id AS remitente, inf.*, des.nombre, mn.municipio
			FROM cmx_destinatarios_ss inf
			INNER JOIN cmx_remitente_destinatario des ON inf.cliente=des.id
			INNER JOIN cmx_ruta_puntosentrega remi ON inf.solicitud_servicio=cod_ini_ruta AND inf.id_punto=remi.id_punto
			INNER JOIN cmx_municipios mn ON inf.municipio_entrega=mn.id
			WHERE inf.solicitud_servicio=" . $solicitud_servicio);
        $sql2->execute();
        $resultado2 = $sql2->fetchAll(PDO::FETCH_ASSOC);
        $response = [
            'resultado' => $resultado,
            'resultado2' => $resultado2,
        ];
        return $response;
    }

    public function Consultar_Servicios($cotizar, $item)
    {
        // Utilizando parámetros de consulta seguros
        $sql = $this->_db3->prepare('SELECT 
            CONCAT(b.municipio, "-", b.depto) AS origi,
            CONCAT(c.municipio, "-", c.depto) AS desti,
            ve.nombre
        FROM cmx_detalle_mercancia2 a
        INNER JOIN cmx_municipios b ON a.origen = b.rndc_codigo_ciudad
        INNER JOIN cmx_municipios c ON a.destino = c.rndc_codigo_ciudad
        INNER JOIN cmx_para_tipo_vehiculo ve ON a.tipo_vehiculo = ve.id
        WHERE a.n_cotizacion = :cotizar AND a.item = :item
        ');

        // Vinculando los parámetros
        $sql->bindParam(':cotizar', $cotizar, PDO::PARAM_INT);
        $sql->bindParam(':item', $item, PDO::PARAM_INT);

        // Ejecutando la consulta
        $sql->execute();

        // Obteniendo todos los resultados como un array asociativo
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);

        return $resultado;
    }

    public function Consultar_Grupos($fecha, $cliente)
    {
        $response = [];
        $sql = $this->_db3->prepare("SELECT g.* FROM cmx_grupo g
        INNER JOIN cmx_clientes cl ON g.id_cliente=cl.id
        WHERE g.estado=1 AND cl.nombre='" . $cliente . "'");
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);

        $sql2 = $this->_db3->prepare("SELECT g.*,cl.nombre FROM cmx_cliente_hora g
        INNER JOIN cmx_clientes cl ON g.id_cliente=cl.id 
        WHERE cl.nombre='" . $cliente . "'");
        $sql2->execute();
        $resultado2 = $sql2->fetchAll(PDO::FETCH_ASSOC);
        $response = [
            'resultado' => $resultado,
            'resultado2' => $resultado2,
        ];
        return $response;
    }

    public function Traer_Agencia()
    {
        $sql = $this->_db3->prepare("SELECT  * FROM cmx_agencias WHERE estado='Activo'");
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Traer_escenario()
    {
        $sql = $this->_db3->prepare("SELECT  * FROM cmx_escenario_solicitud_servicio WHERE estado_escenario='Activo'");
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Municipios_Table($origen, $destino, $cotizacion)
    {
        $response = [];
        $sql = $this->_db3->prepare('SELECT CONCAT(municipio,"-",depto) AS origi
        FROM cmx_detalle_mercancia2 a
        INNER JOIN cmx_municipios b ON a.origen=b.rndc_codigo_ciudad
        WHERE b.rndc_codigo_ciudad=' . $origen . ' AND a.n_cotizacion=' . $cotizacion . '');
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);

        $sql2 =  $this->_db3->prepare('SELECT CONCAT(municipio,"-",depto) AS desti
					FROM cmx_detalle_mercancia2 a
					INNER JOIN cmx_municipios b ON a.destino=b.rndc_codigo_ciudad
					WHERE b.rndc_codigo_ciudad=' . $destino . '	AND a.n_cotizacion=' . $cotizacion . '  ');
        $sql2->execute();
        $resultado2 = $sql2->fetchAll(PDO::FETCH_ASSOC);
        $response = [
            'origen' => $resultado,
            'destino' => $resultado2,
        ];
        return $response;
    }

    public function Vehiculo_Servicios($idv)
    {
        $sql = $this->_db3->prepare("SELECT nombre FROM cmx_para_tipo_vehiculo WHERE id=" . $idv . "");
        $sql->execute();
        $resultado = $sql->fetch(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Consulta_Movimiento($id, $idpareja, $idsolicitud)
    {
        $response = [];
        $sql = $this->_db3->prepare('SELECT s.n_cotizacion, s.fecha, s.hora,s.estado,s.usuario_auditor,s.proceso,m.n_cotizacion, m.id AS pareja,m.item
        FROM cmx_solicitud_vehiculo2 s
        INNER JOIN cmx_detalle_mercancia2 m ON s.idpareja_origen_destino=m.id
        WHERE s.n_cotizacion=' . $id . ' AND s.idpareja_origen_destino=' . $idpareja . '');
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        $sql2 = $this->_db3->prepare('SELECT a.n_cotizacion, a.fecha, a.hora, a.usuario_auditor,b.estado FROM cmx_solicitud_vehiculo2 a
				INNER JOIN cmx_log_solicitudvehiculo b ON a.nundoc_solicitud=b.id_solictud
				WHERE a.nundoc_solicitud=' . $idsolicitud . ' ');
        $sql2->execute();
        $resultado2 = $sql2->fetchAll(PDO::FETCH_ASSOC);
        $response = [
            'resultado' => $resultado,
            'resultado2' => $resultado2,
        ];
        return $response;
    }

    public function Historial_Cotizaciones($id)
    {
        $response = [];
        $sql = $this->_db3->prepare('SELECT e.*, m.id AS pareja, m.item, m.proceso, m.tipo_mercancia FROM cmx_estados_cotizacion e
        			INNER JOIN cmx_detalle_mercancia2 m ON e.n_cotizacion=m.n_cotizacion
        			WHERE e.n_cotizacion=' . $id . ' ORDER BY e.fecha , e.hora DESC');
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        if ($resultado) {
            $sql2 = $this->_db3->prepare('SELECT * FROM cmx_respuestas_cotizaciones WHERE idcotizacion=' . $id);
            $sql2->execute();
            $resultado2 = $sql2->fetchAll(PDO::FETCH_ASSOC);
        }
        $response = [
            'resultado' => $resultado,
            'resultado2' => $resultado2,
        ];
        return $response;
    }

    // public function Guardar_Solicitud($datos)
    // {
    //     $response = [];
    //     $empresa_id = $_SESSION['usuario']['empresa_id'];

    //     try {
    //         // Iniciar transacción
    //         $this->_db3->beginTransaction();

    //         $numdoc_cabecera = $this->getNumeroActual($empresa_id);
    //         if (!$numdoc_cabecera) {
    //             throw new Exception("No hay números disponibles para crear una nueva Solicitud de servicio.");
    //         }

    //         $this->actualizarNumeroActual($empresa_id, $numdoc_cabecera + 1);
    //         $this->insertarSolicitudVehiculo($datos, $numdoc_cabecera); # Insteratr en cmx_solicitud_vehiculo2
    //         $this->actualizarEstadoNegocio($datos['pareja']);
    //         $this->insertarGrupoClientes($datos["grupo"], $numdoc_cabecera); # Insertar en cmx_grupocliente_servicio
    //         $this->insertarHorasClientes($datos["horacliente"], $datos, $numdoc_cabecera); # Insertar en cmx_horacliente_servicio
    //         $this->insertarPuntosEntrega($datos, $datos["maximo"], $datos["nFilas"], $datos["insertremit"], $numdoc_cabecera); #Insertar en cmx_ruta_puntosentrega
    //         $this->Insertar_Destinatarios($datos, $datos["nFilas"], $datos["maximo"], $datos['insertdesti'], $numdoc_cabecera); #Insertar en cmx_destinatarios_ss

    //         // Confirmar la transacción
    //         $this->_db3->commit();
    //         // Éxito
    //         $response = ['success' => true, 'message' => 'La solicitud de servicio <strong>' . $numdoc_cabecera . '</strong> se ha creado exitosamente.', 'numero_solicitud' => $numdoc_cabecera];
    //     } catch (Exception $e) {
    //         // Algo salió mal, se hace rollback
    //         $this->_db3->rollBack();
    //         // Registrar el error en un archivo de log en la raíz del proyecto
    //         $this->logError($e->getMessage(), $datos['user']);
    //         // Mostrar un mensaje amigable al usuario
    //         $response = ['success' => false, 'message' => 'Ha ocurrido un error al crear la solicitud de servicio. Por favor, inténtelo nuevamente más tarde. O comunicarse con el equipo de desarrollo.'];
    //     }
    //     return $response;
    // }

    // Nueva funcion de solicitud de servicio
    public function crearSolicitud($datos)
    {
        header('Content-Type: application/json; charset=utf-8');

        $response = [];
        $empresa_id = $_SESSION['usuario']['empresa_id'];

        try {
            // Iniciar transacción
            $this->_db3->beginTransaction();

            // $numdoc_cabecera = $this->getNumeroActual($empresa_id);
            // if (!$numdoc_cabecera) {
            //     throw new Exception("No hay números disponibles para crear una nueva Solicitud de servicio.");
            // }
            // $this->actualizarNumeroActual($empresa_id, $numdoc_cabecera + 1);
            $merc = $datos['mercancias'];

            foreach ($merc->mercanc as $index => $m) {

                $num_solicitud = $this->obtenerYActualizarConsecutivo($empresa_id);

                if (!$num_solicitud) {
                    throw new Exception("No hay consecutivos disponibles");
                }
                $bloqueActual = $index + 1;

                // insertar 1 solicitud por cada bloque
                $this->insertarSolicitudVehiculo($datos, $num_solicitud, $index);
                // $this->insertarSolicitudVehiculo($datos, $numdoc_cabecera); # Insteratr en cmx_solicitud_vehiculo2
                $this->actualizarEstadoNegocio($datos['pareja']);
                $this->insertarGrupoClientes($datos["grupo"], $num_solicitud); # Insertar en cmx_grupocliente_servicio
                $this->insertarHorasClientes($datos["hora_email"], $datos, $num_solicitud); # Insertar en cmx_horacliente_servicio

                // $this->insertarPuntosEntrega($datos['remitentes'], $bloqueActual, $num_solicitud);
                // $this->insertarDestinatarios($datos['destinatarios'], $bloqueActual, $num_solicitud);

                // list($remBalanceados, $desBalanceados) =
                //     $this->balancearPuntosPorBloque(
                //         $datos['remitentes'],
                //         $datos['destinatarios'],
                //         $bloqueActual
                //     );

                // $this->insertarPuntosEntrega($remBalanceados, $bloqueActual, $num_solicitud);
                // $this->insertarDestinatarios($desBalanceados, $bloqueActual, $num_solicitud);

                list($remBalanceados, $desBalanceados) =
                    $this->balancearPorRemitente(
                        $datos['remitentes'],
                        $datos['destinatarios'],
                        $bloqueActual
                    );

                $this->insertarPuntosEntrega($remBalanceados, $bloqueActual, $num_solicitud);
                $this->insertarDestinatarios($desBalanceados, $bloqueActual, $num_solicitud);
            }

            // Confirmar la transacción
            $this->_db3->commit();
            // Éxito
            $response = ['success' => true, 'message' => 'La solicitud de servicio <strong>' . $num_solicitud . '</strong> se ha creado exitosamente.', 'numero_solicitud' => $num_solicitud];
        } catch (Exception $e) {
            // Algo salió mal, se hace rollback
            $this->_db3->rollBack();
            // Registrar el error en un archivo de log en la raíz del proyecto
            $this->logError($e->getMessage(), $datos['user']);
            // Mostrar un mensaje amigable al usuario
            $response = ['success' => false, 'message' => 'Ha ocurrido un error al crear la solicitud de servicio. Por favor, inténtelo nuevamente más tarde. O comunicarse con el equipo de desarrollo.'];
        }
        return $response;
    }

    // private function getNumeroActual($empresa_id)
    // {
    //     $sql = "SELECT numero_actual FROM cmx_maestro WHERE tipo='SOLICITUD_SERVICIO' AND numero_actual>numero_inicial AND empresa_id=:empresa_id";
    //     $stmt = $this->_db3->prepare($sql);
    //     $stmt->bindParam(':empresa_id', $empresa_id, PDO::PARAM_STR);
    //     $stmt->execute();
    //     $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
    //     return $resultado['numero_actual'] ?? null;
    // }

    // private function actualizarNumeroActual($empresa_id, $numdoc_actualizar_cabecera)
    // {
    //     $sql = "UPDATE cmx_maestro SET numero_actual=:numdoc_actualizar_cabecera WHERE tipo='SOLICITUD_SERVICIO' AND empresa_id=:empresa_id";
    //     $stmt = $this->_db3->prepare($sql);
    //     $stmt->bindParam(':numdoc_actualizar_cabecera', $numdoc_actualizar_cabecera, PDO::PARAM_INT);
    //     $stmt->bindParam(':empresa_id', $empresa_id, PDO::PARAM_STR);
    //     $stmt->execute();
    // }

    private function obtenerYActualizarConsecutivo($empresa_id)
    {
        $sql = "SELECT numero_actual FROM cmx_maestro 
            WHERE tipo='SOLICITUD_SERVICIO' AND empresa_id=:empresa";

        $stmt = $this->_db3->prepare($sql);
        $stmt->bindParam(':empresa', $empresa_id, PDO::PARAM_STR);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) return null;

        $numero = $row['numero_actual'];

        // actualizar
        $nuevo = $numero + 1;

        $sql2 = "UPDATE cmx_maestro SET numero_actual=:nuevo 
            WHERE tipo='SOLICITUD_SERVICIO' 
            AND empresa_id=:empresa";

        $stmt2 = $this->_db3->prepare($sql2);
        $stmt2->execute([
            ':nuevo' => $nuevo,
            ':empresa' => $empresa_id
        ]);

        return $numero;
    }

    // private function insertarSolicitudVehiculo($datos, $numdoc_cabecera)
    // {
    //     //escenario_id
    //     $user = $_SESSION["usuario"]["nom_usuario"];
    //     $sql = "INSERT INTO cmx_solicitud_vehiculo2(id, n_cotizacion, nundoc_solicitud, fecha, hora, estado, usuario_auditor, origen, destino, peso_kg, nombre_cliente, tipo_vehiculo, flete, idpareja_origen_destino, observaciones, proceso, agencia, devol_contenedor, devol_dias, devol_municipio, devol_direccion, devol_tipocont, devol_numcont, devol_comodato, cant_vehiculo, cant_disponible, devol_pesovacio,escenario_id,empresa_id)
    //             VALUES(NULL, :cotizacion, :nundoc_solicitud ,:fecha_reg, :hora_reg, :estado, :user, :ori, :dest, :peso, :cliente, :tipo_veh, :flete, :pareja, :observacion, 'Pen-Sol-PreS', :agencia, :cont_opcion, :cont_dias, :cont_municipio, :cont_direccion, :cont_tipo, :cont_num, :cont_comodato, :cant_solicitada, :cant_disponible, :cont_peso, :escenario_id, :empresa_id)";
    //     $stmt = $this->_db3->prepare($sql);
    //     $stmt->execute([
    //         ':cotizacion' => $datos['cotizacion'],
    //         ':nundoc_solicitud' => $numdoc_cabecera,
    //         ':fecha_reg' => $datos['fecha_reg'],
    //         ':hora_reg' => $datos['hora_reg'],
    //         ':estado' => $datos['estado'],
    //         ':user' => $user,
    //         // ':user' => $datos['user'],
    //         ':ori' => $datos['ori'],
    //         ':dest' => $datos['dest'],
    //         ':peso' => $datos['peso'],
    //         ':cliente' => $datos['nombre_cliente'],
    //         ':tipo_veh' => $datos['tipo_veh'],
    //         ':flete' => $datos['flete'],
    //         ':pareja' => $datos['pareja'],
    //         ':observacion' => $datos['observacion'],
    //         ':agencia' => $datos['agencia'],
    //         // ':cont_opcion' => $datos['cont_opcion'] != 'undefined' ? $datos['cont_opcion'] : 0,
    //         ':cont_opcion' => (int)($datos['cont_opcion'] ?? 0),
    //         ':cont_dias' => $datos['cont_dias'],
    //         ':cont_municipio' => $datos['cont_municipio'],
    //         ':cont_direccion' => $datos['cont_direccion'],
    //         // ':cont_tipo' => $datos['cont_tipo'] != 'undefined' ? $datos['cont_tipo'] : 0,
    //         ':cont_tipo' => (int)($datos['cont_tipo'] ?? 0),
    //         ':cont_num' => $datos['cont_num'],
    //         ':cont_comodato' => $datos['cont_comodato'],
    //         ':cant_solicitada' => $datos['cant_solicitada'],
    //         ':cant_disponible' => $datos['cant_disponible'],
    //         ':cont_peso' => $datos['cont_peso'],
    //         ':empresa_id' => $datos['empresa_id'],
    //         ':escenario_id' => $datos['escenario_id'],
    //     ]);
    // }

    // private function insertarSolicitudVehiculo($datos, $numdoc_solicitud, $index)
    // {
    //     $fecha = date('Y-m-d');
    //     $hora  = date('H:i:s');
    //     $user  = $_SESSION["usuario"]["nom_usuario"];

    //     // Mercancías debe ser un objeto
    //     $merc = $datos['mercancias'];

    //     // foreach ($merc->mercanc as $index => $m) { }

    //     $stmt = $this->_db3->prepare("
    //         INSERT INTO cmx_solicitud_vehiculo2
    //         (id, n_cotizacion, nundoc_solicitud, fecha, hora, estado, usuario_auditor,
    //          origen, destino, peso_kg, nombre_cliente, tipo_vehiculo, flete,
    //          idpareja_origen_destino, observaciones, proceso, agencia,
    //          devol_contenedor, devol_dias, devol_municipio, devol_direccion,
    //          devol_tipocont, devol_numcont, devol_comodato,
    //          cant_vehiculo, cant_disponible, devol_pesovacio,
    //          escenario_id, empresa_id)
    //         VALUES
    //         (NULL, :cot, :sol, :fecha, :hora, :estado, :user,
    //          :origen, :destino, :peso, :cliente, :vehiculo, :flete,
    //          :pareja, :obs, 'Pen-Sol-PreS', :agencia,
    //          :devol_contenedor, :devol_dias, :devol_municipio, :devol_direccion,
    //          :devol_tipocont, :devol_numcont, :devol_comodato,
    //          :cant_vehiculo, :cant_disponible, :devol_pesovacio,
    //          :escenario_id, :empresa_id)
    //     ");

    //     $stmt->execute([
    //         ':cot'              => $datos['cotizacion'],
    //         ':sol'              => $numdoc_solicitud,
    //         ':fecha'            => $fecha,
    //         ':hora'             => $hora,
    //         ':estado'           => 'Pendiente',
    //         ':user'             => $user,

    //         ':origen'           => $merc->origen[$index],
    //         ':destino'          => $merc->destino[$index],
    //         ':peso'             => $merc->brutotn[$index],

    //         ':cliente'          => $datos['name_cliente'],
    //         ':vehiculo'         => $merc->vehiculo[$index],
    //         ':flete'            => $merc->flete[$index],

    //         ':pareja'           => $merc->parejaid[$index],
    //         ':obs'              => $datos['obs'] ?? null,
    //         ':agencia'          => $datos['agencia'],

    //         // AGREGADOS EN NULL O DEFAULT:
    //         ':devol_contenedor' => $datos['devol_contenedor'] ?? null,
    //         ':devol_dias'       => $datos['devol_dias'] ?? null,
    //         ':devol_municipio'  => $datos['devol_municipio'] ?? null,
    //         ':devol_direccion'  => $datos['devol_direccion'] ?? null,
    //         ':devol_tipocont'   => $datos['devol_tipocont'] ?? null,
    //         ':devol_numcont'    => $datos['devol_numcont'] ?? null,
    //         ':devol_comodato'   => $datos['devol_comodato'] ?? null,

    //         ':cant_vehiculo'    => $merc->cant_vehic[$index] ?? 1,
    //         ':cant_disponible'  => $merc->cant_vehic[$index] ?? 1,
    //         ':devol_pesovacio'  => $datos['devol_pesovacio'] ?? 0,

    //         ':escenario_id'     => $datos['escenario_id'] ?? null,
    //         ':empresa_id'       => $datos['empresa']
    //     ]);

    //     return true;
    // }


    private function insertarSolicitudVehiculo($datos, $numdoc_solicitud, $index)
    {
        $fecha = date('Y-m-d');
        $hora  = date('H:i:s');
        $user  = $_SESSION["usuario"]["nom_usuario"];

        $merc = $datos['mercancias'];

        // ----------------------------------
        // CONTENEDOR DEL BLOQUE (SI EXISTE)
        // ----------------------------------
        $bloqueActual = $index + 1;
        $contenedorBloque = null;

        if (!empty($datos['contenedores']) && is_array($datos['contenedores'])) {
            foreach ($datos['contenedores'] as $c) {
                if ((int)$c['bloque'] === $bloqueActual) {
                    $contenedorBloque = $c;
                    break;
                }
            }
        }

        $stmt = $this->_db3->prepare("
            INSERT INTO cmx_solicitud_vehiculo2
            (
                id, n_cotizacion, nundoc_solicitud, fecha, hora, estado, usuario_auditor,
                origen, destino, peso_kg, nombre_cliente, tipo_vehiculo, flete,
                idpareja_origen_destino, observaciones, proceso, agencia,
                devol_contenedor, devol_dias, devol_municipio, devol_direccion,
                devol_tipocont, devol_numcont, devol_comodato,
                cant_vehiculo, cant_disponible, devol_pesovacio,
                escenario_id, empresa_id
            )
            VALUES
            (
                NULL, :cot, :sol, :fecha, :hora, :estado, :user,
                :origen, :destino, :peso, :cliente, :vehiculo, :flete,
                :pareja, :obs, 'Pen-Sol-PreS', :agencia,
                :devol_contenedor, :devol_dias, :devol_municipio, :devol_direccion,
                :devol_tipocont, :devol_numcont, :devol_comodato,
                :cant_vehiculo, :cant_disponible, :devol_pesovacio,
                :escenario_id, :empresa_id
            )
         ");

        $stmt->execute([
            ':cot'              => $datos['cotizacion'],
            ':sol'              => $numdoc_solicitud,
            ':fecha'            => $fecha,
            ':hora'             => $hora,
            ':estado'           => 'Pendiente',
            ':user'             => $user,

            ':origen'           => $merc->origen[$index],
            ':destino'          => $merc->destino[$index],
            ':peso'             => $merc->brutotn[$index],

            ':cliente'          => $datos['name_cliente'],
            ':vehiculo'         => $merc->vehiculo[$index],
            ':flete'            => $merc->flete[$index],

            ':pareja'           => $merc->parejaid[$index],
            ':obs'              => $datos['obs'] ?? null,
            ':agencia'          => $datos['agencia'] ?? null,

            // -------- CONTENEDOR (POR BLOQUE) --------
            ':devol_contenedor' => $contenedorBloque['devuelve_contenedor'] ?? null,
            ':devol_dias'       => $contenedorBloque['fecha_vencimiento'] ?? null,
            ':devol_municipio'  => $contenedorBloque['municipio_devolucion'] ?? null,
            ':devol_direccion'  => $contenedorBloque['direccion_devolucion'] ?? null,
            ':devol_tipocont'   => $contenedorBloque['tipo_contenedor'] ?? null,
            ':devol_numcont'    => $contenedorBloque['numero_contenedor'] ?? null,
            ':devol_comodato'   => $contenedorBloque['fecha_comodato'] ?? null,

            ':cant_vehiculo'    => $merc->cant_vehic[$index] ?? 1,
            ':cant_disponible'  => $merc->cant_vehic[$index] ?? 1,
            ':devol_pesovacio'  => $contenedorBloque['peso_vacio'] ?? 0,

            ':escenario_id'     => $datos['escenario_id'] ?? null,
            ':empresa_id'       => $datos['empresa']
        ]);

        return true;
    }

    private function actualizarEstadoNegocio($pareja)
    {
        $sql = "UPDATE cmx_detalle_mercancia2 SET proceso='Rea-Sol-Ser' WHERE id=:pareja";
        $stmt = $this->_db3->prepare($sql);
        $stmt->bindParam(':pareja', $pareja, PDO::PARAM_INT);
        $stmt->execute();
    }

    private function insertarGrupoClientes($grupo, $id_servicio)
    {
        $grupocliente_array = explode(',', $grupo);
        // Opcional: Eliminar espacios en blanco alrededor de los elementos del array
        $grupocliente_array = array_map('trim', $grupocliente_array);

        foreach ($grupocliente_array as $id_grupo) {
            $sql = "INSERT INTO cmx_grupocliente_servicio (id, id_grupo, id_servicio) VALUES(NULL, :id_grupo, :id_servicio)";
            $stmt = $this->_db3->prepare($sql);
            $stmt->bindParam(':id_servicio', $id_servicio, PDO::PARAM_INT);
            $stmt->bindParam(':id_grupo', $id_grupo, PDO::PARAM_INT);
            $stmt->execute();
        }
    }

    private function insertarHorasClientes($horacliente, $datos, $id_servicio)
    {
        $horacliente_array = explode(',', $horacliente);
        // Opcional: Eliminar espacios en blanco alrededor de los elementos del array
        $horacliente_array = array_map('trim', $horacliente_array);

        foreach ($horacliente_array as $hora_email) {
            // Valida o ajusta el valor de hora_email aquí, si es necesario
            if (strlen($hora_email) > 255) {
                $hora_email = substr($hora_email, 0, 255); // Ajusta el tamaño según tu definición de la columna
            }

            $sql = "INSERT INTO cmx_horacliente_servicio (id, hora_email, id_servicio, usuario, fecha, hora) 
                VALUES(NULL, :hora_email, :id_servicio, :usuario, :fecha, :hora)";
            $stmt = $this->_db3->prepare($sql);
            $stmt->bindParam(':hora_email', $hora_email, PDO::PARAM_STR);
            $stmt->bindParam(':id_servicio', $id_servicio, PDO::PARAM_INT);
            $stmt->bindParam(':usuario', $datos['user'], PDO::PARAM_STR);
            $stmt->bindParam(':fecha', $datos['fecha_reg'], PDO::PARAM_STR);
            $stmt->bindParam(':hora', $datos['hora_reg'], PDO::PARAM_STR);
            $stmt->execute();
        }
    }

    // private function insertarPuntosEntrega($datos, $maximo, $nFilas, $insertremit, $numdoc_cabecera)
    // {
    //     $hora = date('H:i:s');
    //     $fecha = date('Y-m-d');
    //     $sql = "INSERT INTO cmx_ruta_puntosentrega (id, cod_ini_ruta, municipio_entrega, direccion_entrega, cliente, fecha_estimada_entrega, observacion, fecha, hora, usuario, hora_estimada, tipo, orden, telefono, peso, lugar, id_punto)
    //             VALUES (null, :solicitud_servicio1, :mentrega, :dire, :cliente, :fentrega, :obs, :fecha, :hora, :user, :hora_estimada, :tipo, :orden, :telefono, :peso, :sitio, :id_punto)";

    //     if ($datos['escenario_id'] == 1 || $datos['escenario_id'] == 3 || $datos['escenario_id'] == 4 || $datos['escenario_id'] == 5 || $datos['escenario_id'] == 7 || $datos['escenario_id'] == 8) {
    //         $i = 0;
    //         for ($i = 0; $i < $maximo; $i++) {
    //             $stmt = $this->_db3->prepare($sql);
    //             // Bind the parameters
    //             $stmt->bindParam(':solicitud_servicio1', $numdoc_cabecera, PDO::PARAM_INT);
    //             $stmt->bindParam(':mentrega', $insertremit->mentrega[$i], PDO::PARAM_STR);
    //             $stmt->bindParam(':dire', $insertremit->dire[$i], PDO::PARAM_STR);
    //             $stmt->bindParam(':cliente', $insertremit->clientea[$i], PDO::PARAM_STR);
    //             $stmt->bindParam(':fentrega', $insertremit->fentrega[$i], PDO::PARAM_STR);
    //             $stmt->bindParam(':obs', $insertremit->obs[$i], PDO::PARAM_STR);
    //             $stmt->bindParam(':fecha', $fecha, PDO::PARAM_STR);
    //             $stmt->bindParam(':hora', $hora, PDO::PARAM_STR);
    //             $stmt->bindParam(':user', $datos['user'], type: PDO::PARAM_STR);
    //             $stmt->bindParam(':hora_estimada', $insertremit->hora[$i], PDO::PARAM_STR);
    //             $stmt->bindParam(':tipo', $insertremit->tipo[$i], PDO::PARAM_STR);
    //             $stmt->bindParam(':orden', $insertremit->orden[$i], PDO::PARAM_INT);
    //             $stmt->bindParam(':telefono', $insertremit->telefono[$i], PDO::PARAM_STR);
    //             $stmt->bindParam(':peso', $insertremit->pesorem[$i], PDO::PARAM_STR);
    //             $stmt->bindParam(':sitio', $insertremit->place[$i], PDO::PARAM_STR);
    //             $stmt->bindParam(':id_punto', $insertremit->idpuntrem[$i], PDO::PARAM_INT);

    //             // Execute the statement
    //             $stmt->execute();
    //         }
    //     } elseif ($datos['escenario_id'] == 2 || $datos['escenario_id'] == 6) {
    //         for ($i = 0; $i < $nFilas; $i++) {

    //             $stmt = $this->_db3->prepare($sql);
    //             $idpunto = $i + 1;

    //             $stmt->bindParam(':solicitud_servicio1', $numdoc_cabecera, PDO::PARAM_INT);
    //             $stmt->bindParam(':mentrega', $insertremit->mentrega[0], PDO::PARAM_STR); // Remitente fijo
    //             $stmt->bindParam(':dire', $insertremit->dire[0], PDO::PARAM_STR);
    //             $stmt->bindParam(':cliente', $insertremit->clientea[0], PDO::PARAM_STR);
    //             $stmt->bindParam(':fentrega', $insertremit->fentrega[0], PDO::PARAM_STR);
    //             $stmt->bindParam(':obs', $insertremit->obs[0], PDO::PARAM_STR);
    //             $stmt->bindParam(':fecha', $fecha, PDO::PARAM_STR);
    //             $stmt->bindParam(':hora', $hora, PDO::PARAM_STR);
    //             $stmt->bindParam(':user', $datos['user'], PDO::PARAM_STR);
    //             $stmt->bindParam(':hora_estimada', $insertremit->hora[0], PDO::PARAM_STR);
    //             $stmt->bindParam(':tipo', $insertremit->tipo[0], PDO::PARAM_STR);
    //             $stmt->bindParam(':orden', $insertremit->orden[0], PDO::PARAM_INT);
    //             $stmt->bindParam(':telefono', $insertremit->telefono[0], PDO::PARAM_STR);
    //             $stmt->bindParam(':peso', $insertremit->pesorem[0], PDO::PARAM_STR);
    //             $stmt->bindParam(':sitio', $insertremit->place[0], PDO::PARAM_STR);
    //             $stmt->bindParam(':id_punto', $idpunto, PDO::PARAM_INT);

    //             $stmt->execute();
    //         }
    //     }
    // }

    private function insertarPuntosEntrega($remitentes, $bloqueActual, $num_solicitud)
    {
        $hora  = date('H:i:s');
        $fecha = date('Y-m-d');
        $user  = $_SESSION["usuario"]["nom_usuario"];

        $sql = "
        INSERT INTO cmx_ruta_puntosentrega
        (id, cod_ini_ruta, municipio_entrega, direccion_entrega, cliente, 
         fecha_estimada_entrega, observacion, fecha, hora, usuario, 
         hora_estimada, tipo, orden, telefono, peso, lugar, id_punto)
        VALUES 
        (NULL, :solicitud_id, :muni, :dir, :cliente,
         :fecha_estimada, :obs, :fecha, :hora, :user, 
         :hora_estimada, :tipo, :orden, :telefono, :peso, :lugar, :id_punto)
        ";

        $id_punto = 1;

        foreach ($remitentes as $r) {

            // Si el remitente pertenece a este bloque
            if (intval($r['bloque']) !== intval($bloqueActual)) {
                continue;
            }

            $stmt = $this->_db3->prepare($sql);

            $stmt->execute([
                ':solicitud_id'   => $num_solicitud,
                ':muni'           => $r['ciudad'],
                ':dir'            => $r['direccion'],
                ':cliente'        => $r['cliente'],
                ':fecha_estimada' => $r['fecha'],
                ':obs'            => $r['observacion'],
                ':fecha'          => $fecha,
                ':hora'           => $hora,
                ':user'           => $user,
                ':hora_estimada'  => $r['hora'],
                ':tipo'           => 'punto recogida',
                ':orden'          => $r['remitente'],
                ':telefono'       => $r['telefono'],
                ':peso'           => $r['peso'],
                ':lugar'          => $r['lugar'],
                ':id_punto'       => $id_punto,
            ]);

            $id_punto++;
        }
    }

    // private function Insertar_Destinatarios($datos, $nFilas, $maximo, $insertdesti, $numero_solicita)
    // {
    //     $user = $_SESSION["usuario"]["nom_usuario"];
    //     $hora = date('H:i:s');
    //     $fecha = date('Y-m-d');
    //     $sql = "INSERT INTO cmx_destinatarios_ss(id, solicitud_servicio, municipio_entrega, direccion_entrega, cliente,fecha_estimada_entrega, observacion, fecha, hora, usuario,hora_estimada, tipo, orden, telefono, peso, lugar, id_punto, estado_destinatario) 
    //         VALUES (NULL, :numero_solicita, :ciu, :direcci, :desti,:fech, :observacion, :fecha, :hora, :user, :horades, 'punto entrega', 0, :tel, :peso, :lugar, :idpunto, 'PENDIENTE')";

    //     if ($datos['escenario_id'] == 1 || $datos['escenario_id'] == 4 || $datos['escenario_id'] == 5 || $datos['escenario_id'] == 8) {
    //         for ($z = 0; $z < $nFilas; $z++) {
    //             $stmt = $this->_db3->prepare($sql);
    //             $stmt->bindParam(':numero_solicita', $numero_solicita);
    //             $stmt->bindParam(':ciu', $insertdesti->ciudad[$z]);
    //             $stmt->bindParam(':direcci', $insertdesti->direccion[$z]);
    //             $stmt->bindParam(':desti', $insertdesti->destinatario[$z]);
    //             $stmt->bindParam(':fech', $insertdesti->fecha[$z]);
    //             $stmt->bindParam(':observacion', $insertdesti->observacion[$z]);
    //             $stmt->bindParam(':fecha', $fecha); // Assuming $fecha is defined somewhere in your code
    //             $stmt->bindParam(':hora', $hora); // Assuming $hora is defined somewhere in your code
    //             $stmt->bindParam(':user', $user); // Assuming $user is defined somewhere in your code
    //             $stmt->bindParam(':horades', $insertdesti->hora[$z]);
    //             $stmt->bindParam(':tel', $insertdesti->telefono[$z]);
    //             $stmt->bindParam(':peso', $insertdesti->pesobruto[$z]);
    //             $stmt->bindParam(':lugar', $insertdesti->lugar[$z]);
    //             $stmt->bindParam(':idpunto', $insertdesti->idrem[$z]);
    //             $stmt->execute();
    //         }
    //     } elseif ($datos['escenario_id'] == 2 || $datos['escenario_id'] == 6) {
    //         for ($z = 0; $z < $nFilas; $z++) {
    //             $stmt = $this->_db3->prepare($sql);
    //             $stmt->bindParam(':numero_solicita', $numero_solicita);
    //             $stmt->bindParam(':ciu', $insertdesti->ciudad[$z]);
    //             $stmt->bindParam(':direcci', $insertdesti->direccion[$z]);
    //             $stmt->bindParam(':desti', $insertdesti->destinatario[$z]);
    //             $stmt->bindParam(':fech', $insertdesti->fecha[$z]);
    //             $stmt->bindParam(':observacion', $insertdesti->observacion[$z]);
    //             $stmt->bindParam(':fecha', $fecha); // Assuming $fecha is defined somewhere in your code
    //             $stmt->bindParam(':hora', $hora); // Assuming $hora is defined somewhere in your code
    //             $stmt->bindParam(':user', $user); // Assuming $user is defined somewhere in your code
    //             $stmt->bindParam(':horades', $insertdesti->hora[$z]);
    //             $stmt->bindParam(':tel', $insertdesti->telefono[$z]);
    //             $stmt->bindParam(':peso', $insertdesti->pesobruto[$z]);
    //             $stmt->bindParam(':lugar', $insertdesti->lugar[$z]);
    //             $stmt->bindParam(':idpunto', $insertdesti->idrem[$z]);
    //             $stmt->execute();
    //         }
    //     } elseif ($datos['escenario_id'] == 3 || $datos['escenario_id'] == 7) {
    //         for ($z = 0; $z < $maximo; $z++) {
    //             $stmt = $this->_db3->prepare($sql);

    //             $ciu = $insertdesti->ciudad[0];
    //             $direcci = $insertdesti->direccion[0];
    //             $desti = $insertdesti->destinatario[0];
    //             $fech = $insertdesti->fecha[0];
    //             $observacion = $insertdesti->observacion[0];
    //             $horades = $insertdesti->hora[0];
    //             $tel = $insertdesti->telefono[0];
    //             $peso = $insertdesti->pesobruto[0];
    //             $lugar = $insertdesti->lugar[0];
    //             $idpunto = $z + 1;

    //             $stmt->bindParam(':numero_solicita', $numero_solicita);
    //             $stmt->bindParam(':ciu', $ciu);
    //             $stmt->bindParam(':direcci', $direcci);
    //             $stmt->bindParam(':desti', $desti);
    //             $stmt->bindParam(':fech', $fech);
    //             $stmt->bindParam(':observacion', $observacion);
    //             $stmt->bindParam(':fecha', $fecha);
    //             $stmt->bindParam(':hora', $hora);
    //             $stmt->bindParam(':user', $user);
    //             $stmt->bindParam(':horades', $horades);
    //             $stmt->bindParam(':tel', $tel);
    //             $stmt->bindParam(':peso', $peso);
    //             $stmt->bindParam(':lugar', $lugar);
    //             $stmt->bindParam(':idpunto', $idpunto);

    //             $stmt->execute();
    //         }
    //     }
    // }

    private function insertarDestinatarios($destinatarios, $bloqueActual, $num_solicitud)
    {
        $user  = $_SESSION["usuario"]["nom_usuario"];
        $hora  = date('H:i:s');
        $fecha = date('Y-m-d');

        $sql = "
            INSERT INTO cmx_destinatarios_ss
            (id, solicitud_servicio, municipio_entrega, direccion_entrega, cliente,
            fecha_estimada_entrega, observacion, fecha, hora, usuario,
            hora_estimada, tipo, orden, telefono, peso, lugar, id_punto, estado_destinatario)
            VALUES
            (NULL, :solicitud, :ciudad, :direccion, :cliente,
            :fecha_estimada, :observacion, :fecha, :hora, :user,
            :hora_estimada, 'punto entrega', :orden, :telefono, :peso, :lugar, :id_punto, 'PENDIENTE')
        ";

        $id_punto = 1;

        foreach ($destinatarios as $d) {

            // Insertar solo el destinatario del bloque actual
            if (intval($d['bloque']) !== intval($bloqueActual)) {
                continue;
            }

            $stmt = $this->_db3->prepare($sql);

            $stmt->execute([
                ':solicitud'      => $num_solicitud,
                ':ciudad'         => $d['ciudad'],
                ':direccion'      => $d['direccion'],
                ':cliente'        => $d['cliente'],
                ':fecha_estimada' => $d['fecha'],
                ':observacion'    => $d['observacion'],
                ':fecha'          => $fecha,
                ':hora'           => $hora,
                ':user'           => $user,
                ':hora_estimada'  => $d['hora'],
                ':orden'          => $d['remitente'], // mismo que remitente
                ':telefono'       => $d['telefono'],
                ':peso'           => $d['peso'],
                ':lugar'          => $d['lugar'],
                ':id_punto'      => $id_punto
            ]);

            $id_punto++;
        }

        return true;
    }

    // private function balancearPuntosPorBloque(array $remitentes, array $destinatarios, int $bloque)
    // {
    //     $rem = [];
    //     $des = [];

    //     foreach ($remitentes as $r) {
    //         if ((int)$r['bloque'] === $bloque) {
    //             $rem[] = $r;
    //         }
    //     }

    //     foreach ($destinatarios as $d) {
    //         if ((int)$d['bloque'] === $bloque) {
    //             $des[] = $d;
    //         }
    //     }

    //     $countRem = count($rem);
    //     $countDes = count($des);

    //     $remFinal = [];
    //     $desFinal = [];

    //     // -----------------------------
    //     // 1 REM → N DES
    //     // -----------------------------
    //     if ($countRem === 1 && $countDes > 1) {

    //         foreach ($des as $d) {
    //             $rCopy = $rem[0];
    //             $rCopy['peso'] = $d['peso'];
    //             $remFinal[] = $rCopy;
    //             $desFinal[] = $d;
    //         }
    //     }
    //     // -----------------------------
    //     // N REM → 1 DES
    //     // -----------------------------
    //     elseif ($countRem > 1 && $countDes === 1) {

    //         foreach ($rem as $r) {
    //             $dCopy = $des[0];
    //             $dCopy['peso'] = $r['peso'];
    //             $remFinal[] = $r;
    //             $desFinal[] = $dCopy;
    //         }
    //     }
    //     // -----------------------------
    //     // N REM → M DES (1 a 1)
    //     // -----------------------------
    //     else {

    //         $max = max($countRem, $countDes);

    //         for ($i = 0; $i < $max; $i++) {

    //             $r = $rem[$i] ?? end($rem);
    //             $d = $des[$i] ?? end($des);

    //             // ajustar pesos cruzados
    //             $r['peso'] = $d['peso'];
    //             $d['peso'] = $r['peso'];

    //             $remFinal[] = $r;
    //             $desFinal[] = $d;
    //         }
    //     }

    //     return [$remFinal, $desFinal];
    // }

    private function balancearPorRemitente(array $remitentes, array $destinatarios, int $bloque)
    {
        $remPorId = [];
        $destPorRem = [];

        // Agrupar remitentes del bloque
        foreach ($remitentes as $r) {
            if ((int)$r['bloque'] === $bloque) {
                $remPorId[$r['remitente']] = $r;
            }
        }

        // Agrupar destinatarios por remitente
        foreach ($destinatarios as $d) {
            if ((int)$d['bloque'] === $bloque) {
                $destPorRem[$d['remitente']][] = $d;
            }
        }

        $remFinal = [];
        $desFinal = [];

        foreach ($remPorId as $remId => $rem) {

            $destinos = $destPorRem[$remId] ?? [];

            // Si no tiene destinatarios, se ignora (o throw si quieres)
            if (count($destinos) === 0) {
                continue;
            }

            foreach ($destinos as $d) {

                // Clonar remitente por cada destinatario
                $rCopy = $rem;
                $rCopy['peso'] = $d['peso'];

                $remFinal[] = $rCopy;
                $desFinal[] = $d;
            }
        }

        return [$remFinal, $desFinal];
    }

    private function logError($message, $user)
    {
        $errorMessage = "Error en la transacción al crear la solicitud de servicio: " . $message . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
        $logFilePath = 'error_log.txt'; // Ajusta la ruta según la estructura de tu proyecto
        error_log($errorMessage, 3, $logFilePath);

        if (!file_exists($logFilePath)) {
            error_log("No se pudo crear el archivo de log: $logFilePath\n", 3, $logFilePath);
        }
    }

    /*************************************Consultas de Solicitudes de Servicios***************************************/
    public function Consulta_Aprobacion($num_cotizacion, $fecha_inicia, $fecha_final)
    {
        $sql = $this->_db3->prepare('SELECT  a.id, b.id AS parejaod, a.*, b.tipo_servicio_mer, b.origen,
        b.destino, b.peso_neto_kg, b.tipo_vehiculo,
        b.flete, b.item, b.tipo_carga, b.tipo_transporte,b.tipo_mercancia,  soli.idpareja_origen_destino,
        soli.nundoc_solicitud AS soliid, soli.fecha,soli.hora, soli.estado, soli.estado_secundario
        FROM cmx_cotizaciones_serviciocliente a
        INNER JOIN cmx_detalle_mercancia2 b ON a.n_cotizacion=b.n_cotizacion
        INNER JOIN cmx_solicitud_vehiculo2 AS soli ON b.id=soli.idpareja_origen_destino
        WHERE soli.fecha BETWEEN "' . $fecha_inicia . '" AND "' . $fecha_final . '"
        AND a.estado_autorizado="autorizado" AND a.estado="F3"
        ORDER BY soli.fecha, soli.hora DESC');
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Cantidad_Solicitudes_Servicio($fecha_inicial, $fecha_final)
    {
        $sql = $this->_db3->prepare("SELECT  COUNT(soli.id) AS cantidad FROM cmx_solicitud_vehiculo2 AS soli
		WHERE soli.fecha BETWEEN '" . $fecha_inicial . "' AND '" . $fecha_final . "'");
        $sql->execute();
        $resultado = $sql->fetch(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Guardar_contenedor($contenedor, $mer_idservicio, $agrupado)
    {
        $response = [];
        $sql = $this->_db3->prepare("UPDATE cmx_solicitud_vehiculo2 SET numero_contenedor=:numero_contenedor,agrupable=:agrupable WHERE nundoc_solicitud=:nundoc_solicitud AND numero_contenedor IS NULL AND agrupable IS NULL");
        $sql->bindParam(':numero_contenedor', $contenedor, PDO::PARAM_STR);
        $sql->bindParam(':nundoc_solicitud', $mer_idservicio, PDO::PARAM_STR);
        $sql->bindParam(':agrupable', $agrupado, PDO::PARAM_STR);
        $sql->execute();
        if (! $sql->rowCount()) {
            $response = [
                'status' => 400,
                'message' => 'No se pudo actualizar el número de contenedor',
            ];
        } else {
            $response['status'] = 200;
            $response['message'] = "Número de contenedor actualizado correctamente";
        }
        return $response;
    }

    public function Actualizar_referencia($referencia_operacion, $mer_idservicio, $puntoId)
    {
        $response = [];
        $sql = $this->_db3->prepare("UPDATE cmx_destinatarios_ss SET observacion=:referencia_operacion WHERE solicitud_servicio=:nundoc_solicitud AND id=:puntoId");
        $sql->bindParam(':referencia_operacion', $referencia_operacion, PDO::PARAM_STR);
        $sql->bindParam(':nundoc_solicitud', $mer_idservicio, PDO::PARAM_STR);
        $sql->bindParam(':puntoId', $puntoId, PDO::PARAM_STR);
        $sql->execute();
        if (! $sql->rowCount()) {
            $response = [
                'status' => 400,
                'message' => 'No se pudo actualizar la refrenrencia de la solicitud',
            ];
        } else {
            $response['status'] = 200;
            $response['message'] = "Referencia actualizada correctamente";
        }
        return $response;
    }

    /* Listar agencias solicitudes de servicio */
    public function Listar_Agencias_Tipo_Servicios()
    {
        $sql = $this->_db3->prepare("SELECT * FROM cmx_agencias WHERE estado='Activo'");
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Update_Solicitud_agencia($agencia, $solicitud)
    {
        $response = [];
        $fecha = date('Y-m-d');
        try {
            /* Validar que la solicitud de servicio no este en un estudio de seguridad activo o vigente del dia */
            $sql_validar = $this->_db3->prepare("SELECT * FROM cmx_preestudio_solicitudes_servicio es 
                        INNER JOIN cmx_estudiov_completo ec ON es.id_solicitudpreestudio=ec.id_estudio AND ec.estado_actu=1
                        INNER JOIN cmx_solicitud_vehiculo2 ss ON es.id_servicio_cliente=ss.nundoc_solicitud
                        WHERE ss.nundoc_solicitud=:dato AND ec.fecha=:fecha AND (ec.estado != 'Cancelado' OR ec.estado != 'Rechazado' OR ec.estado IS NOT NULL)");
            $sql_validar->bindParam(':dato', $solicitud, PDO::PARAM_STR);
            $sql_validar->bindParam(':fecha', $fecha, PDO::PARAM_STR);
            $sql_validar->execute();
            $validar_estudio = $sql_validar->fetchAll(PDO::FETCH_ASSOC);
            if (count($validar_estudio) > 0) {
                $response = [
                    'status' => 400,
                    'message' => 'La solicitud de servicio no puede ser modificada en este momento, ya que está en un estudio de seguridad activo o vigente.',
                ];
                return $response;
            }
            // Validar que la solicitud de servicio no este en un estudio de seguridad activo o vigente del dia
            $sql = $this->_db3->prepare("UPDATE cmx_solicitud_vehiculo2 SET agencia=:agencia WHERE nundoc_solicitud=:nundoc_solicitud");
            $sql->bindParam(':agencia', $agencia, PDO::PARAM_INT);
            $sql->bindParam(':nundoc_solicitud', $solicitud, PDO::PARAM_STR);
            $sql->execute();
            if (!$sql->rowCount()) {
                $response = [
                    'status' => 400,
                    'message' => 'No se pudo actualizar la solicitud.',
                ];
            } else {
                $response = [
                    'status' => 200,
                    'message' => 'Solicitud actualizada correctamente.',
                ];
            }
        } catch (PDOException $e) {
            // Manejar el error y devolverlo en formato JSON
            http_response_code(500); // Código de error HTTP 500 (Internal Server Error)
            $response = [
                'status' => 500,
                'message' => "Error en la base de datos: " . $e->getMessage(),
            ];
        }
        return $response;
    }

    public function Update_Solicitud_tipo_Servicio($tipo_servicio, $numero_cotizacion, $solicitud)
    {
        $response = [];
        $fecha = date('Y-m-d');
        try {

            /* Validar que la solicitud de servicio no este en un estudio de seguridad activo o vigente del dia */
            $sql_validar = $this->_db3->prepare("SELECT * FROM cmx_preestudio_solicitudes_servicio es 
                        INNER JOIN cmx_estudiov_completo ec ON es.id_solicitudpreestudio=ec.id_estudio AND ec.estado_actu=1
                        INNER JOIN cmx_solicitud_vehiculo2 ss ON es.id_servicio_cliente=ss.nundoc_solicitud
                        WHERE ss.nundoc_solicitud=:dato AND ec.fecha=:fecha AND (ec.estado != 'Cancelado' OR ec.estado != 'Rechazado' OR ec.estado IS NOT NULL)");
            $sql_validar->bindParam(':dato', $solicitud, PDO::PARAM_STR);
            $sql_validar->bindParam(':fecha', $fecha, PDO::PARAM_STR);
            $sql_validar->execute();
            $validar_estudio = $sql_validar->fetchAll(PDO::FETCH_ASSOC);
            if (count($validar_estudio) > 0) {
                $response = [
                    'status' => 400,
                    'message' => 'La solicitud de servicio no puede ser modificada en este momento, ya que está en un estudio de seguridad activo o vigente.',
                ];
                return $response;
            }
            // Validar que la solicitud de servicio no este en un estudio de seguridad activo o vigente del dia
            $sql = $this->_db3->prepare("UPDATE cmx_detalle_mercancia2 SET tipo_servicio_mer=:tipo_servicio WHERE n_cotizacion=:n_cotizacion");
            $sql->bindParam(':tipo_servicio', $tipo_servicio, PDO::PARAM_STR);
            $sql->bindParam(':n_cotizacion', $numero_cotizacion, PDO::PARAM_STR);
            $sql->execute();
            if (!$sql->rowCount()) {
                $response = [
                    'status' => 400,
                    'message' => 'No se pudo actualizar la solicitud.',
                ];
            } else {
                $response = [
                    'status' => 200,
                    'message' => 'solicitud actualizada correctamente.',
                ];
            }
        } catch (PDOException $e) {
            // Manejar el error y devolverlo en formato JSON
            http_response_code(500); // Código de error HTTP 500 (Internal Server Error)
            $response = [
                'status' => 500,
                'message' => "Error en la base de datos: " . $e->getMessage(),
            ];
        }
        return $response;
    }

    //Cargar los filtros de la ventana

    public function Cargar_Filtros_ventana($ventana)
    {

        $response = [];
        $empresa_id = $_SESSION["usuario"]["empresa_id"];

        $sql = $this->_db3->prepare("SELECT * FROM cmx_filtros f 
        INNER JOIN cmx_ventana_filtro vf ON f.id=vf.filtro_id
        where vf.ventena_id=:ventana AND f.empresa_id=:empresa");
        $sql->bindParam(':ventana', $ventana, PDO::PARAM_INT);
        $sql->bindParam(':empresa', $empresa_id, PDO::PARAM_INT);
        $sql->execute();
        $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        $response = [
            "resultados" => $resultados,
        ];
        return $response;
    }

    public function Get_Solicitudes($numdoc_solicitud)
    {
        $response = [];
        $empresa_id = $_SESSION["usuario"]["empresa_id"];

        $sql = $this->_db3->prepare("SELECT * FROM cmx_filtros f 
        INNER JOIN cmx_ventana_filtro vf ON f.id=vf.filtro_id
        where vf.ventena_id=:ventana AND f.empresa_id=:empresa");
        $sql->bindParam(':ventana', $numdoc_solicitud, PDO::PARAM_INT);
        // $sql->bindParam(':empresa', $empresa_id, PDO::PARAM_INT);
        $sql->execute();
        $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        $response = [
            "resultados" => $resultados,
        ];
        return $response;
    }

    /* Actualuzar prioridad */
    public function Update_Solicitud_Prioridad($estado, $numdoc_solicitud, $nivel_prioridad, $motivo_prioridad)
    {
        $response = [];
        try {
            $empresa_id = $_SESSION["usuario"]["empresa_id"];
            $user = $_SESSION["usuario"]["nom_usuario"];
            $fecha = date('Y-m-d');
            $hora = date('G:i:s');

            // Verificar que el estado sea 'Propuesta' o 'Aprobada'
            if (!in_array($estado, ['Propuesta', 'Aprobada'])) {
                $response = [
                    'status' => 400,
                    'message' => 'Estado inválido para la solicitud.',
                ];
                return $response;
            }

            // Actualizar la solicitud
            $sql = $this->_db3->prepare("UPDATE cmx_solicitud_vehiculo2 SET prioritaria = :prioritaria WHERE nundoc_solicitud = :nundoc_solicitud");
            $sql->bindParam(':prioritaria', $estado, PDO::PARAM_STR);
            $sql->bindParam(':nundoc_solicitud', $numdoc_solicitud, PDO::PARAM_INT);
            $sql->execute();

            if (!$sql->rowCount()) {
                $response = [
                    'status' => 400,
                    'message' => 'No se pudo actualizar la solicitud.',
                ];
            } else {
                // Insertar en la tabla detalle de prioridad
                $sql_detalle_prioridad = $this->_db3->prepare("INSERT INTO cmx_detalle_prioridad (numdoc_solicitud, nivel, motivo, usuario, fecha, hora, empresa_id) 
                    VALUES (:numdoc_solicitud, :nivel, :motivo, :usuario, :fecha, :hora, :empresa_id)");
                $sql_detalle_prioridad->bindParam(':numdoc_solicitud', $numdoc_solicitud);
                $sql_detalle_prioridad->bindParam(':nivel', $nivel_prioridad);
                $sql_detalle_prioridad->bindParam(':motivo', $motivo_prioridad);
                $sql_detalle_prioridad->bindParam(':usuario', $user);
                $sql_detalle_prioridad->bindParam(':fecha', $fecha);
                $sql_detalle_prioridad->bindParam(':hora', $hora);
                $sql_detalle_prioridad->bindParam(':empresa_id', $empresa_id);
                $sql_detalle_prioridad->execute();

                if (!$sql_detalle_prioridad->rowCount()) {
                    $response = [
                        'status' => 400,
                        'message' => 'No se pudo insertar el detalle de prioridad.',
                    ];
                } else {
                    // Registrar movimiento histórico
                    $motivo = 'Actualizar';
                    $modulo = 'Servicio al Cliente';
                    $objeto = 'Solicitud servicio';
                    $objeto_anterior = null;
                    $referencia = "REF-" . date("YmdHis");
                    $descripcion = "Solicitud de prioridad para la solicitud de servicio numero " . $numdoc_solicitud . ".";

                    $sql_historico = $this->_db3->prepare("INSERT INTO cmx_movimientos_sistema (tipo_movimiento, modulo, objeto, objeto_anterior, referencia, descripcion, usuario, fecha, hora, empresa_id)
                        VALUES (:tipo_movimiento, :modulo, :objeto, :objeto_anterior, :referencia, :descripcion, :usuario, :fecha, :hora, :empresa_id)");
                    $sql_historico->bindParam(':tipo_movimiento', $motivo);
                    $sql_historico->bindParam(':modulo', $modulo);
                    $sql_historico->bindParam(':objeto', $objeto);
                    $sql_historico->bindParam(':objeto_anterior', $objeto_anterior);
                    $sql_historico->bindParam(':referencia', $referencia);
                    $sql_historico->bindParam(':descripcion', $descripcion);
                    $sql_historico->bindParam(':usuario', $user);
                    $sql_historico->bindParam(':fecha', $fecha);
                    $sql_historico->bindParam(':hora', $hora);
                    $sql_historico->bindParam(':empresa_id', $empresa_id);
                    $sql_historico->execute();

                    $response = [
                        'status' => 200,
                        'message' => 'Solicitud actualizada correctamente.',
                    ];
                }
            }
        } catch (PDOException $e) {
            $response = [
                'status' => 500,
                'message' => 'Error en la base de datos: ' . $e->getMessage()
            ];
        } catch (Exception $e) {
            $response = [
                'status' => 500,
                'message' => 'Error: ' . $e->getMessage()
            ];
        }

        return $response;
    }

    public function Update_Solicitud_Aprobada($estado, $numdoc_solicitud)
    {
        $response = [];

        // var_dump($estado);

        // Asegúrate de que $estado sea 'Propuesta' o 'Aprobada'
        if (!in_array($estado, ['Propuesta', 'Aprobada'])) {
            $response = [
                'status' => 400,
                'message' => 'Estado inválido para la solicitud.',
            ];
            return $response;
        }

        $sql = $this->_db3->prepare("UPDATE cmx_solicitud_vehiculo2 SET prioritaria = :prioritaria WHERE nundoc_solicitud = :nundoc_solicitud");
        $sql->bindParam(':prioritaria', $estado, PDO::PARAM_STR);
        $sql->bindParam(':nundoc_solicitud', $numdoc_solicitud, PDO::PARAM_STR);

        $sql->execute();

        if (!$sql->rowCount()) {
            $response = [
                'status' => 400,
                'message' => 'No se pudo actualizar la solicitud.',
            ];
        } else {
            $response = [
                'status' => 200,
                'message' => 'Solicitud actualizada correctamente.',
            ];
        }
        return $response;
    }

    public function ListarClientes()
    {
        $sql = 'SELECT * FROM cmx_clientes';
        $query = $this->_db3->prepare($sql);
        $query->execute();
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function ListarComerciales()
    {
        $sql = 'SELECT u.id, u.nom_usuario FROM cmx_usuarios u
        INNER JOIN cmx_usuario_cliente uc ON u.id=uc.id_usuario
        INNER JOIN cmx_perfiles p ON uc.id_perfil=p.id
        WHERE p.id=7 AND u.estado=1';
        $query = $this->_db3->prepare($sql);
        $query->execute();
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function ListarEmpresas()
    {
        $sql = "SELECT * FROM cmx_empresas WHERE estado_empresa='ACTIVA'";
        $query = $this->_db3->prepare($sql);
        $query->execute();
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function ListarRemitentes($soli_servi)
    {
        $sql = "SELECT s.*, a.nombre, pe.fecha_estimada_entrega AS fecha_cargue, pe.hora_estimada AS hora_cargue,
        rm.nombre AS remitente, pe.id_punto AS punto_rem, s.numero_contenedor, s.agrupable, ds.observacion, s.escenario_id,pe.id AS punto_entrega_id,s.prioritaria AS Solicitud_Prioritaria
        FROM cmx_solicitud_vehiculo2 s
        INNER JOIN cmx_agencias a ON s.agencia = a.id
        INNER JOIN cmx_ruta_puntosentrega pe ON s.nundoc_solicitud = pe.cod_ini_ruta
        INNER JOIN cmx_remitente_destinatario rm ON pe.cliente = rm.id
        LEFT JOIN cmx_destinatarios_ss ds ON pe.cod_ini_ruta = ds.solicitud_servicio
        LEFT JOIN cmx_remitente_destinatario des ON ds.cliente = des.id
        WHERE s.nundoc_solicitud=:soli_servi GROUP BY pe.id_punto";

        $query = $this->_db3->prepare($sql);  // Prepara la consulta

        $query->bindParam(':soli_servi', $soli_servi, PDO::PARAM_INT); // Asigna el valor de forma segura
        $query->execute();  // Ejecuta la consulta

        return $query->fetchAll(PDO::FETCH_ASSOC); // Retorna el resultado en un array asociativo

    }

    public function ListarDestinatarios($soli_servi)
    {
        $sql = "SELECT s.*, a.nombre, des.nombre AS destinatario, ds.fecha_estimada_entrega AS fecha_descargue,
        ds.hora_estimada AS hora_descargue, ds.id_punto AS punto_des,
        s.numero_contenedor, s.agrupable, ds.observacion, s.escenario_id,ds.id AS punto_destinatario_id
        FROM cmx_solicitud_vehiculo2 s
        INNER JOIN cmx_agencias a ON s.agencia = a.id
        INNER JOIN cmx_ruta_puntosentrega pe ON s.nundoc_solicitud = pe.cod_ini_ruta
        INNER JOIN cmx_remitente_destinatario rm ON pe.cliente = rm.id
        LEFT JOIN cmx_destinatarios_ss ds ON pe.cod_ini_ruta = ds.solicitud_servicio
        LEFT JOIN cmx_remitente_destinatario des ON ds.cliente = des.id
        WHERE s.nundoc_solicitud=:soli_servi GROUP BY ds.id_punto ORDER BY ds.id_punto ASC";

        $query = $this->_db3->prepare($sql);  // Prepara la consulta

        $query->bindParam(':soli_servi', $soli_servi, PDO::PARAM_INT); // Asigna el valor de forma segura
        $query->execute();  // Ejecuta la consulta

        return $query->fetchAll(PDO::FETCH_ASSOC); // Retorna el resultado en un array asociativo

    }

    /* CONSULTAR DATOS DE SUBAST */
    public function Datos_Subasta_Tarifa($n_servicio)
    {
        $sql = $this->_db3->prepare("SELECT a.num_estudioseguridad, a.placa, a.flete_sugerido, a.flete_propuesto,
        ss.numer_solservicio, ser.nombre_cliente, d.total_tarifa, b.estado,a.id_suba, a.id as idflete, b.id as idestadoflete,
        d.id as parejaorigen, b.acepta_flete, a.tarifa_promedio
        FROM cmx_subasta_flete a
        INNER JOIN cmx_estado_subasta_flete b ON a.id=b.id_suba_flete AND b.estado IN('pendiente_aprobacion','aprueba_flete_sac','no_aprueba_ge')
        INNER JOIN cmx_subasta_solicitud_servicio ss ON a.id_suba_servicio=ss.id
        LEFT JOIN cmx_solicitud_vehiculo2 ser ON ss.numer_solservicio=ser.nundoc_solicitud
        LEFT JOIN cmx_detalle_mercancia2 d ON ser.idpareja_origen_destino=d.id
        WHERE ss.numer_solservicio=:n_servicio");
        $sql->bindValue(':n_servicio', $n_servicio);
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Respuesta_Subasta_Tarifa($datos)
    {
        $response = [];
        try {
            // Inicia una transacción para que todas las consultas se ejecuten de forma atómica
            $this->_db3->beginTransaction();

            $area = 'SAC';
            // Consulta de inserción en cmx_operacion_subasta
            $sql = $this->_db3->prepare("INSERT INTO cmx_operacion_subasta(id, n_subasta, flete_ganador, tarifa_ganador, rentabilidad, utilidad, estado, fecha, hora, usuario, area, estado_letra)
                VALUES (null, :n_subasta, :flete_ganador, :tarifa_ganador, :rentabilidad, :utilidad, :estado, :fecha, :hora, :usuario, :area, :estado_letra)");
            $sql->bindValue(':n_subasta', $datos['subasta']);
            $sql->bindValue(':flete_ganador', $datos['flete_propu']);
            $sql->bindValue(':tarifa_ganador', $datos['tarifa_pro']);
            $sql->bindValue(':rentabilidad', $datos['rentabili']);
            $sql->bindValue(':utilidad', $datos['utilidad']);
            $sql->bindValue(':estado', $datos['estado']);
            $sql->bindValue(':fecha', $datos['fecha']);
            $sql->bindValue(':hora', $datos['hora']);
            $sql->bindValue(':usuario', $datos['user']);
            $sql->bindValue(':area', $area);
            $sql->bindValue(':estado_letra', $datos['estado_letra']);
            $sql->execute();
            $result = $sql->rowCount();

            if ($result > 0) {
                // Actualizar estado en cmx_estado_subasta_flete
                $sql2 = $this->_db3->prepare("UPDATE cmx_estado_subasta_flete SET acepta_flete = :statu, estado = :estado WHERE id_suba = :subasta AND id_suba_flete = :sidflete");
                $sql2->bindParam(':statu', $datos['statu'], PDO::PARAM_STR);
                $sql2->bindParam(':estado', $datos['estado_letra'], PDO::PARAM_STR);
                $sql2->bindParam(':subasta', $datos['subasta'], PDO::PARAM_STR);
                $sql2->bindParam(':sidflete', $datos['sidflete'], PDO::PARAM_INT);
                $sql2->execute();

                // Actualizar estado en cmx_solicitud_vehiculo2
                $sql3 = $this->_db3->prepare("UPDATE cmx_solicitud_vehiculo2 SET estado_secundario = :estado WHERE nundoc_solicitud = :servicio");
                $sql3->bindParam(':estado', $datos['estado_letra'], PDO::PARAM_STR);
                $sql3->bindParam(':servicio', $datos['servicio'], PDO::PARAM_INT);
                $sql3->execute();
            }

            // Si todo sale bien, confirma la transacción
            $this->_db3->commit();
            $response = ['numero' => 200, 'mensaje' => 'Tarifa aprobada con exito en el sistema'];
        } catch (PDOException $e) {
            // En caso de error, revierte la transacción
            $this->_db3->rollBack();
            // echo "Error en la transacción: " . $e->getMessage();
            $response = ['numero' => 400, 'mensaje' => $e->getMessage()];
        }

        return $response;
    }

    public function Cancelar_Solicitud_Servicio($n_servicio)
    {
        // Consulta para validar si la solicitud ya está asociada a una solicitud de estudio
        $sql = $this->_db3->prepare("SELECT pse.id 
        FROM cmx_solicitud_vehiculo2 se
        LEFT JOIN cmx_preestudio_solicitudes_servicio pse ON se.nundoc_solicitud = pse.id_servicio_cliente
        LEFT JOIN cmx_estudiov_completo ec ON pse.id_solicitudpreestudio = ec.id_estudio AND ec.estado_actu = 1 
            AND (ec.estado = 'Pendiente' OR ec.estado = 'iniciado' OR ec.estado = 'pendiente_iniciar' OR ec.estado = 'Aprobado' OR ec.estado = 'Rechazado_modificar')
        LEFT JOIN cmx_solicitudes_estados ses ON pse.id_solicitudpreestudio = ses.id_solicitud AND ses.estado_actual = 1
            AND (ses.estado = 'aprobado' OR ses.estado = 'rechazado para modificar' OR ses.estado = 'iniciado' OR ses.estado = 'rechazado' OR ses.estado = 'pendiente_iniciar')
        WHERE pse.id_servicio_cliente = :n_servicio");

        $sql->bindParam(':n_servicio', $n_servicio, PDO::PARAM_INT);
        $sql->execute();

        $resultado = $sql->fetch(PDO::FETCH_ASSOC);

        // Validación de la consulta y respuesta
        if ($resultado) {
            // Se encontraron registros: la solicitud ya fue asociada a un estudio
            return [
                'success' => false,
                'message' => 'Su solicitud de servicio ya fue asociada a una solicitud de estudio, por esta razón no puede realizar proceso de cancelación para la solicitud <strong>N°' . $n_servicio . '</strong>.'
            ];
        } else {
            // No se encontraron registros, se procede a cancelar la solicitud
            $update = $this->_db3->prepare("UPDATE cmx_solicitud_vehiculo2 SET estado=:estado WHERE nundoc_solicitud=:n_servicio");
            $estado = 'Cancelada';
            $update->bindParam(':estado', $estado, PDO::PARAM_STR);
            $update->bindParam(':n_servicio', $n_servicio, PDO::PARAM_INT);
            $update->execute();

            if ($update->rowCount() > 0) {
                return [
                    'success' => true,
                    'message' => 'La solicitud <strong>N°' . $n_servicio . '</strong> se ha cancelado correctamente.'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'No se pudo cancelar la solicitud o no se encontró la solicitud especificada.'
                ];
            }
        }
    }

    public function Remesas_Generales()
    {
        $params = [];
        $where = '';
        $usuario_id = $_SESSION['usuario']['id_usuario'] ?? null;
        $perfil_id = $_SESSION['usuario']['id_perfil'] ?? null;

        if ($perfil_id != 1 && $perfil_id != 35) {
            $params[':usuario_id'] = $usuario_id;
            $where = 'AND csr.id_usuario = :usuario_id';
        }

        $sql = $this->_db3->prepare("SELECT
        cl.id AS cliente_id,
        cl.documento,
        cl.nombre AS cliente_nombre,
        COUNT(DISTINCT rm.id) AS total_remesas
        FROM
            cmx_remesa rm
            INNER JOIN cmx_remesas_transmision rt ON rm.id = rt.id_remesa
            AND rt.estado = 1
            INNER JOIN cmx_remesa_ordencargue ro ON rm.id = ro.id_remesa
            AND ro.estado = 1
            INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue = oc.id
            INNER JOIN cmx_clientes cl ON oc.cli_id = cl.id
            INNER JOIN cmx_manifiesto_remesa mr ON rm.id = mr.id_remesa
            INNER JOIN cmx_manifiesto ma ON mr.id_manifiesto = ma.id
            INNER JOIN cmx_clientes_serv_contratados csc ON cl.id = csc.id_cliente
            INNER JOIN cmx_clientes_serv_responsables csr ON csc.id = csr.id_serv_contratado AND csr.estado=1
            INNER JOIN cmx_usuarios u ON csr.id_usuario = u.id
        WHERE
            rm.estado = 1
            AND rm.estado_facturacion = 'Pendiente'
            AND ma.estadomnf_actual = 1
            $where
        GROUP BY
            cl.id,
            cl.nombre
        ORDER BY
            total_remesas DESC");
        $sql->execute($params); // <-- aquí se pasa correctamente
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function Remesas_Clientes($ClienteId, $Dato)
    {
        $sqlBase = "SELECT
            rm.id AS numdoc_remesa,
            CONCAT(rm.fecha_creacion,' ', rm.hora_creacion) AS fecha_remesa,
            cl.nombre AS Cliente,
            ma.placa,
            tm.nombre,
            IF (rm.remesa_contado=1,'Contado','-') AS Remesa_Contado,
            IF (rm.remesa_contraentrega=1,'Contra entrega','-') AS Remesa_Contra_Entrega,
            ma.Lugar,
            CONCAT(ori.municipio,' ',ori.depto) AS Origen,
            CONCAT(des.municipio,' ',des.depto) AS Destino,
            dm.total_tarifa AS Total_Remesa,
            ss.usuario_auditor AS Comercial,
            IF(ds.observacion='','-',ds.observacion) AS Observacion,
            ar.estado_ajuste,
            ar.remesa_id,
            ar.valor_ajuste,
            ar.origen_ajuste,
            ar.destino_ajuste,
            ar.id AS ajuste_id
        FROM
            cmx_manifiesto ma
            INNER JOIN cmx_manifiesto_remesa mr ON ma.id = mr.id_manifiesto AND mr.estado = 1
            INNER JOIN cmx_remesa rm ON mr.id_remesa = rm.id
            INNER JOIN cmx_remesas_transmision rt ON rm.id = rt.id_remesa AND rt.estado = 1
            INNER JOIN cmx_remesa_ordencargue ro ON rm.id = ro.id_remesa
            INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue = oc.id
            INNER JOIN cmx_clientes cl ON oc.cli_id = cl.id
            INNER JOIN cmx_solicitud_vehiculo2 ss ON oc.mer_idservicio = ss.nundoc_solicitud
            INNER JOIN cmx_detalle_mercancia2 dm ON ss.n_cotizacion = dm.n_cotizacion
            INNER JOIN cmx_para_tipo_mercancia tm ON dm.id_mercancia = tm.id
            INNER JOIN cmx_municipios ori ON ma.origen_viaje = ori.id
            INNER JOIN cmx_municipios des ON ma.destino_viaje = des.id
            INNER JOIN cmx_destinatarios_ss ds ON ss.nundoc_solicitud = ds.solicitud_servicio
            LEFT JOIN cmx_ajuste_valor_remesa ar on rm.id=ar.remesa_id AND ar.estado_ajuste='Pendiente'
        WHERE
        cl.id = :ClienteId
        AND ma.estadomnf_actual = 1
        AND rm.estado_facturacion = 'Pendiente'";

        // Condicional dinámico
        if (!empty($Dato)) {
            $sqlBase .= " AND (rm.id LIKE :Dato OR ss.usuario_auditor LIKE :Dato)";
        }

        $sqlBase .= " GROUP BY rm.id";
        // $sqlBase .= " GROUP BY ma.id";

        $sql = $this->_db3->prepare($sqlBase);
        $sql->bindParam(':ClienteId', $ClienteId, PDO::PARAM_INT);

        if (!empty($Dato)) {
            $datoLike = "%" . $Dato . "%"; // Puedes usar % al inicio y final para búsqueda parcial
            $sql->bindParam(':Dato', $datoLike, PDO::PARAM_STR);
        }

        $sql->execute();
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function Guardar_Instruccion_Facturacion($datos)
    {
        $response = ['status' => 'error', 'message' => 'Ocurrió un error inesperado.'];

        $archivos = $datos['adjuntos'];

        try {
            $this->_db3->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Iniciar transacción
            $this->_db3->beginTransaction();

            if (!isset($datos['ClienteId'], $datos['Nombre'])) {
                throw new Exception("Datos incompletos para la instrucción.");
            }

            $date = new DateTime('now', new DateTimeZone('America/Bogota'));
            $fecha = $date->format('Y-m-d');
            $hora = $date->format('H:i:s');

            $empresa_id = $_SESSION['usuario']['empresa_id'] ?? null;
            $nom_usuario = $_SESSION['usuario']['nom_usuario'] ?? null;
            $usuario_id = $_SESSION['usuario']['id_usuario'] ?? null;
            $estado = 'Pendiente';

            // Insertar instrucción principal
            $sql_insert = $this->_db3->prepare("INSERT INTO cmx_instruccion_facturacion(cliente_id, comercial_id, nombre, total_instruccion, total_factura, total_servicios_especiales, estado_instruccion, observaciones, usuario, fecha, hora, empresa_id)
            VALUE(:cliente_id, :comercial_id, :nombre, :total_instruccion, :total_factura, :total_servicios_especiales, :estado_instruccion, :observaciones, :usuario, :fecha, :hora, :empresa_id)");
            $sql_insert->bindParam(':cliente_id', $datos['ClienteId']);
            $sql_insert->bindParam(':comercial_id', $usuario_id);
            $sql_insert->bindParam(':nombre', $datos['Nombre']);
            $sql_insert->bindParam(':total_instruccion', $datos['Total_Instruccion']);
            $sql_insert->bindParam(':total_factura', $datos['Total_Facturacion']);
            $sql_insert->bindParam(':total_servicios_especiales', $datos['Total_Servicio_Especial']);
            $sql_insert->bindParam(':estado_instruccion', $estado);
            $sql_insert->bindParam(':observaciones', $datos['Descripccion_Instruccion']);
            $sql_insert->bindParam(':usuario', $nom_usuario);
            $sql_insert->bindParam(':fecha', $fecha);
            $sql_insert->bindParam(':hora', $hora);
            $sql_insert->bindParam(':empresa_id', $empresa_id);
            $sql_insert->execute();
            $lastInsertId = $this->_db3->lastInsertId();

            if (!empty($archivos)) {
                $rutaexcel = 'public/files/Instrucciones/Excel/' . $lastInsertId . '/';

                // Crear carpeta si no existe
                if (!is_dir($rutaexcel)) {
                    if (!mkdir($rutaexcel, 0777, true)) {
                        throw new Exception("No se pudo crear el directorio de almacenamiento.");
                    }
                }

                // Guardar Excel
                $excelGuardado = null;
                if (!empty($archivos['excel']['name'])) {
                    $nombreExcel = basename($archivos['excel']['name']);
                    $nombreFinalExcel = preg_replace('/[^a-zA-Z0-9_\.-]/', '_', basename($nombreExcel));

                    $extensionExcel = pathinfo($nombreFinalExcel, PATHINFO_EXTENSION);
                    $extPermitidas = ['xlsx', 'xls']; // solo excel aquí

                    if (!in_array(strtolower($extensionExcel), $extPermitidas)) {
                        throw new Exception("El archivo $nombreExcel tiene una extensión no permitida.");
                    }

                    $tmpExcel = $archivos['excel']['tmp_name'];
                    $destinoExcel = $rutaexcel . $nombreExcel; // Guardar en la carpeta específica

                    if (move_uploaded_file($tmpExcel, $destinoExcel)) {
                        $excelGuardado = $nombreExcel;
                    } else {
                        throw new Exception("No se pudo mover el archivo Excel.");
                    }

                    if ($excelGuardado) {
                        $sqlInsertExcel = $this->_db3->prepare("
                            INSERT INTO cmx_instruccion_documentos (instruccion_id, ruta_documento, nombre_documento, usuario, fecha, hora, empresa_id) 
                            VALUES (:instruccion_id, :ruta_documento, :nombre_documento, :usuario, :fecha, :hora, :empresa_id)
                        ");

                        $sqlInsertExcel->execute([
                            ':instruccion_id' => $lastInsertId,
                            ':ruta_documento' => $rutaexcel . $excelGuardado,
                            ':nombre_documento' => $excelGuardado,
                            ':usuario' => $nom_usuario,
                            ':fecha' => $fecha,
                            ':hora' => $hora,
                            ':empresa_id' => $empresa_id
                        ]);
                    }
                }

                //Soportes para la instruccion
                if (!empty($archivos['archivo'])) {
                    $rutasoportes = 'public/files/Instrucciones/Soportes/' . $lastInsertId . '/';

                    // Crear carpeta si no existe
                    if (!is_dir($rutasoportes)) {
                        if (!mkdir($rutasoportes, 0777, true)) {
                            throw new Exception("No se pudo crear el directorio de almacenamiento.");
                        }
                    }

                    // Guardar soportes (PDF/imagen)
                    $soportesGuardados = [];
                    if (!empty($archivos['archivo']['name'][0])) {
                        foreach ($archivos['archivo']['name'] as $i => $nombreArchivo) {
                            $tmp = $archivos['archivo']['tmp_name'][$i];
                            // $nombreFinal = basename($nombreArchivo);
                            $nombreFinal = preg_replace('/[^a-zA-Z0-9_\.-]/', '_', basename($nombreArchivo));
                            $extension = pathinfo($nombreFinal, PATHINFO_EXTENSION);
                            $extPermitidas = ['pdf', 'jpg', 'jpeg', 'png'];

                            if (!in_array(strtolower($extension), $extPermitidas)) {
                                throw new Exception("El archivo $nombreFinal tiene una extensión no permitida.");
                            }
                            $destino = $rutasoportes . $nombreFinal; // Guardar en la ruta deseada

                            if (move_uploaded_file($tmp, $destino)) {
                                $soportesGuardados[] = $nombreFinal;
                            } else {
                                throw new Exception("No se pudo mover el archivo: $nombreFinal");
                            }
                        }

                        foreach ($soportesGuardados as $nombreArchivo) {
                            $sqlInsertSoporte = $this->_db3->prepare("INSERT INTO cmx_instruccion_documentos (instruccion_id, ruta_documento, nombre_documento, usuario, fecha, hora, empresa_id) 
                                VALUES (:instruccion_id, :ruta_documento, :nombre_documento, :usuario, :fecha, :hora, :empresa_id)");

                            $sqlInsertSoporte->execute([
                                ':instruccion_id' => $lastInsertId,
                                ':ruta_documento' => $rutasoportes . $nombreArchivo,
                                ':nombre_documento' => $nombreArchivo,
                                ':usuario' => $nom_usuario,
                                ':fecha' => $fecha,
                                ':hora' => $hora,
                                ':empresa_id' => $empresa_id
                            ]);
                        }
                    }
                }
            }

            // Insertar detalle de remesas
            $remesas = $datos['remesas'] ?? [];
            $estado_instruccion = 'Instruccion';
            if (!empty($remesas)) {
                $sql_insert_remesas = $this->_db3->prepare("INSERT INTO cmx_detalle_instruccion_facturacion(instruccion_id, remesa_id, usuario, fecha, hora)
                VALUE(:instruccion_id, :remesa_id, :usuario, :fecha, :hora)");
                foreach ($remesas as $remesa) {
                    $sql_insert_remesas->execute([
                        ':instruccion_id' => $lastInsertId,
                        ':remesa_id' => $remesa['id'],
                        ':usuario' => $nom_usuario,
                        ':fecha' => $fecha,
                        ':hora' => $hora,
                    ]);

                    //Actualizar las remesas de estado en la facturacion
                    $sql_update = $this->_db3->prepare("UPDATE cmx_remesa SET estado_facturacion=:estado_facturacion WHERE id=:remesa_id");
                    $sql_update->bindParam(':estado_facturacion', $estado_instruccion);
                    $sql_update->bindParam(':remesa_id', $remesa['id']);
                    $sql_update->execute();
                }

                $ObservacionEstado = null;
                //Insertar historico de las instrucciones de facturacion
                $sql_insert_historico = $this->_db3->prepare("INSERT INTO cmx_estado_historico_instruccion(historico_id,estado,observacion,usuario,fecha,hora,empresa_id) 
                VALUE(:historico_id,:estado,:observacion,:usuario,:fecha,:hora,:empresa_id)");
                $sql_insert_historico->bindParam(':historico_id', $lastInsertId);
                $sql_insert_historico->bindParam(':estado', $estado);
                $sql_insert_historico->bindParam(':observacion', $ObservacionEstado);
                $sql_insert_historico->bindParam(':usuario', $nom_usuario);
                $sql_insert_historico->bindParam(':fecha', $fecha);
                $sql_insert_historico->bindParam(':hora', $hora);
                $sql_insert_historico->bindParam(':empresa_id', $empresa_id);
                $sql_insert_historico->execute();
            }

            // Confirmar transacción
            $this->_db3->commit();
            $response = [
                'status' => 'success',
                'message' => 'Instrucción registrada exitosamente.',
                'instruccion_id' => $lastInsertId
            ];
        } catch (Exception $e) {
            $this->_db3->rollBack();
            $response = [
                'status' => 'error',
                'message' => 'Error al guardar la instrucción: ' . $e->getMessage()
            ];
        }

        return $response;
    }

    public function Listar_Instrucciones_Facturacion()
    {
        $sql = $this->_db3->prepare("SELECT
            cl.id AS cliente_id,
            cl.documento AS documento_cliente,
            cl.nombre AS cliente_nombre,
            COUNT(DISTINCT ift.id) AS total_instrucciones,
            SUM(ift.total_factura) AS total_facturacion
        FROM
            cmx_instruccion_facturacion ift
            INNER JOIN cmx_clientes cl ON ift.cliente_id = cl.id
        WHERE
            ift.estado_instruccion = 'Pendiente' OR ift.estado_instruccion = 'Pendiente Facturar'
        GROUP BY
            cl.id,
            cl.nombre
        ORDER BY
            cl.nombre");

        $sql->execute();
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function Detalle_Instrucciones_Facturacion_Cliente($ClienteId)
    {
        $sql = $this->_db3->prepare("SELECT 
        ift.*, 
        dif.*, 
        cl.id AS cliente_id,
        cl.nombre AS cliente_nombre, 
        us.nom_usuario AS comercial_nombre,
        -- oc.ve_tarifacalculada AS Total_Remesa,
        dm.total_tarifa AS Total_Remesa,
        ift.total_factura AS Total_factura_Instruccion,
        CONCAT(ift.fecha,' ',ift.hora) AS Fecha_Instrccion,
        ma.id AS Manifiesto,
        CONCAT(ori.municipio,' ',ori.depto) AS Origen,
        CONCAT(des.municipio,' ',des.depto) AS Destino,
        idoc.ruta_documento,
        idoc.nombre_documento
        /*ar.estado_ajuste,
        ar.remesa_id,
        ar.valor_ajuste,
        ar.origen_ajuste,
        ar.destino_ajuste,
        ar.id AS ajuste_id */
        FROM cmx_instruccion_facturacion ift 
        INNER JOIN cmx_detalle_instruccion_facturacion dif ON ift.id = dif.instruccion_id
        INNER JOIN cmx_clientes cl ON ift.cliente_id = cl.id
        INNER JOIN cmx_usuarios us ON ift.comercial_id = us.id
        INNER JOIN cmx_remesa_ordencargue ro ON dif.remesa_id = ro.id_remesa
        INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue = oc.id
        INNER JOIN cmx_solicitud_vehiculo2 ss ON oc.mer_idservicio = ss.nundoc_solicitud
        INNER JOIN cmx_detalle_mercancia2 dm ON ss.n_cotizacion = dm.n_cotizacion
        INNER JOIN cmx_manifiesto_remesa mr ON ro.id_remesa=mr.id_remesa
        INNER JOIN cmx_remesa rm ON mr.id_remesa=rm.id
        INNER JOIN cmx_manifiesto ma ON mr.id_manifiesto=ma.id
        INNER JOIN cmx_municipios ori ON ma.origen_viaje=ori.id
        INNER JOIN cmx_municipios des ON ma.destino_viaje=des.id
        LEFT JOIN cmx_instruccion_documentos idoc ON ift.id=idoc.instruccion_id
       /* LEFT JOIN cmx_ajuste_valor_remesa ar on rm.id=ar.remesa_id*/
        WHERE cl.id = :ClienteId -- Aquí va el ID del cliente específico
        AND ift.estado_instruccion<>'Completada' AND ift.estado_instruccion<>'Rechazada'
        ORDER BY ift.id, dif.id");
        $sql->bindParam(':ClienteId', $ClienteId);
        $sql->execute();
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function Detalle_Instrucciones_Remesas($InstruccionId)
    {
        $sql = $this->_db3->prepare("SELECT 
            ift.*, 
            dif.*, 
            cl.id AS cliente_id,
            cl.nombre AS cliente_nombre, 
            us.nom_usuario AS comercial_nombre,
            -- oc.ve_tarifacalculada AS Total_Remesa,
            dm.total_tarifa AS Total_Remesa,
            ift.total_factura AS Total_factura_Instruccion,
            CONCAT(ift.fecha,' ',ift.hora) AS Fecha_Instrccion,
            ma.id AS Manifiesto,
            CONCAT(ori.municipio,' ',ori.depto) AS Origen,
            CONCAT(des.municipio,' ',des.depto) AS Destino,
            ar.estado_ajuste,
            ar.remesa_id AS Remesa_Ajuste,
            ar.valor_ajuste,
            ar.origen_ajuste,
            ar.destino_ajuste,
            ar.id AS ajuste_id
        FROM cmx_instruccion_facturacion ift 
            INNER JOIN cmx_detalle_instruccion_facturacion dif ON ift.id = dif.instruccion_id
            INNER JOIN cmx_clientes cl ON ift.cliente_id = cl.id
            INNER JOIN cmx_usuarios us ON ift.comercial_id = us.id
            INNER JOIN cmx_remesa_ordencargue ro ON dif.remesa_id = ro.id_remesa
            INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue = oc.id
            INNER JOIN cmx_solicitud_vehiculo2 ss ON oc.mer_idservicio = ss.nundoc_solicitud
            INNER JOIN cmx_detalle_mercancia2 dm ON ss.n_cotizacion = dm.n_cotizacion
            INNER JOIN cmx_manifiesto_remesa mr ON ro.id_remesa=mr.id_remesa
            INNER JOIN cmx_remesa rm ON mr.id_remesa=rm.id
            INNER JOIN cmx_manifiesto ma ON mr.id_manifiesto=ma.id
            INNER JOIN cmx_municipios ori ON ma.origen_viaje=ori.id
            INNER JOIN cmx_municipios des ON ma.destino_viaje=des.id
            LEFT JOIN cmx_ajuste_valor_remesa ar on rm.id=ar.remesa_id
        WHERE  ift.id = :InstruccionId -- Aquí va el ID del cliente específico
            AND (dif.estado_facturacion <> 'Eliminada' OR dif.estado_facturacion IS NULL)
        ORDER BY ift.id, dif.id");

        $sql->bindParam(':InstruccionId', $InstruccionId);
        $sql->execute();
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function Insertar_Trazabilidad_Facturacion($datos)
    {
        try {
            $this->_db3->beginTransaction();

            $sqlInsert = $this->_db3->prepare("INSERT INTO cmx_estado_historico_instruccion(historico_id, estado, observacion, archivo, usuario, fecha, hora, empresa_id) 
                                           VALUES(:historico_id, :estado, :observacion, :archivo, :usuario, :fecha, :hora, :empresa_id)");

            $sqlUpdate = $this->_db3->prepare("UPDATE cmx_instruccion_facturacion SET estado_instruccion = :estado_instruccion, total_factura = :total_factura, num_factura = :num_factura WHERE id = :instruccion_id");

            $sqlUpdateInstruccionDetalle = $this->_db3->prepare("UPDATE cmx_detalle_instruccion_facturacion SET estado_facturacion = :estado_facturacion WHERE instruccion_id = :instruccion_id");

            $sqlUpdateRemesa = $this->_db3->prepare("UPDATE cmx_remesa SET estado_facturacion = :estado_facturacion WHERE id = :remesa_id");

            $asociaciones = $datos['asociaciones'];

            if (!is_array($asociaciones) || empty($asociaciones)) {
                throw new Exception("No se recibieron asociaciones válidas.");
            }

            foreach ($asociaciones as $asociacion) {
                $instruccion_id = $asociacion['instruccion_id'];

                // Valores individuales por instrucción
                $estado = $asociacion['estado'];
                $descripcion = $asociacion['descripcion_factura'];
                $numero_factura = $asociacion['numero_factura'];

                // // Limpiar y convertir valores monetarios
                // $total_factura_raw = str_replace(['$', ',', '.', ' ', ' '], ['', '', '', '', ''], $asociacion['total_factura']);
                // // $total_factura = floatval($total_factura_raw) / 100;
                // $total_factura = floatval($total_factura_raw);

                // $total_factura_instr_raw = str_replace(['$', ',', '.', ' ', ' '], ['', '', '', '', ''], $asociacion['total_factura_instruccion']);
                // // $total_factura_instruccion = floatval($total_factura_instr_raw) / 100;
                // $total_factura_instruccion = floatval($total_factura_instr_raw);


                // Limpiar y convertir valores monetarios
                // $total_factura_raw = str_replace(['$', ',', '.', ' ', ' '], ['', '', '', '', ''], $asociacion['total_factura']);
                // $total_factura = floatval($total_factura_raw) / 100;
                // $total_factura = floatval($total_factura_raw);

                // Paso 1: Quitar el símbolo de pesos y espacios
                $total_factura_raw = str_replace(['$', ' ', ' '], '', $asociacion['total_factura']);

                // Paso 2: Reemplazar puntos de miles y cambiar coma decimal por punto
                $valorDecimalTotal = str_replace('.', '', $total_factura_raw); // "1400000,00"
                $valorDecimalTotal = str_replace(',', '.', $valorDecimalTotal); // "1400000.00"


                // Paso 3: Convertir a float o dejar como string para la base de datos
                $total_factura = floatval($valorDecimalTotal); // 1400000.00

                //Total facturacion de los procesos cuando es rechazado y pendiente facturar

                // Paso 1: Quitar el símbolo de pesos y espacios
                $valorLimpio = str_replace(['$', ' ', ' '], '', $asociacion['total_factura_instruccion']);

                // Paso 2: Reemplazar puntos de miles y cambiar coma decimal por punto
                $valorDecimal = str_replace('.', '', $valorLimpio); // "1400000,00"
                $valorDecimal = str_replace(',', '.', $valorDecimal); // "1400000.00"

                // Paso 3: Convertir a float o dejar como string para la base de datos
                $total_factura_instruccion = floatval($valorDecimal); // 1400000.00

                // Procesar archivo (una vez por factura)
                $rutaArchivoGuardado = null;
                if ($estado === 'Completada') {
                    $ruta = 'public/files/Instrucciones/' . $numero_factura . '/';
                    if (!is_dir($ruta)) {
                        if (!mkdir($ruta, 0777, true)) {
                            throw new Exception("No se pudo crear el directorio de almacenamiento.");
                        }
                    }

                    if (isset($_FILES['archivo']) && $_FILES['archivo']['tmp_name']) {
                        $nombre_archivo = basename($_FILES['archivo']['name']);
                        $rutaCompleta = $ruta . $nombre_archivo;
                        if (!move_uploaded_file($_FILES['archivo']['tmp_name'], $rutaCompleta)) {
                            throw new Exception("Error al mover el archivo.");
                        }
                        $rutaArchivoGuardado = $rutaCompleta;
                    }
                }

                // 1. Insertar en trazabilidad
                $sqlInsert->execute([
                    ':historico_id' => $instruccion_id,
                    ':estado' => $estado,
                    ':observacion' => $descripcion,
                    ':archivo' => $rutaArchivoGuardado,
                    ':usuario' => $_SESSION['usuario']['nom_usuario'],
                    ':fecha' => date('Y-m-d'),
                    ':hora' => date('H:i:s'),
                    ':empresa_id' => $_SESSION['usuario']['empresa_id'] ?? 1
                ]);

                // 2. Actualizar instrucción
                if ($estado === 'Pendiente Facturar' || $estado === 'Rechazada') {
                    $sqlUpdate->execute([
                        ':estado_instruccion' => $estado,
                        ':total_factura' => $total_factura_instruccion,
                        ':num_factura' => null,
                        ':instruccion_id' => $instruccion_id
                    ]);
                } else {
                    $sqlUpdate->execute([
                        ':estado_instruccion' => 'Completada',
                        ':total_factura' => $total_factura,
                        ':num_factura' => $numero_factura,
                        ':instruccion_id' => $instruccion_id
                    ]);
                }

                // 3. Actualizar detalles
                $sqlUpdateInstruccionDetalle->execute([
                    ':estado_facturacion' => $estado,
                    ':instruccion_id' => $instruccion_id
                ]);

                // 4. Actualizar remesas si hay
                if (!empty($asociacion['remesas'])) {
                    foreach ($asociacion['remesas'] as $remesa_id) {
                        $estado_remesa = ($estado === 'Completada') ? 'Facturada' : 'Instruccion';
                        $sqlUpdateRemesa->execute([
                            ':estado_facturacion' => $estado_remesa,
                            ':remesa_id' => $remesa_id
                        ]);
                    }
                }
            }

            $this->_db3->commit();
            return [
                'success' => true,
                'message' => 'Las instrucciones fueron trazadas correctamente.'
            ];
        } catch (Exception $e) {
            $this->_db3->rollBack();
            error_log("Error Insertar_Trazabilidad_Facturacion: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Ocurrió un error al guardar la trazabilidad de facturación.'
            ];
        }
    }

    public function Listar_Historico_Instrucciones_Facturacion()
    {
        $sql = $this->_db3->prepare("SELECT
            cl.id AS cliente_id,
            cl.documento AS documento_cliente,
            cl.nombre AS cliente_nombre,
            COUNT(DISTINCT ift.id) AS total_instrucciones,
            -- SUM(ift.total_instruccion) AS total_facturacion,
            -- SUM(DISTINCT ift.total_instruccion) AS total_facturacion,
            SUM(DISTINCT ift.total_factura) AS total_facturacion,
            us.nom_usuario AS Comercial
        FROM
            cmx_instruccion_facturacion ift
            INNER JOIN cmx_detalle_instruccion_facturacion dif ON ift.id = dif.instruccion_id
            INNER JOIN cmx_clientes cl ON ift.cliente_id = cl.id
            INNER JOIN cmx_usuarios us ON ift.comercial_id = us.id
        /*WHERE
            ift.estado_instruccion = 'Pendiente'*/
        GROUP BY
            cl.id,
            cl.nombre
        ORDER BY
            cl.nombre");
        $sql->execute();
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function Detalle_Historico_Instrucciones_Facturacion_Cliente($ClienteId)
    {
        $sql = $this->_db3->prepare("SELECT 
        DISTINCT(dif.remesa_id),
        ift.*, 
        dif.*, 
        cl.id AS cliente_id,
        cl.nombre AS cliente_nombre, 
        us.nom_usuario AS comercial_nombre,
        -- oc.ve_tarifacalculada AS Total_Remesa,
        dm.total_tarifa AS Total_Remesa,
        ehi.archivo,
        ehi.observacion AS Observacion_Respuesta,
        ift.total_factura AS Total_factura_Instruccion,
        CONCAT(ift.fecha,' ',ift.hora) AS Fecha_Instrccion,
        ma.id AS Manifiesto,
        CONCAT(ori.municipio,' ',ori.depto) AS Origen,
        CONCAT(des.municipio,' ',des.depto) AS Destino,
        idoc.ruta_documento,
        idoc.nombre_documento
        FROM cmx_instruccion_facturacion ift 
        INNER JOIN cmx_detalle_instruccion_facturacion dif ON ift.id = dif.instruccion_id
        INNER JOIN cmx_clientes cl ON ift.cliente_id = cl.id
        INNER JOIN cmx_usuarios us ON ift.comercial_id = us.id
        INNER JOIN cmx_remesa_ordencargue ro ON dif.remesa_id = ro.id_remesa
        INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue = oc.id
        INNER JOIN cmx_solicitud_vehiculo2 ss ON oc.mer_idservicio = ss.nundoc_solicitud
        INNER JOIN cmx_detalle_mercancia2 dm ON ss.n_cotizacion = dm.n_cotizacion
        INNER JOIN cmx_manifiesto_remesa mr ON ro.id_remesa=mr.id_remesa
        INNER JOIN cmx_remesa rm ON mr.id_remesa=rm.id
        INNER JOIN cmx_manifiesto ma ON mr.id_manifiesto=ma.id
        INNER JOIN cmx_municipios ori ON ma.origen_viaje=ori.id
        INNER JOIN cmx_municipios des ON ma.destino_viaje=des.id
        LEFT JOIN cmx_instruccion_documentos idoc ON ift.id=idoc.instruccion_id
        LEFT JOIN cmx_estado_historico_instruccion ehi 
        ON ehi.id = (
            SELECT MAX(ehi2.id)
            FROM cmx_estado_historico_instruccion ehi2
            WHERE ehi2.historico_id = ift.id LIMIT 1
        )
        WHERE cl.id = :ClienteId -- Aquí va el ID del cliente específico
        ORDER BY ift.id, dif.id");
        $sql->bindParam(':ClienteId', $ClienteId);
        $sql->execute();
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function Remesas_Por_Instruccion($ClienteId)
    {
        $sqlBase = "SELECT
            rm.id AS numdoc_remesa,
            CONCAT(rm.fecha_creacion,' ', rm.hora_creacion) AS fecha_remesa,
            cl.nombre AS Cliente,
            ma.placa,
            tm.nombre,
            IF (rm.remesa_contado=1,'Contado','-') AS Remesa_Contado,
            IF (rm.remesa_contraentrega=1,'Contra entrega','-') AS Remesa_Contra_Entrega,
            ma.Lugar,
            CONCAT(ori.municipio,' ',ori.depto) AS Origen,
            CONCAT(des.municipio,' ',des.depto) AS Destino,
            -- oc.ve_tarifacalculada AS Total_Remesa,
            dm.total_tarifa AS Total_Remesa,
            ss.usuario_auditor AS Comercial,
            IF(ds.observacion='','-',ds.observacion) AS Observacion,
            rm.estado_facturacion
        FROM
            cmx_manifiesto ma
            INNER JOIN cmx_manifiesto_estado me ON ma.id=me.id_manifiesto AND me.estado=1
            INNER JOIN cmx_manifiesto_remesa mr ON ma.id = mr.id_manifiesto AND mr.estado = 1
            INNER JOIN cmx_remesa rm ON mr.id_remesa = rm.id
            INNER JOIN cmx_remesas_transmision rt ON rm.id = rt.id_remesa AND rt.estado = 1
            INNER JOIN cmx_remesa_ordencargue ro ON rm.id = ro.id_remesa
            INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue = oc.id
            INNER JOIN cmx_clientes cl ON oc.cli_id = cl.id
            INNER JOIN cmx_solicitud_vehiculo2 ss ON oc.mer_idservicio = ss.nundoc_solicitud
            INNER JOIN cmx_detalle_mercancia2 dm ON ss.n_cotizacion = dm.n_cotizacion
            INNER JOIN cmx_para_tipo_mercancia tm ON dm.id_mercancia = tm.id
            INNER JOIN cmx_municipios ori ON ma.origen_viaje = ori.id
            INNER JOIN cmx_municipios des ON ma.destino_viaje = des.id
            INNER JOIN cmx_destinatarios_ss ds ON ss.nundoc_solicitud = ds.solicitud_servicio
        WHERE
            cl.id = :ClienteId
            AND ma.estadomnf_actual = 1
            AND rm.estado_facturacion = 'Pendiente'
            GROUP BY ma.id";
        $sql = $this->_db3->prepare($sqlBase);
        $sql->bindParam(':ClienteId', $ClienteId, PDO::PARAM_INT);
        $sql->execute();
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    // public function InsertarRemesaEnInstruccion($remesaId, $instruccionId)
    public function InsertarRemesaEnInstruccion($remesaId, $instruccionId, $total_Instruccion_Facturacion, $total_Servicio_especial, $total_instruccion, $descripcion_instruccion_sac)
    {
        $nom_usuario = $_SESSION['usuario']['nom_usuario'] ?? null;
        $usuario_id = $_SESSION['usuario']['id_usuario'] ?? null;
        $estado_instruccion = 'Instruccion';
        $estado = 'Pendiente';
        $date = new DateTime('now', new DateTimeZone('America/Bogota'));
        $fecha = $date->format('Y-m-d');
        $hora = $date->format('H:i:s');

        try {
            // Inicia la transacción
            $this->_db3->beginTransaction();


            $sql_update = $this->_db3->prepare("UPDATE cmx_instruccion_facturacion 
            SET 
                total_instruccion = :total_instruccion,
                total_factura = :total_factura,
                total_servicios_especiales = :total_servicios_especiales,
                estado_instruccion = :estado_instruccion,
                observaciones = :observaciones,
                usuario = :usuario,
                fecha = :fecha,
                hora = :hora,
                empresa_id = :empresa_id
            WHERE id = :instruccion_id");

            // $sql_update->bindParam(':cliente_id', $datos['ClienteId']);
            // $sql_update->bindParam(':comercial_id', $usuario_id);
            // $sql_update->bindParam(':nombre', $datos['Nombre']);
            $sql_update->bindParam(':total_instruccion', $total_Instruccion_Facturacion);
            $sql_update->bindParam(':total_factura', $total_instruccion);
            $sql_update->bindParam(':total_servicios_especiales', $total_Servicio_especial);
            $sql_update->bindParam(':estado_instruccion', $estado);
            $sql_update->bindParam(':observaciones', $descripcion_instruccion_sac);
            $sql_update->bindParam(':usuario', $nom_usuario);
            $sql_update->bindParam(':fecha', $fecha);
            $sql_update->bindParam(':hora', $hora);
            $sql_update->bindParam(':empresa_id', $empresa_id);
            $sql_update->bindParam(':instruccion_id', $instruccionId); // Debes tener este dato en $datos
            $sql_update->execute();

            if ($sql_update) {

                if ($remesaId != null) {
                    $sql_insert_remesas = $this->_db3->prepare("
                    INSERT INTO cmx_detalle_instruccion_facturacion(instruccion_id, remesa_id, usuario, fecha, hora)
                    VALUE(:instruccion_id, :remesa_id, :usuario, :fecha, :hora)
                    ");

                    $sql_update = $this->_db3->prepare("
                    UPDATE cmx_remesa SET estado_facturacion = :estado_facturacion WHERE id = :remesa_id
                    ");

                    foreach ($remesaId as $remesa) {
                        // Insertar detalle
                        $sql_insert_remesas->execute([
                            ':instruccion_id' => $instruccionId,
                            ':remesa_id'      => $remesa,
                            ':usuario'        => $nom_usuario,
                            ':fecha'          => $fecha,
                            ':hora'           => $hora,
                        ]);

                        // Actualizar estado de la remesa
                        $sql_update->execute([
                            ':estado_facturacion' => $estado_instruccion,
                            ':remesa_id'          => $remesa,
                        ]);
                    }
                }
                // Confirmar transacción
                $this->_db3->commit();
                return ['success' => true];
            }
        } catch (Exception $e) {
            // Revertir transacción
            $this->_db3->rollBack();
            error_log('Error al insertar remesas: ' . $e->getMessage());
            return ['success' => false, 'message' => 'Error al insertar remesas: ' . $e->getMessage()];
        }
    }

    public function removerDeInstruccion($remesaId, $instruccionId, $nuevoTotalInstruccion, $nuevoTotalFactura)
    {
        try {
            // Iniciar transacción
            $this->_db3->beginTransaction();

            // 1. Actualizar totales de la instrucción
            $sqlUpdateTotal = "UPDATE cmx_instruccion_facturacion 
                           SET total_instruccion = :total_instruccion, total_factura = :total_factura 
                           WHERE id = :Id";
            $stmtTotal = $this->_db3->prepare($sqlUpdateTotal);
            $stmtTotal->bindParam(':total_instruccion', $nuevoTotalInstruccion, PDO::PARAM_STR);
            $stmtTotal->bindParam(':total_factura', $nuevoTotalFactura, PDO::PARAM_STR);
            $stmtTotal->bindParam(':Id', $instruccionId, PDO::PARAM_INT);
            $stmtTotal->execute();

            // 2. Marcar como "Eliminada" en el detalle
            $sql = "UPDATE cmx_detalle_instruccion_facturacion 
                SET estado_facturacion = :estado_facturacion 
                WHERE instruccion_id = :instruccion_id AND remesa_id = :remesa_id";
            $stmt = $this->_db3->prepare($sql);
            $estadoDetalle = 'Eliminada';
            $stmt->bindParam(':estado_facturacion', $estadoDetalle, PDO::PARAM_STR);
            $stmt->bindParam(':instruccion_id', $instruccionId, PDO::PARAM_INT);
            $stmt->bindParam(':remesa_id', $remesaId, PDO::PARAM_INT);
            $stmt->execute();

            // 3. Actualizar estado general de la remesa
            $sqlUpdateRemesa = "UPDATE cmx_remesa 
                            SET estado_facturacion = :estado_facturacion 
                            WHERE id = :remesa_id";
            $stmtUpdate = $this->_db3->prepare($sqlUpdateRemesa);
            $estadoRemesa = 'Pendiente';
            $stmtUpdate->bindParam(':estado_facturacion', $estadoRemesa, PDO::PARAM_STR);
            $stmtUpdate->bindParam(':remesa_id', $remesaId, PDO::PARAM_INT);
            $stmtUpdate->execute();

            // Confirmar transacción
            $this->_db3->commit();

            return [
                'success' => true,
                'message' => "Remesa $remesaId removida de la instrucción $instruccionId y totales actualizados correctamente."
            ];
        } catch (PDOException $e) {
            // Revertir cambios si algo falla
            $this->_db3->rollBack();
            return [
                'success' => false,
                'message' => 'Error en la base de datos: ' . $e->getMessage()
            ];
        }
    }

    public function Listar_Saldos_Precintos_Operaciones()
    {
        // $sql = $this->_db3->prepare("");
        // 1. Consultar los rangos de precintos en Bogotá
        $sql = $this->_db3->query("
            SELECT codigo_precinto, tipo_precinto 
            FROM cmx_precintos_movimientos 
            WHERE destino = 'Bogotá' 
            GROUP BY codigo_precinto, tipo_precinto
            ORDER BY codigo_precinto
        ");

        $rangos = $sql->fetchAll(PDO::FETCH_ASSOC);

        $resultado = [];

        foreach ($rangos as $rango) {
            // 2. Separar el rango (ej: 14291-14300)
            list($inicio, $fin) = explode('-', $rango['codigo_precinto']);
            $tipo = $rango['tipo_precinto'];

            // 3. Consultar total, asignados y disponibles
            $stmt = $this->_db3->prepare("
                SELECT estado, COUNT(*) AS cantidad
                FROM cmx_precinto
                WHERE codigo BETWEEN :inicio AND :fin
                AND tipo_precinto = :tipo
                GROUP BY estado
            ");
            $stmt->execute([
                ':inicio' => $inicio,
                ':fin' => $fin,
                ':tipo' => $tipo,
            ]);

            $conteo = [
                'Disponible' => 0,
                'Asignado' => 0
            ];

            while ($fila = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $conteo[$fila['estado']] = $fila['cantidad'];
            }

            // 4. Agregar a resultados
            $resultado[] = [
                'rango' => $rango['codigo_precinto'],
                'tipo_precinto' => $tipo,
                'total' => ($fin - $inicio + 1),
                'asignados' => $conteo['Asignado'] ?? 0,
                'disponibles' => $conteo['Disponible'] ?? 0,
            ];
        }

        // 5. Mostrar resultados (puedes reemplazar esto con HTML)
        foreach ($resultado as $fila) {
            echo "Rango: {$fila['rango']}, Tipo: {$fila['tipo_precinto']}, Total: {$fila['total']}, Asignados: {$fila['asignados']}, Disponibles: {$fila['disponibles']}<br>";
        }
    }

    public function Actualizar_Documentos_Instruccion_Facturacion($datos)
    {
        $response = ['status' => 'error', 'message' => 'Ocurrió un error inesperado.'];
        $archivos = $datos['adjuntos'];

        try {
            // Iniciar transacción
            $this->_db3->beginTransaction();

            $date = new DateTime('now', new DateTimeZone('America/Bogota'));
            $fecha = $date->format('Y-m-d');
            $hora = $date->format('H:i:s');

            $empresa_id = $_SESSION['usuario']['empresa_id'] ?? null;
            $nom_usuario = $_SESSION['usuario']['nom_usuario'] ?? null;
            $usuario_id = $_SESSION['usuario']['id_usuario'] ?? null;

            if (!empty($archivos)) {

                $rutaexcel = 'public/files/Instrucciones/Excel/' . $datos['instruccionId'] . '/';

                // Crear carpeta si no existe
                if (!is_dir($rutaexcel)) {
                    if (!mkdir($rutaexcel, 0777, true)) {
                        throw new Exception("No se pudo crear el directorio de almacenamiento.");
                    }
                }

                // Guardar Excel
                if (!empty($archivos['excel']['name'])) {
                    $nombreExcel = basename($archivos['excel']['name']);
                    $nombreFinalExcel = preg_replace('/[^a-zA-Z0-9_\.-]/', '_', $nombreExcel);
                    $extensionExcel = pathinfo($nombreFinalExcel, PATHINFO_EXTENSION);
                    $extPermitidas = ['xlsx', 'xls'];

                    if (!in_array(strtolower($extensionExcel), $extPermitidas)) {
                        throw new Exception("El archivo $nombreExcel tiene una extensión no permitida.");
                    }

                    $tmpExcel = $archivos['excel']['tmp_name'];
                    $destinoExcel = $rutaexcel . $nombreFinalExcel;

                    if (move_uploaded_file($tmpExcel, $destinoExcel)) {

                        // 🔁 Desactivar anteriores
                        $sqlUpdate = $this->_db3->prepare("UPDATE cmx_instruccion_documentos SET estado_visualizar = 'Inactivo' WHERE instruccion_id = :instruccion_id AND estado_visualizar = 'Activo' AND tipo_documento='Excel'");
                        $sqlUpdate->execute([
                            ':instruccion_id' => $datos['instruccionId']
                        ]);

                        // Verificar si ya existe el documento con el mismo nombre
                        $sqlCheck = $this->_db3->prepare("SELECT COUNT(*) FROM cmx_instruccion_documentos WHERE instruccion_id = :instruccion_id AND nombre_documento = :nombre_documento");
                        $sqlCheck->execute([
                            ':instruccion_id' => $datos['instruccionId'],
                            ':nombre_documento' => $nombreFinalExcel
                        ]);
                        $existe = $sqlCheck->fetchColumn();

                        if ($existe == 0) {
                            $sqlInsertExcel = $this->_db3->prepare("INSERT INTO cmx_instruccion_documentos (instruccion_id, ruta_documento, nombre_documento, usuario, fecha, hora, empresa_id) 
                            VALUES (:instruccion_id, :ruta_documento, :nombre_documento, :usuario, :fecha, :hora, :empresa_id)");
                            $sqlInsertExcel->execute([
                                ':instruccion_id' =>  $datos['instruccionId'],
                                ':ruta_documento' => $rutaexcel . $nombreFinalExcel,
                                ':nombre_documento' => $nombreFinalExcel,
                                ':usuario' => $nom_usuario,
                                ':fecha' => $fecha,
                                ':hora' => $hora,
                                ':empresa_id' => $empresa_id
                            ]);
                        }
                    } else {
                        throw new Exception("No se pudo mover el archivo Excel.");
                    }
                }

                // Guardar Soportes
                if (!empty($archivos['archivo'])) {
                    $rutasoportes = 'public/files/Instrucciones/Soportes/' . $datos['instruccionId'] . '/';

                    if (!is_dir($rutasoportes)) {
                        if (!mkdir($rutasoportes, 0777, true)) {
                            throw new Exception("No se pudo crear el directorio de almacenamiento.");
                        }
                    }

                    if (!empty($archivos['archivo']['name'][0])) {
                        foreach ($archivos['archivo']['name'] as $i => $nombreArchivo) {
                            $tmp = $archivos['archivo']['tmp_name'][$i];
                            $nombreFinal = preg_replace('/[^a-zA-Z0-9_\.-]/', '_', basename($nombreArchivo));
                            $extension = pathinfo($nombreFinal, PATHINFO_EXTENSION);
                            $extPermitidas = ['pdf', 'jpg', 'jpeg', 'png'];

                            if (!in_array(strtolower($extension), $extPermitidas)) {
                                throw new Exception("El archivo $nombreFinal tiene una extensión no permitida.");
                            }

                            $destino = $rutasoportes . $nombreFinal;

                            if (move_uploaded_file($tmp, $destino)) {
                                // 🔁 Desactivar anteriores
                                $sqlUpdate = $this->_db3->prepare("UPDATE cmx_instruccion_documentos SET estado_visualizar = 'Inactivo' WHERE instruccion_id = :instruccion_id AND estado_visualizar = 'Activo' AND tipo_documento='Soporte'");
                                $sqlUpdate->execute([
                                    ':instruccion_id' => $datos['instruccionId']
                                ]);

                                // Verificar si ya existe
                                $sqlCheck = $this->_db3->prepare("SELECT COUNT(*) FROM cmx_instruccion_documentos WHERE instruccion_id = :instruccion_id AND nombre_documento = :nombre_documento");
                                $sqlCheck->execute([
                                    ':instruccion_id' => $datos['instruccionId'],
                                    ':nombre_documento' => $nombreFinal
                                ]);
                                $existe = $sqlCheck->fetchColumn();

                                if ($existe == 0) {
                                    $sqlInsertSoporte = $this->_db3->prepare("INSERT INTO cmx_instruccion_documentos (instruccion_id, ruta_documento, nombre_documento, usuario, fecha, hora, empresa_id) 
                                VALUES (:instruccion_id, :ruta_documento, :nombre_documento, :usuario, :fecha, :hora, :empresa_id)");
                                    $sqlInsertSoporte->execute([
                                        ':instruccion_id' =>  $datos['instruccionId'],
                                        ':ruta_documento' => $rutasoportes . $nombreFinal,
                                        ':nombre_documento' => $nombreFinal,
                                        ':usuario' => $nom_usuario,
                                        ':fecha' => $fecha,
                                        ':hora' => $hora,
                                        ':empresa_id' => $empresa_id
                                    ]);
                                }
                            } else {
                                throw new Exception("No se pudo mover el archivo: $nombreFinal");
                            }
                        }
                    }
                }
            }

            // Confirmar transacción
            $this->_db3->commit();
            $response = [
                'status' => 'success',
                'message' => 'Instrucción registrada exitosamente.',
                'instruccion_id' =>  $datos['instruccionId']
            ];
        } catch (\Throwable $e) {
            //throw $th;
            $this->_db3->rollBack();
            $response = [
                'status' => 'error',
                'message' => 'Error al guardar la instrucción: ' . $e->getMessage()
            ];
        }

        return $response;
    }

    public function updateMercancia($data)
    {
        try {
            $this->_db3->beginTransaction(); // 🔹 Inicia la transacción

            $fecha = date('Y-m-d');

            # Verificar que la solicitud no esté en estudio de seguridad
            $sql_validar = $this->_db3->prepare("
                SELECT 1 
                FROM cmx_preestudio_solicitudes_servicio es 
                INNER JOIN cmx_estudiov_completo ec 
                    ON es.id_solicitudpreestudio = ec.id_estudio AND ec.estado_actu = 1
                INNER JOIN cmx_solicitud_vehiculo2 ss 
                    ON es.id_servicio_cliente = ss.nundoc_solicitud
                WHERE ss.nundoc_solicitud = :dato 
                AND ec.fecha = :fecha 
                AND (ec.estado != 'Cancelado' OR ec.estado != 'Rechazado' OR ec.estado IS NOT NULL)
            ");
            $sql_validar->bindParam(':dato', $data['SolicitudId'], PDO::PARAM_STR);
            $sql_validar->bindParam(':fecha', $fecha, PDO::PARAM_STR);
            $sql_validar->execute();
            $validar_estudio = $sql_validar->fetchAll(PDO::FETCH_ASSOC);

            if (count($validar_estudio) > 0) {
                $this->_db3->rollBack();
                return [
                    'status' => 400,
                    'message' => 'La solicitud no puede ser modificada, ya que está en un estudio de seguridad activo o vigente.'
                ];
            }

            // 🔹 Mapa de equivalencias
            $mapaCampos = [
                "itr"             => "itr",
                "tipo_mercancia"  => "tipo_mercancia",
                "codmercancia"    => "id_mercancia",
                "tipo_empaque"    => "tipo_empaque",
                "origen_cliente"  => "origen",
                "destino_cliente" => "destino",
                "npbruto"         => "peso_bruto_kg",
                "epesone"         => "peso_neto_kg",
                "enetotn"         => "peso_neto_tn",
                "flete"           => "flete",
                "totaltarifa"     => "total_tarifa",
                "rentabilidad"    => "utilidad",
                "renta"           => "rentabilidad",
                "observa"         => "observacion",
            ];

            $camposNumericos = ["npbruto", "epesone", "enetotn", "flete", "totaltarifa", "rentabilidad", "renta"];

            $set = [];
            $params = [];

            foreach ($mapaCampos as $campoInput => $campoDB) {
                if (isset($data[$campoInput]) && $data[$campoInput] !== "" && $data[$campoInput] !== null) {
                    $valor = in_array($campoInput, $camposNumericos)
                        ? $this->normalizaNumero($data[$campoInput])
                        : $data[$campoInput];

                    $set[] = "$campoDB = :$campoInput";
                    $params[":$campoInput"] = $valor;
                }
            }

            if (empty($set)) {
                $this->_db3->rollBack();
                return [
                    "status" => 400,
                    "message" => "No se recibieron campos para actualizar"
                ];
            }

            // 🔹 Actualizar cmx_detalle_mercancia2
            $sql = "UPDATE cmx_detalle_mercancia2 
                SET " . implode(", ", $set) . " 
                WHERE n_cotizacion = :ContizacionId";
            $params[":ContizacionId"] = $data["ContizacionId"];

            $stmt = $this->_db3->prepare($sql);
            $stmt->execute($params);

            if (!empty($data['epesone'])) {
                $sql2 = "UPDATE cmx_ruta_puntosentrega SET peso=:Peso WHERE cod_ini_ruta=:CodRuta";
                $stmt2 = $this->_db3->prepare($sql2);
                $stmt2->bindParam(':Peso', $data['epesone']);
                $stmt2->bindParam(':CodRuta', $data['SolicitudId']);
                $stmt2->execute();
            }

            // 🔹 Actualizar cmx_cotizaciones_serviciocliente si hay valores clave
            if (!empty($data['flete']) && !empty($data['totaltarifa']) && !empty($data['rentabilidad']) && !empty($data['renta'])) {
                // Normalizar primero en variables
                $totalTransporte = $this->normalizaNumero($data['totaltarifa']);
                $totalCotizacion = $this->normalizaNumero($data['totaltarifa']);
                $tmerFlete       = $this->normalizaNumero($data['flete']);
                $tmerUtili       = $this->normalizaNumero($data['rentabilidad']);
                $tmerRent        = $this->normalizaNumero($data['renta']);
                $nCotizacion     = $data['ContizacionId'];

                $sql2 = $this->_db3->prepare("
                    UPDATE cmx_cotizaciones_serviciocliente 
                    SET total_transporte = :total_transporte, 
                        total_cotizacion = :total_cotizacion,
                        tmer_flete = :tmer_flete,
                        tmer_utili = :tmer_utili,
                        tmer_rent = :tmer_rent 
                    WHERE n_cotizacion = :n_cotizacion
                ");

                $sql2->bindParam(':total_transporte', $totalTransporte);
                $sql2->bindParam(':total_cotizacion', $totalCotizacion);
                $sql2->bindParam(':tmer_flete', $tmerFlete);
                $sql2->bindParam(':tmer_utili', $tmerUtili);
                $sql2->bindParam(':tmer_rent', $tmerRent);
                $sql2->bindParam(':n_cotizacion', $nCotizacion);

                $sql2->execute();
            }

            $this->_db3->commit(); // 🔹 Confirmar cambios

            return ["status" => 200, "message" => "Datos de mercancía actualizados correctamente"];
        } catch (Exception $e) {
            $this->_db3->rollBack(); // 🔹 Revertir cambios
            return [
                "status" => 500,
                "message" => "Error en la actualización: " . $e->getMessage()
            ];
        }
    }

    private function normalizaNumero($valor)
    {
        if ($valor === "" || $valor === null) {
            return null;
        }
        // quitar comas de miles
        $valor = str_replace(",", "", $valor);
        return is_numeric($valor) ? $valor : null;
    }

    public function updateGrupoClientes($grupo, $id_servicio)
    {
        // Primero borrar los grupos existentes del servicio
        $sqlDelete = "DELETE FROM cmx_grupocliente_servicio WHERE id_servicio = :id_servicio";
        $stmt = $this->_db3->prepare($sqlDelete);
        $stmt->bindParam(':id_servicio', $id_servicio, PDO::PARAM_INT);
        $stmt->execute();

        // Asegurar que $grupo siempre sea un array
        if (is_string($grupo)) {
            $grupocliente_array = explode(',', $grupo);
        } elseif (is_array($grupo)) {
            $grupocliente_array = $grupo;
        } else {
            $grupocliente_array = [];
        }

        // Limpiar espacios
        $grupocliente_array = array_map('trim', $grupocliente_array);

        // Insertar nuevamente
        foreach ($grupocliente_array as $id_grupo) {
            if ($id_grupo === '') {
                continue; // evitar inserts vacíos
            }

            $sql = "INSERT INTO cmx_grupocliente_servicio (id, id_grupo, id_servicio) 
                VALUES(NULL, :id_grupo, :id_servicio)";
            $stmt = $this->_db3->prepare($sql);
            $stmt->bindParam(':id_servicio', $id_servicio, PDO::PARAM_INT);
            $stmt->bindParam(':id_grupo', $id_grupo, PDO::PARAM_INT);
            $stmt->execute();
        }
    }

    public function updateHorasClientes($horacliente, $datos, $id_servicio)
    {
        $user = $_SESSION["usuario"]["nom_usuario"];
        // Primero borrar las horas existentes del servicio
        $sqlDelete = "DELETE FROM cmx_horacliente_servicio WHERE id_servicio = :id_servicio";
        $stmt = $this->_db3->prepare($sqlDelete);
        $stmt->bindParam(':id_servicio', $id_servicio, PDO::PARAM_INT);
        $stmt->execute();

        // Asegurar que $horacliente siempre sea un array
        if (is_string($horacliente)) {
            $horacliente_array = explode(',', $horacliente);
        } elseif (is_array($horacliente)) {
            $horacliente_array = $horacliente;
        } else {
            $horacliente_array = [];
        }

        // Limpiar espacios
        $horacliente_array = array_map('trim', $horacliente_array);

        foreach ($horacliente_array as $hora_email) {
            if ($hora_email === '') {
                continue; // Evitar inserts vacíos
            }

            // Validar longitud
            if (strlen($hora_email) > 255) {
                $hora_email = substr($hora_email, 0, 255);
            }

            $sql = "INSERT INTO cmx_horacliente_servicio 
                (id, hora_email, id_servicio, usuario, fecha, hora) 
                VALUES(NULL, :hora_email, :id_servicio, :usuario, :fecha, :hora)";
            $stmt = $this->_db3->prepare($sql);
            $stmt->bindParam(':hora_email', $hora_email, PDO::PARAM_STR);
            $stmt->bindParam(':id_servicio', $id_servicio, PDO::PARAM_INT);
            $stmt->bindParam(':usuario', $user, PDO::PARAM_STR);
            $stmt->bindParam(':fecha', $datos['fecha_reg'], PDO::PARAM_STR);
            $stmt->bindParam(':hora', $datos['hora_reg'], PDO::PARAM_STR);
            $stmt->execute();
        }
    }

    public function Seleccionar_Documento_Solicitud($cotizacion, $Solicitud_Servicio)
    {
        $sql = $this->_db3->prepare("SELECT
            CONCAT(cs.nit, '-', cs.digito) AS Nudoc,
            cs.nit,
            cs.nombre_cliente,
            cs.direccion,
            cs.telefono,
            dm.itr,
            dm.tipo_mercancia,
            dm.naturaleza,
            dm.valor_mercancia,
            dm.tipo_servicio_mer,
            dm.tipo_empaque,
            dm.tipo_carga,
            dm.tipo_transporte,
            dm.origen,
            dm.destino,
            dm.tipo_vehiculo,
            dm.cant_vehiculo,
            dm.peso_bruto_kg,
            dm.peso_neto_kg,
            dm.peso_neto_tn,
            dm.cantidad_empaque,
            dm.flete,
            dm.utilidad,
            dm.total_tarifa,
            dm.rentabilidad,
            dm.observacion,
            ss.agencia
        FROM
            cmx_cotizaciones_serviciocliente cs
            INNER JOIN cmx_detalle_mercancia2 dm ON cs.n_cotizacion = dm.n_cotizacion
            INNER JOIN cmx_vehiculos_solicitud_servicio vss ON cs.n_cotizacion = vss.solicitud_id
            INNER JOIN cmx_estados_cotizacion ec ON cs.n_cotizacion = ec.n_cotizacion
            INNER JOIN cmx_grupocliente_servicio gs ON cs.n_cotizacion = gs.id_servicio
            INNER JOIN cmx_horacliente_servicio hs ON cs.n_cotizacion = hs.id_servicio
            INNER JOIN cmx_solicitud_vehiculo2 ss ON cs.n_cotizacion = ss.n_cotizacion
            INNER JOIN cmx_ruta_puntosentrega ren ON ss.nundoc_solicitud = ren.cod_ini_ruta
            INNER JOIN cmx_destinatarios_ss des ON ss.nundoc_solicitud = des.solicitud_servicio
        WHERE
            ss.nundoc_solicitud = :Numdoc
        GROUP BY
            cs.n_cotizacion");

        $sql->bindParam(":Numdoc", $Solicitud_Servicio, PDO::PARAM_STR);
        $sql->execute();
        $datosPrincipales = $sql->fetch(PDO::FETCH_ASSOC);

        // 🔹 Seleccionar grupos
        $sqlGrupo = $this->_db3->prepare("SELECT * FROM cmx_grupocliente_servicio WHERE id_servicio=:Numdoc");
        $sqlGrupo->bindParam(":Numdoc", $Solicitud_Servicio);
        $sqlGrupo->execute();
        $grupos = $sqlGrupo->fetchAll(PDO::FETCH_ASSOC);

        // 🔹 Seleccionar horas
        $sqlHoras = $this->_db3->prepare("SELECT * FROM cmx_horacliente_servicio WHERE id_servicio=:Numdoc");
        $sqlHoras->bindParam(":Numdoc", $Solicitud_Servicio);
        $sqlHoras->execute();
        $horas = $sqlHoras->fetchAll(PDO::FETCH_ASSOC);

        // 🔹 Remitentes y Destinatarios

        // 🔹 Retornar todo en un solo array
        return [
            "datos"  => $datosPrincipales,
            "grupos" => $grupos,
            "horas"  => $horas
        ];
    }

    public function Insertar_Solicitud_Anulacion($instruccion_Id, $evidencia, $observacion, $motivo, $estado_solicitud, $aprobacion_gerencia)
    {
        $response = [];
        $nom_usuario       = $_SESSION['usuario']['nom_usuario'] ?? null;
        $usuario_id        = $_SESSION['usuario']['id_usuario'] ?? null;
        $estado_visualizar = 1;
        $estado            = 'Pendiente';
        $empresa_id        = $_SESSION['usuario']['empresa_id'] ?? null;

        $date  = new DateTime('now', new DateTimeZone('America/Bogota'));
        $fecha = $date->format('Y-m-d');
        $hora  = $date->format('H:i:s');

        // 🔹 Carpeta donde guardar la evidencia
        $uploadDir = "public/files/solicitudes_anulacion/" . $instruccion_Id . "/";
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // 🔹 Definir ruta de archivo (si viene)
        $rutaEvidencia = null;
        if ($evidencia && isset($evidencia['tmp_name']) && is_uploaded_file($evidencia['tmp_name'])) {
            $nombreSeguro = time() . "_" . preg_replace('/[^A-Za-z0-9_\.-]/', '_', $evidencia['name']);
            $rutaEvidencia = $uploadDir . $nombreSeguro;
        }

        try {
            // 👉 Verificar si ya existe una solicitud para esta instrucción
            $check = $this->_db3->prepare("
                SELECT COUNT(*) AS total 
                FROM cmx_solicitud_instruccion 
                WHERE instruccion_id = :instruccion_id
            ");
            $check->bindParam(":instruccion_id", $instruccion_Id, PDO::PARAM_INT);
            $check->execute();
            $existe = $check->fetch(PDO::FETCH_ASSOC);

            if ($existe && $existe['total'] > 0) {
                return [
                    'status'  => 'warning',
                    'message' => 'Ya existe una solicitud de anulación para esta instrucción.'
                ];
            }

            // Iniciar transacción
            $this->_db3->beginTransaction();

            // Si hay archivo moverlo
            if ($rutaEvidencia) {
                if (!move_uploaded_file($evidencia['tmp_name'], $rutaEvidencia)) {
                    throw new Exception("Error al mover el archivo de evidencia.");
                }
            }

            // Guardar ruta relativa (no absoluta) en la BD
            $rutaRelativa = $rutaEvidencia ? "public/files/solicitudes_anulacion/" . $instruccion_Id . "/" . basename($rutaEvidencia) : null;

            $sql = $this->_db3->prepare("
                INSERT INTO cmx_solicitud_instruccion 
                (instruccion_id, solicitante_id, estado, motivo, aprobacion_gerencia ,observacion, evidencia, usuario, fecha, hora, estato_visualizacion, empresa_id) 
                VALUES 
                (:instruccion_id, :solicitante_id, :estado, :motivo, :aprobacion_gerencia ,:observacion, :evidencia, :usuario, :fecha, :hora, :estado_visualizacion, :empresa_id)
            ");

            $sql->bindParam(":instruccion_id", $instruccion_Id, PDO::PARAM_INT);
            $sql->bindParam(":solicitante_id", $usuario_id, PDO::PARAM_INT);
            $sql->bindParam(":estado", $estado, PDO::PARAM_STR);
            $sql->bindParam(":motivo", $motivo, PDO::PARAM_STR);
            $sql->bindParam(":aprobacion_gerencia", $aprobacion_gerencia, PDO::PARAM_STR);
            $sql->bindParam(":observacion", $observacion, PDO::PARAM_STR);
            $sql->bindParam(":evidencia", $rutaRelativa, PDO::PARAM_STR);
            $sql->bindParam(":usuario", $nom_usuario, PDO::PARAM_STR);
            $sql->bindParam(":fecha", $fecha, PDO::PARAM_STR);
            $sql->bindParam(":hora", $hora, PDO::PARAM_STR);
            $sql->bindParam(":estado_visualizacion", $estado_visualizar, PDO::PARAM_INT);
            $sql->bindParam(":empresa_id", $empresa_id, PDO::PARAM_INT);

            $sql->execute();

            if (!$sql) throw new Exception("Error al insertar solicitud de anulación.");

            //Actualizar Instrccion de facturacion
            // $sqlUpdateInstruccion = $this->_db3->prepare("UPDATE cmx_instruccion_facturacion SET estado_instruccion='Pendiente Anulacion' WHERE id=:Instruccion_id");
            $sqlUpdateInstruccion = $this->_db3->prepare("UPDATE cmx_instruccion_facturacion SET estado_instruccion=:Pendiente_Instruccion WHERE id=:Instruccion_id");
            $sqlUpdateInstruccion->bindParam(":Pendiente_Instruccion", $estado_solicitud, PDO::PARAM_STR);
            $sqlUpdateInstruccion->bindParam(":Instruccion_id", $instruccion_Id);
            $sqlUpdateInstruccion->execute();

            if (!$sqlUpdateInstruccion) throw new Exception("Error al insertar solicitud de anulación.");

            // $sqlUpdateInstruccionDetalle = $this->_db3->prepare("UPDATE cmx_detalle_instruccion_facturacion SET estado_facturacion='Pendiente Anulacion' WHERE instruccion_id=:Instruccion_id");
            $sqlUpdateInstruccionDetalle = $this->_db3->prepare("UPDATE cmx_detalle_instruccion_facturacion SET estado_facturacion=:Pendiente_Anulacion WHERE instruccion_id=:Instruccion_id");
            $sqlUpdateInstruccionDetalle->bindParam(":Pendiente_Anulacion", $estado_solicitud, PDO::PARAM_STR);
            $sqlUpdateInstruccionDetalle->bindParam(":Instruccion_id", $instruccion_Id);
            $sqlUpdateInstruccionDetalle->execute();

            if (!$sqlUpdateInstruccionDetalle) throw new Exception("Error al insertar solicitud de anulación.");

            $this->_db3->commit();

            $response = [
                'status'  => 'ok',
                'message' => 'Solicitud de anulación registrada correctamente',
                'evidencia' => $rutaRelativa
            ];
        } catch (\Throwable $th) {
            $this->_db3->rollBack();
            $response = [
                'status'  => 'error',
                'message' => $th->getMessage()
            ];
        }

        return $response;
    }

    public function Listar_Historico_Instrucciones_Facturacion_Anulacion()
    {
        if ($_SESSION['usuario']['id_perfil'] === 1) {
            $sql = $this->_db3->prepare("SELECT
                ift.id,
                cl.id AS cliente_id,
                cl.documento AS documento_cliente,
                cl.nombre AS cliente_nombre,
                COUNT(DISTINCT ift.id) AS total_instrucciones,
                -- SUM(ift.total_instruccion) AS total_facturacion,
                -- SUM(DISTINCT ift.total_instruccion) AS total_facturacion,
                SUM(DISTINCT ift.total_factura) AS total_facturacion,
                us.nom_usuario AS Comercial,
                si.id AS Solicitud_Id,
                si.solicitante_id
            FROM
                cmx_instruccion_facturacion ift
                INNER JOIN cmx_detalle_instruccion_facturacion dif ON ift.id = dif.instruccion_id
                INNER JOIN cmx_clientes cl ON ift.cliente_id = cl.id
                INNER JOIN cmx_usuarios us ON ift.comercial_id = us.id
                INNER JOIN cmx_solicitud_instruccion si ON ift.id = si.instruccion_id
            WHERE
                ift.estado_instruccion = 'Pendiente Anulacion Instruccion' OR ift.estado_instruccion = 'Pendiente Anulacion Factura' OR ift.estado_instruccion = 'Anulada' 
                AND si.aprobacion_gerencia='No Aplica' OR si.aprobacion_gerencia IS NULL
            GROUP BY
                cl.id,
                cl.nombre
            ORDER BY
                cl.nombre");
        } else if ($_SESSION['usuario']['id_perfil'] === 35) { // Perfil de Contabilidad
            $sql = $this->_db3->prepare("SELECT
                ift.id,
                cl.id AS cliente_id,
                cl.documento AS documento_cliente,
                cl.nombre AS cliente_nombre,
                COUNT(DISTINCT ift.id) AS total_instrucciones,
                -- SUM(ift.total_instruccion) AS total_facturacion,
                -- SUM(DISTINCT ift.total_instruccion) AS total_facturacion,
                SUM(DISTINCT ift.total_factura) AS total_facturacion,
                us.nom_usuario AS Comercial,
                si.id AS Solicitud_Id,
                si.solicitante_id
            FROM
                cmx_instruccion_facturacion ift
                INNER JOIN cmx_detalle_instruccion_facturacion dif ON ift.id = dif.instruccion_id
                INNER JOIN cmx_clientes cl ON ift.cliente_id = cl.id
                INNER JOIN cmx_usuarios us ON ift.comercial_id = us.id
                INNER JOIN cmx_solicitud_instruccion si ON ift.id = si.instruccion_id
            WHERE
                ift.estado_instruccion = 'Pendiente Anulacion Factura' OR ift.estado_instruccion = 'Pendiente Anulacion' AND si.aprobacion_gerencia='Si'
            GROUP BY
                cl.id,
                cl.nombre
            ORDER BY
                cl.nombre");
        }

        $sql->execute();
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function Detalle_Historico_Instrucciones_Facturacion_Cliente_Anulada($ClienteId)
    {
        $sql = $this->_db3->prepare("SELECT 
            DISTINCT(dif.remesa_id),
            ift.*, 
            dif.*, 
            cl.id AS cliente_id,
            cl.nombre AS cliente_nombre, 
            us.nom_usuario AS comercial_nombre,
            -- oc.ve_tarifacalculada AS Total_Remesa,
            dm.total_tarifa AS Total_Remesa,
            ehi.archivo,
            ehi.observacion AS Observacion_Respuesta,
            ift.total_factura AS Total_factura_Instruccion,
            CONCAT(ift.fecha,' ',ift.hora) AS Fecha_Instrccion,
            ma.id AS Manifiesto,
            CONCAT(ori.municipio,' ',ori.depto) AS Origen,
            CONCAT(des.municipio,' ',des.depto) AS Destino,
            idoc.ruta_documento,
            idoc.nombre_documento,
            ift.id,
            CONCAT(ift.id, ' - ', ift.nombre) AS Isntruccion,
            sa.motivo,
            sa.estado AS estado_anulacion,
            sa.observacion,
            sa.evidencia,
            sa.aprobacion_gerencia,
            sa.id AS Solicitud_Id
        FROM
            cmx_instruccion_facturacion ift
            INNER JOIN cmx_detalle_instruccion_facturacion dif ON ift.id = dif.instruccion_id
            INNER JOIN cmx_clientes cl ON ift.cliente_id = cl.id
            INNER JOIN cmx_usuarios us ON ift.comercial_id = us.id
            INNER JOIN cmx_remesa_ordencargue ro ON dif.remesa_id = ro.id_remesa
            INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue = oc.id
            INNER JOIN cmx_solicitud_vehiculo2 ss ON oc.mer_idservicio = ss.nundoc_solicitud
            INNER JOIN cmx_detalle_mercancia2 dm ON ss.n_cotizacion = dm.n_cotizacion
            INNER JOIN cmx_manifiesto_remesa mr ON ro.id_remesa = mr.id_remesa
            INNER JOIN cmx_remesa rm ON mr.id_remesa = rm.id
            INNER JOIN cmx_manifiesto ma ON mr.id_manifiesto = ma.id
            INNER JOIN cmx_municipios ori ON ma.origen_viaje = ori.id
            INNER JOIN cmx_municipios des ON ma.destino_viaje = des.id
            INNER JOIN cmx_solicitud_instruccion sa ON ift.id = sa.instruccion_id
            LEFT JOIN cmx_instruccion_documentos idoc ON ift.id = idoc.instruccion_id
            LEFT JOIN cmx_estado_historico_instruccion ehi ON ehi.id = (
                SELECT
                    MAX(ehi2.id)
                FROM
                    cmx_estado_historico_instruccion ehi2
                WHERE
                    ehi2.historico_id = ift.id
                LIMIT
                    1
            ) 
        WHERE cl.id = :ClienteId -- Aquí va el ID del cliente específico
        ORDER BY ift.id, dif.id");
        $sql->bindParam(':ClienteId', $ClienteId);
        $sql->execute();
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function Insertar_Anulacion_Contabilidad($data)
    {
        // print_r($data);
        $response = [];
        $nom_usuario       = $_SESSION['usuario']['nom_usuario'] ?? null;
        $usuario_id        = $_SESSION['usuario']['id_usuario'] ?? null;
        $estado_visualizar = 1;
        $estado            = 'Anulada';
        $empresa_id        = $_SESSION['usuario']['empresa_id'] ?? null;

        $date  = new DateTime('now', new DateTimeZone('America/Bogota'));
        $fecha = $date->format('Y-m-d');
        $hora  = $date->format('H:i:s');

        //update del primer moviemdnto de la instruccion
        $sqlUpdate = $this->_db3->prepare('UPDATE cmx_solicitud_instruccion SET estato_visualizacion=0 WHERE id=:Solicitud_Id AND instruccion_id=:Instruccion_Id');
        $sqlUpdate->bindParam(':Solicitud_Id', $data['Solicitud_Id']);
        $sqlUpdate->bindParam(':Instruccion_Id', $data['instruccion_Id']);
        $sqlUpdate->execute();

        if (!$sqlUpdate) throw new Exception("Error en Anular Instruccion.");

        // 🔹 Carpeta donde guardar la evidencia
        $uploadDir = "public/files/solicitudes_anulacion/" . $data['instruccion_Id'] . "/";
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // 🔹 Definir ruta de archivo (si viene)
        $rutaEvidencia = null;
        if ($data['evidencia'] && isset($data['evidencia']['tmp_name']) && is_uploaded_file($data['evidencia']['tmp_name'])) {
            $nombreSeguro = time() . "_" . preg_replace('/[^A-Za-z0-9_\.-]/', '_', $data['evidencia']['name']);
            $rutaEvidencia = $uploadDir . $nombreSeguro;
        }

        // INSERT DEL NUEVO REGISTRO
        try {
            // Iniciar transacción
            $this->_db3->beginTransaction();

            // Si hay archivo moverlo
            if ($rutaEvidencia) {
                if (!move_uploaded_file($data['evidencia']['tmp_name'], $rutaEvidencia)) {
                    throw new Exception("Error al mover el archivo de evidencia.");
                }
            }

            // Guardar ruta relativa (no absoluta) en la BD
            $rutaRelativa = $rutaEvidencia ? "public/files/solicitudes_anulacion/" . $data['instruccion_Id'] . "/" . basename($rutaEvidencia) : null;

            $sqlInsert = $this->_db3->prepare("INSERT INTO cmx_solicitud_instruccion 
                (instruccion_id, solicitante_id, estado, motivo, observacion, evidencia, usuario, fecha, hora, estato_visualizacion, empresa_id) 
                VALUES 
                (:instruccion_id, :solicitante_id, :estado, :motivo, :observacion, :evidencia, :usuario, :fecha, :hora, :estado_visualizacion, :empresa_id)
            ");

            $sqlInsert->bindParam(":instruccion_id", $data['instruccion_Id'], PDO::PARAM_INT);
            $sqlInsert->bindParam(":solicitante_id", $data['Solicitante_Id'], PDO::PARAM_INT);
            $sqlInsert->bindParam(":estado", $data['estado'], PDO::PARAM_STR);
            $sqlInsert->bindParam(":motivo", $data['motivo'], PDO::PARAM_STR);
            $sqlInsert->bindParam(":observacion", $data['observacion'], PDO::PARAM_STR);
            $sqlInsert->bindParam(":evidencia", $rutaRelativa, PDO::PARAM_STR);
            $sqlInsert->bindParam(":usuario", $nom_usuario, PDO::PARAM_STR);
            $sqlInsert->bindParam(":fecha", $fecha, PDO::PARAM_STR);
            $sqlInsert->bindParam(":hora", $hora, PDO::PARAM_STR);
            $sqlInsert->bindParam(":estado_visualizacion", $estado_visualizar, PDO::PARAM_INT);
            $sqlInsert->bindParam(":empresa_id", $empresa_id, PDO::PARAM_INT);
            $sqlInsert->execute();

            if (!$sqlInsert) throw new Exception("Error en Anular Instruccion.");

            if ($data['estado'] == 'Pendiente') {
                $estado_pendiente = 'Pendiente Anulacion';
            }
            //Actualizar Instrccion de facturacion
            $sqlUpdateInstruccion = $this->_db3->prepare("UPDATE cmx_instruccion_facturacion SET estado_instruccion=:estado_pendiente WHERE id=:Instruccion_id");
            $sqlUpdateInstruccion->bindParam(":Instruccion_id", $data["instruccion_Id"]);
            $sqlUpdateInstruccion->bindParam(":estado_pendiente", $estado_pendiente);

            $sqlUpdateInstruccion->execute();

            if (!$sqlUpdateInstruccion) throw new Exception("Error en Anular Instruccion.");

            $sqlUpdateInstruccionDetalle = $this->_db3->prepare("UPDATE cmx_detalle_instruccion_facturacion SET estado_facturacion=:estado_pendiente WHERE instruccion_id=:Instruccion_id");
            $sqlUpdateInstruccionDetalle->bindParam(":Instruccion_id", $data["instruccion_Id"]);
            $sqlUpdateInstruccionDetalle->bindParam(":estado_pendiente", $estado_pendiente);
            $sqlUpdateInstruccionDetalle->execute();

            if (!$sqlUpdateInstruccionDetalle) throw new Exception("Error en Anular Instruccion.");

            //Liberar remesas
            // 1. Buscar las remesas ligadas a la instrucción
            $sqlSelect = $this->_db3->prepare("
                    SELECT remesa_id 
                    FROM cmx_detalle_instruccion_facturacion 
                    WHERE instruccion_id = :Instruccion_id
                ");
            $sqlSelect->bindParam(":Instruccion_id", $data["instruccion_Id"], PDO::PARAM_INT);
            $sqlSelect->execute();

            if (!$sqlSelect->rowCount()) {
                throw new Exception("No se encontraron remesas para la instrucción.");
            }

            $resultados = $sqlSelect->fetchAll(PDO::FETCH_ASSOC);

            // 2. Actualizar estado_facturacion de cada remesa
            $sqlUpdateRemesas = $this->_db3->prepare("
                    UPDATE cmx_remesa 
                    SET estado_facturacion = 'Pendiente' 
                    WHERE id = :Id
                ");

            foreach ($resultados as $row) {
                $sqlUpdateRemesas->bindValue(":Id", $row["remesa_id"], PDO::PARAM_INT);
                $sqlUpdateRemesas->execute();
            }

            // 3. Si todo va bien

            $this->_db3->commit();

            $response = [
                'status'  => 'ok',
                'message' => 'Solicitud de anulación registrada correctamente',
                'evidencia' => $rutaRelativa
            ];
        } catch (\Throwable $th) {
            $this->_db3->rollBack();
            $response = [
                'status'  => 'error',
                'message' => $th->getMessage()
            ];
        }

        return $response;
    }

    #Consultar tarifa de venta del cliente
    public function Consultar_Tarifa_Venta_Servicio($cliente, $origen, $destino)
    {
        $sql = $this->_db3->prepare("SELECT tarifa FROM cmx_tarifa_venta WHERE cliente_id=:Cliente_Id AND origen=:Origen AND destino=:Destino AND estado_tarifa='Activa'");
        $sql->bindParam(":Cliente_Id", $cliente);
        $sql->bindParam(":Origen", $origen);
        $sql->bindParam(":Destino", $destino);
        $sql->execute();
        return $sql->fetch(PDO::FETCH_ASSOC);
    }

    public function Consultar_Tarifa_Venta($fecha, $cliente, $destino)
    {
        $sql = $this->_db3->prepare("SELECT ds.costo FROM cmx_venta_tipo_sevicio vs
        INNER JOIN cmx_detalle_venta_servicio_especial ds ON vs.id=ds.servicio_id
        WHERE vs.cliente_id=:Cliente AND ds.ciudad=:Destino");
        $sql->bindParam(":Cliente", $cliente);
        $sql->bindParam(":Destino", $destino);
        $sql->execute();
        return $sql->fetch(PDO::FETCH_ASSOC);
    }

    public function Duplicar_Documento_Solicitud($cotizacion, $Solicitud_Servicio)
    {
        $response = [];
        $session_empresa_id = $_SESSION['usuario']['empresa_id'];
        $usuario = $_SESSION["usuario"]["nom_usuario"];
        // Obtener la fecha y hora actuales
        $fecha = date('Y-m-d');
        $hora = date('H:i:s');

        try {
            $this->_db3->beginTransaction();
            // SELECCIONAR EL MAESTRO DISPONIBLE PARA CREAR LA COTIZACION
            $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='COTIZACION' AND numero_actual>numero_inicial AND empresa_id=:empresa_id");
            $sql_consecutivo->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
            $sql_consecutivo->execute();
            $resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);

            if (!$resultado_consecutivo) throw new Exception("No hay consecutivo disponible");

            $numdoc_cabecera = $resultado_consecutivo['numero_actual'];
            $numdoc_actualizar_cabecera = $numdoc_cabecera + 1;

            // Actualizar Maestro de Estudio seguridad cabecera
            $sql_updata_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=:numdoc_actualizar_cabecera WHERE tipo='COTIZACION' AND empresa_id=:empresa_id");
            $sql_updata_maestro->bindParam(':numdoc_actualizar_cabecera', $numdoc_actualizar_cabecera, PDO::PARAM_INT);
            $sql_updata_maestro->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
            $sql_updata_maestro->execute();

            // 2) Seleccionar cabecera origen
            $stmtCab = $this->_db3->prepare("SELECT * FROM cmx_cotizaciones_serviciocliente WHERE n_cotizacion=:id");
            $stmtCab->execute([':id' => $cotizacion]);
            $cabecera = $stmtCab->fetch(PDO::FETCH_ASSOC);
            if (!$cabecera) throw new Exception("Cotización origen no encontrada");

            // 3) Insertar nueva cabecera
            unset($cabecera['id']); // si tiene autoincrement
            $cabecera['n_cotizacion'] = $numdoc_cabecera;
            $cabecera['fecha_creacion'] = $fecha;
            $cabecera['hora_creacion'] = $hora;
            $cabecera['estado'] = 'F3';
            $cabecera['estado_autorizado'] = 'autorizado';

            $cols = implode(",", array_keys($cabecera));
            $params = ":" . implode(",:", array_keys($cabecera));
            $sqlInsertCab = "INSERT INTO cmx_cotizaciones_serviciocliente ($cols) VALUES ($params)";
            $this->_db3->prepare($sqlInsertCab)->execute($cabecera);

            // 4) Insertar en cmx_estados_cotizacion
            $stmt2 = $this->_db3->prepare("INSERT INTO cmx_estados_cotizacion (id, n_cotizacion, estado, estado_autorizado, hora, fecha, user_log)
                VALUES (:id, :n_cotizacion, :estado, :estado_autoriza, :hora_creacion, :fecha_creacion, :usuario)");
            $stmt2->execute([
                ':id' => null,
                ':n_cotizacion' =>  $numdoc_cabecera,
                ':estado' => 'F3',
                ':estado_autoriza' => 'autorizado',
                ':hora_creacion' => $hora,
                ':fecha_creacion' => $fecha,
                ':usuario' => $usuario
            ]);

            // 5) Duplicar mercancias
            $stmtDet = $this->_db3->prepare("SELECT * FROM cmx_detalle_mercancia2 WHERE n_cotizacion=:id");
            $stmtDet->execute([':id' => $cotizacion]);
            while ($rowMerca = $stmtDet->fetch(PDO::FETCH_ASSOC)) {
                unset($rowMerca['id']);
                $rowMerca['n_cotizacion'] = $numdoc_cabecera;
                $cols = implode(",", array_keys($rowMerca));
                $params = ":" . implode(",:", array_keys($rowMerca));
                $sqlInsert = "INSERT INTO cmx_detalle_mercancia2 ($cols) VALUES ($params)";
                $this->_db3->prepare($sqlInsert)->execute($rowMerca);
                $pareja = $this->_db3->lastInsertId();
            }

            // 6) Duplicar especiales
            $stmtEsp = $this->_db3->prepare("SELECT * FROM cmx_detalle_servespecial2 WHERE n_cotizacion=:id");
            $stmtEsp->execute([':id' => $cotizacion]);
            while ($rowEsp = $stmtEsp->fetch(PDO::FETCH_ASSOC)) {
                unset($rowEsp['id']);
                $rowEsp['n_cotizacion'] = $numdoc_cabecera;
                $cols = implode(",", array_keys($rowEsp));
                $params = ":" . implode(",:", array_keys($rowEsp));
                $sqlInsert = "INSERT INTO cmx_detalle_servespecial2 ($cols) VALUES ($params)";
                $this->_db3->prepare($sqlInsert)->execute($rowEsp);
            }

            // 7) Seleccionar numero de solicitud de servicio nueva
            $sql = "SELECT numero_actual FROM cmx_maestro WHERE tipo='SOLICITUD_SERVICIO' AND numero_actual>numero_inicial AND empresa_id=:empresa_id";
            $stmt = $this->_db3->prepare($sql);
            $stmt->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
            $stmt->execute();
            $numdoc_cabecera_solicitud  = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$numdoc_cabecera_solicitud) throw new Exception("No hay consecutivo disponible solicitud de servicio");

            $numdoc_cabecera_solicitud = $numdoc_cabecera_solicitud['numero_actual'];
            $numdoc_actualizar_cabecera_solicitud = $numdoc_cabecera_solicitud + 1;

            $sql = "UPDATE cmx_maestro SET numero_actual=:numdoc_actualizar_cabecera WHERE tipo='SOLICITUD_SERVICIO' AND empresa_id=:empresa_id";
            $stmt = $this->_db3->prepare($sql);
            $stmt->bindParam(':numdoc_actualizar_cabecera', $numdoc_actualizar_cabecera_solicitud, PDO::PARAM_INT);
            $stmt->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
            $stmt->execute();

            // 8) Seleccionar datos de la soliciyud de servicio
            $sqlSolicitud = $this->_db3->prepare("SELECT * FROM cmx_solicitud_vehiculo2 WHERE nundoc_solicitud=:numdoc");
            $sqlSolicitud->execute([':numdoc' => $Solicitud_Servicio]);
            $cabeceraSolicitud = $sqlSolicitud->fetch(PDO::FETCH_ASSOC);

            if (!$cabeceraSolicitud) throw new Exception("Cotización origen no encontrada");

            // 9) Insertar Solicitud de servicio nueva
            unset($cabeceraSolicitud['id']); // si tiene autoincrement
            $cabeceraSolicitud['n_cotizacion'] = $numdoc_cabecera;
            $cabeceraSolicitud['nundoc_solicitud'] = $numdoc_cabecera_solicitud;
            $cabeceraSolicitud['idpareja_origen_destino'] = $pareja;
            $cabeceraSolicitud['fecha'] = $fecha;
            $cabeceraSolicitud['hora'] = $hora;

            $cols = implode(",", array_keys($cabeceraSolicitud));
            $params = ":" . implode(",:", array_keys($cabeceraSolicitud));
            $sqlInsertCabSolicitrud = "INSERT INTO cmx_solicitud_vehiculo2 ($cols) VALUES ($params)";
            $this->_db3->prepare($sqlInsertCabSolicitrud)->execute($cabeceraSolicitud);

            //10) Atualizar estado Negocio
            $sql = "UPDATE cmx_detalle_mercancia2 SET proceso='Rea-Sol-Ser' WHERE id=:pareja";
            $stmt = $this->_db3->prepare($sql);
            $stmt->bindParam(':pareja', $pareja, PDO::PARAM_INT);
            $stmt->execute();

            // 11) Insertar Grupo clientes
            $sqlGrupoClientes = $this->_db3->prepare('SELECT * FROM cmx_grupocliente_servicio WHERE id_servicio=:id_servicio');
            $sqlGrupoClientes->execute([':id_servicio' => $Solicitud_Servicio]);
            $cabeceraGrupo = $sqlGrupoClientes->fetch(PDO::FETCH_ASSOC);

            if (!$cabeceraGrupo) throw new Exception("Cotización origen no encontrada");

            unset($cabeceraGrupo['id']); // si tiene autoincrement
            $cabeceraGrupo['id_servicio'] = $numdoc_cabecera_solicitud;

            $cols = implode(",", array_keys($cabeceraGrupo));
            $params = ":" . implode(",:", array_keys($cabeceraGrupo));
            $sqlInsertCabGrupo = "INSERT INTO cmx_grupocliente_servicio ($cols) VALUES ($params)";
            $this->_db3->prepare($sqlInsertCabGrupo)->execute($cabeceraGrupo);

            // 12) Insertar Grupo Horas
            $sqlGrupoHoras = $this->_db3->prepare('SELECT * FROM cmx_horacliente_servicio WHERE id_servicio=:id_servicio');
            $sqlGrupoHoras->execute([':id_servicio' => $Solicitud_Servicio]);
            $cabeceraHora = $sqlGrupoHoras->fetch(PDO::FETCH_ASSOC);

            if (!$cabeceraHora) throw new Exception("Cotización origen no encontrada");

            unset($cabeceraHora['id']); // si tiene autoincrement
            $cabeceraHora['id_servicio'] = $numdoc_cabecera_solicitud;
            $cabeceraHora['usuario'] = $usuario;
            $cabeceraHora['fecha'] = $fecha;
            $cabeceraHora['hora'] = $hora;

            $cols = implode(",", array_keys($cabeceraHora));
            $params = ":" . implode(",:", array_keys($cabeceraHora));
            $sqlInsertCabHora = "INSERT INTO cmx_horacliente_servicio ($cols) VALUES ($params)";
            $this->_db3->prepare($sqlInsertCabHora)->execute($cabeceraHora);

            // 13) insertar remitentes cmx_ruta_puntosentrega
            $sqlRemitente = $this->_db3->prepare("SELECT * FROM cmx_ruta_puntosentrega WHERE cod_ini_ruta=:cod_ini_ruta");
            $sqlRemitente->execute([':cod_ini_ruta' => $Solicitud_Servicio]);
            $cabeceraRemitente = $sqlRemitente->fetch(PDO::FETCH_ASSOC);

            if (!$cabeceraRemitente) throw new Exception("Cotización origen no encontrada");

            unset($cabeceraRemitente['id']); // si tiene autoincrement
            $cabeceraRemitente['cod_ini_ruta'] = $numdoc_cabecera_solicitud;
            $cabeceraRemitente['usuario'] = $usuario;
            $cabeceraRemitente['fecha'] = $fecha;
            $cabeceraRemitente['hora'] = $hora;

            $cols = implode(",", array_keys($cabeceraRemitente));
            $params = ":" . implode(",:", array_keys($cabeceraRemitente));
            $sqlInsertCabRemitente = "INSERT INTO cmx_ruta_puntosentrega ($cols) VALUES ($params)";
            $this->_db3->prepare($sqlInsertCabRemitente)->execute($cabeceraRemitente);

            // 14) Insertar Destinatarios
            $sqlDestinatario = $this->_db3->prepare("SELECT * FROM cmx_destinatarios_ss WHERE solicitud_servicio=:solicitud_servicio");
            $sqlDestinatario->execute([':solicitud_servicio' => $Solicitud_Servicio]);
            $cabeceraDestinatario = $sqlDestinatario->fetch(PDO::FETCH_ASSOC);

            if (!$cabeceraDestinatario) throw new Exception('Error en seleccionar destinatario');

            unset($cabeceraDestinatario['id']); // si tiene autoincrement
            $cabeceraDestinatario['solicitud_servicio'] = $numdoc_cabecera_solicitud;
            $cabeceraDestinatario['usuario'] = $usuario;
            $cabeceraDestinatario['fecha'] = $fecha;
            $cabeceraDestinatario['hora'] = $hora;

            $cols = implode(",", array_keys($cabeceraDestinatario));
            $params = ":" . implode(",:", array_keys($cabeceraDestinatario));
            $sqlInsertCabDestinatario = "INSERT INTO cmx_destinatarios_ss ($cols) VALUES ($params)";
            $this->_db3->prepare($sqlInsertCabDestinatario)->execute($cabeceraDestinatario);

            // 15) Commit
            $this->_db3->commit();
            $response = [
                'success' => true,
                'message' => "Solicitud de servicio duplicada exitosamente.",
                'nueva_cotizacion' => $numdoc_cabecera_solicitud
            ];
        } catch (Exception $e) {
            //throw $th;
            $this->_db3->rollBack();
            $response = [
                'success' => false,
                'message' => "Error al duplicar: " . $e->getMessage()
            ];
        }

        return $response;
    }

    //Acualizar Remitentes y Destinatarios
    public function updateRemitente($remitente, $solicitudId)
    {
        $response = [];
        $session_empresa_id = $_SESSION['usuario']['empresa_id'];
        $usuario = $_SESSION["usuario"]["nom_usuario"];
        // Obtener la fecha y hora actuales
        $fecha = date('Y-m-d');
        $hora = date('H:i:s');

        try {
            $this->_db3->beginTransaction();

            $sql = $this->_db3->prepare("
                UPDATE cmx_ruta_puntosentrega
                SET
                    municipio_entrega = :municipio_entrega,
                    direccion_entrega = :direccion_entrega,
                    cliente = :cliente,
                    remesa = :remesa,
                    fecha_estimada_entrega = :fecha_estimada_entrega,
                    observacion = :observacion,
                    fecha = NOW(),
                    hora = NOW(),
                    usuario = :usuario,
                    hora_estimada = :hora_estimada,
                    tipo = :tipo,
                    orden = :orden,
                    telefono = :telefono,
                    peso = :peso,
                    lugar = :lugar,
                    id_punto = :id_punto
                WHERE cod_ini_ruta = :Solicitud
            ");

            $sql->execute([
                ":municipio_entrega"       => $remitente["ciudad"] ?? null,
                ":direccion_entrega"       => $remitente["direccion"] ?? null,
                ":cliente"                 => $remitente["cliente"] ?? null,
                ":remesa"                  => $remitente["remesa"] ?? null, // 👀 este campo no lo vi en tu JS, puedes quitarlo o llenarlo
                ":fecha_estimada_entrega"  => $remitente["fecha"] ?? null,
                ":observacion"             => $remitente["observacion"] ?? null,
                ":usuario"                 => $usuario ?? "sistema", // depende de tu sistema de login
                ":hora_estimada"           => $remitente["hora"] ?? null,
                ":tipo"                    => $remitente["tipo"] ?? null,
                ":orden"                   => $remitente["orden"] ?? null,
                ":telefono"                => $remitente["telefono"] ?? null,
                ":peso"                    => $remitente["peso"] ?? null,
                ":lugar"                   => $remitente["lugar"] ?? null,
                ":id_punto"                => empty($remitente["id_punto"]) ?? 1,
                ":Solicitud"               => $solicitudId ?? null // 👀 asegúrate de enviarlo en JS
            ]);

            $this->_db3->commit();

            return [
                "success" => true,
                "message" => "Remitente actualizado correctamente"
            ];
        } catch (\Throwable $th) {
            $this->_db3->rollBack();
            return [
                "success" => false,
                "message" => $th->getMessage()
            ];
        }
    }

    public function updateDestinatario($destinatario, $solicitudId)
    {
        $response = [];
        $session_empresa_id = $_SESSION['usuario']['empresa_id'] ?? null;
        $usuario = $_SESSION["usuario"]["nom_usuario"] ?? "sistema";

        try {
            $this->_db3->beginTransaction();

            $sql = $this->_db3->prepare("
                UPDATE cmx_destinatarios_ss
                SET
                    municipio_entrega     = :municipio_entrega,
                    direccion_entrega     = :direccion_entrega,
                    cliente               = :cliente,
                    remesa                = :remesa,
                    fecha_estimada_entrega= :fecha_estimada_entrega,
                    observacion           = :observacion,
                    fecha                 = NOW(),
                    hora                  = NOW(),
                    usuario               = :usuario,
                    hora_estimada         = :hora_estimada,
                    tipo                  = :tipo,
                    orden                 = :orden,
                    telefono              = :telefono,
                    peso                  = :peso,
                    lugar                 = :lugar,
                    id_punto              = :id_punto,
                    estado_destinatario   = 'PENDIENTE'
                    WHERE solicitud_servicio = :solicitud_servicio
                    ");
            // id_solicitud          = :id_solicitud,

            $sql->execute([
                ":municipio_entrega"      => $destinatario["ciudad"] ?? null,
                ":direccion_entrega"      => $destinatario["direccion"] ?? null,
                ":cliente"                => $destinatario["cliente"] ?? null,
                ":remesa"                 => $destinatario["remesa"] ?? null,
                ":fecha_estimada_entrega" => $destinatario["fecha"] ?? null,
                ":observacion"            => $destinatario["observacion"] ?? null,
                ":usuario"                => $usuario,
                ":hora_estimada"          => $destinatario["hora"] ?? null,
                ":tipo"                   => $destinatario["tipo"] ?? null,
                ":orden"                  => $destinatario["orden"] ?? null,
                ":telefono"               => $destinatario["telefono"] ?? null,
                ":peso"                   => $destinatario["peso"] ?? null,
                ":lugar"                  => $destinatario["lugar"] ?? null,
                ":id_punto"               => empty($destinatario["id_punto"]) ?? 1,
                // ":id_solicitud"           => $solicitudId,
                ":solicitud_servicio"     => $solicitudId
            ]);

            $this->_db3->commit();

            return [
                "success" => true,
                "message" => "Destinatario actualizado correctamente"
            ];
        } catch (\Throwable $th) {
            $this->_db3->rollBack();
            return [
                "success" => false,
                "message" => $th->getMessage()
            ];
        }
    }

    public function updateRemitenteDestinatario($remitente, $destinatario, $solicitudId)
    {
        $response = [];
        $usuario = $_SESSION["usuario"]["nom_usuario"] ?? "sistema";

        try {
            $this->_db3->beginTransaction();

            /** =======================
             *  UPDATE REMITENTE
             *  ======================= */
            $sqlRemitente = $this->_db3->prepare("
            UPDATE cmx_ruta_puntosentrega
            SET
                municipio_entrega     = :municipio_entrega,
                direccion_entrega     = :direccion_entrega,
                cliente               = :cliente,
                remesa                = :remesa,
                fecha_estimada_entrega= :fecha_estimada_entrega,
                observacion           = :observacion,
                fecha                 = NOW(),
                hora                  = NOW(),
                usuario               = :usuario,
                hora_estimada         = :hora_estimada,
                tipo                  = :tipo,
                orden                 = :orden,
                telefono              = :telefono,
                peso                  = :peso,
                lugar                 = :lugar,
                id_punto              = :id_punto
            WHERE cod_ini_ruta = :Solicitud
        ");

            $sqlRemitente->execute([
                ":municipio_entrega"      => $remitente["ciudad"] ?? null,
                ":direccion_entrega"      => $remitente["direccion"] ?? null,
                ":cliente"                => $remitente["cliente"] ?? null,
                ":remesa"                 => $remitente["remesa"] ?? null,
                ":fecha_estimada_entrega" => $remitente["fecha"] ?? null,
                ":observacion"            => $remitente["observacion"] ?? null,
                ":usuario"                => $usuario,
                ":hora_estimada"          => $remitente["hora"] ?? null,
                ":tipo"                   => $remitente["tipo"] ?? null,
                ":orden"                  => $remitente["orden"] ?? null,
                ":telefono"               => $remitente["telefono"] ?? null,
                ":peso"                   => $remitente["peso"] ?? null,
                ":lugar"                  => $remitente["lugar"] ?? null,
                ":id_punto"               => empty($remitente["id_punto"]) ?? 1,
                ":Solicitud"              => $solicitudId
            ]);

            /** =======================
             *  UPDATE DESTINATARIO
             *  ======================= */
            $sqlDestinatario = $this->_db3->prepare("
            UPDATE cmx_destinatarios_ss
            SET
                municipio_entrega     = :municipio_entrega,
                direccion_entrega     = :direccion_entrega,
                cliente               = :cliente,
                remesa                = :remesa,
                fecha_estimada_entrega= :fecha_estimada_entrega,
                observacion           = :observacion,
                fecha                 = NOW(),
                hora                  = NOW(),
                usuario               = :usuario,
                hora_estimada         = :hora_estimada,
                tipo                  = :tipo,
                orden                 = :orden,
                telefono              = :telefono,
                peso                  = :peso,
                lugar                 = :lugar,
                id_punto              = :id_punto,
                estado_destinatario   = 'PENDIENTE'
            WHERE solicitud_servicio = :solicitud_servicio
        ");

            $sqlDestinatario->execute([
                ":municipio_entrega"      => $destinatario["ciudad"] ?? null,
                ":direccion_entrega"      => $destinatario["direccion"] ?? null,
                ":cliente"                => $destinatario["cliente"] ?? null,
                ":remesa"                 => $destinatario["remesa"] ?? null,
                ":fecha_estimada_entrega" => $destinatario["fecha"] ?? null,
                ":observacion"            => $destinatario["observacion"] ?? null,
                ":usuario"                => $usuario,
                ":hora_estimada"          => $destinatario["hora"] ?? null,
                ":tipo"                   => $destinatario["tipo"] ?? null,
                ":orden"                  => $destinatario["orden"] ?? null,
                ":telefono"               => $destinatario["telefono"] ?? null,
                ":peso"                   => $destinatario["peso"] ?? null,
                ":lugar"                  => $destinatario["lugar"] ?? null,
                ":id_punto"               => empty($destinatario["id_punto"]) ?? 1,
                ":solicitud_servicio"     => $solicitudId
            ]);

            /** =======================
             *  CONFIRMAR
             *  ======================= */
            $this->_db3->commit();

            return [
                "success" => true,
                "message" => "Remitente y destinatario actualizados correctamente"
            ];
        } catch (\Throwable $th) {
            $this->_db3->rollBack();
            return [
                "success" => false,
                "message" => $th->getMessage()
            ];
        }
    }

    public function Traer_Proveedor($servicio)
    {
        $sql = $this->_db3->prepare("SELECT
                pt.id AS proveedor_id,
                pt.razon_social
            FROM
                cmx_serivicio_especial ts
                INNER JOIN cmx_detalle_servicio_especial ds ON ts.id = ds.servicio_id
                INNER JOIN cmx_proveedor_torre_control pt ON ts.proveedor_id = pt.id
                INNER JOIN cmx_para_tipo_sevicio ps ON ts.tipo_servicio_id=ps.id
                AND tipo_proveedor = 'Proveedor servicio especial'
            WHERE
                nombre = :servicio
            GROUP BY
                pt.id");
        $sql->bindParam(":servicio", $servicio);
        $sql->execute();
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function Traer_Costos_Proveedor($proveedor, $ciudad)
    {
        $sql = $this->_db3->prepare("SELECT
            ds.costo
            FROM
                cmx_serivicio_especial ts
                INNER JOIN cmx_detalle_servicio_especial ds ON ts.id = ds.servicio_id
                INNER JOIN cmx_proveedor_torre_control pt ON ts.proveedor_id = pt.id
                AND tipo_proveedor = 'Proveedor servicio especial'
            WHERE
                ts.proveedor_id = :Proveedor
            GROUP BY
                pt.id");
        // AND ds.ciudad= :Ciudad

        $sql->bindParam(":Proveedor", $proveedor);
        // $sql->bindParam(":Ciudad", $ciudad);
        $sql->execute();
        return $sql->fetch(PDO::FETCH_ASSOC);
    }

    public function Aprobar_Anulacion_Gerencia($aprobarId, $instruccionId, $Solicitud_Id)
    {
        //update del primer moviemdnto de la instruccion
        $sqlUpdate = $this->_db3->prepare('UPDATE cmx_solicitud_instruccion SET aprobacion_gerencia=:Aprobacion WHERE id=:Solicitud_Id AND instruccion_id=:Instruccion_Id');
        $sqlUpdate->bindParam(':Aprobacion', $aprobarId);
        $sqlUpdate->bindParam(':Solicitud_Id', $Solicitud_Id);
        $sqlUpdate->bindParam(':Instruccion_Id', $instruccionId);
        $sqlUpdate->execute();

        if (!$sqlUpdate) throw new Exception("Error en Anular Instruccion.");

        $response = [
            'status'  => 'ok',
            'message' => 'Solicitud de anulación aprobada correctamente',
            // 'evidencia' => $rutaRelativa
        ];

        return $response;
    }

    public function Solicitar_Ajuste_Remesa($Remesa_Id, $Valor_Ajuste, $Valor_Actual, $Origen, $Destino)
    {
        $response = [];
        $empresa_id = $_SESSION["usuario"]["empresa_id"];
        $nom_usuario = $_SESSION["usuario"]["nom_usuario"];
        $fecha = date('Y-m-d');
        $hora = date('H:i:s');

        try {
            $this->_db3->beginTransaction();

            // 🔍 Validar si ya existe un ajuste pendiente para esa remesa
            $checkSql = $this->_db3->prepare("
                SELECT COUNT(*) AS total 
                FROM cmx_ajuste_valor_remesa 
                WHERE remesa_id = :remesa_id AND estado_ajuste = 'Pendiente'
            ");
            $checkSql->bindParam(':remesa_id', $Remesa_Id, PDO::PARAM_INT);
            $checkSql->execute();
            $existe = $checkSql->fetch(PDO::FETCH_ASSOC);

            if ($existe['total'] > 0) {
                $this->_db3->rollBack();
                return [
                    'status' => false,
                    'message' => 'Ya existe un ajuste pendiente para esta remesa. No se puede crear otro hasta que se resuelva.'
                ];
            }

            // ✅ Si no existe, insertar el nuevo ajuste
            $sql = $this->_db3->prepare("
                INSERT INTO cmx_ajuste_valor_remesa
                    (remesa_id, valor_ajuste, valor_actual, estado_ajuste, origen_ajuste, destino_ajuste, autoriza, fecha_autorizacion, hora_autorizacion, usuario, fecha, hora, empresa_id)
                VALUES 
                    (:remesa_id, :valor_ajuste, :valor_actual, 'Pendiente', :origen_ajuste, :destino_ajuste, NULL, NULL, NULL, :usuario, :fecha, :hora, :empresa_id)
            ");

            $sql->bindParam(':remesa_id', $Remesa_Id, PDO::PARAM_INT);
            $sql->bindParam(':valor_ajuste', $Valor_Ajuste, PDO::PARAM_STR);
            $sql->bindParam(':valor_actual', $Valor_Actual, PDO::PARAM_STR);
            $sql->bindParam(':origen_ajuste', $Origen, PDO::PARAM_STR);
            $sql->bindParam(':destino_ajuste', $Destino, PDO::PARAM_STR);
            $sql->bindParam(':usuario', $nom_usuario, PDO::PARAM_STR);
            $sql->bindParam(':fecha', $fecha, PDO::PARAM_STR);
            $sql->bindParam(':hora', $hora, PDO::PARAM_STR);
            $sql->bindParam(':empresa_id', $empresa_id, PDO::PARAM_INT);
            $sql->execute();

            $this->_db3->commit();
            $response = [
                'status' => true,
                'message' => 'Solicitud de ajuste insertada correctamente.'
            ];
        } catch (PDOException $e) {
            $this->_db3->rollBack();
            $response = [
                'status' => false,
                'message' => 'Error al insertar ajuste de remesa: ' . $e->getMessage()
            ];
        }

        return $response;
    }

    public function Consultar_Ajuste_Remesa($RemesaId, $AjusteId)
    {
        $sqlAjuste = $this->_db3->prepare("SELECT * FROM cmx_ajuste_valor_remesa WHERE id=:Id AND remesa_id=:RemesaId");
        $sqlAjuste->bindParam(":Id", $AjusteId);
        $sqlAjuste->bindParam(":RemesaId", $RemesaId);
        $sqlAjuste->execute();

        return $sqlAjuste->fetch(PDO::FETCH_ASSOC);
    }

    public function Autorizar_Ajuste_Remesa($Remesa_Id, $valorFinal, $Valor_Actual, $selectOrigen, $selectDestino, $AjusteId)
    {
        $response = [];
        $nom_usuario = $_SESSION["usuario"]["nom_usuario"];
        $fecha = date('Y-m-d');
        $hora = date('H:i:s');

        try {
            // 🚦 Iniciar transacción
            $this->_db3->beginTransaction();

            // 1️⃣ Actualizar estado del ajuste
            $sqlAjusteEstado = $this->_db3->prepare("
                UPDATE cmx_ajuste_valor_remesa 
                SET estado_ajuste = :estado_ajuste,autoriza=:autoriza,fecha_autorizacion=:fecha_autorizacion,hora_autorizacion=:hora_autorizacion
                WHERE id = :Id AND remesa_id = :remesa_id
            ");

            $estado = "Aprobado";
            $sqlAjusteEstado->bindParam(':estado_ajuste', $estado, PDO::PARAM_STR);
            $sqlAjusteEstado->bindParam(':autoriza', $nom_usuario, PDO::PARAM_STR);
            $sqlAjusteEstado->bindParam(':fecha_autorizacion', $fecha, PDO::PARAM_STR);
            $sqlAjusteEstado->bindParam(':hora_autorizacion', $hora, PDO::PARAM_STR);
            $sqlAjusteEstado->bindParam(':Id', $AjusteId, PDO::PARAM_INT);
            $sqlAjusteEstado->bindParam(':remesa_id', $Remesa_Id, PDO::PARAM_INT);
            $sqlAjusteEstado->execute();

            if ($sqlAjusteEstado->rowCount() === 0) {
                throw new Exception("No se encontró el ajuste pendiente para esta remesa.");
            }

            if (!empty($valorFinal) && $valorFinal !== '') {
                // 2️⃣ Actualizar tarifa en detalle mercancia
                $sqlAjusteTarifa = $this->_db3->prepare("
                    UPDATE cmx_detalle_mercancia2 dm
                    INNER JOIN cmx_solicitud_vehiculo2 ss ON dm.n_cotizacion = ss.n_cotizacion
                    INNER JOIN cmx_remesa rm ON ss.nundoc_solicitud = rm.mer_idservicio
                    INNER JOIN cmx_ajuste_valor_remesa ar ON rm.id=ar.remesa_id
                    SET dm.total_tarifa = :Tarifa_Nueva
                    WHERE rm.id = :Remesa AND ar.estado_ajuste='Aprobado' AND ar.id = :AjusteId 
                ");

                $sqlAjusteTarifa->bindParam(':Tarifa_Nueva', $valorFinal, PDO::PARAM_INT);
                $sqlAjusteTarifa->bindParam(':Remesa', $Remesa_Id, PDO::PARAM_INT);
                $sqlAjusteTarifa->bindParam(':AjusteId', $AjusteId, PDO::PARAM_INT);
                $sqlAjusteTarifa->execute();

                if ($sqlAjusteTarifa->rowCount() === 0) {
                    throw new Exception("No se actualizó la tarifa, verifique la remesa.");
                }
            }

            // ✅ Confirmar transacción
            $this->_db3->commit();

            $response = [
                'status' => true,
                'message' => 'Solicitud de ajuste autorizada y tarifa actualizada correctamente.'
            ];
        } catch (Exception $e) {
            // ❌ Revertir cambios si algo falla
            $this->_db3->rollBack();

            $response = [
                'status' => false,
                'message' => "Error al autorizar ajuste de remesa: " . $e->getMessage()
            ];
        }

        return $response;
    }
}
