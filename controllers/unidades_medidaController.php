<?php
	
	class unidades_medidaController extends Controller{

		public function __construct(){
			parent::__construct();
		}

		public function index(){
			$unidades_medida = $this->loadModel('unidades_medida');

			$this->_view->unidades_medida = $unidades_medida;
			$this->_view->titulo = 'Unidades de Medida';
			$this->_view->renderizar('index', 'unidades_medida');
		}
		
	}
