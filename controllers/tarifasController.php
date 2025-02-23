<?php
	
	class tarifasController extends Controller{
		private $xcrud;

		public function __construct(){
			parent::__construct();
			$this->getLibrary("xcrud");
			$this->xcrud = Xcrud::get_instance();
		}

		public function index(){
			$municipios = $this->loadModel('municipios');
			$tarifa = $this->loadModel('tarifas');
			$cliente = $this->loadModel('clientes');
			$tipo_vehiculo = $this->loadModel('tipo_vehiculo');


			$this->_view->municipios = $municipios;
			$this->_view->tarifa = $tarifa;
			$this->_view->cliente = $cliente;
			$this->_view->tipo_vehiculo = $tipo_vehiculo;
			$this->_view->titulo = 'Tabla de tarifas';
			$this->_view->renderizar('index', 'tarifas');
		}
		
	}
