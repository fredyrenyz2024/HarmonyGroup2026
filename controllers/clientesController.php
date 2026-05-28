<?php

class clientesController extends Controller
{
	private $_modelo2;
	private $sede;
	private $_filtros;
	private $_Listado_clientes;

	public function __construct()
	{
		parent::__construct();
		$this->_modelo2 = $this->loadModel('clientes');
	}

	public function index()
	{
		$cliente = $this->loadModel('clientes');
		$usuario = $this->loadModel('usuarios');

		$this->_view->cliente = $cliente;
		$this->_view->usuario = $usuario;
		$this->_view->titulo = 'Listado de Clientes';
		$this->_view->renderizar('index', 'clientes');
	}

	public function clientes_index()
	{
		$cliente = $this->loadModel('clientes');
		$usuario = $this->loadModel('usuarios');

		$this->_view->cliente = $cliente;
		$this->_view->usuario = $usuario;
		$this->_view->titulo = 'Listado de Clientes';
		$this->_view->renderizar('listar_clientes', 'clientes');
	}

	public function clientes()
	{
		$cliente = $this->loadModel('clientes');
		$usuario = $this->loadModel('usuarios');
		$Municipio = $this->loadModel('municipios');
		// $Obligacion_tribu = new clientesModel;

		$this->_view->cliente = $cliente;
		$this->_view->usuario = $usuario;
		$this->_view->Municipio = $Municipio;
		$this->_view->titulo = 'Administrar Clientes';
		$this->_view->renderizar_ventana('administrar_clientes', 'clientes');
	}

	public function bodegas()
	{
		$municipios = $this->loadModel('municipios');
		$cliente = $this->loadModel('clientes');
		$bodega = $this->loadModel('bodegas');

		$this->_view->municipios = $municipios;
		$this->_view->cliente = $cliente;
		$this->_view->bodega = $bodega;
		$this->_view->titulo = 'Remitentes - Destinatarios';
		$this->_view->renderizar('bodegas', 'clientes');
	}

	public function administrar()
	{
		$municipios = $this->loadModel('municipios');
		$cliente = $this->loadModel('clientes');

		$this->_view->municipios = $municipios;
		$this->_view->cliente = $cliente;
		$this->_view->titulo = 'Crear Clientes';
		$this->_view->renderizar('administrar', 'clientes');
	}

	public function editar()
	{
		$municipios = $this->loadModel('municipios');

		$this->_view->municipios = $municipios;
		$this->_view->titulo = 'Editar Clientes';
		$this->_view->renderizar('editar', 'clientes');
	}

	public function socios()
	{
		$this->_view->titulo = 'Listado de Socios';
		$this->_view->renderizar('socios', 'clientes');
	}

	public function verificacion_cliente()
	{
		$this->_view->titulo = 'Verificación de Cliente';
		$this->_view->renderizar('verificacion_cliente', 'clientes');
	}

	public function verificacion_socio()
	{
		$this->_view->titulo = 'Verificación Antecedentes Socio del Cliente';
		$this->_view->renderizar('verificacion_socio', 'clientes');
	}

	public function contactos()
	{
		$this->_view->titulo = 'Contactos de Cliente';
		$this->_view->renderizar('contactos', 'clientes');
	}

	//Filtros de la ventana
	public function crear_filtro()
	{
		$ventana = $_POST['param1'];
		$this->_filtros = $this->_view->Cargar_Filtros_ventana($ventana);
		echo json_encode($this->_filtros);
	}

	//CREAR SEDES DE CLIENTES
	public function Registro_Sedes()
	{
		$idcliente = $_POST["idcliente"];
		$sedes = json_decode($_POST['sedes_cliente']);
		$this->sede = $this->_modelo2->Insertar_Sedes($idcliente, $sedes);
		echo json_encode($this->sede);
	}


	public function listar_clientes()
	{
		// Llamar al modelo
		// $usuario = $this->loadModel('usuarios');

		$cliente = $_POST["nombre"] ?? 'KINGSPAN';
		$this->_Listado_clientes = $this->_modelo2->getClientes($cliente);
		echo json_encode($this->_Listado_clientes);
	}
}
