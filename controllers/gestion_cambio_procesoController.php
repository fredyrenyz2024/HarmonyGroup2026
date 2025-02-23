<?php
class gestion_cambio_procesoController extends Controller
{
	private $_modelo;
	private $_consultar_placa;
	private $_liberar_trailers;
	private $ord;
	private $doc;
	private $doc1;
	private $doc2;
	private $rem;
	private $mnf;
	private $cu;
	private $sub;

	public function __construct()
	{
		parent::__construct();
		$this->_modelo = $this->loadModel('gestion_cambio_proceso');
	}
	public function index()
	{
		$prueba = $this->loadModel('gestion_cambio_proceso');
		$this->_view->prueba = $prueba;
		$this->_view->titulo = 'Gestión de Cambio';
		$this->_view->renderizar('index', 'gestion_cambio');
	}

	public function cambio_proceso()
	{
		$modelo = $this->loadModel('gestion_cambio_proceso');
		$this->_view->modelo = $modelo;
		$this->_view->titulo = 'Gestión de Cambio';
		$this->_view->renderizar('procesos', 'gestion_cambio');
	}

	public function anulacion_proceso()
	{
		$modelo = $this->loadModel('gestion_cambio_proceso');
		$this->_view->modelo = $modelo;
		$this->_view->titulo = 'Gestión de Cambio';
		$this->_view->renderizar('anulacion', 'gestion_cambio');
	}

	public function reversion_proceso()
	{
		$modelo = $this->loadModel('gestion_cambio_proceso');
		$this->_view->modelo = $modelo;
		$this->_view->titulo = 'Gestión de Cambio';
		$this->_view->renderizar('reversion', 'gestion_cambio');
	}

	public function liberacion_trailer()
	{
		$modelo = $this->loadModel('gestion_cambio_proceso');
		$this->_view->modelo = $modelo;
		$this->_view->titulo = 'Liberación Placa Trailer';
		$this->_view->renderizar('liberacion_placa_trailers', 'gestion_cambio');
	}


	/**************  FUNCIONES DIRECCIONADAS AL MODELO  *******************/

	public function Consulta_Documento()
	{
		$modulo = $_POST["modulo"];
		$id_tabla = $_POST["id_tabla"];
		$this->ord = $this->_modelo->Consulta_Proceso($modulo, $id_tabla);
		echo json_encode($this->ord);
	}

	public function Ver_Cotizacion()
	{
		$modulo = $_POST["modulo"];
		$id_documento = $_POST["id_documento"];
		$this->doc = $this->_modelo->Cotizacion_Encabezado($modulo, $id_documento);
		echo json_encode($this->doc);
	}
	public function Ver_Cotizacion2()
	{
		$modulo = $_POST["modulo"];
		$id_documento = $_POST["id_documento"];
		$this->doc1 = $this->_modelo->Cotizacion_Mercancia($modulo, $id_documento);
		echo json_encode($this->doc1);
	}
	public function Ver_Cotizacion3()
	{
		$modulo = $_POST["modulo"];
		$id_documento = $_POST["id_documento"];
		$this->doc2 = $this->_modelo->Cotizacion_Especial($modulo, $id_documento);
		echo json_encode($this->doc2);
	}

	public function Ver_SolicitudServ()
	{
		$modulo = $_POST["modulo"];
		$id_documento = $_POST["id_documento"];
		$this->doc2 = $this->_modelo->Solicitud_Servicio($modulo, $id_documento);
		echo json_encode($this->doc2);
	}
	public function Ver_SolicitudServ2()
	{
		$modulo = $_POST["modulo"];
		$id_documento = $_POST["id_documento"];
		$this->doc2 = $this->_modelo->Solicitud_Servicio_Remitente($modulo, $id_documento);
		echo json_encode($this->doc2);
	}
	public function Ver_SolicitudServ3()
	{
		$modulo = $_POST["modulo"];
		$id_documento = $_POST["id_documento"];
		$this->doc2 = $this->_modelo->Solicitud_Servicio_Destinatario($modulo, $id_documento);
		echo json_encode($this->doc2);
	}
	public function Ver_Estudio()
	{
		$modulo = $_POST["modulo"];
		$id_documento = $_POST["id_documento"];
		$this->doc2 = $this->_modelo->Ver_Estudio($modulo, $id_documento);
		echo json_encode($this->doc2);
	}

