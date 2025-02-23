<?php
	
	class servicios_especialesController extends Controller{

		public function __construct(){
			parent::__construct();
			$this->_modelo = $this->loadModel('servicio_especial');
		}

		public function index(){
			$servicios_especiales = $this->loadModel('servicios_especiales');

			$this->_view->servicios_especiales = $servicios_especiales;
			$this->_view->titulo = 'Servicios Especiales';
			$this->_view->renderizar('index', 'servicios_especiales');
		}
		
		public function proveedorServicios(){
			$servicios_especiales = $this->loadModel('servicios_especiales');

			$this->_view->servicios_especiales = $servicios_especiales;
			$this->_view->titulo = 'Servicios Especiales';
			$this->_view->renderizar('index', 'servicios_especiales');
		}



		//FORMATO NUEVO
		public function crear_servicio(){
			$servicio = $this->loadModel('servicio_especial');
			$this->_view->servicios_especiales = $servicios_especiales;
			$this->_view->titulo = 'Servicios Especiales';
			$this->_view->renderizar('crear_servicio', 'servicios_especiales');
		}

		public function ConsultaTabla(){
			$tipo_doc=$_POST["tipo_doc"];
			$numdoc=$_POST["numdoc"];
			$this->dat=$this->_modelo->Consulta_Tabla($tipo_doc,$numdoc);
			echo json_encode($this->dat);
		}

		public function ConsultaTipoServicio(){
			$this->dat=$this->_modelo->Consulta_Servicios();
			echo json_encode($this->dat);
		}

		public function Consultavalor(){
			$servicio=$_POST["servicio"];
			$this->dat=$this->_modelo->valor_servicio($servicio);
			echo json_encode($this->dat);
		}

		public function Consultapareja(){
			$numero=$_POST["numero"];
			$tipo=$_POST["tipo"];
			$this->dat=$this->_modelo->pareja_servicio($numero,$tipo);
			echo json_encode($this->dat);
		}

		public function CrearServicio(){
			$tipo=$_POST["tipo"];
			$cant=$_POST["cant"];
			$costo=$_POST["costo"];
			$tarifa=$_POST["tarifa"];
			$costototal=$_POST["costototal"];
			$tarifatotal=$_POST["tarifatotal"];
			$rentabi=$_POST["rentabi"];
			$utilidad=$_POST["utilidad"];
			$conexion=$_POST["conexion"];	

			$this->dat=$this->_modelo->registra_servicio($tipo,$cant,$costo,$tarifa,$costototal,$tarifatotal,$rentabi,$utilidad,$conexion);
			echo json_encode($this->dat);
		}
		



		
	}
