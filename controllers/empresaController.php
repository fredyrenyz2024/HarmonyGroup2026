<?php

class empresaController extends Controller
{

  private $_modelo;
  private $_gaurdar_empres;
  private $_listar_empresas;
  private $_guardar_agencia;
  private $_listar_agencias;
  private $_guardar_ambiente;

  public function __construct()
  {
    parent::__construct();
    $this->_modelo = $this->loadModel('empresa');
  }

  public function index()
  {
  }

  public function empresa()
  {
    $this->_view->titulo = 'Empresas';
    $this->_view->renderizar('index', 'empresa');
  }


  public function Guardar_empresa()
  {
    $nit = $_POST['nit'];
    $nomre_razonsocial = $_POST['nomre_razonsocial'];
    $repesentante = $_POST['repesentante'];
    $digito_empresa = $_POST['digito_empresa'];
    $this->_gaurdar_empres = $this->_modelo->Registrar_empresa($nit, $nomre_razonsocial, $repesentante, $digito_empresa);
    echo json_encode($this->_gaurdar_empres);
  }

  public function listar_empresa()
  {
    $this->_listar_empresas = $this->_modelo->Listar_empresas();
    echo json_encode($this->_listar_empresas);
  }

  public function Guardar_Agencia()
  {
    $empresa = $_POST['empresa'];
    $nombre_agencia = $_POST['nombre_agencia'];
    $estado_agencia = $_POST['estado_agencia'];
    $abreviatura = $_POST['abreviatura'];
    $this->_guardar_agencia = $this->_modelo->Guardar_agencias($empresa, $nombre_agencia, $estado_agencia, $abreviatura);
    echo json_encode($this->_guardar_agencia);
  }

  public function listar_agencia()
  {
    $this->_listar_agencias = $this->_modelo->listar_agencias();
    echo json_encode($this->_listar_agencias);
  }

  public function Agregar_Ambiente()
  {
    $agencia = $_POST['agencia'];
    $ambiente_agencia = $_POST['ambiente_agencia'];
    $proveedor = $_POST['proveedor'];
    // $nombre_url = json_decode($_POST['nombre_url']);
    $url_conexion = json_decode($_POST['url_conexion']);
    foreach ($url_conexion as  $value) {
    }
    // var_dump($nombre_url);
    // echo '</br>';
    // var_dump($url_conexion);
    // exit(0);
    $this->_listar_agencias = $this->_modelo->Agregar_Ambientes($agencia, $ambiente_agencia, $proveedor, $url_conexion);
    // $this->_listar_agencias = $this->_modelo->Agregar_Ambientes($agencia, $ambiente_agencia, $nombre_url, $url_conexion);
    echo json_encode($this->_listar_agencias);
  }
}
