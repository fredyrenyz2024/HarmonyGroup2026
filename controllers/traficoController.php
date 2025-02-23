<?php

class traficoController extends Controller
{

    private $_modelo;
    private $filtro;
    private $lugares;
    private $editar;
    private $validar;
    private $crear;
    private $cargar_origen;
    private $cargar_destino;
    private $cordenadas_rutas;
    private $origen_ruta;
    private $destino_ruta;
    private $update_ruta;
    private $informacion_principal;
    private $consultar_inicio_ruta;
    private $puntos_geograficos;
    private $puntos_control;
    private $consulta_seguimiento;
    private $consultar_puntos;
    private $punto_control;
    private $consulta_semaforo;
    private $actualizar_tiempo;
    private $consulta_maxima_nota;
    private $salida_manifiesto;
    private $validar_parametros;
    private $buscar_novedad;

    public function __construct()
    {
        parent::__construct();
        $this->_modelo = $this->loadModel('trafico');
    }

    public function index() {}

    public function Cargar_origen()
    {
        $this->cargar_origen = $this->_modelo->Cargar_origen();
        echo json_encode($this->cargar_origen);
    }

    public function Cargar_destino()
    {
        $this->cargar_destino = $this->_modelo->Cargar_destino();
        echo json_encode($this->cargar_destino);
    }

    public function Cordenada_Rutas()
    {
        $id = $_POST["id"];
        $this->cordenadas_rutas = $this->_modelo->Coordenada_Rutas($id);
        echo json_encode($this->cordenadas_rutas);
    }

    public function Filtro_Rutas()
    {
        $eleccion = $_REQUEST["eleccion"];
        $lugar = $_REQUEST["lugar"];
        $this->filtro = $this->_modelo->Filtro_Rutas($eleccion, $lugar);
        echo json_encode($this->filtro);
    }

    public function Lugares()
    {
        $id = $_REQUEST["id"];
        $origen = $_REQUEST["origen"];
        $destino = $_REQUEST["destino"];
        $this->lugares = $this->_modelo->Consultar_Lugares($id, $origen, $destino);
        echo json_encode($this->lugares);
    }

    public function Editar_Ruta()
    {
        $id = $_REQUEST["id"];
        $origen = $_REQUEST["origen"];
        $destino = $_REQUEST["destino"];
        $this->editar = $this->_modelo->Editar_Rutas($id, $origen, $destino);
        echo json_encode($this->editar);
    }

    public function Solo_una_ruta()
    {
        $origen = $_REQUEST["origen"];
        $destino = $_REQUEST["destino"];
        $this->validar = $this->_modelo->Validar_Una_Rutas($origen, $destino);
        echo json_encode($this->validar);
    }

    public function Insertar_ruta()
    {
        $datos = array(
            "origen" => $_POST["origen"],
            "destino" => $_POST["destino"],
            "observa" => $_POST["observa"],
            "fecha" => $_POST["fecha"],
            "hora" => $_POST["hora"],
            "user" => $_POST["user"],
            "latitud_origen" => $_POST["latitud_origen"],
            "latitud_destino" => $_POST["latitud_destino"],
            "longitud_origen" => $_POST["longitud_origen"],
            "longitud_destino" => $_POST["longitud_destino"],
            "tiempo_tot" => $_POST["tiempo_tot"],
            "kilo_tot" => $_POST["kilo_tot"],
        );
        $this->crear = $this->_modelo->Crear_Ruta($datos);
        echo json_encode($this->crear);
    }

    public function Elegir_Origen_Ruta()
    {
        $this->origen_ruta = $this->_modelo->Elegur_Origen_Ruta();
        echo json_encode($this->origen_ruta);
    }

    public function Elegir_Destino_Ruta()
    {
        $this->destino_ruta = $this->_modelo->Elegur_Destino_Ruta();
        echo json_encode($this->destino_ruta);
    }

    public function Update_Ruta()
    {
        $datos = array(
            "id" => $_POST["id"],
            "origen" => $_POST["origen"],
            "destino" => $_POST["destino"],
            "observa" => $_POST["observa"],
            "fecha" => $_POST["fecha"],
            "hora" => $_POST["hora"],
            "user" => $_POST["user"],
            "estado" => $_POST["estado"],
            "vla_ori_e" => $_POST["vla_ori_e"],
            "vla_des_e " => $_POST["vla_des_e"],
            "vlo_ori_e" => $_POST["vlo_ori_e"],
            "vlo_des_e" => $_POST["vlo_des_e"],
            "tiempoe" => $_POST["tiempoe"],
            "kilometroe" => $_POST["kilometroe"],
        );
        $this->update_ruta = $this->_modelo->Actualizar_Ruta($datos);
        echo json_encode($this->update_ruta);
    }

    /* Tablero de seguimiento informacion principal */
    public function seguimiento_ruta()
    {
        $num_manifiesto = $_POST["manifiesto"];
        $this->informacion_principal = $this->_modelo->Seguimiento_Ruta($num_manifiesto);
        echo json_encode($this->informacion_principal);
    }

    public function Consultar_inicio_ruta()
    {
        $manifiesto = $_POST['manifiesto'];
        $this->consultar_inicio_ruta = $this->_modelo->Inicio_ruta($manifiesto);
        echo json_encode($this->consultar_inicio_ruta);
    }

    public function Puntos_geograficos()
    {
        $idplan = $_POST["idplan"];
        $codini = $_POST["codini"];
        $this->puntos_geograficos = $this->_modelo->Consular_Puntos_Geograficos($idplan, $codini);
        echo json_encode($this->puntos_geograficos);
    }

