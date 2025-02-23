<?php
	
	class fletes_nacionalController extends Controller{

		public function __construct(){
			parent::__construct();
		}

		public function index(){
			$municipios = $this->loadModel('municipios');
			$flete = $this->loadModel('fletes_nacional');
			$tipo_vehiculo = $this->loadModel('tipo_vehiculo');

			$this->_view->municipios = $municipios;
			$this->_view->flete = $flete;
			$this->_view->tipo_vehiculo = $tipo_vehiculo;
			$this->_view->titulo = 'Tabla de fletes';
			$this->_view->renderizar('index', 'fletes');
		}
		
	}
