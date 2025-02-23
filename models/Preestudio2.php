<?php
include '../application/Conexion.php';
require_once '../application/Config.php';
session_start();

// echo 'sjdjsdhd';
class Preestudio{
		public $user_log;
		public $pass;
		public $mensaje;
		public $respuesta;
		public $email;
		public $listado;

		public function verpreestudio(){
			$placa = $_POST["id"];
			// echo $placa; 
			// echo 'ferrocarril';

			$model    = new Conexion;
			$conexion = $model->conectar();
			//consultar 
			$sql      = "SELECT * FROM cmx_vehiculos_preestudio
						WHERE placa_vehiculo='".$placa."'  ";
						// echo $sql;
			$consulta = $conexion->prepare($sql);
			$consulta->execute();
			$total         = $consulta->rowCount();
			// $this->mensaje = $total;
			if($total==0){
				echo 'no hay nada vehiculospreestudio';
				$this->mensaje='0';
				



				$this->respuesta = "GOOD";
			}else{
				//si hay en cmx_vehiculos
				echo 'si hay algo';
				$this->respuesta = "GOOD";
				$this->mensaje='1';
				while ($datos_solicitudes = $consulta->fetch()) {
					$this->listado[] = $datos_solicitudes;
				}
			}

			//PRINCIPAL VEHICULOS

			//consultar cmx_vehiculos
				$sql2="SELECT * FROM cmx_vehiculos
						WHERE placa='".$placa."'   ";
						echo $sql2;
				$consulta2 = $conexion->prepare($sql2);
				$result=$consulta2->execute();		
				if($result){
					echo 'si hay vehiculos';
					$this->mensaje='11';
				}else{
					echo 'no hay vehiculos';
					$this->mensaje='00';
				}
				$return["success"]= true;
				 $return["error"] = $_msg_error;
				return $return;
		}



