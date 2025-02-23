<?php
class operacionesController extends Controller{
		public function __construct(){
			parent::__construct();
		}

		public function index(){
			$prueba = $this->loadModel('operaciones');
			$this->_view->prueba = $prueba;
			$this->_view->titulo ='Precintos';
			$this->_view->renderizar('index','operaciones');

		}

		public function contenedor(){
			$cont = $this->loadModel('operaciones');
			$this->_view->cont = $cont;
			$this->_view->titulo ='Contenedores Vacíos';
			$this->_view->renderizar('contenedor','operaciones');

		}


		public function planillar(){
			$planilla = $this->loadModel('operaciones');
			$this->_view->planilla = $planilla;
			$this->_view->titulo ='Planillar';
			$this->_view->renderizar('planillar','operaciones');
		}

		public function tipo_proveedor(){
			$tipo_pro = $this->loadModel('operaciones');
			$this->_view->tipo_pro = $tipo_pro;
			$this->_view->titulo ='Tipo de proveedor';
			$this->_view->renderizar('tipo_proveedor','operaciones');
		}



}		

?>