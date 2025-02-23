<?php

class sac_subastaController extends Controller
{
  //declarar 

  private $facto;
  private $facto2;
  private $_modelo;



  public function __construct()
  {
    parent::__construct();
    $this->_modelo = $this->loadModel('sac_subasta');
  }

  public function index()
  {
    $subasta = $this->loadModel('sac_subasta');
    $this->_view->subasta = $subasta;
    $this->_view->titulo = 'Aprobación Subasta';
    $this->_view->renderizar('tablero_subasta', 'prefiltro_cotizar');
  }

  public function aprueba_subasta_sac()
  {
    $subasta = $this->loadModel('sac_subasta');
    $this->_view->subasta = $subasta;
    $this->_view->titulo = 'Aprobación Subasta';
    $this->_view->renderizar('tablero_subasta', 'aprueba_subasta_sac');
  }

  public function Consultar_subasta()
  {
    $tipo = $_POST["tipo"];
    $valor = $_POST["valor"];
    $this->facto = $this->_modelo->Consulta_Subasta_sac($tipo, $valor);
    echo json_encode($this->facto);
  }


  public function Consultar_detalle_subasta()
  {
    $id_subasta = $_POST["id_subasta"];
    $this->facto2 = $this->_modelo->Consulta_detalle($id_subasta);
    echo json_encode($this->facto2);
  }

  public function Respuesta_Flete()
  {
    $flete = $_POST["flete"];
    $tarifa = $_POST["tarifa"];
    $utilidad = $_POST["utilidad"];
    $rentabilidad = $_POST["rentabilidad"];
    $subasta = $_POST["subasta"];
    $rta = $_POST["rta"];
    $this->facto2 = $this->_modelo->Aprueba_flete($flete, $tarifa, $utilidad, $rentabilidad, $subasta, $rta);
    echo json_encode($this->facto2);
  }

  public function Respuesta_Completa()
  {
    $flete = $_POST["flete"];
    $tarifa = $_POST["tarifa"];
    $utilidad = $_POST["utilidad"];
    $rentabilidad = $_POST["rentabilidad"];
    $subasta = $_POST["subasta"];
    $rta = $_POST["rta"];
    $idpareja  = $_POST["idpareja"];
    $estadotarifa = $_POST["estadotarifa"];
    $this->facto2 = $this->_modelo->Aprobacion_Completa($flete, $tarifa, $utilidad, $rentabilidad, $subasta, $rta, $idpareja, $estadotarifa);
    echo json_encode($this->facto2);
  }
}
