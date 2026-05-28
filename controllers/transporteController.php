<?php

class transporteController extends Controller
{
    private $_modelo;
    private $_modelo2;
    private $_guardar_asignacion;
    private $_validar_manifiesto;
    private $_listar_citas;
    private $_cancelar_cita;
    private $_buscar_cita;
    private $_confirmar_cita;
    private $dato;
    private $dato2;
    private $cliente;
    private $datomuni;
    private $nota;
    private $note;
    private $dat;
    private $doc;
    private $ord;
    private $dati;
    private $datu;
    private $fact;
    private $facto;
    private $facto2;
    private $subas;
    private $actuflete;
    private $valsuba;
    private $finsuba;
    private $valflete;
    private $docu;
    private $valide;
    private $datoplaca;
    private $rem;
    private $cum;
    private $cul;
    private $dator;
    private $conte;
    private $mconte;
    private $pdfcum;
    private $buscarr;
    private $op;
    private $datosolicitud;
    private $consultar_documento_manifiesto;
    private $insertar_precinto_documento;
    private $listar_precintos_tipo;

    public function __construct()
    {
        parent::__construct();
        //$this->$_modelo=$this->loadModel('transporte'); 
        $this->_modelo = $this->loadModel('transporte');
        $this->_modelo2 = $this->loadModel('cumplido');
    }

    public function index()
    {
        $prueba = $this->loadModel('transporte');
        $this->_view->prueba = $prueba;
        $this->_view->titulo = 'Solicitud de Servicio';
        $this->_view->renderizar('index', 'transporte');
    }

    public function subasta_flete()
    {
        $sub = $this->loadModel('transporte');
        $this->_view->sub = $sub;
        $this->_view->titulo = 'Subasta flete';
        $this->_view->renderizar('subasta_flete', 'transporte');
    }

    public function solo_subasta()
    {
        $subsola = $this->loadModel('transporte');
        $this->_view->sub = $subsola;
        $this->_view->titulo = 'Subasta';
        $this->_view->renderizar('solo_subasta', 'transporte');
    }

    public function orden_cargue()
    {
        $orden = $this->loadModel('transporte');
        $this->_view->orden = $orden;
        $this->_view->titulo = 'Orden de Cargue';
        //$this->getLibrary2('Nuevacarpeta'.DS.'tcpdf');
        $this->_view->renderizar('orden_cargue', 'transporte');
    }

    public function ver_orden()
    {
        $remesa = $this->loadModel('transporte');
        $this->_view->remesa = $remesa;
        $this->_view->titulo = 'Ordenes de cargue';
        $this->_view->renderizar('ver_orden', 'transporte');
    }

    public function remesa()
    {
        $remesa = $this->loadModel('transporte');
        $this->_view->remesa = $remesa;
        $this->_view->titulo = 'Remesa';
        $this->_view->renderizar('remesa_proceso', 'transporte');
    }


    public function ver_remesa()
    {
        $vremesa = $this->loadModel('transporte');
        $this->_view->vremesa = $vremesa;
        $this->_view->titulo = 'Ver Remesa';
        $this->_view->renderizar('ver_remesa', 'transporte');
    }

    //PUEDE TENER UN MODELO DIFERENTE
    public function manifiesto()
    {
        $mani = $this->loadModel('transporte');
        $this->_view->mani = $mani;
        $this->_view->titulo = 'Manifiesto';
        $this->_view->renderizar('manifiesto', 'transporte');
    }

    public function anticipos()
    {
        $anticipo = $this->loadModel('transporte');
        $this->_view->anticipo = $anticipo;
        $this->_view->titulo = 'Anticipo';
        $this->_view->renderizar('anticipos', 'transporte');
    }

    public function cumplido()
    {
        $cumplido = $this->loadModel('cumplido');
        $this->_view->cumplido = $cumplido;
        $this->_view->titulo = 'Cumplido';
        $this->_view->renderizar('cumplido', 'transporte');
    }

    public function cumplido_consulta()
    {
        $liquide = $this->loadModel('transporte');
        $this->_view->liquide = $liquide;
        $this->_view->titulo = 'Cumplidos';
        $this->_view->renderizar('cumplido_consulta', 'transporte');
    }

    /* Asignacion de citas */
    public function asigancion_cita()
    {
        $liquide = $this->loadModel('transporte');
        $this->_view->liquide = $liquide;
        $this->_view->titulo = 'Asignacion de Cita en puerto';
        $this->_view->renderizar('asignacion_cita', 'transporte');
    }

    public function gestion_precinto()
    {
        $liquide = $this->loadModel('transporte');
        // $this->_view->liquide = $liquide;
        $this->_view->titulo = 'Gestion de precintos para asignar';
        $this->_view->renderizar('gestion_precintos', 'transporte');
    }

