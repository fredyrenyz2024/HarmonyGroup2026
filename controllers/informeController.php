<?php

class informeController extends Controller
{
    private $_modelo;
    private $_listar_origenes;
    private $_listar_destinos;
    private $_listar_clientes;
    private $_listar_conductores;
    private $_listar_placas_asignadas;
    private $_listar_placas_fac;
    private $_informe_calidad;
    private $_informe_operacion;
    private $_informe_precintos;
    private $_informe_totales;
    private $_informe_totales_manifiestos;
    private $_informe_totales_anticipos;
    private $_lista_remesas_informe;
    private $_busqueda_cliente;
    private $_lista_cliente;
    private $_lista_meses;
    private $_informe_servicios_especiales;
    private $_informe_estudios_seguridad;
    private $_informe_responsables_placa;
    private $_responsable_vehiculo;
    private $_informe_pedidos;
    private $_informe_cumplidos;
    private $_informe_historico_despachos;
    private $_informe_vehiculos;

    public function __construct()
    {
        parent::__construct();
        $this->_modelo = $this->loadModel('informe');
    }

    public function index()
    {
        $this->_view->titulo = 'Informes de Remesas';
        $this->_view->renderizar('index', 'informe');
    }

    public function informe_general()
    {
        $this->_view->titulo = 'Informe General';
        $this->_view->renderizar('informe_general', 'informe');
    }

    public function informe_placas_asignadas()
    {
        $this->_view->titulo = 'Informe de Placas asigandas';
        $this->_view->renderizar('informe_placas_asignadas', 'informe');
    }

    public function informe_facturacion()
    {
        $this->_view->titulo = 'Informe de Facturación';
        $this->_view->renderizar('informe_facturacion', 'informe');
    }
    public function informe_calidad()
    {
        $this->_view->titulo = 'Informe de Calidad';
        $this->_view->renderizar('informe_calidad', 'informe');
    }
    public function informe_operacion()
    {
        $this->_view->titulo = 'Informe de Operación';
        $this->_view->renderizar('informe_operacion', 'informe');
    }
    public function informe_precintos()
    {
        $this->_view->titulo = 'Informe de Precintos';
        $this->_view->renderizar('informe_precintos', 'informe');
    }

    public function informe_gerencia()
    {
        $this->_view->titulo = 'Informe de Gerencia';
        $this->_view->renderizar('informe_gerencial', 'informe');
    }
    public function informe_servicios_especiales()
    {
        $this->_view->titulo = 'Informe de Servicios Especiales';
        $this->_view->renderizar('informe_servicio_especIal', 'informe');
    }

    public function informe_estudios_seguridad()
    {
        $this->_view->titulo = 'Informe de Estudios de seguridad';
        $this->_view->renderizar('informe_estudio_seguridad', 'informe');
    }

    public function informe_responsable_vehiculo()
    {
        $this->_view->titulo = 'Informe del Responsable Vehículo';
        $this->_view->renderizar('informe_responsable', 'informe');
    }

    public function informe_pedido()
    {
        $this->_view->titulo = 'Informe de pedidos';
        $this->_view->renderizar('informe_pedido', 'informe');
    }
    public function informe_cumplido()
    {
        $this->_view->titulo = 'Informe de cumplidos';
        $this->_view->renderizar('informe_cumplido', 'informe');
    }
    public function informe_despachos()
    {
        $this->_view->titulo = 'Historico de despachos';
        $this->_view->renderizar('informe_historico_despachos', 'informe');
    }

    public function informe_vehiculos()
    {
        $this->_view->titulo = 'Historico de vehiculos';
        $this->_view->renderizar('informe_vehiculos', 'informe');
    }
    
    public function informe_instruccion()
    {
        $this->_view->titulo = 'Historico de Instrucciones';
        $this->_view->renderizar('informe_instrccion', 'informe');
    }

