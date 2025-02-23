<?php
	
	class informesController extends Controller{
		public function __construct(){
			parent::__construct();
		}

		public function index(){
			$this->_view->titulo = 'Informes';
			$this->_view->renderizar('index', 'informes');
		}

		public function rentabilidad(){
			$informes = $this->loadModel('informes');
			$this->_view->informes = $informes;

			$this->_view->titulo = 'Informe de Rentabilidad';
			$this->_view->renderizar('rentabilidad', 'informes');
		}
	}
?>