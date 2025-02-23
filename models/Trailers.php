<?php
include '../application/Conexion.php';
require_once '../application/Config.php';
session_start();

class Trailers
{
	public $user_log;
	public $pass;
	public $mensaje;
	public $respuesta;
	public $email;
	public $listado;

	public function CrearTrailer()
	{
		$_msg_error = "";
		// $return["control"] = "";
		$Data = new Consultas;
		$model    = new Conexion;
		$conexion = $model->conectar();

		if (empty($_POST["placa_trailer"])) {
			$placa_trailer = '';
		} else {
			if (isset($_POST["placa_trailer"])) {
				$placa_trailer = $_POST["placa_trailer"];
			} else {
				$placa_trailer = '';
			}
			if (isset($_POST["T_marca"])) {
				$marca_trailer = $_POST["T_marca"];
			} else {
				$marca_trailer = '';
			}
			if (isset($_POST["T_peso"])) {
				$peso_trailer = $_POST["T_peso"];
			} else {
				$peso_trailer = '';
			}
			if (isset($_POST["T_alto"])) {
				$alto_trailer = $_POST["T_alto"];
			} else {
				$alto_trailer = '';
			}
			if (isset($_POST["T_volumen"])) {
				$volumen_trailer = $_POST["T_volumen"];
			} else {
				$volumen_trailer = '';
			}

			if (isset($_POST["T_tramite"])) {
				$tramite_trailer = $_POST["T_tramite"];
			} else {
				$tramite_trailer = '';
			}
			if (isset($_POST["T_chasis"])) {
				$chasis_trailer = $_POST["T_chasis"];
			} else {
				$chasis_trailer = '';
			}
			if (isset($_POST["T_configuracion"])) {
				$config_trailer = $_POST["T_configuracion"];
			} else {
				$config_trailer = '';
			}
			if (isset($_POST["T_modelo"])) {
				$modelo_trailer = $_POST["T_modelo"];
			} else {
				$modelo_trailer = '';
			}
			if (isset($_POST["T_ancho"])) {
				$ancho_trailer = $_POST["T_ancho"];
			} else {
				$ancho_trailer = '';
			}
			if (isset($_POST["T_largo"])) {
				$largo_trailer = $_POST["T_largo"];
			} else {
				$largo_trailer = '';
			}
			if (isset($_POST["T_capacidad"])) {
				$capacidad_trailer = $_POST["T_capacidad"];
			} else {
				$capacidad_trailer = '';
			}
			if (isset($_POST["T_carroceria"])) {
				$carroceria_trailer = $_POST["T_carroceria"];
			} else {
				$carroceria_trailer = '';
			}
			if (isset($_POST["T_caracteristicas"])) {
				$carac_trailer = $_POST["T_caracteristicas"];
			} else {
				$carac_trailer = '';
			}
			if (isset($_POST["T_propietario"])) {
				$propietario_trailer = $_POST["T_propietario"];
			} else {
				$propietario_trailer = '';
			}
			if (isset($_POST["T_civil"])) {
				$civil_trailer = $_POST["T_civil"];
			} else {
				$civil_trailer = '';
			}
			if (isset($_POST["T_aseguradora"])) {
				$asegura_trailer = $_POST["T_aseguradora"];
			} else {
				$asegura_trailer = '';
			}
			if (isset($_POST["T_fechavence"])) {
				$vence_trailer = $_POST["T_fechavence"];
			} else {
				$vence_trailer = '';
			}

			if (isset($_POST["name_foto"])) {
				$name_foto = $_POST["name_foto"];
			} else {
				$name_foto = '';
			}

			if (isset($_POST["Tlicen"])) {
				$nlicen = $_POST["Tlicen"];
			} else {
				$nlicen = '';
			}

			if (isset($_POST["name_licen"])) {
				$name_licen = $_POST["name_licen"];
			} else {
				$name_licen = '';
			}

			if (isset($_POST["T_poseedor"])) {
				$poseedor_trailer = $_POST["T_poseedor"];
			} else {
				$poseedor_trailer = '';
			}

			$estado = 'Activo';
			$fecha = date('Y-m-d');
			$hora = date('G:i:s');
			$id_usuario = $_SESSION["usuario"]["id_usuario"];
			$operacion = 'Crear';
		}
		$sql = "
					INSERT INTO cmx_trailer(id,
					placa,
					marca,
					peso_vacio,
					alto,
					volumen,
					tipo_tramite,
					serie_chasis,
					configuracion,
					modelo,
					ancho,
					largo,
					capacidad,
					carroceria,
					caracteristica,
					numero_civil,
					aseguradora,
					fecha_vence,
					doc_propietario,
					estado,
					estado_solicitud,
					n_licencia,
					doc_poseedor)
					VALUES(NULL,
					'$placa_trailer',
					'$marca_trailer',
					'$peso_trailer',
					'$alto_trailer',
					'$volumen_trailer',
					'$tramite_trailer',
					'$chasis_trailer',
					'$config_trailer',
					'$modelo_trailer',
					'$ancho_trailer',
					'$largo_trailer',
					'$capacidad_trailer',
					'$carroceria_trailer',
					'$carac_trailer',
					'$civil_trailer',
					'$asegura_trailer',
					'$vence_trailer',
					'$propietario_trailer',
					'$estado',
					'Disponible',
					'$nlicen',
					'$poseedor_trailer')";

		// echo $sql;
		$crear_trailer = $conexion->prepare($sql);
		$result = $crear_trailer->execute();

		$sqlmax = "SELECT MAX(id) as 'id' FROM cmx_trailer";
		$consulta_maxid = $conexion->prepare($sqlmax);
		$consulta_maxid->execute();
		$datos_trailer = $consulta_maxid->fetch();
		$id_trailer = $datos_trailer["id"];


		//INSERTAR FOTO DE LICENCIA DE TRAILER
		$ruta_liceni = "../public/files/vehiculos/trailer/" . $id_trailer . "/LI/";
		$ruta_base_l = "public/files/vehiculos/trailer/" . $id_trailer . "/LI/";
		$sqltl = "UPDATE cmx_trailer
					SET foto_licencia = '$ruta_base_l',
					 name_licencia='$name_licen'
					WHERE id = " . $id_trailer . "";
		$consulta_trailer = $conexion->prepare($sqltl);
		$consulta_trailer->execute();
		if (!file_exists($ruta_liceni)) {
			mkdir($ruta_liceni, 0777, true);
		}
		for ($n = 0; $n < count($_FILES); $n++) {
			if (isset($_FILES["foto_licencia" . $n])) {
				$file = $_FILES["foto_licencia" . $n];
				$nombre = $file["name"];
				$tipo = $file["type"];
				$ruta_provisional = $file["tmp_name"];
				$carpeta = $ruta_liceni;
				$src = $carpeta . $nombre;
				move_uploaded_file($ruta_provisional, $src);
			}
		}

		//INSERTAR FOTOS DEL TRAILER
		$ruta_trailer = "../public/files/vehiculos/trailer/" . $id_trailer . "/";
		$ruta_base_t = "public/files/vehiculos/trailer/" . $id_trailer . "/";
		$sqlt = "UPDATE cmx_trailer
					SET foto_trailer = '$ruta_base_t',
					 n_docu_trailer='$name_foto'
					WHERE id = " . $id_trailer . "";
		$consulta_trailer = $conexion->prepare($sqlt);
		$consulta_trailer->execute();
		if (!file_exists($ruta_trailer)) {
			mkdir($ruta_trailer, 0777, true);
		}
		for ($m = 0; $m < count($_FILES); $m++) {
			if (isset($_FILES["foto_trailer" . $m])) {
				$file = $_FILES["foto_trailer" . $m];
				$nombre = $file["name"];
				$tipo = $file["type"];
				$ruta_provisional = $file["tmp_name"];
				$carpeta = $ruta_trailer;
				$src = $carpeta . $nombre;
				move_uploaded_file($ruta_provisional, $src);
			}
		}

		if ($result) {
			//LOG DEL TRAILER
			$sql = "INSERT INTO cmx_log_trailers (id, id_trailer, id_usuario, operacion, fecha, hora)VALUES(NULL,' $id_trailer','$id_usuario','$operacion','$fecha','$hora');";
			// echo $sql;
			$crear_trailer = $conexion->prepare($sql);
			$result_log = $crear_trailer->execute();
		}

		if ($result && $result_log) {
			$return["success"] = true;
			$_msg_error = "";
		} else {
			$return["success"] = false;
			$_msg_error = "Error";
		}
		// }
		$return["error"] = $_msg_error;
		return $return;
	}

