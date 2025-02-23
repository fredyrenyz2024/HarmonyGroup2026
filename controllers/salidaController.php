<?php
	class salidaController extends Controller{
		private $_modelo;
		public function __construct(){
			parent::__construct();
			//$this->$_modelo=$this->loadModel('transporte'); 
			$this->_modelo = $this->loadModel('salida');
		}

		public function index(){
			$prueba = $this->loadModel('salida');
			$this->_view->prueba = $prueba;
			$this->_view->titulo ='Salida a ruta - creación';
			$this->_view->renderizar('salida_ruta','salida');

		}

		/*public function salida_ruta(){
			$sub = $this->loadModel('salida');
			$this->_view->sub = $sub;
			$this->_view->titulo ='Subasta flete';
			$this->_view->renderizar('salida_ruta','control_ruta');
		}*/

		public function consulta_salidas(){
			$prueba = $this->loadModel('salida');
			$this->_view->prueba = $prueba;
			$this->_view->titulo ='Salidas a ruta';
			$this->_view->renderizar('consulta_salidas','salida');
		}

		public function llegada_crear(){
			$prueba = $this->loadModel('salida');
			$this->_view->prueba = $prueba;
			$this->_view->titulo ='Llegada a ruta';
			$this->_view->renderizar('llegada_crear','salida');
		}

		public function consulta_llegadas(){
			$prueba2 = $this->loadModel('salida');
			$this->_view->prueba2 = $prueba2;
			$this->_view->titulo ='Llegadas a ruta';
			$this->_view->renderizar('consulta_llegadas','salida');
		}


		public function Seleccione_Manifiesto(){
			$this->dato=$this->_modelo->Buscar_Manifiesto();
			echo json_encode($this->dato);
			//print_r($this->dato);
		}

		public function Manifiesto_Salidos(){
			//manifiestos con salidas
			$this->dato=$this->_modelo->Manifiesto_Salida();
			echo json_encode($this->dato);
			//print_r($this->dato);
		}



		public function Buscar_Datos(){
			$mnf=$_POST["mnf"];
			$this->docu=$this->_modelo->Consulta_Datos($mnf);
			echo json_encode($this->docu);
		}

		public function Buscar_Remesa(){
			$mnf=$_POST["mnf"];
			$this->docu=$this->_modelo->Consulta_Remesas($mnf);
			echo json_encode($this->docu);
		}


		public function Buscar_Remesa_llegada(){
			$mnf=$_POST["mnf"];
			$this->docu=$this->_modelo->Consulta_Remesas_llegada($mnf);
			echo json_encode($this->docu);
		}




		public function Registro_Salida(){
			$manifi=$_POST["manifi"];
			$orig=$_POST["orig"];
			$desti=$_POST["desti"];
			$placa=$_POST["placa"];
			$condu=$_POST["condu"];
			$celular=$_POST["celular"];
			$trail=$_POST["trail"];
			$marca=$_POST["marca"];
			$line=$_POST["line"];
			$carroc=$_POST["carroc"];
			$gps=$_POST["gps"];	
			$agenci=$_POST["agenci"];
			$plan=$_POST["plan"];
			$fec1=$_POST["fec1"];
			$hora1=$_POST["hora1"];
			$fec2=$_POST["fec2"];
			$hora2=$_POST["hora2"];
			$observa=$_POST["observa"];
			$num_ori=$_POST["num_ori"];
			$num_des=$_POST["num_des"];
			$documento_condu=$_POST["documento_condu"];
			$numdetalle=$_POST["numdetalle"];
			$nomdetalle=$_POST["nomdetalle"];

			$this->sal=$this->_modelo->Insertar_Salida($manifi,$orig,$desti,$placa,$condu,$celular,$trail,$marca,$line,$carroc,$gps,$agenci,$plan,$fec1,$hora1,$fec2,$hora2,$observa,$num_ori,$num_des,$documento_condu,$numdetalle,$nomdetalle);
			echo json_encode($this->sal);
		}

		public function Consulta_Salidas_Tabla(){
			$filtro=$_POST["filtro"];
			$mnf=$_POST["mnf"];
			$fec1=$_POST["fec1"];
			$fec2=$_POST["fec2"];
			$placa=$_POST["placa"];
			$this->table=$this->_modelo->Consulta_Tabla($filtro,$mnf,$fec1,$fec2,$placa);
			echo json_encode($this->table);
		}

		public function Busca_Salida_Invidual(){
			$id_salida=$_POST["id_salida"];
			$this->consul=$this->_modelo->Consulta_Salida_Invidual($id_salida);
			echo json_encode($this->consul);
		}

		public function Anular(){
			$id_salida=$_POST["id_salida"];
			$this->anula=$this->_modelo->Anula_Salida($id_salida);
			echo json_encode($this->anula);
		}

		public function Actualizar(){
			$num_salida=$_POST["num_salida"];
			$num_mani=$_POST["num_mani"];
			$fechapro=$_POST["fechapro"];
			$horapro=$_POST["horapro"];
			$obs=$_POST["obs"];
			$this->upda=$this->_modelo->Actualiza_Salida($num_salida,$num_mani,$fechapro,$horapro,$obs);
			echo json_encode($this->upda);
		}

		//LLEGADA

		public function Buscar_Datos_Salida(){
			$mnf=$_POST["mnf"];
			$this->docu=$this->_modelo->Consulta_Datos_Salida($mnf);
			echo json_encode($this->docu);
		}

		public function Registro_LLegada(){
			$salida=$_POST["salida"];
			$fecha_llegada=$_POST["fecha_llegada"];
			$hora_llegada=$_POST["hora_llegada"];
			$observacion=$_POST["observacion"];
			$manifiesto=$_POST["manifiesto"];
			$placa=$_POST["placa"];
			$doc_conductor=$_POST["doc_conductor"];
			$remi=$_POST["remi"];
			$idtiempo=$_POST["idtiempo"];
			$this->lleg=$this->_modelo->Insertar_LLegada(
			$salida,$fecha_llegada,$hora_llegada,$observacion,
			$manifiesto,$placa,$doc_conductor,$remi,$idtiempo);
			echo json_encode($this->lleg);
		}

		//TABLA DE LLEGADA
		public function Consulta_LLegada_Tabla(){
			$filtro=$_POST["filtro"];
			$mnf=$_POST["mnf"];
			$fec1=$_POST["fec1"];
			$fec2=$_POST["fec2"];
			$placa=$_POST["placa"];
			$this->table=$this->_modelo->Consulta_LLegadas($filtro,$mnf,$fec1,$fec2,$placa);
			echo json_encode($this->table);
		}

		public function Busca_LLegada_Invidual(){
			$id_llegada=$_POST["id_llegada"];
			$this->lleg=$this->_modelo->Consulta_LLegada_Sola($id_llegada);
			echo json_encode($this->lleg);	
		}

		public function Actualizar_LLegada(){
			$id_lleg=$_POST["idllegada"];
			$id_sal=$_POST["idsalida"];
			$manifi=$_POST["num_manifie"];
			$fecha_llega=$_POST["fec_lleg"];
			$hora_llega=$_POST["hora_lleg"];
			$observ_llega=$_POST["observa"];
			$this->Alleg=$this->_modelo->Actualiza_LLegada($id_lleg,$id_sal,$manifi,$fecha_llega,$hora_llega,$observ_llega);
			echo json_encode($this->Alleg);
		}


		public function Anular_Llegada(){
			$id_llegada=$_POST["id_llegada"];
			$this->anula=$this->_modelo->Anula_llegada($id_llegada);
			echo json_encode($this->anula);


		}


		public function Buscar_Idtiempo_Descargue(){
			$mnf=$_POST["mnf"];
			$this->idtime=$this->_modelo->Buscar_Idtiempo($mnf);
			echo json_encode($this->idtime);
		}


	}
?>