    public function Aplicar_Filtro()
    {
        $FECHA_INCIAL = $_POST['fecha_inicial'];
        $FECHA_FINAL = $_POST['fecha_final'];
        $NUM_REMESA = $_POST['num_remesa'];
        $NUN_MANIFIESTO = $_POST['num_remision'];
        // $ESTADO_REMESA = $_POST['estado_remesa'];
        $ESTADO_REMESA = '';

        $datos = $this->_modelo->Aplicar_Filtro($FECHA_INCIAL, $FECHA_FINAL, $NUM_REMESA, $NUN_MANIFIESTO);
        $resultado = $datos;
        $json = [];
        foreach ($resultado as $row) {
            $json[] = array(
                'REMESA_ID' => $row['REMESA_ID'],
                'MANIFIESTO_ID' => $row['MANIFIESTO_ID'],
                $ESTADO_MANIFIESTO = ($row['ESTADO_MANIFIESTO'] == 1) ? 'Activo' : 'Inactivo',
                'ESTADO_MANIFIESTO' => $ESTADO_MANIFIESTO,
                'AGENCIA' => $row['AGENCIA'],
                'FECHA_REMESA' => $row['FECHA_REMESA'],
                'NOMBRE_CLIENTE' => $row['NOMBRE_CLIENTE'],
                $FECHA_CUMPLIDO = ($row['FECHA_CUMPLIDO'] == null) ? "00-00-0000" : $row['FECHA_CUMPLIDO'],
                'FECHA_CUMPLIDO' => $FECHA_CUMPLIDO,
                $HORA_CUMPLIDO = ($row['HORA_CUMPLIDO'] == null) ? "00:00:00" : $row['HORA_CUMPLIDO'],
                'HORA_CUMPLIDO' => $HORA_CUMPLIDO,
                // 'PESO_CUMPLIDO' => number_format($row['PESO_CUMPLIDO']),
                'PESO_CUMPLIDO' => $row['PESO_CUMPLIDO'],
                $USUARIO_CUMPLIDO = ($row['USUARIO_CUMPLIDO'] == null) ? " " : $row['USUARIO_CUMPLIDO'],
                'USUARIO_CUMPLIDO' => $USUARIO_CUMPLIDO,
                $PRECINTOS = ($row['SERIE_PRECINTOS'] == null) ? '0.000' : $row['SERIE_PRECINTOS'],
                'SERIE_PRECINTOS' => $PRECINTOS,
                'VALOR_DECLARADO' => number_format($row['VALOR_DECLARADO'], 2, ",", "."),
                // 'VALOR_DECLARADO_REMESA' => number_format($row['VALOR_DECLARADO_REMESA'], 2, ",", "."),
                'VALOR_DECLARADO_REMESA' => number_format($row['VALOR_REMESA'], 2, ",", "."),
                $SERVICIO_ESPECIAL = ($row['TIPO_SERVICIO'] == null) ? 'SIN SERVICIO' : $row['TIPO_SERVICIO'],
                'TIPO_SERVICIO' => $SERVICIO_ESPECIAL,
                'PLACA' => $row['PLACA'],
                'NOMBRES_CONDUCTOR' => $row['NOMBRES_CONDUCTOR'],
                $PRIMER_APELLIDO = ($row['PRIMER_APELLIDO'] == null) ? ' ' : $row['PRIMER_APELLIDO'],
                'PRIMER_APELLIDO' => $PRIMER_APELLIDO,
                $SEGUNDO_APELLIDO = ($row['SEGUNDO_APELLIDO'] == null) ? ' ' : $row['SEGUNDO_APELLIDO'],
                'SEGUNDO_APELLIDO' => $SEGUNDO_APELLIDO,
                'CANTIDAD' => $row['CANTIDAD'],
                'VOLUMEN_MERCANCIA' => $row['VOLUMEN_MERCANCIA'],
                'PESO_REMESA' => $row['PESO_REMESA'],
                'REMITENTE' => $row['REMITENTE'],
                'DESTINATARIO' => $row['DESTINATARIO'],
                $CONTADO = ($row['CONTADO'] == 0) ? 'NO' : 'SI',
                'CONTADO' => $CONTADO,
                $CONTRA_ENTREGA = ($row['CONTRA_ENTREGA'] == 0) ? 'NO' : 'SI',
                'CONTRA_ENTREGA' => $CONTRA_ENTREGA,
                $ORIGEN = $row['MUNICIPIO_ORIGEN'] . '/' . $row['DEPARTAMENTO_ORIGEN'],
                'ORIGEN' => $ORIGEN,
                $DESTINO = $row['MUNICIPIO_DESTINO'] . '/' . $row['DEPARTAMENTO_DESTINO'],
                'DESTINO' => $DESTINO,
                'ORDER_SERVICIO' => $row['ORDER_SERVICIO'],
                $ESTADO_REMESA = ($row['ESTADO_REMESA'] == 1) ? 'Registrada' : 'Anulada',
                'ESTADO_REMESA' => $ESTADO_REMESA,
                'CONTENIDO' => $row['CONTENIDO'],
                'OBSERVACION_DESTINATARIO' => $row['OBSERVACION_DESTINATARIO'],
                'COMERCIAL' => $row['COMERCIAL'],
            );
        }
        $jsonstring = json_encode($json);
        echo $jsonstring;
    }

