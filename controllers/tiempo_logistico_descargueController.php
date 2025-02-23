<?php

class tiempo_logistico_descargueController extends Controller
{
    private $_modelo;
    private $_modelo2;
    private $_verificar_tiempos;
    private $dato2;
    private $timedescargue;
    private $timesalida;


    public function __construct()
    {
        parent::__construct();
        //$this->$_modelo=$this->loadModel('transporte');
        $this->_modelo = $this->loadModel('tiempo_descargue');
        $this->_modelo2 = $this->loadModel('tiempo_descargue_crear2');
    }

    public function index()
    {
        $prueba = $this->loadModel('tiempo_descargue');
        $this->_view->prueba = $prueba;
        // $subtitulo = '<br><span class="detail-description">
        //     <h5>
        //     Tráfico -> Control ruta ->Tiempos descargue
        //     </h5>
        //     </span>';
        $this->_view->titulo = 'Tiempos descargue';
        $this->_view->renderizar('crear_descargue', 'tiempos_logisticos_descargue');
    }

    /*public function tiempo_cargue(){
    $nombre = $this->loadModel('tiempo_cargue');
    $this->_view->cargar = $cargar;
    $this->_view->titulo ='Tiempo cargue';
    $this->_view->renderizar('crear_cargue','tiempos_logisticos_cargue');
    }*/

    public function editar_crear()
    {
        $nombre = $this->loadModel('tiempo_descargue_crear2');
        $this->_view->prueba = $prueba;
        $subtitulo = '<br><span class="detail-description">
			<h5>
			Tráfico -> Control ruta -> Editar tiempos Descargue
			</h5>
			</span>';
        $this->_view->titulo = 'Tiempos Descargue' . $subtitulo;
        $this->_view->renderizar('editar_crear', 'tiempos_logisticos_descargue');
    }

    public function Selecciona_Manifiesto()
    { //traer manifiestos que tienen ordenes de cargue pendientes
        $this->dato2 = $this->_modelo->Mani_ordenes_pendiente();
        echo json_encode($this->dato2);
    }

    public function Selecciona_Manifiesto_descargue()
    { //traer manifiestos que tienen ordenes de cargue pendientes
        $this->dato2 = $this->_modelo->Mani_ordenes_pendientes();
        echo json_encode($this->dato2);
    }

    public function Selecciona_Manifiesto_Individual()
    {
        $manifi = $_POST["manifiesto"];
        $this->dato2 = $this->_modelo->DatosManifiesto($manifi);
        echo json_encode($this->dato2);
    }

    public function Remesas()
    {
        $manifi = $_POST["manifi"];
        $remesa = $_POST["remesa"];
        $this->dato2 = $this->_modelo->Buscar_remesa($manifi, $remesa);
        echo json_encode($this->dato2);
    }

    public function Registro_Tiempo_Descargue()
    {
        $manifiesto = $_POST["manifiesto"];
        $placa = $_POST["placa"];
        $tipofechallega = $_POST["tipofechallega"];
        $fllegcargar = $_POST["fllegcargar"];
        $hllegcargar = $_POST["hllegcargar"];
        $obserllego = 'observacion';
        $tipofechaentro = $_POST["tipofechaentro"];
        $fentrocarga = $_POST["fentrocarga"];
        $hentrocarga = $_POST["hentrocarga"];
        $obsentro = 'observacion';
        $tipofechasali = $_POST["tipofechasali"];
        $fsalidacarga = $_POST["fsalidacarga"];
        $hsalidacarga = $_POST["hsalidacarga"];
        $obssalio = 'observacion';
        $num_orden = $_POST["num_orden"];

        $this->timedescargue = $this->_modelo->Insertar_Tiempos(
            $manifiesto,
            $placa,
            $tipofechallega,
            $fllegcargar,
            $hllegcargar,
            $obserllego,
            $tipofechaentro,
            $fentrocarga,
            $hentrocarga,
            $obsentro,
            $tipofechasali,
            $fsalidacarga,
            $hsalidacarga,
            $obssalio,
            $num_orden
        );

        echo json_encode($this->timedescargue);
    }

    public function Id_Principal()
    {
        $manifiesto = $_POST["manifiesto"];
        $this->dato2 = $this->_modelo->Buscar_Idprincipal($manifiesto);
        echo json_encode($this->dato2);
    }

    public function Manifiesto_Remesa()
    {
        //Consultar Manifiesto que tenga remesas con fecha de llegada
        $this->dato2 = $this->_modelo2->Buscar_Remesas();
        echo json_encode($this->dato2);
    }

    public function Datos_Manifiesto()
    {
        $manifi = $_POST["manifi"];
        $this->dato2 = $this->_modelo2->Buscar_Datosmnf($manifi);
        echo json_encode($this->dato2);
    }

    public function Consulta_Remesas()
    {
        $manifi = $_POST["manifi"];
        $tipfecha = $_POST["tipfecha"];
        $this->dato2 = $this->_modelo2->Buscar_Remesa_I($manifi, $tipfecha);
        echo json_encode($this->dato2);
    }

    public function Registro_Tiempos()
    {
        $manifi = $_POST["manifi"];
        $placa = $_POST["placa"];
        $fecha = $_POST["fecha"];
        $hora = $_POST["hora"];
        $observa = $_POST["observa"];
        $tipo_fecha = $_POST["tipo_fecha"];
        $idtabla = $_POST["idtabla"];
        $remesas = $_POST["remesas"];
        $this->timedescargue = $this->_modelo->Insertar_Tiempo(
            $manifi,
            $placa,
            $fecha,
            $hora,
            $observa,
            $tipo_fecha,
            $idtabla,
            $remesas
        );
        echo json_encode($this->timedescargue);
    }

    public function Registro_Tiempos_Salida()
    {
        $manifi = $_POST["manifi"];
        $placa = $_POST["placa"];
        $fecha = $_POST["fecha"];
        $hora = $_POST["hora"];
        $observa = $_POST["observa"];
        $tipo_fecha = $_POST["tipo_fecha"];
        $idtabla = $_POST["idtabla"];
        $remesas = $_POST["remesas"];
        $this->timesalida = $this->_modelo2->Insertar_Tiempo_Salida(
            $manifi,
            $placa,
            $fecha,
            $hora,
            $observa,
            $tipo_fecha,
            $idtabla,
            $remesas
        );
        echo json_encode($this->timesalida);
    }

    public function Verificar_ordenes()
    {
        $remesa = $_POST["remesa"];
        $this->_verificar_tiempos = $this->_modelo->Verificar_Tiempos_Logisticos($remesa);
        echo json_encode($this->_verificar_tiempos);
    }
}
