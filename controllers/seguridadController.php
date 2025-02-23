<?php
	
	class seguridadController extends Controller{

		public function __construct(){
			parent::__construct();
		}

		public function index(){
			$this->_view->titulo = 'Asignar Ruta - Default';
			$this->_view->renderizar('index', 'seguridad');
		}

		public function asignar_ruta(){
			$seguridad = $this->loadModel('seguridad');

			$this->_view->seguridad = $seguridad;
			$this->_view->titulo = 'Asignar Ruta';
			$this->_view->renderizar('asignar_ruta', 'seguridad');
		}

		public function seguimiento_cargue(){
			$seguridad = $this->loadModel('seguridad');

			$this->_view->seguridad = $seguridad;
			$this->_view->titulo = 'Seguimientos de Cargue';
			$this->_view->renderizar('seguimiento_cargue', 'seguridad');
		}

		public function informar_anticipo(){
			$seguridad = $this->loadModel('seguridad');

			$this->_view->seguridad = $seguridad;
			$this->_view->titulo = 'Informar Anticipos';
			$this->_view->renderizar('informar_anticipo', 'seguridad');
		}

		public function seguimiento_ruta(){
			$seguridad = $this->loadModel('seguridad');

			$this->_view->seguridad = $seguridad;
			$this->_view->titulo = 'Seguimientos de Ruta';
			$this->_view->renderizar('seguimiento_ruta', 'seguridad');
		}

		public function seguimiento_descargue(){
			$seguridad = $this->loadModel('seguridad');

			$this->_view->seguridad = $seguridad;
			$this->_view->titulo = 'Seguimientos de Descargue';
			$this->_view->renderizar('seguimiento_descargue', 'seguridad');
		}
	}
