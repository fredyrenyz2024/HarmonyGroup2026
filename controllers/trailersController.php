<?php

use Illuminate\Support\Arr;

session_start();
class trailersController extends Controller
{

  private $_modelo;
  private $_datos_trailer;
  private $listar_propietario;
  private $buscar_propietario;
  private $listar_poseedor;
  private $buscar_poseedor;
  private $crear_trailer;
  private $valdiar_placa;
  private $datos_trailer;
  private $ver_trailer;
  private $historico_trailer;

  public function __construct()
  {
    parent::__construct();
    $this->_modelo = $this->loadModel('trailers');
  }

  public function index()
  {
  }

  public function Datos_trailer()
  {
    $this->_datos_trailer = $this->_modelo->Consultar_Datos_Trailer();
    echo json_encode($this->_datos_trailer);
  }

  public function Listar_propietario()
  {
    $this->listar_propietario = $this->_modelo->Listar_Propietarios();
    echo json_encode($this->listar_propietario);
  }

  public function buscar_propietario()
  {
    $datos = $_POST["datos"];
    $this->buscar_propietario = $this->_modelo->Buscar_Propietarios($datos);
    echo json_encode($this->buscar_propietario);
  }

  public function Listar_poseedor()
  {
    $this->listar_poseedor = $this->_modelo->Listar_Poseeodores();
    echo json_encode($this->listar_poseedor);
  }

  public function buscar_poseedor()
  {
    $datos = $_POST["datos"];
    $this->buscar_poseedor = $this->_modelo->Buscar_Poseedores($datos);
    echo json_encode($this->buscar_poseedor);
  }

  public function Validar_placa()
  {
    $placa = $_POST["placatrailer"];
    $this->valdiar_placa = $this->_modelo->Validar_Placa_Trailer($placa);
    echo json_encode($this->valdiar_placa);
  }