		public function insertar_preestudio_con(){
			$_msg_error = "";
			$model    = new Conexion;
			$conexion = $model->conectar();
			$fecha=date('Y-m-d');
			$hora=date('H:i:s');
			$user=$_SESSION["usuario"]["nom_usuario"];
			$cab=$_POST["cab"];

			if($cab=='1'){
				$cliente=$_POST["cliente"];
				$placa=$_POST["placa"];
				if($_POST["trailer"]){
					$trailer=$_POST["trailer"];
				}else{
					$trailer='';
				}
				$propietario=$_POST["propietario"];
				$docu_pro=$_POST["documento_pro"];
				$tenedor=$_POST["tenedor"];
				$docu_tene=$_POST["documento_tene"];
				$conductor=$_POST["conductor"];
				$docu_condu=$_POST["documento_condu"];
				$web=$_POST["web"];
				$useri=$_POST["user_satelite"];
				$clave=$_POST["clave"];
				$observacion=$_POST["observacion"];

				$sql="INSERT INTO cmx_vehiculos_preestudio
				(id,
				placa_vehiculo,
				placa_trailer,
				nombre_propietario,
				documento_propietario,
				nombre_tenedor,
				documento_tenedor,
				nombre_conductor,
				documento_conductor,
				web_satelital,
				usuario_satelital,
				clave_satelital,
				fecha,hora,usuario)VALUES(null,
				'$placa',
				'$trailer',
				'$propietario',
				$docu_pro,
				'$tenedor',
				$docu_tene,
				'$conductor',
				$docu_condu,
				'$web','$useri','$clave',
				'$fecha','$hora','$user')";
				 // echo $sql;
				$crearVpreestudio = $conexion->prepare($sql);
				$result=$crearVpreestudio->execute();
				if($result){
					//update vehiculo
					//hacer update en vehiculo principal
					$sql2="UPDATE cmx_vehiculos
							SET web_satelital='$web',
							usuario_satelital='$useri',
							clave_satelital='$clave'
							WHERE placa='$placa'  ";
					// echo $sql2;
					$actualizarv = $conexion->prepare($sql2);
					$result=$actualizarv->execute();

					//traer el id de preestudio
					 $sql = "SELECT max(id) as 'id' FROM cmx_vehiculos_preestudio";
				    $consulta_vprestudio = $conexion->prepare($sql);
				    $consulta_vprestudio->execute();
				    $datos_preestudio = $consulta_vprestudio->fetch();
				    $id_preestudio = $datos_preestudio["id"];


				    //INSERTAR estado del vehiculo en la tabla cmx_vehiculos_preestudio_estado
				    $sqlee="INSERT INTO cmx_vehiculos_preestudio_estado
				    	(id,
				    	vehiculo_preestudio,
				    	estado_vehiculo,
				    	fecha,
				    	hora,
				    	usuario,
				    	estado_final)VALUES(null,
				    	'$id_preestudio',
				    	'Desbloquear',
				    	'$fecha',
				    	'$hora',
				    	'$user',
				    	'1')";
				    	$insert_pree_es = $conexion->prepare($sqlee);
						$resultpe=$insert_pree_es->execute();
					//INSERT SOLICITUD
					$sql4="INSERT INTO cmx_solicitudes_preestudio
						(id,id_preestudio,cliente,
						placa,fecha,
						hora,usuario,observacion,estado_actual_sol)
						VALUES(null,$id_preestudio,'$cliente','$placa','$fecha',
						'$hora','$user','$observacion','1')";
					$insertv = $conexion->prepare($sql4);
					$result3=$insertv->execute();

					if($result3){
						//traer el id de solicitud
						 $sqlm = "SELECT max(id) as 'id' FROM cmx_solicitudes_preestudio";
				    $consulta_soli = $conexion->prepare($sqlm);
				    $consulta_soli->execute();
				    $datos_solicitu = $consulta_soli->fetch();
				    $id_solicitud = $datos_solicitu["id"];

					//insertar estado
					$sqle="INSERT cmx_solicitudes_estados
						(id,estado,id_solicitud,
							fecha,hora,usuario,estado_actual,area)
					VALUES(null,'pendiente',$id_solicitud,'$fecha','$hora','$user','1','operaciones');";
					
					$insertsol = $conexion->prepare($sqle);
					$result=$insertsol->execute();
					}
				}
			}

			//REFERENCIAS	
			$ref=$_POST["ref"];
			if($ref=='2'){
				//consultar el consecutivo
				$sqlmax="SELECT MAX(id) as 'id' FROM cmx_vehiculos_preestudio";
				
			    $consulta_maxid = $conexion->prepare($sqlmax);
			    $consulta_maxid->execute();
			    $datos_vpreestudio = $consulta_maxid->fetch();
			    $id_vpreestudio = $datos_vpreestudio["id"];

			    // echo $id_vpreestudio;

				$empresa=$_POST["empre"];
				$ingreso=$_POST["ingreso"];
				$retiro=$_POST["retiro"];
				$persona=$_POST["persona"];
				$num=$_POST["num"];
				$cargo=$_POST["cargo"];

				$sql_r="INSERT INTO cmx_referencias_preestudio
						(id,nombre_empresa,fecha_ingreso,fecha_retiro,
						persona_contacto,celular,cargo,consecutivo,fecha,hora,usuario,estado)
						VALUES(null,'$empresa','$ingreso','$retiro','$persona','$num','$cargo','$id_vpreestudio','$fecha','$hora','$user','1')";
				 // echo $sql_r;		
				$crearRpreestudio = $conexion->prepare($sql_r);
				$result=$crearRpreestudio->execute();
			}
			$return["success"]= true;
			// $return["error"] = $_msg_error;
			 return $return;
		}

		

