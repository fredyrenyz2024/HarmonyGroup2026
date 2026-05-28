<?php
/* controlador principal del framework, de aquí se extienden lo smétodos usados por los controladores    */
abstract class Controller
{

	protected $_view;
	// protected $_modelo;

	public function __construct()
	{
		$this->_view = new View(new Request);
		// $this->_modelo = $this->loadModel('web_service');
	}

	abstract public function index();


	protected function loadModel($modelo)
	{
		$modelo = $modelo . 'Model';
		$rutaModelo = ROOT . 'models' . DS . $modelo . '.php';

		if (is_readable($rutaModelo)) {
			require_once($rutaModelo);
			$modelo = new $modelo;
			return $modelo;
		} else {
			throw new Exception("Error de modelo: El archivo " . $rutaModelo . " no es leible o no se encuentra en el servidor");
		}
	}

	protected function getLibrary($libreria)
	{

		$rutaLibreria = ROOT . "libs" . DS . "xcrud" . DS . $libreria . ".php";

		if (is_readable($rutaLibreria)) {
			require_once($rutaLibreria);
		} else {
			throw new Exception("Error de libreria: El archivo " . $rutaLibreria . " no es leible o no se encuentra en el servidor");
		}
	}

	// protected function rndc_conexion($Request)
	// {
	// 	$remesa_web = new SoapClient(MINTRANS_URL, ['trace' => true]);
	// 	$result = $remesa_web->AtenderMensajeRNDC($Request);
	// 	return $result;
	// }

	// protected function rndc_conexion($Request)
	// {
	// 	// Función interna para verificar la conexión a una URL
	// 	$checkConnection = function ($url) {
	// 		$parsed_url = parse_url($url);
	// 		$host = $parsed_url['host'];
	// 		$port = isset($parsed_url['port']) ? $parsed_url['port'] : 80;

	// 		// Verificar conexión con fsockopen
	// 		$connection = @fsockopen($host, $port, $errno, $errstr, 5); // Timeout de 5 segundos
	// 		if ($connection) {
	// 			fclose($connection);
	// 			return true;
	// 		}
	// 		return false;
	// 	};

	// 	try {
	// 		// Intentar conexión con la primera URL
	// 		if ($checkConnection(MINTRANS_URL)) {
	// 			$remesa_web = new SoapClient(MINTRANS_URL, ['trace' => true]);
	// 		} elseif ($checkConnection(MINTRANS_URL_2)) {
	// 			// Si la primera falla, intentar con la segunda URL
	// 			$remesa_web = new SoapClient(MINTRANS_URL_2, ['trace' => true]);
	// 		} else {
	// 			// Si ambas fallan, lanzar una excepción
	// 			throw new Exception("No se pudo conectar a ninguna URL: " . MINTRANS_URL . " o " . MINTRANS_URL_2);
	// 		}

	// 		// Enviar la solicitud SOAP
	// 		$result = $remesa_web->AtenderMensajeRNDC($Request);
	// 		return $result;
	// 	} catch (SoapFault $e) {
	// 		// Manejar errores de SoapClient
	// 		echo "Error en la solicitud SOAP: " . $e->getMessage();
	// 		return null;
	// 	} catch (Exception $e) {
	// 		// Manejar errores generales
	// 		echo "Error: " . $e->getMessage();
	// 		return null;
	// 	}
	// }


	// protected function rndc_conexion($Request)
	// {
	// 	$urls = [MINTRANS_URL, MINTRANS_URL_2];
	// 	$maxIntentos = 3; // número de reintentos por cada URL
	// 	$espera = 2; // segundos entre intentos

	// 	foreach ($urls as $url) {
	// 		for ($intento = 1; $intento <= $maxIntentos; $intento++) {
	// 			try {
	// 				$client = new \SoapClient($url, [
	// 					'trace' => true,
	// 					'exceptions' => true,
	// 					'connection_timeout' => 10, // segundos
	// 				]);

	// 				$result = $client->AtenderMensajeRNDC($Request);

