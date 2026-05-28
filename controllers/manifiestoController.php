<?php

class manifiestoController extends Controller
{
    private $_modelo;
    private $dato2;
    // private $_view;
    private $man;
    private $datovalida;
    private $ant;
    private $dato3;

    public function __construct()
    {
        parent::__construct();
        //$this->$_modelo=$this->loadModel('transporte'); 
        $this->_modelo = $this->loadModel('manifieste');
    }

    public function index()
    {
        $prueba = $this->loadModel('manifieste');
        $this->_view->prueba = $prueba;
        $this->_view->titulo = 'Manifiesto';
        $this->_view->renderizar('manifiesto', 'transporte');
    }

    public function manifiesto()
    {
        $prueba = $this->loadModel('manifieste');
        $this->_view->prueba = $prueba;
        $this->_view->titulo = 'Ver manifiesto';
        $this->_view->renderizar('ver_manifiesto', 'manifiesto');
    }

    public function manifiesto_prueba()
    {
        $mani = $this->loadModel('transporte');
        $this->_view->mani = $mani;
        $this->_view->titulo = 'Manifiesto 2';
        $this->_view->renderizar('manifiesto_prueba', 'transporte');
    }


    public function Consulta_Municipios()
    { //traer municipios
        $id_vehi = $_POST["id_vehi"];
        $this->dato2 = $this->_modelo->consulte_munipios($id_vehi);
        echo json_encode($this->dato2);
    }

    public function Consulta_Municipios_Dest()
    { //traer municipios
        $id_vehi = $_POST["id_vehi"];
        $this->dato2 = $this->_modelo->consulte_destino($id_vehi);
        echo json_encode($this->dato2);
    }

    public function Selecciona_Remesa()
    { //traer municipios
        $this->dato2 = $this->_modelo->consulte_remesas();
        echo json_encode($this->dato2);
        //print_r(json_encode($this->dato2));
    }

    public function Consulta_Datos()
    { //consultar vehiculo y conductor
        $vehiculo = $_POST["carro"];
        $this->dato2 = $this->_modelo->consulte_conductor_vehiculo($vehiculo);
        echo json_encode($this->dato2);
    }

    public function Consulta_Remesas()
    {
        $vehiculo = $_POST["id_carro"];
        $this->dato2 = $this->_modelo->consulta_tabla_remesa($vehiculo);
        echo json_encode($this->dato2);
    }

    public function Consultar_configuracion_vehiculo()
    {
        $id_vehi = $_POST["id_vehi"];
        $this->dato2 = $this->_modelo->consulta_configuracion_vehiculo($id_vehi);
        echo json_encode($this->dato2);
    }

    public function Consulta_Porcentaje()
    {
        $this->dato2 = $this->_modelo->consulta_por_anticipo();
        echo json_encode($this->dato2);
    }

