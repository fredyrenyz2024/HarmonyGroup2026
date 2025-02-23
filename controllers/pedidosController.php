<?php
date_default_timezone_set('America/Bogota');

class pedidosController extends Controller
{
    private $_modelo;
    private $_listar_clientes;
    private $_listar_tipos_trazabilidad;
    private $_listar_opciones;
    private $_insertar_pedido_trazabilidad;
    private $_listar_pedidos;
    private $_detalle_pedidos;
    private $_detalle_tipo_pedidos;
    private $_validar_refernecia_pedidos;
    private $_actualizar_pedido_trazabilidad;
    private $_listar_pedido_cliente;
    private $_insertar_solicitud_pedido;
    private $_listar_solicitudes_cliente;
    private $_listar_puntos_parametros_gestion;
    private $_listar_puntos_opcion_parametros_gestion;
    private $_insertar_gestion_pedido;
    private $_detalle_gestion;
    private $_actualizar_publicado;
    private $_buscar_usuario;
    private $_lista_actividades;
    private $_listar_estados;
    private $_detalle_actividad_gestion;
    private $_numero_actividades;
    private $_listar_plantillas;
    private $_pintar_plantilla;
    private $_pintar_deatalle_actividades;
    private $_compartidos_conmigo;
    private $_lista_actividades_compartidas;
    private $_buscar_pedidos;
    private $_validar_dependencias;
    private $_listar_usuarios_responsables;
    private $_actualizar_responsable;
    private $listar_responsables;
    private $insertar_cancelacion_pedido;

    public function __construct()
    {
        parent::__construct();
        $this->_modelo = $this->loadModel('pedidos');
    }

    public function index()
    {
        $pedido = $this->loadModel('pedidos');
        $this->_view->pedido = $pedido;
        $this->_view->titulo = 'Pedidos Trazabilidad';
        $this->_view->renderizar('index', 'pedidos');
    }

    public function detalle()
    {
        $pedido = $this->loadModel('pedidos');
        $this->_view->pedido = $pedido;
        $this->_view->titulo = 'Ver detalle pedido';
        $this->_view->renderizar('detalle', 'pedidos');
    }

    public function gestion()
    {
        $pedido = $this->loadModel('pedidos');
        $this->_view->pedido = $pedido;
        $this->_view->titulo = 'Gestion de pedido';
        $this->_view->renderizar('gestion', 'pedidos');
    }

    /* Funciones para cargar las vistas de los pedidos compartidos con los usuarios responsables */

    public function compartidos_conmigo()
    {
        $pedido = $this->loadModel('pedidos');
        $this->_view->pedido = $pedido;
        $this->_view->titulo = 'Compartidos Conmigo';
        $this->_view->renderizar('compartidos_conmigo', 'pedidos');
    }

    public function detalle_compartidos()
    {
        $pedido = $this->loadModel('pedidos');
        $this->_view->pedido = $pedido;
        $this->_view->titulo = 'Detalle compartidos';
        $this->_view->renderizar('detalle_compartidos', 'pedidos');
    }

    public function Listar_Clientes()
    {
        $this->_listar_clientes = $this->_modelo->Listar_Cliente();
        echo json_encode($this->_listar_clientes);
    }

    public function Listar_tipos_Seguimiento()
    {
        $this->_listar_tipos_trazabilidad = $this->_modelo->Listar_Tipo_trazabilidad();
        echo json_encode($this->_listar_tipos_trazabilidad);
    }

    public function Listar_Opciones()
    {
        $id = $_POST["id"];
        $this->_listar_opciones = $this->_modelo->Listar_tipo_opcion_trazabilidad($id);
        echo json_encode($this->_listar_opciones);
    }

    public function validar_numero_referencia()
    {
        $referencia = $_POST["referencia"];
        $cliente = $_POST["cliente"];
        $this->_validar_refernecia_pedidos = $this->_modelo->Validar_referenia($referencia, $cliente);
        echo json_encode($this->_validar_refernecia_pedidos);
    }

    public function Insertar_trazabilidad_pedido()
    {
        $datos = [
            "cliente" => $_POST["cliente"],
            "referencia" => $_POST["referencia"],
            "observacion" => $_POST["observacion"],
            "procesos" => json_decode($_POST["nota"]),
            "procesos_detalle" => json_decode($_POST["nota_detalle"]),
            "posiciones_detalle" => json_decode($_POST["posiciones_detalle"]),
            "usuarios_responsable" => json_decode($_POST["usuarios_responsable"]),
            "tipo" => $_POST["tipo"],
            "configurar_plantilla" => $_POST["configurar_plantilla"],
            "nombre_plantilla" => $_POST["nombre_plantilla"],
        ];
        $this->_insertar_pedido_trazabilidad = $this->_modelo->Insertar_pedido_trazabilidad($datos);
        echo json_encode($this->_insertar_pedido_trazabilidad);
    }

