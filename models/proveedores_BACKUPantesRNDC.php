<?php
	include '../application/Conexion.php';
	require_once '../application/Config.php';
	session_start();
	class Proveedores
	{
		public $user_log;
		public $pass;

		public $mensaje;
		public $respuesta;
		public $email;
		public $listado;
		public $cont;

		// public function crearProveedor(){
				// 	$_flag_proceso = true;
				// 	$_msg_error = "";
				// 	$rndc_ingresoid = NULL;

				// 	if( $_POST["tipo_documento"] != "Identificacion Tributaria Internacional" ){
				// 		/******** INSERCION DE CONTENIDO DEL TERCERO EN EL RNDC  ********/
				// 		$Data = new Consultas;

				// 		$arrayMinTrans = Array();
				// 		// Solicitud
				// 		$arrayMinTrans["solicitud"] = Array(
				// 			"tipo" => 3,
				// 			"procesoid" => 11,
				// 		);
				// 		// Variable que se envían para la consulta  
				// 		$arrayMinTrans["variables"] = "INGRESOID";

				// 		$documento_tercero = $_POST["numero_documento"];
				// 		if ( $_POST["tipo_documento"] == "NIT" ) {
				// 			$documento_tercero = $_POST["numero_documento"] . $_POST["digito_verificacion"];
				// 		}

				// 		$arrayMinTrans["documento"] = Array(
				// 			"NUMNITEMPRESATRANSPORTE" 	=> MINTRANS_NIT,
				// 			"NUMIDTERCERO"				=> "'" . $documento_tercero . "'"
				// 		);
				// 		$return["verifica_tercero_array"] = $arrayMinTrans;

				// 		$result = $Data->getRNDCQueryArray( $arrayMinTrans ); 
				// 		$return["verifica_tercero_result"] = $result;

				// 		// Se valida si la operación fue exitosa
				// 		if ( isset( $result["ErrorMSG"] ) ){
				// 			// Solicitud
				// 			$arrayMinTrans["solicitud"] = Array(
				// 				"tipo" => 1,
				// 				"procesoid" => 11,
				// 			);
				// 			// Variable que se envían para la realizació del proceso 
				// 			$arrayMinTrans["variables"] = Array(
				// 				"NUMNITEMPRESATRANSPORTE"			=> MINTRANS_NIT,
				// 				"CODTIPOIDTERCERO"					=> $Data->getRNDCTipoDocumento( $_POST["tipo_documento"] ) ,
				// 				"NUMIDTERCERO"						=> $_POST["numero_documento"],
				// 				"NOMIDTERCERO"						=> $_POST["rndc_nombre"],
				// 				"NOMENCLATURADIRECCION"				=> $_POST["direccion"],
				// 				"CODMUNICIPIORNDC"					=> $_POST["rndc_id_municipio"], 
				// 			);

				// 			$arrayMinTrans["variables"]["NUMIDTERCERO"] = $_POST["numero_documento"];
				// 			if ( $_POST["tipo_documento"] == "NIT" ) {
				// 				$arrayMinTrans["variables"]["NUMIDTERCERO"] = $_POST["numero_documento"] . $_POST["digito_verificacion"];
				// 				$arrayMinTrans["variables"]["CODSEDETERCERO"] = 0;
				// 				$arrayMinTrans["variables"]["NOMSEDETERCERO"] = $_POST["abreviatura"];
				// 			}

				// 			if ( isset( $_POST["primer_apellido"] ) ) {
				// 				$arrayMinTrans["variables"]["PRIMERAPELLIDOIDTERCERO"] = $_POST["primer_apellido"];
				// 			}
				// 			if ( isset( $_POST["segundo_apellido"] ) ) {
				// 				$arrayMinTrans["variables"]["SEGUNDOAPELLIDOIDTERCERO"] = $_POST["segundo_apellido"];
				// 			}
				// 			if ( isset( $_POST["contacto"] ) AND $_POST["contacto"] != "" AND $_POST["contacto"] != 0 ) {
				// 				$arrayMinTrans["variables"]["NUMTELEFONOCONTACTO"] = $_POST["contacto"];
				// 			}
				// 			if ( isset( $_POST["celular"] ) AND $_POST["celular"] != "" AND $_POST["celular"] != 0 ) {
				// 				$arrayMinTrans["variables"]["NUMCELULARPERSONA"] = $_POST["celular"];
				// 			}
				// 			if ( isset( $_POST["categoria_licencia"] ) ) {
				// 				$arrayMinTrans["variables"]["CODCATEGORIALICENCIACONDUCCION"] = $_POST["categoria_licencia"];
				// 			}
				// 			if ( isset( $_POST["numero_licencia"] ) ) {
				// 				$arrayMinTrans["variables"]["NUMLICENCIACONDUCCION"] = $_POST["numero_licencia"];
				// 			}
				// 			if ( isset( $_POST["vencimiento_licencia"] ) ) {
				// 				$arrayMinTrans["variables"]["FECHAVENCIMIENTOLICENCIA"] = $_POST["vencimiento_licencia"];
				// 			}
				// 			// $return["crea_tercero_array"] = $arrayMinTrans;

				// 			// Se ejecuta la consulta hacia el RNDC del ministerio de transporte 
				// 			$result = $Data->getRNDCQueryArray( $arrayMinTrans );
				// 			// $return["crea_tercero_result"] = $result;

				// 			// Se valida si la operación fue exitosa
				// 			if ( isset( $result["ErrorMSG"] ) ) {
				// 				$_flag_proceso = false;
				// 				$_msg_error.= "<p><strong>Registro no actualizado en RNDC - Tercero.</strong></p>";
				// 				$_msg_error.= $result["ErrorMSG"];
				// 			}else{
				// 				$rndc_ingresoid = $result["ingresoid"];
				// 				// $return["crea_tercero_id_crea"] = $rndc_ingresoid;
				// 			}
				// 		}else{
				// 			$sql = '
				// 				SELECT 
				// 					COUNT(cp.id) CUANTOS
				// 				FROM 
				// 					cmx_proveedores cp
				// 				WHERE 
				// 					cp.numero_documento = ' . $_POST["numero_documento"] . '
				// 			';
				// 			$result = $Data->getConsulta($sql);

				// 			if ( $result["rowsData"][0]["CUANTOS"] == 0 ) {
				// 				// Solicitud
				// 				$arrayMinTrans["solicitud"] = Array(
				// 					"tipo" => 1,
				// 					"procesoid" => 11,
				// 				);
				// 				// Variable que se envían para la realizació del proceso 
				// 				$arrayMinTrans["variables"] = Array(
				// 					"NUMNITEMPRESATRANSPORTE"			=> MINTRANS_NIT,
				// 					"CODTIPOIDTERCERO"					=> $Data->getRNDCTipoDocumento( $_POST["tipo_documento"] ) ,
				// 					"NUMIDTERCERO"						=> $_POST["numero_documento"],
				// 					"NOMIDTERCERO"						=> $_POST["rndc_nombre"],
				// 					"NOMENCLATURADIRECCION"				=> $_POST["direccion"],
				// 					"CODMUNICIPIORNDC"					=> $_POST["rndc_id_municipio"], 
				// 				);

				// 				$arrayMinTrans["variables"]["NUMIDTERCERO"] = $_POST["numero_documento"];
				// 				if ( $_POST["tipo_documento"] == "NIT" ) {
				// 					$arrayMinTrans["variables"]["NUMIDTERCERO"] = $_POST["numero_documento"] . $_POST["digito_verificacion"];
				// 					$arrayMinTrans["variables"]["CODSEDETERCERO"] = 0;
				// 					$arrayMinTrans["variables"]["NOMSEDETERCERO"] = $_POST["abreviatura"];
				// 				}

				// 				if ( isset( $_POST["primer_apellido"] ) ) {
				// 					$arrayMinTrans["variables"]["PRIMERAPELLIDOIDTERCERO"] = $_POST["primer_apellido"];
				// 				}
				// 				if ( isset( $_POST["segundo_apellido"] ) ) {
				// 					$arrayMinTrans["variables"]["SEGUNDOAPELLIDOIDTERCERO"] = $_POST["segundo_apellido"];
				// 				}
				// 				if ( isset( $_POST["contacto"] ) AND $_POST["contacto"] != "" AND $_POST["contacto"] != 0 ) {
				// 					$arrayMinTrans["variables"]["NUMTELEFONOCONTACTO"] = $_POST["contacto"];
				// 				}
				// 				if ( isset( $_POST["celular"] ) AND $_POST["celular"] != "" AND $_POST["celular"] != 0 ) {
				// 					$arrayMinTrans["variables"]["NUMCELULARPERSONA"] = $_POST["celular"];
				// 				}
				// 				if ( isset( $_POST["categoria_licencia"] ) ) {
				// 					$arrayMinTrans["variables"]["CODCATEGORIALICENCIACONDUCCION"] = $_POST["categoria_licencia"];
				// 				}
				// 				if ( isset( $_POST["numero_licencia"] ) ) {
				// 					$arrayMinTrans["variables"]["NUMLICENCIACONDUCCION"] = $_POST["numero_licencia"];
				// 				}
				// 				if ( isset( $_POST["vencimiento_licencia"] ) ) {
				// 					$arrayMinTrans["variables"]["FECHAVENCIMIENTOLICENCIA"] = $_POST["vencimiento_licencia"];
				// 				}
				// 				// $return["crea_tercero_array"] = $arrayMinTrans;

				// 				// Se ejecuta la consulta hacia el RNDC del ministerio de transporte 
				// 				$result = $Data->getRNDCQueryArray( $arrayMinTrans );
				// 				// $return["crea_tercero_result"] = $result;

				// 				// Se valida si la operación fue exitosa
				// 				if ( isset( $result["ErrorMSG"] ) ) {
				// 					$_flag_proceso = false;
				// 					$_msg_error.= "<p><strong>Registro no actualizado en RNDC - Tercero.</strong></p>";
				// 					$_msg_error.= $result["ErrorMSG"];
				// 				}else{
				// 					$rndc_ingresoid = $result["ingresoid"];
				// 					// $return["crea_tercero_id_crea"] = $rndc_ingresoid;
				// 				}
				// 			} else {
				// 				$_flag_proceso = false;
				// 				$_msg_error.= "<p><strong>Registro no actualizado en RNDC - Tercero.</strong></p>";
				// 				$_msg_error.= "<p>Registro ya existe en el RNDC</p>";
				// 			}
				// 		}
				// 		/******** FIN - INSERCION DE CONTENIDO DEL TERCERO EN EL RNDC  ********/
				// 	}
				// 	$cont=0;

				// 	if( $_flag_proceso ){
				// 		$tipo_documento = $_POST["tipo_documento"];
				// 		$numero_documento = $_POST["numero_documento"];
				// 		$digito_verificacion = $_POST["digito_verificacion"];
				// 		$tipo_identificacion = $_POST["tipo_identificacion"];
				// 		$nombre = $_POST["nombre"];
				// 		$abreviatura = $_POST["abreviatura"];
				// 		$contacto = $_POST["contacto"];
				// 		$celular = $_POST["celular"];
				// 		$direccion = $_POST["direccion"];
				// 		$email = $_POST["email"];
				// 		$estado = $_POST["estado"];
				// 		$id_municipio = $_POST["municipio"];
				// 		$id_usuario = $_SESSION["usuario"]["id_usuario"];
				// 		$Conductor = $_POST["Conductor"];
				// 		$poseedor_vehiculo = $_POST["poseedor_vehiculo"];
				// 		$propietario_vehiculo = $_POST["propietario_vehiculo"];
				// 		$Proveedor = $_POST["Proveedor"];

				// 		if(isset($_POST["categoria_licencia"])){
				// 			$rndc_categoria_licencia = "";
				// 		}else{
				// 			$rndc_categoria_licencia = "";
				// 		}

				// 		if(isset($_POST["numero_licencia"])){
				// 			$rndc_numero_licencia = "";
				// 		}else{
				// 			$rndc_numero_licencia = "";
				// 		}

				// 		if(isset($_POST["vencimiento_licencia"])){
				// 			$rndc_vencimiento_licencia = "";
				// 		}else{
				// 			$rndc_vencimiento_licencia = "";
				// 		}


				// 		if ( $Conductor == "true" ) {
				// 			$rndc_categoria_licencia = $_POST["categoria_licencia"];
				// 			$rndc_numero_licencia = $_POST["numero_licencia"];
				// 			$rndc_vencimiento_licencia = $_POST["vencimiento_licencia"];
				// 			//demas datos de conductor
				// 			if(isset($_POST["name_eps"])){
				// 				$nombre_eps=$_POST["name_eps"];
				// 			}else{
				// 				$nombre_eps ='';
				// 			}
				// 			if(isset($_POST["vence_eps"])){
				// 				$fecha_vencimiento=$_POST["vence_eps"];
				// 			}else{
				// 				$fecha_vencimiento ='';
				// 			}
				// 			if(isset($_POST["ultimo_eps"])){
				// 				$ultimo_eps=$_POST["ultimo_eps"];
				// 			}else{
				// 				$ultimo_eps='';
				// 			}
				// 			if(isset($_POST["name_arl"])){
				// 				$nombre_arl =$_POST["name_arl"];
				// 			}else{
				// 				$nombre_arl ='';	
				// 			}
				// 			if(isset($_POST["vence_arl"])){
				// 				$fecha_vencimiento_arl=$_POST["vence_arl"];
				// 			}else{
				// 				$fecha_vencimiento_arl='';
				// 			}
				// 			if(isset($_POST["ultimo_arl"])){
				// 				$ultimo_arl=$_POST["ultimo_arl"];
				// 			}else{
				// 				$ultimo_arl='';
				// 			}

				// 			if(isset($_POST["nom_enti"])){
				// 				$nombre_entidad =$_POST["nom_enti"];
				// 			}else{
				// 				$nombre_entidad ='';
				// 			}
				// 			if(isset($_POST["vence_curso"])){
				// 				$vence_curso =$_POST["vence_curso"];
				// 			}else{
				// 				$vence_curso ='';
				// 			}
				// 			if(isset($_POST["sexo"])){
				// 				$sex=$_POST["sexo"];
				// 			}else{
				// 				$sex='';
				// 			}
				// 			if(isset($_POST["fecha_nacimiento"])){
				// 				$fecha_nace=$_POST["fecha_nacimiento"];
				// 			}else{
				// 				$fecha_nace='';
				// 			}
				// 			if(isset($_POST["sangre"])){
				// 				$sangre=$_POST["sangre"];
				// 			}else{
				// 				$sangre='';
				// 			}
				// 			if(isset($_POST["civil"])){
				// 				$civil=$_POST["civil"];
				// 			}else{
				// 				$civil='';
				// 			}
				// 			if(isset($_POST["fecha_ingreso"])){
				// 				$fecha_ingreso=$_POST["fecha_ingreso"];
				// 			}else{
				// 				$fecha_ingreso='';
				// 			}
				// 			if(isset($_POST["celular2"])){
				// 				$celular2=$_POST["celular2"];
				// 			}else{
				// 				$celular2='';
				// 			}

				// 			$referencias_empresariales =$_POST["referencias_empresariales1"];
				// 			$fecha_ereferencia1 = $_POST["fecha_referencia1"];
				// 			$fecha_retiro1 = $_POST["fecha_retiro1"];
				// 			$contacto_ref1= $_POST["contacto_ref1"];
				// 			$celular_ref1 = $_POST["celular_ref1"];
				// 			$cargo_ref1 = $_POST["cargo_ref1"];
				// 			$anti_ref1 = $_POST["anti_ref1"];

				// 			$referencia_empresarial2 = $_POST["referencias_empresariales2"];
				// 			$fecha_ereferencia2 =$_POST["fecha_referencia2"];
				// 			$fecha_retiro2 =$_POST["fecha_retiro2"];
				// 			$contacto_ref2=$_POST["contacto_ref2"];
				// 			$celular_ref2=$_POST["celular_ref2"];
				// 			$cargo_ref2=$_POST["cargo_ref2"];
				// 			$anti_ref2=$_POST["anti_ref2"];

				// 			$referencias_personales = $_POST["referencias_personales"];
				// 			$fecha_preferencia1 = $_POST["fecha_personal1"];
				// 			$parenp1=$_POST["parenp1"];
				// 			$telefonop1=$_POST["telefonop1"];

				// 			$refe_personal2 = $_POST["referencias_personales2"];
				// 			$fecha_preferencia2 = $_POST["fecha_personal2"];
				// 			$parenp2=$_POST["parenp2"];
				// 			$telefonop2=$_POST["telefonop2"];

				// 		}

				// 		$model    = new Conexion;
				// 		$conexion = $model->conectar();
				// 		$sql = "
				// 			INSERT INTO 
				// 				cmx_proveedores (
				// 					rndc_id, tipo_documento, numero_documento, digito_verificacion,tipo_identificacion, nombre,
				// 					abreviatura, contacto, celular, direccion, email, id_municipio, rndc_categoria_licencia, 
				// 					rndc_numero_licencia, rndc_vencimiento_licencia,estado
				// 				)
				// 			VALUES (
				// 				'$rndc_ingresoid','$tipo_documento','$numero_documento','$digito_verificacion','$tipo_identificacion',
				// 				'$nombre','$abreviatura','$contacto','$celular','$direccion','$email',$id_municipio,'$rndc_categoria_licencia',
				// 				'$rndc_numero_licencia','$rndc_vencimiento_licencia','$estado'
				// 			)";
				// 		$crear_solicitud = $conexion->prepare($sql);
				// 		$result = $crear_solicitud->execute();
						

				// 	    $sql = "SELECT max(id) as 'id' FROM cmx_proveedores";
				// 	    $consulta_solic_vehic = $conexion->prepare($sql);
				// 	    $consulta_solic_vehic->execute();
				// 	    $datos_proveedor = $consulta_solic_vehic->fetch();
				// 	    //nombre del archivo
				// 	    $name_soporte=$_POST["nombresoporte"];
				// 	    $id_proveedor = $datos_proveedor["id"];
				// 	    $ruta = "../public/files/proveedores/".$id_proveedor."/";     
				// 	    // $ruta_base= "public/files/proveedores/".$id_proveedor."/".$name_soporte."  ";   

				// 	     $ruta_base= "public/files/proveedores/".$id_proveedor."/";     


				// 	    $sql = "UPDATE cmx_proveedores SET documentos_soporte = '$ruta_base' WHERE id = ".$id_proveedor."";
				// 	    $consulta_act_proveedor = $conexion->prepare($sql);
				// 	    $consulta_act_proveedor->execute();

				// 	    $sql = "
				// 	        INSERT INTO 
				// 	            cmx_log_proveedores (id_usuario,id_proveedor,operacion,fecha_hora_operacion) 
				// 	        VALUES ($id_usuario,$id_proveedor,'Crear',NOW())";
				// 	    $crear_log_proveedor = $conexion->prepare($sql);
				// 	    $crear_log_proveedor->execute();

					  

				// 	    if (!file_exists($ruta)) {
				// 	        mkdir($ruta, 0777, true);
				// 	    }

				// 	    for ($x=0;$x<count($_FILES);$x++){
				// 	    	if(isset($_FILES["documentos".$x])){
				// 	        $file = $_FILES["documentos".$x];
				// 	        $nombre = $file["name"];
				// 	        $tipo = $file["type"];
				// 	        $ruta_provisional = $file["tmp_name"];
				// 	        $carpeta=$ruta;
				// 	        $src=$carpeta.$nombre;
				// 	        move_uploaded_file($ruta_provisional, $src);
				// 	    	}
				// 		}

				// 	    if ($Conductor == "true" ){

				// 	    	$sqlc="INSERT INTO cmx_detalle_conductor
				// 	    	(id,
				// 	    	celular2,
				// 	    	nombre_eps,
				// 	    	fecha_vence_eps,
				// 	    	ultimo_eps,
				// 	    	nombre_arl,
				// 	    	fecha_vence_arl,
				// 	    	ultimo_arl,
				// 	    	nombre_entidad,
				// 	    	vence_curso,
				// 	    	nombre_empresarial1,
				// 	    	fecha_empresarial1,
				// 	    	fecha_retiro1,
				// 	    	contactar1,
				// 	    	celempresa1,
				// 	    	cargo1,
				// 	    	antiguedad1,
				// 	    	nombre_Empresarial2,
				// 	    	fecha_empresarial2,
				// 	    	fecha_retiro2,
				// 	    	contactar2,
				// 	    	celempresa2,
				// 	    	cargo2,
				// 	    	antiguedad2,
				// 	    	nombre_personal1,
				// 	    	fecha_personal1,
				// 	    	parentezco1,
				// 	    	tel_personal1,
				// 	    	nombre_personal2,
				// 	    	fecha_personal2,
				// 	    	parentezco2,
				// 	    	tel_personal2,
				// 	    	sexo,
				// 	    	fecha_nacimiento,
				// 	    	grupo_sanguineo,
				// 	    	estado_civil,
				// 	    	fecha_ingreso,
				// 	    	id_proveedor)
				// 	    	VALUES(null,
				// 	    	'$celular2',
				// 	    	'$nombre_eps',
				// 	    	'$fecha_vencimiento',
				// 	    	'$ultimo_eps',
				// 	    	'$nombre_arl',
				// 	    	'$fecha_vencimiento_arl',
				// 			'$ultimo_arl',
				// 	    	'$nombre_entidad',
				// 	    	'$vence_curso',
				// 	    	'$referencias_empresariales',
				// 	    	'$fecha_ereferencia1',
				// 	    	'$fecha_retiro1',
				// 	    	'$contacto_ref1',
				// 	    	'$celular_ref1',
				// 	    	'$cargo_ref1',
				// 	    	'$anti_ref1',
				// 	    	'$referencia_empresarial2',
				// 	    	'$fecha_ereferencia2',
				// 	    	'$fecha_retiro2',
				// 	    	'$contacto_ref2',
				// 	    	'$celular_ref2',
				// 	    	'$cargo_ref2',
				// 	    	'$anti_ref2',
				// 	    	'$referencias_personales',
				// 	    	'$fecha_preferencia1',
				// 	    	'$parenp1',
				// 	    	'$telefonop1',
				// 	    	'$refe_personal2',
				// 	    	'$fecha_preferencia2',
				// 	    	'$parenp2',
				// 	    	'$telefonop2',
				// 	    	'$sex',
				// 	    	'$fecha_nace',
				// 	    	'$sangre',
				// 	    	'$civil',
				// 	    	'$fecha_ingreso',
				// 	    	'$id_proveedor')";
				// 	    	$crear_solicitud = $conexion->prepare($sqlc);
				// 	        $result=$crear_solicitud->execute();
					        
				// 	         //REGISTRAR LA RUTA DEL ARCHIVO PARA LICENCIA DEL CONDUCTOR
				// 	    $ruta_licencia = "../public/files/proveedores/licencias/".$id_proveedor."/"; 
				// 	    $ruta_licencias = "public/files/proveedores/licencias/".$id_proveedor."/"; 
				// 	    $sqll = "UPDATE cmx_proveedores SET subir_licencia = '$ruta_licencias' WHERE id = ".$id_proveedor."";
				// 	    $consulta_li_proveedor = $conexion->prepare($sqll);
				// 	    $consulta_li_proveedor->execute();

				// 	    if (!file_exists($ruta_licencia)) {
				// 	        mkdir($ruta_licencia, 0777, true);
				// 	    }

				// 	    //LICENCIA
				// 	    for ($i=0;$i<count($_FILES);$i++){
				// 	    	if(isset($_FILES["licencia".$i])){
				// 		        $file = $_FILES["licencia".$i];
				// 		        $nombre = $file["name"];
				// 		        $tipo = $file["type"];
				// 		        $ruta_provisional = $file["tmp_name"];
				// 		        $carpeta=$ruta_licencia;
				// 		        $src=$carpeta.$nombre;
				// 		        move_uploaded_file($ruta_provisional, $src);
				// 	    	}
				// 	    }

				// 	    //REGISTRAR EL ARCHIVO DE LA EPS
				// 	     $ruta_eps="../public/files/proveedores/eps/".$id_proveedor."/";
				// 	    $ruta_eps2="public/files/proveedores/eps/".$id_proveedor."/"; 
				// 	     $sqle = "UPDATE cmx_detalle_conductor SET documento_eps='$ruta_eps2'
				// 	    		WHERE id_proveedor = ".$id_proveedor."   ";
				// 	    $consulta_eps_conductor = $conexion->prepare($sqle);
				// 	    $consulta_eps_conductor->execute();	

				// 	    if (!file_exists($ruta_eps)) {
				// 	        mkdir($ruta_eps, 0777, true);
				// 	    }

				// 	    //EPS
				// 	    	for ($m=0;$m<count($_FILES);$m++){
				// 	    		if(isset($_FILES["docu_eps".$m])){
				// 			        $file = $_FILES["docu_eps".$m];
				// 			        $nombre = $file["name"];
				// 			        $tipo = $file["type"];
				// 			        $ruta_provisional = $file["tmp_name"];
				// 			        $carpeta=$ruta_eps;
				// 			        $src=$carpeta.$nombre;
				// 			        move_uploaded_file($ruta_provisional, $src);
				// 		    }
				// 	    }

				// 	    //ARCHIVOS ARL CONDUCTOR
				// 	     $ruta_arl="../public/files/proveedores/arl/".$id_proveedor."/";
				// 	    $ruta_arl2="public/files/proveedores/arl/".$id_proveedor."/";
				// 	    $sqla = "UPDATE cmx_detalle_conductor SET documento_arl='$ruta_arl2'
				// 	    		WHERE id_proveedor=".$id_proveedor."";
				// 	    $consulta_arl_conductor = $conexion->prepare($sqla);
				// 	    $consulta_arl_conductor->execute();	

				// 	     if (!file_exists($ruta_arl)) {
				// 	        mkdir($ruta_arl, 0777, true);
				// 	    }

				// 	    //ARL
				// 	    	for ($g=0;$g<count($_FILES);$g++){
				// 	    		if(isset($_FILES["docu_arl".$g])){
				// 		        $file = $_FILES["docu_arl".$g];
				// 		        $nombre = $file["name"];
				// 		        $tipo = $file["type"];
				// 		        $ruta_provisional = $file["tmp_name"];
				// 		        $carpeta=$ruta_arl;
				// 		        $src=$carpeta.$nombre;
				// 		        move_uploaded_file($ruta_provisional, $src);
				// 		    }
				// 	    }
				// 	    //EMPRESARIAL1
				// 	     $ruta_empresarial1="../public/files/proveedores/empresarial/".$id_proveedor."/";
				// 	    $ruta_empresarial11="public/files/proveedores/empresarial/".$id_proveedor."/";
				// 	     $sqle1="UPDATE cmx_detalle_conductor SET documento_empresarial1='$ruta_empresarial11'WHERE id_proveedor=".$id_proveedor."";
				// 	    $consulta_emp1_conductor = $conexion->prepare($sqle1);
				// 	    $consulta_emp1_conductor->execute();

				// 	     if (!file_exists($ruta_empresarial1)) {
				// 	        mkdir($ruta_empresarial1, 0777, true);
				// 	    }

				// 	    //referencias empresariales 1

				// 		   	for ($a=0;$a<count($_FILES);$a++){
				// 		   		if(isset($_FILES["documento_referencia1".$a])){
				// 		        $file =$_FILES["documento_referencia1".$a];
				// 		        $nombre = $file["name"];
				// 		        $tipo = $file["type"];
				// 		        $ruta_provisional=$file["tmp_name"];
				// 		        $carpeta=$ruta_empresarial1;
				// 		        $src=$carpeta.$nombre;
				// 		        move_uploaded_file($ruta_provisional, $src);
				// 		    }
				// 		}
				// 		//EMPRESARIAL2
				// 		  $ruta_empresarial2="../public/files/proveedores/empresarial/".$id_proveedor."/";
				// 	    $ruta_empresarial22="public/files/proveedores/empresarial/".$id_proveedor."/";
				// 	    $sqle2 = "UPDATE cmx_detalle_conductor SET documento_empresarial2='$ruta_empresarial22'
				// 	    		WHERE id_proveedor=".$id_proveedor."";
				// 	    $consulta_emp2_proveedor = $conexion->prepare($sqle2);
				// 	    $consulta_emp2_proveedor->execute();
				// 	     if (!file_exists($ruta_empresarial2)) {
				// 	        mkdir($ruta_empresarial2, 0777, true);
				// 	    }
				// 	    //referencias empresariales 2
				// 		   for ($b=0;$b<count($_FILES);$b++){
				// 		   	if(isset($_FILES["documento_referencia2".$b])){
				// 			      $file =$_FILES["documento_referencia2".$b];
				// 			      $nombre = $file["name"];
				// 			      $tipo = $file["type"];
				// 			      $ruta_provisional=$file["tmp_name"];
				// 			      $carpeta=$ruta_empresarial2;
				// 			      $src=$carpeta.$nombre;
				// 			      move_uploaded_file($ruta_provisional, $src);
				// 		   		}
				// 			}
				// 			//PERSONALES1
				// 			$ruta_personal1="../public/files/proveedores/personal/".$id_proveedor."/";
				// 	     $ruta_personal11="public/files/proveedores/personal/".$id_proveedor."/";
				// 	     $sqlp1 ="UPDATE cmx_detalle_conductor SET documento_personal1='$ruta_personal11'
				// 	    		WHERE id_proveedor=".$id_proveedor."";
				// 	    $consulta_pe1_proveedor = $conexion->prepare($sqlp1);
				// 	    $consulta_pe1_proveedor->execute();	
				// 	       if (!file_exists($ruta_personal1)) {
				// 	        mkdir($ruta_personal1, 0777, true);
				// 	    }
				// 	    //referencias personales 1
				// 	    	for ($c=0;$c<count($_FILES);$c++){
				// 	    		if(isset($_FILES["documento_personal1".$c])){
				// 			        $file = $_FILES["documento_personal1".$c];
				// 			        $nombre = $file["name"];
				// 			        $tipo = $file["type"];
				// 			        $ruta_provisional = $file["tmp_name"];
				// 			        $carpeta=$ruta_personal1;
				// 			        $src=$carpeta.$nombre;
				// 			        move_uploaded_file($ruta_provisional, $src);
				// 		    	}
				// 	    	}
				// 	    //PERSONALES 2
				// 	    	 $ruta_personal2="../public/files/proveedores/personal/".$id_proveedor."/";
				// 	     $ruta_personal22="public/files/proveedores/personal/".$id_proveedor."/";
				// 	    $sqlp2 = "UPDATE cmx_detalle_conductor SET documento_personal2='$ruta_personal22'
				// 	    		WHERE id_proveedor = ".$id_proveedor."   ";
				// 	    $consulta_pe2_proveedor = $conexion->prepare($sqlp2);
				// 	    $consulta_pe2_proveedor->execute();	
				// 	     if (!file_exists($ruta_personal2)) {
				// 	        mkdir($ruta_personal2, 0777, true);
				// 	    }
				// 	    //referencias personales 2
				// 	    	for ($d=0;$d<count($_FILES);$d++){
				// 	    		if(isset($_FILES["documento_personal2".$d])){
				// 		        $file = $_FILES["documento_personal2".$d];
				// 		        $nombre = $file["name"];
				// 		        $tipo = $file["type"];
				// 		        $ruta_provisional = $file["tmp_name"];
				// 		        $carpeta=$ruta_personal2;
				// 		        $src=$carpeta.$nombre;
				// 		        move_uploaded_file($ruta_provisional, $src);
				// 		    	}
				// 	    	}

				// 	 //FOTOS CONDUCTOR
				// 	    $ruta_fotos1="../public/files/proveedores/fotos/".$id_proveedor."/";
				// 	    $ruta_fotos11="public/files/proveedores/fotos/".$id_proveedor."/";
				// 	     $sqlf = "UPDATE cmx_detalle_conductor SET foto_conductor='$ruta_fotos11'
				// 	    		WHERE id_proveedor= ".$id_proveedor."";
				// 	    $consulta_foto_conductor = $conexion->prepare($sqlf);
				// 	    $consulta_foto_conductor->execute();
				// 	      if (!file_exists($ruta_fotos1)) {
				// 	        mkdir($ruta_fotos1, 0777, true);
				// 	    }
				// 	    //fotos
				// 	    	for ($k=0;$k<count($_FILES);$k++){
				// 	    		if(isset($_FILES["foto_conductor".$k])){	
				// 			        $file = $_FILES["foto_conductor".$k];
				// 			        $nombre = $file["name"];
				// 			        $tipo = $file["type"];
				// 			        $ruta_provisional = $file["tmp_name"];
				// 			        $carpeta=$ruta_fotos1;
				// 			        $src=$carpeta.$nombre;
				// 			        move_uploaded_file($ruta_provisional, $src);
				// 	    	}
				// 	    }

				//  //INDUMENTARIA
				// 	 $ruta_indumentaria1="../public/files/proveedores/indumentaria/".$id_proveedor."/";
				// 	 $ruta_indumentaria11="public/files/proveedores/indumentaria/".$id_proveedor."/";
				// 	 $sqli = "UPDATE cmx_detalle_conductor SET foto_indumentaria='$ruta_indumentaria11' WHERE id_proveedor= ".$id_proveedor."   ";
				//  	$consulta_ind_conductor = $conexion->prepare($sqli);
				//  	$consulta_ind_conductor->execute();	
				//  	if (!file_exists($ruta_indumentaria1)) {
				// 	        mkdir($ruta_indumentaria1, 0777, true);
				// 	    }
				// 	    //indumentaria
				// 	    for ($n=0;$n<count($_FILES);$n++){
				// 	    	if(isset($_FILES["foto_indume".$n])){
				// 		        $file = $_FILES["foto_indume".$n];
				// 		        $nombre = $file["name"];
				// 		        $tipo = $file["type"];
				// 		        $ruta_provisional = $file["tmp_name"];
				// 		        $carpeta=$ruta_indumentaria1;
				// 		        $src=$carpeta.$nombre;
				// 		        move_uploaded_file($ruta_provisional, $src);
				// 		    }
				// 	    }

				// 	//CURSO MERCANCIAS PELIGROSAS
				// 	  $ruta_mercancias1="../public/files/proveedores/curso/".$id_proveedor."/";
				// 	  $ruta_mercancias11= "public/files/proveedores/curso/".$id_proveedor."/";
				// 	  $sqlm= "UPDATE cmx_detalle_conductor SET  carnet_curso= '$ruta_mercancias11' WHERE id_proveedor=".$id_proveedor."";
				// 	  $consulta_mer_conductor = $conexion->prepare($sqlm);
				// 	  $consulta_mer_conductor->execute();
				// 	   if (!file_exists($ruta_mercancias1)) {
				// 	        mkdir($ruta_mercancias1, 0777, true);
				// 	  }
				// 	   //mercancias
				// 	for ($e=0;$e<count($_FILES);$e++){
				// 		if(isset($_FILES["docu_curso".$e])){
				// 	        $file = $_FILES["docu_curso".$e];
				// 	        $nombre = $file["name"];
				// 	        $tipo = $file["type"];
				// 	        $ruta_provisional = $file["tmp_name"];
				// 	        $carpeta=$ruta_mercancias1;
				// 	        $src=$carpeta.$nombre;
				// 	        move_uploaded_file($ruta_provisional, $src);
				// 		  	}
				// 	}

				// 		//RUT
				// 	 $ruta_rut1="../public/files/proveedores/rut/".$id_proveedor."/";
				// 	  $ruta_rut11= "public/files/proveedores/rut/".$id_proveedor."/";
				// 	  $sqlrut= "UPDATE cmx_detalle_conductor SET  documento_rut= '$ruta_rut11' WHERE id_proveedor=".$id_proveedor."";
				// 	  $consulta_rut_conductor = $conexion->prepare($sqlrut);
				// 	  $consulta_rut_conductor->execute();
				// 	   if (!file_exists($ruta_rut1)) {
				// 	        mkdir($ruta_rut1, 0777, true);
				// 	  }
				// 	   //rut
				// 	for ($s=0;$s<count($_FILES);$s++){
				// 		if(isset($_FILES["rut".$s])){
				// 	        $file = $_FILES["rut".$s];
				// 	        $nombre = $file["name"];
				// 	        $tipo = $file["type"];
				// 	        $ruta_provisional = $file["tmp_name"];
				// 	        $carpeta=$ruta_rut1;
				// 	        $src=$carpeta.$nombre;
				// 	        move_uploaded_file($ruta_provisional, $src);
				// 		  	}
				// 	}
					    
				// 	        $sql =" INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ($id_proveedor,'Conductor')";
				// 	        $crear_solicitud = $conexion->prepare($sql);
				// 	        $result=$crear_solicitud->execute();
				// 	    } 
					   
				// 	    if ($poseedor_vehiculo == "true" ){
				// 	        $sql      = " INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ($id_proveedor,'Poseedor Vehiculo')";
				// 	        $crear_solicitud = $conexion->prepare($sql);
				// 	        $result=$crear_solicitud->execute();
				// 	    } 
				// 	    if ($propietario_vehiculo == "true" ){
				// 	        $sql      = " INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ($id_proveedor,'Propietario Vehiculo')";
				// 	        $crear_solicitud = $conexion->prepare($sql);
				// 	        $result=$crear_solicitud->execute();
				// 	    } 
				// 	    if ($Proveedor == "true" ){
				// 	        $sql      = " INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ($id_proveedor,'Proveedor')";
				// 	        $crear_solicitud = $conexion->prepare($sql);
				// 	        $result=$crear_solicitud->execute();
				// 	    } 

				// 	    $sql_m="SELECT * FROM cmx_modulos
				// 	    		 WHERE estado='Activo'";
				// 	    	$crear_solicitud = $conexion->prepare($sql_m);
				// 	        $result=$crear_solicitud->execute();

				// 	    $return["success"] = true;
				// 	}
				// 	$return["error"] = $_msg_error;
				// 	return $return;
	 //    }


		public function crearProveedor(){
			$_flag_proceso = true;
			$_msg_error = "";
			$rndc_ingresoid = NULL;

			// if( $_POST["tipo_documento"] != "Identificacion Tributaria Internacional" ){
					// 	/******** INSERCION DE CONTENIDO DEL TERCERO EN EL RNDC  ********/
					// 	$Data = new Consultas;

					// 	$arrayMinTrans = Array();
					// 	// Solicitud
					// 	$arrayMinTrans["solicitud"] = Array(
					// 		"tipo" => 3,
					// 		"procesoid" => 11,
					// 	);
					// 	// Variable que se envían para la consulta  
					// 	$arrayMinTrans["variables"] = "INGRESOID";

					// 	$documento_tercero = $_POST["numero_documento"];
					// 	if ( $_POST["tipo_documento"] == "NIT" ) {
					// 		$documento_tercero = $_POST["numero_documento"] . $_POST["digito_verificacion"];
					// 	}

					// 	$arrayMinTrans["documento"] = Array(
					// 		"NUMNITEMPRESATRANSPORTE" 	=> MINTRANS_NIT,
					// 		"NUMIDTERCERO"				=> "'" . $documento_tercero . "'"
					// 	);
					// 	$return["verifica_tercero_array"] = $arrayMinTrans;

					// 	$result = $Data->getRNDCQueryArray( $arrayMinTrans ); 
					// 	$return["verifica_tercero_result"] = $result;

					// 	// Se valida si la operación fue exitosa
					// 	if ( isset( $result["ErrorMSG"] ) ){
					// 		// Solicitud
					// 		$arrayMinTrans["solicitud"] = Array(
					// 			"tipo" => 1,
					// 			"procesoid" => 11,
					// 		);
					// 		// Variable que se envían para la realizació del proceso 
					// 		$arrayMinTrans["variables"] = Array(
					// 			"NUMNITEMPRESATRANSPORTE"			=> MINTRANS_NIT,
					// 			"CODTIPOIDTERCERO"					=> $Data->getRNDCTipoDocumento( $_POST["tipo_documento"] ) ,
					// 			"NUMIDTERCERO"						=> $_POST["numero_documento"],
					// 			"NOMIDTERCERO"						=> $_POST["rndc_nombre"],
					// 			"NOMENCLATURADIRECCION"				=> $_POST["direccion"],
					// 			"CODMUNICIPIORNDC"					=> $_POST["rndc_id_municipio"], 
					// 		);

					// 		$arrayMinTrans["variables"]["NUMIDTERCERO"] = $_POST["numero_documento"];
					// 		if ( $_POST["tipo_documento"] == "NIT" ) {
					// 			$arrayMinTrans["variables"]["NUMIDTERCERO"] = $_POST["numero_documento"] . $_POST["digito_verificacion"];
					// 			$arrayMinTrans["variables"]["CODSEDETERCERO"] = 0;
					// 			$arrayMinTrans["variables"]["NOMSEDETERCERO"] = $_POST["abreviatura"];
					// 		}

					// 		if ( isset( $_POST["primer_apellido"] ) ) {
					// 			$arrayMinTrans["variables"]["PRIMERAPELLIDOIDTERCERO"] = $_POST["primer_apellido"];
					// 		}
					// 		if ( isset( $_POST["segundo_apellido"] ) ) {
					// 			$arrayMinTrans["variables"]["SEGUNDOAPELLIDOIDTERCERO"] = $_POST["segundo_apellido"];
					// 		}
					// 		if ( isset( $_POST["contacto"] ) AND $_POST["contacto"] != "" AND $_POST["contacto"] != 0 ) {
					// 			$arrayMinTrans["variables"]["NUMTELEFONOCONTACTO"] = $_POST["contacto"];
					// 		}
					// 		if ( isset( $_POST["celular"] ) AND $_POST["celular"] != "" AND $_POST["celular"] != 0 ) {
					// 			$arrayMinTrans["variables"]["NUMCELULARPERSONA"] = $_POST["celular"];
					// 		}
					// 		if ( isset( $_POST["categoria_licencia"] ) ) {
					// 			$arrayMinTrans["variables"]["CODCATEGORIALICENCIACONDUCCION"] = $_POST["categoria_licencia"];
					// 		}
					// 		if ( isset( $_POST["numero_licencia"] ) ) {
					// 			$arrayMinTrans["variables"]["NUMLICENCIACONDUCCION"] = $_POST["numero_licencia"];
					// 		}
					// 		if ( isset( $_POST["vencimiento_licencia"] ) ) {
					// 			$arrayMinTrans["variables"]["FECHAVENCIMIENTOLICENCIA"] = $_POST["vencimiento_licencia"];
					// 		}
					// 		// $return["crea_tercero_array"] = $arrayMinTrans;

					// 		// Se ejecuta la consulta hacia el RNDC del ministerio de transporte 
					// 		$result = $Data->getRNDCQueryArray( $arrayMinTrans );
					// 		// $return["crea_tercero_result"] = $result;

					// 		// Se valida si la operación fue exitosa
					// 		if ( isset( $result["ErrorMSG"] ) ) {
					// 			$_flag_proceso = false;
					// 			$_msg_error.= "<p><strong>Registro no actualizado en RNDC - Tercero.</strong></p>";
					// 			$_msg_error.= $result["ErrorMSG"];
					// 		}else{
					// 			$rndc_ingresoid = $result["ingresoid"];
					// 			// $return["crea_tercero_id_crea"] = $rndc_ingresoid;
					// 		}
					// 	}else{
					// 		$sql = '
					// 			SELECT 
					// 				COUNT(cp.id) CUANTOS
					// 			FROM 
					// 				cmx_proveedores cp
					// 			WHERE 
					// 				cp.numero_documento = ' . $_POST["numero_documento"] . '
					// 		';
					// 		$result = $Data->getConsulta($sql);

					// 		if ( $result["rowsData"][0]["CUANTOS"] == 0 ) {
					// 			// Solicitud
					// 			$arrayMinTrans["solicitud"] = Array(
					// 				"tipo" => 1,
					// 				"procesoid" => 11,
					// 			);
					// 			// Variable que se envían para la realizació del proceso 
					// 			$arrayMinTrans["variables"] = Array(
					// 				"NUMNITEMPRESATRANSPORTE"			=> MINTRANS_NIT,
					// 				"CODTIPOIDTERCERO"					=> $Data->getRNDCTipoDocumento( $_POST["tipo_documento"] ) ,
					// 				"NUMIDTERCERO"						=> $_POST["numero_documento"],
					// 				"NOMIDTERCERO"						=> $_POST["rndc_nombre"],
					// 				"NOMENCLATURADIRECCION"				=> $_POST["direccion"],
					// 				"CODMUNICIPIORNDC"					=> $_POST["rndc_id_municipio"], 
					// 			);

					// 			$arrayMinTrans["variables"]["NUMIDTERCERO"] = $_POST["numero_documento"];
					// 			if ( $_POST["tipo_documento"] == "NIT" ) {
					// 				$arrayMinTrans["variables"]["NUMIDTERCERO"] = $_POST["numero_documento"] . $_POST["digito_verificacion"];
					// 				$arrayMinTrans["variables"]["CODSEDETERCERO"] = 0;
					// 				$arrayMinTrans["variables"]["NOMSEDETERCERO"] = $_POST["abreviatura"];
					// 			}

					// 			if ( isset( $_POST["primer_apellido"] ) ) {
					// 				$arrayMinTrans["variables"]["PRIMERAPELLIDOIDTERCERO"] = $_POST["primer_apellido"];
					// 			}
					// 			if ( isset( $_POST["segundo_apellido"] ) ) {
					// 				$arrayMinTrans["variables"]["SEGUNDOAPELLIDOIDTERCERO"] = $_POST["segundo_apellido"];
					// 			}
					// 			if ( isset( $_POST["contacto"] ) AND $_POST["contacto"] != "" AND $_POST["contacto"] != 0 ) {
					// 				$arrayMinTrans["variables"]["NUMTELEFONOCONTACTO"] = $_POST["contacto"];
					// 			}
					// 			if ( isset( $_POST["celular"] ) AND $_POST["celular"] != "" AND $_POST["celular"] != 0 ) {
					// 				$arrayMinTrans["variables"]["NUMCELULARPERSONA"] = $_POST["celular"];
					// 			}
					// 			if ( isset( $_POST["categoria_licencia"] ) ) {
					// 				$arrayMinTrans["variables"]["CODCATEGORIALICENCIACONDUCCION"] = $_POST["categoria_licencia"];
					// 			}
					// 			if ( isset( $_POST["numero_licencia"] ) ) {
					// 				$arrayMinTrans["variables"]["NUMLICENCIACONDUCCION"] = $_POST["numero_licencia"];
					// 			}
					// 			if ( isset( $_POST["vencimiento_licencia"] ) ) {
					// 				$arrayMinTrans["variables"]["FECHAVENCIMIENTOLICENCIA"] = $_POST["vencimiento_licencia"];
					// 			}
					// 			// $return["crea_tercero_array"] = $arrayMinTrans;

					// 			// Se ejecuta la consulta hacia el RNDC del ministerio de transporte 
					// 			$result = $Data->getRNDCQueryArray( $arrayMinTrans );
					// 			// $return["crea_tercero_result"] = $result;

					// 			// Se valida si la operación fue exitosa
					// 			if ( isset( $result["ErrorMSG"] ) ) {
					// 				$_flag_proceso = false;
					// 				$_msg_error.= "<p><strong>Registro no actualizado en RNDC - Tercero.</strong></p>";
					// 				$_msg_error.= $result["ErrorMSG"];
					// 			}else{
					// 				$rndc_ingresoid = $result["ingresoid"];
					// 				// $return["crea_tercero_id_crea"] = $rndc_ingresoid;
					// 			}
					// 		} else {
					// 			$_flag_proceso = false;
					// 			$_msg_error.= "<p><strong>Registro no actualizado en RNDC - Tercero.</strong></p>";
					// 			$_msg_error.= "<p>Registro ya existe en el RNDC</p>";
					// 		}
					// 	}
					// 	/******** FIN - INSERCION DE CONTENIDO DEL TERCERO EN EL RNDC  ********/
			// }
			$cont=0;

			if( $_flag_proceso ){
				$tipo_documento = $_POST["tipo_documento"];
				$numero_documento = $_POST["numero_documento"];
				$digito_verificacion = $_POST["digito_verificacion"];
				$tipo_identificacion = $_POST["tipo_identificacion"];
				$nombre = $_POST["nombre"];
				//apellidos
				if($_POST["tipo_documento"]!=='NIT' && $_POST["tipo_documento"]!=='Identificacion Tributaria Internacional'){
					$apellido1 = $_POST["1apellido"];
					$apellido2 = $_POST["2apellido"];
				}else{
					$apellido1='';
					$apellido2='';
				}
				//
				$abreviatura = $_POST["abreviatura"];
				$contacto = $_POST["contacto"];
				$celular = $_POST["celular"];
				$direccion = $_POST["direccion"];
				$email = $_POST["email"];
				$estado = $_POST["estado"];
				$id_municipio = $_POST["municipio"];
				$id_usuario = $_SESSION["usuario"]["id_usuario"];
				$Conductor = $_POST["Conductor"];
				$poseedor_vehiculo = $_POST["poseedor_vehiculo"];
				$propietario_vehiculo = $_POST["propietario_vehiculo"];
				$Proveedor = $_POST["Proveedor"];
				$sexo=$_POST["sexo"];
				$fecha_actual=date('Y-m-d');
				$hora_actual=date('H:i:s');
				$user=$_SESSION["usuario"]["nom_usuario"];

				if(isset($_POST["categoria_licencia"])){
					$rndc_categoria_licencia = "";
				}else{
					$rndc_categoria_licencia = "";
				}

				if(isset($_POST["numero_licencia"])){
					$rndc_numero_licencia = "";
				}else{
					$rndc_numero_licencia = "";
				}

				if(isset($_POST["vencimiento_licencia"])){
					$rndc_vencimiento_licencia = "";
				}else{
					$rndc_vencimiento_licencia = "";
				}

				if ( $Conductor == "true" ) {
					$rndc_categoria_licencia = $_POST["categoria_licencia"];
					$rndc_numero_licencia = $_POST["numero_licencia"];
					$rndc_vencimiento_licencia = $_POST["vencimiento_licencia"];
					//demas datos de conductor
					if(isset($_POST["name_eps"])){
						$nombre_eps=$_POST["name_eps"];
					}else{
						$nombre_eps ='';
					}
					if(isset($_POST["vence_eps"])){
						$fecha_vencimiento=$_POST["vence_eps"];
					}else{
						$fecha_vencimiento ='';
					}
					
						$ultimo_eps='';
						$nombre_arl ='';	
						$fecha_vencimiento_arl='';
						$ultimo_arl='';

					if(isset($_POST["nom_enti"])){
						$nombre_entidad =$_POST["nom_enti"];
					}else{
						$nombre_entidad ='';
					}
					if(isset($_POST["vence_curso"])){
						$vence_curso =$_POST["vence_curso"];
					}else{
						$vence_curso ='';
					}
					if(isset($_POST["sexo"])){
						$sex=$_POST["sexo"];
					}else{
						$sex='';
					}
					if(isset($_POST["fecha_nacimiento"])){
						$fecha_nace=$_POST["fecha_nacimiento"];
					}else{
						$fecha_nace='';
					}
					if(isset($_POST["sangre"])){
						$sangre=$_POST["sangre"];
					}else{
						$sangre='';
					}
					$civil='';
					if(isset($_POST["fecha_ingreso"])){
						$fecha_ingreso=$_POST["fecha_ingreso"];
					}else{
						$fecha_ingreso='';
					}
					if(isset($_POST["celular2"])){
						$celular2=$_POST["celular2"];
					}else{
						$celular2='';
					}
					
					$referencias_empresariales =$_POST["referencias_empresariales1"];
					$fecha_ereferencia1 = $_POST["fecha_referencia1"];
					$fecha_retiro1 = $_POST["fecha_retiro1"];
					$contacto_ref1= $_POST["contacto_ref1"];
					$celular_ref1 = $_POST["celular_ref1"];
					$cargo_ref1 = $_POST["cargo_ref1"];
					$anti_ref1 = $_POST["anti_ref1"];

					$referencia_empresarial2 = $_POST["referencias_empresariales2"];
					$fecha_ereferencia2 =$_POST["fecha_referencia2"];
					$fecha_retiro2 =$_POST["fecha_retiro2"];
					$contacto_ref2=$_POST["contacto_ref2"];
					$celular_ref2=$_POST["celular_ref2"];
					$cargo_ref2=$_POST["cargo_ref2"];
					$anti_ref2=$_POST["anti_ref2"];

					$referencias_empresariales3= $_POST["referencias_empresariales3"];
					$fecha_referencia3= $_POST["fecha_referencia3"];
					$fecha_retiro3= $_POST["fecha_retiro3"];
					$contacto_ref3 =$_POST["contacto_ref3"];
					$celular_ref3=$_POST["celular_ref3"];
					$cargo_ref3=$_POST["cargo_ref3"];
					$anti_ref3=$_POST["anti_ref3"];

					$referencias_personales = $_POST["referencias_personales"];
					$fecha_preferencia1 = $_POST["fecha_personal1"];
					$parenp1=$_POST["parenp1"];
					$telefonop1=$_POST["telefonop1"];

					$refe_personal2 = $_POST["referencias_personales2"];
					$fecha_preferencia2 = $_POST["fecha_personal2"];
					$parenp2=$_POST["parenp2"];
					$telefonop2=$_POST["telefonop2"];  

					//NOMBRES DE LOS DOCUMENTOS
					if(isset($_POST["name_soporte"])){
						$name_soporte=$_POST["name_soporte"];
					}else{
						$name_soporte='';
					}
					
					if(isset($_POST["name_soporte2"])){
						$name_soporte2=$_POST["name_soporte2"];
					}else{
						$name_soporte2='';
					}
					
					if(isset($_POST["name_soporte3"])){
						$name_soporte3=$_POST["name_soporte3"];	
					}else{
						$name_soporte3='';
					}

					if(isset($_POST["docu_personal1"])){
						$docu_personal1=$_POST["docu_personal1"];
					}else{
						$docu_personal1='';
					}

					if(isset($_POST["docu_personal2"])){
						$docu_personal2=$_POST["docu_personal2"];

					}else{
						$docu_personal2='';

					}

					if(isset($_POST["namedocu_eps"])){
						$namedocu_eps=$_POST["namedocu_eps"];
					}else{
						$namedocu_eps='';
					}
						$namedocu_arl='';
					
					if(isset($_POST["namedocu_curso"])){
						$namedocu_curso=$_POST["namedocu_curso"];
					}else{
						$namedocu_curso='';
					}
					
					if(isset($_POST["name_docurut"])){
						$name_docurut=$_POST["name_docurut"];
					}else{
						$name_docurut='';
					}
					
					if(isset($_POST["name_doculice"])){
						$name_doculice=$_POST["name_doculice"];
					}else{
						$name_doculice='';
					}

					//nombre de las fotos del conductr
					

					if(isset($_POST["name_fontall"])){
						$name_fontal=$_POST["name_fontall"];
					}else{
						$name_fontal='';
					}

					if(isset($_POST["name_derecha"])){
						$name_derecha=$_POST["name_derecha"];
					}else{
						$name_derecha='';
					}

					if(isset($_POST["name_izquierda"])){
						$name_izquierda=$_POST["name_izquierda"];
					}else{
						$name_izquierda='';
					}

					if(isset($_POST["name_indum"])){
						$name_indu=$_POST["name_indum"];
					}else{
						$name_indu='';
					}

					//nombre de acuerdos

					if(isset($_POST["name_a1"])){
						$name_a1=$_POST["name_a1"];
					}else{
						$name_a1='';
					}

				}
				$model    = new Conexion;
				$conexion = $model->conectar();
				$_db3="";
				$this->_db3 = new Database2();
				/*$sql = "
					INSERT INTO 
						cmx_proveedores (
							rndc_id, tipo_documento, numero_documento, digito_verificacion,tipo_identificacion, nombre,apellido1,apellido2,
							abreviatura, contacto, celular, direccion, email, id_municipio, rndc_categoria_licencia, 
							rndc_numero_licencia, rndc_vencimiento_licencia,estado
						)
					VALUES (
						'$rndc_ingresoid','$tipo_documento','$numero_documento','$digito_verificacion','$tipo_identificacion','$nombre','$apellido1','$apellido2','$abreviatura','$contacto','$celular','$direccion','$email',$id_municipio,'$rndc_categoria_licencia',
						'$rndc_numero_licencia','$rndc_vencimiento_licencia','$estado'
					)";
				//echo $sql;*/
				$sql = "
					INSERT INTO 
						cmx_proveedores (
							rndc_id, tipo_documento, numero_documento, digito_verificacion,tipo_identificacion, nombre,apellido1,apellido2,
							abreviatura, contacto, celular, direccion, email, id_municipio, rndc_categoria_licencia, 
							rndc_numero_licencia, rndc_vencimiento_licencia,estado,sexo
						)
					VALUES (
						:rndc_id,:tipo_documento,:numero_documento,:digito_verificacion,:tipo_identificacion,:nombre,:apellido1,:apellido2,:abreviatura,:contacto,:celular,:direccion,:email,:id_municipio,:rndc_categoria_licencia,:rndc_numero_licencia,:rndc_vencimiento_licencia,
						:estado,:sexo
					)";

					try {
					$this->_db3->beginTransaction();
					$this->_db3->prepare($sql)->execute(array(
					":rndc_id" => 0,
					":tipo_documento" =>$tipo_documento,
					":numero_documento" =>$numero_documento,
					":digito_verificacion" =>$digito_verificacion,
					":tipo_identificacion" =>$tipo_identificacion,
					":nombre" =>$nombre,
					":apellido1"=>$apellido1,
					":apellido2"=>$apellido2,
					":abreviatura"=>$abreviatura,
					":contacto"=>$contacto,
					":celular"=>$celular,
					":direccion"=>$direccion,
					":email"=>$email,
					":id_municipio"=>$id_municipio,
					":rndc_categoria_licencia"=>$rndc_categoria_licencia,
					":rndc_numero_licencia"=>$rndc_numero_licencia,
					":rndc_vencimiento_licencia"=>$rndc_vencimiento_licencia,
					":estado"=>$estado,
					":sexo" =>$sexo					

					));
					$this->_db3->commit();

				}catch(PDOException $e){
				$error = $e->getMessage();
				$this->_db3->rollBack();
				}

				//$crear_solicitud = $conexion->prepare($sql);
				//$result = $crear_solicitud->execute();

			    $sql = "SELECT max(id) as 'id' FROM cmx_proveedores";
			    $consulta_solic_vehic = $conexion->prepare($sql);
			    $consulta_solic_vehic->execute();
			    $datos_proveedor = $consulta_solic_vehic->fetch();

			    $id_proveedor = $datos_proveedor["id"];
			    $ruta = "../public/files/proveedores/".$id_proveedor."/";     
			    $ruta_base= "public/files/proveedores/".$id_proveedor."/";     

			    $sql = "UPDATE cmx_proveedores SET documentos_soporte = '$ruta_base' WHERE id = ".$id_proveedor."";
			    $consulta_act_proveedor = $conexion->prepare($sql);
			    $consulta_act_proveedor->execute();

			    $sql = "
			        INSERT INTO 
			            cmx_log_proveedores (id_usuario,id_proveedor,operacion,fecha_hora_operacion) 
			        VALUES ($id_usuario,$id_proveedor,'Crear',NOW())";
			    $crear_log_proveedor = $conexion->prepare($sql);
			    $crear_log_proveedor->execute();


			    //CREAR DATOS FINANCIEROS
			    if($poseedor_vehiculo == "true" || $propietario_vehiculo == "true"){
					if(isset($_POST["actividad_econo"])){
						$actividade=$_POST["actividad_econo"];
					}else{
						$actividade='';
					}
					if(isset($_POST["tributarias"])){
						$tribu=$_POST["tributarias"];
					}else{
						$tribu='';
					}
					if(isset($_POST["banco"])){
						$banco=$_POST["banco"];
					}else{
						$banco='';
					}
					if(isset($_POST["tipocuenta"])){
						$tipocuenta=$_POST["tipocuenta"];
					}else{
						$tipocuenta='';
					}
					if(isset($_POST["numerocuenta"])){
						$numero=$_POST["numerocuenta"];
					}else{
						$numero='';
					}
					$sql_financiero="INSERT INTO cmx_proveedor_financieros(id,actividad_economica,obliga_tributaria,banco,tipo_cuenta,numero_cuenta,id_proveedor)
					VALUES(null,'$actividade','$tribu','$banco','$tipocuenta','$numero','$id_proveedor')";
					$crear_solicitud_financiera = $conexion->prepare($sql_financiero);
			        $result_financiero=$crear_solicitud_financiera->execute();
				}

			    if (!file_exists($ruta)) {
			        mkdir($ruta, 0777, true);
			    }

			    for ($x=0;$x<count($_FILES);$x++){
			    	if(isset($_FILES["documentos".$x])){
			        $file = $_FILES["documentos".$x];
			        $nombre = $file["name"];
			        $tipo = $file["type"];
			        $ruta_provisional = $file["tmp_name"];
			        $carpeta=$ruta;
			        $src=$carpeta.$nombre;
			        move_uploaded_file($ruta_provisional, $src);
			    	}
				}

			    if ($Conductor == "true" ){

			    	$sqlc="INSERT INTO cmx_detalle_conductor
			    	(id,
			    	celular2,
			    	nombre_eps,
			    	fecha_vence_eps,
			    	ultimo_eps,
			    	nombre_arl,
			    	fecha_vence_arl,
			    	ultimo_arl,
			    	nombre_entidad,
			    	vence_curso,
			    	sexo,
			    	fecha_nacimiento,
			    	grupo_sanguineo,
			    	estado_civil,
			    	fecha_ingreso,
			    	id_proveedor)
			    	VALUES(null,
			    	'$celular2',
			    	'$nombre_eps',
			    	'$fecha_vencimiento',
			    	'$ultimo_eps',
			    	'$nombre_arl',
			    	'$fecha_vencimiento_arl',
					'$ultimo_arl',
			    	'$nombre_entidad',
			    	'$vence_curso',
			    	'$sex',
			    	'$fecha_nace',
			    	'$sangre',
			    	'$civil',
			    	'$fecha_ingreso',
			    	'$id_proveedor')";
			    	$crear_solicitud = $conexion->prepare($sqlc);
			        $result=$crear_solicitud->execute();


			        $sql_block="INSERT INTO cmx_estado_bloqueo
			       		 VALUES
						(NULL,'modificar','desbloqueado',".$id_proveedor.",'proveedor','".$fecha_actual."','".$hora_actual."','".$user."')";
					$crear_block = $conexion->prepare($sql_block);
			        $result=$crear_block->execute();	


			        //VALIDAR SI existe la referencia laboral
			    	$sql_z="SELECT * FROM cmx_referencias_preestudio
						WHERE id_conductor=$numero_documento  ";
			        $selectr = $conexion->prepare($sql_z);
			    	$selectr->execute();	
			   		$total = $selectr->rowCount();

			   		if($total==0){//insertar referencias laborales
					        //insert de referencias laborales
					        	//crear las rutas
					        $ruta_empresarial1="../public/files/proveedores/empresarial/".$id_proveedor."/1/";
							$ruta_empresarial11="public/files/proveedores/empresarial/".$id_proveedor."/1/";

					        $sql_rl1="INSERT INTO 
					        cmx_referencias_preestudio
					        (id,nombre_empresa,fecha_ingreso,fecha_retiro,persona_contacto,celular,cargo,id_conductor,antiguedad,
					        documento_empresarial,name_documento,fecha,hora,usuario,estado)
					        VALUES(null,'$referencias_empresariales ','$fecha_ereferencia1','$fecha_retiro1','$contacto_ref1','$celular_ref1','$cargo_ref1','$id_proveedor','$anti_ref1','$ruta_empresarial11','$name_soporte','$fecha_actual','$hora_actual','$user','1');";
					      //  echo $sql_rl1;
					        $crear_rlab1 = $conexion->prepare($sql_rl1);
					        $resultl1=$crear_rlab1->execute();

					          //ARCHIVOS DE REFERENCIAS LABORALES 	 1
					        if($resultl1){
					        	//obtener el id de la referencia laboral 1
							    if (!file_exists($ruta_empresarial1)) {
							        mkdir($ruta_empresarial1, 0777, true);
							   	 	}
					    		//referencias empresariales 1
								   	for ($a=0;$a<count($_FILES);$a++){
								   		if(isset($_FILES["documento_referencia1".$a])){
								        $file =$_FILES["documento_referencia1".$a];
								        $nombre = $file["name"];
								        $tipo = $file["type"];
								        $ruta_provisional=$file["tmp_name"];
								        $carpeta=$ruta_empresarial1;
								        $src=$carpeta.$nombre;
								        move_uploaded_file($ruta_provisional, $src);
								    	}
									}
					        	}

					         $ruta_empresarial2="../public/files/proveedores/empresarial/".$id_proveedor."/2/";
					    	$ruta_empresarial22="public/files/proveedores/empresarial/".$id_proveedor."/2/";

					    	//nombres de los documentos
					        $sql_rl2="INSERT INTO 
					        cmx_referencias_preestudio
					        (id,nombre_empresa,fecha_ingreso,fecha_retiro,persona_contacto,celular,cargo,id_conductor,antiguedad,documento_empresarial,name_documento,fecha,hora,usuario,estado)
					        VALUES(null,'$referencia_empresarial2','$fecha_ereferencia2','$fecha_retiro2','$contacto_ref2','$celular_ref2','$cargo_ref2','$id_proveedor','$anti_ref2','$ruta_empresarial22','$name_soporte2','$fecha_actual','$hora_actual','$user','1');";
					       // echo $sql_rl2;
					        $crear_rlab2 = $conexion->prepare($sql_rl2);
					        $resultl2=$crear_rlab2->execute();
					        if($resultl2){
					        	 if (!file_exists($ruta_empresarial2)) {
					       			 mkdir($ruta_empresarial2, 0777, true);
					    		}
					    		//referencias empresariales 2
							   for ($b=0;$b<count($_FILES);$b++){
							   	if(isset($_FILES["documento_referencia2".$b])){
								      $file =$_FILES["documento_referencia2".$b];
								      $nombre = $file["name"];
								      $tipo = $file["type"];
								      $ruta_provisional=$file["tmp_name"];
								      $carpeta=$ruta_empresarial2;
								      $src=$carpeta.$nombre;
								      move_uploaded_file($ruta_provisional, $src);
							   		}
								}
					        }

					        $ruta_empresarial3="../public/files/proveedores/empresarial/".$id_proveedor."/3/";
					   		 $ruta_empresarial33="public/files/proveedores/empresarial/".$id_proveedor."/3/";
					        $sql_rl3="INSERT INTO 
					        cmx_referencias_preestudio
					        (id,nombre_empresa,fecha_ingreso,fecha_retiro,persona_contacto,celular,cargo,id_conductor,antiguedad,documento_empresarial,name_documento,fecha,hora,usuario,estado)
					        VALUES(null,'$referencias_empresariales3','$fecha_referencia3','$fecha_retiro3','$contacto_ref3','$celular_ref3','$cargo_ref3','$id_proveedor','$anti_ref3','$ruta_empresarial33','$name_soporte3','$fecha_actual','$hora_actual','$user','1');";
					       // echo $sql_rl3;
					        $crear_rlab3 = $conexion->prepare($sql_rl3);
					        $resultl3=$crear_rlab3->execute();
					        if($resultl3){
					        	 if (!file_exists($ruta_empresarial3)) {
					        		mkdir($ruta_empresarial3, 0777, true);
					   			 }		

							    for ($u=0;$u<count($_FILES);$u++){
								  if(isset($_FILES["documento_referencia3".$u])){
									      $file =$_FILES["documento_referencia3".$u];
									      $nombre = $file["name"];
									      $tipo = $file["type"];
									      $ruta_provisional=$file["tmp_name"];
									      $carpeta=$ruta_empresarial3;
									      $src=$carpeta.$nombre;
									      move_uploaded_file($ruta_provisional, $src);
								   	}
								}
					        }

					}else{//actualizar referencias laborales
						$idp1=$_POST["idp1"];
						$idp2=$_POST["idp2"];
						$idp3=$_POST["idp3"];

						$ruta_empresarial1="../public/files/proveedores/empresarial/".$id_proveedor."/1/";
						$ruta_empresarial11="public/files/proveedores/empresarial/".$id_proveedor."/1/";

						$aleatorio1=rand(10000,90000);
						$aleatorio2=rand(10000,90000);

						if(isset($name_soporte)){
							$nombrea=$aleatorio1.$name_soporte.$aleatorio2;
						}else{
							$nombrea='';
						}

						$sqlr1="UPDATE cmx_referencias_preestudio
								SET id_conductor=".$id_proveedor.",
									documento_empresarial='$ruta_empresarial11',
									name_documento='$nombrea'
								WHERE  id=".$idp1;
						$upref1 = $conexion->prepare($sqlr1);
					    $result=$upref1->execute();
					    if($result){

					    	if($name_soporte!='' && $name_soporte!=null){
					    		if (!file_exists($ruta_empresarial1)) {
							        mkdir($ruta_empresarial1, 0777, true);
							  }
					    		//referencias empresariales 1
								   	for ($a=0;$a<count($_FILES);$a++){
								   		if(isset($_FILES["documento_referencia1".$a])){
								        $file =$_FILES["documento_referencia1".$a];
								        $nombre =$aleatorio1.$file["name"].$aleatorio2;
								        $tipo = $file["type"];
								        $ruta_provisional=$file["tmp_name"];
								        $carpeta=$ruta_empresarial1;
								        $src=$carpeta.$nombre;
								        move_uploaded_file($ruta_provisional, $src);
								    	}
									}
					    	}
					    }	

					     $ruta_empresarial2="../public/files/proveedores/empresarial/".$id_proveedor."/2/";
					    $ruta_empresarial22="public/files/proveedores/empresarial/".$id_proveedor."/2/";

					    $aleatorio1=rand(10000,90000);
						$aleatorio2=rand(10000,90000);

						if(isset($name_soporte2)){
							$nombreb=$aleatorio1.$name_soporte2.$aleatorio2;
						}else{
							$nombreb='';
						}		

						$sqlr2="UPDATE cmx_referencias_preestudio
								SET id_conductor=".$id_proveedor.",
								documento_empresarial='$ruta_empresarial22',
								name_documento='$nombreb'
								WHERE id=".$idp2;
						$upref2 = $conexion->prepare($sqlr2);
					    $result2=$upref2->execute();

					    if($result2){
					    	if($name_soporte2!='' && $name_soporte2!=null){
					    		 if (!file_exists($ruta_empresarial2)) {
					       			 mkdir($ruta_empresarial2, 0777, true);
					    		}
					    		//referencias empresariales 2
							   for ($b=0;$b<count($_FILES);$b++){
							   	if(isset($_FILES["documento_referencia2".$b])){
								      $file =$_FILES["documento_referencia2".$b];
								      $nombre =$aleatorio1.$file["name"].$aleatorio2;
								      $tipo = $file["type"];
								      $ruta_provisional=$file["tmp_name"];
								      $carpeta=$ruta_empresarial2;
								      $src=$carpeta.$nombre;
								      move_uploaded_file($ruta_provisional, $src);
							   		}
								}
					    	}
					    }



					    $ruta_empresarial3="../public/files/proveedores/empresarial/".$id_proveedor."/3/";
					   	$ruta_empresarial33="public/files/proveedores/empresarial/".$id_proveedor."/3/";
					    $aleatorio1=rand(10000,90000);
						$aleatorio2=rand(10000,90000);
						if(isset($name_soporte3)){
							$nombrec=$aleatorio1.$name_soporte3.$aleatorio2;
						}else{
							$nombrec='';
						}

						$sqlr3="UPDATE cmx_referencias_preestudio
								SET id_conductor=".$id_proveedor.",
								documento_empresarial='$ruta_empresarial33',
								name_documento='$nombrec'
								WHERE id=".$idp3;
						$upref3 = $conexion->prepare($sqlr3);
					    $result3=$upref3->execute();
					    if($result3){

					    	if($name_soporte3!='' && $name_soporte!=null){
					    		if (!file_exists($ruta_empresarial3)) {
					        		mkdir($ruta_empresarial3, 0777, true);
					   			 }		

							    for ($u=0;$u<count($_FILES);$u++){
								  if(isset($_FILES["documento_referencia3".$u])){
									      $file =$_FILES["documento_referencia3".$u];
									      $nombre =$aleatorio1.$file["name"].$aleatorio2;
									      $tipo = $file["type"];
									      $ruta_provisional=$file["tmp_name"];
									      $carpeta=$ruta_empresarial3;
									      $src=$carpeta.$nombre;
									      move_uploaded_file($ruta_provisional, $src);
										   	}
										}
							    	}

							}
					   		}        

						      //REFERENCIAS PERSONALES
						      $ruta_personal1="../public/files/proveedores/personal/".$id_proveedor."/1/";
						     $ruta_personal11="public/files/proveedores/personal/".$id_proveedor."/1/";


						      $sql_rp1="INSERT INTO 
						      cmx_referencias_personales
						      (id,nombre_personal,fecha_personal,parentezco,tel_personal,documento_personal,name_documento,id_conductor,usuario,fecha,hora,estado)
						      VALUES(null,'$referencias_personales','$fecha_preferencia1','$parenp1','$telefonop1','$ruta_personal11','$docu_personal1','$id_proveedor','$user','$fecha_actual','$hora_actual','1')"; 
						      $crear_rper1 = $conexion->prepare($sql_rp1);
						      $resultl4=$crear_rper1->execute(); 
						      if($resultl4){
						      	 if (!file_exists($ruta_personal1)) {
						       		 mkdir($ruta_personal1, 0777, true);
						   	 		}
						   	 	//referencias personales 1
						    	for ($c=0;$c<count($_FILES);$c++){
						    		if(isset($_FILES["documento_personal1".$c])){
								        $file = $_FILES["documento_personal1".$c];
								        $nombre = $file["name"];
								        $tipo = $file["type"];
								        $ruta_provisional = $file["tmp_name"];
								        $carpeta=$ruta_personal1;
								        $src=$carpeta.$nombre;
								        move_uploaded_file($ruta_provisional, $src);
							    	}
						    	}
						      }

						      $ruta_personal2="../public/files/proveedores/personal/".$id_proveedor."/2/";
						     $ruta_personal22="public/files/proveedores/personal/".$id_proveedor."/2/";

						     
						     $sql_rp2="INSERT INTO 
						      cmx_referencias_personales
						      (id,nombre_personal,fecha_personal,parentezco,tel_personal,documento_personal,name_documento,id_conductor,usuario,fecha,hora,estado)
						      VALUES(null,'$refe_personal2','$fecha_preferencia2','$parenp2','$telefonop2','$ruta_personal22','$docu_personal2','$id_proveedor','$user','$fecha_actual','$hora_actual','1')";
						      $crear_rper2 = $conexion->prepare($sql_rp2);
						      $resultl5=$crear_rper2->execute(); 
						      if($resultl5){
						      		if (!file_exists($ruta_personal2)) {
						        		mkdir($ruta_personal2, 0777, true);
						    		}
						    		//referencias personales 2
						    	for ($d=0;$d<count($_FILES);$d++){
						    		if(isset($_FILES["documento_personal2".$d])){
								        $file = $_FILES["documento_personal2".$d];
								        $nombre = $file["name"];
								        $tipo = $file["type"];
								        $ruta_provisional = $file["tmp_name"];
								        $carpeta=$ruta_personal2;
								        $src=$carpeta.$nombre;
								        move_uploaded_file($ruta_provisional, $src);
							    	}
						    	}   
						      }

						         //REGISTRAR LA RUTA DEL ARCHIVO PARA LICENCIA DEL CONDUCTOR
						    $ruta_licencia = "../public/files/proveedores/licencias/".$id_proveedor."/"; 
						    $ruta_licencias = "public/files/proveedores/licencias/".$id_proveedor."/"; 
						    $sqll = "UPDATE cmx_proveedores 
						    	SET subir_licencia ='$ruta_licencias',
						    		n_docu_licencia='$name_doculice'
						    	WHERE id = ".$id_proveedor."";
						    $consulta_li_proveedor = $conexion->prepare($sqll);
						    $consulta_li_proveedor->execute();

						    if (!file_exists($ruta_licencia)) {
						        mkdir($ruta_licencia, 0777, true);
						    }

						    //LICENCIA
						    for ($i=0;$i<count($_FILES);$i++){
						    	if(isset($_FILES["licencia".$i])){
							        $file = $_FILES["licencia".$i];
							        $nombre = $file["name"];
							        $tipo = $file["type"];
							        $ruta_provisional = $file["tmp_name"];
							        $carpeta=$ruta_licencia;
							        $src=$carpeta.$nombre;
							        move_uploaded_file($ruta_provisional, $src);
						    	}
						    }

						    //REGISTRAR EL ARCHIVO DE LA EPS
						     $ruta_eps="../public/files/proveedores/eps/".$id_proveedor."/";
						    $ruta_eps2="public/files/proveedores/eps/".$id_proveedor."/"; 
						     $sqle = "UPDATE cmx_detalle_conductor SET documento_eps='$ruta_eps2',
						     	 n_docu_eps='$namedocu_eps'	
						    	WHERE id_proveedor = ".$id_proveedor."   ";
						    $consulta_eps_conductor = $conexion->prepare($sqle);
						    $consulta_eps_conductor->execute();	

						    if (!file_exists($ruta_eps)) {
						        mkdir($ruta_eps, 0777, true);
						    }

						    //EPS
						    	for ($m=0;$m<count($_FILES);$m++){
						    		if(isset($_FILES["docu_eps".$m])){
								        $file = $_FILES["docu_eps".$m];
								        $nombre = $file["name"];
								        $tipo = $file["type"];
								        $ruta_provisional = $file["tmp_name"];
								        $carpeta=$ruta_eps;
								        $src=$carpeta.$nombre;
								        move_uploaded_file($ruta_provisional, $src);
							    }
						    }

						    //ARCHIVOS ARL CONDUCTOR
						 /*    $ruta_arl="../public/files/proveedores/arl/".$id_proveedor."/";
						    $ruta_arl2="public/files/proveedores/arl/".$id_proveedor."/";
						    $sqla = "UPDATE cmx_detalle_conductor 
						    		SET documento_arl='$ruta_arl2',
						    			n_docu_arl='$namedocu_arl'
						   			 WHERE id_proveedor=".$id_proveedor."";
						    $consulta_arl_conductor = $conexion->prepare($sqla);
						    $consulta_arl_conductor->execute();	

						     if (!file_exists($ruta_arl)) {
						        mkdir($ruta_arl, 0777, true);
						    }

						    //ARL
						    	for ($g=0;$g<count($_FILES);$g++){
						    		if(isset($_FILES["docu_arl".$g])){
							        $file = $_FILES["docu_arl".$g];
							        $nombre = $file["name"];
							        $tipo = $file["type"];
							        $ruta_provisional = $file["tmp_name"];
							        $carpeta=$ruta_arl;
							        $src=$carpeta.$nombre;
							        move_uploaded_file($ruta_provisional, $src);
							    }
						    }*/
						  

						 //FOTOS CONDUCTOR
						    //foto_frontal
						    $ruta_fotos1="../public/files/proveedores/fotos/".$id_proveedor."/F/";
						    $ruta_fotos11="public/files/proveedores/fotos/".$id_proveedor."/F/";
						     $sqlf = "UPDATE cmx_detalle_conductor SET foto_conductor='$ruta_fotos11',
						     	name_cfrontal='$name_fontal'
						    		WHERE id_proveedor= ".$id_proveedor."";
						    $consulta_foto_conductor = $conexion->prepare($sqlf);
						    $consulta_foto_conductor->execute();
						      if (!file_exists($ruta_fotos1)) {
						        mkdir($ruta_fotos1, 0777, true);
						    }
						    //fotos
						    	for ($k=0;$k<count($_FILES);$k++){
						    		if(isset($_FILES["foto_conductor".$k])){	
								        $file = $_FILES["foto_conductor".$k];
								        $nombre = $file["name"];
								        $tipo = $file["type"];
								        $ruta_provisional = $file["tmp_name"];
								        $carpeta=$ruta_fotos1;
								        $src=$carpeta.$nombre;
								        move_uploaded_file($ruta_provisional, $src);
						    	}
						    }

						    //FOTO DERECHA
						    $ruta_fotod1="../public/files/proveedores/fotos/".$id_proveedor."/D/";
						    $ruta_fotod11="public/files/proveedores/fotos/".$id_proveedor."/D/";

						    $sqlfd="UPDATE cmx_detalle_conductor 
						    	SET foto_derecha='$ruta_fotod11',
						    		name_cderecha='$name_derecha'
						    		WHERE id_proveedor= ".$id_proveedor."";
						    $consulta_foto_conductord = $conexion->prepare($sqlfd);
						    $consulta_foto_conductord->execute();		
						     if (!file_exists($ruta_fotod1)) {
						        mkdir($ruta_fotod1, 0777, true);
						    }
						    //fotos
						    	for ($u=0;$u<count($_FILES);$u++){
						    		if(isset($_FILES["foto_derecha".$u])){	
								        $file = $_FILES["foto_derecha".$u];
								        $nombre = $file["name"];
								        $tipo = $file["type"];
								        $ruta_provisional = $file["tmp_name"];
								        $carpeta=$ruta_fotod1;
								        $src=$carpeta.$nombre;
								        move_uploaded_file($ruta_provisional, $src);
						    	}
						    }

						    //FOTO IZQUIERDA

						    
						    $ruta_fotoi1="../public/files/proveedores/fotos/".$id_proveedor."/I/";
						    $ruta_fotoi11="public/files/proveedores/fotos/".$id_proveedor."/I/";
						    $sqlfi="UPDATE cmx_detalle_conductor 
						    	SET foto_izquierda='$ruta_fotoi11',
						    		name_cizquierda='$name_izquierda'
						    		WHERE id_proveedor= ".$id_proveedor."";
						    $consulta_foto_conductori = $conexion->prepare($sqlfi);
						    $consulta_foto_conductori->execute();
						     if (!file_exists($ruta_fotoi1)) {
						        mkdir($ruta_fotoi1, 0777, true);
						    }
						    //fotos
						    	for ($v=0;$v<count($_FILES);$v++){
						    		if(isset($_FILES["foto_izquierda".$v])){	
								        $file = $_FILES["foto_izquierda".$v];
								        $nombre = $file["name"];
								        $tipo = $file["type"];
								        $ruta_provisional = $file["tmp_name"];
								        $carpeta=$ruta_fotoi1;
								        $src=$carpeta.$nombre;
								        move_uploaded_file($ruta_provisional, $src);
						    	}
						    }
								


					 //INDUMENTARIA
						 $ruta_indumentaria1="../public/files/proveedores/indumentaria/".$id_proveedor."/";
						 $ruta_indumentaria11="public/files/proveedores/indumentaria/".$id_proveedor."/";
						 $sqli = "UPDATE cmx_detalle_conductor 
						 		SET foto_indumentaria='$ruta_indumentaria11',
						 			name_cindu='$name_indu'
						  		WHERE id_proveedor= ".$id_proveedor."   ";
					 	$consulta_ind_conductor = $conexion->prepare($sqli);
					 	$consulta_ind_conductor->execute();	
					 	if (!file_exists($ruta_indumentaria1)) {
						        mkdir($ruta_indumentaria1, 0777, true);
						    }
						    //indumentaria
						    for ($n=0;$n<count($_FILES);$n++){
						    	if(isset($_FILES["foto_indume".$n])){
							        $file = $_FILES["foto_indume".$n];
							        $nombre = $file["name"];
							        $tipo = $file["type"];
							        $ruta_provisional = $file["tmp_name"];
							        $carpeta=$ruta_indumentaria1;
							        $src=$carpeta.$nombre;
							        move_uploaded_file($ruta_provisional, $src);
							    }
						    }

						//CURSO MERCANCIAS PELIGROSAS
						  $ruta_mercancias1="../public/files/proveedores/curso/".$id_proveedor."/";
						  $ruta_mercancias11= "public/files/proveedores/curso/".$id_proveedor."/";
						  $sqlm= "UPDATE cmx_detalle_conductor 
						  		SET  carnet_curso= '$ruta_mercancias11',
						  		n_docu_curso='$namedocu_curso' 
						  		WHERE id_proveedor=".$id_proveedor."";
						  $consulta_mer_conductor = $conexion->prepare($sqlm);
						  $consulta_mer_conductor->execute();
						   if (!file_exists($ruta_mercancias1)) {
						        mkdir($ruta_mercancias1, 0777, true);
						  }
						   //mercancias
						for ($e=0;$e<count($_FILES);$e++){
							if(isset($_FILES["docu_curso".$e])){
						        $file = $_FILES["docu_curso".$e];
						        $nombre = $file["name"];
						        $tipo = $file["type"];
						        $ruta_provisional = $file["tmp_name"];
						        $carpeta=$ruta_mercancias1;
						        $src=$carpeta.$nombre;
						        move_uploaded_file($ruta_provisional, $src);
							  	}
						}

							//RUT
						 $ruta_rut1="../public/files/proveedores/rut/".$id_proveedor."/";
						  $ruta_rut11= "public/files/proveedores/rut/".$id_proveedor."/";
						  $sqlrut= "UPDATE cmx_detalle_conductor 
						  			SET  documento_rut= '$ruta_rut11',
						  			n_docu_rut='$name_docurut'
						  			WHERE id_proveedor=".$id_proveedor."";
						  $consulta_rut_conductor = $conexion->prepare($sqlrut);
						  $consulta_rut_conductor->execute();
						   if (!file_exists($ruta_rut1)) {
						        mkdir($ruta_rut1, 0777, true);
						  }
						   //rut
						for ($s=0;$s<count($_FILES);$s++){
							if(isset($_FILES["rut".$s])){
						        $file = $_FILES["rut".$s];
						        $nombre = $file["name"];
						        $tipo = $file["type"];
						        $ruta_provisional = $file["tmp_name"];
						        $carpeta=$ruta_rut1;
						        $src=$carpeta.$nombre;
						        move_uploaded_file($ruta_provisional, $src);
							  	}
						}


						//ACUERDOS
						 $ruta_ac1="../public/files/proveedores/acuerdo/".$id_proveedor."/AC1/";
						  $ruta_ac11= "public/files/proveedores/acuerdo/".$id_proveedor."/AC1/";
						  $sqlau="UPDATE cmx_detalle_conductor 
						    	SET foto_acuerdo1='$ruta_ac11',
						    		name_acuerdo1='$name_a1'
						    		WHERE id_proveedor= ".$id_proveedor."";
						    $consulta_foto_ac = $conexion->prepare($sqlau);
						    $consulta_foto_ac->execute();
						     if (!file_exists($ruta_ac1)) {
						        mkdir($ruta_ac1, 0777, true);
						    }  

						    for ($s=0;$s<count($_FILES);$s++){
						    	if(isset($_FILES["acuerdo_uno".$s])){	
								    $file = $_FILES["acuerdo_uno".$s];
								    $nombre = $file["name"];
								    $tipo = $file["type"];
								    $ruta_provisional = $file["tmp_name"];
								    $carpeta=$ruta_ac1;
								    $src=$carpeta.$nombre;
								    move_uploaded_file($ruta_provisional, $src);
						    	}
						    }
			        $sql =" INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ($id_proveedor,'Conductor')";
			        $crear_solicitud = $conexion->prepare($sql);
			        $result=$crear_solicitud->execute();
			    } 
			   
			    if ($poseedor_vehiculo == "true" ){
			        $sql      = " INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ($id_proveedor,'Poseedor Vehiculo')";
			        $crear_solicitud = $conexion->prepare($sql);
			        $result=$crear_solicitud->execute();
			    } 
			    if ($propietario_vehiculo == "true" ){
			        $sql      = " INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ($id_proveedor,'Propietario Vehiculo')";
			        $crear_solicitud = $conexion->prepare($sql);
			        $result=$crear_solicitud->execute();
			    } 
			    if ($Proveedor == "true" ){

			    	$una=$_POST["una"];
			    	if(isset($_POST["verifica"])){
			    		$verifica=$_POST["verifica"];
			    	}
			    	 //if($una==1 && $verifica==){
			    			$detalle_uno='';
							$detalle_dos='';
					    	
					    	if($_POST["nacional"]==true || 
					    		$_POST["internacional"]==true ){
					    		if($_POST["nacional"]==true){
									$tipo_proveedor=1;
								}
								if($_POST["internacional"]==true){
									$tipo_proveedor=2;
								}
					    	}

							if(isset($_POST["pv_localizacion"])){
								$localizacion=$_POST["pv_localizacion"];
							}

							if(isset($_POST["pv_zona"])){
								$zona=$_POST["pv_zona"];
							}

							if(isset($_POST["pv_tiposervice"])){
								$tiposervicio=$_POST["pv_tiposervice"];
							}

					    	if($tiposervicio=='Transporte'){
					    		if(isset($_POST["pv_via"])){
									$detalle_uno=$_POST["pv_via"];
								}
								if(isset($_POST["pv_select"])){
									$detalle_dos=$_POST["pv_select"];
								}
					    	}

					    	if($tiposervicio=='Porteadores'){
					    		if(isset($_POST["detalle_porteador"])){
									$detalle_uno=$_POST["detalle_porteador"];
									$detalle_dos='';
								}
					    	}

					    	if($tiposervicio=='Agenciamiento de carga'){
					    		if(isset($_POST["detalle_acarga"])){
									$detalle_uno=$_POST["detalle_acarga"];
									$detalle_dos='';
								}
					    	}

					    	if($tiposervicio=='Tramites administrativos'){
					    		if(isset($_POST["tramite_ad"])){
									$detalle_uno=$_POST["tramite_ad"];
									$detalle_dos='';
								}
					    	}

					    	if($tiposervicio=='Adecuaciones' || $tiposervicio=='Aduana' || 
					    	$tiposervicio=='Impuestos' ||$tiposervicio=='Tramites operativos'){
					    		$detalle_uno='';
					    		$detalle_dos='';
					    	}
					    	
					    	$sql="INSERT INTO cmx_proveedores_detalle
					    	(id,id_proveedor,cod_tipo_proveedor,cod_pais,descripcion_zona,tipo_servicio,tipo_servicio_detalle1,tipo_servicio_detalle2,hora,fecha,usuario)
					    	VALUES(null,".$id_proveedor.",".$tipo_proveedor.",'".$localizacion."','".$zona."','".$tiposervicio."','".$detalle_uno."','".$detalle_dos."','".$hora_actual."','".$fecha_actual."','".$user."')";
					    	$crear_datoprovee = $conexion->prepare($sql);
					        $result=$crear_datoprovee->execute();

					        $sql=" INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ($id_proveedor,'Proveedor')";
					        $crear_solicitud = $conexion->prepare($sql);
					        $result=$crear_solicitud->execute();
			        //}
			        
			       /*	if($verifica==2){
			       		//contactos
			        	$nombre=$_POST["nombre"]; // ok
			        	$cargo=$_POST["cargo"];
			        	$fijo=$_POST["fijo"];
			        	$celular=$_POST["celular"]; //ok
			        	$correo=$_POST["correo"];
			        	$critica=$_POST["critica"];
			        	$refe=$_POST["refe"];

			        	$sql="INSERT INTO cmx_proveedor_contactos(id,id_proveedor,nombres_apellidos,cargo,telefono,celular,correo,inf_critica,referencias,hora,fecha,usuario)
			        	VALUES(null,".$id_proveedor.",'".$nombre."','".$cargo."','".$fijo."','".$celular."','".$correo."','".$critica."','".$refe."')";
			        	 $crear_contactos = $conexion->prepare($sql);
			       		 $result=$crear_contactos->execute();
			       	} */
			    } 

			    $sql_m="SELECT * FROM cmx_modulos
			    		 WHERE estado='Activo'";
			    	$crear_solicitud = $conexion->prepare($sql_m);
			        $result=$crear_solicitud->execute();

			    $return["success"] = true;
			}
			$return["error"] = $_msg_error;
			return $return;
	    }


	    public function crearContactos(){

	    	$_flag_proceso = true;
			$_msg_error = "";
			$model    = new Conexion;
			$conexion = $model->conectar();

			$verifica=$_POST["verifica"];

			if($verifica==2){
				$sql = "SELECT max(id) as 'id' FROM cmx_proveedores";
			    $consulta_solic_vehic = $conexion->prepare($sql);
			    $consulta_solic_vehic->execute();
			    $datos_proveedor = $consulta_solic_vehic->fetch();
			    $id_proveedor = $datos_proveedor["id"];
			    $fecha_actual=date('Y-m-d');
				$hora_actual=date('H:i:s');
				$user=$_SESSION["usuario"]["nom_usuario"];

			       		//contactos
			        	if(isset($_POST["nombre"])){
			        		$nombre=$_POST["nombre"]; 
			        	}else{
			        		$nombre=''; 
			        	}
			        	if(isset($_POST["cargo"])){
			        		$cargo=$_POST["cargo"];
			        	}else{
			        		$cargo='';
			        	}
			        	if(isset($_POST["fijo"])){
			        		$fijo=$_POST["fijo"];
			        	}else{
			        		$fijo='';
			        	}
			        	if(isset($_POST["celular"])){
			        		$celular=$_POST["celular"];
			        	}else{
			        		$celular='';
			        	}
			        	if(isset($_POST["correo"])){
							$correo=$_POST["correo"];
			        	}else{
							$correo='';
			        	}
			        	if(isset($_POST["critica"])){
			        		$critica=$_POST["critica"];
			        	}else{
			        		$critica='';
			        	}
			        	if(isset($_POST["refe"])){
			        		$refe=$_POST["refe"];
			        	}else{
			        		$refe='';
			        	}
			        	
			        	$sql="INSERT INTO cmx_proveedor_contactos(id,id_proveedor,nombres_apellidos,cargo,telefono,celular,correo,inf_critica,referencias,hora,fecha,usuario)
			        	VALUES(null,".$id_proveedor.",'".$nombre."','".$cargo."','".$fijo."','".$celular."','".$correo."','".$critica."','".$refe."','".$hora_actual."','".$fecha_actual."','".$user."')";
			        	//echo $sql;
			        	 $crear_contactos = $conexion->prepare($sql);
			       		 $result=$crear_contactos->execute();
			       		 if($result){
			       		 	 $return["success"] = true;
			       		 }else{
			       		 	 $return["success"] = false;
			       		 }
			  }	 

			$return["error"] = $_msg_error;
			return $return;
	    }

	    public function crearContactos2(){

	    	$_flag_proceso = true;
			$_msg_error = "";
			$model    = new Conexion;
			$conexion = $model->conectar();

			$verifica=$_POST["verifica"];

			if($verifica==2){
				
			    $id_proveedor = $_POST["id_proveedor"];
			    $fecha_actual=date('Y-m-d');
				$hora_actual=date('H:i:s');
				$user=$_SESSION["usuario"]["nom_usuario"];

			       		//contactos
			        	if(isset($_POST["nombre"])){
			        		$nombre=$_POST["nombre"]; 
			        	}else{
			        		$nombre=''; 
			        	}
			        	if(isset($_POST["cargo"])){
			        		$cargo=$_POST["cargo"];
			        	}else{
			        		$cargo='';
			        	}
			        	if(isset($_POST["fijo"])){
			        		$fijo=$_POST["fijo"];
			        	}else{
			        		$fijo='';
			        	}
			        	if(isset($_POST["celular"])){
			        		$celular=$_POST["celular"];
			        	}else{
			        		$celular='';
			        	}
			        	if(isset($_POST["correo"])){
							$correo=$_POST["correo"];
			        	}else{
							$correo='';
			        	}
			        	if(isset($_POST["critica"])){
			        		$critica=$_POST["critica"];
			        	}else{
			        		$critica='';
			        	}
			        	if(isset($_POST["refe"])){
			        		$refe=$_POST["refe"];
			        	}else{
			        		$refe='';
			        	}


			        	if($nombre!=''){
				        	$sql="INSERT INTO cmx_proveedor_contactos(id,id_proveedor,nombres_apellidos,cargo,telefono,celular,correo,inf_critica,referencias,hora,fecha,usuario)
				        	VALUES(null,".$id_proveedor.",'".$nombre."','".$cargo."','".$fijo."','".$celular."','".$correo."','".$critica."','".$refe."','".$hora_actual."','".$fecha_actual."','".$user."')";
				        	//echo $sql;
				        	 $crear_contactos = $conexion->prepare($sql);
				       		 $result=$crear_contactos->execute();
				       		 if($result){
				       		 	 $return["success"] = true;
				       		 }else{
				       		 	 $return["success"] = false;
				       		 }
			        	}else{
			        		 $return["success"] = true;
			        	} 	
			  }	 

			$return["error"] = $_msg_error;
			return $return;
	    }



	    public function CrearTipoProveedor(){
	    	$_flag_proceso = true;
			$_msg_error = "";
			$model    = new Conexion;
			$conexion = $model->conectar();

			$Conductor=$_POST["v_Conductor"];
			$tenedor=$_POST["v_poseedor_vehiculo"];
			$propietario=$_POST["v_propietario_vehiculo"];
			$proveedor=$_POST["v_Proveedor"];
			$id_proveedor=$_POST["id_proveedor"];
			$fecha_actual=date('Y-m-d');
			$hora_actual=date('H:i:s');
			$user=$_SESSION["usuario"]["nom_usuario"];

			if($Conductor == "true" ) {

				$categoria_licencia=$_POST["categoria_licencia"];
				$e_num_licencia=$_POST["e_num_licencia"];
				$e_vence_licencia=$_POST["e_vence_licencia"];


				$e_referencias_empresariales1=$_POST["e_referencias_empresariales1"];
				$e_fecha_referencia1=$_POST["e_fecha_referencia1"];
				$e_fecha_retiro1=$_POST["e_fecha_retiro1"];
				$e_contacto_ref1=$_POST["e_contacto_ref1"];
				$e_celular_ref1=$_POST["e_celular_ref1"];
				$e_cargo_ref1=$_POST["e_cargo_ref1"];
				$e_anti_ref1=$_POST["e_anti_ref1"];

				$e_referencias_empresariales2=$_POST["e_referencias_empresariales2"];
				$e_fecha_referencia2=$_POST["e_fecha_referencia2"];
				$e_fecha_retiro2=$_POST["e_fecha_retiro2"];
				$e_contacto_ref2=$_POST["e_contacto_ref2"];
				$e_celular_ref2=$_POST["e_celular_ref2"];
				$e_cargo_ref2=$_POST["e_cargo_ref2"];
				$e_anti_ref2=$_POST["e_anti_ref2"];

				$e_referencias_empresariales3=$_POST["e_referencias_empresariales3"];
				$e_fecha_referencia3=$_POST["e_fecha_referencia3"];
				$e_fecha_retiro3=$_POST["e_fecha_retiro3"];
				$e_contacto_ref3=$_POST["e_contacto_ref3"];
				$e_celular_ref3=$_POST["e_celular_ref3"];
				$e_cargo_ref3=$_POST["e_cargo_ref3"];
				$e_anti_ref3=$_POST["e_anti_ref3"];


				$e_referencias_personales1=$_POST["e_referencias_personales1"];
				$e_fecha_personal1=$_POST["e_fecha_personal1"];
				$parenp1=$_POST["parenp1"];
				$e_telefonop1=$_POST["e_telefonop1"];

				$e_referencias_personales2=$_POST["e_referencias_personales2"];
				$e_fecha_personal2=$_POST["e_fecha_personal2"];
				$parenp2=$_POST["parenp2"];
				$e_telefonop2=$_POST["e_telefonop2"];


				$e_name_eps=$_POST["e_name_eps"];
				$e_vence_eps=$_POST["e_vence_eps"];
				$e_nom_enti=$_POST["e_nom_enti"];
				$e_vence_curso=$_POST["e_vence_curso"];
				$sexo=$_POST["sexo"];
				$e_fecha_nacimiento=$_POST["e_fecha_nacimiento"];
				$sangre=$_POST["sangre"];
				$e_ingreso=$_POST["e_ingreso"];


				$sql="INSERT INTO cmx_detalle_conductor
					(id,
			    	nombre_eps,
			    	fecha_vence_eps,
			    	nombre_entidad,
			    	vence_curso,
			    	sexo,
			    	fecha_nacimiento,
			    	grupo_sanguineo,
			    	fecha_ingreso,
			    	id_proveedor)
					VALUES(null,'$e_name_eps','$e_vence_eps','$e_nom_enti','$e_vence_curso','$sexo','$e_fecha_nacimiento','$sangre',
					'$e_ingreso','$id_proveedor')";
				 $crear_tp = $conexion->prepare($sql);
			     $result=$crear_tp->execute();	

			     //referencias laborales
			     $sqla="INSERT INTO cmx_referencias_preestudio
			     	(id,nombre_empresa,fecha_ingreso,fecha_retiro,persona_contacto,celular,cargo,id_conductor,antiguedad,fecha,hora,usuario,estado)VALUES(null,'$e_referencias_empresariales1','$e_fecha_referencia1','$e_fecha_retiro1',
			     	'$e_contacto_ref1','$e_celular_ref1','$e_cargo_ref1','$id_proveedor','$e_anti_ref1','$fecha_actual','$hora_actual','$user','1')";
			    $crear_r1 = $conexion->prepare($sqla);
			    $result=$crear_r1->execute(); 	

			      $sqlb="INSERT INTO cmx_referencias_preestudio
			     	(id,nombre_empresa,fecha_ingreso,fecha_retiro,persona_contacto,celular,cargo,id_conductor,antiguedad,fecha,hora,usuario,estado)VALUES(null,'$e_referencias_empresariales2','$e_fecha_referencia2','$e_contacto_ref2','$e_celular_ref2','$e_cargo_ref2','$id_proveedor','$e_anti_ref2','$fecha_actual','$hora_actual','$user','1')";
			    $crear_r2 = $conexion->prepare($sqlb);
			    $result=$crear_r2->execute();

			      $sqlc="INSERT INTO cmx_referencias_preestudio
			     	(id,nombre_empresa,fecha_ingreso,fecha_retiro,persona_contacto,celular,cargo,id_conductor,antiguedad,fecha,hora,usuario,estado)VALUES(null,'$e_referencias_empresariales3','$e_fecha_referencia3','$e_fecha_retiro3','$e_contacto_ref3','$e_celular_ref3','$e_cargo_ref3','$id_proveedor','$e_anti_ref3','$fecha_actual','$hora_actual','$user','1')";		
			    $crear_r3 = $conexion->prepare($sqlc);
			    $result=$crear_r3->execute();	

			    //referencias personales

			    $sqld="INSERT INTO cmx_referencias_personales
			    		(id,nombre_personal,fecha_personal,parentezco,tel_personal,id_conductor,usuario,fecha,hora,estado)
			    		VALUES(null,'$e_referencias_personales1','$e_fecha_personal1','$parenp1','$e_telefonop1','$id_proveedor','$user','$fecha_actual','$hora_actual','1')";

			    $crear_r4 = $conexion->prepare($sqld);
			    $result=$crear_r4->execute();	


			    $sqle="INSERT INTO cmx_referencias_personales
			    		(id,nombre_personal,fecha_personal,parentezco,tel_personal,id_conductor,usuario,fecha,hora,estado)
			    		VALUES(null,'$e_referencias_personales2','$e_fecha_personal2','$parenp2','$e_telefonop2','$id_proveedor','$user','$fecha_actual','$hora_actual','1')";		
			    $crear_r5 = $conexion->prepare($sqle);
			    $result=$crear_r5->execute();


			    $sqlf="INSERT INTO cmx_estado_bloqueo
			    	(id,nombre_proceso,estado_proceso,id_objeto,tipo_objeto,fecha,hora,usuario)
			    	VALUES(null,'modificar','desbloqueado','$id_proveedor','proveedor','$fecha_actual','$hora_actual','$user')";
			    $crear_r6 = $conexion->prepare($sqlf);
			    $result=$crear_r6->execute();	

			    $sqlg="INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ($id_proveedor,'Conductor')";
			    $crear_solicitud = $conexion->prepare($sqlg);
			    $result=$crear_solicitud->execute();


			    $return["success"] = true;
			    $return["error"] = $_msg_error;
				return $return;   		
			}

			if($Conductor == "false"){	
               	$sql2="DELETE FROM cmx_referencias_preestudio
               		WHERE id_conductor=$id_proveedor";
               	$delete2 = $conexion->prepare($sql2);
			    $result2=$delete2->execute();	
			    if($result2){
			    	$sql3="DELETE FROM cmx_referencias_personales
		               		WHERE id_conductor=$id_proveedor";
		            $delete3 = $conexion->prepare($sql3);
					$result3=$delete3->execute();
					if($result3){
						$sql4="DELETE FROM cmx_estado_bloqueo
               				WHERE id_objeto=$id_proveedor";
			            $delete4 = $conexion->prepare($sql4);
						$result4=$delete4->execute();
						if($result4){
							$sql5="DELETE FROM cmx_actividad_proveedor
			               		WHERE actividad='Conductor' 
			               		AND id_proveedor=$id_proveedor";
			               	$delete5 = $conexion->prepare($sql5);
						    $result5=$delete5->execute();
						    if($result5){
						    	$sql="DELETE FROM cmx_detalle_conductor
				               		WHERE id_proveedor=$id_proveedor";
				               	$delete = $conexion->prepare($sql);
							    $result=$delete->execute();	
							    if($result){
							    	$return["success"] = true;
							    	$return["error"] = $_msg_error;
									return $return;   
							    }	
						    }else{
						    	$return["success"] = false;
								$return["error"] = $_msg_error;
								return $return;   
						    }	
						}else{
							$return["success"] = false;
							$return["error"] = $_msg_error;
							return $return;   
						}	
					}else{
						$return["success"] = false;
						$return["error"] = $_msg_error;
						return $return;   
					}
			    }else{
			    	$return["success"] = false;
					$return["error"] = $_msg_error;
					return $return;   
			    }	
			}


			if($propietario =="true"){
				$sqlg="INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ($id_proveedor,'Propietario Vehiculo')";
			    $crear_solicitud = $conexion->prepare($sqlg);
			    $result=$crear_solicitud->execute();
			    if($result){
			     	$return["success"] = true;
			    }else{
			    	$return["success"] = false;
			    }
			    $return["error"] = $_msg_error;
				return $return; 
			}

			if($propietario =="false"){
				$sql="DELETE FROM cmx_actividad_proveedor
			            WHERE actividad='Propietario Vehiculo' 
			            AND id_proveedor=$id_proveedor";
				$delete_pro = $conexion->prepare($sql);
			    $result=$delete_pro->execute();
			     if($result){
			     	$return["success"] = true;
			    }else{
			    	$return["success"] = false;
			    }
			    $return["error"] = $_msg_error;
				return $return; 
			}

			if($tenedor=="true"){
				$sqlt="INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ($id_proveedor,'Poseedor Vehiculo')";
			    $crear_solicitud = $conexion->prepare($sqlt);
			    $result=$crear_solicitud->execute();
			    if($result){
			     	$return["success"] = true;
			    }else{
			    	$return["success"] = false;
			    }
			    $return["error"] = $_msg_error;
				return $return; 
			}

			if($tenedor=="false"){
				$sql="DELETE FROM cmx_actividad_proveedor
			            WHERE actividad='Poseedor Vehiculo' 
			            AND id_proveedor=$id_proveedor";
				$delete_pro = $conexion->prepare($sql);
			    $result=$delete_pro->execute();
			     if($result){
			     	$return["success"] = true;
			    }else{
			    	$return["success"] = false;
			    }
			    $return["error"] = $_msg_error;
				return $return;
			}

			if($proveedor=="true"){

				$detalle_uno='';
				$detalle_dos='';

				if($_POST["nacional"]==true || 
					$_POST["internacional"]==true ){
					if($_POST["nacional"]==true){
						$tipo_proveedor=1;
					}
					if($_POST["internacional"]==true){
						$tipo_proveedor=2;
					}
				}

				if(isset($_POST["pv_localizacion"])){
					$localizacion=$_POST["pv_localizacion"];
				}

				if(isset($_POST["pv_zona"])){
					$zona=$_POST["pv_zona"];
				}

				if(isset($_POST["pv_tiposervice"])){
					$tiposervicio=$_POST["pv_tiposervice"];
				}

				if($tiposervicio=='Transporte'){
					if(isset($_POST["pv_via"])){
						$detalle_uno=$_POST["pv_via"];
					}
					if(isset($_POST["pv_select"])){
						$detalle_dos=$_POST["pv_select"];
					}
				}

				if($tiposervicio=='Porteadores'){
					if(isset($_POST["detalle_porteador"])){
						$detalle_uno=$_POST["detalle_porteador"];
						$detalle_dos='';
					}
				}

				if($tiposervicio=='Agenciamiento de carga'){
					if(isset($_POST["detalle_acarga"])){
						$detalle_uno=$_POST["detalle_acarga"];
						$detalle_dos='';
					}
				}

				if($tiposervicio=='Tramites administrativos'){
					if(isset($_POST["tramite_ad"])){
						$detalle_uno=$_POST["tramite_ad"];
						$detalle_dos='';
					}
				}

				if($tiposervicio=='Adecuaciones' || $tiposervicio=='Aduana' || 
					$tiposervicio=='Impuestos' ||$tiposervicio=='Tramites operativos'){
					$detalle_uno='';
					$detalle_dos='';
				}

				$sql="INSERT INTO cmx_proveedores_detalle
					(id,id_proveedor,cod_tipo_proveedor,cod_pais,descripcion_zona,tipo_servicio,tipo_servicio_detalle1,tipo_servicio_detalle2,hora,fecha,usuario)
					VALUES(null,".$id_proveedor.",".$tipo_proveedor.",'".$localizacion."','".$zona."','".$tiposervicio."','".$detalle_uno."','".$detalle_dos."','".$hora_actual."','".$fecha_actual."','".$user."')";
				$crear_datoprovee = $conexion->prepare($sql);
				$result=$crear_datoprovee->execute();

				if($result){
					$sql=" INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ($id_proveedor,'Proveedor')";
					$crear_solicitud = $conexion->prepare($sql);
					$result2=$crear_solicitud->execute();
					if($result2){
						$return["success"] = true;
						$return["error"] = $_msg_error;
						return $return;
					}
				}else{
					$return["success"] = false;
					$return["error"] = $_msg_error;
					return $return;
				}
			}

			if($proveedor=="false"){
				$sql="DELETE FROM cmx_proveedores_detalle
			            WHERE id_proveedor=$id_proveedor";
				$delete_prov = $conexion->prepare($sql);
			    $result=$delete_prov->execute();
			    if($result){
			     	$sql2="DELETE FROM cmx_proveedor_contactos
			            WHERE id_proveedor=$id_proveedor";
			        $delete_prov2 = $conexion->prepare($sql2);
			    	$result2=$delete_prov2->execute(); 
			    	if($result2){
			    		$sql3="DELETE FROM cmx_actividad_proveedor
			            WHERE actividad='Proveedor' 
			            AND id_proveedor=$id_proveedor";
						$delete_apro = $conexion->prepare($sql3);
					    $result3=$delete_apro->execute();
					    if($result3){
					    	$return["success"] = true;
					    }else{
					    	$return["success"] = false;
					    }
			    	}else{
			    		$return["success"] = false;
			    	}
				}else{
					$return["success"] = false;
				}	
			    $return["error"] = $_msg_error;
				return $return;
			}

			if($Conductor=='' && $propietario=='' 
				&& $tenedor=='' && $proveedor==''){
				$return["success"] = true;
				$return["error"] = $_msg_error;
				return $return;
			}

	    }

	    public function crearContactostp(){

	    	$_flag_proceso = true;
			$_msg_error = "";
			$model    = new Conexion;
			$conexion = $model->conectar();

			$verifica=$_POST["verifica"];

			if($verifica==2){

			    $id_proveedor = $_POST["id_proveedor"];
			    $fecha_actual=date('Y-m-d');
				$hora_actual=date('H:i:s');
				$user=$_SESSION["usuario"]["nom_usuario"];

			       		//contactos
			        	if(isset($_POST["nombre"])){
			        		$nombre=$_POST["nombre"]; 
			        	}else{
			        		$nombre=''; 
			        	}
			        	if(isset($_POST["cargo"])){
			        		$cargo=$_POST["cargo"];
			        	}else{
			        		$cargo='';
			        	}
			        	if(isset($_POST["fijo"])){
			        		$fijo=$_POST["fijo"];
			        	}else{
			        		$fijo='';
			        	}
			        	if(isset($_POST["celular"])){
			        		$celular=$_POST["celular"];
			        	}else{
			        		$celular='';
			        	}
			        	if(isset($_POST["correo"])){
							$correo=$_POST["correo"];
			        	}else{
							$correo='';
			        	}
			        	if(isset($_POST["critica"])){
			        		$critica=$_POST["critica"];
			        	}else{
			        		$critica='';
			        	}
			        	if(isset($_POST["refe"])){
			        		$refe=$_POST["refe"];
			        	}else{
			        		$refe='';
			        	}
			        	
			        	$sql="INSERT INTO cmx_proveedor_contactos(id,id_proveedor,nombres_apellidos,cargo,telefono,celular,correo,inf_critica,referencias,hora,fecha,usuario)
			        	VALUES(null,".$id_proveedor.",'".$nombre."','".$cargo."','".$fijo."','".$celular."','".$correo."','".$critica."','".$refe."','".$hora_actual."','".$fecha_actual."','".$user."')";
			        	//echo $sql;
			        	 $crear_contactos = $conexion->prepare($sql);
			       		 $result=$crear_contactos->execute();
			       		 if($result){
			       		 	 $return["success"] = true;
			       		 }else{
			       		 	 $return["success"] = false;
			       		 }
			       }	 

			$return["error"] = $_msg_error;
			return $return;
	    }


		
	    public function verProveedor(){
	    	//ECHO 'ENTRO A VERPROVEEDOR';
	        $id_proveedor= $_POST["id_proveedor"];
	        $id_usuario = $_SESSION["usuario"]["id_usuario"];
	       
	        $sql = "SELECT cp.*,cm.municipio, cm.rndc_codigo_ciudad FROM cmx_proveedores cp,cmx_municipios cm
	                WHERE cp.id= $id_proveedor
	                AND cm.id = cp.id_municipio
	                LIMIT 1 ";
			// $sql= "
			//SELECT cp.*, cm.municipio, cm.rndc_codigo_ciudad,p.actividad
						// FROM cmx_municipios cm 
						// INNER JOIN cmx_proveedores	cp 
						// INNER JOIN cmx_actividad_proveedor p
						// ON cm.id=cp.id_municipio AND cp.id=p.id_proveedor
						// WHERE cp.id=$id_proveedor ";
						  // echo $sql;

	       	$sql= "
	         	SELECT cp.*, cm.municipio, cm.rndc_codigo_ciudad , dc.*
				 FROM cmx_municipios cm INNER JOIN 
				 cmx_proveedores	cp 
				 LEFT JOIN
				 cmx_detalle_conductor dc
				 ON cm.id=cp.id_municipio AND cp.id=dc.id_proveedor
				 WHERE cp.id=$id_proveedor 
				 and dc.id_proveedor=$id_proveedor
	        ";
	        $model    = new Conexion;
	        $conexion = $model->conectar();
	        $consulta = $conexion->prepare($sql);
	        $consulta->execute();

	        
	        $total         = $consulta->rowCount();
	        if ($total == 0) {
	            $return["success"]= false;
	        } else {
	            $return["success"]= true;
	            $datos_asig= $consulta->fetch();
	            $sql      = " INSERT INTO cmx_log_proveedores (id_usuario,id_proveedor,operacion,fecha_hora_operacion) VALUES ($id_usuario,$id_proveedor,'Ver',NOW())";
	            $crear_log_proveedor = $conexion->prepare($sql);
	            $crear_log_proveedor->execute();
				$return["content"]= $datos_asig;
				// documento soporte
	            // $return["archivos"]="<label>Archivos subidos</label><br>";
	            // $ficheros1  = scandir("../".$return["content"]["documentos_soporte"]);
	            // if ( $return["content"]["documentos_soporte"] ) {
	            //     for($x=2;$x<count($ficheros1);$x++){
	            //         $return["archivos"].="<a href='".BASE_URL.$return["content"]["documentos_soporte"].$ficheros1[$x]."' target='_blank' >$ficheros1[$x]</a> <br>";
	            //     }
	            // }
	            // //fotos conductor
	            // $return["fotosc"]="<label>Archivos subidos</label><br>";
	            // $ficheros10  = scandir("../".$return["content"]["foto_conductor"]);
	            // if ( $return["content"]["foto_conductor"] ) {
	            //     for($x=2;$x<count($ficheros10);$x++){
	            //         $return["fotosc"].="<a href='".BASE_URL.$return["content"]["foto_conductor"].$ficheros10[$x]."' target='_blank' >$ficheros10[$x]</a> <br>";
	            //     }
	            // }
	            // //fotos de la indumentaria
	            // $return["fotosi"]="<label>Archivos subidos</label><br>";
	            // $ficheros11  = scandir("../".$return["content"]["foto_indumentaria"]);
	            // if ( $return["content"]["foto_indumentaria"] ) {
	            //     for($x=2;$x<count($ficheros11);$x++){
	            //         $return["fotosi"].="<a href='".BASE_URL.$return["content"]["foto_indumentaria"].$ficheros11[$x]."' target='_blank' >$ficheros11[$x]</a> <br>";
	            //     }
	            // }

	            // //licencia
	            // $return["licen"]="<label>Archivos subidos</label><br>";
	            // $fichero2 = scandir("../".$return["content"]["subir_licencia"]);
	            // if($return["content"]["subir_licencia"]){
	            // 	 for($x=2;$x<count($fichero2);$x++){
	            //         $return["licen"].="<a href='".BASE_URL.$return["content"]["subir_licencia"].$fichero2[$x]."' target='_blank' >$fichero2[$x]</a> <br>";
	            //     }
	            // }
	            // //archivos referencia laboral uno
	            // $return["labuno"]="<label>Archivos subidos</label><br>";
	            // $fichero3 = scandir("../".$return["content"]["documento_empresarial1"]);
	            // if($return["content"]["documento_empresarial1"]){
	            // 	for ($i=2; $i<count($fichero3); $i++) { 
	            // 		$return["labuno"].="<a href='".BASE_URL.$return["content"]["documento_empresarial1"].$fichero3[$i]."' target='_blank' >$fichero3[$i]</a> <br>";
	            // 	}
	            // }

	            // //archivos referencia laboral dos
	            // $return["labdos"]="<label>Archivos subidos</label><br>";
	            // $fichero4 = scandir("../".$return["content"]["documento_empresarial2"]);
	            // if($return["content"]["documento_empresarial2"]){
	            // 	for ($i=2; $i<count($fichero4); $i++) { 
	            // 		$return["labdos"].="<a href='".BASE_URL.$return["content"]["documento_empresarial2"].$fichero4[$i]."' target='_blank' >$fichero4[$i]</a> <br>";
	            // 	}
	            // }
	            // //archivos referencia personal uno
	            // $return["peru"]="<label>Archivos subidos</label><br>";
	            // $fichero5 = scandir("../".$return["content"]["documento_personal1"]);
	            // if($return["content"]["documento_personal1"]){
	            // 	for ($i=2; $i<count($fichero5); $i++) { 
	            // 		$return["peru"].="<a href='".BASE_URL.$return["content"]["documento_personal1"].$fichero5[$i]."' target='_blank' >$fichero5[$i]</a> <br>";
	            // 	}
	            // }
	            // //archivos referencia personal dos
	            // $return["perd"]="<label>Archivos subidos</label><br>";
	            // $fichero6 = scandir("../".$return["content"]["documento_personal2"]);
	            // if($return["content"]["documento_personal2"]){
	            // 	for ($i=2; $i<count($fichero6); $i++) { 
	            // 		$return["perd"].="<a href='".BASE_URL.$return["content"]["documento_personal2"].$fichero6[$i]."' target='_blank' >$fichero6[$i]</a> <br>";
	            // 	}
	            // }
	            // //archivos EPS
	            // $return["eps"]="<label>Archivos subidos</label><br>";
	            // $fichero7 = scandir("../".$return["content"]["documento_eps"]);
	            // if($return["content"]["documento_eps"]){
	            // 	for ($i=2; $i<count($fichero7); $i++) { 
	            // 		$return["eps"].="<a href='".BASE_URL.$return["content"]["documento_eps"].$fichero7[$i]."' target='_blank' >$fichero7[$i]</a> <br>";
	            // 	}
	            // }

	            //archivo ARL
		        //     $return["arl"]="<label>Archivos subidos</label><br>";
		        //     $fichero8 = scandir("../".$return["content"]["documento_arl"]);
		        //     if($fichero8){
		        //     	if($return["content"]["documento_arl"]){
		        //     	for ($i=2; $i<count($fichero8); $i++) { 
		        //     		$return["arl"].="<a href='".BASE_URL.$return["content"]["documento_arl"].$fichero8[$i]."' target='_blank' >$fichero8[$i]</a> <br>";
		        //     	}
		        //     }
		        // }else{
		        // 	echo 'no existe el directorio';
		        // }

	        	//archivo curso mercancia peligrosa
	            // $return["curso"]="<label>Archivos subidos</label><br>";
	            // $fichero9 = scandir("../".$return["content"]["carnet_curso"]);
	            // if($return["content"]["carnet_curso"]){
	            // 	for ($i=2; $i<count($fichero9); $i++) { 
	            // 		$return["curso"].="<a href='".BASE_URL.$return["content"]["carnet_curso"].$fichero9[$i]."' target='_blank' >$fichero9[$i]</a> <br>";
	            // 	}
	            // }
	            //archivo del rut
	            // $return["rut"]="<label>Archivos subidos</label><br>";
	            // $fichero10 = scandir("../".$return["content"]["documento_rut"]);
	            // if($return["content"]["documento_rut"]){
	            // 	for ($i=2; $i<count($fichero10); $i++) { 
	            // 		$return["rut"].="<a href='".BASE_URL.$return["content"]["documento_rut"].$fichero10[$i]."' target='_blank' >$fichero10[$i]</a> <br>";
	            // 	}
	            // }
	            $sql = "SELECT * 
	                FROM cmx_actividad_proveedor
	                WHERE id_proveedor = $id_proveedor ";
	            $obteneractividad = $conexion->prepare($sql);
	            $obteneractividad->execute();
	            $datos_actividad=$obteneractividad->fetch();
	            //CONDUCTOR
	           $acti=$datos_actividad['actividad'];
	            if($acti=='Conductor'){
	            	$sql2="SELECT * FROM cmx_detalle_conductor
					 	WHERE id_proveedor=$id_proveedor";
					 $consulta2 = $conexion->prepare($sql2);
					 $consulta2->execute();	
					 $datos_asig2=$consulta2->fetch();
					 //$datos_asig2=$consulta2;
					  $vacio='vacio';

					  

					 // $totalcondu= $datos_asig2->rowCount();
					 if(!$consulta2){
					 	$return["sucess"] =true;
					 	$return["content2"]= $vacio;
					 }else{
					 	$return["content2"]= $datos_asig2;
					 }
					 $return["content2"]= $datos_asig2;	
				}
	    			//        
	            //FIN CONDUCTOR

	            $return["actividades"]= array();
	            while($datos_actividades = $obteneractividad->fetch()){
	                $return["actividades"][]= $datos_actividades;
	            }
	            // Se busca si el registro está en el RNDC
	            if ( $datos_asig["rndc_id"] ) {
					$Data = new Consultas;

					$arrayMinTrans = Array();
					// Solicitud
					$arrayMinTrans["solicitud"] = Array(
						"tipo" => 3,
						"procesoid" => 11,
					);
					// Variable que se envían para la consulta  
					$arrayMinTrans["variables"] = "INGRESOID,FECHAING,NUMNITEMPRESATRANSPORTE,CODTIPOIDTERCERO,NUMIDTERCERO,NOMIDTERCERO,PRIMERAPELLIDOIDTERCERO,SEGUNDOAPELLIDOIDTERCERO,NUMTELEFONOCONTACTO,NUMCELULARPERSONA,NOMENCLATURADIRECCION,CODMUNICIPIORNDC,CODSEDETERCERO,NOMSEDETERCERO,NUMLICENCIACONDUCCION,CODCATEGORIALICENCIACONDUCCION,FECHAVENCIMIENTOLICENCIA,LATITUD,LONGITUD";

					$arrayMinTrans["documento"] = Array(
						"NUMNITEMPRESATRANSPORTE" 	=> MINTRANS_NIT,
						"INGRESOID"					=> "'" . $datos_asig["rndc_id"] . "'"
					);
					$return["rndc_array"] = $arrayMinTrans;

					$result = $Data->getRNDCQueryArray( $arrayMinTrans );
					if ( !isset( $result["ErrorMSG"] ) ) {
						$return["rndc_result"] = $result["documento"];
					}else{
						$return["error"] = $result["ErrorMSG"];
					}
	            }
	        	}  
	        
	       		 return $return;
	    }

	    //ver proveedores para vehiculos
	      public function verProveedorv(){
	    	//ECHO 'ENTRO A VERPROVEEDOR';
	        $id_proveedor= $_POST["id_proveedor"];
	        $id_usuario = $_SESSION["usuario"]["id_usuario"];
	       
	        // $sql = "SELECT cp.*,cm.municipio, cm.rndc_codigo_ciudad FROM cmx_proveedores cp,cmx_municipios cm
	        //         WHERE cp.id= $id_proveedor
	        //         AND cm.id = cp.id_municipio
	        //         LIMIT 1 ";

	        $sql= "
	        	SELECT cp.*, cm.municipio, cm.rndc_codigo_ciudad , dc.*
				FROM cmx_municipios cm INNER JOIN 
				cmx_proveedores	cp LEFT JOIN
				cmx_detalle_conductor dc
				ON cm.id=cp.id_municipio AND cp.id=dc.id_proveedor
				WHERE cp.id=$id_proveedor and dc.id_proveedor=$id_proveedor
	        ";

	        $model    = new Conexion;
	        $conexion = $model->conectar();
	        $consulta = $conexion->prepare($sql);
	        $consulta->execute();
	        
	        $total         = $consulta->rowCount();
	        if ($total == 0) {
	            $return["success"]= false;
	        } else {
	            $return["success"]= true;
	            $datos_asig= $consulta->fetch();
	            $sql      = " INSERT INTO cmx_log_proveedores (id_usuario,id_proveedor,operacion,fecha_hora_operacion) VALUES ($id_usuario,$id_proveedor,'Ver',NOW())";
	            $crear_log_proveedor = $conexion->prepare($sql);
	            $crear_log_proveedor->execute();
				$return["content"]= $datos_asig;
				//documento soporte
	            $return["archivos"]="<label>Archivos subidos</label><br>";
	            $ficheros1  = scandir("../".$return["content"]["documentos_soporte"]);
	            if ( $return["content"]["documentos_soporte"] ) {
	                for($x=2;$x<count($ficheros1);$x++){
	                    $return["archivos"].="<a href='".BASE_URL.$return["content"]["documentos_soporte"].$ficheros1[$x]."' target='_blank' >$ficheros1[$x]</a> <br>";
	                }
	            }
	            //fotos conductor
	            $return["fotosc"]="<label>Archivos subidos</label><br>";
	            $ficheros10  = scandir("../".$return["content"]["foto_conductor"]);
	            if ( $return["content"]["foto_conductor"] ) {
	                for($x=2;$x<count($ficheros10);$x++){
	                    $return["fotosc"].="<a href='".BASE_URL.$return["content"]["foto_conductor"].$ficheros10[$x]."' target='_blank' >$ficheros10[$x]</a> <br>";
	                }
	            }
	            //fotos de la indumentaria
	            $return["fotosi"]="<label>Archivos subidos</label><br>";
	            $ficheros11  = scandir("../".$return["content"]["foto_indumentaria"]);
	            if ( $return["content"]["foto_indumentaria"] ) {
	                for($x=2;$x<count($ficheros11);$x++){
	                    $return["fotosi"].="<a href='".BASE_URL.$return["content"]["foto_indumentaria"].$ficheros11[$x]."' target='_blank' >$ficheros11[$x]</a> <br>";
	                }
	            }

	            //licencia
	            $return["licen"]="<label>Archivos subidos</label><br>";
	            $fichero2 = scandir("../".$return["content"]["subir_licencia"]);
	            if($return["content"]["subir_licencia"]){
	            	 for($x=2;$x<count($fichero2);$x++){
	                    $return["licen"].="<a href='".BASE_URL.$return["content"]["subir_licencia"].$fichero2[$x]."' target='_blank' >$fichero2[$x]</a> <br>";
	                }
	            }
	            //archivos referencia laboral uno
	            $return["labuno"]="<label>Archivos subidos</label><br>";
	            $fichero3 = scandir("../".$return["content"]["documento_empresarial1"]);
	            if($return["content"]["documento_empresarial1"]){
	            	for ($i=2; $i<count($fichero3); $i++) { 
	            		$return["labuno"].="<a href='".BASE_URL.$return["content"]["documento_empresarial1"].$fichero3[$i]."' target='_blank' >$fichero3[$i]</a> <br>";
	            	}
	            }

	            //archivos referencia laboral dos
	            $return["labdos"]="<label>Archivos subidos</label><br>";
	            $fichero4 = scandir("../".$return["content"]["documento_empresarial2"]);
	            if($return["content"]["documento_empresarial2"]){
	            	for ($i=2; $i<count($fichero4); $i++) { 
	            		$return["labdos"].="<a href='".BASE_URL.$return["content"]["documento_empresarial2"].$fichero4[$i]."' target='_blank' >$fichero4[$i]</a> <br>";
	            	}
	            }
	            //archivos referencia personal uno
	            $return["peru"]="<label>Archivos subidos</label><br>";
	            $fichero5 = scandir("../".$return["content"]["documento_personal1"]);
	            if($return["content"]["documento_personal1"]){
	            	for ($i=2; $i<count($fichero5); $i++) { 
	            		$return["peru"].="<a href='".BASE_URL.$return["content"]["documento_personal1"].$fichero5[$i]."' target='_blank' >$fichero5[$i]</a> <br>";
	            	}
	            }
	            //archivos referencia personal dos
	            $return["perd"]="<label>Archivos subidos</label><br>";
	            $fichero6 = scandir("../".$return["content"]["documento_personal2"]);
	            if($return["content"]["documento_personal2"]){
	            	for ($i=2; $i<count($fichero6); $i++) { 
	            		$return["perd"].="<a href='".BASE_URL.$return["content"]["documento_personal2"].$fichero6[$i]."' target='_blank' >$fichero6[$i]</a> <br>";
	            	}
	            }
	            //archivos EPS
	            $return["eps"]="<label>Archivos subidos</label><br>";
	            $fichero7 = scandir("../".$return["content"]["documento_eps"]);
	            if($return["content"]["documento_eps"]){
	            	for ($i=2; $i<count($fichero7); $i++) { 
	            		$return["eps"].="<a href='".BASE_URL.$return["content"]["documento_eps"].$fichero7[$i]."' target='_blank' >$fichero7[$i]</a> <br>";
	            	}
	            }

	            //archivo ARL
	        //     $return["arl"]="<label>Archivos subidos</label><br>";
	        //     $fichero8 = scandir("../".$return["content"]["documento_arl"]);
	        //     if($fichero8){
	        //     	if($return["content"]["documento_arl"]){
	        //     	for ($i=2; $i<count($fichero8); $i++) { 
	        //     		$return["arl"].="<a href='".BASE_URL.$return["content"]["documento_arl"].$fichero8[$i]."' target='_blank' >$fichero8[$i]</a> <br>";
	        //     	}
	        //     }
	        // }else{
	        // 	echo 'no existe el directorio';
	        // }

	        	//archivo curso mercancia peligrosa
	            $return["curso"]="<label>Archivos subidos</label><br>";
	            $fichero9 = scandir("../".$return["content"]["carnet_curso"]);
	            if($return["content"]["carnet_curso"]){
	            	for ($i=2; $i<count($fichero9); $i++) { 
	            		$return["curso"].="<a href='".BASE_URL.$return["content"]["carnet_curso"].$fichero9[$i]."' target='_blank' >$fichero9[$i]</a> <br>";
	            	}
	            }
	            //archivo del rut
	            $return["rut"]="<label>Archivos subidos</label><br>";
	            $fichero10 = scandir("../".$return["content"]["documento_rut"]);
	            if($return["content"]["documento_rut"]){
	            	for ($i=2; $i<count($fichero10); $i++) { 
	            		$return["rut"].="<a href='".BASE_URL.$return["content"]["documento_rut"].$fichero10[$i]."' target='_blank' >$fichero10[$i]</a> <br>";
	            	}
	            }

	            $sql = "SELECT * 
	                FROM cmx_actividad_proveedor
	                WHERE id_proveedor = $id_proveedor ";
	            $obteneractividad = $conexion->prepare($sql);
	            $obteneractividad->execute();
	            $return["actividades"]= array();
	            while($datos_actividades = $obteneractividad->fetch()){
	                $return["actividades"][]= $datos_actividades;
	            }
	            // Se busca si el registro está en el RNDC
	            if ( $datos_asig["rndc_id"] ) {
					$Data = new Consultas;

					$arrayMinTrans = Array();
					// Solicitud
					$arrayMinTrans["solicitud"] = Array(
						"tipo" => 3,
						"procesoid" => 11,
					);
					// Variable que se envían para la consulta  
					$arrayMinTrans["variables"] = "INGRESOID,FECHAING,NUMNITEMPRESATRANSPORTE,CODTIPOIDTERCERO,NUMIDTERCERO,NOMIDTERCERO,PRIMERAPELLIDOIDTERCERO,SEGUNDOAPELLIDOIDTERCERO,NUMTELEFONOCONTACTO,NUMCELULARPERSONA,NOMENCLATURADIRECCION,CODMUNICIPIORNDC,CODSEDETERCERO,NOMSEDETERCERO,NUMLICENCIACONDUCCION,CODCATEGORIALICENCIACONDUCCION,FECHAVENCIMIENTOLICENCIA,LATITUD,LONGITUD";

					$arrayMinTrans["documento"] = Array(
						"NUMNITEMPRESATRANSPORTE" 	=> MINTRANS_NIT,
						"INGRESOID"					=> "'" . $datos_asig["rndc_id"] . "'"
					);
					$return["rndc_array"] = $arrayMinTrans;

					$result = $Data->getRNDCQueryArray( $arrayMinTrans );
					if ( !isset( $result["ErrorMSG"] ) ) {
						$return["rndc_result"] = $result["documento"];
					}else{
						$return["error"] = $result["ErrorMSG"];
					}
	            }
	        }  
	        
	        return $return;
	    }

	    public function verProveedorDoc(){
	        $id_proveedor= $_POST["doc_proveedor"];
	        $id_usuario = $_SESSION["usuario"]["id_usuario"];
	        $sql = "
				SELECT 
					cp.*,cm.municipio 
				FROM 
					cmx_proveedores cp,cmx_municipios cm
				WHERE 
					cp.numero_documento= $id_proveedor
					AND cm.id = cp.id_municipio
			";
	        $model    = new Conexion;
	        $conexion = $model->conectar();
	        $consulta = $conexion->prepare($sql);
	        $consulta->execute();

	        $total         = $consulta->rowCount();
	        if ($total == 0) {
	            $return["success"]= false;
	        } else {
	            $return["success"]= true;
	            $datos_asig= $consulta->fetch();
	            $return["content"]= $datos_asig;
	            $sql = "
	            	SELECT * 
	                FROM cmx_actividad_proveedor
	                WHERE id_proveedor = " . $datos_asig['id'] . " ";
	            $obteneractividad = $conexion->prepare($sql);
	            $obteneractividad->execute();
	            $return["actividades"]= array();
	            while($datos_actividades = $obteneractividad->fetch()){
	                $return["actividades"][]= $datos_actividades;
	            }
	        }
	        return $return;
	    }


	    public function TraerName(){

	    	$model    = new Conexion;
	       	$conexion = $model->conectar();
	    	 $id_proveedor= $_POST["doc_proveedor"];
	    	 $cond= $_POST["cond"];
	    	 $tene= $_POST["tene"];
	    	 $pro= $_POST["propi"];

	    	 if($cond==1){
	    	 	 $sql="SELECT nombre_conductor FROM cmx_vehiculos_preestudio
					WHERE documento_conductor=$id_proveedor  ";
				
				$consulta = $conexion->prepare($sql);
	        	$consulta->execute();
	        	$total   = $consulta->rowCount();
	        	if($total==0){
			    $return["success"]= false;
				}else{
				    $return["success"]= true;
				    $return["nombre"]= array();
				       while($nombres= $consulta->fetch()){
				        $return["nombre"][]=$nombres;
				     }	
				}

	    	 }

	    	 if($tene==1){
	    	 	 $sql="SELECT nombre_tenedor FROM cmx_vehiculos_preestudio
					WHERE documento_tenedor=$id_proveedor  ";
				$consulta = $conexion->prepare($sql);
	        	$consulta->execute();		
	        	$total   = $consulta->rowCount();
	        	if($total==0){
			    $return["success"]= false;
				}else{
				    $return["success"]= true;
				    $return["nombre"]= array();
				       while($nombres= $consulta->fetch()){
				        $return["nombre"][]=$nombres;
				       }	
				}

	    	 }

	    	 if($pro==1){
	    	 	 $sql="SELECT nombre_propietario FROM cmx_vehiculos_preestudio
					WHERE documento_propietario=$id_proveedor  ";
				$consulta = $conexion->prepare($sql);
	        	$consulta->execute();	
	        	$total   = $consulta->rowCount();
	        	if($total==0){
			    $return["success"]= false;
				}else{
					    $return["success"]= true;
					    $return["nombre"]= array();
					       while($nombres= $consulta->fetch()){
					        $return["nombre"][]=$nombres;
					       }	
				}
	    	 }
			return $return;
	    }


	    public function TraerRefeCondu(){
	    	 $id_proveedor= $_POST["doc_proveedor"];

	    	$sql="SELECT 
	    				* 
	    		FROM cmx_referencias_preestudio r
				WHERE r.id_conductor=$id_proveedor  ";
	    	$model    = new Conexion;
	       	$conexion = $model->conectar();
	        $consulta = $conexion->prepare($sql);
	        $consulta->execute();
	        $total   = $consulta->rowCount();

	        if($total==0){//no hay ninguna referencia
	        	 $return["success"]= false;
	        }else{//existe referencia
	        	 $return["success"]= true;
	        	 $return["referencias"]= array();

	        	 while($rlaborales= $consulta->fetch()){
	        	 	 $return["referencias"][]=$rlaborales;
	        	 }
	        }
	      return $return;
	    }



	   
		public function editarProveedornew(){
		    	 // $cont=0;
		    	$Data = new Consultas;
		    	// echo 'ENTRO edite BD proveedor';
		    	//datos con post
		    	$id_usuario = $_SESSION["usuario"]["id_usuario"];
		    	$id_proveedor = $_POST["id_proveedor"];
		    	$abreviatura = $_POST["abreviatura"];
		    	$tipo_docu = $_POST["tipo_docu"];
		    	$nombre = $_POST["nombre"];
		    	if($tipo_docu!=='NIT' || 
		    		$tipo_docu!=='Identificación Tributaria Internacional'){
		    		$eapellido1= $_POST["apellido1"];
		    		$eapellido2= $_POST["apellido2"];
		    	}else{
		    		$eapellido1='';
		    		$eapellido2='';
		    	}
		    	$num_docu = $_POST["num_docu"];
		    	$tipo_identificacion = $_POST["tipo_identificacion"];
		    	$telefono = $_POST["e_contacto"];
		    	$celular = $_POST["e_celular"];
		    	$email = $_POST["email"];
		    	$estado = $_POST["estado"];
		    	$municipio = $_POST["municipio"];
		    	$direccion = $_POST["direccion"];
		    	$digito = $_POST["digito"];
		    	//DATOS DE CONDUCTOR
		    	$c='';
		    	if($_POST["conductor"]){
		    		$c=$_POST["conductor"];
		    	}else{
		    		$c=0;
		    	}
		    	
		    	if(isset($_POST["ecedula"])){
			    		$ecedula=$_POST["ecedula"];
			    }
		    	$e_categoria = $_POST["e_categoria"];
		    	$e_num_licencia = $_POST["e_num_licencia"];
		    	$e_vence_licencia = $_POST["e_vence_licencia"];
		    	$fecha=date('Y-m-d');
		    	$hora=date('G:i:s');
		    	$user=$_SESSION["usuario"]["nom_usuario"];

		    	if($_POST["edicion_financiera"]==25){
		    		$acticiuu=$_POST["acticiuu"];
		    		$tributario=$_POST["tributario"];
		    		$banco=$_POST["banco"];
		    		$tipocuenta=$_POST["tipocuenta"];
		    		$numcuenta=$_POST["numcuenta"];
		    	}


		    	$model    = new Conexion;
				$conexion = $model->conectar();

				//ejecute consulta
				$sql="
					UPDATE cmx_proveedores 
					SET nombre='".$nombre."',
					 apellido1='".$eapellido1."',	
					 apellido2='".$eapellido2."',	
					 abreviatura='".$abreviatura."',
					 contacto='".$telefono."',
					 celular='".$celular."',
					 direccion='".$direccion."',
					 email='".$email."',
					 id_municipio='".$municipio."',
					 rndc_categoria_licencia='".$e_categoria."',
					 rndc_numero_licencia='".$e_num_licencia."',
					 rndc_vencimiento_licencia='".$e_vence_licencia."',
					 documentos_soporte='public/files/proveedores/".$id_proveedor."/'
					WHERE id=".$id_proveedor.";
				";
				$editarproveedor = $conexion->prepare($sql);
				$result=$editarproveedor->execute();
				//trasladar documento soporte al directorio
				// $cont=$cont+1;
				$rutadocu="../public/files/proveedores/".$id_proveedor."/";

				if(file_exists($rutadocu)){

					if(file_exists($rutadocu) &&  $ecedula!=''){
						$aleatorio1=rand(10000,90000);
						$aleatorio2=rand(10000,90000);
						$nom1=$aleatorio1.$ecedula;
						//echo $nom1;
						$sqlce="UPDATE cmx_proveedores
							SET 
							documentos_soporte='public/files/proveedores/".$id_proveedor."/".$nom1."'
							WHERE id=".$id_proveedor."";
						$editese = $conexion->prepare($sqlce);
						$result=$editese->execute();

						 for ($x=0; $x< count($_FILES); $x++){
					    	if(isset($_FILES["e_documentos".$x])){
					        $file = $_FILES["e_documentos".$x];
					        $nombre = $aleatorio1.$file["name"];
					        $tipo = $file["type"];
					        $ruta_provisional = $file["tmp_name"];
					        $carpeta=$rutadocu;
					        $src=$carpeta.$nombre;
					        move_uploaded_file($ruta_provisional, $src);
					    		}	
							}	
					}
				}else{
					 mkdir($rutadocu, 0777, true);
					 if(file_exists($rutadocu) &&  $ecedula!=''){
						$aleatorio1=rand(10000,90000);
						$aleatorio2=rand(10000,90000);
						$nom1=$aleatorio1.$ecedula;
						//echo $nom1;
						$sqlce="UPDATE cmx_proveedores
							SET 
							documentos_soporte='public/files/proveedores/".$id_proveedor."/".$nom1."'
							WHERE id=".$id_proveedor."";
						$editese = $conexion->prepare($sqlce);
						$result=$editese->execute();

						 for ($x=0; $x< count($_FILES); $x++){
					    	if(isset($_FILES["e_documentos".$x])){
					        $file = $_FILES["e_documentos".$x];
					        $nombre = $aleatorio1.$file["name"];
					        $tipo = $file["type"];
					        $ruta_provisional = $file["tmp_name"];
					        $carpeta=$rutadocu;
					        $src=$carpeta.$nombre;
					        move_uploaded_file($ruta_provisional, $src);
					    		}	
							}	
					}	 	
				}
				if($c==1){
			    	$eps = $_POST["eps"];
			    	$venceeps = $_POST["venceeps"];
			    	$arl = '';
			    	$vencearl = '';
			    	$nomenti = $_POST["nomenti"];
			    	$vencecurso = $_POST["vencecurso"];
			    	//datos nuevos -- empresariales 1
			    	if(isset($_POST["e_celular2"])){
			    		$e_celular2=$_POST["e_celular2"];
			    	}else{
			    		$e_celular2='';
			    	}
			    	$e_sexo=$_POST["e_sexo"];
			    	$e_fecha_nacimiento=$_POST["e_fecha_nacimiento"];
			    	$e_ingreso=$_POST["e_ingreso"];
			    	$e_sangre=$_POST["e_sangre"];
			    	$e_civil=$_POST["e_civil"];
			    	$e_ultimo_arl='';
			    	$e_ultimo_eps='';

			    	//traer los nombres de los archivos
			    	if(isset($_POST["lab1n"])){
			    		$lab1n=$_POST["lab1n"];
			    	}
			    	if(isset($_POST["lab2n"])){
			    		$lab2n=$_POST["lab2n"];
			    	}

			    	if(isset($_POST["lab3n"])){
			    		$lab3n=$_POST["lab3n"];
			    	}

			    	if(isset($_POST["per1n"])){
			    		$per1n=$_POST["per1n"];
			    	}

			    	if(isset($_POST["per2n"])){
			    		$per2n=$_POST["per2n"];
			    	}

			    	if(isset($_POST["epsname"])){
			    		$epsname=$_POST["epsname"];
			    	}

			    	if(isset($_POST["rutname"])){
			    		$rutname=$_POST["rutname"];
			    	}

			    	if(isset($_POST["arlname"])){
			    		$arlname=$_POST["arlname"];
			    	}

			    	if(isset($_POST["licenname"])){
			    		$licenname=$_POST["licenname"];
			    	}

			    	if(isset($_POST["induname"])){
			    		$induname=$_POST["induname"];
			    	}

			    	if(isset($_POST["frontalname"])){
			    		$frontalname=$_POST["frontalname"];
			    	}

			    	if(isset($_POST["derechaname"])){
			    		$derechaname=$_POST["derechaname"];
			    	}

			    	if(isset($_POST["izquierdaname"])){
			    		$izquierdaname=$_POST["izquierdaname"];
			    	}

			    	if(isset($_POST["cursoname"])){
			    		$cursoname=$_POST["cursoname"];
			    	}

			    	if(isset($_POST["acuerdo1name"])){
			    		$acuerdo1name=$_POST["acuerdo1name"];
			    	}

		    	}

				if($c==1){	

					$sql2="
						UPDATE cmx_detalle_conductor
						SET celular2='".$e_celular2."',
						nombre_eps='".$eps."', 
						fecha_vence_eps='".$venceeps."',
						ultimo_eps='".$e_ultimo_eps."',
						nombre_arl='".$arl."',
						fecha_vence_arl='".$vencearl."',
						ultimo_arl='".$e_ultimo_arl."',
						nombre_entidad='".$nomenti."',
						vence_curso='".$vencecurso."',
						sexo='".$e_sexo."',
						fecha_nacimiento='".$e_fecha_nacimiento."',
						grupo_sanguineo='".$e_sangre."',
						estado_civil='".$e_civil."',
						fecha_ingreso='".$e_ingreso."'
						WHERE id_proveedor=".$id_proveedor.";
					";
					// echo $sql2;
					$editarproveedor2 = $conexion->prepare($sql2);
					$result=$editarproveedor2->execute();

					//referencia laboral 1
					$i;
					for($i=1; $i<= 3; $i++){
						$eid=$_POST["e_id".$i];
						$e_referencias_empresariales=$_POST["e_referencias_empresariales".$i];
			    		$e_fecha_referencia=$_POST["e_fecha_referencia".$i];
			    		$e_fecha_retiro=$_POST["e_fecha_retiro".$i];
			    		$e_contacto_ref=$_POST["e_contacto_ref".$i];
			    		$e_celular_ref=$_POST["e_celular_ref".$i];
			    		$e_cargo_ref=$_POST["e_cargo_ref".$i];
			    		$e_anti_ref=$_POST["e_anti_ref".$i];
			    		//nombre de documentos


			    		for ($a=0; $a< count($_FILES); $a++){
					    	if(isset($_FILES["e_documento_referencia1".$a])){
					        $file = $_FILES["e_documento_referencia1".$a];
					        $nombre = $file["name"];
					        $tipo = $file["type"];
					        $ruta_provisional = $file["tmp_name"];
					   	}
					}

					$sql3="
						UPDATE cmx_referencias_preestudio
						SET nombre_empresa='".$e_referencias_empresariales."',
						fecha_ingreso='".$e_fecha_referencia."',
						fecha_retiro='".$e_fecha_retiro."',
						persona_contacto='".$e_contacto_ref."',
						celular=".$e_celular_ref.",
						cargo='".$e_cargo_ref."',
						antiguedad=".$e_anti_ref.",
						fecha='".$fecha."',
						hora='".$hora."',
						usuario='".$user."'
						WHERE id_conductor=".$id_proveedor." 
							AND id=".$eid."
						";
						$editarreferencias = $conexion->prepare($sql3);
						$result=$editarreferencias->execute();

					}

					//actualizar referencias personales
					$a;
					for($a=1; $a<=2; $a++){
						$refep=$_POST["refep".$a];
						$fechap=$_POST["fechap".$a];
						$e_parenp=$_POST["e_parenp".$a];
						$e_telefonop=$_POST["e_telefonop".$a];
						$e_idp=$_POST["e_idp".$a];

						$sql4="UPDATE cmx_referencias_personales
								SET nombre_personal='".$refep."',
									fecha_personal='".$fechap."',
									parentezco=".$e_parenp.",
									tel_personal=".$e_telefonop.",
									usuario='".$user."',
									fecha='".$fecha."',
									hora='".$hora."'
								WHERE id=".$e_idp." 
								AND id_conductor=".$id_proveedor.";
						";
						//echo $sql4;
						$editarreferenciasp = $conexion->prepare($sql4);
						$result=$editarreferenciasp->execute();
					}

				}
				if($c==1){
								//referencia 1
								/*if(isset($_POST["e_ruta_ref1"])){
									$foto_ref1 ="public/files/proveedores/empresarial/$id_proveedor/1/";
									$rutaref1= "../" . $foto_ref1;
								}else{
									$foto_ref1 ="public/files/proveedores/empresarial/$id_proveedor/1/";
									$rutaref1= "../" . $foto_ref1;
								} */
								//referencia 2
								/*if(isset($_POST["e_ruta_ref2"])){
									$rutaref2="../".$_POST["e_ruta_ref2"];
								}else{
									$foto_ref2 ="public/files/proveedores/empresarial/$id_proveedor/";
									$rutaref2= "../" . $foto_ref2;
								}
								//referencia personal 1
								if(isset($_POST["e_ruta_per1"])){
									$rutarefp="../".$_POST["e_ruta_per1"];
								}else{
									$foto_refp ="public/files/proveedores/personal/$id_proveedor/";
									$rutarefp= "../" . $foto_refp;
								}
								//referencia personal 2
								if(isset($_POST["e_ruta_per2"])){
									$rutarefp2="../".$_POST["e_ruta_per2"];
								}else{
									$foto_refp2 ="public/files/proveedores/personal/$id_proveedor/";
									$rutarefp2= "../" . $foto_refp2;
								}
								//eps
								if(isset($_POST["e_ruta_eps"])){
									$rutareps="../".$_POST["e_ruta_eps"];
								}else{
									$foto_eps ="public/files/proveedores/eps/$id_proveedor/";
									$rutareps= "../" . $foto_eps;
								}
								//arl
								if(isset($_POST["e_ruta_arl"])){
									$rutararl="../".$_POST["e_ruta_arl"];
								}else{
									$foto_arl ="public/files/proveedores/arl/$id_proveedor/";
									$rutararl= "../" . $foto_arl;
								}
								//curso
								if(isset($_POST["e_ruta_curso"])){
									$rutarcurso="../".$_POST["e_ruta_curso"];
								}else{
									$foto_curso ="public/files/proveedores/curso/$id_proveedor/";
									$rutarcurso= "../" . $foto_curso;
								}
								//fotos
								if(isset($_POST["e_ruta_fotos"])){
									$rutarfotos="../".$_POST["e_ruta_fotos"];
								}else{
									$foto_foto ="public/files/proveedores/fotos/$id_proveedor/";
									$rutarfotos= "../" . $foto_foto;
								}
								//indumentaria
								if(isset($_POST["e_ruta_indumentaria"])){
									$rutarindu="../".$_POST["e_ruta_indumentaria"];
								}else{
									$foto_indu ="public/files/proveedores/indumentaria/$id_proveedor/";
									$rutarindu= "../" . $foto_indu;
								}
								//licencia
								if(isset($_POST["e_ruta_licencia"])){
									$rutarli="../".$_POST["e_ruta_licencia"];
								}else{
									$foto_li ="public/files/proveedores/licencias/$id_proveedor/";
									$rutarli= "../" . $foto_li;
								}

								//trasladar licencia
								if (!file_exists($rutarli)) {
								        mkdir($rutarli, 0777, true);
								 }
								for ($h=0; $h< count($_FILES); $h++){
								    	if(isset($_FILES["e_docu_licencia".$h])){
								        $file = $_FILES["e_docu_licencia".$h];
								        $nombre = $file["name"];
								        $tipo = $file["type"];
								        $ruta_provisional = $file["tmp_name"];
								        $carpeta=$rutarli;
								        $src=$carpeta.$nombre;
								        move_uploaded_file($ruta_provisional, $src);
								    	}
								
								*/
							  if(isset($_POST["id_conductor"])){
							  	$id_conductor=$_POST["id_conductor"];
							  } //id del conductor o proveedor

							  if(isset($_POST["id_tbdetalle"])){
							  	$id_detalle=$_POST["id_tbdetalle"];
							  }	

							  if(isset($_POST["idlab1"])){
							  	$idlab1=$_POST["idlab1"];
							  }else{
							  	$idlab1='';
							  }

							  if(isset($_POST["idlab2"])){
							  	$idlab2=$_POST["idlab2"];
							  }else{
							  	$idlab2='';
							  }

							  if(isset($_POST["idlab3"])){
							  	$idlab3=$_POST["idlab3"];
							  }else{
							  	$idlab3='';
							  }

							  if(isset($_POST["idper1"])){
							  	$idper1=$_POST["idper1"];
							  }else{
							  	$idper1='';
							  }

							  if(isset($_POST["idper2"])){
							  	$idper2=$_POST["idper2"];
							  }else{
							  	$idper2='';
							  }
								//generar codigo aleatorio
								$rutaref1 ="../public/files/proveedores/empresarial/".$id_conductor."/1/";
								//REFERENCIA LABORAL 1
								
								if(file_exists($rutaref1)){
									if(file_exists($rutaref1) &&  $lab1n!=''){
									        //mkdir($rutaref1, 0777, true);
										$aleatorio1=rand(10000,90000);
										$aleatorio2=rand(10000,90000);
										$nom1=$aleatorio1.$lab1n;
										//echo $nom1;
										$sqlA="UPDATE cmx_referencias_preestudio
											SET 
											documento_empresarial='public/files/proveedores/empresarial/".$id_conductor."/1/',
											name_documento='".$nom1."'
											WHERE id=".$idlab1."
											AND id_conductor=".$id_conductor."";
										$editlab1 = $conexion->prepare($sqlA);
										$result=$editlab1->execute();	

										 for ($a=0; $a< count($_FILES); $a++){
									    	if(isset($_FILES["e_documento_referencia1".$a])){
									        $file = $_FILES["e_documento_referencia1".$a];
									        $nombre = $aleatorio1.$file["name"];
									        $tipo = $file["type"];
									        $ruta_provisional = $file["tmp_name"];
									        $carpeta=$rutaref1;
									        $src=$carpeta.$nombre;
									        move_uploaded_file($ruta_provisional, $src);
									    		}	
											}
									}
								}else{
									mkdir($rutaref1, 0777, true);
									if(file_exists($rutaref1) && $lab1n!=''){
								        //mkdir($rutaref1, 0777, true);
									$aleatorio1=rand(10000,90000);
									$aleatorio2=rand(10000,90000);
									$nom1=$aleatorio1.$lab1n;
									//echo $nom1;
									$sqlA="UPDATE cmx_referencias_preestudio
										SET documento_empresarial='public/files/proveedores/empresarial/".$id_conductor."/1/',
										name_documento='".$nom1."'
										WHERE id=".$idlab1."
										AND id_conductor=".$id_conductor."";
									$editlab1 = $conexion->prepare($sqlA);
									$result=$editlab1->execute();	

									 for ($a=0; $a< count($_FILES); $a++){
								    	if(isset($_FILES["e_documento_referencia1".$a])){
								        $file = $_FILES["e_documento_referencia1".$a];
								        $nombre = $aleatorio1.$file["name"];
								        $tipo = $file["type"];
								        $ruta_provisional = $file["tmp_name"];
								        $carpeta=$rutaref1;
								        $src=$carpeta.$nombre;
								        move_uploaded_file($ruta_provisional, $src);
								    		}	
										}
									}
								}
								//trasadar referencia laboral2
								$rutaref2 ="../public/files/proveedores/empresarial/".$id_conductor."/2/";
								if(file_exists($rutaref2)){
										if (file_exists($rutaref2) && $lab2n!=''){
										        //mkdir($rutaref2, 0777, true);
											$aleatorio1=rand(10000,90000);
											$aleatorio2=rand(10000,90000);
											$nom2=$aleatorio1.$lab2n;
											$sqlB="UPDATE cmx_referencias_preestudio
												SET documento_empresarial='public/files/proveedores/empresarial/".$id_conductor."/2/',
												name_documento='".$nom2."'
												WHERE id=".$idlab2."
												AND id_conductor=".$id_conductor."";
											$editlab2 = $conexion->prepare($sqlB);
											$result=$editlab2->execute();	

											for ($t=0; $t< count($_FILES); $t++){
										    	if(isset($_FILES["e_documento_referencia2".$t])){
										        $file = $_FILES["e_documento_referencia2".$t];
										        $nombre = $aleatorio1.$file["name"];
										        $tipo = $file["type"];
										        $ruta_provisional = $file["tmp_name"];
										        $carpeta=$rutaref2;
										        $src=$carpeta.$nombre;
										        move_uploaded_file($ruta_provisional, $src);
										    	}
											}
										}
								}else{
									mkdir($rutaref2, 0777, true);
									if (file_exists($rutaref2) && $lab2n!='') {
								        //mkdir($rutaref2, 0777, true);
									$aleatorio1=rand(10000,90000);
									$aleatorio2=rand(10000,90000);
									$nom2=$aleatorio1.$lab2n;
									$sqlB="UPDATE cmx_referencias_preestudio
										SET documento_empresarial='public/files/proveedores/empresarial/".$id_conductor."/2/',
										name_documento='".$nom2."'
										WHERE id=".$idlab2."
										AND id_conductor=".$id_conductor."";
										//echo $sqlB;


									$editlab2 = $conexion->prepare($sqlB);
									$result=$editlab2->execute();	

										for ($t=0; $t< count($_FILES); $t++){
									    	if(isset($_FILES["e_documento_referencia2".$t])){
									        $file = $_FILES["e_documento_referencia2".$t];
									        $nombre = $aleatorio1.$file["name"];
									        $tipo = $file["type"];
									        $ruta_provisional = $file["tmp_name"];
									        $carpeta=$rutaref2;
									        $src=$carpeta.$nombre;
									        move_uploaded_file($ruta_provisional, $src);
									    	}
										}
									}
								}

								//trasladar referencia laboral3
									$rutaref3 ="../public/files/proveedores/empresarial/".$id_conductor."/3/";
								if(file_exists($rutaref3)){
									if (file_exists($rutaref3) && $lab3n!='') {
										$aleatorio1=rand(10000,90000);
										$aleatorio2=rand(10000,90000);
										$nom3=$aleatorio1.$lab3n;

										$sqlC="
											UPDATE cmx_referencias_preestudio
											SET documento_empresarial='public/files/proveedores/empresarial/".$id_conductor."/3/',
											name_documento='".$nom3."'
											WHERE id=".$idlab3."
											AND id_conductor=".$id_conductor."
										";
										$editlab3 = $conexion->prepare($sqlC);
										$result=$editlab3->execute();

										for ($q=0; $q< count($_FILES); $q++){
									    	if(isset($_FILES["e_documento_referencia3".$q])){
									        $file = $_FILES["e_documento_referencia3".$q];
									        $nombre = $aleatorio1.$file["name"];
									        $tipo = $file["type"];
									        $ruta_provisional = $file["tmp_name"];
									        $carpeta=$rutaref3;
									        $src=$carpeta.$nombre;
									        move_uploaded_file($ruta_provisional, $src);
									    	}
										}
									}
								}else{
								mkdir($rutaref3, 0777, true);
								if (file_exists($rutaref3) && $lab3n!='') {
									$aleatorio1=rand(10000,90000);
									$aleatorio2=rand(10000,90000);
									$nom3=$aleatorio1.$lab3n;

									$sqlC="
										UPDATE cmx_referencias_preestudio
										SET 
										documento_empresarial='public/files/proveedores/empresarial/".$id_conductor."/3/',
										name_documento='".$nom3."'
										WHERE id=".$idlab3."
										AND id_conductor=".$id_conductor."
									";
									$editlab3 = $conexion->prepare($sqlC);
									$result=$editlab3->execute();

									for ($q=0; $q< count($_FILES); $q++){
								    	if(isset($_FILES["e_documento_referencia3".$q])){
								        $file = $_FILES["e_documento_referencia3".$q];
								        $nombre = $aleatorio1.$file["name"];
								        $tipo = $file["type"];
								        $ruta_provisional = $file["tmp_name"];
								        $carpeta=$rutaref3;
								        $src=$carpeta.$nombre;
								        move_uploaded_file($ruta_provisional, $src);
								    	}
									}
								}
								}	

								//trasladar referencia personal 1
								$rutarefp="../public/files/proveedores/personal/".$id_conductor."/1/";
								if(file_exists($rutarefp)){
									if(file_exists($rutarefp) && $per1n!='') {
								        //mkdir($rutarefp, 0777, true);
									$aleatorio1=rand(10000,90000);
									$aleatorio2=rand(10000,90000);
									$nom4=$aleatorio1.$per1n;
									$sqlD="UPDATE cmx_referencias_personales
										SET name_documento='".$nom4."'
										WHERE id=".$idper1."
										AND id_conductor=".$id_conductor."";
									$editper1 = $conexion->prepare($sqlD);
									$result=$editper1->execute();
					

									for ($b=0; $b< count($_FILES); $b++){
								    	if(isset($_FILES["e_documento_personal1".$b])){
								        $file = $_FILES["e_documento_personal1".$b];
								        $nombre = $aleatorio1.$file["name"];
								        $tipo = $file["type"];
								        $ruta_provisional = $file["tmp_name"];
								        $carpeta=$rutarefp;
								        $src=$carpeta.$nombre;
								        move_uploaded_file($ruta_provisional, $src);
								    	}
									}
								 } 
								}else{
									mkdir($rutarefp, 0777, true);
									if(file_exists($rutarefp) && $per1n!='') {
								        //mkdir($rutarefp, 0777, true);
									$aleatorio1=rand(10000,90000);
									$aleatorio2=rand(10000,90000);
									$nom4=$aleatorio1.$per1n;
									$sqlD="UPDATE cmx_referencias_personales
										SET 
										documento_personal='public/files/proveedores/personal/".$id_conductor."/1/',
										name_documento='".$nom4."'
										WHERE id=".$idper1."
										AND id_conductor=".$id_conductor."";
									$editper1 = $conexion->prepare($sqlD);
									$result=$editper1->execute();

									for ($b=0; $b< count($_FILES); $b++){
								    	if(isset($_FILES["e_documento_personal1".$b])){
								        $file = $_FILES["e_documento_personal1".$b];
								        $nombre = $aleatorio1.$file["name"];
								        $tipo = $file["type"];
								        $ruta_provisional = $file["tmp_name"];
								        $carpeta=$rutarefp;
								        $src=$carpeta.$nombre;
								        move_uploaded_file($ruta_provisional, $src);
								    	}
									}
								 }
								}
								//traslar referencia personal 2
								 $rutarefp2="../public/files/proveedores/personal/".$id_conductor."/2/";
								if(file_exists($rutarefp2)){
									if (file_exists($rutarefp2) && $per2n!='') {
										$aleatorio1=rand(10000,90000);
										$aleatorio2=rand(10000,90000);
										$nom5=$aleatorio1.$per2n;

										$sqlE="UPDATE cmx_referencias_personales
											SET name_documento='".$nom5."'
											WHERE id=".$idper2."
											AND id_conductor=".$id_conductor."";
										$editper2 = $conexion->prepare($sqlE);
										$result=$editper2->execute();


									  	for ($c=0; $c< count($_FILES); $c++){
									    	if(isset($_FILES["e_documento_personal2".$c])){
									        $file = $_FILES["e_documento_personal2".$c];
									        $nombre =$aleatorio1.$file["name"];
									        $tipo = $file["type"];
									        $ruta_provisional = $file["tmp_name"];
									        $carpeta=$rutarefp2;
									        $src=$carpeta.$nombre;
									        move_uploaded_file($ruta_provisional, $src);
									    	}
										}
									}
								}else{
								 	mkdir($rutarefp2, 0777, true);
								 		if(file_exists($rutarefp2) && $per2n!='') {
									$aleatorio1=rand(10000,90000);
									$aleatorio2=rand(10000,90000);
									$nom5=$aleatorio1.$per2n;

									$sqlE="UPDATE cmx_referencias_personales
										SET 
										documento_personal='public/files/proveedores/personal/".$id_conductor."/2/',
										name_documento='".$nom5."'
										WHERE id=".$idper2."
										AND id_conductor=".$id_conductor."";
									$editper2 = $conexion->prepare($sqlE);
									$result=$editper2->execute();


								  	for ($c=0; $c< count($_FILES); $c++){
								    	if(isset($_FILES["e_documento_personal2".$c])){
								        $file = $_FILES["e_documento_personal2".$c];
								        $nombre =$aleatorio1.$file["name"];
								        $tipo = $file["type"];
								        $ruta_provisional = $file["tmp_name"];
								        $carpeta=$rutarefp2;
								        $src=$carpeta.$nombre;
								        move_uploaded_file($ruta_provisional, $src);
								    	}
									}
									}
								}
								//trasladar EPS - planilla de seguridad
								$rutaeps="../public/files/proveedores/eps/".$id_conductor."/";

								if(file_exists($rutaeps)){
									if (file_exists($rutaeps) &&  $epsname!='') {
										$aleatorio1=rand(10000,90000);
										$aleatorio2=rand(10000,90000);
									    $nomeps=$aleatorio1.$epsname;   
										$sqlE="UPDATE cmx_detalle_conductor
												SET 
												documento_eps='public/files/proveedores/eps/".$id_conductor."/',
												n_docu_eps='".$nomeps."'
												WHERE id=".$id_detalle." 
												AND id_proveedor=".$id_conductor."	";
										//echo $sqlE;		
										$editeps = $conexion->prepare($sqlE);
										$result=$editeps->execute();

										for ($d=0; $d< count($_FILES); $d++){
									    	if(isset($_FILES["e_docu_eps".$d])){
									        $file = $_FILES["e_docu_eps".$d];
									        $nombre =$aleatorio1.$file["name"];
									        $tipo = $file["type"];
									        $ruta_provisional = $file["tmp_name"];
									        $carpeta=$rutaeps;
									        $src=$carpeta.$nombre;
									        move_uploaded_file($ruta_provisional, $src);
									    	}
										}
									}
								}else{
									mkdir($rutaeps, 0777, true);
									if (file_exists($rutaeps) && $epsname!='') {
										$aleatorio1=rand(10000,90000);
										$aleatorio2=rand(10000,90000);
									    $nomeps=$aleatorio1.$epsname;   
										$sqlE="UPDATE cmx_detalle_conductor
												SET 
												documento_eps='public/files/proveedores/eps/".$id_conductor."/',
												n_docu_eps='".$nomeps."'
												WHERE id=".$id_detalle." 
												AND id_proveedor=".$id_conductor."	";
										//echo $sqlE;		
										$editeps = $conexion->prepare($sqlE);
										$result=$editeps->execute();

										for ($d=0; $d< count($_FILES); $d++){
									    	if(isset($_FILES["e_docu_eps".$d])){
									        $file = $_FILES["e_docu_eps".$d];
									        $nombre =$aleatorio1.$file["name"];
									        $tipo = $file["type"];
									        $ruta_provisional = $file["tmp_name"];
									        $carpeta=$rutaeps;
									        $src=$carpeta.$nombre;
									        move_uploaded_file($ruta_provisional, $src);
									    	}
										}
									}
								}
						
								//trasladar ARL  
								/*$rutararl="../public/files/proveedores/arl/".$id_conductor."/";
								if (file_exists($rutararl) && $arlname!=''){
									$aleatorio1=rand(10000,90000);
									$aleatorio2=rand(10000,90000);
								    $nom6=$aleatorio1.$arlname.$aleatorio2;
									$sqlF="UPDATE cmx_detalle_conductor
										SET n_docu_arl='".$nom6."'
										WHERE id=".$id_detalle."
										AND id_proveedor=".$id_conductor."";
									$editarl = $conexion->prepare($sqlF);
									$result=$editarl->execute();

									for ($e=0; $e< count($_FILES); $e++){
								    	if(isset($_FILES["e_docu_arl".$e])){
								        $file = $_FILES["e_docu_arl".$e];
								        $nombre =$aleatorio1.$file["name"].$aleatorio2;
								        $tipo = $file["type"];
								        $ruta_provisional = $file["tmp_name"];
								        $carpeta=$rutararl;
								        $src=$carpeta.$nombre;
								        move_uploaded_file($ruta_provisional, $src);
								    	}
									}
								 }*/
						
								//trasladar curso de mercancias peligrosas
								 $rutarcurso="../public/files/proveedores/curso/".$id_conductor."/";
								 if(file_exists($rutarcurso)){
								 	if(file_exists($rutarcurso) && $cursoname!=''){
									    $aleatorio1=rand(10000,90000);
										$aleatorio2=rand(10000,90000);
									    $nomcur=$aleatorio1.$cursoname;   
										$sqlG="UPDATE cmx_detalle_conductor
												SET 
												carnet_curso='public/files/proveedores/curso/".$id_conductor."/',
												n_docu_curso='".$nomcur."'
												WHERE id=".$id_detalle." 
												AND id_proveedor=".$id_conductor."	";
										//echo $sqlE;		
										$editcurso = $conexion->prepare($sqlG);
										$result=$editcurso->execute();


										for ($f=0; $f< count($_FILES); $f++){
									    	if(isset($_FILES["e_docu_curso".$f])){
									        $file = $_FILES["e_docu_curso".$f];
									        $nombre =$aleatorio1.$file["name"];
									        $tipo = $file["type"];
									        $ruta_provisional = $file["tmp_name"];
									        $carpeta=$rutarcurso;
									        $src=$carpeta.$nombre;
									        move_uploaded_file($ruta_provisional, $src);
									    	}
										}
									}
								 }else{
								 	mkdir($rutarcurso, 0777, true);
								 	if(file_exists($rutarcurso) && $cursoname!=''){
									    $aleatorio1=rand(10000,90000);
										$aleatorio2=rand(10000,90000);
									    $nomcur=$aleatorio1.$cursoname;   
										$sqlG="UPDATE cmx_detalle_conductor
												SET 
												carnet_curso='public/files/proveedores/curso/".$id_conductor."/',
												n_docu_curso='".$nomcur."'
												WHERE id=".$id_detalle." 
												AND id_proveedor=".$id_conductor."	";
										//echo $sqlE;		
										$editcurso = $conexion->prepare($sqlG);
										$result=$editcurso->execute();


										for ($f=0; $f< count($_FILES); $f++){
									    	if(isset($_FILES["e_docu_curso".$f])){
									        $file = $_FILES["e_docu_curso".$f];
									        $nombre =$aleatorio1.$file["name"];
									        $tipo = $file["type"];
									        $ruta_provisional = $file["tmp_name"];
									        $carpeta=$rutarcurso;
									        $src=$carpeta.$nombre;
									        move_uploaded_file($ruta_provisional, $src);
									    	}
										}
									}
								 }
								//trasladar RUT
								$rutarut="../public/files/proveedores/rut/".$id_conductor."/";

								if(file_exists($rutarut)){
									if(file_exists($rutarut) &&  $rutname!=''){
										$aleatorio1=rand(10000,90000);
										$aleatorio2=rand(10000,90000);
									    $nomrut=$aleatorio1.$rutname; 
									    $sqlH="UPDATE cmx_detalle_conductor
												SET 
												documento_rut='public/files/proveedores/rut/".$id_conductor."/',
												n_docu_rut='".$nomrut."'
												WHERE id=".$id_detalle." 
												AND id_proveedor=".$id_conductor."	";
										//echo $sqlE;		
										$editrut = $conexion->prepare($sqlH);
										$result=$editrut->execute();

										for ($r=0; $r< count($_FILES); $r++){
									    	if(isset($_FILES["e_docu_rut".$r])){
									        $file = $_FILES["e_docu_rut".$r];
									        $nombre =$aleatorio1.$file["name"];
									        $tipo = $file["type"];
									        $ruta_provisional = $file["tmp_name"];
									        $carpeta=$rutarut;
									        $src=$carpeta.$nombre;
									        move_uploaded_file($ruta_provisional, $src);
									    	}
										}
									}
								}else{
									mkdir($rutarut, 0777, true);
									if(file_exists($rutarut) &&  $rutname!=''){
										$aleatorio1=rand(10000,90000);
										$aleatorio2=rand(10000,90000);
									    $nomrut=$aleatorio1.$rutname; 
									    $sqlH="UPDATE cmx_detalle_conductor
												SET 
												documento_rut='public/files/proveedores/rut/".$id_conductor."/',
												n_docu_rut='".$nomrut."'
												WHERE id=".$id_detalle." 
												AND id_proveedor=".$id_conductor."	";
										//echo $sqlE;		
										$editrut = $conexion->prepare($sqlH);
										$result=$editrut->execute();

										for ($r=0; $r< count($_FILES); $r++){
									    	if(isset($_FILES["e_docu_rut".$r])){
									        $file = $_FILES["e_docu_rut".$r];
									        $nombre =$aleatorio1.$file["name"];
									        $tipo = $file["type"];
									        $ruta_provisional = $file["tmp_name"];
									        $carpeta=$rutarut;
									        $src=$carpeta.$nombre;
									        move_uploaded_file($ruta_provisional, $src);
									    	}
										}
									}
								}
								//trasladar licencia
								$rutalice="../public/files/proveedores/licencias/".$id_conductor."/";
								if(file_exists($rutalice)){
									if(file_exists($rutalice) &&  $licenname!=''){
										$aleatorio1=rand(10000,90000);
										$aleatorio2=rand(10000,90000);
									    $nomlice=$aleatorio1.$licenname; 
									    $sqlI="UPDATE cmx_proveedores
												SET 
												subir_licencia='public/files/proveedores/licencias/".$id_conductor."/',
												n_docu_licencia='".$nomlice."'
												WHERE id=".$id_conductor."	";
										//echo $sqlI;		
										$editli = $conexion->prepare($sqlI);
										$result=$editli->execute();

										for ($l=0; $l< count($_FILES); $l++){
									    	if(isset($_FILES["e_docu_lice".$l])){
									        $file = $_FILES["e_docu_lice".$l];
									        $nombre =$aleatorio1.$file["name"];
									        $tipo = $file["type"];
									        $ruta_provisional = $file["tmp_name"];
									        $carpeta=$rutalice;
									        $src=$carpeta.$nombre;
									        move_uploaded_file($ruta_provisional, $src);
									    	}
										}
									}
								}else{
									mkdir($rutalice, 0777, true);
									if(file_exists($rutalice) && $licenname!=''){
										$aleatorio1=rand(10000,90000);
										$aleatorio2=rand(10000,90000);
									    $nomlice=$aleatorio1.$licenname; 
									    $sqlI="UPDATE cmx_proveedores
												SET 
												subir_licencia='public/files/proveedores/licencias/".$id_conductor."/',
												n_docu_licencia='".$nomlice."'
												WHERE id=".$id_conductor."	";
										//echo $sqlI;		
										$editli = $conexion->prepare($sqlI);
										$result=$editli->execute();

										for ($l=0; $l< count($_FILES); $l++){
									    	if(isset($_FILES["e_docu_lice".$l])){
									        $file = $_FILES["e_docu_lice".$l];
									        $nombre =$aleatorio1.$file["name"];
									        $tipo = $file["type"];
									        $ruta_provisional = $file["tmp_name"];
									        $carpeta=$rutalice;
									        $src=$carpeta.$nombre;
									        move_uploaded_file($ruta_provisional, $src);
									    	}
										}
									}
								}
								//fotos de la indumentaria
								$rutarindu="../public/files/proveedores/indumentaria/".$id_conductor."/";
								if(file_exists($rutarindu)){
									if (file_exists($rutarindu) && $induname!='') {
								    	$aleatorio1=rand(10000,90000);
										$aleatorio2=rand(10000,90000);
									    $nomindu=$aleatorio1.$induname; 
									    $sqlJ="UPDATE cmx_detalle_conductor
												SET 
												foto_indumentaria='public/files/proveedores/indumentaria/".$id_conductor."/',
												name_cindu='".$nomindu."'
												WHERE id=".$id_detalle." 
												AND id_proveedor=".$id_conductor."	";
										//echo $sqlJ;		
										$editindu = $conexion->prepare($sqlJ);
										$result=$editindu->execute();   


										for ($f=0; $f< count($_FILES); $f++){
									    	if(isset($_FILES["e_foto_indume".$f])){
									        $file = $_FILES["e_foto_indume".$f];
									        $nombre =$aleatorio1.$file["name"];
									        $tipo = $file["type"];
									        $ruta_provisional = $file["tmp_name"];
									        $carpeta=$rutarindu;
									        $src=$carpeta.$nombre;
									        move_uploaded_file($ruta_provisional, $src);
									    	}
										}
									}
								}else{
									mkdir($rutarindu, 0777, true);
									if (file_exists($rutarindu) && $induname!='') {
								    	$aleatorio1=rand(10000,90000);
										$aleatorio2=rand(10000,90000);
									    $nomindu=$aleatorio1.$induname; 
									    $sqlJ="UPDATE cmx_detalle_conductor
												SET 
												foto_indumentaria='public/files/proveedores/indumentaria/".$id_conductor."/',
												name_cindu='".$nomindu."'
												WHERE id=".$id_detalle." 
												AND id_proveedor=".$id_conductor."	";
										//echo $sqlJ;		
										$editindu = $conexion->prepare($sqlJ);
										$result=$editindu->execute();   


										for ($f=0; $f< count($_FILES); $f++){
									    	if(isset($_FILES["e_foto_indume".$f])){
									        $file = $_FILES["e_foto_indume".$f];
									        $nombre =$aleatorio1.$file["name"];
									        $tipo = $file["type"];
									        $ruta_provisional = $file["tmp_name"];
									        $carpeta=$rutarindu;
									        $src=$carpeta.$nombre;
									        move_uploaded_file($ruta_provisional, $src);
									    	}
										}
									}
								}
								//fotos del conductor
								 $rutarfrontal="../public/files/proveedores/fotos/".$id_conductor."/F/";
								 if(file_exists($rutarfrontal)){
								 	if (file_exists($rutarfrontal) && $frontalname!='') {
										$aleatorio1=rand(10000,90000);
										$aleatorio2=rand(10000,90000);
									    $nomf=$aleatorio1.$frontalname; 

									    $sqlK="UPDATE cmx_detalle_conductor
												SET 
												foto_conductor='public/files/proveedores/fotos/".$id_conductor."/F/',
												name_cfrontal='".$nomf."'
												WHERE id=".$id_detalle." 
												AND id_proveedor=".$id_conductor."	";
										//echo $sqlJ;		
										$editfrontal = $conexion->prepare($sqlK);
										$result=$editfrontal->execute();   

								       for ($g=0; $g< count($_FILES); $g++){
								    	if(isset($_FILES["e_foto_conductor".$g])){
								        $file = $_FILES["e_foto_conductor".$g];
								        $nombre =$aleatorio1.$file["name"];
								        $tipo = $file["type"];
								        $ruta_provisional = $file["tmp_name"];
								        $carpeta=$rutarfrontal;
								        $src=$carpeta.$nombre;
								        move_uploaded_file($ruta_provisional, $src);
								    	}
										}
								 	}
								 }else{
								 		mkdir($rutarfrontal, 0777, true);
								 		if (file_exists($rutarfrontal) && $frontalname!='') {
										$aleatorio1=rand(10000,90000);
										$aleatorio2=rand(10000,90000);
									    $nomf=$aleatorio1.$frontalname; 

									    $sqlK="UPDATE cmx_detalle_conductor
												SET 
												foto_conductor='public/files/proveedores/fotos/".$id_conductor."/F/',
												name_cfrontal='".$nomf."'
												WHERE id=".$id_detalle." 
												AND id_proveedor=".$id_conductor."	";
										//echo $sqlJ;		
										$editfrontal = $conexion->prepare($sqlK);
										$result=$editfrontal->execute();   

								       for ($g=0; $g< count($_FILES); $g++){
								    	if(isset($_FILES["e_foto_conductor".$g])){
								        $file = $_FILES["e_foto_conductor".$g];
								        $nombre =$aleatorio1.$file["name"];
								        $tipo = $file["type"];
								        $ruta_provisional = $file["tmp_name"];
								        $carpeta=$rutarfrontal;
								        $src=$carpeta.$nombre;
								        move_uploaded_file($ruta_provisional, $src);
								    	}
										}
								 	}
								 }

								 //foto conductor derecha
								 $rutarfrontald="../public/files/proveedores/fotos/".$id_conductor."/D/";

								 if(file_exists($rutarfrontald)){
								 	if (file_exists($rutarfrontald) && $derechaname!='') {
										$aleatorio1=rand(10000,90000);
										$aleatorio2=rand(10000,90000);
									    $nomd=$aleatorio1.$derechaname; 

									    $sqlL="UPDATE cmx_detalle_conductor
												SET 
												foto_derecha='public/files/proveedores/fotos/".$id_conductor."/D/',
												name_cderecha='".$nomd."'
												WHERE id=".$id_detalle." 
												AND id_proveedor=".$id_conductor."	";
										//echo $sqlJ;		
										$editderecha = $conexion->prepare($sqlL);
										$result=$editderecha->execute();   

								       for ($x=0; $x< count($_FILES); $x++){
								    	if(isset($_FILES["e_foto_derecha".$x])){
								        $file = $_FILES["e_foto_derecha".$x];
								        $nombre =$aleatorio1.$file["name"];
								        $tipo = $file["type"];
								        $ruta_provisional = $file["tmp_name"];
								        $carpeta=$rutarfrontald;
								        $src=$carpeta.$nombre;
								        move_uploaded_file($ruta_provisional, $src);
								    	}
										}
								 	}
								 }else{
								 	mkdir( $rutarfrontald, 0777, true);
								 	if (file_exists($rutarfrontald) && $derechaname!='') {
										$aleatorio1=rand(10000,90000);
										$aleatorio2=rand(10000,90000);
									    $nomd=$aleatorio1.$derechaname; 

									    $sqlL="UPDATE cmx_detalle_conductor
												SET 
												foto_derecha='public/files/proveedores/fotos/".$id_conductor."/D/',
												name_cderecha='".$nomd."'
												WHERE id=".$id_detalle." 
												AND id_proveedor=".$id_conductor."	";
										//echo $sqlJ;		
										$editderecha = $conexion->prepare($sqlL);
										$result=$editderecha->execute();   

								       for ($x=0; $x< count($_FILES); $x++){
								    	if(isset($_FILES["e_foto_derecha".$x])){
								        $file = $_FILES["e_foto_derecha".$x];
								        $nombre =$aleatorio1.$file["name"];
								        $tipo = $file["type"];
								        $ruta_provisional = $file["tmp_name"];
								        $carpeta=$rutarfrontald;
								        $src=$carpeta.$nombre;
								        move_uploaded_file($ruta_provisional, $src);
								    	}
										}
								 	}
								 }
								 //foto conductor izquierda
								 $rutarfrontali="../public/files/proveedores/fotos/".$id_conductor."/I/";
								 if(file_exists($rutarfrontali)){
									 	if (file_exists($rutarfrontali) && $izquierdaname!='') {
											$aleatorio1=rand(10000,90000);
											$aleatorio2=rand(10000,90000);
										    $nomi=$aleatorio1.$izquierdaname; 

										    $sqlO="UPDATE cmx_detalle_conductor
													SET 
													foto_izquierda='public/files/proveedores/fotos/".$id_conductor."/I/',
													name_cizquierda='".$nomi."'
													WHERE id=".$id_detalle." 
													AND id_proveedor=".$id_conductor."	";
											//echo $sqlJ;		
											$editizquierda = $conexion->prepare($sqlO);
											$result=$editizquierda->execute();   

									       for ($z=0; $z< count($_FILES); $z++){
									    	if(isset($_FILES["e_foto_izquierda".$z])){
									        $file = $_FILES["e_foto_izquierda".$z];
									        $nombre =$aleatorio1.$file["name"];
									        $tipo = $file["type"];
									        $ruta_provisional = $file["tmp_name"];
									        $carpeta=$rutarfrontali;
									        $src=$carpeta.$nombre;
									        move_uploaded_file($ruta_provisional, $src);
									    		}
											}
									 	}
								 }else{
								 	mkdir($rutarfrontali, 0777, true);
								 	if (file_exists($rutarfrontali) && $izquierdaname!='') {
											$aleatorio1=rand(10000,90000);
											$aleatorio2=rand(10000,90000);
										    $nomi=$aleatorio1.$izquierdaname; 

										    $sqlO="UPDATE cmx_detalle_conductor
													SET 
													foto_izquierda='public/files/proveedores/fotos/".$id_conductor."/I/',
													name_cizquierda='".$nomi."'
													WHERE id=".$id_detalle." 
													AND id_proveedor=".$id_conductor."	";
											//echo $sqlJ;		
											$editizquierda = $conexion->prepare($sqlO);
											$result=$editizquierda->execute();   

									       for ($z=0; $z< count($_FILES); $z++){
									    	if(isset($_FILES["e_foto_izquierda".$z])){
									        $file = $_FILES["e_foto_izquierda".$z];
									        $nombre =$aleatorio1.$file["name"];
									        $tipo = $file["type"];
									        $ruta_provisional = $file["tmp_name"];
									        $carpeta=$rutarfrontali;
									        $src=$carpeta.$nombre;
									        move_uploaded_file($ruta_provisional, $src);
									    		}
											}
									 }
								 }
								 //Acuerdo 1
								 $rutaracuerdo="../public/files/proveedores/acuerdo/".$id_conductor."/AC1/";

								 if(file_exists($rutaracuerdo)){
									 	if (file_exists($rutaracuerdo) && $acuerdo1name!='') {
											$aleatorio1=rand(10000,90000);
											$aleatorio2=rand(10000,90000);
										    $nomi=$aleatorio1.$acuerdo1name; 

										    $sqlf="UPDATE cmx_detalle_conductor
													SET 
													foto_acuerdo1='public/files/proveedores/acuerdo/".$id_conductor."/AC1/',
													name_acuerdo1='".$nomi."'
													WHERE id=".$id_detalle." 
													AND id_proveedor=".$id_conductor."	";
											//echo $sqlJ;		
											$editiacuerdo = $conexion->prepare($sqlf);
											$result=$editiacuerdo->execute();   

									       for ($g=0; $g< count($_FILES); $g++){
									    	if(isset($_FILES["e_acuerdo1".$g])){
									        $file = $_FILES["e_acuerdo1".$g];
									        $nombre =$aleatorio1.$file["name"];
									        $tipo = $file["type"];
									        $ruta_provisional = $file["tmp_name"];
									        $carpeta=$rutaracuerdo;
									        $src=$carpeta.$nombre;
									        move_uploaded_file($ruta_provisional, $src);
									    		}
											}
									 	}
								 }else{
								 	mkdir($rutaracuerdo, 0777, true);
								 	if (file_exists($rutaracuerdo) && $acuerdo1name!='') {
											$aleatorio1=rand(10000,90000);
											$aleatorio2=rand(10000,90000);
										    $nomi=$aleatorio1.$acuerdo1name; 

										    $sqlO="UPDATE cmx_detalle_conductor
													SET 
													foto_acuerdo1='public/files/proveedores/acuerdo/".$id_conductor."/AC1/',
													name_acuerdo1='".$nomi."'
													WHERE id=".$id_detalle." 
													AND id_proveedor=".$id_conductor."	";
											//echo $sqlJ;		
											$editizquierda = $conexion->prepare($sqlO);
											$result=$editizquierda->execute();   

									       for ($g=0; $g< count($_FILES); $g++){
									    	if(isset($_FILES["e_acuerdo1".$g])){
									        $file = $_FILES["e_acuerdo1".$g];
									        $nombre =$aleatorio1.$file["name"];
									        $tipo = $file["type"];
									        $ruta_provisional = $file["tmp_name"];
									        $carpeta=$rutaracuerdo;
									        $src=$carpeta.$nombre;
									        move_uploaded_file($ruta_provisional, $src);
									    		}
											}
									 }
								 }	
				}

				//PROVEEDORES - internacional
				$hacer=$_POST["hacer"];
				if($hacer==5){
					$fecha_actual=date('Y-m-d');
					$hora_actual=date('H:i:s');
					$user=$_SESSION["usuario"]["nom_usuario"];
					$id_proveedor=$_POST["id_proveedor"];
					if($_POST["enacional"]==true || $_POST["einternacional"]==true){
						if($_POST["enacional"]==true){
							$tipo_proveedor=1;
						}
						if($_POST["einternacional"]==true){
							$tipo_proveedor=2;
						}
					}
					$e_localizacion=$_POST["e_localizacion"];
					$e_zona=$_POST["e_zona"];
					$e_tiposervicio=$_POST["e_tiposervicio"];
					$edetalle1=$_POST["edetalle1"];
					$edetalle2=$_POST["edetalle2"];

					if(isset($_POST["name"])){
						$name=$_POST["name"];
					}else{
						$name='';
					}

					if(isset($_POST["cargo"])){
						$cargo=$_POST["cargo"];
					}else{
						$cargo='';
					}

					if(isset($_POST["telefono"])){
						$telefono=$_POST["telefono"];
					}else{
						$telefono='';
					}

					if(isset($_POST["celular"])){
						$celular=$_POST["celular"];
					}else{
						$celular='';
					}

					if(isset($_POST["correo"])){
						$correo=$_POST["correo"];
					}else{
						$correo='';
					}
					
					if(isset($_POST["critica"])){
						$critica=$_POST["critica"];
					}else{
						$critica='';
					}
					
					if(isset($_POST["refe"])){
						$refe=$_POST["refe"];
					}else{
						$refe='';
					}

					if(isset($_POST["idtb"])){
						$idtb=$_POST["idtb"];
					}else{
						$idtb='';
					}

					//verificar si existe el dato detalle proveedor
					$sqlm="SELECT * FROM cmx_proveedores_detalle 	
						WHERE id_proveedor=".$id_proveedor."";
					$consultar= $conexion->prepare($sqlm);
					$consultar->execute();			
					$total = $consultar->rowCount();
					if($total==0){//no existe, insert
						
						$sql="INSERT INTO cmx_proveedores_detalle 
							(id,id_proveedor,cod_tipo_proveedor,cod_pais,
							descripcion_zona,tipo_servicio,tipo_servicio_detalle1,
							tipo_servicio_detalle2,hora,fecha,usuario)
							VALUES(null,".$id_proveedor.",".$tipo_proveedor.",
							".$e_localizacion.",'".$e_zona."','".$e_tiposervicio."',
							'".$edetalle1."','".$edetalle2."','".$hora_actual."','".$fecha_actual."','".$user."')";
						$crear_proveedor = $conexion->prepare($sql);
						$crear_proveedor->execute();	

					}else{//existe , update

						$sql="UPDATE cmx_proveedores_detalle 
						SET cod_tipo_proveedor='".$tipo_proveedor."',
							cod_pais='".$e_localizacion."',
							descripcion_zona='".$e_zona."',
							tipo_servicio='".$e_tiposervicio."',
							tipo_servicio_detalle1='".$edetalle1."',
							tipo_servicio_detalle2='".$edetalle2."'
						WHERE id_proveedor=".$id_proveedor."";
						$editar_proveedor = $conexion->prepare($sql);
						$editar_proveedor->execute();	
					}
					
					$sql2="UPDATE cmx_proveedor_contactos 
							SET nombres_apellidos='".$name."',
								cargo='".$cargo."',
								telefono='".$telefono."',
								celular='".$celular."',
								correo='".$correo."',
								inf_critica='".$critica."',
								referencias='".$refe."'
							WHERE id_proveedor='".$id_proveedor."' 
							AND id=".$idtb."";	
					$editar_proveedor2 = $conexion->prepare($sql2);
					$editar_proveedor2->execute();	
				}

				//PROPIETARIO Y TENEDOR
				if($_POST["edicion_financiera"]==25){
					$sqlf="UPDATE cmx_proveedor_financieros
					SET
					actividad_economica='".$acticiuu."',
					obliga_tributaria='".$tributario."',
					banco='".$banco."',
					tipo_cuenta='".$tipocuenta."',
					numero_cuenta='".$numcuenta."'
					WHERE  id_proveedor=".$id_proveedor;
					$editar_finanza = $conexion->prepare($sqlf);
					$editar_finanza->execute();
				}

				//HISTORICO
				$sql = " INSERT INTO cmx_log_proveedores (id_usuario,id_proveedor,operacion,fecha_hora_operacion) VALUES ($id_usuario,$id_proveedor,'Editar',NOW())";
				$crear_log_proveedor = $conexion->prepare($sql);
				$crear_log_proveedor->execute();
				// $return["error"] = $_msg_error;
				$return["success"]= true;
			  	return $return;
	}


	public function editarsolo_Proveedor(){
		$_msg_error = "";	
		$Data = new Consultas;
		$model    = new Conexion;
		$conexion = $model->conectar();

		$fecha_actual=date('Y-m-d');
		$hora_actual=date('H:i:s');
		$user=$_SESSION["usuario"]["nom_usuario"];

		$id_proveedor=$_POST["id_proveedor"];
		$enacional=$_POST["enacional"];
		$einternacional=$_POST["einternacional"];
		if($_POST["enacional"]==true || 
			$_POST["einternacional"]==true ){
			if($_POST["enacional"]==true){
				$tipo_proveedor=1;
			}
			if($_POST["einternacional"]==true){
				$tipo_proveedor=2;
			}
		}


		$e_localizacion=$_POST["e_localizacion"];
		$e_zona=$_POST["e_zona"];
		$e_tiposervicio=$_POST["e_tiposervicio"];
		$edetalle1=$_POST["edetalle1"];
		$edetalle2=$_POST["edetalle2"];

		//contactos
		$hacer=$_POST["hacer"];
		if($hacer==5){

			
				if(isset($_POST["name"])){
					$name=$_POST["name"];
				}else{
					$name='';
				}

				if(isset($_POST["cargo"])){
					$cargo=$_POST["cargo"];
				}else{
					$cargo='';
				}

				if(isset($_POST["telefono"])){
					$telefono=$_POST["telefono"];
				}else{
					$telefono='';
				}

				if(isset($_POST["celular"])){
					$celular=$_POST["celular"];
				}else{
					$celular='';
				}

				if(isset($_POST["correo"])){
					$correo=$_POST["correo"];
				}else{
					$correo='';
				}
				
				if(isset($_POST["critica"])){
					$critica=$_POST["critica"];
				}else{
					$critica='';
				}
				
				if(isset($_POST["refe"])){
					$refe=$_POST["refe"];
				}else{
					$refe='';
				}

				if(isset($_POST["idtb"])){
					$idtb=$_POST["idtb"];
				}else{
					$idtb='';
				}
				
			
				//verificar si existe el dato detalle proveedor
				$sqlm="SELECT * FROM cmx_proveedores_detalle 	
					WHERE id_proveedor=".$id_proveedor."";
				$consultar= $conexion->prepare($sqlm);
				$consultar->execute();			
				$total = $consultar->rowCount();
				if($total==0){//no existe, insert
					
					$sql="INSERT INTO cmx_proveedores_detalle 
						(id,id_proveedor,cod_tipo_proveedor,cod_pais,
						descripcion_zona,tipo_servicio,tipo_servicio_detalle1,
						tipo_servicio_detalle2,hora,fecha,usuario)
						VALUES(null,".$id_proveedor.",".$tipo_proveedor.",
						".$e_localizacion.",'".$e_zona."','".$e_tiposervicio."',
						'".$edetalle1."','".$edetalle2."','".$hora_actual."','".$fecha_actual."','".$user."')";
					$crear_proveedor = $conexion->prepare($sql);
					$crear_proveedor->execute();	

				}else{//existe , update

					$sql="UPDATE cmx_proveedores_detalle 
					SET cod_tipo_proveedor='".$tipo_proveedor."',
						cod_pais='".$e_localizacion."',
						descripcion_zona='".$e_zona."',
						tipo_servicio='".$e_tiposervicio."',
						tipo_servicio_detalle1='".$edetalle1."',
						tipo_servicio_detalle2='".$edetalle2."'
					WHERE id_proveedor=".$id_proveedor."";
					$editar_proveedor = $conexion->prepare($sql);
					$editar_proveedor->execute();	
				}

				$sql2="UPDATE cmx_proveedor_contactos 
						SET nombres_apellidos='".$name."',
							cargo='".$cargo."',
							telefono='".$telefono."',
							celular='".$celular."',
							correo='".$correo."',
							inf_critica='".$critica."',
							referencias='".$refe."'
						WHERE id_proveedor='".$id_proveedor."' 
						AND id=".$idtb."";	
				$editar_proveedor2 = $conexion->prepare($sql2);
				$editar_proveedor2->execute();	
		}
			

		$return["success"]= true;
		$return["error"] = $_msg_error;
	    return $return;

	}






	    public function editarProveedor(){
			$_flag_proceso = true;
			$_msg_error = "";
			/******** INSERCION DE CONTENIDO DEL TERCERO EN EL RNDC  ********/
			$Data = new Consultas;

			// Solicitud
			$arrayMinTrans["solicitud"] = Array(
				"tipo" => 1,
				"procesoid" => 11,
			);
			// Variable que se envían para la realizació del proceso 
			$arrayMinTrans["variables"] = Array(
				"NUMNITEMPRESATRANSPORTE"			=> MINTRANS_NIT,
				"CODTIPOIDTERCERO"					=> $Data->getRNDCTipoDocumento( $_POST["tipo_documento"] ) ,
				"NUMIDTERCERO"						=> $_POST["numero_documento"],
				"NOMIDTERCERO"						=> $_POST["rndc_nombre"],
				"NOMENCLATURADIRECCION"				=> $_POST["direccion"],
				"CODMUNICIPIORNDC"					=> $_POST["rndc_id_municipio"], 
			);

			$arrayMinTrans["variables"]["NUMIDTERCERO"] = $_POST["numero_documento"];
			if ( $_POST["tipo_documento"] == "NIT" ) {
				$arrayMinTrans["variables"]["NUMIDTERCERO"] = $_POST["numero_documento"] . $_POST["digito_verificacion"];
				$arrayMinTrans["variables"]["CODSEDETERCERO"] = 0;
				$arrayMinTrans["variables"]["NOMSEDETERCERO"] = $_POST["abreviatura"];
			}

			if ( isset( $_POST["primer_apellido"] ) ) {
				$arrayMinTrans["variables"]["PRIMERAPELLIDOIDTERCERO"] = $_POST["primer_apellido"];
			}
			if ( isset( $_POST["segundo_apellido"] ) ) {
				$arrayMinTrans["variables"]["SEGUNDOAPELLIDOIDTERCERO"] = $_POST["segundo_apellido"];
			}
			if ( isset( $_POST["contacto"] ) AND $_POST["contacto"] != "" AND $_POST["contacto"] != 0 ) {
				$arrayMinTrans["variables"]["NUMTELEFONOCONTACTO"] = $_POST["contacto"];
			}
			if ( isset( $_POST["celular"] ) AND $_POST["celular"] != "" AND $_POST["celular"] != 0 ) {
				$arrayMinTrans["variables"]["NUMCELULARPERSONA"] = $_POST["celular"];
			}
			if ( isset( $_POST["categoria_licencia"] ) ) {
				$arrayMinTrans["variables"]["CODCATEGORIALICENCIACONDUCCION"] = $_POST["categoria_licencia"];
			}
			if ( isset( $_POST["numero_licencia"] ) ) {
				$arrayMinTrans["variables"]["NUMLICENCIACONDUCCION"] = $_POST["numero_licencia"];
			}
			if ( isset( $_POST["vencimiento_licencia"] ) ) {
				$arrayMinTrans["variables"]["FECHAVENCIMIENTOLICENCIA"] = $_POST["vencimiento_licencia"];
			}
			// $return["edita_tercero_array"] = $arrayMinTrans;

			// Se ejecuta la consulta hacia el RNDC del ministerio de transporte 
			$result = $Data->getRNDCQueryArray( $arrayMinTrans );
			// $return["edita_tercero_result"] = $result;

			// Se valida si la operación fue exitosa
			if ( isset( $result["ErrorMSG"] ) ) {
				$_flag_proceso = false;
				$_msg_error.= "<p><strong>Registro no actualizado en RNDC - Tercero.</strong></p>";
				$_msg_error.= $result["ErrorMSG"];
			}else{
				$rndc_ingresoid = $result["ingresoid"];
				// $return["edita_tercero_id_edita"] = $rndc_ingresoid;
			}
			/******** FIN - INSERCION DE CONTENIDO DEL TERCERO EN EL RNDC  ********/

			if ( $_flag_proceso ) {
				$id_proveedor = $_POST["id_proveedor"];
				$tipo_documento = $_POST["tipo_documento"];
				$numero_documento = $_POST["numero_documento"];
				$digito_verificacion = $_POST["digito_verificacion"];
				$tipo_regimen = $_POST["tipo_regimen"];
				$tipo_identificacion = $_POST["tipo_identificacion"];
				$nombre = $_POST["nombre"];
				$abreviatura = $_POST["abreviatura"];
				$contacto = $_POST["contacto"];
				$celular = $_POST["celular"];
				$direccion = $_POST["direccion"];
				$email = $_POST["email"];
				$estado = $_POST["estado"];
				$observaciones = $_POST["observaciones"];
				$id_municipio = $_POST["municipio"];
				$referencias_empresariales = $_POST["referencias_empresariales"];
				$referencias_personales = $_POST["referencias_personales"];
				$id_usuario = $_SESSION["usuario"]["id_usuario"];
				$Conductor = $_POST["Conductor"];
				$Empleado = $_POST["Empleado"];
				$poseedor_vehiculo = $_POST["poseedor_vehiculo"];
				$propietario_vehiculo = $_POST["propietario_vehiculo"];
				$Proveedor = $_POST["Proveedor"];

				if ( isset($_POST["ruta_documentos"]) ) {
					$ruta= "../".$_POST["ruta_documentos"];
				} else {
					$documentos_soporte = "public/files/proveedores/$id_proveedor/";
					$ruta= "../" . $documentos_soporte;
				}

				$rndc_categoria_licencia = "";
				$rndc_numero_licencia = "";
				$rndc_vencimiento_licencia = "";
				if ( $Conductor == "true" ) {
					$rndc_categoria_licencia = $_POST["categoria_licencia"];
					$rndc_numero_licencia = $_POST["numero_licencia"];
					$rndc_vencimiento_licencia = $_POST["vencimiento_licencia"];
				}

				$model    = new Conexion;
				$conexion = $model->conectar();

				$sql = " 
					UPDATE cmx_proveedores 
					SET 
						rndc_id = '$rndc_ingresoid', tipo_documento = '$tipo_documento', numero_documento = '$numero_documento',
						digito_verificacion ='$digito_verificacion', tipo_regimen = '$tipo_regimen', 
						tipo_identificacion = '$tipo_identificacion', nombre = '$nombre', abreviatura = '$abreviatura', contacto = '$contacto',
						celular = '$celular', direccion = '$direccion', email = '$email', id_municipio = '$id_municipio', 
						rndc_categoria_licencia = '$rndc_categoria_licencia', rndc_numero_licencia = '$rndc_numero_licencia',
						rndc_vencimiento_licencia = '$rndc_vencimiento_licencia', observaciones = '$observaciones', estado = '$estado',
						referencias_empresariales = '$referencias_empresariales', referencias_personales = '$referencias_personales', 
						documentos_soporte = '$documentos_soporte'
					WHERE id = $id_proveedor
				";
				$crear_solicitud = $conexion->prepare($sql);
				$result=$crear_solicitud->execute();

				$sql = " 
					INSERT INTO cmx_log_proveedores (id_usuario,id_proveedor,operacion,fecha_hora_operacion) VALUES ($id_usuario,$id_proveedor,'Editar',NOW())
				";
				$crear_log_proveedor = $conexion->prepare($sql);
				$crear_log_proveedor->execute();
				if (!file_exists($ruta)) {
					mkdir($ruta, 0777, true);
				}
				for ($x=0;$x<count($_FILES);$x++){
					$file = $_FILES["documentos".$x];
					$nombre = $file["name"];
					$tipo = $file["type"];
					$ruta_provisional = $file["tmp_name"];
					$carpeta=$ruta;
					$src=$carpeta.$nombre;
					move_uploaded_file($ruta_provisional, $src);
				}

				$sql = " DELETE FROM cmx_actividad_proveedor WHERE id_proveedor = $id_proveedor";
				$borrar_actividades = $conexion->prepare($sql);
				$borrar_actividades->execute();
				if ($Conductor == "true" ){
					$sql      = " INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ($id_proveedor,'Conductor')";
					$crear_solicitud = $conexion->prepare($sql);
					$result=$crear_solicitud->execute();
				}
				if ($Empleado == "true" ){
					$sql      = " INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ($id_proveedor,'Empleado')";
					$crear_solicitud = $conexion->prepare($sql);
					$result=$crear_solicitud->execute();
				}
				if ($poseedor_vehiculo == "true" ){
					$sql      = " INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ($id_proveedor,'Poseedor Vehiculo')";
					$crear_solicitud = $conexion->prepare($sql);
					$result=$crear_solicitud->execute();
				}
				if ($propietario_vehiculo == "true" ){
					$sql      = " INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ($id_proveedor,'Propietario Vehiculo')";
					$crear_solicitud = $conexion->prepare($sql);
					$result=$crear_solicitud->execute();
				}
				if ($Proveedor == "true" ){
					$sql      = " INSERT INTO cmx_actividad_proveedor (id_proveedor,actividad) VALUES ($id_proveedor,'Proveedor')";
					$crear_solicitud = $conexion->prepare($sql);
					$result=$crear_solicitud->execute();
				}
			}

			$return["error"] = $_msg_error;
	        return $return;
	    }

	    public function inactivarProveedor(){
	        $id_proveedor = $_POST["id_proveedor"];
	        $model    = new Conexion;
	        $conexion = $model->conectar();
	        $sql      = " UPDATE cmx_proveedores SET estado= 'Inactivo' WHERE id= $id_proveedor";
	        $inactiva_proveedor = $conexion->prepare($sql);
	        $inactiva_proveedor->execute(); 
	        $return["success"]=true;
	        return $return;
	    }

	    public function activarProveedor(){
	        $id_proveedor = $_POST["id_proveedor"];
	        $model    = new Conexion;
	        $conexion = $model->conectar();
	        $sql      = " UPDATE cmx_proveedores SET estado = 'Activo' WHERE id= $id_proveedor";
	        $inactiva_proveedor = $conexion->prepare($sql);
	        $inactiva_proveedor->execute(); 
	        $return["success"]=true;
	        return $return;
	    }


		public function cargarmunicipios(){
			$Data = new Consultas;
			// $sql = "SELECT * FROM cmx_municipios LIMIT 2000";
			$sql = "SELECT CONCAT(municipio ,' (',depto,' - ',pais,')') MUNICIPIO FROM cmx_municipios LIMIT 2000";
			$result = $Data->getConsulta($sql);

			if ( isset($result["rowsData"]) ) {
				$return["success"]= true;
				$return["content"] = $result["rowsData"];
			} else {
				$return["success"]= false;
			}
			return $return;
		}

	    public function obtenerdatosmunicipio(){
	        $municipio = $_POST["municipio"];
	        $arrayMunicipio = explode(" (", $municipio);
	        $municipio = $arrayMunicipio[0];
	        $sql = "SELECT * FROM cmx_municipios WHERE municipio = '$municipio' LIMIT 1";
	        $model    = new Conexion;
	        $conexion = $model->conectar();
	        $consulta = $conexion->prepare($sql);
	        $consulta->execute();
	        $total         = $consulta->rowCount();
	        if ($total == 0) {            
	            $return["success"]= false;
	            
	        } else {
	            $return["success"]= true;
	            $datos_municipio = $consulta->fetch();
	            $return["content"] = $datos_municipio;
	        }  
	        return $return;
	    }  
	}