    //REGISTRO DE ORDEN DE CARGA
    public function Seleccione_Placa()
    { //placas con estudio aprobado
        //instanciar el objeto del módelo
        $this->dato = $this->_modelo->prueba();
        echo json_encode($this->dato);
    }

    //DATOS PARAMETRICOS
    public function Consulta_Municipios()
    { //traer municipios
        $this->dato2 = $this->_modelo->consulte_munipios();
        echo json_encode($this->dato2);
    }

    public function Consulta_Cliente()
    {
        $id_servi = $_POST["id_servi"];
        $this->cliente = $this->_modelo->consulte_cliente($id_servi);
        echo json_encode($this->cliente);
    }

    public function Busque_Municipios()
    {
        $this->datomuni = $this->_modelo->Busqueda_lugares();
        //print_r($this->datomuni);
        echo json_encode($this->datomuni);
    }

    //DATOS PDE CONFORMACION DE ORDEN-CARGUE
    public function Datos_Placa_Seleccionada()
    {
        $placa_seleccionada = $_POST['eleccion_placa'];
        $this->dato = $this->_modelo->Datos_placa($placa_seleccionada);
        echo json_encode($this->dato);
    }

    public function Datos_solicitud_servicio()
    {
        $id_sol_servicio = $_POST["id_servicio"];
        $this->nota = $this->_modelo->Datos_servicio($id_sol_servicio);
        echo json_encode($this->nota);
    }

    public function Datos_remitentes()
    {
        $id_sol_servicio = $_POST["id_service"];
        $id_remite = $_POST["id_remi"];
        $this->note = $this->_modelo->Datos_remi_dest($id_sol_servicio, $id_remite);
        echo json_encode($this->note);
    }

    public function Datos_destinatario()
    {
        $id_servicio = $_POST["id_service"];
        $id_puntoremi = $_POST["id_puntoremi"];
        $this->doc = $this->_modelo->Dato_destino($id_servicio, $id_puntoremi);
        echo json_encode($this->doc);
    }

    public function Eliminar_Dato()
    {
        $id_remitente = $_POST["id"];
        $this->dat = $this->_modelo->Eliminar_Remitente($id_remitente);
        echo json_encode($this->dat);
    }

    public function Registro_orden()
    {
        $n_ordene = $_POST["n_ordene"];
        $idcliente = $_POST["idcliente"];
        $id_vehiculo = $_POST["id_vehiculo"];
        $id_trailer = $_POST["id_trailer"];
        $idconductor = $_POST["idconductor"];
        $pesovehiculo = $_POST["pesovehiculo"];
        $flete = $_POST["flete"];
        $fletepactado = $_POST["fletepactado"];
        $num_estudio = $_POST["num_estudio"];
        $num_servicio = $_POST["num_servicio"];
        $mercancia = $_POST["mercancia"];
        $empaque = $_POST["empaque"];
        $cant = $_POST["cant"];
        $peso_mer = $_POST["peso_mer"];
        $volumen = $_POST["volumen"];
        $cont1 = $_POST["cont1"];
        $cont2 = $_POST["cont2"];
        $condicionk = $_POST["condicionk"];
        $obscarga = $_POST["obsk"];
        $emabalajek = $_POST["emabalajek"];
        $pesok = $_POST["pesok"];
        $id_remitente = $_POST["id_remitente"];
        $id_puntorem = $_POST["id_puntorem"];

        $cnt_dias2 = $_POST["cnt_dias2"];
        $cnt_muni2 = $_POST["cnt_muni2"];
        $cnt_direccion = $_POST["cnt_direccion"];
        $cnt_tpo = $_POST["cnt_tpo"];
        $cnt_comodato = $_POST["cnt_comodato"];
        $cnt_vacio = $_POST["cnt_vacio"];

        $id_propietario = $_POST["id_propietario"];
        $id_tenedor = $_POST["id_tenedor"];
        $tarifapropuesta = $_POST["tarifapropuesta"];
        $id_subasta_flete = $_POST["id_subasta_flete"];
        $id_esubasta_flete = $_POST["id_esubasta_flete"];


        //datos del remitente para actualizar
        $dat = json_decode($_POST['datos']);
        //datos del remitente nuevos
        $renuevo = json_decode($_POST['renuevo']);
        //datos para actualizar el destinatario
        $actudesty = json_decode($_POST['actudesty']);
        //datos para insertar destinantarios nuevos
        $insertdes = json_decode($_POST['insertdes']);
        //datos para el precinto
        $precinto = json_decode($_POST['precinto']);

        $this->ord = $this->_modelo->Insertar_orden(
            $n_ordene,
            $idcliente,
            $id_vehiculo,
            $id_trailer,
            $idconductor,
            $pesovehiculo,
            $flete,
            $fletepactado,
            $num_estudio,
            $num_servicio,
            $mercancia,
            $empaque,
            $cant,
            $peso_mer,
            $volumen,
            $cont1,
            $cont2,
            $condicionk,
            $obscarga,
            $emabalajek,
            $pesok,
            $id_remitente,
            $id_puntorem,
            $dat,
            $renuevo,
            $actudesty,
            $insertdes,
            $precinto,
            $cnt_dias2,
            $cnt_muni2,
            $cnt_direccion,
            $cnt_tpo,
            $cnt_comodato,
            $cnt_vacio,
            $id_propietario,
            $id_tenedor,
            $tarifapropuesta,
            $id_subasta_flete,
            $id_esubasta_flete
        );
        //$vari=$this->redireccionar('orden_cargue');
        echo json_encode($this->ord);
    }


