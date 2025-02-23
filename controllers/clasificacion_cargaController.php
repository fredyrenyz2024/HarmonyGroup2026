<?php
	
	class clasificacion_cargaController extends Controller{

		public function __construct(){
			parent::__construct();
		}

		public function index(){
			$this->_view->titulo = 'Clasificación de Carga';
			$this->_view->renderizar('index', 'clasificacion_carga');
		}
		
	}