		public function insertar_preestudio_solo(){
			// echo 'estaentrando aca';
			$_msg_error = "";
			$model    = new Conexion;
			$conexion = $model->conectar();
			$fecha=date('Y-m-d');
			$hora=date('H:i:s');
			$user=$_SESSION["usuario"]["nom_usuario"];
			$cab=$_POST["cab"];

			if($cab=='1'){
				$cliente=$_POST["cliente"];
				$placa=$_POST["placa"];
				if($_POST["trailer"]){
					$trailer=$_POST["trailer"];
				}else{
					$trailer='';
				}
				$propietario=$_POST["propietario"];
				$docu_pro=$_POST["documento_pro"];
				$tenedor=$_POST["tenedor"];
				$docu_tene=$_POST["documento_tene"];
				$conductor=$_POST["conductor"];
				$docu_condu=$_POST["documento_condu"];
				$web=$_POST["web"];
				$useri=$_POST["user_satelite"];
				$clave=$_POST["clave"];
				$observacion=$_POST["observacion"];

				$sql="INSERT INTO cmx_vehiculos_preestudio
				(id,
				placa_vehiculo,
				placa_trailer,
				nombre_propietario,
				documento_propietario,
				nombre_tenedor,
				documento_tenedor,
				nombre_conductor,
				documento_conductor,
				web_satelital,
				usuario_satelital,
				clave_satelital,
				fecha,hora,usuario)VALUES(null,
				'$placa',
				'$trailer',
				'$propietario',
				$docu_pro,
				'$tenedor',
				$docu_tene,
				'$conductor',
				$docu_condu,
				'$web','$useri','$clave',
				'$fecha','$hora','$user')";
				  // echo $sql;
				$crearVpreestudio = $conexion->prepare($sql);
				$result=$crearVpreestudio->execute();
				// $crearVpreestudio->commit();
				// if($result){
					
					//traer el id de preestudio
					 $sql = "SELECT max(id) as 'id' FROM cmx_vehiculos_preestudio";
				    $consulta_vprestudio = $conexion->prepare($sql);
				    $consulta_vprestudio->execute();
				    $datos_preestudio = $consulta_vprestudio->fetch();
				    $id_preestudio = $datos_preestudio["id"];

				    //INSERTAR estado del vehiculo en la tabla cmx_vehiculos_preestudio_estado
				    $sqlee="INSERT INTO cmx_vehiculos_preestudio_estado
				    	(id,
				    	vehiculo_preestudio,
				    	estado_vehiculo,
				    	fecha,
				    	hora,
				    	usuario,
				    	estado_final)VALUES(null,
				    	'$id_preestudio',
				    	'Desbloquear',
				    	'$fecha',
				    	'$hora',
				    	'$user',
				    	'1')";
				    	$insert_pree_es = $conexion->prepare($sqlee);
						$resultpe=$insert_pree_es->execute();	
					//INSERT SOLICITUD
					$sql4="INSERT INTO cmx_solicitudes_preestudio
						(id,id_preestudio,cliente,
						placa,fecha,
						hora,usuario,observacion,estado_actual_sol)
					VALUES(null,$id_preestudio,'$cliente',
						'$placa','$fecha',
						'$hora','$user','$observacion','1')";
					$insertv = $conexion->prepare($sql4);
					$result3=$insertv->execute();

					if($result3){
						//traer el id de solicitud
						 $sqlm = "SELECT max(id) as 'id' FROM cmx_solicitudes_preestudio";
				    $consulta_soli = $conexion->prepare($sqlm);
				    $consulta_soli->execute();
				    $datos_solicitu = $consulta_soli->fetch();
				    $id_solicitud = $datos_solicitu["id"];

					//insertar estado
					$sqle="INSERT cmx_solicitudes_estados
						(id,estado,id_solicitud,
							fecha,hora,usuario,estado_actual,area)
					VALUES(null,'pendiente',$id_solicitud,'$fecha','$hora','$user','1','operaciones');";
					
					$insertsol = $conexion->prepare($sqle);
					$result=$insertsol->execute();
					}
				// }
			}

		function traer_numero(){
			$model    = new Conexion;
			$conexion = $model->conectar();
			$sqlmax="SELECT MAX(id) as 'id' FROM cmx_vehiculos_preestudio";
			$consulta_maxid = $conexion->prepare($sqlmax);
			    $consulta_maxid->execute();
			$datos_vpreestudio = $consulta_maxid->fetch();
			$id_vpreestudio = $datos_vpreestudio["id"];
			return $id_vpreestudio;
		}

			$num2=traer_numero();
			// echo $num;

			//REFERENCIAS	
			$ref=$_POST["ref"];
			if($ref=='2'){
			//consultar el consecutivo
			// echo 'REFERENCIASID'.$id_vpreestudio;
			$empresa=$_POST["empre"];
			$ingreso=$_POST["ingreso"];
			$retiro=$_POST["retiro"];
			$persona=$_POST["persona"];
			$num=$_POST["num"];
			$cargo=$_POST["cargo"];
			$sql_r="INSERT INTO cmx_referencias_preestudio
						(id,nombre_empresa,fecha_ingreso,fecha_retiro,
						persona_contacto,celular,cargo,consecutivo,fecha,hora,usuario,estado)
			VALUES(null,'$empresa','$ingreso','$retiro','$persona','$num','$cargo','$num2','$fecha','$hora','$user','1')";
				 // echo $sql_r;		
		$crearRpreestudio = $conexion->prepare($sql_r);
		$result=$crearRpreestudio->execute();
	}

		$return["success"]= true;
		// $return["error"] = $_msg_error;
		return $return;
	}


