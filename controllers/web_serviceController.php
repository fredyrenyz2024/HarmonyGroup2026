<?php

class web_serviceController extends Controller
{
  private $_modelo;
  private $_modelo2;
  private $envia;
  private $doc;
  private $doc2;
  private $doc3;
  private $registro2;
  private $registro;
  private $unidad;

  public function __construct()
  {
    parent::__construct();
    $this->_modelo = $this->loadModel('web_service');
    $this->_modelo2 = $this->loadModel('cumplido');
  }

  public function index()
  {
    $prueba = $this->loadModel('web_service');
    $this->_view->prueba = $prueba;
    $this->_view->titulo = 'web service';
    $this->_view->renderizar('index', 'web_service');
  }

  public function web_service_terceros()
  {
    $cargamodelo = $this->loadModel('web_service');
    $this->_view->envia = $cargamodelo;
    $subtitulo = '<span class="detail-description">
    <h5>
    Novedades -> Web service -> Terceros
    </h5>
    </span>';
    $this->_view->titulo = 'Transmisión de terceros' . $subtitulo;
    $this->_view->renderizar('web_service_terceros', 'web_service');
  }

  public function web_service_vehiculos()
  {
    $cargamodelo = $this->loadModel('web_service');
    $this->_view->envia = $cargamodelo;
    $subtitulo = '<span class="detail-description">
    <h5>
    Novedades -> Web service -> Vehículos
    </h5>
    </span>';
    $this->_view->titulo = 'Transmisión de vehículos' . $subtitulo;
    $this->_view->renderizar('web_service_vehiculos', 'web_service');
  }

  public function web_service_documentos()
  {
    $cargamodelo = $this->loadModel('web_service');
    $this->_view->envia = $cargamodelo;
    $subtitulo = '<span class="detail-description">
    <h5>
    Novedades -> Web service -> Informe carga
    </h5>
    </span>';
    $this->_view->titulo = 'Transmisión de documentos' . $subtitulo;
    $this->_view->renderizar('web_service_documentos', 'web_service');
  }

  // comunicacion con la BD

  public function Consulta_Tabla()
  { // TERCEROS
    $filtro = $_POST['filtro'];
    $manifiesto = $_POST['manifiesto'];
    $this->doc = $this->_modelo->Genera_Consulta($filtro, $manifiesto);
    // echo json_encode($this->doc);
    $usuario = MINTRANS_USER;
    $contrasena = MINTRANS_PASS;
    if ($filtro == 1) { // CONDUCTOR
      // consultar
      // transmitir
      for ($i = 0; $i < count($this->doc); $i++) {
        $xml_tercero = "<?xml version='1.0' encoding='ISO-8859-1' ?>";
        $xml_tercero .= '<root>';
        $xml_tercero .= '<acceso>';
        $xml_tercero .= '<username>' . $usuario . '</username>
          <password>' . $contrasena . '</password>';
        $xml_tercero .= '
        </acceso>';
        $xml_tercero .= '<solicitud>';
        $xml_tercero .= '<tipo>2</tipo>';
        $xml_tercero .= '<procesoid>11</procesoid>';
        $xml_tercero .= '</solicitud>';
        $xml_tercero .= '<variables>';
        $xml_tercero .= '<NUMNITEMPRESATRANSPORTE></NUMNITEMPRESATRANSPORTE>';
        $xml_tercero .= '<CODTIPOIDTERCERO></CODTIPOIDTERCERO>';
        $xml_tercero .= '<NUMIDTERCERO></NUMIDTERCERO>';
        $xml_tercero .= '<NOMIDTERCERO></NOMIDTERCERO>';
        $xml_tercero .= '<PRIMERAPELLIDOIDTERCERO></PRIMERAPELLIDOIDTERCERO>';
        $xml_tercero .= '<SEGUNDOAPELLIDOIDTERCERO></SEGUNDOAPELLIDOIDTERCERO>';

        $xml_tercero .= '<CODSEDETERCERO>0</CODSEDETERCERO>';
        $xml_tercero .= '<NUMCELULARPERSONA></NUMCELULARPERSONA>';
        $xml_tercero .= '<NOMENCLATURADIRECCION></NOMENCLATURADIRECCION>';
        $xml_tercero .= '<CODMUNICIPIORNDC></CODMUNICIPIORNDC>';
        $xml_tercero .= '<NUMLICENCIACONDUCCION></NUMLICENCIACONDUCCION>';
        $xml_tercero .= '<CODCATEGORIALICENCIACONDUCCION></CODCATEGORIALICENCIACONDUCCION>';
        $xml_tercero .= '<FECHAVENCIMIENTOLICENCIA></FECHAVENCIMIENTOLICENCIA>';
        $xml_tercero .= '</variables>';
        $xml_tercero .= '</root>';
      }
    }
    if ($filtro == 2) { // PROPIETARIO
      // consultar

      // transmitir
      // validar si es NIT O NATURAL
    }
    if ($filtro == 3) { // POSEEDOR
    }
    if ($filtro == 4) { // DESTINATARIO
    }
    if ($filtro == 5) { // REMITENTE
    }
    if ($filtro == 6) { // TITULAR MNF
    }
  }

  public function Consulta_Tabla_Vehiculo()
  {
    $filtro = $_POST['filtro'];
    $manifiesto = $_POST['manifiesto'];
    $this->doc2 = $this->_modelo->Genera_Consulta_vehiculo($filtro, $manifiesto);
    echo json_encode($this->doc2);
  }

  public function Tabla_Transaccional_Ministerio($documento, $xml, $rtarndc, $estadoterg)
  {
    $this->doc3 = $this->_modelo->Transaccion_Nexos_Min($documento, $xml, $rtarndc, $estadoterg);
    echo json_encode($this->doc3);
  }

  public function Consulta_Tabla_Retransmision()
  { // CONTROLLER DE RETRANSMISION
    $filtro = $_POST['filtro'];
    $num_docu = $_POST['num_docu'];
    $opcion = $_POST['opcion'];
    $fecha = $_POST['fecha'];

    $this->doc2 = $this->_modelo->Genera_Consulta_Retransmite($filtro, $opcion, $num_docu, $fecha);
    echo json_encode($this->doc2);
  }

  public function Consulta_Rndc()
  {
    $filtro = $_POST['filtro'];
    $opcion = $_POST['opcion'];
    $num_mnf = $_POST['num_mnf'];
    $fecha = $_POST['fecha'];
    $this->doc2 = $this->_modelo->Consulta_rta_rndc($filtro, $opcion, $num_mnf, $fecha);
    echo json_encode($this->doc2);
  }

  public function Consulta_Manifiesto_Documento()
  { // CONTROLLER DE MANIFIESTO
    $filtro = $_POST['filtro'];
    $num_docu = $_POST['num_docu'];
    $this->doc2 = $this->_modelo->Genera_Consulta_Manifiesto($filtro, $num_docu);
    echo json_encode($this->doc2);
  }

  // CONSULTA DE TERCEROS EN EL WEB SERVICE MINTRANSPORTE
  public function consulta_webService(
    $op = false,
    $id = false,
    $tipotercero = false,
    $tipod = false,
    $tipoproc = false,
    $proc = false
  ) {
    $consulta_xml = '';
    $consulta_xml .= "<?xml version='1.0' encoding='ISO-8859-1' ?>";
    $consulta_xml .= '<root>';
    $consulta_xml .= '<acceso>';
    $consulta_xml .= '<username>' . MINTRANS_USER . '</username>';
    $consulta_xml .= '<password>' . MINTRANS_PASS . '</password>';
    $consulta_xml .= '</acceso>';
    $consulta_xml .= '<solicitud>';
    $consulta_xml .= '<tipo>' . $tipoproc . '</tipo>';
    $consulta_xml .= '<procesoid>' . $proc . '</procesoid>';
    $consulta_xml .= '</solicitud>';
    // CONSULTA TERCEROS
    if ($op == 1) {
      if ($tipod == 'Cedula de Ciudadania' || $tipod == 'CEDULA DE CIUDADANIA') {
        $tdoc = 'C';
      }
      if ($tipod == 'NIT') {
        $tdoc = 'N';
      }
      if ($tipod == 'Cedula de Extranjeria') {
        $tdoc = 'E';
      }
      $consulta_xml .= '<variables>';
      $consulta_xml .= 'NOMIDTERCERO, CODTIPOIDTERCERO, NUMIDTERCERO, PRIMERAPELLIDOIDTERCERO, SEGUNDOAPELLIDOIDTERCERO,
    CODSEDETERCERO, NOMSEDETERCERO, NUMTELEFONOCONTACTO, NUMCELULARPERSONA, NOMENCLATURADIRECCION, CODMUNICIPIORNDC,
    CODCATEGORIALICENCIACONDUCCION, NUMLICENCIACONDUCCION, FECHAVENCIMIENTOLICENCIA, LATITUD, LONGITUD';
      $consulta_xml .= '</variables>';
      $consulta_xml .= '<documento>';
      $consulta_xml .= "<NUMNITEMPRESATRANSPORTE>'" . MINTRANS_NIT . "'</NUMNITEMPRESATRANSPORTE>";
      $consulta_xml .= "<CODTIPOIDTERCERO>'" . $tdoc . "'</CODTIPOIDTERCERO>";
      $consulta_xml .= "<NUMIDTERCERO>'" . $id . "'</NUMIDTERCERO>";
      $consulta_xml .= '</documento>';
    }

    // CONSULTA VEHICULOS
    if ($op == 2) {
      $consulta_xml .= '<variables>';
      $consulta_xml .= 'CODCONFIGURACIONUNIDADCARGA, ANOFABRICACIONVEHICULOCARGA, NUMIDPROPIETARIO, CODTIPOIDTENEDOR,
    NUMIDTENEDOR';
      $consulta_xml .= '</variables>';
      $consulta_xml .= '<documento>';
      $consulta_xml .= "<NUMNITEMPRESATRANSPORTE>'" . MINTRANS_NIT . "'</NUMNITEMPRESATRANSPORTE> ";
      $consulta_xml .= "<NUMPLACA>'" . $id . "'</NUMPLACA>";
      $consulta_xml .= '</documento>';
    }
    $consulta_xml .= '</root>';
    $result_rndc = $this->rndc_conexion($consulta_xml);
    return $result_rndc;
    // print_r($result_rndc);
    // $convierte_xml = new SimpleXMLElement($result_rndc);
    // echo $convierte_xml->documento[0]->nomidtercero;
    // echo $convierte_xml->documento[0]->codtipoidtercero;
    // echo $peliculas->pelicula[0]->argumento;
    // exit();
  }

  // CONSULTA DE DOCUMENTOS DE CARGA EN EL MINISTERIO
  public function Consulta_Documento_Carga($op, $id, $proceso, $tipopro)
  {
    $consulta_xml = "";
    $consulta_xml .= "<?xml version='1.0' encoding='ISO-8859-1'?>";
    $consulta_xml .= '<root>';
    $consulta_xml .= '<acceso>';
    $consulta_xml .= '<username>' . MINTRANS_USER . '</username>';
    $consulta_xml .= '<password>' . MINTRANS_PASS . '</password>';
    $consulta_xml .= '</acceso>';
    $consulta_xml .= '<solicitud>';
    $consulta_xml .= '<tipo>' . $tipopro . '</tipo>';
    $consulta_xml .= '<procesoid>' . $proceso . '</procesoid>';
    $consulta_xml .= '</solicitud>';

    if ($op == 1) { // Consulta Remesa
      $consulta_xml .= '<variables>
       INGRESOID,FECHAING,CONSECUTIVOREMESA,CODOPERACIONTRANSPORTE
      </variables>';
      $consulta_xml .= '<documento>';
      $consulta_xml .= '<NUMNITEMPRESATRANSPORTE>9000625968</NUMNITEMPRESATRANSPORTE>';
      $consulta_xml .= '<CONSECUTIVOREMESA>' . $id . '</CONSECUTIVOREMESA>';
      $consulta_xml .= '</documento>';
    }

    if ($op == 2) { // Consulta Manifiesto Carga
      $consulta_xml .= '<variables>
        INGRESOID,FECHAING,NUMMANIFIESTOCARGA,FECHAEXPEDICIONMANIFIESTO,CODOPERACIONTRANSPORTE
     </variables>';
      $consulta_xml .= '<documento>';
      $consulta_xml .= '<NUMNITEMPRESATRANSPORTE>9000625968</NUMNITEMPRESATRANSPORTE>';
      $consulta_xml .= '<NUMMANIFIESTOCARGA>' . $id . '</NUMMANIFIESTOCARGA>';
      $consulta_xml .= '</documento>';
    }
    $consulta_xml .= '</root>';
    $result_rndc = $this->rndc_conexion($consulta_xml);
    return $result_rndc;
  }
  // TRANSMISION DE TERCEROS
  public function terceros()
  {
    $op = $_POST['dato'];
    $id = $_POST['id'];
    $tiptercero = $_POST['filtro'];
    $tipoproc = $_POST['tipopro'];
    $proceso = $_POST['proceso'];
    $tipdoc = $_POST['tipdoc'];
    $conduce = $_POST['conduce'];
    $rndc_tercero = $this->_modelo->Tercero_Ministerio($id);
    if ($rndc_tercero == true) {
      $resulta_rndc = $this->consulta_webService($op, $id, $tiptercero, $tipdoc, $tipoproc, $proceso);
      $convierte_xml = new SimpleXMLElement($resulta_rndc);
      if ($convierte_xml->ErrorMSG[0]) {
        // echo 'No existe el tercero';
        if ($convierte_xml->ErrorMSG[0] == 'Error RNDC11: Documento no encontrado.') {
          // RNDC11 Documento no encontrado, transmite
          // echo 'documento no encontrado, INSERTAR VARIABLES';
        } else { // escalar error a usuario final //echo 'error diferente 11';
          // Homologar Datos
          $msg_error = '';
          $nomsede = '';
          $codsede = '';
          $telefonofijo = '';
          $primerapellido = '';
          $segundoapellido = '';
          $celular = '';
          $categoria = '';
          $numlicencia = '';
          $numdoc = '';
          if ($rndc_tercero[0]['tipo_documento'] == 'NIT') {
            $nomsede = 'PRINCIPAL';
            $codsede = '1';
            $telefonofijo = $rndc_tercero[0]['contacto'];
            $documento = $rndc_tercero[0]['numero_documento'];
            $digito = $rndc_tercero[0]['digito_verificacion'];
            $numdoc = ($documento . $digito);
          }
          if ($rndc_tercero[0]['tipo_documento'] !== 'NIT') {
            $primerapellido = $rndc_tercero[0]['apellido1'];
            $segundoapellido = $rndc_tercero[0]['apellido2'];
            $celular = $rndc_tercero[0]['celular'];
            $numdoc = $rndc_tercero[0]['numero_documento'];
          }
          if ($conduce == 1) {
            $categoria = $rndc_tercero[0]['rndc_categoria_licencia'];
            $numlicencia = $rndc_tercero[0]['rndc_numero_licencia'];
            $fechalicencia = $rndc_tercero[0]['flicencia_rndc'];
          } else {
            $fechalicencia = '';
          }

          if ($rndc_tercero[0]['tipo_documento'] == 'Cedula de Ciudadania') {
            $tdoc = 'C';
          }
          if ($rndc_tercero[0]['tipo_documento'] == 'NIT') {
            $tdoc = 'N';
          }
          if ($rndc_tercero[0]['tipo_documento'] == 'Cedula de Extranjeria') {
            $tdoc = 'E';
          }
          $xml_tercero = '';
          $xml_tercero = "<?xml version='1.0' encoding='ISO-8859-1'?>";
          $xml_tercero .= '<root>';
          $xml_tercero .= '<acceso>';
          $xml_tercero .= '<username>' . MINTRANS_USER . '</username>
                           <password>' . MINTRANS_PASS . '</password>';
          $xml_tercero .= '</acceso>';
          $xml_tercero .= '<solicitud>';
          $xml_tercero .= '<tipo>1</tipo>';
          $xml_tercero .= '<procesoid>11</procesoid>';
          $xml_tercero .= '</solicitud>';
          $xml_tercero .= '<variables>';
          $xml_tercero .= '<NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>';
          $xml_tercero .= '<CODTIPOIDTERCERO>' . $tdoc . '</CODTIPOIDTERCERO>';
          /* $xml_tercero.="<NUMIDTERCERO>".$numdoc."2367865</NUMIDTERCERO>"; */
          $xml_tercero .= '<NUMIDTERCERO>' . $numdoc . '</NUMIDTERCERO>';
          $xml_tercero .= '<NOMIDTERCERO>' . $rndc_tercero[0]['nombre'] . '</NOMIDTERCERO>';
          // TERCERO SIN NIT
          $xml_tercero .= '<PRIMERAPELLIDOIDTERCERO>' . $primerapellido . '</PRIMERAPELLIDOIDTERCERO>';
          $xml_tercero .= '<SEGUNDOAPELLIDOIDTERCERO>' . $segundoapellido . '</SEGUNDOAPELLIDOIDTERCERO>';
          // TERCERO CO NIT
          $xml_tercero .= '<NOMSEDETERCERO>' . $nomsede . '</NOMSEDETERCERO>';
          $xml_tercero .= '<CODSEDETERCERO>' . $codsede . '</CODSEDETERCERO>';
          // DATOS BASICOS
          $xml_tercero .= '<NUMTELEFONOCONTACTO>' . $telefonofijo . '</NUMTELEFONOCONTACTO>';
          $xml_tercero .= '<NUMCELULARPERSONA>' . $celular . '</NUMCELULARPERSONA>';
          $xml_tercero .= '<NOMENCLATURADIRECCION>' . $rndc_tercero[0]['direccion'] . '</NOMENCLATURADIRECCION>';
          $xml_tercero .= '<CODMUNICIPIORNDC>' . $rndc_tercero[0]['rndc_codigo_ciudad'] . '</CODMUNICIPIORNDC>';
          // TERCERO CON LICENCIA DE CONDUCCION
          $xml_tercero .= '<NUMLICENCIACONDUCCION>' . $numlicencia . '</NUMLICENCIACONDUCCION>';
          $xml_tercero .= '<CODCATEGORIALICENCIACONDUCCION>' . $categoria . '</CODCATEGORIALICENCIACONDUCCION>';
          $xml_tercero .= '<FECHAVENCIMIENTOLICENCIA>' . $fechalicencia . '</FECHAVENCIMIENTOLICENCIA>';
          $xml_tercero .= '</variables>';
          $xml_tercero .= '</root>';
          // Se envian datos en tabla ministerio de transporte
          $tercerarg = '';
          $accion = 'crear';
          $result_tercero = $this->rndc_conexion($xml_tercero);
          // Se pasa la respuesta del Web Service a un array php
          // $xml = simplexml_load_string(utf8_decode($result_tercero));
          $xml = simplexml_load_string(mb_convert_encoding($result_tercero, 'ISO-8859-1', 'UTF-8'));
          $json = json_encode($xml);
          $resultm = json_decode($json, true);

          #Nuevas Validaciones
          // Depurar la estructura para asegurar que tienes el mensaje
          // print_r($resultm);

          // Asegurarse de que $resultm contiene el mensaje de error
          if (is_array($resultm) && isset($resultm['ErrorMSG'])) {
            $mensaje = $resultm['ErrorMSG']; // Mensaje de error encontrado
          } else {
            $mensaje = $resultm; // Si es una cadena directamente
          }


          // Suponiendo que el mensaje está en $mensaje['ErrorMSG']
          if (isset($resultm['ErrorMSG'])) {
            $texto = $resultm['ErrorMSG'];
            if (strpos($texto, 'DUPLICADO') !== false && strpos($texto, 'TER015') !== false) {
              echo "Se encontró el mensaje: $texto";
            }
          }



          // Detectar la codificación
          // $encoding = mb_detect_encoding($mensaje, ['UTF-8', 'ISO-8859-1', 'ISO-8859-15', 'Windows-1252'], true);

          // if ($encoding) {
          //   echo "La codificación detectada es: " . $encoding;
          // } else {
          //   echo "No se pudo detectar la codificación.";
          // }

          // Decodificar el mensaje en UTF-8 directamente (ya está en UTF-8)
          // $mensaje_decodificado = mb_convert_encoding($mensaje, 'ISO-8859-1', 'UTF-8');
          // var_dump($mensaje_decodificado);
          // exit();
          // Usar preg_match en el mensaje decodificado
          // if (preg_match('/DUPLICADO:\d+ Error TER\d{3}.*Usuario:\s*\d+/', $mensaje, $coincidencia)) {
          //   echo $coincidencia[0]; // Mostrar el mensaje encontrado
          // } else {
          //   echo "No se encontró el mensaje en el formato esperado.";
          // }


          //   // Se registra la última respuesta en la tabla de transacciones
          //   $estadoterg = 2;
          //   if (isset($resultm['ErrorMSG'])) {
          //     $msg_error .= $resultm['ErrorMSG'];
          //     $data['status'] = 'false';
          //     $data['resultado'] = $msg_error;
          //     $estadoterg = 0;
          //     $respuesta_trans2 = $this->_modelo->Transaccion_Nexos_Min($id, $xml_tercero, $result_tercero, $estadoterg, $accion);
          //     echo json_encode($data);
          //   } else {
          //     $rndc_ingresoid = $resultm['ingresoid'];
          //     $data['status'] = 'true';
          //     $data['resultado'] = $rndc_ingresoid;
          //     $estadoterg = 1;
          //     $respuesta_trans2 = $this->_modelo->Transaccion_Nexos_Min($id, $xml_tercero, $result_tercero, $estadoterg, $accion);
          //     echo json_encode($data);
          //   }
        }
      } else {
        // Traer datos de la consulta de XML
        // YA EXISTE ESTE TERCERO EN EL MINISTERIO
        $msg_error = '';
        $nombre_xml = $convierte_xml->documento[0]->nomidtercero;
        $codtipo_xml = $convierte_xml->documento[0]->codtipoidtercero;
        $documento_xml = $convierte_xml->documento[0]->numidtercero;
        $ape1_xml = $convierte_xml->documento[0]->PRIMERAPELLIDOIDTERCERO;
        $ape2_xml = $convierte_xml->documento[0]->SEGUNDOAPELLIDOIDTERCERO;
        $sede_xml = $convierte_xml->documento[0]->CODSEDETERCERO;
        $nomsede_xml = $convierte_xml->documento[0]->NOMSEDETERCERO;
        $tel_xml = $convierte_xml->documento[0]->NUMTELEFONOCONTACTO;
        $celular_xml = $convierte_xml->documento[0]->NUMCELULARPERSONA;
        $direccion_xml = $convierte_xml->documento[0]->NOMENCLATURADIRECCION;
        $municipio_xml = $convierte_xml->documento[0]->CODMUNICIPIORNDC;
        $categ_xml = $convierte_xml->documento[0]->CODCATEGORIALICENCIACONDUCCION;
        $licencia_xml = $convierte_xml->documento[0]->NUMLICENCIACONDUCCION;
        $venceli_xml = $convierte_xml->documento[0]->FECHAVENCIMIENTOLICENCIA;
        $latitud_xml = $convierte_xml->documento[0]->LATITUD;
        $longitud_xml = $convierte_xml->documento[0]->LONGITUD;

        // Comparar los resultados del Ministerio con los registrados en la BD
        $nombre_upda = '';
        $numero_upda = '';
        $ape_upda = '';
        $ape_upda2 = '';
        $sede_upda = '';
        $fijo_upda = '';
        $celular_upda = '';
        $dire_upda = '';
        $nomsede = 'PRINCIPAL';
        $codsede = '1';
        $municipio_upda = '';

        if ($rndc_tercero[0]['tipo_documento'] == 'NIT') {
          $tipodoc = 'N';
          $ape_upda = '<PRIMERAPELLIDOIDTERCERO></PRIMERAPELLIDOIDTERCERO>';
          $ape_upda2 = '<SEGUNDOAPELLIDOIDTERCERO></SEGUNDOAPELLIDOIDTERCERO>';
          $fijo_upda = '<NUMTELEFONOCONTACTO>' . $rndc_tercero[0]['contacto'] . '</NUMTELEFONOCONTACTO>';
          $celular_upda = '<NUMCELULARPERSONA></NUMCELULARPERSONA>';
          $codsede = '<CODSEDETERCERO>1</CODSEDETERCERO>';
          $nomsede = '<NOMSEDETERCERO>PRINCIPAL</NOMSEDETERCERO>';
        } else if ($rndc_tercero[0]['tipo_documento'] == 'Cedula de Ciudadania') {
          $tipodoc = 'C';
          $ape_upda = '<PRIMERAPELLIDOIDTERCERO>' . $rndc_tercero[0]['apellido1'] . '</PRIMERAPELLIDOIDTERCERO>';
          $ape_upda2 = '<SEGUNDOAPELLIDOIDTERCERO>' . $rndc_tercero[0]['apellido2'] . '</SEGUNDOAPELLIDOIDTERCERO>';
          $fijo_upda = '<NUMTELEFONOCONTACTO></NUMTELEFONOCONTACTO>';
          $celular_upda = '<NUMCELULARPERSONA>' . $rndc_tercero[0]['celular'] . '</NUMCELULARPERSONA>';
          $codsede = '<CODSEDETERCERO></CODSEDETERCERO>';
          $nomsede = '<NOMSEDETERCERO></NOMSEDETERCERO>';
        } else if ($rndc_tercero[0]['tipo_documento'] == 'Cedula de Extranjeria') {
          $tipodoc = 'E';
          $ape_upda = '<PRIMERAPELLIDOIDTERCERO>' . $rndc_tercero[0]['apellido1'] . '</PRIMERAPELLIDOIDTERCERO>';
          $ape_upda2 = '<SEGUNDOAPELLIDOIDTERCERO>' . $rndc_tercero[0]['apellido2'] . '</SEGUNDOAPELLIDOIDTERCERO>';
          $fijo_upda = '<NUMTELEFONOCONTACTO></NUMTELEFONOCONTACTO>';
          $celular_upda = '<NUMCELULARPERSONA>' . $rndc_tercero[0]['celular'] . '</NUMCELULARPERSONA>';
          $codsede = '<CODSEDETERCERO></CODSEDETERCERO>';
          $nomsede = '<NOMSEDETERCERO></NOMSEDETERCERO>';
        }
        $dire_upda = '<NOMENCLATURADIRECCION>' . $rndc_tercero[0]['direccion'] . '</NOMENCLATURADIRECCION>';
        $municipio_upda = '<CODMUNICIPIORNDC>' . $rndc_tercero[0]['rndc_codigo_ciudad'] . '</CODMUNICIPIORNDC>';

        if (isset($rndc_tercero[0]['rndc_numero_licencia']) && $rndc_tercero[0]['rndc_numero_licencia'] != null && $conduce = 1) {
          $fechalicencia = $rndc_tercero[0]['flicencia_rndc'];
          $categoria_upda = '<CODCATEGORIALICENCIACONDUCCION>' . $rndc_tercero[0]['rndc_categoria_licencia'] . '</CODCATEGORIALICENCIACONDUCCION>';
          $licencia = '<NUMLICENCIACONDUCCION>' . $rndc_tercero[0]['rndc_numero_licencia'] . '</NUMLICENCIACONDUCCION>';
          $fechavence = '<FECHAVENCIMIENTOLICENCIA>' . $fechalicencia . '</FECHAVENCIMIENTOLICENCIA>';
          $datos_conductor = $categoria_upda . $licencia . $fechavence;
        } else {
          $datos_conductor = '';
        }

        $xml_tercero = '';
        $xml_tercero = "<?xml version='1.0' encoding='ISO-8859-1'?>";
        $xml_tercero .= '<root>';
        $xml_tercero .= '<acceso>';
        $xml_tercero .= '<username>' . MINTRANS_USER . '</username>
                          <password>' . MINTRANS_PASS . '</password>';
        $xml_tercero .= '</acceso>';
        $xml_tercero .= '<solicitud>';
        $xml_tercero .= '<tipo>1</tipo>';
        $xml_tercero .= '<procesoid>11</procesoid>';
        $xml_tercero .= '</solicitud>';
        $xml_tercero .= '<variables>';
        $xml_tercero .= '<NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>';
        $xml_tercero .= '<CODTIPOIDTERCERO>' . $tipodoc . '</CODTIPOIDTERCERO>';
        $xml_tercero .= '<NUMIDTERCERO>' . $rndc_tercero[0]['numero_documento'] . '</NUMIDTERCERO>';
        $xml_tercero .= '<NOMIDTERCERO>' . $rndc_tercero[0]['nombre'] . '</NOMIDTERCERO>';
        $xml_tercero .= $ape_upda;
        $xml_tercero .= $ape_upda2;
        $xml_tercero .= $codsede;
        $xml_tercero .= $nomsede;
        $xml_tercero .= $fijo_upda;
        $xml_tercero .= $celular_upda;
        $xml_tercero .= $dire_upda;
        $xml_tercero .= $municipio_upda;
        $xml_tercero .= $datos_conductor;
        $xml_tercero .= '</variables>';
        $xml_tercero .= '</root>';
        // Se envian datos en tabla ministerio de transporte
        $tercerarg = '';
        $accion = 'Actualizar';
        $result_tercero = $this->rndc_conexion($xml_tercero);
        // Se pasa la respuesta del Web Service a un array php
        // $xml = simplexml_load_string(utf8_decode($result_tercero));
        $xml = simplexml_load_string(mb_convert_encoding($result_tercero, 'UTF-8', 'ISO-8859-1'));
        $json = json_encode($xml);
        $resultm = json_decode($json, true);
        // Se registra la última respuesta en la tabla de transacciones
        if (isset($resultm['ErrorMSG'])) {
          $msg_error .= $resultm['ErrorMSG'];
          $data['status'] = 'false';
          $data['resultado'] = $msg_error;
          $estadoterg = 0;
          $respuesta_trans2 = $this->_modelo->Transaccion_Nexos_Min($id, $xml_tercero, $result_tercero, $estadoterg, $accion);
          echo json_encode($data);
        } else {
          $rndc_ingresoid = $resultm['ingresoid'];
          $data['status'] = 'true';
          $data['resultado'] = $rndc_ingresoid;
          $estadoterg = 1;
          $respuesta_trans2 = $this->_modelo->Transaccion_Nexos_Min($id, $xml_tercero, $result_tercero, $estadoterg, $accion);
          echo json_encode($data);
        }
      }
    }
  }

