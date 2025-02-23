<?php

use Illuminate\Support\Arr;

session_start();
class proveedoresController extends Controller
{
  private $_modelo;
  private $validiar_token;
  private $validiar_token_estudio;
  private $consultar_datos;
  private $consultar_datos_prefiltro;
  private $consultar_recursos;
  private $guardar_proveedor;
  private $validar_proveedor;
  private $respuesta_conductor;
  private $respuesta_propietario;
  private $respuesta_poseedor;
  private $respuesta_poseedores;
  private $respuesta_proveedor_internacional;
  private $consultar_activdad;
  private $consultar_datos_proveedor;
  private $cargar_municipios;
  private $obtener_municipio;
  private $ver_proveedor;
  private $Respuesta_Propietario_Propietario_Trailer;
  private $Respuesta_Poseedor_Propietario_Trailer;
  private $Respuesta_Conductor_Propietario_Trailer;
  private $Respuesta_Propietario_Poseedor_Propietario_Trailer;
  // Actualizar los proveedores
  private $actualizar_proveedor;
  private $actualizar_propietario;
  private $crear_transision_ministerio;
  private $crear_conctacto_internacional;
  /* Consultar Datos para el token */
  private $consultar_datos_proveedores;

  public function __construct()
  {
    parent::__construct();
    $this->_modelo = $this->loadModel('proveedores');
  }

  public function index() {}

  public function Validar_token()
  {
    $prefiltro = $_POST["prefiltro"];
    $token = $_POST["token"];
    $conductor = $_POST["conductor"];
    $propietario = $_POST["propietario"];
    $tenedor = $_POST["tenedor"];
    $this->validiar_token = $this->_modelo->Validar_Token_Proveedor($prefiltro, $token, $conductor, $propietario, $tenedor);
    echo json_encode($this->validiar_token);
  }

  /* Validar token de seguriddad para estudio */
  public function Validar_token_estudio()
  {
    $estudio = $_POST["estudio"];
    $token = $_POST["token"];
    $documentos = json_decode($_POST['documentos']);
    $this->validiar_token_estudio = $this->_modelo->Validar_Token_Estudio($estudio, $token, $documentos);
    echo json_encode($this->validiar_token_estudio);
  }

  public function Consulta_Recursos()
  {
    $estudio = $_POST['estudio'];
    $this->consultar_recursos = $this->_modelo->Consultar_Recurso_Estudio($estudio);
    echo json_encode($this->consultar_recursos);
  }

  public function Consultar_datos_estudio()
  {
    $dato = $_POST["dato"];
    $actividad = $_POST["actividad"];
    $this->consultar_datos = $this->_modelo->Cosultar_datos_estudio($dato, $actividad);
    echo json_encode($this->consultar_datos);
  }

  public function Consulta_Recursos_Prefiltro()
  {
    $dato = $_POST["estudio"];
    $this->consultar_datos_prefiltro = $this->_modelo->Cosultar_datos_estudio_prefiltro($dato);
    echo json_encode($this->consultar_datos_prefiltro);
  }

