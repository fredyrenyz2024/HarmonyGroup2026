<?php
	
	class justificacionesController extends Controller{

		public function __construct(){
			parent::__construct();
		}

		public function index(){
			$justificaciones = $this->loadModel('justificaciones');

			$this->_view->justificaciones = $justificaciones;
			$this->_view->titulo = 'Justificaciones';
			$this->_view->renderizar('index', 'justificaciones');
		}
	}
