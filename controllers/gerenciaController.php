<?php
	
	class gerenciaController extends Controller{

		public function __construct(){ 
			parent::__construct();
		}

		public function index(){
			$prueba = $this->loadModel('gerencia');//se añade el modelo a usar 

			$this->_view->prueba = $prueba; // Se einsatcia el modelos
			$this->_view->titulo = 'Aprobar Tarifas Fletes Anticipos';
			$this->_view->renderizar('index_aprobar', 'gerencia');//index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
		}

		public function seguimiento(){
			$segiruta = $this->loadModel('gerencia');//se añade el modelo a usar 

			$this->_view->segiruta = $segiruta; // Se einsatcia el modelos
			$this->_view->titulo = 'Seguimiento Ruta';
			$this->_view->renderizar('seguimiento_ruta', 'gerencia');//index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
		}

		public function informe_cotizacion(){
				$informecot = $this->loadModel('gerencia');//se añade el modelo a usar 
				$this->_view->informecot = $informecot; 
				$this->_view->titulo = 'Informe cotización';
				$this->_view->renderizar('informe_cotizacion', 'gerencia');
		}
	}
?>