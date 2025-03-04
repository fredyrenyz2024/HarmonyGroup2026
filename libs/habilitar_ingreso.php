<?php 
	ini_set('max_execution_time', 5760);

	include("../application/Config.php");
	include '../application/Conexion.php';
	require "../application/phpqrcode/qrlib.php";

	print_r("Ingreso al archivo habilitar_ingreso.php\n");

	$Data = new Consultas;

	//PARÁMETROS DE CONFIGURACIÓN DE LA GENRACIÓN DE LOS QR
	$tamaño = 6; //Tamaño de Pixel
	$level = 'H'; //Precisión Baja
	$framSize = 3; //Tamaño en blanco

	// print_r("Array del post \n");
	// print_r($_POST);
	// print_r("\n");

	// se modifica el estado del registro de cmx_ingreso
	$numero_ingreso = time();
	$arrayIngreso = array();
	$arrayIngreso["id_bodega_destino"] = $_POST["id_bodega_destino"];
	$arrayIngreso["id_cliente"] = $_POST["id_cliente"];
	$arrayIngreso["numero_ingreso"] = $numero_ingreso;
	$arrayIngreso["doc_conductor"] = $_POST["doc_conductor"];
	$arrayIngreso["nom_conductor"] = $_POST["nom_conductor"];
	$arrayIngreso["placa"] = $_POST["placa"];
	$arrayIngreso["precinto"] = $_POST["precinto"];
	$arrayIngreso["estado"] = 1;

	// print_r("Array del para insertar ingreso \n");
	// print_r($arrayIngreso);
	// print_r("\n");

	print_r($Data->setRegistro("cmx_ingresos", $arrayIngreso));
	print_r("\n");


	$sql = '
		SELECT 
			MAX(ci.id) ID_INGRESO
		FROM
			cmx_ingresos ci
		WHERE
			ci.id_cliente = "' . $_POST["id_cliente"] . '"
			AND ci.numero_ingreso = "' . $numero_ingreso . '"
	';
	// print_r("\n" . $sql . "\n");
	$arrayIdIngreso = $Data->getConsulta($sql);
	// print_r($arrayIdIngreso);
	// print_r("\n");
	$idIngreso = $arrayIdIngreso["rowsData"][0]["ID_INGRESO"];

	//carpeta general de qr's de todos los materiales
	$dir = '../public/img/qrMaterialesBodega/';
	//Si no existe la carpeta la creamos
	if (!file_exists($dir)){
		mkdir($dir);
	}

	//carpeta de cliente
	$dir_bodega = $dir . $_POST["id_bodega_destino"] . '/';
	//Si no existe la carpeta la creamos
	if (!file_exists($dir_bodega)){
		mkdir($dir_bodega);
	}

	//carpeta del numero de ingreso
	$dir_ingreso = $dir_bodega . $numero_ingreso . '/';
	//Si no existe la carpeta la creamos
	if (!file_exists($dir_ingreso)){
		mkdir($dir_ingreso);
	}
	// se selecciona los deliveries 
	$arrayDelivery = explode(",", $_POST["delivery_group"]);
	for ($i=0; $i < (COUNT($arrayDelivery) - 1) ; $i++) { 
		$numDelivery = $arrayDelivery[$i];
		// print_r("\nEntro en for del delivery - " . $numDelivery);
		//carpeta del delivery
		$dir_delivery = $dir_ingreso . $numDelivery . '/';
		//Si no existe la carpeta la creamos
		if (!file_exists($dir_delivery)){
			mkdir($dir_delivery);
		}

		// Se asigna el ingreso al delivery 
		$sql = '
			UPDATE cmx_material_bodega 
			SET id_ingreso = ' . $idIngreso . ' , estado = 1 
			WHERE 
				delivery = "' . $numDelivery . '"
				AND id_bodega = ' . $_POST["id_bodega_destino"] . '
				AND estado = 2
		';
		// print_r($sql . "\n");
		$respuesta = $Data->getConsulta($sql);

		$sql = '
			SELECT 
				ci.id_cliente, cc.nombre, ci.id_bodega_destino, ci.numero_ingreso, 
				cmc.codigo, cmb.id_material, cmb.lote, cmb.cantidad, 
				cmb.id, cmc.unidades_x_tendido, cmc.planchas_x_estiba
			FROM
				cmx_ingresos ci
				INNER JOIN cmx_material_bodega cmb ON cmb.id_ingreso = ci.id
				INNER JOIN cmx_material_cliente cmc ON cmc.id = cmb.id_material
				INNER JOIN cmx_clientes cc ON cc.id = ci.id_cliente
			WHERE
				cmb.estado = 1
				AND ci.id_cliente = "' . $_POST["id_cliente"] . '"
				AND ci.numero_ingreso = "' . $numero_ingreso . '"
				AND cmb.delivery = "' . $numDelivery . '"
		';
		// print_r("\n" . $sql . "\n");
		$respuesta = $Data->getConsulta($sql);
		// print_r($respuesta);
		// print_r("\n");

		if($respuesta["rowsNum"] > 0){
			foreach ($respuesta["rowsData"] as $key => $value) {
				print_r("\nEntro en foreach del material - " . $value["codigo"]);
				//carpeta del material
				$dir_material = $dir_delivery . $value["codigo"] . '/';
				//Si no existe la carpeta la creamos
				if (!file_exists($dir_material)){
					mkdir($dir_material);
				}

				//carpeta del lote
				$dir_lote = $dir_material . $value["lote"] . '/';
				//Si no existe la carpeta la creamos
				if (!file_exists($dir_lote)){
					mkdir($dir_lote);
				}

				//carpeta de qr's por caja
				$dir_embalaje = $dir_lote . 'embalaje/';
				//Si no existe la carpeta la creamos
				if (!file_exists($dir_embalaje)){
					mkdir($dir_embalaje);
				}
				// se genera el qr por embalaje
				$qr_emabalajes = '';
				$flag_qr = false;
				for ($j=0; $j < $value["cantidad"] ; $j++) { 
					/******* SE GENERAN LOS CODIGOS QR ******/
					$codigo_embalaje =	$value["id_bodega_destino"] . "-" . $value["id_cliente"] . "-" . $value["numero_ingreso"] . "-" . $numDelivery . "-" . $value["codigo"] . "-" . $value["lote"] . "-" . 0 . "-" . ($j + 1);
					// print_r("\n" . $codigo_embalaje);
					$contenido = crearKey($codigo_embalaje);
			
					//Declaramos la ruta y nombre del archivo a generar
					$filename = $dir_embalaje . $contenido .'.png';

					// //Enviamos los parametros a la Función para generar código QR 
					// QRcode::png($contenido, $filename, $level, $tamaño, $framSize); 
					/******* FIN SE GENERAN LOS CODIGOS QR ******/

					/******* SE GUARDA INFORMACIÓN DE LOS QUE RN LA BD ******/
					if (!$flag_qr) {
						$flag_qr = true;
					} else {
						$qr_emabalajes.= ',';
					}
					
					$qr_emabalajes.= '(' . $value["id"] . ',"' . $contenido . '.png")';

					// $arrayEmbalaje = array();
					// $arrayEmbalaje["id_material_bodega"] = $value["id"];
					// $arrayEmbalaje["url_qr"] = $contenido .'.png';
					// $Data->setRegistro("cmx_embalaje", $arrayEmbalaje);
				}
				$sql = '
					INSERT INTO 
						cmx_embalaje (id_material_bodega,url_qr )
					VALUES
						' . $qr_emabalajes . '
				';
				// print_r("\n" . $sql . "\n");
				$respuesta = $Data->getConsulta($sql);
				// print_r($respuesta);
				// print_r("\n");


				//carpeta de qr's por estiba
				$dir_estiba = $dir_lote . 'estiba/';
				//Si no existe la carpeta la creamos
				if (!file_exists($dir_estiba)){
					mkdir($dir_estiba);
				}

				// se calculan las estibas a usar 
				if ($value["unidades_x_tendido"] > 0 AND $value["planchas_x_estiba"] > 0) {
					$unidadesPorEstiba = $value["unidades_x_tendido"] * $value["planchas_x_estiba"];

					$cantidad_estibas = floor($value["cantidad"] / $unidadesPorEstiba);

					// se verifica si el emblaje que sin estiba
					if ($value["cantidad"] % $unidadesPorEstiba > 0) {
						// print_r("\nEntro en if de suma de resuduo ");
						$cantidad_estibas++;
					}
					// print_r("\nCantidad de estibas - " . $cantidad_estibas);
					// print_r("\n");

					$cantidadPorEstiba = $value["cantidad"];

					for ($j=0; $j < $cantidad_estibas; $j++) { 
						/******* SE GENERAN LOS CODIGOS QR ******/
						$codigo_estibas =	$value["id_bodega_destino"] . "-" . $value["id_cliente"] . "-" . $value["numero_ingreso"] . "-" . $numDelivery . "-" . $value["codigo"] . "-" . $value["lote"] . "-" . ($j + 1) . "-" . ($j + 1);
						// print_r("\n" . $codigo_estibas);
						$contenido = crearKey($codigo_estibas);
				
						//Declaramos la ruta y nombre del archivo a generar
						$filename = $dir_estiba . $contenido .'.png';

						//Enviamos los parametros a la Función para generar código QR 
						QRcode::png($contenido, $filename, $level, $tamaño, $framSize); 
						/******* FIN SE GENERAN LOS CODIGOS QR ******/

						/******* SE GUARDA INFORMACIÓN DE LOS QR EN LA BD ******/
						$arrayEstibas = array();
						$arrayEstibas["id_material_bodega"] = $value["id"];
						$arrayEstibas["url_qr"] = $contenido .'.png';
						$arrayEstibas["grupo"] = $j + 1;
						$arrayEstibas["cantidad_grupo"] = $unidadesPorEstiba;
						if ($cantidadPorEstiba < $unidadesPorEstiba) {
							$arrayEstibas["cantidad_grupo"] = $cantidadPorEstiba;
						}
						$Data->setRegistro("cmx_embalaje", $arrayEstibas);

						// Se asigna la estiba a los embalajes 
						$sql = '
							SELECT 
								MAX(ce.id) ID_MAX_ESTIBA
							FROM 
								cmx_embalaje ce 
								INNER JOIN cmx_material_bodega cmb ON ce.id_material_bodega = cmb.id
								INNER JOIN cmx_ingresos ci ON cmb.id_ingreso = ci.id
							WHERE 
								grupo > 0
								AND ci.numero_ingreso = ' . $value["numero_ingreso"] . '
								AND ci.id_bodega_destino = ' . $value["id_bodega_destino"] . '
						';
						// print_r("\n" . $sql . "\n");
						$respuestaIdEstiba = $Data->getConsulta($sql);
						// print_r($respuestaIdEstiba);
						// print_r("\n");

						// Se asigna la estiba a los embalajes 
						$sql = '
							UPDATE cmx_embalaje 
							SET 
								id_embalaje = ' . intval($respuestaIdEstiba["rowsData"][0]["ID_MAX_ESTIBA"]) . '
							WHERE
								grupo = 0
								AND id_material_bodega = ' . $value["id"] . '
								AND id_embalaje IS NULL
							LIMIT ' . $arrayEstibas["cantidad_grupo"] . ';
						';
						// print_r("\n" . $sql . "\n");
						$Data->getConsulta($sql);
						$cantidadPorEstiba = $cantidadPorEstiba - $unidadesPorEstiba;
					}
				}
			}
		}
	}

    function crearKey($user) {
        $key = base64_encode($user);
        $key = strrev($key);
        return htmlentities($key);
    }

    function reversarKey($key) {
        $key = html_entity_decode($key);
        $key = strrev($key);
        $key = base64_decode($key);
        return explode('-', $key);
    }

?>