<?php

use Illuminate\Support\Arr;

session_start();
class vehiculosController extends Controller
{
  private $_modelo;
  private $validar_token;
  private $guardar_vehiculo;
  private $listar_colores;
  private $buscar_colores;
  private $listar_marcas;
  private $listar_configuracion;
  private $listar_trailer;
  private $listar_lineas;
  private $listar_clase_vehiculo;
  private $traer_configuracion_rndc;
  private $listar_carroceria;
  private $listar_empresa_gps;
  private $listar_propietario;
  private $buscar_propietario;
  private $buscar_poseedor;
  private $Listar_conductor;
  private $buscar_conductor;
  private $buscar_datos_vehiculo;
  private $actualizar_vehiculo;
  /* Funcion para caragr losproveedores */
  private $cargar_proveedores;

  public function __construct()
  {
    parent::__construct();
    $this->_modelo = $this->loadModel('vehiculos');
  }

  public function index() {}

  public function validar_token_placa()
  {
    $placa = $_POST["placa"];
    $token = $_POST["token"];
    $prefiltro = $_POST["prefiltro"];
    $this->validar_token = $this->_modelo->Validar_Token($placa, $token, $prefiltro);
    echo json_encode($this->validar_token);
  }

  function Insertar_vehiculo()
  {

    $response = [];
    try {
      // Registro inicial de datos enviados
      file_put_contents('error_log.txt', "Datos recibidos: " . print_r($_POST, true), FILE_APPEND);
      file_put_contents('error_log.txt', print_r($_POST, true));
      file_put_contents('error_log.txt', print_r($_FILES, true));

      // Procesar los datos
      if (empty($_POST)) {
        throw new Exception('$_POST está vacío. Verifica el formulario o la solicitud AJAX.');
      }

      // Aquí continúa tu lógica normal...
      $placa = $_POST["placa"];
      $id_propietario = $_POST["id_propietario"];
      $id_tenedor = $_POST["id_tenedor"];
      $id_conductor = $_POST["id_conductor"];
      $tipo_vehiculo = '';
      $tipo_carroceria =  $_POST["tipo_carroceria"];
      $web_satelital =  $_POST["web_satelital"];
      $usuario_satelital =  $_POST["usuario_satelital"];
      $clave_satelital =  $_POST["clave_satelital"];

      if (isset($_POST["tecnomecanica"])) {
        $tecnomecanica = $_POST["tecnomecanica"];
      } else {
        $tecnomecanica = '';
      }
      $fecha_tecno = $_POST["fecha_tecno"] == '' ? null : $_POST["fecha_tecno"];
      $fecha_vig_tecno = $_POST["fecha_vig_tecno"] == '' ? null : $_POST["fecha_vig_tecno"];
      //datos cmx_vehiculo2
      $configuracion = $_POST["configuracion"];
      $color  = $_POST["color"];
      $marca = $_POST["marca"];
      $linea = $_POST["linea"];
      $modelo = $_POST["modelo"];
      //$carroceria  = $_POST["carroceria"];
      $tipo_combustible = $_POST["tipo_combustible"];
      $peso_vacio = $_POST["peso_vacio"];
      $numero_poliza = $_POST["numero_poliza"];
      $numero_polizaRC = $_POST["numero_polizaRC"];
      $soat_vencimiento = $_POST["soat_vencimiento"] == '' ? null : $_POST["soat_vencimiento"];
      $aseguradora = $_POST["aseguradora"];
      $num_motor = $_POST["num_motor"];
      $num_chasis = $_POST["num_chasis"];
      // $numero_poliza = $_POST["numero_poliza"];
      $fecha_poliza = $_POST["fecha_poliza"] == '' ? null : $_POST["fecha_poliza"];
      $repotenciado = $_POST["repotenciado"] == '' ? null : $_POST["repotenciado"];
      $tipovinculacion = $_POST["tipovinculacion"];
      $fecha_mantenimientogps = $_POST["fecha_mantenimientogps"] == '' ? null : $_POST["fecha_mantenimientogps"];
      $capacidad_tn = $_POST["capacidad_tn"];
      $peso_bruto = $_POST["peso_bruto"];
      $f_matricula = $_POST["f_matricula"] == '' ? null : $_POST["f_matricula"];
      $clase = $_POST["clase"];
      if (isset($_POST["lice_transito"])) {
        $lice_transito = $_POST["lice_transito"];
      } else {
        $lice_transito = $_POST["lice_transito"];
      }
      $cant_viaje = $_POST["cant_viaje"];
      $empresagps = $_POST["empresasatelite"];
      $fecha = date('Y-m-d');
      $hora = date('G:i:s');
      //DATOS DEL TRAILER
      if ($_POST["trailers"] == 'NA') {
        $placa_trailer = '';
      } else {
        $placa_trailer = $_POST["trailers"];
      }

      //Kit Mercancias peligrosas
      if (isset($_FILES['foto_kit_mercancias']) && $_FILES['foto_kit_mercancias'] != '') {
        $foto_kit_mercancias = $_FILES['foto_kit_mercancias'];
        $name_kit = $_POST['name_kit'];
      } else {
        $foto_kit_mercancias = "";
        $name_kit = "";
      }

      $datos = [
        "placa" => $placa,
        "id_propietario" => $id_propietario,
        "id_tenedor" => $id_tenedor,
        "id_conductor" => $id_conductor,
        "tipo_vehiculo" => $tipo_vehiculo,
        "tipo_carroceria" => $tipo_carroceria,
        "web_satelital" => $web_satelital,
        "usuario_satelital" => $usuario_satelital,
        "clave_satelital" => $clave_satelital,
        "tecnomecanica" => $tecnomecanica,
        "fecha_tecno" => $fecha_tecno,
        "fecha_vig_tecno" => $fecha_vig_tecno,
        "configuracion" => $configuracion,
        "color" => $color,
        "marca" => $marca,
        "linea" => $linea,
        "modelo" => $modelo,
        "tipo_combustible" => $tipo_combustible,
        "peso_vacio" => $peso_vacio,
        "numero_poliza" => $numero_poliza != '' ? $numero_poliza : 'undefined',
        "numero_polizaRC" => $numero_polizaRC != '' ? $numero_polizaRC : 'undefined',
        "soat_vencimiento" => $soat_vencimiento,
        "aseguradora" => $aseguradora,
        "num_motor" => $num_motor,
        "num_chasis" => $num_chasis,
        "fecha_poliza" => $fecha_poliza,
        "repotenciado" => $repotenciado,
        "tipovinculacion" => $tipovinculacion,
        "fecha_mantenimientogps" => $fecha_mantenimientogps,
        "capacidad_tn" => $capacidad_tn,
        "peso_bruto" => $peso_bruto,
        "f_matricula" => $f_matricula,
        "clase" => $clase,
        "lice_transito" => $lice_transito,
        "cant_viaje" => $cant_viaje,
        "empresagps" => $empresagps,
        "fecha" => $fecha,
        "hora" => $hora,
        "placa_trailer" => $placa_trailer,
        "id_usuario" => $_SESSION["usuario"]["id_usuario"],
        "nom_usuario" => $_SESSION["usuario"]["nom_usuario"],

        /* Fotos y documentos del vehiculo */
        "name_transi" => $_POST['name_transi'],
        "foto_transi" => $_FILES['foto_transi'],
        "name_frontal" => $_POST['name_frontal'],
        "foto_vehiculo" => $_FILES['foto_vehiculo'],
        "name_derecha" => $_POST['name_derecha'],
        "foto_vehiculod" => $_FILES['foto_vehiculod'],
        "name_izquierda" => $_POST['name_izquierda'],
        "foto_vehiculoi" => $_FILES['foto_vehiculoi'],
        "name_atras" => $_POST['name_atras'],
        "foto_vehiculoa" => $_FILES['foto_vehiculoa'],
        "name_soat" => $_POST['name_soat'],
        "foto_soat" => $_FILES['foto_soat'],
        "name_tecno" => $_POST['name_tecno'],
        "foto_tecno" => $_FILES['foto_tecno'],

        //Documetos de preoperacional
        "fecha_expedicion_preoperacional" => $_POST['fecha_expedicion_preoperacional'],
        "fecha_vencimiento_preoperacional" => $_POST['fecha_vencimiento_preoperacional'],
        "vigencia_prepoeracional" => $_POST['vigencia_prepoeracional'],
        "documento_preopeacional" => $_FILES['documento_preopeacional'],
        "name_preoperacional" => $_POST['name_preoperacional'],
        //Kit Mercancias peligrosas
        "foto_kit_mercancias" => $foto_kit_mercancias,
        "name_kit" => $name_kit
      ];

      $this->guardar_vehiculo = $this->_modelo->Guardar_vehiculo($datos);
      if ($this->guardar_vehiculo == 200) {
        $response = ['numero' => 200, 'mensaje' => 'Datos Vehículo Registrado Exitosamente NEXOSAPP.'];
        $this->guardar_vehiculo = $response;
      } else if ($this->guardar_vehiculo == 400) {
        $response = ['numero' => 400, 'mensaje' => 'Datos Vehículo No Registrado  NEXOSAPP.'];
        $this->guardar_vehiculo = $response;
      } else {
        $response = ['numero' => 400, 'mensaje' => 'Datos Vehículo No Registrado  NEXOSAPP.'];
        $this->guardar_vehiculo = $response;
      }
      echo json_encode($this->guardar_vehiculo);
    } catch (Exception $e) {
      // Registrar error en el archivo de log
      error_log($e->getMessage(), 3, 'error_log.txt');
      error_log("Trace: " . $e->getTraceAsString(), 3, 'error_log.txt');

      // Enviar una respuesta al cliente
      echo json_encode(['numero' => 500, 'mensaje' => 'Error interno en el servidor.']);
    }
  }

