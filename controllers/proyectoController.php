<?php
	
	class proyectoController extends Controller{

		public function __construct(){
			parent::__construct();
		}

		public function index(){
			$this->_view->titulo = 'Lista de Proyectos';
			$this->_view->renderizar('index', 'proyecto');
		}
		public function ver(){
			$this->_view->titulo = 'Detalle del Proyecto';
			$this->_view->renderizar('ver', 'proyecto');
		}

		public function administrar(){
			$this->_view->titulo = 'Crear Proyectos';
			$this->_view->renderizar('administrar', 'proyecto');
		}

		public function detalle(){
			$this->_view->titulo = 'Actividades del Proyecto';
			$this->_view->renderizar('detalle', 'proyecto');
		}

		public function orden_compra(){
			$orden_compra = $this->loadModel('orden_compra');

			$this->_view->orden_compra = $orden_compra;
			$this->_view->titulo = 'Ordenes de Compra';
			$this->_view->renderizar('orden_compra', 'proyecto');
		}

		public function proyectos_(){
			$orden_compra = $this->loadModel('orden_compra');
			$plantillas = $this->loadModel('plantillas');
			$usuarios = $this->loadModel('usuarios');

			$this->_view->orden_compra = $orden_compra;
			$this->_view->plantillas = $plantillas;
			$this->_view->usuarios = $usuarios;
			$this->_view->titulo = 'Proyectos';
			$this->_view->renderizar('proyectos_', 'proyecto');
		}

		public function cargas_(){
			$orden_compra = $this->loadModel('orden_compra');
			$usuarios = $this->loadModel('usuarios');
			$monedas = $this->loadModel('monedas');
			$justificaciones = $this->loadModel('justificaciones');
			$centro_costo = $this->loadModel('centro_costo');

			$this->_view->orden_compra = $orden_compra;
			$this->_view->usuarios = $usuarios;
			$this->_view->monedas = $monedas;
			$this->_view->justificaciones = $justificaciones;
			$this->_view->centro_costo = $centro_costo;
			$this->_view->titulo = 'Cargas del Proyecto';
			$this->_view->renderizar('cargas_', 'proyecto');
		}

		public function actividades_(){
			$orden_compra = $this->loadModel('orden_compra');
			$usuarios = $this->loadModel('usuarios');

			$this->_view->orden_compra = $orden_compra;
			$this->_view->usuarios = $usuarios;
			$this->_view->titulo = 'Actividades del Material';
			$this->_view->renderizar('actividades_', 'proyecto');
		}

		public function operadores(){
			$operadores = $this->loadModel('operadores');
			$servicios_especiales = $this->loadModel('servicios_especiales');
			$servicios_operador = $this->loadModel('servicios_operador');

			$this->_view->operadores = $operadores;
			$this->_view->servicios_especiales = $servicios_especiales;
			$this->_view->servicios_operador = $servicios_operador;
			$this->_view->titulo = 'Operadores';
			$this->_view->renderizar('operadores', 'proyecto');
		}

		public function servicios_opreador(){
			$servicios_operador = $this->loadModel('servicios_operador');
			$unidades_medida = $this->loadModel('unidades_medida');
			$operadores = $this->loadModel('operadores');
			$servicios_especiales = $this->loadModel('servicios_especiales');
			$monedas = $this->loadModel('monedas');
			$municipios = $this->loadModel('municipios');

			$this->_view->servicios_operador = $servicios_operador;
			$this->_view->unidades_medida = $unidades_medida;
			$this->_view->operadores = $operadores;
			$this->_view->servicios_especiales = $servicios_especiales;
			$this->_view->monedas = $monedas;
			$this->_view->municipios = $municipios;
			$this->_view->titulo = 'Proveedores de Servicios Especiales';
			$this->_view->renderizar('servicios_opreador', 'proyecto');
		}


	}
