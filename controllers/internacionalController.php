<?php
	
	class internacionalController extends Controller{

		public function __construct(){
			parent::__construct(); 
		}

		public function index(){
			$internacional = $this->loadModel('internacional');

			$this->_view->internacional = $internacional;
			$this->_view->titulo = 'Index';
			$this->_view->renderizar('index', 'internacional');
		}

		public function trm(){
			$internacional = $this->loadModel('internacional');

			$this->_view->internacional = $internacional;
			$this->_view->titulo = 'TRM Monedas';
			$this->_view->renderizar('trm', 'internacional');
		}

		public function cotizaciones(){
			$internacional = $this->loadModel('internacional');

			$this->_view->internacional = $internacional;
			$this->_view->titulo = 'Cotizaciones';
			$this->_view->renderizar('cotizaciones', 'internacional');
		}

		public function documentos_contables(){
			$internacional = $this->loadModel('internacional');

			$this->_view->internacional = $internacional;
			$this->_view->titulo = 'Facturas de Proveedores';
			$this->_view->renderizar('documentos_contables', 'internacional');
		}

		public function solicita_egreso(){
			$internacional = $this->loadModel('internacional');

			$this->_view->internacional = $internacional;
			$this->_view->titulo = 'Solicitar Egreso';
			$this->_view->renderizar('solicita_egreso', 'internacional');
		}

		public function anticipo_proveedor(){
			$internacional = $this->loadModel('internacional');

			$this->_view->internacional = $internacional;
			$this->_view->titulo = 'Anticipos a Proveedores';
			$this->_view->renderizar('anticipo_proveedor', 'internacional');
		}

		public function registro_egreso(){
			$internacional = $this->loadModel('internacional');

			$this->_view->internacional = $internacional;
			$this->_view->titulo = 'Registro de Egresos';
			$this->_view->renderizar('registro_egreso', 'internacional');
		}

		public function material_envio(){
			$internacional = $this->loadModel('internacional');

			$this->_view->internacional = $internacional;
			$this->_view->titulo = 'Materiales de Envío del Proyecto';
			$this->_view->renderizar('material_envio', 'internacional');
		}

		public function documentos_envio(){
			$internacional = $this->loadModel('internacional');

			$this->_view->internacional = $internacional;
			$this->_view->titulo = 'Documentos de Envío';
			$this->_view->renderizar('documentos_envio', 'internacional');
		}

		public function instruccion_factura(){
			$internacional = $this->loadModel('internacional');

			$this->_view->internacional = $internacional;
			$this->_view->titulo = 'Instrucciones de Facturación';
			$this->_view->renderizar('instruccion_factura', 'internacional');
		}

		public function facturacion(){
			$internacional = $this->loadModel('internacional');

			$this->_view->internacional = $internacional;
			$this->_view->titulo = 'Facturación de Clientes Internacional';
			$this->_view->renderizar('facturacion', 'internacional');
		}

		public function reporte_seguimientos(){
			$informes = $this->loadModel('informes');

			$this->_view->informes = $informes;
			$this->_view->titulo = 'Reporte del Seguimiento';
			$this->_view->renderizar('reporte_seguimientos', 'importacion');
		}

		public function cartera(){
			$internacional = $this->loadModel('internacional');

			$this->_view->internacional = $internacional;
			$this->_view->titulo = 'Cartera de Clientes Internacional';
			$this->_view->renderizar('cartera', 'internacional');
		}

		public function cartera_pagada(){
			$internacional = $this->loadModel('internacional');

			$this->_view->internacional = $internacional;
			$this->_view->titulo = 'Cartera Pagada de Clientes Internacional';
			$this->_view->renderizar('cartera_pagada', 'internacional');
		}

	}