  // TRANSIMISION DE VEHICULOS
  public function vehiculos()
  {
    $placa = $_POST['placa'];
    $proceso = $_POST['proceso'];
    $op = $_POST['dato'];
    $tipoproc = $_POST['tipopro'];
    $id = $_POST['placa'];
    $tiptercero = false;
    $tipdoc = false;
    $msg_error = '';
    // consultar datos homologados
    $rndc_vehiculo = $this->_modelo->Vehiculo_Ministerio($placa);
    if ($rndc_vehiculo == true) {
      $resulta_rndc = $this->consulta_webService($op, $id, $tiptercero, $tipdoc, $tipoproc, $proceso);
      $convierte_xml = new SimpleXMLElement($resulta_rndc);
      if ($convierte_xml->ErrorMSG[0]) {
        if ($convierte_xml->ErrorMSG[0] == 'Error RNDC11: Documento no encontrado.') {
          // no se ecnontro entonces insertar
        } else {
          // homologar datos
          if ($rndc_vehiculo[0]['tdoc_pro'] == 'Cedula de Ciudadania') {
            $tipodocumento_pro = 'C';
            $documento_popietario = ($rndc_vehiculo[0]['doc_pro']);
          } else if ($rndc_vehiculo[0]['tdoc_pro'] == 'Cedula de Extranjeria') {
            $tipodocumento_pro = 'E';
            $documento_popietario = ($rndc_vehiculo[0]['doc_pro']);
          } else if ($rndc_vehiculo[0]['tdoc_pro'] == 'NIT') {
            $tipodocumento_pro = 'N';
            $documento_popietario = ($rndc_vehiculo[0]['doc_pro'] . $rndc_vehiculo[0]['digito_prop']);
          }
          if ($rndc_vehiculo[0]['tdoc_ten'] == 'Cedula de Ciudadania') {
            $tipodocumento_ten = 'C';
            $documento_tenedor = ($rndc_vehiculo[0]['doc_ten']);
          } else if ($rndc_vehiculo[0]['tdoc_ten'] == 'Cedula de Extranjeria') {
            $tipodocumento_ten = 'E';
            $documento_tenedor = ($rndc_vehiculo[0]['doc_ten']);
          } else if ($rndc_vehiculo[0]['tdoc_ten'] == 'NIT') {
            $tipodocumento_ten = 'N';
            $documento_tenedor = ($rndc_vehiculo[0]['doc_ten'] . $rndc_vehiculo[0]['dig_posee']);
          }
          // CARROCERIA
          if (
            $rndc_vehiculo[0]['rndc_vehiculo'] == 53 ||
            $rndc_vehiculo[0]['rndc_vehiculo'] == 54 ||
            $rndc_vehiculo[0]['rndc_vehiculo'] == 55
          ) {
            $carroceria = '0'; // S.R.S
          } else {
            $carroceria = $rndc_vehiculo[0]['rndc_carroceria'];
          }
          // NUMERO DE EJES
          if (
            $rndc_vehiculo[0]['rndc_vehiculo'] == 55 ||
            $rndc_vehiculo[0]['rndc_id_trailer'] == 64 ||
            $rndc_vehiculo[0]['rndc_id_trailer'] == 74 ||
            $rndc_vehiculo[0]['rndc_id_trailer'] == 85
          ) {
            $numejes = '<NUMEJES>' . substr($rndc_vehiculo[0]['ccompleta'], 0) . '</NUMEJES>';
          } else {
            $numejes = '<NUMEJES></NUMEJES>';
          }
          // CAPACIDAD CARGA
          if (
            $rndc_vehiculo[0]['rndc_vehiculo'] == 50 ||
            $rndc_vehiculo[0]['rndc_vehiculo'] == 55 ||
            $rndc_vehiculo[0]['rndc_id_trailer'] == 64 ||
            $rndc_vehiculo[0]['rndc_id_trailer'] == 74 ||
            $rndc_vehiculo[0]['rndc_id_trailer'] == 85
          ) {
            $capacidad = $rndc_vehiculo[0]['capacidad_tn'];
          } else {
            $capacidad = $rndc_vehiculo[0]['capacidad_tn'];
          }
          // TIPO COMBUSTIBLE
          if ($rndc_vehiculo[0]['cod_tipo_combustible'] == 1) { // gasolina
            $combustion = 2;
          } else if ($rndc_vehiculo[0]['cod_tipo_combustible'] == 3) { // DIESEL
            $combustion = 1;
          } else if ($rndc_vehiculo[0]['cod_tipo_combustible'] == 12) { // ACPM
            $combustion = 1;
          } else if ($rndc_vehiculo[0]['cod_tipo_combustible'] == 4) { // GAS/GSOLINA
            $combustion = 4;
          } else if ($rndc_vehiculo[0]['cod_tipo_combustible'] == 13) { // GAS
            $combustion = 3;
          } else if ($rndc_vehiculo[0]['cod_tipo_combustible'] == 2) { // GNV
            $combustion = 3;
          } else if ($rndc_vehiculo[0]['cod_tipo_combustible'] == 5) { // ELECTRICO
            $combustion = 5;
          }

          $fecha_vence_soat = date('d/m/Y', strtotime($rndc_vehiculo[0]['vence_soat']));
          $xml_vehiculo = '';
          $xml_vehiculo .= "<?xml version='1.0' encoding='ISO-8859-1'?>";
          $xml_vehiculo .= '<root>';
          $xml_vehiculo .= '<acceso>';
          $xml_vehiculo .= '<username>' . MINTRANS_USER . '</username>
                              <password>' . MINTRANS_PASS . '</password>';
          $xml_vehiculo .= '</acceso>';
          $xml_vehiculo .= '<solicitud>';
          $xml_vehiculo .= '<tipo>1</tipo>';
          $xml_vehiculo .= '<procesoid>12</procesoid>';
          $xml_vehiculo .= '</solicitud>';
          $xml_vehiculo .= '<variables>';
          $xml_vehiculo .= '<NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>';
          $xml_vehiculo .= '<NUMPLACA>' . $placa . '</NUMPLACA>';
          $xml_vehiculo .= '<CODCONFIGURACIONUNIDADCARGA>' . $rndc_vehiculo[0]['rndc_vehiculo'] . '</CODCONFIGURACIONUNIDADCARGA>';
          $xml_vehiculo .= '<CODMARCAVEHICULOCARGA>' . $rndc_vehiculo[0]['rndc_marca'] . '</CODMARCAVEHICULOCARGA>';
          $xml_vehiculo .= '<CODLINEAVEHICULOCARGA>' . $rndc_vehiculo[0]['rndc_linea'] . '</CODLINEAVEHICULOCARGA>';
          $xml_vehiculo .= $numejes;
          $xml_vehiculo .= '<ANOFABRICACIONVEHICULOCARGA>' . $rndc_vehiculo[0]['anio_fabricacion'] . '</ANOFABRICACIONVEHICULOCARGA>';
          $xml_vehiculo .= '<CODTIPOIDPROPIETARIO>' . $tipodocumento_pro . '</CODTIPOIDPROPIETARIO>';
          $xml_vehiculo .= '<NUMIDPROPIETARIO>' . $documento_popietario . '</NUMIDPROPIETARIO>';
          $xml_vehiculo .= '<CODTIPOIDTENEDOR>' . $tipodocumento_ten . '</CODTIPOIDTENEDOR>';
          $xml_vehiculo .= '<NUMIDTENEDOR>' . $documento_tenedor . '</NUMIDTENEDOR>';
          $xml_vehiculo .= '<CODTIPOCOMBUSTIBLE>' . $combustion . '</CODTIPOCOMBUSTIBLE>';
          $xml_vehiculo .= '<PESOVEHICULOVACIO>' . $rndc_vehiculo[0]['peso'] . '</PESOVEHICULOVACIO>';
          $xml_vehiculo .= '<CODCOLORVEHICULOCARGA>' . $rndc_vehiculo[0]['color'] . '</CODCOLORVEHICULOCARGA>';
          $xml_vehiculo .= '<CODTIPOCARROCERIA>' . $carroceria . '</CODTIPOCARROCERIA>';
          $xml_vehiculo .= '<NUMNITASEGURADORASOAT>' . $rndc_vehiculo[0]['rndc_aseguradora'] . '</NUMNITASEGURADORASOAT>';
          $xml_vehiculo .= '<FECHAVENCIMIENTOSOAT>' . $fecha_vence_soat . '</FECHAVENCIMIENTOSOAT>';
          $xml_vehiculo .= '<NUMSEGUROSOAT>' . $rndc_vehiculo[0]['num_soat'] . '</NUMSEGUROSOAT>';
          $xml_vehiculo .= '<CAPACIDADUNIDADCARGA>' . $capacidad . '</CAPACIDADUNIDADCARGA>';
          $xml_vehiculo .= '<UNIDADMEDIDACAPACIDAD>KG</UNIDADMEDIDACAPACIDAD>';
          $xml_vehiculo .= '</variables>';
          $xml_vehiculo .= '</root>';
          // Se envian datos en tabla ministerio de transporte
          $tercerarg = '';
          $accion = 'Crear';
          $identifi = 'Vehiculo';
          $result_vehiculo = $this->rndc_conexion($xml_vehiculo);

          // Se pasa la respuesta del Web Service a un array php
          // $xml = simplexml_load_string(utf8_decode($result_vehiculo));
          $xml = simplexml_load_string(mb_convert_encoding($result_vehiculo, 'ISO-8859-1', 'UTF-8'));
          // $xml = simplexml_load_string(mb_convert_encoding($result_vehiculo, 'UTF-8', 'ISO-8859-1'));
          $json = json_encode($xml);
          $resultm = json_decode($json, true);
          // Se registra la última respuesta en la tabla de transacciones
          if (isset($resultm['ErrorMSG'])) {
            $estadoterg = 0;
            $respuesta_trans2 = $this->_modelo->Transaccion_Nexos_Min2(
              $placa,
              $xml_vehiculo,
              $result_vehiculo,
              $estadoterg,
              $accion,
              $identifi
            );
          } else {
            $estadoterg = 1;
            $respuesta_trans2 = $this->_modelo->Transaccion_Nexos_Min2(
              $placa,
              $xml_vehiculo,
              $result_vehiculo,
              $estadoterg,
              $accion,
              $identifi
            );
          }

          if (isset($resultm['ErrorMSG'])) {
            $msg_error .= $resultm['ErrorMSG'];
            $data['status'] = 'false';
            $data['resultado'] = $msg_error;
            echo json_encode($data);
          } else {
            $rndc_ingresoid = $resultm['ingresoid'];
            $data['status'] = 'true';
            $data['resultado'] = $rndc_ingresoid;
            echo json_encode($data);
          }
        }
      } else {
        // homologar datos
        if ($rndc_vehiculo[0]['tdoc_pro'] == 'Cedula de Ciudadania') {
          $tipodocumento_pro = 'C';
          $docu_propietario = ($rndc_vehiculo[0]['doc_pro']);
        } else if ($rndc_vehiculo[0]['tdoc_pro'] == 'Cedula de Extranjeria') {
          $tipodocumento_pro = 'E';
          $docu_propietario = ($rndc_vehiculo[0]['doc_pro']);
        } else if ($rndc_vehiculo[0]['tdoc_pro'] == 'NIT') {
          $tipodocumento_pro = 'N';
          $docu_propietario = ($rndc_vehiculo[0]['doc_pro'] . $rndc_vehiculo[0]['digito_prop']);
        }
        if ($rndc_vehiculo[0]['tdoc_ten'] == 'Cedula de Ciudadania') {
          $tipodocumento_ten = 'C';
          $docu_poseedor = ($rndc_vehiculo[0]['doc_ten']);
        } else if ($rndc_vehiculo[0]['tdoc_ten'] == 'Cedula de Extranjeria') {
          $tipodocumento_ten = 'E';
          $docu_poseedor = ($rndc_vehiculo[0]['doc_ten']);
        } else if ($rndc_vehiculo[0]['tdoc_ten'] == 'NIT') {
          $tipodocumento_ten = 'N';
          $docu_poseedor = ($rndc_vehiculo[0]['doc_ten'] . $rndc_vehiculo[0]['dig_posee']);
        }
        // CARROCERIA
        if (
          $rndc_vehiculo[0]['rndc_vehiculo'] == 53 ||
          $rndc_vehiculo[0]['rndc_vehiculo'] == 54 ||
          $rndc_vehiculo[0]['rndc_vehiculo'] == 55
        ) {
          $carroceria = '0'; // S.R.S
        } else {
          $carroceria = $rndc_vehiculo[0]['rndc_carroceria'];
        }
        // NUMERO DE EJES
        if (
          $rndc_vehiculo[0]['rndc_vehiculo'] == 55 ||
          $rndc_vehiculo[0]['rndc_id_trailer'] == 64 ||
          $rndc_vehiculo[0]['rndc_id_trailer'] == 74 ||
          $rndc_vehiculo[0]['rndc_id_trailer'] == 85
        ) {
          $numejes = '<NUMEJES>' . substr($rndc_vehiculo[0]['ccompleta'], 0) . '</NUMEJES>';
        } else {
          $numejes = '<NUMEJES></NUMEJES>';
        }
        // CAPACIDAD CARGA
        if (
          $rndc_vehiculo[0]['rndc_vehiculo'] == 50 ||
          $rndc_vehiculo[0]['rndc_vehiculo'] == 55 ||
          $rndc_vehiculo[0]['rndc_id_trailer'] == 64 ||
          $rndc_vehiculo[0]['rndc_id_trailer'] == 74 ||
          $rndc_vehiculo[0]['rndc_id_trailer'] == 85
        ) {
          $capacidad = $rndc_vehiculo[0]['capacidad_tn'];
        } else {
          $capacidad = $rndc_vehiculo[0]['capacidad_tn'];
        }
        // TIPO COMBUSTIBLE
        if ($rndc_vehiculo[0]['cod_tipo_combustible'] == 1) { // gasolina
          $combustion = 2;
        } else if ($rndc_vehiculo[0]['cod_tipo_combustible'] == 3) { // DIESEL
          $combustion = 1;
        } else if ($rndc_vehiculo[0]['cod_tipo_combustible'] == 12) { // ACPM
          $combustion = 1;
        } else if ($rndc_vehiculo[0]['cod_tipo_combustible'] == 4) { // GAS/GSOLINA
          $combustion = 4;
        } else if ($rndc_vehiculo[0]['cod_tipo_combustible'] == 13) { // GAS
          $combustion = 3;
        } else if ($rndc_vehiculo[0]['cod_tipo_combustible'] == 2) { // GNV
          $combustion = 3;
        } else if ($rndc_vehiculo[0]['cod_tipo_combustible'] == 5) { // ELECTRICO
          $combustion = 5;
        }

        $fecha_vence_soat = date('d/m/Y', strtotime($rndc_vehiculo[0]['vence_soat']));
        $xml_vehiculo = '';
        $xml_vehiculo .= "<?xml version='1.0' encoding='ISO-8859-1'?>";
        $xml_vehiculo .= '<root>';
        $xml_vehiculo .= '<acceso>';
        $xml_vehiculo .= '<username>' . MINTRANS_USER . '</username>
                          <password>' . MINTRANS_PASS . '</password>';
        $xml_vehiculo .= '</acceso>';
        $xml_vehiculo .= '<solicitud>';
        $xml_vehiculo .= '<tipo>1</tipo>';
        $xml_vehiculo .= '<procesoid>12</procesoid>';
        $xml_vehiculo .= '</solicitud>';
        $xml_vehiculo .= '<variables>';
        $xml_vehiculo .= '<NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>';
        $xml_vehiculo .= '<NUMPLACA>' . $placa . '</NUMPLACA>';
        $xml_vehiculo .= '<CODCONFIGURACIONUNIDADCARGA>' . $rndc_vehiculo[0]['rndc_vehiculo'] . '</CODCONFIGURACIONUNIDADCARGA>';
        $xml_vehiculo .= '<CODMARCAVEHICULOCARGA>' . $rndc_vehiculo[0]['rndc_marca'] . '</CODMARCAVEHICULOCARGA>';
        $xml_vehiculo .= '<CODLINEAVEHICULOCARGA>' . $rndc_vehiculo[0]['rndc_linea'] . '</CODLINEAVEHICULOCARGA>';
        $xml_vehiculo .= $numejes;
        $xml_vehiculo .= '<ANOFABRICACIONVEHICULOCARGA>' . $rndc_vehiculo[0]['anio_fabricacion'] . '</ANOFABRICACIONVEHICULOCARGA>';
        $xml_vehiculo .= '<CODTIPOIDPROPIETARIO>' . $tipodocumento_pro . '</CODTIPOIDPROPIETARIO>';
        $xml_vehiculo .= '<NUMIDPROPIETARIO>' . $docu_propietario . '</NUMIDPROPIETARIO>';
        $xml_vehiculo .= '<CODTIPOIDTENEDOR>' . $tipodocumento_ten . '</CODTIPOIDTENEDOR>';
        $xml_vehiculo .= '<NUMIDTENEDOR>' . $docu_poseedor . '</NUMIDTENEDOR>';
        $xml_vehiculo .= '<CODTIPOCOMBUSTIBLE>' . $combustion . '</CODTIPOCOMBUSTIBLE>';
        $xml_vehiculo .= '<PESOVEHICULOVACIO>' . $rndc_vehiculo[0]['peso'] . '</PESOVEHICULOVACIO>';
        $xml_vehiculo .= '<CODCOLORVEHICULOCARGA>' . $rndc_vehiculo[0]['color'] . '</CODCOLORVEHICULOCARGA>';
        $xml_vehiculo .= '<CODTIPOCARROCERIA>' . $carroceria . '</CODTIPOCARROCERIA>';
        $xml_vehiculo .= '<NUMNITASEGURADORASOAT>' . $rndc_vehiculo[0]['rndc_aseguradora'] . '</NUMNITASEGURADORASOAT>';
        $xml_vehiculo .= '<FECHAVENCIMIENTOSOAT>' . $fecha_vence_soat . '</FECHAVENCIMIENTOSOAT>';
        $xml_vehiculo .= '<NUMSEGUROSOAT>' . $rndc_vehiculo[0]['num_soat'] . '</NUMSEGUROSOAT>';
        $xml_vehiculo .= '<CAPACIDADUNIDADCARGA>' . $capacidad . '</CAPACIDADUNIDADCARGA>';
        $xml_vehiculo .= '<UNIDADMEDIDACAPACIDAD>KG</UNIDADMEDIDACAPACIDAD>';
        $xml_vehiculo .= '</variables>';
        $xml_vehiculo .= '</root>';
        // Se envian datos en tabla ministerio de transporte
        $tercerarg = '';
        $accion = 'Actualizar';
        $identifi = 'Vehiculo';
        $result_vehiculo = $this->rndc_conexion($xml_vehiculo);
        // Se pasa la respuesta del Web Service a un array php
        // $xml = simplexml_load_string(utf8_decode($result_vehiculo));
        $xml = simplexml_load_string(mb_convert_encoding($result_vehiculo, 'ISO-8859-1', 'UTF-8'));
        // $xml = simplexml_load_string(mb_convert_encoding($result_vehiculo, 'UTF-8', 'ISO-8859-1'));
        $json = json_encode($xml);
        $resultm = json_decode($json, true);
        // Se registra la última respuesta en la tabla de transacciones
        if (isset($resultm['ErrorMSG'])) {
          $estadoterg = 0;
          $respuesta_trans2 = $this->_modelo->Transaccion_Nexos_Min2(
            $placa,
            $xml,
            $result_vehiculo,
            $estadoterg,
            $accion,
            $identifi
          );
          // $respuesta_trans2=$this->_modelo->Transaccion_Nexos_Min2($placa,$xml_vehiculo);
        } else {
          $estadoterg = 1;
          $respuesta_trans2 = $this->_modelo->Transaccion_Nexos_Min2(
            $placa,
            $xml,
            $result_vehiculo,
            $estadoterg,
            $accion,
            $identifi
          );
          // $respuesta_trans2=$this->_modelo->Transaccion_Nexos_Min2($placa,$xml_vehiculo);
        }

        if (isset($resultm['ErrorMSG'])) {
          $msg_error .= $resultm['ErrorMSG'];
          $data['status'] = 'false';
          $data['resultado'] = $msg_error;
          echo json_encode($data);
        } else {
          $rndc_ingresoid = $resultm['ingresoid'];
          $data['status'] = 'true';
          $data['resultado'] = $rndc_ingresoid;
          echo json_encode($data);
        }
      }
    } // Cierre true consulta de vehículo
  }

  // TRANSMISION DE TRAILERS
  public function trailers()
  {
    $msg_error = '';
    $id = $_POST['placa'];
    $proceso = $_POST['proceso'];
    $op = $_POST['dato'];
    $filtro = $_POST['filtro'];
    $tipoproc = $_POST['tipopro'];
    $tiptercero = false;
    $tipdoc = false;
    // consultar datos homologados
    $rndc_trailer = $this->_modelo->Trailer_Ministerio($id);
    if ($rndc_trailer == true) {
      $resulta_rndc = $this->consulta_webService($op, $id, $tiptercero, $tipdoc, $tipoproc, $proceso);
      $convierte_xml = new SimpleXMLElement($resulta_rndc);
      if ($convierte_xml->ErrorMSG[0]) {
        if ($convierte_xml->ErrorMSG[0] == 'Error RNDC11: Documento no encontrado.') {
        } else {
          // homologacion datos
          if ($rndc_trailer[0]['tdoc_propietario'] == 'NIT') {
            $td_prop = 'N';
            $documento_popietario = ($rndc_trailer[0]['doc_propietario']
              . $rndc_trailer[0]['digito_propietario']);
          } else if ($rndc_trailer[0]['tdoc_propietario'] == 'Cedula de Ciudadania') {
            $td_prop = 'C';
            $documento_popietario = $rndc_trailer[0]['doc_propietario'];
          } else if ($rndc_trailer[0]['tdoc_propietario'] == 'Cedula de Extranjeria') {
            $td_prop = 'E';
            $documento_popietario = $rndc_trailer[0]['doc_propietario'];
          }
          // homologar poseedor
          if ($rndc_trailer[0]['tdoc_poseedor'] == 'NIT') {
            $td_ten = 'N';
            $documento_tenedor = ($rndc_trailer[0]['doc_poseedor']
              . $rndc_trailer[0]['digito_poseedor']);
          } else if ($rndc_trailer[0]['tdoc_poseedor'] == 'Cedula de Ciudadania') {
            $td_ten = 'C';
            $documento_tenedor = $rndc_trailer[0]['doc_poseedor'];
          } else if ($rndc_trailer[0]['tdoc_poseedor'] == 'Cedula de Extranjeria') {
            $td_ten = 'E';
            $documento_tenedor = $rndc_trailer[0]['doc_poseedor'];
          }
          // homologar numero de ejes
          if (
            $rndc_trailer[0]['rndc_configuracion'] == 64 ||
            $rndc_trailer[0]['rndc_configuracion'] == 74 ||
            $rndc_trailer[0]['rndc_configuracion'] == 85
          ) {
            if ($rndc_trailer[0]['rndc_configuracion'] == 64) {
              $ejes = 3;
            }
            if ($rndc_trailer[0]['rndc_configuracion'] == 74) {
              $ejes = 4;
            }
            if ($rndc_trailer[0]['rndc_configuracion'] == 85) {
              $ejes = 5;
            }
          } else {
            $ejes = '';
          }
          $xml_trailer = '';
          $xml_trailer .= "<?xml version='1.0' encoding='ISO-8859-1'?>";
          $xml_trailer .= '<root>';
          $xml_trailer .= '<acceso>';
          $xml_trailer .= '<username>' . MINTRANS_USER . '</username>
                           <password>' . MINTRANS_PASS . '</password>';
          $xml_trailer .= '</acceso>';
          $xml_trailer .= '<solicitud>';
          $xml_trailer .= '<tipo>1</tipo>';
          $xml_trailer .= '<procesoid>12</procesoid>';
          $xml_trailer .= '</solicitud>';
          $xml_trailer .= '<variables>';
          $xml_trailer .= '<NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>';
          $xml_trailer .= '<NUMPLACA>' . $id . '</NUMPLACA>';
          $xml_trailer .= '<CODCONFIGURACIONUNIDADCARGA>' . $rndc_trailer[0]['rndc_configuracion'] . '</CODCONFIGURACIONUNIDADCARGA>';
          $xml_trailer .= '<CODMARCAVEHICULOCARGA>' . $rndc_trailer[0]['rndc_marca'] . '</CODMARCAVEHICULOCARGA>';
          $xml_trailer .= '<NUMEJES>' . $ejes . '</NUMEJES>';
          $xml_trailer .= '<ANOFABRICACIONVEHICULOCARGA>' . $rndc_trailer[0]['modelo'] . '</ANOFABRICACIONVEHICULOCARGA>';
          $xml_trailer .= '<PESOVEHICULOVACIO>' . $rndc_trailer[0]['peso_vacio'] . '</PESOVEHICULOVACIO>';
          $xml_trailer .= '<CAPACIDADUNIDADCARGA>' . $rndc_trailer[0]['capacidad'] . '</CAPACIDADUNIDADCARGA>';
          $xml_trailer .= '<UNIDADMEDIDACAPACIDAD>KG</UNIDADMEDIDACAPACIDAD>';
          $xml_trailer .= '<CODTIPOCARROCERIA>' . $rndc_trailer[0]['rndc_carroceria'] . '</CODTIPOCARROCERIA>';
          $xml_trailer .= '<CODTIPOIDPROPIETARIO>' . $td_prop . '</CODTIPOIDPROPIETARIO>';
          $xml_trailer .= '<NUMIDPROPIETARIO>' . $documento_popietario . '</NUMIDPROPIETARIO>';
          $xml_trailer .= '<CODTIPOIDTENEDOR>' . $td_ten . '</CODTIPOIDTENEDOR>';
          $xml_trailer .= '<NUMIDTENEDOR>' . $documento_tenedor . '</NUMIDTENEDOR>';
          $xml_trailer .= '</variables>';
          $xml_trailer .= '</root>';
          // print_r($xml_trailer);
          $tercerarg = '';
          $accion = 'crear';
          $tipo = 'Trailer';
          // $respuesta_transaccion=$this->_modelo->Transaccion_Nexos_Min($id,$xml_trailer,$tercerarg,$estadoterg,$accion);
          $result_trailer = $this->rndc_conexion($xml_trailer);
          // $xml = simplexml_load_string(utf8_decode($result_trailer));
          $xml = simplexml_load_string(mb_convert_encoding($result_trailer, 'UTF-8', 'ISO-8859-1'));
          $json = json_encode($xml);
          $resultm = json_decode($json, true);

          if (isset($resultm['ErrorMSG'])) {
            $msg_error .= $resultm['ErrorMSG'];
            $data['status'] = 'false';
            $data['resultado'] = $msg_error;
            $estadoterg = 0;
            $respuesta_trans2 = $this->_modelo->Transaccion_Nexos_Min2(
              $id,
              $xml_trailer,
              $result_trailer,
              $tipo,
              $estadoterg,
              $accion
            );
            echo json_encode($data);
          } else {
            $rndc_ingresoid = $resultm['ingresoid'];
            $data['status'] = 'true';
            $data['resultado'] = $rndc_ingresoid;
            $estadoterg = 1;
            $respuesta_trans2 = $this->_modelo->Transaccion_Nexos_Min2(
              $id,
              $xml_trailer,
              $result_trailer,
              $tipo,
              $estadoterg,
              $accion
            );
            echo json_encode($data);
          }
        }
      } else {
        // actualizacion de trailer
        // homologacion datos
        if ($rndc_trailer[0]['tdoc_propietario'] == 'NIT') {
          $td_prop = 'N';
          $documento_popietario = ($rndc_trailer[0]['doc_propietario']
            . $rndc_trailer[0]['digito_propietario']);
        } else if ($rndc_trailer[0]['tdoc_propietario'] == 'Cedula de Ciudadania') {
          $td_prop = 'C';
          $documento_popietario = $rndc_trailer[0]['doc_propietario'];
        } else if ($rndc_trailer[0]['tdoc_propietario'] == 'Cedula de Extranjeria') {
          $td_prop = 'E';
          $documento_popietario = $rndc_trailer[0]['doc_propietario'];
        }
        // homologar poseedor
        if ($rndc_trailer[0]['tdoc_poseedor'] == 'NIT') {
          $td_ten = 'N';
          $documento_tenedor = ($rndc_trailer[0]['doc_poseedor']
            . $rndc_trailer[0]['digito_poseedor']);
        } else if ($rndc_trailer[0]['tdoc_poseedor'] == 'Cedula de Ciudadania') {
          $td_ten = 'C';
          $documento_tenedor = $rndc_trailer[0]['doc_poseedor'];
        } else if ($rndc_trailer[0]['tdoc_poseedor'] == 'Cedula de Extranjeria') {
          $td_ten = 'E';
          $documento_tenedor = $rndc_trailer[0]['doc_poseedor'];
        }
        // homologar numero de ejes
        if (
          $rndc_trailer[0]['rndc_configuracion'] == 64 ||
          $rndc_trailer[0]['rndc_configuracion'] == 74 ||
          $rndc_trailer[0]['rndc_configuracion'] == 85
        ) {
          if ($rndc_trailer[0]['rndc_configuracion'] == 64) {
            $ejes = 3;
          }
          if ($rndc_trailer[0]['rndc_configuracion'] == 74) {
            $ejes = 4;
          }
          if ($rndc_trailer[0]['rndc_configuracion'] == 85) {
            $ejes = 5;
          }
        } else {
          $ejes = '';
        }
        $xml_trailer = '';
        $xml_trailer .= "<?xml version='1.0' encoding='ISO-8859-1'?>";
        $xml_trailer .= '<root>';
        $xml_trailer .= '<acceso>';
        $xml_trailer .= '<username>' . MINTRANS_USER . '</username>
                         <password>' . MINTRANS_PASS . '</password>';
        $xml_trailer .= '</acceso>';
        $xml_trailer .= '<solicitud>';
        $xml_trailer .= '<tipo>1</tipo>';
        $xml_trailer .= '<procesoid>12</procesoid>';
        $xml_trailer .= '</solicitud>';
        $xml_trailer .= '<variables>';
        $xml_trailer .= '<NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>';
        $xml_trailer .= '<NUMPLACA>' . $id . '</NUMPLACA>';
        $xml_trailer .= '<CODCONFIGURACIONUNIDADCARGA>' . $rndc_trailer[0]['rndc_configuracion'] . '</CODCONFIGURACIONUNIDADCARGA>';
        $xml_trailer .= '<CODMARCAVEHICULOCARGA>' . $rndc_trailer[0]['rndc_marca'] . '</CODMARCAVEHICULOCARGA>';
        $xml_trailer .= '<NUMEJES>' . $ejes . '</NUMEJES>';
        $xml_trailer .= '<ANOFABRICACIONVEHICULOCARGA>' . $rndc_trailer[0]['modelo'] . '</ANOFABRICACIONVEHICULOCARGA>';
        $xml_trailer .= '<PESOVEHICULOVACIO>' . $rndc_trailer[0]['peso_vacio'] . '</PESOVEHICULOVACIO>';
        $xml_trailer .= '<CAPACIDADUNIDADCARGA>' . $rndc_trailer[0]['capacidad'] . '</CAPACIDADUNIDADCARGA>';
        $xml_trailer .= '<UNIDADMEDIDACAPACIDAD>KG</UNIDADMEDIDACAPACIDAD>';
        $xml_trailer .= '<CODTIPOCARROCERIA>' . $rndc_trailer[0]['rndc_carroceria'] . '</CODTIPOCARROCERIA>';
        $xml_trailer .= '<CODTIPOIDPROPIETARIO>' . $td_prop . '</CODTIPOIDPROPIETARIO>';
        $xml_trailer .= '<NUMIDPROPIETARIO>' . $documento_popietario . '</NUMIDPROPIETARIO>';
        $xml_trailer .= '<CODTIPOIDTENEDOR>' . $td_ten . '</CODTIPOIDTENEDOR>';
        $xml_trailer .= '<NUMIDTENEDOR>' . $documento_tenedor . '</NUMIDTENEDOR>';
        $xml_trailer .= '</variables>';
        $xml_trailer .= '</root>';
        // print_r($xml_trailer);
        $tercerarg = '';
        $estadoterg = 1;
        $accion = 'actualizar';
        $tipo = 'Trailer';
        $result_trailer = $this->rndc_conexion($xml_trailer);
        // $xml = simplexml_load_string(utf8_decode($result_trailer));
        $xml = simplexml_load_string(mb_convert_encoding($result_trailer, 'UTF-8', 'ISO-8859-1'));
        $json = json_encode($xml);
        $resultm = json_decode($json, true);
        if (isset($resultm['ErrorMSG'])) {
          $msg_error .= $resultm['ErrorMSG'];
          $data['status'] = 'false';
          $data['resultado'] = $msg_error;
          $estadoterg = 0;
          // $respuesta_trans2=$this->_modelo->Transaccion_Nexos_Min2($id,$xml_trailer,$result_trailer,$tipo,$estadoterg,$accion);
          $respuesta_trans2 = $this->_modelo->Transaccion_Nexos_Min($id, $xml_trailer, $resultm, $estadoterg, $accion);
          echo json_encode($data);
        } else {
          $rndc_ingresoid = $resultm['ingresoid'];
          $data['status'] = 'true';
          $data['resultado'] = $rndc_ingresoid;
          $estadoterg = 1;
          // $respuesta_trans2=$this->_modelo->Transaccion_Nexos_Min2($id,$xml_trailer,$result_trailer,$tipo,$estadoterg,$accion);
          $respuesta_trans2 = $this->_modelo->Transaccion_Nexos_Min($id, $xml_trailer, $resultm, $estadoterg, $accion);
          echo json_encode($data);
          echo json_encode($data);
        }
      }
    }
  }

  // TRANSMISION DE INFORMACION DE CARGA
  public function InformacionCarga()
  {
    $msg_error = '';
    $id = $_POST['id'];
    $proceso = $_POST['proceso'];
    $dato = $_POST['dato'];
    $tipopro = $_POST['tipopro'];
    $filtro = $_POST['filtro'];
    $tiptercero = false;
    $tipdoc = false;
    $id = $_POST['id'];
    $rndc_infocarga = $this->_modelo->Consulta_Informacion_carga($id);
    if ($rndc_infocarga == true) {
      // homologar datos
      $tipodoc_desti = '';
      $tipodocrem = '';
      $tipocli = '';
      $numdocume = '';
      $numdocdes = '';
      if ($rndc_infocarga[0]['tipo_documento_remi'] == 'NIT') {
        $tipodocrem = 'N';
        $numdocume = ($rndc_infocarga[0]['documento_remi'] . $rndc_infocarga[0]['digito_remi']);
      } else if ($rndc_infocarga[0]['tipo_documento_remi'] == 'Cedula de Ciudadania') {
        $tipodocrem = 'C';
        $numdocume = ($rndc_infocarga[0]['documento_remi']);
      } else if ($rndc_infocarga[0]['tipo_documento_remi'] == 'Cedula de Extranjeria') {
        $tipodocrem = 'E';
        $numdocume = ($rndc_infocarga[0]['documento_remi']);
      }

      if ($rndc_infocarga[0]['tipo_documento'] == 'NIT') {
        $tipodoc_desti = 'N';
        $numdocdes = ($rndc_infocarga[0]['documento'] . $rndc_infocarga[0]['digito_verificacion']);
      } else if ($rndc_infocarga[0]['tipo_documento'] == 'Cedula de Ciudadania') {
        $tipodoc_desti = 'C';
        $numdocdes = ($rndc_infocarga[0]['documento']);
      } else if ($rndc_infocarga[0]['tipo_documento'] == 'Cedula de Extranjeria') {
        $tipodoc_desti = 'E';
        $numdocdes = ($rndc_infocarga[0]['documento']);
      }

      // homologar fechas al formato que solicitad dd/mm/yy
      $fecha_cita_pactada = date('d/m/Y', strtotime($rndc_infocarga[0]['fecha_carga']));
      $fecha_descargue_pactada = date('d/m/Y', strtotime($rndc_infocarga[0]['fecha_descarga']));
      // homologar medida carga: (1)Kilogramo - (2)Galones
      $unidadmedida = 1;
      // envio de transacción nivel 1
      $xml_carga = '';
      $rta = '';
      $tipo = 'xml carga';
      $estadoenvio = 0;
      $accion = 'Crear';
      $respuesta_transaccion = $this->_modelo->Transaccion_Nexos_Min2(
        $rndc_infocarga[0]['id_orden_cargue'],
        $xml_carga,
        $rta,
        $tipo,
        $estadoenvio,
        $accion
      );
      $xml_cargaviaje = '';
      $xml_cargaviaje .= "<?xml version='1.0' encoding='ISO-8859-1'?>";
      $xml_cargaviaje .= '<root>';
      $xml_cargaviaje .= '<acceso>';
      $xml_cargaviaje .= '<username>' . MINTRANS_USER . '</username>';
      $xml_cargaviaje .= '<password>' . MINTRANS_PASS . '</password>';
      $xml_cargaviaje .= '</acceso>';
      $xml_cargaviaje .= '<solicitud>';
      $xml_cargaviaje .= '<tipo>1</tipo>';
      $xml_cargaviaje .= '<procesoid>1</procesoid>';
      $xml_cargaviaje .= '</solicitud>';
      $xml_cargaviaje .= '<variables>';
      $xml_cargaviaje .= '<NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>';
      $xml_cargaviaje .= '<CONSECUTIVOINFORMACIONCARGA>' . $rndc_infocarga[0]['id_orden_cargue'] . '</CONSECUTIVOINFORMACIONCARGA>';
      $xml_cargaviaje .= '<CODOPERACIONTRANSPORTE>' . $rndc_infocarga[0]['tipo_carga'] . '</CODOPERACIONTRANSPORTE>';
      $xml_cargaviaje .= '<CODTIPOEMPAQUE>' . $rndc_infocarga[0]['tipo_empaque'] . '</CODTIPOEMPAQUE>';
      $xml_cargaviaje .= '<CODNATURALEZACARGA>' . $rndc_infocarga[0]['naturaleza'] . '</CODNATURALEZACARGA>';
      $xml_cargaviaje .= '<DESCRIPCIONCORTAPRODUCTO>' . $rndc_infocarga[0]['tipo_mercancia'] . '</DESCRIPCIONCORTAPRODUCTO>';
      $xml_cargaviaje .= '<MERCANCIAINFORMACIONCARGA>' . $rndc_infocarga[0]['codigo'] . '</MERCANCIAINFORMACIONCARGA>';
      $xml_cargaviaje .= '<CANTIDADINFORMACIONCARGA>' . $rndc_infocarga[0]['cantidad_real_cargada'] . '</CANTIDADINFORMACIONCARGA>';
      $xml_cargaviaje .= '<UNIDADMEDIDACAPACIDAD>' . $unidadmedida . '</UNIDADMEDIDACAPACIDAD>';
      $xml_cargaviaje .= '<PESOCONTENEDORVACIO>' . $rndc_infocarga[0]['devol_pesovacio'] . '</PESOCONTENEDORVACIO>';
      $xml_cargaviaje .= '<CODTIPOIDREMITENTE>' . $tipodocrem . '</CODTIPOIDREMITENTE>';
      $xml_cargaviaje .= '<NUMIDREMITENTE>' . $numdocume . '</NUMIDREMITENTE>';
      $xml_cargaviaje .= '<CODSEDEREMITENTE>' . $rndc_infocarga[0]['sede_rem'] . '</CODSEDEREMITENTE>';
      $xml_cargaviaje .= '<PACTOTIEMPOCARGUE>SI</PACTOTIEMPOCARGUE>';
      $xml_cargaviaje .= '<HORASPACTOCARGA>' . $rndc_infocarga[0]['horaspactocarga'] . '</HORASPACTOCARGA>';
      $xml_cargaviaje .= '<MINUTOSPACTOCARGA>' . $rndc_infocarga[0]['minutospactocarga'] . '</MINUTOSPACTOCARGA>';
      $xml_cargaviaje .= '<CODTIPOIDDESTINATARIO>' . $tipodoc_desti . '</CODTIPOIDDESTINATARIO>';
      $xml_cargaviaje .= '<NUMIDDESTINATARIO>' . $numdocdes . '</NUMIDDESTINATARIO>';
      $xml_cargaviaje .= '<CODSEDEDESTINATARIO>' . $rndc_infocarga[0]['sede_dest'] . '</CODSEDEDESTINATARIO>';
      $xml_cargaviaje .= '<PACTOTIEMPODESCARGUE>SI</PACTOTIEMPODESCARGUE>';
      $xml_cargaviaje .= '<HORASPACTODESCARGUE>' . $rndc_infocarga[0]['horaspactodescargue'] . '</HORASPACTODESCARGUE>';
      $xml_cargaviaje .= '<MINUTOSPACTODESCARGUE>' . $rndc_infocarga[0]['minutospactodescargue'] . '</MINUTOSPACTODESCARGUE>';
      $xml_cargaviaje .= '<OBSERVACIONES></OBSERVACIONES>';
      $xml_cargaviaje .= '<FECHACITAPACTADACARGUE>' . $fecha_cita_pactada . '</FECHACITAPACTADACARGUE>';
      $xml_cargaviaje .= '<HORACITAPACTADACARGUE>' . $rndc_infocarga[0]['hora_carga'] . '</HORACITAPACTADACARGUE>';
      $xml_cargaviaje .= '<FECHACITAPACTADADESCARGUE>' . $fecha_descargue_pactada . '</FECHACITAPACTADADESCARGUE>';
      $xml_cargaviaje .= '<HORACITAPACTADADESCARGUEREMESA>' . $rndc_infocarga[0]['hora_descarga'] . '</HORACITAPACTADADESCARGUEREMESA>';
      $xml_cargaviaje .= '</variables>';
      $xml_cargaviaje .= '</root>';
      // envio de transacción nivel 2
      $rta = '';
      $tipo = 'xml carga';
      $estadoenvio2 = 1;
      $accion = 'Crear';
      $respuesta_transaccion = $this->_modelo->Transaccion_Nexos_Min2(
        $rndc_infocarga[0]['id_orden_cargue'],
        $xml_cargaviaje,
        $rta,
        $tipo,
        $estadoenvio2,
        $accion
      );
      $result_cargaviaje = $this->rndc_conexion($xml_cargaviaje);
      // $xml = simplexml_load_string(utf8_decode($result_cargaviaje));
      $xml = simplexml_load_string(mb_convert_encoding($result_cargaviaje, 'UTF-8', 'ISO-8859-1'));
      $json = json_encode($xml);
      $resultm = json_decode($json, true);
      // envio de transaccion nivel 3
      $respuesta_transaccion = $this->_modelo->Transaccion_Nexos_Min2(
        $rndc_infocarga[0]['id_orden_cargue'],
        $xml_cargaviaje,
        $result_cargaviaje,
        $tipo,
        $estadoenvio2,
        $accion
      );
      if (isset($resultm['ErrorMSG'])) {
        $msg_error .= $resultm['ErrorMSG'];
        $data['status'] = 'false';
        $data['resultado'] = $msg_error;
        echo json_encode($data);
      } else {
        $rndc_ingresoid = $resultm['ingresoid'];
        $data['status'] = 'true';
        $data['resultado'] = $rndc_ingresoid;
        echo json_encode($data);
      }
    }
  }

  // TRANSMISION DE INFORMACION DEL VIAJE

