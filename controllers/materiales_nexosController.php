<?php
	
	class materiales_nexosController extends Controller{

		public function __construct(){
			parent::__construct();
		}

		public function index(){
			$this->_view->titulo = 'Administración de Materiales';
			$this->_view->renderizar('index', 'materiales_nexos');
		}
		
		public function recomendaciones(){
			$this->_view->titulo = 'Recomendaciones sobre Materiales';
			$this->_view->renderizar('recomendaciones', 'materiales_nexos');
		}

		public function riesgos(){
			$this->_view->titulo = 'Riesgos de Materiales';
			$this->_view->renderizar('riesgos', 'materiales_nexos');
		}

	}
