<?php
	
	class tipo_mercanciaController extends Controller{

		public function __construct(){
			parent::__construct();
		}

		public function index(){
			$tipo_mercancia = $this->loadModel('tipo_mercancia');//se añade el modelo a usar 
			$this->_view->tipo_mercancia = $tipo_mercancia; // Se einsatcia el modelos
			$this->_view->titulo = 'Tipo de Mercancía';
			$this->_view->renderizar('index_tipomercancia', 'tipo_mercancia');//index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
		}

	}
?>