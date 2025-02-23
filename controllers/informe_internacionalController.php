<?php

class informe_internacionalController extends Controller
{
	private $_modelo;
	private $_informe_ventas;
	private $_informe_costos;

	public function __construct()
	{
		parent::__construct();
		//$this->$_modelo=$this->loadModel('transporte'); 
		$this->_modelo = $this->loadModel('Informeinternacional');
	}

	public function index()
	{
		$prueba = $this->loadModel('Informeinternacional');
		$this->_view->prueba = $prueba;
		$this->_view->titulo = 'Informe General';
		$this->_view->renderizar('informe_general', 'internacional');
	}

	public function informe_sobrecosto()
	{
		$prueba2 = $this->loadModel('Informeinternacional');
		$this->_view->adicional = $prueba2;
		$this->_view->titulo = 'Sobrecosto';
		$this->_view->renderizar('informe_sobrecosto', 'internacional');
	}


	public function informe_ventas()
	{
		$informe = $this->loadModel('Informeinternacional');
		$this->_view->informe = $informe;
		$this->_view->titulo = 'Informe de Ventas';
		$this->_view->renderizar('informe_ventas', 'internacional');
	}

	public function informe_costos()
	{
		$informe = $this->loadModel('Informeinternacional');
		$this->_view->informe = $informe;
		$this->_view->titulo = 'Informe de Costos';
		$this->_view->renderizar('informe_costos', 'internacional');
	}

	//CONSULTAS PARA INTERNACIONAL
	public function Consulta_informe()
	{
		$filtro = $_POST["filtro"];
		$nota = $_POST["dato"];
		$fec2 = $_POST["datob"];
		$dato3 = $_POST["datoc"];
		$filtop1 = $_POST["filtop"];
		$this->doc = $this->_modelo->GeneralInternacional($filtro, $nota, $fec2, $dato3, $filtop1);
		echo json_encode($this->doc);
	}
	//CONSULTA PARA SOBRECOSTOS
	public function Consulta_sobrecosto()
	{
		$inicia = $_POST["inicia"];
		$fin = $_POST["fin"];
		//$this->_modelo2 = $this->loadModel('Informeinternacional');
		$this->docu = $this->_modelo->GeneralSobrecosto($inicia, $fin);
		echo json_encode($this->docu);
	}

	public function ConsultaCliente()
	{
		$this->dato = $this->_modelo->ConsultarCliente();
		echo json_encode($this->dato);
	}

	public function Informe_Venta()
	{
		$fecha_incial = $_POST["fecha_inicial"];
		$fecha_final = $_POST["fecha_final"];
		$datos = [
			'fecha_inicial' => $fecha_incial,
			'fecha_final' => $fecha_final,
		];
		$this->_informe_ventas = $this->_modelo->Informe_de_ventas($datos);
		echo json_encode($this->_informe_ventas);
	}

	public function Informe_Costo()
	{
		$fecha_incial = $_POST["fecha_inicial"];
		$fecha_final = $_POST["fecha_final"];
		$datos = [
			'fecha_inicial' => $fecha_incial,
			'fecha_final' => $fecha_final,
		];
		$this->_informe_costos = $this->_modelo->Informe_de_costos($datos);
		echo json_encode($this->_informe_costos);
	}
}
