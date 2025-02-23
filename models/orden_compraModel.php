<?php
class orden_compraModel extends Model
{

	public function __construct()
	{
		parent::__construct();
	}

	public function getOrden_compra()
	{
		$orden_compra = $this->_db->getConsulta("select * from cmx_ordenes_compra;");
		return $orden_compra;
	}

	public function getTabla($id_cliente)
	{
		$sql = '
				SELECT 
					*,
					COUNT(crc.id) CANT_MATERIAL,
					(	
						SELECT COUNT(crc1.id) 
						FROM cmx_ordenes_compra crc1
						WHERE crc1.cs_num_de_orden = crc.cs_num_de_orden
					) TOTAL
				FROM 
					cmx_ordenes_compra crc
					INNER JOIN cmx_material_cliente cmc ON crc.cs_codigo = cmc.id
				WHERE 
					crc.estado IN (0,2)
					AND cmc.id_cliente IN ( 1 , ' . $id_cliente . ')
				GROUP BY crc.cs_num_de_orden;
			';
		// $orden_compra = $this->_db->getConsulta($sql);
		$orden_compra = $this->_db3->prepare($sql);
		$orden_compra->execute();
		$orden_compra = $orden_compra->fetchAll(PDO::FETCH_ASSOC);
		return $orden_compra;
	}

	public function getTablaProyectos()
	{
		$sql = "
				SELECT 
					*,
					COUNT(crc.id) CANT_MATERIAL
				FROM 
					cmx_ordenes_compra crc
				WHERE 
					crc.estado IN (1)
				GROUP BY crc.cs_num_de_orden;
			";
		// $orden_compra = $this->_db->getConsulta($sql);
		$orden_compra = $this->_db3->prepare($sql);
		$orden_compra->execute();
		$orden_compra = $orden_compra->fetchAll(PDO::FETCH_ASSOC);
		return $orden_compra;
	}

	public function getMateriales($id)
	{
		$sql = "
				SELECT 
					*
				FROM 
					cmx_ordenes_compra crc
				WHERE 
					crc.cs_num_de_orden = '" . $id . "'
			";
		// $orden_compra = $this->_db->getConsulta($sql);
		$orden_compra = $this->_db3->prepare($sql);
		$orden_compra->execute();
		$orden_compra = $orden_compra->fetchAll(PDO::FETCH_ASSOC);
		return $orden_compra;
	}

	public function getCargas($id, $grupo)
	{
		$_filtro_grupo = '';
		if ($grupo) {
			$_filtro_grupo = ' AND cac.grupo = ' . $grupo . ' ';
		}

		$sql = "
				SELECT 
					crc.*,COUNT(crc.id)AS count,
					cac.fecha_creacion 
				FROM 
					cmx_ordenes_compra crc
					INNER JOIN cmx_actividades_carga_oc cac ON cac.id_carga = crc.id
				WHERE 
					crc.estado = 1
					AND crc.cs_num_de_orden = '" . $id . "'
					" . $_filtro_grupo . "
					GROUP BY crc.id;
			";
		// echo "<p>" . $sql . "</p>";
		// $orden_compra = $this->_db->getConsulta($sql);
		$orden_compra = $this->_db3->prepare($sql);
		$orden_compra->execute();
		$orden_compra = $orden_compra->fetchAll(PDO::FETCH_ASSOC);
		return $orden_compra;
	}

