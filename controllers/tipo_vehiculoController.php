<?php
	
	class tipo_vehiculoController extends Controller{

		public function __construct(){
			parent::__construct();
		}

		public function index(){
			$tipovehiculo = $this->loadModel('tipos_vehiculo');//se añade el modelo a usar 

			$this->_view->tipovehiculo = $tipovehiculo; // Se einsatcia el modelos
			$this->_view->titulo = 'Crear Tipo de Vehículo';
			$this->_view->renderizar('index_tipovehiculo', 'tipo_vehiculo');//index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
		}

	}
?>