    //TABLA DE ORDEN DE CARGA
    public function Consulta_Ordenes()
    {
        $inicio = $_POST["finicia"];
        $final = $_POST["ffinal"];
        $cliente = $_POST["cliente"];
        $filtro = $_POST["filtro"];
        $this->dati = $this->_modelo->BuscarOrden($inicio, $final, $cliente, $filtro);
        echo json_encode($this->dati);
    }

    public function ConsultaCliente()
    {
        $this->dati = $this->_modelo->Consultar_Cliente();
        echo json_encode($this->dati);
    }

    //anular orden de cargue
    public function AnularOrden()
    {
        $numero_orden = $_POST["idorden"];
        $this->datu = $this->_modelo->AnularOrdenCargue($numero_orden);
        echo json_encode($this->datu);
    }

    public function ValidaAnulacionOrden()
    {
        $numero_orden = $_POST["idorden"];
        $this->datu = $this->_modelo->Valida_Anulacion($numero_orden);
        echo json_encode($this->datu);
    }

    //consultar orden de cargue
    public function ConsultaOrden()
    {
        $id = $_POST["numorden"];
        $this->fact = $this->_modelo->InquirirOrden($id);
        echo json_encode($this->fact);
    }

    public function ConsultaRemitente()
    {
        $id = $_POST["numorden"];
        $idorden = $_POST["idorden"];
        $this->facto = $this->_modelo->BuscarRemitente($id, $idorden);
        echo json_encode($this->facto);
    }

    public function ConsultaDestinatario()
    {
        $id = $_POST["numorden"];
        $idorden = $_POST["idorden"];
        $this->facto = $this->_modelo->BuscarDestinatarios($id, $idorden);
        echo json_encode($this->facto);
    }

    //Generar condulta para pdf en tabla de ordenes
    public function ConsultaPdfVer()
    {
        $id = $_POST["numeroorden"];
        $this->facto = $this->_modelo->Buscarordenpdf($id);
        $this->facto2 = $this->_modelo->Buscarprecipdf($id);
        $array = array($this->facto, $this->facto2);
        echo json_encode($array);
        //echo json_encode($this->facto,$this->facto2);
    }

    //SUBASTA

    public function Consultatbsubasta()
    {
        $dato = $_POST["dato"];
        $this->subas = $this->_modelo->Buscarsubasta($dato);
        echo json_encode($this->subas);
    }

    public function Consultaflete()
    {
        $numservice = $_POST["numservice"];
        $numsegu = $_POST["numsegu"];
        $this->subas = $this->_modelo->Buscarflete($numservice, $numsegu);
        echo json_encode($this->subas);
    }

    public function ActualizarFlete()
    {
        $idflete = $_POST["idflete"];
        $valor = $_POST["flete"];
        $this->actuflete = $this->_modelo->Actualiza_flete($idflete, $valor);
        echo json_encode($this->actuflete);
    }

    public function Validasubasta()
    {
        $idsuba = $_POST["idsuba"];
        $this->valsuba = $this->_modelo->Val_Subasta($idsuba);
        echo json_encode($this->valsuba);
    }


    public function Finalizarsubasta()
    {
        $idsuba = $_POST["idsuba"];
        $this->finsuba = $this->_modelo->Fin_Subasta($idsuba);
        echo json_encode($this->finsuba);
    }

    public function Validafletesub()
    { //validar el último estado del flete
        $dato = $_POST["dato"];
        $this->valflete = $this->_modelo->Validaestadof($dato);
        echo json_encode($this->valflete);
    }

    public function Consultasubasta()
    {
        $inicia = $_POST["fi"];
        $fin = $_POST["ff"];
        $this->docu = $this->_modelo->Consultarsubasta($inicia, $fin);
        echo json_encode($this->docu);
    }