	public function insertar_cabecera(){
		$_msg_error = "";
			$model    = new Conexion;
			$conexion = $model->conectar();
			$fecha=date('Y-m-d');
			$hora=date('H:i:s');
			$user=$_SESSION["usuario"]["nom_usuario"];
			$cab=$_POST["cab"];

			if($cab=='1'){
				$placa=$_POST["placa"];
				
				if($_POST["trailer"]){
					$trailer=$_POST["trailer"];
				}else{
					$trailer='';
				}
				$propietario=$_POST["propietario"];
				$docu_pro=$_POST["documento_pro"];
				$tenedor=$_POST["tenedor"];
				$docu_tene=$_POST["documento_tene"];
				$conductor=$_POST["conductor"];
				$docu_condu=$_POST["documento_condu"];
				$web=$_POST["web"];
				$useri=$_POST["user_satelite"];
				$clave=$_POST["clave"];
				

				$sql="INSERT INTO cmx_vehiculos_preestudio
				(id,
				placa_vehiculo,
				placa_trailer,
				nombre_propietario,
				documento_propietario,
				nombre_tenedor,
				documento_tenedor,
				nombre_conductor,
				documento_conductor,
				web_satelital,
				usuario_satelital,
				clave_satelital,
				fecha,hora,usuario)VALUES(null,
				'$placa',
				'$trailer',
				'$propietario',
				$docu_pro,
				'$tenedor',
				$docu_tene,
				'$conductor',
				$docu_condu,
				'$web','$useri','$clave',
				'$fecha','$hora','$user')";
				  // echo $sql;
				$crearVpreestudio = $conexion->prepare($sql);
				$result=$crearVpreestudio->execute();
				// $crearVpreestudio->commit();
				  if($result){
					
					//traer el id de preestudio
					 $sql = "SELECT id  FROM cmx_vehiculos_preestudio where placa_vehiculo = '$placa'";
				    $consulta_vprestudio = $conexion->prepare($sql);
				    $consulta_vprestudio->execute();
				    $datos_preestudio = $consulta_vprestudio->fetch();
				    $id_preestudio = $datos_preestudio["id"];

				    //INSERTAR estado del vehiculo en la tabla cmx_vehiculos_preestudio_estado
				    $sqlee="INSERT INTO cmx_vehiculos_preestudio_estado
				    	(id,
				    	vehiculo_preestudio,
				    	estado_vehiculo,
				    	fecha,
				    	hora,
				    	usuario,
				    	estado_final)VALUES(null,
				    	'$id_preestudio',
				    	'Desbloquear',
				    	'$fecha',
				    	'$hora',
				    	'$user',
				    	'1')";
				    	$insert_pree_es = $conexion->prepare($sqlee);
						$resultpe=$insert_pree_es->execute();	
					}	
			}

			$return["success"]= true;
			// $return["error"] = $_msg_error;
			return $return;
	}