	public function Ver_Orden()
	{
		$modulo = $_POST["modulo"];
		$id_documento = $_POST["id_documento"];
		$this->doc2 = $this->_modelo->Ver_Orden_Cargue($modulo, $id_documento);
		echo json_encode($this->doc2);
	}

	public function Ver_Orden_Rem()
	{
		$modulo = $_POST["modulo"];
		$id_documento = $_POST["id_documento"];
		$this->doc2 = $this->_modelo->Ver_Orden_Rem($modulo, $id_documento);
		echo json_encode($this->doc2);
	}

	public function Ver_Orden_Des()
	{
		$modulo = $_POST["modulo"];
		$id_documento = $_POST["id_documento"];
		$this->doc2 = $this->_modelo->Ver_Orden_Dest($modulo, $id_documento);
		echo json_encode($this->doc2);
	}

	public function Ver_Remesa()
	{
		$modulo = $_POST["modulo"];
		$id_documento = $_POST["id_documento"];
		$this->rem = $this->_modelo->Ver_Remesa($modulo, $id_documento);
		echo json_encode($this->rem);
	}

	public function Ver_Manifiesto()
	{
		$modulo = $_POST["modulo"];
		$id_documento = $_POST["id_documento"];
		$this->mnf = $this->_modelo->Ver_Manifiesto($modulo, $id_documento);
		echo json_encode($this->mnf);
	}

	public function Ver_Manifiesto2()
	{
		$modulo = $_POST["modulo"];
		$id_documento = $_POST["id_documento"];
		$this->mnf = $this->_modelo->Manifiesto_Remesas($modulo, $id_documento);
		echo json_encode($this->mnf);
	}

	public function Ver_Cumplido()
	{
		$modulo = $_POST["modulo"];
		$id_documento = $_POST["id_documento"];
		$this->cu = $this->_modelo->Cumplido($modulo, $id_documento);
		echo json_encode($this->cu);
	}

	public function Ver_Cumplido2()
	{
		$modulo = $_POST["modulo"];
		$id_documento = $_POST["id_documento"];
		$this->cu = $this->_modelo->Cumplido_Remesa($modulo, $id_documento);
		echo json_encode($this->cu);
	}
	public function Subasta()
	{
		$modulo = $_POST["modulo"];
		$id_documento = $_POST["id_documento"];
		$this->sub = $this->_modelo->Subasta($modulo, $id_documento);
		echo json_encode($this->sub);
	}

	/* Consultar los vehiculos asociados con las placas de trailers. */
	public function Consultar_placa_trailer()
	{
		$placa = $_POST['placa'];
		$this->_consultar_placa = $this->_modelo->Consultar_placa_trailer($placa);
		echo json_encode($this->_consultar_placa);
	}

	public function Liberar_trailers()
	{
		$response = [];
		$trailerId = $_POST['trailerId'];
		$vehiculoId = $_POST['vehiculoId'];
		$this->_liberar_trailers = $this->_modelo->Liberar_placa_trailer($trailerId, $vehiculoId);
		if ($this->_liberar_trailers == true) {
			$response = ['numero' => 200, 'mensaje' => 'Placa liberada exitosamente para este vehiculo'];
			$this->_liberar_trailers = $response;
		} else {
			$response = ['numero' => 400, 'mensaje' => 'Placa no liberada exitosamente para este vehiculo'];
			$this->_liberar_trailers = $response;
		}

		echo json_encode($this->_liberar_trailers);
	}
}