  public function Crear_proveedor()
  {
    if ($_POST["tipo_documento"] == "" && $_POST["celular"] == "" && $_POST["municipio"] == "" && $_POST["1apellido"] == "") {
      $response = array(
        'numero' => 405,
        'mensaje' => 'Por favor diligenciar todos los campos obligatorios para poder crear el proveedor.',
      );
      $this->guardar_proveedor = $response;
      echo json_encode($this->guardar_proveedor);
    } else {
      /* Validar si existe el documento en la base de datos */
      $this->validar_proveedor = $this->_modelo->Validar_Documento($_POST['numero_documento']);
      if ($this->validar_proveedor == true) {
        $response = array(
          'numero' => 405,
          'mensaje' => 'Proveedor ya se encuentra registrado en NexosApp.',
        );
        $this->guardar_proveedor = $response;
        echo json_encode($this->guardar_proveedor);
      } else {
        /* Validar apellidos  apellidos */
        if ($_POST["tipo_documento"] !== 'NIT' || $_POST["tipo_documento"] !== 'Identificacion Tributaria Internacional') {
          $apellido1 = isset($_POST["1apellido"]) ? $_POST["1apellido"] : null;
          $apellido2 =  isset($_POST["2apellido"]) ?  $_POST["2apellido"] : null;
        } else {
          $apellido1 = '';
          $apellido2 = '';
        }

        /* Datos para crear el conductor */
        $Conductor = $_POST['Conductor'];
        $Poseedor = $_POST['poseedor_vehiculo'];
        $Propietario = $_POST['propietario_vehiculo'];
        $PropietarioTrailer = $_POST['propietario_trailer'];
        $Proveedor = $_POST['Proveedor'];

        if ($Conductor == "true" &&  $Poseedor == "false" && $Propietario == "false" && $PropietarioTrailer == "false") {
          $ultimo_eps = null;
          $nombre_arl = '';
          $fecha_vencimiento_arl = null;
          $ultimo_arl = null;
          $civil = null;
          $response = [];

          $referencias_empresariales = $_POST["referencias_empresariales1"];
          $fecha_ereferencia1 = $_POST["fecha_referencia1"];
          $fecha_retiro1 = $_POST["fecha_retiro1"];
          $contacto_ref1 = $_POST["contacto_ref1"];
          $celular_ref1 = $_POST["celular_ref1"];
          $cargo_ref1 = $_POST["cargo_ref1"];
          $anti_ref1 = $_POST["anti_ref1"];

          $referencia_empresarial2 = $_POST["referencias_empresariales2"];
          $fecha_ereferencia2 = $_POST["fecha_referencia2"];
          $fecha_retiro2 = $_POST["fecha_retiro2"];
          $contacto_ref2 = $_POST["contacto_ref2"];
          $celular_ref2 = $_POST["celular_ref2"];
          $cargo_ref2 = $_POST["cargo_ref2"];
          $anti_ref2 = $_POST["anti_ref2"];

          $referencias_empresariales3 = $_POST["referencias_empresariales3"];
          $fecha_referencia3 = $_POST["fecha_referencia3"];
          $fecha_retiro3 = $_POST["fecha_retiro3"];
          $contacto_ref3 = $_POST["contacto_ref3"];
          $celular_ref3 = $_POST["celular_ref3"];
          $cargo_ref3 = $_POST["cargo_ref3"];
          $anti_ref3 = $_POST["anti_ref3"];

          $referencias_personales = $_POST["referencias_personales"];
          $fecha_preferencia1 = $_POST["fecha_personal1"] ? $_POST["fecha_personal1"] : null;
          $parenp1 = $_POST["parenp1"];
          $telefonop1 = $_POST["telefonop1"];

          $refe_personal2 = $_POST["referencias_personales2"];
          $fecha_preferencia2 = $_POST["fecha_personal2"] ? $_POST["fecha_personal2"] : null;
          $parenp2 = $_POST["parenp2"];
          $telefonop2 = $_POST["telefonop2"];

          //NOMBRES DE LOS DOCUMENTOS
          if (isset($_POST["name_soporte"])) {
            $name_soporte = $_POST["name_soporte"];
          } else {
            $name_soporte = '';
          }

          if (isset($_POST["name_soporte2"])) {
            $name_soporte2 = $_POST["name_soporte2"];
          } else {
            $name_soporte2 = '';
          }

          if (isset($_POST["name_soporte3"])) {
            $name_soporte3 = $_POST["name_soporte3"];
          } else {
            $name_soporte3 = '';
          }

          if (isset($_FILES["docu_personal1"])) {
            $docu_personal1 = $_FILES["docu_personal1"];
          } else {
            $docu_personal1 = null;
          }

          if (isset($_FILES["docu_personal2"])) {
            $docu_personal2 = $_FILES["docu_personal2"];
          } else {
            $docu_personal2 = null;
          }

          if (isset($_POST["namedocu_eps"])) {
            $namedocu_eps = $_POST["namedocu_eps"];
          } else {
            $namedocu_eps = '';
          }
          $namedocu_arl = '';

          if (isset($_POST["namedocu_curso"])) {
            $namedocu_curso = $_POST["namedocu_curso"];
          } else {
            $namedocu_curso = '';
          }

          if (isset($_POST["name_docurut"])) {
            $name_docurut = $_POST["name_docurut"];
          } else {
            $name_docurut = '';
          }

          if (isset($_POST["name_doculice"])) {
            $name_doculice = $_POST["name_doculice"];
          } else {
            $name_doculice = '';
          }

          //nombre de las fotos del conductor
          if (isset($_POST["name_fontall"])) {
            $name_fontal = $_POST["name_fontall"];
          } else {
            $name_fontal = '';
          }

          if (isset($_POST["name_derecha"])) {
            $name_derecha = $_POST["name_derecha"];
          } else {
            $name_derecha = '';
          }

          if (isset($_POST["name_izquierda"])) {
            $name_izquierda = $_POST["name_izquierda"];
          } else {
            $name_izquierda = '';
          }

          if (isset($_POST["name_indum"])) {
            $name_indu = $_POST["name_indum"];
          } else {
            $name_indu = '';
          }
          //nombre de acuerdos
          if (isset($_POST["name_a1"])) {
            $name_a1 = $_POST["name_a1"];
          } else {
            $name_a1 = '';
          }

          /* Array de datos para hacer la insersion */
          $datos = [
            /* Datos Generales del proveedor */
            "tipo_documento" => $_POST['tipo_documento'],
            "numero_documento" => $_POST['numero_documento'],
            "digito_verificacion" =>  $_POST['digito_verificacion'],
            "tipo_identificacion" => $_POST['tipo_identificacion'],
            "rndc_nombre2" => $_POST['rndc_nombre'],
            "apellido1" =>  $apellido1,
            "apellido2" => $apellido2,
            "abreviatura" => $_POST['abreviatura'],
            "contacto" => $_POST['contacto'],
            "celular" => $_POST['celular'],
            "direccion" => $_POST['direccion'],
            "email" => $_POST['email'],
            "municipio" => $_POST['municipio'],

            /* Datos del conductor especificos */
            "rndc_categoria_licencia" => isset($_POST["categoria_licencia"]) ? $_POST["categoria_licencia"] : null,
            "rndc_numero_licencia" => isset($_POST["numero_licencia"]) ? $_POST["numero_licencia"] : null,
            "rndc_vencimiento_licencia" => isset($_POST["vencimiento_licencia"]) ? $_POST["vencimiento_licencia"] : null,
            "estado" => $_POST['estado'],
            "documentos" => isset($_FILES['documentos']) ? $_FILES['documentos'] : null,
            "celular2" => isset($_POST['celular2']) ? $_POST['celular2'] : null,
            "nombre_eps" => isset($_POST['name_eps']) ? $_POST['name_eps'] : null,
            "fecha_vencimiento" => empty($_POST["vence_eps"]) ? null : $_POST["vence_eps"],
            "ultimo_eps" => isset($ultimo_eps) ? $ultimo_eps : null,
            "nombre_arl" => isset($nombre_arl) ? $nombre_arl : null,
            "fecha_vencimiento_arl" => $fecha_vencimiento_arl == '' ? null : $fecha_vencimiento_arl,
            "ultimo_arl" => isset($ultimo_arl) ? $ultimo_arl : null,
            "nombre_entidad" => isset($_POST["nom_enti"]) ? $_POST["nom_enti"] : null,
            "vence_curso" => $_POST["vence_curso"] == '' ? null : $_POST["vence_curso"],
            "sexo" => $_POST['sexo'],
            "fecha_nace" => $_POST["fecha_nacimiento"] == '' ? null : $_POST["fecha_nacimiento"],
            "sangre" => isset($_POST["sangre"]) ? $_POST["sangre"] : null,
            "civil" => isset($civil) ? $civil : null,
            "fecha_ingreso" => empty($_POST["fecha_ingreso"]) ? null :  $_POST["fecha_ingreso"],

            // Insertar referencias 
            /*Referencia personal 1*/
            "referencias_empresariales1" => isset($referencias_empresariales) ? $referencias_empresariales : null,
            "fecha_referencia1" => empty($fecha_ereferencia1) ? null : $fecha_ereferencia1,
            "fecha_retiro1" => empty($fecha_retiro1) ? null : $fecha_retiro1,
            "contacto_ref1" => isset($contacto_ref1) ? $contacto_ref1 : null,
            "celular_ref1" => isset($celular_ref1) ? $celular_ref1 : null,
            "cargo_ref1" => isset($cargo_ref1) ? $cargo_ref1 : null,
            "anti_ref1" => empty($anti_ref1) ? 0 :  $anti_ref1,
            "idp1" => isset($_POST['idp1']) ? $_POST['idp1'] : null,
            "documento_referencia1" =>  isset($_FILES["documento_referencia1"]) ? $_FILES["documento_referencia1"] : null,
            /* Fin primera referencia 1*/

            /*Referencia personal 2*/
            "referencias_empresariales2" => isset($referencia_empresarial2) ? $referencia_empresarial2 : null,
            "fecha_referencia2" => empty($fecha_ereferencia2) ? null : $fecha_ereferencia2,
            "fecha_retiro2" => empty($fecha_retiro2) ? null : $fecha_retiro2,
            "contacto_ref2" => isset($contacto_ref2) ? $contacto_ref2 : null,
            "celular_ref2" => isset($celular_ref2) ? $celular_ref2 : null,
            "cargo_ref2" => isset($cargo_ref2) ? $cargo_ref2 : null,
            "anti_ref2" => empty($anti_ref2) ? 0 :  $anti_ref2,
            "idp2" => isset($_POST['idp2']) ? $_POST['idp2'] : null,
            "documento_referencia2" =>  isset($_FILES["documento_referencia2"]) ? $_FILES["documento_referencia2"] : null,
            /* Fin primera referencia 2*/

            /*Referencia personal 3*/
            "referencias_empresariales3" => isset($referencias_empresariales3) ? $referencias_empresariales3 : null,
            "fecha_referencia3" => empty($fecha_referencia3) ? null : $fecha_referencia3,
            "fecha_retiro3" => empty($fecha_retiro3) ? null : $fecha_retiro3,
            "contacto_ref3" => isset($contacto_ref3) ? $contacto_ref3 : null,
            "celular_ref3" => isset($celular_ref3) ? $celular_ref3 : null,
            "cargo_ref3" => isset($cargo_ref3) ? $cargo_ref3 : null,
            "anti_ref3" => empty($anti_ref3) ? 0 : $anti_ref3,
            "idp3" => isset($_POST['idp3']) ? $_POST['idp3'] : null,
            "documento_referencia3" =>  isset($_FILES["documento_referencia3"]) ? $_FILES["documento_referencia3"] : null,
            /* Fin primera referencia 3*/

            // Documentos
            "licencia" => isset($_FILES['licencia']) ? $_FILES['licencia'] : null,
            "docu_eps" => isset($_FILES['docu_eps']) ? $_FILES['docu_eps'] : null,
            "foto_conductor" => isset($_FILES['foto_conductor']) ? $_FILES['foto_conductor'] : null,
            "foto_derecha" => isset($_FILES['foto_derecha']) ? $_FILES['foto_derecha'] : null,
            "foto_izquierda" => isset($_FILES['foto_izquierda']) ? $_FILES['foto_izquierda'] : null,
            "foto_indume" => isset($_FILES['foto_indume']) ? $_FILES['foto_indume'] : null,
            "docu_curso" => isset($_FILES['docu_curso']) ? $_FILES['docu_curso'] : null,
            "rut" => isset($_FILES['rut']) ? $_FILES['rut'] : null,
            "acuerdo_uno" => isset($_FILES['acuerdo_uno']) ? $_FILES['acuerdo_uno'] : null,

            //Nombre de los documentos
            "name_soporte" => isset($name_soporte) ? $name_soporte : null,
            "name_soporte2" => isset($name_soporte2) ? $name_soporte2 : null,
            "name_soporte3" => isset($name_soporte3) ? $name_soporte3 : null,
            "docu_personal1" => isset($docu_personal1) ? $docu_personal1 : null,
            "docu_personal2" => isset($docu_personal2) ? $docu_personal2 : null,
            "namedocu_eps" => isset($namedocu_eps) ? $namedocu_eps : null,
            "namedocu_curso" => isset($namedocu_curso) ? $namedocu_curso : null,
            "name_docurut" => isset($name_docurut) ? $name_docurut : null,
            "name_doculice" => isset($name_doculice) ? $name_doculice : null,
            "name_fontall" => isset($name_fontal) ? $name_fontal : null,
            "name_derecha" => isset($name_derecha) ? $name_derecha : null,
            "name_izquierda" => isset($name_izquierda) ? $name_izquierda : null,
            "name_indum" => isset($name_indu) ? $name_indu : null,
            "name_a1" => isset($name_a1) ? $name_a1 : null,

            //referencias personales 1
            "referencias_personales" => isset($referencias_personales) ? $referencias_personales : null,
            "fecha_personal1" => $fecha_preferencia1 == '' ? null : $fecha_preferencia1,
            "parenp1" => isset($parenp1) ? $parenp1 : null,
            "telefonop1" => isset($telefonop1) ? $telefonop1 : null,

            //referencias personales 2
            "referencias_personales2" => isset($refe_personal2) ? $refe_personal2 : null,
            "fecha_personal2" => $fecha_preferencia2 == '' ? null :  $fecha_preferencia2,
            "parenp2" => isset($parenp2) ? $parenp2 : null,
            "telefonop2" => isset($telefonop2) ? $telefonop2 : null,
          ];

          // Procesar las respuestas del modelo.
          $this->respuesta_conductor = $this->_modelo->Insertar_conductor($datos);
          if ($this->respuesta_conductor['success'] == true) {
            $response = ['numero' => 200, 'mensaje' => $this->respuesta_conductor['message']];
            // $this->guardar_proveedor = $response;
          } else if ($this->respuesta_conductor['success'] == false) {
            $response = ['numero' => 400, 'mensaje' => $this->respuesta_conductor['message']];
            // $this->guardar_proveedor = $response;
          }
          echo json_encode($response);
        }

        /* Insertar Propietario */
        if ($Propietario == "true" &&  $Poseedor == "false" && $Conductor == "false" && $PropietarioTrailer == "false") {
          $response = [];
          $datos = [
            /* Datos Generales del proveedor */
            "tipo_documento" => $_POST['tipo_documento'],
            "numero_documento" => $_POST['numero_documento'],
            "digito_verificacion" =>  $_POST['digito_verificacion'],
            "tipo_identificacion" => $_POST['tipo_identificacion'],
            "rndc_nombre2" => $_POST['rndc_nombre'],
            "apellido1" =>  $apellido1,
            "apellido2" => $apellido2,
            "abreviatura" => $_POST['abreviatura'],
            "contacto" => $_POST['contacto'],
            "celular" => $_POST['celular'],
            "direccion" => $_POST['direccion'],
            "email" => $_POST['email'],
            "municipio" => $_POST['municipio'],
            "estado" => $_POST['estado'],

            /* Datos de actividad Proveedor */
            "actividad_econo" => $_POST["actividad_econo"],
            "tributarias" => $_POST["tributarias"],
            "banco" => $_POST["banco"],
            "tipocuenta" => $_POST["tipocuenta"],
            "numerocuenta" => $_POST["numerocuenta"],
          ];
          $this->respuesta_propietario = $this->_modelo->Insertar_Propietario($datos);
          if ($this->respuesta_propietario['success'] == true) {
            $response = ['numero' => 200, 'mensaje' => $this->respuesta_propietario['message']];
          } else if ($this->respuesta_propietario['success'] == false) {
            $response = ['numero' => 400, 'mensaje' => $this->respuesta_propietario['message']];
          }
          echo json_encode($response);
        }

        /* Insertar Poseedor */
        if ($Poseedor == "true" &&  $Propietario == "false" && $Conductor == "false" && $PropietarioTrailer == "false") {
          $response = [];
          $datos = [
            /* Datos Generales del proveedor */
            "tipo_documento" => $_POST['tipo_documento'],
            "numero_documento" => $_POST['numero_documento'],
            "digito_verificacion" =>  $_POST['digito_verificacion'],
            "tipo_identificacion" => $_POST['tipo_identificacion'],
            "rndc_nombre2" => $_POST['rndc_nombre'],
            "apellido1" =>  $apellido1,
            "apellido2" => $apellido2,
            "abreviatura" => $_POST['abreviatura'],
            "contacto" => $_POST['contacto'],
            "celular" => $_POST['celular'],
            "direccion" => $_POST['direccion'],
            "email" => $_POST['email'],
            "municipio" => $_POST['municipio'],
            "estado" => $_POST['estado'],

            /* Datos de actividad Proveedor */
            "actividad_econo" => $_POST["actividad_econo"],
            "tributarias" => $_POST["tributarias"],
            "banco" => $_POST["banco"],
            "tipocuenta" => $_POST["tipocuenta"],
            "numerocuenta" => $_POST["numerocuenta"],
          ];
          $this->respuesta_poseedor = $this->_modelo->Insertar_Poseedor($datos);
          if ($this->respuesta_poseedor['success'] == true) {
            $response = ['numero' => 200, 'mensaje' => $this->respuesta_poseedor['message']];
          } else if ($this->respuesta_poseedor['success'] == false) {
            $response = ['numero' => 400, 'mensaje' => $this->respuesta_poseedor['message']];
          }
          echo json_encode($response);
        }

        // Propietario y poseedor igual numero de documento
        if ($Poseedor == "true" &&  $Propietario == "true" && $Conductor == "false" && $PropietarioTrailer == "false") {
          $response = []; // Inicializa la variable de respuesta
          /* primero insertamos propietario */
          $datos = [
            /* Datos Generales del proveedor */
            "tipo_documento" => $_POST['tipo_documento'],
            "numero_documento" => $_POST['numero_documento'],
            "digito_verificacion" =>  $_POST['digito_verificacion'],
            "tipo_identificacion" => $_POST['tipo_identificacion'],
            "rndc_nombre2" => $_POST['rndc_nombre'],
            "apellido1" =>  $apellido1,
            "apellido2" => $apellido2,
            "abreviatura" => $_POST['abreviatura'],
            "contacto" => $_POST['contacto'],
            "celular" => $_POST['celular'],
            "direccion" => $_POST['direccion'],
            "email" => $_POST['email'],
            "municipio" => $_POST['municipio'],
            "Actividad_propietario" => 'Propietario Vehiculo',
            "Actividad_poseedor" => 'Poseedor Vehiculo',

            /* Datos de actividad Proveedor */
            "actividad_econo" => $_POST["actividad_econo"],
            "tributarias" => $_POST["tributarias"],
            "banco" => $_POST["banco"],
            "tipocuenta" => $_POST["tipocuenta"],
            "numerocuenta" => $_POST["numerocuenta"],
            "estado" => $_POST['estado'],
          ];
          $this->respuesta_poseedores = $this->_modelo->Insertar_proveedores($datos);
          if ($this->respuesta_poseedores['success'] == true) {
            $response = ['numero' => 200, 'mensaje' => $this->respuesta_poseedores['message']];
          } else if ($this->respuesta_poseedores['success'] == false) {
            $response = ['numero' => 400, 'mensaje' => $this->respuesta_poseedores['message']];
          }
          echo json_encode($response);
        }

        // Conductor y poseedor igual numero de documento
        if ($Poseedor == "true" &&  $Conductor == "true" && $Propietario == "false" && $PropietarioTrailer == "false") {
          $response = []; // Inicializa la variable de respuesta
          $ultimo_eps = null;;
          $nombre_arl = '';
          $fecha_vencimiento_arl = null;
          $ultimo_arl = null;
          $civil = null;
          $response = [];

          $referencias_empresariales = $_POST["referencias_empresariales1"];
          $fecha_ereferencia1 = $_POST["fecha_referencia1"];
          $fecha_retiro1 = $_POST["fecha_retiro1"];
          $contacto_ref1 = $_POST["contacto_ref1"];
          $celular_ref1 = $_POST["celular_ref1"];
          $cargo_ref1 = $_POST["cargo_ref1"];
          $anti_ref1 = $_POST["anti_ref1"];

          $referencia_empresarial2 = $_POST["referencias_empresariales2"];
          $fecha_ereferencia2 = $_POST["fecha_referencia2"];
          $fecha_retiro2 = $_POST["fecha_retiro2"];
          $contacto_ref2 = $_POST["contacto_ref2"];
          $celular_ref2 = $_POST["celular_ref2"];
          $cargo_ref2 = $_POST["cargo_ref2"];
          $anti_ref2 = $_POST["anti_ref2"];

          $referencias_empresariales3 = $_POST["referencias_empresariales3"];
          $fecha_referencia3 = $_POST["fecha_referencia3"];
          $fecha_retiro3 = $_POST["fecha_retiro3"];
          $contacto_ref3 = $_POST["contacto_ref3"];
          $celular_ref3 = $_POST["celular_ref3"];
          $cargo_ref3 = $_POST["cargo_ref3"];
          $anti_ref3 = $_POST["anti_ref3"];

          $referencias_personales = $_POST["referencias_personales"];
          $fecha_preferencia1 = $_POST["fecha_personal1"] ? $_POST["fecha_personal1"] : null;
          $parenp1 = $_POST["parenp1"];
          $telefonop1 = $_POST["telefonop1"];

          $refe_personal2 = $_POST["referencias_personales2"];
          $fecha_preferencia2 = $_POST["fecha_personal2"] ? $_POST["fecha_personal2"] : null;
          $parenp2 = $_POST["parenp2"];
          $telefonop2 = $_POST["telefonop2"];

          //NOMBRES DE LOS DOCUMENTOS
          if (isset($_POST["name_soporte"])) {
            $name_soporte = $_POST["name_soporte"];
          } else {
            $name_soporte = '';
          }

          if (isset($_POST["name_soporte2"])) {
            $name_soporte2 = $_POST["name_soporte2"];
          } else {
            $name_soporte2 = '';
          }

          if (isset($_POST["name_soporte3"])) {
            $name_soporte3 = $_POST["name_soporte3"];
          } else {
            $name_soporte3 = '';
          }

          if (isset($_FILES["docu_personal1"])) {
            $docu_personal1 = $_FILES["docu_personal1"];
          } else {
            $docu_personal1 = null;
          }

          if (isset($_FILES["docu_personal2"])) {
            $docu_personal2 = $_FILES["docu_personal2"];
          } else {
            $docu_personal2 = null;
          }

          if (isset($_POST["namedocu_eps"])) {
            $namedocu_eps = $_POST["namedocu_eps"];
          } else {
            $namedocu_eps = '';
          }
          $namedocu_arl = '';

          if (isset($_POST["namedocu_curso"])) {
            $namedocu_curso = $_POST["namedocu_curso"];
          } else {
            $namedocu_curso = '';
          }

          if (isset($_POST["name_docurut"])) {
            $name_docurut = $_POST["name_docurut"];
          } else {
            $name_docurut = '';
          }

          if (isset($_POST["name_doculice"])) {
            $name_doculice = $_POST["name_doculice"];
          } else {
            $name_doculice = '';
          }

          //nombre de las fotos del conductor
          if (isset($_POST["name_fontall"])) {
            $name_fontal = $_POST["name_fontall"];
          } else {
            $name_fontal = '';
          }

          if (isset($_POST["name_derecha"])) {
            $name_derecha = $_POST["name_derecha"];
          } else {
            $name_derecha = '';
          }

          if (isset($_POST["name_izquierda"])) {
            $name_izquierda = $_POST["name_izquierda"];
          } else {
            $name_izquierda = '';
          }

          if (isset($_POST["name_indum"])) {
            $name_indu = $_POST["name_indum"];
          } else {
            $name_indu = '';
          }

          //nombre de acuerdos
          if (isset($_POST["name_a1"])) {
            $name_a1 = $_POST["name_a1"];
          } else {
            $name_a1 = '';
          }

          /* Array de datos para hacer la insersion */
          $datos = [
            /* Datos Generales del proveedor */
            "tipo_documento" => $_POST['tipo_documento'],
            "numero_documento" => $_POST['numero_documento'],
            "digito_verificacion" =>  $_POST['digito_verificacion'],
            "tipo_identificacion" => $_POST['tipo_identificacion'],
            "rndc_nombre2" => $_POST['rndc_nombre'],
            "apellido1" =>  $apellido1,
            "apellido2" => $apellido2,
            "abreviatura" => $_POST['abreviatura'],
            "contacto" => $_POST['contacto'],
            "celular" => $_POST['celular'],
            "direccion" => $_POST['direccion'],
            "email" => $_POST['email'],
            "municipio" => $_POST['municipio'],

            /* Datos del conductor especificos */
            "rndc_categoria_licencia" => isset($_POST["categoria_licencia"]) ? $_POST["categoria_licencia"] : null,
            "rndc_numero_licencia" => isset($_POST["numero_licencia"]) ? $_POST["numero_licencia"] : null,
            "rndc_vencimiento_licencia" => isset($_POST["vencimiento_licencia"]) ? $_POST["vencimiento_licencia"] : null,
            "estado" => $_POST['estado'],
            "documentos" => isset($_FILES['documentos']) ? $_FILES['documentos'] : null,
            "celular2" => isset($_POST['celular2']) ? $_POST['celular2'] : null,
            "nombre_eps" => isset($_POST['name_eps']) ? $_POST['name_eps'] : null,
            "fecha_vencimiento" => empty($_POST["vence_eps"]) ? null : $_POST["vence_eps"],
            "ultimo_eps" => isset($ultimo_eps) ? $ultimo_eps : null,
            "nombre_arl" => isset($nombre_arl) ? $nombre_arl : null,
            "fecha_vencimiento_arl" => $fecha_vencimiento_arl == '' ? null : $fecha_vencimiento_arl,
            "ultimo_arl" => isset($ultimo_arl) ? $ultimo_arl : null,
            "nombre_entidad" => isset($_POST["nom_enti"]) ? $_POST["nom_enti"] : null,
            "vence_curso" => empty($_POST["vence_curso"]) ? null : $_POST["vence_curso"],
            "sexo" => $_POST['sexo'],
            "fecha_nace" => $_POST["fecha_nacimiento"] == '' ? null : $_POST["fecha_nacimiento"],
            "sangre" => isset($_POST["sangre"]) ? $_POST["sangre"] : null,
            "civil" => isset($civil) ? $civil : null,
            "fecha_ingreso" => $_POST["fecha_ingreso"] == '' ? null : $_POST["fecha_ingreso"],

            // Insertar referencias 
            // /*Referencia personal 1*/
            "referencias_empresariales1" => isset($referencias_empresariales) ? $referencias_empresariales : null,
            "fecha_referencia1" => empty($fecha_ereferencia1) ? null : $fecha_ereferencia1,
            "fecha_retiro1" => empty($fecha_retiro1) ? null : $fecha_retiro1,
            "contacto_ref1" => isset($contacto_ref1) ? $contacto_ref1 : null,
            "celular_ref1" => isset($celular_ref1) ? $celular_ref1 : null,
            "cargo_ref1" => isset($cargo_ref1) ? $cargo_ref1 : null,
            "anti_ref1" => empty($anti_ref1) ? 0 :  $anti_ref1,
            "idp1" => isset($_POST['idp1']) ? $_POST['idp1'] : null,
            "documento_referencia1" =>  isset($_FILES["documento_referencia1"]) ? $_FILES["documento_referencia1"] : null,
            /* Fin primera referencia 1*/

            /*Referencia personal 2*/
            "referencias_empresariales2" => isset($referencia_empresarial2) ? $referencia_empresarial2 : null,
            "fecha_referencia2" => empty($fecha_ereferencia2) ? null : $fecha_ereferencia2,
            "fecha_retiro2" => empty($fecha_retiro2) ? null : $fecha_retiro2,
            "contacto_ref2" => isset($contacto_ref2) ? $contacto_ref2 : null,
            "celular_ref2" => isset($celular_ref2) ? $celular_ref2 : null,
            "cargo_ref2" => isset($cargo_ref2) ? $cargo_ref2 : null,
            "anti_ref2" => empty($anti_ref2) ? 0 :  $anti_ref2,
            "idp2" => isset($_POST['idp2']) ? $_POST['idp2'] : null,
            "documento_referencia2" =>  isset($_FILES["documento_referencia2"]) ? $_FILES["documento_referencia2"] : null,
            /* Fin primera referencia 2*/

            /*Referencia personal 3*/
            "referencias_empresariales3" => isset($referencias_empresariales3) ? $referencias_empresariales3 : null,
            "fecha_referencia3" => empty($fecha_referencia3) ? null : $fecha_referencia3,
            "fecha_retiro3" => empty($fecha_retiro3) ? null : $fecha_retiro3,
            "contacto_ref3" => isset($contacto_ref3) ? $contacto_ref3 : null,
            "celular_ref3" => isset($celular_ref3) ? $celular_ref3 : null,
            "cargo_ref3" => isset($cargo_ref3) ? $cargo_ref3 : null,
            "anti_ref3" => empty($anti_ref3) ? 0 : $anti_ref3,
            "idp3" => isset($_POST['idp3']) ? $_POST['idp3'] : null,
            "documento_referencia3" =>  isset($_FILES["documento_referencia3"]) ? $_FILES["documento_referencia3"] : null,
            /* Fin primera referencia 3*/

            // Documentos
            "licencia" => isset($_FILES['licencia']) ? $_FILES['licencia'] : null,
            "docu_eps" => isset($_FILES['docu_eps']) ? $_FILES['docu_eps'] : null,
            "foto_conductor" => isset($_FILES['foto_conductor']) ? $_FILES['foto_conductor'] : null,
            "foto_derecha" => isset($_FILES['foto_derecha']) ? $_FILES['foto_derecha'] : null,
            "foto_izquierda" => isset($_FILES['foto_izquierda']) ? $_FILES['foto_izquierda'] : null,
            "foto_indume" => isset($_FILES['foto_indume']) ? $_FILES['foto_indume'] : null,
            "docu_curso" => isset($_FILES['docu_curso']) ? $_FILES['docu_curso'] : null,
            "rut" => isset($_FILES['rut']) ? $_FILES['rut'] : null,
            "acuerdo_uno" => isset($_FILES['acuerdo_uno']) ? $_FILES['acuerdo_uno'] : null,

            //Nombre de los documentos
            "name_soporte" => isset($name_soporte) ? $name_soporte : null,
            "name_soporte2" => isset($name_soporte2) ? $name_soporte2 : null,
            "name_soporte3" => isset($name_soporte3) ? $name_soporte3 : null,
            "docu_personal1" => isset($docu_personal1) ? $docu_personal1 : null,
            "docu_personal2" => isset($docu_personal2) ? $docu_personal2 : null,
            "namedocu_eps" => isset($namedocu_eps) ? $namedocu_eps : null,
            "namedocu_curso" => isset($namedocu_curso) ? $namedocu_curso : null,
            "name_docurut" => isset($name_docurut) ? $name_docurut : null,
            "name_doculice" => isset($name_doculice) ? $name_doculice : null,
            "name_fontall" => isset($name_fontal) ? $name_fontal : null,
            "name_derecha" => isset($name_derecha) ? $name_derecha : null,
            "name_izquierda" => isset($name_izquierda) ? $name_izquierda : null,
            "name_indum" => isset($name_indu) ? $name_indu : null,
            "name_a1" => isset($name_a1) ? $name_a1 : null,

            //referencias personales 1
            "referencias_personales" => isset($referencias_personales) ? $referencias_personales : null,
            "fecha_personal1" => $fecha_preferencia1 == '' ? null : $fecha_preferencia1,
            "parenp1" => isset($parenp1) ? $parenp1 : null,
            "telefonop1" => isset($telefonop1) ? $telefonop1 : null,

            //referencias personales 2
            "referencias_personales2" => isset($refe_personal2) ? $refe_personal2 : null,
            "fecha_personal2" => $fecha_preferencia2 == '' ? null : $fecha_preferencia2,
            "parenp2" => isset($parenp2) ? $parenp2 : null,
            "telefonop2" => isset($telefonop2) ? $telefonop2 : null,

            "Actividad_conductor2" => 'Conductor',
            "Actividad_poseedor2" => 'Poseedor Vehiculo',
          ];
          $this->respuesta_poseedores = $this->_modelo->Insertar_proveedores($datos);
          if ($this->respuesta_poseedores['success'] == true) {
            $response = ['numero' => 200, 'mensaje' => $this->respuesta_poseedores['message']];
          } else if ($this->respuesta_poseedores['success'] == false) {
            $response = ['numero' => 400, 'mensaje' => $this->respuesta_poseedores['message']];
          }
          echo json_encode($response);
        }

        // Propietario y conductor igual numero de documento
        if ($Propietario == "true" &&  $Conductor == "true" && $Poseedor == "false") {
          $response = []; // Inicializa la variable de respuesta
          $ultimo_eps = null;;
          $nombre_arl = '';
          $fecha_vencimiento_arl = null;
          $ultimo_arl = null;
          $civil = null;
          $response = [];

          $referencias_empresariales = $_POST["referencias_empresariales1"];
          $fecha_ereferencia1 = $_POST["fecha_referencia1"];
          $fecha_retiro1 = $_POST["fecha_retiro1"];
          $contacto_ref1 = $_POST["contacto_ref1"];
          $celular_ref1 = $_POST["celular_ref1"];
          $cargo_ref1 = $_POST["cargo_ref1"];
          $anti_ref1 = $_POST["anti_ref1"];

          $referencia_empresarial2 = $_POST["referencias_empresariales2"];
          $fecha_ereferencia2 = $_POST["fecha_referencia2"];
          $fecha_retiro2 = $_POST["fecha_retiro2"];
          $contacto_ref2 = $_POST["contacto_ref2"];
          $celular_ref2 = $_POST["celular_ref2"];
          $cargo_ref2 = $_POST["cargo_ref2"];
          $anti_ref2 = $_POST["anti_ref2"];

          $referencias_empresariales3 = $_POST["referencias_empresariales3"];
          $fecha_referencia3 = $_POST["fecha_referencia3"];
          $fecha_retiro3 = $_POST["fecha_retiro3"];
          $contacto_ref3 = $_POST["contacto_ref3"];
          $celular_ref3 = $_POST["celular_ref3"];
          $cargo_ref3 = $_POST["cargo_ref3"];
          $anti_ref3 = $_POST["anti_ref3"];

          $referencias_personales = $_POST["referencias_personales"];
          $fecha_preferencia1 = $_POST["fecha_personal1"] ? $_POST["fecha_personal1"] : null;
          $parenp1 = $_POST["parenp1"];
          $telefonop1 = $_POST["telefonop1"];

          $refe_personal2 = $_POST["referencias_personales2"];
          $fecha_preferencia2 = $_POST["fecha_personal2"] ? $_POST["fecha_personal2"] : null;
          $parenp2 = $_POST["parenp2"];
          $telefonop2 = $_POST["telefonop2"];

          //NOMBRES DE LOS DOCUMENTOS
          if (isset($_POST["name_soporte"])) {
            $name_soporte = $_POST["name_soporte"];
          } else {
            $name_soporte = '';
          }

          if (isset($_POST["name_soporte2"])) {
            $name_soporte2 = $_POST["name_soporte2"];
          } else {
            $name_soporte2 = '';
          }

          if (isset($_POST["name_soporte3"])) {
            $name_soporte3 = $_POST["name_soporte3"];
          } else {
            $name_soporte3 = '';
          }

          if (isset($_FILES["docu_personal1"])) {
            $docu_personal1 = $_FILES["docu_personal1"];
          } else {
            $docu_personal1 = null;
          }

          if (isset($_FILES["docu_personal2"])) {
            $docu_personal2 = $_FILES["docu_personal2"];
          } else {
            $docu_personal2 = null;
          }

          if (isset($_POST["namedocu_eps"])) {
            $namedocu_eps = $_POST["namedocu_eps"];
          } else {
            $namedocu_eps = '';
          }
          $namedocu_arl = '';

          if (isset($_POST["namedocu_curso"])) {
            $namedocu_curso = $_POST["namedocu_curso"];
          } else {
            $namedocu_curso = '';
          }

          if (isset($_POST["name_docurut"])) {
            $name_docurut = $_POST["name_docurut"];
          } else {
            $name_docurut = '';
          }

          if (isset($_POST["name_doculice"])) {
            $name_doculice = $_POST["name_doculice"];
          } else {
            $name_doculice = '';
          }

          //nombre de las fotos del conductor
          if (isset($_POST["name_fontall"])) {
            $name_fontal = $_POST["name_fontall"];
          } else {
            $name_fontal = '';
          }

          if (isset($_POST["name_derecha"])) {
            $name_derecha = $_POST["name_derecha"];
          } else {
            $name_derecha = '';
          }

          if (isset($_POST["name_izquierda"])) {
            $name_izquierda = $_POST["name_izquierda"];
          } else {
            $name_izquierda = '';
          }

          if (isset($_POST["name_indum"])) {
            $name_indu = $_POST["name_indum"];
          } else {
            $name_indu = '';
          }
          //nombre de acuerdos
          if (isset($_POST["name_a1"])) {
            $name_a1 = $_POST["name_a1"];
          } else {
            $name_a1 = '';
          }

          /* Array de datos para hacer la insersion */
          $datos = [
            /* Datos Generales del proveedor */
            "tipo_documento" => $_POST['tipo_documento'],
            "numero_documento" => $_POST['numero_documento'],
            "digito_verificacion" =>  $_POST['digito_verificacion'],
            "tipo_identificacion" => $_POST['tipo_identificacion'],
            "rndc_nombre2" => $_POST['rndc_nombre'],
            "apellido1" =>  $apellido1,
            "apellido2" => $apellido2,
            "abreviatura" => $_POST['abreviatura'],
            "contacto" => $_POST['contacto'],
            "celular" => $_POST['celular'],
            "direccion" => $_POST['direccion'],
            "email" => $_POST['email'],
            "municipio" => $_POST['municipio'],

            /* Datos del conductor especificos */
            "rndc_categoria_licencia" => isset($_POST["categoria_licencia"]) ? $_POST["categoria_licencia"] : null,
            "rndc_numero_licencia" => isset($_POST["numero_licencia"]) ? $_POST["numero_licencia"] : null,
            "rndc_vencimiento_licencia" => isset($_POST["vencimiento_licencia"]) ? $_POST["vencimiento_licencia"] : null,
            "estado" => $_POST['estado'],
            "documentos" => isset($_FILES['documentos']) ? $_FILES['documentos'] : null,
            "celular2" => isset($_POST['celular2']) ? $_POST['celular2'] : null,
            "nombre_eps" => isset($_POST['name_eps']) ? $_POST['name_eps'] : null,
            "fecha_vencimiento" => empty($_POST["vence_eps"]) ? null : $_POST["vence_eps"],
            "ultimo_eps" => isset($ultimo_eps) ? $ultimo_eps : null,
            "nombre_arl" => isset($nombre_arl) ? $nombre_arl : null,
            "fecha_vencimiento_arl" => $fecha_vencimiento_arl == '' ? null : $fecha_vencimiento_arl,
            "ultimo_arl" => isset($ultimo_arl) ? $ultimo_arl : null,
            "nombre_entidad" => isset($_POST["nom_enti"]) ? $_POST["nom_enti"] : null,
            "vence_curso" => empty($_POST["vence_curso"]) ? null : $_POST["vence_curso"],
            "sexo" => $_POST['sexo'],
            "fecha_nace" => $_POST["fecha_nacimiento"] == '' ? null : $_POST["fecha_nacimiento"],
            "sangre" => isset($_POST["sangre"]) ? $_POST["sangre"] : null,
            "civil" => isset($civil) ? $civil : null,
            "fecha_ingreso" => $_POST["fecha_ingreso"] == '' ? null : $_POST["fecha_ingreso"],

            // Insertar referencias 
            // /*Referencia personal 1*/
            "referencias_empresariales1" => isset($referencias_empresariales) ? $referencias_empresariales : null,
            "fecha_referencia1" => empty($fecha_ereferencia1) ? null : $fecha_ereferencia1,
            "fecha_retiro1" => empty($fecha_retiro1) ? null : $fecha_retiro1,
            "contacto_ref1" => isset($contacto_ref1) ? $contacto_ref1 : null,
            "celular_ref1" => isset($celular_ref1) ? $celular_ref1 : null,
            "cargo_ref1" => isset($cargo_ref1) ? $cargo_ref1 : null,
            "anti_ref1" => empty($anti_ref1) ? 0 :  $anti_ref1,
            "idp1" => isset($_POST['idp1']) ? $_POST['idp1'] : null,
            "documento_referencia1" =>  isset($_FILES["documento_referencia1"]) ? $_FILES["documento_referencia1"] : null,
            /* Fin primera referencia 1*/

            /*Referencia personal 2*/
            "referencias_empresariales2" => isset($referencia_empresarial2) ? $referencia_empresarial2 : null,
            "fecha_referencia2" => empty($fecha_ereferencia2) ? null : $fecha_ereferencia2,
            "fecha_retiro2" => empty($fecha_retiro2) ? null : $fecha_retiro2,
            "contacto_ref2" => isset($contacto_ref2) ? $contacto_ref2 : null,
            "celular_ref2" => isset($celular_ref2) ? $celular_ref2 : null,
            "cargo_ref2" => isset($cargo_ref2) ? $cargo_ref2 : null,
            "anti_ref2" => empty($anti_ref2) ? 0 :  $anti_ref2,
            "idp2" => isset($_POST['idp2']) ? $_POST['idp2'] : null,
            "documento_referencia2" =>  isset($_FILES["documento_referencia2"]) ? $_FILES["documento_referencia2"] : null,
            /* Fin primera referencia 2*/

            /*Referencia personal 3*/
            "referencias_empresariales3" => isset($referencias_empresariales3) ? $referencias_empresariales3 : null,
            "fecha_referencia3" => empty($fecha_referencia3) ? null : $fecha_referencia3,
            "fecha_retiro3" => empty($fecha_retiro3) ? null : $fecha_retiro3,
            "contacto_ref3" => isset($contacto_ref3) ? $contacto_ref3 : null,
            "celular_ref3" => isset($celular_ref3) ? $celular_ref3 : null,
            "cargo_ref3" => isset($cargo_ref3) ? $cargo_ref3 : null,
            "anti_ref3" => empty($anti_ref3) ? 0 : $anti_ref3,
            "idp3" => isset($_POST['idp3']) ? $_POST['idp3'] : null,
            "documento_referencia3" =>  isset($_FILES["documento_referencia3"]) ? $_FILES["documento_referencia3"] : null,
            /* Fin primera referencia 3*/

            // Documentos
            "licencia" => isset($_FILES['licencia']) ? $_FILES['licencia'] : null,
            "docu_eps" => isset($_FILES['docu_eps']) ? $_FILES['docu_eps'] : null,
            "foto_conductor" => isset($_FILES['foto_conductor']) ? $_FILES['foto_conductor'] : null,
            "foto_derecha" => isset($_FILES['foto_derecha']) ? $_FILES['foto_derecha'] : null,
            "foto_izquierda" => isset($_FILES['foto_izquierda']) ? $_FILES['foto_izquierda'] : null,
            "foto_indume" => isset($_FILES['foto_indume']) ? $_FILES['foto_indume'] : null,
            "docu_curso" => isset($_FILES['docu_curso']) ? $_FILES['docu_curso'] : null,
            "rut" => isset($_FILES['rut']) ? $_FILES['rut'] : null,
            "acuerdo_uno" => isset($_FILES['acuerdo_uno']) ? $_FILES['acuerdo_uno'] : null,
            // "docu_curso" => isset($docu) ? $docu : null,
            // "rut" => isset($_FILES['rut']) ? $_FILES['rut'] : null,
            // "acuerdo_uno" => isset($acuerdo) ? $acuerdo : null,

            //Nombre de los documentos
            "name_soporte" => isset($name_soporte) ? $name_soporte : null,
            "name_soporte2" => isset($name_soporte2) ? $name_soporte2 : null,
            "name_soporte3" => isset($name_soporte3) ? $name_soporte3 : null,
            "docu_personal1" => isset($docu_personal1) ? $docu_personal1 : null,
            "docu_personal2" => isset($docu_personal2) ? $docu_personal2 : null,
            "namedocu_eps" => isset($namedocu_eps) ? $namedocu_eps : null,
            "namedocu_curso" => isset($namedocu_curso) ? $namedocu_curso : null,
            "name_docurut" => isset($name_docurut) ? $name_docurut : null,
            "name_doculice" => isset($name_doculice) ? $name_doculice : null,
            "name_fontall" => isset($name_fontal) ? $name_fontal : null,
            "name_derecha" => isset($name_derecha) ? $name_derecha : null,
            "name_izquierda" => isset($name_izquierda) ? $name_izquierda : null,
            "name_indum" => isset($name_indu) ? $name_indu : null,
            "name_a1" => isset($name_a1) ? $name_a1 : null,

            //referencias personales 1
            "referencias_personales" => isset($referencias_personales) ? $referencias_personales : null,
            "fecha_personal1" => $fecha_preferencia1 == '' ? null : $fecha_preferencia1,
            "parenp1" => isset($parenp1) ? $parenp1 : null,
            "telefonop1" => isset($telefonop1) ? $telefonop1 : null,

            //referencias personales 2
            "referencias_personales2" => isset($refe_personal2) ? $refe_personal2 : null,
            "fecha_personal2" => $fecha_preferencia2 == '' ? null : $fecha_preferencia2,
            "parenp2" => isset($parenp2) ? $parenp2 : null,
            "telefonop2" => isset($telefonop2) ? $telefonop2 : null,

            "Actividad_conductor3" => 'Conductor',
            "Actividad_propietario3" => 'Propietario Vehiculo',
          ];
          $this->respuesta_poseedores = $this->_modelo->Insertar_proveedores($datos);
          if ($this->respuesta_poseedores['success'] == true) {
            $response = ['numero' => 200, 'mensaje' => $this->respuesta_poseedores['message']];
          } else if ($this->respuesta_poseedores['success'] == false) {
            $response = ['numero' => 400, 'mensaje' => $this->respuesta_poseedores['message']];
          }
          echo json_encode($response);
        }

        /* Conductor, propietario y poseedor son iguales */
        if ($Propietario == "true" &&  $Conductor == "true" && $Poseedor == "true" && $PropietarioTrailer == "false") {
          $ultimo_eps = null;
          $nombre_arl = '';
          $fecha_vencimiento_arl = null;
          $ultimo_arl = null;
          $civil = null;
          $response = [];

          $referencias_empresariales = $_POST["referencias_empresariales1"];
          $fecha_ereferencia1 = $_POST["fecha_referencia1"];
          $fecha_retiro1 = $_POST["fecha_retiro1"];
          $contacto_ref1 = $_POST["contacto_ref1"];
          $celular_ref1 = $_POST["celular_ref1"];
          $cargo_ref1 = $_POST["cargo_ref1"];
          $anti_ref1 = $_POST["anti_ref1"];

          $referencia_empresarial2 = $_POST["referencias_empresariales2"];
          $fecha_ereferencia2 = $_POST["fecha_referencia2"];
          $fecha_retiro2 = $_POST["fecha_retiro2"];
          $contacto_ref2 = $_POST["contacto_ref2"];
          $celular_ref2 = $_POST["celular_ref2"];
          $cargo_ref2 = $_POST["cargo_ref2"];
          $anti_ref2 = $_POST["anti_ref2"];

          $referencias_empresariales3 = $_POST["referencias_empresariales3"];
          $fecha_referencia3 = $_POST["fecha_referencia3"];
          $fecha_retiro3 = $_POST["fecha_retiro3"];
          $contacto_ref3 = $_POST["contacto_ref3"];
          $celular_ref3 = $_POST["celular_ref3"];
          $cargo_ref3 = $_POST["cargo_ref3"];
          $anti_ref3 = $_POST["anti_ref3"];

          $referencias_personales = $_POST["referencias_personales"];
          $fecha_preferencia1 = $_POST["fecha_personal1"] ? $_POST["fecha_personal1"] : null;
          $parenp1 = $_POST["parenp1"];
          $telefonop1 = $_POST["telefonop1"];

          $refe_personal2 = $_POST["referencias_personales2"];
          $fecha_preferencia2 = $_POST["fecha_personal2"] ? $_POST["fecha_personal2"] : null;
          $parenp2 = $_POST["parenp2"];
          $telefonop2 = $_POST["telefonop2"];

          //NOMBRES DE LOS DOCUMENTOS
          if (isset($_POST["name_soporte"])) {
            $name_soporte = $_POST["name_soporte"];
          } else {
            $name_soporte = '';
          }

          if (isset($_POST["name_soporte2"])) {
            $name_soporte2 = $_POST["name_soporte2"];
          } else {
            $name_soporte2 = '';
          }

          if (isset($_POST["name_soporte3"])) {
            $name_soporte3 = $_POST["name_soporte3"];
          } else {
            $name_soporte3 = '';
          }

          if (isset($_FILES["docu_personal1"])) {
            $docu_personal1 = $_FILES["docu_personal1"];
          } else {
            $docu_personal1 = null;
          }

          if (isset($_FILES["docu_personal2"])) {
            $docu_personal2 = $_FILES["docu_personal2"];
          } else {
            $docu_personal2 = null;
          }

          if (isset($_POST["namedocu_eps"])) {
            $namedocu_eps = $_POST["namedocu_eps"];
          } else {
            $namedocu_eps = '';
          }
          $namedocu_arl = '';

          if (isset($_POST["namedocu_curso"])) {
            $namedocu_curso = $_POST["namedocu_curso"];
          } else {
            $namedocu_curso = '';
          }

          if (isset($_POST["name_docurut"])) {
            $name_docurut = $_POST["name_docurut"];
          } else {
            $name_docurut = '';
          }

          if (isset($_POST["name_doculice"])) {
            $name_doculice = $_POST["name_doculice"];
          } else {
            $name_doculice = '';
          }

          //nombre de las fotos del conductor
          if (isset($_POST["name_fontall"])) {
            $name_fontal = $_POST["name_fontall"];
          } else {
            $name_fontal = '';
          }

          if (isset($_POST["name_derecha"])) {
            $name_derecha = $_POST["name_derecha"];
          } else {
            $name_derecha = '';
          }

          if (isset($_POST["name_izquierda"])) {
            $name_izquierda = $_POST["name_izquierda"];
          } else {
            $name_izquierda = '';
          }

          if (isset($_POST["name_indum"])) {
            $name_indu = $_POST["name_indum"];
          } else {
            $name_indu = '';
          }
          //nombre de acuerdos
          if (isset($_POST["name_a1"])) {
            $name_a1 = $_POST["name_a1"];
          } else {
            $name_a1 = '';
          }

          /* Array de datos para hacer la insersion */
          $datos = [
            /* Datos Generales del proveedor */
            "tipo_documento" => $_POST['tipo_documento'],
            "numero_documento" => $_POST['numero_documento'],
            "digito_verificacion" =>  $_POST['digito_verificacion'],
            "tipo_identificacion" => $_POST['tipo_identificacion'],
            "rndc_nombre2" => $_POST['rndc_nombre'],
            "apellido1" =>  $apellido1,
            "apellido2" => $apellido2,
            "abreviatura" => $_POST['abreviatura'],
            "contacto" => $_POST['contacto'],
            "celular" => $_POST['celular'],
            "direccion" => $_POST['direccion'],
            "email" => $_POST['email'],
            "municipio" => $_POST['municipio'],

            /* Datos del conductor especificos */
            "rndc_categoria_licencia" => isset($_POST["categoria_licencia"]) ? $_POST["categoria_licencia"] : null,
            "rndc_numero_licencia" => isset($_POST["numero_licencia"]) ? $_POST["numero_licencia"] : null,
            "rndc_vencimiento_licencia" => isset($_POST["vencimiento_licencia"]) ? $_POST["vencimiento_licencia"] : null,
            "estado" => $_POST['estado'],
            "documentos" => isset($_FILES['documentos']) ? $_FILES['documentos'] : null,
            "celular2" => isset($_POST['celular2']) ? $_POST['celular2'] : null,
            "nombre_eps" => isset($_POST['name_eps']) ? $_POST['name_eps'] : null,
            "fecha_vencimiento" => empty($_POST["vence_eps"]) ? null : $_POST["vence_eps"],
            "ultimo_eps" => isset($ultimo_eps) ? $ultimo_eps : null,
            "nombre_arl" => isset($nombre_arl) ? $nombre_arl : null,
            "fecha_vencimiento_arl" => $fecha_vencimiento_arl == '' ? null : $fecha_vencimiento_arl,
            "ultimo_arl" => isset($ultimo_arl) ? $ultimo_arl : null,
            "nombre_entidad" => isset($_POST["nom_enti"]) ? $_POST["nom_enti"] : null,
            "vence_curso" => empty($_POST["vence_curso"]) ? null : $_POST["vence_curso"],
            "sexo" => $_POST['sexo'],
            "fecha_nace" => $_POST["fecha_nacimiento"] == '' ? null : $_POST["fecha_nacimiento"],
            "sangre" => isset($_POST["sangre"]) ? $_POST["sangre"] : null,
            "civil" => isset($civil) ? $civil : null,
            "fecha_ingreso" => $_POST["fecha_ingreso"] == '' ? null : $_POST["fecha_ingreso"],

            // Insertar referencias 
            /*Referencia personal 1*/
            "referencias_empresariales1" => isset($referencias_empresariales) ? $referencias_empresariales : null,
            "fecha_referencia1" => empty($fecha_ereferencia1) ? null : $fecha_ereferencia1,
            "fecha_retiro1" => empty($fecha_retiro1) ? null : $fecha_retiro1,
            "contacto_ref1" => isset($contacto_ref1) ? $contacto_ref1 : null,
            "celular_ref1" => isset($celular_ref1) ? $celular_ref1 : null,
            "cargo_ref1" => isset($cargo_ref1) ? $cargo_ref1 : null,
            "anti_ref1" => empty($anti_ref1) ? 0 :  $anti_ref1,
            "idp1" => isset($_POST['idp1']) ? $_POST['idp1'] : null,
            "documento_referencia1" =>  isset($_FILES["documento_referencia1"]) ? $_FILES["documento_referencia1"] : null,
            /* Fin primera referencia 1*/

            /*Referencia personal 2*/
            "referencias_empresariales2" => isset($referencia_empresarial2) ? $referencia_empresarial2 : null,
            "fecha_referencia2" => empty($fecha_ereferencia2) ? null : $fecha_ereferencia2,
            "fecha_retiro2" => empty($fecha_retiro2) ? null : $fecha_retiro2,
            "contacto_ref2" => isset($contacto_ref2) ? $contacto_ref2 : null,
            "celular_ref2" => isset($celular_ref2) ? $celular_ref2 : null,
            "cargo_ref2" => isset($cargo_ref2) ? $cargo_ref2 : null,
            "anti_ref2" => empty($anti_ref2) ? 0 :  $anti_ref2,
            "idp2" => isset($_POST['idp2']) ? $_POST['idp2'] : null,
            "documento_referencia2" =>  isset($_FILES["documento_referencia2"]) ? $_FILES["documento_referencia2"] : null,
            /* Fin primera referencia 2*/

            /*Referencia personal 3*/
            "referencias_empresariales3" => isset($referencias_empresariales3) ? $referencias_empresariales3 : null,
            "fecha_referencia3" => empty($fecha_referencia3) ? null : $fecha_referencia3,
            "fecha_retiro3" => empty($fecha_retiro3) ? null : $fecha_retiro3,
            "contacto_ref3" => isset($contacto_ref3) ? $contacto_ref3 : null,
            "celular_ref3" => isset($celular_ref3) ? $celular_ref3 : null,
            "cargo_ref3" => isset($cargo_ref3) ? $cargo_ref3 : null,
            "anti_ref3" => empty($anti_ref3) ? 0 : $anti_ref3,
            "idp3" => isset($_POST['idp3']) ? $_POST['idp3'] : null,
            "documento_referencia3" =>  isset($_FILES["documento_referencia3"]) ? $_FILES["documento_referencia3"] : null,
            /* Fin primera referencia 3*/

            // Documentos
            "licencia" => isset($_FILES['licencia']) ? $_FILES['licencia'] : null,
            "docu_eps" => isset($_FILES['docu_eps']) ? $_FILES['docu_eps'] : null,
            "foto_conductor" => isset($_FILES['foto_conductor']) ? $_FILES['foto_conductor'] : null,
            "foto_derecha" => isset($_FILES['foto_derecha']) ? $_FILES['foto_derecha'] : null,
            "foto_izquierda" => isset($_FILES['foto_izquierda']) ? $_FILES['foto_izquierda'] : null,
            "foto_indume" => isset($_FILES['foto_indume']) ? $_FILES['foto_indume'] : null,
            "docu_curso" => isset($_FILES['docu_curso']) ? $_FILES['docu_curso'] : null,
            "rut" => isset($_FILES['rut']) ? $_FILES['rut'] : null,
            "acuerdo_uno" => isset($_FILES['acuerdo_uno']) ? $_FILES['acuerdo_uno'] : null,

            //Nombre de los documentos
            "name_soporte" => isset($name_soporte) ? $name_soporte : null,
            "name_soporte2" => isset($name_soporte2) ? $name_soporte2 : null,
            "name_soporte3" => isset($name_soporte3) ? $name_soporte3 : null,
            "docu_personal1" => isset($docu_personal1) ? $docu_personal1 : null,
            "docu_personal2" => isset($docu_personal2) ? $docu_personal2 : null,
            "namedocu_eps" => isset($namedocu_eps) ? $namedocu_eps : null,
            "namedocu_curso" => isset($namedocu_curso) ? $namedocu_curso : null,
            "name_docurut" => isset($name_docurut) ? $name_docurut : null,
            "name_doculice" => isset($name_doculice) ? $name_doculice : null,
            "name_fontall" => isset($name_fontal) ? $name_fontal : null,
            "name_derecha" => isset($name_derecha) ? $name_derecha : null,
            "name_izquierda" => isset($name_izquierda) ? $name_izquierda : null,
            "name_indum" => isset($name_indu) ? $name_indu : null,
            "name_a1" => isset($name_a1) ? $name_a1 : null,

            //referencias personales 1
            "referencias_personales" => isset($referencias_personales) ? $referencias_personales : null,
            "fecha_personal1" => $fecha_preferencia1 == '' ? null : $fecha_preferencia1,
            "parenp1" => isset($parenp1) ? $parenp1 : null,
            "telefonop1" => isset($telefonop1) ? $telefonop1 : null,

            //referencias personales 2
            "referencias_personales2" => isset($refe_personal2) ? $refe_personal2 : null,
            "fecha_personal2" => $fecha_preferencia2 == '' ? null :  $fecha_preferencia2,
            "parenp2" => isset($parenp2) ? $parenp2 : null,
            "telefonop2" => isset($telefonop2) ? $telefonop2 : null,

            /* Datos de actividad Proveedor */
            "actividad_econo" => $_POST["actividad_econo"],
            "tributarias" => $_POST["tributarias"],
            "banco" => $_POST["banco"],
            "tipocuenta" => $_POST["tipocuenta"],
            "numerocuenta" => $_POST["numerocuenta"],

            "Actividad_conductor4" => 'Conductor',
            "Actividad_propietario4" => 'Propietario Vehiculo',
            "Actividad_poseedor4" => 'Poseedor Vehiculo',
          ];

          $this->respuesta_poseedores = $this->_modelo->Insertar_proveedores($datos);
          if ($this->respuesta_poseedores['success'] == true) {
            $response = ['numero' => 200, 'mensaje' => $this->respuesta_poseedores['message']];
          } else if ($this->respuesta_poseedores['success'] == false) {
            $response = ['numero' => 400, 'mensaje' => $this->respuesta_poseedores['message']];
          }
          echo json_encode($response);
        }

        /* VALIDACIONES PARA INSERTAR EL PROPIERTARIO DEL TRAILER */
        if ($PropietarioTrailer == "true" && $Propietario == "false" &&  $Conductor == "false" && $Poseedor == "false") {
          $datos = [
            /* Datos Generales del proveedor */
            "tipo_documento" => $_POST['tipo_documento'],
            "numero_documento" => $_POST['numero_documento'],
            "digito_verificacion" =>  $_POST['digito_verificacion'],
            "tipo_identificacion" => $_POST['tipo_identificacion'],
            "rndc_nombre2" => $_POST['rndc_nombre'],
            "apellido1" =>  $apellido1,
            "apellido2" => $apellido2,
            "abreviatura" => $_POST['abreviatura'],
            "contacto" => $_POST['contacto'],
            "celular" => $_POST['celular'],
            "direccion" => $_POST['direccion'],
            "email" => $_POST['email'],
            "municipio" => $_POST['municipio'],
            "estado" => $_POST['estado'],
            /* Datos de actividad Proveedor */
            "actividad_econo" => isset($_POST["actividad_econo"]) ? $_POST["actividad_econo"] : null,
            "tributarias" => isset($_POST["tributarias"]) ? $_POST["tributarias"] : null,
            "banco" => isset($_POST["banco"]) ? $_POST["banco"] : null,
            "tipocuenta" => isset($_POST["tipocuenta"]) ? $_POST["tipocuenta"] : null,
            "numerocuenta" => isset($_POST["numerocuenta"]) ? $_POST["numerocuenta"] : null,
          ];
          $this->respuesta_propietario = $this->_modelo->Insertar_Propietario_trailer($datos);
          if ($this->respuesta_propietario == true) {
            $response = ['numero' => 200, 'mensaje' => 'Se Registro Datos Exitosamente NEXOSAPP.'];
            $this->guardar_proveedor = $response;
            // echo json_encode($this->guardar_proveedor);
          } else if ($this->respuesta_propietario == false) {
            $response = ['numero' => 400, 'mensaje' => 'Error No se creo el Tercero en NEXOSAPP.'];
            $this->guardar_proveedor = $response;
          }
          echo json_encode($this->guardar_proveedor);
        }

        if ($Propietario == "true" && $PropietarioTrailer == "true" && $Conductor == "false" && $Poseedor == "false") {
          $response = [];
          $datos = [
            /* Datos Generales del proveedor */
            "tipo_documento" => $_POST['tipo_documento'],
            "numero_documento" => $_POST['numero_documento'],
            "digito_verificacion" =>  $_POST['digito_verificacion'],
            "tipo_identificacion" => $_POST['tipo_identificacion'],
            "rndc_nombre2" => $_POST['rndc_nombre'],
            "apellido1" =>  $apellido1,
            "apellido2" => $apellido2,
            "abreviatura" => $_POST['abreviatura'],
            "contacto" => $_POST['contacto'],
            "celular" => $_POST['celular'],
            "direccion" => $_POST['direccion'],
            "email" => $_POST['email'],
            "municipio" => $_POST['municipio'],
            "estado" => $_POST['estado'],

            /* Datos de actividad Proveedor */
            "actividad_econo" => $_POST["actividad_econo"],
            "tributarias" => $_POST["tributarias"],
            "banco" => $_POST["banco"],
            "tipocuenta" => $_POST["tipocuenta"],
            "numerocuenta" => $_POST["numerocuenta"],
          ];

          $this->Respuesta_Propietario_Propietario_Trailer = $this->_modelo->Insertar_Propietario_Propietario_Trailer($datos);
          if ($this->Respuesta_Propietario_Propietario_Trailer['success'] == true) {
            $response = ['numero' => 200, 'mensaje' => $this->Respuesta_Propietario_Propietario_Trailer['message']];
          } else if ($this->Respuesta_Propietario_Propietario_Trailer['success'] == false) {
            $response = ['numero' => 400, 'mensaje' => $this->Respuesta_Propietario_Propietario_Trailer['message']];
          }
          echo json_encode($response);
        }

        if ($Poseedor == "true" && $PropietarioTrailer == "true" && $Conductor == "false" && $Propietario == "false") {
          $response = [];
          $datos = [
            /* Datos Generales del proveedor */
            "tipo_documento" => $_POST['tipo_documento'],
            "numero_documento" => $_POST['numero_documento'],
            "digito_verificacion" =>  $_POST['digito_verificacion'],
            "tipo_identificacion" => $_POST['tipo_identificacion'],
            "rndc_nombre2" => $_POST['rndc_nombre'],
            "apellido1" =>  $apellido1,
            "apellido2" => $apellido2,
            "abreviatura" => $_POST['abreviatura'],
            "contacto" => $_POST['contacto'],
            "celular" => $_POST['celular'],
            "direccion" => $_POST['direccion'],
            "email" => $_POST['email'],
            "municipio" => $_POST['municipio'],
            "estado" => $_POST['estado'],

            /* Datos de actividad Proveedor */
            "actividad_econo" => $_POST["actividad_econo"],
            "tributarias" => $_POST["tributarias"],
            "banco" => $_POST["banco"],
            "tipocuenta" => $_POST["tipocuenta"],
            "numerocuenta" => $_POST["numerocuenta"],
          ];

          $this->Respuesta_Poseedor_Propietario_Trailer = $this->_modelo->Insertar_Poseedor_Propietario_Trailer($datos);
          if ($this->Respuesta_Poseedor_Propietario_Trailer['success'] == true) {
            $response = ['numero' => 200, 'mensaje' => $this->Respuesta_Poseedor_Propietario_Trailer['message']];
          } else if ($this->Respuesta_Poseedor_Propietario_Trailer['success'] == false) {
            $response = ['numero' => 400, 'mensaje' => $this->Respuesta_Poseedor_Propietario_Trailer['message']];
          }
          echo json_encode($response);
        }

        if ($Conductor == "true" && $PropietarioTrailer == "true" && $Propietario == "false" && $Poseedor == "false") {
          $ultimo_eps = null;;
          $nombre_arl = '';
          $fecha_vencimiento_arl = null;
          $ultimo_arl = null;
          $civil = null;
          $response = [];

          $referencias_empresariales = $_POST["referencias_empresariales1"];
          $fecha_ereferencia1 = $_POST["fecha_referencia1"];
          $fecha_retiro1 = $_POST["fecha_retiro1"];
          $contacto_ref1 = $_POST["contacto_ref1"];
          $celular_ref1 = $_POST["celular_ref1"];
          $cargo_ref1 = $_POST["cargo_ref1"];
          $anti_ref1 = $_POST["anti_ref1"];

          $referencia_empresarial2 = $_POST["referencias_empresariales2"];
          $fecha_ereferencia2 = $_POST["fecha_referencia2"];
          $fecha_retiro2 = $_POST["fecha_retiro2"];
          $contacto_ref2 = $_POST["contacto_ref2"];
          $celular_ref2 = $_POST["celular_ref2"];
          $cargo_ref2 = $_POST["cargo_ref2"];
          $anti_ref2 = $_POST["anti_ref2"];

          $referencias_empresariales3 = $_POST["referencias_empresariales3"];
          $fecha_referencia3 = $_POST["fecha_referencia3"];
          $fecha_retiro3 = $_POST["fecha_retiro3"];
          $contacto_ref3 = $_POST["contacto_ref3"];
          $celular_ref3 = $_POST["celular_ref3"];
          $cargo_ref3 = $_POST["cargo_ref3"];
          $anti_ref3 = $_POST["anti_ref3"];

          $referencias_personales = $_POST["referencias_personales"];
          $fecha_preferencia1 = $_POST["fecha_personal1"] ? $_POST["fecha_personal1"] : null;
          $parenp1 = $_POST["parenp1"];
          $telefonop1 = $_POST["telefonop1"];

          $refe_personal2 = $_POST["referencias_personales2"];
          $fecha_preferencia2 = $_POST["fecha_personal2"] ? $_POST["fecha_personal2"] : null;
          $parenp2 = $_POST["parenp2"];
          $telefonop2 = $_POST["telefonop2"];

          //NOMBRES DE LOS DOCUMENTOS
          if (isset($_POST["name_soporte"])) {
            $name_soporte = $_POST["name_soporte"];
          } else {
            $name_soporte = '';
          }

          if (isset($_POST["name_soporte2"])) {
            $name_soporte2 = $_POST["name_soporte2"];
          } else {
            $name_soporte2 = '';
          }

          if (isset($_POST["name_soporte3"])) {
            $name_soporte3 = $_POST["name_soporte3"];
          } else {
            $name_soporte3 = '';
          }

          if (isset($_FILES["docu_personal1"])) {
            $docu_personal1 = $_FILES["docu_personal1"];
          } else {
            $docu_personal1 = null;
          }

          if (isset($_FILES["docu_personal2"])) {
            $docu_personal2 = $_FILES["docu_personal2"];
          } else {
            $docu_personal2 = null;
          }

          if (isset($_POST["namedocu_eps"])) {
            $namedocu_eps = $_POST["namedocu_eps"];
          } else {
            $namedocu_eps = '';
          }
          $namedocu_arl = '';

          if (isset($_POST["namedocu_curso"])) {
            $namedocu_curso = $_POST["namedocu_curso"];
          } else {
            $namedocu_curso = '';
          }

          if (isset($_POST["name_docurut"])) {
            $name_docurut = $_POST["name_docurut"];
          } else {
            $name_docurut = '';
          }

          if (isset($_POST["name_doculice"])) {
            $name_doculice = $_POST["name_doculice"];
          } else {
            $name_doculice = '';
          }

          //nombre de las fotos del conductor
          if (isset($_POST["name_fontall"])) {
            $name_fontal = $_POST["name_fontall"];
          } else {
            $name_fontal = '';
          }

          if (isset($_POST["name_derecha"])) {
            $name_derecha = $_POST["name_derecha"];
          } else {
            $name_derecha = '';
          }

          if (isset($_POST["name_izquierda"])) {
            $name_izquierda = $_POST["name_izquierda"];
          } else {
            $name_izquierda = '';
          }

          if (isset($_POST["name_indum"])) {
            $name_indu = $_POST["name_indum"];
          } else {
            $name_indu = '';
          }
          //nombre de acuerdos
          if (isset($_POST["name_a1"])) {
            $name_a1 = $_POST["name_a1"];
          } else {
            $name_a1 = '';
          }

          /* Array de datos para hacer la insersion */
          $datos = [
            /* Datos Generales del proveedor */
            "tipo_documento" => $_POST['tipo_documento'],
            "numero_documento" => $_POST['numero_documento'],
            "digito_verificacion" =>  $_POST['digito_verificacion'],
            "tipo_identificacion" => $_POST['tipo_identificacion'],
            "rndc_nombre2" => $_POST['rndc_nombre'],
            "apellido1" =>  $apellido1,
            "apellido2" => $apellido2,
            "abreviatura" => $_POST['abreviatura'],
            "contacto" => $_POST['contacto'],
            "celular" => $_POST['celular'],
            "direccion" => $_POST['direccion'],
            "email" => $_POST['email'],
            "municipio" => $_POST['municipio'],

            /* Datos del conductor especificos */
            "rndc_categoria_licencia" => isset($_POST["categoria_licencia"]) ? $_POST["categoria_licencia"] : null,
            "rndc_numero_licencia" => isset($_POST["numero_licencia"]) ? $_POST["numero_licencia"] : null,
            "rndc_vencimiento_licencia" => isset($_POST["vencimiento_licencia"]) ? $_POST["vencimiento_licencia"] : null,
            "estado" => $_POST['estado'],
            "documentos" => isset($_FILES['documentos']) ? $_FILES['documentos'] : null,
            "celular2" => isset($_POST['celular2']) ? $_POST['celular2'] : null,
            "nombre_eps" => isset($_POST['name_eps']) ? $_POST['name_eps'] : null,
            "fecha_vencimiento" => empty($_POST["vence_eps"]) ? null : $_POST["vence_eps"],
            "ultimo_eps" => isset($ultimo_eps) ? $ultimo_eps : null,
            "nombre_arl" => isset($nombre_arl) ? $nombre_arl : null,
            "fecha_vencimiento_arl" => $fecha_vencimiento_arl == '' ? null : $fecha_vencimiento_arl,
            "ultimo_arl" => isset($ultimo_arl) ? $ultimo_arl : null,
            "nombre_entidad" => isset($_POST["nom_enti"]) ? $_POST["nom_enti"] : null,
            "vence_curso" => empty($_POST["vence_curso"]) ? null : $_POST["vence_curso"],
            "sexo" => $_POST['sexo'],
            "fecha_nace" => $_POST["fecha_nacimiento"] == '' ? null : $_POST["fecha_nacimiento"],
            "sangre" => isset($_POST["sangre"]) ? $_POST["sangre"] : null,
            "civil" => isset($civil) ? $civil : null,
            "fecha_ingreso" => $_POST["fecha_ingreso"] == '' ? null : $_POST["fecha_ingreso"],

            // Insertar referencias 
            /*Referencia personal 1*/
            "referencias_empresariales1" => isset($referencias_empresariales) ? $referencias_empresariales : null,
            "fecha_referencia1" => empty($fecha_ereferencia1) ? null : $fecha_ereferencia1,
            "fecha_retiro1" => empty($fecha_retiro1) ? null : $fecha_retiro1,
            "contacto_ref1" => isset($contacto_ref1) ? $contacto_ref1 : null,
            "celular_ref1" => isset($celular_ref1) ? $celular_ref1 : null,
            "cargo_ref1" => isset($cargo_ref1) ? $cargo_ref1 : null,
            "anti_ref1" => empty($anti_ref1) ? 0 :  $anti_ref1,
            "idp1" => isset($_POST['idp1']) ? $_POST['idp1'] : null,
            "documento_referencia1" =>  isset($_FILES["documento_referencia1"]) ? $_FILES["documento_referencia1"] : null,
            /* Fin primera referencia 1*/

            /*Referencia personal 2*/
            "referencias_empresariales2" => isset($referencia_empresarial2) ? $referencia_empresarial2 : null,
            "fecha_referencia2" => empty($fecha_ereferencia2) ? null : $fecha_ereferencia2,
            "fecha_retiro2" => empty($fecha_retiro2) ? null : $fecha_retiro2,
            "contacto_ref2" => isset($contacto_ref2) ? $contacto_ref2 : null,
            "celular_ref2" => isset($celular_ref2) ? $celular_ref2 : null,
            "cargo_ref2" => isset($cargo_ref2) ? $cargo_ref2 : null,
            "anti_ref2" => empty($anti_ref2) ? 0 :  $anti_ref2,
            "idp2" => isset($_POST['idp2']) ? $_POST['idp2'] : null,
            "documento_referencia2" =>  isset($_FILES["documento_referencia2"]) ? $_FILES["documento_referencia2"] : null,
            /* Fin primera referencia 2*/

            /*Referencia personal 3*/
            "referencias_empresariales3" => isset($referencias_empresariales3) ? $referencias_empresariales3 : null,
            "fecha_referencia3" => empty($fecha_referencia3) ? null : $fecha_referencia3,
            "fecha_retiro3" => empty($fecha_retiro3) ? null : $fecha_retiro3,
            "contacto_ref3" => isset($contacto_ref3) ? $contacto_ref3 : null,
            "celular_ref3" => isset($celular_ref3) ? $celular_ref3 : null,
            "cargo_ref3" => isset($cargo_ref3) ? $cargo_ref3 : null,
            "anti_ref3" => empty($anti_ref3) ? 0 : $anti_ref3,
            "idp3" => isset($_POST['idp3']) ? $_POST['idp3'] : null,
            "documento_referencia3" =>  isset($_FILES["documento_referencia3"]) ? $_FILES["documento_referencia3"] : null,
            /* Fin primera referencia 3*/

            // Documentos
            "licencia" => isset($_FILES['licencia']) ? $_FILES['licencia'] : null,
            "docu_eps" => isset($_FILES['docu_eps']) ? $_FILES['docu_eps'] : null,
            "foto_conductor" => isset($_FILES['foto_conductor']) ? $_FILES['foto_conductor'] : null,
            "foto_derecha" => isset($_FILES['foto_derecha']) ? $_FILES['foto_derecha'] : null,
            "foto_izquierda" => isset($_FILES['foto_izquierda']) ? $_FILES['foto_izquierda'] : null,
            "foto_indume" => isset($_FILES['foto_indume']) ? $_FILES['foto_indume'] : null,
            "docu_curso" => isset($_FILES['docu_curso']) ? $_FILES['docu_curso'] : null,
            "rut" => isset($_FILES['rut']) ? $_FILES['rut'] : null,
            "acuerdo_uno" => isset($_FILES['acuerdo_uno']) ? $_FILES['acuerdo_uno'] : null,

            //Nombre de los documentos
            "name_soporte" => isset($name_soporte) ? $name_soporte : null,
            "name_soporte2" => isset($name_soporte2) ? $name_soporte2 : null,
            "name_soporte3" => isset($name_soporte3) ? $name_soporte3 : null,
            "docu_personal1" => isset($docu_personal1) ? $docu_personal1 : null,
            "docu_personal2" => isset($docu_personal2) ? $docu_personal2 : null,
            "namedocu_eps" => isset($namedocu_eps) ? $namedocu_eps : null,
            "namedocu_curso" => isset($namedocu_curso) ? $namedocu_curso : null,
            "name_docurut" => isset($name_docurut) ? $name_docurut : null,
            "name_doculice" => isset($name_doculice) ? $name_doculice : null,
            "name_fontall" => isset($name_fontal) ? $name_fontal : null,
            "name_derecha" => isset($name_derecha) ? $name_derecha : null,
            "name_izquierda" => isset($name_izquierda) ? $name_izquierda : null,
            "name_indum" => isset($name_indu) ? $name_indu : null,
            "name_a1" => isset($name_a1) ? $name_a1 : null,

            //referencias personales 1
            "referencias_personales" => isset($referencias_personales) ? $referencias_personales : null,
            "fecha_personal1" => $fecha_preferencia1 == '' ? null : $fecha_preferencia1,
            "parenp1" => isset($parenp1) ? $parenp1 : null,
            "telefonop1" => isset($telefonop1) ? $telefonop1 : null,

            //referencias personales 2
            "referencias_personales2" => isset($refe_personal2) ? $refe_personal2 : null,
            "fecha_personal2" => $fecha_preferencia2 == '' ? null :  $fecha_preferencia2,
            "parenp2" => isset($parenp2) ? $parenp2 : null,
            "telefonop2" => isset($telefonop2) ? $telefonop2 : null,

            /* Datos de actividad Proveedor */
            "actividad_econo" => isset($_POST["actividad_econo"]) ? $_POST["actividad_econo"] : null,
            "tributarias" => isset($_POST["tributarias"]) ? $_POST["tributarias"] : null,
            "banco" => isset($_POST["banco"]) ? $_POST["banco"] : null,
            "tipocuenta" => isset($_POST["tipocuenta"]) ? $_POST["tipocuenta"] : null,
            "numerocuenta" => isset($_POST["numerocuenta"]) ? $_POST["numerocuenta"] : null,
          ];

          $this->Respuesta_Conductor_Propietario_Trailer = $this->_modelo->Insertar_Conductor_Propietario_Trailer($datos);
          if ($this->Respuesta_Conductor_Propietario_Trailer['success'] == true) {
            $response = ['numero' => 200, 'mensaje' => $this->Respuesta_Conductor_Propietario_Trailer['message']];
          } else if ($this->Respuesta_Conductor_Propietario_Trailer['success'] == false) {
            $response = ['numero' => 400, 'mensaje' => $this->Respuesta_Conductor_Propietario_Trailer['message']];
          }
          echo json_encode($response);
        }

        if ($Propietario == "true" && $Poseedor == "true" && $PropietarioTrailer == "true" &&  $Conductor == "false") {
          $response = [];
          $datos = [
            /* Datos Generales del proveedor */
            "tipo_documento" => $_POST['tipo_documento'],
            "numero_documento" => $_POST['numero_documento'],
            "digito_verificacion" =>  $_POST['digito_verificacion'],
            "tipo_identificacion" => $_POST['tipo_identificacion'],
            "rndc_nombre2" => $_POST['rndc_nombre'],
            "apellido1" =>  $apellido1,
            "apellido2" => $apellido2,
            "abreviatura" => $_POST['abreviatura'],
            "contacto" => $_POST['contacto'],
            "celular" => $_POST['celular'],
            "direccion" => $_POST['direccion'],
            "email" => $_POST['email'],
            "municipio" => $_POST['municipio'],
            "estado" => $_POST['estado'],

            /* Datos de actividad Proveedor */
            "actividad_econo" => $_POST["actividad_econo"],
            "tributarias" => $_POST["tributarias"],
            "banco" => $_POST["banco"],
            "tipocuenta" => $_POST["tipocuenta"],
            "numerocuenta" => $_POST["numerocuenta"],
          ];

          $this->Respuesta_Propietario_Poseedor_Propietario_Trailer = $this->_modelo->Insertar_Propietario_Poseedor_Propietario_Trailer($datos);
          if ($this->Respuesta_Propietario_Poseedor_Propietario_Trailer['success'] == true) {
            $response = ['numero' => 200, 'mensaje' => $this->Respuesta_Propietario_Poseedor_Propietario_Trailer['message']];
          } else if ($this->Respuesta_Propietario_Poseedor_Propietario_Trailer['success'] == false) {
            $response = ['numero' => 400, 'mensaje' => $this->Respuesta_Propietario_Poseedor_Propietario_Trailer['message']];
          }
          echo json_encode($response);
        }

        //Insertar cuando todas las actividades son un solo proveedor
        if ($Propietario == "true" && $Poseedor == "true" && $PropietarioTrailer == "true" &&  $Conductor == "true") {
          $response = [];
          $ultimo_eps = null;
          $nombre_arl = '';
          $fecha_vencimiento_arl = null;
          $ultimo_arl = null;
          $civil = null;
          $response = [];

          $referencias_empresariales = $_POST["referencias_empresariales1"];
          $fecha_ereferencia1 = $_POST["fecha_referencia1"];
          $fecha_retiro1 = $_POST["fecha_retiro1"];
          $contacto_ref1 = $_POST["contacto_ref1"];
          $celular_ref1 = $_POST["celular_ref1"];
          $cargo_ref1 = $_POST["cargo_ref1"];
          $anti_ref1 = $_POST["anti_ref1"];

          $referencia_empresarial2 = $_POST["referencias_empresariales2"];
          $fecha_ereferencia2 = $_POST["fecha_referencia2"];
          $fecha_retiro2 = $_POST["fecha_retiro2"];
          $contacto_ref2 = $_POST["contacto_ref2"];
          $celular_ref2 = $_POST["celular_ref2"];
          $cargo_ref2 = $_POST["cargo_ref2"];
          $anti_ref2 = $_POST["anti_ref2"];

          $referencias_empresariales3 = $_POST["referencias_empresariales3"];
          $fecha_referencia3 = $_POST["fecha_referencia3"];
          $fecha_retiro3 = $_POST["fecha_retiro3"];
          $contacto_ref3 = $_POST["contacto_ref3"];
          $celular_ref3 = $_POST["celular_ref3"];
          $cargo_ref3 = $_POST["cargo_ref3"];
          $anti_ref3 = $_POST["anti_ref3"];

          $referencias_personales = $_POST["referencias_personales"];
          $fecha_preferencia1 = $_POST["fecha_personal1"] ? $_POST["fecha_personal1"] : null;
          $parenp1 = $_POST["parenp1"];
          $telefonop1 = $_POST["telefonop1"];

          $refe_personal2 = $_POST["referencias_personales2"];
          $fecha_preferencia2 = $_POST["fecha_personal2"] ? $_POST["fecha_personal2"] : null;
          $parenp2 = $_POST["parenp2"];
          $telefonop2 = $_POST["telefonop2"];

          //NOMBRES DE LOS DOCUMENTOS
          if (isset($_POST["name_soporte"])) {
            $name_soporte = $_POST["name_soporte"];
          } else {
            $name_soporte = '';
          }

          if (isset($_POST["name_soporte2"])) {
            $name_soporte2 = $_POST["name_soporte2"];
          } else {
            $name_soporte2 = '';
          }

          if (isset($_POST["name_soporte3"])) {
            $name_soporte3 = $_POST["name_soporte3"];
          } else {
            $name_soporte3 = '';
          }

          if (isset($_FILES["docu_personal1"])) {
            $docu_personal1 = $_FILES["docu_personal1"];
          } else {
            $docu_personal1 = null;
          }

          if (isset($_FILES["docu_personal2"])) {
            $docu_personal2 = $_FILES["docu_personal2"];
          } else {
            $docu_personal2 = null;
          }

          if (isset($_POST["namedocu_eps"])) {
            $namedocu_eps = $_POST["namedocu_eps"];
          } else {
            $namedocu_eps = '';
          }
          $namedocu_arl = '';

          if (isset($_POST["namedocu_curso"])) {
            $namedocu_curso = $_POST["namedocu_curso"];
          } else {
            $namedocu_curso = '';
          }

          if (isset($_POST["name_docurut"])) {
            $name_docurut = $_POST["name_docurut"];
          } else {
            $name_docurut = '';
          }

          if (isset($_POST["name_doculice"])) {
            $name_doculice = $_POST["name_doculice"];
          } else {
            $name_doculice = '';
          }

          //nombre de las fotos del conductor
          if (isset($_POST["name_fontall"])) {
            $name_fontal = $_POST["name_fontall"];
          } else {
            $name_fontal = '';
          }

          if (isset($_POST["name_derecha"])) {
            $name_derecha = $_POST["name_derecha"];
          } else {
            $name_derecha = '';
          }

          if (isset($_POST["name_izquierda"])) {
            $name_izquierda = $_POST["name_izquierda"];
          } else {
            $name_izquierda = '';
          }

          if (isset($_POST["name_indum"])) {
            $name_indu = $_POST["name_indum"];
          } else {
            $name_indu = '';
          }
          //nombre de acuerdos
          if (isset($_POST["name_a1"])) {
            $name_a1 = $_POST["name_a1"];
          } else {
            $name_a1 = '';
          }

          /* Array de datos para hacer la insersion */
          $datos = [
            /* Datos Generales del proveedor */
            "tipo_documento" => $_POST['tipo_documento'],
            "numero_documento" => $_POST['numero_documento'],
            "digito_verificacion" =>  $_POST['digito_verificacion'],
            "tipo_identificacion" => $_POST['tipo_identificacion'],
            "rndc_nombre2" => $_POST['rndc_nombre'],
            "apellido1" =>  $apellido1,
            "apellido2" => $apellido2,
            "abreviatura" => $_POST['abreviatura'],
            "contacto" => $_POST['contacto'],
            "celular" => $_POST['celular'],
            "direccion" => $_POST['direccion'],
            "email" => $_POST['email'],
            "municipio" => $_POST['municipio'],

            /* Datos del conductor especificos */
            "rndc_categoria_licencia" => isset($_POST["categoria_licencia"]) ? $_POST["categoria_licencia"] : null,
            "rndc_numero_licencia" => isset($_POST["numero_licencia"]) ? $_POST["numero_licencia"] : null,
            "rndc_vencimiento_licencia" => isset($_POST["vencimiento_licencia"]) ? $_POST["vencimiento_licencia"] : null,
            "estado" => $_POST['estado'],
            "documentos" => isset($_FILES['documentos']) ? $_FILES['documentos'] : null,
            "celular2" => isset($_POST['celular2']) ? $_POST['celular2'] : null,
            "nombre_eps" => isset($_POST['name_eps']) ? $_POST['name_eps'] : null,
            "fecha_vencimiento" => empty($_POST["vence_eps"]) ? null : $_POST["vence_eps"],
            "ultimo_eps" => isset($ultimo_eps) ? $ultimo_eps : null,
            "nombre_arl" => isset($nombre_arl) ? $nombre_arl : null,
            "fecha_vencimiento_arl" => $fecha_vencimiento_arl == '' ? null : $fecha_vencimiento_arl,
            "ultimo_arl" => isset($ultimo_arl) ? $ultimo_arl : null,
            "nombre_entidad" => isset($_POST["nom_enti"]) ? $_POST["nom_enti"] : null,
            "vence_curso" => empty($_POST["vence_curso"]) ? null : $_POST["vence_curso"],
            "sexo" => $_POST['sexo'],
            "fecha_nace" => $_POST["fecha_nacimiento"] == '' ? null : $_POST["fecha_nacimiento"],
            "sangre" => isset($_POST["sangre"]) ? $_POST["sangre"] : null,
            "civil" => isset($civil) ? $civil : null,
            "fecha_ingreso" => $_POST["fecha_ingreso"] == '' ? null : $_POST["fecha_ingreso"],

            // Insertar referencias 
            /*Referencia personal 1*/
            "referencias_empresariales1" => isset($referencias_empresariales) ? $referencias_empresariales : null,
            "fecha_referencia1" => empty($fecha_ereferencia1) ? null : $fecha_ereferencia1,
            "fecha_retiro1" => empty($fecha_retiro1) ? null : $fecha_retiro1,
            "contacto_ref1" => isset($contacto_ref1) ? $contacto_ref1 : null,
            "celular_ref1" => isset($celular_ref1) ? $celular_ref1 : null,
            "cargo_ref1" => isset($cargo_ref1) ? $cargo_ref1 : null,
            "anti_ref1" => empty($anti_ref1) ? 0 :  $anti_ref1,
            "idp1" => isset($_POST['idp1']) ? $_POST['idp1'] : null,
            "documento_referencia1" =>  isset($_FILES["documento_referencia1"]) ? $_FILES["documento_referencia1"] : null,
            /* Fin primera referencia 1*/

            /*Referencia personal 2*/
            "referencias_empresariales2" => isset($referencia_empresarial2) ? $referencia_empresarial2 : null,
            "fecha_referencia2" => empty($fecha_ereferencia2) ? null : $fecha_ereferencia2,
            "fecha_retiro2" => empty($fecha_retiro2) ? null : $fecha_retiro2,
            "contacto_ref2" => isset($contacto_ref2) ? $contacto_ref2 : null,
            "celular_ref2" => isset($celular_ref2) ? $celular_ref2 : null,
            "cargo_ref2" => isset($cargo_ref2) ? $cargo_ref2 : null,
            "anti_ref2" => empty($anti_ref2) ? 0 :  $anti_ref2,
            "idp2" => isset($_POST['idp2']) ? $_POST['idp2'] : null,
            "documento_referencia2" =>  isset($_FILES["documento_referencia2"]) ? $_FILES["documento_referencia2"] : null,
            /* Fin primera referencia 2*/

            /*Referencia personal 3*/
            "referencias_empresariales3" => isset($referencias_empresariales3) ? $referencias_empresariales3 : null,
            "fecha_referencia3" => empty($fecha_referencia3) ? null : $fecha_referencia3,
            "fecha_retiro3" => empty($fecha_retiro3) ? null : $fecha_retiro3,
            "contacto_ref3" => isset($contacto_ref3) ? $contacto_ref3 : null,
            "celular_ref3" => isset($celular_ref3) ? $celular_ref3 : null,
            "cargo_ref3" => isset($cargo_ref3) ? $cargo_ref3 : null,
            "anti_ref3" => empty($anti_ref3) ? 0 : $anti_ref3,
            "idp3" => isset($_POST['idp3']) ? $_POST['idp3'] : null,
            "documento_referencia3" =>  isset($_FILES["documento_referencia3"]) ? $_FILES["documento_referencia3"] : null,
            /* Fin primera referencia 3*/

            // Documentos
            "licencia" => isset($_FILES['licencia']) ? $_FILES['licencia'] : null,
            "docu_eps" => isset($_FILES['docu_eps']) ? $_FILES['docu_eps'] : null,
            "foto_conductor" => isset($_FILES['foto_conductor']) ? $_FILES['foto_conductor'] : null,
            "foto_derecha" => isset($_FILES['foto_derecha']) ? $_FILES['foto_derecha'] : null,
            "foto_izquierda" => isset($_FILES['foto_izquierda']) ? $_FILES['foto_izquierda'] : null,
            "foto_indume" => isset($_FILES['foto_indume']) ? $_FILES['foto_indume'] : null,
            "docu_curso" => isset($_FILES['docu_curso']) ? $_FILES['docu_curso'] : null,
            "rut" => isset($_FILES['rut']) ? $_FILES['rut'] : null,
            "acuerdo_uno" => isset($_FILES['acuerdo_uno']) ? $_FILES['acuerdo_uno'] : null,

            //Nombre de los documentos
            "name_soporte" => isset($name_soporte) ? $name_soporte : null,
            "name_soporte2" => isset($name_soporte2) ? $name_soporte2 : null,
            "name_soporte3" => isset($name_soporte3) ? $name_soporte3 : null,
            "docu_personal1" => isset($docu_personal1) ? $docu_personal1 : null,
            "docu_personal2" => isset($docu_personal2) ? $docu_personal2 : null,
            "namedocu_eps" => isset($namedocu_eps) ? $namedocu_eps : null,
            "namedocu_curso" => isset($namedocu_curso) ? $namedocu_curso : null,
            "name_docurut" => isset($name_docurut) ? $name_docurut : null,
            "name_doculice" => isset($name_doculice) ? $name_doculice : null,
            "name_fontall" => isset($name_fontal) ? $name_fontal : null,
            "name_derecha" => isset($name_derecha) ? $name_derecha : null,
            "name_izquierda" => isset($name_izquierda) ? $name_izquierda : null,
            "name_indum" => isset($name_indu) ? $name_indu : null,
            "name_a1" => isset($name_a1) ? $name_a1 : null,

            //referencias personales 1
            "referencias_personales" => isset($referencias_personales) ? $referencias_personales : null,
            "fecha_personal1" => $fecha_preferencia1 == '' ? null : $fecha_preferencia1,
            "parenp1" => isset($parenp1) ? $parenp1 : null,
            "telefonop1" => isset($telefonop1) ? $telefonop1 : null,

            //referencias personales 2
            "referencias_personales2" => isset($refe_personal2) ? $refe_personal2 : null,
            "fecha_personal2" => $fecha_preferencia2 == '' ? null :  $fecha_preferencia2,
            "parenp2" => isset($parenp2) ? $parenp2 : null,
            "telefonop2" => isset($telefonop2) ? $telefonop2 : null,

            /* Datos de actividad Proveedor */
            "actividad_econo" => $_POST["actividad_econo"],
            "tributarias" => $_POST["tributarias"],
            "banco" => $_POST["banco"],
            "tipocuenta" => $_POST["tipocuenta"],
            "numerocuenta" => $_POST["numerocuenta"],

            "Actividad_conductor5" => 'Conductor',
            "Actividad_propietario5" => 'Propietario Vehiculo',
            "Actividad_poseedor5" => 'Poseedor Vehiculo',
            "Actividad_propietarioTrailer5" => 'Propietario Trailer',
          ];

          $this->respuesta_poseedores = $this->_modelo->Insertar_proveedores($datos);
          if ($this->respuesta_poseedores['success'] == true) {
            $response = ['numero' => 200, 'mensaje' => $this->respuesta_poseedores['message']];
          } else if ($this->respuesta_poseedores['success'] == false) {
            $response = ['numero' => 400, 'mensaje' => $this->respuesta_poseedores['message']];
          }
          echo json_encode($response);
        }

        /* Funcion para insertar el proveedor solo para internacional */
        if ($Proveedor == "true" && $PropietarioTrailer == "false" && $Propietario == "false" &&  $Conductor == "false" && $Poseedor == "false") {
          $detalle_uno = '';
          $detalle_dos = '';
          if ($_POST["nacional"] == true || $_POST["internacional"] == true) {
            if ($_POST["nacional"] == true) {
              $tipo_proveedor = 1;
            }
            if ($_POST["internacional"] == true) {
              $tipo_proveedor = 2;
            }
          }

          if (isset($_POST["pv_localizacion"])) {
            $localizacion = $_POST["pv_localizacion"];
          }

          if (isset($_POST["pv_zona"])) {
            $zona = $_POST["pv_zona"];
          }

          if (isset($_POST["pv_tiposervice"])) {
            $tiposervicio = $_POST["pv_tiposervice"];
          }

          if ($tiposervicio == 'Transporte') {
            if (isset($_POST["pv_via"])) {
              $detalle_uno = $_POST["pv_via"];
            }
            if (isset($_POST["pv_select"])) {
              $detalle_dos = $_POST["pv_select"];
            }
          }

          if ($tiposervicio == 'Porteadores') {
            if (isset($_POST["detalle_porteador"])) {
              $detalle_uno = $_POST["detalle_porteador"];
              $detalle_dos = '';
            }
          }

          if ($tiposervicio == 'Agenciamiento de carga') {
            if (isset($_POST["detalle_acarga"])) {
              $detalle_uno = $_POST["detalle_acarga"];
              $detalle_dos = '';
            }
          }

          if ($tiposervicio == 'Tramites administrativos') {
            if (isset($_POST["tramite_ad"])) {
              $detalle_uno = $_POST["tramite_ad"];
              $detalle_dos = '';
            }
          }

          if ($tiposervicio == 'Adecuaciones' || $tiposervicio == 'Aduana' || $tiposervicio == 'Impuestos' || $tiposervicio == 'Tramites operativos') {
            $detalle_uno = '';
            $detalle_dos = '';
          }


          $datos = [
            /* Datos Generales del proveedor */
            "tipo_documento" => $_POST['tipo_documento'],
            "numero_documento" => $_POST['numero_documento'],
            "digito_verificacion" =>  $_POST['digito_verificacion'],
            "tipo_identificacion" => $_POST['tipo_identificacion'],
            "rndc_nombre2" => $_POST['rndc_nombre'],
            "apellido1" =>  $apellido1,
            "apellido2" => $apellido2,
            "abreviatura" => $_POST['abreviatura'],
            "contacto" => $_POST['contacto'],
            "celular" => $_POST['celular'],
            "direccion" => $_POST['direccion'],
            "email" => $_POST['email'],
            "municipio" => $_POST['municipio'],
            "estado" => $_POST['estado'],

            /* DETALLES DEL PROVEEDOR */
            "tipo_proveedor" => $tipo_proveedor,
            "localizacion" => $localizacion,
            "zona" => $zona,
            "tiposervicio" => $tiposervicio,
            "detalle_uno" => $detalle_uno,
            "detalle_dos" => $detalle_dos,
            "Actividad_Proveedor" => "Proveedor",

          ];
          // var_dump($datos);
          // exit(0);
          $this->respuesta_proveedor_internacional = $this->_modelo->Insertar_Proveedor_Internacional($datos);
          if ($this->respuesta_proveedor_internacional == true) {
            $response = ['numero' => 200, 'mensaje' => 'Se Registro Datos Exitosamente NEXOSAPP.'];
            $this->guardar_proveedor = $response;
            // echo json_encode($this->guardar_proveedor);
          } else if ($this->respuesta_proveedor_internacional == false) {
            $response = ['numero' => 400, 'mensaje' => 'Error No se creo el Tercero en NEXOSAPP.'];
            $this->guardar_proveedor = $response;
          }
          echo json_encode($this->guardar_proveedor);
        }
      }
    }
  }