	// 				// Si llegó aquí, la conexión fue exitosa
	// 				return $result;
	// 			} catch (\SoapFault $e) {
	// 				error_log("SOAP Error con {$url} (intento {$intento}/{$maxIntentos}): " . $e->getMessage());
	// 			} catch (\Exception $e) {
	// 				error_log("Error general con {$url} (intento {$intento}/{$maxIntentos}): " . $e->getMessage());
	// 			}

	// 			// Esperar antes del próximo intento
	// 			if ($intento < $maxIntentos) {
	// 				sleep($espera);
	// 			}
	// 		}

	// 		// Si se agotaron todos los intentos para esta URL
	// 		error_log("Se agotaron los intentos para la URL: {$url}");
	// 	}

	// 	// Si ninguna URL funcionó
	// 	error_log("No se pudo conectar a ninguna de las URLs de RNDC después de {$maxIntentos} intentos.");
	// 	return null;
	// }

	// protected function rndc_conexion($Request, $documento = null, $accion = 'Envio')
	// {
	// 	$urls = [MINTRANS_URL, MINTRANS_URL_2];
	// 	$maxIntentos = 3; // número de reintentos por cada URL
	// 	$espera = 2; // segundos entre intentos

	// 	$resultado = null;

	// 	foreach ($urls as $url) {
	// 		for ($intento = 1; $intento <= $maxIntentos; $intento++) {
	// 			try {
	// 				$client = new \SoapClient($url, [
	// 					'trace' => true,
	// 					'exceptions' => true,
	// 					'connection_timeout' => 10, // segundos
	// 				]);

	// 				$resultado = $client->AtenderMensajeRNDC($Request);

	// 				// ✅ Registrar éxito en tu tabla
	// 				$this->_modelo->Transaccion_Nexos_Min(
	// 					$documento,
	// 					$Request,                  // XML enviado
	// 					"Conexión exitosa a {$url}", // Respuesta
	// 					1,                        // estado_envio_rndc = OK
	// 					$accion
	// 				);

	// 				return $resultado; // éxito -> devolvemos resultado

	// 			} catch (\SoapFault $e) {
	// 				$mensaje = "SOAP Error con {$url} (intento {$intento}/{$maxIntentos}): " . $e->getMessage();
	// 				error_log($mensaje);

	// 				// ❌ Registrar fallo
	// 				$this->_modelo->Transaccion_Nexos_Min(
	// 					$documento,
	// 					$Request,
	// 					$mensaje,
	// 					0, // estado_envio_rndc = ERROR
	// 					$accion
	// 				);
	// 			} catch (\Exception $e) {
	// 				$mensaje = "Error general con {$url} (intento {$intento}/{$maxIntentos}): " . $e->getMessage();
	// 				error_log($mensaje);

	// 				// ❌ Registrar fallo
	// 				$this->_modelo->Transaccion_Nexos_Min(
	// 					$documento,
	// 					$Request,
	// 					$mensaje,
	// 					0,
	// 					$accion
	// 				);
	// 			}

	// 			// Esperar antes del próximo intento
	// 			if ($intento < $maxIntentos) {
	// 				sleep($espera);
	// 			}
	// 		}

	// 		// Si se agotaron todos los intentos para esta URL
	// 		$this->_modelo->Transaccion_Nexos_Min(
	// 			$documento,
	// 			$Request,
	// 			"Se agotaron los intentos para la URL: {$url}",
	// 			0,
	// 			$accion
	// 		);
	// 	}

	// 	// Si ninguna URL funcionó
	// 	$this->_modelo->Transaccion_Nexos_Min(
	// 		$documento,
	// 		$Request,
	// 		"No se pudo conectar a ninguna de las URLs de RNDC después de {$maxIntentos} intentos.",
	// 		0,
	// 		$accion
	// 	);

	// 	return null;
	// }

	// protected function rndc_conexion_principal($Request)
	// {
	// 	$remesa_web = new SoapClient(MINTRANS_URL_PRINCIPAL, ['trace' => true]);
	// 	$result = $remesa_web->AtenderMensajeRNDC($Request);
	// 	return $result;
	// }

