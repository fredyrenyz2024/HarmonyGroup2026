<?php
	class municipiosController extends Controller{

		public function __construct(){
			parent::__construct();
		}

		public function index(){
			$municipios = $this->loadModel('municipios');

			$this->_view->municipios = $municipios;
			$this->_view->titulo = 'Administrar municipios';
			$this->_view->renderizar('index', 'municipios');
		}
	}
