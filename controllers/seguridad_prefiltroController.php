<?php
	
	class seguridad_prefiltroController extends Controller{

		public function __construct(){
			parent::__construct();
		}

		public function index(){
			$pedir_vehiculo = $this->loadModel('prefiltro_seguridad');//se añade el modelo a usar 
			$this->_view->pedir_vehiculo = $pedir_vehiculo; // Se einsatcia el modelos
			$this->_view->titulo = 'Historial de Estudio';
			$this->_view->renderizar('index_solicitudes', 'seguridad_prefiltro');//index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
		}

		public function index_estudio(){
			$estudio_vehiculo = $this->loadModel('prefiltro_seguridad');//se añade el modelo a usar 
			$this->_view->estudio_vehiculo = $estudio_vehiculo; // Se einsatcia el modelos
			$this->_view->titulo = 'Estudio de Seguridad';
			$this->_view->renderizar('index_estudio', 'seguridad_prefiltro');//index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
		}

		public function historico_segu_opera(){
			$index_historico = $this->loadModel('prefiltro_seguridad');//se añade el modelo a usar 
			$this->_view->index_historico = $index_historico; // Se einsatcia el modelos
			$this->_view->titulo = 'Informe de Productividad';
			$this->_view->renderizar('historico_segu_opera', 'seguridad_prefiltro');//index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
		}

		public function preestudio_solicitudes(){
			$index_preestudio = $this->loadModel('prefiltro_seguridad');//se añade el modelo a usar 
			$this->_view->index_preestudio = $index_preestudio; // Se einsatcia el modelos
			$this->_view->titulo = 'Solicitudes de Prefiltro - Seguridad';
			$this->_view->renderizar('preestudio_solicitudes', 'seguridad_prefiltro');//index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
		}

		public function habilitar_carropreestudio(){
			$index_habilitar = $this->loadModel('prefiltro_seguridad');//se añade el modelo a usar 
			$this->_view->index_habilitar = $index_habilitar; 
			$this->_view->titulo = 'Desbloqueo de vehículos para preestudio';
			$this->_view->renderizar('habilitar_carropreestudio', 'seguridad_prefiltro');

		}

		

	}
?>