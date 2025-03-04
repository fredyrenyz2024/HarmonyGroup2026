<?php 
	ini_set('max_execution_time', 120);

	include("../application/Config.php");
	include '../application/Conexion.php';
	require "../application/phpqrcode/qrlib.php";

	print_r("Ingreso al archivo generar_novedad.php\n");

	$Data = new Consultas;

	//PARÁMETROS DE CONFIGURACIÓN DE LA GENRACIÓN DE LOS QR
	$tamaño = 6; //Tamaño de Pixel
	$level = 'H'; //Precisión Baja
	$framSize = 3; //Tamaño en blanco

	print_r("Array del post \n");
	print_r($_POST);
	print_r("\n");

	// se genera el numero de la novedad
	$numero_novedad = time();
	$arrayNovedadIngreso = array();
	$arrayNovedadIngreso["numero_novedad"] = $numero_novedad;
	$arrayNovedadIngreso["causa_novedad"] = $_POST["causa_novedad"];
	$arrayNovedadIngreso["detalle"] = $_POST["detalle"];
	$arrayNovedadIngreso["id_usuario"] = $_POST["id_usuario"];

	if(isset($_POST["numero_estibas"])){
		$arrayNovedadIngreso["numero_estibas"] = $_POST["numero_estibas"];	
	}
	// print_r("\n");
	// print_r($arrayNovedadIngreso);
	// print_r("\n");
	print_r($Data->setRegistro("cmx_novedades", $arrayNovedadIngreso));

	$sql = '
		SELECT 
			MAX(cn.id) ID_NOVEDAD
		FROM
			cmx_novedades cn
		WHERE
			cn.numero_novedad = "' . $numero_novedad . '"
	';
	$arrayIdNovedad = $Data->getConsulta($sql);
	// print_r($arrayIdNovedad);
	// print_r("\n");
	$id_Novedad = $arrayIdNovedad["rowsData"][0]["ID_NOVEDAD"];

	if ($id_Novedad) {
		switch ($_POST["tipo_embalaje"]) {
			case 'estiba_completa':
				print_r("Novedad de la Estiba completa");

				// se selecciona los deliveries 
				$arrayEstibas = explode(",", $_POST["estibas_group"]);
				for ($i=0; $i < (COUNT($arrayEstibas) - 1) ; $i++) { 

					// se genera el numero de la novedad
					$numero_novedad = time();

					// Se crea el registro de la novedad del embalaje
					$arrayNovedadEstiba = array();
					$arrayNovedadEstiba["id_novedad"] = $id_Novedad;
					$arrayNovedadEstiba["id_embalaje"] = $arrayEstibas[$i];
					// print_r("\n");
					// print_r($arrayNovedadEstiba);
					// print_r("\n");
					print_r($Data->setRegistro("cmx_novedad_estiba", $arrayNovedadEstiba));

					// Se actualiza el estado de la estiba 
					$arrayEmbalaje = array();
					$arrayEmbalaje["sub_estado"] = 4;
					$arrayEmbalaje["estado"] = 1;
					print_r($Data->updateRegistro( "cmx_embalaje" , $arrayEmbalaje , $arrayEstibas[$i] ));

					// Se asigna el ingreso al delivery 
					$sql = '
						UPDATE cmx_embalaje 
						SET sub_estado = 4 , estado = 1 
						WHERE 
							id_embalaje = "' . $arrayEstibas[$i] . '"
					';
					$respuesta = $Data->getConsulta($sql);
					// print_r($respuesta);
					// print_r("\n");
				}
				break;
			
			case 'embalaje':
				print_r("Novedad del Embalaje de una Estiba\n");

				$sql = '
					SELECT 
						ce.id,
						CONCAT("public/img/qrMaterialesBodega/", ci.id_bodega_destino, "/", ci.numero_ingreso, "/", cmb.delivery, "/", cmc.codigo, "/", cmb.lote, "/embalaje/", ce.url_qr) DIR_QR,
						ce.url_qr
					FROM 
						cmx_ingresos ci
						INNER JOIN cmx_material_bodega cmb ON cmb.id_ingreso = ci.id
						INNER JOIN cmx_material_cliente cmc ON cmb.id_material = cmc.id
						INNER JOIN cmx_embalaje ce ON ce.id_material_bodega = cmb.id
					WHERE 
						ce.id_embalaje = ' . $_POST["id_embalaje"] . '
						AND ce.sub_estado = 2
					ORDER BY ce.id DESC
					LIMIT ' . $_POST["cantidad"] . '
				;';
				$arrayIdEmbalajes = $Data->getConsulta($sql);
				// print_r("\n");
				// print_r($arrayIdEmbalajes);
				// print_r("\n");

				$novedad_embalaje = '';
				$flag_qr = false;
				foreach ($arrayIdEmbalajes["rowsData"] as $key => $value) {
					// se actualiza el estado de la estiba
					$arrayDespacho["sub_estado"] = "4";
					$arrayDespacho["estado"] = 1;
					print_r($Data->updateRegistro("cmx_embalaje", $arrayDespacho, $value[0]));

					if (!$flag_qr) {
						$flag_qr = true;
					} else {
						$novedad_embalaje.= ',';
					}
					$novedad_embalaje.= '(' . $id_Novedad . ',' . $value[0] . ')';

					/****** SI LA CAUSA DE LA NOVEDAD ES AVERÍA (id = 1 de la tabla cmx_tipo_causa_novedad) 
					SE SENERAN LOS QR DE LOS EMBALAJES ASOCIADOS A LA NOVEDAD ******/   
					if ($_POST["causa_novedad"] == 1) {
						$_qr_code = explode(".", $value["url_qr"]);

						//Enviamos los parametros a la Función para generar código QR 
						QRcode::png($_qr_code[0], "../" . $value["DIR_QR"], $level, $tamaño, $framSize); 
					}
				}

				$sql = '
					INSERT INTO 
						cmx_novedad_estiba( id_novedad , id_embalaje )
					VALUES
						' . $novedad_embalaje . '
				';
				// print_r("\n" . $sql . "\n");
				$respuesta = $Data->getConsulta($sql);

				break;
			
			default:
				print_r("nada... no entra por acá");
				break;
		}
	} else {
		print_r("No se encontró novedad para actualizar los embalajes\n");
	}

?>
