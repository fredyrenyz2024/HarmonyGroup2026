<?php

session_start();

class prefiltro_nacionalController extends Controller
{
	private $pedir_vehiculo;
	private $solicitudes;
	private $_filtros;
	private $_consulta_remitente;
	private $_contenedores_vacios;
	private $_listar_enturnados;
	private $_insertar_registro_enturnamiento;
	private $_listar_enturnados_operacion;
	private $_insertar_gestion_vehiculo;
	private $_historico_gestion_vehiculo;

	public function __construct()
	{
		parent::__construct();
		$this->pedir_vehiculo = $this->loadModel('prefiltro_nacional'); //se añade el modelo a usar 
	}

	public function index()
	{
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

	public function estudios()
	{
		$this->_view->titulo = 'Estudios de seguridad';
		$this->_view->renderizar_ventana('estudios', 'prefiltro_nacional'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function contenedor_vacio()
	{
		$this->_view->titulo = 'Contenedor vacio';
		$this->_view->renderizar_ventana('contenedor_vacio', 'prefiltro_nacional'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	// public function enturnados()
	public function gestionados()
	{
		$this->_view->titulo = 'Vehiculos Gestionados';
		$this->_view->renderizar_ventana('enturnados', 'prefiltro_nacional'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function enturnados()
	{
		$this->_view->titulo = 'Vehiculos Enturnados';
		$this->_view->renderizar_ventana('enturnado', 'prefiltro_nacional'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function historico_enturnados()
	{
		$this->_view->titulo = 'Vehiculos Enturnados';
		$this->_view->renderizar_ventana('historico_enturnado', 'prefiltro_nacional'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function subasta()
	{
		$this->_view->titulo = 'Subasta estudios de seguridad';
		$this->_view->renderizar_ventana('subasta', 'prefiltro_nacional');
	}

	public function orden_de_cargue()
	{
		$this->_view->titulo = 'Orden Cargue';
		$this->_view->renderizar_ventana('orden_cargue', 'prefiltro_nacional');
	}

	public function remesas()
	{
		$this->_view->titulo = 'Orden Cargue';
		$this->_view->renderizar_ventana('remesa', 'prefiltro_nacional');
	}

	public function manifiesto()
	{
		$this->_view->titulo = 'Manifiestos';
		$this->_view->renderizar_ventana('manifiesto', 'prefiltro_nacional');
	}

	public function cumplidos()
	{
		$this->_view->titulo = 'Cumplidos';
		$this->_view->renderizar_ventana('cumplidos', 'prefiltro_nacional');
	}

	public function compromisos()
	{
		$this->_view->titulo = 'Compromisos';
		$this->_view->renderizar_ventana('compromisos', 'prefiltro_nacional');
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
		$estado = $_POST["estado"] ?? null;
		$filtros = $_POST["filtros"] ?? null;
		// Si cliente/empresa están vacíos, se asignan como NULL o cadena vacía
		$cliente = !empty($_POST['cliente']) ? intval($_POST['cliente']) : null; // Si es numérico
		$empresa = !empty($_POST['empresa']) ? intval($_POST['empresa']) : null;
		$id_usuario = $_SESSION["usuario"]["id_usuario"];
		$this->solicitudes = $this->pedir_vehiculo->getasignarvehiculo($id_usuario, $filtro, $fecha_inicial, $fecha_final, $estado, $cliente, $empresa, $filtros);
		echo json_encode($this->solicitudes);
	}

	/* Cargar filtros */
	public function crear_filtro()
	{
		$ventana = $_POST['param1'];
		$this->_filtros = $this->_view->Cargar_Filtros_ventana($ventana);
		echo json_encode($this->_filtros);
	}

	public function consulta_remitente()
	{
		$numero_cotizacion = $_POST["cotizar"];
		$solicitud_servicio = $_POST["solicitud"];
		$this->_consulta_remitente = $this->pedir_vehiculo->consulta_remitentes($numero_cotizacion, $solicitud_servicio);
		echo json_encode($this->_consulta_remitente);
	}

	public function Consultar_Contenedores_Vacios()
	{
		$fecha_inicial = $_POST["fecha_inicial"];
		$fecha_final = $_POST["fecha_final"];

		$this->_contenedores_vacios = $this->pedir_vehiculo->consulta_contenedores_vacios($fecha_inicial, $fecha_final);
		echo json_encode($this->_contenedores_vacios);
	}

	public function GuardarOperacionContenedor()
	{
		// $SolicitudId = $_POST['Solicitud_Id'];
		// $EstadoGestion = $_POST['EstadoGestion'];
		// $FechaDevolucion = $_POST['FechaDevolucion'];
		// $Patio = $_POST['Patio'];
		// $Municipio = $_POST['Municipio'];
		// $Redireccionado = $_POST['Redireccionado'];
		// $FechaCita = $_POST['FechaCita'];
		// $Soporte = $_POST['Soporte'];
		// $PatioRedireccion = $_POST['PatioRedireccion'];
		// $ObservacionGestion = $_POST['ObservacionGestion'];

		// $estado = $_POST['estado'];
		// $DiasVencidos = $_POST['DiasVencidos'];
		// $this->_contenedores_vacios = $this->pedir_vehiculo->ActualizarEstadoContenedorVacio($SolicitudId, $estado, $DiasVencidos);
		// echo json_encode($this->_contenedores_vacios);

		header('Content-Type: application/json');

		// --- 1. Capturar y encapsular TODOS los datos (POST y FILES) ---

		// 🚨 SEGURIDAD: El campo de Redireccionado viene como 'true'/'false' string desde JS
		$Redireccionado = ($_POST['Redireccionado'] === 'true') ? 'Si' : 'No';

		$datos = [
			'solicitud_id'          => (int) ($_POST['Solicitud_Id'] ?? 0),
			'estado_gestion'        => $_POST['EstadoGestion'] ?? null,
			'fecha_devolucion'      => $_POST['FechaDevolucion'] ?? null,
			'patio'                 => $_POST['Patio'] ?? null,
			'municipio'             => $_POST['Municipio'] ?? null, // Será 'ciudad' en el modelo
			'redireccion'           => $Redireccionado,
			'fecha_cita'            => $_POST['FechaCita'] ?? null,
			'patio_redireccion'     => $_POST['PatioRedireccion'] ?? null,
			'observacion'           => $_POST['ObservacionGestion'] ?? null,

			// 👈 PASAMOS LOS OBJETOS DE ARCHIVO COMPLETOS A TRAVÉS DEL ARRAY
			'tirilla_file'          => $_FILES['Tirilla'] ?? null,
			'soporte_file'          => $_FILES['Soporte'] ?? null,
			'tiempo_transcurrido'          => $_POST['DiasVencidos'] ?? null,
			'fecha_historico'          => $_POST['FechaVencimientoActual'] ?? null,
			'fecha_nueva'          => $_POST['FechaVencimientoNueva'] ?? null,

			// DEVOLUCION DE LOS CONETEBEDOIRES EN OTRO VEHICULO
			'DevolucionMismoVehiculo'   => $_POST['DevolucionMismoVehiculo'] ?? null,
			'numdoc_solicitud'          => $_POST['numdoc_solicitud'] ?? null,
			'manifiesto'          		=> $_POST['manifiesto'] ?? null,
			'nueva_placa'               => $_POST['nueva_placa'] ?? null,
		];

		try {
			// --- 2. Llamada al Modelo ---
			// El modelo manejará la subida de archivos y la inserción BD
			$respuesta = $this->pedir_vehiculo->guardarGestionContenedor($datos);

			echo json_encode($respuesta);
		} catch (\Exception $e) {
			http_response_code(500);
			echo json_encode(['status' => false, 'mensaje' => 'Error al procesar la gestión: ' . $e->getMessage()]);
		}
	}

	// public function GuardarOperacionContenedor()
	// {
	// 	$SolicitudId = $_POST['SolicitudId'];
	// 	$estado = $_POST['estado'];
	// 	$DiasVencidos = $_POST['DiasVencidos'];
	// 	$this->_contenedores_vacios = $this->pedir_vehiculo->ActualizarEstadoContenedorVacio($SolicitudId, $estado, $DiasVencidos);
	// 	echo json_encode($this->_contenedores_vacios);
	// }

	public function Listar_Recursos_Enturnar()
	{
		$origenEnturnar = $_POST['origenEnturnar'];
		$this->_listar_enturnados = $this->pedir_vehiculo->Listar_Recursos_Enturnar($origenEnturnar);
		echo json_encode($this->_listar_enturnados);
	}

	public function Enviar_mensaje_conductor()
	{
		// 🛑 VALIDACIÓN INICIAL
		if (!isset($_POST['TelefonoConductor']) || empty($_POST['TelefonoConductor'])) {
			http_response_code(400);
			echo json_encode(["estado" => 400, "mensaje" => "Número de teléfono no proporcionado."]);
			return;
		}

		// 1. Captura de datos
		$TelefonoConductor = $_POST['TelefonoConductor'] ?? null;
		$Conductor = $_POST['Conductor'] ?? null;
		$Origen = $_POST['Origen'] ?? null;
		$Destino = $_POST['Destino'] ?? null;
		$FechCargue = $_POST['FechCargue'] ?? null;
		$HoraCargue = $_POST['HoraCargue'] ?? null;
		$NudocSolicitud = $_POST['NudocSolicitud'] ?? null;
		$ConductorId = $_POST['ConductorId'] ?? null;
		$Placa = $_POST['Placa'] ?? null;
		$Lugar = $_POST['Lugar'] ?? null;
		$Peso = $_POST['Peso'] ?? null;

		// 2. Insertar registro de enturnamiento
		$this->_insertar_registro_enturnamiento = $this->pedir_vehiculo->Insertar_Enturnamiento($ConductorId, $Origen, $Destino, $NudocSolicitud, $Placa, $Conductor, $Lugar);

		// 3. Validar el INSERT
		if ($this->_insertar_registro_enturnamiento['estado'] !== 200) {
			http_response_code(500);
			echo json_encode([
				"estado" => 500,
				"mensaje" => "No se pudo registrar el enturnamiento. No se envió el mensaje.",
				"detalle" => $this->_insertar_registro_enturnamiento['mensaje']
			]);
			return;
		}
		// API de Laravel para WhatsApp
		$url = 'http://127.0.0.1:8000/api/whatsapp/send'; // Reemplaza con tu URL Prueba

		// Datos del mensaje
		// $to = ['573017925954', '573133354074'];
		$data = [
			// 'to' => '573133354074',
			// 'to' => '573017925954',
			'to' => '573168344312',
			// 'to' => $to,
			'message' => 'Hola desde PHP puro!',
			'NudocSolicitud' => $NudocSolicitud,
			'Conductor' => $Conductor,
			'ConductorId' => $ConductorId,
			'Origen' => $Origen,
			'Destino' => $Destino,
			'FechCargue' => $FechCargue,
			'HoraCargue' => $HoraCargue,
			'Peso' => $Peso,
		];

		// Opciones de la solicitud HTTP
		$options = [
			'http' => [
				'header'  => "Content-type: application/json\r\n",
				'method'  => 'POST',
				'content' => json_encode($data),
			],
		];

		// Crear contexto
		$context  = stream_context_create($options);

		// Enviar la solicitud
		$result = file_get_contents($url, false, $context);

		// Manejar errores
		if ($result === FALSE) {
			die('Error al enviar mensaje');
		}

		// Mostrar resultado
		echo $result;
	}

	public function Enviar_multiples_vehiculos()
	{
		// 1. Recibir JSON desde fetch
		$input = json_decode(file_get_contents("php://input"), true);

		if (!isset($input["vehiculos"]) || empty($input["vehiculos"])) {
			http_response_code(400);
			echo json_encode([
				"estado" => 400,
				"mensaje" => "No se recibieron vehículos seleccionados"
			]);
			return;
		}

		$vehiculos = $input["vehiculos"];
		$resultados = [];

		// URL de tu API Laravel
		$urlLaravel = 'http://127.0.0.1:8000/api/whatsapp/send';

		foreach ($vehiculos as $v) {

			// 🔹 Normalizar datos que vienen del dataset
			$Placa          = $v["placa"]            ?? null;
			$Conductor      = $v["nombreConductor"]  ?? null;
			$ConductorId    = $v["conductorId"]      ?? null;
			$Origen         = $v["origen"]           ?? null;
			$Destino        = $v["destino"]          ?? null;
			$Lugar          = $v["origenEnturnar"]   ?? null; // o el lugar que quieras guardar
			$NudocSolicitud = $v["nudocSolicitud"]   ?? null;
			$FechCargue     = $v["fechaCargue"]       ?? null;
			$HoraCargue     = $v["horaCargue"]       ?? null;
			$Peso           = $v["peso"]             ?? null;
			$CelularRaw     = $v["celularConductor"] ?? null;

			// 🔹 Obtener solo el primer celular (3214... de "3214 - 3214")
			$TelefonoConductor = $this->obtenerPrimerCelular($CelularRaw);

			// 2. Insertar registro de enturnamiento
			$insert = $this->pedir_vehiculo->Insertar_Enturnamiento(
				(int)$ConductorId,
				$Origen,
				$Destino,
				(int)$NudocSolicitud,
				$Placa,
				$Conductor,
				$Lugar
			);

			// Si el insert falla, no intento enviar WhatsApp
			if ($insert['estado'] !== 200) {
				$resultados[] = [
					"placa" => $Placa,
					"estado" => 500,
					"mensaje" => "Error al registrar enturnamiento. No se envió WhatsApp.",
					"detalle" => $insert['mensaje'] ?? null
				];
				continue; // pasa al siguiente vehículo
			}

			// 3. Enviar mensaje de WhatsApp (si hay teléfono)
			// if ($TelefonoConductor) {

			// 	// Puedes mandar uno por cada vehículo
			// 	$to = [$TelefonoConductor];
			// } else {
			// 	$resultados[] = [
			// 		"placa"   => $Placa,
			// 		"estado"  => 200,
			// 		"mensaje" => "Enturnado, pero no se envió WhatsApp (sin teléfono válido)",
			// 	];
			// }

			$data = [
				// 'to'             => $to,
				'to' => '573017925954',
				'message'        => "Hola {$Conductor}, tienes una solicitud de viaje.\nOrigen: {$Origen}\nDestino: {$Destino}\nFecha: {$FechCargue} {$HoraCargue}\nPlaca: {$Placa}\nPeso: {$Peso}",
				'NudocSolicitud' => $NudocSolicitud,
				'Conductor'      => $Conductor,
				'ConductorId'    => $ConductorId,
				'Origen'         => $Origen,
				'Destino'        => $Destino,
				'FechCargue'     => $FechCargue,
				'HoraCargue'     => $HoraCargue,
				'Peso'           => $Peso,
			];

			$options = [
				'http' => [
					'header'  => "Content-type: application/json\r\n",
					'method'  => 'POST',
					'content' => json_encode($data),
					'timeout' => 10
				],
			];

			$context  = stream_context_create($options);
			$resultLaravel = @file_get_contents($urlLaravel, false, $context);

			if ($resultLaravel === FALSE) {
				$resultados[] = [
					"placa" => $Placa,
					"estado" => 500,
					"mensaje" => "Enturnado, pero error al enviar WhatsApp",
					"telefono" => $TelefonoConductor
				];
			} else {
				$resultados[] = [
					"placa" => $Placa,
					"estado" => 200,
					"mensaje" => "Enturnado y WhatsApp enviado correctamente",
					"telefono" => $TelefonoConductor,
					"api_response" => json_decode($resultLaravel, true)
				];
			}
		}

		echo json_encode([
			"estado" => 200,
			"mensaje" => "Procesamiento de vehículos terminado",
			"resultado" => $resultados
		]);
	}

	private function obtenerPrimerCelular($cadenaCelular)
	{
		if (empty($cadenaCelular)) return null;

		// Separar por " - "
		$partes = preg_split('/\s*-\s*/', $cadenaCelular);
		$primerNumero = trim($partes[0] ?? '');

		// Dejar solo dígitos
		$soloDigitos = preg_replace('/\D+/', '', $primerNumero);

		// Opcional: validar longitud típica en Colombia (10 dígitos)
		if (strlen($soloDigitos) === 10) {
			return '57' . $soloDigitos; // +57 (sin + porque tú usas 57xxxx en Laravel)
		}

		return $soloDigitos ?: null;
	}

	public function Listar_Enturnados()
	{
		$this->_listar_enturnados_operacion = $this->pedir_vehiculo->ListarEnturnadosOperacion();
		echo json_encode($this->_listar_enturnados_operacion);
	}

	/**
	 * Actualiza la fecha de vencimiento de una solicitud.
	 */
	public function actualizarFechaVencimiento()
	{
		header('Content-Type: application/json');

		if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
			http_response_code(405);
			echo json_encode(['status' => false, 'message' => 'Método no permitido.']);
			return;
		}

		$json_data = file_get_contents('php://input');
		$datos = json_decode($json_data, true);

		// 🚨 SEGURIDAD: Validar y sanear los datos
		if (empty($datos['solicitud_id']) || !is_numeric($datos['solicitud_id']) || empty($datos['fecha_nueva'])) {
			http_response_code(400);
			echo json_encode(['status' => false, 'message' => 'ID de solicitud o fecha nueva inválidos.']);
			return;
		}

		// Sanear y convertir a tipos correctos
		$solicitudId = (int) $datos['solicitud_id'];
		$fechaNueva = trim($datos['fecha_nueva']);
		$fecha_actual = trim($datos['fecha_actual']);
		$dias_vencidos = trim($datos['dias_vencidos']);

		try {
			// Llamar al Modelo para realizar la actualización
			$resultado = $this->pedir_vehiculo->updateFechaVencimiento($solicitudId, $fechaNueva, $fecha_actual, $dias_vencidos);

			echo json_encode($resultado);
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['status' => false, 'message' => 'Error interno del servidor: ' . $e->getMessage()]);
		}
	}

	public function ConsultarHistoricoContenedor()
	{
		$SolicitudId = trim($_POST['SolicitudId']);

		try {
			// Llamar al Modelo para realizar la actualización
			$resultado = $this->pedir_vehiculo->HistoricoUpdateContenedor($SolicitudId);

			echo json_encode($resultado);
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['status' => false, 'message' => 'Error interno del servidor: ' . $e->getMessage()]);
		}
	}

	public function Vaijes_Vehiculos()
	{
		$Origen = $_POST['origen'];
		$Destino = $_POST['destino'];

		$this->_listar_enturnados_operacion = $this->pedir_vehiculo->Viajes_Vehiculos($Origen, $Destino);
		echo json_encode($this->_listar_enturnados_operacion);
	}

	public function Insertar_Gestion_Vehiculo()
	{
		$estado = $_POST['estado'];
		$observaciones = $_POST['observaciones'];
		$gestion_id = $_POST['gestion_id'];

		$this->_insertar_gestion_vehiculo = $this->pedir_vehiculo->Insertar_Gestion_Vehiculo($estado, $observaciones, $gestion_id);
		echo json_encode($this->_insertar_gestion_vehiculo);
	}

	public function Historico_Gestion()
	{
		$GestionId = $_POST['GestionId'] ?? null;

		if (!$GestionId) {
			echo json_encode(['status' => false, 'message' => 'ID de gestión no recibido.']);
			return;
		}

		$resultado = $this->pedir_vehiculo->HistoricoGestion($GestionId);

		echo json_encode([
			'status' => true,
			'message' => 'Histórico obtenido correctamente.',
			'data' => $resultado
		]);
	}

	public function Buscar_Placa()
	{
		$placa = isset($_POST['placa']) ? trim($_POST['placa']) : '';

		if (empty($placa)) {
			echo json_encode(['status' => false, 'message' => 'Placa no proporcionada.']);
			return;
		}

		$vehiculo = $this->pedir_vehiculo->BuscarPorPlaca($placa);

		if ($vehiculo) {
			echo json_encode([
				'status' => true,
				'vehiculo' => $vehiculo
			]);
		} else {
			echo json_encode([
				'status' => false,
				'message' => 'Vehículo no encontrado.'
			]);
		}
	}

	public function InsertarEnturnamiento()
	{
		header('Content-Type: application/json');

		$data = json_decode(file_get_contents('php://input'), true);

		try {
			$result = $this->pedir_vehiculo->insertarEntrunamientoVehiculos($data);
			echo json_encode(['status' => true, 'message' => 'Registro insertado correctamente']);
		} catch (Exception $e) {
			echo json_encode(['status' => false, 'message' => $e->getMessage()]);
		}
	}

	// public function Listar_Vehiculos_Enturnados()
	// {
	// 	try {
	// 		// $modelo = new prefiltro_nacionalModel();
	// 		$resultado = $this->pedir_vehiculo->ListarVehiculosEnturnados();

	// 		header('Content-Type: application/json; charset=utf-8');
	// 		echo json_encode($resultado);
	// 	} catch (Exception $e) {
	// 		echo json_encode([
	// 			'status' => false,
	// 			'message' => 'Error en el controlador: ' . $e->getMessage()
	// 		]);
	// 	}
	// }

	public function Listar_Vehiculos_Enturnados()
	{
		try {
			$data = json_decode(file_get_contents("php://input"), true) ?? [];

			$resultado = $this->pedir_vehiculo->ListarVehiculosEnturnados($data);

			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($resultado);
		} catch (Exception $e) {
			echo json_encode([
				'status' => false,
				'message' => 'Error en el controlador: ' . $e->getMessage()
			]);
		}
	}

	public function Guardar_Gestion()
	{
		header("Content-Type: application/json; charset=utf-8");

		$Estado = $_POST['Estado'] ?? null;
		$Motivo = $_POST['Motivo'] ?? null;
		$IdGestion = $_POST['IdGestion'] ?? null;

		if (!$IdGestion) {
			echo json_encode(['status' => false, 'message' => 'ID no recibido.']);
			exit;
		}

		// Datos del usuario actual
		$Usuario = $_SESSION['usuario']['nom_usuario'] ?? 'SIN_USER';

		// Fecha y hora actual
		date_default_timezone_set('America/Bogota');
		$Fecha = date("Y-m-d");
		$Hora = date("H:i:s");

		// $modelo = new EnturnamientoModel();

		$ok =  $this->pedir_vehiculo->ActualizarGestion($IdGestion, $Estado, $Motivo, $Usuario, $Fecha, $Hora);

		if ($ok) {
			echo json_encode(['status' => true, 'message' => 'Gestión actualizada correctamente.']);
		} else {
			echo json_encode(['status' => false, 'message' => 'No se pudo actualizar la gestión.']);
		}
	}

	public function Listar_Vehiculos_Historico_Enturnados()
	{
		try {
			// $modelo = new prefiltro_nacionalModel();
			$resultado = $this->pedir_vehiculo->ListarVehiculosHistoricoEnturnados();

			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($resultado);
		} catch (Exception $e) {
			echo json_encode([
				'status' => false,
				'message' => 'Error en el controlador: ' . $e->getMessage()
			]);
		}
	}
}
