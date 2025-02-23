<?php
	 
	class bodegasController extends Controller{

		public function __construct(){
			parent::__construct();
		}

		public function index(){
			$bodegas = $this->loadModel('bodegas');
			$municipios = $this->loadModel('municipios');

			$this->_view->bodegas = $bodegas;
			$this->_view->municipios = $municipios;
			$this->_view->titulo = 'Bodegas';
			$this->_view->renderizar('index', 'bodegas');
		}

		public function generar_envio(){
			$bodegas = $this->loadModel('bodegas');

			$this->_view->bodegas = $bodegas;
			$this->_view->titulo = 'Generar Ingreso';
			$this->_view->renderizar('generar_envio', 'bodegas');
		}

		public function generar_despacho(){
			$bodegas = $this->loadModel('bodegas');

			$this->_view->bodegas = $bodegas;
			$this->_view->titulo = 'Generar Salidas';
			$this->_view->renderizar('generar_despacho', 'bodegas');
		}

		public function generar_traslado(){
			$bodegas = $this->loadModel('bodegas');

			$this->_view->bodegas = $bodegas;
			$this->_view->titulo = 'Generar Traslado';
			$this->_view->renderizar('generar_traslado', 'bodegas');
		}

		public function form_generar_traslado(){
			$bodegas = $this->loadModel('bodegas');

			$this->_view->bodegas = $bodegas;
			$this->_view->titulo = 'Generar Traslado';
			$this->_view->renderizar('form_generar_traslado', 'bodegas');
		}

		public function ver_alistamientos(){
			$bodegas = $this->loadModel('bodegas');

			$this->_view->bodegas = $bodegas;
			$this->_view->titulo = 'Alistamientos';
			$this->_view->renderizar('ver_alistamientos', 'bodegas');
		}

		public function ver_material_alistamiento(){
			$bodegas = $this->loadModel('bodegas');
			$materiales_clientes = $this->loadModel('materiales_clientes');
			$unidades_empaque = $this->loadModel('unidades_empaque');

			$this->_view->bodegas = $bodegas;
			$this->_view->materiales_clientes = $materiales_clientes;
			$this->_view->unidades_empaque = $unidades_empaque;
			$this->_view->titulo = 'Material de Alistamiento';
			$this->_view->renderizar('ver_material_alistamiento', 'bodegas');
		}

		public function ver_descargas(){
			$bodegas = $this->loadModel('bodegas');

			$this->_view->bodegas = $bodegas;
			$this->_view->titulo = 'Material Descargado en Bodega';
			$this->_view->renderizar('ver_descargas', 'bodegas');
		}

		public function detalle_descarga(){
			$bodegas = $this->loadModel('bodegas');
			$materiales_clientes = $this->loadModel('materiales_clientes');

			$this->_view->bodegas = $bodegas;
			$this->_view->materiales_clientes = $materiales_clientes;
			$this->_view->titulo = 'Detalle Material Descargado';
			$this->_view->renderizar('detalle_descarga', 'bodegas');
		}

		public function ver_despachos(){
			$bodegas = $this->loadModel('bodegas');

			$this->_view->bodegas = $bodegas;
			$this->_view->titulo = 'Despachos';
			$this->_view->renderizar('ver_despachos', 'bodegas');
		}


		public function ver_material_despacho(){
			$bodegas = $this->loadModel('bodegas');
			$materiales_clientes = $this->loadModel('materiales_clientes');
			$unidades_empaque = $this->loadModel('unidades_empaque');

			$this->_view->bodegas = $bodegas;
			$this->_view->materiales_clientes = $materiales_clientes;
			$this->_view->unidades_empaque = $unidades_empaque;
			$this->_view->titulo = 'Material del Despacho';
			$this->_view->renderizar('ver_material_despacho', 'bodegas');
		}

		public function pre_entradas(){
			$bodegas = $this->loadModel('bodegas');
			$municipios = $this->loadModel('municipios');

			$this->_view->bodegas = $bodegas;
			$this->_view->municipios = $municipios;
			$this->_view->titulo = 'Ver Pre-entradas';
			$this->_view->renderizar('pre_entradas', 'bodegas');
		}

		public function qr_material_pre_entrada(){
			$bodegas = $this->loadModel('bodegas');

			$this->_view->bodegas = $bodegas;
			$this->_view->titulo = 'QR Material Pre-entradas';
			$this->_view->renderizar('qr_material_pre_entrada', 'bodegas');
		}

		public function novedad_ingreso(){
			$bodegas = $this->loadModel('bodegas');

			$this->_view->bodegas = $bodegas;
			$this->_view->titulo = 'Novedades en Ingreso';
			$this->_view->renderizar('novedad_ingreso', 'bodegas');
		}

		public function material_envio(){
			$bodegas = $this->loadModel('bodegas');
			$materiales_clientes = $this->loadModel('materiales_clientes');
			$unidades_empaque = $this->loadModel('unidades_empaque');

			$this->_view->bodegas = $bodegas;
			$this->_view->materiales_clientes = $materiales_clientes;
			$this->_view->unidades_empaque = $unidades_empaque;
			$this->_view->titulo = 'Material de Envío a Bodega Nexos Group';
			$this->_view->renderizar('material_envio', 'bodegas');
		}

		public function material_despacho(){
			$bodegas = $this->loadModel('bodegas');
			$materiales_clientes = $this->loadModel('materiales_clientes');
			$unidades_empaque = $this->loadModel('unidades_empaque');

			$this->_view->bodegas = $bodegas;
			$this->_view->materiales_clientes = $materiales_clientes;
			$this->_view->unidades_empaque = $unidades_empaque;
			$this->_view->titulo = 'Material de Salida';
			$this->_view->renderizar('material_despacho', 'bodegas');
		}

		public function lista_bodegas(){
			$bodegas = $this->loadModel('bodegas');

			$this->_view->bodegas = $bodegas;
			$this->_view->titulo = 'Inventario de Bodega';
			$this->_view->renderizar('lista_bodegas', 'bodegas');
		}

		public function ver_configuracion(){
			$bodegas = $this->loadModel('bodegas');

			$this->_view->bodegas = $bodegas;
			$this->_view->titulo = 'Configuración de Bodega';
			$this->_view->renderizar('ver_configuracion', 'bodegas');
		}

		public function detalle_ubicacion(){
			$bodegas = $this->loadModel('bodegas');

			$this->_view->bodegas = $bodegas;
			$this->_view->titulo = 'Detalle Ubicación';
			$this->_view->renderizar('detalle_ubicacion', 'bodegas');
		}

		public function inventario(){
			$bodegas = $this->loadModel('bodegas');
			$materiales_clientes = $this->loadModel('materiales_clientes');
			$unidades_empaque = $this->loadModel('unidades_empaque');

			$this->_view->bodegas = $bodegas;
			$this->_view->materiales_clientes = $materiales_clientes;
			$this->_view->unidades_empaque = $unidades_empaque;
			$this->_view->titulo = 'Inventario de Bodega';
			$this->_view->renderizar('inventario', 'bodegas');
		}

		public function detalle_inventario(){
			$bodegas = $this->loadModel('bodegas');
			$materiales_clientes = $this->loadModel('materiales_clientes');
			$unidades_empaque = $this->loadModel('unidades_empaque');

			$this->_view->bodegas = $bodegas;
			$this->_view->materiales_clientes = $materiales_clientes;
			$this->_view->unidades_empaque = $unidades_empaque;
			$this->_view->titulo = 'Detalle Inventario';
			$this->_view->renderizar('detalle_inventario', 'bodegas');
		}

		public function log_material(){
			$bodegas = $this->loadModel('bodegas');
			$materiales_clientes = $this->loadModel('materiales_clientes');

			$this->_view->bodegas = $bodegas;
			$this->_view->materiales_clientes = $materiales_clientes;
			$this->_view->titulo = 'Movimientos Material';
			$this->_view->renderizar('log_material', 'bodegas');
		}
	
		public function ver_novedades(){
			$bodegas = $this->loadModel('bodegas');

			$this->_view->bodegas = $bodegas;
			$this->_view->titulo = 'Novedades de Materiales';
			$this->_view->renderizar('ver_novedades', 'bodegas');
		}

		public function detalle_novedad(){
			$bodegas = $this->loadModel('bodegas');

			$this->_view->bodegas = $bodegas;
			$this->_view->titulo = 'Detalle Novedad';
			$this->_view->renderizar('detalle_novedad', 'bodegas');
		}

		public function ver_traslados(){
			$bodegas = $this->loadModel('bodegas');

			$this->_view->bodegas = $bodegas;
			$this->_view->titulo = 'Traslado de Estibas';
			$this->_view->renderizar('ver_traslados', 'bodegas');
		}

	}