    /* Funciones para crear leinforme general */

    public function Listar_origen()
    {
        $this->_listar_origenes = $this->_modelo->Listar_origenes();
        echo json_encode($this->_listar_origenes);
    }

    public function Listar_destino()
    {
        $this->_listar_destinos = $this->_modelo->Listar_destinos();
        echo json_encode($this->_listar_destinos);
    }

    public function Listar_cliente()
    {
        $this->_listar_clientes = $this->_modelo->Listar_Clientes();
        echo json_encode($this->_listar_clientes);
    }

    public function Listar_conductor()
    {
        $this->_listar_conductores = $this->_modelo->Listar_Conductores();
        echo json_encode($this->_listar_conductores);
    }

    public function listar_placas_asignadas()
    {
        $fecha_inicial = $_POST['fecha_inicial'];
        $fecha_final = $_POST['fecha_final'];
        $this->_listar_placas_asignadas = $this->_modelo->Listar_Placas_Asignadas($fecha_inicial, $fecha_final);
        echo json_encode($this->_listar_placas_asignadas);
    }

    public function listar_consulta_facturacion()
    {
        $fecha_inicial = $_POST['fecha_inicial'];
        $fecha_final = $_POST['fecha_final'];
        $this->_listar_placas_fac = $this->_modelo->Listar_Placas_Fac($fecha_inicial, $fecha_final);
        echo json_encode($this->_listar_placas_fac);
    }

    public function  generar_informe_calidad()
    {
        $fecha_inicial = $_POST['fecha_inicial'];
        $fecha_final = $_POST['fecha_final'];
        $this->_informe_calidad = $this->_modelo->Informe_Calidad($fecha_inicial, $fecha_final);
        echo json_encode($this->_informe_calidad);
    }

    public function generar_informe_operacion()
    {
        $fecha_inicial = $_POST['fecha_inicial'];
        $fecha_final = $_POST['fecha_final'];
        $this->_informe_operacion = $this->_modelo->Informe_operacion($fecha_inicial, $fecha_final);
        echo json_encode($this->_informe_operacion);
    }

    public function generar_informe_precintos()
    {
        $fecha_inicial = $_POST['fecha_inicial'];
        $fecha_final = $_POST['fecha_final'];
        $this->_informe_precintos = $this->_modelo->Informe_precintos($fecha_inicial, $fecha_final);
        echo json_encode($this->_informe_precintos);
    }

    #Informe de remesas en tablero de gerencia
    public function generar_informe_totales()
    {
        $fecha_inicial = $_POST['fecha_inicial'];
        $fecha_final = $_POST['fecha_final'];
        $cliente = isset($_POST['cliente']) ? $_POST['cliente'] : '';
        $filtro = $_POST['filtro'];
        $this->_informe_totales = $this->_modelo->Informe_Totales($fecha_inicial, $fecha_final, $cliente, $filtro);
        $this->_informe_totales_manifiestos = $this->_modelo->InformeTotalesManifiestos($fecha_inicial, $fecha_final, $cliente, $filtro);
        $this->_informe_totales_anticipos = $this->_modelo->InformeTotalesAnticipos($fecha_inicial, $fecha_final, $cliente, $filtro);
        $datos = ["Remesas" => $this->_informe_totales, "Manifiestos" => $this->_informe_totales_manifiestos, "Anticipos" => $this->_informe_totales_anticipos];
        echo json_encode($datos);
    }

    public function listar_remesas_informe()
    {
        $fecha_inicial = $_POST['fecha_inicial'];
        $fecha_final = $_POST['fecha_final'];
        $this->_lista_remesas_informe = $this->_modelo->Listar_remesas_general($fecha_inicial, $fecha_final);
        echo json_encode($this->_lista_remesas_informe);
    }

