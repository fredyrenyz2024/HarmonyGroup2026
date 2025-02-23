<?php
	class gruposController extends Controller{
		public function __construct(){
			parent::__construct();
		}

		public function index(){
			$group = $this->loadModel('Grupo');//se añade el modelo a usar 
			$this->_view->group = $group; // Se einsatcia el modelos
			$this->_view->titulo = 'Grupo contacto';
			$this->_view->renderizar('index_grupo', 'group');//index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
		}


		public function novedad_seguimiento(){
			$nove = $this->loadModel('Grupo');//se añade el modelo a usar 
			$this->_view->nove = $nove; // Se einsatcia el modelos
			$this->_view->titulo = 'novedad seguimiento';
			$this->_view->renderizar('novedad_seguimiento', 'group');//index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
		}



	}
?>