<?php

session_start();

class empresaModel extends Model
{

  public function __construct()
  {
    parent::__construct();
  }

  public function Registrar_empresa($nit, $nomre_razonsocial, $repesentante, $digito_empresa)
  {
    $response = [];
    $fecha = date("Y-m-d");
    $hora = date("H-m-s");
    $user = $_SESSION["usuario"]["nom_usuario"];
    // Generar un código de 8 dígitos
    $codigo_generado = $this->generarCodigo(1);
    $estado = "ACTIVA";
    $sql = $this->_db3->prepare("INSERT INTO cmx_empresas (nombre_empresa,nit_empresa,digito_verificacion,representante,estado_empresa,cod_empresa,fecha,hora,usuario) 
    VALUES(:nombre_empresa,:nit_empresa,:digito_verificacion,:representante,:estado_empresa,:cod_empresa,:fecha,:hora,:usuario)");
    $sql->bindParam(':nombre_empresa', $nomre_razonsocial);
    $sql->bindParam(':nit_empresa', $nit);
    $sql->bindParam(':digito_verificacion', $digito_empresa);
    $sql->bindParam(':representante', $repesentante);
    $sql->bindParam(':estado_empresa', $estado);
    $sql->bindParam(':cod_empresa', $codigo_generado);
    $sql->bindParam(':fecha', $fecha);
    $sql->bindParam(':hora', $hora);
    $sql->bindParam(':usuario', $user);
    $sql->execute();
    if ($sql) {
      $response = ['numero' => 200, 'mensaje' => 'Empresa registarda exitosamente en Nexosapp.'];
    } else {
      $response = ['numero' => 400, 'mensaje' => 'Empresa no registarda exitosamente en Nexosapp.'];
    }
    return $response;
  }


  function Listar_empresas()
  {
    $sql = $this->_db3->prepare("SELECT * FROM cmx_empresas");
    $sql->execute();
    $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
    return $resultado;
  }


  public function Guardar_agencias($empresa, $nombre_agencia, $estado_agencia, $abreviatura)
  {
    $response = [];
    $fecha = date("Y-m-d");
    $hora = date("H-m-s");
    $user = $_SESSION["usuario"]["nom_usuario"];
    // Generar un código de 8 dígitos
    $codigo_generado = $this->generarCodigo(1);
    $sql = $this->_db3->prepare("INSERT INTO cmx_agencia (empresa,nombre_agencia,abreviatura,estado_agencia,codigo_agencia,fecha,hora,usuario) 
    VALUES(:empresa,:nombre_agencia,:abreviatura,:estado_agencia,:codigo_agencia,:fecha,:hora,:usuario)");
    $sql->bindParam(':empresa', $empresa);
    $sql->bindParam(':nombre_agencia', $nombre_agencia);
    $sql->bindParam(':abreviatura', $abreviatura);
    $sql->bindParam(':estado_agencia', $estado_agencia);
    $sql->bindParam(':codigo_agencia', $codigo_generado);
    $sql->bindParam(':fecha', $fecha);
    $sql->bindParam(':hora', $hora);
    $sql->bindParam(':usuario', $user);
    $sql->execute();
    if ($sql) {
      $response = ['numero' => 200, 'mensaje' => 'Agencia registarda exitosamente en Nexosapp.'];
    } else {
      $response = ['numero' => 400, 'mensaje' => 'Agencia no registarda exitosamente en Nexosapp.'];
    }
    return $response;
  }

  function generarCodigo($numero, $longitud = 5)
  {
    // Convierte el número a una cadena y rellena con ceros a la izquierda si es necesario
    return str_pad((string)$numero, $longitud, '0', STR_PAD_LEFT);
  }

  public function listar_agencias()
  {
    $sql = $this->_db3->prepare("SELECT a.nombre_agencia,e.nombre_empresa,a.id AS agencia_id  FROM cmx_agencia a 
    INNER JOIN cmx_empresas e ON a.empresa=e.id");
    $sql->execute();
    $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
    return $resultado;
  }

  public function Agregar_Ambientes($agencia, $ambiente_agencia, $proveedor, $url_conexion)
  {

    if ($proveedor == 'AVANSAT' && $ambiente_agencia == 'PRUEBA') {
      $sql = $this->_db3->prepare("INSERT INTO cmx_ambiente(agencia,nombre_ambiente,proveedor,URL_CONEXCION_PRUEBA,URL_CONSULTA_TERCERO_PRUEBA,URL_CONSULTA_VEHICULO_PRUEBA,URL_DOCUMENTO_PROPIETARIO_PRUEBA,URL_CONSULTA_PLACA_TRAILER_PRUEBA,URL_CONSULTA_DOCUMENTO_PROPIETARIO_TRAILER_PRUEBA,
      URL_CONSULTA_ORDEN_CARGUE_PRUEBA,URL_CONSULTA_CLIENTE_PRUEBA,URL_CONSULTA_PROPIETARIO_PRUEBA,URL_CONSULTA_POSEEDOR_PRUEBA,URL_CONSULTA_CONDUCTOR_PRUEBA,URL_CONSULTA_VEHICULOS_PRUEBA,URL_CONSULTA_TRAILER_PRUEBA,URL_CONSULTAR_ORDEN_CARGUE_PRUEBA,URL_CONSULTAR_ORDEN_CARGUE_REMESA_PRUEBA,
      URL_MEDIADO_ORDEN_CARGUE_PRUEBA,URL_MEDIADOR_REMESA_PRUEBA,URL_MEDIADOR_MANIFIESTO_PRUEBA,URL_MEDIADOR_CUMPLIDO_PRUEBA)VALUES(:agencia,:nombre_ambiente,:proveedor,:URL_CONEXCION_PRUEBA,:URL_CONSULTA_TERCERO_PRUEBA,:URL_CONSULTA_VEHICULO_PRUEBA,:URL_DOCUMENTO_PROPIETARIO_PRUEBA,
      :URL_CONSULTA_PLACA_TRAILER_PRUEBA,:URL_CONSULTA_DOCUMENTO_PROPIETARIO_TRAILER_PRUEBA,:URL_CONSULTA_ORDEN_CARGUE_PRUEBA,:URL_CONSULTA_CLIENTE_PRUEBA,:URL_CONSULTA_PROPIETARIO_PRUEBA,:URL_CONSULTA_POSEEDOR_PRUEBA,:URL_CONSULTA_CONDUCTOR_PRUEBA,:URL_CONSULTA_VEHICULOS_PRUEBA,
      :URL_CONSULTA_TRAILER_PRUEBA,:URL_CONSULTAR_ORDEN_CARGUE_PRUEBA,:URL_CONSULTAR_ORDEN_CARGUE_REMESA_PRUEBA,:URL_MEDIADO_ORDEN_CARGUE_PRUEBA,:URL_MEDIADOR_REMESA_PRUEBA,:URL_MEDIADOR_MANIFIESTO_PRUEBA,:URL_MEDIADOR_CUMPLIDO_PRUEBA)");
      $sql->bindParam(':agencia', $agencia);
      $sql->bindParam(':nombre_ambiente', $ambiente_agencia);
      $sql->bindParam(':proveedor', $proveedor);

      $sql->bindParam(':empresa', $empresa);
      $sql->bindParam(':empresa', $empresa);
      $sql->bindParam(':empresa', $empresa);
      $sql->bindParam(':empresa', $empresa);
      $sql->bindParam(':empresa', $empresa);
      $sql->bindParam(':empresa', $empresa);
      $sql->bindParam(':empresa', $empresa);
      $sql->bindParam(':empresa', $empresa);
      $sql->bindParam(':empresa', $empresa);
      $sql->execute();
    } else {
      # code...
    }


    // // Nombre de la tabla y campo antes del cual se añadirán las nuevas columnas
    // $tabla = "cmx_ambiente";
    // $campo_anterior = "nombre_ambiente";

    // // Inicializar array de columnas
    // $columnas = [];

    // // Construir las definiciones de las nuevas columnas
    // foreach ($nombre_url as $value) {
    //   // Agregar la definición de la columna al array
    //   $columnas[] = "$value VARCHAR(50) NULL";
    // }

    // try {
    //   // Establecer la conexión con PDO
    //   $conn = $this->_db3;
    //   $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    //   // Construir la consulta SQL para crear las columnas
    //   $sql = "ALTER TABLE $tabla ";
    //   foreach ($columnas as $columna) {
    //     $sql .= "ADD COLUMN $columna, ";
    //   }
    //   // Eliminar la coma adicional al final de la consulta
    //   $sql = rtrim($sql, ", ");

    //   // Ejecutar la consulta para crear las columnas
    //   $conn->exec($sql);
    //   // echo "Columnas creadas exitosamente";

    //   // Ahora puedes realizar la inserción en la misma tabla
    //   // Aquí deberías construir tu consulta de inserción y ejecutarla

    //   // Por ejemplo, si tienes una función para realizar la inserción
    //   $this->insertarDatos($tabla, $agencia, $ambiente_agencia, $nombre_url, $url_conexion);
    // } catch (PDOException $e) {
    //   echo "Error al crear las columnas: " . $e->getMessage();
    // }
  }

  // Función para insertar datos en la tabla
  // public function insertarDatos($tabla, $agencia, $ambiente_agencia, $nombre_url, $url_conexion)
  // {
  //   $response = [];
  //   $fecha = date("Y-m-d");
  //   $hora = date("H-m-s");
  //   $user = $_SESSION["usuario"]["nom_usuario"];
  //   $estado = "ACTIVO";
  //   try {
  //     // Establecer la conexión con PDO
  //     $conn = $this->_db3;
  //     $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  //     // Construir la consulta SQL de inserción
  //     $sql = "INSERT INTO $tabla (agencia, nombre_ambiente,estado_ambiente,usuario,hora,fecha";
  //     $sql .= implode(", ", $nombre_url); // Insertar los nombres de las nuevas columnas
  //     $sql .= ") VALUES (:agencia,:nombre_ambiente,:estado_ambiente,:usuario,:hora,:fecha";
  //     $sql .= implode(", ", array_fill(0, count($nombre_url), "?")); // Insertar marcadores de posición para los valores
  //     $sql .= ")";

  //     // Preparar la consulta
  //     $stmt = $conn->prepare($sql);

  //     // Bind de los valores
  //     $stmt->bindParam(':agencia', $agencia);
  //     $stmt->bindParam(':nombre_ambiente', $ambiente_agencia);
  //     $stmt->bindParam(':estado_ambiente', $estado);
  //     $stmt->bindParam(':usuario', $user);
  //     $stmt->bindParam(':hora', $hora);
  //     $stmt->bindParam(':fecha', $fecha);
  //     foreach ($nombre_url as $value) {
  //       $valor_url = $url_conexion[$value]; // Suponiendo que $url_conexion es un array asociativo
  //       $stmt->bindParam(":$valor_url", $value);
  //     }
  //     // foreach ($url_conexion as $key => $value) {
  //     //   $stmt->bindParam($key + 7, $value); // +3 porque los primeros dos parámetros son :agencia y :ambiente_agencia
  //     // }

  //     // Ejecutar la consulta
  //     $stmt->execute();

  //     // echo "Datos insertados correctamente";
  //     if ($stmt) {
  //       $response = ['numero' => 200, 'mensaje' => 'Ambiente registardo exitosamente en Nexosapp.'];
  //     } else {
  //       $response = ['numero' => 400, 'mensaje' => 'Ambiente no registardo exitosamente en Nexosapp.'];
  //     }
  //     return $response;
  //   } catch (PDOException $e) {
  //     echo "Error al insertar los datos: " . $e->getMessage();
  //   }
  // }



  // public function Agregar_Ambientes($agencia, $ambiente_agencia, $nombre_url, $url_conexion)
  // {
  //   // Nombre de la tabla y campo antes del cual se añadirán las nuevas columnas
  //   $tabla = "cmx_ambiente";
  //   $campo_anterior = "nombre_ambiente";
  //   // Inicializar array de columnas
  //   $columnas = [];
  //   // Construir las definiciones de las nuevas columnas
  //   foreach ($nombre_url as $value) {
  //     // Agregar la definición de la columna al array
  //     // $columnas[] = "$value VARCHAR(50)  NULL AFTER $campo_anterior";
  //     $columnas[] = "$value VARCHAR(50)  NULL";
  //   }

  //   try {
  //     // Establecer la conexión con PDO
  //     $conn = $this->_db3;
  //     $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  //     // Construir la consulta SQL
  //     $sql = "ALTER TABLE $tabla ";
  //     foreach ($columnas as $columna) {
  //       $sql .= "ADD COLUMN $columna, ";
  //     }
  //     // Eliminar la coma adicional al final de la consulta
  //     $sql = rtrim($sql, ", ");

  //     // Ejecutar la consulta
  //     $conn->exec($sql);
  //     // echo "Columnas creadas exitosamente";
  //   } catch (PDOException $e) {
  //     echo "Error al crear las columnas: " . $e->getMessage();
  //   }
  // }

  // public function Agregar_Ambientes($agencia, $ambiente_agencia, $nombre_url, $url_conexion)
  // {
  //   // Consulta SQL para crear una nueva columna en la tabla
  //   foreach ($nombre_url as $value) {
  //     // Array con las definiciones de las nuevas columnas
  //     $columnas = [
  //       $value . "VARCHAR(50) NULL",
  //       // "nueva_columna2 INT NOT NULL"
  //     ];
  //   }
  //   // Nombre de la tabla y campo antes del cual se añadirán las nuevas columnas
  //   $tabla = "cmx_ambiente";
  //   $campo_anterior = "nombre_ambiente";
  //   // Construir la consulta SQL
  //   $sql = "ALTER TABLE $tabla ";
  //   foreach ($columnas as $columna) {
  //     $sql .= "ADD COLUMN $columna, ";
  //   }
  //   // Añadir el campo al final de las nuevas columnas
  //   // $sql .= "ADD COLUMN campo_despues_nuevas_columnas VARCHAR(255) AFTER $campo_anterior";
  //   $conn = $this->_db3->prepare($sql);
  //   $conn->execute();
  //   // $sql = $this->_db3->prepare("ALTER TABLE cmx_ambiente ADD COLUMN ejemplo VARCHAR(50) NULL");
  // }

  // function generarCodigoEntero($longitud)
  // {
  //   $caracteres = '0123456789';
  //   $codigo = '';

  //   for ($i = 0; $i < $longitud; $i++) {
  //     $codigo .= $caracteres[rand(0, strlen($caracteres) - 1)];
  //   }

  //   return $codigo;
  // }
}
