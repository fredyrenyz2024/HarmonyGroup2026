<?php

include '../application/Conexion.php';
require_once '../application/Config.php';
    session_start();
	class Vehiculos
	{
		public $user_log;
		public $pass;
		public $mensaje;
		public $respuesta;
		public $email;
		public $listado;


		public function listarVehiculos (){
			$id_usuario = $_SESSION["usuario"]["id_usuario"];
			$model    = new Conexion;
			$conexion = $model->conectar();
			$sql      = "  SELECT * FROM cmx_vehiculos";
			$consulta = $conexion->prepare($sql);
			$consulta->execute();
			$total         = $consulta->rowCount();
			$this->mensaje = $total;
			if ($total == 0) {
				$this->respuesta = "BAD";
			} else {
				$this->respuesta = "GOOD";
				while ($datos_solicitudes = $consulta->fetch()) {
					$this->listado[] = $datos_solicitudes;
				}
			}
		}

		public function crearVehiculo (){
			$_msg_error = "";
			// $return["control"] = "";
			$Data = new Consultas;

			// $arrayMinTrans = Array();
			// /******** INSERCION DE CONTENIDO DEL VEHÍCULO EN EL RNDC  ********/
			// $arrayMinTrans["solicitud"] = Array(
			// 	"tipo" => 1,
			// 	"procesoid" => 12,
			// );
			// // Variable que se envían para la realizació del proceso 
			// $arrayMinTrans["variables"] = Array(
			// 	"NUMNITEMPRESATRANSPORTE"           => MINTRANS_NIT,
			// 	"NUMPLACA"                          => $_POST["placa"],
			// 	"CODCONFIGURACIONUNIDADCARGA"       => $_POST["rndc_vehiculo_configuracion"],
			// 	"CODMARCAVEHICULOCARGA"             => $_POST["rndc_vehiculo_marca"],
			// 	"CODLINEAVEHICULOCARGA"             => $_POST["rndc_vehiculo_linea"],
			// 	"ANOFABRICACIONVEHICULOCARGA"       => $_POST["rndc_modelo"],
			// 	"CODTIPOCARROCERIA"                 => $_POST["rndc_vehiculo_carroceria"],
			// 	"CODTIPOCOMBUSTIBLE"                => $_POST["rncd_tipo_combustible"],
			// 	"PESOVEHICULOVACIO"                 => $_POST["rndc_peso_vacio"],
			// 	"CAPACIDADUNIDADCARGA"              => $_POST["rndc_capacidad_carga"],
			// 	"UNIDADMEDIDACAPACIDAD"             => 1, // Kg
			// 	"CODCOLORVEHICULOCARGA"             => $_POST["rndc_vehiculo_color"],
			// 	"CODTIPOIDPROPIETARIO"              => $Data->getRNDCTipoDocumento( $_POST["rndc_id_tipo_documento_propietario"] ),
			// 	"CODTIPOIDTENEDOR"                  => $Data->getRNDCTipoDocumento( $_POST["rndc_id_tipo_documento_tenedor"] ),
			// 	"NUMSEGUROSOAT"                     => $_POST["rndc_numero_poliza"],
			// 	"FECHAVENCIMIENTOSOAT"              => $_POST["rndc_soat_vencimiento"],
			// 	"NUMNITASEGURADORASOAT"             => $_POST["rndc_vehiculo_aseguradora"],
			// );

			// $arrayMinTrans["variables"]["NUMIDPROPIETARIO"] = $_POST["rndc_cedula_propietario"];
			// if ( $Data->getRNDCTipoDocumento( $_POST["rndc_id_tipo_documento_propietario"] ) == "N") {
			// 	$arrayMinTrans["variables"]["NUMIDPROPIETARIO"] = $_POST["rndc_cedula_propietario"] . $_POST["digito_verificacion_propietario"];
			// }
			// $arrayMinTrans["variables"]["NUMIDTENEDOR"] = $_POST["rndc_cedula_tenedor"];
			// if ( $Data->getRNDCTipoDocumento( $_POST["rndc_id_tipo_documento_tenedor"] ) == "N") {
			// 	$arrayMinTrans["variables"]["NUMIDTENEDOR"] = $_POST["rndc_cedula_tenedor"] . $_POST["digito_verificacion_tenedor"];
			// }
			// $return["crea_vehiculo_array"] = $arrayMinTrans;

			// // Se ejecuta la consulta hacia el RNDC del ministerio de transporte 
			// $result = $Data->getRNDCQueryArray( $arrayMinTrans );
			// $return["crea_vehiculo_result"] = $result;

			// // Se valida si la operación fue exitosa
			// if ( isset( $result["ErrorMSG"] ) ) {
			// 	$_flag_proceso = false;
			// 	$_msg_error.= "<p><strong>Registro no actualizado en RNDC - Vehículo.</strong></p>";
			// 	$_msg_error.= $result["ErrorMSG"];
			// }else{
			// 	$rndc_ingresoid = $result["ingresoid"];
			// 	$return["crea_vehiculo_id_crea"] = $rndc_ingresoid;
			// }

			/******** FIN - INSERCION DE CONTENIDO DEL VEHÍCULO EN EL RNDC  ********/


			// Si no hay error se procede a ingresar losdatos en la base de datos de Nexos
			// if ( !$_msg_error ) {
				// $return["control"].= "Se puede ingresar en la bse local";
					$placa = $_POST["placa"];
					$id_propietario = $_POST["id_propietario"];
					$id_tenedor = $_POST["id_tenedor"];
					$id_conductor = $_POST["id_conductor"];
					$tipo_vehiculo =  '';
					$tipo_carroceria =  $_POST["tipo_carroceria"];
					$web_satelital =  $_POST["web_satelital"];
					$usuario_satelital =  $_POST["usuario_satelital"];
					$clave_satelital =  $_POST["clave_satelital"];
					$id_usuario = $_SESSION["usuario"]["id_usuario"];
					$nom_usuario = $_SESSION["usuario"]["nom_usuario"];
					//datos cmx_detalle_vehiculo
					// $num_licencia = $_POST["num_licencia"];
					// $fecha_tarjeta_propiedad = $_POST["fecha_tarjeta_propiedad"];
					// $fechavence_tarjeta_propiedad = $_POST["fechavence_tarjeta_propiedad"];
					
					if(isset($_POST["tecnomecanica"])){
						$tecnomecanica = $_POST["tecnomecanica"];
					}else{
						$tecnomecanica ='';
					}


					$fecha_tecno = $_POST["fecha_tecno"];
					$fecha_vig_tecno = $_POST["fecha_vig_tecno"];
					//datos cmx_vehiculo2
					$configuracion = $_POST["configuracion"];
					$color  = $_POST["color"];
					$marca = $_POST["marca"];
					$linea = $_POST["linea"];
					$modelo = $_POST["modelo"];
					$carroceria  = $_POST["carroceria"];
					$tipo_combustible = $_POST["tipo_combustible"];
					$peso_vacio = $_POST["peso_vacio"];
					$numero_poliza = $_POST["numero_poliza"];
					$soat_vencimiento = $_POST["soat_vencimiento"];
					$aseguradora = $_POST["aseguradora"];
					$num_motor= $_POST["num_motor"];
					$num_chasis=$_POST["num_chasis"];
					$numero_poliza=$_POST["numero_poliza"];
					$fecha_poliza=$_POST["fecha_poliza"];
					$repotenciado=$_POST["repotenciado"];
					$tipovinculacion=$_POST["tipovinculacion"];
					$fecha_mantenimientogps=$_POST["fecha_mantenimientogps"];
					$capacidad_tn=$_POST["capacidad_tn"];
					$peso_bruto=$_POST["peso_bruto"];
					$f_matricula=$_POST["f_matricula"];
					$clase=$_POST["clase"];


					$fecha=date('Y-m-d');
					$hora=date('G:i:s');
					//DATOS DEL TRAILER
					
					if(isset($_POST["trailers"])){
						$placa_trailer=$_POST["trailers"];	
					}else{
						$placa_trailer='';
					}

					$model    = new Conexion;
					$conexion = $model->conectar(); 
					$sql= " INSERT INTO cmx_vehiculos (id,
					placa,
					 id_propietario,
					 id_tenedor,
					 id_conductor,
					 web_satelital,
					 usuario_satelital,
					 clave_satelital,
					 tipo_vehiculo,
					 tipo_carroceria,
					 estado) 
					 VALUES (null,
					 '$placa',
					 $id_propietario,
					 $id_tenedor,
					 $id_conductor,
					 '$web_satelital',
					 '$usuario_satelital',
					 '$clave_satelital',
					 '$tipo_vehiculo',
					 '$tipo_carroceria',
					 'Activo')";
					  // echo $sql;
					$crearVehiculo = $conexion->prepare($sql);
					$result=$crearVehiculo->execute();

					if ($result) {
							//consultar el id del vehiculo
							$sqlmax="SELECT MAX(id) as 'id' FROM cmx_vehiculos";
					    	$consulta_maxid = $conexion->prepare($sqlmax);
					    	$consulta_maxid->execute();
					    	$datos_vehiculo = $consulta_maxid->fetch();
					    	$id_vehiculo = $datos_vehiculo["id"];

					    	//insert en la tabla desbloqueo de vehiculo
					    	$sqlblock="INSERT INTO cmx_estado_bloqueo
							VALUES(NULL,'modificar','desbloqueado',".$id_vehiculo.",
							'vehiculo','".$fecha."','".$hora."','".$nom_usuario."'); ";
					    	$crearVehiculoe = $conexion->prepare($sqlblock);
							$result=$crearVehiculoe->execute();

					    	//ingresar datos en la tabla de cmx_vehiculos2
					    	$sql ="
					    	INSERT INTO cmx_vehiculo2
					    	(id,
					    	configuracion,
					    	marca,
					    	linea,
					    	anio_fabricacion,
					    	color,
					    	peso,
					    	cod_rndc_carroceria,
					    	num_chasis,
					    	cod_tipo_combustible,
					    	num_soat,
					    	vence_soat,
					    	aseguradora,
					    	num_motor,
					    	poliza_responsabilidad,
					    	vence_poliza,
					    	repotenciado,
					    	tipo_vinculacion,
					    	fecha_mant_gps,
					    	capacidad_tn,
					    	id_vehiculo,
					    	pesobruto_kg,
					    	f_matricula,
					    	clase_vehiculo)
					    	VALUES(null,
					    	'$configuracion',
					    	'$marca',
					    	'$linea',
					    	'$modelo',
					    	'$color',
					    	'$peso_vacio',
					    	'$carroceria',
					    	'$num_chasis',
					    	'$tipo_combustible',
					    	'$numero_poliza',
					    	'$soat_vencimiento',
					    	'$aseguradora',
					    	'$num_motor',
					    	'$numero_poliza',
					    	'$fecha_poliza',
					    	'$repotenciado',
					    	'$tipovinculacion',
					    	'$fecha_mantenimientogps',
					    	'$capacidad_tn',
					    	'$id_vehiculo',
					    	'$peso_bruto',
					    	'$f_matricula',
					    	'$clase')
					    	";
					    	$crearVehiculod = $conexion->prepare($sql);
							$result2=$crearVehiculod->execute();

							if($result2){
								// echo $sql;
								//ingresar datos en tabla cm_detalle_vehiculo
								$sql="INSERT INTO cmx_detalle_vehiculo
											(id,
											tecnomecanica,
											tecno_fecha_expedida,
											tecno_fecha_vigencia,
											id_vehiculo)
											VALUES(null,
											'$tecnomecanica',
											'$fecha_tecno',
											'$fecha_vig_tecno',
											'$id_vehiculo' )";
								$creardetalleVehiculo = $conexion->prepare($sql);
								$result3=$creardetalleVehiculo->execute();

								if($result3){

									//FOTO FRONTAL	
									// echo $sql;
									$ruta ="../public/files/vehiculos/".$id_vehiculo."/F/";     
							   		$ruta_base="public/files/vehiculos/".$id_vehiculo."/F/";
							   		$name=$_POST["name_frontal"];
									$sqlv = "UPDATE cmx_detalle_vehiculo 
									SET foto_vehiculo='$ruta_base',
										name_frontal='$name'
									 WHERE id_vehiculo = ".$id_vehiculo."";

							   		 $consulta_vehiculo= $conexion->prepare($sqlv);
							   		 $consulta_vehiculo->execute();


							   		if (!file_exists($ruta)) {
							        mkdir($ruta, 0777, true);
							   		}
								   	for ($i=0; $i< count($_FILES); $i++){
								    	if(isset($_FILES["foto_vehiculo".$i])){
								        $file = $_FILES["foto_vehiculo".$i];
								        $nombre = $file["name"];
								        $tipo = $file["type"];
								        $ruta_provisional = $file["tmp_name"];
								        $carpeta=$ruta;
								        $src=$carpeta.$nombre;
								        move_uploaded_file($ruta_provisional, $src);
								    	}
									}

									//FOTO DERECHA
									$rutad="../public/files/vehiculos/".$id_vehiculo."/D/";
									$ruta_based= "public/files/vehiculos/".$id_vehiculo."/D/";
									$named=$_POST["name_derecha"];
									$sqld="UPDATE cmx_detalle_vehiculo
											SET foto_derecha='$ruta_based',
											name_derecha='$named'
											WHERE  id_vehiculo = ".$id_vehiculo."";
									$edite_vehiculod= $conexion->prepare($sqld);
								   	$edite_vehiculod->execute();
									if (!file_exists($rutad)) {
								        mkdir($rutad, 0777, true);
								   	}
								   	for ($f=0; $f< count($_FILES); $f++){
									    	if(isset($_FILES["foto_vehiculod".$f])){
									        $file = $_FILES["foto_vehiculod".$f];
									        $nombre = $file["name"];
									        $tipo = $file["type"];
									        $ruta_provisional = $file["tmp_name"];
									        $carpeta=$rutad;
									        $src=$carpeta.$nombre;
									        move_uploaded_file($ruta_provisional, $src);
									    }
									}

								   	//FOTO IZQUIERDA
								   	$rutaiz="../public/files/vehiculos/".$id_vehiculo."/I/";
									$ruta_baseiz= "public/files/vehiculos/".$id_vehiculo."/I/";
									$name_izquierda=$_POST["name_izquierda"];
									$sqliz="UPDATE cmx_detalle_vehiculo
											SET foto_izquierda='$ruta_baseiz',
											name_izquierda='$name_izquierda'
											WHERE  id_vehiculo = ".$id_vehiculo."";
									$edite_vehiculoiz= $conexion->prepare($sqliz);
									$edite_vehiculoiz->execute();

									if (!file_exists($rutaiz)) {
								        mkdir($rutaiz, 0777, true);
								   	}

								   	for ($a=0; $a< count($_FILES); $a++){
									    	if(isset($_FILES["foto_vehiculoi".$a])){
									        $file = $_FILES["foto_vehiculoi".$a];
									        $nombre = $file["name"];
									        $tipo = $file["type"];
									        $ruta_provisional = $file["tmp_name"];
									        $carpeta=$rutaiz;
									        $src=$carpeta.$nombre;
									        move_uploaded_file($ruta_provisional, $src);
									    	}
										}


								   	//FOTO ATRÁS
								   	$rutat="../public/files/vehiculos/".$id_vehiculo."/A/";
									$ruta_baset="public/files/vehiculos/".$id_vehiculo."/A/";
									$name_at=$_POST["name_atras"];
								   	$sqlat="UPDATE cmx_detalle_vehiculo
								   			SET foto_atras='$ruta_baset',
								   			name_atras='$name_at'
								   			WHERE id_vehiculo = ".$id_vehiculo."";
								   	$edite_vehiculoat= $conexion->prepare($sqlat);
									$edite_vehiculoat->execute();		

									if (!file_exists($rutat)) {
								        mkdir($rutat, 0777, true);
								   	}

								   	for ($b=0; $b< count($_FILES); $b++){
									    	if(isset($_FILES["foto_vehiculoa".$b])){
									        $file = $_FILES["foto_vehiculoa".$b];
									        $nombre = $file["name"];
									        $tipo = $file["type"];
									        $ruta_provisional = $file["tmp_name"];
									        $carpeta=$rutat;
									        $src=$carpeta.$nombre;
									        move_uploaded_file($ruta_provisional, $src);
									    }
									}

									//foto soat
									$rutaso="../public/files/vehiculos/".$id_vehiculo."/SO/";
									$ruta_baseso="public/files/vehiculos/".$id_vehiculo."/SO/";
									$name_s=$_POST["name_soat"];
										$sqlas="UPDATE cmx_detalle_vehiculo
								   			SET foto_soat='$ruta_baseso',
								   			name_soat='$name_s'
								   			WHERE id_vehiculo = ".$id_vehiculo."";
								   	$edite_vehiculoso= $conexion->prepare($sqlas);
									$edite_vehiculoso->execute();	

									if (!file_exists($rutaso)) {
								        mkdir($rutaso, 0777, true);
								   	}

								   	 for ($m=0; $m< count($_FILES); $m++){
									    	if(isset($_FILES["foto_soat".$m])){
									        $file = $_FILES["foto_soat".$m];
									        $nombre = $file["name"];
									        $tipo = $file["type"];
									        $ruta_provisional = $file["tmp_name"];
									        $carpeta=$rutaso;
									        $src=$carpeta.$nombre;
									        move_uploaded_file($ruta_provisional, $src);
									    }
									}
									//foto tecnomecanica
									$rutate="../public/files/vehiculos/".$id_vehiculo."/TECNO/";
									$ruta_basete="public/files/vehiculos/".$id_vehiculo."/TECNO/";
									$name_at=$_POST["name_tecno"];
								   	$sqlte="UPDATE cmx_detalle_vehiculo
								   			SET foto_tecno='$ruta_basete',
								   			name_tecno='$name_at'
								   			WHERE id_vehiculo = ".$id_vehiculo."";
								   	$edite_vehiculote= $conexion->prepare($sqlte);
									$edite_vehiculote->execute();			

									if (!file_exists($rutate)) {
								        mkdir($rutate, 0777, true);
								   	}

								   	for ($n=0; $n< count($_FILES); $n++){
									    	if(isset($_FILES["foto_tecno".$n])){
									        $file = $_FILES["foto_tecno".$n];
									        $nombre = $file["name"];
									        $tipo = $file["type"];
									        $ruta_provisional = $file["tmp_name"];
									        $carpeta=$rutate;
									        $src=$carpeta.$nombre;
									        move_uploaded_file($ruta_provisional, $src);
									    }
									}

									//INSERTAR EL TRAILER el historico y actualizar el estado del trailer
									if($_POST["trailers"]!=''){
										// echo "entro a trailer";
										$sqlt="
										INSERT INTO cmx_trailer_vehiculo(id,id_vehiculo,id_trailer,estado,fecha,hora,usuario)
										VALUES(NULL,'$id_vehiculo','$placa_trailer','1','$fecha','$hora','$id_usuario')
										";
										// echo $sqlt;
										$crear_trailer = $conexion->prepare($sqlt);
										$result=$crear_trailer->execute();
										$sqlut="
											UPDATE cmx_trailer 
											SET estado_solicitud='Asignado'
											WHERE id='$placa_trailer'
										";
										$update_trailer = $conexion->prepare($sqlut);
										$result=$update_trailer->execute();
									
									}
									//CRECION DEL log
									$sqll = " INSERT INTO cmx_log_vehiculos 
									(id_vehiculo,
									id_usuario,
									operacion, 
									fecha_hora_operacion) 
									VALUES ((SELECT MAX(id) FROM cmx_vehiculos),
									$id_usuario,
									'Crear',
									NOW()) ";
									$crear_oper_vehi = $conexion->prepare($sqll);
									$result=$crear_oper_vehi->execute();

									$sqlc = " INSERT INTO cmx_calificacion_vehiculos_servicios
									 (id_vehiculo, calificacion,fecha_hora_operacion) 
									 VALUES ((SELECT MAX(id) FROM cmx_vehiculos),0,NOW()) ";
									$crear_calificacion = $conexion->prepare($sqlc);
									$crear_calificacion->execute();
									 // echo $sqlc;	
									//historial
									$sqlh = "INSERT INTO cmx_asignar_conductorvehiculo
											(id,cod_vehiculo,cod_conductor,estado,fecha_anterior,fecha_actual)VALUES(NULL,'$placa','$id_conductor','0','$fecha','$fecha')";
									$crearhistorial= $conexion->prepare($sqlh);
									$crearhistorial->execute();
									//SUCCESS

									$return["success"]= true;
									


								}else{
									$return['success'] = false;
									$_msg_error.= "<p>Error al generar la solicitud, por favor revisé los siguientes datos tecnomecanica, fecha vencimiento de tecnomecanica o fecha de vigencia .</p>";
								}
							}else{
								$return['success'] = false;
								$_msg_error.= "<p>Error al generar la solicitud, por favor revisé los siguientes datos: configuracón, marca, linea, modelo, color , pesos, carroceria , soat, aseguradora, clase .</p>";
							}		
					// } else {
					// 	$return['success'] = false;
					// 	$_msg_error.= "<p>Error al generar la solicitud.</p>";
					// }
				}else{
					 $return['success'] = false;
					 $_msg_error.= "<p>Error al generar la solicitud, por favor revisé los siguientes datos placa, datos de satelital, tipo de carroceria.</p>";
				}
				
			// }
			$return["error"] = $_msg_error;
			return $return;
			// $return["result"] = $result["rowsData"];
			// echo json_encode($return);
		}

		public function CrearTrailer(){
			$_msg_error = "";
			// $return["control"] = "";
			$Data = new Consultas;
			$model    = new Conexion;
			$conexion = $model->conectar();

			if(empty($_POST["placa_trailer"])){
					$placa_trailer = '';
				}else{
					if(isset($_POST["placa_trailer"])){
					$placa_trailer = $_POST["placa_trailer"];
					}else{
					$placa_trailer = '';
				}
				if(isset($_POST["T_marca"])){
					$marca_trailer= $_POST["T_marca"];
				}else{
					$marca_trailer='';
				}
				if(isset($_POST["T_peso"])){
					$peso_trailer= $_POST["T_peso"];
				}else{
					$peso_trailer='';
				}
				if(isset($_POST["T_alto"])){
					$alto_trailer= $_POST["T_alto"];
				}else{
					$alto_trailer='';
				}
				if(isset($_POST["T_volumen"])){
					$volumen_trailer= $_POST["T_volumen"];
				}else{
					$volumen_trailer='';
				}
				
				if(isset($_POST["T_tramite"])){
					$tramite_trailer= $_POST["T_tramite"];
				}else{
					$tramite_trailer='';
				}
				if(isset($_POST["T_chasis"])){
					$chasis_trailer= $_POST["T_chasis"];
				}else{
					$chasis_trailer='';
				}
				if(isset($_POST["T_configuracion"])){
					$config_trailer= $_POST["T_configuracion"];
				}else{
					$config_trailer='';
				}
				if(isset($_POST["T_modelo"])){
					$modelo_trailer= $_POST["T_modelo"];
				}else{
					$modelo_trailer='';
				}
				if(isset($_POST["T_ancho"])){
					$ancho_trailer= $_POST["T_ancho"];
				}else{
					$ancho_trailer='';
				}
				if(isset($_POST["T_largo"])){
					$largo_trailer=$_POST["T_largo"];
				}else{
					$largo_trailer='';
				}
				if(isset($_POST["T_capacidad"])){
					$capacidad_trailer= $_POST["T_capacidad"];
				}else{
					$capacidad_trailer='';
				}
				if(isset($_POST["T_carroceria"])){
					$carroceria_trailer= $_POST["T_carroceria"];
				}else{
					$carroceria_trailer='';
				}
				if(isset($_POST["T_caracteristicas"])){
					$carac_trailer= $_POST["T_caracteristicas"];
				}else{
					$carac_trailer='';
				}
				if(isset($_POST["T_propietario"])){
					$propietario_trailer= $_POST["T_propietario"];
				}else{
					$propietario_trailer='';
				}
				if(isset($_POST["T_civil"])){
					$civil_trailer=$_POST["T_civil"];
				}else{
					$civil_trailer='';
				}
				if(isset($_POST["T_aseguradora"])){
					$asegura_trailer=$_POST["T_aseguradora"];
				}else{
					$asegura_trailer='';
				}
				if(isset($_POST["T_fechavence"])){
					$vence_trailer=$_POST["T_fechavence"];
				}else{
					$vence_trailer='';
				}

				$estado='Activo';
				$fecha=date('Y-m-d');
				$hora=date('G:i:s');
				$id_usuario = $_SESSION["usuario"]["id_usuario"];
				$operacion='Crear';
				}

			
						$sql="
					INSERT INTO cmx_trailer(id,
					placa,
					marca,
					peso_vacio,
					alto,
					volumen,
					tipo_tramite,
					serie_chasis,
					configuracion,
					modelo,
					ancho,
					largo,
					capacidad,
					carroceria,
					caracteristica,
					numero_civil,
					aseguradora,
					fecha_vence,
					doc_propietario,
					estado)
					VALUES(NULL,
					'$placa_trailer',
					'$marca_trailer',
					'$peso_trailer',
					'$alto_trailer',
					'$volumen_trailer',
					'$tramite_trailer',
					'$chasis_trailer',
					'$config_trailer',
					'$modelo_trailer',
					'$ancho_trailer',
					'$largo_trailer',
					'$capacidad_trailer',
					'$carroceria_trailer',
					'$carac_trailer',
					'$civil_trailer',
					'$asegura_trailer',
					'$vence_trailer',
					'$propietario_trailer',
					'$estado'
					)
				";
				// echo $sql;
				$crear_trailer = $conexion->prepare($sql);
				$result=$crear_trailer->execute();

				$sqlmax="SELECT MAX(id) as 'id' FROM cmx_trailer";
			    $consulta_maxid = $conexion->prepare($sqlmax);
			    $consulta_maxid->execute();
			    $datos_trailer = $consulta_maxid->fetch();
			    $id_trailer = $datos_trailer["id"];

				//INSERTAR FOTOS DEL TRAILER
				$ruta_trailer = "../public/files/vehiculos/trailer/".$id_trailer."/";     
			   	$ruta_base_t= "public/files/vehiculos/trailer/".$id_trailer."/";
			   	$sqlt = "UPDATE cmx_trailer
					SET foto_trailer = '$ruta_base_t' WHERE id = ".$id_trailer."";
			   	$consulta_trailer= $conexion->prepare($sqlt);
			   	$consulta_trailer->execute();
			   	if (!file_exists($ruta_trailer)) {
			        mkdir($ruta_trailer, 0777, true);
			   	}
			   	for ($m=0; $m< count($_FILES); $m++){
			    if(isset($_FILES["foto_trailer".$m])){
			        $file = $_FILES["foto_trailer".$m];
			        $nombre = $file["name"];
			        $tipo = $file["type"];
			        $ruta_provisional = $file["tmp_name"];
			        $carpeta=$ruta_trailer;
			        $src=$carpeta.$nombre;
			        move_uploaded_file($ruta_provisional, $src);
			    	}
				}

				if($result){
					//LOG DEL TRAILER
					$sql="INSERT INTO cmx_log_trailers
					(id, id_trailer, id_usuario, operacion, fecha, hora)VALUES(NULL,' $id_trailer','$id_usuario','$operacion','$fecha','$hora');
					";
					// echo $sql;
					$crear_trailer = $conexion->prepare($sql);
					$result=$crear_trailer->execute();

				}

				$return["success"]= true;
			// }
			 $return["error"] = $_msg_error;
			return $return;

		}

		public function verVehiculo (){
			$id_vehiculo = $_POST["id_vehiculo"];
			$_msg_error = "";
			$Data = new Consultas;

			$sql = "
				SELECT  
					cla.clase,dv.*,cf.nombre AS sigla_c, cf.descripcion AS des_c,cv.*,cdv.*,
					tra.placa AS 'placa_trailer',
					IF( ( SELECT COUNT(cp1.id) FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_propietario ) > 0,
						( SELECT cp1.rndc_id FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_propietario ), 
						NULL
					) 'rndc_propietario',
					IF( ( SELECT COUNT(cp1.id) FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_propietario ) > 0,
						( SELECT cp1.tipo_documento FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_propietario ), 
						NULL
					) 'tipo_documento_propietario',
					IF( ( SELECT COUNT(cp1.id) FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_propietario ) > 0,
						( SELECT cp1.numero_documento FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_propietario ), 
						NULL
					) 'documento_propietario',
					IF( ( SELECT COUNT(cp1.id) FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_propietario ) > 0,
						( SELECT cp1.digito_verificacion FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_propietario ), 
						NULL
					) 'digito_verificacion_propietario',
					IF( ( SELECT COUNT(cp1.id) FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_propietario ) > 0,
						( SELECT cp1.nombre FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_propietario ), 
						NULL
					) 'nombre_propietario',
					IF( ( SELECT COUNT(cp1.id) FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_tenedor ) > 0,
						( SELECT cp1.rndc_id FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_tenedor ), 
						NULL
					) 'rndc_tenedor',
					IF( ( SELECT COUNT(cp1.id) FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_tenedor ) > 0,
						( SELECT cp1.tipo_documento FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_tenedor ), 
						NULL
					) 'tipo_documento_tenedor',
					IF( ( SELECT COUNT(cp1.id) FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_tenedor ) > 0,
						( SELECT cp1.numero_documento FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_tenedor ), 
						NULL
					) 'documento_tenedor',
					IF( ( SELECT COUNT(cp1.id) FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_tenedor ) > 0,
						( SELECT cp1.digito_verificacion FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_tenedor ), 
						NULL
					) 'digito_verificacion_tenedor',
					IF( ( SELECT COUNT(cp1.id) FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_tenedor ) > 0,
						( SELECT cp1.nombre FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_tenedor ), 
						NULL
					) 'nombre_tenedor',
					IF( ( SELECT COUNT(cp1.id) FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_conductor ) > 0,
						( SELECT cp1.rndc_id FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_conductor ), 
						NULL
					) 'rndc_conductor',
					IF( ( SELECT COUNT(cp1.id) FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_conductor ) > 0,
						( SELECT cp1.tipo_documento FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_conductor ), 
						NULL
					) 'tipo_documento_conductor',
					IF( ( SELECT COUNT(cp1.id) FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_conductor ) > 0,
						( SELECT cp1.numero_documento FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_conductor ), 
						NULL
					) 'documento_conductor',
					IF( ( SELECT COUNT(cp1.id) FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_conductor ) > 0,
						( SELECT cp1.digito_verificacion FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_conductor ), 
						NULL
					) 'digito_verificacion_conductor',
					IF( ( SELECT COUNT(cp1.id) FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_conductor ) > 0,
						( SELECT cp1.nombre FROM cmx_proveedores cp1 WHERE cp1.id = cv.id_conductor ), 
						NULL
					) 'nombre_conductor'
				FROM
					cmx_vehiculos cv
					LEFT JOIN cmx_vehiculo2 dv
					ON cv.id=dv.id_vehiculo 
					INNER JOIN cmx_rndc_vehiculos_configuracion cf
					ON dv.configuracion=cf.id
					LEFT JOIN cmx_rndc_clase_vehiculo cla	
					ON dv.clase_vehiculo=cla.id
					LEFT JOIN cmx_detalle_vehiculo cdv
					ON cv.id=cdv.id_vehiculo
					LEFT JOIN cmx_trailer_vehiculo trav
					ON cv.id=trav.id_vehiculo
					LEFT JOIN  cmx_trailer tra
					ON trav.id_trailer=tra.id
				WHERE 
					cv.id = $id_vehiculo
				GROUP BY cv.id	
			";
			$buscar_vehiculo = $Data->getConsulta($sql);
			$datos_vehiculos = $buscar_vehiculo["rowsData"][0];

			// if ($buscar_vehiculo) {
			// 	$datos_vehiculos = $buscar_vehiculo["rowsData"][0];

			  //       	$sql = " 
					// 		SELECT * 
					// 		FROM cmx_tipo_vehiculos 
					// 		WHERE 
					// 			id = " . $buscar_vehiculo["rowsData"][0]["tipo_vehiculo"] . " 
					// 		LIMIT 1
			  //           ";
			  //           $result = $Data->getConsulta($sql);

			  //           $datos_vehiculos["tipo_vehiculo"] = "";
			  //           $datos_vehiculos["id_tipo_vehiculo"] = "";
			  //           if ( isset($result) ) {
					// 		$datos_vehiculos["tipo_vehiculo"] = $result["rowsData"][0]["nombre"];
					// 		$datos_vehiculos["id_tipo_vehiculo"] = $result["rowsData"][0]["id"];
					// 		$datos_vehiculos["tipo_vehiculo_peso"] = $result["rowsData"][0]["peso_maximo"];
					// 	}

			  //           // Se pregunta si el vehículo ya está registrado en el RNDC
			  //           if ( $buscar_vehiculo["rowsData"][0]["rndc_id"] ) {
			  //               // Si ya existe en el RNDC se busca la información 

			  //               $arrayMinTrans = Array();
			  //               // Solicitud
			  //               $arrayMinTrans["solicitud"] = Array(
			  //                   "tipo" => 3,
			  //                   "procesoid" => 12,
			  //               );
			  //               // Variable que se envían para la consulta  
			  //               $arrayMinTrans["variables"] = "INGRESOID,FECHAING,NUMNITEMPRESATRANSPORTE,NUMPLACA,CODCONFIGURACIONUNIDADCARGA,CODMARCAVEHICULOCARGA,CODLINEAVEHICULOCARGA,ANOFABRICACIONVEHICULOCARGA,CODTIPOIDPROPIETARIO,NUMIDPROPIETARIO,CODTIPOIDTENEDOR,NUMIDTENEDOR,CODTIPOCOMBUSTIBLE,PESOVEHICULOVACIO,CAPACIDADUNIDADCARGA,CODCOLORVEHICULOCARGA,CODTIPOCARROCERIA,NUMNITASEGURADORASOAT,FECHAVENCIMIENTOSOAT,NUMSEGUROSOAT,UNIDADMEDIDACAPACIDAD";

			  //               $arrayMinTrans["documento"] = Array(
			  //                   "NUMNITEMPRESATRANSPORTE"   => MINTRANS_NIT,
			  //                   "INGRESOID"                 => "'" . $buscar_vehiculo["rowsData"][0]["rndc_id"] . "'"
			  //               );
			  //               // $return["rndc_array"] = $arrayMinTrans;

			  //               $result = $Data->getRNDCQueryArray( $arrayMinTrans );
			  //               if ( !isset( $result["ErrorMSG"] ) ) {
			  //                   $datos_vehiculos["rndc_result"] = $result["documento"];
			  //                   // Se toman los datos necesarios para llenado de campos RNDC

			  //                   // Se busca la informacion del codconfiguracionunidadcarga
			  //                   $sql = '
			  //                       SELECT 
			  //                           *, CONCAT(crvc.nombre, " - " , crvc.descripcion) NOMBRE
			  //                       FROM  
			  //                           cmx_rndc_vehiculos_configuracion crvc
			  //                       WHERE 
			  //                           crvc.rndc_id = ' . $result["documento"]["codconfiguracionunidadcarga"] . '
			  //                   ';
			  //                   $rndc_result = $Data->getConsulta($sql);
			  //                   $datos_vehiculos["rndc_result"]["rndc_vehiculo_configuracion"] = $rndc_result["rowsData"][0];

			  //                   // Se busca la informacion del CODCOLORVEHICULOCARGA
			  //                   $sql = '
			  //                       SELECT 
			  //                           *
			  //                       FROM  
			  //                           cmx_rndc_vehiculos_color crvc
			  //                       WHERE 
			  //                           crvc.rndc_id = ' . $result["documento"]["codcolorvehiculocarga"] . '
			  //                   ';
			  //                   $rndc_result = $Data->getConsulta($sql);
			  //                   $datos_vehiculos["rndc_result"]["rndc_vehiculo_color"] = $rndc_result["rowsData"][0];

			  //                   // Se busca la informacion del CODMARCAVEHICULOCARGA
			  //                   $sql = '
			  //                       SELECT 
			  //                           *
			  //                       FROM  
			  //                           cmx_rndc_vehiculos_marcas crvm
			  //                       WHERE 
			  //                           crvm.rndc_id = ' . $result["documento"]["codmarcavehiculocarga"] . '
			  //                   ';
			  //                   $rndc_result = $Data->getConsulta($sql);
			  //                   $datos_vehiculos["rndc_result"]["rndc_vehiculo_marca"] = $rndc_result["rowsData"][0];

			  //                   // Se busca la informacion del CODLINEAVEHICULOCARGA
			  //                   $sql = '
			  //                       SELECT 
			  //                           *
			  //                       FROM  
			  //                           cmx_rndc_vehiculos_linea crvl
			  //                       WHERE 
			  //                           crvl.rndc_id = ' . $result["documento"]["codlineavehiculocarga"] . '
			  //                   ';
			  //                   $rndc_result = $Data->getConsulta($sql);
			  //                   $datos_vehiculos["rndc_result"]["rndc_vehiculo_linea"] = $rndc_result["rowsData"][0];

			  //                   // Se busca la informacion del CODTIPOCARROCERIA
			  //                   $sql = '
			  //                       SELECT 
			  //                           *
			  //                       FROM  
			  //                           cmx_rndc_vehiculos_carroceria crvtc
			  //                       WHERE 
			  //                           crvtc.rndc_id = ' . $result["documento"]["codtipocarroceria"] . '
			  //                   ';
			  //                   $rndc_result = $Data->getConsulta($sql);
			  //                   $datos_vehiculos["rndc_result"]["rndc_vehiculo_carroceria"] = $rndc_result["rowsData"][0];

			  //                   // Se busca la informacion del NUMNITASEGURADORASOAT
			  //                   $sql = '
			  //                       SELECT 
			  //                           *
			  //                       FROM
			  //                           cmx_rndc_aseguradoras cra
			  //                       WHERE 
			  //                           cra.rndc_id = ' . $result["documento"]["numnitaseguradorasoat"] . '
			  //                   ';
			  //                   $rndc_result = $Data->getConsulta($sql);
			  //                   $datos_vehiculos["rndc_result"]["rndc_vehiculo_aseguradora"] = $rndc_result["rowsData"][0];
					// 		}else{
					// 			$_msg_error.= $result["ErrorMSG"];
					// 		}
			  //           }

			  //           
			  //       } else {
			        //     $return['success'] = false;
			        //     $_msg_error.= "Error al generar la solicitud";
			        // }
			$return['success'] = true;
		  	$return['content']= $datos_vehiculos;
			// $return['error'] = $_msg_error;
	        return $return;
	    }  

	    public function verVehiculoPlaca(){
	        $Data = new Consultas;
	        $sql = '
	            SELECT 
	                *
	            FROM 
	                cmx_vehiculos cv
	            WHERE 
	                cv.placa = "' . $_POST["placa"] . '"
	        ;';
	        $result = $Data->getConsulta($sql);

	        if ( $result ) {
	            $return["success"]= true;
	            foreach ($result["rowsData"] as $key => $value) {
	                $return["content"][]= $value;
	            }
	        }else{
	            $return["success"]= false;
	        }
	        return $return;
	    }  

	    public function TraerSatelital(){
	    	 $Data = new Consultas;
	        $sql = '
	             SELECT 
	                *
	            FROM cmx_vehiculos_preestudio cv
	                
	            WHERE 
	            cv.placa_vehiculo= "' . $_POST["placa"] . '";
	        ';
	        $result = $Data->getConsulta($sql);

	        if ( $result ) {
	            $return["success"]= true;
	            foreach ($result["rowsData"] as $key => $value) {
	                $return["content"][]= $value;
	            }
	        }else{
	            $return["success"]= false;
	        }
	        return $return;
	    } 


	    public function verdatosActivarVehiculo (){
	        $id_usuario = $_SESSION["usuario"]["id_usuario"];
	        $id_vehiculo = $_POST["id_vehiculo"];
	        $model    = new Conexion;
	        $conexion = $model->conectar();
	        $sql      = "   SELECT * 
	                        FROM cmx_vehiculos 
	                        WHERE id = $id_vehiculo ";
	        $buscar_vehiculo = $conexion->prepare($sql);
	        $buscar_vehiculo->execute();
	        $total         = $buscar_vehiculo->rowCount();
	        $datos_vehiculos = $buscar_vehiculo->fetch();
	        if ($buscar_vehiculo) {
	            $return['success'] = true;
	            $return['content']= $datos_vehiculos;
	        } else {
	            $return['success'] = false;
	            $return['error'] = "Error al generar la solicitud";
	        }
	        return $return;
	    } 

	    public function editarvehiculonew(){
	    	// echo 'entro a EDITAR VEHICULO';
	    	$_msg_error = "";
			$return["control"] = "";
			$Data = new Consultas;

			//datos cmx_vehiculos
			$idusuario =$_POST["idusuario"];
			$id_vehiculo = $_POST["id_vehiculo"];
			$placa = $_POST["placa"];
			$tipo_vehiculo = '';
			$nsoat= $_POST["nsoat"];
			$fechavence = $_POST["fechavence"];
			$asegura = $_POST["asegura"];
			$tecno = $_POST["tecno"];
			$expetecno = $_POST["expetecno"];
			$vigentecno = $_POST["vigentecno"];
			$web = $_POST["web"];
			$user = $_POST["user"];
			$clave = $_POST["clave"];
			
			// $licencia = $_POST["licencia"];
			// $expelicencia = $_POST["expelicencia"];
			// $vencelicencia = $_POST["vencelicencia"];
			$docpropi = $_POST["docpropi"];
			$doctenedor = $_POST["doctenedor"];
			$docconductor = $_POST["docconductor"];
			// $e_ruta_vehiculo = $_POST["e_ruta_vehiculo"];
			// $e_ruta_trailer = $_POST["e_ruta_trailer"];
			$e_num_motor = $_POST["e_num_motor"];
			$e_num_chasis = $_POST["e_num_chasis"];	
			$e_numerito_poliza = $_POST["e_numerito_poliza"];
			$e_fecha_poliza = $_POST["e_fecha_poliza"];
			$e_repotenciado = $_POST["e_repotenciado"];
			$e_tipovinculacion = $_POST["e_tipovinculacion"];
			$e_fecha_mantenimientogps = $_POST["e_fecha_mantenimientogps"];
			$e_capacidad_tn = $_POST["e_capacidad_tn"];
			$e_bruto_kg=$_POST["e_bruto_kg"];
			$e_fecha_matricula=$_POST["e_fecha_matricula"];


			$e_configuracion= $_POST["e_configuracion"];
			$e_color=$_POST["e_color"];
			$e_marca=$_POST["e_marca"];
			$e_linea=$_POST["e_linea"];
			$e_modelo=$_POST["e_modelo"];
			$e_tipo_combustible=$_POST["e_tipo_combustible"];
			$e_clasevehiculo=$_POST["e_clasevehiculo"];
			$e_tipo_carroceria=$_POST["e_tipo_carroceria"];
			$e_carroceria=$_POST["e_carroceria"];
			$e_peso_vacio=$_POST["e_peso_vacio"];

			//fotos del vehiculo
			
			if(isset($_POST["newso"])){
				$newso=$_POST["newso"];
			}

			if(isset($_POST["newte"])){
				$newte=$_POST["newte"];
			}

			if(isset($_POST["newavf"])){
				$newavf=$_POST["newavf"];
			}

			if(isset($_POST["newavd"])){
				$newavd=$_POST["newavd"];
			}

			if(isset($_POST["newavi"])){
				$newavi=$_POST["newavi"];
			}

			if(isset($_POST["newava"])){
				$newava=$_POST["newava"];
			}

			//datos trailer
			 $placat = $_POST["placat"];
			 if($placat=='nada'){

			 	$placat='';

			 }else if($placat!=''){
			 	//trailer nuevo 
			 	$placat = $_POST["placat"];

			 	if($_POST["trailer_anterior"]){
			 		$trailer_anterior=$_POST["trailer_anterior"];
			 	}else{
			 		$trailer_anterior='';
			 	}

			 }

		
			$fecha=date('Y-m-d');
			$hora=date('G:i:s');
			$datetime=$fecha . $hora;
			$model    = new Conexion;
			$conexion = $model->conectar(); 
			//datos de la tabla vehiculo
			 $sql="
			 	UPDATE cmx_vehiculos SET  
			 	id_propietario='".$docpropi."',
			 	id_tenedor='".$doctenedor."',
			 	id_conductor='".$docconductor."',
			 	tipo_vehiculo='".$tipo_vehiculo."',
			 	web_satelital='".$web."',
			 	usuario_satelital='".$user."',
			 	clave_satelital='".$clave."',
			 	tipo_carroceria='".$e_tipo_carroceria."'
			 	WHERE id=".$id_vehiculo.";

			 ";
			  // echo $sql;
			 $editarVehiculo = $conexion->prepare($sql);
			$result=$editarVehiculo->execute();
			//DOCUMENTOS MOVER Y ACTUALIZAR

			//datos de la tabla cmx_detalle_vehiculo
				
				$foto_caro1 ="../public/files/vehiculos/".$id_vehiculo."/F/";
				$foto_caro2 ="public/files/vehiculos/".$id_vehiculo."/F/";
				
				$foto_dere1="../public/files/vehiculos/".$id_vehiculo."/D/";
				$foto_dere2="public/files/vehiculos/".$id_vehiculo."/D/";

				$foto_iz1="../public/files/vehiculos/".$id_vehiculo."/I/";
				$foto_iz2="public/files/vehiculos/".$id_vehiculo."/I/";

				$foto_at1="../public/files/vehiculos/".$id_vehiculo."/A/";
				$foto_at2="public/files/vehiculos/".$id_vehiculo."/A/";

				$foto_soat1="../public/files/vehiculos/".$id_vehiculo."/SO/";
				$foto_soat2="public/files/vehiculos/".$id_vehiculo."/SO/";

				$foto_tecno1="../public/files/vehiculos/".$id_vehiculo."/TECNO/";
				$foto_tecno2="public/files/vehiculos/".$id_vehiculo."/TECNO/";


			  $sql2="
			 	UPDATE cmx_detalle_vehiculo SET 
			 	 tecnomecanica='".$tecno."',
			 	 tecno_fecha_expedida='".$expetecno."',
			 	 tecno_fecha_vigencia='".$vigentecno."',
			 	 foto_vehiculo='".$foto_caro2."',
			 	 foto_derecha='".$foto_dere2."',
			 	 foto_izquierda='".$foto_iz2."',
			 	 foto_atras='".$foto_at2."',
			 	 foto_soat='".$foto_soat2."',
			 	 foto_tecno='".$foto_tecno2."'
			 	 WHERE id_vehiculo=".$id_vehiculo.";
			 ";
			  //echo $sql2;
			$editarfoto= $conexion->prepare($sql2);
			$result=$editarfoto->execute();
			//TRASLADAR ARCHIVOS
			if(file_exists($foto_caro1)	&& $newavf!=''){
				$aleatorio1=rand(10000,90000);
				$aleatorio2=rand(10000,90000);
				$nom2=$aleatorio1.$newavf.$aleatorio2;

				$sql="UPDATE cmx_detalle_vehiculo
				SET name_frontal='".$nom2."'
				WHERE id_vehiculo=".$id_vehiculo." ";

				$editarVehiculo2 = $conexion->prepare($sql);
				$result=$editarVehiculo2->execute();

				//mover
				for ($i=0; $i< count($_FILES); $i++){
			    	if(isset($_FILES["e_foto_vehiculo".$i])){
			        $file = $_FILES["e_foto_vehiculo".$i];
			        $nombre =$aleatorio1.$file["name"].$aleatorio2;
			        $tipo = $file["type"];
			        $ruta_provisional = $file["tmp_name"];
			        $carpeta=$foto_caro1;
			        $src=$carpeta.$nombre;
			        move_uploaded_file($ruta_provisional, $src);
			    	}
				}
			}


			if(file_exists($foto_dere1) && $newavd!=''){
				$aleatorio1=rand(10000,90000);
				$aleatorio2=rand(10000,90000);
				$nom2=$aleatorio1.$newavd.$aleatorio2;

				$sqld="UPDATE cmx_detalle_vehiculo
				SET name_derecha='".$nom2."'
				WHERE id_vehiculo=".$id_vehiculo." ";
				$editarVehiculo3 = $conexion->prepare($sqld);
				$result=$editarVehiculo3->execute();

				for ($d=0; $d< count($_FILES); $d++){
			    	if(isset($_FILES["f_derecha".$d])){
			        $file = $_FILES["f_derecha".$d];
			        $nombre =$aleatorio1.$file["name"].$aleatorio2;
			        $tipo = $file["type"];
			        $ruta_provisional = $file["tmp_name"];
			        $carpeta=$foto_dere1;
			        $src=$carpeta.$nombre;
			        move_uploaded_file($ruta_provisional, $src);
			    	}
				}

			}

			if(file_exists($foto_iz1) && $newavi!=''){
				$aleatorio1=rand(10000,90000);
				$aleatorio2=rand(10000,90000);
				$nom2=$aleatorio1.$newavi.$aleatorio2;

				$sql="UPDATE cmx_detalle_vehiculo
				SET name_izquierda='".$nom2."'
				WHERE id_vehiculo=".$id_vehiculo." ";
				$editarVehiculo4 = $conexion->prepare($sql);
				$result=$editarVehiculo4->execute();

				for ($m=0; $m< count($_FILES); $m++){
			    	if(isset($_FILES["f_izquierda".$m])){
			        $file = $_FILES["f_izquierda".$m];
			        $nombre =$aleatorio1.$file["name"].$aleatorio2;
			        $tipo = $file["type"];
			        $ruta_provisional = $file["tmp_name"];
			        $carpeta=$foto_iz1;
			        $src=$carpeta.$nombre;
			        move_uploaded_file($ruta_provisional, $src);
			    	}
				}
			}

			if(file_exists($foto_at1) &&  $newava!=''){
				$aleatorio1=rand(10000,90000);
				$aleatorio2=rand(10000,90000);
				$nom2=$aleatorio1.$newava.$aleatorio2;

				$sql="UPDATE cmx_detalle_vehiculo
				SET name_atras='".$nom2."'
				WHERE id_vehiculo=".$id_vehiculo." ";
				$editarVehiculo5 = $conexion->prepare($sql);
				$result=$editarVehiculo5->execute();

				for ($a=0; $a< count($_FILES); $a++){
			    	if(isset($_FILES["f_atras".$a])){
			        $file = $_FILES["f_atras".$a];
			        $nombre =$aleatorio1.$file["name"].$aleatorio2;
			        $tipo = $file["type"];
			        $ruta_provisional = $file["tmp_name"];
			        $carpeta=$foto_at1;
			        $src=$carpeta.$nombre;
			        move_uploaded_file($ruta_provisional, $src);
			    	}
				}
			}

			if(file_exists($foto_soat1) && $newso!=''){
				$aleatorio1=rand(10000,90000);
				$aleatorio2=rand(10000,90000);
				$nom2=$aleatorio1.$newso.$aleatorio2;

				$sql="UPDATE cmx_detalle_vehiculo
				SET name_soat='".$nom2."'
				WHERE id_vehiculo=".$id_vehiculo." ";
				$editarVehiculo6 = $conexion->prepare($sql);
				$result=$editarVehiculo6->execute();

				for ($s=0; $s< count($_FILES); $s++){
			    	if(isset($_FILES["f_soat".$s])){
			        $file = $_FILES["f_soat".$s];
			        $nombre =$aleatorio1.$file["name"].$aleatorio2;
			        $tipo = $file["type"];
			        $ruta_provisional = $file["tmp_name"];
			        $carpeta=$foto_soat1;
			        $src=$carpeta.$nombre;
			        move_uploaded_file($ruta_provisional, $src);
			    	}
				}
			}

			if(file_exists($foto_tecno1) && $newte!=''){
				
				$aleatorio1=rand(10000,90000);
				$aleatorio2=rand(10000,90000);
				$nom2=$aleatorio1.$newte.$aleatorio2;

				$sql="UPDATE cmx_detalle_vehiculo
				SET name_tecno='".$nom2."'
				WHERE id_vehiculo=".$id_vehiculo." ";
			

				$editarVehiculo7 = $conexion->prepare($sql);
				$result=$editarVehiculo7->execute();


				for ($t=0; $t< count($_FILES); $t++){
			    	if(isset($_FILES["f_tecno".$t])){
			        $file = $_FILES["f_tecno".$t];
			        $nombre =$aleatorio1.$file["name"].$aleatorio2;
			        $tipo = $file["type"];
			        $ruta_provisional = $file["tmp_name"];
			        $carpeta=$foto_tecno1;
			        $src=$carpeta.$nombre;
			        move_uploaded_file($ruta_provisional, $src);
			    	}
				}
			}


			//datos de la tabla cmx_vehiculo2
			 $sql3="
			 	UPDATE cmx_vehiculo2 SET 
			 	configuracion='".$e_configuracion."',
			 	marca='".$e_marca."',
			 	linea='".$e_linea."',
			 	anio_fabricacion='".$e_modelo."',
			 	color='".$e_color."',
			 	peso='".$e_peso_vacio."',
			 	cod_rndc_carroceria='".$e_carroceria."',
			 	num_chasis='".$e_num_chasis."',
			 	cod_tipo_combustible='".$e_tipo_combustible."',
			 	num_soat='".$nsoat."',
			 	vence_soat='".$fechavence."',
			 	aseguradora='".$asegura."',
			 	num_motor='".$e_num_motor."',
			 	poliza_responsabilidad='".$e_numerito_poliza."',
			 	vence_poliza='".$e_fecha_poliza."',
			 	repotenciado='".$e_repotenciado."',
			 	tipo_vinculacion='".$e_tipovinculacion."',
			 	fecha_mant_gps='".$e_fecha_mantenimientogps."',
			 	capacidad_tn='".$e_capacidad_tn."',
			 	pesobruto_kg=".$e_bruto_kg.",
			 	f_matricula='".$e_fecha_matricula."',
			 	clase_vehiculo='".$e_clasevehiculo."'
			 	WHERE id_vehiculo=".$id_vehiculo.";

			 ";
			 // echo $sql3;
			$editarVehiculo3 = $conexion->prepare($sql3);
			$result=$editarVehiculo3->execute();

			//datos del trailer
			if(isset($placat)){
				// echo "editartrailer";
				//consultar si el trailer esta s a un vehiculo
				$sql_a="SELECT * FROM cmx_trailer_vehiculo
						WHERE  
						id_vehiculo=".$id_vehiculo." AND
						id_trailer=".$placat."  
						AND estado='1'  ";
				// echo $sql_a;		
				$editartrailera = $conexion->prepare($sql_a);
				$editartrailera->execute();
				$total = $editartrailera->rowCount();
				if($total == 0){
					// echo 'no existe registro';
					//crear el registro y actualizar el trailer nuevo
					$sql4="UPDATE cmx_trailer 
					SET estado_solicitud='Asignado'
					WHERE id=".$placat." ";
					$editartrailer1 = $conexion->prepare($sql4);
					$result_z=$editartrailer1->execute();
					if($result_z){

						$sql5="INSERT INTO cmx_trailer_vehiculo
							(id,id_vehiculo,id_trailer,estado,fecha,hora,usuario)
							VALUES(NULL,".$id_vehiculo.",".$placat.",1,'".$fecha."','".$hora."',".$idusuario.")";
							// echo $sql5;
						$editartrailer2 = $conexion->prepare($sql5);
						$result=$editartrailer2->execute();
					}

				}else{
					// echo 'existe registro';
					//validar si el trailer nuevo es igual al viejito
					if(isset($trailer_anterior)){
						if($placat!=$trailer_anterior){
							// echo 'trailer viejito y nuevo son distintos';
							//si no son iguales
							//actualizar el viejo por disponible y actualizar cmx_trailer_vehiculo por 0
							$sql6="UPDATE cmx_trailer 
									SET estado_solicitud='Disponible'
								WHERE id=".$trailer_anterior." ";
							$editartrailer6 = $conexion->prepare($sql6);
							$result6=$editartrailer6->execute();

							$sql7="UPDATE cmx_trailer_vehiculo
							SET estado='0' WHERE id_trailer=".$trailer_anterior."";
							$editartrailer7 = $conexion->prepare($sql7);
							$result7=$editartrailer7->execute();
							//actualizar el nuevo por asignado y cmx_trailer_vehiculo por 1
							$sql8="
								UPDATE cmx_trailer
								SET estado_solicitud='Asignado'
								WHERE id=".$placat."
							";
							$editartrailer8 = $conexion->prepare($sql8);
							$result8=$editartrailer8->execute();

							$sql9="UPDATE cmx_trailer_vehiculo
									SET estado='1'
									WHERE id_trailer=".$placat."  ";
							$editartrailer9 = $conexion->prepare($sql9);
							$result9=$editartrailer9->execute();


						}else{
							// echo 'trailer viejito y nuevo son iguales';
							//si son iguales update normal solo en tabla de trailer
							$sql10="UPDATE cmx_trailer 
									SET estado_solicitud='Asignado'
									WHERE id=".$placat."";
							$editartrailer10 = $conexion->prepare($sql10);
							$result=$editartrailer10->execute();		
						}

					}
				}
				//actualizar estado de solicitud trailer nuevo
				// $sql4="UPDATE cmx_trailer 
				// 	SET estado_solicitud='Asignado'
				// 	WHERE id=".$placat." ";
				// $editartrailer1 = $conexion->prepare($sql4);
				// $result=$editartrailer1->execute();

				//actualizar estado de la solictud trailer anterior
			}



			if($result){
				//crear el historico 
				//obtener el ultimo id que pertenezca a la placa
				$sqlcha="SELECT MAX(id) AS 'idh' FROM cmx_asignar_conductorvehiculo 
					WHERE cod_vehiculo='".$placa."'";
				$consulta_id_historico = $conexion->prepare($sqlcha);
			    $consulta_id_historico->execute();
			    $id_ultimo_historico= $consulta_id_historico->fetch();
			    $id_historico = $id_ultimo_historico["idh"];
				//actualizar el historico anterior 
				$sqlha="UPDATE cmx_asignar_conductorvehiculo 
						SET estado='0'  WHERE id='$id_historico' ";
				$updatehistorico = $conexion->prepare($sqlha);
				$result=$updatehistorico->execute();
				//crear el nuevo historico
				$sqlh="
					INSERT INTO cmx_asignar_conductorvehiculo 
					(id,cod_vehiculo,cod_conductor,estado,fecha_actual)
					VALUES(null,'".$placa."','".$docconductor."','1','".$fecha."');
				";
				// echo $sqlh;
				$editarhistorico = $conexion->prepare($sqlh);
				$result=$editarhistorico->execute();

					//crear el log
				$sqllog="INSERT INTO cmx_log_vehiculos (id_vehiculo, id_usuario, operacion, fecha_hora_operacion) VALUES (".$id_vehiculo.",".$idusuario.",'Editar','".$datetime."');  ";	
				// echo $sqllog;
				$editarlog = $conexion->prepare($sqllog);
				$result=$editarlog->execute();
			}else{
				// echo 'no hay result de cmx_vehiculos';
			}

			$return["success"]= true;
			return $return;
	    }

	    public function EditarTrailer(){
	    	// echo "entro a editar";
	    	$_msg_error = "";
			$return["control"] = "";
			$Data = new Consultas;
				// /DATOS DEL TRAILER
			$placat=$_POST["eplaca_trailer"];
			if($placat!=''){
				$placat=$_POST["eplaca_trailer"];
				$emarca=$_POST["emarca"];
				$epeso=$_POST["epeso"];
				$ealto=$_POST["ealto"];
				$evolumen=$_POST["evolumen"];
				$etramite=$_POST["etramite"];
				$echasis=$_POST["echasis"];
				$econfiguracion=$_POST["econfiguracion"];
				$emodelo=$_POST["emodelo"];
				$eancho=$_POST["eancho"];
				$elargo=$_POST["elargo"];
				$ecapacidad=$_POST["ecapacidad"];
				$ecarroceria=$_POST["ecarroceria"];
				$ecaracteristicas=$_POST["ecaracteristicas"];
				$epropietario=$_POST["epropietario"];
				$ecivil=$_POST["ecivil"];
				$easeguradora=$_POST["easeguradora"];
				$efechavence=$_POST["efechavence"];
				$idtrailer=$_POST["idtrailer"];
				$id_usuario = $_SESSION["usuario"]["id_usuario"];
				$fecha=date('Y-m-d');
				$hora=date('G:i:s');
			}
			$model    = new Conexion;
			$conexion = $model->conectar();

				// 	if(isset($_POST["e_ruta_trailer"]) ){
				// 	$rutat="../".$_POST["e_ruta_trailer"];
				// }else{
				// 	$foto_traile= "public/files/vehiculos/trailer/$id_vehiculo/";
				// 	$rutat= "../" . $foto_traile;
				// }
				// if (!file_exists($rutat)) {
			 //        mkdir($rutat, 0777, true);
			 //   	}
			 //   	for ($m=0; $m< count($_FILES); $m++){
			 //    if(isset($_FILES["e_foto_trailer".$m])){
			 //        $file = $_FILES["e_foto_trailer".$m];
			 //        $nombre = $file["name"];
			 //        $tipo = $file["type"];
			 //        $ruta_provisional = $file["tmp_name"];
			 //        $carpeta=$rutat;
			 //        $src=$carpeta.$nombre;
			 //        move_uploaded_file($ruta_provisional, $src);
			 //    	}
				// }

				//editar el trailer 
					$sql="
					UPDATE cmx_trailer
					SET placa='".$placat."',
						marca='".$emarca."',
						peso_vacio='".$epeso."',
						alto='".$ealto."',
						volumen='".$evolumen."',
						tipo_tramite='".$etramite."',
						serie_chasis='".$echasis."',
						configuracion='".$econfiguracion."',
						modelo='".$emodelo."',
						ancho='".$eancho."',
						largo='".$elargo."',
						capacidad='".$ecapacidad."',
						carroceria='".$ecarroceria."',
						caracteristica='".$ecaracteristicas."',
						numero_civil='".$ecivil."',
						aseguradora='".$easeguradora."',
						fecha_vence='".$efechavence."',
						doc_propietario='".$epropietario."',
						estado='Activo'
					WHERE id=".$idtrailer."
					";
					// echo $sql;
					 $editartrailer = $conexion->prepare($sql);
					$result=$editartrailer->execute();
					
					if($result){
						//crear el log 
					$sql="
						INSERT INTO cmx_log_trailers
						(id,id_trailer,id_usuario,
						operacion,fecha,hora)
						VALUES(NULL,".$idtrailer.",".$id_usuario.",'Editar','".$fecha."','".$hora."');
					";
					$editarlog = $conexion->prepare($sql);
					$result=$editarlog->execute();
					}
			$return["success"]= true;
			return $return; 

	    }

		public function editarVehiculo (){
			$_msg_error = "";
			$return["control"] = "";
			$Data = new Consultas;

			$arrayMinTrans = Array();
			/******** INSERCION DE CONTENIDO DEL VEHÍCULO EN EL RNDC  ********/
			$arrayMinTrans["solicitud"] = Array(
				"tipo" => 1,
				"procesoid" => 12,
			);
			// Variable que se envían para la realizació del proceso 
			$arrayMinTrans["variables"] = Array(
				"NUMNITEMPRESATRANSPORTE"			=> MINTRANS_NIT,
				"NUMPLACA"							=> $_POST["placa"],
				"CODCONFIGURACIONUNIDADCARGA"		=> $_POST["rndc_vehiculo_configuracion"],
				"CODMARCAVEHICULOCARGA"				=> $_POST["rndc_vehiculo_marca"],
				"CODLINEAVEHICULOCARGA"				=> $_POST["rndc_vehiculo_linea"],
				"ANOFABRICACIONVEHICULOCARGA"		=> $_POST["rndc_modelo"],
				"CODTIPOCARROCERIA"					=> $_POST["rndc_vehiculo_carroceria"],
				"CODTIPOCOMBUSTIBLE"				=> $_POST["rncd_tipo_combustible"],
				"PESOVEHICULOVACIO"					=> $_POST["rndc_peso_vacio"],
				"CAPACIDADUNIDADCARGA"				=> $_POST["rndc_capacidad_carga"],
				"UNIDADMEDIDACAPACIDAD"				=> 1, // Kg
				"CODCOLORVEHICULOCARGA"				=> $_POST["rndc_vehiculo_color"],
				"CODTIPOIDPROPIETARIO"				=> $Data->getRNDCTipoDocumento( $_POST["rndc_id_tipo_documento_propietario"] ),
				"CODTIPOIDTENEDOR"					=> $Data->getRNDCTipoDocumento( $_POST["rndc_id_tipo_documento_tenedor"] ),
				"NUMSEGUROSOAT"						=> $_POST["rndc_numero_poliza"],
				"FECHAVENCIMIENTOSOAT"				=> $_POST["rndc_soat_vencimiento"],
				"NUMNITASEGURADORASOAT"				=> $_POST["rndc_vehiculo_aseguradora"],
			);

			$arrayMinTrans["variables"]["NUMIDPROPIETARIO"] = $_POST["rndc_cedula_propietario"];
			if ( $Data->getRNDCTipoDocumento( $_POST["rndc_id_tipo_documento_propietario"] ) == "N") {
				$arrayMinTrans["variables"]["NUMIDPROPIETARIO"] = $_POST["rndc_cedula_propietario"] . $_POST["digito_verificacion_propietario"];
			}
			$arrayMinTrans["variables"]["NUMIDTENEDOR"] = $_POST["rndc_cedula_tenedor"];
			if ( $Data->getRNDCTipoDocumento( $_POST["rndc_id_tipo_documento_tenedor"] ) == "N") {
				$arrayMinTrans["variables"]["NUMIDTENEDOR"] = $_POST["rndc_cedula_tenedor"] . $_POST["digito_verificacion_tenedor"];
			}
			$return["edita_vehiculo_array"] = $arrayMinTrans;

			// Se ejecuta la consulta hacia el RNDC del ministerio de transporte 
			$result = $Data->getRNDCQueryArray( $arrayMinTrans );
			$return["edita_vehiculo_result"] = $result;

			// Se valida si la operación fue exitosa
			if ( isset( $result["ErrorMSG"] ) ) {
				$_flag_proceso = false;
				$_msg_error.= "<p><strong>Registro no actualizado en RNDC - Vehículo.</strong></p>";
				$_msg_error.= $result["ErrorMSG"];
			}else{
				$rndc_ingresoid = $result["ingresoid"];
				$return["crea_vehiculo_id_crea"] = $rndc_ingresoid;
			}
			/******** FIN - INSERCION DE CONTENIDO DEL VEHÍCULO EN EL RNDC  ********/

			// Si no hay error se procede a actualizar los datos en la base de datos de Nexos
			if ( !$_msg_error ) {
				$id_vehiculo = $_POST["id_vehiculo"];
				$placa = $_POST["placa"];
				$placa_trailer = $_POST["placa_trailer"];
				$id_propietario = $_POST["id_propietario"];
				$id_tenedor = $_POST["id_tenedor"];
				$id_conductor = $_POST["id_conductor"];
				$tipo_vehiculo =  $_POST["tipo_vehiculo"];
				$tipo_carroceria =  $_POST["tipo_carroceria"];
				$web_satelital =  $_POST["web_satelital"];
				$usuario_satelital =  $_POST["usuario_satelital"];
				$clave_satelital =  $_POST["clave_satelital"];
				$id_usuario = $_SESSION["usuario"]["id_usuario"];
				$model    = new Conexion;
				$conexion = $model->conectar(); 
				$sql = " 
					UPDATE cmx_vehiculos  
					SET 
						placa ='$placa', placa_trailer= '$placa_trailer', id_propietario ='$id_propietario', id_tenedor ='$id_tenedor', 
						id_conductor ='$id_conductor', web_satelital ='$web_satelital', usuario_satelital ='$usuario_satelital', 
						clave_satelital ='$clave_satelital', tipo_vehiculo ='$tipo_vehiculo', tipo_carroceria  ='$tipo_carroceria',
						rndc_id = '$rndc_ingresoid'
					WHERE 
						id = $id_vehiculo
				";
				$crearVehiculo = $conexion->prepare($sql);
				$result=$crearVehiculo->execute();
				if ($result) {
					$sql = " 
						INSERT INTO cmx_log_vehiculos (id_vehiculo, id_usuario, operacion, fecha_hora_operacion) VALUES ($id_vehiculo,$id_usuario,'Editar',NOW()) 
					";
					$crear_oper_vehi = $conexion->prepare($sql);
					$result=$crear_oper_vehi->execute();

					$return["success"]= true;
				} else {
					$return['success'] = false;
					$_msg_error.= "Error al generar la solicitud";
				}
			}

			$return["error"] = $_msg_error;
			return $return;
	    }

	    public function activarVehiculo (){
	        $id_usuario = $_SESSION["usuario"]["id_usuario"];
	        $id_vehiculo = $_POST["id_vehiculo"];
	        $model    = new Conexion;
	        $conexion = $model->conectar(); 
	        $sql      = " UPDATE cmx_vehiculos SET estado ='Activo'
	            WHERE id = $id_vehiculo ";
	        $crearVehiculo = $conexion->prepare($sql);
	        $result=$crearVehiculo->execute();
	        $return["content"]= $sql;
	        if ($result) {
	            $sql      = " INSERT INTO cmx_log_vehiculos (id_vehiculo, id_usuario, operacion, fecha_hora_operacion) VALUES ($id_vehiculo,$id_usuario,'Activar',NOW()) ";
	            $crear_oper_vehi = $conexion->prepare($sql);
	            $result=$crear_oper_vehi->execute();
	            
	            $return["success"]= true;
	        } else {
	            $return['success'] = false;
	            $return['error'] = "Error al generar la solicitud";
	        }
	        return $return;
	    }   

	    public function inactivarVehiculo (){
	        $id_usuario = $_SESSION["usuario"]["id_usuario"];
	        $id_vehiculo = $_POST["id_vehiculo"];
	        $model    = new Conexion;
	        $conexion = $model->conectar(); 
	        $sql      = " UPDATE cmx_vehiculos SET estado ='Inactivo'
	            WHERE id = $id_vehiculo ";
	        $crearVehiculo = $conexion->prepare($sql);
	        $result=$crearVehiculo->execute();
	        $return["content"]= $sql;
	        if ($result) {
	            $sql      = " INSERT INTO cmx_log_vehiculos (id_vehiculo, id_usuario, operacion, fecha_hora_operacion) VALUES ($id_vehiculo,$id_usuario,'Inactivar',NOW()) ";
	            $crear_oper_vehi = $conexion->prepare($sql);
	            $result=$crear_oper_vehi->execute();
	            
	            $return["success"]= true;
	        } else {
	            $return['success'] = false;
	            $return['error'] = "Error al generar la solicitud";
	        }
	        return $return;
	    }

	    public function cargarpropietario (){
	        $sql = "
	            SELECT 
	                concat(cp.numero_documento,' - ',cp.nombre ) as 'nombre' 
	            FROM 
	                cmx_proveedores cp, cmx_actividad_proveedor cap
	            WHERE 
	                cp.id= cap.id_proveedor
	                AND cp.rndc_id IS NOT NULL
	                AND cap.actividad = 'Propietario vehiculo'
	        ";
	        $model    = new Conexion;
	        $conexion = $model->conectar();
	        $consulta = $conexion->prepare($sql);
	        $consulta->execute();
	        $total         = $consulta->rowCount();
	        if ($total == 0) {            
	            $return["success"]= false;
	            
	        }else {
	            $return["success"]= true;
	            while ($datos_propietario = $consulta->fetch()) {
	                $return["content"][]= $datos_propietario;
	            }
	        }  
	        return $return;
	    }  

	    public function cargartenedor (){
	        $sql = "
	            SELECT 
	                concat(cp.numero_documento,' - ',cp.nombre ) as 'nombre' 
	            FROM 
	                cmx_proveedores cp, cmx_actividad_proveedor cap
	            WHERE 
	                cp.id= cap.id_proveedor
	                AND cp.rndc_id IS NOT NULL
	                AND cap.actividad = 'Poseedor vehiculo'
	        ";
	        $model    = new Conexion;
	        $conexion = $model->conectar();
	        $consulta = $conexion->prepare($sql);
	        $consulta->execute();
	        $total         = $consulta->rowCount();
	        if ($total == 0) {            
	            $return["success"]= false;
	        } else {
	            $return["success"]= true;
	            while ($datos_propietario = $consulta->fetch()) {
	                $return["content"][]= $datos_propietario;
	            }
	        }  
	        return $return;
	    }  

	    public function cargarconductor (){
	    	//echo 'entro a cargar conductor';	        
	    	$sql = "
	            SELECT 
	                concat(cp.numero_documento,' - ',cp.nombre ) as 'nombre' 
	            FROM 
	                cmx_proveedores cp, cmx_actividad_proveedor cap
	            WHERE 
	                cp.id = cap.id_proveedor
	                
	                AND cap.actividad = 'Conductor'
	        ";
	        $model    = new Conexion;
	        $conexion = $model->conectar();
	        $consulta = $conexion->prepare($sql);
	        $consulta->execute();
	        $total         = $consulta->rowCount();
	        if ($total == 0) {            
	            $return["success"]= false;
	            
	        } else {
	            $return["success"]= true;
	            while ($datos_propietario = $consulta->fetch()) {
	                $return["content"][]= $datos_propietario;
	            }
	        }  
	        return $return;
	    }  

	    public function obtenerdatosproveedor (){
	    	//echo 'entro en obtenerdatos proveedor';
	        $numero_documento = $_POST["numero_documento"];
	        $sql = "SELECT * FROM cmx_proveedores WHERE numero_documento = '$numero_documento' LIMIT 1";
	        $model    = new Conexion;
	        $conexion = $model->conectar();
	        $consulta = $conexion->prepare($sql);
	        $consulta->execute();
	        $total         = $consulta->rowCount();
	        if ($total == 0) {            
	            $return["success"]= false;
	        } else {
	            $return["success"]= true;
	            $datos_proveedor = $consulta->fetch();
	            $return["content"] = $datos_proveedor;
	        }  
	        return $return;
	    }

	    public function verificarvehiculosexistentes (){
	        $placa_vehiculo = $_POST["placa_vehiculo"];
	        $sql = "SELECT * FROM cmx_vehiculos WHERE placa = '$placa_vehiculo' ";
	        $model    = new Conexion;
	        $conexion = $model->conectar();
	        $consulta = $conexion->prepare($sql);
	        $consulta->execute();
	        $total         = $consulta->rowCount();
	        if ($total == 0) {            
	            $return["success"]= true;
	            
	        } else {
	            $return["success"]= false;
	        }  
	        return $return;
	    }

	    public function cargartiposvehiculos (){
	         // $sql = "SELECT * FROM cmx_tipo_vehiculos";
	         $sql = "SELECT * FROM cmx_para_tipo_vehiculo";
	        $model    = new Conexion;
	        $conexion = $model->conectar();
	        $consulta = $conexion->prepare($sql);
	        $consulta->execute();
	        $total         = $consulta->rowCount();
	        if ($total == 0) { 
	             $return["success"]= false;
	        } else {
	            $return["success"]= true;
	            while ($datos_vehiculos = $consulta->fetch()) {
	                $return["content"][]= $datos_vehiculos;
	            }
	        }  
	        return $return;
	    }  

	    public function obtenerdatosvehiculos (){
	        $nombre = $_POST["nombre"];
	         $sql = "SELECT * FROM cmx_para_tipo_vehiculo WHERE nombre = '$nombre' LIMIT 1";
	        // $sql = "SELECT * FROM cmx_tipo_vehiculos WHERE nombre = '$nombre' LIMIT 1";
	        $model    = new Conexion;
	        $conexion = $model->conectar();
	        $consulta = $conexion->prepare($sql);
	        $consulta->execute();
	        $total         = $consulta->rowCount();
	        if ($total == 0) {    
	            $return["success"]= false;
	        } else {
	            $return["success"]= true;
	            $datos_proveedor = $consulta->fetch();
	            $return["content"] = $datos_proveedor;
	        }  
	        return $return;
	    }  

	    public function rndc_cargarconfiguracion(){
	        $Data = new Consultas;
	        $sql = '
	            SELECT 
	                CONCAT(crvc.nombre, " - ", crvc.descripcion) nombre
	            FROM 
	                cmx_rndc_vehiculos_configuracion crvc
	            WHERE 
	                crvc.tipo IN ("Cabezote", "Rígido")
	        ;';
	        $result = $Data->getConsulta($sql);

	        if ( $result ) {
	            $return["success"]= true;
	            foreach ($result["rowsData"] as $key => $value) {
	                $return["content"][]= $value;
	            }
	        }else{
	            $return["success"]= false;
	        }
	        return $return;
	    }  

	    public function rndc_obtenerdatosconfiguracion(){
	        $Data = new Consultas;
	        $sql = '
	            SELECT 
	                *
	            FROM 
	                cmx_rndc_vehiculos_configuracion crvc
	            WHERE 
	                crvc.nombre = "' . $_POST["nombre"] . '"
	        ;';
	        $result = $Data->getConsulta($sql);

	        if ( $result ) {
	            $return["success"]= true;
	            foreach ($result["rowsData"] as $key => $value) {
	                $return["content"][]= $value;
	            }
	        }else{
	            $return["success"]= false;
	        }
	        return $return;
	    }  

	    public function rndc_cargarcolor(){
	        $Data = new Consultas;
	        $sql = '
	            SELECT 
	                crvc.color
	            FROM 
	                cmx_rndc_vehiculos_color crvc
	        ;';
	        $result = $Data->getConsulta($sql);

	        if ( $result ) {
	            $return["success"]= true;
	            foreach ($result["rowsData"] as $key => $value) {
	                $return["content"][]= $value;
	            }
	        }else{
	            $return["success"]= false;
	        }
	        return $return;
	    }  

	    public function rndc_obtenerdatoscolor(){
	        $Data = new Consultas;
	        $sql = '
	            SELECT 
	                *
	            FROM 
	                cmx_rndc_vehiculos_color crvc
	            WHERE 
	                crvc.color = "' . $_POST["color"] . '"
	        ;';
	        $result = $Data->getConsulta($sql);

	        if ( $result ) {
	            $return["success"]= true;
	            foreach ($result["rowsData"] as $key => $value) {
	                $return["content"][]= $value;
	            }
	        }else{
	            $return["success"]= false;
	        }
	        return $return;
	    }

	    public function rndc_cargarmarca(){
	        $Data = new Consultas;
	        $sql = '
	            SELECT 
	                crvm.marca
	            FROM 
	                cmx_rndc_vehiculos_marcas crvm
	        ;';
	        $result = $Data->getConsulta($sql);

	        if ( $result ) {
	            $return["success"]= true;
	            foreach ($result["rowsData"] as $key => $value) {
	                $return["content"][]= $value;
	            }
	        }else{
	            $return["success"]= false;
	        }
	        return $return;
	    }  

	    public function rndc_obtenerdatosmarca(){
	        $Data = new Consultas;
	        $sql = '
	            SELECT 
	                *
	            FROM 
	                cmx_rndc_vehiculos_marcas crvm
	            WHERE 
	                crvm.marca = "' . $_POST["marca"] . '"
	        ;';
	        $result = $Data->getConsulta($sql);

	        if ( $result ) {
	            $return["success"]= true;
	            foreach ($result["rowsData"] as $key => $value) {
	                $return["content"][]= $value;
	            }
	        }else{
	            $return["success"]= false;
	        }
	        return $return;
	    }  

	    public function rndc_cargarlinea(){
	        $Data = new Consultas;
	        $sql = '
	            SELECT 
	                crvl.descripcion
	            FROM 
	                cmx_rndc_vehiculos_linea crvl
	        ;';
	        if ( isset($_POST["id_marca"]) ) {
	           /* $sql = '
	                SELECT 
	                    crvl.descripcion
	                FROM 
	                    cmx_rndc_vehiculos_linea crvl
	                WHERE 
	                    crvl.id_marca = ' . $_POST["id_marca"] . '
	            ;';*/

	            $sql=" SELECT crvl.* FROM cmx_rndc_vehiculos_linea crvl
	                    INNER JOIN cmx_rndc_vehiculos_marcas ma
	                    ON crvl.id_marca=ma.rndc_id
	                    WHERE crvl.id_marca=".$_POST['id_marca']."
	                    ";

	        }

	        $result = $Data->getConsulta($sql);

	        if ( $result ) {
	            $return["success"]= true;
	            foreach ($result["rowsData"] as $key => $value) {
	                $return["content"][]= $value;
	            }
	        }else{
	            $return["success"]= false;
	        }
	        return $return;
	    }  

	    public function rndc_obtenerdatoslinea(){
	        $Data = new Consultas;
	        $sql = '
	            SELECT 
	                *
	            FROM 
	                cmx_rndc_vehiculos_linea crvl
	            WHERE 
	                crvl.descripcion = "' . $_POST["descripcion"] . '"
	        ;';
	        $result = $Data->getConsulta($sql);

	        if ( $result ) {
	            $return["success"]= true;
	            foreach ($result["rowsData"] as $key => $value) {
	                $return["content"][]= $value;
	            }
	        }else{
	            $return["success"]= false;
	        }
	        return $return;
	    }  

	    public function rndc_verificalinea(){
	        $Data = new Consultas;
	        $sql = '
	            SELECT 
	                crvm.*,
	                crvl.rndc_id RNDC_ID_LINEA, crvl.descripcion, crvl.peso_bruto
	            FROM 
	                cmx_rndc_vehiculos_marcas crvm
	                INNER JOIN cmx_rndc_vehiculos_linea crvl ON crvm.id = crvl.id_marca
	                
	            WHERE 
	                crvm.id = ' . $_POST["id_vehiculo_marca"] . '
	                AND crvl.id = ' . $_POST["id_vehiculo_linea"] . '
	        ;';
	        $result = $Data->getConsulta($sql);

	        if ( $result ) {
	            $return["success"]= true;
	            foreach ($result["rowsData"] as $key => $value) {
	                $return["content"][]= $value;
	            }
	        }else{
	            $return["success"]= false;
	        }
	        return $return;
	    }  

	    public function rndc_cargarcarroceria(){
	        $Data = new Consultas;
	        $sql = '
	            SELECT 
	                crvc.descripcion
	            FROM 
	                cmx_rndc_vehiculos_carroceria crvc
	        ;';
	        $result = $Data->getConsulta($sql);

	        if ( $result ) {
	            $return["success"]= true;
	            foreach ($result["rowsData"] as $key => $value) {
	                $return["content"][]= $value;
	            }
	        }else{
	            $return["success"]= false;
	        }
	        return $return;
	    }  

	    public function rndc_obtenerdatoscarroceria(){
	        $Data = new Consultas;
	        $sql = '
	            SELECT 
	                *
	            FROM 
	                cmx_rndc_vehiculos_carroceria crvc
	            WHERE 
	                crvc.descripcion = "' . $_POST["descripcion"] . '"
	        ;';
	        $result = $Data->getConsulta($sql);

	        if ( $result ) {
	            $return["success"]= true;
	            foreach ($result["rowsData"] as $key => $value) {
	                $return["content"][]= $value;
	            }
	        }else{
	            $return["success"]= false;
	        }
	        return $return;
	    }  

	    public function rndc_cargaraseguradora(){
	        $Data = new Consultas;
	        $sql = '
	            SELECT 
	                cra.nombre
	            FROM 
	                cmx_rndc_aseguradoras cra
	        ;';
	        $result = $Data->getConsulta($sql);

	        if ( $result ) {
	            $return["success"]= true;
	            foreach ($result["rowsData"] as $key => $value) {
	                $return["content"][]= $value;
	            }
	        }else{
	            $return["success"]= false;
	        }
	        return $return;
	    }  

		public function rndc_obtenerdatosaseguradora(){
			$Data = new Consultas;
			$sql = '
				SELECT 
					*
				FROM 
					cmx_rndc_aseguradoras cra
				WHERE 
				cra.nombre = "' . $_POST["nombre"] . '"
			;';
			$result = $Data->getConsulta($sql);

			if ( $result ) {
			$return["success"]= true;
			foreach ($result["rowsData"] as $key => $value) {
				$return["content"][]= $value;
			}
			}else{
				$return["success"]= false;
			}
			return $return;
		}  
	}
