<?php
	include("../application/Config.php");
	include '../application/Conexion.php';

	$Data = new Consultas;

	$result["control"] = '';
	$result["content"] = Array();

	switch ( $_POST["accion"] ) {
		case 'busca_actividades':
			$result["control"].= "Entro en busca_actividades\n";
			// Se buscan las actividades de Anticipos
			$sql = '
				SELECT 
					cia.*
				FROM 
					cmx_importacion_actividades cia
					INNER JOIN cmx_agrupacion_material cam ON cam.id_material_proyecto = cia.id_material
				WHERE 
					cam.id_agrupamiento = ' . $_POST["id"] . '
					AND cia.tipo_actividad = "anticipo"
			';
			$request = $Data->getConsulta($sql);

			if ( isset($request) ) {
				$_id_actividad = "";
				$_id_material = "";
				$result["content"]["anticipo"] = '';

				$i = 0;
				foreach ($request["rowsData"] as $key => $value) {
					$result["content"]["anticipo"].= '
						<input type="hidden" id="id_actividad_anticipo_' . $_POST["id"] . '_' . $i . '" value="' . $value["id"] . '">
						<input type="hidden" id="id_importacion_anticipo_' . $_POST["id"] . '_' . $i . '" value="' . $value["id_importacion"] . '">
						<input type="hidden" id="id_material_anticipo_' . $_POST["id"] . '_' . $i . '" value="' . $value["id_material"] . '">
						<input type="hidden" id="orden_anticipo_' . $_POST["id"] . '_' . $i . '" value="' . $value["orden"] . '">
						<input type="hidden" id="tipo_actividad_anticipo_' . $_POST["id"] . '_' . $i . '" value="' . $value["tipo_actividad"] . '">
						<input type="hidden" id="fecha_hora_inicio_anticipo_' . $_POST["id"] . '_' . $i . '" value="' . date("Y-m-d H:i:s", time() ) . '">
						<input type="hidden" id="costo_real_anticipo_' . $_POST["id"] . '_' . $i . '" value="' . $value["costo_real"] . '">
						<input type="hidden" id="respuesta_anticipo_' . $_POST["id"] . '_' . $i . '" value="' . $value["respuesta"] . '">
					';
					$i++;
				}
			}

			// Se buscan las actividades de Informar Anticipos
			$sql = '
				SELECT 
					cia.*
				FROM 
					cmx_importacion_actividades cia
					INNER JOIN cmx_agrupacion_material cam ON cam.id_material_proyecto = cia.id_material
				WHERE 
					cam.id_agrupamiento = ' . $_POST["id"] . '
					AND cia.nombre = "Informar asignación anticipo al conductor"
			';
			$request = $Data->getConsulta($sql);

			if ( isset($request) ) {
				$_id_actividad = "";
				$_id_material = "";
				$result["content"]["informar_anticipo"] = '';

				$i = 0;
				foreach ($request["rowsData"] as $key => $value) {
					$result["content"]["informar_anticipo"].= '
						<input type="hidden" id="id_actividad_informar_' . $_POST["id"] . '_' . $i . '" value="' . $value["id"] . '">
						<input type="hidden" id="id_importacion_informar_' . $_POST["id"] . '_' . $i . '" value="' . $value["id_importacion"] . '">
						<input type="hidden" id="id_material_informar_' . $_POST["id"] . '_' . $i . '" value="' . $value["id_material"] . '">
						<input type="hidden" id="orden_informar_' . $_POST["id"] . '_' . $i . '" value="' . $value["orden"] . '">
						<input type="hidden" id="tipo_actividad_informar_' . $_POST["id"] . '_' . $i . '" value="' . $value["tipo_actividad"] . '">
						<input type="hidden" id="fecha_hora_inicio_informar_' . $_POST["id"] . '_' . $i . '" value="' . date("Y-m-d H:i:s", time() ) . '">
						<input type="hidden" id="costo_real_informar_' . $_POST["id"] . '_' . $i . '" value="' . $value["costo_real"] . '">
						<input type="hidden" id="respuesta_informar_' . $_POST["id"] . '_' . $i . '" value="' . $value["respuesta"] . '">
					';
					$i++;
				}
			}
			break;

		default:
			$result["control"].= "Error en la selección de acción de archivo";
			break;
	}

	echo json_encode( $result );
?>
