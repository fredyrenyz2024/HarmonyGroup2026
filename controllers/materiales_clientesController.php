<?php
	
	class materiales_clientesController extends Controller{

		public function __construct(){
			parent::__construct();
		}

		public function index(){
			$materiales_clientes = $this->loadModel('materiales_clientes');
			$unidades_presentacion = $this->loadModel('unidades_presentacion');
			$unidades_empaque = $this->loadModel('unidades_empaque');
			$unidades_medida = $this->loadModel('unidades_medida');

			$this->_view->materiales_clientes = $materiales_clientes;
			$this->_view->unidades_presentacion = $unidades_presentacion;
			$this->_view->unidades_empaque = $unidades_empaque;
			$this->_view->unidades_medida = $unidades_medida;
			$this->_view->titulo = 'Administración de Materiales';
			$this->_view->renderizar('index', 'materiales_clientes');
		}
		
		public function condiciones(){
			$materiales_clientes = $this->loadModel('materiales_clientes');

			$this->_view->materiales_clientes = $materiales_clientes;
			$this->_view->titulo = 'Condiciones sobre Materiales';
			$this->_view->renderizar('condiciones', 'materiales_clientes');
		}

		public function subpartidas(){
			$subpartidas = $this->loadModel('subpartidas');

			$this->_view->subpartidas = $subpartidas;
			$this->_view->titulo = 'Subpartidas';
			$this->_view->renderizar('subpartidas', 'materiales_clientes');
		}

	}