  // crear_conctacto_internacional
  function Crear_Contacto()
  {
    $verifica = $_POST["verifica"];
    if ($verifica == 2) {
      $fecha_actual = date('Y-m-d');
      $hora_actual = date('H:i:s');
      $user = $_SESSION["usuario"]["nom_usuario"];
      //contactos
      if (isset($_POST["nombre"])) {
        $nombre = $_POST["nombre"];
      } else {
        $nombre = '';
      }
      if (isset($_POST["cargo"])) {
        $cargo = $_POST["cargo"];
      } else {
        $cargo = '';
      }
      if (isset($_POST["fijo"])) {
        $fijo = $_POST["fijo"];
      } else {
        $fijo = '';
      }
      if (isset($_POST["celular"])) {
        $celular = $_POST["celular"];
      } else {
        $celular = '';
      }
      if (isset($_POST["correo"])) {
        $correo = $_POST["correo"];
      } else {
        $correo = '';
      }
      if (isset($_POST["critica"])) {
        $critica = $_POST["critica"];
      } else {
        $critica = '';
      }
      if (isset($_POST["refe"])) {
        $refe = $_POST["refe"];
      } else {
        $refe = '';
      }

      $datos = [
        "fecha_actual" => $fecha_actual,
        "hora_actual" => $hora_actual,
        "user" => $user,
        "nombre" => $nombre,
        "cargo" => $cargo,
        "fijo" => $fijo,
        "celular" => $celular,
        "correo" => $correo,
        "critica" => $critica,
        "refe" => $refe,
      ];

      $this->crear_conctacto_internacional = $this->_modelo->Crear_Contactos($datos);
      echo json_encode($this->crear_conctacto_internacional);
    }
  }

