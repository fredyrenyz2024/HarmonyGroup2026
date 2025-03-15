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
          (cliente, numdoc_solicitud, referencia_pedido, ciudad_origen, codigo_origen, sitio_cargue, ciudad_destino, codigo_destino, sitio_descargue, cod_producto, referencia, modalidad, peso_neto, peso_bruto, unidades, tipo_vehiculo, costo, tarifa, observaciones, usuario, fecha, hora) 
          VALUES 
          (:cliente, :numdoc_solicitud, :referencia_pedido ,:ciudad_origen, :codigo_origen, :sitio_cargue, :ciudad_destino, :codigo_destino, :sitio_descargue, :cod_producto, :referencia, :modalidad, :peso_neto, :peso_bruto, :unidades, :tipo_vehiculo, :costo, :tarifa, :observaciones, :usuario, :fecha, :hora)";
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
          // ":cliente"        => $row["CLIENTE"] ?? $_SESSION['usuario']['id_cliente'],
          ":cliente"          => $row["cliente"] ?? $_SESSION['usuario']['id_cliente'],
          ":numdoc_solicitud" => $numdoc_cabecera,
          ":referencia_pedido" => $row["REFERENCIA PEDIDO"] ?? "",
          ":ciudad_origen"  => $row["CIUDAD ORIGEN"] ?? "",
          ":codigo_origen"  => $row["CODIGO ORIGEN"] ?? "",
          ":sitio_cargue"   => $row["SITIO CARGUE"] ?? "",
          ":ciudad_destino" => $row["CIUDAD DESTINO"] ?? "",
          ":codigo_destino" => $row["CODIGO DESTINO"] ?? "",
          ":sitio_descargue" => $row["SITIO DESCARGUE"] ?? "",
          ":cod_producto"   => $row["COD. PRODUCTO"] ?? "",
          ":referencia"     => $row["REFERENCIA"] ?? "",
          ":modalidad"      => $row["MODALIDAD"] ?? "",
          ":peso_neto"      => $row["PESO NETO"] ?? "",
          ":peso_bruto"     => $row["PESO BRUTO"] ?? "",
          ":unidades"       => $row["UNIDADES"] ?? "",
          ":tipo_vehiculo"  => $row["TIPO DE VH"] ?? "",
          ":costo"          => $row["COSTO"] ?? "",
          ":tarifa"         => $row["TARIFA"] ?? "",
          ":observaciones"  => $row["OBSERVACIONES"] ?? "",
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
        // $sql = $this->_db3->prepare("SELECT DISTINCT pt.numdoc_solicitud,pt.id,pt.cliente,pt.ciudad_origen,pt.codigo_origen,pt.sitio_cargue,pt.ciudad_destino,pt.codigo_destino,
        // pt.sitio_descargue,pt.cod_producto,pt.referencia,pt.modalidad,pt.peso_neto,pt.peso_bruto,pt.unidades,pt.tipo_vehiculo,pt.costo,pt.tarifa,pt.observaciones,pt.estado_publicaion,
        // pt.estado_asignacion,pt.usuario,pt.fecha,pt.hora,cl.nombre AS 'nombre_cliente',
        // pt.estado_prioridad,pt.referencia_pedido
        // FROM cmx_pedido_torre_control pt
        // INNER JOIN cmx_clientes cl ON pt.cliente=cl.id
        // INNER JOIN cmx_cliente_proveedor_servicio cps ON pt.numdoc_solicitud=cps.pedido_id
        // INNER JOIN cmx_proveedor_torre_control ptc ON cps.proveedor_id=ptc.id
        // WHERE cps.proveedor_id=:Proveedor_id");
        // $sql->bindParam(":Proveedor_id", $proveedor_id);
        // $sql->execute();
        // $resultado = $sql->fetchAll();


        // Iniciar la consulta como string, no como objeto PDOStatement
        $sql = "SELECT DISTINCT pt.numdoc_solicitud, pt.id, pt.cliente, pt.ciudad_origen, pt.codigo_origen, 
        pt.sitio_cargue, pt.ciudad_destino, pt.codigo_destino, pt.sitio_descargue, 
        pt.cod_producto, pt.referencia, pt.modalidad, pt.peso_neto, pt.peso_bruto, 
        pt.unidades, pt.tipo_vehiculo, pt.costo, pt.tarifa, pt.observaciones, 
        pt.estado_publicaion, pt.estado_asignacion, pt.usuario, pt.fecha, pt.hora, 
        cl.nombre AS 'nombre_cliente', pt.estado_prioridad, pt.referencia_pedido,ppes.estado_proceso_pedido
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
        $sql = "SELECT DISTINCT pt.numdoc_solicitud, pt.id, pt.cliente, pt.ciudad_origen, pt.codigo_origen, 
        pt.sitio_cargue, pt.ciudad_destino, pt.codigo_destino, pt.sitio_descargue, 
        pt.cod_producto, pt.referencia, pt.modalidad, pt.peso_neto, pt.peso_bruto, 
        pt.unidades, pt.tipo_vehiculo, pt.costo, pt.tarifa, pt.observaciones, 
        pt.estado_publicaion, pt.estado_asignacion, pt.usuario, pt.fecha, pt.hora, 
        cl.nombre AS 'nombre_cliente', pt.estado_prioridad, pt.referencia_pedido/*,ppes.estado_proceso_pedido*/
        FROM cmx_pedido_torre_control pt
        INNER JOIN cmx_clientes cl ON pt.cliente=cl.id
        ";
        // INNER JOIN cmx_cliente_proveedor_servicio cps ON pt.numdoc_solicitud=cps.pedido_id
        // INNER JOIN cmx_proveedor_torre_control ptc ON cps.proveedor_id=ptc.id
        // --INNER JOIN cmx_pedido_proveedor_estado ppes ON pt.numdoc_solicitud=ppes.pedido_id AND ppes.estado_visualizar = 1

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
          // $where[] = "ppes.estado_proceso_pedido = 'Pendiente Iniciar'";
          // $where[] = "ppes.estado_visualizar = 1";
          $where[] = "cl.id= :Cliente_id";
          $bindParams[":Cliente_id"] = $cliente_id;
        } elseif ($estado === 'En_Curso') {
          // $where[] = "ppes.estado_proceso_pedido = 'Iniciado'";
          // $where[] = "ppes.estado_visualizar = 1";
          $where[] = "cl.id= :Cliente_id";
          $bindParams[":Cliente_id"] = $cliente_id;
        } elseif ($estado === 'Completadas') {
          // $where[] = "ppes.estado_proceso_pedido = 'Completado'";
          // $where[] = "ppes.estado_visualizar = 1";
          $where[] = "cl.id= :Cliente_id";
          $where[] = "pt.estado_asignacion = 'Ganador'";
          $bindParams[":Cliente_id"] = $cliente_id;
        } elseif ($estado === 'Todos') {
          $where[] = "cl.id= :Cliente_id";
          $bindParams[":Cliente_id"] = $cliente_id;
          // $where[] = "ppes.estado_visualizar = 1";
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
        $sql = "SELECT pt.numdoc_solicitud, pt.id, pt.cliente, pt.ciudad_origen, pt.codigo_origen, pt.sitio_cargue, 
               pt.ciudad_destino, pt.codigo_destino, pt.sitio_descargue, pt.cod_producto, pt.referencia, 
               pt.modalidad, pt.peso_neto, pt.peso_bruto, pt.unidades, pt.tipo_vehiculo, pt.costo, pt.tarifa, 
               pt.observaciones, pt.estado_publicaion, pt.estado_asignacion, pt.usuario, pt.fecha, pt.hora, 
               cl.nombre AS 'nombre_cliente', pt.estado_prioridad, pt.referencia_pedido 
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

  public function insertar_asignacion_proveedor($numdocSolicitud, $asignaciones, $fecha_vencimiento, $hora_vencimiento)
  {
    try {
      $this->_db3->beginTransaction(); // Iniciar transacción para evitar inserciones incompletas

      // Obtener usuario y empresa desde la sesión
      $nom_usuario = $_SESSION['usuario']['nom_usuario'] ?? null;
      $session_empresa_id = $_SESSION['usuario']['empresa_id'];

      // Contador de inserciones exitosas
      $totalInsertados = 0;

      foreach ($asignaciones as $asignacion) {
        $sql = "INSERT INTO cmx_cliente_proveedor_servicio (pedido_id, proveedor_id, serivicio_id, fecha_vencimiento, hora_vencimiento, estado_pedido_asignado, proceso, usuario, fecha, hora, empresa_id) 
                    VALUES (:pedido_id, :proveedor_id, :serivicio_id, :fecha_vencimiento, :hora_vencimiento, 'Activo', 'Asignación', :usuario, CURDATE(), CURTIME(), :empresa_id)";

        $stmt = $this->_db3->prepare($sql);
        $stmt->execute([
          ':pedido_id' => $numdocSolicitud,
          ':proveedor_id' => $asignacion['proveedor_id'],
          ':serivicio_id' => $asignacion['servicio_id'],
          ':fecha_vencimiento' => $fecha_vencimiento,
          ':hora_vencimiento' => $hora_vencimiento,
          ':usuario' => $nom_usuario,
          ':empresa_id' => $session_empresa_id
        ]);

        // Verificar que se haya insertado al menos una fila
        if ($stmt->rowCount() === 0) {
          throw new Exception("Error al insertar la asignación para el proveedor {$asignacion['proveedor_id']}");
        }

        $totalInsertados++;
      }

      // Si no se insertó ninguna fila, lanzar error
      if ($totalInsertados === 0) {
        throw new Exception("No se insertó ninguna asignación.");
      }

      // Actualizar el estado solo si hubo inserciones exitosas
      $sql_update = $this->_db3->prepare("UPDATE cmx_pedido_torre_control SET estado_publicaion='Publicado', estado_asignacion='Asignado' WHERE numdoc_solicitud=:numdoc_solicitud");
      $sql_update->execute([':numdoc_solicitud' => $numdocSolicitud]);

      // Verificar si el `UPDATE` afectó filas
      if ($sql_update->rowCount() === 0) {
        throw new Exception("Error al actualizar el estado de asignación para el pedido.");
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

  public function publicar_pedido_proveedor($numdocSolicitud, $seleccionados, $fecha_vencimiento, $hora_vencimiento, $Proveedoresseleccionados, $proceso)
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

      // Preparar la consulta de inserción
      $sql_insert = $this->_db3->prepare("INSERT INTO cmx_cliente_proveedor_servicio (pedido_id, proveedor_id, serivicio_id, fecha_vencimiento, hora_vencimiento, estado_pedido_asignado, proceso, usuario, fecha, hora, empresa_id) 
            VALUES (:pedido_id, :proveedor_id, :serivicio_id, :fecha_vencimiento, :hora_vencimiento, 'Activo', 'Publicación', :usuario, CURDATE(), CURTIME(), :empresa_id)");

      // Recorrer los servicios seleccionados
      foreach ($seleccionados as $item) {
        $servicio_id = $item['servicio_id'] ?? null;
        $proveedores = $item['proveedores'] ?? [];

        if (!$servicio_id || empty($proveedores)) {
          continue; // Saltar si faltan datos
        }

        // Insertar cada proveedor asociado al servicio
        foreach ($proveedores as $proveedor_id) {
          $sql_insert->execute([
            ':pedido_id' => $numdocSolicitud,
            ':proveedor_id' => $proveedor_id,
            ':serivicio_id' => $servicio_id,
            ':fecha_vencimiento' => $fecha_vencimiento,
            ':hora_vencimiento' => $hora_vencimiento,
            ':usuario' => $nom_usuario,
            ':empresa_id' => $session_empresa_id
          ]);
          $totalInsertados++;
        }
      }

      if ($totalInsertados === 0) {
        throw new Exception("No se insertó ninguna asignación.");
      }

      // Actualizar el estado del pedido en `cmx_pedido_torre_control`
      $sql_update = $this->_db3->prepare("
            UPDATE cmx_pedido_torre_control 
            SET estado_publicaion='Publicado', estado_asignacion='Pendiente' 
            WHERE numdoc_solicitud=:numdoc_solicitud
        ");
      $sql_update->execute([':numdoc_solicitud' => $numdocSolicitud]);

      if ($sql_update->rowCount() === 0) {
        throw new Exception("Error al actualizar el estado del pedido.");
      }

      /* Insertar el estado de pedido por proveedor */
      $sql_insert_estado_proveedor = $this->_db3->prepare("INSERT INTO cmx_pedido_proveedor_estado (pedido_id,proveedor_id,estado_proceso_pedido,estado_visualizar,usuario ,fecha,hora,empresa_id)
      VALUES (:pedido_id,:proveedor_id,:estado_proceso_pedido,:estado_visualizar,:usuario,CURDATE(),CURTIME(),:empresa_id)");

      foreach ($Proveedoresseleccionados as $proveedor_id) {
        $sql_insert_estado_proveedor->execute([
          ':pedido_id' => $numdocSolicitud,
          ':proveedor_id' => $proveedor_id,
          ':estado_proceso_pedido' => 'Pendiente Iniciar',
          ':estado_visualizar' => 1,
          ':usuario' => $nom_usuario,
          ':empresa_id' => $session_empresa_id
        ]);
      }


      if ($sql_insert_estado_proveedor->rowCount() === 0) {
        throw new Exception("Error al insertar el estado de pedido por proveedor.");
      }

      $this->_db3->commit(); // Confirmar la transacción
      return ["status" => true, "message" => "Publicación insertada correctamente"];
    } catch (\Throwable $th) {
      $this->_db3->rollBack(); // Revertir si hay un error
      return ["status" => false, "message" => $th->getMessage()];
    }
  }

  // public function Detalle_proceso_pedido($Solicitud)
  // {
  //   try {
  //     // $proveedor = isset($_SESSION['usuario']['proveedor_id']) ? $_SESSION['usuario']['proveedor_id'] : null;
  //     $proveedor = isset($_SESSION['usuario']['proveedor_id']);

  //     if ($_SESSION['usuario']['tipo_perfil'] == "PROVEEDOR") {
  //       $sql = $this->_db3->prepare("SELECT cs.proceso, st.tipo_servicio, pt.razon_social, cs.fecha_vencimiento, cs.hora_vencimiento,pt.id AS proveedor_id, st.id AS servicio_id,cs.pedido_id,
  //       COALESCE(etp.estado_pedido, 'SIN ESTADO') AS estado_pedido
  //       FROM cmx_cliente_proveedor_servicio cs 
  //       INNER JOIN cmx_servicio_torre_control st ON cs.serivicio_id = st.id
  //       INNER JOIN cmx_proveedor_torre_control pt ON cs.proveedor_id = pt.id
  //       LEFT JOIN cmx_estados_pedidos_tr etp ON cs.pedido_id = etp.pedido_id AND cs.proveedor_id = etp.proveedor_id AND cs.serivicio_id=etp.servicio_id AND etp.estado_previsualizar=1
  //       WHERE cs.pedido_id = :Solicitud AND cs.proveedor_id = :Proveedor");
  //       $sql->bindParam(':Solicitud', $Solicitud, PDO::PARAM_INT);
  //       $sql->bindParam(':Proveedor', $proveedor, PDO::PARAM_INT);
  //     } else {
  //       $sql = $this->_db3->prepare("SELECT cs.proceso, st.tipo_servicio, pt.razon_social, cs.fecha_vencimiento, cs.hora_vencimiento,pt.id AS proveedor_id, st.id AS servicio_id,cs.pedido_id,
  //       COALESCE(etp.estado_pedido, 'SIN ESTADO') AS estado_pedido
  //       FROM cmx_cliente_proveedor_servicio cs 
  //       INNER JOIN cmx_servicio_torre_control st ON cs.serivicio_id = st.id
  //       INNER JOIN cmx_proveedor_torre_control pt ON cs.proveedor_id = pt.id
  //       LEFT JOIN cmx_estados_pedidos_tr etp ON cs.pedido_id = etp.pedido_id AND cs.proveedor_id = etp.proveedor_id AND cs.serivicio_id=etp.servicio_id AND etp.estado_previsualizar=1
  //       WHERE cs.pedido_id = :Solicitud");
  //       $sql->bindParam(':Solicitud', $Solicitud, PDO::PARAM_INT);

  //       /* Consulta para subasta */
  //       $sql1 = $this->_db3->prepare("SELECT cps.valor_servicio,cps.referencia,cps.fecha_inicio,cps.hora_inicio,pt.razon_social,st.tipo_servicio,cps.fecha_actualizacion,cps.hora_actualizacion
  //       FROM cmx_cliente_proveedor_servicio cps
  //       -- INNER JOIN cmx_estados_pedidos_tr ept ON cps.pedido_id=ept.pedido_id AND cps.serivicio_id=ept.servicio_id AND ept.estado_pedido='Completado' AND ept.estado_previsualizar=1
  //       INNER JOIN cmx_proveedor_torre_control pt ON cps.proveedor_id=pt.id
  //       INNER JOIN cmx_servicio_torre_control st on cps.serivicio_id=st.id
  //       WHERE cps.pedido_id=:Solicitud AND cps.valor_servicio IS NOT NULL");
  //       $sql1->bindParam(':Solicitud', $Solicitud, PDO::PARAM_INT);
  //     }

  //     // Ejecutar la consulta
  //     $sql->execute();
  //     return $sql->fetchAll(PDO::FETCH_ASSOC);
  //   } catch (PDOException $e) {
  //     return ['error' => $e->getMessage()];
  //   }
  // }

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
      $sql = $this->_db3->prepare("UPDATE cmx_cliente_proveedor_servicio SET valor_servicio = :valor_servicio, referencia = :referencia,  fecha_inicio = :fecha_inicio, 
      hora_inicio = :hora_inicio, fecha_actualizacion = CURDATE(), hora_actualizacion = CURTIME()
      WHERE pedido_id = :pedido_id AND proveedor_id = :proveedor_id  AND serivicio_id = :servicio_id");

      $sql->bindParam(':pedido_id', $datos['pedidoId'], PDO::PARAM_INT);
      $sql->bindParam(':proveedor_id', $datos['proveedorId'], PDO::PARAM_INT);
      $sql->bindParam(':servicio_id', $datos['servicioId'], PDO::PARAM_INT);
      $sql->bindParam(':valor_servicio', $datos['costo_servicio'], PDO::PARAM_STR);
      $sql->bindParam(':referencia', $datos['placa'], PDO::PARAM_STR);
      $sql->bindParam(':fecha_inicio', $datos['fecha_inicio'], PDO::PARAM_STR);
      $sql->bindParam(':hora_inicio', $datos['hora_inicio'], PDO::PARAM_STR);

      if (!$sql->execute()) {
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
      $sqlUpdateEstado = $this->_db3->prepare("UPDATE cmx_estados_pedidos_tr 
       SET estado_previsualizar = 0 
       WHERE pedido_id = :pedido_id AND proveedor_id = :proveedor_id AND servicio_id = :servicio_id");
      $sqlUpdateEstado->bindParam(':pedido_id', $datos['pedidoId'], PDO::PARAM_INT);
      $sqlUpdateEstado->bindParam(':proveedor_id', $datos['proveedorId'], PDO::PARAM_INT);
      $sqlUpdateEstado->bindParam(':servicio_id', $datos['servicioId'], PDO::PARAM_INT);
      $sqlUpdateEstado->execute();

      if (!$sqlUpdateEstado->execute()) {
        throw new Exception('Error al actualizar cmx_estados_pedidos_tr.');
      }

      // Insertar el nuevo registro
      $sqlInsert = $this->_db3->prepare("INSERT INTO cmx_estados_pedidos_tr (pedido_id, proveedor_id, servicio_id, estado_pedido, estado_previsualizar, usuario, fecha, hora, empresa_id) 
            VALUES (:pedido_id, :proveedor_id, :servicio_id, :estado_pedido, :estado_previsualizar, :usuario, :fecha, :hora, :empresa_id)");

      $estado = 1;
      $estado_pedido = 'Postulado';
      // Asignar valores
      $sqlInsert->bindParam(':pedido_id', $datos['pedidoId'], PDO::PARAM_INT);
      $sqlInsert->bindParam(':proveedor_id', $datos['proveedorId'], PDO::PARAM_INT);
      $sqlInsert->bindParam(':servicio_id', $datos['servicioId'], PDO::PARAM_INT);
      $sqlInsert->bindParam(':estado_pedido', $estado_pedido, PDO::PARAM_STR);
      $sqlInsert->bindParam(':estado_previsualizar', $estado, PDO::PARAM_STR);
      $sqlInsert->bindParam(':usuario', $nom_usuario, PDO::PARAM_STR);
      $sqlInsert->bindParam(':fecha', $datos['fecha'], PDO::PARAM_STR);
      $sqlInsert->bindParam(':hora', $datos['hora'], PDO::PARAM_STR);
      $sqlInsert->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_INT);

      if (!$sqlInsert->execute()) {
        throw new Exception('Error al insertar cmx_estados_pedidos_tr.');
      }

      // Confirmar la transacción si todo sale bien
      $this->_db3->commit();

      return [
        'status' => true,
        'message' => 'Postulación realizada correctamente.',
        'pedidoId' => $datos['pedidoId'],
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

  public function Subastar_pedido($numdocSolicitud)
  {
    try {
      $this->_db3->beginTransaction();

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
                  cps.pedido_id,
                  cps.id,
                  ROW_NUMBER() OVER (
                      PARTITION BY cps.serivicio_id 
                      ORDER BY CAST(REPLACE(cps.valor_servicio, ',', '') AS DECIMAL(15,2)) ASC, 
                              cps.fecha_actualizacion ASC, 
                              cps.hora_actualizacion ASC
                  ) AS rn
              FROM cmx_cliente_proveedor_servicio cps
              INNER JOIN cmx_servicio_torre_control st ON cps.serivicio_id = st.id
              INNER JOIN cmx_proveedor_torre_control pt ON cps.proveedor_id=pt.id
              WHERE cps.pedido_id = :numdocSolicitud AND cps.valor_servicio IS NOT NULL
          )
          SELECT total_gestionados, tipo_servicio, menor_valor, proveedor_id, fecha_actualizacion, hora_actualizacion, razon_social, fecha_inicio, hora_inicio, pedido_id, id
          FROM Ranked
          WHERE rn = 1");

      $sql->bindParam(':numdocSolicitud', $numdocSolicitud, PDO::PARAM_INT);
      $sql->execute();
      $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);

      // Preparar la consulta de inserción
      $sql_insert_result_subasta = $this->_db3->prepare("INSERT INTO cmx_resultado_subasta_tr 
              (pedido_id, servicio_id, proveedor_id, valor_ganador, fecha_registro, hora_registro, estado_subasta,
               fecha_inicio, hora_inicio, fecha_actualizacion, hora_actualizacion, servicio_ganador_id, usuario, fecha, hora, empresa_id) 
              VALUES (:pedido_id, :servicio_id, :proveedor_id, :valor_ganador, :fecha_registro, :hora_registro, :estado_subasta,
                      :fecha_inicio, :hora_inicio, :fecha_actualizacion, :hora_actualizacion, :servicio_ganador_id, :usuario, :fecha, :hora, :empresa_id)");

      foreach ($resultados as $value) {
        $servicio_ganador_id = $value['id'];
        $pedido_id = $value['pedido_id'];
        $servicio_id = $value['total_gestionados'];
        $proveedor_id = $value['proveedor_id'];
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

        // Actualizar estado en cmx_estados_pedidos_tr
        $sqlUpdate = $this->_db3->prepare("UPDATE cmx_estados_pedidos_tr 
                  SET estado_previsualizar = 0 
                  WHERE pedido_id = :pedido_id AND proveedor_id = :proveedor_id AND servicio_id = :servicio_id");
        $sqlUpdate->bindParam(':pedido_id', $pedido_id, PDO::PARAM_INT);
        $sqlUpdate->bindParam(':proveedor_id', $proveedor_id, PDO::PARAM_INT);
        $sqlUpdate->bindParam(':servicio_id', $servicio_id, PDO::PARAM_INT);

        if (!$sqlUpdate->execute()) {
          throw new Exception('Error al actualizar cmx_estados_pedidos_tr.');
        }

        // Insertar en cmx_estados_pedidos_tr
        $sqlInsert = $this->_db3->prepare("INSERT INTO cmx_estados_pedidos_tr 
                  (pedido_id, proveedor_id, servicio_id, estado_pedido, estado_previsualizar, usuario, fecha, hora, empresa_id) 
                  VALUES (:pedido_id, :proveedor_id, :servicio_id, :estado_pedido, :estado_previsualizar, :usuario, :fecha, :hora, :empresa_id)");

        $estado = 1;
        $sqlInsert->bindParam(':pedido_id', $pedido_id, PDO::PARAM_INT);
        $sqlInsert->bindParam(':proveedor_id', $proveedor_id, PDO::PARAM_INT);
        $sqlInsert->bindParam(':servicio_id', $servicio_id, PDO::PARAM_INT);
        $sqlInsert->bindParam(':estado_pedido', $estado_subasta, PDO::PARAM_STR);
        $sqlInsert->bindParam(':estado_previsualizar', $estado, PDO::PARAM_INT);
        $sqlInsert->bindParam(':usuario', $usuario, PDO::PARAM_STR);
        $sqlInsert->bindParam(':fecha', $fecha, PDO::PARAM_STR);
        $sqlInsert->bindParam(':hora', $hora, PDO::PARAM_STR);
        $sqlInsert->bindParam(':empresa_id', $empresa_id, PDO::PARAM_INT);

        if (!$sqlInsert->execute()) {
          throw new Exception('Error al insertar en cmx_estados_pedidos_tr.');
        }

        /* Actuliar el estado de los pedidos */
        $sqlUpdatePedidos = $this->_db3->prepare("UPDATE cmx_pedido_torre_control SET estado_publicaion='Completado', estado_asignacion='Completado' WHERE numdoc_solicitud = :numdoc_solicitud");
        $sqlUpdatePedidos->bindParam(':numdoc_solicitud', $numdocSolicitud, PDO::PARAM_INT);

        if (!$sqlUpdatePedidos->execute()) {
          throw new Exception('Error al actualizar cmx_pedido_torre_control.');
        }

        /* Actualizar el estado del pedido por proveedor */
        $sqlUpdatePedidoProveedor = $this->_db3->prepare("UPDATE cmx_pedido_proveedor_estado SET estado_proceso_pedido='Completado'  WHERE pedido_id = :numdoc_solicitud AND proveedor_id = :proveedor_id");
        $sqlUpdatePedidoProveedor->bindParam(':numdoc_solicitud', $numdocSolicitud, PDO::PARAM_INT);
        $sqlUpdatePedidoProveedor->bindParam(':proveedor_id', $proveedor_id, PDO::PARAM_INT);

        if (!$sqlUpdatePedidoProveedor->execute()) {
          throw new Exception('Error al actualizar cmx_pedido_proveedor_estado.');
        }
      }

      $this->_db3->commit();
      return $resultados;
    } catch (Exception $e) {
      $this->_db3->rollBack();
      error_log("Error en Subastar_pedido: " . $e->getMessage());
      return ['error' => $e->getMessage()];
    }
  }
}