    public function Registro_mnf()
    {
        //echo 'controlador manifi';
        $placa = $_POST["placa"];
        $fecha_expe = $_POST["fecha_expe"];
        $tipo_mnf = $_POST["tipo_mnf"];
        $origen = $_POST["origen"];
        $destino = $_POST["destino"];
        $posee_num = $_POST["posee_num"];
        $condu_identifi = $_POST["condu_identifi"];
        $tot_viaje = $_POST["tot_viaje"];
        $v_rete = $_POST["v_rete"];
        $v_reteica = $_POST["v_reteica"];
        $v_neto = $_POST["v_neto"];
        $saldo = $_POST["saldo"];
        $agencia = $_POST["agencia"];
        $fec_pago = $_POST["fec_pago"];
        $cargue = $_POST["cargue"];
        $descargue = $_POST["descargue"];
        $obs = $_POST["obs"];
        $r_anti = empty($_POST["r_anti"]) ? 0 : $_POST["r_anti"];
        $porcentaje = $_POST["porcentaje"];
        $valor = $_POST["valor"];
        $metodo = $_POST["metodo"];
        $total_peso = $_POST["total_peso"];
        $total_volumen = $_POST["total_volumen"];

        $rem = json_decode($_POST['remesas']);

        $remitr = json_decode($_POST['remesaitr']);
        $manitr = 'NO';
        for ($i = 0; $i < count($remitr->manifiesto_itr); $i++) {
            if (strtoupper($remitr->manifiesto_itr[$i]) === "SI") {
                $manitr = 'SI';
                break; // No necesitamos seguir, ya sabemos que al menos una es "SI"
            }
        }
        $plan_ruta = $_POST["plan_ruta"] ?? null;

        $this->man = $this->_modelo->Insertar_manifiesto(
            $placa,
            $fecha_expe,
            $tipo_mnf,
            $origen,
            $destino,
            $posee_num,
            $condu_identifi,
            $tot_viaje,
            $v_rete,
            $v_reteica,
            $v_neto,
            $saldo,
            $agencia,
            $fec_pago,
            $cargue,
            $descargue,
            $obs,
            $r_anti,
            $porcentaje,
            $valor,
            $metodo,
            $total_peso,
            $total_volumen,
            $rem,
            $manitr,
            $plan_ruta
        );
        echo json_encode($this->man);
    }


    public function Valida_Remesas()
    {
        $manifiesto = $_POST["manifiesto"];
        $this->datovalida = $this->_modelo->Remesa_Rndc($manifiesto);
        echo json_encode($this->datovalida);
    }

    //FUNCIONES DEL SUBEMNU MANIFIESTOS

    public function Consulta_Manifiestos()
    {
        $finicia = $_POST["finicia"];
        $ffinal = $_POST["ffinal"];
        $this->dato2 = $this->_modelo->consulta_manifiestos($finicia, $ffinal);
        echo json_encode($this->dato2);
        //print_r($this->dato2);
    }

    public function ConsultaManifiesto()
    { //consulta individual manifiesto
        $nummani = $_POST["nummani"];
        $this->dato2 = $this->_modelo->consulta_manifiesto($nummani);
        echo json_encode($this->dato2);
    }


    public function ConsultaRemesas()
    {
        $nummani = $_POST["nummani"];
        $this->dato2 = $this->_modelo->consultaremesa($nummani);

        //print_r($this->dato2);

        echo json_encode($this->dato2);
    }

    public function Anular_Manifiesto()
    {
        $id_manifiesto = $_POST["id_manifiesto"];
        $this->dato2 = $this->_modelo->Anula_Manifiesto($id_manifiesto);
        echo json_encode($this->dato2);
    }

    public function Consultar_Anticipos()
    {
        $id_manif = $_POST["id_manifi"];
        $this->dato2 = $this->_modelo->Consulta_Anticipos($id_manif);
        echo json_encode($this->dato2);
    }

    public function Consultar_Valor_T()
    {
        $id_manif = $_POST["id_manifi"];
        $this->dato2 = $this->_modelo->Consulta_Valor_Tot($id_manif);
        echo json_encode($this->dato2);
    }

    public function Registro_Anticipo()
    {
        $mani = $_POST["mani"];
        $vtotal = $_POST["vtotal"];
        $vlim = $_POST["vlim"];
        $por = $_POST["por"];
        $anticipo = $_POST["anticipo"];
        $desem = $_POST["desem"];
        $bene = $_POST["bene"];
        $this->ant = $this->_modelo->Insertar_anticipo(
            $mani,
            $vtotal,
            $vlim,
            $por,
            $anticipo,
            $desem,
            $bene
        );
        echo json_encode($this->ant);
    }


    public function ConsultaPdf_Manifiesto()
    {
        $id_manif = $_POST["manifies"];
        $this->dato3 = $this->_modelo->Consulta_Pdf_Mnf($id_manif);
        $this->dato2 = $this->_modelo->Consulta_pdf_reme($id_manif);
        $array = array($this->dato3, $this->dato2);
        echo json_encode($array);
    }
}
