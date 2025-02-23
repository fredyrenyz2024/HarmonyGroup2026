<?php

class planrutaController extends Controller
{
    private $_modelo;
    private $agregar_punto;
    private $crear_plan;
    private $puntos_ruta;
    private $consulta_base;
    private $consulta_base_crear;
    private $actualizar_puntos;
    private $consultar_puntos;
    private $consultar_puntos_destino;
    private $filtro_planes;
    private $puntos_de_ruta;
    private $update_plan;
    private $consultar_puntos_para;
    private $borrar_punto;
    private $listar_plan_ruta;
    private $listar_puntos_control;

    public function __construct()
    {
        parent::__construct();
        $this->_modelo = $this->loadModel('planruta');
    }

    public function index()
    {
    }

    public function Consultar_Punto()
    {
        $this->consultar_puntos = $this->_modelo->Consultar_Puntos();
        echo json_encode($this->consultar_puntos);
    }
    public function Consultar_Punto_destino()
    {
        $origen = $_REQUEST["origen"];
        $this->consultar_puntos_destino = $this->_modelo->Consultar_Puntos_Destino($origen);
        echo json_encode($this->consultar_puntos_destino);
    }

    public function Filtro_PLanes()
    {
        $origen_ruta = $_REQUEST["origen_ruta"];
        $destino_ruta = $_REQUEST["destino_ruta"];
        $this->filtro_planes = $this->_modelo->Filtro_Planes($origen_ruta, $destino_ruta);
        echo json_encode($this->filtro_planes);
    }

    public function Ver_puntos_de_ruta()
    {
        $plan_id = $_REQUEST["idplan"];
        $this->puntos_de_ruta = $this->_modelo->Ver_puntos_ruta($plan_id);
        echo json_encode($this->puntos_de_ruta);
    }

    public function Crear_Plan()
    {
        $id_ruta = $_POST["id_ruta"];
        $cod_plan = $_POST["cod_plan"];
        $cab = $_POST["cab"];

        /* -------------Cebecera------------ */
        $name_plan = $_POST["name_plan"];
        $detallep = $_POST["detallep"];
        $fplan = $_POST["fplan"];
        $hplan = $_POST["hplan"];
        $uplan = $_POST["uplan"];
        /* ------------------------------- */

        /* -------------Puntos------------ */
        $notas = $_POST["notas"];
        $fecha = date('Y-m-d');
        $hora = date('H:i:s');
        /* ------------------------------- */

        /* -------------Punto Fin (Destino)------------ */
        $puntofinal = $_POST["puntofinal"];
        $tiempofinal = $_POST["tiempofinal"];
        $descripfinal = $_POST["descripfinal"];
        $kmfinal = $_POST["kmfinal"];
        $ordenfinal = $_POST["ordenfinal"];
        $tpfinal = $_POST["tpfinal"];
        $latitudfinal = $_POST["latitudfinal"];
        $longifinal = $_POST["longifinal"];
        $ubicacion = $_POST["ubicacion"];
        /* ------------------------------- */

        /*---------------Array de datos-----------*/
        $datos = array(
            "cod_plan" => $cod_plan,
            "cab" => $cab,

            /* ----------Cabecera----------*/
            "name_plan" => $name_plan,
            "detallep" => $detallep,
            "fplan" => $fplan,
            "hplan" => $hplan,
            "uplan" => $uplan,
            "ruta_id" => $id_ruta,
            /*----------Fin Cabecera----------*/

            /* -------------Puntos------------ */
            "notas" => $notas,
            "fecha" => $fecha,
            "hora" => $hora,
            /*----------Fin Puntos----------*/

            /* -------------Punto Fin (Destino)------------ */
            "puntofinal" => $puntofinal,
            "tiempofinal" => $tiempofinal,
            "descripfinal" => $descripfinal,
            "kmfinal" => $kmfinal,
            "ordenfinal" => $ordenfinal,
            "tpfinal" => $tpfinal,
            "latitudfinal" => $latitudfinal,
            "longifinal" => $longifinal,
            "ubicacion" => $ubicacion,
            /*----------Fin Punto (Destino)----------*/
        );
        $this->crear_plan = $this->_modelo->Crear_Plan_Ruta($datos);
        echo json_encode($this->crear_plan);
    }

    public function puntos_de_ruta()
    {
        $idplan = $_POST["idplan"];
        $this->puntos_ruta = $this->_modelo->Consutar_puntos_ruta($idplan);
        echo json_encode($this->puntos_ruta);
    }

    public function Actualizar_puntos()
    {
        $posiciones = json_decode($_POST["puntos"]);
        $cod_plan = $_POST["cod_plan"];
        $this->actualizar_puntos = $this->_modelo->Actualizar_puntos_ruta($posiciones);
        echo json_encode($this->actualizar_puntos);
    }

    public function Consulta_base()
    {
        $idplan = $_POST["plan_id"];
        $this->consulta_base = $this->_modelo->Consultar_base($idplan);
        echo json_encode($this->consulta_base);
    }

    public function Consutal_Base_Crear()
    {
        $this->consulta_base_crear = $this->_modelo->Consultar_base_crear();
        echo json_encode($this->consulta_base_crear);
    }

    public function Agregar_Puntos()
    {
        $puntos = json_decode($_POST['puntos']);

        // var_dump($puntos);
        // exit();
        $this->agregar_punto = $this->_modelo->Agregar_Punto($puntos);
        echo json_encode($this->agregar_punto);
    }

    public function Consultar_punto_para()
    {
        $id_punto = $_POST['id_punto'];
        $this->consultar_puntos_para = $this->_modelo->Consultar_Punto_Para($id_punto);
        echo json_encode($this->consultar_puntos_para);
    }

    public function Update_Plan()
    {
        $datos = array(
            "id_plan " => $_POST["id_plan"],
            "namplan " => $_POST["namplan"],
            "detaplan" => $_POST["detaplan"],
            "es_plan " => $_POST["es_plan"],
        );
        $this->update_plan = $this->_modelo->Update_Estado_plan($datos);
        echo json_encode($this->update_plan);
    }

    public function Borrar_puntocontrol()
    {
        $id = $_POST["idtb"];
        $this->borrar_punto = $this->_modelo->Borrar_Punto_Control($id);
        echo json_encode($this->borrar_punto);
    }

    public function Listar_plan_ruta_seguimiento()
    {
        $plan_id = $_POST["id_plan"];
        $condigo_inicio = $_POST["codigo_ini"];
        $manifiesto = $_POST["manifiesto"];
        $this->listar_plan_ruta = $this->_modelo->Listar_plan_de_ruta_seguimiento($plan_id, $condigo_inicio, $manifiesto);
        echo json_encode($this->listar_plan_ruta);
    }

    public function Buscar_Puntos_Control()
    {
        $datos = $_POST["datos"];
        $this->listar_puntos_control = $this->_modelo->Buscar_Puntos($datos);
        echo json_encode($this->listar_puntos_control);
    }
}
