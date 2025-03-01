<?php

session_start();

class prefiltro_nacionalController extends Controller
{
	private $pedir_vehiculo;
	private $solicitudes;
	private $_filtros;
	// private $pedir_vehiculo2;
	// private $titulo;
	// private $_view;
	public function __construct()
	{
		parent::__construct();
		$this->pedir_vehiculo = $this->loadModel('prefiltro_nacional'); //se añade el modelo a usar 
	}

	public function index()
	{
		// $pedir_vehiculo = $this->loadModel('prefiltro_nacional'); //se añade el modelo a usar 

		$this->_view->pedir_vehiculo = $this->pedir_vehiculo; // Se einsatcia el modelos
		$this->_view->titulo = 'Solicitar un Vehículo';
		$this->_view->renderizar('solicitudes_nacional', 'prefiltro_nacional'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function todas()
	{
		$this->_view->titulo = 'Solicitar estudios';
		// $this->_view->renderizar('lista_solicitudes', 'serviciocliente'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
		$this->_view->renderizar_ventana('index', 'prefiltro_nacional'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}
	public function prioritarias()
	{
		$this->_view->titulo = 'Solicitar estudios';
		// $this->_view->renderizar('lista_solicitudes', 'serviciocliente'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
		$this->_view->renderizar_ventana('solicitudes_prioritarias', 'prefiltro_nacional'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}
	public function pendientes()
	{
		$this->_view->titulo = 'Solicitar estudios Pendientes';
		// $this->_view->renderizar('lista_solicitudes', 'serviciocliente'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
		$this->_view->renderizar_ventana('solicitudes_pendientes', 'prefiltro_nacional'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}
	public function en_curso()
	{
		$this->_view->titulo = 'Solicitar estudios en Curso';
		// $this->_view->renderizar('lista_solicitudes', 'serviciocliente'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
		$this->_view->renderizar_ventana('solicitudes_en_curso', 'prefiltro_nacional'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function estudio_todosvehiculos()
	{
		$pedir_vehiculo2 = $this->loadModel('prefiltro_nacional'); //se añade el modelo a usar 

		$this->_view->pedir_vehiculo2 = $pedir_vehiculo2; // Se einsatcia el modelos
		$this->_view->titulo = 'Solicitar Estudio de Seguridad';
		$this->_view->renderizar('estudio_todosvehiculos', 'prefiltro_nacional'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function Consultar_Solicitudes()
	{
		$filtro = $_POST["filtro"];
		$fecha_inicial = $_POST["fecha_inicial"];
		$fecha_final = $_POST["fecha_final"];
		$estado = $_POST["estado"];
		$cliente = $_POST["cliente"];
		$id_usuario = $_SESSION["usuario"]["id_usuario"];
		$this->solicitudes = $this->pedir_vehiculo->getasignarvehiculo($id_usuario, $filtro, $fecha_inicial, $fecha_final, $estado, $cliente);
		echo json_encode($this->solicitudes);
	}

	/* Cargar filtros */
	public function crear_filtro()
	{
		$ventana = $_POST['param1'];
		$this->_filtros = $this->_view->Cargar_Filtros_ventana($ventana);
		echo json_encode($this->_filtros);
	}
}
