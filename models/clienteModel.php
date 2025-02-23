<?php
class clienteModel extends Model
{

  public function __construct()
  {
    parent::__construct();
  }

  public function Listar_Pedidos($fecha_inicial, $fecha_final, $cliente, $filtro, $numdoc_predido)
  {
    $response = [];
    if ($filtro == 'Fecha') {
      $sql = $this->_db3->prepare("SELECT 
    cmx_trazabilidad_proceso.numdoc, 
    cmx_trazabilidad_proceso.referencia, 
    cmx_trazabilidad_proceso.estado, 
    cmx_trazabilidad_proceso.fecha_creacion, 
    cmx_trazabilidad_proceso.hora_creacion, 
    cmx_clientes.nombre, 
    cmx_solicitudes_pedidos.solicitud_id
    FROM cmx_trazabilidad_proceso
    INNER JOIN cmx_clientes ON cmx_clientes.id = cmx_trazabilidad_proceso.cliente
    INNER JOIN cmx_usuario_cliente ON cmx_usuario_cliente.id_cliente = cmx_clientes.id
    INNER JOIN cmx_solicitudes_pedidos ON cmx_trazabilidad_proceso.numdoc = cmx_solicitudes_pedidos.pedido_id
    WHERE cmx_usuario_cliente.id_cliente = :cliente
    AND cmx_trazabilidad_proceso.fecha_creacion BETWEEN :fecha_inicial AND :fecha_final AND cmx_trazabilidad_proceso.estado = 'ACTIVO'
    GROUP BY cmx_trazabilidad_proceso.referencia");
      $sql->bindParam(':cliente', $cliente);
      $sql->bindParam(':fecha_inicial', $fecha_inicial);
      $sql->bindParam(':fecha_final', $fecha_final);
      $sql->execute();
      $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
      // var_dump($resultados);
      // exit();
      if ($resultados) {
        $response = ['status' => 200, 'result' => $resultados];
      } else {
        $response = ['status' => 305, 'result' => ''];
      }
    } elseif ($filtro == 'Pedido') {
      $sql = $this->_db3->prepare("SELECT 
      cmx_trazabilidad_proceso.numdoc, 
      cmx_trazabilidad_proceso.referencia, 
      cmx_trazabilidad_proceso.estado, 
      cmx_trazabilidad_proceso.fecha_creacion, 
      cmx_trazabilidad_proceso.hora_creacion, 
      cmx_clientes.nombre, 
      cmx_solicitudes_pedidos.solicitud_id
      FROM cmx_trazabilidad_proceso
      INNER JOIN cmx_clientes ON cmx_clientes.id = cmx_trazabilidad_proceso.cliente
      INNER JOIN cmx_usuario_cliente ON cmx_usuario_cliente.id_cliente = cmx_clientes.id
      INNER JOIN cmx_solicitudes_pedidos ON cmx_trazabilidad_proceso.numdoc = cmx_solicitudes_pedidos.pedido_id
      WHERE cmx_usuario_cliente.id_cliente=:cliente
      -- AND cmx_trazabilidad_proceso.referencia=:referencia
      AND cmx_trazabilidad_proceso.referencia LIKE :referencia
      AND cmx_trazabilidad_proceso.estado = 'ACTIVO'
      GROUP BY cmx_trazabilidad_proceso.referencia");

      // Agregar los comodines '%' para la búsqueda con LIKE
      $referencia_like = "%" . $numdoc_predido . "%";

      // Bind de los parámetros
      $sql->bindParam(':cliente', $cliente);
      $sql->bindParam(':referencia', $referencia_like); // Usar la variable con los comodines
      // $sql->bindParam(':referencia', $numdoc_predido); // Usar la variable con los comodines
      $sql->execute();
      $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);

      if ($resultados) {
        $response = ['status' => 200, 'result' => $resultados];
      } else {
        $response = ['status' => 305, 'result' => ''];
      }
    }
    return $response;
  }

  public function Listar_Despachos($fecha_inicial, $fecha_final, $cliente, $filtro, $numdoc_predido)
  {
    $response = [];
    if ($filtro == 'Fecha') {
      $sql = $this->_db3->prepare('SELECT cmx_solicitud_vehiculo2.nundoc_solicitud, cmx_trazabilidad_proceso.referencia
    FROM cmx_solicitud_vehiculo2
    INNER JOIN cmx_cotizaciones_serviciocliente ON cmx_cotizaciones_serviciocliente.n_cotizacion = cmx_solicitud_vehiculo2.n_cotizacion
    INNER JOIN cmx_solicitudes_pedidos ON cmx_solicitudes_pedidos.solicitud_id = cmx_solicitud_vehiculo2.nundoc_solicitud
    INNER JOIN cmx_trazabilidad_proceso  ON cmx_trazabilidad_proceso.numdoc = cmx_solicitudes_pedidos.pedido_id
    WHERE cmx_cotizaciones_serviciocliente.id_cliente = :cliente
    -- AND cmx_solicitud_vehiculo2.fecha BETWEEN :fecha_inicial AND :fecha_final
    AND cmx_trazabilidad_proceso.fecha_creacion BETWEEN :fecha_inicial AND :fecha_final
    GROUP BY cmx_solicitud_vehiculo2.nundoc_solicitud');
      $sql->bindParam(':cliente', $cliente);
      $sql->bindParam(':fecha_inicial', $fecha_inicial);
      $sql->bindParam(':fecha_final', $fecha_final);
      $sql->execute();
      $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
      if ($resultados) {
        $response = ['status' => 200, 'result' => $resultados];
      } else {
        $response = ['status' => 305, 'result' => ''];
      }
    } else {
      $sql = $this->_db3->prepare('SELECT cmx_solicitud_vehiculo2.nundoc_solicitud, cmx_trazabilidad_proceso.referencia
      FROM cmx_solicitud_vehiculo2
      INNER JOIN cmx_cotizaciones_serviciocliente ON cmx_cotizaciones_serviciocliente.n_cotizacion = cmx_solicitud_vehiculo2.n_cotizacion
      INNER JOIN cmx_solicitudes_pedidos ON cmx_solicitudes_pedidos.solicitud_id = cmx_solicitud_vehiculo2.nundoc_solicitud
      INNER JOIN cmx_trazabilidad_proceso  ON cmx_trazabilidad_proceso.numdoc = cmx_solicitudes_pedidos.pedido_id
      WHERE cmx_cotizaciones_serviciocliente.id_cliente = :cliente
      -- AND cmx_solicitud_vehiculo2.fecha BETWEEN :fecha_inicial AND :fecha_final
      -- AND cmx_trazabilidad_proceso.fecha_creacion BETWEEN :fecha_inicial AND :fecha_final
       AND cmx_trazabilidad_proceso.referencia LIKE :referencia
      GROUP BY cmx_solicitud_vehiculo2.nundoc_solicitud');
      // Agregar los comodines '%' para la búsqueda con LIKE
      $referencia_like = "%" . $numdoc_predido . "%";
      $sql->bindParam(':cliente', $cliente);
      $sql->bindParam(':referencia', $referencia_like); // Usar la variable con los comodines
      $sql->execute();
      $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
      if ($resultados) {
        $response = ['status' => 200, 'result' => $resultados];
      } else {
        $response = ['status' => 305, 'result' => ''];
      }
    }
    return $response;
  }

  public function Listar_Detalles_Despachos($fecha_inicial, $fecha_final, $cliente, $filtro, $numdoc_solicitud)
  {
    $response = [];
    if ($filtro == "Fecha") {
      $sql = $this->_db3->prepare("SELECT 
    cmx_orden_cargue.id AS orden_cargue, 
    cmx_remesa_ordencargue.id_remesa AS remesa, 
    cmx_manifiesto.id AS manifiesto, 
    cmx_plan_ruta.cod_plan AS plan_ruta, 
    cmx_remesa.fecha_creacion, 
    cmx_remesa.usuario_creacion, 
    cmx_trazabilidad_proceso.referencia
    FROM cmx_remesa
    INNER JOIN  cmx_manifiesto_remesa ON cmx_manifiesto_remesa.id_remesa = cmx_remesa.id
    INNER JOIN  cmx_manifiesto ON cmx_manifiesto.id = cmx_manifiesto_remesa.id_manifiesto
    INNER JOIN  cmx_remesa_ordencargue ON cmx_remesa_ordencargue.id_remesa = cmx_remesa.id
    INNER JOIN  cmx_orden_cargue ON cmx_orden_cargue.id = cmx_remesa_ordencargue.id_orden_cargue
    INNER JOIN  cmx_cotizaciones_serviciocliente ON cmx_cotizaciones_serviciocliente.id_cliente = cmx_orden_cargue.cli_id
    INNER JOIN  cmx_solicitudes_pedidos ON cmx_solicitudes_pedidos.solicitud_id = cmx_orden_cargue.mer_idservicio
    INNER JOIN  cmx_trazabilidad_proceso ON cmx_trazabilidad_proceso.numdoc = cmx_solicitudes_pedidos.pedido_id
    INNER JOIN  cmx_solicitud_vehiculo2 ON cmx_orden_cargue.mer_idservicio = cmx_solicitud_vehiculo2.nundoc_solicitud
    LEFT JOIN   cmx_inicio_ruta ON cmx_inicio_ruta.num_manifiesto = cmx_manifiesto.id
    LEFT JOIN   cmx_plan_ruta ON cmx_plan_ruta.cod_plan = cmx_inicio_ruta.cod_plan
    WHERE cmx_cotizaciones_serviciocliente.id_cliente = :cliente
    AND cmx_solicitud_vehiculo2.nundoc_solicitud = :solicitud
    -- AND cmx_orden_cargue.fecha_orden BETWEEN :fecha_inicio AND :fecha_fin
    AND cmx_trazabilidad_proceso.fecha_creacion BETWEEN :fecha_inicio AND :fecha_fin
    GROUP BY cmx_orden_cargue.id");
      $sql->bindParam(':cliente', $cliente);
      $sql->bindParam(':solicitud', $numdoc_solicitud);
      $sql->bindParam(':fecha_inicio', $fecha_inicial);
      $sql->bindParam(':fecha_fin', $fecha_final);
      $sql->execute();
      $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
      if ($resultados) {
        $response = ['status' => 200, 'result' => $resultados];
      } else {
        $response = ['status' => 305, 'result' => ''];
      }
    } elseif ($filtro == "Pedido") {
      $sql = $this->_db3->prepare("SELECT 
      cmx_orden_cargue.id AS orden_cargue, 
      cmx_remesa_ordencargue.id_remesa AS remesa, 
      cmx_manifiesto.id AS manifiesto, 
      cmx_plan_ruta.cod_plan AS plan_ruta, 
      cmx_remesa.fecha_creacion, 
      cmx_remesa.usuario_creacion, 
      cmx_trazabilidad_proceso.referencia
      FROM cmx_remesa
      INNER JOIN  cmx_manifiesto_remesa ON cmx_manifiesto_remesa.id_remesa = cmx_remesa.id
      INNER JOIN  cmx_manifiesto ON cmx_manifiesto.id = cmx_manifiesto_remesa.id_manifiesto
      INNER JOIN  cmx_remesa_ordencargue ON cmx_remesa_ordencargue.id_remesa = cmx_remesa.id
      INNER JOIN  cmx_orden_cargue ON cmx_orden_cargue.id = cmx_remesa_ordencargue.id_orden_cargue
      INNER JOIN  cmx_cotizaciones_serviciocliente ON cmx_cotizaciones_serviciocliente.id_cliente = cmx_orden_cargue.cli_id
      INNER JOIN  cmx_solicitudes_pedidos ON cmx_solicitudes_pedidos.solicitud_id = cmx_orden_cargue.mer_idservicio
      INNER JOIN  cmx_trazabilidad_proceso ON cmx_trazabilidad_proceso.numdoc = cmx_solicitudes_pedidos.pedido_id
      INNER JOIN  cmx_solicitud_vehiculo2 ON cmx_orden_cargue.mer_idservicio = cmx_solicitud_vehiculo2.nundoc_solicitud
      LEFT JOIN   cmx_inicio_ruta ON cmx_inicio_ruta.num_manifiesto = cmx_manifiesto.id
      LEFT JOIN   cmx_plan_ruta ON cmx_plan_ruta.cod_plan = cmx_inicio_ruta.cod_plan
      WHERE cmx_cotizaciones_serviciocliente.id_cliente = :cliente
      AND cmx_solicitud_vehiculo2.nundoc_solicitud = :solicitud
      -- AND cmx_orden_cargue.fecha_orden BETWEEN :fecha_inicio AND :fecha_fin
      -- AND cmx_trazabilidad_proceso.fecha_creacion BETWEEN :fecha_inicio AND :fecha_fin
      GROUP BY cmx_orden_cargue.id");
      $sql->bindParam(':cliente', $cliente);
      $sql->bindParam(':solicitud', $numdoc_solicitud);
      // $sql->bindParam(':fecha_inicio', $fecha_inicial);
      // $sql->bindParam(':fecha_fin', $fecha_final);
      $sql->execute();
      $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
      if ($resultados) {
        $response = ['status' => 200, 'result' => $resultados];
      } else {
        $response = ['status' => 305, 'result' => ''];
      }
    }

    return $response;
  }


  function Cordenadas_plan_ruta($codigo_pla, $manifiesto, $referencia)
  {
    // Consulta inicial para obtener coordenadas
    $sql_cordenadas = " SELECT *, 
            cmx_planruta_detalle.latitud as latitud_municipio, 
            cmx_planruta_detalle.longitud as longitud_municipio, 
            cmx_planruta_detalle.nombre_punto as nombre_punto_control
        FROM cmx_plan_ruta
        INNER JOIN cmx_rutas ON cmx_rutas.id = cmx_plan_ruta.cod_ruta
        INNER JOIN cmx_planruta_detalle ON cmx_planruta_detalle.cod_plan = cmx_plan_ruta.cod_plan
        INNER JOIN cmx_municipios ON cmx_municipios.id = cmx_planruta_detalle.cod_ciudad
        WHERE cmx_plan_ruta.cod_plan = :cod_plan
        AND cmx_planruta_detalle.tipo_punto = 'punto geografico'";

    // Preparar la consulta
    $stmt = $this->_db3->prepare($sql_cordenadas);
    $stmt->bindParam(":cod_plan", $codigo_pla);
    $stmt->execute();
    $cordenadas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Consulta para obtener el punto actual de seguimiento
    $sql_codigo = " SELECT cmx_inicio_ruta.cod_inicio
        FROM cmx_plan_ruta
        INNER JOIN cmx_rutas ON cmx_rutas.id = cmx_plan_ruta.cod_ruta
        INNER JOIN cmx_planruta_detalle ON cmx_planruta_detalle.cod_plan = cmx_plan_ruta.cod_plan
        INNER JOIN cmx_municipios ON cmx_municipios.id = cmx_planruta_detalle.cod_ciudad
        INNER JOIN cmx_inicio_ruta ON cmx_inicio_ruta.cod_plan = cmx_plan_ruta.cod_plan
        WHERE cmx_plan_ruta.cod_plan = :cod_plan
        AND cmx_inicio_ruta.num_manifiesto = :num_manifiesto
        AND cmx_planruta_detalle.tipo_punto = 'punto geografico'
        LIMIT 1
    ";

    // Preparar y ejecutar la consulta
    $stmt = $this->_db3->prepare($sql_codigo);
    $stmt->bindParam(":cod_plan", $codigo_pla);
    $stmt->bindParam(":num_manifiesto", $manifiesto);
    $stmt->execute();
    $codigo = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($codigo) {
      // Consulta para obtener el punto actual basado en el cod_inicio
      $sql_punto = "SELECT cmx_iniruta_ubicacion.latitud as latitud_actual, 
                   cmx_iniruta_ubicacion.longitud as longitud_actual
            FROM cmx_iniruta_ubicacion
            INNER JOIN cmx_inicio_ruta ON cmx_inicio_ruta.cod_inicio = cmx_iniruta_ubicacion.cod_ini_ruta
            INNER JOIN cmx_plan_ruta ON cmx_plan_ruta.cod_plan = cmx_inicio_ruta.cod_plan
            INNER JOIN cmx_rutas ON cmx_rutas.id = cmx_plan_ruta.cod_ruta
            WHERE cmx_inicio_ruta.cod_inicio = :cod_inicio
            ORDER BY cmx_iniruta_ubicacion.id DESC
            LIMIT 1
        ";

      $stmt = $this->_db3->prepare($sql_punto);
      $stmt->bindParam(":cod_inicio", $codigo['cod_inicio']);
      $stmt->execute();
      $sql_punto = $stmt->fetchAll(PDO::FETCH_ASSOC);

      // Consulta para cargar las notas de seguimiento vehicular
      $sql_result = "SELECT IFNULL(m.municipio,pc.punto_controlador) AS Municipio,a.tipo_seguimiento,
      CONCAT(a.fecha,' - ',a.hora) AS fecha_nota,a.observacion, a.usuario,ppr.nom_punto,IFNULL(prd.nombre_punto,pc.punto_controlador) AS nombre_punto,
      a.novedad,pc.punto_controlador,IFNULL(prd.id,pc.id) AS id, p.nombre_plan
      FROM cmx_inicio_ruta ru
      INNER JOIN cmx_salida_vehiculo sali ON ru.num_manifiesto=sali.num_manifiesto
      INNER JOIN cmx_inicio_seguimiento a ON ru.cod_inicio=a.cod_ini_ruta
      LEFT JOIN cmx_seguimiento_servicio b ON a.id=b.id_seguimiento
      LEFT JOIN cmx_municipios m ON a.detalle_tipo=m.id
      LEFT JOIN cmx_puntos_controlador pc ON a.id=pc.seguimiento_id
      LEFT JOIN cmx_planruta_detalle prd ON prd.cod_punto=a.codigo_punto
      LEFT JOIN cmx_para_punto_ruta ppr ON ppr.id=a.codigo_punto
      LEFT JOIN cmx_plan_ruta  p ON ru.cod_plan=p.cod_plan
      WHERE ru.num_manifiesto=:id
      GROUP BY a.id ORDER BY a.id ASC";

      $stmt = $this->_db3->prepare($sql_result);
      $stmt->bindParam(":id",  $manifiesto);
      $stmt->execute();
      $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

      // Preparar los datos para la respuesta
      if (empty($result)) {
        $dato = ['result' => '', 'referencia' => $referencia];
      } else {
        $dato = ['result' => $result, 'referencia' => $referencia];
      }

      $cordenadas_final = [];
      if (isset($sql_punto['latitud_actual']) && isset($sql_punto['longitud_actual'])) {
        foreach ($cordenadas as $value) {
          $cordenadas_final[] = [
            'lat' => $value['latitud_municipio'],
            'lng' => $value['longitud_municipio'],
            'nombre_punto' => $value['nombre_punto_control'],
            'latitud_origen' => $value['latitud_origen'],
            'latitud_destino' => $value['latitud_destino'],
            'longitud_origen' => $value['longitud_origen'],
            'longitud_destino' => $value['longitud_destino'],
            'latitud_actual' => $sql_punto['latitud_actual'],
            'longitud_actual' => $sql_punto['longitud_actual'],
          ];
        }
      } else {
        foreach ($cordenadas as $value) {
          $cordenadas_final[] = [
            'lat' => $value['latitud_municipio'],
            'lng' => $value['longitud_municipio'],
            'nombre_punto' => $value['nombre_punto_control'],
            'latitud_origen' => $value['latitud_origen'],
            'latitud_destino' => $value['latitud_destino'],
            'longitud_origen' => $value['longitud_origen'],
            'longitud_destino' => $value['longitud_destino'],
            'latitud_actual' => '',
            'longitud_actual' => '',
          ];
        }
      }

      return [
        'cordenadas' => $cordenadas_final,
        'datos' => $dato
      ];
    }

    return null; // Si no hay datos
  }

  public function Listar_actividades_pedido($cliente, $numdoc, $solicitud_id)
  {
    $sql = $this->_db3->prepare("SELECT 
    cmx_detalle_opcion_trazabilidad.posicion,
    cmx_tipo_trazabilidad.nombre_tipo,
    cmx_tipo_opcion_trazabilidad.nombre_opcion,
    cmx_usuarios.nom_usuario,
    cmx_detalle_opcion_trazabilidad.fecha_inicio,
    cmx_detalle_opcion_trazabilidad.hora_inicio,
    cmx_detalle_opcion_trazabilidad.estado_actividad,
    cmx_tipo_trazabilidad.id AS proceso_id,
    cmx_tipo_opcion_trazabilidad.id AS actividad_id,
    cmx_detalle_opcion_trazabilidad.detalle_proceso AS num_proceso,
    cmx_trazabilidad_proceso.numdoc AS num_pedido,
    cmx_trazabilidad_proceso.referencia AS referencia_pedido,
    cmx_clientes.documento AS num_documento,
    cmx_clientes.nombre AS nombre_cliente,
    cmx_clientes.direccion AS direccion_cliente,
    cmx_clientes.telefono AS telefono_cliente,
    cmx_clientes.email AS email_cliente,
    cmx_clientes.encargado AS encargado_cliente,
    responsable.nom_usuario AS usuario_responsable_actividad
    FROM cmx_detalle_opcion_trazabilidad
    INNER JOIN  cmx_trazabilidad_proceso ON cmx_trazabilidad_proceso.numdoc = cmx_detalle_opcion_trazabilidad.numdoc_detalle_opcion
    INNER JOIN  cmx_tipo_opcion_trazabilidad ON cmx_tipo_opcion_trazabilidad.id = cmx_detalle_opcion_trazabilidad.detalle_proceso
    INNER JOIN  cmx_tipo_trazabilidad ON cmx_tipo_trazabilidad.id = cmx_tipo_opcion_trazabilidad.tipo_trazabilidad
    INNER JOIN  cmx_solicitudes_pedidos ON cmx_solicitudes_pedidos.pedido_id = cmx_trazabilidad_proceso.numdoc
    INNER JOIN  cmx_solicitud_vehiculo2 ON cmx_solicitudes_pedidos.solicitud_id = cmx_solicitud_vehiculo2.nundoc_solicitud
    INNER JOIN  cmx_cotizaciones_serviciocliente ON cmx_cotizaciones_serviciocliente.n_cotizacion = cmx_solicitud_vehiculo2.n_cotizacion
    INNER JOIN  cmx_usuario_cliente ON cmx_usuario_cliente.id_cliente = cmx_cotizaciones_serviciocliente.id_cliente
    INNER JOIN  cmx_usuarios ON cmx_usuarios.id = cmx_usuario_cliente.id_usuario
    INNER JOIN  cmx_usuarios AS responsable ON responsable.id = cmx_detalle_opcion_trazabilidad.usuario_responsable
    INNER JOIN  cmx_clientes ON cmx_clientes.id = cmx_usuario_cliente.id_cliente
    WHERE cmx_usuario_cliente.id_cliente =:cliente AND cmx_detalle_opcion_trazabilidad.numdoc_detalle_opcion =:numdoc
    GROUP BY cmx_detalle_opcion_trazabilidad.posicion
    ORDER BY cmx_detalle_opcion_trazabilidad.posicion ASC");

    $sql->bindParam(':cliente', $cliente);
    $sql->bindParam(':numdoc', $numdoc);
    $sql->execute();
    $result = $sql->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }

  public function Listar_detalles_pedido_actividad($cliente, $numdoc, $actividad_id)
  {
    $sql = $this->_db3->prepare("SELECT 
    cmx_pedidos_solicitudes_detalles.id,
    cmx_pedidos_solicitudes_detalles.num_pedido,
    cmx_pedidos_solicitudes_detalles.observacion,
    cmx_pedidos_solicitudes_detalles.documento,
    cmx_pedidos_solicitudes_detalles.nombre_archivo,
    cmx_pedidos_solicitudes_detalles.fecha,
    cmx_pedidos_solicitudes_detalles.usuario,
    cmx_tipo_trazabilidad.nombre_tipo,
    cmx_tipo_opcion_trazabilidad.nombre_opcion
    FROM cmx_pedidos_solicitudes_detalles
    INNER JOIN cmx_tipo_trazabilidad  ON cmx_tipo_trazabilidad.id = cmx_pedidos_solicitudes_detalles.parametro_id
    INNER JOIN cmx_tipo_opcion_trazabilidad  ON cmx_tipo_opcion_trazabilidad.id = cmx_pedidos_solicitudes_detalles.punto_opcion_id
    INNER JOIN cmx_trazabilidad_proceso  ON cmx_trazabilidad_proceso.numdoc = cmx_pedidos_solicitudes_detalles.num_pedido
    INNER JOIN cmx_usuario_cliente  ON cmx_usuario_cliente.id_cliente = cmx_trazabilidad_proceso.cliente
    WHERE cmx_usuario_cliente.id_cliente = :cliente
        AND cmx_pedidos_solicitudes_detalles.num_pedido = :numdoc
        AND cmx_pedidos_solicitudes_detalles.punto_opcion_id = :actividad_id
        AND cmx_pedidos_solicitudes_detalles.se_publica = 'SI'
    GROUP BY cmx_pedidos_solicitudes_detalles.id
    ORDER BY cmx_pedidos_solicitudes_detalles.id ASC");

    $sql->bindParam(':cliente', $cliente);
    $sql->bindParam(':numdoc', $numdoc);
    $sql->bindParam(':actividad_id', $actividad_id);
    $sql->execute();
    $result = $sql->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }


  public function Listar_despachos_activos($cliente)
  {
    $fecha_inicial = date('Y-m-d');
    $fecha_final = date('Y-m-d');
    $response = [];
    $sql = $this->_db3->prepare("SELECT 
    cmx_orden_cargue.id AS orden_cargue, 
    cmx_remesa_ordencargue.id_remesa AS remesa, 
    cmx_manifiesto.id AS manifiesto, 
    cmx_plan_ruta.cod_plan AS plan_ruta, 
    cmx_remesa.fecha_creacion, 
    cmx_remesa.usuario_creacion, 
    cmx_trazabilidad_proceso.referencia,
    cmx_plan_ruta.nombre_plan,
    cmx_manifiesto.placa,
    cmx_tipo_opcion_trazabilidad.nombre_opcion,
    cmx_tipo_opcion_trazabilidad.id AS trazabilidad_id,
    cmx_detalle_opcion_trazabilidad.estado_actividad
    FROM cmx_remesa
    LEFT JOIN cmx_manifiesto_remesa ON cmx_manifiesto_remesa.id_remesa = cmx_remesa.id
    LEFT JOIN cmx_manifiesto ON cmx_manifiesto.id = cmx_manifiesto_remesa.id_manifiesto
    LEFT JOIN cmx_remesa_ordencargue ON cmx_remesa_ordencargue.id_remesa = cmx_remesa.id
    LEFT JOIN cmx_orden_cargue ON cmx_orden_cargue.id = cmx_remesa_ordencargue.id_orden_cargue
    LEFT JOIN cmx_cotizaciones_serviciocliente ON cmx_cotizaciones_serviciocliente.id_cliente = cmx_orden_cargue.cli_id
    LEFT JOIN cmx_solicitudes_pedidos ON cmx_solicitudes_pedidos.solicitud_id = cmx_orden_cargue.mer_idservicio
    LEFT JOIN cmx_trazabilidad_proceso ON cmx_trazabilidad_proceso.numdoc = cmx_solicitudes_pedidos.pedido_id
    LEFT JOIN cmx_detalle_opcion_trazabilidad ON cmx_trazabilidad_proceso.numdoc=cmx_detalle_opcion_trazabilidad.numdoc_detalle_opcion
    LEFT JOIN cmx_tipo_opcion_trazabilidad ON cmx_detalle_opcion_trazabilidad.detalle_proceso=cmx_tipo_opcion_trazabilidad.id
    LEFT JOIN cmx_solicitud_vehiculo2 ON cmx_orden_cargue.mer_idservicio = cmx_solicitud_vehiculo2.nundoc_solicitud
    LEFT JOIN cmx_inicio_ruta ON cmx_inicio_ruta.num_manifiesto = cmx_manifiesto.id
    LEFT JOIN cmx_plan_ruta ON cmx_plan_ruta.cod_plan = cmx_inicio_ruta.cod_plan
    WHERE cmx_cotizaciones_serviciocliente.id_cliente = :cliente
    AND cmx_trazabilidad_proceso.fecha_creacion BETWEEN :fecha_inicio AND :fecha_fin
    AND cmx_tipo_opcion_trazabilidad.id IN (3, 4, 9, 10, 11, 12)  -- Números de actividades específicos
    AND cmx_detalle_opcion_trazabilidad.estado_actividad IN ('EN GESTION', 'COMPLETADO')  -- Estados específicos
    GROUP BY cmx_orden_cargue.id ORDER BY  cmx_trazabilidad_proceso.referencia DESC ");
    $sql->bindParam(':cliente', $cliente);
    $sql->bindParam(':fecha_inicio', $fecha_inicial);
    $sql->bindParam(':fecha_fin', $fecha_final);
    $sql->execute();
    $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
    if ($resultados) {
      $response = ['status' => 200, 'result' => $resultados];
    } else {
      $response = ['status' => 305, 'result' => ''];
    }
    return $response;
  }

  public function Tracking($filtro, $fecha_inicial, $fecha_final, $criterio, $cliente)
  {

    $response = [];
    if ($filtro == "Fecha") {
      // echo "ENTRO AQUI";
      $sql = $this->_db3->prepare("SELECT 
      cmx_orden_cargue.id AS orden_cargue, 
      cmx_remesa_ordencargue.id_remesa AS remesa, 
      cmx_manifiesto.id AS manifiesto, 
      cmx_plan_ruta.cod_plan AS plan_ruta, 
      cmx_remesa.fecha_creacion, 
      cmx_remesa.usuario_creacion,
      CONCAT(ori.municipio, ' - ', ori.depto) AS Origen, 
      CONCAT(des.municipio, ' - ', des.depto) AS Destino, 
      cmx_manifiesto.placa
      FROM cmx_remesa
      LEFT JOIN  cmx_manifiesto_remesa ON cmx_manifiesto_remesa.id_remesa = cmx_remesa.id
      LEFT JOIN  cmx_manifiesto ON cmx_manifiesto.id = cmx_manifiesto_remesa.id_manifiesto
      LEFT JOIN  cmx_remesa_ordencargue ON cmx_remesa_ordencargue.id_remesa = cmx_remesa.id
      LEFT JOIN  cmx_orden_cargue ON cmx_orden_cargue.id = cmx_remesa_ordencargue.id_orden_cargue
      LEFT JOIN  cmx_cotizaciones_serviciocliente ON cmx_cotizaciones_serviciocliente.id_cliente = cmx_orden_cargue.cli_id
      LEFT JOIN  cmx_solicitud_vehiculo2 ON cmx_orden_cargue.mer_idservicio = cmx_solicitud_vehiculo2.nundoc_solicitud
      LEFT JOIN  cmx_inicio_ruta ON cmx_inicio_ruta.num_manifiesto = cmx_manifiesto.id
      LEFT JOIN  cmx_plan_ruta ON cmx_plan_ruta.cod_plan = cmx_inicio_ruta.cod_plan
      LEFT JOIN cmx_municipios ori ON cmx_manifiesto.origen_viaje = ori.id
      LEFT JOIN cmx_municipios des ON cmx_manifiesto.destino_viaje = des.id
      WHERE cmx_cotizaciones_serviciocliente.id_cliente = :cliente
      AND cmx_orden_cargue.fecha_orden BETWEEN :fecha_inicio AND :fecha_fin
      GROUP BY cmx_orden_cargue.id");
      $sql->bindParam(':cliente', $cliente);
      $sql->bindParam(':fecha_inicio', $fecha_inicial);
      $sql->bindParam(':fecha_fin', $fecha_final);
      $sql->execute();
      $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
      if ($resultados) {
        $response = ['status' => 200, 'result' => $resultados];
      } else {
        $response = ['status' => 305, 'result' => ''];
      }
    } else if ($filtro == "Placa") {
      // echo "ENTRO AQUI";
      $sql = $this->_db3->prepare("SELECT 
      cmx_orden_cargue.id AS orden_cargue, 
      cmx_remesa_ordencargue.id_remesa AS remesa, 
      cmx_manifiesto.id AS manifiesto, 
      cmx_plan_ruta.cod_plan AS plan_ruta, 
      cmx_remesa.fecha_creacion, 
      cmx_remesa.usuario_creacion,
      CONCAT(ori.municipio, ' - ', ori.depto) AS Origen, 
      CONCAT(des.municipio, ' - ', des.depto) AS Destino, 
      cmx_manifiesto.placa
      /*cmx_trazabilidad_proceso.referencia*/
      FROM cmx_remesa
      LEFT JOIN  cmx_manifiesto_remesa ON cmx_manifiesto_remesa.id_remesa = cmx_remesa.id
      LEFT JOIN  cmx_manifiesto ON cmx_manifiesto.id = cmx_manifiesto_remesa.id_manifiesto
      LEFT JOIN  cmx_remesa_ordencargue ON cmx_remesa_ordencargue.id_remesa = cmx_remesa.id
      LEFT JOIN  cmx_orden_cargue ON cmx_orden_cargue.id = cmx_remesa_ordencargue.id_orden_cargue
      LEFT JOIN  cmx_cotizaciones_serviciocliente ON cmx_cotizaciones_serviciocliente.id_cliente = cmx_orden_cargue.cli_id
      /*LEFT JOIN  cmx_solicitudes_pedidos ON cmx_solicitudes_pedidos.solicitud_id = cmx_orden_cargue.mer_idservicio
      LEFT JOIN  cmx_trazabilidad_proceso ON cmx_trazabilidad_proceso.numdoc = cmx_solicitudes_pedidos.pedido_id*/
      LEFT JOIN  cmx_solicitud_vehiculo2 ON cmx_orden_cargue.mer_idservicio = cmx_solicitud_vehiculo2.nundoc_solicitud
      LEFT JOIN   cmx_inicio_ruta ON cmx_inicio_ruta.num_manifiesto = cmx_manifiesto.id
      LEFT JOIN   cmx_plan_ruta ON cmx_plan_ruta.cod_plan = cmx_inicio_ruta.cod_plan
      LEFT JOIN cmx_municipios ori ON cmx_manifiesto.origen_viaje = ori.id
      LEFT JOIN cmx_municipios des ON cmx_manifiesto.destino_viaje = des.id
      WHERE cmx_cotizaciones_serviciocliente.id_cliente = :cliente
     AND cmx_manifiesto.placa = :placa
      AND cmx_orden_cargue.fecha_orden BETWEEN :fecha_inicio AND :fecha_fin
      /*AND cmx_trazabilidad_proceso.fecha_creacion BETWEEN :fecha_inicio AND :fecha_fin*/
      GROUP BY cmx_orden_cargue.id");
      $sql->bindParam(':cliente', $cliente);
      $sql->bindParam(':placa', $criterio);
      $sql->bindParam(':fecha_inicio', $fecha_inicial);
      $sql->bindParam(':fecha_fin', $fecha_final);
      $sql->execute();
      $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
      if ($resultados) {
        $response = ['status' => 200, 'result' => $resultados];
      } else {
        $response = ['status' => 305, 'result' => ''];
      }
    } else if ($filtro == "Pedido") {
      // echo "ENTRO AQUI";
      $sql = $this->_db3->prepare("SELECT 
      cmx_orden_cargue.id AS orden_cargue, 
      cmx_remesa_ordencargue.id_remesa AS remesa, 
      cmx_manifiesto.id AS manifiesto, 
      cmx_plan_ruta.cod_plan AS plan_ruta, 
      cmx_remesa.fecha_creacion, 
      cmx_remesa.usuario_creacion,
       CONCAT(ori.municipio, ' - ', ori.depto) AS Origen, 
      CONCAT(des.municipio, ' - ', des.depto) AS Destino, 
      cmx_manifiesto.placa
      /*cmx_trazabilidad_proceso.referencia*/
      FROM cmx_remesa
      LEFT JOIN  cmx_manifiesto_remesa ON cmx_manifiesto_remesa.id_remesa = cmx_remesa.id
      LEFT JOIN  cmx_manifiesto ON cmx_manifiesto.id = cmx_manifiesto_remesa.id_manifiesto
      LEFT JOIN  cmx_remesa_ordencargue ON cmx_remesa_ordencargue.id_remesa = cmx_remesa.id
      LEFT JOIN  cmx_orden_cargue ON cmx_orden_cargue.id = cmx_remesa_ordencargue.id_orden_cargue
      LEFT JOIN  cmx_cotizaciones_serviciocliente ON cmx_cotizaciones_serviciocliente.id_cliente = cmx_orden_cargue.cli_id
      /*LEFT JOIN  cmx_solicitudes_pedidos ON cmx_solicitudes_pedidos.solicitud_id = cmx_orden_cargue.mer_idservicio
      LEFT JOIN  cmx_trazabilidad_proceso ON cmx_trazabilidad_proceso.numdoc = cmx_solicitudes_pedidos.pedido_id*/
      LEFT JOIN  cmx_solicitud_vehiculo2 ON cmx_orden_cargue.mer_idservicio = cmx_solicitud_vehiculo2.nundoc_solicitud
      LEFT JOIN   cmx_inicio_ruta ON cmx_inicio_ruta.num_manifiesto = cmx_manifiesto.id
      LEFT JOIN   cmx_plan_ruta ON cmx_plan_ruta.cod_plan = cmx_inicio_ruta.cod_plan
            LEFT JOIN cmx_municipios ori ON cmx_manifiesto.origen_viaje = ori.id
      LEFT JOIN cmx_municipios des ON cmx_manifiesto.destino_viaje = des.id
      WHERE cmx_cotizaciones_serviciocliente.id_cliente = :cliente
      AND cmx_orden_cargue.id = :orden_cargue
      AND cmx_orden_cargue.fecha_orden BETWEEN :fecha_inicio AND :fecha_fin
      /*AND cmx_trazabilidad_proceso.fecha_creacion BETWEEN :fecha_inicio AND :fecha_fin*/
      GROUP BY cmx_orden_cargue.id");
      $sql->bindParam(':cliente', $cliente);
      $sql->bindParam(':orden_cargue', $criterio);
      $sql->bindParam(':fecha_inicio', $fecha_inicial);
      $sql->bindParam(':fecha_fin', $fecha_final);
      $sql->execute();
      $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
      if ($resultados) {
        $response = ['status' => 200, 'result' => $resultados];
      } else {
        $response = ['status' => 305, 'result' => ''];
      }
    } else if ($filtro == "Remesa") {
      // echo "ENTRO AQUI";
      $sql = $this->_db3->prepare("SELECT 
      cmx_orden_cargue.id AS orden_cargue, 
      cmx_remesa_ordencargue.id_remesa AS remesa, 
      cmx_manifiesto.id AS manifiesto, 
      cmx_plan_ruta.cod_plan AS plan_ruta, 
      cmx_remesa.fecha_creacion, 
      cmx_remesa.usuario_creacion,
       CONCAT(ori.municipio, ' - ', ori.depto) AS Origen, 
      CONCAT(des.municipio, ' - ', des.depto) AS Destino, 
      cmx_manifiesto.placa
      /*cmx_trazabilidad_proceso.referencia*/
      FROM cmx_remesa
      LEFT JOIN  cmx_manifiesto_remesa ON cmx_manifiesto_remesa.id_remesa = cmx_remesa.id
      LEFT JOIN  cmx_manifiesto ON cmx_manifiesto.id = cmx_manifiesto_remesa.id_manifiesto
      LEFT JOIN  cmx_remesa_ordencargue ON cmx_remesa_ordencargue.id_remesa = cmx_remesa.id
      LEFT JOIN  cmx_orden_cargue ON cmx_orden_cargue.id = cmx_remesa_ordencargue.id_orden_cargue
      LEFT JOIN  cmx_cotizaciones_serviciocliente ON cmx_cotizaciones_serviciocliente.id_cliente = cmx_orden_cargue.cli_id
      /*LEFT JOIN  cmx_solicitudes_pedidos ON cmx_solicitudes_pedidos.solicitud_id = cmx_orden_cargue.mer_idservicio
      LEFT JOIN  cmx_trazabilidad_proceso ON cmx_trazabilidad_proceso.numdoc = cmx_solicitudes_pedidos.pedido_id*/
      LEFT JOIN  cmx_solicitud_vehiculo2 ON cmx_orden_cargue.mer_idservicio = cmx_solicitud_vehiculo2.nundoc_solicitud
      LEFT JOIN   cmx_inicio_ruta ON cmx_inicio_ruta.num_manifiesto = cmx_manifiesto.id
      LEFT JOIN   cmx_plan_ruta ON cmx_plan_ruta.cod_plan = cmx_inicio_ruta.cod_plan
            LEFT JOIN cmx_municipios ori ON cmx_manifiesto.origen_viaje = ori.id
      LEFT JOIN cmx_municipios des ON cmx_manifiesto.destino_viaje = des.id
      WHERE cmx_cotizaciones_serviciocliente.id_cliente = :cliente
     AND cmx_remesa.id = :numdoc_remesa
      AND cmx_orden_cargue.fecha_orden BETWEEN :fecha_inicio AND :fecha_fin
      /*AND cmx_trazabilidad_proceso.fecha_creacion BETWEEN :fecha_inicio AND :fecha_fin*/
      GROUP BY cmx_orden_cargue.id");
      $sql->bindParam(':cliente', $cliente);
      $sql->bindParam(':numdoc_remesa', $criterio);
      $sql->bindParam(':fecha_inicio', $fecha_inicial);
      $sql->bindParam(':fecha_fin', $fecha_final);
      $sql->execute();
      $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
      if ($resultados) {
        $response = ['status' => 200, 'result' => $resultados];
      } else {
        $response = ['status' => 305, 'result' => ''];
      }
    }
    return $response;
  }
}