    public function listar_manifiestos_informe()
    {
        $fecha_inicial = $_POST['fecha_inicial'];
        $fecha_final = $_POST['fecha_final'];
        $this->_lista_remesas_informe = $this->_modelo->Listar_manifiestos_general($fecha_inicial, $fecha_final);
        echo json_encode($this->_lista_remesas_informe);
    }

    public function listar_anticipos_informe()
    {
        $fecha_inicial = $_POST['fecha_inicial'];
        $fecha_final = $_POST['fecha_final'];
        $this->_lista_remesas_informe = $this->_modelo->Listar_anticipos_general($fecha_inicial, $fecha_final);
        echo json_encode($this->_lista_remesas_informe);
    }

    public function listar_remesas_informe_cliente()
    {
        $fecha_inicial = $_POST['fecha_inicial'];
        $fecha_final = $_POST['fecha_final'];
        $cliente_id = $_POST['cliente_id'];
        $this->_lista_remesas_informe = $this->_modelo->Listar_remesas_general_cliente($fecha_inicial, $fecha_final, $cliente_id);
        echo json_encode($this->_lista_remesas_informe);
    }

    public function lista_remesas_cliente()
    {
        $fecha_inicial = $_POST['fecha_inicial'];
        $fecha_final = $_POST['fecha_final'];
        $cliente_id = $_POST['cliente_id'];
        // $pagina = isset($_POST['pagina']) ? intval($_POST['pagina']) : 1;
        // $limite = isset($_POST['limite']) ? intval($_POST['limite']) : 10;

        $this->_lista_remesas_informe = $this->_modelo->Listar_remesas_cliente($fecha_inicial, $fecha_final, $cliente_id);
        // $this->_lista_remesas_informe = $this->_modelo->Listar_remesas_cliente($fecha_inicial, $fecha_final, $cliente_id, $pagina, $limite);
        echo json_encode($this->_lista_remesas_informe);
    }

    public function lista_manifiestos_cliente()
    {
        $fecha_inicial = $_POST['fecha_inicial'];
        $fecha_final = $_POST['fecha_final'];
        $cliente_id = $_POST['cliente_id'];
        // $pagina = isset($_POST['pagina']) ? intval($_POST['pagina']) : 1;
        // $limite = isset($_POST['limite']) ? intval($_POST['limite']) : 10;

        $this->_lista_remesas_informe = $this->_modelo->Listar_manifiestos_cliente($fecha_inicial, $fecha_final, $cliente_id);
        // $this->_lista_remesas_informe = $this->_modelo->Listar_remesas_cliente($fecha_inicial, $fecha_final, $cliente_id, $pagina, $limite);
        echo json_encode($this->_lista_remesas_informe);
    }

    public function lista_anticipos_cliente()
    {
        $fecha_inicial = $_POST['fecha_inicial'];
        $fecha_final = $_POST['fecha_final'];
        $cliente_id = $_POST['cliente_id'];
        // $pagina = isset($_POST['pagina']) ? intval($_POST['pagina']) : 1;
        // $limite = isset($_POST['limite']) ? intval($_POST['limite']) : 10;

        $this->_lista_remesas_informe = $this->_modelo->Listar_anticipos_cliente($fecha_inicial, $fecha_final, $cliente_id);
        // $this->_lista_remesas_informe = $this->_modelo->Listar_remesas_cliente($fecha_inicial, $fecha_final, $cliente_id, $pagina, $limite);
        echo json_encode($this->_lista_remesas_informe);
    }

    public function Buscar_cliente()
    {
        $busqueda = $_POST['busqueda'];
        $this->_busqueda_cliente = $this->_modelo->Buscar_cliente($busqueda);
        echo json_encode($this->_busqueda_cliente);
    }

    public function listar_clientes()
    {
        $this->_lista_cliente = $this->_modelo->Listar_clientes_seguimiento();
        echo json_encode($this->_lista_cliente);
    }

    /* Listado de los meses para aplicar el filtro */
    public function listar_meses_filtro()
    {
        $this->_lista_meses = $this->_modelo->listar_meses_informe();
        echo json_encode($this->_lista_meses);
    }

