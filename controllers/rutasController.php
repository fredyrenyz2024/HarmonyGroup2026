<?php
	
	class rutasController extends Controller{

		public function __construct(){
			parent::__construct();
		}

		public function index(){
			$this->_view->titulo = 'Rutas';
			$this->_view->renderizar('index', 'rutas');
		}

		public function puntos_control(){
			$rutas = $this->loadModel('rutas');

			$this->_view->rutas = $rutas;
			$this->_view->titulo = 'Puntos de Control';
			$this->_view->renderizar('puntos_control', 'rutas');
		}

		public function detalle_punto_control(){
			$rutas = $this->loadModel('rutas');

			$this->_view->rutas = $rutas;
			$this->_view->titulo = 'Detalle Punto de Control';
			$this->_view->renderizar('detalle_punto_control', 'rutas');
		}

		public function mapas_ruta(){
			$rutas = $this->loadModel('rutas');

			$this->_view->rutas = $rutas;
			$this->_view->titulo = 'Mapas de Ruta';
			$this->_view->renderizar('mapas_ruta', 'rutas');
		}

		public function mapas_ruta_control(){
			$rutas = $this->loadModel('rutas');

			$this->_view->rutas = $rutas;
			$this->_view->titulo = 'Punto de control de Ruta';
			$this->_view->renderizar('mapas_ruta_control', 'rutas');
		}
	}
