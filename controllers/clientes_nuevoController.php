<?php

class clientes_nuevoController extends Controller
{

	public function __construct()
	{
		parent::__construct();
	}

	public function index()
	{
		$index = $this->loadModel('clientes_new'); //se añade el modelo a usar 
		$this->_view->index = $index; // Se einsatcia el modelos
		$this->_view->titulo = 'Seguimientos';
		$this->_view->renderizar('index_clientes', 'clientes_new'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function cotizaciones()
	{
		$cotiza = $this->loadModel('clientes_new'); //se añade el modelo a usar 
		$this->_view->cotiza = $cotiza; // Se einsatcia el modelos
		$this->_view->titulo = 'Cotizaciones realizadas';
		$this->_view->renderizar('cotizaciones', 'clientes_new'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function trabilidad_completa()
	{
		$trazo = $this->loadModel('clientes_new');
		$this->_view->trazo = $trazo;
		$this->_view->titulo = 'Trazabilidad';
		$this->_view->renderizar('trazabilidad_cliente', 'clientes_new');
	}
	public function detalle_pedidos()
	{
		$trazo = $this->loadModel('clientes_new');
		$this->_view->trazo = $trazo;
		$this->_view->titulo = 'Detalle pedido';
		$this->_view->renderizar('detalle_pedidos', 'clientes_nuevos');
	}

	public function detalle_tracking()
	{
		$this->_view->titulo = 'Detalles Despacho';
		$this->_view->renderizar('detalle_tracking', 'clientes_nuevo');
	}

	public function tracking_despachos()
	{
		$this->_view->titulo = 'tracking Despachos';
		$this->_view->renderizar('tracking', 'clientes_nuevo');
	}

	public function trazabilidad()
	{
		$this->_view->titulo = 'Trazabilidad Despachos';
		$this->_view->renderizar('trazabilidad', 'clientes_nuevo');
	}
}