  public function InformacionViaje()
  {
    $id = $_POST['id']; // número manifiesto
    $proceso = $_POST['proceso'];
    $dato = $_POST['dato'];
    $filtro = $_POST['filtro'];
    $tipopro = $_POST['tipopro'];

    // consultardatos BD
    $rndc_infoviaje = $this->_modelo->Consulta_Informacion_viaje($id);
    if ($rndc_infoviaje == true) {
      // consulta datos en RNDC
      $xml_viaje = '';
      $xml_viaje .= "<?xml version='1.0' encoding='ISO-8859-1'?>";
      $xml_viaje .= '<root>';
      $xml_viaje .= '<acceso>';
      $xml_viaje .= '<username>' . MINTRANS_USER . '</username>';
      $xml_viaje .= '<password>' . MINTRANS_PASS . '</password>';
      $xml_viaje .= '</acceso>';
      $xml_viaje .= '<solicitud>';
      $xml_viaje .= '<tipo>1</tipo>';
      $xml_viaje .= '<procesoid>2</procesoid>';
      $xml_viaje .= '</solicitud>';
      $xml_viaje .= '<variables>';
      // NO TENEMOS NUMERO DEL VIAJE
      $xml_viaje .= '<CONSECUTIVOINFORMACIONVIAJE></CONSECUTIVOINFORMACIONVIAJE>';
      $xml_viaje .= '<CODIDCONDUCTOR></CODIDCONDUCTOR>';
      $xml_viaje .= '<NUMIDCONDUCTOR></NUMIDCONDUCTOR>';
      $xml_viaje .= '<NUMPLACA></NUMPLACA>';
      $xml_viaje .= '<NUMPLACAREMOLQUE></NUMPLACAREMOLQUE>';
      $xml_viaje .= '<CODMUNICIPIOORIGENINFOVIAJE></CODMUNICIPIOORIGENINFOVIAJE>';
      $xml_viaje .= '<CODMUNICIPIODESTINOINFOVIAJE></CODMUNICIPIODESTINOINFOVIAJE>';
      $xml_viaje .= '<VALORFLETEPACTADOVIAJE></VALORFLETEPACTADOVIAJE>';
      $xml_viaje .= '<OBSERVACIONES></OBSERVACIONES>';
      $xml_viaje .= "<PREREMESAS procesoid='44'>";
      $xml_viaje .= '<MANPREREMESA>
                      <CONSECUTIVOINFORMACIONCARGA></CONSECUTIVOINFORMACIONCARGA>
                    </MANPREREMESA>';
      $xml_viaje .= '</PREREMESAS>';
      $xml_viaje .= '</variables>';
      $xml_viaje .= '</root>';
    }
  }

  #TRANSMISION DE REMESAS
  public function Remesas()
  {
    $msg_error = '';
    $proceso = $_POST['proceso'];
    $dato = $_POST['dato'];
    $tipopro = $_POST['tipopro'];
    $filtro = $_POST['filtro'];
    $tiptercero = false;
    $tipdoc = false;
    $id = $_POST['id'];
    $op = 1;
    // consultar cantidad remesas del manifiesto NEXOS
    $remesas = $this->_modelo->Consulta_Remesas_Mnf($id);
    if ($remesas) {
      foreach ($remesas as $value) {
        //Consultar Dato de Cada Remesa NEXOS
        $rndc_remesa = $this->_modelo->Datos_Remesa($value['id_remesa']);
        if ($rndc_remesa) {
          $resulta_rndc = $this->Consulta_Documento_Carga($op, $id, $proceso, $tipopro);
          $convierte_xml = new SimpleXMLElement($resulta_rndc);
          if ($convierte_xml->ErrorMSG[0]) {
            if ($convierte_xml->ErrorMSG[0] == 'Error RNDC11: Documento no encontrado.') {
            } else {
              // Validar el tipo de operaciona realizar si es Nacional o Municipal
              if ($rndc_remesa[0]['origen_viaje'] == $rndc_remesa[0]['destino_viaje']) {
                // Remesa de Viaje Municipal
                foreach ($rndc_remesa as $valor_remesa) {
                  // homologar
                  $valor_remesa['id_manifiesto'];
                  $tipodoc = '';
                  $tipodocrem = '';
                  $tipocli = '';
                  $numdocume = '';
                  $pesocontainer = '';
                  if ($valor_remesa['tipo_documento'] == 'NIT') {
                    $tipodoc = 'N';
                    $docudesti = ($valor_remesa['documento'] . $valor_remesa['digito_verificacion']);
                  }
                  if ($valor_remesa['tipo_documento'] == 'Cedula de Ciudadania') {
                    $tipodoc = 'C';
                    $docudesti = ($valor_remesa['documento']);
                  }
                  if ($valor_remesa['tipo_documento'] == 'Cedula de Extranjeria') {
                    $tipodoc = 'E';
                    $docudesti = ($valor_remesa['documento']);
                  }
                  if ($valor_remesa['tipo_documento_remi'] == 'NIT') {
                    $tipodocrem = 'N';
                    $docuremi = ($valor_remesa['documento_remi'] . $valor_remesa['digito_remi']);
                  }
                  if ($valor_remesa['tipo_documento_remi'] == 'Cedula de Ciudadania') {
                    $tipodocrem = 'C';
                    $docuremi = ($valor_remesa['documento_remi']);
                  }
                  if ($valor_remesa['tipo_documento_remi'] == 'Cedula de Extranjeria') {
                    $tipodocrem = 'E';
                    $docuremi = ($valor_remesa['documento_remi']);
                  }
                  if ($valor_remesa['td_cliente'] == 'Juridico') {
                    $tipocli = 'N';
                    $numdocume = ($valor_remesa['documento_cliente'] . $valor_remesa['digito_cliente']);
                  }
                  if ($valor_remesa['td_cliente'] == 'Natural') {
                    $tipocli = 'C';
                    $numdocume = ($valor_remesa['documento_cliente']);
                  }
                  // fecha pactada cargue
                  $fecha_pt_cargue = date('d/m/Y', strtotime($valor_remesa['fecha_cargue']));
                  $fecha_pt_descargue = date('d/m/Y', strtotime($valor_remesa['fecha_descargue']));

                  // homologar tipo de operacion
                  if ($valor_remesa['tipo_carga'] == 'G') { // general
                    $descripcion = $valor_remesa['tipo_mercancia'];
                    $mercancia = $valor_remesa['codigo'];
                    $cantidad = $valor_remesa['cantidad_real_cargada'];
                    $unidad = 1;
                    $pesocontainer = '';
                  }
                  if ($valor_remesa['tipo_carga'] == 'P') { // paqueteo
                    $descripcion = '009880';
                    $mercancia = '009880';
                    $cantidad = $valor_remesa['cantidad_real_cargada'];
                    $unidad = 1;
                    $pesocontainer = '';
                  }
                  if ($valor_remesa['tipo_carga'] == 'V') { // contenedor vacio
                    $descripcion = '009990';
                    $mercancia = '009990';
                    $cantidad = 0;
                    $unidad = '';
                    if (
                      $valor_remesa['pesocontenedor1'] != 0 || $valor_remesa['pesocontenedor1'] != '' || $valor_remesa['pesocontenedor1']
                      !=
                      null
                    ) {
                      $pesocontainer = $valor_remesa['pesocontenedor1'];
                    } else if ($valor_remesa['pesocontenedor2'] != 0 || $valor_remesa['pesocontenedor2'] != '' || $valor_remesa['pesocontenedor2'] != 0) {
                      $pesocontainer = $valor_remesa['pesocontenedor2'];
                    } else {
                      $pesocontainer = 4100;
                    }
                    $pesocontainer = 4100;
                  }
                  if ($valor_remesa['tipo_carga'] == 'C') { // contenedor cargado
                    $descripcion = $valor_remesa['tipo_mercancia'];
                    $mercancia = $valor_remesa['codigo'];
                    $cantidad = $valor_remesa['cantidad_real_cargada'];
                    $pesocontainer = 4100;
                    $unidad = 1;
                  }

                  $xml_remesa_municipal = '';
                  $xml_remesa_municipal .= '<?xml version="1.0" encoding="ISO-8859-1" ?>';
                  $xml_remesa_municipal .= '<root>';
                  $xml_remesa_municipal .= '<acceso>
                                            <username>' . MINTRANS_USER . '</username>
                                            <password>' . MINTRANS_PASS . '</password>
                                          </acceso>';
                  $xml_remesa_municipal .= '<solicitud>
                                            <tipo>1</tipo>
                                            <procesoid>83</procesoid>
                                          </solicitud>';
                  $xml_remesa_municipal .= '
                                        <variables>
                                          <NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>
                                          <CONSECUTIVOREMESA>' . $valor_remesa['id'] . '</CONSECUTIVOREMESA>
                                          <CODOPERACIONTRANSPORTE>' . $valor_remesa['tipo_carga'] . '</CODOPERACIONTRANSPORTE>
                                          <CODNATURALEZACARGA>' . $valor_remesa['naturaleza'] . '</CODNATURALEZACARGA>
                                          <CANTIDADCARGADA>' . $cantidad . '</CANTIDADCARGADA>
                                          <UNIDADMEDIDACAPACIDAD>' . $unidad . '</UNIDADMEDIDACAPACIDAD>
                                          <CODTIPOEMPAQUE>' . $valor_remesa['tipo_empaque'] . '</CODTIPOEMPAQUE>
                                          <PESOCONTENEDORVACIO>' . $pesocontainer . '</PESOCONTENEDORVACIO>
                                          <MERCANCIAREMESA>' . $mercancia . '</MERCANCIAREMESA>
                                          <DESCRIPCIONCORTAPRODUCTO>' . $descripcion . '</DESCRIPCIONCORTAPRODUCTO>
                                          <CODTIPOIDREMITENTE>' . $tipodocrem . '</CODTIPOIDREMITENTE>
                                          <NUMIDREMITENTE>' . $docuremi . '</NUMIDREMITENTE>
                                          <CODSEDEREMITENTE>' . $valor_remesa['sede_remi'] . '</CODSEDEREMITENTE>
                                          <CODTIPOIDDESTINATARIO>' . $tipodoc . '</CODTIPOIDDESTINATARIO>
                                          <NUMIDDESTINATARIO>' . $docudesti . '</NUMIDDESTINATARIO>
                                          <CODSEDEDESTINATARIO>' . $valor_remesa['sede_desti'] . '</CODSEDEDESTINATARIO>
                                          <CODTIPOIDPROPIETARIO>' . $tipocli . '</CODTIPOIDPROPIETARIO>
                                          <NUMIDPROPIETARIO>' . $numdocume . '</NUMIDPROPIETARIO>
                                          <CODSEDEPROPIETARIO>' . $valor_remesa['idcliente'] . '</CODSEDEPROPIETARIO>
                                        </variables>';
                  $xml_remesa_municipal .= '</root>';

                  $result_remesa_municipal = $this->rndc_conexion($xml_remesa_municipal);
                  $xml_municipal = simplexml_load_string(mb_convert_encoding($result_remesa_municipal, 'UTF-8', 'ISO-8859-1'));
                  $json_municipal = json_encode($xml_municipal);
                  $result_municipal = json_decode($json_municipal, true);
                  // LOG remesa y manifiesto
                  if (isset($result_municipal['ErrorMSG'])) {
                    $estado_rem = 0;
                  } else {
                    $estado_rem = 1;
                  }
                  $this->_modelo->Remesa_Transmite($valor_remesa['id'], $result_remesa_municipal, $estado_rem, $xml_remesa_municipal);
                  if (isset($result_municipal['ErrorMSG'])) {
                    $msg_error .= $result_municipal['ErrorMSG'];
                    $data['status'] = 'false';
                    $data['resultado'] = $msg_error;
                    $estado_rem = 0;
                    $this->_modelo->Remesa_Rndc($valor_remesa['id'], $estado_rem);
                    echo json_encode($data);
                  } else {
                    $rndc_ingresoid = $result_municipal['ingresoid'];
                    $data['status'] = 'true';
                    $data['resultado'] = $rndc_ingresoid;
                    $estado_rem = 1;
                    $this->_modelo->Remesa_Rndc($valor_remesa['id'], $estado_rem); // estado remesa
                    echo json_encode($data);
                  }
                }
              } else {
                // Remesa de Viaje Nacional
                foreach ($rndc_remesa as $valor_remesa) {
                  // homologar
                  $valor_remesa['id_manifiesto'];
                  $tipodoc = '';
                  $tipodocrem = '';
                  $tipocli = '';
                  $numdocume = '';
                  $pesocontainer = '';
                  if ($valor_remesa['tipo_documento'] == 'NIT') {
                    $tipodoc = 'N';
                    $docudesti = ($valor_remesa['documento'] . $valor_remesa['digito_verificacion']);
                  }
                  if ($valor_remesa['tipo_documento'] == 'Cedula de Ciudadania') {
                    $tipodoc = 'C';
                    $docudesti = ($valor_remesa['documento']);
                  }
                  if ($valor_remesa['tipo_documento'] == 'Cedula de Extranjeria') {
                    $tipodoc = 'E';
                    $docudesti = ($valor_remesa['documento']);
                  }
                  if ($valor_remesa['tipo_documento_remi'] == 'NIT') {
                    $tipodocrem = 'N';
                    $docuremi = ($valor_remesa['documento_remi'] . $valor_remesa['digito_remi']);
                  }
                  if ($valor_remesa['tipo_documento_remi'] == 'Cedula de Ciudadania') {
                    $tipodocrem = 'C';
                    $docuremi = ($valor_remesa['documento_remi']);
                  }
                  if ($valor_remesa['tipo_documento_remi'] == 'Cedula de Extranjeria') {
                    $tipodocrem = 'E';
                    $docuremi = ($valor_remesa['documento_remi']);
                  }
                  if ($valor_remesa['td_cliente'] == 'Juridico') {
                    $tipocli = 'N';
                    $numdocume = ($valor_remesa['documento_cliente'] . $valor_remesa['digito_cliente']);
                  }
                  if ($valor_remesa['td_cliente'] == 'Natural') {
                    $tipocli = 'C';
                    $numdocume = ($valor_remesa['documento_cliente']);
                  }
                  // fecha pactada cargue
                  $fecha_pt_cargue = date('d/m/Y', strtotime($valor_remesa['fecha_cargue']));
                  $fecha_pt_descargue = date('d/m/Y', strtotime($valor_remesa['fecha_descargue']));

                  // homologar tipo de operacion
                  if ($valor_remesa['tipo_carga'] == 'G') { // general
                    $descripcion = $valor_remesa['tipo_mercancia'];
                    $mercancia = $valor_remesa['codigo'];
                    $cantidad = $valor_remesa['cantidad_real_cargada'];
                    $unidad = 1;
                    $pesocontainer = '';
                  }
                  if ($valor_remesa['tipo_carga'] == 'P') { // paqueteo
                    $descripcion = '009880';
                    $mercancia = '009880';
                    $cantidad = $valor_remesa['cantidad_real_cargada'];
                    $unidad = 1;
                    $pesocontainer = '';
                  }
                  if ($valor_remesa['tipo_carga'] == 'V') { // contenedor vacio
                    $descripcion = '009990';
                    $mercancia = '009990';
                    $cantidad = 0;
                    $unidad = '';
                    if (
                      $valor_remesa['pesocontenedor1'] != 0 || $valor_remesa['pesocontenedor1'] != '' || $valor_remesa['pesocontenedor1']
                      !=
                      null
                    ) {
                      $pesocontainer = $valor_remesa['pesocontenedor1'];
                    } else if (
                      $valor_remesa['pesocontenedor2'] != 0 ||
                      $valor_remesa['pesocontenedor2'] != '' ||
                      $valor_remesa['pesocontenedor2'] != 0
                    ) {
                      $pesocontainer = $valor_remesa['pesocontenedor2'];
                    } else {
                      $pesocontainer = 4100;
                    }
                    $pesocontainer = 4100;
                  }
                  if ($valor_remesa['tipo_carga'] == 'C') { // contenedor cargado
                    $descripcion = $valor_remesa['tipo_mercancia'];
                    $mercancia = $valor_remesa['codigo'];
                    $cantidad = $valor_remesa['cantidad_real_cargada'];
                    $pesocontainer = 4100;
                    $unidad = 1;
                  }

                  $xml_remesa = '';
                  $xml_remesa .= "<?xml version='1.0' encoding='ISO-8859-1'?>";
                  $xml_remesa .= '<root>';
                  $xml_remesa .= '<acceso>';
                  $xml_remesa .= '<username>' . MINTRANS_USER . '</username>
                                <password>' . MINTRANS_PASS . '</password>';
                  $xml_remesa .= '</acceso>';
                  $xml_remesa .= '<solicitud>';
                  $xml_remesa .= '<tipo>1</tipo>';
                  $xml_remesa .= '<procesoid>3</procesoid>';
                  $xml_remesa .= '</solicitud>';
                  $xml_remesa .= '<variables>';
                  $xml_remesa .= '<NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>';
                  $xml_remesa .= '<CONSECUTIVOREMESA>' . $valor_remesa['id'] . '</CONSECUTIVOREMESA>';
                  $xml_remesa .= '<CODOPERACIONTRANSPORTE>' . $valor_remesa['tipo_carga'] . '</CODOPERACIONTRANSPORTE>';
                  $xml_remesa .= '<CODNATURALEZACARGA>' . $valor_remesa['naturaleza'] . '</CODNATURALEZACARGA>';
                  $xml_remesa .= '<CANTIDADCARGADA>' . $cantidad . '</CANTIDADCARGADA>';
                  $xml_remesa .= '<UNIDADMEDIDACAPACIDAD>' . $unidad . '</UNIDADMEDIDACAPACIDAD>';
                  $xml_remesa .= '<CODTIPOEMPAQUE>' . $valor_remesa['tipo_empaque'] . '</CODTIPOEMPAQUE>';
                  $xml_remesa .= '<PESOCONTENEDORVACIO>' . $pesocontainer . '</PESOCONTENEDORVACIO>';
                  $xml_remesa .= '<MERCANCIAREMESA>' . $mercancia . '</MERCANCIAREMESA>';
                  $xml_remesa .= '<DESCRIPCIONCORTAPRODUCTO>' . $descripcion . '</DESCRIPCIONCORTAPRODUCTO>';
                  $xml_remesa .= '<CODTIPOIDREMITENTE>' . $tipodocrem . '</CODTIPOIDREMITENTE>';
                  $xml_remesa .= '<NUMIDREMITENTE>' . $docuremi . '</NUMIDREMITENTE>';
                  $xml_remesa .= '<CODSEDEREMITENTE>' . $valor_remesa['sede_remi'] . '</CODSEDEREMITENTE>';
                  $xml_remesa .= '<CODTIPOIDDESTINATARIO>' . $tipodoc . '</CODTIPOIDDESTINATARIO>';
                  $xml_remesa .= '<NUMIDDESTINATARIO>' . $docudesti . '</NUMIDDESTINATARIO>';
                  $xml_remesa .= '<CODSEDEDESTINATARIO>' . $valor_remesa['sede_desti'] . '</CODSEDEDESTINATARIO>';
                  $xml_remesa .= '<DUENOPOLIZA>E</DUENOPOLIZA>';
                  $xml_remesa .= '<NUMPOLIZATRANSPORTE>3002055</NUMPOLIZATRANSPORTE>';
                  $xml_remesa .= '<COMPANIASEGURO>8600024002</COMPANIASEGURO>';
                  $xml_remesa .= '<FECHAVENCIMIENTOPOLIZACARGA>01/12/2022</FECHAVENCIMIENTOPOLIZACARGA>';
                  $xml_remesa .= '<HORASPACTOCARGA>' . $valor_remesa['horaspactocarga'] . '</HORASPACTOCARGA>';
                  $xml_remesa .= '<MINUTOSPACTOCARGA>' . $valor_remesa['minutospactocarga'] . '</MINUTOSPACTOCARGA>';
                  $xml_remesa .= '<HORASPACTODESCARGUE>' . $valor_remesa['horaspactodescargue'] . '</HORASPACTODESCARGUE>';
                  $xml_remesa .= '<MINUTOSPACTODESCARGUE>' . $valor_remesa['minutospactodescargue'] . '</MINUTOSPACTODESCARGUE>';
                  $xml_remesa .= '<CODTIPOIDPROPIETARIO>' . $tipocli . '</CODTIPOIDPROPIETARIO>';
                  $xml_remesa .= '<NUMIDPROPIETARIO>' . $numdocume . '</NUMIDPROPIETARIO>';
                  $xml_remesa .= '<CODSEDEPROPIETARIO>' . $valor_remesa['idcliente'] . '</CODSEDEPROPIETARIO>';
                  $xml_remesa .= '<FECHACITAPACTADACARGUE>' . $fecha_pt_cargue . '</FECHACITAPACTADACARGUE>';
                  $xml_remesa .= '<HORACITAPACTADACARGUE>' . $valor_remesa['hora_cargue'] . '</HORACITAPACTADACARGUE>';
                  $xml_remesa .= '<FECHACITAPACTADADESCARGUE>' . $fecha_pt_descargue . '</FECHACITAPACTADADESCARGUE>';
                  $xml_remesa .= '<HORACITAPACTADADESCARGUEREMESA>' . $valor_remesa['hora_descarga'] . '</HORACITAPACTADADESCARGUEREMESA>';
                  $xml_remesa .= '<PERMISOCARGAEXTRA></PERMISOCARGAEXTRA>';
                  $xml_remesa .= '<NUMIDGPS></NUMIDGPS>';
                  $xml_remesa .= '</variables>';
                  $xml_remesa .= '</root>';

                  $result_remesa = $this->rndc_conexion($xml_remesa);
                  // $xml = simplexml_load_string(utf8_decode($result_remesa));
                  $xml = simplexml_load_string(mb_convert_encoding($result_remesa, 'UTF-8', 'ISO-8859-1'));
                  $json = json_encode($xml);
                  $resultm = json_decode($json, true);
                  // LOG remesa y manifiesto
                  if (isset($resultm['ErrorMSG'])) {
                    $estado_rem = 0;
                  } else {
                    $estado_rem = 1;
                  }
                  $respuesta_transaccion = $this->_modelo->Remesa_Transmite(
                    $valor_remesa['id'],
                    $result_remesa,
                    $estado_rem,
                    $xml_remesa
                  );
                  if (isset($resultm['ErrorMSG'])) {
                    $msg_error .= $resultm['ErrorMSG'];
                    $data['status'] = 'false';
                    $data['resultado'] = $msg_error;
                    $estado_rem = 0;
                    $remesa_rndc = $this->_modelo->Remesa_Rndc($valor_remesa['id'], $estado_rem);
                    echo json_encode($data);
                  } else {
                    $rndc_ingresoid = $resultm['ingresoid'];
                    $data['status'] = 'true';
                    $data['resultado'] = $rndc_ingresoid;
                    $estado_rem = 1;
                    $remesa_rndc = $this->_modelo->Remesa_Rndc($valor_remesa['id'], $estado_rem); // estado remesa
                    echo json_encode($data);
                  }
                }
              }
            }
          } else {
            // Validar el tipo de operaciona realizar si es Nacional o Municipal
            if ($rndc_remesa[0]['origen_viaje'] == $rndc_remesa[0]['destino_viaje']) {
              // Remesa de Viaje Municipal
              foreach ($rndc_remesa as $valor_remesa) {
                // homologar
                $valor_remesa['id_manifiesto'];
                $tipodoc = '';
                $tipodocrem = '';
                $tipocli = '';
                $numdocume = '';
                $pesocontainer = '';
                if ($valor_remesa['tipo_documento'] == 'NIT') {
                  $tipodoc = 'N';
                  $docudesti = ($valor_remesa['documento'] . $valor_remesa['digito_verificacion']);
                }
                if ($valor_remesa['tipo_documento'] == 'Cedula de Ciudadania') {
                  $tipodoc = 'C';
                  $docudesti = ($valor_remesa['documento']);
                }
                if ($valor_remesa['tipo_documento'] == 'Cedula de Extranjeria') {
                  $tipodoc = 'E';
                  $docudesti = ($valor_remesa['documento']);
                }
                if ($valor_remesa['tipo_documento_remi'] == 'NIT') {
                  $tipodocrem = 'N';
                  $docuremi = ($valor_remesa['documento_remi'] . $valor_remesa['digito_remi']);
                }
                if ($valor_remesa['tipo_documento_remi'] == 'Cedula de Ciudadania') {
                  $tipodocrem = 'C';
                  $docuremi = ($valor_remesa['documento_remi']);
                }
                if ($valor_remesa['tipo_documento_remi'] == 'Cedula de Extranjeria') {
                  $tipodocrem = 'E';
                  $docuremi = ($valor_remesa['documento_remi']);
                }
                if ($valor_remesa['td_cliente'] == 'Juridico') {
                  $tipocli = 'N';
                  $numdocume = ($valor_remesa['documento_cliente'] . $valor_remesa['digito_cliente']);
                }
                if ($valor_remesa['td_cliente'] == 'Natural') {
                  $tipocli = 'C';
                  $numdocume = ($valor_remesa['documento_cliente']);
                }
                // fecha pactada cargue
                $fecha_pt_cargue = date('d/m/Y', strtotime($valor_remesa['fecha_cargue']));
                $fecha_pt_descargue = date('d/m/Y', strtotime($valor_remesa['fecha_descargue']));

                // homologar tipo de operacion
                if ($valor_remesa['tipo_carga'] == 'G') { // general
                  $descripcion = $valor_remesa['tipo_mercancia'];
                  $mercancia = $valor_remesa['codigo'];
                  $cantidad = $valor_remesa['cantidad_real_cargada'];
                  $unidad = 1;
                  $pesocontainer = '';
                }
                if ($valor_remesa['tipo_carga'] == 'P') { // paqueteo
                  $descripcion = '009880';
                  $mercancia = '009880';
                  $cantidad = $valor_remesa['cantidad_real_cargada'];
                  $unidad = 1;
                  $pesocontainer = '';
                }
                if ($valor_remesa['tipo_carga'] == 'V') { // contenedor vacio
                  $descripcion = '009990';
                  $mercancia = '009990';
                  $cantidad = 0;
                  $unidad = '';
                  if (
                    $valor_remesa['pesocontenedor1'] != 0 || $valor_remesa['pesocontenedor1'] != '' || $valor_remesa['pesocontenedor1']
                    !=
                    null
                  ) {
                    $pesocontainer = $valor_remesa['pesocontenedor1'];
                  } else if (
                    $valor_remesa['pesocontenedor2'] != 0 ||
                    $valor_remesa['pesocontenedor2'] != '' ||
                    $valor_remesa['pesocontenedor2'] != 0
                  ) {
                    $pesocontainer = $valor_remesa['pesocontenedor2'];
                  } else {
                    $pesocontainer = 4100;
                  }
                  $pesocontainer = 4100;
                }
                if ($valor_remesa['tipo_carga'] == 'C') { // contenedor cargado
                  $descripcion = $valor_remesa['tipo_mercancia'];
                  $mercancia = $valor_remesa['codigo'];
                  $cantidad = $valor_remesa['cantidad_real_cargada'];
                  $pesocontainer = 4100;
                  $unidad = 1;
                }

                $xml_remesa_municipal = '';
                $xml_remesa_municipal .= '<?xml version="1.0" encoding="ISO-8859-1" ?>';
                $xml_remesa_municipal .= '<root>';
                $xml_remesa_municipal .= '<acceso>
                                          <username>' . MINTRANS_USER . '</username>
                                          <password>' . MINTRANS_PASS . '</password>
                                        </acceso>';
                $xml_remesa_municipal .= '<solicitud>
                                          <tipo>1</tipo>
                                          <procesoid>83</procesoid>
                                        </solicitud>';
                $xml_remesa_municipal .= '
                                        <variables>
                                          <NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>
                                          <CONSECUTIVOREMESA>' . $valor_remesa['id'] . '</CONSECUTIVOREMESA>
                                          <CODOPERACIONTRANSPORTE>' . $valor_remesa['tipo_carga'] . '</CODOPERACIONTRANSPORTE>
                                          <CODNATURALEZACARGA>' . $valor_remesa['naturaleza'] . '</CODNATURALEZACARGA>
                                          <CANTIDADCARGADA>' . $cantidad . '</CANTIDADCARGADA>
                                          <UNIDADMEDIDACAPACIDAD>' . $unidad . '</UNIDADMEDIDACAPACIDAD>
                                          <CODTIPOEMPAQUE>' . $valor_remesa['tipo_empaque'] . '</CODTIPOEMPAQUE>
                                          <PESOCONTENEDORVACIO>' . $pesocontainer . '</PESOCONTENEDORVACIO>
                                          <MERCANCIAREMESA>' . $mercancia . '</MERCANCIAREMESA>
                                          <DESCRIPCIONCORTAPRODUCTO>' . $descripcion . '</DESCRIPCIONCORTAPRODUCTO>
                                          <CODTIPOIDREMITENTE>' . $tipodocrem . '</CODTIPOIDREMITENTE>
                                          <NUMIDREMITENTE>' . $docuremi . '</NUMIDREMITENTE>
                                          <CODSEDEREMITENTE>' . $valor_remesa['sede_remi'] . '</CODSEDEREMITENTE>
                                          <CODTIPOIDDESTINATARIO>' . $tipodoc . '</CODTIPOIDDESTINATARIO>
                                          <NUMIDDESTINATARIO>' . $docudesti . '</NUMIDDESTINATARIO>
                                          <CODSEDEDESTINATARIO>' . $valor_remesa['sede_desti'] . '</CODSEDEDESTINATARIO>
                                          <CODTIPOIDPROPIETARIO>' . $tipocli . '</CODTIPOIDPROPIETARIO>
                                          <NUMIDPROPIETARIO>' . $numdocume . '</NUMIDPROPIETARIO>
                                          <CODSEDEPROPIETARIO>' . $valor_remesa['idcliente'] . '</CODSEDEPROPIETARIO>
                                        </variables>';
                $xml_remesa_municipal .= '</root>';

                $result_remesa_municipal = $this->rndc_conexion($xml_remesa_municipal);
                // $xml = simplexml_load_string(utf8_decode($result_remesa_municipal));
                $xml_municipal = simplexml_load_string(mb_convert_encoding($result_remesa_municipal, 'UTF-8', 'ISO-8859-1'));
                $json_municipal = json_encode($xml_municipal);
                $result_municipal = json_decode($json_municipal, true);
                // LOG remesa y manifiesto
                if (isset($result_municipal['ErrorMSG'])) {
                  $estado_rem = 0;
                } else {
                  $estado_rem = 1;
                }
                $respuesta_transaccion = $this->_modelo->Remesa_Transmite(
                  $valor_remesa['id'],
                  $result_remesa_municipal,
                  $estado_rem,
                  $xml_remesa_municipal
                );
                if (isset($result_municipal['ErrorMSG'])) {
                  $msg_error .= $result_municipal['ErrorMSG'];
                  $data['status'] = 'false';
                  $data['resultado'] = $msg_error;
                  $estado_rem = 0;
                  $remesa_rndc = $this->_modelo->Remesa_Rndc($valor_remesa['id'], $estado_rem);
                  echo json_encode($data);
                } else {
                  $rndc_ingresoid = $result_municipal['ingresoid'];
                  $data['status'] = 'true';
                  $data['resultado'] = $rndc_ingresoid;
                  $estado_rem = 1;
                  $remesa_rndc = $this->_modelo->Remesa_Rndc($valor_remesa['id'], $estado_rem); // estado remesa
                  echo json_encode($data);
                }
              }
            } else {
              // Remesa de Viaje Nacional
              foreach ($rndc_remesa as $valor_remesa) {
                // homologar
                $valor_remesa['id_manifiesto'];
                $tipodoc = '';
                $tipodocrem = '';
                $tipocli = '';
                $numdocume = '';
                $pesocontainer = '';
                if ($valor_remesa['tipo_documento'] == 'NIT') {
                  $tipodoc = 'N';
                  $docudesti = ($valor_remesa['documento'] . $valor_remesa['digito_verificacion']);
                }
                if ($valor_remesa['tipo_documento'] == 'Cedula de Ciudadania') {
                  $tipodoc = 'C';
                  $docudesti = ($valor_remesa['documento']);
                }
                if ($valor_remesa['tipo_documento'] == 'Cedula de Extranjeria') {
                  $tipodoc = 'E';
                  $docudesti = ($valor_remesa['documento']);
                }
                if ($valor_remesa['tipo_documento_remi'] == 'NIT') {
                  $tipodocrem = 'N';
                  $docuremi = ($valor_remesa['documento_remi'] . $valor_remesa['digito_remi']);
                }
                if ($valor_remesa['tipo_documento_remi'] == 'Cedula de Ciudadania') {
                  $tipodocrem = 'C';
                  $docuremi = ($valor_remesa['documento_remi']);
                }
                if ($valor_remesa['tipo_documento_remi'] == 'Cedula de Extranjeria') {
                  $tipodocrem = 'E';
                  $docuremi = ($valor_remesa['documento_remi']);
                }
                if ($valor_remesa['td_cliente'] == 'Juridico') {
                  $tipocli = 'N';
                  $numdocume = ($valor_remesa['documento_cliente'] . $valor_remesa['digito_cliente']);
                }
                if ($valor_remesa['td_cliente'] == 'Natural') {
                  $tipocli = 'C';
                  $numdocume = ($valor_remesa['documento_cliente']);
                }
                // fecha pactada cargue
                $fecha_pt_cargue = date('d/m/Y', strtotime($valor_remesa['fecha_cargue']));
                $fecha_pt_descargue = date('d/m/Y', strtotime($valor_remesa['fecha_descargue']));

                // homologar tipo de operacion
                if ($valor_remesa['tipo_carga'] == 'G') { // general
                  $descripcion = $valor_remesa['tipo_mercancia'];
                  $mercancia = $valor_remesa['codigo'];
                  $cantidad = $valor_remesa['cantidad_real_cargada'];
                  $unidad = 1;
                  $pesocontainer = '';
                }
                if ($valor_remesa['tipo_carga'] == 'P') { // paqueteo
                  $descripcion = '009880';
                  $mercancia = '009880';
                  $cantidad = $valor_remesa['cantidad_real_cargada'];
                  $unidad = 1;
                  $pesocontainer = '';
                }
                if ($valor_remesa['tipo_carga'] == 'V') { // contenedor vacio
                  $descripcion = '009990';
                  $mercancia = '009990';
                  $cantidad = 0;
                  $unidad = '';
                  if (
                    $valor_remesa['pesocontenedor1'] != 0 || $valor_remesa['pesocontenedor1'] != '' || $valor_remesa['pesocontenedor1']
                    !=
                    null
                  ) {
                    $pesocontainer = $valor_remesa['pesocontenedor1'];
                  } else if (
                    $valor_remesa['pesocontenedor2'] != 0 ||
                    $valor_remesa['pesocontenedor2'] != '' ||
                    $valor_remesa['pesocontenedor2'] != 0
                  ) {
                    $pesocontainer = $valor_remesa['pesocontenedor2'];
                  } else {
                    $pesocontainer = 4100;
                  }
                  $pesocontainer = 4100;
                }
                if ($valor_remesa['tipo_carga'] == 'C') { // contenedor cargado
                  $descripcion = $valor_remesa['tipo_mercancia'];
                  $mercancia = $valor_remesa['codigo'];
                  $cantidad = $valor_remesa['cantidad_real_cargada'];
                  $pesocontainer = 4100;
                  $unidad = 1;
                }

                $xml_remesa = '';
                $xml_remesa .= "<?xml version='1.0' encoding='ISO-8859-1'?>";
                $xml_remesa .= '<root>';
                $xml_remesa .= '<acceso>';
                $xml_remesa .= '<username>' . MINTRANS_USER . '</username>
                              <password>' . MINTRANS_PASS . '</password>';
                $xml_remesa .= '</acceso>';
                $xml_remesa .= '<solicitud>';
                $xml_remesa .= '<tipo>1</tipo>';
                $xml_remesa .= '<procesoid>3</procesoid>';
                $xml_remesa .= '</solicitud>';
                $xml_remesa .= '<variables>';
                $xml_remesa .= '<NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>';
                $xml_remesa .= '<CONSECUTIVOREMESA>' . $valor_remesa['id'] . '</CONSECUTIVOREMESA>';
                $xml_remesa .= '<CODOPERACIONTRANSPORTE>' . $valor_remesa['tipo_carga'] . '</CODOPERACIONTRANSPORTE>';
                $xml_remesa .= '<CODNATURALEZACARGA>' . $valor_remesa['naturaleza'] . '</CODNATURALEZACARGA>';
                $xml_remesa .= '<CANTIDADCARGADA>' . $cantidad . '</CANTIDADCARGADA>';
                $xml_remesa .= '<UNIDADMEDIDACAPACIDAD>' . $unidad . '</UNIDADMEDIDACAPACIDAD>';
                $xml_remesa .= '<CODTIPOEMPAQUE>' . $valor_remesa['tipo_empaque'] . '</CODTIPOEMPAQUE>';
                $xml_remesa .= '<PESOCONTENEDORVACIO>' . $pesocontainer . '</PESOCONTENEDORVACIO>';
                $xml_remesa .= '<MERCANCIAREMESA>' . $mercancia . '</MERCANCIAREMESA>';
                $xml_remesa .= '<DESCRIPCIONCORTAPRODUCTO>' . $descripcion . '</DESCRIPCIONCORTAPRODUCTO>';
                $xml_remesa .= '<CODTIPOIDREMITENTE>' . $tipodocrem . '</CODTIPOIDREMITENTE>';
                $xml_remesa .= '<NUMIDREMITENTE>' . $docuremi . '</NUMIDREMITENTE>';
                $xml_remesa .= '<CODSEDEREMITENTE>' . $valor_remesa['sede_remi'] . '</CODSEDEREMITENTE>';
                $xml_remesa .= '<CODTIPOIDDESTINATARIO>' . $tipodoc . '</CODTIPOIDDESTINATARIO>';
                $xml_remesa .= '<NUMIDDESTINATARIO>' . $docudesti . '</NUMIDDESTINATARIO>';
                $xml_remesa .= '<CODSEDEDESTINATARIO>' . $valor_remesa['sede_desti'] . '</CODSEDEDESTINATARIO>';
                $xml_remesa .= '<DUENOPOLIZA>E</DUENOPOLIZA>';
                $xml_remesa .= '<NUMPOLIZATRANSPORTE>3002055</NUMPOLIZATRANSPORTE>';
                $xml_remesa .= '<COMPANIASEGURO>8600024002</COMPANIASEGURO>';
                $xml_remesa .= '<FECHAVENCIMIENTOPOLIZACARGA>01/12/2022</FECHAVENCIMIENTOPOLIZACARGA>';
                $xml_remesa .= '<HORASPACTOCARGA>' . $valor_remesa['horaspactocarga'] . '</HORASPACTOCARGA>';
                $xml_remesa .= '<MINUTOSPACTOCARGA>' . $valor_remesa['minutospactocarga'] . '</MINUTOSPACTOCARGA>';
                $xml_remesa .= '<HORASPACTODESCARGUE>' . $valor_remesa['horaspactodescargue'] . '</HORASPACTODESCARGUE>';
                $xml_remesa .= '<MINUTOSPACTODESCARGUE>' . $valor_remesa['minutospactodescargue'] . '</MINUTOSPACTODESCARGUE>';
                $xml_remesa .= '<CODTIPOIDPROPIETARIO>' . $tipocli . '</CODTIPOIDPROPIETARIO>';
                $xml_remesa .= '<NUMIDPROPIETARIO>' . $numdocume . '</NUMIDPROPIETARIO>';
                $xml_remesa .= '<CODSEDEPROPIETARIO>' . $valor_remesa['idcliente'] . '</CODSEDEPROPIETARIO>';
                $xml_remesa .= '<FECHACITAPACTADACARGUE>' . $fecha_pt_cargue . '</FECHACITAPACTADACARGUE>';
                $xml_remesa .= '<HORACITAPACTADACARGUE>' . $valor_remesa['hora_cargue'] . '</HORACITAPACTADACARGUE>';
                $xml_remesa .= '<FECHACITAPACTADADESCARGUE>' . $fecha_pt_descargue . '</FECHACITAPACTADADESCARGUE>';
                $xml_remesa .= '<HORACITAPACTADADESCARGUEREMESA>' . $valor_remesa['hora_descarga'] . '</HORACITAPACTADADESCARGUEREMESA>';
                $xml_remesa .= '<PERMISOCARGAEXTRA></PERMISOCARGAEXTRA>';
                $xml_remesa .= '<NUMIDGPS></NUMIDGPS>';
                $xml_remesa .= '</variables>';
                $xml_remesa .= '</root>';

                $result_remesa = $this->rndc_conexion($xml_remesa);
                // $xml = simplexml_load_string(utf8_decode($result_remesa));
                $xml = simplexml_load_string(mb_convert_encoding($result_remesa, 'UTF-8', 'ISO-8859-1'));
                $json = json_encode($xml);
                $resultm = json_decode($json, true);
                // LOG remesa y manifiesto
                if (isset($resultm['ErrorMSG'])) {
                  $estado_rem = 0;
                } else {
                  $estado_rem = 1;
                }
                $respuesta_transaccion = $this->_modelo->Remesa_Transmite(
                  $valor_remesa['id'],
                  $result_remesa,
                  $estado_rem,
                  $xml_remesa
                );
                if (isset($resultm['ErrorMSG'])) {
                  $msg_error .= $resultm['ErrorMSG'];
                  $data['status'] = 'false';
                  $data['resultado'] = $msg_error;
                  $estado_rem = 0;
                  $remesa_rndc = $this->_modelo->Remesa_Rndc($valor_remesa['id'], $estado_rem);
                  echo json_encode($data);
                } else {
                  $rndc_ingresoid = $resultm['ingresoid'];
                  $data['status'] = 'true';
                  $data['resultado'] = $rndc_ingresoid;
                  $estado_rem = 1;
                  $remesa_rndc = $this->_modelo->Remesa_Rndc($valor_remesa['id'], $estado_rem); // estado remesa
                  echo json_encode($data);
                }
              }
            }
          }
        } else {
          # code...
        }
      }
    }
    // cierre comprobacion cantidad de remesa
    // echo json_encode($xml);
  }
  // cierre public function remesa

