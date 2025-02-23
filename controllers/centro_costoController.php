<?php
	
	class centro_costoController extends Controller{

		public function __construct(){
			parent::__construct();
		}

		public function index(){
			$centro_costo = $this->loadModel('centro_costo');

			$this->_view->centro_costo = $centro_costo;
			$this->_view->titulo = 'Centros de Costo';
			$this->_view->renderizar('index', 'centro_costo');
		}
		
	}
