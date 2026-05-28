<?php

class usuariosController extends Controller
{

	private $_modelo;
	private $_Listado_clientes;

	public function __construct()
	{
		parent::__construct();
		$this->_modelo = $this->loadModel('usuarios');
	}

	public function index()
	{
		$usuario = $this->loadModel('usuarios');
		$this->_view->usuario = $usuario;
		$this->_view->titulo = 'Administración de Usuarios';
		$this->_view->renderizar('index', 'usuarios');
	}

	public function permisos()
	{
		$this->_view->titulo = 'Permisos de usuarios';
		$this->_view->renderizar('permisos', 'usuarios');
	}

	public function perfiles()
	{
		$usuario = $this->loadModel('usuarios');
		$this->_view->usuario = $usuario;
		$this->_view->titulo = 'Perfiles de usuarios';
		$this->_view->renderizar('perfiles', 'usuarios');
	}

	public function listar()
	{
		// Recibir parámetros del POST
		$name       = $_POST["name"] ?? "";
		$id         = $_POST["id"] ?? "";
		$id_cliente = $_POST["id_cliente"] ?? 0;
		$id_perfil  = $_POST["id_perfil"] ?? "";
		$id_usuario = $_POST["id_usuario"] ?? 0;

		// Llamar al modelo
		$usuario = $this->loadModel('usuarios');
		$resultado = $usuario->getHtmlSelectUsuarioPerfil_sm(
			$name,
			$id,
			$id_cliente,
			$id_perfil,
			$id_usuario
		);

		// Devolver el HTML directamente
		header('Content-Type: text/html; charset=utf-8');
		echo $resultado;
		exit;
	}

	/**
	 * Devuelve el HTML de un select con usuarios filtrados por perfil.
	 */
	public function getHtmlSelectUsuarioPerfil_sm()
	{
		// 🚨 No usamos header JSON porque devolvemos HTML/texto plano.
		// header('Content-Type: text/html'); 

		// 1. Capturar y sanear los datos de $_POST
		$name = $_POST['name'] ?? '';
		$id = $_POST['id'] ?? '';
		$idCliente = (int) ($_POST['id_cliente'] ?? 0);
		$idPerfiles = $_POST['id_perfil'] ?? '';
		$idUsuario = $_POST['id_usuario'] ?? '';

		if (empty($idPerfiles)) {
			echo "<select id='{$id}'><option value=''>Error: No se especificaron perfiles</option></select>";
			return;
		}

		try {
			// 2. Llamar al Modelo para obtener el HTML
			$htmlSelect = $this->_modelo->getHtmlSelectUsuarioPerfil_sm(
				$name,
				$id,
				$idCliente,
				$idPerfiles,
				$idUsuario
			);

			// 3. Devolver el HTML generado
			echo $htmlSelect;
		} catch (Exception $e) {
			http_response_code(500);
			echo "<select id='{$id}'><option value=''>Error interno al cargar</option></select>";
			// Aquí deberías loguear $e->getMessage()
		}
	}
}
