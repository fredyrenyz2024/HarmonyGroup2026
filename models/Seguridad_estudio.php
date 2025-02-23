<?php
include '../application/Conexion.php';
require_once '../application/Config.php';

session_start();
class Seguridad_estudio
{
	public $user_log;
	public $pass;
	public $mensaje;
	public $respuesta;
	public $email;
	public $listado;

	public function iniciostudy()
	{
		// $idestudio=$_POST["idestudio"];
		$solicitud = $_POST["solicitud"];
		$fecha = $_POST["fecha"];
		$hora = $_POST["hora"];
		$user = $_POST["user"];
		$vehiculo = $_POST["vehiculo"];
		$conductor = $_POST["conductor"];
		$estado = 'iniciado';
		$Data = new Consultas;
		$model    = new Conexion;
		$conexion = $model->conectar();

		//registar en cabcera
		$sql = "INSERT INTO cmx_estudio_vehiculo
	        		(id,id_solicitud,usuario,fecha,hora)
	        		VALUES(null,'$solicitud','$user','$fecha','$hora')";
		$crear_inicio = $conexion->prepare($sql);
		$result = $crear_inicio->execute();
		//traer el valor maximo del estudio
		$sqlm = "SELECT max(id) as 'id' FROM cmx_estudio_vehiculo";
		$consulta_solic_vehic = $conexion->prepare($sqlm);
		$consulta_solic_vehic->execute();
		$datos_proveedor = $consulta_solic_vehic->fetch();
		$id_estudio = $datos_proveedor["id"];

		//registrar en completo
		$sql2 = "INSERT INTO cmx_estudiov_completo(id,id_estudio,estado,id_vehiculo,id_conductor,estado_actu)
				VALUES(null,'$id_estudio','$estado','$vehiculo','$conductor',1)
			";
		// echo $sql2;
		$crear_completo = $conexion->prepare($sql2);
		$result = $crear_completo->execute();

		$sqlm = "SELECT id  AS 'id' FROM cmx_estudiov_completo 
					WHERE id_estudio='$id_estudio' AND id_vehiculo='$vehiculo'
					AND id_conductor='$conductor'   ";
		$consulta_solic_vehic = $conexion->prepare($sqlm);
		$consulta_solic_vehic->execute();
		$datos_proveedor = $consulta_solic_vehic->fetch();
		$idc = $datos_proveedor["id"];

		if ($id_estudio) {
			$sql3 = "
				INSERT INTO cmx_logestudio_com
				(id,id_completo,id_estudio,fecha,hora,id_usuario,estado)
				VALUES(null,$idc,$id_estudio,'$fecha','$hora','$user','Crear'); ";
			$crear_ecompleto = $conexion->prepare($sql3);
			$result = $crear_ecompleto->execute();
		}
		$return["success"] = true;
		return $return;
	}


	public function verVehiculo()
	{
		// echo 'entro a ver vehiculo';
		$id_vehiculo = $_POST["id_vehiculo"];
		$id_conductor = $_POST["id_conductor"];
		$_msg_error = "";
		$Data = new Consultas;
		$sql = "
				SELECT * FROM cmx_vehiculos v
				INNER JOIN cmx_proveedores p
				ON v.id_conductor=p.id
				WHERE v.id=" . $id_vehiculo . " AND p.id=" . $id_conductor . "
			";
		$model    = new Conexion;
		$conexion = $model->conectar();
		$consulta = $conexion->prepare($sql);
		$consulta->execute();
		$total = $consulta->rowCount();
		if ($total == 0) {
			$return["success"] = false;
		} else {
			$return["success"] = true;
			$datos_asig = $consulta->fetch();
			$return["content"] = $datos_asig;
		}
		return $return;
	}
	//HOJA DE VIDA DEL VEHICULO
	public function aprobarHVvehiculo()
	{
		//echo 'HOLA HOLA HOLA';
		$fecha = $_POST["fecha"];
		$hora = $_POST["hora"];
		$usuario = $_POST["user"];
		$id_vehiculo = $_POST["id_vehiculo"];
		$id_conductor = $_POST["id_conductor"];
		$idsoli = $_POST["idsoli"];
		$idtipo = $_POST["idtipo"];

		if ($_POST["observeheciulo"]) {
			$obser_vehiculo = $_POST["observeheciulo"];
		} else {
			$obser_vehiculo = '';
		}
		$aprobo = '1';
		$model    = new Conexion;
		$conexion = $model->conectar();
		//traer el numero de la aprobacion
		$sqlm = "SELECT id  AS 'id' FROM cmx_estudio_vehiculo 
					WHERE id_solicitud='$idsoli'  ";
		$consulta_solic_vehic = $conexion->prepare($sqlm);
		$consulta_solic_vehic->execute();
		$datos_proveedor = $consulta_solic_vehic->fetch();
		$id_estudio = $datos_proveedor["id"];

		$sql2 = "SELECT * FROM cmx_aprobacion_estudio
				WHERE estudio='hoja de vida vehiculo' 
				AND id_vehiculo=" . $id_vehiculo . " 
				 AND id_conductor=" . $id_conductor . "   
				 AND id_estudio=" . $id_estudio . "
				 AND activo=1";

		$consulta_aprobac = $conexion->prepare($sql2);
		$consulta_aprobac->execute();
		$total  = $consulta_aprobac->rowCount();
		if ($total == 0) {
			//aprobacion estudio
			$sql = "INSERT INTO cmx_aprobacion_estudio(id,id_vehiculo,id_conductor,estudio,id_tipo,estado,observacion,id_estudio,fecha,hora,usuario,activo)
					VALUES(null,$id_vehiculo,$id_conductor,'hoja de vida vehiculo','$idtipo',$aprobo,'$obser_vehiculo',$id_estudio,'$fecha','$hora','$usuario','1')";
			//echo $sql;
			$crear_solicitud = $conexion->prepare($sql);
			$result = $crear_solicitud->execute();
		} else {
			//cambiar anteriores a 0 e insertar en 1
			$sql3 = "UPDATE cmx_aprobacion_estudio
					SET activo='0'
					WHERE  
					 estudio='hoja de vida vehiculo'  AND
					id_vehiculo=" . $id_vehiculo . "  AND
					id_conductor=" . $id_conductor . " AND 
					id_estudio=" . $id_estudio . "";
			$crear_update = $conexion->prepare($sql3);
			$result = $crear_update->execute();
			if ($result) {
				$sql = "INSERT INTO cmx_aprobacion_estudio(id,id_vehiculo,id_conductor,estudio,id_tipo,estado,observacion,id_estudio,fecha,hora,usuario,activo)
					VALUES(null,$id_vehiculo,$id_conductor,'hoja de vida vehiculo','$idtipo',$aprobo,'$obser_vehiculo',$id_estudio,'$fecha','$hora','$usuario','1')";
				//echo $sql;
				$crear_solicitud = $conexion->prepare($sql);
				$result = $crear_solicitud->execute();
			}
		}

		$return["success"] = true;
		return $return;
	}

