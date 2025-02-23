<?php

include '../application/Conexion.php';
require_once '../application/Config.php';
session_start();
class Agrupaciones{
    public $user_log;
    public $pass;
    public $mensaje;
    public $respuesta;
    public $email;
    public $listado;

	public function verdatossolicitud(){
		$id_usuario = $_SESSION["usuario"]["id_usuario"];
		$id_solicitud = $_POST["id_solicitud"];

		$Data = new Consultas;
		// Se busca la información general de la solicitud
		$sql = '
			SELECT 
				DISTINCT(cs.id) ID_SOLICITUD, cs.*, cip.id ID_PROYECTO, cip.id_contrato,
				cc.nombre NOMBRE_CLIENTE, 
				cu.nom_usuario NOMBRE_USUARIO, cu.url_avatar, cus.operacion, 
				IF(
					(	SELECT COUNT(crvc1.id)
						FROM cmx_rndc_vehiculos_carroceria crvc1
						WHERE crvc1.id = cs.tipo_carroceria) > 0
					,(	SELECT crvc1.descripcion
						FROM cmx_rndc_vehiculos_carroceria crvc1
						WHERE crvc1.id = cs.tipo_carroceria)
					, NULL
				) CARROCERIA,
				IF(
					(   SELECT COUNT(ctv1.id)
						FROM cmx_tipo_vehiculos ctv1
						WHERE ctv1.id = cs.tipo_vehiculo) > 0
					,(  SELECT ctv1.nombre
						FROM cmx_tipo_vehiculos ctv1
						WHERE ctv1.id = cs.tipo_vehiculo)
					, NULL
				) TIPO_VEHICULO
			FROM 
				cmx_solicitudes cs
				INNER JOIN cmx_clientes cc ON cc.id = cs.id_cliente
				INNER JOIN cmx_usuario_solicitud cus ON cus.id_solicitud = cs.id
				INNER JOIN cmx_usuarios cu ON cu.id = cus.id_usuario
				INNER JOIN cmx_integracion_soluc_import cisi ON cisi.id_solucion = cs.id
				INNER JOIN cmx_importacion_actividades cia ON cia.id = cisi.id_importacion_actividad
				INNER JOIN cmx_importacion_proyecto cip ON cip.id = cia.id_importacion
			WHERE 
				cs.id = ' . $id_solicitud . '
				AND cus.operacion = "Crear";
		';
		$result = $Data->getConsulta($sql);

        if ($result) {
            $info_general = $result["rowsData"][0];
            $return["info_general"] = $info_general;

			// Se busca la información del contrato 
			if ($info_general["id_contrato"]) {
				// $return["contrato"]["info"] = $result["rowsData"][0];
				$return["contrato"]["info"] = $this->verContratoSolicitud($Data, $info_general["id_contrato"]);

				// Se buscan los tramos del contrato
				$return["contrato"]["tramos"] = $this->verContratoTramos($Data, $info_general["id_contrato"], $info_general["id_cliente"]);

				// Se buscan los tipo de vehiculo del contrato
				$return["contrato"]["tipos_vehiculo"] = $this->verContratoTipoVehiculos($Data, $info_general["id_contrato"]);

				// Se buscan las condiciones del contrato
				$return["contrato"]["condiciones"] = $this->verContratoCondiciones($Data, $info_general["id_contrato"]);
			}

			// Se busca la información de los tramos de la solicitud 
			$sql = '
				SELECT
					cts.*, crd.sigla, crd.direccion,
					CONCAT(cm.municipio, " (", cm.depto," - ", cm.pais,")") MUNICIPIO
				FROM
					cmx_tramo_solicitud cts
					INNER JOIN cmx_remitente_destinatario crd ON crd.id = cts.id_remitente_destinatario
					INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
				WHERE
					cts.id_solicitud = ' . $info_general[0] . '
			';
			$result = $Data->getConsulta($sql);
			if ($result) {
				foreach ($result["rowsData"] as $key => $value) {
					$return["tramo"][] = $value;
					$sql = '
						SELECT
							ctm.*, cim.nombre, cim.codigoUN
						FROM
							cmx_tramo_material ctm
							INNER JOIN cmx_importacion_material cim ON cim.id = ctm.id_material_proyecto
						WHERE
							ctm.id_tramo = ' . $value[0] . '
					;';
					$result = $Data->getConsulta($sql);
					if ($result) {
						$return["tramo_material"][$value[0]] = $result["rowsData"];
					}
				}
			}
		}
		return $return;
	}
	/***** FUNCIONES PARA TOMAR INFORMACIÓN DE CONTRATOS *****/
	public function verContratoSolicitud($Data, $id_contrato){
		$sql = '  
			SELECT 
				ccc.*,
				ctc.nombre, ctc.descripcion
			FROM 
				cmx_contrato_cliente ccc
				INNER JOIN cmx_tipo_contrato ctc ON ctc.id = ccc.tipo_contrato
			WHERE 
				ccc.id = ' . $id_contrato . ';
		';
		$result = $Data->getConsulta($sql);
		return $result["rowsData"][0];
	}

	public function verContratoTramos($Data, $id_contrato, $id_cliente){
		$sql = '  
			SELECT 
				cct.*,
				CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais,")") MUNICIPIO, cm.rndc_codigo_ciudad
			FROM 
				cmx_contrato_tramos cct
				INNER JOIN cmx_municipios cm ON cm.id = cct.id_ciudad
			WHERE 
				cct.id_contrato = ' . $id_contrato . ';
		';
		$result["ciudades"] = $Data->getConsulta($sql);

