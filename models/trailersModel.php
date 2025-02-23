<?php
class trailersModel extends Model
{

	public function __construct()
	{
		parent::__construct();
	}

	public function getPrueba($tipo, $placa)
	{

		if ($placa == "") {
			$sql = "SELECT t.*, p.nombre AS nameco,p.descripcion, pr.nombre,tv.estado AS 'Estado_Asignado' FROM cmx_rndc_vehiculos_configuracion p
				INNER JOIN cmx_trailer t ON p.id=t.configuracion
				INNER JOIN cmx_proveedores pr ON t.doc_propietario=pr.numdoc_nexos
				INNER JOIN cmx_actividad_proveedor a ON pr.numdoc_nexos=a.id_proveedor
				LEFT  JOIN cmx_trailer_vehiculo tv ON t.numdoc_trailer=tv.id_trailer
				WHERE a.actividad='Propietario Vehiculo' OR a.actividad='Propietario Trailer' GROUP BY t.placa LIMIT 34
			";
			$result = $this->_db->getConsulta($sql); //viene de confinguraciones funciones establecidas por defecto para consultas, eliminar, registrar... (getconsuktas SOLO para consultar algo)
			return $result;
		} else {
			$sql = "SELECT t.*, p.nombre AS nameco, p.descripcion, pr.nombre,tv.estado AS 'Estado_Asignado' FROM cmx_rndc_vehiculos_configuracion p
        INNER JOIN cmx_trailer t ON p.id=t.configuracion
        INNER JOIN cmx_proveedores pr ON t.doc_propietario=pr.numdoc_nexos
        INNER JOIN cmx_actividad_proveedor a ON pr.numdoc_nexos=a.id_proveedor
				LEFT  JOIN cmx_trailer_vehiculo tv ON t.numdoc_trailer=tv.id_trailer
        WHERE t.placa LIKE '%" . $placa . "%' 
        AND (a.actividad='Propietario Vehiculo' OR a.actividad='Propietario Trailer') GROUP BY t.placa
        LIMIT 34";
			$result = $this->_db->getConsulta($sql); //viene de confinguraciones funciones establecidas por defecto para consultas, eliminar, registrar... (getconsuktas SOLO para consultar algo)
			return $result;
		}
	}

