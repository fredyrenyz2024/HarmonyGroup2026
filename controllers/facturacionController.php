<?php
	
	class facturacionController extends Controller{

		public function __construct(){
			parent::__construct();
		}

		public function index(){
			$facturacion = $this->loadModel('facturacion');

			$this->_view->facturacion = $facturacion;
			$this->_view->titulo = 'Facturación';
			$this->_view->renderizar('index', 'facturacion');
		}

		public function remesas(){
			$facturacion = $this->loadModel('facturacion');

			$this->_view->facturacion = $facturacion;
			$this->_view->titulo = 'Facturación remesas';
			$this->_view->renderizar('remesas', 'facturacion');
		}

		public function costos(){
			$facturacion = $this->loadModel('facturacion');
			$this->_view->facturacion = $facturacion;
			$this->_view->titulo = 'Costos de Proyectos';
			$this->_view->renderizar('costos', 'facturacion');
		}

		public function archivos_costos(){
			$facturacion = $this->loadModel('facturacion');
			$this->_view->facturacion = $facturacion;
			$this->_view->titulo = 'Archivos Costos de Proyectos';
			$this->_view->renderizar('archivos_costos', 'facturacion');
		}

		public function instruccion_factura(){
			$facturacion = $this->loadModel('facturacion');
			$this->_view->facturacion = $facturacion;
			$this->_view->titulo = 'Instrucciones de Facturación';
			$this->_view->renderizar('instruccion_factura', 'facturacion');
		}
	}