  public function Consultar_Datos()
  {
    $dato = $_POST["dato"];
    $proveedor = $_POST["proveedor"];
    $this->consultar_datos = $this->_modelo->Cosultar_datos_prefiltro($dato, $proveedor);
    echo json_encode($this->consultar_datos);
  }

  /* Actualizar proveedor */
  public function consultar_actividad_proveedor()
  {
    $proveedor = $_POST["id_proveedor"];
    $this->consultar_activdad = $this->_modelo->Cosultar_Actividad_proveedor($proveedor);
    echo json_encode($this->consultar_activdad);
  }

  public function Consultar_datos_proveedor()
  {
    $proveedor = $_POST["id_proveedor"];
    $this->consultar_datos_proveedor = $this->_modelo->Cosultar_Datos_proveedor($proveedor);
    echo json_encode($this->consultar_datos_proveedor);
  }

  public function Cargar_municipios()
  {
    $this->cargar_municipios = $this->_modelo->Cargar_Municipios();
    echo json_encode($this->cargar_municipios);
  }

  public function obtenerdatosmunicipio()
  {
    $municipio = $_POST["municipio"];
    $this->obtener_municipio = $this->_modelo->Obetener_Municipios($municipio);
    echo json_encode($this->obtener_municipio);
  }

  public function Actualizar_proveedor()
  {

    $Conductor = $_POST["Conductor"];
    $Poseedor = $_POST["poseedor_vehiculo"];
    $Propietario = $_POST["propietario_vehiculo"];
    $Proveedor = $_POST["Proveedor"];
    $numdoc_proveedor = $_POST["numdoc_proveedor"];
    // Validar los tipos de actividades acrtivas para actualizar

    /* Validar apellidos  apellidos */
    if ($_POST["tipo_documento"] != 'NIT' || $_POST["tipo_documento"] != 'Identificacion Tributaria Internacional') {
      $apellido1 = isset($_POST["1apellido"]) ? $_POST["1apellido"] : null;
      $apellido2 =  isset($_POST["2apellido"]) ?  $_POST["2apellido"] : null;
    } else {
      $apellido1 = '';
      $apellido2 = '';
    }

    if ($Propietario == "true" &&  $Conductor == "true" && $Poseedor == "true") {
      $ultimo_eps = null;;
      $nombre_arl = '';
      $fecha_vencimiento_arl = null;
      $ultimo_arl = null;
      $civil = null;
      $response = [];

      $referencias_empresariales = $_POST["referencias_empresariales1"];
      $fecha_ereferencia1 = $_POST["fecha_referencia1"];
      $fecha_retiro1 = $_POST["fecha_retiro1"];
      $contacto_ref1 = $_POST["contacto_ref1"];
      $celular_ref1 = $_POST["celular_ref1"];
      $cargo_ref1 = $_POST["cargo_ref1"];
      $anti_ref1 = $_POST["anti_ref1"];

      $referencia_empresarial2 = $_POST["referencias_empresariales2"];
      $fecha_ereferencia2 = $_POST["fecha_referencia2"];
      $fecha_retiro2 = $_POST["fecha_retiro2"];
      $contacto_ref2 = $_POST["contacto_ref2"];
      $celular_ref2 = $_POST["celular_ref2"];
      $cargo_ref2 = $_POST["cargo_ref2"];
      $anti_ref2 = $_POST["anti_ref2"];

      $referencias_empresariales3 = $_POST["referencias_empresariales3"];
      $fecha_referencia3 = $_POST["fecha_referencia3"];
      $fecha_retiro3 = $_POST["fecha_retiro3"];
      $contacto_ref3 = $_POST["contacto_ref3"];
      $celular_ref3 = $_POST["celular_ref3"];
      $cargo_ref3 = $_POST["cargo_ref3"];
      $anti_ref3 = $_POST["anti_ref3"];

      $referencias_personales = $_POST["referencias_personales"];
      $fecha_preferencia1 = $_POST["fecha_personal1"] ? $_POST["fecha_personal1"] : null;
      $parenp1 = $_POST["parenp1"];
      $telefonop1 = $_POST["telefonop1"];

      $refe_personal2 = $_POST["referencias_personales2"];
      $fecha_preferencia2 = $_POST["fecha_personal2"] ? $_POST["fecha_personal2"] : null;
      $parenp2 = $_POST["parenp2"];
      $telefonop2 = $_POST["telefonop2"];

      //NOMBRES DE LOS DOCUMENTOS
      if (isset($_POST["namedocu_eps"])) {
        $namedocu_eps = $_POST["namedocu_eps"];
      } else {
        $namedocu_eps = '';
      }
      $namedocu_arl = '';

      if (isset($_POST["namedocu_curso"])) {
        $namedocu_curso = $_POST["namedocu_curso"];
      } else {
        $namedocu_curso = '';
      }

      if (isset($_POST["name_docurut"])) {
        $name_docurut = $_POST["name_docurut"];
      } else {
        $name_docurut = '';
      }

      if (isset($_POST["name_doculice"])) {
        $name_doculice = $_POST["name_doculice"];
      } else {
        $name_doculice = '';
      }

      //nombre de las fotos del conductor
      if (isset($_POST["name_fontall"])) {
        $name_fontal = $_POST["name_fontall"];
      } else {
        $name_fontal = '';
      }

      if (isset($_POST["name_derecha"])) {
        $name_derecha = $_POST["name_derecha"];
      } else {
        $name_derecha = '';
      }

      if (isset($_POST["name_izquierda"])) {
        $name_izquierda = $_POST["name_izquierda"];
      } else {
        $name_izquierda = '';
      }

      if (isset($_POST["name_indum"])) {
        $name_indu = $_POST["name_indum"];
      } else {
        $name_indu = '';
      }
      //nombre de acuerdos
      if (isset($_POST["name_a1"])) {
        $name_a1 = $_POST["name_a1"];
      } else {
        $name_a1 = '';
      }

      /* Array de datos para hacer la insersion */
      $datos = [
        /* Datos Generales del proveedor */
        "tipo_documento" => $_POST['tipo_documento'],
        "numero_documento" => $_POST['numero_documento'],
        "digito_verificacion" =>  $_POST['digito_verificacion'],
        "tipo_identificacion" => $_POST['tipo_identificacion'],
        "rndc_nombre2" => $_POST['rndc_nombre'],
        "apellido1" =>  $apellido1,
        "apellido2" => $apellido2,
        "abreviatura" => $_POST['abreviatura'],
        "contacto" => $_POST['contacto'],
        "celular" => $_POST['celular'],
        "direccion" => $_POST['direccion'],
        "email" => $_POST['email'],
        "municipio" => $_POST['municipio'],

        /* Datos del conductor especificos */
        "rndc_categoria_licencia" => isset($_POST["categoria_licencia"]) ? $_POST["categoria_licencia"] : null,
        "rndc_numero_licencia" => isset($_POST["numero_licencia"]) ? $_POST["numero_licencia"] : null,
        "rndc_vencimiento_licencia" => isset($_POST["vencimiento_licencia"]) ? $_POST["vencimiento_licencia"] : null,
        "estado" => $_POST['estado'],
        "documentos" => isset($_FILES['documentos']) ? $_FILES['documentos'] : null,
        "celular2" => isset($_POST['celular2']) ? $_POST['celular2'] : null,
        "nombre_eps" => isset($_POST['name_eps']) ? $_POST['name_eps'] : null,
        "fecha_vencimiento" => $_POST["vence_eps"] == '' ? null : $_POST["vence_eps"],
        "ultimo_eps" => isset($ultimo_eps) ? $ultimo_eps : null,
        "nombre_arl" => isset($nombre_arl) ? $nombre_arl : null,
        "fecha_vencimiento_arl" => $fecha_vencimiento_arl == '' ? null : $fecha_vencimiento_arl,
        "ultimo_arl" => isset($ultimo_arl) ? $ultimo_arl : null,
        "nombre_entidad" => isset($_POST["nom_enti"]) ? $_POST["nom_enti"] : null,
        "vence_curso" => $_POST["vence_curso"] == '' ? null : $_POST["vence_curso"],
        "vence_eps" => $_POST["vence_eps"] == '' ? null : $_POST["vence_eps"],
        "sexo" => $_POST['sexo'],
        "fecha_nace" => $_POST["fecha_nacimiento"] == '' ? null : $_POST["fecha_nacimiento"],
        "sangre" => isset($_POST["sangre"]) ? $_POST["sangre"] : null,
        "civil" => isset($civil) ? $civil : null,
        "fecha_ingreso" => $_POST["fecha_ingreso"] == '' ? null : $_POST["fecha_ingreso"],

        // Insertar referencias 

        /*Referencia personal 1*/
        "referencias_empresariales1" => isset($referencias_empresariales) ? $referencias_empresariales : null,
        "fecha_referencia1" => empty($fecha_ereferencia1) ? null : $fecha_ereferencia1,
        "fecha_retiro1" => empty($fecha_retiro1) ? null : $fecha_retiro1,
        "contacto_ref1" => isset($contacto_ref1) ? $contacto_ref1 : null,
        "celular_ref1" => isset($celular_ref1) ? $celular_ref1 : null,
        "cargo_ref1" => isset($cargo_ref1) ? $cargo_ref1 : null,
        "anti_ref1" => isset($anti_ref1) ? $anti_ref1 : null,
        "idp1" => isset($_POST['idp1']) ? $_POST['idp1'] : null,
        /* Fin primera referencia 1*/

        /*Referencia personal 2*/
        "referencias_empresariales2" => isset($referencia_empresarial2) ? $referencia_empresarial2 : null,
        "fecha_referencia2" => empty($fecha_ereferencia2) ? null : $fecha_ereferencia2,
        "fecha_retiro2" => empty($fecha_retiro2) ? null : $fecha_retiro2,
        "contacto_ref2" => isset($contacto_ref2) ? $contacto_ref2 : null,
        "celular_ref2" => isset($celular_ref2) ? $celular_ref2 : null,
        "cargo_ref2" => isset($cargo_ref2) ? $cargo_ref2 : null,
        "anti_ref2" => isset($anti_ref2) ? $anti_ref2 : null,
        "idp2" => isset($_POST['idp2']) ? $_POST['idp2'] : null,
        /* Fin primera referencia 2*/

        /*Referencia personal 3*/
        "referencias_empresariales3" => isset($referencias_empresariales3) ? $referencias_empresariales3 : null,
        "fecha_referencia3" => empty($fecha_referencia3) ? null : $fecha_referencia3,
        "fecha_retiro3" => empty($fecha_retiro3) ? null : $fecha_retiro3,
        "contacto_ref3" => isset($contacto_ref3) ? $contacto_ref3 : null,
        "celular_ref3" => isset($celular_ref3) ? $celular_ref3 : null,
        "cargo_ref3" => isset($cargo_ref3) ? $cargo_ref3 : null,
        "anti_ref3" => isset($anti_ref3) ? $anti_ref3 : null,
        "idp3" => isset($_POST['idp3']) ? $_POST['idp3'] : null,
        /* Fin primera referencia 3*/

        // Documentos
        "licencia" => isset($_FILES['licencia']) ? $_FILES['licencia'] : null,
        "docu_eps" => isset($_FILES['docu_eps']) ? $_FILES['docu_eps'] : null,
        "foto_conductor" => isset($_FILES['foto_conductor']) ? $_FILES['foto_conductor'] : null,
        "foto_derecha" => isset($_FILES['foto_derecha']) ? $_FILES['foto_derecha'] : null,
        "foto_izquierda" => isset($_FILES['foto_izquierda']) ? $_FILES['foto_izquierda'] : null,
        "foto_indume" => isset($_FILES['foto_indume']) ? $_FILES['foto_indume'] : null,
        "docu_curso" => isset($_FILES['docu_curso']) ? $_FILES['docu_curso'] : null,
        "rut" => isset($_FILES['rut']) ? $_FILES['rut'] : null,
        "acuerdo_uno" => isset($_FILES['acuerdo_uno']) ? $_FILES['acuerdo_uno'] : null,

        //Nombre de los documentos
        "namedocu_eps" => isset($namedocu_eps) ? $namedocu_eps : null,
        "namedocu_curso" => isset($namedocu_curso) ? $namedocu_curso : null,
        "name_docurut" => isset($name_docurut) ? $name_docurut : null,
        "name_doculice" => isset($name_doculice) ? $name_doculice : null,
        "name_fontall" => isset($name_fontal) ? $name_fontal : null,
        "name_derecha" => isset($name_derecha) ? $name_derecha : null,
        "name_izquierda" => isset($name_izquierda) ? $name_izquierda : null,
        "name_indum" => isset($name_indu) ? $name_indu : null,
        "name_a1" => isset($name_a1) ? $name_a1 : null,

        //referencias personales 1
        "referencias_personales" => isset($referencias_personales) ? $referencias_personales : null,
        "fecha_personal1" => $fecha_preferencia1 == '' ? null : $fecha_preferencia1,
        "parenp1" => isset($parenp1) ? $parenp1 : null,
        "telefonop1" => isset($telefonop1) ? $telefonop1 : null,
        "ref_id1" => isset($_POST['ref_id1']) ? $_POST['ref_id1'] : null,

        //referencias personales 2
        "referencias_personales2" => isset($refe_personal2) ? $refe_personal2 : null,
        "fecha_personal2" => $fecha_preferencia2 == '' ? null : $fecha_preferencia2,
        "parenp2" => isset($parenp2) ? $parenp2 : null,
        "telefonop2" => isset($telefonop2) ? $telefonop2 : null,
        "ref_id2" => isset($_POST['ref_id2']) ? $_POST['ref_id2'] : null,
        /* Numero del proveedor */
        "numdoc_proveedor" => isset($numdoc_proveedor) ? $numdoc_proveedor : null,
      ];

      // Procesar las respuestas del modelo.
      $this->actualizar_proveedor = $this->_modelo->Actualizar_proveedor($datos);
      if ($this->actualizar_proveedor['success'] == true) {
        $response = ['numero' => 200, 'mensaje' => $this->actualizar_proveedor['message']];
      } else if ($this->actualizar_proveedor['success'] == false) {
        $response = ['numero' => 400, 'mensaje' => $this->actualizar_proveedor['message']];
      }
      echo json_encode($response);
    }

    if ($Conductor == "true" &&  $Poseedor == "false" && $Propietario == "false") {
      // $ultimo_eps = null;;
      $ultimo_eps = null;
      $nombre_arl = '';
      $fecha_vencimiento_arl = null;
      $ultimo_arl = null;
      $civil = null;
      $response = [];

      $referencias_empresariales = $_POST["referencias_empresariales1"];
      $fecha_ereferencia1 = $_POST["fecha_referencia1"];
      $fecha_retiro1 = $_POST["fecha_retiro1"];
      $contacto_ref1 = $_POST["contacto_ref1"];
      $celular_ref1 = $_POST["celular_ref1"];
      $cargo_ref1 = $_POST["cargo_ref1"];
      $anti_ref1 = $_POST["anti_ref1"];

      $referencia_empresarial2 = $_POST["referencias_empresariales2"];
      $fecha_ereferencia2 = $_POST["fecha_referencia2"];
      $fecha_retiro2 = $_POST["fecha_retiro2"];
      $contacto_ref2 = $_POST["contacto_ref2"];
      $celular_ref2 = $_POST["celular_ref2"];
      $cargo_ref2 = $_POST["cargo_ref2"];
      $anti_ref2 = $_POST["anti_ref2"];

      $referencias_empresariales3 = $_POST["referencias_empresariales3"];
      $fecha_referencia3 = $_POST["fecha_referencia3"];
      $fecha_retiro3 = $_POST["fecha_retiro3"];
      $contacto_ref3 = $_POST["contacto_ref3"];
      $celular_ref3 = $_POST["celular_ref3"];
      $cargo_ref3 = $_POST["cargo_ref3"];
      $anti_ref3 = $_POST["anti_ref3"];

      $referencias_personales = $_POST["referencias_personales"];
      $fecha_preferencia1 = $_POST["fecha_personal1"] ? $_POST["fecha_personal1"] : null;
      $parenp1 = $_POST["parenp1"];
      $telefonop1 = $_POST["telefonop1"];

      $refe_personal2 = $_POST["referencias_personales2"];
      $fecha_preferencia2 = $_POST["fecha_personal2"] ? $_POST["fecha_personal2"] : null;
      $parenp2 = $_POST["parenp2"];
      $telefonop2 = $_POST["telefonop2"];

      //NOMBRES DE LOS DOCUMENTOS
      if (isset($_POST["namedocu_eps"])) {
        $namedocu_eps = $_POST["namedocu_eps"];
      } else {
        $namedocu_eps = '';
      }
      $namedocu_arl = '';

      if (isset($_POST["namedocu_curso"])) {
        $namedocu_curso = $_POST["namedocu_curso"];
      } else {
        $namedocu_curso = '';
      }

      if (isset($_POST["name_docurut"])) {
        $name_docurut = $_POST["name_docurut"];
      } else {
        $name_docurut = '';
      }

      if (isset($_POST["name_doculice"])) {
        $name_doculice = $_POST["name_doculice"];
      } else {
        $name_doculice = '';
      }

      //nombre de las fotos del conductor
      if (isset($_POST["name_fontall"])) {
        $name_fontal = $_POST["name_fontall"];
      } else {
        $name_fontal = '';
      }

      if (isset($_POST["name_derecha"])) {
        $name_derecha = $_POST["name_derecha"];
      } else {
        $name_derecha = '';
      }

      if (isset($_POST["name_izquierda"])) {
        $name_izquierda = $_POST["name_izquierda"];
      } else {
        $name_izquierda = '';
      }

      if (isset($_POST["name_indum"])) {
        $name_indu = $_POST["name_indum"];
      } else {
        $name_indu = '';
      }
      //nombre de acuerdos
      if (isset($_POST["name_a1"])) {
        $name_a1 = $_POST["name_a1"];
      } else {
        $name_a1 = '';
      }
      $fecha_ingreso = $_POST["fecha_ingreso"];

      // Validar el formato de la fecha (YYYY-MM-DD)
      if ($fecha_ingreso !== null && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha_ingreso)) {
        $fecha_ingreso = null; // O manejar el error de formato de fecha
      }

      // Si la fecha es '0000-00-00', establece a null
      if ($fecha_ingreso === '0000-00-00') {
        $fecha_ingreso = null;
      }

      /* Array de datos para hacer la insersion */
      $datos = [
        /* Datos Generales del proveedor */
        "tipo_documento" => $_POST['tipo_documento'],
        "numero_documento" => $_POST['numero_documento'],
        "digito_verificacion" =>  $_POST['digito_verificacion'],
        "tipo_identificacion" => $_POST['tipo_identificacion'],
        "rndc_nombre2" => $_POST['rndc_nombre'],
        "apellido1" =>  $apellido1,
        "apellido2" => $apellido2,
        "abreviatura" => $_POST['abreviatura'],
        "contacto" => $_POST['contacto'],
        "celular" => $_POST['celular'],
        "direccion" => $_POST['direccion'],
        "email" => $_POST['email'],
        "municipio" => $_POST['municipio'],

        /* Datos del conductor especificos */
        "rndc_categoria_licencia" => isset($_POST["categoria_licencia"]) ? $_POST["categoria_licencia"] : null,
        "rndc_numero_licencia" => isset($_POST["numero_licencia"]) ? $_POST["numero_licencia"] : null,
        "rndc_vencimiento_licencia" => isset($_POST["vencimiento_licencia"]) ? $_POST["vencimiento_licencia"] : null,
        "estado" => $_POST['estado'],
        "documentos" => isset($_FILES['documentos']) ? $_FILES['documentos'] : null,
        "celular2" => isset($_POST['celular2']) ? $_POST['celular2'] : null,
        "nombre_eps" => isset($_POST['name_eps']) ? $_POST['name_eps'] : null,
        "fecha_vencimiento" => $_POST["vence_eps"] == '' ? null : $_POST["vence_eps"],
        "ultimo_eps" => isset($ultimo_eps) ? $ultimo_eps : null,
        "nombre_arl" => isset($nombre_arl) ? $nombre_arl : null,
        "fecha_vencimiento_arl" => $fecha_vencimiento_arl == '' ? null : $fecha_vencimiento_arl,
        "ultimo_arl" => isset($ultimo_arl) ? $ultimo_arl : null,
        "nombre_entidad" => isset($_POST["nom_enti"]) ? $_POST["nom_enti"] : null,
        "vence_curso" => $_POST["vence_curso"] == '' ? null : $_POST["vence_curso"],
        "vence_eps" => $_POST["vence_eps"] == '' ? null :  $_POST["vence_eps"],
        "sexo" => $_POST['sexo'],
        "fecha_nace" => $_POST["fecha_nacimiento"] == '' ? null : $_POST["fecha_nacimiento"],
        "sangre" => isset($_POST["sangre"]) ? $_POST["sangre"] : null,
        "civil" => isset($civil) ? $civil : null,
        // "fecha_ingreso" => isset($_POST["fecha_ingreso"]) ? $_POST["fecha_ingreso"] : null,
        "fecha_ingreso" => $fecha_ingreso,

        // Insertar referencias 

        /*Referencia personal 1*/
        "referencias_empresariales1" => isset($referencias_empresariales) ? $referencias_empresariales : null,
        "fecha_referencia1" => empty($fecha_ereferencia1) ? null : $fecha_ereferencia1,
        "fecha_retiro1" => empty($fecha_retiro1) ? null : $fecha_retiro1,
        "contacto_ref1" => isset($contacto_ref1) ? $contacto_ref1 : null,
        "celular_ref1" => isset($celular_ref1) ? $celular_ref1 : null,
        "cargo_ref1" => isset($cargo_ref1) ? $cargo_ref1 : null,
        "anti_ref1" => isset($anti_ref1) ? $anti_ref1 : null,
        "idp1" => isset($_POST['idp1']) ? $_POST['idp1'] : null,
        /* Fin primera referencia 1*/

        /*Referencia personal 2*/
        "referencias_empresariales2" => isset($referencia_empresarial2) ? $referencia_empresarial2 : null,
        "fecha_referencia2" => empty($fecha_ereferencia2) ? null : $fecha_ereferencia2,
        "fecha_retiro2" => empty($fecha_retiro2) ? null : $fecha_retiro2,
        "contacto_ref2" => isset($contacto_ref2) ? $contacto_ref2 : null,
        "celular_ref2" => isset($celular_ref2) ? $celular_ref2 : null,
        "cargo_ref2" => isset($cargo_ref2) ? $cargo_ref2 : null,
        "anti_ref2" => isset($anti_ref2) ? $anti_ref2 : null,
        "idp2" => isset($_POST['idp2']) ? $_POST['idp2'] : null,
        /* Fin primera referencia 2*/

        /*Referencia personal 3*/
        "referencias_empresariales3" => isset($referencias_empresariales3) ? $referencias_empresariales3 : null,
        "fecha_referencia3" => empty($fecha_referencia3) ? null : $fecha_referencia3,
        "fecha_retiro3" => empty($fecha_retiro3) ? null : $fecha_retiro3,
        "contacto_ref3" => isset($contacto_ref3) ? $contacto_ref3 : null,
        "celular_ref3" => isset($celular_ref3) ? $celular_ref3 : null,
        "cargo_ref3" => isset($cargo_ref3) ? $cargo_ref3 : null,
        "anti_ref3" => isset($anti_ref3) ? $anti_ref3 : null,
        "idp3" => isset($_POST['idp3']) ? $_POST['idp3'] : null,
        /* Fin primera referencia 3*/

        // Documentos
        "licencia" => isset($_FILES['licencia']) ? $_FILES['licencia'] : null,
        "docu_eps" => isset($_FILES['docu_eps']) ? $_FILES['docu_eps'] : null,
        "foto_conductor" => isset($_FILES['foto_conductor']) ? $_FILES['foto_conductor'] : null,
        "foto_derecha" => isset($_FILES['foto_derecha']) ? $_FILES['foto_derecha'] : null,
        "foto_izquierda" => isset($_FILES['foto_izquierda']) ? $_FILES['foto_izquierda'] : null,
        "foto_indume" => isset($_FILES['foto_indume']) ? $_FILES['foto_indume'] : null,
        "docu_curso" => isset($_FILES['docu_curso']) ? $_FILES['docu_curso'] : null,
        "rut" => isset($_FILES['rut']) ? $_FILES['rut'] : null,
        "acuerdo_uno" => isset($_FILES['acuerdo_uno']) ? $_FILES['acuerdo_uno'] : null,

        //Nombre de los documentos
        "namedocu_eps" => isset($namedocu_eps) ? $namedocu_eps : null,
        "namedocu_curso" => isset($namedocu_curso) ? $namedocu_curso : null,
        "name_docurut" => isset($name_docurut) ? $name_docurut : null,
        "name_doculice" => isset($name_doculice) ? $name_doculice : null,
        "name_fontall" => isset($name_fontal) ? $name_fontal : null,
        "name_derecha" => isset($name_derecha) ? $name_derecha : null,
        "name_izquierda" => isset($name_izquierda) ? $name_izquierda : null,
        "name_indum" => isset($name_indu) ? $name_indu : null,
        "name_a1" => isset($name_a1) ? $name_a1 : null,

        //referencias personales 1
        "referencias_personales" => isset($referencias_personales) ? $referencias_personales : null,
        "fecha_personal1" => $fecha_preferencia1 == '' ? null : $fecha_preferencia1,
        "parenp1" => isset($parenp1) ? $parenp1 : null,
        "telefonop1" => isset($telefonop1) ? $telefonop1 : null,
        "ref_id1" => isset($_POST['ref_id1']) ? $_POST['ref_id1'] : null,

        //referencias personales 2
        "referencias_personales2" => isset($refe_personal2) ? $refe_personal2 : null,
        "fecha_personal2" => $fecha_preferencia2 == '' ? null :  $fecha_preferencia2,
        "parenp2" => isset($parenp2) ? $parenp2 : null,
        "telefonop2" => isset($telefonop2) ? $telefonop2 : null,
        "ref_id2" => isset($_POST['ref_id2']) ? $_POST['ref_id2'] : null,
        /* Numero del proveedor */
        "numdoc_proveedor" => isset($numdoc_proveedor) ? $numdoc_proveedor : null,
      ];

      // Procesar las respuestas del modelo.
      $this->actualizar_proveedor = $this->_modelo->Actualizar_proveedor_conductor($datos);
      if ($this->actualizar_proveedor['success'] == true) {
        $response = ['numero' => 200, 'mensaje' => $this->actualizar_proveedor['message']];
      } else if ($this->actualizar_proveedor['success'] == false) {
        $response = ['numero' => 400, 'mensaje' => $this->actualizar_proveedor['message']];
      }
      echo json_encode($response);
    }

