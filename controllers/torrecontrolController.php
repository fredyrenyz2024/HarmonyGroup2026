<?php

class torrecontrolController extends Controller
{
  private $_modelo;
  private $_filtros;
  private $_importar_datos;
  private $_listar_pedidos_administrador;
  private $_listar_proveedor_cliente;
  private $_insertar_asignacion_proveedor;
  private $_insertar_publicacion_proveedor;
  private $detalle_proceso;
  private $_inicar_gestion;
  private $_insertar_postulacion;
  private $_insertar_prioridad;
  private $_iniciar_pedido;
  private $_subastar_pedido;

  public function __construct()
  {
    parent::__construct();
    //$this->_modelo = $this->loadModel('servicioclientei');
    $this->_modelo = $this->loadModel('TorreControl');
  }

  public function index()
  {
    $this->_view->titulo = 'Administrara Torre de Control';
    $this->_view->renderizar('index', 'torrecontrol'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
  }
  public function todos()
  {
    $this->_view->titulo = 'Administrara Torre de Control';
    $this->_view->renderizar_ventana('administrador_torre_control', 'torrecontrol'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
  }
  public function nuevo()
  {
    $this->_view->titulo = 'Administrara Torre de Control';
    $this->_view->renderizar_ventana('nuevo_pedido', 'torrecontrol'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
  }
  public function prioritarias()
  {
    $this->_view->titulo = 'Prioritarias Torre de Control';
    $this->_view->renderizar_ventana('priotitarias_torre_control', 'torrecontrol'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
  }
  public function pendientes()
  {
    $this->_view->titulo = 'Pendientes Torre de Control';
    $this->_view->renderizar_ventana('pendientes_torre_control', 'torrecontrol'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
  }
  public function en_curso()
  {
    $this->_view->titulo = 'En Curso Torre de Control';
    $this->_view->renderizar_ventana('en_curso_torre_control', 'torrecontrol'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
  }
  public function completadas()
  {
    $this->_view->titulo = 'Completadas Torre de Control';
    $this->_view->renderizar_ventana('completadas_torre_control', 'torrecontrol'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
  }

  /* CARGAR LA VISTA DE LOS PROVEEDORES EN LA TORRE DE CONTROL */
  public function proveedor_torre_control()
  {
    $this->_view->titulo = 'Proveedor Torre de Control';
    $this->_view->renderizar('proveedor/proveedor_torre_control', 'torrecontrol');
  }

  public function crear_filtro()
  {
    $ventana = $_POST['param1'];
    $this->_filtros = $this->_view->Cargar_Filtros_ventana($ventana);
    // $this->_filtros = $this->_modelo->Cargar_Filtros_ventana($ventana);
    echo json_encode($this->_filtros);
  }

  public function importar_pedidos_masivos()
  {
    // 1) Leemos el JSON
    $data = file_get_contents("php://input");
    $rows = json_decode($data, true);

    if (!$rows) {
      echo "No se recibieron datos válidos.";
      exit;
    }

    $this->_importar_datos = $this->_modelo->importar_pedidos_masivos($rows);
    echo json_encode($this->_importar_datos);
  }

  public function listar_administracion_pedidos()
  {
    $fecha_inicial = $_POST['fecha_inicial'];
    $fecha_final = $_POST['fecha_final'];
    $ventana = isset($_POST['ventana']) ? $_POST['ventana'] : null;
    $proveedor_id = isset($_POST['proveedor_id']) ? $_POST['proveedor_id'] : null;
    $cliente_id = isset($_POST['cliente_id']) ? $_POST['cliente_id'] : null;
    $estado = isset($_POST['estado']) ? $_POST['estado'] : null;
    $this->_listar_pedidos_administrador = $this->_modelo->Listar_pedidos_administrador($fecha_inicial, $fecha_final, $ventana, $proveedor_id, $estado, $cliente_id);
    echo json_encode($this->_listar_pedidos_administrador);
  }

  public function listar_proveedores_cliente()
  {
    $dataId2 = $_POST['dataId2'] ?? null;
    $this->_listar_proveedor_cliente = $this->_modelo->Listar_proveedores_clientes($dataId2);
    echo json_encode($this->_listar_proveedor_cliente);
  }


  public function listar_servicios_proveedor()
  {
    $proveedor_id = $_POST['proveedor_id'] ?? null;
    $this->_listar_proveedor_cliente = $this->_modelo->Listar_servicio_proveedores($proveedor_id);
    echo json_encode($this->_listar_proveedor_cliente);
  }

  public   function insertar_asignacion()
  {
    $numdocSolicitud = $_POST['numdocSolicitud'] ?? null;
    $asignaciones = json_decode($_POST['asignaciones'], true) ?? [];
    $fecha_vencimiento = $_POST['fecha_vencimiento'] ?? null;
    $hora_vencimiento = $_POST['hora_vencimiento'] ?? null;

    if (!$numdocSolicitud || empty($asignaciones)) {
      echo json_encode(["status" => false, "message" => "Faltan datos para la inserción"]);
      return;
    }

    $resultado = $this->_modelo->insertar_asignacion_proveedor($numdocSolicitud, $asignaciones, $fecha_vencimiento, $hora_vencimiento);
    echo json_encode($resultado);
  }

  public function listar_servicio_proveedor()
  {
    $dataId2 = $_POST['dataId2'] ?? null;
    $this->_listar_proveedor_cliente = $this->_modelo->Listar_servicios_proveedores($dataId2);
    echo json_encode($this->_listar_proveedor_cliente);
  }
  public function listar_provedores_clientes()
  {
    $clienId = $_POST['clienId'] ?? null;
    $ServicioId = $_POST['ServicioId'] ?? null;
    $this->_listar_proveedor_cliente = $this->_modelo->Listar_proveedores_servicios($clienId, $ServicioId);
    echo json_encode($this->_listar_proveedor_cliente);
  }

  public function publicar_pedido()
  {
    $numdocSolicitud = $_POST['numdocSolicitud'] ?? null;
    $seleccionados = json_decode($_POST['seleccionados'], true) ?? [];
    $fecha_vencimiento = $_POST['fecha_vencimiento'] ?? null;
    $hora_vencimiento = $_POST['hora_vencimiento'] ?? null;
    $Proveedoresseleccionados = json_decode($_POST['Proveedoresseleccionados'], true) ?? [];
    $proceso = $_POST['proceso'] ?? null;

    if (!$numdocSolicitud || empty($seleccionados)) {
      echo json_encode(["status" => false, "message" => "Faltan datos para la inserción"]);
      return;
    }

    $this->_insertar_publicacion_proveedor = $this->_modelo->publicar_pedido_proveedor($numdocSolicitud, $seleccionados, $fecha_vencimiento, $hora_vencimiento, $Proveedoresseleccionados, $proceso);
    echo json_encode($this->_insertar_publicacion_proveedor);
  }

  public function detalle_proceso()
  {
    $Solicitud = $_POST['Solicitud'];
    $this->detalle_proceso = $this->_modelo->Detalle_proceso_pedido($Solicitud);
    echo json_encode($this->detalle_proceso);
  }

  public function insertar_gestion()
  {
    $datos = [
      "proveedorId" => $_POST['proveedorId'],
      "servicioId" => $_POST['servicioId'],
      "pedidoId" => $_POST['pedidoId'],
      "estado" => $_POST['estado'],
      "fecha" => date("Y-m-d"),
      "hora" => date('H:i:s'),
    ];

    $this->_inicar_gestion = $this->_modelo->Iniciar_gestion($datos);
    echo json_encode($this->_inicar_gestion);
  }

  public function insertar_postulacion()
  {
    $dato = [
      "proveedorId" => $_POST['proveedorId'],
      "servicioId" => $_POST['servicioId'],
      "pedidoId" => $_POST['pedidoId'],
      "placa" => isset($_POST['placa']) ? $_POST['placa'] : null,
      // "flete" => isset($_POST['flete']) ? $_POST['flete'] : null,
      "costo_servicio" => isset($_POST['costo_servicio']) ? $_POST['costo_servicio'] : $_POST['flete'],
      "fecha_inicio" => $_POST['fecha_inicio'],
      "hora_inicio" => $_POST['hora_inicio'],
      "Proceso" => $_POST['Proceso'],
      "fecha" => date("Y-m-d"),
      "hora" => date('H:i:s')
    ];

    $this->_insertar_postulacion = $this->_modelo->Insertar_postulacion($dato);
    echo json_encode($this->_insertar_postulacion);
  }

  public function Insertar_Prioridad()
  {
    $numdocSolicitud = $_POST['numdocSolicitud'];
    $this->_insertar_prioridad = $this->_modelo->Insertar_prioridad($numdocSolicitud);
    echo json_encode($this->_insertar_prioridad);
  }

  public function iniciar_pedido()
  {
    $numdocSolicitud = $_POST['SolicitudId'];
    $this->_iniciar_pedido = $this->_modelo->Iniciar_pedido($numdocSolicitud);
    echo json_encode($this->_iniciar_pedido);
  }

  public function Subastar_Pedido()
  {
    $numdocSolicitud = $_POST['numdocSolicitud'];
    $this->_subastar_pedido = $this->_modelo->Subastar_pedido($numdocSolicitud);
    echo json_encode($this->_subastar_pedido);
  }
}
