<?php

class preestudiovController extends Controller
{

    public function __construct()
    {
        parent::__construct();
    }

    public function index()
    {
        $preestudio = $this->loadModel('preestudio_nacional'); //se añade el modelo a usar
        $this->_view->preestudio = $preestudio; // Se einsatcia el modelos
        $this->_view->titulo = 'Seguridad Prefiltro - Operaciones';
        $this->_view->renderizar('nacional_preestudio', 'nacional_preestudio'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
    }

    public function control_horas()
    {
        $control_horas = $this->loadModel('control_horas');
        $this->_view->control_horas = $control_horas;
        $this->_view->titulo = 'Horas para Controlar el Preestudio';
        $this->_view->renderizar('control_horas', 'nacional_preestudio');
    }

    public function vehiculos_preestudio()
    {

        $preestudio_parametros = $this->loadModel('preestudio_nacional');
        $this->_view->preestudio_parametros = $preestudio_parametros;
        $this->_view->titulo = 'VEHICULOS PREESTUDIO';
        $this->_view->renderizar('preestudio_parametros', 'nacional_preestudio');

    }

}