    if ($Propietario == "true" &&  $Poseedor == "false" && $Conductor == "false") {
      $datos = [
        /* Datos Generales del proveedor */
        "tipo_documento" => $_POST['tipo_documento'],
        "numero_documento" => $_POST['numero_documento'],
        "digito_verificacion" =>  $_POST['digito_verificacion'],
        "tipo_identificacion" => $_POST['tipo_identificacion'],
        "rndc_nombre2" => $_POST['rndc_nombre'],
        "apellido1" =>  $apellido1,
        "apellido2" => $apellido2,
        "abreviatura" => $_POST['abreviatura'],
        "contacto" => $_POST['contacto'],
        "celular" => $_POST['celular'],
        "direccion" => $_POST['direccion'],
        "email" => $_POST['email'],
        "municipio" => $_POST['municipio'],
        /* Numero del proveedor */
        "numdoc_proveedor" => isset($numdoc_proveedor) ? $numdoc_proveedor : null,
      ];
      $this->actualizar_propietario = $this->_modelo->Actualizar_Proveedor_actividades($datos);
      if ($this->actualizar_propietario == true) {
        $response = ['numero' => 200, 'mensaje' => 'Se Actualizo Datos Exitosamente NEXOSAPP.'];
        $this->actualizar_propietario = $response;
      } else if ($this->actualizar_propietario == false) {
        $response = ['numero' => 400, 'mensaje' => 'Error No se creo el Tercero en NEXOSAPP.'];
        $this->actualizar_propietario = $response;
      }
      echo json_encode($this->actualizar_propietario);
    }

