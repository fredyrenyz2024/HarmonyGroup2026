<?php
	
	class novedadesController extends Controller{

		public function __construct(){
			parent::__construct();
		}

		public function index(){
			$seguir_documento = $this->loadModel('novedades');//se añade el modelo a usar 

			$this->_view->seguir_documento = $seguir_documento; // Se einsatcia el modelos
			$this->_view->titulo = 'Seguimiento a Documentos';
			$this->_view->renderizar('index', 'novedades');//index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
		}


	}
?>