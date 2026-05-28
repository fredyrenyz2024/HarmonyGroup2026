<?php

session_start();

class TorreControlModel extends Model
{

  public function __construct()
  {

    parent::__construct();
  }

  public function importar_pedidos_masivos($rows, $Modalidad)
  {

    try {

      // 1. Crea un objeto DateTime en BogotÃ¡
      $date = new DateTime('now', new DateTimeZone('America/Bogota'));

      // 2. Convierte a UTC (opcional si quieres guardar en UTC)
      // $date->setTimezone(new DateTimeZone('UTC'));

      // 3. Saca fecha y hora
      $fecha = $date->format('Y-m-d'); // Fecha correcta
      $hora = $date->format('H:i:s');  // Hora correcta
      $session_empresa_id = $_SESSION['usuario']['empresa_id'];

      // Iniciamos una transacciÃ³n
      $this->_db3->beginTransaction();

      /* Validar que la referencia del en la base de datos */
      $sql_validate = "SELECT referencia_pedido FROM cmx_pedido_torre_control WHERE referencia_pedido = :referencia_pedido";
      $stmt_validate = $this->_db3->prepare($sql_validate);

      $referencias_existentes = [];

      foreach ($rows as $row) {
        $stmt_validate->bindParam(':referencia_pedido', $row['Pedido']);
        $stmt_validate->execute();

        if ($stmt_validate->rowCount() > 0) {
          $referencias_existentes[] = $row['Pedido'];
        }
      }

      // Luego de recorrer todos:
      if (!empty($referencias_existentes)) {
        $this->_db3->rollBack();
        return [
          "status" => false,
          "message" => "Los siguientes pedidos ya estÃ¡n registrados: " . implode(", ", $referencias_existentes)
        ];
      }

      // Preparamos la consulta de inserciÃ³n
      $sql_insert = "INSERT INTO cmx_pedido_torre_control 
          	(modalidad,cliente, numdoc_solicitud, referencia_pedido, ciudad_origen, remitente, ciudad_destino, destinatario, cod_producto, producto, peso_neto_kg, peso_bruto_kg, presentacion, unidades, lote, num_estibas, fecha_cargue, hora_cargue, fecha_entrega, hora_entrega,tipo_vehiculo,costo,tarifa,fecha_retiro_contenedor,
            hora_retiro_contenedor,booking,unidad_transporte,observaciones, usuario, fecha, hora)
          VALUES (:modalidad, :cliente, :numdoc_solicitud, :referencia_pedido, :ciudad_origen, :remitente, :ciudad_destino, :destinatario, :cod_producto, :producto, :peso_neto_kg, :peso_bruto_kg, :presentacion, :unidades, :lote, :num_estibas, :fecha_cargue,:hora_cargue,:fecha_entrega, :hora_entrega, :tipo_vehiculo,:costo,:tarifa,
          :fecha_retiro_contenedor,:hora_retiro_contenedor,:booking,:unidad_transporte,:observaciones,:usuario, :fecha, :hora)";
      $stmt_insert = $this->_db3->prepare($sql_insert);

      foreach ($rows as $row) {

        /* Validar que la modalidad del pedido sea correcta con la del formulario */
        if ($row['Modalidad'] != $Modalidad) {
          throw new Exception("La modalidad del pedido no coincide con la del formulario.");
        }

        // 1. Obtener el nÃºmero actual de `cmx_maestro`
        $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='PEDIDOS_TORRE_CONTROL' AND numero_actual>numero_inicial AND empresa_id=:empresa_id FOR UPDATE");
        $sql_consecutivo->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
        $sql_consecutivo->execute();
        $resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);

        if (!$resultado_consecutivo) {
          throw new Exception("No se encontrÃ³ un nÃºmero de pedido vÃ¡lido.");
        }

        $numdoc_cabecera = $resultado_consecutivo['numero_actual'];
        $numdoc_actualizar_cabecera = $numdoc_cabecera + 1;

        // 2. Actualizar `numero_actual` en `cmx_maestro`
        $sql_update_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=:numdoc_actualizar_cabecera WHERE tipo='PEDIDOS_TORRE_CONTROL' AND empresa_id=:empresa_id");
        $sql_update_maestro->bindParam(':numdoc_actualizar_cabecera', $numdoc_actualizar_cabecera, PDO::PARAM_INT);
        $sql_update_maestro->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
        $sql_update_maestro->execute();

        // 3. Insertar el pedido con el nÃºmero de documento actualizado
        $stmt_insert->execute([
          ":modalidad" => $row["Modalidad"] ?? "",
          ":cliente" => $row["Cliente"] ?? $_SESSION['usuario']['id_cliente'],
          ":numdoc_solicitud" => $numdoc_cabecera,
          ":referencia_pedido" => $row["Pedido"] ?? "",
          ":ciudad_origen" => $row["Ciudad Origen"] ?? "",
          ":remitente" => $row["Remitente"] ?? "",
          ":ciudad_destino" => $row["Ciudad Destino"] ?? "",
          ":destinatario" => $row["Destinatario"] ?? "",
          ":cod_producto" => $row["Codigo Producto"] ?? "",
          ":producto" => $row["Producto"] ?? "",
          ":peso_neto_kg" => $row["Kg Neto"] ?? "",
          ":peso_bruto_kg" => $row["Kg Bruto"] ?? "",
          ":presentacion" => $row["Presentacion"] ?? "",
          ":unidades" => $row["Unidades"] ?? "",
          ":lote" => $row["Lote"] ?? "",
          ":num_estibas" => $row["Nro.Estibas"] ?? "",
          ":fecha_cargue" => $row["Fecha Cargue"] ?? "",
          ":hora_cargue" => $row["Hora Cargue"] ?? "",
          ":fecha_entrega" => $row["Fecha Entrega"] ?? "",
          ":hora_entrega" => $row["Hora entrega"] ?? "",
          ":tipo_vehiculo" => $row["Tipo vehiculo"] ?? "",
          ":costo" => $row["costo"] ?? "",
          ":tarifa" => $row["tarifa"] ?? "",
          ":fecha_retiro_contenedor" => $row["Fecha retiro contenedor"] ?? "",
          ":hora_retiro_contenedor" => $row["Hora retiro contenedor"] ?? "",
          ":booking" => $row["booking"] ?? "",
          ":unidad_transporte" => $row["Unidad transporte"] ?? "",
          ":observaciones" => $row["observaciones"] ?? "",
          ":usuario" => $row["usuario"] ?? $_SESSION["usuario"]["nom_usuario"],
          ":fecha" => $fecha,
          ":hora" => $hora
        ]);
      }

      // Confirmamos la transacciÃ³n
      $this->_db3->commit();
      return ["status" => true, "message" => "Pedidos importados correctamente."];
    } catch (PDOException $e) {
      // Si hay un error, revertimos la transacciÃ³n
      $this->_db3->rollBack();
      return ["status" => false, "message" => "Error al importar pedidos: " . $e->getMessage()];
    } catch (Exception $e) {
      $this->_db3->rollBack();
      return ["status" => false, "message" => $e->getMessage()];
    }
  }

  public function Listar_pedidos_administrador(
    $fecha_inicial,
    $fecha_final,
    $ventana,
    $proveedor_id,
    $estado,
    $cliente_id,
    $filtro,
    $valor,
    $trazabilidad,
    $proceso_filtro,
    $filtros,
    $identificador
  ) {
    switch ($ventana) {
      default:

        /* ======================================================
             * BASE FROM + JOINS (NO SE TOCA)
             * ====================================================== */
        $sql = "FROM cmx_pedido_torre_control pt
                INNER JOIN cmx_clientes cl ON pt.cliente = cl.id ";

        if ($estado === 'Pendientes' || $estado === 'En_Curso' || $estado === '') {
          $sql .= "LEFT JOIN cmx_cliente_proveedor_servicio cps 
                         ON pt.numdoc_solicitud = cps.pedido_id ";
        } elseif ($estado === 'Completadas') {
          $sql .= "INNER JOIN cmx_cliente_proveedor_servicio cps 
                         ON pt.numdoc_solicitud = cps.pedido_id ";
        } else {
          $sql .= "LEFT JOIN cmx_cliente_proveedor_servicio cps 
                         ON pt.numdoc_solicitud = cps.pedido_id ";

          $sql .= " LEFT JOIN (
                    SELECT
                        t1.pedido_id,
                        t1.tipo_trazabilidad
                    FROM cmx_trazabilidad_pedido_tr t1
                    INNER JOIN (
                        SELECT
                            pedido_id,
                            MAX(CONCAT(fecha, ' ', hora)) AS max_fecha_hora
                        FROM cmx_trazabilidad_pedido_tr
                        GROUP BY pedido_id
                    ) t2 
                      ON t1.pedido_id = t2.pedido_id
                     AND CONCAT(t1.fecha, ' ', t1.hora) = t2.max_fecha_hora
                ) tp ON pt.numdoc_solicitud = tp.pedido_id ";

          $sql .= " LEFT JOIN cmx_pedido_proveedor_estado ppe 
                          ON cps.recurso_id = ppe.recurso_id
                         AND ppe.estado_visualizar = 1
                         AND ppe.estado_proceso_pedido = 'Postulado' ";
        }

        /* ======================================================
             * SELECT FINAL (NO SE TOCA)
             * ====================================================== */
        $sql = "SELECT
                pt.id,
                pt.numdoc_solicitud,
                pt.referencia_pedido,
                pt.cliente,
                pt.ciudad_origen,
                pt.remitente,
                pt.ciudad_destino,
                pt.destinatario,
                pt.cod_producto,
                pt.producto,
                pt.peso_neto_kg,
                pt.peso_bruto_kg,
                pt.presentacion,
                pt.unidades,
                pt.lote,
                pt.num_estibas,
                CONCAT(pt.fecha_cargue, '-', pt.hora_cargue) AS fecha_cargue,
                CONCAT(pt.fecha_entrega, '-', pt.hora_entrega) AS fecha_entrega,
                pt.estado_publicaion,
                pt.estado_asignacion,
                pt.usuario,
                pt.fecha,
                pt.hora,
                cl.nombre AS nombre_cliente,
                pt.estado_prioridad,
                pt.referencia_pedido,
                cps.recurso_id,
                cps.serivicio_id,
                cps.referencia,
                IFNULL(
                    tp.tipo_trazabilidad,
                    IFNULL(
                        (
                            SELECT ehr.estado_recurso
                            FROM cmx_recurso_pedido rp1
                            INNER JOIN cmx_estado_historico_recurso ehr 
                                ON rp1.maestro_id = ehr.recurso_id
                            WHERE rp1.maestro_id = cps.recurso_id
                              AND ehr.estado_actual = 1
                            LIMIT 1
                        ),
                        'Sin Asignar'
                    )
                ) AS tipo_trazabilidad,
                IFNULL(cps.proceso, 'Pendiente') AS estado_proceso,
                ppe.estado_proceso_pedido,
                pt.modalidad,
                pt.tipo_vehiculo,
                pt.costo,
                pt.tarifa,
                CONCAT(pt.fecha_retiro_contenedor, '-', pt.hora_retiro_contenedor) AS fecha_retiro_contenedor,
                pt.booking,
                pt.unidad_transporte,
                pt.observaciones,
                pt.latitud_origen,
                pt.longitud_origen,
                pt.latitud_destino,
                pt.longitud_destino
            " . $sql;

        /* ======================================================
             * WHERE DINÁMICO (NO SE TOCA)
             * ====================================================== */
        $where = [];
        $bindParams = [];

        if ($identificador == "fecha") {
          $where[] = "pt.fecha_cargue BETWEEN :fecha_inicial AND :fecha_final";
          $bindParams[":fecha_inicial"] = $fecha_inicial;
          $bindParams[":fecha_final"]   = $fecha_final;
        } elseif ($identificador == "mod") {
          $where[] = "pt.fecha_cargue BETWEEN :fecha_inicial AND :fecha_final";
          $bindParams[":fecha_inicial"] = $fecha_inicial;
          $bindParams[":fecha_final"]   = $fecha_final;

          $where[] = "pt.modalidad = :filtro";
          $bindParams[":filtro"] = $valor;
        } elseif ($identificador == "filt_mod") {
          $where[] = "pt.fecha_cargue BETWEEN :fecha_inicial AND :fecha_final";
          $bindParams[":fecha_inicial"] = $fecha_inicial;
          $bindParams[":fecha_final"]   = $fecha_final;

          $where[] = "pt.modalidad = :valor";
          $bindParams[":valor"] = $valor;

          $where[] = "(pt.estado_publicaion = :filtro 
                          OR pt.estado_asignacion = :filtro)
                          AND cps.pedido_id IS NULL";
          $bindParams[":filtro"] = $filtro;
        } elseif ($identificador == "filt") {
          $where[] = "pt.fecha_cargue BETWEEN :fecha_inicial AND :fecha_final";
          $bindParams[":fecha_inicial"] = $fecha_inicial;
          $bindParams[":fecha_final"]   = $fecha_final;

          $where[] = "(pt.estado_publicaion = 'Completado' 
                          OR pt.estado_asignacion = 'Completado')";
        } elseif ($identificador == "filt_traz") {
          $where[] = "pt.fecha_cargue BETWEEN :fecha_inicial AND :fecha_final";
          $bindParams[":fecha_inicial"] = $fecha_inicial;
          $bindParams[":fecha_final"]   = $fecha_final;

          $where[] = "tp.tipo_trazabilidad = :filtro";
          $bindParams[":filtro"] = $valor;

          $where[] = "(pt.estado_publicaion = 'Completado' 
                          OR pt.estado_asignacion = 'Completado')";
        } elseif ($identificador == "filt_traz_mod") {
          $where[] = "pt.fecha_cargue BETWEEN :fecha_inicial AND :fecha_final";
          $bindParams[":fecha_inicial"] = $fecha_inicial;
          $bindParams[":fecha_final"]   = $fecha_final;

          $where[] = "(pt.estado_publicaion = 'Completado' 
                          OR pt.estado_asignacion = 'Completado')";

          $where[] = "tp.tipo_trazabilidad = :filtro";
          $bindParams[":filtro"] = $valor;

          $where[] = "pt.modalidad = :trazabilidad";
          $bindParams[":trazabilidad"] = $trazabilidad;
        } elseif ($identificador == "filt_mod_asig") {
          $where[] = "pt.fecha_cargue BETWEEN :fecha_inicial AND :fecha_final";
          $bindParams[":fecha_inicial"] = $fecha_inicial;
          $bindParams[":fecha_final"]   = $fecha_final;

          $where[] = "(pt.estado_publicaion = 'Completado' 
                          OR pt.estado_asignacion = 'Completado')";

          $where[] = "pt.modalidad = :filtro";
          $bindParams[":filtro"] = $trazabilidad;
        } else {
          if (!empty($filtro) && $filtro != "undefined") {
            $where[] = "pt.referencia_pedido LIKE :filtro";
            $bindParams[":filtro"] = "%$filtro%";
          }
          $where[] = "pt.fecha_cargue BETWEEN :fecha_inicial AND :fecha_final";
          $bindParams[":fecha_inicial"] = $fecha_inicial;
          $bindParams[":fecha_final"]   = $fecha_final;
        }

        /* ======================================================
             * 🔐 FILTRO POR CLIENTE SEGÚN PERFIL (AJUSTE NUEVO)
             * ====================================================== */
        if (
          isset($_SESSION['usuario']['id_perfil']) &&
          $_SESSION['usuario']['id_perfil'] != 1
        ) {
          $where[] = "pt.cliente = :cliente_session";
          $bindParams[":cliente_session"] = $_SESSION['usuario']['id_cliente'];
        }

        /* ======================================================
             * APLICAR WHERE + GROUP BY
             * ====================================================== */
        if (!empty($where)) {
          $sql .= " WHERE " . implode(" AND ", $where);
        }

        $sql .= " GROUP BY pt.numdoc_solicitud";

        /* ======================================================
             * EJECUCIÓN FINAL
             * ====================================================== */
        $stmt = $this->_db3->prepare($sql);

        foreach ($bindParams as $param => $value) {
          $stmt->bindValue($param, $value);
        }

        $stmt->execute();
        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);

        break;
    }

    return $resultado;
  }

  public function Listar_proveedores_clientes($dataId2)
  {
    try {
      $sql = "SELECT ptc.razon_social,ptc.id,ptc.estado_proveedor FROM cmx_proveedor_torre_control ptc 
      INNER JOIN cmx_cliente_proveedor_torre_control pc ON ptc.id=pc.proveedor_id
      WHERE pc.cliente_id= ?";
      $stmt = $this->_db3->prepare($sql);
      $stmt->execute([$dataId2]);
      $proveedores = $stmt->fetchAll(PDO::FETCH_ASSOC);
      return $proveedores;
    } catch (PDOException $e) {
      echo json_encode(['status' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
  }

  function Listar_servicio_proveedores($proveedor_id)
  {
    try {
      $sql = "SELECT st.tipo_servicio,st.id FROM cmx_servicio_torre_control st
      INNER JOIN cmx_servicio_proveedor_torre_control sp ON st.id=sp.servicio_id
      WHERE sp.proveedor_id= ?";
      $stmt = $this->_db3->prepare($sql);
      $stmt->execute([$proveedor_id]);
      $servicios = $stmt->fetchAll(PDO::FETCH_ASSOC);
      return $servicios;
    } catch (PDOException $e) {
      echo json_encode(['status' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
  }

  public function insertar_asignacion_proveedor($solicitudes, $asignaciones, $servicios_especiales, $ClienteId, $Observacion, $valorCheckboxes)
  {
    try {
      $this->_db3->beginTransaction(); // Iniciar transacciÃ³n para evitar inserciones incompletas

      // Obtener usuario y empresa desde la sesiÃ³n
      $nom_usuario = $_SESSION['usuario']['nom_usuario'] ?? null;
      $session_empresa_id = $_SESSION['usuario']['empresa_id'];

      // Contador de inserciones exitosas
      $totalInsertados = 0;

      /* Insetar en la tabla de recursos para saber cual es el recurso que se ejecuta */
      // 1. Obtener el nÃºmero actual de `cmx_maestro`
      $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='PEDIDO_RECURSO' AND numero_actual>numero_inicial AND empresa_id=:empresa_id FOR UPDATE");
      $sql_consecutivo->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
      $sql_consecutivo->execute();
      $resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);

      if (!$resultado_consecutivo) {
        throw new Exception("No se encontrÃ³ un nÃºmero de pedido vÃ¡lido.");
      }

      $numdoc_cabecera = $resultado_consecutivo['numero_actual'];
      $numdoc_actualizar_cabecera = $numdoc_cabecera + 1;

      // 2. Actualizar `numero_actual` en `cmx_maestro`
      $sql_update_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=:numdoc_actualizar_cabecera WHERE tipo='PEDIDO_RECURSO' AND empresa_id=:empresa_id");
      $sql_update_maestro->bindParam(':numdoc_actualizar_cabecera', $numdoc_actualizar_cabecera, PDO::PARAM_INT);
      $sql_update_maestro->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
      $sql_update_maestro->execute();

      if (!$sql_update_maestro) {
        throw new Exception("No se encontrÃ³ un nÃºmero de pedido vÃ¡lido.");
      }

      $estado_recurso = "Activo";
      /* Insertar en la tabla de recursos */
      $sql_insert_recirso = $this->_db3->prepare("INSERT INTO cmx_recurso_pedido (maestro_id,cliente_id,observacion, fecha,hora,usuario,estado,empresa_id) 
      VALUES (:maestro_id,:cliente_id,:observacion, CURDATE(),DATE_SUB(CURTIME(), INTERVAL 5 HOUR),:usuario,:estado,:empresa_id)");
      $sql_insert_recirso->bindParam(':maestro_id', $numdoc_cabecera, PDO::PARAM_INT);
      $sql_insert_recirso->bindParam(':cliente_id', $ClienteId, PDO::PARAM_INT);
      $sql_insert_recirso->bindParam(':observacion', $Observacion, PDO::PARAM_STR);
      $sql_insert_recirso->bindParam(':usuario', $nom_usuario, PDO::PARAM_STR);
      $sql_insert_recirso->bindParam(':estado', $estado_recurso, PDO::PARAM_STR);
      $sql_insert_recirso->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
      $sql_insert_recirso->execute();

      if (!$sql_insert_recirso) {
        throw new Exception("No se pudo insertar el recurso.");
      }

      foreach ($solicitudes as $key => $value) {
        foreach ($asignaciones as $index => $asignacion) {
          $sql = "INSERT INTO cmx_cliente_proveedor_servicio (pedido_id, proveedor_id, serivicio_id, fecha_vencimiento, hora_vencimiento, estado_pedido_asignado, proceso, tipo_vehiculo, recurso_id ,usuario, fecha, hora, empresa_id) 
                    VALUES (:pedido_id, :proveedor_id, :serivicio_id, :fecha_vencimiento, :hora_vencimiento, 'Activo', 'Asignación', :tipo_vehiculo, :recurso_id ,:usuario,CURDATE(), DATE_SUB(CURTIME(), INTERVAL 5 HOUR), :empresa_id)";

          $stmt = $this->_db3->prepare($sql);

          $stmt->bindParam(':pedido_id', $value['id']);
          $stmt->bindParam(':proveedor_id', $asignacion['proveedor_id']);
          $stmt->bindParam(':serivicio_id', $asignacion['servicio_id']);
          $stmt->bindParam(':fecha_vencimiento', $asignacion['fecha_vencimiento']);
          $stmt->bindParam(':hora_vencimiento', $asignacion['hora_vencimiento']);
          $stmt->bindParam(':tipo_vehiculo', $asignacion['tipo_vehiculo']);
          $stmt->bindParam(':recurso_id', $numdoc_cabecera);
          $stmt->bindParam(':usuario', $nom_usuario);
          $stmt->bindParam(':empresa_id', $session_empresa_id);

          $stmt->execute();

          // Verificar que se haya insertado al menos una fila
          if ($stmt->rowCount() === 0) {
            throw new Exception("Error al insertar la asignaciÃ³n para el proveedor {$asignacion['proveedor_id']}");
          }

          $totalInsertados++;
        }
      }

      // Si no se insertÃ³ ninguna fila, lanzar error
      if ($totalInsertados === 0) {
        throw new Exception("No se insertÃ³ ninguna asignaciÃ³n.");
      }

      // Actualizar el estado solo si hubo inserciones exitosas
      foreach ($solicitudes as $key => $solicitud) {
        $sql_update = $this->_db3->prepare("UPDATE cmx_pedido_torre_control SET estado_publicaion='Publicado', estado_asignacion='Asignado' WHERE numdoc_solicitud=:numdoc_solicitud");
        $sql_update->execute([':numdoc_solicitud' => $solicitud['id']]);
      }

      // Verificar si el `UPDATE` afectÃ³ filas
      if ($sql_update->rowCount() === 0) {
        throw new Exception("Error al actualizar el estado de asignaciÃ³n para el pedido.");
      }

      /* Insertar el estado de pedido por proveedor */
      $sql_insert_estado_proveedor = $this->_db3->prepare("INSERT INTO cmx_pedido_proveedor_estado (pedido_id,proveedor_id,recurso_id,estado_proceso_pedido,estado_visualizar,usuario ,fecha,hora,empresa_id)
      VALUES (:pedido_id,:proveedor_id,:recurso_id,:estado_proceso_pedido,:estado_visualizar,:usuario,CURDATE(),DATE_SUB(CURTIME(), INTERVAL 5 HOUR),:empresa_id)");

      foreach ($solicitudes as $key => $value) {
        foreach ($asignaciones as $index => $asignacion) {
          $sql_insert_estado_proveedor->execute([
            ':pedido_id' => $value['id'],
            ':proveedor_id' => $asignacion['proveedor_id'],
            ':recurso_id' => $numdoc_cabecera,
            ':estado_proceso_pedido' => 'Pendiente Iniciar',
            ':estado_visualizar' => 1,
            ':usuario' => $nom_usuario,
            ':empresa_id' => $session_empresa_id
          ]);
        }
      }

      if ($sql_insert_estado_proveedor->rowCount() === 0) {
        throw new Exception("Error al insertar el estado de pedido por proveedor.");
      }

      /*Insertar los estados de los recursos por proveedor*/
      /* Obtener solo un registro por proveedor */
      $proveedores_unicos = [];
      foreach ($asignaciones as $asignacion) {
        $proveedores_unicos[$asignacion['proveedor_id']] = $asignacion;
      }

      /* Preparar los valores para el INSERT */
      $valores = [];
      $parametros = [];

      $estado_recurso = "Pendiente Iniciar";
      $estado_actual = 1;
      // $fecha = date("Y-m-d");
      // $hora = date("H:i:s");

      // 1. Crea un objeto DateTime en BogotÃ¡
      $date = new DateTime('now', new DateTimeZone('America/Bogota'));

      // 2. Convierte a UTC (opcional si quieres guardar en UTC)
      // $date->setTimezone(new DateTimeZone('UTC'));

      // 3. Saca fecha y hora
      $fecha = $date->format('Y-m-d'); // Fecha correcta
      $hora = $date->format('H:i:s');  // Hora correcta

      foreach ($proveedores_unicos as $proveedor) {
        $valores[] = "(?, ?, ?, ?, ?, ?, ?, ?)";
        $parametros[] = $numdoc_cabecera;
        $parametros[] = $proveedor['proveedor_id'];
        $parametros[] = $estado_recurso;
        $parametros[] = $estado_actual;
        $parametros[] = $nom_usuario;
        $parametros[] = $fecha;
        $parametros[] = $hora;
        $parametros[] = $session_empresa_id;
      }

      /* Unir todas las filas en una sola consulta */
      $sql_insert_estado_recurso = $this->_db3->prepare(
        "INSERT INTO cmx_estado_historico_recurso 
      (recurso_id, proveedor_id, estado_recurso, estado_actual, usuario, fecha, hora, empresa_id) 
      VALUES " . implode(", ", $valores)
      );

      /* Ejecutar la consulta con todos los parÃ¡metros */
      if (!$sql_insert_estado_recurso->execute($parametros)) {
        throw new Exception("Error al insertar los estados del recurso por proveedor.");
      }


      /* Insertar en la tabla de estados de los servicios para controlarlos por proveedor */
      $sql_insert_estado_servicio_proveedor = $this->_db3->prepare("INSERT INTO cmx_estado_servicio_proveedor (pedido_id,servicio_id,proveedor_id,recurso_id,estado_servicio,estado_actual,usuario,fecha,hora,empresa_id)
      VALUES(:pedido_id,:servicio_id,:proveedor_id,:recurso_id,:estado_servicio,:estado_actual,:usuario,CURDATE(),DATE_SUB(CURTIME(), INTERVAL 5 HOUR),:empresa_id)");

      foreach ($solicitudes as $key => $value) {
        foreach ($asignaciones as $index => $asignacion) {
          $sql_insert_estado_servicio_proveedor->execute([
            ':pedido_id' => $value['id'],
            ':servicio_id' => $asignacion['servicio_id'],
            ':proveedor_id' => $asignacion['proveedor_id'],
            ':recurso_id' => $numdoc_cabecera,
            ':estado_servicio' => 'Pendiente Iniciar',
            ':estado_actual' => 1,
            ':usuario' => $nom_usuario,
            ':empresa_id' => $session_empresa_id
          ]);
        }
      }

      if ($sql_insert_estado_servicio_proveedor->rowCount() === 0) {
        throw new Exception("Error al insertar el estado de los servicios por proveedor.");
      }

      if ($valorCheckboxes == 'Si') {
        /* Insertar los servicios especiales si este recurso los tiene */
        $sql_servicio_especial = $this->_db3->prepare("INSERT INTO cmx_servicio_especial_recurso_tr( servicio_id, proveedor_id, recurso_id, servicio_especial, valor_servicio, estado_servicio_especial, usuario, fecha, hora, empresa_id)
        VALUES(:servicio_id, :proveedor_id, :recurso_id, :servicio_especial, :valor_servicio, :estado_servicio_especial, :usuario, CURDATE(), CURTIME(), :empresa_id)");

        foreach ($solicitudes as $key => $value) {
          foreach ($servicios_especiales as $index => $servicio) {
            foreach ($servicio['servicio_especial'] as $especial) {
              $sql_servicio_especial->execute([
                //':pedido_id' => $value['id'],
                ':servicio_id' => $servicio['servicio_id'],
                ':proveedor_id' => $servicio['proveedor_id'],
                ':recurso_id' => $numdoc_cabecera,
                ':servicio_especial' => (int) $especial,
                ':valor_servicio' => 0,
                ':estado_servicio_especial' => 'Solicitado',
                ':usuario' => $nom_usuario,
                ':empresa_id' => $session_empresa_id
              ]);
            }
          }
        }
        if ($sql_servicio_especial->rowCount() === 0) {
          throw new Exception("Error al insertar el estado de los servicios especiales por proveedor.");
        }
      }

      $this->_db3->commit(); // Confirmar la transacciÃ³n
      return ["status" => true, "message" => "Asignaciones insertadas y estado actualizado correctamente"];
    } catch (Exception $e) {
      $this->_db3->rollBack(); // Revertir si hay un error
      return ["status" => false, "message" => $e->getMessage()];
    }
  }

  public function Listar_servicios_proveedores($dataId2)
  {
    try {
      $sql = "SELECT  DISTINCT st.tipo_servicio,st.esatdo_servicio,pc.cliente_id, st.id AS servicio_id FROM cmx_servicio_torre_control st 
      INNER JOIN cmx_servicio_proveedor_torre_control spt ON st.id=spt.servicio_id
      INNER JOIN cmx_cliente_proveedor_torre_control pc ON spt.proveedor_id=pc.proveedor_id
      WHERE pc.cliente_id=?";
      $stmt = $this->_db3->prepare($sql);
      $stmt->execute([$dataId2]);
      $proveedores = $stmt->fetchAll(PDO::FETCH_ASSOC);
      return $proveedores;
    } catch (PDOException $e) {
      echo json_encode(['status' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
  }

  public function Listar_proveedores_servicios($clienId, $ServicioId)
  {
    try {
      $sql = "SELECT ptc.razon_social, ptc.id, ptc.estado_proveedor,sp.servicio_id FROM cmx_proveedor_torre_control ptc 
              INNER JOIN cmx_cliente_proveedor_torre_control pc ON ptc.id = pc.proveedor_id AND pc.estado_asignacion='Activo'
              INNER JOIN cmx_servicio_proveedor_torre_control sp ON pc.proveedor_id = sp.proveedor_id AND sp.estado_asignacion_servicio='Activo'
              WHERE pc.cliente_id = ? AND sp.servicio_id = ?";
      $stmt = $this->_db3->prepare($sql);
      $stmt->execute([$clienId, $ServicioId]);
      return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
      return ['status' => false, 'message' => 'Error: ' . $e->getMessage()];
    }
  }

  public function publicar_pedido_proveedor($seleccionados, $solicitudes, $Proveedoresseleccionados, $proceso, $ClienteId, $servicios_especiales, $observacion, $valorCheckboxes)
  {
    try {
      $this->_db3->beginTransaction(); // Iniciar la transacciÃ³n

      // Obtener usuario y empresa desde la sesiÃ³n
      $nom_usuario = $_SESSION['usuario']['nom_usuario'] ?? null;
      $session_empresa_id = $_SESSION['usuario']['empresa_id'] ?? null;

      if (!$nom_usuario || !$session_empresa_id) {
        throw new Exception("Usuario o empresa no definidos en la sesiÃ³n.");
      }

      // Contador de inserciones exitosas
      $totalInsertados = 0;

      /* Insetar en la tabla de recursos para saber cual es el recurso que se ejecuta */

      // 1. Obtener el nÃºmero actual de `cmx_maestro`
      $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='PEDIDO_RECURSO' AND numero_actual>numero_inicial AND empresa_id=:empresa_id FOR UPDATE");
      $sql_consecutivo->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
      $sql_consecutivo->execute();
      $resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);

      if (!$resultado_consecutivo) {
        throw new Exception("No se encontrÃ³ un nÃºmero de pedido vÃ¡lido.");
      }

      $numdoc_cabecera = $resultado_consecutivo['numero_actual'];
      $numdoc_actualizar_cabecera = $numdoc_cabecera + 1;

      // 2. Actualizar `numero_actual` en `cmx_maestro`
      $sql_update_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=:numdoc_actualizar_cabecera WHERE tipo='PEDIDO_RECURSO' AND empresa_id=:empresa_id");
      $sql_update_maestro->bindParam(':numdoc_actualizar_cabecera', $numdoc_actualizar_cabecera, PDO::PARAM_INT);
      $sql_update_maestro->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
      $sql_update_maestro->execute();

      if (!$sql_update_maestro) {
        throw new Exception("No se encontrÃ³ un nÃºmero de pedido vÃ¡lido.");
      }
      $estado_recurso = "Activo";

      /* Insertar en la tabla de recursos */
      $sql_insert_recirso = $this->_db3->prepare("INSERT INTO cmx_recurso_pedido (maestro_id,cliente_id,observacion,fecha,hora,usuario,estado,empresa_id) VALUES (:maestro_id,:cliente_id,:observacion,CURDATE(),DATE_SUB(CURTIME(), INTERVAL 5 HOUR),:usuario,:estado,:empresa_id)");
      $sql_insert_recirso->bindParam(':maestro_id', $numdoc_cabecera, PDO::PARAM_INT);
      $sql_insert_recirso->bindParam(':cliente_id', $ClienteId, PDO::PARAM_INT);
      $sql_insert_recirso->bindParam(':observacion', $observacion, PDO::PARAM_STR);
      $sql_insert_recirso->bindParam(':usuario', $nom_usuario, PDO::PARAM_STR);
      $sql_insert_recirso->bindParam(':estado', $estado_recurso, PDO::PARAM_STR);
      $sql_insert_recirso->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
      $sql_insert_recirso->execute();

      if (!$sql_insert_recirso) {
        throw new Exception("No se pudo insertar el recurso.");
      }

      // Preparar la consulta de inserciÃ³n
      $sql_insert = $this->_db3->prepare("INSERT INTO cmx_cliente_proveedor_servicio (pedido_id, proveedor_id, serivicio_id, fecha_vencimiento, hora_vencimiento, estado_pedido_asignado, proceso, tipo_vehiculo, recurso_id, usuario, fecha, hora, empresa_id) 
            VALUES (:pedido_id, :proveedor_id, :serivicio_id, :fecha_vencimiento, :hora_vencimiento, 'Activo', 'Publicación', :tipo_vehiculo, :recurso_id, :usuario,CURDATE(), DATE_SUB(CURTIME(), INTERVAL 5 HOUR), :empresa_id)");

      // Recorrer los servicios seleccionados
      foreach ($seleccionados as $item) {
        $servicio_id = $item['servicio_id'] ?? null;
        $proveedores = $item['proveedores'] ?? [];

        if (!$servicio_id || empty($proveedores)) {
          continue; // Saltar si faltan datos
        }

        // Insertar cada proveedor asociado al servicio
        foreach ($proveedores as $proveedor_id) {
          foreach ($solicitudes as $solicitud) {
            $sql_insert->execute([
              ':pedido_id' => $solicitud['id'],
              ':proveedor_id' => $proveedor_id,
              ':serivicio_id' => $servicio_id,
              ':fecha_vencimiento' => $item['fecha_vencimiento'],
              ':hora_vencimiento' => $item['hora_vencimiento'],
              ':tipo_vehiculo' => $item['tipo_vehiculo'],
              ':recurso_id' => $numdoc_cabecera,
              ':usuario' => $nom_usuario,
              ':empresa_id' => $session_empresa_id
            ]);
            $totalInsertados++;
          }
        }
      }

      if ($totalInsertados === 0) {
        throw new Exception("No se insertÃ³ ninguna asignaciÃ³n.");
      }

      // Actualizar el estado del pedido en `cmx_pedido_torre_control`
      foreach ($solicitudes as $solicitud) {
        $sql_update = $this->_db3->prepare(" UPDATE cmx_pedido_torre_control SET estado_publicaion='Publicado', estado_asignacion='Pendiente' WHERE numdoc_solicitud=:numdoc_solicitud ");

        $sql_update->execute([':numdoc_solicitud' => $solicitud['id']]);
      }

      if ($sql_update->rowCount() === 0) {
        throw new Exception("Error al actualizar el estado del pedido.");
      }

      /* Insertar el estado de pedido por proveedor */
      $sql_insert_estado_proveedor = $this->_db3->prepare("INSERT INTO cmx_pedido_proveedor_estado (pedido_id,proveedor_id,recurso_id,estado_proceso_pedido,estado_visualizar,usuario,fecha,hora,empresa_id)
      VALUES (:pedido_id,:proveedor_id,:recurso_id,:estado_proceso_pedido,:estado_visualizar,:usuario,CURDATE(),DATE_SUB(CURTIME(), INTERVAL 5 HOUR),:empresa_id)");

      foreach ($Proveedoresseleccionados as $proveedor_id) {
        foreach ($solicitudes as $solicitud) {
          $numdocSolicitud = $solicitud['id'];
          $sql_insert_estado_proveedor->execute([
            ':pedido_id' => $numdocSolicitud,
            ':proveedor_id' => $proveedor_id,
            ':recurso_id' => $numdoc_cabecera,
            ':estado_proceso_pedido' => 'Pendiente Iniciar',
            ':estado_visualizar' => 1,
            ':usuario' => $nom_usuario,
            ':empresa_id' => $session_empresa_id
          ]);
        }
      }

      if ($sql_insert_estado_proveedor->rowCount() === 0) {
        throw new Exception("Error al insertar el estado de pedido por proveedor.");
      }

      /*Insertar los estados de los recursos por proveedor*/
      $sql_insert_estado_recurso = $this->_db3->prepare("INSERT INTO cmx_estado_historico_recurso (recurso_id,proveedor_id,estado_recurso,estado_actual,usuario,fecha,hora,empresa_id)
      VALUES (:recurso_id,:proveedor_id,:estado_recurso,:estado_actual,:usuario,CURDATE(),DATE_SUB(CURTIME(), INTERVAL 5 HOUR),:empresa_id)");

      foreach ($Proveedoresseleccionados as $proveedor_id) {
        $sql_insert_estado_recurso->execute([
          ':recurso_id' => $numdoc_cabecera,
          ':proveedor_id' => $proveedor_id,
          ':estado_recurso' => 'Pendiente Iniciar',
          ':estado_actual' => 1,
          ':usuario' => $nom_usuario,
          ':empresa_id' => $session_empresa_id
        ]);
      }

      if ($sql_insert_estado_recurso->rowCount() === 0) {
        throw new Exception("Error al insertar el estado del recurso por proveedor.");
      }

      /* Insertar en la tabla de estados de los servicios para controlarlos por proveedor */
      $sql_insert_estado_servicio_proveedor = $this->_db3->prepare("INSERT INTO cmx_estado_servicio_proveedor (pedido_id,servicio_id,proveedor_id,recurso_id,estado_servicio,estado_actual,usuario,fecha,hora,empresa_id)
            VALUES(:pedido_id,:servicio_id,:proveedor_id,:recurso_id,:estado_servicio,:estado_actual,:usuario,CURDATE(),DATE_SUB(CURTIME(), INTERVAL 5 HOUR),:empresa_id)");

      // Recorrer los servicios seleccionados
      foreach ($seleccionados as $item) {
        $servicio_id = $item['servicio_id'] ?? null;
        $proveedores = $item['proveedores'] ?? [];

        if (!$servicio_id || empty($proveedores)) {
          continue; // Saltar si faltan datos
        }

        // Insertar cada proveedor asociado al servicio
        foreach ($proveedores as $proveedor_id) {
          foreach ($solicitudes as $solicitud) {
            $numdocSolicitud = $solicitud['id'];
            $sql_insert_estado_servicio_proveedor->execute(params: [
              ':pedido_id' => $numdocSolicitud,
              ':servicio_id' => $servicio_id,
              ':proveedor_id' => $proveedor_id,
              ':recurso_id' => $numdoc_cabecera,
              ':estado_servicio' => 'Pendiente Iniciar',
              ':estado_actual' => 1,
              ':usuario' => $nom_usuario,
              ':empresa_id' => $session_empresa_id
            ]);
          }
        }
      }

      if ($sql_insert_estado_servicio_proveedor->rowCount() === 0) {
        throw new Exception("Error al insertar el estado de los servicios por proveedor.");
      }

      if ($valorCheckboxes == 'Si') {
        # code...
        /* Insertar los servicios especiales si este recurso los tiene */
        $sql_servicio_especial = $this->_db3->prepare("INSERT INTO cmx_servicio_especial_recurso_tr( pedido_id, servicio_id, proveedor_id, recurso_id, servicio_especial, valor_servicio, estado_servicio_especial, usuario, fecha, hora, empresa_id)
        VALUES(:pedido_id, :servicio_id, :proveedor_id, :recurso_id, :servicio_especial, :valor_servicio, :estado_servicio_especial, :usuario, CURDATE(), CURTIME(), :empresa_id)");

        foreach ($proveedores as $proveedor_id) {
          foreach ($solicitudes as $key => $value) {
            foreach ($servicios_especiales as $index => $servicio) {
              foreach ($servicio['servicio_especial'] as $especial) {
                $sql_servicio_especial->execute([
                  ':pedido_id' => $value['id'],
                  ':servicio_id' => $servicio['servicio_id'],
                  ':proveedor_id' => $proveedor_id,
                  ':recurso_id' => $numdoc_cabecera,
                  ':servicio_especial' => (int) $especial,
                  ':valor_servicio' => 0,
                  ':estado_servicio_especial' => 'Activo',
                  ':usuario' => $nom_usuario,
                  ':empresa_id' => $session_empresa_id
                ]);
              }
            }
          }
        }

        if ($sql_servicio_especial->rowCount() === 0) {
          throw new Exception("Error al insertar el estado de los servicios especiales por proveedor.");
        }
      }


      $this->_db3->commit(); // Confirmar la transacciÃ³n
      return ["status" => true, "message" => "Publicación insertada correctamente"];
    } catch (\Throwable $th) {
      $this->_db3->rollBack(); // Revertir si hay un error
      return ["status" => false, "message" => $th->getMessage()];
    }
  }

  public function Detalle_proceso_pedido($Solicitud)
  {
    try {
      $proveedor = isset($_SESSION['usuario']['proveedor_id']) ? $_SESSION['usuario']['proveedor_id'] : null;
      $cliente = isset($_SESSION['usuario']['id_cliente']) ? $_SESSION['usuario']['id_cliente'] : null;
      $resultados = [];

      if ($_SESSION['usuario']['tipo_perfil'] == "PROVEEDOR") {
        $sql = $this->_db3->prepare("SELECT cs.proceso, st.tipo_servicio, pt.razon_social, cs.fecha_vencimiento, cs.hora_vencimiento,
                pt.id AS proveedor_id, st.id AS servicio_id, cs.pedido_id,
                COALESCE(etp.estado_pedido, 'SIN ESTADO') AS estado_pedido
                FROM cmx_cliente_proveedor_servicio cs 
                INNER JOIN cmx_servicio_torre_control st ON cs.serivicio_id = st.id
                INNER JOIN cmx_proveedor_torre_control pt ON cs.proveedor_id = pt.id
                LEFT JOIN cmx_estados_pedidos_tr etp ON cs.pedido_id = etp.pedido_id 
                AND cs.proveedor_id = etp.proveedor_id 
                AND cs.serivicio_id = etp.servicio_id 
                AND etp.estado_previsualizar = 1
                WHERE cs.pedido_id = :Solicitud AND cs.proveedor_id = :Proveedor");

        $sql->bindParam(':Solicitud', $Solicitud, PDO::PARAM_INT);
        $sql->bindParam(':Proveedor', $proveedor, PDO::PARAM_INT);
        $sql->execute();
        $resultados['consulta_proveedor'] = $sql->fetchAll(PDO::FETCH_ASSOC);
      } elseif ($_SESSION['usuario']['tipo_perfil'] == "CLINTES") {
        $sql = $this->_db3->prepare("SELECT cs.proceso, st.tipo_servicio, pt.razon_social, cs.fecha_vencimiento, cs.hora_vencimiento,
        pt.id AS proveedor_id, st.id AS servicio_id, cs.pedido_id,
        COALESCE(etp.estado_pedido, 'SIN ESTADO') AS estado_pedido
        FROM cmx_cliente_proveedor_servicio cs 
        INNER JOIN cmx_servicio_torre_control st ON cs.serivicio_id = st.id
        INNER JOIN cmx_proveedor_torre_control pt ON cs.proveedor_id = pt.id
        INNER JOIN cmx_cliente_proveedor_torre_control cpc ON cs.proveedor_id = cpc.proveedor_id
        INNER JOIN cmx_clientes c ON cpc.cliente_id = c.id
        LEFT JOIN cmx_estados_pedidos_tr etp ON cs.pedido_id = etp.pedido_id 
        AND cs.proveedor_id = etp.proveedor_id 
        AND cs.serivicio_id = etp.servicio_id 
        AND etp.estado_previsualizar = 1
        WHERE cs.pedido_id = :Solicitud AND c.id = :Cliente");

        $sql->bindParam(':Solicitud', $Solicitud, PDO::PARAM_INT);
        $sql->bindParam(':Cliente', $cliente, PDO::PARAM_INT);
        $sql->execute();
        $resultados['consulta_cliente'] = $sql->fetchAll(PDO::FETCH_ASSOC);
      } else {
        $sql = $this->_db3->prepare("SELECT cs.proceso, st.tipo_servicio, pt.razon_social, cs.fecha_vencimiento, cs.hora_vencimiento,
                pt.id AS proveedor_id, st.id AS servicio_id, cs.pedido_id,
                COALESCE(etp.estado_pedido, 'SIN ESTADO') AS estado_pedido
                FROM cmx_cliente_proveedor_servicio cs 
                INNER JOIN cmx_servicio_torre_control st ON cs.serivicio_id = st.id
                INNER JOIN cmx_proveedor_torre_control pt ON cs.proveedor_id = pt.id
                LEFT JOIN cmx_estados_pedidos_tr etp ON cs.pedido_id = etp.pedido_id 
                AND cs.proveedor_id = etp.proveedor_id 
                AND cs.serivicio_id = etp.servicio_id 
                AND etp.estado_previsualizar = 1
                WHERE cs.pedido_id = :Solicitud");

        $sql->bindParam(':Solicitud', $Solicitud, PDO::PARAM_INT);
        $sql->execute();
        $resultados['consulta_general'] = $sql->fetchAll(PDO::FETCH_ASSOC);

        /* Consulta para subasta */
        $sql1 = $this->_db3->prepare("SELECT cps.valor_servicio, cps.referencia, cps.fecha_inicio, cps.hora_inicio, pt.razon_social, 
                st.tipo_servicio, cps.fecha_actualizacion, cps.hora_actualizacion, cps.nombre_conductor
                FROM cmx_cliente_proveedor_servicio cps
                INNER JOIN cmx_proveedor_torre_control pt ON cps.proveedor_id = pt.id
                INNER JOIN cmx_servicio_torre_control st ON cps.serivicio_id = st.id
                WHERE cps.pedido_id = :Solicitud AND cps.valor_servicio IS NOT NULL");

        $sql1->bindParam(':Solicitud', $Solicitud, PDO::PARAM_INT);
        $sql1->execute();
        $resultados['consulta_subasta'] = $sql1->fetchAll(PDO::FETCH_ASSOC);


        $sql_gestionados = $this->_db3->prepare("SELECT COUNT(DISTINCT serivicio_id) AS total_gestionados  FROM cmx_cliente_proveedor_servicio WHERE pedido_id=:Solicitud AND valor_servicio IS NOT NULL");
        $sql_gestionados->bindParam(':Solicitud', $Solicitud, PDO::PARAM_INT);
        $sql_gestionados->execute();
        $resultados['total_gestionados'] = $sql_gestionados->fetch(PDO::FETCH_ASSOC);

        $sql_servicios = $this->_db3->prepare("SELECT COUNT(DISTINCT serivicio_id) AS total_servicios  FROM cmx_cliente_proveedor_servicio WHERE pedido_id=:Solicitud");
        $sql_servicios->bindParam(':Solicitud', $Solicitud, PDO::PARAM_INT);
        $sql_servicios->execute();
        $resultados['total_servicios'] = $sql_servicios->fetch(PDO::FETCH_ASSOC);
      }

      return $resultados;
    } catch (PDOException $e) {
      return ['error' => $e->getMessage()];
    }
  }

  public function Iniciar_gestion($datos)
  {
    try {
      // Obtener usuario y empresa desde la sesiÃ³n
      $nom_usuario = $_SESSION['usuario']['nom_usuario'] ?? null;
      $session_empresa_id = $_SESSION['usuario']['empresa_id'] ?? null;

      // Verificar que los datos requeridos estÃ©n presentes
      if (!$nom_usuario || !$session_empresa_id) {
        return ['status' => false, 'message' => 'Error: SesiÃ³n no vÃ¡lida.'];
      }

      // Verificar si ya existe un registro con el mismo pedido, proveedor y servicio
      $sqlCheck = $this->_db3->prepare("SELECT id FROM cmx_estados_pedidos_tr 
            WHERE pedido_id = :pedido_id AND proveedor_id = :proveedor_id AND servicio_id = :servicio_id");
      $sqlCheck->bindParam(':pedido_id', $datos['pedidoId'], PDO::PARAM_INT);
      $sqlCheck->bindParam(':proveedor_id', $datos['proveedorId'], PDO::PARAM_INT);
      $sqlCheck->bindParam(':servicio_id', $datos['servicioId'], PDO::PARAM_INT);
      $sqlCheck->execute();
      $existingRecord = $sqlCheck->fetch(PDO::FETCH_ASSOC);

      if ($existingRecord) {
        // Si existe, actualizar estado_previsualizar a 0 con los mismos 3 campos en el WHERE
        $sqlUpdate = $this->_db3->prepare("UPDATE cmx_estados_pedidos_tr 
                SET estado_previsualizar = 0 
                WHERE pedido_id = :pedido_id AND proveedor_id = :proveedor_id AND servicio_id = :servicio_id");
        $sqlUpdate->bindParam(':pedido_id', $datos['pedidoId'], PDO::PARAM_INT);
        $sqlUpdate->bindParam(':proveedor_id', $datos['proveedorId'], PDO::PARAM_INT);
        $sqlUpdate->bindParam(':servicio_id', $datos['servicioId'], PDO::PARAM_INT);
        $sqlUpdate->execute();
      }

      // Insertar el nuevo registro
      $sqlInsert = $this->_db3->prepare("INSERT INTO cmx_estados_pedidos_tr 
            (pedido_id, proveedor_id, servicio_id, estado_pedido, estado_previsualizar, usuario, fecha, hora, empresa_id) 
            VALUES (:pedido_id, :proveedor_id, :servicio_id, :estado_pedido, :estado_previsualizar, :usuario, :fecha, :hora, :empresa_id)");

      $estado = 1;
      // Asignar valores
      $sqlInsert->bindParam(':pedido_id', $datos['pedidoId'], PDO::PARAM_INT);
      $sqlInsert->bindParam(':proveedor_id', $datos['proveedorId'], PDO::PARAM_INT);
      $sqlInsert->bindParam(':servicio_id', $datos['servicioId'], PDO::PARAM_INT);
      $sqlInsert->bindParam(':estado_pedido', $datos['estado'], PDO::PARAM_STR);
      $sqlInsert->bindParam(':estado_previsualizar', $estado, PDO::PARAM_STR);
      $sqlInsert->bindParam(':usuario', $nom_usuario, PDO::PARAM_STR);
      $sqlInsert->bindParam(':fecha', $datos['fecha'], PDO::PARAM_STR);
      $sqlInsert->bindParam(':hora', $datos['hora'], PDO::PARAM_STR);
      $sqlInsert->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_INT);

      // Ejecutar la consulta de inserciÃ³n
      if ($sqlInsert->execute()) {
        return ['status' => true, 'message' => 'GestiÃ³n iniciada correctamente.'];
      } else {
        return ['status' => false, 'message' => 'Error al iniciar la gestiÃ³n.'];
      }
    } catch (PDOException $e) {
      return ['status' => false, 'message' => 'Error en la base de datos: ' . $e->getMessage()];
    }
  }

  public function Insertar_postulacion($datos)
  {
    try {

      // Obtener usuario y empresa desde la sesiÃ³n
      $nom_usuario = $_SESSION['usuario']['nom_usuario'] ?? null;
      $session_empresa_id = $_SESSION['usuario']['empresa_id'] ?? null;

      // Iniciar la transacciÃ³n
      $this->_db3->beginTransaction();

      // Actualizar el servicio
      foreach ($datos['PedidosId'] as $key => $value) {
        $sql = $this->_db3->prepare("UPDATE cmx_cliente_proveedor_servicio SET valor_servicio = :valor_servicio, referencia = :referencia,  fecha_inicio = :fecha_inicio, hora_inicio = :hora_inicio, fecha_actualizacion =CURDATE(), hora_actualizacion = DATE_SUB(CURTIME(), INTERVAL 5 HOUR),
        cedula_conductor=:cedula_conductor,nombre_conductor=:nombre_conductor,capacidad=:capacidad,tiempo_libre=:tiempo_libre,stand_bay=:valor_dia,cumplimiento=:estado_vehiculo,contenedor=:contenedor,tara=:tara
        WHERE pedido_id =:pedido_id AND proveedor_id = :proveedor_id  AND serivicio_id = :servicio_id AND recurso_id=:recurso_id");
        $sql->bindParam(':pedido_id', $value, PDO::PARAM_INT);
        $sql->bindParam(':proveedor_id', $datos['proveedorId'], PDO::PARAM_INT);
        $sql->bindParam(':servicio_id', $datos['servicioId'], PDO::PARAM_INT);
        $sql->bindParam(':recurso_id', $datos['RecursoId'], PDO::PARAM_INT);
        $sql->bindParam(':valor_servicio', $datos['costo_servicio'], PDO::PARAM_STR);
        $sql->bindParam(':referencia', $datos['placa'], PDO::PARAM_STR);
        $sql->bindParam(':fecha_inicio', $datos['fecha_inicio'], PDO::PARAM_STR);
        $sql->bindParam(':hora_inicio', $datos['hora_inicio'], PDO::PARAM_STR);
        $sql->bindParam(':cedula_conductor', $datos['cedula_conductor'], PDO::PARAM_STR);
        $sql->bindParam(':nombre_conductor', $datos['nombre_conductor'], PDO::PARAM_STR);
        $sql->bindParam(':capacidad', $datos['capacidad'], PDO::PARAM_STR);
        $sql->bindParam(':tiempo_libre', $datos['tiempo_libre'], PDO::PARAM_STR);
        $sql->bindParam(':valor_dia', $datos['valor_dia'], PDO::PARAM_STR);
        $sql->bindParam(':estado_vehiculo', $datos['estado_vehiculo'], PDO::PARAM_STR);
        $sql->bindParam(':contenedor', $datos['contenedor'], PDO::PARAM_STR);
        $sql->bindParam(':tara', $datos['tara'], PDO::PARAM_STR);
        $sql->execute();
      }

      if (!$sql) {
        throw new Exception('Error al actualizar cmx_cliente_proveedor_servicio.');
      }

      foreach ($datos['PedidosId'] as $key => $value) {
        $sqlUpdateEstado = $this->_db3->prepare("UPDATE cmx_estado_servicio_proveedor SET estado_actual = 0
        WHERE pedido_id = :pedido_id AND proveedor_id = :proveedor_id AND servicio_id = :servicio_id AND recurso_id=:recurso_id");
        $sqlUpdateEstado->bindParam(':pedido_id', $value, PDO::PARAM_INT);
        $sqlUpdateEstado->bindParam(':proveedor_id', $datos['proveedorId'], PDO::PARAM_INT);
        $sqlUpdateEstado->bindParam(':servicio_id', $datos['servicioId'], PDO::PARAM_INT);
        $sqlUpdateEstado->bindParam(':recurso_id', $datos['RecursoId'], PDO::PARAM_INT);
        $sqlUpdateEstado->execute();
      }

      if (!$sqlUpdateEstado) {
        throw new Exception('Error al actualizar cmx_estados_pedidos_tr.');
      }

      // Insertar el nuevo registro
      $sqlInsert = $this->_db3->prepare("INSERT INTO cmx_estado_servicio_proveedor (pedido_id,servicio_id, proveedor_id,recurso_id,estado_servicio, estado_actual, usuario, fecha, hora, empresa_id) 
            VALUES (:pedido_id, :servicio_id, :proveedor_id,:recurso_id ,:estado_servicio, :estado_actual, :usuario, :fecha, :hora, :empresa_id)");
      foreach ($datos['PedidosId'] as $key => $value) {

        $estado = 1;
        $estado_servicio = 'Postulado';
        // Asignar valores
        $sqlInsert->bindParam(':pedido_id', $value, PDO::PARAM_INT);
        $sqlInsert->bindParam(':servicio_id', $datos['servicioId'], PDO::PARAM_INT);
        $sqlInsert->bindParam(':proveedor_id', $datos['proveedorId'], PDO::PARAM_INT);
        $sqlInsert->bindParam(':recurso_id', $datos['RecursoId'], PDO::PARAM_INT);
        $sqlInsert->bindParam(':estado_servicio', $estado_servicio, PDO::PARAM_STR);
        $sqlInsert->bindParam(':estado_actual', $estado, PDO::PARAM_STR);
        $sqlInsert->bindParam(':usuario', $nom_usuario, PDO::PARAM_STR);
        $sqlInsert->bindParam(':fecha', $datos['fecha'], PDO::PARAM_STR);
        $sqlInsert->bindParam(':hora', $datos['hora'], PDO::PARAM_STR);
        $sqlInsert->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_INT);
        $sqlInsert->execute();
      }

      if (!$sqlInsert) {
        throw new Exception('Error al insertar cmx_estados_pedidos_tr.');
      }

      /* Actualizar el estado de los pedidos a "Postulado" */
      /* Actualizar los pedidos asociados al recurso con el proveedor */
      $estado_nuevo = 0;
      $sql_update = $this->_db3->prepare("UPDATE cmx_pedido_proveedor_estado SET estado_visualizar=:estado_visualizar WHERE pedido_id=:pedido_id AND proveedor_id=:proveedor_id");

      foreach ($datos['PedidosId'] as $value) {
        $sql_update->bindParam(':estado_visualizar', $estado_nuevo, PDO::PARAM_INT);
        $sql_update->bindParam(':pedido_id', $value, PDO::PARAM_INT);
        $sql_update->bindParam(':proveedor_id', $datos['proveedorId'], PDO::PARAM_INT);
        $sql_update->execute();
      }

      /* Insertar el nuevo estado de los pedidos */
      $estado_postulado = 'Postulado';
      $estado_visualizar = 1;
      $sql_insert = $this->_db3->prepare("INSERT INTO cmx_pedido_proveedor_estado (pedido_id, proveedor_id, recurso_id,estado_proceso_pedido, estado_visualizar, usuario, fecha, hora, empresa_id) 
                     VALUES (:pedido_id, :proveedor_id, :recurso_id,:estado_proceso_pedido, :estado_visualizar, :usuario, CURDATE(), DATE_SUB(CURTIME(), INTERVAL 5 HOUR), :empresa_id)");

      foreach ($datos['PedidosId'] as $value) {
        $sql_insert->bindParam(':pedido_id', $value, PDO::PARAM_INT);
        $sql_insert->bindParam(':proveedor_id', $datos['proveedorId'], PDO::PARAM_INT);
        $sql_insert->bindParam(':recurso_id', $datos['RecursoId'], PDO::PARAM_INT);
        $sql_insert->bindParam(':estado_proceso_pedido', $estado_postulado, PDO::PARAM_STR);
        $sql_insert->bindParam(':estado_visualizar', $estado_visualizar, PDO::PARAM_INT);
        $sql_insert->bindParam(':usuario', $_SESSION["usuario"]["nom_usuario"], PDO::PARAM_STR);
        $sql_insert->bindParam(':empresa_id', $_SESSION["usuario"]["empresa_id"], PDO::PARAM_INT);
        $sql_insert->execute();
      }

      // Confirmar la transacciÃ³n si todo sale bien
      $this->_db3->commit();

      return [
        'status' => true,
        'message' => 'PostulaciÃ³n realizada correctamente.',
        'pedidoId' => $datos['PedidosId'],
        'proceso' => $datos['Proceso']
      ];
    } catch (Exception $e) {
      // Revertir la transacciÃ³n en caso de error
      $this->_db3->rollback();

      // Registrar el error en logs
      error_log("Error en Insertar_postulacion: " . $e->getMessage());

      return [
        'status' => false,
        'message' => 'Error al realizar la postulaciÃ³n.',
        'error' => $e->getMessage()
      ];
    }
  }

  public function Insertar_prioridad($numdocSolicitud)
  {
    $sql = $this->_db3->prepare("UPDATE cmx_pedido_torre_control SET estado_prioridad = 'Prioritaria' WHERE numdoc_solicitud = :numdocSolicitud");
    $sql->bindParam(':numdocSolicitud', $numdocSolicitud, PDO::PARAM_INT);

    if (!$sql->execute()) {
      throw new Exception('Error al actualizar cmx_pedido_torre_control.');
    }

    return [
      'status' => true,
      'message' => 'Prioridad asignada correctamente.'
    ];
  }

  public function Iniciar_pedido($numdocSolicitud)
  {
    try {
      // Obtener usuario y empresa desde la sesiÃ³n
      $nom_usuario = $_SESSION['usuario']['nom_usuario'] ?? null;
      $session_empresa_id = $_SESSION['usuario']['empresa_id'] ?? null;
      $PorveedorId = $_SESSION['usuario']['proveedor_id'] ?? null;
      // $fecha = date('Y-m-d');
      // $hora = date('H:i:s');

      // 1. Crea un objeto DateTime en BogotÃ¡
      $date = new DateTime('now', new DateTimeZone('America/Bogota'));

      // 2. Convierte a UTC (opcional si quieres guardar en UTC)
      // $date->setTimezone(new DateTimeZone('UTC'));

      // 3. Saca fecha y hora
      $fecha = $date->format('Y-m-d'); // Fecha correcta
      $hora = $date->format('H:i:s');  // Hora correcta

      // Iniciar transacciÃ³n
      $this->_db3->beginTransaction();

      // Actualizar estado en cmx_pedido_proveedor_estado
      $sql = $this->_db3->prepare("UPDATE cmx_pedido_proveedor_estado SET estado_visualizar = 0  WHERE pedido_id = :numdocSolicitud  AND proveedor_id = :proveedor_id");
      $sql->bindParam(':numdocSolicitud', $numdocSolicitud, PDO::PARAM_INT);
      $sql->bindParam(':proveedor_id', $PorveedorId, PDO::PARAM_INT);

      if (!$sql->execute()) {
        throw new Exception('Error al actualizar cmx_pedido_proveedor_estado.');
      }

      // Insertar nuevo registro en cmx_pedido_proveedor_estado
      $sql_insert = $this->_db3->prepare("INSERT INTO cmx_pedido_proveedor_estado  (pedido_id, proveedor_id, estado_proceso_pedido, estado_visualizar, usuario, fecha, hora, empresa_id)
                                              VALUES (:pedido_id, :proveedor_id, :estado_proceso_pedido, :estado_visualizar, :usuario, :fecha, :hora, :empresa_id)");

      $estado_proceso_pedido = 'Iniciado';
      $estado_visualizar = 1;

      $sql_insert->bindParam(':pedido_id', $numdocSolicitud, PDO::PARAM_INT);
      $sql_insert->bindParam(':proveedor_id', $PorveedorId, PDO::PARAM_INT);
      $sql_insert->bindParam(':estado_proceso_pedido', $estado_proceso_pedido, PDO::PARAM_STR);
      $sql_insert->bindParam(':estado_visualizar', $estado_visualizar, PDO::PARAM_INT);
      $sql_insert->bindParam(':usuario', $nom_usuario, PDO::PARAM_STR);
      $sql_insert->bindParam(':fecha', $fecha, PDO::PARAM_STR);
      $sql_insert->bindParam(':hora', $hora, PDO::PARAM_STR);
      $sql_insert->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_INT);

      if (!$sql_insert->execute()) {
        throw new Exception('Error al insertar cmx_pedido_proveedor_estado.');
      }

      // Confirmar la transacciÃ³n
      $this->_db3->commit();

      return [
        'status' => true,
        'message' => 'Pedido iniciado correctamente.'
      ];
    } catch (Exception $e) {
      // Revertir la transacciÃ³n en caso de error
      $this->_db3->rollBack();

      return [
        'status' => false,
        'message' => $e->getMessage()
      ];
    }
  }

  public function Subastar_pedido($solicitudes, $proceso, $MaestroId, $ClienteId, $ReferenciaPedidos, $Criterio, $Modalidad)
  {
    $resultados = [];
    $response = [];
    $datosProcesados = [];
    $session_empresa_id = $_SESSION['usuario']['empresa_id'] ?? null;

    // 1. Crea un objeto DateTime en BogotÃ¡
    $date = new DateTime('now', new DateTimeZone('America/Bogota'));

    // 2. Convierte a UTC (opcional si quieres guardar en UTC)
    // $date->setTimezone(new DateTimeZone('UTC'));

    // 3. Saca fecha y hora
    $fecha = $date->format('Y-m-d'); // Fecha correcta
    $hora = $date->format('H:i:s');  // Hora correcta

    $empresa_id = $_SESSION['usuario']['empresa_id'];
    try {
      $this->_db3->beginTransaction();

      if ($proceso == "Asignación") {
        $estado_subasta = "Ganador";
        $estado_pedido = "Completado";
        $estado_pedido_visualizar = 1;

        /* Validar si el proveedor tiene una plantilla asociada para crear los pedidos */
        $sql_validate_plantilla = $this->_db3->prepare("
          SELECT proveedor_id FROM cmx_plantilla 
          WHERE proveedor_id = :proveedor_id AND modalidad = :modalidad AND estado_plantilla = 'ACTIVA'
        ");

        $sql_validate_plantilla->bindParam(':proveedor_id', $solicitudes[0]['proveedor_id']);
        $sql_validate_plantilla->bindParam(':modalidad', $Modalidad);

        $sql_validate_plantilla->execute();
        $resultado = $sql_validate_plantilla->fetchAll(PDO::FETCH_ASSOC);

        $rowCount = count($resultado);

        if ($rowCount > 0) {
          // 1. Obtener el nÃºmero actual de `cmx_maestro`
          $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='SUBASTA_TR' AND numero_actual>numero_inicial AND empresa_id=:empresa_id FOR UPDATE");
          $sql_consecutivo->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
          $sql_consecutivo->execute();
          $resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);

          if (!$resultado_consecutivo) {
            throw new Exception("No se encontrÃ³ un nÃºmero de subasta vÃ¡lido.");
          }

          $numdoc_cabecera = $resultado_consecutivo['numero_actual'];
          $numdoc_actualizar_cabecera = $numdoc_cabecera + 1;

          // 2. Actualizar `numero_actual` en `cmx_maestro`
          $sql_update_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=:numdoc_actualizar_cabecera WHERE tipo='SUBASTA_TR' AND empresa_id=:empresa_id");
          $sql_update_maestro->bindParam(':numdoc_actualizar_cabecera', $numdoc_actualizar_cabecera, PDO::PARAM_INT);
          $sql_update_maestro->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
          $sql_update_maestro->execute();

          if (!$sql_update_maestro) {
            throw new Exception("No se actualizÃ³ un nÃºmero de subasta vÃ¡lido.");
          }

          $sql_insert = $this->_db3->prepare("INSERT INTO cmx_subasta_torre_control (subasta_id,recurso_id,estado_subasta,usuario,fecha,hora,empresa_id)
          VALUES (:subasta_id,:recurso_id,:estado_subasta,:usuario,CURDATE(),DATE_SUB(CURTIME(), INTERVAL 5 HOUR),:empresa_id)");
          $sql_insert->bindParam(':subasta_id', $numdoc_cabecera, PDO::PARAM_INT);
          $sql_insert->bindParam(':recurso_id', $MaestroId, PDO::PARAM_INT);
          $sql_insert->bindParam(':estado_subasta', $estado_subasta, PDO::PARAM_STR);
          $sql_insert->bindParam(':usuario', $_SESSION["usuario"]["nom_usuario"], PDO::PARAM_STR);
          $sql_insert->bindParam(':empresa_id', $_SESSION["usuario"]["empresa_id"], PDO::PARAM_INT);
          $sql_insert->execute();

          // Preparar la consulta de inserciÃ³n
          $sql_insert_result_subasta = $this->_db3->prepare("INSERT INTO cmx_resultado_subasta_tr 
              (pedido_id, servicio_id, proveedor_id, subasta_id, valor_ganador, fecha_registro, hora_registro, estado_subasta,
               fecha_inicio, hora_inicio, fecha_actualizacion, hora_actualizacion, servicio_ganador_id, referencia, usuario, fecha, hora, empresa_id) 
              VALUES (:pedido_id, :servicio_id, :proveedor_id, :subasta_id, :valor_ganador, :fecha_registro, :hora_registro, :estado_subasta,
                      :fecha_inicio, :hora_inicio, :fecha_actualizacion, :hora_actualizacion, :servicio_ganador_id, :referencia ,:usuario, :fecha, :hora, :empresa_id)");

          foreach ($solicitudes as $solicitud) {
            $servicio_ganador_id = $solicitud['servicio_id'];
            $pedido_id = $solicitud['solicitud_id'];
            $servicio_id = $solicitud['servicio_id'];
            $proveedor_id = $solicitud['proveedor_id'];
            $referencia = empty($solicitud['placa']) ? $solicitud['placa'] : null;
            $subasta_id = $numdoc_cabecera;
            $valor_ganador = $this->convertirValorServicio($solicitud['valor_servicio']);
            $fecha_registro = date('Y-m-d');
            $hora_registro = date('H:i:s');
            $estado_subasta = 'Ganador';
            $partes = explode('-', $solicitud['fecha_inicio'], 4); // Dividir solo en 4 partes
            $fecha = "{$partes[0]}-{$partes[1]}-{$partes[2]}"; // AÃ±o-Mes-DÃ­a
            $hora = $partes[3]; // Hora
            $partes_actualizacion = explode('-', $solicitud['fecha_actualizacion'], 4); // Dividir solo en 4 partes
            $fecha_actualizacion = "{$partes_actualizacion[0]}-{$partes_actualizacion[1]}-{$partes_actualizacion[2]}"; // AÃ±o-Mes-DÃ­a
            $hora_actualizacion = $partes_actualizacion[3]; // Hora
            $usuario = $_SESSION['usuario']['nom_usuario'];
            // $fecha = date('Y-m-d');
            // $hora = date('H:i:s');
            $fecha_actual = date('Y-m-d H:i:s'); // Fecha y hora actual en UTC
            $fecha_colombia = date('Y-m-d H:i:s', strtotime('-5 hours', strtotime($fecha_actual)));

            // Separar fecha y hora
            $fecha = date('Y-m-d', strtotime($fecha_colombia));
            $hora = date('H:i:s', strtotime($fecha_colombia));
            $empresa_id = $_SESSION['usuario']['empresa_id'];

            $sql_insert_result_subasta->bindParam(':pedido_id', $pedido_id, PDO::PARAM_INT);
            $sql_insert_result_subasta->bindParam(':servicio_id', $servicio_id, PDO::PARAM_INT);
            $sql_insert_result_subasta->bindParam(':proveedor_id', $proveedor_id, PDO::PARAM_INT);
            $sql_insert_result_subasta->bindParam(':subasta_id', $subasta_id, PDO::PARAM_INT);
            $sql_insert_result_subasta->bindParam(':valor_ganador', $valor_ganador, PDO::PARAM_STR);
            $sql_insert_result_subasta->bindParam(':fecha_registro', $fecha_registro, PDO::PARAM_STR);
            $sql_insert_result_subasta->bindParam(':hora_registro', $hora_registro, PDO::PARAM_STR);
            $sql_insert_result_subasta->bindParam(':estado_subasta', $estado_subasta, PDO::PARAM_STR);
            $sql_insert_result_subasta->bindParam(':fecha_inicio', $fecha, PDO::PARAM_STR);
            $sql_insert_result_subasta->bindParam(':hora_inicio', $hora, PDO::PARAM_STR);
            $sql_insert_result_subasta->bindParam(':fecha_actualizacion', $fecha_actualizacion, PDO::PARAM_STR);
            $sql_insert_result_subasta->bindParam(':hora_actualizacion', $hora_actualizacion, PDO::PARAM_STR);
            $sql_insert_result_subasta->bindParam(':servicio_ganador_id', $servicio_ganador_id, PDO::PARAM_INT);
            $sql_insert_result_subasta->bindParam(':referencia', $referencia, PDO::PARAM_INT);
            $sql_insert_result_subasta->bindParam(':usuario', $usuario, PDO::PARAM_STR);
            $sql_insert_result_subasta->bindParam(':fecha', $fecha, PDO::PARAM_STR);
            $sql_insert_result_subasta->bindParam(':hora', $hora, PDO::PARAM_STR);
            $sql_insert_result_subasta->bindParam(':empresa_id', $empresa_id, PDO::PARAM_INT);

            if (!$sql_insert_result_subasta->execute()) {
              throw new Exception('Error al insertar en cmx_resultado_subasta_tr.');
            }

            // Actualizar estado en cmx_estados_pedidos_tr
            $sqlUpdate = $this->_db3->prepare("UPDATE cmx_estado_servicio_proveedor  SET estado_actual = 0 
                    WHERE pedido_id = :pedido_id AND proveedor_id = :proveedor_id AND servicio_id = :servicio_id");
            $sqlUpdate->bindParam(':pedido_id', $pedido_id, PDO::PARAM_INT);
            $sqlUpdate->bindParam(':proveedor_id', $proveedor_id, PDO::PARAM_INT);
            $sqlUpdate->bindParam(':servicio_id', $servicio_id, PDO::PARAM_INT);

            if (!$sqlUpdate->execute()) {
              throw new Exception('Error al actualizar cmx_estados_pedidos_tr.');
            }

            // Insertar en cmx_estados_pedidos_tr
            $sqlInsert = $this->_db3->prepare("INSERT INTO cmx_estado_servicio_proveedor (pedido_id, servicio_id, proveedor_id, recurso_id, estado_servicio, estado_actual, usuario, fecha, hora, empresa_id) 
                    VALUES (:pedido_id, :servicio_id, :proveedor_id, :recurso_id, :estado_servicio, :estado_actual, :usuario, :fecha, :hora, :empresa_id)");

            $estado = 1;
            $sqlInsert->bindParam(':pedido_id', $pedido_id, PDO::PARAM_INT);
            $sqlInsert->bindParam(':servicio_id', $servicio_id, PDO::PARAM_INT);
            $sqlInsert->bindParam(':proveedor_id', $proveedor_id, PDO::PARAM_INT);
            $sqlInsert->bindParam(':recurso_id', $MaestroId, PDO::PARAM_INT);
            $sqlInsert->bindParam(':estado_servicio', $estado_subasta, PDO::PARAM_STR);
            $sqlInsert->bindParam(':estado_actual', $estado, PDO::PARAM_INT);
            $sqlInsert->bindParam(':usuario', $usuario, PDO::PARAM_STR);
            $sqlInsert->bindParam(':fecha', $fecha, PDO::PARAM_STR);
            $sqlInsert->bindParam(':hora', $hora, PDO::PARAM_STR);
            $sqlInsert->bindParam(':empresa_id', $empresa_id, PDO::PARAM_INT);

            if (!$sqlInsert->execute()) {
              throw new Exception('Error al insertar en cmx_estados_pedidos_tr.');
            }

            /* Actuliar el estado de los pedidos */
            $sqlUpdatePedidos = $this->_db3->prepare("UPDATE cmx_pedido_torre_control SET estado_publicaion='Completado', estado_asignacion='Completado' WHERE numdoc_solicitud=:numdoc_solicitud");
            $sqlUpdatePedidos->bindParam(':numdoc_solicitud', $pedido_id, PDO::PARAM_INT);

            if (!$sqlUpdatePedidos->execute()) {
              throw new Exception('Error al actualizar cmx_pedido_torre_control.');
            }

            /* Actualizar el estado del pedido por proveedor */
            $sqlUpdatePedidoProveedor = $this->_db3->prepare("UPDATE cmx_pedido_proveedor_estado SET estado_visualizar=0 WHERE pedido_id=:numdoc_solicitud AND proveedor_id=:proveedor_id AND recurso_id=:recurso_id");
            $sqlUpdatePedidoProveedor->bindParam(':numdoc_solicitud', $pedido_id, PDO::PARAM_INT);
            $sqlUpdatePedidoProveedor->bindParam(':proveedor_id', $proveedor_id, PDO::PARAM_INT);
            $sqlUpdatePedidoProveedor->bindParam(':recurso_id', $MaestroId, PDO::PARAM_INT);

            if (!$sqlUpdatePedidoProveedor->execute()) {
              throw new Exception('Error al actualizar cmx_pedido_proveedor_estado.');
            }

            $sql_insert = $this->_db3->prepare("INSERT INTO cmx_pedido_proveedor_estado (pedido_id,proveedor_id,recurso_id,estado_proceso_pedido,estado_visualizar,usuario,fecha,hora,empresa_id)
              VALUES (:pedido_id,:proveedor_id,:recurso_id,:estado_proceso_pedido,:estado_visualizar,:usuario,CURDATE(),DATE_SUB(CURTIME(), INTERVAL 5 HOUR),:empresa_id)");

            $sql_insert->bindParam(':pedido_id', $pedido_id, PDO::PARAM_INT);
            $sql_insert->bindParam(':proveedor_id', $proveedor_id, PDO::PARAM_INT);
            $sql_insert->bindParam(':recurso_id', $MaestroId, PDO::PARAM_INT);
            $sql_insert->bindParam(':estado_proceso_pedido', $estado_pedido, PDO::PARAM_STR);
            $sql_insert->bindParam(':estado_visualizar', $estado_pedido_visualizar, PDO::PARAM_STR);
            $sql_insert->bindParam(':usuario', $usuario, PDO::PARAM_STR);
            $sql_insert->bindParam(':empresa_id', $empresa_id, PDO::PARAM_INT);

            if (!$sql_insert->execute()) {
              throw new Exception('Error al insertar en cmx_pedido_proveedor_estado.');
            }

            /* Actualizar el estado del recurso */
            $sql_update_recurso = $this->_db3->prepare("UPDATE cmx_estado_historico_recurso SET estado_actual=0 WHERE recurso_id=:recurso_id AND proveedor_id=:proveedor_id");
            $sql_update_recurso->bindParam(':recurso_id', $MaestroId, PDO::PARAM_INT);
            $sql_update_recurso->bindParam(':proveedor_id', $proveedor_id, PDO::PARAM_INT);

            if (!$sql_update_recurso->execute()) {
              throw new Exception('Error al actualizar cmx_estado_historico_recurso.');
            }

            /* insertar el nuevo estado para el recurso en los proveedores */
            $sql_insert_recurso = $this->_db3->prepare("INSERT INTO cmx_estado_historico_recurso (recurso_id,proveedor_id,estado_recurso,estado_actual,usuario,fecha,hora,empresa_id)
              VALUES (:recurso_id,:proveedor_id,:estado_recurso,:estado_actual,:usuario,CURDATE(),DATE_SUB(CURTIME(), INTERVAL 5 HOUR),:empresa_id)");

            $sql_insert_recurso->bindParam(':recurso_id', $MaestroId, PDO::PARAM_INT);
            $sql_insert_recurso->bindParam(':proveedor_id', $proveedor_id, PDO::PARAM_INT);
            $sql_insert_recurso->bindParam(':estado_recurso', $estado_pedido, PDO::PARAM_STR);
            $sql_insert_recurso->bindParam(':estado_actual', $estado_pedido_visualizar, PDO::PARAM_INT);
            $sql_insert_recurso->bindParam(':usuario', $usuario, PDO::PARAM_STR);
            $sql_insert_recurso->bindParam(':empresa_id', $empresa_id, PDO::PARAM_INT);

            if (!$sql_insert_recurso->execute()) {
              throw new Exception('Error al insertar en cmx_estado_historico_recurso.');
            }

            /* Actualizar el estado del recurso */
            $sql_update_recurso = $this->_db3->prepare("UPDATE cmx_recurso_pedido SET pedido_plantilla='SI' WHERE maestro_id=:recurso_id AND cliente_id=:cliente_id");
            $sql_update_recurso->bindParam(':recurso_id', $MaestroId, PDO::PARAM_INT);
            $sql_update_recurso->bindParam(':cliente_id', $ClienteId, PDO::PARAM_INT);

            if (!$sql_update_recurso->execute()) {
              throw new Exception('Error al actualizar cmx_recurso_pedido.');
            }
          }

          /* Programcion para crear las plantillas */
          if ($solicitudes[0]['servicio_id'] == 2) {
            $response = $this->crear_pedidos($solicitudes, $ClienteId, $ReferenciaPedidos, $MaestroId, $Modalidad);
          }
        } else {
          // echo "No se encontraron registros.";
          $response = [
            'success' => false,
            'code' => 503,
            'message' => 'El proveedor no cuenta con una plantilla disponible para este recurso. Por favor, verifique la configuraciÃ³n o contacte al administrador.'
          ];
        }
      } else if ($proceso == "Publicación") {
        /* Insertar en la cabecera de subasta */
        $estado_subasta = "Ganador";
        $estado_pedido = "Completado";
        $estado_pedido_visualizar = 1;

        if ($Criterio == 'Fecha_inicio_servicio') {
          // 1. Obtener el nÃºmero actual de `cmx_maestro`
          $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='SUBASTA_TR' AND numero_actual>numero_inicial AND empresa_id=:empresa_id FOR UPDATE");
          $sql_consecutivo->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
          $sql_consecutivo->execute();
          $resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);

          if (!$resultado_consecutivo) {
            throw new Exception("No se encontrÃ³ un nÃºmero de subasta vÃ¡lido.");
          }

          $numdoc_cabecera = $resultado_consecutivo['numero_actual'];
          $numdoc_actualizar_cabecera = $numdoc_cabecera + 1;

          // 2. Actualizar `numero_actual` en `cmx_maestro`
          $sql_update_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=:numdoc_actualizar_cabecera WHERE tipo='SUBASTA_TR' AND empresa_id=:empresa_id");
          $sql_update_maestro->bindParam(':numdoc_actualizar_cabecera', $numdoc_actualizar_cabecera, PDO::PARAM_INT);
          $sql_update_maestro->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
          $sql_update_maestro->execute();

          if (!$sql_update_maestro) {
            throw new Exception("No se actualizÃ³ un nÃºmero de subasta vÃ¡lido.");
          }

          $sql_insert = $this->_db3->prepare("INSERT INTO cmx_subasta_torre_control (subasta_id,recurso_id,estado_subasta,usuario,fecha,hora,empresa_id)
          VALUES (:subasta_id,:recurso_id,:estado_subasta,:usuario,CURDATE(),DATE_SUB(CURTIME(), INTERVAL 5 HOUR),:empresa_id)");
          $sql_insert->bindParam(':subasta_id', $numdoc_cabecera, PDO::PARAM_INT);
          $sql_insert->bindParam(':recurso_id', $MaestroId, PDO::PARAM_INT);
          $sql_insert->bindParam(':estado_subasta', $estado_subasta, PDO::PARAM_STR);
          $sql_insert->bindParam(':usuario', $_SESSION["usuario"]["nom_usuario"], PDO::PARAM_STR);
          $sql_insert->bindParam(':empresa_id', $_SESSION["usuario"]["empresa_id"], PDO::PARAM_INT);
          $sql_insert->execute();

          if (!$sql_insert) {
            throw new Exception("No se insertÃ³ un nÃºmero de subasta valido.");
          }

          /* Codigo para sacar los ganadores por servicios en la subasta del recurso */
          $sql = $this->_db3->prepare("WITH Ranked AS (
                    SELECT 
                        cps.serivicio_id AS total_gestionados,
                        st.tipo_servicio,
                        cps.proveedor_id,
                        CAST(REPLACE(cps.valor_servicio, ',', '') AS DECIMAL(15,2)) AS menor_valor,
                        cps.fecha_actualizacion,
                        cps.hora_actualizacion,
                        pt.razon_social,
                        cps.fecha_inicio,
                        cps.hora_inicio,
                        cps.serivicio_id,
                        ROW_NUMBER() OVER (
                            PARTITION BY cps.serivicio_id 
                            ORDER BY cps.fecha_inicio ASC, 
                                    cps.hora_inicio ASC
                        ) AS rn
                    FROM cmx_cliente_proveedor_servicio cps
                    INNER JOIN cmx_servicio_torre_control st ON cps.serivicio_id = st.id
                    INNER JOIN cmx_proveedor_torre_control pt ON cps.proveedor_id = pt.id
                    WHERE cps.recurso_id = :recurso_id AND cps.valor_servicio IS NOT NULL
                )
                SELECT total_gestionados, tipo_servicio, menor_valor, proveedor_id, fecha_actualizacion, hora_actualizacion, razon_social, fecha_inicio, hora_inicio, serivicio_id
                FROM Ranked
                WHERE rn = 1");
          $sql->bindParam(':recurso_id', $MaestroId, PDO::PARAM_INT);
          $sql->execute();
          $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        } else if ($Criterio == 'Valor_servicio') {
          // 1. Obtener el nÃºmero actual de `cmx_maestro`
          $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='SUBASTA_TR' AND numero_actual>numero_inicial AND empresa_id=:empresa_id FOR UPDATE");
          $sql_consecutivo->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
          $sql_consecutivo->execute();
          $resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);

          if (!$resultado_consecutivo) {
            throw new Exception("No se encontrÃ³ un nÃºmero de subasta vÃ¡lido.");
          }

          $numdoc_cabecera = $resultado_consecutivo['numero_actual'];
          $numdoc_actualizar_cabecera = $numdoc_cabecera + 1;

          // 2. Actualizar `numero_actual` en `cmx_maestro`
          $sql_update_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=:numdoc_actualizar_cabecera WHERE tipo='SUBASTA_TR' AND empresa_id=:empresa_id");
          $sql_update_maestro->bindParam(':numdoc_actualizar_cabecera', $numdoc_actualizar_cabecera, PDO::PARAM_INT);
          $sql_update_maestro->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
          $sql_update_maestro->execute();

          if (!$sql_update_maestro) {
            throw new Exception("No se actualizÃ³ un nÃºmero de subasta vÃ¡lido.");
          }

          $sql_insert = $this->_db3->prepare("INSERT INTO cmx_subasta_torre_control (subasta_id,recurso_id,estado_subasta,usuario,fecha,hora,empresa_id)
          VALUES (:subasta_id,:recurso_id,:estado_subasta,:usuario,CURDATE(),DATE_SUB(CURTIME(), INTERVAL 5 HOUR),:empresa_id)");
          $sql_insert->bindParam(':subasta_id', $numdoc_cabecera, PDO::PARAM_INT);
          $sql_insert->bindParam(':recurso_id', $MaestroId, PDO::PARAM_INT);
          $sql_insert->bindParam(':estado_subasta', $estado_subasta, PDO::PARAM_STR);
          $sql_insert->bindParam(':usuario', $_SESSION["usuario"]["nom_usuario"], PDO::PARAM_STR);
          $sql_insert->bindParam(':empresa_id', $_SESSION["usuario"]["empresa_id"], PDO::PARAM_INT);
          $sql_insert->execute();

          if (!$sql_insert) {
            throw new Exception("No se insertÃ³ un nÃºmero de subasta valido.");
          }

          /* Codigo para sacar los ganadores por servicios en la subasta del recurso */
          $sql = $this->_db3->prepare("WITH Ranked AS (
            SELECT 
                cps.serivicio_id AS total_gestionados,
                st.tipo_servicio,
                cps.proveedor_id,
                CAST(REPLACE(cps.valor_servicio, ',', '') AS DECIMAL(15,2)) AS menor_valor,
                cps.fecha_actualizacion,
                cps.hora_actualizacion,
                pt.razon_social,
                cps.fecha_inicio,
                cps.hora_inicio,
                cps.serivicio_id,
                ROW_NUMBER() OVER (
                    PARTITION BY cps.serivicio_id 
                    ORDER BY CAST(REPLACE(cps.valor_servicio, ',', '') AS DECIMAL(15,2)) ASC, 
                            cps.fecha_actualizacion ASC, 
                            cps.hora_actualizacion ASC
                ) AS rn
            FROM cmx_cliente_proveedor_servicio cps
            INNER JOIN cmx_servicio_torre_control st ON cps.serivicio_id = st.id
            INNER JOIN cmx_proveedor_torre_control pt ON cps.proveedor_id=pt.id
            WHERE cps.recurso_id = :recurso_id AND cps.valor_servicio IS NOT NULL
          )
          SELECT total_gestionados, tipo_servicio, menor_valor, proveedor_id, fecha_actualizacion, hora_actualizacion, razon_social, fecha_inicio, hora_inicio, serivicio_id
          FROM Ranked
          WHERE rn = 1");

          $sql->bindParam(':recurso_id', $MaestroId, PDO::PARAM_INT);
          $sql->execute();
          $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        }

        /* Validar si el proveedor tiene una plantilla asociada para crear los pedidos */
        $sql_validate_plantilla = $this->_db3->prepare("SELECT proveedor_id FROM cmx_plantilla WHERE proveedor_id = ? AND estado_plantilla='ACTIVA'");
        $sql_validate_plantilla->execute([$resultados[0]['proveedor_id']]);

        // Obtener la cantidad de filas
        $rowCount = $sql_validate_plantilla->rowCount();

        $sql_select_pedidos = $this->_db3->prepare("SELECT pedido_id FROM cmx_cliente_proveedor_servicio WHERE recurso_id=? GROUP BY pedido_id");
        $sql_select_pedidos->execute([$MaestroId]);
        $resultados_pedidos = $sql_select_pedidos->fetchAll(PDO::FETCH_ASSOC);

        foreach ($resultados_pedidos as $pedido) {
          if ($rowCount > 0) {
            // Preparar la consulta de inserciÃ³n
            $sql_insert_result_subasta = $this->_db3->prepare("INSERT INTO cmx_resultado_subasta_tr (pedido_id, servicio_id, proveedor_id, subasta_id, valor_ganador, fecha_registro, hora_registro, estado_subasta,
              fecha_inicio, hora_inicio, fecha_actualizacion, hora_actualizacion, servicio_ganador_id, usuario, fecha, hora, empresa_id) 
              VALUES (:pedido_id, :servicio_id, :proveedor_id, :subasta_id, :valor_ganador, :fecha_registro, :hora_registro, :estado_subasta,
                      :fecha_inicio, :hora_inicio, :fecha_actualizacion, :hora_actualizacion, :servicio_ganador_id, :usuario, :fecha, :hora, :empresa_id)");

            foreach ($resultados as $value) {
              $servicio_ganador_id = $value['serivicio_id'];
              $pedido_id = $pedido['pedido_id'];
              $servicio_id = $value['total_gestionados'];
              $proveedor_id = $value['proveedor_id'];
              $subasta_id = $numdoc_cabecera;
              $valor_ganador = $value['menor_valor'];
              $fecha_registro = date('Y-m-d');
              $hora_registro = date('H:i:s');
              $estado_subasta = 'Ganador';
              $fecha_inicio = $value['fecha_inicio'];
              $hora_inicio = $value['hora_inicio'];
              $fecha_actualizacion = $value['fecha_actualizacion'];
              $hora_actualizacion = $value['hora_actualizacion'];
              $usuario = $_SESSION['usuario']['nom_usuario'];

              // 1. Crea un objeto DateTime en BogotÃ¡
              $date = new DateTime('now', new DateTimeZone('America/Bogota'));

              // 2. Convierte a UTC (opcional si quieres guardar en UTC)
              // $date->setTimezone(new DateTimeZone('UTC'));

              // 3. Saca fecha y hora
              $fecha = $date->format('Y-m-d'); // Fecha correcta
              $hora = $date->format('H:i:s');  // Hora correcta
              $empresa_id = $_SESSION['usuario']['empresa_id'];

              $sql_insert_result_subasta->bindParam(':pedido_id', $pedido_id, PDO::PARAM_INT);
              $sql_insert_result_subasta->bindParam(':servicio_id', $servicio_id, PDO::PARAM_INT);
              $sql_insert_result_subasta->bindParam(':proveedor_id', $proveedor_id, PDO::PARAM_INT);
              $sql_insert_result_subasta->bindParam(':subasta_id', $subasta_id, PDO::PARAM_INT);
              $sql_insert_result_subasta->bindParam(':valor_ganador', $valor_ganador, PDO::PARAM_STR);
              $sql_insert_result_subasta->bindParam(':fecha_registro', $fecha_registro, PDO::PARAM_STR);
              $sql_insert_result_subasta->bindParam(':hora_registro', $hora_registro, PDO::PARAM_STR);
              $sql_insert_result_subasta->bindParam(':estado_subasta', $estado_subasta, PDO::PARAM_STR);
              $sql_insert_result_subasta->bindParam(':fecha_inicio', $fecha_inicio, PDO::PARAM_STR);
              $sql_insert_result_subasta->bindParam(':hora_inicio', $hora_inicio, PDO::PARAM_STR);
              $sql_insert_result_subasta->bindParam(':fecha_actualizacion', $fecha_actualizacion, PDO::PARAM_STR);
              $sql_insert_result_subasta->bindParam(':hora_actualizacion', $hora_actualizacion, PDO::PARAM_STR);
              $sql_insert_result_subasta->bindParam(':servicio_ganador_id', $servicio_ganador_id, PDO::PARAM_INT);
              $sql_insert_result_subasta->bindParam(':usuario', $usuario, PDO::PARAM_STR);
              $sql_insert_result_subasta->bindParam(':fecha', $fecha, PDO::PARAM_STR);
              $sql_insert_result_subasta->bindParam(':hora', $hora, PDO::PARAM_STR);
              $sql_insert_result_subasta->bindParam(':empresa_id', $empresa_id, PDO::PARAM_INT);

              if (!$sql_insert_result_subasta->execute()) {
                throw new Exception('Error al insertar en cmx_resultado_subasta_tr.');
              }

              // Actualizar estado en cmx_estado_servicio_proveedor
              $sqlUpdate = $this->_db3->prepare("UPDATE cmx_estado_servicio_proveedor  SET estado_actual = 0 
                  WHERE pedido_id = :pedido_id AND proveedor_id = :proveedor_id AND servicio_id = :servicio_id");
              $sqlUpdate->bindParam(':pedido_id', $pedido_id, PDO::PARAM_INT);
              $sqlUpdate->bindParam(':proveedor_id', $proveedor_id, PDO::PARAM_INT);
              $sqlUpdate->bindParam(':servicio_id', $servicio_id, PDO::PARAM_INT);

              if (!$sqlUpdate->execute()) {
                throw new Exception('Error al actualizar cmx_estados_pedidos_tr.');
              }

              // Actualizar estado en cmx_estado_servicio_proveedor
              $sqlUpdate = $this->_db3->prepare("UPDATE cmx_estado_servicio_proveedor  SET estado_actual = 0 
                            WHERE pedido_id = :pedido_id AND proveedor_id <> :proveedor_id AND servicio_id = :servicio_id");
              $sqlUpdate->bindParam(':pedido_id', $pedido_id, PDO::PARAM_INT);
              $sqlUpdate->bindParam(':proveedor_id', $proveedor_id, PDO::PARAM_INT);
              $sqlUpdate->bindParam(':servicio_id', $servicio_id, PDO::PARAM_INT);

              if (!$sqlUpdate->execute()) {
                throw new Exception('Error al actualizar cmx_estados_pedidos_tr.');
              }

              // Insertar en cmx_estado_servicio_proveedor
              $sqlInsert = $this->_db3->prepare("INSERT INTO cmx_estado_servicio_proveedor (pedido_id, servicio_id, proveedor_id, recurso_id, estado_servicio, estado_actual, usuario, fecha, hora, empresa_id) 
                                                        VALUES (:pedido_id, :servicio_id, :proveedor_id, :recurso_id, :estado_servicio, :estado_actual, :usuario, :fecha, :hora, :empresa_id)");

              $estado = 1;
              $sqlInsert->bindParam(':pedido_id', $pedido_id, PDO::PARAM_INT);
              $sqlInsert->bindParam(':servicio_id', $servicio_id, PDO::PARAM_INT);
              $sqlInsert->bindParam(':proveedor_id', $proveedor_id, PDO::PARAM_INT);
              $sqlInsert->bindParam(':recurso_id', $MaestroId, PDO::PARAM_INT);
              $sqlInsert->bindParam(':estado_servicio', $estado_subasta, PDO::PARAM_STR);
              $sqlInsert->bindParam(':estado_actual', $estado, PDO::PARAM_INT);
              $sqlInsert->bindParam(':usuario', $usuario, PDO::PARAM_STR);
              $sqlInsert->bindParam(':fecha', $fecha, PDO::PARAM_STR);
              $sqlInsert->bindParam(':hora', $hora, PDO::PARAM_STR);
              $sqlInsert->bindParam(':empresa_id', $empresa_id, PDO::PARAM_INT);

              if (!$sqlInsert->execute()) {
                throw new Exception('Error al insertar en cmx_estados_pedidos_tr.');
              }

              // Actualizar estado en cmx_estado_servicio_proveedor
              $sqlUpdate = $this->_db3->prepare("SELECT estado_servicio,pedido_id,proveedor_id,servicio_id FROM cmx_estado_servicio_proveedor WHERE pedido_id = :pedido_id AND proveedor_id <> :proveedor_id AND servicio_id = :servicio_id");
              $sqlUpdate->bindParam(':pedido_id', $pedido_id, PDO::PARAM_INT);
              $sqlUpdate->bindParam(':proveedor_id', $proveedor_id, PDO::PARAM_INT);
              $sqlUpdate->bindParam(':servicio_id', $servicio_id, PDO::PARAM_INT);

              if (!$sqlUpdate->execute()) {
                throw new Exception('Error al actualizar cmx_estados_pedidos_tr.');
              }

              $resultado = $sqlUpdate->fetchAll(PDO::FETCH_ASSOC);

              foreach ($resultado as $key => $value) {
                // Insertar en cmx_estado_servicio_proveedor
                $sqlInsert = $this->_db3->prepare("INSERT INTO cmx_estado_servicio_proveedor (pedido_id, servicio_id, proveedor_id, recurso_id, estado_servicio, estado_actual, usuario, fecha, hora, empresa_id) 
                  VALUES (:pedido_id, :servicio_id, :proveedor_id, :recurso_id, :estado_servicio, :estado_actual, :usuario, :fecha, :hora, :empresa_id)");
                $estado2 = 1;
                $estado_subasta2 = 'No Asignada';
                $sqlInsert->bindParam(':pedido_id', $value['pedido_id'], PDO::PARAM_INT);
                $sqlInsert->bindParam(':servicio_id', $value['servicio_id'], PDO::PARAM_INT);
                $sqlInsert->bindParam(':proveedor_id', $value['proveedor_id'], PDO::PARAM_INT);
                $sqlInsert->bindParam(':recurso_id', $MaestroId, PDO::PARAM_INT);
                $sqlInsert->bindParam(':estado_servicio', $estado_subasta2, PDO::PARAM_STR);
                $sqlInsert->bindParam(':estado_actual', $estado2, PDO::PARAM_INT);
                $sqlInsert->bindParam(':usuario', $usuario, PDO::PARAM_STR);
                $sqlInsert->bindParam(':fecha', $fecha, PDO::PARAM_STR);
                $sqlInsert->bindParam(':hora', $hora, PDO::PARAM_STR);
                $sqlInsert->bindParam(':empresa_id', $empresa_id, PDO::PARAM_INT);

                if (!$sqlInsert->execute()) {
                  throw new Exception('Error al insertar en cmx_estados_pedidos_tr.');
                }
              }

              /* Actualizar el estado del recurso */
              $sql_update_recurso = $this->_db3->prepare("UPDATE cmx_recurso_pedido SET pedido_plantilla='SI' WHERE maestro_id=:recurso_id AND cliente_id=:cliente_id");
              $sql_update_recurso->bindParam(':recurso_id', $MaestroId, PDO::PARAM_INT);
              $sql_update_recurso->bindParam(':cliente_id', $ClienteId, PDO::PARAM_INT);

              if (!$sql_update_recurso->execute()) {
                throw new Exception('Error al actualizar cmx_recurso_pedido.');
              }
            }

            try {
              // 1. Consultar servicios y estados
              $sql_validated = $this->_db3->prepare("
                  SELECT esp.servicio_id, esp.estado_servicio, esp.pedido_id
                  FROM cmx_recurso_pedido rp 
                  INNER JOIN cmx_estado_servicio_proveedor esp ON rp.maestro_id = esp.recurso_id
                  WHERE rp.maestro_id = :maestro_id AND esp.estado_actual = 1
              ");

              $sql_validated->bindParam(':maestro_id', $MaestroId, PDO::PARAM_INT);
              $sql_validated->execute();
              $validated = $sql_validated->fetchAll(PDO::FETCH_ASSOC); // Trae servicio_id y estado_servicio

              // 2. Agrupar por servicio_id
              $servicios = [];
              foreach ($validated as $row) {
                $pedidoId = $row['pedido_id'];
                $servicioId = $row['servicio_id'];
                $estado = strtolower($row['estado_servicio']); // pasar a minÃºsculas para evitar problemas

                if (!isset($servicios[$pedidoId])) {
                  $servicios[$pedidoId] = [];
                }
                if (!isset($servicios[$pedidoId][$servicioId])) {
                  $servicios[$pedidoId][$servicioId] = [];
                }
                $servicios[$pedidoId][$servicioId][] = $estado;
              }

              // 3. Validar que cada servicio tenga exactamente un "Ganador"
              $todoCorrecto = true;
              foreach ($servicios as $pedidoId => $serviciosPedido) {
                foreach ($serviciosPedido as $servicioId => $estados) {
                  $ganadores = array_filter($estados, fn($e) => $e === 'ganador');
                  if (count($ganadores) !== 1) {
                    $todoCorrecto = false;
                    break 2; // salir de ambos foreach
                  }
                }
              }

              // 4. Si todo estÃ¡ correcto, realizar las actualizaciones
              if ($todoCorrecto) {
                // Actualizar estado de pedidos
                $sqlUpdatePedidos = $this->_db3->prepare("
                      UPDATE cmx_pedido_torre_control
                      SET estado_publicaion = 'Completado', estado_asignacion = 'Completado'
                      WHERE numdoc_solicitud = :numdoc_solicitud
                  ");
                $sqlUpdatePedidos->bindParam(':numdoc_solicitud', $pedido_id, PDO::PARAM_INT);
                if (!$sqlUpdatePedidos->execute()) {
                  throw new Exception('Error al actualizar cmx_pedido_torre_control.');
                }

                // Actualizar pedido por proveedor
                $sqlUpdatePedidoProveedor = $this->_db3->prepare("
                      UPDATE cmx_pedido_proveedor_estado
                      SET estado_visualizar = 0
                      WHERE pedido_id = :numdoc_solicitud
                        AND proveedor_id = :proveedor_id
                        AND recurso_id = :recurso_id
                  ");
                $sqlUpdatePedidoProveedor->bindParam(':numdoc_solicitud', $pedido_id, PDO::PARAM_INT);
                $sqlUpdatePedidoProveedor->bindParam(':proveedor_id', $proveedor_id, PDO::PARAM_INT);
                $sqlUpdatePedidoProveedor->bindParam(':recurso_id', $MaestroId, PDO::PARAM_INT);
                if (!$sqlUpdatePedidoProveedor->execute()) {
                  throw new Exception('Error al actualizar cmx_pedido_proveedor_estado.');
                }

                // Insertar nuevo estado en pedido_proveedor_estado
                $sql_insert = $this->_db3->prepare("
                      INSERT INTO cmx_pedido_proveedor_estado 
                      (pedido_id, proveedor_id, recurso_id, estado_proceso_pedido, estado_visualizar, usuario, fecha, hora, empresa_id)
                      VALUES 
                      (:pedido_id, :proveedor_id, :recurso_id, :estado_proceso_pedido, :estado_visualizar, :usuario, CURDATE(), DATE_SUB(CURTIME(), INTERVAL 5 HOUR), :empresa_id)
                  ");
                $sql_insert->bindParam(':pedido_id', $pedido_id, PDO::PARAM_INT);
                $sql_insert->bindParam(':proveedor_id', $proveedor_id, PDO::PARAM_INT);
                $sql_insert->bindParam(':recurso_id', $MaestroId, PDO::PARAM_INT);
                $sql_insert->bindParam(':estado_proceso_pedido', $estado_pedido, PDO::PARAM_STR);
                $sql_insert->bindParam(':estado_visualizar', $estado_pedido_visualizar, PDO::PARAM_STR);
                $sql_insert->bindParam(':usuario', $usuario, PDO::PARAM_STR);
                $sql_insert->bindParam(':empresa_id', $empresa_id, PDO::PARAM_INT);
                if (!$sql_insert->execute()) {
                  throw new Exception('Error al insertar en cmx_pedido_proveedor_estado.');
                }

                // Actualizar estado del recurso
                $sql_update_recurso = $this->_db3->prepare("
                      UPDATE cmx_estado_historico_recurso
                      SET estado_actual = 0
                      WHERE recurso_id = :recurso_id AND proveedor_id = :proveedor_id
                  ");
                $sql_update_recurso->bindParam(':recurso_id', $MaestroId, PDO::PARAM_INT);
                $sql_update_recurso->bindParam(':proveedor_id', $proveedor_id, PDO::PARAM_INT);
                if (!$sql_update_recurso->execute()) {
                  throw new Exception('Error al actualizar cmx_estado_historico_recurso.');
                }

                // Insertar nuevo estado en estado_historico_recurso
                $sql_insert_recurso = $this->_db3->prepare("
                      INSERT INTO cmx_estado_historico_recurso
                      (recurso_id, proveedor_id, estado_recurso, estado_actual, usuario, fecha, hora, empresa_id)
                      VALUES
                      (:recurso_id, :proveedor_id, :estado_recurso, :estado_actual, :usuario, CURDATE(), DATE_SUB(CURTIME(), INTERVAL 5 HOUR), :empresa_id)
                  ");
                $sql_insert_recurso->bindParam(':recurso_id', $MaestroId, PDO::PARAM_INT);
                $sql_insert_recurso->bindParam(':proveedor_id', $proveedor_id, PDO::PARAM_INT);
                $sql_insert_recurso->bindParam(':estado_recurso', $estado_pedido, PDO::PARAM_STR);
                $sql_insert_recurso->bindParam(':estado_actual', $estado_pedido_visualizar, PDO::PARAM_INT);
                $sql_insert_recurso->bindParam(':usuario', $usuario, PDO::PARAM_STR);
                $sql_insert_recurso->bindParam(':empresa_id', $empresa_id, PDO::PARAM_INT);
                if (!$sql_insert_recurso->execute()) {
                  throw new Exception('Error al insertar en cmx_estado_historico_recurso.');
                }
              }
            } catch (Exception $e) {
              // Manejo de errores
              echo "Error: " . $e->getMessage();
            }
          } else {
            echo "No se encontraron registros.";
            $resultados = [
              'success' => false,
              'code' => 503,
              'message' => 'El proveedor no cuenta con una plantilla disponible para este recurso. Por favor, verifique la configuraciÃ³n o contacte al administrador.'
            ];
          }
        }
        /* Programcion para crear las plantillas */
        if ($resultados[0]['serivicio_id'] == 2) {
          $resultados = $this->crear_pedidos($resultados, isset($ClienteId) ? $ClienteId : 99, $ReferenciaPedidos, $MaestroId, $Modalidad);
        }
      }

      $this->_db3->commit();
      // return ['success' => true, 'message' => 'Pedido subastado correctamente.'];
      return $response;
    } catch (Exception $e) {
      $this->_db3->rollBack();
      error_log("Error en Subastar_pedido: " . $e->getMessage());
      return ['error' => $e->getMessage()];
    }
  }

  public function crear_pedidos($solicitudes, $ClienteId, $ReferenciaPedidos, $MaestroId, $Modalidad)
  {
    /* Consultar plantillas del proveedor */
    $proveedores_recorridos = [];
    $proveedores_recorridosActividad = [];
    $proveedores_recorridosActividad1 = [];

    $response = [];
    $user = $_SESSION["usuario"]["nom_usuario"];
    $session_empresa_id = $_SESSION['usuario']['empresa_id'] ?? null;

    // 1. Crea un objeto DateTime en BogotÃ¡
    $date = new DateTime('now', new DateTimeZone('America/Bogota'));

    // 2. Convierte a UTC (opcional si quieres guardar en UTC)
    // $date->setTimezone(new DateTimeZone('UTC'));

    // 3. Saca fecha y hora
    $fecha = $date->format('Y-m-d'); // Fecha correcta
    $hora = $date->format('H:i:s');  // Hora correcta

    $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='PED_PRO' AND numero_actual>numero_inicial AND empresa_id=:empresa_id");
    $sql_consecutivo->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
    $resultado_consecutivo = $sql_consecutivo->execute();
    $resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
    $numdoc = $resultado_consecutivo['numero_actual'];
    $numdoc_actualizar = $resultado_consecutivo['numero_actual'] + 1;

    if (!$resultado_consecutivo) {
      throw new Exception("No se encontrÃ³ un nÃºmero de pedido vÃ¡lido.");
    }

    try {
      // Actualizar Maestro de pedidos y procesos
      $sql_updata_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numdoc_actualizar WHERE tipo='PED_PRO' AND empresa_id=:empresa_id");
      $sql_updata_maestro->bindParam(":empresa_id", $session_empresa_id, PDO::PARAM_STR);
      $resultado_consecutivo_update = $sql_updata_maestro->execute();

      if (!$resultado_consecutivo_update) {
        throw new Exception("Error Processing Request", 1);
      }

      /* Insertar en la cabecera de pedidos para crearlo */
      $estado = 'ACTIVO';
      $referencia = implode("-", $ReferenciaPedidos);
      $observacion = "NULL";
      $sql = $this->_db3->prepare("INSERT INTO cmx_trazabilidad_proceso(numdoc,cliente,referencia,observacion,recurso_id,fecha_creacion,hora_creacion,usuario,estado,empresa_id) 
      VALUES(:numdoc,:cliente,:referencia,:observacion,:recurso_id,:fecha_creacion,:hora_creacion,:usuario,:estado,:empresa_id)");
      $sql->bindParam(':numdoc', $numdoc, PDO::PARAM_STR);
      $sql->bindParam(':cliente', $ClienteId, PDO::PARAM_STR);
      $sql->bindParam(':referencia', $referencia, PDO::PARAM_STR);
      $sql->bindParam(':observacion', $observacion, PDO::PARAM_STR);
      $sql->bindParam(':recurso_id', $MaestroId, PDO::PARAM_STR);
      $sql->bindParam(':usuario', $user, PDO::PARAM_STR);
      $sql->bindParam(':fecha_creacion', $fecha, PDO::PARAM_STR);
      $sql->bindParam(':hora_creacion', $hora, PDO::PARAM_STR);
      $sql->bindParam(':estado', $estado, PDO::PARAM_STR);
      $sql->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
      $resultados = $sql->execute();

      if (!$resultados) {
        throw new Exception("Error al insertar en la tabla de trazabilidad.", 1);
      }

      foreach ($solicitudes as $key => $value) {
        $proveedor_id = $value['proveedor_id'];
        if (!isset($proveedores_recorridos[$proveedor_id])) {
          // Ejecutar la consulta solo si el proveedor no ha sido procesado antes
          $sql_select_plantilla = $this->_db3->prepare(
            "SELECT
            dp.tipo_proceso_id
          FROM
            cmx_plantilla p
            INNER JOIN cmx_detalle_plantilla_parametros dp ON dp.numdoc_plantilla = p.numdoc 
          WHERE
            p.proveedor_id = :proveedor_id AND p.modalidad=:modalidad AND p.estado_plantilla='ACTIVA'"
          );
          $sql_select_plantilla->bindParam(':proveedor_id', $proveedor_id);
          $sql_select_plantilla->bindParam(':modalidad', $Modalidad);
          $sql_select_plantilla->execute();
          $resultados = $sql_select_plantilla->fetchAll(PDO::FETCH_ASSOC);
          // Marcar este proveedor como procesado
          $proveedores_recorridos[$proveedor_id] = true;
        }
      }

      foreach ($resultados as $key => $resultado) {
        $sql_detalle1 = $this->_db3->prepare("INSERT INTO cmx_tipo_detalle_trazabilidad(numdoc_detalle_trazabilidad,tipo_procesos_id,fecha_creacion)VALUES(:numdoc_detalle_trazabilidad,:tipo_procesos_id,:fecha_creacion)");
        $sql_detalle1->bindParam(':numdoc_detalle_trazabilidad', $numdoc, PDO::PARAM_STR);
        $sql_detalle1->bindParam(':tipo_procesos_id', $resultado['tipo_proceso_id'], PDO::PARAM_STR);
        $sql_detalle1->bindParam(':fecha_creacion', $fecha, PDO::PARAM_STR);
        $resultados_detalle = $sql_detalle1->execute();
      }

      if (!$resultados_detalle) {
        throw new Exception("Error al insertar en la tabla de trazabilidad.", 1);
      }

      /* Consulta para traer las actvidades para armar el pedidos despues de subastar el servicio */
      foreach ($solicitudes as $key => $value) {
        $proveedor_id = $value['proveedor_id'];
        if (!isset($proveedores_recorridosActividad[$proveedor_id])) {
          $sql_actividades = $this->_db3->prepare("SELECT
            pa.detalle_actividad_plantilla,pa.posicion,pa.responsable,pa.criterio_calculo,pa.valor_minutos,pa.dependiente,pa.activdad_dependiente,pa.detalle_actividad,pa.medida_tiempo,pa.costo_sugerido,pa.tipo_operacion
          FROM
            cmx_plantilla p
            INNER JOIN cmx_plantilla_actividad pa ON p.numdoc=pa.numdoc_detalle_plantilla
          WHERE
            p.proveedor_id =:proveedor_id  AND p.modalidad=:modalidad  AND p.estado_plantilla='ACTIVA'");
          $sql_actividades->bindParam(':proveedor_id', $proveedor_id);
          $sql_actividades->bindParam(':modalidad', $Modalidad);
          $sql_actividades->execute();
          $resultados_actividades = $sql_actividades->fetchAll(PDO::FETCH_ASSOC);

          // Marcar este proveedor como procesado
          $proveedores_recorridosActividad[$proveedor_id] = true;
        }
      }

      // $costo_promedio = 0;
      $tiempo = 0;
      // 1. Crea un objeto DateTime en BogotÃ¡
      $date_now = new DateTime('now', new DateTimeZone('America/Bogota'));

      foreach ($resultados_actividades as $key => $value) {
        if ($value['dependiente'] === 'SI') {
          // Clonar la fecha actual para no modificar el original
          $actividad_date = clone $date_now;
          $fecha_base = $actividad_date->format('Y-m-d');
          $hora_base = $actividad_date->format('H:i:s');
        } else {
          $fecha_base = null;
          $hora_base = null;
        }

        $fecha_inicio = null;
        $hora_inicio = null;

        $sql_detalle2 = $this->_db3->prepare("INSERT INTO cmx_detalle_opcion_trazabilidad(numdoc_detalle_opcion,detalle_proceso,posicion,usuario,fecha_creacion,hora,usuario_responsable,fecha_inicio,hora_inicio,fecha_base,
        hora_base,criterio_calculo,valor_minutos,medida_tiempo,dependiente,activiadda_dependiente,detalle_actividad,tipo_operacion,tiempo_transcurrido,costo_promedio)
        VALUES(:numdoc_detalle_opcion,:detalle_proceso,:posicion,:usuario,:fecha_creacion,:hora,:usuario_responsable,:fecha_inicio,:hora_inicio,:fecha_base,:hora_base,:criterio_calculo,:valor_minutos,:medida_tiempo,:dependiente,:activiadda_dependiente,
        :detalle_actividad,:tipo_operacion,:tiempo_transcurrido,:costo_promedio)");
        $sql_detalle2->bindParam(':numdoc_detalle_opcion', $numdoc, PDO::PARAM_STR);
        $sql_detalle2->bindParam(':detalle_proceso', $value['detalle_actividad_plantilla'], PDO::PARAM_STR);
        $sql_detalle2->bindParam(':posicion', $value['posicion'], PDO::PARAM_STR);
        $sql_detalle2->bindParam(':usuario', $user, PDO::PARAM_STR);
        $sql_detalle2->bindParam(':fecha_creacion', $fecha, PDO::PARAM_STR);
        $sql_detalle2->bindParam(':hora', $hora, PDO::PARAM_STR);
        $sql_detalle2->bindParam(':usuario_responsable', $value['responsable'], PDO::PARAM_STR);
        $sql_detalle2->bindParam(':fecha_inicio', $fecha_inicio, PDO::PARAM_STR);
        $sql_detalle2->bindParam(':hora_inicio', $hora_inicio, PDO::PARAM_STR);
        $sql_detalle2->bindParam(':fecha_base', $fecha_base, PDO::PARAM_STR);
        $sql_detalle2->bindParam(':hora_base', $hora_base, PDO::PARAM_STR);
        $sql_detalle2->bindParam(':criterio_calculo', $value['criterio_calculo'], PDO::PARAM_STR);
        $sql_detalle2->bindParam(':valor_minutos', $value['valor_minutos'], PDO::PARAM_STR);
        $sql_detalle2->bindParam(':medida_tiempo', $value['medida_tiempo'], PDO::PARAM_STR);
        $sql_detalle2->bindParam(':dependiente', $value['dependiente'], PDO::PARAM_STR);
        $sql_detalle2->bindParam(':activiadda_dependiente', $value['activdad_dependiente'], PDO::PARAM_STR);
        $sql_detalle2->bindParam(':detalle_actividad', $value['detalle_actividad'], PDO::PARAM_STR);
        $sql_detalle2->bindParam(':tipo_operacion', $value['tipo_operacion'], PDO::PARAM_STR);
        $sql_detalle2->bindParam(':tiempo_transcurrido', $tiempo, PDO::PARAM_STR);
        // $sql_detalle2->bindParam(':costo_promedio', $costo_promedio, PDO::PARAM_STR);
        $sql_detalle2->bindParam(':costo_promedio', $value['costo_sugerido'], PDO::PARAM_STR);
        $resultados_detalles = $sql_detalle2->execute();
      }

      if (!$resultados_detalles) {
        throw new Exception("Error al insertar en la tabla de trazabilidad.", 1);
      }

      /* Insertar en la tabla de actividades dependiente */
      $resultados_insert_actividad_dependiente = true;
      $estado_depedencia = 'Activo';
      $Proceso = 'Pedido';
      foreach ($resultados_actividades as $key => $actividad_dependiente) {
        if ($actividad_dependiente['activdad_dependiente'] !== 0) {
          $sql_insert_actividad_dependiente = $this->_db3->prepare("INSERT INTO cmx_actividad_dependiente (numdoc_proceso,actividad,actividad_dependiente,estado_dependencia,proceso,usuario,fecha,hora,empresa_id)
          VALUES (:numdoc_proceso,:actividad,:actividad_dependiente,:estado_dependencia,:proceso,:usuario,CURDATE(),DATE_SUB(CURTIME(), INTERVAL 5 HOUR),:empresa_id)");
          $sql_insert_actividad_dependiente->bindParam(':numdoc_proceso', $numdoc, PDO::PARAM_STR);
          $sql_insert_actividad_dependiente->bindParam(':actividad', $actividad_dependiente['detalle_actividad_plantilla'], PDO::PARAM_STR);
          $sql_insert_actividad_dependiente->bindParam(':actividad_dependiente', $actividad_dependiente['activdad_dependiente'], PDO::PARAM_STR);
          $sql_insert_actividad_dependiente->bindParam(':estado_dependencia', $estado_depedencia, type: PDO::PARAM_STR);
          $sql_insert_actividad_dependiente->bindParam(':proceso', $Proceso, PDO::PARAM_STR);
          $sql_insert_actividad_dependiente->bindParam(':usuario', $user, PDO::PARAM_STR);
          $sql_insert_actividad_dependiente->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
          $resultados_insert_actividad_dependiente = $sql_insert_actividad_dependiente->execute();
        }
      }

      if (!$resultados_insert_actividad_dependiente) {
        throw new Exception("Error al insertar en la tabla de actividades dependientes.", 1);
      }

      foreach ($solicitudes as $key => $value) {
        $proveedor_id = $value['proveedor_id'];
        if (!isset($proveedores_recorridosActividad1[$proveedor_id])) {
          $sql_actividades_visualizar = $this->_db3->prepare("SELECT
              pav.usuario_visualizar,pav.actividad_visualizar
            FROM
              cmx_plantilla p
            INNER JOIN cmx_plantilla_actividades_visualizar pav ON p.numdoc=pav.numdoc_plantilla
            WHERE
              p.proveedor_id =:proveedor_id AND p.modalidad=:modalidad AND p.estado_plantilla='ACTIVA'");
          $sql_actividades_visualizar->bindParam(':proveedor_id', $proveedor_id);
          $sql_actividades_visualizar->bindParam(':modalidad', $Modalidad);
          $sql_actividades_visualizar->execute();
          $resultados_actividades_visualizar = $sql_actividades_visualizar->fetchAll(PDO::FETCH_ASSOC);

          // Marcar este proveedor como procesado
          $proveedores_recorridosActividad1[$proveedor_id] = true;
        }
      }

      /* Insertar en la tabla de actividades dependiente */
      $resultados_insertar_activiadades_visualizar = true;
      foreach ($resultados_actividades_visualizar as $key => $actividades) {
        $sql_insertar_activiadades_visualizar = $this->_db3->prepare("INSERT INTO cmx_pedido_actividades_visualizar(numdoc_pedido,usuario_visualizar,actividad_visualizar,usuario,fecha,hora)
        VALUES(:numdoc_pedido,:usuario_visualizar,:actividad_visualizar,:usuario,:fecha,:hora)");
        $sql_insertar_activiadades_visualizar->bindParam(':numdoc_pedido', $numdoc, PDO::PARAM_STR);
        $sql_insertar_activiadades_visualizar->bindParam(':usuario_visualizar', $actividades['usuario_visualizar'], PDO::PARAM_STR);
        $sql_insertar_activiadades_visualizar->bindParam(':actividad_visualizar', $actividades['actividad_visualizar'], PDO::PARAM_STR);
        $sql_insertar_activiadades_visualizar->bindParam(':usuario', $user, PDO::PARAM_STR);
        $sql_insertar_activiadades_visualizar->bindParam(':fecha', $fecha, PDO::PARAM_STR);
        $sql_insertar_activiadades_visualizar->bindParam(':hora', $hora, PDO::PARAM_STR);
        $resultados_insertar_activiadades_visualizar = $sql_insertar_activiadades_visualizar->execute();
      }

      if (!$resultados_insertar_activiadades_visualizar) {
        throw new Exception("Error al insertar en la tabla de actividades dependientes.", 1);
      }

      /* Actualizar el campo pedido plantilla para gestionar los pedidos */
      $sql_update_recurso_pedido = $this->_db3->prepare("UPDATE cmx_recurso_pedido SET pedido_plantilla='SI' WHERE maestro_id=:maestroId AND cliente_id=:clienteId");
      $sql_update_recurso_pedido->bindParam(':maestroId', $MaestroId, PDO::PARAM_INT);
      $sql_update_recurso_pedido->bindParam(':clienteId', $ClienteId, PDO::PARAM_INT);
      $sql_update_recurso_pedido->execute();

      if (!$sql_update_recurso_pedido) {
        throw new Exception("Error al actualiar el campo pedido plantilla del pedidos.", 1);
      }

      return ['success' => true, 'message' => 'Pedido subastado correctamente.'];
    } catch (\Throwable $th) {
      // $this->_db3->rollBack();
      return ['success' => false, 'message' => 'Error al subastar el pedido.'];
      //throw $th;
    }
  }

  /* Funcion para calcular el tiempo de vencimiento de la actividad */
  public function calcularTiempoVencimiento($MaestroId)
  {
    $sql = $this->_db3->prepare("
    SELECT 
        dt.posicion,
        t.nombre_tipo,
        tt.nombre_opcion,
        u.nom_usuario,
        dt.fecha_inicio,
        dt.hora_inicio,
        dt.estado_actividad,
        t.id AS proceso_id,
        tt.id AS actividad_id,
        dt.detalle_proceso AS num_proceso,
        da.actividad AS actividad,
        da.actividad_dependiente,
        dt.costo_actividad,
        tp.numdoc,
        CONCAT(dt.fecha_base, ' ', dt.hora_base) AS fecha_base,
        dt.valor_minutos,
        dt.dependiente,
        dt.criterio_calculo,
        dt.tiempo_transcurrido,
        dt.detalle_actividad,
        dt.medida_tiempo
    FROM cmx_detalle_opcion_trazabilidad dt
    INNER JOIN cmx_trazabilidad_proceso tp ON tp.numdoc = dt.numdoc_detalle_opcion
    INNER JOIN cmx_tipo_opcion_trazabilidad tt ON tt.id = dt.detalle_proceso
    INNER JOIN cmx_tipo_trazabilidad t ON t.id = tt.tipo_trazabilidad
    INNER JOIN cmx_usuarios u ON u.id = dt.usuario_responsable
    LEFT JOIN cmx_actividad_dependiente da ON dt.detalle_proceso = da.actividad
    AND da.proceso='Pedido' AND tp.numdoc=da.numdoc_proceso
    WHERE tp.recurso_id = :recurso_id
    GROUP BY dt.posicion
    ORDER BY dt.posicion ASC");
    $sql->bindParam(':recurso_id', $MaestroId, PDO::PARAM_STR);
    $sql->execute();
    $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
    $idsGenerados = [];
    // Zona horaria de Colombia
    date_default_timezone_set('America/Bogota');

    // Obtener la hora actual
    $now = new DateTime();

    // Obtener la fecha de hoy en formato Y-m-d
    $today = $now->format('Y-m-d');

    // Crear los objetos DateTime con fecha de hoy y hora especÃ­fica
    $start = new DateTime("$today 06:00:00");
    $end = new DateTime("$today 18:00:00");

    foreach ($resultados as $value) {
      try {
        $ValorTiempo = (int) $value['valor_minutos'];
        $inicio = new DateTime($value['fecha_inicio'] . ' ' . $value['hora_inicio'], new DateTimeZone('America/Bogota'));
        $ahora = new DateTime('now', new DateTimeZone('America/Bogota'));

        $diferenciaAhora = $inicio->diff($ahora);
        $tiempoTranscurridoActual = ($diferenciaAhora->days * 24 * 60) + ($diferenciaAhora->h * 60) + $diferenciaAhora->i;
        $resultadoActividadDependiente = null;

        /* Verificar los criterios de calculo para las fechas de vencimiento */
        if ($value['criterio_calculo'] == 1) { // Fecha Inicial
          // Consultar las fechas de subasta del recurso
          $sqlFechaSubasta = $this->_db3->prepare("SELECT STR_TO_DATE(CONCAT(fecha, ' ', hora), '%Y-%m-%d %H:%i:%s') AS fecha_subasta 
                                                          FROM cmx_subasta_torre_control WHERE recurso_id = :RecursoId");
          $sqlFechaSubasta->bindParam(":RecursoId", $MaestroId, PDO::PARAM_INT);
          $sqlFechaSubasta->execute();
          $resultadoFechaSubasta = $sqlFechaSubasta->fetch(PDO::FETCH_ASSOC);

          if ($resultadoFechaSubasta) {
            // Convertir la fecha de subasta a un objeto DateTime
            $fechaSubasta = new DateTime($resultadoFechaSubasta['fecha_subasta'], new DateTimeZone('America/Bogota'));
            $fechaBaseActividad = $fechaSubasta->format('Y-m-d');
            $horaBaseActividad = $fechaSubasta->format('H:i:s');

            /* Actualziar Fecha Base */
            $sqlUpdateFechaBase = $this->_db3->prepare("UPDATE cmx_detalle_opcion_trazabilidad SET fecha_base =:fecha_base, hora_base =:hora_base
                WHERE detalle_proceso = :id AND numdoc_detalle_opcion = :numdoc AND fecha_base IS NULL AND hora_base IS NULL");
            $sqlUpdateFechaBase->bindParam(':fecha_base', $fechaBaseActividad, PDO::PARAM_STR);
            $sqlUpdateFechaBase->bindParam(':hora_base', $horaBaseActividad, PDO::PARAM_STR);
            $sqlUpdateFechaBase->bindParam(':id', $value['num_proceso'], PDO::PARAM_INT);
            $sqlUpdateFechaBase->bindParam(':numdoc', $value['numdoc'], PDO::PARAM_STR);
            $sqlUpdateFechaBase->execute();

            // Calcular la fecha de vencimiento segÃºn la medida de tiempo
            switch ($value['medida_tiempo']) {

              case '1': // Minutos
                $FechaBaseVencimiento = clone $fechaSubasta;

                if ($ValorTiempo >= 0) {
                  $FechaBaseVencimiento->add(new DateInterval("PT{$ValorTiempo}M")); // Suma los minutos
                } else {
                  $ValorAbsoluto = abs($ValorTiempo);
                  $FechaBaseVencimiento->sub(new DateInterval("PT{$ValorAbsoluto}M")); // Suma los minutos en negativo
                }

                // Mantener fecha vencimiento como DateTime
                $fechaVencimiento = clone $FechaBaseVencimiento;

                // Verificar si hay cambio en el tiempo transcurrido
                if (empty($value['fecha_inicio']) && empty($value['hora_inicio'])) {
                  if ($fechaVencimiento > $end) {
                    // Calcular la diferencia que se pasa del horario
                    $intervalo = $end->diff($fechaVencimiento);

                    // Crear nueva fecha base: dÃ­a siguiente a las 06:00
                    $siguienteDia = new DateTime("$today 06:00:00");
                    $siguienteDia->modify('+1 day');

                    // Aplicar el intervalo a la nueva fecha
                    $nuevaFechaVencimiento = clone $siguienteDia;
                    $nuevaFechaVencimiento->add($intervalo);

                    // Guardar nueva fecha/hora para la base de datos
                    $fecha_vencimiento = $nuevaFechaVencimiento->format('Y-m-d');
                    $hora_vencimiento = $nuevaFechaVencimiento->format('H:i:s');
                  } else {
                    // Fecha dentro del horario: usar la original
                    $fecha_vencimiento = $FechaBaseVencimiento->format('Y-m-d');
                    $hora_vencimiento = $FechaBaseVencimiento->format('H:i:s');
                  }

                  // Actualizar en la base de datos
                  $sqlUpdate = $this->_db3->prepare("UPDATE cmx_detalle_opcion_trazabilidad  
                  SET fecha_inicio = :fecha_vencimiento, hora_inicio = :hora_vencimiento
                  WHERE detalle_proceso = :id AND numdoc_detalle_opcion = :numdoc");
                  $sqlUpdate->bindParam(':fecha_vencimiento', $fecha_vencimiento, PDO::PARAM_STR);
                  $sqlUpdate->bindParam(':hora_vencimiento', $hora_vencimiento, PDO::PARAM_STR);
                  // $sqlUpdate->bindParam(':tiempo_transcurrido', $tiempoTranscurridoSubasta, PDO::PARAM_INT);
                  $sqlUpdate->bindParam(':id', $value['num_proceso'], PDO::PARAM_INT);
                  $sqlUpdate->bindParam(':numdoc', $value['numdoc'], PDO::PARAM_STR);
                  $sqlUpdate->execute();
                }

                break;

              case '2': // Horas
                $horas = $value['valor_tiempo'] ?? 0;
                $FechaBaseVencimiento = clone $fechaSubasta;
                $FechaBaseVencimiento->add(new DateInterval("PT{$horas}H")); // Suma las horas
                // Asegurar que $fechaVencimiento sea objeto DateTime
                $fechaVencimiento = clone $FechaBaseVencimiento;

                if ($fechaVencimiento > $end) {
                  // Calcular exceso de tiempo
                  $intervalo = $end->diff($fechaVencimiento);

                  // DÃ­a siguiente a las 06:00
                  $siguienteDia = new DateTime("$today 06:00:00");
                  $siguienteDia->modify('+1 day');

                  // Sumar el intervalo excedido
                  $nuevaFechaVencimiento = clone $siguienteDia;
                  $nuevaFechaVencimiento->add($intervalo);

                  // Asignar valores para guardar en BD
                  $fecha_vencimiento = $nuevaFechaVencimiento->format('Y-m-d');
                  $hora_vencimiento = $nuevaFechaVencimiento->format('H:i:s');
                } else {
                  // EstÃ¡ dentro del horario permitido
                  $fecha_vencimiento = $fechaVencimiento->format('Y-m-d');
                  $hora_vencimiento = $fechaVencimiento->format('H:i:s');
                }

                // Actualizar si hay cambio y actividad no estÃ¡ completada
                if (empty($value['fecha_inicio']) && empty($value['hora_inicio'])) {
                  $sqlUpdate = $this->_db3->prepare("
                          UPDATE cmx_detalle_opcion_trazabilidad 
                          SET fecha_inicio = :fecha_vencimiento, hora_inicio = :hora_vencimiento
                          WHERE detalle_proceso = :id AND numdoc_detalle_opcion = :numdoc
                    ");

                  $sqlUpdate->bindParam(':fecha_vencimiento', $fecha_vencimiento, PDO::PARAM_STR);
                  $sqlUpdate->bindParam(':hora_vencimiento', $hora_vencimiento, PDO::PARAM_STR);
                  // $sqlUpdate->bindParam(':tiempo_transcurrido', $horasTotalesEnteras, PDO::PARAM_INT);
                  $sqlUpdate->bindParam(':id', $value['num_proceso'], PDO::PARAM_INT);
                  $sqlUpdate->bindParam(':numdoc', $value['numdoc'], PDO::PARAM_STR);

                  $sqlUpdate->execute();
                }
                break;

              case '3':  // DÃ­as
                $dias = $value['valor_tiempo'] ?? 0;
                $FechaBaseVencimiento = clone $fechaSubasta;
                $FechaBaseVencimiento->add(new DateInterval("P{$dias}D")); // Suma los dÃ­as

                // Asegurarse que fechaVencimiento es un DateTime vÃ¡lido
                $fechaVencimiento = clone $FechaBaseVencimiento;

                // Definir horario de corte del dÃ­a actual
                $today = $ahora->format('Y-m-d');
                $end = new DateTime("$today 18:00:00");

                if ($fechaVencimiento > $end) {
                  // Calcular el tiempo que excede despuÃ©s de las 18:00
                  $intervalo = $end->diff($fechaVencimiento);

                  // Ir al siguiente dÃ­a a las 06:00
                  $siguienteDia = new DateTime("$today 06:00:00");
                  $siguienteDia->modify('+1 day');

                  // Sumar el exceso al siguiente dÃ­a
                  $nuevaFechaVencimiento = clone $siguienteDia;
                  $nuevaFechaVencimiento->add($intervalo);

                  // Usar fecha ajustada
                  $fecha_vencimiento = $nuevaFechaVencimiento->format('Y-m-d');
                  $hora_vencimiento = $nuevaFechaVencimiento->format('H:i:s');
                } else {
                  // Fecha dentro del horario
                  $fecha_vencimiento = $fechaVencimiento->format('Y-m-d');
                  $hora_vencimiento = $fechaVencimiento->format('H:i:s');
                }

                // Actualizar base de datos si hubo cambio y la actividad no estÃ¡ completada
                if (empty($value['fecha_inicio']) && empty($value['hora_inicio'])) {
                  $sqlUpdate = $this->_db3->prepare("UPDATE cmx_detalle_opcion_trazabilidad 
                      SET fecha_inicio = :fecha_vencimiento, hora_inicio = :hora_vencimiento
                      WHERE detalle_proceso = :id AND numdoc_detalle_opcion = :numdoc");
                  $sqlUpdate->bindParam(':fecha_vencimiento', $fecha_vencimiento, PDO::PARAM_STR);
                  $sqlUpdate->bindParam(':hora_vencimiento', $hora_vencimiento, PDO::PARAM_STR);
                  // $sqlUpdate->bindParam(':tiempo_transcurrido', $diasTranscurridosEnteros, PDO::PARAM_INT);
                  $sqlUpdate->bindParam(':id', $value['num_proceso'], PDO::PARAM_INT);
                  $sqlUpdate->bindParam(':numdoc', $value['numdoc'], PDO::PARAM_STR);

                  $sqlUpdate->execute();
                }

                break;

              default:
                # code...
                break;
            }
          } else {
            echo "No se encontrÃ³ fecha de subasta para el recurso ID: " . $MaestroId;
          }
        } elseif ($value['criterio_calculo'] == 2) { // Fecha Cargue
          $sqlFechaCargue = $this->_db3->prepare("
            SELECT STR_TO_DATE(CONCAT(pt.fecha_cargue, ' ', pt.hora_cargue), '%Y-%m-%d %H:%i:%s') AS fecha_cargue 
            FROM cmx_pedido_torre_control pt
            INNER JOIN cmx_cliente_proveedor_servicio cps ON pt.numdoc_solicitud=cps.pedido_id
            WHERE cps.recurso_id= :RecursoId
          ");
          $sqlFechaCargue->bindParam(":RecursoId", $MaestroId, PDO::PARAM_INT);
          $sqlFechaCargue->execute();
          $resultadoFechaCargue = $sqlFechaCargue->fetch(PDO::FETCH_ASSOC);
          if ($resultadoFechaCargue) {
            // Convertir la fecha de subasta a un objeto DateTime
            $fechaCargue = new DateTime($resultadoFechaCargue['fecha_cargue'], new DateTimeZone('America/Bogota'));
            $fechaBaseActividad = $fechaCargue->format('Y-m-d');
            $horaBaseActividad = $fechaCargue->format('H:i:s');

            /* Actualziar Fecha Base */
            $sqlUpdateFechaBase = $this->_db3->prepare("UPDATE cmx_detalle_opcion_trazabilidad 
                SET fecha_base = :fecha_base, hora_base = :hora_base
                WHERE detalle_proceso = :id AND numdoc_detalle_opcion = :numdoc AND fecha_base IS NULL AND hora_base IS NULL
            ");
            $sqlUpdateFechaBase->bindParam(':fecha_base', $fechaBaseActividad, PDO::PARAM_STR);
            $sqlUpdateFechaBase->bindParam(':hora_base', $horaBaseActividad, PDO::PARAM_STR);
            $sqlUpdateFechaBase->bindParam(':id', $value['num_proceso'], PDO::PARAM_INT);
            $sqlUpdateFechaBase->bindParam(':numdoc', $value['numdoc'], PDO::PARAM_STR);
            $sqlUpdateFechaBase->execute();

            // Calcular la fecha de vencimiento segÃºn la medida de tiempo
            switch ($value['medida_tiempo']) {

              case '1': // Minutos
                $FechaBaseVencimiento = clone $fechaCargue;

                if ($ValorTiempo >= 0) {
                  $FechaBaseVencimiento->add(new DateInterval("PT{$ValorTiempo}M")); // Suma los minutos
                } else {
                  $ValorAbsoluto = abs($ValorTiempo);
                  $FechaBaseVencimiento->sub(new DateInterval("PT{$ValorAbsoluto}M")); // Suma los minutos en negativo
                }

                // Mantener fecha vencimiento como DateTime
                $fechaVencimiento = clone $FechaBaseVencimiento;

                // Verificar si hay cambio en el tiempo transcurrido
                if (empty($value['fecha_inicio']) && empty($value['hora_inicio'])) {
                  if ($fechaVencimiento > $end) {
                    // Calcular la diferencia que se pasa del horario
                    $intervalo = $end->diff($fechaVencimiento);

                    // Crear nueva fecha base: dÃ­a siguiente a las 06:00
                    $siguienteDia = new DateTime("$today 06:00:00");
                    $siguienteDia->modify('+1 day');

                    // Aplicar el intervalo a la nueva fecha
                    $nuevaFechaVencimiento = clone $siguienteDia;
                    $nuevaFechaVencimiento->add($intervalo);

                    // Guardar nueva fecha/hora para la base de datos
                    $fecha_vencimiento = $nuevaFechaVencimiento->format('Y-m-d');
                    $hora_vencimiento = $nuevaFechaVencimiento->format('H:i:s');
                  } else {
                    // Fecha dentro del horario: usar la original
                    $fecha_vencimiento = $FechaBaseVencimiento->format('Y-m-d');
                    $hora_vencimiento = $FechaBaseVencimiento->format('H:i:s');
                  }

                  // Actualizar en la base de datos
                  $sqlUpdate = $this->_db3->prepare("UPDATE cmx_detalle_opcion_trazabilidad  
                  SET fecha_inicio = :fecha_vencimiento, hora_inicio = :hora_vencimiento
                  WHERE detalle_proceso = :id AND numdoc_detalle_opcion = :numdoc");
                  $sqlUpdate->bindParam(':fecha_vencimiento', $fecha_vencimiento, PDO::PARAM_STR);
                  $sqlUpdate->bindParam(':hora_vencimiento', $hora_vencimiento, PDO::PARAM_STR);
                  // $sqlUpdate->bindParam(':tiempo_transcurrido', $tiempoTranscurridoSubasta, PDO::PARAM_INT);
                  $sqlUpdate->bindParam(':id', $value['num_proceso'], PDO::PARAM_INT);
                  $sqlUpdate->bindParam(':numdoc', $value['numdoc'], PDO::PARAM_STR);
                  $sqlUpdate->execute();
                }

                break;

              case '2': // Horas
                $horas = $value['valor_tiempo'] ?? 0;
                $FechaBaseVencimiento = clone $fechaCargue;
                $FechaBaseVencimiento->add(new DateInterval("PT{$horas}H")); // Suma las horas
                // Asegurar que $fechaVencimiento sea objeto DateTime
                $fechaVencimiento = clone $FechaBaseVencimiento;

                if ($fechaVencimiento > $end) {
                  // Calcular exceso de tiempo
                  $intervalo = $end->diff($fechaVencimiento);

                  // DÃ­a siguiente a las 06:00
                  $siguienteDia = new DateTime("$today 06:00:00");
                  $siguienteDia->modify('+1 day');

                  // Sumar el intervalo excedido
                  $nuevaFechaVencimiento = clone $siguienteDia;
                  $nuevaFechaVencimiento->add($intervalo);

                  // Asignar valores para guardar en BD
                  $fecha_vencimiento = $nuevaFechaVencimiento->format('Y-m-d');
                  $hora_vencimiento = $nuevaFechaVencimiento->format('H:i:s');
                } else {
                  // EstÃ¡ dentro del horario permitido
                  $fecha_vencimiento = $fechaVencimiento->format('Y-m-d');
                  $hora_vencimiento = $fechaVencimiento->format('H:i:s');
                }

                // Actualizar si hay cambio y actividad no estÃ¡ completada
                if (empty($value['fecha_inicio']) && empty($value['hora_inicio'])) {
                  $sqlUpdate = $this->_db3->prepare("
                          UPDATE cmx_detalle_opcion_trazabilidad 
                          SET fecha_inicio = :fecha_vencimiento, hora_inicio = :hora_vencimiento
                          WHERE detalle_proceso = :id AND numdoc_detalle_opcion = :numdoc
                    ");

                  $sqlUpdate->bindParam(':fecha_vencimiento', $fecha_vencimiento, PDO::PARAM_STR);
                  $sqlUpdate->bindParam(':hora_vencimiento', $hora_vencimiento, PDO::PARAM_STR);
                  // $sqlUpdate->bindParam(':tiempo_transcurrido', $horasTotalesEnteras, PDO::PARAM_INT);
                  $sqlUpdate->bindParam(':id', $value['num_proceso'], PDO::PARAM_INT);
                  $sqlUpdate->bindParam(':numdoc', $value['numdoc'], PDO::PARAM_STR);

                  $sqlUpdate->execute();
                }
                break;

              case '3':  // DÃ­as
                $dias = $value['valor_tiempo'] ?? 0;
                $FechaBaseVencimiento = clone $fechaCargue;
                $FechaBaseVencimiento->add(new DateInterval("P{$dias}D")); // Suma los dÃ­as

                // Asegurarse que fechaVencimiento es un DateTime vÃ¡lido
                $fechaVencimiento = clone $FechaBaseVencimiento;

                // Definir horario de corte del dÃ­a actual
                $today = $ahora->format('Y-m-d');
                $end = new DateTime("$today 18:00:00");

                if ($fechaVencimiento > $end) {
                  // Calcular el tiempo que excede despuÃ©s de las 18:00
                  $intervalo = $end->diff($fechaVencimiento);

                  // Ir al siguiente dÃ­a a las 06:00
                  $siguienteDia = new DateTime("$today 06:00:00");
                  $siguienteDia->modify('+1 day');

                  // Sumar el exceso al siguiente dÃ­a
                  $nuevaFechaVencimiento = clone $siguienteDia;
                  $nuevaFechaVencimiento->add($intervalo);

                  // Usar fecha ajustada
                  $fecha_vencimiento = $nuevaFechaVencimiento->format('Y-m-d');
                  $hora_vencimiento = $nuevaFechaVencimiento->format('H:i:s');
                } else {
                  // Fecha dentro del horario
                  $fecha_vencimiento = $fechaVencimiento->format('Y-m-d');
                  $hora_vencimiento = $fechaVencimiento->format('H:i:s');
                }

                // Actualizar base de datos si hubo cambio y la actividad no estÃ¡ completada
                if (empty($value['fecha_inicio']) && empty($value['hora_inicio'])) {
                  $sqlUpdate = $this->_db3->prepare("UPDATE cmx_detalle_opcion_trazabilidad 
                      SET fecha_inicio = :fecha_vencimiento, hora_inicio = :hora_vencimiento
                      WHERE detalle_proceso = :id AND numdoc_detalle_opcion = :numdoc");
                  $sqlUpdate->bindParam(':fecha_vencimiento', $fecha_vencimiento, PDO::PARAM_STR);
                  $sqlUpdate->bindParam(':hora_vencimiento', $hora_vencimiento, PDO::PARAM_STR);
                  // $sqlUpdate->bindParam(':tiempo_transcurrido', $diasTranscurridosEnteros, PDO::PARAM_INT);
                  $sqlUpdate->bindParam(':id', $value['num_proceso'], PDO::PARAM_INT);
                  $sqlUpdate->bindParam(':numdoc', $value['numdoc'], PDO::PARAM_STR);

                  $sqlUpdate->execute();
                }

                break;

              default:
                # code...
                break;
            }
          } else {
            echo "No se encontrÃ³ fecha de subasta para el recurso ID: " . $MaestroId;
          }
        } elseif ($value['criterio_calculo'] == 3) { // Fecha Descargue
          $sqlFechaDescargue = $this->_db3->prepare("
            SELECT STR_TO_DATE(CONCAT(pt.fecha_entrega, ' ', pt.hora_entrega), '%Y-%m-%d %H:%i:%s') AS fecha_descargue 
            FROM cmx_pedido_torre_control pt
            INNER JOIN cmx_cliente_proveedor_servicio cps ON pt.numdoc_solicitud=cps.pedido_id
            WHERE cps.recurso_id=:RecursoId
          ");
          $sqlFechaDescargue->bindParam(":RecursoId", $MaestroId, PDO::PARAM_INT);
          $sqlFechaDescargue->execute();
          $resultadoFechaDescargue = $sqlFechaDescargue->fetch(PDO::FETCH_ASSOC);
          if ($resultadoFechaDescargue) {
            // Convertir la fecha de subasta a un objeto DateTime
            $fechaDescargue = new DateTime($resultadoFechaDescargue['fecha_descargue'], new DateTimeZone('America/Bogota'));
            $fechaBaseActividad = $fechaDescargue->format('Y-m-d');
            $horaBaseActividad = $fechaDescargue->format('H:i:s');

            /* Actualziar Fecha Base */
            $sqlUpdateFechaBase = $this->_db3->prepare("UPDATE cmx_detalle_opcion_trazabilidad 
                SET fecha_base = :fecha_base, hora_base = :hora_base
                WHERE detalle_proceso = :id AND numdoc_detalle_opcion = :numdoc AND fecha_base IS NULL AND hora_base IS NULL
            ");
            $sqlUpdateFechaBase->bindParam(':fecha_base', $fechaBaseActividad, PDO::PARAM_STR);
            $sqlUpdateFechaBase->bindParam(':hora_base', $horaBaseActividad, PDO::PARAM_STR);
            $sqlUpdateFechaBase->bindParam(':id', $value['num_proceso'], PDO::PARAM_INT);
            $sqlUpdateFechaBase->bindParam(':numdoc', $value['numdoc'], PDO::PARAM_STR);
            $sqlUpdateFechaBase->execute();

            // Calcular la fecha de vencimiento segÃºn la medida de tiempo
            switch ($value['medida_tiempo']) {

              case '1': // Minutos
                $FechaBaseVencimiento = clone $fechaDescargue;

                if ($ValorTiempo >= 0) {
                  $FechaBaseVencimiento->add(new DateInterval("PT{$ValorTiempo}M")); // Suma los minutos
                } else {
                  $ValorAbsoluto = abs($ValorTiempo);
                  $FechaBaseVencimiento->sub(new DateInterval("PT{$ValorAbsoluto}M")); // Suma los minutos en negativo
                }

                // Mantener fecha vencimiento como DateTime
                $fechaVencimiento = clone $FechaBaseVencimiento;

                // Verificar si hay cambio en el tiempo transcurrido
                if (empty($value['fecha_inicio']) && empty($value['hora_inicio'])) {
                  if ($fechaVencimiento > $end) {
                    // Calcular la diferencia que se pasa del horario
                    $intervalo = $end->diff($fechaVencimiento);

                    // Crear nueva fecha base: dÃ­a siguiente a las 06:00
                    $siguienteDia = new DateTime("$today 06:00:00");
                    $siguienteDia->modify('+1 day');

                    // Aplicar el intervalo a la nueva fecha
                    $nuevaFechaVencimiento = clone $siguienteDia;
                    $nuevaFechaVencimiento->add($intervalo);

                    // Guardar nueva fecha/hora para la base de datos
                    $fecha_vencimiento = $nuevaFechaVencimiento->format('Y-m-d');
                    $hora_vencimiento = $nuevaFechaVencimiento->format('H:i:s');
                  } else {
                    // Fecha dentro del horario: usar la original
                    $fecha_vencimiento = $FechaBaseVencimiento->format('Y-m-d');
                    $hora_vencimiento = $FechaBaseVencimiento->format('H:i:s');
                  }

                  // Actualizar en la base de datos
                  $sqlUpdate = $this->_db3->prepare("UPDATE cmx_detalle_opcion_trazabilidad  
                  SET fecha_inicio = :fecha_vencimiento, hora_inicio = :hora_vencimiento
                  WHERE detalle_proceso = :id AND numdoc_detalle_opcion = :numdoc");
                  $sqlUpdate->bindParam(':fecha_vencimiento', $fecha_vencimiento, PDO::PARAM_STR);
                  $sqlUpdate->bindParam(':hora_vencimiento', $hora_vencimiento, PDO::PARAM_STR);
                  // $sqlUpdate->bindParam(':tiempo_transcurrido', $tiempoTranscurridoSubasta, PDO::PARAM_INT);
                  $sqlUpdate->bindParam(':id', $value['num_proceso'], PDO::PARAM_INT);
                  $sqlUpdate->bindParam(':numdoc', $value['numdoc'], PDO::PARAM_STR);
                  $sqlUpdate->execute();
                }

                break;

              case '2': // Horas
                $horas = $value['valor_tiempo'] ?? 0;
                $FechaBaseVencimiento = clone $fechaDescargue;
                $FechaBaseVencimiento->add(new DateInterval("PT{$horas}H")); // Suma las horas
                // Asegurar que $fechaVencimiento sea objeto DateTime
                $fechaVencimiento = clone $FechaBaseVencimiento;

                if ($fechaVencimiento > $end) {
                  // Calcular exceso de tiempo
                  $intervalo = $end->diff($fechaVencimiento);

                  // DÃ­a siguiente a las 06:00
                  $siguienteDia = new DateTime("$today 06:00:00");
                  $siguienteDia->modify('+1 day');

                  // Sumar el intervalo excedido
                  $nuevaFechaVencimiento = clone $siguienteDia;
                  $nuevaFechaVencimiento->add($intervalo);

                  // Asignar valores para guardar en BD
                  $fecha_vencimiento = $nuevaFechaVencimiento->format('Y-m-d');
                  $hora_vencimiento = $nuevaFechaVencimiento->format('H:i:s');
                } else {
                  // EstÃ¡ dentro del horario permitido
                  $fecha_vencimiento = $fechaVencimiento->format('Y-m-d');
                  $hora_vencimiento = $fechaVencimiento->format('H:i:s');
                }

                // Actualizar si hay cambio y actividad no estÃ¡ completada
                if (empty($value['fecha_inicio']) && empty($value['hora_inicio'])) {
                  $sqlUpdate = $this->_db3->prepare("
                          UPDATE cmx_detalle_opcion_trazabilidad 
                          SET fecha_inicio = :fecha_vencimiento, hora_inicio = :hora_vencimiento
                          WHERE detalle_proceso = :id AND numdoc_detalle_opcion = :numdoc
                    ");

                  $sqlUpdate->bindParam(':fecha_vencimiento', $fecha_vencimiento, PDO::PARAM_STR);
                  $sqlUpdate->bindParam(':hora_vencimiento', $hora_vencimiento, PDO::PARAM_STR);
                  // $sqlUpdate->bindParam(':tiempo_transcurrido', $horasTotalesEnteras, PDO::PARAM_INT);
                  $sqlUpdate->bindParam(':id', $value['num_proceso'], PDO::PARAM_INT);
                  $sqlUpdate->bindParam(':numdoc', $value['numdoc'], PDO::PARAM_STR);

                  $sqlUpdate->execute();
                }
                break;

              case '3':  // DÃ­as
                $dias = $value['valor_tiempo'] ?? 0;
                $FechaBaseVencimiento = clone $fechaDescargue;
                $FechaBaseVencimiento->add(new DateInterval("P{$dias}D")); // Suma los dÃ­as

                // Asegurarse que fechaVencimiento es un DateTime vÃ¡lido
                $fechaVencimiento = clone $FechaBaseVencimiento;

                // Definir horario de corte del dÃ­a actual
                $today = $ahora->format('Y-m-d');
                $end = new DateTime("$today 18:00:00");

                if ($fechaVencimiento > $end) {
                  // Calcular el tiempo que excede despuÃ©s de las 18:00
                  $intervalo = $end->diff($fechaVencimiento);

                  // Ir al siguiente dÃ­a a las 06:00
                  $siguienteDia = new DateTime("$today 06:00:00");
                  $siguienteDia->modify('+1 day');

                  // Sumar el exceso al siguiente dÃ­a
                  $nuevaFechaVencimiento = clone $siguienteDia;
                  $nuevaFechaVencimiento->add($intervalo);

                  // Usar fecha ajustada
                  $fecha_vencimiento = $nuevaFechaVencimiento->format('Y-m-d');
                  $hora_vencimiento = $nuevaFechaVencimiento->format('H:i:s');
                } else {
                  // Fecha dentro del horario
                  $fecha_vencimiento = $fechaVencimiento->format('Y-m-d');
                  $hora_vencimiento = $fechaVencimiento->format('H:i:s');
                }

                // Actualizar base de datos si hubo cambio y la actividad no estÃ¡ completada
                if (empty($value['fecha_inicio']) && empty($value['hora_inicio'])) {
                  $sqlUpdate = $this->_db3->prepare("UPDATE cmx_detalle_opcion_trazabilidad 
                      SET fecha_inicio = :fecha_vencimiento, hora_inicio = :hora_vencimiento
                      WHERE detalle_proceso = :id AND numdoc_detalle_opcion = :numdoc");
                  $sqlUpdate->bindParam(':fecha_vencimiento', $fecha_vencimiento, PDO::PARAM_STR);
                  $sqlUpdate->bindParam(':hora_vencimiento', $hora_vencimiento, PDO::PARAM_STR);
                  // $sqlUpdate->bindParam(':tiempo_transcurrido', $diasTranscurridosEnteros, PDO::PARAM_INT);
                  $sqlUpdate->bindParam(':id', $value['num_proceso'], PDO::PARAM_INT);
                  $sqlUpdate->bindParam(':numdoc', $value['numdoc'], PDO::PARAM_STR);

                  $sqlUpdate->execute();
                }

                break;

              default:
                # code...
                break;
            }
          } else {
            echo "No se encontrÃ³ fecha de subasta para el recurso ID: " . $MaestroId;
          }
        } elseif ($value['criterio_calculo'] == 4) { // Fechcha activa dependiente

          //Consultar las actividades dependientes para el recurso
          $sqlActividadDependiente = $this->_db3->prepare("
            SELECT tt.nombre_opcion AS nombre_actividad_dependiente,
              da.actividad_dependiente 
            FROM cmx_detalle_opcion_trazabilidad dt
            INNER JOIN cmx_trazabilidad_proceso tp ON tp.numdoc = dt.numdoc_detalle_opcion
            INNER JOIN cmx_tipo_opcion_trazabilidad tt ON tt.id = dt.detalle_proceso
            INNER JOIN cmx_actividad_dependiente da ON tt.id = da.actividad_dependiente AND da.proceso = 'Pedido'
            WHERE tp.recurso_id = :RecursoId AND da.actividad = :actividadId
          ");
          $sqlActividadDependiente->bindParam(":RecursoId", $MaestroId, PDO::PARAM_INT);
          $sqlActividadDependiente->bindParam(":actividadId", $value['actividad_id'], PDO::PARAM_INT);
          $sqlActividadDependiente->execute();
          $resultadoActividadDependiente = $sqlActividadDependiente->fetchAll(PDO::FETCH_ASSOC);

          //Consultar fechas de actividad dependiente para el recurso
          $sqlFechaActividadDependiente = $this->_db3->prepare("
            SELECT STR_TO_DATE(CONCAT(dot.fecha_base, ' ', dot.hora_base), '%Y-%m-%d %H:%i:%s') AS fecha_actividad_dependiente  
            FROM cmx_detalle_opcion_trazabilidad dot
            INNER JOIN cmx_actividad_dependiente ad ON dot.numdoc_detalle_opcion=ad.numdoc_proceso AND ad.proceso='Pedido'
            INNER JOIN cmx_trazabilidad_proceso tp ON dot.numdoc_detalle_opcion=tp.numdoc
            WHERE tp.recurso_id=:RecursoId AND dot.estado_actividad='COMPLETADO'
          ");
          $sqlFechaActividadDependiente->bindParam(":RecursoId", $MaestroId, PDO::PARAM_INT);
          $sqlFechaActividadDependiente->execute();
          $resultadoFechaActidadDependiente = $sqlFechaActividadDependiente->fetch(PDO::FETCH_ASSOC);

          if ($resultadoFechaActidadDependiente) {
            // Convertir la fecha de subasta a un objeto DateTime
            $fechaActividad = new DateTime($resultadoFechaActidadDependiente['fecha_actividad_dependiente'], new DateTimeZone('America/Bogota'));
            $fechaBaseActividad = $fechaActividad->format('Y-m-d');
            $horaBaseActividad = $fechaActividad->format('H:i:s');

            /* Actualziar Fecha Base */
            $sqlUpdateFechaBase = $this->_db3->prepare("UPDATE cmx_detalle_opcion_trazabilidad 
               SET fecha_base = :fecha_base, hora_base = :hora_base
               WHERE detalle_proceso = :id AND numdoc_detalle_opcion = :numdoc AND fecha_base IS NULL AND hora_base IS NULL");
            $sqlUpdateFechaBase->bindParam(':fecha_base', $fechaBaseActividad, PDO::PARAM_STR);
            $sqlUpdateFechaBase->bindParam(':hora_base', $horaBaseActividad, PDO::PARAM_STR);
            $sqlUpdateFechaBase->bindParam(':id', $value['num_proceso'], PDO::PARAM_INT);
            $sqlUpdateFechaBase->bindParam(':numdoc', $value['numdoc'], PDO::PARAM_STR);
            $sqlUpdateFechaBase->execute();

            // Calcular la fecha de vencimiento segÃºn la medida de tiempo
            switch ($value['medida_tiempo']) {

              case '1': // Minutos
                $FechaBaseVencimiento = clone $fechaActividad;

                if ($ValorTiempo >= 0) {
                  $FechaBaseVencimiento->add(new DateInterval("PT{$ValorTiempo}M")); // Suma los minutos
                } else {
                  $ValorAbsoluto = abs($ValorTiempo);
                  $FechaBaseVencimiento->sub(new DateInterval("PT{$ValorAbsoluto}M")); // Suma los minutos en negativo
                }

                // Mantener fecha vencimiento como DateTime
                $fechaVencimiento = clone $FechaBaseVencimiento;

                // Verificar si hay cambio en el tiempo transcurrido
                if (empty($value['fecha_inicio']) && empty($value['hora_inicio'])) {
                  if ($fechaVencimiento > $end) {
                    // Calcular la diferencia que se pasa del horario
                    $intervalo = $end->diff($fechaVencimiento);

                    // Crear nueva fecha base: dÃ­a siguiente a las 06:00
                    $siguienteDia = new DateTime("$today 06:00:00");
                    $siguienteDia->modify('+1 day');

                    // Aplicar el intervalo a la nueva fecha
                    $nuevaFechaVencimiento = clone $siguienteDia;
                    $nuevaFechaVencimiento->add($intervalo);

                    // Guardar nueva fecha/hora para la base de datos
                    $fecha_vencimiento = $nuevaFechaVencimiento->format('Y-m-d');
                    $hora_vencimiento = $nuevaFechaVencimiento->format('H:i:s');
                  } else {
                    // Fecha dentro del horario: usar la original
                    $fecha_vencimiento = $FechaBaseVencimiento->format('Y-m-d');
                    $hora_vencimiento = $FechaBaseVencimiento->format('H:i:s');
                  }

                  // Actualizar en la base de datos
                  $sqlUpdate = $this->_db3->prepare("UPDATE cmx_detalle_opcion_trazabilidad  
                  SET fecha_inicio = :fecha_vencimiento, hora_inicio = :hora_vencimiento
                  WHERE detalle_proceso = :id AND numdoc_detalle_opcion = :numdoc");
                  $sqlUpdate->bindParam(':fecha_vencimiento', $fecha_vencimiento, PDO::PARAM_STR);
                  $sqlUpdate->bindParam(':hora_vencimiento', $hora_vencimiento, PDO::PARAM_STR);
                  // $sqlUpdate->bindParam(':tiempo_transcurrido', $tiempoTranscurridoSubasta, PDO::PARAM_INT);
                  $sqlUpdate->bindParam(':id', $value['num_proceso'], PDO::PARAM_INT);
                  $sqlUpdate->bindParam(':numdoc', $value['numdoc'], PDO::PARAM_STR);
                  $sqlUpdate->execute();
                }

                break;

              case '2': // Horas
                $horas = $value['valor_tiempo'] ?? 0;
                $FechaBaseVencimiento = clone $fechaActividad;
                $FechaBaseVencimiento->add(new DateInterval("PT{$horas}H")); // Suma las horas
                // Asegurar que $fechaVencimiento sea objeto DateTime
                $fechaVencimiento = clone $FechaBaseVencimiento;

                if ($fechaVencimiento > $end) {
                  // Calcular exceso de tiempo
                  $intervalo = $end->diff($fechaVencimiento);

                  // DÃ­a siguiente a las 06:00
                  $siguienteDia = new DateTime("$today 06:00:00");
                  $siguienteDia->modify('+1 day');

                  // Sumar el intervalo excedido
                  $nuevaFechaVencimiento = clone $siguienteDia;
                  $nuevaFechaVencimiento->add($intervalo);

                  // Asignar valores para guardar en BD
                  $fecha_vencimiento = $nuevaFechaVencimiento->format('Y-m-d');
                  $hora_vencimiento = $nuevaFechaVencimiento->format('H:i:s');
                } else {
                  // EstÃ¡ dentro del horario permitido
                  $fecha_vencimiento = $fechaVencimiento->format('Y-m-d');
                  $hora_vencimiento = $fechaVencimiento->format('H:i:s');
                }

                // Actualizar si hay cambio y actividad no estÃ¡ completada
                if (empty($value['fecha_inicio']) && empty($value['hora_inicio'])) {
                  $sqlUpdate = $this->_db3->prepare("
                          UPDATE cmx_detalle_opcion_trazabilidad 
                          SET fecha_inicio = :fecha_vencimiento, hora_inicio = :hora_vencimiento
                          WHERE detalle_proceso = :id AND numdoc_detalle_opcion = :numdoc
                    ");

                  $sqlUpdate->bindParam(':fecha_vencimiento', $fecha_vencimiento, PDO::PARAM_STR);
                  $sqlUpdate->bindParam(':hora_vencimiento', $hora_vencimiento, PDO::PARAM_STR);
                  // $sqlUpdate->bindParam(':tiempo_transcurrido', $horasTotalesEnteras, PDO::PARAM_INT);
                  $sqlUpdate->bindParam(':id', $value['num_proceso'], PDO::PARAM_INT);
                  $sqlUpdate->bindParam(':numdoc', $value['numdoc'], PDO::PARAM_STR);

                  $sqlUpdate->execute();
                }
                break;

              case '3':  // DÃ­as
                $dias = $value['valor_tiempo'] ?? 0;
                $FechaBaseVencimiento = clone $fechaActividad;
                $FechaBaseVencimiento->add(new DateInterval("P{$dias}D")); // Suma los dÃ­as

                // Asegurarse que fechaVencimiento es un DateTime vÃ¡lido
                $fechaVencimiento = clone $FechaBaseVencimiento;

                // Definir horario de corte del dÃ­a actual
                $today = $ahora->format('Y-m-d');
                $end = new DateTime("$today 18:00:00");

                if ($fechaVencimiento > $end) {
                  // Calcular el tiempo que excede despuÃ©s de las 18:00
                  $intervalo = $end->diff($fechaVencimiento);

                  // Ir al siguiente dÃ­a a las 06:00
                  $siguienteDia = new DateTime("$today 06:00:00");
                  $siguienteDia->modify('+1 day');

                  // Sumar el exceso al siguiente dÃ­a
                  $nuevaFechaVencimiento = clone $siguienteDia;
                  $nuevaFechaVencimiento->add($intervalo);

                  // Usar fecha ajustada
                  $fecha_vencimiento = $nuevaFechaVencimiento->format('Y-m-d');
                  $hora_vencimiento = $nuevaFechaVencimiento->format('H:i:s');
                } else {
                  // Fecha dentro del horario
                  $fecha_vencimiento = $fechaVencimiento->format('Y-m-d');
                  $hora_vencimiento = $fechaVencimiento->format('H:i:s');
                }

                // Actualizar base de datos si hubo cambio y la actividad no estÃ¡ completada
                if (empty($value['fecha_inicio']) && empty($value['hora_inicio'])) {
                  $sqlUpdate = $this->_db3->prepare("UPDATE cmx_detalle_opcion_trazabilidad 
                      SET fecha_inicio = :fecha_vencimiento, hora_inicio = :hora_vencimiento
                      WHERE detalle_proceso = :id AND numdoc_detalle_opcion = :numdoc");
                  $sqlUpdate->bindParam(':fecha_vencimiento', $fecha_vencimiento, PDO::PARAM_STR);
                  $sqlUpdate->bindParam(':hora_vencimiento', $hora_vencimiento, PDO::PARAM_STR);
                  // $sqlUpdate->bindParam(':tiempo_transcurrido', $diasTranscurridosEnteros, PDO::PARAM_INT);
                  $sqlUpdate->bindParam(':id', $value['num_proceso'], PDO::PARAM_INT);
                  $sqlUpdate->bindParam(':numdoc', $value['numdoc'], PDO::PARAM_STR);

                  $sqlUpdate->execute();
                }

                break;

              default:
                # code...
                break;
            }
          }
        }
      } catch (Exception $e) {
        error_log("Error al calcular tiempos: " . $e->getMessage());
        continue;
      }
    }

    return ['success' => true, 'message' => 'Pedido subastado correctamente.'];
  }

  function convertirValorServicio($valor)
  {
    return (float) str_replace(',', '', $valor);
  }

  public function Listar_clientes()
  {
    try {
      $stmt = $this->_db3->prepare("SELECT * FROM cmx_clientes");
      $stmt->execute();
      return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
      $error = $e->getMessage();
      // $this->_db3->rollBack();
    }
  }

  /* Canelar asignacion de pedido */
  public function Cancelar_asignacion($pedido_id)
  {
    $asignacion = "Pendiente";
    $publicacion = "Pendiente";
    try {
      $stmt = $this->_db3->prepare("UPDATE cmx_pedido_torre_control SET estado_asignacion = :estado_asignacion, estado_publicaion = :estado_publicaion WHERE numdoc_solicitud = :pedido_id");
      $stmt->bindParam(':estado_asignacion', $asignacion, PDO::PARAM_STR);
      $stmt->bindParam(':estado_publicaion', $publicacion, PDO::PARAM_STR);
      $stmt->bindParam(':pedido_id', $pedido_id, PDO::PARAM_INT);
      $stmt->execute();
      // return true;

      return [
        'status' => true,
        'message' => 'Pedido iniciado correctamente.'
      ];
    } catch (PDOException $e) {
      $error = $e->getMessage();
      // $this->_db3->rollBack();
      return [
        'status' => false,
        'message' => $error
      ];
    }
  }

  public function Insertar_pedido_torre_control($mercancias, $cliente)
  {
    $session_empresa_id = $_SESSION['usuario']['empresa_id'];
    try {
      // Iniciar transacciÃ³n
      $this->_db3->beginTransaction();

      // Preparar la consulta de inserciÃ³n
      $sql_insert = "INSERT INTO cmx_pedido_torre_control 
              (cliente, numdoc_solicitud, referencia_pedido, ciudad_origen, remitente, 
              ciudad_destino, destinatario, cod_producto, producto, peso_neto_kg, 
              peso_bruto_kg, presentacion, unidades, lote, num_estibas, 
              fecha_cargue, fecha_entrega, usuario, fecha, hora) 
              VALUES 
              (:cliente, :numdoc_solicitud, :referencia_pedido, :ciudad_origen, :remitente, 
              :ciudad_destino, :destinatario, :cod_producto, :producto, :peso_neto_kg, 
              :peso_bruto_kg, :presentacion, :unidades, :lote, :num_estibas, 
              :fecha_cargue, :fecha_entrega, :usuario, CURDATE(), DATE_SUB(CURTIME(), INTERVAL 5 HOUR))";

      $stmt = $this->_db3->prepare($sql_insert);

      // Obtener el nÃºmero de elementos en los arrays
      $numElementos = count($mercancias['referencia_pedido']);

      // Validar que todos los arrays tengan la misma cantidad de elementos
      foreach ($mercancias as $key => $value) {
        if (count($value) !== $numElementos) {
          throw new Exception("Inconsistencia en la cantidad de elementos de '$key'");
        }
      }

      for ($i = 0; $i < $numElementos; $i++) {
        // 1. Obtener el nÃºmero actual de `cmx_maestro`
        $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro 
                    WHERE tipo='PEDIDOS_TORRE_CONTROL' 
                    AND numero_actual > numero_inicial 
                    AND empresa_id=:empresa_id 
                    FOR UPDATE");

        $sql_consecutivo->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
        $sql_consecutivo->execute();
        $resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);

        if (!$resultado_consecutivo) {
          throw new Exception("No se encontrÃ³ un nÃºmero de pedido vÃ¡lido.");
        }

        $numdoc_cabecera = $resultado_consecutivo['numero_actual'];
        $numdoc_actualizar_cabecera = $numdoc_cabecera + 1;

        // 2. Actualizar `numero_actual` en `cmx_maestro`
        $sql_update_maestro = $this->_db3->prepare("UPDATE cmx_maestro 
                    SET numero_actual=:numdoc_actualizar_cabecera 
                    WHERE tipo='PEDIDOS_TORRE_CONTROL' 
                    AND empresa_id=:empresa_id");

        $sql_update_maestro->bindParam(':numdoc_actualizar_cabecera', $numdoc_actualizar_cabecera, PDO::PARAM_INT);
        $sql_update_maestro->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
        $sql_update_maestro->execute();

        // 3. Insertar en `cmx_pedido_torre_control`
        $stmt->execute([
          ':cliente' => $cliente ?? NULL,
          ':numdoc_solicitud' => $numdoc_cabecera ?? NULL,
          ':referencia_pedido' => $mercancias['referencia_pedido'][$i] ?? NULL,
          ':ciudad_origen' => $mercancias['ciudad_origen'][$i] ?? NULL,
          ':remitente' => $mercancias['sitio_cargue'][$i] ?? NULL,
          ':ciudad_destino' => $mercancias['ciudad_destino'][$i] ?? NULL,
          ':destinatario' => $mercancias['sitio_descargue'][$i] ?? NULL,
          ':cod_producto' => $mercancias['cod_producto'][$i] ?? NULL,
          ':producto' => $mercancias['producto'][$i] ?? NULL,
          ':peso_neto_kg' => $mercancias['peso_neto'][$i] ?? NULL,
          ':peso_bruto_kg' => $mercancias['peso_bruto'][$i] ?? NULL,
          ':presentacion' => $mercancias['presentacion'][$i] ?? NULL,
          ':unidades' => $mercancias['unidades'][$i] ?? NULL,
          ':lote' => $mercancias['lote'][$i] ?? NULL,
          ':num_estibas' => $mercancias['num_estibas'][$i] ?? NULL,
          ':fecha_cargue' => $mercancias['fecha_cargue'][$i] ?? NULL,
          ':fecha_entrega' => $mercancias['fecha_entrega'][$i] ?? NULL,
          ':usuario' => $_SESSION['usuario_id'] ?? $_SESSION["usuario"]["nom_usuario"] // Usuario de sesiÃ³n o por defecto
        ]);
      }

      // Confirmar transacciÃ³n
      $this->_db3->commit();
      return ["success" => true, "message" => "Pedidos insertados correctamente"];
    } catch (Exception $e) {
      $this->_db3->rollBack();
      return ["success" => false, "message" => "Error al insertar: " . $e->getMessage()];
    }
  }

  public function Listar_recrusos_administrador($ventana, $proveedor_id, $fecha_inicial, $fecha_final, $valor, $filtro)
  {
    //Separacion por proveedor y ventanas
    $response = [];
    if (isset($ventana) && isset($proveedor_id)) {
      try {
        $stmt = $this->_db3->prepare("SELECT
            rp.maestro_id,
            CONCAT(rp.fecha, '-', rp.hora) AS fecha,
            rp.usuario,
            rp.estado,
            cl.nombre,
            cps.proceso,
            eht.estado_recurso,
            GROUP_CONCAT(DISTINCT pt.referencia_pedido ORDER BY pt.referencia_pedido SEPARATOR ', ') AS referencias_pedido,
            rp.pedido_plantilla,
            pt.modalidad,
            cps.serivicio_id,
            sf.estado_solicitud,
            sf.estado_aprobacion,
            cps.motivo_cancelacion
        FROM cmx_recurso_pedido rp
        INNER JOIN cmx_clientes cl ON cl.id = rp.cliente_id
        INNER JOIN cmx_cliente_proveedor_servicio cps ON rp.maestro_id = cps.recurso_id
        INNER JOIN cmx_estado_historico_recurso eht ON rp.maestro_id = eht.recurso_id 
            AND cps.proveedor_id = eht.proveedor_id AND eht.estado_actual = 1
        INNER JOIN cmx_pedido_torre_control pt ON cps.pedido_id = pt.numdoc_solicitud 
        LEFT JOIN cmx_seguimiento_facturacion_torre_control sf ON rp.maestro_id = sf.recurso_id  AND cps.proveedor_id = sf.proveedor_id

        WHERE cps.proveedor_id = :proveedor_id AND rp.fecha BETWEEN :fecha_inicio AND :fecha_final
        GROUP BY
            rp.maestro_id,
            rp.fecha,
            rp.hora,
            rp.usuario,
            rp.estado,
            cl.nombre,
            cps.proceso,
            eht.estado_recurso
        ORDER BY rp.maestro_id DESC");
        $stmt->bindParam(':proveedor_id', $proveedor_id);
        $stmt->bindParam(':fecha_inicio', $fecha_inicial);
        $stmt->bindParam(':fecha_final', $fecha_final);
        $stmt->execute();
        $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
      } catch (PDOException $e) {
        $error = $e->getMessage();
        // $this->_db3->rollBack();
      }
    } else {
      try {
        $whereExtra = '';
        $whereExtra_2 = '';
        $whereExtra_3 = '';
        $whereCliente = '';
        $params = [];

        if (!empty($valor)) {
          $whereExtra = " AND pt.modalidad = :valor";
          $params[':valor'] = $valor;
        }

        if (!empty($filtro) && $filtro !== 'undefined') {
          $whereExtra_2 = "HAVING referencias_pedido LIKE :referencias_pedido";
          $params[':referencias_pedido'] = "%$filtro%";
        } else {
          $whereExtra_3 = " WHERE rp.fecha BETWEEN :fecha_inicio AND :fecha_final";
          $params[':fecha_inicio'] = $fecha_inicial;
          $params[':fecha_final']  = $fecha_final;
        }

        // ======================================================
        // FILTRO POR CLIENTE (MISMA REGLA GLOBAL)
        // ======================================================
        if (
          isset($_SESSION['usuario']['id_perfil'], $_SESSION['usuario']['id_usuario']) &&
          $_SESSION['usuario']['id_perfil'] != 1 &&
          !in_array($_SESSION['usuario']['id_usuario'], [470], true)
        ) {
          $whereCliente = " AND pt.cliente = :cliente_session";
          $params[':cliente_session'] = $_SESSION['usuario']['id_cliente'];
        }

        $sql = "SELECT
            rp.maestro_id,
            CONCAT(rp.fecha, '-', rp.hora) AS fecha,
            rp.usuario,
            rp.estado,
            cl.nombre,
            cps.proceso,
            cl.id AS clienteId,
            GROUP_CONCAT(
                DISTINCT eht.estado_recurso
                ORDER BY eht.estado_recurso SEPARATOR ', '
            ) AS estados_recurso,
            GROUP_CONCAT(
                DISTINCT pt.referencia_pedido
                ORDER BY pt.referencia_pedido SEPARATOR ', '
            ) AS referencias_pedido,
            rp.pedido_plantilla,
            pt.modalidad,
            IFNULL(psd.fecha,'-') AS Fecha_Salida,
            cps.serivicio_id,
            cps.proveedor_id,
            cps.motivo_cancelacion
        FROM cmx_recurso_pedido rp
            INNER JOIN cmx_clientes cl ON cl.id = rp.cliente_id
            INNER JOIN cmx_cliente_proveedor_servicio cps ON rp.maestro_id = cps.recurso_id
            INNER JOIN cmx_estado_historico_recurso eht 
                ON rp.maestro_id = eht.recurso_id
                AND eht.estado_actual = 1
            INNER JOIN cmx_pedido_torre_control pt 
                ON cps.pedido_id = pt.numdoc_solicitud
            LEFT JOIN cmx_trazabilidad_proceso tp 
                ON rp.maestro_id = tp.recurso_id
            LEFT JOIN cmx_detalle_opcion_trazabilidad dot 
                ON tp.numdoc = dot.numdoc_detalle_opcion 
                AND dot.detalle_proceso = 107
            LEFT JOIN cmx_pedidos_solicitudes_detalles psd 
                ON dot.numdoc_detalle_opcion = psd.num_pedido
            $whereExtra_3
            $whereExtra
            $whereCliente
        GROUP BY
            rp.maestro_id,
            fecha,
            rp.usuario,
            rp.estado,
            cl.nombre,
            cps.proceso,
            clienteId
        $whereExtra_2";

        $stmt = $this->_db3->prepare($sql);
        foreach ($params as $key => $value) {
          $stmt->bindValue($key, $value);
        }
        $stmt->execute();
        $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
      } catch (PDOException $e) {
        $error = $e->getMessage();
      }
    }

    return $response;
  }

  public function Listar_pedidos_recrusos($MaestroId, $proveedor_id, $VentanaId)
  {
    $response = [];

    if ($VentanaId == 39 || $VentanaId == 49 || $VentanaId == 52 || $VentanaId == 110 || $VentanaId == 111) {
      $sql = $this->_db3->prepare("WITH UltimaTrazabilidad AS (
        SELECT
          trp.pedido_id,
          trp.tipo_trazabilidad,
          ROW_NUMBER() OVER ( PARTITION BY trp.pedido_id ORDER BY CONCAT( trp.fecha, ' ', trp.hora ) DESC ) AS rn 
        FROM
          cmx_trazabilidad_pedido_tr trp 
        )SELECT DISTINCT 
      pt.numdoc_solicitud,
      rp.maestro_id,
      pt.cod_producto,
      pt.referencia_pedido,
      pt.ciudad_origen,
      pt.ciudad_destino,
      pt.producto,
      pt.peso_bruto_kg,
      pt.presentacion,
      pt.unidades,
      -- pt.fecha_cargue,
      -- pt.fecha_entrega,
      CONCAT(pt.fecha_cargue,'-',pt.hora_cargue) AS fecha_cargar,
      CONCAT(pt.fecha_entrega,'-',pt.hora_entrega) AS fecha_entregar,
      pt.peso_neto_kg,
      ppe.estado_proceso_pedido,
      ppe.estado_visualizar,
      pt.remitente,
	    pt.destinatario,
      IFNULL( ut.tipo_trazabilidad, 'Sin trazabilidad' ) AS tipo_trazabilidad,
      pt.num_estibas,
      rp.observacion,
      pt.modalidad
      FROM cmx_recurso_pedido rp 
      INNER JOIN cmx_cliente_proveedor_servicio cps  ON rp.maestro_id = cps.recurso_id
      INNER JOIN cmx_pedido_torre_control pt  ON cps.pedido_id = pt.numdoc_solicitud
      INNER JOIN cmx_pedido_proveedor_estado ppe ON cps.proveedor_id = ppe.proveedor_id AND ppe.pedido_id = pt.numdoc_solicitud -- RelaciÃ³n directa con el pedido
      LEFT JOIN UltimaTrazabilidad ut ON cps.pedido_id = ut.pedido_id 
      AND ut.rn = 1 
      WHERE rp.maestro_id=:maestro_id AND ppe.estado_visualizar=1 GROUP BY pt.numdoc_solicitud");
      $sql->bindParam(':maestro_id', $MaestroId, PDO::PARAM_INT);
      // $sql->bindParam(':proveedor_id', $proveedor_id, PDO::PARAM_INT);

      $sql->execute();
      // $response = $sql->fetchAll(PDO::FETCH_ASSOC);

      /* Consulta para lisatr los resultados de la subasta del proveedor */
      $sql_select_subasta = $this->_db3->prepare("SELECT
              str.tipo_servicio,
              rst.valor_ganador,
              CONCAT(rst.fecha_registro, '-', rst.hora_registro ) AS Fecha_registro,
              pt.razon_social,
              CONCAT(rst.fecha_inicio,'-',rst.hora_inicio) AS Fecha_Inicio,
              cps.referencia,
							cps.cedula_conductor,
							cps.nombre_conductor,
              st.recurso_id
            FROM
              cmx_subasta_torre_control st -- INNER JOIN cmx_recurso_pedido rp ON st.recurso_id=rp.maestro_id
              INNER JOIN cmx_resultado_subasta_tr rst ON st.subasta_id = rst.subasta_id -- INNER JOIN cmx_pedido_torre_control ptr ON rst.pedido_id=ptr.numdoc_solicitud
              INNER JOIN cmx_servicio_torre_control str ON rst.servicio_id = str.id
              INNER JOIN cmx_proveedor_torre_control pt ON rst.proveedor_id = pt.id
              INNER JOIN cmx_cliente_proveedor_servicio cps ON st.recurso_id=cps.recurso_id
            WHERE
               cps.recurso_id = $MaestroId AND cps.fecha_inicio IS NOT NULL AND cps.hora_inicio IS NOT NULL 
            GROUP BY
              rst.servicio_id");

      $sql_select_subasta->execute();
      $resultados = $sql_select_subasta->fetchAll(PDO::FETCH_ASSOC);

      /* Consultar los proveedores que estan en los servicios especiales */
      $sql_select_proveedor = $this->_db3->prepare("SELECT sr.proveedor_id,rp.maestro_id,pt.razon_social FROM cmx_recurso_pedido rp
      INNER JOIN cmx_servicio_especial_recurso_tr sr ON rp.maestro_id=sr.recurso_id
      INNER JOIN cmx_proveedor_torre_control pt ON sr.proveedor_id=pt.id
      WHERE sr.recurso_id=:MaestroId GROUP BY sr.proveedor_id");
      $sql_select_proveedor->bindParam(":MaestroId", $MaestroId, PDO::PARAM_INT);
      $sql_select_proveedor->execute();

      $response = ['sql' => $sql->fetchAll(PDO::FETCH_ASSOC), 'resultados' => $resultados, 'proveedores' => $sql_select_proveedor->fetchAll(PDO::FETCH_ASSOC)];
    } else {
      $sql = $this->_db3->prepare("WITH UltimaTrazabilidad AS (
        SELECT
          trp.pedido_id,
          trp.tipo_trazabilidad,
          ROW_NUMBER() OVER ( PARTITION BY trp.pedido_id ORDER BY CONCAT( trp.fecha, ' ', trp.hora ) DESC ) AS rn 
        FROM
          cmx_trazabilidad_pedido_tr trp 
        ) SELECT DISTINCT
        pt.numdoc_solicitud,
        rp.maestro_id,
        pt.cod_producto,
        pt.referencia_pedido,
        pt.ciudad_origen,
        pt.ciudad_destino,
        pt.producto,
        pt.peso_bruto_kg,
        pt.presentacion,
        pt.unidades,
        CONCAT(pt.fecha_cargue,'-',pt.hora_cargue) AS fecha_cargar,
        CONCAT(pt.fecha_entrega,'-',pt.hora_entrega) AS fecha_entregar,
        pt.peso_neto_kg,
        ppe.estado_proceso_pedido,
        ppe.estado_visualizar,
        pt.remitente,
        pt.destinatario,
        IFNULL( ut.tipo_trazabilidad, 'Sin trazabilidad' ) AS tipo_trazabilidad,
        pt.num_estibas,
        rp.observacion,
        pt.modalidad
      FROM
        cmx_recurso_pedido rp
        INNER JOIN cmx_cliente_proveedor_servicio cps ON rp.maestro_id = cps.recurso_id
        INNER JOIN cmx_pedido_torre_control pt ON cps.pedido_id = pt.numdoc_solicitud
        INNER JOIN cmx_pedido_proveedor_estado ppe ON cps.proveedor_id = ppe.proveedor_id 
        AND ppe.pedido_id = pt.numdoc_solicitud AND ppe.estado_proceso_pedido <>'Cancelado'
        LEFT JOIN UltimaTrazabilidad ut ON cps.pedido_id = ut.pedido_id 
        AND ut.rn = 1 
      WHERE rp.maestro_id=:maestro_id AND ppe.proveedor_id=:proveedor_id AND ppe.estado_visualizar=1");

      $sql->bindParam(':maestro_id', $MaestroId, PDO::PARAM_INT);
      $sql->bindParam(':proveedor_id', $proveedor_id, PDO::PARAM_INT);
      $sql->execute();

      /* Consultar los proveedores que estan en los servicios especiales */
      $sql_select_proveedor = $this->_db3->prepare("SELECT sr.proveedor_id,rp.maestro_id,pt.razon_social FROM cmx_recurso_pedido rp
            INNER JOIN cmx_servicio_especial_recurso_tr sr ON rp.maestro_id=sr.recurso_id
            INNER JOIN cmx_proveedor_torre_control pt ON sr.proveedor_id=pt.id
            WHERE sr.recurso_id=:MaestroId AND sr.proveedor_id=:proveedor_id GROUP BY sr.proveedor_id");
      $sql_select_proveedor->bindParam(":MaestroId", $MaestroId, PDO::PARAM_INT);
      $sql_select_proveedor->bindParam(":proveedor_id", $proveedor_id, PDO::PARAM_INT);
      $sql_select_proveedor->execute();

      $response = ['sql' => $sql->fetchAll(PDO::FETCH_ASSOC), 'proveedores' => $sql_select_proveedor->fetchAll(PDO::FETCH_ASSOC)];
    }

    return $response;
  }

  public function Listar_servicios_pedidos_recursos($MaestroId)
  {
    $sql = $this->_db3->prepare("SELECT st.id AS servicio_id, st.tipo_servicio FROM cmx_recurso_pedido rp
    INNER JOIN cmx_cliente_proveedor_servicio cps ON rp.maestro_id=cps.recurso_id
    INNER JOIN cmx_servicio_torre_control st ON cps.serivicio_id=st.id
    WHERE rp.maestro_id=:maestro_id GROUP BY st.tipo_servicio");
    $sql->bindParam('maestro_id', $MaestroId, PDO::PARAM_INT);
    $sql->execute();
    return $sql->fetchAll(PDO::FETCH_ASSOC);
  }

  public function Listar_detalle_proveedores_servicio($recurso, $numdoc)
  {
    $sql = $this->_db3->prepare("SELECT pt.numdoc_solicitud,rp.maestro_id,pt.cod_producto,pt.referencia_pedido,pt.ciudad_origen,pt.ciudad_destino,pt.producto,pt.peso_bruto_kg,pt.presentacion,
    pt.unidades,pt.fecha_cargue,pt.fecha_entrega
    FROM cmx_recurso_pedido rp 
    INNER JOIN cmx_cliente_proveedor_servicio cps ON rp.maestro_id=cps.recurso_id
    INNER JOIN cmx_pedido_torre_control pt ON cps.pedido_id=pt.id
    WHERE rp.maestro_id=:maestro_id GROUP BY pt.numdoc_solicitud");
    $sql->bindParam('maestro_id', $MaestroId, PDO::PARAM_INT);
    $sql->execute();
    return $sql->fetchAll(PDO::FETCH_ASSOC);
  }

  public function Listar_recursos_proveedor($RecursoId, $proveedor_id, $proceso, $SolicitudesId, $VentanaId)
  {
    $response = [];
    try {
      $this->_db3->beginTransaction(); // Iniciar transacciÃ³n

      if ($VentanaId == 39 || $VentanaId == 52 || $VentanaId == 109 || $VentanaId == 110) {
        /* Consulta de datos */
        $sql = $this->_db3->prepare("SELECT DISTINCT st.id,
        ptc.razon_social, 
        st.tipo_servicio,
        COALESCE(pv.nombre, 'Sin Vehiculo') AS vehiculo,
        CONCAT(cps.fecha, '-', cps.hora) AS Fecha_registro,
        CONCAT(cps.fecha_vencimiento, '-', cps.hora_vencimiento) AS fecha_limite,
        COALESCE(esp.estado_servicio, 'Postulado') AS estado_servicio, -- Estado dinÃ¡mico
        COALESCE ( ehr.estado_recurso, 'Pendiente Iniciar' ) AS estado_recurso,-- Estado dinÃ¡mico
        -- esp.estado_servicio,
        ptc.id AS ProveedorId,
        st.id AS servicioId,
        cps.valor_servicio AS Valor_Servicio,
				CONCAT(cps.fecha_inicio,'-',cps.hora_inicio) AS Fecha_Inicio,
				CONCAT(cps.fecha_actualizacion,'-',cps.hora_actualizacion) AS Fecha_Actualizacion,
        cps.referencia AS Placa,
        cps.cedula_conductor,
        cps.nombre_conductor,
        cps.capacidad,
        cps.tiempo_libre,
        cps.stand_bay,
        cps.cumplimiento,
        cps.contenedor,
        cps.tara
        FROM cmx_recurso_pedido rp
        INNER JOIN cmx_cliente_proveedor_servicio cps ON rp.maestro_id = cps.recurso_id
        INNER JOIN cmx_servicio_torre_control st ON cps.serivicio_id = st.id
        INNER JOIN cmx_proveedor_torre_control ptc ON cps.proveedor_id = ptc.id
        LEFT JOIN cmx_para_tipo_vehiculo pv ON cps.tipo_vehiculo = pv.id
        INNER JOIN cmx_estado_servicio_proveedor esp ON cps.pedido_id = esp.pedido_id 
            AND cps.serivicio_id = esp.servicio_id 
            AND rp.maestro_id = esp.recurso_id
            AND ptc.id=esp.proveedor_id AND esp.estado_actual=1
        LEFT JOIN ( SELECT recurso_id, proveedor_id, estado_recurso FROM cmx_estado_historico_recurso WHERE estado_actual = 1 GROUP BY recurso_id, proveedor_id, estado_recurso ) ehr ON ehr.recurso_id = rp.maestro_id 
	          AND ehr.proveedor_id = ptc.id
        WHERE rp.maestro_id = :maestro_id");

        $sql->bindParam(':maestro_id', $RecursoId, PDO::PARAM_INT);
        $sql->execute();

        $response = $sql->fetchAll(PDO::FETCH_ASSOC);
      } else {
        $sql_check = $this->_db3->prepare("SELECT COUNT(*) as total 
        FROM cmx_estado_servicio_proveedor esp
        INNER JOIN cmx_cliente_proveedor_servicio cps ON esp.servicio_id = cps.serivicio_id
        INNER JOIN cmx_pedido_proveedor_estado ppe ON cps.pedido_id = ppe.pedido_id
        WHERE ppe.proveedor_id = :proveedor_id
        AND ppe.estado_visualizar = 1 AND ppe.recurso_id=:recurso_id
        AND ppe.estado_proceso_pedido = 'Pendiente Iniciar'");
        $sql_check->bindParam(':proveedor_id', $proveedor_id, PDO::PARAM_INT);
        $sql_check->bindParam(':recurso_id', $RecursoId, PDO::PARAM_INT);
        $sql_check->execute();
        $check_result = $sql_check->fetch(PDO::FETCH_ASSOC);

        if ($check_result['total'] > 0) {
          /* Actualizar los pedidos asociados al recurso con el proveedor */
          $estado_nuevo = 0;
          $sql_update = $this->_db3->prepare("UPDATE cmx_pedido_proveedor_estado SET estado_visualizar=:estado_visualizar WHERE pedido_id=:pedido_id AND proveedor_id=:proveedor_id");

          foreach ($SolicitudesId as $value) {
            $sql_update->bindParam(':estado_visualizar', $estado_nuevo, PDO::PARAM_INT);
            $sql_update->bindParam(':pedido_id', $value, PDO::PARAM_INT);
            $sql_update->bindParam(':proveedor_id', $proveedor_id, PDO::PARAM_INT);
            $sql_update->execute();
          }

          /* Insertar el nuevo estado de los pedidos */
          $estado_inicio = 'Iniciado';
          $estado_visualizar = 1;
          $sql_insert = $this->_db3->prepare("INSERT INTO cmx_pedido_proveedor_estado (pedido_id, proveedor_id, recurso_id,estado_proceso_pedido, estado_visualizar, usuario, fecha, hora, empresa_id) 
               VALUES (:pedido_id, :proveedor_id, :recurso_id,:estado_proceso_pedido, :estado_visualizar, :usuario, CURDATE(), DATE_SUB(CURTIME(), INTERVAL 5 HOUR), :empresa_id)");

          foreach ($SolicitudesId as $value) {
            $sql_insert->bindParam(':pedido_id', $value, PDO::PARAM_INT);
            $sql_insert->bindParam(':proveedor_id', $proveedor_id, PDO::PARAM_INT);
            $sql_insert->bindParam(':recurso_id', $RecursoId, PDO::PARAM_INT);
            $sql_insert->bindParam(':estado_proceso_pedido', $estado_inicio, PDO::PARAM_STR);
            $sql_insert->bindParam(':estado_visualizar', $estado_visualizar, PDO::PARAM_INT);
            $sql_insert->bindParam(':usuario', $_SESSION["usuario"]["nom_usuario"], PDO::PARAM_STR);
            $sql_insert->bindParam(':empresa_id', $_SESSION["usuario"]["empresa_id"], PDO::PARAM_INT);
            $sql_insert->execute();
          }

          /* Actualiar historico de recurso */
          $sql_update = $this->_db3->prepare("UPDATE cmx_estado_historico_recurso SET estado_actual=:estado_actual WHERE recurso_id=:recurso_id AND proveedor_id=:proveedor_id");
          $estado_anterior = 0;
          // foreach ($SolicitudesId as $value) {  }
          $sql_update->bindParam(':estado_actual', $estado_anterior, PDO::PARAM_INT);
          $sql_update->bindParam(':recurso_id', $RecursoId, PDO::PARAM_INT);
          $sql_update->bindParam(':proveedor_id', $proveedor_id, PDO::PARAM_INT);
          $sql_update->execute();


          /* Inserta nuevo estado para el hiostorico de recrusos */
          $estado_inicio = 'Iniciado';
          $estado_visualizar = 1;
          $sql_insert = $this->_db3->prepare("INSERT INTO cmx_estado_historico_recurso (recurso_id, proveedor_id, estado_recurso,estado_actual, usuario, fecha, hora, empresa_id) 
               VALUES (:recurso_id, :proveedor_id, :estado_recurso, :estado_actual, :usuario, CURDATE(), DATE_SUB(CURTIME(), INTERVAL 5 HOUR), :empresa_id)");

          $sql_insert->bindParam(':recurso_id', $RecursoId, PDO::PARAM_INT);
          $sql_insert->bindParam(':proveedor_id', $proveedor_id, PDO::PARAM_INT);
          $sql_insert->bindParam(':estado_recurso', $estado_inicio, PDO::PARAM_STR);
          $sql_insert->bindParam(':estado_actual', $estado_visualizar, PDO::PARAM_INT);
          $sql_insert->bindParam(':usuario', $_SESSION["usuario"]["nom_usuario"], PDO::PARAM_STR);
          $sql_insert->bindParam(':empresa_id', $_SESSION["usuario"]["empresa_id"], PDO::PARAM_INT);
          $sql_insert->execute();
        }

        /* Consulta de datos */
        $sql = $this->_db3->prepare("SELECT DISTINCT
            ptc.razon_social, 
            st.tipo_servicio,
            COALESCE(pv.nombre, 'Sin Vehiculo') AS vehiculo,
            CONCAT(cps.fecha, '-', cps.hora) AS Fecha_registro,
            CONCAT(cps.fecha_vencimiento, '-', cps.hora_vencimiento) AS fecha_limite,
            esp.estado_servicio,
            ptc.id AS proveedorId,
            esp.pedido_id AS PedidoId,
            st.id AS servicioId,
            cps.valor_servicio AS Valor_Servicio,
            CONCAT(cps.fecha_inicio,'-',cps.hora_inicio) AS Fecha_Inicio,
            CONCAT(cps.fecha_actualizacion,'-',cps.hora_actualizacion) AS Fecha_Actualizacion,
            cps.referencia AS Placa,
            cps.cedula_conductor,
            cps.nombre_conductor,
            cps.capacidad,
            cps.tiempo_libre,
            cps.stand_bay,
            cps.cumplimiento,
            cps.contenedor,
            cps.tara
        FROM 
          cmx_recurso_pedido rp
            INNER JOIN cmx_cliente_proveedor_servicio cps ON rp.maestro_id = cps.recurso_id
            INNER JOIN cmx_servicio_torre_control st ON cps.serivicio_id = st.id
            INNER JOIN cmx_proveedor_torre_control ptc ON cps.proveedor_id = ptc.id
            INNER JOIN cmx_estado_servicio_proveedor esp ON cps.pedido_id = esp.pedido_id 
                AND cps.serivicio_id = esp.servicio_id 
                AND rp.maestro_id = esp.recurso_id
                AND ptc.id=esp.proveedor_id AND esp.estado_actual=1
            LEFT JOIN cmx_para_tipo_vehiculo pv ON cps.tipo_vehiculo = pv.id
            WHERE cps.recurso_id = :maestro_id
            AND ptc.id=:proveedor_id GROUP BY st.tipo_servicio");

        $sql->bindParam(':maestro_id', $RecursoId, PDO::PARAM_INT);
        $sql->bindParam(':proveedor_id', $proveedor_id, PDO::PARAM_INT);
        $sql->execute();

        $response = $sql->fetchAll(PDO::FETCH_ASSOC);
      }

      $this->_db3->commit(); // Confirmar la transacciÃ³n
      return $response;
    } catch (Exception $e) {
      $this->_db3->rollBack(); // Revertir la transacciÃ³n en caso de error
      throw new Exception('Error en la función Listar_recursos_proveedor: ' . $e->getMessage());
    }
  }

  public function Listar_proveedores_torre_control()
  {
    $sql = $this->_db3->prepare("SELECT * FROM cmx_proveedor_torre_control");
    $sql->execute();
    $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
    return $resultados;
  }

  public function Buscar_usaurio_responsable()
  {
    $sql = $this->_db3->prepare("SELECT user_log,id,nom_usuario,email FROM cmx_usuarios ORDER BY nom_usuario ASC");
    // $sql->bindParam(':datos', $datos, PDO::PARAM_STR);
    $sql->execute();
    $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
    return $resultados;
  }

  public function Importar_trazabilidad($ServicioId, $RecursoId, $datos)
  {
    try {
      $date = new DateTime('now', new DateTimeZone('America/Bogota'));
      $fecha = $date->format('Y-m-d');
      $hora = $date->format('H:i:s');

      $session_empresa_id = $_SESSION['usuario']['empresa_id'];
      $ProveedorId = $_SESSION['usuario']['proveedor_id'];
      $this->_db3->beginTransaction();

      /* Validar si la placa que se esta importando es la ganadora para el pedido */
      $sql = $this->_db3->prepare("SELECT referencia FROM cmx_cliente_proveedor_servicio WHERE recurso_id=:RecursoId AND proveedor_id=:ProveedorId");
      $sql->bindParam(':RecursoId', $RecursoId);
      $sql->bindParam(':ProveedorId', $ProveedorId);
      $sql->execute();
      $resultados = $sql->fetch(PDO::FETCH_ASSOC);

      if (!$resultados) {
        throw new Exception("No se encontrÃ³ el recurso con ID: $RecursoId");
      }

      $placa_ganadora = $resultados['referencia'];

      $sql_insert_trazabilidad = $this->_db3->prepare("INSERT INTO cmx_trazabilidad_torre_control
            (numdoc_trazabilidad, recurso_id, servicio_id, placa_vehiculo, ruta, sitio_seguimiento, fecha_seguimiento, hora_seguimiento, nota_seguimiento, usuario_reporte, latitud, longitud, usuario, fecha, hora, empresa_id)
            VALUES (:numdoc_trazabilidad, :recurso_id, :servicio_id, :placa_vehiculo, :ruta, :sitio_seguimiento, :fecha_seguimiento, :hora_seguimiento, :nota_seguimiento, :usuario_reporte, :latitud, :longitud, :usuario, :fecha, :hora, :empresa_id)");

      foreach ($datos as $key => $value) {
        // ðŸš¨ VALIDACIÃ“N de placa
        if (trim($value['PLACA']) !== trim($placa_ganadora)) {
          throw new Exception("La placa '{$value['PLACA']}' no coincide con la placa ganadora '$placa_ganadora'.");
        }

        // Obtener el nÃºmero actual de `cmx_maestro`
        $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='TRAZABILIDAD_TR' AND numero_actual>numero_inicial AND empresa_id=:empresa_id FOR UPDATE");
        $sql_consecutivo->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
        $sql_consecutivo->execute();
        $resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);

        if (!$resultado_consecutivo) {
          throw new Exception("No se encontrÃ³ un nÃºmero de pedido vÃ¡lido.");
        }

        $numdoc_cabecera = $resultado_consecutivo['numero_actual'];
        $numdoc_actualizar_cabecera = $numdoc_cabecera + 1;

        // Actualizar `numero_actual`
        $sql_update_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=:numdoc_actualizar_cabecera WHERE tipo='TRAZABILIDAD_TR' AND empresa_id=:empresa_id");
        $sql_update_maestro->bindParam(':numdoc_actualizar_cabecera', $numdoc_actualizar_cabecera, PDO::PARAM_INT);
        $sql_update_maestro->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
        $sql_update_maestro->execute();

        // Insertar en trazabilidad
        $sql_insert_trazabilidad->execute([
          ':numdoc_trazabilidad' => $numdoc_cabecera,
          ':recurso_id' => $RecursoId,
          ':servicio_id' => $ServicioId,
          ':placa_vehiculo' => $value['PLACA'],
          ':ruta' => $value['RUTA'],
          ':sitio_seguimiento' => $value['SITIO'],
          ':fecha_seguimiento' => $value['FECHA'],
          ':hora_seguimiento' => $value['HORA'],
          ':nota_seguimiento' => $value['NOTA'],
          ':usuario_reporte' => $value['USUARIO'],
          ':latitud' => $value['LATITUD'],
          ':longitud' => $value['LONGITUD'],
          ':usuario' => $value["usuario"] ?? $_SESSION["usuario"]["nom_usuario"],
          ':fecha' => $fecha,
          ':hora' => $hora,
          ':empresa_id' => $session_empresa_id,
        ]);
      }

      $this->_db3->commit();
      return ["status" => true, "message" => "Trazabilidad importada correctamente."];
    } catch (\Throwable $th) {
      $this->_db3->rollBack();
      return ["status" => false, "message" => $th->getMessage()];
    }
  }

  public function Listar_trazabilidad_torre_control($fecha_inicial, $fecha_final, $ProveedorId, $ventanaId, $valor, $filtro)
  {
    $response = [];
    if (isset($ProveedorId) && isset($ventanaId)) {

      $sql = $this->_db3->prepare("SELECT
      ttc.numdoc_trazabilidad,
      ttc.recurso_id,
      st.tipo_servicio,
      CONCAT( ttc.fecha, '-', ttc.hora ) AS Fecha_trazabilidad,
      st.id AS ServicioId,
      cps.referencia,
      cps.cedula_conductor,
      cps.nombre_conductor,
      GROUP_CONCAT( DISTINCT pt.referencia_pedido ORDER BY pt.referencia_pedido SEPARATOR ', ' ) AS referencias_pedido,
      ult_ttc.nota_seguimiento,
      ult_ttc.sitio_seguimiento,
      ult_ttc.fecha AS fecha_ultima,
      ult_ttc.hora AS hora_ultima,
      rp.maestro_id,
      pt.modalidad
    FROM
      cmx_recurso_pedido rp
      INNER JOIN (
        -- Subconsulta para traer el Ãºltimo registro de trazabilidad por recurso
        SELECT 
          ttc1.*
        FROM
          cmx_trazabilidad_torre_control ttc1
        INNER JOIN (
          SELECT recurso_id, MAX(CONCAT(fecha, ' ', hora)) AS max_fecha_hora
          FROM cmx_trazabilidad_torre_control
          GROUP BY recurso_id
        ) ult ON ttc1.recurso_id = ult.recurso_id 
          AND CONCAT(ttc1.fecha, ' ', ttc1.hora) = ult.max_fecha_hora
      ) AS ult_ttc ON ult_ttc.recurso_id = rp.maestro_id
      INNER JOIN cmx_trazabilidad_torre_control ttc ON ttc.recurso_id = rp.maestro_id
      INNER JOIN cmx_clientes cl ON cl.id = rp.cliente_id
      INNER JOIN cmx_cliente_proveedor_servicio cps ON rp.maestro_id = cps.recurso_id
      INNER JOIN cmx_estado_historico_recurso eht ON rp.maestro_id = eht.recurso_id 
        AND eht.estado_actual = 1
      INNER JOIN cmx_pedido_torre_control pt ON cps.pedido_id = pt.numdoc_solicitud
      INNER JOIN cmx_servicio_torre_control st ON cps.serivicio_id = st.id 
      WHERE cps.proveedor_id=:proveedor_id AND rp.fecha BETWEEN :fecha_inicio AND :fecha_final
    GROUP BY
      rp.maestro_id,
      rp.usuario,
      rp.estado,
      cl.nombre,
      cps.proceso");
      $sql->bindParam(':proveedor_id', $ProveedorId, PDO::PARAM_INT);
      $sql->bindParam(':fecha_inicio', $fecha_inicial, PDO::PARAM_STR);
      $sql->bindParam(':fecha_final', $fecha_final, PDO::PARAM_STR);
      $sql->execute();
      $resultado_recursos = $sql->fetchAll(PDO::FETCH_ASSOC);

      $response = [
        "resultado_recursos" => $resultado_recursos,
        // "resultado_trazabilidad" => $resultado_trazabilidad,
      ];
    } else {
      $whereExtra = '';
      $whereExtra_2 = '';
      $whereExtra_3 = '';


      if (!empty($valor)) {
        // Supongamos que buscas por cliente ID o por proceso, adapta segÃºn sea el campo correcto.
        $whereExtra = " AND pt.modalidad = :valor";
        $params[':valor'] = $valor;
      }

      if (!empty($filtro) && $filtro !== 'undefined') {
        // Supongamos que buscas por cliente ID o por proceso, adapta segÃºn sea el campo correcto.
        $whereExtra_2 = "HAVING referencias_pedido LIKE :referencias_pedido";
        $params[':referencias_pedido'] = "%$filtro%";
      } else {
        $whereExtra_3 = " WHERE rp.fecha BETWEEN :fecha_inicio AND :fecha_final";
        $params = [
          ':fecha_inicio' => $fecha_inicial,
          ':fecha_final' => $fecha_final
        ];
      }

      try {
        $sqlText = "SELECT
        ttc.numdoc_trazabilidad,
        ttc.recurso_id,
        st.tipo_servicio,
        CONCAT( ttc.fecha, '-', ttc.hora ) AS Fecha_trazabilidad,
        st.id AS ServicioId,
        cps.referencia,
        cps.cedula_conductor,
        cps.nombre_conductor,
        GROUP_CONCAT( DISTINCT pt.referencia_pedido ORDER BY pt.referencia_pedido SEPARATOR ', ' ) AS referencias_pedido,
        ult_ttc.nota_seguimiento,
        ult_ttc.sitio_seguimiento,
        ult_ttc.fecha AS fecha_ultima,
        ult_ttc.hora AS hora_ultima,
        rp.maestro_id,
        pvt.razon_social,
        pt.modalidad
      FROM
        cmx_recurso_pedido rp
        INNER JOIN (
          SELECT 
            ttc1.*
          FROM
            cmx_trazabilidad_torre_control ttc1
          INNER JOIN (
            SELECT recurso_id, MAX(CONCAT(fecha, ' ', hora)) AS max_fecha_hora
            FROM cmx_trazabilidad_torre_control
            GROUP BY recurso_id
          ) ult ON ttc1.recurso_id = ult.recurso_id 
            AND CONCAT(ttc1.fecha, ' ', ttc1.hora) = ult.max_fecha_hora
        ) AS ult_ttc ON ult_ttc.recurso_id = rp.maestro_id
        INNER JOIN cmx_trazabilidad_torre_control ttc ON ttc.recurso_id = rp.maestro_id
        INNER JOIN cmx_clientes cl ON cl.id = rp.cliente_id
        INNER JOIN cmx_cliente_proveedor_servicio cps ON rp.maestro_id = cps.recurso_id
        INNER JOIN cmx_estado_historico_recurso eht ON rp.maestro_id = eht.recurso_id 
          AND eht.estado_actual = 1
        INNER JOIN cmx_pedido_torre_control pt ON cps.pedido_id = pt.numdoc_solicitud
        INNER JOIN cmx_servicio_torre_control st ON cps.serivicio_id = st.id 
        INNER JOIN cmx_proveedor_torre_control pvt ON cps.proveedor_id = pvt.id
      /*WHERE
        rp.fecha BETWEEN :fecha_inicio AND :fecha_final
        $whereExtra*/
         $whereExtra_3
         $whereExtra
        GROUP BY
        rp.maestro_id,
        rp.usuario,
        rp.estado,
        cl.nombre,
        cps.proceso
        $whereExtra_2";

        $sql = $this->_db3->prepare($sqlText);

        foreach ($params as $key => $value) {
          $sql->bindValue($key, $value);
        }

        $sql->execute();
        $resultado_recursos = $sql->fetchAll(PDO::FETCH_ASSOC);

        $response = [
          "resultado_recursos" => $resultado_recursos,
        ];
      } catch (PDOException $e) {
        $response = [
          "error" => $e->getMessage()
        ];
      }
    }
    return $response;
  }

  public function Detalle_trazabilidad($ProveedorId, $ServicioId, $RecursoId)
  {

    $response = [];
    if (isset($ProveedorId)) {
      $sql = $this->_db3->prepare("SELECT ttc.placa_vehiculo,
        ttc.ruta,
        ttc.sitio_seguimiento,
        CONCAT(ttc.fecha_seguimiento, '-', ttc.hora_seguimiento) AS fecha_hora_seguimiento,
        ttc.nota_seguimiento,
        ttc.usuario_reporte,
        ttc.latitud,
        ttc.longitud
      FROM cmx_trazabilidad_torre_control ttc
      INNER JOIN cmx_recurso_pedido rp ON ttc.recurso_id = rp.maestro_id
      INNER JOIN cmx_estado_servicio_proveedor esp ON rp.maestro_id = esp.recurso_id 
          AND esp.estado_actual = 1
      WHERE esp.proveedor_id = :proveedorId 
        AND ttc.servicio_id = :ServicioId 
        AND ttc.recurso_id = :numdoc_trazabilidad 
        AND esp.estado_servicio = 'Ganador'
      GROUP BY ttc.fecha_seguimiento, ttc.hora_seguimiento ORDER BY ttc.fecha_seguimiento ASC, ttc.hora_seguimiento ASC

      /*GROUP BY ttc.placa_vehiculo,ttc.ruta,ttc.sitio_seguimiento,ttc.fecha_hora,ttc.nota_seguimiento,ttc.usuario_reporte*/");
      $sql->bindParam(':proveedorId', $ProveedorId, PDO::PARAM_INT);
      $sql->bindParam(':ServicioId', $ServicioId, PDO::PARAM_INT);
      $sql->bindParam(':numdoc_trazabilidad', $RecursoId, PDO::PARAM_INT);
      $sql->execute();
      $response = $sql->fetchAll(PDO::FETCH_ASSOC);
    } else {
      $sql = $this->_db3->prepare("SELECT ttc.placa_vehiculo,ttc.ruta,ttc.sitio_seguimiento,CONCAT(ttc.fecha_seguimiento,'-',ttc.hora_seguimiento) AS fecha_hora_seguimiento,ttc.nota_seguimiento,ttc.usuario_reporte,ttc.latitud,ttc.longitud
      FROM 
      cmx_trazabilidad_torre_control ttc
      INNER JOIN cmx_recurso_pedido rp ON ttc.recurso_id=rp.maestro_id
      INNER JOIN cmx_estado_servicio_proveedor esp ON rp.maestro_id=esp.recurso_id AND esp.estado_actual=1
      WHERE ttc.servicio_id=:ServicioId AND ttc.recurso_id=:numdoc_trazabilidad AND esp.estado_servicio='Ganador' 
      GROUP BY ttc.fecha_seguimiento, ttc.hora_seguimiento ORDER BY ttc.fecha_seguimiento ASC, ttc.hora_seguimiento ASC
      /*GROUP BY ttc.placa_vehiculo,ttc.ruta,ttc.sitio_seguimiento,ttc.fecha_hora,ttc.nota_seguimiento,ttc.usuario_reporte*/");
      $sql->bindParam(':ServicioId', $ServicioId, PDO::PARAM_INT);
      $sql->bindParam(':numdoc_trazabilidad', $RecursoId, PDO::PARAM_INT);
      $sql->execute();
      $response = $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    return $response;
  }

  public function Insertar_pedido_trazabilidad($proveedorId, $modalidad, $nombre_plantilla, $datos, $nota, $visualizadores)
  {

    $response = [];
    $user = $_SESSION["usuario"]["nom_usuario"];
    $session_empresa_id = $_SESSION['usuario']['empresa_id'] ?? null;

    // 1. Crea un objeto DateTime en BogotÃ¡
    $date = new DateTime('now', new DateTimeZone('America/Bogota'));

    // 2. Convierte a UTC (opcional si quieres guardar en UTC)
    // $date->setTimezone(new DateTimeZone('UTC'));

    // 3. Saca fecha y hora
    $fecha = $date->format('Y-m-d'); // Fecha correcta
    $hora = $date->format('H:i:s');  // Hora correcta

    try {
      $this->_db3->beginTransaction();

      /* Validar si el provveedore ya tiene una plantilla con la misma modalidad y esta activa al plantilla */
      $sql = $this->_db3->prepare("SELECT * FROM cmx_plantilla WHERE proveedor_id=:proveedor_id AND modalidad=:modalidad AND estado_plantilla='ACTIVA'");
      $sql->bindParam(':proveedor_id', $proveedorId, PDO::PARAM_INT);
      $sql->bindParam(':modalidad', $modalidad, PDO::PARAM_STR);
      $sql->execute();
      $resultado_plantilla = $sql->fetch(PDO::FETCH_ASSOC);
      if ($resultado_plantilla) {
        return $response = [
          'numero' => 305,
          'mensaje' => 'Ya existe una plantilla con la misma modalidad y esta activa.',
        ];
      }

      // 1. Obtener el nÃºmero actual de `cmx_maestro`
      $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='PED_PLANTILLA' AND numero_actual>numero_inicial AND empresa_id=:empresa_id FOR UPDATE");
      $sql_consecutivo->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
      $sql_consecutivo->execute();
      $resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);

      if (!$resultado_consecutivo) {
        throw new Exception("No se encontrÃ³ un nÃºmero de pedido vÃ¡lido.");
      }

      $numdoc_cabecera = $resultado_consecutivo['numero_actual'];
      $numdoc_actualizar_cabecera = $numdoc_cabecera + 1;

      // 2. Actualizar `numero_actual` en `cmx_maestro`
      $sql_update_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=:numdoc_actualizar_cabecera WHERE tipo='PED_PLANTILLA' AND empresa_id=:empresa_id");
      $sql_update_maestro->bindParam(':numdoc_actualizar_cabecera', $numdoc_actualizar_cabecera, PDO::PARAM_INT);
      $sql_update_maestro->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
      $sql_update_maestro->execute();

      #CREAR PLANTILLA PARA MAS USOS DE FORMA RAPIDA
      $estado = "ACTIVA";
      $Procedencia = "TORRE_CONTROL";
      $sql_insert_plantilla = $this->_db3->prepare("INSERT INTO cmx_plantilla(numdoc,nombre_plantilla,proveedor_id,modalidad,usuario,fecha,hora,estado_plantilla,procedencia)
         VALUES(:numdoc,:nombre_plantilla,:proveedor_id,:modalidad,:usuario,:fecha,:hora,:estado_plantilla,:procedencia)");
      $sql_insert_plantilla->bindParam(':numdoc', $numdoc_cabecera, PDO::PARAM_STR);
      $sql_insert_plantilla->bindParam(':nombre_plantilla', $nombre_plantilla, PDO::PARAM_STR);
      $sql_insert_plantilla->bindParam(':proveedor_id', $proveedorId, PDO::PARAM_INT);
      $sql_insert_plantilla->bindParam(':modalidad', $modalidad, PDO::PARAM_STR);
      $sql_insert_plantilla->bindParam(':usuario', $user, PDO::PARAM_STR);
      $sql_insert_plantilla->bindParam(':fecha', $fecha, PDO::PARAM_STR);
      $sql_insert_plantilla->bindParam(':hora', $hora, PDO::PARAM_STR);
      $sql_insert_plantilla->bindParam(':estado_plantilla', $estado, PDO::PARAM_STR);
      $sql_insert_plantilla->bindParam(':procedencia', $Procedencia, PDO::PARAM_STR);
      $resultados_insert_plantilla = $sql_insert_plantilla->execute();

      if (!$resultados_insert_plantilla) {
        throw new Exception("Error al insertar cabecerra de plantilla");
      }

      $estado_seleccion = "checked";
      $total_notas = count($nota["tipo"]); // Acceder correctamente al total
      for ($i = 0; $i < $total_notas; $i++) {
        $sql_insert_detalle_plantilla = $this->_db3->prepare("INSERT INTO cmx_detalle_plantilla_parametros(numdoc_plantilla,tipo_proceso_id,estado_seleccion,fecha_creacion,usuario)
        VALUES(:numdoc_plantilla,:tipo_proceso_id,:estado_seleccion,:fecha_creacion,:usuario)");
        $sql_insert_detalle_plantilla->bindParam(':numdoc_plantilla', $numdoc_cabecera, PDO::PARAM_STR);
        $sql_insert_detalle_plantilla->bindParam(':tipo_proceso_id', $nota["tipo"][$i], PDO::PARAM_INT);
        $sql_insert_detalle_plantilla->bindParam(':estado_seleccion', $estado_seleccion, PDO::PARAM_STR);
        $sql_insert_detalle_plantilla->bindParam(':fecha_creacion', $fecha, PDO::PARAM_STR);
        $sql_insert_detalle_plantilla->bindParam(':usuario', $user, PDO::PARAM_STR);
        $resultados_insert_detalle_plantilla = $sql_insert_detalle_plantilla->execute();
      }

      if (!$resultados_insert_detalle_plantilla) {
        throw new Exception("Error al insertar detalle 1 de plantilla");
      }

      $estado_seleccion = "checked";
      $total = count($datos);
      $detalle_actividad_json = null;
      for ($i = 0; $i < $total; $i++) {
        $sql_insert_plantilla_actividad = $this->_db3->prepare("INSERT INTO cmx_plantilla_actividad(
        numdoc_detalle_plantilla,
        detalle_actividad_plantilla,
        posicion,
        responsable,
        criterio_calculo,
        estado_seleccion,
        valor_minutos,
        medida_tiempo,
        dependiente,
        activdad_dependiente,
        costo_sugerido,
        detalle_actividad,
        usuario,
        fecha_creacion,
        hora
        )
        VALUES(
          :numdoc_detalle_plantilla,
          :detalle_actividad_plantilla,
          :posicion,
          :responsable,
          :criterio_calculo,
          :estado_seleccion,
          :valor_minutos,
          :medida_tiempo,
          :dependiente,
          :activdad_dependiente,
          :costo_sugerido,
          :detalle_actividad,
          :usuario,
          :fecha_creacion,
          :hora
        )");

        $sql_insert_plantilla_actividad->bindParam(':numdoc_detalle_plantilla', $numdoc_cabecera, PDO::PARAM_STR);
        $sql_insert_plantilla_actividad->bindParam(':detalle_actividad_plantilla', $datos[$i]['id'], PDO::PARAM_INT);
        $sql_insert_plantilla_actividad->bindParam(':posicion', $datos[$i]['Posicion_avtividad'], PDO::PARAM_INT);
        $sql_insert_plantilla_actividad->bindParam(':responsable', $datos[$i]['usuario_responsable'], PDO::PARAM_INT);
        $sql_insert_plantilla_actividad->bindParam(':criterio_calculo', $datos[$i]['select_detalle'], PDO::PARAM_INT);
        $sql_insert_plantilla_actividad->bindParam(':estado_seleccion', $estado_seleccion, PDO::PARAM_STR);
        $sql_insert_plantilla_actividad->bindParam(':valor_minutos', $datos[$i]['input_valor'], PDO::PARAM_INT);
        $sql_insert_plantilla_actividad->bindParam(':medida_tiempo', $datos[$i]['medida_tiempo'], PDO::PARAM_INT);
        $sql_insert_plantilla_actividad->bindParam(':dependiente', $datos[$i]['select_dependiente'], PDO::PARAM_STR);
        $sql_insert_plantilla_actividad->bindParam(':activdad_dependiente', $datos[$i]['select_depende'], PDO::PARAM_INT);
        $sql_insert_plantilla_actividad->bindParam(':costo_sugerido', $datos[$i]['costo_sugerido'], PDO::PARAM_INT);
        // ðŸ‘‡ Insertamos el JSON en el campo detalle_actividad
        $sql_insert_plantilla_actividad->bindParam(':detalle_actividad', $detalle_actividad_json, PDO::PARAM_STR);
        $sql_insert_plantilla_actividad->bindParam(':usuario', $user, PDO::PARAM_STR);
        $sql_insert_plantilla_actividad->bindParam(':fecha_creacion', $fecha, PDO::PARAM_STR);
        $sql_insert_plantilla_actividad->bindParam(':hora', $hora, PDO::PARAM_STR);

        $resultados_insert_actividad_plantilla = $sql_insert_plantilla_actividad->execute();
      }

      if (!$resultados_insert_actividad_plantilla) {
        throw new Exception("Error al insertar actividad de plantilla");
      }

      /* Insertar actividades para visualizar */
      foreach ($visualizadores as $item) {
        $usuario_id = $item['usuario_id'];
        foreach ($item['actividades'] as $actividad_id) {
          $sql_insert = $this->_db3->prepare("INSERT INTO cmx_plantilla_actividades_visualizar (numdoc_plantilla,usuario_visualizar,actividad_visualizar,usuario,fecha,hora)
                                                     VALUES(:numdoc_plantilla,:usuario_visualizar,:actividad_visualizar,:usuario,:fecha,:hora)");
          $sql_insert->bindParam(':numdoc_plantilla', $numdoc_cabecera, PDO::PARAM_STR);
          $sql_insert->bindParam(':usuario_visualizar', $usuario_id, PDO::PARAM_STR);
          $sql_insert->bindParam(':actividad_visualizar', $actividad_id, PDO::PARAM_INT);
          $sql_insert->bindParam(':usuario', $user, PDO::PARAM_STR);
          $sql_insert->bindParam(':fecha', $fecha, PDO::PARAM_STR);
          $sql_insert->bindParam(':hora', $hora, PDO::PARAM_STR);
          $resultados_insert_actividad_plantilla_visualizar = $sql_insert->execute();
        }
      }

      if (!$resultados_insert_actividad_plantilla_visualizar) {
        throw new Exception("Error al insertar actividad de plantilla");
      }

      /* Insertar actividades dependientes */
      $estado_depedencia = "Activo";
      $proceso = "Plantilla";
      for ($a = 0; $a < $total; $a++) {
        // if ($datos[$a]['select_depende'] != "0") {}
        // continue; // Si no hay actividad dependiente, continuar con la siguiente iteraciÃ³n
        $sql_insert_plantilla_dependencia = $this->_db3->prepare("INSERT INTO cmx_actividad_dependiente(numdoc_proceso, actividad, actividad_dependiente, estado_depedencia, proceso, usuario, fecha, hora, empresa_id) 
          VALUES(:numdoc_proceso,:actividad,:actividad_dependiente,:estado_depedencia,:proceso,:usuario,:fecha,:hora,:empresa_id)");
        $sql_insert_plantilla_dependencia->bindParam(':numdoc_proceso', $numdoc_cabecera, PDO::PARAM_INT);
        $sql_insert_plantilla_dependencia->bindParam(':actividad', $datos[$a]['id'], PDO::PARAM_INT);
        $sql_insert_plantilla_dependencia->bindParam(':actividad_dependiente', $datos[$a]['select_depende'], PDO::PARAM_INT);
        $sql_insert_plantilla_dependencia->bindParam(':estado_depedencia', $estado_depedencia, PDO::PARAM_STR);
        $sql_insert_plantilla_dependencia->bindParam(':proceso', $proceso, PDO::PARAM_STR);
        $sql_insert_plantilla_dependencia->bindParam(':usuario', $user, PDO::PARAM_STR);
        $sql_insert_plantilla_dependencia->bindParam(':fecha', $fecha, PDO::PARAM_STR);
        $sql_insert_plantilla_dependencia->bindParam(':hora', $hora, PDO::PARAM_STR);
        $sql_insert_plantilla_dependencia->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_INT);
        $sql_insert_plantilla_dependencia->execute();
      }

      if (!$sql_insert_plantilla_dependencia) {
        throw new Exception("Error al insertar actividad dependiente de plantilla");
      }

      $this->_db3->commit();
      $response = [
        'numero' => 200,
        'mensaje' => '<strong>Mensaje!</strong> Plantilla generada exitosamente.',
      ];
    } catch (\Throwable $th) {
      //throw $th;
      $this->_db3->rollBack();
      // Captura cualquier excepciÃ³n generada por PDO
      // y procesa el error para mostrar un mensaje especÃ­fico al usuario
      throw new Exception($th->getMessage());
    }

    return $response;
  }

  public function Estado_Recurso($RecursoId)
  {
    $ProveedorId = $_SESSION['usuario']['proveedor_id'] ?? null;
    $response = [];
    if (isset($ProveedorId) && $ProveedorId != "") {
      $sql = $this->_db3->prepare("SELECT esp.estado_servicio,pt.razon_social FROM cmx_estado_servicio_proveedor esp
          INNER JOIN cmx_proveedor_torre_control pt ON esp.proveedor_id=pt.id
          WHERE esp.recurso_id=:RecursoId AND pt.id=:ProveedorId AND estado_actual=1 AND servicio_id=2 GROUP BY esp.servicio_id");
      $sql->bindParam(':RecursoId', $RecursoId, PDO::PARAM_INT);
      $sql->bindParam(':ProveedorId', $ProveedorId, PDO::PARAM_INT);
      $sql->execute();
      $response = $sql->fetchAll(PDO::FETCH_ASSOC);
    } else {
      $sql = $this->_db3->prepare("SELECT esp.estado_servicio,pt.razon_social FROM cmx_estado_servicio_proveedor esp
          INNER JOIN cmx_proveedor_torre_control pt ON esp.proveedor_id=pt.id
          WHERE esp.recurso_id=:RecursoId AND estado_actual=1 AND servicio_id=2 GROUP BY pt.id");
      $sql->bindParam(':RecursoId', $RecursoId, PDO::PARAM_INT);
      $sql->execute();
      $response = $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    return $response;
  }

  public function Listar_Plantillas_Torre_Control()
  {
    $sql = $this->_db3->prepare("SELECT DISTINCT
      pt.numdoc,
      pt.nombre_plantilla,
      pt.estado_plantilla,
      pt.modalidad,
      CONCAT( pt.fecha, '-', pt.hora ) AS fecha_hora,
      ptr.razon_social 
    FROM
      cmx_plantilla pt
      INNER JOIN cmx_detalle_plantilla_parametros dpp ON pt.numdoc = dpp.numdoc_plantilla
      INNER JOIN cmx_plantilla_actividad pa ON pt.numdoc = pa.numdoc_detalle_plantilla
      INNER JOIN cmx_proveedor_torre_control ptr ON pt.proveedor_id = ptr.id");
    $sql->execute();
    $response = $sql->fetchAll(PDO::FETCH_ASSOC);
    return $response;
  }

  public function Lista_de_actividades($RecursoId)
  {
    $user = $_SESSION["usuario"]["id_usuario"];
    $response = [];
    $actividadesAgregadas = []; // <<< Controlar actividades agregadas

    if ($_SESSION['usuario']['nombre_perfil'] == 'Administrador Torre de control' || $_SESSION['usuario']['tipo_perfil'] == 'ADMINISTRADOR' || $_SESSION['usuario']['tipo_perfil'] == 'ADMINISTRATIVO') {
      $sql = $this->_db3->prepare("
      SELECT 
          dt.posicion,
          t.nombre_tipo,
          tt.nombre_opcion,
          u.nom_usuario,
          dt.fecha_inicio,
          dt.hora_inicio,
          dt.estado_actividad,
          t.id AS proceso_id,
          tt.id AS actividad_id,
          dt.detalle_proceso AS num_proceso,
          da.actividad AS actividad,
          da.actividad_dependiente,
          dt.costo_actividad,
          tp.numdoc,
          CONCAT(dt.fecha_base, ' ', dt.hora_base) AS fecha_base,
          dt.valor_minutos,
          dt.dependiente,
          dt.criterio_calculo,
          dt.tiempo_transcurrido,
          dt.detalle_actividad,
          dt.medida_tiempo
      FROM cmx_detalle_opcion_trazabilidad dt
      INNER JOIN cmx_trazabilidad_proceso tp ON tp.numdoc = dt.numdoc_detalle_opcion
      INNER JOIN cmx_tipo_opcion_trazabilidad tt ON tt.id = dt.detalle_proceso
      INNER JOIN cmx_tipo_trazabilidad t ON t.id = tt.tipo_trazabilidad
      INNER JOIN cmx_usuarios u ON u.id = dt.usuario_responsable
      LEFT JOIN cmx_actividad_dependiente da ON dt.detalle_proceso = da.actividad
		  AND da.proceso='Pedido' AND tp.numdoc=da.numdoc_proceso
      WHERE tp.recurso_id = :recurso_id
      GROUP BY dt.posicion
      ORDER BY dt.posicion ASC");
      $sql->bindParam(':recurso_id', $RecursoId, PDO::PARAM_STR);
      $sql->execute();
      $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
      $idsGenerados = [];
      // Zona horaria de Colombia
      date_default_timezone_set('America/Bogota');

      // Obtener la hora actual
      $now = new DateTime();

      // Obtener la fecha de hoy en formato Y-m-d
      $today = $now->format('Y-m-d');

      // Crear los objetos DateTime con fecha de hoy y hora especÃ­fica
      $start = new DateTime("$today 06:00:00");
      $end = new DateTime("$today 18:00:00");

      foreach ($resultados as $value) {
        $inicio = new DateTime($value['fecha_inicio'] . ' ' . $value['hora_inicio'], new DateTimeZone('America/Bogota'));
        $ahora = new DateTime('now', new DateTimeZone('America/Bogota'));

        $diferenciaAhora = $inicio->diff($ahora);
        $tiempoTranscurridoActual = ($diferenciaAhora->days * 24 * 60) + ($diferenciaAhora->h * 60) + $diferenciaAhora->i;
        $resultadoActividadDependiente = null;

        // Actividad Principal
        if (!in_array($value['actividad_id'], $actividadesAgregadas)) {
          $estadoActividad = ($tiempoTranscurridoActual >= $value['valor_minutos'] && $value['estado_actividad'] !== 'COMPLETADO') ? 'VENCIDO' : $value['estado_actividad'];
          // $minutosParaVencimiento = $value['valor_minutos'] - $tiempoTranscurridoActual;

          $minutosParaVencimiento = $value['valor_minutos'] - $tiempoTranscurridoActual;
          $medida_tiempo = null;

          switch ($value['medida_tiempo']) {
            case 1: // Minutos
              $tiempoRestante = round($minutosParaVencimiento);
              $medida_tiempo = 'Minutos';
              break;

            case 2: // Horas
              $tiempoRestante = round($minutosParaVencimiento / 60);
              $medida_tiempo = 'Horas';
              break;

            case 3: // DÃ­as
              $tiempoRestante = round($minutosParaVencimiento / 1440);
              $medida_tiempo = 'Días';
              break;

            default: // Por defecto, asumir minutos
              $tiempoRestante = round($minutosParaVencimiento);
              $medida_tiempo = 'Minutos';
              break;
          }

          //Consultar las actividades dependientes para el recurso
          $sqlActividadDependiente = $this->_db3->prepare("
                      SELECT tt.nombre_opcion AS nombre_actividad_dependiente,da.actividad_dependiente 
                      FROM cmx_detalle_opcion_trazabilidad dt
                      INNER JOIN cmx_trazabilidad_proceso tp ON tp.numdoc = dt.numdoc_detalle_opcion
                      INNER JOIN cmx_tipo_opcion_trazabilidad tt ON tt.id = dt.detalle_proceso
                      INNER JOIN cmx_actividad_dependiente da ON tt.id = da.actividad_dependiente AND da.proceso = 'Pedido'
                      WHERE tp.recurso_id = :RecursoId AND da.actividad = :actividadId");
          $sqlActividadDependiente->bindParam(":RecursoId", $RecursoId, PDO::PARAM_INT);
          $sqlActividadDependiente->bindParam(":actividadId", $value['actividad_id'], PDO::PARAM_INT);
          $sqlActividadDependiente->execute();
          $resultadoActividadDependiente = $sqlActividadDependiente->fetchAll(PDO::FETCH_ASSOC);

          $estadoVencimiento = ($tiempoRestante > 0) ? "Faltan {$tiempoRestante} minutos" : "Vencido hace " . abs($tiempoRestante) . " " . $medida_tiempo;

          /* Actualizar el tiempo transcurrido de vencimiento */
          if ($estadoActividad !== 'COMPLETADO' && $estadoActividad === 'VENCIDO') {
            // Si ya venciÃ³, guardar el tiempo en positivo (sin signo)
            $tiempoVencidoGuardar = abs($minutosParaVencimiento);
            $sqlUpdateTiempo = $this->_db3->prepare("
                UPDATE cmx_detalle_opcion_trazabilidad 
                SET tiempo_vencido = :tiempo_vencido
                WHERE detalle_proceso = :id AND numdoc_detalle_opcion = :numdoc
            ");
            $sqlUpdateTiempo->bindParam(':tiempo_vencido', $tiempoVencidoGuardar, PDO::PARAM_INT);
            $sqlUpdateTiempo->bindParam(':id', $value['num_proceso'], PDO::PARAM_INT);
            $sqlUpdateTiempo->bindParam(':numdoc', $value['numdoc'], PDO::PARAM_STR);
            $sqlUpdateTiempo->execute();
          }

          if (!empty($resultadoActividadDependiente)) {
            $claveUnica = $value['actividad_id'];

            foreach ($resultadoActividadDependiente as $actividad) {
              // Verifica si ya se generÃ³ esa fila exacta
              if (in_array($claveUnica, $idsGenerados)) {
                continue;
              }

              $response[] = [
                'posicion' => $value['posicion'],
                'nombre_tipo' => $value['nombre_tipo'],
                'nombre_opcion' => $value['nombre_opcion'], // Actividad actual
                'nom_usuario' => $value['nom_usuario'],
                'fecha_inicio' => $value['fecha_inicio'],
                'hora_inicio' => $value['hora_inicio'],
                'estado_actividad' => $estadoActividad,
                'proceso_id' => $value['proceso_id'],
                'actividad_id' => $value['actividad_id'],
                'num_proceso' => $value['num_proceso'],
                'actividad' => $value['actividad'],
                'valor_minutos' => $value['valor_minutos'] . ' ' . $medida_tiempo,
                'actividad_dependiente' => $actividad['actividad_dependiente'],
                'nombre_actividad_dependiente' => $actividad['nombre_actividad_dependiente'], // Mostramos el nombre de la dependencia // Mostramos el nombre de la dependencia
                'costo_actividad' => $value['costo_actividad'],
                'numdoc' => $value['numdoc'],
                'fecha_base' => $value['fecha_base'] == null ? $actividad['nombre_actividad_dependiente'] : $value['fecha_base'],
                'criterio_calculo' => $value['criterio_calculo'],
                'tiempo_transcurrido_base' => $value['tiempo_transcurrido'] . ' ' . $medida_tiempo,
                'tiempo_transcurrido_actual' => $tiempoTranscurridoActual,
                'tiempo_vencimiento' => $estadoVencimiento,
              ];

              $idsGenerados[] = $claveUnica;
            }
          } else {
            // Si no hay actividades dependientes, crear solo una fila como fallback
            $response[] = [
              'posicion' => $value['posicion'],
              'nombre_tipo' => $value['nombre_tipo'],
              'nombre_opcion' => $value['nombre_opcion'],
              'nom_usuario' => $value['nom_usuario'],
              'fecha_inicio' => $value['fecha_inicio'],
              'hora_inicio' => $value['hora_inicio'],
              'estado_actividad' => $estadoActividad,
              'proceso_id' => $value['proceso_id'],
              'actividad_id' => $value['actividad_id'],
              'num_proceso' => $value['num_proceso'],
              'actividad' => $value['actividad'],
              'valor_minutos' => $value['valor_minutos'] . ' ' . $medida_tiempo,
              'actividad_dependiente' => $value['actividad_dependiente'],
              // 'nombre_actividad_dependiente' => $actividad['nombre_actividad_dependiente'], // Mostramos el nombre de la dependencia
              'costo_actividad' => $value['costo_actividad'],
              'numdoc' => $value['numdoc'],
              'fecha_base' => $value['fecha_base'],
              'criterio_calculo' => $value['criterio_calculo'],
              'tiempo_transcurrido_base' => $value['tiempo_transcurrido'] . ' ' . $medida_tiempo,
              'tiempo_transcurrido_actual' => $tiempoTranscurridoActual,
              'tiempo_vencimiento' => $estadoVencimiento,
            ];
          }
          $actividadesAgregadas[] = $value['actividad_id'];
        }
      }
    } else {
      $sql = $this->_db3->prepare("
      SELECT 
          dt.posicion,
          t.nombre_tipo,
          tt.nombre_opcion,
          u.nom_usuario,
          dt.fecha_inicio,
          dt.hora_inicio,
          dt.estado_actividad,
          t.id AS proceso_id,
          tt.id AS actividad_id,
          dt.detalle_proceso AS num_proceso,
          da.actividad AS actividad,
          da.actividad_dependiente,
          dt.costo_actividad,
          tp.numdoc,
          CONCAT(dt.fecha_base, ' ', dt.hora_base) AS fecha_base,
          dt.valor_minutos,
          dt.dependiente,
          dt.criterio_calculo,
          dt.tiempo_transcurrido,
          dt.detalle_actividad,
          dt.medida_tiempo
      FROM cmx_detalle_opcion_trazabilidad dt
      INNER JOIN cmx_trazabilidad_proceso tp ON tp.numdoc = dt.numdoc_detalle_opcion
      INNER JOIN cmx_tipo_opcion_trazabilidad tt ON tt.id = dt.detalle_proceso
      INNER JOIN cmx_tipo_trazabilidad t ON t.id = tt.tipo_trazabilidad
      INNER JOIN cmx_usuarios u ON u.id = dt.usuario_responsable
      LEFT JOIN cmx_actividad_dependiente da ON dt.detalle_proceso = da.actividad
		  AND da.proceso='Pedido' AND tp.numdoc=da.numdoc_proceso
      WHERE tp.recurso_id = :recurso_id  AND dt.usuario_responsable= :Responsable
          GROUP BY dt.posicion
          ORDER BY dt.posicion ASC
      ");
      $sql->bindParam(':recurso_id', $RecursoId, PDO::PARAM_STR);
      $sql->bindParam(':Responsable', $user, PDO::PARAM_STR);
      $sql->execute();
      $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
      $idsGenerados = [];

      foreach ($resultados as $value) {
        $inicio = new DateTime($value['fecha_inicio'] . ' ' . $value['hora_inicio'], new DateTimeZone('America/Bogota'));
        $ahora = new DateTime('now', new DateTimeZone('America/Bogota'));

        $diferenciaAhora = $inicio->diff($ahora);
        $tiempoTranscurridoActual = ($diferenciaAhora->days * 24 * 60) + ($diferenciaAhora->h * 60) + $diferenciaAhora->i;

        //Consultar las actividades dependientes para el recurso
        $sqlActividadDependiente = $this->_db3->prepare("SELECT tt.nombre_opcion AS nombre_actividad_dependiente,da.actividad_dependiente 
          FROM cmx_detalle_opcion_trazabilidad dt
          INNER JOIN cmx_trazabilidad_proceso tp ON tp.numdoc = dt.numdoc_detalle_opcion
          INNER JOIN cmx_tipo_opcion_trazabilidad tt ON tt.id = dt.detalle_proceso
          INNER JOIN cmx_actividad_dependiente da ON tt.id = da.actividad_dependiente AND da.proceso = 'Pedido' AND tp.numdoc=da.numdoc_proceso
          WHERE tp.recurso_id = :RecursoId AND da.actividad = :actividadId
        ");
        $sqlActividadDependiente->bindParam(":RecursoId", $RecursoId, PDO::PARAM_INT);
        $sqlActividadDependiente->bindParam(":actividadId", $value['actividad_id'], PDO::PARAM_INT);
        $sqlActividadDependiente->execute();
        $resultadoActividadDependiente = $sqlActividadDependiente->fetchAll(PDO::FETCH_ASSOC);


        if (!in_array($value['actividad_id'], $actividadesAgregadas)) {
          $estadoActividad = ($tiempoTranscurridoActual >= $value['valor_minutos'] && $value['estado_actividad'] !== 'COMPLETADO') ? 'VENCIDO' : $value['estado_actividad'];

          $minutosParaVencimiento = $value['valor_minutos'] - $tiempoTranscurridoActual;
          $medida_tiempo = null;

          switch ($value['medida_tiempo']) {
            case 1: // Minutos
              $tiempoRestante = round($minutosParaVencimiento);
              $medida_tiempo = 'Minutos';
              break;

            case 2: // Horas
              $tiempoRestante = round($minutosParaVencimiento / 60);
              $medida_tiempo = 'Horas';
              break;

            case 3: // DÃ­as
              $tiempoRestante = round($minutosParaVencimiento / 1440);
              $medida_tiempo = 'Días';
              break;

            default: // Por defecto, asumir minutos
              $tiempoRestante = round($minutosParaVencimiento);
              $medida_tiempo = 'Minutos';
              break;
          }

          $estadoVencimiento = ($tiempoRestante > 0) ? "Faltan {$tiempoRestante} minutos" : "Vencido hace " . abs($tiempoRestante) . " " . $medida_tiempo;

          /* Actualizar el tiempo transcurrido de vencimiento */
          if ($estadoActividad !== 'COMPLETADO' && $estadoActividad === 'VENCIDO') {
            // Si ya venciÃ³, guardar el tiempo en positivo (sin signo)
            $tiempoVencidoGuardar = abs($minutosParaVencimiento);
            $sqlUpdateTiempo = $this->_db3->prepare("
                UPDATE cmx_detalle_opcion_trazabilidad 
                SET tiempo_vencido = :tiempo_vencido
                WHERE detalle_proceso = :id AND numdoc_detalle_opcion = :numdoc
            ");
            $sqlUpdateTiempo->bindParam(':tiempo_vencido', $tiempoVencidoGuardar, PDO::PARAM_INT);
            $sqlUpdateTiempo->bindParam(':id', $value['num_proceso'], PDO::PARAM_INT);
            $sqlUpdateTiempo->bindParam(':numdoc', $value['numdoc'], PDO::PARAM_STR);
            $sqlUpdateTiempo->execute();
          }

          if (!empty($resultadoActividadDependiente)) {
            $claveUnica = $value['actividad_id'];

            foreach ($resultadoActividadDependiente as $actividad) {
              // Verifica si ya se generÃ³ esa fila exacta
              if (in_array($claveUnica, $idsGenerados)) {
                continue;
              }

              $response[] = [
                'posicion' => $value['posicion'],
                'nombre_tipo' => $value['nombre_tipo'],
                'nombre_opcion' => $value['nombre_opcion'], // Actividad actual
                'nom_usuario' => $value['nom_usuario'],
                'fecha_inicio' => $value['fecha_inicio'],
                'hora_inicio' => $value['hora_inicio'],
                'estado_actividad' => $estadoActividad,
                'proceso_id' => $value['proceso_id'],
                'actividad_id' => $value['actividad_id'],
                'num_proceso' => $value['num_proceso'],
                'actividad' => $value['actividad'],
                'valor_minutos' => $value['valor_minutos'] . ' ' . $medida_tiempo,
                'actividad_dependiente' => $actividad['actividad_dependiente'],
                'nombre_actividad_dependiente' => $actividad['nombre_actividad_dependiente'], // Mostramos el nombre de la dependencia // Mostramos el nombre de la dependencia
                'costo_actividad' => $value['costo_actividad'],
                'numdoc' => $value['numdoc'],
                'fecha_base' => $value['fecha_base'] == null ? $actividad['nombre_actividad_dependiente'] : $value['fecha_base'],
                'criterio_calculo' => $value['criterio_calculo'],
                'tiempo_transcurrido_base' => $value['tiempo_transcurrido'] . ' ' . $medida_tiempo,
                'tiempo_transcurrido_actual' => $tiempoTranscurridoActual,
                'tiempo_vencimiento' => $estadoVencimiento,
              ];

              $idsGenerados[] = $claveUnica;
            }
          } else {
            // Si no hay actividades dependientes, crear solo una fila como fallback
            $response[] = [
              'posicion' => $value['posicion'],
              'nombre_tipo' => $value['nombre_tipo'],
              'nombre_opcion' => $value['nombre_opcion'],
              'nom_usuario' => $value['nom_usuario'],
              'fecha_inicio' => $value['fecha_inicio'],
              'hora_inicio' => $value['hora_inicio'],
              'estado_actividad' => $estadoActividad,
              'proceso_id' => $value['proceso_id'],
              'actividad_id' => $value['actividad_id'],
              'num_proceso' => $value['num_proceso'],
              'actividad' => $value['actividad'],
              'valor_minutos' => $value['valor_minutos'] . ' ' . $medida_tiempo,
              'actividad_dependiente' => $value['actividad_dependiente'],
              'costo_actividad' => $value['costo_actividad'],
              'numdoc' => $value['numdoc'],
              'fecha_base' => $value['fecha_base'],
              'criterio_calculo' => $value['criterio_calculo'],
              'tiempo_transcurrido_base' => $value['tiempo_transcurrido'] . ' ' . $medida_tiempo,
              'tiempo_transcurrido_actual' => $tiempoTranscurridoActual,
              'tiempo_vencimiento' => $estadoVencimiento,
            ];
          }
          $actividadesAgregadas[] = $value['actividad_id'];
        }
      }

      $sqlActividades = $this->_db3->prepare("
      SELECT
          dt.posicion,
          t.nombre_tipo,
          tt.nombre_opcion,
          u.nom_usuario,
          dt.fecha_inicio,
          dt.hora_inicio,
          dt.estado_actividad,
          t.id AS proceso_id,
          tt.id AS actividad_id,
          dt.detalle_proceso AS num_proceso,
          da.actividad AS actividad,
          da.actividad_dependiente,
          dt.costo_actividad,
          tp.numdoc,
          CONCAT(dt.fecha_base, ' ', dt.hora_base) AS fecha_base,
          dt.valor_minutos,
          dt.dependiente,
          dt.criterio_calculo,
          dt.tiempo_transcurrido,
          dt.detalle_actividad,
          dt.medida_tiempo,
          tt.nombre_opcion AS nombre_actividad_dependiente
      FROM cmx_detalle_opcion_trazabilidad dt
      INNER JOIN cmx_trazabilidad_proceso tp ON tp.numdoc = dt.numdoc_detalle_opcion
      INNER JOIN cmx_tipo_opcion_trazabilidad tt ON tt.id = dt.detalle_proceso
      INNER JOIN cmx_tipo_trazabilidad t ON t.id = tt.tipo_trazabilidad
      INNER JOIN cmx_usuarios u ON u.id = dt.usuario_responsable
      INNER JOIN cmx_pedido_actividades_visualizar pav ON pav.numdoc_pedido = tp.numdoc 
      AND pav.usuario_visualizar = '" . $user . "' AND pav.actividad_visualizar = dt.detalle_proceso
      LEFT JOIN cmx_actividad_dependiente da ON dt.detalle_proceso = da.actividad
		  AND da.proceso='Pedido' AND tp.numdoc=da.numdoc_proceso
      WHERE tp.recurso_id = '" . $RecursoId . "' AND pav.usuario_visualizar='" . $user . "'
      GROUP BY dt.posicion
      ORDER BY dt.posicion ASC
      ");
      $sqlActividades->execute();
      $infoActividades = $sqlActividades->fetchAll(mode: PDO::FETCH_ASSOC);

      foreach ($infoActividades as $actividadExtra) {
        $inicio = new DateTime($actividadExtra['fecha_inicio'] . ' ' . $actividadExtra['hora_inicio'], new DateTimeZone('America/Bogota'));
        $ahora = new DateTime('now', new DateTimeZone('America/Bogota'));

        $diferenciaAhora = $inicio->diff($ahora);
        $tiempoTranscurridoActual = ($diferenciaAhora->days * 24 * 60) + ($diferenciaAhora->h * 60) + $diferenciaAhora->i;
        $resultadoActividadDependiente = null;

        //Consultar las actividades dependientes para el recurso
        $sqlActividadDependiente = $this->_db3->prepare("
              SELECT tt.nombre_opcion AS nombre_actividad_dependiente,
                da.actividad_dependiente 
              FROM cmx_detalle_opcion_trazabilidad dt
              INNER JOIN cmx_trazabilidad_proceso tp ON tp.numdoc = dt.numdoc_detalle_opcion
              INNER JOIN cmx_tipo_opcion_trazabilidad tt ON tt.id = dt.detalle_proceso
              INNER JOIN cmx_actividad_dependiente da ON tt.id = da.actividad_dependiente AND da.proceso = 'Pedido' AND tp.numdoc=da.numdoc_proceso
              WHERE tp.recurso_id = :RecursoId AND da.actividad = :actividadId
            ");
        $sqlActividadDependiente->bindParam(":RecursoId", $RecursoId, PDO::PARAM_INT);
        $sqlActividadDependiente->bindParam(":actividadId", $actividadExtra['actividad_id'], PDO::PARAM_INT);
        $sqlActividadDependiente->execute();
        $resultadoActividadDependiente = $sqlActividadDependiente->fetchAll(PDO::FETCH_ASSOC);

        if (!in_array($actividadExtra['actividad_id'], $actividadesAgregadas)) {
          $estadoActividad = ($tiempoTranscurridoActual >= $actividadExtra['valor_minutos'] && $actividadExtra['estado_actividad'] !== 'COMPLETADO') ? 'VENCIDO' : $actividadExtra['estado_actividad'];

          $minutosParaVencimiento = $actividadExtra['valor_minutos'] - $tiempoTranscurridoActual;
          $medida_tiempo = null;
          if ($actividadExtra['medida_tiempo'] == 1) { // Minutos
            $tiempoRestante = round($minutosParaVencimiento); // sin decimales
            $medida_tiempo = 'Minutos';
          } else if ($actividadExtra['medida_tiempo'] == 2) { // Horas
            $tiempoRestante = round($minutosParaVencimiento / 60);
            $medida_tiempo = 'Horas';
          } else if ($actividadExtra['medida_tiempo'] == 3) { // DÃ­as
            $tiempoRestante = round($minutosParaVencimiento / 1440);
            $medida_tiempo = 'DÃ­as';
          } else {
            $tiempoRestante = round($minutosParaVencimiento);
            $medida_tiempo = 'Minutos';
          }
          $estadoVencimiento = ($tiempoRestante > 0) ? "Faltan {$tiempoRestante} minutos" : "Vencido hace " . abs($tiempoRestante) . " " . $medida_tiempo;

          /* Actualizar el tiempo transcurrido de vencimiento */
          if ($estadoActividad !== 'COMPLETADO' && $estadoActividad === 'VENCIDO') {
            // Si ya venciÃ³, guardar el tiempo en positivo (sin signo)
            $tiempoVencidoGuardar = abs($minutosParaVencimiento);
            $sqlUpdateTiempo = $this->_db3->prepare("
                UPDATE cmx_detalle_opcion_trazabilidad 
                SET tiempo_vencido = :tiempo_vencido
                WHERE detalle_proceso = :id AND numdoc_detalle_opcion = :numdoc
            ");
            $sqlUpdateTiempo->bindParam(':tiempo_vencido', $tiempoVencidoGuardar, PDO::PARAM_INT);
            $sqlUpdateTiempo->bindParam(':id', $actividadExtra['num_proceso'], PDO::PARAM_INT);
            $sqlUpdateTiempo->bindParam(':numdoc', $actividadExtra['numdoc'], PDO::PARAM_STR);
            $sqlUpdateTiempo->execute();
          }

          if (!empty($resultadoActividadDependiente)) {
            $claveUnica = $actividadExtra['actividad_id'];

            foreach ($resultadoActividadDependiente as $actividad) {
              // Verifica si ya se generÃ³ esa fila exacta
              if (in_array($claveUnica, $idsGenerados)) {
                continue;
              }

              $response[] = [
                'posicion' => $actividadExtra['posicion'],
                'nombre_tipo' => $actividadExtra['nombre_tipo'],
                'nombre_opcion' => $actividadExtra['nombre_opcion'], // Actividad actual
                'nom_usuario' => $actividadExtra['nom_usuario'],
                'fecha_inicio' => $actividadExtra['fecha_inicio'],
                'hora_inicio' => $actividadExtra['hora_inicio'],
                'estado_actividad' => $estadoActividad,
                'proceso_id' => $actividadExtra['proceso_id'],
                'actividad_id' => $actividadExtra['actividad_id'],
                'num_proceso' => $actividadExtra['num_proceso'],
                'actividad' => $actividadExtra['actividad'],
                'valor_minutos' => $actividadExtra['valor_minutos'] . ' ' . $medida_tiempo,
                'actividad_dependiente' => $actividad['actividad_dependiente'],
                'nombre_actividad_dependiente' => $actividad['nombre_actividad_dependiente'], // Mostramos el nombre de la dependencia
                'costo_actividad' => $actividadExtra['costo_actividad'],
                'numdoc' => $actividadExtra['numdoc'],
                'fecha_base' => $actividadExtra['fecha_base'] == null ? $actividad['nombre_actividad_dependiente'] : $actividadExtra['fecha_base'],
                'criterio_calculo' => $actividadExtra['criterio_calculo'],
                'tiempo_transcurrido_base' => $actividadExtra['tiempo_transcurrido'] . ' ' . $medida_tiempo,
                'tiempo_transcurrido_actual' => $tiempoTranscurridoActual,
                'tiempo_vencimiento' => $estadoVencimiento,
                'estado_visualizar' => 'VISUALIZADOR', // Opcional
              ];

              $idsGenerados[] = $claveUnica;
            }
          } else {
            // Si no hay actividades dependientes, crear solo una fila como fallback
            $response[] = [
              'posicion' => $actividadExtra['posicion'],
              'nombre_tipo' => $actividadExtra['nombre_tipo'],
              'nombre_opcion' => $actividadExtra['nombre_opcion'],
              'nom_usuario' => $actividadExtra['nom_usuario'],
              'fecha_inicio' => $actividadExtra['fecha_inicio'],
              'hora_inicio' => $actividadExtra['hora_inicio'],
              'estado_actividad' => $estadoActividad,
              'proceso_id' => $actividadExtra['proceso_id'],
              'actividad_id' => $actividadExtra['actividad_id'],
              'num_proceso' => $actividadExtra['num_proceso'],
              'actividad' => $actividadExtra['actividad'],
              'valor_minutos' => $actividadExtra['valor_minutos'] . ' ' . $medida_tiempo,
              'actividad_dependiente' => $actividadExtra['actividad_dependiente'],
              'nombre_actividad_dependiente' => $actividadExtra['nombre_actividad_dependiente'], // Mostramos el nombre de la dependencia
              'costo_actividad' => $actividadExtra['costo_actividad'],
              'numdoc' => $actividadExtra['numdoc'],
              'fecha_base' => $actividadExtra['fecha_base'],
              'criterio_calculo' => $actividadExtra['criterio_calculo'],
              'tiempo_transcurrido_base' => $actividadExtra['tiempo_transcurrido'] . ' ' . $medida_tiempo,
              'tiempo_transcurrido_actual' => $tiempoTranscurridoActual,
              'tiempo_vencimiento' => $estadoVencimiento,
              'estado_visualizar' => 'VISUALIZADOR', // Opcional
            ];
          }
          $actividadesAgregadas[] = $actividadExtra['actividad_id'];
        }
      }
    }

    // return $response;

    /* ======================================================
    * CONSULTA SERVICIOS / PEDIDO
    * ====================================================== */
    $sqlServicios = $this->_db3->prepare("
          SELECT DISTINCT
              ptc.razon_social, 
              st.tipo_servicio,
              COALESCE(pv.nombre, 'Sin Vehiculo') AS vehiculo,
              CONCAT(cps.fecha, '-', cps.hora) AS Fecha_registro,
              CONCAT(cps.fecha_vencimiento, '-', cps.hora_vencimiento) AS fecha_limite,
              esp.estado_servicio,
              ptc.id AS proveedorId,
              esp.pedido_id AS PedidoId,
              st.id AS servicioId,
              cps.valor_servicio AS Valor_Servicio,
              CONCAT(cps.fecha_inicio,'-',cps.hora_inicio) AS Fecha_Inicio,
              CONCAT(cps.fecha_actualizacion,'-',cps.hora_actualizacion) AS Fecha_Actualizacion,
              cps.referencia AS Placa,
              cps.cedula_conductor,
              cps.nombre_conductor,
              cps.capacidad,
              cps.tiempo_libre,
              cps.stand_bay,
              cps.cumplimiento,
              cps.contenedor,
              cps.tara
          FROM cmx_recurso_pedido rp
          INNER JOIN cmx_cliente_proveedor_servicio cps ON rp.maestro_id = cps.recurso_id
          INNER JOIN cmx_servicio_torre_control st ON cps.serivicio_id = st.id
          INNER JOIN cmx_proveedor_torre_control ptc ON cps.proveedor_id = ptc.id
          INNER JOIN cmx_estado_servicio_proveedor esp ON cps.pedido_id = esp.pedido_id 
              AND cps.serivicio_id = esp.servicio_id 
              AND rp.maestro_id = esp.recurso_id
              AND ptc.id = esp.proveedor_id 
              AND esp.estado_actual = 1
          LEFT JOIN cmx_para_tipo_vehiculo pv ON cps.tipo_vehiculo = pv.id
          WHERE cps.recurso_id = :maestro_id
          GROUP BY st.tipo_servicio
      ");

    $sqlServicios->bindParam(':maestro_id', $RecursoId, PDO::PARAM_INT);
    $sqlServicios->execute();

    $serviciosResponse = $sqlServicios->fetchAll(PDO::FETCH_ASSOC);
    $actividadesResponse = $response;

    return [
      'actividades' => $actividadesResponse,
      'servicios'   => $serviciosResponse
    ];
  }

  public function insertar_trazabilidad_pedido($datosArray, $observacion, $documento, $traza)
  {
    $response = ['status' => 'error', 'message' => 'OcurriÃ³ un error inesperado'];
    $user = $_SESSION["usuario"]["nom_usuario"];
    $empresaId = $_SESSION["usuario"]["empresa_id"] ?? 1;

    $date = new DateTime('now', new DateTimeZone('America/Bogota'));
    $fecha = $date->format('Y-m-d');
    $hora = $date->format('H:i:s');

    $file = null;

    try {
      $this->_db3->beginTransaction();

      // Procesar archivo si viene
      if (isset($documento) && $documento["error"] == 0) {
        $file = $documento["name"];
        $ruta_provisional = $documento["tmp_name"];
        $carpeta = 'public/files/torrecontrol/trazabilidad/' . $datosArray[0]["referencia"] . '/';

        if (!file_exists($carpeta)) {
          mkdir($carpeta, 0777, true);
        }

        $src = $carpeta . $file;
        if (!move_uploaded_file($ruta_provisional, $src)) {
          throw new Exception("No se pudo mover el archivo subido");
        }
      }

      $sqlInsert = $this->_db3->prepare("
      INSERT INTO cmx_trazabilidad_pedido_tr(
        pedido_id, referencia, evidencia, archivo, tipo_trazabilidad, observacion, usuario, fecha, hora, empresa_id
      ) VALUES (
        :pedido_id, :referencia, :evidencia, :archivo, :tipo_trazabilidad, :observacion, :usuario, :fecha, :hora, :empresa_id
      )
    ");

      $ruta = 'public/files/torrecontrol/trazabilidad/' . $datosArray[0]["referencia"] . '/';

      foreach ($datosArray as $datos) {
        $sqlInsert->bindValue(':pedido_id', $datos["pedido"]);
        $sqlInsert->bindValue(':referencia', $datos["referencia"]);
        $sqlInsert->bindValue(':evidencia', $ruta);
        $sqlInsert->bindValue(':archivo', $file);
        $sqlInsert->bindValue(':tipo_trazabilidad', $traza);
        $sqlInsert->bindValue(':observacion', $observacion);
        $sqlInsert->bindValue(':usuario', $user);
        $sqlInsert->bindValue(':fecha', $fecha);
        $sqlInsert->bindValue(':hora', $hora);
        $sqlInsert->bindValue(':empresa_id', $empresaId);
        if (!$sqlInsert->execute()) {
          throw new Exception("Error al insertar trazabilidad del pedido: " . $datos["pedido"]);
        }
      }

      $this->_db3->commit();

      $response = [
        'status' => 'success',
        'message' => 'Trazabilidad registrada exitosamente',
        'file' => $file
      ];
    } catch (Exception $e) {
      $this->_db3->rollBack();
      $response = [
        'status' => 'error',
        'message' => $e->getMessage()
      ];
    }

    return $response;
  }

  public function Listar_trazabilidad_pedido($PedidoId)
  {
    $sql = $this->_db3->prepare("SELECT
      tpt.tipo_trazabilidad,tpt.observacion,tpt.usuario,CONCAT(tpt.fecha,'-',tpt.hora) AS fecha_registro,CONCAT(tpt.evidencia,tpt.archivo) AS evidencia
    FROM
      cmx_pedido_torre_control pt
      INNER JOIN cmx_trazabilidad_pedido_tr tpt ON pt.numdoc_solicitud = tpt.pedido_id 
    WHERE
      pt.numdoc_solicitud = :PedidoId
    GROUP BY tpt.fecha,tpt.hora");
    $sql->bindParam(':PedidoId', $PedidoId, PDO::PARAM_INT);
    $sql->execute();
    $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
    return $resultados;
  }

  public function detalle_trazabilidad_pedidos($RecursoId, $proveedorId)
  {

    if ($proveedorId) {
      $sql = $this->_db3->prepare("SELECT
      pt.referencia_pedido,
      pt.numdoc_solicitud 
    FROM
      cmx_recurso_pedido rp
      INNER JOIN cmx_cliente_proveedor_servicio cps ON rp.maestro_id = cps.recurso_id
      INNER JOIN cmx_pedido_torre_control pt ON cps.pedido_id = pt.numdoc_solicitud 
    WHERE cps.proveedor_id =:proveedorId AND
      rp.maestro_id =:RecursoId
    GROUP BY
      cps.pedido_id");
      $sql->bindParam(':RecursoId', $RecursoId, PDO::PARAM_INT);
      $sql->bindParam(':proveedorId', $proveedorId, PDO::PARAM_INT);
      $sql->execute();
      $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
    } else {
      $sql = $this->_db3->prepare("SELECT
        pt.referencia_pedido,
        pt.numdoc_solicitud 
      FROM
        cmx_recurso_pedido rp
        INNER JOIN cmx_cliente_proveedor_servicio cps ON rp.maestro_id = cps.recurso_id
        INNER JOIN cmx_pedido_torre_control pt ON cps.pedido_id = pt.numdoc_solicitud 
      WHERE
        rp.maestro_id =:RecursoId
      GROUP BY
        cps.pedido_id");
      $sql->bindParam(':RecursoId', $RecursoId, PDO::PARAM_INT);
      $sql->execute();
      $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    return $resultados;
  }

  public function Listar_detalle_trazabilidad_pedidos($RecursoId)
  {
    /* Consulta de la trazabilidad de los pedidos */
    $sql_trazabilidad = $this->_db3->prepare("SELECT
        tp.referencia,
        tp.observacion,
        CONCAT( tp.fecha, '-', tp.hora ) AS hora_registro,
        tp.usuario,
        CONCAT( tp.evidencia, tp.archivo ) AS evidencia,
        tp.tipo_trazabilidad
      FROM
        cmx_trazabilidad_pedido_tr tp
        INNER JOIN cmx_pedido_torre_control pt ON tp.pedido_id = pt.numdoc_solicitud
        INNER JOIN cmx_pedido_proveedor_estado pps ON tp.pedido_id = pps.pedido_id 
      WHERE pt.numdoc_solicitud = :RecursoId AND
       pps.estado_proceso_pedido = 'Completado'
       AND pps.estado_visualizar = 1
      ORDER BY
	     tp.referencia");
    $sql_trazabilidad->bindParam(':RecursoId', $RecursoId, PDO::PARAM_INT);
    $sql_trazabilidad->execute();
    $resultado_trazabilidad = $sql_trazabilidad->fetchAll(PDO::FETCH_ASSOC);

    return $resultado_trazabilidad;
  }

  public function importar_trazabilidad_pedido($globalData)
  {
    try {
      $date = new DateTime('now', new DateTimeZone('America/Bogota'));
      $fecha = $date->format('Y-m-d');
      $hora = $date->format('H:i:s');

      $session_empresa_id = $_SESSION['usuario']['empresa_id'];

      $this->_db3->beginTransaction();

      $sql_recurso = $this->_db3->prepare("
      SELECT referencia, pedido_id 
      FROM cmx_cliente_proveedor_servicio 
      WHERE pedido_id = :RecursoId
    ");

      $sql_insert = $this->_db3->prepare("
      INSERT INTO cmx_trazabilidad_pedido_tr (
        pedido_id,
        referencia,
        fecha_realizacion,
        hora_realizacion,
        tipo_trazabilidad,
        observacion,
        evidencia,
        archivo,
        usuario,
        fecha,
        hora,
        empresa_id
      ) VALUES (
        :pedido_id,
        :referencia,
        :fecha_realizacion,
        :hora_realizacion,
        :tipo_trazabilidad,
        :observacion,
        :evidencia,
        :archivo,
        :usuario,
        :fecha,
        :hora,
        :empresa_id
      )
    ");

      foreach ($globalData as $key => $value) {
        // Validaciones iniciales
        if (empty($value["id_pedido"])) {
          throw new Exception("Falta el recurso_id en la fila $key");
        }

        $RecursoId = $value["id_pedido"];

        // Buscar referencia y pedido_id reales en base de datos
        $sql_recurso->execute([':RecursoId' => $RecursoId]);
        $resultados = $sql_recurso->fetch(PDO::FETCH_ASSOC);

        if (!$resultados) {
          throw new Exception("No se encontrÃ³ el recurso con ID: $RecursoId en la fila $key");
        }

        // Validar que la referencia (placa) y pedido_id coinciden
        $placa_ganadora = $resultados['referencia'];
        $pedido_id_real = $resultados['pedido_id'];

        if ($value["placa"] != $placa_ganadora) {
          throw new Exception("La placa no coincide para el recurso_id $RecursoId en la fila $key. Esperado: $placa_ganadora, recibido: {$value['placa']}");
        }

        if ($value["id_pedido"] != $pedido_id_real) {
          throw new Exception("El pedido_id no coincide para el recurso_id $RecursoId en la fila $key. Esperado: $pedido_id_real, recibido: {$value['id_pedido']}");
        }

        // Si todo estÃ¡ bien, insertar
        $sql_insert->execute([
          ":pedido_id" => $value["id_pedido"],
          ":referencia" => $value["placa"],
          ":fecha_realizacion" => $value["fecha_realizaciÃ³n"] ?? null,
          ":hora_realizacion" => $value["hora_realizaciÃ³n"] ?? null,
          ":tipo_trazabilidad" => $value["tipo_trazabilidad"] ?? null,
          ":observacion" => $value["observaciÃ³n"] ?? null,
          ":evidencia" => null,
          ":archivo" => null,
          ":usuario" => $value["usuario"] ?? $_SESSION["usuario"]["nom_usuario"],
          ":fecha" => $fecha,
          ":hora" => $hora,
          ":empresa_id" => $session_empresa_id
        ]);
      }

      $this->_db3->commit();
      return ["status" => true, "message" => "Trazabilidad importada correctamente."];
    } catch (\Throwable $th) {
      $this->_db3->rollBack();
      return ["status" => false, "message" => "Error al importar la trazabilidad del pedido: " . $th->getMessage()];
    }
  }

  public function cancelar_solicitud_pedido_torre_control($SolicitudId)
  {
    try {
      $this->_db3->beginTransaction();
      $sql = $this->_db3->prepare("UPDATE cmx_pedido_torre_control SET estado_publicaion ='Cancelado', estado_asignacion ='Cancelado' WHERE numdoc_solicitud=:SolicitudId");
      $sql->bindParam(':SolicitudId', $SolicitudId, PDO::PARAM_INT);
      $sql->execute();
      $this->_db3->commit();
      return ["status" => true, "message" => "Solicitud cancelada correctamente."];
    } catch (\Throwable $th) {
      $this->_db3->rollBack();
      return ["status" => false, "message" => "Error al cancelar la solicitud: " . $th->getMessage()];
    }
  }

  public function cancelar_asignacion_recurso_torre_control($RecursoId)
  {
    try {
      $this->_db3->beginTransaction();

      // 1. Cancelar en cmx_recurso_pedido
      $sql_update = $this->_db3->prepare("UPDATE cmx_recurso_pedido SET estado = 'Cancelado' WHERE maestro_id = :RecursoId");
      $sql_update->bindParam(':RecursoId', $RecursoId, PDO::PARAM_INT);
      if (!$sql_update->execute()) {
        throw new Exception('Error al cancelar en cmx_recurso_pedido');
      }

      // 2.1. Obtener los pedido_id asociados al recurso
      $sql_select_pedidos = $this->_db3->prepare("SELECT pedido_id FROM cmx_cliente_proveedor_servicio WHERE recurso_id = :RecursoId");
      $sql_select_pedidos->bindParam(':RecursoId', $RecursoId, PDO::PARAM_INT);
      if (!$sql_select_pedidos->execute()) {
        throw new Exception('Error al obtener pedidos asociados al recurso');
      }

      // Guardar todos los pedido_id en un array
      $pedidoIds = $sql_select_pedidos->fetchAll(PDO::FETCH_COLUMN);

      if (empty($pedidoIds)) {
        throw new Exception('No se encontraron pedidos asociados al recurso');
      }

      // 2.2. Cancelar en cmx_cliente_proveedor_servicio
      $sql_update_pedido = $this->_db3->prepare("UPDATE cmx_cliente_proveedor_servicio SET estado_pedido_asignado = 'Cancelado', proceso='Pendiente' WHERE recurso_id = :RecursoId");
      $sql_update_pedido->bindParam(':RecursoId', $RecursoId, PDO::PARAM_INT);
      if (!$sql_update_pedido->execute()) {
        throw new Exception('Error al cancelar en cmx_cliente_proveedor_servicio');
      }

      // 3. Cancelar en cmx_pedido_proveedor_estado
      $sql_update_estado = $this->_db3->prepare("UPDATE cmx_pedido_proveedor_estado SET estado_visualizar = 1, estado_proceso_pedido = 'Cancelado' WHERE recurso_id = :RecursoId");
      $sql_update_estado->bindParam(':RecursoId', $RecursoId, PDO::PARAM_INT);
      if (!$sql_update_estado->execute()) {
        throw new Exception('Error al cancelar en cmx_pedido_proveedor_estado');
      }

      // 4. Actualizar el estado_actual a 0
      $sql_update_historico = $this->_db3->prepare("UPDATE cmx_estado_historico_recurso SET estado_actual = 1, estado_recurso = 'Cancelado' WHERE recurso_id = :RecursoId");
      $sql_update_historico->bindParam(':RecursoId', $RecursoId, PDO::PARAM_INT);
      if (!$sql_update_historico->execute()) {
        throw new Exception('Error al actualizar el estado_actual en cmx_estado_historico_recurso');
      }

      // 5. Actualizar los estados de los pedidos asociados
      if (!empty($pedidoIds)) {
        $placeholders = implode(',', array_fill(0, count($pedidoIds), '?'));
        $sql_update_pedidos_estado = $this->_db3->prepare("
            UPDATE cmx_pedido_torre_control
            SET estado_publicaion = 'Pendiente', estado_asignacion = 'Pendiente'
            WHERE numdoc_solicitud IN ($placeholders)
        ");

        if (!$sql_update_pedidos_estado->execute($pedidoIds)) {
          throw new Exception('Error al actualizar el estado de los pedidos asociados');
        }
      }

      // Si todo saliÃ³ bien
      $this->_db3->commit();

      return [
        'success' => true,
        'message' => 'La asignaciÃ³n del recurso fue cancelada exitosamente.'
      ];
    } catch (Exception $e) {
      $this->_db3->rollBack();

      return [
        'success' => false,
        'message' => 'Error al cancelar la asignaciÃ³n del recurso: ' . $e->getMessage()
      ];
    }
  }

  public function Listar_informes_torre_control($FechaInicio, $FechaFin, $Filtro)
  {
    $response = [];
    if (isset($FechaInicio) && isset($FechaFin) && isset($Filtro)) {
      if ($Filtro == 'informe simplificado') {
        // Base de la consulta SOLO con FROM
        $sql = "FROM cmx_pedido_torre_control pt
          INNER JOIN cmx_clientes cl ON pt.cliente = cl.id ";

        // Dependiendo del estado, agregamos el JOIN a cps
        $sql .= "LEFT JOIN cmx_cliente_proveedor_servicio cps ON pt.numdoc_solicitud = cps.pedido_id ";
        $sql .= "   LEFT JOIN (
              SELECT
                t1.pedido_id,
                t1.tipo_trazabilidad
              FROM
                cmx_trazabilidad_pedido_tr t1
                INNER JOIN (
                  SELECT
                    pedido_id,
                    MAX(CONCAT(fecha, ' ', hora)) AS max_fecha_hora
                  FROM
                    cmx_trazabilidad_pedido_tr
                  GROUP BY pedido_id
                ) t2 ON t1.pedido_id = t2.pedido_id
                AND CONCAT(t1.fecha, ' ', t1.hora) = t2.max_fecha_hora
            ) tp ON pt.numdoc_solicitud = tp.pedido_id";
        $sql .= " LEFT JOIN cmx_pedido_proveedor_estado ppe ON cps.recurso_id=ppe.recurso_id AND ppe.estado_visualizar=1 AND ppe.estado_proceso_pedido='Postulado'";


        // Ahora construyes el SELECT ya sabiendo quÃ© tablas estÃ¡n disponibles
        $sql = "	SELECT
        pt.id,
        pt.numdoc_solicitud,
        pt.referencia_pedido,
        pt.cliente,
        pt.ciudad_origen,
        pt.remitente,
        pt.ciudad_destino,
        pt.destinatario,
        pt.cod_producto,
        pt.producto,
        pt.peso_neto_kg,
        pt.peso_bruto_kg,
        pt.presentacion,
        pt.unidades,
        pt.lote,
        pt.num_estibas,
        CONCAT(pt.fecha_cargue, '-', pt.hora_cargue) AS fecha_cargue,
        CONCAT(pt.fecha_entrega, '-', pt.hora_entrega) AS fecha_entrega,
        pt.estado_publicaion,
        pt.estado_asignacion,
        pt.usuario,
        pt.fecha,
        pt.hora,
        cl.nombre AS nombre_cliente,
        pt.estado_prioridad,
        pt.referencia_pedido,
        cps.recurso_id,
        cps.serivicio_id,
        IFNULL(
          tp.tipo_trazabilidad,
          IFNULL(
            (
              SELECT
                ehr.estado_recurso 
              FROM
                cmx_recurso_pedido rp1
                INNER JOIN cmx_estado_historico_recurso ehr ON rp1.maestro_id = ehr.recurso_id 
              WHERE
                rp1.maestro_id = cps.recurso_id 
                AND ehr.estado_actual = 1 
                LIMIT 1 
              ),
              'Sin Asignar' 
            ) 
          ) AS tipo_trazabilidad,
        IFNULL(cps.proceso, 'Pendiente') AS estado_proceso,
        ppe.estado_proceso_pedido
      " . $sql;  // <-- AquÃ­ unes el FROM + JOIN

        // Luego siguen los filtros
        $where = [];
        $bindParams = [];

        $where[] = "pt.fecha BETWEEN :fecha_inicial AND :fecha_final";
        $bindParams[":fecha_inicial"] = $FechaInicio;
        $bindParams[":fecha_final"] = $FechaFin;

        if (!empty($where)) {
          $sql .= " WHERE " . implode(" AND ", $where);
        }

        $sql .= " GROUP BY pt.numdoc_solicitud";

        // Preparar, bindear y ejecutar
        $stmt = $this->_db3->prepare($sql);
        foreach ($bindParams as $param => $value) {
          $stmt->bindValue($param, $value);
        }
        $stmt->execute();
        $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
      } else if ($Filtro == 'informe detallado') {
        // Base de la consulta SOLO con FROM
        $sql = "FROM cmx_pedido_torre_control pt
                INNER JOIN cmx_clientes cl ON pt.cliente = cl.id ";

        // Dependiendo del estado, agregamos el JOIN a cps
        $sql .= "LEFT JOIN cmx_cliente_proveedor_servicio cps ON pt.numdoc_solicitud = cps.pedido_id ";
        $sql .= "   LEFT JOIN (
                    SELECT DISTINCT 
                      t1.pedido_id,
                      t1.tipo_trazabilidad
                    FROM
                      cmx_trazabilidad_pedido_tr t1
                      INNER JOIN (
                        SELECT
                          pedido_id,
                          MAX(CONCAT(fecha, ' ', hora)) AS max_fecha_hora
                        FROM
                          cmx_trazabilidad_pedido_tr
                        GROUP BY pedido_id
                      ) t2 ON t1.pedido_id = t2.pedido_id
                      AND CONCAT(t1.fecha, ' ', t1.hora) = t2.max_fecha_hora
                      WHERE t1.tipo_trazabilidad IS NOT NULL
                  ) tp ON pt.numdoc_solicitud = tp.pedido_id";

        $sql .= " LEFT JOIN cmx_pedido_proveedor_estado ppe ON cps.recurso_id=ppe.recurso_id AND ppe.estado_visualizar=1 AND ppe.estado_proceso_pedido='Postulado'";


        // Ahora construyes el SELECT ya sabiendo quÃ© tablas estÃ¡n disponibles
        $sql = "	SELECT
              pt.id,
              pt.numdoc_solicitud,
              pt.referencia_pedido,
              pt.cliente,
              pt.ciudad_origen,
              pt.remitente,
              pt.ciudad_destino,
              pt.destinatario,
              pt.cod_producto,
              pt.producto,
              pt.peso_neto_kg,
              pt.peso_bruto_kg,
              pt.presentacion,
              pt.unidades,
              pt.lote,
              pt.num_estibas,
              CONCAT(pt.fecha_cargue, '-', pt.hora_cargue) AS fecha_cargue,
              CONCAT(pt.fecha_entrega, '-', pt.hora_entrega) AS fecha_entrega,
              pt.estado_publicaion,
              pt.estado_asignacion,
              pt.usuario,
              pt.fecha,
              pt.hora,
              cl.nombre AS nombre_cliente,
              pt.estado_prioridad,
              pt.referencia_pedido,
              cps.recurso_id,
              cps.serivicio_id,
              IFNULL(
                tp.tipo_trazabilidad,
                IFNULL(
                  (
                    SELECT
                      ehr.estado_recurso 
                    FROM
                      cmx_recurso_pedido rp1
                      INNER JOIN cmx_estado_historico_recurso ehr ON rp1.maestro_id = ehr.recurso_id 
                    WHERE
                      rp1.maestro_id = cps.recurso_id 
                      -- AND ehr.estado_actual = 1 
                      LIMIT 1 
                    ),
                    'Sin Asignar' 
                  ) 
                ) AS tipo_trazabilidad,
              IFNULL(cps.proceso, 'Pendiente') AS estado_proceso,
              ppe.estado_proceso_pedido
            " . $sql;  // <-- AquÃ­ unes el FROM + JOIN

        // Luego siguen los filtros
        $where = [];
        $bindParams = [];

        $where[] = "pt.fecha BETWEEN :fecha_inicial AND :fecha_final";
        $bindParams[":fecha_inicial"] = $FechaInicio;
        $bindParams[":fecha_final"] = $FechaFin;

        if (!empty($where)) {
          $sql .= " WHERE " . implode(" AND ", $where);
        }

        // Preparar, bindear y ejecutar
        $stmt = $this->_db3->prepare($sql);
        foreach ($bindParams as $param => $value) {
          $stmt->bindValue($param, $value);
        }
        $stmt->execute();
        $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
      }
    }

    return $response;
  }

  public function Inactivar_plantilla($plantillaId, $Proceso)
  {
    $response = [];

    if ($Proceso == 'Inactiva') {  // Inactivar la Plantilla
      $sql = $this->_db3->prepare("UPDATE cmx_plantilla SET estado_plantilla='INACTIVA' WHERE numdoc=:NumdocSolicitud");
      $sql->bindParam(':NumdocSolicitud', $plantillaId, PDO::PARAM_INT);
      $sql->execute();
    } else {
      $sql = $this->_db3->prepare("UPDATE cmx_plantilla SET estado_plantilla='ACTIVA' WHERE numdoc=:NumdocSolicitud");
      $sql->bindParam(':NumdocSolicitud', $plantillaId, PDO::PARAM_INT);
      $sql->execute();
    }

    if ($sql->rowCount() > 0) {
      $response = [
        'success' => true,
        'message' => 'La plantilla fue ' . $Proceso . 'da exitosamente.',
      ];
    } else {
      $response = [
        'success' => false,
        'message' => 'No se pudo ' . $Proceso . 'ar la plantilla.',
      ];
    }
    return $response;
  }

  public function Servicios_Especiales()
  {
    $sql = $this->_db3->prepare('SELECT * FROM cmx_para_tipo_sevicio WHERE tipificacion="Especial" AND estado="activo"');
    $sql->execute();
    $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
    return $resultados;
  }

  public function Listar_Servicios_Especiales_Proveedor($proveedorId, $RecursoId)
  {
    $sql = $this->_db3->prepare("
    SELECT 
      sr.servicio_especial,
      ts.nombre,
      sr.valor_servicio,
      sr.estado_servicio_especial,
      pt.razon_social,
      sr.proveedor_id
    FROM cmx_servicio_especial_recurso_tr sr
    INNER JOIN cmx_para_tipo_sevicio ts ON sr.servicio_especial = ts.id AND ts.tipificacion = 'Especial' AND ts.estado = 'activo'
    INNER JOIN cmx_proveedor_torre_control pt ON sr.proveedor_id = pt.id
    WHERE sr.recurso_id = :RecursoId AND sr.proveedor_id=:proveedorId
    GROUP BY pt.razon_social, sr.servicio_especial, ts.nombre, sr.valor_servicio, sr.estado_servicio_especial");
    $sql->bindParam(':RecursoId', $RecursoId, PDO::PARAM_INT);
    $sql->bindParam(':proveedorId', $proveedorId, PDO::PARAM_INT);
    $sql->execute();
    $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
    return $resultados;
  }

  public function Actualizar_valor_servicio($servicio_id, $proveedor_id, $valor, $maestro_id)
  {
    $sql_update = $this->_db3->prepare("UPDATE cmx_servicio_especial_recurso_tr SET valor_servicio = :valor, estado_servicio_especial = 'Postulado'
    WHERE servicio_especial = :servicio_id AND proveedor_id = :proveedor_id AND recurso_id = :maestro_id");
    $sql_update->bindParam(':valor', $valor, PDO::PARAM_STR);
    $sql_update->bindParam(':servicio_id', $servicio_id, PDO::PARAM_INT);
    $sql_update->bindParam(':proveedor_id', $proveedor_id, PDO::PARAM_INT);
    $sql_update->bindParam(':maestro_id', $maestro_id, PDO::PARAM_INT);
    $sql_update->execute();

    if ($sql_update->rowCount() > 0) {
      return [
        'success' => true,
        'message' => 'El valor del servicio fue actualizado exitosamente.',
      ];
    } else {
      return [
        'success' => false,
        'message' => 'No se pudo actualizar el valor del servicio.',
      ];
    }
  }

  public function Cancelar_Servicio_Especial($RecursoId, $ServicioId, $ProveedorId)
  {
    $sql_update = $this->_db3->prepare("UPDATE cmx_servicio_especial_recurso_tr SET estado_servicio_especial = 'Cancelado'
    WHERE recurso_id = :recursoid AND servicio_especial = :servicioId AND proveedor_id = :proveedorId");
    $sql_update->bindParam(':recursoid', $RecursoId, PDO::PARAM_INT);
    $sql_update->bindParam(':servicioId', $ServicioId, PDO::PARAM_INT);
    $sql_update->bindParam(':proveedorId', $ProveedorId, PDO::PARAM_INT);
    $sql_update->execute();
    if ($sql_update->rowCount() > 0) {
      return [
        'success' => true,
        'message' => 'El servicio fue cancelado exitosamente.',
      ];
    } else {
      return [
        'success' => false,
        'message' => 'El servicio no fue cancelado.',
      ];
    }
  }

  public function Aprobar_Servicio_Especial($RecursoId, $ServicioId, $ProveedorId)
  {
    $sql_update = $this->_db3->prepare("UPDATE cmx_servicio_especial_recurso_tr SET estado_servicio_especial = 'Aprobado'
    WHERE recurso_id = :recursoid AND servicio_especial = :servicioId AND proveedor_id = :proveedorId");
    $sql_update->bindParam(':recursoid', $RecursoId, PDO::PARAM_INT);
    $sql_update->bindParam(':servicioId', $ServicioId, PDO::PARAM_INT);
    $sql_update->bindParam(':proveedorId', $ProveedorId, PDO::PARAM_INT);
    $sql_update->execute();
    if ($sql_update->rowCount() > 0) {
      return [
        'success' => true,
        'message' => 'El servicio fue Aprobado exitosamente.',
      ];
    } else {
      return [
        'success' => false,
        'message' => 'El servicio no fue aprobado.',
      ];
    }
  }

  public function Rechazar_Servicio_Especial($RecursoId, $ServicioId, $ProveedorId)
  {
    $sql_update = $this->_db3->prepare("UPDATE cmx_servicio_especial_recurso_tr SET estado_servicio_especial = 'Rechazado'
    WHERE recurso_id = :recursoid AND servicio_especial = :servicioId AND proveedor_id = :proveedorId");
    $sql_update->bindParam(':recursoid', $RecursoId, PDO::PARAM_INT);
    $sql_update->bindParam(':servicioId', $ServicioId, PDO::PARAM_INT);
    $sql_update->bindParam(':proveedorId', $ProveedorId, PDO::PARAM_INT);
    $sql_update->execute();
    if ($sql_update->rowCount() > 0) {
      return [
        'success' => true,
        'message' => 'El servicio fue rechazado.',
      ];
    } else {
      return [
        'success' => false,
        'message' => 'El servicio no fue rechazado.',
      ];
    }
  }

  public function Agregar_Servicio_Especial($RecursoId, $ArrayProveedorId, $ArrayServicioId, $ArrayPedidoId, $ArrayServicioEspId)
  {

    try {
      // Obtener usuario y empresa desde la sesiÃ³n
      $nom_usuario = $_SESSION['usuario']['nom_usuario'] ?? null;
      $session_empresa_id = $_SESSION['usuario']['empresa_id'] ?? null;
      $PorveedorId = $_SESSION['usuario']['proveedor_id'] ?? null;

      // 1. Crea un objeto DateTime en BogotÃ¡
      $date = new DateTime('now', new DateTimeZone('America/Bogota'));

      // 3. Saca fecha y hora
      $fecha = $date->format('Y-m-d'); // Fecha correcta
      $hora = $date->format('H:i:s');  // Hora correcta

      // Iniciar transacciÃ³n
      $this->_db3->beginTransaction();
      $valor_servicio = 0;
      $estado_ser = "Solicitado";
      foreach ($ArrayServicioEspId as $ArrayServicioEsp) {

        // Insertar nuevo registro en cmx_servicio_especial_recurso_tr
        $sql_insert = $this->_db3->prepare("INSERT INTO cmx_servicio_especial_recurso_tr  (servicio_id, proveedor_id, recurso_id, servicio_especial, valor_servicio, estado_servicio_especial, usuario,fecha, hora, empresa_id)
                                                        VALUES (:servicio_id, :proveedor_id, :recurso_id, :servicio_especial, :valor_servicio, :estado_servicio_especial, :usuario, :fecha, :hora, :empresa_id)");
        // $sql_insert->bindParam(':pedido_id', $pedido, PDO::PARAM_INT);
        $sql_insert->bindParam(':servicio_id', $ArrayServicioId, PDO::PARAM_INT);
        $sql_insert->bindParam(':proveedor_id', $ArrayProveedorId, PDO::PARAM_INT);
        $sql_insert->bindParam(':recurso_id', $RecursoId, PDO::PARAM_INT);
        $sql_insert->bindParam(':servicio_especial', $ArrayServicioEsp, PDO::PARAM_INT);
        $sql_insert->bindParam(':valor_servicio', $valor_servicio, PDO::PARAM_STR);
        $sql_insert->bindParam(':estado_servicio_especial', $estado_ser, PDO::PARAM_STR);
        $sql_insert->bindParam(':usuario', $nom_usuario, PDO::PARAM_STR);
        $sql_insert->bindParam(':fecha', $fecha, PDO::PARAM_STR);
        $sql_insert->bindParam(':hora', $hora, PDO::PARAM_STR);
        $sql_insert->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);

        if (!$sql_insert->execute()) {
          throw new Exception('Error al insertar cmx_pedido_proveedor_estado.');
        }
      }

      $this->_db3->commit();
      return [
        'status' => true,
        'message' => 'Se registraron los servicios.'
      ];
    } catch (Exception $e) {
      // Revertir la transacciÃ³n en caso de error
      $this->_db3->rollBack();

      return [
        'status' => false,
        'message' => $e->getMessage()
      ];
    }
  }

  public function Filtros_indicadores_torre_control($Filtro)
  {
    if ($Filtro == 'AÃ±o') {
      $sql = $this->_db3->prepare("SELECT DISTINCT year_calculo FROM cmx_indicadores_proveedor_torre_control");
    } else if ($Filtro == 'Proveedor') {
      $sql = $this->_db3->prepare("SELECT DISTINCT id,razon_social FROM cmx_proveedor_torre_control WHERE estado_proveedor = 'Activo'");
    } else if ($Filtro == "informe detallado") {
      $sql = $this->_db3->prepare("SELECT DISTINCT tipo_trazabilidad FROM cmx_trazabilidad_pedido_tr WHERE tipo_trazabilidad IS NOT NULL");
    } else {
      $sql = $this->_db3->prepare("SELECT DISTINCT tipo_trazabilidad FROM cmx_trazabilidad_pedido_tr WHERE tipo_trazabilidad IS NOT NULL");
    }
    $sql->execute();
    $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
    return $resultados;
  }

  public function Editar_plantilla($plantillaId)
  {
    $response = [];
    $sql = $this->_db3->prepare("SELECT numdoc,nombre_plantilla,proveedor_id,modalidad FROM cmx_plantilla WHERE numdoc=:NumdocSolicitud");
    $sql->bindParam(':NumdocSolicitud', $plantillaId, PDO::PARAM_INT);
    $sql->execute();
    $resultados = $sql->fetch(PDO::FETCH_ASSOC);

    if (!empty($resultados)) {
      $sql_parametros = $this->_db3->prepare("SELECT tipo_proceso_id,estado_seleccion FROM cmx_detalle_plantilla_parametros WHERE numdoc_plantilla=:NumdocSolicitud");
      $sql_parametros->bindParam(':NumdocSolicitud', $plantillaId, PDO::PARAM_INT);
      $sql_parametros->execute();
      $resultados_parametros = $sql_parametros->fetchAll(PDO::FETCH_ASSOC);

      if (!empty($resultados_parametros)) {
        $sql_activiades = $this->_db3->prepare('SELECT detalle_actividad_plantilla,responsable,criterio_calculo,valor_minutos,estado_seleccion,medida_tiempo,detalle_actividad,posicion
        FROM cmx_plantilla_actividad WHERE numdoc_detalle_plantilla = :NumdocSolicitud');
        $sql_activiades->bindParam(':NumdocSolicitud', $plantillaId, PDO::PARAM_INT);
        $sql_activiades->execute();
        $resultados_actividades = $sql_activiades->fetchAll(PDO::FETCH_ASSOC);
        $response = ["cabecera" => $resultados, "detalle_parmetros" => $resultados_parametros, "detalle_actividades" => $resultados_actividades];
      }
    }
    return $response;
  }

  public function Aplicar_filtro_indicador($Filtro, $Year = null, $Mes = null, $Proveedor = null)
  {
    $response = [];
    $sqlParams = [];

    if ($Proveedor == "todos") {
      $sqlBase = "SELECT it.id AS indicador_id,it.nombre_indicador,
                        FORMAT(if(it.id = 1 or it.id = 5 OR it.id = 6 OR it.id = 7,((1-sum(ip.numerador)/SUM(ip.denominador))*100),if(it.id=9,100,(sum(ip.numerador)/SUM(ip.denominador)*100) )   ),1) AS total_porcentaje,
                        ip.mes_calculo,
                        ip.year_calculo,
                        pt.razon_social,
                        it.frecuencia,
                        it.forma_calculo
                        FROM cmx_indicadores_proveedor_torre_control ip
                        INNER JOIN cmx_proveedor_torre_control pt ON ip.id_proveedor = pt.id
                        INNER JOIN cmx_indicadores_torre_control it ON ip.id_indicador = it.id
                        WHERE mes_calculo = :mes AND year_calculo = :year_id
                        GROUP BY indicador_id, it.nombre_indicador";
    } else {

      $sqlBase = " SELECT it.id AS indicador_id,it.nombre_indicador,
                        ip.porcentaje_cumplimiento as total_porcentaje,
                        ip.mes_calculo,
                        ip.year_calculo,
                        pt.razon_social,
                        it.frecuencia,
                        it.forma_calculo
                        FROM cmx_indicadores_proveedor_torre_control ip
                        INNER JOIN cmx_proveedor_torre_control pt ON ip.id_proveedor = pt.id
                        INNER JOIN cmx_indicadores_torre_control it ON ip.id_indicador = it.id
                        WHERE pt.id = :proveedor_id AND mes_calculo = :mes AND year_calculo = :year_id
                        GROUP BY indicador_id, it.nombre_indicador";
    }

    // Preparar y ejecutar la consulta
    try {
      $sql = $this->_db3->prepare($sqlBase);

      $Proveedor == 'todos' ?: $sql->bindParam(':proveedor_id', $Proveedor, PDO::PARAM_STR);
      $sql->bindParam(':mes', $Mes, PDO::PARAM_STR);
      $sql->bindParam(':year_id', $Year, PDO::PARAM_STR);
      $Proveedor <> 'todos' ?: $sql->bindParam(':mes', $Mes, PDO::PARAM_STR);
      $sql->bindParam(':year_id', $Year, PDO::PARAM_STR);


      $sql->execute();
      $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);

      // Procesar los resultados para la respuesta
      foreach ($resultados as $item) {
        $resultadosArray[] = [
          'mes' => $item['mes_calculo'],
          'year' => $item['year_calculo'],
          'valor_indicador' => $item['total_porcentaje'],
          'porcentaje_cumplimiento' => $item['total_porcentaje'],
          'razon_social' => $item['razon_social'],
          'nombre_indicador' => $item['nombre_indicador'],
          'indicador_id' => $item['indicador_id'],
          'forma_calculo' => $item['forma_calculo'],
          'frecuencia' => $item['frecuencia']
        ];
      }

      /* Consultar valores porcentuales */

      if ($Proveedor == 'todos') {
        # code...
        $sql = $this->_db3->prepare("SELECT ip.nombre_indicador,FORMAT((Sum(id.valor_indicador)/COUNT(ip.nombre_indicador)),2) AS SUM_TOTAL 
        FROM cmx_indicadores_proveedor_torre_control id 
        INNER JOIN cmx_indicadores_torre_control ip  ON id.id_indicador = ip.id
        WHERE id.mes_calculo = :Mes AND id.year_calculo = :Year GROUP BY ip.nombre_indicador");
        $sql->bindParam(':Mes', $Mes, PDO::PARAM_STR);
        $sql->bindParam(':Year', $Year, PDO::PARAM_STR);
      } else {
        $sql = $this->_db3->prepare("SELECT it.valor_indicador,ni.nombre_indicador
        FROM cmx_indicadores_proveedor_torre_control it 
        INNER JOIN cmx_proveedor_torre_control pr  ON it.id_proveedor = pr.id 
        INNER JOIN cmx_indicadores_torre_control ni ON it.id_indicador = ni.id WHERE  pr.id = :Proveedor AND it.mes_calculo = :Mes AND it.year_calculo = :Year");
        $sql->bindParam(':Proveedor', $Proveedor, PDO::PARAM_STR);
        $sql->bindParam(':Mes', $Mes, PDO::PARAM_STR);
        $sql->bindParam(':Year', $Year, PDO::PARAM_STR);
      }

      $sql->execute();
      $resultados_porcentuales = $sql->fetchAll(PDO::FETCH_ASSOC);

      $response = [
        'data' => $resultadosArray,
        'porcentuales' => $resultados_porcentuales
      ];

      return $response;
    } catch (PDOException $e) {
      // Manejo de errores
      return ['error' => 'Error en la consulta: ' . $e->getMessage()];
    }
  }

  public function Insertar_gestion_pedido($datos)
  {
    $fecha = date("Y-m-d");
    $hora  = date("H:i:s");
    $fechaHora = date("Y-m-d H:i:s");
    $user = $_SESSION["usuario"]["nom_usuario"] ?? 'Sistema';

    $ruta = 'public/files/gestion/' . $datos["nundoc"] . '/';

    /* ======================================================
     * 1. NORMALIZACIÓN DE DOCUMENTOS (CLAVE)
     * ====================================================== */
    $documentos = $datos['documentos'] ?? null;

    $tieneEvidencia = false;
    $esMultiple = false;

    if ($documentos === 'Sin_evidencia' || $documentos === null) {
      $tieneEvidencia = false;
    } elseif (is_array($documentos)) {
      $tieneEvidencia = true;
      $esMultiple = isset($documentos[0]) && is_array($documentos[0]);
    }

    /* ======================================================
     * 2. CREAR CARPETA SI NO EXISTE
     * ====================================================== */
    if (!is_dir($ruta)) {
      mkdir($ruta, 0775, true);
    } else {
      chmod($ruta, 0775);
    }

    /* ======================================================
     * 3. VALIDAR ACTIVIDAD DEPENDIENTE
     * ====================================================== */
    $sqlSelect = $this->_db3->prepare("
        SELECT COUNT(*) AS registro
        FROM cmx_actividad_dependiente
        WHERE actividad_dependiente = :Actividad
          AND numdoc_proceso = :Nundoc
    ");
    $sqlSelect->bindParam(':Actividad', $datos["parametros_punto_pedido_opcion"], PDO::PARAM_STR);
    $sqlSelect->bindParam(':Nundoc', $datos["nundoc"], PDO::PARAM_STR);
    $sqlSelect->execute();
    $resultado = $sqlSelect->fetch(PDO::FETCH_ASSOC);

    /* ======================================================
     * 4. ACTUALIZAR ESTADO DE ACTIVIDAD
     * ====================================================== */
    if ($resultado["registro"] > 0 && $datos["estado_actividad"] === 'COMPLETADO') {
      $sql_update = $this->_db3->prepare("
            UPDATE cmx_detalle_opcion_trazabilidad
            SET estado_actividad = :Estado,
                fecha_base = :Fecha,
                hora_base = :Hora,
                costo_actividad = :Costo
            WHERE numdoc_detalle_opcion = :Nundoc
              AND detalle_proceso = :Actividad
        ");
      $sql_update->bindParam(':Estado', $datos["estado_actividad"]);
      $sql_update->bindParam(':Fecha', $fecha);
      $sql_update->bindParam(':Hora', $hora);
      $sql_update->bindParam(':Costo', $datos["costo_ejecutado"]);
      $sql_update->bindParam(':Nundoc', $datos["nundoc"]);
      $sql_update->bindParam(':Actividad', $datos["parametros_punto_pedido_opcion"]);
    } else {
      $sql_update = $this->_db3->prepare("
            UPDATE cmx_detalle_opcion_trazabilidad
            SET estado_actividad = :Estado
            WHERE numdoc_detalle_opcion = :Nundoc
              AND detalle_proceso = :Actividad
        ");
      $sql_update->bindParam(':Estado', $datos["estado_actividad"]);
      $sql_update->bindParam(':Nundoc', $datos["nundoc"]);
      $sql_update->bindParam(':Actividad', $datos["parametros_punto_pedido_opcion"]);
    }

    if (!$sql_update->execute()) {
      return [
        'numero' => 400,
        'mensaje' => '<strong>Error!</strong> No se pudo actualizar la actividad.'
      ];
    }

    /* ======================================================
     * 5. INSERTAR GESTIÓN (CON O SIN EVIDENCIA)
     * ====================================================== */

    // --- CASO A: SIN EVIDENCIA ---
    if (!$tieneEvidencia) {

      $sql = $this->_db3->prepare("
            INSERT INTO cmx_pedidos_solicitudes_detalles
            (num_pedido, parametro_id, punto_opcion_id, observacion,
             documento, nombre_archivo, se_publica, fecha, usuario, estado)
            VALUES
            (:num_pedido, :parametro_id, :punto_opcion_id, :observacion,
             NULL, 'Sin_evidencia', :se_publica, :fecha, :usuario, :estado)
        ");

      $sql->execute([
        ':num_pedido'   => $datos["nundoc"],
        ':parametro_id' => $datos["parametros_pedido"],
        ':punto_opcion_id' => $datos["parametros_punto_pedido_opcion"],
        ':observacion'  => $datos["observacion"],
        ':se_publica'   => $datos["publicar"],
        ':fecha'        => $fechaHora,
        ':usuario'      => $user,
        ':estado'       => $datos["estado"]
      ]);

      return [
        'numero' => 200,
        'mensaje' => '<strong>Mensaje!</strong> Gestión registrada sin evidencia.'
      ];
    }

    // --- CASO B: EVIDENCIA (ÚNICA O MÚLTIPLE) ---
    $values = [];
    $params = [];

    $archivos = $esMultiple ? $documentos : [$documentos];

    foreach ($archivos as $archivo) {

      if (!isset($archivo['tmp_name']) || empty($archivo['name'])) {
        continue;
      }

      $nombreArchivo = basename($archivo['name']);
      $destino = $ruta . $nombreArchivo;
      move_uploaded_file($archivo['tmp_name'], $destino);

      $values[] = "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      $params[] = $datos["nundoc"];
      $params[] = $datos["parametros_pedido"];
      $params[] = $datos["parametros_punto_pedido_opcion"];
      $params[] = $datos["observacion"];
      $params[] = $ruta;
      $params[] = $nombreArchivo;
      $params[] = $datos["publicar"];
      $params[] = $fechaHora;
      $params[] = $user;
      $params[] = $datos["estado"];
    }

    if (empty($values)) {
      return [
        'numero' => 400,
        'mensaje' => '<strong>Error!</strong> No se encontraron archivos válidos.'
      ];
    }

    $sqlInsert = "
        INSERT INTO cmx_pedidos_solicitudes_detalles
        (num_pedido, parametro_id, punto_opcion_id, observacion,
         documento, nombre_archivo, se_publica, fecha, usuario, estado)
        VALUES " . implode(", ", $values);

    $stmt = $this->_db3->prepare($sqlInsert);
    $resultado = $stmt->execute($params);

    if ($resultado) {
      return [
        'numero' => 200,
        'mensaje' => '<strong>Mensaje!</strong> Gestión registrada exitosamente.'
      ];
    }

    return [
      'numero' => 400,
      'mensaje' => '<strong>Error!</strong> No se pudo registrar la gestión.'
    ];
  }

  public function Insertar_actividad($id_tipo_padre, $nombre_operacion)
  {

    $response = [];
    $estado_opcion = 'ACTIVO';
    $sql = $this->_db3->prepare("INSERT INTO cmx_tipo_opcion_trazabilidad(tipo_trazabilidad,nombre_opcion,estado_opcion) 
    VALUES(:tipo_trazabilidad,:nombre_opcion,:estado_opcion)");

    $sql->bindParam(':tipo_trazabilidad', $id_tipo_padre, PDO::PARAM_INT);
    $sql->bindParam(':nombre_opcion', $nombre_operacion, PDO::PARAM_STR);
    $sql->bindParam(':estado_opcion', $estado_opcion, PDO::PARAM_STR);
    $sql->execute();

    if ($sql) {
      $response = [
        'numero' => 200,
        'mensaje' => '<strong>Mensaje!</strong> OperaciÃ³n registrada exitosamente.',
      ];
    } else {
      $response = [
        'numero' => 400,
        'mensaje' => '<strong>Mensaje!</strong> OperaciÃ³n no registrada.',
      ];
    }

    return $response;
  }

  public function Editar_actividad($id, $nombre, $estado)
  {
    $response = [];
    $sql = $this->_db3->prepare("UPDATE cmx_tipo_opcion_trazabilidad SET nombre_opcion = :nombre, estado_opcion = :estado WHERE id = :id");
    $sql->bindParam(':nombre', $nombre);
    $sql->bindParam(':estado', $estado);
    $sql->bindParam(':id', $id, PDO::PARAM_INT);
    $success = $sql->execute();

    $response = [
      'numero' => $success ? 200 : 500,
      'mensaje' => $success ? 'Actividad actualizada correctamente.' : 'Error al actualizar.'
    ];
    return $response;
  }

  public function Rechazar_recurso($recurso_id)
  {
    $response = [];
    $proveedor = $_SESSION['usuario']['proveedor_id'];
    $usuario = $_SESSION['usuario']['nom_usuario'];
    $empresa = $_SESSION['usuario']['empresa_id'];
    $estado = "Rechazado";
    $fecha = date('Y-m-d');
    $hora = date('H:i:s');
    try {
      $this->_db3->beginTransaction();
      $sql = $this->_db3->prepare("UPDATE cmx_cliente_proveedor_servicio SET estado_pedido_asignado = :estado WHERE recurso_id = :id and proveedor_id = :proveedor");
      $sql->bindParam(':estado', $estado);
      $sql->bindParam(':proveedor', $proveedor);
      $sql->bindParam(':id', $recurso_id, PDO::PARAM_INT);
      $success = $sql->execute();

      if (!$success) {
        throw new Exception("No es posible rechazar recurso.");
      }

      $sql = $this->_db3->prepare("UPDATE cmx_estado_historico_recurso SET estado_recurso = :estado WHERE recurso_id = :id and proveedor_id = :proveedor");
      $sql->bindParam(':estado', $estado);
      $sql->bindParam(':proveedor', $proveedor);
      $sql->bindParam(':id', $recurso_id, PDO::PARAM_INT);
      $success2 = $sql->execute();

      if (!$success2) {
        throw new Exception("No es posible rechazar recurso.");
      }
      $sql = $this->_db3->prepare("UPDATE cmx_pedido_proveedor_estado SET estado_proceso_pedido = :estado WHERE recurso_id = :id and proveedor_id = :proveedor and estado_visualizar = 1");
      $sql->bindParam(':estado', $estado);
      $sql->bindParam(':proveedor', $proveedor);
      $sql->bindParam(':id', $recurso_id, PDO::PARAM_INT);
      $success3 = $sql->execute();


      if (!$success3) {
        throw new Exception("No es posible rechazar recurso.");
      }

      $sql = $this->_db3->prepare(" SELECT * FROM cmx_estado_servicio_proveedor 
      WHERE recurso_id = :id AND proveedor_id = :proveedor AND estado_actual = 1 ");
      $sql->bindParam(':proveedor', $proveedor);
      $sql->bindParam(':id', $recurso_id, PDO::PARAM_INT);
      $sql->execute();

      $result = $sql->fetchAll(PDO::FETCH_ASSOC);

      if ($result) {
        $Arrayrecurso = $result;
      } else {
        echo "No se encontraron resultados.";
        echo "\nRecurso ID: $recurso_id";
        echo "\nProveedor ID: $proveedor";
      }

      if (!$success3) {
        throw new Exception("No es posible rechazar recurso.");
      }
      $sql = $this->_db3->prepare("UPDATE cmx_estado_servicio_proveedor SET estado_actual = 0 WHERE recurso_id = :id and proveedor_id = :proveedor and estado_actual = 1");
      $sql->bindParam(':proveedor', $proveedor);
      $sql->bindParam(':id', $recurso_id, PDO::PARAM_INT);
      $success4 = $sql->execute();

      if (!$success4) {
        throw new Exception("No es posible rechazar recurso.");
      }

      $sql = $this->_db3->prepare("INSERT INTO cmx_estado_servicio_proveedor(pedido_id,servicio_id,proveedor_id,recurso_id,estado_servicio,estado_actual,usuario,fecha,hora,empresa_id) 
        VALUES(:pedido_id, :servicio_id,:proveedor_id,:recurso_id,:estado_servicio,:estado_actual,:usuario,:fecha,:hora,:empresa_id)");

      foreach ($Arrayrecurso as $item) {
        $sql->execute([
          ':pedido_id' => $item['pedido_id'],
          ':servicio_id' => $item['servicio_id'],
          ':proveedor_id' => $item['proveedor_id'],
          ':recurso_id' => $item['recurso_id'],
          ':estado_servicio' => $estado,
          ':estado_actual' => 1,
          ':usuario' => $usuario,
          ':fecha' => $fecha,
          ':hora' => $hora,
          ':empresa_id' => $empresa
        ]);

        if (!$sql) {
          throw new Exception("Fallo al insertar estado_servicio_proveedor");
        }
      }

      foreach ($Arrayrecurso as $item) {
        $sql = $this->_db3->prepare("UPDATE cmx_pedido_torre_control SET estado_publicaion = 'Pendiente',estado_asignacion = 'Pendiente' WHERE numdoc_solicitud = :id");
        $sql->bindParam(':id', $item['pedido_id'], PDO::PARAM_INT);
        $success3 = $sql->execute();
      }

      if (!$success3) {
        throw new Exception('No se pudo actualizar el estado de la solicitud.');
      }

      $this->_db3->commit();
      $response = [
        'numero' => $success ? 200 : 500,
        'mensaje' => $success ? 'Recurso rechazado de forma exitosa.' : 'Error al actualizar.'
      ];
    } catch (Exception $e) {
      $this->_db3->rollBack();
    }
    return $response;
  }

  //Editar recursos de la torre de control
  public function Editar_datos_recurso($RecursoId)
  {
    $sql = $this->_db3->prepare("
        SELECT
            cps.valor_servicio,
            cps.referencia,
            cps.cedula_conductor,
            cps.nombre_conductor,
            cps.capacidad,
            cps.tiempo_libre,
            cps.stand_bay,
            cps.cumplimiento,
            cps.contenedor,
            cps.tara
        FROM cmx_cliente_proveedor_servicio cps
        WHERE cps.recurso_id = :recurso_id
        ORDER BY cps.fecha DESC, cps.hora DESC
        LIMIT 1
    ");

    $sql->bindParam(':recurso_id', $RecursoId, PDO::PARAM_INT);
    $sql->execute();

    $resultado = $sql->fetch(PDO::FETCH_ASSOC);

    return $resultado ?: [
      'numero'  => 404,
      'mensaje' => 'Recurso no encontrado.'
    ];
  }

  public function Actualizar_datos_recurso($datos)
  {
    $response = [];

    $sql = $this->_db3->prepare("UPDATE cmx_cliente_proveedor_servicio SET
      valor_servicio = :valor_servicio,
      referencia = :referencia,
      cedula_conductor = :cedula_conductor,
      nombre_conductor = :nombre_conductor,
      capacidad = :capacidad,
      tiempo_libre = :tiempo_libre,
      stand_bay = :stand_bay,
      cumplimiento = :cumplimiento,
      contenedor = :contenedor,
      tara = :tara
    WHERE recurso_id = :recurso_id");

    $sql->bindParam(':valor_servicio', $datos['valor_servicio'], PDO::PARAM_STR);
    $sql->bindParam(':referencia', $datos['placa'], PDO::PARAM_STR);
    $sql->bindParam(':cedula_conductor', $datos['cedula_conductor'], PDO::PARAM_STR);
    $sql->bindParam(':nombre_conductor', $datos['nombre_conductor'], PDO::PARAM_STR);
    $sql->bindParam(':capacidad', $datos['capacidad_vehiculo'], PDO::PARAM_STR);
    $sql->bindParam(':tiempo_libre', $datos['tiempo_libre'], PDO::PARAM_STR);
    $sql->bindParam(':stand_bay', $datos['stand_bay'], PDO::PARAM_STR);
    $sql->bindParam(':cumplimiento', $datos['cumplimiento'], PDO::PARAM_STR);
    $sql->bindParam(':contenedor', $datos['contenedor'], PDO::PARAM_STR);
    $sql->bindParam(':tara', $datos['tara'], PDO::PARAM_STR);
    $sql->bindParam(':recurso_id', $datos['MaestroId'], PDO::PARAM_INT);

    $sqlUpdateSubasta = $this->_db3->prepare("UPDATE cmx_resultado_subasta_tr rst
    INNER JOIN cmx_subasta_torre_control str ON rst.subasta_id=str.subasta_id
    SET rst.valor_ganador=:ValorGanador
    WHERE str.recurso_id=:RecursoId");
    $sqlUpdateSubasta->bindParam(':ValorGanador', $datos['valor_servicio'], PDO::PARAM_STR);
    $sqlUpdateSubasta->bindParam(':RecursoId', $datos['MaestroId'], PDO::PARAM_INT);
    $sqlUpdateSubasta->execute();

    if ($sql->execute()) {
      return [
        'success' => true,
        'mensaje' => 'Datos del recurso actualizados correctamente.'
      ];
    } else {
      return [
        'success' => false,
        'mensaje' => 'Error al actualizar los datos del recurso.'
      ];
    }
  }

  public function Linea_Tiempo_pedidos($PedidoId)
  {
    $response = [];

    // HomologaciÃ³n de tipos de trazabilidad
    $homologacion = [
      'Llegada Cargue' => 'Llega vehículo',
      'Cargue' => 'En cargue',
      'Transito' => 'En ruta',
      'Salida Descargue' => 'Entregado'
    ];

    // Consultar fecha de asignaciÃ³n
    $sqlAsignacion = $this->_db3->prepare("SELECT
        CONCAT(cps.fecha_actualizacion,' ', cps.hora_actualizacion) AS hora_asignacion
      FROM
        cmx_cliente_proveedor_servicio cps
      WHERE
        cps.pedido_id = :PedidoId");
    $sqlAsignacion->bindParam(':PedidoId', $PedidoId, PDO::PARAM_INT);
    $sqlAsignacion->execute();
    $resultados_asignacion = $sqlAsignacion->fetch(PDO::FETCH_ASSOC);

    // Consultar trazabilidad
    $sqlActividades = $this->_db3->prepare("SELECT
      tp.tipo_trazabilidad,
      tp.observacion,
      tp.evidencia,
      CONCAT(tp.fecha, ' ', tp.hora) AS fecha_trazabilidad,
      CONCAT(tp.fecha_estimada, ' ', tp.hora_estimada) AS fecha_entrega_estimada
    FROM
      cmx_cliente_proveedor_servicio cps
      INNER JOIN cmx_trazabilidad_pedido_tr tp ON cps.pedido_id = tp.pedido_id
      INNER JOIN cmx_subasta_torre_control st ON cps.recurso_id = st.recurso_id
    WHERE
      tp.pedido_id = :PedidoId");
    $sqlActividades->bindParam(':PedidoId', $PedidoId, PDO::PARAM_INT);
    $sqlActividades->execute();
    $resultados_actividades = $sqlActividades->fetchAll(PDO::FETCH_ASSOC);

    // Inicializar etapas
    $etapas_definidas = [
      'Asignado' => $resultados_asignacion ? [
        'fecha_trazabilidad' => $resultados_asignacion['hora_asignacion'],
        'observacion' => 'Pedido asignado al proveedor'
      ] : null
    ];

    // Homologar actividades
    foreach ($resultados_actividades as $actividad) {
      $tipoOriginal = $actividad['tipo_trazabilidad'];

      if (isset($homologacion[$tipoOriginal])) {
        $nombreEtapa = $homologacion[$tipoOriginal];
        $etapas_definidas[$nombreEtapa] = [
          'fecha_trazabilidad' => $actividad['fecha_trazabilidad'],
          'observacion' => $actividad['observacion'],
          'fecha_entrega_estimada' => $actividad['fecha_entrega_estimada'],
        ];
      }
    }

    $response['etapas'] = $etapas_definidas;
    return $response;
  }

  public function Fecha_estimada_entrega_pedido($FechaEstimada, $HoraEstimada, $traza, $datos)
  {
    try {
      // Iniciar transacciÃ³n
      $this->_db3->beginTransaction();

      // Actualizar fecha y hora estimada
      $sqlUpdateFechaEstimada = $this->_db3->prepare("
            UPDATE cmx_trazabilidad_pedido_tr 
            SET fecha_estimada = :fecha_estimada, hora_estimada = :hora_estimada 
            WHERE pedido_id = :pedido_id
        ");

      foreach ($datos as $arrayDatos) {
        $sqlUpdateFechaEstimada->bindParam(':fecha_estimada', $FechaEstimada, PDO::PARAM_STR);
        $sqlUpdateFechaEstimada->bindParam(':hora_estimada', $HoraEstimada, PDO::PARAM_STR);
        $sqlUpdateFechaEstimada->bindParam(':pedido_id', $arrayDatos['pedido'], PDO::PARAM_INT);
        $sqlUpdateFechaEstimada->execute();
      }
      // Puedes agregar aquÃ­ otras operaciones relacionadas a la trazabilidad si es necesario

      // Confirmar la transacciÃ³n
      $this->_db3->commit();

      return [
        'success' => true,
        'message' => 'Fecha estimada de entrega actualizada correctamente.'
      ];
    } catch (\Throwable $th) {
      // Revertir la transacciÃ³n en caso de error
      $this->_db3->rollBack();

      return [
        'success' => false,
        'message' => 'Error al actualizar la fecha estimada de entrega.',
        'error' => $th->getMessage()
      ];
    }
  }

  public function Listar_graficos_ind($fecha_inicial, $fecha_final)
  {
    $consolidado = [];
    $sql = $this->_db3->prepare("SELECT COUNT(*) as programados FROM cmx_pedido_torre_control ptr WHERE ptr.estado_asignacion = 'Pendiente'
                                AND ptr.estado_publicaion = 'Pendiente' AND STR_TO_DATE(ptr.fecha_cargue, '%Y-%m-%d') BETWEEN :FechaIncial AND :FechaFinal");
    $sql->bindParam(':FechaIncial', $fecha_inicial);
    $sql->bindParam(':FechaFinal', $fecha_final);
    $sql->execute();
    $resultados_pendientes = $sql->fetch(PDO::FETCH_ASSOC);


    $sql_parametros = $this->_db3->prepare("SELECT COUNT(*) as en_gestion FROM cmx_pedido_torre_control ptr 
                                          WHERE (ptr.estado_asignacion = 'Asignado' Or ptr.estado_publicaion = 'Publicado') AND STR_TO_DATE(ptr.fecha_cargue, '%Y-%m-%d') BETWEEN :FechaIncial AND :FechaFinal");
    $sql_parametros->bindParam(':FechaIncial', $fecha_inicial);
    $sql_parametros->bindParam(':FechaFinal', $fecha_final);
    $sql_parametros->execute();
    $resultados_en_curso = $sql_parametros->fetchAll(PDO::FETCH_ASSOC);

    $sql_parametros2 = $this->_db3->prepare("WITH UltimoEstado AS (
                                                            SELECT
                                                                tr.pedido_id,
                                                                tr.tipo_trazabilidad,
                                                                tr.fecha,
                                                                ROW_NUMBER() OVER (PARTITION BY tr.pedido_id ORDER BY tr.fecha DESC) AS rn
                                                            FROM
                                                                cmx_trazabilidad_pedido_tr tr
                                                        ),
                                                        PedidosFiltrados AS (
                                                            SELECT
                                                                ptr.numdoc_solicitud,
                                                                (CASE 
                                                                    WHEN ue.tipo_trazabilidad IS NULL THEN 'SIN SEGUIMIENTO' 
                                                                    ELSE ue.tipo_trazabilidad 
                                                                END) AS seguimiento
                                                            FROM
                                                                cmx_pedido_torre_control ptr
                                                            LEFT JOIN UltimoEstado ue ON ue.pedido_id = ptr.numdoc_solicitud AND ue.rn = 1 
                                                            WHERE
                                                                STR_TO_DATE(ptr.fecha_cargue, '%Y-%m-%d') BETWEEN :FechaIncial AND :FechaFinal
                                                                AND ptr.estado_asignacion = 'Completado'
                                                        )
                                                        SELECT COUNT(*) AS confirmados
                                                        FROM PedidosFiltrados
                                                        WHERE seguimiento <> 'Salida Descargue'");
    $sql_parametros2->bindParam(':FechaIncial', $fecha_inicial);
    $sql_parametros2->bindParam(':FechaFinal', $fecha_final);
    $sql_parametros2->execute();
    $resultados_asignados = $sql_parametros2->fetchAll(PDO::FETCH_ASSOC);

    $sql_parametros3 = $this->_db3->prepare("SELECT tr.tipo_trazabilidad, COUNT(*) AS entregados FROM cmx_trazabilidad_pedido_tr tr
                                            JOIN (SELECT pedido_id, MAX(fecha) AS ultima_fecha FROM cmx_trazabilidad_pedido_tr GROUP BY pedido_id)
                                            ult ON tr.pedido_id = ult.pedido_id AND tr.fecha = ult.ultima_fecha AND tr.tipo_trazabilidad = 'Salida Descargue'
                                            INNER JOIN cmx_pedido_torre_control ptr ON tr.pedido_id=ptr.numdoc_solicitud
                                            WHERE STR_TO_DATE(ptr.fecha_cargue, '%Y-%m-%d') BETWEEN :FechaIncial AND :FechaFinal
                                            GROUP BY tr.tipo_trazabilidad");

    $sql_parametros3->bindParam(':FechaIncial', $fecha_inicial);
    $sql_parametros3->bindParam(':FechaFinal', $fecha_final);
    $sql_parametros3->execute();
    $resultados_confirmados = $sql_parametros3->fetchAll(PDO::FETCH_ASSOC);

    $consolidado = ["programados" => $resultados_pendientes, "en_gestion" => $resultados_en_curso, "confirmados" => $resultados_asignados, 'entregados' => $resultados_confirmados];
    return $consolidado;
  }

  public function detalle_listar_graficos($tipo_data, $fecha_inicial, $fecha_final)
  {
    if ($tipo_data == 'pendientes') {
      $sql = $this->_db3->prepare("SELECT modalidad,referencia_pedido,ciudad_origen,ciudad_destino,cod_producto,fecha_cargue FROM cmx_pedido_torre_control ptr WHERE ptr.estado_asignacion = 'Pendiente'
                                AND ptr.estado_publicaion = 'Pendiente' AND STR_TO_DATE(ptr.fecha_cargue, '%Y-%m-%d') BETWEEN :FechaIncial AND :FechaFinal");
      $sql->bindParam(':FechaIncial', $fecha_inicial);
      $sql->bindParam(':FechaFinal', $fecha_final);
      $sql->execute();
      $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
    } elseif ($tipo_data == 'en_curso') {
      $sql = $this->_db3->prepare("SELECT modalidad,referencia_pedido,ciudad_origen,ciudad_destino,cod_producto,fecha_cargue FROM cmx_pedido_torre_control ptr WHERE ptr.estado_asignacion = 'Asignado'
                                          Or ptr.estado_publicaion = 'Publicado'AND STR_TO_DATE(ptr.fecha_cargue, '%Y-%m-%d') BETWEEN :FechaIncial AND :FechaFinal");
      $sql->bindParam(':FechaIncial', $fecha_inicial);
      $sql->bindParam(':FechaFinal', $fecha_final);
      $sql->execute();
      $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
    } elseif ($tipo_data == 'asignados') {
      $sql = $this->_db3->prepare("SELECT modalidad,referencia_pedido,ciudad_origen,ciudad_destino,cod_producto,fecha_cargue FROM cmx_pedido_torre_control ptr WHERE ptr.estado_asignacion = 'Completado'
                                          Or ptr.estado_publicaion = 'Completado'AND STR_TO_DATE(ptr.fecha_cargue, '%Y-%m-%d') BETWEEN :FechaIncial AND :FechaFinal");
      $sql->bindParam(':FechaIncial', $fecha_inicial);
      $sql->bindParam(':FechaFinal', $fecha_final);
      $sql->execute();
      $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
    }
    return $resultados;
  }

  public function Listar_graficos_asignados($fecha_inicial, $fecha_final)
  {

    $sql = $this->_db3->prepare("WITH ultimos_estados AS (
                                                      SELECT 
                                                          tr.pedido_id,
                                                          tr.tipo_trazabilidad,
                                                          ROW_NUMBER() OVER (PARTITION BY tr.pedido_id ORDER BY tr.fecha DESC) AS rn
                                                      FROM 
                                                          cmx_trazabilidad_pedido_tr tr
                                                  )
                                                  SELECT 
                                                      COALESCE(ue.tipo_trazabilidad, 'SIN SEGUIMIENTO') AS tipo_trazabilidad,
                                                      COUNT(*) AS cantidad
                                                  FROM 
                                                      cmx_pedido_torre_control ptr
                                                  LEFT JOIN ultimos_estados ue 
                                                      ON ue.pedido_id = ptr.numdoc_solicitud AND ue.rn = 1
                                                  LEFT JOIN cmx_cliente_proveedor_servicio cpr 
                                                      ON ptr.numdoc_solicitud = cpr.pedido_id AND cpr.estado_pedido_asignado = 'Activo'
                                                  WHERE 
                                                      STR_TO_DATE(ptr.fecha_cargue, '%Y-%m-%d') BETWEEN :FechaIncial AND :FechaFinal
                                                      AND ptr.estado_asignacion = 'Completado'
                                                  GROUP BY 
                                                      COALESCE(ue.tipo_trazabilidad, 'SIN SEGUIMIENTO')
                                                  HAVING tipo_trazabilidad <> 'Salida Descargue'    
                                                  ORDER BY 
                                                    tipo_trazabilidad;");
    $sql->bindParam(':FechaIncial', $fecha_inicial);
    $sql->bindParam(':FechaFinal', $fecha_final);
    $sql->execute();
    $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
    return $resultados;
  }

  public function detalle_pedidos_graficos($params, $fecha_inicial, $fecha_final)
  {
    $response = [];

    // CondiciÃ³n dinÃ¡mica segÃºn parÃ¡metro
    switch ($params) {
      case 'programados':
        // $condicion = "ptr.estado_asignacion = 'Pendiente'
        //                   AND ptr.estado_publicaion = 'Pendiente'";

        $sql_case = "SELECT ptr.modalidad,ptr.referencia_pedido,ptr.ciudad_origen,ptr.ciudad_destino,ptr.cod_producto,ptr.producto,
                      ptr.fecha_cargue as Fecha_Cargue,ptr.fecha_entrega AS Fecha_Descargue
                      FROM  cmx_pedido_torre_control ptr 
                      WHERE ptr.estado_asignacion = 'Pendiente'
                      AND ptr.estado_publicaion = 'Pendiente' AND STR_TO_DATE(ptr.fecha_cargue, '%Y-%m-%d')
                      BETWEEN :FechaInicial AND :FechaFinal";
        $codicion_relacion = "";
        break;

      case 'en_gestion':


        $sql_case = "SELECT ptr.modalidad,ptr.referencia_pedido,ptr.ciudad_origen,ptr.ciudad_destino,ptr.cod_producto,ptr.producto,
                      ptr.fecha_cargue as Fecha_Cargue,ptr.fecha_entrega AS Fecha_Descargue
                      FROM  cmx_pedido_torre_control ptr 
                      WHERE (ptr.estado_asignacion = 'Asignado' Or ptr.estado_publicaion = 'Publicado') 
                      AND STR_TO_DATE(ptr.fecha_cargue, '%Y-%m-%d') BETWEEN :FechaInicial AND :FechaFinal";
        $codicion_relacion = "";

        break;

      case 'confirmados':


        $sql_case = "WITH UltimoEstado AS (
                        SELECT
                            tr.pedido_id,
                            tr.tipo_trazabilidad,
                            tr.fecha,
                            ROW_NUMBER() OVER (PARTITION BY tr.pedido_id ORDER BY tr.fecha DESC) AS rn
                        FROM
                            cmx_trazabilidad_pedido_tr tr
                    )
                    SELECT 
                        ptr.modalidad,
                        ptr.referencia_pedido,
                        ptr.ciudad_origen,
                        ptr.ciudad_destino,
                        ptr.cod_producto,
                        ptr.producto,
                        ptr.fecha_cargue AS Fecha_Cargue,
                        ptr.fecha_entrega AS Fecha_Descargue,
                        (CASE WHEN ue.tipo_trazabilidad IS NULL THEN 'SIN SEGUIMIENTO' ELSE ue.tipo_trazabilidad END) AS seguimiento,
                        ptr.estado_asignacion,
                        cpr.recurso_id,
                        cpr.serivicio_id,
                        ptr.numdoc_solicitud
                
                    FROM
                        cmx_pedido_torre_control ptr
                    LEFT JOIN UltimoEstado ue ON ue.pedido_id = ptr.numdoc_solicitud AND ue.rn = 1 
                    LEFT JOIN 
                        cmx_cliente_proveedor_servicio cpr
                        ON ptr.numdoc_solicitud = cpr.pedido_id  AND cpr.estado_pedido_asignado = 'Activo' 
                    WHERE
                        STR_TO_DATE(ptr.fecha_cargue, '%Y-%m-%d') BETWEEN :FechaInicial AND :FechaFinal AND ptr.estado_asignacion  = 'Completado'
                    HAVING seguimiento <> 'Salida Descargue'
                    ORDER BY seguimiento
                    ";
        $codicion_relacion = "";


        break;

      case 'entregados':
        $sql_case = "SELECT ptr.modalidad,ptr.referencia_pedido,ptr.ciudad_origen,ptr.ciudad_destino,ptr.cod_producto,ptr.producto,
                          ptr.fecha_cargue as Fecha_Cargue,ptr.fecha_entrega AS Fecha_Descargue,ptr.estado_asignacion,
                        cpr.recurso_id,
                        cpr.serivicio_id,
                        ptr.numdoc_solicitud
                          
                          FROM
                            cmx_trazabilidad_pedido_tr tr
                            INNER JOIN (
                              SELECT
                                pedido_id,
                                MAX(CONCAT(fecha, ' ', hora)) AS ultima_fecha
                              FROM
                                cmx_trazabilidad_pedido_tr
                              GROUP BY
                                pedido_id
                            ) ult ON tr.pedido_id = ult.pedido_id
                            AND tr.fecha = ult.ultima_fecha
                            AND tr.tipo_trazabilidad = 'Salida Descargue'
                            INNER JOIN cmx_pedido_torre_control ptr ON tr.pedido_id = ptr.numdoc_solicitud
                               inner JOIN 
                        cmx_cliente_proveedor_servicio cpr
                        ON ptr.numdoc_solicitud = cpr.pedido_id  AND cpr.estado_pedido_asignado = 'Activo'
                            WHERE STR_TO_DATE(ptr.fecha_cargue, '%Y-%m-%d')
                            BETWEEN :FechaInicial AND :FechaFinal
                             
                            
                            ";

        $codicion_relacion = "";

        break;

      default:
        return []; // Si no es un parÃ¡metro esperado
    }

    $sql = $this->_db3->prepare($sql_case);
    $sql->bindParam(':FechaInicial', $fecha_inicial);
    $sql->bindParam(':FechaFinal', $fecha_final);
    $sql->execute();
    $response = $sql->fetchAll(PDO::FETCH_ASSOC);

    return $response;
  }

  public function detalle_graficos_trazabilidad($params, $fechaInicial, $fechaFinal)
  {
    try {

      if ($params <> "SIN SEGUIMIENTO") {
        $sql = "
                            WITH ultimos_estados AS (
                        SELECT 
                            tr.pedido_id,
                            tr.tipo_trazabilidad,
                            tr.fecha,
                            ROW_NUMBER() OVER (PARTITION BY tr.pedido_id ORDER BY tr.fecha DESC) AS rn
                        FROM 
                            cmx_trazabilidad_pedido_tr tr
                    )
                    SELECT 
                        ptr.modalidad,
                        ptr.referencia_pedido,
                        ptr.ciudad_origen,
                        ptr.ciudad_destino,
                        ptr.cod_producto,
                        ptr.producto,
                        ptr.fecha_cargue AS Fecha_Cargue,
                        ptr.fecha_entrega AS Fecha_Descargue,
                        ue.tipo_trazabilidad,
                        cpr.recurso_id,
                        cpr.serivicio_id,
                        ptr.numdoc_solicitud
                        
                    FROM 
                        ultimos_estados ue
                    INNER JOIN 
                        cmx_pedido_torre_control ptr 
                        ON ue.pedido_id = ptr.numdoc_solicitud
                    INNER JOIN 
                        cmx_cliente_proveedor_servicio cpr
                        ON ptr.numdoc_solicitud = cpr.pedido_id AND cpr.estado_pedido_asignado = 'Activo'       
                    WHERE 
                        ue.rn = 1
                        AND ue.tipo_trazabilidad = :tipo
                        AND STR_TO_DATE(ptr.fecha_cargue, '%Y-%m-%d') BETWEEN :fecha_inicial AND :fecha_final;
        ";
      } else {

        $sql = "WITH UltimoEstado AS (
                        SELECT
                            tr.pedido_id,
                            tr.tipo_trazabilidad,
                            tr.fecha,
                            ROW_NUMBER() OVER (PARTITION BY tr.pedido_id ORDER BY tr.fecha DESC) AS rn
                        FROM
                            cmx_trazabilidad_pedido_tr tr
                    )
                    SELECT 
                        ptr.modalidad,
                        ptr.referencia_pedido,
                        ptr.ciudad_origen,
                        ptr.ciudad_destino,
                        ptr.cod_producto,
                        ptr.producto,
                        ptr.fecha_cargue AS Fecha_Cargue,
                        ptr.fecha_entrega AS Fecha_Descargue,
                        (CASE WHEN ue.tipo_trazabilidad IS NULL THEN 'SIN SEGUIMIENTO' ELSE ue.tipo_trazabilidad END) AS seguimiento,
                        ptr.estado_asignacion,
                        cpr.recurso_id,
                        cpr.serivicio_id,
                        ptr.numdoc_solicitud
                
                    FROM
                        cmx_pedido_torre_control ptr
                    LEFT JOIN UltimoEstado ue ON ue.pedido_id = ptr.numdoc_solicitud AND ue.rn = 1 
                    LEFT JOIN 
                        cmx_cliente_proveedor_servicio cpr
                        ON ptr.numdoc_solicitud = cpr.pedido_id  AND cpr.estado_pedido_asignado = 'Activo' 
                    WHERE
                        STR_TO_DATE(ptr.fecha_cargue, '%Y-%m-%d') BETWEEN :fecha_inicial AND :fecha_final AND ptr.estado_asignacion  = 'Completado'
                    HAVING seguimiento =  'SIN SEGUIMIENTO'
                    ORDER BY seguimiento";
      }


      $stmt =  $this->_db3->prepare($sql);

      if ($params <> "SIN SEGUIMIENTO") {
        $stmt->bindParam(':tipo', $params);
        $stmt->bindParam(':fecha_inicial', $fechaInicial);
        $stmt->bindParam(':fecha_final', $fechaFinal);
      } else {
        $stmt->bindParam(':fecha_inicial', $fechaInicial);
        $stmt->bindParam(':fecha_final', $fechaFinal);
      }
      $stmt->execute();
      $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
      return $resultado;
    } catch (Exception $e) {
      // echo json_encode(['error' => $e->getMessage()]);
      return $e->getMessage();
    }
  }

  public function Listar_pedidos_por_responsable()
  {
    $user = $_SESSION["usuario"]["id_usuario"];
    $user_name = $_SESSION["usuario"]["nom_usuario"];
    $perfil_Id = $_SESSION['usuario']['id_perfil'];

    if ($perfil_Id == 1) {
      $sql = $this->_db3->prepare("
        SELECT
            tp.numdoc,
            tp.referencia,
            tp.estado,
            tp.fecha_creacion,
            tp.hora_creacion,
            c.nombre,
            tp.usuario,
            tp.recurso_id,
            COUNT(*) OVER() AS total_registros
        FROM cmx_trazabilidad_proceso tp
        INNER JOIN cmx_clientes c ON c.id = tp.cliente
        INNER JOIN cmx_detalle_opcion_trazabilidad dot ON dot.numdoc_detalle_opcion = tp.numdoc
        WHERE dot.usuario_responsable = :Usuario
        GROUP BY tp.numdoc
        ");
      // -- AND LOWER(tp.usuario) != LOWER(:Nombre)

      $sql->bindParam(':Usuario', $user, PDO::PARAM_STR);
      // $sql->bindParam(':Nombre', $user_name, PDO::PARAM_STR);
      $sql->execute();
    } else {
      $sql = $this->_db3->prepare("
        SELECT
            tp.numdoc,
            tp.referencia,
            tp.estado,
            tp.fecha_creacion,
            tp.hora_creacion,
            c.nombre,
            tp.usuario,
            tp.recurso_id,
            COUNT(*) OVER() AS total_registros
        FROM cmx_trazabilidad_proceso tp
        INNER JOIN cmx_clientes c ON c.id = tp.cliente
        INNER JOIN cmx_detalle_opcion_trazabilidad dot ON dot.numdoc_detalle_opcion = tp.numdoc
        WHERE dot.usuario_responsable = :Usuario
         AND LOWER(tp.usuario) != LOWER(:Nombre)
        GROUP BY tp.numdoc
        ");

      $sql->bindParam(':Usuario', $user, PDO::PARAM_STR);
      $sql->bindParam(':Nombre', $user_name, PDO::PARAM_STR);
      $sql->execute();
    }

    return $sql->fetchAll(PDO::FETCH_ASSOC);
  }

  public function Lista_de_actividades_compartidos($numdoc, $RecursoId)
  {
    $user = $_SESSION["usuario"]["id_usuario"];
    $response = [];
    $actividadesAgregadas = []; // <<< Controlar actividades agregadas

    $sql = $this->_db3->prepare("
      SELECT 
          dt.posicion,
          t.nombre_tipo,
          tt.nombre_opcion,
          u.nom_usuario,
          dt.fecha_inicio,
          dt.hora_inicio,
          dt.estado_actividad,
          t.id AS proceso_id,
          tt.id AS actividad_id,
          dt.detalle_proceso AS num_proceso,
          da.actividad AS actividad,
          da.actividad_dependiente,
          dt.costo_actividad,
          tp.numdoc,
          CONCAT(dt.fecha_base, ' ', dt.hora_base) AS fecha_base,
          dt.valor_minutos,
          dt.dependiente,
          dt.criterio_calculo,
          dt.tiempo_transcurrido,
          dt.detalle_actividad,
          dt.medida_tiempo
      FROM cmx_detalle_opcion_trazabilidad dt
      INNER JOIN cmx_trazabilidad_proceso tp ON tp.numdoc = dt.numdoc_detalle_opcion
      INNER JOIN cmx_tipo_opcion_trazabilidad tt ON tt.id = dt.detalle_proceso
      INNER JOIN cmx_tipo_trazabilidad t ON t.id = tt.tipo_trazabilidad
      INNER JOIN cmx_usuarios u ON u.id = dt.usuario_responsable
      LEFT JOIN cmx_actividad_dependiente da ON dt.detalle_proceso = da.actividad
		  AND da.proceso='Pedido' AND tp.numdoc=da.numdoc_proceso
      WHERE dt.numdoc_detalle_opcion = :recurso_id  AND dt.usuario_responsable= :Responsable
          GROUP BY dt.posicion
          ORDER BY dt.posicion ASC
      ");
    // $sql->bindParam(':recurso_id', $RecursoId, PDO::PARAM_STR);
    $sql->bindParam(':recurso_id', $numdoc, PDO::PARAM_STR);
    $sql->bindParam(':Responsable', $user, PDO::PARAM_STR);
    $sql->execute();
    $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
    $idsGenerados = [];

    foreach ($resultados as $value) {
      $inicio = new DateTime($value['fecha_inicio'] . ' ' . $value['hora_inicio'], new DateTimeZone('America/Bogota'));
      $ahora = new DateTime('now', new DateTimeZone('America/Bogota'));

      $diferenciaAhora = $inicio->diff($ahora);
      $tiempoTranscurridoActual = ($diferenciaAhora->days * 24 * 60) + ($diferenciaAhora->h * 60) + $diferenciaAhora->i;

      //Consultar las actividades dependientes para el recurso
      $sqlActividadDependiente = $this->_db3->prepare("SELECT tt.nombre_opcion AS nombre_actividad_dependiente,da.actividad_dependiente 
          FROM cmx_detalle_opcion_trazabilidad dt
          INNER JOIN cmx_trazabilidad_proceso tp ON tp.numdoc = dt.numdoc_detalle_opcion
          INNER JOIN cmx_tipo_opcion_trazabilidad tt ON tt.id = dt.detalle_proceso
          INNER JOIN cmx_actividad_dependiente da ON tt.id = da.actividad_dependiente AND da.proceso = 'Pedido' AND tp.numdoc=da.numdoc_proceso
          WHERE tp.recurso_id = :RecursoId AND da.actividad = :actividadId
        ");
      $sqlActividadDependiente->bindParam(":RecursoId", $RecursoId, PDO::PARAM_INT);
      $sqlActividadDependiente->bindParam(":actividadId", $value['actividad_id'], PDO::PARAM_INT);
      $sqlActividadDependiente->execute();
      $resultadoActividadDependiente = $sqlActividadDependiente->fetchAll(PDO::FETCH_ASSOC);


      if (!in_array($value['actividad_id'], $actividadesAgregadas)) {
        $estadoActividad = ($tiempoTranscurridoActual >= $value['valor_minutos'] && $value['estado_actividad'] !== 'COMPLETADO') ? 'VENCIDO' : $value['estado_actividad'];

        $minutosParaVencimiento = $value['valor_minutos'] - $tiempoTranscurridoActual;
        $medida_tiempo = null;

        switch ($value['medida_tiempo']) {
          case 1: // Minutos
            $tiempoRestante = round($minutosParaVencimiento);
            $medida_tiempo = 'Minutos';
            break;

          case 2: // Horas
            $tiempoRestante = round($minutosParaVencimiento / 60);
            $medida_tiempo = 'Horas';
            break;

          case 3: // DÃ­as
            $tiempoRestante = round($minutosParaVencimiento / 1440);
            $medida_tiempo = 'DÃ­as';
            break;

          default: // Por defecto, asumir minutos
            $tiempoRestante = round($minutosParaVencimiento);
            $medida_tiempo = 'Minutos';
            break;
        }

        $estadoVencimiento = ($tiempoRestante > 0) ? "Faltan {$tiempoRestante} minutos" : "Vencido hace " . abs($tiempoRestante) . " " . $medida_tiempo;

        /* Actualizar el tiempo transcurrido de vencimiento */
        if ($estadoActividad !== 'COMPLETADO' && $estadoActividad === 'VENCIDO') {
          // Si ya venciÃ³, guardar el tiempo en positivo (sin signo)
          $tiempoVencidoGuardar = abs($minutosParaVencimiento);
          $sqlUpdateTiempo = $this->_db3->prepare("
                UPDATE cmx_detalle_opcion_trazabilidad 
                SET tiempo_vencido = :tiempo_vencido
                WHERE detalle_proceso = :id AND numdoc_detalle_opcion = :numdoc
            ");
          $sqlUpdateTiempo->bindParam(':tiempo_vencido', $tiempoVencidoGuardar, PDO::PARAM_INT);
          $sqlUpdateTiempo->bindParam(':id', $value['num_proceso'], PDO::PARAM_INT);
          $sqlUpdateTiempo->bindParam(':numdoc', $value['numdoc'], PDO::PARAM_STR);
          $sqlUpdateTiempo->execute();
        }

        if (!empty($resultadoActividadDependiente)) {
          $claveUnica = $value['actividad_id'];

          foreach ($resultadoActividadDependiente as $actividad) {
            // Verifica si ya se generÃ³ esa fila exacta
            if (in_array($claveUnica, $idsGenerados)) {
              continue;
            }

            $response[] = [
              'posicion' => $value['posicion'],
              'nombre_tipo' => $value['nombre_tipo'],
              'nombre_opcion' => $value['nombre_opcion'], // Actividad actual
              'nom_usuario' => $value['nom_usuario'],
              'fecha_inicio' => $value['fecha_inicio'],
              'hora_inicio' => $value['hora_inicio'],
              'estado_actividad' => $estadoActividad,
              'proceso_id' => $value['proceso_id'],
              'actividad_id' => $value['actividad_id'],
              'num_proceso' => $value['num_proceso'],
              'actividad' => $value['actividad'],
              'valor_minutos' => $value['valor_minutos'] . ' ' . $medida_tiempo,
              'actividad_dependiente' => $actividad['actividad_dependiente'],
              'nombre_actividad_dependiente' => $actividad['nombre_actividad_dependiente'], // Mostramos el nombre de la dependencia // Mostramos el nombre de la dependencia
              'costo_actividad' => $value['costo_actividad'],
              'numdoc' => $value['numdoc'],
              'fecha_base' => $value['fecha_base'] == null ? $actividad['nombre_actividad_dependiente'] : $value['fecha_base'],
              'criterio_calculo' => $value['criterio_calculo'],
              'tiempo_transcurrido_base' => $value['tiempo_transcurrido'] . ' ' . $medida_tiempo,
              'tiempo_transcurrido_actual' => $tiempoTranscurridoActual,
              'tiempo_vencimiento' => $estadoVencimiento,
            ];

            $idsGenerados[] = $claveUnica;
          }
        } else {
          // Si no hay actividades dependientes, crear solo una fila como fallback
          $response[] = [
            'posicion' => $value['posicion'],
            'nombre_tipo' => $value['nombre_tipo'],
            'nombre_opcion' => $value['nombre_opcion'],
            'nom_usuario' => $value['nom_usuario'],
            'fecha_inicio' => $value['fecha_inicio'],
            'hora_inicio' => $value['hora_inicio'],
            'estado_actividad' => $estadoActividad,
            'proceso_id' => $value['proceso_id'],
            'actividad_id' => $value['actividad_id'],
            'num_proceso' => $value['num_proceso'],
            'actividad' => $value['actividad'],
            'valor_minutos' => $value['valor_minutos'] . ' ' . $medida_tiempo,
            'actividad_dependiente' => $value['actividad_dependiente'],
            'costo_actividad' => $value['costo_actividad'],
            'numdoc' => $value['numdoc'],
            'fecha_base' => $value['fecha_base'],
            'criterio_calculo' => $value['criterio_calculo'],
            'tiempo_transcurrido_base' => $value['tiempo_transcurrido'] . ' ' . $medida_tiempo,
            'tiempo_transcurrido_actual' => $tiempoTranscurridoActual,
            'tiempo_vencimiento' => $estadoVencimiento,
          ];
        }
        $actividadesAgregadas[] = $value['actividad_id'];
      }
    }

    $sqlActividades = $this->_db3->prepare("
      SELECT
          dt.posicion,
          t.nombre_tipo,
          tt.nombre_opcion,
          u.nom_usuario,
          dt.fecha_inicio,
          dt.hora_inicio,
          dt.estado_actividad,
          t.id AS proceso_id,
          tt.id AS actividad_id,
          dt.detalle_proceso AS num_proceso,
          da.actividad AS actividad,
          da.actividad_dependiente,
          dt.costo_actividad,
          tp.numdoc,
          CONCAT(dt.fecha_base, ' ', dt.hora_base) AS fecha_base,
          dt.valor_minutos,
          dt.dependiente,
          dt.criterio_calculo,
          dt.tiempo_transcurrido,
          dt.detalle_actividad,
          dt.medida_tiempo,
          tt.nombre_opcion AS nombre_actividad_dependiente
      FROM cmx_detalle_opcion_trazabilidad dt
      INNER JOIN cmx_trazabilidad_proceso tp ON tp.numdoc = dt.numdoc_detalle_opcion
      INNER JOIN cmx_tipo_opcion_trazabilidad tt ON tt.id = dt.detalle_proceso
      INNER JOIN cmx_tipo_trazabilidad t ON t.id = tt.tipo_trazabilidad
      INNER JOIN cmx_usuarios u ON u.id = dt.usuario_responsable
      INNER JOIN cmx_pedido_actividades_visualizar pav ON pav.numdoc_pedido = tp.numdoc 
      AND pav.usuario_visualizar = '" . $user . "' AND pav.actividad_visualizar = dt.detalle_proceso
      LEFT JOIN cmx_actividad_dependiente da ON dt.detalle_proceso = da.actividad
      WHERE tp.recurso_id = '" . $RecursoId . "' AND pav.usuario_visualizar='" . $user . "'
		  AND da.proceso='Pedido' AND tp.numdoc=da.numdoc_proceso
      GROUP BY dt.posicion ORDER BY dt.posicion ASC");
    // WHERE dt.numdoc_detalle_opcion = '" . $numdoc . "' AND pav.usuario_visualizar='" . $user . "'
    $sqlActividades->execute();
    $infoActividades = $sqlActividades->fetchAll(mode: PDO::FETCH_ASSOC);

    foreach ($infoActividades as $actividadExtra) {
      $inicio = new DateTime($actividadExtra['fecha_inicio'] . ' ' . $actividadExtra['hora_inicio'], new DateTimeZone('America/Bogota'));
      $ahora = new DateTime('now', new DateTimeZone('America/Bogota'));

      $diferenciaAhora = $inicio->diff($ahora);
      $tiempoTranscurridoActual = ($diferenciaAhora->days * 24 * 60) + ($diferenciaAhora->h * 60) + $diferenciaAhora->i;
      $resultadoActividadDependiente = null;

      //Consultar las actividades dependientes para el recurso
      $sqlActividadDependiente = $this->_db3->prepare("
              SELECT tt.nombre_opcion AS nombre_actividad_dependiente,
                da.actividad_dependiente 
              FROM cmx_detalle_opcion_trazabilidad dt
              INNER JOIN cmx_trazabilidad_proceso tp ON tp.numdoc = dt.numdoc_detalle_opcion
              INNER JOIN cmx_tipo_opcion_trazabilidad tt ON tt.id = dt.detalle_proceso
              INNER JOIN cmx_actividad_dependiente da ON tt.id = da.actividad_dependiente AND da.proceso = 'Pedido' AND tp.numdoc=da.numdoc_proceso
              WHERE tp.recurso_id = :RecursoId AND da.actividad = :actividadId
            ");
      $sqlActividadDependiente->bindParam(":RecursoId", $RecursoId, PDO::PARAM_INT);
      $sqlActividadDependiente->bindParam(":actividadId", $actividadExtra['actividad_id'], PDO::PARAM_INT);
      $sqlActividadDependiente->execute();
      $resultadoActividadDependiente = $sqlActividadDependiente->fetchAll(PDO::FETCH_ASSOC);

      if (!in_array($actividadExtra['actividad_id'], $actividadesAgregadas)) {
        $estadoActividad = ($tiempoTranscurridoActual >= $actividadExtra['valor_minutos'] && $actividadExtra['estado_actividad'] !== 'COMPLETADO') ? 'VENCIDO' : $actividadExtra['estado_actividad'];

        $minutosParaVencimiento = $actividadExtra['valor_minutos'] - $tiempoTranscurridoActual;
        $medida_tiempo = null;
        if ($actividadExtra['medida_tiempo'] == 1) { // Minutos
          $tiempoRestante = round($minutosParaVencimiento); // sin decimales
          $medida_tiempo = 'Minutos';
        } else if ($actividadExtra['medida_tiempo'] == 2) { // Horas
          $tiempoRestante = round($minutosParaVencimiento / 60);
          $medida_tiempo = 'Horas';
        } else if ($actividadExtra['medida_tiempo'] == 3) { // DÃ­as
          $tiempoRestante = round($minutosParaVencimiento / 1440);
          $medida_tiempo = 'DÃ­as';
        } else {
          $tiempoRestante = round($minutosParaVencimiento);
          $medida_tiempo = 'Minutos';
        }
        $estadoVencimiento = ($tiempoRestante > 0) ? "Faltan {$tiempoRestante} minutos" : "Vencido hace " . abs($tiempoRestante) . " " . $medida_tiempo;

        /* Actualizar el tiempo transcurrido de vencimiento */
        if ($estadoActividad !== 'COMPLETADO' && $estadoActividad === 'VENCIDO') {
          // Si ya venciÃ³, guardar el tiempo en positivo (sin signo)
          $tiempoVencidoGuardar = abs($minutosParaVencimiento);
          $sqlUpdateTiempo = $this->_db3->prepare("
                UPDATE cmx_detalle_opcion_trazabilidad 
                SET tiempo_vencido = :tiempo_vencido
                WHERE detalle_proceso = :id AND numdoc_detalle_opcion = :numdoc
            ");
          $sqlUpdateTiempo->bindParam(':tiempo_vencido', $tiempoVencidoGuardar, PDO::PARAM_INT);
          $sqlUpdateTiempo->bindParam(':id', $actividadExtra['num_proceso'], PDO::PARAM_INT);
          $sqlUpdateTiempo->bindParam(':numdoc', $actividadExtra['numdoc'], PDO::PARAM_STR);
          $sqlUpdateTiempo->execute();
        }

        if (!empty($resultadoActividadDependiente)) {
          $claveUnica = $actividadExtra['actividad_id'];
          foreach ($resultadoActividadDependiente as $actividad) {
            // Verifica si ya se generÃ³ esa fila exacta
            if (in_array($claveUnica, $idsGenerados)) {
              continue;
            }

            $response[] = [
              'posicion' => $actividadExtra['posicion'],
              'nombre_tipo' => $actividadExtra['nombre_tipo'],
              'nombre_opcion' => $actividadExtra['nombre_opcion'], // Actividad actual
              'nom_usuario' => $actividadExtra['nom_usuario'],
              'fecha_inicio' => $actividadExtra['fecha_inicio'],
              'hora_inicio' => $actividadExtra['hora_inicio'],
              'estado_actividad' => $estadoActividad,
              'proceso_id' => $actividadExtra['proceso_id'],
              'actividad_id' => $actividadExtra['actividad_id'],
              'num_proceso' => $actividadExtra['num_proceso'],
              'actividad' => $actividadExtra['actividad'],
              'valor_minutos' => $actividadExtra['valor_minutos'] . ' ' . $medida_tiempo,
              'actividad_dependiente' => $actividad['actividad_dependiente'],
              'nombre_actividad_dependiente' => $actividad['nombre_actividad_dependiente'], // Mostramos el nombre de la dependencia
              'costo_actividad' => $actividadExtra['costo_actividad'],
              'numdoc' => $actividadExtra['numdoc'],
              'fecha_base' => $actividadExtra['fecha_base'] == null ? $actividad['nombre_actividad_dependiente'] : $actividadExtra['fecha_base'],
              'criterio_calculo' => $actividadExtra['criterio_calculo'],
              'tiempo_transcurrido_base' => $actividadExtra['tiempo_transcurrido'] . ' ' . $medida_tiempo,
              'tiempo_transcurrido_actual' => $tiempoTranscurridoActual,
              'tiempo_vencimiento' => $estadoVencimiento,
              'estado_visualizar' => 'VISUALIZADOR', // Opcional
            ];

            $idsGenerados[] = $claveUnica;
          }
        } else {
          // Si no hay actividades dependientes, crear solo una fila como fallback
          $response[] = [
            'posicion' => $actividadExtra['posicion'],
            'nombre_tipo' => $actividadExtra['nombre_tipo'],
            'nombre_opcion' => $actividadExtra['nombre_opcion'],
            'nom_usuario' => $actividadExtra['nom_usuario'],
            'fecha_inicio' => $actividadExtra['fecha_inicio'],
            'hora_inicio' => $actividadExtra['hora_inicio'],
            'estado_actividad' => $estadoActividad,
            'proceso_id' => $actividadExtra['proceso_id'],
            'actividad_id' => $actividadExtra['actividad_id'],
            'num_proceso' => $actividadExtra['num_proceso'],
            'actividad' => $actividadExtra['actividad'],
            'valor_minutos' => $actividadExtra['valor_minutos'] . ' ' . $medida_tiempo,
            'actividad_dependiente' => $actividadExtra['actividad_dependiente'],
            'nombre_actividad_dependiente' => $actividadExtra['nombre_actividad_dependiente'], // Mostramos el nombre de la dependencia
            'costo_actividad' => $actividadExtra['costo_actividad'],
            'numdoc' => $actividadExtra['numdoc'],
            'fecha_base' => $actividadExtra['fecha_base'],
            'criterio_calculo' => $actividadExtra['criterio_calculo'],
            'tiempo_transcurrido_base' => $actividadExtra['tiempo_transcurrido'] . ' ' . $medida_tiempo,
            'tiempo_transcurrido_actual' => $tiempoTranscurridoActual,
            'tiempo_vencimiento' => $estadoVencimiento,
            'estado_visualizar' => 'VISUALIZADOR', // Opcional
          ];
        }
        $actividadesAgregadas[] = $actividadExtra['actividad_id'];
      }
    }

    /* ======================================================
    * CONSULTA SERVICIOS / PEDIDO
    * ====================================================== */
    $sqlServicios = $this->_db3->prepare("
          SELECT DISTINCT
              ptc.razon_social, 
              st.tipo_servicio,
              COALESCE(pv.nombre, 'Sin Vehiculo') AS vehiculo,
              CONCAT(cps.fecha, '-', cps.hora) AS Fecha_registro,
              CONCAT(cps.fecha_vencimiento, '-', cps.hora_vencimiento) AS fecha_limite,
              esp.estado_servicio,
              ptc.id AS proveedorId,
              esp.pedido_id AS PedidoId,
              st.id AS servicioId,
              cps.valor_servicio AS Valor_Servicio,
              CONCAT(cps.fecha_inicio,'-',cps.hora_inicio) AS Fecha_Inicio,
              CONCAT(cps.fecha_actualizacion,'-',cps.hora_actualizacion) AS Fecha_Actualizacion,
              cps.referencia AS Placa,
              cps.cedula_conductor,
              cps.nombre_conductor,
              cps.capacidad,
              cps.tiempo_libre,
              cps.stand_bay,
              cps.cumplimiento,
              cps.contenedor,
              cps.tara
          FROM cmx_recurso_pedido rp
          INNER JOIN cmx_cliente_proveedor_servicio cps ON rp.maestro_id = cps.recurso_id
          INNER JOIN cmx_servicio_torre_control st ON cps.serivicio_id = st.id
          INNER JOIN cmx_proveedor_torre_control ptc ON cps.proveedor_id = ptc.id
          INNER JOIN cmx_estado_servicio_proveedor esp ON cps.pedido_id = esp.pedido_id 
              AND cps.serivicio_id = esp.servicio_id 
              AND rp.maestro_id = esp.recurso_id
              AND ptc.id = esp.proveedor_id 
              AND esp.estado_actual = 1
          LEFT JOIN cmx_para_tipo_vehiculo pv ON cps.tipo_vehiculo = pv.id
           WHERE cps.recurso_id = :maestro_id
          GROUP BY st.tipo_servicio
    ");

    $sqlServicios->bindParam(':maestro_id', $RecursoId, PDO::PARAM_INT);
    $sqlServicios->execute();

    $serviciosResponse = $sqlServicios->fetchAll(PDO::FETCH_ASSOC);
    $actividadesResponse = $response;

    return [
      'actividades' => $actividadesResponse,
      'servicios'   => $serviciosResponse
    ];
  }

  public function GetSeguimientoFacturacion($fecha_inicial, $fecha_final)
  {

    // $ProveedorId = isset($_SESSION['usuario']['proveedor_id']);
    $ProveedorId = $_SESSION['usuario']['proveedor_id'] ?? null;

    if ($ProveedorId) {
      // -----------------------------
      // CONSULTA 1: PEDIDOS
      // -----------------------------
      $sql1 = $this->_db3->prepare("
        SELECT
            pt.modalidad,
            cps.recurso_id,
	          GROUP_CONCAT(DISTINCT pt.referencia_pedido ORDER BY pt.referencia_pedido SEPARATOR ', ') AS referencias_pedido,
            CONCAT(pt.fecha_cargue, ' ', pt.hora_cargue) AS fecha_solicitud,
            CONCAT(cps.fecha, ' ', cps.hora) AS fecha_asignacion,
            ptc.razon_social AS proveedor,
            cps.referencia AS placa,
            cps.nombre_conductor,
            cps.cedula_conductor,
            cps.valor_servicio,
            cps.proveedor_id,
            sf.estado_solicitud,
            sf.estado_aprobacion,
            sf.motivo,
            sf.num_compra,
            sf.num_factura
        FROM cmx_pedido_torre_control pt
        INNER JOIN cmx_cliente_proveedor_servicio cps ON pt.numdoc_solicitud = cps.pedido_id
        INNER JOIN cmx_proveedor_torre_control ptc ON cps.proveedor_id = ptc.id
        INNER JOIN cmx_estado_historico_recurso ehr ON cps.recurso_id = ehr.recurso_id AND cps.proveedor_id = ehr.proveedor_id
        INNER JOIN cmx_subasta_torre_control sbt ON cps.recurso_id = sbt.recurso_id
        LEFT  JOIN cmx_seguimiento_facturacion_torre_control sf ON cps.proveedor_id=sf.proveedor_id AND cps.recurso_id=sf.recurso_id
        WHERE
            sbt.estado_subasta= 'Ganador'
            AND ehr.estado_actual = 1
            AND ehr.proveedor_id = ?
            AND sbt.fecha BETWEEN ? AND ?
            AND sf.estado_actual = 1
        GROUP BY
          cps.recurso_id
    ");

      // ehr.estado_recurso = 'Completado'

      $sql1->execute([$ProveedorId, $fecha_inicial, $fecha_final]);
      $pedidos = $sql1->fetchAll(PDO::FETCH_ASSOC);

      // -----------------------------
      // CONSULTA 2: SERVICIOS ESPECIALES
      // -----------------------------
      $sql2 = $this->_db3->prepare("
        SELECT
            ser.recurso_id,
            SUM(COALESCE(ser.valor_servicio, 0)) AS total_servicios
        FROM cmx_servicio_especial_recurso_tr AS ser
        WHERE ser.estado_servicio_especial = 'Aprobado' AND ser.proveedor_id=?
        GROUP BY ser.recurso_id
    ");

      $sql2->execute([$ProveedorId]);
      $especiales = $sql2->fetchAll(PDO::FETCH_ASSOC);

      // Indexar servicios especiales por recurso_id
      $especialesIndexado = [];
      foreach ($especiales as $e) {
        $especialesIndexado[$e['recurso_id']] = $e['total_servicios'];
      }

      // -----------------------------
      // Unificar resultados
      // -----------------------------
      $final = [];

      foreach ($pedidos as $p) {

        $recurso = $p['recurso_id'];

        $final[] = [
          'modalidad'          => $p['modalidad'],
          'referencias_pedido' => $p['referencias_pedido'],
          'fecha_solicitud'    => $p['fecha_solicitud'],
          'fecha_asignacion'   => $p['fecha_asignacion'],
          'proveedor'          => $p['proveedor'],
          'placa'              => $p['placa'],
          'nombre_conductor'   => $p['nombre_conductor'],
          'cedula_conductor'   => $p['cedula_conductor'],
          'valor_servicio'     => $p['valor_servicio'],
          'proveedor_id'       => $p['proveedor_id'],
          'recurso_id'         => $recurso,
          'estado_solicitud'   => $p['estado_solicitud'],
          'estado_aprobacion'  => $p['estado_aprobacion'],
          'motivo'             => $p['motivo'],
          'num_compra'         => $p['num_compra'],
          'num_factura'        => $p['num_factura'],

          // SI EXISTE lo pone, si no → 0
          'servicios_especiales' => $especialesIndexado[$recurso] ?? 0
        ];
      }
    } else {
      // -----------------------------
      // CONSULTA 1: PEDIDOS
      // -----------------------------
      $sql1 = $this->_db3->prepare("
          SELECT
              pt.modalidad,
              cps.recurso_id,
              GROUP_CONCAT(DISTINCT pt.referencia_pedido ORDER BY pt.referencia_pedido SEPARATOR ', ') AS referencias_pedido,
              CONCAT(pt.fecha_cargue, ' ', pt.hora_cargue) AS fecha_solicitud,
              CONCAT(cps.fecha, ' ', cps.hora) AS fecha_asignacion,
              ptc.razon_social AS proveedor,
              cps.referencia AS placa,
              cps.nombre_conductor,
              cps.cedula_conductor,
              cps.valor_servicio,
              cps.proveedor_id,
              sf.estado_solicitud,
              sf.estado_aprobacion,
              sf.motivo,
              sf.num_compra,
              sf.num_factura
          FROM cmx_pedido_torre_control pt
          INNER JOIN cmx_cliente_proveedor_servicio cps ON pt.numdoc_solicitud = cps.pedido_id
          INNER JOIN cmx_proveedor_torre_control ptc ON cps.proveedor_id = ptc.id
          INNER JOIN cmx_estado_historico_recurso ehr ON cps.recurso_id = ehr.recurso_id AND cps.proveedor_id = ehr.proveedor_id
          INNER JOIN cmx_subasta_torre_control sbt ON cps.recurso_id = sbt.recurso_id
          LEFT  JOIN cmx_seguimiento_facturacion_torre_control sf ON cps.proveedor_id=sf.proveedor_id AND cps.recurso_id=sf.recurso_id
          WHERE
              sbt.estado_subasta= 'Ganador'
              AND ehr.estado_actual = 1
              AND sbt.fecha BETWEEN ? AND ?
              AND sf.estado_actual = 1
          GROUP BY
            cps.recurso_id
      ");

      $sql1->execute([$fecha_inicial, $fecha_final]);
      $pedidos = $sql1->fetchAll(PDO::FETCH_ASSOC);

      // -----------------------------
      // CONSULTA 2: SERVICIOS ESPECIALES
      // -----------------------------
      $sql2 = $this->_db3->prepare("
          SELECT
              ser.recurso_id,
              SUM(COALESCE(ser.valor_servicio, 0)) AS total_servicios
          FROM cmx_servicio_especial_recurso_tr AS ser
          WHERE ser.estado_servicio_especial = 'Aprobado'
          GROUP BY ser.recurso_id
      ");

      $sql2->execute();
      $especiales = $sql2->fetchAll(PDO::FETCH_ASSOC);

      // Indexar servicios especiales por recurso_id
      $especialesIndexado = [];
      foreach ($especiales as $e) {
        $especialesIndexado[$e['recurso_id']] = $e['total_servicios'];
      }

      // -----------------------------
      // Unificar resultados
      // -----------------------------
      $final = [];

      foreach ($pedidos as $p) {

        $recurso = $p['recurso_id'];

        $final[] = [
          'modalidad'          => $p['modalidad'],
          'referencias_pedido' => $p['referencias_pedido'],
          'fecha_solicitud'    => $p['fecha_solicitud'],
          'fecha_asignacion'   => $p['fecha_asignacion'],
          'proveedor'          => $p['proveedor'],
          'placa'              => $p['placa'],
          'nombre_conductor'   => $p['nombre_conductor'],
          'cedula_conductor'   => $p['cedula_conductor'],
          'valor_servicio'     => $p['valor_servicio'],
          'proveedor_id'       => $p['proveedor_id'],
          'recurso_id'         => $recurso,
          'estado_solicitud'   => $p['estado_solicitud'],
          'estado_aprobacion'  => $p['estado_aprobacion'],
          'motivo'             => $p['motivo'],
          'num_compra'         => $p['num_compra'],
          'num_factura'        => $p['num_factura'],

          // SI EXISTE lo pone, si no → 0
          'servicios_especiales' => $especialesIndexado[$recurso] ?? 0
        ];
      }
    }

    return [
      'success' => true,
      'data' => $final
    ];
  }

  public function GetDetalleFacturaModel($recurso_id, $proveedor_id)
  {
    // ========== CONSULTA 1: DETALLE PRINCIPAL ==========
    $sql1 = $this->_db3->prepare("
        SELECT
            cps.pedido_id,
            cps.referencia,
            cps.nombre_conductor,
            cps.cedula_conductor,
            cps.valor_servicio,
            sf.soporte_facturacion,
            sf.soporte_factura,
            sf.soporte_orden_compra
        FROM cmx_cliente_proveedor_servicio cps
        LEFT JOIN cmx_seguimiento_facturacion_torre_control sf ON cps.proveedor_id=sf.proveedor_id AND cps.recurso_id=sf.recurso_id
        WHERE cps.recurso_id = ?
          AND cps.proveedor_id = ?
    ");

    $sql1->execute([$recurso_id, $proveedor_id]);
    $detalle = $sql1->fetchAll(PDO::FETCH_ASSOC);

    // ========== CONSULTA 2: SERVICIOS ESPECIALES ==========
    $sql2 = $this->_db3->prepare("
        SELECT
            ts.nombre AS servicio_especial,
            pv.razon_social AS proveedor,
            sr.valor_servicio,
            sr.soporte_servicio_especial,
            sr.id
        FROM cmx_servicio_especial_recurso_tr sr
        INNER JOIN cmx_proveedor_torre_control pv ON sr.proveedor_id = pv.id
        INNER JOIN cmx_para_tipo_sevicio ts ON sr.servicio_especial = ts.id
        WHERE sr.proveedor_id = ?
          AND sr.recurso_id = ?
          AND sr.estado_servicio_especial = 'Aprobado'
    ");

    $sql2->execute([$proveedor_id, $recurso_id]);
    $servicios = $sql2->fetchAll(PDO::FETCH_ASSOC);

    // ========== CONSULTA 3: PUNTOS DE ENTREGA ==========
    $sql3 = $this->_db3->prepare("
        SELECT
          pt.referencia_pedido,
          pt.ciudad_origen,
          pt.remitente,
          pt.ciudad_destino,
          pt.destinatario
        FROM
          cmx_pedido_torre_control pt
          INNER JOIN cmx_cliente_proveedor_servicio cps ON pt.numdoc_solicitud = cps.pedido_id
        WHERE cps.recurso_id = ?
          AND cps.proveedor_id = ?
    ");

    $sql3->execute([$recurso_id, $proveedor_id]);
    $puntos = $sql3->fetchAll(PDO::FETCH_ASSOC);

    // ========== RETORNO ==========
    return [
      "success" => true,
      "detalle" => $detalle,
      "servicios_especiales" => $servicios,
      "puntos_entrega" => $puntos
    ];
  }

  // public function GuardarSeguimientoFacturaModel($recurso_id, $proveedor_id, $valor_principal, $soporte_flete, $soporte_factura, $servicios, $files)
  public function GuardarSeguimientoFacturaModel($recurso_id, $proveedor_id, $valor_principal, $soporte_flete, $servicios, $files)
  {
    $fecha = date("Y-m-d");
    $hora  = date("H:i:s");

    // ================================
    // RUTAS BASE POR RECURSO
    // ================================
    $rutaRecurso = __DIR__ . "/../public/files/torrecontrol/soportes_facturacion/" . $recurso_id . "/";

    // Subcarpetas
    // $rutaFactura       = $rutaRecurso . "factura/";
    $rutaFlete       = $rutaRecurso . "flete/";
    $rutaServicios   = $rutaRecurso . "servicios_especiales/";

    // Crear carpetas si no existen
    // if (!file_exists($rutaFactura)) mkdir($rutaFactura, 0777, true);
    if (!file_exists($rutaFlete)) mkdir($rutaFlete, 0777, true);
    if (!file_exists($rutaServicios)) mkdir($rutaServicios, 0777, true);

    // =================================================
    // 1️⃣ SUBIR SOPORTE DEL FLETE (archivo principal)
    // =================================================
    // $rutaFacturaBD = null;


    // if (isset($files["soporte_factura"]["name"]) && $files["soporte_factura"]["name"] != "") {

    //   $nombreArchivo = $files["soporte_factura"]["name"];
    //   $tmp = $files["soporte_factura"]["tmp_name"];

    //   $nombreSeguro = uniqid() . "_" . preg_replace('/\s+/', '_', $nombreArchivo);

    //   $rutaFinal = $rutaFactura . $nombreSeguro;

    //   if (move_uploaded_file($tmp, $rutaFinal)) {
    //     $rutaFacturaBD = "public/files/torrecontrol/soportes_facturacion/$recurso_id/factura/$nombreSeguro";
    //   }
    // }

    #Soportes de cumplidos
    $rutaFleteBD = null;
    if (isset($files["soporte_flete"]["name"]) && $files["soporte_flete"]["name"] != "") {

      $nombreArchivo = $files["soporte_flete"]["name"];
      $tmp = $files["soporte_flete"]["tmp_name"];

      $nombreSeguro = uniqid() . "_" . preg_replace('/\s+/', '_', $nombreArchivo);

      $rutaFinal = $rutaFlete . $nombreSeguro;

      if (move_uploaded_file($tmp, $rutaFinal)) {
        $rutaFleteBD = "public/files/torrecontrol/soportes_facturacion/$recurso_id/flete/$nombreSeguro";
      }
    }

    // =================================================
    // 2️⃣ Actualizar SERVICIOS ESPECIALES
    // =================================================
    foreach ($servicios as $index => $srv) {

      $id_servicio = $srv['id'];
      $valor       = $srv['valor'];
      $soporteRuta = null;

      // SUBIR SOPORTE DEL SERVICIO
      if (isset($files["servicios"]["name"][$index]["soporte"]) && $files["servicios"]["name"][$index]["soporte"] != "") {

        $nombreArchivo = $files["servicios"]["name"][$index]["soporte"];
        $tmp = $files["servicios"]["tmp_name"][$index]["soporte"];

        $nombreSeguro = uniqid() . "_" . preg_replace('/\s+/', '_', $nombreArchivo);

        $rutaFinal = $rutaServicios . $nombreSeguro;

        if (move_uploaded_file($tmp, $rutaFinal)) {
          $soporteRuta = "public/files/torrecontrol/soportes_facturacion/$recurso_id/servicios_especiales/$nombreSeguro";
        }
      }

      // Actualizar BD
      if ($soporteRuta) {
        $sql = $this->_db3->prepare("
                UPDATE cmx_servicio_especial_recurso_tr
                SET valor_servicio = ?, soporte_servicio_especial = ?
                WHERE id = ?
            ");
        $sql->execute([$valor, $soporteRuta, $id_servicio]);
      } else {
        $sql = $this->_db3->prepare("
                UPDATE cmx_servicio_especial_recurso_tr
                SET valor_servicio = ?
                WHERE id = ?
            ");
        $sql->execute([$valor, $id_servicio]);
      }
    }

    // ===============================================
    // 3️⃣ ACTUALIZAR REGISTROS ANTERIORES (estado_actual = 0)
    // ===============================================
    $upd = $this->_db3->prepare("
        UPDATE cmx_seguimiento_facturacion_torre_control
        SET estado_actual = 0
        WHERE recurso_id = ? AND proveedor_id = ?
    ");
    $upd->execute([$recurso_id, $proveedor_id]);

    // ===============================================
    // 4️⃣ INSERTAR NUEVO SEGUIMIENTO (estado_actual = 1)
    // ===============================================
    $sql = $this->_db3->prepare("
        INSERT INTO cmx_seguimiento_facturacion_torre_control
        (recurso_id, proveedor_id, total_facturacion, soporte_facturacion, 
        usuario_solicitud, estado_solicitud, fecha_solicitud, hora_solicitud, 
        fecha, hora, empresa_id, estado_actual)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $sql->execute([
      $recurso_id,
      $proveedor_id,
      $valor_principal,
      $rutaFleteBD,
      $_SESSION['usuario']['nom_usuario'],
      'Pendiente',
      $fecha,
      $hora,
      $fecha,
      $hora,
      $_SESSION['usuario']['empresa_id'],
      1
    ]);

    // $sql = $this->_db3->prepare("
    // INSERT INTO cmx_seguimiento_facturacion_torre_control
    // (recurso_id, proveedor_id, total_facturacion, soporte_facturacion, soporte_factura, usuario_solicitud, estado_solicitud, fecha_solicitud, hora_solicitud, fecha, hora, empresa_id)
    // VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    // ");

    // $sql->execute([
    //   $recurso_id,
    //   $proveedor_id,
    //   $valor_principal,
    //   $rutaFleteBD, // soporte principal
    //   $rutaFacturaBD, // soporte principal
    //   $_SESSION['usuario']['nom_usuario'],
    //   'Pendiente',
    //   $fecha,
    //   $hora,
    //   $fecha,
    //   $hora,
    //   $_SESSION['usuario']['empresa_id']
    // ]);

    return ["success" => true];
  }

  public function GuardarEstadoFacturacionModel($recurso_id, $proveedor_id, $estado, $motivo)
  {
    $usuario = $_SESSION['usuario']['nom_usuario'];
    $fecha   = date("Y-m-d");
    $hora    = date("H:i:s");

    // Consulta si ya existe seguimiento creado
    $sql = $this->_db3->prepare("
        SELECT id 
        FROM cmx_seguimiento_facturacion_torre_control
        WHERE recurso_id = ? AND proveedor_id = ?
        ORDER BY id DESC
        LIMIT 1
    ");
    $sql->execute([$recurso_id, $proveedor_id]);
    $row = $sql->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
      return ["success" => false, "message" => "No existe un registro de facturación para este recurso."];
    }

    $id = $row['id'];

    // Actualizar aprobaciones
    $sql2 = $this->_db3->prepare("
        UPDATE cmx_seguimiento_facturacion_torre_control
        SET 
            usuario_aprobacion = ?,
            estado_solicitud = ?,
            estado_aprobacion = ?,
            fecha_aprobacion = ?,
            hora_probacion = ?,
            motivo = ?
        WHERE id = ?
    ");

    $sql2->execute([
      $usuario,
      $estado,
      $estado,
      $fecha,
      $hora,
      $motivo,
      $id
    ]);

    return ["success" => true];
  }

  public function InsertarServiciosEspeciales($maestro_id, $servicios, $servicio_id, $proveedor_id)
  {
    $fecha = date("Y-m-d");
    $hora  = date("H:i:s");
    $usuario = $_SESSION["usuario"]["nom_usuario"];
    $empresa_id = $_SESSION["usuario"]["empresa_id"];

    foreach ($servicios as $srv) {

      $sql = $this->_db3->prepare("
            INSERT INTO cmx_servicio_especial_recurso_tr
            (servicio_id, proveedor_id, recurso_id, servicio_especial, valor_servicio, estado_servicio_especial, usuario, fecha, hora, empresa_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");

      $sql->execute([
        $servicio_id,
        $proveedor_id,
        $maestro_id,
        $srv['id'],
        $srv['valor'],
        'Solicitado',
        $usuario,
        $fecha,
        $hora,
        $empresa_id
      ]);
    }

    return ["success" => true];
  }

  public function InsertarOrdenCompra($file, $recurso, $proveedor)
  {
    // Ruta donde se guardará físicamente el archivo
    $directorio = __DIR__ . "/../public/files/torrecontrol/orden_compra/" . $recurso . "/";

    if (!is_dir($directorio)) {
      mkdir($directorio, 0777, true);
    }

    // Extensión
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);

    // Nombre único del archivo
    $nombreArchivo = uniqid() . "." . $extension;

    // Ruta física donde se moverá el archivo
    $rutaDestino = $directorio . $nombreArchivo;

    // Ruta RELATIVA para guardar en BD
    $rutaDB = "public/files/torrecontrol/orden_compra/" . $recurso . "/" . $nombreArchivo;

    // Mover archivo
    if (!move_uploaded_file($file['tmp_name'], $rutaDestino)) {
      return ["success" => false, "message" => "No se pudo guardar el archivo."];
    }

    // Guardar ruta en BD
    $sql = "UPDATE cmx_seguimiento_facturacion_torre_control 
            SET soporte_orden_compra = ?
            WHERE recurso_id = ? AND proveedor_id = ?";

    $params = [$rutaDB, $recurso, $proveedor];

    $result = $this->ejecuteRegistroParams($sql, $params);

    if ($result) {
      return [
        "success" => true,
        "message" => "Archivo guardado correctamente",
        "file"    => $rutaDB     // <-- lo regresamos también
      ];
    }

    return ["success" => false, "message" => "No se pudo actualizar la BD."];
  }

  public function ejecuteRegistroParams($sql, $params)
  {
    $stmt = $this->_db3->prepare($sql);

    if (!$stmt) return false;

    return $stmt->execute($params);
  }

  public function InsertarSoporteFacturacion($file, $recurso, $proveedor)
  {
    // Ruta donde se guardará físicamente el archivo
    $directorio = __DIR__ . "/../public/files/torrecontrol/factura/" . $recurso . "/";

    if (!is_dir($directorio)) {
      mkdir($directorio, 0777, true);
    }

    // Extensión
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);

    // Nombre único del archivo
    $nombreArchivo = uniqid() . "." . $extension;

    // Ruta física donde se moverá el archivo
    $rutaDestino = $directorio . $nombreArchivo;

    // Ruta RELATIVA para guardar en BD
    $rutaDB = "public/files/torrecontrol/factura/" . $recurso . "/" . $nombreArchivo;

    // Mover archivo
    if (!move_uploaded_file($file['tmp_name'], $rutaDestino)) {
      return ["success" => false, "message" => "No se pudo guardar el archivo."];
    }

    // Guardar ruta en BD
    $sql = "UPDATE cmx_seguimiento_facturacion_torre_control 
            SET soporte_factura = ?
            WHERE recurso_id = ? AND proveedor_id = ?";

    $params = [$rutaDB, $recurso, $proveedor];

    $result = $this->ejecuteRegistroParams($sql, $params);

    if ($result) {
      return [
        "success" => true,
        "message" => "Archivo guardado correctamente",
        "file"    => $rutaDB     // <-- lo regresamos también
      ];
    }

    return ["success" => false, "message" => "No se pudo actualizar la BD."];
  }

  public function ActualizarOrdenCompra($pedido, $orden)
  {

    $ProveedorId = $_SESSION['usuario']['proveedor_id'] ?? null;
    if ($ProveedorId) {
      // "395966, 403457, 404718-1"
      $pedidos = array_map('trim', explode(',', $pedido));

      if (empty($pedidos)) {
        error_log("No hay pedidos para procesar");
        return false;
      }

      foreach ($pedidos as $pedidoItem) {

        /**
         * 1️⃣ PRIMER SELECT
         *    BUSCAR numdoc_solicitud EN cmx_pedido_torre_control
         */
        $sql1 = "SELECT numdoc_solicitud 
                   FROM cmx_pedido_torre_control
                   WHERE referencia_pedido = ?   -- Ajusta según el nombre REAL de la columna
                   LIMIT 1";

        $stmt1 = $this->_db3->prepare($sql1);
        $stmt1->execute([$pedidoItem]);
        $row1 = $stmt1->fetch(PDO::FETCH_ASSOC);

        if (!$row1) {
          error_log("No existe numdoc_solicitud para pedido: $pedidoItem");
          continue;
        }

        $numdocSolicitud = $row1['numdoc_solicitud'];

        /**
         * 2️⃣ SEGUNDO SELECT
         *    USAR numdoc_solicitud PARA OBTENER recurso_id
         *    EN cmx_cliente_proveedor_servicio
         */
        $sql2 = "SELECT recurso_id 
                   FROM cmx_cliente_proveedor_servicio
                   WHERE pedido_id = ?
                   LIMIT 1";

        $stmt2 = $this->_db3->prepare($sql2);
        $stmt2->execute([$numdocSolicitud]);
        $row2 = $stmt2->fetch(PDO::FETCH_ASSOC);

        if (!$row2) {
          error_log("No existe recurso_id para numdoc_solicitud: $numdocSolicitud");
          continue;
        }

        $recursoId = $row2['recurso_id'];


        /**
         * 3️⃣ ACTUALIZAR ORDEN EN cmx_seguimiento_facturacion_torre_control
         */
        $sql3 = "UPDATE cmx_seguimiento_facturacion_torre_control
                   SET num_factura = ?
                   WHERE recurso_id = ? AND estado_actual=1";

        $stmt3 = $this->_db3->prepare($sql3);
        $stmt3->execute([$orden, $recursoId]);
      }
    } else {
      // "395966, 403457, 404718-1"
      $pedidos = array_map('trim', explode(',', $pedido));

      if (empty($pedidos)) {
        error_log("No hay pedidos para procesar");
        return false;
      }

      foreach ($pedidos as $pedidoItem) {

        /**
         * 1️⃣ PRIMER SELECT
         *    BUSCAR numdoc_solicitud EN cmx_pedido_torre_control
         */
        $sql1 = "SELECT numdoc_solicitud 
                   FROM cmx_pedido_torre_control
                   WHERE referencia_pedido = ?   -- Ajusta según el nombre REAL de la columna
                   LIMIT 1";

        $stmt1 = $this->_db3->prepare($sql1);
        $stmt1->execute([$pedidoItem]);
        $row1 = $stmt1->fetch(PDO::FETCH_ASSOC);

        if (!$row1) {
          error_log("No existe numdoc_solicitud para pedido: $pedidoItem");
          continue;
        }

        $numdocSolicitud = $row1['numdoc_solicitud'];

        /**
         * 2️⃣ SEGUNDO SELECT
         *    USAR numdoc_solicitud PARA OBTENER recurso_id
         *    EN cmx_cliente_proveedor_servicio
         */
        $sql2 = "SELECT recurso_id 
                   FROM cmx_cliente_proveedor_servicio
                   WHERE pedido_id = ?
                   LIMIT 1";

        $stmt2 = $this->_db3->prepare($sql2);
        $stmt2->execute([$numdocSolicitud]);
        $row2 = $stmt2->fetch(PDO::FETCH_ASSOC);

        if (!$row2) {
          error_log("No existe recurso_id para numdoc_solicitud: $numdocSolicitud");
          continue;
        }

        $recursoId = $row2['recurso_id'];


        /**
         * 3️⃣ ACTUALIZAR ORDEN EN cmx_seguimiento_facturacion_torre_control
         */
        $sql3 = "UPDATE cmx_seguimiento_facturacion_torre_control
                   SET num_compra = ?
                   WHERE recurso_id = ? AND estado_actual=1";

        $stmt3 = $this->_db3->prepare($sql3);
        $stmt3->execute([$orden, $recursoId]);
      }
    }

    return true;
  }

  public function aprobarMasivoPorRecurso(array $recursoIds): bool
  {
    if (empty($recursoIds)) {
      return false;
    }

    $usuario    = $_SESSION["usuario"]["nom_usuario"];
    $empresa_id = $_SESSION["usuario"]["empresa_id"];

    // Placeholders dinámicos (?, ?, ?)
    $placeholders = implode(',', array_fill(0, count($recursoIds), '?'));

    $sql = "
        UPDATE cmx_seguimiento_facturacion_torre_control
        SET
            estado_solicitud   = 'Aprobado',
            estado_aprobacion  = 'Aprobado',
            fecha_aprobacion   = CURDATE(),
            hora_aprobacion    = CURTIME(),
            usuario_aprobacion = ?
        WHERE recurso_id IN ($placeholders)
          AND estado_aprobacion = 'Pendiente'
          AND estado_actual = 1
          AND empresa_id = ?
    ";

    // usuario + recurso_ids + empresa
    $params = array_merge([$usuario], $recursoIds, [$empresa_id]);

    try {
      $this->_db3->beginTransaction();

      $stmt = $this->_db3->prepare($sql);
      $stmt->execute($params);

      $this->_db3->commit();
      return true;
    } catch (\Throwable $e) {
      $this->_db3->rollBack();
      error_log('Error aprobarMasivoPorRecurso: ' . $e->getMessage());
      return false;
    }
  }

  public function ListarProveedores()
  {
    $sql = $this->_db3->prepare("SELECT * FROM cmx_proveedor_torre_control WHERE tipo_proveedor='Transportador' AND estado_proveedor='Activo'");
    $sql->execute();

    return $sql->fetchAll(PDO::FETCH_ASSOC);
  }

  public function ReasignarProveedorMaestro($maestroId, $proveedorActualId, $proveedorNuevoId, $MotivoCancelacion, $usuarioId = null)
  {
    $usuario    = $_SESSION["usuario"]["nom_usuario"];
    $empresa_id = $_SESSION["usuario"]["empresa_id"];
    try {
      $this->_db3->beginTransaction();

      /*
        ======================================================
        1. cmx_cliente_proveedor_servicio
        ======================================================
      */

      $sqlInsertCPS = "
          INSERT INTO cmx_cliente_proveedor_servicio (
              pedido_id,
              proveedor_id,
              serivicio_id,
              fecha_vencimiento,
              hora_vencimiento,
              estado_pedido_asignado,
              proceso,
              tipo_vehiculo,
              recurso_id,
              usuario,
              fecha,
              hora,
              empresa_id
          )
          SELECT
              pedido_id,
              ?,                     -- proveedor nuevo
              serivicio_id,
              fecha_vencimiento,
              hora_vencimiento,
              'Activo',
              proceso,
              tipo_vehiculo,
              recurso_id,
              usuario,
              CURDATE(),
              CURTIME(),
              empresa_id
          FROM cmx_cliente_proveedor_servicio
          WHERE proveedor_id = ?
            AND recurso_id   = ?
      ";

      $this->_db3->prepare($sqlInsertCPS)
        ->execute([$proveedorNuevoId, $proveedorActualId, $maestroId]);

      // CANCELAR proveedor anterior
      $sqlUpdateCPS = "
            UPDATE cmx_cliente_proveedor_servicio
            SET estado_pedido_asignado = 'Cancelado',
                fecha_actualizacion = CURDATE(),
                hora_actualizacion  = CURTIME()
            WHERE proveedor_id = ?
              AND recurso_id   = ?
        ";
      $this->_db3->prepare($sqlUpdateCPS)
        ->execute([$proveedorActualId, $maestroId]);

      /*
        ======================================================
        2. cmx_pedido_proveedor_estado
        ======================================================
      */

      // INSERT nuevo proveedor
      // $sqlInsertPPE = "
      //       INSERT INTO cmx_pedido_proveedor_estado (
      //           pedido_id,
      //           proveedor_id,
      //           recurso_id,
      //           estado_proceso_pedido,
      //           estado_visualizar,
      //           usuario,
      //           fecha,
      //           hora,
      //           empresa_id
      //       )
      //       SELECT
      //           pedido_id,
      //           ?,
      //           recurso_id,
      //           estado_proceso_pedido,
      //           1,
      //           usuario,
      //           CURDATE(),
      //           CURTIME(),
      //           empresa_id
      //       FROM cmx_pedido_proveedor_estado
      //       WHERE proveedor_id = ?
      //         AND recurso_id   = ?
      //         AND estado_visualizar = 1
      //   ";

      $sqlInsertPPE = "
            INSERT INTO cmx_pedido_proveedor_estado (
                pedido_id,
                proveedor_id,
                recurso_id,
                estado_proceso_pedido,
                estado_visualizar,
                usuario,
                fecha,
                hora,
                empresa_id
            )
            SELECT
                pedido_id,
                ?,
                recurso_id,
                'Pendiente Iniciar',
                1,
                usuario,
                CURDATE(),
                CURTIME(),
                empresa_id
            FROM cmx_pedido_proveedor_estado
            WHERE proveedor_id = ?
              AND recurso_id   = ?
              AND estado_visualizar = 1
        ";
      $this->_db3->prepare($sqlInsertPPE)
        ->execute([$proveedorNuevoId, $proveedorActualId, $maestroId]);

      // CANCELAR anterior
      $sqlUpdatePPE = "
            UPDATE cmx_pedido_proveedor_estado
            SET estado_visualizar = 0,
                estado_proceso_pedido = 'Cancelado'
            WHERE proveedor_id = ?
              AND recurso_id   = ?
              AND estado_visualizar = 1
        ";
      $this->_db3->prepare($sqlUpdatePPE)
        ->execute([$proveedorActualId, $maestroId]);

      /*
        ======================================================
        3. cmx_estado_servicio_proveedor
        ======================================================
        */

      // INSERT nuevo proveedor
      // $sqlInsertESP = "
      //       INSERT INTO cmx_estado_servicio_proveedor (
      //           pedido_id,
      //           servicio_id,
      //           proveedor_id,
      //           recurso_id,
      //           estado_servicio,
      //           estado_actual,
      //           usuario,
      //           fecha,
      //           hora,
      //           empresa_id
      //       )
      //       SELECT
      //           pedido_id,
      //           servicio_id,
      //           ?,
      //           recurso_id,
      //           estado_servicio,
      //           1,
      //           usuario,
      //           CURDATE(),
      //           CURTIME(),
      //           empresa_id
      //       FROM cmx_estado_servicio_proveedor
      //       WHERE proveedor_id = ?
      //         AND recurso_id   = ?
      //         AND estado_actual = 1
      //   ";

      $sqlInsertESP = "
            INSERT INTO cmx_estado_servicio_proveedor (
                pedido_id,
                servicio_id,
                proveedor_id,
                recurso_id,
                estado_servicio,
                estado_actual,
                usuario,
                fecha,
                hora,
                empresa_id
            )
            SELECT
                pedido_id,
                servicio_id,
                ?,
                recurso_id,
                'Pendiente Iniciar',
                1,
                usuario,
                CURDATE(),
                CURTIME(),
                empresa_id
            FROM cmx_estado_servicio_proveedor
            WHERE proveedor_id = ?
              AND recurso_id   = ?
              AND estado_actual = 1
        ";
      $this->_db3->prepare($sqlInsertESP)
        ->execute([$proveedorNuevoId, $proveedorActualId, $maestroId]);

      // CANCELAR anterior
      $sqlUpdateESP = "
            UPDATE cmx_estado_servicio_proveedor
            SET estado_actual = 0,
                estado_servicio = 'Cancelado'
            WHERE proveedor_id = ?
              AND recurso_id   = ?
              AND estado_actual = 1
        ";
      $this->_db3->prepare($sqlUpdateESP)
        ->execute([$proveedorActualId, $maestroId]);


      /*
        ======================================================
        4. cmx_estado_historico_recurso  ✅ NUEVO
        ======================================================
      */

      // $sqlInsertEHR = "
      //       INSERT INTO cmx_estado_historico_recurso (
      //           recurso_id,
      //           proveedor_id,
      //           estado_recurso,
      //           estado_actual,
      //           usuario,
      //           fecha,
      //           hora,
      //           empresa_id
      //       )
      //       SELECT
      //           recurso_id,
      //           ?,
      //           estado_recurso,
      //           1,
      //           usuario,
      //           CURDATE(),
      //           CURTIME(),
      //           empresa_id
      //       FROM cmx_estado_historico_recurso
      //       WHERE proveedor_id = ?
      //         AND recurso_id   = ?
      //         AND estado_actual = 1
      //   ";

      $sqlInsertEHR = "
            INSERT INTO cmx_estado_historico_recurso (
                recurso_id,
                proveedor_id,
                estado_recurso,
                estado_actual,
                usuario,
                fecha,
                hora,
                empresa_id
            )
            SELECT
                recurso_id,
                ?,
                'Pendiente Iniciar',
                1,
                usuario,
                CURDATE(),
                CURTIME(),
                empresa_id
            FROM cmx_estado_historico_recurso
            WHERE proveedor_id = ?
              AND recurso_id   = ?
              AND estado_actual = 1
        ";
      $this->_db3->prepare($sqlInsertEHR)
        ->execute([$proveedorNuevoId, $proveedorActualId, $maestroId]);

      $sqlUpdateEHR = "
            UPDATE cmx_estado_historico_recurso
            SET estado_actual = 0,
                estado_recurso = 'Cancelado'
            WHERE proveedor_id = ?
              AND recurso_id   = ?
              AND estado_actual = 1
        ";
      $this->_db3->prepare($sqlUpdateEHR)
        ->execute([$proveedorActualId, $maestroId]);

      /*
        ======================================================
        5. cmx_servicio_especial_recurso_tr 
        ======================================================
      */

      // $sqlInsertSE = "
      //   INSERT INTO cmx_servicio_especial_recurso_tr (servicio_id, proveedor_id, recurso_id, servicio_especial, valor_servicio, estado_servicio_especial, usuario, fecha, hora, empresa_id)
      //   SELECT servicio_id, ?, recurso_id, servicio_especial, valor_servicio, estado_servicio_especial, usuario,  CURDATE(), CURTIME(), empresa_id FROM cmx_servicio_especial_recurso_tr WHERE proveedor_id = ? AND recurso_id = ?
      // ";
      // $this->_db3->prepare($sqlInsertSE)
      //   ->execute([$proveedorNuevoId, $proveedorActualId, $maestroId]);

      $sqlUpdatese = "
            UPDATE cmx_servicio_especial_recurso_tr
            SET estado_servicio_especial = 'Cancelado'
            WHERE proveedor_id = ?
              AND recurso_id   = ?
        ";
      $this->_db3->prepare($sqlUpdatese)
        ->execute([$proveedorActualId, $maestroId]);

      /*
        ======================================================
        5. HISTORIAL
        ======================================================
        */
      $sqlHistorial = "
            INSERT INTO cmx_historial_reasignacion_proveedor (
                maestro_id,
                proveedor_anterior_id,
                proveedor_nuevo_id,
                motivo,
                usuario,
                fecha,
                hora,
                empresa_id
            )
            VALUES (?, ?, ?, ?, ?, NOW(),NOW(),?)
        ";
      $this->_db3->prepare($sqlHistorial)->execute([
        $maestroId,
        $proveedorActualId,
        $proveedorNuevoId,
        $MotivoCancelacion,
        $usuario,
        $empresa_id
      ]);

      $this->_db3->commit();
      return true;
    } catch (Exception $e) {
      $this->_db3->rollBack();
      error_log('Error ReasignarProveedorMaestro: ' . $e->getMessage());
      return false;
    }
  }

  public function cancelar_asignacion_recurso_torre_control_subasta($RecursoId, $ProveedoresId, $motivo_cancelacion)
  {
    try {
      $this->_db3->beginTransaction();

      /*
        ======================================================
        1. Obtener pedidos asociados al recurso
        ======================================================
        */
      $sql_select_pedidos = $this->_db3->prepare("
            SELECT pedido_id
            FROM cmx_cliente_proveedor_servicio
            WHERE recurso_id = :RecursoId
        ");
      $sql_select_pedidos->bindParam(':RecursoId', $RecursoId, PDO::PARAM_INT);
      $sql_select_pedidos->execute();

      $pedidoIds = $sql_select_pedidos->fetchAll(PDO::FETCH_COLUMN);

      if (empty($pedidoIds)) {
        throw new Exception('No se encontraron pedidos asociados al recurso');
      }

      /*
        ======================================================
        2. cmx_cliente_proveedor_servicio
        ======================================================
      */
      $sql_update_cps = $this->_db3->prepare("
            UPDATE cmx_cliente_proveedor_servicio
            SET estado_pedido_asignado = 'Rechazado',
                motivo_cancelacion = :motivo_cancelacion
            WHERE recurso_id = :RecursoId AND proveedor_id= :ProveedorId
        ");

      // $sql_update_cps = $this->_db3->prepare("
      //       UPDATE cmx_cliente_proveedor_servicio
      //       SET estado_pedido_asignado = 'Rechazado',
      //           proceso = 'Pendiente',
      //           motivo_cancelacion = :motivo_cancelacion
      //       WHERE recurso_id = :RecursoId
      //   ");

      $sql_update_cps->bindParam(':RecursoId', $RecursoId, PDO::PARAM_INT);
      $sql_update_cps->bindParam(':ProveedorId', $ProveedoresId, PDO::PARAM_INT);
      $sql_update_cps->bindParam(':motivo_cancelacion', $motivo_cancelacion, PDO::PARAM_STR);
      $sql_update_cps->execute();

      /*
        ======================================================
        3. cmx_pedido_proveedor_estado
        ======================================================
      */
      $sql_update_ppe = $this->_db3->prepare("
            UPDATE cmx_pedido_proveedor_estado
            SET estado_visualizar = 1,
                estado_proceso_pedido = 'Rechazado'
            WHERE recurso_id = :RecursoId AND proveedor_id= :ProveedorId
        ");
      $sql_update_ppe->bindParam(':RecursoId', $RecursoId, PDO::PARAM_INT);
      $sql_update_cps->bindParam(':ProveedorId', $ProveedoresId, PDO::PARAM_INT);
      $sql_update_ppe->execute();

      /*
        ======================================================
        4. cmx_estado_historico_recurso
        ======================================================
      */
      $sql_update_ehr = $this->_db3->prepare("
            UPDATE cmx_estado_historico_recurso
            SET estado_actual = 1,
                estado_recurso = 'Rechazado'
            WHERE recurso_id = :RecursoId
              AND estado_actual = 1
        ");
      $sql_update_ehr->bindParam(':RecursoId', $RecursoId, PDO::PARAM_INT);
      $sql_update_ehr->execute();

      /*
        ======================================================
        5. cmx_estado_servicio_proveedor
        ======================================================
      */
      $sql_update_esp = $this->_db3->prepare("
            UPDATE cmx_estado_servicio_proveedor
            SET estado_recurso = 'Rechazado'
            WHERE recurso_id = :RecursoId
              AND estado_actual = 1
        ");

      // $sql_update_esp = $this->_db3->prepare("
      //       UPDATE cmx_estado_servicio_proveedor
      //       SET estado_actual = 1,
      //           estado_recurso = 'Rechazado'
      //       WHERE recurso_id = :RecursoId
      //         AND estado_actual = 1
      //   ");

      $sql_update_esp->bindParam(':RecursoId', $RecursoId, PDO::PARAM_INT);
      $sql_update_esp->execute();

      /*
        ======================================================
        6. cmx_pedido_torre_control
        ======================================================
      */
      // $placeholders = implode(',', array_fill(0, count($pedidoIds), '?'));
      // $sql_update_ptc = $this->_db3->prepare("
      //       UPDATE cmx_pedido_torre_control
      //       SET estado_publicaion = 'Pendiente',
      //           estado_asignacion = 'Pendiente'
      //       WHERE numdoc_solicitud IN ($placeholders)
      //   ");
      // $sql_update_ptc->execute($pedidoIds);

      $this->_db3->commit();

      return [
        'success' => true,
        'message' => 'La asignación del recurso fue cancelada correctamente.'
      ];
    } catch (Exception $e) {
      $this->_db3->rollBack();

      return [
        'success' => false,
        'message' => 'Error al cancelar la asignación del recurso: ' . $e->getMessage()
      ];
    }
  }

  public function ListarRecursosPendientes()
  {

    $ProveedorId = $_SESSION['usuario']['proveedor_id'];

    if ($ProveedorId) {
      try {
        $sql = "SELECT
          rp.maestro_id,
          CONCAT(rp.fecha, '-', rp.hora) AS fecha,
          rp.usuario,
          rp.estado,
          cl.nombre,
          cps.proceso,
          cl.id AS clienteId,

          GROUP_CONCAT(DISTINCT eht.estado_recurso ORDER BY eht.estado_recurso SEPARATOR ', ') AS estados_recurso,
          GROUP_CONCAT(DISTINCT pt.referencia_pedido ORDER BY pt.referencia_pedido SEPARATOR ', ') AS referencias_pedido,

          rp.pedido_plantilla,
          pt.modalidad,
          IFNULL(psd.fecha, '-') AS Fecha_Salida,
          cps.serivicio_id,
          cps.proveedor_id,

          -- ✅ CONTADOR REAL (NO SE DUPLICA)
          IFNULL(se.total_solicitados, 0) AS total_servicios_especiales_solicitados

      FROM cmx_recurso_pedido rp
      INNER JOIN cmx_clientes cl ON cl.id = rp.cliente_id
      INNER JOIN cmx_cliente_proveedor_servicio cps ON rp.maestro_id = cps.recurso_id
      INNER JOIN cmx_estado_historico_recurso eht ON rp.maestro_id = eht.recurso_id AND eht.estado_actual = 1
      INNER JOIN cmx_pedido_torre_control pt ON cps.pedido_id = pt.numdoc_solicitud
      INNER JOIN cmx_proveedor_torre_control ptc ON cps.proveedor_id = ptc.id
      INNER JOIN cmx_estado_servicio_proveedor esp ON cps.pedido_id = esp.pedido_id
          AND cps.serivicio_id = esp.servicio_id
          AND rp.maestro_id = esp.recurso_id
          AND ptc.id = esp.proveedor_id
          AND esp.estado_actual = 1
      LEFT JOIN cmx_trazabilidad_proceso tp ON rp.maestro_id = tp.recurso_id
      LEFT JOIN cmx_detalle_opcion_trazabilidad dot ON tp.numdoc = dot.numdoc_detalle_opcion AND dot.detalle_proceso = 107
      LEFT JOIN cmx_pedidos_solicitudes_detalles psd ON dot.numdoc_detalle_opcion = psd.num_pedido

      -- 🔥 SUBCONSULTA LIMPIA (UNA VEZ POR RECURSO)
      LEFT JOIN (
          SELECT
              DISTINCT recurso_id,
              COUNT(*) AS total_solicitados
          FROM cmx_servicio_especial_recurso_tr
          WHERE estado_servicio_especial = 'Solicitado' OR estado_servicio_especial = 'Postulado'
          GROUP BY recurso_id
      ) se ON se.recurso_id = rp.maestro_id

      WHERE
          esp.estado_servicio  = 'Rechazado'
          AND cps.proveedor_id = :Proveedor_id

      -- 👉 SI SOLO QUIERES LOS QUE TIENEN SERVICIOS ESPECIALES
      -- AND se.total_solicitados IS NOT NULL

      GROUP BY
          rp.maestro_id,
          fecha,
          rp.usuario,
          rp.estado,
          cl.nombre,
          cps.proceso,
          clienteId,
          se.total_solicitados
      ORDER BY fecha DESC";
        $stmt = $this->_db3->prepare($sql);
        $stmt->bindParam(":Proveedor_id", $ProveedorId, PDO::PARAM_INT);
        $stmt->execute();
        $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
      } catch (PDOException $e) {
        $error = $e->getMessage();
        // $this->_db3->rollBack();
      }
    } else {
      try {
        $sql = "SELECT
            rp.maestro_id,
            CONCAT(rp.fecha, '-', rp.hora) AS fecha,
            rp.usuario,
            rp.estado,
            cl.nombre,
            cps.proceso,
            cl.id AS clienteId,
  
            GROUP_CONCAT(DISTINCT eht.estado_recurso ORDER BY eht.estado_recurso SEPARATOR ', ') AS estados_recurso,
            GROUP_CONCAT(DISTINCT pt.referencia_pedido ORDER BY pt.referencia_pedido SEPARATOR ', ') AS referencias_pedido,
  
            rp.pedido_plantilla,
            pt.modalidad,
            IFNULL(psd.fecha, '-') AS Fecha_Salida,
  
            cps.serivicio_id,
            cps.proveedor_id,
  
            -- ✅ CONTADOR REAL (NO SE DUPLICA)
            IFNULL(se.total_solicitados, 0) AS total_servicios_especiales_solicitados
  
        FROM cmx_recurso_pedido rp
        INNER JOIN cmx_clientes cl 
            ON cl.id = rp.cliente_id
  
        INNER JOIN cmx_cliente_proveedor_servicio cps 
            ON rp.maestro_id = cps.recurso_id
  
        INNER JOIN cmx_estado_historico_recurso eht 
            ON rp.maestro_id = eht.recurso_id
            AND eht.estado_actual = 1
  
        INNER JOIN cmx_pedido_torre_control pt 
            ON cps.pedido_id = pt.numdoc_solicitud
  
        INNER JOIN cmx_proveedor_torre_control ptc 
            ON cps.proveedor_id = ptc.id
  
        INNER JOIN cmx_estado_servicio_proveedor esp 
            ON cps.pedido_id = esp.pedido_id
            AND cps.serivicio_id = esp.servicio_id
            AND rp.maestro_id = esp.recurso_id
            AND ptc.id = esp.proveedor_id
            AND esp.estado_actual = 1
  
        LEFT JOIN cmx_trazabilidad_proceso tp 
            ON rp.maestro_id = tp.recurso_id
  
        LEFT JOIN cmx_detalle_opcion_trazabilidad dot 
            ON tp.numdoc = dot.numdoc_detalle_opcion
            AND dot.detalle_proceso = 107
  
        LEFT JOIN cmx_pedidos_solicitudes_detalles psd 
            ON dot.numdoc_detalle_opcion = psd.num_pedido
  
        -- 🔥 SUBCONSULTA LIMPIA (UNA VEZ POR RECURSO)
        LEFT JOIN (
            SELECT
               DISTINCT recurso_id,
                COUNT(*) AS total_solicitados
            FROM cmx_servicio_especial_recurso_tr
            WHERE estado_servicio_especial = 'Solicitado' OR estado_servicio_especial = 'Postulado'
            -- WHERE estado_servicio_especial = 'Rechazado'
            GROUP BY recurso_id
        ) se ON se.recurso_id = rp.maestro_id
  
        WHERE
            -- esp.estado_servicio = 'Rechazado'
            esp.estado_servicio IN ('Postulado', 'Ganador')
  
        -- 👉 SI SOLO QUIERES LOS QUE TIENEN SERVICIOS ESPECIALES
        AND se.total_solicitados IS NOT NULL
  
        GROUP BY
            rp.maestro_id,
            fecha,
            rp.usuario,
            rp.estado,
            cl.nombre,
            cps.proceso,
            clienteId,
            se.total_solicitados
          ORDER BY fecha DESC";
        $stmt = $this->_db3->prepare($sql);
        $stmt->execute();
        $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
      } catch (PDOException $e) {
        $error = $e->getMessage();
        // $this->_db3->rollBack();
      }
    }

    return $response;
  }

  public function RetornarRecursoRechazado($maestroId, $Proveedor_Id)
  {
    $this->_db3->beginTransaction();

    try {

      /*
        ======================================================
        1. cmx_estado_historico_recurso  ✅ NUEVO
        ======================================================
      */

      $sqlUpdate = "
            UPDATE cmx_estado_historico_recurso
            SET estado_actual = 0
            WHERE proveedor_id = ?
              AND recurso_id   = ?
              AND estado_actual = 1
        ";
      $this->_db3->prepare($sqlUpdate)
        ->execute([$Proveedor_Id, $maestroId]);

      $sqlInsert = "
            INSERT INTO cmx_estado_historico_recurso (
                recurso_id,
                proveedor_id,
                estado_recurso,
                estado_actual,
                usuario,
                fecha,
                hora,
                empresa_id
            )
            SELECT
                recurso_id,
                proveedor_id,
                'Iniciado',
                1,
                usuario,
                CURDATE(),
                CURTIME(),
                empresa_id
            FROM cmx_estado_historico_recurso
            WHERE proveedor_id = ?
              AND recurso_id   = ?
            ORDER BY fecha DESC, hora DESC
            LIMIT 1
        ";
      $this->_db3->prepare($sqlInsert)
        ->execute([$Proveedor_Id, $maestroId]);

      // 1️⃣ Cerrar estado actual del servicio
      $sqlUpdateESP = "
            UPDATE cmx_estado_servicio_proveedor
            SET estado_actual = 0
            WHERE proveedor_id = ?
              AND recurso_id   = ?
              AND estado_actual = 1
        ";
      $this->_db3->prepare($sqlUpdateESP)
        ->execute([$Proveedor_Id, $maestroId]);

      // 2️⃣ Insertar nuevo estado (retorno)
      $sqlInsertESP = "
            INSERT INTO cmx_estado_servicio_proveedor (
                pedido_id,
                servicio_id,
                proveedor_id,
                recurso_id,
                estado_servicio,
                estado_actual,
                usuario,
                fecha,
                hora,
                empresa_id
            )
            SELECT
                pedido_id,
                servicio_id,
                proveedor_id,
                recurso_id,
                'Pendiente Iniciar',
                1,
                usuario,
                CURDATE(),
                CURTIME(),
                empresa_id
            FROM cmx_estado_servicio_proveedor
            WHERE proveedor_id = ?
              AND recurso_id   = ?
            ORDER BY fecha DESC, hora DESC
            LIMIT 1
        ";
      $this->_db3->prepare($sqlInsertESP)
        ->execute([$Proveedor_Id, $maestroId]);

      $this->_db3->commit();
      return true;
    } catch (Exception $e) {
      $this->_db3->rollBack();
      throw $e;
    }
  }
}