  public function Actualizar_vehiculo()
  {
    $response = [];
    $placa = $_POST["placa"];
    $id_propietario = $_POST["id_propietario"];
    $id_tenedor = $_POST["id_tenedor"];
    $id_conductor = $_POST["id_conductor"];
    $tipo_vehiculo = '';
    $tipo_carroceria =  $_POST["tipo_carroceria"];
    $web_satelital =  $_POST["web_satelital"];
    $usuario_satelital =  $_POST["usuario_satelital"];
    $clave_satelital =  $_POST["clave_satelital"];
    if (isset($_POST["tecnomecanica"])) {
      $tecnomecanica = $_POST["tecnomecanica"];
    } else {
      $tecnomecanica = '';
    }
    $fecha_tecno = $_POST["fecha_tecno"] == '' ? null : $_POST["fecha_tecno"];
    $fecha_vig_tecno = $_POST["fecha_vig_tecno"] == '' ? null : $_POST["fecha_vig_tecno"];
    //datos cmx_vehiculo2
    $configuracion = $_POST["configuracion"];
    $color  = $_POST["color"];
    $marca = $_POST["marca"];
    $linea = $_POST["linea"];
    $modelo = $_POST["modelo"];
    //$carroceria  = $_POST["carroceria"];
    $tipo_combustible = $_POST["tipo_combustible"];
    $peso_vacio = $_POST["peso_vacio"];
    $numero_soat = $_POST["numero_soat"];
    $numero_poliza = $_POST["numero_poliza"];
    $soat_vencimiento = $_POST["soat_vencimiento"] == '' ? null : $_POST["soat_vencimiento"];
    $aseguradora = $_POST["aseguradora"];
    $num_motor = $_POST["num_motor"];
    $num_chasis = $_POST["num_chasis"];
    // $numero_poliza = $_POST["numero_poliza"];
    $fecha_poliza = $_POST["fecha_poliza"] == '' ? null : $_POST["fecha_poliza"];
    $repotenciado = empty($_POST["repotenciado"]) ? 0 : $_POST["repotenciado"];
    $tipovinculacion = $_POST["tipovinculacion"];
    $fecha_mantenimientogps = $_POST["fecha_mantenimientogps"] == '' ? null : $_POST["fecha_mantenimientogps"];
    $capacidad_tn = $_POST["capacidad_tn"];
    $peso_bruto = $_POST["peso_bruto"];
    $f_matricula = $_POST["f_matricula"];
    $clase = $_POST["clase"];
    if (isset($_POST["lice_transito"])) {
      $lice_transito = $_POST["lice_transito"];
    } else {
      $lice_transito = $_POST["lice_transito"];
    }
    $cant_viaje = $_POST["cant_viaje"];
    $empresagps = $_POST["empresasatelite"];
    $fecha = date('Y-m-d');
    $hora = date('G:i:s');

    //datos trailer
    $placa_trailer = $_POST["trailers"];
    if ($placa_trailer == 'NA') {
      $placa_trailer = '';
      $trailer_anterior = '';
    } else if ($placa_trailer != '') {
      //trailer nuevo 
      $placa_trailer = $_POST["trailers"];
      if ($_POST["trailer_anterior"]) {
        $trailer_anterior = $_POST["trailer_anterior"];
      } else {
        $trailer_anterior = '';
      }
    }

    //Kit Mercancias peligrosas
    if (isset($_FILES['foto_kit_mercancias']) && $_FILES['foto_kit_mercancias'] != '') {
      $foto_kit_mercancias = $_FILES['foto_kit_mercancias'];
      $name_kit = $_POST['name_kit'];
    } else {
      $foto_kit_mercancias = "";
      $name_kit = "";
    }

    $datos = [
      "placa" => $placa,
      "id_propietario" => $id_propietario,
      "id_tenedor" => $id_tenedor,
      "id_conductor" => $id_conductor,
      "tipo_vehiculo" => $tipo_vehiculo,
      "tipo_carroceria" => $tipo_carroceria,
      "web_satelital" => $web_satelital,
      "usuario_satelital" => $usuario_satelital,
      "clave_satelital" => $clave_satelital,
      "tecnomecanica" => $tecnomecanica,
      "fecha_tecno" => $fecha_tecno,
      "fecha_vig_tecno" => $fecha_vig_tecno,
      "configuracion" => $configuracion,
      "color" => $color,
      "marca" => $marca,
      "linea" => $linea,
      "modelo" => $modelo,
      "tipo_combustible" => $tipo_combustible,
      "peso_vacio" => $peso_vacio,
      "numero_poliza" => empty($numero_poliza) ? null :  $numero_poliza,
      "numero_soat" => $numero_soat,
      "soat_vencimiento" => $soat_vencimiento,
      "aseguradora" => $aseguradora,
      "num_motor" => $num_motor,
      "num_chasis" => $num_chasis,
      "fecha_poliza" => $fecha_poliza,
      "repotenciado" => $repotenciado,
      "tipovinculacion" => $tipovinculacion,
      "fecha_mantenimientogps" => $fecha_mantenimientogps,
      "capacidad_tn" => $capacidad_tn,
      "peso_bruto" => $peso_bruto,
      "f_matricula" => $f_matricula,
      "clase" => $clase,
      "lice_transito" => $lice_transito,
      "cant_viaje" => $cant_viaje,
      "empresagps" => $empresagps,
      "fecha" => $fecha,
      "hora" => $hora,
      "placa_trailer" => $placa_trailer,
      "trailer_anterior" => $trailer_anterior,
      "id_usuario" => $_SESSION["usuario"]["id_usuario"],
      "nom_usuario" => $_SESSION["usuario"]["nom_usuario"],

      /* Fotos y documentos del vehiculo */
      "name_transi" => $_POST['name_transi'],
      "foto_transi" => isset($_FILES['foto_transi']) ? $_FILES['foto_transi'] : '',
      "name_frontal" => $_POST['name_frontal'],
      "foto_vehiculo" => isset($_FILES['foto_vehiculo']) ? $_FILES['foto_vehiculo'] : '',
      "name_derecha" => $_POST['name_derecha'],
      "foto_vehiculod" => isset($_FILES['foto_vehiculod']) ? $_FILES['foto_vehiculod'] : '',
      "name_izquierda" => $_POST['name_izquierda'],
      "foto_vehiculoi" => isset($_FILES['foto_vehiculoi']) ? $_FILES['foto_vehiculoi'] : '',
      "name_atras" => $_POST['name_atras'],
      "foto_vehiculoa" => isset($_FILES['foto_vehiculoa']) ? $_FILES['foto_vehiculoa'] : '',
      "name_soat" => $_POST['name_soat'],
      "foto_soat" => isset($_FILES['foto_soat']) ? $_FILES['foto_soat'] : '',
      "name_tecno" => $_POST['name_tecno'],
      "foto_tecno" => isset($_FILES['foto_tecno']) ? $_FILES['foto_tecno'] : '',

      //Documetos de preoperacional
      "fecha_expedicion_preoperacional" => $_POST['fecha_expedicion_preoperacional'],
      "fecha_vencimiento_preoperacional" => $_POST['fecha_vencimiento_preoperacional'],
      "vigencia_prepoeracional" => $_POST['vigencia_prepoeracional'],
      "documento_preopeacional" => isset($_FILES['documento_preopeacional']) ? $_FILES['documento_preopeacional'] : '',
      "name_preoperacional" => $_POST['name_preoperacional'],
      //Kit Mercancias peligrosas
      "foto_kit_mercancias" => $foto_kit_mercancias,
      "name_kit" => $name_kit,

      /* Vehiculo id */
      "num_vehiculo" => $_POST['num_vehiculo'],
    ];
    $this->actualizar_vehiculo = $this->_modelo->Actualizar_Vehiculos($datos);
    if ($this->actualizar_vehiculo == 200) {
      $response = ['numero' => 200, 'mensaje' => 'Datos del Vehículo Actualizado Exitosamente NEXOSAPP.'];
      $this->actualizar_vehiculo = $response;
    } else if ($this->actualizar_vehiculo == 400) {
      $response = ['numero' => 400, 'mensaje' => 'Datos del Vehículo No Actualizado en NEXOSAPP.'];
      $this->actualizar_vehiculo = $response;
    }
    echo json_encode($this->actualizar_vehiculo);
  }

