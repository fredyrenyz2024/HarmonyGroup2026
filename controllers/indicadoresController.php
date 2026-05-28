<?php

use PhpParser\Node\Stmt\Echo_;

class indicadoresController extends Controller
{
    public $_modelo;
    public $_filtros;
    private $_listar_graficos_precintos;
    private $_listar_graficos_manifiestos;
    private $_listar_estado_cumplido_manifiestos;
    private $_listar_detalle_manifiestos_agencias;
    private $_detalle_graficos_estudios;
    private $_detalle_solicitudes;
    private $_listar_tipo_vehiculos;
    private $_listar_responsables;
    private $_listar_detalle_vehiculos;
    private $_instrcciones_facturacion;
    private $_instrcciones_remesas;
    private $_get_reporte;
    private $_get_placas;
    private $_get_municipios;
    private $_get_conductores;

    public function __construct()
    {
        parent::__construct();
        $this->_modelo = $this->loadModel('indicadores');
    }

    public function index()
    {
        // $this->_view->unidades_empaque = $unidades_empaque;
        $this->_view->titulo = 'Indicadores de Gestion';
        $this->_view->renderizar('index', 'indicadores');
    }

    /* Cargar filtros */
    public function crear_filtro()
    {
        $ventana = $_POST['param1'];
        $this->_filtros = $this->_view->Cargar_Filtros_ventana($ventana);
        echo json_encode($this->_filtros);
    }

    public function graficos_precintos()
    {
        $this->_view->titulo = 'Graficar los precintos';
        $this->_view->renderizar_ventana('graficos_precintos', 'prefiltro_nacional');
    }

    public function graficos_manifestos()
    {
        $this->_view->titulo = 'Graficar los manifiestos';
        $this->_view->renderizar_ventana('graficos_manifiestos', 'prefiltro_nacional');
    }

    public function graficos_solicitudes_servicio()
    {
        $this->_view->titulo = 'Graficar de las Solicitudes de servicio';
        $this->_view->renderizar_ventana('graficos_solicitudes', 'prefiltro_nacional');
    }

    public function indicadores_solicitudes()
    {
        $this->_view->titulo = 'Graficar de las Solicitudes de estudio';
        $this->_view->renderizar_ventana('indicadores_solicitudes', 'prefiltro_nacional');
    }

    public function indicadores_tipo_vehiculo()
    {
        $this->_view->titulo = 'Graficar de los tipos de vehículos';
        $this->_view->renderizar_ventana('graficos_tipo_vehiculo', 'prefiltro_nacional');
    }

    public function indicador_instrucciones()
    {
        $this->_view->titulo = 'Graficar las Instrucciones';
        $this->_view->renderizar_ventana('graficos_instrucciones', 'prefiltro_nacional');
    }

    public function indicadores_remesas()
    {
        $this->_view->titulo = 'Graficar las remesas con los KPI';
        $this->_view->renderizar_ventana('graficos_remesas', 'indicadores');
    }

    public function indicadores_estudios_seguridad()
    {
        $this->_view->titulo = 'Graficar los estudios de seguridad';
        $this->_view->renderizar_ventana('graficos_estudios', 'indicadores');
    }

    public function analitica_placas_conductores()
    {
        $this->_view->titulo = 'Analitia de Placas y Conductores';
        $this->_view->renderizar_ventana('graficos_analitica', 'indicadores');
    }

    public function analitica_gestion()
    {
        $this->_view->titulo = 'Analitia Gestión Operación';
        $this->_view->renderizar_ventana('graficos_filtros', 'indicadores');
    }

    public function indicador_instruciones_anuladas()
    {
        $this->_view->titulo = 'Analitia de instrucciones anuladas';
        $this->_view->renderizar_ventana('grafico_instruciones_anuladas', 'indicadores');
    }

    public function indicadores_ventas_costos()
    {
        $this->_view->titulo = 'Analitia de ventas y costos';
        $this->_view->renderizar_ventana('graficos_ventas_costo', 'indicadores');
    }

    //Funciones de los graficos de los precintos
    public function Graficos_General_Precintos()
    {
        $this->_listar_graficos_precintos = $this->_modelo->Graficos_General_Precintos();
        echo json_encode($this->_listar_graficos_precintos);
    }

    public function Graficos_Precintos_Agencia()
    {
        $Agencia = $_POST['Agencia'];
        $this->_listar_graficos_precintos = $this->_modelo->Graficos_Agencia_Precintos($Agencia);
        echo json_encode($this->_listar_graficos_precintos);
    }

