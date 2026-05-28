<?php

class novedadesController extends Controller
{
	private $_modelo;
	private $_Listar_Manfiestos_Seguimiento;
	private $_filtros;
	private $_configuracion_envios;
	private $_actualizar_usuarios;

	public function __construct()
	{
		parent::__construct();
		$this->_modelo = $this->loadModel('novedades');
	}

	public function index()
	{
		$seguir_documento = $this->loadModel('novedades'); //se añade el modelo a usar 

		$this->_view->seguir_documento = $seguir_documento; // Se einsatcia el modelos
		$this->_view->titulo = 'Seguimiento a Documentos';
		$this->_view->renderizar('index', 'novedades'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function dsnube()
	{
		$this->_view->titulo = 'Retransmite Documentos';
		$this->_view->renderizar('dsnube', 'novedades'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function notificacion_seguimiento()
	{
		$this->_view->titulo = 'Portal Envio Reportes';
		$this->_view->renderizar('portal_index', 'novedades'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function portal_notificaciones()
	{
		$this->_view->titulo = 'Portal Envio Reportes';
		$this->_view->renderizar_ventana('portal_envios', 'novedades'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function anticipos_pagos()
	{
		$this->_view->titulo = 'Portal Pagos y Anticipos';
		$this->_view->renderizar('pagos/portal_pagos', 'novedades'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function anticipos()
	{
		$this->_view->titulo = 'Portal Envio Reportes';
		$this->_view->renderizar_ventana('pagos/index', 'novedades'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function liquidaciones()
	{
		$this->_view->titulo = 'Portal Envio Reportes';
		$this->_view->renderizar_ventana('pagos/liquidaciones', 'novedades'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function pagos()
	{
		$this->_view->titulo = 'Portal Programacion de pagos';
		$this->_view->renderizar_ventana('pagos/pagos', 'novedades'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function datos_bancarios()
	{
		$this->_view->titulo = 'Portal Datos Bancarios';
		$this->_view->renderizar('datos_bancarios', 'novedades'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function actualizar_datos_bancarios()
	{
		$this->_view->titulo = 'Portal Actualizar Datos Bancarios';
		$this->_view->renderizar_ventana('actualizar_datos_bancarios', 'novedades'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function cartera_clientes()
	{
		$this->_view->titulo = 'Portal Pago Carteras';
		$this->_view->renderizar_ventana('pagos/cartera_cliente', 'novedades'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function tarjetas()
	{
		$this->_view->titulo = 'Portal Tarjetas';
		$this->_view->renderizar('pagos/tarjetas', 'novedades'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function tarjetas_bancarias()
	{
		$this->_view->titulo = 'Portal Tarjetas Bancarias';
		$this->_view->renderizar_ventana('pagos/tarjetas_bancarias', 'novedades'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function asignar_tarjetas()
	{
		$this->_view->titulo = 'Portal Tarjetas Bancarias';
		$this->_view->renderizar_ventana('pagos/asignar_tarjeta', 'novedades'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function comprobacion_documentos()
	{
		$this->_view->titulo = 'Portal Tarjetas Bancarias';
		$this->_view->renderizar_ventana('pagos/comprobar_documentos', 'novedades'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function facturacion()
	{
		$this->_view->titulo = 'Facturación DSNUME';
		$this->_view->renderizar('facturacion/index', 'novedades'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function facturacion_dsnube()
	{
		$this->_view->titulo = 'Facturación DSNUME';
		$this->_view->renderizar_ventana('facturacion/facturacion_dsnube', 'novedades'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}


	public function crear_filtro()
	{
		$ventana = $_POST['param1'];
		$this->_filtros = $this->_view->Cargar_Filtros_ventana($ventana);
		echo json_encode($this->_filtros);
	}

	public function Listar_Manifiestos_Seguimiento()
	{
		$perfil_id = $_POST['perfil_id'];

		$this->_Listar_Manfiestos_Seguimiento = $this->_modelo->Listar_Manifiestos_Seguimiento($perfil_id);
		echo json_encode($this->_Listar_Manfiestos_Seguimiento);
	}

	public function Consultar_Configuraciones()
	{
		$ClienteId = $_POST['ClienteId'];
		$this->_configuracion_envios = $this->_modelo->Consultar_Configuraciones_Cliente($ClienteId);
		echo json_encode($this->_configuracion_envios);
	}

	//Funciones para actualizar los esyados de congiruacion
	public function Actualizar_Esatdo_Configuraciom()
	{
		$campo = $_POST['campo'];
		$valor = $_POST['valor'];
		$cliente_id = $_POST['cliente_id'];

		$this->_configuracion_envios = $this->_modelo->Actualizar_Campo_Configuracion($campo, $valor, $cliente_id);
		echo json_encode($this->_configuracion_envios);
	}

	public function Actualizar_Usuario()
	{
		// Recibir parámetros enviados por AJAX
		$detalleId       = $_POST['DetalleId'] ?? null;
		$clienteId       = $_POST['ClienteId'] ?? null;
		$configuracionId = $_POST['ConfiguracionId'] ?? null;
		$estado          = $_POST['Estado'] ?? null;

		// Pasárselos al modelo
		$this->_actualizar_usuarios = $this->_modelo->Actualizar_Usuario_Configuracion($detalleId, $clienteId, $configuracionId, $estado);
		echo json_encode($this->_actualizar_usuarios);
	}

	public function GuardarContactos()
	{
		$contactos = json_decode($_POST['contactos'], true);
		$configuracionId = $_POST['configuracion_id'];
		// Pasárselos al modelo
		$this->_actualizar_usuarios = $this->_modelo->GuardarContactosEnvio($contactos, $configuracionId);
		echo json_encode($this->_actualizar_usuarios);
	}

	/**
	 * Consulta general para obtener el conteo de manifiestos por titular.
	 */
	public function obtenerListaGeneralPagos()
	{
		header('Content-Type: application/json');

		if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
			// O GET, dependiendo de cómo llames tu función JS
			http_response_code(405);
			echo json_encode(['status' => false, 'message' => 'Método no permitido.']);
			return;
		}

		try {
			// Llamar al Modelo
			$resultado = $this->_modelo->getManifiestoConteoPorTitular();

			echo json_encode(['status' => true, 'data' => $resultado]);
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['status' => false, 'message' => 'Error interno: ' . $e->getMessage()]);
		}
	}

	public function obtenerListaGeneralLiquidaciones()
	{
		header('Content-Type: application/json');

		if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
			// O GET, dependiendo de cómo llames tu función JS
			http_response_code(405);
			echo json_encode(['status' => false, 'message' => 'Método no permitido.']);
			return;
		}

		try {
			// Llamar al Modelo
			$resultado = $this->_modelo->getManifiestoConteoPorTenedor();

			echo json_encode(['status' => true, 'data' => $resultado]);
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['status' => false, 'message' => 'Error interno: ' . $e->getMessage()]);
		}
	}

	/**
	 * Obtiene los datos detallados de los manifiestos para un titular específico
	 * y devuelve los datos o el HTML de la vista.
	 */
	public function obtenerDetalleManifiestos()
	{
		header('Content-Type: application/json');

		$nitTitular = $_POST['nit_titular'] ?? null;
		$Procedencia = isset($_POST['Procedencia']) ?? null;

		if (empty($nitTitular)) {
			http_response_code(400);
			echo json_encode(['status' => false, 'message' => 'NIT del titular no proporcionado.']);
			return;
		}

		try {
			// 1. Llamar al Modelo para obtener los datos
			// Usamos la función del modelo que definimos anteriormente

			if ($Procedencia == 'Liquidaciones') {
				$detalleManifiestos = $this->_modelo->getDetalleManifiestosTitular($nitTitular);
			} else {
				$detalleManifiestos = $this->_modelo->getDetalleManifiestosByTitular($nitTitular);
			}

			// 2. Devolver los datos puros y el NIT para el título en JS
			echo json_encode([
				'status' => true,
				'data' => $detalleManifiestos,
				'nit' => $nitTitular
			]);
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['status' => false, 'message' => 'Error al obtener el detalle: ' . $e->getMessage()]);
		}
	}

	/**
	 * Valida los datos bancarios y de cumplimiento del conductor.
	 */
	public function validarDatosAnticipo()
	{
		header('Content-Type: application/json');

		$numDocConductor = $_POST['Numdoc_Conductor'] ?? null;

		if (empty($numDocConductor)) {
			http_response_code(400);
			echo json_encode(['status' => false, 'message' => 'Documento del conductor no proporcionado.']);
			return;
		}

		try {
			$idProveedor = $numDocConductor;

			// 🚨 Paso 1: Llamar al Modelo para validar
			$validacion = $this->_modelo->validarDatosPagoConductor((int)$idProveedor);

			if ($validacion['status']) {
				// Si pasa la validación, devolvemos éxito y el método de pago activo
				$mensaje = "Validación exitosa. Método de pago activo: " . $validacion['metodo_pago'];
				echo json_encode(['status' => true, 'message' => $mensaje, 'validacion' => $validacion]);
			} else {
				// 🛑 Paso 2: Construir el mensaje de error DETALLADO si falla
				$errores = [];

				if (!$validacion['bancarios_ok']) {
					$errores[] = "No se encontró un método de pago activo (Cuenta Principal, Tarjeta o Beneficiario).";
				}

				if (!$validacion['cumplimiento_ok']) {
					// Asumiendo que el modelo validó el documento EPS/RUT
					$errores[] = "Documentación (EPS/RUT) incompleta o vencida.";
				}

				// Construimos un mensaje más informativo para el SweetAlert
				$mensaje = "El conductor no cumple los requisitos para anticipo.";
				if (!empty($errores)) {
					$mensaje .= " Faltan los siguientes requisitos: <br>" . implode("<br>", $errores);
				}

				echo json_encode(['status' => false, 'message' => $mensaje, 'validacion' => $validacion]);
			}
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['status' => false, 'message' => 'Error al validar datos: ' . $e->getMessage()]);
		}
	}

	/**
	 * Devuelve la lista de proveedores activos para llenar un select.
	 */
	public function listarProveedoresActivos()
	{
		header('Content-Type: application/json');

		$actividad = filter_input(INPUT_POST, 'actividad', FILTER_SANITIZE_SPECIAL_CHARS);

		if (empty($actividad)) {
			http_response_code(400);
			echo json_encode(['status' => false, 'message' => 'Actividad de proveedor no especificada.']);
			return;
		}

		try {
			// 🛑 LLAMADA AL MODELO con el parámetro de actividad
			$proveedores = $this->_modelo->getProveedoresActivos($actividad);

			echo json_encode(['status' => true, 'data' => $proveedores]);
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['status' => false, 'message' => 'Error al obtener lista de proveedores: ' . $e->getMessage()]);
		}
	}

	/**
	 * Guarda o actualiza los datos financieros de un proveedor.
	 */
	public function guardarDatosFinancieros()
	{
		header('Content-Type: application/json');

		// 1. Recibir datos y archivos (Expandido)
		$datos = $_POST;

		// Archivos del Proveedor Principal
		$file = $_FILES['certificado_file'] ?? null;
		$rut_file = $_FILES['rut_file'] ?? null;
		$seguridad_file = $_FILES['seguridad_file'] ?? null;

		// 🛑 Archivos del Beneficiario (NUEVOS)
		$file_ben_cuenta = $_FILES['certificado_cuenta_beneficiario_file'] ?? null;
		$file_ben_rut = $_FILES['certificado_rut_beneficiario_file'] ?? null;
		$file_ben_seguridad = $_FILES['certificado_seguridad_beneficiario_file'] ?? null;
		$file_ben_acuerdo = $_FILES['acuerdo_beneficiario_file'] ?? null;

		if (empty($datos['id_proveedor'])) {
			http_response_code(400);
			echo json_encode(['status' => false, 'message' => 'ID de proveedor no proporcionado.']);
			return;
		}

		try {
			// 3. Llamar al Modelo (Añadiendo los nuevos argumentos)
			$respuesta = $this->_modelo->upsertDatosFinancieros(
				$datos,
				$file,
				$rut_file,
				$seguridad_file, // Archivos del proveedor principal
				$file_ben_cuenta,
				$file_ben_rut,
				$file_ben_seguridad,
				$file_ben_acuerdo // 🛑 Archivos del beneficiario
			);

			echo json_encode($respuesta);
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['status' => false, 'message' => 'Error al guardar datos financieros: ' . $e->getMessage()]);
		}
	}

	/**
	 * Lista los registros financieros (cuentas bancarias) para un proveedor específico.
	 * Este método es llamado por el JS al cambiar el select de proveedor.
	 */
	public function listarDatosFinancieros()
	{
		header('Content-Type: application/json');

		$idProveedor = $_POST['id_proveedor'] ?? null;

		if (empty($idProveedor)) {
			// Devuelve un array vacío en lugar de un error HTTP 400 si la petición es válida pero el dato no
			echo json_encode(['status' => true, 'data' => [], 'message' => 'ID de proveedor no proporcionado para la búsqueda.']);
			return;
		}

		try {
			// 1. Llamar al Modelo para obtener el listado
			// Asumo que tu modelo tiene un método getDatosFinancierosByProveedor($idProveedor)
			$listado = $this->_modelo->getDatosFinancierosByProveedor((int)$idProveedor);

			echo json_encode(['status' => true, 'data' => $listado]);
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['status' => false, 'message' => 'Error al listar datos financieros: ' . $e->getMessage()]);
		}
	}

	public function UpdateAnticipo()
	{
		// ... (Captura y sanitización de variables se mantienen) ...
		$manifiesto_id = $_POST['manifiesto_id'] ?? null;
		$valorFormateado3 = $_POST['anticipo'];
		$valorLimpio3 = str_replace(['$', ' ', ' '], '', $valorFormateado3);

		// Paso 2: Reemplazar puntos de miles y cambiar coma decimal por punto
		$valorDecimal3 = str_replace('.', '', $valorLimpio3); // "1400000,00"
		$valorDecimal3 = str_replace(',', '.', $valorDecimal3); // "1400000.00"

		// Paso 3: Convertir a float o dejar como string para la base de datos
		$tarifa_anticipo = floatval($valorDecimal3); // 1400000.00

		$fecha_anticipo = $_POST['fecha_anticipo'] ?? null;
		$documento_anticipo = $_FILES['documento_anticipo'] ?? null;
		$numdoc_conductor = $_POST['numdoc_conductor'] ?? null;

		// 🛑 Nuevos campos de método de pago
		$slct_metodo_pago = $_POST['slct_metodo_pago'] ?? null;
		$slct_tarjeta_disponible = $_POST['slct_tarjeta_disponible'] ?? null;
		$slct_cuenta_bancaria = $_POST['slct_cuenta_bancaria'] ?? null;

		if (empty($manifiesto_id)) {
			// ... (Manejo de error)
			http_response_code(400);
			echo json_encode(['status' => false, 'message' => 'Error: ID de manifiesto no proporcionado.']);
			return;
		}

		try {
			// 🛑 LLAMADA AL MODELO 🛑
			$resultados = $this->_modelo->updateAnticipo(
				$manifiesto_id,
				$tarifa_anticipo,
				$fecha_anticipo,
				$documento_anticipo,
				$numdoc_conductor,
				$slct_metodo_pago,
				$slct_tarjeta_disponible,
				$slct_cuenta_bancaria
			);
			echo json_encode($resultados);
			return;
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['status' => false, 'message' => 'Error al actualizar anticipo: ' . $e->getMessage()]);
		}
	}

	public function UpdateSobreAnticipo()
	{
		header('Content-Type: application/json');
		$manifiesto_id = $_POST['manifiesto_id'] ?? null;

		// 🛑 CAPTURA DE DATOS ESPECÍFICOS DEL SOBRE ANTICIPO
		$valorFormateado = $_POST['anticipo'];
		$valorLimpio3 = str_replace(['$', ' ', ' '], '', $valorFormateado);

		// Paso 2: Reemplazar puntos de miles y cambiar coma decimal por punto
		$valorDecimal3 = str_replace('.', '', $valorLimpio3); // "1400000,00"
		$valorDecimal3 = str_replace(',', '.', $valorDecimal3); // "1400000.00"

		// Paso 3: Convertir a float o dejar como string para la base de datos
		$tarifa_anticipo = floatval($valorDecimal3); // 1400000.00



		$fecha_anticipo = $_POST['fecha_anticipo'] ?? null;
		$documento_anticipo = $_FILES['documento_soporte_sobre'] ?? null;
		$observacion = $_POST['observacion'] ?? 'Sobreanticipo sin obs.';

		// Datos de contexto y pago
		$numdoc_conductor = $_POST['numdoc_conductor'] ?? null;
		$slct_metodo_pago = $_POST['slct_metodo_pago'] ?? null;
		$slct_tarjeta_disponible = $_POST['slct_tarjeta_disponible'] ?? null;
		$slct_cuenta_bancaria = $_POST['slct_cuenta_bancaria'] ?? null;

		// Limpieza de valor
		// $sobreAnticipo = floatval(str_replace(['$', ' ', ',', '.'], '', $valorFormateado));

		if (empty($manifiesto_id) || $tarifa_anticipo <= 0 || empty($observacion)) {
			http_response_code(400);
			echo json_encode(['status' => false, 'message' => 'Datos incompletos o valor inválido para el Sobre Anticipo.']);
			return;
		}

		try {
			// 🛑 LLAMADA AL MODELO DE SOBRE ANTICIPO 🛑
			$resultados = $this->_modelo->updateSobreAnticipo(
				$manifiesto_id,
				$tarifa_anticipo,
				$fecha_anticipo,
				$documento_anticipo,
				$numdoc_conductor,
				$slct_metodo_pago,
				$slct_tarjeta_disponible,
				$slct_cuenta_bancaria,
				$observacion
			);
			echo json_encode($resultados);
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['status' => false, 'message' => 'Error al guardar Sobre Anticipo: ' . $e->getMessage()]);
		}
	}

	public function UpdateLiquidacion()
	{
		header('Content-Type: application/json');

		// 1. Recolección de datos
		$manifiesto_id = $_POST['manifiesto_id'] ?? null;
		$numdoc_tenedor = $_POST['numdoc_tenedor'] ?? null; // Tenedor/Proveedor
		$valorFormateado = $_POST['liquidacion'] ?? '0';
		$fecha_liquidacion = $_POST['fecha_liquidacion'] ?? null;
		$documento_liquidacion = $_FILES['documento_liquidacion'] ?? null;

		// 2. Datos de Pago
		$slct_metodo_pago = $_POST['slct_metodo_pago'] ?? null;
		$id_cuenta_destino = $_POST['id_cuenta_destino'] ?? null; // ID de cuenta o tarjeta
		$tipo_item = $_POST['tipo_item'] ?? 'LIQUIDACION';
		$observacion = $_POST['observacion'] ?? 'Pago de Liquidación';

		// 3. Datos de Nueva Cuenta (si aplica)
		$inscribir_nueva_cuenta = $_POST['inscribir_nueva_cuenta'] ?? false;
		$nuevaCuentaDatos = null;
		if ($inscribir_nueva_cuenta === 'true') {
			$nuevaCuentaDatos = [
				'numero_cuenta' => $_POST['nuevo_num_cuenta'] ?? null,
				'banco' => $_POST['nuevo_banco'] ?? null,
				'tipo_cuenta' => $_POST['nuevo_tipo_cuenta'] ?? null
			];
		}

		// 4. Limpieza de valor
		$valorLimpio = str_replace(['$', ' ', ' '], '', $valorFormateado);
		$valorDecimal = str_replace('.', '', $valorLimpio);
		$tarifa_liquidacion = (float)str_replace(',', '.', $valorDecimal);

		if (empty($manifiesto_id) || empty($numdoc_tenedor) || $tarifa_liquidacion <= 0) {
			http_response_code(400);
			echo json_encode(['status' => false, 'message' => 'Error: Datos de manifiesto, tenedor o valor inválidos.']);
			return;
		}

		try {
			// 5. 🛑 LLAMADA AL MODELO 🛑
			$resultados = $this->_modelo->UpdateLiquidacion(
				(int)$manifiesto_id,
				$tarifa_liquidacion,
				$fecha_liquidacion,
				$documento_liquidacion,
				$numdoc_tenedor,
				$slct_metodo_pago,
				$id_cuenta_destino,
				$tipo_item,
				$observacion,
				$nuevaCuentaDatos // Enviamos el array de la nueva cuenta
			);
			echo json_encode($resultados);
			return;
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['status' => false, 'message' => 'Error al actualizar liquidación: ' . $e->getMessage()]);
		}
	}

	public function getDetalleManifiesto()
	{
		if ($_SERVER['REQUEST_METHOD'] === 'POST' && strpos($_SERVER['REQUEST_URI'], 'getDetalleManifiesto') !== false) {

			try {
				$manifiesto_id = filter_input(INPUT_POST, 'manifiesto_id', FILTER_VALIDATE_INT);

				if (!$manifiesto_id || $manifiesto_id <= 0) {
					echo json_encode(['error', 'ID de manifiesto inválido.', [], 400]);
					return;
				}

				// $novedad_model = new Novedad();
				$detalle =  $this->_modelo->getDetalleManifiesto($manifiesto_id);

				if ($detalle) {
					echo json_encode([$detalle]);
				} else {
					echo json_encode(['error', "No se encontraron detalles para el manifiesto ID $manifiesto_id.", [], 404]);
				}
			} catch (Exception $e) {
				error_log("Error al obtener detalle de manifiesto: " . $e->getMessage());
				echo json_encode(['error', 'Error en el servidor al cargar detalles.', ['detalle' => $e->getMessage()], 500]);
			}
			exit; // Terminar la ejecución después de responder al fetch
		}
	}

	public function obtenerListaGeneralRemesas()
	{
		header('Content-Type: application/json');

		if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
			// O GET, dependiendo de cómo llames tu función JS
			http_response_code(405);
			echo json_encode(['status' => false, 'message' => 'Método no permitido.']);
			return;
		}

		try {
			// Llamar al Modelo
			$resultado = $this->_modelo->getRemesasPorClientes();

			echo json_encode(['status' => true, 'data' => $resultado]);
		} catch (Exception $e) {
			http_response_code(500);
			echo json_encode(['status' => false, 'message' => 'Error interno: ' . $e->getMessage()]);
		}
	}

	/**
	 * Maneja la solicitud AJAX para obtener el detalle de remesas de un cliente.
	 */
	public function obtenerDetalleRemesas()
	{

		$nitTitular = $_POST['nit_titular'] ?? null;

		// El cliente ya fue validado al hacer clic en la tabla general
		if (empty($nitTitular)) {
			$respuesta = ['status' => false, 'message' => 'El documento de cliente no fue proporcionado.'];
			header('Content-Type: application/json');
			echo json_encode($respuesta);
			exit;
		}

		try {
			// 🛑 Llama al método del modelo
			$data = $this->_modelo->obtenerDetalleRemesas($nitTitular);

			if ($data) {
				// Aquí deberías obtener la información de tenedor, conductor, etc.
				// Usaré los datos de la primera remesa como ejemplo
				$firstRow = $data[0];

				$respuesta = [
					'status' => true,
					'message' => 'Detalle de remesas cargado con éxito.',
					'nit' => $nitTitular,
					'data' => $data,
					// 🛑 Datos adicionales para el header (Ej: se obtienen del primer manifiesto)
					'placa' => $firstRow['placa'] ?? 'N/A',
					'conductor' => $firstRow['conductor_manifiesto'] ?? 'N/A',
					'tenedor' => $firstRow['Nudoc_Tenedor'] ?? 'N/A',
					// NOTA: La dirección, celular y municipio deben obtenerse del cliente 
					// o del conductor/tenedor con otra consulta si no están en $data.
				];
			} else {
				$respuesta = ['status' => false, 'message' => 'No se encontraron remesas/manifiestos asociados a este cliente en el rango de búsqueda.'];
			}
		} catch (Exception $e) {
			error_log("Error en Controlador::obtenerDetalleRemesas: " . $e->getMessage());
			$respuesta = ['status' => false, 'message' => 'Error interno al consultar detalle.'];
		}

		header('Content-Type: application/json');
		echo json_encode($respuesta);
		exit;
	}

	public function crearTarjeta()
	{
		// 1. Recolección y saneamiento de datos (POST)
		$datos = [
			'numero_tarjeta' => $_POST['numero_tarjeta'] ?? null,
			'id_banco'       => $_POST['id_banco'] ?? null,
			'tipo_cuenta'    => $_POST['tipo_cuenta'] ?? null,
		];

		if (empty($datos['numero_tarjeta']) || empty($datos['id_banco'])) {
			$respuesta = ['status' => false, 'mensaje' => 'Datos incompletos.'];
		} else {
			// 2. 🛑 LLAMADA AL MODELO 🛑
			$respuesta = $this->_modelo->crearTarjeta($datos);
		}

		header('Content-Type: application/json');
		echo json_encode($respuesta);
		exit;
	}

	/**
	 * Devuelve la lista de todas las tarjetas registradas.
	 */
	public function listarTodasTarjetas()
	{
		// 🛑 LLAMADA AL MODELO 🛑
		$data = $this->_modelo->listarTodasTarjetas();

		header('Content-Type: application/json');
		echo json_encode(['status' => true, 'data' => $data]);
		exit;
	}

	/**
	 * Cambia el estado de una tarjeta por ID.
	 */
	public function gestionarEstadoTarjeta()
	{
		$tarjetaId = $_POST['tarjeta_id'] ?? null;
		$estado = $_POST['estado'] ?? null;

		if (empty($tarjetaId) || empty($estado)) {
			$respuesta = ['status' => false, 'mensaje' => 'ID de tarjeta o estado faltante.'];
		} else {
			// 🛑 LLAMADA AL MODELO 🛑
			$respuesta = $this->_modelo->cambiarEstadoTarjeta((int)$tarjetaId, $estado);
		}

		header('Content-Type: application/json');
		echo json_encode($respuesta);
		exit;
	}

	/**
	 * Devuelve la lista de conductores activos en formato JSON.
	 */
	public function listarConductores()
	{
		// 🛑 LLAMADA AL MODELO 🛑
		$data = $this->_modelo->listarConductoresActivos();

		header('Content-Type: application/json');
		echo json_encode($data);
		exit;
	}

	/**
	 * Devuelve la lista de tarjetas disponibles en formato JSON.
	 */
	public function listarTarjetas()
	{
		// 🛑 LLAMADA AL MODELO 🛑
		$data = $this->_modelo->listarTarjetasDisponibles();

		header('Content-Type: application/json');
		echo json_encode($data);
		exit;
	}

	/**
	 * Obtiene y devuelve el historial de tarjetas de un conductor.
	 * Usado por la función JS 'cargarHistorial(conductorId)'.
	 * La URL se llamaría como: .../tarjetas/obtenerHistorial/12345
	 */
	public function obtenerHistorial($conductorId)
	{
		if (empty($conductorId)) {
			$data = [];
		} else {
			// 🛑 LLAMADA AL MODELO 🛑
			$data = $this->_modelo->obtenerHistorial((int)$conductorId);
		}

		header('Content-Type: application/json');
		echo json_encode($data);
		exit;
	}

	/**
	 * Asigna una tarjeta a un conductor y finaliza la vigencia anterior (transacción).
	 */
	public function asignarTarjeta()
	{
		$conductorId = $_POST['conductor_id'] ?? null;
		$tarjetaId = $_POST['tarjeta_id'] ?? null;

		if (empty($conductorId) || empty($tarjetaId)) {
			$respuesta = ['status' => false, 'mensaje' => 'IDs de conductor o tarjeta faltantes.'];
		} else {
			// 🛑 LLAMADA AL MODELO 🛑
			$respuesta = $this->_modelo->asignarTarjeta((int)$conductorId, (int)$tarjetaId);
		}

		header('Content-Type: application/json');
		echo json_encode($respuesta);
		exit;
	}

	/**
	 * Retira una tarjeta de un conductor.
	 */
	public function retirarTarjeta()
	{
		$asignacionId = $_POST['asignacion_id'] ?? null;

		if (empty($asignacionId)) {
			$respuesta = ['status' => false, 'mensaje' => 'ID de asignación faltante.'];
		} else {
			// 🛑 LLAMADA AL MODELO 🛑
			$respuesta = $this->_modelo->retirarTarjeta((int)$asignacionId);
		}

		header('Content-Type: application/json');
		echo json_encode($respuesta);
		exit;
	}

	/**
	 * Maneja la actualización del documento EPS creando un registro histórico.
	 */
	public function actualizarSeguridadSocial()
	{

		// 1. Recolección de datos
		$idProveedor = $_POST['id_proveedor'] ?? null;
		$seguridadFile = $_FILES['seguridad_file'] ?? null;

		if (empty($idProveedor)) {
			http_response_code(400);
			$respuesta = ['status' => false, 'message' => 'ID de proveedor no especificado.'];
		} else {
			// 2. 🛑 LLAMADA AL MODELO 🛑
			$respuesta = $this->_modelo->actualizarSeguridadSocial((int)$idProveedor, $seguridadFile);
		}

		header('Content-Type: application/json');
		echo json_encode($respuesta);
		exit;
	}

	public function actualizarCertificadoCuenta()
	{

		// 1. Recolección de datos
		$idProveedor = $_POST['id_proveedor'] ?? null;
		$seguridadFile = $_FILES['certificado_file'] ?? null;

		if (empty($idProveedor)) {
			http_response_code(400);
			$respuesta = ['status' => false, 'message' => 'ID de proveedor no especificado.'];
		} else {
			// 2. 🛑 LLAMADA AL MODELO 🛑
			$respuesta = $this->_modelo->actualizarCertificadoCuenta((int)$idProveedor, $seguridadFile);
		}

		header('Content-Type: application/json');
		echo json_encode($respuesta);
		exit;
	}

	public function procesarPagoMasivo()
	{

		// 🛑 1. Recibir ID del Cliente como entero simple (NO DECODIFICAR ESTE CAMPO)
		// Asumimos que el ID del cliente viene en el POST como 'id_cliente'
		$idCliente = filter_input(INPUT_POST, 'id_cliente', FILTER_VALIDATE_INT);

		// 2. Recibir y decodificar los arrays
		$remesasJson = $_POST['remesas_ids'] ?? '[]';
		$manifiestosJson = $_POST['manifiestos_ids'] ?? '[]';
		$remesasValoresJson = $_POST['remesas_valores'] ?? '[]'; // 🛑 Nuevo: Valores individuales
		$total = $_POST['total_pagado'] ?? 0;

		// Decodificar JSON a arrays de PHP.
		$remesasIds = json_decode($remesasJson, true);
		$manifiestosIds = json_decode($manifiestosJson, true);
		$remesasValores = json_decode($remesasValoresJson, true); // 🛑 Decodificar valores individuales

		// 3. Limpiar y sanitizar el total
		$totalLimpio = (float)str_replace(['$', ',', '.'], '', $total);

		if (empty($idCliente) || !is_array($remesasIds)) {
			$respuesta = ['status' => false, 'message' => 'Error: ID de cliente faltante o datos de remesas inválidos.'];
		} else {
			// 4. LLAMADA AL MODELO (Aseguramos que el idCliente sea INT)
			// La función del Modelo espera: int, array, array, array, float
			$respuesta = $this->_modelo->procesarPagoMasivo(
				$idCliente,
				$remesasIds,
				$manifiestosIds,
				$remesasValores,
				$totalLimpio
			);
		}

		header('Content-Type: application/json');
		echo json_encode($respuesta);
		exit;
	}

	/**
	 * Devuelve el historial de movimientos de cartera de un cliente por ID.
	 */
	public function obtenerHistoricoMovimientos()
	{
		// La placa del botón de detalle de remesas tiene el ID del cliente
		$idCliente = filter_input(INPUT_POST, 'id_cliente', FILTER_VALIDATE_INT);

		if (empty($idCliente)) {
			header('Content-Type: application/json');
			echo json_encode(['status' => false, 'message' => 'ID de cliente no proporcionado.']);
			exit;
		}

		// 🛑 LLAMADA AL MODELO 🛑
		$data = $this->_modelo->obtenerHistoricoMovimientos($idCliente);

		header('Content-Type: application/json');
		echo json_encode(['status' => true, 'data' => $data]);
		exit;
	}

	/**
	 * Devuelve la lista de tarjetas actualmente vigentes y asignadas a un conductor.
	 */
	public function listarTarjetasAsignadas()
	{
		// 🛑 Obtener el ID del proveedor/conductor del POST
		$idProveedor = filter_input(INPUT_POST, 'id_proveedor', FILTER_VALIDATE_INT);

		if (empty($idProveedor)) {
			header('Content-Type: application/json');
			echo json_encode(['status' => false, 'data' => [], 'message' => 'ID de proveedor faltante.']);
			exit;
		}

		// 🛑 LLAMADA AL MODELO 🛑
		$data = $this->_modelo->listarTarjetasAsignadasVigentes($idProveedor);

		header('Content-Type: application/json');
		echo json_encode(['status' => true, 'data' => $data]);
		exit;
	}

	/**
	 * Devuelve la lista de cuentas bancarias vigentes y bancos disponibles para el anticipo.
	 */
	public function listarCuentasYBancosParaAnticipo()
	{
		// El ID se envía en el POST desde el JS (Numdoc_Conductor)
		$idProveedor = filter_input(INPUT_POST, 'id_proveedor', FILTER_VALIDATE_INT);

		if (empty($idProveedor)) {
			header('Content-Type: application/json');
			echo json_encode(['status' => false, 'data' => [], 'message' => 'ID de proveedor faltante.']);
			exit;
		}

		// 🛑 LLAMADA AL MODELO 🛑
		$data = $this->_modelo->listarCuentasYBancos($idProveedor);

		header('Content-Type: application/json');
		echo json_encode(['status' => true, 'data' => $data]);
		exit;
	}

	/**
	 * Endpoint para devolver la lista de manifiestos en seguimiento y su estado documental.
	 */
	public function listarDocumentosSeguimiento()
	{
		try {
			// 🛑 LLAMADA AL MODELO 🛑
			$data = $this->_modelo->obtenerDocumentosPendientesSeguimiento();

			header('Content-Type: application/json');
			echo json_encode(['status' => true, 'data' => $data]);
		} catch (Exception $e) {
			header('Content-Type: application/json');
			http_response_code(500);
			echo json_encode(['status' => false, 'message' => 'Error al obtener reporte.']);
		}
	}

	public function GetFacturacionDs()
	{
		try {
			// 🛑 LLAMADA AL MODELO 🛑
			$data = $this->_modelo->GetFacturacionDs();

			header('Content-Type: application/json');
			echo json_encode(['status' => true, 'data' => $data]);
		} catch (Exception $e) {
			header('Content-Type: application/json');
			http_response_code(500);
			echo json_encode(['status' => false, 'message' => 'Error al obtener reporte.']);
		}
	}

	// public function GetDetalleFactura()
	// {
	// 	$factura_id = $_POST['factura_id'] ?? null;

	// 	if (empty($factura_id)) {
	// 		http_response_code(400);
	// 		$respuesta = ['status' => false, 'message' => 'ID de factura no especificado.'];
	// 	} else {
	// 		// 2. 🛑 LLAMADA AL MODELO 🛑
	// 		$respuesta = $this->_modelo->DetalleFactura((int)$factura_id);
	// 	}

	// 	header('Content-Type: application/json');
	// 	echo json_encode($respuesta);
	// }

	public function getDetalleFactura()
	{
		$factura_id = $_POST['factura_id'] ?? null;

		if (!$factura_id) {
			echo json_encode([
				'success' => false,
				'message' => 'ID de factura no recibido'
			]);
			return;
		}

		// $model = new FacturaModel($this->_db3);

		$cabecera = $this->_modelo->getCabeceraFactura($factura_id);
		$detalle  = $this->_modelo->getDetalleFactura($factura_id);

		// Totales
		// $subtotal = array_sum(array_column($detalle, 'valor'));
		$subtotal = array_sum(array_column($detalle, 'valor_unitario'));

		echo json_encode([
			'success' => true,
			'factura' => $cabecera,
			'detalle' => $detalle,
			'totales' => [
				'subtotal'  => $subtotal,
				'retencion' => 0,
				'ica'       => 0,
				'iva'       => 0,
				'reteiva'   => 0,
				'total'     => $subtotal
			],
			'observaciones' => 'Factura generada automáticamente por el sistema'
		]);
	}
}
