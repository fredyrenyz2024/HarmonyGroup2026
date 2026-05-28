<?php

session_start();
class pantallasController extends Controller
{
  private $_modelo;
  private $_modulos;
  private $_pantallas;
  private $_ventanas;
  private $_guardar_pantalla;
  private $_guardar_ventana;
  private $_guardar_filtro;

  public function __construct()
  {
    parent::__construct();
    $this->_modelo = $this->loadModel('Pantallas');
    // $this->_modelo = $this->loadModel('parametro');
  }

  public function index()
  {
    $this->_view->titulo = 'Nueva Pantalla';
    $this->_view->renderizar('pantallas', 'pantalla'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
  }

  public function nueva_ventana()
  {
    $this->_view->titulo = 'Nueva Ventana';
    $this->_view->renderizar('ventanas', 'pantalla'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
  }

  public function nuevo_filtro()
  {
    $this->_view->titulo = 'Crear Filtro';
    $this->_view->renderizar('filtros', 'pantalla'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
  }

  public function parametro_general()
  {
    $this->_view->titulo = 'Parametro general';
    $this->_view->renderizar('index', 'pantalla'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
  }

  public function generales()
  {
    $this->_view->titulo = 'Nuevo Parametro';
    $this->_view->renderizar_ventana('parametros_general', 'pantallas'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
  }

  public function causales_de_aprobacion()
  {
    $this->_view->titulo = 'Nuevo Parametro';
    $this->_view->renderizar_ventana('causales_aprobacion', 'pantallas'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
  }

  public function zonas()
  {
    $this->_view->titulo = 'Nuevo Parametro';
    $this->_view->renderizar_ventana('zonas/zona', 'pantallas'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
  }

  public function Cargar_Datos()
  {
    $this->_modulos = $this->_modelo->Listar_Datos_Parametros();
    echo json_encode($this->_modulos);
  }

  public function Cargar_pantallas()
  {
    $this->_pantallas = $this->_modelo->Listar_Pantallas_Trabajo();
    echo json_encode($this->_pantallas);
  }

  public function Cargar_ventanas()
  {
    $this->_ventanas = $this->_modelo->Listar_ventanas_Trabajo();
    echo json_encode($this->_ventanas);
  }

  public function Insertar_pantalla()
  {
    $modulo = $_POST['modulo'];
    $menu = $_POST['menu'];
    $nombre_pantalla = $_POST['nombre_pantalla'];
    $estado_pantalla = $_POST['estado_pantalla'];
    $descripcion_pantalla = $_POST['descripcion_pantalla'];
    $this->_guardar_pantalla = $this->_modelo->Guardar_Pantalla($modulo, $menu, $nombre_pantalla, $estado_pantalla, $descripcion_pantalla);
    echo json_encode($this->_guardar_pantalla);
  }

  public function Insertar_ventana()
  {
    $pantalla = $_POST['pantalla'];
    $nombre_ventana = $_POST['nombre_ventana'];
    $estadoVentana = $_POST['estadoVentana'];
    $ordenventana = $_POST['ordenventana'];
    $descripcion_ventana = $_POST['descripcion_ventana'];
    $this->_guardar_ventana = $this->_modelo->Guardar_Ventana($pantalla, $nombre_ventana, $estadoVentana, $ordenventana, $descripcion_ventana);
    echo json_encode($this->_guardar_ventana);
  }
  public function Insertar_Filtro()
  {
    $ventana = $_POST['ventana'];
    $nombre_filtro = $_POST['nombre_filtro'];
    $estadoFiltro = $_POST['estadoFiltro'];
    $descripcion_filtro = $_POST['descripcion_filtro'];
    $tipo_campo = $_POST['tipo_campo'];
    $label = $_POST['label'];
    $opcionesInput = isset($_POST["opcionesInput"]) ? json_decode($_POST["opcionesInput"], true) : [];
    $this->_guardar_filtro = $this->_modelo->Guardar_Filtro($ventana, $nombre_filtro, $estadoFiltro, $descripcion_filtro, $tipo_campo, $label, $opcionesInput);
    echo json_encode($this->_guardar_filtro);
  }
}