    if ($Poseedor == "true" &&  $Propietario == "false" && $Conductor == "false") {
      $datos = [
        /* Datos Generales del proveedor */
        "tipo_documento" => $_POST['tipo_documento'],
        "numero_documento" => $_POST['numero_documento'],
        "digito_verificacion" =>  $_POST['digito_verificacion'],
        "tipo_identificacion" => $_POST['tipo_identificacion'],
        "rndc_nombre2" => $_POST['rndc_nombre'],
        "apellido1" =>  $apellido1,
        "apellido2" => $apellido2,
        "abreviatura" => $_POST['abreviatura'],
        "contacto" => $_POST['contacto'],
        "celular" => $_POST['celular'],
        "direccion" => $_POST['direccion'],
        "email" => $_POST['email'],
        "municipio" => $_POST['municipio'],
        /* Numero del proveedor */
        "numdoc_proveedor" => isset($numdoc_proveedor) ? $numdoc_proveedor : null,
      ];
      $this->actualizar_propietario = $this->_modelo->Actualizar_Proveedor_actividades($datos);
      if ($this->actualizar_propietario == true) {
        $response = ['numero' => 200, 'mensaje' => 'Se Actualizo Datos Exitosamente NEXOSAPP.'];
        $this->actualizar_propietario = $response;
      } else if ($this->actualizar_propietario == false) {
        $response = ['numero' => 400, 'mensaje' => 'Error No se creo el Tercero en NEXOSAPP.'];
        $this->actualizar_propietario = $response;
      }
      echo json_encode($this->actualizar_propietario);
    }