  //Validar Costos del sicetas para la creacion de los manifestos
  public function Validar_Sicetac()
  {
    // $msg_error = '';
    $configuracion_vehiculo = $_POST['configuracion_vehiculo'];
    $codigo_origen_manifesto = $_POST['codigo_origen_manifesto'];
    $codigo_destino_manifesto = $_POST['codigo_destino_manifesto'];
    $vehiculo_id = $_POST['vehiculo_id'];
    // $vehiculo_id = 9688;
    //Consulta para valdiar los datos para la consulta del valor del sicetac
    $unidad_transporte = '';
    $tipo_carga = '';
    $datos = $this->_modelo->Consultar_detalle_servicios($vehiculo_id);

    foreach ($datos as $key => $value) {
      // var_dump( $value['empaque']);
      if ($value['empaque'] == "Varios" || $value['empaque'] == "Bulto" || $value['empaque'] == "Paquetes") {
        $unidad_transporte = "ESTACAS";
      } /* else if ($value['empaque'] == "Carga Estibada") {
        $unidad_transporte = "ESTIBAS";
      } else if ($value['empaque'] == "1 C 40 Pies (Contenedor)" || $value['empaque'] == "2 C 20 Pies (Contenedor)" || $value['empaque'] == "1 C 20 Pies (Contenedor)") {
        $unidad_transporte = "ESTIBA";
      } */

      if ($value['tipo_carga_descripcion'] == "GENERAL") {
        $tipo_carga = "General";
      } else if ($value['tipo_carga_descripcion'] == "CONTENEDOR VACÍO" || $value['tipo_carga_descripcion'] == "CONTENEDOR CARGADO") {
        $tipo_carga = "Contenedor";
      }
    }

    $xml_sicetac = '';
    $xml_sicetac .= "<?xml version='1.0' encoding='ISO-8859-1'?>";
    $xml_sicetac .= '<root>';
    $xml_sicetac .= '<acceso>';
    $xml_sicetac .= '<username>' . MINTRANS_USER . '</username>';
    $xml_sicetac .= '<password>' . MINTRANS_PASS . '</password>';
    $xml_sicetac .= '</acceso>';
    $xml_sicetac .= '<solicitud>';
    $xml_sicetac .= '<tipo>2</tipo>';
    $xml_sicetac .= '<procesoid>26</procesoid>';
    $xml_sicetac .= '</solicitud>';
    $xml_sicetac .= '<variables>';
    // $xml_sicetac .= 'NOMBREUNIDADTRANSPORTE, NOMBRETIPOCARGA, NOMBRERUTA, VALOR, VALORTONELADA, VALORHORA, DISTANCIA';
    $xml_sicetac .= 'VALOR';
    $xml_sicetac .= '</variables>';
    $xml_sicetac .= '<documento>';
    $xml_sicetac .= '<PERIODO>202412</PERIODO>';
    $xml_sicetac .= '<CONFIGURACION>"' . $configuracion_vehiculo . '"</CONFIGURACION>';
    $xml_sicetac .= '<ORIGEN>"' . $codigo_origen_manifesto . '"</ORIGEN>';
    $xml_sicetac .= '<DESTINO>"' . $codigo_destino_manifesto . '"</DESTINO>';
    $xml_sicetac .= '<NOMBREUNIDADTRANSPORTE>"' . $unidad_transporte . '"</NOMBREUNIDADTRANSPORTE>';
    $xml_sicetac .= '<NOMBRETIPOCARGA>"' . $tipo_carga . '"</NOMBRETIPOCARGA>';
    $xml_sicetac .= '</documento>';
    $xml_sicetac .= '</root>';
    $result_sicetac = $this->rndc_conexion($xml_sicetac);
    // Si no hay respuesta o el XML es inválido
    if (!$result_sicetac || !simplexml_load_string($result_sicetac)) {
      $data['status'] = 'false';
      $data['resultado'] = 'Error en la conexión o respuesta no válida.';
      echo json_encode($data);
      return;
    }

    // Cargar la respuesta como XML
    $xml = simplexml_load_string(mb_convert_encoding($result_sicetac, 'UTF-8', from_encoding: 'ISO-8859-1'));

    // Verificar si hay un error específico en la respuesta
    if (isset($xml->ErrorMSG)) {
      $data['status'] = 'false';
      $data['codigo'] = (string)$xml->ErrorMSG['codigo'] ?? 'Desconocido';
      $data['mensaje'] = (string)$xml->ErrorMSG;
      echo json_encode($data);
      return;
    }

    // Procesar la respuesta exitosa
    $json = json_encode($xml);
    $resultm = json_decode($json, associative: true);

    $data['status'] = 'true';
    $data['resultado'] = $resultm;
    echo json_encode($data);
  }

  public function Validar_Sicetac_Prueba()
  {
    // $msg_error = '';
    $configuracion_vehiculo = $_POST['configuracion_vehiculo'];
    $codigo_origen_manifesto = $_POST['codigo_origen_manifesto'];
    $codigo_destino_manifesto = $_POST['codigo_destino_manifesto'];
    // $vehiculo_id = $_POST['vehiculo_id'];
    // // $vehiculo_id = 9688;
    // //Consulta para valdiar los datos para la consulta del valor del sicetac
    // $unidad_transporte = '';
    // $tipo_carga = '';
    // $datos = $this->_modelo->Consultar_detalle_servicios($vehiculo_id);

    // foreach ($datos as $key => $value) {
    //   // var_dump( $value['empaque']);
    //   if ($value['empaque'] == "Varios" || $value['empaque'] == "Bulto" || $value['empaque'] == "Paquetes") {
    //     $unidad_transporte = "ESTACAS";
    //   } /* else if ($value['empaque'] == "Carga Estibada") {
    //     $unidad_transporte = "ESTIBAS";
    //   } else if ($value['empaque'] == "1 C 40 Pies (Contenedor)" || $value['empaque'] == "2 C 20 Pies (Contenedor)" || $value['empaque'] == "1 C 20 Pies (Contenedor)") {
    //     $unidad_transporte = "ESTIBA";
    //   } */

    //   if ($value['tipo_carga_descripcion'] == "GENERAL") {
    //     $tipo_carga = "General";
    //   } else if ($value['tipo_carga_descripcion'] == "CONTENEDOR VACÍO" || $value['tipo_carga_descripcion'] == "CONTENEDOR CARGADO") {
    //     $tipo_carga = "Contenedor";
    //   }
    // }

    $xml_sicetac = '';
    $xml_sicetac .= "<?xml version='1.0' encoding='ISO-8859-1'?>";
    $xml_sicetac .= '<root>';
    $xml_sicetac .= '<acceso>';
    $xml_sicetac .= '<username>' . MINTRANS_USER . '</username>';
    $xml_sicetac .= '<password>' . MINTRANS_PASS . '</password>';
    $xml_sicetac .= '</acceso>';
    $xml_sicetac .= '<solicitud>';
    $xml_sicetac .= '<tipo>2</tipo>';
    $xml_sicetac .= '<procesoid>26</procesoid>';
    $xml_sicetac .= '</solicitud>';
    $xml_sicetac .= '<variables>';
    $xml_sicetac .= 'NOMBREUNIDADTRANSPORTE, NOMBRETIPOCARGA, NOMBRERUTA, VALOR, VALORTONELADA, VALORHORA, DISTANCIA';
    // $xml_sicetac .= 'VALOR';
    $xml_sicetac .= '</variables>';
    $xml_sicetac .= '<documento>';
    $xml_sicetac .= '<PERIODO>202412</PERIODO>';
    $xml_sicetac .= '<CONFIGURACION>"' . $configuracion_vehiculo . '"</CONFIGURACION>';
    $xml_sicetac .= '<ORIGEN>"' . $codigo_origen_manifesto . '"</ORIGEN>';
    $xml_sicetac .= '<DESTINO>"' . $codigo_destino_manifesto . '"</DESTINO>';
    // $xml_sicetac .= '<NOMBREUNIDADTRANSPORTE>"' . $unidad_transporte . '"</NOMBREUNIDADTRANSPORTE>';
    // $xml_sicetac .= '<NOMBRETIPOCARGA>"' . $tipo_carga . '"</NOMBRETIPOCARGA>';
    $xml_sicetac .= '</documento>';
    $xml_sicetac .= '</root>';
    $result_sicetac = $this->rndc_conexion($xml_sicetac);
    // Si no hay respuesta o el XML es inválido
    if (!$result_sicetac || !simplexml_load_string($result_sicetac)) {
      $data['status'] = 'false';
      $data['resultado'] = 'Error en la conexión o respuesta no válida.';
      echo json_encode($data);
      return;
    }

    // Cargar la respuesta como XML
    $xml = simplexml_load_string(mb_convert_encoding($result_sicetac, 'UTF-8', from_encoding: 'ISO-8859-1'));

    // Verificar si hay un error específico en la respuesta
    if (isset($xml->ErrorMSG)) {
      $data['status'] = 'false';
      $data['codigo'] = (string)$xml->ErrorMSG['codigo'] ?? 'Desconocido';
      $data['mensaje'] = (string)$xml->ErrorMSG;
      echo json_encode($data);
      return;
    }

    // Procesar la respuesta exitosa
    $json = json_encode($xml);
    $resultm = json_decode($json, associative: true);

    $data['status'] = 'true';
    $data['resultado'] = $resultm;
    echo json_encode($data);
  }


  // TRANSMISION DE MANIFIESTO
  public function Transmite_Manifiesto()
  {
    $msg_error = '';
    $op = 2;
    $id = $_POST['id'];
    $proceso = $_POST['proceso'];
    $dato = $_POST['dato'];
    $filtro = $_POST['filtro'];
    $tipopro = $_POST['tipopro'];
    // consultar manifiesto NexosAPP
    $manifiesto = $this->_modelo->Consulta_Manifiesto($id);
    if ($manifiesto == true) {
      // consultar ministerio de transporte
      $resulta_rndc = $this->Consulta_Documento_Carga($op, $id, $proceso, $tipopro);
      $convierte_xml = new SimpleXMLElement($resulta_rndc);

      if ($convierte_xml->ErrorMSG[0]) {
        if ($convierte_xml->ErrorMSG[0] == 'Error RNDC11: Documento no encontrado.') {
        } else {
          // NO EXISTE
          // homologar datos
          $ptrailer = '';
          $fechaexpide = date('d/m/Y', strtotime($manifiesto[0]['fecha_expedicion']));
          $fechapago = date('d/m/Y', strtotime($manifiesto[0]['fecha_pago']));
          if ($manifiesto[0]['tipo_titular'] == 'Cedula de Ciudadania') {
            $tdoc_titular = 'C';
            $num_titular = ($manifiesto[0]['num_titular']);
          } else if ($manifiesto[0]['tipo_titular'] == 'Cedula de Extranjeria') {
            $tdoc_titular = 'E';
            $num_titular = ($manifiesto[0]['num_titular']);
          } else if ($manifiesto[0]['tipo_titular'] == 'NIT') {
            $tdoc_titular = 'N';
            $num_titular = ($manifiesto[0]['num_titular'] . $manifiesto[0]['digito_titular']);
          }
          if (
            $manifiesto[0]['placa_trailer'] != null && $manifiesto[0]['placa_trailer'] != '' && $manifiesto[0]['placa_trailer']
            !=
            null
          ) {
            $ptrailer = $manifiesto[0]['placa_trailer'];
          } else {
            $ptrailer = '';
          }
          if ($manifiesto[0]['tipo_conductor'] == 'Cedula de Ciudadania') {
            $tdoc_condu = 'C';
            $num_conductor = ($manifiesto[0]['num_conductor']);
          } else if ($manifiesto[0]['tipo_conductor'] == 'Cedula de Extranjeria') {
            $tdoc_condu = 'E';
            $num_conductor = ($manifiesto[0]['num_conductor']);
          } else if ($manifiesto[0]['tipo_conductor'] == 'NIT') {
            $tdoc_condu = 'N';
            $num_conductor = ($manifiesto[0]['num_conductor'] . $manifiesto[0]['digito_conductor']);
          }

          if ($manifiesto[0]['cargue_pagado'] == 1) {
            $pagocargue = 'E';
          } else if ($manifiesto[0]['cargue_pagado'] == 2) {
            $pagocargue = 'D';
          } else if ($manifiesto[0]['cargue_pagado'] == 3) {
            $pagocargue = 'R';
          } else if ($manifiesto[0]['cargue_pagado'] == 4) {
            $pagocargue = 'C';
          }

          if ($manifiesto[0]['descargue_pagado'] == 1) {
            $pagodescargue = 'E';
          } else if ($manifiesto[0]['descargue_pagado'] == 2) {
            $pagodescargue = 'D';
          } else if ($manifiesto[0]['descargue_pagado'] == 3) {
            $pagodescargue = 'R';
          } else if ($manifiesto[0]['descargue_pagado'] == 4) {
            $pagodescargue = 'C';
          }

          if ($manifiesto[0]['tipo_manifiesto'] == 1) {
            $operacion = 'G';
          } else if ($manifiesto[0]['tipo_manifiesto'] == 2) {
            $operacion = 'M';
          } else if ($manifiesto[0]['tipo_manifiesto'] == 3) {
            $operacion = 'W';
          } else if ($manifiesto[0]['tipo_manifiesto'] == 4) {
            $operacion = 'D';
          } else if ($manifiesto[0]['tipo_manifiesto'] == 8) {
            $operacion = 'I';
          }

          if ($manifiesto[0]['valor_anticipo'] != null) {
            if ($manifiesto[0]['tipo_titular'] == 'NIT' && $manifiesto[0]['num_titular'] == '900062596') {
              $municipio_pago = '11001000';
              $anticipo = str_replace(',', '', $manifiesto[0]['valor_anticipo']);
            } else {
              $municipio_pago = '11001000';
              $anticipo = str_replace(',', '', $manifiesto[0]['valor_anticipo']);
            }
          } else {
            $municipio_pago = '11001000';
            $anticipo = '0';
          }

          $flete = str_replace(',', '', $manifiesto[0]['valor_total_viaje']);

          $total_flete = (float) $flete;

          /* Colocar la agencia de donde debe colocar el ICA */
          if ($manifiesto[0]['agencia'] == 1) { // Bogota
            $ica = '4.14';
          } elseif ($manifiesto[0]['agencia'] == 2) { // Cartagena
            $ica = '8.56';
          } elseif ($manifiesto[0]['agencia'] == 4) { // Buenaventura
            $ica = '7';
          }

          // Convertir el valor a un número flotante
          $valor_numerico = (float) $anticipo;

          $xml_manifiesto = '';
          $xml_manifiesto .= "<?xml version='1.0' encoding='ISO-8859-1'?>";
          $xml_manifiesto .= '<root>';
          $xml_manifiesto .= '<acceso>';
          $xml_manifiesto .= '<username>' . MINTRANS_USER . '</username>
                              <password>' . MINTRANS_PASS . '</password>';
          $xml_manifiesto .= '</acceso>';
          $xml_manifiesto .= '<solicitud>';
          $xml_manifiesto .= '<tipo>1</tipo>';

          if ($manifiesto[0]['origen'] == $manifiesto[0]['destino']) {
            // VALORANTICIPOMANIFIESTO no existe para proceso 81
            if ($ptrailer == '') {
              $xml_manifiesto .= '<procesoid>81</procesoid>';
              $xml_manifiesto .= '</solicitud>';
              $xml_manifiesto .= '<variables>';
              $xml_manifiesto .= '<NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>';
              $xml_manifiesto .= '<CONSECUTIVOURBANO>' . $manifiesto[0]['id'] . '</CONSECUTIVOURBANO>';
              $xml_manifiesto .= '<FECHAEXPEDICION>' . $fechaexpide . '</FECHAEXPEDICION>';
              $xml_manifiesto .= '<CODOPERACIONTRANSPORTE>' . $operacion . '</CODOPERACIONTRANSPORTE>';
              $xml_manifiesto .= '<CODMUNICIPIO>' . $manifiesto[0]['origen'] . '</CODMUNICIPIO>';
              $xml_manifiesto .= '<CODIDTITULAR>' . $tdoc_titular . '</CODIDTITULAR>';
              $xml_manifiesto .= '<NUMIDTITULAR>' . $num_titular . '</NUMIDTITULAR>';
              $xml_manifiesto .= '<CODSEDETITULAR></CODSEDETITULAR>';
              $xml_manifiesto .= '<NUMPLACA>' . $manifiesto[0]['placa'] . '</NUMPLACA>';
              // $xml_manifiesto .= "<NUMPLACAREMOLQUE>" . $ptrailer . "</NUMPLACAREMOLQUE>";
              $xml_manifiesto .= '<CODIDCONDUCTOR>' . $tdoc_condu . '</CODIDCONDUCTOR>';
              $xml_manifiesto .= '<NUMIDCONDUCTOR>' . $num_conductor . '</NUMIDCONDUCTOR>';
              $xml_manifiesto .= '<VALORPACTADO>' . $total_flete . '</VALORPACTADO>';
              $xml_manifiesto .= '<FACTORICA>' . $ica . '</FACTORICA>';
              $xml_manifiesto .= '<CODRESPONSABLEPAGOCARGUE>' . $pagocargue . '</CODRESPONSABLEPAGOCARGUE>';
              $xml_manifiesto .= '<CODRESPONSABLEPAGODESCARGUE>' . $pagodescargue . '</CODRESPONSABLEPAGODESCARGUE>';
              $xml_manifiesto .= '<OBSERVACIONES>' . $manifiesto[0]['observacion'] . '</OBSERVACIONES>';
              $xml_manifiesto .= "<REMESAS procesoid='82'>";
              // consulta remesas que fueron transmitidas
              $remesas = $this->_modelo->Consulta_Remesa_Trans($id);
              if ($remesas) {
                foreach ($remesas as $valor_remesa) {
                  $xml_manifiesto .= '<REMESA>
                                        <REMESAURBANA>' . $valor_remesa['id_remesa'] . '</REMESAURBANA>
                                      </REMESA>';
                }
              }
              $xml_manifiesto .= '</REMESAS>';
              $xml_manifiesto .= '</variables>';
              $xml_manifiesto .= '</root>';
            } else {
              $xml_manifiesto .= '<procesoid>81</procesoid>';
              $xml_manifiesto .= '</solicitud>';
              $xml_manifiesto .= '<variables>';
              $xml_manifiesto .= '<NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>';
              $xml_manifiesto .= '<CONSECUTIVOURBANO>' . $manifiesto[0]['id'] . '</CONSECUTIVOURBANO>';
              $xml_manifiesto .= '<FECHAEXPEDICION>' . $fechaexpide . '</FECHAEXPEDICION>';
              $xml_manifiesto .= '<CODOPERACIONTRANSPORTE>' . $operacion . '</CODOPERACIONTRANSPORTE>';
              $xml_manifiesto .= '<CODMUNICIPIO>' . $manifiesto[0]['origen'] . '</CODMUNICIPIO>';
              $xml_manifiesto .= '<CODIDTITULAR>' . $tdoc_titular . '</CODIDTITULAR>';
              $xml_manifiesto .= '<NUMIDTITULAR>' . $num_titular . '</NUMIDTITULAR>';
              $xml_manifiesto .= '<CODSEDETITULAR></CODSEDETITULAR>';
              $xml_manifiesto .= '<NUMPLACA>' . $manifiesto[0]['placa'] . '</NUMPLACA>';
              $xml_manifiesto .= '<NUMPLACAREMOLQUE>' . $ptrailer . '</NUMPLACAREMOLQUE>';
              $xml_manifiesto .= '<CODIDCONDUCTOR>' . $tdoc_condu . '</CODIDCONDUCTOR>';
              $xml_manifiesto .= '<NUMIDCONDUCTOR>' . $num_conductor . '</NUMIDCONDUCTOR>';
              $xml_manifiesto .= '<VALORPACTADO>' . $total_flete . '</VALORPACTADO>';
              $xml_manifiesto .= '<FACTORICA>' . $ica . '</FACTORICA>';
              $xml_manifiesto .= '<CODRESPONSABLEPAGOCARGUE>' . $pagocargue . '</CODRESPONSABLEPAGOCARGUE>';
              $xml_manifiesto .= '<CODRESPONSABLEPAGODESCARGUE>' . $pagodescargue . '</CODRESPONSABLEPAGODESCARGUE>';
              $xml_manifiesto .= '<OBSERVACIONES>' . $manifiesto[0]['observacion'] . '</OBSERVACIONES>';
              $xml_manifiesto .= "<REMESAS procesoid='82'>";
              // consulta remesas que fueron transmitidas
              $remesas = $this->_modelo->Consulta_Remesa_Trans($id);
              if ($remesas) {
                foreach ($remesas as $valor_remesa) {
                  $xml_manifiesto .= '<REMESA>
                                        <REMESAURBANA>' . $valor_remesa['id_remesa'] . '</REMESAURBANA>
                                      </REMESA>';
                }
              }
              $xml_manifiesto .= '</REMESAS>';
              $xml_manifiesto .= '</variables>';
              $xml_manifiesto .= '</root>';
            }
          } else {
            $xml_manifiesto .= '<procesoid>4</procesoid>';
            $xml_manifiesto .= '</solicitud>';
            $xml_manifiesto .= '<variables>';
            $xml_manifiesto .= '<NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>';
            $xml_manifiesto .= '<NUMMANIFIESTOCARGA>' . $manifiesto[0]['id'] . '</NUMMANIFIESTOCARGA>';
            $xml_manifiesto .= '<CODOPERACIONTRANSPORTE>' . $operacion . '</CODOPERACIONTRANSPORTE>';
            $xml_manifiesto .= '<FECHAEXPEDICIONMANIFIESTO>' . $fechaexpide . '</FECHAEXPEDICIONMANIFIESTO>';
            $xml_manifiesto .= '<CODMUNICIPIOORIGENMANIFIESTO>' . $manifiesto[0]['origen'] . '</CODMUNICIPIOORIGENMANIFIESTO>';
            $xml_manifiesto .= '<CODMUNICIPIODESTINOMANIFIESTO>' . $manifiesto[0]['destino'] . '</CODMUNICIPIODESTINOMANIFIESTO>';
            $xml_manifiesto .= '<CODIDTITULARMANIFIESTO>' . $tdoc_titular . '</CODIDTITULARMANIFIESTO>';
            $xml_manifiesto .= '<NUMIDTITULARMANIFIESTO>' . $num_titular . '</NUMIDTITULARMANIFIESTO>';
            $xml_manifiesto .= '<NUMPLACA>' . $manifiesto[0]['placa'] . '</NUMPLACA>';
            $xml_manifiesto .= '<NUMPLACAREMOLQUE>' . $ptrailer . '</NUMPLACAREMOLQUE>';
            $xml_manifiesto .= '<CODIDCONDUCTOR>' . $tdoc_condu . '</CODIDCONDUCTOR>';
            $xml_manifiesto .= '<NUMIDCONDUCTOR>' . $num_conductor . '</NUMIDCONDUCTOR>';
            $xml_manifiesto .= '<VALORFLETEPACTADOVIAJE>' . $flete . '</VALORFLETEPACTADOVIAJE>';
            $xml_manifiesto .= '<RETENCIONICAMANIFIESTOCARGA>' . $ica . '</RETENCIONICAMANIFIESTOCARGA>';
            $xml_manifiesto .= '<RETENCIONFUENTEMANIFIESTO>' . $manifiesto[0]['retencion_fuente'] . '</RETENCIONFUENTEMANIFIESTO>';
            $xml_manifiesto .= '<VALORANTICIPOMANIFIESTO>' . $valor_numerico . '</VALORANTICIPOMANIFIESTO>';
            $xml_manifiesto .= '<FECHAPAGOSALDOMANIFIESTO>' . $fechapago . '</FECHAPAGOSALDOMANIFIESTO>';
            $xml_manifiesto .= '<CODRESPONSABLEPAGOCARGUE>' . $pagocargue . '</CODRESPONSABLEPAGOCARGUE>';
            $xml_manifiesto .= '<CODRESPONSABLEPAGODESCARGUE>' . $pagodescargue . '</CODRESPONSABLEPAGODESCARGUE>';
            $xml_manifiesto .= '<OBSERVACIONES>' . $manifiesto[0]['observacion'] . '</OBSERVACIONES>';
            $xml_manifiesto .= "<REMESASMAN procesoid='43'>";
            // consulta remesas que fueron transmitidas
            $remesas = $this->_modelo->Consulta_Remesa_Trans($id);
            if ($remesas) {
              foreach ($remesas as $valor_remesa) {
                $xml_manifiesto .= '<REMESA>
                                      <CONSECUTIVOREMESA>' . $valor_remesa['id_remesa'] . '</CONSECUTIVOREMESA>
                                    </REMESA>';
              }
            }
            $xml_manifiesto .= '</REMESASMAN>';
            $xml_manifiesto .= '<CODMUNICIPIOPAGOSALDO>' . $municipio_pago . '</CODMUNICIPIOPAGOSALDO>';
            $xml_manifiesto .= '<ACEPTACIONELECTRONICA>NO</ACEPTACIONELECTRONICA>';
            $xml_manifiesto .= '</variables>';
            $xml_manifiesto .= '</root>';
          }

          $result_manifiesto = $this->rndc_conexion($xml_manifiesto);
          // print_r($result_manifiesto);
          // $xml = simplexml_load_string(utf8_decode($result_manifiesto));
          $xml = simplexml_load_string(mb_convert_encoding($result_manifiesto, 'UTF-8', 'ISO-8859-1'));
          // $xml = simplexml_load_string(mb_convert_encoding($result_manifiesto, 'ISO-8859-1', 'UTF-8'));
          $json = json_encode($xml);
          $resultm = json_decode($json, true);
          // registro por etiqueta

          $manifi = $manifiesto[0]['id'];
          $user = '<username>' . MINTRANS_USER . '</username>';
          $clave = '<password>' . MINTRANS_PASS . '</password>';
          $tipo = 1;
          $proceso = 4;
          $nitempresa = '<NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>';
          $mnfcarga = '<NUMMANIFIESTOCARGA>' . $manifiesto[0]['id'] . '</NUMMANIFIESTOCARGA>';
          $operacion = '<CODOPERACIONTRANSPORTE>' . $operacion . '</CODOPERACIONTRANSPORTE>';
          $fecha = '<FECHAEXPEDICIONMANIFIESTO>' . $fechaexpide . '</FECHAEXPEDICIONMANIFIESTO>';
          $origen = '<CODMUNICIPIOORIGENMANIFIESTO>' . $manifiesto[0]['origen'] . '</CODMUNICIPIOORIGENMANIFIESTO>';
          $destino = '<CODMUNICIPIODESTINOMANIFIESTO>' . $manifiesto[0]['destino'] . '</CODMUNICIPIODESTINOMANIFIESTO>';
          $titular = '<CODIDTITULARMANIFIESTO>' . $tdoc_titular . '</CODIDTITULARMANIFIESTO>';
          $numtitular = '<NUMIDTITULARMANIFIESTO>' . $num_titular . '</NUMIDTITULARMANIFIESTO>';
          $placa = '<NUMPLACA>' . $manifiesto[0]['placa'] . '</NUMPLACA>';
          $remolque = '<NUMPLACAREMOLQUE>' . $ptrailer . '</NUMPLACAREMOLQUE>';
          $conductor = '<CODIDCONDUCTOR>' . $tdoc_condu . '</CODIDCONDUCTOR>';
          $numcondu = '<NUMIDCONDUCTOR>' . $num_conductor . '</NUMIDCONDUCTOR>';
          $flete = '<VALORFLETEPACTADOVIAJE>' . $manifiesto[0]['valor_total_viaje'] . '</VALORFLETEPACTADOVIAJE>';
          $rete = '<RETENCIONICAMANIFIESTOCARGA>4</RETENCIONICAMANIFIESTOCARGA>';
          $retefu = '<RETENCIONFUENTEMANIFIESTO>' . $manifiesto[0]['retencion_fuente'] . '</RETENCIONFUENTEMANIFIESTO>';
          $anti = '<VALORANTICIPOMANIFIESTO>' . $valor_numerico . '</VALORANTICIPOMANIFIESTO>';
          $fechapag = '<FECHAPAGOSALDOMANIFIESTO>' . $fechapago . '</FECHAPAGOSALDOMANIFIESTO>';
          $responcargue = '<CODRESPONSABLEPAGOCARGUE>' . $pagocargue . '</CODRESPONSABLEPAGOCARGUE>';
          $respondescargue = '<CODRESPONSABLEPAGODESCARGUE>' . $pagodescargue . '</CODRESPONSABLEPAGODESCARGUE>';
          $obs = '<OBSERVACIONES>' . $manifiesto[0]['observacion'] . '</OBSERVACIONES>';
          $pagosaldo = '<CODMUNICIPIOPAGOSALDO>' . $municipio_pago . '</CODMUNICIPIOPAGOSALDO>';
          $aceptacion = 'ACEPTACIONELECTRONICA>NO</ACEPTACIONELECTRONICA>';
          // manifiesto
          // remesas
          if ($remesas) {
            $cont = 0;
            $arrayremesa = array();
            foreach ($remesas as $valor_remesa) {
              $cont++;
              $remesa_xml = '<REMESA>
                                <CONSECUTIVOREMESA>' . $valor_remesa['id_remesa'] . '</CONSECUTIVOREMESA>
                             </REMESA>';
              $arrayremesa[$cont]['rem'] = $remesa_xml;
            }
            $remesa = $arrayremesa;
          }
          $this->registro = $this->_modelo->Registro_Etiqueta(
            $manifi,
            $user,
            $clave,
            $tipo,
            $proceso,
            $nitempresa,
            $mnfcarga,
            $operacion,
            $fecha,
            $origen,
            $destino,
            $titular,
            $numtitular,
            $placa,
            $remolque,
            $conductor,
            $numcondu,
            $flete,
            $rete,
            $retefu,
            $anti,
            $fechapag,
            $responcargue,
            $respondescargue,
            $obs,
            $pagosaldo,
            $aceptacion,
            $remesa
          );
          // registro de la trazabilidad
          if (isset($resultm['ErrorMSG'])) {
            $status = 0;
          } else {
            $status = 1;
          }
          $this->registro2 = $this->_modelo->Registro_Trazabilidad($manifi, $xml_manifiesto, $result_manifiesto, $status);

          if (isset($resultm['ErrorMSG'])) {
            $msg_error .= $resultm['ErrorMSG'];
            $data['status'] = 'false';
            $data['resultado'] = $msg_error;
            $data['num_manifiesto'] = $manifiesto[0]['id'];
            echo json_encode($data);
          } else {
            $rndc_ingresoid = $resultm['ingresoid'];
            $data['status'] = 'true';
            $data['resultado'] = $rndc_ingresoid;
            $data['num_manifiesto'] = $manifiesto[0]['id'];
            // Actualizar numero de aprobacion
            $update_aprobacion = $this->_modelo->numero_aprobacion($manifiesto[0]['id'], $rndc_ingresoid);
            echo json_encode($data);
          }
        }
      }
    } // cierre de validacion del manifiesto
  }

