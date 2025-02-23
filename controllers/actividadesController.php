<?php
	
	class actividadesController extends Controller{

		public function __construct(){
			parent::__construct();
		}

		public function index(){
			$actividades = $this->loadModel('actividades');

			$this->_view->actividades = $actividades;
			$this->_view->titulo = 'Actividades';
			$this->_view->renderizar('index', 'actividades');
		}
	}