  public function tipo_color()
  {
    $this->listar_colores = $this->_modelo->Lista_De_Colores();
    echo json_encode($this->listar_colores);
  }

  public function buscar_color()
  {
    $dato = $_POST['datos'];
    $this->buscar_colores = $this->_modelo->Filtro_Buscar_Colores($dato);
    echo json_encode($this->buscar_colores);
  }

  public function tipo_marca()
  {
    $this->listar_marcas = $this->_modelo->Lista_De_Marcas();
    echo json_encode($this->listar_marcas);
  }

  public function config_cabezote()
  {
    $this->listar_configuracion = $this->_modelo->Lista_De_Configuraciones();
    echo json_encode($this->listar_configuracion);
  }

  public function traer_trailer()
  {
    $nombre = $_POST["nombre"];
    $this->listar_trailer = $this->_modelo->traer_trailer($nombre);
    echo json_encode($this->listar_trailer);
  }

  public function cambio_marca()
  {
    $marca = $_POST["marca"];
    $this->listar_lineas = $this->_modelo->traer_lineas($marca);
    echo json_encode($this->listar_lineas);
  }

  public function listar_clase()
  {
    $this->listar_clase_vehiculo = $this->_modelo->Listar_Clase_Vehiculo();
    echo json_encode($this->listar_clase_vehiculo);
  }

