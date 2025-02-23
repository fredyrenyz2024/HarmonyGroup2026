<?php
	
	class tipo_servicio_mercanciaController extends Controller{

		public function __construct(){
			parent::__construct();
		}

		public function index(){
			$tipo_servicio = $this->loadModel('tipo_serviciomercancia');//se añade el modelo a usar 
			$this->_view->tipo_servicio = $tipo_servicio; // Se einsatcia el modelos
			$this->_view->titulo = 'Tipo de Servicio';
			$this->_view->renderizar('index_tiposerviciomercancia', 'tipo_servicio');//index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
		}

	}
?>