    public function Graficos_General_manifiestos()
    {
        $Fecha_Inicio = $_POST['Fecha_Inicio'];
        $Fecha_Final = $_POST['Fecha_Final'];

        $this->_listar_graficos_manifiestos = $this->_modelo->Graficos_General_Manifiestos($Fecha_Inicio, $Fecha_Final);
        echo json_encode($this->_listar_graficos_manifiestos);
    }

    public function Graficos_Detalle_Manifiestos()
    {
        $Fecha_Inicio = $_POST['Fecha_Inicio'];
        $Fecha_Final = $_POST['Fecha_Final'];
        $Estado = $_POST['Estado'];

        $this->_listar_graficos_manifiestos = $this->_modelo->Graficos_Detalle_Manifiestos($Fecha_Inicio, $Fecha_Final, $Estado);
        echo json_encode($this->_listar_graficos_manifiestos);
    }

    public function Detalle_Manifiestos_Grafico()
    {
        $Fecha_Inicio = $_POST['Fecha_Inicio'];
        $Fecha_Final = $_POST['Fecha_Final'];
        $this->_listar_graficos_manifiestos = $this->_modelo->Detalle_Manifiestos_Graficos($Fecha_Inicio, $Fecha_Final);
        echo json_encode($this->_listar_graficos_manifiestos);
    }

    public function ObtenerManifiestosCumplido()
    {
        $Estado = $_POST['estado'];
        $Fecha_Inicio = $_POST['fecha_inicio'];
        $Fecha_Final = $_POST['fecha_final'];
        $this->_listar_estado_cumplido_manifiestos = $this->_modelo->Detalle_Manifiestos_Cumplido($Estado, $Fecha_Inicio, $Fecha_Final);
        echo json_encode($this->_listar_estado_cumplido_manifiestos);
    }

    public function ObtenerManifiestosAgencias()
    {
        $Agencia = $_POST['agencia'];
        $Fecha_Inicio = $_POST['fecha_inicio'];
        $Fecha_Final = $_POST['fecha_final'];
        $this->_listar_detalle_manifiestos_agencias = $this->_modelo->Detalle_Manifiestos_Agencia($Agencia, $Fecha_Inicio, $Fecha_Final);
        echo json_encode($this->_listar_detalle_manifiestos_agencias);
    }

    public function Graficos_General_Solicitudes_Servicios()
    {
        $Fecha_Inicio = $_POST['Fecha_Inicio'];
        $Fecha_Final = $_POST['Fecha_Final'];
        $this->_listar_graficos_manifiestos = $this->_modelo->Graficos_General_Solicitudes($Fecha_Inicio, $Fecha_Final);
        echo json_encode($this->_listar_graficos_manifiestos);
    }

    public function Graficos_Estudios_Responsables()
    {
        $Fecha_Inicio = $_POST['Fecha_Inicio'];
        $Fecha_Final = $_POST['Fecha_Final'];
        $Estado = $_POST['estado'];
        $this->_listar_graficos_manifiestos = $this->_modelo->Graficos_Estudio_Responsable($Fecha_Inicio, $Fecha_Final, $Estado);
        echo json_encode($this->_listar_graficos_manifiestos);
    }

    public function Detalle_Responsbale_Estudio()
    {
        $Fecha_Inicio = $_POST['Fecha_Inicio'];
        $Fecha_Final = $_POST['Fecha_Final'];
        $Estado = $_POST['estado'];
        $Responsable = $_POST['idUsuario'];
        $this->_detalle_graficos_estudios = $this->_modelo->Detalle_Estudios_Responsable($Fecha_Inicio, $Fecha_Final, $Estado, $Responsable);
        echo json_encode($this->_detalle_graficos_estudios);
    }

    public function IndicadoresSolicitudes()
    {
        $Fecha_Inicio = $_POST['Fecha_Inicio'];
        $Fecha_Final = $_POST['Fecha_Final'];
        $this->_detalle_graficos_estudios = $this->_modelo->GraficosGeneralIndicadoresSolicitudes($Fecha_Inicio, $Fecha_Final);
        echo json_encode($this->_detalle_graficos_estudios);
    }

    public function Graficos_Solicitudes_Estados()
    {
        $Fecha_Inicio = $_POST['Fecha_Inicio'];
        $Fecha_Final = $_POST['Fecha_Final'];
        $Estado = $_POST['estado'];
        $this->_listar_graficos_manifiestos = $this->_modelo->GraficosSolicitudesPorAgencia($Fecha_Inicio, $Fecha_Final, $Estado);
        echo json_encode($this->_listar_graficos_manifiestos);
    }

