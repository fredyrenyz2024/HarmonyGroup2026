<?php

	class cliente_emailsController extends Controller{

		public function __construct(){
			parent::__construct();
		}

		public function index(){
			$cliente_hora = $this->loadModel('servicios_especiales');

			$this->_view->cliente_hora = $cliente_hora;
			$this->_view->titulo = 'Cliente Hora';
			$this->_view->renderizar('cliente_hora', 'clientes_nuevo');
		}


	}


?>