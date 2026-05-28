<?php
session_start();

class integrar_oetController extends Controller
{
    private $_modelo;
    private $doc;
    private $nota;
    private $not;

    public function __construct()
    {
        parent::__construct();
        //$this->$_modelo=$this->loadModel('transporte'); 
        $this->_modelo = $this->loadModel('integracion_oet');
    }
    public function index()
    {
        $prueba = $this->loadModel('transporte');
        $this->_view->prueba = $prueba;
        $this->_view->titulo = 'Consultas Recursos (Terceros - Vehículos - Tráiler)';
        $this->_view->renderizar('index', 'web_service_oet');
    }

    public function webservice_documentos()
    {
        $prueba = $this->loadModel('integracion_oet');
        $this->_view->prueba = $prueba;
        $this->_view->titulo = 'Retransmisión Avansat';
        $this->_view->renderizar('web_service_documentos', 'integrar_oet');
    }

    /******************** CONSULTAS *****************************************/
    public function Consulta_parametros()
    {
        $tiporecurso = $_POST["recurso"];
        $filtro = $_POST["filtro"];
        $numero = $_POST["numero"];
        $placa = $_POST["placa"];
        $this->nota = $this->_modelo->Consulta_Recurso($tiporecurso, $filtro, $numero, $placa);
        echo json_encode($this->nota);
    }

    public function Consulta_cada_Tipo()
    {
        $tiporecurso = $_POST["recurso"];
        $filtro = $_POST["filtro"];
        $numero = $_POST["numero"];
        $placa = $_POST["placa"];
        $this->nota = $this->_modelo->Consulta_Tipo($tiporecurso, $filtro, $numero, $placa);
        echo json_encode($this->nota);
    }

    public function Consulta_Especifica()
    {
        $numero = $_POST["numero"];
        $id_filtro = $_POST["id_filtro"];
        $person = $_POST["person"];
        $this->not = $this->_modelo->Consulta_Especifica($numero, $person, $id_filtro);
        echo json_encode($this->not);
    }

    public function Conexion_Avansat()
    {
        /* CONSULTAR AGENCIA Y AMBIENTE */
        $empresa = $this->_modelo->Consultar_ambientes();
        if ($empresa['nombre_ambiente'] == "PRODUCCION") {
            /* CONSULTAR LA URL DE CONEXION  */
            $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
            if ($conexion) {
                // $userid = "InterfPrueba";
                // $pwd = "Nexos2020";
                // $urlc = "https://oet-qa.intrared.net:8083/ap/nexos/api_tms/index.php/api/authenticate?userId=InterfPrueba&pwd=Nexos2020";
                $urlc = $conexion['URL_CONEXION_PRINCIPAL'];
                $autorizacion_ambiente = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
                $opts = array(
                    'http' =>
                    array(
                        'method' => 'GET',
                        'header' => "Content-Type:application/json\r\n" .
                            "Authorization:" . $autorizacion_ambiente . "\r\n",
                        'timeout' => 60
                    )
                );
                $context = stream_context_create($opts);
                $url = $urlc;
                $result = file_get_contents($url, false, $context);
                $datos = json_decode($result, true);
                $token_generado = $datos['data']['token'];
                return ($token_generado);
            } else {
                echo "Error de conexion a oet";
            }
        } else {
            /* CONSULTAR LA URL DE CONEXION  */
            $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
            if ($conexion) {
                $urlc = $conexion['URL_CONEXION_PRUEBA'];
                $autorizacion_ambiente = '21b2e5c191e46165607c23cc48779c61e08972d5';
                $opts = array(
                    'http' =>
                    array(
                        'method' => 'GET',
                        'header' => "Content-Type:application/json\r\n" .
                            "Authorization:" . $autorizacion_ambiente . "\r\n",
                        'timeout' => 60
                    )
                );
                $context = stream_context_create($opts);
                $url = $urlc;
                $result = file_get_contents($url, false, $context);
                $datos = json_decode($result, true);
                $token_generado = $datos['data']['token'];
                return ($token_generado);
            } else {
                echo "Error de conexion a oet";
            }
        }
    }

    public function Consulta_Recurso_Avansat()
    {
        $token_autentica = $this->Conexion_Avansat();
        if (isset($token_autentica)) {
            $clase = $_POST["clase_recurso"];
            $recurso = $_POST["recurso"];
            $datorecurso = $_POST["dato_recurso"];
            //consultar el recurso en Avansat 
            //ENPOINT MEDIADORID - consulta de datos
            if ($clase == 1) { //TERCEROS
                // $url_consulta = "https://oet-qa.intrared.net:8083/ap/nexos/api_tms/index.php/api/mediator/" . $datorecurso;
                /* CONSULTAR AGENCIA Y AMBIENTE */
                $empresa = $this->_modelo->Consultar_ambientes();
                if ($empresa['nombre_ambiente'] == "PRODUCCION") {
                    /* CONSULTAR LA URL DE CONEXION  */
                    $autorizacion_ambiente = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
                    $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                    if ($conexion) {
                        $url_consulta = $conexion['URL_CONSULTA_TERCERO_PRINCIPAL'] . $datorecurso;
                        // $url_consulta = API_URL_CONSULTA_TERCERO . $datorecurso;
                        $opcion_consulta = array(
                            'http' =>
                            array(
                                'method' => 'GET',
                                'header' => "Content-Type:application/json\r\n" .
                                    "Authorization:" . $autorizacion_ambiente . "\r\n" .
                                    "TOKEN:" . $token_autentica . "\r\n",
                                'timeout' => 60
                            )
                        );
                        $context_consulta = stream_context_create($opcion_consulta);
                        $consulta = file_get_contents($url_consulta, false, $context_consulta);
                        $datos_consulta = json_decode($consulta, true);
                        $mediador_terceros = $this->Mediador_Tercero($clase, $recurso, $datorecurso, $datos_consulta, $token_autentica);
                    } else {
                        echo "Error de conexion a oet";
                    }
                } else {
                    /* CONSULTAR LA URL DE CONEXION */
                    $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                    if ($conexion) {
                        $url_consulta = $conexion['URL_CONSULTA_TERCERO_PRUEBA'] . $datorecurso;
                        // $url_consulta = API_URL_CONSULTA_TERCERO . $datorecurso;
                        $opcion_consulta = array(
                            'http' =>
                            array(
                                'method' => 'GET',
                                'header' => "Content-Type:application/json\r\n" .
                                    "Authorization:21b2e5c191e46165607c23cc48779c61e08972d5\r\n" .
                                    "TOKEN:" . $token_autentica . "\r\n",
                                'timeout' => 60
                            )
                        );
                        $context_consulta = stream_context_create($opcion_consulta);
                        $consulta = file_get_contents($url_consulta, false, $context_consulta);
                        $datos_consulta = json_decode($consulta, true);
                        $mediador_terceros = $this->Mediador_Tercero($clase, $recurso, $datorecurso, $datos_consulta, $token_autentica);
                    } else {
                        echo "Error de conexion a oet";
                    }
                }
            }

            if ($clase == 2) { //VEHICULOS
                //consulta el documento del propietario Hoja de vida
                if ($recurso == 6) { //consulta por placa
                    /* CONSULTAR AGENCIA Y AMBIENTE */
                    $empresa = $this->_modelo->Consultar_ambientes();
                    if ($empresa['nombre_ambiente'] == "PRODUCCION") {
                        /* CONSULTAR LA URL DE CONEXION  */
                        $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                        if ($conexion) {
                            $url_consulta = $conexion['URL_CONSULTA_VEHICULO_PRINCIPAL'] . $datorecurso;
                            // $url_consulta = API_URL_CONSULTA_TERCERO . $datorecurso;
                            $opcion_consulta = array(
                                'http' =>
                                array(
                                    'method' => 'GET',
                                    'header' => "Content-Type:application/json\r\n" .
                                        "Authorization:1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p\r\n" .
                                        "TOKEN:" . $token_autentica . "\r\n",
                                    'timeout' => 60
                                )
                            );
                            $context_consulta = stream_context_create($opcion_consulta);
                            $consulta = file_get_contents($url_consulta, false, $context_consulta);
                            $datos_consulta = json_decode($consulta, true);
                            $mediador_terceros = $this->Mediador_Tercero($clase, $recurso, $datorecurso, $datos_consulta, $token_autentica);
                        } else {
                            echo "Error de conexion a oet";
                        }
                    } else {
                        /* CONSULTAR LA URL DE CONEXION  */
                        $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                        if ($conexion) {
                            $url_consulta = $conexion['URL_CONSULTA_VEHICULO_PRUEBA'] . $datorecurso;
                            // $url_consulta = API_URL_CONSULTA_TERCERO . $datorecurso;
                            $opcion_consulta = array(
                                'http' =>
                                array(
                                    'method' => 'GET',
                                    'header' => "Content-Type:application/json\r\n" .
                                        "Authorization:21b2e5c191e46165607c23cc48779c61e08972d5\r\n" .
                                        "TOKEN:" . $token_autentica . "\r\n",
                                    'timeout' => 60
                                )
                            );
                            $context_consulta = stream_context_create($opcion_consulta);
                            $consulta = file_get_contents($url_consulta, false, $context_consulta);
                            $datos_consulta = json_decode($consulta, true);
                            $mediador_terceros = $this->Mediador_Tercero($clase, $recurso, $datorecurso, $datos_consulta, $token_autentica);
                        } else {
                            echo "Error de conexion a oet";
                        }
                    }
                }
                if ($recurso == 7) { //consulta por numero propietario vehículo
                    /* CONSULTAR AGENCIA Y AMBIENTE */
                    $empresa = $this->_modelo->Consultar_ambientes();
                    if ($empresa['nombre_ambiente'] == "PRODUCCION") {
                        /* CONSULTAR LA URL DE CONEXION  */
                        $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                        if ($conexion) {
                            $url_consulta = $conexion['URL_DOCUMENTO_PROPIETARIO_PRINCIPAL'] . $datorecurso;
                            // $url_consulta = API_URL_CONSULTA_TERCERO . $datorecurso;
                            $opcion_consulta = array(
                                'http' =>
                                array(
                                    'method' => 'GET',
                                    'header' => "Content-Type:application/json\r\n" .
                                        "Authorization:1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p\r\n" .
                                        "TOKEN:" . $token_autentica . "\r\n",
                                    'timeout' => 60
                                )
                            );
                            $context_consulta = stream_context_create($opcion_consulta);
                            $consulta = file_get_contents($url_consulta, false, $context_consulta);
                            $datos_consulta = json_decode($consulta, true);
                            $mediador_terceros = $this->Mediador_Tercero($clase, $recurso, $datorecurso, $datos_consulta, $token_autentica);
                        } else {
                            echo "Error de conexion a oet";
                        }
                    } else {
                        /* CONSULTAR LA URL DE CONEXION  */
                        $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                        if ($conexion) {
                            $url_consulta = $conexion['URL_DOCUMENTO_PROPIETARIO_PRUEBA'] . $datorecurso;
                            // $url_consulta = API_URL_CONSULTA_TERCERO . $datorecurso;
                            $opcion_consulta = array(
                                'http' =>
                                array(
                                    'method' => 'GET',
                                    'header' => "Content-Type:application/json\r\n" .
                                        "Authorization:21b2e5c191e46165607c23cc48779c61e08972d5\r\n" .
                                        "TOKEN:" . $token_autentica . "\r\n",
                                    'timeout' => 60
                                )
                            );
                            $context_consulta = stream_context_create($opcion_consulta);
                            $consulta = file_get_contents($url_consulta, false, $context_consulta);
                            $datos_consulta = json_decode($consulta, true);
                            $mediador_terceros = $this->Mediador_Tercero($clase, $recurso, $datorecurso, $datos_consulta, $token_autentica);
                        } else {
                            echo "Error de conexion a oet";
                        }
                    }
                }
            }

            if ($clase == 3) { //TRÁILER
                if ($recurso == 8) { //placa
                    /* CONSULTAR AGENCIA Y AMBIENTE */
                    $empresa = $this->_modelo->Consultar_ambientes();
                    if ($empresa['nombre_ambiente'] == "PRODUCCION") {
                        /* CONSULTAR LA URL DE CONEXION  */
                        $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                        if ($conexion) {
                            $url_consulta = $conexion['URL_CONSULTA_PLACA_TRAILER_PRINCIPAL'] . $datorecurso;
                            // $url_consulta = API_URL_CONSULTA_TERCERO . $datorecurso;
                            $opcion_consulta = array(
                                'http' =>
                                array(
                                    'method' => 'GET',
                                    'header' => "Content-Type:application/json\r\n" .
                                        "Authorization:1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p\r\n" .
                                        "TOKEN:" . $token_autentica . "\r\n",
                                    'timeout' => 60
                                )
                            );
                            $context_consulta = stream_context_create($opcion_consulta);
                            $consulta = file_get_contents($url_consulta, false, $context_consulta);
                            $datos_consulta = json_decode($consulta, true);
                            $mediador_terceros = $this->Mediador_Tercero($clase, $recurso, $datorecurso, $datos_consulta, $token_autentica);
                        } else {
                            echo "Error de conexion a oet";
                        }
                    } else {
                        /* CONSULTAR LA URL DE CONEXION  */
                        $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                        if ($conexion) {
                            $url_consulta = $conexion['URL_CONSULTA_PLACA_TRAILER_PRUEBA'] . $datorecurso;
                            // $url_consulta = API_URL_CONSULTA_TERCERO . $datorecurso;
                            $opcion_consulta = array(
                                'http' =>
                                array(
                                    'method' => 'GET',
                                    'header' => "Content-Type:application/json\r\n" .
                                        "Authorization:21b2e5c191e46165607c23cc48779c61e08972d5\r\n" .
                                        "TOKEN:" . $token_autentica . "\r\n",
                                    'timeout' => 60
                                )
                            );
                            $context_consulta = stream_context_create($opcion_consulta);
                            $consulta = file_get_contents($url_consulta, false, $context_consulta);
                            $datos_consulta = json_decode($consulta, true);
                            $mediador_terceros = $this->Mediador_Tercero($clase, $recurso, $datorecurso, $datos_consulta, $token_autentica);
                        } else {
                            echo "Error de conexion a oet";
                        }
                    }
                }
                if ($recurso == 9) { //propietario
                    /* CONSULTAR AGENCIA Y AMBIENTE */
                    $empresa = $this->_modelo->Consultar_ambientes();
                    if ($empresa['nombre_ambiente'] == "PRODUCCION") {
                        /* CONSULTAR LA URL DE CONEXION  */
                        $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                        if ($conexion) {
                            $url_consulta = $conexion['URL_CONSULTA_DOCUMENTO_PROPIETARIO_TRAILER_PRINCIPAL'] . $datorecurso;
                            // $url_consulta = API_URL_CONSULTA_TERCERO . $datorecurso;
                            $opcion_consulta = array(
                                'http' =>
                                array(
                                    'method' => 'GET',
                                    'header' => "Content-Type:application/json\r\n" .
                                        "Authorization:1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p\r\n" .
                                        "TOKEN:" . $token_autentica . "\r\n",
                                    'timeout' => 60
                                )
                            );
                            $context_consulta = stream_context_create($opcion_consulta);
                            $consulta = file_get_contents($url_consulta, false, $context_consulta);
                            $datos_consulta = json_decode($consulta, true);
                            $mediador_terceros = $this->Mediador_Tercero($clase, $recurso, $datorecurso, $datos_consulta, $token_autentica);
                        } else {
                            echo "Error de conexion a oet";
                        }
                    } else {
                        /* CONSULTAR LA URL DE CONEXION  */
                        $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                        if ($conexion) {
                            $url_consulta = $conexion['URL_CONSULTA_DOCUMENTO_PROPIETARIO_TRAILER_PRUEBA'] . $datorecurso;
                            // $url_consulta = API_URL_CONSULTA_TERCERO . $datorecurso;
                            $opcion_consulta = array(
                                'http' =>
                                array(
                                    'method' => 'GET',
                                    'header' => "Content-Type:application/json\r\n" .
                                        "Authorization:21b2e5c191e46165607c23cc48779c61e08972d5\r\n" .
                                        "TOKEN:" . $token_autentica . "\r\n",
                                    'timeout' => 60
                                )
                            );
                            $context_consulta = stream_context_create($opcion_consulta);
                            $consulta = file_get_contents($url_consulta, false, $context_consulta);
                            $datos_consulta = json_decode($consulta, true);
                            $mediador_terceros = $this->Mediador_Tercero($clase, $recurso, $datorecurso, $datos_consulta, $token_autentica);
                        } else {
                            echo "Error de conexion a oet";
                        }
                    }
                }
            }

            if ($clase == 4) { //ORDEN DE CARGUE
                /* CONSULTAR AGENCIA Y AMBIENTE */
                $empresa = $this->_modelo->Consultar_ambientes();
                if ($empresa['nombre_ambiente'] == "PRODUCCION") {
                    /* CONSULTAR LA URL DE CONEXION  */
                    $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                    if ($conexion) {
                        $url_consulta = $conexion['URL_CONSULTA_ORDEN_CARGUE_PRINCIPAL'] . $datorecurso;
                        // $url_consulta = API_URL_CONSULTA_TERCERO . $datorecurso;
                        $opcion_consulta = array(
                            'http' =>
                            array(
                                'method' => 'GET',
                                'header' => "Content-Type:application/json\r\n" .
                                    "Authorization:1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p\"r\n" .
                                    "TOKEN:" . $token_autentica . "\r\n",
                                'timeout' => 60
                            )
                        );
                        $context_consulta = stream_context_create($opcion_consulta);
                        $consulta = file_get_contents($url_consulta, false, $context_consulta);
                        $datos_consulta = json_decode($consulta, true);
                        $mediador_terceros = $this->Mediador_Tercero($clase, $recurso, $datorecurso, $datos_consulta, $token_autentica);
                    } else {
                        echo "Error de conexion a oet";
                    }
                } else {
                    /* CONSULTAR LA URL DE CONEXION  */
                    $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                    if ($conexion) {
                        $url_consulta = $conexion['URL_CONSULTA_ORDEN_CARGUE_PRUEBA'] . $datorecurso;
                        // $url_consulta = API_URL_CONSULTA_TERCERO . $datorecurso;
                        $opcion_consulta = array(
                            'http' =>
                            array(
                                'method' => 'GET',
                                'header' => "Content-Type:application/json\r\n" .
                                    "Authorization:21b2e5c191e46165607c23cc48779c61e08972d5\r\n" .
                                    "TOKEN:" . $token_autentica . "\r\n",
                                'timeout' => 60
                            )
                        );
                        $context_consulta = stream_context_create($opcion_consulta);
                        $consulta = file_get_contents($url_consulta, false, $context_consulta);
                        $datos_consulta = json_decode($consulta, true);
                        $mediador_terceros = $this->Mediador_Tercero($clase, $recurso, $datorecurso, $datos_consulta, $token_autentica);
                    } else {
                        echo "Error de conexion a oet";
                    }
                }
            }
        } else { //Desconexion Avansat
            $mensaje = "NO HAY TOKEN DE AUTORIZACION, REVISA ENDPOINT";
            echo $mensaje;
            $clase = $_POST["clase_recurso"];
            $recurso = $_POST["recurso"];
            if ($_POST["dato_recurso"]) {
                $datorecurso = $_POST["dato_recurso"];
            } else {
                $numero = $_POST["dato_recurso"];
            }
            $token = "";
            if ($clase == 1) {
                if ($recurso == 1) { //cliente
                    $mediador_terceros = $this->_modelo->Datos_Tercero($recurso, $datorecurso);
                    if ($mediador_terceros["tipo_documento"] == 'Juridico') {
                        $td = '';
                        $telefono_fijo = '';
                        $abreviatura = '';
                        $email = '';
                        $apellido1 = '';
                        $apellido2 = '';
                        $regimen = '';
                        if ($mediador_terceros["tipo_documento"] == 'Natural') {
                            $td = 'C';
                            $apellido1 = 'null';
                            $apellido2 = 'null';
                        }
                        if ($mediador_terceros["tipo_documento"] == 'Juridico') {
                            $td = 'N';
                            $apellido1 = 'null';
                            $apellido2 = 'null';
                        }
                        if ($mediador_terceros['telefono'] != null && $mediador_terceros['telefono'] != '') {
                            $telefono_fijo = $mediador_terceros['telefono'];
                        } else {
                            $telefono_fijo = 'null';
                        }
                        if ($mediador_terceros['email'] != null && $mediador_terceros['email'] != '') {
                            $email = '"' . $mediador_terceros['email'] . '"';
                        } else {
                            $email = 'null';
                        }
                        if ($mediador_terceros['regimen'] != null && $mediador_terceros['regimen'] != '') {
                            if ($mediador_terceros['regimen'] == 'No responsable de IVA') {
                                $regimen = 2;
                            } else {
                                $regimen = 1;
                            }
                        } else {
                            $regimen = '';
                        }
                        $ciiu = 4664;
                        $empresa = $this->_modelo->Consultar_ambientes();
                        $opcion_mediador = array(
                            'http' =>
                            array(
                                'method' => 'POST',
                                'header' => "Content-Type:application/json\r\n" .
                                    "Authorization:1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p\r\n" .
                                    "TOKEN:" . $token_autentica . "\r\n",
                                'content' =>
                                '{' .
                                    '"cod_tipdoc":' . '"' . $td . '"' . "," .
                                    '"cod_tipter":' . '"' . $mediador_terceros['tipo_documento'] . '"' . "," .
                                    '"cod_terreg":' . $regimen . "," .
                                    '"cod_tercer":' . $mediador_terceros['documento'] . "," .
                                    '"num_verifi":' . $mediador_terceros['digito_verificacion'] . "," .
                                    '"nom_tercer":' . '"' . trim($mediador_terceros['nombre']) . '"' . "," .
                                    '"nom_razsoc":' . '"' . trim($mediador_terceros['nombre']) . '"' . "," .
                                    '"cod_activi":' . 10 . "," .
                                    '"cod_ciiuxx":' . $ciiu . "," .
                                    '"cod_ciudad":' . $mediador_terceros['rndc_codigo_ciudad'] . "," .
                                    '"dir_tercer":' . '"' . $mediador_terceros['direccion'] . '"' . "," .
                                    '"num_telef1":' . $telefono_fijo . "," .
                                    '"num_telmov":' . $telefono_fijo . "," .
                                    '"dir_emailx":' . '' . $email . '' . '}'
                            )
                        );
                        $cadena_oet = json_encode($opcion_mediador, JSON_UNESCAPED_UNICODE);
                        $documento = $mediador_terceros['documento'];
                        $identificador = 'Cliente';
                        $respuesta = '';
                        $estado = 0;
                        if (!isset($_SESSION['usuario']['nom_usuario'])) {
                            session_start();
                            $id_usuario = $_SESSION["usuario"]["nom_usuario"];
                        } else {
                            $id_usuario = $_SESSION["usuario"]["nom_usuario"];
                        }
                        $log_avansat = $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $empresa['empresa_id']);
                    }
                } else {
                    $longitud = strlen($recurso);
                    $p1 = 0;
                    $p2 = 0;
                    $p3 = 0;
                    if (!isset($_SESSION['usuario']['nom_usuario'])) {
                        session_start();
                        $id_usuario = $_SESSION["usuario"]["nom_usuario"];
                    } else {
                        $id_usuario = $_SESSION["usuario"]["nom_usuario"];
                    }
                    for ($i = 0; $i < $longitud; $i++) {
                        $recurso_oet = str_split($recurso);
                        if ($recurso_oet[$i] == '3') {
                            $recurso_oet = 3;
                            $mediador_terceros = $this->_modelo->Datos_Tercero($recurso_oet, $datorecurso);
                            $td = '';
                            $telefono_fijo = '';
                            $abreviatura = '';
                            $email = '';
                            $apellido1 = '';
                            $apellido2 = '';
                            if ($mediador_terceros["tipo_documento"] == 'Cedula de Ciudadania') {
                                $td = 'C';
                                $abreviatura = ('"' . $mediador_terceros['nombre'] . ' ' . $mediador_terceros['apellido1'] . '"');
                            }
                            if ($mediador_terceros["tipo_documento"] == 'Cedula de Extranjeria') {
                                $td = 'E';
                                $abreviatura = ('"' . $mediador_terceros['nombre'] . ' ' . $mediador_terceros['apellido1'] . '"');
                            }
                            if ($mediador_terceros["tipo_documento"] == 'NIT') {
                                $td = 'N';
                                $abreviatura = ('"' . $mediador_terceros['nombre'] . '"');
                            }
                            if ($mediador_terceros['contacto'] != null && $mediador_terceros['contacto'] != '') {
                                $telefono_fijo = $mediador_terceros['contacto'];
                            } else {
                                $telefono_fijo = 'null';
                            }
                            if ($mediador_terceros['email'] != null && $mediador_terceros['email'] != '') {
                                $email = '"' . $mediador_terceros['email'] . '"';
                            } else {
                                $email = 'null';
                            }
                            if ($mediador_terceros['apellido1'] != null && $mediador_terceros['apellido1'] != '') {
                                $apellido1 = '"' . $mediador_terceros['apellido1'] . '"';
                            } else {
                                $apellido1 = 'null';
                            }
                            if ($mediador_terceros['apellido2'] != null && $mediador_terceros['apellido2'] != '') {
                                $apellido2 = '"' . $mediador_terceros['apellido2'] . '"';
                            } else {
                                $apellido2 = 'null';
                            }
                            /* CONSULTAR AGENCIA Y AMBIENTE */
                            $empresa = $this->_modelo->Consultar_ambientes();
                            $opcion_mediador = array(
                                'http' =>
                                array(
                                    'method' => 'POST',
                                    'header' => "Content-Type:application/json\r\n" .
                                        "Authorization:21b2e5c191e46165607c23cc48779c61e08972d5\r\n" .
                                        "TOKEN:" . $token_autentica . "\r\n",
                                    'content' =>
                                    '{' .
                                        '"cod_tipdoc":' . '"' . $td . '"' . "," .
                                        '"cod_activi":' . 15 . "," .
                                        '"cod_tercer":' . $mediador_terceros['numero_documento'] . "," .
                                        '"num_verifi":' . $mediador_terceros['digito_verificacion'] . "," .
                                        '"nom_tercer":' . '"' . trim($mediador_terceros['nombre']) . '"' . "," .
                                        '"nom_apell1":' . '' . trim($apellido1) . '' . "," .
                                        '"nom_apell2":' . '' . trim($apellido2) . '' . "," .
                                        '"abr_tercer":' . '' . trim($abreviatura) . '' . "," .
                                        '"num_telef1":' . $telefono_fijo . "," .
                                        '"num_telmov":' . $mediador_terceros['celular'] . "," .
                                        '"dir_tercer":' . '"' . $mediador_terceros['direccion'] . '"' . "," .
                                        '"dir_emailx":' . '' . $email . '' . "," .
                                        '"cod_ciudad":' . $mediador_terceros['rndc_codigo_ciudad']
                                        . '}'
                                )
                            );
                            $cadena_oet = json_encode($opcion_mediador);
                            $identificador = 'Propietario';
                            $agencia_id = $empresa['empresa_id'];
                            $documento = $mediador_terceros['numero_documento'];
                            $p1 = 2;
                        }
                        if ($recurso_oet[$i] == '5') { //poseedor
                            $recurso_oet = 5;
                            $mediador_terceros = $this->_modelo->Datos_Tercero($recurso_oet, $datorecurso);
                            $td;
                            $telefono_fijo;
                            $abreviatura;
                            $email;
                            $abreviatura;
                            $apellido1;
                            $apellido2;
                            if ($mediador_terceros["tipo_documento"] == 'Cedula de Ciudadania') {
                                $td = 'C';
                                $abreviatura = ($mediador_terceros['nombre'] . ' ' . $mediador_terceros['apellido1']);
                            }
                            if ($mediador_terceros["tipo_documento"] == 'Cedula de Extranjeria') {
                                $td = 'E';
                                $abreviatura = ($mediador_terceros['nombre'] . ' ' . $mediador_terceros['apellido1']);
                            }
                            if ($mediador_terceros["tipo_documento"] == 'NIT') {
                                $td = 'N';
                                $abreviatura = ($mediador_terceros['nombre']);
                            }
                            if ($mediador_terceros['contacto'] != null && $mediador_terceros['contacto'] != '') {
                                $telefono_fijo = $mediador_terceros['contacto'];
                            } else {
                                $telefono_fijo = 'null';
                            }
                            if ($mediador_terceros['email'] != null && $mediador_terceros['email'] != '') {
                                $email = '"' . $mediador_terceros['email'] . '"';
                            } else {
                                $email = 'null';
                            }
                            if ($mediador_terceros['apellido1'] != null && $mediador_terceros['apellido1'] != '') {
                                $apellido1 = '"' . $mediador_terceros['apellido1'] . '"';
                            } else {
                                $apellido1 = 'null';
                            }
                            if ($mediador_terceros['apellido2'] != null && $mediador_terceros['apellido2'] != '') {
                                $apellido2 = '"' . $mediador_terceros['apellido2'] . '"';
                            } else {
                                $apellido2 = 'null';
                            }

                            /* CONSULTAR AGENCIA Y AMBIENTE */
                            $empresa = $this->_modelo->Consultar_ambientes();
                            $opcion_mediador = array(
                                'http' =>
                                array(
                                    'method' => 'POST',
                                    'header' => "Content-Type:application/json\r\n" .
                                        "Authorization:21b2e5c191e46165607c23cc48779c61e08972d5\r\n" .
                                        "TOKEN:" . $token_autentica . "",
                                    'content' => '{' .
                                        '"cod_tipdoc":' . '"' . $td . '"' . "," .
                                        '"cod_activi":' . 18 . "," .
                                        '"cod_tercer":' . $mediador_terceros['numero_documento'] . "," .
                                        '"num_verifi":' . $mediador_terceros['digito_verificacion'] . "," .
                                        '"nom_tercer":' . '"' . trim($mediador_terceros['nombre']) . '"' . "," .
                                        '"nom_apell1":' . '' . trim($apellido1) . '' . "," .
                                        '"nom_apell2":' . '' . trim($apellido2) . '' . "," .
                                        '"abr_tercer":' . '"' . trim($abreviatura) . '"' . "," .
                                        '"num_telef1":' . $telefono_fijo . "," .
                                        '"num_telmov":' . $mediador_terceros['celular'] . "," .
                                        '"dir_tercer":' . '"' . $mediador_terceros['direccion'] . '"' . "," .
                                        '"dir_emailx":' . '' . $email . '' . "," .
                                        '"cod_ciudad":' . $mediador_terceros['rndc_codigo_ciudad']
                                        . '}'
                                )
                            );
                            $cadena_oet = json_encode($opcion_mediador);
                            $identificador = 'Poseedor';
                            $agencia_id = $empresa['empresa_id'];
                            $documento = $mediador_terceros['numero_documento'];
                            $p2 = 2;
                        }
                        if ($recurso_oet[$i] == '4') { //conductor
                            $recurso_oet = 4;
                            $mediador_terceros = $this->_modelo->Datos_Tercero($recurso_oet, $datorecurso);
                            $td;
                            $telefono_fijo;
                            $abreviatura;
                            $email;
                            $apellido1;
                            $genero = "";
                            $parent = "";
                            $catlicen = "";
                            $sangre = "";
                            if ($mediador_terceros["tipo_documento"] == 'Cedula de Ciudadania') {
                                $td = 'C';
                            }
                            if ($mediador_terceros["tipo_documento"] == 'Cedula de Extranjeria') {
                                $td = 'E';
                            }
                            if ($mediador_terceros['contacto'] != null && $mediador_terceros['contacto'] != '') {
                                $telefono_fijo = $mediador_terceros['contacto'];
                            } else {
                                $telefono_fijo = 'null';
                            }
                            if ($mediador_terceros['abreviatura'] != null && $mediador_terceros['abreviatura'] != '') {
                                $abreviatura = '"' . $mediador_terceros['abreviatura'] . '"';
                            } else {
                                $abreviatura = '"' . $mediador_terceros['nombre'] . ' ' . $mediador_terceros['apellido1'] . '"';
                            }
                            if ($mediador_terceros['email'] != null && $mediador_terceros['email'] != '') {
                                $email = '"' . $mediador_terceros['email'] . '"';
                            } else {
                                $email = 'null';
                            }
                            if ($mediador_terceros['apellido2'] != null && $mediador_terceros['apellido2'] != '') {
                                $apellido2 = '"' . $mediador_terceros['apellido2'] . '"';
                            } else {
                                $apellido2 = 'null';
                            }
                            if ($mediador_terceros['sexo'] == 'Masculino') {
                                $genero = 1;
                            } else if ($mediador_terceros['sexo'] == 'Femenino') {
                                $genero = 2;
                            }
                            if ($mediador_terceros['parentezco'] == 1) {
                                $parent = '"Amigo"';
                            } else if ($mediador_terceros['parentezco'] == 2) {
                                $parent = '"Hermano"';
                            } else if ($mediador_terceros['parentezco'] == 3) {
                                $parent = '"Padre"';
                            } else if ($mediador_terceros['parentezco'] == 4) {
                                $parent = '"Madre"';
                            } else if ($mediador_terceros['parentezco'] == 5) {
                                $parent = '"Tio"';
                            } else if ($mediador_terceros['parentezco'] == 6) {
                                $parent = '"Sobrino"';
                            } else if ($mediador_terceros['parentezco'] == 7) {
                                $parent = '"Hijo"';
                            } else if ($mediador_terceros['parentezco'] == 8) {
                                $parent = '"Esposo"';
                            }
                            if ($mediador_terceros['rndc_categoria_licencia'] == '4') {
                                $catlicen = '4';
                            } else if ($mediador_terceros['rndc_categoria_licencia'] == '5') {
                                $catlicen = '5';
                            } else if ($mediador_terceros['rndc_categoria_licencia'] == '6') {
                                $catlicen = '6';
                            } else if ($mediador_terceros['rndc_categoria_licencia'] == 'C1') {
                                $catlicen = '7';
                            } else if ($mediador_terceros['rndc_categoria_licencia'] == 'C2') {
                                $catlicen = '8';
                            } else if ($mediador_terceros['rndc_categoria_licencia'] == 'C3') {
                                $catlicen = '9';
                            }
                            $fec1 = $mediador_terceros['rndc_vencimiento_licencia'];
                            $timestamp = strtotime($fec1);
                            $fecha_vencimiento = date("Y-m-d", $timestamp);
                            if ($mediador_terceros['grupo_sanguineo'] == 'O-') {
                                $sangre = "O (-)";
                            } else if ($mediador_terceros['grupo_sanguineo'] == 'O+') {
                                $sangre = "O (+)";
                            } else if ($mediador_terceros['grupo_sanguineo'] == 'A+') {
                                $sangre = "A (+)";
                            } else if ($mediador_terceros['grupo_sanguineo'] == 'A-') {
                                $sangre = "A (-)";
                            } else if ($mediador_terceros['grupo_sanguineo'] == 'B+') {
                                $sangre = "B (+)";
                            } else if ($mediador_terceros['grupo_sanguineo'] == 'B-') {
                                $sangre = "B (-)";
                            } else if ($mediador_terceros['grupo_sanguineo'] == 'AB+') {
                                $sangre = "AB (+)";
                            } else if ($mediador_terceros['grupo_sanguineo'] == 'AB-') {
                                $sangre = "AB (-)";
                            }
                            /* CONSULTAR AGENCIA Y AMBIENTE */
                            $empresa = $this->_modelo->Consultar_ambientes();
                            $opcion_mediador = array(
                                'http' =>
                                array(
                                    'method' => 'POST',
                                    'header' => "Content-Type:application/json\r\n" .
                                        "Authorization:21b2e5c191e46165607c23cc48779c61e08972d5\r\n" .
                                        "TOKEN:" . $token_autentica . "\r\n",
                                    'content' =>
                                    '{' .
                                        '"cod_tipdoc":' . '"' . $td . '"' . "," .
                                        '"cod_activi":' . 16 . "," .
                                        '"cod_tercer":' . $mediador_terceros['numero_documento'] . "," .
                                        '"num_verifi":' . $mediador_terceros['digito_verificacion'] . "," .
                                        '"nom_tercer":' . '"' . trim($mediador_terceros['nombre']) . '"' . "," .
                                        '"nom_apell1":' . '"' . trim($mediador_terceros['apellido1']) . '"' . "," .
                                        '"nom_apell2":' . '' . trim($apellido2) . '' . "," .
                                        '"abr_tercer":' . '' . trim($abreviatura) . '' . "," .
                                        '"num_telef1":' . $telefono_fijo . "," .
                                        '"num_telmov":' . $mediador_terceros['celular'] . "," .
                                        '"dir_tercer":' . '"' . $mediador_terceros['direccion'] . '"' . "," .
                                        '"dir_emailx":' . '' . $email . '' . "," .
                                        '"cod_ciudad":' . $mediador_terceros['rndc_codigo_ciudad'] . "," .
                                        '"fec_nacimi":' . '"' . $mediador_terceros['fecha_nacimiento'] . '"' . "," .
                                        '"cod_grupsa":' . '"' . $sangre . '"' . "," .
                                        '"cod_genero":' . '"' . $genero . '"' . "," .
                                        '"num_catlic":' . '' . $catlicen . '' . "," .
                                        '"num_licenc":' . '"' . $mediador_terceros['rndc_numero_licencia'] . '"' . "," .
                                        '"fec_venlic":' . '"' . $fecha_vencimiento . '"' . "," .
                                        '"dat_refemp":[{' .
                                        '"nom_empres":' . '"' . trim($mediador_terceros['nombre_empresa']) . '"' . "," .
                                        '"fec_ingres":' . '"' . $mediador_terceros['fecha_ingreso'] . '"' . "," .
                                        '"fec_retiro":' . '"' . $mediador_terceros['fecha_retiro'] . '"' . "," .
                                        '"nom_contac":' . '"' . trim($mediador_terceros['persona_contacto']) . '"' . "," .
                                        '"tel_contac":' . $mediador_terceros['celular'] . "," .
                                        '"car_contac":' . '"' . trim($mediador_terceros['cargo']) . '"' . "," .
                                        '"num_atigue":' . $mediador_terceros['antiguedad'] . '}]' . "," .
                                        '"dat_refper":[{' .
                                        '"nom_refper":' . '"' . trim($mediador_terceros['nombre_personal']) . '"' . "," .
                                        '"nom_parntc":' . '' . $parent . '' . "," .
                                        '"tel_refper":' . $mediador_terceros['tel_personal'] . '}]}'
                                )
                            );
                            $cadena_oet = json_encode($opcion_mediador);
                            $identificador = 'Conductor';
                            $agencia_id = $empresa['empresa_id'];
                            $documento = $mediador_terceros['numero_documento'];
                            $p3 = 2;
                        }
                    }
                    if ($longitud == 1) {
                        $respuesta = '';
                        $estado = 0;
                        if ($p1 == 1) {
                            $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                        } else if ($p1 == 2) {
                            $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                        }

                        if ($p2 == 1) {
                            $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                        } else if ($p2 == 2) {
                            $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                        }

                        if ($p3 == 1) {
                            $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                        } else if ($p3 == 2) {
                            $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                        }
                    } else {
                        //combinaciones para retornar mensaje 
                        $respuesta = '';
                        $estado = 0;
                        if ($longitud == 3) {
                            if ($p3 == 1 && $p2 == 1 && $p1 == 1) { //todas las actividades
                                $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                            } else {
                                $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                            }
                        }
                        if ($longitud == 2) {
                            if ($p3 == 1 && $p2 == 1) { //conductor - poseedor
                                $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                            } else if ($p3 == 2 && $p2 == 2) {
                                $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                            }
                            if ($p3 == 1 && $p1 == 1) { //conductor - propietario
                                $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                            } else if ($p3 == 2 && $p1 == 2) {
                                $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                            }

                            if ($p2 == 1 && $p1 == 1) { //poseedor - propietario
                                $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                            } else if ($p2 == 2 && $p1 == 2) {
                                $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                            }
                        }
                    }
                }
            }
            if ($clase == 2) {
                if ($recurso == 6 || $recurso == 7) {
                    $mediador_terceros = $this->_modelo->Datos_Tercero($recurso, $datorecurso);
                    $peso_vacio = (($mediador_terceros['peso']) / (1000));
                    $capacidad = (($mediador_terceros['capacidad_tn']) / (1000));
                    $peso_vacio = round($peso_vacio, 2);
                    $capacidad = round($capacidad, 2);
                    $nit_asegura = substr($mediador_terceros['rndc_aseguradora'], 0, -1);
                    if ($mediador_terceros['tipo_vinculacion'] == 'Tercero') {
                        $vinculacion = 'Terceros';
                    } else if ($mediador_terceros['tipo_vinculacion'] == 'Propio') {
                        $vinculacion = 'Propio';
                    }
                    if ($mediador_terceros['rndc_aseguradora'] != null) {
                        $nit_asegura = substr($mediador_terceros['rndc_aseguradora'], 0, -1);
                    } else {
                        $nit_asegura = 'null';
                    }
                    if ($mediador_terceros['nit'] != null) { //GPS
                        $nit_gps = 'null';
                    } else {
                        $nit_gps = 'null';
                    }
                    if ($mediador_terceros['usuario_satelital'] != null) {
                        $user_sate = '"' . $mediador_terceros['usuario_satelital'] . '"';
                    } else {
                        $user_sate = 'null';
                    }
                    if ($mediador_terceros['clave_satelital'] != null) {
                        $clave_gps = '"' . $mediador_terceros['clave_satelital'] . '"';
                    } else {
                        $clave_gps = 'null';
                    }
                    if ($mediador_terceros['num_soat'] != null) {
                        //$soat='"'.$mediador_terceros['num_soat'].'"';
                        $soat = 'null';
                    } else {
                        $soat = 'null';
                    }
                    if ($mediador_terceros['vence_soat'] != null) {
                        //$vence_soat='"'.$mediador_terceros['vence_soat'].'"';
                        $vence_soat = 'null';
                    } else {
                        $vence_soat = 'null';
                    }
                    //combustible
                    if ($mediador_terceros['cod_tipo_combustible'] == 12) {
                        $combustible = 2;
                    } else if ($mediador_terceros['cod_tipo_combustible'] == 1) {
                        $combustible = 1;
                    } else if ($mediador_terceros['cod_tipo_combustible'] == 2) {
                        $combustible = 3;
                    } else if ($mediador_terceros['cod_tipo_combustible'] == 3) {
                        $combustible = 4;
                    } else if ($mediador_terceros['cod_tipo_combustible'] == 5) {
                        $combustible = 5;
                    }
                    //licencia transito
                    if ($mediador_terceros['licencia_transito'] != '' && $mediador_terceros['licencia_transito'] != null) {
                        $licencia = $mediador_terceros['licencia_transito'];
                    } else {
                        $licencia = '""';
                    }
                    if ($mediador_terceros['rndc_configuracion'] == 'CA') {
                        $configurar = '2CA';
                    } else {
                        $configurar = $mediador_terceros['rndc_configuracion'];
                    }
                    if ($mediador_terceros['clase_vehiculo'] == 1) { //automovil
                        $clase = 1;
                    } else if ($mediador_terceros['clase_vehiculo'] == 2) { //bus
                        $clase = 1;
                    } else if ($mediador_terceros['clase_vehiculo'] == 3) { //buseta
                        $clase = 1;
                    } else if ($mediador_terceros['clase_vehiculo'] == 4) { //camion
                        $clase = 28;
                    } else if ($mediador_terceros['clase_vehiculo'] == 5) { //camioneta
                        $clase = 8;
                    } else if ($mediador_terceros['clase_vehiculo'] == 6) { //campero
                        $clase = 1;
                    } else if ($mediador_terceros['clase_vehiculo'] == 7) { //microbus
                        $clase = 1;
                    } else if ($mediador_terceros['clase_vehiculo'] == 8) { //tractocamion
                        $clase = 3;
                    } else if ($mediador_terceros['clase_vehiculo'] == 9) { //motocicleta
                        $clase = 1;
                    } else if ($mediador_terceros['clase_vehiculo'] == 10) { //motocarro
                        $clase = 1;
                    } else if ($mediador_terceros['clase_vehiculo'] == 11) { //mototriciclo
                        $clase = 1;
                    } else if ($mediador_terceros['clase_vehiculo'] == 12) { //cuatrimoto
                        $clase = 1;
                    } else if ($mediador_terceros['clase_vehiculo'] == 13) { //remolque
                        $clase = 14;
                    } else if ($mediador_terceros['clase_vehiculo'] == 14) { //SEMIREMOLQUE
                        $clase = 1;
                    } else if ($mediador_terceros['clase_vehiculo'] == 15) { //volqueta
                        $clase = 4;
                    } else if ($mediador_terceros['clase_vehiculo'] == 16) { //sin clase
                        $clase = 1;
                    } else if ($mediador_terceros['clase_vehiculo'] == 17) { //
                        $clase = 1;
                    } else if ($mediador_terceros['clase_vehiculo'] == 18) { //ciclomotor
                        $clase = 1;
                    } else if ($mediador_terceros['clase_vehiculo'] == 19) { //triccimotor
                        $clase = 1;
                    } else if ($mediador_terceros['clase_vehiculo'] == 20) { //cuadriciclo
                        $clase = 1;
                    }

                    /* CONSULTAR AGENCIA Y AMBIENTE */
                    $empresa = $this->_modelo->Consultar_ambientes();
                    $opcion_mediador = array(
                        'http' =>
                        array(
                            'method' => 'POST',
                            'header' => "Content-Type:application/json\r\n" .
                                "Authorization:21b2e5c191e46165607c23cc48779c61e08972d5\r\n" .
                                "TOKEN:" . $token_autentica . "\r\n",
                            'content' =>
                            '{' .
                                '"cod_tipdoc":' . '""' . "," .
                                '"num_placax":' . '"' . trim($mediador_terceros['placa']) . '"' . "," .
                                '"num_config":' . '"' . $configurar . '"' . "," .
                                '"cod_colorx":' . $mediador_terceros['id_color_avansat'] . "," .
                                '"cod_marcax":' . '"' . $mediador_terceros['id_marca_avansat'] . '"' . "," .
                                '"cod_lineax":' . '' . $mediador_terceros['id_linea_avansat'] . '' . "," .
                                '"cod_combus":' . '' . $combustible . '' . "," .
                                '"ano_modelo":' . $mediador_terceros['anio_fabricacion'] . "," .
                                '"cod_clasex":' . $clase . "," .
                                '"cod_carroc":' . $mediador_terceros['id_carroc_avansat'] . "," .
                                '"val_pesove":' . $peso_vacio . "," .
                                '"val_capaci":' . $capacidad . "," .
                                '"num_poliza":' . $soat . "," .
                                '"fec_vigfin":' . $vence_soat . "," .
                                '"cod_asesoa":' . $nit_asegura . "," .
                                '"num_agases":' . '"' . $mediador_terceros['tecnomecanica'] . '"' . "," .
                                '"fec_revmec":' . '"' . $mediador_terceros['tecno_fecha_vigencia'] . '"' . "," .
                                '"fec_vengas":' . '"' . $mediador_terceros['tecno_fecha_vigencia'] . '"' . "," .
                                '"cod_opegps":' . $nit_gps . "," .
                                '"usr_gpsxxx":' . $user_sate . "," .
                                '"clv_gpsxxx":' . $clave_gps . "," .
                                '"fec_mangps":' . '"' . $mediador_terceros['fecha_mant_gps'] . '"' . "," .
                                '"num_motorx":' . '"' . $mediador_terceros['num_motor'] . '"' . "," .
                                '"num_chasis":' . '"' . $mediador_terceros['num_chasis'] . '"' . "," .
                                '"num_polirc":' . '"' . $mediador_terceros['poliza_responsabilidad'] . '"' . "," .
                                '"fec_venprc":' . '"' . $mediador_terceros['vence_poliza'] . '"' . "," .
                                '"cod_tipveh":' . '"' . $vinculacion . '"' . "," .
                                '"num_licenc":' . '""' . "," .
                                '"cod_propie":' . $mediador_terceros['propietario'] . "," .
                                '"cod_tenedo":' . $mediador_terceros['poseedor'] . "," .
                                '"cod_conduc":' . $mediador_terceros['conductor'] . '}'
                        )
                    );
                    $documento = $mediador_terceros['placa'];
                    $cadena_oet = json_encode($opcion_mediador);
                    if (!isset($_SESSION['usuario']['nom_usuario'])) {
                        session_start();
                        $id_usuario = $_SESSION["usuario"]["nom_usuario"];
                    } else {
                        $id_usuario = $_SESSION["usuario"]["nom_usuario"];
                    }
                    $respuesta = '';
                    $estado = 0;
                    $identificador = 'Vehiculo';
                    $agencia_id = $empresa['id_agencia'];
                    $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                }
            }
            if ($clase == 3) {
                if ($recurso == 8 || $recurso == 9) {
                    $mediador_terceros = $this->_modelo->Datos_Tercero($recurso, $datorecurso);
                    $capacidad = (($mediador_terceros['capacidad']) / (1000));
                    if (isset($mediador_terceros['caracteristica'])) {
                        $observacion = '"' . trim($mediador_terceros['caracteristica']) . '"';
                        $observacion2 = $observacion;
                    } else {
                        $observacion2 = 'null';
                    }
                    if (isset($mediador_terceros['numero_civil'])) {
                        $num_poliza = '"' . $mediador_terceros['numero_civil'] . '"';
                    } else {
                        $num_poliza = 'null';
                    }
                    if (isset($mediador_terceros['rndc_aseguradora'])) {
                        $nit_asegura2 = substr($mediador_terceros['rndc_aseguradora'], 0, -1);
                        $nit_asegura = '' . $nit_asegura2 . '';
                    } else {
                        $nit_asegura = 'null';
                    }
                    if (isset($mediador_terceros['fecha_vence'])) {
                        $fecha_vence = '"' . $mediador_terceros['fecha_vence'] . '"';
                    } else {
                        $fecha_vence = 'null';
                    }
                    /* CONSULTAR AGENCIA Y AMBIENTE */
                    $empresa = $this->_modelo->Consultar_ambientes();
                    $opcion_mediador = array(
                        'http' =>
                        array(
                            'method' => 'POST',
                            'header' => "Content-Type:application/json\r\n" .
                                "Authorization:21b2e5c191e46165607c23cc48779c61e08972d5\r\n" .
                                "TOKEN:" . $token_autentica . "\r\n",
                            'timeout' => 60,
                            'content' =>
                            '{' .
                                '"num_trayle":' . '"' . trim($mediador_terceros['placa']) . '"' . "," .
                                '"cod_marcax":' . $mediador_terceros['id_avansat'] . "," .
                                '"tra_pesoxx":' . $mediador_terceros['peso_vacio'] . "," .
                                '"tra_volpos":' . $mediador_terceros['volumen'] . "," .
                                '"tip_tramit":' . $mediador_terceros['tipo_tramite'] . "," .
                                '"ser_chasis":' . '"' . $mediador_terceros['serie_chasis'] . '"' . "," .
                                '"cod_config":' . '"' . $mediador_terceros['rndc_configuacion'] . '"' . "," .
                                '"ano_modelo":' . $mediador_terceros['modelo'] . "," .
                                '"tra_altoxx":' . $mediador_terceros['alto'] . "," .
                                '"tra_largox":' . $mediador_terceros['largo'] . "," .
                                '"tra_anchox":' . $mediador_terceros['ancho'] . "," .
                                '"tra_capaci":' . $capacidad . "," .
                                '"cod_carroc":' . $mediador_terceros['rndc_carroceria'] . "," .
                                '"obs_remolq":' . $observacion2 . "," .
                                '"cod_propie":' . $mediador_terceros['numero_documento'] . "," .
                                '"num_respon":' . $num_poliza . "," .
                                '"cod_aseres":' . $nit_asegura . "," .
                                '"fec_vigres":' . $fecha_vence . '}'
                        )
                    );
                    $documento = $mediador_terceros['placa'];
                    $cadena_oet = json_encode($opcion_mediador);
                    $identificador = 'Trailer';
                    if (!isset($_SESSION['usuario']['nom_usuario'])) {
                        session_start();
                        $id_usuario = $_SESSION["usuario"]["nom_usuario"];
                    } else {
                        $id_usuario = $_SESSION["usuario"]["nom_usuario"];
                    }
                    $estado = 0;
                    $respuesta = '';
                    $identificador = 'Trailer';
                    $agencia_id = $empresa['empresa_id'];
                    $log_avansat = $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                }
            }

            if ($clase == 4) {
                if ($recurso == 1) {
                    $mediador_documentos = $this->_modelo->Datos_Documento($recurso, $numero);
                    $uniser = '';
                    $tipo_documentor = '';
                    $precinto = '';
                    $agencia = '';
                    $tipo_documentod = '';
                    $fechaorden = ($mediador_documentos[0]['fecha_orden']);
                    //$fechaorden = ($mediador_documentos[0]['fecha_orden'] . ' ' . $mediador_documentos[0]['hora_orden']);
                    if ($mediador_documentos[0]['tipo_servicio_mer'] == 'Consolidado') {
                        $uniser = '2';
                    } else if ($mediador_documentos[0]['tipo_servicio_mer'] == 'Expreso') {
                        $uniser = '1';
                    }
                    //
                    if ($mediador_documentos[0]['td_rem'] == 'NIT') {
                        $tipo_documentor = 'N';
                    } else if ($mediador_documentos[0]['td_rem'] == 'Cedula de Ciudadania') {
                        $tipo_documentor = 'C';
                    } else if ($mediador_documentos[0]['td_rem'] == 'Cedula de Extranjeria') {
                        $tipo_documentor = 'E';
                    }
                    if ($mediador_documentos[0]['td_des'] == 'NIT') {
                        $tipo_documentod = 'N';
                    } else if ($mediador_documentos[0]['td_des'] == 'Cedula de Ciudadania') {
                        $tipo_documentod = 'C';
                    } else if ($mediador_documentos[0]['td_des'] == 'Cedula de Extranjeria') {
                        $tipo_documentod = 'E';
                    }
                    //precinto
                    if (isset($mediador_documentos[0]['tipo_precinto'])) {
                        if ($mediador_documentos[0]['tipo_precinto'] == 'Plastico') {
                            $precinto = 'null';
                        } else if ($mediador_documentos[0]['tipo_precinto'] == 'Metalico') {
                            $precinto = 'null';
                        } else if ($mediador_documentos[0]['tipo_precinto'] == 'Botella') {
                            $precinto = '2';
                        } else if ($mediador_documentos[0]['tipo_precinto'] == 'Correilla') {
                            $precinto = '3';
                        } else if ($mediador_documentos[0]['tipo_precinto'] == 'Adhesivo') {
                            $precinto = '1';
                        }
                    }
                    //Agencias
                    if ($mediador_documentos[0]['codigo'] == 'BOG') {
                        $agencia = 1;
                    } else if ($mediador_documentos[0]['codigo'] == 'CTG') {
                        $agencia = 2;
                    } else if ($mediador_documentos[0]['codigo'] == 'BAQ') {
                        $agencia = 13;
                    } else if ($mediador_documentos[0]['codigo'] == 'BUN') {
                        $agencia = 3;
                    }
                    //precintos
                    if ($mediador_documentos[0]['serie_precinto'] != '') {
                        $precinto = "{" .
                            '"num_precin":' . '"' . $mediador_documentos[0]['serie_precinto'] . '"' . "," .
                            '"tip_precin":' . $precinto .
                            "}";
                    } else {
                        $precinto = '';
                    }
                    //Tipo empaque
                    if ($mediador_documentos[0]['tipo_empaque'] == 1) { //Carga estibada
                        $empaque = 22;
                    } else if ($mediador_documentos[0]['tipo_empaque'] == 2) { //NA
                        $empaque = 20;
                    } else if ($mediador_documentos[0]['tipo_empaque'] == 3) { //Varios
                        $empaque = 19;
                    } else if ($mediador_documentos[0]['tipo_empaque'] == 4) { //granel solido
                        $empaque = 21;
                    } else if ($mediador_documentos[0]['tipo_empaque'] == 5) { //cilindros
                        $empaque = 17;
                    } else if ($mediador_documentos[0]['tipo_empaque'] == 6) { //bultos
                        $empaque = 4;
                    } else if ($mediador_documentos[0]['tipo_empaque'] == 7) { //granel liquido
                        $empaque = 13;
                    } else if ($mediador_documentos[0]['tipo_empaque'] == 8) { //contenedor 40 pies
                        $empaque = 16;
                    } else if ($mediador_documentos[0]['tipo_empaque'] == 9) { //contenedor 2 40 pies 
                        $empaque = 8;
                    } else if ($mediador_documentos[0]['tipo_empaque'] == 10) { //contenedor 20 pies
                        $empaque = 7;
                    } else if ($mediador_documentos[0]['tipo_empaque'] == 11) { //paquetes
                        $empaque = 12;
                    }
                    $valor_tarifa = '"' . $mediador_documentos[0]['ve_tarifacalculada'] . '"';
                    $tarifa = trim($valor_tarifa, ',');
                    $peso = $mediador_documentos[0]['ca_pesocargue'];
                    $tonelada = (($peso) * (0.001));
                    $resultado = $tonelada;
                    /* CONSULTAR AGENCIA Y AMBIENTE */
                    $empresa = $this->_modelo->Consultar_ambientes();
                    $opcion_mediador = array(
                        'http' =>
                        array(
                            'method' => 'POST',
                            'header' => "Content-Type:application/json\r\n" .
                                "Authorization:21b2e5c191e46165607c23cc48779c61e08972d5\r\n" .
                                "TOKEN:" . $token_autentica . "\r\n",
                            'content' =>
                            '{' .
                                '"fec_ordenx":' . '"' . $fechaorden . '"' . "," .
                                '"num_ordenx":' . $mediador_documentos[0]['id'] . "," .
                                '"cod_mercan":' . $mediador_documentos[0]['mercancia_avansat'] . "," .
                                '"cod_uniser":' . $uniser . "," .
                                '"cod_agenci":' . $agencia . "," .
                                '"cod_client":' . $mediador_documentos[0]['nit_cliente'] . "," .
                                '"dat_vehicu":' . "{" .
                                '"num_placax":' . '"' . $mediador_documentos[0]['placa'] . '"' . "," .
                                '"cod_conduc":' . $mediador_documentos[0]['documento_conductor'] . "," .
                                '"cod_propie":' . $mediador_documentos[0]['documento_propietario'] . "," .
                                '"cod_tenedo":' . $mediador_documentos[0]['documento_poseedor']
                                . "}," .
                                '"dat_remite":' . "{" .
                                '"cod_tipdoc":' . '"' . $tipo_documentor . '"' . "," .
                                '"num_docume":' . $mediador_documentos[0]['doc_rem'] . "," .
                                '"nom_remite":' . '"' . $mediador_documentos[0]['nom_rem'] . '"' . "," .
                                '"cod_ciudad":' . $mediador_documentos[0]['ciu_rem'] . "," .
                                '"tel_remite":' . $mediador_documentos[0]['tel_rem'] . "," .
                                '"dir_remite":' . '"' . $mediador_documentos[0]['dir_rem'] . '"'
                                . "}," .
                                '"dat_destin":' . "{" .
                                '"cod_tipdoc":' . '"' . $tipo_documentod . '"' . "," .
                                '"num_docume":' . $mediador_documentos[0]['num_des'] . "," .
                                '"nom_destin":' . '"' . $mediador_documentos[0]['nom_des'] . '"' . "," .
                                '"cod_ciudad":' . $mediador_documentos[0]['ciu_des'] . "," .
                                '"tel_destin":' . $mediador_documentos[0]['tel_des'] . "," .
                                '"dir_destin":' . '"' . $mediador_documentos[0]['dir_des'] . '"'
                                . "}," .
                                '"dat_precin":' . "[" . $precinto . "]," .
                                '"dat_genera":' . "{" .
                                '"cod_tipemp":' . $empaque . "," .
                                '"cod_uniemp":' . $mediador_documentos[0]['cantidad_empaque'] . "," .
                                '"val_volume":' . $mediador_documentos[0]['mer_volumen'] . "," .
                                '"val_pesoxx":' . $resultado . "," .
                                '"num_conte1":' . '"' . $mediador_documentos[0]['devol_numcont'] . '"' . "," .
                                '"num_conte2":' . '"' . $mediador_documentos[0]['mer_contenedor2'] . '"' . "," .
                                '"fec_citcar":' . '"' . $mediador_documentos[0]['fecha_estimada_entrega'] . '"' . "," .
                                '"obs_genera":' . '"' . $mediador_documentos[0]['ca_observacion'] . '"' .
                                "}," .
                                '"dat_tarifa":' . "{" .
                                '"fle_pagarx":' . $mediador_documentos[0]['ve_fletepactado'] . "," .
                                '"fle_cobrar":' . '"' . $tarifa . '"'
                                . "}" .
                                '}'
                        )
                    );
                    $cadena_oet = json_encode($opcion_mediador);
                    $documento = $mediador_documentos[0]['id'];
                    $identificador = 'Orden Cargue';
                    $agencia_id = $empresa['empresa_id'];
                    if (!isset($_SESSION['usuario']['nom_usuario'])) {
                        session_start();
                        $id_usuario = $_SESSION["usuario"]["nom_usuario"];
                    } else {
                        $id_usuario = $_SESSION["usuario"]["nom_usuario"];
                    }
                    $respuesta = '';
                    $estado = 0;
                    $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                }

                if ($recurso == 2) {
                    $mediador_documentos = $this->_modelo->Datos_Documento($recurso, $numero);
                    $recontado = '';
                    $reseguro = '';
                    $recontra = '';
                    $tiposer = '';
                    $fecha_remesa = '';
                    foreach ($mediador_documentos as $remesa_oet) {
                        $fecha_remesa = ($remesa_oet['fecha_creacion'] . ' ' . $remesa_oet['hora_remesa']);
                        if ($remesa_oet['remesa_contado'] == 1) {
                            $recontado = 1;
                        } else if ($remesa_oet['remesa_contado'] == 0) {
                            $recontado = 'null';
                        }
                        if ($remesa_oet['aplica_seguro'] == 1) {
                            $reseguro = 1;
                        } else if ($remesa_oet['aplica_seguro'] == 0) {
                            $reseguro = 'null';
                        }
                        if ($remesa_oet['remesa_contraentrega'] == 1) {
                            $recontra = 1;
                        } else if ($remesa_oet['remesa_contraentrega'] == 0) {
                            $recontra = 'null';
                        }
                        if ($remesa_oet['tipo_servicio_mer'] == 'Expreso') {
                            $tiposer = 1;
                        } else if ($remesa_oet['tipo_servicio_mer'] == 'Consolidado') {
                            $tiposer = 2;
                        }

                        /* CONSULTAR AGENCIA Y AMBIENTE */
                        $empresa = $this->_modelo->Consultar_ambientes();
                        $opcion_mediador = array(
                            'http' =>
                            array(
                                'method' => 'POST',
                                'header' => "Content-Type:application/json\r\n" .
                                    "Authorization:21b2e5c191e46165607c23cc48779c61e08972d5\r\n" .
                                    "TOKEN:" . $token_autentica . "\r\n",
                                'content' =>
                                '{' .
                                    '"fec_remesa":' . '"' . $fecha_remesa . '"' . "," .
                                    '"cod_remesa":' . $remesa_oet['num_remesa'] . "," .
                                    '"num_ordenx":' . $remesa_oet['id_orden_cargue'] . "," .
                                    '"rem_contad":' . $recontado . "," .
                                    '"rem_conent":' . $recontra . "," .
                                    '"val_declar":' . $remesa_oet['total_tarifa'] . "," .
                                    '"apl_seguro":' . $reseguro . "," .
                                    '"fec_cargue":' . '"' . $remesa_oet['fecha_cargue'] . ' ' . $remesa_oet['hora_cargue'] . '"' . "," .
                                    '"hor_cargue":' . '"' . $remesa_oet['horaspactocarga'] . ':' . $remesa_oet['minutospactocarga'] . '"' . "," .
                                    '"fec_descar":' . '"' . $remesa_oet['fecha_descargue'] . ' ' . $remesa_oet['hora_descarga'] . '"' . "," .
                                    '"hor_descar":' . '"' . $remesa_oet['horaspactodescargue'] . ':' . $remesa_oet['minutospactodescargue'] . '"' . "," .
                                    '"can_cargad":' . $remesa_oet['mer_cantidad'] . "," .
                                    '"cod_uniser":' . $tiposer . "," .
                                    '"cod_unimed":' . 1 . "," .
                                    '"val_factur":' . 10000 . "," .
                                    '"tip_operac":' . '"' . $remesa_oet['tipo_carga'] . '"' . "," .
                                    '"obs_remesa":' . '" "' .
                                    '}'
                            )
                        );
                        $cadena_oet = json_encode($opcion_mediador);
                        $documento = $mediador_documentos[0]['id'];
                        $identificador = 'Orden Cargue';
                        $agencia_id = $empresa['empresa_id'];
                        if (!isset($_SESSION['usuario']['nom_usuario'])) {
                            session_start();
                            $id_usuario = $_SESSION["usuario"]["nom_usuario"];
                        } else {
                            $id_usuario = $_SESSION["usuario"]["nom_usuario"];
                        }
                        $respuesta = '';
                        $estado = 0;
                        $log_avansat = $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                    }
                }

                if ($recurso == 3) {
                    $mediador_documentos = $this->_modelo->Datos_Documento($recurso, $numero);
                    //homologar
                    $tipoma = '';
                    $pagador = '';
                    $dpagador = '';
                    if ($mediador_documentos[0]['tipo_manifiesto'] == 1) {
                        $tipoma = 'G';
                    } else if ($mediador_documentos[0]['tipo_manifiesto'] == 2) {
                        $tipoma = 'P';
                    } else if ($mediador_documentos[0]['tipo_manifiesto'] == 8) {
                        $tipoma = 'I';
                    } else if ($mediador_documentos[0]['tipo_manifiesto'] == 3) {
                        $tipoma = 'W';
                    }
                    if ($mediador_documentos[0]['cargue_pagado'] == 1) {
                        $pagador = 'E';
                    } else if ($mediador_documentos[0]['cargue_pagado'] == 2) {
                        $pagador = 'D';
                    } else if ($mediador_documentos[0]['cargue_pagado'] == 3) {
                        $pagador = 'R';
                    } else if ($mediador_documentos[0]['cargue_pagado'] == 4) {
                        $pagador = 'C';
                    }
                    if ($mediador_documentos[0]['descargue_pagado'] == 1) {
                        $dpagador = 'E';
                    } else if ($mediador_documentos[0]['descargue_pagado'] == 2) {
                        $dpagador = 'D';
                    } else if ($mediador_documentos[0]['descargue_pagado'] == 3) {
                        $dpagador = 'R';
                    } else if ($mediador_documentos[0]['descargue_pagado'] == 4) {
                        $dpagador = 'C';
                    }
                    //homologar cifras
                    $flete = str_replace(',', '', $mediador_documentos[0]['valor_total_viaje']);
                    $retefuente = str_replace(',', '', $mediador_documentos[0]['retencion_fuente']);
                    $reteica = str_replace(',', '', $mediador_documentos[0]['rete_ica']);
                    $neto = str_replace(',', '', $mediador_documentos[0]['neto_pagar']);
                    //homologar remesas
                    $remesas_cantidad = $this->_modelo->Cant_Remesa($recurso, $numero);
                    $remesa_enviar = '';
                    $coma = '';
                    if ($remesas_cantidad) {
                        $contador = 0;
                        $remesa_enviar .= '"dat_remesa":[';
                        foreach ($remesas_cantidad as $valor_remesa) {
                            $contador++;
                            if ($contador > 1) {
                                $coma = ',';
                            }
                            $remesa_enviar .= $coma . '{"cod_remesa":"' . $valor_remesa['id_remesa'] . '","num_autori":"10257904"}';
                        }
                        $remesa_enviar .= ']}';
                    } else {
                        $remesa_enviar = '"dat_remesa":[]}';
                    }
                    $fec1 = ($mediador_documentos[0]['fecha_expedicion'] . ' ' . $mediador_documentos[0]['hora_expedicion']);
                    $fecha_expedicion = substr($fec1, 0, 16);
                    $trailer = null;
                    if ($mediador_documentos[0]['placa_trailer'] !== 'no') {
                        $trailer = '"' . $mediador_documentos[0]['placa_trailer'] . '"';
                    } else if ($mediador_documentos[0]['placa_trailer'] == 'no') {
                        $trailer = null;
                    }
                    $anticipo = null;
                    if ($mediador_documentos[0]['anticipo'] !== 'no') {
                        $anticipob = str_replace(',', '', $mediador_documentos[0]['anticipo']);
                        $anticipo = '"' . $anticipob . '"';
                    } else if ($mediador_documentos[0]['anticipo'] == 'no') {
                        $anticipo = null;
                    }

                    /* CONSULTAR AGENCIA Y AMBIENTE */
                    $empresa = $this->_modelo->Consultar_ambientes();
                    $opcion_mediador = array(
                        'http' =>
                        array(
                            'method' => 'POST',
                            'header' => "Content-Type:application/json\r\n" .
                                "Authorization:21b2e5c191e46165607c23cc48779c61e08972d5\r\n" .
                                "TOKEN:" . $token_autentica . "\r\n",
                            'content' =>
                            '{' .
                                '"cod_manifi":' . $mediador_documentos[0]['id'] . "," .
                                '"num_autori":' . '"10257904"' . "," .
                                '"num_placax":' . '"' . $mediador_documentos[0]['placa'] . '"' . "," .
                                '"cod_conduc":' . $mediador_documentos[0]['conductor_manifiesto'] . "," .
                                '"num_trayle":' . $trailer . "," .
                                '"fec_expedi":' . '"' . $fecha_expedicion . '"' . "," .
                                '"cod_tipman":' . '"' . $tipoma . '"' . "," .
                                '"cod_ciuori":' . $mediador_documentos[0]['origen'] . "," .
                                '"cod_ciudes":' . $mediador_documentos[0]['destino'] . "," .
                                '"cod_propie":' . '"' . $mediador_documentos[0]['nombre_propietario'] . '"' . "," .
                                '"cod_carpag":' . '"' . $pagador . '"' . "," .
                                '"cod_despag":' . '"' . $dpagador . '"' . "," .
                                '"obs_manif":' . '"' . $mediador_documentos[0]['observacion'] . '"' . "," .
                                '"dat_servic":' . '{' .
                                '"val_egreso":' . $anticipo . "," .
                                '"val_fletex":' . $flete . "," .
                                '"val_retefu":' . $retefuente . "," .
                                '"val_reteic":' . $reteica . "," .
                                '"val_netoxx":' . $neto . "," .
                                '"fec_pagoxx":' . '"' . $mediador_documentos[0]['fecha_pago'] . '"' . '}' . "," .
                                $remesa_enviar
                        )
                    );
                    $cadena_oet = json_encode($opcion_mediador);
                    if (!isset($_SESSION['usuario']['nom_usuario'])) {
                        session_start();
                        $id_usuario = $_SESSION["usuario"]["nom_usuario"];
                    } else {
                        $id_usuario = $_SESSION["usuario"]["nom_usuario"];
                    }
                    $identificador = 'Manifiesto';
                    $agencia_id = $empresa['empresa_id'];
                    $documento = $mediador_documentos[0]['id'];
                    $respuesta = '';
                    $estado = 0;
                    $log_avansat = $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                }
                if ($recurso == 4) {
                    $mediador_documentos = $this->_modelo->Datos_Documento($recurso, $numero);
                    /* CONSULTAR AGENCIA Y AMBIENTE */
                    $empresa = $this->_modelo->Consultar_ambientes();
                    $opcion_mediador = array(
                        'http' =>
                        array(
                            'method' => 'POST',
                            'header' => "Content-Type:application/json\r\n" .
                                "Authorization:21b2e5c191e46165607c23cc48779c61e08972d5\r\n" .
                                "TOKEN:" . $token_autentica . "\r\n",
                            'content' =>
                            '{' .
                                '"cod_manifi":' . $mediador_documentos[0]['id'] . "," .
                                '"fec_cumpli":' . '"' . $mediador_documentos[0]['fecha_expedicion'] . '"' . "," .
                                '"num_autori":' . '"10257904"' . "," .
                                '"can_multas":' . $mediador_documentos[0]['cantidad_multa'] . "," .
                                '"tar_multax":' . $mediador_documentos[0]['valor_multa'] . "," .
                                '"fec_estpag":' . '"' . $mediador_documentos[0]['fecha_pago'] . '"' . "," .
                                '"nom_agepag":' . '"Bogota"' . "," .
                                '"dat_cumpli":' . '[{' .
                                '"cod_remesa":' . '"' . $mediador_documentos[0]['id_remesa'] . '"' . "," .
                                '"fec_cargue":{' .
                                '"fec_llegad":' . '"' . $mediador_documentos[0]['fca_llegada'] . '"' . "," .
                                '"fec_entrad":' . '"' . $mediador_documentos[0]['fca_entrada'] . '"' . "," .
                                '"fec_salida":' . '"' . $mediador_documentos[0]['fca_salida'] . '"' . '},' .
                                '"fec_descar":{' .
                                '"fec_llegad":' . '"' . $mediador_documentos[0]['fdc_llegada'] . '"' . "," .
                                '"fec_entrad":' . '"' . $mediador_documentos[0]['fdc_entrada'] . '"' . "," .
                                '"fec_salida":' . '"' . $mediador_documentos[0]['fdc_salida'] . '"' . '}}]}'
                        )
                    );
                    $cadena_oet = json_encode($opcion_mediador);
                    if (!isset($_SESSION['usuario']['nom_usuario'])) {
                        session_start();
                        $id_usuario = $_SESSION["usuario"]["nom_usuario"];
                    } else {
                        $id_usuario = $_SESSION["usuario"]["nom_usuario"];
                    }
                    $identificador = 'Cumplido';
                    $agencia_id = $empresa['empresa_id'];
                    $documento = $mediador_documentos[0]['id'];
                    $respuesta = '';
                    $estado = 0;
                    $log_avansat = $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                }
            }
        }
    }

    public function Mediador_Tercero($clase, $recurso, $datorecurso, $datos_consulta, $token_autentica)
    {
        $existe_tercero = array_filter($datos_consulta);
        //print_r('RCURSITO'.$recurso);
        if ($clase == 1) {
            $decision = (empty($existe_tercero));
        } else {
            $decision = (empty($existe_tercero));
        }
        //if($decision){//
        if ($clase == 1) { //terceros	
            if ($recurso == 1) { //Es cliente
                if ($recurso == 1) { //clientes
                    $mediador_terceros = $this->_modelo->Datos_Tercero($recurso, $datorecurso);
                    //homologar datos
                    if ($mediador_terceros["tipo_documento"] == 'Juridico') {
                        $td = '';
                        $telefono_fijo = '';
                        $abreviatura = '';
                        $email = '';
                        $apellido1 = '';
                        $apellido2 = '';
                        $regimen = '';
                        $digito = '';
                        if ($mediador_terceros["tipo_documento"] == 'Natural') {
                            $td = 'C';
                            $apellido1 = 'null';
                            $apellido2 = 'null';
                            $digito = 0;
                        }
                        if ($mediador_terceros["tipo_documento"] == 'Juridico') {
                            $td = 'N';
                            $apellido1 = 'null';
                            $apellido2 = 'null';
                            $digito = $mediador_terceros['digito_verificacion'];
                        }
                        if ($mediador_terceros['telefono'] != null && $mediador_terceros['telefono'] != '') {
                            $telefono_fijo = $mediador_terceros['telefono'];
                        } else {
                            $telefono_fijo = 'null';
                        }
                        if ($mediador_terceros['email'] != null && $mediador_terceros['email'] != '') {
                            $email = '"' . $mediador_terceros['email'] . '"';
                        } else {
                            $email = 'null';
                        }
                        if ($mediador_terceros['regimen'] != null && $mediador_terceros['regimen'] != '') {
                            if ($mediador_terceros['regimen'] == 'Régimen Especial') {
                                $regimen = 5;
                            } else if ($mediador_terceros['regimen'] == 'Régimen Simplificado') {
                                $regimen = 7;
                            } else if ($mediador_terceros['regimen'] == 'Gran Contribuyente') {
                                $regimen = 3;
                            } else if ($mediador_terceros['regimen'] == 'Gran Contribuyente Autorretenedor') {
                                $regimen = 6;
                            } else if ($mediador_terceros['regimen'] == 'No responsable de IVA') {
                                $regimen = 2;
                            } else {
                                $regimen = 1;
                            }
                        } else {
                            $regimen = '';
                        }

                        if ($mediador_terceros['obligacion'] != null && $mediador_terceros['obligacion'] != '') {
                            if ($mediador_terceros['obligacion'] == 13) { //gran contribuyente
                                $obligacion = "O-13";
                            } else if ($mediador_terceros['obligacion'] == 15) { //autorretenedor
                                $obligacion = "O-15";
                            } else if ($mediador_terceros['obligacion'] == 23) { //agente de retencion iva
                                $obligacion = "O-23";
                            } else if ($mediador_terceros['obligacion'] == 47) { //regimen simple de tributacion
                                $obligacion = "O-47";
                            } else if ($mediador_terceros['obligacion'] == 49) { //noresponsable
                                $obligacion = "R-99-PN";
                            } else if ($mediador_terceros['obligacion'] == 48) {
                                $obligacion = "O-48";
                            }
                        } else {
                            $obligacion = "";
                        }
                        $ciiu = $mediador_terceros['ciiu_principal'];
                        /* CONSULTAR AGENCIA Y AMBIENTE */
                        $empresa = $this->_modelo->Consultar_ambientes();
                        if ($empresa['nombre_ambiente'] == "PRODUCCION") {
                            $autorizacion_ambiente = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
                            /* CONSULTAR LA URL DE CONEXION  */
                            $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                            if ($conexion) {
                                $url_consulta_med = $conexion['URL_CONSULTA_CLIENTE_PRINCIPAL'];

                                $opcion_mediador = array(
                                    'http' =>
                                    array(
                                        'method' => 'POST',
                                        'header' => "Content-Type:application/json\r\n" .
                                            "Authorization:" . $autorizacion_ambiente . "\r\n" .
                                            "TOKEN:" . $token_autentica . "\r\n",
                                        'content' =>
                                        '{' .
                                            '"cod_tipdoc":' . '"' . $td . '"' . "," .
                                            '"cod_tipter":' . '"' . $mediador_terceros['tipo_documento'] . '"' . "," .
                                            '"cod_terreg":' . $regimen . "," .
                                            '"cod_tercer":' . $mediador_terceros['documento'] . "," .
                                            '"num_verifi":' . $digito . "," .
                                            '"nom_tercer":' . '"' . trim($mediador_terceros['nombre']) . '"' . "," .
                                            '"nom_razsoc":' . '"' . trim($mediador_terceros['nombre']) . '"' . "," .
                                            '"cod_activi":' . 10 . "," .
                                            '"cod_ciiuxx":' . $ciiu . "," .
                                            '"cod_ciudad":' . $mediador_terceros['rndc_codigo_ciudad'] . "," .
                                            '"dir_tercer":' . '"' . $mediador_terceros['direccion'] . '"' . "," .
                                            '"num_telef1":' . $telefono_fijo . "," .
                                            '"num_telmov":' . $telefono_fijo . "," .
                                            '"dir_emailx":' . '' . $email . '' . "," .
                                            '"cod_obltri":' . '["' . $obligacion . '"]' . '}'
                                    )
                                );
                                // print_r($opcion_mediador);
                                $cadena_oet = json_encode($opcion_mediador);

                                $context_propietario = stream_context_create($opcion_mediador);
                                $consulta_med_prop = file_get_contents($url_consulta_med, false, $context_propietario);
                                $envio_mediador_prop = json_decode($consulta_med_prop, true);
                                //print_r($envio_mediador_prop);
                                if (!isset($_SESSION['usuario']['nom_usuario'])) {
                                    session_start();
                                    $id_usuario = $_SESSION["usuario"]["nom_usuario"];
                                } else {
                                    $id_usuario = $_SESSION["usuario"]["nom_usuario"];
                                }
                                $documento = $mediador_terceros['documento'];
                                $identificador = 'Cliente';
                                $agencia_id = $empresa['empresa_id'];
                                if ($envio_mediador_prop['data']['success'] == 1 || $envio_mediador_prop['data']['success'] == 'true') {
                                    $data['status'] = 'true';
                                    $data['error'] = '';
                                    $estado = 1;
                                    $respuesta = $envio_mediador_prop['data']['success'];
                                    echo json_encode($data);
                                    $log_avansat = $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                                } else if ($envio_mediador_prop['data']['success'] == 0 || $envio_mediador_prop['data']['success'] == 'false') {
                                    $data['status'] = 'false';
                                    $data['error'] = $envio_mediador_prop['data']['msgResp'];
                                    $estado = 0;
                                    $respuesta = $envio_mediador_prop['data']['msgResp'];
                                    echo json_encode($data);
                                    $log_avansat = $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                                }
                            } else {
                                echo "Error de conexion";
                            }
                        } else {
                            /* CONSULTAR LA URL DE CONEXION  */
                            $autorizacion_ambiente = '21b2e5c191e46165607c23cc48779c61e08972d5';
                            $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                            if ($conexion) {
                                $url_consulta_med = $conexion['URL_CONSULTA_CLIENTE_PRUEBA'];
                                $opcion_mediador = array(
                                    'http' =>
                                    array(
                                        'method' => 'POST',
                                        'header' => "Content-Type:application/json\r\n" .
                                            "Authorization:" . $autorizacion_ambiente . "\r\n" .
                                            "TOKEN:" . $token_autentica . "\r\n",
                                        'content' =>
                                        '{' .
                                            '"cod_tipdoc":' . '"' . $td . '"' . "," .
                                            '"cod_tipter":' . '"' . $mediador_terceros['tipo_documento'] . '"' . "," .
                                            '"cod_terreg":' . $regimen . "," .
                                            '"cod_tercer":' . $mediador_terceros['documento'] . "," .
                                            '"num_verifi":' . $digito . "," .
                                            '"nom_tercer":' . '"' . trim($mediador_terceros['nombre']) . '"' . "," .
                                            '"nom_razsoc":' . '"' . trim($mediador_terceros['nombre']) . '"' . "," .
                                            '"cod_activi":' . 10 . "," .
                                            '"cod_ciiuxx":' . $ciiu . "," .
                                            '"cod_ciudad":' . $mediador_terceros['rndc_codigo_ciudad'] . "," .
                                            '"dir_tercer":' . '"' . $mediador_terceros['direccion'] . '"' . "," .
                                            '"num_telef1":' . $telefono_fijo . "," .
                                            '"num_telmov":' . $telefono_fijo . "," .
                                            '"dir_emailx":' . '' . $email . '' . "," .
                                            '"cod_obltri":' . '["' . $obligacion . '"]' . '}'
                                    )
                                );
                                $cadena_oet = json_encode($opcion_mediador);
                                $context_propietario = stream_context_create($opcion_mediador);
                                $consulta_med_prop = file_get_contents($url_consulta_med, false, $context_propietario);
                                $envio_mediador_prop = json_decode($consulta_med_prop, true);
                                //print_r($envio_mediador_prop);
                                if (!isset($_SESSION['usuario']['nom_usuario'])) {
                                    session_start();
                                    $id_usuario = $_SESSION["usuario"]["nom_usuario"];
                                } else {
                                    $id_usuario = $_SESSION["usuario"]["nom_usuario"];
                                }
                                $documento = $mediador_terceros['documento'];
                                $identificador = 'Cliente';
                                $agencia_id = $empresa['empresa_id'];
                                if ($envio_mediador_prop['data']['success'] == 1 || $envio_mediador_prop['data']['success'] == 'true') {
                                    $data['status'] = 'true';
                                    $data['error'] = '';
                                    $estado = 1;
                                    $respuesta = $envio_mediador_prop['data']['success'];
                                    echo json_encode($data);
                                    $log_avansat = $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                                } else if ($envio_mediador_prop['data']['success'] == 0 || $envio_mediador_prop['data']['success'] == 'false') {
                                    $data['status'] = 'false';
                                    $data['error'] = $envio_mediador_prop['data']['msgResp'];
                                    $estado = 0;
                                    $respuesta = $envio_mediador_prop['data']['msgResp'];
                                    echo json_encode($data);
                                    $log_avansat = $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                                }
                            } else {
                                echo "Error de conexion a prueba";
                            }
                        }
                    }
                }
            } else { //No es Cliente
                $longitud = strlen($recurso);
                $p1 = 0;
                $p2 = 0;
                $p3 = 0;
                if (!isset($_SESSION['usuario']['nom_usuario'])) {
                    session_start();
                    $id_usuario = $_SESSION["usuario"]["nom_usuario"];
                } else {
                    $id_usuario = $_SESSION["usuario"]["nom_usuario"];
                }
                for ($i = 0; $i < $longitud; $i++) {
                    $recurso_oet = str_split($recurso);
                    if ($recurso_oet[$i] == "3") { //propietario
                        /* CONSULTAR AGENCIA Y AMBIENTE */
                        $empresa = $this->_modelo->Consultar_ambientes();
                        if ($empresa['nombre_ambiente'] == "PRODUCCION") {
                            $autorizacion_ambiente = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
                            /* CONSULTAR LA URL DE CONEXION  */
                            $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                            if ($conexion) {
                                $recurso_oet_consulta = 3;
                                $mediador_terceros = $this->_modelo->Datos_Tercero($recurso_oet_consulta, $datorecurso);
                                //homologar datos
                                $td = "";
                                $telefono_fijo = "";
                                $abreviatura = "";
                                $email = "";
                                $apellido1 = "";
                                $apellido2 = "";
                                $digito = "";
                                if ($mediador_terceros["tipo_documento"] == 'Cedula de Ciudadania') {
                                    $td = 'C';
                                    $abreviatura = ('"' . $mediador_terceros['nombre'] . ' ' . $mediador_terceros['apellido1'] . '"');
                                    $digito = 0;
                                }
                                if ($mediador_terceros["tipo_documento"] == 'Cedula de Extranjeria') {
                                    $td = 'E';
                                    $abreviatura = ('"' . $mediador_terceros['nombre'] . ' ' . $mediador_terceros['apellido1'] . '"');
                                    $digito = 0;
                                }
                                if ($mediador_terceros["tipo_documento"] == 'NIT') {
                                    $td = 'N';
                                    $abreviatura = ('"' . $mediador_terceros['nombre'] . '"');
                                    $digito = $mediador_terceros['digito_verificacion'];
                                }
                                if ($mediador_terceros['contacto'] != null && $mediador_terceros['contacto'] != '') {
                                    $telefono_fijo = $mediador_terceros['contacto'];
                                } else {
                                    $telefono_fijo = 'null';
                                }
                                if ($mediador_terceros['email'] != null && $mediador_terceros['email'] != '') {
                                    $email = '"' . $mediador_terceros['email'] . '"';
                                } else {
                                    $email = 'null';
                                }
                                if ($mediador_terceros['apellido1'] != null && $mediador_terceros['apellido1'] != '') {
                                    $apellido1 = '"' . $mediador_terceros['apellido1'] . '"';
                                } else {
                                    $apellido1 = 'null';
                                }
                                if ($mediador_terceros['apellido2'] != null && $mediador_terceros['apellido2'] != '') {
                                    $apellido2 = '"' . $mediador_terceros['apellido2'] . '"';
                                } else {
                                    $apellido2 = 'null';
                                }
                                //enviar datos a AVANSAT
                                $url_consulta_med = $conexion['URL_CONSULTA_PROPIETARIO_PRINCIPAL'];
                                $opcion_mediador = array(
                                    'http' =>
                                    array(
                                        'method' => 'POST',
                                        'header' => "Content-Type:application/json\r\n" .
                                            "Authorization:" . $autorizacion_ambiente . "\r\n" .
                                            "TOKEN:" . $token_autentica . "\r\n",
                                        'content' =>
                                        '{' .
                                            '"cod_tipdoc":' . '"' . $td . '"' . "," .
                                            '"cod_activi":' . 15 . "," .
                                            '"cod_tercer":' . $mediador_terceros['numero_documento'] . "," .
                                            '"num_verifi":' . $digito . "," .
                                            '"nom_tercer":' . '"' . trim($mediador_terceros['nombre']) . '"' . "," .
                                            '"nom_apell1":' . '' . trim($apellido1) . '' . "," .
                                            '"nom_apell2":' . '' . trim($apellido2) . '' . "," .
                                            '"abr_tercer":' . '' . trim($abreviatura) . '' . "," .
                                            '"num_telef1":' . $telefono_fijo . "," .
                                            '"num_telmov":' . $mediador_terceros['celular'] . "," .
                                            '"dir_tercer":' . '"' . $mediador_terceros['direccion'] . '"' . "," .
                                            '"dir_emailx":' . '' . $email . '' . "," .
                                            '"cod_ciudad":' . $mediador_terceros['rndc_codigo_ciudad']
                                            . '}'
                                    )
                                );
                                //print_r($opcion_mediador);
                                $context_propietario = stream_context_create($opcion_mediador);
                                $consulta_med_prop = file_get_contents($url_consulta_med, false, $context_propietario);
                                $envio_mediador_prop = json_decode($consulta_med_prop, true);
                                $documento = $mediador_terceros['numero_documento'];
                                $cadena_oet = json_encode($opcion_mediador);
                                $identificador = 'Propietario';
                                $agencia_id = $empresa['empresa_id'];
                                if ($envio_mediador_prop['data']['success'] == 1 || $envio_mediador_prop['data']['success'] == 'true') {
                                    $p1 = 1;
                                    $respuesta = $envio_mediador_prop['data']['success'];
                                    $estado = 1;
                                } else if ($envio_mediador_prop['data']['success'] == 0 || $envio_mediador_prop['data']['success'] == 'false') {
                                    $p1 = 2;
                                    $respuesta = $envio_mediador_prop['data']['msgResp'];
                                    $estado = 0;
                                }
                            } else {
                                echo "Error de conexion";
                            }
                        } else {
                            /* CONSULTAR LA URL DE CONEXION  */
                            $autorizacion_ambiente = '21b2e5c191e46165607c23cc48779c61e08972d5';
                            $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                            if ($conexion) {
                                $recurso_oet_consulta = 3;
                                $mediador_terceros = $this->_modelo->Datos_Tercero($recurso_oet_consulta, $datorecurso);
                                //homologar datos
                                $td = "";
                                $telefono_fijo = "";
                                $abreviatura = "";
                                $email = "";
                                $apellido1 = "";
                                $apellido2 = "";
                                $digito = "";
                                if ($mediador_terceros["tipo_documento"] == 'Cedula de Ciudadania') {
                                    $td = 'C';
                                    $abreviatura = ('"' . $mediador_terceros['nombre'] . ' ' . $mediador_terceros['apellido1'] . '"');
                                    $digito = 0;
                                }
                                if ($mediador_terceros["tipo_documento"] == 'Cedula de Extranjeria') {
                                    $td = 'E';
                                    $abreviatura = ('"' . $mediador_terceros['nombre'] . ' ' . $mediador_terceros['apellido1'] . '"');
                                    $digito = 0;
                                }
                                if ($mediador_terceros["tipo_documento"] == 'NIT') {
                                    $td = 'N';
                                    $abreviatura = ('"' . $mediador_terceros['nombre'] . '"');
                                    $digito = $mediador_terceros['digito_verificacion'];
                                }
                                if ($mediador_terceros['contacto'] != null && $mediador_terceros['contacto'] != '') {
                                    $telefono_fijo = $mediador_terceros['contacto'];
                                } else {
                                    $telefono_fijo = 'null';
                                }
                                if ($mediador_terceros['email'] != null && $mediador_terceros['email'] != '') {
                                    $email = '"' . $mediador_terceros['email'] . '"';
                                } else {
                                    $email = 'null';
                                }
                                if ($mediador_terceros['apellido1'] != null && $mediador_terceros['apellido1'] != '') {
                                    $apellido1 = '"' . $mediador_terceros['apellido1'] . '"';
                                } else {
                                    $apellido1 = 'null';
                                }
                                if ($mediador_terceros['apellido2'] != null && $mediador_terceros['apellido2'] != '') {
                                    $apellido2 = '"' . $mediador_terceros['apellido2'] . '"';
                                } else {
                                    $apellido2 = 'null';
                                }
                                //enviar datos a AVANSAT
                                // $url_consulta_med = "https://oet-qa.intrared.net:8083/ap/nexos/api_tms/index.php/api/mediator";
                                $url_consulta_med = $conexion['URL_CONSULTA_PROPIETARIO_PRUEBA'];
                                $opcion_mediador = array(
                                    'http' =>
                                    array(
                                        'method' => 'POST',
                                        'header' => "Content-Type:application/json\r\n" .
                                            "Authorization:" . $autorizacion_ambiente . "\r\n" .
                                            "TOKEN:" . $token_autentica . "\r\n",
                                        'content' =>
                                        '{' .
                                            '"cod_tipdoc":' . '"' . $td . '"' . "," .
                                            // '"cod_activi":' . 15 . "," .
                                            '"cod_tercer":' . $mediador_terceros['numero_documento'] . "," .
                                            '"num_verifi":' . $digito . "," .
                                            '"nom_tercer":' . '"' . trim($mediador_terceros['nombre']) . '"' . "," .
                                            '"nom_apell1":' . '' . trim($apellido1) . '' . "," .
                                            '"nom_apell2":' . '' . trim($apellido2) . '' . "," .
                                            '"abr_tercer":' . '' . trim($abreviatura) . '' . "," .
                                            '"num_telef1":' . $telefono_fijo . "," .
                                            '"num_telmov":' . $mediador_terceros['celular'] . "," .
                                            '"dir_tercer":' . '"' . $mediador_terceros['direccion'] . '"' . "," .
                                            '"dir_emailx":' . '' . $email . '' . "," .
                                            '"cod_ciudad":' . $mediador_terceros['rndc_codigo_ciudad']
                                            . '}'
                                    )
                                );
                                //print_r($opcion_mediador);
                                $context_propietario = stream_context_create($opcion_mediador);
                                $consulta_med_prop = file_get_contents($url_consulta_med, false, $context_propietario);
                                $envio_mediador_prop = json_decode($consulta_med_prop, true);
                                $documento = $mediador_terceros['numero_documento'];
                                $cadena_oet = json_encode($opcion_mediador);
                                $identificador = 'Propietario';
                                $agencia_id = $empresa['empresa_id'];
                                if ($envio_mediador_prop['data']['success'] == 1 || $envio_mediador_prop['data']['success'] == 'true') {
                                    $p1 = 1;
                                    $respuesta = $envio_mediador_prop['data']['msgResp'];
                                    $estado = 1;
                                } else if ($envio_mediador_prop['data']['success'] == 0 || $envio_mediador_prop['data']['success'] == 'false') {
                                    $p1 = 2;
                                    $respuesta = $envio_mediador_prop['data']['msgResp'];
                                    $estado = 0;
                                }
                            } else {
                                echo "Error de conexion prueba";
                            }
                        }
                    }

                    if ($recurso_oet[$i] == '5') { //poseedor
                        /* CONSULTAR AGENCIA Y AMBIENTE */
                        $empresa = $this->_modelo->Consultar_ambientes();
                        if ($empresa['nombre_ambiente'] == "PRODUCCION") {
                            $autorizacion_ambiente = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
                            /* CONSULTAR LA URL DE CONEXION  */
                            $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                            if ($conexion) {
                                $recurso_oet_consulta = 5;
                                $mediador_terceros = $this->_modelo->Datos_Tercero($recurso_oet_consulta, $datorecurso);
                                //homologar datos
                                $td = "";
                                $telefono_fijo = "";
                                $abreviatura = "";
                                $email = "";
                                $abreviatura = "";
                                $apellido1 = "";
                                $apellido2 = "";
                                $digito = "";
                                if ($mediador_terceros["tipo_documento"] == 'Cedula de Ciudadania') {
                                    $td = 'C';
                                    $abreviatura = ($mediador_terceros['nombre'] . ' ' . $mediador_terceros['apellido1']);
                                    $digito = 0;
                                }
                                if ($mediador_terceros["tipo_documento"] == 'Cedula de Extranjeria') {
                                    $td = 'E';
                                    $abreviatura = ($mediador_terceros['nombre'] . ' ' . $mediador_terceros['apellido1']);
                                    $digito = 0;
                                }
                                if ($mediador_terceros["tipo_documento"] == 'NIT') {
                                    $td = 'N';
                                    $abreviatura = ($mediador_terceros['nombre']);
                                    $digito = $mediador_terceros['digito_verificacion'];
                                }
                                if ($mediador_terceros['contacto'] != null && $mediador_terceros['contacto'] != '') {
                                    $telefono_fijo = $mediador_terceros['contacto'];
                                } else {
                                    $telefono_fijo = 'null';
                                }
                                if ($mediador_terceros['email'] != null && $mediador_terceros['email'] != '') {
                                    $email = '"' . $mediador_terceros['email'] . '"';
                                } else {
                                    $email = 'null';
                                }
                                if ($mediador_terceros['apellido1'] != null && $mediador_terceros['apellido1'] != '') {
                                    $apellido1 = '"' . $mediador_terceros['apellido1'] . '"';
                                } else {
                                    $apellido1 = 'null';
                                }
                                if ($mediador_terceros['apellido2'] != null && $mediador_terceros['apellido2'] != '') {
                                    $apellido2 = '"' . $mediador_terceros['apellido2'] . '"';
                                } else {
                                    $apellido2 = 'null';
                                }
                                //enviar datos a AVANSAT
                                $url_consulta_med = $conexion['URL_CONSULTA_POSEEDOR_PRINCIPAL'];
                                $opcion_mediador = array(
                                    'http' =>
                                    array(
                                        'method' => 'POST',
                                        'header' => "Content-Type:application/json\r\n" .
                                            "Authorization:" . $autorizacion_ambiente . "\r\n" .
                                            "TOKEN:" . $token_autentica . "",
                                        'content' => '{' .
                                            '"cod_tipdoc":' . '"' . $td . '"' . "," .
                                            '"cod_activi":' . 18 . "," .
                                            '"cod_tercer":' . $mediador_terceros['numero_documento'] . "," .
                                            '"num_verifi":' . $digito . "," .
                                            '"nom_tercer":' . '"' . trim($mediador_terceros['nombre']) . '"' . "," .
                                            '"nom_apell1":' . '' . trim($apellido1) . '' . "," .
                                            '"nom_apell2":' . '' . trim($apellido2) . '' . "," .
                                            '"abr_tercer":' . '"' . trim($abreviatura) . '"' . "," .
                                            '"num_telef1":' . $telefono_fijo . "," .
                                            '"num_telmov":' . $mediador_terceros['celular'] . "," .
                                            '"dir_tercer":' . '"' . $mediador_terceros['direccion'] . '"' . "," .
                                            '"dir_emailx":' . '' . $email . '' . "," .
                                            '"cod_ciudad":' . $mediador_terceros['rndc_codigo_ciudad']
                                            . '}'
                                    )
                                );
                                //print_r($opcion_mediador);	
                                $context_propietario = stream_context_create($opcion_mediador);
                                $consulta_med_prop = file_get_contents($url_consulta_med, false, $context_propietario);
                                $envio_mediador_prose = json_decode($consulta_med_prop, true);
                                $documento = $mediador_terceros['numero_documento'];
                                $cadena_oet = json_encode($opcion_mediador);
                                $identificador = 'Poseedor';
                                $agencia_id = $empresa['empresa_id'];
                                if ($envio_mediador_prose['data']['success'] == 1 || $envio_mediador_prose['data']['success'] == 'true') {
                                    $p2 = 1;
                                    $respuesta = $envio_mediador_prose['data']['success'];
                                    $estado = 1;
                                } else if ($envio_mediador_prose['data']['success'] == 0 || $envio_mediador_prose['data']['success'] == 'false') {
                                    $p2 = 2;
                                    $respuesta = $envio_mediador_prose['data']['msgResp'];
                                    $estado = 0;
                                }
                            } else {
                                echo "Error de conexion principal";
                            }
                        } else {
                            /* CONSULTAR LA URL DE CONEXION  */
                            $autorizacion_ambiente = '21b2e5c191e46165607c23cc48779c61e08972d5';
                            $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                            if ($conexion) {
                                $recurso_oet_consulta = 5;
                                $mediador_terceros = $this->_modelo->Datos_Tercero($recurso_oet_consulta, $datorecurso);
                                //homologar datos
                                $td = "";
                                $telefono_fijo = "";
                                $abreviatura = "";
                                $email = "";
                                $abreviatura = "";
                                $apellido1 = "";
                                $apellido2 = "";
                                $digito = "";
                                if ($mediador_terceros["tipo_documento"] == 'Cedula de Ciudadania') {
                                    $td = 'C';
                                    $abreviatura = ($mediador_terceros['nombre'] . ' ' . $mediador_terceros['apellido1']);
                                    $digito = 0;
                                }
                                if ($mediador_terceros["tipo_documento"] == 'Cedula de Extranjeria') {
                                    $td = 'E';
                                    $abreviatura = ($mediador_terceros['nombre'] . ' ' . $mediador_terceros['apellido1']);
                                    $digito = 0;
                                }
                                if ($mediador_terceros["tipo_documento"] == 'NIT') {
                                    $td = 'N';
                                    $abreviatura = ($mediador_terceros['nombre']);
                                    $digito = $mediador_terceros['digito_verificacion'];
                                }
                                if ($mediador_terceros['contacto'] != null && $mediador_terceros['contacto'] != '') {
                                    $telefono_fijo = $mediador_terceros['contacto'];
                                } else {
                                    $telefono_fijo = 'null';
                                }
                                if ($mediador_terceros['email'] != null && $mediador_terceros['email'] != '') {
                                    $email = '"' . $mediador_terceros['email'] . '"';
                                } else {
                                    $email = 'null';
                                }
                                if ($mediador_terceros['apellido1'] != null && $mediador_terceros['apellido1'] != '') {
                                    $apellido1 = '"' . $mediador_terceros['apellido1'] . '"';
                                } else {
                                    $apellido1 = 'null';
                                }
                                if ($mediador_terceros['apellido2'] != null && $mediador_terceros['apellido2'] != '') {
                                    $apellido2 = '"' . $mediador_terceros['apellido2'] . '"';
                                } else {
                                    $apellido2 = 'null';
                                }
                                //enviar datos a AVANSAT
                                $url_consulta_med = $conexion['URL_CONSULTA_POSEEDOR_PRUEBA'];
                                $opcion_mediador = array(
                                    'http' =>
                                    array(
                                        'method' => 'POST',
                                        'header' => "Content-Type:application/json\r\n" .
                                            "Authorization:" . $autorizacion_ambiente . "\r\n" .
                                            "TOKEN:" . $token_autentica . "",
                                        'content' => '{' .
                                            '"cod_tipdoc":' . '"' . $td . '"' . "," .
                                            '"cod_activi":' . 18 . "," .
                                            '"cod_tercer":' . $mediador_terceros['numero_documento'] . "," .
                                            '"num_verifi":' . $digito . "," .
                                            '"nom_tercer":' . '"' . trim($mediador_terceros['nombre']) . '"' . "," .
                                            '"nom_apell1":' . '' . trim($apellido1) . '' . "," .
                                            '"nom_apell2":' . '' . trim($apellido2) . '' . "," .
                                            '"abr_tercer":' . '"' . trim($abreviatura) . '"' . "," .
                                            '"num_telef1":' . $telefono_fijo . "," .
                                            '"num_telmov":' . $mediador_terceros['celular'] . "," .
                                            '"dir_tercer":' . '"' . $mediador_terceros['direccion'] . '"' . "," .
                                            '"dir_emailx":' . '' . $email . '' . "," .
                                            '"cod_ciudad":' . $mediador_terceros['rndc_codigo_ciudad']
                                            . '}'
                                    )
                                );
                                //print_r($opcion_mediador);	
                                $context_propietario = stream_context_create($opcion_mediador);
                                $consulta_med_prop = file_get_contents($url_consulta_med, false, $context_propietario);
                                $envio_mediador_prose = json_decode($consulta_med_prop, true);
                                $documento = $mediador_terceros['numero_documento'];
                                $cadena_oet = json_encode($opcion_mediador);
                                $identificador = 'Poseedor';
                                $agencia_id = $empresa['empresa_id'];
                                if ($envio_mediador_prose['data']['success'] == 1 || $envio_mediador_prose['data']['success'] == 'true') {
                                    $p2 = 1;
                                    $respuesta = $envio_mediador_prose['data']['success'];
                                    $estado = 1;
                                } else if ($envio_mediador_prose['data']['success'] == 0 || $envio_mediador_prose['data']['success'] == 'false') {
                                    $p2 = 2;
                                    $respuesta = $envio_mediador_prose['data']['msgResp'];
                                    $estado = 0;
                                }
                            } else {
                                echo "Error de conexion prueba";
                            }
                        }
                    }

                    if ($recurso_oet[$i] == '4') { //conductor
                        /* CONSULTAR AGENCIA Y AMBIENTE */
                        $empresa = $this->_modelo->Consultar_ambientes();
                        if ($empresa['nombre_ambiente'] == "PRODUCCION") {
                            $autorizacion_ambiente = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
                            /* CONSULTAR LA URL DE CONEXION  */
                            $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                            if ($conexion) {
                                $recurso_oet_consulta = 4;
                                $mediador_terceros = $this->_modelo->Datos_Tercero($recurso_oet_consulta, $datorecurso);

                                //homologar datos
                                $td = "";
                                $telefono_fijo;
                                $abreviatura;
                                $email;
                                $apellido1;
                                $genero = "";
                                $parent = "";
                                $catlicen = "";
                                $sangre = "";
                                $digito = "";
                                if ($mediador_terceros["tipo_documento"] == 'Cedula de Ciudadania') {
                                    $td = 'C';
                                    $digito = 0;
                                }
                                if ($mediador_terceros["tipo_documento"] == 'Cedula de Extranjeria') {
                                    $td = 'E';
                                    $digito = 0;
                                }
                                if ($mediador_terceros['contacto'] != null && $mediador_terceros['contacto'] != '') {
                                    $telefono_fijo = $mediador_terceros['contacto'];
                                } else {
                                    $telefono_fijo = 'null';
                                }
                                if ($mediador_terceros['abreviatura'] != null && $mediador_terceros['abreviatura'] != '') {
                                    $abreviatura = '"' . $mediador_terceros['abreviatura'] . '"';
                                } else {
                                    $abreviatura = '"' . $mediador_terceros['nombre'] . ' ' . $mediador_terceros['apellido1'] . '"';
                                }
                                if ($mediador_terceros['email'] != null && $mediador_terceros['email'] != '') {
                                    $email = '"' . $mediador_terceros['email'] . '"';
                                } else {
                                    $email = 'null';
                                }
                                if ($mediador_terceros['apellido2'] != null && $mediador_terceros['apellido2'] != '') {
                                    $apellido2 = '"' . $mediador_terceros['apellido2'] . '"';
                                } else {
                                    $apellido2 = 'null';
                                }
                                if ($mediador_terceros['sexo'] == 'Masculino') {
                                    $genero = 1;
                                } else if ($mediador_terceros['sexo'] == 'Femenino') {
                                    $genero = 2;
                                }
                                if ($mediador_terceros['parentezco'] == 1) {
                                    $parent = '"Amigo"';
                                } else if ($mediador_terceros['parentezco'] == 2) {
                                    $parent = '"Hermano"';
                                } else if ($mediador_terceros['parentezco'] == 3) {
                                    $parent = '"Padre"';
                                } else if ($mediador_terceros['parentezco'] == 4) {
                                    $parent = '"Madre"';
                                } else if ($mediador_terceros['parentezco'] == 5) {
                                    $parent = '"Tio"';
                                } else if ($mediador_terceros['parentezco'] == 6) {
                                    $parent = '"Sobrino"';
                                } else if ($mediador_terceros['parentezco'] == 7) {
                                    $parent = '"Hijo"';
                                } else if ($mediador_terceros['parentezco'] == 8) {
                                    $parent = '"Esposo"';
                                }
                                if ($mediador_terceros['rndc_categoria_licencia'] == '4') {
                                    $catlicen = '4';
                                } else if ($mediador_terceros['rndc_categoria_licencia'] == '5') {
                                    $catlicen = '5';
                                } else if ($mediador_terceros['rndc_categoria_licencia'] == '6') {
                                    $catlicen = '6';
                                } else if ($mediador_terceros['rndc_categoria_licencia'] == 'C1') {
                                    $catlicen = '7';
                                } else if ($mediador_terceros['rndc_categoria_licencia'] == 'C2') {
                                    $catlicen = '8';
                                } else if ($mediador_terceros['rndc_categoria_licencia'] == 'C3') {
                                    $catlicen = '9';
                                }
                                $fec1 = $mediador_terceros['rndc_vencimiento_licencia'];
                                $timestamp = strtotime($fec1);
                                $fecha_vencimiento = date("Y-m-d", $timestamp);

                                if ($mediador_terceros['grupo_sanguineo'] == 'O-') {
                                    $sangre = "O (-)";
                                } else if ($mediador_terceros['grupo_sanguineo'] == 'O+') {
                                    $sangre = "O (+)";
                                } else if ($mediador_terceros['grupo_sanguineo'] == 'A+') {
                                    $sangre = "A (+)";
                                } else if ($mediador_terceros['grupo_sanguineo'] == 'A-') {
                                    $sangre = "A (-)";
                                } else if ($mediador_terceros['grupo_sanguineo'] == 'B+') {
                                    $sangre = "B (+)";
                                } else if ($mediador_terceros['grupo_sanguineo'] == 'B-') {
                                    $sangre = "B (-)";
                                } else if ($mediador_terceros['grupo_sanguineo'] == 'AB+') {
                                    $sangre = "AB (+)";
                                } else if ($mediador_terceros['grupo_sanguineo'] == 'AB-') {
                                    $sangre = "AB (-)";
                                }
                                if ($mediador_terceros['fecha_nacimiento']) {
                                    $fecha_nacimiento = $mediador_terceros['fecha_nacimiento'];
                                } else {
                                    $fecha_nacimiento = "0000-00-00";
                                }
                                $url_consulta_med = $conexion['URL_CONSULTA_CONDUCTOR_PRINCIPAL'];
                                $opcion_mediador = array(
                                    'http' =>
                                    array(
                                        'method' => 'POST',
                                        'header' => "Content-Type:application/json\r\n" .
                                            "Authorization:" . $autorizacion_ambiente . "\r\n" .
                                            "TOKEN:" . $token_autentica . "\r\n",
                                        'content' =>
                                        '{' .
                                            '"cod_tipdoc":' . '"' . $td . '"' . "," .
                                            '"cod_activi":' . 16 . "," .
                                            '"cod_tercer":' . $mediador_terceros['numero_documento'] . "," .
                                            '"num_verifi":' . $digito . "," .
                                            '"nom_tercer":' . '"' . trim($mediador_terceros['nombre']) . '"' . "," .
                                            '"nom_apell1":' . '"' . trim($mediador_terceros['apellido1']) . '"' . "," .
                                            '"nom_apell2":' . '' . trim($apellido2) . '' . "," .
                                            '"abr_tercer":' . '' . trim($abreviatura) . '' . "," .
                                            '"num_telef1":' . $telefono_fijo . "," .
                                            '"num_telmov":' . $mediador_terceros['celular'] . "," .
                                            '"dir_tercer":' . '"' . $mediador_terceros['direccion'] . '"' . "," .
                                            '"dir_emailx":' . '' . $email . '' . "," .
                                            '"cod_ciudad":' . $mediador_terceros['rndc_codigo_ciudad'] . "," .
                                            '"fec_nacimi":' . '"' . $fecha_nacimiento . '"' . "," .
                                            '"cod_grupsa":' . '"' . $sangre . '"' . "," .
                                            '"cod_genero":' . '"' . $genero . '"' . "," .
                                            '"num_catlic":' . '' . $catlicen . '' . "," .
                                            '"num_licenc":' . '"' . $mediador_terceros['rndc_numero_licencia'] . '"' . "," .
                                            '"fec_venlic":' . '"' . $fecha_vencimiento . '"' . "," .
                                            '"dat_refemp":[{' .
                                            '"nom_empres":' . '"' . trim($mediador_terceros['nombre_empresa']) . '"' . "," .
                                            '"fec_ingres":' . '"' . $mediador_terceros['fecha_ingreso'] . '"' . "," .
                                            '"fec_retiro":' . '"' . $mediador_terceros['fecha_retiro'] . '"' . "," .
                                            '"nom_contac":' . '"' . trim($mediador_terceros['persona_contacto']) . '"' . "," .
                                            '"tel_contac":' . $mediador_terceros['celular'] . "," .
                                            '"car_contac":' . '"' . trim($mediador_terceros['cargo']) . '"' . "," .
                                            '"num_atigue":' . $mediador_terceros['antiguedad'] . '}]' . "," .
                                            '"dat_refper":[{' .
                                            '"nom_refper":' . '"' . trim($mediador_terceros['nombre_personal']) . '"' . "," .
                                            '"nom_parntc":' . '' . $parent . '' . "," .
                                            '"tel_refper":' . $mediador_terceros['tel_personal'] . '}]}'
                                    )
                                );

                                $context_propietario = stream_context_create($opcion_mediador);
                                $consulta_med_prop = file_get_contents($url_consulta_med, false, $context_propietario);
                                $envio_mediador_condu = json_decode($consulta_med_prop, true);
                                $documento = $mediador_terceros['numero_documento'];
                                $cadena_oet = json_encode($opcion_mediador);
                                $identificador = 'Conductor';
                                $agencia_id = $empresa['empresa_id'];
                                if ($envio_mediador_condu['data']['success'] == 1 || $envio_mediador_condu['data']['success'] == 'true') {
                                    $p3 = 1;
                                    $respuesta = $envio_mediador_condu['data']['success'];
                                    $estado = 1;
                                } else if ($envio_mediador_condu['data']['success'] == 0 || $envio_mediador_condu['data']['success'] == 'false') {
                                    $p3 = 2;
                                    $respuesta = $envio_mediador_condu['data']['msgResp'];
                                    $estado = 0;
                                }
                            } else {
                                echo "Error de conexion Principal";
                            }
                        } else {
                            $autorizacion_ambiente = '21b2e5c191e46165607c23cc48779c61e08972d5';
                            /* CONSULTAR LA URL DE CONEXION  */
                            $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                            if ($conexion) {
                                $recurso_oet_consulta = 4;
                                $mediador_terceros = $this->_modelo->Datos_Tercero($recurso_oet_consulta, $datorecurso);
                                //homologar datos
                                $td = "";
                                $telefono_fijo;
                                $abreviatura;
                                $email;
                                $apellido1;
                                $genero = "";
                                $parent = "";
                                $catlicen = "";
                                $sangre = "";
                                $digito = "";
                                if ($mediador_terceros["tipo_documento"] == 'Cedula de Ciudadania') {
                                    $td = 'C';
                                    $digito = 0;
                                }
                                if ($mediador_terceros["tipo_documento"] == 'Cedula de Extranjeria') {
                                    $td = 'E';
                                    $digito = 0;
                                }
                                if ($mediador_terceros['contacto'] != null && $mediador_terceros['contacto'] != '') {
                                    $telefono_fijo = $mediador_terceros['contacto'];
                                } else {
                                    $telefono_fijo = 'null';
                                }
                                if ($mediador_terceros['abreviatura'] != null && $mediador_terceros['abreviatura'] != '') {
                                    $abreviatura = '"' . $mediador_terceros['abreviatura'] . '"';
                                } else {
                                    $abreviatura = '"' . $mediador_terceros['nombre'] . ' ' . $mediador_terceros['apellido1'] . '"';
                                }
                                if ($mediador_terceros['email'] != null && $mediador_terceros['email'] != '') {
                                    $email = '"' . $mediador_terceros['email'] . '"';
                                } else {
                                    $email = 'null';
                                }
                                if ($mediador_terceros['apellido2'] != null && $mediador_terceros['apellido2'] != '') {
                                    $apellido2 = '"' . $mediador_terceros['apellido2'] . '"';
                                } else {
                                    $apellido2 = 'null';
                                }
                                if ($mediador_terceros['sexo'] == 'Masculino') {
                                    $genero = 1;
                                } else if ($mediador_terceros['sexo'] == 'Femenino') {
                                    $genero = 2;
                                }
                                if ($mediador_terceros['parentezco'] == 1) {
                                    $parent = '"Amigo"';
                                } else if ($mediador_terceros['parentezco'] == 2) {
                                    $parent = '"Hermano"';
                                } else if ($mediador_terceros['parentezco'] == 3) {
                                    $parent = '"Padre"';
                                } else if ($mediador_terceros['parentezco'] == 4) {
                                    $parent = '"Madre"';
                                } else if ($mediador_terceros['parentezco'] == 5) {
                                    $parent = '"Tio"';
                                } else if ($mediador_terceros['parentezco'] == 6) {
                                    $parent = '"Sobrino"';
                                } else if ($mediador_terceros['parentezco'] == 7) {
                                    $parent = '"Hijo"';
                                } else if ($mediador_terceros['parentezco'] == 8) {
                                    $parent = '"Esposo"';
                                }
                                if ($mediador_terceros['rndc_categoria_licencia'] == '4') {
                                    $catlicen = '4';
                                } else if ($mediador_terceros['rndc_categoria_licencia'] == '5') {
                                    $catlicen = '5';
                                } else if ($mediador_terceros['rndc_categoria_licencia'] == '6') {
                                    $catlicen = '6';
                                } else if ($mediador_terceros['rndc_categoria_licencia'] == 'C1') {
                                    $catlicen = '7';
                                } else if ($mediador_terceros['rndc_categoria_licencia'] == 'C2') {
                                    $catlicen = '8';
                                } else if ($mediador_terceros['rndc_categoria_licencia'] == 'C3') {
                                    $catlicen = '9';
                                }
                                $fec1 = $mediador_terceros['rndc_vencimiento_licencia'];
                                $timestamp = strtotime($fec1);
                                $fecha_vencimiento = date("Y-m-d", $timestamp);

                                if ($mediador_terceros['grupo_sanguineo'] == 'O-') {
                                    $sangre = "O (-)";
                                } else if ($mediador_terceros['grupo_sanguineo'] == 'O+') {
                                    $sangre = "O (+)";
                                } else if ($mediador_terceros['grupo_sanguineo'] == 'A+') {
                                    $sangre = "A (+)";
                                } else if ($mediador_terceros['grupo_sanguineo'] == 'A-') {
                                    $sangre = "A (-)";
                                } else if ($mediador_terceros['grupo_sanguineo'] == 'B+') {
                                    $sangre = "B (+)";
                                } else if ($mediador_terceros['grupo_sanguineo'] == 'B-') {
                                    $sangre = "B (-)";
                                } else if ($mediador_terceros['grupo_sanguineo'] == 'AB+') {
                                    $sangre = "AB (+)";
                                } else if ($mediador_terceros['grupo_sanguineo'] == 'AB-') {
                                    $sangre = "AB (-)";
                                }
                                if ($mediador_terceros['fecha_nacimiento']) {
                                    $fecha_nacimiento = $mediador_terceros['fecha_nacimiento'];
                                } else {
                                    $fecha_nacimiento = "0000-00-00";
                                }

                                $url_consulta_med = $conexion['URL_CONSULTA_CONDUCTOR_PRUEBA'];
                                $opcion_mediador = array(
                                    'http' =>
                                    array(
                                        'method' => 'POST',
                                        'header' => "Content-Type:application/json\r\n" .
                                            "Authorization:" . $autorizacion_ambiente . "\r\n" .
                                            "TOKEN:" . $token_autentica . "\r\n",
                                        'content' =>
                                        '{' .
                                            '"cod_tipdoc":' . '"' . $td . '"' . "," .
                                            '"cod_activi":' . 16 . "," .
                                            '"cod_tercer":' . $mediador_terceros['numero_documento'] . "," .
                                            '"num_verifi":' . $digito . "," .
                                            '"nom_tercer":' . '"' . trim($mediador_terceros['nombre']) . '"' . "," .
                                            '"nom_apell1":' . '"' . trim($mediador_terceros['apellido1']) . '"' . "," .
                                            '"nom_apell2":' . '' . trim($apellido2) . '' . "," .
                                            '"abr_tercer":' . '' . trim($abreviatura) . '' . "," .
                                            '"num_telef1":' . $telefono_fijo . "," .
                                            '"num_telmov":' . $mediador_terceros['celular'] . "," .
                                            '"dir_tercer":' . '"' . $mediador_terceros['direccion'] . '"' . "," .
                                            '"dir_emailx":' . '' . $email . '' . "," .
                                            '"cod_ciudad":' . $mediador_terceros['rndc_codigo_ciudad'] . "," .
                                            '"fec_nacimi":' . '"' . $fecha_nacimiento . '"' . "," .
                                            '"cod_grupsa":' . '"' . $sangre . '"' . "," .
                                            '"cod_genero":' . '"' . $genero . '"' . "," .
                                            '"num_catlic":' . '' . $catlicen . '' . "," .
                                            '"num_licenc":' . '"' . $mediador_terceros['rndc_numero_licencia'] . '"' . "," .
                                            '"fec_venlic":' . '"' . $fecha_vencimiento . '"' . "," .
                                            '"dat_refemp":[{' .
                                            '"nom_empres":' . '"' . trim($mediador_terceros['nombre_empresa']) . '"' . "," .
                                            '"fec_ingres":' . '"' . $mediador_terceros['fecha_ingreso'] . '"' . "," .
                                            '"fec_retiro":' . '"' . $mediador_terceros['fecha_retiro'] . '"' . "," .
                                            '"nom_contac":' . '"' . trim($mediador_terceros['persona_contacto']) . '"' . "," .
                                            '"tel_contac":' . $mediador_terceros['celular'] . "," .
                                            '"car_contac":' . '"' . trim($mediador_terceros['cargo']) . '"' . "," .
                                            '"num_atigue":' . $mediador_terceros['antiguedad'] . '}]' . "," .
                                            '"dat_refper":[{' .
                                            '"nom_refper":' . '"' . trim($mediador_terceros['nombre_personal']) . '"' . "," .
                                            '"nom_parntc":' . '' . $parent . '' . "," .
                                            '"tel_refper":' . $mediador_terceros['tel_personal'] . '}]}'
                                    )
                                );

                                //print_r($opcion_mediador);
                                $context_propietario = stream_context_create($opcion_mediador);
                                $consulta_med_prop = file_get_contents($url_consulta_med, false, $context_propietario);
                                $envio_mediador_condu = json_decode($consulta_med_prop, true);
                                $documento = $mediador_terceros['numero_documento'];
                                $cadena_oet = json_encode($opcion_mediador);
                                $identificador = 'Conductor';
                                $agencia_id = $empresa['empresa_id'];
                                if ($envio_mediador_condu['data']['success'] == 1 || $envio_mediador_condu['data']['success'] == 'true') {
                                    $p3 = 1;
                                    $respuesta = $envio_mediador_condu['data']['msgResp'];
                                    $estado = 1;
                                } else if ($envio_mediador_condu['data']['success'] == 0 || $envio_mediador_condu['data']['success'] == 'false') {
                                    $p3 = 2;
                                    $respuesta = $envio_mediador_condu['data']['msgResp'];
                                    $estado = 0;
                                }
                            } else {
                                echo "Error de conexion Prueba";
                            }
                        }
                    }
                }

                if ($longitud == 1) {
                    if ($p1 == 1) {
                        $data['status'] = 'true';
                        $data['error'] = '';
                        $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                        echo json_encode($data);
                    } else if ($p1 == 2) {
                        $data['status'] = 'false';
                        $data['error'] = $envio_mediador_prop['data']['msgResp'];
                        $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                        echo json_encode($data);
                    }

                    if ($p2 == 1) {
                        $data['status'] = 'true';
                        $data['error'] = '';
                        $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                        echo json_encode($data);
                    } else if ($p2 == 2) {
                        $data['status'] = 'false';
                        $data['error'] = $envio_mediador_prose['data']['msgResp'];
                        $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                        echo json_encode($data);
                    }

                    if ($p3 == 1) {
                        $data['status'] = 'true';
                        $data['error'] = '';
                        $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                        echo json_encode($data);
                    } else if ($p3 == 2) {
                        $data['status'] = 'false';
                        $data['error'] = $envio_mediador_condu['data']['msgResp'];
                        $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                        echo json_encode($data);
                    }
                } else {
                    //combinaciones para retornar mensaje 
                    if ($longitud == 3) {
                        if ($p3 == 1 && $p2 == 1 && $p1 == 1) { //todas las actividades
                            $data['status'] = 'true';
                            $data['error'] = '';
                            $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                            echo json_encode($data);
                        } else {
                            $data['status'] = 'false';
                            $data['error'] = $envio_mediador_condu['data']['msgResp'];
                            $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                            echo json_encode($data);
                        }
                    }
                    if ($longitud == 2) {
                        if ($p3 == 1 && $p2 == 1) { //conductor - poseedor
                            $data['status'] = 'true';
                            $data['error'] = '';
                            $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                            echo json_encode($data);
                        } else if ($p3 == 2 && $p2 == 2) {
                            $data['status'] = 'false';
                            $data['error'] = $envio_mediador_condu['data']['msgResp'];
                            $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                            echo json_encode($data);
                        }

                        if ($p3 == 1 && $p1 == 1) { //conductor - propietario
                            $data['status'] = 'true';
                            $data['error'] = '';
                            $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                            echo json_encode($data);
                        } else if ($p3 == 2 && $p1 == 2) {
                            $data['status'] = 'false';
                            $data['error'] = $envio_mediador_condu['data']['msgResp'];
                            $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                            echo json_encode($data);
                        }

                        if ($p2 == 1 && $p1 == 1) { //poseedor - propietario
                            $data['status'] = 'true';
                            $data['error'] = '';
                            $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                            echo json_encode($data);
                        } else if ($p2 == 2 && $p1 == 2) {
                            $data['status'] = 'false';
                            $data['error'] = $envio_mediador_condu['data']['msgResp'];
                            $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                            echo json_encode($data);
                        }
                    }
                }
            }
        }

        if ($clase == 2) { //vehiculos
            if ($recurso == 6 || $recurso == 7) { //placa o documento propietario
                /* CONSULTAR AGENCIA Y AMBIENTE */
                $empresa = $this->_modelo->Consultar_ambientes();
                if ($empresa['nombre_ambiente'] == "PRODUCCION") {
                    $autorizacion_ambiente = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
                    /* CONSULTAR LA URL DE CONEXION  */
                    $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                    if ($conexion) {
                        $mediador_terceros = $this->_modelo->Datos_Tercero($recurso, $datorecurso);
                        //homologar datos
                        //convertir de kg a toneladas
                        $peso_vacio = (($mediador_terceros['peso']) / (1000));
                        $capacidad = (($mediador_terceros['capacidad_tn']) / (1000));

                        $peso_vacio = round($peso_vacio, 2);
                        $capacidad = round($capacidad, 2);

                        $nit_asegura = substr($mediador_terceros['rndc_aseguradora'], 0, -1);
                        if ($mediador_terceros['tipo_vinculacion'] == 'Tercero') {
                            $vinculacion = 'Terceros';
                        } else if ($mediador_terceros['tipo_vinculacion'] == 'Propio') {
                            $vinculacion = 'Propio';
                        }
                        if ($mediador_terceros['rndc_aseguradora'] != null) {
                            $nit_asegura = substr($mediador_terceros['rndc_aseguradora'], 0, -1);
                            //$nit_asegura='null';
                        } else {
                            $nit_asegura = 'null';
                        }

                        if ($mediador_terceros['nit'] != null) { //GPS
                            //$nit_gps=$mediador_terceros['nit'];
                            $nit_gps = 'null';
                        } else {
                            $nit_gps = 'null';
                        }
                        if ($mediador_terceros['usuario_satelital'] != null) {
                            $user_sate = '"' . $mediador_terceros['usuario_satelital'] . '"';
                        } else {
                            $user_sate = 'null';
                        }
                        if ($mediador_terceros['clave_satelital'] != null) {
                            $clave_gps = '"' . $mediador_terceros['clave_satelital'] . '"';
                        } else {
                            $clave_gps = 'null';
                        }
                        if ($mediador_terceros['num_soat'] != null) {
                            //$soat='"'.$mediador_terceros['num_soat'].'"';
                            $soat = 'null';
                        } else {
                            $soat = 'null';
                        }
                        if ($mediador_terceros['vence_soat'] != null) {
                            //$vence_soat='"'.$mediador_terceros['vence_soat'].'"';
                            $vence_soat = 'null';
                        } else {
                            $vence_soat = 'null';
                        }

                        //combustible
                        if ($mediador_terceros['cod_tipo_combustible'] == 12) {
                            $combustible = 2;
                        } else if ($mediador_terceros['cod_tipo_combustible'] == 1) {
                            $combustible = 1;
                        } else if ($mediador_terceros['cod_tipo_combustible'] == 2) {
                            $combustible = 3;
                        } else if ($mediador_terceros['cod_tipo_combustible'] == 3) {
                            $combustible = 4;
                        } else if ($mediador_terceros['cod_tipo_combustible'] == 5) {
                            $combustible = 5;
                        }

                        //licencia transito
                        //print($mediador_terceros['licencia_transito']);
                        if ($mediador_terceros['licencia_transito'] != '' && $mediador_terceros['licencia_transito'] != null) {
                            $licencia = $mediador_terceros['licencia_transito'];
                        } else {
                            $licencia = '""';
                        }

                        if ($mediador_terceros['rndc_configuracion'] == 'CA') {
                            $configurar = '2CA';
                        } else {
                            $configurar = $mediador_terceros['rndc_configuracion'];
                        }

                        if ($mediador_terceros['clase_vehiculo'] == 1) { //automovil
                            $clase = 1;
                        } else if ($mediador_terceros['clase_vehiculo'] == 2) { //bus
                            $clase = 1;
                        } else if ($mediador_terceros['clase_vehiculo'] == 3) { //buseta
                            $clase = 1;
                        } else if ($mediador_terceros['clase_vehiculo'] == 4) { //camion
                            $clase = 28;
                        } else if ($mediador_terceros['clase_vehiculo'] == 5) { //camioneta
                            $clase = 8;
                        } else if ($mediador_terceros['clase_vehiculo'] == 6) { //campero
                            $clase = 1;
                        } else if ($mediador_terceros['clase_vehiculo'] == 7) { //microbus
                            $clase = 1;
                        } else if ($mediador_terceros['clase_vehiculo'] == 8) { //tractocamion
                            $clase = 3;
                        } else if ($mediador_terceros['clase_vehiculo'] == 9) { //motocicleta
                            $clase = 1;
                        } else if ($mediador_terceros['clase_vehiculo'] == 10) { //motocarro
                            $clase = 1;
                        } else if ($mediador_terceros['clase_vehiculo'] == 11) { //mototriciclo
                            $clase = 1;
                        } else if ($mediador_terceros['clase_vehiculo'] == 12) { //cuatrimoto
                            $clase = 1;
                        } else if ($mediador_terceros['clase_vehiculo'] == 13) { //remolque
                            $clase = 14;
                        } else if ($mediador_terceros['clase_vehiculo'] == 14) { //SEMIREMOLQUE
                            $clase = 1;
                        } else if ($mediador_terceros['clase_vehiculo'] == 15) { //volqueta
                            $clase = 4;
                        } else if ($mediador_terceros['clase_vehiculo'] == 16) { //sin clase
                            $clase = 1;
                        } else if ($mediador_terceros['clase_vehiculo'] == 17) { //
                            $clase = 1;
                        } else if ($mediador_terceros['clase_vehiculo'] == 18) { //ciclomotor
                            $clase = 1;
                        } else if ($mediador_terceros['clase_vehiculo'] == 19) { //triccimotor
                            $clase = 1;
                        } else if ($mediador_terceros['clase_vehiculo'] == 20) { //cuadriciclo
                            $clase = 1;
                        }

                        if ($mediador_terceros['tecno_fecha_vigencia']) {
                            $vencetecno = $mediador_terceros['tecno_fecha_vigencia'];
                        } else {
                            $vencetecno = '0000-00-00';
                        }

                        $url_consulta_med = $conexion['URL_CONSULTA_VEHICULOS_PRINCIPAL'];
                        $opcion_mediador = array(
                            'http' =>
                            array(
                                'method' => 'POST',
                                'header' => "Content-Type:application/json\r\n" .
                                    "Authorization:" . $autorizacion_ambiente . "\r\n" .
                                    "TOKEN:" . $token_autentica . "\r\n",
                                'content' =>
                                '{' .
                                    '"cod_tipdoc":' . '""' . "," .
                                    '"num_placax":' . '"' . trim($mediador_terceros['placa']) . '"' . "," .
                                    '"num_config":' . '"' . $configurar . '"' . "," .
                                    '"cod_colorx":' . $mediador_terceros['id_color_avansat'] . "," .
                                    '"cod_marcax":' . '"' . $mediador_terceros['id_marca_avansat'] . '"' . "," .
                                    '"cod_lineax":' . '' . $mediador_terceros['id_linea_avansat'] . '' . "," .
                                    '"cod_combus":' . '' . $combustible . '' . "," .
                                    '"ano_modelo":' . $mediador_terceros['anio_fabricacion'] . "," .
                                    '"cod_clasex":' . $clase . "," .
                                    '"cod_carroc":' . $mediador_terceros['id_carroc_avansat'] . "," .
                                    '"val_pesove":' . $peso_vacio . "," .
                                    '"val_capaci":' . $capacidad . "," .
                                    '"num_poliza":' . $soat . "," .
                                    '"fec_vigfin":' . $vence_soat . "," .
                                    '"cod_asesoa":' . $nit_asegura . "," .
                                    // '"num_agases":' . '"' . trim($mediador_terceros['tecnomecanica']) ?? 'N/A' . '"' . "," .
                                    '"num_agases":' . '"' . (trim($mediador_terceros[0]['tecnomecanica'] ?? 'N/A')) . '",' .
                                    '"fec_revmec":' . '"' . $vencetecno . '"' . "," .
                                    '"fec_vengas":' . '"' . $vencetecno . '"' . "," .
                                    '"cod_opegps":' . $nit_gps . "," .
                                    '"usr_gpsxxx":' . $user_sate . "," .
                                    '"clv_gpsxxx":' . $clave_gps . "," .
                                    '"fec_mangps":' . '"' . $mediador_terceros['fecha_mant_gps'] . '"' . "," .
                                    '"num_motorx":' . '"' . trim($mediador_terceros['num_motor']) . '"' . "," .
                                    '"num_chasis":' . '"' . trim($mediador_terceros['num_chasis']) . '"' . "," .
                                    '"num_polirc":' . '"' . trim($mediador_terceros['num_chasis']) . '"' . "," .
                                    '"fec_venprc":' . '"' . trim($mediador_terceros['vence_poliza']) . '"' . "," .
                                    '"cod_tipveh":' . '"' . $vinculacion . '"' . "," .
                                    '"num_licenc":' . '""' . "," .
                                    '"cod_propie":' . $mediador_terceros['propietario'] . "," .
                                    '"cod_tenedo":' . $mediador_terceros['poseedor'] . "," .
                                    '"cod_conduc":' . $mediador_terceros['conductor'] . '}'
                            )
                        );
                        //print_r($opcion_mediador);
                        $documento = $mediador_terceros['placa'];
                        $cadena_oet = json_encode($opcion_mediador);
                        if (!isset($_SESSION['usuario']['nom_usuario'])) {
                            session_start();
                            $id_usuario = $_SESSION["usuario"]["nom_usuario"];
                        } else {
                            $id_usuario = $_SESSION["usuario"]["nom_usuario"];
                        }
                        $context_vehiculo = stream_context_create($opcion_mediador);
                        $consulta_med_veh = file_get_contents($url_consulta_med, false, $context_vehiculo);
                        $envio_mediador_prop = json_decode($consulta_med_veh, true);
                        $identificador = 'Vehiculos';
                        $agencia_id = $empresa['empresa_id'];
                        if ($envio_mediador_prop['data']['success'] == 1 || $envio_mediador_prop['data']['success'] == 'true') {
                            $data['status'] = 'true';
                            $data['error'] = '';
                            $respuesta = $data['status'];
                            $estado = 1;
                            $log_avansat = $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);


                            echo json_encode($data);
                        } else if ($envio_mediador_prop['data']['success'] == 0 || $envio_mediador_prop['data']['success'] == 'false') {
                            $data['status'] = 'false';
                            $data['error'] = $envio_mediador_prop['data']['msgResp'];
                            $respuesta = $envio_mediador_prop['data']['msgResp'];
                            $estado = 0;
                            $log_avansat = $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);



                            echo json_encode($data);
                        }
                    } else {
                        echo "Error de conexion principal.";
                    }
                } else {
                    $autorizacion_ambiente = '21b2e5c191e46165607c23cc48779c61e08972d5';
                    /* CONSULTAR LA URL DE CONEXION  */
                    $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                    if ($conexion) {
                        $mediador_terceros = $this->_modelo->Datos_Tercero($recurso, $datorecurso);
                        // var_dump($mediador_terceros);
                        // exit(0);
                        //homologar datos
                        //convertir de kg a toneladas
                        $peso_vacio = (($mediador_terceros['peso']) / (1000));
                        $capacidad = (($mediador_terceros['capacidad_tn']) / (1000));

                        $peso_vacio = round($peso_vacio, 2);
                        $capacidad = round($capacidad, 2);

                        $nit_asegura = substr($mediador_terceros['rndc_aseguradora'], 0, -1);
                        if ($mediador_terceros['tipo_vinculacion'] == 'Tercero') {
                            $vinculacion = 'Terceros';
                        } else if ($mediador_terceros['tipo_vinculacion'] == 'Propio') {
                            $vinculacion = 'Propio';
                        }
                        if ($mediador_terceros['rndc_aseguradora'] != null) {
                            $nit_asegura = substr($mediador_terceros['rndc_aseguradora'], 0, -1);
                            //$nit_asegura='null';
                        } else {
                            $nit_asegura = 'null';
                        }

                        if ($mediador_terceros['nit'] != null) { //GPS
                            //$nit_gps=$mediador_terceros['nit'];
                            $nit_gps = 'null';
                        } else {
                            $nit_gps = 'null';
                        }
                        if ($mediador_terceros['usuario_satelital'] != null) {
                            $user_sate = '"' . $mediador_terceros['usuario_satelital'] . '"';
                        } else {
                            $user_sate = 'null';
                        }
                        if ($mediador_terceros['clave_satelital'] != null) {
                            $clave_gps = '"' . $mediador_terceros['clave_satelital'] . '"';
                        } else {
                            $clave_gps = 'null';
                        }
                        if ($mediador_terceros['num_soat'] != null) {
                            //$soat='"'.$mediador_terceros['num_soat'].'"';
                            $soat = 'null';
                        } else {
                            $soat = 'null';
                        }
                        if ($mediador_terceros['vence_soat'] != null) {
                            //$vence_soat='"'.$mediador_terceros['vence_soat'].'"';
                            $vence_soat = 'null';
                        } else {
                            $vence_soat = 'null';
                        }

                        //combustible
                        if ($mediador_terceros['cod_tipo_combustible'] == 12) {
                            $combustible = 2;
                        } else if ($mediador_terceros['cod_tipo_combustible'] == 1) {
                            $combustible = 1;
                        } else if ($mediador_terceros['cod_tipo_combustible'] == 2) {
                            $combustible = 3;
                        } else if ($mediador_terceros['cod_tipo_combustible'] == 3) {
                            $combustible = 4;
                        } else if ($mediador_terceros['cod_tipo_combustible'] == 5) {
                            $combustible = 5;
                        }

                        //licencia transito
                        //print($mediador_terceros['licencia_transito']);
                        if ($mediador_terceros['licencia_transito'] != '' && $mediador_terceros['licencia_transito'] != null) {
                            $licencia = $mediador_terceros['licencia_transito'];
                        } else {
                            $licencia = '""';
                        }

                        if ($mediador_terceros['rndc_configuracion'] == 'CA') {
                            $configurar = '2CA';
                        } else {
                            $configurar = $mediador_terceros['rndc_configuracion'];
                        }


                        if ($mediador_terceros['clase_vehiculo'] == 1) { //automovil
                            $clase = 1;
                        } else if ($mediador_terceros['clase_vehiculo'] == 2) { //bus
                            $clase = 1;
                        } else if ($mediador_terceros['clase_vehiculo'] == 3) { //buseta
                            $clase = 1;
                        } else if ($mediador_terceros['clase_vehiculo'] == 4) { //camion
                            $clase = 28;
                        } else if ($mediador_terceros['clase_vehiculo'] == 5) { //camioneta
                            $clase = 8;
                        } else if ($mediador_terceros['clase_vehiculo'] == 6) { //campero
                            $clase = 1;
                        } else if ($mediador_terceros['clase_vehiculo'] == 7) { //microbus
                            $clase = 1;
                        } else if ($mediador_terceros['clase_vehiculo'] == 8) { //tractocamion
                            $clase = 3;
                        } else if ($mediador_terceros['clase_vehiculo'] == 9) { //motocicleta
                            $clase = 1;
                        } else if ($mediador_terceros['clase_vehiculo'] == 10) { //motocarro
                            $clase = 1;
                        } else if ($mediador_terceros['clase_vehiculo'] == 11) { //mototriciclo
                            $clase = 1;
                        } else if ($mediador_terceros['clase_vehiculo'] == 12) { //cuatrimoto
                            $clase = 1;
                        } else if ($mediador_terceros['clase_vehiculo'] == 13) { //remolque
                            $clase = 14;
                        } else if ($mediador_terceros['clase_vehiculo'] == 14) { //SEMIREMOLQUE
                            $clase = 1;
                        } else if ($mediador_terceros['clase_vehiculo'] == 15) { //volqueta
                            $clase = 4;
                        } else if ($mediador_terceros['clase_vehiculo'] == 16) { //sin clase
                            $clase = 1;
                        } else if ($mediador_terceros['clase_vehiculo'] == 17) { //
                            $clase = 1;
                        } else if ($mediador_terceros['clase_vehiculo'] == 18) { //ciclomotor
                            $clase = 1;
                        } else if ($mediador_terceros['clase_vehiculo'] == 19) { //triccimotor
                            $clase = 1;
                        } else if ($mediador_terceros['clase_vehiculo'] == 20) { //cuadriciclo
                            $clase = 1;
                        }
                        if ($mediador_terceros['tecno_fecha_vigencia']) {
                            $vencetecno = $mediador_terceros['tecno_fecha_vigencia'];
                        } else {
                            $vencetecno = '0000-00-00';
                        }

                        $url_consulta_med = $conexion['URL_CONSULTA_VEHICULOS_PRUEBA'];
                        $opcion_mediador = array(
                            'http' =>
                            array(
                                'method' => 'POST',
                                'header' => "Content-Type:application/json\r\n" .
                                    "Authorization:" . $autorizacion_ambiente . "\r\n" .
                                    "TOKEN:" . $token_autentica . "\r\n",
                                'content' =>
                                '{' .
                                    '"cod_tipdoc":' . '""' . "," .
                                    '"num_placax":' . '"' . trim($mediador_terceros['placa']) . '"' . "," .
                                    '"num_config":' . '"' . $configurar . '"' . "," .
                                    '"cod_colorx":' . $mediador_terceros['id_color_avansat'] . "," .
                                    '"cod_marcax":' . '"' . $mediador_terceros['id_marca_avansat'] . '"' . "," .
                                    '"cod_lineax":' . '' . $mediador_terceros['id_linea_avansat'] . '' . "," .
                                    '"cod_combus":' . '' . $combustible . '' . "," .
                                    '"ano_modelo":' . $mediador_terceros['anio_fabricacion'] . "," .
                                    '"cod_clasex":' . $clase . "," .
                                    '"cod_carroc":' . $mediador_terceros['id_carroc_avansat'] . "," .
                                    '"val_pesove":' . $peso_vacio . "," .
                                    '"val_capaci":' . $capacidad . "," .
                                    '"num_poliza":' . $soat . "," .
                                    '"fec_vigfin":' . $vence_soat . "," .
                                    '"cod_asesoa":' . $nit_asegura . "," .
                                    '"num_agases":' . '"' . $mediador_terceros['tecnomecanica'] . '"' . "," .
                                    '"fec_revmec":' . '"' . $vencetecno . '"' . "," .
                                    '"fec_vengas":' . '"' . $vencetecno . '"' . "," .
                                    '"cod_opegps":' . $nit_gps . "," .
                                    '"usr_gpsxxx":' . $user_sate . "," .
                                    '"clv_gpsxxx":' . $clave_gps . "," .
                                    '"fec_mangps":' . '"' . $mediador_terceros['fecha_mant_gps'] . '"' . "," .
                                    '"num_motorx":' . '"' . $mediador_terceros['num_motor'] . '"' . "," .
                                    '"num_chasis":' . '"' . $mediador_terceros['num_chasis'] . '"' . "," .
                                    '"num_polirc":' . '"' . $mediador_terceros['poliza_responsabilidad'] . '"' . "," .
                                    '"fec_venprc":' . '"' . $mediador_terceros['vence_poliza'] . '"' . "," .
                                    '"cod_tipveh":' . '"' . $vinculacion . '"' . "," .
                                    '"num_licenc":' . '""' . "," .
                                    '"cod_propie":' . $mediador_terceros['propietario'] . "," .
                                    '"cod_tenedo":' . $mediador_terceros['poseedor'] . "," .
                                    '"cod_conduc":' . $mediador_terceros['conductor'] . '}'
                            )
                        );
                        //print_r($opcion_mediador);
                        $documento = $mediador_terceros['placa'];
                        $cadena_oet = json_encode($opcion_mediador);
                        if (!isset($_SESSION['usuario']['nom_usuario'])) {
                            session_start();
                            $id_usuario = $_SESSION["usuario"]["nom_usuario"];
                        } else {
                            $id_usuario = $_SESSION["usuario"]["nom_usuario"];
                        }
                        $context_vehiculo = stream_context_create($opcion_mediador);
                        $consulta_med_veh = file_get_contents($url_consulta_med, false, $context_vehiculo);
                        $envio_mediador_prop = json_decode($consulta_med_veh, true);
                        $identificador = 'Vehiculos';
                        $agencia_id = $empresa['empresa_id'];
                        if ($envio_mediador_prop['data']['success'] == 1 || $envio_mediador_prop['data']['success'] == 'true') {
                            $data['status'] = 'true';
                            $data['error'] = '';
                            $respuesta = $data['status'];
                            $estado = 1;
                            $log_avansat = $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                            echo json_encode($data);
                        } else if ($envio_mediador_prop['data']['success'] == 0 || $envio_mediador_prop['data']['success'] == 'false') {
                            $data['status'] = 'false';
                            $data['error'] = $envio_mediador_prop['data']['msgResp'];
                            $respuesta = $envio_mediador_prop['data']['msgResp'];
                            $estado = 0;
                            $log_avansat = $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                            echo json_encode($data);
                        }
                    } else {
                        echo "Error de conexion prueba";
                    }
                }
            }
        }

        if ($clase == 3) { //trailer
            if ($recurso == 8 || $recurso == 9) { //Placa o documento propietario
                /* CONSULTAR AGENCIA Y AMBIENTE */
                $empresa = $this->_modelo->Consultar_ambientes();
                if ($empresa['nombre_ambiente'] == "PRODUCCION") {
                    $autorizacion_ambiente = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
                    /* CONSULTAR LA URL DE CONEXION  */
                    $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                    if ($conexion) {
                        $mediador_terceros = $this->_modelo->Datos_Tercero($recurso, $datorecurso);
                        //homologar datos
                        $capacidad = (($mediador_terceros['capacidad']) / (1000));
                        if (isset($mediador_terceros['caracteristica'])) {
                            $observacion = '"' . trim($mediador_terceros['caracteristica']) . '"';
                            $observacion2 = $observacion;
                        } else {
                            $observacion2 = 'null';
                        }
                        if (isset($mediador_terceros['numero_civil'])) {
                            $num_poliza = '"' . $mediador_terceros['numero_civil'] . '"';
                        } else {
                            $num_poliza = 'null';
                        }
                        if (isset($mediador_terceros['rndc_aseguradora'])) {
                            $nit_asegura2 = substr($mediador_terceros['rndc_aseguradora'], 0, -1);
                            $nit_asegura = '' . $nit_asegura2 . '';
                        } else {
                            $nit_asegura = 'null';
                        }
                        if (isset($mediador_terceros['fecha_vence'])) {
                            $fecha_vence = '"' . $mediador_terceros['fecha_vence'] . '"';
                        } else {
                            $fecha_vence = 'null';
                        }
                        // $url_consulta_med = "https://oet-qa.intrared.net:8083/ap/nexos/api_tms/index.php/api/trailer";
                        $url_consulta_med = $conexion['URL_CONSULTA_TRAILER_PRINCIPAL'];
                        $opcion_mediador = array(
                            'http' =>
                            array(
                                'method' => 'POST',
                                'header' => "Content-Type:application/json\r\n" .
                                    "Authorization:" . $autorizacion_ambiente . "\r\n" .
                                    "TOKEN:" . $token_autentica . "\r\n",
                                'timeout' => 60,
                                'content' =>
                                '{' .
                                    '"num_trayle":' . '"' . trim($mediador_terceros['placa']) . '"' . "," .
                                    '"cod_marcax":' . $mediador_terceros['id_avansat'] . "," .
                                    '"tra_pesoxx":' . $mediador_terceros['peso_vacio'] . "," .
                                    '"tra_volpos":' . $mediador_terceros['volumen'] . "," .
                                    '"tip_tramit":' . $mediador_terceros['tipo_tramite'] . "," .
                                    '"ser_chasis":' . '"' . $mediador_terceros['serie_chasis'] . '"' . "," .
                                    '"cod_config":' . '"' . $mediador_terceros['rndc_configuacion'] . '"' . "," .
                                    '"ano_modelo":' . $mediador_terceros['modelo'] . "," .
                                    '"tra_altoxx":' . $mediador_terceros['alto'] . "," .
                                    '"tra_largox":' . $mediador_terceros['largo'] . "," .
                                    '"tra_anchox":' . $mediador_terceros['ancho'] . "," .
                                    '"tra_capaci":' . $capacidad . "," .
                                    '"cod_carroc":' . $mediador_terceros['rndc_carroceria'] . "," .
                                    '"obs_remolq":' . $observacion2 . "," .
                                    '"cod_propie":' . $mediador_terceros['numero_documento'] . "," .
                                    '"num_respon":' . $num_poliza . "," .
                                    '"cod_aseres":' . $nit_asegura . "," .
                                    '"fec_vigres":' . $fecha_vence . '}'
                            )
                        );
                        //print_r($opcion_mediador);
                        $documento = $mediador_terceros['placa'];
                        $cadena_oet = json_encode($opcion_mediador);
                        if (!isset($_SESSION['usuario']['nom_usuario'])) {
                            session_start();
                            $id_usuario = $_SESSION["usuario"]["nom_usuario"];
                        } else {
                            $id_usuario = $_SESSION["usuario"]["nom_usuario"];
                        }
                        $identificador = 'Trailer';
                        $agencia_id = $empresa['empresa_id'];
                        $context_vehiculo = stream_context_create($opcion_mediador);
                        $consulta_med_veh = file_get_contents($url_consulta_med, false, $context_vehiculo);
                        $envio_mediador_prop = json_decode($consulta_med_veh, true);
                        if ($envio_mediador_prop['data']['success'] == 1 || $envio_mediador_prop['data']['success'] == 'true') {
                            $data['status'] = 'true';
                            $data['error'] = '';
                            $respuesta = $data['status'];
                            $estado = 1;
                            $log_avansat = $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                            echo json_encode($data);
                        } else if ($envio_mediador_prop['data']['success'] == 0 || $envio_mediador_prop['data']['success'] == 'false') {
                            $data['status'] = 'false';
                            $data['error'] = $envio_mediador_prop['data']['msgResp'];
                            $respuesta = $envio_mediador_prop['data']['msgResp'];
                            $estado = 0;
                            $log_avansat = $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                            echo json_encode($data);
                        }
                    } else {
                        echo "Error de conexion Principal";
                    }
                } else {
                    $autorizacion_ambiente = '21b2e5c191e46165607c23cc48779c61e08972d5';
                    /* CONSULTAR LA URL DE CONEXION  */
                    $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                    if ($conexion) {
                        $mediador_terceros = $this->_modelo->Datos_Tercero($recurso, $datorecurso);
                        //homologar datos
                        $capacidad = (($mediador_terceros['capacidad']) / (1000));
                        if (isset($mediador_terceros['caracteristica'])) {
                            $observacion = '"' . trim($mediador_terceros['caracteristica']) . '"';
                            $observacion2 = $observacion;
                        } else {
                            $observacion2 = 'null';
                        }
                        if (isset($mediador_terceros['numero_civil'])) {
                            $num_poliza = '"' . $mediador_terceros['numero_civil'] . '"';
                        } else {
                            $num_poliza = 'null';
                        }
                        if (isset($mediador_terceros['rndc_aseguradora'])) {
                            $nit_asegura2 = substr($mediador_terceros['rndc_aseguradora'], 0, -1);
                            $nit_asegura = '' . $nit_asegura2 . '';
                        } else {
                            $nit_asegura = 'null';
                        }
                        if (isset($mediador_terceros['fecha_vence'])) {
                            $fecha_vence = '"' . $mediador_terceros['fecha_vence'] . '"';
                        } else {
                            $fecha_vence = 'null';
                        }
                        // $url_consulta_med = "https://oet-qa.intrared.net:8083/ap/nexos/api_tms/index.php/api/trailer";
                        $url_consulta_med = $conexion['URL_CONSULTA_TRAILER_PRUEBA'];
                        $opcion_mediador = array(
                            'http' =>
                            array(
                                'method' => 'POST',
                                'header' => "Content-Type:application/json\r\n" .
                                    "Authorization:" . $autorizacion_ambiente . "\r\n" .
                                    "TOKEN:" . $token_autentica . "\r\n",
                                'timeout' => 60,
                                'content' =>
                                '{' .
                                    '"num_trayle":' . '"' . trim($mediador_terceros['placa']) . '"' . "," .
                                    '"cod_marcax":' . $mediador_terceros['id_avansat'] . "," .
                                    '"tra_pesoxx":' . $mediador_terceros['peso_vacio'] . "," .
                                    '"tra_volpos":' . $mediador_terceros['volumen'] . "," .
                                    '"tip_tramit":' . $mediador_terceros['tipo_tramite'] . "," .
                                    '"ser_chasis":' . '"' . $mediador_terceros['serie_chasis'] . '"' . "," .
                                    '"cod_config":' . '"' . $mediador_terceros['rndc_configuacion'] . '"' . "," .
                                    '"ano_modelo":' . $mediador_terceros['modelo'] . "," .
                                    '"tra_altoxx":' . $mediador_terceros['alto'] . "," .
                                    '"tra_largox":' . $mediador_terceros['largo'] . "," .
                                    '"tra_anchox":' . $mediador_terceros['ancho'] . "," .
                                    '"tra_capaci":' . $capacidad . "," .
                                    '"cod_carroc":' . $mediador_terceros['rndc_carroceria'] . "," .
                                    '"obs_remolq":' . $observacion2 . "," .
                                    '"cod_propie":' . $mediador_terceros['numero_documento'] . "," .
                                    '"num_respon":' . $num_poliza . "," .
                                    '"cod_aseres":' . $nit_asegura . "," .
                                    '"fec_vigres":' . $fecha_vence . '}'
                            )
                        );
                        //print_r($opcion_mediador);
                        $documento = $mediador_terceros['placa'];
                        $cadena_oet = json_encode($opcion_mediador);
                        if (!isset($_SESSION['usuario']['nom_usuario'])) {
                            session_start();
                            $id_usuario = $_SESSION["usuario"]["nom_usuario"];
                        } else {
                            $id_usuario = $_SESSION["usuario"]["nom_usuario"];
                        }
                        $identificador = 'Trailer';
                        $agencia_id = $empresa['empresa_id'];
                        $context_vehiculo = stream_context_create($opcion_mediador);
                        $consulta_med_veh = file_get_contents($url_consulta_med, false, $context_vehiculo);
                        $envio_mediador_prop = json_decode($consulta_med_veh, true);
                        if ($envio_mediador_prop['data']['success'] == 1 || $envio_mediador_prop['data']['success'] == 'true') {
                            $data['status'] = 'true';
                            $data['error'] = '';
                            $respuesta = $data['status'];
                            $estado = 1;
                            $log_avansat = $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                            echo json_encode($data);
                        } else if ($envio_mediador_prop['data']['success'] == 0 || $envio_mediador_prop['data']['success'] == 'false') {
                            $data['status'] = 'false';
                            $data['error'] = $envio_mediador_prop['data']['msgResp'];
                            $respuesta = $envio_mediador_prop['data']['msgResp'];
                            $estado = 0;
                            $log_avansat = $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                            echo json_encode($data);
                        }
                    } else {
                        echo "Error conexion prueba";
                    }
                }
            }
        }
    }

    //Documentos oficiales de carga
    public function Consulta_Documento_Carga()
    {
        $filtro = $_POST["filtro"];
        $numero = $_POST["numero"];
        $this->doc = $this->_modelo->Consulta_Documento_Carga($filtro, $numero);
        echo json_encode($this->doc);
    }

    public function Consulta_Transacciones()
    {
        $token_autentica = $this->Conexion_Avansat();
        if (isset($token_autentica)) {
            //orden de cargue
            $recurso = $_POST["recurso"];
            $numero = $_POST["numero"];
            if ($recurso == 1) { //ENDPOINT ORDEN DE CARGUE
                /* CONSULTAR AGENCIA Y AMBIENTE */
                $empresa = $this->_modelo->Consultar_ambientes();
                if ($empresa['nombre_ambiente'] == "PRODUCCION") {
                    /* CONSULTAR LA URL DE CONEXION  */
                    $autorizacion_ambiente = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
                    $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                    if ($conexion) {
                        // $url_consulta = "https://oet-qa.intrared.net:8083/ap/nexos/api_tms/index.php/api/loadingOrder/" . $numero;
                        $url_consulta = $conexion['URL_CONSULTAR_ORDEN_CARGUE_PRINCIPAL'] . $numero;
                        $opcion_consulta = array(
                            'http' =>
                            array(
                                'method' => 'GET',
                                'header' => "Content-Type:application/json\r\n" .
                                    "Authorization:1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p\r\n" .
                                    "TOKEN:" . $token_autentica . "\r\n"
                            )
                        );
                        $context_consulta = stream_context_create($opcion_consulta);
                        $consulta = file_get_contents($url_consulta, false, $context_consulta);
                        $datos_consulta = json_decode($consulta, true);
                        $mediador_documentos = $this->Mediador_Documentocarga($recurso, $numero, $datos_consulta, $token_autentica);
                    } else {
                        echo "Error conexion Principal";
                    }
                } else {
                    /* CONSULTAR LA URL DE CONEXION  */
                    $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                    if ($conexion) {
                        # code...
                        // $url_consulta = "https://oet-qa.intrared.net:8083/ap/nexos/api_tms/index.php/api/loadingOrder/" . $numero;
                        $autorizacion_ambiente = '21b2e5c191e46165607c23cc48779c61e08972d5';
                        $url_consulta = $conexion['URL_CONSULTAR_ORDEN_CARGUE_PRUEBA'] . $numero;
                        $opcion_consulta = array(
                            'http' =>
                            array(
                                'method' => 'GET',
                                'header' => "Content-Type:application/json\r\n" .
                                    "Authorization:" . $autorizacion_ambiente . "\r\n" .
                                    "TOKEN:" . $token_autentica . "\r\n"
                            )
                        );

                        $context_consulta = stream_context_create($opcion_consulta);
                        $consulta = file_get_contents($url_consulta, false, $context_consulta);
                        $datos_consulta = json_decode($consulta, true);
                        $mediador_documentos = $this->Mediador_Documentocarga($recurso, $numero, $datos_consulta, $token_autentica);
                    } else {
                        echo "Error Conexion Prueba";
                    }
                }
            }

            //remesa
            if ($recurso == 2) { //consultar la orden de cargue segun el numero remesa
                $mediador_documentos = $this->_modelo->Consul_Num_Orden($numero);
                $orden = $mediador_documentos[0]['id_orden_cargue'];
                /* CONSULTAR AGENCIA Y AMBIENTE */
                $empresa = $this->_modelo->Consultar_ambientes();
                if ($empresa['nombre_ambiente'] == "PRODUCCION") {
                    $autorizacion_ambiente = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
                    /* CONSULTAR LA URL DE CONEXION  */
                    $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                    if ($conexion) {
                        // $url_consulta = "https://oet-qa.intrared.net:8083/ap/nexos/api_tms/index.php/api/loadingOrder/" . $numero;
                        $url_consulta = $conexion['URL_CONSULTAR_ORDEN_CARGUE_REMESA_PRINCIPAL'] . $numero;
                        $opcion_consulta = array(
                            'http' =>
                            array(
                                'method' => 'GET',
                                'header' => "Content-Type:application/json\r\n" .
                                    "Authorization:1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p\r\n" .
                                    "TOKEN:" . $token_autentica . "\r\n"
                            )
                        );
                        $context_consulta = stream_context_create($opcion_consulta);
                        $consulta = file_get_contents($url_consulta, false, $context_consulta);
                        $datos_consulta = json_decode($consulta, true);
                        //print_r($datos_consulta);
                        $mediador_documentos = $this->Mediador_Documentocarga($recurso, $numero, $datos_consulta, $token_autentica);
                    } else {
                        echo "Error conexion Principal";
                    }
                } else {
                    /* CONSULTAR LA URL DE CONEXION  */
                    $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                    if ($conexion) {
                        $autorizacion_ambiente = '21b2e5c191e46165607c23cc48779c61e08972d5';
                        # code...
                        // $url_consulta = "https://oet-qa.intrared.net:8083/ap/nexos/api_tms/index.php/api/loadingOrder/" . $numero;
                        $url_consulta = $conexion['URL_CONSULTAR_ORDEN_CARGUE_REMESA_PRUEBA'] . $numero;
                        $opcion_consulta = array(
                            'http' =>
                            array(
                                'method' => 'GET',
                                'header' => "Content-Type:application/json\r\n" .
                                    "Authorization:" . $autorizacion_ambiente . "\r\n" .
                                    "TOKEN:" . $token_autentica . "\r\n"
                            )
                        );
                        $context_consulta = stream_context_create($opcion_consulta);
                        $consulta = file_get_contents($url_consulta, false, $context_consulta);
                        $datos_consulta = json_decode($consulta, true);
                        //print_r($datos_consulta);
                        $mediador_documentos = $this->Mediador_Documentocarga($recurso, $numero, $datos_consulta, $token_autentica);
                    } else {
                        echo "Error Conexion Prueba";
                    }
                }
            }

            //manifiesto
            if ($recurso == 3) { //consultar el manifiesto
                $datos_consulta = "";
                $mediador_documentos = $this->Mediador_Documentocarga($recurso, $numero, $datos_consulta, $token_autentica);
            }
            if ($recurso == 4) { //consultar el cumplido
                $datos_consulta = "";
                $mediador_documentos = $this->Mediador_Documentocarga($recurso, $numero, $datos_consulta, $token_autentica);
            }
        }
    }

    public function Mediador_Documentocarga($recurso, $numero, $datos_consulta, $token_autentica)
    {
        if ($recurso == 1) { // ORDEN DE CARGA
            $existe_documento = array_filter($datos_consulta);

            // Solo se envía si NO hay datos previos
            if (!empty($existe_documento)) {
                return;
            }

            $mediador_documentos = $this->_modelo->Datos_Documento($recurso, $numero);

            if (!$mediador_documentos || !isset($mediador_documentos[0])) {
                echo json_encode([
                    'status' => 'false',
                    'error'  => 'No se encontró información de la orden de carga'
                ]);
                return;
            }

            $doc = $mediador_documentos[0];

            /* CONSULTAR AGENCIA Y AMBIENTE */
            $empresa = $this->_modelo->Consultar_ambientes();

            if ($empresa['nombre_ambiente'] == "PRODUCCION") {
                $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                if ($conexion) {
                    $url_consulta_med      = $conexion['URL_MEDIADO_ORDEN_CARGUE_PRINCIPAL'];
                    $autorizacion_ambiente = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
                } else {
                    echo "Error de conexion Principal";
                    return;
                }
            } else {
                $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                if ($conexion) {
                    $url_consulta_med      = $conexion['URL_MEDIADO_ORDEN_CARGUE_PRUEBA'];
                    $autorizacion_ambiente = '21b2e5c191e46165607c23cc48779c61e08972d5';
                } else {
                    echo "Error Conexion Prueba";
                    return;
                }
            }

            // ===============================
            // HOMOLOGACIONES / NORMALIZACIONES
            // ===============================

            $fechaorden = $doc['fecha_orden'];

            // Tipo de servicio: Consolidado / Expreso
            if ($doc['tipo_servicio_mer'] == 'Consolidado') {
                $uniser = 2;
            } else {
                // Por defecto Expreso (1)
                $uniser = 1;
            }

            // Tipo documento remitente
            if ($doc['td_rem'] == 'NIT') {
                $tipo_documentor = 'N';
            } elseif ($doc['td_rem'] == 'Cedula de Ciudadania') {
                $tipo_documentor = 'C';
            } elseif ($doc['td_rem'] == 'Cedula de Extranjeria') {
                $tipo_documentor = 'E';
            } else {
                $tipo_documentor = 'C';
            }

            // Tipo documento destinatario
            if ($doc['td_des'] == 'NIT') {
                $tipo_documentod = 'N';
            } elseif ($doc['td_des'] == 'Cedula de Ciudadania') {
                $tipo_documentod = 'C';
            } elseif ($doc['td_des'] == 'Cedula de Extranjeria') {
                $tipo_documentod = 'E';
            } else {
                $tipo_documentod = 'C';
            }

            // Agencias
            if ($doc['codigo'] == 'BOG') {
                $agencia = 1;
            } elseif ($doc['codigo'] == 'CTG') {
                $agencia = 2;
            } elseif ($doc['codigo'] == 'BAQ') {
                $agencia = 13;
            } elseif ($doc['codigo'] == 'BUN') {
                $agencia = 3;
            } else {
                $agencia = 1;
            }

            // Tipo de empaque
            $empaque = 20; // default NA
            if ($doc['tipo_empaque'] == 1) {          // Carga estibada
                $empaque = 22;
            } elseif ($doc['tipo_empaque'] == 2) {    // NA
                $empaque = 20;
            } elseif ($doc['tipo_empaque'] == 3) {    // Varios
                $empaque = 19;
            } elseif ($doc['tipo_empaque'] == 4) {    // Granel sólido
                $empaque = 21;
            } elseif ($doc['tipo_empaque'] == 5) {    // Cilindros
                $empaque = 17;
            } elseif ($doc['tipo_empaque'] == 6) {    // Bultos
                $empaque = 4;
            } elseif ($doc['tipo_empaque'] == 7) {    // Granel líquido
                $empaque = 13;
            } elseif ($doc['tipo_empaque'] == 8) {    // Contenedor 40 pies
                $empaque = 16;
            } elseif ($doc['tipo_empaque'] == 9) {    // Contenedor 2 x 40 pies
                $empaque = 8;
            } elseif ($doc['tipo_empaque'] == 10) {   // Contenedor 20 pies
                $empaque = 7;
            } elseif ($doc['tipo_empaque'] == 11) {   // Paquetes
                $empaque = 12;
            }

            // Pasar de KG a TON
            $peso      = (float)$doc['ca_pesocargue'];
            $tonelada  = $peso * 0.001;
            $resultado = $tonelada;

            // Teléfono destino
            $tel = trim($doc['tel_des']);
            if (strlen($tel) === 7) {
                $tel = '601' . $tel;
            }

            // Precinto
            $dat_precin = [];
            if (!empty($doc['serie_precinto'])) {

                $tipo_precinto = null;
                if (isset($doc['tipo_precinto'])) {
                    if ($doc['tipo_precinto'] == 'Botella') {
                        $tipo_precinto = 2;
                    } elseif ($doc['tipo_precinto'] == 'Correilla') {
                        $tipo_precinto = 3;
                    } elseif ($doc['tipo_precinto'] == 'Adhesivo') {
                        $tipo_precinto = 1;
                    } else {
                        // Plastico y Metalico los venías manejando como 'null'
                        $tipo_precinto = null;
                    }
                }

                $dat_precin[] = [
                    "num_precin" => (string)$doc['serie_precinto'],
                    "tip_precin" => $tipo_precinto
                ];
            }

            // Tarifa (antes la envolvías en comillas y le hacías trim)
            $tarifa = (string)$doc['ve_tarifacalculada'];

            // ===============================
            // ARMAR PAYLOAD
            // ===============================
            $payload = [
                "fec_ordenx" => $fechaorden,
                "num_ordenx" => (int)$doc['id'],
                "cod_mercan" => (int)$doc['mercancia_avansat'],
                "cod_uniser" => (int)$uniser,
                "cod_agenci" => (int)$agencia,
                "cod_client" => (int)$doc['nit_cliente'],

                "dat_vehicu" => [
                    "num_placax" => (string)$doc['placa'],
                    "cod_conduc" => (int)$doc['documento_conductor'],
                    "cod_propie" => (int)$doc['documento_propietario'],
                    "cod_tenedo" => (int)$doc['documento_poseedor'],
                ],

                "dat_remite" => [
                    "cod_tipdoc" => $tipo_documentor,
                    "num_docume" => (int)$doc['doc_rem'],
                    "nom_remite" => (string)$doc['nom_rem'],
                    "cod_ciudad" => (int)$doc['ciu_rem'],
                    "tel_remite" => (int)trim($doc['tel_rem']),
                    "dir_remite" => (string)$doc['dir_rem'],
                ],

                "dat_destin" => [
                    "cod_tipdoc" => $tipo_documentod,
                    "num_docume" => (int)$doc['num_des'],
                    "nom_destin" => (string)$doc['nom_des'],
                    "cod_ciudad" => (int)$doc['ciu_des'],
                    "tel_destin" => (int)$tel,
                    "dir_destin" => (string)$doc['dir_des'],
                ],

                "dat_precin" => $dat_precin,

                "dat_genera" => [
                    "cod_tipemp" => (int)$empaque,
                    "cod_uniemp" => (int)$doc['cantidad_empaque'],
                    "val_volume" => (float)$doc['mer_volumen'],
                    "val_pesoxx" => (float)$resultado,
                    "num_conte1" => (string)$doc['devol_numcont'],
                    "num_conte2" => (string)$doc['mer_contenedor2'],
                    "fec_citcar" => (string)$doc['fecha_estimada_entrega'],
                    "obs_genera" => (string)$doc['ca_observacion'],
                ],

                "dat_tarifa" => [
                    "fle_pagarx" => (string)$doc['ve_fletepactado'],
                    "fle_cobrar" => $tarifa,
                ]
            ];

            $json_payload = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

            // ===============================
            // ARMAR OPCIÓN STREAM CONTEXT
            // ===============================
            $opcion_mediador = [
                'http' => [
                    'method'  => 'POST',
                    'header'  =>
                    "Content-Type:application/json\r\n" .
                        "Authorization:" . $autorizacion_ambiente . "\r\n" .
                        "TOKEN:" . $token_autentica . "\r\n",
                    'content' => $json_payload,
                    'timeout' => 60,
                ]
            ];

            // ===============================
            // EJECUTAR PETICIÓN
            // ===============================
            $context_ordencargue = stream_context_create($opcion_mediador);
            $consulta_med_oc      = file_get_contents($url_consulta_med, false, $context_ordencargue);
            $envio_mediador_oc    = json_decode($consulta_med_oc, true);

            $documento  = $doc['id'];
            $cadena_oet = $json_payload; // guardamos solo el payload limpio

            if (!isset($_SESSION['usuario']['nom_usuario'])) {
                session_start();
            }
            $id_usuario = $_SESSION["usuario"]["nom_usuario"];

            $identificador = 'OrdenCargue';
            $agencia_id    = $empresa['empresa_id'];

            $status_ok = isset($envio_mediador_oc['data']['status']) &&
                ($envio_mediador_oc['data']['status'] == 1 || $envio_mediador_oc['data']['status'] === 'true');

            if ($status_ok) {
                $data = [
                    'status'   => 'true',
                    'error'    => '',
                    'id_orden' => $doc['id'],
                ];
                $respuesta = $data['status'];
                $estado    = 1;
            } else {
                $data = [
                    'status'   => 'false',
                    'error'    => $envio_mediador_oc['data']['message'] ?? 'Error desconocido en mediador',
                    'id_orden' => $doc['id'],
                ];
                $respuesta = $envio_mediador_oc['data']['msgResp'] ?? ($envio_mediador_oc['data']['message'] ?? 'Error');
                $estado    = 0;
            }

            $this->_modelo->log_avansat(
                $documento,
                $cadena_oet,
                $respuesta,
                $id_usuario,
                $estado,
                $identificador,
                $agencia_id
            );

            echo json_encode($data);
        }

        //REMESA
        if ($recurso == 2) {

            $existe_documento = array_filter($datos_consulta);

            // Si está vacío no se debe enviar
            if (empty($existe_documento)) {
                return;
            }

            $mediador_documentos = $this->_modelo->Datos_Documento($recurso, $numero);
            if (!$mediador_documentos) {
                echo json_encode([
                    "status" => "false",
                    "error"  => "No se encontró la información de remesa"
                ]);
                return;
            }

            /* ===============================
				CONSULTAR AGENCIA Y AMBIENTE
			=============================== */
            $empresa = $this->_modelo->Consultar_ambientes();

            if ($empresa['nombre_ambiente'] == "PRODUCCION") {
                $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                if ($conexion) {
                    $url_consulta_med      = $conexion['URL_MEDIADOR_REMESA_PRINCIPAL'];
                    $autorizacion_ambiente = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
                } else {
                    echo "Error de conexion Principal";
                    return;
                }
            } else {
                $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                if ($conexion) {
                    $url_consulta_med      = $conexion['URL_MEDIADOR_REMESA_PRUEBA'];
                    $autorizacion_ambiente = '21b2e5c191e46165607c23cc48779c61e08972d5';
                } else {
                    echo "Error Conexion Prueba";
                    return;
                }
            }

            /* ===============================
				RECORRER REMESAS Y ENVIAR UNA A UNA
			=============================== */
            foreach ($mediador_documentos as $remesa) {

                // Fecha de remesa
                $fecha_remesa = $remesa['fecha_creacion'] . ' ' . $remesa['hora_remesa'];

                // Contado
                $recontado = ($remesa['remesa_contado'] == 1) ? 1 : null;

                // Seguro
                $reseguro  = ($remesa['aplica_seguro'] == 1) ? 1 : null;

                // Contraentrega
                $recontra  = ($remesa['remesa_contraentrega'] == 1) ? 1 : null;

                // Tipo servicio
                $tiposer = ($remesa['tipo_servicio_mer'] == 'Expreso') ? 1 : 2;

                // Homologar horas pactadas (siempre 2 dígitos)
                $hora_desc = str_pad($remesa['horaspactodescargue'], 2, "0", STR_PAD_LEFT);
                $min_desc  = str_pad($remesa['minutospactodescargue'], 2, "0", STR_PAD_LEFT);

                $respuesta = new SimpleXMLElement($remesa['rta_ministerio']);
                $ingresoid = (string)$respuesta->ingresoid;

                /* ===============================
					ARMAR PAYLOAD (JSON LIMPIO)
				=============================== */

                $payload = [
                    "fec_remesa" => $fecha_remesa,
                    "cod_remesa" => (int)$remesa['num_remesa'],
                    "num_radica" => (string)$ingresoid,
                    "num_ordenx" => (int)$remesa['id_orden_cargue'],
                    "rem_contad" => $recontado,
                    "rem_conent" => $recontra,
                    "val_declar" => (string)$remesa['total_tarifa'],
                    "apl_seguro" => $reseguro,

                    "fec_cargue" => $remesa['fecha_cargue'] . ' ' . $remesa['hora_cargue'],
                    "hor_cargue" => $remesa['horaspactocarga'] . ':' . $remesa['minutospactocarga'],

                    "fec_descar" => $remesa['fecha_descargue'] . ' ' . date("H:i", strtotime($remesa['hora_descarga'])),
                    "hor_descar" => $hora_desc . ':' . $min_desc,

                    "can_cargad" => (int)$remesa['mer_cantidad'],
                    "cod_uniser" => (int)$tiposer,
                    "cod_unimed" => 1,
                    "val_factur" => "10000",  // Manteniendo exactamente tu lógica original
                    "tip_operac" => (string)$remesa['tipo_carga'],
                    "obs_remesa" => " "
                ];

                $json_payload = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

                /* ===============================
					OPCIÓN STREAM CONTEXT
				=============================== */

                $opcion_mediador = [
                    'http' => [
                        'method'  => 'POST',
                        'header'  =>
                        "Content-Type:application/json\r\n" .
                            "Authorization:" . $autorizacion_ambiente . "\r\n" .
                            "TOKEN:" . $token_autentica . "\r\n",
                        'content' => $json_payload,
                        'timeout' => 60
                    ]
                ];

                /* ===============================
					EJECUTAR PETICIÓN
				=============================== */

                $context_remesa   = stream_context_create($opcion_mediador);
                $consulta_med_rm  = file_get_contents($url_consulta_med, false, $context_remesa);
                $envio_rm         = json_decode($consulta_med_rm, true);

                $documento  = $remesa['num_remesa'];
                $cadena_oet = $json_payload;
                $identificador = 'Remesa';
                $agencia_id = $empresa['empresa_id'];

                if (!isset($_SESSION["usuario"]["nom_usuario"])) {
                    session_start();
                }
                $id_usuario = $_SESSION["usuario"]["nom_usuario"];

                /* ===============================
					RESPUESTA DE OET
				=============================== */

                $status_ok = isset($envio_rm['data']['status']) &&
                    ($envio_rm['data']['status'] == 1 || $envio_rm['data']['status'] === 'true');

                if ($status_ok) {
                    $data = [
                        "status"     => "true",
                        "error"      => "",
                        "id_remesa"  => $remesa['num_remesa']
                    ];
                    $respuesta = "true";
                    $estado = 1;
                } else {
                    $data = [
                        "status"     => "false",
                        "error"      => $envio_rm['data']['message'] ?? "Error desconocido",
                        "id_remesa"  => $remesa['num_remesa']
                    ];
                    $respuesta = $envio_rm['data']['message'] ?? "Error";
                    $estado = 0;
                }

                /* ===============================
					GUARDAR LOG
				=============================== */

                $this->_modelo->log_avansat(
                    $documento,
                    $cadena_oet,
                    $respuesta,
                    $id_usuario,
                    $estado,
                    $identificador,
                    $agencia_id
                );

                echo json_encode($data);
            }
        }

        // MANIFIESTO
        if ($recurso == 3) {

            $numero = $_POST["numero"];
            $mediador = $this->_modelo->Datos_Documento_Retransmite(3, $numero);

            if (!$mediador || empty($mediador[0])) {
                echo json_encode([
                    "status" => "false",
                    "error"  => "No se encontró el manifiesto a retransmitir"
                ]);
                return;
            }

            $m = $mediador[0];

            /* ============================================
				CONSULTAR AMBIENTE Y URL
			============================================ */
            $empresa = $this->_modelo->Consultar_ambientes();

            if ($empresa['nombre_ambiente'] == "PRODUCCION") {

                $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                if (!$conexion) {
                    echo "Error de conexion Principal";
                    return;
                }

                $url_consulta_med      = $conexion['URL_MEDIADOR_MANIFIESTO_PRINCIPAL'];
                $autorizacion_ambiente = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
            } else {

                $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                if (!$conexion) {
                    echo "Error Conexion Prueba";
                    return;
                }

                $url_consulta_med      = $conexion['URL_MEDIADOR_MANIFIESTO_PRUEBA'];
                $autorizacion_ambiente = '21b2e5c191e46165607c23cc48779c61e08972d5';
            }

            /* ============================================
				HOMOLOGACIONES
			============================================ */

            // Tipo manifiesto
            $tipoma = [
                1 => 'G',
                2 => 'P',
                8 => 'I',
                3 => 'W',
                4 => 'G'
            ][$m['tipo_manifiesto']] ?? 'G';

            // Pagadores
            $pagador = [
                1 => 'E',
                2 => 'D',
                3 => 'R',
                4 => 'C'
            ][$m['cargue_pagado']] ?? 'E';

            $dpagador = [
                1 => 'E',
                2 => 'D',
                3 => 'R',
                4 => 'C'
            ][$m['descargue_pagado']] ?? 'E';

            // Cifras sin comas
            $flete      = str_replace(',', '', $m['valor_total_viaje']);
            $retefuente = str_replace(',', '', $m['retencion_fuente']);
            $reteica    = str_replace(',', '', $m['rete_ica']);
            $neto       = str_replace(',', '', $m['neto_pagar']);

            // Fecha expedición
            $fecha_exp = substr($m['fecha_expedicion'] . ' ' . $m['hora_expedicion'], 0, 16);

            // Trailer
            $trailer = ($m['placa_trailer'] !== 'no') ? $m['placa_trailer'] : null;

            // Anticipo
            $anticipo = ($m['anticipo'] !== 'no')
                ? str_replace(',', '', $m['anticipo'])
                : null;

            /* ============================================
				REMESAS del manifiesto
			============================================ */

            $remesas_bd = $this->_modelo->Cant_Remesa(3, $numero);
            $remesas = [];

            if ($remesas_bd) {

                foreach ($remesas_bd as $r) {

                    $respuesta = new SimpleXMLElement($r['rta_ministerio']);
                    $ingresoid = (string)$respuesta->ingresoid;

                    $remesas[] = [
                        "cod_remesa" => (string)$r['id_remesa'],
                        "num_autori" => (string)$ingresoid
                    ];
                }
            }

            /* ============================================
				ARMAR PAYLOAD (JSON LIMPIO)
			============================================ */

            $payload = [
                "cod_manifi" => (int)$m['id'],
                "cod_agedes" => (string)$m['id_extermo'],
                "num_autori" => (string)$m['num_autorizacion'],

                "num_placax" => trim($m['placa']),
                "cod_conduc" => (int)$m['conductor_manifiesto'],
                "num_trayle" => $trailer,

                "fec_expedi" => $fecha_exp,

                "cod_tipman" => $tipoma,
                "cod_ciuori" => (int)$m['origen'],
                "cod_ciudes" => (int)$m['destino'],

                "cod_propie" => (string)trim($m['nombre_propietario']),
                "cod_carpag" => $pagador,
                "cod_despag" => $dpagador,

                "obs_manif"  => trim($m['observacion']),

                "dat_servic" => [
                    "val_egreso" => $anticipo,
                    "val_fletex" => (string)$flete,
                    "val_retefu" => (string)$retefuente,
                    "val_reteic" => (string)$reteica,
                    "val_netoxx" => (string)$neto,
                    "fec_pagoxx" => (string)$m['fecha_pago'],
                ],

                "dat_remesa" => $remesas
            ];

            $json_payload = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

            /* ============================================
				PETICIÓN HTTP
			============================================ */

            $opcion_mediador = [
                'http' => [
                    'method'  => 'POST',
                    'header'  =>
                    "Content-Type:application/json\r\n" .
                        "Authorization:" . $autorizacion_ambiente . "\r\n" .
                        "TOKEN:" . $token_autentica . "\r\n",
                    'content' => $json_payload,
                    'timeout' => 60
                ]
            ];

            $context_m = stream_context_create($opcion_mediador);
            $respuesta_raw = file_get_contents($url_consulta_med, false, $context_m);

            $oet = json_decode($respuesta_raw, true);

            /* ============================================
				LOG + RESPUESTA
			============================================ */

            if (!isset($_SESSION['usuario']['nom_usuario'])) {
                session_start();
            }
            $id_usuario = $_SESSION['usuario']['nom_usuario'];

            $documento  = $m['id'];
            $identificador = "Manifiesto";
            $agencia_id = $empresa['empresa_id'];

            $status_ok = isset($oet['data']['status']) &&
                ($oet['data']['status'] == 1 || $oet['data']['status'] === 'true');

            if ($status_ok) {

                $data = [
                    "status" => "true",
                    "error"  => ""
                ];

                $this->_modelo->log_avansat(
                    $documento,
                    $json_payload,
                    "OK",
                    $id_usuario,
                    1,
                    $identificador,
                    $agencia_id
                );

                echo json_encode($data);
                return;
            } else {

                $data = [
                    "status" => "false",
                    "error"  => $oet['data']['message'] ?? "Error desconocido"
                ];

                $this->_modelo->log_avansat(
                    $documento,
                    $json_payload,
                    $data['error'],
                    $id_usuario,
                    0,
                    $identificador,
                    $agencia_id
                );

                echo json_encode($data);
                return;
            }
        }


        // if ($recurso == 4) { //CUMPLIDO
        // 	$mediador_documentos = $this->_modelo->Datos_Documento($recurso, $numero);

        // 	/* CONSULTAR AGENCIA Y AMBIENTE */
        // 	$empresa = $this->_modelo->Consultar_ambientes();
        // 	if ($empresa['nombre_ambiente'] == "PRODUCCION") {
        // 		/* CONSULTAR LA URL DE CONEXION  */
        // 		$conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
        // 		if ($conexion) {
        // 			$url_consulta_med = $conexion['URL_MEDIADOR_CUMPLIDO_PRINCIPAL'];
        // 			$autorizacion_ambiente = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
        // 		} else {
        // 			echo "Error de conexion Principal";
        // 		}
        // 	} else {
        // 		/* CONSULTAR LA URL DE CONEXION  */
        // 		$conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
        // 		if ($conexion) {
        // 			// $url_consulta_med = "https://oet-qa.intrared.net:8083/ap/nexos/api_tms/index.php/api/crear-orden-cargue";
        // 			$url_consulta_med = $conexion['URL_MEDIADOR_CUMPLIDO_PRUEBA'];
        // 			$autorizacion_ambiente = '21b2e5c191e46165607c23cc48779c61e08972d5';
        // 		} else {
        // 			echo "Error Conexion Prueba";
        // 		}
        // 	}

        // 	$respuesta_remesa = $mediador_documentos['rta_ministerio'];
        // 	$radicado_remesa = new SimpleXMLElement($respuesta_remesa);
        // 	$ingresoid = (string) $radicado_remesa->ingresoid;

        // 	$coma = '';
        // 	$remesa_cumplido = '';
        // 	$contador = 0;
        // 	$remesa_cumplido .= '"dat_cumpli":[';
        // 	foreach ($mediador_documentos as $cumplido_oet) {
        // 		$contador++;
        // 		if ($contador > 1) {
        // 			$coma = ',';
        // 		} else {
        // 			$coma = '';
        // 		}
        // 		$remesa_cumplido .= $coma . '{"cod_remesa":' . '"' . $cumplido_oet['id_remesa'] . '"' . "," .
        // 			'"fec_cargue":{' .
        // 			'"fec_llegad":' . '"' . $cumplido_oet['fca_llegada'] . '"' . "," .
        // 			'"fec_entrad":' . '"' . $cumplido_oet['fca_entrada'] . '"' . "," .
        // 			'"fec_salida":' . '"' . $cumplido_oet['fca_salida'] . '"' . '},' .
        // 			'"fec_descar":{' .
        // 			'"fec_llegad":' . '"' . $cumplido_oet['fdc_llegada'] . '"' . "," .
        // 			'"fec_entrad":' . '"' . $cumplido_oet['fdc_entrada'] . '"' . "," .
        // 			'"fec_salida":' . '"' . $cumplido_oet['fdc_salida'] . '"' . '}}';
        // 	}
        // 	$remesa_cumplido .= ']}';
        // 	$opcion_mediador = array(
        // 		'http' =>
        // 		array(
        // 			'method' => 'POST',
        // 			'header' => "Content-Type:application/json\r\n" .
        // 				"Authorization:" . $autorizacion_ambiente . "\r\n" .
        // 				"TOKEN:" . $token_autentica . "\r\n",
        // 			'content' =>
        // 			'{' .
        // 				'"cod_manifi":' . $mediador_documentos[0]['id'] . "," .
        // 				'"fec_cumpli":' . '"' . $mediador_documentos[0]['fecha_expedicion'] . '"' . "," .
        // 				'"num_autori":' . '"' . $ingresoid . '"' . "," .
        // 				'"can_multas":' . $mediador_documentos[0]['cantidad_multa'] . "," .
        // 				'"tar_multax":' . $mediador_documentos[0]['valor_multa'] . "," .
        // 				'"fec_estpag":' . '"' . $mediador_documentos[0]['fecha_pago'] . '"' . "," .
        // 				'"nom_agepag":' . '"Bogota"' . "," .
        // 				$remesa_cumplido
        // 		)
        // 	);

        // 	$context_cumplido = stream_context_create($opcion_mediador);
        // 	$consulta_med_cu = file_get_contents($url_consulta_med, false, $context_cumplido);
        // 	$envio_mediador_cumplido = json_decode($consulta_med_cu, true);
        // 	$identificador = 'Cumplido';
        // 	$agencia_id = $empresa['empresa_id'];
        // 	$documento = $mediador_documentos[0]['id'];
        // 	$respuesta = '';
        // 	$cadena_oet = json_encode($opcion_mediador);
        // 	if (!isset($_SESSION['usuario']['nom_usuario'])) {
        // 		session_start();
        // 		$id_usuario = $_SESSION["usuario"]["nom_usuario"];
        // 	} else {
        // 		$id_usuario = $_SESSION["usuario"]["nom_usuario"];
        // 	}
        // 	if ($envio_mediador_cumplido['data']['status'] == 1 || $envio_mediador_cumplido['data']['status'] == 'true') {
        // 		$data['status'] = 'true';
        // 		$data['error'] = '';
        // 		$estado = 1;
        // 		$log_avansat = $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
        // 		echo json_encode($data);
        // 	} else if ($envio_mediador_cumplido['data']['status'] == 0 || $envio_mediador_cumplido['data']['status'] == 'false') {
        // 		$data['status'] = 'false';
        // 		$data['error'] = $envio_mediador_cumplido['data']['message'];
        // 		$estado = 0;
        // 		$log_avansat = $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
        // 		echo json_encode($data);
        // 	}
        // }

        if ($recurso == 4) { // CUMPLIDO

            $mediador_documentos = $this->_modelo->Datos_Documento($recurso, $numero);

            if (!$mediador_documentos || empty($mediador_documentos[0])) {
                echo json_encode([
                    "status" => "false",
                    "error"  => "No se encontraron datos de cumplido para el manifiesto"
                ]);
                return;
            }

            /* ============================================
						CONSULTAR AGENCIA Y AMBIENTE
					============================================ */
            $empresa = $this->_modelo->Consultar_ambientes();

            if ($empresa['nombre_ambiente'] == "PRODUCCION") {

                $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                if (!$conexion) {
                    echo "Error de conexion Principal";
                    return;
                }

                $url_consulta_med      = $conexion['URL_MEDIADOR_CUMPLIDO_PRINCIPAL'];
                $autorizacion_ambiente = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
            } else {

                $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                if (!$conexion) {
                    echo "Error Conexion Prueba";
                    return;
                }

                $url_consulta_med      = $conexion['URL_MEDIADOR_CUMPLIDO_PRUEBA'];
                $autorizacion_ambiente = '21b2e5c191e46165607c23cc48779c61e08972d5';
            }

            /* ============================================
				RADICADO / NUM_AUTORI DEL MANIFIESTO
			============================================ */

            // En tu código original usabas: $mediador_documentos['rta_ministerio']
            // pero realmente $mediador_documentos es un arreglo, tomamos el primero:
            $respuesta_remesa = $mediador_documentos[0]['rta_ministerio'] ?? null;

            if (!$respuesta_remesa) {
                echo json_encode([
                    "status" => "false",
                    "error"  => "No se encontró rta_ministerio para obtener el ingresoid"
                ]);
                return;
            }

            $radicado_remesa = new SimpleXMLElement($respuesta_remesa);
            $ingresoid       = (string)$radicado_remesa->ingresoid;

            /* ============================================
				ARMAR dat_cumpli (remesas)
			============================================ */

            $dat_cumpli = [];

            foreach ($mediador_documentos as $cumplido_oet) {

                $dat_cumpli[] = [
                    "cod_remesa" => (string)$cumplido_oet['id_remesa'],
                    "fec_cargue" => [
                        "fec_llegad" => (string)$cumplido_oet['fca_llegada'],
                        "fec_entrad" => (string)$cumplido_oet['fca_entrada'],
                        "fec_salida" => (string)$cumplido_oet['fca_salida'],
                    ],
                    "fec_descar" => [
                        "fec_llegad" => (string)$cumplido_oet['fdc_llegada'],
                        "fec_entrad" => (string)$cumplido_oet['fdc_entrada'],
                        "fec_salida" => (string)$cumplido_oet['fdc_salida'],
                    ],
                ];
            }

            /* ============================================
				PAYLOAD JSON
			============================================ */

            $m = $mediador_documentos[0];

            $payload = [
                "cod_manifi" => (int)$m['id'],
                "fec_cumpli" => (string)$m['fecha_expedicion'],
                "num_autori" => (string)$ingresoid,
                "can_multas" => (int)$m['cantidad_multa'],
                "tar_multax" => (float)$m['valor_multa'],
                "fec_estpag" => (string)$m['fecha_pago'],
                "nom_agepag" => "Bogota",
                "dat_cumpli" => $dat_cumpli,
            ];

            $json_payload = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

            /* ============================================
				PETICIÓN HTTP
			============================================ */

            $opcion_mediador = [
                'http' => [
                    'method'  => 'POST',
                    'header'  =>
                    "Content-Type:application/json\r\n" .
                        "Authorization:" . $autorizacion_ambiente . "\r\n" .
                        "TOKEN:" . $token_autentica . "\r\n",
                    'content' => $json_payload,
                    'timeout' => 60,
                ],
            ];

            $context_cumplido   = stream_context_create($opcion_mediador);
            $consulta_med_cu    = file_get_contents($url_consulta_med, false, $context_cumplido);
            $respuesta_decod    = json_decode($consulta_med_cu, true);

            /* ============================================
				LOG + RESPUESTA
			============================================ */

            if (!isset($_SESSION['usuario']['nom_usuario'])) {
                session_start();
            }
            $id_usuario = $_SESSION['usuario']['nom_usuario'];

            $documento     = $m['id'];
            $identificador = 'Cumplido';
            $agencia_id    = $empresa['empresa_id'];
            $cadena_oet    = $json_payload;

            $status_ok = isset($respuesta_decod['data']['status']) &&
                ($respuesta_decod['data']['status'] == 1 || $respuesta_decod['data']['status'] === 'true');

            if ($status_ok) {

                $data = [
                    'status' => 'true',
                    'error'  => '',
                ];
                $estado    = 1;
                $respuesta = 'OK';

                $this->_modelo->log_avansat(
                    $documento,
                    $cadena_oet,
                    $respuesta,
                    $id_usuario,
                    $estado,
                    $identificador,
                    $agencia_id
                );

                echo json_encode($data);
                return;
            } else {

                $msgError = $respuesta_decod['data']['message'] ?? 'Error desconocido en cumplido';

                $data = [
                    'status' => 'false',
                    'error'  => $msgError,
                ];
                $estado    = 0;
                $respuesta = $msgError;

                $this->_modelo->log_avansat(
                    $documento,
                    $cadena_oet,
                    $respuesta,
                    $id_usuario,
                    $estado,
                    $identificador,
                    $agencia_id
                );

                echo json_encode($data);
                return;
            }
        }
    }

    public function Consulta_Recurso()
    {
        $token_autentica = $this->Conexion_Avansat();
        if (isset($token_autentica)) {
            $clase = $_POST["clase_recurso"];
            $recurso = $_POST["recurso"];
            $datorecurso = $_POST["dato_recurso"];

            /* CONSULTAR AGENCIA Y AMBIENTE */
            $empresa = $this->_modelo->Consultar_ambientes();
            if ($empresa['nombre_ambiente'] == "PRODUCCION") {
                /* CONSULTAR LA URL DE CONEXION  */
                $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                if ($conexion) {
                    $url_consulta = $conexion['URL_CONSULTA_TERCERO_PRINCIPAL'] . $datorecurso;
                    $autorizacion_ambiente = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
                } else {
                    echo "Error de conexion Principal";
                }
            } else {
                /* CONSULTAR LA URL DE CONEXION  */
                $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                if ($conexion) {
                    // $url_consulta_med = "https://oet-qa.intrared.net:8083/ap/nexos/api_tms/index.php/api/crear-orden-cargue";
                    $url_consulta = $conexion['URL_CONSULTA_TERCERO_PRUEBA'] . $datorecurso;
                    $autorizacion_ambiente = '21b2e5c191e46165607c23cc48779c61e08972d5';
                } else {
                    echo "Error Conexion Prueba";
                }
            }

            $opcion_consulta = array(
                'http' =>
                array(
                    'method' => 'GET',
                    'header' => "Content-Type:application/json\r\n" .
                        "Authorization:" . $autorizacion_ambiente . "\r\n" .
                        "TOKEN:" . $token_autentica . "\r\n",
                    'timeout' => 60
                )
            );
            $context_consulta = stream_context_create($opcion_consulta);
            $consulta = file_get_contents($url_consulta, false, $context_consulta);
            $datos_consulta = json_decode($consulta, true);
            $existe_tercero = array_filter($datos_consulta);

            if (empty($existe_tercero)) {
                $respuesta = 'No existe datos';
                $data['status'] = false;
                $data['resultado'] = $respuesta;
                echo json_encode($data);
            } else {
                $respuesta = implode(" ", $datos_consulta['data'][0]);
                $data['status'] = true;
                $data['resultado'] = $respuesta;
                echo json_encode($data);
            }
        }
    }

    public function Consulta_Trailer()
    {
        $token_autentica = $this->Conexion_Avansat();
        if (isset($token_autentica)) {
            $placa_trailer = $_POST["placa_trailer"];
            /* CONSULTAR AGENCIA Y AMBIENTE */
            $empresa = $this->_modelo->Consultar_ambientes();
            if ($empresa['nombre_ambiente'] == "PRODUCCION") {
                /* CONSULTAR LA URL DE CONEXION  */
                $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                if ($conexion) {
                    $url_consulta = $conexion['URL_CONSULTA_PLACA_TRAILER_PRINCIPAL'] . $placa_trailer;
                    $autorizacion_ambiente = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
                } else {
                    echo "Error de conexion Principal";
                }
            } else {
                /* CONSULTAR LA URL DE CONEXION  */
                $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                if ($conexion) {
                    $url_consulta = $conexion['URL_CONSULTA_PLACA_TRAILER_PRUEBA'] . $placa_trailer;
                    $autorizacion_ambiente = '21b2e5c191e46165607c23cc48779c61e08972d5';
                } else {
                    echo "Error Conexion Prueba";
                }
            }
            $opcion_consulta = array(
                'http' =>
                array(
                    'method' => 'GET',
                    'header' => "Content-Type:application/json\r\n" .
                        "Authorization:" . $autorizacion_ambiente . "\r\n" .
                        "TOKEN:" . $token_autentica . "\r\n",
                    'timeout' => 60
                )
            );
            $context_consulta = stream_context_create($opcion_consulta);
            $consulta = file_get_contents($url_consulta, false, $context_consulta);
            $datos_consulta = json_decode($consulta, true);
            $existe_tercero = array_filter($datos_consulta);
            if (empty($existe_tercero)) {
                $respuesta = 'No existe datos';
                $data['status'] = false;
                $data['resultado'] = $respuesta;
                echo json_encode($data);
            } else {
                $respuesta = implode(" ", $datos_consulta['data'][0]);
                $data['status'] = true;
                $data['resultado'] = $respuesta;
                echo json_encode($data);
            }
        }
    }

    public function Consulta_Vehiculo()
    {
        $token_autentica = $this->Conexion_Avansat();
        if (isset($token_autentica)) {
            $placa = $_POST["placa_vehiculo"];
            /* CONSULTAR AGENCIA Y AMBIENTE */
            $empresa = $this->_modelo->Consultar_ambientes();
            if ($empresa['nombre_ambiente'] == "PRODUCCION") {
                /* CONSULTAR LA URL DE CONEXION  */
                $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                if ($conexion) {
                    $url_consulta = $conexion['URL_CONSULTA_VEHICULO_PRINCIPAL'] . $placa;
                    $autorizacion_ambiente = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
                } else {
                    echo "Error de conexion Principal";
                }
            } else {
                /* CONSULTAR LA URL DE CONEXION  */
                $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                if ($conexion) {
                    $url_consulta = $conexion['URL_CONSULTA_VEHICULO_PRUEBA'] . $placa;
                    $autorizacion_ambiente = '21b2e5c191e46165607c23cc48779c61e08972d5';
                } else {
                    echo "Error Conexion Prueba";
                }
            }

            $opcion_consulta = array(
                'http' =>
                array(
                    'method' => 'GET',
                    'header' => "Content-Type:application/json\r\n" .
                        "Authorization:" . $autorizacion_ambiente . "\r\n" .
                        "TOKEN:" . $token_autentica . "\r\n",
                    'timeout' => 60
                )
            );
            $context_consulta = stream_context_create($opcion_consulta);
            $consulta = file_get_contents($url_consulta, false, $context_consulta);
            $datos_consulta = json_decode($consulta, true);
            $existe_tercero = array_filter($datos_consulta);
            if (empty($existe_tercero)) {
                $respuesta = 'No existe datos';
                $data['status'] = false;
                $data['resultado'] = $respuesta;
                echo json_encode($data);
            } else {
                $respuesta = implode(" ", $datos_consulta['data'][0]);
                $data['status'] = true;
                $data['resultado'] = $respuesta;
                echo json_encode($data);
            }
        }
    }

    public function Consulta_Orden_Oet()
    {
        $token_autentica = $this->Conexion_Avansat();
        if (isset($token_autentica)) {
            $numorden = $_POST["numero"];
            /* CONSULTAR AGENCIA Y AMBIENTE */
            $empresa = $this->_modelo->Consultar_ambientes();
            if ($empresa['nombre_ambiente'] == "PRODUCCION") {
                /* CONSULTAR LA URL DE CONEXION  */
                $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                if ($conexion) {
                    $url_consulta = $conexion['URL_CONSULTAR_ORDEN_CARGUE_PRINCIPAL'] . $numorden;
                    $autorizacion_ambiente = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
                } else {
                    echo "Error de conexion Principal";
                }
            } else {
                /* CONSULTAR LA URL DE CONEXION  */
                $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                if ($conexion) {
                    $url_consulta = $conexion['URL_CONSULTAR_ORDEN_CARGUE_PRUEBA'] . $numorden;
                    $autorizacion_ambiente = '21b2e5c191e46165607c23cc48779c61e08972d5';
                } else {
                    echo "Error Conexion Prueba";
                }
            }
            $opcion_consulta = array(
                'http' =>
                array(
                    'method' => 'GET',
                    'header' => "Content-Type:application/json\r\n" .
                        "Authorization:" . $autorizacion_ambiente . "\r\n" .
                        "TOKEN:" . $token_autentica . "\r\n",
                    'timeout' => 60
                )
            );
            $context_consulta = stream_context_create($opcion_consulta);
            $consulta = file_get_contents($url_consulta, false, $context_consulta);
            $datos_consulta = json_decode($consulta, true);
            $existe_tercero = array_filter($datos_consulta);
            if (empty($existe_tercero)) {
                $respuesta = 'No existe datos';
                $data['status'] = false;
                $data['resultado'] = $respuesta;
                echo json_encode($data);
            } else {
                $respuesta = implode(" ", $datos_consulta['data'][0]);
                $data['status'] = true;
                $data['resultado'] = $respuesta;
                echo json_encode($data);
            }
        }
    }

    /*******************   RETRANSMISION CON OET    ***************************/
    public function Consulta_Documento_Carga2()
    {
        $filtro = $_POST["filtro"];
        $numero = $_POST["numero"];
        $opcion = $_POST["filtrob"];
        $fecha = $_POST["fecha"];
        $this->doc = $this->_modelo->Consulta_Documento_Carga2($filtro, $numero, $opcion, $fecha);
        echo json_encode($this->doc);
    }

    public function Retransmite_Datos()
    {
        $token_autentica = $this->Conexion_Avansat();
        // if ($_POST["recurso"] == 5) { //clientes
        // 	// echo "ENTRO BIEN AQUI";
        // 	if (isset($token_autentica)) {
        // 		// echo "ENTRO BIEN AQUI";
        // 		$recurso = 1;
        // 		$datorecurso = $_POST["numero"];
        // 		$mediador_terceros = $this->_modelo->Datos_Tercero($recurso, $datorecurso);

        // 		//homologar datos
        // 		if ($mediador_terceros["tipo_documento"] == 'Juridico') {
        // 			$td = '';
        // 			$telefono_fijo = '';
        // 			$abreviatura = '';
        // 			$email = '';
        // 			$apellido1 = '';
        // 			$apellido2 = '';
        // 			$regimen = '';
        // 			$obligacion = '';
        // 			if ($mediador_terceros["tipo_documento"] == 'Natural') {
        // 				$td = 'C';
        // 				$apellido1 = 'null';
        // 				$apellido2 = 'null';
        // 			}
        // 			if ($mediador_terceros["tipo_documento"] == 'Juridico') {
        // 				$td = 'N';
        // 				$apellido1 = 'null';
        // 				$apellido2 = 'null';
        // 			}
        // 			if ($mediador_terceros['telefono'] != null && $mediador_terceros['telefono'] != '') {
        // 				$telefono_fijo = $mediador_terceros['telefono'];
        // 			} else {
        // 				$telefono_fijo = 'null';
        // 			}
        // 			if ($mediador_terceros['email'] != null && $mediador_terceros['email'] != '') {
        // 				$email = '"' . $mediador_terceros['email'] . '"';
        // 			} else {
        // 				$email = 'null';
        // 			}
        // 			if ($mediador_terceros['regimen'] != null && $mediador_terceros['regimen'] != '') {
        // 				if ($mediador_terceros['regimen'] == 'Régimen Especial') {
        // 					$regimen = 5;
        // 				} else if ($mediador_terceros['regimen'] == 'Régimen Simplificado') {
        // 					$regimen = 7;
        // 				} else if ($mediador_terceros['regimen'] == 'Gran Contribuyente') {
        // 					$regimen = 3;
        // 				} else if ($mediador_terceros['regimen'] == 'Gran Contribuyente Autorretenedor') {
        // 					$regimen = 6;
        // 				} else if ($mediador_terceros['regimen'] == 'No responsable de IVA') {
        // 					$regimen = 2;
        // 				} else {
        // 					$regimen = 1;
        // 				}
        // 			} else {
        // 				$regimen = '';
        // 			}
        // 			if ($mediador_terceros['obligacion'] != null && $mediador_terceros['obligacion'] != '') {
        // 				if ($mediador_terceros['obligacion'] == 13) { //gran contribuyente
        // 					$obligacion = "O-13";
        // 				} else if ($mediador_terceros['obligacion'] == 15) { //autorretenedor
        // 					$obligacion = "O-15";
        // 				} else if ($mediador_terceros['obligacion'] == 23) { //agente de retencion iva
        // 					$obligacion = "O-23";
        // 				} else if ($mediador_terceros['obligacion'] == 47) { //regimen simple de tributacion
        // 					$obligacion = "O-47";
        // 				} else if ($mediador_terceros['obligacion'] == 49) { //noresponsable
        // 					$obligacion = "R-99-PN";
        // 				} else if ($mediador_terceros['obligacion'] == 48) {
        // 					$obligacion = "O-48";
        // 				}
        // 			} else {
        // 				$obligacion = "";
        // 			}

        // 			$ciiu = 4664;
        // 			/* CONSULTAR AGENCIA Y AMBIENTE */
        // 			$empresa = $this->_modelo->Consultar_ambientes();
        // 			if ($empresa['nombre_ambiente'] == "PRODUCCION") {
        // 				/* CONSULTAR LA URL DE CONEXION  */
        // 				$conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
        // 				if ($conexion) {
        // 					$url_consulta_med = $conexion['URL_CONSULTA_CLIENTE_PRINCIPAL'];
        // 					$autorizacion_ambiente = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
        // 				} else {
        // 					echo "Error de conexion Principal";
        // 				}
        // 			} else {
        // 				/* CONSULTAR LA URL DE CONEXION  */
        // 				$conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
        // 				if ($conexion) {
        // 					$url_consulta_med = $conexion['URL_CONSULTA_CLIENTE_PRUEBA'];
        // 					$autorizacion_ambiente = '21b2e5c191e46165607c23cc48779c61e08972d5';
        // 				} else {
        // 					echo "Error Conexion Prueba";
        // 				}
        // 			}
        // 			$opcion_mediador = array(
        // 				'http' =>
        // 				array(
        // 					'method' => 'POST',
        // 					'header' => "Content-Type:application/json\r\n" .
        // 						"Authorization:" . $autorizacion_ambiente . "\r\n" .
        // 						"TOKEN:" . $token_autentica . "\r\n",
        // 					'content' =>
        // 					'{' .
        // 						'"cod_tipdoc":' . '"' . $td . '"' . "," .
        // 						'"cod_tipter":' . '"' . $mediador_terceros['tipo_documento'] . '"' . "," .
        // 						'"cod_terreg":' . $regimen . "," .
        // 						'"cod_tercer":' . $mediador_terceros['documento'] . "," .
        // 						'"num_verifi":' . $mediador_terceros['digito_verificacion'] . "," .
        // 						'"nom_tercer":' . '"' . trim($mediador_terceros['nombre']) . '"' . "," .
        // 						'"nom_razsoc":' . '"' . trim($mediador_terceros['nombre']) . '"' . "," .
        // 						'"cod_activi":' . 10 . "," .
        // 						'"cod_ciiuxx":' . $ciiu . "," .
        // 						'"cod_ciudad":' . $mediador_terceros['rndc_codigo_ciudad'] . "," .
        // 						'"dir_tercer":' . '"' . $mediador_terceros['direccion'] . '"' . "," .
        // 						'"num_telef1":' . $telefono_fijo . "," .
        // 						'"num_telmov":' . $telefono_fijo . "," .
        // 						'"dir_emailx":' . '' . $email . '' . "," .
        // 						'"cod_obltri":' . '["' . $obligacion . '"]' . '}'
        // 				)
        // 			);
        // 			$cadena_oet = json_encode($opcion_mediador);
        // 			$context_propietario = stream_context_create($opcion_mediador);
        // 			$consulta_med_prop = file_get_contents($url_consulta_med, false, $context_propietario);
        // 			$envio_mediador_prop = json_decode($consulta_med_prop, true);
        // 			if (!isset($_SESSION['usuario']['nom_usuario'])) {
        // 				session_start();
        // 				$id_usuario = $_SESSION["usuario"]["nom_usuario"];
        // 			} else {
        // 				$id_usuario = $_SESSION["usuario"]["nom_usuario"];
        // 			}
        // 			$documento = $mediador_terceros['documento'];
        // 			$identificador = 'Cliente';
        // 			$agencia_id = $empresa['empresa_id'];
        // 			if ($envio_mediador_prop['data']['success'] == 1 || $envio_mediador_prop['data']['success'] == 'true') {
        // 				$data['status'] = 'true';
        // 				$data['error'] = '';
        // 				$estado = 1;
        // 				$respuesta = $envio_mediador_prop['data']['success'];
        // 				echo json_encode($data);
        // 				$log_avansat = $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
        // 			} else if ($envio_mediador_prop['data']['success'] == 0 || $envio_mediador_prop['data']['success'] == 'false') {
        // 				$data['status'] = 'false';
        // 				$data['error'] = $envio_mediador_prop['data']['msgResp'];
        // 				$estado = 0;
        // 				$respuesta = $envio_mediador_prop['data']['msgResp'];
        // 				echo json_encode($data);
        // 				$log_avansat = $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
        // 			}
        // 		}
        // 	}
        // }

        if ($_POST["recurso"] == 5) { // CLIENTES

            if (!isset($token_autentica)) {
                echo json_encode(["status" => false, "error" => "Token no encontrado"]);
                return;
            }

            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }

            $numero = $_POST["numero"];

            // ===========================================
            // 1. Consultar los datos del cliente
            // ===========================================
            $t = $this->_modelo->Datos_Tercero(1, $numero);

            if (!$t) {
                echo json_encode(["status" => false, "error" => "Cliente no encontrado"]);
                return;
            }

            // ===========================================
            // 2. Homologaciones
            // ===========================================
            $tipoDoc = [
                "Natural"  => "C",
                "Juridico" => "N"
            ][$t["tipo_documento"]] ?? "N";

            // Teléfono
            $telefono = (!empty($t["telefono"])) ? $t["telefono"] : null;

            // Email
            $email = (!empty($t["email"])) ? $t["email"] : null;

            // Régimen tributario
            $mapRegimen = [
                "Régimen Especial"                   => 5,
                "Régimen Simplificado"               => 7,
                "Gran Contribuyente"                 => 3,
                "Gran Contribuyente Autorretenedor"  => 6,
                "No responsable de IVA"              => 2
            ];
            $regimen = $mapRegimen[$t["regimen"]] ?? 1;

            // Obligaciones tributarias
            $mapOblig = [
                13 => "O-13",
                15 => "O-15",
                23 => "O-23",
                47 => "O-47",
                48 => "O-48",
                49 => "R-99-PN"
            ];
            $obligacion = $mapOblig[$t["obligacion"]] ?? "";

            // Código CIIU por defecto
            $ciiu = 4664;

            // ===========================================
            // 3. Ambiente
            // ===========================================
            $empresa  = $this->_modelo->Consultar_ambientes();
            $conexion = $this->_modelo->Conexion_Proveedor(
                $empresa["nombre_ambiente"],
                $empresa["empresa_id"]
            );

            if (!$conexion) {
                echo json_encode(["status" => false, "error" => "Error en configuración de ambiente"]);
                return;
            }

            if ($empresa["nombre_ambiente"] === "PRODUCCION") {
                $url  = $conexion["URL_CONSULTA_CLIENTE_PRINCIPAL"];
                $auth = "1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p";
            } else {
                $url  = $conexion["URL_CONSULTA_CLIENTE_PRUEBA"];
                $auth = "21b2e5c191e46165607c23cc48779c61e08972d5";
            }

            // ===========================================
            // 4. JSON limpio para OET
            // ===========================================
            $body = [
                "cod_tipdoc" => $tipoDoc,
                "cod_tipter" => $t["tipo_documento"],
                "cod_terreg" => $regimen,
                "cod_tercer" => (int)$t["documento"],
                "num_verifi" => (int)$t["digito_verificacion"],
                "nom_tercer" => trim($t["nombre"]),
                "nom_razsoc" => trim($t["nombre"]),
                "cod_activi" => 10,
                "cod_ciiuxx" => $ciiu,
                "cod_ciudad" => (int)$t["rndc_codigo_ciudad"],
                "dir_tercer" => trim($t["direccion"]),
                "num_telef1" => $telefono,
                "num_telmov" => $telefono,
                "dir_emailx" => $email,
                "cod_obltri" => [$obligacion]
            ];

            // ===========================================
            // 5. Llamada HTTP
            // ===========================================
            $options = [
                "http" => [
                    "method"  => "POST",
                    "header"  =>
                    "Content-Type: application/json\r\n" .
                        "Authorization: {$auth}\r\n" .
                        "TOKEN: {$token_autentica}\r\n",
                    "content" => json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                    "timeout" => 30
                ]
            ];

            $context = stream_context_create($options);
            $raw     = @file_get_contents($url, false, $context);

            if ($raw === false) {
                echo json_encode(["status" => false, "error" => "Error al conectar con OET"]);
                return;
            }

            $res = json_decode($raw, true);
            $ok  = ($res["data"]["success"] == 1 || $res["data"]["success"] == "true");
            $msg = $res["data"]["msgResp"] ?? "";

            // ===========================================
            // 6. Log Avansat
            // ===========================================
            $this->_modelo->log_avansat(
                $t["documento"],
                json_encode($body),
                $msg,
                $_SESSION["usuario"]["nom_usuario"],
                $ok ? 1 : 0,
                "Cliente",
                $empresa["empresa_id"]
            );

            // ===========================================
            // 7. Respuesta final
            // ===========================================
            echo json_encode([
                "status" => $ok ? "true" : "false",
                "error"  => $ok ? "" : $msg
            ]);
        }


        // if ($_POST["recurso"] == 6) { // conductor - poseedor - propietario
        // 	$datorecurso = $_POST["numero"];
        // 	//$mediador_terceros=$this->_modelo->Datos_Tercero($recurso,$datorecurso);
        // 	$mediador_actividad = $this->_modelo->Actividad_Tercero($datorecurso); //consultar el tipo de actividad
        // 	$p1 = 0;
        // 	$p2 = 0;
        // 	$p3 = 0;
        // 	$cantidad = count($mediador_actividad);
        // 	foreach ($mediador_actividad as $act_oet) {
        // 		$actividad = $act_oet['actividad'];
        // 		if ($actividad == 'Poseedor Vehiculo') {
        // 			$recurso_oet = 5;
        // 			$mediador_terceros = $this->_modelo->Datos_Tercero($recurso_oet, $datorecurso); //homologar datos
        // 			$td = '';
        // 			$telefono_fijo = '';
        // 			$abreviatura = '';
        // 			$email = '';
        // 			$apellido1 = '';
        // 			$apellido2 = '';
        // 			if ($mediador_terceros["tipo_documento"] == 'Cedula de Ciudadania') {
        // 				$td = 'C';
        // 				$abreviatura = ($mediador_terceros['nombre'] . ' ' . $mediador_terceros['apellido1']);
        // 			}
        // 			if ($mediador_terceros["tipo_documento"] == 'Cedula de Extranjeria') {
        // 				$td = 'E';
        // 				$abreviatura = ($mediador_terceros['nombre'] . ' ' . $mediador_terceros['apellido1']);
        // 			}
        // 			if ($mediador_terceros["tipo_documento"] == 'NIT') {
        // 				$td = 'N';
        // 				$abreviatura = ($mediador_terceros['nombre']);
        // 			}
        // 			if ($mediador_terceros['contacto'] != null && $mediador_terceros['contacto'] != '') {
        // 				$telefono_fijo = $mediador_terceros['contacto'];
        // 			} else {
        // 				$telefono_fijo = 'null';
        // 			}
        // 			if ($mediador_terceros['email'] != null && $mediador_terceros['email'] != '') {
        // 				$email = '"' . $mediador_terceros['email'] . '"';
        // 			} else {
        // 				$email = 'null';
        // 			}
        // 			if ($mediador_terceros['apellido1'] != null && $mediador_terceros['apellido1'] != '') {
        // 				$apellido1 = '"' . $mediador_terceros['apellido1'] . '"';
        // 			} else {
        // 				$apellido1 = 'null';
        // 			}
        // 			if ($mediador_terceros['apellido2'] != null && $mediador_terceros['apellido2'] != '') {
        // 				$apellido2 = '"' . $mediador_terceros['apellido2'] . '"';
        // 			} else {
        // 				$apellido2 = 'null';
        // 			} //enviar datos a AVANSAT

        // 			/* CONSULTAR AGENCIA Y AMBIENTE */
        // 			$empresa = $this->_modelo->Consultar_ambientes();
        // 			if ($empresa['nombre_ambiente'] == "PRODUCCION") {
        // 				/* CONSULTAR LA URL DE CONEXION  */
        // 				$conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
        // 				if ($conexion) {
        // 					$url_consulta_med = $conexion['URL_CONSULTA_POSEEDOR_PRINCIPAL'];
        // 					$autorizacion_ambiente = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
        // 				} else {
        // 					echo "Error de conexion Principal";
        // 				}
        // 			} else {
        // 				/* CONSULTAR LA URL DE CONEXION  */
        // 				$conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
        // 				if ($conexion) {
        // 					$url_consulta_med = $conexion['URL_CONSULTA_POSEEDOR_PRUEBA'];
        // 					$autorizacion_ambiente = '21b2e5c191e46165607c23cc48779c61e08972d5';
        // 				} else {
        // 					echo "Error Conexion Prueba";
        // 				}
        // 			}

        // 			$opcion_mediador = array(
        // 				'http' =>
        // 				array(
        // 					'method' => 'POST',
        // 					'header' => "Content-Type:application/json\r\n" .
        // 						"Authorization:" . $autorizacion_ambiente . "\r\n" .
        // 						"TOKEN:" . $token_autentica . "",
        // 					'content' => '{' .
        // 						'"cod_tipdoc":' . '"' . $td . '"' . "," .
        // 						'"cod_activi":' . 18 . "," .
        // 						'"cod_tercer":' . $mediador_terceros['numero_documento'] . "," .
        // 						'"num_verifi":' . $mediador_terceros['digito_verificacion'] . "," .
        // 						'"nom_tercer":' . '"' . trim($mediador_terceros['nombre']) . '"' . "," .
        // 						'"nom_apell1":' . '' . trim($apellido1) . '' . "," .
        // 						'"nom_apell2":' . '' . trim($apellido2) . '' . "," .
        // 						'"abr_tercer":' . '"' . trim($abreviatura) . '"' . "," .
        // 						'"num_telef1":' . $telefono_fijo . "," .
        // 						'"num_telmov":' . $mediador_terceros['celular'] . "," .
        // 						'"dir_tercer":' . '"' . $mediador_terceros['direccion'] . '"' . "," .
        // 						'"dir_emailx":' . '' . $email . '' . "," .
        // 						'"cod_ciudad":' . $mediador_terceros['rndc_codigo_ciudad']
        // 						. '}'
        // 				)
        // 			);

        // 			$context_propietario = stream_context_create($opcion_mediador);
        // 			$consulta_med_prop = file_get_contents($url_consulta_med, false, $context_propietario);
        // 			$envio_mediador_prose = json_decode($consulta_med_prop, true);
        // 			$documento = $mediador_terceros['numero_documento'];
        // 			$cadena_oet = json_encode($opcion_mediador);
        // 			$identificador = 'Poseedor';
        // 			$agencia_id = $empresa['empresa_id'];
        // 			if ($envio_mediador_prose['data']['success'] == 1 || $envio_mediador_prose['data']['success'] == 'true') {
        // 				$p2 = 1;
        // 				$respuesta = $envio_mediador_prose['data']['success'];
        // 				$estado = 1;
        // 			} else if ($envio_mediador_prose['data']['success'] == 0 || $envio_mediador_prose['data']['success'] == 'false') {
        // 				$p2 = 2;
        // 				$respuesta = $envio_mediador_prose['data']['msgResp'];
        // 				$estado = 0;
        // 			}
        // 		}

        // 		if ($actividad == 'Propietario Vehiculo') {
        // 			$recurso_oet = 3;
        // 			$mediador_terceros = $this->_modelo->Datos_Tercero($recurso_oet, $datorecurso); //homologar datos
        // 			$td;
        // 			$telefono_fijo;
        // 			$abreviatura;
        // 			$email;
        // 			$apellido1;
        // 			$apellido2;
        // 			if ($mediador_terceros["tipo_documento"] == 'Cedula de Ciudadania') {
        // 				$td = 'C';
        // 				$abreviatura = ('"' . $mediador_terceros['nombre'] . ' ' . $mediador_terceros['apellido1'] . '"');
        // 			}
        // 			if ($mediador_terceros["tipo_documento"] == 'Cedula de Extranjeria') {
        // 				$td = 'E';
        // 				$abreviatura = ('"' . $mediador_terceros['nombre'] . ' ' . $mediador_terceros['apellido1'] . '"');
        // 			}
        // 			if ($mediador_terceros["tipo_documento"] == 'NIT') {
        // 				$td = 'N';
        // 				$abreviatura = ('"' . $mediador_terceros['nombre'] . '"');
        // 			}
        // 			if ($mediador_terceros['contacto'] != null && $mediador_terceros['contacto'] != '') {
        // 				$telefono_fijo = $mediador_terceros['contacto'];
        // 			} else {
        // 				$telefono_fijo = 'null';
        // 			}
        // 			if ($mediador_terceros['email'] != null && $mediador_terceros['email'] != '') {
        // 				$email = '"' . $mediador_terceros['email'] . '"';
        // 			} else {
        // 				$email = 'null';
        // 			}
        // 			if ($mediador_terceros['apellido1'] != null && $mediador_terceros['apellido1'] != '') {
        // 				$apellido1 = '"' . $mediador_terceros['apellido1'] . '"';
        // 			} else {
        // 				$apellido1 = 'null';
        // 			}
        // 			if ($mediador_terceros['apellido2'] != null && $mediador_terceros['apellido2'] != '') {
        // 				$apellido2 = '"' . $mediador_terceros['apellido2'] . '"';
        // 			} else {
        // 				$apellido2 = 'null';
        // 			}

        // 			/* CONSULTAR AGENCIA Y AMBIENTE */
        // 			$empresa = $this->_modelo->Consultar_ambientes();
        // 			if ($empresa['nombre_ambiente'] == "PRODUCCION") {
        // 				/* CONSULTAR LA URL DE CONEXION  */
        // 				$conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
        // 				if ($conexion) {
        // 					$url_consulta_med = $conexion['URL_CONSULTA_PROPIETARIO_PRINCIPAL'];
        // 					$autorizacion_ambiente = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
        // 				} else {
        // 					echo "Error de conexion Principal";
        // 				}
        // 			} else {
        // 				/* CONSULTAR LA URL DE CONEXION  */
        // 				$conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
        // 				if ($conexion) {
        // 					$url_consulta_med = $conexion['URL_CONSULTA_PROPIETARIO_PRUEBA'];
        // 					$autorizacion_ambiente = '21b2e5c191e46165607c23cc48779c61e08972d5';
        // 				} else {
        // 					echo "Error Conexion Prueba";
        // 				}
        // 			}

        // 			$opcion_mediador = array(
        // 				'http' =>
        // 				array(
        // 					'method' => 'POST',
        // 					'header' => "Content-Type:application/json\r\n" .
        // 						"Authorization:" . $autorizacion_ambiente . "\r\n" .
        // 						"TOKEN:" . $token_autentica . "\r\n",
        // 					'content' =>
        // 					'{' .
        // 						'"cod_tipdoc":' . '"' . $td . '"' . "," .
        // 						'"cod_activi":' . 15 . "," .
        // 						'"cod_tercer":' . $mediador_terceros['numero_documento'] . "," .
        // 						'"num_verifi":' . $mediador_terceros['digito_verificacion'] . "," .
        // 						'"nom_tercer":' . '"' . trim($mediador_terceros['nombre']) . '"' . "," .
        // 						'"nom_apell1":' . '' . trim($apellido1) . '' . "," .
        // 						'"nom_apell2":' . '' . trim($apellido2) . '' . "," .
        // 						'"abr_tercer":' . '' . trim($abreviatura) . '' . "," .
        // 						'"num_telef1":' . $telefono_fijo . "," .
        // 						'"num_telmov":' . $mediador_terceros['celular'] . "," .
        // 						'"dir_tercer":' . '"' . $mediador_terceros['direccion'] . '"' . "," .
        // 						'"dir_emailx":' . '' . $email . '' . "," .
        // 						'"cod_ciudad":' . $mediador_terceros['rndc_codigo_ciudad']
        // 						. '}'
        // 				)
        // 			);
        // 			$context_propietario = stream_context_create($opcion_mediador);
        // 			$consulta_med_prop = file_get_contents($url_consulta_med, false, $context_propietario);
        // 			$envio_mediador_prop = json_decode($consulta_med_prop, true);
        // 			$documento = $mediador_terceros['numero_documento'];
        // 			$cadena_oet = json_encode($opcion_mediador);
        // 			$identificador = 'Propietario';
        // 			$agencia_id = $empresa['empresa_id'];
        // 			if ($envio_mediador_prop['data']['success'] == 1 || $envio_mediador_prop['data']['success'] == 'true') {
        // 				$p1 = 1;
        // 				$respuesta = $envio_mediador_prop['data']['success'];
        // 				$estado = 1;
        // 			} else if ($envio_mediador_prop['data']['success'] == 0 || $envio_mediador_prop['data']['success'] == 'false') {
        // 				$p1 = 2;
        // 				$respuesta = $envio_mediador_prop['data']['msgResp'];
        // 				$estado = 0;
        // 			}
        // 		}

        // 		if ($actividad == 'Conductor') {
        // 			$recurso_oet = 4;
        // 			$mediador_terceros = $this->_modelo->Datos_Tercero($recurso_oet, $datorecurso);
        // 			//homologar datos
        // 			$td = '';
        // 			$telefono_fijo = '';
        // 			$abreviatura = '';
        // 			$email = '';
        // 			$apellido1 = '';
        // 			$genero = '';
        // 			$parent = '';
        // 			$catlicen = '';
        // 			$sangre = '';
        // 			if ($mediador_terceros["tipo_documento"] == 'Cedula de Ciudadania') {
        // 				$td = 'C';
        // 			}
        // 			if ($mediador_terceros["tipo_documento"] == 'Cedula de Extranjeria') {
        // 				$td = 'E';
        // 			}
        // 			if ($mediador_terceros['contacto'] != null && $mediador_terceros['contacto'] != '') {
        // 				$telefono_fijo = $mediador_terceros['contacto'];
        // 			} else {
        // 				$telefono_fijo = 'null';
        // 			}
        // 			if ($mediador_terceros['abreviatura'] != null && $mediador_terceros['abreviatura'] != '') {
        // 				$abreviatura = '"' . $mediador_terceros['abreviatura'] . '"';
        // 			} else {
        // 				$abreviatura = '"' . $mediador_terceros['nombre'] . ' ' . $mediador_terceros['apellido1'] . '"';
        // 			}
        // 			if ($mediador_terceros['email'] != null && $mediador_terceros['email'] != '') {
        // 				$email = '"' . $mediador_terceros['email'] . '"';
        // 			} else {
        // 				$email = 'null';
        // 			}
        // 			if ($mediador_terceros['apellido2'] != null && $mediador_terceros['apellido2'] != '') {
        // 				$apellido2 = '"' . $mediador_terceros['apellido2'] . '"';
        // 			} else {
        // 				$apellido2 = 'null';
        // 			}
        // 			if ($mediador_terceros['sexo'] == 'Masculino') {
        // 				$genero = 1;
        // 			} else if ($mediador_terceros['sexo'] == 'Femenino') {
        // 				$genero = 2;
        // 			}
        // 			if ($mediador_terceros['parentezco'] == 1) {
        // 				$parent = '"Amigo"';
        // 			} else if ($mediador_terceros['parentezco'] == 2) {
        // 				$parent = '"Hermano"';
        // 			} else if ($mediador_terceros['parentezco'] == 3) {
        // 				$parent = '"Padre"';
        // 			} else if ($mediador_terceros['parentezco'] == 4) {
        // 				$parent = '"Madre"';
        // 			} else if ($mediador_terceros['parentezco'] == 5) {
        // 				$parent = '"Tio"';
        // 			} else if ($mediador_terceros['parentezco'] == 6) {
        // 				$parent = '"Sobrino"';
        // 			} else if ($mediador_terceros['parentezco'] == 7) {
        // 				$parent = '"Hijo"';
        // 			} else if ($mediador_terceros['parentezco'] == 8) {
        // 				$parent = '"Esposo"';
        // 			}
        // 			if ($mediador_terceros['rndc_categoria_licencia'] == '4') {
        // 				$catlicen = '4';
        // 			} else if ($mediador_terceros['rndc_categoria_licencia'] == '5') {
        // 				$catlicen = '5';
        // 			} else if ($mediador_terceros['rndc_categoria_licencia'] == '6') {
        // 				$catlicen = '6';
        // 			} else if ($mediador_terceros['rndc_categoria_licencia'] == 'C1') {
        // 				$catlicen = '7';
        // 			} else if ($mediador_terceros['rndc_categoria_licencia'] == 'C2') {
        // 				$catlicen = '8';
        // 			} else if ($mediador_terceros['rndc_categoria_licencia'] == 'C3') {
        // 				$catlicen = '9';
        // 			}
        // 			$fec1 = $mediador_terceros['rndc_vencimiento_licencia'];
        // 			$timestamp = strtotime($fec1);
        // 			$fecha_vencimiento = date("Y-m-d", $timestamp);

        // 			if ($mediador_terceros['grupo_sanguineo'] == 'O-') {
        // 				$sangre = "O (-)";
        // 			} else if ($mediador_terceros['grupo_sanguineo'] == 'O+') {
        // 				$sangre = "O (+)";
        // 			} else if ($mediador_terceros['grupo_sanguineo'] == 'A+') {
        // 				$sangre = "A (+)";
        // 			} else if ($mediador_terceros['grupo_sanguineo'] == 'A-') {
        // 				$sangre = "A (-)";
        // 			} else if ($mediador_terceros['grupo_sanguineo'] == 'B+') {
        // 				$sangre = "B (+)";
        // 			} else if ($mediador_terceros['grupo_sanguineo'] == 'B-') {
        // 				$sangre = "B (-)";
        // 			} else if ($mediador_terceros['grupo_sanguineo'] == 'AB+') {
        // 				$sangre = "AB (+)";
        // 			} else if ($mediador_terceros['grupo_sanguineo'] == 'AB-') {
        // 				$sangre = "AB (-)";
        // 			}
        // 			if ($mediador_terceros['fecha_nacimiento']) {
        // 				$fecha_nacimiento = $mediador_terceros['fecha_nacimiento'];
        // 			} else {
        // 				$fecha_nacimiento = "0000-00-00";
        // 			}

        // 			/* CONSULTAR AGENCIA Y AMBIENTE */
        // 			$empresa = $this->_modelo->Consultar_ambientes();
        // 			if ($empresa['nombre_ambiente'] == "PRODUCCION") {
        // 				/* CONSULTAR LA URL DE CONEXION  */
        // 				$conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
        // 				if ($conexion) {
        // 					$url_consulta_med = $conexion['URL_CONSULTA_CONDUCTOR_PRINCIPAL'];
        // 					$autorizacion_ambiente = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
        // 				} else {
        // 					echo "Error de conexion Principal";
        // 				}
        // 			} else {
        // 				/* CONSULTAR LA URL DE CONEXION  */
        // 				$conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
        // 				if ($conexion) {
        // 					$url_consulta_med = $conexion['URL_CONSULTA_CONDUCTOR_PRUEBA'];
        // 					$autorizacion_ambiente = '21b2e5c191e46165607c23cc48779c61e08972d5';
        // 				} else {
        // 					echo "Error Conexion Prueba";
        // 				}
        // 			}
        // 			$opcion_mediador = array(
        // 				'http' =>
        // 				array(
        // 					'method' => 'POST',
        // 					'header' => "Content-Type:application/json\r\n" .
        // 						"Authorization:21b2e5c191e46165607c23cc48779c61e08972d5\r\n" .
        // 						"TOKEN:" . $token_autentica . "\r\n",
        // 					'content' =>
        // 					'{' .
        // 						'"cod_tipdoc":' . '"' . $td . '"' . "," .
        // 						'"cod_activi":' . 16 . "," .
        // 						'"cod_tercer":' . $mediador_terceros['numero_documento'] . "," .
        // 						'"num_verifi":' . $mediador_terceros['digito_verificacion'] . "," .
        // 						'"nom_tercer":' . '"' . trim($mediador_terceros['nombre']) . '"' . "," .
        // 						'"nom_apell1":' . '"' . trim($mediador_terceros['apellido1']) . '"' . "," .
        // 						'"nom_apell2":' . '' . trim($apellido2) . '' . "," .
        // 						'"abr_tercer":' . '' . trim($abreviatura) . '' . "," .
        // 						'"num_telef1":' . $telefono_fijo . "," .
        // 						'"num_telmov":' . $mediador_terceros['celular'] . "," .
        // 						'"dir_tercer":' . '"' . $mediador_terceros['direccion'] . '"' . "," .
        // 						'"dir_emailx":' . '' . $email . '' . "," .
        // 						'"cod_ciudad":' . $mediador_terceros['rndc_codigo_ciudad'] . "," .
        // 						'"fec_nacimi":' . '"' . $fecha_nacimiento . '"' . "," .
        // 						'"cod_grupsa":' . '"' . $sangre . '"' . "," .
        // 						'"cod_genero":' . '"' . $genero . '"' . "," .
        // 						'"num_catlic":' . '' . $catlicen . '' . "," .
        // 						'"num_licenc":' . '"' . $mediador_terceros['rndc_numero_licencia'] . '"' . "," .
        // 						'"fec_venlic":' . '"' . $fecha_vencimiento . '"' . "," .
        // 						'"dat_refemp":[{' .
        // 						'"nom_empres":' . '"' . trim($mediador_terceros['nombre_empresa']) . '"' . "," .
        // 						'"fec_ingres":' . '"' . $mediador_terceros['fecha_ingreso'] . '"' . "," .
        // 						'"fec_retiro":' . '"' . $mediador_terceros['fecha_retiro'] . '"' . "," .
        // 						'"nom_contac":' . '"' . trim($mediador_terceros['persona_contacto']) . '"' . "," .
        // 						'"tel_contac":' . $mediador_terceros['celular'] . "," .
        // 						'"car_contac":' . '"' . trim($mediador_terceros['cargo']) . '"' . "," .
        // 						'"num_atigue":' . $mediador_terceros['antiguedad'] . '}]' . "," .
        // 						'"dat_refper":[{' .
        // 						'"nom_refper":' . '"' . trim($mediador_terceros['nombre_personal']) . '"' . "," .
        // 						'"nom_parntc":' . '' . $parent . '' . "," .
        // 						'"tel_refper":' . $mediador_terceros['tel_personal'] . '}]}'
        // 				)
        // 			);

        // 			$context_propietario = stream_context_create($opcion_mediador);
        // 			$consulta_med_prop = file_get_contents($url_consulta_med, false, $context_propietario);
        // 			$envio_mediador_condu = json_decode($consulta_med_prop, true);
        // 			$documento = $mediador_terceros['numero_documento'];
        // 			$cadena_oet = json_encode($opcion_mediador);
        // 			$identificador = 'Conductor';
        // 			$agencia_id = $empresa['empresa_id'];
        // 			if ($envio_mediador_condu['data']['success'] == 1 || $envio_mediador_condu['data']['success'] == 'true') {
        // 				$p3 = 1;
        // 				$respuesta = $envio_mediador_condu['data']['success'];
        // 				$estado = 1;
        // 			} else if ($envio_mediador_condu['data']['success'] == 0 || $envio_mediador_condu['data']['success'] == 'false') {
        // 				$p3 = 2;
        // 				$respuesta = $envio_mediador_condu['data']['msgResp'];
        // 				$estado = 0;
        // 			}
        // 		}

        // 		if ($cantidad == 1) {
        // 			if (!isset($_SESSION['usuario']['nom_usuario'])) {
        // 				session_start();
        // 				$id_usuario = $_SESSION["usuario"]["nom_usuario"];
        // 			} else {
        // 				$id_usuario = $_SESSION["usuario"]["nom_usuario"];
        // 			}
        // 			if ($p1 == 1) {
        // 				$data['status'] = 'true';
        // 				$data['error'] = '';
        // 				$this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
        // 				echo json_encode($data);
        // 			} else if ($p1 == 2) {
        // 				$data['status'] = 'false';
        // 				$data['error'] = $envio_mediador_prop['data']['msgResp'];
        // 				$this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
        // 				echo json_encode($data);
        // 			}

        // 			if ($p2 == 1) {
        // 				$data['status'] = 'true';
        // 				$data['error'] = '';
        // 				$this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
        // 				echo json_encode($data);
        // 			} else if ($p2 == 2) {
        // 				$data['status'] = 'false';
        // 				$data['error'] = $envio_mediador_prose['data']['msgResp'];
        // 				$this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
        // 				echo json_encode($data);
        // 			}

        // 			if ($p3 == 1) {
        // 				$data['status'] = 'true';
        // 				$data['error'] = '';
        // 				$this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
        // 				echo json_encode($data);
        // 			} else if ($p3 == 2) {
        // 				$data['status'] = 'false';
        // 				$data['error'] = $envio_mediador_condu['data']['msgResp'];
        // 				$this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
        // 				echo json_encode($data);
        // 			}
        // 		} else {
        // 			if (!isset($_SESSION['usuario']['nom_usuario'])) {
        // 				session_start();
        // 				$id_usuario = $_SESSION["usuario"]["nom_usuario"];
        // 			} else {
        // 				$id_usuario = $_SESSION["usuario"]["nom_usuario"];
        // 			}
        // 			//combinaciones para retornar mensaje 
        // 			if ($cantidad == 3) {
        // 				if ($p3 == 1 && $p2 == 1 && $p1 == 1) { //todas las actividades
        // 					$data['status'] = 'true';
        // 					$data['error'] = '';
        // 					$this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
        // 					echo json_encode($data);
        // 				} else {
        // 					$data['status'] = 'false';
        // 					$data['error'] = $envio_mediador_condu['data']['msgResp'];
        // 					$this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
        // 					echo json_encode($data);
        // 				}
        // 			}
        // 			if ($cantidad == 2) {
        // 				if ($p3 == 1 && $p2 == 1) { //conductor - poseedor
        // 					$data['status'] = 'true';
        // 					$data['error'] = '';
        // 					$this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
        // 					echo json_encode($data);
        // 				} else if ($p3 == 2 && $p2 == 2) {
        // 					$data['status'] = 'false';
        // 					$data['error'] = $envio_mediador_condu['data']['msgResp'];
        // 					$this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
        // 					echo json_encode($data);
        // 				}

        // 				if ($p3 == 1 && $p1 == 1) { //conductor - propietario
        // 					$data['status'] = 'true';
        // 					$data['error'] = '';
        // 					$this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
        // 					echo json_encode($data);
        // 				} else if ($p3 == 2 && $p1 == 2) {
        // 					$data['status'] = 'false';
        // 					$data['error'] = $envio_mediador_condu['data']['msgResp'];
        // 					$this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
        // 					echo json_encode($data);
        // 				}

        // 				if ($p2 == 1 && $p1 == 1) { //poseedor - propietario
        // 					$data['status'] = 'true';
        // 					$data['error'] = '';
        // 					$this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
        // 					echo json_encode($data);
        // 				} else if ($p2 == 2 && $p1 == 2) {
        // 					$data['status'] = 'false';
        // 					$data['error'] = $envio_mediador_condu['data']['msgResp'];
        // 					$this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
        // 					echo json_encode($data);
        // 				}
        // 			}
        // 		}
        // 	}
        // }

        if ($_POST["recurso"] == 6) { // conductor - poseedor - propietario

            if (!isset($token_autentica)) {
                echo json_encode(["status" => false, "error" => "Token no encontrado"]);
                return;
            }

            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }

            $numeroDocumento = $_POST["numero"];
            $actividades     = $this->_modelo->Actividad_Tercero($numeroDocumento);

            if (!$actividades) {
                echo json_encode(["status" => false, "error" => "No se encontraron actividades para este tercero"]);
                return;
            }

            // ============================================================
            // Configuración de ambiente
            // ============================================================
            $empresa  = $this->_modelo->Consultar_ambientes();
            $conexion = $this->_modelo->Conexion_Proveedor(
                $empresa["nombre_ambiente"],
                $empresa["empresa_id"]
            );

            if (!$conexion) {
                echo json_encode(["status" => false, "error" => "Ambiente no configurado"]);
                return;
            }

            $isProd = ($empresa["nombre_ambiente"] == "PRODUCCION");
            $auth   = $isProd
                ? "1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p"
                : "21b2e5c191e46165607c23cc48779c61e08972d5";

            // ============================================================
            // Manejo de respuestas por actividad
            // ============================================================
            $respPropietario = null;
            $respPoseedor    = null;
            $respConductor   = null;

            // ============================================================
            // Función auxiliar para enviar a OET
            // ============================================================
            $enviarOET = function ($url, $body) use ($auth, $token_autentica) {
                $opts = [
                    "http" => [
                        "method" => "POST",
                        "header" =>
                        "Content-Type: application/json\r\n" .
                            "Authorization: {$auth}\r\n" .
                            "TOKEN: {$token_autentica}\r\n",
                        "content" => json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                        "timeout" => 30
                    ]
                ];
                $ctx = stream_context_create($opts);
                $raw = @file_get_contents($url, false, $ctx);

                if ($raw === false) {
                    return ["success" => false, "msg" => "Error conectando con OET"];
                }

                $res = json_decode($raw, true);
                return [
                    "success" => ($res["data"]["success"] == 1 || $res["data"]["success"] == "true"),
                    "msg"     => $res["data"]["msgResp"] ?? ""
                ];
            };

            // ============================================================
            // PROCESAR CADA ACTIVIDAD
            // ============================================================
            foreach ($actividades as $row) {

                $actividad = $row["actividad"];

                // ------------------------------------------------------------
                // Obtener detalle del tercero según actividad
                // ------------------------------------------------------------
                $recursoMapa = [
                    "Propietario Vehiculo" => 3,
                    "Poseedor Vehiculo"    => 5,
                    "Conductor"            => 4
                ];

                if (!isset($recursoMapa[$actividad])) continue;

                $tipoRecurso = $recursoMapa[$actividad];
                $t           = $this->_modelo->Datos_Tercero($tipoRecurso, $numeroDocumento);

                if (!$t) continue;

                // ===============================================
                // HOMOLOGACIONES COMUNES
                // ===============================================
                $tipoDocMapa = [
                    "Cedula de Ciudadania" => "C",
                    "Cedula de Extranjeria" => "E",
                    "NIT" => "N"
                ];
                $td = $tipoDocMapa[$t["tipo_documento"]] ?? "C";

                $apellido1 = !empty($t["apellido1"]) ? trim($t["apellido1"]) : null;
                $apellido2 = !empty($t["apellido2"]) ? trim($t["apellido2"]) : null;

                $telefono  = !empty($t["contacto"]) ? $t["contacto"] : null;
                $email     = !empty($t["email"]) ? $t["email"] : null;

                $abreviatura = trim($t["abreviatura"] ?? ($t["nombre"] . " " . $t["apellido1"]));

                // ============================================================
                // ACT 1: PROPIETARIO
                // ============================================================
                if ($actividad == "Propietario Vehiculo") {

                    $body = [
                        "cod_tipdoc" => $td,
                        "cod_activi" => 15,
                        "cod_tercer" => (int)$t["numero_documento"],
                        "num_verifi" => (int)$t["digito_verificacion"],
                        "nom_tercer" => trim($t["nombre"]),
                        "nom_apell1" => $apellido1,
                        "nom_apell2" => $apellido2,
                        "abr_tercer" => $abreviatura,
                        "num_telef1" => $telefono,
                        "num_telmov" => $t["celular"],
                        "dir_tercer" => trim($t["direccion"]),
                        "dir_emailx" => $email,
                        "cod_ciudad" => (int)$t["rndc_codigo_ciudad"]
                    ];

                    $url = $isProd
                        ? $conexion["URL_CONSULTA_PROPIETARIO_PRINCIPAL"]
                        : $conexion["URL_CONSULTA_PROPIETARIO_PRUEBA"];

                    $respPropietario = $enviarOET($url, $body);
                }

                // ============================================================
                // ACT 2: POSEEDOR
                // ============================================================
                if ($actividad == "Poseedor Vehiculo") {

                    $body = [
                        "cod_tipdoc" => $td,
                        "cod_activi" => 18,
                        "cod_tercer" => (int)$t["numero_documento"],
                        "num_verifi" => (int)$t["digito_verificacion"],
                        "nom_tercer" => trim($t["nombre"]),
                        "nom_apell1" => $apellido1,
                        "nom_apell2" => $apellido2,
                        "abr_tercer" => $abreviatura,
                        "num_telef1" => $telefono,
                        "num_telmov" => $t["celular"],
                        "dir_tercer" => trim($t["direccion"]),
                        "dir_emailx" => $email,
                        "cod_ciudad" => (int)$t["rndc_codigo_ciudad"]
                    ];

                    $url = $isProd
                        ? $conexion["URL_CONSULTA_POSEEDOR_PRINCIPAL"]
                        : $conexion["URL_CONSULTA_POSEEDOR_PRUEBA"];

                    $respPoseedor = $enviarOET($url, $body);
                }

                // ============================================================
                // ACT 3: CONDUCTOR
                // ============================================================
                if ($actividad == "Conductor") {

                    // Grupo sanguíneo
                    $sangreMap = [
                        "O-" => "O (-)",
                        "O+" => "O (+)",
                        "A-" => "A (-)",
                        "A+" => "A (+)",
                        "B-" => "B (-)",
                        "B+" => "B (+)",
                        "AB-" => "AB (-)",
                        "AB+" => "AB (+)"
                    ];

                    $sangre = $sangreMap[$t["grupo_sanguineo"]] ?? null;

                    // Genero
                    $genero = $t["sexo"] == "Masculino" ? 1 : 2;

                    // Licencia
                    $cat = [
                        "4" => 4,
                        "5" => 5,
                        "6" => 6,
                        "C1" => 7,
                        "C2" => 8,
                        "C3" => 9
                    ][$t["rndc_categoria_licencia"]] ?? 4;

                    $body = [
                        "cod_tipdoc" => $td,
                        "cod_activi" => 16,
                        "cod_tercer" => (int)$t["numero_documento"],
                        "num_verifi" => (int)$t["digito_verificacion"],
                        "nom_tercer" => trim($t["nombre"]),
                        "nom_apell1" => $apellido1,
                        "nom_apell2" => $apellido2,
                        "abr_tercer" => $abreviatura,
                        "num_telef1" => $telefono,
                        "num_telmov" => $t["celular"],
                        "dir_tercer" => trim($t["direccion"]),
                        "dir_emailx" => $email,
                        "cod_ciudad" => (int)$t["rndc_codigo_ciudad"],
                        "fec_nacimi" => $t["fecha_nacimiento"] ?? "0000-00-00",
                        "cod_grupsa" => $sangre,
                        "cod_genero" => $genero,
                        "num_catlic" => $cat,
                        "num_licenc" => $t["rndc_numero_licencia"],
                        "fec_venlic" => $t["rndc_vencimiento_licencia"],
                        "dat_refemp" => [[
                            "nom_empres" => trim($t["nombre_empresa"]),
                            "fec_ingres" => $t["fecha_ingreso"],
                            "fec_retiro" => $t["fecha_retiro"],
                            "nom_contac" => trim($t["persona_contacto"]),
                            "tel_contac" => $t["celular"],
                            "car_contac" => trim($t["cargo"]),
                            "num_atigue" => $t["antiguedad"]
                        ]],
                        "dat_refper" => [[
                            "nom_refper" => trim($t["nombre_personal"]),
                            "nom_parntc" => trim($t["parentesco_txt"]),
                            "tel_refper" => $t["tel_personal"]
                        ]]
                    ];

                    $url = $isProd
                        ? $conexion["URL_CONSULTA_CONDUCTOR_PRINCIPAL"]
                        : $conexion["URL_CONSULTA_CONDUCTOR_PRUEBA"];

                    $respConductor = $enviarOET($url, $body);
                }
            }

            // ============================================================
            // Determinar la respuesta final
            // ============================================================

            $final = $respConductor ?? $respPoseedor ?? $respPropietario;

            echo json_encode([
                "status" => $final["success"] ? "true" : "false",
                "error"  => $final["success"] ? "" : $final["msg"]
            ]);
        }

        if ($_POST["recurso"] == 1) { //orden cargue
            if (isset($token_autentica)) {
                $recurso = 1;
                $numero = $_POST["numero"];
                $mediador_documentos = $this->_modelo->Datos_Documento_Retransmite($recurso, $numero);
                /* CONSULTAR AGENCIA Y AMBIENTE */
                $empresa = $this->_modelo->Consultar_ambientes();
                if ($empresa['nombre_ambiente'] == "PRODUCCION") {
                    /* CONSULTAR LA URL DE CONEXION  */
                    $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                    if ($conexion) {
                        $url_consulta_med = $conexion['URL_MEDIADO_ORDEN_CARGUE_PRINCIPAL'];
                        $autorizacion_ambiente = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
                    } else {
                        echo "Error de conexion Principal";
                    }
                } else {
                    /* CONSULTAR LA URL DE CONEXION  */
                    $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                    if ($conexion) {
                        $url_consulta_med = $conexion['URL_MEDIADO_ORDEN_CARGUE_PRUEBA'];
                        $autorizacion_ambiente = '21b2e5c191e46165607c23cc48779c61e08972d5';
                    } else {
                        echo "Error Conexion Prueba";
                    }
                }
                //Homologar y validar datos
                $uniser = '';
                $tipo_documentor = '';
                $precinto = '';
                $agencia = '';
                $tipo_documentod = '';
                $fechaorden = ($mediador_documentos[0]['fecha_orden']);
                if ($mediador_documentos[0]['tipo_servicio_mer'] == 'Consolidado') {
                    $uniser = '2';
                } else if ($mediador_documentos[0]['tipo_servicio_mer'] == 'Expreso') {
                    $uniser = '1';
                }
                //
                if ($mediador_documentos[0]['td_rem'] == 'NIT') {
                    $tipo_documentor = 'N';
                } else if ($mediador_documentos[0]['td_rem'] == 'Cedula de Ciudadania') {
                    $tipo_documentor = 'C';
                } else if ($mediador_documentos[0]['td_rem'] == 'Cedula de Extranjeria') {
                    $tipo_documentor = 'E';
                }

                if ($mediador_documentos[0]['td_des'] == 'NIT') {
                    $tipo_documentod = 'N';
                } else if ($mediador_documentos[0]['td_des'] == 'Cedula de Ciudadania') {
                    $tipo_documentod = 'C';
                } else if ($mediador_documentos[0]['td_des'] == 'Cedula de Extranjeria') {
                    $tipo_documentod = 'E';
                }

                //precinto
                if (isset($mediador_documentos[0]['tipo_precinto'])) {
                    if ($mediador_documentos[0]['tipo_precinto'] == 'Plastico') {
                        $precinto = 'null';
                    } else if ($mediador_documentos[0]['tipo_precinto'] == 'Metalico') {
                        $precinto = 'null';
                    } else if ($mediador_documentos[0]['tipo_precinto'] == 'Botella') {
                        $precinto = '2';
                    } else if ($mediador_documentos[0]['tipo_precinto'] == 'Correilla') {
                        $precinto = '3';
                    } else if ($mediador_documentos[0]['tipo_precinto'] == 'Adhesivo') {
                        $precinto = '1';
                    }
                }
                //Agencias
                if ($mediador_documentos[0]['codigo'] == 'BOG') {
                    $agencia = 1;
                } else if ($mediador_documentos[0]['codigo'] == 'CTG') {
                    $agencia = 2;
                } else if ($mediador_documentos[0]['codigo'] == 'BAQ') {
                    $agencia = 13;
                } else if ($mediador_documentos[0]['codigo'] == 'BUN') {
                    $agencia = 3;
                }
                //precintos

                if (!empty($mediador_documentos[0]['serie_precinto'])) {
                    $precinto = [
                        [
                            "num_precin" => $mediador_documentos[0]['serie_precinto'],
                            "tip_precin" => $precinto  // si este es un valor numérico o string, cámbialo directo
                        ]
                    ];
                } else {
                    $precinto = [];
                }

                //Tipo empaque
                if ($mediador_documentos[0]['tipo_empaque'] == 1) { //Carga estibada
                    $empaque = 22;
                } else if ($mediador_documentos[0]['tipo_empaque'] == 2) { //NA
                    $empaque = 20;
                } else if ($mediador_documentos[0]['tipo_empaque'] == 3) { //Varios
                    $empaque = 19;
                } else if ($mediador_documentos[0]['tipo_empaque'] == 4) { //granel solido
                    $empaque = 21;
                } else if ($mediador_documentos[0]['tipo_empaque'] == 5) { //cilindros
                    $empaque = 17;
                } else if ($mediador_documentos[0]['tipo_empaque'] == 6) { //bultos
                    $empaque = 4;
                } else if ($mediador_documentos[0]['tipo_empaque'] == 7) { //granel liquido
                    $empaque = 13;
                } else if ($mediador_documentos[0]['tipo_empaque'] == 8) { //contenedor 40 pies
                    $empaque = 16;
                } else if ($mediador_documentos[0]['tipo_empaque'] == 9) { //contenedor 2 40 pies 
                    $empaque = 8;
                } else if ($mediador_documentos[0]['tipo_empaque'] == 10) { //contenedor 20 pies
                    $empaque = 7;
                } else if ($mediador_documentos[0]['tipo_empaque'] == 11) { //paquetes
                    $empaque = 12;
                }
                $valor_tarifa = '"' . $mediador_documentos[0]['ve_tarifacalculada'] . '"';
                $tarifa = trim($valor_tarifa, ',');

                //pasar de kilogramos a toneladas
                $peso = $mediador_documentos[0]['ca_pesocargue'];
                $tonelada = (($peso) * (0.001));
                $resultado = $tonelada;

                $tel = $mediador_documentos[0]['tel_des'] ?? null;

                if ($tel !== null && $tel[0] !== '3') {
                    $tel = null;
                }

                $body = [
                    "fec_ordenx" => $fechaorden,
                    "num_ordenx" => (int)$mediador_documentos[0]['id'],
                    "cod_mercan" => (int)$mediador_documentos[0]['mercancia_avansat'],
                    "cod_uniser" => (int)$uniser,
                    "cod_agenci" => (int)$agencia,
                    "cod_client" => (int)$mediador_documentos[0]['nit_cliente'],

                    "dat_vehicu" => [
                        "num_placax" => $mediador_documentos[0]['placa'],
                        "cod_conduc" => (int)$mediador_documentos[0]['documento_conductor'],
                        "cod_propie" => (int)$mediador_documentos[0]['documento_propietario'],
                        "cod_tenedo" => (int)$mediador_documentos[0]['documento_poseedor'],
                    ],

                    "dat_remite" => [
                        "cod_tipdoc" => $tipo_documentor,
                        "num_docume" => (int)$mediador_documentos[0]['doc_rem'],
                        "nom_remite" => $mediador_documentos[0]['nom_rem'],
                        "cod_ciudad" => (int)$mediador_documentos[0]['ciu_rem'],
                        "tel_remite" => (int)trim($mediador_documentos[0]['tel_rem']),
                        "dir_remite" => $mediador_documentos[0]['dir_rem']
                    ],

                    "dat_destin" => [
                        "cod_tipdoc" => $tipo_documentod,
                        "num_docume" => (int)$mediador_documentos[0]['num_des'],
                        "nom_destin" => $mediador_documentos[0]['nom_des'],
                        "cod_ciudad" => (int)$mediador_documentos[0]['ciu_des'],
                        "tel_destin" => (int)trim($tel), // ← AQUÍ YA NO HAY ERRORES
                        "dir_destin" => $mediador_documentos[0]['dir_des'],
                    ],

                    "dat_precin" => $precinto,

                    "dat_genera" => [
                        "cod_tipemp"  => (int)$empaque,
                        "cod_uniemp"  => (int)$mediador_documentos[0]['cantidad_empaque'],
                        "val_volume"  => $mediador_documentos[0]['mer_volumen'],
                        "val_pesoxx"  => $resultado,
                        "num_conte1"  => $mediador_documentos[0]['devol_numcont'],
                        "num_conte2"  => $mediador_documentos[0]['mer_contenedor2'],
                        "fec_citcar"  => $mediador_documentos[0]['fecha_estimada_entrega'],
                        "obs_genera"  => $mediador_documentos[0]['ca_observacion']
                    ],

                    "dat_tarifa" => [
                        "fle_pagarx" => $mediador_documentos[0]['ve_fletepactado'],
                        "fle_cobrar" => (float)$tarifa
                    ]
                ];

                $opcion_mediador = [
                    'http' => [
                        'method'  => 'POST',
                        'header'  =>
                        "Content-Type: application/json\r\n" .
                            "Authorization: {$autorizacion_ambiente}\r\n" .
                            "TOKEN: {$token_autentica}\r\n",
                        'content' => json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
                    ]
                ];


                $context_ordencargue = stream_context_create($opcion_mediador);
                $consulta_med_oc = file_get_contents($url_consulta_med, false, $context_ordencargue);
                $envio_mediador_oc = json_decode($consulta_med_oc, true);

                $documento = $mediador_documentos[0]['id'];
                $cadena_oet = json_encode($opcion_mediador);
                if (!isset($_SESSION['usuario']['nom_usuario'])) {
                    session_start();
                    $id_usuario = $_SESSION["usuario"]["nom_usuario"];
                } else {
                    $id_usuario = $_SESSION["usuario"]["nom_usuario"];
                }
                $identificador = 'OrdenCargue';
                $agencia_id = $empresa['empresa_id'];
                if ($envio_mediador_oc['data']['status'] == 1 || $envio_mediador_oc['data']['status'] == 'true') {
                    $data['status'] = 'true';
                    $data['error'] = '';
                    $data['id_orden'] = $mediador_documentos[0]['id'];
                    $respuesta = $data['status'];
                    $estado = 1;
                    $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                    echo json_encode($data);
                } else if ($envio_mediador_oc['data']['status'] == 0 || $envio_mediador_oc['data']['status'] == 'false') {
                    $data['status'] = 'false';
                    $data['error'] = $envio_mediador_oc['data']['message'];
                    $data['id_orden'] = $mediador_documentos[0]['id'];
                    $respuesta = $envio_mediador_oc['data']['message'];
                    $estado = 0;
                    $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                    echo json_encode($data);
                }
            }
        }

        if ($_POST["recurso"] == 2) { // REMESA

            if (!isset($token_autentica)) {
                echo json_encode(["status" => false, "error" => "Token no encontrado"]);
                return;
            }

            // Asegurar sesión
            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }

            $numero  = (int)$_POST["numero"];
            $recurso = 2;

            // Obtener datos
            $mediador_documentos = $this->_modelo->Datos_Documento_Retransmite($recurso, $numero);
            $empresa             = $this->_modelo->Consultar_ambientes();

            if (!$mediador_documentos || !isset($mediador_documentos[0])) {
                echo json_encode(["status" => false, "error" => "Documento no encontrado"]);
                return;
            }

            // =======================================================
            // 1. Definir ambiente
            // =======================================================
            $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);

            if (!$conexion) {
                echo json_encode(["status" => false, "error" => "No existe configuración del proveedor"]);
                return;
            }

            if ($empresa['nombre_ambiente'] === "PRODUCCION") {
                $url_consulta_med      = $conexion['URL_MEDIADOR_REMESA_PRINCIPAL'];
                $autorizacion_ambiente = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
            } else {
                $url_consulta_med      = $conexion['URL_MEDIADOR_REMESA_PRUEBA'];
                $autorizacion_ambiente = '21b2e5c191e46165607c23cc48779c61e08972d5';
            }

            // =======================================================
            // 2. Preparar datos
            // =======================================================
            foreach ($mediador_documentos as $remesa_oet) {

                // BOOLEANOS para OET
                $recontado = $remesa_oet['remesa_contado']       ? 1 : null;
                $reseguro  = $remesa_oet['aplica_seguro']        ? 1 : null;
                $recontra  = $remesa_oet['remesa_contraentrega'] ? 1 : null;

                // Tipo de servicio
                $tiposer = ($remesa_oet['tipo_servicio_mer'] === "Expreso") ? 1 : 2;

                // Homologar horas
                $hor_desc = str_pad($remesa_oet['horaspactodescargue'], 2, "0", STR_PAD_LEFT);
                $min_desc = str_pad($remesa_oet['minutospactodescargue'], 2, "0", STR_PAD_LEFT);

                // =======================================================
                // 3. Construir JSON en ARRAY (forma correcta)
                // =======================================================

                $body = [
                    "fec_remesa" => $remesa_oet['fecha_creacion'] . " " . $remesa_oet['hora_remesa'],
                    "cod_remesa" => (int)$remesa_oet['num_remesa'],
                    "num_ordenx" => (int)$remesa_oet['id_orden_cargue'],
                    "rem_contad" => $recontado,
                    "rem_conent" => $recontra,
                    "val_declar" => (string)$remesa_oet['total_tarifa'],
                    "apl_seguro" => $reseguro,

                    "fec_cargue" => $remesa_oet['fecha_cargue'] . " " . $remesa_oet['hora_cargue'],
                    "hor_cargue" => sprintf("%02d:%02d", $remesa_oet['horaspactocarga'], $remesa_oet['minutospactocarga']),

                    "fec_descar" => $remesa_oet['fecha_descargue'] . ' ' . date("H:i", strtotime($remesa_oet['hora_descarga'])),
                    "hor_descar" => "{$hor_desc}:{$min_desc}",

                    "can_cargad" => (int)$remesa_oet['mer_cantidad'],
                    "cod_uniser" => $tiposer,
                    "cod_unimed" => 1,
                    "val_factur" => "10000",
                    "tip_operac" => $remesa_oet['tipo_carga'],
                    "obs_remesa" => $remesa_oet['rem_observacion'] ?? "",
                ];

                // =======================================================
                // 4. Opciones HTTP seguras
                // =======================================================
                $opcion_mediador = [
                    "http" => [
                        "method"  => "POST",
                        "header"  =>
                        "Content-Type: application/json\r\n" .
                            "Authorization: {$autorizacion_ambiente}\r\n" .
                            "TOKEN: {$token_autentica}\r\n",
                        "content" => json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                        "timeout" => 20
                    ]
                ];

                // =======================================================
                // 5. Consumir API
                // =======================================================
                $context = stream_context_create($opcion_mediador);
                $respuesta_raw = @file_get_contents($url_consulta_med, false, $context);

                if ($respuesta_raw === false) {
                    echo json_encode(["status" => false, "error" => "Error de conexión con OET"]);
                    return;
                }

                $respuesta = json_decode($respuesta_raw, true);

                // Guardar LOG
                $estado_oet = ($respuesta['data']['status'] == 1 || $respuesta['data']['status'] == "true") ? 1 : 0;
                $msg_oet    = $respuesta['data']['message'] ?? "OK";

                $this->_modelo->log_avansat(
                    $remesa_oet['num_remesa'],
                    json_encode($body),
                    $msg_oet,
                    $_SESSION['usuario']['nom_usuario'],
                    $estado_oet,
                    "Remesa",
                    $empresa['empresa_id']
                );

                // =======================================================
                // 6. Enviar respuesta limpia
                // =======================================================
                echo json_encode([
                    "status"     => $estado_oet ? "true" : "false",
                    "error"      => $estado_oet ? "" : $msg_oet,
                    "id_remesa"  => $remesa_oet['num_remesa']
                ]);
            } // end foreach
        }

        // if ($_POST["recurso"] == 2) { //remesa
        // 	if (isset($token_autentica)) {
        // 		$recurso = 2;
        // 		$numero = $_POST["numero"];
        // 		$mediador_documentos = $this->_modelo->Datos_Documento_Retransmite($recurso, $numero);
        // 		/* CONSULTAR AGENCIA Y AMBIENTE */
        // 		$empresa = $this->_modelo->Consultar_ambientes();
        // 		if ($empresa['nombre_ambiente'] == "PRODUCCION") {
        // 			/* CONSULTAR LA URL DE CONEXION  */
        // 			$conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
        // 			if ($conexion) {
        // 				$url_consulta_med = $conexion['URL_MEDIADOR_REMESA_PRINCIPAL'];
        // 				$autorizacion_ambiente = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
        // 			} else {
        // 				echo "Error de conexion Principal";
        // 			}
        // 		} else {
        // 			/* CONSULTAR LA URL DE CONEXION  */
        // 			$conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
        // 			if ($conexion) {
        // 				$url_consulta_med = $conexion['URL_MEDIADOR_REMESA_PRUEBA'];
        // 				$autorizacion_ambiente = '21b2e5c191e46165607c23cc48779c61e08972d5';
        // 			} else {
        // 				echo "Error Conexion Prueba";
        // 			}
        // 		}
        // 		$recontado = '';
        // 		$reseguro = '';
        // 		$recontra = '';
        // 		$tiposer = '';
        // 		$fecha_remesa = '';
        // 		foreach ($mediador_documentos as $remesa_oet) {
        // 			$fecha_remesa = ($remesa_oet['fecha_creacion'] . ' ' . $remesa_oet['hora_remesa']);
        // 			if ($remesa_oet['remesa_contado'] == 1) {
        // 				$recontado = 1;
        // 			} else if ($remesa_oet['remesa_contado'] == 0) {
        // 				$recontado = 'null';
        // 			}

        // 			if ($remesa_oet['aplica_seguro'] == 1) {
        // 				$reseguro = 1;
        // 			} else if ($remesa_oet['aplica_seguro'] == 0) {
        // 				$reseguro = 'null';
        // 			}

        // 			if ($remesa_oet['remesa_contraentrega'] == 1) {
        // 				$recontra = 1;
        // 			} else if ($remesa_oet['remesa_contraentrega'] == 0) {
        // 				$recontra = 'null';
        // 			}

        // 			if ($remesa_oet['tipo_servicio_mer'] == 'Expreso') {
        // 				$tiposer = 1;
        // 			} else if ($remesa_oet['tipo_servicio_mer'] == 'Consolidado') {
        // 				$tiposer = 2;
        // 			}

        // 			#Homologacion de horas de formato de 12 a 24
        // 			$horaspactodescargue = str_pad($remesa_oet['horaspactodescargue'], 2, '0', STR_PAD_LEFT);
        // 			$minutospactodescargue = str_pad($remesa_oet['minutospactodescargue'], 2, '0', STR_PAD_LEFT);


        // 			// $respuesta_remesa = $remesa_oet['rta_ministerio'];
        // 			// $radicado_remesa = new SimpleXMLElement($respuesta_remesa);
        // 			// $ingresoid = (string) $radicado_remesa->ingresoid;

        // 			// print_r($ingresoid);
        // 			// exit();

        // 			$opcion_mediador = array(
        // 				'http' =>
        // 				array(
        // 					'method' => 'POST',
        // 					'header' => "Content-Type:application/json\r\n" .
        // 						"Authorization:" . $autorizacion_ambiente . "\r\n" .
        // 						"TOKEN:" . $token_autentica . "\r\n",
        // 					'content' =>
        // 					'{' .
        // 						'"fec_remesa":' . '"' . $fecha_remesa . '"' . "," .
        // 						'"cod_remesa":' . $remesa_oet['num_remesa'] . "," .
        // 						// '"num_radica":' . $ingresoid . "," .
        // 						'"num_ordenx":' . $remesa_oet['id_orden_cargue'] . "," .
        // 						'"rem_contad":' . $recontado . "," .
        // 						'"rem_conent":' . $recontra . "," .
        // 						'"val_declar":' . '"' . $remesa_oet['total_tarifa'] . '"' . "," .
        // 						'"apl_seguro":' . $reseguro . "," .
        // 						'"fec_cargue":' . '"' . $remesa_oet['fecha_cargue'] . ' ' . $remesa_oet['hora_cargue'] . '"' . "," .
        // 						'"hor_cargue":' . '"' . $remesa_oet['horaspactocarga'] . ':' . $remesa_oet['minutospactocarga'] . '"' . "," .
        // 						// '"hor_cargue":' . '"' . sprintf("%02d:%02d", $remesa_oet['horaspactocarga'] . ':' . $remesa_oet['minutospactocarga']) . '"' . "," .
        // 						// '"fec_descar":' . '"' . $remesa_oet['fecha_descargue'] . ' ' . $remesa_oet['hora_descarga'] . '"' . "," .
        // 						'"fec_descar":' . '"' . $remesa_oet['fecha_descargue'] . ' ' . date("H:i", strtotime($remesa_oet['hora_descarga'])) . '"' . "," .
        // 						'"hor_descar":' . '"' . $horaspactodescargue . ':' . $minutospactodescargue . '"' . "," .
        // 						// '"hor_descar":' . '"' . sprintf("%02d:%02d", $horaspactodescargue . ':' . $minutospactodescargue) . '"' . "," .
        // 						// '"hor_descar":' . '"' . $remesa_oet['horaspactodescargue'] . ':' . $remesa_oet['minutospactodescargue'] . '"' . "," .
        // 						'"can_cargad":' . $remesa_oet['mer_cantidad'] . "," .
        // 						'"cod_uniser":' . $tiposer . "," .
        // 						'"cod_unimed":' . 1 . "," .
        // 						'"val_factur":' . '"' . 10000 . '"' . "," .
        // 						'"tip_operac":' . '"' . $remesa_oet['tipo_carga'] . '"' . "," .
        // 						'"obs_remesa":' . '" "' .
        // 						'}'
        // 				)
        // 			);

        // 			$context_ordencargue = stream_context_create($opcion_mediador);
        // 			$consulta_med_oc = file_get_contents($url_consulta_med, false, $context_ordencargue);
        // 			$envio_mediador_rm = json_decode($consulta_med_oc, true);
        // 			$documento = $remesa_oet['num_remesa'];
        // 			$cadena_oet = json_encode($opcion_mediador);
        // 			if (!isset($_SESSION['usuario']['nom_usuario'])) {
        // 				session_start();
        // 				$id_usuario = $_SESSION["usuario"]["nom_usuario"];
        // 			} else {
        // 				$id_usuario = $_SESSION["usuario"]["nom_usuario"];
        // 			}
        // 			$identificador = 'Remesa';
        // 			$agencia_id = $empresa['empresa_id'];
        // 			//print_r($envio_mediador_rm);	
        // 			if ($envio_mediador_rm['data']['status'] == 1 || $envio_mediador_rm['data']['status'] == 'true') {
        // 				$data['status'] = 'true';
        // 				$data['error'] = '';
        // 				$data['id_remesa'] = $remesa_oet['num_remesa'];
        // 				$respuesta = $data['status'];
        // 				$estado = 1;
        // 				$log_avansat = $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
        // 				echo json_encode($data);
        // 			} else if ($envio_mediador_rm['data']['status'] == 0 || $envio_mediador_rm['data']['status'] == 'false') {
        // 				$data['status'] = 'false';
        // 				$data['error'] = $envio_mediador_rm['data']['message'];
        // 				$data['id_remesa'] = $mediador_documentos[0]['num_remesa'];
        // 				$respuesta = $envio_mediador_rm['data']['message'];
        // 				$estado = 0;
        // 				$log_avansat = $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
        // 				echo json_encode($data);
        // 			}
        // 		}
        // 	}
        // }

        // if ($_POST["recurso"] == 3) { //manifiesto
        // 	if (isset($token_autentica)) {
        // 		$recurso = 3;
        // 		$numero = $_POST["numero"];
        // 		$mediador_documentos = $this->_modelo->Datos_Documento_Retransmite($recurso, $numero);
        // 		/* CONSULTAR AGENCIA Y AMBIENTE */
        // 		$empresa = $this->_modelo->Consultar_ambientes();
        // 		if ($empresa['nombre_ambiente'] == "PRODUCCION") {
        // 			/* CONSULTAR LA URL DE CONEXION  */
        // 			$conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
        // 			if ($conexion) {
        // 				$url_consulta_med = $conexion['URL_MEDIADOR_MANIFIESTO_PRINCIPAL'];
        // 				$autorizacion_ambiente = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
        // 			} else {
        // 				echo "Error de conexion Principal";
        // 			}
        // 		} else {
        // 			/* CONSULTAR LA URL DE CONEXION  */
        // 			$conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
        // 			if ($conexion) {
        // 				$url_consulta_med = $conexion['URL_MEDIADOR_MANIFIESTO_PRUEBA'];
        // 				$autorizacion_ambiente = '21b2e5c191e46165607c23cc48779c61e08972d5';
        // 			} else {
        // 				echo "Error Conexion Prueba";
        // 			}
        // 		}
        // 		//homologar
        // 		$tipoma = '';
        // 		$pagador = '';
        // 		$dpagador = '';
        // 		if ($mediador_documentos[0]['tipo_manifiesto'] == 1) {
        // 			$tipoma = 'G';
        // 		} else if ($mediador_documentos[0]['tipo_manifiesto'] == 2) {
        // 			$tipoma = 'P';
        // 		} else if ($mediador_documentos[0]['tipo_manifiesto'] == 8) {
        // 			$tipoma = 'I';
        // 		} else if ($mediador_documentos[0]['tipo_manifiesto'] == 3) {
        // 			$tipoma = 'W';
        // 		} else if ($mediador_documentos[0]['tipo_manifiesto'] == 4) {
        // 			$tipoma = 'G';
        // 		}

        // 		if ($mediador_documentos[0]['cargue_pagado'] == 1) {
        // 			$pagador = 'E';
        // 		} else if ($mediador_documentos[0]['cargue_pagado'] == 2) {
        // 			$pagador = 'D';
        // 		} else if ($mediador_documentos[0]['cargue_pagado'] == 3) {
        // 			$pagador = 'R';
        // 		} else if ($mediador_documentos[0]['cargue_pagado'] == 4) {
        // 			$pagador = 'C';
        // 		}
        // 		if ($mediador_documentos[0]['descargue_pagado'] == 1) {
        // 			$dpagador = 'E';
        // 		} else if ($mediador_documentos[0]['descargue_pagado'] == 2) {
        // 			$dpagador = 'D';
        // 		} else if ($mediador_documentos[0]['descargue_pagado'] == 3) {
        // 			$dpagador = 'R';
        // 		} else if ($mediador_documentos[0]['descargue_pagado'] == 4) {
        // 			$dpagador = 'C';
        // 		}

        // 		$num_autorizacion = $mediador_documentos[0]['num_autorizacion'];
        // 		$agencia_generacion_documento = $mediador_documentos[0]['id_extermo'];

        // 		//homologar cifras
        // 		$flete = str_replace(',', '', $mediador_documentos[0]['valor_total_viaje']);
        // 		$retefuente = str_replace(',', '', $mediador_documentos[0]['retencion_fuente']);
        // 		$reteica = str_replace(',', '', $mediador_documentos[0]['rete_ica']);
        // 		$neto = str_replace(',', '', $mediador_documentos[0]['neto_pagar']);
        // 		$remesas_cantidad = $this->_modelo->Cant_Remesa($recurso, $numero);
        // 		$remesa_enviar = '';
        // 		$coma = '';
        // 		if ($remesas_cantidad) {
        // 			$contador = 0;
        // 			$remesa_enviar .= '"dat_remesa":[';
        // 			foreach ($remesas_cantidad as $valor_remesa) {
        // 				$contador++;
        // 				if ($contador > 1) {
        // 					$coma = ',';
        // 				}

        // 				$respuesta_remesa = $valor_remesa['rta_ministerio'];
        // 				$radicado_remesa = new SimpleXMLElement($respuesta_remesa);
        // 				$ingresoid = (string) $radicado_remesa->ingresoid;
        // 				// $remesa_enviar .= $coma . '{"cod_remesa":"' . $valor_remesa['id_remesa'] . '","num_autori":"10257904"}';
        // 				$remesa_enviar .= $coma . '{"cod_remesa":"' . $valor_remesa['id_remesa'] . '","num_autori":"' . $ingresoid . '"}';
        // 			}
        // 			$remesa_enviar .= ']}';
        // 		} else {
        // 			$remesa_enviar = '"dat_remesa":[]}';
        // 		}
        // 		$fec1 = ($mediador_documentos[0]['fecha_expedicion'] . ' ' . $mediador_documentos[0]['hora_expedicion']);
        // 		$fecha_expedicion = substr($fec1, 0, 16);


        // 		//echo $mediador_documentos[0]['placa_trailer'];
        // 		$trailer = 'null';
        // 		if ($mediador_documentos[0]['placa_trailer'] !== 'no') {
        // 			$trailer = '"' . $mediador_documentos[0]['placa_trailer'] . '"';
        // 		} else if ($mediador_documentos[0]['placa_trailer'] == 'no') {
        // 			$trailer = 'null';
        // 		}


        // 		$anticipo = 'null';
        // 		if ($mediador_documentos[0]['anticipo'] !== 'no') {
        // 			$anticipob = str_replace(',', '', $mediador_documentos[0]['anticipo']);
        // 			$anticipo = '"' . $anticipob . '"';
        // 		} else if ($mediador_documentos[0]['anticipo'] == 'no') {
        // 			$anticipo = 'null';
        // 		}

        // 		$obser = trim($mediador_documentos[0]['observacion']);


        // 		$opcion_mediador = array(
        // 			'http' =>
        // 			array(
        // 				'method' => 'POST',
        // 				'header' => "Content-Type:application/json\r\n" .
        // 					"Authorization:" . $autorizacion_ambiente . "\r\n" .
        // 					"TOKEN:" . $token_autentica . "\r\n",
        // 				'content' =>
        // 				'{' .
        // 					'"cod_manifi":' . $mediador_documentos[0]['id'] . "," .
        // 					'"cod_agedes":' . '"' . $agencia_generacion_documento . '"' . "," .
        // 					'"num_autori":' . '"' . $num_autorizacion . '"' . "," .
        // 					'"num_placax":' . '"' . $mediador_documentos[0]['placa'] . '"' . "," .
        // 					'"cod_conduc":' . $mediador_documentos[0]['conductor_manifiesto'] . "," .
        // 					'"num_trayle":' . $trailer . "," .
        // 					'"fec_expedi":' . '"' . $fecha_expedicion . '"' . "," .
        // 					'"cod_tipman":' . '"' . $tipoma . '"' . "," .
        // 					'"cod_ciuori":' . $mediador_documentos[0]['origen'] . "," .
        // 					'"cod_ciudes":' . $mediador_documentos[0]['destino'] . "," .
        // 					'"cod_propie":' . '"' . $mediador_documentos[0]['nombre_propietario'] . '"' . "," .
        // 					'"cod_carpag":' . '"' . $pagador . '"' . "," .
        // 					'"cod_despag":' . '"' . $dpagador . '"' . "," .
        // 					'"obs_manif":' . '"' . $obser . '"' . "," .
        // 					'"dat_servic":' . '{' .
        // 					'"val_egreso":' . $anticipo . "," .
        // 					'"val_fletex":' . '"' . $flete . '"' . "," .
        // 					'"val_retefu":' . '"' . $retefuente . '"' . "," .
        // 					'"val_reteic":' . '"' . $reteica . '"' . "," .
        // 					'"val_netoxx":' . '"' . $neto . '"' . "," .
        // 					'"fec_pagoxx":' . '"' . $mediador_documentos[0]['fecha_pago'] . '"' . '}' . "," .
        // 					$remesa_enviar
        // 			)
        // 		);

        // 		$context_manifiesto = stream_context_create($opcion_mediador);
        // 		$consulta_med_mn = file_get_contents($url_consulta_med, false, $context_manifiesto);
        // 		$envio_mediador_manifiesto = json_decode($consulta_med_mn, true);
        // 		$documento = $mediador_documentos[0]['id'];
        // 		$cadena_oet = json_encode($opcion_mediador);
        // 		if (!isset($_SESSION['usuario']['nom_usuario'])) {
        // 			session_start();
        // 			$id_usuario = $_SESSION["usuario"]["nom_usuario"];
        // 		} else {
        // 			$id_usuario = $_SESSION["usuario"]["nom_usuario"];
        // 		}
        // 		$identificador = 'Manifiesto';
        // 		$agencia_id = $empresa['empresa_id'];
        // 		if ($envio_mediador_manifiesto['data']['status'] == 1 || $envio_mediador_manifiesto['data']['status'] == 'true') {
        // 			$data['status'] = 'true';
        // 			$data['error'] = '';
        // 			$respuesta = $data['status'];
        // 			$estado = 1;
        // 			$log_avansat = $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
        // 			echo json_encode($data);
        // 		} else if ($envio_mediador_manifiesto['data']['status'] == 0 || $envio_mediador_manifiesto['data']['status'] == 'false') {
        // 			$data['status'] = 'false';
        // 			$data['error'] = $envio_mediador_manifiesto['data']['message'];
        // 			$respuesta = $envio_mediador_manifiesto['data']['message'];
        // 			$estado = 0;
        // 			$log_avansat = $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
        // 			echo json_encode($data);
        // 		}
        // 	}
        // }

        if ($_POST["recurso"] == 3) { // MANIFIESTO

            if (!isset($token_autentica)) {
                echo json_encode(["status" => false, "error" => "Token no encontrado"]);
                return;
            }

            // Sesión asegurada
            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }

            $numero = (int)$_POST["numero"];
            $recurso = 3;

            // ============================
            // 1. OBTENER DATOS BASE
            // ============================
            $mediador_documentos = $this->_modelo->Datos_Documento_Retransmite($recurso, $numero);

            // print_r($mediador_documentos);
            // exit();
            $empresa = $this->_modelo->Consultar_ambientes();

            if (!$mediador_documentos || !isset($mediador_documentos[0])) {
                echo json_encode(["status" => false, "error" => "Documento no encontrado"]);
                return;
            }

            $doc = $mediador_documentos[0];

            // ============================
            // 2. DEFINIR AMBIENTE
            // ============================
            $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);

            if (!$conexion) {
                echo json_encode(["status" => false, "error" => "No existe configuración del proveedor"]);
                return;
            }

            if ($empresa['nombre_ambiente'] === "PRODUCCION") {
                $url_consulta_med = $conexion['URL_MEDIADOR_MANIFIESTO_PRINCIPAL'];
                $autorizacion_ambiente = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
            } else {
                $url_consulta_med = $conexion['URL_MEDIADOR_MANIFIESTO_PRUEBA'];
                $autorizacion_ambiente = '21b2e5c191e46165607c23cc48779c61e08972d5';
            }

            // ============================
            // 3. HOMOLOGAR TIPOS MANIFIESTO
            // ============================
            $mapa_tipoma = [
                1 => "G",
                2 => "P",
                8 => "I",
                3 => "W",
                4 => "G"
            ];

            $tipoma = $mapa_tipoma[$doc['tipo_manifiesto']] ?? "G";

            // Homologar pagadores cargue / descargue
            $map_pag = [1 => "E", 2 => "D", 3 => "R", 4 => "C"];
            $pagador = $map_pag[$doc['cargue_pagado']] ?? "E";
            $dpagador = $map_pag[$doc['descargue_pagado']] ?? "E";

            // ============================
            // 4. PREPARAR DATOS NUMÉRICOS
            // ============================
            $flete      = str_replace(",", "", $doc['valor_total_viaje']);
            $retefuente = str_replace(",", "", $doc['retencion_fuente']);
            $reteica    = str_replace(",", "", $doc['rete_ica']);
            $neto       = str_replace(",", "", $doc['neto_pagar']);

            // ============================
            // 5. REMESAS ASOCIADAS
            // ============================
            $remesas = [];
            $remesas_cantidad = $this->_modelo->Cant_Remesa($recurso, $numero);

            if ($remesas_cantidad) {
                foreach ($remesas_cantidad as $valor_remesa) {

                    // print_r($valor_remesa['rta_ministerio']);

                    // Obtener radicado desde XML
                    $xml = new SimpleXMLElement($valor_remesa['rta_ministerio']);
                    $ingreso_id = (string)$xml->ingresoid;

                    $remesas[] = [
                        "cod_remesa" => $valor_remesa['id_remesa'],
                        "num_autori" => $ingreso_id
                    ];
                }
            }

            // ============================
            // 6. TRAILER
            // ============================
            $trailer = ($doc['placa_trailer'] !== "no")
                ? $doc['placa_trailer']
                : null;

            // ============================
            // 7. ANTICIPO
            // ============================
            $anticipo = ($doc['anticipo'] !== 'no')
                ? str_replace(",", "", $doc['anticipo'])
                : null;

            // ============================
            // 8. FECHA EXPEDICIÓN
            // ============================
            $fec1 = $doc['fecha_expedicion'] . " " . $doc['hora_expedicion'];
            $fecha_expedicion = substr($fec1, 0, 16);

            // ============================
            // 9. ARMAR JSON BODY
            // ============================
            $body = [
                "cod_manifi" => (int)$doc['id'],
                "cod_agedes" => $doc['id_extermo'],
                "num_autori" => $doc['num_autorizacion'],
                "num_placax" => $doc['placa'],
                "cod_conduc" => (int)$doc['conductor_manifiesto'],
                "num_trayle" => $trailer,
                "fec_expedi" => $fecha_expedicion,
                "cod_tipman" => $tipoma,
                "cod_ciuori" => (int)$doc['origen'],
                "cod_ciudes" => (int)$doc['destino'],
                "cod_propie" => $doc['nombre_propietario'],
                "cod_carpag" => $pagador,
                "cod_despag" => $dpagador,
                "obs_manif"  => trim($doc['observacion']),

                "dat_servic" => [
                    "val_egreso" => $anticipo,
                    "val_fletex" => $flete,
                    "val_retefu" => $retefuente,
                    "val_reteic" => $reteica,
                    "val_netoxx" => $neto,
                    "fec_pagoxx" => $doc['fecha_pago']
                ],

                "dat_remesa" => $remesas
            ];

            // ============================
            // 10. OPCIONES HTTP
            // ============================
            $opcion_mediador = [
                "http" => [
                    "method"  => "POST",
                    "header" =>
                    "Content-Type: application/json\r\n" .
                        "Authorization: {$autorizacion_ambiente}\r\n" .
                        "TOKEN: {$token_autentica}\r\n",
                    "content" => json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                    "timeout" => 20
                ]
            ];

            // ============================
            // 11. ENVIAR A OET
            // ============================
            $context = stream_context_create($opcion_mediador);
            $respuesta_raw = @file_get_contents($url_consulta_med, false, $context);

            if ($respuesta_raw === false) {
                echo json_encode(["status" => "false", "error" => "Error de conexión con OET"]);
                return;
            }

            $respuesta = json_decode($respuesta_raw, true);

            // ============================
            // 12. LOG
            // ============================
            $estado_ok = ($respuesta['data']['status'] == 1 || $respuesta['data']['status'] == "true");
            $msg = $respuesta['data']['message'] ?? "";

            $this->_modelo->log_avansat(
                $doc['id'],
                json_encode($body),
                $msg,
                $_SESSION['usuario']['nom_usuario'],
                $estado_ok ? 1 : 0,
                "Manifiesto",
                $empresa['empresa_id']
            );

            // ============================
            // 13. RESPUESTA FINAL
            // ============================
            echo json_encode([
                "status" => $estado_ok ? "true" : "false",
                "error"  => $estado_ok ? "" : $msg
            ]);
        }

        // if ($_POST["recurso"] == 4) { //cumplido
        // 	if (isset($token_autentica)) {
        // 		$recurso = 4;
        // 		$numero = $_POST["numero"];
        // 		$mediador_documentos = $this->_modelo->Datos_Documento_Retransmite($recurso, $numero);

        // 		/* CONSULTAR AGENCIA Y AMBIENTE */
        // 		$empresa = $this->_modelo->Consultar_ambientes();
        // 		if ($empresa['nombre_ambiente'] == "PRODUCCION") {
        // 			/* CONSULTAR LA URL DE CONEXION  */
        // 			$conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
        // 			if ($conexion) {
        // 				$url_consulta_med = $conexion['URL_MEDIADOR_CUMPLIDO_PRINCIPAL'];
        // 				$autorizacion_ambiente = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
        // 			} else {
        // 				echo "Error de conexion Principal";
        // 			}
        // 		} else {
        // 			/* CONSULTAR LA URL DE CONEXION  */
        // 			$conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
        // 			if ($conexion) {
        // 				$url_consulta_med = $conexion['URL_MEDIADOR_CUMPLIDO_PRUEBA'];
        // 				$autorizacion_ambiente = '21b2e5c191e46165607c23cc48779c61e08972d5';
        // 			} else {
        // 				echo "Error Conexion Prueba";
        // 			}
        // 		}

        // 		$respuesta_remesa = $mediador_documentos[0]['rta_ministerio'];

        // 		$radicado_remesa = new SimpleXMLElement($respuesta_remesa);
        // 		$ingresoid = (string) $radicado_remesa->ingresoid;

        // 		$coma = '';
        // 		$remesa_cumplido = '';
        // 		$contador = 0;
        // 		$remesa_cumplido .= '"dat_cumpli":[';
        // 		foreach ($mediador_documentos as $cumplido_oet) {
        // 			$contador++;
        // 			if ($contador > 1) {
        // 				$coma = ',';
        // 			} else {
        // 				$coma = '';
        // 			}
        // 			$remesa_cumplido .= $coma . '{"cod_remesa":' . '"' . $cumplido_oet['id_remesa'] . '"' . "," .
        // 				'"fec_cargue":{' .
        // 				'"fec_llegad":' . '"' . $cumplido_oet['fca_llegada'] . '"' . "," .
        // 				'"fec_entrad":' . '"' . $cumplido_oet['fca_entrada'] . '"' . "," .
        // 				'"fec_salida":' . '"' . $cumplido_oet['fca_salida'] . '"' . '},' .
        // 				'"fec_descar":{' .
        // 				'"fec_llegad":' . '"' . $cumplido_oet['fdc_llegada'] . '"' . "," .
        // 				'"fec_entrad":' . '"' . $cumplido_oet['fdc_entrada'] . '"' . "," .
        // 				'"fec_salida":' . '"' . $cumplido_oet['fdc_salida'] . '"' . '}}';
        // 		}
        // 		$remesa_cumplido .= ']}';

        // 		$opcion_mediador = array(
        // 			'http' =>
        // 			array(
        // 				'method' => 'POST',
        // 				'header' => "Content-Type:application/json\r\n" .
        // 					"Authorization:" . $autorizacion_ambiente . "\r\n" .
        // 					"TOKEN:" . $token_autentica . "\r\n",
        // 				'content' =>
        // 				'{' .
        // 					'"cod_manifi":' . $mediador_documentos[0]['id'] . "," .
        // 					'"fec_cumpli":' . '"' . $mediador_documentos[0]['fecha_expedicion'] . '"' . "," .
        // 					// '"num_autori":' . '"000001"' . "," .
        // 					'"num_autori":' . '"' . $ingresoid . '"' . "," .
        // 					'"can_multas":' . $mediador_documentos[0]['cantidad_multa'] . "," .
        // 					'"tar_multax":' . $mediador_documentos[0]['valor_multa'] . "," .
        // 					'"fec_estpag":' . '"' . $mediador_documentos[0]['fecha_pago'] . '"' . "," .
        // 					'"nom_agepag":' . '"Bogota"' . "," .
        // 					$remesa_cumplido
        // 			)
        // 		);

        // 		$context_cumplido = stream_context_create($opcion_mediador);
        // 		$consulta_med_cu = file_get_contents($url_consulta_med, false, $context_cumplido);
        // 		$envio_mediador_cumplido = json_decode($consulta_med_cu, true);
        // 		$identificador = 'Cumplido';
        // 		$agencia_id = $empresa['empresa_id'];
        // 		$documento = $mediador_documentos[0]['id'];
        // 		$cadena_oet = json_encode($opcion_mediador);
        // 		$respuesta = '';
        // 		if (!isset($_SESSION['usuario']['nom_usuario'])) {
        // 			session_start();
        // 			$id_usuario = $_SESSION["usuario"]["nom_usuario"];
        // 		} else {
        // 			$id_usuario = $_SESSION["usuario"]["nom_usuario"];
        // 		}
        // 		if ($envio_mediador_cumplido['data']['status'] == 1 || $envio_mediador_cumplido['data']['status'] == 'true') {
        // 			$data['status'] = 'true';
        // 			// $data['error'] = '';
        // 			$data['error'] = $envio_mediador_cumplido['data']['message'];
        // 			// $data['codigo'] = $envio_mediador_cumplido['data']['codResp'];
        // 			$estado = 1;
        // 			$log_avansat = $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
        // 			echo json_encode($data);
        // 		} else if ($envio_mediador_cumplido['data']['status'] == 0 || $envio_mediador_cumplido['data']['status'] == 'false') {
        // 			$data['status'] = 'false';
        // 			$data['error'] = $envio_mediador_cumplido['data']['message'];
        // 			// $data['codigo'] = $envio_mediador_cumplido['data']['codResp'];
        // 			$estado = 0;
        // 			$log_avansat = $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
        // 			echo json_encode($data);
        // 		}
        // 	}
        // }

        if ($_POST["recurso"] == 4) { // CUMPLIDO

            if (!isset($token_autentica)) {
                echo json_encode(["status" => false, "error" => "Token no encontrado"]);
                return;
            }

            // Sesión asegurada
            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }

            $numero  = (int)$_POST["numero"];
            $recurso = 4;

            // ====================================
            // 1. DATOS BASE
            // ====================================
            $mediador_documentos = $this->_modelo->Datos_Documento_Retransmite($recurso, $numero);
            if (!$mediador_documentos || !isset($mediador_documentos[0])) {
                echo json_encode(["status" => false, "error" => "Documento no encontrado"]);
                return;
            }

            $doc = $mediador_documentos[0];

            // ====================================
            // 2. AMBIENTE
            // ====================================
            $empresa   = $this->_modelo->Consultar_ambientes();
            $conexion  = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);

            if (!$conexion) {
                echo json_encode(["status" => false, "error" => "Configuración de proveedor no encontrada"]);
                return;
            }

            if ($empresa['nombre_ambiente'] === "PRODUCCION") {
                $url_consulta_med      = $conexion['URL_MEDIADOR_CUMPLIDO_PRINCIPAL'];
                $autorizacion_ambiente = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
            } else {
                $url_consulta_med      = $conexion['URL_MEDIADOR_CUMPLIDO_PRUEBA'];
                $autorizacion_ambiente = '21b2e5c191e46165607c23cc48779c61e08972d5';
            }

            // ====================================
            // 3. RADICADO DEL MINISTERIO
            // ====================================
            $xml = new SimpleXMLElement($doc['rta_ministerio']);
            $ingresoid = (string)$xml->ingresoid;

            // ====================================
            // 4. FORMAR LOS CUMPLIDOS DE REMESA
            // ====================================
            $dat_cumpli = [];

            foreach ($mediador_documentos as $item) {
                $dat_cumpli[] = [
                    "cod_remesa" => (string)$item["id_remesa"],

                    "fec_cargue" => [
                        "fec_llegad" => $item["fca_llegada"],
                        "fec_entrad" => $item["fca_entrada"],
                        "fec_salida" => $item["fca_salida"]
                    ],

                    "fec_descar" => [
                        "fec_llegad" => $item["fdc_llegada"],
                        "fec_entrad" => $item["fdc_entrada"],
                        "fec_salida" => $item["fdc_salida"],
                    ]
                ];
            }

            // ====================================
            // 5. ARMAR BODY JSON PROFESIONAL
            // ====================================
            $body = [
                "cod_manifi" => (int)$doc["id"],             // Manifiesto
                "fec_cumpli" => $doc["fecha_expedicion"],    // Fecha del cumplido
                "num_autori" => $ingresoid,                  // Autorización RNDC
                "can_multas" => (int)$doc["cantidad_multa"],
                "tar_multax" => (int)$doc["valor_multa"],
                "fec_estpag" => $doc["fecha_pago"],
                "nom_agepag" => "Bogota",

                "dat_cumpli" => $dat_cumpli
            ];

            // ====================================
            // 6. PREPARAR REQUEST HTTP SEGURO
            // ====================================
            $opcion_mediador = [
                "http" => [
                    "method" => "POST",
                    "header" =>
                    "Content-Type: application/json\r\n" .
                        "Authorization: {$autorizacion_ambiente}\r\n" .
                        "TOKEN: {$token_autentica}\r\n",
                    "content" => json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                    "timeout" => 20
                ]
            ];

            // ====================================
            // 7. ENVIAR A OET
            // ====================================
            $context  = stream_context_create($opcion_mediador);
            $respuesta_raw = @file_get_contents($url_consulta_med, false, $context);

            if ($respuesta_raw === false) {
                echo json_encode(["status" => "false", "error" => "Error de conexión con OET"]);
                return;
            }

            $respuesta = json_decode($respuesta_raw, true);

            // ====================================
            // 8. LOG
            // ====================================
            $estado_ok = ($respuesta['data']['status'] == 1 || $respuesta['data']['status'] == "true");
            $mensaje_oet = $respuesta['data']['message'] ?? "Sin mensaje";

            $this->_modelo->log_avansat(
                $doc['id'],
                json_encode($body),
                $mensaje_oet,
                $_SESSION['usuario']['nom_usuario'],
                $estado_ok ? 1 : 0,
                "Cumplido",
                $empresa['empresa_id']
            );

            // ====================================
            // 9. RESPUESTA FINAL
            // ====================================
            echo json_encode([
                "status" => $estado_ok ? "true" : "false",
                "error"  => $estado_ok ? "" : $mensaje_oet
            ]);
        }

        if ($_POST["recurso"] == 7) { //trailer
            if (isset($token_autentica)) {
                $recurso = 7;
                $numero = $_POST["numero"];
                $empresa = $this->_modelo->Consultar_ambientes();
                if ($empresa['nombre_ambiente'] == "PRODUCCION") {
                    /* CONSULTAR LA URL DE CONEXION  */
                    $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                    if ($conexion) {
                        $url_consulta_med = $conexion['URL_CONSULTA_TRAILER_PRINCIPAL'];
                        $autorizacion_ambiente = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
                    } else {
                        //echo "Error de conexion Principal";
                    }
                } else {
                    /* CONSULTAR LA URL DE CONEXION  */
                    $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
                    if ($conexion) {
                        $url_consulta_med = $conexion['URL_CONSULTA_TRAILER_PRUEBA'];
                        $autorizacion_ambiente = '21b2e5c191e46165607c23cc48779c61e08972d5';
                    } else {
                        //echo "Error Conexion Prueba";
                    }
                }
                $mediador_terceros = $this->_modelo->Datos_Documento_Retransmite($recurso, $numero);
                //homologar datos
                $capacidad = (($mediador_terceros[0]['capacidad']) / (1000));
                if (isset($mediador_terceros[0]['caracteristica'])) {
                    $observacion = '"' . trim($mediador_terceros[0]['caracteristica']) . '"';
                    $observacion2 = $observacion;
                } else {
                    $observacion2 = 'null';
                }
                if (isset($mediador_terceros[0]['numero_civil'])) {
                    $num_poliza = '"' . $mediador_terceros[0]['numero_civil'] . '"';
                } else {
                    $num_poliza = 'null';
                }
                if (isset($mediador_terceros['rndc_aseguradora'])) {
                    $nit_asegura2 = substr($mediador_terceros[0]['rndc_aseguradora'], 0, -1);
                    $nit_asegura = '' . $nit_asegura2 . '';
                } else {
                    $nit_asegura = 'null';
                }
                if (isset($mediador_terceros[0]['fecha_vence'])) {
                    $fecha_vence = '"' . $mediador_terceros[0]['fecha_vence'] . '"';
                } else {
                    $fecha_vence = 'null';
                }
                $opcion_mediador = array(
                    'http' =>
                    array(
                        'method' => 'POST',
                        'header' => "Content-Type:application/json\r\n" .
                            "Authorization:" . $autorizacion_ambiente . "\r\n" .
                            "TOKEN:" . $token_autentica . "\r\n",
                        'timeout' => 60,
                        'content' =>
                        '{' . '"num_trayle":' . '"' . trim($mediador_terceros[0]['placa']) . '"' . "," .
                            '"cod_marcax":' . $mediador_terceros[0]['id_avansat'] . "," .
                            '"tra_pesoxx":' . $mediador_terceros[0]['peso_vacio'] . "," .
                            '"tra_volpos":' . $mediador_terceros[0]['volumen'] . "," .
                            '"tip_tramit":' . $mediador_terceros[0]['tipo_tramite'] . "," .
                            '"ser_chasis":' . '"' . $mediador_terceros[0]['serie_chasis'] . '"' . "," .
                            '"cod_config":' . '"' . $mediador_terceros[0]['rndc_configuacion'] . '"' . "," .
                            '"ano_modelo":' . $mediador_terceros[0]['modelo'] . "," .
                            '"tra_altoxx":' . $mediador_terceros[0]['alto'] . "," .
                            '"tra_largox":' . $mediador_terceros[0]['largo'] . "," .
                            '"tra_anchox":' . $mediador_terceros[0]['ancho'] . "," .
                            '"tra_capaci":' . $capacidad . "," .
                            '"cod_carroc":' . $mediador_terceros[0]['rndc_carroceria'] . "," .
                            '"obs_remolq":' . $observacion2 . "," .
                            '"cod_propie":' . $mediador_terceros[0]['numero_documento'] . "," .
                            '"num_respon":' . $num_poliza . "," .
                            '"cod_aseres":' . $nit_asegura . "," .
                            '"fec_vigres":' . $fecha_vence . '}'
                    )
                );
                $documento = $mediador_terceros[0]['placa'];
                $cadena_oet = json_encode($opcion_mediador);
                if (!isset($_SESSION['usuario']['nom_usuario'])) {
                    session_start();
                    $id_usuario = $_SESSION["usuario"]["nom_usuario"];
                } else {
                    $id_usuario = $_SESSION["usuario"]["nom_usuario"];
                }
                $identificador = 'Trailer';
                $agencia_id = $empresa['empresa_id'];
                $context_vehiculo = stream_context_create($opcion_mediador);
                $consulta_med_veh = file_get_contents($url_consulta_med, false, $context_vehiculo);
                $envio_mediador_prop = json_decode($consulta_med_veh, true);

                if ($envio_mediador_prop['data']['success'] == 1 || $envio_mediador_prop['data']['success'] == 'true') {
                    $data['status'] = 'true';
                    $data['error'] = '';
                    $respuesta = $data['status'];
                    $estado = 1;
                    $log_avansat = $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                    echo json_encode($data);
                } else if ($envio_mediador_prop['data']['success'] == 0 || $envio_mediador_prop['data']['success'] == 'false') {
                    $data['status'] = 'false';
                    $data['error'] = $envio_mediador_prop['data']['msgResp'];
                    $respuesta = $envio_mediador_prop['data']['msgResp'];
                    $estado = 0;
                    $log_avansat = $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
                    echo json_encode($data);
                }
            }
        }

        // if ($_POST["recurso"] == 7) { // TRAILER

        // 	if (!isset($token_autentica)) {
        // 		echo json_encode(["status" => false, "error" => "Token no encontrado"]);
        // 		return;
        // 	}

        // 	if (session_status() === PHP_SESSION_NONE) {
        // 		session_start();
        // 	}

        // 	$recurso = 7;
        // 	$numero  = (int)$_POST["numero"];

        // 	// ====================================
        // 	// 1. AMBIENTE
        // 	// ====================================
        // 	$empresa  = $this->_modelo->Consultar_ambientes();
        // 	$conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);

        // 	if (!$conexion) {
        // 		echo json_encode(["status" => false, "error" => "Configuración no encontrada"]);
        // 		return;
        // 	}

        // 	if ($empresa['nombre_ambiente'] === "PRODUCCION") {
        // 		$url_consulta_med      = $conexion['URL_CONSULTA_TRAILER_PRINCIPAL'];
        // 		$autorizacion_ambiente = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
        // 	} else {
        // 		$url_consulta_med      = $conexion['URL_CONSULTA_TRAILER_PRUEBA'];
        // 		$autorizacion_ambiente = '21b2e5c191e46165607c23cc48779c61e08972d5';
        // 	}

        // 	// ====================================
        // 	// 2. CONSULTAR INFO DEL TRAILER
        // 	// ====================================
        // 	$doc = $this->_modelo->Datos_Documento_Retransmite($recurso, $numero);

        // 	if (!$doc || !isset($doc[0])) {
        // 		echo json_encode(["status" => false, "error" => "Trailer no encontrado"]);
        // 		return;
        // 	}

        // 	$t = $doc[0];

        // 	// ====================================
        // 	// 3. HOMOLOGACIONES
        // 	// ====================================
        // 	$capacidad = round(($t['capacidad'] / 1000), 2);

        // 	$obs_remolque =
        // 		!empty($t['caracteristica'])
        // 		? trim($t['caracteristica'])
        // 		: null;

        // 	$num_poliza =
        // 		!empty($t['numero_civil'])
        // 		? trim($t['numero_civil'])
        // 		: null;

        // 	$nit_asegura =
        // 		!empty($t['rndc_aseguradora'])
        // 		? substr($t['rndc_aseguradora'], 0, -1)
        // 		: null;

        // 	$fecha_vence =
        // 		!empty($t['fecha_vence'])
        // 		? $t['fecha_vence']
        // 		: null;

        // 	// ====================================
        // 	// 4. JSON BODY PROFESIONAL
        // 	// ====================================
        // 	$body = [
        // 		"num_trayle" => trim($t['placa']),
        // 		"cod_marcax" => (int)$t['id_avansat'],
        // 		"tra_pesoxx" => (float)$t['peso_vacio'],
        // 		"tra_volpos" => (float)$t['volumen'],
        // 		"tip_tramit" => (int)$t['tipo_tramite'],
        // 		"ser_chasis" => $t['serie_chasis'],
        // 		"cod_config" => $t['rndc_configuacion'],
        // 		"ano_modelo" => (int)$t['modelo'],
        // 		"tra_altoxx" => (float)$t['alto'],
        // 		"tra_largox" => (float)$t['largo'],
        // 		"tra_anchox" => (float)$t['ancho'],
        // 		"tra_capaci" => $capacidad,
        // 		"cod_carroc" => (int)$t['rndc_carroceria'],
        // 		"obs_remolq" => $obs_remolque,
        // 		"cod_propie" => (int)$t['numero_documento'],
        // 		"num_respon" => $num_poliza,
        // 		"cod_aseres" => $nit_asegura,
        // 		"fec_vigres" => $fecha_vence
        // 	];

        // 	// ====================================
        // 	// 5. REQUEST HTTP
        // 	// ====================================
        // 	$op = [
        // 		"http" => [
        // 			"method" => "POST",
        // 			"header" =>
        // 			"Content-Type: application/json\r\n" .
        // 				"Authorization: {$autorizacion_ambiente}\r\n" .
        // 				"TOKEN: {$token_autentica}\r\n",
        // 			"content" => json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        // 			"timeout" => 30
        // 		]
        // 	];

        // 	$context = stream_context_create($op);
        // 	$response_raw = @file_get_contents($url_consulta_med, false, $context);

        // 	if ($response_raw === false) {
        // 		echo json_encode(["status" => false, "error" => "Error conexión OET"]);
        // 		return;
        // 	}

        // 	$response = json_decode($response_raw, true);

        // 	// ====================================
        // 	// 6. LOG
        // 	// ====================================
        // 	$ok = ($response['data']['success'] == 1 || $response['data']['success'] == "true");
        // 	$msg = $response['data']['msgResp'] ?? "";

        // 	$this->_modelo->log_avansat(
        // 		$t['placa'],
        // 		json_encode($body),
        // 		$msg,
        // 		$_SESSION["usuario"]["nom_usuario"],
        // 		$ok ? 1 : 0,
        // 		"Trailer",
        // 		$empresa['empresa_id']
        // 	);

        // 	// ====================================
        // 	// 7. RESPUESTA FINAL
        // 	// ====================================
        // 	echo json_encode([
        // 		"status" => $ok ? "true" : "false",
        // 		"error" => $ok ? "" : $msg
        // 	]);
        // }


        // if ($_POST["recurso"] == 8) { //Vehiculo
        // 	if (isset($token_autentica)) {
        // 		$recurso = 8; //6
        // 		$numero = $_POST["numero"];
        // 		$empresa = $this->_modelo->Consultar_ambientes();
        // 		if ($empresa['nombre_ambiente'] == "PRODUCCION") {
        // 			/* CONSULTAR LA URL DE CONEXION  */
        // 			$conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
        // 			if ($conexion) {
        // 				//$url_consulta_med = $conexion['URL_CONSULTA_VEHICULOS_PRINCIPAL'];
        // 				$autorizacion_ambiente = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
        // 			} else {
        // 				echo "Error de conexion Principal";
        // 			}
        // 		} else {
        // 			/* CONSULTAR LA URL DE CONEXION  */
        // 			$conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);
        // 			if ($conexion) {
        // 				//$url_consulta_med = $conexion['URL_CONSULTA_VEHICULOS_PRUEBA'];
        // 				$autorizacion_ambiente = '21b2e5c191e46165607c23cc48779c61e08972d5';
        // 			} else {
        // 				echo "Error Conexion Prueba";
        // 			}
        // 		}

        // 		$mediador_terceros = $this->_modelo->Datos_Documento_Retransmite($recurso, $numero);
        // 		$peso_vacio = (($mediador_terceros[0]['peso']) / (1000));
        // 		$capacidad = (($mediador_terceros[0]['capacidad_tn']) / (1000));

        // 		$peso_vacio = round($peso_vacio, 2);
        // 		$capacidad = round($capacidad, 2);

        // 		$nit_asegura = substr($mediador_terceros[0]['rndc_aseguradora'], 0, -1);
        // 		if ($mediador_terceros[0]['tipo_vinculacion'] == 'Tercero') {
        // 			$vinculacion = 'Terceros';
        // 		} else if ($mediador_terceros[0]['tipo_vinculacion'] == 'Propio') {
        // 			$vinculacion = 'Propio';
        // 		}
        // 		if ($mediador_terceros[0]['rndc_aseguradora'] != null) {
        // 			$nit_asegura = substr($mediador_terceros[0]['rndc_aseguradora'], 0, -1);
        // 			//$nit_asegura='null';
        // 		} else {
        // 			$nit_asegura = 'null';
        // 		}
        // 		if ($mediador_terceros[0]['nit'] != null) { //GPS
        // 			//$nit_gps=$mediador_terceros['nit'];
        // 			$nit_gps = 'null';
        // 		} else {
        // 			$nit_gps = 'null';
        // 		}
        // 		if ($mediador_terceros[0]['usuario_satelital'] != null) {
        // 			$user_sate = '"' . $mediador_terceros['usuario_satelital'] . '"';
        // 		} else {
        // 			$user_sate = 'null';
        // 		}
        // 		if ($mediador_terceros[0]['clave_satelital'] != null) {
        // 			$clave_gps = '"' . $mediador_terceros['clave_satelital'] . '"';
        // 		} else {
        // 			$clave_gps = 'null';
        // 		}
        // 		if ($mediador_terceros[0]['num_soat'] != null) {
        // 			//$soat='"'.$mediador_terceros['num_soat'].'"';
        // 			$soat = 'null';
        // 		} else {
        // 			$soat = 'null';
        // 		}
        // 		if ($mediador_terceros[0]['vence_soat'] != null) {
        // 			//$vence_soat='"'.$mediador_terceros['vence_soat'].'"';
        // 			$vence_soat = 'null';
        // 		} else {
        // 			$vence_soat = 'null';
        // 		}

        // 		//combustible
        // 		if ($mediador_terceros[0]['cod_tipo_combustible'] == 12) {
        // 			$combustible = 2;
        // 		} else if ($mediador_terceros[0]['cod_tipo_combustible'] == 1) {
        // 			$combustible = 1;
        // 		} else if ($mediador_terceros[0]['cod_tipo_combustible'] == 2) {
        // 			$combustible = 3;
        // 		} else if ($mediador_terceros[0]['cod_tipo_combustible'] == 3) {
        // 			$combustible = 4;
        // 		} else if ($mediador_terceros[0]['cod_tipo_combustible'] == 5) {
        // 			$combustible = 5;
        // 		}

        // 		//licencia transito
        // 		//print($mediador_terceros['licencia_transito']);
        // 		if ($mediador_terceros[0]['licencia_transito'] != '' && $mediador_terceros[0]['licencia_transito'] != null) {
        // 			$licencia = $mediador_terceros[0]['licencia_transito'];
        // 		} else {
        // 			$licencia = '""';
        // 		}

        // 		if ($mediador_terceros[0]['rndc_configuracion'] == 'CA') {
        // 			$configurar = '2CA';
        // 		} else {
        // 			$configurar = $mediador_terceros[0]['rndc_configuracion'];
        // 		}


        // 		if ($mediador_terceros[0]['clase_vehiculo'] == 1) { //automovil
        // 			$clase = 1;
        // 		} else if ($mediador_terceros[0]['clase_vehiculo'] == 2) { //bus
        // 			$clase = 1;
        // 		} else if ($mediador_terceros[0]['clase_vehiculo'] == 3) { //buseta
        // 			$clase = 1;
        // 		} else if ($mediador_terceros[0]['clase_vehiculo'] == 4) { //camion
        // 			$clase = 28;
        // 		} else if ($mediador_terceros[0]['clase_vehiculo'] == 5) { //camioneta
        // 			$clase = 8;
        // 		} else if ($mediador_terceros[0]['clase_vehiculo'] == 6) { //campero
        // 			$clase = 1;
        // 		} else if ($mediador_terceros[0]['clase_vehiculo'] == 7) { //microbus
        // 			$clase = 1;
        // 		} else if ($mediador_terceros[0]['clase_vehiculo'] == 8) { //tractocamion
        // 			$clase = 3;
        // 		} else if ($mediador_terceros[0]['clase_vehiculo'] == 9) { //motocicleta
        // 			$clase = 1;
        // 		} else if ($mediador_terceros[0]['clase_vehiculo'] == 10) { //motocarro
        // 			$clase = 1;
        // 		} else if ($mediador_terceros[0]['clase_vehiculo'] == 11) { //mototriciclo
        // 			$clase = 1;
        // 		} else if ($mediador_terceros[0]['clase_vehiculo'] == 12) { //cuatrimoto
        // 			$clase = 1;
        // 		} else if ($mediador_terceros[0]['clase_vehiculo'] == 13) { //remolque
        // 			$clase = 14;
        // 		} else if ($mediador_terceros[0]['clase_vehiculo'] == 14) { //SEMIREMOLQUE
        // 			$clase = 1;
        // 		} else if ($mediador_terceros[0]['clase_vehiculo'] == 15) { //volqueta
        // 			$clase = 4;
        // 		} else if ($mediador_terceros[0]['clase_vehiculo'] == 16) { //sin clase
        // 			$clase = 1;
        // 		} else if ($mediador_terceros[0]['clase_vehiculo'] == 17) { //
        // 			$clase = 1;
        // 		} else if ($mediador_terceros[0]['clase_vehiculo'] == 18) { //ciclomotor
        // 			$clase = 1;
        // 		} else if ($mediador_terceros[0]['clase_vehiculo'] == 19) { //triccimotor
        // 			$clase = 1;
        // 		} else if ($mediador_terceros[0]['clase_vehiculo'] == 20) { //cuadriciclo
        // 			$clase = 1;
        // 		}
        // 		if ($mediador_terceros['tecno_fecha_vigencia']) {
        // 			$vencetecno = $mediador_terceros['tecno_fecha_vigencia'];
        // 		} else {
        // 			$vencetecno = '0000-00-00';
        // 		}

        // 		$opcion_mediador_ve = array(
        // 			'http' => array(
        // 				'method' => 'POST',
        // 				'header' => "Content-Type:application/json\r\n" .
        // 					"Authorization:" . $autorizacion_ambiente . "\r\n" .
        // 					"TOKEN:" . $token_autentica . "\r\n",
        // 				'content' =>
        // 				'{' .
        // 					'"cod_tipdoc":' . '""' . "," .
        // 					'"num_placax":' . '"' . trim($mediador_terceros[0]['placa']) . '"' . "," .
        // 					'"num_config":' . '"' . $configurar . '"' . "," .
        // 					'"cod_colorx":' . $mediador_terceros[0]['id_color_avansat'] . "," .
        // 					'"cod_marcax":' . '"' . $mediador_terceros[0]['id_marca_avansat'] . '"' . "," .
        // 					'"cod_lineax":' . '' . $mediador_terceros[0]['id_linea_avansat'] . '' . "," .
        // 					'"cod_combus":' . '' . $combustible . '' . "," .
        // 					'"ano_modelo":' . $mediador_terceros[0]['anio_fabricacion'] . "," .
        // 					'"cod_clasex":' . $clase . "," .
        // 					'"cod_carroc":' . $mediador_terceros[0]['id_carroc_avansat'] . "," .
        // 					'"val_pesove":' . $peso_vacio . "," .
        // 					'"val_capaci":' . $capacidad . "," .
        // 					'"num_poliza":' . $soat . "," .
        // 					'"fec_vigfin":' . $vence_soat . "," .
        // 					'"cod_asesoa":' . $nit_asegura . "," .
        // 					'"num_agases":' . '"' . (trim($mediador_terceros[0]['tecnomecanica'] ?? 'N/A')) . '",' .
        // 					'"fec_revmec":' . '"' . $vencetecno . '"' . "," .
        // 					'"fec_vengas":' . '"' . $vencetecno . '"' . "," .
        // 					'"cod_opegps":' . $nit_gps . "," .
        // 					'"usr_gpsxxx":' . trim($user_sate) . "," .
        // 					'"clv_gpsxxx":' . trim($clave_gps) . "," .
        // 					'"fec_mangps":' . '"' . $mediador_terceros[0]['fecha_mant_gps'] . '"' . "," .
        // 					'"num_motorx":' . '"' . $mediador_terceros[0]['num_motor'] . '"' . "," .
        // 					'"num_chasis":' . '"' . $mediador_terceros[0]['num_chasis'] . '"' . "," .
        // 					'"num_polirc":' . '"' . $mediador_terceros[0]['num_chasis'] . '"' . "," .
        // 					'"fec_venprc":' . '"' . $mediador_terceros[0]['vence_poliza'] . '"' . "," .
        // 					'"cod_tipveh":' . '"' . $vinculacion . '"' . "," .
        // 					'"num_licenc":' . '""' . "," .
        // 					'"cod_propie":' . $mediador_terceros[0]['propietario'] . "," .
        // 					'"cod_tenedo":' . $mediador_terceros[0]['poseedor'] . "," .
        // 					'"cod_conduc":' . $mediador_terceros[0]['conductor'] . '}'
        // 			)
        // 		);
        // 		$url_consulta_med = $conexion['URL_CONSULTA_VEHICULOS_PRUEBA'];
        // 		$context_vehiculo = stream_context_create($opcion_mediador_ve);
        // 		$consulta_med_ve = file_get_contents($url_consulta_med, false, $context_vehiculo);
        // 		$envio_mediador_ve = json_decode($consulta_med_ve, true);
        // 		$documento = $mediador_terceros['placa'];
        // 		$cadena_oet = json_encode($opcion_mediador_ve);
        // 		$agencia_id = $empresa['empresa_id'];
        // 		$identificador = 'Vehiculo';
        // 		if (!isset($_SESSION['usuario']['nom_usuario'])) {
        // 			session_start();
        // 			$id_usuario = $_SESSION["usuario"]["nom_usuario"];
        // 		} else {
        // 			$id_usuario = $_SESSION["usuario"]["nom_usuario"];
        // 		}
        // 		if ($envio_mediador_ve['data']['success'] == 1 || $envio_mediador_ve['data']['success'] == 'true') {
        // 			$data['status'] = 'true';
        // 			$data['error'] = '';
        // 			$respuesta = $data['status'];
        // 			$estado = 1;
        // 			$log_avansat = $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
        // 			echo json_encode($data);
        // 		} else if ($envio_mediador_ve['data']['success'] == 0 || $envio_mediador_ve['data']['success'] == 'false') {
        // 			$data['status'] = 'false';
        // 			$data['error'] = $envio_mediador_ve['data']['msgResp'];
        // 			$respuesta = $envio_mediador_ve['data']['msgResp'];
        // 			$estado = 0;
        // 			$log_avansat = $this->_modelo->log_avansat($documento, $cadena_oet, $respuesta, $id_usuario, $estado, $identificador, $agencia_id);
        // 			echo json_encode($data);
        // 		}
        // 	}
        // }

        if ($_POST["recurso"] == 8) { // VEHÍCULO

            if (!isset($token_autentica)) {
                echo json_encode(["status" => false, "error" => "Token no encontrado"]);
                return;
            }

            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }

            $recurso = 8;
            $numero  = (int)$_POST["numero"];

            // ====================================
            // 1. AMBIENTE
            // ====================================
            $empresa  = $this->_modelo->Consultar_ambientes();
            $conexion = $this->_modelo->Conexion_Proveedor($empresa['nombre_ambiente'], $empresa['empresa_id']);

            if (!$conexion) {
                echo json_encode(["status" => false, "error" => "Configuración no encontrada"]);
                return;
            }

            if ($empresa['nombre_ambiente'] === "PRODUCCION") {
                $url_consulta_med      = $conexion['URL_CONSULTA_VEHICULOS_PRINCIPAL'];
                $autorizacion_ambiente = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
            } else {
                $url_consulta_med      = $conexion['URL_CONSULTA_VEHICULOS_PRUEBA'];
                $autorizacion_ambiente = '21b2e5c191e46165607c23cc48779c61e08972d5';
            }

            // ====================================
            // 2. CONSULTAR VEHÍCULO
            // ====================================
            $doc = $this->_modelo->Datos_Documento_Retransmite($recurso, $numero);
            if (!$doc || !isset($doc[0])) {
                echo json_encode(["status" => false, "error" => "Vehículo no encontrado"]);
                return;
            }

            $v = $doc[0];

            // ====================================
            // 3. HOMOLOGACIONES
            // ====================================
            $peso_vacio = round(($v['peso'] / 1000), 2);
            $capacidad  = round(($v['capacidad_tn'] / 1000), 2);

            // Combustible RNDC
            $map_comb = [
                12 => 2, // Diesel?
                1  => 1,
                2  => 3,
                3  => 4,
                5  => 5
            ];
            $combustible = $map_comb[$v['cod_tipo_combustible']] ?? 1;

            // Configuración RNDC
            $configurar = ($v['rndc_configuracion'] == "CA") ? "2CA" : $v['rndc_configuracion'];

            // Clase de vehículo
            $mapClase = [
                4 => 28, // Camión
                5 => 8,  // Camioneta
                8 => 3,  // Tractocamión
                13 => 14, // Remolque
                15 => 4  // Volqueta
            ];
            $clase = $mapClase[$v['clase_vehiculo']] ?? 1;

            // Vencimiento tecnomecánica
            $vencetecno =
                (!empty($v['tecno_fecha_vigencia']))
                ? $v['tecno_fecha_vigencia']
                : "0000-00-00";

            // ====================================
            // 4. ARMAR JSON BODY PROFESIONAL
            // ====================================
            $body = [
                "cod_tipdoc" => "",
                "num_placax" => trim($v['placa']),
                "num_config" => $configurar,
                "cod_colorx" => (int)$v['id_color_avansat'],
                "cod_marcax" => $v['id_marca_avansat'],
                "cod_lineax" => $v['id_linea_avansat'],
                "cod_combus" => $combustible,
                "ano_modelo" => (int)$v['anio_fabricacion'],
                "cod_clasex" => $clase,
                "cod_carroc" => (int)$v['id_carroc_avansat'],
                "val_pesove" => $peso_vacio,
                "val_capaci" => $capacidad,

                "num_poliza" => $v['num_soat'] ?? null,
                "fec_vigfin" => $v['vence_soat'] ?? null,
                "cod_asesoa" => $v['rndc_aseguradora']
                    ? substr($v['rndc_aseguradora'], 0, -1)
                    : null,

                "num_agases" => trim($v['tecnomecanica'] ?? "N/A"),
                "fec_revmec" => $vencetecno,
                "fec_vengas" => $vencetecno,

                "cod_opegps" => $v['nit'] ?? null,
                "usr_gpsxxx" => $v['usuario_satelital'] ?? null,
                "clv_gpsxxx" => $v['clave_satelital'] ?? null,
                "fec_mangps" => $v['fecha_mant_gps'],

                "num_motorx" => $v['num_motor'],
                "num_chasis" => $v['num_chasis'],
                "num_polirc" => $v['num_chasis'],
                "fec_venprc" => $v['vence_poliza'],

                "cod_tipveh" => $v['tipo_vinculacion'],
                "num_licenc" => "",
                "cod_propie" => $v['propietario'],
                "cod_tenedo" => $v['poseedor'],
                "cod_conduc" => $v['conductor']
            ];

            // ====================================
            // 5. REQUEST HTTP
            // ====================================
            $op = [
                "http" => [
                    "method" => "POST",
                    "header" =>
                    "Content-Type:application/json\r\n" .
                        "Authorization: {$autorizacion_ambiente}\r\n" .
                        "TOKEN: {$token_autentica}\r\n",
                    "content" => json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                    "timeout" => 30
                ]
            ];

            $context = stream_context_create($op);
            $response_raw = @file_get_contents($url_consulta_med, false, $context);

            if ($response_raw === false) {
                echo json_encode(["status" => false, "error" => "Error conexión OET"]);
                return;
            }

            $response = json_decode($response_raw, true);

            // ====================================
            // 6. LOG
            // ====================================
            $ok = ($response['data']['success'] == 1 || $response['data']['success'] == "true");
            $msg = $response['data']['msgResp'] ?? "";

            $this->_modelo->log_avansat(
                $v['placa'],
                json_encode($body),
                $msg,
                $_SESSION["usuario"]["nom_usuario"],
                $ok ? 1 : 0,
                "Vehiculo",
                $empresa['empresa_id']
            );

            echo json_encode([
                "status" => $ok ? "true" : "false",
                "error"  => $ok ? "" : $msg
            ]);
        }

        //CIERRE DE LA FUNCION PRINCIPAL
    }
}