		public function insertar_referencias(){
			$_msg_error = "";
			$model    = new Conexion;
			$conexion = $model->conectar();	
			$ref=$_POST["ref"];
			
			if($ref=='2'){
				//consultar el consecutivo
				$id_vehiculo=$_POST["id_vehiculo"];
				$empresa=$_POST["empre"];
				$ingreso=$_POST["ingreso"];
				$retiro=$_POST["retiro"];
				$persona=$_POST["persona"];
				$num=$_POST["num"];
				$cargo=$_POST["cargo"];
				$fecha=date('Y-m-d');
				$hora=date('H:i:s');
				$user=$_SESSION["usuario"]["nom_usuario"];
				$sql_r="INSERT INTO cmx_referencias_preestudio
						(id,nombre_empresa,fecha_ingreso,fecha_retiro,
						persona_contacto,celular,cargo,consecutivo,fecha,hora,usuario,estado)
						VALUES(null,'$empresa','$ingreso','$retiro','$persona','$num','$cargo',
						'$id_vehiculo','$fecha','$hora','$user','1')";
				 // echo $sql_r;		
				$crearRpreestudio = $conexion->prepare($sql_r);
				$result=$crearRpreestudio->execute();
			}

			$return["success"]= true;
			// $return["error"] = $_msg_error;
			 return $return;
		}




public function insertar_nueva_solicitud(){
		// echo 'entro aca';
		$_msg_error = "";
		$model    = new Conexion;
		$conexion = $model->conectar();
		//traer datos del vehiculo actualizar 
		$ecab=$_POST["ecab"];
		$id_preestudio=$_POST["id_preestudio"];
		if($ecab=='2'){
				// $id_preestudio=$_POST["id_preestudio"];
				$placa=$_POST["placa"];
				$trailer=$_POST["trailer"];
				$web=$_POST["web"];
				$usuerweb=$_POST["usuerweb"];
				$clave=$_POST["clave"];
				$propi=$_POST["propi"];
				$num_propi=$_POST["num_propi"];
				$tene=$_POST["tene"];
				$num_tene=$_POST["num_tene"];
				$condu=$_POST["condu"];
				$num_condu=$_POST["num_condu"];

				//solicitud insertar 
				$clientenew=$_POST["clientenew"];
				$solicitud_anterior=$_POST["solicitud_anterior"];
				$fechanew=$_POST["fechanew"];
				$horanew=$_POST["horanew"];
				$user_new=$_POST["user_new"];
				$observacion_new=$_POST["observacion_new"];

				//actualizar datos vehiculo
				$sql1="UPDATE cmx_vehiculos_preestudio
					SET placa_trailer='$trailer',
					nombre_propietario='$propi',
					documento_propietario='$num_propi',
					nombre_tenedor='$tene',
					documento_tenedor='$num_tene',
					nombre_conductor='$condu',
					documento_conductor='$num_condu',
					web_satelital='$web',
					usuario_satelital='$usuerweb',
					clave_satelital='$clave'
					WHERE id=$id_preestudio  ";
					// echo $sql1;
				$crearvehi_prees =$conexion->prepare($sql1);
				$result=$crearvehi_prees->execute();
		if($result){
				//inactivar solicitud anterior y estado anterior a 0 
				$sql_sa="UPDATE cmx_solicitudes_preestudio
						SET estado_actual_sol='0'
						WHERE id='$solicitud_anterior'
						";
				$update_soli_antes =$conexion->prepare($sql_sa);
				$resultsa=$update_soli_antes->execute();
			if($resultsa){
					//consultar el id del estado actual sin haber registrado el nuevo (estado seguridad)
					$sqles="SELECT MAX(id) as 'id' FROM cmx_solicitudes_estados";
				    $consulta_es = $conexion->prepare($sqles);
				    $consulta_es->execute();
				    $datos_es = $consulta_es->fetch();
				    //id estado 
				    $id_estado = $datos_es["id"];

					$sql_ea="UPDATE cmx_solicitudes_estados
							SET estado_actual='0'
							WHERE  id='$id_estado' ";
					$update_estado_antes =$conexion->prepare($sql_ea);
					$resultsa=$update_estado_antes->execute();
					//Una vez inactivos la solicitud y el estado anterior se procede a registrar la solicitud y el estado nuevo
					//insertar nueva solicitud + estado
					$sql2="INSERT INTO 
					cmx_solicitudes_preestudio(id,id_preestudio,cliente,placa,fecha,hora,usuario,observacion,estado_actual_sol)
					VALUES(null,'$id_preestudio','$clientenew','$placa','$fechanew','$horanew','$user_new',
						'$observacion_new','1')";
						// echo $sql2;
					$crearsolicitud =$conexion->prepare($sql2);
					$result2=$crearsolicitud->execute();
					if($result2){
						//consultar el id de solicitud e insertar estado
						$sqlmax="SELECT MAX(id) as 'id' FROM cmx_solicitudes_preestudio";
					    $consulta_maxid = $conexion->prepare($sqlmax);
					    $consulta_maxid->execute();
					    $datos_solicitud = $consulta_maxid->fetch();
					    //id solicitud mas reciente
					    $id_solilictud = $datos_solicitud["id"];

					    $sql3="INSERT INTO cmx_solicitudes_estados(id,estado,id_solicitud,fecha,hora,usuario,estado_actual,area)
					 	VALUES(null,'pendiente',$id_solilictud,'$fechanew','$horanew','$user_new','1','operaciones')";
					 	// echo $sql3;
					 	$crearestado= $conexion->prepare($sql3);
					 	$resulta=$crearestado->execute();
					}//cierre result2
			}//cierre resultsa			
		}//cierre result; actualiza datos del vehiculo		
	}//cierre del ecab
			
	//actualizar referencias
	$refi=$_POST["refi"];
	if($refi=='3'){
			//actualizar referencias laborales
			$eempresa=$_POST["eempresa"];
			$efingreso=$_POST["efingreso"];
			$efretiro=$_POST["efretiro"];
			$econtacto=$_POST["econtacto"];
			$enumero=$_POST["enumero"];
			$ecargo=$_POST["ecargo"];
			$id_ref=$_POST["id_ref"];
			$fecha=date('Y-m-d');
			$hora=date('H:i:s');
			$user=$_SESSION["usuario"]["nom_usuario"];
			$sql4="UPDATE cmx_referencias_preestudio
				SET nombre_empresa='$eempresa',
				fecha_ingreso='$efingreso',
				fecha_retiro='$efretiro',
				persona_contacto='$econtacto',
				celular='$enumero',
				cargo='$ecargo',
				consecutivo='$id_preestudio',
				fecha='$fecha',
				hora='$hora',
				usuario='$user'
				WHERE  id='$id_ref'     ";
			$actualizarreferencia= $conexion->prepare($sql4);
			$result=$actualizarreferencia->execute();	
	}//cierre de referencias
	$return["success"]= true;
	// $return["error"] = $_msg_error;
	return $return;
}


