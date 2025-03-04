<?php 
	include("../application/Config.php");
	include '../application/Conexion.php';
	include '../application/Model.php';
	include '../models/municipiosModel.php';
	//include '../controllers/web_serviceController.php';

	$_msg_error = "";
	$_msg_control = "Entro en remitentes_ajax.php\n";
	$_array_result = Array();

	$Data = new Consultas;
	$Model = new Model;

	// $return["get"] = $_GET;
	// $return["post"] = $_POST;

	switch ( $_GET["action"] ) {
		case 'verRemiDestId':
			$_msg_control.= "Entro en la accion verRemiDestId.\n";

			$sql = '
				SELECT 
					crd.*,
					cm.municipio, cm.depto, cm.pais, cm.rndc_codigo_ciudad,
					CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") CIUDAD_REMI_DEST,
					cc.nombre NOM_CLIENTE
				FROM 
					cmx_remitente_destinatario crd
					INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
					INNER JOIN cmx_clientes cc ON cc.id = crd.id_cliente
				WHERE 
					crd.id = ' . $_POST["id"] . '
			;';
			$result = $Data->getConsulta($sql);

			$return["response"] = $result;

			// Se busca si el registro de encuentra en el RNDC
			if ( $result["rowsData"][0]["rndc_id"] ) {
				$return["RNDC_response"] = "Se debe buscar en el rndc";


				if($result["rowsData"][0]["tipo_documento"]=='NIT'){
					$consulta_tipo="N";
					$consulta_num=($result["rowsData"][0]["documento"].$result["rowsData"][0]['digito_verificacion']); 
				}else{
					$consulta_tipo="C";
					$consulta_num=$result["rowsData"][0]["documento"];
				}

				$arrayMinTrans = Array();
				// Solicitud
				$arrayMinTrans["solicitud"] = Array(
					"tipo" => 3,
					"procesoid" => 11,
				);
				// Variable que se envían para la consulta  
				$arrayMinTrans["variables"] = "INGRESOID,FECHAING,NUMNITEMPRESATRANSPORTE,CODTIPOIDTERCERO,NUMIDTERCERO,NOMIDTERCERO,PRIMERAPELLIDOIDTERCERO,SEGUNDOAPELLIDOIDTERCERO,NUMTELEFONOCONTACTO,NOMENCLATURADIRECCION,CODMUNICIPIORNDC,CODSEDETERCERO,NOMSEDETERCERO,NUMLICENCIACONDUCCION,CODCATEGORIALICENCIACONDUCCION,FECHAVENCIMIENTOLICENCIA,LATITUD,LONGITUD";

				$arrayMinTrans["documento"] = Array(
					"NUMNITEMPRESATRANSPORTE" => MINTRANS_NIT,
					"NUMIDTERCERO" => "'".$consulta_num."'"
				);

				$result = $Data->getRNDCQueryArray( $arrayMinTrans ); 

				if( isset($result["ErrorMSG"]) ){
					$_msg_error.= $result["ErrorMSG"];
				}else{
					$return["result_info_remi_dest"] = $result;
				}
			}else{
				$return["RNDC_response"] = "No se debe buscar en el rndc";
			}
			break;

		case 'verRemiDestDoc':
			$_msg_control.= "Entro en la accion verRemiDestDoc.\n";

			$sql = '
				SELECT 
					crd.*,
					cm.municipio, cm.depto, cm.pais, cm.rndc_codigo_ciudad,
					CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") CIUDAD_REMI_DEST,
					cc.nombre NOM_CLIENTE
				FROM 
					cmx_remitente_destinatario crd
					INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
					INNER JOIN cmx_clientes cc ON cc.id = crd.id_cliente
				WHERE 
					crd.documento = "' . $Model->limpiaTexto($_POST["doc_remi_dest"]) . '"
					AND crd.id_cliente = ' . $Model->limpiaTexto($_POST["id_cliente"]) . '
					AND crd.nombre = "' . $Model->limpiaTexto($_POST["nom_remitente"]) . '"
					AND crd.id_ciudad = ' . $Model->limpiaTexto($_POST["municipio"]) . '
			;';
			$result = $Data->getConsulta($sql);
			// $return["sql"] = $sql;
			$return["response"] = $result;
			break;

		/*case 'rndcGuardaRemitente':
			$_msg_control.= "Entro en la accion rndcGuardaRemitente.\n";
			// Se busca cual es el siguiente id del la tabla de cmx_remitentes_destinatarios para asignarlo como el codigo de sede del tercero en el RNDC
			//Se verifica que el remitente destinatario a transmitir este creado en la base de datos correctamente
			$sql = 'SELECT * FROM cmx_remitente_destinatario 
			WHERE documento='.$_POST["documento"];
			$result = $Data->getConsulta($sql);
			if($result){
				//Se construyen las variables teniendo en cuenta el tipo de documento a transmitir
				$id='';
				$nombre=$_POST["rndc_nombre"];
				$ciudad=$_POST["rndc_id_municipio"];
				$direccion=$_POST["direccion"];
				$celular=$_POST["celular"];
				$nomsede='';
				$codsede='';
				$fijo='';
				$latitud=$_POST["latitud"];
				$longitud=$_POST["longitud"];
				$xml_tercero="";
				if($_POST["tipo_documento"]=='NIT'){
					$tipodocu='N';	
					$id=($_POST["documento"].$_POST["digito_verificacion"]);
					$apellido1='';
					$apellido2='';
					$nomsede='PRINCIPAL';
					$codsede='1';
					$fijo=$_POST["contacto"];
				}
				if($_POST["tipo_documento"]=='Cedula de Ciudadania'){
					$tipodocu='C';
					$id=$_POST["documento"];
					$apellido1=$_POST["primer_apellido"];
					$apellido2=$_POST["segundo_apellido"];
					$fijo='';
				}
				if($_POST["tipo_documento"]=='Cedula de Extranjeria'){
					$tipodocu='E';
					$id=$_POST["documento"];
					$apellido1=$_POST["primer_apellido"];
					$apellido2=$_POST["segundo_apellido"];
					$fijo='';
				}
				//Consultar tercero en el RNDC
				$proceso=11;
				$tipopro=2;
				$tipotercero=0;
				$op=1;
				$resulta_rndc=$this->consulta_webService($op,$id,$tipotercero,$tipdocu,$tipoproc,$proceso);
				$convierte_xml = new SimpleXMLElement($resulta_rndc);
				if($convierte_xml->ErrorMSG[0]){
					if($convierte_xml->ErrorMSG[0]=="Error RNDC11: Documento no encontrado."){
						// RNDC11 Documento no encontrado, transmite
						//echo 'documento no encontrado, INSERTAR VARIABLES';
					}else{
						//VARIABLES A TRANSMITIR - REGISTRO
						$xml_tercero="<?xml version='1.0' encoding='ISO-8859-1'?>";
						$xml_tercero.="<root>";
						$xml_tercero.="<acceso>";
						$xml_tercero.="<username>".MINTRANS_USER."</username>
							<password>".MINTRANS_PASS."</password>";
						$xml_tercero.="</acceso>";
						$xml_tercero.="<solicitud>";
						$xml_tercero.="<tipo>3</tipo>";
						$xml_tercero.="<procesoid>11</procesoid>";
						$xml_tercero.="</solicitud>";
						$xml_tercero.="<variables>";
						$xml_tercero.="<NUMNITEMPRESATRANSPORTE>".MINTRANS_NIT."</NUMNITEMPRESATRANSPORTE>";
						$xml_tercero.="<CODTIPOIDTERCERO>".$tipodocu."</CODTIPOIDTERCERO>";
						$xml_tercero.="<NUMIDTERCERO>".$id."</NUMIDTERCERO>";
						$xml_tercero.="<NOMIDTERCERO>".$nombre."</NOMIDTERCERO>";
						//TERCERO SIN NIT
						$xml_tercero.="<PRIMERAPELLIDOIDTERCERO>".$apellido1."</PRIMERAPELLIDOIDTERCERO>";
						$xml_tercero.="<SEGUNDOAPELLIDOIDTERCERO>".$apellido2."</SEGUNDOAPELLIDOIDTERCERO>";
						//TERCERO CO NIT
						$xml_tercero.="<NOMSEDETERCERO>".$nomsede."</NOMSEDETERCERO>";
						$xml_tercero.="<CODSEDETERCERO>".$codsede."</CODSEDETERCERO>";
						//DATOS BASICOS
						$xml_tercero.="<NUMTELEFONOCONTACTO>".$fijo."</NUMTELEFONOCONTACTO>";
						$xml_tercero.="<NUMCELULARPERSONA>".$celular."</NUMCELULARPERSONA>";
						$xml_tercero.="<NOMENCLATURADIRECCION>".$direccion."</NOMENCLATURADIRECCION>";
						$xml_tercero.="<CODMUNICIPIORNDC>".$ciudad."</CODMUNICIPIORNDC>";
						$xml_tercero.="<LATITUD>".$latitud."</LATITUD>";
						$xml_tercero.="<LONGITUD>".$longitud."</LONGITUD>";
						$xml_tercero.="</variables>";
						$xml_tercero.="</root>";
						echo $xml_tercero;
						$result_tercero=$this->rndc_conexion($xml_tercero);
						echo 'RESULTADO TRANSMISION TERCERO'.$result_tercero;
					}
				}else{
					echo 'ya existe el tercero';
					echo $convierte_xml->documento[0]->nomidtercero;
					echo  $convierte_xml->documento[0]->codtipoidtercero;	
				}
			}			
		break;	*/

		
		
		case 'rndcGuardaRemitente':// RNDC NUEVO
			$_msg_control.= "Entro en la accion rndcGuardaRemitente.\n";

			// Se busca cual es el siguiente id del la tabla de cmx_remitentes_destinatarios para asignarlo como el codigo de sede del tercero en el RNDC
			session_start();
			$sql = 'SELECT (MAX(id)+1) FROM cmx_remitente_destinatario';
			$result = $Data->getConsulta($sql);
			$_CODSEDETERCERO = $result["rowsData"][0][0];
			//
			$fecha=date('Y-m-d');
			$hora=date('H:i:s');
			$user=$_SESSION["usuario"]["nom_usuario"];

			/*$sql1="INSERT INTO web_service_RNDC(id,codigo_proceso,tipo,estado_envio_rndc,estado,fecha,hora,usuario,tipo_tercero,accion)VALUES(null,'".$_POST["documento"]."','Tercero',0,1,'".$fecha."','".$hora."','".$user."','Remitente','Crear')"
			$Data->ejecuteRegistro($sql1);*/

			//INSERCION DE CONTENIDO DEL TERCERO EN EL RNDC 
			$arrayMinTrans = Array();
			// Solicitud
			$arrayMinTrans["solicitud"] = Array(
				"tipo" => 3,
				"procesoid" => 11,
			);
			// Variable que se envían para la consulta  
			$arrayMinTrans["variables"] = "INGRESOID";

			$documento_tercero = $_POST["documento"];
			if ( $_POST["tipo_documento"] == "NIT" ) {
				$documento_tercero = $Model->limpiaTexto($_POST["documento"]) . $Model->limpiaTexto($_POST["digito_verificacion"]);
			}

			$arrayMinTrans["documento"] = Array(
				"NUMNITEMPRESATRANSPORTE" 	=> MINTRANS_NIT,
				"NUMIDTERCERO"				=> "'" . $documento_tercero . "'",
				"CODSEDETERCERO"			=> "'" . $_CODSEDETERCERO . "'",
			);
			$return["verifica_tercero_array"] = $arrayMinTrans;

			$result = $Data->getRNDCQueryArray( $arrayMinTrans ); 
			$return["verifica_tercero_result"] = $result;

			// Se valida si la operación fue exitosa
			if ( isset( $result["ErrorMSG"] ) ){
				// Solicitud
				$arrayMinTrans["solicitud"] = Array(
					"tipo" => 1,
					"procesoid" => 11,
				);
				// Variable que se envían para la realizació del proceso 
				$arrayMinTrans["variables"] = Array(
					"NUMNITEMPRESATRANSPORTE"	=> MINTRANS_NIT,
					"CODTIPOIDTERCERO"			=> $Data->getRNDCTipoDocumento( $_POST["tipo_documento"] ) ,
					"NUMIDTERCERO"				=> $Model->limpiaTexto($_POST["documento"]),
				"NOMIDTERCERO"				=> $Model->limpiaTexto($_POST["rndc_nombre"]),
					"NOMENCLATURADIRECCION"		=> $Model->limpiaTexto($_POST["direccion"]),
					"LATITUD"					=> substr($_POST["latitud"], 0 , 15),
				"LONGITUD"					=> substr($_POST["longitud"], 0, 15),
				"CODMUNICIPIORNDC"			=>$_POST["rndc_id_municipio"], 
				);
				$arrayMinTrans["variables"]["NUMIDTERCERO"] = $Model->limpiaTexto($_POST["documento"]);
				$arrayMinTrans["variables"]["CODSEDETERCERO"] = $_CODSEDETERCERO;
				$arrayMinTrans["variables"]["NOMSEDETERCERO"] = $Model->limpiaTexto($_POST["rndc_nombre"]);

				if ( $_POST["tipo_documento"] == "NIT" ) {
					$arrayMinTrans["variables"]["NUMIDTERCERO"] = $_POST["documento"] . $_POST["digito_verificacion"];
				}
				if ( isset( $_POST["primer_apellido"] ) ) {
					$arrayMinTrans["variables"]["PRIMERAPELLIDOIDTERCERO"] = $Model->limpiaTexto($_POST["primer_apellido"]);
				}
				if ( isset( $_POST["segundo_apellido"] ) AND $_POST["segundo_apellido"] != "" ) {
					$arrayMinTrans["variables"]["SEGUNDOAPELLIDOIDTERCERO"] = $Model->limpiaTexto($_POST["segundo_apellido"]);
				}
				if ( isset( $_POST["contacto"] ) AND $_POST["contacto"] != "" AND $_POST["contacto"] != 0 ) {
					$arrayMinTrans["variables"]["NUMTELEFONOCONTACTO"] = $_POST["contacto"];
				}
				if ( isset( $_POST["celular"] ) AND $_POST["celular"] != "" AND $_POST["celular"] != 0 ) {
					$arrayMinTrans["variables"]["NUMCELULARPERSONA"] = $_POST["celular"];
				}

				var_dump($arrayMinTrans["variables"]);
				exit();



				$return["crea_tercero_array"] = $arrayMinTrans;

				


				//Guardar variables
				$cadena_xml = implode(" ",$arrayMinTrans["variables"]);
				//print_r($cadena_xml);
				$sql="INSERT INTO web_service_RNDC(id,codigo_proceso,tipo,estado_envio_rndc,estado,cadena_xml,fecha,hora,usuario)
					VALUES(null,'".$_POST["documento"]."','Tercero',0,1,'".$cadena_xml."','".$fecha."','".$hora."','".$user."')";	
				$Data->ejecuteRegistro($sql);
				// Se ejecuta la consulta hacia el RNDC del ministerio de transporte 
				$result = $Data->getRNDCQueryArray( $arrayMinTrans );
				$return["crea_tercero_result"] = $result;
				// Se valida si la operación fue exitosa
				if ( isset( $result["ErrorMSG"] ) ) {
					$_msg_error.= "<p><strong>Registro no actualizado en RNDC - Tercero.</strong></p>";
					$_msg_error.= $result["ErrorMSG"];
					$respuesta=$result["ErrorMSG"];
					$estado_rndc=1;

					$sql1="INSERT INTO web_service_RNDC(id,codigo_proceso,tipo,estado_envio_rndc,estado,cadena_xml,fecha,hora,usuario,rta_ministerio,tipo_tercero,accion)VALUES(null,'".$_POST["documento"]."','Tercero',0,1,'".$cadena_xml."','".$fecha."','".$hora."','".$user."','".$respuesta."','Remitente','Crear')";	
					$Data->ejecuteRegistro($sql1);
				}else{
					$rndc_ingresoid = $result["ingresoid"];
					$return["crea_tercero_id_crea"] = $rndc_ingresoid;
					$respuesta = $result["ingresoid"];
					$estado_rndc=1;
					$sql2="INSERT INTO web_service_RNDC(id,codigo_proceso,tipo,estado_envio_rndc,estado,cadena_xml,fecha,hora,usuario,rta_ministerio,tipo_tercero,accion)
						VALUES(null,'".$_POST["documento"]."','Tercero',".$estado_rndc.",1,'".$cadena_xml."','".$fecha."','".$hora."','".$user."','".$respuesta."','Remitente','Crear')";	
					$Data->ejecuteRegistro($sql2);
				}
			}else{
				$_msg_error.= "<p><strong>Registro no actualizado en RNDC - Tercero.</strong></p>";
				$_msg_error.= "<p>Registro ya existe en el RNDC</p>";
			}
		break;	 

		case 'rndcEditaRemitente':
			$_msg_control.= "Entro en la accion rndcEditaRemitente.\n";
			/********* REGISTRAR DATO EN TABLA DE TRANSMISION  *****************/
			session_start();
			$fecha=date('Y-m-d');
			$hora=date('H:i:s');
			$user=$_SESSION["usuario"]["nom_usuario"];
			/*$sql1="INSERT INTO web_service_RNDC(id,codigo_proceso,tipo,estado_envio_rndc,estado,fecha,hora,usuario,tipo_tercero,accion)VALUES(null,'".$_POST["documento"]."','Tercero',0,1,'".$fecha."','".$hora."','".$user."','Remitente','Actualizar')";	
			$Data->ejecuteRegistro($sql1);	*/
			if($Data){
				$array = Array(); 

				//$array["rndc_id"] = $rndc_ingresoid;
				$array["rndc_id"] = '';
				$array["tipo_documento"] = $_POST["tipo_documento"];
				$array["nombre"] = $Model->limpiaTexto($_POST["nombre"]);
				$array["sigla"] = $Model->limpiaTexto($_POST["sigla"]);
				$array["codigo_postal"] = $_POST["codigo_postal"];
				$array["direccion"] = $Model->limpiaTexto($_POST["direccion"]);
				$array["latitud"] = $_POST["latitud"];
				$array["longitud"] = $_POST["longitud"];
				$array["contacto"] = $_POST["contacto"];
				$array["celular"] = $_POST["celular"];
				$array["como_llegar"] = $Model->limpiaTexto($_POST["como_llegar"]);
				$array["descripcion_actividad"] = $Model->limpiaTexto($_POST["descripcion_actividad"]);
				$array["dias_atencion"] = $Model->limpiaTexto($_POST["dias_atencion"]);
				$array["horario_atencion"] = $Model->limpiaTexto($_POST["horario_atencion"]);

				$array_edita_remi_dest = Array();
				foreach ($array as $key => $value) {
					if ( $value ) {
						$array_edita_remi_dest[$key] = $value;
					}
				}
				// $return["array_edita"] = $array;
				// $return["array_edita_1"] = $array_edita_remi_dest;
				$Data->updateRegistro("cmx_remitente_destinatario", $array_edita_remi_dest, (int)$_POST["id_remi_dest"]);
			}	
			/******** INSERCION DE CONTENIDO DEL TERCERO EN EL RNDC  ********/
			$rndc_ingresoid = NULL;
			// Se filtra si el remitente está dentro de Colombia 


			
			if ( $_POST["rndc_id_municipio"] ) {
				$arrayMinTrans = Array();
				// Solicitud
				$arrayMinTrans["solicitud"] = Array(
					"tipo" => 1,
					"procesoid" => 11,
				);
				//Consulta datos en el RNDC
				// Variable que se envían para la consulta  
				$arrayMinTrans["variables"] = "INGRESOID";
				$documento_tercero = $_POST["documento"];
				if ( $_POST["tipo_documento"] == "NIT" ) {
					$documento_tercero = $Model->limpiaTexto($_POST["documento"]) . $Model->limpiaTexto($_POST["digito_verificacion"]);
				}else{
					$documento_tercero = $Model->limpiaTexto($_POST["documento"]);
				}

				$arrayMinTrans["documento"] = Array(
					"NUMNITEMPRESATRANSPORTE" 	=> MINTRANS_NIT,
					"NUMIDTERCERO"				=> "'" . $documento_tercero . "'",
					
				);
				$return["verifica_tercero_array"] = $arrayMinTrans;
				$result = $Data->getRNDCQueryArray( $arrayMinTrans ); 
				$return["verifica_tercero_result"] = $result;
				if ( isset( $result["ErrorMSG"] ) ){
					//echo 'no existe RNDC INSERT';
					// Variable que se envían para la realizació del proceso 
					$arrayMinTrans["variables"] = Array(
						"NUMNITEMPRESATRANSPORTE"	=> MINTRANS_NIT,
						"CODTIPOIDTERCERO"			=> $Data->getRNDCTipoDocumento( $_POST["tipo_documento"] ) ,
						"NUMIDTERCERO"				=> $Model->limpiaTexto($_POST["documento"]),
						"NOMIDTERCERO"				=> $Model->limpiaTexto($_POST["rndc_nombre"]),
						"NOMENCLATURADIRECCION"		=> $Model->limpiaTexto($_POST["direccion"]),
						"LATITUD"					=> substr($_POST["latitud"], 0 , 15),
						"LONGITUD"					=> substr($_POST["longitud"], 0, 15),
						"CODMUNICIPIORNDC"			=> $_POST["rndc_id_municipio"], 
					);

					$arrayMinTrans["variables"]["NUMIDTERCERO"] = $Model->limpiaTexto($_POST["documento"]);
					$arrayMinTrans["variables"]["CODSEDETERCERO"] = $_POST["id_remi_dest"];
					$arrayMinTrans["variables"]["NOMSEDETERCERO"] = $Model->limpiaTexto($_POST["rndc_nombre"]);

					if ( $_POST["tipo_documento"] == "NIT" ) {
						$arrayMinTrans["variables"]["NUMIDTERCERO"] = $Model->limpiaTexto($_POST["documento"]) . $Model->limpiaTexto($_POST["digito_verificacion"]);
					}

					if ( isset( $_POST["primer_apellido"] ) ) {
						$arrayMinTrans["variables"]["PRIMERAPELLIDOIDTERCERO"] = $Model->limpiaTexto($_POST["primer_apellido"]);
					}
					if ( isset( $_POST["segundo_apellido"] ) AND $_POST["segundo_apellido"] != "" ) {
						$arrayMinTrans["variables"]["SEGUNDOAPELLIDOIDTERCERO"] = $Model->limpiaTexto($_POST["segundo_apellido"]);
					}
					if ( isset( $_POST["contacto"] ) AND $_POST["contacto"] != "" AND $_POST["contacto"] != 0 ) {
						$arrayMinTrans["variables"]["NUMTELEFONOCONTACTO"] = $_POST["contacto"];
					}
					if ( isset( $_POST["celular"] ) AND $_POST["celular"] != "" AND $_POST["celular"] != 0 ) {
						$arrayMinTrans["variables"]["NUMCELULARPERSONA"] = $_POST["celular"];
					}

					$cadena = implode(",",$arrayMinTrans["variables"]);
					$sql2="INSERT INTO web_service_RNDC(id,codigo_proceso,tipo,estado_envio_rndc,estado,cadena,fecha,hora,usuario,tipo_tercero,accion)VALUES(null,'".$_POST["documento"]."','Tercero',1,1,'".$cadena."','".$fecha."','".$hora."','".$user."','Remitente','Actualizar')";	
					$Data->ejecuteRegistro($sql2);	
					// $return["edita_tercero_array"] = $arrayMinTrans;
					// Se ejecuta la consulta hacia el RNDC del ministerio de transporte 
					$result = $Data->getRNDCQueryArray( $arrayMinTrans );
					// $return["edita_tercero_result"] = $result;
					// Se valida si la operación fue exitosa
					if ( isset( $result["ErrorMSG"] ) ) {
						$_msg_error.= "<p><strong>Registro no actualizado en RNDC - Tercero.</strong></p>";
						$_msg_error.= $result["ErrorMSG"];
						$sql3="INSERT INTO web_service_RNDC(id,codigo_proceso,tipo,estado_envio_rndc,estado,cadena,fecha,hora,usuario,rta_ministerio,tipo_tercero,accion)VALUES(null,'".$_POST["documento"]."','Tercero',1,1,'".$cadena."','".$fecha."','".$hora."','".$user."','".$result["ErrorMSG"]."','Remitente','Actualizar')";	
						$Data->ejecuteRegistro($sql3);	
					}else{
						$rndc_ingresoid = $result["ingresoid"];
						$sql3="INSERT INTO web_service_RNDC(id,codigo_proceso,tipo,estado_envio_rndc,estado,cadena,fecha,hora,usuario,rta_ministerio,tipo_tercero,accion)VALUES(null,'".$_POST["documento"]."','Tercero',1,1,'".$cadena."','".$fecha."','".$hora."','".$user."','".$result["ingresoid"]."','Remitente','Actualizar')";	
						$Data->ejecuteRegistro($sql3);	
						// $return["edita_tercero_id_crea"] = $rndc_ingresoid;
					}
				}else{
					//echo 'ya existe en el RNDC UPDATE'; 
					// Variable que se envían para la realizació del proceso 
					$arrayMinTrans["variables"] = Array(
						"NUMNITEMPRESATRANSPORTE"	=> MINTRANS_NIT,
						"CODTIPOIDTERCERO"			=> $Data->getRNDCTipoDocumento( $_POST["tipo_documento"] ) ,
						"NUMIDTERCERO"				=> $Model->limpiaTexto($_POST["documento"]),
						"NOMIDTERCERO"				=> $Model->limpiaTexto($_POST["rndc_nombre"]),
						"NOMENCLATURADIRECCION"		=> $Model->limpiaTexto($_POST["direccion"]),
						"LATITUD"					=> substr($_POST["latitud"], 0 , 15),
						"LONGITUD"					=> substr($_POST["longitud"], 0, 15),
						"CODMUNICIPIORNDC"			=> $_POST["rndc_id_municipio"], 
					);

					$arrayMinTrans["variables"]["NUMIDTERCERO"] = $Model->limpiaTexto($_POST["documento"]);
					$arrayMinTrans["variables"]["CODSEDETERCERO"] = $_POST["id_remi_dest"];
					$arrayMinTrans["variables"]["NOMSEDETERCERO"] = $Model->limpiaTexto($_POST["sigla"]);

					if ( $_POST["tipo_documento"] == "NIT" ) {
						$arrayMinTrans["variables"]["NUMIDTERCERO"] = $Model->limpiaTexto($_POST["documento"]) . $Model->limpiaTexto($_POST["digito_verificacion"]);
					}

					if ( isset( $_POST["primer_apellido"] ) ) {
						$arrayMinTrans["variables"]["PRIMERAPELLIDOIDTERCERO"] = $Model->limpiaTexto($_POST["primer_apellido"]);
					}
					if ( isset( $_POST["segundo_apellido"] ) AND $_POST["segundo_apellido"] != "" ) {
						$arrayMinTrans["variables"]["SEGUNDOAPELLIDOIDTERCERO"] = $Model->limpiaTexto($_POST["segundo_apellido"]);
					}
					if ( isset( $_POST["contacto"] ) AND $_POST["contacto"] != "" AND $_POST["contacto"] != 0 ) {
						$arrayMinTrans["variables"]["NUMTELEFONOCONTACTO"] = $_POST["contacto"];
					}
					if ( isset( $_POST["celular"] ) AND $_POST["celular"] != "" AND $_POST["celular"] != 0 ) {
						$arrayMinTrans["variables"]["NUMCELULARPERSONA"] = $_POST["celular"];
					}
					// $return["edita_tercero_array"] = $arrayMinTrans;
					$cadena = implode(",",$arrayMinTrans["variables"]);
					$sql2="INSERT INTO web_service_RNDC(id,codigo_proceso,tipo,estado_envio_rndc,estado,cadena,fecha,hora,usuario,tipo_tercero,accion)VALUES(null,'".$_POST["documento"]."','Tercero',1,1,'".$cadena."','".$fecha."','".$hora."','".$user."','Remitente','Actualizar')";	
					$Data->ejecuteRegistro($sql2);	
					// Se ejecuta la consulta hacia el RNDC del ministerio de transporte 
					$result = $Data->getRNDCQueryArray( $arrayMinTrans );
					// $return["edita_tercero_result"] = $result;
					// Se valida si la operación fue exitosa
					if ( isset( $result["ErrorMSG"] ) ) {
						$_msg_error.= "<p><strong>Registro no actualizado en RNDC - Tercero.</strong></p>";
						$_msg_error.= $result["ErrorMSG"];
						$sql3="INSERT INTO web_service_RNDC(id,codigo_proceso,tipo,estado_envio_rndc,estado,cadena,fecha,hora,usuario,rta_ministerio,tipo_tercero,accion)VALUES(null,'".$_POST["documento"]."','Tercero',1,1,'".$cadena."','".$fecha."','".$hora."','".$user."','".$result["ErrorMSG"]."','Remitente','Actualizar')";	
						$Data->ejecuteRegistro($sql3);	
					}else{
						$rndc_ingresoid = $result["ingresoid"];
						$sql3="INSERT INTO web_service_RNDC(id,codigo_proceso,tipo,estado_envio_rndc,estado,cadena,fecha,hora,usuario,rta_ministerio,tipo_tercero,accion)VALUES(null,'".$_POST["documento"]."','Tercero',1,1,'".$cadena."','".$fecha."','".$hora."','".$user."','".$result["ingresoid"]."','Remitente','Actualizar')";	
						$Data->ejecuteRegistro($sql3);	
						// $return["edita_tercero_id_crea"] = $rndc_ingresoid;
					}
				}		
			} 




			/******** FIN - INSERCION DE CONTENIDO DEL TERCERO EN EL RNDC  ********/

			// Se actualiza la indformación del Remitente/Destinatario
			/*if ( !$_msg_error ) {
				$array = Array(); 

				$array["rndc_id"] = $rndc_ingresoid;
				$array["tipo_documento"] = $_POST["tipo_documento"];
				$array["nombre"] = $Model->limpiaTexto($_POST["nombre"]);
				$array["sigla"] = $Model->limpiaTexto($_POST["sigla"]);
				$array["codigo_postal"] = $_POST["codigo_postal"];
				$array["direccion"] = $Model->limpiaTexto($_POST["direccion"]);
				$array["latitud"] = $_POST["latitud"];
				$array["longitud"] = $_POST["longitud"];
				$array["contacto"] = $_POST["contacto"];
				$array["celular"] = $_POST["celular"];
				$array["como_llegar"] = $Model->limpiaTexto($_POST["como_llegar"]);
				$array["descripcion_actividad"] = $Model->limpiaTexto($_POST["descripcion_actividad"]);
				$array["dias_atencion"] = $Model->limpiaTexto($_POST["dias_atencion"]);
				$array["horario_atencion"] = $Model->limpiaTexto($_POST["horario_atencion"]);

				$array_edita_remi_dest = Array();
				foreach ($array as $key => $value) {
					if ( $value ) {
						$array_edita_remi_dest[$key] = $value;
					}
				}
				// $return["array_edita"] = $array;
				// $return["array_edita_1"] = $array_edita_remi_dest;
				$Data->updateRegistro("cmx_remitente_destinatario", $array_edita_remi_dest, (int)$_POST["id_remi_dest"]);
			}*/
			break; 

		case 'buscaDepto':
			$_msg_control.= "Entro en la accion buscaDepto.\n";
			$Municipios = new municipiosModel;
			$return["depto"] = "<label>(*) Depto / Estado:</label>" . $Municipios->getHtmlSelectDeptos_sm("id_depto" , "", $_POST["pais"]);
			break;

		case 'buscaCiudad':
			$_msg_control.= "Entro en la accion buscaDepto.\n";
			$Municipios = new municipiosModel;
			$return["municipio"] = "<label>(*) Ciudad:</label>" . $Municipios->getHtmlSelectCiudadFiltered_sm("id_ciudad", "", $_POST["pais"], $_POST["depto"]);
			break;

		default:
			$_msg_control.= "Error en la seleccion de la action.\n";
			break;
	}

	$return["control"] = $_msg_control;
	if ( $_msg_error ) {
		$return["error"] = $_msg_error;
	}
	if ( $_array_result ) {
		$return["result"] = $_array_result;
	}

	echo json_encode($return);

?>
