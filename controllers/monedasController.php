<?php
	
	class monedasController extends Controller{

		public function __construct(){
			parent::__construct();
		}

		public function index(){
			$monedas = $this->loadModel('monedas');

			$this->_view->monedas = $monedas;
			$this->_view->titulo = 'Monedas';
			$this->_view->renderizar('index', 'monedas');
		}
	}
