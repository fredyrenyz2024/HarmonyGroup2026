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
                if (isset($especial)) {
                    foreach ($especial->item_especial as $index => $item_espe) {
                        $stmt6 = $this->_db3->prepare("INSERT INTO cmx_detalle_servespecial2 (id, tipo_servicio, cantidad, valor_unitario, total_servicio, tarifa, utilidad, rentabilidad, n_cotizacion, tarifa_unitaria, item_mercancia, item_especial)
                        VALUES (:idt, :tipo_servicio, :canti, :valuni, :total, :tarif, :utilid, :renta, :n_cotizacion, :tariuni, :itemmerca, :itemespe)");
                        $stmt6->execute([
                            ':idt' => null,
                            ':tipo_servicio' => $especial->tipo_servicio[$index],
                            ':canti' => $especial->cant[$index],
                            ':valuni' => $especial->costo_uni[$index],
                            ':total' => $especial->calculo[$index],
                            ':tarif' => $especial->tarifa[$index],
                            ':utilid' => $especial->utilidad[$index],
                            ':renta' => $especial->rentabi[$index],
                            ':n_cotizacion' =>  $numdoc_cabecera,
                            ':tariuni' => $especial->tarifa_uni[$index],
                            ':itemmerca' => $especial->item_mercancia[$index],
                            ':itemespe' => $item_espe
                        ]);
                    }
                }

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

    public function getPrueba($tipo, $fi, $ff, $estado, $cliente, $empresa)
    {
        $response = [];

        if ($tipo == '2') {
            if ($estado == "Todas") {
                try {
                    $query = "SELECT ss.nundoc_solicitud, coti.nombre_cliente, m.itr, coti.estado AS estado_autorizacion, 
                            m.tipo_servicio_mer, m.peso_neto_kg, CONCAT(ss.fecha, '-', ss.hora) AS fecha_solicitud_servicio,
                            ss.estado, coti.id, coti.n_cotizacion, m.tipo_transporte, m.tipo_mercancia, coti.estado_autorizado,
                            ss.prioritaria, emp.nombre_empresa,
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
                        WHERE coti.fecha_creacion BETWEEN :fi AND :ff";

                    // Filtros opcionales
                    if ($cliente !== null) {
                        $query .= " AND coti.id_cliente = :cliente";
                    }

                    if ($empresa !== null) {
                        $query .= " AND emp.id = :empresa";
                    }

                    // $query .= " GROUP BY coti.n_cotizacion ORDER BY coti.id DESC";
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

                    $sql->execute($params_main);

                    $result_cotizaciones = $sql->fetchAll(PDO::FETCH_ASSOC);

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

                    $sql_cantidad = $this->_db3->prepare($query_cantidad);
                    $params_count = [':fi' => $fi, ':ff' => $ff];
                    if (!empty($cliente)) {
                        $params_count[':cliente'] = $cliente;
                    }
                    if (!empty($empresa)) {
                        $params_count[':empresa'] = $empresa;
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
        $sql = $this->_db3->prepare("SELECT cdm.*, tv.nombre, CONCAT(C1.municipio,'-',C1.depto) AS orig, CONCAT(C2.municipio,'-',C2.depto) AS dest , e.empaque
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

    public function Guardar_Solicitud($datos)
    {
        $response = [];
        $empresa_id = $_SESSION['usuario']['empresa_id'];

        try {
            // Iniciar transacción
            $this->_db3->beginTransaction();

            $numdoc_cabecera = $this->getNumeroActual($empresa_id);
            if (!$numdoc_cabecera) {
                throw new Exception("No hay números disponibles para crear una nueva Solicitud de servicio.");
            }

            $this->actualizarNumeroActual($empresa_id, $numdoc_cabecera + 1);
            $this->insertarSolicitudVehiculo($datos, $numdoc_cabecera);
            $this->actualizarEstadoNegocio($datos['pareja']);
            $this->insertarGrupoClientes($datos["grupo"], $numdoc_cabecera);
            $this->insertarHorasClientes($datos["horacliente"], $datos, $numdoc_cabecera);
            $this->insertarPuntosEntrega($datos, $datos["maximo"], $datos["insertremit"], $numdoc_cabecera);
            $this->Insertar_Destinatarios($datos, $datos["nFilas"], $datos['insertdesti'], $numdoc_cabecera);

            // Confirmar la transacción
            $this->_db3->commit();
            // Éxito
            $response = ['success' => true, 'message' => 'La solicitud de servicio <strong>' . $numdoc_cabecera . '</strong> se ha creado exitosamente.', 'numero_solicitud' => $numdoc_cabecera];
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

    private function getNumeroActual($empresa_id)
    {
        $sql = "SELECT numero_actual FROM cmx_maestro WHERE tipo='SOLICITUD_SERVICIO' AND numero_actual>numero_inicial AND empresa_id=:empresa_id";
        $stmt = $this->_db3->prepare($sql);
        $stmt->bindParam(':empresa_id', $empresa_id, PDO::PARAM_STR);
        $stmt->execute();
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
        return $resultado['numero_actual'] ?? null;
    }

    private function actualizarNumeroActual($empresa_id, $numdoc_actualizar_cabecera)
    {
        $sql = "UPDATE cmx_maestro SET numero_actual=:numdoc_actualizar_cabecera WHERE tipo='SOLICITUD_SERVICIO' AND empresa_id=:empresa_id";
        $stmt = $this->_db3->prepare($sql);
        $stmt->bindParam(':numdoc_actualizar_cabecera', $numdoc_actualizar_cabecera, PDO::PARAM_INT);
        $stmt->bindParam(':empresa_id', $empresa_id, PDO::PARAM_STR);
        $stmt->execute();
    }

    private function insertarSolicitudVehiculo($datos, $numdoc_cabecera)
    {
        //escenario_id
        $user = $_SESSION["usuario"]["nom_usuario"];
        $sql = "INSERT INTO cmx_solicitud_vehiculo2(id, n_cotizacion, nundoc_solicitud, fecha, hora, estado, usuario_auditor, origen, destino, peso_kg, nombre_cliente, tipo_vehiculo, flete, idpareja_origen_destino, observaciones, proceso, agencia, devol_contenedor, devol_dias, devol_municipio, devol_direccion, devol_tipocont, devol_numcont, devol_comodato, cant_vehiculo, cant_disponible, devol_pesovacio,escenario_id,empresa_id)
                VALUES(NULL, :cotizacion, :nundoc_solicitud ,:fecha_reg, :hora_reg, :estado, :user, :ori, :dest, :peso, :cliente, :tipo_veh, :flete, :pareja, :observacion, 'Pen-Sol-PreS', :agencia, :cont_opcion, :cont_dias, :cont_municipio, :cont_direccion, :cont_tipo, :cont_num, :cont_comodato, :cant_solicitada, :cant_disponible, :cont_peso, :escenario_id, :empresa_id)";
        $stmt = $this->_db3->prepare($sql);
        $stmt->execute([
            ':cotizacion' => $datos['cotizacion'],
            ':nundoc_solicitud' => $numdoc_cabecera,
            ':fecha_reg' => $datos['fecha_reg'],
            ':hora_reg' => $datos['hora_reg'],
            ':estado' => $datos['estado'],
            ':user' => $user,
            // ':user' => $datos['user'],
            ':ori' => $datos['ori'],
            ':dest' => $datos['dest'],
            ':peso' => $datos['peso'],
            ':cliente' => $datos['nombre_cliente'],
            ':tipo_veh' => $datos['tipo_veh'],
            ':flete' => $datos['flete'],
            ':pareja' => $datos['pareja'],
            ':observacion' => $datos['observacion'],
            ':agencia' => $datos['agencia'],
            ':cont_opcion' => $datos['cont_opcion'] != 'undefined' ? 0 : $datos['cont_opcion'],
            ':cont_dias' => $datos['cont_dias'],
            ':cont_municipio' => $datos['cont_municipio'],
            ':cont_direccion' => $datos['cont_direccion'],
            ':cont_tipo' => $datos['cont_tipo'] != 'undefined' ? 0 : $datos['cont_tipo'],
            ':cont_num' => $datos['cont_num'],
            ':cont_comodato' => $datos['cont_comodato'],
            ':cant_solicitada' => $datos['cant_solicitada'],
            ':cant_disponible' => $datos['cant_disponible'],
            ':cont_peso' => $datos['cont_peso'],
            ':empresa_id' => $datos['empresa_id'],
            ':escenario_id' => $datos['escenario_id'],
        ]);
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


    private function insertarPuntosEntrega($datos, $maximo, $insertremit, $numdoc_cabecera)
    {
        $hora = date('H:i:s');
        $fecha = date('Y-m-d');
        $sql = "INSERT INTO cmx_ruta_puntosentrega (id, cod_ini_ruta, municipio_entrega, direccion_entrega, cliente, fecha_estimada_entrega, observacion, fecha, hora, usuario, hora_estimada, tipo, orden, telefono, peso, lugar, id_punto)
                VALUES (null, :solicitud_servicio1, :mentrega, :dire, :cliente, :fentrega, :obs, :fecha, :hora, :user, :hora_estimada, :tipo, :orden, :telefono, :peso, :sitio, :id_punto)";

        $i = 0;
        for ($i = 0; $i < $maximo; $i++) {
            $stmt = $this->_db3->prepare($sql);
            // Bind the parameters
            $stmt->bindParam(':solicitud_servicio1', $numdoc_cabecera, PDO::PARAM_INT);
            $stmt->bindParam(':mentrega', $insertremit->mentrega[$i], PDO::PARAM_STR);
            $stmt->bindParam(':dire', $insertremit->dire[$i], PDO::PARAM_STR);
            $stmt->bindParam(':cliente', $insertremit->clientea[$i], PDO::PARAM_STR);
            $stmt->bindParam(':fentrega', $insertremit->fentrega[$i], PDO::PARAM_STR);
            $stmt->bindParam(':obs', $insertremit->obs[$i], PDO::PARAM_STR);
            $stmt->bindParam(':fecha', $fecha, PDO::PARAM_STR);
            $stmt->bindParam(':hora', $hora, PDO::PARAM_STR);
            $stmt->bindParam(':user', $datos['user'], type: PDO::PARAM_STR);
            $stmt->bindParam(':hora_estimada', $insertremit->hora[$i], PDO::PARAM_STR);
            $stmt->bindParam(':tipo', $insertremit->tipo[$i], PDO::PARAM_STR);
            $stmt->bindParam(':orden', $insertremit->orden[$i], PDO::PARAM_INT);
            $stmt->bindParam(':telefono', $insertremit->telefono[$i], PDO::PARAM_STR);
            $stmt->bindParam(':peso', $insertremit->pesorem[$i], PDO::PARAM_STR);
            $stmt->bindParam(':sitio', $insertremit->place[$i], PDO::PARAM_STR);
            $stmt->bindParam(':id_punto', $insertremit->idpuntrem[$i], PDO::PARAM_INT);

            // Execute the statement
            $stmt->execute();
        }
    }

    private function Insertar_Destinatarios($datos, $nFilas, $insertdesti, $numero_solicita)
    {
        $user = $_SESSION["usuario"]["nom_usuario"];
        $hora = date('H:i:s');
        $fecha = date('Y-m-d');
        $sql = "INSERT INTO cmx_destinatarios_ss(id, solicitud_servicio, municipio_entrega, direccion_entrega, cliente,fecha_estimada_entrega, observacion, fecha, hora, usuario,hora_estimada, tipo, orden, telefono, peso, lugar, id_punto, estado_destinatario) 
            VALUES (NULL, :numero_solicita, :ciu, :direcci, :desti,:fech, :observacion, :fecha, :hora, :user, :horades, 'punto entrega', 0, :tel, :peso, :lugar, :idpunto, 'PENDIENTE')";
        for ($z = 0; $z < $nFilas; $z++) {
            $stmt = $this->_db3->prepare($sql);
            $stmt->bindParam(':numero_solicita', $numero_solicita);
            $stmt->bindParam(':ciu', $insertdesti->ciudad[$z]);
            $stmt->bindParam(':direcci', $insertdesti->direccion[$z]);
            $stmt->bindParam(':desti', $insertdesti->destinatario[$z]);
            $stmt->bindParam(':fech', $insertdesti->fecha[$z]);
            $stmt->bindParam(':observacion', $insertdesti->observacion[$z]);
            $stmt->bindParam(':fecha', $fecha); // Assuming $fecha is defined somewhere in your code
            $stmt->bindParam(':hora', $hora); // Assuming $hora is defined somewhere in your code
            $stmt->bindParam(':user', $user); // Assuming $user is defined somewhere in your code
            $stmt->bindParam(':horades', $insertdesti->hora[$z]);
            $stmt->bindParam(':tel', $insertdesti->telefono[$z]);
            $stmt->bindParam(':peso', $insertdesti->pesobruto[$z]);
            $stmt->bindParam(':lugar', $insertdesti->lugar[$z]);
            $stmt->bindParam(':idpunto', $insertdesti->idrem[$z]);
            $stmt->execute();
        }
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
                        WHERE ss.nundoc_solicitud=:dato AND ec.fecha=:fecha AND ec.estado != 'Cancelado' OR ec.estado != 'Rechazado'");
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
                        WHERE ss.nundoc_solicitud=:dato AND ec.fecha=:fecha AND ec.estado != 'Cancelado' OR ec.estado != 'Rechazado'");
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
            $sql->bindParam(':nundoc_solicitud', $numdoc_solicitud, PDO::PARAM_STR);
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
}
