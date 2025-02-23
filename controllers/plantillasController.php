<?php
	
	class plantillasController extends Controller{

		public function __construct(){
			parent::__construct();
		}

		public function index(){
			$plantillas = $this->loadModel('plantillas');

			$this->_view->plantillas = $plantillas;
			$this->_view->titulo = 'Plantillas de Actividades';
			$this->_view->renderizar('index', 'plantillas');
		}

		public function actividades(){
			$plantillas = $this->loadModel('plantillas');
			$plantillas_actividades = $this->loadModel('plantillas_actividades');
			$monedas = $this->loadModel('monedas');
			$usuarios = $this->loadModel('usuarios');
			$centro_costo = $this->loadModel('centro_costo');

			$this->_view->plantillas = $plantillas;
			$this->_view->plantillas_actividades = $plantillas_actividades;
			$this->_view->monedas = $monedas;
			$this->_view->usuarios = $usuarios;
			$this->_view->centro_costo = $centro_costo;
			$this->_view->titulo = 'Actividades de Plantilla';
			$this->_view->renderizar('actividades', 'plantillas');
		}

	}