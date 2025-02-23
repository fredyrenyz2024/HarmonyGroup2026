<?php
	
	class unidades_empaqueController extends Controller{

		public function __construct(){
			parent::__construct();
		}

		public function index(){
			$unidades_empaque = $this->loadModel('unidades_empaque');

			$this->_view->unidades_empaque = $unidades_empaque;
			$this->_view->titulo = 'Unidades de Empaque';
			$this->_view->renderizar('index', 'unidades_empaque');
		}
		
	}