    public function Consultasubasta2()
    {
        $filtro = $_POST["filtro"];
        $inicia = $_POST["fi"];
        $fin = $_POST["ff"];
        $placa = $_POST["placa"];
        $servicio = $_POST["servicio"];
        $this->docu = $this->_modelo->Consultarsubasta2($filtro, $inicia, $fin, $placa, $servicio);
        $this->datoplaca = $this->_modelo->Consulta_placas2($filtro, $inicia, $fin, $placa, $servicio);
        $this->datosolicitud = $this->_modelo->Consulta_solicitudes_Servicio($filtro, $inicia, $fin, $placa, $servicio);

        $array = array($this->docu, $this->datoplaca, $this->datosolicitud);
        echo json_encode($array);
    }

    public function Consulta_subasta_v()
    {
        $num_subasta = $_POST["id_subasta"];
        $this->docu = $this->_modelo->Consultarsubastat($num_subasta);
        echo json_encode($this->docu);
    }

    public function Consulta_subasta_vs()
    {
        $num_subasta = $_POST["id_subasta"];
        $this->docu = $this->_modelo->Consultarsubasta_servicio($num_subasta);
        echo json_encode($this->docu);
    }

    public function Valide_subasta()
    {
        $id_subasta = $_POST["id_subasta"];
        $this->docu = $this->_modelo->ValidarSubasta($id_subasta);
        echo json_encode($this->docu);
    }

    public function Cancelar_subasta()
    {
        $idflete = $_POST["idflete"];
        $id_subasta = $_POST["id_subasta"];
        $this->docu = $this->_modelo->CanceleSubasta($idflete, $id_subasta);
        if ($this->docu['success'] == true) {
            echo json_encode(['success' => $this->docu['success'], 'message' => $this->docu['message']]);
        } else {
            echo json_encode(['success' => $this->docu['success'], 'message' => $this->docu['message']]);
        }
    }

    public function Estado_estudio()
    {
        $id_subasta = $_POST["id_subasta"];
        $this->docu = $this->_modelo->Consulta_estado_estudio($id_subasta);
        echo json_encode($this->docu);
    }

    public function Consultar_fletes()
    {
        $id_subasta = $_POST["id_subasta"];
        $this->docu = $this->_modelo->Consulta_fletes($id_subasta);
        echo json_encode($this->docu);
    }

    public function Actualiza_Subasta()
    {
        $id_subasta = $_POST["id_subasta"];
        $id_flete = $_POST["id_flete"];
        $statu = $_POST["statu"];
        $placa = $_POST["placa"];
        $this->doc = $this->_modelo->Actualiza_subasta1($id_subasta, $id_flete, $statu, $placa);
        echo json_encode($this->doc);
    }

    public function Valida_Vigencia()
    {
        $num_estudio = $_POST["num_estudio"];
        $placa = $_POST["placa"];
        $this->valide = $this->_modelo->Valida_Vigencia_Estudio($num_estudio, $placa);
        echo json_encode($this->valide);
    }


    public function Consulta_aprobacion()
    {
        $idsubasta = $_POST["idsubasta"];
        $this->valide = $this->_modelo->Valida_aprobacion_flete($idsubasta);
        echo json_encode($this->valide);
    }

    //REMESA
    public function Seleccione_orden()
    {
        $this->dato2 = $this->_modelo->Consulta_orden_enremesa();
        echo json_encode($this->dato2);
    }

    public function Datos_Orden()
    {
        $idservicio = $_POST["servicio"];
        $this->dato = $this->_modelo->Consulta_dato_solicitud($idservicio);
        echo json_encode($this->dato);
    }

    public function Consulta_Vencimiento()
    {
        $num_estudio = $_POST["num_estudio"];
        $this->dato = $this->_modelo->Datos_sujetos_vencimiento($num_estudio);
        echo json_encode($this->dato);
    }

    public function Remitente_Destinata()
    {
        $idservicio = $_POST["servicio"];
        $this->dato = $this->_modelo->Consulta_rem_dest($idservicio);
        echo json_encode($this->dato);
    }

    public function Origen_Destino()
    {
        $idservicio = $_POST["servicio"];
        $this->dato = $this->_modelo->Consulta_origen_destino($idservicio);
        echo json_encode($this->dato);
    }


    public function Dato_remitente()
    {
        $id_servi = $_POST["servicio"];
        $remit = $_POST["remit"];
        $this->dato = $this->_modelo->Consulta_Remitente($id_servi, $remit);
        echo json_encode($this->dato);
    }

    public function Dato_Destinatario()
    {
        $id_servi = $_POST["servicio"];
        $remit = $_POST["remit"];
        $desti = $_POST["desti"];
        $this->dato = $this->_modelo->Consulta_Destinatario($id_servi, $remit, $desti);
        echo json_encode($this->dato);
    }

