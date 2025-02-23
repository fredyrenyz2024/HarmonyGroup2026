<?php
include '../application/Conexion.php';
require_once '../application/Config.php';
session_start();
	class Aprobaciones
	{

		public $user_log;
		public $pass;
		public $mensaje;
		public $respuesta;
		public $email;
		public $listado;

		public function buscarAgrupamientovehiculos (){
			$id_usuario = $_SESSION["usuario"]["id_usuario"];
			$id_agrupacion = $_POST["id_agrupacion"];
			$model    = new Conexion;
			$conexion = $model->conectar();
			$sql      = "   SELECT cav.*,cv.placa 
							FROM cmx_agrupaciones_vehiculos cav,cmx_vehiculos cv
							WHERE id_agrupacion = $id_agrupacion
							AND cav.id_vehiculo = cv.id
							GROUP BY cav.id ";
			$buscar_vehiculo = $conexion->prepare($sql);
			$buscar_vehiculo->execute();
			$total         = $buscar_vehiculo->rowCount();
			if ($buscar_vehiculo) {
				$return['content']= array();
				while($agrupaciones_vehiculos = $buscar_vehiculo->fetch()){
					$return['content'][]= $agrupaciones_vehiculos;
				}
				$return['success'] = true;
			} else {
				$return['success'] = false;
				$return['error'] = "Error al generar la solicitud";
			}
			return $return;
		}

		public function cargarvehiculos (){
			$id_agrupacion = $_POST["id_agrupacion"];
			$sql = "SELECT * FROM cmx_agrupaciones ca, cmx_agrupacion_solicitudes cas
					WHERE ca.id = cas.id_agrupacion 
					AND ca.id = $id_agrupacion
					GROUP BY ca.id 
					LIMIT 1";
			$model    = new Conexion;
			$conexion = $model->conectar();
			$consulta = $conexion->prepare($sql);
			$consulta->execute();
			$total         = $consulta->rowCount();
			if ($total == 0) {
			} else {
				$return["success"]= true;
				$return["content"] = array();
				$datos_agrupacion = $consulta->fetch();
				$id_agrupacion = $_POST["id_agrupacion"];
				$sql = "SELECT cv.* 
						FROM cmx_vehiculos cv, cmx_proveedores cp,  cmx_proveedores cp1,  cmx_proveedores cp2
						WHERE cv.tipo_vehiculo = '".$datos_agrupacion["tipo_vehiculo"]."'
						AND cv.estado = 'Activo'
						AND cp.id= cv.id_propietario 
						AND cp1.id= cv.id_tenedor 
						AND cp2.id= cv.id_conductor
						AND cp.estado ='Activo' 
						AND cp1.estado ='Activo'
						AND cp2.estado ='Activo' ";
				$model    = new Conexion;
				$conexion = $model->conectar();
				$consulta_vehiculos = $conexion->prepare($sql);
				$consulta_vehiculos->execute();
				$total_vehiculos = $consulta_vehiculos->rowCount();
				if ($total_vehiculos == 0) {
				} else {
					$return["success"]= true;
					while ($datos_vehiculo = $consulta_vehiculos->fetch()) {
						$sql = "SELECT * FROM cmx_vehiculos 
								WHERE ((id_propietario IN(".$datos_vehiculo["id_propietario"].",".$datos_vehiculo["id_tenedor"].",".$datos_vehiculo["id_conductor"]."))
								OR (id_tenedor IN(".$datos_vehiculo["id_propietario"].",".$datos_vehiculo["id_tenedor"].",".$datos_vehiculo["id_conductor"]."))
								OR (id_conductor  IN(".$datos_vehiculo["id_propietario"].",".$datos_vehiculo["id_tenedor"].",".$datos_vehiculo["id_conductor"].")))
								AND estado = 'Inactivo' ";
						$ver_vehiculos = $conexion->prepare($sql);
						$ver_vehiculos->execute();
						$total_vehiculos_inactivos = $ver_vehiculos->rowCount();
						$sql = "SELECT * FROM cmx_agrupaciones_vehiculos WHERE id_vehiculo = ".$datos_vehiculo["id"]." AND estado <> 'Cancelado' AND id_agrupacion = $id_agrupacion";
						$ver_vehiculos_asignados = $conexion->prepare($sql);
						$ver_vehiculos_asignados->execute();
						$total_vehiculos_asignados = $ver_vehiculos_asignados->rowCount();
						if($total_vehiculos_inactivos == 0){
							if($total_vehiculos_asignados == 0){
								$return["content"][]["placa"]= $datos_vehiculo["placa"];
							}
						}else{
						}
					}
				}
			}
			return $return;
		}

		public function obtenerdatosvehiculos (){
			$placa = $_POST["placa"];
			$sql = "SELECT * FROM cmx_vehiculos WHERE placa = '$placa' LIMIT 1";
			$model    = new Conexion;
			$conexion = $model->conectar();
			$consulta = $conexion->prepare($sql);
			$consulta->execute();
			$total         = $consulta->rowCount();
			if ($total == 0) {
			} else {
				$return["success"]= true;
				$datos_vehiculo = $consulta->fetch();
				$return["content"] = $datos_vehiculo;
			}
			return $return;
		}

		public function crearAsignacion (){
			$id_agrupacion = $_POST["id_agrupacion"];
			$id_vehiculo = $_POST["id_vehiculo"];
			$flete = $_POST["flete"];
			$tipo_tramite = $_POST["tipo_tramite"];
			$id_usuario = $_SESSION["usuario"]["id_usuario"];
			$model    = new Conexion;
			$conexion = $model->conectar(); 
			$sql      = " INSERT INTO cmx_agrupaciones_vehiculos (id_agrupacion,id_usuario,flete, tipo_tramite,id_vehiculo,estado,fecha_hora_operacion,observaciones)
							VALUES ($id_agrupacion,$id_usuario,'$flete','$tipo_tramite',$id_vehiculo,'Asignado',NOW(),'')";
			$crearVehiculo = $conexion->prepare($sql);
			$result=$crearVehiculo->execute();
			if ($result) {
				$return["success"]= true;
			} else {
				$return['success'] = false;
				$return['error'] = "Error al generar la solicitud";
			}
			return $return;
		}

		public function cancelarAsignacion (){
			$id_asignacion = $_POST["id_asignacion"];
			$model    = new Conexion;
			$conexion = $model->conectar();
			$sql      = " UPDATE cmx_agrupaciones_vehiculos SET estado= 'Cancelado' WHERE id= $id_asignacion";
			$cancela_asignacion = $conexion->prepare($sql);
			$cancela_asignacion->execute(); 
			$return["success"]=true;
			return $return;
		}

		public function cambiarestadoAsignacion (){
			$Data = new Consultas;

			$usuario = $_SESSION["usuario"];
			$id_usuario = $usuario["id_usuario"];

			$fecha_hora = date('Y-m-d H:i:s', time());

			$id_asignacion = $_POST["id_asignacion"];
			$flete = $_POST["flete"];
			$id_vehiculo = $_POST["id_vehiculo"];
			$estado = $_POST["estado"];
			$estado_log = "";
			if (isset($_POST["estado_log"])) {
				$estado_log = $_POST["estado_log"];
			}
			$observaciones = "";
			if ( isset($_POST["observaciones"]) ) {
				$observaciones = $_POST["observaciones"];
			}

			$array = array();
			$array["estado"] = $estado;
			$array["flete"] = $flete;
			$result = $Data->updateRegistro("cmx_agrupaciones_vehiculos", $array, $id_asignacion);

			if ( $result ) {
				// Se guarda en el log la actividad realizada
				$array = array();
				$array["id_agrupacion_vehiculo"] = $id_asignacion;
				$array["fecha_hora"] = $fecha_hora;
				$array["id_usuario"] = $id_usuario;
				$array["observacion"] = $observaciones;
				$array["estado"] = $estado_log;
				$Data->setRegistro("cmx_agrupaciones_vehiculos_log", $array);

				// Se cambia el estado del enturnamiento si este existe 
				$sql = " 
					SELECT 
						cae.id
					FROM 
						cmx_vehiculos cv
						INNER JOIN cmx_app_enturnamientos cae ON cae.id_conductor = cv.id_conductor
					WHERE 
						cv.id = $id_vehiculo
						AND cv.estado = 'Activo'
				";
				$result_01 = $Data->getConsulta($sql);

				if ( $result_01 ) {
					$array = array();
					$array["estado"] = $estado;
					$result_01 = $Data->updateRegistro("cmx_app_enturnamientos", $array, $result_01["rowsData"][0][0]);
				}
			}

			// Si el estado es Aprobado se gestiona las actividades
			if($estado =="Aprobado"){
				// Se busca la informacion de las actividades del material para su gestion en proyectos
				$sql ="
					SELECT 
						cia.*, cam.orden_actividad
					FROM 
						cmx_agrupaciones_vehiculos cav
						INNER JOIN cmx_agrupaciones ca ON ca.id = cav.id_agrupacion
						INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = ca.id
						INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cam.id_material_proyecto
					WHERE 
						cav.id = " . $id_asignacion . "
						AND cia.estado = 2
						AND cia.nombre = 'Aprobar Vehículo';
				";

				$resultActividades = $Data->getConsulta($sql);
				foreach ($resultActividades["rowsData"] as $key => $value) {
					$_flag_actividad = false;

					$arrayActividadesBloque = explode(",", $value["orden_actividad"] );
					foreach ($arrayActividadesBloque as $key_01 => $value_01) {
						if ($value["orden"] == $value_01) {
							$_flag_actividad = true;
							break;
						}
					}

					if ($_flag_actividad) {
						if ( isset($arrayActividades[ $value["id_importacion"] ]["id"]) ) {
							$arrayActividades[ $value["id_importacion"] ]["id"].= $value["id"] . ",";
						} else {
							$arrayActividades[ $value["id_importacion"] ]["id"] = $value["id"] . ",";
						}

						if ( isset($arrayActividades[ $value["id_importacion"] ]["id_material"]) ) {
							$arrayActividades[ $value["id_importacion"] ]["id_material"].= $value["id_material"] . ",";
						} else {
							$arrayActividades[ $value["id_importacion"] ]["id_material"] = $value["id_material"] . ",";
						}

						$arrayActividades[ $value["id_importacion"] ]["id_importacion"] = $value["id_importacion"];
						$arrayActividades[ $value["id_importacion"] ]["orden"] = $value["orden"];
						$arrayActividades[ $value["id_importacion"] ]["tipo_actividad"] = $value["tipo_actividad"];
						$arrayActividades[ $value["id_importacion"] ]["fecha_hora_inicio"] = $value["fecha_hora_inicio"];
						$arrayActividades[ $value["id_importacion"] ]["costo_real"] = $value["costo_real"];
						$arrayActividades[ $value["id_importacion"] ]["respuesta"] = $value["costo_real"];
					}
				}			

				$cant_importaciones = 0;
				foreach ($arrayActividades as $key => $value) {
					$actividades[$cant_importaciones]["id"] = $value["id"];
					$actividades[$cant_importaciones]["id_material"] = $value["id_material"];
					$actividades[$cant_importaciones]["id_importacion"] = $value["id_importacion"];
					$actividades[$cant_importaciones]["orden"] = $value["orden"];
					$actividades[$cant_importaciones]["tipo_actividad"] = $value["tipo_actividad"];
					$actividades[$cant_importaciones]["fecha_hora_inicio"] = $value["fecha_hora_inicio"];
					$actividades[$cant_importaciones]["costo_real"] = $value["costo_real"];
					$actividades[$cant_importaciones]["respuesta"] = $value["costo_real"];

					$cant_importaciones++;
				}
				$return["actividades"] = $actividades;
			}
			$return["success"]=true;
			return $return;
		}

		public function verasignacion() {
			$Data = new Consultas;

			$usuario = $_SESSION["usuario"];
			$id_usuario = $usuario["id_usuario"];

			$fecha_hora = date('Y-m-d H:i:s', time());
			$id_asignacion = $_POST["id_asignacion"];

			$sql = ' 
				SELECT * 
				FROM cmx_agrupaciones_vehiculos 
				WHERE id= ' . $id_asignacion . ' 
				LIMIT 1
			';
			$result = $Data->getConsulta($sql);
			$datos_asignacion = $result["rowsData"][0];
			$return["content"]= $datos_asignacion;

			// Se muestra el contenido de los movimientos realizados a la asignación
			$return["content"]["table"] = $this->observacionesAsignacion($Data, $id_asignacion);

			$return["success"]=true;
			return $return;
		}

		public function verVehiculo (){
			$id_usuario = $_SESSION["usuario"]["id_usuario"];
			$id_vehiculo = $_POST["id_vehiculo"];
			$id_agrupacion = $_POST["id_agrupacion"];
			$_msg_error = "";

			$Data = new Consultas;

			$model    = new Conexion;
			$conexion = $model->conectar();
			$sql = "
				SELECT 
					cv.*,
					ca.numero_agrupacion,
					ctv.nombre NOMBRE_TIPO_VEHICULO,
					IF(
						cp.tipo_documento = 'NIT',
						CONCAT(cp.numero_documento,'-',cp.digito_verificacion),
						cp.numero_documento
					) DOCUMENTO_PROPIETARIO, cp.nombre NOMBRE_PROPIETARIO,
					cp.contacto CONTACTO_PROPIETARIO, cp.celular CELULAR_PROPIETARIO, cp.direccion DIRECCION_PROPIETARIO, cp.email EMAIL_PROPIETARIO,
					(
						SELECT 
							CONCAT(cm1.municipio,' (',cm1.depto,' - ',cm1.pais,')')
						FROM 
							cmx_municipios cm1
						WHERE
							cm1.id = cp.id_municipio
					) CIUDAD_PROPIETARIO,
					IF(
						cp1.tipo_documento = 'NIT',
						CONCAT(cp1.numero_documento,'-',cp1.digito_verificacion),
						cp1.numero_documento
					) DOCUMENTO_TENEDOR, cp1.nombre NOMBRE_TENEDOR,
					cp1.contacto CONTACTO_TENEDOR, cp1.celular CELULAR_TENEDOR, cp1.direccion DIRECCION_TENEDOR, cp1.email EMAIL_TENEDOR,
					(
						SELECT 
							CONCAT(cm1.municipio,' (',cm1.depto,' - ',cm1.pais,')')
						FROM 
							cmx_municipios cm1
						WHERE
							cm1.id = cp1.id_municipio
					) CIUDAD_TENEDOR,
					IF(
						cp2.tipo_documento = 'NIT',
						CONCAT(cp2.numero_documento,'-',cp2.digito_verificacion),
						cp2.numero_documento
					) DOCUMENTO_CONDUCTOR, cp2.nombre NOMBRE_CONDUCTOR,
					cp2.contacto CONTACTO_CONDUCTOR, cp2.celular CELULAR_CONDUCTOR, cp2.direccion DIRECCION_CONDUCTOR, cp2.email EMAIL_CONDUCTOR,
					cp2.rndc_categoria_licencia, cp2.rndc_numero_licencia, cp2.rndc_vencimiento_licencia, cp2.referencias_empresariales, cp2.referencias_personales,
					(
						SELECT 
							CONCAT(cm1.municipio,' (',cm1.depto,' - ',cm1.pais,')')
						FROM 
							cmx_municipios cm1
						WHERE
							cm1.id = cp2.id_municipio
					) CIUDAD_CONDUCTOR,
					cav.tipo_tramite, cav.estado
				FROM 
					cmx_vehiculos cv
					INNER JOIN cmx_proveedores cp ON cp.id = cv.id_propietario
					INNER JOIN cmx_proveedores cp1 ON cp1.id = cv.id_tenedor
					INNER JOIN cmx_proveedores cp2 ON cp2.id = cv.id_conductor
					INNER JOIN cmx_agrupaciones_vehiculos cav ON cav.id_vehiculo = cv.id
					INNER JOIN cmx_agrupaciones ca ON ca.id = cav.id_agrupacion
					INNER JOIN cmx_tipo_vehiculos ctv ON ctv.id = cv.tipo_vehiculo
				WHERE 
					cv.id = $id_vehiculo 
					AND cav.id = $id_agrupacion
			";
			$result = $Data->getConsulta($sql);

			if ( $result ) {
				$return['success'] = true;
				$return["title"] = '';
				$return["content"] = '';
				foreach ($result["rowsData"] as $key => $value) {
					$return["title"].= $value["numero_agrupacion"];

					/******** SE FILTRA CONTENIDO DE LA INFORMACIÓN ********/
					$_tipo_carroceria = "";
					if ( $value["tipo_carroceria"] ) {
						$_tipo_carroceria = '(' . $value["tipo_carroceria"] . ')';
					}

					/***** INFORMACIÓN DEL VEHÍCULO *****/
					$_web_satelital = '';
					if ( $value["web_satelital"] ) {
						$_web_satelital = '
							<div class="col-sm-4">
								<span>Web satelital</span>
								<span class="cell-detail-description"><a href=' . $value["web_satelital"] . ' target="blank">' . $value["web_satelital"] . '</a></span>
							</div>
						';
					}
					
					$_usuario_satelital = '';
					if ( $value["usuario_satelital"] ) {
						$_usuario_satelital = '
							<div class="col-sm-4">
								<span>Usuario satelital</span>
								<span class="cell-detail-description">' . $value["usuario_satelital"] . '</span>
							</div>
						';
					}

					$_clave_satelital = '';
					if ( $value["clave_satelital"] ) {
						$_clave_satelital = '
							<div class="col-sm-4">
								<span>Clave satelital</span>
								<span class="cell-detail-description">' . $value["clave_satelital"] . '</span>
							</div>
						';
					}

					// Se busca la información del vehículo en el rndc
					$rndc_vehiculo = rndc_buscaVehiculo( $value["rndc_id"] );
					$return["rndc_vehiculo"] = $rndc_vehiculo;

					if ( isset($rndc_vehiculo["error"]) ) {
						$_msg_error.= "<p><strong>Registro no encontrado en RNDC - Vehículo.</strong></p>";
						$_msg_error.= $rndc_vehiculo["error"];
					}else{
						$vehiculo_marca = $rndc_vehiculo["rndc_result"]["rndc_vehiculo_marca"]["marca"] . " " . $rndc_vehiculo["rndc_result"]["rndc_vehiculo_linea"]["descripcion"];
						$vehiculo_modelo = $rndc_vehiculo["rndc_result"]["anofabricacionvehiculocarga"];
						$vehiculo_configuracion = $rndc_vehiculo["rndc_result"]["rndc_vehiculo_carroceria"]["descripcion"] . " - " . $rndc_vehiculo["rndc_result"]["rndc_vehiculo_configuracion"]["descripcion"];
						$vehiculo_color = $rndc_vehiculo["rndc_result"]["rndc_vehiculo_color"]["color"];
						$vehiculo_capacidad = "";
						if ( $rndc_vehiculo["rndc_result"]["capacidadunidadcarga"] ) {
							$vehiculo_capacidad = $rndc_vehiculo["rndc_result"]["capacidadunidadcarga"];
						}
						$vehiculo_peso_vacio = $rndc_vehiculo["rndc_result"]["pesovehiculovacio"];
						$vehiculo_aseguradora = $rndc_vehiculo["rndc_result"]["rndc_vehiculo_aseguradora"]["nombre"];
						$vehiculo_numero_seguro = $rndc_vehiculo["rndc_result"]["numsegurosoat"];
						$vehiculo_vence_seguro = $rndc_vehiculo["rndc_result"]["fechavencimientosoat"];
					}

					/***** INFORMACIÓN DEL PROPIETARIO *****/
					$_contacto_propietario = '';
					if ( $value["CONTACTO_PROPIETARIO"] ) {
						$_contacto_propietario = '
							<div class="col-sm-2">
								<span>Teléfono</span>
								<span class="cell-detail-description">' . $value["CONTACTO_PROPIETARIO"] . '</span>
							</div>
						';
					}

					$_celular_propietario = '';
					if ( $value["CELULAR_PROPIETARIO"] ) {
						$_celular_propietario = '
							<div class="col-sm-2">
								<span>Celular</span>
								<span class="cell-detail-description">' . $value["CELULAR_PROPIETARIO"] . '</span>
							</div>
						';
					}

					$_email_propietario = '';
					if ( $value["EMAIL_PROPIETARIO"] ) {
						$_email_propietario = '
							<br />
							<div class="row">
								<div class="col-sm-3">
									<span>E-mail</span>
									<span class="cell-detail-description">' . $value["EMAIL_PROPIETARIO"] . '</span>
								</div>
							</div>

						';
					}

					/***** INFORMACIÓN DEL TENEDOR *****/
					$_contacto_tenedor = '';
					if ( $value["CONTACTO_TENEDOR"] ) {
						$_contacto_tenedor = '
							<div class="col-sm-2">
								<span>Teléfono</span>
								<span class="cell-detail-description">' . $value["CONTACTO_TENEDOR"] . '</span>
							</div>
						';
					}

					$_celular_tenedor = '';
					if ( $value["CELULAR_TENEDOR"] ) {
						$_celular_tenedor = '
							<div class="col-sm-2">
								<span>Celular</span>
								<span class="cell-detail-description">' . $value["CELULAR_TENEDOR"] . '</span>
							</div>
						';
					}

					$_email_tenedor = '';
					if ( $value["EMAIL_TENEDOR"] ) {
						$_email_tenedor = '
							<br />
							<div class="row">
								<div class="col-sm-3">
									<span>E-mail</span>
									<span class="cell-detail-description">' . $value["EMAIL_TENEDOR"] . '</span>
								</div>
							</div>

						';
					}

					/***** INFORMACIÓN DEL TENEDOR *****/
					$_contacto_conductor = '';
					if ( $value["CONTACTO_CONDUCTOR"] ) {
						$_contacto_conductor = '
							<div class="col-sm-2">
								<span>Teléfono</span>
								<span class="cell-detail-description">' . $value["CONTACTO_CONDUCTOR"] . '</span>
							</div>
						';
					}

					$_celular_conductor = '';
					if ( $value["CELULAR_CONDUCTOR"] ) {
						$_celular_conductor = '
							<div class="col-sm-2">
								<span>Celular</span>
								<span class="cell-detail-description">' . $value["CELULAR_CONDUCTOR"] . '</span>
							</div>
						';
					}

					$_email_conductor = '';
					if ( $value["EMAIL_CONDUCTOR"] ) {
						$_email_conductor = '
							<br />
							<div class="row">
								<div class="col-sm-3">
									<span>E-mail</span>
									<span class="cell-detail-description">' . $value["EMAIL_CONDUCTOR"] . '</span>
								</div>
							</div>
						';
					}
					/******** FIN - SE FILTRA CONTENIDO DE LA INFORMACIÓN ********/

					$return["content"].= '
						<div class="panel panel-border panel-contrast">
							<div class="panel-heading panel-heading-contrast">
								Vehículo # ' . $value["placa"] . '
								<span class="panel-subtitle">' . $value["NOMBRE_TIPO_VEHICULO"] . ' ' . $_tipo_carroceria . '</span>
							</div>
							<div class="panel-body">
								<strong>Información Vehículo</strong>
								<table class="table">
									<tbody>
										<tr>
											<td class="cell-detail">
												<div class="row">
													<div class="col-sm-4">
														<span>' . $vehiculo_marca . '</span>
														<span class="cell-detail-description">Modelo: ' . $vehiculo_modelo . '</span>
													</div>
													<div class="col-sm-4">
														<span>' . $vehiculo_configuracion . '</span>
														<span class="cell-detail-description">Color: ' . $vehiculo_color . '</span>
													</div>
													<div class="col-sm-4">
														<span>Capacidad: ' . $vehiculo_capacidad . ' Kg.</span>
														<span class="cell-detail-description">Peso Vacío: ' . $vehiculo_peso_vacio . ' Kg.</span>
													</div>
												</div>
												<br />
												<div class="row">
													<div class="col-sm-4">
														<span>Aseguradora SOAT</span>
														<span class="cell-detail-description">' . $vehiculo_aseguradora . '</span>
													</div>
													<div class="col-sm-4">
														<span># Seguro SOAT</span>
														<span class="cell-detail-description">' . $vehiculo_numero_seguro . '</span>
													</div>
													<div class="col-sm-4">
														<span>Vencimiento Seguro SOAT</span>
														<span class="cell-detail-description">' . $vehiculo_vence_seguro . '</span>
													</div>
												</div>
												<br />
												<div class="row">
													' . $_web_satelital . '
													' . $_usuario_satelital . '
													' . $_clave_satelital . '
												</div>
											</td>
										</tr>
										<tr><td></td></tr>
									</tbody>
								</table>
								<strong>Información Propietario</strong>
								<table class="table">
									<tbody>
										<tr>
											<td class="cell-detail">
												<div class="row">
													<div class="col-sm-3">
														<span>' . $value["NOMBRE_PROPIETARIO"] . '</span>
														<span class="cell-detail-description">' . $value["DOCUMENTO_PROPIETARIO"] . '</span>
													</div>
													<div class="col-sm-5">
														<span>' . $value["DIRECCION_PROPIETARIO"] . '</span>
														<span class="cell-detail-description">' . $value["CIUDAD_PROPIETARIO"] . '</span>
													</div>
													' . $_contacto_propietario . '
													' . $_celular_propietario . '
												</div>
												' . $_email_propietario . '
											</td>
										</tr>
										<tr><td></td></tr>
									</tbody>
								</table>
								<strong>Información Tenedor</strong>
								<table class="table">
									<tbody>
										<tr>
											<td class="cell-detail">
												<div class="row">
													<div class="col-sm-3">
														<span>' . $value["NOMBRE_TENEDOR"] . '</span>
														<span class="cell-detail-description">' . $value["DOCUMENTO_TENEDOR"] . '</span>
													</div>
													<div class="col-sm-5">
														<span>' . $value["DIRECCION_TENEDOR"] . '</span>
														<span class="cell-detail-description">' . $value["CIUDAD_TENEDOR"] . '</span>
													</div>
													' . $_contacto_tenedor . '
													' . $_celular_tenedor . '
												</div>
												' . $_email_tenedor . '
											</td>
										</tr>
										<tr><td></td></tr>
									</tbody>
								</table>
								<strong>Información Conductor</strong>
								<table class="table">
									<tbody>
										<tr>
											<td class="cell-detail">
												<div class="row">
													<div class="col-sm-3">
														<span>' . $value["NOMBRE_CONDUCTOR"] . '</span>
														<span class="cell-detail-description">' . $value["DOCUMENTO_CONDUCTOR"] . '</span>
													</div>
													<div class="col-sm-5">
														<span>' . $value["DIRECCION_CONDUCTOR"] . '</span>
														<span class="cell-detail-description">' . $value["CIUDAD_CONDUCTOR"] . '</span>
													</div>
													' . $_contacto_conductor . '
													' . $_celular_conductor . '
												</div>
												' . $_email_conductor . '
												<br />
												<div class="row">
													<div class="col-sm-4">
														<span># Licencia</span>
														<span class="cell-detail-description">' . $value["rndc_numero_licencia"] . '</span>
													</div>
													<div class="col-sm-4">
														<span>Categoría Licencia</span>
														<span class="cell-detail-description">' . $value["rndc_categoria_licencia"] . '</span>
													</div>
													<div class="col-sm-4">
														<span>Vencimiento Licencia</span>
														<span class="cell-detail-description">' . $value["rndc_vencimiento_licencia"] . '</span>
													</div>
												</div>
												<br />
												<div class="row">
													<div class="col-sm-6">
														<span>Referencias Laborales</span>
														<textarea class="form-control" disabled>' . $value["referencias_empresariales"] . '</textarea>
													</div>
													<div class="col-sm-6">
														<span>Referencias Personales</span>
														<textarea class="form-control" disabled>' . $value["referencias_personales"] . '</textarea>
													</div>
												</div>
											</td>
										</tr>
										<tr><td></td></tr>
									</tbody>
								</table>
							</div>
						</div>
					';
				}
			} else {
				$return['success'] = false;
				$_msg_error.= "<p>Error al generar la solicitud</p>";
			}

			if ($_msg_error) {
				$return['error'] = $_msg_error;
			}

			return $return;
		}

		private function observacionesAsignacion($Data, $id_asignacion){
			$sql = ' 
				SELECT 
					cavl.*, cu.nom_usuario, cu.url_avatar
				FROM cmx_agrupaciones_vehiculos_log cavl
					INNER JOIN cmx_usuarios cu ON cu.id = cavl.id_usuario
				WHERE id_agrupacion_vehiculo = ' . $id_asignacion . '
				ORDER BY cavl.fecha_hora DESC
			';
			$result = $Data->getConsulta($sql);

			$_table_content = '';
			if ($result) {
				$_table_content.= '
					<table id="table1" class="table table-condensed">
						<thead>
							<tr>
								<th class="text-center" style="width:15%;">Fecha</th>
								<th class="text-center">Usuario</th>
								<th class="text-center">Observación</th>
							</tr>
						</thead>
						<tbody>
				';
				foreach ($result["rowsData"] as $key => $value) {
					$_table_content.= '
						<tr>
							<td class="cell-detail text-center">
								<span>' . $value["fecha_hora"] . '</span>
							</td>
							<td class="user-avatar">
								<img src="' . BASE_URL . 'views/layout/assets/img/' . $value["url_avatar"] . '" alt="' . $value["nom_usuario"] . '">
									<span>' . $value["nom_usuario"] . '</span>
							</td>
							<td class="cell-detail text-left">
								<span>' . $value["estado"] . '</span>
								<span class="cell-detail-description">' . $value["observacion"] . '</span>
							</td>
						</tr>
					';
				}
				$_table_content.= '
							<td colspan="3"></td>
						</tbody>
					</table>
				';
			}
			return $_table_content;
		}
	}

	function rndc_buscaVehiculo($rndc_id){
		$Data = new Consultas;
		$_msg_error = "";

		$arrayMinTrans = Array();
		// Solicitud
		$arrayMinTrans["solicitud"] = Array(
			"tipo" => 3,
			"procesoid" => 12,
		);
		// Variable que se envían para la consulta  
		$arrayMinTrans["variables"] = "INGRESOID,FECHAING,NUMNITEMPRESATRANSPORTE,NUMPLACA,CODCONFIGURACIONUNIDADCARGA,CODMARCAVEHICULOCARGA,CODLINEAVEHICULOCARGA,ANOFABRICACIONVEHICULOCARGA,CODTIPOIDPROPIETARIO,NUMIDPROPIETARIO,CODTIPOIDTENEDOR,NUMIDTENEDOR,CODTIPOCOMBUSTIBLE,PESOVEHICULOVACIO,CAPACIDADUNIDADCARGA,CODCOLORVEHICULOCARGA,CODTIPOCARROCERIA,NUMNITASEGURADORASOAT,FECHAVENCIMIENTOSOAT,NUMSEGUROSOAT,UNIDADMEDIDACAPACIDAD";

		$arrayMinTrans["documento"] = Array(
			"NUMNITEMPRESATRANSPORTE"   => MINTRANS_NIT,
			"INGRESOID"                 => "'" . $rndc_id . "'"
		);
		$return["rndc_array"] = $arrayMinTrans;

		$result = $Data->getRNDCQueryArray( $arrayMinTrans );
		if ( !isset( $result["ErrorMSG"] ) ) {
			$return["rndc_result"] = $result["documento"];
			// Se toman los datos necesarios para llenado de campos RNDC

			// Se busca la informacion del codconfiguracionunidadcarga
			$sql = '
				SELECT 
					*, CONCAT(crvc.nombre, " - " , crvc.descripcion) NOMBRE
				FROM
					cmx_rndc_vehiculos_configuracion crvc
				WHERE 
					crvc.rndc_id = ' . $result["documento"]["codconfiguracionunidadcarga"] . '
			';
			$rndc_result = $Data->getConsulta($sql);
			$return["rndc_result"]["rndc_vehiculo_configuracion"] = $rndc_result["rowsData"][0];

			// Se busca la informacion del CODCOLORVEHICULOCARGA
			$sql = '
				SELECT 
					*
				FROM  
					cmx_rndc_vehiculos_color crvc
				WHERE 
					crvc.rndc_id = ' . $result["documento"]["codcolorvehiculocarga"] . '
			';
			$rndc_result = $Data->getConsulta($sql);
			$return["rndc_result"]["rndc_vehiculo_color"] = $rndc_result["rowsData"][0];

			// Se busca la informacion del CODMARCAVEHICULOCARGA
			$sql = '
				SELECT 
					*
				FROM
					cmx_rndc_vehiculos_marcas crvm
				WHERE 
					crvm.rndc_id = ' . $result["documento"]["codmarcavehiculocarga"] . '
			';
			$rndc_result = $Data->getConsulta($sql);
			$return["rndc_result"]["rndc_vehiculo_marca"] = $rndc_result["rowsData"][0];

			// Se busca la informacion del CODLINEAVEHICULOCARGA
			$sql = '
				SELECT
					*
				FROM
					cmx_rndc_vehiculos_linea crvl
				WHERE
					crvl.rndc_id = ' . $result["documento"]["codlineavehiculocarga"] . '
			';
			$rndc_result = $Data->getConsulta($sql);
			$return["rndc_result"]["rndc_vehiculo_linea"] = $rndc_result["rowsData"][0];

			// Se busca la informacion del CODTIPOCARROCERIA
			$sql = '
				SELECT 
					*
				FROM  
					cmx_rndc_vehiculos_carroceria crvtc
				WHERE
					crvtc.rndc_id = ' . $result["documento"]["codtipocarroceria"] . '
			';
			$rndc_result = $Data->getConsulta($sql);
			$return["rndc_result"]["rndc_vehiculo_carroceria"] = $rndc_result["rowsData"][0];

			// Se busca la informacion del NUMNITASEGURADORASOAT
			$sql = '
				SELECT 
					*
				FROM
					cmx_rndc_aseguradoras cra
				WHERE 
					cra.rndc_id = ' . $result["documento"]["numnitaseguradorasoat"] . '
			';
			$rndc_result = $Data->getConsulta($sql);
			$return["rndc_result"]["rndc_vehiculo_aseguradora"] = $rndc_result["rowsData"][0];
		}else{
			$_msg_error.= $result["ErrorMSG"];
		}

		if ( $_msg_error ) {
			$return["error"] = $_msg_error;
		}
		return $return;
	}