		// Se buscan los remitentes destinatarios del cliente por ciudad 
		if ($result["ciudades"]) {
			foreach ($result["ciudades"]["rowsData"] as $key => $value) {
				$sql = '
					SELECT 
						crd.*, CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") MUNICIPIO
					FROM 
						cmx_remitente_destinatario crd
						INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
					WHERE 
						crd.id_cliente IN (1,' . $id_cliente . ')
						AND crd.id_ciudad = ' . $value["id_ciudad"] . '
						-- AND crd.rndc_id IS NOT NULL
						AND crd.estado = 1;
				';
				$result_01 = $Data->getConsulta($sql);
				$result["remi_dest"][$value["id_ciudad"]] = $result_01["rowsData"];
			}
		}
		return $result;
	}

	public function verContratoTipoVehiculos($Data, $id_contrato){
		$sql = '
			SELECT 
				ccv.*,
				ctv.nombre, ctv.peso_maximo
			FROM 
				cmx_contrato_vehiculo ccv
				INNER JOIN cmx_tipo_vehiculos ctv ON ctv.id = ccv.id_vehiculo
			WHERE 
				ccv.id_contrato = ' . $id_contrato . ';
		';
		$result = $Data->getConsulta($sql);
		return $result;
	}

	public function verContratoCondiciones($Data, $id_contrato){
		$sql = '  
			SELECT 
				ccc.*,
				ctcc.tipo_dato, ctcc.nombre, ctcc.descripcion DESCRIPCION_CONDICION
			FROM 
				cmx_contrato_condiciones ccc
				INNER JOIN cmx_tipo_contrato_condicion ctcc ON ctcc.id = ccc.id_condicion
			WHERE 
				ccc.id_contrato = ' . $id_contrato . ';
		';
		$result = $Data->getConsulta($sql);
		return $result;
	}

	public function verParamServiciosAdicionales($Data){
		$sql = '  
                SHOW COLUMNS FROM 
                    cmx_servicio_adicional_tramo 
                LIKE "tipo_servicio" 
		';
		$result = $Data->getConsulta($sql);

		foreach ($result["rowsData"] as $key => $value) {
			$value["Type"] = str_replace("enum(", "", $value["Type"]);
			$value["Type"] = str_replace(")", "", $value["Type"]);
			$value["Type"] = str_replace("'", "", $value["Type"]);
			$array = explode(",", $value["Type"]);
		}
		return $array;
	}
	/***** FIN - FUNCIONES PARA TOMAR INFORMACIÓN DE CONTRATOS *****/

    public function agruparsolicitudes(){// De varias solicitudes a un vehículo
        $model    = new Conexion;
        $conexion = $model->conectar();
        $tipo_vehiculo = $_POST["tipo_vehiculo"];
        $solicitudes = $_POST["solicitudes"];
        $valor_prorrateo = $_POST["valor_prorrateo"];
        $valor_codigo_rojo = $_POST["codigo_rojo"];
        $estado = $_POST["estado"];
        $tarifa_transporte = $_POST["tarifa_transporte"];

        $num_agrupacion = 'AGS-'.time();

        $suma_pesos=0;
        for ($i=0;$i<count($solicitudes); $i++){
            $suma_pesos+=$solicitudes[$i]["peso_solicit"];
        }
        $codigo_rojo =0;
        if ($valor_codigo_rojo == "true"){
            $codigo_rojo =1;
        }
        else if ($valor_codigo_rojo == "false"){
            $codigo_rojo =0;
        }
        $sql      = " INSERT INTO cmx_agrupaciones (numero_agrupacion, peso_total, codigo_rojo, tarifa_transporte, fecha_hora_operacion, estado) VALUES ('$num_agrupacion', $suma_pesos, '$codigo_rojo', " . $_POST["tarifa_transporte"] . ", NOW(), " . $_POST["estado"] . ")";
        $crearagrupacion = $conexion->prepare($sql);
        $crearagrupacion->execute();
        $flag_descosolidar = false;  
        $id_materiales = "";

        // Variables para la gestion de actividades
        $id_actividades = "";
        $id_material_proyecto = "";

        for ( $i = 0 ; $i < count($solicitudes) ; $i++ ){
            if ( $solicitudes[$i]["peso_solicit"] > 0 ) {
                // Se toma el id de la agrupacion generada
                $sql ="SELECT MAX(id) FROM cmx_agrupaciones";
                $busca_id_agrupacion = $conexion->prepare($sql);
                $busca_id_agrupacion->execute();
                $datos_id_agrupacion = $busca_id_agrupacion->fetch();

                // Se crea array de envío para generar el registro en la desconsolidacion 
                $info_agrupacion_material[ $solicitudes[$i]["id_material_proyecto"] ]["id_material"] = $solicitudes[$i]["id_material_solicitud"];
                $info_agrupacion_material[ $solicitudes[$i]["id_material_proyecto"] ]["id_material_proyecto"] = $solicitudes[$i]["id_material_proyecto"];
                $info_agrupacion_material[ $solicitudes[$i]["id_material_proyecto"] ]["id_agrupacion"] = $datos_id_agrupacion[0];
                $info_agrupacion_material[ $solicitudes[$i]["id_material_proyecto"] ]["peso"] = $solicitudes[$i]["peso_solicit"];
                $info_agrupacion_material[ $solicitudes[$i]["id_material_proyecto"] ]["valor_declarado"] = $solicitudes[$i]["valor_declarado_parcial"];

                // Se actualiza la cantidad disponible de material de la solicitud
                $sql = "
                    UPDATE cmx_mercancia_solicitud 
                    SET peso_pendiente = IF(
                        ( peso_pendiente - " . $solicitudes[$i]["peso_solicit"] . " ) < 0.1  , 
                        0, 
                        ( peso_pendiente - " . $solicitudes[$i]["peso_solicit"] . " ))
                    WHERE id = " . $solicitudes[$i]["id_material_solicitud"];
                $actualiza_solicitud = $conexion->prepare($sql);
                $actualiza_solicitud->execute();

                // Se actualiza la cantidad disponible de material del tramo
                $sql = "
                    UPDATE cmx_tramo_material 
                    SET peso_pendiente = IF(
                        ( peso_pendiente - " . $solicitudes[$i]["peso_solicit"] . " ) < 0.1  , 
                        0, 
                        ( peso_pendiente - " . $solicitudes[$i]["peso_solicit"] . " ))
                    WHERE id = " . $solicitudes[$i]["id_material"];
                $actualiza_tramo_material = $conexion->prepare($sql);
                $actualiza_tramo_material->execute();


                // Se actualiza la solicitud restando le peso del material
                $sql      = "
                    UPDATE cmx_solicitudes 
                    SET peso_pendiente = IF(
                        ( peso_pendiente - " . $solicitudes[$i]["peso_solicit"] . " ) < 0.1  , 
                        0, 
                        ( peso_pendiente - " . $solicitudes[$i]["peso_solicit"] . " ))
                    WHERE id = ".$solicitudes[$i]["id_solicitud"]."";
                $actualiza_solicitud = $conexion->prepare($sql);
                $actualiza_solicitud->execute();

                // Se consulta cuanto peso de material queda pendiente
                $sql ="SELECT * FROM cmx_solicitudes 
                        WHERE id = ".$solicitudes[$i]["id_solicitud"]." LIMIT 1 ";
                $busca_solicitud = $conexion->prepare($sql);
                $busca_solicitud->execute();
                $datos_solicitud = $busca_solicitud->fetch();
                $peso_pendiente =$datos_solicitud["peso_pendiente"];

                // Se busca la informacion de las actividades del material para su gestion en proyectos
                $sql ="
                    SELECT 
                        cia.*
                    FROM 
                        cmx_integracion_soluc_import cisi
                        INNER JOIN cmx_importacion_actividades cia ON cia.id = cisi.id_importacion_actividad
                        INNER JOIN cmx_importacion_material cim ON cim.id = cia.id_material
                        INNER JOIN cmx_mercancia_solicitud cms ON cms.id_material_proyecto = cim.id
                    WHERE 
                        cisi.id_solucion = " . $solicitudes[$i]["id_solicitud"] . "
                        AND cms.id = " . $solicitudes[$i]["id_material_solicitud"] . "
                        AND cia.estado = 2;
                ";
                $busca_actividad = $conexion->prepare($sql);
                $busca_actividad->execute();
                while ( $datos_actividad = $busca_actividad->fetch() ){
                    // Se pregunta si se solicitó algún material
                    if ( $solicitudes[$i]["unidades_solicitadas"] > 0 ) {
		                // Se crea array de parametros de inserción de los materiales solicitados en el agrupamiento si no es necesario desconsolidar
		                if ( $solicitudes[$i]["peso_pendiente"] == 0 ) {
							$actividadesBloque = $this->actividadesBloque($datos_actividad["id"]);
		                    $sqlAgrupacionMaterial[] = " 
		                    	INSERT INTO cmx_agrupacion_material 
		                    		(id_material, id_material_proyecto, orden_actividad, id_agrupamiento, peso, valor_declarado) 
		                    	VALUES (" . $solicitudes[$i]["id_material_solicitud"] . "," . $solicitudes[$i]["id_material_proyecto"] . ", '" . $actividadesBloque . "', (SELECT MAX(id) FROM cmx_agrupaciones)," . $solicitudes[$i]["peso_solicit"] . "," . $solicitudes[$i]["valor_declarado_parcial"] . ")";
		                }

                        if( isset( $id_actividades[ $datos_actividad["id_importacion"] ]["id"] ) && $id_actividades[ $datos_actividad["id_importacion"] ]["id"] != "" ){
                            $id_actividades[ $datos_actividad["id_importacion"] ]["id"] = $id_actividades[ $datos_actividad["id_importacion"] ]["id"] . $datos_actividad["id"] . ",";
                        }else{
                            $id_actividades[ $datos_actividad["id_importacion"] ]["id"] = $datos_actividad["id"] . ",";
                        }

                        if( isset( $id_material_proyecto[ $datos_actividad["id_importacion"] ]["id_materiales"] ) && $id_material_proyecto[ $datos_actividad["id_importacion"] ]["id_materiales"] != "" ) {
                            if ( $this->validaActividad( $id_material_proyecto[ $datos_actividad["id_importacion"] ]["id_materiales"] , $datos_actividad["id_material"] ) ) {
                                $id_material_proyecto[ $datos_actividad["id_importacion"] ]["id_materiales"] = $id_material_proyecto[ $datos_actividad["id_importacion"] ]["id_materiales"] . $datos_actividad["id_material"] . ",";
                                $array_mercancia_solicitada[ $datos_actividad["id_importacion"] ]["cantidad_solicitada_"][ $datos_actividad["id_material"] ] = $solicitudes[$i]["unidades_solicitadas"];
                            }else{
                                $array_mercancia_solicitada[ $datos_actividad["id_importacion"] ]["cantidad_solicitada_"][ $datos_actividad["id_material"] ]+= $solicitudes[$i]["unidades_solicitadas"];
                            }
                        } else {
                            $id_material_proyecto[ $datos_actividad["id_importacion"] ]["id_materiales"] = $datos_actividad["id_material"] . ",";
                            $array_mercancia_solicitada[ $datos_actividad["id_importacion"] ]["cantidad_solicitada_"][ $datos_actividad["id_material"] ] = $solicitudes[$i]["unidades_solicitadas"];
                        }

                        $array_mercancia_solicitada[ $datos_actividad["id_importacion"] ]["id_solicitud"] = $solicitudes[$i]["id_solicitud"];
                        $array_mercancia_solicitada[ $datos_actividad["id_importacion"] ]["id_importacion"] = $datos_actividad["id_importacion"];
                        $array_mercancia_solicitada[ $datos_actividad["id_importacion"] ]["orden"] = $datos_actividad["orden"];
                        $array_mercancia_solicitada[ $datos_actividad["id_importacion"] ]["tipo_actividad"] = $datos_actividad["tipo_actividad"];
                        $array_mercancia_solicitada[ $datos_actividad["id_importacion"] ]["fecha_hora_inicio"] = $datos_actividad["fecha_hora_inicio"];
                        $array_mercancia_solicitada[ $datos_actividad["id_importacion"] ]["costo_real"] = $datos_actividad["costo_real"];
                        $array_mercancia_solicitada[ $datos_actividad["id_importacion"] ]["respuesta"] = $datos_actividad["costo_real"];
                        $array_mercancia_solicitada[ $datos_actividad["id_importacion"] ]["id"] = $id_actividades[ $datos_actividad["id_importacion"] ]["id"];
                        $array_mercancia_solicitada[ $datos_actividad["id_importacion"] ]["id_material"] = $id_material_proyecto[ $datos_actividad["id_importacion"] ]["id_materiales"];
                    } 
                }
            }
        }

        // Se guarda la informacion de la tabla cmx_agrupamiento solicitud
        foreach ($_POST["peso_solicitado_solicitud"] as $key => $value) {
            if ($value) {
                // Se inserta la agrupacion de la solicitud
                $sql = " INSERT INTO cmx_agrupacion_solicitudes (id_solicitud, id_agrupacion, peso_parcial, valor_prorrateado, tipo_vehiculo) 
                        VALUES (" . $key . ", 
                            (SELECT MAX(id) FROM cmx_agrupaciones), 
                            " . $value . ",
                            " . $valor_prorrateo[ $key ] . ",
                            '$tipo_vehiculo')";
                $crear_agrup_solic = $conexion->prepare($sql);
                $crear_agrup_solic->execute();
            }
        }

        // Se determina si la solicitud hay que desconsolidarla o si se gestiona la actividad
        $contador_gestion_actividades = 0;
        $contador_desconsolidacion = 0;
        foreach ($array_mercancia_solicitada as $key => $value) {
            // Si el peso de la solicitud es igual al peso disponible se gestiona la actividad (crear array de gestion de actividad)
            if ($_POST["peso_solicitado_solicitud"][ $value["id_solicitud"] ] == $_POST["peso_disponible_solicitud"][ $value["id_solicitud"] ]) {
                $actividades[ $contador_gestion_actividades ]["id"] = $value["id"];
                $actividades[ $contador_gestion_actividades ]["id_importacion"] = $value["id_importacion"];
                $actividades[ $contador_gestion_actividades ]["id_material"] = $value["id_material"];

                $actividades[ $contador_gestion_actividades ]["orden"] = $value["orden"];
                $actividades[ $contador_gestion_actividades ]["tipo_actividad"] = $value["tipo_actividad"];
                $actividades[ $contador_gestion_actividades ]["fecha_hora_inicio"] = $value["fecha_hora_inicio"];
                $actividades[ $contador_gestion_actividades ]["costo_real"] = $value["costo_real"];
                $actividades[ $contador_gestion_actividades ]["respuesta"] = $value["respuesta"];

                $contador_gestion_actividades++;
            } else {// Si el peso de la solicitud es diferente se desconsolida (crear array de desconsolidacion)
                // Se cuenta la cantidad de grupos que tiene el proyecto
                $sql = "
                    SELECT 
                        COUNT( DISTINCT(cia.grupo) ) CANT_GRUPOS
                    FROM 
                        cmx_importacion_actividades cia 
                    WHERE
                        cia.id_importacion = " . $value["id_importacion"];
                $busca_grupos = $conexion->prepare($sql);
                $busca_grupos->execute();
                $datos_grupos = $busca_grupos->fetch();

                // Se sigue llenando el arreglo del material
                $desconsolidar[ $contador_desconsolidacion ]["id_materiales"] = $value["id_material"];
                $desconsolidar[ $contador_desconsolidacion ]["id_importacion"] = $value["id_importacion"];
                $desconsolidar[ $contador_desconsolidacion ]["cant_grupos"] = $datos_grupos["CANT_GRUPOS"];
                $desconsolidar[ $contador_desconsolidacion ]["cantidad_solicitada_"] = $value["cantidad_solicitada_"];
                $desconsolidar[ $contador_desconsolidacion ]["orden"] = $value["orden"];

                $contador_desconsolidacion++;
            }
        } 
        $return["total_solicitado"] = $_POST["peso_solicitado_solicitud"];
        $return["total_disponible"] = $_POST["peso_disponible_solicitud"];


        if (isset($actividades)) {
            // Se ajusta el array de actividades para enviar parámetros 
            $actividades = $this->arrayGestionActividades($actividades);
            $return["actividades"] = $actividades;

            // Se ingresa el material del agrupamiento 
            foreach ($sqlAgrupacionMaterial as $key => $value) {
                $inserta_material_agrupamiento = $conexion->prepare($value);
                $inserta_material_agrupamiento->execute();
            }
        }

        if (isset($desconsolidar)) {
            $return["material_solicitado"] = $desconsolidar;
            $return["agrupacion_material"] = $info_agrupacion_material;
        }

        $return["flag_varias_solicitudes"] = true;
        $return["success"] = true;
        return $return;
    }

    public function desagruparsolicitudes(){ // De una solicitud a varios vehículos
        $model    = new Conexion;
        $conexion = $model->conectar();

        $id_solicitud = $_POST["id_solicitud"];
        $estado_agrupacion = $_POST["estado"];
        $vehiculos = $_POST["vehiculos"];
        $return["count_vehiculos"] = "";
        $return["cuenta_vehiculos"] = count($vehiculos);
        $flag_agrupamiento = false;
        for ( $i = 1 ; $i < count($vehiculos); $i++){
            $return["count_vehiculos"].= $i . ",";
            $num_agrupacion = 'AGS-'.time();
            $codigo_rojo =0;
            if (isset($vehiculos[$i]["codigo_rojo"])) {
                if($vehiculos[$i]["codigo_rojo"] == "true"){
                    $codigo_rojo =1;
                }
                else if($vehiculos[$i]["codigo_rojo"] == "false"){
                    $codigo_rojo =0;
                }
                $sql = "    INSERT INTO cmx_agrupaciones (
                                numero_agrupacion,peso_total,codigo_rojo,fecha_hora_operacion,tarifa_transporte,estado
                            ) 
                            VALUES (
                                '$num_agrupacion',".$vehiculos[$i]["peso_vehiculo"].",'$codigo_rojo',NOW(),".$vehiculos[$i]["tarifa_transporte"].",$estado_agrupacion
                            )
                        ";
                $crearagrupacion = $conexion->prepare($sql);
                $crearagrupacion->execute();
                sleep(1);

                // Se toma el id de la agrupacion generada
                $sql ="SELECT MAX(id) FROM cmx_agrupaciones";
                $busca_id_agrupacion = $conexion->prepare($sql);
                $busca_id_agrupacion->execute();
                $datos_id_agrupacion = $busca_id_agrupacion->fetch();

                $sql = " INSERT INTO cmx_agrupacion_solicitudes (id_solicitud, id_agrupacion, peso_parcial, valor_prorrateado, tipo_vehiculo) 
                        VALUES ($id_solicitud,(SELECT MAX(id) FROM cmx_agrupaciones),".$vehiculos[$i]["peso_vehiculo"].",".$vehiculos[$i]["valor_prorrateo"].",'".$vehiculos[$i]["tipo_vehiculo"]."')";
                $crear_agrup_solic = $conexion->prepare($sql);
                $crear_agrup_solic->execute();

                // Se inserta los materiales del agrupamiento
                $id_actividades = "";
                $id_material_proyecto = "";

                $cantidad_solicitada = Array();

                $info_agrupacion_material = Array();
                foreach ($vehiculos[$i]["materiales"] as $key => $value) {
                    if ( $value["peso"] > 0 ) {
                        // Se actualiza la cantidad disponible de material de la solicitud
                        $sql = "
                            UPDATE cmx_mercancia_solicitud 
                            SET peso_pendiente = IF(
                                ( peso_pendiente - " . $value["peso"] . " ) < 0.1  , 
                                0, 
                                ( peso_pendiente - " . $value["peso"] . " ))
                            WHERE id = " . $value["id_material_solicitud"];
                        $actualiza_solicitud = $conexion->prepare($sql);
                        $actualiza_solicitud->execute();

                        // Se actualiza la cantidad disponible de material del tramo
                        $sql = "
                            UPDATE cmx_tramo_material 
                            SET peso_pendiente = IF(
                                ( peso_pendiente - " . $value["peso"] . " ) < 0.1  , 
                                0, 
                                ( peso_pendiente - " . $value["peso"] . " ))
                            WHERE id = " . $value["id_material"];
                        $actualiza_tramo_material = $conexion->prepare($sql);
                        $actualiza_tramo_material->execute();

                        // Se busca la informacion de las actividades del material para su gestion en proyectos
                        $sql ="
                            SELECT 
                                cia.*
                            FROM 
                                cmx_integracion_soluc_import cisi
                                INNER JOIN cmx_importacion_actividades cia ON cia.id = cisi.id_importacion_actividad
                                INNER JOIN cmx_importacion_material cim ON cim.id = cia.id_material
                                INNER JOIN cmx_mercancia_solicitud cms ON cms.id_material_proyecto = cim.id
                            WHERE 
                                cisi.id_solucion = " . $id_solicitud . "
                                AND cms.id = " . $value["id_material_solicitud"] . "
                                AND cia.estado = 2;
                        ";
                        $busca_actividad = $conexion->prepare($sql);
                        $busca_actividad->execute();

                        while ( $datos_actividad = $busca_actividad->fetch() ){
                        	// Se guarda los datos de la tabla cmx_agrupacion_material
	                        if ( !$flag_agrupamiento AND (count($vehiculos) - 1) > 1 ) {
								$actividadesBloque = $this->actividadesBloque($datos_actividad["id"]);
	                            $sql = " 
	                                INSERT INTO cmx_agrupacion_material 
	                                    (id_material, id_material_proyecto, orden_actividad, id_agrupamiento, peso, valor_declarado) 
	                                VALUES 
	                                    (" . $value["id_material_solicitud"] . ",
	                                    " . $value["id_material_proyecto"] . ",
	                                    '" . $actividadesBloque . "',
	                                    " . $datos_id_agrupacion[0] . ", 
	                                    " . $value["peso"] . ",
	                                    '" . $value["valor_declarado"] . "')";
	                            $inserta_material_agrupamiento = $conexion->prepare($sql);
	                            $inserta_material_agrupamiento->execute();
	                        }
	                        elseif ( (count($vehiculos) - 1) == 1 AND $value["peso_pendiente"] == 0 ) {
								$actividadesBloque = $this->actividadesBloque($datos_actividad["id"]);
	                            $sql = " 
	                                INSERT INTO cmx_agrupacion_material 
	                                    (id_material, id_material_proyecto, orden_actividad, id_agrupamiento, peso, valor_declarado) 
	                                VALUES 
	                                    (" . $value["id_material_solicitud"] . ",
	                                    " . $value["id_material_proyecto"] . ",
	                                    '" . $actividadesBloque . "',
	                                    " . $datos_id_agrupacion[0] . ", 
	                                    " . $value["peso"] . ",
	                                    '" . $value["valor_declarado"] . "')";
	                            $inserta_material_agrupamiento = $conexion->prepare($sql);
	                            $inserta_material_agrupamiento->execute();
	                        }else{
	                            // Se crea array de envío para generar el registro en la desconsolidacion
	                            $info_agrupacion_material[ $value["id_material_proyecto"] ]["id_material"] = $value["id_material_solicitud"];
	                            $info_agrupacion_material[ $value["id_material_proyecto"] ]["id_material_proyecto"] = $value["id_material_proyecto"];
	                            $info_agrupacion_material[ $value["id_material_proyecto"] ]["id_agrupacion"] = $datos_id_agrupacion[0];
	                            $info_agrupacion_material[ $value["id_material_proyecto"] ]["peso"] = $value["peso"];
	                            $info_agrupacion_material[ $value["id_material_proyecto"] ]["valor_declarado"] = $value["valor_declarado"];
	                        }


                            if ( $this->validaActividad( $id_material_proyecto , $datos_actividad["id_material"] ) ) {
                                $id_actividades.= $datos_actividad["id"] . ",";
                                $id_material_proyecto.= $datos_actividad["id_material"] . ",";
                                $cantidad_solicitada[$datos_actividad["id_material"]] = $value["cantidad_solicitada"];
                            }else{
                                $cantidad_solicitada[$datos_actividad["id_material"]]+= $value["cantidad_solicitada"];
                            }

                            $arrayActividades[ $i - 1 ]["id_importacion"] = $datos_actividad["id_importacion"];
                            $arrayActividades[ $i - 1 ]["orden"] = $datos_actividad["orden"];
                            $arrayActividades[ $i - 1 ]["tipo_actividad"] = $datos_actividad["tipo_actividad"];
                            $arrayActividades[ $i - 1 ]["fecha_hora_inicio"] = $datos_actividad["fecha_hora_inicio"];
                            $arrayActividades[ $i - 1 ]["costo_real"] = $datos_actividad["costo_real"];
                            $arrayActividades[ $i - 1 ]["respuesta"] = $datos_actividad["respuesta"];
                        }
                        $arrayActividades[ $i - 1 ]["id"] = $id_actividades;
                        $arrayActividades[ $i - 1 ]["id_material"] = $id_material_proyecto;
                    }
                }
                $return["orden"] = $arrayActividades[0]["orden"];
                $agrupacion_material[] = $info_agrupacion_material;
                $flag_agrupamiento = true;
                $array_materiales["materiales"][$i]["id_materiales"] = $id_material_proyecto;
                $array_materiales["materiales"][$i]["cantidad_solicitada"] = $cantidad_solicitada;

                $sql = "
                    UPDATE cmx_solicitudes 
                    SET peso_pendiente = IF(
                        ( peso_pendiente - " . $vehiculos[$i]["peso_vehiculo"] . " ) < 0.1  , 
                        0, 
                        ( peso_pendiente - " . $vehiculos[$i]["peso_vehiculo"] . " ))
                    WHERE id = $id_solicitud ";
                $actualiza_solicitud = $conexion->prepare($sql);
                $actualiza_solicitud->execute();

                $sql = "SELECT * FROM cmx_solicitudes 
                        WHERE id = ".$id_solicitud." LIMIT 1 ";
                $busca_solicitud = $conexion->prepare($sql);
                $busca_solicitud->execute();
                $datos_solicitud = $busca_solicitud->fetch();
                $peso_pendiente = $datos_solicitud["peso_pendiente"];

                // Se busca el id del proyecto
                $sql = "
                    SELECT 
                       DISTINCT(cia.id_importacion)
                    FROM 
                        cmx_integracion_soluc_import cisi
                        INNER JOIN cmx_importacion_actividades cia ON cia.id = cisi.id_importacion_actividad
                    WHERE
                        cisi.id_solucion = " . $id_solicitud;

                $busca_proyecto = $conexion->prepare($sql);
                $busca_proyecto->execute();
                $datos_proyecto = $busca_proyecto->fetch();
                $array_materiales["materiales"][$i]["id_importacion"] = $datos_proyecto["id_importacion"];

                // Se cuenta la cantidad de grupos que tiene el proyecto
                $sql = "
                    SELECT 
                        COUNT( DISTINCT(cia.grupo) ) CANT_GRUPOS
                    FROM 
                        cmx_importacion_actividades cia 
                    WHERE
                        cia.id_importacion = " . $datos_proyecto["id_importacion"];

                $busca_grupos = $conexion->prepare($sql);
                $busca_grupos->execute();
                $datos_grupos = $busca_grupos->fetch();
                $array_materiales["materiales"][$i]["cant_grupos"] = $datos_grupos["CANT_GRUPOS"] + ( $i - 1 );

                // Si se despacha todo el material y se envía en un solo vehículo de cierra la actividad 
                if ( intval($peso_pendiente) <= 0 ){
                    $actividades = $this->arrayGestionActividades( $arrayActividades );
                    $return["actividades"] = $actividades;
                    if( count($vehiculos) > 2 ){
                        $return["agrupacion_material"] = $agrupacion_material;
                        $return["materiales"] = $array_materiales["materiales"];
                        $return["varios_vehiculos"] = true;
                    }
                }else{
                    $return["agrupacion_material"] = $agrupacion_material;
                    $return["materiales"] = $array_materiales["materiales"];
                }
            }
        }
        $return["success"]= true;
        return $return;
    }

    public function cargartiposvehiculos (){
        $sql = "SELECT * FROM cmx_tipo_vehiculos";
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

    public function obtenerdatosvehiculos(){
        $nombre = $_POST["nombre"];
        $sql = "SELECT * FROM cmx_tipo_vehiculos WHERE nombre = '$nombre' LIMIT 1";
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

    public function vermaterialsolicitud(){
		$Data = new Consultas;
		$id_solicitud = $_POST["id_solicitud"];

		$sql = "
			SELECT 
				ctm.*,
				cts.tipo_operacion,
				cms.id_material_proyecto, cms.tipo_mercancia, crd.id_ciudad ID_CIUDAD_DESTINO, crd.nombre, crd.direccion,
				ctm.peso_pendiente DISPONIBLE,
				ROUND( (ctm.peso_pendiente * ctm.unidades) / ctm.peso ) UNIDADES_DIPONIBLES
			FROM 
				cmx_tramo_solicitud cts
				INNER JOIN cmx_tramo_material ctm ON ctm.id_tramo = cts.id
				INNER JOIN cmx_mercancia_solicitud cms ON cms.id = ctm.id_material
				INNER JOIN cmx_remitente_destinatario crd ON crd.id = cts.id_remitente_destinatario
			WHERE 
				cts.id_solicitud = $id_solicitud
				AND cts.tipo_operacion = 'Descargue'
			HAVING DISPONIBLE > 0
			ORDER BY ctm.id;
		";
		$result = $Data->getConsulta($sql);

		if ($result) {
			$return["success"]= true;
			foreach ($result["rowsData"] as $key => $value) {
				$return["content"][] = $value;
			}
		} else {
			$return["success"]= false;
		}
		return $return;
	}

    public function arrayGestionActividades( $arrayActividades ){
        $i = 0;
        foreach ($arrayActividades as $key => $value) {
            $actividades[$i]["id_importacion"] = $value["id_importacion"];
            $actividades[$i]["orden"] = $value["orden"];
            $actividades[$i]["tipo_actividad"] = $value["tipo_actividad"];
            $actividades[$i]["fecha_hora_inicio"] = $value["fecha_hora_inicio"];
            $actividades[$i]["costo_real"] = $value["costo_real"];
            $actividades[$i]["respuesta"] = $value["costo_real"];
            $actividades[$i]["id"] = $value["id"];
            $actividades[$i]["id_material"] = $value["id_material"];
            $i++;
        }
        return $actividades;
    }

    // Funcion para buscar si un id material esta en un arreglo
    public function validaActividad( $arrayIdMaterial , $id_material ){
        $array = explode(",", $arrayIdMaterial);
        $flag = true;
        for ($i=0; $i < ( count($array) - 1 ) ; $i++) { 
            if ( $array[$i] == $id_material ) {
                $flag = false;
                break;
            }
        }
        return $flag;
    }

	// Funcion para buscar la tarifa de un tramo  
	public function buscartarifa(){
		$Data = new Consultas;

		$id_contrato = $_POST["id_contrato"];
		$tipo_vehiculo = $_POST["tipo_vehiculo"];
		$destino = $_POST["destino"];
		$tipo_carga = $_POST["tipo_carga"];
		$return = "";
		$msg = 0;

		if ($id_contrato AND $tipo_vehiculo) {
			$sql = '
				SELECT 
					ccv.flete_maximo TARIFA
				FROM 
					cmx_contrato_vehiculo ccv
				WHERE 
					ccv.id_contrato = ' . $id_contrato . '
					AND ccv.id_vehiculo = ' . $tipo_vehiculo . '
			';
			$result = $Data->getConsulta($sql);

			if ($result) {
				foreach ($result["rowsData"] as $key => $value) {
					if ( $value["TARIFA"] ) {
						$msg = $value["TARIFA"];
					}
				}
			}
		}
		return $msg;
	}

	// Funcion para buscar la tarifa de un tramo
	public function buscartarifa_con_puerto(){ // No esta en funcionamiento pero se podría usar después 
        $remitente = $_POST["remitente"];
        $origen = $_POST["origen"];
        $destino = $_POST["destino"];
        $tipo_carga = $_POST["tipo_carga"];
        $tipo_vehiculo = $_POST["tipo_vehiculo"];
        $return = "";
        // Se identifica si el remitente es un puerto
        $sql = "
            SELECT 
                *
            FROM 
                cmx_puertos cp
            WHERE
                cp.id_remtente_destinatario = " . $remitente . "
                AND estado = 1;
        ";

        $model    = new Conexion;
        $conexion = $model->conectar();
        $consulta = $conexion->prepare($sql);
        $consulta->execute();
        $flag_puerto = $consulta->rowCount();

        if ( $flag_puerto > 0 ) { // el remitente es un puerto 
            $msg = "Es un puerto";
            $sql = "
                SELECT 
                    ct.tarifa
                FROM 
                    cmx_tarifas ct
                WHERE
                    ct.origen = $origen
                    AND ct.destino = $destino
                    AND ct.tipo_vehiculo = $tipo_vehiculo
                    AND ct.tipo_embalaje = $tipo_carga
                    AND ct.tipo_origen = 'PUERTO'
                    AND ct.estado = 1;
            ";

            $model    = new Conexion;
            $conexion = $model->conectar();
            $consulta = $conexion->prepare($sql);
            $consulta->execute();
            $flag_tarifa = $consulta->rowCount();
            if ($flag_tarifa > 0) {
                while ($datos_tarifa = $consulta->fetch()) {
                    $msg = $datos_tarifa;
                }
            }else{
                $msg = $datos_tarifa;
            }
        } else { // El remitente no es un puerto
            $msg = "No es un puerto";
            $sql = "
                SELECT 
                    ct.tarifa
                FROM 
                    cmx_tarifas ct
                WHERE
                    ct.origen = $origen
                    AND ct.destino = $destino
                    AND ct.tipo_vehiculo = $tipo_vehiculo
                    AND ct.tipo_embalaje = $tipo_carga
                    AND ct.tipo_origen = 'NACIONAL'
                    AND ct.estado = 1;
            ";

            $model    = new Conexion;
            $conexion = $model->conectar();
            $consulta = $conexion->prepare($sql);
            $consulta->execute();
            $flag_tarifa = $consulta->rowCount();
            if ($flag_tarifa > 0) {
                while ($datos_tarifa = $consulta->fetch()) {
                    $msg = $datos_tarifa["tarifa"];
                }
            }else{
                $msg = $flag_tarifa;
            }
        }
        return $msg;
    }

    // Funcion para buscar la tarifa adicional de entrega  
    public function buscaTarifaAdicional(){
        $msg = "";
        $tipo_vehiculo = $_POST["tipo_vehiculo"];
        $tipo_entrega = $_POST["tipo_entrega"];
        // Se identifica si el remitente es un puerto
        $sql = "
            SELECT 
                *
            FROM 
                cmx_tarifas_entrega_adicional ctea
            WHERE
                ctea.id_tipo_vehiculo = " . $tipo_vehiculo . "
                AND ctea.tipo_entrega = '" . $tipo_entrega . "'
                AND ctea.estado = 1;
        ";
        $model    = new Conexion;
        $conexion = $model->conectar();
        $consulta = $conexion->prepare($sql);
        $consulta->execute();
        while ($datos_tarifa_adicional = $consulta->fetch()) {
            $msg = $datos_tarifa_adicional["tarifa"];
        }

        return $msg;
    }

    // Función para preguntar si la solicitud tiene servicios adicionales de desconsolidación   
    public function buscaDesconsolidacion(){
        $id_solicitud = $_POST["id_solicitud"];
        // Se identifica si el remitente es un puerto
        $sql = "
            SELECT 
                COUNT(csat.id) CUANTOS
            FROM 
                cmx_servicio_adicional_tramo csat
            WHERE 
                csat.id_solicitud = $id_solicitud
                AND csat.tipo_servicio = 'Desconsolidacion';
        ";

        $model    = new Conexion;
        $conexion = $model->conectar();
        $consulta = $conexion->prepare($sql);
        $consulta->execute();
        while ($datos_desconsolida = $consulta->fetch()) {
            $msg = $datos_desconsolida["CUANTOS"];
        }
        return $msg;
    }

	public function actividadesBloque($id_actividad){
		$Data = new Consultas;
		$sql ="
			SELECT 
				cia.*
			FROM 
				cmx_importacion_actividades cia
			WHERE 
				cia.id = " . $id_actividad . "
		";
		$resultActividades = $Data->getConsulta($sql);

		$orden = 0;
		$bloque_anterior = 0;
		$return = "";
		$_falgActividades = true;
		foreach ($resultActividades["rowsData"] as $key => $value) {
			$orden = $value["orden"];
			$return.= $orden . ",";
			do {
				$orden++;
				$sql = "
					SELECT 
						cia.orden, cia.bloque
					FROM 
						cmx_importacion_actividades cia
					WHERE 
					cia.id_importacion = " . $value["id_importacion"] . "
					AND cia.grupo = " . $value["grupo"] . "
					AND cia.id_material = " . $value["id_material"] . "
					AND cia.orden = " . $orden . "
				";
				$resultActividadesBloque = $Data->getConsulta($sql);

				if ($resultActividadesBloque["rowsData"][0]["bloque"] > $bloque_anterior) {
					$return.= $orden . ",";
					$bloque_anterior = $resultActividadesBloque["rowsData"][0]["bloque"];
				} else {
					$_falgActividades = false;
				}
			} while ($_falgActividades);
			$return.= "0";
		}

		return $return;
	}
}