    public function Dato_vehiculo()
    {
        $orden = $_POST["orden"];
        $this->dato = $this->_modelo->Datos_vehiculo($orden);
        echo json_encode($this->dato);
    }

    public function precintos()
    {
        $orden = $_POST["orden"];
        $this->dato = $this->_modelo->Datos_precinto($orden);
        echo json_encode($this->dato);
    }

    //REMESA
    // Controlador TransporteController.php (ejemplo)
    public function Registro_remesa(): void
    {
        // Siempre respondemos JSON
        header('Content-Type: application/json; charset=utf-8');

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode([
                'status' => false,
                'error'  => 'Método no permitido',
            ]);
            return;
        }

        // 🔹 Validar campos mínimos requeridos
        $requiredFields = [
            'num_orden',
            'id_remite',
            'id_dest',
            'sol_servicio',
            'r_contado',
            'rcontra_remesa',
            'valor',
            'hcargue',
            'fcargue',
            'hdescarga',
            'fdescarga',
            'cantidad_real',
            // 'facturara',
            'fecha_creacion',
            'hora_creacion',
        ];

        foreach ($requiredFields as $field) {
            if (!isset($_POST[$field]) || $_POST[$field] === '') {
                echo json_encode([
                    'status' => false,
                    'error'  => "El campo '{$field}' es obligatorio.",
                ]);
                return;
            }
        }

        // 🔹 Sanitizar/castear datos
        $num_orden             = (int) $_POST["num_orden"];
        $id_remite             = (int) $_POST["id_remite"];
        $id_dest               = (int) $_POST["id_dest"];
        $sol_servicio          = (int) $_POST["sol_servicio"];
        $r_contado             = (int) $_POST["r_contado"];
        $rcontra_remesa        = (int) $_POST["rcontra_remesa"];
        $valor                 = (float) ($_POST["valor"] ?? 0);
        $seguro                = $_POST["seguro"] !== '' ? (float) $_POST["seguro"] : 0;
        $hcargue               = trim($_POST["hcargue"] ?? '');
        $fcargue               = trim($_POST["fcargue"] ?? '');
        $hdescarga             = trim($_POST["hdescarga"] ?? '');
        $fdescarga             = trim($_POST["fdescarga"] ?? '');
        $cantidad_real         = (int) ($_POST["cantidad_real"] ?? 0);
        $tipo_nove             = trim($_POST["tipo_nove"] ?? '');
        $desc_nove             = trim($_POST["desc_nove"] ?? '');
        $facturara             = trim($_POST["facturara"] ?? '');
        $fecha_creacion        = trim($_POST["fecha_creacion"] ?? '');
        $hora_creacion         = trim($_POST["hora_creacion"] ?? '');
        $nomarchivo            = trim($_POST["nomarchivo"] ?? '');
        $id_puntorem           = (int) ($_POST["id_puntorem"] ?? 0);
        $horaspactocargue      = (int) ($_POST["horaspactocargue"] ?? 0);
        $minutospactocargue    = (int) ($_POST["minutospactocargue"] ?? 0);
        $horaspactodescargue   = (int) ($_POST["horaspactodescargue"] ?? 0);
        $minutospactodescargue = (int) ($_POST["minutospactodescargue"] ?? 0);
        $obsercliente          = trim($_POST["obsercliente"] ?? '');
        $tarifa_remesa         = trim($_POST["tarifa_remesa"] ?? '');