    public function Listar_pedidos()
    {
        // $fecha_inicial = $_POST["fecha_inicial"];
        // $fecha_final = $_POST["fecha_final"];
        // $this->_listar_pedidos = $this->_modelo->Listar_Pedidos($fecha_inicial, $fecha_final);
        $this->_listar_pedidos = $this->_modelo->Listar_Pedidos();
        echo json_encode($this->_listar_pedidos);
    }

    public function Comportaidos_Conmigo()
    {
        $this->_compartidos_conmigo = $this->_modelo->Listar_pedidos_por_responsable();
        echo json_encode($this->_compartidos_conmigo);
    }

    public function Listar_actividades_gestion()
    {
        $nundoc = $_POST["nundoc"];
        $this->_lista_actividades = $this->_modelo->Lista_de_actividades($nundoc);
        echo json_encode($this->_lista_actividades);
    }

    public function Listar_actividades_gestion_compartidos()
    {
        $nundoc = $_POST["nundoc"];
        $this->_lista_actividades_compartidas = $this->_modelo->Lista_de_actividades_compartidos($nundoc);
        echo json_encode($this->_lista_actividades_compartidas);
    }

    public function Ver_detalle_pedidos()
    {
        $nundoc = $_POST["nundoc"];
        $this->_detalle_pedidos = $this->_modelo->Detalle_Pedidos($nundoc);
        echo json_encode($this->_detalle_pedidos);
    }
    public function Ver_detalle_tipo_pedidos()
    {
        $nundoc = $_POST["nundoc"];
        $this->_detalle_tipo_pedidos = $this->_modelo->Detalle_tipo_Pedidos($nundoc);
        echo json_encode($this->_detalle_tipo_pedidos);
    }

    public function Actualizar_trazabilidad_pedido()
    {
        $datos = [
            "nundoc" => $_POST["nundoc"],
            "procesos" => json_decode($_POST["nota"]),
            "procesos_detalle" => json_decode($_POST["nota_detalle"]),
        ];
        $this->_actualizar_pedido_trazabilidad = $this->_modelo->Actualizar_pedido_trazabilidad($datos);
        echo json_encode($this->_actualizar_pedido_trazabilidad);
    }

    public function Listar_pedidos_cliente()
    {
        $cliente = $_POST["cliente"];
        $this->_listar_pedido_cliente = $this->_modelo->Listar_pedidos_clientes($cliente);
        echo json_encode($this->_listar_pedido_cliente);
    }

    public function Insertar_solicitud_pedido()
    {
        $solicitud = $_POST["solicitud"];
        $pedido = $_POST["pedido"];
        $this->_insertar_solicitud_pedido = $this->_modelo->Insertar_solicitud_pedido($solicitud, $pedido);
        echo json_encode($this->_insertar_solicitud_pedido);
    }

    public function Asosiar_solicitud_pedido()
    {
        $cliente = $_POST["cliente_id"];
        $this->_listar_solicitudes_cliente = $this->_modelo->Listar_solicitudes_clientes($cliente);
        echo json_encode($this->_listar_solicitudes_cliente);
    }

    public function listar_puntos_parametros_gestion()
    {
        $nundoc = $_POST["nundoc"];
        $this->_listar_puntos_parametros_gestion = $this->_modelo->Listar_puntos_parametro_gestion($nundoc);
        echo json_encode($this->_listar_puntos_parametros_gestion);
    }

    public function Listar_Puntos_opcion_parametro_gestion()
    {
        $nundoc = $_POST["nundoc"];
        $trazabilidad_id = $_POST["trazabilidad_id"];
        $this->_listar_puntos_opcion_parametros_gestion = $this->_modelo->Listar_puntos_opcion_parametro_gestion($nundoc, $trazabilidad_id);
        echo json_encode($this->_listar_puntos_opcion_parametros_gestion);
    }

    public function Insertar_gestion_pedido()
    {
        $datos = array(
            "nundoc" => $_POST["nundoc"],
            "parametros_pedido" => $_POST["parametros_pedido"],
            "parametros_punto_pedido_opcion" => $_POST["parametros_punto_pedido_opcion"],
            "observacion" => $_POST["observacion"],
            "documento" => (isset($_FILES["documento"])) ? $_FILES["documento"] : $_POST['documento'],
            "publicar" => $_POST["publicar"],
            // "publicar" => (isset($_POST["publicar"])) ? "SI" : "NO",
            "estado" => "ACTIVO",
            "estado_actividad" => $_POST["estado_actividad"],
        );
        $this->_insertar_gestion_pedido = $this->_modelo->Insertar_gestion($datos);
        echo json_encode($this->_insertar_gestion_pedido);
    }