  // TRANSMITE CUMPLIDO DE REMESA
  public function Transmite_Cumplido_Inicial()
  {
    $num_manifiesto = $_POST['num_manifiesto'];
    $proceso = $_POST['proceso'];
    $dato = $_POST['dato'];
    $filtro = $_POST['filtro'];
    $tipopro = $_POST['tipopro'];
    // consultar cumplido
    $cumplido = $this->_modelo2->Consulta_Cumplido_forrndc($num_manifiesto);
    if ($cumplido == true) {
      $arreglo = [];
      $m = 0;
      foreach ($cumplido as $valor_cumplido) {
        $fechalleg = date('d/m/Y', strtotime($valor_cumplido['fecha_llegada']));
        $fechaent = date('d/m/Y', strtotime($valor_cumplido['fecha_entrada']));
        $fechasal = date('d/m/Y', strtotime($valor_cumplido['fecha_salida']));

        $horalleg = date('H:i', strtotime($valor_cumplido['hora_llegada']));
        $horaent = date('H:i', strtotime($valor_cumplido['hora_entrada']));
        $horasal = date('H:i', strtotime($valor_cumplido['hora_salida']));

        $fechallegc = date('d/m/Y', strtotime($valor_cumplido['fec_ca_lleg']));
        $fechaentc = date('d/m/Y', strtotime($valor_cumplido['fec_ca_ent']));
        $fechasalc = date('d/m/Y', strtotime($valor_cumplido['fec_ca_sal']));

        $horallegc = date('H:i', strtotime($valor_cumplido['fec_ca_hor']));
        $horaentc = date('H:i', strtotime($valor_cumplido['fec_ent_hor']));
        $horasalc = date('H:i', strtotime($valor_cumplido['fec_sal_hor']));
        $xml_cumplidore = '';
        $xml_cumplidore .= "<?xml version='1.0' encoding='ISO-8859-1'?>";
        $xml_cumplidore .= '<root>';
        $xml_cumplidore .= '<acceso>';
        $xml_cumplidore .= '<username>' . MINTRANS_USER . '</username>
                            <password>' . MINTRANS_PASS . '</password>';
        $xml_cumplidore .= '</acceso>';
        $xml_cumplidore .= '<solicitud>';
        $xml_cumplidore .= '<tipo>1</tipo>';
        $xml_cumplidore .= '<procesoid>5</procesoid>';
        $xml_cumplidore .= '</solicitud>';
        $xml_cumplidore .= '<variables>';
        $xml_cumplidore .= '<NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>';
        $xml_cumplidore .= '<CONSECUTIVOREMESA>' . $valor_cumplido['idremesa'] . '</CONSECUTIVOREMESA>';
        $xml_cumplidore .= '<NUMMANIFIESTOCARGA>' . $valor_cumplido['manifiesto'] . '</NUMMANIFIESTOCARGA>';
        $xml_cumplidore .= '<TIPOCUMPLIDOREMESA>C</TIPOCUMPLIDOREMESA>';
        $xml_cumplidore .= '<CANTIDADCARGADA>' . $valor_cumplido['cantidad_real_cargada'] . '</CANTIDADCARGADA>';
        $xml_cumplidore .= '<CANTIDADENTREGADA>' . $valor_cumplido['cantidad_real_cargada'] . '</CANTIDADENTREGADA>';
        $xml_cumplidore .= '<UNIDADMEDIDACAPACIDAD>1</UNIDADMEDIDACAPACIDAD>';
        $xml_cumplidore .= '<FECHALLEGADACARGUE>' . $fechallegc . '</FECHALLEGADACARGUE>';
        $xml_cumplidore .= '<HORALLEGADACARGUEREMESA>' . $horallegc . '</HORALLEGADACARGUEREMESA>';
        $xml_cumplidore .= '<FECHAENTRADACARGUE>' . $fechaentc . '</FECHAENTRADACARGUE>';
        $xml_cumplidore .= '<HORAENTRADACARGUEREMESA>' . $horaentc . '</HORAENTRADACARGUEREMESA>';
        $xml_cumplidore .= '<FECHASALIDACARGUE>' . $fechasalc . '</FECHASALIDACARGUE>';
        $xml_cumplidore .= '<HORASALIDACARGUEREMESA>' . $horasalc . '</HORASALIDACARGUEREMESA>';
        $xml_cumplidore .= '<FECHALLEGADADESCARGUE>' . $fechalleg . '</FECHALLEGADADESCARGUE>';
        $xml_cumplidore .= '<HORALLEGADADESCARGUECUMPLIDO>' . $horalleg . '</HORALLEGADADESCARGUECUMPLIDO>';
        $xml_cumplidore .= '<FECHAENTRADADESCARGUE>' . $fechaent . '</FECHAENTRADADESCARGUE>';
        $xml_cumplidore .= '<HORAENTRADADESCARGUECUMPLIDO>' . $horaent . '</HORAENTRADADESCARGUECUMPLIDO>';
        $xml_cumplidore .= '<FECHASALIDADESCARGUE>' . $fechasal . '</FECHASALIDADESCARGUE>';
        $xml_cumplidore .= '<HORASALIDADESCARGUECUMPLIDO>' . $horasal . '</HORASALIDADESCARGUECUMPLIDO>';
        $xml_cumplidore .= '</variables>';
        $xml_cumplidore .= '</root>';
        $result_cumplido = $this->rndc_conexion($xml_cumplidore);
        // $xml = simplexml_load_string(utf8_decode($result_cumplido));
        $xml = simplexml_load_string(mb_convert_encoding($result_cumplido, 'UTF-8', 'ISO-8859-1'));
        $json = json_encode($xml);
        $resultm = json_decode($json, true);
        if (isset($resultm['ErrorMSG'])) {
          $estado_rem = 0;
        } else {
          $estado_rem = 1;
        }
        // respuesta de transaccion cumplido de remesa
        $respuesta_transaccion = $this->_modelo->Remesa_Transmite(
          $valor_cumplido['idremesa'],
          $result_cumplido,
          $estado_rem,
          $xml
        );
        $arreglo[$m] = $xml;
      }
      $m++;
    }
    echo json_encode($arreglo);
  }

  // TRANSMITE CUMPLIDO DE MANIFIESTO
  public function Transmite_Cumplido()
  {
    $msg_error = '';
    $id = $_POST['id']; // manifiesto
    $proceso = $_POST['proceso'];
    $dato = $_POST['dato'];
    $filtro = $_POST['filtro'];
    $tipopro = $_POST['tipopro'];
    // consultar cumplido NexosAPP
    $cumplido = $this->_modelo2->Consulta_Cumplido_Cu($id);
    if ($cumplido == true) {
      $fecha = date('d/m/Y');

      if ($cumplido['origen_viaje'] == $cumplido['destino_viaje']) { // Cumplido manifiesto municipal
        $xml_cumplido = '';
        $xml_cumplido .= '<?xml version="1.0" encoding="ISO-8859-1" ?>';
        $xml_cumplido .= '<root>';
        $xml_cumplido .= '<acceso>';
        $xml_cumplido .= '<username>' . MINTRANS_USER . '</username>';
        $xml_cumplido .= '<password>' . MINTRANS_PASS . '</password>';
        $xml_cumplido .= '</acceso>';
        $xml_cumplido .= '<solicitud>
                            <tipo>1</tipo>
                            <procesoid>79</procesoid>
                          </solicitud>';
        $xml_cumplido .= '
                        <variables>
                          <NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>
                          <CONSECUTIVOURBANO>' . $id . '</CONSECUTIVOURBANO>
                          <TIPOCUMPLIDO>C</TIPOCUMPLIDO>
                          <MOTIVOSSUSPENSION></MOTIVOSSUSPENSION>
                          <CONSECUENCIASUSPENSION></CONSECUENCIASUSPENSION>
                          <VALORADICIONALCARGUE>0</VALORADICIONALCARGUE>
                          <VALORADICIONALDESCARGUE>0</VALORADICIONALDESCARGUE>
                          <VALORADICIONAL>0</VALORADICIONAL>
                          <MOTIVOVALORADICIONAL></MOTIVOVALORADICIONAL>
                          <VALORDESCUENTO>0</VALORDESCUENTO>
                          <MOTIVOVALORDESCUENTO></MOTIVOVALORDESCUENTO>
                          <VALORSOBREANTICIPO>0</VALORSOBREANTICIPO>
                          <OBSERVACIONES></OBSERVACIONES>
                        </variables> ';
        $xml_cumplido .= '</root>';
      } else { // cumplido de otra denominacion
        $xml_cumplido = '';
        $xml_cumplido .= "<?xml version='1.0' encoding='ISO-8859-1'?>";
        $xml_cumplido .= '<root>';
        $xml_cumplido .= '';
        $xml_cumplido .= '<acceso>';
        $xml_cumplido .= '<username>' . MINTRANS_USER . '</username>
                          <password>' . MINTRANS_PASS . '</password>';
        $xml_cumplido .= '</acceso>';
        $xml_cumplido .= '<solicitud>';
        $xml_cumplido .= '<tipo>1</tipo>';
        $xml_cumplido .= '<procesoid>6</procesoid>';
        $xml_cumplido .= '</solicitud>';
        $xml_cumplido .= '<variables>';
        $xml_cumplido .= '<NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>';
        $xml_cumplido .= '<FECHAENTREGADOCUMENTOS>' . $fecha . '</FECHAENTREGADOCUMENTOS>';
        $xml_cumplido .= '<TIPOCUMPLIDOMANIFIESTO>C</TIPOCUMPLIDOMANIFIESTO>';
        $xml_cumplido .= '<NUMMANIFIESTOCARGA>' . $id . '</NUMMANIFIESTOCARGA>';
        $xml_cumplido .= '</variables>';
        $xml_cumplido .= '</root>';
      }

      $result_cumplido = $this->rndc_conexion($xml_cumplido);
      $xml = simplexml_load_string(mb_convert_encoding($result_cumplido, 'UTF-8', 'ISO-8859-1'));
      $json = json_encode($xml);
      $resultm = json_decode($json, true);
      if (isset($resultm['ErrorMSG'])) {
        $estado_cu = 0;
      } else {
        $estado_cu = 1;
      }
      $respuesta_transaccion = $this->_modelo->Cumplido_Transmite($id, $result_cumplido, $estado_cu, $xml);
      if (isset($resultm['ErrorMSG'])) {
        $msg_error .= $resultm['ErrorMSG'];
        $data['status'] = 'false';
        $data['resultado'] = $msg_error;
        $data['num_manifiesto'] = $id;
        // $data['num_cumplido'] = $cumplido['id'];
        echo json_encode($data);
        // var_dump($xml_prueba);
        // exit();
      } else {
        $rndc_ingresoid = $resultm['ingresoid'];
        $data['status'] = 'true';
        $data['resultado'] = $rndc_ingresoid;
        $data['num_manifiesto'] = $id;
        // $data['num_cumplido'] = $cumplido['id'];
        // Actualizar numero de aprobacion
        echo json_encode($data);
      }
    }
  }

  // CONSULTA DE TERCEROS AL MINISTERIO SIN TRANFERIR A OTRA FUNCION
  public function Consulta_Tercero_Rndc()
  {
    $documento = $_POST['documento'];
    $tdoc = $_POST['tdoc'];
    $digito = $_POST['digitove'];
    $op = 1;
    $numdoc = '';
    $solicita_datos = '';
    $consulta_xml = '';
    $consulta_xml .= "<?xml version='1.0' encoding='ISO-8859-1' ?>";
    $consulta_xml .= '<root>';
    $consulta_xml .= '<acceso>';
    $consulta_xml .= '<username>' . MINTRANS_USER . '</username>';
    $consulta_xml .= '<password>' . MINTRANS_PASS . '</password>';
    $consulta_xml .= '</acceso>';
    $consulta_xml .= '<solicitud>';
    $consulta_xml .= '<tipo>3</tipo>';
    $consulta_xml .= '<procesoid>11</procesoid>';
    $consulta_xml .= '</solicitud>';
    // CONSULTA TERCEROS
    if ($op == 1) {
      if ($tdoc == 'Cedula de Ciudadania' || $tdoc == 'CEDULA DE CIUDADANIA') {
        $tdoci = 'C';
        $numdoc = $_POST['documento'];
        $solicita_datos = 'NOMIDTERCERO, CODTIPOIDTERCERO, NUMIDTERCERO, PRIMERAPELLIDOIDTERCERO, SEGUNDOAPELLIDOIDTERCERO, CODSEDETERCERO, NUMTELEFONOCONTACTO, NUMCELULARPERSONA, NOMENCLATURADIRECCION, CODMUNICIPIORNDC, INGRESOID';
      }
      if ($tdoc == 'NIT') {
        $tdoci = 'N';
        $numdoc = ($_POST['documento'] . $_POST['digitove']);
        $solicita_datos = 'NOMIDTERCERO, CODTIPOIDTERCERO, NUMIDTERCERO, CODSEDETERCERO, NUMTELEFONOCONTACTO, NUMCELULARPERSONA, NOMENCLATURADIRECCION, CODMUNICIPIORNDC, INGRESOID';
      }
      if ($tdoc == 'Cedula de Extranjeria') {
        $tdoci = 'E';
        $numdoc = $_POST['documento'];
        $solicita_datos = 'NOMIDTERCERO, CODTIPOIDTERCERO, NUMIDTERCERO, PRIMERAPELLIDOIDTERCERO, SEGUNDOAPELLIDOIDTERCERO, CODSEDETERCERO, NUMTELEFONOCONTACTO, NUMCELULARPERSONA, NOMENCLATURADIRECCION, CODMUNICIPIORNDC, INGRESOID';
      }
      if ($tdoc == 'Natural') {
        $tdoci = 'C';
        $numdoc = $_POST['documento'];
        $solicita_datos = 'NOMIDTERCERO, CODTIPOIDTERCERO, NUMIDTERCERO, PRIMERAPELLIDOIDTERCERO, SEGUNDOAPELLIDOIDTERCERO, CODSEDETERCERO, NUMTELEFONOCONTACTO, NUMCELULARPERSONA, NOMENCLATURADIRECCION, CODMUNICIPIORNDC, INGRESOID';
      }
      if ($tdoc == 'Juridico') {
        $tdoci = 'N';
        $numdoc = ($_POST['documento'] . $_POST['digitove']);
        $solicita_datos = 'NOMIDTERCERO, CODTIPOIDTERCERO, NUMIDTERCERO, CODSEDETERCERO, NUMTELEFONOCONTACTO, NUMCELULARPERSONA, NOMENCLATURADIRECCION, CODMUNICIPIORNDC, INGRESOID';
      }

      $consulta_xml .= '<variables>';
      $consulta_xml .= $solicita_datos;
      $consulta_xml .= '</variables>';
      $consulta_xml .= '<documento>';
      $consulta_xml .= "<NUMNITEMPRESATRANSPORTE>'" . MINTRANS_NIT . "'</NUMNITEMPRESATRANSPORTE>";
      $consulta_xml .= "<CODTIPOIDTERCERO>'" . $tdoci . "'</CODTIPOIDTERCERO>";
      $consulta_xml .= "<NUMIDTERCERO>'" . $numdoc . "'</NUMIDTERCERO>";
      $consulta_xml .= '</documento>';
    }
    $consulta_xml .= '</root>';
    $result_rndc = $this->rndc_conexion($consulta_xml);
    // $xml = simplexml_load_string(utf8_decode($result_rndc));
    $xml = simplexml_load_string(mb_convert_encoding($result_rndc, 'UTF-8', 'ISO-8859-1'));
    $json = json_encode($xml);
    $resultm = json_decode($json, true);

    if (isset($resultm['ErrorMSG'])) {
      $data['status'] = 'false';
      $data['resultado'] = $resultm['ErrorMSG'];
      echo json_encode($data);
    } else {
      if (array_key_exists(0, $resultm['documento'])) {
        $arreglo = $resultm['documento'][0];
      } else {
        $arreglo = $resultm['documento'];
      }
      $vista = implode(' ', $arreglo);
      $traduccion = json_encode($vista);
      // $envio = utf8_decode($traduccion);
      $envio = mb_convert_encoding($traduccion, 'UTF-8', 'ISO-8859-1');
      $data['status'] = 'true';
      $data['resultado'] = $envio;
      echo json_encode($data);
    }
  }

  // CONSULTA DE TRAILERS AL MINISTERIO SIN TRANSFERIR A OTRA FUNCION
  public function Consulta_Trailer_Rndc()
  {
    $documento = $_POST['documento'];
    $consulta_xml = '';
    $consulta_xml .= "<?xml version='1.0' encoding='ISO-8859-1' ?>";
    $consulta_xml .= '<root>';
    $consulta_xml .= '<acceso>';
    $consulta_xml .= '<username>' . MINTRANS_USER . '</username>';
    $consulta_xml .= '<password>' . MINTRANS_PASS . '</password>';
    $consulta_xml .= '</acceso>';
    $consulta_xml .= '<solicitud>';
    $consulta_xml .= '<tipo>3</tipo>';
    $consulta_xml .= '<procesoid>12</procesoid>';
    $consulta_xml .= '</solicitud>';
    $consulta_xml .= '<variables>';
    $consulta_xml .= 'NUMPLACA, NUMEJES, ANOFABRICACIONVEHICULOCARGA, CODTIPOCARROCERIA, NUMIDPROPIETARIO, INGRESOID';
    $consulta_xml .= '</variables>';
    $consulta_xml .= '<documento>';
    $consulta_xml .= "<NUMNITEMPRESATRANSPORTE>'" . MINTRANS_NIT . "'</NUMNITEMPRESATRANSPORTE>";
    $consulta_xml .= "<NUMPLACA>'" . $documento . "'</NUMPLACA>";
    $consulta_xml .= '</documento>';
    $consulta_xml .= '</root>';
    $result_rndc = $this->rndc_conexion($consulta_xml);
    // $xml = simplexml_load_string(utf8_decode($result_rndc));
    $xml = simplexml_load_string(mb_convert_encoding($result_rndc, 'UTF-8', 'ISO-8859-1'));
    $json = json_encode($xml);
    $resultm = json_decode($json, true);
    if (isset($resultm['ErrorMSG'])) {
      $data['status'] = 'false';
      $data['resultado'] = $resultm['ErrorMSG'];
      echo json_encode($data);
    } else {
      if (array_key_exists(0, $resultm['documento'])) {
        $arreglo = $resultm['documento'][0];
      } else {
        $arreglo = $resultm['documento'];
      }
      $vista = implode(' ', $arreglo);
      $traduccion = json_encode($vista);
      // $envio = utf8_decode($traduccion);
      $envio = mb_convert_encoding($traduccion, 'UTF-8', 'ISO-8859-1');
      $data['status'] = 'true';
      $data['resultado'] = $envio;
      echo json_encode($data);
    }
  }

  // CONSULTA VEHICULO RNDC
  public function Consulta_Vehiculo_Rndc()
  {
    $documento = $_POST['placa'];
    $consulta_xml = '';
    $consulta_xml .= "<?xml version='1.0' encoding='ISO-8859-1' ?>";
    $consulta_xml .= '<root>';
    $consulta_xml .= '<acceso>';
    $consulta_xml .= '<username>' . MINTRANS_USER . '</username>';
    $consulta_xml .= '<password>' . MINTRANS_PASS . '</password>';
    $consulta_xml .= '</acceso>';
    $consulta_xml .= '<solicitud>';
    $consulta_xml .= '<tipo>3</tipo>';
    $consulta_xml .= '<procesoid>12</procesoid>';
    $consulta_xml .= '</solicitud>';
    $consulta_xml .= '<variables>';
    $consulta_xml .= 'NUMPLACA, NUMEJES, ANOFABRICACIONVEHICULOCARGA, CODTIPOCARROCERIA, NUMIDPROPIETARIO';
    $consulta_xml .= '</variables>';
    $consulta_xml .= '<documento>';
    $consulta_xml .= "<NUMNITEMPRESATRANSPORTE>'" . MINTRANS_NIT . "'</NUMNITEMPRESATRANSPORTE>";
    $consulta_xml .= "<NUMPLACA>'" . $documento . "'</NUMPLACA>";
    $consulta_xml .= '</documento>';
    $consulta_xml .= '</root>';
    $result_rndc = $this->rndc_conexion($consulta_xml);
    // $xml = simplexml_load_string(utf8_decode($result_rndc));
    $xml = simplexml_load_string(mb_convert_encoding($result_rndc, 'UTF-8', 'ISO-8859-1'));
    $json = json_encode($xml);
    $resultm = json_decode($json, true);
    if (isset($resultm['ErrorMSG'])) {
      $data['status'] = 'false';
      $data['resultado'] = $resultm['ErrorMSG'];
      echo json_encode($data);
    } else {
      if (array_key_exists(0, $resultm['documento'])) {
        $arreglo = $resultm['documento'][0];
      } else {
        $arreglo = $resultm['documento'];
      }
      $vista = implode(' ', $arreglo);
      $traduccion = json_encode($vista);
      // $envio = utf8_decode($traduccion);
      $envio = mb_convert_encoding($traduccion, 'UTF-8', 'ISO-8859-1');
      $data['status'] = 'true';
      $data['resultado'] = $envio;
      echo json_encode($data);
    }
  }

