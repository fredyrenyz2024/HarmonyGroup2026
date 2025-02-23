<?php
	session_start();
	class prefiltro_operacionModel extends Model
	{
		public function __construct()
		{
			parent::__construct();
		}

		public function buscar_vehiculo($placa_vehiculo){
			try {
				$sql="SELECT id,estado_vehiculo,id_conductor
				FROM cmx_vehiculos WHERE placa='".$placa_vehiculo."'";
				$resultado = $this->_db3->query($sql);
				$resultado->setFetchMode(PDO::FETCH_ASSOC);
				return $resultado->fetchall();
			}catch (Exception $e) {
				
			}
		}

		//CONSULTA CLIENTES
		public function Consultar_Cliente()
		{
			try {
				$resultado = $this->_db2->conectar();
				$sql = "SELECT  id, documento, digito_verificacion, nombre 
					FROM cmx_clientes
					WHERE estado=1 
					ORDER BY nombre ASC";
				$consult = $resultado->query($sql);
				$consult->setFetchMode(PDO::FETCH_ASSOC);
				return $consult->fetchall();
			} catch (PDOException $e) {
				$error = $e->getMessage();
				$this->_db2->rollBack();
			}
		}

		//consulta para la tabla prefiltros
		public function Busca_Prefiltro($fi,$ff,$cliente,$tipo){
			try{
				$resultado = $this->_db2->conectar();
				if ($tipo == 1) {
					$sqlo ="SELECT v.* 
						FROM cmx_vehiculos_preestudio v
						INNER JOIN cmx_vehiculos_preestudio_estado ve
						ON v.id=ve.vehiculo_preestudio AND ve.estado_final=1
						WHERE v.fecha BETWEEN '".$fi."' AND '".$ff."'";
				}
				
				$consultm = $resultado->query($sqlo);
				return $consultm->fetchall();
			}catch (PDOException $e){
				$error = $e->getMessage();
				$this->_db2->rollBack();
			}
		}


		//registro de prefiltro

		public function Insertar_Prefiltro($placa,$satelital,$trailer,$user,$clave,$propi,$docpropi,$tene,$doctene,$condu,$doccondu,$capacidad,$ref1,$contacto,$celular,$cargo,$antigu,$fecha1,$fecha2,$refe2,$contacto2,$celular2,$cargo2,$antiguedad2,$fechab1,$fechab2,$refe3,$contacto3,$celular3,$cargo3,$antiguedad3,$fechac1,$fechac2){

			$resultado= $this->_db2->conectar();
			$factual=date('Y-m-d');
			$horactual=date('H:i:s');
			$id_usuario = $_SESSION["usuario"]["nom_usuario"];

			//santizando
			try{
				$resultado->prepare("insert into cmx_vehiculos_preestudio(id,placa_vehiculo,placa_trailer,nombre_propietario,documento_propietario,nombre_tenedor,documento_tenedor,nombre_conductor,documento_conductor,web_satelital,usuario_satelital,clave_satelital,fecha,hora,usuario)values(:id,:placa_vehiculo,:placa_trailer,:propietario,:docu_propietario,:tenedor,:docu_tene,:conductor,:docu_conductor,:web,:usuario,:clave,:fecha_traza,:hora,:usuario)")->execute(
					array(
						':id'=>null,
						':placa_vehiculo'=>$placa,
						':placa_trailer'=>$trailer,
						':propietario'=>$propi,
						':docu_propietario'=>$docpropi,
						':tenedor'=>$tene,
						':docu_tene'=>$doctene,
						':conductor'=>$condu,
						':docu_conductor'=>$doccondu,
						':web'=>$satelital,
						':usuario'=>$user,
						':clave'=>$clave,
						':fecha_traza'=>$factual,
						':hora'=>$horactual,
						':usuario'=>$id_usuario
				));
				if($resultado){
					//registra refrencias empresariales 1
					$referencia1 = $resultado->prepare("insert into cmx_referencias_preestudio(id,nombre_empresa,fecha_ingreso,fecha_retiro,persona_contacto,celular,cargo,id_conductor,antiguedad,fecha,hora,usuario,estado)values(:id,:empresa,:fecha1,:fecha2,:contacto,:celular,:cargo,:idconductor,:antiguedad,:fecha_actual,:hora_actual,:id_usuario,:estado)")->execute(
						array(
							':id'=>null,
							':empresa'=>$ref1,
							':fecha1'=>$fecha1,
							':fecha2'=>$fecha2,
							':contacto'=>$contacto,
							':celular'=>$celular,
							':cargo'=>$cargo,
							':idconductor'=>$doccondu,
							':antiguedad'=>$antigu,
							':fecha_actual'=>$factual,
							':hora_actual'=>$horactual,
							':id_usuario'=>$id_usuario,
							':estado'=>1
						)); 
					//registrar referencias empresariales 2
					$referencia2 = $resultado->prepare("insert into cmx_referencias_preestudio(id,nombre_empresa,fecha_ingreso,fecha_retiro,persona_contacto,celular,cargo,id_conductor,antiguedad,fecha,hora,usuario,estado)values(:idb,:empresab,:fecha1b,:fecha2b,:personab,:celularb,:cargob,:conductorb,:antiguedadb,:fecha_actualb,:hora_actualb,:iduserb,:estadob)")->execute(
						array(
							':idb'=>null,
							':empresab'=>$refe2,
							':fecha1b'=>$fechab1,
							':fecha2b'=>$fechab2,
							':personab'=>$contacto2,
							':celularb'=>$celular2,
							':cargob'=>$cargo2,
							':conductorb'=>$doccondu,
							':antiguedadb'=>$antiguedad2,
							':fecha_actualb'=>$factual,
							':hora_actualb'=>$horactual,
							':iduserb'=>$id_usuario,
							':estadob'=>1
						));
					//registrar referencias empresariales 3
					$referencias3 = $resultado->prepare("insert into cmx_referencias_preestudio(id,nombre_empresa,fecha_ingreso,fecha_retiro,persona_contacto,celular,cargo,id_conductor,antiguedad,fecha,hora,usuario,estado)values(:idc,:empresac,:fecha1c,:fecha2c,:personac,:celularc,:cargoc,:conductor,:antiguedad,:fecha_actual,:hora_actual,:idusuario,:estado)")->execute(
						array(
							':idc'=>null,
							':empresac'=>$refe3,
							':fecha1c'=>$fechac1,
							':fecha2c'=>$fechac2,
							':personac'=>$contacto3,
							':celularc'=>$celular3,
							':cargoc'=>$cargo3,
							':conductor'=>$doccondu,
							':antiguedad'=>$antiguedad3,
							':fecha_actual'=>$factual,
							':hora_actual'=>$horactual,
							':idusuario'=>$id_usuario,
							':estado'=>1
					));
					//registro de estado de vehiculos_preestudio
					$sqla="SELECT max(id) as 'id' FROM cmx_vehiculos_preestudio";
					$resultadoc=$this->_db3->query($sqla);
					$resultadoc->setFetchMode(PDO::FETCH_ASSOC);
					$respuesta = $resultadoc->fetch(); 

					$preestudio_estado = $resultado->prepare("insert into cmx_vehiculos_preestudio_estado(id,vehiculo_preestudio,estado_vehiculo,fecha,hora,usuario,estado_final)
						values(:id,:id_preestudio,:status,:fecha,:hora,:usuario,:estado)")->execute(
						array(
							':id'=>null,
							':id_preestudio'=>$respuesta['id'],
							':status'=>'Desbloquear',
							':fecha'=>$factual,
							':hora'=>$horactual,
							':usuario'=>$id_usuario,
							':estado'=>1
						));
					if($preestudio_estado){
						//registrar solicitudes preestudio
						$solicitudes = $resultado->prepare("insert into cmx_solicitudes_preestudio
							(id,id_preestudio,placa,fecha,hora,usuario,estado_actual_sol,proceso,operacion,pesoneto_total)values(:id,:id_preestudio,:placa,:fecha,:hora,:iduser,:estado,:proceso,:operacion,:capacidad)")->execute(
								array(
									':id'=>null,
									':id_preestudio'=>$respuesta['id'],
									':placa'=>$placa,
									':fecha'=>$factual,
									':hora'=>$horactual,
									':iduser'=>$id_usuario,
									':estado'=>1,
									':proceso'=>'Pen_Sol_PreR',
									':operacion'=>'Nuevo',
									':capacidad'=>$capacidad
						));
						if($solicitudes){
							$sqlb="SELECT max(id) as 'id' FROM cmx_solicitudes_preestudio";
							$resultadob=$this->_db3->query($sqlb);
							$resultadob->setFetchMode(PDO::FETCH_ASSOC);
							$rta = $resultadob->fetch(); 	
						    $idsol_prees=$rta['id'];
						    //registrar cmx_solicitudes_estados
						    $solicitud_estado = $resultado->prepare("insert into cmx_solicitudes_estados(id,estado,id_solicitud,fecha,hora,usuario,estado_actual,area)
						    	values(:id,:estado_pal,:id_solicitud,:fecha,:hora,:user,:estado,:area)")->execute(
						    	array(
						    		':id'=>null,
						    		':estado_pal'=>'pendiente_iniciar',
						    		':id_solicitud'=>$idsol_prees,
						    		':fecha'=>$factual,
						    		':hora'=>$horactual,
						    		':user'=>$id_usuario,
						    		':estado'=>1,
						    		':area'=>'operaciones'
						    	));
						    	if($solicitud_estado){
						    		$return["status"] = true;
						    		return $return;
						    	}else{
						    		$return["status"] = false;
						    		return $return;
						    	}
						}	

					}	
				}
			}catch(PDOExeption $e){
				$error = $e->getMessage();
				$this->_db2->rollBack();
				return 'false';
			}
		}



	}
?>