    public function Detalle_Solicitud_Servicios()
    {
        $Fecha_Inicio = $_POST['Fecha_Inicio'];
        $Fecha_Final = $_POST['Fecha_Final'];
        $Estado = $_POST['estado'];
        $Agencia = $_POST['agencia'];

        $this->_detalle_solicitudes = $this->_modelo->Detalle_Solicitudes($Fecha_Inicio, $Fecha_Final, $Estado, $Agencia);
        echo json_encode($this->_detalle_solicitudes);
    }

    public function IndicadoresTipoVehiculos()
    {
        $Fecha_Inicio = $_POST['Fecha_Inicio'];
        $Fecha_Final = $_POST['Fecha_Final'];
        $this->_listar_tipo_vehiculos = $this->_modelo->GraficosTipoVehiculos($Fecha_Inicio, $Fecha_Final);
        echo json_encode($this->_listar_tipo_vehiculos);
    }

    public function TipoVehiculosAgencia()
    {
        $Fecha_Inicio     = $_POST['Fecha_Inicio'];
        $Fecha_Final      = $_POST['Fecha_Final'];
        $Configuracion_id = $_POST['configuracion_id'];

        $this->_listar_tipo_vehiculos = $this->_modelo->GraficasTipoVehiculosAgencia(
            $Fecha_Inicio,
            $Fecha_Final,
            $Configuracion_id
        );

        echo json_encode($this->_listar_tipo_vehiculos);
    }

    public function VehiculosPorResponsable()
    {
        $Fecha_Inicio     = $_POST['Fecha_Inicio'];
        $Fecha_Final      = $_POST['Fecha_Final'];
        $Configuracion_id = $_POST['configuracion_id'];

        $this->_listar_responsables = $this->_modelo->GraficasVehiculosPorResponsable(
            $Fecha_Inicio,
            $Fecha_Final,
            $Configuracion_id
        );

        echo json_encode($this->_listar_responsables);
    }

    public function detalleVehiculos()
    {
        $fecha_inicio = $_POST['fecha_inicio'] ?? '2025-07-01';
        $fecha_fin    = $_POST['fecha_fin'] ?? '2025-07-31';

        $this->_listar_detalle_vehiculos = $this->_modelo->obtenerDetalleVehiculos($fecha_inicio, $fecha_fin);

        echo json_encode($this->_listar_detalle_vehiculos);
    }

    // 🔹iNSTRCIONES DE FACUTRACION
    public function InstruccionesFacturacion()
    {
        $fechaInicio = $_POST['Fecha_Inicio'] ?? date("Y-m-01");
        $fechaFinal  = $_POST['Fecha_Final'] ?? date("Y-m-t");

        $this->_instrcciones_facturacion = $this->_modelo->getInstruccionesFacturacion($fechaInicio, $fechaFinal);
        echo json_encode($this->_instrcciones_facturacion);
    }

    // 🔹iNSTRCIONES DE FACUTRACION POR C
    public function FacturacionPorCliente()
    {
        $fechaInicio = $_POST['Fecha_Inicio'] ?? date("Y-m-01");
        $fechaFinal  = $_POST['Fecha_Final'] ?? date("Y-m-t");
        $estado      = $_POST['Estado'] ?? "Completada"; // por defecto facturadas

        $data = $this->_modelo->getFacturacionPorCliente($fechaInicio, $fechaFinal, $estado);

        echo json_encode($data);
    }

    public function FacturacionPorComercial()
    {
        $fechaInicio = $_POST['Fecha_Inicio'] ?? date("Y-m-01");
        $fechaFinal  = $_POST['Fecha_Final'] ?? date("Y-m-t");
        $estado      = $_POST['Estado'] ?? "Completada"; // por defecto facturadas

        $data = $this->_modelo->getFacturacionPorComercial($fechaInicio, $fechaFinal, $estado);

        echo json_encode($data);
    }

    public function InstruccionesRemesas()
    {
        $fechaInicio = $_POST['Fecha_Inicio'] ?? date("Y-m-01");
        $fechaFinal  = $_POST['Fecha_Final'] ?? date("Y-m-t");

        $this->_instrcciones_remesas = $this->_modelo->getInstruccionesRemesas($fechaInicio, $fechaFinal);
        echo json_encode($this->_instrcciones_remesas);
    }

    public function InstruccionesRemesasAgencia()
    {
        $fechaInicio = $_POST['Fecha_Inicio'] ?? date("Y-m-01");
        $fechaFinal  = $_POST['Fecha_Final'] ?? date("Y-m-t");
        $estado      = $_POST['Estado'] ?? "Facturada"; // por defecto facturadas

        $this->_instrcciones_remesas = $this->_modelo->getInstruccionesRemesasAgencia($fechaInicio, $fechaFinal, $estado);
        echo json_encode($this->_instrcciones_remesas);
    }

