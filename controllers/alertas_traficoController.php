<?php
class alertas_traficoController extends Controller
{
    // private $_modelo;

    // public function __construct()
    // {
    //     parent::__construct();
    //     $this->_modelo = $this->loadModel('tableroseguimiento');
    // }

    public function index()
    {
        $this->_view->renderizar('alertas_trafico', 'alertas_trafico'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
    }
}