	public function getActividades($id, $grupo)
	{
		$_filtro_grupo = "";
		if ($grupo) {
			$_filtro_grupo = ' AND cac.grupo = ' . $grupo . ' ';
		}
		$sql = "
				SELECT 
					cac.*,
					coc.cs_num_de_orden, cac.fecha_hora_inicio,
					cmo.codigo,cmo.id ID_MONEDA,
					(SELECT 
						cus.nom_usuario
					FROM 
						cmx_usuarios cus
					WHERE
						cus.id = cac.responsable) nom_usuario,
					(SELECT 
						cp.nombre_perfil 
					FROM 
						cmx_perfiles cp 
						INNER JOIN cmx_usuario_cliente cuc ON cuc.id_perfil = cp.id
						INNER JOIN cmx_actividades_carga_oc cac1 ON cac1.responsable = cuc.id
					WHERE 
						cac1.id = cac.id) nom_perfil, 
					(SELECT 
						cus.url_avatar
					FROM 
						cmx_usuarios cus
					WHERE
						cus.id = cac.responsable) avatar,
						IF ((SELECT COUNT('id') FROM cmx_aplazamiento_oc cao WHERE cao.id_actividad = cac.id) > 0,
						(SELECT MAX(cao.fecha_hora_aplazamiento) FROM cmx_aplazamiento_oc cao WHERE cao.id_actividad = cac.id),
						cac.fecha_hora_inicio) FECHA_HORA_INICIAL
				FROM 
					cmx_ordenes_compra coc
					INNER JOIN cmx_actividades_carga_oc cac ON cac.id_carga = coc.id
					INNER JOIN cmx_monedas cmo ON cmo.id = cac.moneda
				WHERE 
					coc.estado = 1
					AND cac.estado NOT IN (0)
					AND coc.cs_num_de_orden = '" . $id . "'
					" . $_filtro_grupo . "
					GROUP BY cac.nombre
			";
		// echo "<p>" . $sql . "</p>";
		// $actividades = $this->_db->getConsulta($sql);
		$actividades = $this->_db3->prepare($sql);
		$actividades->execute();
		// $actividades = $actividades->fetch(PDO::FETCH_ASSOC);
		$rowCount = $actividades->rowCount();  // Número de filas
		$actividades = $actividades->fetchAll(PDO::FETCH_ASSOC); // Array con los resultados

		return [
			'rowCount' => $rowCount,
			'data' => $actividades
		];
		// return $actividades;
	}

	public function getActividadActiva($id, $grupo)
	{
		$_filtro_grupo = "";
		if ($grupo) {
			$_filtro_grupo = ' AND cac.grupo = ' . $grupo . ' ';
		}
		$sql = "
				SELECT 
					cac.*
				FROM 
					cmx_ordenes_compra coc
					INNER JOIN cmx_actividades_carga_oc cac ON cac.id_carga = coc.id
				WHERE 
					coc.estado = 1
					AND cac.estado IN (2)
					" . $_filtro_grupo . "
					GROUP BY cac.nombre
			";
		// $actividades = $this->_db->getConsulta($sql);
		$actividades = $this->_db3->prepare($sql);
		$actividades->execute();
		$actividades = $actividades->fetchAll(PDO::FETCH_ASSOC);
		return $actividades;
	}

	public function getIdActividadesCarga($id, $orden)
	{
		$sql = "
				SELECT 
					cac.id
				FROM 
					cmx_ordenes_compra crc
					INNER JOIN cmx_actividades_carga_oc cac ON cac.id_carga = crc.id
				WHERE 
					crc.estado = 1
					AND cac.estado != 0
					AND crc.cs_num_de_orden = '" . $id . "'
					AND cac.orden = " . $orden . ";
			";
		// $orden_compra = $this->_db->getConsulta($sql);
		$orden_compra = $this->_db3->prepare($sql);
		$orden_compra->execute();
		$orden_compra = $orden_compra->fetchAll(PDO::FETCH_ASSOC);
		return $orden_compra;
	}

	public function getOrdenActividades($id, $grupo)
	{
		$sql = "
				SELECT 
					cac.id, cac.orden, cac.estado, cac.id_centro_costo
				FROM 
					cmx_ordenes_compra crc
					INNER JOIN cmx_actividades_carga_oc cac ON cac.id_carga = crc.id
				WHERE 
					cac.estado != 0
					AND crc.cs_num_de_orden = '" . $id . "'
					AND cac.grupo = '" . $grupo . "'
					ORDER BY cac.estado asc;
			";
		// echo "<p>" . $sql . "</p>";
		// $orden_compra = $this->_db->getConsulta($sql);
		$orden_compra = $this->_db3->prepare($sql);
		$orden_compra->execute();
		$orden_compra = $orden_compra->fetchAll(PDO::FETCH_ASSOC);
		return $orden_compra;
	}

