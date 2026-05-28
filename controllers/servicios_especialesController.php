<?php
session_start();
class servicios_especialesController extends Controller
{

	private $_modelo;
	private $dat;

	public function __construct()
	{
		parent::__construct();
		$this->_modelo = $this->loadModel('servicio_especial');
	}

	public function index()
	{
		$servicios_especiales = $this->loadModel('servicios_especiales');

		$this->_view->servicios_especiales = $servicios_especiales;
		$this->_view->titulo = 'Servicios Especiales';
		$this->_view->renderizar('index', 'servicios_especiales');
	}

	public function proveedorServicios()
	{
		$servicios_especiales = $this->loadModel('servicios_especiales');

		$this->_view->servicios_especiales = $servicios_especiales;
		$this->_view->titulo = 'Servicios Especiales';
		$this->_view->renderizar('index', 'servicios_especiales');
	}

	//FORMATO NUEVO
	public function crear_servicio()
	{
		$servicios_especiales = $this->loadModel('servicio_especial');
		$this->_view->servicios_especiales = $servicios_especiales;
		$this->_view->titulo = 'Servicios Especiales';
		// $this->_view->renderizar_ventana('crear_servicio', 'servicios_especiales');
		$this->_view->renderizar('servicio_especial', 'servicios_especiales');
	}

	public function servicios_especiales()
	{
		$servicios_especiales = $this->loadModel('servicio_especial');
		$this->_view->servicios_especiales = $servicios_especiales;
		$this->_view->titulo = 'Servicios Especiales';
		$this->_view->renderizar_ventana('crear_servicio', 'servicios_especiales');
	}

	public function listar_servicios_especiales()
	{
		$servicios_especiales = $this->loadModel('servicio_especial');
		$this->_view->servicios_especiales = $servicios_especiales;
		$this->_view->titulo = 'Listado Servicios Especiales';
		$this->_view->renderizar_ventana('listar_servicios_especiales', 'servicios_especiales');
	}

	public function ConsultaTabla()
	{
		$tipo_doc = $_POST["tipo_doc"];
		$numdoc = $_POST["numdoc"];
		$this->dat = $this->_modelo->Consulta_Tabla($tipo_doc, $numdoc);
		echo json_encode($this->dat);
	}

	public function ConsultaTipoServicio()
	{
		$this->dat = $this->_modelo->Consulta_Servicios();
		echo json_encode($this->dat);
	}

	public function ConsultaUsuario()
	{
		$this->dat = $this->_modelo->Consulta_Usuarios();
		echo json_encode($this->dat);
	}

	public function Consultavalor()
	{
		$servicio = $_POST["servicio"];
		$this->dat = $this->_modelo->valor_servicio($servicio);
		echo json_encode($this->dat);
	}

	public function Consultapareja()
	{
		$numero = $_POST["numero"];
		$tipo = $_POST["tipo"];
		$this->dat = $this->_modelo->pareja_servicio($numero, $tipo);
		echo json_encode($this->dat);
	}

	public function CrearServicio()
	{
		$tipo = $_POST["tipo"];
		$cant = $_POST["cant"];
		$costo = $_POST["costo"];
		$tarifa = $_POST["tarifa"];
		$costototal = $_POST["costototal"];
		$tarifatotal = $_POST["tarifatotal"];
		$rentabi = $_POST["rentabi"];
		$utilidad = $_POST["utilidad"];
		$conexion = $_POST["conexion"];
		$documento = $_POST["documento"];
		$numdoc_documento = $_POST["numdoc_documento"];
		// $numdoc_documento_avansat = $_POST["numdoc_documento_avansat"];

		// $this->dat = $this->_modelo->registra_servicio($tipo, $cant, $costo, $tarifa, $costototal, $tarifatotal, $rentabi, $utilidad, $conexion, $documento, $numdoc_documento, $numdoc_documento_avansat);
		$this->dat = $this->_modelo->registra_servicio($tipo, $cant, $costo, $tarifa, $costototal, $tarifatotal, $rentabi, $utilidad, $conexion, $documento, $numdoc_documento);
		echo json_encode($this->dat);
	}

	public function listar_clientes()
	{
		$clientes = $this->_modelo->listar_clientes();
		echo json_encode($clientes);
	}

	public function ListarServiciosEspeciales()
	{
		$tipo = $_POST["tipo"];
		$fecha_ini = $_POST["fecha_ini"];
		$fecha_fin = $_POST["fecha_fin"];
		$numdoc = $_POST["numdoc"];
		$cliente = $_POST["cliente"];
		$servicio_especial = $_POST["servicio_especial"];
		$usuario = $_POST["usuario"];

		$resultado = $this->_modelo->ListarServiciosEspecialesModel(
			$tipo,
			$fecha_ini,
			$fecha_fin,
			$numdoc,
			$cliente,
			$servicio_especial,
			$usuario
		);

		echo json_encode($resultado);
	}

	public function VerDetalle()
	{
		$id = $_POST["id"];

		$modelo = new servicio_especialModel();
		$datos = $modelo->ObtenerDetalleDocumento($id);

		echo json_encode($datos);
	}

	public function VerDetalleRemesa()
	{
		$id = $_POST["id"];

		$modelo = new servicio_especialModel();
		$datos = $modelo->ObtenerDetalleRemesa($id);

		echo json_encode($datos);
	}

	public function guardar_avansat()
	{
		header('Content-Type: application/json');

		try {
			$id   = $_POST['id'] ?? null;
			$tipo = $_POST['tipo'] ?? null;
			$num  = $_POST['numdoc_avansat'] ?? null;

			if (!$id || !$tipo || !$num) {
				echo json_encode([
					'success' => false,
					'message' => 'Datos incompletos'
				]);
				return;
			}

			$modelo = new servicio_especialModel();

			$ok = $modelo->actualizarAvansat(
				(int)$id,
				$tipo,
				trim($num)
			);

			echo json_encode([
				'success' => $ok
			]);
		} catch (InvalidArgumentException $e) {

			echo json_encode([
				'success' => false,
				'message' => $e->getMessage()
			]);
		} catch (Exception $e) {

			error_log($e->getMessage());

			echo json_encode([
				'success' => false,
				'message' => 'Error interno del servidor'
			]);
		}
	}
}