	public function desaprobarHVvehiculo()
	{
		// echo 'entro desaprobar hv';
		$fecha = $_POST["fecha"];
		$hora = $_POST["hora"];
		$usuario = $_POST["user"];
		$id_vehiculo = $_POST["id_vehiculo"];
		$id_conductor = $_POST["id_conductor"];
		$id_soli = $_POST["idsoli"];
		$idtipo = $_POST["idtipo"];

		$aprobo = '0';
		if ($_POST["observeheciulo"]) {
			$obser_vehiculo = $_POST["observeheciulo"];
		} else {
			$obser_vehiculo = '';
		}
		$model    = new Conexion;
		$conexion = $model->conectar();

		//traer el numero de la aprobacion
		$sqlm = "SELECT id as 'id' 
			 		FROM cmx_estudio_vehiculo
			 		WHERE id_solicitud='$id_soli'  ";
		$consulta_solic_vehic = $conexion->prepare($sqlm);
		$consulta_solic_vehic->execute();
		$datos_proveedor = $consulta_solic_vehic->fetch();
		$id_estudio = $datos_proveedor["id"];

		$sql2 = "SELECT * FROM cmx_aprobacion_estudio
					WHERE estudio='hoja de vida vehiculo' 
					AND id_vehiculo=" . $id_vehiculo . " 
					 AND id_conductor=" . $id_conductor . "   
					 AND id_estudio=" . $id_estudio . "
					 AND activo=1";
		$consulta_aprobac = $conexion->prepare($sql2);
		$consulta_aprobac->execute();
		$total  = $consulta_aprobac->rowCount();
		if ($total == 0) {
			$sql = "INSERT INTO cmx_aprobacion_estudio(id,id_vehiculo,id_conductor,estudio,id_tipo,observacion,estado,id_estudio,fecha,hora,usuario,activo)
				VALUES(null,$id_vehiculo,$id_conductor,'hoja de vida vehiculo','$idtipo','$obser_vehiculo',$aprobo,$id_estudio,'$fecha','$hora','$usuario','1')";
			// echo $sql;
			$crear_aprobacion = $conexion->prepare($sql);
			$result = $crear_aprobacion->execute();
		} else {
			//cambiar anteriores a 0 e insertar en 1
			$sql3 = "UPDATE cmx_aprobacion_estudio
					SET activo='0'
					WHERE  
					estudio='hoja de vida vehiculo' AND 
					id_vehiculo=" . $id_vehiculo . "  AND
					id_conductor=" . $id_conductor . " AND 
					id_estudio=" . $id_estudio . "";
			$crear_update = $conexion->prepare($sql3);
			$result = $crear_update->execute();
			if ($result) {
				$sql = "INSERT INTO cmx_aprobacion_estudio(id,id_vehiculo,id_conductor,estudio,id_tipo,observacion,estado,id_estudio,fecha,hora,usuario,activo)
					VALUES(null,$id_vehiculo,$id_conductor,'hoja de vida vehiculo','$idtipo','$obser_vehiculo',$aprobo,$id_estudio,'$fecha','$hora','$usuario','1')";
				// echo $sql;
				$crear_aprobacion = $conexion->prepare($sql);
				$result = $crear_aprobacion->execute();
			}
		}

		$return["success"] = true;
		return $return;
	}
	//HOJA DE VIDA DEL CONDUCTOR
	public function aprobarhvconductor()
	{
		//echo 'aprobar hoja de vida del conductor';
		$fecha = $_POST["fech"];
		$hora = $_POST["hor"];
		$usuario = $_POST["usuari"];
		$id_vehiculo = $_POST["id_vehiculo"];
		$id_conductor = $_POST["id_conductor"];
		$idsoli = $_POST["idsoli"];
		$idtipo = $_POST["idtipo"];

		if ($_POST["obse_condu"]) {
			$obse_condu = $_POST["obse_condu"];
		} else {
			$obse_condu = '';
		}

		$aprobo = '1';
		$model    = new Conexion;
		$conexion = $model->conectar();

		//traer el numero de la aprobacion
		$sqlm = "SELECT max(id) as 'id' 
			 		FROM cmx_estudio_vehiculo
			 		WHERE id_solicitud='$idsoli'  ";
		$consulta_solic_vehic = $conexion->prepare($sqlm);
		$consulta_solic_vehic->execute();
		$datos_proveedor = $consulta_solic_vehic->fetch();
		$id_estudio = $datos_proveedor["id"];

		$sql2 = "SELECT * FROM cmx_aprobacion_estudio
				WHERE estudio='hoja de vida conductor' 
				AND id_vehiculo=" . $id_vehiculo . " 
				 AND id_conductor=" . $id_conductor . "   
				 AND id_estudio=" . $id_estudio . "
				 AND activo=1";
		$consulta_aprobac = $conexion->prepare($sql2);
		$consulta_aprobac->execute();
		$total  = $consulta_aprobac->rowCount();
		if ($total == 0) {
			//insertar aprobacion 
			$sql = "INSERT INTO cmx_aprobacion_estudio(id,id_vehiculo,id_conductor,estudio,id_tipo,observacion,estado,id_estudio,fecha,hora,usuario,activo)
					VALUES(null,$id_vehiculo,$id_conductor,'hoja de vida conductor','$idtipo','$obse_condu',$aprobo,$id_estudio,'$fecha','$hora','$usuario','1')";
			$crear_aprobacion = $conexion->prepare($sql);
			$result = $crear_aprobacion->execute();
		} else {
			//dejar los demas en cero e insertar 
			$sql3 = "UPDATE cmx_aprobacion_estudio
					SET activo='0'
					WHERE  
					estudio='hoja de vida conductor' AND 
					id_vehiculo=" . $id_vehiculo . "  AND
					id_conductor=" . $id_conductor . " AND 
					id_estudio=" . $id_estudio . "";
			$crear_update = $conexion->prepare($sql3);
			$result = $crear_update->execute();
			if ($result) {
				//insertar aprobacion 
				$sql = "INSERT INTO cmx_aprobacion_estudio(id,id_vehiculo,id_conductor,estudio,id_tipo,observacion,estado,id_estudio,fecha,hora,usuario,activo)
					VALUES(null,$id_vehiculo,$id_conductor,'hoja de vida conductor','$idtipo','$obse_condu',$aprobo,$id_estudio,'$fecha','$hora','$usuario','1')";
				$crear_aprobacion = $conexion->prepare($sql);
				$result = $crear_aprobacion->execute();
			}
		}

		$return["success"] = true;
		return $return;
	}