	public function getActividadesPrevias($id, $orden, $grupo)
	{
		$sql = "
				SELECT 
					(	
						SELECT 
							cac1.nombre
						FROM
							cmx_actividades_carga_oc cac1
							INNER JOIN cmx_ordenes_compra coc1 ON coc1.id = cac1.id_carga
						WHERE 
							cac1.orden IN (cac.actividad_previa)
							AND cac1.estado != 0 
						GROUP BY cac.nombre
					) ACTIVIDAD_PREVIA
				FROM
					cmx_actividades_carga_oc cac
					INNER JOIN cmx_ordenes_compra coc ON coc.id = cac.id_carga
				WHERE 
					coc.cs_num_de_orden = '" . $id . "'
					AND cac.orden = '" . $orden . "'
					AND cac.estado != 0
					AND cac.grupo = '" . $grupo . "'
				GROUP BY cac.nombre;
			";
		// $actividadesPrevias = $this->_db->getConsulta($sql);
		$actividadesPrevias = $this->_db3->prepare($sql);
		$actividadesPrevias->execute();
		$actividadesPrevias = $actividadesPrevias->fetchAll(PDO::FETCH_ASSOC);
		return $actividadesPrevias;
	}

	public function getActividadesIncompletas($id, $grupo)
	{
		$sql = "
				SELECT 
					COUNT(cac.id) INVACIVAS
				FROM 
					cmx_ordenes_compra coc
					INNER JOIN cmx_actividades_carga_oc cac ON cac.id_carga = coc.id
				WHERE 
					coc.estado = 1
					AND cac.estado NOT IN (0,1)
					AND coc.cs_num_de_orden = '" . $id . "'
					AND cac.grupo = '" . $grupo . "';
			";
		// $actividades = $this->_db->getConsulta($sql);
		$actividades = $this->_db3->prepare($sql);
		$actividades->execute();
		$actividades = $actividades->fetchAll(PDO::FETCH_ASSOC);
		return $actividades;
	}

	public function getActividadesTerminadas($id, $grupo)
	{
		$sql = "
				SELECT 
					COUNT(DISTINCT(caco.nombre)) TERMINADAS
				FROM 
					cmx_ordenes_compra coc
					INNER JOIN cmx_actividades_carga_oc caco ON caco.id_carga = coc.id
				WHERE 
					coc.estado = 1
					AND caco.estado IN (1)
					AND coc.cs_num_de_orden = '" . $id . "'
					AND caco.grupo = '" . $grupo . "';
			";
		// $actividades = $this->_db->getConsulta($sql);
		$actividades = $this->_db3->prepare($sql);
		$actividades->execute();
		$actividades = $actividades->fetchAll(PDO::FETCH_ASSOC);
		return $actividades;
	}

	public function getActividadesInactivas($id)
	{
		$sql = "
				SELECT 
					COUNT(caco.id) CANTIDAD
				FROM 
					cmx_ordenes_compra coc
					INNER JOIN cmx_actividades_carga_oc caco ON caco.id_carga = coc.id
				WHERE 
					coc.estado = 1
					AND caco.estado IN (3)
					AND caco.grupo = (
						SELECT 
							MAX(caco1.grupo)
						FROM 
							cmx_actividades_carga_oc caco1 
							INNER JOIN cmx_ordenes_compra coc1 ON caco1.id_carga = coc1.id
						WHERE 
							coc1.cs_num_de_orden = coc.cs_num_de_orden
					)
					AND coc.cs_num_de_orden = '" . $id . "';
			";
		// $actividades = $this->_db->getConsulta($sql);
		$actividades = $this->_db3->prepare($sql);
		$actividades->execute();
		$actividades = $actividades->fetchAll(PDO::FETCH_ASSOC);
		return $actividades;
	}

	public function getActividadesAnuladas($id)
	{
		$sql = "
				SELECT 
					COUNT(coc.id) CANTIDAD
				FROM 
					cmx_ordenes_compra coc
				WHERE 
					coc.estado = 0
					AND coc.cs_num_de_orden = '" . $id . "';
			";
		// $actividades = $this->_db->getConsulta($sql);
		$actividades = $this->_db3->prepare($sql);
		$actividades->execute();
		$actividades = $actividades->fetchAll(PDO::FETCH_ASSOC);
		return $actividades;
	}