    if ($Poseedor == "true" &&  $Propietario == "true" && $Conductor == "false") {
      $datos = [
        /* Datos Generales del proveedor */
        "tipo_documento" => $_POST['tipo_documento'],
        "numero_documento" => $_POST['numero_documento'],
        "digito_verificacion" =>  $_POST['digito_verificacion'],
        "tipo_identificacion" => $_POST['tipo_identificacion'],
        "rndc_nombre2" => $_POST['rndc_nombre'],
        "apellido1" =>  $apellido1,
        "apellido2" => $apellido2,
        "abreviatura" => $_POST['abreviatura'],
        "contacto" => $_POST['contacto'],
        "celular" => $_POST['celular'],
        "direccion" => $_POST['direccion'],
        "email" => $_POST['email'],
        "municipio" => $_POST['municipio'],
        "sexo" => $_POST['sexo'],
        /* Numero del proveedor */
        "numdoc_proveedor" => isset($numdoc_proveedor) ? $numdoc_proveedor : null,
      ];
      $this->actualizar_propietario = $this->_modelo->Actualizar_Proveedor_actividades($datos);
      if ($this->actualizar_propietario == true) {
        $response = ['numero' => 200, 'mensaje' => 'Se Actualizo Datos Exitosamente NEXOSAPP.'];
        $this->actualizar_propietario = $response;
      } else if ($this->actualizar_propietario == false) {
        $response = ['numero' => 400, 'mensaje' => 'Error No se creo el Tercero en NEXOSAPP.'];
        $this->actualizar_propietario = $response;
      }
      echo json_encode($this->actualizar_propietario);
    }