	public function desaprobarhvconductor()
	{
		$fecha = $_POST["fecha"];
		$hora = $_POST["hora"];
		$usuario = $_POST["usuario"];
		$id_vehiculo = $_POST["id_vehiculo"];
		$id_conductor = $_POST["id_conductor"];
		$aprobo = '0';
		$idsoli = $_POST["idsoli"];
		$idtipo = $_POST["idtipo"];


		if ($_POST["obse_condu"]) {
			$obse_condu = $_POST["obse_condu"];
		} else {
			$obse_condu = '';
		}
		$model    = new Conexion;
		$conexion = $model->conectar();

		//traer el numero de la aprobacion
		$sqlm = "SELECT id as 'id' 
			 		FROM cmx_estudio_vehiculo
					WHERE id_solicitud='$idsoli' ";
		$consulta_solic_vehic = $conexion->prepare($sqlm);
		$consulta_solic_vehic->execute();
		$datos_proveedor = $consulta_solic_vehic->fetch();
		$id_estudio = $datos_proveedor["id"];

		$sql2 = "SELECT * FROM cmx_aprobacion_estudio
				WHERE estudio='hoja de vida conductor' 
				AND id_vehiculo=" . $id_vehiculo . " 
				 AND id_conductor=" . $id_conductor . "   
				 AND id_estudio=" . $id_estudio . "
				 AND activo=1";
		$consulta_aprobac = $conexion->prepare($sql2);
		$consulta_aprobac->execute();
		$total  = $consulta_aprobac->rowCount();
		if ($total == 0) {
			$sql = "INSERT INTO cmx_aprobacion_estudio(id,id_vehiculo,id_conductor,estudio,id_tipo,observacion,estado,id_estudio,fecha,hora,usuario,activo)
					VALUES(null,$id_vehiculo,$id_conductor,'hoja de vida conductor','$idtipo','$obse_condu',$aprobo,$id_estudio,'$fecha','$hora','$usuario','1')";
			$crear_aprobacion = $conexion->prepare($sql);
			$result = $crear_aprobacion->execute();
		} else {
			//dejar los demas en cero e insertar 
			$sql3 = "UPDATE cmx_aprobacion_estudio
					SET activo='0'
					WHERE  
					estudio='hoja de vida conductor' AND 
					id_vehiculo=" . $id_vehiculo . "  AND
					id_conductor=" . $id_conductor . " AND 
					id_estudio=" . $id_estudio . "";
			$crear_update = $conexion->prepare($sql3);
			$result = $crear_update->execute();
			if ($result) {
				$sql = "INSERT INTO cmx_aprobacion_estudio(id,id_vehiculo,id_conductor,estudio,id_tipo,observacion,estado,id_estudio,fecha,hora,usuario,activo)
					VALUES(null,$id_vehiculo,$id_conductor,'hoja de vida conductor','$idtipo','$obse_condu',$aprobo,$id_estudio,'$fecha','$hora','$usuario','1')";
				$crear_aprobacion = $conexion->prepare($sql);
				$result = $crear_aprobacion->execute();
			}
		}
		$return["success"] = true;
		return $return;
	}

