<?php
	class informes_operacionesController extends Controller{

		public function __construct(){
			parent::__construct();
		}

		 public function index(){
			$infonacional = $this->loadModel('informes_operaciones');

			$this->_view->hola = $infonacional;
			$this->_view->titulo = 'Informes Operaciones';
			$this->_view->renderizar('index', 'informe_operaciones');
		}



	}





?>