  public function traer_crndc_configuracion()
  {
    $id = $_POST["id"];
    $this->traer_configuracion_rndc = $this->_modelo->Consultar_Configuracion_Rndc($id);
    echo json_encode($this->traer_configuracion_rndc);
  }

  public function traer_carroceria()
  {
    $this->listar_carroceria = $this->_modelo->Listar_Tipo_Carroceria();
    echo json_encode($this->listar_carroceria);
  }

  public function traer_empresa_gps()
  {
    $this->listar_empresa_gps = $this->_modelo->Listar_Empresa_Gps();
    echo json_encode($this->listar_empresa_gps);
  }

  public function Listar_propietario()
  {
    $this->listar_propietario = $this->_modelo->Listar_Propietarios();
    echo json_encode($this->listar_propietario);
  }

  public function buscar_propietario()
  {
    $datos = $_POST["datos"];
    $this->buscar_propietario = $this->_modelo->Buscar_Propietarios($datos);
    echo json_encode($this->buscar_propietario);
  }

  public function Listar_poseedor()
  {
    $this->listar_propietario = $this->_modelo->Listar_Poseeodores();
    echo json_encode($this->listar_propietario);
  }

  public function buscar_poseedor()
  {
    $datos = $_POST["datos"];
    $this->buscar_poseedor = $this->_modelo->Buscar_Poseedores($datos);
    echo json_encode($this->buscar_poseedor);
  }

  public function Listar_conductor()
  {
    $this->Listar_conductor = $this->_modelo->Listar_Conductores();
    echo json_encode($this->Listar_conductor);
  }

  public function buscar_conductor()
  {
    $datos = $_POST["datos"];
    $this->buscar_conductor = $this->_modelo->Buscar_Conductores($datos);
    echo json_encode($this->buscar_conductor);
  }

  public function traer_datos_vehiculo()
  {
    $response = [];
    $id_vehiculo = $_POST["id_vehiculo"];
    $this->buscar_datos_vehiculo = $this->_modelo->Buscar_Datos_Vehiculo($id_vehiculo);
    if ($this->buscar_datos_vehiculo != false) {
      $response = $this->buscar_datos_vehiculo;
    } else {
      $response = false;
    }
    echo json_encode($response);
  }

  /* Funcion para carhar los datos del proveedor */
  public function cargar_proveedores()
  {
    $response = [];
    $placa = $_POST["placa"];
    $this->cargar_proveedores = $this->_modelo->Buscar_Datos_Proveedores($placa);
    if ($this->cargar_proveedores != false) {
      $response = $this->cargar_proveedores;
    } else {
      $response = false;
    }
    echo json_encode($response);
  }
}
