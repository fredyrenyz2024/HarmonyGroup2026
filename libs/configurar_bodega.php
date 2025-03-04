<?php 
	ini_set('max_execution_time', 1200);

	include("../application/Config.php");
	include '../application/Conexion.php';
	require "../application/phpqrcode/qrlib.php";

	print_r("Ingreso al archivo configurar_bodega.php\n");

	$Data = new Consultas;

	//PARÁMETROS DE CONFIGURACIÓN DE LA GENRACIÓN DE LOS QR
	$tamaño = 6; //Tamaño de Pixel
	$level = 'H'; //Precisión Baja
	$framSize = 3; //Tamaño en blanco

	print_r("Array del post \n");
	print_r($_POST);
	print_r("\n");

	//carpeta general de qr's de las posiciones de las bodegas
	$dir = '../public/img/qrPosicionesBodega/';
	//Si no existe la carpeta la creamos
	if (!file_exists($dir)){
		mkdir($dir);
	}

	//carpeta de bodega
	$dir_bodega = $dir . $_POST["id_bodega"] . '/';
	//Si no existe la carpeta la creamos
	if (!file_exists($dir_bodega)){
		mkdir($dir_bodega);
	}

	for ($i=1; $i <= $_POST["lineas"] ; $i++) { 
		//carpeta de pasillo
		$dir_pasillo = $dir_bodega . $i . '/';
		//Si no existe la carpeta la creamos
		if (!file_exists($dir_pasillo)){
			mkdir($dir_pasillo);
		}
		for ($j=1; $j <= $_POST["columnas"] ; $j++) { 
			//carpeta de columna
			$dir_columna = $dir_pasillo . pasaLetra($j) . '/';
			//Si no existe la carpeta la creamos
			if (!file_exists($dir_columna)){
				mkdir($dir_columna);
			}
			for ($k=1; $k <= $_POST["niveles"] ; $k++) { 
				//carpeta de nivel
				$dir_nivel = $dir_columna . $k . '/';
				//Si no existe la carpeta la creamos
				if (!file_exists($dir_nivel)){
					mkdir($dir_nivel);
				}

				/******* SE GENERAN LOS CODIGOS QR ******/
				$codigo_bodega =	$_POST["id_bodega"] . "-" . $i . "-" . pasaLetra($j) . "-" . $k;
				// print_r("\n" . $codigo_bodega);
				$contenido = crearKey($codigo_bodega);
		
				//Declaramos la ruta y nombre del archivo a generar
				$filename = $dir_nivel . $contenido .'.png';

				//Enviamos los parametros a la Función para generar código QR 
				QRcode::png($contenido, $filename, $level, $tamaño, $framSize); 
				/******* FIN SE GENERAN LOS CODIGOS QR ******/

				$arrayPosicion = array();
				$arrayPosicion["id_bodega"] = $_POST["id_bodega"];
				$arrayPosicion["linea"] = $i;
				$arrayPosicion["columna"] = pasaLetra($j);
				$arrayPosicion["nivel"] = $k;
				$arrayPosicion["qr_posicion"] = $contenido . ".png";

				// print_r("\nArray del envio \n");
				// print_r($arrayPosicion);
				// print_r("\n");
				$Data->setRegistro("cmx_ubicaciones", $arrayPosicion);
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

	function pasaLetra($numero) {
		switch ($numero) {
			case 1: $letra = "A"; break;
			case 2: $letra = "B"; break;
			case 3: $letra = "C"; break;
			case 4: $letra = "D"; break;
			case 5: $letra = "E"; break;
			case 6: $letra = "F"; break;
			case 7: $letra = "G"; break;
			case 8: $letra = "H"; break;
			case 9: $letra = "I"; break;
			case 10: $letra = "J"; break;
			case 11: $letra = "K"; break;
			case 12: $letra = "L"; break;
			case 13: $letra = "M"; break;
			case 14: $letra = "N"; break;
			case 15: $letra = "O"; break;
			case 16: $letra = "P"; break;
			case 17: $letra = "Q"; break;
			case 18: $letra = "R"; break;
			case 19: $letra = "S"; break;
			case 20: $letra = "T"; break;
			case 21: $letra = "U"; break;
			case 22: $letra = "V"; break;
			case 23: $letra = "W"; break;
			case 24: $letra = "X"; break;
			case 25: $letra = "Y"; break;
			case 26: $letra = "Z"; break;
			case 27: $letra = "AA"; break;
			case 28: $letra = "AB"; break;
			case 29: $letra = "AC"; break;
			case 30: $letra = "AD"; break;
			case 31: $letra = "AE"; break;
			case 32: $letra = "AF"; break;
			case 33: $letra = "AG"; break;
			case 34: $letra = "AH"; break;
			case 35: $letra = "AI"; break;
			case 36: $letra = "AJ"; break;
			case 37: $letra = "AK"; break;
			case 38: $letra = "AL"; break;
			case 39: $letra = "AM"; break;
			case 40: $letra = "AN"; break;
			case 41: $letra = "AO"; break;
			case 42: $letra = "AP"; break;
			case 43: $letra = "AQ"; break;
			case 44: $letra = "AR"; break;
			case 45: $letra = "AS"; break;
			case 46: $letra = "AT"; break;
			case 47: $letra = "AU"; break;
			case 48: $letra = "AV"; break;
			case 49: $letra = "AW"; break;
			case 50: $letra = "AX"; break;
			case 51: $letra = "AY"; break;
			case 52: $letra = "AZ"; break;
			case 53: $letra = "BA"; break;
			case 54: $letra = "BB"; break;
			case 55: $letra = "BC"; break;
			case 56: $letra = "BD"; break;
			case 57: $letra = "BE"; break;
			case 58: $letra = "BF"; break;
			case 59: $letra = "BG"; break;
			case 60: $letra = "BH"; break;
			case 61: $letra = "BI"; break;
			case 62: $letra = "BJ"; break;
			case 63: $letra = "BK"; break;
			case 64: $letra = "BL"; break;
			case 65: $letra = "BM"; break;
			case 66: $letra = "BN"; break;
			case 67: $letra = "BO"; break;
			case 68: $letra = "BP"; break;
			case 69: $letra = "BQ"; break;
			case 70: $letra = "BR"; break;
			case 71: $letra = "BS"; break;
			case 72: $letra = "BT"; break;
			case 73: $letra = "BU"; break;
			case 74: $letra = "BV"; break;
			case 75: $letra = "BW"; break;
			case 76: $letra = "BX"; break;
			case 77: $letra = "BY"; break;
			case 78: $letra = "BZ"; break;
			case 79: $letra = "CA"; break;
			case 80: $letra = "CB"; break;
			case 81: $letra = "CC"; break;
			case 82: $letra = "CD"; break;
			case 83: $letra = "CE"; break;
			case 84: $letra = "CF"; break;
			case 85: $letra = "CG"; break;
			case 86: $letra = "CH"; break;
			case 87: $letra = "CI"; break;
			case 88: $letra = "CJ"; break;
			case 89: $letra = "CK"; break;
			case 90: $letra = "CL"; break;
			case 91: $letra = "CM"; break;
			case 92: $letra = "CN"; break;
			case 93: $letra = "CO"; break;
			case 94: $letra = "CP"; break;
			case 95: $letra = "CQ"; break;
			case 96: $letra = "CR"; break;
			case 97: $letra = "CS"; break;
			case 98: $letra = "CT"; break;
			case 99: $letra = "CU"; break;
			case 100: $letra = "CV"; break;
			case 101: $letra = "CW"; break;
			case 102: $letra = "CX"; break;
			case 103: $letra = "CY"; break;
			case 104: $letra = "CZ"; break;
			case 105: $letra = "DA"; break;
			case 106: $letra = "DB"; break;
			case 107: $letra = "DC"; break;
			case 108: $letra = "DD"; break;
			case 109: $letra = "DE"; break;
			case 110: $letra = "DF"; break;
			case 111: $letra = "DG"; break;
			case 112: $letra = "DH"; break;
			case 113: $letra = "DI"; break;
			case 114: $letra = "DJ"; break;
			case 115: $letra = "DK"; break;
			case 116: $letra = "DL"; break;
			case 117: $letra = "DM"; break;
			case 118: $letra = "DN"; break;
			case 119: $letra = "DO"; break;
			case 120: $letra = "DP"; break;
			case 121: $letra = "DQ"; break;
			case 122: $letra = "DR"; break;
			case 123: $letra = "DS"; break;
			case 124: $letra = "DT"; break;
			case 125: $letra = "DU"; break;
			case 126: $letra = "DV"; break;
			case 127: $letra = "DW"; break;
			case 128: $letra = "DX"; break;
			case 129: $letra = "DY"; break;
			case 130: $letra = "DZ"; break;
			case 131: $letra = "EA"; break;
			case 132: $letra = "EB"; break;
			case 133: $letra = "EC"; break;
			case 134: $letra = "ED"; break;
			case 135: $letra = "EE"; break;
			case 136: $letra = "EF"; break;
			case 137: $letra = "EG"; break;
			case 138: $letra = "EH"; break;
			case 139: $letra = "EI"; break;
			case 140: $letra = "EJ"; break;
			case 141: $letra = "EK"; break;
			case 142: $letra = "EL"; break;
			case 143: $letra = "EM"; break;
			case 144: $letra = "EN"; break;
			case 145: $letra = "EO"; break;
			case 146: $letra = "EP"; break;
			case 147: $letra = "EQ"; break;
			case 148: $letra = "ER"; break;
			case 149: $letra = "ES"; break;
			case 150: $letra = "ET"; break;
			case 151: $letra = "EU"; break;
			case 152: $letra = "EV"; break;
			case 153: $letra = "EW"; break;
			case 154: $letra = "EX"; break;
			case 155: $letra = "EY"; break;
			case 156: $letra = "EZ"; break;
			case 157: $letra = "FA"; break;
			case 158: $letra = "FB"; break;
			case 159: $letra = "FC"; break;
			case 160: $letra = "FD"; break;
			case 161: $letra = "FE"; break;
			case 162: $letra = "FF"; break;
			case 163: $letra = "FG"; break;
			case 164: $letra = "FH"; break;
			case 165: $letra = "FI"; break;
			case 166: $letra = "FJ"; break;
			case 167: $letra = "FK"; break;
			case 168: $letra = "FL"; break;
			case 169: $letra = "FM"; break;
			case 170: $letra = "FN"; break;
			case 171: $letra = "FO"; break;
			case 172: $letra = "FP"; break;
			case 173: $letra = "FQ"; break;
			case 174: $letra = "FR"; break;
			case 175: $letra = "FS"; break;
			case 176: $letra = "FT"; break;
			case 177: $letra = "FU"; break;
			case 178: $letra = "FV"; break;
			case 179: $letra = "FW"; break;
			case 180: $letra = "FX"; break;
			case 181: $letra = "FY"; break;
			case 182: $letra = "FZ"; break;
			
			default: $letra = "Ninguna"; break;
		}
		return $letra;
	}

?>