  // TRANSMISION DE REMESAS POR CADA UNA - RETRANSMISION
  public function Retransmite_Remesaindividual()
  {
    $msg_error = '';
    $op = 1;
    $id = $_POST['id'];
    $proceso = 3;
    $dato = $_POST['dato'];
    $filtro = 3;
    $tipopro = $_POST['tipopro'];
    $rndc_remesa = $this->_modelo->Datos_Remesa($id);
    if ($rndc_remesa) {
      $resulta_rndc = $this->Consulta_Documento_Carga($op, $id, $proceso, $tipopro);
      $convierte_xml = new SimpleXMLElement($resulta_rndc);
      if ($convierte_xml->ErrorMSG[0]) {
        if ($convierte_xml->ErrorMSG[0] == 'Error RNDC11: Documento no encontrado.') {
        } else {
          // Validar el tipo de operaciona realizar si es Nacional o Municipal
          if ($rndc_remesa[0]['origen_viaje'] == $rndc_remesa[0]['destino_viaje']) {
            // Remesa de Viaje Municipal
            foreach ($rndc_remesa as $valor_remesa) {
              // homologar
              $valor_remesa['id_manifiesto'];
              $tipodoc = '';
              $tipodocrem = '';
              $tipocli = '';
              $numdocume = '';
              $pesocontainer = '';
              if ($valor_remesa['tipo_documento'] == 'NIT') {
                $tipodoc = 'N';
                $docudesti = ($valor_remesa['documento'] . $valor_remesa['digito_verificacion']);
              }
              if ($valor_remesa['tipo_documento'] == 'Cedula de Ciudadania') {
                $tipodoc = 'C';
                $docudesti = ($valor_remesa['documento']);
              }
              if ($valor_remesa['tipo_documento'] == 'Cedula de Extranjeria') {
                $tipodoc = 'E';
                $docudesti = ($valor_remesa['documento']);
              }
              if ($valor_remesa['tipo_documento_remi'] == 'NIT') {
                $tipodocrem = 'N';
                $docuremi = ($valor_remesa['documento_remi'] . $valor_remesa['digito_remi']);
              }
              if ($valor_remesa['tipo_documento_remi'] == 'Cedula de Ciudadania') {
                $tipodocrem = 'C';
                $docuremi = ($valor_remesa['documento_remi']);
              }
              if ($valor_remesa['tipo_documento_remi'] == 'Cedula de Extranjeria') {
                $tipodocrem = 'E';
                $docuremi = ($valor_remesa['documento_remi']);
              }
              if ($valor_remesa['td_cliente'] == 'Juridico') {
                $tipocli = 'N';
                $numdocume = ($valor_remesa['documento_cliente'] . $valor_remesa['digito_cliente']);
              }
              if ($valor_remesa['td_cliente'] == 'Natural') {
                $tipocli = 'C';
                $numdocume = ($valor_remesa['documento_cliente']);
              }
              // fecha pactada cargue
              $fecha_pt_cargue = date('d/m/Y', strtotime($valor_remesa['fecha_cargue']));
              $fecha_pt_descargue = date('d/m/Y', strtotime($valor_remesa['fecha_descargue']));

              // homologar tipo de operacion
              if ($valor_remesa['tipo_carga'] == 'G') { // general
                $descripcion = $valor_remesa['tipo_mercancia'];
                $mercancia = $valor_remesa['codigo'];
                $cantidad = $valor_remesa['cantidad_real_cargada'];
                $unidad = 1;
                $pesocontainer = '';
              }
              if ($valor_remesa['tipo_carga'] == 'P') { // paqueteo
                $descripcion = '009880';
                $mercancia = '009880';
                $cantidad = $valor_remesa['cantidad_real_cargada'];
                $unidad = 1;
                $pesocontainer = '';
              }
              if ($valor_remesa['tipo_carga'] == 'V') { // contenedor vacio
                $descripcion = '009990';
                $mercancia = '009990';
                $cantidad = 0;
                $unidad = '';
                if (
                  $valor_remesa['pesocontenedor1'] != 0 || $valor_remesa['pesocontenedor1'] != '' || $valor_remesa['pesocontenedor1']
                  !=
                  null
                ) {
                  $pesocontainer = $valor_remesa['pesocontenedor1'];
                } else if (
                  $valor_remesa['pesocontenedor2'] != 0 ||
                  $valor_remesa['pesocontenedor2'] != '' ||
                  $valor_remesa['pesocontenedor2'] != 0
                ) {
                  $pesocontainer = $valor_remesa['pesocontenedor2'];
                } else {
                  $pesocontainer = 4100;
                }
                $pesocontainer = 4100;
              }
              if ($valor_remesa['tipo_carga'] == 'C') { // contenedor cargado
                $descripcion = $valor_remesa['tipo_mercancia'];
                $mercancia = $valor_remesa['codigo'];
                $cantidad = $valor_remesa['cantidad_real_cargada'];
                $pesocontainer = 4100;
                $unidad = 1;
              }

              $xml_remesa_municipal = '';
              $xml_remesa_municipal .= '<?xml version="1.0" encoding="ISO-8859-1" ?>';
              $xml_remesa_municipal .= '<root>';
              $xml_remesa_municipal .= '<acceso>
                                          <username>' . MINTRANS_USER . '</username>
                                          <password>' . MINTRANS_PASS . '</password>
                                        </acceso>';
              $xml_remesa_municipal .= '<solicitud>
                                          <tipo>1</tipo>
                                          <procesoid>83</procesoid>
                                        </solicitud>';
              $xml_remesa_municipal .= '
                                        <variables>
                                          <NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>
                                          <CONSECUTIVOREMESA>' . $valor_remesa['id'] . '</CONSECUTIVOREMESA>
                                          <CODOPERACIONTRANSPORTE>' . $valor_remesa['tipo_carga'] . '</CODOPERACIONTRANSPORTE>
                                          <CODNATURALEZACARGA>' . $valor_remesa['naturaleza'] . '</CODNATURALEZACARGA>
                                          <CANTIDADCARGADA>' . $cantidad . '</CANTIDADCARGADA>
                                          <UNIDADMEDIDACAPACIDAD>' . $unidad . '</UNIDADMEDIDACAPACIDAD>
                                          <CODTIPOEMPAQUE>' . $valor_remesa['tipo_empaque'] . '</CODTIPOEMPAQUE>
                                          <PESOCONTENEDORVACIO>' . $pesocontainer . '</PESOCONTENEDORVACIO>
                                          <MERCANCIAREMESA>' . $mercancia . '</MERCANCIAREMESA>
                                          <DESCRIPCIONCORTAPRODUCTO>' . $descripcion . '</DESCRIPCIONCORTAPRODUCTO>
                                          <CODTIPOIDREMITENTE>' . $tipodocrem . '</CODTIPOIDREMITENTE>
                                          <NUMIDREMITENTE>' . $docuremi . '</NUMIDREMITENTE>
                                          <CODSEDEREMITENTE>' . $valor_remesa['sede_remi'] . '</CODSEDEREMITENTE>
                                          <CODTIPOIDDESTINATARIO>' . $tipodoc . '</CODTIPOIDDESTINATARIO>
                                          <NUMIDDESTINATARIO>' . $docudesti . '</NUMIDDESTINATARIO>
                                          <CODSEDEDESTINATARIO>' . $valor_remesa['sede_desti'] . '</CODSEDEDESTINATARIO>
                                          <CODTIPOIDPROPIETARIO>' . $tipocli . '</CODTIPOIDPROPIETARIO>
                                          <NUMIDPROPIETARIO>' . $numdocume . '</NUMIDPROPIETARIO>
                                          <CODSEDEPROPIETARIO>' . $valor_remesa['idcliente'] . '</CODSEDEPROPIETARIO>
                                        </variables>';
              $xml_remesa_municipal .= '</root>';

              $result_remesa_municipal = $this->rndc_conexion($xml_remesa_municipal);
              // $xml = simplexml_load_string(utf8_decode($result_remesa_municipal));
              $xml_municipal = simplexml_load_string(mb_convert_encoding($result_remesa_municipal, 'UTF-8', 'ISO-8859-1'));
              $json_municipal = json_encode($xml_municipal);
              $result_municipal = json_decode($json_municipal, true);
              // LOG remesa y manifiesto
              if (isset($result_municipal['ErrorMSG'])) {
                $estado_rem = 0;
              } else {
                $estado_rem = 1;
              }
              $respuesta_transaccion = $this->_modelo->Remesa_Transmite(
                $valor_remesa['id'],
                $result_remesa_municipal,
                $estado_rem,
                $xml_remesa_municipal
              );
              if (isset($result_municipal['ErrorMSG'])) {
                $msg_error .= $result_municipal['ErrorMSG'];
                $data['status'] = 'false';
                $data['resultado'] = $msg_error;
                $estado_rem = 0;
                $remesa_rndc = $this->_modelo->Remesa_Rndc($valor_remesa['id'], $estado_rem);
                echo json_encode($data);
              } else {
                $rndc_ingresoid = $result_municipal['ingresoid'];
                $data['status'] = 'true';
                $data['resultado'] = $rndc_ingresoid;
                $estado_rem = 1;
                $remesa_rndc = $this->_modelo->Remesa_Rndc($valor_remesa['id'], $estado_rem); // estado remesa
                echo json_encode($data);
              }
            }
          } else {
            // Remesa de Viaje Nacional
            foreach ($rndc_remesa as $valor_remesa) {
              // homologar
              $valor_remesa['id_manifiesto'];
              $tipodoc = '';
              $tipodocrem = '';
              $tipocli = '';
              $numdocume = '';
              $pesocontainer = '';
              if ($valor_remesa['tipo_documento'] == 'NIT') {
                $tipodoc = 'N';
                $docudesti = ($valor_remesa['documento'] . $valor_remesa['digito_verificacion']);
              }
              if ($valor_remesa['tipo_documento'] == 'Cedula de Ciudadania') {
                $tipodoc = 'C';
                $docudesti = ($valor_remesa['documento']);
              }
              if ($valor_remesa['tipo_documento'] == 'Cedula de Extranjeria') {
                $tipodoc = 'E';
                $docudesti = ($valor_remesa['documento']);
              }
              if ($valor_remesa['tipo_documento_remi'] == 'NIT') {
                $tipodocrem = 'N';
                $docuremi = ($valor_remesa['documento_remi'] . $valor_remesa['digito_remi']);
              }
              if ($valor_remesa['tipo_documento_remi'] == 'Cedula de Ciudadania') {
                $tipodocrem = 'C';
                $docuremi = ($valor_remesa['documento_remi']);
              }
              if ($valor_remesa['tipo_documento_remi'] == 'Cedula de Extranjeria') {
                $tipodocrem = 'E';
                $docuremi = ($valor_remesa['documento_remi']);
              }
              if ($valor_remesa['td_cliente'] == 'Juridico') {
                $tipocli = 'N';
                $numdocume = ($valor_remesa['documento_cliente'] . $valor_remesa['digito_cliente']);
              }
              if ($valor_remesa['td_cliente'] == 'Natural') {
                $tipocli = 'C';
                $numdocume = ($valor_remesa['documento_cliente']);
              }
              // fecha pactada cargue
              $fecha_pt_cargue = date('d/m/Y', strtotime($valor_remesa['fecha_cargue']));
              $fecha_pt_descargue = date('d/m/Y', strtotime($valor_remesa['fecha_descargue']));

              // homologar tipo de operacion
              if ($valor_remesa['tipo_carga'] == 'G') { // general
                $descripcion = $valor_remesa['tipo_mercancia'];
                $mercancia = $valor_remesa['codigo'];
                $cantidad = $valor_remesa['cantidad_real_cargada'];
                $unidad = 1;
                $pesocontainer = '';
              }
              if ($valor_remesa['tipo_carga'] == 'P') { // paqueteo
                $descripcion = '009880';
                $mercancia = '009880';
                $cantidad = $valor_remesa['cantidad_real_cargada'];
                $unidad = 1;
                $pesocontainer = '';
              }
              if ($valor_remesa['tipo_carga'] == 'V') { // contenedor vacio
                $descripcion = '009990';
                $mercancia = '009990';
                $cantidad = 0;
                $unidad = '';
                if (
                  $valor_remesa['pesocontenedor1'] != 0 || $valor_remesa['pesocontenedor1'] != '' || $valor_remesa['pesocontenedor1']
                  !=
                  null
                ) {
                  $pesocontainer = $valor_remesa['pesocontenedor1'];
                } else if (
                  $valor_remesa['pesocontenedor2'] != 0 ||
                  $valor_remesa['pesocontenedor2'] != '' ||
                  $valor_remesa['pesocontenedor2'] != 0
                ) {
                  $pesocontainer = $valor_remesa['pesocontenedor2'];
                } else {
                  $pesocontainer = 4100;
                }
                $pesocontainer = 4100;
              }
              if ($valor_remesa['tipo_carga'] == 'C') { // contenedor cargado
                $descripcion = $valor_remesa['tipo_mercancia'];
                $mercancia = $valor_remesa['codigo'];
                $cantidad = $valor_remesa['cantidad_real_cargada'];
                $pesocontainer = 4100;
                $unidad = 1;
              }

              $xml_remesa = '';
              $xml_remesa .= "<?xml version='1.0' encoding='ISO-8859-1'?>";
              $xml_remesa .= '<root>';
              $xml_remesa .= '<acceso>';
              $xml_remesa .= '<username>' . MINTRANS_USER . '</username>
                              <password>' . MINTRANS_PASS . '</password>';
              $xml_remesa .= '</acceso>';
              $xml_remesa .= '<solicitud>';
              $xml_remesa .= '<tipo>1</tipo>';
              $xml_remesa .= '<procesoid>3</procesoid>';
              $xml_remesa .= '</solicitud>';
              $xml_remesa .= '<variables>';
              $xml_remesa .= '<NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>';
              $xml_remesa .= '<CONSECUTIVOREMESA>' . $valor_remesa['id'] . '</CONSECUTIVOREMESA>';
              $xml_remesa .= '<CODOPERACIONTRANSPORTE>' . $valor_remesa['tipo_carga'] . '</CODOPERACIONTRANSPORTE>';
              $xml_remesa .= '<CODNATURALEZACARGA>' . $valor_remesa['naturaleza'] . '</CODNATURALEZACARGA>';
              $xml_remesa .= '<CANTIDADCARGADA>' . $cantidad . '</CANTIDADCARGADA>';
              $xml_remesa .= '<UNIDADMEDIDACAPACIDAD>' . $unidad . '</UNIDADMEDIDACAPACIDAD>';
              $xml_remesa .= '<CODTIPOEMPAQUE>' . $valor_remesa['tipo_empaque'] . '</CODTIPOEMPAQUE>';
              $xml_remesa .= '<PESOCONTENEDORVACIO>' . $pesocontainer . '</PESOCONTENEDORVACIO>';
              $xml_remesa .= '<MERCANCIAREMESA>' . $mercancia . '</MERCANCIAREMESA>';
              $xml_remesa .= '<DESCRIPCIONCORTAPRODUCTO>' . $descripcion . '</DESCRIPCIONCORTAPRODUCTO>';
              $xml_remesa .= '<CODTIPOIDREMITENTE>' . $tipodocrem . '</CODTIPOIDREMITENTE>';
              $xml_remesa .= '<NUMIDREMITENTE>' . $docuremi . '</NUMIDREMITENTE>';
              $xml_remesa .= '<CODSEDEREMITENTE>' . $valor_remesa['sede_remi'] . '</CODSEDEREMITENTE>';
              $xml_remesa .= '<CODTIPOIDDESTINATARIO>' . $tipodoc . '</CODTIPOIDDESTINATARIO>';
              $xml_remesa .= '<NUMIDDESTINATARIO>' . $docudesti . '</NUMIDDESTINATARIO>';
              $xml_remesa .= '<CODSEDEDESTINATARIO>' . $valor_remesa['sede_desti'] . '</CODSEDEDESTINATARIO>';
              $xml_remesa .= '<DUENOPOLIZA>E</DUENOPOLIZA>';
              $xml_remesa .= '<NUMPOLIZATRANSPORTE>3002055</NUMPOLIZATRANSPORTE>';
              $xml_remesa .= '<COMPANIASEGURO>8600024002</COMPANIASEGURO>';
              $xml_remesa .= '<FECHAVENCIMIENTOPOLIZACARGA>01/12/2022</FECHAVENCIMIENTOPOLIZACARGA>';
              $xml_remesa .= '<HORASPACTOCARGA>' . $valor_remesa['horaspactocarga'] . '</HORASPACTOCARGA>';
              $xml_remesa .= '<MINUTOSPACTOCARGA>' . $valor_remesa['minutospactocarga'] . '</MINUTOSPACTOCARGA>';
              $xml_remesa .= '<HORASPACTODESCARGUE>' . $valor_remesa['horaspactodescargue'] . '</HORASPACTODESCARGUE>';
              $xml_remesa .= '<MINUTOSPACTODESCARGUE>' . $valor_remesa['minutospactodescargue'] . '</MINUTOSPACTODESCARGUE>';
              $xml_remesa .= '<CODTIPOIDPROPIETARIO>' . $tipocli . '</CODTIPOIDPROPIETARIO>';
              $xml_remesa .= '<NUMIDPROPIETARIO>' . $numdocume . '</NUMIDPROPIETARIO>';
              $xml_remesa .= '<CODSEDEPROPIETARIO>' . $valor_remesa['idcliente'] . '</CODSEDEPROPIETARIO>';
              $xml_remesa .= '<FECHACITAPACTADACARGUE>' . $fecha_pt_cargue . '</FECHACITAPACTADACARGUE>';
              $xml_remesa .= '<HORACITAPACTADACARGUE>' . $valor_remesa['hora_cargue'] . '</HORACITAPACTADACARGUE>';
              $xml_remesa .= '<FECHACITAPACTADADESCARGUE>' . $fecha_pt_descargue . '</FECHACITAPACTADADESCARGUE>';
              $xml_remesa .= '<HORACITAPACTADADESCARGUEREMESA>' . $valor_remesa['hora_descarga'] . '</HORACITAPACTADADESCARGUEREMESA>';
              $xml_remesa .= '<PERMISOCARGAEXTRA></PERMISOCARGAEXTRA>';
              $xml_remesa .= '<NUMIDGPS></NUMIDGPS>';
              $xml_remesa .= '</variables>';
              $xml_remesa .= '</root>';

              $result_remesa = $this->rndc_conexion($xml_remesa);
              // $xml = simplexml_load_string(utf8_decode($result_remesa));
              $xml = simplexml_load_string(mb_convert_encoding($result_remesa, 'UTF-8', 'ISO-8859-1'));
              $json = json_encode($xml);
              $resultm = json_decode($json, true);
              // LOG remesa y manifiesto
              if (isset($resultm['ErrorMSG'])) {
                $estado_rem = 0;
              } else {
                $estado_rem = 1;
              }
              $respuesta_transaccion = $this->_modelo->Remesa_Transmite(
                $valor_remesa['id'],
                $result_remesa,
                $estado_rem,
                $xml_remesa
              );
              if (isset($resultm['ErrorMSG'])) {
                $msg_error .= $resultm['ErrorMSG'];
                $data['status'] = 'false';
                $data['resultado'] = $msg_error;
                $estado_rem = 0;
                $remesa_rndc = $this->_modelo->Remesa_Rndc($valor_remesa['id'], $estado_rem);
                echo json_encode($data);
              } else {
                $rndc_ingresoid = $resultm['ingresoid'];
                $data['status'] = 'true';
                $data['resultado'] = $rndc_ingresoid;
                $estado_rem = 1;
                $remesa_rndc = $this->_modelo->Remesa_Rndc($valor_remesa['id'], $estado_rem); // estado remesa
                echo json_encode($data);
              }
            }
          }
        }
      } else {
        // Validar el tipo de operaciona realizar si es Nacional o Municipal
        if ($rndc_remesa[0]['origen_viaje'] == $rndc_remesa[0]['destino_viaje']) {
          // Remesa de Viaje Municipal
          foreach ($rndc_remesa as $valor_remesa) {
            // homologar
            $valor_remesa['id_manifiesto'];
            $tipodoc = '';
            $tipodocrem = '';
            $tipocli = '';
            $numdocume = '';
            $pesocontainer = '';
            if ($valor_remesa['tipo_documento'] == 'NIT') {
              $tipodoc = 'N';
              $docudesti = ($valor_remesa['documento'] . $valor_remesa['digito_verificacion']);
            }
            if ($valor_remesa['tipo_documento'] == 'Cedula de Ciudadania') {
              $tipodoc = 'C';
              $docudesti = ($valor_remesa['documento']);
            }
            if ($valor_remesa['tipo_documento'] == 'Cedula de Extranjeria') {
              $tipodoc = 'E';
              $docudesti = ($valor_remesa['documento']);
            }
            if ($valor_remesa['tipo_documento_remi'] == 'NIT') {
              $tipodocrem = 'N';
              $docuremi = ($valor_remesa['documento_remi'] . $valor_remesa['digito_remi']);
            }
            if ($valor_remesa['tipo_documento_remi'] == 'Cedula de Ciudadania') {
              $tipodocrem = 'C';
              $docuremi = ($valor_remesa['documento_remi']);
            }
            if ($valor_remesa['tipo_documento_remi'] == 'Cedula de Extranjeria') {
              $tipodocrem = 'E';
              $docuremi = ($valor_remesa['documento_remi']);
            }
            if ($valor_remesa['td_cliente'] == 'Juridico') {
              $tipocli = 'N';
              $numdocume = ($valor_remesa['documento_cliente'] . $valor_remesa['digito_cliente']);
            }
            if ($valor_remesa['td_cliente'] == 'Natural') {
              $tipocli = 'C';
              $numdocume = ($valor_remesa['documento_cliente']);
            }
            // fecha pactada cargue
            $fecha_pt_cargue = date('d/m/Y', strtotime($valor_remesa['fecha_cargue']));
            $fecha_pt_descargue = date('d/m/Y', strtotime($valor_remesa['fecha_descargue']));

            // homologar tipo de operacion
            if ($valor_remesa['tipo_carga'] == 'G') { // general
              $descripcion = $valor_remesa['tipo_mercancia'];
              $mercancia = $valor_remesa['codigo'];
              $cantidad = $valor_remesa['cantidad_real_cargada'];
              $unidad = 1;
              $pesocontainer = '';
            }
            if ($valor_remesa['tipo_carga'] == 'P') { // paqueteo
              $descripcion = '009880';
              $mercancia = '009880';
              $cantidad = $valor_remesa['cantidad_real_cargada'];
              $unidad = 1;
              $pesocontainer = '';
            }
            if ($valor_remesa['tipo_carga'] == 'V') { // contenedor vacio
              $descripcion = '009990';
              $mercancia = '009990';
              $cantidad = 0;
              $unidad = '';
              if (
                $valor_remesa['pesocontenedor1'] != 0 || $valor_remesa['pesocontenedor1'] != '' || $valor_remesa['pesocontenedor1']
                !=
                null
              ) {
                $pesocontainer = $valor_remesa['pesocontenedor1'];
              } else if (
                $valor_remesa['pesocontenedor2'] != 0 ||
                $valor_remesa['pesocontenedor2'] != '' ||
                $valor_remesa['pesocontenedor2'] != 0
              ) {
                $pesocontainer = $valor_remesa['pesocontenedor2'];
              } else {
                $pesocontainer = 4100;
              }
              $pesocontainer = 4100;
            }
            if ($valor_remesa['tipo_carga'] == 'C') { // contenedor cargado
              $descripcion = $valor_remesa['tipo_mercancia'];
              $mercancia = $valor_remesa['codigo'];
              $cantidad = $valor_remesa['cantidad_real_cargada'];
              $pesocontainer = 4100;
              $unidad = 1;
            }

            $xml_remesa_municipal = '';
            $xml_remesa_municipal .= '<?xml version="1.0" encoding="ISO-8859-1" ?>';
            $xml_remesa_municipal .= '<root>';
            $xml_remesa_municipal .= '<acceso>
                                        <username>' . MINTRANS_USER . '</username>
                                        <password>' . MINTRANS_PASS . '</password>
                                      </acceso>';
            $xml_remesa_municipal .= '<solicitud>
                                        <tipo>1</tipo>
                                        <procesoid>83</procesoid>
                                      </solicitud>';
            $xml_remesa_municipal .= '
                                      <variables>
                                        <NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>
                                        <CONSECUTIVOREMESA>' . $valor_remesa['id'] . '</CONSECUTIVOREMESA>
                                        <CODOPERACIONTRANSPORTE>' . $valor_remesa['tipo_carga'] . '</CODOPERACIONTRANSPORTE>
                                        <CODNATURALEZACARGA>' . $valor_remesa['naturaleza'] . '</CODNATURALEZACARGA>
                                        <CANTIDADCARGADA>' . $cantidad . '</CANTIDADCARGADA>
                                        <UNIDADMEDIDACAPACIDAD>' . $unidad . '</UNIDADMEDIDACAPACIDAD>
                                        <CODTIPOEMPAQUE>' . $valor_remesa['tipo_empaque'] . '</CODTIPOEMPAQUE>
                                        <PESOCONTENEDORVACIO>' . $pesocontainer . '</PESOCONTENEDORVACIO>
                                        <MERCANCIAREMESA>' . $mercancia . '</MERCANCIAREMESA>
                                        <DESCRIPCIONCORTAPRODUCTO>' . $descripcion . '</DESCRIPCIONCORTAPRODUCTO>
                                        <CODTIPOIDREMITENTE>' . $tipodocrem . '</CODTIPOIDREMITENTE>
                                        <NUMIDREMITENTE>' . $docuremi . '</NUMIDREMITENTE>
                                        <CODSEDEREMITENTE>' . $valor_remesa['sede_remi'] . '</CODSEDEREMITENTE>
                                        <CODTIPOIDDESTINATARIO>' . $tipodoc . '</CODTIPOIDDESTINATARIO>
                                        <NUMIDDESTINATARIO>' . $docudesti . '</NUMIDDESTINATARIO>
                                        <CODSEDEDESTINATARIO>' . $valor_remesa['sede_desti'] . '</CODSEDEDESTINATARIO>
                                        <CODTIPOIDPROPIETARIO>' . $tipocli . '</CODTIPOIDPROPIETARIO>
                                        <NUMIDPROPIETARIO>' . $numdocume . '</NUMIDPROPIETARIO>
                                        <CODSEDEPROPIETARIO>' . $valor_remesa['idcliente'] . '</CODSEDEPROPIETARIO>
                                      </variables>';
            $xml_remesa_municipal .= '</root>';

            $result_remesa_municipal = $this->rndc_conexion($xml_remesa_municipal);
            // $xml = simplexml_load_string(utf8_decode($result_remesa_municipal));
            $xml_municipal = simplexml_load_string(mb_convert_encoding($result_remesa_municipal, 'UTF-8', 'ISO-8859-1'));
            $json_municipal = json_encode($xml_municipal);
            $result_municipal = json_decode($json_municipal, true);
            // LOG remesa y manifiesto
            if (isset($result_municipal['ErrorMSG'])) {
              $estado_rem = 0;
            } else {
              $estado_rem = 1;
            }
            $respuesta_transaccion = $this->_modelo->Remesa_Transmite(
              $valor_remesa['id'],
              $result_remesa_municipal,
              $estado_rem,
              $xml_remesa_municipal
            );
            if (isset($result_municipal['ErrorMSG'])) {
              $msg_error .= $result_municipal['ErrorMSG'];
              $data['status'] = 'false';
              $data['resultado'] = $msg_error;
              $estado_rem = 0;
              $remesa_rndc = $this->_modelo->Remesa_Rndc($valor_remesa['id'], $estado_rem);
              echo json_encode($data);
            } else {
              $rndc_ingresoid = $result_municipal['ingresoid'];
              $data['status'] = 'true';
              $data['resultado'] = $rndc_ingresoid;
              $estado_rem = 1;
              $remesa_rndc = $this->_modelo->Remesa_Rndc($valor_remesa['id'], $estado_rem); // estado remesa
              echo json_encode($data);
            }
          }
        } else {
          // Remesa de Viaje Nacional
          foreach ($rndc_remesa as $valor_remesa) {
            // homologar
            $valor_remesa['id_manifiesto'];
            $tipodoc = '';
            $tipodocrem = '';
            $tipocli = '';
            $numdocume = '';
            $pesocontainer = '';
            if ($valor_remesa['tipo_documento'] == 'NIT') {
              $tipodoc = 'N';
              $docudesti = ($valor_remesa['documento'] . $valor_remesa['digito_verificacion']);
            }
            if ($valor_remesa['tipo_documento'] == 'Cedula de Ciudadania') {
              $tipodoc = 'C';
              $docudesti = ($valor_remesa['documento']);
            }
            if ($valor_remesa['tipo_documento'] == 'Cedula de Extranjeria') {
              $tipodoc = 'E';
              $docudesti = ($valor_remesa['documento']);
            }
            if ($valor_remesa['tipo_documento_remi'] == 'NIT') {
              $tipodocrem = 'N';
              $docuremi = ($valor_remesa['documento_remi'] . $valor_remesa['digito_remi']);
            }
            if ($valor_remesa['tipo_documento_remi'] == 'Cedula de Ciudadania') {
              $tipodocrem = 'C';
              $docuremi = ($valor_remesa['documento_remi']);
            }
            if ($valor_remesa['tipo_documento_remi'] == 'Cedula de Extranjeria') {
              $tipodocrem = 'E';
              $docuremi = ($valor_remesa['documento_remi']);
            }
            if ($valor_remesa['td_cliente'] == 'Juridico') {
              $tipocli = 'N';
              $numdocume = ($valor_remesa['documento_cliente'] . $valor_remesa['digito_cliente']);
            }
            if ($valor_remesa['td_cliente'] == 'Natural') {
              $tipocli = 'C';
              $numdocume = ($valor_remesa['documento_cliente']);
            }
            // fecha pactada cargue
            $fecha_pt_cargue = date('d/m/Y', strtotime($valor_remesa['fecha_cargue']));
            $fecha_pt_descargue = date('d/m/Y', strtotime($valor_remesa['fecha_descargue']));

            // homologar tipo de operacion
            if ($valor_remesa['tipo_carga'] == 'G') { // general
              $descripcion = $valor_remesa['tipo_mercancia'];
              $mercancia = $valor_remesa['codigo'];
              $cantidad = $valor_remesa['cantidad_real_cargada'];
              $unidad = 1;
              $pesocontainer = '';
            }
            if ($valor_remesa['tipo_carga'] == 'P') { // paqueteo
              $descripcion = '009880';
              $mercancia = '009880';
              $cantidad = $valor_remesa['cantidad_real_cargada'];
              $unidad = 1;
              $pesocontainer = '';
            }
            if ($valor_remesa['tipo_carga'] == 'V') { // contenedor vacio
              $descripcion = '009990';
              $mercancia = '009990';
              $cantidad = 0;
              $unidad = '';
              if (
                $valor_remesa['pesocontenedor1'] != 0 || $valor_remesa['pesocontenedor1'] != '' || $valor_remesa['pesocontenedor1']
                !=
                null
              ) {
                $pesocontainer = $valor_remesa['pesocontenedor1'];
              } else if (
                $valor_remesa['pesocontenedor2'] != 0 ||
                $valor_remesa['pesocontenedor2'] != '' ||
                $valor_remesa['pesocontenedor2'] != 0
              ) {
                $pesocontainer = $valor_remesa['pesocontenedor2'];
              } else {
                $pesocontainer = 4100;
              }
              $pesocontainer = 4100;
            }
            if ($valor_remesa['tipo_carga'] == 'C') { // contenedor cargado
              $descripcion = $valor_remesa['tipo_mercancia'];
              $mercancia = $valor_remesa['codigo'];
              $cantidad = $valor_remesa['cantidad_real_cargada'];
              $pesocontainer = 4100;
              $unidad = 1;
            }

            $xml_remesa = '';
            $xml_remesa .= "<?xml version='1.0' encoding='ISO-8859-1'?>";
            $xml_remesa .= '<root>';
            $xml_remesa .= '<acceso>';
            $xml_remesa .= '<username>' . MINTRANS_USER . '</username>
                            <password>' . MINTRANS_PASS . '</password>';
            $xml_remesa .= '</acceso>';
            $xml_remesa .= '<solicitud>';
            $xml_remesa .= '<tipo>1</tipo>';
            $xml_remesa .= '<procesoid>3</procesoid>';
            $xml_remesa .= '</solicitud>';
            $xml_remesa .= '<variables>';
            $xml_remesa .= '<NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>';
            $xml_remesa .= '<CONSECUTIVOREMESA>' . $valor_remesa['id'] . '</CONSECUTIVOREMESA>';
            $xml_remesa .= '<CODOPERACIONTRANSPORTE>' . $valor_remesa['tipo_carga'] . '</CODOPERACIONTRANSPORTE>';
            $xml_remesa .= '<CODNATURALEZACARGA>' . $valor_remesa['naturaleza'] . '</CODNATURALEZACARGA>';
            $xml_remesa .= '<CANTIDADCARGADA>' . $cantidad . '</CANTIDADCARGADA>';
            $xml_remesa .= '<UNIDADMEDIDACAPACIDAD>' . $unidad . '</UNIDADMEDIDACAPACIDAD>';
            $xml_remesa .= '<CODTIPOEMPAQUE>' . $valor_remesa['tipo_empaque'] . '</CODTIPOEMPAQUE>';
            $xml_remesa .= '<PESOCONTENEDORVACIO>' . $pesocontainer . '</PESOCONTENEDORVACIO>';
            $xml_remesa .= '<MERCANCIAREMESA>' . $mercancia . '</MERCANCIAREMESA>';
            $xml_remesa .= '<DESCRIPCIONCORTAPRODUCTO>' . $descripcion . '</DESCRIPCIONCORTAPRODUCTO>';
            $xml_remesa .= '<CODTIPOIDREMITENTE>' . $tipodocrem . '</CODTIPOIDREMITENTE>';
            $xml_remesa .= '<NUMIDREMITENTE>' . $docuremi . '</NUMIDREMITENTE>';
            $xml_remesa .= '<CODSEDEREMITENTE>' . $valor_remesa['sede_remi'] . '</CODSEDEREMITENTE>';
            $xml_remesa .= '<CODTIPOIDDESTINATARIO>' . $tipodoc . '</CODTIPOIDDESTINATARIO>';
            $xml_remesa .= '<NUMIDDESTINATARIO>' . $docudesti . '</NUMIDDESTINATARIO>';
            $xml_remesa .= '<CODSEDEDESTINATARIO>' . $valor_remesa['sede_desti'] . '</CODSEDEDESTINATARIO>';
            $xml_remesa .= '<DUENOPOLIZA>E</DUENOPOLIZA>';
            $xml_remesa .= '<NUMPOLIZATRANSPORTE>3002055</NUMPOLIZATRANSPORTE>';
            $xml_remesa .= '<COMPANIASEGURO>8600024002</COMPANIASEGURO>';
            $xml_remesa .= '<FECHAVENCIMIENTOPOLIZACARGA>01/12/2022</FECHAVENCIMIENTOPOLIZACARGA>';
            $xml_remesa .= '<HORASPACTOCARGA>' . $valor_remesa['horaspactocarga'] . '</HORASPACTOCARGA>';
            $xml_remesa .= '<MINUTOSPACTOCARGA>' . $valor_remesa['minutospactocarga'] . '</MINUTOSPACTOCARGA>';
            $xml_remesa .= '<HORASPACTODESCARGUE>' . $valor_remesa['horaspactodescargue'] . '</HORASPACTODESCARGUE>';
            $xml_remesa .= '<MINUTOSPACTODESCARGUE>' . $valor_remesa['minutospactodescargue'] . '</MINUTOSPACTODESCARGUE>';
            $xml_remesa .= '<CODTIPOIDPROPIETARIO>' . $tipocli . '</CODTIPOIDPROPIETARIO>';
            $xml_remesa .= '<NUMIDPROPIETARIO>' . $numdocume . '</NUMIDPROPIETARIO>';
            $xml_remesa .= '<CODSEDEPROPIETARIO>' . $valor_remesa['idcliente'] . '</CODSEDEPROPIETARIO>';
            $xml_remesa .= '<FECHACITAPACTADACARGUE>' . $fecha_pt_cargue . '</FECHACITAPACTADACARGUE>';
            $xml_remesa .= '<HORACITAPACTADACARGUE>' . $valor_remesa['hora_cargue'] . '</HORACITAPACTADACARGUE>';
            $xml_remesa .= '<FECHACITAPACTADADESCARGUE>' . $fecha_pt_descargue . '</FECHACITAPACTADADESCARGUE>';
            $xml_remesa .= '<HORACITAPACTADADESCARGUEREMESA>' . $valor_remesa['hora_descarga'] . '</HORACITAPACTADADESCARGUEREMESA>';
            $xml_remesa .= '<PERMISOCARGAEXTRA></PERMISOCARGAEXTRA>';
            $xml_remesa .= '<NUMIDGPS></NUMIDGPS>';
            $xml_remesa .= '</variables>';
            $xml_remesa .= '</root>';

            $result_remesa = $this->rndc_conexion($xml_remesa);
            // $xml = simplexml_load_string(utf8_decode($result_remesa));
            $xml = simplexml_load_string(mb_convert_encoding($result_remesa, 'UTF-8', 'ISO-8859-1'));
            $json = json_encode($xml);
            $resultm = json_decode($json, true);
            // LOG remesa y manifiesto
            if (isset($resultm['ErrorMSG'])) {
              $estado_rem = 0;
            } else {
              $estado_rem = 1;
            }
            $respuesta_transaccion = $this->_modelo->Remesa_Transmite(
              $valor_remesa['id'],
              $result_remesa,
              $estado_rem,
              $xml_remesa
            );
            if (isset($resultm['ErrorMSG'])) {
              $msg_error .= $resultm['ErrorMSG'];
              $data['status'] = 'false';
              $data['resultado'] = $msg_error;
              $estado_rem = 0;
              $remesa_rndc = $this->_modelo->Remesa_Rndc($valor_remesa['id'], $estado_rem);
              echo json_encode($data);
            } else {
              $rndc_ingresoid = $resultm['ingresoid'];
              $data['status'] = 'true';
              $data['resultado'] = $rndc_ingresoid;
              $estado_rem = 1;
              $remesa_rndc = $this->_modelo->Remesa_Rndc($valor_remesa['id'], $estado_rem); // estado remesa
              echo json_encode($data);
            }
          }
        }
      }
    }
  }
  public function Retransmite_Manifiesto()
  {
    # echo "HOLA MHNDO DESDE AQUI DESDE RETRASMINTRI MANIFIESTO";
    $msg_error = '';
    $op = 2;
    $id = $_POST['id'];
    $proceso = $_POST['proceso'];
    $dato = $_POST['dato'];
    $filtro = $_POST['filtro'];
    $tipopro = $_POST['tipopro'];
    // consultar manifiesto NexosAPP
    $manifiesto = $this->_modelo->Consulta_Manifiesto($id);
    if ($manifiesto == true) {
      // consultar ministerio de transporte

      $resulta_rndc = $this->Consulta_Documento_Carga($op, $id, $proceso, $tipopro);

      $convierte_xml = new SimpleXMLElement($resulta_rndc);
      if ($convierte_xml->ErrorMSG[0]) {
        if ($convierte_xml->ErrorMSG[0] == 'Error RNDC11: Documento no encontrado.') {
        } else {
          // NO EXISTE
          // homologar datos
          $ptrailer = '';
          $fechaexpide = date('d/m/Y', strtotime($manifiesto[0]['fecha_expedicion']));
          $fechapago = date('d/m/Y', strtotime($manifiesto[0]['fecha_pago']));
          if ($manifiesto[0]['tipo_titular'] == 'Cedula de Ciudadania') {
            $tdoc_titular = 'C';
            $num_titular = ($manifiesto[0]['num_titular']);
          } else if ($manifiesto[0]['tipo_titular'] == 'Cedula de Extranjeria') {
            $tdoc_titular = 'E';
            $num_titular = ($manifiesto[0]['num_titular']);
          } else if ($manifiesto[0]['tipo_titular'] == 'NIT') {
            $tdoc_titular = 'N';
            $num_titular = ($manifiesto[0]['num_titular'] . $manifiesto[0]['digito_titular']);
          }
          if (
            $manifiesto[0]['placa_trailer'] != null && $manifiesto[0]['placa_trailer'] != '' && $manifiesto[0]['placa_trailer']
            !=
            null
          ) {
            $ptrailer = $manifiesto[0]['placa_trailer'];
          } else {
            $ptrailer = '';
          }
          if ($manifiesto[0]['tipo_conductor'] == 'Cedula de Ciudadania') {
            $tdoc_condu = 'C';
            $num_conductor = ($manifiesto[0]['num_conductor']);
          } else if ($manifiesto[0]['tipo_conductor'] == 'Cedula de Extranjeria') {
            $tdoc_condu = 'E';
            $num_conductor = ($manifiesto[0]['num_conductor']);
          } else if ($manifiesto[0]['tipo_conductor'] == 'NIT') {
            $tdoc_condu = 'N';
            $num_conductor = ($manifiesto[0]['num_conductor'] . $manifiesto[0]['digito_conductor']);
          }

          if ($manifiesto[0]['cargue_pagado'] == 1) {
            $pagocargue = 'E';
          } else if ($manifiesto[0]['cargue_pagado'] == 2) {
            $pagocargue = 'D';
          } else if ($manifiesto[0]['cargue_pagado'] == 3) {
            $pagocargue = 'R';
          } else if ($manifiesto[0]['cargue_pagado'] == 4) {
            $pagocargue = 'C';
          }

          if ($manifiesto[0]['descargue_pagado'] == 1) {
            $pagodescargue = 'E';
          } else if ($manifiesto[0]['descargue_pagado'] == 2) {
            $pagodescargue = 'D';
          } else if ($manifiesto[0]['descargue_pagado'] == 3) {
            $pagodescargue = 'R';
          } else if ($manifiesto[0]['descargue_pagado'] == 4) {
            $pagodescargue = 'C';
          }

          if ($manifiesto[0]['tipo_manifiesto'] == 1) {
            $operacion = 'G';
          } else if ($manifiesto[0]['tipo_manifiesto'] == 2) {
            $operacion = 'M';
          } else if ($manifiesto[0]['tipo_manifiesto'] == 3) {
            $operacion = 'W';
          } else if ($manifiesto[0]['tipo_manifiesto'] == 4) {
            $operacion = 'D';
          } else if ($manifiesto[0]['tipo_manifiesto'] == 8) {
            $operacion = 'I';
          }

          if ($manifiesto[0]['valor_anticipo'] != null) {
            if ($manifiesto[0]['tipo_titular'] == 'NIT' && $manifiesto[0]['num_titular'] == '900062596') {
              $municipio_pago = '11001000';
              $anticipo = str_replace(',', '', $manifiesto[0]['valor_anticipo']);
            } else {
              $municipio_pago = '11001000';
              $anticipo = str_replace(',', '', $manifiesto[0]['valor_anticipo']);
            }
          } else {
            $municipio_pago = '11001000';
            $anticipo = '0';
          }

          $flete = str_replace(',', '', $manifiesto[0]['valor_total_viaje']);

          $total_flete = (float) $flete;

          // Colocar la agencia de donde debe colocar el ICA
          if ($manifiesto[0]['agencia'] == 1) { // Bogota
            if ($manifiesto[0]['origen'] == 409) {
              $ica = '10';
            } else {
              $ica = '4.14';
            }
          } elseif ($manifiesto[0]['agencia'] == 2) { // Cartagena
            $ica = '8.56';
          } elseif ($manifiesto[0]['agencia'] == 4) { // Buenaventura
            $ica = '7';
          }

          // Convertir el valor a un número flotante
          $valor_numerico = (float) $anticipo;

          $xml_manifiesto = '';
          $xml_manifiesto .= "<?xml version='1.0' encoding='ISO-8859-1'?>";
          $xml_manifiesto .= '<root>';
          $xml_manifiesto .= '<acceso>';
          $xml_manifiesto .= '<username>' . MINTRANS_USER . '</username>
                              <password>' . MINTRANS_PASS . '</password>';
          $xml_manifiesto .= '</acceso>';
          $xml_manifiesto .= '<solicitud>';
          $xml_manifiesto .= '<tipo>1</tipo>';

          if ($manifiesto[0]['origen'] == $manifiesto[0]['destino']) {
            // VALORANTICIPOMANIFIESTO no existe para proceso 81
            if ($ptrailer == '') {
              $xml_manifiesto .= '<procesoid>81</procesoid>';
              $xml_manifiesto .= '</solicitud>';
              $xml_manifiesto .= '<variables>';
              $xml_manifiesto .= '<NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>';
              $xml_manifiesto .= '<CONSECUTIVOURBANO>' . $manifiesto[0]['id'] . '</CONSECUTIVOURBANO>';
              $xml_manifiesto .= '<FECHAEXPEDICION>' . $fechaexpide . '</FECHAEXPEDICION>';
              $xml_manifiesto .= '<CODOPERACIONTRANSPORTE>' . $operacion . '</CODOPERACIONTRANSPORTE>';
              $xml_manifiesto .= '<CODMUNICIPIO>' . $manifiesto[0]['origen'] . '</CODMUNICIPIO>';
              $xml_manifiesto .= '<CODIDTITULAR>' . $tdoc_titular . '</CODIDTITULAR>';
              $xml_manifiesto .= '<NUMIDTITULAR>' . $num_titular . '</NUMIDTITULAR>';
              $xml_manifiesto .= '<CODSEDETITULAR></CODSEDETITULAR>';
              $xml_manifiesto .= '<NUMPLACA>' . $manifiesto[0]['placa'] . '</NUMPLACA>';
              // $xml_manifiesto .= "<NUMPLACAREMOLQUE>" . $ptrailer . "</NUMPLACAREMOLQUE>";
              $xml_manifiesto .= '<CODIDCONDUCTOR>' . $tdoc_condu . '</CODIDCONDUCTOR>';
              $xml_manifiesto .= '<NUMIDCONDUCTOR>' . $num_conductor . '</NUMIDCONDUCTOR>';
              $xml_manifiesto .= '<VALORPACTADO>' . $total_flete . '</VALORPACTADO>';
              $xml_manifiesto .= '<FACTORICA>' . $ica . '</FACTORICA>';
              $xml_manifiesto .= '<CODRESPONSABLEPAGOCARGUE>' . $pagocargue . '</CODRESPONSABLEPAGOCARGUE>';
              $xml_manifiesto .= '<CODRESPONSABLEPAGODESCARGUE>' . $pagodescargue . '</CODRESPONSABLEPAGODESCARGUE>';
              $xml_manifiesto .= '<OBSERVACIONES>' . $manifiesto[0]['observacion'] . '</OBSERVACIONES>';
              $xml_manifiesto .= "<REMESAS procesoid='82'>";
              // consulta remesas que fueron transmitidas
              $remesas = $this->_modelo->Consulta_Remesa_Trans($id);
              if ($remesas) {
                foreach ($remesas as $valor_remesa) {
                  $xml_manifiesto .= '<REMESA>
                                        <REMESAURBANA>' . $valor_remesa['id_remesa'] . '</REMESAURBANA>
                                      </REMESA>';
                }
              }
              $xml_manifiesto .= '</REMESAS>';
              $xml_manifiesto .= '</variables>';
              $xml_manifiesto .= '</root>';
            } else {
              $xml_manifiesto .= '<procesoid>81</procesoid>';
              $xml_manifiesto .= '</solicitud>';
              $xml_manifiesto .= '<variables>';
              $xml_manifiesto .= '<NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>';
              $xml_manifiesto .= '<CONSECUTIVOURBANO>' . $manifiesto[0]['id'] . '</CONSECUTIVOURBANO>';
              $xml_manifiesto .= '<FECHAEXPEDICION>' . $fechaexpide . '</FECHAEXPEDICION>';
              $xml_manifiesto .= '<CODOPERACIONTRANSPORTE>' . $operacion . '</CODOPERACIONTRANSPORTE>';
              $xml_manifiesto .= '<CODMUNICIPIO>' . $manifiesto[0]['origen'] . '</CODMUNICIPIO>';
              $xml_manifiesto .= '<CODIDTITULAR>' . $tdoc_titular . '</CODIDTITULAR>';
              $xml_manifiesto .= '<NUMIDTITULAR>' . $num_titular . '</NUMIDTITULAR>';
              $xml_manifiesto .= '<CODSEDETITULAR></CODSEDETITULAR>';
              $xml_manifiesto .= '<NUMPLACA>' . $manifiesto[0]['placa'] . '</NUMPLACA>';
              $xml_manifiesto .= '<NUMPLACAREMOLQUE>' . $ptrailer . '</NUMPLACAREMOLQUE>';
              $xml_manifiesto .= '<CODIDCONDUCTOR>' . $tdoc_condu . '</CODIDCONDUCTOR>';
              $xml_manifiesto .= '<NUMIDCONDUCTOR>' . $num_conductor . '</NUMIDCONDUCTOR>';
              $xml_manifiesto .= '<VALORPACTADO>' . $total_flete . '</VALORPACTADO>';
              $xml_manifiesto .= '<FACTORICA>' . $ica . '</FACTORICA>';
              $xml_manifiesto .= '<CODRESPONSABLEPAGOCARGUE>' . $pagocargue . '</CODRESPONSABLEPAGOCARGUE>';
              $xml_manifiesto .= '<CODRESPONSABLEPAGODESCARGUE>' . $pagodescargue . '</CODRESPONSABLEPAGODESCARGUE>';
              $xml_manifiesto .= '<OBSERVACIONES>' . $manifiesto[0]['observacion'] . '</OBSERVACIONES>';
              $xml_manifiesto .= "<REMESAS procesoid='82'>";
              // consulta remesas que fueron transmitidas
              $remesas = $this->_modelo->Consulta_Remesa_Trans($id);
              if ($remesas) {
                foreach ($remesas as $valor_remesa) {
                  $xml_manifiesto .= '<REMESA>
                                        <REMESAURBANA>' . $valor_remesa['id_remesa'] . '</REMESAURBANA>
                                      </REMESA>';
                }
              }
              $xml_manifiesto .= '</REMESAS>';
              $xml_manifiesto .= '</variables>';
              $xml_manifiesto .= '</root>';
            }
          } else {
            $xml_manifiesto .= '<procesoid>4</procesoid>';
            $xml_manifiesto .= '</solicitud>';
            $xml_manifiesto .= '<variables>';
            $xml_manifiesto .= '<NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>';
            $xml_manifiesto .= '<NUMMANIFIESTOCARGA>' . $manifiesto[0]['id'] . '</NUMMANIFIESTOCARGA>';
            $xml_manifiesto .= '<CODOPERACIONTRANSPORTE>' . $operacion . '</CODOPERACIONTRANSPORTE>';
            $xml_manifiesto .= '<FECHAEXPEDICIONMANIFIESTO>' . $fechaexpide . '</FECHAEXPEDICIONMANIFIESTO>';
            $xml_manifiesto .= '<CODMUNICIPIOORIGENMANIFIESTO>' . $manifiesto[0]['origen'] . '</CODMUNICIPIOORIGENMANIFIESTO>';
            $xml_manifiesto .= '<CODMUNICIPIODESTINOMANIFIESTO>' . $manifiesto[0]['destino'] . '</CODMUNICIPIODESTINOMANIFIESTO>';
            $xml_manifiesto .= '<CODIDTITULARMANIFIESTO>' . $tdoc_titular . '</CODIDTITULARMANIFIESTO>';
            $xml_manifiesto .= '<NUMIDTITULARMANIFIESTO>' . $num_titular . '</NUMIDTITULARMANIFIESTO>';
            $xml_manifiesto .= '<NUMPLACA>' . $manifiesto[0]['placa'] . '</NUMPLACA>';
            $xml_manifiesto .= '<NUMPLACAREMOLQUE>' . $ptrailer . '</NUMPLACAREMOLQUE>';
            $xml_manifiesto .= '<CODIDCONDUCTOR>' . $tdoc_condu . '</CODIDCONDUCTOR>';
            $xml_manifiesto .= '<NUMIDCONDUCTOR>' . $num_conductor . '</NUMIDCONDUCTOR>';
            $xml_manifiesto .= '<VALORFLETEPACTADOVIAJE>' . $flete . '</VALORFLETEPACTADOVIAJE>';
            $xml_manifiesto .= '<RETENCIONICAMANIFIESTOCARGA>' . $ica . '</RETENCIONICAMANIFIESTOCARGA>';
            $xml_manifiesto .= '<RETENCIONFUENTEMANIFIESTO>' . $manifiesto[0]['retencion_fuente'] . '</RETENCIONFUENTEMANIFIESTO>';
            $xml_manifiesto .= '<VALORANTICIPOMANIFIESTO>' . $valor_numerico . '</VALORANTICIPOMANIFIESTO>';
            $xml_manifiesto .= '<FECHAPAGOSALDOMANIFIESTO>' . $fechapago . '</FECHAPAGOSALDOMANIFIESTO>';
            $xml_manifiesto .= '<CODRESPONSABLEPAGOCARGUE>' . $pagocargue . '</CODRESPONSABLEPAGOCARGUE>';
            $xml_manifiesto .= '<CODRESPONSABLEPAGODESCARGUE>' . $pagodescargue . '</CODRESPONSABLEPAGODESCARGUE>';
            $xml_manifiesto .= '<OBSERVACIONES>' . $manifiesto[0]['observacion'] . '</OBSERVACIONES>';
            $xml_manifiesto .= "<REMESASMAN procesoid='43'>";
            // consulta remesas que fueron transmitidas
            $remesas = $this->_modelo->Consulta_Remesa_Trans($id);
            if ($remesas) {
              foreach ($remesas as $valor_remesa) {
                $xml_manifiesto .= '<REMESA>
                                      <CONSECUTIVOREMESA>' . $valor_remesa['id_remesa'] . '</CONSECUTIVOREMESA>
                                    </REMESA>';
              }
            }
            $xml_manifiesto .= '</REMESASMAN>';
            $xml_manifiesto .= '<CODMUNICIPIOPAGOSALDO>' . $municipio_pago . '</CODMUNICIPIOPAGOSALDO>';
            $xml_manifiesto .= '<ACEPTACIONELECTRONICA>NO</ACEPTACIONELECTRONICA>';
            $xml_manifiesto .= '</variables>';
            $xml_manifiesto .= '</root>';
          }

          $result_manifiesto = $this->rndc_conexion($xml_manifiesto);
          // print_r($result_manifiesto);
          // $xml = simplexml_load_string(utf8_decode($result_manifiesto));
          $xml = simplexml_load_string(mb_convert_encoding($result_manifiesto, 'UTF-8', 'ISO-8859-1'));
          $json = json_encode($xml);
          $resultm = json_decode($json, true);
          // registro por etiqueta

          $manifi = $manifiesto[0]['id'];
          $user = '<username>' . MINTRANS_USER . '</username>';
          $clave = '<password>' . MINTRANS_PASS . '</password>';
          $tipo = 1;
          $proceso = 4;
          $nitempresa = '<NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>';
          $mnfcarga = '<NUMMANIFIESTOCARGA>' . $manifiesto[0]['id'] . '</NUMMANIFIESTOCARGA>';
          $operacion = '<CODOPERACIONTRANSPORTE>' . $operacion . '</CODOPERACIONTRANSPORTE>';
          $fecha = '<FECHAEXPEDICIONMANIFIESTO>' . $fechaexpide . '</FECHAEXPEDICIONMANIFIESTO>';
          $origen = '<CODMUNICIPIOORIGENMANIFIESTO>' . $manifiesto[0]['origen'] . '</CODMUNICIPIOORIGENMANIFIESTO>';
          $destino = '<CODMUNICIPIODESTINOMANIFIESTO>' . $manifiesto[0]['destino'] . '</CODMUNICIPIODESTINOMANIFIESTO>';
          $titular = '<CODIDTITULARMANIFIESTO>' . $tdoc_titular . '</CODIDTITULARMANIFIESTO>';
          $numtitular = '<NUMIDTITULARMANIFIESTO>' . $num_titular . '</NUMIDTITULARMANIFIESTO>';
          $placa = '<NUMPLACA>' . $manifiesto[0]['placa'] . '</NUMPLACA>';
          $remolque = '<NUMPLACAREMOLQUE>' . $ptrailer . '</NUMPLACAREMOLQUE>';
          $conductor = '<CODIDCONDUCTOR>' . $tdoc_condu . '</CODIDCONDUCTOR>';
          $numcondu = '<NUMIDCONDUCTOR>' . $num_conductor . '</NUMIDCONDUCTOR>';
          $flete = '<VALORFLETEPACTADOVIAJE>' . $manifiesto[0]['valor_total_viaje'] . '</VALORFLETEPACTADOVIAJE>';
          $rete = '<RETENCIONICAMANIFIESTOCARGA>4</RETENCIONICAMANIFIESTOCARGA>';
          $retefu = '<RETENCIONFUENTEMANIFIESTO>' . $manifiesto[0]['retencion_fuente'] . '</RETENCIONFUENTEMANIFIESTO>';
          $anti = '<VALORANTICIPOMANIFIESTO>' . $valor_numerico . '</VALORANTICIPOMANIFIESTO>';
          $fechapag = '<FECHAPAGOSALDOMANIFIESTO>' . $fechapago . '</FECHAPAGOSALDOMANIFIESTO>';
          $responcargue = '<CODRESPONSABLEPAGOCARGUE>' . $pagocargue . '</CODRESPONSABLEPAGOCARGUE>';
          $respondescargue = '<CODRESPONSABLEPAGODESCARGUE>' . $pagodescargue . '</CODRESPONSABLEPAGODESCARGUE>';
          $obs = '<OBSERVACIONES>' . $manifiesto[0]['observacion'] . '</OBSERVACIONES>';
          $pagosaldo = '<CODMUNICIPIOPAGOSALDO>' . $municipio_pago . '</CODMUNICIPIOPAGOSALDO>';
          $aceptacion = 'ACEPTACIONELECTRONICA>NO</ACEPTACIONELECTRONICA>';
          // manifiesto
          // remesas
          if ($remesas) {
            $cont = 0;
            $arrayremesa = array();
            foreach ($remesas as $valor_remesa) {
              $cont++;
              $remesa_xml = '<REMESA>
                                <CONSECUTIVOREMESA>' . $valor_remesa['id_remesa'] . '</CONSECUTIVOREMESA>
                            </REMESA>';
              $arrayremesa[$cont]['rem'] = $remesa_xml;
            }
            $remesa = $arrayremesa;
          }
          $this->registro = $this->_modelo->Registro_Etiqueta($manifi, $user, $clave, $tipo, $proceso, $nitempresa, $mnfcarga, $operacion, $fecha, $origen, $destino, $titular, $numtitular, $placa, $remolque, $conductor, $numcondu, $flete, $rete, $retefu, $anti, $fechapag, $responcargue, $respondescargue, $obs, $pagosaldo, $aceptacion, $remesa);
          // registro de la trazabilidad
          if (isset($resultm['ErrorMSG'])) {
            $status = 0;
          } else {
            $status = 1;
          }
          $this->registro2 = $this->_modelo->Registro_Trazabilidad($manifi, $xml_manifiesto, $result_manifiesto, $status);

          if (isset($resultm['ErrorMSG'])) {
            $msg_error .= $resultm['ErrorMSG'];
            $data['status'] = 'false';
            $data['resultado'] = $msg_error;
            $data['num_manifiesto'] = $manifiesto[0]['id'];
            echo json_encode($data);
          } else {
            $rndc_ingresoid = $resultm['ingresoid'];
            $data['status'] = 'true';
            $data['resultado'] = $rndc_ingresoid;
            $data['num_manifiesto'] = $manifiesto[0]['id'];
            // Actualizar numero de aprobacion
            $update_aprobacion = $this->_modelo->numero_aprobacion($manifiesto[0]['id'], $rndc_ingresoid);
            echo json_encode($data);
          }
        }
      } else {
        // homologar datos
        $ptrailer = '';
        $fechaexpide = date('d/m/Y', strtotime($manifiesto[0]['fecha_expedicion']));
        $fechapago = date('d/m/Y', strtotime($manifiesto[0]['fecha_pago']));
        if ($manifiesto[0]['tipo_titular'] == 'Cedula de Ciudadania') {
          $tdoc_titular = 'C';
          $num_titular = ($manifiesto[0]['num_titular']);
        } else if ($manifiesto[0]['tipo_titular'] == 'Cedula de Extranjeria') {
          $tdoc_titular = 'E';
          $num_titular = ($manifiesto[0]['num_titular']);
        } else if ($manifiesto[0]['tipo_titular'] == 'NIT') {
          $tdoc_titular = 'N';
          $num_titular = ($manifiesto[0]['num_titular'] . $manifiesto[0]['digito_titular']);
        }
        if (
          $manifiesto[0]['placa_trailer'] != null && $manifiesto[0]['placa_trailer'] != '' && $manifiesto[0]['placa_trailer']
          !=
          null
        ) {
          $ptrailer = $manifiesto[0]['placa_trailer'];
        } else {
          $ptrailer = '';
        }
        if ($manifiesto[0]['tipo_conductor'] == 'Cedula de Ciudadania') {
          $tdoc_condu = 'C';
          $num_conductor = ($manifiesto[0]['num_conductor']);
        } else if ($manifiesto[0]['tipo_conductor'] == 'Cedula de Extranjeria') {
          $tdoc_condu = 'E';
          $num_conductor = ($manifiesto[0]['num_conductor']);
        } else if ($manifiesto[0]['tipo_conductor'] == 'NIT') {
          $tdoc_condu = 'N';
          $num_conductor = ($manifiesto[0]['num_conductor'] . $manifiesto[0]['digito_conductor']);
        }

        if ($manifiesto[0]['cargue_pagado'] == 1) {
          $pagocargue = 'E';
        } else if ($manifiesto[0]['cargue_pagado'] == 2) {
          $pagocargue = 'D';
        } else if ($manifiesto[0]['cargue_pagado'] == 3) {
          $pagocargue = 'R';
        } else if ($manifiesto[0]['cargue_pagado'] == 4) {
          $pagocargue = 'C';
        }

        if ($manifiesto[0]['descargue_pagado'] == 1) {
          $pagodescargue = 'E';
        } else if ($manifiesto[0]['descargue_pagado'] == 2) {
          $pagodescargue = 'D';
        } else if ($manifiesto[0]['descargue_pagado'] == 3) {
          $pagodescargue = 'R';
        } else if ($manifiesto[0]['descargue_pagado'] == 4) {
          $pagodescargue = 'C';
        }

        if ($manifiesto[0]['tipo_manifiesto'] == 1) {
          $operacion = 'G';
        } else if ($manifiesto[0]['tipo_manifiesto'] == 2) {
          $operacion = 'M';
        } else if ($manifiesto[0]['tipo_manifiesto'] == 3) {
          $operacion = 'W';
        } else if ($manifiesto[0]['tipo_manifiesto'] == 4) {
          $operacion = 'D';
        } else if ($manifiesto[0]['tipo_manifiesto'] == 8) {
          $operacion = 'I';
        }

        if ($manifiesto[0]['valor_anticipo'] != null) {
          if ($manifiesto[0]['tipo_titular'] == 'NIT' && $manifiesto[0]['num_titular'] == '900062596') {
            $municipio_pago = '11001000';
            $anticipo = str_replace(',', '', $manifiesto[0]['valor_anticipo']);
          } else {
            $municipio_pago = '11001000';
            $anticipo = str_replace(',', '', $manifiesto[0]['valor_anticipo']);
          }
        } else {
          $municipio_pago = '11001000';
          $anticipo = '0';
        }

        $flete = str_replace(',', '', $manifiesto[0]['valor_total_viaje']);

        $total_flete = (float) $flete;

        // Colocar la agencia de donde debe colocar el ICA
        if ($manifiesto[0]['agencia'] == 1) { // Bogota
          $ica = '4.14';
        } elseif ($manifiesto[0]['agencia'] == 2) { // Cartagena
          $ica = '8.56';
        } elseif ($manifiesto[0]['agencia'] == 4) { // Buenaventura
          $ica = '7';
        }

        // Convertir el valor a un número flotante
        $valor_numerico = (float) $anticipo;

        $xml_manifiesto = '';
        $xml_manifiesto .= "<?xml version='1.0' encoding='ISO-8859-1'?>";
        $xml_manifiesto .= '<root>';
        $xml_manifiesto .= '<acceso>';
        $xml_manifiesto .= '<username>' . MINTRANS_USER . '</username>
                                      <password>' . MINTRANS_PASS . '</password>';
        $xml_manifiesto .= '</acceso>';
        $xml_manifiesto .= '<solicitud>';
        $xml_manifiesto .= '<tipo>1</tipo>';

        if ($manifiesto[0]['origen'] == $manifiesto[0]['destino']) {
          // VALORANTICIPOMANIFIESTO no existe para proceso 81
          if ($ptrailer == '') {
            $xml_manifiesto .= '<procesoid>81</procesoid>';
            $xml_manifiesto .= '</solicitud>';
            $xml_manifiesto .= '<variables>';
            $xml_manifiesto .= '<NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>';
            $xml_manifiesto .= '<CONSECUTIVOURBANO>' . $manifiesto[0]['id'] . '</CONSECUTIVOURBANO>';
            $xml_manifiesto .= '<FECHAEXPEDICION>' . $fechaexpide . '</FECHAEXPEDICION>';
            $xml_manifiesto .= '<CODOPERACIONTRANSPORTE>' . $operacion . '</CODOPERACIONTRANSPORTE>';
            $xml_manifiesto .= '<CODMUNICIPIO>' . $manifiesto[0]['origen'] . '</CODMUNICIPIO>';
            $xml_manifiesto .= '<CODIDTITULAR>' . $tdoc_titular . '</CODIDTITULAR>';
            $xml_manifiesto .= '<NUMIDTITULAR>' . $num_titular . '</NUMIDTITULAR>';
            $xml_manifiesto .= '<CODSEDETITULAR></CODSEDETITULAR>';
            $xml_manifiesto .= '<NUMPLACA>' . $manifiesto[0]['placa'] . '</NUMPLACA>';
            // $xml_manifiesto .= "<NUMPLACAREMOLQUE>" . $ptrailer . "</NUMPLACAREMOLQUE>";
            $xml_manifiesto .= '<CODIDCONDUCTOR>' . $tdoc_condu . '</CODIDCONDUCTOR>';
            $xml_manifiesto .= '<NUMIDCONDUCTOR>' . $num_conductor . '</NUMIDCONDUCTOR>';
            $xml_manifiesto .= '<VALORPACTADO>' . $total_flete . '</VALORPACTADO>';
            $xml_manifiesto .= '<FACTORICA>' . $ica . '</FACTORICA>';
            $xml_manifiesto .= '<CODRESPONSABLEPAGOCARGUE>' . $pagocargue . '</CODRESPONSABLEPAGOCARGUE>';
            $xml_manifiesto .= '<CODRESPONSABLEPAGODESCARGUE>' . $pagodescargue . '</CODRESPONSABLEPAGODESCARGUE>';
            $xml_manifiesto .= '<OBSERVACIONES>' . $manifiesto[0]['observacion'] . '</OBSERVACIONES>';
            $xml_manifiesto .= "<REMESAS procesoid='82'>";
            // consulta remesas que fueron transmitidas
            $remesas = $this->_modelo->Consulta_Remesa_Trans($id);
            if ($remesas) {
              foreach ($remesas as $valor_remesa) {
                $xml_manifiesto .= '<REMESA>
                                                <REMESAURBANA>' . $valor_remesa['id_remesa'] . '</REMESAURBANA>
                                              </REMESA>';
              }
            }
            $xml_manifiesto .= '</REMESAS>';
            $xml_manifiesto .= '</variables>';
            $xml_manifiesto .= '</root>';
          } else {
            $xml_manifiesto .= '<procesoid>81</procesoid>';
            $xml_manifiesto .= '</solicitud>';
            $xml_manifiesto .= '<variables>';
            $xml_manifiesto .= '<NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>';
            $xml_manifiesto .= '<CONSECUTIVOURBANO>' . $manifiesto[0]['id'] . '</CONSECUTIVOURBANO>';
            $xml_manifiesto .= '<FECHAEXPEDICION>' . $fechaexpide . '</FECHAEXPEDICION>';
            $xml_manifiesto .= '<CODOPERACIONTRANSPORTE>' . $operacion . '</CODOPERACIONTRANSPORTE>';
            $xml_manifiesto .= '<CODMUNICIPIO>' . $manifiesto[0]['origen'] . '</CODMUNICIPIO>';
            $xml_manifiesto .= '<CODIDTITULAR>' . $tdoc_titular . '</CODIDTITULAR>';
            $xml_manifiesto .= '<NUMIDTITULAR>' . $num_titular . '</NUMIDTITULAR>';
            $xml_manifiesto .= '<CODSEDETITULAR></CODSEDETITULAR>';
            $xml_manifiesto .= '<NUMPLACA>' . $manifiesto[0]['placa'] . '</NUMPLACA>';
            $xml_manifiesto .= '<NUMPLACAREMOLQUE>' . $ptrailer . '</NUMPLACAREMOLQUE>';
            $xml_manifiesto .= '<CODIDCONDUCTOR>' . $tdoc_condu . '</CODIDCONDUCTOR>';
            $xml_manifiesto .= '<NUMIDCONDUCTOR>' . $num_conductor . '</NUMIDCONDUCTOR>';
            $xml_manifiesto .= '<VALORPACTADO>' . $total_flete . '</VALORPACTADO>';
            $xml_manifiesto .= '<FACTORICA>' . $ica . '</FACTORICA>';
            $xml_manifiesto .= '<CODRESPONSABLEPAGOCARGUE>' . $pagocargue . '</CODRESPONSABLEPAGOCARGUE>';
            $xml_manifiesto .= '<CODRESPONSABLEPAGODESCARGUE>' . $pagodescargue . '</CODRESPONSABLEPAGODESCARGUE>';
            $xml_manifiesto .= '<OBSERVACIONES>' . $manifiesto[0]['observacion'] . '</OBSERVACIONES>';
            $xml_manifiesto .= "<REMESAS procesoid='82'>";
            // consulta remesas que fueron transmitidas
            $remesas = $this->_modelo->Consulta_Remesa_Trans($id);
            if ($remesas) {
              foreach ($remesas as $valor_remesa) {
                $xml_manifiesto .= '<REMESA>
                                                <REMESAURBANA>' . $valor_remesa['id_remesa'] . '</REMESAURBANA>
                                              </REMESA>';
              }
            }
            $xml_manifiesto .= '</REMESAS>';
            $xml_manifiesto .= '</variables>';
            $xml_manifiesto .= '</root>';
          }
        } else {
          $xml_manifiesto .= '<procesoid>4</procesoid>';
          $xml_manifiesto .= '</solicitud>';
          $xml_manifiesto .= '<variables>';
          $xml_manifiesto .= '<NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>';
          $xml_manifiesto .= '<NUMMANIFIESTOCARGA>' . $manifiesto[0]['id'] . '</NUMMANIFIESTOCARGA>';
          $xml_manifiesto .= '<CODOPERACIONTRANSPORTE>' . $operacion . '</CODOPERACIONTRANSPORTE>';
          $xml_manifiesto .= '<FECHAEXPEDICIONMANIFIESTO>' . $fechaexpide . '</FECHAEXPEDICIONMANIFIESTO>';
          $xml_manifiesto .= '<CODMUNICIPIOORIGENMANIFIESTO>' . $manifiesto[0]['origen'] . '</CODMUNICIPIOORIGENMANIFIESTO>';
          $xml_manifiesto .= '<CODMUNICIPIODESTINOMANIFIESTO>' . $manifiesto[0]['destino'] . '</CODMUNICIPIODESTINOMANIFIESTO>';
          $xml_manifiesto .= '<CODIDTITULARMANIFIESTO>' . $tdoc_titular . '</CODIDTITULARMANIFIESTO>';
          $xml_manifiesto .= '<NUMIDTITULARMANIFIESTO>' . $num_titular . '</NUMIDTITULARMANIFIESTO>';
          $xml_manifiesto .= '<NUMPLACA>' . $manifiesto[0]['placa'] . '</NUMPLACA>';
          $xml_manifiesto .= '<NUMPLACAREMOLQUE>' . $ptrailer . '</NUMPLACAREMOLQUE>';
          $xml_manifiesto .= '<CODIDCONDUCTOR>' . $tdoc_condu . '</CODIDCONDUCTOR>';
          $xml_manifiesto .= '<NUMIDCONDUCTOR>' . $num_conductor . '</NUMIDCONDUCTOR>';
          $xml_manifiesto .= '<VALORFLETEPACTADOVIAJE>' . $flete . '</VALORFLETEPACTADOVIAJE>';
          $xml_manifiesto .= '<RETENCIONICAMANIFIESTOCARGA>' . $ica . '</RETENCIONICAMANIFIESTOCARGA>';
          $xml_manifiesto .= '<RETENCIONFUENTEMANIFIESTO>' . $manifiesto[0]['retencion_fuente'] . '</RETENCIONFUENTEMANIFIESTO>';
          $xml_manifiesto .= '<VALORANTICIPOMANIFIESTO>' . $valor_numerico . '</VALORANTICIPOMANIFIESTO>';
          $xml_manifiesto .= '<FECHAPAGOSALDOMANIFIESTO>' . $fechapago . '</FECHAPAGOSALDOMANIFIESTO>';
          $xml_manifiesto .= '<CODRESPONSABLEPAGOCARGUE>' . $pagocargue . '</CODRESPONSABLEPAGOCARGUE>';
          $xml_manifiesto .= '<CODRESPONSABLEPAGODESCARGUE>' . $pagodescargue . '</CODRESPONSABLEPAGODESCARGUE>';
          $xml_manifiesto .= '<OBSERVACIONES>' . $manifiesto[0]['observacion'] . '</OBSERVACIONES>';
          $xml_manifiesto .= "<REMESASMAN procesoid='43'>";
          // consulta remesas que fueron transmitidas
          $remesas = $this->_modelo->Consulta_Remesa_Trans($id);
          if ($remesas) {
            foreach ($remesas as $valor_remesa) {
              $xml_manifiesto .= '<REMESA>
                                              <CONSECUTIVOREMESA>' . $valor_remesa['id_remesa'] . '</CONSECUTIVOREMESA>
                                            </REMESA>';
            }
          }
          $xml_manifiesto .= '</REMESASMAN>';
          $xml_manifiesto .= '<CODMUNICIPIOPAGOSALDO>' . $municipio_pago . '</CODMUNICIPIOPAGOSALDO>';
          $xml_manifiesto .= '<ACEPTACIONELECTRONICA>NO</ACEPTACIONELECTRONICA>';
          $xml_manifiesto .= '</variables>';
          $xml_manifiesto .= '</root>';
        }

        $result_manifiesto = $this->rndc_conexion($xml_manifiesto);
        // print_r($result_manifiesto);
        // $xml = simplexml_load_string(utf8_decode($result_manifiesto));
        $xml = simplexml_load_string(mb_convert_encoding($result_manifiesto, 'UTF-8', 'ISO-8859-1'));
        $json = json_encode($xml);
        $resultm = json_decode($json, true);
        // registro por etiqueta

        $manifi = $manifiesto[0]['id'];
        $user = '<username>' . MINTRANS_USER . '</username>';
        $clave = '<password>' . MINTRANS_PASS . '</password>';
        $tipo = 1;
        $proceso = 4;
        $nitempresa = '<NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>';
        $mnfcarga = '<NUMMANIFIESTOCARGA>' . $manifiesto[0]['id'] . '</NUMMANIFIESTOCARGA>';
        $operacion = '<CODOPERACIONTRANSPORTE>' . $operacion . '</CODOPERACIONTRANSPORTE>';
        $fecha = '<FECHAEXPEDICIONMANIFIESTO>' . $fechaexpide . '</FECHAEXPEDICIONMANIFIESTO>';
        $origen = '<CODMUNICIPIOORIGENMANIFIESTO>' . $manifiesto[0]['origen'] . '</CODMUNICIPIOORIGENMANIFIESTO>';
        $destino = '<CODMUNICIPIODESTINOMANIFIESTO>' . $manifiesto[0]['destino'] . '</CODMUNICIPIODESTINOMANIFIESTO>';
        $titular = '<CODIDTITULARMANIFIESTO>' . $tdoc_titular . '</CODIDTITULARMANIFIESTO>';
        $numtitular = '<NUMIDTITULARMANIFIESTO>' . $num_titular . '</NUMIDTITULARMANIFIESTO>';
        $placa = '<NUMPLACA>' . $manifiesto[0]['placa'] . '</NUMPLACA>';
        $remolque = '<NUMPLACAREMOLQUE>' . $ptrailer . '</NUMPLACAREMOLQUE>';
        $conductor = '<CODIDCONDUCTOR>' . $tdoc_condu . '</CODIDCONDUCTOR>';
        $numcondu = '<NUMIDCONDUCTOR>' . $num_conductor . '</NUMIDCONDUCTOR>';
        $flete = '<VALORFLETEPACTADOVIAJE>' . $manifiesto[0]['valor_total_viaje'] . '</VALORFLETEPACTADOVIAJE>';
        $rete = '<RETENCIONICAMANIFIESTOCARGA>4</RETENCIONICAMANIFIESTOCARGA>';
        $retefu = '<RETENCIONFUENTEMANIFIESTO>' . $manifiesto[0]['retencion_fuente'] . '</RETENCIONFUENTEMANIFIESTO>';
        $anti = '<VALORANTICIPOMANIFIESTO>' . $valor_numerico . '</VALORANTICIPOMANIFIESTO>';
        $fechapag = '<FECHAPAGOSALDOMANIFIESTO>' . $fechapago . '</FECHAPAGOSALDOMANIFIESTO>';
        $responcargue = '<CODRESPONSABLEPAGOCARGUE>' . $pagocargue . '</CODRESPONSABLEPAGOCARGUE>';
        $respondescargue = '<CODRESPONSABLEPAGODESCARGUE>' . $pagodescargue . '</CODRESPONSABLEPAGODESCARGUE>';
        $obs = '<OBSERVACIONES>' . $manifiesto[0]['observacion'] . '</OBSERVACIONES>';
        $pagosaldo = '<CODMUNICIPIOPAGOSALDO>' . $municipio_pago . '</CODMUNICIPIOPAGOSALDO>';
        $aceptacion = 'ACEPTACIONELECTRONICA>NO</ACEPTACIONELECTRONICA>';
        // manifiesto
        // remesas
        if ($remesas) {
          $cont = 0;
          $arrayremesa = array();
          foreach ($remesas as $valor_remesa) {
            $cont++;
            $remesa_xml = '<REMESA>
                                        <CONSECUTIVOREMESA>' . $valor_remesa['id_remesa'] . '</CONSECUTIVOREMESA>
                                    </REMESA>';
            $arrayremesa[$cont]['rem'] = $remesa_xml;
          }
          $remesa = $arrayremesa;
        }
        $this->registro = $this->_modelo->Registro_Etiqueta($manifi, $user, $clave, $tipo, $proceso, $nitempresa, $mnfcarga, $operacion, $fecha, $origen, $destino, $titular, $numtitular, $placa, $remolque, $conductor, $numcondu, $flete, $rete, $retefu, $anti, $fechapag, $responcargue, $respondescargue, $obs, $pagosaldo, $aceptacion, $remesa);
        // registro de la trazabilidad
        if (isset($resultm['ErrorMSG'])) {
          $status = 0;
        } else {
          $status = 1;
        }
        $this->registro2 = $this->_modelo->Registro_Trazabilidad($manifi, $xml_manifiesto, $result_manifiesto, $status);

        if (isset($resultm['ErrorMSG'])) {
          $msg_error .= $resultm['ErrorMSG'];
          $data['status'] = 'false';
          $data['resultado'] = $msg_error;
          $data['num_manifiesto'] = $manifiesto[0]['id'];
          echo json_encode($data);
        } else {
          $rndc_ingresoid = $resultm['ingresoid'];
          $data['status'] = 'true';
          $data['resultado'] = $rndc_ingresoid;
          $data['num_manifiesto'] = $manifiesto[0]['id'];
          // Actualizar numero de aprobacion
          $update_aprobacion = $this->_modelo->numero_aprobacion($manifiesto[0]['id'], $rndc_ingresoid);
          echo json_encode($data);
        }
      }
    } // cierre de validacion del manifiesto
  }

