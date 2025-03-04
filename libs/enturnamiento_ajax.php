<?php
	include("../application/Config.php");
	include '../application/Conexion.php';

	$Data = new Consultas;

	$result["control"] = '';
	$result["content"] = '';

	switch ( $_POST["action"] ) {
		case 'ver_detalle_conductor':
			$result["control"].= "Entro en ver_detalle_conductor\n";
			$sql = '
				SELECT 
					cp.id ID_CONDUCTOR, cv.id ID_VEHICULO, cae.id ID_TURNO, cae.estado,
					IF(
						(SELECT 
							COUNT(cae1.id)
						FROM
							cmx_app_enturnamientos cae1
						WHERE 
							cae1.id_conductor = cv.id_conductor
							AND cae1.estado = "ENTURNADO"
							AND DATEDIFF( NOW() , cae1.fecha_ubicacion ) < 4
					) > 0,
					(SELECT 
						(SELECT 
							COUNT(cae2.id)
						FROM 
							cmx_app_enturnamientos cae2
						WHERE 
							cae2.fecha_ubicacion <= cae1.fecha_ubicacion
							AND cae2.estado = "ENTURNADO"
							AND DATEDIFF( NOW() , cae2.fecha_ubicacion ) < 4
						) CUANTOS
						FROM 
							cmx_app_enturnamientos cae1
						WHERE 
							cae1.id_conductor = cv.id_conductor
							AND cae1.estado = "ENTURNADO"
							AND DATEDIFF( NOW() , cae1.fecha_ubicacion ) < 4
						),
						"N/A"
					) TURNO,
					cp.numero_documento, cp.nombre, cp.direccion, cp.contacto,
					cae.latitud, cae.longitud
				FROM 
					cmx_proveedores cp
					INNER JOIN cmx_vehiculos cv ON cp.id = cv.id_conductor
					INNER JOIN cmx_app_enturnamientos cae ON cae.id_conductor = cv.id_conductor
				WHERE 
					cp.id = ' . $_POST["id"] . '
					AND cp.estado = "Activo"
					AND cv.estado = "Activo"
					AND DATEDIFF( NOW() , cae.fecha_ubicacion ) < 4
				GROUP BY TURNO, cae.estado
			';
			$request["conductor"] = $Data->getConsulta($sql);

			if ( $request["conductor"] ) {
				$result["control"].= "Si hay conductor\n";
				$result["control"].= "Se encontró " . $request["conductor"]["rowsNum"] . " registros\n";
				foreach ($request["conductor"]["rowsData"] as $key => $value) {
					/********* Se toma la información de la ubicación donde se realizó la ubicación *********/
					$result["ubicacion"]["latitud"] = $value["latitud"];
					$result["ubicacion"]["longitud"] = $value["longitud"];
					/********* Fin - Se toma la información de la ubicación donde se realizó la ubicación *********/

					/********* Se toma la información del conductor enturnado *********/
					// Contenido del Título
					$result["content"]["title"] = 'Información del Conductor - ' . $value["nombre"];

					// Se filtra el contenido del turno 
					$_estado_turno = '
						<span>Turno:</span>
						<span class="cell-detail-description">' . $value["TURNO"] . '</span>
					';
					if ( $value["TURNO"] == "N/A") {
						$_estado_turno = '
							<span>Estado:</span>
							<span class="cell-detail-description">' . $value["estado"] . '</span>
						';
					}

					// Contenido de la información general del Seguimiento 
					$result["content"]["body"]["general"] = '
						<span><strong>Información General</strong></span>
						<table class="table">
							<tbody>
								<tr>
									<td class="cell-detail">
										<div class="col-sm-3">
											' . $_estado_turno . '
										</div>
										<div class="col-sm-3">
											<span>Nombre:</span>
											<span class="cell-detail-description">' . $value["nombre"] . '</span>
										</div>
										<div class="col-sm-3">
											<span>Documento:</span>
											<span class="cell-detail-description">' . $value["numero_documento"] . '</span>
										</div>
										<div class="col-sm-3">
											<span>Contacto:</span>
											<span class="cell-detail-description">' . $value["contacto"] . '</span>
										</div>
									</td>
								</tr>
								<tr>
									<td class="cell-detail"></td>
								</tr>
							</tbody>
						</table>
					';

					// Se busca la información de los vehpiculos que maneja el conductor
					$sql = '
						SELECT 
							cv.id, cv.placa, cv.placa_trailer, ctv.nombre, ctv.peso_maximo, cv.tipo_carroceria
						FROM 
							cmx_vehiculos cv
							INNER JOIN cmx_tipo_vehiculos ctv ON ctv.id = cv.tipo_vehiculo
						WHERE 
							cv.id_conductor = ' . $value["ID_CONDUCTOR"] . '
							AND cv.estado = "Activo"
							AND ctv.estado = 1
					';
					$request["vehiculos"] = $Data->getConsulta($sql);

					if ( $request["vehiculos"] ) {
						$_table_vehiculos = '
							<span><strong>Información Vehículos</strong></span>
							<table class="table">
								<thead>
									<tr class="nexos-encabezado">
										<th style="width: 15%;">Placa</th>
										<th>Característica</th>
									</tr>
								</thead>
								<tbody>
						';
						foreach ($request["vehiculos"]["rowsData"] as $key_01 => $value_01) {
							// Se filtra si el vehiculo tiene Trailer
							$_placa_trailer = '';
							if ( $value_01["placa_trailer"] ) {
								$_placa_trailer = 'Trailer - ' . $value_01["placa_trailer"];
							}

							$_table_vehiculos.= '
								<tr>
									<td class="cell-detail">
										<span>' . $value_01["placa"] . '</span>
										<span class="cell-detail-description">' . $_placa_trailer . '</span>
									</td>
									<td class="cell-detail">
										<span>' . $value_01["nombre"] . '</span>
										<span class="cell-detail-description">' . $value_01["tipo_carroceria"] . '</span>
										<span class="cell-detail-description">Capacidad - ' . $value_01["peso_maximo"] . ' Kg.</span>
									</td>
								</tr>
							';
						}
						$_table_vehiculos.= '
									<tr>
										<td class="cell-detail"></td>
										<td class="cell-detail"></td>
									</tr>
								</tbody>
							</table>
						';

						$_content_turno = '
							<div class="col-md-6  col-sm-6 col-xs-12 ">
								<span><strong>Ubicación Turno</strong></span>
								<div class="bs-grid-block">
									<div class="content">
										<div id="mapa" style="background-color: gray; width: 100%; height: 100%;"></div>
									</div>
								</div>
							</div>
							<div class="col-md-6  col-sm-6 col-xs-12 ">
								' . $_table_vehiculos . '
							</div>
							<div class="row"></div>
						';
						$result["content"]["body"]["content_turno"] = $_content_turno;
					}
				}
			}
			break;

		case 'rechaza_turno':
			$result["control"].= "Entro en rechaza_turno\n";

			$array = Array();
			$array["estado"] = $_POST["estado"];
			$array["observacion"] = $_POST["observacion"];

			$Data->updateRegistro("cmx_app_enturnamientos", $array, $_POST["id"]);
			break;

		default:
			$result["control"].= "Error en la selección de acción de archivo";
			break;
	}

	echo json_encode( $result );

?>