    if ($Poseedor == "true" &&  $Conductor == "true" && $Propietario == "false") {
      // $ultimo_eps = null;;
      $ultimo_eps = null;
      $nombre_arl = '';
      $fecha_vencimiento_arl = null;
      $ultimo_arl = null;
      $civil = null;
      $response = [];

      $referencias_empresariales = $_POST["referencias_empresariales1"];
      $fecha_ereferencia1 = $_POST["fecha_referencia1"];
      $fecha_retiro1 = $_POST["fecha_retiro1"];
      $contacto_ref1 = $_POST["contacto_ref1"];
      $celular_ref1 = $_POST["celular_ref1"];
      $cargo_ref1 = $_POST["cargo_ref1"];
      $anti_ref1 = $_POST["anti_ref1"];

      $referencia_empresarial2 = $_POST["referencias_empresariales2"];
      $fecha_ereferencia2 = $_POST["fecha_referencia2"];
      $fecha_retiro2 = $_POST["fecha_retiro2"];
      $contacto_ref2 = $_POST["contacto_ref2"];
      $celular_ref2 = $_POST["celular_ref2"];
      $cargo_ref2 = $_POST["cargo_ref2"];
      $anti_ref2 = $_POST["anti_ref2"];

      $referencias_empresariales3 = $_POST["referencias_empresariales3"];
      $fecha_referencia3 = $_POST["fecha_referencia3"];
      $fecha_retiro3 = $_POST["fecha_retiro3"];
      $contacto_ref3 = $_POST["contacto_ref3"];
      $celular_ref3 = $_POST["celular_ref3"];
      $cargo_ref3 = $_POST["cargo_ref3"];
      $anti_ref3 = $_POST["anti_ref3"];

      $referencias_personales = $_POST["referencias_personales"];
      $fecha_preferencia1 = $_POST["fecha_personal1"] ? $_POST["fecha_personal1"] : null;
      $parenp1 = $_POST["parenp1"];
      $telefonop1 = $_POST["telefonop1"];

      $refe_personal2 = $_POST["referencias_personales2"];
      $fecha_preferencia2 = $_POST["fecha_personal2"] ? $_POST["fecha_personal2"] : null;
      $parenp2 = $_POST["parenp2"];
      $telefonop2 = $_POST["telefonop2"];

      //NOMBRES DE LOS DOCUMENTOS
      if (isset($_POST["namedocu_eps"])) {
        $namedocu_eps = $_POST["namedocu_eps"];
      } else {
        $namedocu_eps = '';
      }
      $namedocu_arl = '';

      if (isset($_POST["namedocu_curso"])) {
        $namedocu_curso = $_POST["namedocu_curso"];
      } else {
        $namedocu_curso = '';
      }

      if (isset($_POST["name_docurut"])) {
        $name_docurut = $_POST["name_docurut"];
      } else {
        $name_docurut = '';
      }

      if (isset($_POST["name_doculice"])) {
        $name_doculice = $_POST["name_doculice"];
      } else {
        $name_doculice = '';
      }

      //nombre de las fotos del conductor
      if (isset($_POST["name_fontall"])) {
        $name_fontal = $_POST["name_fontall"];
      } else {
        $name_fontal = '';
      }

      if (isset($_POST["name_derecha"])) {
        $name_derecha = $_POST["name_derecha"];
      } else {
        $name_derecha = '';
      }

      if (isset($_POST["name_izquierda"])) {
        $name_izquierda = $_POST["name_izquierda"];
      } else {
        $name_izquierda = '';
      }

      if (isset($_POST["name_indum"])) {
        $name_indu = $_POST["name_indum"];
      } else {
        $name_indu = '';
      }
      //nombre de acuerdos
      if (isset($_POST["name_a1"])) {
        $name_a1 = $_POST["name_a1"];
      } else {
        $name_a1 = '';
      }

      /* Array de datos para hacer la insersion */
      $datos = [
        /* Datos Generales del proveedor */
        "tipo_documento" => $_POST['tipo_documento'],
        "numero_documento" => $_POST['numero_documento'],
        "digito_verificacion" =>  $_POST['digito_verificacion'],
        "tipo_identificacion" => $_POST['tipo_identificacion'],
        "rndc_nombre2" => $_POST['rndc_nombre'],
        "apellido1" =>  $apellido1,
        "apellido2" => $apellido2,
        "abreviatura" => $_POST['abreviatura'],
        "contacto" => $_POST['contacto'],
        "celular" => $_POST['celular'],
        "direccion" => $_POST['direccion'],
        "email" => $_POST['email'],
        "municipio" => $_POST['municipio'],

        /* Datos del conductor especificos */
        "rndc_categoria_licencia" => isset($_POST["categoria_licencia"]) ? $_POST["categoria_licencia"] : null,
        "rndc_numero_licencia" => isset($_POST["numero_licencia"]) ? $_POST["numero_licencia"] : null,
        "rndc_vencimiento_licencia" => isset($_POST["vencimiento_licencia"]) ? $_POST["vencimiento_licencia"] : null,
        "estado" => $_POST['estado'],
        "documentos" => isset($_FILES['documentos']) ? $_FILES['documentos'] : null,
        "celular2" => isset($_POST['celular2']) ? $_POST['celular2'] : null,
        "nombre_eps" => isset($_POST['name_eps']) ? $_POST['name_eps'] : null,
        "fecha_vencimiento" => empty($_POST["vence_eps"]) ? null : $_POST["vence_eps"],
        "ultimo_eps" => isset($ultimo_eps) ? $ultimo_eps : null,
        "nombre_arl" => isset($nombre_arl) ? $nombre_arl : null,
        "fecha_vencimiento_arl" => $fecha_vencimiento_arl == '' ? null : $fecha_vencimiento_arl,
        "ultimo_arl" => isset($ultimo_arl) ? $ultimo_arl : null,
        "nombre_entidad" => isset($_POST["nom_enti"]) ? $_POST["nom_enti"] : null,
        "vence_curso" => empty($_POST["vence_curso"]) ? null : $_POST["vence_curso"],
        "vence_eps" => empty($_POST["vence_eps"]) ? null : $_POST["vence_eps"],
        "sexo" => $_POST['sexo'],
        "fecha_nace" => $_POST["fecha_nacimiento"] == '' ? null : $_POST["fecha_nacimiento"],
        "sangre" => isset($_POST["sangre"]) ? $_POST["sangre"] : null,
        "civil" => isset($civil) ? $civil : null,
        "fecha_ingreso" => $_POST["fecha_ingreso"] == '' ? null : $_POST["fecha_ingreso"],

        // Insertar referencias 

        /*Referencia personal 1*/
        "referencias_empresariales1" => isset($referencias_empresariales) ? $referencias_empresariales : null,
        "fecha_referencia1" => empty($fecha_ereferencia1) ? null : $fecha_ereferencia1,
        "fecha_retiro1" => empty($fecha_retiro1) ? null : $fecha_retiro1,
        "contacto_ref1" => isset($contacto_ref1) ? $contacto_ref1 : null,
        "celular_ref1" => isset($celular_ref1) ? $celular_ref1 : null,
        "cargo_ref1" => isset($cargo_ref1) ? $cargo_ref1 : null,
        "anti_ref1" => isset($anti_ref1) ? $anti_ref1 : null,
        "idp1" => isset($_POST['idp1']) ? $_POST['idp1'] : null,
        /* Fin primera referencia 1*/

        /*Referencia personal 2*/
        "referencias_empresariales2" => isset($referencia_empresarial2) ? $referencia_empresarial2 : null,
        "fecha_referencia2" => empty($fecha_ereferencia2) ? null : $fecha_ereferencia2,
        "fecha_retiro2" => empty($fecha_retiro2) ? null : $fecha_retiro2,
        "contacto_ref2" => isset($contacto_ref2) ? $contacto_ref2 : null,
        "celular_ref2" => isset($celular_ref2) ? $celular_ref2 : null,
        "cargo_ref2" => isset($cargo_ref2) ? $cargo_ref2 : null,
        "anti_ref2" => isset($anti_ref2) ? $anti_ref2 : null,
        "idp2" => isset($_POST['idp2']) ? $_POST['idp2'] : null,
        /* Fin primera referencia 2*/

        /*Referencia personal 3*/
        "referencias_empresariales3" => isset($referencias_empresariales3) ? $referencias_empresariales3 : null,
        "fecha_referencia3" => empty($fecha_referencia3) ? null : $fecha_referencia3,
        "fecha_retiro3" => empty($fecha_retiro3) ? null : $fecha_retiro3,
        "contacto_ref3" => isset($contacto_ref3) ? $contacto_ref3 : null,
        "celular_ref3" => isset($celular_ref3) ? $celular_ref3 : null,
        "cargo_ref3" => isset($cargo_ref3) ? $cargo_ref3 : null,
        "anti_ref3" => isset($anti_ref3) ? $anti_ref3 : null,
        "idp3" => isset($_POST['idp3']) ? $_POST['idp3'] : null,
        /* Fin primera referencia 3*/

        // Documentos
        "licencia" => isset($_FILES['licencia']) ? $_FILES['licencia'] : null,
        "docu_eps" => isset($_FILES['docu_eps']) ? $_FILES['docu_eps'] : null,
        "foto_conductor" => isset($_FILES['foto_conductor']) ? $_FILES['foto_conductor'] : null,
        "foto_derecha" => isset($_FILES['foto_derecha']) ? $_FILES['foto_derecha'] : null,
        "foto_izquierda" => isset($_FILES['foto_izquierda']) ? $_FILES['foto_izquierda'] : null,
        "foto_indume" => isset($_FILES['foto_indume']) ? $_FILES['foto_indume'] : null,
        "docu_curso" => isset($_FILES['docu_curso']) ? $_FILES['docu_curso'] : null,
        "rut" => isset($_FILES['rut']) ? $_FILES['rut'] : null,
        "acuerdo_uno" => isset($_FILES['acuerdo_uno']) ? $_FILES['acuerdo_uno'] : null,

        //Nombre de los documentos
        "namedocu_eps" => isset($namedocu_eps) ? $namedocu_eps : null,
        "namedocu_curso" => isset($namedocu_curso) ? $namedocu_curso : null,
        "name_docurut" => isset($name_docurut) ? $name_docurut : null,
        "name_doculice" => isset($name_doculice) ? $name_doculice : null,
        "name_fontall" => isset($name_fontal) ? $name_fontal : null,
        "name_derecha" => isset($name_derecha) ? $name_derecha : null,
        "name_izquierda" => isset($name_izquierda) ? $name_izquierda : null,
        "name_indum" => isset($name_indu) ? $name_indu : null,
        "name_a1" => isset($name_a1) ? $name_a1 : null,

        //referencias personales 1
        "referencias_personales" => isset($referencias_personales) ? $referencias_personales : null,
        "fecha_personal1" => $fecha_preferencia1 == '' ? null :  $fecha_preferencia1,
        "parenp1" => isset($parenp1) ? $parenp1 : null,
        "telefonop1" => isset($telefonop1) ? $telefonop1 : null,
        "ref_id1" => isset($_POST['ref_id1']) ? $_POST['ref_id1'] : null,

        //referencias personales 2
        "referencias_personales2" => isset($refe_personal2) ? $refe_personal2 : null,
        "fecha_personal2" => $fecha_preferencia2 == '' ? null : $fecha_preferencia2,
        "parenp2" => isset($parenp2) ? $parenp2 : null,
        "telefonop2" => isset($telefonop2) ? $telefonop2 : null,
        "ref_id2" => isset($_POST['ref_id2']) ? $_POST['ref_id2'] : null,
        /* Numero del proveedor */
        "numdoc_proveedor" => isset($numdoc_proveedor) ? $numdoc_proveedor : null,
      ];

      // Procesar las respuestas del modelo.
      $this->actualizar_proveedor = $this->_modelo->Actualizar_proveedor($datos);
      if ($this->actualizar_proveedor == true) {
        $response = ['numero' => 200, 'mensaje' => 'Se Registro Datos Exitosamente NEXOSAPP.'];
        $this->guardar_proveedor = $response;
      } else if ($this->actualizar_proveedor == false) {
        $response = ['numero' => 400, 'mensaje' => 'Error No se creo el Tercero en NEXOSAPP.'];
        $this->guardar_proveedor = $response;
      }
      echo json_encode($this->guardar_proveedor);
    }

    if ($Propietario == "true" &&  $Conductor == "true" && $Poseedor == "false") {
      $ultimo_eps = null;;
      $nombre_arl = '';
      $fecha_vencimiento_arl = null;
      $ultimo_arl = null;
      $civil = null;
      $response = [];

      $referencias_empresariales = $_POST["referencias_empresariales1"];
      $fecha_ereferencia1 = $_POST["fecha_referencia1"];
      $fecha_retiro1 = $_POST["fecha_retiro1"];
      $contacto_ref1 = $_POST["contacto_ref1"];
      $celular_ref1 = $_POST["celular_ref1"];
      $cargo_ref1 = $_POST["cargo_ref1"];
      $anti_ref1 = $_POST["anti_ref1"];

      $referencia_empresarial2 = $_POST["referencias_empresariales2"];
      $fecha_ereferencia2 = $_POST["fecha_referencia2"];
      $fecha_retiro2 = $_POST["fecha_retiro2"];
      $contacto_ref2 = $_POST["contacto_ref2"];
      $celular_ref2 = $_POST["celular_ref2"];
      $cargo_ref2 = $_POST["cargo_ref2"];
      $anti_ref2 = $_POST["anti_ref2"];

      $referencias_empresariales3 = $_POST["referencias_empresariales3"];
      $fecha_referencia3 = $_POST["fecha_referencia3"];
      $fecha_retiro3 = $_POST["fecha_retiro3"];
      $contacto_ref3 = $_POST["contacto_ref3"];
      $celular_ref3 = $_POST["celular_ref3"];
      $cargo_ref3 = $_POST["cargo_ref3"];
      $anti_ref3 = $_POST["anti_ref3"];

      $referencias_personales = $_POST["referencias_personales"];
      $fecha_preferencia1 = $_POST["fecha_personal1"] ? $_POST["fecha_personal1"] : null;
      $parenp1 = $_POST["parenp1"];
      $telefonop1 = $_POST["telefonop1"];

      $refe_personal2 = $_POST["referencias_personales2"];
      $fecha_preferencia2 = $_POST["fecha_personal2"] ? $_POST["fecha_personal2"] : null;
      $parenp2 = $_POST["parenp2"];
      $telefonop2 = $_POST["telefonop2"];

      //NOMBRES DE LOS DOCUMENTOS
      if (isset($_POST["namedocu_eps"])) {
        $namedocu_eps = $_POST["namedocu_eps"];
      } else {
        $namedocu_eps = '';
      }
      $namedocu_arl = '';

      if (isset($_POST["namedocu_curso"])) {
        $namedocu_curso = $_POST["namedocu_curso"];
      } else {
        $namedocu_curso = '';
      }

      if (isset($_POST["name_docurut"])) {
        $name_docurut = $_POST["name_docurut"];
      } else {
        $name_docurut = '';
      }

      if (isset($_POST["name_doculice"])) {
        $name_doculice = $_POST["name_doculice"];
      } else {
        $name_doculice = '';
      }

      //nombre de las fotos del conductor
      if (isset($_POST["name_fontall"])) {
        $name_fontal = $_POST["name_fontall"];
      } else {
        $name_fontal = '';
      }

      if (isset($_POST["name_derecha"])) {
        $name_derecha = $_POST["name_derecha"];
      } else {
        $name_derecha = '';
      }

      if (isset($_POST["name_izquierda"])) {
        $name_izquierda = $_POST["name_izquierda"];
      } else {
        $name_izquierda = '';
      }

      if (isset($_POST["name_indum"])) {
        $name_indu = $_POST["name_indum"];
      } else {
        $name_indu = '';
      }
      //nombre de acuerdos
      if (isset($_POST["name_a1"])) {
        $name_a1 = $_POST["name_a1"];
      } else {
        $name_a1 = '';
      }

      /* Array de datos para hacer la insersion */
      $datos = [
        /* Datos Generales del proveedor */
        "tipo_documento" => $_POST['tipo_documento'],
        "numero_documento" => $_POST['numero_documento'],
        "digito_verificacion" =>  $_POST['digito_verificacion'],
        "tipo_identificacion" => $_POST['tipo_identificacion'],
        "rndc_nombre2" => $_POST['rndc_nombre'],
        "apellido1" =>  $apellido1,
        "apellido2" => $apellido2,
        "abreviatura" => $_POST['abreviatura'],
        "contacto" => $_POST['contacto'],
        "celular" => $_POST['celular'],
        "direccion" => $_POST['direccion'],
        "email" => $_POST['email'],
        "municipio" => $_POST['municipio'],

        /* Datos del conductor especificos */
        "rndc_categoria_licencia" => isset($_POST["categoria_licencia"]) ? $_POST["categoria_licencia"] : null,
        "rndc_numero_licencia" => isset($_POST["numero_licencia"]) ? $_POST["numero_licencia"] : null,
        "rndc_vencimiento_licencia" => isset($_POST["vencimiento_licencia"]) ? $_POST["vencimiento_licencia"] : null,
        "estado" => $_POST['estado'],
        "documentos" => isset($_FILES['documentos']) ? $_FILES['documentos'] : null,
        "celular2" => isset($_POST['celular2']) ? $_POST['celular2'] : null,
        "nombre_eps" => isset($_POST['name_eps']) ? $_POST['name_eps'] : null,
        "fecha_vencimiento" => $_POST["vence_eps"] == '' ? null : $_POST["vence_eps"],
        "ultimo_eps" => isset($ultimo_eps) ? $ultimo_eps : null,
        "nombre_arl" => isset($nombre_arl) ? $nombre_arl : null,
        "fecha_vencimiento_arl" => $fecha_vencimiento_arl == '' ? null : $fecha_vencimiento_arl,
        "ultimo_arl" => isset($ultimo_arl) ? $ultimo_arl : null,
        "nombre_entidad" => isset($_POST["nom_enti"]) ? $_POST["nom_enti"] : null,
        "vence_curso" => $_POST["vence_curso"] == '' ? null : $_POST["vence_curso"],
        "vence_eps" => $_POST["vence_eps"] == '' ? null : $_POST["vence_eps"],
        "sexo" => $_POST['sexo'],
        "fecha_nace" => $_POST["fecha_nacimiento"] == '' ? null : $_POST["fecha_nacimiento"],
        "sangre" => isset($_POST["sangre"]) ? $_POST["sangre"] : null,
        "civil" => isset($civil) ? $civil : null,
        "fecha_ingreso" => $_POST["fecha_ingreso"] == '' ? null : $_POST["fecha_ingreso"],

        // Insertar referencias 

        /*Referencia personal 1*/
        "referencias_empresariales1" => isset($referencias_empresariales) ? $referencias_empresariales : null,
        "fecha_referencia1" => empty($fecha_ereferencia1) ? null : $fecha_ereferencia1,
        "fecha_retiro1" => empty($fecha_retiro1) ? null : $fecha_retiro1,
        "contacto_ref1" => isset($contacto_ref1) ? $contacto_ref1 : null,
        "celular_ref1" => isset($celular_ref1) ? $celular_ref1 : null,
        "cargo_ref1" => isset($cargo_ref1) ? $cargo_ref1 : null,
        "anti_ref1" => isset($anti_ref1) ? $anti_ref1 : null,
        "idp1" => isset($_POST['idp1']) ? $_POST['idp1'] : null,
        /* Fin primera referencia 1*/

        /*Referencia personal 2*/
        "referencias_empresariales2" => isset($referencia_empresarial2) ? $referencia_empresarial2 : null,
        "fecha_referencia2" => empty($fecha_ereferencia2) ? null : $fecha_ereferencia2,
        "fecha_retiro2" => empty($fecha_retiro2) ? null : $fecha_retiro2,
        "contacto_ref2" => isset($contacto_ref2) ? $contacto_ref2 : null,
        "celular_ref2" => isset($celular_ref2) ? $celular_ref2 : null,
        "cargo_ref2" => isset($cargo_ref2) ? $cargo_ref2 : null,
        "anti_ref2" => isset($anti_ref2) ? $anti_ref2 : null,
        "idp2" => isset($_POST['idp2']) ? $_POST['idp2'] : null,
        /* Fin primera referencia 2*/

        /*Referencia personal 3*/
        "referencias_empresariales3" => isset($referencias_empresariales3) ? $referencias_empresariales3 : null,
        "fecha_referencia3" => empty($fecha_referencia3) ? null : $fecha_referencia3,
        "fecha_retiro3" => empty($fecha_retiro3) ? null : $fecha_retiro3,
        "contacto_ref3" => isset($contacto_ref3) ? $contacto_ref3 : null,
        "celular_ref3" => isset($celular_ref3) ? $celular_ref3 : null,
        "cargo_ref3" => isset($cargo_ref3) ? $cargo_ref3 : null,
        "anti_ref3" => isset($anti_ref3) ? $anti_ref3 : null,
        "idp3" => isset($_POST['idp3']) ? $_POST['idp3'] : null,
        /* Fin primera referencia 3*/

        // Documentos
        "licencia" => isset($_FILES['licencia']) ? $_FILES['licencia'] : null,
        "docu_eps" => isset($_FILES['docu_eps']) ? $_FILES['docu_eps'] : null,
        "foto_conductor" => isset($_FILES['foto_conductor']) ? $_FILES['foto_conductor'] : null,
        "foto_derecha" => isset($_FILES['foto_derecha']) ? $_FILES['foto_derecha'] : null,
        "foto_izquierda" => isset($_FILES['foto_izquierda']) ? $_FILES['foto_izquierda'] : null,
        "foto_indume" => isset($_FILES['foto_indume']) ? $_FILES['foto_indume'] : null,
        "docu_curso" => isset($_FILES['docu_curso']) ? $_FILES['docu_curso'] : null,
        "rut" => isset($_FILES['rut']) ? $_FILES['rut'] : null,
        "acuerdo_uno" => isset($_FILES['acuerdo_uno']) ? $_FILES['acuerdo_uno'] : null,

        //Nombre de los documentos
        "namedocu_eps" => isset($namedocu_eps) ? $namedocu_eps : null,
        "namedocu_curso" => isset($namedocu_curso) ? $namedocu_curso : null,
        "name_docurut" => isset($name_docurut) ? $name_docurut : null,
        "name_doculice" => isset($name_doculice) ? $name_doculice : null,
        "name_fontall" => isset($name_fontal) ? $name_fontal : null,
        "name_derecha" => isset($name_derecha) ? $name_derecha : null,
        "name_izquierda" => isset($name_izquierda) ? $name_izquierda : null,
        "name_indum" => isset($name_indu) ? $name_indu : null,
        "name_a1" => isset($name_a1) ? $name_a1 : null,

        //referencias personales 1
        "referencias_personales" => isset($referencias_personales) ? $referencias_personales : null,
        "fecha_personal1" => $fecha_preferencia1 == '' ? null :  $fecha_preferencia1,
        "parenp1" => isset($parenp1) ? $parenp1 : null,
        "telefonop1" => isset($telefonop1) ? $telefonop1 : null,
        "ref_id1" => isset($_POST['ref_id1']) ? $_POST['ref_id1'] : null,

        //referencias personales 2
        "referencias_personales2" => isset($refe_personal2) ? $refe_personal2 : null,
        "fecha_personal2" => $fecha_preferencia2 == '' ? null : $fecha_preferencia2,
        "parenp2" => isset($parenp2) ? $parenp2 : null,
        "telefonop2" => isset($telefonop2) ? $telefonop2 : null,
        "ref_id2" => isset($_POST['ref_id2']) ? $_POST['ref_id2'] : null,
        /* Numero del proveedor */
        "numdoc_proveedor" => isset($numdoc_proveedor) ? $numdoc_proveedor : null,
      ];

      // Procesar las respuestas del modelo.
      $this->actualizar_proveedor = $this->_modelo->Actualizar_proveedor($datos);
      if ($this->actualizar_proveedor == true) {
        $response = ['numero' => 200, 'mensaje' => 'Se Registro Datos Exitosamente NEXOSAPP.'];
        $this->guardar_proveedor = $response;
      } else if ($this->actualizar_proveedor == false) {
        $response = ['numero' => 400, 'mensaje' => 'Error No se creo el Tercero en NEXOSAPP.'];
        $this->guardar_proveedor = $response;
      }
      echo json_encode($this->guardar_proveedor);
    }
  }

  public function crear_transaccion_ministerio()
  {
    $fecha_actual = date('Y-m-d');
    $hora_actual = date('H:i:s');
    $num_documento = $_POST["num_documento"];
    $tercero_clase = $_POST["tercero_clase"];
    $this->crear_transision_ministerio = $this->_modelo->crear_transaccion_ministerio($num_documento, $tercero_clase, $fecha_actual, $hora_actual);
    if ($this->crear_transision_ministerio == true) {
      $response = 1;
      $this->crear_transision_ministerio = $response;
    } else if ($this->crear_transision_ministerio == false) {
      $response = 0;
      $this->crear_transision_ministerio = $response;
    }
    echo json_encode($this->crear_transision_ministerio);
  }

  public function traer_datos_proveedorver()
  {
    $proveedor_id = $_POST["id"];
    $this->ver_proveedor = $this->_modelo->Traer_Datos_Proveedor($proveedor_id);
    echo json_encode($this->ver_proveedor);
  }

  public function historico_proveedor()
  {
    //ver los vehiculos que tiene ese proveedor
    $id_proveedor = $_POST["id"];
  }

  public function consultar_datos_proveedores()
  {
    $prefiltro = $_POST["prefiltro"];
    $token = $_POST["token"];
    $this->consultar_datos_proveedores = $this->_modelo->Obetener_datos_proveedores($prefiltro, $token);
    echo json_encode($this->consultar_datos_proveedores);
  }
}