	public function getActividadesIniciadas($id)
	{
		$sql = "
				SELECT 
					COUNT(caco.id) CANTIDAD
				FROM 
					cmx_actividades_carga_oc caco
					INNER JOIN cmx_ordenes_compra coc ON caco.id_carga = coc.id
				WHERE
					coc.estado != 0
					AND caco.estado IN (1,2)
					AND caco.grupo = (
						SELECT 
							MAX(caco1.grupo)
						FROM 
							cmx_actividades_carga_oc caco1 
							INNER JOIN cmx_ordenes_compra coc1 ON caco1.id_carga = coc1.id
						WHERE 
							coc1.cs_num_de_orden = coc.cs_num_de_orden
					)
					AND coc.cs_num_de_orden = '" . $id . "';
			";
		// $actividades = $this->_db->getConsulta($sql);
		$actividades = $this->_db3->prepare($sql);
		$actividades->execute();
		$actividades = $actividades->fetchAll(PDO::FETCH_ASSOC);
		return $actividades;
	}

	public function getMax_grupo($id)
	{
		$sql = "
				SELECT 
					MAX(caco.grupo) MAX_GRUPO
				FROM 
					cmx_actividades_carga_oc caco
					INNER JOIN cmx_ordenes_compra coc ON caco.id_carga = coc.id
				WHERE
					coc.estado != 0
					AND coc.cs_num_de_orden = '" . $id . "';
			";
		// $max_grupo = $this->_db->getConsulta($sql);
		$max_grupo = $this->_db3->prepare($sql);
		$max_grupo->execute();
		$max_grupo = $max_grupo->fetchAll(PDO::FETCH_ASSOC);
		return $max_grupo;
	}

	public function getIdActividades($id, $orden, $grupo)
	{
		$sql = "
				SELECT 
					cac.id,
					cac.orden
				FROM 
					cmx_ordenes_compra coc
					INNER JOIN cmx_actividades_carga_oc cac ON cac.id_carga = coc.id
				WHERE 
					coc.estado = 1
					AND cac.estado IN (1,2,3)
					AND coc.cs_num_de_orden = '" . $id . "'
					AND cac.grupo = '" . $grupo . "'
					AND cac.orden = '" . $orden . "';
			";
		// $actividades = $this->_db->getConsulta($sql);
		$actividades = $this->_db3->prepare($sql);
		$actividades->execute();
		$actividades = $actividades->fetchAll(PDO::FETCH_ASSOC);
		return $actividades;
	}

	public function getActividadesCarga($id)
	{
		$sql = "
				SELECT 
					cac.*,
					cmo.codigo,
					(SELECT 
						cus.nom_usuario
					FROM 
						cmx_usuarios cus
					WHERE
						cus.id = cac.responsable) nom_usuario,
					(SELECT 
						cus.url_avatar
					FROM 
						cmx_usuarios cus
					WHERE
						cus.id = cac.responsable) avatar

				FROM 
					cmx_actividades_carga_oc cac 
					INNER JOIN cmx_monedas cmo ON cmo.id = cac.moneda
				WHERE 
					cac.id_carga = '" . $id . "'
			";
		// $actividades = $this->_db->getConsulta($sql);
		$actividades = $this->_db3->prepare($sql);
		$actividades->execute();
		$actividades = $actividades->fetchAll(PDO::FETCH_ASSOC);
		return $actividades;
	}

	public function getVerificaActividades($orden_compra)
	{
		$valida = true;
		$sql = "
				SELECT 
					coc.id,
					(
						SELECT 
							COUNT(cac1.id_carga)
						FROM 
							cmx_ordenes_compra coc1
							INNER JOIN cmx_actividades_carga_oc cac1 ON coc1.id = cac1.id_carga
						WHERE 
							coc1.id = coc.id
					) CANTIDAD
				FROM 
					cmx_ordenes_compra coc
				WHERE 
					coc.estado = 1
					AND coc.cs_num_de_orden = '" . $orden_compra . "';
			";
		// $array = $this->_db->getConsulta($sql);
		$array = $this->_db3->prepare($sql);
		$array->execute();
		$array = $array->fetchAll(PDO::FETCH_ASSOC);
		return $array;
	}

