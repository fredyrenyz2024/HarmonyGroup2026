<?php
class control_rutaController extends Controller
{
    private $_modelo;
    private $_llegada;
    private $_punto;
    private $_finalizar;
    private $_filtro;
    private $_filtro_llegada;
    private $_salida;
    private $continuaruta;
    private $automatico;
    private $_filtro_historico;
    private $_filtro_seguimiento;
    private $dato2;
    private $contadores;
    private $_envio_email;
    private $_filtros;

    public function __construct()
    {
        parent::__construct();
        $this->_modelo = $this->loadModel('tableroseguimiento');
    }

    public function index()
    {
        $ruta = $this->loadModel('ruta_trafico'); //se añade el modelo a usar
        $this->_view->ruta = $ruta; // Se einsatcia el modelos
        $this->_view->titulo = 'Rutas';
        $this->_view->renderizar('rutas', 'trafico'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
    }

    /*
    INDEX DE PRUEBA
    public function index(){
    $ruta = $this->loadModel('ruta_trafico');//se añade el modelo a usar
    $this->_view->ruta = $ruta; // Se einsatcia el modelos
    $this->_view->titulo = 'Rutas';
    //$this->_view->renderizar('rutas', 'trafico');//index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
    $this->_view->renderizar('registro_seguimiento', 'trafico');
    }*/

    public function planes()
    {
        $planes = $this->loadModel('planes'); //se añade el modelo a usar
        $this->_view->planes = $planes; // Se einsatcia el modelos
        $this->_view->titulo = 'Detalle de ruta';
        $this->_view->renderizar('planes', 'trafico');
    }

    public function iniciar_ruta()
    {
        $inicia_ruta = $this->loadModel('iniciar_ruta'); //se añade el modelo a usar
        $this->_view->inicia_ruta = $inicia_ruta; // Se einsatcia el modelos
        $this->_view->titulo = 'Plan de Ruta';
        $this->_view->renderizar('iniciar_ruta', 'trafico');
    }

    public function seguimientos()
    {
        $seguir = $this->loadModel('iniciar_ruta'); //se añade el modelo a usar
        $this->_view->seguir = $seguir; // Se einsatcia el modelos
        $this->_view->titulo = 'Seguimientos';
        $this->_view->renderizar('seguimiento', 'trafico');
    }

    public function seguir_ruta()
    {
        // $continuaruta2 = $this->loadModel('iniciar_ruta');
        $continuaruta = $this->loadModel('tableroseguimiento');
        // $this->_view->registro_seguimiento = $continuaruta2;
        $this->_view->continuaruta = $continuaruta; // Se einsatcia el modelos
        $this->_view->titulo = 'Seguimiento Ruta';
        $this->_view->renderizar('seguimiento_ruta', 'trafico');
        // $this->_view->renderizar('seguirruta', 'trafico');
        //$this->_view->renderizar('registro_seguimiento', 'trafico');
    }

    //Ventanas
    public function seguimiento()
    {
        $this->_view->titulo = 'Seguimiento Ruta';
        $this->_view->renderizar_ventana('seguimiento_ruta', 'control_ruta');
        // $this->_view->renderizar_ventana('seguimiento', 'control_ruta');
    }

    public function rutas()
    {
        $this->_view->titulo = 'Gestión de Rutas';
        $this->_view->renderizar_ventana('gestion_rutas', 'control_ruta');
        // $this->_view->renderizar_ventana('seguimiento', 'control_ruta');
    }

    //Funcion para cargar los filtros
    public function crear_filtro()
    {
        $ventana = $_POST['param1'];
        $this->_filtros = $this->_view->Cargar_Filtros_ventana($ventana);
        echo json_encode($this->_filtros);
    }

    public function reporte_email()
    {
        $automatico = $this->loadModel('iniciar_ruta'); //se añade el modelo a usar
        $this->_view->automatico = $automatico; // Se einsatcia el modelos
        $this->_view->titulo = 'Email Gestión';
        $this->_view->renderizar('reporte_email', 'trafico');
    }

    public function reporte_email_automatico()
    {
        $automatizar = $this->loadModel('iniciar_ruta'); //se añade el modelo a usar
        $this->_view->automatizar = $automatizar; // Se einsatcia el modelos
        $this->_view->titulo = 'Emails Automático';
        // $this->_view->renderizar('reporte_email_automatico', 'trafico');
        $this->_view->renderizar('email', 'trafico');
    }

    public function llegada_trafico()
    {
        $continuaruta = $this->loadModel('tableroseguimiento');
        $this->_view->continuaruta = $continuaruta; // Se einsatcia el modelos
        $this->_view->titulo = 'Llegadas Manifiestos';
        $this->_view->renderizar('llegada_trafico', 'control_ruta');
    }

    public function salida_trafico()
    {
        $continuaruta = $this->loadModel('tableroseguimiento');
        $this->_view->continuaruta = $continuaruta; // Se einsatcia el modelos
        $this->_view->titulo = 'Salidas de Manifiestos';
        $this->_view->renderizar('salida_trafico', 'control_ruta');
    }

    public function manifiesto_salida()
    {
        $continuaruta = $this->loadModel('tableroseguimiento');
        $this->_view->continuaruta = $continuaruta; // Se einsatcia el modelos
        $this->_view->titulo = 'Detalle Manifiesto Salida';
        $this->_view->renderizar('manifiesto_salida', 'control_ruta');
    }

    //registrar seguimiento
    public function registar_seguimiento()
    {
        $continuaruta = $this->loadModel('iniciar_ruta'); //se añade el modelo a usar
        $this->_view->continuaruta = $continuaruta; // Se einsatcia el modelos
        $this->_view->titulo = 'Seguimiento Ruta';
        //$this->_view->renderizar('seguirruta', 'trafico');
        $this->_view->renderizar('registro_seguimiento', 'trafico');
    }

    public function historico_seguimiento()
    {
        $continuaruta = $this->loadModel('tableroseguimiento');
        $this->_view->continuaruta = $continuaruta; // Se einsatcia el modelos
        $this->_view->titulo = 'Historial Seguimiento';
        $this->_view->renderizar('historico_seguimiento', 'control_ruta');
    }

    public function seguimiento_historia()
    {
        $continuaruta = $this->loadModel('tableroseguimiento');
        $this->_view->continuaruta = $continuaruta; // Se einsatcia el modelos
        $this->_view->titulo = 'Historial Seguimiento Vehicular';
        $this->_view->renderizar('seguimiento_historial', 'control_ruta');
    }

    public function agencias()
    {
        $this->dato2 = $this->_modelo->consulta_agencia();
        echo json_encode($this->dato2);
    }

    public function filtro_ciudad()
    {
        $this->dato2 = $this->_modelo->consulta_municipios();
        echo json_encode($this->dato2);
    }

    public function clientes()
    {
        $this->dato2 = $this->_modelo->consulta_clientes();
        echo json_encode($this->dato2);
    }

    public function conductor()
    {
        $this->dato2 = $this->_modelo->consulta_conductor();
        echo json_encode($this->dato2);
    }

    public function Consulta_Tabla()
    {
        $nummani = $_POST["nummani"];
        $tipomnf = $_POST["tipomnf"];
        $ffecha = $_POST["ffecha"];
        $agenci = $_POST["agenci"];
        $origen = $_POST["origen"];
        $desti = $_POST["desti"];
        $fcliente = $_POST["fcliente"];
        $fechaultima = $_POST["fechaultima"];
        $fconductor = $_POST["fconductor"];
        $this->dato2 = $this->_modelo->consulta_Datos($nummani, $tipomnf, $ffecha, $agenci, $origen, $desti, $fcliente, $fechaultima, $fconductor);
        echo json_encode($this->dato2);
    }

    // public function Datos_SinFiltro()
    // {
    //     $this->dato2 = $this->_modelo->Datos_SinFiltro();
    //     echo json_encode($this->dato2);
    // }

    // public function Contadores_Manifiestos()
    // {
    //     $this->contadores = $this->_modelo->Contadores_SinFiltros();
    //     echo json_encode($this->contadores);
    // }

    // public function Datos_llegada()
    // {
    //     $this->_llegada = $this->_modelo->listar_seguimientos_llegada();
    //     echo json_encode($this->_llegada);
    // }


    public function Dato_salida()
    {
        $this->_salida = $this->_modelo->listar_seguimientos_salida();
        echo json_encode($this->_salida);
    }

    public function punto()
    {
        $cod_inicio = $_POST['codini'];
        $this->_punto = $this->_modelo->Traer_codigo_punto($cod_inicio);
        echo json_encode($this->_punto);
    }

    public function finalziar_Seguimiento()
    {
        $maniesto = $_POST['maniesto'];
        $cod_inicio = $_POST['cod_inicio'];
        $cod_punto = $_POST['cod_punto'];
        $this->_finalizar = $this->_modelo->Finalizar_seguimiento_trafico($maniesto, $cod_inicio, $cod_punto);
        echo json_encode($this->_finalizar);
    }

    public function Buscar_manifiesto()
    {
        $dato = $_POST['datos'];
        $this->_filtro = $this->_modelo->Filtro_Mnifiesto($dato);
        echo json_encode($this->_filtro);
    }

    public function Buscar_manifiesto_llegada()
    {
        $dato = $_POST['datos'];
        $this->_filtro_llegada = $this->_modelo->Filtro_Mnifiesto_llegada($dato);
        echo json_encode($this->_filtro_llegada);
    }

    public function Redireccionar()
    {
        // $tmpIdmenu = $_GET['idmenu'];
        $id_manifiesto = 0;
        if (empty($_POST['id_manifiesto'])) {
            //El id no existe
            $tmpIdmenu = 0;
        } else if ($_POST['id_manifiesto'] == 0) {
            // Ingresa a un menu
            $tmpIdmenu = $_POST['id_manifiesto'];
        } else {
            // El id ya fue utilizado
            $tmpIdmenu = $_POST['id_manifiesto'];
        }
        // $id_manifiesto=$_POST["id_manifiesto"];

        $this->_view->titulo = 'Seguimiento Ruta';
        $this->_view->renderizar('registro_seguimiento', 'trafico');
    }

    public function Historial_Seguimiento()
    {
        $tipo = $_POST["tipo"];
        $num_manifiesto = $_POST["num_manifiesto"];
        $fecha_final = $_POST["fecha_final"];
        $fecha_inicial = $_POST["fecha_inicial"];
        $cliente = $_POST["cliente"];
        $this->_filtro_historico = $this->_modelo->Historial_Seguimiento($tipo, $num_manifiesto, $fecha_inicial, $fecha_final, $cliente);
        echo json_encode($this->_filtro_historico);
    }

    public function seguimiento_cabecera()
    {
        $manifiesto = $_POST["manifiesto"];
        $this->_filtro_seguimiento = $this->_modelo->seguimiento_cabecera($manifiesto);
        echo json_encode($this->_filtro_seguimiento);
    }

    public function seguimiento_historial()
    {
        $manifiesto = $_POST["manifiesto"];
        $this->_filtro_seguimiento = $this->_modelo->seguimiento_historia($manifiesto);
        echo json_encode($this->_filtro_seguimiento);
    }

    /* envair email */
    public function Enviarl_email()
    {

        $this->_envio_email = $this->_modelo->enviar_correo_automatico();
        // $clientes = json_decode($_POST['clientes'], true); // Decodifica el JSON en un array
        // $manifiesto = $_POST['manifiesto']; 
        // $this->_envio_email = $this->_modelo->enviar_correo_automatico($clientes,$manifiesto);
        echo json_encode($this->_envio_email);
    }
}
