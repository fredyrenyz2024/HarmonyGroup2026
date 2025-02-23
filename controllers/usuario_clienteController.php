<?php
class usuario_clienteController extends Controller{

	public function __construct(){
			parent::__construct();
	}

	public function index(){
			$index = $this->loadModel('clientes_new');//se añade el modelo a usar 
			$this->_view->index = $index; // Se einsatcia el modelos
			$this->_view->titulo = 'Designar agencias a un usuario';
			$this->_view->renderizar('asignar_cliente', 'cliente_nuevo');//index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}


}




?>