	public function Consultar_Datos_Trailer()
	{
		$response = [];
		$this->_db3->beginTransaction();
		try {
			$sql = $this->_db3->prepare("SELECT * FROM cmx_rndc_trailermarcas WHERE estado=1 ORDER BY marca ASC");
			$sql->execute();
			$result = $sql->fetchAll(PDO::FETCH_ASSOC);

			$sql2 = $this->_db3->prepare("SELECT * from cmx_rndc_trailertramites ORDER BY tramite ASC");
			$sql2->execute();
			$result2 = $sql2->fetchAll(PDO::FETCH_ASSOC);

			$sql3 = $this->_db3->prepare("SELECT * FROM cmx_rndc_vehiculos_configuracion WHERE tipo='Remolque'ORDER BY nombre ASC");
			$sql3->execute();
			$result3 = $sql3->fetchAll(PDO::FETCH_ASSOC);

			$sql4 = $this->_db3->prepare("SELECT p.numdoc_nexos, p.nombre, p.numero_documento, p.tipo_documento FROM cmx_proveedores p
			INNER JOIN cmx_actividad_proveedor a ON p.numdoc_nexos=a.id_proveedor
			WHERE a.actividad='Propietario Vehiculo' ORDER BY p.nombre ASC");
			$sql4->execute();
			$result4 = $sql4->fetchAll(PDO::FETCH_ASSOC);

			$sql5 = $this->_db3->prepare("SELECT * FROM cmx_rndc_aseguradoras ORDER BY nombre ASC");
			$sql5->execute();
			$result5 = $sql5->fetchAll(PDO::FETCH_ASSOC);

			//traier tirpos de carroceria
			$sql6 = $this->_db3->prepare("SELECT * FROM cmx_rndc_vehiculos_carroceria WHERE estado=1 ORDER BY descripcion ASC");
			$sql6->execute();
			$result6 = $sql6->fetchAll(PDO::FETCH_ASSOC);

			//trailer poseedores
			$sql7 = $this->_db3->prepare("SELECT p.numdoc_nexos, p.nombre, p.numero_documento, p.tipo_documento FROM cmx_proveedores p
			INNER JOIN cmx_actividad_proveedor a ON p.numdoc_nexos=a.id_proveedor WHERE a.actividad='Poseedor Vehiculo' ORDER BY p.nombre ASC");
			$sql7->execute();
			$result7 = $sql7->fetchAll(PDO::FETCH_ASSOC);

			$this->_db3->commit();
			$response = [
				"result" => $result,
				"result2" => $result2,
				"result3" => $result3,
				"result4" => $result4,
				"result5" => $result5,
				"result6" => $result6,
				"result7" => $result7,
			];
		} catch (\Throwable $th) {
			$this->_db3->rollBack();
			// Captura cualquier excepción generada por PDO
			// y procesa el error para mostrar un mensaje específico al usuario
			$errorCode = $th->getCode(); // Obtén el código de error

			switch ($errorCode) {
				case '42000':
					// SQLSTATE[42000] indica un error de sintaxis SQL
					// Procesa el mensaje de error o muestra uno predeterminado
					$response = false;
					break;
					// Puedes agregar más casos según tus necesidades
				default:
					// Otros códigos de error no específicamente manejados
					// Procesa el mensaje de error o muestra uno predeterminado
					$response = "Se ha producido un error en la ejecución de la consulta.";
					break;
			}
			// Aquí puedes enviar el mensaje de error al frontend
			// Puedes usar echo para enviar el mensaje como respuesta
			// echo $errorMessage;
			throw $th;
		}
		return $response;
	}

	public function Listar_Propietarios()
	{
		$sql = $this->_db3->prepare("SELECT p.numdoc_nexos, p.tipo_documento, p.numero_documento, p.digito_verificacion, p.nombre, p.apellido1, p.apellido2,p.celular,p.direccion FROM cmx_proveedores p
		INNER JOIN cmx_actividad_proveedor a ON p.numdoc_nexos=a.id_proveedor WHERE a.actividad='Propietario Vehiculo' OR a.actividad='Propietario Trailer' AND p.estado='Activo' ORDER BY  p.nombre ASC");
		$sql->execute();
		$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $resultado;
	}

	public function Buscar_Propietarios($dato)
	{
		// $sql = $this->_db3->prepare("SELECT * FROM cmx_rndc_vehiculos_color WHERE color LIKE '%' :datos '%' ORDER BY color ASC, rndc_id DESC");
		$sql = $this->_db3->prepare("SELECT p.numdoc_nexos, p.tipo_documento, p.numero_documento, p.digito_verificacion, p.nombre, p.apellido1, p.apellido2,p.celular,p.direccion FROM cmx_proveedores p
		INNER JOIN cmx_actividad_proveedor a ON p.numdoc_nexos=a.id_proveedor WHERE (p.nombre LIKE '%' :datos '%' OR p.numero_documento LIKE '%' :datos '%' OR p.celular LIKE '%' :datos '%') AND a.actividad='Propietario Vehiculo' OR a.actividad='Propietario Trailer' AND p.estado='Activo' ORDER BY  p.nombre ASC");
		$sql->bindParam(':datos', $dato, PDO::PARAM_STR);
		$sql->execute();
		$resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $resultados;
	}

	public function Listar_Poseeodores()
	{
		$sql = $this->_db3->prepare("SELECT p.numdoc_nexos, p.tipo_documento, p.numero_documento, p.digito_verificacion, p.nombre, p.apellido1, p.apellido2,
		p.celular,p.direccion  FROM cmx_proveedores p
		INNER JOIN cmx_actividad_proveedor a ON p.numdoc_nexos=a.id_proveedor
		WHERE a.actividad='Poseedor Vehiculo' AND p.estado='Activo' ORDER BY  p.nombre ASC");
		$sql->execute();
		$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $resultado;
	}

	public function Buscar_Poseedores($dato)
	{
		// $sql = $this->_db3->prepare("SELECT * FROM cmx_rndc_vehiculos_color WHERE color LIKE '%' :datos '%' ORDER BY color ASC, rndc_id DESC");
		$sql = $this->_db3->prepare("SELECT p.numdoc_nexos, p.tipo_documento, p.numero_documento, p.digito_verificacion, p.nombre, p.apellido1, p.apellido2,p.celular,p.direccion FROM cmx_proveedores p
		INNER JOIN cmx_actividad_proveedor a ON p.numdoc_nexos=a.id_proveedor WHERE (p.nombre LIKE '%' :datos '%' OR p.numero_documento LIKE '%' :datos '%' OR p.celular LIKE '%' :datos '%') AND a.actividad='Poseedor Vehiculo' AND p.estado='Activo' ORDER BY  p.nombre ASC");
		$sql->bindParam(':datos', $dato, PDO::PARAM_STR);
		$sql->execute();
		$resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $resultados;
	}

	public function Validar_Placa_Trailer($placa)
	{
		$sql = $this->_db3->prepare("SELECT * FROM cmx_trailer WHERE 	placa=:placa");
		$sql->bindParam(':placa', $placa, PDO::PARAM_STR);
		$sql->execute();
		$resultados = $sql->fetch(PDO::FETCH_ASSOC);
		return $resultados;
	}

	public function Crear_Nuevo_Trailer($datos)
	{
		$response = [];
		$estado = 'Activo';
		$fecha = date('Y-m-d');
		$hora = date('H:i:s');
		$operacion = 'Crear';
		$estado_asignacion = 'Disponible';
		$user = $_SESSION["usuario"]["nom_usuario"];

		// Consultar maestro de Estudio de seguridad cabecera
		$sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='TRAILERS' AND numero_actual>numero_inicial");
		$sql_consecutivo->execute();
		$resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
		$numdoc_cabecera = $resultado_consecutivo['numero_actual'];
		$numdoc_actualizar_cabecera = $numdoc_cabecera + 1;

		// Actualizar Maestro de Estudio seguridad cabecera
		$sql_update_maestro = $this->_db3->prepare("UPDATE cmx_maestro SET numero_actual=:numdoc_actualizar_cabecera WHERE tipo='TRAILERS'");
		$sql_update_maestro->bindParam(':numdoc_actualizar_cabecera', $numdoc_actualizar_cabecera, PDO::PARAM_INT);

		try {
			$this->_db3->beginTransaction();

			$sql_update_maestro->execute();

			$sql = $this->_db3->prepare("INSERT INTO cmx_trailer(numdoc_trailer, placa, marca, peso_vacio, alto, volumen, tipo_tramite, serie_chasis, configuracion, modelo, ancho, largo, capacidad, carroceria, caracteristica, numero_civil, aseguradora, fecha_vence, doc_propietario, estado, estado_solicitud, n_licencia, doc_poseedor)
            VALUES(:numdoc_trailer, :placa_trailer, :marca_trailer, :peso_trailer, :alto_trailer, :volumen_trailer, :tramite_trailer, :chasis_trailer, :config_trailer, :modelo_trailer, :ancho_trailer, :largo_trailer, :capacidad_trailer, :carroceria_trailer, :carac_trailer, :civil_trailer, :asegura_trailer, :vence_trailer, :propietario_trailer, :estado, :estado_asignado, :nlicen, :poseedor_trailer)");
			$sql->bindParam(':numdoc_trailer', $numdoc_cabecera, PDO::PARAM_STR);
			$sql->bindParam(':placa_trailer', $datos['placa_trailer'], PDO::PARAM_STR);
			$sql->bindParam(':marca_trailer', $datos['marca_trailer'], PDO::PARAM_STR);
			$sql->bindParam(':peso_trailer', $datos['peso_trailer'], PDO::PARAM_STR);
			$sql->bindParam(':alto_trailer', $datos['alto_trailer'], PDO::PARAM_STR);
			$sql->bindParam(':volumen_trailer', $datos['volumen_trailer'], PDO::PARAM_STR);
			$sql->bindParam(':tramite_trailer', $datos['tramite_trailer'], PDO::PARAM_STR);
			$sql->bindParam(':chasis_trailer', $datos['chasis_trailer'], PDO::PARAM_STR);
			$sql->bindParam(':config_trailer', $datos['config_trailer'], PDO::PARAM_STR);
			$sql->bindParam(':modelo_trailer', $datos['modelo_trailer'], PDO::PARAM_STR);
			$sql->bindParam(':ancho_trailer', $datos['ancho_trailer'], PDO::PARAM_STR);
			$sql->bindParam(':largo_trailer', $datos['largo_trailer'], PDO::PARAM_STR);
			$sql->bindParam(':capacidad_trailer', $datos['capacidad_trailer'], PDO::PARAM_STR);
			$sql->bindParam(':carroceria_trailer', $datos['carroceria_trailer'], PDO::PARAM_STR);
			$sql->bindParam(':carac_trailer', $datos['carac_trailer'], PDO::PARAM_STR);
			$sql->bindParam(':civil_trailer', $datos['civil_trailer'], PDO::PARAM_STR);
			$sql->bindParam(':asegura_trailer', $datos['asegura_trailer'], PDO::PARAM_STR);
			$sql->bindParam(':vence_trailer', $datos['vence_trailer'], PDO::PARAM_STR);
			$sql->bindParam(':propietario_trailer', $datos['propietario_trailer'], PDO::PARAM_STR);
			$sql->bindParam(':estado', $estado, PDO::PARAM_STR);
			$sql->bindParam(':estado_asignado', $estado_asignacion, PDO::PARAM_STR);
			$sql->bindParam(':nlicen', $datos['name_licen'], PDO::PARAM_STR);
			$sql->bindParam(':poseedor_trailer', $datos['poseedor_trailer'], PDO::PARAM_STR);
			$sql->execute();

			// Verificar y subir el archivo de licencia
			if (isset($datos['foto_licencia']) && $datos['foto_licencia']['tmp_name'] !== '') {
				$ruta_liceni = "public/files/vehiculos/trailer/" . $numdoc_cabecera . "/LI/";
				$ruta_base_l = "public/files/vehiculos/trailer/" . $numdoc_cabecera . "/LI/";

				if (!is_dir($ruta_liceni)) {
					mkdir($ruta_liceni, 0777, true);
				}

				$nombre_licencia = $datos['foto_licencia']['name'];
				$rutaTemporal_licencia = $datos['foto_licencia']['tmp_name'];
				$src_licencia = $ruta_liceni . $nombre_licencia;

				if (move_uploaded_file($rutaTemporal_licencia, $src_licencia)) {
					// Subida exitosa, registrar en la base de datos
					$sqltl = $this->_db3->prepare("UPDATE cmx_trailer SET foto_licencia = :ruta_base_l, name_licencia = :name_licen WHERE id = :numdoc_cabecera");
					$sqltl->bindParam(':ruta_base_l', $ruta_base_l, PDO::PARAM_STR);
					$sqltl->bindParam(':name_licen', $datos['name_licen'], PDO::PARAM_STR);
					$sqltl->bindParam(':numdoc_cabecera', $numdoc_cabecera, PDO::PARAM_STR);
					$sqltl->execute();
				} else {
					// Error al mover el archivo
					throw new Exception("Error al mover el archivo de licencia a la carpeta de destino.");
				}
			} else {
				// Cuando no hay documentos para subir
				throw new Exception("No se han proporcionado documentos de licencia para subir.");
			}

			// Verificar y subir el archivo del tráiler
			if (isset($datos['foto_trailer']) && $datos['foto_trailer']['tmp_name'] !== '') {
				$ruta_trailer = "../public/files/vehiculos/trailer/" . $numdoc_cabecera . "/";
				$ruta_base_t = "public/files/vehiculos/trailer/" . $numdoc_cabecera . "/";

				if (!is_dir($ruta_trailer)) {
					mkdir($ruta_trailer, 0777, true);
				}

				$nombre_trailer = $datos['foto_trailer']['name'];
				$rutaTemporal_trailer = $datos['foto_trailer']['tmp_name'];
				$src_trailer = $ruta_trailer . $nombre_trailer;

				if (move_uploaded_file($rutaTemporal_trailer, $src_trailer)) {
					// Subida exitosa, registrar en la base de datos
					$sqlt = $this->_db3->prepare("UPDATE cmx_trailer SET foto_trailer = :ruta_base_t, n_docu_trailer = :name_foto WHERE id = :id_trailer");
					$sqlt->bindParam(':ruta_base_t', $ruta_base_t, PDO::PARAM_STR);
					$sqlt->bindParam(':name_foto', $datos['name_foto'], PDO::PARAM_STR);
					$sqlt->bindParam(':id_trailer', $numdoc_cabecera, PDO::PARAM_STR);
					$sqlt->execute();
				} else {
					// Error al mover el archivo
					throw new Exception("Error al mover el archivo del tráiler a la carpeta de destino.");
				}
			} else {
				// Cuando no hay documentos para subir
				throw new Exception("No se han proporcionado documentos del tráiler para subir.");
			}

			// Insertar el log de la creación del tráiler
			$sql_log = $this->_db3->prepare("INSERT INTO cmx_log_trailers (id, id_trailer, id_usuario, operacion, fecha, hora) VALUES (NULL, :id_trailer, :id_usuario, :operacion, :fecha, :hora)");
			$sql_log->bindParam(':id_trailer', $numdoc_cabecera, PDO::PARAM_STR);
			$sql_log->bindParam(':id_usuario', $datos['id_usuario'], PDO::PARAM_STR);
			$sql_log->bindParam(':operacion', $operacion, PDO::PARAM_STR);
			$sql_log->bindParam(':fecha', $fecha, PDO::PARAM_STR);
			$sql_log->bindParam(':hora', $hora, PDO::PARAM_STR);
			$sql_log->execute();

			$this->_db3->commit();
			$response = ['success' => true, 'message' => 'Datos del Tráiler Registrados Exitosamente en NexosAPP.'];
		} catch (Exception $e) {
			$this->_db3->rollBack();
			// Registrar el error en un archivo de log en la raíz del proyecto
			$errorMessage = "Error en la transacción al insertar tráiler: " . $e->getMessage() . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
			error_log($errorMessage, 3, 'error_log.txt');
			$response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar el tráiler. Por favor, inténtelo nuevamente más tarde. Por favor comunicarse con el equipo de desarrollo.'];
		}

		return $response;
	}

	public function Consulta_Datos_Trailer($trailer_id)
	{
		$response = [];
		try {
			$this->_db3->beginTransaction();

			$sql = $this->_db3->prepare("SELECT SUBSTR(t.placa,1,1) AS 'letra_placa', SUBSTR(t.placa,2,5) AS 'num_placa',CONCAT(IFNULL(prot.apellido1,''),' ',IFNULL(prot.apellido2,''),' ',prot.nombre) AS Propietario,
			CONCAT(IFNULL(pos.apellido1,''),' ',IFNULL(pos.apellido2,''),' ',pos.nombre) AS Poseedor, t.*
			FROM cmx_trailer AS t
			INNER JOIN cmx_proveedores prot ON t.doc_propietario=prot.numdoc_nexos
			INNER JOIN cmx_proveedores pos ON t.doc_poseedor=pos.numdoc_nexos
			WHERE t.numdoc_trailer=:id_trailer");
			// $sql = $this->_db3->prepare("SELECT SUBSTR(t.placa,1,1) AS 'letra_placa',
			// SUBSTR(t.placa,2,5) AS 'num_placa', t.* FROM cmx_trailer AS t WHERE t.numdoc_trailer=:id_trailer");
			$sql->bindParam(':id_trailer', $trailer_id, PDO::PARAM_STR);
			$sql->execute();
			$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
			$this->_db3->commit();
			$response = [
				"resultado" => $resultado
			];
		} catch (\Throwable $th) {
			$this->_db3->rollBack();
			$mensajeError = "Error en el proceso de insertar el trailer." . date("Y-m-d");
			error_log($mensajeError . "\n", 3, "error_log.txt");

			$errorCode = $th->getCode(); // Obtén el código de error

			switch ($errorCode) {
				case '42000':
					// SQLSTATE[42000] indica un error de sintaxis SQL
					// Procesa el mensaje de error o muestra uno predeterminado
					// $response = false;
					$response = 0;
					break;
				case 'HY093':
					// SQLSTATE[42000] indica un error de sintaxis SQL
					// Procesa el mensaje de error o muestra uno predeterminado
					// $response = false;
					$response = 0;
					break;
					// Puedes agregar más casos según tus necesidades
				default:
					// Otros códigos de error no específicamente manejados
					// Procesa el mensaje de error o muestra uno predeterminado
					$response = "Se ha producido un error en la ejecución de la consulta.";
					break;
			}
			// Aquí puedes enviar el mensaje de error al frontend
			// Puedes usar echo para enviar el mensaje como respuesta
			// echo $errorMessage;
			throw $th;
		}


		return $response;
	}


	public function Ver_Datos_Trailer($id_trailer)
	{
		$response = [];

		$sql = $this->_db3->prepare("SELECT * FROM cmx_trailer WHERE numdoc_trailer=:id_trailer");
		$sql->bindParam(':id_trailer', $id_trailer, PDO::PARAM_INT);
		$sql->execute();
		$datos = $sql->fetch(PDO::FETCH_ASSOC);

		$idmarca = $datos["marca"];
		$idtramite = $datos["tipo_tramite"];
		$idconfig = $datos["configuracion"];
		$idcarroceria = $datos["carroceria"];
		$documento = $datos["doc_propietario"];
		$aseguradora = $datos["aseguradora"];

		$sql2 = $this->_db3->prepare("SELECT marca AS marca_trailer FROM cmx_rndc_trailermarcas WHERE id=:id_marca");
		$sql2->bindParam(':id_marca', $idmarca, PDO::PARAM_STR);
		$sql2->execute();
		$datos2 = $sql2->fetch(PDO::FETCH_ASSOC);

		$sql3 = $this->_db3->prepare("SELECT tramite AS tramite_trailer FROM cmx_rndc_trailertramites WHERE id=:id_tramite");
		$sql3->bindParam(':id_tramite', $idtramite, PDO::PARAM_STR);
		$sql3->execute();
		$datos3 = $sql3->fetch(PDO::FETCH_ASSOC);

		$sql4 = $this->_db3->prepare("SELECT nombre  AS configuracion_trailer FROM cmx_rndc_vehiculos_configuracion WHERE id=:id_config");
		$sql4->bindParam(':id_config', $idconfig, PDO::PARAM_STR);
		$sql4->execute();
		$datos4 = $sql4->fetch(PDO::FETCH_ASSOC);

		$sql5 = $this->_db3->prepare("SELECT descripcion AS carroceria_trailer FROM cmx_rndc_vehiculos_carroceria WHERE id=:id_carroceria");
		$sql5->bindParam(':id_carroceria', $idcarroceria, PDO::PARAM_STR);
		$sql5->execute();
		$datos5 = $sql5->fetch(PDO::FETCH_ASSOC);

		//propietario
		$sql6 = $this->_db3->prepare("SELECT nombre AS Propietario FROM cmx_proveedores WHERE numdoc_nexos=:numdoc_nexos");
		$sql6->bindParam(':numdoc_nexos', $documento, PDO::PARAM_STR);
		$sql6->execute();
		$datos6 = $sql6->fetch(PDO::FETCH_ASSOC);

		//aseguradora
		if ($aseguradora == '' && $aseguradora == null) {
			$dato = 0;
			$sql7 = $this->_db3->prepare("SELECT nombre AS Aseguradora FROM cmx_proveedores WHERE numdoc_nexos=:numdoc_nexos");
			$sql7->bindParam(':numdoc_nexos', $dato, PDO::PARAM_STR);
			$sql7->execute();
			$datos7 = $sql7->fetch(PDO::FETCH_ASSOC);
		} else {
			$sql7 = $this->_db3->prepare("SELECT nombre AS Aseguradora FROM cmx_proveedores WHERE numdoc_nexos=:numdoc_nexos");
			$sql7->bindParam(':numdoc_nexos', $aseguradora, PDO::PARAM_STR);
			$sql7->execute();
			$datos7 = $sql7->fetch(PDO::FETCH_ASSOC);
		}

		$response = [
			"result" => $datos,
			"result2" => $datos2["marca_trailer"],
			"result3" => empty($datos3["tramite_trailer"]) ? null : $datos3["tramite_trailer"],
			"result4" => $datos4["configuracion_trailer"],
			"result5" => $datos5["carroceria_trailer"],
			"result6" => $datos6["Propietario"],
			"result7" => empty($datos7["Aseguradora"]) ? null : $datos7["Aseguradora"],
		];

		return $response;
	}

	public function Historico_Datos_Trailer($id_trailer)
	{
		$sql = $this->_db3->prepare("SELECT a.*, b.placa AS 'ptrailer', v.placa AS 'pvehiculo' FROM cmx_trailer_vehiculo a
			INNER JOIN  cmx_trailer b ON a.id_trailer=b.numdoc_trailer
			INNER JOIN cmx_vehiculos v ON a.id_vehiculo=v.id
			WHERE a.id_trailer=:id_trailer");
		$sql->bindParam(':id_trailer', $id_trailer, PDO::PARAM_INT);
		$sql->execute();
		$datos = $sql->fetchAll(PDO::FETCH_ASSOC);

		return $datos;
	}
}
