<?php
session_start();

class ControlTarficoModel extends Model
{


  public function __construct()
  {
    parent::__construct();
  }

  public function Asignar_plan_ruta()
  {
    $sql = $this->_db3->prepare("SELECT max(cod_inicio)+1 AS nco FROM cmx_inicio_ruta");
  }
}