    public function InstruccionesRemesasCliente()
    {
        $fechaInicio = $_POST['Fecha_Inicio'] ?? date("Y-m-01");
        $fechaFinal  = $_POST['Fecha_Final'] ?? date("Y-m-t");
        $estado      = $_POST['Estado'] ?? "Facturada"; // por defecto facturadas

        $this->_instrcciones_remesas = $this->_modelo->getInstruccionesRemesasClientes($fechaInicio, $fechaFinal, $estado);
        echo json_encode($this->_instrcciones_remesas);
    }

    public function getDetalleRemesa()
    {
        $fechaInicio = $_POST['Fecha_Inicio'] ?? date("Y-m-01");
        $fechaFinal  = $_POST['Fecha_Final'] ?? date("Y-m-t");
        $estado      = $_POST['Estado'] ?? "Facturada"; // por defecto facturadas

        $this->_instrcciones_remesas = $this->_modelo->getDetalleRemesas($fechaInicio, $fechaFinal, $estado);
        echo json_encode($this->_instrcciones_remesas);
    }

    public function EstudiosPrefiltros()
    {
        // Fechas quemadas, puedes pasarlas por GET o POST
        $fecha_inicio = $_POST['Fecha_Inicio'] ?? date("Y-m-01");
        $fecha_fin    = $_POST['Fecha_Final'] ?? date("Y-m-t");
        // $analista    = $_POST['analista'] ?? null;

        // $this->_get_reporte = $this->_modelo->getEstudiosYPrefiltros($fecha_inicio, $fecha_fin, $analista);
        $this->_get_reporte = $this->_modelo->getEstudiosYPrefiltros($fecha_inicio, $fecha_fin);
        echo json_encode($this->_get_reporte);
    }

    public function Detalle_Estudios_Seguridad()
    {
        $fecha_inicio = $_POST['Fecha_Inicio'] ?? date("Y-m-01");
        $fecha_fin    = $_POST['Fecha_Final'] ?? date("Y-m-t");
        $Estado    = $_POST['Estado'];
        $Analista    = $_POST['Analista'];

        $this->_get_reporte = $this->_modelo->DetalleSolicitudesEstudio($Estado, $fecha_inicio, $fecha_fin, $Analista);
        echo json_encode($this->_get_reporte);
    }

    // Lsitar placas apra el filtro
    public function ListarPlacas()
    {
        $this->_get_placas = $this->_modelo->GetPlacasFiltros();
        echo json_encode($this->_get_placas);
    }

    public function ListarMunicipios()
    {
        $this->_get_municipios = $this->_modelo->GetMunicipiosFiltros();
        echo json_encode($this->_get_municipios);
    }

    public function ListarClientes()
    {
        $this->_get_municipios = $this->_modelo->GetClientesFiltros();
        echo json_encode($this->_get_municipios);
    }

    public function ListarConfiguracion()
    {
        $this->_get_municipios = $this->_modelo->GetConfiguracionFiltros();
        echo json_encode($this->_get_municipios);
    }

    public function AnaliticaDatos()
    {
        $fecha_inicio = $_POST['Fecha_Inicio'] ?? date("Y-m-01");
        $fecha_fin    = $_POST['Fecha_Final'] ?? date("Y-m-t");
        $placa       = $_POST['Placa'];
        $conductor       = $_POST['Conductor'];

        $this->_get_reporte = $this->_modelo->DetalleAnaliticaDatos($placa, $conductor, $fecha_inicio, $fecha_fin);
        echo json_encode($this->_get_reporte);
    }

    public function Detalle_AnaliticaDatos()
    {
        $fecha_inicio = $_POST['Fecha_Inicio'] ?? date("Y-m-01");
        $fecha_fin    = $_POST['Fecha_Final'] ?? date("Y-m-t");
        $placa       = $_POST['Placa'];
        $conductor       = $_POST['Conductor'];

        $this->_get_reporte = $this->_modelo->Detalle_Analitica($placa, $conductor, $fecha_inicio, $fecha_fin);
        echo json_encode($this->_get_reporte);
    }

    public function Get_Conductores()
    {
        $this->_get_conductores = $this->_modelo->Listar_Conductores();
        echo json_encode($this->_get_conductores);
    }