	public function getMaterialesProyecto($id)
	{
		$sql = "
				SELECT 
					crc.id, crc.cs_codigo, crc.cs_descripcion1, crc.cs_descripcion2,
					crc.cs_categoria, crc.cs_subcategoria, crc.cs_cantidad_solicitada,
					crc.cs_fecha_especificacion, crc.estado
				FROM 
					cmx_ordenes_compra crc
					LEFT JOIN cmx_actividades_carga_oc cac ON cac.id_carga = crc.id
				WHERE 
					crc.estado = 1
					AND cac.id_carga IS NULL
					AND crc.cs_num_de_orden = '" . $id . "';
			";
		// $orden_compra = $this->_db->getConsulta($sql);
		$orden_compra = $this->_db3->prepare($sql);
		$orden_compra->execute();
		$orden_compra = $orden_compra->fetchAll(PDO::FETCH_ASSOC);
		return $orden_compra;
	}

	public function getAplazamientos($id)
	{
		$sql = "
				SELECT 
					cao.*, 
					CONCAT('../public/files/ordenes_compra_oc/aplazamientos/',cao.id_actividad,'/',cao.url) URL_FILE,
					cj.nombre, cj.descripcion 
				FROM 
					cmx_aplazamiento_oc cao 
					INNER JOIN cmx_justificaciones cj ON cj.id = cao.id_justificacion
				WHERE 
					cao.id_actividad = '" . $id . "'
				ORDER BY cao.id DESC;
			";
		// echo "<p>" . $sql . "</p>";
		// $aplazamientos = $this->_db->getConsulta($sql);
		$aplazamientos = $this->_db3->prepare($sql);
		$aplazamientos->execute();
		$aplazamientos = $aplazamientos->fetchAll(PDO::FETCH_ASSOC);
		return $aplazamientos;
	}

	// public function getGrupoCargas($id)
	// {
	// 	$sql = "
	// 			SELECT 
	// 				caco.grupo
	// 			FROM 
	// 				cmx_actividades_carga_oc caco
	// 				INNER JOIN cmx_ordenes_compra coc ON caco.id_carga = coc.id
	// 			WHERE 
	// 				coc.cs_num_de_orden = '" . $id . "'
	// 			GROUP BY caco.grupo;
	// 		";
	// 	// echo "<p>" . $sql . "</p>";
	// 	// $result = $this->_db->getConsulta($sql);
	// 	$result = $this->_db3->prepare($sql);
	// 	$result->execute();
	// 	$result->rowCount();
	// 	$result = $result->fetchAll(PDO::FETCH_ASSOC);
	// 	return $result;
	// }

	public function getGrupoCargas($id)
	{
		$sql = "
        SELECT 
            caco.grupo
        FROM 
            cmx_actividades_carga_oc caco
            INNER JOIN cmx_ordenes_compra coc ON caco.id_carga = coc.id
        WHERE 
            coc.cs_num_de_orden = :id
        GROUP BY caco.grupo;
    ";

		$stmt = $this->_db3->prepare($sql);
		$stmt->bindParam(':id', $id, PDO::PARAM_STR);
		$stmt->execute();

		$rowCount = $stmt->rowCount();  // Número de filas
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC); // Array con los resultados

