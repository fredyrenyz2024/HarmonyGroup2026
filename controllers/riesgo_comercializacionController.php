<?php
	
	class riesgo_comercializacionController extends Controller{

		public function __construct(){
			parent::__construct();
		}

		public function index(){
			$riesgo_comercializacion = $this->loadModel('riesgo_comercializacion');

			$this->_view->riesgo_comercializacion = $riesgo_comercializacion;
			$this->_view->titulo = 'Riesgo Comercialización';
			$this->_view->renderizar('index', 'riesgo_comercializacion');
		}
		
	}