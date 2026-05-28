<?php

// use PhpParser\Node\Expr\Exit_;
// session_start();

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
		--LIMIT 100
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
		if ($tipo == '1' || $tipo == '2' || $tipo == '3' || $tipo == '6') { //otros actores
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

			if ($tipo == '6') {
				$acti = 'Propietario Trailer';
			}

			if ($valor == 'name') {
				$sql = 'SELECT cp.*, CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS ciudad, ap.actividad
					FROM cmx_proveedores cp
					INNER JOIN cmx_municipios cm ON cp.id_municipio = cm.id
					INNER JOIN cmx_actividad_proveedor ap ON cp.numdoc_nexos=ap.id_proveedor
					WHERE  cp.nombre LIKE  "%' . $name . '%" AND ap.actividad="' . $acti . '"
					ORDER BY nombre ASC';
			}
			if ($valor == 'num') {
				$sql = 'SELECT cp.*, 
					CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS ciudad,ap.actividad
					FROM cmx_proveedores cp
					INNER JOIN cmx_municipios cm ON cp.id_municipio = cm.id
					INNER JOIN cmx_actividad_proveedor ap ON cp.numdoc_nexos=ap.id_proveedor
					WHERE cp.numero_documento="' . $docu . '" AND ap.actividad="' . $acti . '"
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
					INNER JOIN cmx_municipios cm ON cp.id_municipio=cm.id
					INNER JOIN cmx_actividad_proveedor ap ON cp.numdoc_nexos=ap.id_proveedor
					LEFT JOIN cmx_proveedores_detalle pd ON cp.id=pd.id_proveedor
					WHERE ap.actividad="Proveedor" AND pd.cod_tipo_proveedor=' . $param1 . ' ORDER BY cp.nombre ASC';
			}
			if ($valor == 'name') {
				$sql = 'SELECT cp.*, CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS ciudad, ap.actividad
					FROM cmx_proveedores cp
					INNER JOIN cmx_municipios cm ON cp.id_municipio = cm.id
					INNER JOIN cmx_actividad_proveedor ap ON cp.numdoc_nexos=ap.id_proveedor
					WHERE  cp.nombre LIKE  "%' . $name . '%" AND ap.actividad="Proveedor" ORDER BY cp.nombre ASC';
			}
			if ($valor == 'num') {
				$sql = 'SELECT cp.*, CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS ciudad, ap.actividad
					FROM cmx_proveedores cp
					INNER JOIN cmx_municipios cm ON cp.id_municipio = cm.id
					INNER JOIN cmx_actividad_proveedor ap ON cp.numdoc_nexos=ap.id_proveedor
					WHERE cp.numero_documento="' . $docu . '" AND ap.actividad="Proveedor" ORDER BY cp.numero_documento DESC';
			}
			if ($valor == 'geo') {
				$sql = 'SELECT cp.*, CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS ciudad, ap.actividad
					FROM cmx_proveedores cp
					INNER JOIN cmx_municipios cm ON cp.id_municipio=cm.id
					INNER JOIN cmx_actividad_proveedor ap ON cp.numdoc_nexos=ap.id_proveedor
					LEFT JOIN cmx_proveedores_detalle pd ON cp.id=pd.id_proveedor
					WHERE ap.actividad="Proveedor" AND pd.cod_pais=' . $param1 . '
					ORDER BY cp.nombre ASC';
				//echo $sql;
			}
			if ($valor == 'servicio') {
				if ($param1 == 'Transporte') {
					$sql = 'SELECT cp.*, CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS ciudad, ap.actividad
						FROM cmx_proveedores cp
						INNER JOIN cmx_municipios cm ON cp.id_municipio=cm.id
						INNER JOIN cmx_actividad_proveedor ap ON cp.numdoc_nexos=ap.id_proveedor
						LEFT JOIN cmx_proveedores_detalle pd ON cp.numdoc_nexos=pd.id_proveedor
						WHERE  ap.actividad="Proveedor" AND pd.tipo_servicio="Transporte" AND pd.tipo_servicio_detalle2="' . $param2 . '" ORDER BY cp.nombre ASC';
				}
				if ($param1 == 'Porteadores') {
					$sql = 'SELECT cp.*, CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS ciudad, ap.actividad
						FROM cmx_proveedores cp
						INNER JOIN cmx_municipios cm ON cp.id_municipio=cm.id
						INNER JOIN cmx_actividad_proveedor ap ON cp.numdoc_nexos=ap.id_proveedor
						LEFT JOIN cmx_proveedores_detalle pd ON cp.numdoc_nexos=pd.id_proveedor
						WHERE ap.actividad="Proveedor" AND pd.tipo_servicio="Porteadores" AND pd.tipo_servicio_detalle1="' . $param2 . '" ORDER BY cp.nombre ASC';
				}
				if ($param1 == 'Agenciamiento de carga') {
					$sql = 'SELECT cp.*, CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS ciudad, ap.actividad
						FROM cmx_proveedores cp
						INNER JOIN cmx_municipios cm ON cp.id_municipio=cm.id
						INNER JOIN cmx_actividad_proveedor ap ON cp.numdoc_nexos=ap.id_proveedor
						LEFT JOIN cmx_proveedores_detalle pd ON cp.numdoc_nexos=pd.id_proveedor
						WHERE ap.actividad="Proveedor" AND pd.tipo_servicio="Agenciamiento de carga" AND pd.tipo_servicio_detalle1="' . $param2 . '" ORDER BY cp.nombre ASC';
				}
				if ($param1 == 'Tramites Administrativos') {
					$sql = 'SELECT cp.*, CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS ciudad, ap.actividad
						FROM cmx_proveedores cp
						INNER JOIN cmx_municipios cm ON cp.id_municipio=cm.id
						INNER JOIN cmx_actividad_proveedor ap ON cp.numdoc_nexos=ap.id_proveedor
						LEFT JOIN cmx_proveedores_detalle pd ON cp.numdoc_nexos=pd.id_proveedor
						WHERE ap.actividad="Proveedor" AND pd.tipo_servicio="Tramites Administrativos" AND pd.tipo_servicio_detalle1="' . $param2 . '" ORDER BY cp.nombre ASC';
				}
				if ($param1 !== 'Transporte' && $param1 !== 'Porteadores' &&  $param1 !== 'Agenciamiento de carga' && $param1 !== 'Tramites Administrativos') {
					$sql = 'SELECT cp.*, CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS ciudad, ap.actividad
						FROM cmx_proveedores cp
						INNER JOIN cmx_municipios cm ON cp.id_municipio=cm.id
						INNER JOIN cmx_actividad_proveedor ap ON cp.numdoc_nexos=ap.id_proveedor
						LEFT JOIN cmx_proveedores_detalle pd ON cp.numdoc_nexos=pd.id_proveedor
						WHERE ap.actividad="Proveedor" AND pd.tipo_servicio="' . $param1 . '" ORDER BY cp.nombre ASC';
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
			if ($tipo == '6') {
				$acti = 'Propietario Trailer';
			}
			if ($valor == 'name') {
				$sql = 'SELECT cp.*, CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS ciudad, ap.actividad
					FROM cmx_proveedores cp
					INNER JOIN cmx_municipios cm ON cp.id_municipio = cm.id
					INNER JOIN cmx_actividad_proveedor ap ON cp.numdoc_nexos=ap.id_proveedor
					WHERE  cp.nombre LIKE  "%' . $name . '%" ORDER BY nombre ASC';
			}
			if ($valor == 'num') {
				$sql = 'SELECT cp.*, 
					CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS ciudad, ap.actividad FROM cmx_proveedores cp
					INNER JOIN cmx_municipios cm ON cp.id_municipio = cm.id
					INNER JOIN cmx_actividad_proveedor ap ON cp.numdoc_nexos=ap.id_proveedor
					WHERE cp.numero_documento="' . $docu . '" ORDER BY cp.numero_documento DESC';
			}
		}
		$return = $this->_db->getConsulta($sql);

		// var_dump($return);
		// exit(0);


		return $return;
	}

	// public function getProveedores($tipo, $valor, $name, $docu, $param1, $param2)
	// {
	// 	if ($tipo == '1' || $tipo == '2' || $tipo == '3') { //otros actores
	// 		$acti = '';
	// 		if ($tipo == '1') {
	// 			$acti = 'Propietario Vehiculo';
	// 		}
	// 		if ($tipo == '2') {
	// 			$acti = 'Poseedor Vehiculo';
	// 		}
	// 		if ($tipo == '3') {
	// 			$acti = 'Conductor';
	// 		}
	// 		if ($valor == 'name') {
	// 			$sql = 'SELECT cp.*, CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS ciudad, ap.actividad
	// 				FROM cmx_proveedores cp
	// 				INNER JOIN cmx_municipios cm ON cp.id_municipio = cm.id
	// 				INNER JOIN cmx_actividad_proveedor ap ON cp.numdoc_nexos=ap.id_proveedor
	// 				WHERE  cp.nombre LIKE  "%' . $name . '%" AND ap.actividad="' . $acti . '"
	// 				ORDER BY nombre ASC';
	// 		}
	// 		if ($valor == 'num') {
	// 			$sql = 'SELECT cp.*, 
	// 				CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS ciudad,ap.actividad
	// 				FROM cmx_proveedores cp
	// 				INNER JOIN cmx_municipios cm ON cp.id_municipio = cm.id
	// 				INNER JOIN cmx_actividad_proveedor ap ON cp.numdoc_nexos=ap.id_proveedor
	// 				WHERE cp.numero_documento="' . $docu . '"
	// 				AND ap.actividad="' . $acti . '"
	// 				ORDER BY cp.numero_documento DESC';
	// 		}
	// 		//echo $sql;
	// 	}
	// 	if ($tipo == '4') { //proveedores
	// 		$acti = '';
	// 		if ($tipo == '1') {
	// 			$acti = 'Propietario Vehiculo';
	// 		}
	// 		if ($tipo == '2') {
	// 			$acti = 'Poseedor Vehiculo';
	// 		}
	// 		if ($tipo == '3') {
	// 			$acti = 'Conductor';
	// 		}
	// 		if ($valor == 'prove') {
	// 			$sql = 'SELECT cp.*, CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS ciudad, ap.actividad
	// 				FROM cmx_proveedores cp
	// 				INNER JOIN cmx_municipios cm ON cp.id_municipio=cm.id
	// 				INNER JOIN cmx_actividad_proveedor ap ON cp.numdoc_nexos=ap.id_proveedor
	// 				LEFT JOIN cmx_proveedores_detalle pd ON cp.id=pd.id_proveedor
	// 				WHERE ap.actividad="Proveedor" AND pd.cod_tipo_proveedor=' . $param1 . ' ORDER BY cp.nombre ASC';
	// 		}
	// 		if ($valor == 'name') {
	// 			$sql = 'SELECT cp.*, CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS ciudad, ap.actividad
	// 				FROM cmx_proveedores cp
	// 				INNER JOIN cmx_municipios cm ON cp.id_municipio = cm.id
	// 				INNER JOIN cmx_actividad_proveedor ap ON cp.numdoc_nexos=ap.id_proveedor
	// 				WHERE  cp.nombre LIKE  "%' . $name . '%" AND ap.actividad="Proveedor" ORDER BY cp.nombre ASC';
	// 		}
	// 		if ($valor == 'num') {
	// 			$sql = 'SELECT cp.*, CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS ciudad, ap.actividad
	// 				FROM cmx_proveedores cp
	// 				INNER JOIN cmx_municipios cm ON cp.id_municipio = cm.id
	// 				INNER JOIN cmx_actividad_proveedor ap ON cp.numdoc_nexos=ap.id_proveedor
	// 				WHERE cp.numero_documento="' . $docu . '" AND ap.actividad="Proveedor" ORDER BY cp.numero_documento DESC';
	// 		}
	// 		if ($valor == 'geo') {
	// 			$sql = 'SELECT cp.*, CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS ciudad, ap.actividad
	// 				FROM cmx_proveedores cp
	// 				INNER JOIN cmx_municipios cm ON cp.id_municipio=cm.id
	// 				INNER JOIN cmx_actividad_proveedor ap ON cp.numdoc_nexos=ap.id_proveedor
	// 				LEFT JOIN cmx_proveedores_detalle pd ON cp.id=pd.id_proveedor
	// 				WHERE ap.actividad="Proveedor" AND pd.cod_pais=' . $param1 . '
	// 				ORDER BY cp.nombre ASC';
	// 			//echo $sql;
	// 		}
	// 		if ($valor == 'servicio') {
	// 			if ($param1 == 'Transporte') {
	// 				$sql = 'SELECT cp.*, CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS ciudad, ap.actividad
	// 					FROM cmx_proveedores cp
	// 					INNER JOIN cmx_municipios cm ON cp.id_municipio=cm.id
	// 					INNER JOIN cmx_actividad_proveedor ap ON cp.numdoc_nexos=ap.id_proveedor
	// 					LEFT JOIN cmx_proveedores_detalle pd ON cp.numdoc_nexos=pd.id_proveedor
	// 					WHERE  ap.actividad="Proveedor" AND pd.tipo_servicio="Transporte" AND pd.tipo_servicio_detalle2="' . $param2 . '" ORDER BY cp.nombre ASC';
	// 			}
	// 			if ($param1 == 'Porteadores') {
	// 				$sql = 'SELECT cp.*, CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS ciudad, ap.actividad
	// 					FROM cmx_proveedores cp
	// 					INNER JOIN cmx_municipios cm ON cp.id_municipio=cm.id
	// 					INNER JOIN cmx_actividad_proveedor ap ON cp.numdoc_nexos=ap.id_proveedor
	// 					LEFT JOIN cmx_proveedores_detalle pd ON cp.numdoc_nexos=pd.id_proveedor
	// 					WHERE ap.actividad="Proveedor" AND pd.tipo_servicio="Porteadores" AND pd.tipo_servicio_detalle1="' . $param2 . '" ORDER BY cp.nombre ASC';
	// 			}
	// 			if ($param1 == 'Agenciamiento de carga') {
	// 				$sql = 'SELECT cp.*, CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS ciudad, ap.actividad
	// 					FROM cmx_proveedores cp
	// 					INNER JOIN cmx_municipios cm ON cp.id_municipio=cm.id
	// 					INNER JOIN cmx_actividad_proveedor ap ON cp.numdoc_nexos=ap.id_proveedor
	// 					LEFT JOIN cmx_proveedores_detalle pd ON cp.numdoc_nexos=pd.id_proveedor
	// 					WHERE ap.actividad="Proveedor" AND pd.tipo_servicio="Agenciamiento de carga" AND pd.tipo_servicio_detalle1="' . $param2 . '" ORDER BY cp.nombre ASC';
	// 			}
	// 			if ($param1 == 'Tramites Administrativos') {
	// 				$sql = 'SELECT cp.*, CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS ciudad, ap.actividad
	// 					FROM cmx_proveedores cp
	// 					INNER JOIN cmx_municipios cm ON cp.id_municipio=cm.id
	// 					INNER JOIN cmx_actividad_proveedor ap ON cp.numdoc_nexos=ap.id_proveedor
	// 					LEFT JOIN cmx_proveedores_detalle pd ON cp.numdoc_nexos=pd.id_proveedor
	// 					WHERE ap.actividad="Proveedor" AND pd.tipo_servicio="Tramites Administrativos" AND pd.tipo_servicio_detalle1="' . $param2 . '" ORDER BY cp.nombre ASC';
	// 			}
	// 			if ($param1 !== 'Transporte' && $param1 !== 'Porteadores' &&  $param1 !== 'Agenciamiento de carga' && $param1 !== 'Tramites Administrativos') {
	// 				$sql = 'SELECT cp.*, CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS ciudad, ap.actividad
	// 					FROM cmx_proveedores cp
	// 					INNER JOIN cmx_municipios cm ON cp.id_municipio=cm.id
	// 					INNER JOIN cmx_actividad_proveedor ap ON cp.numdoc_nexos=ap.id_proveedor
	// 					LEFT JOIN cmx_proveedores_detalle pd ON cp.numdoc_nexos=pd.id_proveedor
	// 					WHERE ap.actividad="Proveedor" AND pd.tipo_servicio="' . $param1 . '" ORDER BY cp.nombre ASC';
	// 			}
	// 		}
	// 	}
	// 	if ($tipo == '5') { //todos los actores
	// 		$acti = '';
	// 		if ($tipo == '1') {
	// 			$acti = 'Propietario';
	// 		}
	// 		if ($tipo == '2') {
	// 			$acti = 'Poseedor';
	// 		}
	// 		if ($tipo == '3') {
	// 			$acti = 'Conductor';
	// 		}
	// 		if ($valor == 'name') {
	// 			$sql = 'SELECT cp.*, CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS ciudad, ap.actividad
	// 				FROM cmx_proveedores cp
	// 				INNER JOIN cmx_municipios cm ON cp.id_municipio = cm.id
	// 				INNER JOIN cmx_actividad_proveedor ap ON cp.numdoc_nexos=ap.id_proveedor
	// 				WHERE  cp.nombre LIKE  "%' . $name . '%" ORDER BY nombre ASC';
	// 		}
	// 		if ($valor == 'num') {
	// 			$sql = 'SELECT cp.*, 
	// 				CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") AS ciudad, ap.actividad FROM cmx_proveedores cp
	// 				INNER JOIN cmx_municipios cm ON cp.id_municipio = cm.id
	// 				INNER JOIN cmx_actividad_proveedor ap ON cp.numdoc_nexos=ap.id_proveedor
	// 				WHERE cp.numero_documento="' . $docu . '" ORDER BY cp.numero_documento DESC';
	// 		}
	// 	}
	// 	$return = $this->_db->getConsulta($sql);
	// 	return $return;
	// }

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
					$sql_propietario = $this->_db3->prepare("SELECT token_actual, fecha_vigencia FROM cmx_prefiltro_actualizar WHERE id_solicitud_u = :Estudio AND token_actual = :Token_actual AND estado_token = :Estado AND (documento_propietario = :DocumentoPropietario OR documento_poseedor = :DocumentoPoseedor OR documento_conductor = :DocumentoConductor OR documento_propi_trailer=:DocumentoPropietaioTrailer)");
					$sql_propietario->bindParam(':Estudio', $estudio, PDO::PARAM_STR);
					$sql_propietario->bindParam(':Token_actual', $token, PDO::PARAM_STR);
					$sql_propietario->bindParam(':Estado', $estado, PDO::PARAM_STR);
					$sql_propietario->bindParam(':DocumentoPropietario', $valor, PDO::PARAM_STR);
					$sql_propietario->bindParam(':DocumentoPoseedor', $valor, PDO::PARAM_STR);
					$sql_propietario->bindParam(':DocumentoConductor', $valor, PDO::PARAM_STR);
					$sql_propietario->bindParam(':DocumentoPropietaioTrailer', $valor, PDO::PARAM_STR);
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
					$sql = $this->_db3->prepare("SELECT token_actual, fecha_vigencia FROM cmx_prefiltro_actualizar WHERE id_solicitud_u = :Estudio AND token_actual = :Token_actual AND estado_token = :Estado AND (documento_propietario = :DocumentoPropietario OR documento_poseedor = :DocumentoPoseedor OR documento_conductor = :DocumentoConductor OR documento_propi_trailer=:DocumentoPropietaioTrailer)");
					$sql->bindParam(':Estudio', $estudio, PDO::PARAM_STR);
					$sql->bindParam(':Token_actual', $token, PDO::PARAM_STR);
					$sql->bindParam(':Estado', $estado, PDO::PARAM_STR);
					$sql->bindParam(':DocumentoPropietario', $valor, PDO::PARAM_STR);
					$sql->bindParam(':DocumentoPoseedor', $valor, PDO::PARAM_STR);
					$sql->bindParam(':DocumentoConductor', $valor, PDO::PARAM_STR);
					$sql->bindParam(':DocumentoPropietaioTrailer', $valor, PDO::PARAM_STR);
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
					$sql = $this->_db3->prepare("SELECT token_actual, fecha_vigencia FROM cmx_prefiltro_actualizar WHERE id_solicitud_u = :Estudio AND token_actual = :Token_actual AND estado_token = :Estado AND (documento_propietario = :DocumentoPropietario OR documento_poseedor = :DocumentoPoseedor OR documento_conductor = :DocumentoConductor OR documento_propi_trailer=:DocumentoPropietaioTrailer)");
					$sql->bindParam(':Estudio', $estudio, PDO::PARAM_STR);
					$sql->bindParam(':Token_actual', $token, PDO::PARAM_STR);
					$sql->bindParam(':Estado', $estado, PDO::PARAM_STR);
					$sql->bindParam(':DocumentoPropietario', $valor, PDO::PARAM_STR);
					$sql->bindParam(':DocumentoPoseedor', $valor, PDO::PARAM_STR);
					$sql->bindParam(':DocumentoConductor', $valor, PDO::PARAM_STR);
					$sql->bindParam(':DocumentoPropietaioTrailer', $valor, PDO::PARAM_STR);
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
		$sql = $this->_db3->prepare("SELECT propietario,documento_propietario,poseedor,documento_poseedor,conductor,documento_conductor,id_solicitud_u AS ESTUDIO, trailer,documento_propi_trailer  FROM cmx_prefiltro_actualizar WHERE id_solicitud_u=:Estudio");
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
				'documento_propi_trailer' => $resultado['documento_propi_trailer'],
			];

			// print_r($array_resultado);

			// Recorrer el array resultante
			foreach ($array_resultado as $key => $value) {
				// echo $key . ': ' . $value . '<br>';
				$sql_validado = $this->_db3->prepare("SELECT numero_documento FROM cmx_proveedores WHERE numero_documento=:documento");
				$sql_validado->bindParam(':documento', $value, PDO::PARAM_STR);
				$sql_validado->execute();
				$resultado_validacion = $sql_validado->fetchAll(PDO::FETCH_ASSOC);
				// echo $value . '<br>';
				// print_r($resultado_validacion
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

	// public function Cosultar_datos_estudio($dato)
	// {
	// 	$fecha = date("Y-m-d 12:00:00");
	// 	$sql = $this->_db3->prepare("SELECT * FROM cmx_prefiltro_actualizar WHERE documento_conductor=:Documento AND fecha_vigencia=:fecha");
	// 	$sql->bindParam(':Documento', $dato, PDO::PARAM_STR);
	// 	$sql->bindParam(':fecha', $fecha, PDO::PARAM_STR);
	// 	$sql->execute();
	// 	$resultado = $sql->fetch(PDO::FETCH_ASSOC);
	// 	return $resultado;
	// }

	public function Cosultar_datos_estudio($dato, $actividad)
	{
		/* Validar los documentos para recursios nuevos */
		$response = [];
		$fecha = date("Y-m-d 12:00:00");
		if ($actividad == "Conductor") {
			$sql = $this->_db3->prepare("SELECT * FROM cmx_prefiltro_actualizar WHERE documento_conductor=:Documento AND fecha_vigencia=:fecha");
			$sql->bindParam(':Documento', $dato, PDO::PARAM_STR);
			$sql->bindParam(':fecha', $fecha, PDO::PARAM_STR);
			$sql->execute();
			$resultado = $sql->fetch(PDO::FETCH_ASSOC);
			$response = $resultado;
		} elseif ($actividad == "Propietario Vehiculo") {
			$sql = $this->_db3->prepare("SELECT * FROM cmx_prefiltro_actualizar WHERE documento_propietario=:Documento AND fecha_vigencia=:fecha");
			$sql->bindParam(':Documento', $dato, PDO::PARAM_STR);
			$sql->bindParam(':fecha', $fecha, PDO::PARAM_STR);
			$sql->execute();
			$resultado = $sql->fetch(PDO::FETCH_ASSOC);
			$response = $resultado;
		} elseif ($actividad == "Propietario Trailer") {
			$sql = $this->_db3->prepare("SELECT * FROM cmx_prefiltro_actualizar WHERE documento_propi_trailer=:Documento AND fecha_vigencia=:fecha");
			$sql->bindParam(':Documento', $dato, PDO::PARAM_STR);
			$sql->bindParam(':fecha', $fecha, PDO::PARAM_STR);
			$sql->execute();
			$resultado = $sql->fetch(PDO::FETCH_ASSOC);
			$response = $resultado;
		} elseif ($actividad == "Poseedor Vehiculo") {
			$sql = $this->_db3->prepare("SELECT * FROM cmx_prefiltro_actualizar WHERE documento_poseedor=:Documento AND fecha_vigencia=:fecha");
			$sql->bindParam(':Documento', $dato, PDO::PARAM_STR);
			$sql->bindParam(':fecha', $fecha, PDO::PARAM_STR);
			$sql->execute();
			$resultado = $sql->fetch(PDO::FETCH_ASSOC);
			$response = $resultado;
		}
		return $response;
	}


	public function Cosultar_datos_estudio_prefiltro($dato)
	{
		// -- $sql = $this->_db3->prepare("SELECT v.documento_propietario, v.documento_tenedor, v.documento_conductor,v.documento_propietario_trailer, v.id AS ESTUDIO,pro.numero_documento AS Propietario, pos.numero_documento AS Poseedor,con.numero_documento AS Conductor,pt.numero_documento AS Propietario_Trailer  FROM cmx_vehiculos_preestudio v
		$response = [];
		$sql = $this->_db3->prepare("SELECT v.id AS ESTUDIO,pro.numero_documento AS Propietario, pos.numero_documento AS Poseedor,con.numero_documento AS Conductor,pt.numero_documento AS Propietario_Trailer  FROM cmx_vehiculos_preestudio v
		 LEFT JOIN cmx_proveedores pro ON v.documento_propietario=pro.numero_documento
            LEFT JOIN cmx_proveedores pos ON v.documento_tenedor=pos.numero_documento
            LEFT JOIN cmx_proveedores con ON v.documento_conductor=con.numero_documento
            LEFT JOIN cmx_proveedores pt ON v.documento_propietario_trailer=pt.numero_documento
		 WHERE v.id=:Numdoc");
		$sql->bindParam(':Numdoc', $dato, PDO::PARAM_STR);
		$sql->execute();
		$resultado = $sql->fetch(PDO::FETCH_ASSOC);
		$response = [
			'prefiltro' => $resultado,
			// 'validar' => $resultados
		];
		return $response;
	}

	public function Cosultar_datos_prefiltro($datos, $proveedor)
	{
		$fecha = date("Y-m-d");
		if ($proveedor == "Conductor") {
			$sql = $this->_db3->prepare("SELECT * FROM cmx_vehiculos_preestudio vp INNER JOIN cmx_solicitudes_estados se ON vp.id=se.id_solicitud AND se.estado='aprobado' WHERE vp.documento_conductor=:documento AND vp.fecha=:fecha");
			$sql->bindParam(':documento', $datos, PDO::PARAM_STR);
			$sql->bindParam(':fecha', $fecha, PDO::PARAM_STR);
			$sql->execute();
			$resultado = $sql->fetch(PDO::FETCH_ASSOC);

			$sql_referencia = $this->_db3->prepare("SELECT * FROM cmx_referencias_preestudio  WHERE id_conductor=:documento");
			$sql_referencia->bindParam(':documento', $datos, PDO::PARAM_STR);
			$sql_referencia->execute();
			$resultado_referencia = $sql_referencia->fetchAll(PDO::FETCH_ASSOC);
			$response = [
				"datos" => $resultado,
				"referencias" => $resultado_referencia
			];
		} else if ($proveedor == "Poseedor") {
			$sql = $this->_db3->prepare("SELECT * FROM cmx_vehiculos_preestudio vp INNER JOIN cmx_solicitudes_estados se ON vp.id=se.id_solicitud AND se.estado='aprobado' WHERE vp.documento_tenedor=:documento AND vp.fecha=:fecha");
			$sql->bindParam(':documento', $datos, PDO::PARAM_STR);
			$sql->bindParam(':fecha', $fecha, PDO::PARAM_STR);
			$sql->execute();
			$resultado = $sql->fetch(PDO::FETCH_ASSOC);
			$response = [
				"datos" => $resultado
			];
		} else if ($proveedor == "Propietario") {
			$sql = $this->_db3->prepare("SELECT * FROM cmx_vehiculos_preestudio vp INNER JOIN cmx_solicitudes_estados se ON vp.id=se.id_solicitud AND se.estado='aprobado' WHERE vp.documento_propietario=:documento AND vp.fecha=:fecha");
			$sql->bindParam(':documento', $datos, PDO::PARAM_STR);
			$sql->bindParam(':fecha', $fecha, PDO::PARAM_STR);
			$sql->execute();
			$resultado = $sql->fetch(PDO::FETCH_ASSOC);
			$response = [
				"datos" => $resultado
			];
		} else if ($proveedor == "Propietario_Trailer") {
			$sql = $this->_db3->prepare("SELECT * FROM cmx_vehiculos_preestudio vp INNER JOIN cmx_solicitudes_estados se ON vp.id=se.id_solicitud AND se.estado='aprobado' WHERE vp.documento_propietario_trailer=:documento AND vp.fecha=:fecha");
			$sql->bindParam(':documento', $datos, PDO::PARAM_STR);
			$sql->bindParam(':fecha', $fecha, PDO::PARAM_STR);
			$sql->execute();
			$resultado = $sql->fetch(PDO::FETCH_ASSOC);
			$response = [
				"datos" => $resultado
			];
		}

		return $response;
	}

	public function Validar_Documento($documento)
	{
		$sql = $this->_db3->prepare("SELECT numero_documento FROM cmx_proveedores WHERE numero_documento=:Documento");
		$sql->bindParam(':Documento', $documento, PDO::PARAM_STR);
		$sql->execute();
		$resultado = $sql->fetch(PDO::FETCH_ASSOC);
		if ($resultado) {
			return true;
		} else {
			return false;
		}
	}
	public function Insertar_Propietario($datos)
	{
		$response = []; // Inicializa la variable de respuesta
		$id_usuario = $_SESSION["usuario"]["id_usuario"];
		$user = $_SESSION["usuario"]["nom_usuario"];
		// Consultar maestro de Estudio de seguridad cabecera
		$sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='PROVEEDORES' AND numero_actual>numero_inicial");
		$resultado_consecutivo = $sql_consecutivo->execute();
		$resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
		$numdoc_cabecera = $resultado_consecutivo['numero_actual'];
		$numdoc_actualizar_cabecera = $resultado_consecutivo['numero_actual'] + 1;
		// Actualizar Maestro de Estudio segurdad cabecera
		$sql_updata_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numdoc_actualizar_cabecera WHERE tipo='PROVEEDORES'");
		$sql_updata_maestro->execute();

		try {
			$this->_db3->beginTransaction();

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
				$fecha = date("Y-m-d H:i:s");
				$sql_log = "INSERT INTO cmx_log_proveedores (id_usuario,id_proveedor,operacion,fecha_hora_operacion) VALUES('$id_usuario','$numdoc_cabecera','Crear','$fecha')";
				$crear_log_proveedor = $this->_db3->prepare($sql_log);
				$crear_log_proveedor->execute();
				if ($crear_log_proveedor) {
					// if ($datos['propietario_vehiculo'] == "true") {	}
					$sql =  $this->_db3->prepare("INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ('$numdoc_cabecera','Propietario Vehiculo')");
					$result = $sql->execute();
					if ($result) {
						$this->_db3->commit();
						// $response = true;
						$response = ['success' => true, 'message' => 'Propietario insertado correctamente en NEXOSAPP.'];
					} else {
						// Falla en la actualización, revertir la transacción
						$response = false;
						// Puedes lanzar una excepción específica aquí si lo deseas
						$mensajeError = "Error al insertar las referencias del conductor." . $datos['numero_documento'] . " El dia " . date("Y-m-`d");
						error_log($mensajeError . "\n", 3, "error_log.txt");
						throw new Exception("Error al guardar proveedor 5");
					}
				}
			} else {
				// Falla en la actualización, revertir la transacción
				$response = array('numero' => 400, 'mensaje' => 'Proveedor no  <strong> ingresado </strong> correctamente en NexosApp.');
				// Puedes lanzar una excepción específica aquí si lo deseas
				$mensajeError = "Error al insertar proveedor en la base de datos." . date("Y-m-d");
				error_log($mensajeError . "\n", 3, "error_log.txt");
				throw new Exception("Error al insertar proveedor en NexosApp.");
			}
		} catch (\Throwable $th) {
			// Algo salió mal, se hace rollback
			$this->_db3->rollBack();
			// Registrar el error en un archivo de log en la raíz del proyecto
			$errorMessage = "Error en la transacción al insertar conductor: " . $th->getMessage() . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
			$logFilePath = 'error_log.txt'; // Ajusta la ruta según la estructura de tu proyecto
			error_log($errorMessage, 3, $logFilePath);

			// Verificar si el archivo de log se ha escrito correctamente
			if (!file_exists($logFilePath)) {
				error_log("No se pudo crear el archivo de log: $logFilePath\n", 3, $logFilePath);
			}

			// Mostrar un mensaje amigable al usuario
			$response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar un conductor. Por favor, inténtelo nuevamente más tarde.</br>Por favor comunicarse con el equipo de desarrollo.'];
		}
		return $response;
	}

	public function Insertar_Poseedor($datos)
	{
		$response = []; // Inicializa la variable de respuesta
		$id_usuario = $_SESSION["usuario"]["id_usuario"];
		$user = $_SESSION["usuario"]["nom_usuario"];

		// Consultar maestro de Estudio de seguridad cabecera
		$sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='PROVEEDORES' AND numero_actual>numero_inicial");
		$resultado_consecutivo = $sql_consecutivo->execute();
		$resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
		$numdoc_cabecera = $resultado_consecutivo['numero_actual'];
		$numdoc_actualizar_cabecera = $resultado_consecutivo['numero_actual'] + 1;
		// Actualizar Maestro de Estudio segurdad cabecera
		$sql_updata_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numdoc_actualizar_cabecera WHERE tipo='PROVEEDORES'");
		$sql_updata_maestro->execute();
		try {
			$this->_db3->beginTransaction();

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
				$fecha = date("Y-m-d H:i:s");
				$sql_log = "INSERT INTO cmx_log_proveedores (id_usuario,id_proveedor,operacion,fecha_hora_operacion) VALUES('$id_usuario','$numdoc_cabecera','Crear','$fecha')";
				$crear_log_proveedor = $this->_db3->prepare($sql_log);
				$crear_log_proveedor->execute();
				if ($crear_log_proveedor) {
					$sql = $this->_db3->prepare("INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ('$numdoc_cabecera','Poseedor Vehiculo')");
					$result = $sql->execute();
					if ($result) {
						$this->_db3->commit();
						// $response = true;
						$response = ['success' => true, 'message' => 'Poseedor insertado correctamente en NEXOSAPP.'];
					} else {
						// Falla en la actualización, revertir la transacción
						$response = false;
						// Puedes lanzar una excepción específica aquí si lo deseas
						$mensajeError = "Error al insertar las referencias del conductor." . $datos['numero_documento'] . " El dia " . date("Y-m-d");
						error_log($mensajeError . "\n", 3, "error_log.txt");
						throw new Exception("Error al guardar proveedor");
					}
				}
			} else {
				// Falla en la actualización, revertir la transacción
				$response = array('success' => false, 'message' => 'Proveedor no  <strong> ingresado </strong> correctamente en NexosApp.');
				// Puedes lanzar una excepción específica aquí si lo deseas
				$mensajeError = "Error al insertar proveedor en la base de datos." . date("Y-m-d");
				error_log($mensajeError . "\n", 3, "error_log.txt");
				throw new Exception("Error al insertar proveedor en NexosApp.");
			}
		} catch (\Throwable $th) {
			// Algo salió mal, se hace rollback
			$this->_db3->rollBack();
			// Registrar el error en un archivo de log en la raíz del proyecto
			$errorMessage = "Error en la transacción al insertar conductor: " . $th->getMessage() . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
			$logFilePath = 'error_log.txt'; // Ajusta la ruta según la estructura de tu proyecto
			error_log($errorMessage, 3, $logFilePath);

			// Verificar si el archivo de log se ha escrito correctamente
			if (!file_exists($logFilePath)) {
				error_log("No se pudo crear el archivo de log: $logFilePath\n", 3, $logFilePath);
			}

			// Mostrar un mensaje amigable al usuario
			$response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar un poseedor. Por favor, inténtelo nuevamente más tarde.</br>Por favor comunicarse con el equipo de desarrollo.'];
		}
		return $response;
	}

	public function Insertar_conductor($datos)
	{
		$response = []; // Inicializa la variable de respuesta
		$cont = 0;
		$id_usuario = $_SESSION["usuario"]["id_usuario"];
		$fecha_actual = date('Y-m-d');
		$hora_actual = date('H:i:s');
		$user = $_SESSION["usuario"]["nom_usuario"];
		$id_usuario = $_SESSION["usuario"]["id_usuario"];

		// Consultar maestro de Estudio de seguridad cabecera
		$sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='PROVEEDORES' AND numero_actual>numero_inicial");
		$resultado_consecutivo = $sql_consecutivo->execute();
		$resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
		$numdoc_cabecera = $resultado_consecutivo['numero_actual'];
		$numdoc_actualizar_cabecera = $resultado_consecutivo['numero_actual'] + 1;
		// Actualizar Maestro de Estudio segurdad cabecera
		$sql_updata_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numdoc_actualizar_cabecera WHERE tipo='PROVEEDORES'");
		$sql_updata_maestro->execute();

		try {
			$this->_db3->beginTransaction();

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
				$cont++;
				// $ruta = "public/files/proveedores/" . $numdoc_cabecera . "/";
				// $ruta_base = "public/files/proveedores/" . $numdoc_cabecera . "/";
				// $sql = "UPDATE cmx_proveedores SET documentos_soporte = '$ruta_base' WHERE numdoc_nexos = " . $numdoc_cabecera . "";
				// $consulta_act_proveedor = $this->_db3->prepare($sql);
				// $consulta_act_proveedor->execute();

				// // Crear directorio y mover archivo
				// if (!is_dir($ruta)) {
				// 	mkdir($ruta, 0775, true);
				// }
				// if ($datos['documentos'] != null) {
				// 	$nombre = $datos['documentos']['name'];
				// 	$rutaTemporal = $datos['documentos']['tmp_name'];
				// 	$src = $ruta . $nombre;
				// 	// move_uploaded_file($rutaTemporal, $src);
				// 	if (move_uploaded_file($rutaTemporal, $src)) {
				// 		// Cambiar permisos al archivo subido
				// 		chmod($src, 644);
				// 	} else {
				// 		echo "Error al mover el archivo.";
				// 	}
				// }

				$ruta = "public/files/proveedores/" . $numdoc_cabecera . "/";

				// Crear carpeta si no existe
				if (!is_dir($ruta)) {
					mkdir($ruta, 0775, true);
				}

				if (!empty($datos['documentos']) && $datos['documentos']['error'] === UPLOAD_ERR_OK) {
					// Crear un nombre único para evitar conflictos
					$aleatorio1 = rand(10000, 90000);
					$aleatorio2 = rand(10000, 90000);
					$nombreOriginal = basename($datos['documentos']['name']);
					$nombreFinal = $aleatorio1 . "_" . $aleatorio2 . "_" . $nombreOriginal;

					$rutaTemporal = $datos['documentos']['tmp_name'];
					$destino = $ruta . $nombreFinal;

					if (move_uploaded_file($rutaTemporal, $destino)) {
						chmod($destino, 0644); // Permisos seguros de lectura

						// Construir ruta completa para guardar en BD
						$rutaCompleta = "public/files/proveedores/" . $numdoc_cabecera . "/" . $nombreFinal;

						// Actualizar en la base de datos
						$sql = "UPDATE cmx_proveedores SET documentos_soporte = :ruta WHERE numdoc_nexos = :numdoc";

						$stmt = $this->_db3->prepare($sql);
						$stmt->bindParam(':ruta', $rutaCompleta);
						$stmt->bindParam(':numdoc', $numdoc_cabecera, PDO::PARAM_STR);

						if (!$stmt->execute()) {
							$mensajeError = "Error al actualizar la BD para proveedor $numdoc_cabecera a las " . date("Y-m-d H:i:s");
							error_log($mensajeError . "\n", 3, "error_log.txt");
						}
					} else {
						echo "Error al mover el archivo.";
					}
				} else {
					echo "No se subió ningún archivo.";
				}

				$sql_log = "INSERT INTO cmx_log_proveedores (id_usuario,id_proveedor,operacion,fecha_hora_operacion) VALUES($id_usuario,$numdoc_cabecera,'Crear',NOW())";
				$crear_log_proveedor = $this->_db3->prepare($sql_log);
				$crear_log_proveedor->execute();

				/* Funcion para crear el conductor */
				$sqlc = "INSERT INTO cmx_detalle_conductor (id,celular2,nombre_eps,fecha_vence_eps,ultimo_eps,nombre_arl,fecha_vence_arl,ultimo_arl,nombre_entidad,vence_curso,sexo,fecha_nacimiento,grupo_sanguineo,estado_civil,fecha_ingreso,id_proveedor)
						VALUES(null,:celular2,:nombre_eps,:fecha_vencimiento,:ultimo_eps,:nombre_arl,:fecha_vencimiento_arl,:ultimo_arl,:nombre_entidad,:vence_curso,:sex,:fecha_nace,:sangre,:civil,:fecha_ingreso,:id_proveedor)";
				$crear_solicitud = $this->_db3->prepare($sqlc);
				$crear_solicitud->bindParam(':celular2', $datos['celular2'], PDO::PARAM_STR);
				$crear_solicitud->bindParam(':nombre_eps', $datos['nombre_eps'], PDO::PARAM_STR);
				$crear_solicitud->bindParam(':fecha_vencimiento', $datos['fecha_vencimiento'], PDO::PARAM_STR);
				$crear_solicitud->bindParam(':ultimo_eps', $datos['ultimo_eps'], PDO::PARAM_STR);
				$crear_solicitud->bindParam(':nombre_arl', $datos['nombre_arl'], PDO::PARAM_STR);
				$crear_solicitud->bindParam(':fecha_vencimiento_arl', $datos['fecha_vencimiento_arl'], PDO::PARAM_STR);
				$crear_solicitud->bindParam(':ultimo_arl', $datos['ultimo_arl'], PDO::PARAM_STR);
				$crear_solicitud->bindParam(':nombre_entidad', $datos['nombre_entidad'], PDO::PARAM_STR);
				$crear_solicitud->bindParam(':vence_curso', $datos['vence_curso'], PDO::PARAM_STR);
				$crear_solicitud->bindParam(':sex', $datos['sexo'], PDO::PARAM_STR);
				$crear_solicitud->bindParam(':fecha_nace', $datos['fecha_nace'], PDO::PARAM_STR);
				$crear_solicitud->bindParam(':sangre', $datos['sangre'], PDO::PARAM_STR);
				$crear_solicitud->bindParam(':civil', $datos['civil'], PDO::PARAM_STR);
				$crear_solicitud->bindParam(':fecha_ingreso', $datos['fecha_ingreso'], PDO::PARAM_STR);
				$crear_solicitud->bindParam(':id_proveedor', $numdoc_cabecera, PDO::PARAM_STR);
				$result = $crear_solicitud->execute();

				$sql_block = $this->_db3->prepare("INSERT INTO cmx_estado_bloqueo (nombre_proceso,estado_proceso,id_objeto,tipo_objeto,fecha,hora,usuario) 
							VALUES ('modificar','desbloqueado','" . $numdoc_cabecera . "','proveedor','" . $fecha_actual . "','" . $hora_actual . "','" . $user . "')");
				$sql_block->execute();

				/* LLmado a la funcio de insertar las referencias del proveedor */
				$Referencias = $this->Isnertar_referencias_hojas_de_vida($datos, $numdoc_cabecera);
				/* Validar la respuetsa de la opeeracion */
				if ($Referencias) {
					// $cont++;
					$Fotos = $this->Insertar_documentos_proveedor($datos, $numdoc_cabecera);
					if ($Fotos) {
						// $cont++;
						$sql_actividad =  $this->_db3->prepare("INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ($numdoc_cabecera,'Conductor')");
						$sql_actividad->execute();

						$this->_db3->commit();
						// $response = true;
						$response = ['success' => true, 'message' => 'Conductor insertado correctamente en NEXOSAPP.'];
					} else {
						// Falla en la actualización, revertir la transacción
						// Puedes lanzar una excepción específica aquí si lo deseas
						$mensajeError = "Error al insertar las referencias del conductor." . $datos['numero_documento'] . " El dia " . date("Y-m-d");
						error_log($mensajeError . "\n", 3, "error_log.txt");
						throw new Exception("Error al insertar documentos del proveedor.");
					}
				} else {
					// Falla en la actualización, revertir la transacción
					// Puedes lanzar una excepción específica aquí si lo deseas
					$mensajeError = "Error al insertar las referencias del conductor." . $datos['numero_documento'] . " El dia " . date("Y-m-d");
					error_log($mensajeError . "\n", 3, "error_log.txt");
					// throw new Exception("Error al guardar proveedor 2");
					throw new Exception("Error al insertar referencias del proveedor.");
				}
			} else {
				// Falla en la actualización, revertir la transacción
				// $this->_db3->rollBack();
				$response = array('success' => false, 'mensaje' => 'Proveedor no  <strong> ingresado </strong> correctamente en NexosApp.');
				// Puedes lanzar una excepción específica aquí si lo deseas
				$mensajeError = "Error al insertar proveedor en la base de datos." . date("Y-m-d");
				error_log($mensajeError . "\n", 3, "error_log.txt");
				throw new Exception("Error al insertar proveedor en NexosApp.");
			}
		} catch (\Throwable $th) {
			// Manejar la excepción

			// Algo salió mal, se hace rollback
			$this->_db3->rollBack();
			// Registrar el error en un archivo de log en la raíz del proyecto
			$errorMessage = "Error en la transacción al insertar conductor: " . $th->getMessage() . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
			$logFilePath = 'error_log.txt'; // Ajusta la ruta según la estructura de tu proyecto
			error_log($errorMessage, 3, $logFilePath);

			// Verificar si el archivo de log se ha escrito correctamente
			if (!file_exists($logFilePath)) {
				error_log("No se pudo crear el archivo de log: $logFilePath\n", 3, $logFilePath);
			}

			// Mostrar un mensaje amigable al usuario
			$response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar un conductor. Por favor, inténtelo nuevamente más tarde.</br>Por favor comunicarse con el equipo de desarrollo.'];
		}

		return $response;
	}

	public function Insertar_Propietario_Propietario_Trailer($datos)
	{
		$response = []; // Inicializa la variable de respuesta
		$id_usuario = $_SESSION["usuario"]["id_usuario"];
		$user = $_SESSION["usuario"]["nom_usuario"];
		// Consultar maestro de Estudio de seguridad cabecera
		$sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='PROVEEDORES' AND numero_actual>numero_inicial");
		$resultado_consecutivo = $sql_consecutivo->execute();
		$resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
		$numdoc_cabecera = $resultado_consecutivo['numero_actual'];
		$numdoc_actualizar_cabecera = $resultado_consecutivo['numero_actual'] + 1;
		// Actualizar Maestro de Estudio segurdad cabecera
		$sql_updata_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numdoc_actualizar_cabecera WHERE tipo='PROVEEDORES'");
		$sql_updata_maestro->execute();

		try {
			$this->_db3->beginTransaction();

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
				$fecha = date("Y-m-d H:i:s");
				$sql_log = "INSERT INTO cmx_log_proveedores (id_usuario,id_proveedor,operacion,fecha_hora_operacion) VALUES('$id_usuario','$numdoc_cabecera','Crear','$fecha')";
				$crear_log_proveedor = $this->_db3->prepare($sql_log);
				$crear_log_proveedor->execute();
				if ($crear_log_proveedor) {
					$sql =  $this->_db3->prepare("INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ('$numdoc_cabecera','Propietario Vehiculo')");
					$result = $sql->execute();
					if ($result) {
						$sql_actvidad_propietario_trailer =  $this->_db3->prepare("INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ('$numdoc_cabecera','Propietario Trailer')");
						$result_propietario_trailer = $sql_actvidad_propietario_trailer->execute();
						if ($result_propietario_trailer) {
							$this->_db3->commit();
							$response = ['success' => true, 'message' => 'Proveedor insertado correctamente en NEXOSAPP.'];
						} else {
							// Falla en la actualización, revertir la transacción
							$response = ['success' => false, 'message' => 'Proveedor no insertado correctamente en NEXOSAPP.'];
						}
					} else {
						// Falla en la actualización, revertir la transacción
						$response = ['success' => false, 'message' => 'Proveedor no insertado correctamente en NEXOSAPP.'];
						// Puedes lanzar una excepción específica aquí si lo deseas
						$mensajeError = "Error al insertar las referencias del conductor." . $datos['numero_documento'] . " El dia " . date("Y-m-`d");
						error_log($mensajeError . "\n", 3, "error_log.txt");
						throw new Exception("Error al guardar proveedor 5");
					}
				}
			} else {
				// Falla en la actualización, revertir la transacción
				$response = array('success' => false, 'message' => 'Proveedor no  <strong> ingresado </strong> correctamente en NexosApp.');
				// Puedes lanzar una excepción específica aquí si lo deseas
				$mensajeError = "Error al insertar proveedor en la base de datos." . date("Y-m-d");
				error_log($mensajeError . "\n", 3, "error_log.txt");
				throw new Exception("Error al insertar proveedor en NexosApp.");
			}
		} catch (\Throwable $th) {
			// Algo salió mal, se hace rollback
			$this->_db3->rollBack();
			// Registrar el error en un archivo de log en la raíz del proyecto
			$errorMessage = "Error en la transacción al insertar conductor: " . $th->getMessage() . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
			$logFilePath = 'error_log.txt'; // Ajusta la ruta según la estructura de tu proyecto
			error_log($errorMessage, 3, $logFilePath);

			// Verificar si el archivo de log se ha escrito correctamente
			if (!file_exists($logFilePath)) {
				error_log("No se pudo crear el archivo de log: $logFilePath\n", 3, $logFilePath);
			}

			// Mostrar un mensaje amigable al usuario
			$response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar un conductor. Por favor, inténtelo nuevamente más tarde.</br>Por favor comunicarse con el equipo de desarrollo.'];
		}
		return $response;
	}

	public function Insertar_Poseedor_Propietario_Trailer($datos)
	{
		$response = []; // Inicializa la variable de respuesta
		$id_usuario = $_SESSION["usuario"]["id_usuario"];
		$user = $_SESSION["usuario"]["nom_usuario"];
		// Consultar maestro de Estudio de seguridad cabecera
		$sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='PROVEEDORES' AND numero_actual>numero_inicial");
		$resultado_consecutivo = $sql_consecutivo->execute();
		$resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
		$numdoc_cabecera = $resultado_consecutivo['numero_actual'];
		$numdoc_actualizar_cabecera = $resultado_consecutivo['numero_actual'] + 1;
		// Actualizar Maestro de Estudio segurdad cabecera
		$sql_updata_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numdoc_actualizar_cabecera WHERE tipo='PROVEEDORES'");
		$sql_updata_maestro->execute();

		try {
			$this->_db3->beginTransaction();

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
				$fecha = date("Y-m-d H:i:s");
				$sql_log = "INSERT INTO cmx_log_proveedores (id_usuario,id_proveedor,operacion,fecha_hora_operacion) VALUES('$id_usuario','$numdoc_cabecera','Crear','$fecha')";
				$crear_log_proveedor = $this->_db3->prepare($sql_log);
				$crear_log_proveedor->execute();
				if ($crear_log_proveedor) {
					$sql =  $this->_db3->prepare("INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ('$numdoc_cabecera','Poseedor Vehiculo')");
					$result = $sql->execute();
					if ($result) {
						$sql_actvidad_propietario_trailer =  $this->_db3->prepare("INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ('$numdoc_cabecera','Propietario Trailer')");
						$result_propietario_trailer = $sql_actvidad_propietario_trailer->execute();
						if ($result_propietario_trailer) {
							$this->_db3->commit();
							$response = ['success' => true, 'message' => 'Proveedor insertado correctamente en NEXOSAPP.'];
						} else {
							// Falla en la actualización, revertir la transacción
							$response = ['success' => false, 'message' => 'Proveedor no insertado correctamente en NEXOSAPP.'];
						}
					} else {
						// Falla en la actualización, revertir la transacción
						$response = ['success' => false, 'message' => 'Proveedor no insertado correctamente en NEXOSAPP.'];
						// Puedes lanzar una excepción específica aquí si lo deseas
						$mensajeError = "Error al insertar las referencias del conductor." . $datos['numero_documento'] . " El dia " . date("Y-m-`d");
						error_log($mensajeError . "\n", 3, "error_log.txt");
						throw new Exception("Error al guardar proveedor 5");
					}
				}
			} else {
				// Falla en la actualización, revertir la transacción
				$response = array('success' => false, 'message' => 'Proveedor no  <strong> ingresado </strong> correctamente en NexosApp.');
				// Puedes lanzar una excepción específica aquí si lo deseas
				$mensajeError = "Error al insertar proveedor en la base de datos." . date("Y-m-d");
				error_log($mensajeError . "\n", 3, "error_log.txt");
				throw new Exception("Error al insertar proveedor en NexosApp.");
			}
		} catch (\Throwable $th) {
			// Algo salió mal, se hace rollback
			$this->_db3->rollBack();
			// Registrar el error en un archivo de log en la raíz del proyecto
			$errorMessage = "Error en la transacción al insertar conductor: " . $th->getMessage() . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
			$logFilePath = 'error_log.txt'; // Ajusta la ruta según la estructura de tu proyecto
			error_log($errorMessage, 3, $logFilePath);

			// Verificar si el archivo de log se ha escrito correctamente
			if (!file_exists($logFilePath)) {
				error_log("No se pudo crear el archivo de log: $logFilePath\n", 3, $logFilePath);
			}

			// Mostrar un mensaje amigable al usuario
			$response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar un conductor. Por favor, inténtelo nuevamente más tarde.</br>Por favor comunicarse con el equipo de desarrollo.'];
		}
		return $response;
	}

	public function Insertar_Conductor_Propietario_Trailer($datos)
	{
		$response = []; // Inicializa la variable de respuesta
		$id_usuario = $_SESSION["usuario"]["id_usuario"];
		$fecha_actual = date('Y-m-d');
		$hora_actual = date('H:i:s');
		$user = $_SESSION["usuario"]["nom_usuario"];

		// Consultar maestro de Estudio de seguridad cabecera
		$sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='PROVEEDORES' AND numero_actual>numero_inicial");
		$resultado_consecutivo = $sql_consecutivo->execute();
		$resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
		$numdoc_cabecera = $resultado_consecutivo['numero_actual'];
		$numdoc_actualizar_cabecera = $resultado_consecutivo['numero_actual'] + 1;
		// Actualizar Maestro de Estudio segurdad cabecera
		$sql_updata_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numdoc_actualizar_cabecera WHERE tipo='PROVEEDORES'");
		$sql_updata_maestro->execute();

		try {
			$this->_db3->beginTransaction();

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
				$fecha = date("Y-m-d H:i:s");
				$sql_log = "INSERT INTO cmx_log_proveedores (id_usuario,id_proveedor,operacion,fecha_hora_operacion) VALUES('$id_usuario','$numdoc_cabecera','Crear','$fecha')";
				$crear_log_proveedor = $this->_db3->prepare($sql_log);
				$crear_log_proveedor->execute();
				if ($crear_log_proveedor) {
					// if (isset($datos['Actividad_conductor2']) && isset($datos['Actividad_poseedor2'])) {}
					/* Funcion para crear el conductor */
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
						// $ruta = "public/files/proveedores/" . $numdoc_cabecera . "/";
						// $ruta_base = "public/files/proveedores/" . $numdoc_cabecera . "/";

						// if (!is_dir($ruta)) {
						// 	mkdir($ruta, 0775, true);
						// }

						// if ($datos['documentos'] !== null) {
						// 	$nombre = $datos['documentos']['name'];
						// 	$rutaTemporal = $datos['documentos']['tmp_name'];
						// 	$carpeta = $ruta;
						// 	$src = $carpeta . $nombre;
						// 	// move_uploaded_file($rutaTemporal, $src);
						// 	if (move_uploaded_file($rutaTemporal, $src)) {
						// 		chmod($src, 644);
						// 		// El archivo se subió correctamente
						// 		// Ejecuta otra acción aquí, por ejemplo, actualiza la base de datos, etc.
						// 		// echo "El archivo se ha subido correctamente.";
						// 		$sql = "UPDATE cmx_proveedores SET documentos_soporte = '$ruta_base' WHERE numdoc_nexos = " . $numdoc_cabecera . "";
						// 		$consulta_act_proveedor = $this->_db3->prepare($sql);
						// 		$consulta_act_proveedor->execute();
						// 	} else {
						// 		// Hubo un error al subir el archivo
						// 		$mensajeError = "Error al mover el archivo a la carpeta de destino." . date("Y-m-d H:i:s");
						// 		error_log($mensajeError . "\n", 3, "error_log.txt");
						// 		echo "Hubo un error al subir el archivo.";
						// 		// Ejecuta otra acción aquí en caso de error, por ejemplo, devuelve una respuesta de error al usuario.
						// 	}
						// } else {
						// 	// Cuando no hay documentos para subir
						// 	$mensajeError = "No se han proporcionado documentos para subir." . date("Y-m-d");
						// 	error_log($mensajeError . "\n", 3, "error_log.txt");
						// 	// throw new Exception("Error al guardar proveedor 1");
						// }

						$ruta = "public/files/proveedores/" . $numdoc_cabecera . "/";

						// Crear carpeta si no existe
						if (!is_dir($ruta)) {
							mkdir($ruta, 0775, true);
						}

						if (!empty($datos['documentos']) && $datos['documentos']['error'] === UPLOAD_ERR_OK) {
							// Generar nombre único para evitar sobrescribir archivos
							$aleatorio1 = rand(10000, 90000);
							$aleatorio2 = rand(10000, 90000);
							$nombreOriginal = basename($datos['documentos']['name']);
							$nombreFinal = $aleatorio1 . "_" . $aleatorio2 . "_" . $nombreOriginal;

							$rutaTemporal = $datos['documentos']['tmp_name'];
							$destino = $ruta . $nombreFinal;

							if (move_uploaded_file($rutaTemporal, $destino)) {
								chmod($destino, 0644); // Permisos seguros

								// Ruta completa que se guardará en la BD
								$rutaCompleta = "public/files/proveedores/" . $numdoc_cabecera . "/" . $nombreFinal;

								// Actualizar la base de datos con la ruta completa
								$sql = "UPDATE cmx_proveedores SET documentos_soporte = :ruta WHERE numdoc_nexos = :numdoc";

								$stmt = $this->_db3->prepare($sql);
								$stmt->bindParam(':ruta', $rutaCompleta, PDO::PARAM_STR);
								$stmt->bindParam(':numdoc', $numdoc_cabecera, PDO::PARAM_STR);

								if (!$stmt->execute()) {
									$mensajeError = "Error al actualizar la BD para proveedor $numdoc_cabecera a las " . date("Y-m-d H:i:s");
									error_log($mensajeError . "\n", 3, "error_log.txt");
								}
							} else {
								// Error al mover el archivo
								$mensajeError = "Error al mover el archivo para el proveedor $numdoc_cabecera a las " . date("Y-m-d H:i:s");
								error_log($mensajeError . "\n", 3, "error_log.txt");
								echo "Hubo un error al subir el archivo.";
							}
						} else {
							// No hay archivo para subir
							$mensajeError = "No se han proporcionado documentos para el proveedor $numdoc_cabecera a las " . date("Y-m-d");
							error_log($mensajeError . "\n", 3, "error_log.txt");
						}

						$sql_block = $this->_db3->prepare("INSERT INTO cmx_estado_bloqueo (nombre_proceso,estado_proceso,id_objeto,tipo_objeto,fecha,hora,usuario) 
								VALUES ('modificar','desbloqueado','" . $numdoc_cabecera . "','proveedor','" . $fecha_actual . "','" . $hora_actual . "','" . $user . "')");
						$sql_block->execute();

						/* LLmado a la funcio de insertar las referencias del proveedor */
						$Referencias = $this->Isnertar_referencias_hojas_de_vida($datos, $numdoc_cabecera);
						/* Validar la respuetsa de la opeeracion */
						if ($Referencias == true) {
							$Fotos = $this->Insertar_documentos_proveedor($datos, $numdoc_cabecera);
							if ($Fotos == true) {
								$sql = $this->_db3->prepare("INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ('$numdoc_cabecera','Conductor')");
								$result_propietario = $sql->execute();
								if ($result_propietario) {
									$sql_poseedor = $this->_db3->prepare("INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ('$numdoc_cabecera','Propietario Trailer')");
									$result_poseedor = $sql_poseedor->execute();
									if ($result_poseedor) {
										$this->_db3->commit();
										// $response = true;
										$response = ['success' => true, 'message' => 'Conductor y Poseedor insertado correctamente en NEXOSAPP.'];
									} else {
										// Falla en la actualización, revertir la transacción
										$response = ['success' => false, 'message' => 'Conductor y Poseedor no insertado correctamente en NEXOSAPP.'];
									}
								} else {
									// Puedes lanzar una excepción específica aquí si lo deseas
									$mensajeError = "Error al insertar las activiada del propietario." . $datos['numero_documento'] . " El dia " . date("Y-m-d");
									error_log($mensajeError . "\n", 3, "error_log.txt");
									throw new Exception("Error al guardar proveedor");
								}
							} else {
								$mensajeError = "Error al insertar las fotos del conductor." . $datos['numero_documento'] . " El dia " . date("Y-m-d");
								error_log($mensajeError . "\n", 3, "error_log.txt");
								throw new Exception("Error al guardar proveedor");
							}
						} else {
							$mensajeError = "Error al insertar las referencias del conductor." . $datos['numero_documento'] . " El dia " . date("Y-m-d");
							error_log($mensajeError . "\n", 3, "error_log.txt");
							throw new Exception("Error al guardar proveedor");
						}
					} else {
						$mensajeError = "Error al insertar los detalles del conductor." . $datos['numero_documento'] . " El dia " . date("Y-m-d");
						error_log($mensajeError . "\n", 3, "error_log.txt");
						throw new Exception("Error al guardar proveedor");
					}
				}
			} else {
				// Falla en la actualización, revertir la transacción
				$response = array('success' => false, 'message' => 'Proveedor no  <strong> ingresado </strong> correctamente en NexosApp.');
				// Puedes lanzar una excepción específica aquí si lo deseas
				$mensajeError = "Error al insertar proveedor en la base de datos." . date("Y-m-d");
				error_log($mensajeError . "\n", 3, "error_log.txt");
				throw new Exception("Error al insertar proveedor en NexosApp.");
			}
		} catch (\Throwable $th) {
			// Algo salió mal, se hace rollback
			$this->_db3->rollBack();
			// Registrar el error en un archivo de log en la raíz del proyecto
			$errorMessage = "Error en la transacción al insertar conductor: " . $th->getMessage() . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
			$logFilePath = 'error_log.txt'; // Ajusta la ruta según la estructura de tu proyecto
			error_log($errorMessage, 3, $logFilePath);

			// Verificar si el archivo de log se ha escrito correctamente
			if (!file_exists($logFilePath)) {
				error_log("No se pudo crear el archivo de log: $logFilePath\n", 3, $logFilePath);
			}

			// Mostrar un mensaje amigable al usuario
			$response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar un conductor. Por favor, inténtelo nuevamente más tarde.</br>Por favor comunicarse con el equipo de desarrollo.'];
		}
		return $response;
	}

	public function Insertar_Propietario_Poseedor_Propietario_Trailer($datos)
	{
		$response = []; // Inicializa la variable de respuesta
		$id_usuario = $_SESSION["usuario"]["id_usuario"];
		$user = $_SESSION["usuario"]["nom_usuario"];
		// Consultar maestro de Estudio de seguridad cabecera
		$sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='PROVEEDORES' AND numero_actual>numero_inicial");
		$resultado_consecutivo = $sql_consecutivo->execute();
		$resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
		$numdoc_cabecera = $resultado_consecutivo['numero_actual'];
		$numdoc_actualizar_cabecera = $resultado_consecutivo['numero_actual'] + 1;
		// Actualizar Maestro de Estudio segurdad cabecera
		$sql_updata_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numdoc_actualizar_cabecera WHERE tipo='PROVEEDORES'");
		$sql_updata_maestro->execute();

		try {
			$this->_db3->beginTransaction();

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
				$fecha = date("Y-m-d H:i:s");
				$sql_log = "INSERT INTO cmx_log_proveedores (id_usuario,id_proveedor,operacion,fecha_hora_operacion) VALUES('$id_usuario','$numdoc_cabecera','Crear','$fecha')";
				$crear_log_proveedor = $this->_db3->prepare($sql_log);
				$crear_log_proveedor->execute();
				if ($crear_log_proveedor) {
					$sql =  $this->_db3->prepare("INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ('$numdoc_cabecera','Poseedor Vehiculo')");
					$result = $sql->execute();
					if ($result) {
						$sql_propietario =  $this->_db3->prepare("INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ('$numdoc_cabecera','Propietario Vehiculo')");
						$result_propietario = $sql_propietario->execute();
						if ($result_propietario) {
							$sql_actvidad_propietario_trailer =  $this->_db3->prepare("INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ('$numdoc_cabecera','Propietario Trailer')");
							$result_propietario_trailer = $sql_actvidad_propietario_trailer->execute();
							if ($result_propietario_trailer) {
								$this->_db3->commit();
								$response = ['success' => true, 'message' => 'Proveedor insertado correctamente en NEXOSAPP.'];
							} else {
								// Falla en la actualización, revertir la transacción
								$response = ['success' => false, 'message' => 'Proveedor no insertado correctamente en NEXOSAPP.'];
							}
						} else {
							// Falla en la actualización, revertir la transacción
							$response = ['success' => false, 'message' => 'Proveedor no insertado correctamente en NEXOSAPP.'];
						}
					} else {
						// Falla en la actualización, revertir la transacción
						$response = ['success' => false, 'message' => 'Proveedor no insertado correctamente en NEXOSAPP.'];
						// Puedes lanzar una excepción específica aquí si lo deseas
						$mensajeError = "Error al insertar las referencias del conductor." . $datos['numero_documento'] . " El dia " . date("Y-m-`d");
						error_log($mensajeError . "\n", 3, "error_log.txt");
						throw new Exception("Error al guardar proveedor 5");
					}
				}
			} else {
				// Falla en la actualización, revertir la transacción
				$response = array('success' => false, 'message' => 'Proveedor no  <strong> ingresado </strong> correctamente en NexosApp.');
				// Puedes lanzar una excepción específica aquí si lo deseas
				$mensajeError = "Error al insertar proveedor en la base de datos." . date("Y-m-d");
				error_log($mensajeError . "\n", 3, "error_log.txt");
				throw new Exception("Error al insertar proveedor en NexosApp.");
			}
		} catch (\Throwable $th) {
			// Algo salió mal, se hace rollback
			$this->_db3->rollBack();
			// Registrar el error en un archivo de log en la raíz del proyecto
			$errorMessage = "Error en la transacción al insertar conductor: " . $th->getMessage() . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
			$logFilePath = 'error_log.txt'; // Ajusta la ruta según la estructura de tu proyecto
			error_log($errorMessage, 3, $logFilePath);

			// Verificar si el archivo de log se ha escrito correctamente
			if (!file_exists($logFilePath)) {
				error_log("No se pudo crear el archivo de log: $logFilePath\n", 3, $logFilePath);
			}

			// Mostrar un mensaje amigable al usuario
			$response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar un conductor. Por favor, inténtelo nuevamente más tarde.</br>Por favor comunicarse con el equipo de desarrollo.'];
		}
		return $response;
	}

	/* Funcon para insertar dos actividades */
	public function Insertar_proveedores($datos)
	{
		$response = []; // Inicializa la variable de respuesta
		$id_usuario = $_SESSION["usuario"]["id_usuario"];
		$fecha_actual = date('Y-m-d');
		$hora_actual = date('H:i:s');
		$user = $_SESSION["usuario"]["nom_usuario"];

		// Consultar maestro de Estudio de seguridad cabecera
		$sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='PROVEEDORES' AND numero_actual>numero_inicial");
		$resultado_consecutivo = $sql_consecutivo->execute();
		$resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
		$numdoc_cabecera = $resultado_consecutivo['numero_actual'];
		$numdoc_actualizar_cabecera = $resultado_consecutivo['numero_actual'] + 1;
		// Actualizar Maestro de Estudio segurdad cabecera
		$sql_updata_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numdoc_actualizar_cabecera WHERE tipo='PROVEEDORES'");
		$sql_updata_maestro->execute();

		try {
			$this->_db3->beginTransaction();

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
				$fecha = date("Y-m-d H:i:s");
				$sql_log = "INSERT INTO cmx_log_proveedores (id_usuario,id_proveedor,operacion,fecha_hora_operacion) VALUES('$id_usuario','$numdoc_cabecera','Crear','$fecha')";
				$crear_log_proveedor = $this->_db3->prepare($sql_log);
				$crear_log_proveedor->execute();
				if ($crear_log_proveedor) {
					/* Insertar cuando los documentos de poseedor y propietario son iguales */
					if (isset($datos['Actividad_propietario']) && isset($datos['Actividad_poseedor'])) {
						$sql = $this->_db3->prepare("INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ('$numdoc_cabecera','" . $datos['Actividad_propietario'] . "')");
						$result_propietario = $sql->execute();
						if ($result_propietario) {
							$sql_poseedor = $this->_db3->prepare("INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ('$numdoc_cabecera','" . $datos['Actividad_poseedor'] . "')");
							$result_poseedor = $sql_poseedor->execute();
							if ($result_poseedor) {
								$this->_db3->commit();
								$response = ['success' => true, 'message' => 'Poseedor y Propietario insertado correctamente en NEXOSAPP.'];
							} else {
								// Falla en la actualización, revertir la transacción
								$response = ['success' => false, 'message' => 'Poseedor y Propietario no insertado correctamente en NEXOSAPP.'];
							}
						} else {
							// Puedes lanzar una excepción específica aquí si lo deseas
							$mensajeError = "Error al insertar las activiada del propietario." . $datos['numero_documento'] . " El dia " . date("Y-m-d");
							error_log($mensajeError . "\n", 3, "error_log.txt");
							throw new Exception("Error al guardar proveedor");
						}
						/* Insertar actividad cuando el conductor y poseedor son iguales */
					} elseif (isset($datos['Actividad_conductor2']) && isset($datos['Actividad_poseedor2'])) {
						/* Funcion para crear el conductor */
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
							// $ruta = "public/files/proveedores/" . $numdoc_cabecera . "/";
							// $ruta_base = "public/files/proveedores/" . $numdoc_cabecera . "/";

							// if (!is_dir($ruta)) {
							// 	mkdir($ruta, 0775, true);
							// }

							// if ($datos['documentos'] !== null) {
							// 	$nombre = $datos['documentos']['name'];
							// 	$rutaTemporal = $datos['documentos']['tmp_name'];
							// 	$carpeta = $ruta;
							// 	$src = $carpeta . $nombre;
							// 	// move_uploaded_file($rutaTemporal, $src);
							// 	if (move_uploaded_file($rutaTemporal, $src)) {
							// 		chmod($src, 644);
							// 		// El archivo se subió correctamente
							// 		// Ejecuta otra acción aquí, por ejemplo, actualiza la base de datos, etc.
							// 		// echo "El archivo se ha subido correctamente.";
							// 		$sql = "UPDATE cmx_proveedores SET documentos_soporte = '$ruta_base' WHERE numdoc_nexos = " . $numdoc_cabecera . "";
							// 		$consulta_act_proveedor = $this->_db3->prepare($sql);
							// 		$consulta_act_proveedor->execute();
							// 	} else {
							// 		// Hubo un error al subir el archivo
							// 		$mensajeError = "Error al mover el archivo a la carpeta de destino." . date("Y-m-d H:i:s");
							// 		error_log($mensajeError . "\n", 3, "error_log.txt");
							// 		echo "Hubo un error al subir el archivo.";
							// 		// Ejecuta otra acción aquí en caso de error, por ejemplo, devuelve una respuesta de error al usuario.
							// 	}
							// } else {
							// 	// Cuando no hay documentos para subir
							// 	$mensajeError = "No se han proporcionado documentos para subir." . date("Y-m-d");
							// 	error_log($mensajeError . "\n", 3, "error_log.txt");
							// 	// throw new Exception("Error al guardar proveedor 1");
							// }

							$ruta = "public/files/proveedores/" . $numdoc_cabecera . "/";

							// Crear carpeta si no existe
							if (!is_dir($ruta)) {
								mkdir($ruta, 0775, true);
							}

							if (!empty($datos['documentos']) && $datos['documentos']['error'] === UPLOAD_ERR_OK) {
								// Crear nombre único para el archivo
								$aleatorio1 = rand(10000, 99999);
								$aleatorio2 = rand(10000, 99999);
								$nombreOriginal = basename($datos['documentos']['name']);
								$nombreFinal = $aleatorio1 . "_" . $aleatorio2 . "_" . $nombreOriginal;

								$rutaTemporal = $datos['documentos']['tmp_name'];
								$destino = $ruta . $nombreFinal;

								if (move_uploaded_file($rutaTemporal, $destino)) {
									chmod($destino, 0644); // Permisos correctos

									// Ruta completa a guardar en la BD
									$rutaCompleta = "public/files/proveedores/" . $numdoc_cabecera . "/" . $nombreFinal;

									// Actualizar base de datos con la ruta completa
									$sql = "UPDATE cmx_proveedores SET documentos_soporte = :ruta WHERE numdoc_nexos = :numdoc";

									$stmt = $this->_db3->prepare($sql);
									$stmt->bindParam(':ruta', $rutaCompleta, PDO::PARAM_STR);
									$stmt->bindParam(':numdoc', $numdoc_cabecera, PDO::PARAM_STR);

									if (!$stmt->execute()) {
										$mensajeError = "Error al actualizar la BD para proveedor $numdoc_cabecera a las " . date("Y-m-d H:i:s");
										error_log($mensajeError . "\n", 3, "error_log.txt");
									}
								} else {
									// Error al mover archivo
									$mensajeError = "Error al mover el archivo para proveedor $numdoc_cabecera a las " . date("Y-m-d H:i:s");
									error_log($mensajeError . "\n", 3, "error_log.txt");
									echo "Hubo un error al subir el archivo.";
								}
							} else {
								// No hay archivo subido
								$mensajeError = "No se han proporcionado documentos para proveedor $numdoc_cabecera a las " . date("Y-m-d");
								error_log($mensajeError . "\n", 3, "error_log.txt");
							}


							$sql_block = $this->_db3->prepare("INSERT INTO cmx_estado_bloqueo (nombre_proceso,estado_proceso,id_objeto,tipo_objeto,fecha,hora,usuario) 
								VALUES ('modificar','desbloqueado','" . $numdoc_cabecera . "','proveedor','" . $fecha_actual . "','" . $hora_actual . "','" . $user . "')");
							$sql_block->execute();

							/* LLmado a la funcio de insertar las referencias del proveedor */
							$Referencias = $this->Isnertar_referencias_hojas_de_vida($datos, $numdoc_cabecera);
							/* Validar la respuetsa de la opeeracion */
							if ($Referencias == true) {
								$Fotos = $this->Insertar_documentos_proveedor($datos, $numdoc_cabecera);
								if ($Fotos == true) {
									$sql = $this->_db3->prepare("INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ('$numdoc_cabecera','" . $datos['Actividad_conductor2'] . "')");
									$result_propietario = $sql->execute();
									if ($result_propietario) {
										$sql_poseedor = $this->_db3->prepare("INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ('$numdoc_cabecera','" . $datos['Actividad_poseedor2'] . "')");
										$result_poseedor = $sql_poseedor->execute();
										if ($result_poseedor) {
											$this->_db3->commit();
											// $response = true;
											$response = ['success' => true, 'message' => 'Conductor y Poseedor insertado correctamente en NEXOSAPP.'];
										} else {
											// $this->_db3->rollBack();
											// Falla en la actualización, revertir la transacción
											// $response = false;
											$response = ['success' => false, 'message' => 'Conductor y Poseedor no insertado correctamente en NEXOSAPP.'];
										}
									} else {
										// Puedes lanzar una excepción específica aquí si lo deseas
										$mensajeError = "Error al insertar las activiada del propietario." . $datos['numero_documento'] . " El dia " . date("Y-m-d");
										error_log($mensajeError . "\n", 3, "error_log.txt");
										throw new Exception("Error al guardar proveedor");
									}
								} else {
									$mensajeError = "Error al insertar las fotos del conductor." . $datos['numero_documento'] . " El dia " . date("Y-m-d");
									error_log($mensajeError . "\n", 3, "error_log.txt");
									throw new Exception("Error al guardar proveedor");
								}
							} else {
								$mensajeError = "Error al insertar las referencias del conductor." . $datos['numero_documento'] . " El dia " . date("Y-m-d");
								error_log($mensajeError . "\n", 3, "error_log.txt");
								throw new Exception("Error al guardar proveedor");
							}
						} else {
							$mensajeError = "Error al insertar los detalles del conductor." . $datos['numero_documento'] . " El dia " . date("Y-m-d");
							error_log($mensajeError . "\n", 3, "error_log.txt");
							throw new Exception("Error al guardar proveedor");
						}
						/* Insertar cuando el conductor y el propietario son iguales */
					} elseif (isset($datos['Actividad_conductor3']) && isset($datos['Actividad_propietario3'])) {
						/* Funcion para crear el conductor */
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
							$ruta = "public/files/proveedores/" . $numdoc_cabecera . "/";
							$ruta_base = "public/files/proveedores/" . $numdoc_cabecera . "/";

							if (!is_dir($ruta)) {
								mkdir($ruta, 0775, true);
							}

							if ($datos['documentos'] !== null) {
								$nombre = $datos['documentos']['name'];
								$rutaTemporal = $datos['documentos']['tmp_name'];
								$carpeta = $ruta;
								$src = $carpeta . $nombre;
								// move_uploaded_file($rutaTemporal, $src);
								if (move_uploaded_file($rutaTemporal, $src)) {
									chmod($src, 644);
									// El archivo se subió correctamente
									// Ejecuta otra acción aquí, por ejemplo, actualiza la base de datos, etc.
									// echo "El archivo se ha subido correctamente.";
									$sql = "UPDATE cmx_proveedores SET documentos_soporte = '$ruta_base' WHERE numdoc_nexos = " . $numdoc_cabecera . "";
									$consulta_act_proveedor = $this->_db3->prepare($sql);
									$consulta_act_proveedor->execute();
								} else {
									// Hubo un error al subir el archivo
									$mensajeError = "Error al mover el archivo a la carpeta de destino." . date("Y-m-d H:i:s");
									error_log($mensajeError . "\n", 3, "error_log.txt");
									echo "Hubo un error al subir el archivo.";
									// Ejecuta otra acción aquí en caso de error, por ejemplo, devuelve una respuesta de error al usuario.
								}
							} else {
								// Cuando no hay documentos para subir
								$mensajeError = "No se han proporcionado documentos para subir." . date("Y-m-d");
								error_log($mensajeError . "\n", 3, "error_log.txt");
								// throw new Exception("Error al guardar proveedor 1");
							}

							$sql_block = $this->_db3->prepare("INSERT INTO cmx_estado_bloqueo (nombre_proceso,estado_proceso,id_objeto,tipo_objeto,fecha,hora,usuario) 
														VALUES ('modificar','desbloqueado','" . $numdoc_cabecera . "','proveedor','" . $fecha_actual . "','" . $hora_actual . "','" . $user . "')");
							$sql_block->execute();

							/* LLmado a la funcio de insertar las referencias del proveedor */
							$Referencias = $this->Isnertar_referencias_hojas_de_vida($datos, $numdoc_cabecera);
							/* Validar la respuetsa de la opeeracion */
							if ($Referencias) {
								$Fotos = $this->Insertar_documentos_proveedor($datos, $numdoc_cabecera);
								if ($Fotos) {
									$sql = $this->_db3->prepare("INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ('$numdoc_cabecera','" . $datos['Actividad_conductor3'] . "')");
									$result_propietario = $sql->execute();
									if ($result_propietario) {
										$sql_poseedor = $this->_db3->prepare("INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ('$numdoc_cabecera','" . $datos['Actividad_propietario3'] . "')");
										$result_poseedor = $sql_poseedor->execute();
										if ($result_poseedor) {
											$this->_db3->commit();
											$response = ['success' => true, 'message' => 'Conductor y Propietario insertado correctamente en NEXOSAPP.'];
										} else {
											// Falla en la actualización, revertir la transacción
											$response = ['success' => false, 'message' => 'Conductor y Propietario no insertado correctamente en NEXOSAPP.'];
										}
									} else {
										// Puedes lanzar una excepción específica aquí si lo deseas
										$mensajeError = "Error al insertar las activiada del propietario." . $datos['numero_documento'] . " El dia " . date("Y-m-d");
										error_log($mensajeError . "\n", 3, "error_log.txt");
										throw new Exception("Error al guardar proveedor");
									}
								} else {
									$mensajeError = "Error al insertar las fotos del conductor." . $datos['numero_documento'] . " El dia " . date("Y-m-d");
									error_log($mensajeError . "\n", 3, "error_log.txt");
									throw new Exception("Error al guardar proveedor");
								}
							} else {
								$mensajeError = "Error al insertar las referencias del conductor." . $datos['numero_documento'] . " El dia " . date("Y-m-d");
								error_log($mensajeError . "\n", 3, "error_log.txt");
								throw new Exception("Error al guardar proveedor");
							}
						} else {
							$mensajeError = "Error al insertar los detalles del conductor." . $datos['numero_documento'] . " El dia " . date("Y-m-d");
							error_log($mensajeError . "\n", 3, "error_log.txt");
							throw new Exception("Error al guardar proveedor");
						}
					} elseif (isset($datos['Actividad_conductor4']) && isset($datos['Actividad_propietario4']) && isset($datos['Actividad_poseedor4'])) {
						/* Funcion para crear el conductor */
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
							$ruta = "public/files/proveedores/" . $numdoc_cabecera . "/";
							$ruta_base = "public/files/proveedores/" . $numdoc_cabecera . "/";

							if (!is_dir($ruta)) {
								mkdir($ruta, 0775, true);
							}

							if ($datos['documentos'] !== null) {
								$nombre = $datos['documentos']['name'];
								$rutaTemporal = $datos['documentos']['tmp_name'];
								$carpeta = $ruta;
								$src = $carpeta . $nombre;
								// move_uploaded_file($rutaTemporal, $src);
								if (move_uploaded_file($rutaTemporal, $src)) {
									chmod($src, 644);
									// El archivo se subió correctamente
									// Ejecuta otra acción aquí, por ejemplo, actualiza la base de datos, etc.
									// echo "El archivo se ha subido correctamente.";
									$sql = "UPDATE cmx_proveedores SET documentos_soporte = '$ruta_base' WHERE numdoc_nexos = " . $numdoc_cabecera . "";
									$consulta_act_proveedor = $this->_db3->prepare($sql);
									$consulta_act_proveedor->execute();
								} else {
									// Hubo un error al subir el archivo
									$mensajeError = "Error al mover el archivo a la carpeta de destino." . date("Y-m-d H:i:s");
									error_log($mensajeError . "\n", 3, "error_log.txt");
									echo "Hubo un error al subir el archivo.";
									// Ejecuta otra acción aquí en caso de error, por ejemplo, devuelve una respuesta de error al usuario.
								}
							} else {
								// Cuando no hay documentos para subir
								$mensajeError = "No se han proporcionado documentos para subir." . date("Y-m-d");
								error_log($mensajeError . "\n", 3, "error_log.txt");
								// throw new Exception("Error al guardar proveedor 1");
							}

							$sql_block = $this->_db3->prepare("INSERT INTO cmx_estado_bloqueo (nombre_proceso,estado_proceso,id_objeto,tipo_objeto,fecha,hora,usuario) 
														VALUES ('modificar','desbloqueado','" . $numdoc_cabecera . "','proveedor','" . $fecha_actual . "','" . $hora_actual . "','" . $user . "')");
							$sql_block->execute();

							/* LLmado a la funcio de insertar las referencias del proveedor */
							$Referencias = $this->Isnertar_referencias_hojas_de_vida($datos, $numdoc_cabecera);
							/* Validar la respuetsa de la opeeracion */
							if ($Referencias) {
								$Fotos = $this->Insertar_documentos_proveedor($datos, $numdoc_cabecera);
								if ($Fotos) {
									$sql = $this->_db3->prepare("INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ('$numdoc_cabecera','" . $datos['Actividad_propietario4'] . "')");
									$result_propietario = $sql->execute();
									if ($result_propietario) {
										$sql_poseedor = $this->_db3->prepare("INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ('$numdoc_cabecera','" . $datos['Actividad_poseedor4'] . "')");
										$result_poseedor = $sql_poseedor->execute();
										if ($result_poseedor) {
											$sql_conductor = $this->_db3->prepare("INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ('$numdoc_cabecera','" . $datos['Actividad_conductor4'] . "')");
											$result_conductor = $sql_conductor->execute();
											if ($result_conductor) {
												$this->_db3->commit();
												// $response = true;
												$response = ['success' => true, 'message' => 'Conductor-Propietario-Peseedor insertado correctamente en NEXOSAPP.'];
											} else {
												// Falla en la actualización, revertir la transacción
												$response = ['success' => false, 'message' => 'Conductor-Propietario-Peseedor no insertado correctamente en NEXOSAPP.'];
											}
										} else {
											// Falla en la actualización, revertir la transacción
											// Puedes lanzar una excepción específica aquí si lo deseas
											$mensajeError = "Error al insertar las activiada del POSEEDOR." . $datos['numero_documento'] . " El dia " . date("Y-m-d");
											error_log($mensajeError . "\n", 3, "error_log.txt");
											throw new Exception("Error al guardar proveedor");
										}
									} else {
										// Falla en la actualización, revertir la transacción
										// Puedes lanzar una excepción específica aquí si lo deseas
										$mensajeError = "Error al insertar las activiada del propietario." . $datos['numero_documento'] . " El dia " . date("Y-m-d");
										error_log($mensajeError . "\n", 3, "error_log.txt");
										throw new Exception("Error al guardar proveedor");
									}
								} else {
									$mensajeError = "Error al insertar las fotos del conductor." . $datos['numero_documento'] . " El dia " . date("Y-m-d");
									error_log($mensajeError . "\n", 3, "error_log.txt");
									throw new Exception("Error al guardar proveedor");
								}
							} else {
								$mensajeError = "Error al insertar las referencias del conductor." . $datos['numero_documento'] . " El dia " . date("Y-m-d");
								error_log($mensajeError . "\n", 3, "error_log.txt");
								throw new Exception("Error al guardar proveedor");
							}
						} else {
							$mensajeError = "Error al insertar los detalles del conductor." . $datos['numero_documento'] . " El dia " . date("Y-m-d");
							error_log($mensajeError . "\n", 3, "error_log.txt");
							throw new Exception("Error al guardar proveedor");
						}
					} elseif (isset($datos['Actividad_conductor5']) && isset($datos['Actividad_propietario5']) && isset($datos['Actividad_poseedor5']) && isset($datos['Actividad_propietarioTrailer5'])) {
						/* Funcion para crear el conductor */
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
							$ruta = "public/files/proveedores/" . $numdoc_cabecera . "/";
							$ruta_base = "public/files/proveedores/" . $numdoc_cabecera . "/";

							if (!is_dir($ruta)) {
								mkdir($ruta, 0775, true);
							}

							if ($datos['documentos'] !== null) {
								$nombre = $datos['documentos']['name'];
								$rutaTemporal = $datos['documentos']['tmp_name'];
								$carpeta = $ruta;
								$src = $carpeta . $nombre;
								// move_uploaded_file($rutaTemporal, $src);
								if (move_uploaded_file($rutaTemporal, $src)) {
									chmod($src, 644);
									// El archivo se subió correctamente
									// Ejecuta otra acción aquí, por ejemplo, actualiza la base de datos, etc.
									// echo "El archivo se ha subido correctamente.";
									$sql = "UPDATE cmx_proveedores SET documentos_soporte = '$ruta_base' WHERE numdoc_nexos = " . $numdoc_cabecera . "";
									$consulta_act_proveedor = $this->_db3->prepare($sql);
									$consulta_act_proveedor->execute();
								} else {
									// Hubo un error al subir el archivo
									$mensajeError = "Error al mover el archivo a la carpeta de destino." . date("Y-m-d H:i:s");
									error_log($mensajeError . "\n", 3, "error_log.txt");
									echo "Hubo un error al subir el archivo.";
									// Ejecuta otra acción aquí en caso de error, por ejemplo, devuelve una respuesta de error al usuario.
								}
							} else {
								// Cuando no hay documentos para subir
								$mensajeError = "No se han proporcionado documentos para subir." . date("Y-m-d");
								error_log($mensajeError . "\n", 3, "error_log.txt");
								// throw new Exception("Error al guardar proveedor 1");
							}

							$sql_block = $this->_db3->prepare("INSERT INTO cmx_estado_bloqueo (nombre_proceso,estado_proceso,id_objeto,tipo_objeto,fecha,hora,usuario) 
												VALUES ('modificar','desbloqueado','" . $numdoc_cabecera . "','proveedor','" . $fecha_actual . "','" . $hora_actual . "','" . $user . "')");
							$sql_block->execute();

							/* LLmado a la funcio de insertar las referencias del proveedor */
							$Referencias = $this->Isnertar_referencias_hojas_de_vida($datos, $numdoc_cabecera);
							/* Validar la respuetsa de la opeeracion */
							if ($Referencias) {
								$Fotos = $this->Insertar_documentos_proveedor($datos, $numdoc_cabecera);
								if ($Fotos) {
									$sql = $this->_db3->prepare("INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ('$numdoc_cabecera','" . $datos['Actividad_propietario5'] . "')");
									$result_propietario = $sql->execute();
									if ($result_propietario) {
										$sql_poseedor = $this->_db3->prepare("INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ('$numdoc_cabecera','" . $datos['Actividad_poseedor5'] . "')");
										$result_poseedor = $sql_poseedor->execute();
										if ($result_poseedor) {
											$sql_conductor = $this->_db3->prepare("INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ('$numdoc_cabecera','" . $datos['Actividad_conductor5'] . "')");
											$result_conductor = $sql_conductor->execute();
											if ($result_conductor) {
												$sql_propietario_trailer = $this->_db3->prepare("INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ('$numdoc_cabecera','" . $datos['Actividad_propietarioTrailer5'] . "')");
												$result_propietario_trailer = $sql_propietario_trailer->execute();
												if ($result_propietario_trailer) {
													$this->_db3->commit();
													// $response = true;
													$response = ['success' => true, 'message' => 'Proveedores insertado correctamente en NEXOSAPP.'];
												} else {
													// Falla en la actualización, revertir la transacción
													$response = ['success' => false, 'message' => 'Conductor-Propietario-Peseedor no insertado correctamente en NEXOSAPP.'];
												}
											} else {
												// Falla en la actualización, revertir la transacción
												$response = ['success' => false, 'message' => 'Conductor-Propietario-Peseedor no insertado correctamente en NEXOSAPP.'];
											}
										} else {
											// Falla en la actualización, revertir la transacción
											// Puedes lanzar una excepción específica aquí si lo deseas
											$mensajeError = "Error al insertar las activiada del POSEEDOR." . $datos['numero_documento'] . " El dia " . date("Y-m-d");
											error_log($mensajeError . "\n", 3, "error_log.txt");
											throw new Exception("Error al guardar proveedor");
										}
									} else {
										// Falla en la actualización, revertir la transacción
										// Puedes lanzar una excepción específica aquí si lo deseas
										$mensajeError = "Error al insertar las activiada del propietario." . $datos['numero_documento'] . " El dia " . date("Y-m-d");
										error_log($mensajeError . "\n", 3, "error_log.txt");
										throw new Exception("Error al guardar proveedor");
									}
								} else {
									$mensajeError = "Error al insertar las fotos del conductor." . $datos['numero_documento'] . " El dia " . date("Y-m-d");
									error_log($mensajeError . "\n", 3, "error_log.txt");
									throw new Exception("Error al guardar proveedor");
								}
							} else {
								$mensajeError = "Error al insertar las referencias del conductor." . $datos['numero_documento'] . " El dia " . date("Y-m-d");
								error_log($mensajeError . "\n", 3, "error_log.txt");
								throw new Exception("Error al guardar proveedor");
							}
						} else {
							$mensajeError = "Error al insertar los detalles del conductor." . $datos['numero_documento'] . " El dia " . date("Y-m-d");
							error_log($mensajeError . "\n", 3, "error_log.txt");
							throw new Exception("Error al guardar proveedor");
						}
					}
				}
			} else {
				// Falla en la actualización, revertir la transacción
				$response = array('success' => false, 'message' => 'Proveedor no  <strong> ingresado </strong> correctamente en NexosApp.');
				// Puedes lanzar una excepción específica aquí si lo deseas
				$mensajeError = "Error al insertar proveedor en la base de datos." . date("Y-m-d");
				error_log($mensajeError . "\n", 3, "error_log.txt");
				throw new Exception("Error al insertar proveedor en NexosApp.");
			}
		} catch (\Throwable $th) {
			// Algo salió mal, se hace rollback
			$this->_db3->rollBack();
			// Registrar el error en un archivo de log en la raíz del proyecto
			$errorMessage = "Error en la transacción al insertar conductor: " . $th->getMessage() . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
			$logFilePath = 'error_log.txt'; // Ajusta la ruta según la estructura de tu proyecto
			error_log($errorMessage, 3, $logFilePath);

			// Verificar si el archivo de log se ha escrito correctamente
			if (!file_exists($logFilePath)) {
				error_log("No se pudo crear el archivo de log: $logFilePath\n", 3, $logFilePath);
			}

			// Mostrar un mensaje amigable al usuario
			$response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar un conductor. Por favor, inténtelo nuevamente más tarde.</br>Por favor comunicarse con el equipo de desarrollo.'];
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
				$ruta_empresarial1 = "public/files/proveedores/empresarial/" . $numdoc_cabecera . "/1/";
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
					if (!is_dir($ruta_empresarial1)) {
						mkdir($ruta_empresarial1, 0777, true);
						if ($datos['documento_referencia1'] !== null) {
							$nombre = $datos['documento_referencia1']['name'];
							$rutaTemporal = $datos['documento_referencia1']['tmp_name'];
							$carpeta = $ruta_empresarial1;
							$src = $carpeta . $nombre;
							move_uploaded_file($rutaTemporal, $src);
						} else {
							// Cuando no hay documentos para subir
							$mensajeError = "No se han proporcionado documentos para subir." . date("Y-m.d");
							error_log($mensajeError . "\n", 3, "error_log.txt");
							// throw new Exception("Error al guardar proveedor 1");
						}
					} else {
						// Cuando la carpeta ya existe
						if ($datos['documento_referencia1'] !== null) {
							$nombre = $datos['documento_referencia1']['name'];
							$rutaTemporal = $datos['documento_referencia1']['tmp_name'];
							$carpeta = $ruta_empresarial1;
							$src = $carpeta . $nombre;
							move_uploaded_file($rutaTemporal, $src);
						} else {
							// Cuando no hay documentos para subir
							$mensajeError = "La carpeta de destino ya existe." . date("Y-m.d");
							error_log($mensajeError . "\n", 3, "error_log.txt");
							// throw new Exception("Error al guardar proveedor 1");
						}
					}
				} else {
					// Cuando la consulta de actualización del proveedor falla
					$mensajeError = "Error al insertar la referencia 1 del proveedor." . date("Y-m.d");
					error_log($mensajeError . "\n", 3, "error_log.txt");
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
				$ruta_empresarial2 = "public/files/proveedores/empresarial/" . $numdoc_cabecera . "/2/";
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
					//obtener el id de la referencia laboral 2
					if (!is_dir($ruta_empresarial2)) {
						mkdir($ruta_empresarial2, 0777, true);
						if ($datos['documento_referencia2'] !== null) {
							$nombre = $datos['documento_referencia2']['name'];
							$rutaTemporal = $datos['documento_referencia2']['tmp_name'];
							$carpeta = $ruta_empresarial2;
							$src = $carpeta . $nombre;
							move_uploaded_file($rutaTemporal, $src);
						} else {
							// Cuando no hay documentos para subir
							$mensajeError = "No se han proporcionado documentos para subir." . date("Y-m.d");
							error_log($mensajeError . "\n", 3, "error_log.txt");
							// throw new Exception("Error al guardar proveedor 1");
						}
					} else {
						// Cuando la carpeta ya existe
						if ($datos['documento_referencia2'] !== null) {
							$nombre = $datos['documento_referencia2']['name'];
							$rutaTemporal = $datos['documento_referencia2']['tmp_name'];
							$carpeta = $ruta_empresarial2;
							$src = $carpeta . $nombre;
							move_uploaded_file($rutaTemporal, $src);
						} else {
							// Cuando no hay documentos para subir
							$mensajeError = "La carpeta de destino ya existe." . date("Y-m.d");
							error_log($mensajeError . "\n", 3, "error_log.txt");
							// throw new Exception("Error al guardar proveedor 1");
						}
					}
				} else {
					// Cuando la consulta de actualización del proveedor falla
					$mensajeError = "Error al insertar la referencia 2 del proveedor." . date("Y-m.d");
					error_log($mensajeError . "\n", 3, "error_log.txt");
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
				$ruta_empresarial3 = "public/files/proveedores/empresarial/" . $numdoc_cabecera . "/3/";
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
					//obtener el id de la referencia laboral 3
					if (!is_dir($ruta_empresarial3)) {
						mkdir($ruta_empresarial3, 0777, true);
						if ($datos['documento_referencia3'] !== null) {
							$nombre = $datos['documento_referencia3']['name'];
							$rutaTemporal = $datos['documento_referencia3']['tmp_name'];
							$carpeta = $ruta_empresarial3;
							$src = $carpeta . $nombre;
							move_uploaded_file($rutaTemporal, $src);
						} else {
							// Cuando no hay documentos para subir
							$mensajeError = "No se han proporcionado documentos para subir." . date("Y-m.d");
							error_log($mensajeError . "\n", 3, "error_log.txt");
							// throw new Exception("Error al guardar proveedor 1");
						}
					} else {
						// Cuando la carpeta ya existe
						if ($datos['documento_referencia3'] !== null) {
							$nombre = $datos['documento_referencia3']['name'];
							$rutaTemporal = $datos['documento_referencia3']['tmp_name'];
							$carpeta = $ruta_empresarial3;
							$src = $carpeta . $nombre;
							move_uploaded_file($rutaTemporal, $src);
						} else {
							// Cuando no hay documentos para subir
							$mensajeError = "La carpeta de destino ya existe." . date("Y-m.d");
							error_log($mensajeError . "\n", 3, "error_log.txt");
							// throw new Exception("Error al guardar proveedor 1");
						}
					}
				} else {
					// Cuando la consulta de actualización del proveedor falla
					$mensajeError = "Error al insertar la referencia 3 del proveedor." . date("Y-m.d");
					error_log($mensajeError . "\n", 3, "error_log.txt");
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
				if (!is_dir($ruta_empresarial1)) {
					mkdir($ruta_empresarial1, 0777, true);
					if ($datos['documento_referencia1'] !== null) {
						$nombre = $datos['documento_referencia1']['name'];
						$rutaTemporal = $datos['documento_referencia1']['tmp_name'];
						$carpeta = $ruta_empresarial1;
						$src = $carpeta . $nombre;
						move_uploaded_file($rutaTemporal, $src);
					} else {
						// Cuando no hay documentos para subir
						$mensajeError = "No se han proporcionado documentos para subir." . date("Y-m.d");
						error_log($mensajeError . "\n", 3, "error_log.txt");
						// throw new Exception("Error al guardar proveedor 1");
					}
				} else {
					// Cuando la carpeta ya existe
					if ($datos['documento_referencia1'] !== null) {
						$nombre = $datos['documento_referencia1']['name'];
						$rutaTemporal = $datos['documento_referencia1']['tmp_name'];
						$carpeta = $ruta_empresarial1;
						$src = $carpeta . $nombre;
						move_uploaded_file($rutaTemporal, $src);
					} else {
						// Cuando no hay documentos para subir
						$mensajeError = "La carpeta de destino ya existe." . date("Y-m.d");
						error_log($mensajeError . "\n", 3, "error_log.txt");
						// throw new Exception("Error al guardar proveedor 1");
					}
				}
			} else {
				// Cuando la consulta de actualización del proveedor falla
				$mensajeError = "Error al insertar la referencia 3 del proveedor." . date("Y-m.d");
				error_log($mensajeError . "\n", 3, "error_log.txt");
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

					if (!is_dir($ruta_empresarial2)) {
						mkdir($ruta_empresarial2, 0777, true);
						if ($datos['documento_referencia2'] !== null) {
							$nombre = $datos['documento_referencia2']['name'];
							$rutaTemporal = $datos['documento_referencia2']['tmp_name'];
							$carpeta = $ruta_empresarial2;
							$src = $carpeta . $nombre;
							move_uploaded_file($rutaTemporal, $src);
						} else {
							// Cuando no hay documentos para subir
							$mensajeError = "No se han proporcionado documentos para subir." . date("Y-m.d");
							error_log($mensajeError . "\n", 3, "error_log.txt");
							// throw new Exception("Error al guardar proveedor 1");
						}
					} else {
						// Cuando la carpeta ya existe
						if ($datos['documento_referencia2'] !== null) {
							$nombre = $datos['documento_referencia2']['name'];
							$rutaTemporal = $datos['documento_referencia2']['tmp_name'];
							$carpeta = $ruta_empresarial2;
							$src = $carpeta . $nombre;
							move_uploaded_file($rutaTemporal, $src);
						} else {
							// Cuando no hay documentos para subir
							$mensajeError = "La carpeta de destino ya existe." . date("Y-m.d");
							error_log($mensajeError . "\n", 3, "error_log.txt");
							// throw new Exception("Error al guardar proveedor 1");
						}
					}
				}
			} else {
				// Cuando la consulta de actualización del proveedor falla
				$mensajeError = "Error al insertar la referencia 3 del proveedor." . date("Y-m.d");
				error_log($mensajeError . "\n", 3, "error_log.txt");
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
					if (!is_dir($ruta_empresarial3)) {
						mkdir($ruta_empresarial3, 0777, true);
						if ($datos['documento_referencia3'] !== null) {
							$nombre = $datos['documento_referencia3']['name'];
							$rutaTemporal = $datos['documento_referencia3']['tmp_name'];
							$carpeta = $ruta_empresarial3;
							$src = $carpeta . $nombre;
							move_uploaded_file($rutaTemporal, $src);
						} else {
							// Cuando no hay documentos para subir
							$mensajeError = "No se han proporcionado documentos para subir." . date("Y-m.d");
							error_log($mensajeError . "\n", 3, "error_log.txt");
							// throw new Exception("Error al guardar proveedor 1");
						}
					} else {
						// Cuando la carpeta ya existe
						if ($datos['documento_referencia3'] !== null) {
							$nombre = $datos['documento_referencia3']['name'];
							$rutaTemporal = $datos['documento_referencia3']['tmp_name'];
							$carpeta = $ruta_empresarial3;
							$src = $carpeta . $nombre;
							move_uploaded_file($rutaTemporal, $src);
						} else {
							// Cuando no hay documentos para subir
							$mensajeError = "La carpeta de destino ya existe." . date("Y-m.d");
							error_log($mensajeError . "\n", 3, "error_log.txt");
							// throw new Exception("Error al guardar proveedor 1");
						}
					}
				} else {
					// Cuando la consulta de actualización del proveedor falla
					$mensajeError = "Error al insertar la referencia 3 del proveedor." . date("Y-m.d");
					error_log($mensajeError . "\n", 3, "error_log.txt");
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

				if (!is_dir($ruta_personal1)) {
					mkdir($ruta_personal1, 0777, true);
					if ($datos['docu_personal1'] !== null) {
						$nombre = $datos['docu_personal1']['name'];
						$rutaTemporal = $datos['docu_personal1']['tmp_name'];
						$carpeta = $ruta_personal1;
						$src = $carpeta . $nombre;
						move_uploaded_file($rutaTemporal, $src);
					} else {
						// Cuando no hay documentos para subir
						$mensajeError = "No se han proporcionado documentos para subir." . date("Y-m.d");
						error_log($mensajeError . "\n", 3, "error_log.txt");
						// throw new Exception("Error al guardar proveedor 1");
					}
				} else {
					// Cuando la carpeta ya existe
					if ($datos['docu_personal1'] !== null) {
						$nombre = $datos['docu_personal1']['name'];
						$rutaTemporal = $datos['docu_personal1']['tmp_name'];
						$carpeta = $ruta_personal1;
						$src = $carpeta . $nombre;
						move_uploaded_file($rutaTemporal, $src);
					} else {
						// Cuando no hay documentos para subir
						$mensajeError = "La carpeta de destino ya existe." . date("Y-m.d");
						error_log($mensajeError . "\n", 3, "error_log.txt");
						// throw new Exception("Error al guardar proveedor 1");
					}
				}
			} else {
				$mensajeError = "Error al insertar la referencia personal 1 del proveedor." . date("Y-m.d");
				error_log($mensajeError . "\n", 3, "error_log.txt");
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
				$mensajeError = "Error al insertar la referencia personal 2 del proveedor." . date("Y-m.d");
				error_log($mensajeError . "\n", 3, "error_log.txt");
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


				if (!is_dir($ruta_personal2)) {
					mkdir($ruta_personal2, 0777, true);
					if ($datos['docu_personal2'] !== null) {
						$nombre = $datos['docu_personal2']['name'];
						$rutaTemporal = $datos['docu_personal2']['tmp_name'];
						$carpeta = $ruta_personal2;
						$src = $carpeta . $nombre;
						move_uploaded_file($rutaTemporal, $src);
					} else {
						// Cuando no hay documentos para subir
						$mensajeError = "No se han proporcionado documentos para subir." . date("Y-m.d");
						error_log($mensajeError . "\n", 3, "error_log.txt");
						// throw new Exception("Error al guardar proveedor 1");
					}
				} else {
					// Cuando la carpeta ya existe
					if ($datos['docu_personal2'] !== null) {
						$nombre = $datos['docu_personal2']['name'];
						$rutaTemporal = $datos['docu_personal2']['tmp_name'];
						$carpeta = $ruta_personal2;
						$src = $carpeta . $nombre;
						move_uploaded_file($rutaTemporal, $src);
					} else {
						// Cuando no hay documentos para subir
						$mensajeError = "La carpeta de destino ya existe." . date("Y-m.d");
						error_log($mensajeError . "\n", 3, "error_log.txt");
						// throw new Exception("Error al guardar proveedor 1");
					}
				}
			} else {
				$mensajeError = "Error al insertar la documento personal 2 del proveedor." . date("Y-m.d");
				error_log($mensajeError . "\n", 3, "error_log.txt");
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
				$mensajeError = "Error al insertar la documento personal 2 del proveedor." . date("Y-m.d");
				error_log($mensajeError . "\n", 3, "error_log.txt");
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
		$ruta_licencia = "public/files/proveedores/licencias/" . $numdoc_cabecera . "/";
		if (!is_dir($ruta_licencia)) {
			mkdir($ruta_licencia, 0777, true);
		}

		if ($datos['licencia'] !== null && $datos['licencia']['error'] === UPLOAD_ERR_OK) {
			$nombre = basename($datos['licencia']['name']);
			$rutaTemporal = $datos['licencia']['tmp_name'];
			$src = $ruta_licencia . $nombre;

			if (move_uploaded_file($rutaTemporal, $src)) {
				// El archivo se subió correctamente
				$sql = $this->_db3->prepare("UPDATE cmx_proveedores SET subir_licencia = '$ruta_licencia', n_docu_licencia = '" . $datos['name_doculice'] . "' WHERE numdoc_nexos = " . $numdoc_cabecera);
				$sql->execute();
				if ($sql->rowCount() > 0) {
					$cont_doc++;
				} else {
					// Falla en la actualización
					$mensajeError = "Error al momento de subir el documento de la licencia. " . date("Y-m-d");
					error_log($mensajeError . "\n", 3, "error_log.txt");
					throw new Exception("Error al guardar proveedor");
				}
			} else {
				// Hubo un error al subir el archivo
				$mensajeError = "Error al mover el archivo a la carpeta de destino. " . date("Y-m-d H:i:s");
				error_log($mensajeError . "\n", 3, "error_log.txt");
				echo "Hubo un error al subir el archivo.";
				// Ejecuta otra acción aquí en caso de error
			}
		} else {
			// Cuando no hay documentos para subir
			$mensajeError = "No se han proporcionado documentos para subir. " . date("Y-m-d");
			error_log($mensajeError . "\n", 3, "error_log.txt");
			// throw new Exception("Error al guardar proveedor 1");
		}

		//REGISTRAR EL ARCHIVO DE LA EPS
		$ruta_eps = "public/files/proveedores/eps/" . $numdoc_cabecera . "/";
		if (!is_dir($ruta_eps)) {
			mkdir($ruta_eps, 0777, true);
		}

		if ($datos['docu_eps'] !== null && $datos['docu_eps']['error'] === UPLOAD_ERR_OK) {
			$nombre = basename($datos['docu_eps']['name']);
			$rutaTemporal = $datos['docu_eps']['tmp_name'];
			$src = $ruta_eps . $nombre;

			if (move_uploaded_file($rutaTemporal, $src)) {
				// El archivo se subió correctamente
				$sql = $this->_db3->prepare("UPDATE cmx_detalle_conductor SET documento_eps= :ruta_eps, n_docu_eps = :nombre_eps WHERE id_proveedor = :numdoc_cabecera");
				$sql->bindParam(':ruta_eps', $ruta_eps);
				$sql->bindParam(':nombre_eps', $datos['namedocu_eps']);
				$sql->bindParam(':numdoc_cabecera', $numdoc_cabecera);
				$sql->execute();
				if ($sql->rowCount() > 0) {
					// La actualización fue exitosa
					$cont_doc++;
				} else {
					// Falla en la actualización
					$mensajeError = "Error al momento de subir el documento de la EPS. " . date("Y-m-d");
					error_log($mensajeError . "\n", 3, "error_log.txt");
					throw new Exception("Error al guardar proveedor");
				}
			} else {
				// Hubo un error al subir el archivo
				$mensajeError = "Error al mover el archivo a la carpeta de destino. " . date("Y-m-d H:i:s");
				error_log($mensajeError . "\n", 3, "error_log.txt");
				echo "Hubo un error al subir el archivo.";
			}
		} else {
			// Cuando no hay documentos para subir
			$mensajeError = "No se han proporcionado documentos para subir. " . date("Y-m-d");
			error_log($mensajeError . "\n", 3, "error_log.txt");
			// throw new Exception("Error al guardar proveedor 1");
		}


		//FOTOS CONDUCTOR
		$ruta_fotos = "public/files/proveedores/fotos/" . $numdoc_cabecera . "/F/";
		if (!is_dir($ruta_fotos)) {
			mkdir($ruta_fotos, 0777, true);
		}

		if ($datos['foto_conductor'] !== null && $datos['foto_conductor']['error'] === UPLOAD_ERR_OK) {
			$nombre = basename($datos['foto_conductor']['name']);
			$rutaTemporal = $datos['foto_conductor']['tmp_name'];
			$src = $ruta_fotos . $nombre;

			if (move_uploaded_file($rutaTemporal, $src)) {
				// El archivo se subió correctamente
				$sqlf = $this->_db3->prepare("UPDATE cmx_detalle_conductor SET foto_conductor=:ruta_fotos, name_cfrontal=:name_cfrontal WHERE id_proveedor=:numdoc_cabecera");
				$sqlf->bindParam(':ruta_fotos', $ruta_fotos);
				$sqlf->bindParam(':name_cfrontal', $datos['name_fontall']);
				$sqlf->bindParam(':numdoc_cabecera', $numdoc_cabecera);
				$sqlf->execute();
				if ($sqlf->rowCount() > 0) {
					// La actualización fue exitosa
					$cont_doc++;
				} else {
					// Falla en la actualización
					$mensajeError = "Error al momento de subir la foto frontal del conductor. " . date("Y-m-d");
					error_log($mensajeError . "\n", 3, "error_log.txt");
					throw new Exception("Error al guardar proveedor");
				}
			} else {
				// Hubo un error al mover el archivo
				$mensajeError = "Error al mover el archivo a la carpeta de destino. " . date("Y-m-d H:i:s");
				error_log($mensajeError . "\n", 3, "error_log.txt");
				throw new Exception("Error al guardar proveedor");
			}
		} else {
			// No se han proporcionado documentos para subir
			$mensajeError = "No se han proporcionado documentos para subir. " . date("Y-m-d");
			error_log($mensajeError . "\n", 3, "error_log.txt");
			// throw new Exception("Error al guardar proveedor 1");
		}

		//FOTO DERECHA
		$ruta_fotod = "public/files/proveedores/fotos/" . $numdoc_cabecera . "/D/";
		if (!is_dir($ruta_fotod)) {
			mkdir($ruta_fotod, 0777, true);
		}

		if ($datos['foto_derecha'] !== null && $datos['foto_derecha']['error'] === UPLOAD_ERR_OK) {
			$nombre = basename($datos['foto_derecha']['name']);
			$rutaTemporal = $datos['foto_derecha']['tmp_name'];
			$src = $ruta_fotod . $nombre;

			if (move_uploaded_file($rutaTemporal, $src)) {
				// El archivo se subió correctamente
				$sqlfd = $this->_db3->prepare("UPDATE cmx_detalle_conductor SET foto_derecha=:ruta_fotod, name_cderecha=:name_cderecha WHERE id_proveedor=:numdoc_cabecera");
				$sqlfd->bindParam(':ruta_fotod', $ruta_fotod);
				$sqlfd->bindParam(':name_cderecha', $datos['name_derecha']);
				$sqlfd->bindParam(':numdoc_cabecera', $numdoc_cabecera);
				$sqlfd->execute();

				if ($sqlfd->rowCount() > 0) {
					// La actualización fue exitosa
					$cont_doc++;
				} else {
					// Falla en la actualización
					$mensajeError = "Error al momento de subir la foto derecha del conductor. " . date("Y-m-d");
					error_log($mensajeError . "\n", 3, "error_log.txt");
					throw new Exception("Error al guardar proveedor");
				}
			} else {
				// Hubo un error al mover el archivo
				$mensajeError = "Error al mover el archivo a la carpeta de destino. " . date("Y-m-d H:i:s");
				error_log($mensajeError . "\n", 3, "error_log.txt");
				throw new Exception("Error al guardar proveedor");
			}
		} else {
			// No se han proporcionado documentos para subir
			$mensajeError = "No se han proporcionado documentos para subir. " . date("Y-m-d");
			error_log($mensajeError . "\n", 3, "error_log.txt");
			// throw new Exception("Error al guardar proveedor 1");
		}

		//FOTO IZQUIERDA
		$ruta_fotoi = "public/files/proveedores/fotos/" . $numdoc_cabecera . "/I/";
		if (!is_dir($ruta_fotoi)) {
			mkdir($ruta_fotoi, 0777, true);
		}

		if ($datos['foto_izquierda'] !== null && $datos['foto_izquierda']['error'] === UPLOAD_ERR_OK) {
			$nombre = basename($datos['foto_izquierda']['name']);
			$rutaTemporal = $datos['foto_izquierda']['tmp_name'];
			$src = $ruta_fotoi . $nombre;

			if (move_uploaded_file($rutaTemporal, $src)) {
				// El archivo se subió correctamente
				$sqlfi = $this->_db3->prepare("UPDATE cmx_detalle_conductor SET foto_izquierda=:ruta_fotoi, name_cizquierda=:name_cizquierda WHERE id_proveedor=:numdoc_cabecera");
				$sqlfi->bindParam(':ruta_fotoi', $ruta_fotoi);
				$sqlfi->bindParam(':name_cizquierda', $datos['name_izquierda']);
				$sqlfi->bindParam(':numdoc_cabecera', $numdoc_cabecera, PDO::PARAM_INT);
				$sqlfi->execute();
				if ($sqlfi->rowCount() > 0) {
					// La actualización fue exitosa
					$cont_doc++;
				} else {
					// Falla en la actualización
					$mensajeError = "Error al momento de subir la foto izquierda del conductor. " . date("Y-m-d");
					error_log($mensajeError . "\n", 3, "error_log.txt");
					throw new Exception("Error al guardar proveedor");
				}
			} else {
				// Hubo un error al mover el archivo
				$mensajeError = "Error al mover el archivo a la carpeta de destino. " . date("Y-m-d H:i:s");
				error_log($mensajeError . "\n", 3, "error_log.txt");
				throw new Exception("Error al guardar proveedor");
			}
		} else {
			// No se han proporcionado documentos para subir
			$mensajeError = "No se han proporcionado documentos para subir. " . date("Y-m-d");
			error_log($mensajeError . "\n", 3, "error_log.txt");
			// throw new Exception("Error al guardar proveedor 1");
		}

		//INDUMENTARIA
		$ruta_indumentaria = "public/files/proveedores/indumentaria/" . $numdoc_cabecera . "/";
		if (!is_dir($ruta_indumentaria)) {
			mkdir($ruta_indumentaria, 0777, true);
		}

		if ($datos['foto_indume'] !== null && $datos['foto_indume']['error'] === UPLOAD_ERR_OK) {
			$nombre = basename($datos['foto_indume']['name']);
			$rutaTemporal = $datos['foto_indume']['tmp_name'];
			$src = $ruta_indumentaria . $nombre;

			if (move_uploaded_file($rutaTemporal, $src)) {
				// El archivo se subió correctamente
				$sqli = $this->_db3->prepare("UPDATE cmx_detalle_conductor SET foto_indumentaria=:ruta_indumentaria, name_cindu=:name_cindu WHERE id_proveedor=:numdoc_cabecera");
				$sqli->bindParam(':ruta_indumentaria', $ruta_indumentaria);
				$sqli->bindParam(':name_cindu', $datos['name_indum']);
				$sqli->bindParam(':numdoc_cabecera', $numdoc_cabecera, PDO::PARAM_INT);
				$sqli->execute();
				if ($sqli->rowCount() > 0) {
					// La actualización fue exitosa
					$cont_doc++;
				} else {
					// Falla en la actualización
					$mensajeError = "Error al momento de subir la foto de indumentaria del conductor. " . date("Y-m-d");
					error_log($mensajeError . "\n", 3, "error_log.txt");
					throw new Exception("Error al guardar proveedor");
				}
			} else {
				// Hubo un error al mover el archivo
				$mensajeError = "Error al mover el archivo a la carpeta de destino. " . date("Y-m-d H:i:s");
				error_log($mensajeError . "\n", 3, "error_log.txt");
				throw new Exception("Error al guardar proveedor");
			}
		} else {
			// No se han proporcionado documentos para subir
			$mensajeError = "No se han proporcionado documentos para subir. " . date("Y-m-d");
			error_log($mensajeError . "\n", 3, "error_log.txt");
			// throw new Exception("Error al guardar proveedor 1");
		}

		//CURSO MERCANCIAS PELIGROSAS
		$ruta_mercancias1 = "public/files/proveedores/curso/" . $numdoc_cabecera . "/";
		// $ruta_mercancias11 = "public/files/proveedores/curso/" . $numdoc_cabecera . "/";

		if (!is_dir($ruta_mercancias1)) {
			mkdir($ruta_mercancias1, 0777, true);
		}

		if ($datos['docu_curso'] !== null && $datos['docu_curso']['error'] === UPLOAD_ERR_OK) {
			$nombre = basename($datos['docu_curso']['name']);
			$rutaTemporal = $datos['docu_curso']['tmp_name'];
			$carpeta = $ruta_mercancias1;
			$src = $carpeta . $nombre;

			if (move_uploaded_file($rutaTemporal, $src)) {
				$sqlm = $this->_db3->prepare("UPDATE cmx_detalle_conductor SET carnet_curso=:ruta_mercancias11, n_docu_curso=:namedocu_curso WHERE id_proveedor=:numdoc_cabecera");
				$sqlm->bindParam(':ruta_mercancias11', $ruta_mercancias1);
				$sqlm->bindParam(':namedocu_curso', $datos['namedocu_curso']);
				$sqlm->bindParam(':numdoc_cabecera', $numdoc_cabecera, PDO::PARAM_INT);
				$sqlm->execute();
				if ($sqlm->rowCount() > 0) {
					// La actualización fue exitosa
					$cont_doc++;
				} else {
					// Falla en la actualización
					$mensajeError = "Error al momento de subir el foto Mercancias peligrosas del conductor." . date("Y-m-d");
					error_log($mensajeError . "\n", 3, "error_log.txt");
					throw new Exception("Error al guardar proveedor");
				}
			} else {
				$mensajeError = "Error al momento de subir el foto Mercancias peligrosas del conductor." . date("Y-m-d");
				error_log($mensajeError . "\n", 3, "error_log.txt");
				throw new Exception("Error al guardar proveedor");
			}
		} else {
			// Cuando no hay documentos para subir
			if ($datos['docu_curso'] !== null && $datos['docu_curso']['error'] !== UPLOAD_ERR_OK) {
				$mensajeError = "Error al subir el archivo del curso. Código de error: " . $datos['docu_curso']['error'] . " - " . date("Y-m-d");
				error_log($mensajeError . "\n", 3, "error_log.txt");
				// throw new Exception("Error al guardar proveedor 1");
			} else {
				// Cuando no se proporcionó ningún documento
				$mensajeError = "No se ha proporcionado ningún documento para subir." . date("Y-m-d");
				error_log($mensajeError . "\n", 3, "error_log.txt");
				// throw new Exception("Error al guardar proveedor 1");
			}
		}

		//RUT
		$ruta_rut1 = "public/files/proveedores/rut/" . $numdoc_cabecera . "/";
		// $ruta_rut11 = "public/files/proveedores/rut/" . $numdoc_cabecera . "/";

		if (!is_dir($ruta_rut1)) {
			mkdir($ruta_rut1, 0777, true);
		}

		if ($datos['rut'] !== null && $datos['rut']['error'] === UPLOAD_ERR_OK) {
			$nombre = basename($datos['rut']['name']);
			$rutaTemporal = $datos['rut']['tmp_name'];
			$carpeta = $ruta_rut1;
			$src = $carpeta . $nombre;

			if (move_uploaded_file($rutaTemporal, $src)) {
				$sqlrut = $this->_db3->prepare("UPDATE cmx_detalle_conductor SET documento_rut=:ruta_rut11, n_docu_rut=:name_docurut WHERE id_proveedor=:numdoc_cabecera");
				$sqlrut->bindParam(':ruta_rut11', $ruta_rut1);
				$sqlrut->bindParam(':name_docurut', $datos['name_docurut']);
				$sqlrut->bindParam(':numdoc_cabecera', $numdoc_cabecera, PDO::PARAM_INT);
				$sqlrut->execute();
				if ($sqlrut->rowCount() > 0) {
					// echo "Si inserto el rut";
					// La actualización fue exitosa
					$cont_doc++;
				} else {
					// Falla en la actualización
					$mensajeError = "Error al momento de subir el foto Mercancias peligrosas del conductor." . date("Y-m-d");
					error_log($mensajeError . "\n", 3, "error_log.txt");
					throw new Exception("Error al guardar proveedor");
				}
			} else {
				$mensajeError = "Error al momento de subir el foto del Rut conductor." . date("Y-m-d");
				error_log($mensajeError . "\n", 3, "error_log.txt");
				throw new Exception("Error al guardar proveedor");
			}
		} else {
			// Cuando no hay documentos para subir
			if ($datos['rut'] !== null && $datos['rut']['error'] !== UPLOAD_ERR_OK) {
				$mensajeError = "Error al subir el archivo del Rut. Código de error: " . $datos['rut']['error'] . " - " . date("Y-m-d");
				error_log($mensajeError . "\n", 3, "error_log.txt");
				// throw new Exception("Error al guardar proveedor 1");
			} else {
				// Cuando no se proporcionó ningún documento
				$mensajeError = "No se ha proporcionado ningún documento para subir." . date("Y-m-d");
				error_log($mensajeError . "\n", 3, "error_log.txt");
				// throw new Exception("Error al guardar proveedor 1");
			}
		}

		//ACUERDOS
		$ruta_ac1 = "public/files/proveedores/acuerdo/" . $numdoc_cabecera . "/AC1/";
		// $ruta_ac11 = "public/files/proveedores/acuerdo/" . $numdoc_cabecera . "/AC1/";

		if (!is_dir($ruta_ac1)) {
			mkdir($ruta_ac1, 0777, true);
		}

		if ($datos['acuerdo_uno'] !== null && $datos['acuerdo_uno']['error'] === UPLOAD_ERR_OK) {
			$nombre = basename($datos['acuerdo_uno']['name']);
			$rutaTemporal = $datos['acuerdo_uno']['tmp_name'];
			$carpeta = $ruta_ac1;
			$src = $carpeta . $nombre;

			if (move_uploaded_file($rutaTemporal, $src)) {
				$sqlau = $this->_db3->prepare("UPDATE cmx_detalle_conductor SET foto_acuerdo1=:ruta_ac11, name_acuerdo1=:name_a1 WHERE id_proveedor=:numdoc_cabecera");
				$sqlau->bindParam(':ruta_ac11', $ruta_ac1);
				$sqlau->bindParam(':name_a1', $datos['namedocu_curso']);
				$sqlau->bindParam(':numdoc_cabecera', $numdoc_cabecera, PDO::PARAM_INT);
				$sqlau->execute();
				if ($sqlau) {
					$cont_doc++;
				} else {
					// Falla en la actualización, revertir la transacción
					// $this->_db3->rollBack();
					// Puedes lanzar una excepción específica aquí si lo deseas
					$mensajeError = "Error al momento de subir el foto de Acuerdos del conductor." . date("Y-m-d");
					error_log($mensajeError . "\n", 3, "error_log.txt");
					throw new Exception("Error al guardar proveedor");
				}
			} else {
				$mensajeError = "Error al momento de subir el foto de Acuerdos del conductor." . date("Y-m-d");
				error_log($mensajeError . "\n", 3, "error_log.txt");
				throw new Exception("Error al guardar proveedor");
			}
		} else {
			// Cuando no hay documentos para subir
			if ($datos['acuerdo_uno'] !== null && $datos['acuerdo_uno']['error'] !== UPLOAD_ERR_OK) {
				$mensajeError = "Error al subir el archivo de Acuerdo 1. Código de error: " . $datos['acuerdo_uno']['error'] . " - " . date("Y-m-d");
				error_log($mensajeError . "\n", 3, "error_log.txt");
				// throw new Exception("Error al guardar proveedor 1");
			} else {
				// Cuando no se proporcionó ningún documento
				$mensajeError = "No se ha proporcionado ningún documento para subir." . date("Y-m-d");
				error_log($mensajeError . "\n", 3, "error_log.txt");
				// throw new Exception("Error al guardar proveedor 1");
			}
		}

		if ($cont_doc >= 7) {
			return true;
		} else if ($cont_doc < 8) {
			return false;
		}
	}

	public function Insertar_Propietario_trailer($datos)
	{
		$response = []; // Inicializa la variable de respuesta
		$id_usuario = $_SESSION["usuario"]["id_usuario"];
		$this->_db3->beginTransaction();
		try {
			// Consultar maestro de Estudio de seguridad cabecera
			$sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='PROVEEDORES' AND numero_actual>numero_inicial");
			$resultado_consecutivo = $sql_consecutivo->execute();
			$resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
			$numdoc_cabecera = $resultado_consecutivo['numero_actual'];
			$numdoc_actualizar_cabecera = $resultado_consecutivo['numero_actual'] + 1;
			// Actualizar Maestro de Estudio segurdad cabecera
			$sql_updata_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=$numdoc_actualizar_cabecera WHERE tipo='PROVEEDORES'");
			$resultado_consecutivo_update_cabecera = $sql_updata_maestro->execute();
			if ($numdoc_cabecera && $resultado_consecutivo_update_cabecera) {
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
					$fecha = date("Y-m-d H:i:s");
					$sql_log = "INSERT INTO cmx_log_proveedores (id_usuario,id_proveedor,operacion,fecha_hora_operacion) VALUES('$id_usuario','$numdoc_cabecera','Crear','$fecha')";
					$crear_log_proveedor = $this->_db3->prepare($sql_log);
					$crear_log_proveedor->execute();
					if ($crear_log_proveedor) {
						// if ($datos['propietario_vehiculo'] == "true") {	}
						$sql =  $this->_db3->prepare("INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ('$numdoc_cabecera','Propietario Trailer')");
						$result = $sql->execute();
						if ($result) {
							$this->_db3->commit();
							$response = true;
						} else {
							$this->_db3->rollBack();
							// Falla en la actualización, revertir la transacción
							$response = false;
							// Puedes lanzar una excepción específica aquí si lo deseas
							$mensajeError = "Error al insertar las referencias del conductor." . $datos['numero_documento'] . " El dia " . date("Y-m.d");
							error_log($mensajeError . "\n", 3, "error_log.txt");
							throw new Exception("Error al guardar proveedor 5");
						}
					}
				} else {
					// Falla en la actualización, revertir la transacción
					$response = array('numero' => 400, 'mensaje' => 'Proveedor no  <strong> ingresado </strong> correctamente en NexosApp.');
					// Puedes lanzar una excepción específica aquí si lo deseas
					$mensajeError = "Error al insertar proveedor en la base de datos." . date("Y-m.d");
					error_log($mensajeError . "\n", 3, "error_log.txt");
					throw new Exception("Error al insertar proveedor en NexosApp.");
				}
			} else {
				// Falla en la actualización, revertir la transacción
				// Puedes lanzar una excepción específica aquí si lo deseas
				$mensajeError = "Error al actualizar el consecutivo para la creacion." . date("Y-m.d");
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
		return $response;
	}

	function Insertar_Proveedor_Internacional($datos)
	{
		$response = []; // Inicializa la variable de respuesta
		$id_usuario = $_SESSION["usuario"]["id_usuario"];
		$fecha_actual = date('Y-m-d');
		$hora_actual = date('H:i:s');
		$user = $_SESSION["usuario"]["nom_usuario"];
		$this->_db3->beginTransaction();
		try {
			$numdoc_cabecera = null;

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
			if ($resultado) {
				$sql_proveedor = $this->_db3->prepare("SELECT id AS PROVEEDOR_ID FROM cmx_proveedores WHERE numero_documento=:documento ORDER BY id DESC LIMIT 1");
				$sql_proveedor->bindParam(':documento', $datos['numero_documento'], PDO::PARAM_STR);
				$sql_proveedor->execute();
				$resultado_proveedor_id = $sql_proveedor->fetch(PDO::FETCH_ASSOC);
				if ($resultado_proveedor_id) {
					$proveedor_id = $resultado_proveedor_id["PROVEEDOR_ID"];
					$sql = $this->_db3->prepare("INSERT INTO cmx_proveedores_detalle (id,id_proveedor,cod_tipo_proveedor,cod_pais,descripcion_zona,tipo_servicio,tipo_servicio_detalle1,tipo_servicio_detalle2,hora,fecha,usuario)
					VALUES(null,:id_proveedor,:tipo_proveedor,:localizacion,:zona,:tiposervicio,:detalle_uno,:detalle_dos,:hora_actual,:fecha_actual,:user)");
					$sql->bindParam(':id_proveedor', $proveedor_id, PDO::PARAM_STR);
					$sql->bindParam(':tipo_proveedor', $datos['tipo_proveedor'], PDO::PARAM_STR);
					$sql->bindParam(':localizacion', $datos['localizacion'], PDO::PARAM_STR);
					$sql->bindParam(':zona', $datos['zona'], PDO::PARAM_STR);
					$sql->bindParam(':tiposervicio', $datos['tiposervicio'], PDO::PARAM_STR);
					$sql->bindParam(':detalle_uno', $datos['detalle_uno'], PDO::PARAM_STR);
					$sql->bindParam(':detalle_dos', $datos['detalle_dos'], PDO::PARAM_STR);
					$sql->bindParam(':hora_actual', 	$hora_actual, PDO::PARAM_STR);
					$sql->bindParam(':fecha_actual', 	$fecha_actual, PDO::PARAM_STR);
					$sql->bindParam(':user', 	$user, PDO::PARAM_STR);
					$crear_datoprovee = $sql;
					$result = $crear_datoprovee->execute();
					if ($result) {
						$sql_conductor = $this->_db3->prepare("INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ('$proveedor_id','" . $datos['Actividad_Proveedor'] . "')");
						$result_conductor = $sql_conductor->execute();
						if ($result_conductor) {
							$this->_db3->commit();
							$response = true;
						} else {
							$this->_db3->rollBack();
							// Falla en la actualización, revertir la transacción
							$response = false;
						}
					} else {
						// Falla en la actualización, revertir la transacción
						$response = array('numero' => 400, 'mensaje' => 'Proveedor no  <strong> ingresado </strong> correctamente en NexosApp.');
						// Puedes lanzar una excepción específica aquí si lo deseas
						$mensajeError = "Error al insertar proveedor en la base de datos." . date("Y-m.d");
						error_log($mensajeError . "\n", 3, "error_log.txt");
						throw new Exception("Error al insertar proveedor en NexosApp.");
					}
				} else {
					// Falla en la actualización, revertir la transacción
					// Puedes lanzar una excepción específica aquí si lo deseas
					$mensajeError = "Error al actualizar el consecutivo para la creacion." . date("Y-m.d");
					error_log($mensajeError . "\n", 3, "error_log.txt");
					throw new Exception("Error al guardar proveedor");
				}
			} else {
				// Falla en la actualización, revertir la transacción
				$response = array('numero' => 400, 'mensaje' => 'Proveedor no  <strong> ingresado </strong> correctamente en NexosApp.');
				// Puedes lanzar una excepción específica aquí si lo deseas
				$mensajeError = "Error al insertar proveedor en la base de datos." . date("Y-m.d");
				error_log($mensajeError . "\n", 3, "error_log.txt");
				throw new Exception("Error al insertar proveedor en NexosApp.");
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

		return $response;
	}

	public function Crear_Contactos($datos)
	{
		$response = []; // Inicializa la variable de respuesta
		$sql_proveedor = $this->_db3->prepare("SELECT id AS PROVEEDOR_ID FROM cmx_proveedores ORDER BY id DESC LIMIT 1");
		$sql_proveedor->execute();
		$resultado_proveedor_id = $sql_proveedor->fetch(PDO::FETCH_ASSOC);
		$proveedor_id = $resultado_proveedor_id["PROVEEDOR_ID"];

		$sql = $this->_db3->prepare("INSERT INTO cmx_proveedor_contactos(id,id_proveedor,nombres_apellidos,cargo,telefono,celular,correo,inf_critica,referencias,hora,fecha,usuario)
			        	VALUES(null,:id_proveedor,:nombre,:cargo,:fijo,:celular,:correo,:critica,:refe,:hora_actual,:fecha_actual,:usuario)");
		$sql->bindParam(':id_proveedor', $proveedor_id, PDO::PARAM_STR);
		$sql->bindParam(':nombre', $datos['nombre'], PDO::PARAM_STR);
		$sql->bindParam(':cargo', $datos['cargo'], PDO::PARAM_STR);
		$sql->bindParam(':fijo', $datos['fijo'], PDO::PARAM_STR);
		$sql->bindParam(':celular', $datos['celular'], PDO::PARAM_STR);
		$sql->bindParam(':correo', $datos['correo'], PDO::PARAM_STR);
		$sql->bindParam(':critica', $datos['critica'], PDO::PARAM_STR);
		$sql->bindParam(':refe', $datos['refe'], PDO::PARAM_STR);
		$sql->bindParam(':hora_actual', $datos['hora_actual'], PDO::PARAM_STR);
		$sql->bindParam(':fecha_actual', $datos['fecha_actual'], PDO::PARAM_STR);
		$sql->bindParam(':usuario', $datos['user'], PDO::PARAM_STR);
		$resultado_proveedor = $sql->execute();
		if ($resultado_proveedor) {
			$response = true;
		} else {
			// Falla en la actualización, revertir la transacción
			$response = false;
		}
		return $response;
	}

	public function Cargar_Municipios()
	{
		$sql = $this->_db3->prepare("SELECT CONCAT(municipio ,' (',depto,' - ',pais,')') MUNICIPIO FROM cmx_municipios LIMIT 2000");
		$sql->execute();
		$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $resultado;
	}
	public function Obetener_Municipios($municipio)
	{
		$arrayMunicipio = explode(" (", $municipio);
		$municipio = $arrayMunicipio[0];
		$sql = $this->_db3->prepare("SELECT * FROM cmx_municipios WHERE municipio = '$municipio' LIMIT 1");
		$sql->execute();
		$resultado = $sql->fetch(PDO::FETCH_ASSOC);
		return $resultado;
	}
	public function Cosultar_Actividad_proveedor($proveedor)
	{
		$sql = $this->_db3->prepare("SELECT actividad as acti FROM cmx_actividad_proveedor WHERE id_proveedor=:id_proveedor");
		$sql->bindParam(':id_proveedor', $proveedor, PDO::PARAM_STR);
		$sql->execute();
		$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $resultado;
	}

	public function Cosultar_Datos_proveedor($proveedor)
	{
		$response = [];
		// Consulata General para los datos del proveedor
		$sql = $this->_db3->prepare("SELECT  p.numdoc_nexos as idp, p.*, c.id AS iddetalle, c.* , b.estado_proceso FROM  cmx_proveedores p
		LEFT JOIN cmx_detalle_conductor c ON  p.numdoc_nexos=c.id_proveedor
		LEFT JOIN cmx_estado_bloqueo b ON p.numdoc_nexos=b.id_objeto
		WHERE p.numdoc_nexos=:id_proveedor GROUP BY p.numdoc_nexos");
		$sql->bindParam(':id_proveedor', $proveedor, PDO::PARAM_STR);
		$sql->execute();
		$resultado_general = $sql->fetchAll(PDO::FETCH_ASSOC);

		// Consultar las actividades del proveedor para seleccionar el checkbox
		$sql_actividad = $this->_db3->prepare("SELECT actividad as acti FROM cmx_actividad_proveedor WHERE id_proveedor=:id_proveedor");
		$sql_actividad->bindParam(':id_proveedor', $proveedor, PDO::PARAM_STR);
		$sql_actividad->execute();
		$resultado_actividad = $sql_actividad->fetchAll(PDO::FETCH_ASSOC);

		//Consultar Los municipios
		$sql_municipios = $this->_db3->prepare("SELECT * FROM cmx_municipios WHERE estado_nacional='Activa'");
		$sql_municipios->execute();
		$resultado_municipios = $sql_municipios->fetchAll(PDO::FETCH_ASSOC);

		// Consultar las referencias si trae datos generales
		if ($resultado_general) {
			$sql_referencias = $this->_db3->prepare("SELECT ref.* FROM cmx_referencias_preestudio ref
			INNER JOIN cmx_proveedores pro ON ref.id_conductor=pro.numero_documento AND ref.estado=1
			WHERE pro.numdoc_nexos=:id_proveedor");
			$sql_referencias->bindParam(':id_proveedor', $proveedor, PDO::PARAM_STR);
			$sql_referencias->execute();
			$resultado_referencia = $sql_referencias->fetchAll(PDO::FETCH_ASSOC);
			// Referencias personales
			$sql_referencias_personales = $this->_db3->prepare("SELECT * FROM cmx_referencias_personales WHERE id_conductor=:id_proveedor AND estado=1");
			$sql_referencias_personales->bindParam(':id_proveedor', $proveedor, PDO::PARAM_STR);
			$sql_referencias_personales->execute();
			$resultado_referencias_personales = $sql_referencias_personales->fetchAll(PDO::FETCH_ASSOC);

			$sql6 = $this->_db3->prepare("SELECT * FROM cmx_proveedores_detalle WHERE id_proveedor = :id_proveedor");
			// $stmt6 = $pdo->prepare($sql6);
			$sql6->bindValue(':id_proveedor', $proveedor, PDO::PARAM_INT);
			$sql6->execute();
			$result6 = $sql6->fetchAll(PDO::FETCH_ASSOC);

			$sqlm = "SELECT * FROM cmx_municipios WHERE estado_nacional='Activa'";
			$stmt = $this->_db3->query($sqlm);
			$resultlocal = $stmt->fetchAll(PDO::FETCH_ASSOC);

			// var_dump($result6[0]);
			// exit(0);
			if ($result6 != null) {
				$localizacion = array();
				foreach ($resultlocal as $index => $element1) {
					if (strcasecmp($element1['id'], $result6[0]['cod_pais']) == 0) {
						$localizacion[$index]['selected'] = true;
					} else {
						$localizacion[$index]['selected'] = false;
					}
					$localizacion[$index]['munid'] = $element1['id'];
					$localizacion[$index]['munmun'] = $element1['municipio'];
					$localizacion[$index]['mundepto'] = $element1['depto'];
					$localizacion[$index]['munpais'] = $element1['pais'];
				}
				$result6[0]['id_municipio'] = $localizacion;

				$sql7 = $this->_db3->prepare("SELECT * FROM cmx_proveedor_contactos WHERE id_proveedor=:id_proveedor");
				$sql7->bindValue(':id_proveedor', $proveedor, PDO::PARAM_INT);
				$sql7->execute();
				$result_contacto_proveedor = $sql7->fetchAll(PDO::FETCH_ASSOC);
			} else {
				$result6 = '';
				$result_contacto_proveedor = '';
			}
		}

		$response = [
			"resultado" => $resultado_general,
			"resultado_actividad" => $resultado_actividad,
			"resultado_municipios" => $resultado_municipios,
			"resultado_referencia" => $resultado_referencia,
			"resultado_referencias_personales" => $resultado_referencias_personales,
			"result6" => $result6,
			"result_contacto_proveedor" => $result_contacto_proveedor
		];

		return $response;
	}

	public function Actualizar_proveedor($datos)
	{
		$response = []; // Inicializa la variable de respuesta
		// $id_usuario = $_SESSION["usuario"]["id_usuario"];
		$fecha_actual = date('Y-m-d');
		$hora_actual = date('H:i:s');
		$user = $_SESSION["usuario"]["nom_usuario"];

		try {
			$this->_db3->beginTransaction();

			$documento_soporte = "public/files/proveedores/" . $datos['numdoc_proveedor'] . "/";
			$sql = $this->_db3->prepare("UPDATE cmx_proveedores SET nombre=:nombre,apellido1=:apellido1,apellido2=:apellido2,abreviatura=:abreviatura,contacto=:telefono,celular=:celular,direccion=:direccion,email=:email,
			id_municipio=:municipio,rndc_categoria_licencia=:categoria,rndc_numero_licencia=:num_licencia,rndc_vencimiento_licencia=:vence_licencia,documentos_soporte=:documento_soporte
			WHERE numdoc_nexos=:id_proveedor");
			$sql->bindParam(':nombre', $datos['rndc_nombre2'], PDO::PARAM_STR);
			$sql->bindParam(':apellido1', $datos['apellido1'], PDO::PARAM_STR);
			$sql->bindParam(':apellido2', $datos['apellido2'], PDO::PARAM_STR);
			$sql->bindParam(':abreviatura', $datos['abreviatura'], PDO::PARAM_STR);
			$sql->bindParam(':telefono', $datos['contacto'], PDO::PARAM_STR);
			$sql->bindParam(':celular', $datos['celular'], PDO::PARAM_STR);
			$sql->bindParam(':direccion', $datos['direccion'], PDO::PARAM_STR);
			$sql->bindParam(':email', $datos['email'], PDO::PARAM_STR);
			$sql->bindParam(':municipio', $datos['municipio'], PDO::PARAM_STR);
			$sql->bindParam(':categoria', $datos['rndc_categoria_licencia'], PDO::PARAM_STR);
			$sql->bindParam(':num_licencia', $datos['rndc_numero_licencia'], PDO::PARAM_STR);
			$sql->bindParam(':vence_licencia', $datos['rndc_vencimiento_licencia'], PDO::PARAM_STR);
			$sql->bindParam(':documento_soporte', $documento_soporte, PDO::PARAM_STR);
			$sql->bindParam(':id_proveedor', $datos['numdoc_proveedor'], PDO::PARAM_STR);
			$resultado = $sql->execute();
			if ($resultado) {
				// $ruta = "public/files/proveedores/" . $datos['numdoc_proveedor'] . "/";
				// if (!is_dir($ruta)) {
				// 	mkdir($ruta, 0775, true);
				// }

				// if ($datos['documentos'] !== null) {
				// 	$aleatorio1 = rand(10000, 90000);
				// 	$aleatorio2 = rand(10000, 90000);
				// 	$nom1 = $datos['documentos']['name'];
				// 	$nombre = $datos['documentos']['name'];
				// 	$rutaTemporal = $datos['documentos']['tmp_name'];
				// 	$carpeta = $ruta;
				// 	$src = $carpeta . $nombre;
				// 	// Intenta mover el archivo subido
				// 	if (move_uploaded_file($rutaTemporal, $src)) {
				// 		chmod($src, 644);
				// 		// Si el archivo se movió correctamente, ejecuta la consulta SQL
				// 		$sqlce = "UPDATE cmx_proveedores SET documentos_soporte='public/files/proveedores/" . $datos['numdoc_proveedor'] . "/" . $nom1 . "'
				// 						WHERE id=" . $datos['numdoc_proveedor'];
				// 		$editese = $this->_db3->prepare($sqlce);
				// 		$result = $editese->execute();
				// 		if (!$result) {
				// 			$mensajeError = "Error al actualizar la base de datos para el proveedor con ID " . $datos['numdoc_proveedor'] . " a las " . date("Y-m-d H:i:s");
				// 			error_log($mensajeError . "\n", 3, "error_log.txt");
				// 		}
				// 	} else {
				// 		// Si el archivo no se pudo mover, registra un error
				// 		$mensajeError = "Error al mover el archivo para el proveedor con ID " . $datos['numdoc_proveedor'] . " a las " . date("Y-m-d H:i:s");
				// 		error_log($mensajeError . "\n", 3, "error_log.txt");
				// 		// throw new Exception("Error al subir el archivo.");
				// 	}
				// } else {
				// 	// Cuando no hay documentos para subir
				// 	$mensajeError = "No se han proporcionado documentos para subir para el proveedor con ID " . $datos['numdoc_proveedor'] . " a las " . date("Y-m-d H:i:s");
				// 	error_log($mensajeError . "\n", 3, "error_log.txt");
				// 	// throw new Exception("Error al guardar proveedor 1");
				// }


				$ruta = "public/files/proveedores/" . $datos['numdoc_proveedor'] . "/";

				if (!is_dir($ruta)) {
					mkdir($ruta, 0777, true);
				}

				if (!empty($datos['documentos']) && !empty($datos['documentos']['name'])) {
					// Generar nombre aleatorio para evitar duplicados
					$aleatorio1 = rand(10000, 90000);
					$aleatorio2 = rand(10000, 90000);

					// Nombre final del archivo (aleatorio + nombre original)
					$nombreFinal = $aleatorio1 . "_" . $aleatorio2 . "_" . basename($datos['documentos']['name']);

					$rutaTemporal = $datos['documentos']['tmp_name'];
					$destino = $ruta . $nombreFinal;

					// Mover archivo
					if (move_uploaded_file($rutaTemporal, $destino)) {
						chmod($destino, 0644); // Permisos seguros para lectura

						// Guardar ruta completa en la base de datos
						$rutaCompleta = "public/files/proveedores/" . $datos['numdoc_proveedor'] . "/" . $nombreFinal;

						$sqlce = "UPDATE cmx_proveedores 
                  SET documentos_soporte = :ruta
                  WHERE numdoc_nexos = :numdoc";  // Usar el campo correcto

						$editese = $this->_db3->prepare($sqlce);
						$editese->bindParam(':ruta', $rutaCompleta);
						$editese->bindParam(':numdoc', $datos['numdoc_proveedor']);
						$result = $editese->execute();

						if (!$result) {
							$mensajeError = "Error al actualizar la base de datos para el proveedor con ID " . $datos['numdoc_proveedor'] . " a las " . date("Y-m-d H:i:s");
							error_log($mensajeError . "\n", 3, "error_log.txt");
						}
					} else {
						$mensajeError = "Error al mover el archivo para el proveedor con ID " . $datos['numdoc_proveedor'] . " a las " . date("Y-m-d H:i:s");
						error_log($mensajeError . "\n", 3, "error_log.txt");
					}
				} else {
					$mensajeError = "No se han proporcionado documentos para subir para el proveedor con ID " . $datos['numdoc_proveedor'] . " a las " . date("Y-m-d H:i:s");
					error_log($mensajeError . "\n", 3, "error_log.txt");
				}
				// Actualizar detalles del condutor
				$sql2 = $this->_db3->prepare("UPDATE cmx_detalle_conductor SET celular2=:celular2,nombre_eps=:eps,fecha_vence_eps=:venceeps,ultimo_eps=:ultimo_eps,nombre_arl=:arl,fecha_vence_arl=:vencearl,
				ultimo_arl=:ultimo_arl,nombre_entidad=:nomenti,vence_curso=:vencecurso,sexo=:sexo,fecha_nacimiento=:fecha_nacimiento,grupo_sanguineo=:sangre,estado_civil=:civil,
				fecha_ingreso=:ingreso WHERE id_proveedor=:id_proveedor");
				$sql2->bindParam(':celular2', $datos['celular2'], PDO::PARAM_STR);
				$sql2->bindParam(':eps', $datos['nombre_eps'], PDO::PARAM_STR);
				$sql2->bindParam(':venceeps', $datos['fecha_vencimiento'], PDO::PARAM_STR);
				$sql2->bindParam(':ultimo_eps', $datos['ultimo_eps'], PDO::PARAM_STR);
				$sql2->bindParam(':arl', $datos['nombre_arl'], PDO::PARAM_STR);
				$sql2->bindParam(':vencearl', $datos['fecha_vencimiento_arl'], PDO::PARAM_STR);
				$sql2->bindParam(':ultimo_arl', $datos['ultimo_arl'], PDO::PARAM_STR);
				$sql2->bindParam(':nomenti', $datos['nombre_entidad'], PDO::PARAM_STR);
				$sql2->bindParam(':vencecurso', $datos['vence_curso'], PDO::PARAM_STR);
				$sql2->bindParam(':sexo', $datos['sexo'], PDO::PARAM_STR);
				$sql2->bindParam(':fecha_nacimiento', $datos['fecha_nace'], PDO::PARAM_STR);
				$sql2->bindParam(':sangre', $datos['sangre'], PDO::PARAM_STR);
				$sql2->bindParam(':civil', $datos['civil'], PDO::PARAM_STR);
				$sql2->bindParam(':ingreso', $datos['fecha_ingreso'], PDO::PARAM_STR);
				$sql2->bindParam(':id_proveedor', $datos['numdoc_proveedor'], PDO::PARAM_STR);
				$result = $sql2->execute();
				if ($result) {

					if ($datos['licencia'] !== null && $datos['licencia']['error'] === UPLOAD_ERR_OK) {
						$ruta_licencia = "public/files/proveedores/licencias/" . $datos['numdoc_proveedor'] . "/";
						if (!is_dir($ruta_licencia)) {
							mkdir($ruta_licencia, 0777, true);
							$nombre = $datos['licencia']['name'];
							$rutaTemporal = $datos['licencia']['tmp_name'];
							$carpeta = $ruta_licencia;
							$src = $carpeta . $nombre;
							// move_uploaded_file($rutaTemporal, $src);
							if (move_uploaded_file($rutaTemporal, $src)) {
								$ruta_licencias = "public/files/proveedores/licencias/" .  $datos['numdoc_proveedor'] . "/";
								$sqll =  $this->_db3->prepare("UPDATE cmx_proveedores SET subir_licencia ='$ruta_licencias', n_docu_licencia='" . $datos['name_doculice'] . "' WHERE numdoc_nexos = " .  $datos['numdoc_proveedor'] . "");
								$sqll->execute();
							} else {
								// Falla en la actualización
								$mensajeError = "Error al momento de subir el documento de la licencia. " . date("Y-m-d");
								error_log($mensajeError . "\n", 3, "error_log.txt");
								throw new Exception("Error al guardar proveedor");
							}
						} else {
							// Cuando la carpeta ya existe
							if ($datos['licencia'] !== null && $datos['licencia']['error'] === UPLOAD_ERR_OK) {
								$nombre = $datos['licencia']['name'];
								$rutaTemporal = $datos['licencia']['tmp_name'];
								$carpeta = $ruta_licencia;
								$src = $carpeta . $nombre;
								// move_uploaded_file($rutaTemporal, $src);
								if (move_uploaded_file($rutaTemporal, $src)) {
									$ruta_licencias = "public/files/proveedores/licencias/" .  $datos['numdoc_proveedor'] . "/";
									$sqll =  $this->_db3->prepare("UPDATE cmx_proveedores SET subir_licencia ='$ruta_licencias', n_docu_licencia='" . $datos['name_doculice'] . "' WHERE numdoc_nexos = " .  $datos['numdoc_proveedor'] . "");
									$sqll->execute();
								} else {
									// Falla en la actualización
									$mensajeError = "Error al momento de subir el documento de la licencia. " . date("Y-m-d H:i:s");
									error_log($mensajeError . "\n", 3, "error_log.txt");
									throw new Exception("Error al guardar proveedor");
								}
							} else {
								// Cuando no hay documentos para subir
								$mensajeError = "La carpeta de destino ya existe." . date("Y-m-d H:i:s");
								error_log($mensajeError . "\n", 3, "error_log.txt");
							}
						}
					} else {
						// Cuando no hay documentos para subir
						$mensajeError = "No se han proporcionado documentos para subir. " . date("Y-m-d H:i:s");
						error_log($mensajeError . "\n", 3, "error_log.txt");
						// throw new Exception("Error al guardar proveedor 1");
					}

					// Insertar las fotos del conductor cuando se vallan a actualizar
					if ($datos['docu_eps'] !== null && $datos['docu_eps']['error'] === UPLOAD_ERR_OK) {
						$ruta_eps = "public/files/proveedores/eps/" . $datos['numdoc_proveedor'] . "/";
						if (!is_dir($ruta_eps)) {
							mkdir($ruta_eps, 0777, true);
							$nombre = $datos['docu_eps']['name'];
							$rutaTemporal = $datos['docu_eps']['tmp_name'];
							$carpeta = $ruta_eps;
							$src = $carpeta . $nombre;
							// move_uploaded_file($rutaTemporal, $src);
							if (move_uploaded_file($rutaTemporal, $src)) {
								$ruta_eps = "public/files/proveedores/eps/" .  $datos['numdoc_proveedor'] . "/";
								$sqll =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET documento_eps ='$ruta_eps', n_docu_eps='" . $datos['namedocu_eps'] . "',fecha_vence_eps='" . $datos['vence_eps'] . "' WHERE id_proveedor = " .  $datos['numdoc_proveedor'] . "");
								$sqll->execute();
							} else {
								$mensajeError = "Error al momento de subir el documento de la eps. " . date("Y-m-d H:i:s");
								error_log($mensajeError . "\n", 3, "error_log.txt");
								throw new Exception("Error al guardar proveedor");
							}
						} else {
							// Cuando la carpeta ya existe
							if ($datos['docu_eps'] !== null && $datos['docu_eps']['error'] === UPLOAD_ERR_OK) {
								$nombre = $datos['docu_eps']['name'];
								$rutaTemporal = $datos['docu_eps']['tmp_name'];
								$carpeta = $ruta_eps;
								$src = $carpeta . $nombre;
								// move_uploaded_file($rutaTemporal, $src);
								if (move_uploaded_file($rutaTemporal, $src)) {
									$ruta_eps = "public/files/proveedores/eps/" .  $datos['numdoc_proveedor'] . "/";
									$sqll =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET documento_eps ='$ruta_eps', n_docu_eps='" . $datos['namedocu_eps'] . "',fecha_vence_eps='" . $datos['vence_eps'] . "' WHERE id_proveedor = " .  $datos['numdoc_proveedor'] . "");
									$sqll->execute();
								} else {
									$mensajeError = "Error al momento de subir el documento de la eps. " . date("Y-m-d H:i:s");
									error_log($mensajeError . "\n", 3, "error_log.txt");
									throw new Exception("Error al guardar proveedor");
								}
							} else {
								// Cuando no hay documentos para subir
								$mensajeError = "La carpeta de destino ya existe." . date("Y-m-d H:i:s");
								error_log($mensajeError . "\n", 3, "error_log.txt");
							}
						}
					} else {
						// Cuando no hay documentos para subir
						$mensajeError = "No se han proporcionado documentos para subir. " . date("Y-m-d");
						error_log($mensajeError . "\n", 3, "error_log.txt");
					}

					if ($datos['docu_curso'] !== null && $datos['docu_curso']['error'] === UPLOAD_ERR_OK) {
						$ruta_curso = "public/files/proveedores/curso/" . $datos['numdoc_proveedor'] . "/";
						if (!is_dir($ruta_curso)) {
							mkdir($ruta_curso, 0777, true);

							$nombre = $datos['docu_curso']['name'];
							$rutaTemporal = $datos['docu_curso']['tmp_name'];
							$carpeta = $ruta_curso;
							$src = $carpeta . $nombre;
							// move_uploaded_file($rutaTemporal, $src);
							if (move_uploaded_file($rutaTemporal, $src)) {
								$sqll =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET carnet_curso ='$ruta_curso', n_docu_curso='" . $datos['namedocu_curso'] . "',vence_curso='" . $datos['vence_curso'] . "' WHERE id_proveedor = " .  $datos['numdoc_proveedor'] . "");
								$sqll->execute();
							} else {
								$mensajeError = "Error al momento de subir el documento del curso. " . date("Y-m-d H:i:s");
								error_log($mensajeError . "\n", 3, "error_log.txt");
								throw new Exception("Error al guardar proveedor");
							}
						} else {
							// Cuando la carpeta ya existe
							if ($datos['docu_curso'] !== null && $datos['docu_curso']['error'] === UPLOAD_ERR_OK) {
								$ruta_curso = "public/files/proveedores/curso/" . $datos['numdoc_proveedor'] . "/";
								$sqll =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET carnet_curso ='$ruta_curso', n_docu_curso='" . $datos['namedocu_curso'] . "',vence_curso='" . $datos['vence_curso'] . "' WHERE id_proveedor = " .  $datos['numdoc_proveedor'] . "");
								$sqll->execute();
								$nombre = $datos['docu_curso']['name'];
								$rutaTemporal = $datos['docu_curso']['tmp_name'];
								$carpeta = $ruta_curso;
								$src = $carpeta . $nombre;
								// move_uploaded_file($rutaTemporal, $src);
								if (move_uploaded_file($rutaTemporal, $src)) {
									$sqll =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET carnet_curso ='$ruta_curso', n_docu_curso='" . $datos['namedocu_curso'] . "',vence_curso='" . $datos['vence_curso'] . "' WHERE id_proveedor = " .  $datos['numdoc_proveedor'] . "");
									$sqll->execute();
								} else {
									$mensajeError = "Error al momento de subir el documento del curso. " . date("Y-m-d H:i:s");
									error_log($mensajeError . "\n", 3, "error_log.txt");
									throw new Exception("Error al guardar proveedor");
								}
							} else {
								// Cuando no hay documentos para subir
								$mensajeError = "La carpeta de destino ya existe." . date("Y-m-d H:i:s");
								error_log($mensajeError . "\n", 3, "error_log.txt");
							}
						}
					} else {
						// Cuando no hay documentos para subir
						$mensajeError = "No se han proporcionado documentos para subir." . date("Y-m-d H:i:s");
						error_log($mensajeError . "\n", 3, "error_log.txt");
					}

					if ($datos['rut'] !== null && $datos['rut']['error'] === UPLOAD_ERR_OK) {
						$ruta_rut = "public/files/proveedores/rut/" . $datos['numdoc_proveedor'] . "/";
						if (!is_dir($ruta_rut)) {
							mkdir($ruta_rut, 0777, true);
							$ruta_rut = "public/files/proveedores/rut/" .  $datos['numdoc_proveedor'] . "/";
							$nombre = $datos['rut']['name'];
							$rutaTemporal = $datos['rut']['tmp_name'];
							$carpeta = $ruta_rut;
							$src = $carpeta . $nombre;
							// move_uploaded_file($rutaTemporal, $src);
							if (move_uploaded_file($rutaTemporal, $src)) {
								$sqll =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET documento_rut ='$ruta_rut', n_docu_rut='" . $datos['name_docurut'] . "' WHERE id_proveedor = " .  $datos['numdoc_proveedor'] . "");
								$sqll->execute();
							} else {
								$mensajeError = "Error al momento de subir el documento del rut. " . date("Y-m-d H:i:s");
								error_log($mensajeError . "\n", 3, "error_log.txt");
								throw new Exception("Error al guardar proveedor");
							}
						} else {
							// Cuando la carpeta ya existe
							if ($datos['rut'] !== null && $datos['rut']['error'] === UPLOAD_ERR_OK) {
								$ruta_rut = "public/files/proveedores/rut/" .  $datos['numdoc_proveedor'] . "/";
								$sqll =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET documento_rut ='$ruta_rut', n_docu_rut='" . $datos['name_docurut'] . "' WHERE id_proveedor = " .  $datos['numdoc_proveedor'] . "");
								$sqll->execute();
								$nombre = $datos['rut']['name'];
								$rutaTemporal = $datos['rut']['tmp_name'];
								$carpeta = $ruta_rut;
								$src = $carpeta . $nombre;
								// move_uploaded_file($rutaTemporal, $src);
								if (move_uploaded_file($rutaTemporal, $src)) {
									$sqll =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET documento_rut ='$ruta_rut', n_docu_rut='" . $datos['name_docurut'] . "' WHERE id_proveedor = " .  $datos['numdoc_proveedor'] . "");
									$sqll->execute();
								} else {
									$mensajeError = "Error al momento de subir el documento del rut. " . date("Y-m-d H:i:s");
									error_log($mensajeError . "\n", 3, "error_log.txt");
									throw new Exception("Error al guardar proveedor");
								}
							} else {
								// Cuando no hay documentos para subir
								$mensajeError = "La carpeta de destino ya existe." . date("Y-m-d H:i:s");
								error_log($mensajeError . "\n", 3, "error_log.txt");
							}
						}
					} else {
						// Cuando no hay documentos para subir
						$mensajeError = "No se han proporcionado documentos para subir." . date("Y-m-d H:i:s");
						error_log($mensajeError . "\n", 3, "error_log.txt");
					}

					if ($datos['foto_indume'] !== null && $datos['foto_indume']['error'] === UPLOAD_ERR_OK) {
						$ruta_indumentaria = "public/files/proveedores/indumentaria/" . $datos['numdoc_proveedor'] . "/";
						if (!is_dir($ruta_indumentaria)) {
							mkdir($ruta_indumentaria, 0777, true);
							$ruta_indumentaria = "public/files/proveedores/indumentaria/" .  $datos['numdoc_proveedor'] . "/";
							$nombre = $datos['foto_indume']['name'];
							$rutaTemporal = $datos['foto_indume']['tmp_name'];
							$carpeta = $ruta_indumentaria;
							$src = $carpeta . $nombre;
							// move_uploaded_file($rutaTemporal, $src);
							if (move_uploaded_file($rutaTemporal, $src)) {
								$sqll =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET foto_indumentaria ='$ruta_indumentaria', name_cindu='" . $datos['name_indum'] . "' WHERE id_proveedor = " .  $datos['numdoc_proveedor'] . "");
								$sqll->execute();
							} else {
								$mensajeError = "Error al momento de subir la fotografía de indumentaria. " . date("Y-m-d H:i:s");
								error_log($mensajeError . "\n", 3, "error_log.txt");
								throw new Exception("Error al guardar proveedor");
							}
						} else {
							// Cuando la carpeta ya existe
							if ($datos['foto_indume'] !== null && $datos['foto_indume']['error'] === UPLOAD_ERR_OK) {
								$ruta_indumentaria = "public/files/proveedores/indumentaria/" .  $datos['numdoc_proveedor'] . "/";
								$nombre = $datos['foto_indume']['name'];
								$rutaTemporal = $datos['foto_indume']['tmp_name'];
								$carpeta = $ruta_indumentaria;
								$src = $carpeta . $nombre;
								// move_uploaded_file($rutaTemporal, $src);
								if (move_uploaded_file($rutaTemporal, $src)) {
									$sqll =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET foto_indumentaria ='$ruta_indumentaria', name_cindu='" . $datos['name_indum'] . "' WHERE id_proveedor = " .  $datos['numdoc_proveedor'] . "");
									$sqll->execute();
								} else {
									$mensajeError = "Error al momento de subir la fotografía de indumentaria. " . date("Y-m-d H:i:s");
									error_log($mensajeError . "\n", 3, "error_log.txt");
									throw new Exception("Error al guardar proveedor");
								}
							} else {
								// Cuando no hay documentos para subir
								$mensajeError = "La carpeta de destino ya existe." . date("Y-m-d H:i:s");
								error_log($mensajeError . "\n", 3, "error_log.txt");
							}
						}
					} else {
						// Cuando no hay documentos para subir
						$mensajeError = "No se han proporcionado documentos para subir." . date("Y-m-d H:i:s");
						error_log($mensajeError . "\n", 3, "error_log.txt");
					}

					if ($datos['foto_conductor'] !== null && $datos['foto_conductor']['error'] === UPLOAD_ERR_OK) {
						// Fotos de los conductores
						$ruta_frontal = "public/files/proveedores/fotos/" . $datos['numdoc_proveedor'] . "/F/";
						if (!is_dir($ruta_frontal)) {
							mkdir($ruta_frontal, 0777, true);
							$ruta_frontal = "public/files/proveedores/fotos/" .  $datos['numdoc_proveedor'] .  "/F/";
							// $sqll =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET foto_conductor ='$ruta_frontal', name_cfrontal='" . $datos['name_fontall'] . "' WHERE id_proveedor = " .  $datos['numdoc_proveedor'] . "");
							// $sqll->execute();
							$nombre = $datos['foto_conductor']['name'];
							$rutaTemporal = $datos['foto_conductor']['tmp_name'];
							$carpeta = $ruta_frontal;
							$src = $carpeta . $nombre;
							// move_uploaded_file($rutaTemporal, $src);
							if (move_uploaded_file($rutaTemporal, $src)) {
								$sqll =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET foto_conductor ='$ruta_frontal', name_cfrontal='" . $datos['name_fontall'] . "' WHERE id_proveedor = " .  $datos['numdoc_proveedor'] . "");
								$sqll->execute();
							} else {
								$mensajeError = "Error al momento de subir la fotografía del conductor frontal. " . date("Y-m-d H:i:s");
								error_log($mensajeError . "\n", 3, "error_log.txt");
								throw new Exception("Error al guardar proveedor");
							}
						} else {
							// Cuando la carpeta ya existe
							if ($datos['foto_conductor'] !== null && $datos['foto_conductor']['error'] === UPLOAD_ERR_OK) {
								$ruta_frontal = "public/files/proveedores/fotos/" .  $datos['numdoc_proveedor'] .  "/F/";
								$nombre = $datos['foto_conductor']['name'];
								$rutaTemporal = $datos['foto_conductor']['tmp_name'];
								$carpeta = $ruta_frontal;
								$src = $carpeta . $nombre;
								// move_uploaded_file($rutaTemporal, $src);
								if (move_uploaded_file($rutaTemporal, $src)) {
									// Cuando hay documentos para subir
									$sqll =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET foto_conductor ='$ruta_frontal', name_cfrontal='" . $datos['name_fontall'] . "' WHERE id_proveedor = " .  $datos['numdoc_proveedor'] . "");
									$sqll->execute();
								} else {
									$mensajeError = "Error al momento de subir la fotografía del conductor frontal. " . date("Y-m-d H:i:s");
									error_log($mensajeError . "\n", 3, "error_log.txt");
									throw new Exception("Error al guardar proveedor");
								}
							} else {
								// Cuando no hay documentos para subir
								$mensajeError = "La carpeta de destino ya existe." . date("Y-m-d H:i:s");
								error_log($mensajeError . "\n", 3, "error_log.txt");
							}
						}
					} else {
						$mensajeError = "No se han proporcionado documentos para subir." . date("Y-m-d H:i:s");
						error_log($mensajeError . "\n", 3, "error_log.txt");
					}

					if ($datos['foto_derecha'] !== null && $datos['foto_derecha']['error'] === UPLOAD_ERR_OK) {
						$ruta_derecha = "public/files/proveedores/fotos/" . $datos['numdoc_proveedor'] . "/D/";
						if (!is_dir($ruta_derecha)) {
							mkdir($ruta_derecha, 0777, true);
							$ruta_derecha = "public/files/proveedores/fotos/" .  $datos['numdoc_proveedor'] .  "/D/";
							$nombre = $datos['foto_derecha']['name'];
							$rutaTemporal = $datos['foto_derecha']['tmp_name'];
							$carpeta = $ruta_derecha;
							$src = $carpeta . $nombre;
							// move_uploaded_file($rutaTemporal, $src);
							if (move_uploaded_file($rutaTemporal, $src)) {
								$sqll =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET foto_derecha ='$ruta_derecha', name_cderecha='" . $datos['name_derecha'] . "' WHERE id_proveedor = " .  $datos['numdoc_proveedor'] . "");
								$sqll->execute();
							} else {
								$mensajeError = "Error al momento de subir la fotografía del conductor derecha. " . date("Y-m-d H:i:s");
								error_log($mensajeError . "\n", 3, "error_log.txt");
								throw new Exception("Error al guardar proveedor");
							}
						} else {
							// Cuando la carpeta ya existe
							if ($datos['foto_derecha'] !== null && $datos['foto_derecha']['error'] === UPLOAD_ERR_OK) {
								$ruta_derecha = "public/files/proveedores/fotos/" .  $datos['numdoc_proveedor'] .  "/D/";

								$nombre = $datos['foto_derecha']['name'];
								$rutaTemporal = $datos['foto_derecha']['tmp_name'];
								$carpeta = $ruta_derecha;
								$src = $carpeta . $nombre;
								// move_uploaded_file($rutaTemporal, $src);
								if (move_uploaded_file($rutaTemporal, $src)) {
									// Cuando hay documentos para subir
									$sqll =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET foto_derecha ='$ruta_derecha', name_cderecha='" . $datos['name_derecha'] . "' WHERE id_proveedor = " .  $datos['numdoc_proveedor'] . "");
									$sqll->execute();
								} else {
									$mensajeError = "Error al momento de subir la fotografía del conductor derecha. " . date("Y-m-d H:i:s");
									error_log($mensajeError . "\n", 3, "error_log.txt");
									throw new Exception("Error al guardar proveedor");
								}
							} else {
								// Cuando no hay documentos para subir
								$mensajeError = "La carpeta de destino ya existe." . date("Y-m-d H:i:s");
								error_log($mensajeError . "\n", 3, "error_log.txt");
							}
						}
					} else {
						$mensajeError = "No se han proporcionado documentos para subir." . date("Y-m-d H:i:s");
						error_log($mensajeError . "\n", 3, "error_log.txt");
					}

					if ($datos['foto_izquierda'] !== null && $datos['foto_izquierda']['error'] === UPLOAD_ERR_OK) {
						$ruta_izquierda = "public/files/proveedores/fotos/" . $datos['numdoc_proveedor'] . "/I/";
						if (!is_dir($ruta_izquierda)) {
							mkdir($ruta_izquierda, 0777, true);
							$ruta_izquierda = "public/files/proveedores/fotos/" .  $datos['numdoc_proveedor'] .  "/I/";
							$nombre = $datos['foto_izquierda']['name'];
							$rutaTemporal = $datos['foto_izquierda']['tmp_name'];
							$carpeta = $ruta_izquierda;
							$src = $carpeta . $nombre;
							// move_uploaded_file($rutaTemporal, $src);
							if (move_uploaded_file($rutaTemporal, $src)) {
								// Cuando hay documentos para subir
								$sqll =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET foto_izquierda ='$ruta_izquierda', name_cizquierda='" . $datos['name_izquierda'] . "' WHERE id_proveedor = " .  $datos['numdoc_proveedor'] . "");
								$sqll->execute();
							} else {
								$mensajeError = "Error al momento de subir la fotografía del conductor izquierda. " . date("Y-m-d H:i:s");
								error_log($mensajeError . "\n", 3, "error_log.txt");
								throw new Exception("Error al guardar proveedor");
							}
						} else {
							// Cuando la carpeta ya existe
							if ($datos['foto_izquierda'] !== null && $datos['foto_izquierda']['error'] === UPLOAD_ERR_OK) {
								$ruta_izquierda = "public/files/proveedores/fotos/" .  $datos['numdoc_proveedor'] .  "/I/";

								$nombre = $datos['foto_izquierda']['name'];
								$rutaTemporal = $datos['foto_izquierda']['tmp_name'];
								$carpeta = $ruta_izquierda;
								$src = $carpeta . $nombre;
								// move_uploaded_file($rutaTemporal, $src);
								if (move_uploaded_file($rutaTemporal, $src)) {
									// Cuando hay documentos para subir
									$sqll =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET foto_izquierda ='$ruta_izquierda', name_cizquierda='" . $datos['name_izquierda'] . "' WHERE id_proveedor = " .  $datos['numdoc_proveedor'] . "");
									$sqll->execute();
								} else {
									$mensajeError = "Error al momento de subir la fotografía del conductor izquierda. " . date("Y-m-d H:i:s");
									error_log($mensajeError . "\n", 3, "error_log.txt");
									throw new Exception("Error al guardar proveedor");
								}
							} else {
								// Cuando no hay documentos para subir
								$mensajeError = "La carpeta de destino ya existe." . date("Y-m-d H:i:s");
								error_log($mensajeError . "\n", 3, "error_log.txt");
							}
						}
					} else {
						$mensajeError = "No se han proporcionado documentos para subir." . date("Y-m-d H:i:s");
						error_log($mensajeError . "\n", 3, "error_log.txt");
					}

					if ($datos['acuerdo_uno'] !== null && $datos['acuerdo_uno']['error'] === UPLOAD_ERR_OK) {
						$ruta_acuerdo = "public/files/proveedores/acuerdo/" . $datos['numdoc_proveedor'] . "/AC1/";
						if (!is_dir($ruta_acuerdo)) {
							mkdir($ruta_acuerdo, 0777, true);
							$nombre = $datos['acuerdo_uno']['name'];
							$rutaTemporal = $datos['acuerdo_uno']['tmp_name'];
							$carpeta = $ruta_acuerdo;
							$src = $carpeta . $nombre;
							// move_uploaded_file($rutaTemporal, $src);
							if (move_uploaded_file($rutaTemporal, $src)) {
								// Cuando hay documentos para subir
								$sqll =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET foto_acuerdo1 ='$ruta_acuerdo', name_acuerdo1='" . $datos['name_a1'] . "' WHERE id_proveedor = " .  $datos['numdoc_proveedor'] . "");
								$sqll->execute();
							} else {
								$mensajeError = "Error al momento de subir el acuerdo uno. " . date("Y-m-d H:i:s");
								error_log($mensajeError . "\n", 3, "error_log.txt");
								throw new Exception("Error al guardar proveedor");
							}
						} else {
							// Cuando la carpeta ya existe
							if ($datos['acuerdo_uno'] !== null && $datos['acuerdo_uno']['error'] === UPLOAD_ERR_OK) {
								$ruta_acuerdo = "public/files/proveedores/acuerdo/" . $datos['numdoc_proveedor'] . "/AC1/";
								$nombre = $datos['acuerdo_uno']['name'];
								$rutaTemporal = $datos['acuerdo_uno']['tmp_name'];
								$carpeta = $ruta_acuerdo;
								$src = $carpeta . $nombre;
								// move_uploaded_file($rutaTemporal, $src);
								if (move_uploaded_file($rutaTemporal, $src)) {
									// Cuando hay documentos para subir
									$sqll =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET foto_acuerdo1 ='$ruta_acuerdo', name_acuerdo1='" . $datos['name_a1'] . "' WHERE id_proveedor = " .  $datos['numdoc_proveedor'] . "");
									$sqll->execute();
								} else {
									$mensajeError = "Error al momento de subir el acuerdo uno. " . date("Y-m-d H:i:s");
									error_log($mensajeError . "\n", 3, "error_log.txt");
									throw new Exception("Error al guardar proveedor");
								}
							} else {
								// Cuando no hay documentos para subir
								$mensajeError = "La carpeta de destino ya existe." . date("Y-m-d H:i:s");
								error_log($mensajeError . "\n", 3, "error_log.txt");
							}
						}
					} else {
						$mensajeError = "No se han proporcionado documentos para subir." . date("Y-m-d H:i:s");
						error_log($mensajeError . "\n", 3, "error_log.txt");
					}

					// Actualziar las referencias personales
					$sql_ref1 = $this->_db3->prepare("UPDATE cmx_referencias_preestudio SET nombre_empresa=:referencias_empresariales,fecha_ingreso=:fecha_referencia, fecha_retiro=:fecha_retiro, 
					persona_contacto=:contacto_ref, celular=:celular_ref, cargo=:cargo_ref, antiguedad=:anti_ref, fecha=:fecha, hora=:hora, usuario=:usuario WHERE id_conductor=:id_proveedor AND id=:eid");
					$sql_ref1->bindParam(':referencias_empresariales', $datos['referencias_empresariales1'], PDO::PARAM_STR);
					$sql_ref1->bindParam(':fecha_referencia', $datos['fecha_referencia1'], PDO::PARAM_STR);
					$sql_ref1->bindParam(':fecha_retiro', $datos['fecha_retiro1'], PDO::PARAM_STR);
					$sql_ref1->bindParam(':contacto_ref', $datos['contacto_ref1'], PDO::PARAM_STR);
					$sql_ref1->bindParam(':celular_ref', $datos['celular_ref1'], PDO::PARAM_STR);
					$sql_ref1->bindParam(':cargo_ref', $datos['cargo_ref1'], PDO::PARAM_STR);
					$sql_ref1->bindParam(':anti_ref', $datos['anti_ref1'], PDO::PARAM_STR);
					$sql_ref1->bindParam(':fecha', $fecha_actual, PDO::PARAM_STR);
					$sql_ref1->bindParam(':hora', $hora_actual, PDO::PARAM_STR);
					$sql_ref1->bindParam(':usuario', $user, PDO::PARAM_STR);
					$sql_ref1->bindParam(':id_proveedor', $datos['numero_documento'], PDO::PARAM_STR);
					$sql_ref1->bindParam(':eid', $datos['idp1'], PDO::PARAM_STR);
					$sql_ref1->execute();
					// if ($resultado_ref1) {
					// } else {
					// 	$mensajeError = "Error al actualziar la referencia 1 del proveedor." . date("Y-m-d H:i:s");
					// 	error_log($mensajeError . "\n", 3, "error_log.txt");
					// }

					$sql_ref2 = $this->_db3->prepare("UPDATE cmx_referencias_preestudio SET nombre_empresa=:referencias_empresariales,fecha_ingreso=:fecha_referencia, fecha_retiro=:fecha_retiro, 
						persona_contacto=:contacto_ref, celular=:celular_ref, cargo=:cargo_ref, antiguedad=:anti_ref, fecha=:fecha, hora=:hora, usuario=:usuario WHERE id_conductor=:id_proveedor AND id=:eid");
					$sql_ref2->bindParam(':referencias_empresariales', $datos['referencias_empresariales2'], PDO::PARAM_STR);
					$sql_ref2->bindParam(':fecha_referencia', $datos['fecha_referencia2'], PDO::PARAM_STR);
					$sql_ref2->bindParam(':fecha_retiro', $datos['fecha_retiro2'], PDO::PARAM_STR);
					$sql_ref2->bindParam(':contacto_ref', $datos['contacto_ref2'], PDO::PARAM_STR);
					$sql_ref2->bindParam(':celular_ref', $datos['celular_ref2'], PDO::PARAM_STR);
					$sql_ref2->bindParam(':cargo_ref', $datos['cargo_ref2'], PDO::PARAM_STR);
					$sql_ref2->bindParam(':anti_ref', $datos['anti_ref2'], PDO::PARAM_STR);
					$sql_ref2->bindParam(':fecha', $fecha_actual, PDO::PARAM_STR);
					$sql_ref2->bindParam(':hora', $hora_actual, PDO::PARAM_STR);
					$sql_ref2->bindParam(':usuario', $user, PDO::PARAM_STR);
					$sql_ref2->bindParam(':id_proveedor', $datos['numero_documento'], PDO::PARAM_STR);
					$sql_ref2->bindParam(':eid', $datos['idp2'], PDO::PARAM_STR);
					$sql_ref2->execute();
					// if ($resultado_ref2) {
					// } else {
					// 	$mensajeError = "Error al actualziar la referencia 2 del proveedor." . date("Y-m-d H:i:s");
					// 	error_log($mensajeError . "\n", 3, "error_log.txt");
					// }

					$sql_ref3 = $this->_db3->prepare("UPDATE cmx_referencias_preestudio SET nombre_empresa=:referencias_empresariales,fecha_ingreso=:fecha_referencia, fecha_retiro=:fecha_retiro, 
							persona_contacto=:contacto_ref, celular=:celular_ref, cargo=:cargo_ref, antiguedad=:anti_ref, fecha=:fecha, hora=:hora, usuario=:usuario WHERE id_conductor=:id_proveedor AND id=:eid");
					$sql_ref3->bindParam(':referencias_empresariales', $datos['referencias_empresariales3'], PDO::PARAM_STR);
					$sql_ref3->bindParam(':fecha_referencia', $datos['fecha_referencia3'], PDO::PARAM_STR);
					$sql_ref3->bindParam(':fecha_retiro', $datos['fecha_retiro3'], PDO::PARAM_STR);
					$sql_ref3->bindParam(':contacto_ref', $datos['contacto_ref3'], PDO::PARAM_STR);
					$sql_ref3->bindParam(':celular_ref', $datos['celular_ref3'], PDO::PARAM_STR);
					$sql_ref3->bindParam(':cargo_ref', $datos['cargo_ref3'], PDO::PARAM_STR);
					$sql_ref3->bindParam(':anti_ref', $datos['anti_ref3'], PDO::PARAM_STR);
					$sql_ref3->bindParam(':fecha', $fecha_actual, PDO::PARAM_STR);
					$sql_ref3->bindParam(':hora', $hora_actual, PDO::PARAM_STR);
					$sql_ref3->bindParam(':usuario', $user, PDO::PARAM_STR);
					$sql_ref3->bindParam(':id_proveedor', $datos['numero_documento'], PDO::PARAM_STR);
					$sql_ref3->bindParam(':eid', $datos['idp3'], PDO::PARAM_STR);
					$sql_ref3->execute();
					// if ($resultado_ref3) {
					// } else {
					// 	// return false;
					// 	$mensajeError = "Error al actualziar la referencia 3 del proveedor." . date("Y-m-d H:i:s");
					// 	error_log($mensajeError . "\n", 3, "error_log.txt");
					// }

					$sql_refp1 = $this->_db3->prepare("UPDATE cmx_referencias_personales SET nombre_personal=:refep, fecha_personal=:fechap, parentezco=:parenp, tel_personal=:telefonop, usuario=:usuario, 
								fecha=:fecha, hora=:hora WHERE id=:idp AND id_conductor=:id_proveedor");
					$sql_refp1->bindParam(':refep', $datos['referencias_personales'], PDO::PARAM_STR);
					$sql_refp1->bindParam(':fechap', $datos['fecha_personal1'], PDO::PARAM_STR);
					$sql_refp1->bindParam(':parenp', $datos['parenp1'], PDO::PARAM_STR);
					$sql_refp1->bindParam(':telefonop', $datos['telefonop1'], PDO::PARAM_STR);
					$sql_refp1->bindParam(':usuario', $user, PDO::PARAM_STR);
					$sql_refp1->bindParam(':fecha', $fecha_actual, PDO::PARAM_STR);
					$sql_refp1->bindParam(':hora', $hora_actual, PDO::PARAM_STR);
					$sql_refp1->bindParam(':idp', $datos['ref_id1'], PDO::PARAM_STR);
					$sql_refp1->bindParam(':id_proveedor', $datos['numdoc_proveedor'], PDO::PARAM_STR);
					$sql_refp1->execute();
					// if ($result_refp1) {
					// } else {
					// 	$mensajeError = "Error al actualziar la referencia personal 1 del proveedor." . date("Y-m-d H:i:s");
					// 	error_log($mensajeError . "\n", 3, "error_log.txt");
					// }
					// return true;
					$sql_refp2 = $this->_db3->prepare("UPDATE cmx_referencias_personales SET nombre_personal=:refep, fecha_personal=:fechap, parentezco=:parenp, tel_personal=:telefonop, usuario=:usuario, 
									fecha=:fecha, hora=:hora WHERE id=:idp AND id_conductor=:id_proveedor");
					$sql_refp2->bindParam(':refep', $datos['referencias_personales2'], PDO::PARAM_STR);
					$sql_refp2->bindParam(':fechap', $datos['fecha_personal2'], PDO::PARAM_STR);
					$sql_refp2->bindParam(':parenp', $datos['parenp2'], PDO::PARAM_STR);
					$sql_refp2->bindParam(':telefonop', $datos['telefonop2'], PDO::PARAM_STR);
					$sql_refp2->bindParam(':usuario', $user, PDO::PARAM_STR);
					$sql_refp2->bindParam(':fecha', $fecha_actual, PDO::PARAM_STR);
					$sql_refp2->bindParam(':hora', $hora_actual, PDO::PARAM_STR);
					$sql_refp2->bindParam(':idp', $datos['ref_id2'], PDO::PARAM_STR);
					$sql_refp2->bindParam(':id_proveedor', $datos['numdoc_proveedor'], PDO::PARAM_STR);
					$result_refp2 = $sql_refp2->execute();
					// if ($result_refp2) {
					// 	// $response = true;
					// } else {
					// 	// $response = false;
					// 	$response = ['success' => false, 'message' => 'Datos del proveedor no actualizados correctamente en NEXOSAPP.'];
					// 	$mensajeError = "Error al actualziar la referencia personal 2 del proveedor." . date("Y-m-d H:i:s");
					// 	error_log($mensajeError . "\n", 3, "error_log.txt");
					// }
					$this->_db3->commit();
					$response = ['success' => true, 'message' => 'Se actualizaron datos correctamente en NEXOSAPP.'];
				} else {
					$mensajeError = "Error al actualziar los detalles del conductor." . date("Y-m-d H:i:s");
					error_log($mensajeError . "\n", 3, "error_log.txt");
					// return false;
				}
			} else {
				$mensajeError = "Error al actualziar la tabla de proveedores." . date("Y-m-d H:i:s");
				error_log($mensajeError . "\n", 3, "error_log.txt");
			}
		} catch (\Throwable $th) {
			// Algo salió mal, se hace rollback
			$this->_db3->rollBack();
			// Registrar el error en un archivo de log en la raíz del proyecto
			$errorMessage = "Error en la transacción al insertar conductor: " . $th->getMessage() . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
			$logFilePath = 'error_log.txt'; // Ajusta la ruta según la estructura de tu proyecto
			error_log($errorMessage, 3, $logFilePath);

			// Verificar si el archivo de log se ha escrito correctamente
			if (!file_exists($logFilePath)) {
				error_log("No se pudo crear el archivo de log: $logFilePath\n", 3, $logFilePath);
			}

			// Mostrar un mensaje amigable al usuario
			$response = ['success' => false, 'message' => 'Ha ocurrido un error al actualizar el proveedor. Por favor, inténtelo nuevamente más tarde.</br>Por favor comunicarse con el equipo de desarrollo.'];
		}

		return $response;
	}

	public function Actualizar_proveedor_conductor($datos)
	{
		$response = []; // Inicializa la variable de respuesta
		// $id_usuario = $_SESSION["usuario"]["id_usuario"];
		$fecha_actual = date('Y-m-d');
		$hora_actual = date('H:i:s');
		$user = $_SESSION["usuario"]["nom_usuario"];

		try {
			$this->_db3->beginTransaction();

			$documento_soporte = "public/files/proveedores/" . $datos['numdoc_proveedor'] . "/";
			$sql = $this->_db3->prepare("UPDATE cmx_proveedores SET nombre=:nombre,apellido1=:apellido1,apellido2=:apellido2,abreviatura=:abreviatura,contacto=:telefono,celular=:celular,direccion=:direccion,email=:email,
			id_municipio=:municipio,rndc_categoria_licencia=:categoria,rndc_numero_licencia=:num_licencia,rndc_vencimiento_licencia=:vence_licencia,documentos_soporte=:documento_soporte
			WHERE numdoc_nexos=:id_proveedor");
			$sql->bindParam(':nombre', $datos['rndc_nombre2'], PDO::PARAM_STR);
			$sql->bindParam(':apellido1', $datos['apellido1'], PDO::PARAM_STR);
			$sql->bindParam(':apellido2', $datos['apellido2'], PDO::PARAM_STR);
			$sql->bindParam(':abreviatura', $datos['abreviatura'], PDO::PARAM_STR);
			$sql->bindParam(':telefono', $datos['contacto'], PDO::PARAM_STR);
			$sql->bindParam(':celular', $datos['celular'], PDO::PARAM_STR);
			$sql->bindParam(':direccion', $datos['direccion'], PDO::PARAM_STR);
			$sql->bindParam(':email', $datos['email'], PDO::PARAM_STR);
			$sql->bindParam(':municipio', $datos['municipio'], PDO::PARAM_STR);
			$sql->bindParam(':categoria', $datos['rndc_categoria_licencia'], PDO::PARAM_STR);
			$sql->bindParam(':num_licencia', $datos['rndc_numero_licencia'], PDO::PARAM_STR);
			$sql->bindParam(':vence_licencia', $datos['rndc_vencimiento_licencia'], PDO::PARAM_STR);
			$sql->bindParam(':documento_soporte', $documento_soporte, PDO::PARAM_STR);
			$sql->bindParam(':id_proveedor', $datos['numdoc_proveedor'], PDO::PARAM_STR);
			$resultado = $sql->execute();
			$ruta = "public/files/proveedores/" . $datos['numdoc_proveedor'] . "/";
			if ($resultado) {

				// $ruta = "public/files/proveedores/" . $datos['numdoc_proveedor'] . "/";
				// if (!is_dir($ruta)) {
				// 	mkdir($ruta, 0775, true);
				// }

				// if ($datos['documentos'] !== null && $datos['documentos']['error'] === UPLOAD_ERR_OK) {
				// 	$aleatorio1 = rand(10000, 90000);
				// 	$aleatorio2 = rand(10000, 90000);
				// 	$nom1 = $datos['documentos']['name'];
				// 	$nombre = $datos['documentos']['name'];
				// 	$rutaTemporal = $datos['documentos']['tmp_name'];
				// 	$carpeta = $ruta;
				// 	$src = $carpeta . $nombre;
				// 	// Intenta mover el archivo subido
				// 	if (move_uploaded_file($rutaTemporal, $src)) {
				// 		chmod($src, 644);
				// 		// Si el archivo se movió correctamente, ejecuta la consulta SQL
				// 		$sqlce = "UPDATE cmx_proveedores SET documentos_soporte='public/files/proveedores/" . $datos['numdoc_proveedor'] . "/" . $nom1 . "'
				// 						WHERE id=" . $datos['numdoc_proveedor'];
				// 		$editese = $this->_db3->prepare($sqlce);
				// 		$result = $editese->execute();
				// 		if (!$result) {
				// 			$mensajeError = "Error al actualizar la base de datos para el proveedor con ID " . $datos['numdoc_proveedor'] . " a las " . date("Y-m-d H:i:s");
				// 			error_log($mensajeError . "\n", 3, "error_log.txt");
				// 		}
				// 	} else {
				// 		// Si el archivo no se pudo mover, registra un error
				// 		$mensajeError = "Error al mover el archivo para el proveedor con ID " . $datos['numdoc_proveedor'] . " a las " . date("Y-m-d H:i:s");
				// 		error_log($mensajeError . "\n", 3, "error_log.txt");
				// 		// throw new Exception("Error al subir el archivo.");
				// 	}
				// } else {
				// 	// Cuando no hay documentos para subir
				// 	$mensajeError = "No se han proporcionado documentos para subir para el proveedor con ID " . $datos['numdoc_proveedor'] . " a las " . date("Y-m-d H:i:s");
				// 	error_log($mensajeError . "\n", 3, "error_log.txt");
				// 	// throw new Exception("Error al guardar proveedor 1");
				// }

				$ruta = "public/files/proveedores/" . $datos['numdoc_proveedor'] . "/";

				// Crear carpeta si no existe
				if (!is_dir($ruta)) {
					mkdir($ruta, 0775, true);
				}

				if (!empty($datos['documentos']) && $datos['documentos']['error'] === UPLOAD_ERR_OK) {
					// Crear un nombre aleatorio para evitar conflictos de nombres
					$aleatorio1 = rand(10000, 90000);
					$aleatorio2 = rand(10000, 90000);
					$nombreOriginal = basename($datos['documentos']['name']);
					$nombreFinal = $aleatorio1 . "_" . $aleatorio2 . "_" . $nombreOriginal;

					$rutaTemporal = $datos['documentos']['tmp_name'];
					$destino = $ruta . $nombreFinal;

					// Mover el archivo
					if (move_uploaded_file($rutaTemporal, $destino)) {
						chmod($destino, 0644); // Permisos de lectura seguros

						// Ruta final que se guardará en la base de datos
						$rutaCompleta = "public/files/proveedores/" . $datos['numdoc_proveedor'] . "/" . $nombreFinal;

						// Actualizar en la base de datos
						$sql = "UPDATE cmx_proveedores 
                SET documentos_soporte = :ruta
                WHERE numdoc_nexos = :numdoc";

						$stmt = $this->_db3->prepare($sql);
						$stmt->bindParam(':ruta', $rutaCompleta);
						$stmt->bindParam(':numdoc', $datos['numdoc_proveedor'], PDO::PARAM_STR);

						if (!$stmt->execute()) {
							$mensajeError = "Error al actualizar la BD para el proveedor " . $datos['numdoc_proveedor'] . " a las " . date("Y-m-d H:i:s");
							error_log($mensajeError . "\n", 3, "error_log.txt");
						}
					} else {
						// Error al mover el archivo
						$mensajeError = "Error al mover archivo para el proveedor " . $datos['numdoc_proveedor'] . " a las " . date("Y-m-d H:i:s");
						error_log($mensajeError . "\n", 3, "error_log.txt");
					}
				} else {
					// No se subió archivo
					$mensajeError = "No se proporcionaron documentos para el proveedor " . $datos['numdoc_proveedor'] . " a las " . date("Y-m-d H:i:s");
					error_log($mensajeError . "\n", 3, "error_log.txt");
				}


				// Actualizar detalles del condutor
				$sql2 = $this->_db3->prepare("UPDATE cmx_detalle_conductor SET celular2=:celular2,nombre_eps=:eps,fecha_vence_eps=:venceeps,ultimo_eps=:ultimo_eps,nombre_arl=:arl,fecha_vence_arl=:vencearl,
				ultimo_arl=:ultimo_arl,nombre_entidad=:nomenti,vence_curso=:vencecurso,sexo=:sexo,fecha_nacimiento=:fecha_nacimiento,grupo_sanguineo=:sangre,estado_civil=:civil,
				fecha_ingreso=:ingreso WHERE id_proveedor=:id_proveedor");
				$sql2->bindParam(':celular2', $datos['celular2'], PDO::PARAM_STR);
				$sql2->bindParam(':eps', $datos['nombre_eps'], PDO::PARAM_STR);
				$sql2->bindParam(':venceeps', $datos['fecha_vencimiento'], PDO::PARAM_STR);
				$sql2->bindParam(':ultimo_eps', $datos['ultimo_eps'], PDO::PARAM_STR);
				$sql2->bindParam(':arl', $datos['nombre_arl'], PDO::PARAM_STR);
				$sql2->bindParam(':vencearl', $datos['fecha_vencimiento_arl'], PDO::PARAM_STR);
				$sql2->bindParam(':ultimo_arl', $datos['ultimo_arl'], PDO::PARAM_STR);
				$sql2->bindParam(':nomenti', $datos['nombre_entidad'], PDO::PARAM_STR);
				$sql2->bindParam(':vencecurso', $datos['vence_curso'], PDO::PARAM_STR);
				$sql2->bindParam(':sexo', $datos['sexo'], PDO::PARAM_STR);
				$sql2->bindParam(':fecha_nacimiento', $datos['fecha_nace'], PDO::PARAM_STR);
				$sql2->bindParam(':sangre', $datos['sangre'], PDO::PARAM_STR);
				$sql2->bindParam(':civil', $datos['civil'], PDO::PARAM_STR);
				$sql2->bindParam(':ingreso', $datos['fecha_ingreso'], PDO::PARAM_STR);
				$sql2->bindParam(':id_proveedor', $datos['numdoc_proveedor'], PDO::PARAM_STR);
				$result = $sql2->execute();
				if ($result) {

					if ($datos['licencia'] !== null && $datos['licencia']['error'] === UPLOAD_ERR_OK) {
						$ruta_licencia = "public/files/proveedores/licencias/" . $datos['numdoc_proveedor'] . "/";
						if (!is_dir($ruta_licencia)) {
							mkdir($ruta_licencia, 0777, true);
							$nombre = $datos['licencia']['name'];
							$rutaTemporal = $datos['licencia']['tmp_name'];
							$carpeta = $ruta_licencia;
							$src = $carpeta . $nombre;
							// move_uploaded_file($rutaTemporal, $src);
							if (move_uploaded_file($rutaTemporal, $src)) {
								$ruta_licencias = "public/files/proveedores/licencias/" .  $datos['numdoc_proveedor'] . "/";
								$sqll =  $this->_db3->prepare("UPDATE cmx_proveedores SET subir_licencia ='$ruta_licencias', n_docu_licencia='" . $datos['name_doculice'] . "' WHERE numdoc_nexos = " .  $datos['numdoc_proveedor'] . "");
								$sqll->execute();
							} else {
								// Falla en la actualización
								$mensajeError = "Error al momento de subir el documento de la licencia. " . date("Y-m-d");
								error_log($mensajeError . "\n", 3, "error_log.txt");
								throw new Exception("Error al guardar proveedor");
							}
						} else {
							// Cuando la carpeta ya existe
							if ($datos['licencia'] !== null && $datos['licencia']['error'] === UPLOAD_ERR_OK) {
								$nombre = $datos['licencia']['name'];
								$rutaTemporal = $datos['licencia']['tmp_name'];
								$carpeta = $ruta_licencia;
								$src = $carpeta . $nombre;
								// move_uploaded_file($rutaTemporal, $src);
								if (move_uploaded_file($rutaTemporal, $src)) {
									$ruta_licencias = "public/files/proveedores/licencias/" .  $datos['numdoc_proveedor'] . "/";
									$sqll =  $this->_db3->prepare("UPDATE cmx_proveedores SET subir_licencia ='$ruta_licencias', n_docu_licencia='" . $datos['name_doculice'] . "' WHERE numdoc_nexos = " .  $datos['numdoc_proveedor'] . "");
									$sqll->execute();
								} else {
									// Falla en la actualización
									$mensajeError = "Error al momento de subir el documento de la licencia. " . date("Y-m-d H:i:s");
									error_log($mensajeError . "\n", 3, "error_log.txt");
									throw new Exception("Error al guardar proveedor");
								}
							} else {
								// Cuando no hay documentos para subir
								$mensajeError = "La carpeta de destino ya existe." . date("Y-m-d H:i:s");
								error_log($mensajeError . "\n", 3, "error_log.txt");
							}
						}
					} else {
						// Cuando no hay documentos para subir
						$mensajeError = "No se han proporcionado documentos para subir. " . date("Y-m-d H:i:s");
						error_log($mensajeError . "\n", 3, "error_log.txt");
						// throw new Exception("Error al guardar proveedor 1");
					}

					// Insertar las fotos del conductor cuando se vallan a actualizar
					if ($datos['docu_eps'] !== null && $datos['docu_eps']['error'] === UPLOAD_ERR_OK) {
						$ruta_eps = "public/files/proveedores/eps/" . $datos['numdoc_proveedor'] . "/";
						if (!is_dir($ruta_eps)) {
							mkdir($ruta_eps, 0777, true);
							$nombre = $datos['docu_eps']['name'];
							$rutaTemporal = $datos['docu_eps']['tmp_name'];
							$carpeta = $ruta_eps;
							$src = $carpeta . $nombre;
							// move_uploaded_file($rutaTemporal, $src);
							if (move_uploaded_file($rutaTemporal, $src)) {
								$ruta_eps = "public/files/proveedores/eps/" .  $datos['numdoc_proveedor'] . "/";
								$sqll =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET documento_eps ='$ruta_eps', n_docu_eps='" . $datos['namedocu_eps'] . "',fecha_vence_eps='" . $datos['vence_eps'] . "' WHERE id_proveedor = " .  $datos['numdoc_proveedor'] . "");
								$sqll->execute();
							} else {
								$mensajeError = "Error al momento de subir el documento de la eps. " . date("Y-m-d H:i:s");
								error_log($mensajeError . "\n", 3, "error_log.txt");
								throw new Exception("Error al guardar proveedor");
							}
						} else {
							// Cuando la carpeta ya existe
							if ($datos['docu_eps'] !== null && $datos['docu_eps']['error'] === UPLOAD_ERR_OK) {
								$nombre = $datos['docu_eps']['name'];
								$rutaTemporal = $datos['docu_eps']['tmp_name'];
								$carpeta = $ruta_eps;
								$src = $carpeta . $nombre;
								// move_uploaded_file($rutaTemporal, $src);
								if (move_uploaded_file($rutaTemporal, $src)) {
									$ruta_eps = "public/files/proveedores/eps/" .  $datos['numdoc_proveedor'] . "/";
									$sqll =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET documento_eps ='$ruta_eps', n_docu_eps='" . $datos['namedocu_eps'] . "',fecha_vence_eps='" . $datos['vence_eps'] . "' WHERE id_proveedor = " .  $datos['numdoc_proveedor'] . "");
									$sqll->execute();
								} else {
									$mensajeError = "Error al momento de subir el documento de la eps. " . date("Y-m-d H:i:s");
									error_log($mensajeError . "\n", 3, "error_log.txt");
									throw new Exception("Error al guardar proveedor");
								}
							} else {
								// Cuando no hay documentos para subir
								$mensajeError = "La carpeta de destino ya existe." . date("Y-m-d H:i:s");
								error_log($mensajeError . "\n", 3, "error_log.txt");
							}
						}
					} else {
						// Cuando no hay documentos para subir
						$mensajeError = "No se han proporcionado documentos para subir. " . date("Y-m-d");
						error_log($mensajeError . "\n", 3, "error_log.txt");
					}

					if ($datos['docu_curso'] !== null && $datos['docu_curso']['error'] === UPLOAD_ERR_OK) {
						$ruta_curso = "public/files/proveedores/curso/" . $datos['numdoc_proveedor'] . "/";
						if (!is_dir($ruta_curso)) {
							mkdir($ruta_curso, 0777, true);

							$nombre = $datos['docu_curso']['name'];
							$rutaTemporal = $datos['docu_curso']['tmp_name'];
							$carpeta = $ruta_curso;
							$src = $carpeta . $nombre;
							// move_uploaded_file($rutaTemporal, $src);
							if (move_uploaded_file($rutaTemporal, $src)) {
								$sqll =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET carnet_curso ='$ruta_curso', n_docu_curso='" . $datos['namedocu_curso'] . "',vence_curso='" . $datos['vence_curso'] . "' WHERE id_proveedor = " .  $datos['numdoc_proveedor'] . "");
								$sqll->execute();
							} else {
								$mensajeError = "Error al momento de subir el documento del curso. " . date("Y-m-d H:i:s");
								error_log($mensajeError . "\n", 3, "error_log.txt");
								throw new Exception("Error al guardar proveedor");
							}
						} else {
							// Cuando la carpeta ya existe
							if ($datos['docu_curso'] !== null && $datos['docu_curso']['error'] === UPLOAD_ERR_OK) {
								$ruta_curso = "public/files/proveedores/curso/" . $datos['numdoc_proveedor'] . "/";
								$sqll =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET carnet_curso ='$ruta_curso', n_docu_curso='" . $datos['namedocu_curso'] . "',vence_curso='" . $datos['vence_curso'] . "' WHERE id_proveedor = " .  $datos['numdoc_proveedor'] . "");
								$sqll->execute();
								$nombre = $datos['docu_curso']['name'];
								$rutaTemporal = $datos['docu_curso']['tmp_name'];
								$carpeta = $ruta_curso;
								$src = $carpeta . $nombre;
								// move_uploaded_file($rutaTemporal, $src);
								if (move_uploaded_file($rutaTemporal, $src)) {
									$sqll =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET carnet_curso ='$ruta_curso', n_docu_curso='" . $datos['namedocu_curso'] . "',vence_curso='" . $datos['vence_curso'] . "' WHERE id_proveedor = " .  $datos['numdoc_proveedor'] . "");
									$sqll->execute();
								} else {
									$mensajeError = "Error al momento de subir el documento del curso. " . date("Y-m-d H:i:s");
									error_log($mensajeError . "\n", 3, "error_log.txt");
									throw new Exception("Error al guardar proveedor");
								}
							} else {
								// Cuando no hay documentos para subir
								$mensajeError = "La carpeta de destino ya existe." . date("Y-m-d H:i:s");
								error_log($mensajeError . "\n", 3, "error_log.txt");
							}
						}
					} else {
						// Cuando no hay documentos para subir
						$mensajeError = "No se han proporcionado documentos para subir." . date("Y-m-d H:i:s");
						error_log($mensajeError . "\n", 3, "error_log.txt");
					}

					if ($datos['rut'] !== null && $datos['rut']['error'] === UPLOAD_ERR_OK) {
						$ruta_rut = "public/files/proveedores/rut/" . $datos['numdoc_proveedor'] . "/";
						if (!is_dir($ruta_rut)) {
							mkdir($ruta_rut, 0777, true);
							$ruta_rut = "public/files/proveedores/rut/" .  $datos['numdoc_proveedor'] . "/";
							$nombre = $datos['rut']['name'];
							$rutaTemporal = $datos['rut']['tmp_name'];
							$carpeta = $ruta_rut;
							$src = $carpeta . $nombre;
							// move_uploaded_file($rutaTemporal, $src);
							if (move_uploaded_file($rutaTemporal, $src)) {
								$sqll =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET documento_rut ='$ruta_rut', n_docu_rut='" . $datos['name_docurut'] . "' WHERE id_proveedor = " .  $datos['numdoc_proveedor'] . "");
								$sqll->execute();
							} else {
								$mensajeError = "Error al momento de subir el documento del rut. " . date("Y-m-d H:i:s");
								error_log($mensajeError . "\n", 3, "error_log.txt");
								throw new Exception("Error al guardar proveedor");
							}
						} else {
							// Cuando la carpeta ya existe
							if ($datos['rut'] !== null && $datos['rut']['error'] === UPLOAD_ERR_OK) {
								$ruta_rut = "public/files/proveedores/rut/" .  $datos['numdoc_proveedor'] . "/";
								$sqll =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET documento_rut ='$ruta_rut', n_docu_rut='" . $datos['name_docurut'] . "' WHERE id_proveedor = " .  $datos['numdoc_proveedor'] . "");
								$sqll->execute();
								$nombre = $datos['rut']['name'];
								$rutaTemporal = $datos['rut']['tmp_name'];
								$carpeta = $ruta_rut;
								$src = $carpeta . $nombre;
								// move_uploaded_file($rutaTemporal, $src);
								if (move_uploaded_file($rutaTemporal, $src)) {
									$sqll =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET documento_rut ='$ruta_rut', n_docu_rut='" . $datos['name_docurut'] . "' WHERE id_proveedor = " .  $datos['numdoc_proveedor'] . "");
									$sqll->execute();
								} else {
									$mensajeError = "Error al momento de subir el documento del rut. " . date("Y-m-d H:i:s");
									error_log($mensajeError . "\n", 3, "error_log.txt");
									throw new Exception("Error al guardar proveedor");
								}
							} else {
								// Cuando no hay documentos para subir
								$mensajeError = "La carpeta de destino ya existe." . date("Y-m-d H:i:s");
								error_log($mensajeError . "\n", 3, "error_log.txt");
							}
						}
					} else {
						// Cuando no hay documentos para subir
						$mensajeError = "No se han proporcionado documentos para subir." . date("Y-m-d H:i:s");
						error_log($mensajeError . "\n", 3, "error_log.txt");
					}

					if ($datos['foto_indume'] !== null && $datos['foto_indume']['error'] === UPLOAD_ERR_OK) {
						$ruta_indumentaria = "public/files/proveedores/indumentaria/" . $datos['numdoc_proveedor'] . "/";
						if (!is_dir($ruta_indumentaria)) {
							mkdir($ruta_indumentaria, 0777, true);
							$ruta_indumentaria = "public/files/proveedores/indumentaria/" .  $datos['numdoc_proveedor'] . "/";
							$nombre = $datos['foto_indume']['name'];
							$rutaTemporal = $datos['foto_indume']['tmp_name'];
							$carpeta = $ruta_indumentaria;
							$src = $carpeta . $nombre;
							// move_uploaded_file($rutaTemporal, $src);
							if (move_uploaded_file($rutaTemporal, $src)) {
								$sqll =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET foto_indumentaria ='$ruta_indumentaria', name_cindu='" . $datos['name_indum'] . "' WHERE id_proveedor = " .  $datos['numdoc_proveedor'] . "");
								$sqll->execute();
							} else {
								$mensajeError = "Error al momento de subir la fotografía de indumentaria. " . date("Y-m-d H:i:s");
								error_log($mensajeError . "\n", 3, "error_log.txt");
								throw new Exception("Error al guardar proveedor");
							}
						} else {
							// Cuando la carpeta ya existe
							if ($datos['foto_indume'] !== null && $datos['foto_indume']['error'] === UPLOAD_ERR_OK) {
								$ruta_indumentaria = "public/files/proveedores/indumentaria/" .  $datos['numdoc_proveedor'] . "/";
								$nombre = $datos['foto_indume']['name'];
								$rutaTemporal = $datos['foto_indume']['tmp_name'];
								$carpeta = $ruta_indumentaria;
								$src = $carpeta . $nombre;
								// move_uploaded_file($rutaTemporal, $src);
								if (move_uploaded_file($rutaTemporal, $src)) {
									$sqll =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET foto_indumentaria ='$ruta_indumentaria', name_cindu='" . $datos['name_indum'] . "' WHERE id_proveedor = " .  $datos['numdoc_proveedor'] . "");
									$sqll->execute();
								} else {
									$mensajeError = "Error al momento de subir la fotografía de indumentaria. " . date("Y-m-d H:i:s");
									error_log($mensajeError . "\n", 3, "error_log.txt");
									throw new Exception("Error al guardar proveedor");
								}
							} else {
								// Cuando no hay documentos para subir
								$mensajeError = "La carpeta de destino ya existe." . date("Y-m-d H:i:s");
								error_log($mensajeError . "\n", 3, "error_log.txt");
							}
						}
					} else {
						// Cuando no hay documentos para subir
						$mensajeError = "No se han proporcionado documentos para subir." . date("Y-m-d H:i:s");
						error_log($mensajeError . "\n", 3, "error_log.txt");
					}

					if ($datos['foto_conductor'] !== null && $datos['foto_conductor']['error'] === UPLOAD_ERR_OK) {
						// Fotos de los conductores
						$ruta_frontal = "public/files/proveedores/fotos/" . $datos['numdoc_proveedor'] . "/F/";
						if (!is_dir($ruta_frontal)) {
							mkdir($ruta_frontal, 0777, true);
							$ruta_frontal = "public/files/proveedores/fotos/" .  $datos['numdoc_proveedor'] .  "/F/";
							// $sqll =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET foto_conductor ='$ruta_frontal', name_cfrontal='" . $datos['name_fontall'] . "' WHERE id_proveedor = " .  $datos['numdoc_proveedor'] . "");
							// $sqll->execute();
							$nombre = $datos['foto_conductor']['name'];
							$rutaTemporal = $datos['foto_conductor']['tmp_name'];
							$carpeta = $ruta_frontal;
							$src = $carpeta . $nombre;
							// move_uploaded_file($rutaTemporal, $src);
							if (move_uploaded_file($rutaTemporal, $src)) {
								$sqll =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET foto_conductor ='$ruta_frontal', name_cfrontal='" . $datos['name_fontall'] . "' WHERE id_proveedor = " .  $datos['numdoc_proveedor'] . "");
								$sqll->execute();
							} else {
								$mensajeError = "Error al momento de subir la fotografía del conductor frontal. " . date("Y-m-d H:i:s");
								error_log($mensajeError . "\n", 3, "error_log.txt");
								throw new Exception("Error al guardar proveedor");
							}
						} else {
							// Cuando la carpeta ya existe
							if ($datos['foto_conductor'] !== null && $datos['foto_conductor']['error'] === UPLOAD_ERR_OK) {
								$ruta_frontal = "public/files/proveedores/fotos/" .  $datos['numdoc_proveedor'] .  "/F/";
								$nombre = $datos['foto_conductor']['name'];
								$rutaTemporal = $datos['foto_conductor']['tmp_name'];
								$carpeta = $ruta_frontal;
								$src = $carpeta . $nombre;
								// move_uploaded_file($rutaTemporal, $src);
								if (move_uploaded_file($rutaTemporal, $src)) {
									// Cuando hay documentos para subir
									$sqll =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET foto_conductor ='$ruta_frontal', name_cfrontal='" . $datos['name_fontall'] . "' WHERE id_proveedor = " .  $datos['numdoc_proveedor'] . "");
									$sqll->execute();
								} else {
									$mensajeError = "Error al momento de subir la fotografía del conductor frontal. " . date("Y-m-d H:i:s");
									error_log($mensajeError . "\n", 3, "error_log.txt");
									throw new Exception("Error al guardar proveedor");
								}
							} else {
								// Cuando no hay documentos para subir
								$mensajeError = "La carpeta de destino ya existe." . date("Y-m-d H:i:s");
								error_log($mensajeError . "\n", 3, "error_log.txt");
							}
						}
					} else {
						$mensajeError = "No se han proporcionado documentos para subir." . date("Y-m-d H:i:s");
						error_log($mensajeError . "\n", 3, "error_log.txt");
					}

					if ($datos['foto_derecha'] !== null && $datos['foto_derecha']['error'] === UPLOAD_ERR_OK) {
						$ruta_derecha = "public/files/proveedores/fotos/" . $datos['numdoc_proveedor'] . "/D/";
						if (!is_dir($ruta_derecha)) {
							mkdir($ruta_derecha, 0777, true);
							$ruta_derecha = "public/files/proveedores/fotos/" .  $datos['numdoc_proveedor'] .  "/D/";
							$nombre = $datos['foto_derecha']['name'];
							$rutaTemporal = $datos['foto_derecha']['tmp_name'];
							$carpeta = $ruta_derecha;
							$src = $carpeta . $nombre;
							// move_uploaded_file($rutaTemporal, $src);
							if (move_uploaded_file($rutaTemporal, $src)) {
								$sqll =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET foto_derecha ='$ruta_derecha', name_cderecha='" . $datos['name_derecha'] . "' WHERE id_proveedor = " .  $datos['numdoc_proveedor'] . "");
								$sqll->execute();
							} else {
								$mensajeError = "Error al momento de subir la fotografía del conductor derecha. " . date("Y-m-d H:i:s");
								error_log($mensajeError . "\n", 3, "error_log.txt");
								throw new Exception("Error al guardar proveedor");
							}
						} else {
							// Cuando la carpeta ya existe
							if ($datos['foto_derecha'] !== null && $datos['foto_derecha']['error'] === UPLOAD_ERR_OK) {
								$ruta_derecha = "public/files/proveedores/fotos/" .  $datos['numdoc_proveedor'] .  "/D/";

								$nombre = $datos['foto_derecha']['name'];
								$rutaTemporal = $datos['foto_derecha']['tmp_name'];
								$carpeta = $ruta_derecha;
								$src = $carpeta . $nombre;
								// move_uploaded_file($rutaTemporal, $src);
								if (move_uploaded_file($rutaTemporal, $src)) {
									// Cuando hay documentos para subir
									$sqll =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET foto_derecha ='$ruta_derecha', name_cderecha='" . $datos['name_derecha'] . "' WHERE id_proveedor = " .  $datos['numdoc_proveedor'] . "");
									$sqll->execute();
								} else {
									$mensajeError = "Error al momento de subir la fotografía del conductor derecha. " . date("Y-m-d H:i:s");
									error_log($mensajeError . "\n", 3, "error_log.txt");
									throw new Exception("Error al guardar proveedor");
								}
							} else {
								// Cuando no hay documentos para subir
								$mensajeError = "La carpeta de destino ya existe." . date("Y-m-d H:i:s");
								error_log($mensajeError . "\n", 3, "error_log.txt");
							}
						}
					} else {
						$mensajeError = "No se han proporcionado documentos para subir." . date("Y-m-d H:i:s");
						error_log($mensajeError . "\n", 3, "error_log.txt");
					}

					if ($datos['foto_izquierda'] !== null && $datos['foto_izquierda']['error'] === UPLOAD_ERR_OK) {
						$ruta_izquierda = "public/files/proveedores/fotos/" . $datos['numdoc_proveedor'] . "/I/";
						if (!is_dir($ruta_izquierda)) {
							mkdir($ruta_izquierda, 0777, true);
							$ruta_izquierda = "public/files/proveedores/fotos/" .  $datos['numdoc_proveedor'] .  "/I/";
							$nombre = $datos['foto_izquierda']['name'];
							$rutaTemporal = $datos['foto_izquierda']['tmp_name'];
							$carpeta = $ruta_izquierda;
							$src = $carpeta . $nombre;
							// move_uploaded_file($rutaTemporal, $src);
							if (move_uploaded_file($rutaTemporal, $src)) {
								// Cuando hay documentos para subir
								$sqll =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET foto_izquierda ='$ruta_izquierda', name_cizquierda='" . $datos['name_izquierda'] . "' WHERE id_proveedor = " .  $datos['numdoc_proveedor'] . "");
								$sqll->execute();
							} else {
								$mensajeError = "Error al momento de subir la fotografía del conductor izquierda. " . date("Y-m-d H:i:s");
								error_log($mensajeError . "\n", 3, "error_log.txt");
								throw new Exception("Error al guardar proveedor");
							}
						} else {
							// Cuando la carpeta ya existe
							if ($datos['foto_izquierda'] !== null && $datos['foto_izquierda']['error'] === UPLOAD_ERR_OK) {
								$ruta_izquierda = "public/files/proveedores/fotos/" .  $datos['numdoc_proveedor'] .  "/I/";

								$nombre = $datos['foto_izquierda']['name'];
								$rutaTemporal = $datos['foto_izquierda']['tmp_name'];
								$carpeta = $ruta_izquierda;
								$src = $carpeta . $nombre;
								// move_uploaded_file($rutaTemporal, $src);
								if (move_uploaded_file($rutaTemporal, $src)) {
									// Cuando hay documentos para subir
									$sqll =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET foto_izquierda ='$ruta_izquierda', name_cizquierda='" . $datos['name_izquierda'] . "' WHERE id_proveedor = " .  $datos['numdoc_proveedor'] . "");
									$sqll->execute();
								} else {
									$mensajeError = "Error al momento de subir la fotografía del conductor izquierda. " . date("Y-m-d H:i:s");
									error_log($mensajeError . "\n", 3, "error_log.txt");
									throw new Exception("Error al guardar proveedor");
								}
							} else {
								// Cuando no hay documentos para subir
								$mensajeError = "La carpeta de destino ya existe." . date("Y-m-d H:i:s");
								error_log($mensajeError . "\n", 3, "error_log.txt");
							}
						}
					} else {
						$mensajeError = "No se han proporcionado documentos para subir." . date("Y-m-d H:i:s");
						error_log($mensajeError . "\n", 3, "error_log.txt");
					}

					if ($datos['acuerdo_uno'] !== null && $datos['acuerdo_uno']['error'] === UPLOAD_ERR_OK) {
						$ruta_acuerdo = "public/files/proveedores/acuerdo/" . $datos['numdoc_proveedor'] . "/AC1/";
						if (!is_dir($ruta_acuerdo)) {
							mkdir($ruta_acuerdo, 0777, true);
							$nombre = $datos['acuerdo_uno']['name'];
							$rutaTemporal = $datos['acuerdo_uno']['tmp_name'];
							$carpeta = $ruta_acuerdo;
							$src = $carpeta . $nombre;
							// move_uploaded_file($rutaTemporal, $src);
							if (move_uploaded_file($rutaTemporal, $src)) {
								// Cuando hay documentos para subir
								$sqll =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET foto_acuerdo1 ='$ruta_acuerdo', name_acuerdo1='" . $datos['name_a1'] . "' WHERE id_proveedor = " .  $datos['numdoc_proveedor'] . "");
								$sqll->execute();
							} else {
								$mensajeError = "Error al momento de subir el acuerdo uno. " . date("Y-m-d H:i:s");
								error_log($mensajeError . "\n", 3, "error_log.txt");
								throw new Exception("Error al guardar proveedor");
							}
						} else {
							// Cuando la carpeta ya existe
							if ($datos['acuerdo_uno'] !== null && $datos['acuerdo_uno']['error'] === UPLOAD_ERR_OK) {
								$ruta_acuerdo = "public/files/proveedores/acuerdo/" . $datos['numdoc_proveedor'] . "/AC1/";
								$nombre = $datos['acuerdo_uno']['name'];
								$rutaTemporal = $datos['acuerdo_uno']['tmp_name'];
								$carpeta = $ruta_acuerdo;
								$src = $carpeta . $nombre;
								// move_uploaded_file($rutaTemporal, $src);
								if (move_uploaded_file($rutaTemporal, $src)) {
									// Cuando hay documentos para subir
									$sqll =  $this->_db3->prepare("UPDATE cmx_detalle_conductor SET foto_acuerdo1 ='$ruta_acuerdo', name_acuerdo1='" . $datos['name_a1'] . "' WHERE id_proveedor = " .  $datos['numdoc_proveedor'] . "");
									$sqll->execute();
								} else {
									$mensajeError = "Error al momento de subir el acuerdo uno. " . date("Y-m-d H:i:s");
									error_log($mensajeError . "\n", 3, "error_log.txt");
									throw new Exception("Error al guardar proveedor");
								}
							} else {
								// Cuando no hay documentos para subir
								$mensajeError = "La carpeta de destino ya existe." . date("Y-m-d H:i:s");
								error_log($mensajeError . "\n", 3, "error_log.txt");
							}
						}
					} else {
						$mensajeError = "No se han proporcionado documentos para subir." . date("Y-m-d H:i:s");
						error_log($mensajeError . "\n", 3, "error_log.txt");
					}

					// Actualziar las referencias personales
					$sql_ref1 = $this->_db3->prepare("UPDATE cmx_referencias_preestudio SET nombre_empresa=:referencias_empresariales,fecha_ingreso=:fecha_referencia, fecha_retiro=:fecha_retiro, 
					persona_contacto=:contacto_ref, celular=:celular_ref, cargo=:cargo_ref, antiguedad=:anti_ref, fecha=:fecha, hora=:hora, usuario=:usuario WHERE id_conductor=:id_proveedor AND id=:eid");
					$sql_ref1->bindParam(':referencias_empresariales', $datos['referencias_empresariales1'], PDO::PARAM_STR);
					$sql_ref1->bindParam(':fecha_referencia', $datos['fecha_referencia1'], PDO::PARAM_STR);
					$sql_ref1->bindParam(':fecha_retiro', $datos['fecha_retiro1'], PDO::PARAM_STR);
					$sql_ref1->bindParam(':contacto_ref', $datos['contacto_ref1'], PDO::PARAM_STR);
					$sql_ref1->bindParam(':celular_ref', $datos['celular_ref1'], PDO::PARAM_STR);
					$sql_ref1->bindParam(':cargo_ref', $datos['cargo_ref1'], PDO::PARAM_STR);
					$sql_ref1->bindParam(':anti_ref', $datos['anti_ref1'], PDO::PARAM_STR);
					$sql_ref1->bindParam(':fecha', $fecha_actual, PDO::PARAM_STR);
					$sql_ref1->bindParam(':hora', $hora_actual, PDO::PARAM_STR);
					$sql_ref1->bindParam(':usuario', $user, PDO::PARAM_STR);
					$sql_ref1->bindParam(':id_proveedor', $datos['numero_documento'], PDO::PARAM_STR);
					$sql_ref1->bindParam(':eid', $datos['idp1'], PDO::PARAM_STR);
					$sql_ref1->execute();
					// if ($resultado_ref1) {
					// } else {
					// 	$mensajeError = "Error al actualziar la referencia 1 del proveedor." . date("Y-m-d");
					// 	error_log($mensajeError . "\n", 3, "error_log.txt");
					// }
					$sql_ref2 = $this->_db3->prepare("UPDATE cmx_referencias_preestudio SET nombre_empresa=:referencias_empresariales,fecha_ingreso=:fecha_referencia, fecha_retiro=:fecha_retiro, 
						persona_contacto=:contacto_ref, celular=:celular_ref, cargo=:cargo_ref, antiguedad=:anti_ref, fecha=:fecha, hora=:hora, usuario=:usuario WHERE id_conductor=:id_proveedor AND id=:eid");
					$sql_ref2->bindParam(':referencias_empresariales', $datos['referencias_empresariales2'], PDO::PARAM_STR);
					$sql_ref2->bindParam(':fecha_referencia', $datos['fecha_referencia2'], PDO::PARAM_STR);
					$sql_ref2->bindParam(':fecha_retiro', $datos['fecha_retiro2'], PDO::PARAM_STR);
					$sql_ref2->bindParam(':contacto_ref', $datos['contacto_ref2'], PDO::PARAM_STR);
					$sql_ref2->bindParam(':celular_ref', $datos['celular_ref2'], PDO::PARAM_STR);
					$sql_ref2->bindParam(':cargo_ref', $datos['cargo_ref2'], PDO::PARAM_STR);
					$sql_ref2->bindParam(':anti_ref', $datos['anti_ref2'], PDO::PARAM_STR);
					$sql_ref2->bindParam(':fecha', $fecha_actual, PDO::PARAM_STR);
					$sql_ref2->bindParam(':hora', $hora_actual, PDO::PARAM_STR);
					$sql_ref2->bindParam(':usuario', $user, PDO::PARAM_STR);
					$sql_ref2->bindParam(':id_proveedor', $datos['numero_documento'], PDO::PARAM_STR);
					$sql_ref2->bindParam(':eid', $datos['idp2'], PDO::PARAM_STR);
					$sql_ref2->execute();
					// if ($resultado_ref2) {
					// } else {
					// 	$mensajeError = "Error al actualziar la referencia 2 del proveedor." . date("Y-m-d");
					// 	error_log($mensajeError . "\n", 3, "error_log.txt");
					// }
					$sql_ref3 = $this->_db3->prepare("UPDATE cmx_referencias_preestudio SET nombre_empresa=:referencias_empresariales,fecha_ingreso=:fecha_referencia, fecha_retiro=:fecha_retiro, 
							persona_contacto=:contacto_ref, celular=:celular_ref, cargo=:cargo_ref, antiguedad=:anti_ref, fecha=:fecha, hora=:hora, usuario=:usuario WHERE id_conductor=:id_proveedor AND id=:eid");
					$sql_ref3->bindParam(':referencias_empresariales', $datos['referencias_empresariales3'], PDO::PARAM_STR);
					$sql_ref3->bindParam(':fecha_referencia', $datos['fecha_referencia3'], PDO::PARAM_STR);
					$sql_ref3->bindParam(':fecha_retiro', $datos['fecha_retiro3'], PDO::PARAM_STR);
					$sql_ref3->bindParam(':contacto_ref', $datos['contacto_ref3'], PDO::PARAM_STR);
					$sql_ref3->bindParam(':celular_ref', $datos['celular_ref3'], PDO::PARAM_STR);
					$sql_ref3->bindParam(':cargo_ref', $datos['cargo_ref3'], PDO::PARAM_STR);
					$sql_ref3->bindParam(':anti_ref', $datos['anti_ref3'], PDO::PARAM_STR);
					$sql_ref3->bindParam(':fecha', $fecha_actual, PDO::PARAM_STR);
					$sql_ref3->bindParam(':hora', $hora_actual, PDO::PARAM_STR);
					$sql_ref3->bindParam(':usuario', $user, PDO::PARAM_STR);
					$sql_ref3->bindParam(':id_proveedor', $datos['numero_documento'], PDO::PARAM_STR);
					$sql_ref3->bindParam(':eid', $datos['idp3'], PDO::PARAM_STR);
					$sql_ref3->execute();
					// if ($resultado_ref3) {
					// } else {
					// 	// return false;
					// 	$mensajeError = "Error al actualziar la referencia 3 del proveedor." . date("Y-m-d");
					// 	error_log($mensajeError . "\n", 3, "error_log.txt");
					// }
					$sql_refp1 = $this->_db3->prepare("UPDATE cmx_referencias_personales SET nombre_personal=:refep, fecha_personal=:fechap, parentezco=:parenp, tel_personal=:telefonop, usuario=:usuario, 
								fecha=:fecha, hora=:hora WHERE id=:idp AND id_conductor=:id_proveedor");
					$sql_refp1->bindParam(':refep', $datos['referencias_personales'], PDO::PARAM_STR);
					$sql_refp1->bindParam(':fechap', $datos['fecha_personal1'], PDO::PARAM_STR);
					$sql_refp1->bindParam(':parenp', $datos['parenp1'], PDO::PARAM_STR);
					$sql_refp1->bindParam(':telefonop', $datos['telefonop1'], PDO::PARAM_STR);
					$sql_refp1->bindParam(':usuario', $user, PDO::PARAM_STR);
					$sql_refp1->bindParam(':fecha', $fecha_actual, PDO::PARAM_STR);
					$sql_refp1->bindParam(':hora', $hora_actual, PDO::PARAM_STR);
					$sql_refp1->bindParam(':idp', $datos['ref_id1'], PDO::PARAM_STR);
					$sql_refp1->bindParam(':id_proveedor', $datos['numdoc_proveedor'], PDO::PARAM_STR);
					$sql_refp1->execute();
					// if ($result_refp1) {
					// } else {
					// 	$mensajeError = "Error al actualziar la referencia personal 1 del proveedor." . date("Y-m-d");
					// 	error_log($mensajeError . "\n", 3, "error_log.txt");
					// }
					// return true;

					$sql_refp2 = $this->_db3->prepare("UPDATE cmx_referencias_personales SET nombre_personal=:refep, fecha_personal=:fechap, parentezco=:parenp, tel_personal=:telefonop, usuario=:usuario, 
									fecha=:fecha, hora=:hora WHERE id=:idp AND id_conductor=:id_proveedor");
					$sql_refp2->bindParam(':refep', $datos['referencias_personales2'], PDO::PARAM_STR);
					$sql_refp2->bindParam(':fechap', $datos['fecha_personal2'], PDO::PARAM_STR);
					$sql_refp2->bindParam(':parenp', $datos['parenp2'], PDO::PARAM_STR);
					$sql_refp2->bindParam(':telefonop', $datos['telefonop2'], PDO::PARAM_STR);
					$sql_refp2->bindParam(':usuario', $user, PDO::PARAM_STR);
					$sql_refp2->bindParam(':fecha', $fecha_actual, PDO::PARAM_STR);
					$sql_refp2->bindParam(':hora', $hora_actual, PDO::PARAM_STR);
					$sql_refp2->bindParam(':idp', $datos['ref_id2'], PDO::PARAM_STR);
					$sql_refp2->bindParam(':id_proveedor', $datos['numdoc_proveedor'], PDO::PARAM_STR);
					$sql_refp2->execute();
					// if ($result_refp2) {
					// 	$response = true;
					// } else {
					// 	$response = false;
					// 	$mensajeError = "Error al actualziar la referencia personal 2 del proveedor." . date("Y-m-d");
					// 	error_log($mensajeError . "\n", 3, "error_log.txt");
					// }

					$this->_db3->commit();
					$response = ['success' => true, 'message' => 'Se actualizaron datos del conductor correctamente en NEXOSAPP.'];
				} else {
					$mensajeError = "Error al actualziar los detalles del conductor." . date("Y-m-d");
					error_log($mensajeError . "\n", 3, "error_log.txt");
					// return false;
				}
			} else {
				$mensajeError = "Error al actualziar la tabla de proveedores." . date("Y-m-d");
				error_log($mensajeError . "\n", 3, "error_log.txt");
			}
		} catch (\Throwable $th) {
			//throw $th;
			// Algo salió mal, se hace rollback
			$this->_db3->rollBack();
			// Registrar el error en un archivo de log en la raíz del proyecto
			$errorMessage = "Error en la transacción al insertar conductor: " . $th->getMessage() . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
			$logFilePath = 'error_log.txt'; // Ajusta la ruta según la estructura de tu proyecto
			error_log($errorMessage, 3, $logFilePath);

			// Verificar si el archivo de log se ha escrito correctamente
			if (!file_exists($logFilePath)) {
				error_log("No se pudo crear el archivo de log: $logFilePath\n", 3, $logFilePath);
			}

			// Mostrar un mensaje amigable al usuario
			$response = ['success' => false, 'message' => 'Ha ocurrido un error al actualizar el conductor. Por favor, inténtelo nuevamente más tarde.</br>Por favor comunicarse con el equipo de desarrollo.'];
		}

		return $response;
	}

	/* Actualiar cuando es propietario solo o poseedor solo o las dos actividades */
	public function Actualizar_Proveedor_actividades($datos)
	{
		$response = []; // Inicializa la variable de respuesta
		$id_usuario = $_SESSION["usuario"]["id_usuario"];
		$fecha_actual = date('Y-m-d');
		$sql = $this->_db3->prepare("UPDATE cmx_proveedores SET nombre=:nombre,apellido1=:apellido1,apellido2=:apellido2,abreviatura=:abreviatura,contacto=:telefono,celular=:celular, direccion=:direccion,email=:email,
		id_municipio=:municipio WHERE numdoc_nexos=:id_proveedor");
		$sql->bindParam(':nombre', $datos['rndc_nombre2'], PDO::PARAM_STR);
		$sql->bindParam(':apellido1', $datos['apellido1'], PDO::PARAM_STR);
		$sql->bindParam(':apellido2', $datos['apellido2'], PDO::PARAM_STR);
		$sql->bindParam(':abreviatura', $datos['abreviatura'], PDO::PARAM_STR);
		$sql->bindParam(':telefono', $datos['contacto'], PDO::PARAM_STR);
		$sql->bindParam(':celular', $datos['celular'], PDO::PARAM_STR);
		$sql->bindParam(':direccion', $datos['direccion'], PDO::PARAM_STR);
		$sql->bindParam(':email', $datos['email'], PDO::PARAM_STR);
		$sql->bindParam(':municipio', $datos['municipio'], PDO::PARAM_STR);
		$sql->bindParam(':id_proveedor', $datos['numdoc_proveedor'], PDO::PARAM_STR);
		$resultado = $sql->execute();
		if ($resultado) {
			$proveedor = $datos['numdoc_proveedor'];
			$sql_log = "INSERT INTO cmx_log_proveedores (id_usuario,id_proveedor,operacion,fecha_hora_operacion) VALUES('$id_usuario','$proveedor','Editar','$fecha_actual')";
			$crear_log_proveedor = $this->_db3->prepare($sql_log);
			$crear_log_proveedor->execute();
			if ($crear_log_proveedor) {
				$response = true;
			} else {
				$response = false;
				$mensajeError = "Error al actualziar la referencia personal 2 del proveedor." . date("Y-m-d H:m:s");
				error_log($mensajeError . "\n", 3, "error_log.txt");
			};
		} else {

			$mensajeError = "Error al actualizar los datos del proveedor." . date("Y-m-d H:m:s");
			error_log($mensajeError . "\n", 3, "error_log.txt");
		}
		return $response;
	}

	public function crear_transaccion_ministerio($num_documento, $tercero_clase, $fecha_actual, $hora_actual)
	{
		$response = [];
		$user = $_SESSION["usuario"]["nom_usuario"];
		$tipo = 'Tercero';
		$estado_envio_rndc = 0;
		$estado = 1;
		$accion = 'Crear';
		$sql =  $this->_db3->prepare("INSERT INTO web_service_RNDC(codigo_proceso,tipo,estado_envio_rndc,estado,fecha,hora,usuario,tipo_tercero,accion)
		VALUES(:codigo_proceso,:tipo,:estado_envio_rndc,:estado,:fecha,:hora,:usuario,:tipo_tercero,:accion)");
		// -- VALUES(null,:codigo_proceso,'Tercero',0,1,'" . $fecha_actual . "','" . $hora_actual . "','" . $user . "','" . $tercero_clase . "','Crear')";
		$sql->bindParam(':codigo_proceso', $num_documento, PDO::PARAM_STR);
		$sql->bindParam(':tipo', $tipo, PDO::PARAM_STR);
		$sql->bindParam(':estado_envio_rndc', $estado_envio_rndc, PDO::PARAM_STR);
		$sql->bindParam(':estado', $estado, PDO::PARAM_STR);
		$sql->bindParam(':fecha', $fecha_actual, PDO::PARAM_STR);
		$sql->bindParam(':hora', $hora_actual, PDO::PARAM_STR);
		$sql->bindParam(':usuario', $user, PDO::PARAM_STR);
		$sql->bindParam(':tipo_tercero', $tercero_clase, PDO::PARAM_STR);
		$sql->bindParam(':accion', $accion, PDO::PARAM_STR);
		$resultado = $sql->execute();
		if ($resultado) {
			$response = true;
		} else {
			$response = false;
			$mensajeError = "Error al insertar en la tabla web_service_rndc. " . date("Y-m.d");
			error_log($mensajeError . "\n", 3, "error_log.txt");
		}

		return $response;
	}

	public function Traer_Datos_Proveedor($proveedor_id)
	{
		$response = [];
		$sql = $this->_db3->prepare("SELECT  p.id AS idp, p.*,CONCAT(mu.municipio,'-',mu.depto) AS cipio,c.id AS existec, c.*,b.estado_proceso
		FROM  cmx_proveedores p
		LEFT JOIN cmx_detalle_conductor c ON  p.numdoc_nexos=c.id_proveedor
		LEFT JOIN cmx_estado_bloqueo b ON p.numdoc_nexos=b.id_objeto
		LEFT JOIN cmx_municipios mu ON p.id_municipio=mu.id
		WHERE p.numdoc_nexos=:proveedor_id GROUP BY p.id");
		$sql->bindParam(':proveedor_id', $proveedor_id, PDO::PARAM_STR);
		$sql->execute();
		$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		if ($resultado) {
			$sql_actividad = $this->_db3->prepare("SELECT actividad as acti FROM cmx_actividad_proveedor WHERE id_proveedor=:id_proveedor");
			$sql_actividad->bindParam(':id_proveedor', $proveedor_id, PDO::PARAM_STR);
			$sql_actividad->execute();
			$resultado_actividad = $sql_actividad->fetchAll(PDO::FETCH_ASSOC);
			foreach ($resultado_actividad as $key => $value) {
				//echo 'Actividad'.$value['acti'];
				if ($value['acti'] == 'Proveedor') {
					//echo 'CONTADORCITO'.$cont++;
					$sql_proveedor = $this->_db3->prepare("SELECT CONCAT(b.pais,'-',b.depto,'-',b.municipio) AS cipio,  a.* FROM cmx_proveedores_detalle a
					LEFT JOIN cmx_municipios b ON a.cod_pais=b.id
					WHERE a.id_proveedor=:id_proveedor");
					$sql_proveedor->bindParam(':id_proveedor', $proveedor_id, PDO::PARAM_STR);
					$sql_proveedor->execute();
					$resultado_proveedor = $sql_proveedor->fetchAll(PDO::FETCH_ASSOC);

					$sql_contacto = $this->_db3->prepare("SELECT * FROM cmx_proveedor_contactos WHERE id_proveedor=:id_proveedor");
					$sql_contacto->bindParam(':id_proveedor', $proveedor_id, PDO::PARAM_STR);
					$sql_contacto->execute();
					$resultado_contacto = $sql_contacto->fetchAll(PDO::FETCH_ASSOC);
				}
			}
			// $response = [
			// 	"resultado_proveedor" => $resultado_proveedor,
			// 	"resultado_contacto" => $resultado_contacto,
			// ];

			/* Referencias empresariales */
			$sql_referencias = $this->_db3->prepare("SELECT ref.* FROM cmx_referencias_preestudio ref
			INNER JOIN cmx_proveedores pro ON ref.id_conductor=pro.numero_documento
			WHERE pro.numdoc_nexos=:id_proveedor");
			$sql_referencias->bindParam(':id_proveedor', $proveedor_id, PDO::PARAM_STR);
			$sql_referencias->execute();
			$resultado_referencias = $sql_referencias->fetchAll(PDO::FETCH_ASSOC);

			/* Referencias Personales */
			$sql_referencias_personales = $this->_db3->prepare("SELECT * FROM cmx_referencias_personales WHERE id_conductor=:id_proveedor");
			$sql_referencias_personales->bindParam(':id_proveedor', $proveedor_id, PDO::PARAM_STR);
			$sql_referencias_personales->execute();
			$resultado_referencias_personales = $sql_referencias_personales->fetchAll(PDO::FETCH_ASSOC);

			$sql_datos_proveedor = $this->_db3->prepare("SELECT pf.tipo_cuenta, pf.numero_cuenta,
			ae.descripcion as economi, ot.descripcion, ban.nombre
			FROM cmx_proveedor_financieros pf
			INNER JOIN cmx_para_actividad_economica ae ON pf.actividad_economica=ae.id
			INNER JOIN cmx_para_obligacion_tributaria ot ON pf.obliga_tributaria=ot.id
			INNER JOIN cmx_para_bancos ban ON pf.banco=ban.id
			WHERE pf.id_proveedor=:id_proveedor AND pf.estado=1");
			$sql_datos_proveedor->bindParam(':id_proveedor', $proveedor_id, PDO::PARAM_STR);
			$sql_datos_proveedor->execute();
			$resultado_datos_proveedor = $sql_datos_proveedor->fetchAll(PDO::FETCH_ASSOC);

			$response = [
				"resultados" => $resultado,
				"resultado_proveedor" => isset($resultado_proveedor) ? $resultado_proveedor : '',
				"resultado_contacto" => isset($resultado_contacto) ? $resultado_contacto : '',
				"resultado_referencias" => $resultado_referencias,
				"resultado_referencias_personales" => $resultado_referencias_personales,
				"resultado_datos_proveedor" => $resultado_datos_proveedor,
				"resultado_actividad" => $resultado_actividad,
			];
			// var_dump($resultado_actividad);
			// exit();
		} else {
			$mensajeError = "Error al consultar la informacion." . date("Y-m.d");
			error_log($mensajeError . "\n", 3, "error_log.txt");
		}
		return $response;
	}

	public function Obetener_datos_proveedores($prefiltro, $token)
	{
		$response = [];
		$sql = $this->_db3->prepare("SELECT trailer FROM cmx_vehiculos_preestudio WHERE id=:num_prefiltro");
		$sql->bindParam(':num_prefiltro', $prefiltro, PDO::PARAM_STR);
		$sql->execute();
		$resultado = $sql->fetch(PDO::FETCH_ASSOC);
		if ($resultado['trailer'] === 'SI') {
			$sql_datos = $this->_db3->prepare("SELECT vp.documento_propietario,vp.documento_tenedor,vp.documento_conductor,vp.documento_propietario_trailer FROM cmx_vehiculos_preestudio vp 
			INNER JOIN cmx_solicitudes_estados se ON vp.id=se.id_solicitud
			 WHERE vp.id=:num_prefiltro AND se.token=:num_token GROUP BY vp.id");
			$sql_datos->bindParam(':num_prefiltro', $prefiltro, PDO::PARAM_STR);
			$sql_datos->bindParam(':num_token', $token, PDO::PARAM_STR);
			$sql_datos->execute();
			$resultado = $sql_datos->fetch(PDO::FETCH_ASSOC);
			$response = $resultado;
		} else {
			$sql_datos = $this->_db3->prepare("SELECT vp.documento_propietario,vp.documento_tenedor,vp.documento_conductor FROM cmx_vehiculos_preestudio vp 
			INNER JOIN cmx_solicitudes_estados se ON vp.id=se.id_solicitud
			 WHERE vp.id=:num_prefiltro AND se.token=:num_token GROUP BY vp.id");
			$sql_datos->bindParam(':num_prefiltro', $prefiltro, PDO::PARAM_STR);
			$sql_datos->bindParam(':num_token', $token, PDO::PARAM_STR);
			$sql_datos->execute();
			$resultado = $sql_datos->fetch(PDO::FETCH_ASSOC);
			$response = $resultado;
		}
		return $response;
	}
}