    // Ver dtealle de la gestiones relizadas al pedido
    public function Ver_Detalle_gestion()
    {
        $nundoc = $_POST["nundoc"];
        $this->_detalle_gestion = $this->_modelo->Detalle_gestion($nundoc);
        echo json_encode($this->_detalle_gestion);
    }

    public function ver_detalle_actividad()
    {
        $nundoc = $_POST["nundoc"];
        $actividad = $_POST["actividad"];
        $this->_detalle_actividad_gestion = $this->_modelo->Detalle_gestion_actividad($nundoc, $actividad);
        echo json_encode($this->_detalle_actividad_gestion);
    }

    public function Actualizar_publicado()
    {
        $estado = $_POST["publicado"];
        $id = $_POST["id"];
        $this->_actualizar_publicado = $this->_modelo->Actualizar_publicado($estado, $id);
        echo json_encode($this->_actualizar_publicado);
    }

    public function Buscar_usuario()
    {
        $datos = $_POST['datos'];
        $this->_buscar_usuario = $this->_modelo->Buscar_usaurio_responsable($datos);
        echo json_encode($this->_buscar_usuario);
    }

    public function Progreso_pedido()
    {
        $nundoc = $_POST["nundoc"];
        $this->_numero_actividades = $this->_modelo->Numero_de_actividades($nundoc);
        echo json_encode($this->_numero_actividades);
    }

    public function Listar_Plantillas()
    {
        $this->_listar_plantillas = $this->_modelo->Listar_Plantillas_pedido();
        echo json_encode($this->_listar_plantillas);
    }

    public function Pintar_Plantilla()
    {
        $numdoc_plantilla = $_POST["numdoc_plantilla"];
        $this->_pintar_plantilla = $this->_modelo->Pintar_Plantillas_pedido($numdoc_plantilla);
        echo json_encode($this->_pintar_plantilla);
    }

    public function Listar_actividades_plantilla()
    {
        $nundoc = $_POST["nundoc"];
        $this->_pintar_deatalle_actividades = $this->_modelo->Pintar_Activiaddes_Plantilla($nundoc);
        echo json_encode($this->_pintar_deatalle_actividades);
    }

    public function buscar_pedidos()
    {
        $dato = $_POST['datos'];
        $this->_buscar_pedidos = $this->_modelo->Filtro_Buscar_Pedidos($dato);
        echo json_encode($this->_buscar_pedidos);
    }

    /* Funcion para la consulta de validaciones de las dependencias */

    // public function validar_dependencias()
    // {
    //     $datos = $_POST['actvidad_id'];
    //     $this->_validar_dependencias = $this->_modelo->Validar_dependencias($datos);
    //     echo json_encode($this->_validar_dependencias);
    // }

    public function actualizar_costo()
    {
        $actvidad_id = $_POST['actvidad_id'];
        $valor = $_POST['valor'];
        $nundoc = $_POST['nundoc'];
        $this->_validar_dependencias = $this->_modelo->Actualizar_costo_actividad($actvidad_id, $valor, $nundoc);
        echo json_encode($this->_validar_dependencias);
    }

    /* Listar usuarios responsables */

    public function listar_usuarios_responsables()
    {
        $this->_listar_usuarios_responsables = $this->_modelo->Listar_usaurio_responsable();
        echo json_encode($this->_listar_usuarios_responsables);
    }
    public function actualizar_responsable()
    {
        $actividad_id = $_POST['actividad_id'];
        $responsable_actividad = $_POST['responsable_actividad'];
        $nuevo_responsable = $_POST['nuevo_responsable'];
        $this->_actualizar_responsable = $this->_modelo->actualizar_responsable($actividad_id, $responsable_actividad, $nuevo_responsable);
        echo json_encode($this->_actualizar_responsable);
    }

    public function listar_responsables()
    {
        $this->listar_responsables = $this->_modelo->Consultar_responsables();
        echo json_encode($this->listar_responsables);
    }

    public function insertar_cancelacio_pedido()
    {
        $estado_cancelacion = $_POST["estado_cancelacion"];
        $numdoc = $_POST["numdoc"];
        $referencia = $_POST["referencia"];
        $motivo_cancelacion = $_POST["motivo_cancelacion"];
        $responsable_cancelacion = $_POST["responsable_cancelacion"];
        $datos = [
            "estado_cancelacion" => $estado_cancelacion,
            "numdoc" => $numdoc,
            "referencia" => $referencia,
            "motivo_cancelacion" => $motivo_cancelacion,
            "responsable_cancelacion" => $responsable_cancelacion,
            "fecha_cancelacion" => date('Y-m-d'),
            "hora_cancelacion" => date('H:i:s'),
        ];
        $this->insertar_cancelacion_pedido = $this->_modelo->Insertar_cancelacion_pedido($datos);
        echo json_encode($this->insertar_cancelacion_pedido);
    }
}