		//actualizar edicion tabla filtros
		public function update_solicitud(){
			$_msg_error = "";
			$model    = new Conexion;
			$conexion = $model->conectar();
			$s_cab=$_POST["s_cab"];
			if($s_cab=='2'){
				//solicitudes
				$idsolicitud=$_POST["idsolicitud"];
				$placa=$_POST["placa"];
				$preestudi=$_POST["preestudi"];
				$fecha=$_POST["fecha"];
				$hora=$_POST["hora"];
				$usuario=$_POST["usuario"];
				//preestudio
				$cliente=$_POST["cliente"];
				$propi=$_POST["propi"];
				$docu_propi=$_POST["docu_propi"];
				$tenedor=$_POST["tenedor"];
				$docu_tenedor=$_POST["docu_tenedor"];
				$conductor=$_POST["conductor"];
				$docu_condu=$_POST["docu_condu"];
				$web=$_POST["web"];
				$user_web=$_POST["user_web"];
				$user_clave=$_POST["user_clave"];
				//actualizar preestudio vehiculo

				$sql="UPDATE cmx_vehiculos_preestudio
					SET  
					placa_vehiculo='$placa',
					placa_trailer='',
					nombre_propietario='$propi',
					documento_propietario='$docu_propi',
					nombre_tenedor='$tenedor',
					documento_tenedor='$docu_tenedor',
					nombre_conductor='$conductor',
					documento_conductor='$docu_condu',
					web_satelital='$web',
					usuario_satelital='$user_web',
					clave_satelital='$user_clave'
					WHERE id='$preestudi'  ";
					// echo $sql;
				$crearsolicitud = $conexion->prepare($sql);
				$result=$crearsolicitud->execute();
				

					//actualizar solicitud
				$sqls="UPDATE  cmx_solicitudes_preestudio 
					SET cliente='$cliente'
					WHERE  id='$idsolicitud'   ";
				$updates = $conexion->prepare($sqls);
				$result=$updates->execute();	
				
			}	
			//referencias
			$s_ref=$_POST["s_ref"];	
			if($s_ref=='3'){
				$empre=$_POST["empre"];
				$ingreso=$_POST["ingreso"];
				$retiro=$_POST["retiro"];
				$contacto=$_POST["contacto"];
				$telefono=$_POST["telefono"];
				$cargo=$_POST["cargo"];
				$id=$_POST["id"];
				$sql_r="UPDATE cmx_referencias_preestudio
						SET nombre_empresa='$empre',
						fecha_ingreso='$ingreso',
						fecha_retiro='$retiro',
						persona_contacto='$contacto',
						celular='$telefono',
						cargo='$cargo'
						WHERE id=$id  ";
				$updater = $conexion->prepare($sql_r);
				$result=$updater->execute();
			}		
		}

