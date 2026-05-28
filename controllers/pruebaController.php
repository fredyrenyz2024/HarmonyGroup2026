<?php

class pruebaController extends Controller
{

	public function __construct()
	{
		parent::__construct();
	}

	public function index()
	{
		$prueba = $this->loadModel('prueba'); //se añade el modelo a usar 

		$this->_view->prueba = $prueba; // Se einsatcia el modelos
		$this->_view->titulo = 'Prueba de CRUD';
		$this->_view->renderizar('index', 'prueba'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}
}
