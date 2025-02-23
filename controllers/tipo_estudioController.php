<?php

class tipo_estudioController extends Controller{
	public function __construct(){
			parent::__construct();
		}

		// public function index(){
		// 	$municipios = $this->loadModel('municipios');
		// 	$flete = $this->loadModel('fletes_nacional');
		// 	$tipo_vehiculo = $this->loadModel('tipo_vehiculo');

		// 	$this->_view->municipios = $municipios;
		// 	$this->_view->flete = $flete;
		// 	$this->_view->tipo_vehiculo = $tipo_vehiculo;
		// 	$this->_view->titulo = 'Tabla de fletes';
		// 	$this->_view->renderizar('index', 'fletes');
		// }

		public function index(){
			$tipo_estudio = $this->loadModel('tipo_estudio');//se añade el modelo a usar 
			$this->_view->tipo_estudio = $tipo_estudio; // Se einsatcia el modelos
			$this->_view->titulo = 'Tipo de Estudio';
			$this->_view->renderizar('index', 'tipo_estudio');//index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
		}
		


}

?>