<?php

session_start();
class clienteController extends Controller
{
  private $_modelo2;
  private $_list_pedidos;
  private $_list_detalles_despachos;
  private $_list_cordenadas_despachos;
  private $_list_detalle_actividades_pedidos;
  private $_list_detalle_actividades_pedidos_cliente;
  private $_list_despachos_activos;
  private $_list_tracking_activos;
  public function __construct()
  {
    parent::__construct();
    $this->_modelo2 = $this->loadModel('cliente');
  }

  public function index() {}



  public function list_pedidos()
  {
    $fecha_inicial = isset($_POST['fecha_inicial']) ? $_POST['fecha_inicial'] : '';
    $fecha_final = isset($_POST['fecha_final']) ? $_POST['fecha_final'] : '';
    $cliente = $_POST['cliente_id'];
    $filtro = $_POST['filtro'];
    $numdoc_predido = isset($_POST['numdoc_predido']) == '' ? '' : $_POST['numdoc_predido'];
    $this->_list_pedidos = $this->_modelo2->Listar_Pedidos($fecha_inicial, $fecha_final, $cliente, $filtro, $numdoc_predido);
    if ($this->_list_pedidos['status'] == 200) {
      echo json_encode($this->_list_pedidos['result']);
    } else {
      echo json_encode($this->_list_pedidos['result']);
    }
  }

  public function list_despachos()
  {
    $fecha_inicial = isset($_POST['fecha_inicial']) ? $_POST['fecha_inicial'] : '';
    $fecha_final = isset($_POST['fecha_final']) ? $_POST['fecha_final'] : '';
    $cliente = $_POST['cliente_id'];
    $filtro = $_POST['filtro'];
    $numdoc_predido = isset($_POST['numdoc_predido']) == '' ? '' : $_POST['numdoc_predido'];
    $this->_list_pedidos = $this->_modelo2->Listar_Despachos($fecha_inicial, $fecha_final, $cliente, $filtro, $numdoc_predido);
    if ($this->_list_pedidos['status'] == 200) {
      echo json_encode($this->_list_pedidos['result']);
    } else {
      echo json_encode($this->_list_pedidos['result']);
    }
  }

  public function List_detalles_Despachos()
  {
    $fecha_inicial = isset($_POST['fecha_inicial']) ? $_POST['fecha_inicial'] : '';
    $fecha_final = isset($_POST['fecha_final']) ? $_POST['fecha_final'] : '';
    $cliente = $_POST['cliente_id'];
    $filtro = $_POST['filtro'];
    $numdoc_solicitud = $_POST['numdoc_solicitud'];
    $this->_list_detalles_despachos = $this->_modelo2->Listar_Detalles_Despachos($fecha_inicial, $fecha_final, $cliente, $filtro, $numdoc_solicitud);
    if ($this->_list_detalles_despachos['status'] == 200) {
      echo json_encode($this->_list_detalles_despachos['result']);
    } else {
      echo json_encode($this->_list_detalles_despachos['result']);
    }
  }

  public function plan_ruta()
  {
    $plan_ruta = $_POST['plan_ruta'];
    $manifiesto = $_POST['manifiesto'];
    $referencia = isset($_POST['referencia']) ? $_POST['referencia'] : '';
    $this->_list_cordenadas_despachos = $this->_modelo2->Cordenadas_plan_ruta($plan_ruta, $manifiesto, $referencia);
    echo json_encode($this->_list_cordenadas_despachos);
  }

  /* Gestion de los detalles de los pedidos */
  public function detalle_actividades_pedidos()
  {
    $cliente = $_POST['cliente'];
    $numdoc = $_POST['numdoc'];
    $solicitud_id = $_POST['solicitud_id'];
    $this->_list_detalle_actividades_pedidos = $this->_modelo2->Listar_actividades_pedido($cliente, $numdoc, $solicitud_id);
    echo json_encode($this->_list_detalle_actividades_pedidos);
  }

  public function detalle_actividades_clientes()
  {
    $cliente = $_POST['cliente'];
    $proceso_id = $_POST['proceso_id'];
    $actividad_id = $_POST['actividad_id'];
    $this->_list_detalle_actividades_pedidos_cliente = $this->_modelo2->Listar_detalles_pedido_actividad($cliente, $proceso_id, $actividad_id);
    echo json_encode($this->_list_detalle_actividades_pedidos_cliente);
  }

  /* Despachos activos */
  public function list_despachos_activos()
  {
    $cliente = $_SESSION["usuario"]["id_cliente"];
    $this->_list_despachos_activos = $this->_modelo2->Listar_despachos_activos($cliente);
    echo json_encode($this->_list_despachos_activos);
  }

  /* LISTAR DESPACHO DE TRACKING */

  public function Tracking()
  {
    $filtro = $_POST["filtro"];
    $fecha_inicial = $_POST["fecha_inicial"];
    $fecha_final = $_POST["fecha_final"];
    $criterio = $_POST["criterio"] == '' ? '' : $_POST["criterio"];
    $cliente = $_SESSION["usuario"]["id_cliente"];
    $this->_list_tracking_activos = $this->_modelo2->Tracking($filtro, $fecha_inicial, $fecha_final, $criterio, $cliente);
    echo json_encode($this->_list_tracking_activos);
  }
}
