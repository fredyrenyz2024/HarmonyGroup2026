<?php

class seguridad_prefiltroController extends Controller
{

	public $_modelo;
	public $_listar_recursos;
	public $_filtros;
	public $_inhabilitar_vehiculo;
	public $_listar_clientes;

	public function __construct()
	{
		parent::__construct();
		$this->_modelo = $this->loadModel('prefiltro_seguridad');
	}

	public function index()
	{
		$pedir_vehiculo = $this->loadModel('prefiltro_seguridad'); //se añade el modelo a usar 
		$this->_view->pedir_vehiculo = $pedir_vehiculo; // Se einsatcia el modelos
		$this->_view->titulo = 'Historial de Estudio';
		$this->_view->renderizar('index_solicitudes', 'seguridad_prefiltro'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function index_estudio()
	{
		$estudio_vehiculo = $this->loadModel('prefiltro_seguridad'); //se añade el modelo a usar 
		$this->_view->estudio_vehiculo = $estudio_vehiculo; // Se einsatcia el modelos
		$this->_view->titulo = 'Estudio de Seguridad';
		$this->_view->renderizar('index_estudio', 'seguridad_prefiltro'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function historico_segu_opera()
	{
		$index_historico = $this->loadModel('prefiltro_seguridad'); //se añade el modelo a usar 
		$this->_view->index_historico = $index_historico; // Se einsatcia el modelos
		$this->_view->titulo = 'Informe de Productividad';
		$this->_view->renderizar('historico_segu_opera', 'seguridad_prefiltro'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function preestudio_solicitudes()
	{
		$index_preestudio = $this->loadModel('prefiltro_seguridad'); //se añade el modelo a usar 
		$this->_view->index_preestudio = $index_preestudio; // Se einsatcia el modelos
		$this->_view->titulo = 'Solicitudes de Prefiltro - Seguridad';
		$this->_view->renderizar('preestudio_solicitudes', 'seguridad_prefiltro'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function estudios()
	{
		$this->_view->titulo = 'Solicitudes de Prefiltro - Seguridad';
		$this->_view->renderizar_ventana('estudios_seguridad', 'seguridad_prefiltro'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	// public function habilitar_carropreestudio()
	public function recursos()
	{
		$this->_view->titulo = 'Desbloqueo de vehículos para preestudio';
		$this->_view->renderizar_ventana('todos', 'seguridad_prefiltro');
	}

	public function clientes()
	{
		$this->_view->titulo = 'Desbloqueo de clientes';
		$this->_view->renderizar_ventana('clientes', 'seguridad_prefiltro');
	}

	public function listar_recursos()
	{
		$datos = [
			'filtro' => $_POST['filtro'] ?? null,
			'valor' => $_POST['valor'] ?? null,
			'busqueda' => $_POST['busqueda'] ?? null,
		];
		$this->_listar_recursos = $this->_modelo->Listar_Datos_Recursos($datos);
		echo json_encode($this->_listar_recursos);
	}

	public function Inhabilitar_vehiculo()
	{
		// 1. Saneamiento y Validación de Entradas (Mejora de seguridad y robustez)
		// Se usa un array para definir todos los campos obligatorios.
		$required_fields = ['RecursoId', 'EstadoActual', 'Estado', 'TipoHinhabilitacion', 'Observacion', 'Objeto', 'PropietarioId', 'TenedorId', 'ConductorId'];

		foreach ($required_fields as $field) {
			// Asignamos el valor, o null si no existe.
			$datos[$field] = $_POST[$field] ?? null;

			// Verificación de campos CRÍTICOS para la operación
			if (in_array($field, ['RecursoId', 'EstadoActual']) && $datos[$field] === null) {
				echo json_encode(['status' => false, 'message' => 'Error: faltan datos críticos para la operación (RecursoId o EstadoActual).']);
				return;
			}
		}

		// 2. Asignación de datos (usando el array saneado)
		// Los IDs de terceros (PropietarioId, TenedorId, ConductorId) se dejan como null o vacío si no se enviaron.
		$datos = [
			'RecursoId'           => $datos['RecursoId'],
			'Estado'              => $datos['Estado'],
			'TipoHinhabilitacion' => $datos['TipoHinhabilitacion'],
			'Observacion'         => $datos['Observacion'],
			'Objeto'              => $datos['Objeto'],
			'EstadoActual'        => $datos['EstadoActual'],
			'PropietarioId'       => $datos['PropietarioId'],
			'TenedorId'           => $datos['TenedorId'],
			'ConductorId'         => $datos['ConductorId']
		];

		$respuesta_modelo = ['status' => false, 'message' => 'Operación no definida.'];

		// 3. Delegación de la Lógica al Modelo
		if ($datos['EstadoActual'] === 'desbloqueado') { // Inhabilitar vehículo
			// El método Inhabilitar_vehiculo en el modelo devuelve un array ['status' => bool, 'message' => string]
			$respuesta_modelo = $this->_modelo->Inhabilitar_vehiculo($datos);
		} elseif ($datos['EstadoActual'] === 'INHABILITADO') {
			// Lógica para Habilitar (desbloqueado)
			$respuesta_modelo = $this->_modelo->Habilitar_vehiculo($datos);
		}

		// 4. Devolver la respuesta del modelo
		echo json_encode($respuesta_modelo);
		// return;
	}

	/**
	 * Recibe los datos de inhabilitación/habilitación y llama al modelo.
	 */
	public function inhabilitarRecurso()
	{
		// Configurar la cabecera para devolver JSON
		header('Content-Type: application/json');

		if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
			http_response_code(405);
			echo json_encode([['status' => false, 'message' => 'Método no permitido']]);
			return;
		}

		// Obtener y decodificar los datos JSON
		$json_data = file_get_contents('php://input');
		$datos = json_decode($json_data, true);

		// **SEGURIDAD:** Validar entradas esenciales
		if (!isset($datos['RecursoId'], $datos['Objeto'], $datos['Estado'], $datos['TipoHinhabilitacion'])) {
			http_response_code(400); // Bad Request
			echo json_encode([['status' => false, 'message' => 'Faltan parámetros obligatorios.']]);
			return;
		}

		try {
			// Llamar al método del Modelo
			// Usamos un nombre de método genérico ya que el modelo maneja la lógica de bloqueo/desbloqueo
			$respuesta = $this->_modelo->gestionarBloqueoRecurso($datos);

			echo json_encode($respuesta);
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode([['status' => false, 'message' => 'Error interno del servidor: ' . $e->getMessage()]]);
		}
	}

	public function Inhabilitar_cliente()
	{
		//total_factura_instruccion
		$cupo_facturacion = $_POST['cupo_facturacion']; // "$ 1.400.000,00"

		// Paso 1: Quitar el símbolo de pesos y espacios
		$valorLimpio_cupo_facturacion = str_replace(['$', ' ', ' '], '', $cupo_facturacion);

		// Paso 2: Reemplazar puntos de miles y cambiar coma decimal por punto
		$valorDecimal_cupo_facturacion = str_replace('.', '', $valorLimpio_cupo_facturacion); // "1400000,00"
		$valorDecimal_cupo_facturacion = str_replace(',', '.', $valorDecimal_cupo_facturacion); // "1400000.00"

		// Paso 3: Convertir a float o dejar como string para la base de datos
		$valorFinal_cupo_facturacion = floatval($valorDecimal_cupo_facturacion); // 1400000.00

		// $cupo_facturacion = $_POST['cupo_facturacion']; // "$ 1.400.000,00"

		// // Paso 1: Quitar el símbolo de pesos y espacios
		// $valorLimpio_cupo_facturacion = str_replace(['$', ' ', ' '], '', $cupo_facturacion);

		// // Paso 2: Reemplazar puntos de miles y cambiar coma decimal por punto
		// $valorDecimal_cupo_facturacion = str_replace('.', '', $valorLimpio_cupo_facturacion); // "1400000,00"
		// $valorDecimal_cupo_facturacion = str_replace(',', '.', $valorDecimal_cupo_facturacion); // "1400000.00"

		// // Paso 3: Convertir a float o dejar como string para la base de datos
		// $valorFinal_cupo_facturacion = floatval($valorDecimal_cupo_facturacion); // 1400000.00

		$datos = [
			'EstadoCliente' => $_POST['EstadoCliente'],
			'cupo_facturacion' => $valorFinal_cupo_facturacion,
			'DiasVencimiento' => $_POST['DiasVencimiento'],
			'ClienteId' => $_POST['ClienteId'],
			'Observacion' => $_POST['Observacion'],
		];

		$this->_inhabilitar_vehiculo = $this->_modelo->Inhabilitar_cliente($datos);
		echo json_encode($this->_inhabilitar_vehiculo);
	}

	public function crear_filtro()
	{
		$ventana = $_POST['param1'];
		$this->_filtros = $this->_view->Cargar_Filtros_ventana($ventana);
		echo json_encode($this->_filtros);
	}

	public function listar_clientes_bloqueo()
	{
		$buscar = $_POST['buscar'] ?? null;
		$filtro = $_POST['filtro'] ?? null;
		$this->_listar_clientes = $this->_modelo->Listar_Clientes_Bloqueo($buscar, $filtro);
		echo json_encode($this->_listar_clientes);
	}

	/**
	 * Maneja la solicitud POST para obtener el histórico de bloqueos de un vehículo.
	 * * @return void Envía respuesta JSON al cliente.
	 */
	public function obtenerHistoricoBloqueos()
	{
		// Asegurar que la solicitud sea POST
		if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
			http_response_code(405); // Método no permitido
			echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
			return;
		}

		// Obtener los datos JSON de la solicitud
		$json_data = file_get_contents('php://input');
		$data = json_decode($json_data, true);

		// **SEGURIDAD:** Validar y sanear la entrada
		if (!isset($data['vehiculo_id']) || !is_numeric($data['vehiculo_id'])) {
			http_response_code(400); // Solicitud incorrecta
			echo json_encode(['status' => 'error', 'message' => 'ID de vehículo inválido o faltante.']);
			return;
		}

		// Sanear la entrada: Aseguramos que sea un entero
		$vehiculoId = (int) $data['vehiculo_id'];

		try {
			// Llamar al Modelo para obtener el historial
			$historico =  $this->_modelo->getHistoricoBloqueosById($vehiculoId);

			// Devolver la respuesta al cliente
			echo json_encode([
				'status' => 'success',
				'data' => $historico
			]);
		} catch (Exception $e) {
			// Manejo de errores de la base de datos o modelo
			http_response_code(500); // Error interno del servidor
			echo json_encode(['status' => 'error', 'message' => 'Error al consultar el histórico: ' . $e->getMessage()]);
		}
	}

	/**
	 * Recibe los datos del switch y actualiza el estado del cliente.
	 */
	public function actualizarEstadoCliente()
	{
		header('Content-Type: application/json');

		if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
			http_response_code(405);
			echo json_encode(['status' => false, 'message' => 'Método no permitido.']);
			return;
		}

		// 1. Capturar y sanear los datos del FormData
		$datos = [
			'documento'    => $_POST['documento'] ?? null,
			'clienteId'    => (int) ($_POST['cliente_id'] ?? 0),
			'nuevo_estado' => $_POST['nuevo_estado'] ?? 'INACTIVO' // ACTIVO o INACTIVO
		];

		// 2. Validación básica
		if (empty($datos['clienteId']) || empty($datos['documento'])) {
			http_response_code(400);
			echo json_encode(['status' => false, 'message' => 'Datos de cliente incompletos o inválidos.']);
			return;
		}

		try {
			// 3. Llamar al Modelo
			$respuesta = $this->_modelo->setEstadoCliente($datos);

			echo json_encode($respuesta);
		} catch (Exception $e) {
			// Manejo de errores de BD o internos
			http_response_code(500);
			echo json_encode(['status' => false, 'message' => 'Error al actualizar el estado: ' . $e->getMessage()]);
		}
	}
}