		return [
			'rowCount' => $rowCount,
			'data' => $result
		];
	}


	public function buscaMaterialNumero($num_material, $id_cliente)
	{
		$sql = '
				SELECT 
					id
				FROM 
					cmx_material_cliente
				WHERE
					codigo = "' . $num_material . '"
					AND id_cliente = "' . $id_cliente . '"
					AND estado = 1;
			';
		// $riesgo = $this->_db->getConsulta($sql);
		$riesgo = $this->_db3->prepare($sql);
		$riesgo->execute();
		$riesgo = $riesgo->fetch(PDO::FETCH_ASSOC);
		return $riesgo;
	}

	public function getEntregableActividad($id, $orden, $grupo)
	{
		$sql = '
				SELECT 
					ceao.*
				FROM 
					cmx_ordenes_compra coc
					INNER JOIN cmx_actividades_carga_oc caco ON coc.id = caco.id_carga
					INNER JOIN cmx_entregable_actividad_oc ceao ON ceao.id_actividad = caco.id
				WHERE
					coc.cs_num_de_orden = ' . $id . '
					AND caco.orden = ' . $orden . '
					AND caco.grupo = ' . $grupo . '
				LIMIT 1;
			';
		// $entregables = $this->_db->getConsulta($sql);
		$entregables = $this->_db3->prepare($sql);
		$entregables->execute();
		$entregables = $entregables->fetch(PDO::FETCH_ASSOC);
		return $entregables;
	}

	// SELECT MULTIPLE GENERICO DE ACTIVIDADES
	public function getHtmlSelectMultiple($name, $id, $orden, $bloque)
	{

		$_filtro_orden = "";
		if ($orden) {
			$_filtro_orden = " AND cac.orden != " . $orden . " ";
		}
		if ($name) {
			$query = '
					SELECT 
						cac.orden, cac.nombre,
						cac.estado 
					FROM 
						cmx_actividades_carga_oc cac
						INNER JOIN cmx_ordenes_compra coc ON coc.id = cac.id_carga
					WHERE 
						cac.orden >= (SELECT MIN(cac1.orden) FROM cmx_actividades_carga_oc cac1 WHERE cac1.estado IN (2,3))
						AND coc.cs_num_de_orden = "' . $id . '"
						AND cac.estado != 0
						AND cac.bloque IN (0,' . $bloque . ')
						' . $_filtro_orden .  '
					GROUP BY cac.orden;
				';
			// echo $query;
			// $array = $this->_db->getConsulta($query);
			$array = $this->_db3->prepare($query);
			$array->execute();
			$array = $array->fetchAll(PDO::FETCH_ASSOC);

			$query = '
					SELECT 
						COUNT(cac.id) ACTIVOS
					FROM 
						cmx_actividades_carga_oc cac
						INNER JOIN cmx_ordenes_compra coc ON coc.id = cac.id_carga
					WHERE 
						cac.orden >= (SELECT MIN(cac1.orden) FROM cmx_actividades_carga_oc cac1 WHERE cac1.estado IN (2,3))
						AND cac.estado IN (1,2)
						AND coc.cs_num_de_orden = "' . $id . '";
				';
			// echo $query;
			// $arrayCantidad = $this->_db->getConsulta($query);
			$arrayCantidad = $this->_db3->prepare($query);
			$arrayCantidad->execute();
			$arrayCantidad = $arrayCantidad->fetch(PDO::FETCH_ASSOC);

			// Se recorre contenido de la consulta
			if ($array) {
				$select = '
						<select class="tags" multiple="multiple" name="' . $name . '" id="slct_actividades_plantilla_' . $id . $orden . '" aria-hidden="true">
					';
				$select .= '<option value="" disabled>seleccione</option>';
				$option_primer_actividad = '';
				if ($arrayCantidad[0]['ACTIVOS'] == 0) {
					$option_primer_actividad = '<option value="0">Primer Actividad</option>';
				}
				foreach ($array as $key => $value) {

					if ($value["orden"] == 1) {
						$select .= $option_primer_actividad;
					}
					if ($orden == $value["orden"]) {
						$select .= '<option value="' . $value["orden"] . '" selected="">(' . $value["orden"] . ') - ' . $value["nombre"] . '</option>';
					} else {
						$select .= '<option value="' . $value["orden"] . '">(' . $value["orden"] . ') - ' . $value["nombre"] . '</option>';
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


	// CONSULTAS PARA LA DASHBOARD
	public function getOrdenCompraPendientes()
	{
		$sql = "
				SELECT 
					COUNT(DISTINCT(coc.cs_num_de_orden)) NO_INICIADO
				FROM 
					cmx_ordenes_compra coc 
				WHERE 
					coc.estado = 2
			";
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetch(PDO::FETCH_ASSOC);
		return $result;
	}

	public function getProyectosIniciados()
	{
		$sql = "
				SELECT 
					COUNT(DISTINCT(coc.cs_num_de_orden))
				FROM 
					cmx_ordenes_compra coc 
					INNER JOIN cmx_actividades_carga_oc caco ON caco.id_carga = coc.id
				WHERE 
					caco.estado = 2
					GROUP BY coc.cs_num_de_orden
			";
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetch(PDO::FETCH_ASSOC);
		return $result;
	}
}