	public function EditarTrailer()
	{
		// echo "entro a editar";
		$_msg_error = "";
		$return["control"] = "";
		$Data = new Consultas;
		// /DATOS DEL TRAILER
		$placat = $_POST["eplaca_trailer"];
		if ($placat != '') {
			$placat = $_POST["eplaca_trailer"];
			$emarca = $_POST["emarca"];
			$epeso = $_POST["epeso"];
			$ealto = $_POST["ealto"];
			$evolumen = $_POST["evolumen"];
			$etramite = $_POST["etramite"];
			$echasis = $_POST["echasis"];
			$econfiguracion = $_POST["econfiguracion"];
			$emodelo = $_POST["emodelo"];
			$eancho = $_POST["eancho"];
			$elargo = $_POST["elargo"];
			$ecapacidad = $_POST["ecapacidad"];
			$ecarroceria = $_POST["ecarroceria"];
			$ecaracteristicas = $_POST["ecaracteristicas"];
			$epropietario = $_POST["epropietario"];
			$ecivil = $_POST["ecivil"];
			$easeguradora = $_POST["easeguradora"];
			$efechavence = $_POST["efechavence"];
			$idtrailer = $_POST["e_id"];
			$estado = $_POST["estado"];
			$id_usuario = $_SESSION["usuario"]["id_usuario"];
			$fecha = date('Y-m-d');
			$hora = date('G:i:s');
			$e_licencia = $_POST["e_licencia"];
			$eposeedor = $_POST["eposeedor"];

			if (isset($_POST["namenew"])) {
				$namenew = $_POST["namenew"];
			} else {
				$namenew = '';
			}

			if (isset($_POST["namenlic"])) {
				$namenlic = $_POST["namenlic"];
			} else {
				$namenlic = $_POST["namenlic"];
			}
		}
		$model    = new Conexion;
		$conexion = $model->conectar();

		// 	if(isset($_POST["e_ruta_trailer"]) ){
		// 	$rutat="../".$_POST["e_ruta_trailer"];
		// }else{
		// 	$foto_traile= "public/files/vehiculos/trailer/$id_vehiculo/";
		// 	$rutat= "../" . $foto_traile;
		// }
		// if (!file_exists($rutat)) {
		//        mkdir($rutat, 0777, true);
		//   	}
		//   	for ($m=0; $m< count($_FILES); $m++){
		//    if(isset($_FILES["e_foto_trailer".$m])){
		//        $file = $_FILES["e_foto_trailer".$m];
		//        $nombre = $file["name"];
		//        $tipo = $file["type"];
		//        $ruta_provisional = $file["tmp_name"];
		//        $carpeta=$rutat;
		//        $src=$carpeta.$nombre;
		//        move_uploaded_file($ruta_provisional, $src);
		//    	}
		// }

		//editar el trailer 
		$sql = "
					UPDATE cmx_trailer
					SET placa='" . $placat . "',
						marca='" . $emarca . "',
						peso_vacio='" . $epeso . "',
						alto='" . $ealto . "',
						volumen='" . $evolumen . "',
						tipo_tramite='" . $etramite . "',
						serie_chasis='" . $echasis . "',
						configuracion='" . $econfiguracion . "',
						modelo='" . $emodelo . "',
						ancho='" . $eancho . "',
						largo='" . $elargo . "',
						capacidad='" . $ecapacidad . "',
						carroceria='" . $ecarroceria . "',
						caracteristica='" . $ecaracteristicas . "',
						numero_civil='" . $ecivil . "',
						aseguradora='" . $easeguradora . "',
						fecha_vence='" . $efechavence . "',
						doc_propietario='" . $epropietario . "',
						estado='" . $estado . "',
						n_licencia='" . $e_licencia . "',
						doc_poseedor='" . $eposeedor . "'
					WHERE id=" . $idtrailer . "
					";
		// echo $sql;
		$editartrailer = $conexion->prepare($sql);
		$result = $editartrailer->execute();

		if ($result) {

			$rutatr = "../public/files/vehiculos/trailer/" . $idtrailer . "/";
			$rutatr2 = "public/files/vehiculos/trailer/" . $idtrailer . "/";

			if (file_exists($rutatr)) {
				if (file_exists($rutatr) && $namenew != '') {
					$aleatorio1 = rand(10000, 90000);
					$aleatorio2 = rand(10000, 90000);
					$name = $aleatorio1 . $namenew . $aleatorio2;

					$sqlu = "UPDATE cmx_trailer
										SET foto_trailer='" . $rutatr2 . "',
										n_docu_trailer='" . $name . "'
										WHERE id=" . $idtrailer . "  ";

					//echo $sqlu;		
					$editizquierda = $conexion->prepare($sqlu);
					$result = $editizquierda->execute();

					//trasladar el archivo
					for ($m = 0; $m < count($_FILES); $m++) {
						if (isset($_FILES["e_foto_trailer" . $m])) {
							$file = $_FILES["e_foto_trailer" . $m];
							$nombre = $aleatorio1 . $file["name"] . $aleatorio2;
							$tipo = $file["type"];
							$ruta_provisional = $file["tmp_name"];
							$carpeta = $rutatr;
							$src = $carpeta . $nombre;
							move_uploaded_file($ruta_provisional, $src);
						}
					}
				}
			} else {
				mkdir($rutatr, 0777, true);
				if (file_exists($rutatr) && $namenew != '') {
					$aleatorio1 = rand(10000, 90000);
					$aleatorio2 = rand(10000, 90000);
					$name = $aleatorio1 . $namenew . $aleatorio2;

					$sqlu = "UPDATE cmx_trailer
										SET foto_trailer='" . $rutatr2 . "',
										n_docu_trailer='" . $name . "'
										WHERE id=" . $idtrailer . "  ";

					//echo $sqlu;		
					$editizquierda = $conexion->prepare($sqlu);
					$result = $editizquierda->execute();

					//trasladar el archivo
					for ($m = 0; $m < count($_FILES); $m++) {
						if (isset($_FILES["e_foto_trailer" . $m])) {
							$file = $_FILES["e_foto_trailer" . $m];
							$nombre = $aleatorio1 . $file["name"] . $aleatorio2;
							$tipo = $file["type"];
							$ruta_provisional = $file["tmp_name"];
							$carpeta = $rutatr;
							$src = $carpeta . $nombre;
							move_uploaded_file($ruta_provisional, $src);
						}
					}
				}
			}


			$rutali = "../public/files/vehiculos/trailer/" . $idtrailer . "/LI/";
			$rutali2 = "public/files/vehiculos/trailer/" . $idtrailer . "/LI/";

			if (file_exists($rutali)) {
				if (file_exists($rutali) && $namenlic != '') {
					$aleatorio1 = rand(10000, 90000);
					$aleatorio2 = rand(10000, 90000);
					$name = $aleatorio1 . $namenlic;

					$sqlu = "UPDATE cmx_trailer
										SET foto_licencia='" . $rutali2 . "',
										name_licencia='" . $name . "'
										WHERE id=" . $idtrailer . "  ";

					//echo $sqlu;		
					$editizquierda = $conexion->prepare($sqlu);
					$result = $editizquierda->execute();

					//trasladar el archivo
					for ($y = 0; $y < count($_FILES); $y++) {
						if (isset($_FILES["e_foto_licencia" . $y])) {
							$file = $_FILES["e_foto_licencia" . $y];
							$nombre = $aleatorio1 . $file["name"];
							$tipo = $file["type"];
							$ruta_provisional = $file["tmp_name"];
							$carpeta = $rutali;
							$src = $carpeta . $nombre;
							move_uploaded_file($ruta_provisional, $src);
						}
					}
				}
			} else {
				mkdir($rutali, 0777, true);
				if (file_exists($rutali) && $namenlic != '') {
					$aleatorio1 = rand(10000, 90000);
					$aleatorio2 = rand(10000, 90000);
					$name = $aleatorio1 . $namenlic;

					$sqlu = "UPDATE cmx_trailer
										SET foto_licencia='" . $rutali2 . "',
										name_licencia='" . $name . "'
										WHERE id=" . $idtrailer . "  ";

					//echo $sqlu;		
					$editizquierda = $conexion->prepare($sqlu);
					$result = $editizquierda->execute();

					//trasladar el archivo
					for ($y = 0; $y < count($_FILES); $y++) {
						if (isset($_FILES["e_foto_licencia" . $y])) {
							$file = $_FILES["e_foto_licencia" . $y];
							$nombre = $aleatorio1 . $file["name"];
							$tipo = $file["type"];
							$ruta_provisional = $file["tmp_name"];
							$carpeta = $rutali;
							$src = $carpeta . $nombre;
							move_uploaded_file($ruta_provisional, $src);
						}
					}
				}
			}
			//crear el log 
			$sql = "
						INSERT INTO cmx_log_trailers
						(id,id_trailer,id_usuario,
						operacion,fecha,hora)
						VALUES(NULL," . $idtrailer . "," . $id_usuario . ",'Editar','" . $fecha . "','" . $hora . "');
					";
			$editarlog = $conexion->prepare($sql);
			$result_log = $editarlog->execute();

			$sql_transaccion = "INSERT INTO web_service_RNDC
					(id,codigo_proceso,tipo,estado_envio_rndc,estado,fecha,hora,usuario,accion)
					VALUES(null,'" . $placat . "','Trailer',0,1,'" . $fecha . "','" . $hora . "','" . $id_usuario . "','Actualizar')";
			$registra_transaccion = $conexion->prepare($sql_transaccion);
			$result_transac = $registra_transaccion->execute();
		}

		if ($result && $result_log && $result_transac) {
			$return["success"] = true;
			$_msg_error = "";
		} else {
			$return["success"] = false;
			$_msg_error = "Error";
		}
		$return["error"] = $_msg_error;
		return $return;
	}
}
