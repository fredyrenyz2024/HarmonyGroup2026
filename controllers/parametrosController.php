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
	private $_Listar_Proveedor;
	private $_Asignar_Proveedor;
	private $_Listar_Servios;
	private $_Insertar_Lote;
	private $_Listar_Lote;
	private $_Listar_Configuraciones;
	private $_Editar_Configuraciones;
	private $_Actualizar_Configuraciones;
	private $_insertar_tarifa_ventas;
	private $_listar_tarifa_ventas;
	private $_listar_tarifa_servicio_especial;
	private $_listar_proveedor_servicio_especial;
	private $_listar_tarifa_venta;
	private $_update_tarifa_ventas;
	private $_insertar_bodega;
	private $listar_responsables_bodega;
	private $listar_agencias;

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
		// $this->_view->renderizar('configuracion_correos', 'parametros');
		$this->_view->renderizar('configuracion', 'parametros');
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
	public function servicio_torre_control()
	{
		$this->_view->titulo = 'Servcios Proveedores';
		$this->_view->renderizar('servicios/index_servicios', 'parametros');
	}

	public function listar_servicios()
	{
		$this->_view->titulo = 'Listar Servicios';
		$this->_view->renderizar_ventana('servicios/listar_servicios', 'parametros');
	}
	public function nuevo_servicio()
	{
		$this->_view->titulo = 'Nuevo Servicio';
		$this->_view->renderizar_ventana('servicios/nuevo_servicio', 'parametros');
	}

	public function asignar_servicios()
	{
		$this->_view->titulo = 'Asignar Servicio';
		$this->_view->renderizar_ventana('servicios/asignar_servicios', 'parametros');
	}

	public function precinto()
	{
		$this->_view->titulo = 'Crear Precintos';
		$this->_view->renderizar('precintos/crear_precintos', 'parametros');
	}

	public function precintos()
	{
		$this->_view->titulo = 'Crear Precintos';
		$this->_view->renderizar_ventana('precintos/precintos', 'parametros');
	}

	public function inventario()
	{
		$this->_view->titulo = 'Iventario Precintos';
		$this->_view->renderizar_ventana('precintos/inventario', 'parametros');
	}

	public function saldos()
	{
		$this->_view->titulo = 'Iventario Precintos';
		$this->_view->renderizar_ventana('precintos/saldos', 'parametros');
	}

	public function configuracion_notificaciones()
	{
		$this->_view->titulo = 'Configuración de Notificaicones';
		$this->_view->renderizar_ventana('configuracion_correos', 'parametros');
	}

	public function tarifa_ventas()
	{
		$this->_view->titulo = 'Tarifa de ventas';
		$this->_view->renderizar('tarifas/index', 'parametros');
	}

	public function tarifas_venta()
	{
		$this->_view->titulo = 'Tarifa de ventas';
		$this->_view->renderizar_ventana('tarifas/tarifa_ventas', 'parametros');
	}

	public function tarifa_costo_servicio_especial()
	{
		$this->_view->titulo = 'Tarifa Costo Servicios Especiales';
		$this->_view->renderizar_ventana('tarifas/tarifa_servicio_especial', 'parametros');
	}

	public function tarifa_ventas_servicio_especial()
	{
		$this->_view->titulo = 'Tarifa Ventas Servicios Especiales';
		$this->_view->renderizar_ventana('tarifas/tarifa_venta_servicio_especial', 'parametros');
	}

	public function aprobacion_tarifas_ventas()
	{
		$this->_view->titulo = 'Tarifa Ventas Servicios Especiales';
		$this->_view->renderizar_ventana('tarifas/aprobaciones_tarifas', 'parametros');
	}

	public function aprobacion_tarifa_costos()
	{
		$this->_view->titulo = 'Tarifa Ventas Servicios Especiales';
		$this->_view->renderizar_ventana('tarifas/bandeja_aprobacion', 'parametros');
	}

	public function generador_automatico_tarifas()
	{
		$this->_view->titulo = 'Tarifa Ventas Servicios Especiales';
		$this->_view->renderizar_ventana('tarifas/generador_tarfas', 'parametros');
	}

	public function bodegas()
	{
		$this->_view->titulo = 'Bodegas de inventarios';
		$this->_view->renderizar_ventana('precintos/bodegas', 'parametros');
	}

	public function rutas_frecuentes()
	{
		$this->_view->titulo = 'Rutas Frecuentes';
		$this->_view->renderizar_ventana('tarifas/rutas_frecuentes', 'parametros'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function generacion_automatica_rutas_actualizar()
	{
		$this->_view->titulo = 'Rutas Frecuentes';
		$this->_view->renderizar_ventana('tarifas/generacion_automatica', 'parametros'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function generacion_automatica_rutas_actualizar_ventas()
	{
		$this->_view->titulo = 'Rutas Frecuentes';
		$this->_view->renderizar_ventana('tarifas/generacion_automatica_venta', 'parametros'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function tarifas_sicetac()
	{
		$this->_view->titulo = 'Tarifas Sicetac';
		$this->_view->renderizar_ventana('tarifas/tarifas_sicetac', 'parametros'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function indicadores_costos()
	{
		$this->_view->titulo = 'Indicadores Tarifas';
		$this->_view->renderizar_ventana('tarifas/indicadores', 'parametros'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function indicadores_ventas()
	{
		$this->_view->titulo = 'Indicadores Tarifas';
		$this->_view->renderizar_ventana('tarifas/indicadores', 'parametros'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function productos_clientes()
	{
		$this->_view->titulo = 'Indicadores Productos';
		$this->_view->renderizar('index', 'parametros'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function productos()
	{
		$this->_view->titulo = 'Productos';
		$this->_view->renderizar_ventana('productos', 'parametros'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function tarifa_costos()
	{
		$municipios = $this->loadModel('municipios');
		$flete = $this->loadModel('fletes_nacional');
		$tipo_vehiculo = $this->loadModel('tipo_vehiculo');

		$this->_view->municipios = $municipios;
		$this->_view->flete = $flete;
		$this->_view->tipo_vehiculo = $tipo_vehiculo;
		$this->_view->titulo = 'Tarifa de costos';
		$this->_view->renderizar_ventana('tarifas/flete_nacional', 'parametros');
	}

	public function zonas_despacho()
	{
		$this->_view->titulo = 'Zonas de Despacho';
		$this->_view->renderizar('zonas/index', 'parametros');
	}

	public function zonas()
	{
		$this->_view->titulo = 'Zonas de Despacho';
		$this->_view->renderizar_ventana('zonas/zona', 'parametros');
	}

	public function exportar_tarifas()
	{
		$this->_view->titulo = 'Zonas de Despacho';
		$this->_view->renderizar_ventana('tarifas/exportar_tarfias', 'parametros');
	}

	public function crear_filtro()
	{
		$ventana = $_POST['param1'];
		$this->_filtros = $this->_view->Cargar_Filtros_ventana($ventana);
		echo json_encode($this->_filtros);
	}

	// public function insertar_proveedores()
	// {
	// 	$datosProveedor = [
	// 		'tipo_documento' => $_POST['slct_tipo_documento_'],
	// 		'regimen' => $_POST['slct_regimen_'],
	// 		'razon_social' => $_POST['razon_social'],
	// 		'documento' => $_POST['documento'],
	// 		'digito_verificacion' => $_POST['digito_verificacion'],
	// 		'ciudad_id' => $_POST['slct_ciudad_'],
	// 		'direccion' => $_POST['direccion_proveedor'],
	// 		'telefono' => $_POST['telefono_proveedor'],
	// 		'correo' => $_POST['correo_proveedor'],
	// 		'contacto' => $_POST['contacto_proveedor'],
	// 		'numero_contacto' => $_POST['numero_contacto'],
	// 		'estado_proveedor' => $_POST['estado_proveedor'], // Valor por defecto
	// 		'tipo_proveedor' => $_POST['tipo_proveedor'], // Valor por defecto
	// 		// 'usuario' => $_POST['usuario'],
	// 		'fecha' => date('Y-m-d'),
	// 		'hora' => date('H:i:s')
	// 	];

	// 	$this->_Insertar_Proveedor = $this->_modelo->Insertar_Proveedor_Torre_Control($datosProveedor);
	// 	echo json_encode($this->_Insertar_Proveedor);
	// }

	public function insertar_proveedores()
	{
		// Capturamos las sedes y las decodificamos
		$sedes = isset($_POST['sedes']) ? json_decode($_POST['sedes'], true) : [];

		$datosProveedor = [
			'tipo_documento'    => $_POST['slct_tipo_documento_'],
			'regimen'           => $_POST['slct_regimen_'],
			'razon_social'      => $_POST['razon_social'],
			'documento'         => $_POST['documento'],
			'digito_verificacion' => $_POST['digito_verificacion'],
			'ciudad_id'         => $_POST['slct_ciudad_'],
			'direccion'         => $_POST['direccion_proveedor'],
			'telefono'          => $_POST['telefono_proveedor'],
			'correo'            => $_POST['correo_proveedor'],
			'contacto'          => $_POST['contacto_proveedor'],
			'numero_contacto'   => $_POST['numero_contacto'],
			'estado_proveedor'  => $_POST['estado_proveedor'],
			'tipo_proveedor'    => $_POST['tipo_proveedor'],
			'fecha'             => date('Y-m-d'),
			'hora'              => date('H:i:s')
		];

		// Enviamos los datos del proveedor Y el array de sedes al modelo
		$this->_Insertar_Proveedor = $this->_modelo->Insertar_Proveedor_Torre_Control($datosProveedor, $sedes);
		echo json_encode($this->_Insertar_Proveedor);
	}

	public function obtener_datos_proveedor()
	{
		$id = $_POST['id'];
		// Traer datos del proveedor
		$proveedor = $this->_modelo->consultarProveedorPorId($id);

		// Traer sedes si existen
		$sedes = [];
		if ($proveedor['tipo_proveedor'] == '4Pl') {
			$sedes = $this->_modelo->consultarSedesPorProveedor($id);
		}

		echo json_encode([
			'proveedor' => $proveedor,
			'sedes' => $sedes
		]);
	}

	public function actualizar_proveedor_ejecutar()
	{
		// 1. Decodificar los JSON de sedes que vienen desde el JS
		// Usamos json_decode con 'true' para obtener arrays asociativos
		$sedesEditadas = isset($_POST['sedesEditadas']) ? json_decode($_POST['sedesEditadas'], true) : [];
		$sedesNuevas   = isset($_POST['sedesNuevas'])   ? json_decode($_POST['sedesNuevas'], true)   : [];

		// 2. Organizar los datos básicos del proveedor
		$datosProveedor = [
			'id'                  => $_POST['id'],
			'tipo_documento'      => $_POST['tipo_documento'] ?? '', // Aunque esté readonly, a veces se envía
			'regimen'             => $_POST['regimen'],
			'razon_social'        => $_POST['razon_social'],
			'digito_verificacion' => $_POST['digito_verificacion'] ?? '',
			'ciudad_id'           => $_POST['ciudad_id'],
			'direccion'           => $_POST['direccion'],
			'telefono'            => $_POST['telefono'],
			'correo'              => $_POST['correo'],
			'contacto'            => $_POST['contacto'],
			'numero_contacto'     => $_POST['numero_contacto'],
			'estado_proveedor'    => $_POST['estado_proveedor'],
			'tipo_proveedor'      => $_POST['tipo_proveedor']
		];

		// 3. Ejecutar la actualización en el modelo
		// Pasamos los 3 argumentos: datos básicos, sedes nuevas (INSERT) y sedes editadas (UPDATE)
		$resultado = $this->_modelo->Actualizar_Proveedor_Torre_Control($datosProveedor, $sedesNuevas, $sedesEditadas);

		// 4. Retornar la respuesta al JavaScript
		echo json_encode($resultado);
	}

	public function listar_proveedores()
	{
		$this->_Listar_Proveedor = $this->_modelo->Listar_Proveedor_Torre_Control();
		echo json_encode($this->_Listar_Proveedor);
	}

	public function asignar_proveedor()
	{
		// Leer el JSON enviado en la solicitud
		$json = file_get_contents('php://input');
		$data = json_decode($json, true); // Convertir el JSON a un array asociativo

		// Validar que los datos existan
		if (!isset($data['proveedor']) || !isset($data['clientes'])) {
			echo json_encode(['status' => false, 'message' => 'Datos incompletos']);
			return;
		}

		$proveedor = $data['proveedor'];
		$clientes = $data['clientes'];

		// Llamar al modelo para asignar el proveedor
		$this->_Asignar_Proveedor = $this->_modelo->Asignar_Proveedor_Torre_Control($proveedor, $clientes);

		// Devolver la respuesta en JSON
		echo json_encode($this->_Asignar_Proveedor);
	}

	public function listar_proveedores_torre_control()
	{
		$this->_Listar_Proveedor = $this->_modelo->Consultar_Proveedor_Torre_Control();
		echo json_encode($this->_Listar_Proveedor);
	}

	public function listar_clientes_asignados()
	{
		$ProveedorId = $_POST['ProveedorId'];
		$this->_Listar_Proveedor = $this->_modelo->Consultar_Clientes_Asignados_Proveedor($ProveedorId);
		echo json_encode($this->_Listar_Proveedor);
	}

	public function Consulta_Pais()
	{ //traer municipios
		$this->dato2 = $this->_modelo->consulte_pais();
		echo json_encode($this->dato2);
	}

	public function Consulta_Municipios()
	{
		//traer municipios
		$pais = $_POST['pais'];
		$this->dato2 = $this->_modelo->consulte_munipios($pais);
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
		// $novedades = $_POST['novedades'];
		$cliente = $_POST['cliente'];
		$correo_automatico = $_POST['correo_automatico'];
		$correo_manual = $_POST['correo_manual'];
		$mensaje_whatsapp = $_POST['mensaje_whatsapp'];
		$importacion = $_POST['importacion'];
		$exportacion = $_POST['exportacion'];
		$nacional = $_POST['nacional'];
		$urbano = $_POST['urbano'];
		$torre_control = $_POST['torre_control'];
		$nombre_grupo = $_POST['nombre_grupo'] ?? 'GRUPO DEL CLIENTE PRUEBAS';
		$datos = json_decode($_POST['dato'], true);
		$datos_horas = json_decode($_POST['dato_hora'], true);
		$GrupoId = $_POST['GrupoId'];

		$this->_configuracion_correo = $this->_modelo->Guardar_configuracion_correo($cliente, $correo_automatico, $correo_manual, $mensaje_whatsapp, $importacion, $exportacion, $nacional, $urbano, $torre_control, $datos, $datos_horas, $nombre_grupo, $GrupoId);
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

	public function Guardar_Servicio()
	{
		$servicio = $_POST['servicio'];
		$descripcion = $_POST['descripcion'];
		$estado = $_POST['estado'];
		$this->_configuracion_correo = $this->_modelo->Guardar_Servicio($servicio, $descripcion, $estado);
		echo json_encode($this->_configuracion_correo);
	}

	public function listar_asignacion_servicios()
	{
		$this->_configuracion_correo = $this->_modelo->Listar_Asignacion_Servicios_Torre_Control();
		echo json_encode($this->_configuracion_correo);
	}

	public function Guardar_Asignacion_Servicio()
	{
		// Leer el JSON enviado en la solicitud
		$json = file_get_contents('php://input');
		$data = json_decode($json, true); // Convertir el JSON a un array asociativo

		// Verificar si los datos fueron enviados correctamente
		if (!isset($data['servicio']) || !isset($data['proveedor'])) {
			echo json_encode(['status' => false, 'message' => 'Datos incompletos']);
			return;
		}

		// Obtener los datos correctamente
		$servicio = $data['servicio'];
		$proveedor = $data['proveedor'];

		// Llamar a la función del modelo para guardar
		$resultado = $this->_modelo->Guardar_Asignacion_Servicio($servicio, $proveedor);

		// Verificar la respuesta del modelo
		if ($resultado) {
			echo json_encode(['status' => true, 'message' => 'Asignación guardada correctamente']);
		} else {
			echo json_encode(['status' => false, 'message' => 'Error al guardar la asignación']);
		}
	}

	public function listar_servicios_torre_control()
	{
		$this->_Listar_Servios = $this->_modelo->Consultar_Servicios_Torre_Control();
		echo json_encode($this->_Listar_Servios);
	}

	public function listar_proveedores_asignados()
	{
		$ServicioId = $_POST['ServicioId'];
		$this->_Listar_Servios = $this->_modelo->Listar_proveedores_asignados($ServicioId);
		echo json_encode($this->_Listar_Servios);
	}

	public function Guardar_Lote_Precintos()
	{
		$datosLote = [
			'codigo_inicial' => $_POST['codigo_inicial'],
			'codigo_final' => $_POST['codigo_final'],
			'tipo_precinto' => $_POST['tipo_precinto'],
		];

		$this->_Insertar_Lote = $this->_modelo->Insertar_Lote($datosLote);
		echo json_encode($this->_Insertar_Lote);
	}

	public function listar_lotes()
	{
		$this->_Listar_Lote = $this->_modelo->Listar_Precintos();
		echo json_encode($this->_Listar_Lote);
	}

	public function verificar_precintos()
	{
		$oficina = $_POST['oficina'];
		$tipo = $_POST['tipo'];
		$desde = intval($_POST['desde']);
		$hasta = intval($_POST['hasta']);

		$response = ['valido' => false, 'cantidad' => 0, 'mensaje' => ''];

		if ($desde > $hasta) {
			$response['mensaje'] = 'El rango no es válido.';
			echo json_encode($response);
			exit;
		}

		$response = $this->_modelo->verificar_precintos_asignados($oficina, $tipo, $desde, $hasta);

		echo json_encode($response);
	}

	public function Insertar_asignacion_precintos()
	{
		$agencia_origen = $_POST['agencia_origen'];
		$agencia_destino = $_POST['agencia_destino'];
		$tipo_precinto = $_POST['tipo'];
		$tipo = 'traslado'; // Asignar un valor por defecto para el tipo
		$desde = $_POST['desde'];
		$hasta = $_POST['hasta'];
		$observacion = $_POST['observacion'] ?? null;

		$this->_Insertar_Lote = $this->_modelo->asignar_precintos_por_rango($agencia_origen, $agencia_destino, $tipo_precinto, $tipo, $desde, $hasta, $observacion);
		echo json_encode($this->_Insertar_Lote);
	}

	public function listar_inventario_precintos()
	{
		$this->_Listar_Lote = $this->_modelo->Listar_Asignacion_Precintos();
		echo json_encode($this->_Listar_Lote);
	}

	//Funcion listar configuraciones de notidiaciones
	public function Listar_Configuraciones()
	{
		$this->_Listar_Configuraciones = $this->_modelo->Listar_Condfiguraciones_Notificaciones();
		echo json_encode($this->_Listar_Configuraciones);
	}

	public function Editar_Configuraciones()
	{
		$ConfiguracionId = $_POST['configuracion_id'];

		if (!$ConfiguracionId) {
			echo json_encode(['status' => false, 'message' => 'Datos incompletos']);
			return;
		}

		$this->_Editar_Configuraciones = $this->_modelo->Editar_Condfiguraciones_Notificaciones($ConfiguracionId);
		echo json_encode($this->_Editar_Configuraciones);
	}

	public function Actualizar_configuracion_correo()
	{
		// $novedades = $_POST['novedades'];
		$cliente = $_POST['cliente'];
		$correo_automatico = $_POST['correo_automatico'];
		$correo_manual = $_POST['correo_manual'];
		$mensaje_whatsapp = $_POST['mensaje_whatsapp'];
		$importacion = $_POST['importacion'];
		$exportacion = $_POST['exportacion'];
		$nacional = $_POST['nacional'];
		$urbano = $_POST['urbano'];
		$nombre_grupo = $_POST['nombre_grupo'] ?? 'GRUPO DEL CLIENTE PRUEBAS';
		$datos = json_decode($_POST['dato'], true);
		$datos_horas = json_decode($_POST['dato_hora'], true);
		$configuracionId = $_POST['configuracionId'];
		$GrupoId = $_POST['GrupoId'];

		$this->_configuracion_correo = $this->_modelo->Actualizar_configuracion_correo($configuracionId, $cliente, $correo_automatico, $correo_manual, $mensaje_whatsapp, $importacion, $exportacion, $nacional, $urbano, $datos, $datos_horas, $nombre_grupo, $GrupoId);
		echo json_encode($this->_configuracion_correo);
	}


	// INSetra tarifa ventas
	public function insertar_tarifa_Ventas()
	{
		// Recibir JSON
		$data = json_decode(file_get_contents("php://input"), true);

		$vigencia      = $data['vigencia'] ?? '';
		$mes_flete     = $data['mes_flete'] ?? '';
		$cliente       = $data['cliente'] ?? '';
		$origen        = $data['origen'] ?? '';
		$destino       = $data['destino'] ?? '';
		// $tarifa_venta  = $data['tarifa_venta'] ?? '';
		//Total de la instruccion
		$valorFormateado3 = $data['tarifa_venta']; // "$ 1.400.000,00"

		// Paso 1: Quitar el símbolo de pesos y espacios
		$valorLimpio3 = str_replace(['$', ' ', ' '], '', $valorFormateado3);

		// Paso 2: Reemplazar puntos de miles y cambiar coma decimal por punto
		$valorDecimal3 = str_replace('.', '', $valorLimpio3); // "1400000,00"
		$valorDecimal3 = str_replace(',', '.', $valorDecimal3); // "1400000.00"

		// Paso 3: Convertir a float o dejar como string para la base de datos
		$tarifa_venta = floatval($valorDecimal3); // 1400000.00

		$estado_tarifa = $data['estado_tarifa'] ?? '';
		$configuracion_vehiculos = $data['configuracion_vehiculos'] ?? '';

		// Aquí llamas al modelo para insertar
		$this->_insertar_tarifa_ventas = $this->_modelo->insertar_tarifa_ventas(
			$vigencia,
			$mes_flete,
			$cliente,
			$origen,
			$destino,
			$tarifa_venta,
			$estado_tarifa,
			$configuracion_vehiculos
		);

		echo json_encode($this->_insertar_tarifa_ventas);
	}

	public function Detalle_tarifa_venta()
	{
		$data = json_decode(file_get_contents("php://input"), true);

		$TarifaId = $data['TarifaId'];
		$this->_listar_tarifa_venta = $this->_modelo->Detalle_tarifa_venta($TarifaId);
		echo json_encode($this->_listar_tarifa_venta);
	}

	public function update_tarifa_Ventas()
	{
		// Recibir JSON
		$data = json_decode(file_get_contents("php://input"), true);

		$vigencia      = $data['vigencia'] ?? '';
		$mes_flete     = $data['mes_flete'] ?? '';
		$cliente       = $data['cliente'] ?? '';
		$origen        = $data['origen'] ?? '';
		$destino       = $data['destino'] ?? '';

		$tarifa_venta_id       = $data['tarifa_venta_id'] ?? '';

		// $tarifa_venta  = $data['tarifa_venta'] ?? '';

		//Total de la instruccion
		$valorFormateado3 = $data['tarifa_venta']; // "$ 1.400.000,00"

		// Paso 1: Quitar el símbolo de pesos y espacios
		$valorLimpio3 = str_replace(['$', ' ', ' '], '', $valorFormateado3);

		// Paso 2: Reemplazar puntos de miles y cambiar coma decimal por punto
		$valorDecimal3 = str_replace('.', '', $valorLimpio3); // "1400000,00"
		$valorDecimal3 = str_replace(',', '.', $valorDecimal3); // "1400000.00"

		// Paso 3: Convertir a float o dejar como string para la base de datos
		$tarifa_venta = floatval($valorDecimal3); // 1400000.00

		$estado_tarifa = $data['estado_tarifa'] ?? '';
		$configuracion_vehiculos = $data['configuracion_vehiculos'] ?? '';

		// Aquí llamas al modelo para insertar
		$this->_update_tarifa_ventas = $this->_modelo->update_tarifa_ventas(
			$tarifa_venta_id,
			$vigencia,
			$mes_flete,
			$cliente,
			$origen,
			$destino,
			$tarifa_venta,
			$estado_tarifa,
			$configuracion_vehiculos
		);

		echo json_encode($this->_update_tarifa_ventas);
	}

	public function Inactivar_tarifa_venta()
	{
		$data = json_decode(file_get_contents("php://input"), true);

		$TarifaId = $data['TarifaId'];
		$this->_listar_tarifa_venta = $this->_modelo->Inactivar_tarifa_venta($TarifaId);
		echo json_encode($this->_listar_tarifa_venta);
	}

	public function Activar_tarifa_venta()
	{
		$data = json_decode(file_get_contents("php://input"), true);

		$TarifaId = $data['TarifaId'];
		$this->_listar_tarifa_venta = $this->_modelo->Activar_tarifa_venta($TarifaId);
		echo json_encode($this->_listar_tarifa_venta);
	}

	public function Inactivar_tarifa_costo()
	{
		$data = json_decode(file_get_contents("php://input"), true);

		$TarifaId = $data['TarifaId'];
		$this->_listar_tarifa_venta = $this->_modelo->Inactivar_tarifa_costo($TarifaId);
		echo json_encode($this->_listar_tarifa_venta);
	}

	public function Activar_tarifa_costo()
	{
		$data = json_decode(file_get_contents("php://input"), true);

		$TarifaId = $data['TarifaId'];
		$this->_listar_tarifa_venta = $this->_modelo->Activar_tarifa_costo($TarifaId);
		echo json_encode($this->_listar_tarifa_venta);
	}

	public function Detalle_tarifa_costo()
	{
		$data = json_decode(file_get_contents("php://input"), true);

		$TarifaId = $data['TarifaId'];
		$tarifa_padre_id = $data['tarifa_padre_id'];
		$this->_listar_tarifa_venta = $this->_modelo->Detalle_tarifa_costo($TarifaId, $tarifa_padre_id);
		echo json_encode($this->_listar_tarifa_venta);
	}

	public function Detalle_tarifa_costo_servicio()
	{
		$data = json_decode(file_get_contents("php://input"), true);

		$TarifaId = $data['TarifaId'];
		$ProveedorId = $data['ProveedorId'];
		$servi_id = $data['servi_id'];

		$this->_listar_tarifa_venta = $this->_modelo->Detalle_tarifa_costo_servicio($TarifaId, $ProveedorId, $servi_id);
		echo json_encode($this->_listar_tarifa_venta);
	}

	public function Detalle_tarifa_venta_servicio()
	{
		$data = json_decode(file_get_contents("php://input"), true);

		$TarifaId = $data['TarifaId'];
		$ProveedorId = $data['ProveedorId'];
		$servi_id = $data['servi_id'];

		$this->_listar_tarifa_venta = $this->_modelo->Detalle_tarifa_venta_servicio($TarifaId, $ProveedorId, $servi_id);
		echo json_encode($this->_listar_tarifa_venta);
	}

	public function Inactivar_tarifa_costo_servicio()
	{
		$data = json_decode(file_get_contents("php://input"), true);

		$TarifaId = $data['TarifaId'];
		$ProveedorId = $data['ProveedorId'];

		$this->_listar_tarifa_venta = $this->_modelo->Inactivar_tarifa_costo_servicio($TarifaId, $ProveedorId);
		echo json_encode($this->_listar_tarifa_venta);
	}

	public function servicio_venta_id()
	{
		$data = json_decode(file_get_contents("php://input"), true);

		$TarifaId = $data['TarifaId'];
		$ProveedorId = $data['ProveedorId'];

		$this->_listar_tarifa_venta = $this->_modelo->servicio_venta_id($TarifaId, $ProveedorId);
		echo json_encode($this->_listar_tarifa_venta);
	}

	public function Activar_tarifa_costo_servicio()
	{
		$data = json_decode(file_get_contents("php://input"), true);

		$TarifaId = $data['TarifaId'];
		$ProveedorId = $data['ProveedorId'];

		$this->_listar_tarifa_venta = $this->_modelo->Activar_tarifa_costo_servicio($TarifaId, $ProveedorId);
		echo json_encode($this->_listar_tarifa_venta);
	}

	public function Inactivar_tarifa_venta_servicio()
	{
		$data = json_decode(file_get_contents("php://input"), true);

		$TarifaId = $data['TarifaId'];
		$ProveedorId = $data['ProveedorId'];

		$this->_listar_tarifa_venta = $this->_modelo->Inactivar_tarifa_venta_servicio($TarifaId, $ProveedorId);
		echo json_encode($this->_listar_tarifa_venta);
	}

	public function Activar_tarifa_venta_servicio()
	{
		$data = json_decode(file_get_contents("php://input"), true);

		$TarifaId = $data['TarifaId'];
		$ProveedorId = $data['ProveedorId'];

		$this->_listar_tarifa_venta = $this->_modelo->Activar_tarifa_venta_servicio($TarifaId, $ProveedorId);
		echo json_encode($this->_listar_tarifa_venta);
	}

	public function Listar_tarifas_clientes()
	{
		$this->_listar_tarifa_ventas = $this->_modelo->Listar_tarifas_clientes();
		echo json_encode($this->_listar_tarifa_ventas);
	}

	// public function listarFletesNacionales()
	// {
	// 	$this->_listar_tarifa_ventas = $this->_modelo->listar_Fletes_Nacionales();
	// 	echo json_encode($this->_listar_tarifa_ventas);
	// }

	public function listarFletesNacionales()
	{
		$filtros = [
			'origen'        => $_POST['origen']        ?? null,
			'destino'       => $_POST['destino']       ?? null,
			'tipo_vehiculo' => $_POST['tipo_vehiculo'] ?? null
		];

		$data = $this->_modelo->listar_Fletes_Nacionales($filtros);
		echo json_encode($data);
	}

	public function listarServiciosEspeciales()
	{
		$this->_listar_tarifa_servicio_especial = $this->_modelo->getTabla();
		echo json_encode($this->_listar_tarifa_servicio_especial);
	}

	public function listarServiciosEspecialesVentas()
	{
		$this->_listar_tarifa_servicio_especial = $this->_modelo->getTablaVenta();
		echo json_encode($this->_listar_tarifa_servicio_especial);
	}


	public function listarProveedorServiciosEspeciales()
	{
		$this->_listar_proveedor_servicio_especial = $this->_modelo->getTabla_Proveedores_Servicio_Especial();
		echo json_encode($this->_listar_proveedor_servicio_especial);
	}

	//Controlador
	public function InsertarProveedor()
	{
		try {
			$tipo       = $_POST['tipo'] ?? '';
			$estado     = $_POST['estado'] ?? '';
			$tipi       = $_POST['tipi'] ?? '';
			$proveedor  = $_POST['proveedor_servicio_especial'] ?? '';
			$servicio_id = $_POST['servicio_id'] ?? null;
			$empresa_id = $_SESSION['empresa_id'] ?? null;

			$municipios = $_POST['municipios'] ?? [];
			$costos     = $_POST['costos'] ?? [];

			if (empty($tipo) || empty($estado) || empty($tipi) || empty($proveedor)) {
				echo json_encode(['status' => 'error', 'message' => 'Datos incompletos']);
				return;
			}

			if (count($municipios) !== count($costos)) {
				echo json_encode(['status' => 'error', 'message' => 'Los municipios y costos no coinciden']);
				return;
			}

			$data = [
				'tipo'        => $tipo,
				'estado'      => $estado,
				'proveedor'   => $proveedor,
				'empresa_id'  => $empresa_id,
				'servicio_id' => $servicio_id,
				'detalles'    => []
			];

			foreach ($municipios as $i => $muni) {
				$costo = $costos[$i] ?? 0;

				//Total de la instruccion
				$valorFormateado3 = $costo; // "$ 1.400.000,00"

				// Paso 1: Quitar el símbolo de pesos y espacios
				$valorLimpio3 = str_replace(['$', ' ', ' '], '', $valorFormateado3);

				// Paso 2: Reemplazar puntos de miles y cambiar coma decimal por punto
				$valorDecimal3 = str_replace('.', '', $valorLimpio3); // "1400000,00"
				$valorDecimal3 = str_replace(',', '.', $valorDecimal3); // "1400000.00"

				// Paso 3: Convertir a float o dejar como string para la base de datos
				$tarifa_venta = floatval($valorDecimal3); // 1400000.00

				$data['detalles'][] = [
					'municipio' => $muni,
					'costo'     => $tarifa_venta
				];
			}

			if ($servicio_id) {
				$resultado = $this->_modelo->ActualizarProveedor($data);
				$mensaje = "Proveedor actualizado correctamente";
			} else {
				$resultado = $this->_modelo->InsertarProveedor($data);
				$mensaje = "Proveedor insertado correctamente";
			}

			echo json_encode(
				$resultado
					? ['status' => 'ok', 'message' => $mensaje]
					: ['status' => 'error', 'message' => 'Error en la base de datos']
			);
		} catch (Exception $e) {
			error_log("❌ Error en GuardarProveedor: " . $e->getMessage());
			echo json_encode(['status' => 'error', 'message' => 'Excepción en el servidor']);
		}
	}

	public function InsertarCliente()
	{
		try {
			// ✅ Captura de POST
			$tipo       = $_POST['tipo'] ?? '';
			$estado     = $_POST['estado'] ?? '';
			$tipi       = $_POST['tipi'] ?? '';
			$cliente  = $_POST['cliente_servicio_especial'] ?? '';
			$servicio_id = $_POST['servicio_id'] ?? null;

			// Arrays
			$municipios = $_POST['municipios'] ?? [];
			$costos     = $_POST['costos'] ?? [];

			// 🔍 Validación básica
			if (empty($tipo) || empty($estado) || empty($tipi) || empty($cliente)) {
				echo json_encode(['status' => 'error', 'message' => 'Datos incompletos']);
				return;
			}

			if (count($municipios) !== count($costos)) {
				echo json_encode(['status' => 'error', 'message' => 'Los municipios y costos no coinciden']);
				return;
			}

			// ✅ Armar data para modelo
			$data = [
				'tipo'        => $tipo,
				'estado'      => $estado,
				// 'tipi'        => $tipi,
				'cliente'   => $cliente,
				'servicio_id' => $servicio_id,
				// 'id_rndc'     => null,
				// 'costo'       =>  null, // si tienes costo global
				// 'usuario'     => $usuario,
				// 'empresa_id'  => $empresa_id,
				'detalles'    => []
			];

			foreach ($municipios as $i => $muni) {
				$costo = $costos[$i] ?? 0;

				//Total de la instruccion
				$valorFormateado3 = $costo; // "$ 1.400.000,00"

				// Paso 1: Quitar el símbolo de pesos y espacios
				$valorLimpio3 = str_replace(['$', ' ', ' '], '', $valorFormateado3);

				// Paso 2: Reemplazar puntos de miles y cambiar coma decimal por punto
				$valorDecimal3 = str_replace('.', '', $valorLimpio3); // "1400000,00"
				$valorDecimal3 = str_replace(',', '.', $valorDecimal3); // "1400000.00"

				// Paso 3: Convertir a float o dejar como string para la base de datos
				$tarifa_venta = floatval($valorDecimal3); // 1400000.00

				$data['detalles'][] = [
					'municipio' => $muni,
					'costo'     => $tarifa_venta
				];
			}

			if ($servicio_id) {
				// ✅ Llamar al modelo
				$resultado = $this->_modelo->ActualizarCliente($data);
				$mensaje = "Proveedor actualizado correctamente";
			} else {
				$resultado = $this->_modelo->InsertarCliente($data);
				$mensaje = "Proveedor insertado correctamente";
			}

			if ($resultado) {
				echo json_encode(['status' => 'ok', 'message' => $mensaje]);
			} else {
				echo json_encode(['status' => 'error', 'message' => 'Error al insertar en la base de datos']);
			}
		} catch (Exception $e) {
			error_log("❌ Error en controlador InsertarProveedor: " . $e->getMessage());
			echo json_encode(['status' => 'error', 'message' => 'Excepción en el servidor']);
		}
	}

	public function Lista_Servicios_Especiales()
	{
		$this->_listar_proveedor_servicio_especial = $this->_modelo->Get_Tabla_Servicio_Especiales();
		echo json_encode($this->_listar_proveedor_servicio_especial);
	}

	// public function guardaFleteNacional()
	// {
	// 	// Obtener fecha y hora actuales
	// 	$fecha = date('Y-m-d');
	// 	$hora  = date('H:i:s');

	// 	//Total de la instruccion
	// 	$valorFormateado3 = $_POST['tarifa']; // "$ 1.400.000,00"

	// 	// Paso 1: Quitar el símbolo de pesos y espacios
	// 	$valorLimpio3 = str_replace(['$', ' ', ' '], '', $valorFormateado3);

	// 	// Paso 2: Reemplazar puntos de miles y cambiar coma decimal por punto
	// 	$valorDecimal3 = str_replace('.', '', $valorLimpio3); // "1400000,00"
	// 	$valorDecimal3 = str_replace(',', '.', $valorDecimal3); // "1400000.00"

	// 	// Paso 3: Convertir a float o dejar como string para la base de datos
	// 	$tarifa_costo = floatval($valorDecimal3); // 1400000.00

	// 	// Capturar datos desde POST y sesión
	// 	$array = [
	// 		"vigencia"      => $_POST["vigencia"]        ?? null,
	// 		"mes"           => $_POST["mes"]             ?? null,
	// 		"origen"        => $_POST["origen"]          ?? null,
	// 		"destino"       => $_POST["destino"]         ?? null,
	// 		"tipo_vehiculo" => $_POST["tipo_vehiculo"]   ?? null,
	// 		"tarifa"        => $tarifa_costo             ?? null,
	// 		"estado"        => 1, // fijo como en tu ejemplo
	// 		"usuario"       => $_SESSION["usuario"]["nom_usuario"] ?? "sistema",
	// 		"fecha"         => $fecha,
	// 		"hora"          => $hora
	// 	];

	// 	// Llamar al modelo y enviarle el array
	// 	$response = $this->_modelo->guardarFleteNacional($array);

	// 	// Devolver respuesta al frontend
	// 	echo json_encode($response);
	// }

	// public function guardaFleteNacional()
	// {
	// 	// Limpieza de valor monetario
	// 	//Total de la instruccion
	// 	$valorFormateado3 = $_POST['tarifa']; // "$ 1.400.000,00"

	// 	// Paso 1: Quitar el símbolo de pesos y espacios
	// 	$valorLimpio3 = str_replace(['$', ' ', ' '], '', $valorFormateado3);

	// 	// Paso 2: Reemplazar puntos de miles y cambiar coma decimal por punto
	// 	$valorDecimal3 = str_replace('.', '', $valorLimpio3); // "1400000,00"
	// 	$valorDecimal3 = str_replace(',', '.', $valorDecimal3); // "1400000.00"

	// 	// Paso 3: Convertir a float o dejar como string para la base de datos
	// 	$tarifa_costo = floatval($valorDecimal3); // 1400000.00

	// 	$data = [
	// 		'vigencia'         => $_POST['vigencia'],
	// 		'mes'              => $_POST['mes'],
	// 		'origen'           => $_POST['origen'],
	// 		'destino'          => $_POST['destino'],
	// 		'tipo_vehiculo'    => $_POST['tipo_vehiculo'],
	// 		'tarifa'           => $tarifa_costo,
	// 		'tipo_origen'      => $_POST['tipo_origen'] ?? null,
	// 		'tarifa_costo_id'  => $_POST['tarifa_costo_id'] ?? null
	// 	];

	// 	echo json_encode(
	// 		$this->_modelo->guardarFleteNacional($data)
	// 	);
	// }


	public function guardaFleteNacional()
	{
		// Limpieza de valor monetario
		// $valorFormateado = $_POST['tarifa']; // "$ 4.500.000,00"

		// $valorLimpio = str_replace(['$', ' ', ' '], '', $valorFormateado);
		// $valorLimpio = str_replace('.', '', $valorLimpio);
		// $valorLimpio = str_replace(',', '.', $valorLimpio);

		// $tarifa_costo = floatval($valorLimpio);

		//Total de la instruccion
		$valorFormateado3 = $_POST['tarifa']; // "$ 1.400.000,00"

		// Paso 1: Quitar el símbolo de pesos y espacios
		$valorLimpio3 = str_replace(['$', ' ', ' '], '', $valorFormateado3);

		// Paso 2: Reemplazar puntos de miles y cambiar coma decimal por punto
		$valorDecimal3 = str_replace('.', '', $valorLimpio3); // "1400000,00"
		$valorDecimal3 = str_replace(',', '.', $valorDecimal3); // "1400000.00"

		// Paso 3: Convertir a float o dejar como string para la base de datos
		$tarifa_costo = floatval($valorDecimal3); // 1400000.00

		// 🔒 NORMALIZAR tarifa_costo_id
		$tarifaPadreId = (
			isset($_POST['tarifa_costo_id']) &&
			$_POST['tarifa_costo_id'] !== '' &&
			is_numeric($_POST['tarifa_costo_id'])
		)
			? (int) $_POST['tarifa_costo_id']
			: null;

		$data = [
			'vigencia'         => $_POST['vigencia'],
			'mes'              => $_POST['mes'],
			'origen'           => $_POST['origen'],
			'destino'          => $_POST['destino'],
			'tipo_vehiculo'    => $_POST['tipo_vehiculo'],
			'tarifa'           => $tarifa_costo,
			'tipo_origen'      => $_POST['tipo_origen'] ?? null,
			'tarifa_costo_id'  => $tarifaPadreId   // ✅ AQUÍ
		];

		echo json_encode(
			$this->_modelo->guardarFleteNacional($data)
		);
	}

	// public function updateFleteNacional()
	// {
	// 	// Obtener fecha y hora actuales
	// 	$fecha = date('Y-m-d');
	// 	$hora  = date('H:i:s');

	// 	//Total de la instruccion
	// 	$valorFormateado3 = $_POST['tarifa']; // "$ 1.400.000,00"

	// 	// Paso 1: Quitar el símbolo de pesos y espacios
	// 	$valorLimpio3 = str_replace(['$', ' ', ' '], '', $valorFormateado3);

	// 	// Paso 2: Reemplazar puntos de miles y cambiar coma decimal por punto
	// 	$valorDecimal3 = str_replace('.', '', $valorLimpio3); // "1400000,00"
	// 	$valorDecimal3 = str_replace(',', '.', $valorDecimal3); // "1400000.00"

	// 	// Paso 3: Convertir a float o dejar como string para la base de datos
	// 	$tarifa_venta = floatval($valorDecimal3); // 1400000.00

	// 	// Capturar datos desde POST y sesión
	// 	$array = [
	// 		"vigencia"        => $_POST["vigencia"]        ?? null,
	// 		"mes"             => $_POST["mes"]             ?? null,
	// 		"origen"          => $_POST["origen"]          ?? null,
	// 		"destino"         => $_POST["destino"]         ?? null,
	// 		"tipo_vehiculo"   => $_POST["tipo_vehiculo"]   ?? null,
	// 		"tarifa"          => $tarifa_venta             ?? null,
	// 		"estado"          => 1,
	// 		"usuario"         => $_SESSION["usuario"]["nom_usuario"] ?? "sistema",
	// 		"fecha"           => $fecha,
	// 		"hora"            => $hora,
	// 		"tarifa_costo_id" => $_POST["tarifa_costo_id"] ?? null,
	// 	];

	// 	// Llamar al modelo y enviarle el array
	// 	$response = $this->_modelo->updateFleteNacional($array);

	// 	// Devolver respuesta al frontend
	// 	echo json_encode($response);
	// }

	public function ListarSericiosTipoEspeciales()
	{
		$this->_listar_proveedor_servicio_especial = $this->_modelo->Get_Tipo_Servicio_Especiales();
		echo json_encode($this->_listar_proveedor_servicio_especial);
	}

	public function Consultar_Grupos_Clientes()
	{
		$cliente = $_POST["Cliente"] ?? null;
		$this->_listar_proveedor_servicio_especial = $this->_modelo->Consultar_Grupos_Clientes($cliente);
		echo json_encode($this->_listar_proveedor_servicio_especial);
	}

	public function Consultar_Contactos_Clientes()
	{
		$grupoid = $_POST["GrupoId"] ?? null;

		$this->_listar_proveedor_servicio_especial = $this->_modelo->Consultar_Contactos_Grupo($grupoid);
		echo json_encode($this->_listar_proveedor_servicio_especial);
	}


	public function Insertar_bodega()
	{
		$responsable_bodega = $_POST['responsable_bodega'] ?? '';
		$cliente_bodega = $_POST['cliente_bodega'] ?? '';
		$nombre_bodega = $_POST['nombre_bodega'] ?? '';
		$estado_bodega = $_POST['estado'] ?? '';

		$this->_insertar_bodega = $this->_modelo->insertar_bodega($responsable_bodega, $cliente_bodega, $nombre_bodega, $estado_bodega);
		echo json_encode($this->_insertar_bodega);
	}

	public function listar_responsables_vehiculo()
	{
		$this->listar_responsables_bodega = $this->_modelo->Consultar_responsables_vehiculo();
		echo json_encode($this->listar_responsables_bodega);
	}

	// CONTROLADOR: parametrosController.php

	public function listar_bodega()
	{
		// Si envías datos POST, podrías leerlos aquí:
		// $dato_enviado = $_POST['nombre_del_campo'] ?? null;

		// 1. Instanciar el modelo 
		// Asegúrate de que $this->_modelo esté inicializado con la conexión $_db3
		// $modelo = new parametrosModel($this->_db3); 

		// Usando tu variable interna:
		$bodegas = $this->_modelo->Listar_bodegas(); // Asumo Listar_bodegas() está en tu _modelo

		// 2. Devolver la respuesta como JSON
		// header('Content-Type: application/json');

		// Si DataTables o tu JS lo requiere con una clave 'data':
		echo json_encode(['data' => $bodegas]);
		// Si tu JS espera el array directo:
		// echo json_encode($bodegas);

		exit(); // Terminar la ejecución
	}

	public function listar_agencias_destino()
	{
		$this->listar_agencias = $this->_modelo->Consultar_agencias_destino();
		echo json_encode($this->listar_agencias);
	}

	public function listar_agencias_origen()
	{
		$this->listar_agencias = $this->_modelo->Consultar_agencias_origen();
		echo json_encode($this->listar_agencias);
	}
}
