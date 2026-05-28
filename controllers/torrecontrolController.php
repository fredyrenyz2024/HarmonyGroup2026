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
  private $_clientes;
  private $_cancelar_asignacion;
  private $_insertar_pedido_torre_control;
  private $_listar_recrusos_administrador;
  private $_listar_servicios_recursos;
  private $_listar_detalle_proveedores_servicio;
  private $_buscar_usuario;
  private $_listar_trazabilidad;
  private $_estado_recurso;
  private $_insertar_plantillas;
  private $_listar_plantillas;
  private $_lista_actividades;
  private $_insertar_trazabilidad_pedido;
  private $_listar_trazabilidad_pedido;
  private $_detalle_trazabilidad_pedido;
  private $_importar_trazabilidad_pedido;
  private $_cancelar_solicitud_pedido;
  private $_listar_informes_torre_control;

  private $_inactivar_plantilla;
  private $_listar_servicios_valor;

  private $_editar_plantilla;
  private $_insertar_gestion_pedido;

  private $_insertar_actividad_trazabilidad;
  private $_editar_actividad_trazabilidad;
  private $_calculo;
  private $_rechazar_recurso;
  private $_editar_datos_recurso;
  private $_listar_servicios_especiales;
  private $_cancelar_servicio_especial;
  private $_aprobar_servicio_especial;
  private $_rechazar_servicio_especial;
  private $_traer_servicio_especial;
  private $_agregar_servicio_especial;
  private $_linea_Tiempo_pedidos;
  private $_fecha_estimada_entrega_pedido;
  private $_listar_graficos;
  private $_detalle_listar_graficos;
  private $_listar_graficos_asignados;
  private $_compartidos_conmigo;
  private $_lista_actividades_compartidas;
  private $_lista_recursos_facturacion;

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
  public function recursos()
  {
    $this->_view->titulo = 'Recursos Torre de Control';
    $this->_view->renderizar_ventana('recurso_torre_control', 'torrecontrol'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
  }
  public function crear_plantilla()
  {
    $this->_view->titulo = 'Plantillas Torre de Control';
    $this->_view->renderizar('pantilla_pedido', 'torrecontrol'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
  }

  public function todas()
  {
    $this->_view->titulo = 'Plantillas Torre de Control';
    $this->_view->renderizar_ventana('plantillas/todas', 'torrecontrol'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
  }

  public function nueva()
  {
    $this->_view->titulo = 'Plantillas Torre de Control';
    $this->_view->renderizar_ventana('plantillas/nueva', 'torrecontrol'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
  }

  /* CARGAR LA VISTA DE LOS PROVEEDORES EN LA TORRE DE CONTROL */
  public function proveedor_torre_control()
  {
    $this->_view->titulo = 'Proveedor Torre de Control';
    $this->_view->renderizar('proveedor/proveedor_torre_control', 'torrecontrol');
  }

  public function trazabilidad()
  {
    $this->_view->titulo = 'Trazabilidad Torre de Control';
    $this->_view->renderizar_ventana('proveedor/trazabilidad', 'torrecontrol'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
  }

  public function informes()
  {
    $this->_view->titulo = 'Informes Torre de Control';
    $this->_view->renderizar_ventana('informes_torre_control', 'torrecontrol'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
  }

  public function indicadores()
  {
    $this->_view->titulo = 'Indicadores Torre de Control';
    $this->_view->renderizar_ventana('indicadores_torre_control', 'torrecontrol'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
  }
  public function graficos()
  {
    $this->_view->titulo = 'Graficos Torre de Control';
    $this->_view->renderizar_ventana('graficos_torre_control', 'torrecontrol'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
  }

  public function despachador_torre_control()
  {
    $this->_view->titulo = 'Despachador Torre de Control';
    $this->_view->renderizar('despachador/despachador_torre_control', 'torrecontrol');
  }

  public function actividades()
  {
    $this->_view->titulo = 'Actividades Torre de Control';
    $this->_view->renderizar_ventana('plantillas/actividades', 'torrecontrol');
  }

  public function tareas()
  {
    $this->_view->titulo = 'Tareas Compartidos Conmigo';
    $this->_view->renderizar_ventana('tareas/tareas', 'torrecontrol');
  }

  public function seguimiento_facturacion()
  {
    $this->_view->titulo = 'Seguimiento Facturación';
    $this->_view->renderizar_ventana('seguimiento_facturacion', 'torrecontrol');
  }

  public function gestion_proveedor()
  {
    $this->_view->titulo = 'Actividades Torre de Control';
    $this->_view->renderizar_ventana('proveedor/gestion_proveedor', 'torrecontrol');
  }

  public function parametros_torre_control()
  {
    $this->_view->titulo = 'Actividades Torre de Control';
    $this->_view->renderizar('index', 'torrecontrol');
  }

  public function parametros()
  {
    $this->_view->titulo = 'Actividades Torre de Control';
    $this->_view->renderizar_ventana('clientes_ext', 'torrecontrol');
  }

  public function crear_filtro()
  {
    $ventana = $_POST['param1'];
    $this->_filtros = $this->_view->Cargar_Filtros_ventana($ventana);
    echo json_encode($this->_filtros);
  }

  public function importar_pedidos_masivos()
  {
    // 1) Leemos el JSON
    $data = json_decode(file_get_contents('php://input'), true);

    $globalData = $data['globalData'] ?? null;
    $Modalidad = $data['Modalidad'] ?? null;

    if (!$globalData) {
      echo "No se recibieron datos vÃ¡lidos.";
      exit;
    }

    $this->_importar_datos = $this->_modelo->importar_pedidos_masivos($globalData, $Modalidad);
    echo json_encode($this->_importar_datos);
  }

  public function listar_administracion_pedidos()
  {
    $fecha_inicial = isset($_POST['fecha_inicial']) ? $_POST['fecha_inicial'] : null;
    $fecha_final = isset($_POST['fecha_final']) ? $_POST['fecha_final'] : null;
    $ventana = isset($_POST['ventana']) ? $_POST['ventana'] : null;
    $proveedor_id = isset($_POST['proveedor_id']) ? $_POST['proveedor_id'] : null;
    $cliente_id = isset($_POST['cliente_id']) ? $_POST['cliente_id'] : null;
    $estado = isset($_POST['estado']) ? $_POST['estado'] : null;
    $filtro = isset($_POST['filtro']) ? $_POST['filtro'] : null;
    $valor = isset($_POST['valor']) ? $_POST['valor'] : null;
    $trazabilidad = isset($_POST['trazabilidad']) ? $_POST['trazabilidad'] : null;
    $proceso_filtro = isset($_POST['proceso_filtro']) ? $_POST['proceso_filtro'] : null;
    $filtros = isset($_POST['filtros']) ? $_POST['filtros'] : null;
    $identificador = isset($_POST['identificador']) ? $_POST['identificador'] : null;
    $this->_listar_pedidos_administrador = $this->_modelo->Listar_pedidos_administrador($fecha_inicial, $fecha_final, $ventana, $proveedor_id, $estado, $cliente_id, $filtro, $valor, $trazabilidad, $proceso_filtro, $filtros, $identificador);
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

  public function insertar_asignacion()
  {

    $asignaciones = json_decode($_POST['asignaciones'], true) ?? [];
    $servicios_especiales = json_decode($_POST['servicios_especiales'], true) ?? [];
    $solicitudes = json_decode($_POST['solicitudes'], true) ?? [];
    $ClienteId = $_POST['ClienteId'] == null ? 99 : $_POST['ClienteId'];
    $Observacion = $_POST['observacion'] ?? null;
    $valorCheckboxes = $_POST['valorCheckboxes'] ?? null;

    if (!$solicitudes || empty($asignaciones) || $ClienteId == null) {
      echo json_encode(["status" => false, "message" => "Faltan datos para la inserciÃ³n"]);
      return;
    }

    $resultado = $this->_modelo->insertar_asignacion_proveedor($solicitudes, $asignaciones, $servicios_especiales, $ClienteId, $Observacion, $valorCheckboxes);
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
    // $numdocSolicitud = $_POST['numdocSolicitud'] ?? null;
    $seleccionados = json_decode($_POST['seleccionados'], true) ?? [];
    $servicios_especiales = json_decode($_POST['servicios_especiales'], true) ?? [];
    $Proveedoresseleccionados = json_decode($_POST['Proveedoresseleccionados'], true) ?? [];
    $solicitudes = json_decode($_POST['solicitudes'], true) ?? [];
    $proceso = $_POST['proceso'] ?? null;
    $ClienteId = $_POST['ClienteId'] ?? null;
    $observacion = $_POST['observacion'] ?? null;
    $valorCheckboxes = $_POST['valorCheckboxes'] ?? null;

    if (!$solicitudes || empty($seleccionados)) {
      echo json_encode(["status" => false, "message" => "Faltan datos para la inserciÃ³n"]);
      return;
    }

    $this->_insertar_publicacion_proveedor = $this->_modelo->publicar_pedido_proveedor($seleccionados, $solicitudes, $Proveedoresseleccionados, $proceso, $ClienteId, $servicios_especiales, $observacion, $valorCheckboxes);
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
      "PedidosId" => json_decode($_POST['PedidosId']),
      "placa" => isset($_POST['placa']) ? $_POST['placa'] : null,
      "cedula_conductor" => isset($_POST['cedula_conductor']) ? $_POST['cedula_conductor'] : null,
      "nombre_conductor" => isset($_POST['nombre_conductor']) ? $_POST['nombre_conductor'] : null,
      // "flete" => isset($_POST['flete']) ? $_POST['flete'] : null,
      "costo_servicio" => isset($_POST['costo_servicio']) ? $_POST['costo_servicio'] : $_POST['flete'],
      "fecha_inicio" => $_POST['fecha_inicio'],
      "hora_inicio" => $_POST['hora_inicio'],
      "capacidad" => $_POST['capacidad'],
      "tiempo_libre" => $_POST['tiempo_libre'],
      "valor_dia" => $_POST['valor_dia'],
      "estado_vehiculo" => $_POST['estado_vehiculo'] ? 'CUMPLE' : 'NO CUMPLE',
      "contenedor" => $_POST['contenedor'],
      "tara" => $_POST['tara'],
      "Proceso" => $_POST['Proceso'],
      "RecursoId" => $_POST['RecursoId'],
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
    $solicitudes = isset($_POST['solicitudes']) ? json_decode($_POST['solicitudes'], true) : null;
    $proceso = $_POST['proceso'] ?? 'PublicaciÃ³n';
    $MaestroId = $_POST['MaestroId'] ?? null;
    $ClienteId = $_POST['ClienteId'] ?? null;
    $Criterio = $_POST['Criterio'] ?? null;
    $Modalidad = $_POST['Modalidad'] ?? null;
    $ReferenciaPedidos = isset($_POST['ReferenciaPedidos']) ? json_decode($_POST['ReferenciaPedidos'], true) : null;

    $this->_subastar_pedido = $this->_modelo->Subastar_pedido($solicitudes, $proceso, $MaestroId, $ClienteId, $ReferenciaPedidos, $Criterio, $Modalidad);

    if ($this->_subastar_pedido['success'] == true) {
      $this->_calculo = $this->_modelo->calcularTiempoVencimiento($MaestroId);
      echo json_encode($this->_calculo);
    } else {
      echo json_encode($this->_subastar_pedido);
    }

    // echo json_encode($this->_subastar_pedido);
  }

  public function Listar_clientes()
  {
    $this->_clientes = $this->_modelo->Listar_clientes();
    echo json_encode($this->_clientes);
  }

  /* Insertar pedidos de la torre de control uno a uno */
  public function cancelar_asignacion()
  {
    $numdocSolicitud = $_POST['numdocSolicitud'];
    $this->_cancelar_asignacion = $this->_modelo->Cancelar_Asignacion($numdocSolicitud);
    echo json_encode($this->_cancelar_asignacion);
  }

  /* Insertar pedidos de la torre de control uno a uno */
  public function insertar_pedido_torre_control()
  {
    if (!isset($_POST['mercancias'])) {
      echo json_encode(["success" => false, "message" => "No se recibieron datos"]);
      return;
    }

    $mercancias = json_decode($_POST['mercancias'], true);
    $cliente = $_POST['cliente'];

    if (!is_array($mercancias)) {
      echo json_encode(["success" => false, "message" => "Formato de datos incorrecto"]);
      return;
    }

    $this->_insertar_pedido_torre_control = $this->_modelo->Insertar_pedido_torre_control($mercancias, $cliente);
    echo json_encode($this->_insertar_pedido_torre_control);
  }

  public function listar_recrusos_administrador()
  {
    $ventana = $_POST['ventana'] ?? null;
    $proveedor_id = $_POST['proveedor_id'] ?? null;
    $fecha_inicial = $_POST['fecha_inicial'] ?? null;
    $fecha_final = $_POST['fecha_final'] ?? null;
    $valor = $_POST['valor'] ?? null;
    $filtro = $_POST['filtro'] ?? null;

    $this->_listar_recrusos_administrador = $this->_modelo->Listar_recrusos_administrador($ventana, $proveedor_id, $fecha_inicial, $fecha_final, $valor, $filtro);
    echo json_encode($this->_listar_recrusos_administrador);
  }

  public function listar_servicios_recursos()
  {
    $MaestroId = $_POST['MaestroId'] ?? null;
    $proveedor_id = $_POST['proveedor_id'] ?? null;
    $VentanaId = $_POST['VentanaId'] ?? null;
    $this->_listar_servicios_recursos = $this->_modelo->Listar_pedidos_recrusos($MaestroId, $proveedor_id, $VentanaId);
    echo json_encode($this->_listar_servicios_recursos);
  }

  public function Listar_servicios_pedidos_recursos()
  {
    $MaestroId = $_POST['MaestroId'] ?? null;
    $this->_listar_servicios_recursos = $this->_modelo->Listar_servicios_pedidos_recursos($MaestroId);
    echo json_encode($this->_listar_servicios_recursos);
  }

  public function listar_detalle_proveedores_servicio()
  {
    $recurso = $_POST['recurso'] ?? null;
    $numdoc = $_POST['numdoc'] ?? null;
    $this->_listar_detalle_proveedores_servicio = $this->_modelo->Listar_detalle_proveedores_servicio($recurso, $numdoc);
    echo json_encode($this->_listar_detalle_proveedores_servicio);
  }

  public function listar_servicios_recursos_proveedor()
  {
    $RecursoId = $_POST['RecursoId'] ?? null;
    $proveedor_id = $_POST['proveedor_id'] ?? null;
    $proceso = $_POST['proceso'] ?? null;
    // $SolicitudesId = json_decode($_POST['SolicitudesId'], true) ?? null;
    $SolicitudesId = isset($_POST['SolicitudesId']) ? json_decode($_POST['SolicitudesId'], true) : null;
    $VentanaId = $_POST['VentanaId'] ?? null;
    $this->_listar_servicios_recursos = $this->_modelo->Listar_recursos_proveedor($RecursoId, $proveedor_id, $proceso, $SolicitudesId, $VentanaId);
    echo json_encode($this->_listar_servicios_recursos);
  }

  public function Listar_proveedores_torre_control()
  {
    $this->_listar_servicios_recursos = $this->_modelo->Listar_proveedores_torre_control();
    echo json_encode($this->_listar_servicios_recursos);
  }

  public function Buscar_usuario()
  {
    $this->_buscar_usuario = $this->_modelo->Buscar_usaurio_responsable();
    echo json_encode($this->_buscar_usuario);
  }

  public function importar_trazabilidad()
  {
    $ServicioId = $_POST["ServicioId"];
    $RecursoId = $_POST["RecursoId"];
    $datos = json_decode($_POST["globalData"], true);

    $trazabilidad = $this->_modelo->Importar_trazabilidad($ServicioId, $RecursoId, $datos);
    echo json_encode($trazabilidad);
  }

  public function listar_trazabilidad()
  {
    $fecha_inicial = $_POST["fecha_inicial"] ?? null;
    $fecha_final = $_POST["fecha_final"] ?? null;
    $ProveedorId = $_POST["proveedor_id"] ?? null;
    $ventanaId = $_POST["ventana"] ?? null;
    $valor = $_POST["valor"] ?? null;
    $filtro = $_POST["filtro"] ?? null;

    $_listar_trazabilidad = $this->_modelo->Listar_trazabilidad_torre_control($fecha_inicial, $fecha_final, $ProveedorId, $ventanaId, $valor, $filtro);
    echo json_encode($_listar_trazabilidad);
  }

  public function detalle_trazabilidad_pedido()
  {
    $ProveedorId = $_POST["proveedor_id"] ?? null;
    $ServicioId = $_POST["ServicioId"] ?? null;
    $RecursoId = $_POST["RecursoId"] ?? null;
    $_listar_trazabilidad = $this->_modelo->Detalle_trazabilidad($ProveedorId, $ServicioId, $RecursoId);
    echo json_encode($_listar_trazabilidad);
  }

  public function Crear_plantillas()
  {
    $proveedorId = $_POST["proveedor_id"] ?? null;
    $modalidad = $_POST["modalidad"] ?? null;
    $nombre_plantilla = $_POST["nombre_plantilla"] ?? null;
    $datos = json_decode($_POST["datos"], true);
    $nota = json_decode($_POST["nota"], true);
    $visualizadores = json_decode($_POST["visualizadores"], true);

    $this->_insertar_plantillas = $this->_modelo->Insertar_pedido_trazabilidad($proveedorId, $modalidad, $nombre_plantilla, $datos, $nota, $visualizadores);
    echo json_encode($this->_insertar_plantillas);
  }

  public function estado_recurso()
  {
    $RecursoId = $_POST["RecursoId"] ?? null;
    $this->_estado_recurso = $this->_modelo->Estado_Recurso($RecursoId);
    echo json_encode($this->_estado_recurso);
  }

  public function Listar_plantillas_pedidos()
  {
    $this->_listar_plantillas = $this->_modelo->Listar_Plantillas_Torre_Control();
    echo json_encode($this->_listar_plantillas);
  }

  /* Listar la gestion de las actividades para los pedido del recurso */
  public function Listar_actividades_gestion()
  {
    $RecursoId = $_POST["RecursoId"];
    $this->_lista_actividades = $this->_modelo->Lista_de_actividades($RecursoId);
    echo json_encode($this->_lista_actividades);
  }

  public function insertar_trazabilidad_pedido()
  {
    $observacion = $_POST["observacion"] ?? null;
    $documento = $_FILES["documento"] ?? null;
    $traza = $_POST["traza"] ?? null;

    $datos = json_decode($_POST["datos_trazabilidad"], true);

    $this->_insertar_trazabilidad_pedido = $this->_modelo->insertar_trazabilidad_pedido($datos, $observacion, $documento, $traza);
    echo json_encode($this->_insertar_trazabilidad_pedido);
  }

  /* Function trazabilidad de los pedidos de la torre de control */
  public function Listar_trazabilidad_pedido()
  {
    $PedidoId = $_POST['PedidoId'];
    $this->_listar_trazabilidad_pedido = $this->_modelo->Listar_trazabilidad_pedido($PedidoId);
    echo json_encode($this->_listar_trazabilidad_pedido);
  }

  public function detalle_trazabilidad_pedidos()
  {
    $RecursoId = $_POST['RecursoId'] ?? null;
    $proveedorId = $_POST['proveedor_id'] ?? null;
    $this->_detalle_trazabilidad_pedido = $this->_modelo->detalle_trazabilidad_pedidos($RecursoId, $proveedorId);
    echo json_encode($this->_detalle_trazabilidad_pedido);
  }

  public function Listar_detalle_trazabilidad_pedidos()
  {
    $RecursoId = $_POST['SolicitudeId'] ?? null;
    $this->_detalle_trazabilidad_pedido = $this->_modelo->Listar_detalle_trazabilidad_pedidos($RecursoId);
    echo json_encode($this->_detalle_trazabilidad_pedido);
  }

  public function importar_trazabilidad_pedido()
  {
    $globalData = json_decode($_POST["globalData"], true) ?? null;
    $this->_importar_trazabilidad_pedido = $this->_modelo->importar_trazabilidad_pedido($globalData);
    echo json_encode($this->_importar_trazabilidad_pedido);
  }

  public function cancelar_solicitud_pedido()
  {
    $SolicitudId = $_POST['SolicitudId'] ?? null;
    $this->_cancelar_solicitud_pedido = $this->_modelo->cancelar_solicitud_pedido_torre_control($SolicitudId);
    echo json_encode($this->_cancelar_solicitud_pedido);
  }

  public function cancelar_asignacion_recurso()
  {
    $RecursoId = $_POST['RecursoId'] ?? null;
    $this->_cancelar_solicitud_pedido = $this->_modelo->cancelar_asignacion_recurso_torre_control($RecursoId);
    echo json_encode($this->_cancelar_solicitud_pedido);
  }

  public function listar_informes_torre_control()
  {
    $FechaInicio = $_POST['fecha_inicial'] ?? null;
    $FechaFin = $_POST['fecha_final'] ?? null;
    $Filtro = $_POST['filtro'] ?? null;
    $this->_listar_informes_torre_control = $this->_modelo->Listar_informes_torre_control($FechaInicio, $FechaFin, $Filtro);
    echo json_encode($this->_listar_informes_torre_control);
  }

  public function inactivar_plantilla()
  {
    $plantillaId = $_POST['plantillaId'] ?? null;
    $Proceso = $_POST['Proceso'] ?? null;
    $this->_inactivar_plantilla = $this->_modelo->Inactivar_plantilla($plantillaId, $Proceso);
    echo json_encode($this->_inactivar_plantilla);
  }


  public function Servicios_Especiales()
  {
    $this->_listar_servicios_especiales = $this->_modelo->Servicios_Especiales();
    echo json_encode($this->_listar_servicios_especiales);
  }

  public function listar_servicios_especiales_recursos_proveedor()
  {
    $ProvedorId = $_POST['ProveedorId'] ?? null;
    $MaestroId = $_POST['MaestroId'] ?? null;
    $this->_listar_servicios_especiales = $this->_modelo->Listar_Servicios_Especiales_Proveedor($ProvedorId, $MaestroId);
    echo json_encode($this->_listar_servicios_especiales);
  }

  public function actualizar_valor_servicio()
  {
    $servicio_id = $_POST['servicio_id'] ?? null;
    $proveedor_id = $_POST['proveedor_id'] ?? null;
    $valor = $_POST['valor'] ?? null;
    $maestro_id = $_POST['maestro_id'] ?? null;

    $this->_listar_servicios_valor = $this->_modelo->Actualizar_valor_servicio($servicio_id, $proveedor_id, $valor, $maestro_id);
    echo json_encode($this->_listar_servicios_valor);
  }

  public function cancelar_servicio_espacial()
  {
    $RecursoId = $_POST['RecursoId'] ?? null;
    $ServicioId = $_POST['ServicioId'] ?? null;
    $ProveedorId = $_POST['ProveedorId'] ?? null;
    $this->_cancelar_servicio_especial = $this->_modelo->Cancelar_Servicio_Especial($RecursoId, $ServicioId, $ProveedorId);
    echo json_encode($this->_cancelar_servicio_especial);
  }
  public function aprobar_servicio_espacial()
  {
    $RecursoId = $_POST['RecursoId'] ?? null;
    $ServicioId = $_POST['ServicioId'] ?? null;
    $ProveedorId = $_POST['ProveedorId'] ?? null;
    $this->_aprobar_servicio_especial = $this->_modelo->Aprobar_Servicio_Especial($RecursoId, $ServicioId, $ProveedorId);
    echo json_encode($this->_aprobar_servicio_especial);
  }
  public function rechazar_servicio_espacial()
  {
    $RecursoId = $_POST['RecursoId'] ?? null;
    $ServicioId = $_POST['ServicioId'] ?? null;
    $ProveedorId = $_POST['ProveedorId'] ?? null;
    $this->_rechazar_servicio_especial = $this->_modelo->Rechazar_Servicio_Especial($RecursoId, $ServicioId, $ProveedorId);
    echo json_encode($this->_rechazar_servicio_especial);
  }

  public function traer_servicio_especial()
  {
    $this->_traer_servicio_especial = $this->_modelo->Servicios_Especiales();
    echo json_encode($this->_traer_servicio_especial);
  }

  public function agregar_servicios_especiales()
  {
    $RecursoId = isset($_POST['RecursoId']) ? $_POST['RecursoId'] : null;
    $ArrayProveedorId = isset($_POST['ArrayProveedorId']) ? json_decode($_POST['ArrayProveedorId'], true) : null;
    $ArrayServicioId = isset($_POST['ArrayServicioId']) ? json_decode($_POST['ArrayServicioId'], true) : null;
    $ArrayPedidoId = isset($_POST['ArrayPedidoId']) ? json_decode($_POST['ArrayPedidoId'], true) : null;
    $ArrayServicioEspId = isset($_POST['ArrayServicioEspId']) ? json_decode($_POST['ArrayServicioEspId'], true) : null;

    $this->_agregar_servicio_especial = $this->_modelo->Agregar_Servicio_Especial($RecursoId, $ArrayProveedorId, $ArrayServicioId, $ArrayPedidoId, $ArrayServicioEspId);
    echo json_encode($this->_agregar_servicio_especial);
  }

  public function Filtro_indicadores()
  {
    $Filtro = $_POST['Filtro'] ?? null;
    $this->_listar_servicios_valor = $this->_modelo->Filtros_indicadores_torre_control($Filtro);
    echo json_encode($this->_listar_servicios_valor);
  }

  public function Aplicar_filtro_indicadores()
  {
    $Filtro = $_POST['Filtro'] ?? null;
    $Year = $_POST['Year'] ?? null;
    $Mes = $_POST['Mes'] ?? null;
    $Proveedor = $_POST['Proveedor'] ?? null;

    $this->_listar_servicios_valor = $this->_modelo->Aplicar_filtro_indicador($Filtro, $Year, $Mes, $Proveedor);
    echo json_encode($this->_listar_servicios_valor);
  }

  public function Editar_Plantilla()
  {
    $plantillaId = $_POST['plantillaId'] ?? null;
    $this->_editar_plantilla = $this->_modelo->Editar_plantilla($plantillaId);
    echo json_encode($this->_editar_plantilla);
  }

  /* Insertar Gestion de activiades de los pedidos*/
  // public function Insertar_gestion_pedido()
  // {
  //   $nundoc = $_POST['nundoc'] ?? null;
  //   $parametros_pedido = $_POST['parametros_pedido'] ?? null;
  //   $parametros_punto_pedido_opcion = $_POST['parametros_punto_pedido_opcion'] ?? null;
  //   $observacion = $_POST['observacion'] ?? null;
  //   $estado_actividad = $_POST['estado_actividad'] ?? null;
  //   // $documento = (isset($_FILES["documento"])) ? $_FILES["documento"] : $_POST['documento'];
  //   $documentos = isset($_FILES['documentos']) ? $_FILES['documentos'] : $_POST['documento'];
  //   $costo_ejecutado = $_POST['costo_ejecutado'] ?? null;

  //   $datos = [
  //     "nundoc" => $nundoc,
  //     "parametros_pedido" => $parametros_pedido,
  //     "parametros_punto_pedido_opcion" => $parametros_punto_pedido_opcion,
  //     "observacion" => $observacion,
  //     "estado_actividad" => $estado_actividad,
  //     "costo_ejecutado" => $costo_ejecutado,
  //     "documentos" => $documentos,
  //     "estado" => "ACTIVO",
  //     "publicar" => $_POST["publicar"],
  //   ];

  //   $this->_insertar_gestion_pedido = $this->_modelo->Insertar_gestion_pedido($datos);
  //   echo json_encode($this->_insertar_gestion_pedido);
  // }

  // public function Insertar_gestion_pedido()
  // {
  //   $nundoc = $_POST['nundoc'] ?? null;
  //   $parametros_pedido = $_POST['parametros_pedido'] ?? null;
  //   $parametros_punto_pedido_opcion = $_POST['parametros_punto_pedido_opcion'] ?? null;
  //   $observacion = $_POST['observacion'] ?? null;
  //   $estado_actividad = $_POST['estado_actividad'] ?? null;
  //   $costo_ejecutado = $_POST['costo_ejecutado'] ?? null;
  //   $publicar = $_POST['publicar'] ?? 'NO';

  //   /**
  //    * MANEJO INTELIGENTE DEL DOCUMENTO
  //    */
  //   if (
  //     isset($_FILES['documento']) &&
  //     $_FILES['documento']['error'] === UPLOAD_ERR_OK
  //   ) {
  //     // CASO A: archivo adjunto
  //     $documento = $_FILES['documento'];
  //   } elseif (!empty($_POST['documento'])) {
  //     // CASO B: texto "Sin_evidencia"
  //     $documento = $_POST['documento'];
  //   } else {
  //     // CASO C: nada
  //     $documento = null;
  //   }

  //   $datos = [
  //     "nundoc" => $nundoc,
  //     "parametros_pedido" => $parametros_pedido,
  //     "parametros_punto_pedido_opcion" => $parametros_punto_pedido_opcion,
  //     "observacion" => $observacion,
  //     "estado_actividad" => $estado_actividad,
  //     "costo_ejecutado" => $costo_ejecutado,
  //     "documento" => $documento,
  //     "estado" => "ACTIVO",
  //     "publicar" => $publicar,
  //   ];

  //   $resultado = $this->_modelo->Insertar_gestion_pedido($datos);
  //   echo json_encode($resultado);
  // }

  public function Insertar_gestion_pedido()
  {
    $nundoc = $_POST['nundoc'] ?? null;
    $parametros_pedido = $_POST['parametros_pedido'] ?? null;
    $parametros_punto_pedido_opcion = $_POST['parametros_punto_pedido_opcion'] ?? null;
    $observacion = $_POST['observacion'] ?? null;
    $estado_actividad = $_POST['estado_actividad'] ?? null;
    $costo_ejecutado = $_POST['costo_ejecutado'] ?? null;
    $publicar = $_POST['publicar'] ?? 'NO';

    /**
     * NORMALIZACIÓN DE DOCUMENTOS
     * ----------------------------------
     * Puede llegar como:
     * - FILE único
     * - FILE[]
     * - Texto "Sin_evidencia"
     * - Nada
     */

    $documentos = null;

    // 🅲️ MÚLTIPLES ARCHIVOS
    if (
      isset($_FILES['documentos']) &&
      is_array($_FILES['documentos']['name'])
    ) {
      $documentos = [];

      foreach ($_FILES['documentos']['name'] as $i => $nombre) {
        if ($_FILES['documentos']['error'][$i] === UPLOAD_ERR_OK) {
          $documentos[] = [
            'name'     => $_FILES['documentos']['name'][$i],
            'type'     => $_FILES['documentos']['type'][$i],
            'tmp_name' => $_FILES['documentos']['tmp_name'][$i],
            'error'    => $_FILES['documentos']['error'][$i],
            'size'     => $_FILES['documentos']['size'][$i],
          ];
        }
      }

      if (empty($documentos)) {
        $documentos = null;
      }
    }
    // 🅱️ UN SOLO ARCHIVO
    elseif (
      isset($_FILES['documento']) &&
      $_FILES['documento']['error'] === UPLOAD_ERR_OK
    ) {
      $documentos = $_FILES['documento'];
    }
    // 🅰️ SIN EVIDENCIA (TEXTO)
    elseif (
      isset($_POST['documentos']) &&
      is_array($_POST['documentos']) &&
      in_array('Sin_evidencia', $_POST['documentos'], true)
    ) {
      $documentos = 'Sin_evidencia';
    }
    // 🅳️ NADA
    else {
      $documentos = null;
    }

    $datos = [
      "nundoc" => $nundoc,
      "parametros_pedido" => $parametros_pedido,
      "parametros_punto_pedido_opcion" => $parametros_punto_pedido_opcion,
      "observacion" => $observacion,
      "estado_actividad" => $estado_actividad,
      "costo_ejecutado" => $costo_ejecutado,
      "documentos" => $documentos,
      "estado" => "ACTIVO",
      "publicar" => $publicar,
    ];

    $resultado = $this->_modelo->Insertar_gestion_pedido($datos);
    echo json_encode($resultado);
  }

  public function Guardar_Actividad()
  {
    $id_tipo_padre = $_POST["id_tipo_padre"] ?? null;
    $nombre_operacion = $_POST["nombre_operacion"] ?? null;
    $this->_insertar_actividad_trazabilidad = $this->_modelo->Insertar_actividad($id_tipo_padre, $nombre_operacion);
    echo json_encode($this->_insertar_actividad_trazabilidad);
  }

  public function Editar_Actividad()
  {
    $id = $_POST['id_opcion'] ?? null;
    $nombre = $_POST['nombre'] ?? '';
    $estado = $_POST['estado'] ?? '';

    if (!$id || !$nombre || !$estado) {
      echo json_encode([
        'numero' => 400,
        'mensaje' => 'Faltan datos.'
      ]);
      return;
    }
    $this->_editar_actividad_trazabilidad = $this->_modelo->Editar_actividad($id, $nombre, $estado);
    echo json_encode($this->_editar_actividad_trazabilidad);
  }

  public function Rechazar_recurso()
  {
    $recurso_id = $_POST['data_recurso'] ?? null;
    $this->_rechazar_recurso = $this->_modelo->Rechazar_recurso($recurso_id);
    echo json_encode($this->_rechazar_recurso);
  }

  //Editar recursos
  public function editar_datos_recurso()
  {
    $RecursoId = $_POST['RecursoId'] ?? null;
    // $datos = json_decode($_POST['datos'], true) ?? null;

    if (!$RecursoId) {
      echo json_encode(["status" => false, "message" => "Faltan datos para la ediciÃ³n"]);
      return;
    }

    $this->_editar_datos_recurso = $this->_modelo->Editar_datos_recurso($RecursoId);
    echo json_encode($this->_editar_datos_recurso);
  }

  public function guardar_editar_datos_recurso()
  {

    $MaestroId = $_POST['MaestroId'] ?? null;
    $valor_servicio = $_POST['valor_servicio'] ?? null;
    $cedula_conductor = $_POST['cedula_conductor'] ?? null;
    $nombre_conductor = $_POST['nombre_conductor'] ?? null;
    $placa = $_POST['placa'] ?? null;
    $capacidad_vehiculo = $_POST['capacidad_vehiculo'] ?? null;
    $tiempo_libre = $_POST['tiempo_libre'] ?? null;
    $stand_bay = $_POST['stand_bay'] ?? null;
    $cumplimiento = $_POST['cumplimiento'] ?? null;
    $contenedor = $_POST['contenedor'] ?? null;
    $tara = $_POST['tara'] ?? null;

    $datos = [
      "MaestroId" => $MaestroId,
      "valor_servicio" => $valor_servicio,
      "cedula_conductor" => $cedula_conductor,
      "nombre_conductor" => $nombre_conductor,
      "placa" => $placa,
      "capacidad_vehiculo" => $capacidad_vehiculo,
      "tiempo_libre" => $tiempo_libre,
      "stand_bay" => $stand_bay,
      "cumplimiento" => $cumplimiento,
      "contenedor" => $contenedor,
      "tara" => $tara
    ];
    $this->_editar_datos_recurso = $this->_modelo->Actualizar_datos_recurso($datos);
    echo json_encode($this->_editar_datos_recurso);
  }

  public function Linea_Tiempo_pedidos()
  {
    $PedidoId = $_POST['PedidoId'] ?? null;
    $this->_linea_Tiempo_pedidos = $this->_modelo->Linea_Tiempo_pedidos($PedidoId);
    echo json_encode($this->_linea_Tiempo_pedidos);
  }

  public function insertar_fecha_estimada()
  {
    $FechaEstimada = $_POST['FechaEstimada'] ?? null;
    $HoraEstimada = $_POST['HoraEstimada'] ?? null;
    $traza = $_POST["traza"] ?? null;
    $datos = json_decode($_POST["datos_trazabilidad"], true);


    $this->_fecha_estimada_entrega_pedido = $this->_modelo->Fecha_estimada_entrega_pedido($FechaEstimada, $HoraEstimada, $traza, $datos);
    echo json_encode($this->_fecha_estimada_entrega_pedido);
  }

  public function listar_graficos()
  {
    $fecha_inicial = $_POST['fecha_inicial'] ?? NULL;
    $fecha_final = $_POST['fecha_final'] ?? NULL;

    $this->_listar_graficos = $this->_modelo->Listar_graficos_ind($fecha_inicial, $fecha_final);
    echo json_encode($this->_listar_graficos);
  }

  public function listar_graficos_asignados()
  {
    $fecha_inicial = $_POST['fecha_inicial'] ?? NULL;
    $fecha_final = $_POST['fecha_final'] ?? NULL;
    $this->_listar_graficos_asignados = $this->_modelo->Listar_graficos_asignados($fecha_inicial, $fecha_final);
    echo json_encode($this->_listar_graficos_asignados);
  }

  public function Detalle_informe_pedidos()
  {

    $tipo_data = $_POST['tipo'] ?? '';
    $fecha_inicial = $_POST['fecha_inicial'] ?? NULL;
    $fecha_final = $_POST['fecha_final'] ?? NULL;

    $this->_detalle_listar_graficos = $this->_modelo->detalle_listar_graficos($tipo_data, $fecha_inicial, $fecha_final);
    echo json_encode($this->_detalle_listar_graficos);
  }

  public function listar_grafico_pedidos()
  {
    $params = $_POST['params'] ?? '';
    $fecha_inicial = $_POST['fecha_inicial'] ?? NULL;
    $fecha_final = $_POST['fecha_final'] ?? NULL;

    $this->_detalle_listar_graficos = $this->_modelo->detalle_pedidos_graficos($params, $fecha_inicial, $fecha_final);
    echo json_encode($this->_detalle_listar_graficos);
  }

  public function listar_grafico_trazabilidad()
  {
    $params = $_POST['params'] ?? '';
    $fecha_inicial = $_POST['fecha_inicial'] ?? NULL;
    $fecha_final = $_POST['fecha_final'] ?? NULL;

    $this->_detalle_listar_graficos = $this->_modelo->detalle_graficos_trazabilidad($params, $fecha_inicial, $fecha_final);
    echo json_encode($this->_detalle_listar_graficos);
  }

  public function Comportaidos_Conmigo()
  {
    $this->_compartidos_conmigo = $this->_modelo->Listar_pedidos_por_responsable();
    echo json_encode($this->_compartidos_conmigo);
  }

  public function Listar_actividades_gestion_compartidos()
  {
    $nundoc = $_POST["Numdoc"];
    $RecursoId = $_POST["RecursoId"];
    $this->_lista_actividades_compartidas = $this->_modelo->Lista_de_actividades_compartidos($nundoc, $RecursoId);
    echo json_encode($this->_lista_actividades_compartidas);
  }

  # Seguimiento Facturacion
  public function Listar_recursos_facturacio()
  {
    $fecha_inicial = $_POST['fecha_inicial'] ?? null;
    $fecha_final = $_POST['fecha_final'] ?? null;

    $this->_lista_recursos_facturacion = $this->_modelo->GetSeguimientoFacturacion($fecha_inicial, $fecha_final);
    echo json_encode($this->_lista_recursos_facturacion);
  }

  public function GetDetalleFactura()
  {
    $recurso_id   = $_POST['recurso_id'] ?? null;
    $proveedor_id = $_POST['proveedor_id'] ?? null;

    if (!$recurso_id || !$proveedor_id) {
      echo json_encode([
        "success" => false,
        "message" => "Faltan parámetros"
      ]);
      return;
    }

    $this->_modelo = $this->loadModel("torrecontrol");

    $respuesta = $this->_modelo->GetDetalleFacturaModel($recurso_id, $proveedor_id);

    echo json_encode($respuesta);
  }

  public function GuardarSeguimientoFactura()
  {
    $recurso_id  = $_POST['recurso_id'] ?? null;
    $proveedor_id = $_POST['proveedor_id'] ?? null;
    $valor_principal = $_POST['valor_servicio_principal'] ?? null;
    $soporte_flete = $_FILES['soporte_flete'] ?? null;

    if (!$recurso_id || !$proveedor_id) {
      echo json_encode(["success" => false, "message" => "Faltan datos"]);
      return;
    }

    $servicios = $_POST['servicios'] ?? [];

    $this->_modelo = $this->loadModel("torrecontrol");

    $resp = $this->_modelo->GuardarSeguimientoFacturaModel(
      $recurso_id,
      $proveedor_id,
      $valor_principal,
      $soporte_flete,
      $servicios,
      $_FILES
    );

    echo json_encode($resp);
  }

  public function GuardarEstadoFacturacion()
  {
    $recurso_id     = $_POST['recurso_id'] ?? null;
    $proveedor_id   = $_POST['proveedor_id'] ?? null;
    $estado         = $_POST['estado_aprobacion'] ?? null;
    $motivo         = $_POST['motivo'] ?? null;

    if (!$recurso_id || !$proveedor_id || !$estado) {
      echo json_encode(["success" => false, "message" => "Faltan datos para actualizar el estado."]);
      return;
    }

    $this->_modelo = $this->loadModel("torrecontrol");

    $resp = $this->_modelo->GuardarEstadoFacturacionModel(
      $recurso_id,
      $proveedor_id,
      $estado,
      $motivo
    );

    echo json_encode($resp);
  }

  public function GuardarServiciosEspeciales()
  {
    $maestro_id = $_POST['maestro_id'] ?? null;
    $servicio_id = $_POST['servicio_id'] ?? null;
    $proveedor_id = $_POST['proveedor_id'] ?? null;
    $servicios = $_POST['servicios'] ?? [];

    if (!$maestro_id || empty($servicios)) {
      echo json_encode(["success" => false, "message" => "Datos incompletos."]);
      return;
    }

    $resp = $this->_modelo->InsertarServiciosEspeciales($maestro_id, $servicios, $servicio_id, $proveedor_id);

    echo json_encode($resp);
  }

  public function GuardarSoporteOrdenCompra()
  {
    $recurso   = $_POST['recurso'] ?? null;
    $proveedor = $_POST['proveedor'] ?? null;
    $file      = $_FILES['soporte_orden_compra'] ?? null;

    if (!$file || !$recurso || !$proveedor) {
      echo json_encode(["success" => false, "message" => "Datos incompletos."]);
      return;
    }

    // Validaciones básicas
    if ($file['error'] !== 0) {
      echo json_encode(["success" => false, "message" => "Error al subir el archivo."]);
      return;
    }

    // Pasar al modelo
    $resp = $this->_modelo->InsertarOrdenCompra($file, $recurso, $proveedor);

    echo json_encode($resp);
  }

  public function GuardarSoporteFacturacion()
  {
    $recurso   = $_POST['recurso'] ?? null;
    $proveedor = $_POST['proveedor'] ?? null;
    $file      = $_FILES['soporte_facturacion'] ?? null;

    if (!$file || !$recurso || !$proveedor) {
      echo json_encode(["success" => false, "message" => "Datos incompletos."]);
      return;
    }

    // Validaciones básicas
    if ($file['error'] !== 0) {
      echo json_encode(["success" => false, "message" => "Error al subir el archivo."]);
      return;
    }

    // Pasar al modelo
    $resp = $this->_modelo->InsertarSoporteFacturacion($file, $recurso, $proveedor);

    echo json_encode($resp);
  }

  public function ActualizarOrdenesCompra()
  {
    header("Content-Type: application/json; charset=utf-8");

    $body = file_get_contents("php://input");
    $data = json_decode($body, true);

    if (!$data) {
      echo json_encode([
        "success" => false,
        "error" => "No se recibieron datos."
      ]);
      return;
    }

    foreach ($data as $row) {
      $pedido = $row["pedido"];
      $orden  = $row["orden"];

      // print_r($row["pedido"]);
      // Actualizar en base de datos
      $this->_modelo->ActualizarOrdenCompra($pedido, $orden);
    }
    echo json_encode(["success" => true]);
  }

  public function AprobarMasivo()
  {
    header("Content-Type: application/json; charset=utf-8");

    $json = $_POST['registros'] ?? null;
    if (!$json) {
      echo json_encode(['status' => false, 'message' => 'Sin datos']);
      exit;
    }

    $registros = json_decode($json, true);

    // Extraer SOLO recurso_id
    $recursoIds = array_unique(array_column($registros, 'recurso_id'));

    if (empty($recursoIds)) {
      echo json_encode(['status' => false, 'message' => 'No hay recursos válidos']);
      exit;
    }

    $ok = $this->_modelo->aprobarMasivoPorRecurso($recursoIds);

    echo json_encode([
      'status'  => $ok,
      'message' => $ok
        ? 'Aprobación masiva realizada correctamente'
        : 'No se pudo realizar la aprobación'
    ]);
  }

  public function ListaProveedores()
  {
    $this->_lista_recursos_facturacion = $this->_modelo->ListarProveedores();
    echo json_encode($this->_lista_recursos_facturacion);
  }

  public function ReasignarProveedor()
  {
    header("Content-Type: application/json; charset=utf-8");

    $response = function ($data) {
      echo json_encode($data, JSON_UNESCAPED_UNICODE);
      exit;
    };

    $maestroId           = $_POST['maestro_id'] ?? null;
    $proveedorActualId   = $_POST['proveedor_actual_id'] ?? null;
    $proveedorNuevoId    = $_POST['proveedor_nuevo_id'] ?? null;
    $MotivoCancelacion   = trim($_POST['motivo_cancelacion'] ?? '');

    // ===============================
    // VALIDACIONES
    // ===============================
    if (!$maestroId || !$proveedorActualId || !$proveedorNuevoId || !$MotivoCancelacion) {
      $response([
        'status' => false,
        'error'  => 'Debe diligenciar todos los campos obligatorios'
      ]);
    }

    if ($proveedorActualId == $proveedorNuevoId) {
      $response([
        'status' => false,
        'error'  => 'El proveedor nuevo no puede ser igual al proveedor actual'
      ]);
    }

    // ===============================
    // EJECUTAR MODELO
    // ===============================
    $resultado = $this->_modelo->ReasignarProveedorMaestro(
      $maestroId,
      $proveedorActualId,
      $proveedorNuevoId,
      $MotivoCancelacion,
      $_SESSION['usuario_id'] ?? null
    );

    if (!$resultado) {
      $response([
        'status' => false,
        'error'  => 'No fue posible reasignar el proveedor. Intente nuevamente.'
      ]);
    }

    $response([
      'status'  => true,
      'message' => 'Proveedor reasignado correctamente'
    ]);
  }

  public function cancelar_asignacion_recurso_subasta()
  {
    header("Content-Type: application/json; charset=utf-8");

    $RecursoId = $_POST['RecursoId'] ?? null;
    $ProveedoresId = $_POST['ProveedoresId'] ?? null;
    $motivo_cancelacion = $_POST['motivo_cancelacion'] ?? null;

    if (!$RecursoId) {
      echo json_encode([
        'success' => false,
        'message' => 'Recurso no válido'
      ]);
      exit;
    }

    $resultado = $this->_modelo->cancelar_asignacion_recurso_torre_control_subasta($RecursoId, $ProveedoresId, $motivo_cancelacion);

    echo json_encode($resultado, JSON_UNESCAPED_UNICODE);
  }

  public function ListarRecursosPendientes()
  {
    $lista_recursos_pendientes = $this->_modelo->ListarRecursosPendientes();
    echo json_encode($lista_recursos_pendientes);
  }

  public function RetornarRecurso()
  {
    header("Content-Type: application/json; charset=utf-8");

    $response = function ($data) {
      echo json_encode($data, JSON_UNESCAPED_UNICODE);
      exit;
    };

    $maestroId      = $_POST['maestro_id'] ?? null;
    $Proveedor_Id   = $_POST['Proveedor_Id'] ?? null;


    // ===============================
    // VALIDACIONES
    // ===============================
    if (!$maestroId || !$Proveedor_Id) {
      $response([
        'status' => false,
        'error'  => 'Debe diligenciar todos los campos obligatorios'
      ]);
    }

    // ===============================
    // EJECUTAR MODELO
    // ===============================
    $resultado = $this->_modelo->RetornarRecursoRechazado($maestroId, $Proveedor_Id);

    if (!$resultado) {
      $response([
        'status' => false,
        'error'  => 'No fue posible reasignar el proveedor. Intente nuevamente.'
      ]);
    }

    $response([
      'status'  => true,
      'message' => 'Proveedor reasignado correctamente'
    ]);
  }
}
