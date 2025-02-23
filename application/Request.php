<?php
/* Recibe y procesa la petición */
class Request
{
	private string $controlador;
	private string $metodo;
	private array $argumentos;

	public function __construct()
	{
		$this->controlador = DEFAULT_CONTROLLER ?? 'default';
		$this->metodo = 'index';
		$this->argumentos = [];

		if (isset($_GET['url'])) {
			// Filtrar el parámetro que viene del acceso
			$url = filter_input(INPUT_GET, 'url', FILTER_SANITIZE_URL);
			$url = explode("/", $url); // Divide la URL cada vez que encuentra un slash
			$url = array_filter($url); // Elimina elementos no válidos del array

			// Extraer el controlador, método y argumentos
			$this->controlador = strtolower(array_shift($url) ?? DEFAULT_CONTROLLER);
			$this->metodo = strtolower(array_shift($url) ?? 'index');
			$this->argumentos = $url ?: [];
		}
	}

	public function getControlador(): string
	{
		return $this->controlador;
	}

	public function getMetodo(): string
	{
		return $this->metodo;
	}

	public function getArgs(): array
	{
		return $this->argumentos;
	}
}