	public function aprobar_risk()
	{
		// echo 'ENTRO A RISK';
		$fecha = $_POST["fecha"];
		$hora = $_POST["hora"];
		$usuario = $_POST["usuario"];
		$id_vehiculo = $_POST["id_vehiculo"];
		$id_conductor = $_POST["id_conductor"];
		$estudio = $_POST["tipo_estudio"];
		$idsoli = $_POST["idsoli"];
		$aleatorio1 = rand(10000, 90000);
		$aleatorio2 = rand(10000, 90000);
		$ruta_eviden = $_POST["ruta_eviden"];
		$idtipo = $_POST["idtipo"];


		if ($_POST["obse_todo"]) {
			$obse_todo = $_POST["obse_todo"];
		} else {
			$obse_todo = '';
		}

		if ($_POST["name_eviden"]) {
			$name_eviden = $aleatorio1 . $_POST["name_eviden"] . $aleatorio2;
		} else {
			$name_eviden = '';
		}


		$aprobo = '1';
		$model    = new Conexion;
		$conexion = $model->conectar();
		$sqlm = "SELECT id as 'id' 
					FROM cmx_estudio_vehiculo
					WHERE id_solicitud='$idsoli'  ";
		$consulta_solic_vehic = $conexion->prepare($sqlm);
		$consulta_solic_vehic->execute();
		$datos_proveedor = $consulta_solic_vehic->fetch();
		$id_estudio = $datos_proveedor["id"];

		$miruta = '../' . $ruta_eviden . '/' . $id_estudio . '/';
		$miruta2 = $ruta_eviden . '/' . $id_estudio . '/';


		$sql2 = "SELECT * FROM cmx_aprobacion_estudio
				WHERE estudio='" . $estudio . "' 
				AND id_vehiculo=" . $id_vehiculo . " 
				 AND id_conductor=" . $id_conductor . "   
				 AND id_estudio=" . $id_estudio . "
				 AND activo=1";
		$consulta_aprobac = $conexion->prepare($sql2);
		$consulta_aprobac->execute();
		$total  = $consulta_aprobac->rowCount();

		if ($total == 0) {
			$sql = "INSERT INTO cmx_aprobacion_estudio(id,id_vehiculo,id_conductor,estudio,id_tipo,observacion,estado,id_estudio,ruta_evidencia,name_evidencia,fecha,hora,usuario,activo)
					VALUES(null,$id_vehiculo,$id_conductor,'$estudio','$idtipo','$obse_todo',$aprobo,$id_estudio,'$miruta2','$name_eviden','$fecha','$hora','$usuario','1')";
			$crear_aprobacion = $conexion->prepare($sql);
			$result = $crear_aprobacion->execute();
			if ($result) {


				if (!file_exists($miruta)) {
					mkdir($miruta, 0777, true);
				}


				for ($i = 0; $i < count($_FILES); $i++) {
					if (isset($_FILES["evi_plataforma" . $i])) {
						$file = $_FILES["evi_plataforma" . $i];
						$nombre = $aleatorio1 . $file["name"] . $aleatorio2;
						$tipo = $file["type"];
						$ruta_provisional = $file["tmp_name"];
						$carpeta = $miruta;
						$src = $carpeta . $nombre;
						move_uploaded_file($ruta_provisional, $src);
					}
				}
			}
		} else {
			//cambiar anteriores a 0 e insertar en 1
			$sql3 = "UPDATE cmx_aprobacion_estudio
					SET activo='0'
					WHERE  
					 estudio='" . $estudio . "'  AND
					id_vehiculo=" . $id_vehiculo . "  AND
					id_conductor=" . $id_conductor . " AND 
					id_estudio=" . $id_estudio . "";
			$crear_update = $conexion->prepare($sql3);
			$result3 = $crear_update->execute();
			if ($result3) {
				$sql = "INSERT INTO cmx_aprobacion_estudio(id,id_vehiculo,id_conductor,estudio,id_tipo,observacion,estado,id_estudio,ruta_evidencia,name_evidencia,fecha,hora,usuario,activo)
					VALUES(null,$id_vehiculo,$id_conductor,'$estudio','$idtipo','$obse_todo',$aprobo,$id_estudio,'$miruta2','$name_eviden','$fecha','$hora','$usuario','1')";
				$crear_aprobacion = $conexion->prepare($sql);
				$result = $crear_aprobacion->execute();
				if ($result) {


					if (!file_exists($miruta)) {
						mkdir($miruta, 0777, true);
					}


					for ($i = 0; $i < count($_FILES); $i++) {
						if (isset($_FILES["evi_plataforma" . $i])) {
							$file = $_FILES["evi_plataforma" . $i];
							$nombre = $aleatorio1 . $file["name"] . $aleatorio2;
							$tipo = $file["type"];
							$ruta_provisional = $file["tmp_name"];
							$carpeta = $miruta;
							$src = $carpeta . $nombre;
							move_uploaded_file($ruta_provisional, $src);
						}
					}
				}
			}
		}

		$return["success"] = true;
		return $return;
	}

