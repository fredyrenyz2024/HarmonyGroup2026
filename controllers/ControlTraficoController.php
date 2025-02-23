<?php

class ControlTraficoController extends Controller
{
  private $modelo;
  private $asignacion_plan_ruta;

  public function __construct()
  {
    parent::__construct();
    $this->modelo = $this->loadModel('ControlTrafico');
  }

  public function index() {}


  public function Asignacion_plan_ruta()
  {
    $this->asignacion_plan_ruta = $this->modelo->Asignar_plan_ruta();
    echo json_encode($this->asignacion_plan_ruta);
  }
}