  // RETRANSMITIR CUMPLIDOS - remesa
  public function Retransmite_Cumplido_Rm()
  {
    $num_manifiesto = $_POST['num_manifiesto'];
    $proceso = $_POST['proceso'];
    $dato = $_POST['dato'];
    $filtro = $_POST['filtro'];
    $tipopro = $_POST['tipopro'];
    // consultar cumplido
    $cumplido = $this->_modelo2->Consulta_Cumplido_forrndc($num_manifiesto);

    if ($cumplido == true) {
      $arreglo = array();
      $m = 0;
      if ($cumplido[0]['origen_viaje'] == $cumplido[0]['destino_viaje']) {
        // code...
        foreach ($cumplido as $valor_cumplido) {
          $fechalleg = date('d/m/Y', strtotime($valor_cumplido['fecha_llegada']));
          $fechaent = date('d/m/Y', strtotime($valor_cumplido['fecha_entrada']));
          $fechasal = date('d/m/Y', strtotime($valor_cumplido['fecha_salida']));

          $horalleg = date('H:i', strtotime($valor_cumplido['hora_llegada']));
          $horaent = date('H:i', strtotime($valor_cumplido['hora_entrada']));
          $horasal = date('H:i', strtotime($valor_cumplido['hora_salida']));

          $fechallegc = date('d/m/Y', strtotime($valor_cumplido['fec_ca_lleg']));
          $fechaentc = date('d/m/Y', strtotime($valor_cumplido['fec_ca_ent']));
          $fechasalc = date('d/m/Y', strtotime($valor_cumplido['fec_ca_sal']));

          $horallegc = date('H:i', strtotime($valor_cumplido['fec_ca_hor']));
          $horaentc = date('H:i', strtotime($valor_cumplido['fec_ent_hor']));
          $horasalc = date('H:i', strtotime($valor_cumplido['fec_sal_hor']));

          $proceso = 5;
          $xml_cumplidore = '';
          $xml_cumplidore .= "<?xml version='1.0' encoding='ISO-8859-1'?>";
          $xml_cumplidore .= '<root>';
          $xml_cumplidore .= '<acceso>';
          $xml_cumplidore .= '<username>' . MINTRANS_USER . '</username>
                              <password>' . MINTRANS_PASS . '</password>';
          $xml_cumplidore .= '</acceso>';
          $xml_cumplidore .= '<solicitud>';
          $xml_cumplidore .= '<tipo>1</tipo>';
          $xml_cumplidore .= '<procesoid>' . $proceso . '</procesoid>';
          $xml_cumplidore .= '</solicitud>';
          $xml_cumplidore .= '<variables>';
          $xml_cumplidore .= '<NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>';
          $xml_cumplidore .= '<CONSECUTIVOREMESA>' . $valor_cumplido['idremesa'] . '</CONSECUTIVOREMESA>';
          $xml_cumplidore .= '<NUMMANIFIESTOCARGA>' . $valor_cumplido['manifiesto'] . '</NUMMANIFIESTOCARGA>';
          $xml_cumplidore .= '<TIPOCUMPLIDOREMESA>C</TIPOCUMPLIDOREMESA>';
          $xml_cumplidore .= '<CANTIDADCARGADA>' . $valor_cumplido['cantidad_real_cargada'] . '</CANTIDADCARGADA>';
          $xml_cumplidore .= '<CANTIDADENTREGADA>' . $valor_cumplido['cantidad_real_cargada'] . '</CANTIDADENTREGADA>';
          $xml_cumplidore .= '<UNIDADMEDIDACAPACIDAD>1</UNIDADMEDIDACAPACIDAD>';
          $xml_cumplidore .= '<FECHALLEGADACARGUE>' . $fechallegc . '</FECHALLEGADACARGUE>';
          $xml_cumplidore .= '<HORALLEGADACARGUEREMESA>' . $horallegc . '</HORALLEGADACARGUEREMESA>';
          $xml_cumplidore .= '<FECHAENTRADACARGUE>' . $fechaentc . '</FECHAENTRADACARGUE>';
          $xml_cumplidore .= '<HORAENTRADACARGUEREMESA>' . $horaentc . '</HORAENTRADACARGUEREMESA>';
          $xml_cumplidore .= '<FECHASALIDACARGUE>' . $fechasalc . '</FECHASALIDACARGUE>';
          $xml_cumplidore .= '<HORASALIDACARGUEREMESA>' . $horasalc . '</HORASALIDACARGUEREMESA>';
          $xml_cumplidore .= '<FECHALLEGADADESCARGUE>' . $fechalleg . '</FECHALLEGADADESCARGUE>';
          $xml_cumplidore .= '<HORALLEGADADESCARGUECUMPLIDO>' . $horalleg . '</HORALLEGADADESCARGUECUMPLIDO>';
          $xml_cumplidore .= '<FECHAENTRADADESCARGUE>' . $fechaent . '</FECHAENTRADADESCARGUE>';
          $xml_cumplidore .= '<HORAENTRADADESCARGUECUMPLIDO>' . $horaent . '</HORAENTRADADESCARGUECUMPLIDO>';
          $xml_cumplidore .= '<FECHASALIDADESCARGUE>' . $fechasal . '</FECHASALIDADESCARGUE>';
          $xml_cumplidore .= '<HORASALIDADESCARGUECUMPLIDO>' . $horasal . '</HORASALIDADESCARGUECUMPLIDO>';
          $xml_cumplidore .= '</variables>';
          $xml_cumplidore .= '</root>';

          $result_cumplido = $this->rndc_conexion($xml_cumplidore);
          // $xml = simplexml_load_string(utf8_decode($result_cumplido));
          $xml = simplexml_load_string(mb_convert_encoding($result_cumplido, 'UTF-8', 'ISO-8859-1'));

          $json = json_encode($xml);
          $resultm = json_decode($json, true);
          if (isset($resultm['ErrorMSG'])) {
            $estado_rem = 0;
          } else {
            $estado_rem = 1;
          }
          // respuesta de transaccion cumplido de remesa
          $respuesta_transaccion = $this->_modelo->Remesa_Transmite(
            $valor_cumplido['idremesa'],
            $result_cumplido,
            $estado_rem,
            $xml
          );
          $arreglo[$m] = $xml;
        }
        $m++;
      } else {
        // code...
        foreach ($cumplido as $valor_cumplido) {
          $fechalleg = date('d/m/Y', strtotime($valor_cumplido['fecha_llegada']));
          $fechaent = date('d/m/Y', strtotime($valor_cumplido['fecha_entrada']));
          $fechasal = date('d/m/Y', strtotime($valor_cumplido['fecha_salida']));

          $horalleg = date('H:i', strtotime($valor_cumplido['hora_llegada']));
          $horaent = date('H:i', strtotime($valor_cumplido['hora_entrada']));
          $horasal = date('H:i', strtotime($valor_cumplido['hora_salida']));

          $fechallegc = date('d/m/Y', strtotime($valor_cumplido['fec_ca_lleg']));
          $fechaentc = date('d/m/Y', strtotime($valor_cumplido['fec_ca_ent']));
          $fechasalc = date('d/m/Y', strtotime($valor_cumplido['fec_ca_sal']));

          $horallegc = date('H:i', strtotime($valor_cumplido['fec_ca_hor']));
          $horaentc = date('H:i', strtotime($valor_cumplido['fec_ent_hor']));
          $horasalc = date('H:i', strtotime($valor_cumplido['fec_sal_hor']));

          $proceso = 5;
          $xml_cumplidore = '';
          $xml_cumplidore .= "<?xml version='1.0' encoding='ISO-8859-1'?>";
          $xml_cumplidore .= '<root>';
          $xml_cumplidore .= '<acceso>';
          $xml_cumplidore .= '<username>' . MINTRANS_USER . '</username>
                              <password>' . MINTRANS_PASS . '</password>';
          $xml_cumplidore .= '</acceso>';
          $xml_cumplidore .= '<solicitud>';
          $xml_cumplidore .= '<tipo>1</tipo>';
          $xml_cumplidore .= '<procesoid>' . $proceso . '</procesoid>';
          $xml_cumplidore .= '</solicitud>';
          $xml_cumplidore .= '<variables>';
          $xml_cumplidore .= '<NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>';
          $xml_cumplidore .= '<CONSECUTIVOREMESA>' . $valor_cumplido['idremesa'] . '</CONSECUTIVOREMESA>';
          $xml_cumplidore .= '<NUMMANIFIESTOCARGA>' . $valor_cumplido['manifiesto'] . '</NUMMANIFIESTOCARGA>';
          $xml_cumplidore .= '<TIPOCUMPLIDOREMESA>C</TIPOCUMPLIDOREMESA>';
          $xml_cumplidore .= '<CANTIDADCARGADA>' . $valor_cumplido['cantidad_real_cargada'] . '</CANTIDADCARGADA>';
          $xml_cumplidore .= '<CANTIDADENTREGADA>' . $valor_cumplido['cantidad_real_cargada'] . '</CANTIDADENTREGADA>';
          $xml_cumplidore .= '<UNIDADMEDIDACAPACIDAD>1</UNIDADMEDIDACAPACIDAD>';
          $xml_cumplidore .= '<FECHALLEGADACARGUE>' . $fechallegc . '</FECHALLEGADACARGUE>';
          $xml_cumplidore .= '<HORALLEGADACARGUEREMESA>' . $horallegc . '</HORALLEGADACARGUEREMESA>';
          $xml_cumplidore .= '<FECHAENTRADACARGUE>' . $fechaentc . '</FECHAENTRADACARGUE>';
          $xml_cumplidore .= '<HORAENTRADACARGUEREMESA>' . $horaentc . '</HORAENTRADACARGUEREMESA>';
          $xml_cumplidore .= '<FECHASALIDACARGUE>' . $fechasalc . '</FECHASALIDACARGUE>';
          $xml_cumplidore .= '<HORASALIDACARGUEREMESA>' . $horasalc . '</HORASALIDACARGUEREMESA>';
          $xml_cumplidore .= '<FECHALLEGADADESCARGUE>' . $fechalleg . '</FECHALLEGADADESCARGUE>';
          $xml_cumplidore .= '<HORALLEGADADESCARGUECUMPLIDO>' . $horalleg . '</HORALLEGADADESCARGUECUMPLIDO>';
          $xml_cumplidore .= '<FECHAENTRADADESCARGUE>' . $fechaent . '</FECHAENTRADADESCARGUE>';
          $xml_cumplidore .= '<HORAENTRADADESCARGUECUMPLIDO>' . $horaent . '</HORAENTRADADESCARGUECUMPLIDO>';
          $xml_cumplidore .= '<FECHASALIDADESCARGUE>' . $fechasal . '</FECHASALIDADESCARGUE>';
          $xml_cumplidore .= '<HORASALIDADESCARGUECUMPLIDO>' . $horasal . '</HORASALIDADESCARGUECUMPLIDO>';
          $xml_cumplidore .= '</variables>';
          $xml_cumplidore .= '</root>';
          $result_cumplido = $this->rndc_conexion($xml_cumplidore);
          // $xml = simplexml_load_string(utf8_decode($result_cumplido));
          $xml = simplexml_load_string(mb_convert_encoding($result_cumplido, 'UTF-8', 'ISO-8859-1'));
          $json = json_encode($xml);
          $resultm = json_decode($json, true);
          if (isset($resultm['ErrorMSG'])) {
            $estado_rem = 0;
          } else {
            $estado_rem = 1;
          }
          // respuesta de transaccion cumplido de remesa
          $respuesta_transaccion = $this->_modelo->Remesa_Transmite(
            $valor_cumplido['idremesa'],
            $result_cumplido,
            $estado_rem,
            $xml
          );
          $arreglo[$m] = $xml;
        }
        $m++;
      }
    } else {
      echo 'no cumplido false';
    }
    echo json_encode($arreglo);
  }

