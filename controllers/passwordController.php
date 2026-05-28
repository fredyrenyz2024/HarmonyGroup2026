<?php
date_default_timezone_set('America/Bogota');

class passwordController extends Controller
{
    public function __construct()
    {
        parent::__construct();
        // $this->_modelo = $this->loadModel('pedidos');
    }

    public function index()
    {
        // $pedido = $this->loadModel('pedidos');
        // $this->_view->pedido = $pedido;
        // $this->_view->titulo = 'Pedidos Trazabilidad';
        // $this->_view->renderizar('recuperar', 'password');
    }
    public function recuperar()
    {
        // $pedido = $this->loadModel('pedidos');
        // $this->_view->pedido = $pedido;
        // $this->_view->titulo = 'Pedidos Trazabilidad';
        $this->_view->renderizar('recuperar', 'password');
    }
}