		//update del modal
		public function update_sol(){
			$_msg_error = "";
			$model    = new Conexion;
			$conexion = $model->conectar();
			//traer variables
			$id_preestudio=$_POST["id_preestudio"];
			$cab=$_POST["cab"];
			if($cab=='2'){
				$placa=$_POST["placa"];
			if($_POST["trailer"]){
				$trailer=$_POST["trailer"];
			}else{
				$trailer='';
			}

			$web=$_POST["web"];
			$usuerweb=$_POST["usuerweb"];
			$clave=$_POST["clave"];
			$propi=$_POST["propi"];
			$num_propi=$_POST["num_propi"];
			$tene=$_POST["tene"];
			$num_tene=$_POST["num_tene"];
			$condu=$_POST["condu"];
			$num_condu=$_POST["num_condu"];
			$id_solicitud=$_POST["id_solicitud"];
			$cliente=$_POST["cliente"];
			$fecha=$_POST["fecha"];
			$hora=$_POST["hora"];
			$usuario=$_POST["usuario"];
			
			if($_POST["observacion"]){
				$observacion=$_POST["observacion"];
			}else{
				$observacion='';
			}

			//hacer update de preestudio
			$sql="UPDATE cmx_vehiculos_preestudio
				SET placa_vehiculo='$placa',
					placa_trailer='$trailer',
					nombre_propietario='$propi',
					documento_propietario='$num_propi',
					nombre_tenedor='$tene',
					documento_tenedor='$num_tene',
					nombre_conductor='$condu',
					documento_conductor='$num_condu',
					web_satelital='$web',
					usuario_satelital='$usuerweb',
					clave_satelital='$clave',
					fecha='$fecha',
					hora='$hora',
					usuario='$usuario'
				WHERE id=$id_preestudio";
				 // echo $sql;
			$crearsolicitud = $conexion->prepare($sql);
			$result2=$crearsolicitud->execute();	

			//hacer update de solictud
			// if($result2){
				$sql2="UPDATE cmx_solicitudes_preestudio
						SET cliente='$cliente',
						observacion='$observacion'
						WHERE id=$id_solicitud";
				 // echo $sql2;		
			$crearsoli = $conexion->prepare($sql2);
			$result=$crearsoli->execute();	
			// }
			}

			//referencias
			$ref=$_POST["ref"];
			if($ref=='3'){
				$empresa=$_POST["edit_empre"];
				$ingreso=$_POST["edit_ingreso"];
				$retiro=$_POST["edit_retiro"];
				$persona=$_POST["edit_contacto"];
				$telefono=$_POST["edit_telefono"];
				$cargo=$_POST["edit_cargo"];
				$id=$_POST["edit_id"];
				$sqla="UPDATE cmx_referencias_preestudio
						SET nombre_empresa='$empresa',
						fecha_ingreso='$ingreso',
						fecha_retiro='$retiro',
						persona_contacto='$persona',
						celular='$telefono',
						cargo='$cargo'
						WHERE id='$id'        ";
				// echo $sqla;		
				$actualice_referencia = $conexion->prepare($sqla);
				$result=$actualice_referencia->execute();	
			}
			$return["success"]= true;
			// $return["error"] = $_msg_error;
			 return $return;
		}

		//Registrar mas referencias a una solicitud
		public function insertar_mas_referencias(){
			$_msg_error = "";
			$model    = new Conexion;
			$conexion = $model->conectar();
			$empresa=$_POST["empresa"];
			$fingreso=$_POST["fingreso"];
			$fretiro=$_POST["fretiro"];
			$contacto=$_POST["contacto"];
			$telefono=$_POST["telefono"];
			$cargo=$_POST["cargo"];
			$idsolicitud=$_POST["idpreestudio"];
			$fecha=date('Y-m-d');
			$hora=date('H:i:s');
			$user=$_SESSION["usuario"]["nom_usuario"];

			$sql="INSERT INTO cmx_referencias_preestudio
				(id,nombre_empresa,fecha_ingreso,fecha_retiro,persona_contacto,celular,cargo,consecutivo,fecha,hora,usuario,estado)
				VALUES(null,'$empresa','$fingreso','$fretiro','$contacto','$telefono','$cargo','$idsolicitud','fecha','$hora','$user','1')
			";
			$insert_referencia = $conexion->prepare($sql);
			$result=$insert_referencia->execute();
			$return["success"]= true;
			// $return["error"] = $_msg_error;
			return $return;	
		}


//cierre de la llave de la clase
}
?>