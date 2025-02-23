<?php
	
	class prefiltro_cotizarController extends Controller{

		public function __construct(){
			parent::__construct();
		}

		public function index(){
			$prefiltro_coti = $this->loadModel('prefiltro_cotizar');//se añade el modelo a usar 

			$this->_view->prefiltro_coti = $prefiltro_coti; // Se einsatcia el modelos
			$this->_view->titulo = 'Solicitudes de Servicio';
			$this->_view->renderizar('index', 'prefiltro_cotizar');//index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
		}

	}
?>