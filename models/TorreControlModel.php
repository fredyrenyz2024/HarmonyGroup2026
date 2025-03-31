<?php

session_start();

class TorreControlModel extends Model
{

  public function __construct()
  {

    parent::__construct();
  }

  public function importar_pedidos_masivos($rows)
  {
    try {
      $fecha = date('Y-m-d');
      $hora = date('G:i:s');
      $session_empresa_id = $_SESSION['usuario']['empresa_id'];

      // Iniciamos una transacción
      $this->_db3->beginTransaction();

      // Preparamos la consulta de inserción
      $sql_insert = "INSERT INTO cmx_pedido_torre_control 
          	(modalidad,cliente, numdoc_solicitud, referencia_pedido, ciudad_origen, remitente, ciudad_destino, destinatario, cod_producto, producto, peso_neto_kg, peso_bruto_kg, presentacion, unidades, lote, num_estibas, fecha_cargue, fecha_entrega, usuario, fecha, hora)
          VALUES (:modalidad, :cliente, :numdoc_solicitud, :referencia_pedido, :ciudad_origen, :remitente, :ciudad_destino, :destinatario, :cod_producto, :producto, :peso_neto_kg, :peso_bruto_kg, :presentacion, :unidades, :lote, :num_estibas, :fecha_cargue, :fecha_entrega, :usuario, :fecha, :hora)";
      $stmt_insert = $this->_db3->prepare($sql_insert);

      foreach ($rows as $row) {
        // 1. Obtener el número actual de `cmx_maestro`
        $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='PEDIDOS_TORRE_CONTROL' AND numero_actual>numero_inicial AND empresa_id=:empresa_id FOR UPDATE");
        $sql_consecutivo->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
        $sql_consecutivo->execute();
        $resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);

        if (!$resultado_consecutivo) {
          throw new Exception("No se encontró un número de pedido válido.");
        }

        $numdoc_cabecera = $resultado_consecutivo['numero_actual'];
        $numdoc_actualizar_cabecera = $numdoc_cabecera + 1;

        // 2. Actualizar `numero_actual` en `cmx_maestro`
        $sql_update_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=:numdoc_actualizar_cabecera WHERE tipo='PEDIDOS_TORRE_CONTROL' AND empresa_id=:empresa_id");
        $sql_update_maestro->bindParam(':numdoc_actualizar_cabecera', $numdoc_actualizar_cabecera, PDO::PARAM_INT);
        $sql_update_maestro->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
        $sql_update_maestro->execute();

        // 3. Insertar el pedido con el número de documento actualizado
        $stmt_insert->execute([
          ":modalidad"  => $row["Modalidad"] ?? "",
          ":cliente"          => $row["cliente"] ?? $_SESSION['usuario']['id_cliente'],
          ":numdoc_solicitud" => $numdoc_cabecera,
          ":referencia_pedido" => $row["Pedido"] ?? "",
          ":ciudad_origen"  => $row["Ciudad Origen"] ?? "",
          ":remitente"   => $row["Remitente"] ?? "",
          ":ciudad_destino" => $row["Ciudad Destino"] ?? "",
          ":destinatario" => $row["Destinatario"] ?? "",
          ":cod_producto"   => $row["Codigo Producto"] ?? "",
          ":producto"     => $row["Producto"] ?? "",
          ":peso_neto_kg"      => $row["Kg Neto"] ?? "",
          ":peso_bruto_kg"     => $row["Kg Bruto"] ?? "",
          ":presentacion"  => $row["Presentacion"] ?? "",
          ":unidades"       => $row["Unidades"] ?? "",
          ":lote"       => $row["Lote"] ?? "",
          ":num_estibas"         => $row["Nro.Estibas"] ?? "",
          ":fecha_cargue"  => $row["Fecha Cargue"] ?? "",
          ":fecha_entrega"  => $row["Fecha Entrega"] ?? "",
          ":usuario"        => $row["usuario"] ?? $_SESSION["usuario"]["nom_usuario"],
          ":fecha"          => $fecha,
          ":hora"           => $hora
        ]);
      }

      // Confirmamos la transacción
      $this->_db3->commit();
      return ["status" => true, "message" => "Pedidos importados correctamente."];
    } catch (PDOException $e) {
      // Si hay un error, revertimos la transacción
      $this->_db3->rollBack();
      return ["status" => false, "message" => "Error al importar pedidos: " . $e->getMessage()];
    } catch (Exception $e) {
      $this->_db3->rollBack();
      return ["status" => false, "message" => $e->getMessage()];
    }
  }

  public function Listar_pedidos_administrador($fecha_inicial, $fecha_final, $ventana, $proveedor_id, $estado, $cliente_id)
  {
    switch ($ventana) {
      case '22':
      case '23':
      case '24':
      case '25':
      case '26':
        $sql = "SELECT DISTINCT pt.numdoc_solicitud,pt.id, pt.referencia_pedido ,pt.cliente, pt.ciudad_origen, pt.remitente, 
               pt.ciudad_destino, pt.destinatario, pt.cod_producto, pt.producto,pt.peso_neto_kg, pt.peso_bruto_kg, pt.presentacion, 
               pt.unidades, pt.lote, pt.num_estibas, pt.fecha_cargue, pt.fecha_entrega, pt.estado_publicaion, pt.estado_asignacion, 
               pt.usuario, pt.fecha, pt.hora, cl.nombre AS 'nombre_cliente', pt.estado_prioridad, pt.referencia_pedido,ppes.estado_proceso_pedido
        FROM cmx_pedido_torre_control pt
        INNER JOIN cmx_clientes cl ON pt.cliente=cl.id
        INNER JOIN cmx_cliente_proveedor_servicio cps ON pt.numdoc_solicitud=cps.pedido_id
        INNER JOIN cmx_proveedor_torre_control ptc ON cps.proveedor_id=ptc.id
        LEFT JOIN cmx_pedido_proveedor_estado ppes ON pt.numdoc_solicitud=ppes.pedido_id AND ppes.estado_visualizar = 1
        ";

        if ($estado === 'Pendientes' || $estado === 'En_Curso' || $estado === 'Completadas') {
          $sql .= " LEFT JOIN cmx_estados_pedidos_tr ept ON pt.numdoc_solicitud = ept.pedido_id AND ptc.id=ept.proveedor_id";
        }

        // Iniciar condiciones WHERE
        $where = [];
        $bindParams = [];

        // Estado "Prioritaria" (NO filtra por fecha)
        if ($estado === 'Prioritaria') {
          $where[] = "pt.estado_prioridad = 'Prioritaria'";
          $where[] = "ppes.proveedor_id = :Proveedor_id";
          $bindParams[":Proveedor_id"] = $proveedor_id;
        } elseif ($estado === 'Pendientes') {
          $where[] = "ppes.estado_proceso_pedido = 'Pendiente Iniciar'";
          $where[] = "ppes.estado_visualizar = 1";
          $where[] = "ppes.proveedor_id = :Proveedor_id";
          $bindParams[":Proveedor_id"] = $proveedor_id;
        } elseif ($estado === 'En_Curso') {
          $where[] = "ppes.estado_proceso_pedido = 'Iniciado'";
          $where[] = "ppes.estado_visualizar = 1";
          $where[] = "ppes.proveedor_id = :Proveedor_id";
          $bindParams[":Proveedor_id"] = $proveedor_id;
        } elseif ($estado === 'Completadas') {
          $where[] = "ppes.estado_proceso_pedido = 'Completado'";
          $where[] = "ppes.estado_visualizar = 1";
          $where[] = "ppes.proveedor_id = :Proveedor_id";
          $where[] = "pt.estado_asignacion = 'Ganador'";
          $bindParams[":Proveedor_id"] = $proveedor_id;
        } elseif ($estado === 'Todos') {
          $where[] = "ppes.proveedor_id = :Proveedor_id";
          $bindParams[":Proveedor_id"] = $proveedor_id;
          $where[] = "ppes.estado_visualizar = 1";
        }

        // Agregar WHERE si hay condiciones
        if (!empty($where)) {
          $sql .= " WHERE " . implode(" AND ", $where);
        }


        // Agregar GROUP BY fuera del WHERE
        if ($estado === 'En_Curso' || $estado === 'Completadas') {
          $sql .= " GROUP BY pt.numdoc_solicitud";
        } else if ($estado === 'Todos') {
          $sql .= " GROUP BY pt.numdoc_solicitud";
        }

        // Preparar consulta
        $stmt = $this->_db3->prepare($sql);

        // Enlazar parámetros
        foreach ($bindParams as $param => $value) {
          $stmt->bindValue($param, $value);
        }

        // Ejecutar y obtener resultados
        $stmt->execute();
        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);

        break;

      case '27':
        // Iniciar la consulta como string, no como objeto PDOStatement
        $sql = "SELECT DISTINCT pt.numdoc_solicitud,pt.id, pt.referencia_pedido ,pt.cliente, pt.ciudad_origen, pt.remitente, 
               pt.ciudad_destino, pt.destinatario, pt.cod_producto, pt.producto,pt.peso_neto_kg, pt.peso_bruto_kg, pt.presentacion, 
               pt.unidades, pt.lote, pt.num_estibas, pt.fecha_cargue, pt.fecha_entrega, pt.estado_publicaion, pt.estado_asignacion, 
               pt.usuario, pt.fecha, pt.hora, cl.nombre AS 'nombre_cliente', pt.estado_prioridad, pt.referencia_pedido
        FROM cmx_pedido_torre_control pt
        INNER JOIN cmx_clientes cl ON pt.cliente=cl.id
        ";

        if ($estado === 'Pendientes' || $estado === 'En_Curso' || $estado === 'Completadas') {
          $sql .= " LEFT JOIN cmx_estados_pedidos_tr ept ON pt.numdoc_solicitud = ept.pedido_id AND ptc.id=ept.proveedor_id";
        }

        // Iniciar condiciones WHERE
        $where = [];
        $bindParams = [];

        // Estado "Prioritaria" (NO filtra por fecha)
        if ($estado === 'Prioritaria') {
          $where[] = "pt.estado_prioridad = 'Prioritaria'";
          $where[] = "cl.id= :Cliente_id";
          $bindParams[":Cliente_id"] = $cliente_id;
        } elseif ($estado === 'Pendientes') {
          $where[] = "cl.id= :Cliente_id";
          $bindParams[":Cliente_id"] = $cliente_id;
        } elseif ($estado === 'En_Curso') {
          $where[] = "cl.id= :Cliente_id";
          $bindParams[":Cliente_id"] = $cliente_id;
        } elseif ($estado === 'Completadas') {
          $where[] = "cl.id= :Cliente_id";
          $where[] = "pt.estado_asignacion = 'Ganador'";
          $bindParams[":Cliente_id"] = $cliente_id;
        } elseif ($estado === 'Todos') {
          $where[] = "cl.id= :Cliente_id";
          $bindParams[":Cliente_id"] = $cliente_id;
        }

        // Agregar WHERE si hay condiciones
        if (!empty($where)) {
          $sql .= " WHERE " . implode(" AND ", $where);
        }

        // Agregar GROUP BY fuera del WHERE
        if ($estado === 'En_Curso' || $estado === 'Completadas') {
          $sql .= " GROUP BY pt.numdoc_solicitud";
        } else if ($estado === 'Todos') {
          $sql .= " GROUP BY pt.numdoc_solicitud";
        }

        // Preparar consulta
        $stmt = $this->_db3->prepare($sql);

        // Enlazar parámetros
        foreach ($bindParams as $param => $value) {
          $stmt->bindValue($param, $value);
        }

        // Ejecutar y obtener resultados
        $stmt->execute();
        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
        break;

      default:
        // Base de la consulta
        $sql = "SELECT  pt.id, pt.numdoc_solicitud, pt.referencia_pedido ,pt.cliente, pt.ciudad_origen, pt.remitente, 
               pt.ciudad_destino, pt.destinatario, pt.cod_producto, pt.producto,pt.peso_neto_kg, pt.peso_bruto_kg, pt.presentacion, 
               pt.unidades, pt.lote, pt.num_estibas, pt.fecha_cargue, pt.fecha_entrega, pt.estado_publicaion, pt.estado_asignacion, 
               pt.usuario, pt.fecha, pt.hora, cl.nombre AS 'nombre_cliente', pt.estado_prioridad, pt.referencia_pedido
        FROM cmx_pedido_torre_control pt
        INNER JOIN cmx_clientes cl ON pt.cliente = cl.id";

        // Si el estado es "Pendientes", agregamos el LEFT JOIN antes del WHERE
        if ($estado === 'Pendientes' || $estado === 'En_Curso') {
          $sql .= " LEFT JOIN cmx_cliente_proveedor_servicio cps ON pt.numdoc_solicitud = cps.pedido_id";
        } else if ($estado === 'Completadas') {
          $sql .= " INNER JOIN cmx_cliente_proveedor_servicio cps ON pt.numdoc_solicitud = cps.pedido_id";
        }

        // Iniciar la cláusula WHERE
        $where = [];
        $bindParams = [];

        // Si el estado es "Prioritaria", solo filtramos por estado_prioridad y NO usamos fechas
        if ($estado === 'Prioritaria') {
          $where[] = "pt.estado_prioridad = 'Prioritaria'";
        } else {
          // Si el estado es "Pendientes", excluimos prioritarias y filtramos por NULL en el LEFT JOIN
          if ($estado === 'Pendientes') {
            // $where[] = "pt.estado_prioridad <> 'Prioritaria'";
            $where[] = "cps.pedido_id IS NULL";
          } else {
            if ($estado === 'En_Curso') {
              $where[] = "cps.pedido_id IS NOT NULL GROUP BY pt.numdoc_solicitud";
            } else {
              if ($estado === 'Completadas') {
                $where[] = "pt.estado_asignacion= 'Ganador' GROUP BY pt.numdoc_solicitud";
              } else {
                // Para otros estados, filtramos por fecha
                $where[] = "pt.fecha BETWEEN :fecha_inicial AND :fecha_final";
                $bindParams[":fecha_inicial"] = $fecha_inicial;
                $bindParams[":fecha_final"] = $fecha_final;
              }
            }
          }
        }

        // Agregar las condiciones WHERE si existen
        if (!empty($where)) {
          $sql .= " WHERE " . implode(" AND ", $where);
        }

        // Preparar la consulta
        $stmt = $this->_db3->prepare($sql);

        // Enlazar parámetros dinámicamente
        foreach ($bindParams as $param => $value) {
          $stmt->bindValue($param, $value);
        }

        // Ejecutar consulta
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

  public function insertar_asignacion_proveedor($solicitudes, $asignaciones, $ClienteId)
  {
    try {
      $this->_db3->beginTransaction(); // Iniciar transacción para evitar inserciones incompletas

      // Obtener usuario y empresa desde la sesión
      $nom_usuario = $_SESSION['usuario']['nom_usuario'] ?? null;
      $session_empresa_id = $_SESSION['usuario']['empresa_id'];

      // Contador de inserciones exitosas
      $totalInsertados = 0;

      /* Insetar en la tabla de recursos para saber cual es el recurso que se ejecuta */

      // 1. Obtener el número actual de `cmx_maestro`
      $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='PEDIDO_RECURSO' AND numero_actual>numero_inicial AND empresa_id=:empresa_id FOR UPDATE");
      $sql_consecutivo->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
      $sql_consecutivo->execute();
      $resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);

      if (!$resultado_consecutivo) {
        throw new Exception("No se encontró un número de pedido válido.");
      }

      $numdoc_cabecera = $resultado_consecutivo['numero_actual'];
      $numdoc_actualizar_cabecera = $numdoc_cabecera + 1;

      // 2. Actualizar `numero_actual` en `cmx_maestro`
      $sql_update_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=:numdoc_actualizar_cabecera WHERE tipo='PEDIDO_RECURSO' AND empresa_id=:empresa_id");
      $sql_update_maestro->bindParam(':numdoc_actualizar_cabecera', $numdoc_actualizar_cabecera, PDO::PARAM_INT);
      $sql_update_maestro->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
      $sql_update_maestro->execute();

      if (!$sql_update_maestro) {
        throw new Exception("No se encontró un número de pedido válido.");
      }

      $estado_recurso = "Activo";
      /* Insertar en la tabla de recursos */
      $sql_insert_recirso = $this->_db3->prepare("INSERT INTO cmx_recurso_pedido (maestro_id,cliente_id,fecha,hora,usuario,estado,empresa_id) VALUES (:maestro_id,:cliente_id,CURDATE(),CURTIME(),:usuario,:estado,:empresa_id)");
      $sql_insert_recirso->bindParam(':maestro_id', $numdoc_cabecera, PDO::PARAM_INT);
      $sql_insert_recirso->bindParam(':cliente_id', $ClienteId, PDO::PARAM_INT);
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
                    VALUES (:pedido_id, :proveedor_id, :serivicio_id, :fecha_vencimiento, :hora_vencimiento, 'Activo', 'Asignación', :tipo_vehiculo, :recurso_id ,:usuario, CURDATE(), CURTIME(), :empresa_id)";

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
            throw new Exception("Error al insertar la asignación para el proveedor {$asignacion['proveedor_id']}");
          }

          $totalInsertados++;
        }
      }

      // Si no se insertó ninguna fila, lanzar error
      if ($totalInsertados === 0) {
        throw new Exception("No se insertó ninguna asignación.");
      }

      // Actualizar el estado solo si hubo inserciones exitosas
      foreach ($solicitudes as $key => $solicitud) {
        $sql_update = $this->_db3->prepare("UPDATE cmx_pedido_torre_control SET estado_publicaion='Publicado', estado_asignacion='Asignado' WHERE numdoc_solicitud=:numdoc_solicitud");
        $sql_update->execute([':numdoc_solicitud' => $solicitud['id']]);
      }

      // Verificar si el `UPDATE` afectó filas
      if ($sql_update->rowCount() === 0) {
        throw new Exception("Error al actualizar el estado de asignación para el pedido.");
      }

      /* Insertar el estado de pedido por proveedor */
      $sql_insert_estado_proveedor = $this->_db3->prepare("INSERT INTO cmx_pedido_proveedor_estado (pedido_id,proveedor_id,recurso_id,estado_proceso_pedido,estado_visualizar,usuario ,fecha,hora,empresa_id)
      VALUES (:pedido_id,:proveedor_id,:recurso_id,:estado_proceso_pedido,:estado_visualizar,:usuario,CURDATE(),CURTIME(),:empresa_id)");

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
      $fecha = date("Y-m-d");
      $hora = date("H:i:s");

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

      /* Ejecutar la consulta con todos los parámetros */
      if (!$sql_insert_estado_recurso->execute($parametros)) {
        throw new Exception("Error al insertar los estados del recurso por proveedor.");
      }


      /* Insertar en la tabla de estados de los servicios para controlarlos por proveedor */
      $sql_insert_estado_servicio_proveedor = $this->_db3->prepare("INSERT INTO cmx_estado_servicio_proveedor (pedido_id,servicio_id,proveedor_id,recurso_id,estado_servicio,estado_actual,usuario,fecha,hora,empresa_id)
      VALUES(:pedido_id,:servicio_id,:proveedor_id,:recurso_id,:estado_servicio,:estado_actual,:usuario,CURDATE(),CURTIME(),:empresa_id)");

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

      $this->_db3->commit(); // Confirmar la transacción
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
              INNER JOIN cmx_cliente_proveedor_torre_control pc ON ptc.id = pc.proveedor_id
              INNER JOIN cmx_servicio_proveedor_torre_control sp ON pc.proveedor_id = sp.proveedor_id 
              WHERE pc.cliente_id = ? AND sp.servicio_id = ?";
      $stmt = $this->_db3->prepare($sql);
      $stmt->execute([$clienId, $ServicioId]);
      return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
      return ['status' => false, 'message' => 'Error: ' . $e->getMessage()];
    }
  }

  public function publicar_pedido_proveedor($seleccionados, $solicitudes, $Proveedoresseleccionados, $proceso, $ClienteId)
  {
    try {
      $this->_db3->beginTransaction(); // Iniciar la transacción

      // Obtener usuario y empresa desde la sesión
      $nom_usuario = $_SESSION['usuario']['nom_usuario'] ?? null;
      $session_empresa_id = $_SESSION['usuario']['empresa_id'] ?? null;

      if (!$nom_usuario || !$session_empresa_id) {
        throw new Exception("Usuario o empresa no definidos en la sesión.");
      }

      // Contador de inserciones exitosas
      $totalInsertados = 0;

      /* Insetar en la tabla de recursos para saber cual es el recurso que se ejecuta */

      // 1. Obtener el número actual de `cmx_maestro`
      $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='PEDIDO_RECURSO' AND numero_actual>numero_inicial AND empresa_id=:empresa_id FOR UPDATE");
      $sql_consecutivo->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
      $sql_consecutivo->execute();
      $resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);

      if (!$resultado_consecutivo) {
        throw new Exception("No se encontró un número de pedido válido.");
      }

      $numdoc_cabecera = $resultado_consecutivo['numero_actual'];
      $numdoc_actualizar_cabecera = $numdoc_cabecera + 1;

      // 2. Actualizar `numero_actual` en `cmx_maestro`
      $sql_update_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=:numdoc_actualizar_cabecera WHERE tipo='PEDIDO_RECURSO' AND empresa_id=:empresa_id");
      $sql_update_maestro->bindParam(':numdoc_actualizar_cabecera', $numdoc_actualizar_cabecera, PDO::PARAM_INT);
      $sql_update_maestro->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
      $sql_update_maestro->execute();

      if (!$sql_update_maestro) {
        throw new Exception("No se encontró un número de pedido válido.");
      }
      $estado_recurso = "Activo";

      /* Insertar en la tabla de recursos */
      $sql_insert_recirso = $this->_db3->prepare("INSERT INTO cmx_recurso_pedido (maestro_id,cliente_id,fecha,hora,usuario,estado,empresa_id) VALUES (:maestro_id,:cliente_id,CURDATE(),CURTIME(),:usuario,:estado,:empresa_id)");
      $sql_insert_recirso->bindParam(':maestro_id', $numdoc_cabecera, PDO::PARAM_INT);
      $sql_insert_recirso->bindParam(':cliente_id', $ClienteId, PDO::PARAM_INT);
      $sql_insert_recirso->bindParam(':usuario', $nom_usuario, PDO::PARAM_STR);
      $sql_insert_recirso->bindParam(':estado', $estado_recurso, PDO::PARAM_STR);
      $sql_insert_recirso->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
      $sql_insert_recirso->execute();

      if (!$sql_insert_recirso) {
        throw new Exception("No se pudo insertar el recurso.");
      }

      // Preparar la consulta de inserción
      $sql_insert = $this->_db3->prepare("INSERT INTO cmx_cliente_proveedor_servicio (pedido_id, proveedor_id, serivicio_id, fecha_vencimiento, hora_vencimiento, estado_pedido_asignado, proceso, tipo_vehiculo, recurso_id, usuario, fecha, hora, empresa_id) 
            VALUES (:pedido_id, :proveedor_id, :serivicio_id, :fecha_vencimiento, :hora_vencimiento, 'Activo', 'Publicación', :tipo_vehiculo, :recurso_id, :usuario, CURDATE(), CURTIME(), :empresa_id)");

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
        throw new Exception("No se insertó ninguna asignación.");
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
      VALUES (:pedido_id,:proveedor_id,:recurso_id,:estado_proceso_pedido,:estado_visualizar,:usuario,CURDATE(),CURTIME(),:empresa_id)");

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
      VALUES (:recurso_id,:proveedor_id,:estado_recurso,:estado_actual,:usuario,CURDATE(),CURTIME(),:empresa_id)");

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
            VALUES(:pedido_id,:servicio_id,:proveedor_id,:recurso_id,:estado_servicio,:estado_actual,:usuario,CURDATE(),CURTIME(),:empresa_id)");

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
              ':pedido_id' =>  $numdocSolicitud,
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

      $this->_db3->commit(); // Confirmar la transacción
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
                st.tipo_servicio, cps.fecha_actualizacion, cps.hora_actualizacion
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
      // Obtener usuario y empresa desde la sesión
      $nom_usuario = $_SESSION['usuario']['nom_usuario'] ?? null;
      $session_empresa_id = $_SESSION['usuario']['empresa_id'] ?? null;

      // Verificar que los datos requeridos estén presentes
      if (!$nom_usuario || !$session_empresa_id) {
        return ['status' => false, 'message' => 'Error: Sesión no válida.'];
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

      // Ejecutar la consulta de inserción
      if ($sqlInsert->execute()) {
        return ['status' => true, 'message' => 'Gestión iniciada correctamente.'];
      } else {
        return ['status' => false, 'message' => 'Error al iniciar la gestión.'];
      }
    } catch (PDOException $e) {
      return ['status' => false, 'message' => 'Error en la base de datos: ' . $e->getMessage()];
    }
  }

  public function Insertar_postulacion($datos)
  {
    try {

      // Obtener usuario y empresa desde la sesión
      $nom_usuario = $_SESSION['usuario']['nom_usuario'] ?? null;
      $session_empresa_id = $_SESSION['usuario']['empresa_id'] ?? null;

      // Iniciar la transacción
      $this->_db3->beginTransaction();

      // Actualizar el servicio

      foreach ($datos['PedidosId'] as $key => $value) {
        $sql = $this->_db3->prepare("UPDATE cmx_cliente_proveedor_servicio SET valor_servicio = :valor_servicio, referencia = :referencia,  fecha_inicio = :fecha_inicio, 
      hora_inicio = :hora_inicio, fecha_actualizacion = CURDATE(), hora_actualizacion = CURTIME()
      WHERE pedido_id =:pedido_id AND proveedor_id = :proveedor_id  AND serivicio_id = :servicio_id AND recurso_id=:recurso_id");
        $sql->bindParam(':pedido_id', $value, PDO::PARAM_INT);
        $sql->bindParam(':proveedor_id', $datos['proveedorId'], PDO::PARAM_INT);
        $sql->bindParam(':servicio_id', $datos['servicioId'], PDO::PARAM_INT);
        $sql->bindParam(':recurso_id', $datos['RecursoId'], PDO::PARAM_INT);
        $sql->bindParam(':valor_servicio', $datos['costo_servicio'], PDO::PARAM_STR);
        $sql->bindParam(':referencia', $datos['placa'], PDO::PARAM_STR);
        $sql->bindParam(':fecha_inicio', $datos['fecha_inicio'], PDO::PARAM_STR);
        $sql->bindParam(':hora_inicio', $datos['hora_inicio'], PDO::PARAM_STR);
        $sql->execute();
      }

      if (!$sql) {
        throw new Exception('Error al actualizar cmx_cliente_proveedor_servicio.');
      }

      // Validar el proceso para la postulación y cambio de estados
      // if ($datos['Proceso'] == "Publicación") {
      //   $sql_update = $this->_db3->prepare("UPDATE cmx_pedido_torre_control SET estado_publicaion = 'Pendiente Respuesta' WHERE numdoc_solicitud = :pedido_id");
      // } else if ($datos['Proceso'] == "Asignación") {
      //   $sql_update = $this->_db3->prepare("UPDATE cmx_pedido_torre_control SET estado_asignacion = 'Ganador' WHERE numdoc_solicitud = :pedido_id");
      // }

      // if (isset($sql_update)) {
      //   $sql_update->bindParam(':pedido_id', $datos['pedidoId'], PDO::PARAM_INT);
      //   if (!$sql_update->execute()) {
      //     throw new Exception('Error al actualizar cmx_pedido_torre_control.');
      //   }
      // }

      /* Actuliazar los estados de los servios de la postulación */
      // Si existe, actualizar estado_previsualizar a 0 con los mismos 3 campos en el WHERE
      // $sqlUpdateEstado = $this->_db3->prepare("UPDATE cmx_estados_pedidos_tr 
      //  SET estado_previsualizar = 0 
      //  WHERE pedido_id = :pedido_id AND proveedor_id = :proveedor_id AND servicio_id = :servicio_id");
      // $sqlUpdateEstado->bindParam(':pedido_id', $datos['pedidoId'], PDO::PARAM_INT);
      // $sqlUpdateEstado->bindParam(':proveedor_id', $datos['proveedorId'], PDO::PARAM_INT);
      // $sqlUpdateEstado->bindParam(':servicio_id', $datos['servicioId'], PDO::PARAM_INT);
      // $sqlUpdateEstado->execute();

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
        // $sqlInsert = $this->_db3->prepare("INSERT INTO cmx_estados_pedidos_tr (pedido_id, proveedor_id, servicio_id, estado_pedido, estado_previsualizar, usuario, fecha, hora, empresa_id) 
        // VALUES (:pedido_id, :proveedor_id, :servicio_id, :estado_pedido, :estado_previsualizar, :usuario, :fecha, :hora, :empresa_id)");

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

      // Confirmar la transacción si todo sale bien
      $this->_db3->commit();

      return [
        'status' => true,
        'message' => 'Postulación realizada correctamente.',
        'pedidoId' => $datos['PedidosId'],
        'proceso' => $datos['Proceso']
      ];
    } catch (Exception $e) {
      // Revertir la transacción en caso de error
      $this->_db3->rollback();

      // Registrar el error en logs
      error_log("Error en Insertar_postulacion: " . $e->getMessage());

      return [
        'status' => false,
        'message' => 'Error al realizar la postulación.',
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
      // Obtener usuario y empresa desde la sesión
      $nom_usuario = $_SESSION['usuario']['nom_usuario'] ?? null;
      $session_empresa_id = $_SESSION['usuario']['empresa_id'] ?? null;
      $PorveedorId = $_SESSION['usuario']['proveedor_id'] ?? null;
      $fecha = date('Y-m-d');
      $hora = date('H:i:s');

      // Iniciar transacción
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

      // Confirmar la transacción
      $this->_db3->commit();

      return [
        'status' => true,
        'message' => 'Pedido iniciado correctamente.'
      ];
    } catch (Exception $e) {
      // Revertir la transacción en caso de error
      $this->_db3->rollBack();

      return [
        'status' => false,
        'message' => $e->getMessage()
      ];
    }
  }

  public function Subastar_pedido($solicitudes, $proceso, $MaestroId, $ClienteId, $ReferenciaPedidos, $Criterio)
  {
    $resultados = [];
    $datosProcesados = [];
    $session_empresa_id = $_SESSION['usuario']['empresa_id'] ?? null;
    $fecha = date('Y-m-d');
    $hora = date('H:i:s');
    $empresa_id = $_SESSION['usuario']['empresa_id'];
    try {
      $this->_db3->beginTransaction();

      if ($proceso == "Asignación") {
        $estado_subasta = "Ganador";
        $estado_pedido = "Completado";
        $estado_pedido_visualizar = 1;

        // 1. Obtener el número actual de `cmx_maestro`
        $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='SUBASTA_TR' AND numero_actual>numero_inicial AND empresa_id=:empresa_id FOR UPDATE");
        $sql_consecutivo->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
        $sql_consecutivo->execute();
        $resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);

        if (!$resultado_consecutivo) {
          throw new Exception("No se encontró un número de subasta válido.");
        }

        $numdoc_cabecera = $resultado_consecutivo['numero_actual'];
        $numdoc_actualizar_cabecera = $numdoc_cabecera + 1;

        // 2. Actualizar `numero_actual` en `cmx_maestro`
        $sql_update_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=:numdoc_actualizar_cabecera WHERE tipo='SUBASTA_TR' AND empresa_id=:empresa_id");
        $sql_update_maestro->bindParam(':numdoc_actualizar_cabecera', $numdoc_actualizar_cabecera, PDO::PARAM_INT);
        $sql_update_maestro->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
        $sql_update_maestro->execute();

        if (!$sql_update_maestro) {
          throw new Exception("No se actualizó un número de subasta válido.");
        }

        $sql_insert = $this->_db3->prepare("INSERT INTO cmx_subasta_torre_control (subasta_id,recurso_id,estado_subasta,usuario,fecha,hora,empresa_id)
        VALUES (:subasta_id,:recurso_id,:estado_subasta,:usuario,CURDATE(),CURTIME(),:empresa_id)");
        $sql_insert->bindParam(':subasta_id', $numdoc_cabecera, PDO::PARAM_INT);
        $sql_insert->bindParam(':recurso_id', $MaestroId, PDO::PARAM_INT);
        $sql_insert->bindParam(':estado_subasta', $estado_subasta, PDO::PARAM_STR);
        $sql_insert->bindParam(':usuario', $_SESSION["usuario"]["nom_usuario"], PDO::PARAM_STR);
        $sql_insert->bindParam(':empresa_id', $_SESSION["usuario"]["empresa_id"], PDO::PARAM_INT);
        $sql_insert->execute();

        // Preparar la consulta de inserción
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
          $fecha = "{$partes[0]}-{$partes[1]}-{$partes[2]}"; // Año-Mes-Día
          $hora = $partes[3]; // Hora
          $partes_actualizacion = explode('-', $solicitud['fecha_actualizacion'], 4); // Dividir solo en 4 partes
          $fecha_actualizacion = "{$partes_actualizacion[0]}-{$partes_actualizacion[1]}-{$partes_actualizacion[2]}"; // Año-Mes-Día
          $hora_actualizacion = $partes_actualizacion[3]; // Hora
          $usuario = $_SESSION['usuario']['nom_usuario'];
          $fecha = date('Y-m-d');
          $hora = date('H:i:s');
          $empresa_id = $_SESSION['usuario']['empresa_id'];

          $sql_insert_result_subasta->bindParam(':pedido_id', $pedido_id, PDO::PARAM_INT);
          $sql_insert_result_subasta->bindParam(':servicio_id', $servicio_id, PDO::PARAM_INT);
          $sql_insert_result_subasta->bindParam(':proveedor_id', $proveedor_id, PDO::PARAM_INT);
          $sql_insert_result_subasta->bindParam(':subasta_id', $subasta_id, PDO::PARAM_INT);
          $sql_insert_result_subasta->bindParam(':valor_ganador', $valor_ganador, PDO::PARAM_STR);
          $sql_insert_result_subasta->bindParam(':fecha_registro', $fecha_registro, PDO::PARAM_STR);
          $sql_insert_result_subasta->bindParam(':hora_registro', $hora_registro, PDO::PARAM_STR);
          $sql_insert_result_subasta->bindParam(':estado_subasta', $estado_subasta, PDO::PARAM_STR);
          $sql_insert_result_subasta->bindParam(':fecha_inicio',  $fecha, PDO::PARAM_STR);
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

          /* Funcion para comprobar si todos los servicios asignados están completos por cada proveedor */
          $sql_validated = $this->_db3->prepare("SELECT esp.estado_servicio FROM
          cmx_recurso_pedido rp 
          INNER JOIN cmx_estado_servicio_proveedor esp ON rp.maestro_id=esp.recurso_id
          WHERE rp.maestro_id=:maestro_id AND esp.estado_actual=1");

          $sql_validated->bindParam(':maestro_id', $numdoc_cabecera, PDO::PARAM_INT);
          $sql_validated->execute();
          $validated = $sql_validated->fetchAll(PDO::FETCH_COLUMN, 0); // Extraer solo la columna "estado_servicio"

          // Verificar si todos los elementos son "Ganador"
          if (!empty($validated) && count(array_unique($validated)) === 1 && $validated[0] === "Ganador") {
            /* Actuliar el estado de los pedidos */
            $sqlUpdatePedidos = $this->_db3->prepare("UPDATE cmx_pedido_torre_control SET estado_publicaion='Completado', estado_asignacion='Completado' WHERE numdoc_solicitud = :numdoc_solicitud");
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
            VALUES (:pedido_id,:proveedor_id,:recurso_id,:estado_proceso_pedido,:estado_visualizar,:usuario,CURDATE(),CURTIME(),:empresa_id)");

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
            VALUES (:recurso_id,:proveedor_id,:estado_recurso,:estado_actual,:usuario,CURDATE(),CURTIME(),:empresa_id)");

            $sql_insert_recurso->bindParam(':recurso_id', $MaestroId, PDO::PARAM_INT);
            $sql_insert_recurso->bindParam(':proveedor_id', $proveedor_id, PDO::PARAM_INT);
            $sql_insert_recurso->bindParam(':estado_recurso', $estado_pedido, PDO::PARAM_STR);
            $sql_insert_recurso->bindParam(':estado_actual', $estado_pedido_visualizar, PDO::PARAM_INT);
            $sql_insert_recurso->bindParam(':usuario', $usuario, PDO::PARAM_STR);
            $sql_insert_recurso->bindParam(':empresa_id', $empresa_id, PDO::PARAM_INT);

            if (!$sql_insert_recurso->execute()) {
              throw new Exception('Error al insertar en cmx_estado_historico_recurso.');
            }
          } else {
            echo "No todos son 'Ganador'";
          }
        }

        /* Programcion para crear las plantillas */
        // if ($solicitudes[0]['servicio_id'] == 2) {
        //   $resultados = $this->crear_pedidos($ClienteId, $ReferenciaPedidos);
        // }
      } else if ($proceso == "Publicación") {
        /* Insertar en la cabecera de subasta */
        $estado_subasta = "Ganador";
        $estado_pedido = "Completado";
        $estado_pedido_visualizar = 1;

        if ($Criterio == 'Fecha_inicio_servicio') {
          // 1. Obtener el número actual de `cmx_maestro`
          $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='SUBASTA_TR' AND numero_actual>numero_inicial AND empresa_id=:empresa_id FOR UPDATE");
          $sql_consecutivo->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
          $sql_consecutivo->execute();
          $resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);

          if (!$resultado_consecutivo) {
            throw new Exception("No se encontró un número de subasta válido.");
          }

          $numdoc_cabecera = $resultado_consecutivo['numero_actual'];
          $numdoc_actualizar_cabecera = $numdoc_cabecera + 1;

          // 2. Actualizar `numero_actual` en `cmx_maestro`
          $sql_update_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=:numdoc_actualizar_cabecera WHERE tipo='SUBASTA_TR' AND empresa_id=:empresa_id");
          $sql_update_maestro->bindParam(':numdoc_actualizar_cabecera', $numdoc_actualizar_cabecera, PDO::PARAM_INT);
          $sql_update_maestro->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
          $sql_update_maestro->execute();

          if (!$sql_update_maestro) {
            throw new Exception("No se actualizó un número de subasta válido.");
          }

          $sql_insert = $this->_db3->prepare("INSERT INTO cmx_subasta_torre_control (subasta_id,recurso_id,estado_subasta,usuario,fecha,hora,empresa_id)
          VALUES (:subasta_id,:recurso_id,:estado_subasta,:usuario,CURDATE(),CURTIME(),:empresa_id)");
          $sql_insert->bindParam(':subasta_id', $numdoc_cabecera, PDO::PARAM_INT);
          $sql_insert->bindParam(':recurso_id', $MaestroId, PDO::PARAM_INT);
          $sql_insert->bindParam(':estado_subasta', $estado_subasta, PDO::PARAM_STR);
          $sql_insert->bindParam(':usuario', $_SESSION["usuario"]["nom_usuario"], PDO::PARAM_STR);
          $sql_insert->bindParam(':empresa_id', $_SESSION["usuario"]["empresa_id"], PDO::PARAM_INT);
          $sql_insert->execute();

          if (!$sql_insert) {
            throw new Exception("No se insertó un número de subasta valido.");
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
          // 1. Obtener el número actual de `cmx_maestro`
          $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='SUBASTA_TR' AND numero_actual>numero_inicial AND empresa_id=:empresa_id FOR UPDATE");
          $sql_consecutivo->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
          $sql_consecutivo->execute();
          $resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);

          if (!$resultado_consecutivo) {
            throw new Exception("No se encontró un número de subasta válido.");
          }

          $numdoc_cabecera = $resultado_consecutivo['numero_actual'];
          $numdoc_actualizar_cabecera = $numdoc_cabecera + 1;

          // 2. Actualizar `numero_actual` en `cmx_maestro`
          $sql_update_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=:numdoc_actualizar_cabecera WHERE tipo='SUBASTA_TR' AND empresa_id=:empresa_id");
          $sql_update_maestro->bindParam(':numdoc_actualizar_cabecera', $numdoc_actualizar_cabecera, PDO::PARAM_INT);
          $sql_update_maestro->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
          $sql_update_maestro->execute();

          if (!$sql_update_maestro) {
            throw new Exception("No se actualizó un número de subasta válido.");
          }

          $sql_insert = $this->_db3->prepare("INSERT INTO cmx_subasta_torre_control (subasta_id,recurso_id,estado_subasta,usuario,fecha,hora,empresa_id)
          VALUES (:subasta_id,:recurso_id,:estado_subasta,:usuario,CURDATE(),CURTIME(),:empresa_id)");
          $sql_insert->bindParam(':subasta_id', $numdoc_cabecera, PDO::PARAM_INT);
          $sql_insert->bindParam(':recurso_id', $MaestroId, PDO::PARAM_INT);
          $sql_insert->bindParam(':estado_subasta', $estado_subasta, PDO::PARAM_STR);
          $sql_insert->bindParam(':usuario', $_SESSION["usuario"]["nom_usuario"], PDO::PARAM_STR);
          $sql_insert->bindParam(':empresa_id', $_SESSION["usuario"]["empresa_id"], PDO::PARAM_INT);
          $sql_insert->execute();

          if (!$sql_insert) {
            throw new Exception("No se insertó un número de subasta valido.");
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

        $sql_select_pedidos = $this->_db3->prepare("SELECT pedido_id FROM cmx_cliente_proveedor_servicio WHERE recurso_id=? GROUP BY pedido_id");
        $sql_select_pedidos->execute([$MaestroId]);
        $resultados_pedidos = $sql_select_pedidos->fetchAll(PDO::FETCH_ASSOC);

        foreach ($resultados_pedidos as $pedido) {
          // Preparar la consulta de inserción
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
            $fecha = date('Y-m-d');
            $hora = date('H:i:s');
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

            // $datosProcesados[] = $numdocSolicitud;

            /* Actuliar el estado de los pedidos */
            // $sqlUpdatePedidos = $this->_db3->prepare("UPDATE cmx_pedido_torre_control SET estado_publicaion='Completado', estado_asignacion='Completado' WHERE numdoc_solicitud = :numdoc_solicitud");
            // $sqlUpdatePedidos->bindParam(':numdoc_solicitud', $numdocSolicitud, PDO::PARAM_INT);

            // if (!$sqlUpdatePedidos->execute()) {
            //   throw new Exception('Error al actualizar cmx_pedido_torre_control.');
            // }

            // /* Actualizar el estado del pedido por proveedor */
            // $sqlUpdatePedidoProveedor = $this->_db3->prepare("UPDATE cmx_pedido_proveedor_estado SET estado_proceso_pedido='Completado'  WHERE pedido_id = :numdoc_solicitud AND proveedor_id = :proveedor_id");
            // $sqlUpdatePedidoProveedor->bindParam(':numdoc_solicitud', $numdocSolicitud, PDO::PARAM_INT);
            // $sqlUpdatePedidoProveedor->bindParam(':proveedor_id', $proveedor_id, PDO::PARAM_INT);

            // if (!$sqlUpdatePedidoProveedor->execute()) {
            //   throw new Exception('Error al actualizar cmx_pedido_proveedor_estado.');
            // }
          }
        }
      }

      $this->_db3->commit();
      // return ['success' => true, 'message' => 'Pedido subastado correctamente.'];
      return $resultados;
    } catch (Exception $e) {
      $this->_db3->rollBack();
      error_log("Error en Subastar_pedido: " . $e->getMessage());
      return ['error' => $e->getMessage()];
    }
  }

  public function crear_pedidos($ClienteId, $ReferenciaPedidos)
  {

    // $response = [];
    // $user = $_SESSION["usuario"]["nom_usuario"];
    // $session_empresa_id = $_SESSION['usuario']['empresa_id'] ?? null;
    // $fecha = date("Y-m-d");
    // $hora = date("H:i:s");

    // $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='PED_PRO' AND numero_actual>numero_inicial");
    // $resultado_consecutivo = $sql_consecutivo->execute();
    // $resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
    // $numdoc = $resultado_consecutivo['numero_actual'];
    // $numdoc_actualizar = $resultado_consecutivo['numero_actual'] + 1;

    // Actualizar Maestro de pedidos y procesos
    // $sql_updata_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numdoc_actualizar WHERE tipo='PED_PRO'");
    // $resultado_consecutivo_update = $sql_updata_maestro->execute();

    // if (!$resultado_consecutivo_update) {
    //   throw new Exception("Error al atualizar el maestro", 1);
    // }

    // $estado = 'ACTIVO';
    // $referencia = implode("-", $ReferenciaPedidos);
    // $observacion = "NULL";

    // $sql = $this->_db3->prepare("INSERT INTO cmx_trazabilidad_proceso(numdoc,cliente,referencia,observacion,fecha_creacion,hora_creacion,usuario,estado,empresa_id) 
    // VALUES(:numdoc,:cliente,:referencia,:observacion,:fecha_creacion,:hora_creacion,:usuario,:estado,:empresa_id)");
    // $sql->bindParam(':numdoc', $numdoc, PDO::PARAM_STR);
    // $sql->bindParam(':cliente', $ClienteId, PDO::PARAM_STR);
    // $sql->bindParam(':referencia', $referencia, PDO::PARAM_STR);
    // $sql->bindParam(':observacion', $observacion, PDO::PARAM_STR);
    // $sql->bindParam(':usuario', $user, PDO::PARAM_STR);
    // $sql->bindParam(':fecha_creacion', $fecha, PDO::PARAM_STR);
    // $sql->bindParam(':hora_creacion', $hora, PDO::PARAM_STR);
    // $sql->bindParam(':estado', $estado, PDO::PARAM_STR);
    // $sql->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
    // $resultados = $sql->execute();

    // if ($resultados) {
    //   $response = ["status" => true, "message" => "Pedido generado exitosamente.",];
    // } else {
    // }
    // return $response;

    /* Listar las actividades de la plantilla */
    $sql_actividades_plantilla = $this->_db3->prepare("SELECT pa.detalle_actividad_plantilla,pa.posicion FROM cmx_plantilla p
        INNER JOIN cmx_plantilla_actividad pa ON pa.numdoc_detalle_plantilla=p.numdoc
        WHERE p.numdoc=1010 GROUP BY pa.detalle_actividad_plantilla ORDER BY pa.posicion ASC");
    $sql_actividades_plantilla->execute();
    $resultadoActividades = $sql_actividades_plantilla->fetchAll(PDO::FETCH_ASSOC);


    print_r("<pre>");
    print_r($resultadoActividades);
    print_r("</pre>");
    exit();



    /**
     * @var mixed
     * Insertar el tipo de proceso parade la plantilla
     */
    $sql_select_plantilla = $this->_db3->prepare("SELECT * 
    FROM 
      cmx_plantilla p
    INNER JOIN cmx_detalle_plantilla_parametros dp ON dp.numdoc_plantilla=p.numdoc
    WHERE p.numdoc=1010");
    $sql_select_plantilla->execute();
    $resultados = $sql_select_plantilla->fetchAll(PDO::FETCH_ASSOC);
    foreach ($resultados as $key => $value) {
      $sql_detalle1 = $this->_db3->prepare("INSERT INTO cmx_tipo_detalle_trazabilidad(numdoc_detalle_trazabilidad,tipo_procesos_id,fecha_creacion)
      VALUES(:numdoc_detalle_trazabilidad,:tipo_procesos_id,:fecha_creacion)");
      $sql_detalle1->bindParam(':numdoc_detalle_trazabilidad', $numdoc, PDO::PARAM_STR);
      // $sql_detalle1->bindParam(':pedido_trazabilidad_id', $proceso_id, PDO::PARAM_STR);
      $sql_detalle1->bindParam(':tipo_procesos_id', $value["tipo_proceso_id"], PDO::PARAM_STR);
      $sql_detalle1->bindParam(':fecha_creacion', $fecha, PDO::PARAM_STR);
      $resultados_detalle = $sql_detalle1->execute();
    }
    if ($resultados_detalle) {
    }
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
    $fecha = date('Y-m-d');
    $hora = date('G:i:s');
    $session_empresa_id = $_SESSION['usuario']['empresa_id'];
    try {
      // Iniciar transacción
      $this->_db3->beginTransaction();

      // Preparar la consulta de inserción
      $sql_insert = "INSERT INTO cmx_pedido_torre_control 
              (cliente, numdoc_solicitud, referencia_pedido, ciudad_origen, remitente, 
              ciudad_destino, destinatario, cod_producto, producto, peso_neto_kg, 
              peso_bruto_kg, presentacion, unidades, lote, num_estibas, 
              fecha_cargue, fecha_entrega, usuario, fecha, hora) 
              VALUES 
              (:cliente, :numdoc_solicitud, :referencia_pedido, :ciudad_origen, :remitente, 
              :ciudad_destino, :destinatario, :cod_producto, :producto, :peso_neto_kg, 
              :peso_bruto_kg, :presentacion, :unidades, :lote, :num_estibas, 
              :fecha_cargue, :fecha_entrega, :usuario, NOW(), NOW())";

      $stmt = $this->_db3->prepare($sql_insert);

      // Obtener el número de elementos en los arrays
      $numElementos = count($mercancias['referencia_pedido']);

      // Validar que todos los arrays tengan la misma cantidad de elementos
      foreach ($mercancias as $key => $value) {
        if (count($value) !== $numElementos) {
          throw new Exception("Inconsistencia en la cantidad de elementos de '$key'");
        }
      }

      for ($i = 0; $i < $numElementos; $i++) {
        // 1. Obtener el número actual de `cmx_maestro`
        $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro 
                    WHERE tipo='PEDIDOS_TORRE_CONTROL' 
                    AND numero_actual > numero_inicial 
                    AND empresa_id=:empresa_id 
                    FOR UPDATE");

        $sql_consecutivo->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
        $sql_consecutivo->execute();
        $resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);

        if (!$resultado_consecutivo) {
          throw new Exception("No se encontró un número de pedido válido.");
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
          ':cliente'          => $cliente ?? NULL,
          ':numdoc_solicitud' => $numdoc_cabecera ?? NULL,
          ':referencia_pedido' => $mercancias['referencia_pedido'][$i] ?? NULL,
          ':ciudad_origen'    => $mercancias['ciudad_origen'][$i] ?? NULL,
          ':remitente'        => $mercancias['sitio_cargue'][$i] ?? NULL,
          ':ciudad_destino'   => $mercancias['ciudad_destino'][$i] ?? NULL,
          ':destinatario'     => $mercancias['sitio_descargue'][$i] ?? NULL,
          ':cod_producto'     => $mercancias['cod_producto'][$i] ?? NULL,
          ':producto'         => $mercancias['producto'][$i] ?? NULL,
          ':peso_neto_kg'     => $mercancias['peso_neto'][$i] ?? NULL,
          ':peso_bruto_kg'    => $mercancias['peso_bruto'][$i] ?? NULL,
          ':presentacion'     => $mercancias['presentacion'][$i] ?? NULL,
          ':unidades'         => $mercancias['unidades'][$i] ?? NULL,
          ':lote'             => $mercancias['lote'][$i] ?? NULL,
          ':num_estibas'      => $mercancias['num_estibas'][$i] ?? NULL,
          ':fecha_cargue'     => $mercancias['fecha_cargue'][$i] ?? NULL,
          ':fecha_entrega'    => $mercancias['fecha_entrega'][$i] ?? NULL,
          ':usuario'          => $_SESSION['usuario_id'] ?? $_SESSION["usuario"]["nom_usuario"] // Usuario de sesión o por defecto
        ]);
      }

      // Confirmar transacción
      $this->_db3->commit();
      return ["success" => true, "message" => "Pedidos insertados correctamente"];
    } catch (Exception $e) {
      $this->_db3->rollBack();
      return ["success" => false, "message" => "Error al insertar: " . $e->getMessage()];
    }
  }

  public function Listar_recrusos_administrador($ventana, $proveedor_id)
  {
    //Separacion por proveedor y ventanas
    $response = [];
    if (isset($ventana) && isset($proveedor_id)) {
      try {
        $stmt = $this->_db3->prepare("SELECT DISTINCT rp.maestro_id,CONCAT(rp.fecha,'-',rp.hora) AS fecha, rp.usuario,rp.estado, cl.nombre,cps.proceso,eht.estado_recurso
        FROM 
          cmx_recurso_pedido rp 
        INNER JOIN cmx_clientes cl ON cl.id=rp.cliente_id
        INNER JOIN cmx_cliente_proveedor_servicio cps ON rp.maestro_id=cps.recurso_id
        INNER JOIN cmx_estado_historico_recurso eht ON rp.maestro_id=eht.recurso_id AND cps.proveedor_id=eht.proveedor_id AND eht.estado_actual=1
				WHERE cps.proveedor_id=:proveedor_id ORDER BY rp.maestro_id DESC");
        $stmt->bindParam(':proveedor_id', $proveedor_id);
        $stmt->execute();
        $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
      } catch (PDOException $e) {
        $error = $e->getMessage();
        // $this->_db3->rollBack();
      }
    } else {
      try {
        $stmt = $this->_db3->prepare("SELECT DISTINCT 
          rp.maestro_id ,CONCAT(rp.fecha,'-',rp.hora) AS fecha, rp.usuario,rp.estado, cl.nombre,cps.proceso, cl.id AS clienteId
        FROM 
          cmx_recurso_pedido rp 
          INNER JOIN cmx_clientes cl ON cl.id=rp.cliente_id
          INNER JOIN cmx_cliente_proveedor_servicio cps ON rp.maestro_id=cps.recurso_id");
        $stmt->execute();
        $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
      } catch (PDOException $e) {
        $error = $e->getMessage();
        // $this->_db3->rollBack();
      }
    }

    return $response;
  }

  public function Listar_pedidos_recrusos($MaestroId, $proveedor_id, $VentanaId)
  {
    $response = [];

    if ($VentanaId == 39) {
      $sql = $this->_db3->prepare("SELECT DISTINCT 
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
      pt.fecha_cargue,
      pt.fecha_entrega,
      pt.peso_neto_kg,
      ppe.estado_proceso_pedido,
      ppe.estado_visualizar
      FROM cmx_recurso_pedido rp 
      INNER JOIN cmx_cliente_proveedor_servicio cps  ON rp.maestro_id = cps.recurso_id
      INNER JOIN cmx_pedido_torre_control pt  ON cps.pedido_id = pt.numdoc_solicitud
      INNER JOIN cmx_pedido_proveedor_estado ppe ON cps.proveedor_id = ppe.proveedor_id AND ppe.pedido_id = pt.numdoc_solicitud -- Relación directa con el pedido
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
              CONCAT(rst.fecha_inicio,'-',rst.hora_inicio) AS Fecha_Inicio 
            FROM
              cmx_subasta_torre_control st -- INNER JOIN cmx_recurso_pedido rp ON st.recurso_id=rp.maestro_id
              INNER JOIN cmx_resultado_subasta_tr rst ON st.subasta_id = rst.subasta_id -- INNER JOIN cmx_pedido_torre_control ptr ON rst.pedido_id=ptr.numdoc_solicitud
              INNER JOIN cmx_servicio_torre_control str ON rst.servicio_id = str.id
              INNER JOIN cmx_proveedor_torre_control pt ON rst.proveedor_id = pt.id 
            WHERE
              st.recurso_id = $MaestroId
            GROUP BY
              rst.servicio_id");
      $sql_select_subasta->execute();
      $resultados = $sql_select_subasta->fetchAll(PDO::FETCH_ASSOC);

      $response = ['sql' => $sql->fetchAll(PDO::FETCH_ASSOC), 'resultados' => $resultados];
    } else {
      $sql = $this->_db3->prepare("SELECT DISTINCT 
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
      pt.fecha_cargue,
      pt.fecha_entrega,
      pt.peso_neto_kg,
      ppe.estado_proceso_pedido,
      ppe.estado_visualizar
      FROM cmx_recurso_pedido rp 
      INNER JOIN cmx_cliente_proveedor_servicio cps  ON rp.maestro_id = cps.recurso_id
      INNER JOIN cmx_pedido_torre_control pt  ON cps.pedido_id = pt.numdoc_solicitud
      INNER JOIN cmx_pedido_proveedor_estado ppe ON cps.proveedor_id = ppe.proveedor_id AND ppe.pedido_id = pt.numdoc_solicitud -- Relación directa con el pedido
      WHERE rp.maestro_id=:maestro_id  AND ppe.proveedor_id=:proveedor_id AND ppe.estado_visualizar=1");
      $sql->bindParam(':maestro_id', $MaestroId, PDO::PARAM_INT);
      $sql->bindParam(':proveedor_id', $proveedor_id, PDO::PARAM_INT);
      $sql->execute();
      $response = $sql->fetchAll(PDO::FETCH_ASSOC);
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
      $this->_db3->beginTransaction(); // Iniciar transacción

      if ($VentanaId == 39) {
        /* Consulta de datos */
        $sql = $this->_db3->prepare("SELECT DISTINCT st.id,
        ptc.razon_social, 
        st.tipo_servicio,
        COALESCE(pv.nombre, 'Sin Vehiculo') AS vehiculo,
        CONCAT(cps.fecha, '-', cps.hora) AS Fecha_registro,
        CONCAT(cps.fecha_vencimiento, '-', cps.hora_vencimiento) AS fecha_limite,
        COALESCE(esp.estado_servicio, 'Postulado') AS estado_servicio, -- Estado dinámico
        -- esp.estado_servicio,
        ptc.id AS ProveedorId,
        st.id AS servicioId,
        cps.valor_servicio AS Valor_Servicio,
				CONCAT(cps.fecha_inicio,'-',cps.hora_inicio) AS Fecha_Inicio,
				CONCAT(cps.fecha_actualizacion,'-',cps.hora_actualizacion) AS Fecha_Actualizacion,
        cps.referencia AS Placa
        FROM cmx_recurso_pedido rp
        INNER JOIN cmx_cliente_proveedor_servicio cps ON rp.maestro_id = cps.recurso_id
        INNER JOIN cmx_servicio_torre_control st ON cps.serivicio_id = st.id
        INNER JOIN cmx_proveedor_torre_control ptc ON cps.proveedor_id = ptc.id
        LEFT JOIN cmx_para_tipo_vehiculo pv ON cps.tipo_vehiculo = pv.id
        INNER JOIN cmx_estado_servicio_proveedor esp ON cps.pedido_id = esp.pedido_id 
            AND cps.serivicio_id = esp.servicio_id 
            AND rp.maestro_id = esp.recurso_id
            AND ptc.id=esp.proveedor_id AND esp.estado_actual=1
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
               VALUES (:pedido_id, :proveedor_id, :recurso_id,:estado_proceso_pedido, :estado_visualizar, :usuario, CURDATE(), CURTIME(), :empresa_id)");

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
               VALUES (:recurso_id, :proveedor_id, :estado_recurso, :estado_actual, :usuario, CURDATE(), CURTIME(), :empresa_id)");

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
        cps.referencia AS Placa
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

      $this->_db3->commit(); // Confirmar la transacción
      return $response;
    } catch (Exception $e) {
      $this->_db3->rollBack(); // Revertir la transacción en caso de error
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
      $fecha = date('Y-m-d');
      $hora = date('G:i:s');
      $session_empresa_id = $_SESSION['usuario']['empresa_id'];
      // Iniciamos una transacción
      $this->_db3->beginTransaction();

      $sql_insert_trazabilidad = $this->_db3->prepare("INSERT INTO cmx_trazabilidad_torre_control
      (numdoc_trazabilidad, recurso_id, servicio_id, placa_vehiculo, ruta, sitio_seguimiento, fecha_hora, nota_seguimiento, usuario_reporte, usuario, fecha, hora, empresa_id)
      VALUES (:numdoc_trazabilidad, :recurso_id, :servicio_id, :placa_vehiculo, :ruta, :sitio_seguimiento, :fecha_hora, :nota_seguimiento, :usuario_reporte, :usuario, :fecha, :hora, :empresa_id)");

      foreach ($datos as $key => $value) {
        // 1. Obtener el número actual de `cmx_maestro`
        $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='TRAZABILIDAD_TR' AND numero_actual>numero_inicial AND empresa_id=:empresa_id FOR UPDATE");
        $sql_consecutivo->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
        $sql_consecutivo->execute();
        $resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);

        if (!$resultado_consecutivo) {
          throw new Exception("No se encontró un número de pedido válido.");
        }

        $numdoc_cabecera = $resultado_consecutivo['numero_actual'];
        $numdoc_actualizar_cabecera = $numdoc_cabecera + 1;

        // 2. Actualizar `numero_actual` en `cmx_maestro`
        $sql_update_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=:numdoc_actualizar_cabecera WHERE tipo='TRAZABILIDAD_TR' AND empresa_id=:empresa_id");
        $sql_update_maestro->bindParam(':numdoc_actualizar_cabecera', $numdoc_actualizar_cabecera, PDO::PARAM_INT);
        $sql_update_maestro->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_STR);
        $sql_update_maestro->execute();
        $sql_insert_trazabilidad->execute([
          ':numdoc_trazabilidad' => $numdoc_cabecera,
          ':recurso_id' => $RecursoId,
          ':servicio_id' => $ServicioId,
          ':placa_vehiculo' => $value['REFERENCIA'],
          ':ruta' => $value['RUTA'],
          ':sitio_seguimiento' => $value['SITIO'],
          ':fecha_hora' => $value['FECHA HORA'],
          ':nota_seguimiento' => $value['NOTA'],
          ':usuario_reporte' => $value['USUARIO'],
          ':usuario' => $value["usuario"] ?? $_SESSION["usuario"]["nom_usuario"],
          ':fecha' => $fecha,
          ':hora' => $hora,
          ':empresa_id' => $session_empresa_id,
        ]);
      }
      // Confirmamos la transacción
      $this->_db3->commit();
      return ["status" => true, "message" => "Trazabilidad importada correctamente."];
    } catch (\Throwable $th) {
      //throw $th;
      $this->_db3->rollBack();
      return ["status" => false, "message" => $th->getMessage()];
    }
  }
}
