<?php

class vehiculosModel extends Model

{

	public $user_log;
	public $pass;
	public $mensaje;
	public $respuesta;
	public $email;
	public $listado;

	public function __construct()

	{
		parent::__construct();
	}

	public function getMonedas()
	{
		$monedas = $this->_db->getConsulta("SELECT * FROM cmx_vehiculos ");
		return $monedas;
	}

	public function getTabla()

	{
		$monedas = $this->_db->getConsulta("SELECT * FROM cmx_vehiculos ");
		return $monedas;
	}

	public function Validar_Token($placa, $token, $prefiltro)
	{

		$fechaHoraActual =  date("Y-m-d H:i:s");
		$estado = "aprobado";
		$estadoactual = 1;
		$formatoFecha = 'Y-m-d H:i:s';

		$sql = $this->_db3->prepare("SELECT se.id_solicitud,se.token,sp.placa, se.token_valido FROM cmx_solicitudes_estados se
    INNER JOIN cmx_solicitudes_preestudio sp ON sp.id_preestudio=se.id_solicitud WHERE se.estado=:estado AND se.token=:token AND sp.placa=:placa AND sp.id_preestudio=:prefiltro");
		$sql->bindParam(':estado', 	$estado, PDO::PARAM_STR);
		$sql->bindParam(':token', $token, PDO::PARAM_STR);
		$sql->bindParam(':placa', $placa, PDO::PARAM_STR);
		$sql->bindParam(':prefiltro', $prefiltro, PDO::PARAM_STR);
		$resultado = $sql->execute();
		$resultado = $sql->fetch(PDO::FETCH_ASSOC);

		// $fechaDateTime = DateTime::createFromFormat($formatoFecha, $resultado['token_valido']);
		// $fechahorabd = DateTime::createFromFormat($formatoFecha, $fechaHoraActual);

		if (isset($resultado['token_valido']) && $resultado['token_valido'] !== false) {
			$fechaDateTime = DateTime::createFromFormat($formatoFecha, $resultado['token_valido']);
		} else {
			// Manejar el caso en el que 'token_valido' no existe o no es válido
			error_log("Error: El valor de 'token_valido' no está disponible o es incorrecto.", 3, "error_log.txt");
		}

		if ($fechaHoraActual !== false) {
			$fechahorabd = DateTime::createFromFormat($formatoFecha, $fechaHoraActual);
		} else {
			// Manejar el caso en el que $fechaHoraActual no es válida
			error_log("Error: El valor de fecha/hora actual no es válido.", 3, "error_log.txt");
		}

		if ($resultado === false) {
			$response = [
				'numero' => 400,
				'mensaje' => 'Alguno de los datos proporcionado, no pertenece al prefiltro </strong> liago a la placa <strong>' . $placa . '</strong>.'
			];
		} else {
			// Dividir la fecha y hora en dos partes
			$partesactual = explode(' ', $fechaHoraActual);
			$fecha_actual = $partesactual[0];
			$hora_actual = $partesactual[1];
			$partes = explode(' ', $resultado['token_valido']);
			$fecha = $partes[0];
			$hora = $partes[1];
			if ($fecha_actual > $fecha) {
				// Calcular Diferencia de las fechas
				$fechahorabd = date_create($fechaHoraActual);
				// Calcular la diferencia
				$diferencia = $fechahorabd->diff($fechaDateTime);
				$response = [
					'numero' => 400,
					'mensaje' => " Token Vencio Hace : " . $diferencia->format('%d días, %h horas, %i minutos, %s segundos, solicitar nuevo prefiltro a la placa <strong>' . $placa . '</strong>')
				];
			} else {
				$sql_update_estado_token = $this->_db3->prepare("UPDATE cmx_solicitudes_estados SET estado_token='Ocupado' WHERE token=:token AND estado_token='Activo'");
				$sql_update_estado_token->bindParam(':token', $token, PDO::PARAM_STR);
				$resultado_update = $sql_update_estado_token->execute();
				if ($resultado_update) {
					$response = [
						'numero' => 200,
						'mensaje' =>  'Token Valido Hasta hoy : ' . $resultado['token_valido'] . ' para el prefiltro con la placa <strong>' . $resultado['placa'] . '</strong>'
					];
				} else {
					$response = [
						'numero' => 400,
						'mensaje' => 'Este token <strong>' . $token . '</strong>, ya esta en uso no se permiten mas acciones con el token <strong>' . $token . '</strong>.'
					];
				}
			}
		}

		return $response;
	}


	public function listarVehiculos($tipo, $placa)
	{
		$id_usuario = $_SESSION["usuario"]["id_usuario"];
		$model    = new Conexion;
		$conexion = $model->conectar();
		if ($placa == '') {
			$sql = '';
		} else {
			$sql = "SELECT cv.*,
			IF((SELECT COUNT(cp1.numdoc_nexos) FROM cmx_proveedores cp1 WHERE cp1.numdoc_nexos = cv.id_propietario) > 0,
					(SELECT cp1.numero_documento FROM cmx_proveedores cp1 WHERE cp1.numdoc_nexos = cv.id_propietario), 
					NULL
			) AS documento_propietario,
			IF((SELECT COUNT(cp1.numdoc_nexos) FROM cmx_proveedores cp1 WHERE cp1.numdoc_nexos = cv.id_propietario) > 0,
					IF((SELECT cp1.tipo_documento FROM cmx_proveedores cp1 WHERE cp1.numdoc_nexos = cv.id_propietario) = 'NIT',
							(SELECT CONCAT(cp1.nombre) FROM cmx_proveedores cp1 WHERE cp1.numdoc_nexos = cv.id_propietario), 
							IF((SELECT cp1.tipo_documento FROM cmx_proveedores cp1 WHERE cp1.numdoc_nexos = cv.id_propietario) = 'Cedula de Ciudadania',
									(SELECT CONCAT(cp1.nombre,' ',cp1.apellido1,' ',cp1.apellido2) FROM cmx_proveedores cp1 WHERE cp1.numdoc_nexos = cv.id_propietario), 
									NULL
							)
					),
					NULL
			) AS nombre_propietario,
			IF((SELECT COUNT(cp1.numdoc_nexos) FROM cmx_proveedores cp1 WHERE cp1.numdoc_nexos = cv.id_tenedor) > 0,
					(SELECT cp1.numero_documento FROM cmx_proveedores cp1 WHERE cp1.numdoc_nexos = cv.id_tenedor), 
					NULL
			) AS documento_tenedor,
					IF((SELECT COUNT(cp1.numdoc_nexos) FROM cmx_proveedores cp1 WHERE cp1.numdoc_nexos = cv.id_tenedor) > 0,
					IF((SELECT cp1.tipo_documento FROM cmx_proveedores cp1 WHERE cp1.numdoc_nexos = cv.id_tenedor) = 'NIT',
							(SELECT CONCAT(cp1.nombre) FROM cmx_proveedores cp1 WHERE cp1.numdoc_nexos = cv.id_tenedor), 
							IF((SELECT cp1.tipo_documento FROM cmx_proveedores cp1 WHERE cp1.numdoc_nexos = cv.id_tenedor) = 'Cedula de Ciudadania',
									(SELECT CONCAT(cp1.nombre,' ',cp1.apellido1,' ',cp1.apellido2) FROM cmx_proveedores cp1 WHERE cp1.numdoc_nexos = cv.id_tenedor), 
									NULL
							)
					),
					NULL
			) AS nombre_tenedor,
			/*IF((SELECT COUNT(cp1.numdoc_nexos) FROM cmx_proveedores cp1 WHERE cp1.numdoc_nexos = cv.id_tenedor) > 0,
					(SELECT CONCAT(cp1.nombre,' ',cp1.apellido1,' ',cp1.apellido2) FROM cmx_proveedores cp1 WHERE cp1.numdoc_nexos = cv.id_tenedor), 
					NULL
			) AS nombre_tenedor,*/
			IF((SELECT COUNT(cp1.numdoc_nexos) FROM cmx_proveedores cp1 WHERE cp1.numdoc_nexos = cv.id_conductor) > 0,
					(SELECT cp1.numero_documento FROM cmx_proveedores cp1 WHERE cp1.numdoc_nexos = cv.id_conductor), 
					NULL
			) AS documento_conductor,
			IF((SELECT COUNT(cp1.numdoc_nexos) FROM cmx_proveedores cp1 WHERE cp1.numdoc_nexos = cv.id_conductor) > 0,
					(SELECT CONCAT(cp1.nombre,' ',cp1.apellido1,' ',cp1.apellido2) FROM cmx_proveedores cp1 WHERE cp1.numdoc_nexos = cv.id_conductor), 
					NULL
			) AS nombre_conductor
		FROM 
			cmx_vehiculos cv
		WHERE  cv.placa LIKE '%" . $placa . "%'	

					ORDER BY cv.rndc_id DESC, cv.placa

				";
			$consulta = $conexion->prepare($sql);
			if ($sql != '' || $sql != null) {
				$consulta->execute();
			}

			$total = $consulta->rowCount();
			$this->mensaje = $total;
			if ($total == 0) {
				$this->respuesta = "BAD";
			} else {
				$this->respuesta = "GOOD";
				while ($datos_vehiculos = $consulta->fetch()) {
					$sql2 = "SELECT COUNT(ev.id) AS cant_estudio
								FROM cmx_estudiov_completo ev
								LEFT JOIN cmx_vehiculos ve
								ON ev.id_vehiculo=ve.id
								AND ev.estado='Aprobado'
								WHERE ve.placa='" . $datos_vehiculos["placa"] . "'";
					$consulta_vehiculo = $conexion->prepare($sql2);
					$consulta_vehiculo->execute();
					$cant_estudios = $consulta_vehiculo->fetch();

					if ($cant_estudios["cant_estudio"] == 0) {
						$datos_vehiculos["cant_estudio"] = 0;
					} else {
						$datos_vehiculos["cant_estudio"] = $cant_estudios["cant_estudio"];
					}
					$this->listado[] = $datos_vehiculos;
				}
			}
		}
	}

	public function Guardar_vehiculo($datos)
	{
		// var_dump($datos['id_propietario']);
		// exit();
		$response = [];
		$id_usuario = $datos['id_usuario'];
		$nom_usuario = $datos['nom_usuario'];
		// Consultar maestro de Estudio de seguridad cabecera
		$sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='VEHICULOS' AND numero_actual>numero_inicial");
		$resultado_consecutivo = $sql_consecutivo->execute();
		$resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
		$numdoc_cabecera = $resultado_consecutivo['numero_actual'];
		$numdoc_actualizar_cabecera = $resultado_consecutivo['numero_actual'] + 1;
		// Actualizar Maestro de Estudio segurdad cabecera
		$sql_updata_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numdoc_actualizar_cabecera WHERE tipo='VEHICULOS'");
		$resultado_consecutivo_update_cabecera = $sql_updata_maestro->execute();
		$this->_db3->beginTransaction();
		try {
			$estado = "Activo";
			$estado_vehiculo = "Nuevo";
			if ($numdoc_cabecera && $resultado_consecutivo_update_cabecera) {
				$sql = $this->_db3->prepare("INSERT INTO cmx_vehiculos(id,numdoc_vehiculo,placa,id_propietario,id_tenedor,id_conductor,web_satelital,usuario_satelital,clave_satelital,tipo_carroceria,estado,cant_viajes,empresa_gps,estado_vehiculo) 
				 VALUES (null,:numdoc_vehiculo,:placa,:id_propietario,:id_tenedor,:id_conductor,:web_satelital,:usuario_satelital,:clave_satelital,:tipo_carroceria,:estado,:cant_viaje,:empresagps,:estado_vehiculo)");
				$sql->bindParam(':numdoc_vehiculo', $numdoc_cabecera, PDO::PARAM_STR);
				$sql->bindParam(':placa', $datos['placa'], PDO::PARAM_STR);
				$sql->bindParam(':id_propietario', $datos['id_propietario'], PDO::PARAM_STR);
				$sql->bindParam(':id_tenedor', $datos['id_tenedor'], PDO::PARAM_STR);
				$sql->bindParam(':id_conductor', $datos['id_conductor'], PDO::PARAM_STR);
				$sql->bindParam(':web_satelital', $datos['web_satelital'], PDO::PARAM_STR);
				$sql->bindParam(':usuario_satelital', $datos['usuario_satelital'], PDO::PARAM_STR);
				$sql->bindParam(':clave_satelital', $datos['clave_satelital'], PDO::PARAM_STR);
				$sql->bindParam(':tipo_carroceria', $datos['tipo_carroceria'], PDO::PARAM_STR);
				$sql->bindParam(':estado', $estado, PDO::PARAM_STR);
				$sql->bindParam(':cant_viaje', $datos['cant_viaje'], PDO::PARAM_STR);
				$sql->bindParam(':empresagps', $datos['empresagps'], PDO::PARAM_STR);
				$sql->bindParam(':estado_vehiculo', $estado_vehiculo, PDO::PARAM_STR);
				// $crearVehiculo = $sql);

				$result = $sql->execute();

				if ($result) {
					$fecha = date("Y-m-d");
					$hora = date("H:m:s");
					$sqlblock =  $this->_db3->prepare("INSERT INTO cmx_estado_bloqueo (nombre_proceso,estado_proceso,id_objeto,tipo_objeto,fecha,hora,usuario)
					VALUES('modificar','desbloqueado'," . $numdoc_cabecera . ", 'vehiculo','" . $fecha . "','" . $hora . "','" . $nom_usuario . "')");
					$result_bloqueo = $sqlblock->execute();
					if ($result_bloqueo) {

						$sql2 = $this->_db3->prepare("INSERT INTO cmx_vehiculo2(configuracion,marca,linea,anio_fabricacion,color,peso,num_chasis,cod_tipo_combustible,num_soat,vence_soat,aseguradora,num_motor,poliza_responsabilidad,vence_poliza,repotenciado,tipo_vinculacion,fecha_mant_gps,capacidad_tn,id_vehiculo,pesobruto_kg,f_matricula,clase_vehiculo)
			    	VALUES(:configuracion,:marca,:linea,:modelo,:color,:peso_vacio,:num_chasis,:tipo_combustible,:numero_poliza,:soat_vencimiento,:aseguradora,:num_motor,:numero_poliza,:fecha_poliza,:repotenciado,:tipovinculacion,:fecha_mantenimientogps,:capacidad_tn,:id_vehiculo,:peso_bruto,:f_matricula,:clase)");
						$sql2->bindParam(':configuracion', $datos["configuracion"], PDO::PARAM_STR);
						$sql2->bindParam(':marca', $datos["marca"], PDO::PARAM_STR);
						$sql2->bindParam(':linea', $datos["linea"], PDO::PARAM_STR);
						$sql2->bindParam(':modelo', $datos["modelo"], PDO::PARAM_STR);
						$sql2->bindParam(':color', $datos["color"], PDO::PARAM_STR);
						$sql2->bindParam(':peso_vacio', $datos["peso_vacio"], PDO::PARAM_STR);
						$sql2->bindParam(':num_chasis', $datos["num_chasis"], PDO::PARAM_STR);
						$sql2->bindParam(':tipo_combustible', $datos["tipo_combustible"], PDO::PARAM_STR);
						$sql2->bindParam(':numero_poliza', $datos["numero_poliza"], PDO::PARAM_STR);
						$sql2->bindParam(':soat_vencimiento', $datos["soat_vencimiento"], PDO::PARAM_STR);
						$sql2->bindParam(':aseguradora', $datos["aseguradora"], PDO::PARAM_STR);
						$sql2->bindParam(':num_motor', $datos["num_motor"], PDO::PARAM_STR);
						$sql2->bindParam(':numero_poliza', $datos["numero_poliza"], PDO::PARAM_STR);
						$sql2->bindParam(':fecha_poliza', $datos["fecha_poliza"], PDO::PARAM_STR);
						$sql2->bindParam(':repotenciado', $datos["repotenciado"], PDO::PARAM_STR);
						$sql2->bindParam(':tipovinculacion', $datos["tipovinculacion"], PDO::PARAM_STR);
						$sql2->bindParam(':fecha_mantenimientogps', $datos["fecha_mantenimientogps"], PDO::PARAM_STR);
						$sql2->bindParam(':capacidad_tn', $datos["capacidad_tn"], PDO::PARAM_STR);
						$sql2->bindParam(':id_vehiculo', $numdoc_cabecera, PDO::PARAM_STR);
						$sql2->bindParam(':peso_bruto', $datos["peso_bruto"], PDO::PARAM_STR);
						$sql2->bindParam(':f_matricula', $datos["f_matricula"], PDO::PARAM_STR);
						$sql2->bindParam(':clase', $datos["clase"], PDO::PARAM_STR);
						$result2 = $sql2->execute();
						if ($result2) {
							$sql3 = $this->_db3->prepare("INSERT INTO cmx_detalle_vehiculo(id,tecnomecanica,tecno_fecha_expedida,tecno_fecha_vigencia,id_vehiculo,licencia_transito,fecha_expedicion_preoperacional,fecha_vencimiento_preoperacional,vigencia_prepoeracional,nombre_preopeacional,nombre_kit)
							VALUES(null,:tecnomecanica,:fecha_tecno,:fecha_vig_tecno,:id_vehiculo,:lice_transito,:fecha_expedicion_preoperacional,:fecha_vencimiento_preoperacional,:vigencia_prepoeracional,:nombre_preopeacional,:nombre_kit)");
							$sql3->bindParam(':tecnomecanica', $datos["tecnomecanica"], PDO::PARAM_STR);
							$sql3->bindParam(':fecha_tecno', $datos["fecha_tecno"], PDO::PARAM_STR);
							$sql3->bindParam(':fecha_vig_tecno', $datos["fecha_vig_tecno"], PDO::PARAM_STR);
							$sql3->bindParam(':id_vehiculo', $numdoc_cabecera, PDO::PARAM_STR);
							$sql3->bindParam(':lice_transito', $datos["lice_transito"], PDO::PARAM_STR);
							$sql3->bindParam(':fecha_expedicion_preoperacional', $datos["fecha_expedicion_preoperacional"], PDO::PARAM_STR);
							$sql3->bindParam(':fecha_vencimiento_preoperacional', $datos["fecha_vencimiento_preoperacional"], PDO::PARAM_STR);
							$sql3->bindParam(':vigencia_prepoeracional', $datos["vigencia_prepoeracional"], PDO::PARAM_STR);
							$sql3->bindParam(':nombre_preopeacional', $datos["name_preoperacional"], PDO::PARAM_STR);
							$sql3->bindParam(':nombre_kit', $datos["name_kit"], PDO::PARAM_STR);
							$result3 = $sql3->execute();
							if ($result3) {
								//INSERTAR DATOS ADJUNTOS DEL VEHICULOS
								$respuesta = $this->Guardar_adjuntos_vehiculo($datos, $numdoc_cabecera);

								if ($datos["placa_trailer"] != '') {
									$estado = '1';
									$fecha = date("Y-m-d");
									$hora = date("H:m:s");
									$sqlt = $this->_db3->prepare("INSERT INTO cmx_trailer_vehiculo(id,id_vehiculo,id_trailer,estado,fecha,hora,usuario) VALUES(NULL,:id_vehiculo,:placa_trailer,:estado,:fecha,:hora,:id_usuario)");
									$sqlt->bindParam(':id_vehiculo', $numdoc_cabecera, PDO::PARAM_STR);
									$sqlt->bindParam(':placa_trailer', $datos["placa_trailer"], PDO::PARAM_STR);
									$sqlt->bindParam(':estado', $estado, PDO::PARAM_STR);
									$sqlt->bindParam(':fecha', $fecha, PDO::PARAM_STR);
									$sqlt->bindParam(':hora', $hora, PDO::PARAM_STR);
									$sqlt->bindParam(':id_usuario', $id_usuario, PDO::PARAM_STR);
									$result_trailer = $sqlt->execute();
									if ($result_trailer) {
										//CRECION DEL log
										if ($respuesta >= 7) {
											// Operacion de cuando no llevatrailer
											$fecha = date("Y-m-d");
											$hora = date("H:m:s");
											//CRECION DEL log
											$sqll = $this->_db3->prepare("INSERT INTO cmx_log_vehiculos (id_vehiculo,id_usuario,operacion, fecha_hora_operacion)  VALUES ($numdoc_cabecera,$id_usuario,'Crear',NOW())");
											$result_log = $sqll->execute();
											$sqlc =  $this->_db3->prepare("INSERT INTO cmx_calificacion_vehiculos_servicios (id_vehiculo, calificacion,fecha_hora_operacion) VALUES ($numdoc_cabecera,0,NOW())");
											$result_c = $sqlc->execute();
											if ($result_log &&	$result_c) {
												//historial
												$sqlh = $this->_db3->prepare("INSERT INTO cmx_asignar_conductorvehiculo (id,cod_vehiculo,cod_conductor,estado,fecha_anterior,fecha_actual)VALUES(NULL,'" . $datos['placa'] . "','" . $datos['id_conductor'] . "','0','$fecha','$fecha')");
												$result_h = $sqlh->execute();
												if ($result_h) {
													$this->_db3->commit();
													$response = true;
												} else {
													$this->_db3->rollBack();
													// Falla en la actualización, revertir la transacción
													$response = false;
													$mensajeError = "Error al insertarel vehiculo en el sistema." . date("Y-m-d");
													error_log($mensajeError . "\n", 3, "error_log.txt");
													throw new Exception("Error al guardar proveedor");
												}
											} else {
												// return $respuesta = array('success' => false, 'message' => 'Error al modificar los datos del vehículo');
												$response = ["success" => false, 'message' => 'Alfun documento no subio en el servidor'];
											}
										} else {
											$mensajeError = "Error al insertar el log y la calificaiocn el vehiculo." . date("Y-m-d");
											error_log($mensajeError . "\n", 3, "error_log.txt");
											throw new Exception("Error al guardar proveedor");
										}
									} else {
										$mensajeError = "Error al insertar asosiar el trailer con el vehiculo." . date("Y-m-d");
										error_log($mensajeError . "\n", 3, "error_log.txt");
										throw new Exception("Error al guardar proveedor");
									}
								} else {
									if ($respuesta >= 7) {
										// Operacion de cuando no llevatrailer
										$fecha = date("Y-m-d");
										$hora = date("H:m:s");
										//CRECION DEL log
										$sqll = $this->_db3->prepare("INSERT INTO cmx_log_vehiculos (id_vehiculo,id_usuario,operacion, fecha_hora_operacion)  VALUES ($numdoc_cabecera,$id_usuario,'Crear',NOW())");
										$result_log = $sqll->execute();
										$sqlc =  $this->_db3->prepare("INSERT INTO cmx_calificacion_vehiculos_servicios (id_vehiculo, calificacion,fecha_hora_operacion) VALUES ($numdoc_cabecera,0,NOW())");
										$result_c = $sqlc->execute();
										if ($result_log &&	$result_c) {
											//historial
											$sqlh = $this->_db3->prepare("INSERT INTO cmx_asignar_conductorvehiculo (id,cod_vehiculo,cod_conductor,estado,fecha_anterior,fecha_actual)VALUES(NULL,'" . $datos['placa'] . "','" . $datos['id_conductor'] . "','0','$fecha','$fecha')");
											$result_h = $sqlh->execute();
											if ($result_h) {
												$this->_db3->commit();
												$response = true;
											} else {
												$this->_db3->rollBack();
												// Falla en la actualización, revertir la transacción
												$response = false;
												$mensajeError = "Error al insertarel vehiculo en el sistema." . date("Y-m-d");
												error_log($mensajeError . "\n", 3, "error_log.txt");
												throw new Exception("Error al guardar proveedor");
											}
										} else {
											// return $respuesta = array('success' => false, 'message' => 'Error al modificar los datos del vehículo');
											$response = ["success" => false, 'message' => 'Alfun documento no subio en el servidor'];
										}
									} else {
										$mensajeError = "Error al insertar el log y la calificaiocn el vehiculo." . date("Y-m-d");
										error_log($mensajeError . "\n", 3, "error_log.txt");
										throw new Exception("Error al guardar proveedor");
									}
								}
							} else {
								$mensajeError = "Error al insertar en la tabla detalles del vehiculo en la tabla 2." . date("Y-m-d");
								error_log($mensajeError . "\n", 3, "error_log.txt");
								throw new Exception("Error al guardar proveedor");
							}
						} else {
							$mensajeError = "Error al insertar en la tabla detalles del vehiculo." . date("Y-m-d");
							error_log($mensajeError . "\n", 3, "error_log.txt");
							throw new Exception("Error al guardar proveedor");
						}
					} else {
						$mensajeError = "Error al insertar en la tabla de bloqueo del vehiculo." . date("Y-m-d");
						error_log($mensajeError . "\n", 3, "error_log.txt");
						throw new Exception("Error al guardar proveedor");
					}
				} else {
					$mensajeError = "Error al insertar en la tabla de vehiculos principal." . date("Y-m-d");
					error_log($mensajeError . "\n", 3, "error_log.txt");
					throw new Exception("Error al guardar proveedor");
				}
			} else {
				// Falla en la actualización, revertir la transacción
				// Puedes lanzar una excepción específica aquí si lo deseas
				$mensajeError = "Error al actualizar el consecutivo para la creacion." . date("Y-m-d");
				error_log($mensajeError . "\n", 3, "error_log.txt");
				throw new Exception("Error al guardar proveedor");
			}
		} catch (\Throwable $th) {
			$this->_db3->rollBack();
			// Manejar la excepción
			$mensajeError = "Error en el proceso." . date("Y-m.d");
			error_log($mensajeError . "\n", 3, "error_log.txt");
			throw $th;
		}
		return $response;
	}

	public function Guardar_adjuntos_vehiculo($datos, $numdoc_cabecera)
	{
		$cont = 0;
		if ($datos['foto_kit_mercancias'] !== null || $datos['foto_tecno'] !== null) {
			$tipos_adjuntos = [
				'foto_transi' => ['TRA', 'foto_transito', 'name_transito', 'Licencia transito'],
				'foto_vehiculo' => ['F', 'foto_vehiculo', 'name_frontal', 'Foto Frontal'],
				'foto_vehiculod' => ['D', 'foto_derecha', 'name_derecha', 'Foto Derecha'],
				'foto_vehiculoi' => ['I', 'foto_izquierda', 'name_izquierda', 'Foto Izquierda'],
				'foto_vehiculoa' => ['A', 'foto_atras', 'name_atras', 'Foto Atras'],
				'foto_soat' => ['SO', 'foto_soat', 'name_soat', 'SOAT'],
				'foto_tecno' => ['TECNO', 'foto_tecno', 'name_tecno', 'Tecno Mecanica'],
				'foto_kit_mercancias' => ['KIT',  'documento_kit', 'nombre_kit', 'Kit Mercancias'],
				'documento_preopeacional' => ['PREO', 'documento_preopeacional', 'nombre_preopeacional', 'Preoperacional'],
			];
		} else {
			$tipos_adjuntos = [
				'foto_transi' => ['TRA', 'foto_transito', 'name_transito', 'Licencia transito'],
				'foto_vehiculo' => ['F', 'foto_vehiculo', 'name_frontal', 'Foto Frontal'],
				'foto_vehiculod' => ['D', 'foto_derecha', 'name_derecha', 'Foto Derecha'],
				'foto_vehiculoi' => ['I', 'foto_izquierda', 'name_izquierda', 'Foto Izquierda'],
				'foto_vehiculoa' => ['A', 'foto_atras', 'name_atras', 'Foto Atras'],
				'foto_soat' => ['SO', 'foto_soat', 'name_soat', 'SOAT'],
				'foto_tecno' => ['TECNO', 'foto_tecno', 'name_tecno', 'Tecno Mecanica'],
				'documento_preopeacional' => ['PREO',  'documento_preopeacional', 'nombre_preopeacional', 'Preoperacional'],
			];
		}

		foreach ($tipos_adjuntos as $key => $config) {
			if (!empty($datos[$key])) {
				if ($this->subirArchivoYActualizarBD($datos[$key], $numdoc_cabecera, $config[0], $config[1], $config[2])) {
					$cont++;
				} else {
					error_log("Error al subir o actualizar $config[3]", 3, "error_log.txt");
				}
			}
		}
		return $cont;
	}

	private function subirArchivoYActualizarBD($archivo, $numdoc_cabecera, $subcarpeta, $campoBD, $campoNombre)
	{
		// Define las rutas
		$ruta = "public/files/vehiculos/$numdoc_cabecera/$subcarpeta/";
		$ruta_base = "public/files/vehiculos/$numdoc_cabecera/$subcarpeta/";

		// Verifica si la carpeta existe, si no, créala
		if (!is_dir($ruta)) {
			mkdir($ruta, 0777, true);
		}

		$nombre = $archivo['name'];
		$rutaTemporal = $archivo['tmp_name'];
		$src = $ruta . $nombre;

		// Mueve el archivo a la ruta de destino
		if (move_uploaded_file($rutaTemporal, $src)) {
			// Prepara y ejecuta la consulta SQL
			$sql = $this->_db3->prepare("UPDATE cmx_detalle_vehiculo SET $campoBD=:ruta_base, $campoNombre=:nombre WHERE id_vehiculo=:id_vehiculo");
			$sql->bindParam(':ruta_base', $ruta_base, PDO::PARAM_STR);
			$sql->bindParam(':nombre', $nombre, PDO::PARAM_STR);
			$sql->bindParam(':id_vehiculo', $numdoc_cabecera, PDO::PARAM_INT);
			return $sql->execute();
		} else {
			return false;
		}
	}

	public function Lista_De_Colores()
	{
		$sql = $this->_db3->prepare("SELECT * FROM cmx_rndc_vehiculos_color WHERE estado=1 ORDER BY color ASC, rndc_id DESC LIMIT 100");
		$sql->execute();
		$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $resultado;
	}

	public function Filtro_Buscar_Colores($datos)
	{
		$sql = $this->_db3->prepare("SELECT * FROM cmx_rndc_vehiculos_color WHERE color=:datos ORDER BY color ASC, rndc_id DESC");
		// $sql = $this->_db3->prepare("SELECT * FROM cmx_rndc_vehiculos_color WHERE color LIKE '%' :datos '%' ORDER BY color ASC, rndc_id DESC");
		$sql->bindParam(':datos', $datos, PDO::PARAM_STR);
		$sql->execute();
		$resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $resultados;
	}

	public function Lista_De_Marcas()
	{
		$sql = $this->_db3->prepare("SELECT * FROM cmx_rndc_vehiculos_marcas WHERE estado=1 ORDER BY marca ASC");
		$sql->execute();
		$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $resultado;
	}

	public function Lista_De_Configuraciones()
	{
		$sql = $this->_db3->prepare("SELECT * FROM cmx_rndc_vehiculos_configuracion WHERE tipo='Completa' ORDER BY nombre ASC");
		$sql->execute();
		$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $resultado;
	}

	public function traer_trailer($nombre)
	{
		$sql = $this->_db3->prepare("SELECT t.* , p.nombre AS namec, p.descripcion AS descc
			FROM cmx_trailer t
			INNER JOIN cmx_rndc_vehiculos_configuracion p ON t.configuracion=p.id
			LEFT JOIN cmx_configuracion_cabezote_trailer cct ON p.nombre=cct.conf_trailer
			WHERE cct.conf_cabezote=:nombre AND t.estado_solicitud='Disponible'");
		$sql->bindParam(':nombre', $nombre, PDO::PARAM_STR);
		$sql->execute();
		$resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $resultados;
	}

	public function traer_lineas($nombre)
	{
		$sql = $this->_db3->prepare("SELECT * , m.id as id_marca_pk, m.rndc_id as rndc_marca, cvl.id as id_line FROM cmx_rndc_vehiculos_marcas m
			LEFT JOIN cmx_rndc_vehiculos_linea cvl ON m.rndc_id=cvl.id_marca
			WHERE m.id=:marca ORDER BY cvl.descripcion ASC");
		$sql->bindParam(':marca', $nombre, PDO::PARAM_STR);
		$sql->execute();
		$resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $resultados;
	}

	public  function Listar_Clase_Vehiculo()
	{
		$sql = $this->_db3->prepare("SELECT  * FROM cmx_rndc_clase_vehiculo ORDER BY clase ASC");
		$sql->execute();
		$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $resultado;
	}

	public function Consultar_Configuracion_Rndc($id)
	{
		$sql = $this->_db3->prepare("SELECT id, rndc_id ,nombre FROM cmx_rndc_vehiculos_configuracion WHERE nombre=:id");
		$sql->bindParam(':id', $id, PDO::PARAM_STR);
		$sql->execute();
		$resultados = $sql->fetch(PDO::FETCH_ASSOC);
		return $resultados;
	}

	public function Listar_Tipo_Carroceria()
	{
		$sql =  $this->_db3->prepare("SELECT * FROM cmx_rndc_vehiculos_carroceria WHERE estado=1 ORDER BY descripcion ASC");
		$sql->execute();
		$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $resultado;
	}

	public function Listar_Empresa_Gps()
	{
		$sql = $this->_db3->prepare("SELECT * FROM cmx_rndc_empresa_gps ORDER BY operador_gps ASC");
		$sql->execute();
		$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $resultado;
	}

	public function Listar_Propietarios()
	{
		$sql = $this->_db3->prepare("SELECT p.numdoc_nexos, p.tipo_documento, p.numero_documento, p.digito_verificacion, p.nombre, IFNULL(p.apellido1,' ') AS apellido1, IFNULL(p.apellido2,' ') AS apellido2,p.celular,p.direccion FROM cmx_proveedores p
		INNER JOIN cmx_actividad_proveedor a ON p.numdoc_nexos=a.id_proveedor WHERE a.actividad='Propietario Vehiculo' AND p.estado='Activo' ORDER BY  p.nombre ASC");
		$sql->execute();
		$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $resultado;
	}

	public function Buscar_Propietarios($dato)
	{
		// $sql = $this->_db3->prepare("SELECT * FROM cmx_rndc_vehiculos_color WHERE color LIKE '%' :datos '%' ORDER BY color ASC, rndc_id DESC");
		$sql = $this->_db3->prepare("SELECT p.numdoc_nexos, p.tipo_documento, p.numero_documento, p.digito_verificacion, p.nombre, IFNULL(p.apellido1,' ') AS apellido1, IFNULL(p.apellido2,' ') AS apellido2,p.celular,p.direccion FROM cmx_proveedores p
		INNER JOIN cmx_actividad_proveedor a ON p.numdoc_nexos=a.id_proveedor WHERE (p.nombre LIKE '%' :datos '%' OR p.numero_documento LIKE '%' :datos '%' OR p.celular LIKE '%' :datos '%') AND a.actividad='Propietario Vehiculo' AND p.estado='Activo' ORDER BY  p.nombre ASC");
		$sql->bindParam(':datos', $dato, PDO::PARAM_STR);
		$sql->execute();
		$resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $resultados;
	}

	public function Listar_Poseeodores()
	{
		$sql = $this->_db3->prepare("SELECT p.numdoc_nexos, p.tipo_documento, p.numero_documento, p.digito_verificacion, p.nombre, p.apellido1, p.apellido2,
		p.celular,p.direccion  FROM cmx_proveedores p
		INNER JOIN cmx_actividad_proveedor a ON p.numdoc_nexos=a.id_proveedor
		WHERE a.actividad='Poseedor Vehiculo' AND p.estado='Activo' ORDER BY  p.nombre ASC");
		$sql->execute();
		$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $resultado;
	}

	public function Buscar_Poseedores($dato)
	{
		// $sql = $this->_db3->prepare("SELECT * FROM cmx_rndc_vehiculos_color WHERE color LIKE '%' :datos '%' ORDER BY color ASC, rndc_id DESC");
		$sql = $this->_db3->prepare("SELECT p.numdoc_nexos, p.tipo_documento, p.numero_documento, p.digito_verificacion, p.nombre, p.apellido1, p.apellido2,p.celular,p.direccion FROM cmx_proveedores p
		INNER JOIN cmx_actividad_proveedor a ON p.numdoc_nexos=a.id_proveedor WHERE (p.nombre LIKE '%' :datos '%' OR p.numero_documento LIKE '%' :datos '%' OR p.celular LIKE '%' :datos '%') AND a.actividad='Poseedor Vehiculo' AND p.estado='Activo' ORDER BY  p.nombre ASC");
		$sql->bindParam(':datos', $dato, PDO::PARAM_STR);
		$sql->execute();
		$resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $resultados;
	}

	public function Listar_Conductores()
	{
		$sql = $this->_db3->prepare("SELECT p.numdoc_nexos, p.tipo_documento, p.numero_documento, p.digito_verificacion, p.nombre, p.apellido1, p.apellido2,
		p.celular,p.direccion  FROM cmx_proveedores p
		INNER JOIN cmx_actividad_proveedor a ON p.numdoc_nexos=a.id_proveedor
		WHERE a.actividad='Conductor' AND p.estado='Activo' ORDER BY  p.nombre ASC");
		$sql->execute();
		$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $resultado;
	}

	public function Buscar_Conductores($dato)
	{
		// $sql = $this->_db3->prepare("SELECT * FROM cmx_rndc_vehiculos_color WHERE color LIKE '%' :datos '%' ORDER BY color ASC, rndc_id DESC");
		$sql = $this->_db3->prepare("SELECT p.numdoc_nexos, p.tipo_documento, p.numero_documento, p.digito_verificacion, p.nombre, p.apellido1, p.apellido2,p.celular,p.direccion FROM cmx_proveedores p
		INNER JOIN cmx_actividad_proveedor a ON p.numdoc_nexos=a.id_proveedor WHERE (p.nombre LIKE '%' :datos '%' OR p.numero_documento LIKE '%' :datos '%' OR p.celular LIKE '%' :datos '%') AND a.actividad='Conductor' AND p.estado='Activo' ORDER BY  p.nombre ASC");
		$sql->bindParam(':datos', $dato, PDO::PARAM_STR);
		$sql->execute();
		$resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $resultados;
	}

	public function Buscar_Datos_Vehiculo($id_vehiculo)
	{

		$this->_db3->beginTransaction();
		try {
			$sql = $this->_db3->prepare("SELECT v.id AS elid,  v.*,v2.*,d.*,
			b.estado_proceso, g.nombre AS 'v_confi', g.descripcion AS 'v_descri',ase.nombre AS 'Aseguradora',
			CONCAT(pr.nombre,' ',IFNULL(pr.apellido1, ''),' ',IFNULL(pr.apellido2, '')) AS 'Propietario',CONCAT(ps.nombre,' ',IFNULL(pr.apellido1, ''),' ',IFNULL(pr.apellido2, '')) AS 'Poseedor',
			CONCAT(pc.nombre,' ',pc.apellido1,' ',pc.apellido2) AS 'Conductor',trv.id_trailer AS 'Trailer',col.color,col.id AS 'Color_id',col.rndc_id AS 'Col_Rncd_id',g.id AS 'config_id',g.rndc_id,ase.id AS 'Aseg_id',ase.rndc_id AS 'Aseg_Rdnc_id',
			d.documento_kit,d.nombre_kit,d.nombre_preopeacional,d.documento_preopeacional,d.fecha_expedicion_preoperacional,d.fecha_vencimiento_preoperacional
			FROM cmx_vehiculos v
			INNER JOIN cmx_vehiculo2 v2
			INNER JOIN cmx_rndc_vehiculos_configuracion g ON v2.configuracion=g.id
			INNER JOIN cmx_detalle_vehiculo d ON v.numdoc_vehiculo=v2.id_vehiculo AND v2.id_vehiculo=d.id_vehiculo
			INNER JOIN cmx_rndc_aseguradoras ase ON v2.aseguradora=ase.id
			INNER JOIN cmx_proveedores pr ON v.id_propietario=pr.numdoc_nexos
			INNER JOIN cmx_proveedores ps ON v.id_tenedor=ps.numdoc_nexos
			INNER JOIN cmx_proveedores pc ON v.id_conductor=pc.numdoc_nexos
			INNER JOIN cmx_rndc_vehiculos_color col ON v2.color=col.id
			LEFT JOIN cmx_trailer_vehiculo trv ON v.numdoc_vehiculo=trv.id_vehiculo AND trv.estado=1
			LEFT JOIN cmx_estado_bloqueo b ON v.numdoc_vehiculo=b.id_objeto AND tipo_objeto='vehiculo'
			WHERE v.numdoc_vehiculo=:id_vehiculo GROUP BY v.placa");
			$sql->bindParam(':id_vehiculo', $id_vehiculo, PDO::PARAM_STR);
			$sql->execute();
			$resultados = $sql->fetchAll(PDO::FETCH_ASSOC);

			//linea		
			$sql12 =  $this->_db3->prepare("SELECT lni.* FROM cmx_rndc_vehiculos_linea lni
			INNER JOIN cmx_rndc_vehiculos_marcas mca ON lni.id_marca = mca.rndc_id
			 WHERE mca.id= " . $resultados[0]['marca'] . " ORDER BY lni.descripcion ASC");
			$sql12->execute();
			$resultados_lineas = $sql12->fetchAll(PDO::FETCH_ASSOC);

			//carroceria
			$sql13 =  $this->_db3->prepare("SELECT * FROM cmx_rndc_vehiculos_carroceria WHERE estado=1 ORDER BY descripcion ASC");
			$sql13->execute();
			$resultados_carroceria = $sql13->fetchAll(PDO::FETCH_ASSOC);

			$conf_completa = $resultados[0]['v_confi'];
			$sql8 = $this->_db3->prepare("SELECT t.*,c.nombre, c.descripcion FROM cmx_trailer t
					INNER JOIN cmx_rndc_vehiculos_configuracion c ON t.configuracion=c.id
					LEFT JOIN cmx_configuracion_cabezote_trailer ct ON c.nombre=ct.conf_trailer
					WHERE ct.conf_cabezote='" . $conf_completa . "'");
			$sql8->execute();
			$resultados_configuracion_completa = $sql8->fetchAll(PDO::FETCH_ASSOC);
		} catch (\Throwable $th) {
			$this->_db3->rollBack();
			// Captura cualquier excepción generada por PDO
			// y procesa el error para mostrar un mensaje específico al usuario
			$errorCode = $th->getCode(); // Obtén el código de error

			switch ($errorCode) {
				case '42000':
					// SQLSTATE[42000] indica un error de sintaxis SQL
					// Procesa el mensaje de error o muestra uno predeterminado
					$response = false;
					break;
					// Puedes agregar más casos según tus necesidades
				default:
					// Otros códigos de error no específicamente manejados
					// Procesa el mensaje de error o muestra uno predeterminado
					$response = "Se ha producido un error en la ejecución de la consulta.";
					break;
			}
			// Aquí puedes enviar el mensaje de error al frontend
			// Puedes usar echo para enviar el mensaje como respuesta
			// echo $errorMessage;
			throw $th;
		}
		$this->_db3->commit();
		$response = [
			"Resultados" => $resultados,
			"resultados_lineas" => $resultados_lineas,
			"resultados_carroceria" => $resultados_carroceria,
			"resultados_configuracion_completa" => $resultados_configuracion_completa,

		];
		return $response;
	}

	public function Actualizar_Vehiculos($datos)
	{
		$response = [];
		$fecha = date('Y-m-d');
		$hora = date('H:m:s');
		$datetime = $fecha . $hora;

		try {
			$this->_db3->beginTransaction();

			$sql = $this->_db3->prepare("UPDATE cmx_vehiculos SET id_propietario=:docpropi,id_tenedor=:doctenedor,id_conductor=:docconductor,
			web_satelital=:web,usuario_satelital=:usuario,clave_satelital=:clave,tipo_carroceria=:e_tipo_carroceria,cant_viajes=:ecant_viaje,empresa_gps=:empresasatelite
			WHERE numdoc_vehiculo=:id_vehiculo");
			$sql->bindParam(':docpropi', $datos['id_propietario'], PDO::PARAM_STR);
			$sql->bindParam(':doctenedor', $datos['id_tenedor'], PDO::PARAM_STR);
			$sql->bindParam(':docconductor', $datos['id_conductor'], PDO::PARAM_STR);
			$sql->bindParam(':web', $datos['web_satelital'], PDO::PARAM_STR);
			$sql->bindParam(':usuario', $datos['usuario_satelital'], PDO::PARAM_STR);
			$sql->bindParam(':clave', $datos['clave_satelital'], PDO::PARAM_STR);
			$sql->bindParam(':e_tipo_carroceria', $datos['tipo_carroceria'], PDO::PARAM_STR);
			$sql->bindParam(':ecant_viaje', $datos['cant_viaje'], PDO::PARAM_STR);
			$sql->bindParam(':empresasatelite', $datos['empresagps'], PDO::PARAM_STR);
			$sql->bindParam(':id_vehiculo', $datos['num_vehiculo'], PDO::PARAM_STR);
			$sql->execute();
			if ($sql) {
				//datos de la tabla cmx_detalle_vehiculo
				$foto_li1 = "../public/files/vehiculos/" . $datos['num_vehiculo'] . "/TRA/";
				$foto_li2 = "public/files/vehiculos/" . $datos['num_vehiculo'] . "/TRA/";

				$foto_caro1 = "../public/files/vehiculos/" . $datos['num_vehiculo'] . "/F/";
				$foto_caro2 = "public/files/vehiculos/" . $datos['num_vehiculo'] . "/F/";

				$foto_dere1 = "../public/files/vehiculos/" . $datos['num_vehiculo'] . "/D/";
				$foto_dere2 = "public/files/vehiculos/" . $datos['num_vehiculo'] . "/D/";

				$foto_iz1 = "../public/files/vehiculos/" . $datos['num_vehiculo'] . "/I/";
				$foto_iz2 = "public/files/vehiculos/" . $datos['num_vehiculo'] . "/I/";

				$foto_at1 = "../public/files/vehiculos/" . $datos['num_vehiculo'] . "/A/";
				$foto_at2 = "public/files/vehiculos/" . $datos['num_vehiculo'] . "/A/";

				$foto_soat1 = "../public/files/vehiculos/" . $datos['num_vehiculo'] . "/SO/";
				$foto_soat2 = "public/files/vehiculos/" . $datos['num_vehiculo'] . "/SO/";

				$foto_tecno1 = "../public/files/vehiculos/" . $datos['num_vehiculo'] . "/TECNO/";
				$foto_tecno2 = "public/files/vehiculos/" . $datos['num_vehiculo'] . "/TECNO/";

				$sql2 = $this->_db3->prepare("UPDATE cmx_detalle_vehiculo SET tecnomecanica=:tecno,tecno_fecha_expedida=:expetecno, tecno_fecha_vigencia=:vigentecno,foto_vehiculo=:foto_caro2,foto_derecha=:foto_dere2,
			  	foto_izquierda=:foto_iz2,foto_atras=:foto_at2,foto_soat=:foto_soat2,foto_tecno=:foto_tecno2,licencia_transito=:e_ntransito,fecha_expedicion_preoperacional=:fecha_expedicion_preoperacional,
					fecha_vencimiento_preoperacional=:fecha_vencimiento_preoperacional WHERE id_vehiculo=:id_vehiculo");
				$sql2->bindParam(':tecno', $datos['tecnomecanica'], PDO::PARAM_STR);
				$sql2->bindParam(':expetecno', $datos['fecha_tecno'], PDO::PARAM_STR);
				$sql2->bindParam(':vigentecno', $datos['fecha_vig_tecno'], PDO::PARAM_STR);
				$sql2->bindParam(':foto_caro2', $foto_caro2, PDO::PARAM_STR);
				$sql2->bindParam(':foto_dere2', $foto_dere2, PDO::PARAM_STR);
				$sql2->bindParam(':foto_iz2', $foto_iz2, PDO::PARAM_STR);
				$sql2->bindParam(':foto_at2', $foto_at2, PDO::PARAM_STR);
				$sql2->bindParam(':foto_soat2', $foto_soat2, PDO::PARAM_STR);
				$sql2->bindParam(':foto_tecno2', $foto_tecno2, PDO::PARAM_STR);
				$sql2->bindParam(':e_ntransito', $datos['lice_transito'], PDO::PARAM_STR);
				$sql2->bindParam(':fecha_expedicion_preoperacional', $datos['fecha_expedicion_preoperacional'], PDO::PARAM_STR);
				$sql2->bindParam(':fecha_vencimiento_preoperacional', $datos['fecha_vencimiento_preoperacional'], PDO::PARAM_STR);
				$sql2->bindParam(':id_vehiculo', $datos['num_vehiculo'], PDO::PARAM_STR);
				$sql2->execute();

				if ($sql2) {
					//FOTO LICENCIA TRANSITO name_transi

					// Definir rutas
					$ruta_tran = "public/files/vehiculos/" .  $datos['num_vehiculo'] . "/TRA/";
					$ruta_btran = "public/files/vehiculos/" .  $datos['num_vehiculo'] . "/TRA/";

					if ($datos['foto_transi'] !== null && $datos['name_transi'] != '') {
						// Verificar si la carpeta existe, si no, crearla
						if (!is_dir($ruta_tran)) {
							mkdir($ruta_tran, 0777, true);
						}

						// Subir el archivo
						$nombre = $datos['foto_transi']['name'];
						$rutaTemporal = $datos['foto_transi']['tmp_name'];
						$src = $ruta_tran . $nombre;

						if (move_uploaded_file($rutaTemporal, $src)) {
							// Solo ejecutar el query si se subió el archivo correctamente
							$sqlm = $this->_db3->prepare("UPDATE cmx_detalle_vehiculo SET foto_transito='$ruta_btran', name_transito=:name_transito WHERE id_vehiculo=:id_vehiculo");
							$sqlm->bindParam(':name_transito', $datos['name_transi']);
							$sqlm->bindParam(':id_vehiculo', $datos['num_vehiculo']);
							$sqlm->execute();
						} else {
							// Manejo de error si la subida falla
							$mensajeError = "Error al subir el archivo " . $nombre . ". Fecha: " . date("Y-m-d");
							error_log($mensajeError . "\n", 3, "error_log.txt");
						}
					} else {
						// Cuando no hay documentos para subir
						$mensajeError = "No se ha proporcionado un archivo para subir. Fecha: " . date("Y-m-d");
						error_log($mensajeError . "\n", 3, "error_log.txt");
					}

					//FOTO FRONTAL	
					$ruta = "public/files/vehiculos/" .  $datos['num_vehiculo'] . "/F/";
					$ruta_base = "public/files/vehiculos/" .  $datos['num_vehiculo'] . "/F/";

					if ($datos['foto_vehiculo'] !== null && $datos['name_frontal'] != '') {
						// Verificar si la carpeta existe, si no, crearla
						if (!is_dir($ruta)) {
							mkdir($ruta, 0777, true);
						}

						// Subir el archivo
						$nombre = $datos['foto_vehiculo']['name'];
						$rutaTemporal = $datos['foto_vehiculo']['tmp_name'];
						$src = $ruta . $nombre;

						if (move_uploaded_file($rutaTemporal, $src)) {
							// Solo ejecutar el query si se subió el archivo correctamente
							$sqlm = $this->_db3->prepare("UPDATE cmx_detalle_vehiculo SET foto_vehiculo='$ruta_base', name_frontal=:name_frontal WHERE id_vehiculo=:id_vehiculo");
							$sqlm->bindParam(':name_frontal', $datos['name_frontal']);
							$sqlm->bindParam(':id_vehiculo', $datos['num_vehiculo']);
							$sqlm->execute();
						} else {
							// Manejo de error si la subida falla
							$mensajeError = "Error al subir el archivo " . $nombre . ". Fecha: " . date("Y-m-d");
							error_log($mensajeError . "\n", 3, "error_log.txt");
						}
					} else {
						// Cuando no hay documentos para subir
						$mensajeError = "No se ha proporcionado un archivo para subir. Fecha: " . date("Y-m-d");
						error_log($mensajeError . "\n", 3, "error_log.txt");
					}

					//FOTO DERECHA
					$rutad = "public/files/vehiculos/" .  $datos['num_vehiculo'] . "/D/";
					$ruta_based = "public/files/vehiculos/" .  $datos['num_vehiculo'] . "/D/";

					if ($datos['foto_vehiculod'] !== null && $datos['name_derecha'] != '') {
						// Verificar si la carpeta existe, si no, crearla
						if (!is_dir($rutad)) {
							mkdir($rutad, 0777, true);
						}

						// Subir el archivo
						$nombre = $datos['foto_vehiculod']['name'];
						$rutaTemporal = $datos['foto_vehiculod']['tmp_name'];
						$src = $rutad . $nombre;

						if (move_uploaded_file($rutaTemporal, $src)) {
							// Solo ejecutar el query si se subió el archivo correctamente
							$sqlm = $this->_db3->prepare("UPDATE cmx_detalle_vehiculo SET foto_derecha='$ruta_based', name_derecha=:name_derecha WHERE id_vehiculo=:id_vehiculo");
							$sqlm->bindParam(':name_derecha', $datos['name_derecha']);
							$sqlm->bindParam(':id_vehiculo', $datos['num_vehiculo']);
							$sqlm->execute();
						} else {
							// Manejo de error si la subida falla
							$mensajeError = "Error al subir el archivo " . $nombre . ". Fecha: " . date("Y-m-d");
							error_log($mensajeError . "\n", 3, "error_log.txt");
						}
					} else {
						// Cuando no hay documentos para subir
						$mensajeError = "No se ha proporcionado un archivo para subir. Fecha: " . date("Y-m-d");
						error_log($mensajeError . "\n", 3, "error_log.txt");
					}

					//FOTO IZQUIERDA
					$rutaiz = "public/files/vehiculos/" .  $datos['num_vehiculo'] . "/I/";
					$ruta_baseiz = "public/files/vehiculos/" .  $datos['num_vehiculo'] . "/I/";

					if ($datos['foto_vehiculoi'] !== null && $datos['name_izquierda'] != '') {
						// Verificar si la carpeta existe, si no, crearla
						if (!is_dir($rutaiz)) {
							mkdir($rutaiz, 0777, true);
						}

						// Subir el archivo
						$nombre = $datos['foto_vehiculoi']['name'];
						$rutaTemporal = $datos['foto_vehiculoi']['tmp_name'];
						$src = $rutaiz . $nombre;

						if (move_uploaded_file($rutaTemporal, $src)) {
							// Solo ejecutar el query si se subió el archivo correctamente
							$sqlm = $this->_db3->prepare("UPDATE cmx_detalle_vehiculo SET foto_izquierda='$ruta_baseiz', name_izquierda=:name_izquierda WHERE id_vehiculo=:id_vehiculo");
							$sqlm->bindParam(':name_izquierda', $datos['name_izquierda']);
							$sqlm->bindParam(':id_vehiculo', $datos['num_vehiculo']);
							$sqlm->execute();
						} else {
							// Manejo de error si la subida falla
							$mensajeError = "Error al subir el archivo " . $nombre . ". Fecha: " . date("Y-m-d");
							error_log($mensajeError . "\n", 3, "error_log.txt");
						}
					} else {
						// Cuando no hay documentos para subir
						$mensajeError = "No se ha proporcionado un archivo para subir. Fecha: " . date("Y-m-d");
						error_log($mensajeError . "\n", 3, "error_log.txt");
					}

					//FOTO ATRÁS
					$rutat = "public/files/vehiculos/" .  $datos['num_vehiculo'] . "/A/";
					$ruta_baset = "public/files/vehiculos/" .  $datos['num_vehiculo'] . "/A/";

					if ($datos['foto_vehiculoa'] !== null && $datos['name_atras'] != '') {
						// Verificar si la carpeta existe, si no, crearla
						if (!is_dir($rutat)) {
							mkdir($rutat, 0777, true);
						}

						// Subir el archivo
						$nombre = $datos['foto_vehiculoa']['name'];
						$rutaTemporal = $datos['foto_vehiculoa']['tmp_name'];
						$src = $rutat . $nombre;

						if (move_uploaded_file($rutaTemporal, $src)) {
							// Solo ejecutar el query si se subió el archivo correctamente
							$sqlm = $this->_db3->prepare("UPDATE cmx_detalle_vehiculo SET foto_atras='$ruta_baset', name_atras=:name_atras WHERE id_vehiculo=:id_vehiculo");
							$sqlm->bindParam(':name_atras', $datos['name_atras']);
							$sqlm->bindParam(':id_vehiculo', $datos['num_vehiculo']);
							$sqlm->execute();
						} else {
							// Manejo de error si la subida falla
							$mensajeError = "Error al subir el archivo " . $nombre . ". Fecha: " . date("Y-m-d");
							error_log($mensajeError . "\n", 3, "error_log.txt");
						}
					} else {
						// Cuando no hay documentos para subir
						$mensajeError = "No se ha proporcionado un archivo para subir. Fecha: " . date("Y-m-d");
						error_log($mensajeError . "\n", 3, "error_log.txt");
					}

					//foto soat
					$rutaso = "public/files/vehiculos/" .  $datos['num_vehiculo'] . "/SO/";
					$ruta_baseso = "public/files/vehiculos/" .  $datos['num_vehiculo'] . "/SO/";

					if ($datos['foto_soat'] !== null && $datos['name_soat'] != '') {
						// Verificar si la carpeta existe, si no, crearla
						if (!is_dir($rutaso)) {
							mkdir($rutaso, 0777, true);
						}

						// Subir el archivo
						$nombre = $datos['foto_soat']['name'];
						$rutaTemporal = $datos['foto_soat']['tmp_name'];
						$src = $rutaso . $nombre;

						if (move_uploaded_file($rutaTemporal, $src)) {
							// Solo ejecutar el query si se subió el archivo correctamente
							$sqlm = $this->_db3->prepare("UPDATE cmx_detalle_vehiculo SET foto_soat='$ruta_baseso', name_soat=:name_soat WHERE id_vehiculo=:id_vehiculo");
							$sqlm->bindParam(':name_soat', $datos['name_soat']);
							$sqlm->bindParam(':id_vehiculo', $datos['num_vehiculo']);
							$sqlm->execute();
						} else {
							// Manejo de error si la subida falla
							$mensajeError = "Error al subir el archivo " . $nombre . ". Fecha: " . date("Y-m-d");
							error_log($mensajeError . "\n", 3, "error_log.txt");
						}
					} else {
						// Cuando no hay documentos para subir
						$mensajeError = "No se ha proporcionado un archivo para subir. Fecha: " . date("Y-m-d");
						error_log($mensajeError . "\n", 3, "error_log.txt");
					}

					//foto tecnomecanica
					$rutate = "public/files/vehiculos/" .  $datos['num_vehiculo'] . "/TECNO/";
					$ruta_basete = "public/files/vehiculos/" .  $datos['num_vehiculo'] . "/TECNO/";

					if ($datos['foto_tecno'] !== null && $datos['name_tecno'] != '') {
						// Verificar si la carpeta existe, si no, crearla
						if (!is_dir($rutate)) {
							mkdir($rutate, 0777, true);
						}

						// Subir el archivo
						$nombre = $datos['foto_tecno']['name'];
						$rutaTemporal = $datos['foto_tecno']['tmp_name'];
						$src = $rutate . $nombre;

						if (move_uploaded_file($rutaTemporal, $src)) {
							// Solo ejecutar el query si se subió el archivo correctamente
							$sqlm = $this->_db3->prepare("UPDATE cmx_detalle_vehiculo SET foto_tecno='$ruta_basete', name_tecno=:name_tecno WHERE id_vehiculo=:id_vehiculo");
							$sqlm->bindParam(':name_tecno', $datos['name_tecno']);
							$sqlm->bindParam(':id_vehiculo', $datos['num_vehiculo']);
							$sqlm->execute();
						} else {
							// Manejo de error si la subida falla
							$mensajeError = "Error al subir el archivo " . $nombre . ". Fecha: " . date("Y-m-d");
							error_log($mensajeError . "\n", 3, "error_log.txt");
						}
					} else {
						// Cuando no hay documentos para subir
						$mensajeError = "No se ha proporcionado un archivo para subir. Fecha: " . date("Y-m-d");
						error_log($mensajeError . "\n", 3, "error_log.txt");
					}

					//DOCUMENTO KIT DE MERCANCIAS PELIGROSAS
					$rutakit = "public/files/vehiculos/" .  $datos['num_vehiculo'] . "/KIT/";
					$ruta_basekit = "public/files/vehiculos/" .  $datos['num_vehiculo'] . "/KIT/";

					if ($datos['foto_kit_mercancias'] !== null && $datos['name_kit'] != '') {
						// Verificar si la carpeta existe, si no, crearla
						if (!is_dir($rutakit)) {
							mkdir($rutakit, 0777, true);
						}

						// Subir el archivo
						$nombre = $datos['foto_kit_mercancias']['name'];
						$rutaTemporal = $datos['foto_kit_mercancias']['tmp_name'];
						$src = $rutakit . $nombre;

						if (move_uploaded_file($rutaTemporal, $src)) {
							// Solo ejecutar el query si se subió el archivo correctamente
							$sqlm = $this->_db3->prepare("UPDATE cmx_detalle_vehiculo SET documento_kit='$ruta_basekit', nombre_kit=:name_kit WHERE id_vehiculo=:id_vehiculo");
							$sqlm->bindParam(':name_kit', $datos['name_kit']);
							$sqlm->bindParam(':id_vehiculo', $datos['num_vehiculo']);
							$sqlm->execute();
						} else {
							// Manejo de error si la subida falla
							$mensajeError = "Error al subir el archivo " . $nombre . ". Fecha: " . date("Y-m-d");
							error_log($mensajeError . "\n", 3, "error_log.txt");
						}
					} else {
						// Cuando no hay documentos para subir
						$mensajeError = "No se ha proporcionado un archivo para subir. Fecha: " . date("Y-m-d");
						error_log($mensajeError . "\n", 3, "error_log.txt");
					}

					//DOCUMENTO DEL PREOPERACIONAL DEL VEHICULO
					$rutapre = "public/files/vehiculos/" .  $datos['num_vehiculo'] . "/PREO/";
          $ruta_basepre = "public/files/vehiculos/" .  $datos['num_vehiculo'] . "/PREO/";

					if ($datos['documento_preopeacional'] !== null && $datos['name_preoperacional'] != '') {
						// Verificar si la carpeta existe, si no, crearla
						if (!is_dir($rutapre)) {
							mkdir($rutapre, 0777, true);
						}

						// Subir el archivo
						$nombre = $datos['documento_preopeacional']['name'];
						$rutaTemporal = $datos['documento_preopeacional']['tmp_name'];
						$src = $rutapre . $nombre;

						if (move_uploaded_file($rutaTemporal, $src)) {
							// Solo ejecutar el query si se subió el archivo correctamente
							$sqlm = $this->_db3->prepare("UPDATE cmx_detalle_vehiculo SET documento_preopeacional='$ruta_basepre', nombre_preopeacional=:name_preoperacional WHERE id_vehiculo=:id_vehiculo");
							$sqlm->bindParam(':name_preoperacional', $datos['name_preoperacional']);
							$sqlm->bindParam(':id_vehiculo', $datos['num_vehiculo']);
							$sqlm->execute();
						} else {
							// Manejo de error si la subida falla
							$mensajeError = "Error al subir el archivo " . $nombre . ". Fecha: " . date("Y-m-d");
							error_log($mensajeError . "\n", 3, "error_log.txt");
						}
					} else {
						// Cuando no hay documentos para subir
						$mensajeError = "No se ha proporcionado un archivo para subir. Fecha: " . date("Y-m-d");
						error_log($mensajeError . "\n", 3, "error_log.txt");
					}

					//datos de la tabla cmx_vehiculo2
					$sql3 = $this->_db3->prepare("UPDATE cmx_vehiculo2 SET configuracion=:e_configuracion,marca=:e_marca,linea=:e_linea,anio_fabricacion=:e_modelo,color=:e_color,
					peso=:e_peso_vacio,num_chasis=:e_num_chasis,cod_tipo_combustible=:e_tipo_combustible,num_soat=:nsoat,vence_soat=:fechavence,aseguradora=:asegura,
					num_motor=:e_num_motor,poliza_responsabilidad=:e_numerito_poliza,vence_poliza=:e_fecha_poliza,repotenciado=:e_repotenciado,tipo_vinculacion=:e_tipovinculacion,
					fecha_mant_gps=:e_fecha_mantenimientogps,capacidad_tn=:e_capacidad_tn,pesobruto_kg=:e_bruto_kg,f_matricula=:e_fecha_matricula,clase_vehiculo=:e_clasevehiculo WHERE id_vehiculo=:id_vehiculo");
					$sql3->bindParam(':e_configuracion', $datos['configuracion'], PDO::PARAM_STR);
					$sql3->bindParam(':e_marca', $datos['marca'], PDO::PARAM_STR);
					$sql3->bindParam(':e_linea', $datos['linea'], PDO::PARAM_STR);
					$sql3->bindParam(':e_modelo', $datos['modelo'], PDO::PARAM_STR);
					$sql3->bindParam(':e_color', $datos['color'], PDO::PARAM_STR);
					$sql3->bindParam(':e_peso_vacio', $datos['peso_vacio'], PDO::PARAM_STR);
					$sql3->bindParam(':e_num_chasis', $datos['num_chasis'], PDO::PARAM_STR);
					$sql3->bindParam(':e_tipo_combustible', $datos['tipo_combustible'], PDO::PARAM_STR);
					$sql3->bindParam(':nsoat', $datos['numero_soat'], PDO::PARAM_STR);
					$sql3->bindParam(':fechavence', $datos['soat_vencimiento'], PDO::PARAM_STR);
					$sql3->bindParam(':asegura', $datos['aseguradora'], PDO::PARAM_STR);
					$sql3->bindParam(':e_num_motor', $datos['num_motor'], PDO::PARAM_STR);
					$sql3->bindParam(':e_numerito_poliza', $datos['numero_poliza'], PDO::PARAM_STR);
					$sql3->bindParam(':e_fecha_poliza', $datos['fecha_poliza'], PDO::PARAM_STR);
					$sql3->bindParam(':e_repotenciado', $datos['repotenciado'], PDO::PARAM_STR);
					$sql3->bindParam(':e_tipovinculacion', $datos['tipovinculacion'], PDO::PARAM_STR);
					$sql3->bindParam(':e_fecha_mantenimientogps', $datos['fecha_mantenimientogps'], PDO::PARAM_STR);
					$sql3->bindParam(':e_capacidad_tn', $datos['capacidad_tn'], PDO::PARAM_STR);
					$sql3->bindParam(':e_bruto_kg', $datos['peso_bruto'], PDO::PARAM_STR);
					$sql3->bindParam(':e_fecha_matricula', $datos['f_matricula'], PDO::PARAM_STR);
					$sql3->bindParam(':e_clasevehiculo', $datos['clase'], PDO::PARAM_STR);
					$sql3->bindParam(':id_vehiculo', $datos['num_vehiculo'], PDO::PARAM_STR);
					$sql3->execute();
					if ($sql3) {
						/* Validar placa del trailer */
						if ($datos["placa_trailer"] == "") {
							//crear el historico 
							//obtener el ultimo id que pertenezca a la placa
							// $sqlcha = "SELECT MAX(id) AS 'idh' FROM cmx_asignar_conductorvehiculo WHERE cod_vehiculo='" . $placa . "'";
							$sqlcha = $this->_db3->prepare("SELECT id AS 'vehiculo_id' FROM cmx_asignar_conductorvehiculo WHERE cod_vehiculo=:placa ORDER BY id DESC LIMIT 1");
							$sqlcha->bindParam(':placa', $datos['placa'], PDO::PARAM_STR);
							$sqlcha->execute();
							$id_ultimo_historico = $sqlcha->fetch();
							$id_historico = $id_ultimo_historico["vehiculo_id"];

							//actualizar el historico anterior 
							$sqlha = "UPDATE cmx_asignar_conductorvehiculo SET estado=0  WHERE id='$id_historico'";
							$updatehistorico = $this->_db3->prepare($sqlha);
							$result_asignar = $updatehistorico->execute();
							//crear el nuevo historico
							$sqlh = "INSERT INTO cmx_asignar_conductorvehiculo (id,cod_vehiculo,cod_conductor,estado,fecha_actual) VALUES(null,'" . $datos['placa'] . "','" . $datos['id_conductor'] . "','1','" . $fecha . "')";
							$editarhistorico = $this->_db3->prepare($sqlh);
							$result = $editarhistorico->execute();

							$fecha_hora = date('Y-m-d H:i:s');
							//crear el log
							$sqllog = "INSERT INTO cmx_log_vehiculos (id_vehiculo, id_usuario, operacion, fecha_hora_operacion) VALUES (" . $datos['num_vehiculo'] . "," . $datos['id_usuario'] . ",'Editar','" . $fecha_hora . "');  ";
							$editarlog = $this->_db3->prepare($sqllog);
							$result_log = $editarlog->execute();

							$sql_transaccion = "INSERT INTO web_service_RNDC (id,codigo_proceso,tipo,estado_envio_rndc,estado,fecha,hora,usuario) VALUES(null,'" . $datos['num_vehiculo'] . "','Vehiculo',0,1,'" . $fecha . "','" . $hora . "','" . $datos['id_usuario'] . "')";
							$registra_transaccion = $this->_db3->prepare($sql_transaccion);
							$result_transa = $registra_transaccion->execute();
							if ($result && $result_log && $result_asignar && $result_transa) {
								$this->_db3->commit();
								$response = true;
							} else {
								// $this->_db3->rollBack();
								// Falla en la actualización, revertir la transacción
								$response = false;
								$mensajeError = "Error al actualizar vehiculo en el sistema." . date("Y-m-d");
								error_log($mensajeError . "\n", 3, "error_log.txt");
								throw new Exception("Error al guardar proveedor");
							}
						} else {
							//consultar si el trailer esta asociado a un vehiculo
							$sql_a = "SELECT * FROM cmx_trailer_vehiculo WHERE  id_vehiculo=" . $datos['num_vehiculo'] . " AND id_trailer='" . $datos['placa_trailer'] . "'  AND estado=1";
							$editartrailera = $this->_db3->prepare($sql_a);
							$editartrailera->execute();
							$total = $editartrailera->rowCount();

							if ($total == 0) {
								//crear el registro y actualizar el trailer nuevo
								$sql4 = "UPDATE cmx_trailer  SET estado_solicitud='Asignado' WHERE numdoc_trailer='" . $datos['placa_trailer'] . "'";
								$editartrailer1 = $this->_db3->prepare($sql4);
								$result_z = $editartrailer1->execute();
								if ($result_z) {
									$sql10 = $this->_db3->prepare("UPDATE cmx_trailer_vehiculo SET estado=0 WHERE id_trailer=" . $datos['trailer_anterior'] . "");
									// $editartrailer10 = $this->_db3->prepare($sql10);
									$sql10->execute();

									$sql5 = "INSERT INTO cmx_trailer_vehiculo (id,id_vehiculo,id_trailer,estado,fecha,hora,usuario)
																VALUES(NULL," . $datos['num_vehiculo'] . ",'" . $datos['placa_trailer'] . "',1,'" . $fecha . "','" . $hora . "'," . $datos['id_usuario'] . ")";
									$editartrailer2 = $this->_db3->prepare($sql5);
									$result = $editartrailer2->execute();
								}
							} else {
								// echo 'existe registro';
								//validar si el trailer nuevo es igual al viejito
								if (isset($datos['trailer_anterior']) && $datos['trailer_anterior'] != '') {
									if ($datos['placa_trailer'] !=  $datos['trailer_anterior']) {
										//actualizar el nuevo por asignado y cmx_trailer_vehiculo por 1
										$sql8 = "UPDATE cmx_trailer SET estado_solicitud='Asignado' WHERE numdoc_trailer=" . $datos['placa_trailer'] . "";
										$editartrailer8 = $this->_db3->prepare($sql8);
										$result8 = $editartrailer8->execute();

										$estado_up = 0;
										$sql10 = "UPDATE cmx_trailer_vehiculo SET estado=0 WHERE id_trailer=" . $datos['trailer_anterior'] . "";
										$editartrailer10 = $this->_db3->prepare($sql10);
										$result10 = $editartrailer10->execute();

										$sql9 = "UPDATE cmx_trailer_vehiculo SET estado=1 WHERE id_trailer=" . $datos['placa_trailer'] . "";
										$editartrailer9 = $this->_db3->prepare($sql9);
										$result9 = $editartrailer9->execute();
									} else {
										// echo 'trailer viejito y nuevo son iguales';
										//si son iguales update normal solo en tabla de trailer
										$sql10 = "UPDATE cmx_trailer SET estado_solicitud='Asignado' WHERE numdoc_trailer=" . $datos['placa_trailer'] . "";
										$editartrailer10 = $this->_db3->prepare($sql10);
										$result = $editartrailer10->execute();
									}
								}
							}

							//crear el historico 
							//obtener el ultimo id que pertenezca a la placa
							// $sqlcha = "SELECT MAX(id) AS 'idh' FROM cmx_asignar_conductorvehiculo WHERE cod_vehiculo='" . $placa . "'";
							$sqlcha = $this->_db3->prepare("SELECT id AS 'vehiculo_id' FROM cmx_asignar_conductorvehiculo WHERE cod_vehiculo=:placa ORDER BY id DESC LIMIT 1");
							$sqlcha->bindParam(':placa', $datos['placa'], PDO::PARAM_STR);
							$sqlcha->execute();
							$id_ultimo_historico = $sqlcha->fetch();
							$id_historico = $id_ultimo_historico["vehiculo_id"];

							//actualizar el historico anterior 
							$sqlha = "UPDATE cmx_asignar_conductorvehiculo SET estado=0 WHERE id='$id_historico'";
							$updatehistorico = $this->_db3->prepare($sqlha);
							$result_asignar = $updatehistorico->execute();
							//crear el nuevo historico
							$sqlh = "INSERT INTO cmx_asignar_conductorvehiculo (id,cod_vehiculo,cod_conductor,estado,fecha_actual) VALUES(null,'" . $datos['placa'] . "','" . $datos['id_conductor'] . "','1','" . $fecha . "')";
							$editarhistorico = $this->_db3->prepare($sqlh);
							$result = $editarhistorico->execute();

							//crear el log
							$fecha_hora_log = date('Y-m-d H:i:s');
							$sqllog = "INSERT INTO cmx_log_vehiculos (id_vehiculo, id_usuario, operacion, fecha_hora_operacion) VALUES (" . $datos['num_vehiculo'] . "," . $datos['id_usuario'] . ",'Editar','" . $fecha_hora_log . "');  ";
							$editarlog = $this->_db3->prepare($sqllog);
							$result_log = $editarlog->execute();

							$sql_transaccion = "INSERT INTO web_service_RNDC (id,codigo_proceso,tipo,estado_envio_rndc,estado,fecha,hora,usuario) VALUES(null,'" . $datos['num_vehiculo'] . "','Vehiculo',0,1,'" . $fecha . "','" . $hora . "','" . $datos['id_usuario'] . "')";
							$registra_transaccion = $this->_db3->prepare($sql_transaccion);
							$result_transa = $registra_transaccion->execute();
							if ($result && $result_log && $result_asignar && $result_transa) {
								$this->_db3->commit();
								$response = true;
							} else {
								$this->_db3->rollBack();
								// Falla en la actualización, revertir la transacción
								$response = false;
								$mensajeError = "Error al actualizar vehiculo en el sistema." . date("Y-m-d");
								error_log($mensajeError . "\n", 3, "error_log.txt");
								throw new Exception("Error al guardar proveedor");
							}
						}
					} else {
						// Falla en la actualización, revertir la transacción
						// Puedes lanzar una excepción específica aquí si lo deseas
						$mensajeError = "Error al actualizar el detalle del vehiculo 2." . date("Y-m-d");
						error_log($mensajeError . "\n", 3, "error_log.txt");
						throw new Exception("Error al guardar proveedor");
					}
				} else {
					// Falla en la actualización, revertir la transacción
					// Puedes lanzar una excepción específica aquí si lo deseas
					$mensajeError = "Error al actualizar el detalle del vehiculo." . date("Y-m-d");
					error_log($mensajeError . "\n", 3, "error_log.txt");
					throw new Exception("Error al guardar proveedor");
				}
			} else {
				// Falla en la actualización, revertir la transacción
				// Puedes lanzar una excepción específica aquí si lo deseas
				$mensajeError = "Error al actualizar el vehiculo en la tabla principal." . date("Y-m-d");
				error_log($mensajeError . "\n", 3, "error_log.txt");
				throw new Exception("Error al guardar proveedor");
			}
		} catch (\Throwable $th) {
			$this->_db3->rollBack();
			// Manejar la excepción
			// Puedes mostrar un mensaje de error o registrar la excepción en un archivo de registro
			// echo "Error: " . $th->getMessage();
			// O simplemente relanzar la excepción si deseas propagarla
			$mensajeError = "Error en el proceso." . date("Y-m.d");
			error_log($mensajeError . "\n", 3, "error_log.txt");
			throw $th;
		}
		// $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $response;
	}
	public function Buscar_Datos_Proveedores($placa)
	{
		$fecha = date('Y-m-d');
		$sql = $this->_db3->prepare("SELECT vp.nombre_propietario,vp.nombre_tenedor,vp.nombre_conductor, pro.numdoc_nexos AS 'propietario_id', pos.numdoc_nexos AS 'Poseedor_id',
		cond.numdoc_nexos AS 'Coductor_id'
		FROM cmx_vehiculos_preestudio vp
		INNER JOIN cmx_solicitudes_estados se ON vp.id=se.id_solicitud AND se.estado_actual=1
		INNER JOIN cmx_proveedores pro ON vp.documento_propietario=pro.numero_documento -- Propietario
		INNER JOIN cmx_proveedores pos ON vp.documento_tenedor=pos.numero_documento -- Poseedor
		INNER JOIN cmx_proveedores cond ON vp.documento_conductor=cond.numero_documento -- Conductor
		-- LEFT  JOIN cmx_proveedores pt ON vp.documento_propietario_trailer=pt.numero_documento -- Propietario Trailer
		WHERE vp.placa_vehiculo=:placa AND vp.fecha=:fecha AND se.estado='aprobado'");
		$sql->bindParam(':placa', $placa, PDO::PARAM_STR);
		$sql->bindParam(':fecha', $fecha, PDO::PARAM_STR);
		$sql->execute();
		$resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $resultados;
	}
}
