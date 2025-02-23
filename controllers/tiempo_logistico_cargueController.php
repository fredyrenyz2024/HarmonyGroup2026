<?php
class tiempo_logistico_cargueController extends Controller
{
    private $_modelo;
    private $_verificar_tiempos;
    private $_validar_orden_cargue;
    private $dato2;
    private $timecargue;

    public function __construct()
    {
        parent::__construct();
        //$this->$_modelo=$this->loadModel('transporte');
        $this->_modelo = $this->loadModel('tiempo_cargue');
    }

    public function index()
    {
        $prueba = $this->loadModel('tiempo_cargue');
        $this->_view->prueba = $prueba;
        $subtitulo = '<br><span class="detail-description">
			<h5>
			Tráfico -> Control ruta -> Crear tiempos cargue
			</h5>
			</span>';
        $this->_view->titulo = 'Tiempos cargue' . $subtitulo;
        $this->_view->renderizar('tiempocargue', 'tiempos_logisticos_cargue');
    }

    public function tiempo_cargue()
    {
        $nombre = $this->loadModel('tiempo_cargue');
        $this->_view->cargar = $cargar;
        $subtitulo = '<br><span class="detail-description">
			<h5>
			Tráfico -> Control ruta -> Tiempos cargue
			</h5>
			</span>';
        $this->_view->titulo = 'Tiempo cargue' . $subtitulo;
        $this->_view->renderizar('crear_cargue', 'tiempo_logistico_cargue');
    }

    public function crear_cargue()
    {
        $nombre = $this->loadModel('tiempo_cargue');
        $this->_view->titulo = 'Tiempo cargue';
        $this->_view->renderizar('crear_cargue', 'tiempo_logistico_cargue');
    }

    public function cargue_tiempo()
    {
        $nombre = $this->loadModel('tiempo_cargue');
        $this->_view->prueba = $prueba;
        $this->_view->titulo = 'Tiempos cargue';
        $this->_view->renderizar('tiempocargue', 'tiempos_logisticos_cargue');
    }

    public function editar_crear()
    {
        $nombre = $this->loadModel('tiempo_cargue_crear2');
        $this->_view->prueba = $prueba;
        $subtitulo = '<br><span class="detail-description">
			<h5>
			Tráfico -> Control ruta -> Editar tiempos cargue
			</h5>
			</span>';
        $this->_view->titulo = 'Tiempos cargue' . $subtitulo;
        $this->_view->renderizar('editar_crear', 'tiempos_logisticos_cargue');
    }

    public function Selecciona_Manifiesto()
    { //traer manifiestos que tienen ordenes de cargue pendientes
        $this->dato2 = $this->_modelo->Mani_ordenes_pendiente();
        echo json_encode($this->dato2);
    }

    public function Selecciona_Manifiesto_Individual()
    {
        $manifi = $_POST["manifiesto"];
        $this->dato2 = $this->_modelo->Datos_Manifiesto($manifi);
        echo json_encode($this->dato2);
    }

    public function Selecciona_Ordenes()
    {
        $manifi = $_POST["manifiesto"];
        // $orden_cargue = $_POST["orden_cargue"];
        $this->dato2 = $this->_modelo->Ordenes_Asociadas($manifi);
        echo json_encode($this->dato2);
    }
    public function Selecciona_Ordenes_detalle()
    {
        $manifi = $_POST["manifiesto"];
        $orden_cargue = $_POST["orden_cargue"];
        $this->dato2 = $this->_modelo->Ordenes_Asociadas_detalle($manifi, $orden_cargue);
        echo json_encode($this->dato2);
    }

    public function validar_order_cargue()
    {
        $manifiesto = $_POST["manifiesto"];
        $this->_validar_orden_cargue = $this->_modelo->Validar_Orden_Cargue($manifiesto);
        echo json_encode($this->_validar_orden_cargue);
    }

    public function Registro_Tiempo_Cargue()
    {
        $manifiesto = $_POST["manifiesto"];
        $placa = $_POST["placa"];

        // $tipofechacarga = $_POST["tipofechacarga"];
        // $fircargar = $_POST["fircargar"];
        // $hircargar = $_POST["hircargar"];
        // $observair = $_POST["observair"];

        $tipofechallega = $_POST["tipofechallega"];
        $fllegcargar = $_POST["fllegcargar"];
        $hllegcargar = $_POST["hllegcargar"];
        // $obserllego = $_POST["obserllego"];

        $tipofechaentro = $_POST["tipofechaentro"];
        $fentrocarga = $_POST["fentrocarga"];
        $hentrocarga = $_POST["hentrocarga"];
        // $obserentro = $_POST["obsentro"];

        $tipofechasali = $_POST["tipofechasali"];
        $fsalidacarga = $_POST["fsalidacarga"];
        $hsalidacarga = $_POST["hsalidacarga"];
        // $obssalio = $_POST["obssalio"];
        $num_orden = $_POST["num_orden"];
        $this->timecargue = $this->_modelo->Insertar_Tiempo(
            $manifiesto,
            $placa,
            // $tipofechacarga,
            // $fircargar,
            // $hircargar,
            // $observair,
            $tipofechallega,
            $fllegcargar,
            $hllegcargar,
            // $obserllego,
            $tipofechaentro,
            $fentrocarga,
            $hentrocarga,
            // $obserentro,
            $tipofechasali,
            $fsalidacarga,
            $hsalidacarga,
            // $obssalio,
            $num_orden
        );
        echo json_encode($this->timecargue);
    }

    public function Selecciona_Idcargue()
    {
        $manifiesto = $_POST['manifiesto'];
        $this->dato2 = $this->_modelo->Id_Principal($manifiesto);
        echo json_encode($this->dato2);
    }

    //CREAR -EDITAR TIEMPOS

    public function Seleccionar_Manifiesto()
    {
        $this->dato2 = $this->_modelo->Busqueda_Manifiesto();
        echo json_encode($this->dato2);
    }

    public function Datos_Manifiesto()
    {
        $manifi = $_POST["manifi"];
        $this->dato2 = $this->_modelo->Datos_Manifiesto_a($manifi);
        echo json_encode($this->dato2);
    }

    public function Ordenes_Cargue()
    {
        $manifi = $_POST["manifi"];
        $fecha = $_POST["fecha"];
        $this->dato2 = $this->_modelo->Buscar_Ordenes($manifi, $fecha);
        echo json_encode($this->dato2);
    }

    public function Registro_Tiempos()
    {
        $manifi = $_POST["manifi"];
        $placa = $_POST["placa"];
        $fecha_c = $_POST["fecha_c"];
        $hora_c = $_POST["hora_c"];
        $obser = $_POST["obser"];
        $num_ordenes = $_POST["num_ordenes"];
        $id_cargue = $_POST["idcargar"];
        $clase = $_POST["clase"];
        $this->timecargue = $this->_modelo->Insertar_Tiempos(
            $manifi,
            $placa,
            $fecha_c,
            $hora_c,
            $obser,
            $num_ordenes,
            $id_cargue,
            $clase
        );
        echo json_encode($this->timecargue);
    }

    public function Verificar_ordenes()
    {
        $orden_cargue = $_POST["orden_cargue"];
        $manifiesto = $_POST["manifiesto"];
        $this->_verificar_tiempos = $this->_modelo->Verificar_Tiempos_Logisticos($orden_cargue, $manifiesto);
        echo json_encode($this->_verificar_tiempos);
    }
}