  public function Crear_trailer()
  {

    $response = [];
    if (empty($_POST["placa_trailer"])) {
      $placa_trailer = '';
    } else {
      if (isset($_POST["placa_trailer"])) {
        $placa_trailer = $_POST["placa_trailer"];
      } else {
        $placa_trailer = '';
      }
      if (isset($_POST["T_marca"])) {
        $marca_trailer = $_POST["T_marca"];
      } else {
        $marca_trailer = '';
      }
      if (isset($_POST["T_peso"])) {
        $peso_trailer = $_POST["T_peso"];
      } else {
        $peso_trailer = '';
      }
      if (isset($_POST["T_alto"])) {
        $alto_trailer = $_POST["T_alto"];
      } else {
        $alto_trailer = '';
      }
      if (isset($_POST["T_volumen"])) {
        $volumen_trailer = $_POST["T_volumen"];
      } else {
        $volumen_trailer = '';
      }

      if (isset($_POST["T_tramite"])) {
        $tramite_trailer = $_POST["T_tramite"];
      } else {
        $tramite_trailer = '';
      }
      if (isset($_POST["T_chasis"])) {
        $chasis_trailer = $_POST["T_chasis"];
      } else {
        $chasis_trailer = '';
      }
      if (isset($_POST["T_configuracion"])) {
        $config_trailer = $_POST["T_configuracion"];
      } else {
        $config_trailer = '';
      }
      if (isset($_POST["T_modelo"])) {
        $modelo_trailer = $_POST["T_modelo"];
      } else {
        $modelo_trailer = '';
      }
      if (isset($_POST["T_ancho"])) {
        $ancho_trailer = $_POST["T_ancho"];
      } else {
        $ancho_trailer = '';
      }
      if (isset($_POST["T_largo"])) {
        $largo_trailer = $_POST["T_largo"];
      } else {
        $largo_trailer = '';
      }
      if (isset($_POST["T_capacidad"])) {
        $capacidad_trailer = $_POST["T_capacidad"];
      } else {
        $capacidad_trailer = '';
      }
      if (isset($_POST["T_carroceria"])) {
        $carroceria_trailer = $_POST["T_carroceria"];
      } else {
        $carroceria_trailer = '';
      }
      if (isset($_POST["T_caracteristicas"])) {
        $carac_trailer = $_POST["T_caracteristicas"];
      } else {
        $carac_trailer = '';
      }
      if (isset($_POST["T_propietario"])) {
        $propietario_trailer = $_POST["T_propietario"];
      } else {
        $propietario_trailer = '';
      }
      if (isset($_POST["T_civil"])) {
        $civil_trailer = $_POST["T_civil"];
      } else {
        $civil_trailer = '';
      }
      if (isset($_POST["T_aseguradora"])) {
        $asegura_trailer = $_POST["T_aseguradora"];
      } else {
        $asegura_trailer = '';
      }
      if (isset($_POST["T_fechavence"])) {
        $vence_trailer = $_POST["T_fechavence"];
      } else {
        $vence_trailer = '';
      }

      if (isset($_POST["name_foto"])) {
        $name_foto = $_POST["name_foto"];
      } else {
        $name_foto = '';
      }

      if (isset($_POST["Tlicen"])) {
        $nlicen = $_POST["Tlicen"];
      } else {
        $nlicen = '';
      }

      if (isset($_POST["name_licen"])) {
        $name_licen = $_POST["name_licen"];
      } else {
        $name_licen = '';
      }

      if (isset($_POST["T_poseedor"])) {
        $poseedor_trailer = $_POST["T_poseedor"];
      } else {
        $poseedor_trailer = '';
      }
      /* Documentos */
      if (isset($_FILES["foto_licencia"])) {
        $foto_licencia = $_FILES["foto_licencia"];
      } else {
        $foto_licencia = '';
      }
      if (isset($_FILES["foto_trailer"])) {
        $foto_trailer = $_FILES["foto_trailer"];
      } else {
        $foto_trailer = '';
      }
      $id_usuario = $_SESSION["usuario"]["id_usuario"];

      $datos = [
        "placa_trailer" => $placa_trailer,
        "marca_trailer" => $marca_trailer,
        "peso_trailer" => $peso_trailer,
        "alto_trailer" => $alto_trailer,
        "volumen_trailer" => $volumen_trailer,
        "tramite_trailer" => empty($tramite_trailer) ? 0 : $tramite_trailer,
        "chasis_trailer" => empty($chasis_trailer) ? '0000' : $chasis_trailer,
        "config_trailer" => $config_trailer,
        "modelo_trailer" => $modelo_trailer,
        "ancho_trailer" => $ancho_trailer,
        "largo_trailer" => $largo_trailer,
        "capacidad_trailer" => $capacidad_trailer,
        "carroceria_trailer" => $carroceria_trailer,
        "carac_trailer" => empty($carac_trailer) ? null : $carac_trailer,
        "propietario_trailer" => $propietario_trailer,
        "civil_trailer" => empty($civil_trailer) ? null : $civil_trailer,
        "asegura_trailer" => empty($asegura_trailer) ? null : $asegura_trailer,
        "vence_trailer" => empty($vence_trailer) ? null : $vence_trailer,
        "name_foto" => $name_foto,
        "nlicen" => $nlicen,
        "name_licen" => $name_licen,
        "poseedor_trailer" => $poseedor_trailer,
        "foto_licencia" => $foto_licencia,
        "foto_trailer" => $foto_trailer,
        "id_usuario" => $id_usuario,
      ];

      $this->crear_trailer = $this->_modelo->Crear_Nuevo_Trailer($datos);
      if ($this->crear_trailer['success'] == true) {
        $response = ['numero' => 200, 'mensaje' => $this->crear_trailer['message']];
      } else if ($this->crear_trailer['success'] == false) {
        $response = ['numero' => 400, 'mensaje' => $this->crear_trailer['message']];
      }
      echo json_encode($response);
    }
  }

  public function ver_trailer()
  {
    $id_trailer = $_POST["id"];
    $this->ver_trailer = $this->_modelo->Ver_Datos_Trailer($id_trailer);
    echo json_encode($this->ver_trailer);
  }

  public function Historico_Trailer()
  {
    $id_trailer = $_POST["id"];
    $this->historico_trailer = $this->_modelo->Historico_Datos_Trailer($id_trailer);
    echo json_encode($this->historico_trailer);
  }


  /* Acciones para el actualziar trailer */
  public function traer_datos_trailer()
  {
    $response = [];
    $id_trailer = $_POST["id_trailer"];
    $this->datos_trailer = $this->_modelo->Consulta_Datos_Trailer($id_trailer);
    if ($this->datos_trailer) {
      $response = $this->datos_trailer;
    } else {
      $response = false;
    }
    echo json_encode($response);
  }
}