        try {
            $resultado = $this->_modelo->Insertar_remesa(
                $num_orden,
                $id_remite,
                $id_dest,
                $sol_servicio,
                $r_contado,
                $rcontra_remesa,
                $valor,
                $seguro,
                $hcargue,
                $fcargue,
                $hdescarga,
                $fdescarga,
                $cantidad_real,
                $tipo_nove,
                $desc_nove,
                $facturara,
                $fecha_creacion,
                $hora_creacion,
                $nomarchivo,
                $id_puntorem,
                $horaspactocargue,
                $minutospactocargue,
                $horaspactodescargue,
                $minutospactodescargue,
                $obsercliente,
                $tarifa_remesa
            );

            // $resultado ya viene con [status, numero_documento, error]
            echo json_encode($resultado);
        } catch (Throwable $e) {
            error_log('Error en Registro_remesa: ' . $e->getMessage());

            echo json_encode([
                'status'           => false,
                'numero_documento' => null,
                'error'            => 'Error interno al registrar la remesa',
            ]);
        }
    }

    public function Subir_Archivo()
    {
        $idremesa = $_POST["numero_remesa"];
        $rutab = "public/files/remesa/" . $idremesa . "/";
        if (file_exists($rutab)) {
            for ($b = 0; $b < count($_FILES); $b++) {
                if (isset($_FILES["archivo_adjunto" . $b])) {
                    $file = $_FILES["archivo_adjunto" . $b];
                    $nombre = $file["name"];
                    $tipo = $file["type"];
                    $ruta_provisional = $file["tmp_name"];
                    $carpeta = $rutab;
                    $src = $carpeta . $nombre;
                    move_uploaded_file($ruta_provisional, $src);
                }
            }
        }
        $dato = true;
        echo json_encode($this->$dato);
    }

    public function Consulta_Remesas_TB()
    {
        $ini = $_POST["finicia"];
        $hasta = $_POST["ffinal"];
        $cliente = $_POST["cliente"];
        $filtro = $_POST["filtro"];
        $this->dator = $this->_modelo->Consulta_Remesatb($ini, $hasta, $cliente, $filtro);
        echo json_encode($this->dator);
    }


    public function ValidarRemesa()
    {
        $id_remesa = $_POST["id_remesa"];
        $this->dator = $this->_modelo->ValidaRemMan($id_remesa);
        echo json_encode($this->dator);
    }

    public function Consulta_Dato_Remesa()
    {
        $rem = $_POST["rem"];
        $ord = $_POST["ord"];
        $this->dat = $this->_modelo->ver_Remesa($rem, $ord);
        echo json_encode($this->dat);
    }

    public function ConsultaClienter()
    {
        $this->dat = $this->_modelo->Cliente_lista();
        echo json_encode($this->dat);
    }

    public function AnularRemesa()
    {
        $id_remesa = $_POST["id_remesa"];
        $this->dat = $this->_modelo->Anula_Remesa($id_remesa);
        echo json_encode($this->dat);
    }

    public function ActualizaRemesa()
    {
        $id_remesa = $_POST["id_remesa"];
        $seguro = $_POST["seguro"];
        $contad = $_POST["contado"];
        $contra = $_POST["contra"];
        $this->dat = $this->_modelo->Actualiza_Remesa($id_remesa, $seguro, $contad, $contra);
        echo json_encode($this->dat);
    }

    public function ConsultaPdf_Remesa()
    {
        $remesa = $_POST["remesa"];
        $orden = $_POST["orden"];
        $this->dat = $this->_modelo->Consulta_Remesapdf($remesa, $orden);
        echo json_encode($this->dat);
    }

    public function Consulta_IDR()
    {
        $idorden = $_POST["idorden"];
        $remit = $_POST["remit"];
        $dest = $_POST["dest"];
        $this->dat = $this->_modelo->Dato_Id_Remesa($idorden, $remit, $dest);
        echo json_encode($this->dat);
    }

    //CUMPLIDO
    public function Buscar_Mnf_Cumplido()
    {
        $this->dat = $this->_modelo2->Consulta_Manifiesto();
        echo json_encode($this->dat);
    }


    public function Manifiesto_Cumplido()
    {
        $idmanifi = $_POST["idmanifi"];
        $this->dat = $this->_modelo2->Datos_Manifiesto($idmanifi);
        echo json_encode($this->dat);
    }

    public function Ordenes_Cumplido()
    {
        $idmanifi = $_POST["idmanifi"];
        $this->dat = $this->_modelo2->Ordenes_Cumplido($idmanifi);
        echo json_encode($this->dat);
    }

    public function Remesas_Cumplido()
    {
        $idmanifi = $_POST["idmanifi"];
        $this->dat = $this->_modelo2->Remesa_Cumplido($idmanifi);
        echo json_encode($this->dat);
    }

    public function Registro_Cumplido()
    {
        $manifi = $_POST["manifi"];
        $placa = $_POST["placa"];
        $cantim = $_POST["cantim"];
        $tarim = $_POST["tarim"];
        $valorm = $_POST["valorm"];
        $remesa = json_decode($_POST['remesa']);
        $nove = $_POST["nove"];
        $this->cum = $this->_modelo2->Insertar_cumplido($manifi, $placa, $cantim, $tarim, $valorm, $remesa, $nove);
        echo json_encode($this->cum);
    }

    public function Consultar_Tabla()
    {
        $filtro = $_POST["filtro"];
        $num = $_POST["num"];
        $fec1 = $_POST["fec1"];
        $fec2 = $_POST["fec2"];
        $this->cul = $this->_modelo2->Buscar_Tabla($filtro, $num, $fec1, $fec2);
        echo json_encode($this->cul);
    }

    public function ConsultaCumplido()
    {
        $numma = $_POST["numma"];
        $this->cul = $this->_modelo2->Consulta_Cumplido($numma);
        echo json_encode($this->cul);
    }

    public function ConsultaRemesas()
    {
        $numcu = $_POST["numcu"];
        $this->cul = $this->_modelo2->Consulta_Remesas($numcu);
        echo json_encode($this->cul);
    }

    public function AnuleCumplido()
    {
        $numcu = $_POST["numcu"];
        $this->cum = $this->_modelo2->Revertir_cumplido($numcu);
        echo json_encode($this->cum);
    }

    public function Tipo_Contenedor()
    {
        $this->conte = $this->_modelo->Busca_Tipo_Contenedor();
        echo json_encode($this->conte);
    }

    public function Municipio_Contenedor()
    {
        $this->mconte = $this->_modelo->Municio_Contenedor();
        echo json_encode($this->mconte);
    }


    public function Consultar_Regla()
    { //consulta regla 
        $this->buscarr = $this->_modelo->Busca_Regla();
        echo json_encode($this->buscarr);
    }

    public function CumplidoPdf()
    {
        $idcumplido = $_POST["idcumplido"];
        $this->pdfcum = $this->_modelo2->CumplidoConsultar($idcumplido);
        $array = array($this->pdfcum);
        echo json_encode($array);
    }


    public function respuesta_operacion()
    {
        $subasta = $_POST["subasta"];
        $prop = $_POST["prop"];
        $tari = $_POST["tari"];
        $rent = $_POST["rent"];
        $util = $_POST["util"];
        $placa_gana = $_POST["placa"];
        $numsubasta = $_POST["numsubasta"];
        $this->op = $this->_modelo->respuesta_operaciones($subasta, $prop, $tari, $rent, $util, $placa_gana, $numsubasta);
        echo json_encode($this->op);
    }

    // Funciones ´para el asignamiento de citas en puerto 
    public function listar_citas()
    {
        $this->_listar_citas = $this->_modelo->Listar_citas_asignadas();
        echo json_encode($this->_listar_citas);
    }

    public function Validar_manifiesto()
    {
        $maniesto = $_POST["manifiesto"];
        $this->_validar_manifiesto = $this->_modelo->Validar_Numero_Manifiesto($maniesto);
        echo json_encode($this->_validar_manifiesto);
    }

    public function Guardar_asignacion()
    {
        $response = [];
        /* validaciones */
        if (empty($_POST["puerto"])) {
            $this->_guardar_asignacion = ['numero' => 400, 'titulo' => 'Advertencia', 'mensaje' => "Debe seleccionar un puerto", 'campo' => 'puerto'];
            echo json_encode($this->_guardar_asignacion);
            return;
        } elseif (empty($_POST["numero_cita"])) {
            $this->_guardar_asignacion = ['numero' => 400, 'titulo' => 'Advertencia', 'mensaje' => "Debe ingresar el nummero de la cita", 'campo' => 'numero_cita'];
            echo json_encode($this->_guardar_asignacion);
            return;
        } elseif (empty($_POST["fecha_cita"])) {
            $this->_guardar_asignacion = ['numero' => 400, 'titulo' => 'Advertencia', 'mensaje' => "Debe ingresar la fecha de la cita", 'campo' => 'fecha_cita'];
            echo json_encode($this->_guardar_asignacion);
            return;
        } elseif (empty($_POST["hora_cita"])) {
            $this->_guardar_asignacion = ['numero' => 400, 'titulo' => 'Advertencia', 'mensaje' => "Debe ingresar la hora de la cita", 'campo' => 'hora_cita'];
            echo json_encode($this->_guardar_asignacion);
            return;
        } elseif (empty($_POST["manifiesto"])) {
            $this->_guardar_asignacion = ['numero' => 400, 'titulo' => 'Advertencia', 'mensaje' => "Debe ingresar el manifiesto para la cita", 'campo' => 'manifiesto'];
            echo json_encode($this->_guardar_asignacion);
            return;
        } elseif (empty($_FILES["documento_cita"])) {
            $this->_guardar_asignacion = ['numero' => 400, 'titulo' => 'Advertencia', 'mensaje' => "Debe ingresar el documento de la cita", 'campo' => 'documento_cita'];
            echo json_encode($this->_guardar_asignacion);
            return;
        }

        /* Validar reglas de negocio*/
        $this->_validar_manifiesto = $this->_modelo->Validar_Manifiesto_Cita($_POST["manifiesto"]);
        if ($this->_validar_manifiesto) {
            $this->_guardar_asignacion = ['numero' => 400, 'titulo' => 'Advertencia', 'mensaje' => "El manifiesto ya se encuentra registrado en el sistema", 'campo' => 'manifiesto'];
            echo json_encode($this->_guardar_asignacion);
            return;
        }

        $datos = [
            "puerto" => $_POST["puerto"],
            "numero_cita" => $_POST["numero_cita"],
            "fecha_cita" => $_POST["fecha_cita"],
            "hora_cita" => $_POST["hora_cita"],
            "maniesto" => $_POST["manifiesto"],
            "documento_cita" => $_FILES["documento_cita"],
            "user" =>  $_SESSION["usuario"]["nom_usuario"],
            "fecha" =>  date('Y-m-d'),
            "hora" =>  date('H:i:s'),
            "estado" => 'ACTIVO',
        ];

        $this->_guardar_asignacion = $this->_modelo->Asignar_citas($datos);
        if ($this->_guardar_asignacion) {
            $response = ['numero' => 200, 'titulo' => 'Exito', 'mensaje' => "Cita registra con exito en el sistema"];
        } else {
            $response = ['numero' => 400, 'titulo' => 'Error', 'mensaje' => "Cita no registra con exito en el sistema"];
        }
        echo json_encode($response);
    }


    public function Confirmar_Cita()
    {
        $response = [];
        $num_cita = $_POST["num_cita"];
        $this->_confirmar_cita = $this->_modelo->Confirmar_Cita_Puertos($num_cita);
        if ($this->_confirmar_cita) {
            $response = ['numero' => 200, 'titulo' => 'Exito', 'mensaje' => "Cita Confirmada en el sistema"];
        } else {
            $response = ['numero' => 400, 'titulo' => 'Error', 'mensaje' => "Cita no Confirmada en el sistema"];
        }
        echo json_encode($response);
    }

    function Cancelar_cita()
    {
        $response = [];
        $num_cita = $_POST["num_cita"];
        $this->_cancelar_cita = $this->_modelo->Cancelar_Cita_Puerto($num_cita);
        if ($this->_cancelar_cita) {
            $response = ['numero' => 200, 'titulo' => 'Exito', 'mensaje' => "Cita cancela en el sistema"];
        } else {
            $response = ['numero' => 400, 'titulo' => 'Error', 'mensaje' => "Cita no cancelada en el sistema"];
        }
        echo json_encode($response);
    }
    function Vencer_cita()
    {
        $response = [];
        $num_cita = $_POST["num_cita"];
        $this->_cancelar_cita = $this->_modelo->Vencer_Cita_Puerto($num_cita);
        if ($this->_cancelar_cita) {
            $response = ['numero' => 200, 'titulo' => 'Exito', 'mensaje' => "Cita cancela en el sistema"];
        } else {
            $response = ['numero' => 400, 'titulo' => 'Error', 'mensaje' => "Cita no cancelada en el sistema"];
        }
        echo json_encode($response);
    }

    public function buscar_citas()
    {
        $tipo = $_POST["tipo"];
        $buscador = $_POST["buscador"];
        if ($tipo == 'cita') {
            $this->_buscar_cita = $this->_modelo->Buscar_cita_numero($buscador);
            echo json_encode($this->_buscar_cita);
        } else if ($tipo == 'manifiesto') {
            $this->_buscar_cita = $this->_modelo->Buscar_cita_manifiesto($buscador);
            echo json_encode($this->_buscar_cita);
        } else {
            $this->_buscar_cita = $this->_modelo->Listar_citas_asignadas();
            echo json_encode($this->_buscar_cita);
        }
    }

    public function Consultar_Precintos()
    {
        $Agencia = $_POST['Agencia'];
        $Cliente = $_POST['Cliente'];
        $this->_buscar_cita = $this->_modelo->Listar_Precintos_Disponibles($Agencia, $Cliente);
        echo json_encode($this->_buscar_cita);
    }

    public function consultar_documento_manifiesto()
    {
        $fecha_inicial = $_POST['fecha_inicial'] ?? null;
        $fecha_final = $_POST['fecha_final'] ?? null;
        $num_criterio = $_POST['num_criterio'] ?? null;
        $this->consultar_documento_manifiesto = $this->_modelo->Listar_Documento_precintos($fecha_inicial, $fecha_final, $num_criterio);
        echo json_encode($this->consultar_documento_manifiesto);
    }

    public function insertar_precintos_documento()
    {
        $precintos = json_decode($_POST['precintos']);
        $Ordenescargue = $_POST['Ordenescargue'];
        $this->insertar_precinto_documento = $this->_modelo->Actualizar_documento_precinto($precintos, $Ordenescargue);
        echo json_encode($this->insertar_precinto_documento);
    }


    public function Listar_Precintos()
    {
        $Tipo_Precinto = $_POST['Tipo_Precinto'] ?? null;
        $Agencia = $_POST['Agencia'] ?? null;
        $this->listar_precintos_tipo = $this->_modelo->Listar_Tipo_Precintos($Tipo_Precinto, $Agencia);
        echo json_encode($this->listar_precintos_tipo);
    }
}
