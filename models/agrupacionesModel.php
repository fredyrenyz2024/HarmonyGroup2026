<?php
class agrupacionesModel extends Model
{

	public function __construct()
	{
		parent::__construct();
	}

	public function getMonedas()
	{
		$monedas = $this->_db->getConsulta("SELECT * FROM cmx_solicitudes ");
		return $monedas;
	}

	public function getTabla()
	{
		$monedas = $this->_db->getConsulta("SELECT * FROM cmx_solicitudes ");
		return $monedas;
	}

	public function getHtmlSelect($name, $id)
	{

		if ($name) {
			$query = 'SELECT * FROM cmx_monedas cmo';

			// echo $query;
			$array = $this->_db->getConsulta($query);

			// Se recorre contenido de la consulta
			if ($array) {
				// print_r($array);
				$select = '
						<select class="select2 select2-hidden-accessible" name="' . $name . '" id="slct_monedas_' . $id . '" aria-hidden="true">
					';
				$select .= '<option value="" selected disabled>Seleccione</option>';

				foreach ($array['rowsData'] as $key => $value) {

					if ($value[0] == $id) {
						$select .= '<option value="' . $value[0] . '" selected="">' . $value[1] . '</option>';
					} else {
						$select .= '<option value="' . $value[0] . '">' . $value[1] . '</option>';
					}
				}
				$select .= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}

		return $select;
	}

	public function getHtmlSelectMultiple($name, $id)
	{

		if ($name) {
			$query = 'SELECT * FROM cmx_monedas cmo';

			// echo $query;
			$array = $this->_db->getConsulta($query);

			// Se recorre contenido de la consulta
			if ($array) {
				// print_r($array);
				$select = '
						<select class="tags" multiple="multiple" name="' . $name . '" id="slct_monedas_' . $id . '" aria-hidden="true">
					';
				foreach ($array['rowsData'] as $key => $value) {

					if ($value[0] == $id) {
						$select .= '<option value="' . $value[0] . '" selected="">' . $value[1] . '</option>';
					} else {
						$select .= '<option value="' . $value[0] . '">' . $value[1] . '</option>';
					}
				}
				$select .= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}

		return $select;
	}


	/****** CONSULTAS DEL MÓDULO DE CONTROL DE AGRUPAMIENTOS ******/
	public function getControlAgrupamientos()
	{
		$sql = $this->_db3->prepare('SELECT ca.*, cas.tipo_vehiculo, ctv.nombre, ctv.peso_maximo,
                SUM(csat.valor_compra) AS valor_compra,
                SUM(csat.valor_venta) AS valor_venta,
                COUNT(DISTINCT cas.id_solicitud) AS CANT_SOLICITUDES
            FROM cmx_agrupaciones ca
                INNER JOIN cmx_agrupacion_solicitudes cas ON ca.id = cas.id_agrupacion
                INNER JOIN cmx_servicio_adicional_tramo csat ON csat.id_solicitud = cas.id_solicitud
                INNER JOIN cmx_tipo_vehiculos ctv ON ctv.id = cas.tipo_vehiculo
            WHERE ca.estado = 2
            GROUP BY cas.id_agrupacion
            ORDER BY ca.codigo_rojo DESC, ca.fecha_hora_operacion ASC');
		$sql->execute();
		return $sql->fetchAll();

		// $sql = 'SELECT ca.*, cas.tipo_vehiculo, ctv.nombre, ctv.peso_maximo,
		// 		SUM(csat.valor_compra) valor_compra,
		// 		SUM(csat.valor_venta) valor_venta,
		// 		COUNT( DISTINCT(cas.id_solicitud) ) CANT_SOLICITUDES
		// 	FROM cmx_agrupaciones ca
		// 		INNER JOIN cmx_agrupacion_solicitudes cas ON ca.id = cas.id_agrupacion
		// 		INNER JOIN cmx_servicio_adicional_tramo csat ON csat.id_solicitud = cas.id_solicitud
		// 		INNER JOIN cmx_tipo_vehiculos ctv ON ctv.id = cas.tipo_vehiculo
		// 	WHERE ca.estado = 2
		// 	GROUP BY cas.id_agrupacion DESC
		// 	ORDER BY ca.codigo_rojo DESC, ca.fecha_hora_operacion ASC';
		// $request = $this->_db->getConsulta($sql);

		// return $request;
	}

	public function getControlSolicitudesAgrupamientos($id)
	{
		$sql = '
				SELECT 
					cia.*
				FROM 
					cmx_agrupacion_material cam
					INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cam.id_material_proyecto
				WHERE 
					cam.id_agrupamiento = ' . $id . '
					AND cia.estado = 2;
			';
		$request = $this->_db->getConsulta($sql);
		return $request;
	}
	/****** FIN CONSULTAS DEL MÓDULO DE CONTROL DE AGRUPAMIENTOS ******/
}

class Agrupaciones extends Model
{
	public $user_log;
	public $pass;
	public $mensaje;
	public $respuesta;
	public $email;
	public $listado;

	public function listarSolicitudes()
	{
		$usuario = $_SESSION["usuario"];
		$model    = new Conexion;
		$conexion = $model->conectar();
		if ($this->validaAdministrador($usuario["id_perfil"])) {
			$sql = "
					SELECT 
						csol.id as 'id_solicitud', cip.numero_importacion,
						csol.*,
						ccc.id ID_CONTRATO, ccc.cod_contrato, ccc.porcentaje_ganancia, ctc.nombre TIPO_CONTRATO, 
						IF(
							(SELECT 
									COUNT(crvc1.id)
								FROM
									cmx_rndc_vehiculos_carroceria crvc1
								WHERE 
									crvc1.id = csol.tipo_carroceria) > 0
							, (SELECT 
								crvc1.descripcion
								FROM
									cmx_rndc_vehiculos_carroceria crvc1
								WHERE 
								crvc1.id = csol.tipo_carroceria)
							, NULL
						) as 'carroceria',
						scat.valor_compra,
						scat.valor_venta,
						cip.id_tipo_carga, 
						cc.nombre as 'nombre_cliente',
						((
							SELECT SUM(cms.peso_total) 
							FROM cmx_mercancia_solicitud cms 
							WHERE cms.id_solicitud = csol.id)+csol.tara_contenedor
						) as 'peso_total_solicitud',
						IF(
							cip.tipo_contenedor,
							(
								SELECT 
									ctc1.nombre
								FROM 
									cmx_tipo_contenedor ctc1 
								WHERE 
									ctc1.id = cip.tipo_contenedor
							),
							NULL
						) CONTENEDOR
					FROM 
						cmx_solicitudes csol
						INNER JOIN cmx_servicio_adicional_tramo scat ON scat.id_solicitud = csol.id
						INNER JOIN cmx_integracion_soluc_import cisi ON cisi.id_solucion = csol.id
						INNER JOIN cmx_importacion_actividades cia ON cia.id = cisi.id_importacion_actividad
						INNER JOIN cmx_importacion_proyecto cip ON cip.id = cia.id_importacion
						INNER JOIN cmx_clientes cc ON cc.id = csol.id_cliente 
						INNER JOIN cmx_tramo_solicitud cts ON cts.id_solicitud = csol.id
						INNER JOIN cmx_tramo_material ctm ON ctm.id_tramo = cts.id
						INNER JOIN cmx_contrato_cliente ccc ON ccc.id = cip.id_contrato
						INNER JOIN cmx_tipo_contrato ctc ON ctc.id = ccc.tipo_contrato
					WHERE 
						csol.peso_pendiente > 0
						AND cip.estado != 4
					GROUP BY csol.id 
					ORDER BY csol.fecha_solicitud ASC
				";
		} else {
			$sql = "
					SELECT 
						csol.id as 'id_solicitud', cip.numero_importacion,
						csol.*,
						ccc.id ID_CONTRATO, ccc.cod_contrato, ccc.porcentaje_ganancia, ctc.nombre TIPO_CONTRATO, 
						IF(
							(SELECT 
									COUNT(crvc1.id)
								FROM
									cmx_rndc_vehiculos_carroceria crvc1
								WHERE 
									crvc1.id = csol.tipo_carroceria) > 0
							, (SELECT 
								crvc1.descripcion
								FROM
									cmx_rndc_vehiculos_carroceria crvc1
								WHERE 
								crvc1.id = csol.tipo_carroceria)
							, NULL
						) as 'carroceria',
						scat.valor_compra,
						scat.valor_venta,
						cip.id_tipo_carga, 
						cc.nombre as 'nombre_cliente',
						((
							SELECT SUM(cms.peso_total) 
							FROM cmx_mercancia_solicitud cms 
							WHERE cms.id_solicitud = csol.id)+csol.tara_contenedor
						) as 'peso_total_solicitud',
						IF(
							cip.tipo_contenedor,
							(
								SELECT 
									ctc1.nombre
								FROM 
									cmx_tipo_contenedor ctc1 
								WHERE 
									ctc1.id = cip.tipo_contenedor
							),
							NULL
						) CONTENEDOR
					FROM 
						cmx_solicitudes csol
						INNER JOIN cmx_servicio_adicional_tramo scat ON scat.id_solicitud = csol.id
						INNER JOIN cmx_integracion_soluc_import cisi ON cisi.id_solucion = csol.id
						INNER JOIN cmx_importacion_actividades cia ON cia.id = cisi.id_importacion_actividad
						INNER JOIN cmx_importacion_proyecto cip ON cip.id = cia.id_importacion
						INNER JOIN cmx_clientes cc ON cc.id = csol.id_cliente 
						INNER JOIN cmx_tramo_solicitud cts ON cts.id_solicitud = csol.id
						INNER JOIN cmx_tramo_material ctm ON ctm.id_tramo = cts.id
						INNER JOIN cmx_contrato_cliente ccc ON ccc.id = cip.id_contrato
						INNER JOIN cmx_tipo_contrato ctc ON ctc.id = ccc.tipo_contrato
					WHERE 
						csol.peso_pendiente > 0
						AND cip.estado = 1
						AND cia.perfil_responsable IN (
							SELECT cuc1.id_perfil
							FROM cmx_clientes_serv_contratados ccsc1 
								INNER JOIN cmx_clientes_serv_responsables ccsr1 ON ccsr1.id_serv_contratado = ccsc1.id
								INNER JOIN cmx_usuario_cliente cuc1 ON cuc1.id_usuario = ccsr1.id_usuario
							WHERE ccsc1.estado = 1
								AND ccsr1.estado = 1
								AND ccsc1.id_cliente = cip.id_cliente
								AND ccsr1.id_usuario = " . $usuario["id_usuario"] . "
								AND cuc1.id_perfil = " . $usuario["id_perfil"] . "
								AND ccsc1.servicio = (
									SELECT 
										CASE
											WHEN cip.tipo_operacion = 'IMPORTACION' THEN 'Transporte de Carga Internacional'
											WHEN cip.tipo_operacion = 'EXPORTACION' THEN 'Transporte de Carga Internacional'
											WHEN cip.tipo_operacion = 'NACIONAL_AEREO' THEN 'Transporte de Carga Internacional'
											WHEN cip.tipo_operacion = 'NACIONAL' THEN 'Transporte de Carga Nacional'
											WHEN cip.tipo_operacion = 'URBANO' THEN 'Transporte de Carga Nacional'
											ELSE 'No definido'
										END
								)
						)
					GROUP BY csol.id 
					ORDER BY csol.fecha_solicitud ASC
				";
		}
		$consulta = $conexion->prepare($sql);
		$consulta->execute();
		$total         = $consulta->rowCount();
		$this->mensaje = $total;
		if ($total == 0) {
			$this->respuesta = "BAD";
		} else {
			$this->respuesta = "GOOD";

			while ($datos_solicitudes = $consulta->fetch()) {

				// Se consulta si la solicitud ya tiene agrupamientos registrado para sumar el valor ya asignado 
				$sql = "
						SELECT 
							SUM(ca.tarifa_transporte) FLETE_ACUMULADO, 
							SUM(cas.valor_prorrateado) PRORRATEO_ACUMULADO
						FROM 
							cmx_agrupacion_solicitudes cas
							INNER JOIN cmx_agrupaciones ca ON ca.id = cas.id_agrupacion
						WHERE 
							cas.id_solicitud = " . $datos_solicitudes["id_solicitud"] . "
					";
				$consulta_flete_acumulado = $conexion->prepare($sql);
				$consulta_flete_acumulado->execute();
				while ($array_flete_acumulado = $consulta_flete_acumulado->fetch()) {
					if ($array_flete_acumulado["FLETE_ACUMULADO"] > 0) {
						$flete_acumulado = $array_flete_acumulado["FLETE_ACUMULADO"];
					} else {
						$flete_acumulado = 0;
					}
					if ($array_flete_acumulado["PRORRATEO_ACUMULADO"] > 0) {
						$prorrateo_acumulado = $array_flete_acumulado["PRORRATEO_ACUMULADO"];
					} else {
						$prorrateo_acumulado = 0;
					}
				}
				$datos_solicitudes["flete_acumulado"] = $flete_acumulado;
				$datos_solicitudes["prorrateo_acumulado"] = $prorrateo_acumulado;

				// Se consulta la mercancia de la solicitud
				$sql      = "SELECT * FROM cmx_mercancia_solicitud WHERE id_solicitud = " . $datos_solicitudes["id_solicitud"] . " ";
				$consulta_mercancia = $conexion->prepare($sql);
				$consulta_mercancia->execute();
				$total_mercancia         = $consulta->rowCount();
				$tipo_movilizacion = "";
				$expreso = 0;
				$consolidado = 0;
				if ($total_mercancia == 0) {
				} else {
					while ($datos_mercancia = $consulta_mercancia->fetch()) {
						if ($datos_mercancia["tipo_movilizacion"] == "EXPRESO") {
							$expreso = 1;
						} else if ($datos_mercancia["tipo_movilizacion"] == "CONSOLIDADO") {
							$consolidado = 1;
						}
					}
				}
				if ($expreso == 1 && $consolidado == 1) {
					$tipo_movilizacion = "Expreso - Consolidado";
				} else if ($expreso == 1 && $consolidado == 0) {
					$tipo_movilizacion = "Expreso";
				} else if ($expreso == 0 && $consolidado == 1) {
					$tipo_movilizacion = "Consolidado";
				} else if ($expreso == 0 && $consolidado == 0) {
					$tipo_movilizacion = "Aún no hay movilización asignada";
				}

				$sql      = "SELECT * FROM cmx_tramo_solicitud WHERE id_solicitud = " . $datos_solicitudes["id_solicitud"] .
					" AND tipo_operacion = 'Descargue' ORDER BY fecha_hora_operacion ASC LIMIT 1 ";
				$consulta_tramo = $conexion->prepare($sql);
				$consulta_tramo->execute();
				$total_tramo        = $consulta_tramo->rowCount();
				$fecha_entrega = "";
				if ($total_tramo == 0) {
					$fecha_entrega = "Aún no hay fecha asignada";
				} else {
					$datos_tramo = $consulta_tramo->fetch();
					$fecha_entrega = $datos_tramo["fecha_hora_operacion"];
				}
				$datos_solicitudes["tipo_movilizacion"] = $tipo_movilizacion;
				$datos_solicitudes["fecha_entrega"] = $fecha_entrega;
				$sql      = " SELECT * FROM cmx_tipo_vehiculos WHERE id = " . $datos_solicitudes["tipo_vehiculo"] . " LIMIT 1";
				$consulta_vehiculo = $conexion->prepare($sql);
				$consulta_vehiculo->execute();
				$total_vehiculo = $consulta_vehiculo->rowCount();
				$datos_vehiculo = $consulta_vehiculo->fetch();

				if ($total_vehiculo == 0) {
					$datos_solicitudes["tipo_vehiculo"] = "";
				} else {
					$datos_solicitudes["tipo_vehiculo"] = $datos_vehiculo["nombre"];
				}
				$this->listado[] = $datos_solicitudes;
			}
		}
	}
}
