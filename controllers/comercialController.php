<?php
	
	class comercialController extends Controller{

		public function __construct(){
			parent::__construct();
		}

		public function index(){
			$this->_view->titulo = 'Nueva Cotización';
			$this->_view->renderizar('index', 'comercial');
		}
		
		public function ver(){
			$this->_view->titulo = 'Ver Cotizaciones';
			$this->_view->renderizar('ver', 'comercial');
		}
		
	}
