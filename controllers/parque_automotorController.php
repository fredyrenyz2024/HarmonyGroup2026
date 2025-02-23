<?php
	
	class parque_automotorController extends Controller{

		public function __construct(){
			parent::__construct();
		}

		public function index(){
			$this->_view->titulo = 'Parque Automotor';
			$this->_view->renderizar('index', 'parque_automotor');
		}
		
	}