  // RETRANSMITE CUMPLIDOS - manifiesto
  public function Retransmite_Cumplido_ma()
  {
    $msg_error = '';
    $id = $_POST['id']; // manifiesto
    $proceso = $_POST['proceso'];
    $dato = $_POST['dato'];
    $filtro = $_POST['filtro'];
    $tipopro = $_POST['tipopro'];
    // consultar cumplido NexosAPP
    $cumplido = $this->_modelo2->Consulta_Cumplido_Cu($id);
    if ($cumplido == true) {
      $fecha = date('d/m/Y');

      if ($cumplido['origen_viaje'] == $cumplido['destino_viaje']) { // Cumplido manifiesto municipal
        $xml_cumplido = '';
        $xml_cumplido .= '<?xml version="1.0" encoding="ISO-8859-1" ?>';
        $xml_cumplido .= '<root>';

        $xml_cumplido .= '<acceso>';
        $xml_cumplido .= '<username>' . MINTRANS_USER . '</username>';
        $xml_cumplido .= '<password>' . MINTRANS_PASS . '</password>';
        $xml_cumplido .= '</acceso>';
        $xml_cumplido .= '<solicitud>
                            <tipo>1</tipo>
                            <procesoid>79</procesoid>
                          </solicitud>';
        $xml_cumplido .= '
                        <variables>
                          <NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>
                          <CONSECUTIVOURBANO>' . $id . '</CONSECUTIVOURBANO>
                          <TIPOCUMPLIDO>C</TIPOCUMPLIDO>
                          <MOTIVOSSUSPENSION></MOTIVOSSUSPENSION>
                          <CONSECUENCIASUSPENSION></CONSECUENCIASUSPENSION>
                          <VALORADICIONALCARGUE>0</VALORADICIONALCARGUE>
                          <VALORADICIONALDESCARGUE>0</VALORADICIONALDESCARGUE>
                          <VALORADICIONAL>0</VALORADICIONAL>
                          <MOTIVOVALORADICIONAL></MOTIVOVALORADICIONAL>
                          <VALORDESCUENTO>0</VALORDESCUENTO>
                          <MOTIVOVALORDESCUENTO></MOTIVOVALORDESCUENTO>
                          <VALORSOBREANTICIPO>0</VALORSOBREANTICIPO>
                          <OBSERVACIONES></OBSERVACIONES>
                        </variables> ';
        $xml_cumplido .= '</root>';
      } else { // cumplido de otra denominacion
        $xml_cumplido = '';
        $xml_cumplido .= "<?xml version='1.0' encoding='ISO-8859-1'?>";
        $xml_cumplido .= '<root>';
        $xml_cumplido .= '';
        $xml_cumplido .= '<acceso>';
        $xml_cumplido .= '<username>' . MINTRANS_USER . '</username>
                          <password>' . MINTRANS_PASS . '</password>';
        $xml_cumplido .= '</acceso>';
        $xml_cumplido .= '<solicitud>';
        $xml_cumplido .= '<tipo>1</tipo>';
        $xml_cumplido .= '<procesoid>6</procesoid>';
        $xml_cumplido .= '</solicitud>';
        $xml_cumplido .= '<variables>';
        $xml_cumplido .= '<NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>';
        $xml_cumplido .= '<FECHAENTREGADOCUMENTOS>' . $fecha . '</FECHAENTREGADOCUMENTOS>';
        $xml_cumplido .= '<TIPOCUMPLIDOMANIFIESTO>C</TIPOCUMPLIDOMANIFIESTO>';
        $xml_cumplido .= '<NUMMANIFIESTOCARGA>' . $id . '</NUMMANIFIESTOCARGA>';
        $xml_cumplido .= '</variables>';
        $xml_cumplido .= '</root>';
      }

      $result_cumplido = $this->rndc_conexion($xml_cumplido);
      $xml = simplexml_load_string(mb_convert_encoding($result_cumplido, 'UTF-8', 'ISO-8859-1'));
      $json = json_encode($xml);
      $resultm = json_decode($json, true);
      if (isset($resultm['ErrorMSG'])) {
        $estado_cu = 0;
      } else {
        $estado_cu = 1;
      }
      $respuesta_transaccion = $this->_modelo->Cumplido_Transmite($id, $result_cumplido, $estado_cu, $xml);
      if (isset($resultm['ErrorMSG'])) {
        $msg_error .= $resultm['ErrorMSG'];
        $data['status'] = 'false';
        $data['resultado'] = $msg_error;
        $data['num_manifiesto'] = $id;
        $data['num_cumplido'] = $cumplido['id'];
        echo json_encode($data);
      } else {
        $rndc_ingresoid = $resultm['ingresoid'];
        $data['status'] = 'true';
        $data['resultado'] = $rndc_ingresoid;
        $data['num_manifiesto'] = $id;
        $data['num_cumplido'] = $cumplido['id'];
        // Actualizar numero de aprobacion
        // $update_aprobacion=$this->_modelo->numero_aprobacion_cu($manifiesto[0]['id'],$rndc_ingresoid);
        echo json_encode($data);
      }
    }
  }

  // RETRANSMISION DE CLIENTES
  public function Retransmite_Cliente()
  {
    $op = $_POST['dato'];
    $id = $_POST['id'];
    $tiptercero = $_POST['filtro'];
    $tipoproc = $_POST['tipopro'];
    $proceso = $_POST['proceso'];
    $tipdoc = $_POST['tipdoc'];
    $conduce = $_POST['conduce'];
    $rndc_tercero = $this->_modelo->Cliente_Ministerio($id);
    if ($rndc_tercero == true) {
      $tipodoc = '';
      $documento = '';
      if ($rndc_tercero[0]['tipo_documento'] == 'Juridico') {
        $tipodoc = 'N';
        $documento = $rndc_tercero[0]['documento'] . $rndc_tercero[0]['digito_verificacion'];
      } else {
        $tipodoc = 'C';
      }

      if ($rndc_tercero[0]['nombre_sede'] != '') {
        $sede = $rndc_tercero[0]['nombre_sede'];
      } else {
        $sede = $rndc_tercero[0]['municipio'];
      }

      $xml_tercero = '';
      $xml_tercero = "<?xml version='1.0' encoding='ISO-8859-1'?>";
      $xml_tercero .= '<root>';
      $xml_tercero .= '<acceso>';
      $xml_tercero .= '<username>' . MINTRANS_USER . '</username>
                       <password>' . MINTRANS_PASS . '</password>';
      $xml_tercero .= '</acceso>';
      $xml_tercero .= '<solicitud>';
      $xml_tercero .= '<tipo>1</tipo>';
      $xml_tercero .= '<procesoid>11</procesoid>';
      $xml_tercero .= '</solicitud>';
      $xml_tercero .= '<variables>';
      $xml_tercero .= '<NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>';
      $xml_tercero .= '<CODTIPOIDTERCERO>' . $tipodoc . '</CODTIPOIDTERCERO>';
      $xml_tercero .= '<NUMIDTERCERO>' . $documento . '</NUMIDTERCERO>';
      $xml_tercero .= '<NOMIDTERCERO>' . $rndc_tercero[0]['nombre'] . '</NOMIDTERCERO>';
      $xml_tercero .= '<NOMENCLATURADIRECCION>' . $rndc_tercero[0]['direccion'] . '</NOMENCLATURADIRECCION>';
      $xml_tercero .= '<CODMUNICIPIORNDC>' . $rndc_tercero[0]['rndc_codigo_ciudad'] . '</CODMUNICIPIORNDC>';
      $xml_tercero .= '<CODSEDETERCERO>' . $rndc_tercero[0]['id'] . '</CODSEDETERCERO>';
      $xml_tercero .= '<NOMSEDETERCERO>' . $sede . '</NOMSEDETERCERO>';
      $xml_tercero .= '</variables>';
      $xml_tercero .= '</root>';
      $result_tercero = $this->rndc_conexion($xml_tercero);
      // $xml = simplexml_load_string(utf8_decode($result_tercero));
      $xml = simplexml_load_string(mb_convert_encoding($result_tercero, 'UTF-8', 'ISO-8859-1'));
      $json = json_encode($xml);
      $resultm = json_decode($json, true);
      if (isset($resultm['ErrorMSG'])) { // LOG remesa y manifiesto
        $estado_rem = 0;
      } else {
        $estado_rem = 1;
      }
      $digito = $rndc_tercero[0]['digito_verificacion'];

      // Clientes
      $respuesta_transaccion = $this->_modelo->Estado_cliente_Rndc($id, $result_tercero, $estado_rem, $xml_tercero, $digito);

      /* if (isset($resultm["ErrorMSG"])) {
$vale = 0;
$sqlestado_rndc = "UPDATE cmx_clientes SET estado_actualizacion_rndc=" . $vale . " WHERE id=" . $rndc_tercero[0]["id"];
$res_estadorndc = $Data->ejecuteRegistro($sqlestado_rndc);

} else {
$vale = 1;
$sqlestado_rndc = "UPDATE cmx_clientes SET estado_actualizacion_rndc=" . $vale . " WHERE id=" . $rndc_tercero[0]["id"];
$res_estadorndc = $Data->ejecuteRegistro($sqlestado_rndc);
}*/

      if (isset($resultm['ErrorMSG'])) {
        $msg_error = $resultm['ErrorMSG'];
        $data['status'] = 'false';
        $data['resultado'] = $msg_error;
        $data['nombre'] = $rndc_tercero[0]['nombre'];
        echo json_encode($data);
      } else {
        $rndc_ingresoid = $resultm['ingresoid'];
        $data['status'] = 'true';
        $data['resultado'] = $rndc_ingresoid;
        $data['nombre'] = $rndc_tercero[0]['nombre'];
        // Actualizar numero de aprobacion

        echo json_encode($data);
      }
    }
  }

  // RETRANSMITE REMITENTES
  public function Retransmite_Remitente()
  {
    $op = $_POST['dato'];
    $id = $_POST['id'];
    $tiptercero = $_POST['filtro'];
    $tipoproc = $_POST['tipopro'];
    $proceso = $_POST['proceso'];
    $tipdoc = $_POST['tipdoc'];
    $conduce = $_POST['conduce'];
    $rndc_tercero = $this->_modelo->Remitente_Ministerio($id);
    if ($rndc_tercero) {
      $tipodoc = '';
      $documento = '';
      $nombre = '';
      $apellido1 = '';
      $apellido2 = '';
      if ($rndc_tercero[0]['tipo_documento'] == 'NIT') {
        $tipodoc = 'N';
        $documento = $rndc_tercero[0]['documento'] . $rndc_tercero[0]['digito_verificacion'];
        $nombre = $rndc_tercero[0]['nombre'];
      } else if ($rndc_tercero[0]['tipo_documento'] == 'Cedula de Ciudadania') {
        $tipodoc = 'C';
        $nombre = $rndc_tercero[0]['nombre'];
        $$apellido1 = $rndc_tercero[0][''];
      } else if ($rndc_tercero[0]['tipo_documento'] == 'Cedula de Extranjeria') {
        $tipodoc = 'E';
        $nombre = $rndc_tercero[0]['nombre'];
      }
      if ($rndc_tercero[0]['nombre_sede'] != '') {
        $sede = $rndc_tercero[0]['nombre_sede'];
      } else {
        $sede = $rndc_tercero[0]['municipio'];
      }
      $xml_tercero = '';
      $xml_tercero = "<?xml version='1.0' encoding='ISO-8859-1'?>";
      $xml_tercero .= '<root>';
      $xml_tercero .= '<acceso>';
      $xml_tercero .= '<username>' . MINTRANS_USER . '</username>
                       <password>' . MINTRANS_PASS . '</password>';
      $xml_tercero .= '</acceso>';
      $xml_tercero .= '<solicitud>';
      $xml_tercero .= '<tipo>1</tipo>';
      $xml_tercero .= '<procesoid>11</procesoid>';
      $xml_tercero .= '</solicitud>';
      $xml_tercero .= '<variables>';
      $xml_tercero .= '<NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>';
      $xml_tercero .= '<CODTIPOIDTERCERO>' . $tipodoc . '</CODTIPOIDTERCERO>';
      $xml_tercero .= '<NUMIDTERCERO>' . $documento . '</NUMIDTERCERO>';

      $xml_tercero .= '<NOMIDTERCERO>' . $rndc_tercero[0]['nombre'] . '</NOMIDTERCERO>';
      $xml_tercero .= '<PRIMERAPELLIDOIDTERCERO></PRIMERAPELLIDOIDTERCERO>';
      $xml_tercero .= '<SEGUNDOAPELLIDOIDTERCERO></SEGUNDOAPELLIDOIDTERCERO>';

      $xml_tercero .= '<NOMENCLATURADIRECCION>' . $rndc_tercero[0]['direccion'] . '</NOMENCLATURADIRECCION>';
      $xml_tercero .= '<CODMUNICIPIORNDC>' . $rndc_tercero[0]['rndc_codigo_ciudad'] . '</CODMUNICIPIORNDC>';
      $xml_tercero .= '<CODSEDETERCERO>' . $rndc_tercero[0]['codigo_sede'] . '</CODSEDETERCERO>';
      $xml_tercero .= '<NOMSEDETERCERO>' . $sede . '</NOMSEDETERCERO>';
      $xml_tercero .= '</variables>';
      $xml_tercero .= '</root>';
      $result_tercero = $this->rndc_conexion($xml_tercero);
      // $xml = simplexml_load_string(utf8_decode($result_tercero));
      $xml = simplexml_load_string(mb_convert_encoding($result_tercero, 'UTF-8', 'ISO-8859-1'));
      $json = json_encode($xml);
      $resultm = json_decode($json, true);
      if (isset($resultm['ErrorMSG'])) { // LOG remesa y manifiesto
        $estado_rem = 0;
      } else {
        $estado_rem = 1;
      }
      if (isset($resultm['ErrorMSG'])) {
        $msg_error .= $resultm['ErrorMSG'];
        $data['status'] = 'false';
        $data['resultado'] = $msg_error;
        $data['nombre'] = $rndc_tercero[0]['nombre'];
        echo json_encode($data);
      } else {
        $rndc_ingresoid = $resultm['ingresoid'];
        $data['status'] = 'true';
        $data['resultado'] = $rndc_ingresoid;
        $data['nombre'] = $rndc_tercero[0]['nombre'];
        // Actualizar numero de aprobacion
        // $update_aprobacion=$this->_modelo->numero_aprobacion_cu($manifiesto[0]['id'],$rndc_ingresoid);
        echo json_encode($data);
      }
    }
  }

  public function Retransmite_Tercero()
  {
    $op = $_POST['dato'];
    $id = $_POST['id'];
    $proceso = $_POST['proceso'];
    $filtro = $_POST['filtro'];
    $tipopro = $_POST['tipopro'];
    $rndc_tercero = $this->_modelo->Tercero_Ministerio($id);
    if ($rndc_tercero) {
      $nomsede = '';
      $codsede = '';
      $telefonofijo = '';
      $primerapellido = '';
      $segundoapellido = '';
      $celular = '';
      $categoria = '';
      $numlicencia = '';
      $numdoc = '';
      $tdoc = '';

      if ($rndc_tercero[0]['tipo_documento'] == 'NIT') {
        $nomsede = 'PRINCIPAL';
        $codsede = '1';
        $telefonofijo = $rndc_tercero[0]['contacto'];
        $documento = $rndc_tercero[0]['numero_documento'];
        $digito = $rndc_tercero[0]['digito_verificacion'];
        $numdoc = ($documento . $digito);
      }
      if ($rndc_tercero[0]['tipo_documento'] !== 'NIT') {
        $primerapellido = $rndc_tercero[0]['apellido1'];
        $segundoapellido = $rndc_tercero[0]['apellido2'];
        $celular = $rndc_tercero[0]['celular'];
        $numdoc = $rndc_tercero[0]['numero_documento'];
      }

      if ($rndc_tercero[0]['tipo_documento'] == 'Cedula de Ciudadania') {
        $tdoc = 'C';
      }
      if ($rndc_tercero[0]['tipo_documento'] == 'NIT') {
        $tdoc = 'N';
      }
      if ($rndc_tercero[0]['tipo_documento'] == 'Cedula de Extranjeria') {
        $tdoc = 'E';
      }
      if ($conduce == 1) {
        $categoria = $rndc_tercero[0]['rndc_categoria_licencia'];
        $numlicencia = $rndc_tercero[0]['rndc_numero_licencia'];
        $fechalicencia = $rndc_tercero[0]['flicencia_rndc'];
      } else {
        $fechalicencia = '';
      }

      $xml_tercero = '';
      $xml_tercero = "<?xml version='1.0' encoding='ISO-8859-1'?>";
      $xml_tercero .= '<root>';
      $xml_tercero .= '<acceso>';
      $xml_tercero .= '<username>' . MINTRANS_USER . '</username>
                       <password>' . MINTRANS_PASS . '</password>';
      $xml_tercero .= '</acceso>';
      $xml_tercero .= '<solicitud>';
      $xml_tercero .= '<tipo>1</tipo>';
      $xml_tercero .= '<procesoid>11</procesoid>';
      $xml_tercero .= '</solicitud>';
      $xml_tercero .= '<variables>';
      $xml_tercero .= '<NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>';
      $xml_tercero .= '<CODTIPOIDTERCERO>' . $tdoc . '</CODTIPOIDTERCERO>';
      $xml_tercero .= '<NUMIDTERCERO>' . $numdoc . '</NUMIDTERCERO>';
      $xml_tercero .= '<NOMIDTERCERO>' . $rndc_tercero[0]['nombre'] . '</NOMIDTERCERO>';
      $xml_tercero .= '<PRIMERAPELLIDOIDTERCERO>' . $primerapellido . '</PRIMERAPELLIDOIDTERCERO>';
      $xml_tercero .= '<SEGUNDOAPELLIDOIDTERCERO>' . $segundoapellido . '</SEGUNDOAPELLIDOIDTERCERO>';
      $xml_tercero .= '<NOMSEDETERCERO>' . $nomsede . '</NOMSEDETERCERO>';
      $xml_tercero .= '<CODSEDETERCERO>' . $codsede . '</CODSEDETERCERO>';
      $xml_tercero .= '<NUMTELEFONOCONTACTO>' . $telefonofijo . '</NUMTELEFONOCONTACTO>';
      $xml_tercero .= '<NUMCELULARPERSONA>' . $celular . '</NUMCELULARPERSONA>';
      $xml_tercero .= '<NOMENCLATURADIRECCION>' . $rndc_tercero[0]['direccion'] . '</NOMENCLATURADIRECCION>';
      $xml_tercero .= '<CODMUNICIPIORNDC>' . $rndc_tercero[0]['rndc_codigo_ciudad'] . '</CODMUNICIPIORNDC>';
      $xml_tercero .= '<NUMLICENCIACONDUCCION>' . $numlicencia . '</NUMLICENCIACONDUCCION>';
      $xml_tercero .= '<CODCATEGORIALICENCIACONDUCCION>' . $categoria . '</CODCATEGORIALICENCIACONDUCCION>';
      $xml_tercero .= '<FECHAVENCIMIENTOLICENCIA>' . $fechalicencia . '</FECHAVENCIMIENTOLICENCIA>';
      $xml_tercero .= '</variables>';
      $xml_tercero .= '</root>';
      $result_tercero = $this->rndc_conexion($xml_tercero);
      // $xml = simplexml_load_string(utf8_decode($result_tercero));
      $xml = simplexml_load_string(mb_convert_encoding($result_tercero, 'UTF-8', 'ISO-8859-1'));
      $json = json_encode($xml);
      $resultm = json_decode($json, true);
      if (isset($resultm['ErrorMSG'])) { // LOG remesa y manifiesto
        $estado_rem = 0;
      } else {
        $estado_rem = 1;
      }
      $accion = 'Actualizar';
      $estadoterg = 2;
      if (isset($resultm['ErrorMSG'])) {
        $msg_error .= $resultm['ErrorMSG'];
        $data['status'] = 'false';
        $data['resultado'] = $msg_error;
        $data['nombre'] = $rndc_tercero[0]['nombre'];
        $estadoterg = 0;
        $respuesta_trans2 = $this->_modelo->Transaccion_Nexos_Min($id, $xml_tercero, $result_tercero, $estadoterg, $accion);
        echo json_encode($data);
      } else {
        $rndc_ingresoid = $resultm['ingresoid'];
        $data['status'] = 'true';
        $data['resultado'] = $rndc_ingresoid;
        $data['nombre'] = $rndc_tercero[0]['nombre'];
        $estadoterg = 1;
        $respuesta_trans2 = $this->_modelo->Transaccion_Nexos_Min($id, $xml_tercero, $result_tercero, $estadoterg, $accion);
        echo json_encode($data);
      }
    }
  }

  public function Retransmite_Trailer()
  {
    $op = $_POST['dato'];
    $id = $_POST['id'];
    $proceso = $_POST['proceso'];
    $filtro = $_POST['filtro'];
    $tipopro = $_POST['tipopro'];
    $rndc_trailer = $this->_modelo->Trailer_Ministerio($id);
    if ($rndc_trailer == true) {
      if (
        $rndc_trailer[0]['rndc_configuracion'] == 64 ||
        $rndc_trailer[0]['rndc_configuracion'] == 74 ||
        $rndc_trailer[0]['rndc_configuracion'] == 85
      ) { // ejes
        if ($rndc_trailer[0]['rndc_configuracion'] == 64) {
          $ejes = 3;
        }
        if ($rndc_trailer[0]['rndc_configuracion'] == 74) {
          $ejes = 4;
        }
        if ($rndc_trailer[0]['rndc_configuracion'] == 85) {
          $ejes = 5;
        }
      } else {
        $ejes = '';
      }
      if ($rndc_trailer[0]['tdoc_poseedor'] == 'NIT') {
        $td_ten = 'N';
        $documento_tenedor = ($rndc_trailer[0]['doc_poseedor']
          . $rndc_trailer[0]['digito_poseedor']);
      } else if ($rndc_trailer[0]['tdoc_poseedor'] == 'Cedula de Ciudadania') {
        $td_ten = 'C';
        $documento_tenedor = $rndc_trailer[0]['doc_poseedor'];
      } else if ($rndc_trailer[0]['tdoc_poseedor'] == 'Cedula de Extranjeria') {
        $td_ten = 'E';
        $documento_tenedor = $rndc_trailer[0]['doc_poseedor'];
      }
      if ($rndc_trailer[0]['tdoc_propietario'] == 'NIT') {
        $td_prop = 'N';
        $documento_popietario = ($rndc_trailer[0]['doc_propietario']
          . $rndc_trailer[0]['digito_propietario']);
      } else if ($rndc_trailer[0]['tdoc_propietario'] == 'Cedula de Ciudadania') {
        $td_prop = 'C';
        $documento_popietario = $rndc_trailer[0]['doc_propietario'];
      } else if ($rndc_trailer[0]['tdoc_propietario'] == 'Cedula de Extranjeria') {
        $td_prop = 'E';
        $documento_popietario = $rndc_trailer[0]['doc_propietario'];
      }

      $xml_trailer = '';
      $xml_trailer .= "<?xml version='1.0' encoding='ISO-8859-1'?>";
      $xml_trailer .= '<root>';
      $xml_trailer .= '<acceso>';
      $xml_trailer .= '<username>' . MINTRANS_USER . '</username>
                       <password>' . MINTRANS_PASS . '</password>';
      $xml_trailer .= '</acceso>';
      $xml_trailer .= '<solicitud>';
      $xml_trailer .= '<tipo>1</tipo>';
      $xml_trailer .= '<procesoid>12</procesoid>';
      $xml_trailer .= '</solicitud>';
      $xml_trailer .= '<variables>';
      $xml_trailer .= '<NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>';
      $xml_trailer .= '<NUMPLACA>' . $id . '</NUMPLACA>';
      $xml_trailer .= '<CODCONFIGURACIONUNIDADCARGA>' . $rndc_trailer[0]['rndc_configuracion'] . '</CODCONFIGURACIONUNIDADCARGA>';
      $xml_trailer .= '<CODMARCAVEHICULOCARGA>' . $rndc_trailer[0]['rndc_marca'] . '</CODMARCAVEHICULOCARGA>';
      $xml_trailer .= '<NUMEJES>' . $ejes . '</NUMEJES>';
      $xml_trailer .= '<ANOFABRICACIONVEHICULOCARGA>' . $rndc_trailer[0]['modelo'] . '</ANOFABRICACIONVEHICULOCARGA>';
      $xml_trailer .= '<PESOVEHICULOVACIO>' . $rndc_trailer[0]['peso_vacio'] . '</PESOVEHICULOVACIO>';
      $xml_trailer .= '<CAPACIDADUNIDADCARGA>' . $rndc_trailer[0]['capacidad'] . '</CAPACIDADUNIDADCARGA>';
      $xml_trailer .= '<UNIDADMEDIDACAPACIDAD>KG</UNIDADMEDIDACAPACIDAD>';
      $xml_trailer .= '<CODTIPOCARROCERIA>' . $rndc_trailer[0]['rndc_carroceria'] . '</CODTIPOCARROCERIA>';
      $xml_trailer .= '<CODTIPOIDPROPIETARIO>' . $td_prop . '</CODTIPOIDPROPIETARIO>';
      $xml_trailer .= '<NUMIDPROPIETARIO>' . $documento_popietario . '</NUMIDPROPIETARIO>';
      $xml_trailer .= '<CODTIPOIDTENEDOR>' . $td_ten . '</CODTIPOIDTENEDOR>';
      $xml_trailer .= '<NUMIDTENEDOR>' . $documento_tenedor . '</NUMIDTENEDOR>';
      $xml_trailer .= '</variables>';
      $xml_trailer .= '</root>';
      $result_trailer = $this->rndc_conexion($xml_trailer);
      // $xml = simplexml_load_string(utf8_decode($result_trailer));
      $xml = simplexml_load_string(mb_convert_encoding($result_trailer, 'UTF-8', 'ISO-8859-1'));
      $json = json_encode($xml);
      $resultm = json_decode($json, true);
      if (isset($resultm['ErrorMSG'])) { // LOG remesa y manifiesto
        $estado_rem = 0;
      } else {
        $estado_rem = 1;
      }
      $accion = 'Actualizar';
      $estadoterg = 2;
      if (isset($resultm['ErrorMSG'])) {
        $msg_error .= $resultm['ErrorMSG'];
        $data['status'] = 'false';
        $data['resultado'] = $msg_error;
        $data['nombre'] = $rndc_trailer[0]['placa'];
        $estadoterg = 0;
        $respuesta_trans2 = $this->_modelo->Transaccion_Nexos_Min($id, $xml_trailer, $result_trailer, $estadoterg, $accion);
        echo json_encode($data);
      } else {
        $rndc_ingresoid = $resultm['ingresoid'];
        $data['status'] = 'true';
        $data['resultado'] = $rndc_ingresoid;
        $data['nombre'] = $rndc_trailer[0]['placa'];
        $estadoterg = 1;
        $respuesta_trans2 = $this->_modelo->Transaccion_Nexos_Min($id, $xml_trailer, $result_trailer, $estadoterg, $accion);
        echo json_encode($data);
      }
    }
  }

  public function Retransmite_Vehiculo()
  {
    $op = $_POST['dato'];
    $id = $_POST['id'];
    $proceso = $_POST['proceso'];
    $filtro = $_POST['filtro'];
    $tipopro = $_POST['tipopro'];
    $rndc_vehiculo = $this->_modelo->Vehiculo_Ministerio($id);
    if ($rndc_vehiculo == true) {
      // homologar datos
      if ($rndc_vehiculo[0]['tdoc_pro'] == 'Cedula de Ciudadania') {
        $tipodocumento_pro = 'C';
        $documento_popietario = ($rndc_vehiculo[0]['doc_pro']);
      } else if ($rndc_vehiculo[0]['tdoc_pro'] == 'Cedula de Extranjeria') {
        $tipodocumento_pro = 'E';
        $documento_popietario = ($rndc_vehiculo[0]['doc_pro']);
      } else if ($rndc_vehiculo[0]['tdoc_pro'] == 'NIT') {
        $tipodocumento_pro = 'N';
        $documento_popietario = ($rndc_vehiculo[0]['doc_pro'] . $rndc_vehiculo[0]['digito_prop']);
      }
      if ($rndc_vehiculo[0]['tdoc_ten'] == 'Cedula de Ciudadania') {
        $tipodocumento_ten = 'C';
        $documento_tenedor = ($rndc_vehiculo[0]['doc_ten']);
      } else if ($rndc_vehiculo[0]['tdoc_ten'] == 'Cedula de Extranjeria') {
        $tipodocumento_ten = 'E';
        $documento_tenedor = ($rndc_vehiculo[0]['doc_ten']);
      } else if ($rndc_vehiculo[0]['tdoc_ten'] == 'NIT') {
        $tipodocumento_ten = 'N';
        $documento_tenedor = ($rndc_vehiculo[0]['doc_ten'] . $rndc_vehiculo[0]['dig_posee']);
      }
      // CARROCERIA
      if (
        $rndc_vehiculo[0]['rndc_vehiculo'] == 53 ||
        $rndc_vehiculo[0]['rndc_vehiculo'] == 54 ||
        $rndc_vehiculo[0]['rndc_vehiculo'] == 55
      ) {
        $carroceria = '0'; // S.R.S
      } else {
        $carroceria = $rndc_vehiculo[0]['rndc_carroceria'];
      }
      // NUMERO DE EJES
      if (
        $rndc_vehiculo[0]['rndc_vehiculo'] == 55 ||
        $rndc_vehiculo[0]['rndc_id_trailer'] == 64 ||
        $rndc_vehiculo[0]['rndc_id_trailer'] == 74 ||
        $rndc_vehiculo[0]['rndc_id_trailer'] == 85
      ) {
        $numejes = '<NUMEJES>' . substr($rndc_vehiculo[0]['ccompleta'], 0) . '</NUMEJES>';
      } else {
        $numejes = '<NUMEJES></NUMEJES>';
      }
      // CAPACIDAD CARGA
      if (
        $rndc_vehiculo[0]['rndc_vehiculo'] == 50 ||
        $rndc_vehiculo[0]['rndc_vehiculo'] == 55 ||
        $rndc_vehiculo[0]['rndc_id_trailer'] == 64 ||
        $rndc_vehiculo[0]['rndc_id_trailer'] == 74 ||
        $rndc_vehiculo[0]['rndc_id_trailer'] == 85
      ) {
        $capacidad = $rndc_vehiculo[0]['capacidad_tn'];
      } else {
        $capacidad = $rndc_vehiculo[0]['capacidad_tn'];
      }
      // TIPO COMBUSTIBLE
      if ($rndc_vehiculo[0]['cod_tipo_combustible'] == 1) { // gasolina
        $combustion = 2;
      } else if ($rndc_vehiculo[0]['cod_tipo_combustible'] == 3) { // DIESEL
        $combustion = 1;
      } else if ($rndc_vehiculo[0]['cod_tipo_combustible'] == 12) { // ACPM
        $combustion = 1;
      } else if ($rndc_vehiculo[0]['cod_tipo_combustible'] == 4) { // GAS/GSOLINA
        $combustion = 4;
      } else if ($rndc_vehiculo[0]['cod_tipo_combustible'] == 13) { // GAS
        $combustion = 3;
      } else if ($rndc_vehiculo[0]['cod_tipo_combustible'] == 2) { // GNV
        $combustion = 3;
      } else if ($rndc_vehiculo[0]['cod_tipo_combustible'] == 5) { // ELECTRICO
        $combustion = 5;
      }

      $fecha_vence_soat = date('d/m/Y', strtotime($rndc_vehiculo[0]['vence_soat']));
      $xml_vehiculo = '';
      $xml_vehiculo .= "<?xml version='1.0' encoding='ISO-8859-1'?>";
      $xml_vehiculo .= '<root>';
      $xml_vehiculo .= '<acceso>';
      $xml_vehiculo .= '<username>' . MINTRANS_USER . '</username>
                        <password>' . MINTRANS_PASS . '</password>';
      $xml_vehiculo .= '</acceso>';
      $xml_vehiculo .= '<solicitud>';
      $xml_vehiculo .= '<tipo>1</tipo>';
      $xml_vehiculo .= '<procesoid>12</procesoid>';
      $xml_vehiculo .= '</solicitud>';
      $xml_vehiculo .= '<variables>';
      $xml_vehiculo .= '<NUMNITEMPRESATRANSPORTE>' . MINTRANS_NIT . '</NUMNITEMPRESATRANSPORTE>';
      $xml_vehiculo .= '<NUMPLACA>' . $rndc_vehiculo[0]['placa'] . '</NUMPLACA>';
      $xml_vehiculo .= '<CODCONFIGURACIONUNIDADCARGA>' . $rndc_vehiculo[0]['rndc_vehiculo'] . '</CODCONFIGURACIONUNIDADCARGA>';
      $xml_vehiculo .= '<CODMARCAVEHICULOCARGA>' . $rndc_vehiculo[0]['rndc_marca'] . '</CODMARCAVEHICULOCARGA>';
      $xml_vehiculo .= '<CODLINEAVEHICULOCARGA>' . $rndc_vehiculo[0]['rndc_linea'] . '</CODLINEAVEHICULOCARGA>';
      $xml_vehiculo .= $numejes;
      $xml_vehiculo .= '<ANOFABRICACIONVEHICULOCARGA>' . $rndc_vehiculo[0]['anio_fabricacion'] . '</ANOFABRICACIONVEHICULOCARGA>';
      $xml_vehiculo .= '<CODTIPOIDPROPIETARIO>' . $tipodocumento_pro . '</CODTIPOIDPROPIETARIO>';
      $xml_vehiculo .= '<NUMIDPROPIETARIO>' . $documento_popietario . '</NUMIDPROPIETARIO>';
      $xml_vehiculo .= '<CODTIPOIDTENEDOR>' . $tipodocumento_ten . '</CODTIPOIDTENEDOR>';
      $xml_vehiculo .= '<NUMIDTENEDOR>' . $documento_tenedor . '</NUMIDTENEDOR>';
      $xml_vehiculo .= '<CODTIPOCOMBUSTIBLE>' . $combustion . '</CODTIPOCOMBUSTIBLE>';
      $xml_vehiculo .= '<PESOVEHICULOVACIO>' . $rndc_vehiculo[0]['peso'] . '</PESOVEHICULOVACIO>';
      $xml_vehiculo .= '<CODCOLORVEHICULOCARGA>' . $rndc_vehiculo[0]['color'] . '</CODCOLORVEHICULOCARGA>';
      $xml_vehiculo .= '<CODTIPOCARROCERIA>' . $carroceria . '</CODTIPOCARROCERIA>';
      $xml_vehiculo .= '<NUMNITASEGURADORASOAT>' . $rndc_vehiculo[0]['rndc_aseguradora'] . '</NUMNITASEGURADORASOAT>';
      $xml_vehiculo .= '<FECHAVENCIMIENTOSOAT>' . $fecha_vence_soat . '</FECHAVENCIMIENTOSOAT>';
      $xml_vehiculo .= '<NUMSEGUROSOAT>' . $rndc_vehiculo[0]['num_soat'] . '</NUMSEGUROSOAT>';
      $xml_vehiculo .= '<CAPACIDADUNIDADCARGA>' . $capacidad . '</CAPACIDADUNIDADCARGA>';
      $xml_vehiculo .= '<UNIDADMEDIDACAPACIDAD>KG</UNIDADMEDIDACAPACIDAD>';
      $xml_vehiculo .= '</variables>';
      $xml_vehiculo .= '</root>';
      $result_vehiculo = $this->rndc_conexion($xml_vehiculo);
      // $xml = simplexml_load_string(utf8_decode($result_vehiculo));
      $xml = simplexml_load_string(mb_convert_encoding($result_vehiculo, 'UTF-8', 'ISO-8859-1'));
      $json = json_encode($xml);
      $resultm = json_decode($json, true);
      $tercerarg = '';
      $accion = 'Actualizar';
      $identifi = 'Vehiculo';
      $placa = $rndc_vehiculo[0]['placa'];
      if (isset($resultm['ErrorMSG'])) {
        $estadoterg = 0;
        $respuesta_trans2 = $this->_modelo->Transaccion_Nexos_Min2(
          $placa,
          $xml_vehiculo,
          $result_vehiculo,
          $estadoterg,
          $accion,
          $identifi
        );
        // $respuesta_trans2=$this->_modelo->Transaccion_Nexos_Min2($placa,$xml_vehiculo);
      } else {
        $estadoterg = 1;
        $respuesta_trans2 = $this->_modelo->Transaccion_Nexos_Min2(
          $placa,
          $xml_vehiculo,
          $result_vehiculo,
          $estadoterg,
          $accion,
          $identifi
        );
        // $respuesta_trans2=$this->_modelo->Transaccion_Nexos_Min2($placa,$xml_vehiculo);
      }

      if (isset($resultm['ErrorMSG'])) {
        $msg_error .= $resultm['ErrorMSG'];
        $data['status'] = 'false';
        $data['resultado'] = $msg_error;
        echo json_encode($data);
      } else {
        $rndc_ingresoid = $resultm['ingresoid'];
        $data['status'] = 'true';
        $data['resultado'] = $rndc_ingresoid;
        echo json_encode($data);
      }
    }
  }
}
