<?php
class PantallasModel extends Model
{

  public function __construct()
  {
    parent::__construct();
  }

  public function Listar_Datos_Parametros()
  {
    $response = [];
    $sql = $this->_db3->prepare("SELECT * FROM cmx_modulos");
    $sql->execute();
    $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
    $sql_menu = $this->_db3->prepare("SELECT * FROM cmx_submenu");
    $sql_menu->execute();
    $resultados_menu = $sql_menu->fetchAll(PDO::FETCH_ASSOC);
    $response = [
      "resultados" => $resultados,
      "resultados_menu" => $resultados_menu,
    ];
    return $response;
  }

  public function Listar_Pantallas_Trabajo()
  {
    $response = [];
    $sql = $this->_db3->prepare("SELECT * FROM cmx_pantallas");
    $sql->execute();
    $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
    $response = [
      "resultados" => $resultados,
    ];
    return $response;
  }

  public function Guardar_Pantalla($modulo, $menu, $nombre_pantalla, $estado_pantalla, $descripcion_pantalla)
  {
    $fecha = date("Y-m-d");
    $hora = date("H:i:s");
    $response = []; // Inicializa la variable de respuesta
    $id_usuario = $_SESSION["usuario"]["id_usuario"];
    $user = $_SESSION["usuario"]["nom_usuario"];
    $empresa_id = $_SESSION["usuario"]["empresa_id"];

    try {
      $this->_db3->beginTransaction();

      // Consultar maestro de pantallas
      $sql_maestro_pantallas = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo = 'PANTALLAS' AND numero_actual > numero_inicial AND empresa_id = :empresa_id");
      $sql_maestro_pantallas->bindParam(':empresa_id', $empresa_id, PDO::PARAM_INT);
      $sql_maestro_pantallas->execute();
      $resultado_consecutivo = $sql_maestro_pantallas->fetch(PDO::FETCH_ASSOC);

      if (!$resultado_consecutivo) {
        throw new Exception("No se encontró un número de documento válido en el maestro de pantallas.");
      }

      $numdoc_cabecera = $resultado_consecutivo['numero_actual'];
      $numdoc_actualizar_cabecera = $numdoc_cabecera + 1;

      // Actualizar maestro de pantallas
      $sql_update_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual = :numero_actual WHERE tipo = 'PANTALLAS' AND empresa_id = :empresa_id");
      $sql_update_maestro->bindParam(':numero_actual', $numdoc_actualizar_cabecera, PDO::PARAM_INT);
      $sql_update_maestro->bindParam(':empresa_id', $empresa_id, PDO::PARAM_INT);
      $sql_update_maestro->execute();

      // Insertar nueva pantalla
      $sql_insert_pantalla = $this->_db3->prepare("INSERT INTO cmx_pantallas (modulo_id, menu_id, nombre_pantalla, codigo_pantalla, descripcion_pantalla, estado_pantalla, fecha, hora, usuario, empresa_id)
              VALUES (:modulo_id, :menu_id, :nombre_pantalla, :codigo_pantalla, :descripcion_pantalla, :estado_pantalla, :fecha, :hora, :usuario, :empresa_id)");
      $sql_insert_pantalla->bindParam(':modulo_id', $modulo, PDO::PARAM_INT);
      $sql_insert_pantalla->bindParam(':menu_id', $menu, PDO::PARAM_INT);
      $sql_insert_pantalla->bindParam(':nombre_pantalla', $nombre_pantalla, PDO::PARAM_STR);
      $sql_insert_pantalla->bindParam(':codigo_pantalla', $numdoc_cabecera, PDO::PARAM_STR);
      $sql_insert_pantalla->bindParam(':descripcion_pantalla', $descripcion_pantalla, PDO::PARAM_STR);
      $sql_insert_pantalla->bindParam(':estado_pantalla', $estado_pantalla, PDO::PARAM_STR);
      $sql_insert_pantalla->bindParam(':fecha', $fecha, PDO::PARAM_STR);
      $sql_insert_pantalla->bindParam(':hora', $hora, PDO::PARAM_STR);
      $sql_insert_pantalla->bindParam(':usuario', $user, PDO::PARAM_STR);
      $sql_insert_pantalla->bindParam(':empresa_id', $empresa_id, PDO::PARAM_INT);
      $sql_insert_pantalla->execute();

      // Confirmar la transacción
      $this->_db3->commit();

      $response = ['success' => true, 'message' => 'Pantalla guardada correctamente.'];
    } catch (\Throwable $th) {
      // Algo salió mal, se hace rollback
      $this->_db3->rollBack();

      // Registrar el error en un archivo de log
      $errorMessage = "Error en la transacción al guardar la pantalla: " . $th->getMessage() . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
      $logFilePath = 'error_log.txt'; // Ajusta la ruta según la estructura de tu proyecto
      error_log($errorMessage, 3, $logFilePath);

      // Mostrar un mensaje amigable al usuario
      $response = ['success' => false, 'message' => 'Ha ocurrido un error al guardar la pantalla. Por favor, inténtelo nuevamente más tarde.'];
    }

    return $response;
  }

  public function Guardar_Ventana($pantalla, $nombre_ventana, $estadoVentana, $ordenventana, $descripcion_ventana)
  {
    $fecha = date("Y-m-d");
    $hora = date("H:i:s");
    $response = []; // Inicializa la variable de respuesta
    $id_usuario = $_SESSION["usuario"]["id_usuario"];
    $user = $_SESSION["usuario"]["nom_usuario"];
    $empresa_id = $_SESSION["usuario"]["empresa_id"];

    try {
      $this->_db3->beginTransaction();

      // Consultar maestro de ventanas
      $sql_maestro_ventanas = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo = 'VENTANAS' AND numero_actual > numero_inicial AND empresa_id = :empresa_id");
      $sql_maestro_ventanas->bindParam(':empresa_id', $empresa_id, PDO::PARAM_INT);
      $sql_maestro_ventanas->execute();
      $resultado_consecutivo = $sql_maestro_ventanas->fetch(PDO::FETCH_ASSOC);

      if (!$resultado_consecutivo) {
        throw new Exception("No se encontró un número de documento válido en el maestro de ventanas.");
      }

      $numdoc_cabecera = $resultado_consecutivo['numero_actual'];
      $numdoc_actualizar_cabecera = $numdoc_cabecera + 1;

      // Actualizar maestro de ventanas
      $sql_update_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual = :numero_actual WHERE tipo = 'VENTANAS' AND empresa_id = :empresa_id");
      $sql_update_maestro->bindParam(':numero_actual', $numdoc_actualizar_cabecera, PDO::PARAM_INT);
      $sql_update_maestro->bindParam(':empresa_id', $empresa_id, PDO::PARAM_INT);
      $sql_update_maestro->execute();

      // Insertar nueva ventana
      $sql_insert_ventana = $this->_db3->prepare("INSERT INTO cmx_ventanas (nombre_ventana, codigo_ventana, fecha, hora, usuario, observacion_ventana, empresa_id)
              VALUES (:nombre_ventana, :codigo_ventana, :fecha, :hora, :usuario, :observacion_ventana, :empresa_id)");
      $sql_insert_ventana->bindParam(':nombre_ventana', $nombre_ventana, PDO::PARAM_STR);
      $sql_insert_ventana->bindParam(':codigo_ventana', $numdoc_cabecera, PDO::PARAM_INT);
      $sql_insert_ventana->bindParam(':fecha', $fecha, PDO::PARAM_STR);
      $sql_insert_ventana->bindParam(':hora', $hora, PDO::PARAM_STR);
      $sql_insert_ventana->bindParam(':usuario', $user, PDO::PARAM_STR);
      $sql_insert_ventana->bindParam(':observacion_ventana', $descripcion_ventana, PDO::PARAM_STR);
      $sql_insert_ventana->bindParam(':empresa_id', $empresa_id, PDO::PARAM_INT);
      $sql_insert_ventana->execute();

      // Obtener el último ID insertado
      $lastInsertId = $this->_db3->lastInsertId();

      // Insertar en cmx_pantallas_menu
      $sql_insert_detalle_ventana = $this->_db3->prepare("INSERT INTO cmx_pantallas_menu (pantalla_id, ventana_id, orden_ventana, estado_ventana, fecha, hora, usuario, empresa_id)
              VALUES (:pantalla_id, :ventana_id, :orden_ventana, :estado_ventana, :fecha, :hora, :usuario, :empresa_id)");
      $sql_insert_detalle_ventana->bindParam(':pantalla_id', $pantalla, PDO::PARAM_INT);
      $sql_insert_detalle_ventana->bindParam(':ventana_id', $lastInsertId, PDO::PARAM_INT);
      $sql_insert_detalle_ventana->bindParam(':orden_ventana', $ordenventana, PDO::PARAM_INT);
      $sql_insert_detalle_ventana->bindParam(':estado_ventana', $estadoVentana, PDO::PARAM_STR);
      $sql_insert_detalle_ventana->bindParam(':fecha', $fecha, PDO::PARAM_STR);
      $sql_insert_detalle_ventana->bindParam(':hora', $hora, PDO::PARAM_STR);
      $sql_insert_detalle_ventana->bindParam(':usuario', $user, PDO::PARAM_STR);
      $sql_insert_detalle_ventana->bindParam(':empresa_id', $empresa_id, PDO::PARAM_INT);
      $sql_insert_detalle_ventana->execute();

      // Confirmar la transacción
      $this->_db3->commit();

      $response = ['success' => true, 'message' => 'Ventana guardada correctamente.', 'lastInsertId' => $lastInsertId];
    } catch (\Throwable $th) {
      // Algo salió mal, se hace rollback
      $this->_db3->rollBack();

      // Registrar el error en un archivo de log
      $errorMessage = "Error en la transacción al guardar la ventana: " . $th->getMessage() . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
      $logFilePath = 'error_log.txt'; // Ajusta la ruta según la estructura de tu proyecto
      error_log($errorMessage, 3, $logFilePath);

      // Mostrar un mensaje amigable al usuario
      $response = ['success' => false, 'message' => 'Ha ocurrido un error al guardar la ventana. Por favor, inténtelo nuevamente más tarde.'];
    }

    return $response;
  }
  // Filtros

  public function Listar_ventanas_Trabajo()
  {
    $response = [];
    $sql = $this->_db3->prepare("SELECT v.id AS ventana_id,v.nombre_ventana,p.nombre_pantalla FROM cmx_ventanas v
    INNER JOIN cmx_pantallas_menu pm ON v.id=pm.ventana_id
    INNER JOIN cmx_pantallas p ON pm.pantalla_id=p.id");
    $sql->execute();
    $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
    $response = [
      "resultados" => $resultados,
    ];
    return $response;
  }

  public function Guardar_Filtro($ventana, $nombre_filtro, $estadoFiltro, $descripcion_filtro, $tipo_campo, $label, $opcionesInput)
  {
    $response = []; // Inicializa la variable de respuesta
    $id_usuario = $_SESSION["usuario"]["id_usuario"];
    $user = $_SESSION["usuario"]["nom_usuario"];
    $empresa_id = $_SESSION["usuario"]["empresa_id"];
    $fecha = date("Y-m-d");
    $hora = date("H:i:s");

    try {

      $this->_db3->beginTransaction();

      // Consultar maestro de ventanas
      $sql_maestro_ventanas = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo = 'FILTROS' AND numero_actual > numero_inicial AND empresa_id = :empresa_id");
      $sql_maestro_ventanas->bindParam(':empresa_id', $empresa_id, PDO::PARAM_INT);
      $sql_maestro_ventanas->execute();
      $resultado_consecutivo = $sql_maestro_ventanas->fetch(PDO::FETCH_ASSOC);

      if (!$resultado_consecutivo) {
        throw new Exception("No se encontró un número de documento válido en el maestro de ventanas.");
      }

      $numdoc_cabecera = $resultado_consecutivo['numero_actual'];
      $numdoc_actualizar_cabecera = $numdoc_cabecera + 1;

      // Actualizar maestro de ventanas
      $sql_update_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual = :numero_actual WHERE tipo = 'FILTROS' AND empresa_id = :empresa_id");
      $sql_update_maestro->bindParam(':numero_actual', $numdoc_actualizar_cabecera, PDO::PARAM_INT);
      $sql_update_maestro->bindParam(':empresa_id', $empresa_id, PDO::PARAM_INT);
      $sql_update_maestro->execute();

      // Insertar Filtro
      $parametros = null;
      $sql_insert_filtro = $this->_db3->prepare("INSERT INTO cmx_filtros (codigo_filtro,nombre_filtro,tipo_campo,label,parametros,estado_filtro,descripcion_filtro,usuario,fecha,hora,empresa_id)
          VALUE (:codigo_filtro,:nombre_filtro,:tipo_campo,:label,:parametros,:estado_filtro,:descripcion_filtro,:usuario,:fecha,:hora,:empresa_id)");
      $sql_insert_filtro->bindParam(':codigo_filtro', $numdoc_cabecera, PDO::PARAM_INT);
      $sql_insert_filtro->bindParam(':nombre_filtro', $nombre_filtro, PDO::PARAM_STR);
      $sql_insert_filtro->bindParam(':tipo_campo', $tipo_campo, PDO::PARAM_STR);
      $sql_insert_filtro->bindParam(':label', $label, PDO::PARAM_STR);
      $sql_insert_filtro->bindParam(':parametros', $parametros, PDO::PARAM_INT);
      $sql_insert_filtro->bindParam(':estado_filtro', $estadoFiltro, PDO::PARAM_STR);
      $sql_insert_filtro->bindParam(':descripcion_filtro', $descripcion_filtro, PDO::PARAM_STR);
      $sql_insert_filtro->bindParam(':usuario', $user, PDO::PARAM_STR);
      $sql_insert_filtro->bindParam(':fecha', $fecha, PDO::PARAM_STR);
      $sql_insert_filtro->bindParam(':hora', $hora, PDO::PARAM_STR);
      $sql_insert_filtro->bindParam(':empresa_id', $empresa_id, PDO::PARAM_INT);

      $sql_insert_filtro->execute();

      // Obtener el último ID insertado
      $lastInsertId = $this->_db3->lastInsertId();

      // Insertar opciones en `opciones_select` si el campo es SELECT
      if ($tipo_campo == "select" && !empty($opcionesInput)) {
        $sqlOpciones = "INSERT INTO cmx_filtro_opcion (filtro_id, opcion,usuario,fecha,hora,estado_opcion,empresa_id) VALUES (:filtro_id, :opcion,:usuario,:fecha,:hora,:estado_opcion,:empresa_id)";
        $stmtOpciones = $this->_db3->prepare($sqlOpciones);

        foreach ($opcionesInput as $opcion) {
          $stmtOpciones->execute([':filtro_id' => $lastInsertId, ':opcion' => $opcion, ':usuario' => $user, ':fecha' => $fecha, ':hora' => $hora, ':estado_opcion' => $estadoFiltro, ':empresa_id' => $empresa_id]); // Agregar el parámetro 'empresa_id',hora,estado_opcion,empresa_id]);
        }
      }

      //Insertar relacion con ventana de trabajo
      $sql_insert_ventana_filtro = $this->_db3->prepare("INSERT INTO cmx_ventana_filtro (ventena_id,filtro_id,estado_ventana_filtro,usuario,fecha,hora,empresa_id)
      VALUE (:ventena_id,:filtro_id,:estado_ventana_filtro,:usuario,:fecha,:hora,:empresa_id)");
      $sql_insert_ventana_filtro->bindParam(':ventena_id', $ventana, PDO::PARAM_INT);
      $sql_insert_ventana_filtro->bindParam(':filtro_id', $lastInsertId, PDO::PARAM_INT);
      $sql_insert_ventana_filtro->bindParam(':estado_ventana_filtro', $estadoFiltro, PDO::PARAM_STR);
      $sql_insert_ventana_filtro->bindParam(':usuario', $user, PDO::PARAM_STR);
      $sql_insert_ventana_filtro->bindParam(':fecha', $fecha, PDO::PARAM_STR);
      $sql_insert_ventana_filtro->bindParam(':hora', $hora, PDO::PARAM_STR);
      $sql_insert_ventana_filtro->bindParam(':empresa_id', $empresa_id, PDO::PARAM_INT);
      $sql_insert_ventana_filtro->execute();

      // Confirmar la transacción
      $this->_db3->commit();
      $response = ['success' => true, 'message' => 'Filtro guardado correctamente.', 'lastInsertId' => $lastInsertId];
    } catch (\Throwable $th) {
      //throw $th;
      // Algo salió mal, se hace rollback
      $this->_db3->rollBack();

      // Registrar el error en un archivo de log
      $errorMessage = "Error en la transacción al guardar e filtro: " . $th->getMessage() . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
      $logFilePath = 'error_log.txt'; // Ajusta la ruta según la estructura de tu proyecto
      error_log($errorMessage, 3, $logFilePath);

      // Mostrar un mensaje amigable al usuario
      $response = ['success' => false, 'message' => 'Ha ocurrido un error al guardar el Filtro. Por favor, inténtelo nuevamente más tarde.'];
    }

    return $response;
  }
}
