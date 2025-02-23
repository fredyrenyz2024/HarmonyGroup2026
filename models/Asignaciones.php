<?php
include '../application/Conexion.php';
require_once '../application/Config.php';

session_start();

class Asignaciones
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
		$sql = "
			SELECT cav.*,cv.placa
			FROM cmx_agrupaciones_vehiculos cav,cmx_vehiculos cv
			WHERE id_agrupacion = $id_agrupacion
			AND cav.id_vehiculo = cv.id
			GROUP BY cav.id 
			ORDER BY cav.flete
		";
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
		$sql = "
			SELECT * FROM cmx_agrupaciones ca, cmx_agrupacion_solicitudes cas
			WHERE ca.id = cas.id_agrupacion 
			AND ca.id = $id_agrupacion
			GROUP BY ca.id 
			LIMIT 1
		";
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
			$sql = "
				SELECT 
					cv.* 
				FROM 
					cmx_vehiculos cv, cmx_proveedores cp,  cmx_proveedores cp1,  cmx_proveedores cp2
				WHERE 
					cv.tipo_vehiculo >= ".$datos_agrupacion["tipo_vehiculo"]."
					AND cv.rndc_id IS NOT NULL
					AND cv.estado = 'Activo'
					AND cp.id= cv.id_propietario 
					AND cp1.id= cv.id_tenedor 
					AND cp2.id= cv.id_conductor
					AND cp.estado ='Activo' 
					AND cp1.estado ='Activo'
					AND cp2.estado ='Activo'
			";
			$model    = new Conexion;
			$conexion = $model->conectar();
			$consulta_vehiculos = $conexion->prepare($sql);
			$consulta_vehiculos->execute();
			$total_vehiculos = $consulta_vehiculos->rowCount();
			if ($total_vehiculos == 0) {
			} else {
				$return["success"]= true;
				while ($datos_vehiculo = $consulta_vehiculos->fetch()) {
					$sql = "
						SELECT * 
						FROM cmx_vehiculos 
						WHERE 
							((id_propietario IN(".$datos_vehiculo["id_propietario"].",".$datos_vehiculo["id_tenedor"].",".$datos_vehiculo["id_conductor"]."))
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
					}
					else{
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
		$Data = new Consultas;

		$usuario = $_SESSION["usuario"];
		$id_usuario = $usuario["id_usuario"];

		$fecha_hora = date('Y-m-d H:i:s', time());

		$id_agrupacion = $_POST["id_agrupacion"];
		$id_vehiculo = $_POST["id_vehiculo"];
		$flete = $_POST["flete"];
		$tipo_tramite = $_POST["tipo_tramite"];

		// Se establece el estado del vehículo si se pasa del presupuesto 
		$cant_solicitudes_agrupamiento = $_POST["cant_solicitudes_agrupamiento"];
		$tarifa_transporte = $_POST["tarifa_transporte"];

		$_estado_agrupacion_vehiculo = "Propuesto";
		if ( $cant_solicitudes_agrupamiento == 1 AND $tarifa_transporte > 0 ) {
			// Se verifica si el felte consignado no pasa del la tarifa establecida 
			if ( $flete > $tarifa_transporte ) {
				$_estado_agrupacion_vehiculo = "Verificacion Flete";
			}
		} 

		$array = array();
		$array["id_agrupacion"] = $id_agrupacion;
		$array["id_usuario"] = $id_usuario;
		$array["flete"] = $flete;
		$array["tipo_tramite"] = $tipo_tramite;
		$array["id_vehiculo"] = $id_vehiculo;
		$array["estado"] = $_estado_agrupacion_vehiculo;
		$array["fecha_hora_operacion"] = $fecha_hora;
		$result = $Data->setRegistro("cmx_agrupaciones_vehiculos", $array);

		if ( $result ) {
			// Se guarda en el log la actividad realizada
			$array = array();
			$array["id_agrupacion_vehiculo"] = $result;
			$array["fecha_hora"] = $fecha_hora;
			$array["id_usuario"] = $id_usuario;
			$array["observacion"] = "";
			$array["estado"] = "Propuesto";
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
				$array["estado"] = $_estado_agrupacion_vehiculo;
				$result_01 = $Data->updateRegistro("cmx_app_enturnamientos", $array, $result_01["rowsData"][0][0]);
			}
		}

		$sql ="
			SELECT COUNT(cav.id) CUANTOS
			FROM cmx_agrupaciones_vehiculos cav 
			WHERE cav.id_agrupacion = " . $id_agrupacion . ";
		";
		$result_01 = $Data->getConsulta($sql);
		$datos_solicitudes = $result_01["rowsData"][0];

		if ( $datos_solicitudes["CUANTOS"] == 1 ) {
			// Se busca la informacion de las actividades del material para su gestion en proyectos
			$sql ="
				SELECT 
					cia.*, cam.orden_actividad
				FROM 
					cmx_agrupaciones ca
					INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = ca.id
					INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cam.id_material_proyecto
				WHERE 
					ca.id = " . $id_agrupacion . "
					AND cia.estado = 2
					AND cia.nombre = 'Asignar Vehículo';
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

		if ($result) {
			$return["success"]= true;
		} else {
			$return['success'] = false;
			$return['error'] = "Error al generar la solicitud";
		}
		return $return;
	}

	public function cancelarAsignacion (){
		$Data = new Consultas;

		$usuario = $_SESSION["usuario"];
		$id_usuario = $usuario["id_usuario"];

		$fecha_hora = date('Y-m-d H:i:s', time());
		$id_asignacion = $_POST["id_asignacion"];
		$observacion = $_POST["observacion"];

		$array = array();
		$array["estado"] = 'Cancelado';
		$Data->updateRegistro("cmx_agrupaciones_vehiculos", $array, $id_asignacion);

		// Se guarda en el log la actividad realizada
		$array = array();
		$array["id_agrupacion_vehiculo"] = $id_asignacion;
		$array["fecha_hora"] = $fecha_hora;
		$array["id_usuario"] = $id_usuario;
		$array["observacion"] = $observacion;
		$array["estado"] = 'Vehículo Cancelado';
		$Data->setRegistro("cmx_agrupaciones_vehiculos_log", $array);

		$return["success"] = true;
		return $return;
	}

	public function cambiarestadoAsignacion (){
		$Data = new Consultas;

		$usuario = $_SESSION["usuario"];
		$id_usuario = $usuario["id_usuario"];

		$fecha_hora = date('Y-m-d H:i:s', time());

		$id_asignacion = $_POST["id_asignacion"];
		$flete = $_POST["flete"];
		$tipo_tramite = $_POST["tipo_tramite"];
		$observaciones = $_POST["observaciones"];
		$estado = $_POST["estado"];

		// Se verifica que el valor de flete a cambiar no supere el valor de la tarifa establecida
		$sql = ' 
			SELECT ca.tarifa_transporte
			FROM cmx_agrupaciones_vehiculos cav
				INNER JOIN cmx_agrupaciones ca ON ca.id = cav.id_agrupacion
			WHERE cav.id = ' . $id_asignacion . '
		';
		$result = $Data->getConsulta($sql);

		$datos_asignacion = $result["rowsData"][0];

		$estado = "Propuesto";
		if($datos_asignacion["tarifa_transporte"] < $flete){
			$estado = "Verificacion Flete";
		}

		$array = array();
		$array["estado"] = $estado;
		$array["flete"] = $flete;
		$array["tipo_tramite"] = $tipo_tramite;
		$Data->updateRegistro("cmx_agrupaciones_vehiculos", $array, (int)$id_asignacion);

		// Se guarda en el log la actividad realizada
		$array = array();
		$array["id_agrupacion_vehiculo"] = $id_asignacion;
		$array["fecha_hora"] = $fecha_hora;
		$array["id_usuario"] = $id_usuario;
		$array["observacion"] = $observaciones;
		$array["estado"] = "Cambio en Vehículo Propuesto";
		$Data->setRegistro("cmx_agrupaciones_vehiculos_log", $array);

		$return["success"] = true;
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

		$return["success"] = true;
		return $return;
	}

	public function verSolicitudesAsignacion() {
		$id_asignacion = $_POST["id_asignacion"];
		$model    = new Conexion;
		$conexion = $model->conectar();
		$sql = '
			SELECT
				DISTINCT(ca.id) ID_ASIGNACION, ca.numero_agrupacion,
				cs.id ID_SOLICITUD, cs.numero_solicitud, 
				cc.nombre NOM_CLIENTE, cs.origen, cs.destino, cs.tipo_operacion, 
				cs.numero_orden, cs.numero_solicitud, 
				cs.numero_bl, cs.tara_contenedor,
				IF(
					cs.tara_contenedor > 0,
					(
						SELECT 
							DISTINCT(ctc1.nombre)
						FROM 
							cmx_integracion_soluc_import cisi1
							INNER JOIN cmx_importacion_actividades cia1 ON cia1.id = cisi1.id_importacion_actividad
							INNER JOIN cmx_importacion_proyecto cip1 ON cip1.id = cia1.id_importacion
							INNER JOIN cmx_tipo_contenedor ctc1 ON ctc1.id = cip1.tipo_contenedor
						WHERE
							cisi1.id_solucion = cs.id
					),
					NULL
				) CONTENEDOR,
				IF(
					(SELECT COUNT(ctv.id) FROM cmx_tipo_vehiculos ctv WHERE ctv.id = cs.tipo_vehiculo) > 0 ,
					(SELECT ctv.nombre FROM cmx_tipo_vehiculos ctv WHERE ctv.id = cs.tipo_vehiculo),
					"NO PROPUESTO"
				) NOM_TIPO_VEHICULO,
				IF(
					(SELECT COUNT(crvc1.id) FROM cmx_rndc_vehiculos_carroceria crvc1 WHERE crvc1.id = cs.tipo_carroceria) > 0,
					(SELECT crvc1.descripcion FROM cmx_rndc_vehiculos_carroceria crvc1 WHERE crvc1.id = cs.tipo_carroceria),
					NULL
				) CARROCERIA
			FROM 
				cmx_agrupaciones ca 
				INNER JOIN cmx_agrupacion_solicitudes cas ON cas.id_agrupacion = ca.id
				INNER JOIN cmx_solicitudes cs ON cs.id = cas.id_solicitud
				INNER JOIN cmx_clientes cc ON cc.id = cs.id_cliente
			WHERE 
				ca.id = ' . $id_asignacion . '
		;';
		// $return["sql"] = $sql;
		$obtener_asignacion = $conexion->prepare($sql);
		$obtener_asignacion->execute();

		if ($obtener_asignacion) {
			$info_solicitud= array();
			while($solicitudes_agrupacion = $obtener_asignacion->fetch()){
				$info_solicitud[] = $solicitudes_agrupacion;

				// SE BUSCA EL MATERIAL DE LA SOLICITUD
				$sql = '
					SELECT 
						cms.*, cim.cantidad, cim.peso_bruto, cim.valor_declarado VLR_DECLARADO
					FROM 
						cmx_agrupacion_solicitudes cas
						INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = cas.id_agrupacion
						INNER JOIN cmx_importacion_material cim ON cim.id = cam.id_material_proyecto
						INNER JOIN cmx_mercancia_solicitud cms ON cms.id_solicitud = cas.id_solicitud AND cms.id = cam.id_material
						INNER JOIN cmx_importacion_material cim1 ON cim1.id = cms.id_material_proyecto
					WHERE 
						cas.id_solicitud = ' . $solicitudes_agrupacion["ID_SOLICITUD"] . '
						AND cas.id_agrupacion = ' . $id_asignacion . '
				;';
				// $return["sql"] = $sql;
				$obtener_material_solicitud = $conexion->prepare($sql);
				$obtener_material_solicitud->execute();

				if ($obtener_material_solicitud) {
					$info_material_solicitud = array();
					while ($material_solicitudes_agrupacion = $obtener_material_solicitud->fetch()) {
						$info_material_solicitud[] = $material_solicitudes_agrupacion;
					}
				}

				// SE BUSCAN LOS TRAMOS DE LA SOLICITUD
				$sql = '
					SELECT 
						cts.*,
						crd.nombre
					FROM 
						cmx_solicitudes cs
						INNER JOIN cmx_tramo_solicitud cts ON cts.id_solicitud = cs.id
						INNER JOIN cmx_remitente_destinatario crd ON crd.id = cts.id_remitente_destinatario
					WHERE
						cs.id = ' . $solicitudes_agrupacion["ID_SOLICITUD"] . '
				;';
				// $return["sql"] = $sql;
				$obtener_tramos = $conexion->prepare($sql);
				$obtener_tramos->execute();

				if ($obtener_tramos) {
					$info_tramos = array();
					while ($material_solicitudes_agrupacion = $obtener_tramos->fetch()) {
						$info_tramos[] = $material_solicitudes_agrupacion;
					}
				}

				$return['content'][] = array($info_solicitud , $info_material_solicitud , $info_tramos );
				$info_solicitud = "";
				$info_material_solicitud = "";
			}
			$return['success'] = true;
		} else {
			$return['success'] = false;
			$return['error'] = "Error al generar la solicitud";
		}
		$return["success"]=true;
		return $return;
	}

	public function buscarValidacionTarifa(){
		$Data = new Consultas;

		$sql = '
			SELECT 
				cav.id, cag.numero_agrupacion, cag.tarifa_transporte,
				cv.placa ,cav.flete, 
				(
					SELECT 
						COUNT(cav1.id)
					FROM 
						cmx_agrupaciones_vehiculos cav1
					WHERE
						cav.id_agrupacion = cav1.id_agrupacion
						AND cav1.estado IN ("Aprobado","Anticipo Asignado","Planillado")
				) APROBADOS
			FROM 
				cmx_agrupaciones cag 
				INNER JOIN cmx_agrupacion_solicitudes cags ON cag.id = cags.id_agrupacion 
				INNER JOIN cmx_agrupaciones_vehiculos cav ON cag.id = cav.id_agrupacion 
				INNER JOIN cmx_vehiculos cv ON cv.id = cav.id_vehiculo
				INNER JOIN cmx_solicitudes cs ON cs.id = cags.id_solicitud
				INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = cag.id
				INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cam.id_material_proyecto
			WHERE 
				cav.estado IN ("Verificacion Flete")
				AND cia.nombre = "Asignar Vehículo"
			HAVING APROBADOS = 0;
		';
		$result["sql"] = $sql;
		$array = $Data->getConsulta($sql);

		$result["content"] = $array["rowsData"];
		return $result;
	}

	public function veridasignacion(){
		$Data = new Consultas;
		// Se muestra el contenido de los movimientos realizados a la asignación
		$return["content"] = $this->observacionesAsignacion($Data, $_POST["id_asignacion"]);
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
						<td class="cell-detail">
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
					</tbody>
				</table>
			';
		}
		return $_table_content;
	}
}