    public function Listar_Puntos_control()
    {
        $this->puntos_control = $this->_modelo->Listar_Puntos();
        echo json_encode($this->puntos_control);
    }

    public function crear_gestion()
    {
        $fecha = date('Y-m-d');
        $hora = date('H:i:s');
        $user = $_SESSION["usuario"]["nom_usuario"];
        $data = json_decode(file_get_contents('php://input'), true);
    }

    public function consulta_seguimiento()
    {
        $codigo_inicio = $_POST["codini"];
        $this->consulta_seguimiento = $this->_modelo->Consultar_Seguimiento($codigo_inicio);
        echo json_encode($this->consulta_seguimiento);
    }

    public function consultar_puntos_geograficos()
    {
        $id_plan = $_POST["id_plan"];
        $this->consultar_puntos = $this->_modelo->Consultar_Puntos_Geograficos($id_plan);
        echo json_encode($this->consultar_puntos);
    }

    public function consulta_puntocontrol()
    {
        $codinin = $_POST["codinin"];
        $this->punto_control = $this->_modelo->Consultar_Puntos_Control($codinin);
        echo json_encode($this->punto_control);
    }

    public function consulta_semaforo()
    {
        $codini = $_POST["codini"];
        $this->consulta_semaforo = $this->_modelo->Consultar_Tiempo_Semaforo($codini);
        echo json_encode($this->consulta_semaforo);
    }

    public function Actualizar_Tiempo()
    {
        $codini = $_POST["codini"];
        // $manifiesto = $_POST["manifiesto"];
        $this->actualizar_tiempo = $this->_modelo->Actualizar_Tiempo_Manifiesto($codini);
        echo json_encode($this->actualizar_tiempo);
    }

    public function consulta_notas()
    {
        $codini = $_POST["codini"];
        $this->consulta_maxima_nota = $this->_modelo->Consultar_Notas_Controlador($codini);
        echo json_encode($this->consulta_maxima_nota);
    }

    /* Salida a seguimiento */
    public function validar_parametros_para_salida()
    {
        $placa = $_POST["placa"];
        $cedula = $_POST["cedula"];
        $celular = $_POST["celular"];
        $this->validar_parametros = $this->_modelo->Validar_Parametros_Salida($placa, $cedula, $celular);
        echo json_encode($this->validar_parametros);
    }

    public function Dar_salida()
    {
        $manifiesto_id = $_POST["manifiesto_id"];
        $codigo_inicio_salida = $_POST["codigo_inicio_salida"];
        $this->salida_manifiesto = $this->_modelo->Salida_Manifiesto($manifiesto_id, $codigo_inicio_salida);
        echo json_encode($this->salida_manifiesto);
    }

    public function Buscar_novedades()
    {
        $codigo_novedad = $_POST["datos"];
        $this->buscar_novedad = $this->_modelo->Lista_Novedades($codigo_novedad);
        echo json_encode($this->buscar_novedad);
    }

    /* Funciones para guardar las asignaciones de plan de ruta */

    function crear_inicio()
    {
        // $vehic = new Trafico();
        $datos = [
            'cab' => filter_input(INPUT_POST, 'cab', FILTER_SANITIZE_NUMBER_INT),
            // Datos de la solicitud de inicio
            // 'cod_ini' => filter_input(INPUT_POST, 'cod_ini'),
            'mani' => filter_input(INPUT_POST, 'mani', FILTER_SANITIZE_NUMBER_INT),
            'cedula' => filter_input(INPUT_POST, 'cedula'),
            'placa' => filter_input(INPUT_POST, 'placa'),
            'Plan' => filter_input(INPUT_POST, 'Plan', FILTER_SANITIZE_NUMBER_INT),
            'obse' => filter_input(INPUT_POST, 'obse'),
            'id_estudio' => filter_input(INPUT_POST, 'id_estudio', FILTER_SANITIZE_NUMBER_INT),
            'calvetj' => filter_input(INPUT_POST, 'calvetj'),
            'fechasalida' => filter_input(INPUT_POST, 'fechasalida'),
            'horasalida' => filter_input(INPUT_POST, 'horasalida'),
            // Puntos de entrega
            'maximo' => filter_input(INPUT_POST, 'maximo', FILTER_SANITIZE_NUMBER_INT),
            'pun' => filter_input(INPUT_POST, 'pun', FILTER_SANITIZE_NUMBER_INT),
            // Datos de puntos de entrega
            'cod_ini' => filter_input(INPUT_POST, 'cod_ini'),
            'mentrega' => filter_input(INPUT_POST, 'mentrega'),
            'dire' => filter_input(INPUT_POST, 'dire'),
            'cliente' => filter_input(INPUT_POST, 'clientea'),
            'remesa' => filter_input(INPUT_POST, 'remesa'),
            'fentrega' => filter_input(INPUT_POST, 'fentrega'),
            'obs' => filter_input(INPUT_POST, 'obs'),
            'hora_estimada' => filter_input(INPUT_POST, 'hora'),
            'tipo' => filter_input(INPUT_POST, 'tipo'),
            'orden' => filter_input(INPUT_POST, 'orden', FILTER_SANITIZE_NUMBER_INT),
        ];
        $this->buscar_novedad = $this->_modelo->crear_inicio_ruta($datos);
        echo json_encode($this->buscar_novedad);
    }

    public function Manifiestos_pendientes()
    {
        $this->buscar_novedad = $this->_modelo->Consulta_Manifiestos_Pendientes();
        echo json_encode($this->buscar_novedad);
    }
}