	public function  desaprobar_risk()
	{
		// echo ' entro a desaprobar php';
		$fecha = $_POST["fecha"];
		$hora = $_POST["hora"];
		$usuario = $_POST["usuario"];
		$id_vehiculo = $_POST["id_vehiculo"];
		$id_conductor = $_POST["id_conductor"];
		$estudio = $_POST["tipo_estudio"];
		$idsoli = $_POST["idsoli"];
		$idtipo = $_POST["idtipo"];

		if ($_POST["obse_todo"]) {
			$obse_todo = $_POST["obse_todo"];
		} else {
			$obse_todo = '';
		}
		$aprobo = '0';
		$aleatorio1 = rand(10000, 90000);
		$aleatorio2 = rand(10000, 90000);
		$ruta_eviden = $_POST["ruta_eviden"];


		if ($_POST["name_eviden"]) {
			$name_eviden = $aleatorio1 . $_POST["name_eviden"] . $aleatorio2;
		} else {
			$name_eviden = '';
		}

		$model    = new Conexion;
		$conexion = $model->conectar();
		$sqlm = "SELECT id as 'id' 
				 		FROM cmx_estudio_vehiculo
				 		WHERE id_solicitud='$idsoli'  ";
		$consulta_solic_vehic = $conexion->prepare($sqlm);
		$consulta_solic_vehic->execute();
		$datos_proveedor = $consulta_solic_vehic->fetch();
		$id_estudio = $datos_proveedor["id"];
		$miruta = '../' . $ruta_eviden . '/' . $id_estudio . '/';
		$miruta2 = $ruta_eviden . '/' . $id_estudio . '/';

		$sql2 = "SELECT * FROM cmx_aprobacion_estudio
				WHERE estudio='" . $estudio . "' 
				AND id_vehiculo=" . $id_vehiculo . " 
				 AND id_conductor=" . $id_conductor . "   
				 AND id_estudio=" . $id_estudio . "
				 AND activo=1";
		$consulta_aprobac = $conexion->prepare($sql2);
		$consulta_aprobac->execute();
		$total  = $consulta_aprobac->rowCount();

		if ($total == 0) {
			$sql = "INSERT INTO cmx_aprobacion_estudio(id,id_vehiculo,id_conductor,estudio,id_tipo,observacion,estado,id_estudio,ruta_evidencia,name_evidencia,fecha,hora,usuario,activo)
						VALUES(null,$id_vehiculo,$id_conductor,'$estudio','$idtipo','$obse_todo',$aprobo,$id_estudio,'$miruta2','$name_eviden','$fecha','$hora','$usuario','1')";
			$crear_aprobacion = $conexion->prepare($sql);
			$result = $crear_aprobacion->execute();
			if ($result) {
				if (!file_exists($miruta)) {
					mkdir($miruta, 0777, true);
				}
				for ($i = 0; $i < count($_FILES); $i++) {
					if (isset($_FILES["evi_plataforma" . $i])) {
						$file = $_FILES["evi_plataforma" . $i];
						$nombre = $aleatorio1 . $file["name"] . $aleatorio2;
						$tipo = $file["type"];
						$ruta_provisional = $file["tmp_name"];
						$carpeta = $miruta;
						$src = $carpeta . $nombre;
						move_uploaded_file($ruta_provisional, $src);
					}
				}
			}
		} else {
			//cambiar anteriores a 0 e insertar en 1
			$sql3 = "UPDATE cmx_aprobacion_estudio
						SET activo='0'
						WHERE  
						 estudio='" . $estudio . "'  AND
						id_vehiculo=" . $id_vehiculo . "  AND
						id_conductor=" . $id_conductor . " AND 
						id_estudio=" . $id_estudio . "";
			$crear_update = $conexion->prepare($sql3);
			$result3 = $crear_update->execute();
			if ($result3) {
				$sql = "INSERT INTO cmx_aprobacion_estudio(id,id_vehiculo,id_conductor,estudio,id_tipo,observacion,estado,id_estudio,ruta_evidencia,name_evidencia,fecha,hora,usuario,activo)
						VALUES(null,$id_vehiculo,$id_conductor,'$estudio','$idtipo','$obse_todo',$aprobo,$id_estudio,'$miruta2','$name_eviden','$fecha','$hora','$usuario','1')";
				$crear_aprobacion = $conexion->prepare($sql);
				$result = $crear_aprobacion->execute();
				if ($result) {
					if (!file_exists($miruta)) {
						mkdir($miruta, 0777, true);
					}
					for ($i = 0; $i < count($_FILES); $i++) {
						if (isset($_FILES["evi_plataforma" . $i])) {
							$file = $_FILES["evi_plataforma" . $i];
							$nombre = $aleatorio1 . $file["name"] . $aleatorio2;
							$tipo = $file["type"];
							$ruta_provisional = $file["tmp_name"];
							$carpeta = $miruta;
							$src = $carpeta . $nombre;
							move_uploaded_file($ruta_provisional, $src);
						}
					}
				}
			}
		}
		$return["success"] = true;
		return $return;
	}