    public function listar_kpi_mes()
    {
        $mes = $_POST['mes'];
        $this->_lista_meses = $this->_modelo->listar_mes_kpi($mes);
        echo json_encode($this->_lista_meses);
    }

    /* Informe de servicios especiales */

    public function Informes_servicios_especiales()
    {
        $fecha_inicial = $_POST['fecha_inicial'];
        $fecha_final = $_POST['fecha_final'];
        $this->_informe_servicios_especiales = $this->_modelo->Informe_servicios_especiales($fecha_inicial, $fecha_final);
        echo json_encode($this->_informe_servicios_especiales);
    }

    //Informde de servicios especiales

    public function Informes_estudios_seguridad()
    {
        $fecha_inicial = $_POST['fecha_inicial'];
        $fecha_final = $_POST['fecha_final'];
        $this->_informe_estudios_seguridad = $this->_modelo->Informe_estudios_seguridad($fecha_inicial, $fecha_final);
        echo json_encode($this->_informe_estudios_seguridad);
    }
    public function Informes_estudios_estados()
    {
        $fecha_inicial = $_POST['fecha_inicial'];
        $fecha_final = $_POST['fecha_final'];
        $estado = $_POST['estado'];
        $this->_informe_estudios_seguridad = $this->_modelo->Informe_estudios_seguridad_estados($fecha_inicial, $fecha_final, $estado);
        echo json_encode($this->_informe_estudios_seguridad);
    }
    public function Informes_responsables_placas()
    {
        $fecha_inicial = $_POST['fecha_inicial'];
        $fecha_final = $_POST['fecha_final'];
        $responsable = $_POST['responsable'] === '' ? '' : $_POST['responsable'];
        $this->_informe_responsables_placa = $this->_modelo->Informe_responsable_placas($fecha_inicial, $fecha_final, $responsable);
        echo json_encode($this->_informe_responsables_placa);
    }

    public function Consultar_responsables_vehiculo()
    {
        $this->_responsable_vehiculo = $this->_modelo->Consultar_responsables_vehiculo();
        echo json_encode($this->_responsable_vehiculo);
    }

    public function Informe_pedidos()
    {
        $num_pedido = $_POST['num_pedido'];
        $this->_informe_pedidos = $this->_modelo->Informe_pedidos(/* $fecha_inicial, $fecha_final, */$num_pedido);
        echo json_encode($this->_informe_pedidos);
    }

    public function Informe_Cumplidos()
    {
        $fecha_inicial = $_POST['fecha_inicial'];
        $fecha_final = $_POST['fecha_final'];
        $num_pedido = $_POST['num_pedido'];
        $this->_informe_cumplidos = $this->_modelo->Informe_cumplidos($fecha_inicial, $fecha_final, $num_pedido);
        // $this->_informe_cumplidos = $this->_modelo->Informe_cumplidos();
        echo json_encode($this->_informe_cumplidos);
    }
    public function Historico_Seguimiento()
    {
        $fecha_inicial = $_POST['fecha_inicial'];
        $fecha_final = $_POST['fecha_final'];
        $criterio_busqueda = $_POST['criterio_busqueda'];
        $this->_informe_historico_despachos = $this->_modelo->Informe_historico_seguimiento($fecha_inicial, $fecha_final, $criterio_busqueda);
        // $this->_informe_cumplidos = $this->_modelo->Informe_cumplidos();
        echo json_encode($this->_informe_historico_despachos);
    }

    public function Informe_Vehiculos_Activos()
    {
        $fecha_inicial = $_POST['fecha_inicial'];
        $fecha_final = $_POST['fecha_final'];
        $this->_informe_vehiculos = $this->_modelo->Informe_Vehiculos($fecha_inicial, $fecha_final);
        echo json_encode($this->_informe_vehiculos);
    }

    public function generar_informe_instruccion_facturacion()
    {
        $fecha_inicial = $_POST['fecha_inicial'];
        $fecha_final = $_POST['fecha_final'];
        $criterio_busqueda = $_POST['criterio_busqueda'];
        $this->_informe_historico_despachos = $this->_modelo->Informe_instruccion_facturacion($fecha_inicial, $fecha_final, $criterio_busqueda);
        // $this->_informe_cumplidos = $this->_modelo->Informe_cumplidos();
        echo json_encode($this->_informe_historico_despachos);
    }
}
