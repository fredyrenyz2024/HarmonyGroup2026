<?php

use PhpParser\Node\Expr\Exit_;

session_start();
class proveedoresModel extends Model
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


	public function listarProveedores()
	{
		$model    = new Conexion;
		$conexion = $model->conectar();
		$sql = "
				SELECT 
					cp.*, cm.municipio as 'ciudad'
				FROM 
					cmx_proveedores cp
					INNER JOIN cmx_municipios cm ON cp.id_municipio = cm.id
				ORDER BY cp.rndc_id DESC, cp.id DESC
--			LIMIT 100;
			";
		$consulta = $conexion->prepare($sql);
		$consulta->execute();
		$total         = $consulta->rowCount();
		$this->mensaje = $total;
		if ($total == 0) {
			$this->respuesta = "BAD";
		} else {
			$this->respuesta = "GOOD";
			while ($datos_proveedores = $consulta->fetch()) {
				$this->listado[] = $datos_proveedores;
			}
		}
	}

	public function ObtenerMunicipios()
	{
		$model    = new Conexion;
		$conexion = $model->conectar();
		$sql      = " SELECT * FROM cmx_municipios ";
		$consulta = $conexion->prepare($sql);
		$consulta->execute();
		$total = $consulta->rowCount();
		$this->mensaje = $total;
		if ($total == 0) {
			$this->respuesta = "BAD";
		} else {
			$this->respuesta = "GOOD";
			while ($datos_municipio = $consulta->fetch()) {
				$this->listado[] = $datos_municipio;
			}
		}
	}


	public function getVehiculos()
	{
		$return = $this->_db->getConsulta("SELECT * FROM cmx_vehiculos ");
		return $return;
	}

	public function getTabla()
	{
		$return = $this->_db->getConsulta("SELECT * FROM cmx_vehiculos ");
		return $return;
	}

	public function getPaises()
	{
		$return = $this->_db->getConsulta("SELECT * FROM cmx_municipios");
		return $return;
	}

	public function getProveedores($tipo, $valor, $name, $docu, $param1, $param2)
	{
		if ($tipo == '1' || $tipo == '2' || $tipo == '3') { //otros actores
			$acti = '';
			if ($tipo == '1') {
				$acti = 'Propietario Vehiculo';
			}
			if ($tipo == '2') {
				$acti = 'Poseedor Vehiculo';
			}
			if ($tipo == '3') {
				$acti = 'Conductor';
			}
			if ($valor == 'name') {
				$sql = 'SELECT cp.*, CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS ciudad, ap.actividad
					FROM cmx_proveedores cp
					INNER JOIN cmx_municipios cm ON cp.id_municipio = cm.id
					INNER JOIN cmx_actividad_proveedor ap
					ON cp.id=ap.id_proveedor
					WHERE  cp.nombre LIKE  "%' . $name . '%"
					AND ap.actividad="' . $acti . '"
					ORDER BY nombre ASC';
			}
			if ($valor == 'num') {
				$sql = 'SELECT cp.*, 
					CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS ciudad,
					ap.actividad
					FROM cmx_proveedores cp
					INNER JOIN cmx_municipios cm ON cp.id_municipio = cm.id
					INNER JOIN cmx_actividad_proveedor ap ON cp.id=ap.id_proveedor
					WHERE cp.numero_documento="' . $docu . '"
					AND ap.actividad="' . $acti . '"
					ORDER BY cp.numero_documento DESC';
			}
			//echo $sql;
		}
		if ($tipo == '4') { //proveedores
			$acti = '';
			if ($tipo == '1') {
				$acti = 'Propietario Vehiculo';
			}
			if ($tipo == '2') {
				$acti = 'Poseedor Vehiculo';
			}
			if ($tipo == '3') {
				$acti = 'Conductor';
			}
			if ($valor == 'prove') {
				$sql = 'SELECT cp.*, CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS ciudad, ap.actividad
					FROM cmx_proveedores cp
					INNER JOIN cmx_municipios cm
					ON cp.id_municipio=cm.id
					INNER JOIN cmx_actividad_proveedor ap
					ON cp.id=ap.id_proveedor
					LEFT JOIN cmx_proveedores_detalle pd
					ON cp.id=pd.id_proveedor
					WHERE 
					ap.actividad="Proveedor"
					AND pd.cod_tipo_proveedor=' . $param1 . '
					ORDER BY cp.nombre ASC';
			}
			if ($valor == 'name') {
				$sql = 'SELECT cp.*, CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS ciudad, ap.actividad
					FROM cmx_proveedores cp
					INNER JOIN cmx_municipios cm ON cp.id_municipio = cm.id
					INNER JOIN cmx_actividad_proveedor ap
					ON cp.id=ap.id_proveedor
					WHERE  cp.nombre LIKE  "%' . $name . '%"
					AND ap.actividad="Proveedor"
					ORDER BY cp.nombre ASC';
			}
			if ($valor == 'num') {
				$sql = 'SELECT cp.*, 
					CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS ciudad,
					ap.actividad
					FROM cmx_proveedores cp
					INNER JOIN cmx_municipios cm ON cp.id_municipio = cm.id
					INNER JOIN cmx_actividad_proveedor ap ON cp.id=ap.id_proveedor
					WHERE cp.numero_documento="' . $docu . '"
					AND ap.actividad="Proveedor"
					ORDER BY cp.numero_documento DESC';
			}
			if ($valor == 'geo') {
				$sql = 'SELECT cp.*, CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS ciudad, ap.actividad
					FROM cmx_proveedores cp
					INNER JOIN cmx_municipios cm
					ON cp.id_municipio=cm.id
					INNER JOIN cmx_actividad_proveedor ap
					ON cp.id=ap.id_proveedor
					LEFT JOIN cmx_proveedores_detalle pd
					ON cp.id=pd.id_proveedor
					WHERE 
					ap.actividad="Proveedor"
					AND pd.cod_pais=' . $param1 . '
					ORDER BY cp.nombre ASC';
				//echo $sql;
			}
			if ($valor == 'servicio') {
				if ($param1 == 'Transporte') {
					$sql = 'SELECT cp.*, CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS ciudad, ap.actividad
						FROM cmx_proveedores cp
						INNER JOIN cmx_municipios cm
						ON cp.id_municipio=cm.id
						INNER JOIN cmx_actividad_proveedor ap
						ON cp.id=ap.id_proveedor
						LEFT JOIN cmx_proveedores_detalle pd
						ON cp.id=pd.id_proveedor
						WHERE 
						ap.actividad="Proveedor"
						AND pd.tipo_servicio="Transporte"
						AND pd.tipo_servicio_detalle2="' . $param2 . '"
						ORDER BY cp.nombre ASC';
				}
				if ($param1 == 'Porteadores') {
					$sql = 'SELECT cp.*, CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS ciudad, ap.actividad
						FROM cmx_proveedores cp
						INNER JOIN cmx_municipios cm
						ON cp.id_municipio=cm.id
						INNER JOIN cmx_actividad_proveedor ap
						ON cp.id=ap.id_proveedor
						LEFT JOIN cmx_proveedores_detalle pd
						ON cp.id=pd.id_proveedor
						WHERE 
						ap.actividad="Proveedor"
						AND pd.tipo_servicio="Porteadores"
						AND pd.tipo_servicio_detalle1="' . $param2 . '"
						ORDER BY cp.nombre ASC';
				}
				if ($param1 == 'Agenciamiento de carga') {
					$sql = 'SELECT cp.*, CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS ciudad, ap.actividad
						FROM cmx_proveedores cp
						INNER JOIN cmx_municipios cm
						ON cp.id_municipio=cm.id
						INNER JOIN cmx_actividad_proveedor ap
						ON cp.id=ap.id_proveedor
						LEFT JOIN cmx_proveedores_detalle pd
						ON cp.id=pd.id_proveedor
						WHERE 
						ap.actividad="Proveedor"
						AND pd.tipo_servicio="Agenciamiento de carga"
						AND pd.tipo_servicio_detalle1="' . $param2 . '"
						ORDER BY cp.nombre ASC';
				}
				if ($param1 == 'Tramites Administrativos') {
					$sql = 'SELECT cp.*, CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS ciudad, ap.actividad
						FROM cmx_proveedores cp
						INNER JOIN cmx_municipios cm
						ON cp.id_municipio=cm.id
						INNER JOIN cmx_actividad_proveedor ap
						ON cp.id=ap.id_proveedor
						LEFT JOIN cmx_proveedores_detalle pd
						ON cp.id=pd.id_proveedor
						WHERE 
						ap.actividad="Proveedor"
						AND pd.tipo_servicio="Tramites Administrativos"
						AND pd.tipo_servicio_detalle1="' . $param2 . '"
						ORDER BY cp.nombre ASC';
				}
				if ($param1 !== 'Transporte' && $param1 !== 'Porteadores' &&  $param1 !== 'Agenciamiento de carga' && $param1 !== 'Tramites Administrativos') {
					$sql = 'SELECT cp.*, CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS ciudad, ap.actividad
						FROM cmx_proveedores cp
						INNER JOIN cmx_municipios cm
						ON cp.id_municipio=cm.id
						INNER JOIN cmx_actividad_proveedor ap
						ON cp.id=ap.id_proveedor
						LEFT JOIN cmx_proveedores_detalle pd
						ON cp.id=pd.id_proveedor
						WHERE 
						ap.actividad="Proveedor"
						AND pd.tipo_servicio="' . $param1 . '"
						ORDER BY cp.nombre ASC';
				}
			}
		}
		if ($tipo == '5') { //todos los actores
			$acti = '';
			if ($tipo == '1') {
				$acti = 'Propietario';
			}
			if ($tipo == '2') {
				$acti = 'Poseedor';
			}
			if ($tipo == '3') {
				$acti = 'Conductor';
			}
			if ($valor == 'name') {
				$sql = 'SELECT cp.*, CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS ciudad, ap.actividad
					FROM cmx_proveedores cp
					INNER JOIN cmx_municipios cm ON cp.id_municipio = cm.id
					INNER JOIN cmx_actividad_proveedor ap
					ON cp.id=ap.id_proveedor
					WHERE  cp.nombre LIKE  "%' . $name . '%"
					ORDER BY nombre ASC';
			}
			if ($valor == 'num') {
				$sql = 'SELECT cp.*, 
					CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS ciudad,
					ap.actividad
					FROM cmx_proveedores cp
					INNER JOIN cmx_municipios cm ON cp.id_municipio = cm.id
					INNER JOIN cmx_actividad_proveedor ap ON cp.id=ap.id_proveedor
					WHERE cp.numero_documento="' . $docu . '"
					ORDER BY cp.numero_documento DESC';
			}
		}
		$return = $this->_db->getConsulta($sql);
		return $return;
	}

	public function getListaProveedores()
	{
		$sql = '
				SELECT 
					cp.*, cm.municipio as ciudad
				FROM 
					cmx_proveedores cp
					INNER JOIN cmx_municipios cm ON cp.id_municipio = cm.id
				ORDER BY cp.rndc_id DESC, cp.id DESC
			';
		$result = $this->_db->getConsulta($sql);

		if ($result) {
			$tabla_proveedores = '';
			foreach ($result["rowsData"] as $key => $value) {
				if ($value["estado"] == 'Activo') {
					$rndc_estado = "
							<tr>
								<td class='nexos-txt-success'>
									<center><span class='mdi mdi-dot-circle icon'></span></center>
								</td>
						";
					if (!$value["rndc_id"]) {
						$rndc_estado = "
								<tr>
									<td class='actions'>
										<center><span class='mdi mdi-dot-circle icon'></span></center>
									</td>
							";
					}

					$tabla_proveedores .= $rndc_estado;
				} else if ($value["estado"] == 'Inactivo') {
					$tabla_proveedores .= "
							<tr>
								<td class='nexos-txt-danger'>
									<center><span class='mdi mdi-dot-circle icon'></span></center>
								</td>
						";
				}

				$tabla_proveedores .= "
						<td class='cell-detail' ><span >$value[tipo_documento]</span></td>
						<td class='cell-detail' ><span >$value[numero_documento]</span></td>
						<td class='cell-detail' ><span >$value[nombre]</span></td>	
						<td class='cell-detail' ><span >$value[direccion]</span></td>
						<td class='cell-detail' ><span >$value[contacto]</span></td>
						<td class='cell-detail' ><span >$value[ciudad]</span></td>
						<td class='actions'>
							<a href='javascript:'  onclick='verProveedor($value[id])'  class='cell-detail  hint--top-left' data-hint='Ver proveedor' ><span class='icon mdi mdi-eye'  data-toggle='modal' data-target='#ver_proveedor'></span></a>
							<a href='javascript:' onclick='editardatosProveedor($value[id])' class='cell-detail  hint--top-left' data-hint='Editar proveedor' '><span class='icon mdi mdi-edit'  data-toggle='modal' data-target='#editar_proveedor'></span></a>
					";
				if ($value["estado"] == 'Activo') {
					$tabla_proveedores .= "
							<a href='javascript:' onclick='datosinactivarproveedor($value[id])' class='cell-detail  hint--top-left' data-hint='Inactivar proveedor' ><span class='icon mdi mdi-close-circle'  data-toggle='modal' data-target='#inactivar_proveedor'></span></a>
						";
				} else if ($value["estado"] == 'Inactivo') {
					$tabla_proveedores .= "
							<a href='javascript:' onclick='datosactivarproveedor($value[id])'  class='cell-detail  hint--top-left' data-hint='Activar proveedor' ><span class='icon mdi mdi-check-circle '  data-toggle='modal' data-target='#activar_proveedor'></span></a>
						";
				}
				$tabla_proveedores .= "</td> </tr>";
			}
		}

		return $tabla_proveedores;
	}

	public function Validar_Token_Proveedor($prefiltro, $token, $conductor, $propietario, $tenedor)
	{
		$fechaHoraActual =  date("Y-m-d H:i:s");
		$estado = "aprobado";
		$estadoactual = 1;
		$formatoFecha = 'Y-m-d H:i:s';

		$sql = $this->_db3->prepare("SELECT se.id_solicitud,se.token,sp.placa, se.token_valido,vp.documento_propietario,vp.documento_tenedor,vp.documento_conductor FROM cmx_solicitudes_estados se
		INNER JOIN cmx_solicitudes_preestudio sp ON sp.id_preestudio=se.id_solicitud 
			INNER JOIN cmx_vehiculos_preestudio vp ON sp.placa=vp.placa_vehiculo
			WHERE se.estado=:estado AND se.id_solicitud=:solicitud AND se.token=:token
			AND vp.documento_propietario=:documento_propietario AND vp.documento_tenedor=:documento_tenedor AND vp.documento_conductor=:documento_conductor");
		$sql->bindParam(':estado', $estado, PDO::PARAM_STR);
		$sql->bindParam(':solicitud', $prefiltro, PDO::PARAM_STR);
		$sql->bindParam(':token', $token, PDO::PARAM_STR);
		$sql->bindParam(':documento_propietario', $propietario, PDO::PARAM_STR);
		$sql->bindParam(':documento_tenedor', $tenedor, PDO::PARAM_STR);
		$sql->bindParam(':documento_conductor', $conductor, PDO::PARAM_STR);
		$resultado = $sql->execute();
		$resultado = $sql->fetch(PDO::FETCH_ASSOC);

		$fechaDateTime = DateTime::createFromFormat($formatoFecha, $resultado['token_valido']);
		$fechahorabd = DateTime::createFromFormat($formatoFecha, $fechaHoraActual);

		if ($resultado !== false) {
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
				$response = array(
					'numero' => 400,
					'mensaje' => " Token Vencio Hace : " . $diferencia->format('%d días, %h horas, %i minutos, %s segundos, solicitar nuevo prefiltro.')
				);
			} else {
				$sql_update_estado_token = $this->_db3->prepare("UPDATE cmx_solicitudes_estados SET estado_token='Ocupado' WHERE token=:token AND id_solicitud=:solicitud AND estado_token='Activo'");
				$sql_update_estado_token->bindParam(':token', $token, PDO::PARAM_STR);
				$sql_update_estado_token->bindParam(':solicitud', $prefiltro, PDO::PARAM_STR);
				$resultado_update = $sql_update_estado_token->execute();
				if ($resultado_update) {
					$response = array(
						'numero' => 200,
						'mensaje' =>  'Token Valido Hasta hoy : ' . $resultado['token_valido'] . ' para el prefiltro <strong>' . $prefiltro . '</strong>.'
					);
				} else {
					$response = array(
						'numero' => 400,
						'mensaje' => 'Este token <strong>' . $token . '</strong>, ya esta en uso no se permiten mas acciones con el token <strong>' . $token . '</strong>.'
					);
				}
			}
		} else {
			$response = array(
				'numero' => 400,
				'mensaje' => 'Este token <strong>' . $token . '</strong>, no pertenece al prefiltro <strong>' . $prefiltro . '</strong>.'
			);
		}
		return $response;
	}

	public function Validar_Token_Estudio($estudio, $token, $documentos)
	{
		/*Validaciones del token segun la catidad documentos recibidos */
		$response = []; // Inicializa la variable de respuesta
		try {
			// Iniciar la transacción
			$this->_db3->beginTransaction();

			/* Validar si el numero de coumentos enviados es correcto cuando los tres documentos sean iguales. */

			$estado = "Activo";
			$fechaHoraActual =  date("Y-m-d H:i:s");
			$formatoFecha = 'Y-m-d H:i:s';
			# consulta mysql para los tres de forma lineas
			if (isset($documentos->documento1) && isset($documentos->documento2) && isset($documentos->documento3)) {
				foreach ($documentos as $valor) {
					$sql_propietario = $this->_db3->prepare("SELECT token_actual, fecha_vigencia FROM cmx_prefiltro_actualizar WHERE id_solicitud_u = :Estudio AND token_actual = :Token_actual AND estado_token = :Estado AND (documento_propietario = :DocumentoPropietario OR documento_poseedor = :DocumentoPoseedor OR documento_conductor = :DocumentoConductor)");
					$sql_propietario->bindParam(':Estudio', $estudio, PDO::PARAM_STR);
					$sql_propietario->bindParam(':Token_actual', $token, PDO::PARAM_STR);
					$sql_propietario->bindParam(':Estado', $estado, PDO::PARAM_STR);
					$sql_propietario->bindParam(':DocumentoPropietario', $valor, PDO::PARAM_STR);
					$sql_propietario->bindParam(':DocumentoPoseedor', $valor, PDO::PARAM_STR);
					$sql_propietario->bindParam(':DocumentoConductor', $valor, PDO::PARAM_STR);
					$sql_propietario->execute();
					$resultado = $sql_propietario->fetch(PDO::FETCH_ASSOC);
				}
				/* Validar el token */
				$fechaDateTime = DateTime::createFromFormat($formatoFecha, $resultado['fecha_vigencia']);
				$fechahorabd = DateTime::createFromFormat($formatoFecha, $fechaHoraActual);
				if ($resultado !== false) {
					// Dividir la fecha y hora en dos partes
					$partesactual = explode(' ', $fechaHoraActual);
					$fecha_actual = $partesactual[0];
					$hora_actual = $partesactual[1];

					$partes = explode(' ', $resultado['fecha_vigencia']);
					$fecha = $partes[0];
					$hora = $partes[1];
					if ($fecha_actual > $fecha) {
						// Calcular Diferencia de las fechas
						$fechahorabd = date_create($fechaHoraActual);
						// Calcular la diferencia
						$diferencia = $fechahorabd->diff($fechaDateTime);
						$response = ['numero' => 400, 'mensaje' => " Token Vencio Hace : " . $diferencia->format('%d días, %h horas, %i minutos, %s segundos, solicitar nuevo prefiltro.')];
					} else {
						$sql_update_estado_token = $this->_db3->prepare("UPDATE cmx_prefiltro_actualizar SET estado_token='Ocupado' WHERE token_actual=:token AND id_solicitud_u=:solicitud AND estado_token='Activo'");
						$sql_update_estado_token->bindParam(':token', $token, PDO::PARAM_STR);
						$sql_update_estado_token->bindParam(':solicitud', $estudio, PDO::PARAM_STR);
						$resultado_update = $sql_update_estado_token->execute();
						if ($resultado_update) {
							$response = ['numero' => 200, 'mensaje' =>  'Token Valido Hasta hoy : ' . $resultado['fecha_vigencia'] . ' para el estudio <strong>' . $estudio . '</strong>.'];
						} else {
							$response = ['numero' => 400, 'mensaje' => 'Este token <strong>' . $token . '</strong>, ya esta en uso no se permiten mas acciones con el token <strong>' . $token . '</strong>.'];
						}
					}
				} else {
					$response = array(
						'numero' => 400,
						'mensaje' => 'Este token <strong>' . $token . '</strong>, no pertenece al prefiltro <strong>' . $estudio . '</strong>.'
					);
				}
			} else if (isset($documentos->documento1) && isset($documentos->documento2)) {
				$estado = "Activo";
				foreach ($documentos as $valor) {
					$sql = $this->_db3->prepare("SELECT token_actual, fecha_vigencia FROM cmx_prefiltro_actualizar WHERE id_solicitud_u = :Estudio AND token_actual = :Token_actual AND estado_token = :Estado AND (documento_propietario = :DocumentoPropietario OR documento_poseedor = :DocumentoPoseedor OR documento_conductor = :DocumentoConductor)");
					$sql->bindParam(':Estudio', $estudio, PDO::PARAM_STR);
					$sql->bindParam(':Token_actual', $token, PDO::PARAM_STR);
					$sql->bindParam(':Estado', $estado, PDO::PARAM_STR);
					$sql->bindParam(':DocumentoPropietario', $valor, PDO::PARAM_STR);
					$sql->bindParam(':DocumentoPoseedor', $valor, PDO::PARAM_STR);
					$sql->bindParam(':DocumentoConductor', $valor, PDO::PARAM_STR);
					$sql->execute();
					$resultado = $sql->fetch(PDO::FETCH_ASSOC);
				}
				/* Validar el token */
				$fechaDateTime = DateTime::createFromFormat($formatoFecha, $resultado['fecha_vigencia']);
				$fechahorabd = DateTime::createFromFormat($formatoFecha, $fechaHoraActual);
				if ($resultado !== false) {
					// Dividir la fecha y hora en dos partes
					$partesactual = explode(' ', $fechaHoraActual);
					$fecha_actual = $partesactual[0];
					$hora_actual = $partesactual[1];

					$partes = explode(' ', $resultado['fecha_vigencia']);
					$fecha = $partes[0];
					$hora = $partes[1];
					if ($fecha_actual > $fecha) {
						// Calcular Diferencia de las fechas
						$fechahorabd = date_create($fechaHoraActual);
						// Calcular la diferencia
						$diferencia = $fechahorabd->diff($fechaDateTime);
						$response = ['numero' => 400, 'mensaje' => " Token Vencio Hace : " . $diferencia->format('%d días, %h horas, %i minutos, %s segundos, solicitar nuevo prefiltro.')];
					} else {
						$sql_update_estado_token = $this->_db3->prepare("UPDATE cmx_prefiltro_actualizar SET estado_token='Ocupado' WHERE token_actual=:token AND id_solicitud_u=:solicitud AND estado_token='Activo'");
						$sql_update_estado_token->bindParam(':token', $token, PDO::PARAM_STR);
						$sql_update_estado_token->bindParam(':solicitud', $estudio, PDO::PARAM_STR);
						$resultado_update = $sql_update_estado_token->execute();
						if ($resultado_update) {
							$response = ['numero' => 200, 'mensaje' =>  'Token Valido Hasta hoy : ' . $resultado['fecha_vigencia'] . ' para el estudio <strong>' . $estudio . '</strong>.'];
						} else {
							$response = ['numero' => 400, 'mensaje' => 'Este token <strong>' . $token . '</strong>, ya esta en uso no se permiten mas acciones con el token <strong>' . $token . '</strong>.'];
						}
					}
				} else {
					$response = ['numero' => 400, 'mensaje' => 'Este token <strong>' . $token . '</strong>, no pertenece al prefiltro <strong>' . $estudio . '</strong>.'];
				}
			} else {
				$estado = "Activo";
				foreach ($documentos as $valor) {
					$sql = $this->_db3->prepare("SELECT token_actual, fecha_vigencia FROM cmx_prefiltro_actualizar WHERE id_solicitud_u = :Estudio AND token_actual = :Token_actual AND estado_token = :Estado AND (documento_propietario = :DocumentoPropietario OR documento_poseedor = :DocumentoPoseedor OR documento_conductor = :DocumentoConductor)");
					$sql->bindParam(':Estudio', $estudio, PDO::PARAM_STR);
					$sql->bindParam(':Token_actual', $token, PDO::PARAM_STR);
					$sql->bindParam(':Estado', $estado, PDO::PARAM_STR);
					$sql->bindParam(':DocumentoPropietario', $valor, PDO::PARAM_STR);
					$sql->bindParam(':DocumentoPoseedor', $valor, PDO::PARAM_STR);
					$sql->bindParam(':DocumentoConductor', $valor, PDO::PARAM_STR);
					$sql->execute();
					$resultado = $sql->fetch(PDO::FETCH_ASSOC);
				}
				/* Validar el token */
				$fechaDateTime = DateTime::createFromFormat($formatoFecha, $resultado['fecha_vigencia']);
				$fechahorabd = DateTime::createFromFormat($formatoFecha, $fechaHoraActual);
				if ($resultado !== false) {
					// Dividir la fecha y hora en dos partes
					$partesactual = explode(' ', $fechaHoraActual);
					$fecha_actual = $partesactual[0];
					$hora_actual = $partesactual[1];

					$partes = explode(' ', $resultado['fecha_vigencia']);
					$fecha = $partes[0];
					$hora = $partes[1];
					if ($fecha_actual > $fecha) {
						// Calcular Diferencia de las fechas
						$fechahorabd = date_create($fechaHoraActual);
						// Calcular la diferencia
						$diferencia = $fechahorabd->diff($fechaDateTime);
						$response = ['numero' => 400, 'mensaje' => " Token Vencio Hace : " . $diferencia->format('%d días, %h horas, %i minutos, %s segundos, solicitar nuevo prefiltro.')];
					} else {
						$sql_update_estado_token = $this->_db3->prepare("UPDATE cmx_prefiltro_actualizar SET estado_token='Ocupado' WHERE token_actual=:token AND id_solicitud_u=:solicitud AND estado_token='Activo'");
						$sql_update_estado_token->bindParam(':token', $token, PDO::PARAM_STR);
						$sql_update_estado_token->bindParam(':solicitud', $estudio, PDO::PARAM_STR);
						$resultado_update = $sql_update_estado_token->execute();
						if ($resultado_update) {
							$response = ['numero' => 200, 'mensaje' =>  'Token Valido Hasta hoy : ' . $resultado['fecha_vigencia'] . ' para el estudio <strong>' . $estudio . '</strong>.'];
						} else {
							$response = ['numero' => 400, 'mensaje' => 'Este token <strong>' . $token . '</strong>, ya esta en uso no se permiten mas acciones con el token <strong>' . $token . '</strong>.'];
						}
					}
				} else {
					$response = ['numero' => 400, 'mensaje' => 'Este token <strong>' . $token . '</strong>, no pertenece al prefiltro <strong>' . $estudio . '</strong>.'];
				}
			}
		} catch (\Throwable $th) {
			throw $th;
		}
		return $response;
	}

	public function Consultar_Recurso_Estudio($estudio)
	{
		$response = [];
		$sql = $this->_db3->prepare("SELECT propietario,documento_propietario,poseedor,documento_poseedor,conductor,documento_conductor,id_solicitud_u AS ESTUDIO FROM cmx_prefiltro_actualizar WHERE id_solicitud_u = :Estudio");
		$sql->bindParam(':Estudio', $estudio, PDO::PARAM_STR);
		$sql->execute();
		$resultado = $sql->fetch(PDO::FETCH_ASSOC);
		/* Consular si existen las hojas de vida para una buena creacion */
		if ($resultado != "") {
			// Convertir el resultado en un array
			$array_resultado = [
				'documento_propietario' => $resultado['documento_propietario'],
				'documento_poseedor' => $resultado['documento_poseedor'],
				'documento_conductor' => $resultado['documento_conductor'],
			];
			// Recorrer el array resultante
			foreach ($array_resultado as $key => $value) {
				// echo $key . ': ' . $value . '<br>';
				$sql_validado = $this->_db3->prepare("SELECT numero_documento FROM cmx_proveedores WHERE numero_documento=:documento");
				$sql_validado->bindParam(':documento', $value, PDO::PARAM_STR);
				$sql_validado->execute();
				$resultado_validacion = $sql_validado->fetchAll(PDO::FETCH_ASSOC);
			}
			if ($resultado_validacion) {
				$response = [
					'resultado' => $resultado,
					'validar' => $resultado_validacion,
				];
			} else {
				$response = [
					'resultado' => $resultado,
					'validar' => "Sin documentos",
				];
			}
		} else {
			echo "error al consultar";
			exit();
		}
		return $response;
	}

	public function Cosultar_datos_estudio($dato)
	{
		$sql = $this->_db3->prepare("SELECT * FROM cmx_prefiltro_actualizar WHERE documento_conductor=:Documento");
		$sql->bindParam(':Documento', $dato, PDO::PARAM_STR);
		$sql->execute();
		$resultado = $sql->fetch(PDO::FETCH_ASSOC);
		return $resultado;
	}

	public function Cosultar_datos_estudio_prefiltro($dato)
	{
		$response = [];
		$sql = $this->_db3->prepare("SELECT documento_propietario,documento_tenedor,documento_conductor,id AS ESTUDIO FROM cmx_vehiculos_preestudio WHERE id=:Numdoc");
		$sql->bindParam(':Numdoc', $dato, PDO::PARAM_STR);
		$sql->execute();
		$resultado = $sql->fetch(PDO::FETCH_ASSOC);
		if ($resultado) {
			// Convertir el resultado en un array
			$array_resultado = [
				'documento_propietario' => $resultado['documento_propietario'],
				'documento_tenedor' => $resultado['documento_tenedor'],
				'documento_conductor' => $resultado['documento_conductor'],
			];
			// Recorrer el array resultante
			foreach ($array_resultado as $key => $value) {
				$sql_validado = $this->_db3->prepare("SELECT numero_documento FROM cmx_proveedores WHERE numero_documento=:documento");
				$sql_validado->bindParam(':documento', $value, PDO::PARAM_STR);
				$sql_validado->execute();
				$resultado_validacion = $sql_validado->fetchAll(PDO::FETCH_ASSOC);
			}

			if ($resultado_validacion) {
				$response = [
					'prefiltro' => $resultado,
					'validar' => $resultado_validacion,
				];
			} else {
				$response = [
					'prefiltro' => $resultado,
					'validar' => "Sin documentos",
				];
			}
		} else {
			echo "error al consultar";
			exit();
		}
		return $response;
	}

	public function Cosultar_datos_prefiltro($datos)
	{
		$fecha = date("Y-m-d");
		$sql = $this->_db3->prepare("SELECT * FROM cmx_vehiculos_preestudio WHERE documento_conductor=:documento AND fecha=:fecha");
		$sql->bindParam(':documento', $datos, PDO::PARAM_STR);
		$sql->bindParam(':fecha', $fecha, PDO::PARAM_STR);
		$sql->execute();
		$resultado = $sql->fetch(PDO::FETCH_ASSOC);

		$sql_referencia = $this->_db3->prepare("SELECT * FROM cmx_referencias_preestudio WHERE id_conductor=:documento");
		$sql_referencia->bindParam(':documento', $datos, PDO::PARAM_STR);
		$sql_referencia->execute();
		$resultado_referencia = $sql_referencia->fetchAll(PDO::FETCH_ASSOC);

		$response = [
			"datos" => $resultado,
			"referencias" => $resultado_referencia
		];

		return $response;
	}

	public function Guardar_proveedor($datos)
	{
		$response = []; // Inicializa la variable de respuesta
		$id_usuario = $_SESSION["usuario"]["id_usuario"];
		$fecha_actual = date('Y-m-d');
		$hora_actual = date('H:i:s');
		$user = $_SESSION["usuario"]["nom_usuario"];

		try {
			$this->_db3->beginTransaction();
			// Consultar maestro de Estudio de seguridad cabecera
			$sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='PROVEEDORES' AND numero_actual>numero_inicial");
			$resultado_consecutivo = $sql_consecutivo->execute();
			$resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
			$numdoc_cabecera = $resultado_consecutivo['numero_actual'];
			$numdoc_actualizar_cabecera = $resultado_consecutivo['numero_actual'] + 1;
			if ($numdoc_cabecera) {
				// Actualizar Maestro de Estudio segurdad cabecera
				$sql_updata_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numdoc_actualizar_cabecera WHERE tipo='PROVEEDORES'");
				$resultado_consecutivo_update_cabecera = $sql_updata_maestro->execute();
				if ($resultado_consecutivo_update_cabecera) {
					$rndc_id = 0;
					$sql = $this->_db3->prepare("INSERT INTO cmx_proveedores (rndc_id, numdoc_nexos, tipo_documento, numero_documento, digito_verificacion,tipo_identificacion, nombre,apellido1,apellido2, abreviatura, contacto, celular, direccion, email, id_municipio, 
					rndc_categoria_licencia,rndc_numero_licencia, rndc_vencimiento_licencia,estado)
					VALUES (:rndc_id,:numdoc_nexos,:tipo_documento,:numero_documento,:digito_verificacion,:tipo_identificacion,:nombre,:apellido1,:apellido2,:abreviatura,:contacto,:celular,:direccion,:email,:id_municipio,:rndc_categoria_licencia,:rndc_numero_licencia,
					:rndc_vencimiento_licencia,:estado)");
					$sql->bindParam(':rndc_id', $rndc_id, PDO::PARAM_STR);
					$sql->bindParam(':numdoc_nexos', $numdoc_cabecera, PDO::PARAM_STR);
					$sql->bindParam(':tipo_documento', $datos['tipo_documento'], PDO::PARAM_STR);
					$sql->bindParam(':numero_documento', $datos['numero_documento'], PDO::PARAM_STR);
					$sql->bindParam(':digito_verificacion', $datos['digito_verificacion'], PDO::PARAM_STR);
					$sql->bindParam(':tipo_identificacion', $datos['tipo_identificacion'], PDO::PARAM_STR);
					$sql->bindParam(':nombre', $datos['rndc_nombre2'], PDO::PARAM_STR);
					$sql->bindParam(':apellido1', $datos['apellido1'], PDO::PARAM_STR);
					$sql->bindParam(':apellido2', $datos['apellido2'], PDO::PARAM_STR);
					$sql->bindParam(':abreviatura', $datos['abreviatura'], PDO::PARAM_STR);
					$sql->bindParam(':contacto', $datos['contacto'], PDO::PARAM_STR);
					$sql->bindParam(':celular', $datos['celular'], PDO::PARAM_STR);
					$sql->bindParam(':direccion', $datos['direccion'], PDO::PARAM_STR);
					$sql->bindParam(':email', $datos['email'], PDO::PARAM_STR);
					$sql->bindParam(':id_municipio', $datos['municipio'], PDO::PARAM_STR);
					$sql->bindParam(':rndc_categoria_licencia', $datos['rndc_categoria_licencia'], PDO::PARAM_STR);
					$sql->bindParam(':rndc_numero_licencia', $datos['rndc_numero_licencia'], PDO::PARAM_STR);
					$sql->bindParam(':rndc_vencimiento_licencia', $datos['rndc_vencimiento_licencia'], PDO::PARAM_STR);
					$sql->bindParam(':estado', $datos['estado'], PDO::PARAM_STR);
					$resultado = $sql->execute();
					/* Insertardocumentos */
					if ($resultado) {
						$ruta = "../public/files/proveedores/" . $numdoc_cabecera . "/";
						$ruta_base = "public/files/proveedores/" . $numdoc_cabecera . "/";
						$sql = "UPDATE cmx_proveedores SET documentos_soporte = '$ruta_base' WHERE numdoc_nexos = " . $numdoc_cabecera . "";
						$consulta_act_proveedor = $this->_db3->prepare($sql);
						$consulta_act_proveedor->execute();
						if (!file_exists($ruta)) {
							mkdir($ruta, 0777, true);
						}
						for ($x = 0; $x < count($datos['documentos']['name']); $x++) {
							if (isset($datos["documentos"])) {
								$file = $datos["documentos"];
								$nombre = $file["name"];
								$tipo = $file["type"];
								$ruta_provisional = $file["tmp_name"];
								$carpeta = $ruta;
								$src = $carpeta . $nombre;
								move_uploaded_file($ruta_provisional, $src);
							}
						}
						$sql_log = "INSERT INTO cmx_log_proveedores (id_usuario,id_proveedor,operacion,fecha_hora_operacion) VALUES ($id_usuario,$numdoc_cabecera,'Crear',NOW())";
						$crear_log_proveedor = $this->_db3->prepare($sql_log);
						$crear_log_proveedor->execute();
						if ($crear_log_proveedor) {
							if ($datos['Conductor'] == true) {
								$sqlc = "INSERT INTO cmx_detalle_conductor (id,celular2,nombre_eps,fecha_vence_eps,ultimo_eps,nombre_arl,fecha_vence_arl,ultimo_arl,nombre_entidad,vence_curso,sexo,fecha_nacimiento,grupo_sanguineo,estado_civil,fecha_ingreso,id_proveedor)
								VALUES(null,:celular2,:nombre_eps,:fecha_vencimiento,:ultimo_eps,:nombre_arl,:fecha_vencimiento_arl,:ultimo_arl,:nombre_entidad,:vence_curso,:sex,:fecha_nace,:sangre,:civil,:fecha_ingreso,:id_proveedor)";
								$crear_solicitud = $this->_db3->prepare($sqlc);
								$crear_solicitud->bindParam(':celular2', $datos['celular2'], PDO::PARAM_STR);
								$crear_solicitud->bindParam(':nombre_eps', $datos['nombre_eps'], PDO::PARAM_STR);
								$crear_solicitud->bindParam(':fecha_vencimiento', $datos['fecha_vencimiento'], PDO::PARAM_NULL);
								$crear_solicitud->bindParam(':ultimo_eps', $datos['ultimo_eps'], PDO::PARAM_NULL);
								$crear_solicitud->bindParam(':nombre_arl', $datos['nombre_arl'], PDO::PARAM_STR);
								$crear_solicitud->bindParam(':fecha_vencimiento_arl', $datos['fecha_vencimiento_arl'], PDO::PARAM_NULL);
								$crear_solicitud->bindParam(':ultimo_arl', $datos['ultimo_arl'], PDO::PARAM_NULL);
								$crear_solicitud->bindParam(':nombre_entidad', $datos['nombre_entidad'], PDO::PARAM_STR);
								$crear_solicitud->bindParam(':vence_curso', $datos['vence_curso'], PDO::PARAM_STR);
								$crear_solicitud->bindParam(':sex', $datos['sexo'], PDO::PARAM_STR);
								$crear_solicitud->bindParam(':fecha_nace', $datos['fecha_nace'], PDO::PARAM_STR);
								$crear_solicitud->bindParam(':sangre', $datos['sangre'], PDO::PARAM_STR);
								$crear_solicitud->bindParam(':civil', $datos['civil'], PDO::PARAM_STR);
								$crear_solicitud->bindParam(':fecha_ingreso', $datos['fecha_ingreso'], PDO::PARAM_STR);
								$crear_solicitud->bindParam(':id_proveedor', $numdoc_cabecera, PDO::PARAM_STR);
								$result = $crear_solicitud->execute();
								if ($result) {
									$sql_block = $this->_db3->prepare("INSERT INTO cmx_estado_bloqueo (nombre_proceso,estado_proceso,id_objeto,tipo_objeto,fecha,hora,usuario) 
									VALUES ('modificar','desbloqueado','" . $numdoc_cabecera . "','proveedor','" . $fecha_actual . "','" . $hora_actual . "','" . $user . "')");
									$result_estado = $sql_block->execute();
									if ($result_estado) {
										/* LLmado a la funcio de insertar las referencias del proveedor */
										$Referencias = $this->Isnertar_referencias_hojas_de_vida($datos, $numdoc_cabecera);
										/* Validar la respuetsa de la opeeracion */
										if ($Referencias == true) {
											$Fotos = $this->Insertar_documentos_proveedor($datos, $numdoc_cabecera);
											if ($Fotos == true) {
												$sql_actividad =  $this->_db3->prepare("INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ($numdoc_cabecera,'Conductor')");
												$result_actividad = $sql_actividad->execute();
												if ($result_actividad) {
													$this->_db3->commit();
													$response = array(
														'numero' => 200,
														'mensaje' => 'Se Registro Datos Exitosamente NEXOSAPP."',
													);
												} else {
													$this->_db3->rollBack();
													$response = array(
														'numero' => 400,
														'mensaje' => 'Error No se creo el Tercero en NEXOSAPP.',
													);
												}
											} else {
												// Falla en la actualización, revertir la transacción
												$this->_db3->rollBack();
												$response = array(
													'numero' => 400,
													'mensaje' => 'Error No se creo el Tercero en NEXOSAPP.',
												);
												// Puedes lanzar una excepción específica aquí si lo deseas
												$mensajeError = "Error al insertar las referencias del conductor." . $datos['numero_documento'] . " El dia " . date("Y-m.d");
												error_log($mensajeError . "\n", 3, "error_log.txt");
												throw new Exception("Error al guardar proveedor 1");
											}
										} else {
											// Falla en la actualización, revertir la transacción
											// $this->_db3->rollBack();
											// $this->_db3->rollBack();
											$response = array(
												'numero' => 400,
												'mensaje' => 'Error al insertar las referencias del conductor.',
											);
											// Puedes lanzar una excepción específica aquí si lo deseas
											$mensajeError = "Error al insertar las referencias del conductor." . $datos['numero_documento'] . " El dia " . date("Y-m.d");
											error_log($mensajeError . "\n", 3, "error_log.txt");
											// throw new Exception("Error al guardar proveedor 2");
										}
									} else if (!$result_estado) {
										// Falla en la actualización, revertir la transacción
										// $this->_db3->rollBack();
										// Puedes lanzar una excepción específica aquí si lo deseas
										$mensajeError = "Error al consultar las referecias laborales." . date("Y-m.d");
										error_log($mensajeError . "\n", 3, "error_log.txt");
										throw new Exception("Error al guardar proveedor 3");
									}
								} else if (!$result) {
									// Falla en la actualización, revertir la transacción
									// $this->_db3->rollBack();
									// Puedes lanzar una excepción específica aquí si lo deseas
									$mensajeError = "Error al insertar detalles del conductor." . date("Y-m.d");
									error_log($mensajeError . "\n", 3, "error_log.txt");
									throw new Exception("Error al guardar proveedor 4");
								}
							} else {
								# otras activvidades
								if ($datos['poseedor_vehiculo'] == "true") {
									$sql = $this->_db3->prepare("INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ($numdoc_cabecera,'Poseedor Vehiculo')");
									$result = $sql->execute();
									if ($result) {
										$this->_db3->commit();
										$response = array(
											'numero' => 200,
											'mensaje' => 'Se Registro Datos Exitosamente NEXOSAPP.',
										);
									} else {
										// Falla en la actualización, revertir la transacción
										$this->_db3->rollBack();
										$response = array(
											'numero' => 400,
											'mensaje' => 'Error No se creo el Tercero en NEXOSAPP.',
										);
										// Puedes lanzar una excepción específica aquí si lo deseas
										$mensajeError = "Error al insertar las referencias del conductor." . $datos['numero_documento'] . " El dia " . date("Y-m.d");
										error_log($mensajeError . "\n", 3, "error_log.txt");
										throw new Exception("Error al guardar proveedor");
									}
								} else if ($datos['propietario_vehiculo'] == "true") {
									$sql =  $this->_db3->prepare("INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ($numdoc_cabecera,'Propietario Vehiculo')");
									$result = $sql->execute();
									if ($result) {
										$this->_db3->commit();
										$response = array(
											'numero' => 200,
											'mensaje' => 'Se Registro Datos Exitosamente NEXOSAPP.',
										);
									} else {
										// Falla en la actualización, revertir la transacción
										$this->_db3->rollBack();
										$response = array(
											'numero' => 400,
											'mensaje' => 'Error No se creo el Tercero en NEXOSAPP.',
										);
										// Puedes lanzar una excepción específica aquí si lo deseas
										$mensajeError = "Error al insertar las referencias del conductor." . $datos['numero_documento'] . " El dia " . date("Y-m.d");
										error_log($mensajeError . "\n", 3, "error_log.txt");
										throw new Exception("Error al guardar proveedor 5");
									}
								}
							}
						} else if (!$crear_log_proveedor) {
							// Falla en la actualización, revertir la transacción
							// $this->_db3->rollBack();
							$response = array('numero' => 400, 'mensaje' => 'Proveedor no  <strong> ingresado </strong> correctamente en NexosApp.');
							// Puedes lanzar una excepción específica aquí si lo deseas
							$mensajeError = "Error al insertar proveedor en la base de datos deespues del log." . date("Y-m.d");
							error_log($mensajeError . "\n", 3, "error_log.txt");
							throw new Exception("Error al insertar proveedor en NexosApp.");
						}
					} else {
						// Falla en la actualización, revertir la transacción
						// $this->_db3->rollBack();
						$response = array('numero' => 400, 'mensaje' => 'Proveedor no  <strong> ingresado </strong> correctamente en NexosApp.');
						// Puedes lanzar una excepción específica aquí si lo deseas
						$mensajeError = "Error al insertar proveedor en la base de datos." . date("Y-m.d");
						error_log($mensajeError . "\n", 3, "error_log.txt");
						throw new Exception("Error al insertar proveedor en NexosApp.");
					}
				} else {
					// Falla en la actualización, revertir la transacción
					// $this->_db3->rollBack();
					// Puedes lanzar una excepción específica aquí si lo deseas
					$mensajeError = "Error al actualizar el consecutivo para la creacion." . date("Y-m.d");
					error_log($mensajeError . "\n", 3, "error_log.txt");
					throw new Exception("Error al guardar proveedor");
				}
			} else {
				// Falla en la actualización, revertir la transacción
				// $this->_db3->rollBack();
				// Puedes lanzar una excepción específica aquí si lo deseas
				$mensajeError = "Error al consultar el consecutivo para la creacion." . date("Y-m.d");
				error_log($mensajeError . "\n", 3, "error_log.txt");
				throw new Exception("Error al guardar proveedor 6");
			}
		} catch (\Throwable $th) {
			// Manejar la excepción
			// Puedes mostrar un mensaje de error o registrar la excepción en un archivo de registro
			// echo "Error: " . $th->getMessage();
			// O simplemente relanzar la excepción si deseas propagarla
			$mensajeError = "Error en el proceso." . date("Y-m.d");
			error_log($mensajeError . "\n", 3, "error_log.txt");
			throw $th;
		}
		return $response;
	}

	public function Isnertar_referencias_hojas_de_vida($datos, $numdoc_cabecera)
	{
		$cont = 0;
		$fecha_actual = date('Y-m-d');
		$hora_actual = date('H:i:s');
		$user = $_SESSION["usuario"]["nom_usuario"];
		//VALIDAR SI existe la referencia laboral
		$sql_z =  $this->_db3->prepare("SELECT * FROM cmx_referencias_preestudio WHERE id_conductor=:numero_documento");
		$sql_z->bindParam(':numero_documento', $datos['numero_documento'], PDO::PARAM_STR);
		$sql_z->execute();
		$total = $sql_z->rowCount();
		if ($total == 0) {
			//crear las rutas
			if ($datos['documento_referencia1'] != null) {
				$ruta_empresarial1 = "../public/files/proveedores/empresarial/" . $numdoc_cabecera . "/1/";
				$ruta_empresarial11 = "public/files/proveedores/empresarial/" . $numdoc_cabecera . "/1/";
				$esatdo_ref = 1;
				$sql_rl1 = $this->_db3->prepare("INSERT INTO cmx_referencias_preestudio
									 (id,nombre_empresa,fecha_ingreso,fecha_retiro,persona_contacto,celular,cargo,id_conductor,antiguedad,documento_empresarial,name_documento,fecha,hora,usuario,estado)
									 VALUES(null,:referencias_empresariales,:fecha_ereferencia1,:fecha_retiro1,:contacto_ref1,:celular_ref1,:cargo_ref1,:numero_documento,:anti_ref1,:ruta_empresarial11,:name_soporte,:fecha_actual,:hora_actual,:user,:estado)");
				$sql_rl1->bindParam(':referencias_empresariales', $datos['referencias_empresariales1'], PDO::PARAM_STR);
				$sql_rl1->bindParam(':fecha_ereferencia1', $datos['fecha_referencia1'], PDO::PARAM_STR);
				$sql_rl1->bindParam(':fecha_retiro1', $datos['fecha_retiro1'], PDO::PARAM_STR);
				$sql_rl1->bindParam(':contacto_ref1', $datos['contacto_ref1'], PDO::PARAM_STR);
				$sql_rl1->bindParam(':celular_ref1', $datos['celular_ref1'], PDO::PARAM_STR);
				$sql_rl1->bindParam(':cargo_ref1', $datos['cargo_ref1'], PDO::PARAM_STR);
				$sql_rl1->bindParam(':numero_documento', $datos['numero_documento'], PDO::PARAM_STR);
				$sql_rl1->bindParam(':anti_ref1', $datos['anti_ref1'], PDO::PARAM_STR);
				$sql_rl1->bindParam(':ruta_empresarial11', $ruta_empresarial11, PDO::PARAM_STR);
				$sql_rl1->bindParam(':name_soporte', $datos['name_soporte'], PDO::PARAM_STR);
				$sql_rl1->bindParam(':fecha_actual', $fecha_actual, PDO::PARAM_STR);
				$sql_rl1->bindParam(':hora_actual', $hora_actual, PDO::PARAM_STR);
				$sql_rl1->bindParam(':user', $user, PDO::PARAM_STR);
				$sql_rl1->bindParam(':estado', $esatdo_ref, PDO::PARAM_STR);
				$resultl1 = $sql_rl1->execute();
				//ARCHIVOS DE REFERENCIAS LABORALES      1
				if ($resultl1) {
					$cont++;
					//obtener el id de la referencia laboral 1
					if (!file_exists($ruta_empresarial1)) {
						mkdir($ruta_empresarial1, 0777, true);
						//referencias empresariales 1
						for ($a = 0; $a < count($datos['documento_referencia1']['name']); $a++) {
							if (isset($datos["documento_referencia1"])) {
								$file = $datos["documento_referencia1"];
								$nombre = $file["name"];
								$tipo = $file["type"];
								$ruta_provisional = $file["tmp_name"];
								$carpeta = $ruta_empresarial1;
								$src = $carpeta . $nombre;
								move_uploaded_file($ruta_provisional, $src);
							}
						}
					} else {
						// Falla en la actualización, revertir la transacción
						// $this->_db3->rollBack();
						// Puedes lanzar una excepción específica aquí si lo deseas
						$mensajeError = "Error al creear la carpeta de  lareferecia laboral." . date("Y-m.d");
						error_log($mensajeError . "\n", 3, "error_log.txt");
						throw new Exception("Error al guardar proveedor");
					}
				}
			} else {
				$esatdo_ref = 1;
				$ruta_ref = 'Sin documento';
				$sql_rl1 = $this->_db3->prepare("INSERT INTO cmx_referencias_preestudio
									 (id,nombre_empresa,fecha_ingreso,fecha_retiro,persona_contacto,celular,cargo,id_conductor,antiguedad,documento_empresarial,name_documento,fecha,hora,usuario,estado)
									 VALUES(null,:referencias_empresariales,:fecha_ereferencia1,:fecha_retiro1,:contacto_ref1,:celular_ref1,:cargo_ref1,:numero_documento,:anti_ref1,:ruta_empresarial11,:name_soporte,:fecha_actual,:hora_actual,:user,:estado)");
				$sql_rl1->bindParam(':referencias_empresariales', $datos['referencias_empresariales1'], PDO::PARAM_STR);
				$sql_rl1->bindParam(':fecha_ereferencia1', $datos['fecha_referencia1'], PDO::PARAM_STR);
				$sql_rl1->bindParam(':fecha_retiro1', $datos['fecha_retiro1'], PDO::PARAM_STR);
				$sql_rl1->bindParam(':contacto_ref1', $datos['contacto_ref1'], PDO::PARAM_STR);
				$sql_rl1->bindParam(':celular_ref1', $datos['celular_ref1'], PDO::PARAM_STR);
				$sql_rl1->bindParam(':cargo_ref1', $datos['cargo_ref1'], PDO::PARAM_STR);
				$sql_rl1->bindParam(':numero_documento', $datos['numero_documento'], PDO::PARAM_STR);
				$sql_rl1->bindParam(':anti_ref1', $datos['anti_ref1'], PDO::PARAM_STR);
				$sql_rl1->bindParam(':ruta_empresarial11', $ruta_ref, PDO::PARAM_STR);
				$sql_rl1->bindParam(':name_soporte', $datos['name_soporte'], PDO::PARAM_STR);
				$sql_rl1->bindParam(':fecha_actual', $fecha_actual, PDO::PARAM_STR);
				$sql_rl1->bindParam(':hora_actual', $hora_actual, PDO::PARAM_STR);
				$sql_rl1->bindParam(':user', $user, PDO::PARAM_STR);
				$sql_rl1->bindParam(':estado', $esatdo_ref, PDO::PARAM_STR);
				$resultl1 = $sql_rl1->execute();
				if ($resultl1) {
					$cont++;
				} else {
					echo "no inserto ref1";
				}
			}

			/* Referencia 2 */
			if ($datos['documento_referencia2'] != null) {
				$ruta_empresarial2 = "../public/files/proveedores/empresarial/" . $numdoc_cabecera . "/2/";
				$ruta_empresarial22 = "public/files/proveedores/empresarial/" . $numdoc_cabecera . "/2/";
				$esatdo_ref = 1;
				$sql_rl2 = $this->_db3->prepare("INSERT INTO cmx_referencias_preestudio (id,nombre_empresa,fecha_ingreso,fecha_retiro,persona_contacto,celular,cargo,id_conductor,antiguedad,documento_empresarial,name_documento,fecha,hora,usuario,estado)
														 VALUES(null,:referencias_empresariales,:fecha_ereferencia2,:fecha_retiro2,:contacto_ref2,:celular_ref2,:cargo_ref2,:numero_documento,:anti_ref2,:ruta_empresarial22,:name_soporte,:fecha_actual,:hora_actual,:user,:estado)");
				$sql_rl2->bindParam(':referencias_empresariales', $datos['referencias_empresariales2'], PDO::PARAM_STR);
				$sql_rl2->bindParam(':fecha_ereferencia2', $datos['fecha_referencia2'], PDO::PARAM_STR);
				$sql_rl2->bindParam(':fecha_retiro2', $datos['fecha_retiro2'], PDO::PARAM_STR);
				$sql_rl2->bindParam(':contacto_ref2', $datos['contacto_ref2'], PDO::PARAM_STR);
				$sql_rl2->bindParam(':celular_ref2', $datos['celular_ref2'], PDO::PARAM_STR);
				$sql_rl2->bindParam(':cargo_ref2', $datos['cargo_ref2'], PDO::PARAM_STR);
				$sql_rl2->bindParam(':numero_documento', $datos['numero_documento'], PDO::PARAM_STR);
				$sql_rl2->bindParam(':anti_ref2', $datos['anti_ref2'], PDO::PARAM_STR);
				$sql_rl2->bindParam(':ruta_empresarial22', $ruta_empresarial22, PDO::PARAM_STR);
				$sql_rl2->bindParam(':name_soporte', $datos['name_soporte2'], PDO::PARAM_STR);
				$sql_rl2->bindParam(':fecha_actual', $fecha_actual, PDO::PARAM_STR);
				$sql_rl2->bindParam(':hora_actual', $hora_actual, PDO::PARAM_STR);
				$sql_rl2->bindParam(':user', $user, PDO::PARAM_STR);
				$sql_rl2->bindParam(':estado', $esatdo_ref, PDO::PARAM_STR);
				$resultl2 = $sql_rl2->execute();
				//ARCHIVOS DE REFERENCIAS LABORALES      1
				if ($resultl2) {
					$cont++;
					//obtener el id de la referencia laboral 1
					if (!file_exists($ruta_empresarial2)) {
						mkdir($ruta_empresarial2, 0777, true);
						//referencias empresariales 1
						for ($a = 0; $a < count($datos['documento_referencia2']['name']); $a++) {
							if (isset($datos["documento_referencia2"])) {
								$file = $datos["documento_referencia2"];
								$nombre = $file["name"];
								$tipo = $file["type"];
								$ruta_provisional = $file["tmp_name"];
								$carpeta = $ruta_empresarial2;
								$src = $carpeta . $nombre;
								move_uploaded_file($ruta_provisional, $src);
							}
						}
					} else {
						// Falla en la actualización, revertir la transacción
						// $this->_db3->rollBack();
						// Puedes lanzar una excepción específica aquí si lo deseas
						$mensajeError = "Error al creear la carpeta de  lareferecia laboral." . date("Y-m.d");
						error_log($mensajeError . "\n", 3, "error_log.txt");
						throw new Exception("Error al guardar proveedor");
					}
				}
			} else {
				$esatdo_ref = 1;
				$ruta_ref = 'Sin documento 2';
				$sql_rl2 = $this->_db3->prepare("INSERT INTO cmx_referencias_preestudio (id,nombre_empresa,fecha_ingreso,fecha_retiro,persona_contacto,celular,cargo,id_conductor,antiguedad,documento_empresarial,name_documento,fecha,hora,usuario,estado)
														 VALUES(null,:referencias_empresariales,:fecha_ereferencia2,:fecha_retiro2,:contacto_ref2,:celular_ref2,:cargo_ref2,:numero_documento,:anti_ref2,:ruta_empresarial22,:name_soporte,:fecha_actual,:hora_actual,:user,:estado)");
				$sql_rl2->bindParam(':referencias_empresariales', $datos['referencias_empresariales2'], PDO::PARAM_STR);
				$sql_rl2->bindParam(':fecha_ereferencia2', $datos['fecha_referencia2'], PDO::PARAM_STR);
				$sql_rl2->bindParam(':fecha_retiro2', $datos['fecha_retiro2'], PDO::PARAM_STR);
				$sql_rl2->bindParam(':contacto_ref2', $datos['contacto_ref2'], PDO::PARAM_STR);
				$sql_rl2->bindParam(':celular_ref2', $datos['celular_ref2'], PDO::PARAM_STR);
				$sql_rl2->bindParam(':cargo_ref2', $datos['cargo_ref2'], PDO::PARAM_STR);
				$sql_rl2->bindParam(':numero_documento', $datos['numero_documento'], PDO::PARAM_STR);
				$sql_rl2->bindParam(':anti_ref2', $datos['anti_ref2'], PDO::PARAM_STR);
				$sql_rl2->bindParam(':ruta_empresarial22', $ruta_ref, PDO::PARAM_STR);
				$sql_rl2->bindParam(':name_soporte', $datos['name_soporte2'], PDO::PARAM_STR);
				$sql_rl2->bindParam(':fecha_actual', $fecha_actual, PDO::PARAM_STR);
				$sql_rl2->bindParam(':hora_actual', $hora_actual, PDO::PARAM_STR);
				$sql_rl2->bindParam(':user', $user, PDO::PARAM_STR);
				$sql_rl2->bindParam(':estado', $esatdo_ref, PDO::PARAM_STR);
				$resultl2 = $sql_rl2->execute();
				if ($resultl2) {
					$cont++;
				} else {
					echo "no inserto ref2";
				}
			}

			/* Referencia 3*/
			if ($datos['documento_referencia3'] != null) {
				$ruta_empresarial3 = "../public/files/proveedores/empresarial/" . $numdoc_cabecera . "/3/";
				$ruta_empresarial33 = "public/files/proveedores/empresarial/" . $numdoc_cabecera . "/3/";
				$esatdo_ref = 1;
				$sql_rl3 = $this->_db3->prepare("INSERT INTO cmx_referencias_preestudio (id,nombre_empresa,fecha_ingreso,fecha_retiro,persona_contacto,celular,cargo,id_conductor,antiguedad,documento_empresarial,name_documento,fecha,hora,usuario,estado)
																								 VALUES(null,:referencias_empresariales,:fecha_ereferencia3,:fecha_retiro3,:contacto_ref3,:celular_ref3,:cargo_ref3,:numero_documento,:anti_ref3,:ruta_empresarial33,:name_soporte,:fecha_actual,:hora_actual,:user,:estado)");
				$sql_rl3->bindParam(':referencias_empresariales', $datos['referencias_empresariales3'], PDO::PARAM_STR);
				$sql_rl3->bindParam(':fecha_ereferencia3', $datos['fecha_referencia3'], PDO::PARAM_STR);
				$sql_rl3->bindParam(':fecha_retiro3', $datos['fecha_retiro3'], PDO::PARAM_STR);
				$sql_rl3->bindParam(':contacto_ref3', $datos['contacto_ref3'], PDO::PARAM_STR);
				$sql_rl3->bindParam(':celular_ref3', $datos['celular_ref3'], PDO::PARAM_STR);
				$sql_rl3->bindParam(':cargo_ref3', $datos['cargo_ref3'], PDO::PARAM_STR);
				$sql_rl3->bindParam(':numero_documento', $datos['numero_documento'], PDO::PARAM_STR);
				$sql_rl3->bindParam(':anti_ref3', $datos['anti_ref3'], PDO::PARAM_STR);
				$sql_rl3->bindParam(':ruta_empresarial33', $ruta_ref, PDO::PARAM_STR);
				$sql_rl3->bindParam(':name_soporte', $datos['name_soporte3'], PDO::PARAM_STR);
				$sql_rl3->bindParam(':fecha_actual', $fecha_actual, PDO::PARAM_STR);
				$sql_rl3->bindParam(':hora_actual', $hora_actual, PDO::PARAM_STR);
				$sql_rl3->bindParam(':user', $user, PDO::PARAM_STR);
				$sql_rl3->bindParam(':estado', $esatdo_ref, PDO::PARAM_STR);
				$resultl3 = $sql_rl3->execute();
				//ARCHIVOS DE REFERENCIAS LABORALES      1
				if ($resultl3) {
					$cont++;
					//obtener el id de la referencia laboral 1
					if (!file_exists($ruta_empresarial3)) {
						mkdir($ruta_empresarial3, 0777, true);
						//referencias empresariales 1
						for ($a = 0; $a < count($datos['documento_referencia3']['name']); $a++) {
							if (isset($datos["documento_referencia3"])) {
								$file = $datos["documento_referencia3"];
								$nombre = $file["name"];
								$tipo = $file["type"];
								$ruta_provisional = $file["tmp_name"];
								$carpeta = $ruta_empresarial2;
								$src = $carpeta . $nombre;
								move_uploaded_file($ruta_provisional, $src);
							}
						}
					} else {
						// Falla en la actualización, revertir la transacción
						// $this->_db3->rollBack();
						// Puedes lanzar una excepción específica aquí si lo deseas
						$mensajeError = "Error al creear la carpeta de  lareferecia laboral." . date("Y-m.d");
						error_log($mensajeError . "\n", 3, "error_log.txt");
						throw new Exception("Error al guardar proveedor");
					}
				}
			} else {
				$esatdo_ref = 1;
				$ruta_ref = 'Sin documento 3';
				$sql_rl3 = $this->_db3->prepare("INSERT INTO cmx_referencias_preestudio (id,nombre_empresa,fecha_ingreso,fecha_retiro,persona_contacto,celular,cargo,id_conductor,antiguedad,documento_empresarial,name_documento,fecha,hora,usuario,estado)
																								 VALUES(null,:referencias_empresariales,:fecha_ereferencia3,:fecha_retiro3,:contacto_ref3,:celular_ref3,:cargo_ref3,:numero_documento,:anti_ref3,:ruta_empresarial33,:name_soporte,:fecha_actual,:hora_actual,:user,:estado)");
				$sql_rl3->bindParam(':referencias_empresariales', $datos['referencias_empresariales3'], PDO::PARAM_STR);
				$sql_rl3->bindParam(':fecha_ereferencia3', $datos['fecha_referencia3'], PDO::PARAM_STR);
				$sql_rl3->bindParam(':fecha_retiro3', $datos['fecha_retiro3'], PDO::PARAM_STR);
				$sql_rl3->bindParam(':contacto_ref3', $datos['contacto_ref3'], PDO::PARAM_STR);
				$sql_rl3->bindParam(':celular_ref3', $datos['celular_ref3'], PDO::PARAM_STR);
				$sql_rl3->bindParam(':cargo_ref3', $datos['cargo_ref3'], PDO::PARAM_STR);
				$sql_rl3->bindParam(':numero_documento', $datos['numero_documento'], PDO::PARAM_STR);
				$sql_rl3->bindParam(':anti_ref3', $datos['anti_ref3'], PDO::PARAM_STR);
				$sql_rl3->bindParam(':ruta_empresarial33', $ruta_ref, PDO::PARAM_STR);
				$sql_rl3->bindParam(':name_soporte', $datos['name_soporte3'], PDO::PARAM_STR);
				$sql_rl3->bindParam(':fecha_actual', $fecha_actual, PDO::PARAM_STR);
				$sql_rl3->bindParam(':hora_actual', $hora_actual, PDO::PARAM_STR);
				$sql_rl3->bindParam(':user', $user, PDO::PARAM_STR);
				$sql_rl3->bindParam(':estado', $esatdo_ref, PDO::PARAM_STR);
				$resultl3 = $sql_rl3->execute();
				if ($resultl3) {
					$cont++;
				} else {
					echo "no inserto ref2";
				}
			}
		} else {
			#actualziar referencias
			$ruta_empresarial1 = "../public/files/proveedores/empresarial/" . $numdoc_cabecera . "/1/";
			$ruta_empresarial11 = "public/files/proveedores/empresarial/" . $numdoc_cabecera . "/1/";
			$aleatorio1 = rand(10000, 90000);
			$aleatorio2 = rand(10000, 90000);
			if (isset($datos['name_soporte'])) {
				$nombrea = $aleatorio1 . $datos['name_soporte'] . $aleatorio2;
			} else {
				$nombrea = '';
			}
			$sqlr1 = $this->_db3->prepare("UPDATE cmx_referencias_preestudio SET id_conductor=:numero_documento, documento_empresarial=:ruta_empresarial11, name_documento=:nombrea WHERE id=:idp1");
			$sqlr1->bindParam(':numero_documento', $datos['numero_documento'], PDO::PARAM_STR);
			$sqlr1->bindParam(':ruta_empresarial11', $ruta_empresarial11, PDO::PARAM_STR);
			$sqlr1->bindParam(':nombrea', $nombrea, PDO::PARAM_STR);
			$sqlr1->bindParam(':idp1', $datos['idp1'], PDO::PARAM_STR);
			$result = $sqlr1->execute();
			if ($result) {
				$cont++;
				if ($datos['name_soporte'] != '' && $datos['name_soporte'] != null) {
					if (!file_exists($ruta_empresarial1)) {
						mkdir($ruta_empresarial1, 0777, true);
					}
					//referencias empresariales 1
					for ($a = 0; $a < count($datos['documento_referencia1']['name']); $a++) {
						if (isset($datos["documento_referencia1"])) {
							$file = $datos["documento_referencia1"];
							$nombre = $aleatorio1 . $file["name"] . $aleatorio2;
							$tipo = $file["type"];
							$ruta_provisional = $file["tmp_name"];
							$carpeta = $ruta_empresarial1;
							$src = $carpeta . $nombre;
							move_uploaded_file($ruta_provisional, $src);
						}
					}
				}
			}

			/* Referencia 2 */
			$ruta_empresarial2 = "../public/files/proveedores/empresarial/" . $numdoc_cabecera . "/2/";
			$ruta_empresarial22 = "public/files/proveedores/empresarial/" . $numdoc_cabecera . "/2/";
			$aleatorio1 = rand(10000, 90000);
			$aleatorio2 = rand(10000, 90000);
			if (isset($datos['name_soporte2'])) {
				$nombrea = $aleatorio1 . $datos['name_soporte2'] . $aleatorio2;
			} else {
				$nombrea = '';
			}
			$sqlr2 = $this->_db3->prepare("UPDATE cmx_referencias_preestudio SET id_conductor=:numero_documento, documento_empresarial=:ruta_empresarial22, name_documento=:nombrea WHERE id=:idp2");
			$sqlr2->bindParam(':numero_documento', $datos['numero_documento'], PDO::PARAM_STR);
			$sqlr2->bindParam(':ruta_empresarial22', $ruta_empresarial22, PDO::PARAM_STR);
			$sqlr2->bindParam(':nombrea', $nombrea, PDO::PARAM_STR);
			$sqlr2->bindParam(':idp2', $datos['idp2'], PDO::PARAM_STR);
			$result2 = $sqlr2->execute();
			if ($result2) {
				$cont++;
				if ($datos['name_soporte2'] != '' && $datos['name_soporte2'] != null) {
					if (!file_exists($ruta_empresarial2)) {
						mkdir($ruta_empresarial2, 0777, true);
					}
					//referencias empresariales 1
					for ($a = 0; $a < count($datos['documento_referencia2']['name']); $a++) {
						if (isset($datos["documento_referencia2"])) {
							$file = $datos["documento_referencia2"];
							$nombre = $aleatorio1 . $file["name"] . $aleatorio2;
							$tipo = $file["type"];
							$ruta_provisional = $file["tmp_name"];
							$carpeta = $ruta_empresarial2;
							$src = $carpeta . $nombre;
							move_uploaded_file($ruta_provisional, $src);
						}
					}
				}
			}

			/* Referencia 3 */
			$ruta_empresarial3 = "../public/files/proveedores/empresarial/" . $numdoc_cabecera . "/3/";
			$ruta_empresarial33 = "public/files/proveedores/empresarial/" . $numdoc_cabecera . "/3/";
			$aleatorio1 = rand(10000, 90000);
			$aleatorio2 = rand(10000, 90000);
			if (isset($datos['name_soporte3'])) {
				$nombrea = $aleatorio1 . $datos['name_soporte3'] . $aleatorio2;
			} else {
				$nombrea = '';
			}
			$sqlr3 = $this->_db3->prepare("UPDATE cmx_referencias_preestudio SET id_conductor=:numero_documento, documento_empresarial=:ruta_empresarial33, name_documento=:nombrea WHERE id=:idp2");
			$sqlr3->bindParam(':numero_documento', $datos['numero_documento'], PDO::PARAM_STR);
			$sqlr3->bindParam(':ruta_empresarial33', $ruta_empresarial33, PDO::PARAM_STR);
			$sqlr3->bindParam(':nombrea', $nombrea, PDO::PARAM_STR);
			$sqlr3->bindParam(':idp2', $datos['idp2'], PDO::PARAM_STR);
			$result3 = $sqlr3->execute();
			if ($result3) {
				$cont++;
				if ($datos['name_soporte3'] != '' && $datos['name_soporte3'] != null) {
					if (!file_exists($ruta_empresarial3)) {
						mkdir($ruta_empresarial3, 0777, true);
					}
					//referencias empresariales 1
					for ($a = 0; $a < count($datos['documento_referencia3']['name']); $a++) {
						if (isset($datos["documento_referencia3"])) {
							$file = $datos["documento_referencia3"];
							$nombre = $aleatorio1 . $file["name"] . $aleatorio2;
							$tipo = $file["type"];
							$ruta_provisional = $file["tmp_name"];
							$carpeta = $ruta_empresarial3;
							$src = $carpeta . $nombre;
							move_uploaded_file($ruta_provisional, $src);
						}
					}
				}
			}
		}
		/* Fin de refernciaas empresariales. */

		//REFERENCIAS PERSONALES
		if ($datos['docu_personal1'] != null) {
			$ruta_personal1 = "../public/files/proveedores/personal/" . $numdoc_cabecera . "/1/";
			$ruta_personal11 = "public/files/proveedores/personal/" . $numdoc_cabecera . "/1/";
			$estado = 1;
			$sql_rp1 =  $this->_db3->prepare("INSERT INTO cmx_referencias_personales (id,nombre_personal,fecha_personal,parentezco,tel_personal,documento_personal,name_documento,id_conductor,usuario,fecha,hora,estado)
																	VALUES(null,:referencias_personales,:fecha_preferencia1,:parenp1,:telefonop1,:ruta_personal11,:docu_personal1,:id_proveedor,:user,:fecha_actual,:hora_actual,:estado)");
			$sql_rp1->bindParam(':referencias_personales', $datos['referencias_personales'], PDO::PARAM_STR);
			$sql_rp1->bindParam(':fecha_preferencia1', $datos['fecha_personal1'], PDO::PARAM_STR);
			$sql_rp1->bindParam(':parenp1', $datos['parenp1'], PDO::PARAM_STR);
			$sql_rp1->bindParam(':telefonop1', $datos['telefonop1'], PDO::PARAM_STR);
			$sql_rp1->bindParam(':ruta_personal11', $ruta_personal11, PDO::PARAM_STR);
			$sql_rp1->bindParam(':docu_personal1', $datos['docu_personal1'], PDO::PARAM_STR);
			$sql_rp1->bindParam(':id_proveedor', $numdoc_cabecera, PDO::PARAM_STR);
			$sql_rp1->bindParam(':user', $user, PDO::PARAM_STR);
			$sql_rp1->bindParam(':fecha_actual', $fecha_actual, PDO::PARAM_STR);
			$sql_rp1->bindParam(':hora_actual', $hora_actual, PDO::PARAM_STR);
			$sql_rp1->bindParam(':estado', $estado, PDO::PARAM_STR);
			$result4 = $sql_rp1->execute();
			if ($result4) {
				$cont++;
				if (!file_exists($ruta_personal1)) {
					mkdir($ruta_personal1, 0777, true);
				}
				//referencias personales 1
				for ($c = 0; $c < count($datos['docu_personal1']['name']); $c++) {
					if (isset($daatos["docu_personal1"])) {
						$file = $daatos["docu_personal1"];
						$nombre = $file["name"];
						$tipo = $file["type"];
						$ruta_provisional = $file["tmp_name"];
						$carpeta = $ruta_personal1;
						$src = $carpeta . $nombre;
						move_uploaded_file($ruta_provisional, $src);
					}
				}
			} else {
				echo "No inserto refp1";
			}
		} else {
			$estado = 1;
			$ruta_per1 = 'Sin documento refp 1';
			$sql_rp1 =  $this->_db3->prepare("INSERT INTO cmx_referencias_personales (id,nombre_personal,fecha_personal,parentezco,tel_personal,documento_personal,name_documento,id_conductor,usuario,fecha,hora,estado)
																	VALUES(null,:referencias_personales,:fecha_preferencia1,:parenp1,:telefonop1,:ruta_personal11,:docu_personal1,:id_proveedor,:user,:fecha_actual,:hora_actual,:estado)");
			$sql_rp1->bindParam(':referencias_personales', $datos['referencias_personales'], PDO::PARAM_STR);
			$sql_rp1->bindParam(':fecha_preferencia1', $datos['fecha_personal1'], PDO::PARAM_STR);
			$sql_rp1->bindParam(':parenp1', $datos['parenp1'], PDO::PARAM_STR);
			$sql_rp1->bindParam(':telefonop1', $datos['telefonop1'], PDO::PARAM_STR);
			$sql_rp1->bindParam(':ruta_personal11', $ruta_per1, PDO::PARAM_STR);
			$sql_rp1->bindParam(':docu_personal1', $datos['docu_personal1'], PDO::PARAM_STR);
			$sql_rp1->bindParam(':id_proveedor', $numdoc_cabecera, PDO::PARAM_STR);
			$sql_rp1->bindParam(':user', $user, PDO::PARAM_STR);
			$sql_rp1->bindParam(':fecha_actual', $fecha_actual, PDO::PARAM_STR);
			$sql_rp1->bindParam(':hora_actual', $hora_actual, PDO::PARAM_STR);
			$sql_rp1->bindParam(':estado', $estado, PDO::PARAM_STR);
			$result4 = $sql_rp1->execute();
			if ($result4) {
				$cont++;
			} else {
				echo "No inserto refp1";
			}
		}

		if ($datos['docu_personal2'] != null) {
			$ruta_personal2 = "../public/files/proveedores/personal/" . $numdoc_cabecera . "/2/";
			$ruta_personal22 = "public/files/proveedores/personal/" . $numdoc_cabecera . "/2/";
			$sql_rp2 =  $this->_db3->prepare("INSERT INTO cmx_referencias_personales (id,nombre_personal,fecha_personal,parentezco,tel_personal,documento_personal,name_documento,id_conductor,usuario,fecha,hora,estado)
														VALUES(null,:referencias_personales,:fecha_preferencia2,:parenp2,:telefonop2,:ruta_personal22,:docu_personal2,:id_proveedor,:user,:fecha_actual,:hora_actual,:estado)");
			$sql_rp2->bindParam(':referencias_personales', $datos['referencias_personales'], PDO::PARAM_STR);
			$sql_rp2->bindParam(':fecha_preferencia2', $datos['fecha_personal2'], PDO::PARAM_STR);
			$sql_rp2->bindParam(':parenp2', $datos['parenp2'], PDO::PARAM_STR);
			$sql_rp2->bindParam(':telefonop2', $datos['telefonop2'], PDO::PARAM_STR);
			$sql_rp2->bindParam(':ruta_personal22', $ruta_personal22, PDO::PARAM_STR);
			$sql_rp2->bindParam(':docu_personal2', $datos['docu_personal2'], PDO::PARAM_STR);
			$sql_rp2->bindParam(':id_proveedor', $numdoc_cabecera, PDO::PARAM_STR);
			$sql_rp2->bindParam(':user', $user, PDO::PARAM_STR);
			$sql_rp2->bindParam(':fecha_actual', $fecha_actual, PDO::PARAM_STR);
			$sql_rp2->bindParam(':hora_actual', $hora_actual, PDO::PARAM_STR);
			$sql_rp2->bindParam(':estado', $estado, PDO::PARAM_STR);
			$resultl5 = $sql_rp2->execute();
			if ($resultl5) {
				$cont++;
				if (!file_exists($ruta_personal2)) {
					mkdir($ruta_personal2, 0777, true);
				}
				//referencias personales 2
				for ($d = 0; $d < count($datos['docu_personal2']['name']); $d++) {
					if (isset($datos["docu_personal2"])) {
						$file = $datos["docu_personal2"];
						$nombre = $file["name"];
						$tipo = $file["type"];
						$ruta_provisional = $file["tmp_name"];
						$carpeta = $ruta_personal2;
						$src = $carpeta . $nombre;
						move_uploaded_file($ruta_provisional, $src);
					}
				}
			} else {
				echo "no inserto refp2";
			}
		} else {
			$sql_rp2 =  $this->_db3->prepare("INSERT INTO cmx_referencias_personales (id,nombre_personal,fecha_personal,parentezco,tel_personal,documento_personal,name_documento,id_conductor,usuario,fecha,hora,estado)
			VALUES(null,:referencias_personales,:fecha_preferencia2,:parenp2,:telefonop2,:ruta_personal22,:docu_personal2,:id_proveedor,:user,:fecha_actual,:hora_actual,:estado)");
			$sql_rp2->bindParam(':referencias_personales', $datos['referencias_personales'], PDO::PARAM_STR);
			$sql_rp2->bindParam(':fecha_preferencia2', $datos['fecha_personal2'], PDO::PARAM_STR);
			$sql_rp2->bindParam(':parenp2', $datos['parenp2'], PDO::PARAM_STR);
			$sql_rp2->bindParam(':telefonop2', $datos['telefonop2'], PDO::PARAM_STR);
			$sql_rp2->bindParam(':ruta_personal22', $ruta_personal22, PDO::PARAM_STR);
			$sql_rp2->bindParam(':docu_personal2', $datos['docu_personal2'], PDO::PARAM_STR);
			$sql_rp2->bindParam(':id_proveedor', $numdoc_cabecera, PDO::PARAM_STR);
			$sql_rp2->bindParam(':user', $user, PDO::PARAM_STR);
			$sql_rp2->bindParam(':fecha_actual', $fecha_actual, PDO::PARAM_STR);
			$sql_rp2->bindParam(':hora_actual', $hora_actual, PDO::PARAM_STR);
			$sql_rp2->bindParam(':estado', $estado, PDO::PARAM_STR);
			$resultl5 = $sql_rp2->execute();
			if ($resultl5) {
				$cont++;
			} else {
				echo "no inserto refp2";
			}
		}
		/* Validar el envio de documentos y dar una respuesta */
		if ($cont == 5) {
			return true;
		} else if ($cont != 5) {
			return false;
		}
	}

	public function Insertar_documentos_proveedor($datos, $numdoc_cabecera)
	{
		$cont_doc = 0;
		//REGISTRAR LA RUTA DEL ARCHIVO PARA LICENCIA DEL CONDUCTOR
		$ruta_licencia = "../public/files/proveedores/licencias/" . $numdoc_cabecera . "/";
		$ruta_licencias = "public/files/proveedores/licencias/" . $numdoc_cabecera . "/";
		$sqll =  $this->_db3->prepare("UPDATE cmx_proveedores SET subir_licencia ='$ruta_licencias', n_docu_licencia='" . $datos['name_doculice'] . "'WHERE numdoc_nexos = " . $numdoc_cabecera . "");
		$sqll->execute();
		if ($sqll) {
			$cont_doc++;
			if (!file_exists($ruta_licencia)) {
				mkdir($ruta_licencia, 0777, true);
			}
			//LICENCIA
			for ($i = 0; $i < count($datos['licencia']['name']); $i++) {
				if (isset($datos["licencia"])) {
					$file = $datos["licencia"];
					$nombre = $file["name"];
					$tipo = $file["type"];
					$ruta_provisional = $file["tmp_name"];
					$carpeta = $ruta_licencia;
					$src = $carpeta . $nombre;
					move_uploaded_file($ruta_provisional, $src);
				}
			}
		} else {
			// Falla en la actualización, revertir la transacción
			// $this->_db3->rollBack();
			// Puedes lanzar una excepción específica aquí si lo deseas
			$mensajeError = "Error al momento de subir el documento de la licencia." . date("Y-m.d");
			error_log($mensajeError . "\n", 3, "error_log.txt");
			throw new Exception("Error al guardar proveedor");
		}

		//REGISTRAR EL ARCHIVO DE LA EPS
		$ruta_eps = "../public/files/proveedores/eps/" . $numdoc_cabecera . "/";
		$ruta_eps2 = "public/files/proveedores/eps/" . $numdoc_cabecera . "/";
		$sqle =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET documento_eps='$ruta_eps2', n_docu_eps='" . $datos['nombre_eps'] . "' WHERE id_proveedor = " . $numdoc_cabecera . "");
		$sqle->execute();
		if ($sqle) {
			// $cont_doc++;
			if (!file_exists($ruta_eps)) {
				mkdir($ruta_eps, 0777, true);
			}
			//EPS
			for ($m = 0; $m < count($datos['docu_eps']['name']); $m++) {
				if (isset($_POST["docu_eps"])) {
					$file = $_POST["docu_eps"];
					$nombre = $file["name"];
					$tipo = $file["type"];
					$ruta_provisional = $file["tmp_name"];
					$carpeta = $ruta_eps;
					$src = $carpeta . $nombre;
					move_uploaded_file($ruta_provisional, $src);
				}
			}
		} else {
			// Falla en la actualización, revertir la transacción
			// $this->_db3->rollBack();
			// Puedes lanzar una excepción específica aquí si lo deseas
			$mensajeError = "Error al momento de subir el documento de la eps." . date("Y-m.d");
			error_log($mensajeError . "\n", 3, "error_log.txt");
			throw new Exception("Error al guardar proveedor");
		}

		//FOTOS CONDUCTOR
		//foto_frontal
		$ruta_fotos1 = "../public/files/proveedores/fotos/" . $numdoc_cabecera . "/F/";
		$ruta_fotos11 = "public/files/proveedores/fotos/" . $numdoc_cabecera . "/F/";
		$sqlf = $this->_db3->prepare("UPDATE cmx_detalle_conductor SET foto_conductor='$ruta_fotos11', name_cfrontal='" . $datos['name_fontall'] . "' WHERE id_proveedor= " . $numdoc_cabecera . "");
		$sqlf->execute();
		if ($sqlf) {
			$cont_doc++;
			if (!file_exists($ruta_fotos1)) {
				mkdir($ruta_fotos1, 0777, true);
			}
			//fotos
			for ($k = 0; $k < count($datos['foto_conductor']['name']); $k++) {
				if (isset($datos["foto_conductor"])) {
					$file = $datos["foto_conductor"];
					$nombre = $file["name"];
					$tipo = $file["type"];
					$ruta_provisional = $file["tmp_name"];
					$carpeta = $ruta_fotos1;
					$src = $carpeta . $nombre;
					move_uploaded_file($ruta_provisional, $src);
				}
			}
		} else {
			// Falla en la actualización, revertir la transacción
			// $this->_db3->rollBack();
			// Puedes lanzar una excepción específica aquí si lo deseas
			$mensajeError = "Error al momento de subir el foto frontal del conductor." . date("Y-m.d");
			error_log($mensajeError . "\n", 3, "error_log.txt");
			throw new Exception("Error al guardar proveedor");
		}

		//FOTO DERECHA
		$ruta_fotod1 = "../public/files/proveedores/fotos/" . $numdoc_cabecera . "/D/";
		$ruta_fotod11 = "public/files/proveedores/fotos/" . $numdoc_cabecera . "/D/";

		$sqlfd = $this->_db3->prepare("UPDATE cmx_detalle_conductor SET foto_derecha='$ruta_fotod11', name_cderecha='" . $datos['name_derecha'] . "' WHERE id_proveedor= " . $numdoc_cabecera . "");
		$sqlfd->execute();
		if ($sqlfd) {
			$cont_doc++;
			if (!file_exists($ruta_fotod1)) {
				mkdir($ruta_fotod1, 0777, true);
			}
			//fotos
			for ($u = 0; $u < count($datos['foto_derecha']['name']); $u++) {
				if (isset($datos["foto_derecha"])) {
					$file = $datos["foto_derecha"];
					$nombre = $file["name"];
					$tipo = $file["type"];
					$ruta_provisional = $file["tmp_name"];
					$carpeta = $ruta_fotod1;
					$src = $carpeta . $nombre;
					move_uploaded_file($ruta_provisional, $src);
				}
			}
		} else {
			// Falla en la actualización, revertir la transacción
			// $this->_db3->rollBack();
			// Puedes lanzar una excepción específica aquí si lo deseas
			$mensajeError = "Error al momento de subir el foto derecha del conductor." . date("Y-m.d");
			error_log($mensajeError . "\n", 3, "error_log.txt");
			throw new Exception("Error al guardar proveedor");
		}

		//FOTO IZQUIERDA
		$ruta_fotoi1 = "../public/files/proveedores/fotos/" . $numdoc_cabecera . "/I/";
		$ruta_fotoi11 = "public/files/proveedores/fotos/" . $numdoc_cabecera . "/I/";
		$sqlfi = $this->_db3->prepare("UPDATE cmx_detalle_conductor SET foto_izquierda='$ruta_fotoi11', name_cizquierda='" . $datos['name_izquierda'] . "' WHERE id_proveedor= " . $numdoc_cabecera . "");
		$sqlfi->execute();
		if ($sqlfi) {
			$cont_doc++;
			if (!file_exists($ruta_fotoi1)) {
				mkdir($ruta_fotoi1, 0777, true);
			}
			//fotos
			for ($v = 0; $v < count($datos['foto_izquierda']['name']); $v++) {
				if (isset($datos["foto_izquierda"])) {
					$file = $datos["foto_izquierda"];
					$nombre = $file["name"];
					$tipo = $file["type"];
					$ruta_provisional = $file["tmp_name"];
					$carpeta = $ruta_fotoi1;
					$src = $carpeta . $nombre;
					move_uploaded_file($ruta_provisional, $src);
				}
			}
		} else {
			// Falla en la actualización, revertir la transacción
			// $this->_db3->rollBack();
			// Puedes lanzar una excepción específica aquí si lo deseas
			$mensajeError = "Error al momento de subir el foto Izquierda del conductor." . date("Y-m.d");
			error_log($mensajeError . "\n", 3, "error_log.txt");
			throw new Exception("Error al guardar proveedor");
		}

		//INDUMENTARIA
		$ruta_indumentaria1 = "../public/files/proveedores/indumentaria/" . $numdoc_cabecera . "/";
		$ruta_indumentaria11 = "public/files/proveedores/indumentaria/" . $numdoc_cabecera . "/";
		$sqli = $this->_db3->prepare("UPDATE cmx_detalle_conductor SET foto_indumentaria='$ruta_indumentaria11', name_cindu='" . $datos['name_indum'] . "' WHERE id_proveedor= " . $numdoc_cabecera . "");
		$sqli->execute();
		if ($sqli) {
			$cont_doc++;
			if (!file_exists($ruta_indumentaria1)) {
				mkdir($ruta_indumentaria1, 0777, true);
			}
			//indumentaria
			for ($n = 0; $n < count($datos['foto_indume']['name']); $n++) {
				if (isset($_FILES["foto_indume"])) {
					$file = $_FILES["foto_indume"];
					$nombre = $file["name"];
					$tipo = $file["type"];
					$ruta_provisional = $file["tmp_name"];
					$carpeta = $ruta_indumentaria1;
					$src = $carpeta . $nombre;
					move_uploaded_file($ruta_provisional, $src);
				}
			}
		} else {
			// Falla en la actualización, revertir la transacción
			// $this->_db3->rollBack();
			// Puedes lanzar una excepción específica aquí si lo deseas
			$mensajeError = "Error al momento de subir el foto Indumentaria del conductor." . date("Y-m.d");
			error_log($mensajeError . "\n", 3, "error_log.txt");
			throw new Exception("Error al guardar proveedor");
		}

		//CURSO MERCANCIAS PELIGROSAS
		$ruta_mercancias1 = "../public/files/proveedores/curso/" . $numdoc_cabecera . "/";
		$ruta_mercancias11 = "public/files/proveedores/curso/" . $numdoc_cabecera . "/";
		$sqlm =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET  carnet_curso= '$ruta_mercancias11',	n_docu_curso='" . $datos['namedocu_curso'] . "'  WHERE id_proveedor=" . $numdoc_cabecera . "");
		$sqlm->execute();
		if ($sqlm) {
			$cont_doc++;
			if (!file_exists($ruta_mercancias1)) {
				mkdir($ruta_mercancias1, 0777, true);
			}
			//mercancias
			for ($e = 0; $e < count($datos['docu_curso']['name']); $e++) {
				if (isset($datos["docu_curso" . $e])) {
					$file = $datos["docu_curso" . $e];
					$nombre = $file["name"];
					$tipo = $file["type"];
					$ruta_provisional = $file["tmp_name"];
					$carpeta = $ruta_mercancias1;
					$src = $carpeta . $nombre;
					move_uploaded_file($ruta_provisional, $src);
				}
			}
		} else {
			// Falla en la actualización, revertir la transacción
			// $this->_db3->rollBack();
			// Puedes lanzar una excepción específica aquí si lo deseas
			$mensajeError = "Error al momento de subir el foto Mercancias peligrosas del conductor." . date("Y-m.d");
			error_log($mensajeError . "\n", 3, "error_log.txt");
			throw new Exception("Error al guardar proveedor");
		}

		//RUT
		$ruta_rut1 = "../public/files/proveedores/rut/" . $numdoc_cabecera . "/";
		$ruta_rut11 = "public/files/proveedores/rut/" . $numdoc_cabecera . "/";
		$sqlrut =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET  documento_rut= '$ruta_rut11', n_docu_rut='" . $datos['name_docurut'] . "'  WHERE id_proveedor=" . $numdoc_cabecera . "");
		$sqlrut->execute();
		if ($sqlrut) {
			$cont_doc++;
			if (!file_exists($ruta_rut1)) {
				mkdir($ruta_rut1, 0777, true);
			}
			//rut
			for ($s = 0; $s < count($datos['rut']['name']); $s++) {
				if (isset($datos["rut"])) {
					$file = $datos["rut"];
					$nombre = $file["name"];
					$tipo = $file["type"];
					$ruta_provisional = $file["tmp_name"];
					$carpeta = $ruta_rut1;
					$src = $carpeta . $nombre;
					move_uploaded_file($ruta_provisional, $src);
				}
			}
		} else {
			// Falla en la actualización, revertir la transacción
			// $this->_db3->rollBack();
			// Puedes lanzar una excepción específica aquí si lo deseas
			$mensajeError = "Error al momento de subir el foto del Rut conductor." . date("Y-m.d");
			error_log($mensajeError . "\n", 3, "error_log.txt");
			throw new Exception("Error al guardar proveedor");
		}

		//ACUERDOS
		$ruta_ac1 = "../public/files/proveedores/acuerdo/" . $numdoc_cabecera . "/AC1/";
		$ruta_ac11 = "public/files/proveedores/acuerdo/" . $numdoc_cabecera . "/AC1/";
		$sqlau =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET foto_acuerdo1='$ruta_ac11', name_acuerdo1='" . $datos['name_a1'] . "' WHERE id_proveedor= " . $numdoc_cabecera . "");
		$sqlau->execute();
		if ($sqlau) {
			$cont_doc++;
			if (!file_exists($ruta_ac1)) {
				mkdir($ruta_ac1, 0777, true);
			}

			for ($s = 0; $s < count($datos['acuerdo_uno']['name']); $s++) {
				if (isset($_FILES["acuerdo_uno"])) {
					$file = $_FILES["acuerdo_uno"];
					$nombre = $file["name"];
					$tipo = $file["type"];
					$ruta_provisional = $file["tmp_name"];
					$carpeta = $ruta_ac1;
					$src = $carpeta . $nombre;
					move_uploaded_file($ruta_provisional, $src);
				}
			}
		} else {
			// Falla en la actualización, revertir la transacción
			// $this->_db3->rollBack();
			// Puedes lanzar una excepción específica aquí si lo deseas
			$mensajeError = "Error al momento de subir el foto de Acuerdos del conductor." . date("Y-m.d");
			error_log($mensajeError . "\n", 3, "error_log.txt");
			throw new Exception("Error al guardar proveedor");
		}

		if ($cont_doc >= 8) {
			return true;
		} else if ($cont_doc < 8) {
			return false;
		}
	}
}

// class Proveedores
// {

	// public $user_log;
	// public $pass;
	// public $mensaje;
	// public $respuesta;
	// public $email;
	// public $listado;
// 	public function listarProveedores()
// 	{
// 		$model    = new Conexion;
// 		$conexion = $model->conectar();
// 		$sql = "
// 				SELECT 
// 					cp.*, cm.municipio as 'ciudad'
// 				FROM 
// 					cmx_proveedores cp
// 					INNER JOIN cmx_municipios cm ON cp.id_municipio = cm.id
// 				ORDER BY cp.rndc_id DESC, cp.id DESC
// --			LIMIT 100;
// 			";
// 		$consulta = $conexion->prepare($sql);
// 		$consulta->execute();
// 		$total         = $consulta->rowCount();
// 		$this->mensaje = $total;
// 		if ($total == 0) {
// 			$this->respuesta = "BAD";
// 		} else {
// 			$this->respuesta = "GOOD";
// 			while ($datos_proveedores = $consulta->fetch()) {
// 				$this->listado[] = $datos_proveedores;
// 			}
// 		}
// 	}

// 	public function ObtenerMunicipios()
// 	{
// 		$model    = new Conexion;
// 		$conexion = $model->conectar();
// 		$sql      = " SELECT * FROM cmx_municipios ";
// 		$consulta = $conexion->prepare($sql);
// 		$consulta->execute();
// 		$total = $consulta->rowCount();
// 		$this->mensaje = $total;
// 		if ($total == 0) {
// 			$this->respuesta = "BAD";
// 		} else {
// 			$this->respuesta = "GOOD";
// 			while ($datos_municipio = $consulta->fetch()) {
// 				$this->listado[] = $datos_municipio;
// 			}
// 		}
// 	}
// }