    // GestionOperacion
    public function BuscarDatos()
    {
        // Capturar los parámetros enviados desde JS
        $fecha_inicio   = $_POST['Fecha_Inicio']   ?? date("Y-m-01");
        $fecha_fin      = $_POST['Fecha_Final']    ?? date("Y-m-t");
        $origen         = $_POST['Origen']         ?? null;
        $destino        = $_POST['Destino']        ?? null;
        $configuracion  = $_POST['Configuracion']  ?? null;
        $cliente        = $_POST['Cliente']        ?? null;

        try {
            // Llamar al modelo con los filtros
            $resultado = $this->_modelo->GetDatosFiltrados(
                $fecha_inicio,
                $fecha_fin,
                $origen,
                $destino,
                $configuracion,
                $cliente
            );

            // Responder en JSON
            echo json_encode($resultado);
        } catch (Exception $e) {
            echo json_encode([
                "error" => true,
                "mensaje" => "Error al consultar datos: " . $e->getMessage()
            ]);
        }
    }

    // Función auxiliar para obtener y validar datos de entrada
    private function getReporteData(): array
    {
        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        if (empty($data['fechaInicio']) || empty($data['fechaFinal'])) {
            throw new Exception("Faltan fechas de inicio o final.");
        }

        // Asumiendo que las fechas vienen en formato YYYY-MM-DD
        return [
            'fechaInicio' => $data['fechaInicio'],
            'fechaFinal'  => $data['fechaFinal'],
            'estado'      => $data['estado'] ?? null // El estado es opcional en algunas consultas
        ];
    }

    /**
     * Controlador para la Consulta 1: Conteo por estados.
     */
    public function obtenerConteoInstruccionesPorEstado()
    {
        header('Content-Type: application/json');
        try {
            $datos = $this->getReporteData();
            $resultado = $this->_modelo->getInstruccionesEstados(
                $datos['fechaInicio'],
                $datos['fechaFinal']
            );
            echo json_encode(['status' => true, 'data' => $resultado]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => false, 'message' => $e->getMessage()]);
        }
    }

    /**
     * Controlador para la Consulta 2: Listado de instrucciones por estado.
     */
    public function obtenerListadoInstruccionesPorEstado()
    {
        header('Content-Type: application/json');
        try {
            $datos = $this->getReporteData();
            if (empty($datos['estado'])) {
                throw new Exception("El estado es requerido para este listado.");
            }
            $resultado = $this->_modelo->getInstruccionesListado(
                $datos['estado'],
                $datos['fechaInicio'],
                $datos['fechaFinal']
            );
            echo json_encode(['status' => true, 'data' => $resultado]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => false, 'message' => $e->getMessage()]);
        }
    }

    /**
     * Controlador para la Consulta 3: Conteo por cliente para un estado.
     */
    public function obtenerConteoPorClienteYEstado()
    {
        header('Content-Type: application/json');
        try {
            $datos = $this->getReporteData();
            if (empty($datos['estado'])) {
                throw new Exception("El estado es requerido para el conteo por cliente.");
            }
            $resultado = $this->_modelo->getInstruccionesConteoPorCliente(
                $datos['estado'],
                $datos['fechaInicio'],
                $datos['fechaFinal']
            );
            echo json_encode(['status' => true, 'data' => $resultado]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => false, 'message' => $e->getMessage()]);
        }
    }

    public function listarAnalistasActivos()
    {
        $this->_get_conductores = $this->_modelo->Listar_Analistas();
        echo json_encode($this->_get_conductores);
    }

    public function CostosVentas()
    {
        $fecha_inicio = $_POST['Fecha_Inicio'] ?? date("Y-m-01");
        $fecha_fin    = $_POST['Fecha_Final'] ?? date("Y-m-t");
        $this->_get_reporte = $this->_modelo->GetVentasCostos($fecha_inicio, $fecha_fin);
        echo json_encode($this->_get_reporte);
    }

    public function DetalleVentasCostos()
    {
        // Asegúrate de que las fechas existan
        $fechaInicio = $_POST['Fecha_Inicio'] ?? date('Y-m-d');
        $fechaFin = $_POST['Fecha_Final'] ?? date('Y-m-d');
        $tipoDetalle = $_POST['Tipo_Detalle'] ?? null;

        $modelo = $this->_modelo; // Asumiendo que el modelo está instanciado

        if ($tipoDetalle === 'Total Ventas') {
            $data = $modelo->GetDetalleVentas($fechaInicio, $fechaFin);
        } elseif ($tipoDetalle === 'Total Costos') {
            $data = $modelo->GetDetalleCostos($fechaInicio, $fechaFin);
        } else {
            $data = [];
        }

        header('Content-Type: application/json');
        echo json_encode($data);
    }
}
