<?php
	
	class unidades_despachoController extends Controller{

		public function __construct(){
			parent::__construct();
		}

		public function index(){
			$unidades_despacho = $this->loadModel('unidades_despacho');

			$this->_view->unidades_despacho = $unidades_despacho;
			$this->_view->titulo = 'Unidades de Despacho';
			$this->_view->renderizar('index', 'unidades_despacho');
		}
		
	}
