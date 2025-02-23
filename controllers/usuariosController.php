<?php
	
	class usuariosController extends Controller{

		public function __construct(){
			parent::__construct();
		}

		public function index(){
			$usuario = $this->loadModel('usuarios');
			$this->_view->usuario = $usuario;
			$this->_view->titulo = 'Administración de Usuarios';
			$this->_view->renderizar('index', 'usuarios');
		}
		
		public function permisos(){
			$this->_view->titulo = 'Permisos de usuarios';
			$this->_view->renderizar('permisos', 'usuarios');
		}

		public function perfiles(){
			$usuario = $this->loadModel('usuarios');
			$this->_view->usuario = $usuario;
			$this->_view->titulo = 'Perfiles de usuarios';
			$this->_view->renderizar('perfiles', 'usuarios');
		}

	}
