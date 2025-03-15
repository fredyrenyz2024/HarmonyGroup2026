<?php

class parametrosController extends Controller
{
	private $_modelo;
	private $_clientes;
	private $_novedades;
	private $_configuracion_correo;
	private $_configuracion_contactos;
	private $dato2;
	private $rule;
	private $point;
	private $ruleupdate;
	private $actualiza;
	private $_filtros;
	private $_Insertar_Proveedor;
	public function __construct()
	{
		parent::__construct();
		//$this->$_modelo=$this->loadModel('transporte'); 
		$this->_modelo = $this->loadModel('parametro');
	}

	public function index()
	{
		$asigne_conductor = $this->loadModel('parametro'); //se añade el modelo a usar 
		$this->_view->asigne_conductor = $asigne_conductor; // Se einsatcia el modelos
		$this->_view->titulo = 'Asignar Conductor a un Vehículo';
		$this->_view->renderizar('asignar_conductor', 'parametros'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function parametros()
	{
		$puntovirtual = $this->loadModel('parametro');
		$this->_view->punto_virtual = $puntovirtual;
		$this->_view->titulo = 'Crear Puntos virtual - físico';
		$this->_view->renderizar('puntos_detalle_plan', 'parametros');
	}

	public function  reglas_negocio()
	{
		$regla_sistema = $this->loadModel('parametro');
		$this->_view->regla_sistema = $regla_sistema;
		$this->_view->titulo = 'Reglas de  Módulos';
		$this->_view->renderizar('regla_sistema', 'parametros');
	}

	public function  configuracion_envio()
	{
		$this->_view->titulo = 'Configuración Envio Correos';
		$this->_view->renderizar('configuracion_correos', 'parametros');
	}

	/* Nuevas funciones para crear y asignar proveedores */
	public function crear_proveedor()
	{
		$this->_view->titulo = 'Nuevo Proveedor';
		$this->_view->renderizar('proveedor/index_proveedor', 'parametros');
	}
	public function todos()
	{
		$this->_view->titulo = 'Listar Proveedores';
		$this->_view->renderizar_ventana('proveedor/listar_proveedor', 'parametros');
	}
	public function nuevo()
	{
		$this->_view->titulo = 'Listar Proveedores';
		$this->_view->renderizar_ventana('proveedor/nuevo_proveedor', 'parametros');
	}
	public function asignar()
	{
		$this->_view->titulo = 'Asignar Proveedores';
		$this->_view->renderizar_ventana('proveedor/asignar_proveedor', 'parametros');
	}

	public function crear_filtro()
	{
		$ventana = $_POST['param1'];
		$this->_filtros = $this->_view->Cargar_Filtros_ventana($ventana);
		// $this->_filtros = $this->_modelo->Cargar_Filtros_ventana($ventana);
		echo json_encode($this->_filtros);
	}

	public function insertar_proveedores()
	{
		$datosProveedor = [
			'tipo_documento' => $_POST['slct_tipo_documento_'],
			'regimen' => $_POST['slct_regimen_'],
			'razon_social' => $_POST['razon_social'],
			'documento' => $_POST['documento'],
			'digito_verificacion' => $_POST['digito_verificacion'],
			'ciudad_id' => $_POST['slct_ciudad_'],
			'direccion' => $_POST['direccion_proveedor'],
			'telefono' => $_POST['telefono_proveedor'],
			'correo' => $_POST['correo_proveedor'],
			'contacto' => $_POST['contacto_proveedor'],
			'numero_contacto' => $_POST['numero_contacto'],
			'estado_proveedor' => $_POST['estado_proveedor'], // Valor por defecto
			// 'usuario' => $_POST['usuario'],
			'fecha' => date('Y-m-d'),
			'hora' => date('H:i:s')
		];

		$this->_Insertar_Proveedor = $this->_modelo->Insertar_Proveedor_Torre_Control($datosProveedor);
		echo json_encode($this->_Insertar_Proveedor);
	}



	public function Consulta_Municipios()
	{ //traer municipios
		$this->dato2 = $this->_modelo->consulte_munipios();
		echo json_encode($this->dato2);
	}

	public function Consulta_Punto()
	{ //traer municipios
		$this->dato2 = $this->_modelo->consulte_munipios_punto();
		echo json_encode($this->dato2);
	}

	public function Registro_Punto()
	{
		$nom_punto = $_POST["punto"];
		$municipio = $_POST["ubicacion"];
		$descrip = $_POST["descrip"];
		$latitud = $_POST["latitud"];
		$longitud = $_POST["longitud"];
		$user = $_POST["user"];
		$fecha = $_POST["fecha"];
		$hora = $_POST["hora"];

		$this->point = $this->_modelo->Insertar_Punto(
			$nom_punto,
			$municipio,
			$descrip,
			$latitud,
			$longitud,
			$user,
			$fecha,
			$hora
		);
		echo json_encode($this->point);
	}

	public function Consulta_puntos()
	{
		$id_municipio = $_POST["id_municipio"];
		$this->dato2 = $this->_modelo->consulta_tabla($id_municipio);
		echo json_encode($this->dato2);
	}

	public function Consulta_cordenadas()
	{
		$id_municipio = $_POST["id_muni"];
		$this->dato2 = $this->_modelo->consulta_numeros($id_municipio);
		echo json_encode($this->dato2);
	}
	//REGLAS DEL SISTEMA
	public function Registro_Regla()
	{
		$modulo = $_POST["modulo"];
		$tipo = $_POST["tipo"];
		$objetivo = $_POST["objetivo"];
		$valor = $_POST["valor"];
		$this->dato2 = $this->_modelo->insercion_regla($modulo, $tipo, $objetivo, $valor);
		echo json_encode($this->dato2);
	}

	public function Consulta_Reglas()
	{
		$modulo = $_POST["modulo"];
		$this->rule = $this->_modelo->Consulta_Regla_Sistema($modulo);
		echo json_encode($this->rule);
	}

	public function Consulta_Regla()
	{
		$idtabla = $_POST["id"];
		$this->ruleupdate = $this->_modelo->ConsultaRegla($idtabla);
		echo json_encode($this->ruleupdate);
	}

	public function Actualiza_Regla()
	{
		$modulo = $_POST["modulo"];
		$clase = $_POST["clase"];
		$valor = $_POST["valor"];
		$objetivo = $_POST["objetivo"];
		$id_tb = $_POST["id_tb"];
		$this->actualiza = $this->_modelo->Actualiza_Regla_Sistema($modulo, $clase, $valor, $objetivo, $id_tb);
		echo json_encode($this->actualiza);
	}

	public function Listar_clientes()
	{
		$this->_clientes = $this->_modelo->Listar_clientes();
		echo json_encode($this->_clientes);
	}
	public function novedades_trafico()
	{
		$this->_novedades = $this->_modelo->Listar_novedades_trafico();
		echo json_encode($this->_novedades);
	}

	public function Guardar_configuracion_correo()
	{
		$novedades = $_POST['novedades'];
		$cliente = $_POST['cliente'];
		$correo_automatico = $_POST['correo_automatico'];
		$correo_manual = $_POST['correo_manual'];
		$this->_configuracion_correo = $this->_modelo->Guardar_configuracion_correo($novedades, $cliente, $correo_automatico, $correo_manual);
		echo json_encode($this->_configuracion_correo);
	}
	public function Consultar_grupo_cliente()
	{
		$cliente = $_POST['cliente'];
		$this->_configuracion_correo = $this->_modelo->Consultar_grupo_cliente($cliente);
		echo json_encode($this->_configuracion_correo);
	}

	public function Consultar_novedades_cliente()
	{
		$cliente = $_POST['cliente'];
		$this->_configuracion_correo = $this->_modelo->Consultar_novedad_cliente($cliente);
		echo json_encode($this->_configuracion_correo);
	}

	public function Guardar_configuracion_contactos()
	{
		// Decodifica el JSON recibido
		$data = json_decode(file_get_contents('php://input'), true);
		$this->_configuracion_correo = $this->_modelo->Guardar_configuracion_contactos($data);
		echo json_encode($this->_configuracion_correo);
	}
}
