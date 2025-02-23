<?php
/* controlador principal del framework, de aquí se extienden lo smétodos usados por los controladores    */
abstract class Controller
{

	protected $_view;

	public function __construct()
	{
		$this->_view = new View(new Request);
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

	protected function rndc_conexion($Request)
	{
		// Función interna para verificar la conexión a una URL
		$checkConnection = function ($url) {
			$parsed_url = parse_url($url);
			$host = $parsed_url['host'];
			$port = isset($parsed_url['port']) ? $parsed_url['port'] : 80;

			// Verificar conexión con fsockopen
			$connection = @fsockopen($host, $port, $errno, $errstr, 5); // Timeout de 5 segundos
			if ($connection) {
				fclose($connection);
				return true;
			}
			return false;
		};

		try {
			// Intentar conexión con la primera URL
			if ($checkConnection(MINTRANS_URL)) {
				$remesa_web = new SoapClient(MINTRANS_URL, ['trace' => true]);
			} elseif ($checkConnection(MINTRANS_URL_2)) {
				// Si la primera falla, intentar con la segunda URL
				$remesa_web = new SoapClient(MINTRANS_URL_2, ['trace' => true]);
			} else {
				// Si ambas fallan, lanzar una excepción
				throw new Exception("No se pudo conectar a ninguna URL: " . MINTRANS_URL . " o " . MINTRANS_URL_2);
			}

			// Enviar la solicitud SOAP
			$result = $remesa_web->AtenderMensajeRNDC($Request);
			return $result;
		} catch (SoapFault $e) {
			// Manejar errores de SoapClient
			echo "Error en la solicitud SOAP: " . $e->getMessage();
			return null;
		} catch (Exception $e) {
			// Manejar errores generales
			echo "Error: " . $e->getMessage();
			return null;
		}
	}

	// protected function rndc_conexion_principal($Request)
	// {
	// 	$remesa_web = new SoapClient(MINTRANS_URL_PRINCIPAL, ['trace' => true]);
	// 	$result = $remesa_web->AtenderMensajeRNDC($Request);
	// 	return $result;
	// }
}
