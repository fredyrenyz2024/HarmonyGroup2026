<?php

	ini_set('max_execution_time', 120);

	include("../application/Config.php");
	include '../application/Conexion.php';

	$Conect = new Consultas;
	$table = "cmx_ordenes_compra";
	$ruta = BASE_URL . "public/files/";

		foreach ($_FILES as $key) {
			$nombre = $key["name"];
			$ruta_temporal = $key["tmp_name"];

			$file_origin = explode(".", $nombre);
			if ($file_origin[1] == "csv") {

				$x = 0;
				$info = array();

				$fichero = fopen($ruta_temporal, "r");

				while (($fila = trim(fgets($fichero))) != FALSE) {
					// print_r($fila);
					$x++;
					if($x > 1){
						$datos = explode(";", $fila);  
						$info = array(
							"cs_pais" 								=> limpiaTexto($datos[0]), 
							"fecha_recibido_en_cs" 					=> limpiaTexto($datos[1]), 
							"cs_num__requisicion"	 				=> limpiaTexto($datos[2]), 
							"cs_tipo_requisicion" 					=> limpiaTexto($datos[3]), 
							"cs_compañia" 							=> limpiaTexto($datos[4]), 
							"cs_codigo" 							=> limpiaTexto($datos[5]), 
							"cs_cantidad_solicitada" 				=> limpiaTexto($datos[6]), 
							"cs_descripcion1" 						=> limpiaTexto($datos[7]), 
							"cs_descripcion2" 						=> limpiaTexto($datos[8]), 
							"cs_usuario" 							=> limpiaTexto($datos[9]), 
							"cs_categoria" 							=> limpiaTexto($datos[10]), 
							"cs_subcategoria" 						=> limpiaTexto($datos[11]), 
							"cs_comprador" 							=> limpiaTexto($datos[12]), 
							"cs_status" 							=> limpiaTexto($datos[13]), 
							"cs_yk" 								=> limpiaTexto($datos[14]), 
							"cs_num_de_orden" 						=> limpiaTexto($datos[15]), 
							"cs_tipo_de_orden" 						=> limpiaTexto($datos[16]), 
							"cs_proveedor" 							=> limpiaTexto($datos[17]), 
							"cs_importado_nacional" 				=> limpiaTexto($datos[18]), 
							"cs_incoterm" 							=> limpiaTexto($datos[19]), 
							"cs_plazo_entrega_dias" 				=> limpiaTexto($datos[20]), 
							"cs_observacion_general" 				=> limpiaTexto($datos[21]), 
							"cs_fecha_especificacion" 				=> limpiaTexto($datos[22]), 
							"cs_fecha_generacion_oc" 				=> limpiaTexto($datos[23]), 
							"cs_fecha_envio_a_proveedor" 			=> limpiaTexto($datos[24]), 
							"cs_entrega_prometida_a_com_exterior" 	=> limpiaTexto($datos[25]), 
							"cs_llegada_prometida_a_almacen" 		=> limpiaTexto($datos[26]), 
							"cs_termino_pago" 						=> limpiaTexto($datos[27]), 
						);
						$Conect->setRegistro($table, $info);
					}
					// print_r("<pre>");
					// 	print_r($info);
					// print_r("</pre>");
				}

			} else {
				echo "Archivo no válido para subir al servidor";
			}
		}
	}
	/**** FUNCIONES DE SUBIDA DE ARCHIVO ****/


	function limpiaTexto($text){
		$text = filter_var(trim($text), FILTER_SANITIZE_STRING);
		$text = eregi_replace("[\n|\r|\n\r|\t|\0|\x0B]", "",$text);
	}

?>