	public function aprobar_siplaft()
	{
		// echo 'Aprobar siplaft';
		$fecha = $_POST["fecha_s"];
		$hora = $_POST["hora_s"];
		$usuario = $_POST["usuario_s"];
		$vehiculo = $_POST["id_vehiculo_s"];
		$conductor = $_POST["id_conductor_s"];
		$aprobo = '1';
		$model    = new Conexion;
		$conexion = $model->conectar();
		$sqlm = "SELECT max(id) as 'id' FROM cmx_estudio_vehiculo";
		$consulta_solic_vehic = $conexion->prepare($sqlm);
		$consulta_solic_vehic->execute();
		$datos_proveedor = $consulta_solic_vehic->fetch();
		$id_estudio = $datos_proveedor["id"];

		$sql = "INSERT INTO cmx_aprobacion_estudio(id,id_vehiculo,id_conductor,estudio,estado,id_estudio)
					VALUES(null,$vehiculo,$conductor,'siplaft',$aprobo,$id_estudio)";
		$crear_aprobacion = $conexion->prepare($sql);
		$result = $crear_aprobacion->execute();
		//traer el numero de la aprobacion para asignarlo al log que se hace
		$sqla = "SELECT max(id) as 'id' FROM cmx_aprobacion_estudio";
		$consulta_id_aprobacion = $conexion->prepare($sqla);
		$consulta_id_aprobacion->execute();
		$datos_aprobacion = $consulta_id_aprobacion->fetch();
		$id_aprueba = $datos_aprobacion["id"];
		//log aprobacion
		$sql3 = "INSERT INTO cmx_aprobacion_estudio2(id,id_estudio,usuario,
				fecha,hora,operacion,id_aprobacion)
					VALUES(NULL,$id_estudio,'$usuario','$fecha','$hora','Aprobado',$id_aprueba)";
		// echo $sql3;	
		$crear_solicitud = $conexion->prepare($sql3);
		$result = $crear_solicitud->execute();
		$return["success"] = true;
		return $return;
	}

	public function desaprobar_siplaft()
	{
		$fecha = $_POST["fecha_s"];
		$hora = $_POST["hora_s"];
		$usuario = $_POST["usuario_s"];
		$vehiculo = $_POST["id_vehiculo_s"];
		$conductor = $_POST["id_conductor_s"];
		$aprobo = '0';
		$model    = new Conexion;
		$conexion = $model->conectar();
		$sqlm = "SELECT max(id) as 'id' FROM cmx_estudio_vehiculo";
		$consulta_solic_vehic = $conexion->prepare($sqlm);
		$consulta_solic_vehic->execute();
		$datos_proveedor = $consulta_solic_vehic->fetch();
		$id_estudio = $datos_proveedor["id"];

		$sql = "INSERT INTO cmx_aprobacion_estudio(id,id_vehiculo,id_conductor,estudio,estado,id_estudio)
					VALUES(null,$vehiculo,$conductor,'siplaft',$aprobo,$id_estudio)";
		$crear_aprobacion = $conexion->prepare($sql);
		$result = $crear_aprobacion->execute();
		//traer el numero de la aprobacion para asignarlo al log que se hace
		$sqla = "SELECT max(id) as 'id' FROM cmx_aprobacion_estudio";
		$consulta_id_aprobacion = $conexion->prepare($sqla);
		$consulta_id_aprobacion->execute();
		$datos_aprobacion = $consulta_id_aprobacion->fetch();
		$id_aprueba = $datos_aprobacion["id"];
		//log aprobacion
		$sql3 = "INSERT INTO cmx_aprobacion_estudio2(id,id_estudio,usuario,
				fecha,hora,operacion,id_aprobacion)
					VALUES(NULL,$id_estudio,'$usuario','$fecha','$hora','No aprobado',$id_aprueba)";
		// echo $sql3;	
		$crear_solicitud = $conexion->prepare($sql3);
		$result = $crear_solicitud->execute();
		$return["success"] = true;
		return $return;
	}

	public function aprobar_runt()
	{
		$fecha = $_POST["fecha_r"];
		$hora = $_POST["hora_r"];
		$usuario = $_POST["usuario_r"];
		$vehiculo = $_POST["id_vehiculo_r"];
		$conductor = $_POST["id_conductor_r"];
		$aprobo = '1';
		$model    = new Conexion;
		$conexion = $model->conectar();
		$sqlm = "SELECT max(id) as 'id' FROM cmx_estudio_vehiculo";
		$consulta_solic_vehic = $conexion->prepare($sqlm);
		$consulta_solic_vehic->execute();
		$datos_proveedor = $consulta_solic_vehic->fetch();
		$id_estudio = $datos_proveedor["id"];

		$sql = "INSERT INTO cmx_aprobacion_estudio(id,id_vehiculo,id_conductor,estudio,estado,id_estudio)
					VALUES(null,$vehiculo,$conductor,'runt',$aprobo,$id_estudio)";
		$crear_aprobacion = $conexion->prepare($sql);
		$result = $crear_aprobacion->execute();
		//traer el numero de la aprobacion para asignarlo al log que se hace
		$sqla = "SELECT max(id) as 'id' FROM cmx_aprobacion_estudio";
		$consulta_id_aprobacion = $conexion->prepare($sqla);
		$consulta_id_aprobacion->execute();
		$datos_aprobacion = $consulta_id_aprobacion->fetch();
		$id_aprueba = $datos_aprobacion["id"];
		//log aprobacion
		$sql3 = "INSERT INTO cmx_aprobacion_estudio2(id,id_estudio,usuario,
				fecha,hora,operacion,id_aprobacion)
					VALUES(NULL,$id_estudio,'$usuario','$fecha','$hora','Aprobado',$id_aprueba)";
		// echo $sql3;	
		$crear_solicitud = $conexion->prepare($sql3);
		$result = $crear_solicitud->execute();
		$return["success"] = true;
		return $return;
	}

	public function desaprobar_runt()
	{
		$fecha = $_POST["fecha_r"];
		$hora = $_POST["hora_r"];
		$usuario = $_POST["usuario_r"];
		$vehiculo = $_POST["id_vehiculo_r"];
		$conductor = $_POST["id_conductor_r"];
		$aprobo = '0';
		$model    = new Conexion;
		$conexion = $model->conectar();
		$sqlm = "SELECT max(id) as 'id' FROM cmx_estudio_vehiculo";
		$consulta_solic_vehic = $conexion->prepare($sqlm);
		$consulta_solic_vehic->execute();
		$datos_proveedor = $consulta_solic_vehic->fetch();
		$id_estudio = $datos_proveedor["id"];

		$sql = "INSERT INTO cmx_aprobacion_estudio(id,id_vehiculo,id_conductor,estudio,estado,id_estudio)
					VALUES(null,$vehiculo,$conductor,'runt',$aprobo,$id_estudio)";
		$crear_aprobacion = $conexion->prepare($sql);
		$result = $crear_aprobacion->execute();
		//traer el numero de la aprobacion para asignarlo al log que se hace
		$sqla = "SELECT max(id) as 'id' FROM cmx_aprobacion_estudio";
		$consulta_id_aprobacion = $conexion->prepare($sqla);
		$consulta_id_aprobacion->execute();
		$datos_aprobacion = $consulta_id_aprobacion->fetch();
		$id_aprueba = $datos_aprobacion["id"];
		//log aprobacion
		$sql3 = "INSERT INTO cmx_aprobacion_estudio2(id,id_estudio,usuario,
				fecha,hora,operacion,id_aprobacion)
					VALUES(NULL,$id_estudio,'$usuario','$fecha','$hora','No aprobado',$id_aprueba)";
		// echo $sql3;	
		$crear_solicitud = $conexion->prepare($sql3);
		$result = $crear_solicitud->execute();
		$return["success"] = true;
		return $return;
	}

	public function aprobar_policia()
	{
		$fecha = $_POST["fecha_p"];
		$hora = $_POST["hora_p"];
		$usuario = $_POST["usuario_p"];
		$vehiculo = $_POST["id_vehiculo_p"];
		$conductor = $_POST["id_conductor_p"];
		$aprobo = '1';
		$model    = new Conexion;
		$conexion = $model->conectar();
		$sqlm = "SELECT max(id) as 'id' FROM cmx_estudio_vehiculo";
		$consulta_solic_vehic = $conexion->prepare($sqlm);
		$consulta_solic_vehic->execute();
		$datos_proveedor = $consulta_solic_vehic->fetch();
		$id_estudio = $datos_proveedor["id"];

		$sql = "INSERT INTO cmx_aprobacion_estudio(id,id_vehiculo,id_conductor,estudio,estado,id_estudio)
					VALUES(null,$vehiculo,$conductor,'policia',$aprobo,$id_estudio)";
		$crear_aprobacion = $conexion->prepare($sql);
		$result = $crear_aprobacion->execute();
		//traer el numero de la aprobacion para asignarlo al log que se hace
		$sqla = "SELECT max(id) as 'id' FROM cmx_aprobacion_estudio";
		$consulta_id_aprobacion = $conexion->prepare($sqla);
		$consulta_id_aprobacion->execute();
		$datos_aprobacion = $consulta_id_aprobacion->fetch();
		$id_aprueba = $datos_aprobacion["id"];
		//log aprobacion
		$sql3 = "INSERT INTO cmx_aprobacion_estudio2(id,id_estudio,usuario,
				fecha,hora,operacion,id_aprobacion)
					VALUES(NULL,$id_estudio,'$usuario','$fecha','$hora','Aprobado',$id_aprueba)";
		// echo $sql3;	
		$crear_solicitud = $conexion->prepare($sql3);
		$result = $crear_solicitud->execute();
		$return["success"] = true;
		return $return;
	}

	public function desaprobar_policia()
	{
		$fecha = $_POST["fecha_p"];
		$hora = $_POST["hora_p"];
		$usuario = $_POST["usuario_p"];
		$vehiculo = $_POST["id_vehiculo_p"];
		$conductor = $_POST["id_conductor_p"];
		$aprobo = '0';
		$model    = new Conexion;
		$conexion = $model->conectar();
		$sqlm = "SELECT max(id) as 'id' FROM cmx_estudio_vehiculo";
		$consulta_solic_vehic = $conexion->prepare($sqlm);
		$consulta_solic_vehic->execute();
		$datos_proveedor = $consulta_solic_vehic->fetch();
		$id_estudio = $datos_proveedor["id"];

		$sql = "INSERT INTO cmx_aprobacion_estudio(id,id_vehiculo,id_conductor,estudio,estado,id_estudio)
					VALUES(null,$vehiculo,$conductor,'policia',$aprobo,$id_estudio)";
		$crear_aprobacion = $conexion->prepare($sql);
		$result = $crear_aprobacion->execute();
		//traer el numero de la aprobacion para asignarlo al log que se hace
		$sqla = "SELECT max(id) as 'id' FROM cmx_aprobacion_estudio";
		$consulta_id_aprobacion = $conexion->prepare($sqla);
		$consulta_id_aprobacion->execute();
		$datos_aprobacion = $consulta_id_aprobacion->fetch();
		$id_aprueba = $datos_aprobacion["id"];
		//log aprobacion
		$sql3 = "INSERT INTO cmx_aprobacion_estudio2(id,id_estudio,usuario,
				fecha,hora,operacion,id_aprobacion)
					VALUES(NULL,$id_estudio,'$usuario','$fecha','$hora','No aprobado',$id_aprueba)";
		// echo $sql3;	
		$crear_solicitud = $conexion->prepare($sql3);
		$result = $crear_solicitud->execute();
		$return["success"] = true;
		return $return;
	}

	public function aprobar_procuraduria()
	{
		$fecha = $_POST["fecha_pr"];
		$hora = $_POST["hora_pr"];
		$usuario = $_POST["usuario_pr"];
		$vehiculo = $_POST["id_vehiculo_pr"];
		$conductor = $_POST["id_conductor_pr"];
		$aprobo = '1';
		$model    = new Conexion;
		$conexion = $model->conectar();
		$sqlm = "SELECT max(id) as 'id' FROM cmx_estudio_vehiculo";
		$consulta_solic_vehic = $conexion->prepare($sqlm);
		$consulta_solic_vehic->execute();
		$datos_proveedor = $consulta_solic_vehic->fetch();
		$id_estudio = $datos_proveedor["id"];

		$sql = "INSERT INTO cmx_aprobacion_estudio(id,id_vehiculo,id_conductor,estudio,estado,id_estudio)
					VALUES(null,$vehiculo,$conductor,'procuraduria',$aprobo,$id_estudio)";
		$crear_aprobacion = $conexion->prepare($sql);
		$result = $crear_aprobacion->execute();
		//traer el numero de la aprobacion para asignarlo al log que se hace
		$sqla = "SELECT max(id) AS 'id' FROM cmx_aprobacion_estudio";
		$consulta_id_aprobacion = $conexion->prepare($sqla);
		$consulta_id_aprobacion->execute();
		$datos_aprobacion = $consulta_id_aprobacion->fetch();
		$id_aprueba = $datos_aprobacion["id"];
		//log aprobacion
		$sql3 = "INSERT INTO cmx_aprobacion_estudio2(id,id_estudio,usuario,
				fecha,hora,operacion,id_aprobacion)
					VALUES(NULL,$id_estudio,'$usuario','$fecha','$hora','Aprobado',$id_aprueba)";
		// echo $sql3;	
		$crear_solicitud = $conexion->prepare($sql3);
		$result = $crear_solicitud->execute();
		$return["success"] = true;
		return $return;
	}



	public function aprobacioncompleta()
	{
		// echo 'entro a el php completo';
		$Data = new Consultas;
		$idcarro = $_POST["idcarro"];
		$idcondu = $_POST["idcondu"];
		$idestudio = $_POST["idestudio"];
		$estado = $_POST["estado"];
		$id_usuario = $_POST["user"];
		if ($_POST["obser"]) {
			$obser = $_POST["obser"];
		} else {
			$obser = '';
		}
		$fecha = date('Y-m-d');
		$hora = date('G:i:s');
		$operacion = 'Crear';
		$proceso = $_POST["proceso"];
		$proceso_estudio = $_POST["proceso_estudio"];
		$usuario = $_SESSION["usuario"]["nom_usuario"];
		$model    = new Conexion;
		$conexion = $model->conectar();
		//actualizar el estado iniciado a cero
		$sqla = "UPDATE cmx_estudiov_completo SET estado_actu=0 WHERE id_estudio='$idestudio' AND id_vehiculo='$idcarro' AND id_conductor='$idcondu' ";
		$update_ante = $conexion->prepare($sqla);
		$resulta = $update_ante->execute();
		//insertar estado nuevo
		$sql = "INSERT INTO  cmx_estudiov_completo (id,id_estudio,estado,id_vehiculo,id_conductor,observacion,proceso,estado_actu)
		VALUES(null,'$idestudio','$estado','$idcarro','$idcondu','$obser','$proceso_estudio','1')";
		$crear_estudiocompl = $conexion->prepare($sql);
		$result = $crear_estudiocompl->execute();
		//actualizar el proceso en la tabla cmx_log_solicitudvehiculo2

		$sqlmi = "SELECT id_solicitud  AS 'id' FROM cmx_estudio_vehiculo WHERE id=$idestudio    ";
		$consulta = $conexion->prepare($sqlmi);
		$consulta->execute();
		$dato = $consulta->fetch();
		$id_solicitud = $dato["id"];

		$sqle = "UPDATE cmx_log_solicitudvehiculo2 SET proceso='$proceso', estado_ruta='Pendiente' WHERE id=$id_solicitud ";
		$update_soliestu = $conexion->prepare($sqle);
		$result = $update_soliestu->execute();

		// traerl max id para del estudio  crear el log
		$sqlm = "	SELECT MAX(id) as 'id' FROM cmx_estudiov_completo WHERE id_estudio='$idestudio'";
		$consulta_estudioc = $conexion->prepare($sqlm);
		$consulta_estudioc->execute();
		$datos_estudio = $consulta_estudioc->fetch();
		$id_ecompleto = $datos_estudio["id"];

		$sql2 = "INSERT INTO cmx_logestudio_com (id,id_completo,id_estudio,fecha,hora,id_usuario,estado)
				VALUES(null,'$id_ecompleto','$idestudio','$fecha','$hora','$usuario','$operacion')";
		$crear_log = $conexion->prepare($sql2);
		$result = $crear_log->execute();

		if ($estado == 'Rechazado') {
			//LIBERAR SOLICITUDES DE SERVICIO
			$id_de_preestudio = $_POST["id_de_preestudio"];
			$sql_liberar = "SELECT id_servicio_cliente FROM cmx_preestudio_solicitudes_servicio
				WHERE id_solicitudpreestudio=" . $id_de_preestudio;
			$consulta = $conexion->prepare($sql_liberar);
			$consulta->execute();
			$total = $consulta->rowCount();
			if ($total > 0) {
				while ($datos = $consulta->fetch()) {
					$is_servicio = $datos['id_servicio_cliente'];
				}
			}
		}
		$return["success"] = true;
		return $return;
	}

	// public function desaprobacioncompleta(){
	// 	// echo 'entro a el php completo';
	// 	$idcarro=$_POST["idcarro"];
	// 	$idcondu=$_POST["idcondu"];
	// 	$idestudio=$_POST["idestudio"];
	// 	$estado=$_POST["estado"];
	// $id_usuario=$_POST["user"];
	// 	if($_POST["obser"]){
	// 		$obser=$_POST["obser"];
	// 	}else{
	// 		$obser='';
	// 	}
	// 	$fecha=date('Y-m-d');
	// 	$hora=date('G:i:s');
	// 	$operacion='Crear';

	// 	$model    = new Conexion;
	// 	$conexion = $model->conectar();

	// 	$sql="INSERT INTO  cmx_estudiov_completo
	// 		(id,id_estudio,estado,id_vehiculo,id_conductor,observacion)VALUES(null,'$idestudio','$estado','$idcarro','$idcondu','$obser')";
	// 	$crear_estudiocompl = $conexion->prepare($sql);
	// 	$result = $crear_estudiocompl->execute();	

	// 	//traerl max id para del estudio  crear el log
	// 	 $sqlm = "SELECT max(id) as 'id' FROM cmx_estudiov_completo";
	// 	 $consulta_estudioc = $conexion->prepare($sqlm);
	// 	 $consulta_estudioc->execute();
	// 	 $datos_estudio = $consulta_estudioc->fetch();
	// 	 $id_ecompleto = $datos_estudio["id"];

	// 	$sql2="
	// 		INSERT INTO cmx_logestudio_com
	// 		(id,id_completo,id_estudio,fecha,hora,id_usuario,estado)
	// 		VALUES(null,'$id_ecompleto','$idestudio','$fecha','$hora','id_usuario','$operacion')
	// 	";
	// 	$crear_log = $conexion->prepare($sql2);
	// 	$result = $crear_log->execute();	
	// 	$return["success"] = true;
	// 	return $return;
	// }


	// public function verlista(){
	// 	$id_vehiculo=$_POST["id_carro"];
	// 	$id_conductor=$_POST["id_conductor"];
	// 	$model    = new Conexion;
	// 	$conexion = $model->conectar();	
	// 	$sql="SELECT id_estudio as 'id' FROM cmx_aprobacion_estudio 
	// 	WHERE id_vehiculo=".$id_vehiculo."
	// 	 AND id_conductor=".$id_conductor."
	// 	GROUP BY id_estudio";
	// 	 // echo $sql;
	// 	$consulta_id_estudio = $conexion->prepare($sql);
	// 	$consulta_id_estudio->execute();
	// 	$datos_estudio = $consulta_id_estudio->fetch();
	// 	$id_estudio = $datos_estudio["id"];

	// 	$sql2="
	// 		SELECT * FROM cmx_aprobacion_estudio 
	// 		WHERE id_vehiculo=".$id_vehiculo."
	// 		 AND id_conductor=".$id_conductor."
	// 		 AND id_estudio=".$id_estudio."
	// 	";
	// 	 // echo $sql2;
	// 	$crear_lista = $conexion->prepare($sql2);
	// 	$result = $crear_lista->execute();	
	// 	$return["success"] = true;
	// 	return $return;	
	// }

}