	protected function rndc_conexion($Request)
	{
		$urls = [MINTRANS_URL, MINTRANS_URL_2];
		$maxIntentos = 3;
		$baseEspera = 1; // base para backoff exponencial

		foreach ($urls as $url) {
			for ($intento = 1; $intento <= $maxIntentos; $intento++) {
				$client = null;

				try {
					// Configuración robusta del cliente SOAP
					$context = stream_context_create([
						'http' => [
							'timeout' => 15, // timeout total de la petición (incluye respuesta)
						],
						'ssl' => [
							'verify_peer' => true,
							'verify_peer_name' => true,
							'allow_self_signed' => false,
						]
					]);

					$client = new \SoapClient($url, [
						'trace' => true,
						'exceptions' => true,
						'connection_timeout' => 10, // timeout de conexión inicial
						'stream_context' => $context,
						'cache_wsdl' => WSDL_CACHE_NONE, // evitar caché corrupta en desarrollo
					]);

					$result = $client->AtenderMensajeRNDC($Request);

					// Verificar que el resultado sea válido (no solo que no falle)
					if ($this->esRespuestaValida($result)) {
						return $result;
					} else {
						throw new \Exception("Respuesta SOAP inválida o con errores internos.");
					}
				} catch (\SoapFault $e) {
					$codigo = $e->getCode();
					$mensaje = $e->getMessage();
					$this->logError("SOAP Fault", $url, $intento, $maxIntentos, $mensaje, $codigo);

					// Si es un error crítico (ej: autenticación, WSDL), no reintentar
					if ($this->esErrorCritico($e)) {
						break; // salir del bucle de reintentos para esta URL
					}
				} catch (\Exception $e) {
					$this->logError("Error General", $url, $intento, $maxIntentos, $e->getMessage(), $e->getCode());
				} finally {
					// Liberar recursos del cliente SOAP
					if ($client) {
						unset($client);
					}
				}

				// Espera exponencial entre reintentos: 1s, 2s, 4s...
				if ($intento < $maxIntentos) {
					$espera = $baseEspera * pow(2, $intento - 1);
					sleep($espera);
				}
			}

			error_log("[" . date('Y-m-d H:i:s') . "] RNDC: Se agotaron todos los intentos para URL: {$url}");
		}

		error_log("[" . date('Y-m-d H:i:s') . "] RNDC: FALLA TOTAL - No se pudo conectar a ninguna URL después de {$maxIntentos} intentos por URL.");
		return null;
	}

	/**
	 * Valida si la respuesta SOAP es realmente útil (no contiene errores internos del servicio)
	 */
	private function esRespuestaValida($result)
	{
		if (!$result) {
			return false;
		}

		// Ajusta esta lógica según la estructura real de la respuesta del RNDC
		// Ejemplo: si el servicio devuelve un campo "CodigoError" o "Estado"
		if (is_object($result) && isset($result->CodigoError) && $result->CodigoError != '0') {
			return false;
		}

		if (is_object($result) && isset($result->Estado) && in_array($result->Estado, ['ERROR', 'FALLIDO'])) {
			return false;
		}

		return true;
	}

	/**
	 * Determina si un SoapFault es crítico (no se debe reintentar)
	 */
	private function esErrorCritico(\SoapFault $e)
	{
		$mensaje = strtolower($e->getMessage());
		$codigo = $e->getCode();

		// Errores que no tienen sentido reintentar
		$erroresCriticos = [
			'wsdl',
			'authentication',
			'authorization',
			'forbidden',
			'not found',
			'invalid',
			'soap-1.1',
			'soap-1.2',
			'namespace',
			'element',
			'unexpected'
		];

		foreach ($erroresCriticos as $error) {
			if (strpos($mensaje, $error) !== false) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Log estandarizado con más contexto
	 */
	private function logError($tipo, $url, $intento, $maxIntentos, $mensaje, $codigo = null)
	{
		$timestamp = date('Y-m-d H:i:s');
		$codigoStr = $codigo ? " (Código: {$codigo})" : '';
		error_log("[{$timestamp}] RNDC {$tipo} - URL: {$url} (Intento {$intento}/{$maxIntentos}){$codigoStr}: {$mensaje}");
	}
}
