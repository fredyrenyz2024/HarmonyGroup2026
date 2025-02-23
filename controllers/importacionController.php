<?php
	
	class importacionController extends Controller{

		public function __construct(){
			parent::__construct();
		}

		public function index(){
			$importacion = $this->loadModel('importacion');
			$plantillas = $this->loadModel('plantillas');
			$clientes = $this->loadModel('clientes');
			$contenedores = $this->loadModel('contenedores');

			$this->_view->importacion = $importacion;
			$this->_view->plantillas = $plantillas;
			$this->_view->clientes = $clientes;
			$this->_view->contenedores = $contenedores;
			$this->_view->titulo = 'Proyectos';
			$this->_view->renderizar('index', 'importacion');
		}

		public function proyectos(){
			$importacion = $this->loadModel('importacion');
			$plantillas = $this->loadModel('plantillas');
			$clientes = $this->loadModel('clientes');
			$contenedores = $this->loadModel('contenedores');

			$this->_view->importacion = $importacion;
			$this->_view->plantillas = $plantillas;
			$this->_view->clientes = $clientes;
			$this->_view->contenedores = $contenedores;
			$this->_view->titulo = 'Lista de Proyectos';
			$this->_view->renderizar('proyectos', 'importacion');
		}

		public function ver_actividades(){
			$importacion = $this->loadModel('importacion');
			$monedas = $this->loadModel('monedas');
			$usuarios = $this->loadModel('usuarios');
			$centro_costo = $this->loadModel('centro_costo');
			$justificaciones = $this->loadModel('justificaciones');

			$this->_view->importacion = $importacion;
			$this->_view->monedas = $monedas;
			$this->_view->usuarios = $usuarios;
			$this->_view->centro_costo = $centro_costo;
			$this->_view->justificaciones = $justificaciones;
			$this->_view->titulo = 'Actividades del Proyecto';
			$this->_view->renderizar('ver_actividades', 'importacion');
		}

		public function reporte_proyecto(){
			$informes = $this->loadModel('informes');

			$this->_view->informes = $informes;
			$this->_view->titulo = 'Reporte del Proyecto';
			$this->_view->renderizar('reporte_proyecto', 'importacion');
		}

		public function reporte_cargue(){
			$informes = $this->loadModel('informes');

			$this->_view->informes = $informes;
			$this->_view->titulo = 'Reporte de Cargues de Materiales';
			$this->_view->renderizar('reporte_cargue', 'importacion');
		}

		public function reporte_verificacion_material(){
			$informes = $this->loadModel('informes');

			$this->_view->informes = $informes;
			$this->_view->titulo = 'Reporte de Verificación de Materiales';
			$this->_view->renderizar('reporte_verificacion_material', 'importacion');
		}

		public function reporte_ruta(){
			$informes = $this->loadModel('informes');

			$this->_view->informes = $informes;
			$this->_view->titulo = 'Reporte de Ruta';
			$this->_view->renderizar('reporte_ruta', 'importacion');
		}

		public function reporte_descargue(){
			$informes = $this->loadModel('informes');

			$this->_view->informes = $informes;
			$this->_view->titulo = 'Reporte de Descargues de Materiales';
			$this->_view->renderizar('reporte_descargue', 'importacion');
		}

	}
