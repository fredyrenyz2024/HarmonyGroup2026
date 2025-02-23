<?php
session_start();
class indexController extends Controller
{

	protected  $_view;

	public function __construct()
	{
		parent::__construct();
		// $this->_view = new View();
	}

	public function index()
	{
		$this->_view->titulo = 'Login';
		$this->_view->renderizar('index', 'inicio');
	}

	public function index1()
	{
		/* INTERNACIONAL */
		// if ($_SESSION['usuario']['tipo_perfil'] == 'INTERNACIONAL') {
		// }
		$dashboard = $this->loadModel('dashboard');
		$this->_view->dashboard = $dashboard;
		$this->_view->titulo = 'Dashboard';
		$this->_view->renderizar('index1', 'inicio');
	}

	public function lanzador()
	{
		$lanzador = $this->loadModel('lanzador'); //l lanzador se debe llamar igual
		$this->_view->lanzador = $lanzador; //se instancia el lanzador
		$this->_view->titulo = 'Líneas De Negocio'; //el título del modulo
		$this->_view->renderizar('lanzador', 'index'); //1. nombre del archivo phtml 2. nombre de la carpeta donde esta el archivo dentro de la view 
	}

	public function cerrar()
	{
		$this->_view->titulo = 'CerrarSesion';
		$this->_view->renderizar('cerrar', 'inicio');
	}

	public function micuenta()
	{
		$usuarios = $this->loadModel('usuarios'); //instancia el modelo
		$this->_view->usuarios = $usuarios; //se envia el modelo a la vista 
		$this->_view->titulo = 'Micuenta';
		$this->_view->renderizar('micuenta', 'inicio');
	}

	public function reset()
	{
		$usuarios = $this->loadModel('usuarios'); //instancia el modelo
		$this->_view->usuarios = $usuarios; //se envia el modelo a la vista 
		$this->_view->titulo = 'Resetpass';
		$this->_view->renderizar('reset', 'inicio');
	}
}
