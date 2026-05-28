<?php
session_start();

class cuatroplController extends Controller
{

  public function __construct()
  {
    parent::__construct();
  }

  public function index()
  {
    $this->_view->titulo = 'Administrara 4PL';
    $this->_view->renderizar('index', 'cuatropl'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
  }

  public function cliente_cuatro_pl()
  {
    $this->_view->titulo = 'Administrara 4PL';
    $this->_view->renderizar('index', 'cuatropl'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
  }

  public function todos()
  {
    $this->_view->titulo = 'Administrara 4PL';
    $this->_view->renderizar_ventana('administrador_cuatropl', 'cuatropl'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
  }
  public function cliente_4pl()
  {
    $this->_view->titulo = 'Administrara 4PL';
    $this->_view->renderizar_ventana('cliente_cuatropl', 'cuatropl'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
  }

  public function proveedor_4pl()
  {
    $this->_view->titulo = 'Administrara 4PL';
    $this->_view->renderizar_ventana('proveedor_cuatropl', 'cuatropl'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
  }
}
