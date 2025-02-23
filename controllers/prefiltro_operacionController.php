<?php
class prefiltro_operacionController extends Controller{
		private $_modelo;
		public function __construct(){
			parent::__construct();
			$this->_modelo = $this->loadModel('prefiltro_operacion');
		}

		public function index(){
			$anticipo=$this->loadModel('prefiltro_operacion');
			$this->_view->anticipo=$anticipo;
			$this->_view->titulo='Prefiltro';
			$this->_view->renderizar('prefiltro_operacion','registro_operacion');
		}

		public function prefiltro_operacion(){
			$anticipo=$this->loadModel('prefiltro_operacion');
			$this->_view->anticipo=$anticipo;
			$this->_view->titulo='Prefiltro';
			$this->_view->renderizar('prefiltro_operacion','transporte');
		}

		public function ConsultaCliente(){
			$this->dati=$this->_modelo->Consultar_Cliente();
			echo json_encode($this->dati);
		}

		public function Consulta_Datos(){
			$inicio=$_POST["finicia"];
			$final=$_POST["ffinal"];
			$cliente=$_POST["cliente"];
			$filtro=$_POST["filtro"];
			$this->dati=$this->_modelo->Busca_Prefiltro($inicio,$final,$cliente,$filtro);
			echo json_encode($this->dati);
		}


		public function Registro_Prefiltro(){
			
			$placa=$_POST["placa"];
			$satelital=$_POST["satelital"];
			$trailer=$_POST["trailer"];
			$user=$_POST["user"];
			$clave=$_POST["clave"];
			$propi=$_POST["propi"];
			$docpropi=$_POST["docpropi"];
			$tene=$_POST["tene"];
			$doctene=$_POST["doctene"];
			$condu=$_POST["condu"];
			$doccondu=$_POST["doccondu"];
			$capacidad=$_POST["capacidad"];
			
			$ref1=$_POST["ref1"];
			$contacto=$_POST["contacto"];
			$celular=$_POST["celular"];
			$cargo=$_POST["cargo"];
			$antigu=$_POST["antigu"];
			$fecha1=$_POST["fecha1"];
			$fecha2=$_POST["fecha2"];

			$refe2=$_POST["refe2"];
			$contacto2=$_POST["contacto2"];
			$celular2=$_POST["celular2"];
			$cargo2=$_POST["cargo2"];
			$antiguedad2=$_POST["antiguedad2"];
			$fechab1=$_POST["fechab1"];
			$fechab2=$_POST["fechab2"];

			$refe3=$_POST["refe3"];
			$contacto3=$_POST["contacto3"];
			$celular3=$_POST["celular3"];
			$cargo3=$_POST["cargo3"];
			$antiguedad3=$_POST["antiguedad3"];
			$fechac1=$_POST["fechac1"];
			$fechac2=$_POST["fechac2"];
			$this->pre=$this->_modelo->Insertar_Prefiltro(
				$placa,
				$satelital,
				$trailer,
				$user,
				$clave,
				$propi,
				$docpropi,
				$tene,
				$doctene,
				$condu,
				$doccondu,
				$capacidad,
				$ref1,
				$contacto,
				$celular,
				$cargo,
				$antigu,
				$fecha1,
				$fecha2,
				$refe2,
				$contacto2,
				$celular2,
				$cargo2,
				$antiguedad2,
				$fechab1,
				$fechab2,
				$refe3,
				$contacto3,
				$celular3,
				$cargo3,
				$antiguedad3,
				$fechac1,
				$fechac2
			);
			echo json_encode($this->pre);
		}

	}
?>