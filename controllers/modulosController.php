<?php
	class modulosController extends Controller{

		public function __construct(){
			parent::__construct();
		}

		public function index(){
			$modulos = $this->loadModel('modulos');

			$this->_view->modulos = $modulos;
			$this->_view->titulo = 'Administrar Módulos';
			$this->_view->renderizar('index', 'modulos');
		}

		public function menu(){
			$modulos = $this->loadModel('modulos');

			$this->_view->modulos = $modulos;
			$this->_view->titulo = 'Administrar Menú';
			$this->_view->renderizar('menu', 'modulos');
		}
	}
