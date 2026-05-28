<?php
session_start();
class parametroModel extends Model
{
	public function __construct()
	{
		parent::__construct();
	}

	public function getPruebas()
	{
		$sql = "";
		$result = $this->_db->getConsulta($sql);
		return $result;
	}


	// public function consulte_munipios()
	// {
	// 	try {
	// 		$sql2 = "SELECT id, municipio, depto, pais
	// 		FROM cmx_municipios WHERE pais='COLOMBIA'";
	// 		$resultado = $this->_db3->query($sql2);
	// 		$resultado->setFetchMode(PDO::FETCH_ASSOC);
	// 		return $resultado->fetchall();
	// 	} catch (PDOException $e) {
	// 		$error = $e->getMessage();
	// 		$this->_db3->rollBack();
	// 	}
	// }


	public function consulte_munipios($pais)
	{
		try {
			// 1. Usamos un marcador de posición (?) para el valor
			$sql2 = "SELECT id, municipio, depto FROM cmx_municipios WHERE pais = ?";

			$stmt = $this->_db3->prepare($sql2);

			// 2. Ejecutamos pasando el parámetro en un array
			$stmt->execute([$pais]);

			// 3. Configuramos el modo de obtención y retornamos
			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			// Log del error (opcional)
			error_log("Error en consulte_munipios: " . $e->getMessage());
			return []; // Retorna un array vacío para no romper el JS
		}
	}

	public function consulte_pais()
	{
		try {
			$sql2 = "SELECT id, pais FROM cmx_municipios GROUP BY pais ORDER BY pais ASC";
			$resultado = $this->_db3->query($sql2);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOException $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function consulte_munipios_punto()
	{
		try {
			$sql2 = "SELECT mn.id, mn.municipio, mn.depto , pp.cod_ciudad
				FROM cmx_municipios mn 
				INNER JOIN cmx_para_punto_ruta pp
				ON mn.id=pp.cod_ciudad
				WHERE mn.pais='COLOMBIA'
				GROUP BY pp.cod_ciudad";
			$resultado = $this->_db3->query($sql2);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOException $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}


	public function Insertar_Punto($nom_punto, $municipio, $descrip, $latitud, $longitud, $user, $fecha, $hora)
	{
		$resultado = $this->_db2->conectar();

		(int) $estado = 1;
		(int) $municipio;
		try {
			$resultado->prepare("insert into cmx_para_punto_ruta (id,nom_punto,cod_ciudad,descripcion_punto,latitud,longitud,estado,fecha,hora,usuario)values(:id,:punto,:lugar,:description,:lati,:long,:statu,:fec,:hor,:usuario)")->execute(
				array(
					':id' => null,
					':punto' => $nom_punto,
					':lugar' => $municipio,
					':description' => $descrip,
					':lati' => $latitud,
					':long' => $longitud,
					':statu' => $estado,
					':fec' => $fecha,
					':hor' => $hora,
					':usuario' => $user
				)
			);

			return 'true';
		} catch (PDOException $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function consulta_tabla($id_municipio)
	{
		try {
			$sql = "SELECT r.id, mr.municipio, r.nom_punto,
				r.latitud, r.longitud, r.estado
				FROM  cmx_para_punto_ruta r
				INNER JOIN cmx_municipios mr
				ON r.cod_ciudad=mr.id
				WHERE mr.id=" . $id_municipio;
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOException $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function consulta_numeros($id_muni)
	{
		try {
			$sql = "SELECT id, latitud, longitud
			FROM cmx_municipios WHERE id=" . $id_muni;
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetch();
		} catch (PDOException $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function insercion_regla($modulo, $tipo, $objetivo, $valor)
	{
		$resultado = $this->_db2->conectar();
		try {
			$resultado->prepare("insert into cmx_reglas_modulo(id,nombre_modulo,clasificacion,valor,objetivo,estado)
				values(:id,:nombre,:clasificacion,:valor,:objetivo,:estado)")->execute(array(
				':id' => null,
				':nombre' => $modulo,
				':clasificacion' => $tipo,
				':valor' => $valor,
				':objetivo' => $objetivo,
				':estado' => 1
			));
			return 'true';
		} catch (PDOException $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
			return 'false';
		}
	}

	public function Consulta_Regla_Sistema($modulo)
	{
		try {
			$sql = "SELECT * 
			FROM cmx_reglas_modulo
			WHERE nombre_modulo='" . $modulo . "'";
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOException $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function ConsultaRegla($idtabla)
	{
		try {
			$sql = "SELECT * 
			FROM cmx_reglas_modulo
			WHERE id='" . $idtabla . "'";
			$resultado = $this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		} catch (PDOException $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function Actualiza_Regla_Sistema($modulo, $clase, $valor, $objetivo, $id)
	{
		$resultado = $this->_db2->conectar();
		try {
			$resultado->prepare("update cmx_reglas_modulo
								set 
								nombre_modulo=:modulo,
								clasificacion=:tipo,
								valor=:valor,
								objetivo=:objetivo
								where id=:id
				")->execute(array(
				':id' => $id,
				':modulo' => $modulo,
				':tipo' => $clase,
				':valor' => $valor,
				':objetivo' => $objetivo
			));
			return 'true';
		} catch (PDOException $e) {
			$error = $e->getMessage();
			$this->_db3->rollBack();
			return 'false';
		}
	}

	public function Listar_clientes()
	{
		try {
			$stmt = $this->_db3->prepare("SELECT * FROM cmx_clientes ORDER BY nombre ASC");
			$stmt->execute();
			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			$error = $e->getMessage();
			// $this->_db3->rollBack();
		}
	}

	public function Listar_novedades_trafico()
	{
		try {
			$stmt = $this->_db3->prepare("SELECT * FROM cmx_para_novedades_seguimiento");
			$stmt->execute();
			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			$error = $e->getMessage();
			// $this->_db3->rollBack();
		}
	}

	public function Guardar_configuracion_correo($cliente, $correo_automatico, $correo_manual, $mensaje_whatsapp, $importacion, $exportacion, $nacional, $urbano, $torre_control, $datos, $datos_horas, $nombre_grupo, $GrupoId)
	{
		$response = [];
		$user = $_SESSION["usuario"]["nom_usuario"];
		$empresa_id = $_SESSION['usuario']['empresa_id'];
		$hora = date('H:i:s');
		$fecha = date('Y-m-d');
		$estado_configuracion = 'ACTIVO';

		// Iniciar la transacción
		$this->_db3->beginTransaction();
		try {
			// Primera inserción en cmx_configuracion_envios
			$sql = $this->_db3->prepare("INSERT INTO cmx_configuracion_envios (cliente_id, grupo_id, nombre_grupo, envio_automatico, envio_manual, envio_whatsapp, importacion, exportacion, nacional, urbano, torre_control, estado_configuracion, usuario, fecha, hora, empresa_id) 
            VALUES (:cliente_id, :grupo_id, :nombre_grupo, :envio_automatico, :envio_manual, :envio_whatsapp, :importacion, :exportacion, :nacional, :urbano, :torre_control, :estado_configuracion, :usuario, :fecha, :hora, :empresa_id)");
			// $sql->bindParam(param: ':cliente_id', $cliente);
			$sql->bindParam(':cliente_id', $cliente);
			$sql->bindParam(':grupo_id', $GrupoId);
			$sql->bindParam(':nombre_grupo', $nombre_grupo);
			$sql->bindParam(':envio_automatico', $correo_automatico);
			$sql->bindParam(':envio_manual', $correo_manual);
			$sql->bindParam(':envio_whatsapp', $mensaje_whatsapp);
			$sql->bindParam(':importacion', $importacion);
			$sql->bindParam(':exportacion', $exportacion);
			$sql->bindParam(':nacional', $nacional);
			$sql->bindParam(':urbano', $urbano);
			$sql->bindParam(':torre_control', $torre_control);
			$sql->bindParam(':estado_configuracion', $estado_configuracion);
			$sql->bindParam(':usuario', $user);
			$sql->bindParam(':fecha', $fecha);
			$sql->bindParam(':hora', $hora);
			$sql->bindParam(':empresa_id', $empresa_id);
			$sql->execute();
			if ($sql) {
				// Obtener el ID del registro recién insertado
				$lastInsertId = $this->_db3->lastInsertId();

				$sql_detalle = $this->_db3->prepare("INSERT INTO cmx_detalle_configuracion_envio (configuracion_id, nombre, correo, celular, estado_detalle, usuario, fecha, hora, empresa_id) 
				VALUES(:configuracion_id, :nombre, :correo, :celular, :estado_detalle, :usuario, :fecha, :hora, :empresa_id)");

				if (!empty($datos['datos']['nombre'])) {
					foreach ($datos['datos']['nombre'] as $i => $nombre) {
						$correo  = $datos['datos']['correo'][$i] ?? null;
						$celular = $datos['datos']['celular'][$i] ?? null;
						$estado_detalle = 'ACTIVO';

						$sql_detalle->bindParam(':configuracion_id', $lastInsertId);
						$sql_detalle->bindParam(':nombre', $nombre);
						$sql_detalle->bindParam(':correo', $correo);
						$sql_detalle->bindParam(':celular', $celular);
						$sql_detalle->bindParam(':estado_detalle', $estado_detalle);
						$sql_detalle->bindParam(':usuario', $user);
						$sql_detalle->bindParam(':fecha', $fecha);
						$sql_detalle->bindParam(':hora', $hora);
						$sql_detalle->bindParam(':empresa_id', $empresa_id);

						$sql_detalle->execute();
					}
				}

				//Insertar las horas de envio del correo electronico
				$sql_hora = $this->_db3->prepare("INSERT INTO cmx_horas_configuracion (configuracion_id,hora_envio,estado_hora,usuario,fecha,hora,empresa_id)
				VALUES(:configuracion_id,:hora_envio,:estado_hora,:usuario,:fecha,:hora,:empresa_id)");

				if (!empty($datos_horas['datosHoras']['hora'])) {
					foreach ($datos_horas['datosHoras']['hora'] as $key => $horaEnvio) {
						$estado_detalle = 'ACTIVO';
						$sql_hora->bindParam(':configuracion_id', $lastInsertId);
						$sql_hora->bindParam(':hora_envio', $horaEnvio);
						$sql_hora->bindParam(':estado_hora', $estado_detalle);
						$sql_hora->bindParam(':usuario', $user);
						$sql_hora->bindParam(':fecha', $fecha);
						$sql_hora->bindParam(':hora', $hora);
						$sql_hora->bindParam(':empresa_id', $empresa_id);
						$sql_hora->execute();
					}
				}

				// Confirmar la transacción si todas las operaciones fueron exitosas
				$this->_db3->commit();
				$response['status'] = "success";
				$response['message'] = "Configuracion insertada conrrectamente";
			} else {
				throw new Exception("Error en la primera inserción.");
			}
		} catch (Throwable $th) {
			// Revertir la transacción si hubo algún error
			$this->_db3->rollBack();
			$response['status'] = "error";
			$response['message'] = "Error: " . $th->getMessage();
		}

		// Puedes imprimir el response o retornarlo
		return $response;
	}

	public function Consultar_datos_contactos($cliente)
	{
		try {
			$stmt = $this->_db3->prepare("SELECT g.nombre_grupo, c.nombre, gc.nombre_contactos, gc.telefono, gc.cargo, gc.areaa, gc.email,gc.id AS contacto_id,g.id AS grupo_id
							FROM cmx_grupo g
							INNER JOIN cmx_grupo_contacto_cliente gc ON g.id = gc.idgrupo
							INNER JOIN cmx_clientes c ON g.id_cliente = c.id
							WHERE g.id_cliente = :Cliente
					");
			$stmt->bindParam(':Cliente', $cliente);
			$stmt->execute();
			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			$error = $e->getMessage();
			// Maneja el error si es necesario
		}
	}

	public function Consultar_total_contactos($cliente)
	{
		try {
			$stmt = $this->_db3->prepare("SELECT g.nombre_grupo, COUNT(gc.id) AS total_contactos
							FROM cmx_grupo g
							INNER JOIN cmx_grupo_contacto_cliente gc ON g.id = gc.idgrupo
							WHERE g.id_cliente = :Cliente
							GROUP BY g.id
					");
			$stmt->bindParam(':Cliente', $cliente);
			$stmt->execute();
			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			$error = $e->getMessage();
			// Maneja el error si es necesario
		}
	}

	public function Consultar_grupo_cliente($cliente)
	{
		$datosContactos = $this->Consultar_datos_contactos($cliente);
		$totalContactos = $this->Consultar_total_contactos($cliente);

		// Unimos los resultados en un solo array de respuesta
		return [
			'datos_contactos' => $datosContactos,
			'total_contactos' => $totalContactos,
		];
	}

	public function Consultar_novedad_cliente($cliente)
	{
		try {
			$stmt = $this->_db3->prepare("SELECT *
			FROM cmx_configuracion_envios ce
			INNER JOIN cmx_plantilla_novedad_email cn ON ce.cliente_id=cn.cliente_id
			INNER JOIN cmx_para_novedades_seguimiento ns ON cn.novedad_id=ns.id
			WHERE cn.reporta_cliente='SI' AND ce.cliente_id=:Cliente");
			$stmt->bindParam(':Cliente', $cliente);
			$stmt->execute();
			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			$error = $e->getMessage();
			// $this->_db3->rollBack();
		}
	}

	public function Guardar_configuracion_contactos($data)
	{

		$response = [];
		$user = $_SESSION["usuario"]["nom_usuario"];
		$empresa_id = $_SESSION['usuario']['empresa_id'];
		$hora = date('H:i:s');
		$fecha = date('Y-m-d');
		$estado_contacto_envio = 'ACTIVO';
		// Iniciar la transacción
		$this->_db3->beginTransaction();

		try {
			if (isset($data['novedades'])) {
				$novedades = $data['novedades'];

				// Prepara la consulta para insertar los datos
				$stmt = $this->_db3->prepare("INSERT INTO cmx_envio_contacto_cliente (grupo_id, contacto_id,novedad_id,estado_contacto_envio,usuario,fecha,hora,empresa_id)
				 VALUES (:grupo_id,:contacto_id, :novedad_id,:estado_contacto_envio,:usuario,:fecha,:hora,:empresa_id)");

				// Ejecuta la consulta para cada novedad seleccionada
				foreach ($novedades as $novedad) {
					$stmt->execute([
						':grupo_id' => $novedad['grupo_id'],
						':contacto_id' => $novedad['contacto_id'],
						':novedad_id' => $novedad['novedad_id'],
						':estado_contacto_envio' => $estado_contacto_envio,
						':usuario' => $user,
						':fecha' => $fecha,
						':hora' => $hora,
						':empresa_id' => $empresa_id,
					]);
				}

				$this->_db3->commit();
				$response['status'] = "success";
				$response['message'] = "Configuracion insertada conrrectamente";
				// echo json_encode(['status' => 'success', 'message' => 'Novedades guardadas correctamente']);
			} else {
				// Respuesta en caso de error
				$response['status'] = "false";
				$response['message'] = "No se recibieron novedades";
				// echo json_encode(['status' => 'error', 'message' => 'No se recibieron novedades']);
			}
		} catch (\Throwable $th) {
			//throw $th;
			// Revertir la transacción si hubo algún error
			$this->_db3->rollBack();
			$response['status'] = "error";
			$response['message'] = "Error: " . $th->getMessage();
		}

		return $response;
	}

	/* Funcioesn de privedor */
	// public function Insertar_Proveedor_Torre_Control($datos)
	// {
	// 	try {
	// 		// session_start();
	// 		$empresa_id = $_SESSION['usuario']['empresa_id'] ?? null;
	// 		$nom_usuario = $_SESSION['usuario']['nom_usuario'] ?? null;

	// 		if (!$empresa_id) {
	// 			return ['status' => false, 'message' => 'No se encontró empresa_id en la sesión'];
	// 		}

	// 		// Iniciar la transacción
	// 		$this->_db3->beginTransaction();

	// 		// Validar si el NIT ya existe
	// 		$sqlVerificar = "SELECT COUNT(*) FROM cmx_proveedor_torre_control WHERE documento = :documento AND empresa_id = :empresa_id";
	// 		$stmtVerificar = $this->_db3->prepare($sqlVerificar);
	// 		$stmtVerificar->execute([
	// 			'documento' => $datos['documento'],
	// 			'empresa_id' => $empresa_id
	// 		]);

	// 		if ($stmtVerificar->fetchColumn() > 0) {
	// 			$this->_db3->rollBack(); // Deshacer cambios
	// 			return ['status' => false, 'message' => 'El NIT ya está registrado para esta empresa'];
	// 		}

	// 		// Insertar el proveedor
	// 		$sql = "INSERT INTO cmx_proveedor_torre_control (tipo_documento, regimen, razon_social, documento, digito_verificacion, ciudad_id, direccion, telefono, correo, contacto, numero_contacto, estado_proveedor, tipo_proveedor, usuario, fecha, hora, empresa_id) 
	// 							VALUES (:tipo_documento, :regimen, :razon_social, :documento, :digito_verificacion, :ciudad_id, :direccion, :telefono, :correo, :contacto, :numero_contacto, :estado_proveedor, :tipo_proveedor, :usuario, :fecha, :hora, :empresa_id)";

	// 		$stmt = $this->_db3->prepare($sql);

	// 		// Corregir asignación de usuario y empresa_id
	// 		$datos['usuario'] = $nom_usuario;
	// 		$datos['empresa_id'] = $empresa_id;

	// 		if ($stmt->execute($datos)) {
	// 			$this->_db3->commit(); // Confirmar la transacción
	// 			return ['status' => true, 'message' => 'Proveedor registrado exitosamente'];
	// 		} else {
	// 			$this->_db3->rollBack(); // Deshacer cambios si algo falla
	// 			return ['status' => false, 'message' => 'Error al registrar el proveedor'];
	// 		}
	// 	} catch (PDOException $e) {
	// 		$this->_db3->rollBack(); // Deshacer cambios en caso de error
	// 		return ['status' => false, 'message' => 'Error en la base de datos: ' . $e->getMessage()];
	// 	} catch (Exception $e) {
	// 		$this->_db3->rollBack();
	// 		return ['status' => false, 'message' => 'Error inesperado: ' . $e->getMessage()];
	// 	}
	// }

	public function Insertar_Proveedor_Torre_Control($datos, $sedes = [])
	{
		try {
			// Obtener datos de sesión
			$empresa_id = $_SESSION['usuario']['empresa_id'] ?? null;
			$nom_usuario = $_SESSION['usuario']['nom_usuario'] ?? null;

			if (!$empresa_id) {
				return ['status' => false, 'message' => 'Sesión expirada o no válida.'];
			}

			// --- INICIO DE LA TRANSACCIÓN ---
			$this->_db3->beginTransaction();

			// 1. Insertar Proveedor Principal
			$sqlProv = "INSERT INTO cmx_proveedor_torre_control 
                    (tipo_documento, regimen, razon_social, documento, digito_verificacion, ciudad_id, direccion, telefono, correo, contacto, numero_contacto, estado_proveedor, tipo_proveedor, usuario, fecha, hora, empresa_id) 
                    VALUES 
                    (:tipo_documento, :regimen, :razon_social, :documento, :digito_verificacion, :ciudad_id, :direccion, :telefono, :correo, :contacto, :numero_contacto, :estado_proveedor, :tipo_proveedor, :usuario, :fecha, :hora, :empresa_id)";

			$datos['usuario'] = $nom_usuario;
			$datos['empresa_id'] = $empresa_id;

			$stmtProv = $this->_db3->prepare($sqlProv);
			$stmtProv->execute($datos);

			// Obtener el ID generado para el proveedor
			$proveedor_id = $this->_db3->lastInsertId();

			// 2. Insertar Sedes (Solo si es 4Pl y hay sedes enviadas)
			if ($datos['tipo_proveedor'] === '4Pl' && !empty($sedes)) {
				$sqlSede = "INSERT INTO cmx_sede_proveedores 
                        (proveedor_id, pais, municipio_id, nombre_sede, estado_sede, usuario, fecha, hora, empresa_id) 
                        VALUES 
                        (:id_p, :pais, :muni, :nom, 'Activa', :usu, :fec, :hor, :emp)";

				$stmtSede = $this->_db3->prepare($sqlSede);

				foreach ($sedes as $s) {
					$stmtSede->execute([
						'id_p'  => $proveedor_id,
						'pais'  => $s['pais'],
						'muni'  => $s['municipio_id'],
						'nom'   => $s['nombre_direccion'], // Verificado según tu objeto JS
						'usu'   => $nom_usuario,
						'fec'   => $datos['fecha'],
						'hor'   => $datos['hora'],
						'emp'   => $empresa_id
					]);
				}
			}

			// --- SI TODO SALIÓ BIEN, CONFIRMAR ---
			$this->_db3->commit();

			return [
				'status' => true,
				'message' => 'Proveedor y sedes registrados exitosamente.'
			];
		} catch (PDOException $e) {
			// --- ROLLBACK EN CASO DE ERROR DE SQL ---
			if ($this->_db3->inTransaction()) {
				$this->_db3->rollBack();
			}
			return ['status' => false, 'message' => 'Error de Base de Datos: ' . $e->getMessage()];
		} catch (Exception $e) {
			// --- ROLLBACK EN CASO DE CUALQUIER OTRO ERROR ---
			if ($this->_db3->inTransaction()) {
				$this->_db3->rollBack();
			}
			return ['status' => false, 'message' => 'Error General: ' . $e->getMessage()];
		}
	}

	public function consultarProveedorPorId($id)
	{
		try {
			// Obtenemos el empresa_id de la sesión para asegurar que el usuario
			// solo pueda consultar proveedores de su propia empresa (Seguridad)
			$empresa_id = $_SESSION['usuario']['empresa_id'] ?? null;

			if (!$empresa_id) {
				return null;
			}

			// Usamos un JOIN para traer el nombre de la ciudad si es necesario
			$sql = "SELECT p.*, c.municipio as nombre_ciudad 
                FROM cmx_proveedor_torre_control p
                LEFT JOIN cmx_municipios c ON p.ciudad_id = c.id
                WHERE p.id = :id AND p.empresa_id = :empresa_id";

			$stmt = $this->_db3->prepare($sql);
			$stmt->execute([
				'id' => $id,
				'empresa_id' => $empresa_id
			]);

			// Retornamos una sola fila como array asociativo
			return $stmt->fetch(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			error_log("Error en consultarProveedorPorId: " . $e->getMessage());
			return null;
		}
	}

	public function consultarSedesPorProveedor($proveedor_id)
	{
		try {
			$empresa_id = $_SESSION['usuario']['empresa_id'] ?? null;

			if (!$empresa_id) {
				return [];
			}

			// Consultamos las sedes uniendo con municipios para tener los nombres claros
			$sql = "SELECT 
                    s.id, 
                    s.pais, 
                    s.municipio_id, 
                    s.nombre_sede, 
                    s.estado_sede,
                    m.municipio as nombre_municipio,
                    m.depto as nombre_departamento
                FROM cmx_sede_proveedores s
                LEFT JOIN cmx_municipios m ON s.municipio_id = m.id
                WHERE s.proveedor_id = :proveedor_id 
                AND s.empresa_id = :empresa_id
                ORDER BY s.id ASC";

			$stmt = $this->_db3->prepare($sql);
			$stmt->execute([
				'proveedor_id' => $proveedor_id,
				'empresa_id'   => $empresa_id
			]);

			// Retornamos todas las sedes encontradas
			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			error_log("Error en consultarSedesPorProveedor: " . $e->getMessage());
			return [];
		}
	}

	public function Actualizar_Proveedor_Torre_Control($datosProv, $sedesNuevas = [], $sedesEditadas = [])
	{
		try {
			// Datos de auditoría desde la sesión
			$empresa_id = $_SESSION['usuario']['empresa_id'] ?? null;
			$nom_usuario = $_SESSION['usuario']['nom_usuario'] ?? null;
			$fecha_actual = date('Y-m-d');
			$hora_actual = date('H:i:s');

			if (!$empresa_id) {
				return ['status' => false, 'message' => 'Sesión no válida o empresa_id ausente.'];
			}

			// --- INICIO DE TRANSACCIÓN ---
			$this->_db3->beginTransaction();

			// 1. Actualización de datos maestros del proveedor
			// 1. Actualizar Proveedor
			$sqlProv = "UPDATE cmx_proveedor_torre_control SET 
                        tipo_documento = :tipo_documento,
                        regimen = :regimen,
                        razon_social = :razon_social,
                        digito_verificacion = :digito_verificacion,
                        ciudad_id = :ciudad_id,
                        direccion = :direccion,
                        telefono = :telefono,
                        correo = :correo,
                        contacto = :contacto,
                        numero_contacto = :numero_contacto,
                        estado_proveedor = :estado_proveedor,
                        usuario = :usuario_edicion,
                        fecha = :fecha_edicion
                    WHERE id = :id AND empresa_id = :empresa_id";

			$stmtProv = $this->_db3->prepare($sqlProv);
			$stmtProv->execute([
				// Usamos un valor por defecto si tipo_documento llega vacío para evitar "Data truncated"
				'tipo_documento'      => !empty($datosProv['tipo_documento']) ? $datosProv['tipo_documento'] : 'Natural',
				'regimen'             => $datosProv['regimen'],
				'razon_social'        => $datosProv['razon_social'],
				'digito_verificacion' => $datosProv['digito_verificacion'],
				'ciudad_id'           => $datosProv['ciudad_id'],
				'direccion'           => $datosProv['direccion'],
				'telefono'            => $datosProv['telefono'],
				'correo'              => $datosProv['correo'],
				'contacto'            => $datosProv['contacto'],
				'numero_contacto'     => $datosProv['numero_contacto'],
				'estado_proveedor'    => $datosProv['estado_proveedor'],
				'usuario_edicion'     => $_SESSION['usuario']['nom_usuario'],
				'fecha_edicion'       => date('Y-m-d'),
				'id'                  => $datosProv['id'],
				'empresa_id'          => $_SESSION['usuario']['empresa_id']
			]);

			// 2. Procesar Sedes solo si es 4Pl
			if ($datosProv['tipo_proveedor'] === '4Pl') {

				// A. ACTUALIZAR sedes que ya existen (solo cambia el nombre/dirección o estado)
				// if (!empty($sedesEditadas)) {
				// 	$sqlSedeEdit = "UPDATE cmx_sede_proveedores SET 
				//                             nombre_sede = :nom, 
				//                             pais = :pais,
				//                             municipio_id = :muni,
				//                             usuario = :usu, 
				//                             fecha = :fec 
				//                         WHERE id = :id_sede AND proveedor_id = :id_p";

				// 	$stmtSedeEdit = $this->_db3->prepare($sqlSedeEdit);

				// 	foreach ($sedesEditadas as $se) {
				// 		$stmtSedeEdit->execute([
				// 			'nom'     => $se['nombre_sede'] ?? '',
				// 			'pais'    => $se['pais'] ?? '',         // Esto evita el Warning de Undefined Index
				// 			'muni'    => $se['municipio_id'] ?? 0,  // Esto evita el Warning de Undefined Index
				// 			'usu'     => $nom_usuario,
				// 			'fec'     => $fecha_actual,
				// 			'id_sede' => $se['id'],
				// 			'id_p'    => $datosProv['id']
				// 		]);
				// 	}
				// }

				if (!empty($sedesEditadas)) {
					$sqlSedeEdit = "UPDATE cmx_sede_proveedores SET nombre_sede = :nom, pais = :pais, municipio_id = :muni WHERE id = :id_sede";
					$stmtSedeEdit = $this->_db3->prepare($sqlSedeEdit);

					foreach ($sedesEditadas as $se) {
						// SOLO ejecutar si municipio_id es válido (mayor a 0)
						if (isset($se['municipio_id']) && (int)$se['municipio_id'] > 0) {
							$stmtSedeEdit->execute([
								'nom'     => $se['nombre_sede'],
								'pais'    => $se['pais'],
								'muni'    => $se['municipio_id'],
								'id_sede' => $se['id']
							]);
						}
					}
				}

				// B. INSERTAR sedes nuevas agregadas en la vista de edición
				if (!empty($sedesNuevas)) {
					$sqlSedeNew = "INSERT INTO cmx_sede_proveedores 
                                (proveedor_id, pais, municipio_id, nombre_sede, estado_sede, usuario, fecha, hora, empresa_id) 
                                VALUES 
                                (:id_p, :pais, :muni, :nom, 'Activa', :usu, :fec, :hor, :emp)";

					$stmtSedeNew = $this->_db3->prepare($sqlSedeNew);

					foreach ($sedesNuevas as $sn) {
						$stmtSedeNew->execute([
							'id_p'  => $datosProv['id'],
							'pais'  => $sn['pais'],
							'muni'  => $sn['municipio_id'],
							'nom'   => $sn['nombre_sede'],
							'usu'   => $nom_usuario,
							'fec'   => $fecha_actual,
							'hor'   => $hora_actual,
							'emp'   => $empresa_id
						]);
					}
				}
			}

			// --- COMMIT: CONFIRMAR CAMBIOS ---
			$this->_db3->commit();
			return ['status' => true, 'message' => 'Proveedor y sedes actualizados correctamente'];
		} catch (PDOException $e) {
			// --- ROLLBACK: DESHACER TODO SI ALGO FALLA ---
			if ($this->_db3->inTransaction()) {
				$this->_db3->rollBack();
			}
			return ['status' => false, 'message' => 'Error de BD: ' . $e->getMessage()];
		} catch (Exception $e) {
			if ($this->_db3->inTransaction()) {
				$this->_db3->rollBack();
			}
			return ['status' => false, 'message' => 'Error General: ' . $e->getMessage()];
		}
	}

	public function Listar_Proveedor_Torre_Control()
	{
		$sql = "SELECT * FROM cmx_proveedor_torre_control";
		$stmt = $this->_db3->prepare($sql);
		$stmt->execute();
		// $stmt->execute(['empresa_id' => $empresa_id]);
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public function Consultar_Proveedor_Torre_Control()
	{
		$sql = "SELECT pt.id AS id_proveedor,pt.tipo_documento,pt.regimen,pt.razon_social,CONCAT(pt.documento,'-',IFNULL(pt.digito_verificacion,'')) AS documento_proveedor,
			CONCAT(m.municipio,' ',m.depto) AS ciudad_proveedor,pt.direccion,pt.telefono,pt.correo,pt.contacto,pt.numero_contacto,pt.estado_proveedor
			FROM cmx_proveedor_torre_control pt
			INNER JOIN cmx_municipios m ON pt.ciudad_id=m.id";
		$stmt = $this->_db3->prepare($sql);
		$stmt->execute();
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public function Consultar_Clientes_Asignados_Proveedor($ProveedorId)
	{
		$sql = "SELECT cl.nombre,cl.telefono,cpt.estado_asignacion,cl.email FROM cmx_proveedor_torre_control pt 
							INNER JOIN cmx_cliente_proveedor_torre_control cpt ON pt.id=cpt.proveedor_id
							INNER JOIN cmx_clientes cl ON cpt.cliente_id=cl.id
							WHERE pt.id=:ProveedorId";
		$stmt = $this->_db3->prepare($sql);
		$stmt->bindParam(':ProveedorId', $ProveedorId);
		$stmt->execute();
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public function Asignar_Proveedor_Torre_Control($proveedor, $clientes)
	{
		try {
			$empresa_id = $_SESSION['usuario']['empresa_id'] ?? null;
			$nom_usuario = $_SESSION['usuario']['nom_usuario'] ?? null;

			if (!$empresa_id) {
				return ['status' => false, 'message' => 'No se encontró empresa_id en la sesión'];
			}

			// Iniciar la transacción
			$this->_db3->beginTransaction();

			// Consulta para verificar si la combinación ya existe
			$sql_check = "SELECT cl.id, cl.nombre 
								FROM cmx_cliente_proveedor_torre_control cp
								INNER JOIN cmx_clientes cl ON cp.cliente_id = cl.id 
								WHERE cp.proveedor_id = :proveedor_id AND cp.cliente_id = :cliente_id";
			$stmt_check = $this->_db3->prepare($sql_check);

			// Consulta para insertar
			$sql_insert = "INSERT INTO cmx_cliente_proveedor_torre_control 
								 (proveedor_id, cliente_id, estado_asignacion, usuario, fecha, hora, empresa_id) 
								 VALUES (:proveedor_id, :cliente_id, :estado_asignacion, :usuario, :fecha, :hora, :empresa_id)";
			$stmt_insert = $this->_db3->prepare($sql_insert);

			$duplicados = [];

			foreach ($clientes as $cliente) {
				// Verificar si la combinación ya existe y obtener el nombre del cliente
				$stmt_check->execute([
					'proveedor_id' => $proveedor,
					'cliente_id' => $cliente
				]);

				$cliente_existente = $stmt_check->fetch(PDO::FETCH_ASSOC);

				if ($cliente_existente) {
					// Guardamos el nombre del cliente duplicado en lugar del ID
					$duplicados[] = $cliente_existente['nombre'];
					continue; // Pasamos al siguiente cliente sin insertarlo
				}

				// Insertar solo si no es duplicado
				$stmt_insert->execute([
					'proveedor_id' => $proveedor,
					'cliente_id' => $cliente,
					'estado_asignacion' => 'Activo',
					'usuario' => $nom_usuario,
					'fecha' => date('Y-m-d'),
					'hora' => date('H:i:s'),
					'empresa_id' => $empresa_id
				]);
			}

			// Confirmar la transacción si al menos un registro fue insertado
			$this->_db3->commit();

			if (!empty($duplicados)) {
				return [
					'status' => false,
					'message' => 'Los siguientes clientes ya estaban asignados: ' . implode(', ', $duplicados),
					'duplicados' => $duplicados
				];
			}

			return ['status' => true, 'message' => 'Proveedor asignado exitosamente a los clientes'];
		} catch (PDOException $e) {
			// Revertir cambios en caso de error
			$this->_db3->rollBack();
			return ['status' => false, 'message' => 'Error en la base de datos: ' . $e->getMessage()];
		}
	}

	public function Guardar_Servicio($servicio, $descripcion, $estado)
	{
		try {
			$empresa_id = $_SESSION['usuario']['empresa_id'] ?? null;
			$nom_usuario = $_SESSION['usuario']['nom_usuario'] ?? null;

			if (!$empresa_id) {
				return ['status' => false, 'message' => 'No se encontró empresa_id en la sesión'];
			}

			// Iniciar la transacción
			$this->_db3->beginTransaction();

			// Insertar el proveedor
			$sql_insert = "INSERT INTO cmx_servicio_torre_control (tipo_servicio, descripcion, esatdo_servicio, usuario, fecha, hora, empresa_id) VALUES (:servicio, :descripcion, :estado, :usuario, :fecha, :hora, :empresa_id)";
			$stmt_insert = $this->_db3->prepare($sql_insert);
			$stmt_insert->execute([
				'servicio' => $servicio,
				'descripcion' => $descripcion,
				'estado' => $estado,
				'usuario' => $nom_usuario,
				'fecha' => date('Y-m-d'),
				'hora' => date('H:i:s'),
				'empresa_id' => $empresa_id
			]);

			// Confirmar la transacción
			$this->_db3->commit();

			return ['status' => true, 'message' => 'Servicio creado exitosamente'];
		} catch (PDOException $e) {
			// Revertir cambios en caso de error
			$this->_db3->rollBack();
			return ['status' => false, 'message' => 'Error en la base de datos: ' . $e->getMessage()];
		}
	}

	public function Listar_Asignacion_Servicios_Torre_Control()
	{
		$sql = $this->_db3->prepare("SELECT * FROM cmx_servicio_torre_control");
		$sql->execute();
		return $sql->fetchAll(PDO::FETCH_ASSOC);
	}

	public function Guardar_Asignacion_Servicio($servicios, $proveedor)
	{
		try {
			$empresa_id = $_SESSION['usuario']['empresa_id'] ?? null;
			$nom_usuario = $_SESSION['usuario']['nom_usuario'] ?? null;

			if (!$empresa_id) {
				return ['status' => false, 'message' => 'No se encontró empresa_id en la sesión'];
			}

			// Iniciar la transacción
			$this->_db3->beginTransaction();

			$duplicados = [];
			$asignados = [];

			foreach ($servicios as $servicio) {
				// Verificar si ya existe la asignación
				$sql_check = "SELECT COUNT(*) FROM cmx_servicio_proveedor_torre_control 
															WHERE proveedor_id = :proveedor AND servicio_id = :servicio AND empresa_id = :empresa_id";
				$stmt_check = $this->_db3->prepare($sql_check);
				$stmt_check->execute([
					'proveedor' => $proveedor,
					'servicio' => $servicio,
					'empresa_id' => $empresa_id
				]);
				$existe = $stmt_check->fetchColumn();

				if ($existe > 0) {
					$duplicados[] = $servicio;
					continue; // Si ya existe, saltamos la inserción
				}

				// Insertar el proveedor con el servicio
				$sql_insert = "INSERT INTO cmx_servicio_proveedor_torre_control (proveedor_id, servicio_id, estado_asignacion_servicio, usuario, fecha, hora, empresa_id) 
															 VALUES (:proveedor, :servicio, 'activo', :usuario, :fecha, :hora, :empresa_id)";
				$stmt_insert = $this->_db3->prepare($sql_insert);
				$stmt_insert->execute([
					'proveedor' => $proveedor,
					'servicio' => $servicio,
					'usuario' => $nom_usuario,
					'fecha' => date('Y-m-d'),
					'hora' => date('H:i:s'),
					'empresa_id' => $empresa_id
				]);

				$asignados[] = $servicio;
			}

			// Confirmar la transacción
			$this->_db3->commit();

			// Mensaje personalizado según resultados
			$message = 'Servicios asignados exitosamente.';
			if (!empty($duplicados)) {
				$message .= ' Sin embargo, estos servicios ya estaban asignados: ' . implode(", ", $duplicados);
			}

			return ['status' => true, 'message' => $message, 'asignados' => $asignados, 'duplicados' => $duplicados];
		} catch (\Throwable $e) {
			// Revertir cambios en caso de error
			$this->_db3->rollBack();
			return ['status' => false, 'message' => 'Error en la base de datos: ' . $e->getMessage()];
		}
	}

	public function Consultar_Servicios_Torre_Control()
	{
		$sql = $this->_db3->prepare("SELECT * FROM cmx_servicio_torre_control");
		$sql->execute();
		return $sql->fetchAll(PDO::FETCH_ASSOC);
	}

	public function Listar_proveedores_asignados($ServicioId)
	{
		$sql = $this->_db3->prepare("SELECT pt.id,pt.razon_social,pt.telefono,spt.estado_asignacion_servicio,pt.correo FROM cmx_servicio_torre_control st 
			INNER JOIN cmx_servicio_proveedor_torre_control spt ON st.id=spt.servicio_id
			INNER JOIN cmx_proveedor_torre_control pt ON spt.proveedor_id=pt.id
			WHERE st.id=:ServicioId");
		$sql->bindParam(':ServicioId', $ServicioId, PDO::PARAM_INT);
		$sql->execute();
		return $sql->fetchAll(PDO::FETCH_ASSOC);
	}

	public function Insertar_Lote($datos)
	{
		$empresa_id = $_SESSION['usuario']['empresa_id'] ?? null;
		$nom_usuario = $_SESSION['usuario']['nom_usuario'] ?? null;

		$codigo_inicial = $datos['codigo_inicial'];
		$codigo_final = $datos['codigo_final'];
		$tipo_precinto = $datos['tipo_precinto'];
		$fecha = date('Y-m-d');
		$hora = date('H:i:s');

		// Validaciones mínimas
		if (!$codigo_inicial || !$codigo_final || !$tipo_precinto || !$empresa_id || !$nom_usuario) {
			return ['status' => 'error', 'mensaje' => 'Datos incompletos'];
		}

		// Extraer número e identificar prefijo
		$inicio = intval(preg_replace('/\D/', '', $codigo_inicial));
		$fin = intval(preg_replace('/\D/', '', $codigo_final));
		// $prefijo = preg_replace('/\d+/', '', $codigo_inicial);

		if ($inicio > $fin) {
			return ['status' => 'error', 'mensaje' => 'El código inicial no puede ser mayor que el final'];
		}

		try {
			$this->_db3->beginTransaction();

			$sql = "INSERT INTO cmx_precinto (codigo_precinto, tipo_precinto, estado_precinto,agencia_asignada, usuario, fecha, hora, empresa_id)
                VALUES (:codigo, :tipo, 'disponible', 'Almacén', :usuario, :fecha, :hora, :empresa_id)";

			$stmt = $this->_db3->prepare($sql);

			for ($i = $inicio; $i <= $fin; $i++) {
				// $codigo_precinto = $prefijo . str_pad($i, 4, '0', STR_PAD_LEFT);
				$codigo_precinto = str_pad($i, 4, '0', STR_PAD_LEFT);

				// Validación opcional: evitar duplicados
				$verificar = $this->_db3->prepare("SELECT COUNT(*) FROM cmx_precinto WHERE codigo_precinto = :codigo");
				$verificar->execute([':codigo' => $codigo_precinto]);
				if ($verificar->fetchColumn() > 0) {
					continue; // omitir si ya existe
				}

				$stmt->execute([
					':codigo' => $codigo_precinto,
					':tipo' => $tipo_precinto,
					':usuario' => $nom_usuario,
					':fecha' => $fecha,
					':hora' => $hora,
					':empresa_id' => $empresa_id
				]);
			}

			$this->_db3->commit();

			return ['status' => 'ok', 'mensaje' => 'Lote insertado correctamente'];
		} catch (PDOException $e) {
			if (isset($pdo)) {
				$this->_db3->rollBack();
			}
			return ['status' => 'error', 'mensaje' => 'Error al insertar lote: ' . $e->getMessage()];
		}
	}

	public function Listar_Precintos()
	{
		$sql = "SELECT p.id, p.codigo_precinto, p.tipo_precinto, p.estado_precinto, p.usuario, CONCAT(p.fecha, ' ', p.hora) AS fecha_ingreso, p.empresa_id, p.agencia_asignada
				FROM cmx_precinto p"; // Limitamos a 100 para evitar sobrecargar la consulta
		$stmt = $this->_db3->prepare($sql);
		$stmt->execute();
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public function verificar_precintos_asignados($oficina, $tipo, $desde, $hasta)
	{
		// Contar total precintos en el rango (sin filtro de tipo ni asignación)
		$sql_total = "SELECT COUNT(*) as total FROM cmx_precinto WHERE codigo_precinto BETWEEN ? AND ?";
		$stmt_total = $this->_db3->prepare($sql_total);
		$stmt_total->execute([$desde, $hasta]);
		$total = $stmt_total->fetch(PDO::FETCH_ASSOC)['total'];

		// Contar precintos en el rango que cumplen el tipo y están sin asignar
		$sql_valido = "SELECT COUNT(*) as total FROM cmx_precinto 
                   WHERE codigo_precinto BETWEEN ? AND ? 
                     AND tipo_precinto = ? 
                     AND agencia_asignada='Almacén' AND estado_precinto='disponible'";
		$stmt_valido = $this->_db3->prepare($sql_valido);
		$stmt_valido->execute([$desde, $hasta, $tipo]);
		$validos = $stmt_valido->fetch(PDO::FETCH_ASSOC)['total'];

		// Validar si todos los precintos en el rango cumplen la condición
		if ($total == 0) {
			return [
				'valido' => false,
				'cantidad' => 0,
				'mensaje' => 'No existen precintos en ese rango.'
			];
		} elseif ($total == $validos) {
			return [
				'valido' => true,
				'cantidad' => $validos,
				'mensaje' => 'El rango es válido para ese tipo de precinto y están disponibles.'
			];
		} else {
			return [
				'valido' => false,
				'cantidad' => $validos,
				'mensaje' => 'El rango no corresponde completamente al tipo especificado o algunos precintos están asignados.'
			];
		}
	}

	// public function asignar_precintos_por_rango($oficina, $tipo_movimiento, $origen, $desde, $hasta, $usuario, $observacion = '', $empresa_id = null)
	public function asignar_precintos_por_rango($agencia_origen, $agencia_destino, $tipo_precinto, $tipo, $desde, $hasta, $observacion)
	{
		try {
			$this->_db3->beginTransaction();

			// Actualizar oficina asignada en cmx_precinto
			$sql_update = "UPDATE cmx_precinto  SET agencia_asignada = ? WHERE codigo_precinto BETWEEN ? AND ?";
			$stmt_update = $this->_db3->prepare($sql_update);
			$stmt_update->execute([$agencia_destino, $desde, $hasta]);

			// Insertar movimiento en cmx_precintos_movimientos
			$rango_codigo = $desde . '-' . $hasta;
			// $cantidad = ($hasta - $desde) + 1;
			$desde = (int) $desde;
			$hasta = (int) $hasta;
			$cantidad = ($hasta - $desde) + 1;

			$fecha = date('Y-m-d');
			$hora = date('H:i:s');
			$empresa_id = $_SESSION['usuario']['empresa_id'] ?? null;
			$usuario = $_SESSION['usuario']['nom_usuario'] ?? null;

			$sql_insert = "INSERT INTO cmx_precintos_movimientos (codigo_precinto, tipo_movimiento, tipo_precinto, origen, destino, cantidad, usuario, fecha, hora, observacion, empresa_id)
                       	   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

			$stmt_insert = $this->_db3->prepare($sql_insert);
			$stmt_insert->execute([
				$rango_codigo,
				$tipo,
				$tipo_precinto,
				$agencia_origen,
				$agencia_destino,
				$cantidad,
				$usuario,
				$fecha,
				$hora,
				$observacion,
				$empresa_id
			]);

			$this->_db3->commit();

			return [
				'success' => true,
				'mensaje' => 'Precintos asignados y movimiento registrado correctamente.'
			];
		} catch (PDOException $e) {
			$this->_db3->rollBack();
			return [
				'success' => false,
				'mensaje' => 'Error al asignar precintos: ' . $e->getMessage()
			];
		}
	}

	public function Listar_Asignacion_Precintos()
	{
		$sql = "SELECT pm.id, pm.codigo_precinto, pm.tipo_movimiento, pm.tipo_precinto, pm.origen, pm.destino, pm.cantidad, 
				pm.usuario, CONCAT(pm.fecha, ' ', pm.hora) AS fecha_movimiento, pm.observacion, pm.empresa_id
				FROM cmx_precintos_movimientos pm";
		$stmt = $this->_db3->prepare($sql);
		$stmt->execute();
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public function Listar_Condfiguraciones_Notificaciones()
	{
		$sql = $this->_db3->prepare("SELECT
			ce.id AS configuracion_id,
			cl.nombre,
			ce.nombre_grupo,
			ce.envio_automatico,
			ce.envio_manual,
			ce.envio_whatsapp,
			CONCAT_WS(', ',
				CASE WHEN ce.importacion = 'SI' THEN 'Importación' END,
				CASE WHEN ce.exportacion = 'SI' THEN 'Exportación' END,
				CASE WHEN ce.nacional = 'SI' THEN 'Nacional' END,
				CASE WHEN ce.urbano = 'SI' THEN 'Urbano' END
			) AS Tipo_Transporte,
			ce.estado_configuracion
		FROM cmx_configuracion_envios ce
		INNER JOIN cmx_clientes cl ON ce.cliente_id = cl.id");
		$sql->execute();
		return $sql->fetchAll(PDO::FETCH_ASSOC);
	}

	public function Editar_Condfiguraciones_Notificaciones($ConfiguracionId)
	{
		# Configuración principal
		$sql = $this->_db3->prepare("
        SELECT ce.*, cl.*
        FROM cmx_configuracion_envios ce
        INNER JOIN cmx_clientes cl ON ce.cliente_id = cl.id 
        WHERE ce.id = :ConfiguracionId");
		$sql->bindParam(':ConfiguracionId', $ConfiguracionId, PDO::PARAM_INT);
		$sql->execute();
		$configuracion = $sql->fetch(PDO::FETCH_ASSOC);

		# Contactos del cliente
		$sql_contactos = $this->_db3->prepare("
        SELECT * 
        FROM cmx_detalle_configuracion_envio 
        WHERE configuracion_id = :ConfiguracionId");
		$sql_contactos->bindParam(':ConfiguracionId', $ConfiguracionId, PDO::PARAM_INT);
		$sql_contactos->execute();
		$contactos = $sql_contactos->fetchAll(PDO::FETCH_ASSOC);

		# Horas de envío del cliente
		$sql_horas = $this->_db3->prepare("
        SELECT * 
        FROM cmx_horas_configuracion 
        WHERE configuracion_id = :ConfiguracionId");
		$sql_horas->bindParam(':ConfiguracionId', $ConfiguracionId, PDO::PARAM_INT);
		$sql_horas->execute();
		$horas = $sql_horas->fetchAll(PDO::FETCH_ASSOC);

		# Retornar todo en un arreglo
		return [
			'configuracion' => $configuracion,
			'contactos'     => $contactos,
			'horas'         => $horas
		];
	}

	public function Actualizar_configuracion_correo($configuracion_id, $cliente, $correo_automatico, $correo_manual, $mensaje_whatsapp, $importacion, $exportacion, $nacional, $urbano, $datos, $datos_horas, $nombre_grupo, $GrupoId)
	{
		$response = [];
		$user = $_SESSION["usuario"]["nom_usuario"];
		$empresa_id = $_SESSION['usuario']['empresa_id'];
		$hora = date('H:i:s');
		$fecha = date('Y-m-d');
		$estado_configuracion = 'ACTIVO';

		// Iniciar la transacción
		$this->_db3->beginTransaction();
		try {
			// 1. Actualizar cmx_configuracion_envios
			$sql = $this->_db3->prepare("
            UPDATE cmx_configuracion_envios
            SET 
                cliente_id = :cliente_id,
                grupo_id = :grupo_id,
                nombre_grupo = :nombre_grupo,
                envio_automatico = :envio_automatico,
                envio_manual = :envio_manual,
                envio_whatsapp = :envio_whatsapp,
                importacion = :importacion,
                exportacion = :exportacion,
                nacional = :nacional,
                urbano = :urbano,
                estado_configuracion = :estado_configuracion,
                usuario = :usuario,
                fecha = :fecha,
                hora = :hora,
                empresa_id = :empresa_id
            WHERE id = :configuracion_id
        ");
			$sql->bindParam(':cliente_id', $cliente);
			$sql->bindParam(':grupo_id', $GrupoId);
			$sql->bindParam(':nombre_grupo', $nombre_grupo);
			$sql->bindParam(':envio_automatico', $correo_automatico);
			$sql->bindParam(':envio_manual', $correo_manual);
			$sql->bindParam(':envio_whatsapp', $mensaje_whatsapp);
			$sql->bindParam(':importacion', $importacion);
			$sql->bindParam(':exportacion', $exportacion);
			$sql->bindParam(':nacional', $nacional);
			$sql->bindParam(':urbano', $urbano);
			$sql->bindParam(':estado_configuracion', $estado_configuracion);
			$sql->bindParam(':usuario', $user);
			$sql->bindParam(':fecha', $fecha);
			$sql->bindParam(':hora', $hora);
			$sql->bindParam(':empresa_id', $empresa_id);
			$sql->bindParam(':configuracion_id', $configuracion_id, PDO::PARAM_INT);
			$sql->execute();

			if ($sql) {
				/***
				 *  Manejo de detalles (contactos)
				 *  Estrategia simple: eliminar todos los existentes y volverlos a insertar
				 *  (más fácil que update uno por uno, a menos que requieras conservar IDs).
				 */
				$this->_db3->prepare("DELETE FROM cmx_detalle_configuracion_envio WHERE configuracion_id = :id")
					->execute([':id' => $configuracion_id]);

				if (!empty($datos['datos']['nombre'])) {
					$sql_detalle = $this->_db3->prepare("
                    INSERT INTO cmx_detalle_configuracion_envio (configuracion_id, nombre, correo, celular, estado_detalle, usuario, fecha, hora, empresa_id) 
                    VALUES(:configuracion_id, :nombre, :correo, :celular, :estado_detalle, :usuario, :fecha, :hora, :empresa_id)
                ");
					foreach ($datos['datos']['nombre'] as $i => $nombre) {
						$correo  = $datos['datos']['correo'][$i] ?? null;
						$celular = $datos['datos']['celular'][$i] ?? null;
						$estado_detalle = 'ACTIVO';

						$sql_detalle->bindParam(':configuracion_id', $configuracion_id);
						$sql_detalle->bindParam(':nombre', $nombre);
						$sql_detalle->bindParam(':correo', $correo);
						$sql_detalle->bindParam(':celular', $celular);
						$sql_detalle->bindParam(':estado_detalle', $estado_detalle);
						$sql_detalle->bindParam(':usuario', $user);
						$sql_detalle->bindParam(':fecha', $fecha);
						$sql_detalle->bindParam(':hora', $hora);
						$sql_detalle->bindParam(':empresa_id', $empresa_id);
						$sql_detalle->execute();
					}
				}

				// Manejo de horas
				$this->_db3->prepare("DELETE FROM cmx_horas_configuracion WHERE configuracion_id = :id")
					->execute([':id' => $configuracion_id]);

				if (!empty($datos_horas['datosHoras']['hora'])) {
					$sql_hora = $this->_db3->prepare("
                    INSERT INTO cmx_horas_configuracion (configuracion_id,hora_envio,estado_hora,usuario,fecha,hora,empresa_id)
                    VALUES(:configuracion_id,:hora_envio,:estado_hora,:usuario,:fecha,:hora,:empresa_id)
                ");
					foreach ($datos_horas['datosHoras']['hora'] as $key => $horaEnvio) {
						$estado_detalle = 'ACTIVO';
						$sql_hora->bindParam(':configuracion_id', $configuracion_id);
						$sql_hora->bindParam(':hora_envio', $horaEnvio);
						$sql_hora->bindParam(':estado_hora', $estado_detalle);
						$sql_hora->bindParam(':usuario', $user);
						$sql_hora->bindParam(':fecha', $fecha);
						$sql_hora->bindParam(':hora', $hora);
						$sql_hora->bindParam(':empresa_id', $empresa_id);
						$sql_hora->execute();
					}
				}

				// Confirmar la transacción
				$this->_db3->commit();
				$response['status'] = "success";
				$response['message'] = "Configuración actualizada correctamente";
			} else {
				throw new Exception("Error al actualizar la configuración.");
			}
		} catch (Throwable $th) {
			$this->_db3->rollBack();
			$response['status'] = "error";
			$response['message'] = "Error: " . $th->getMessage();
		}

		return $response;
	}

	// Tarifas 
	public function insertar_tarifa_ventas($vigencia, $mes, $cliente, $origen, $destino, $tarifa, $estado_tarifa, $configuracion_vehiculos)
	{
		try {
			// 🔹 Validar que no exista duplicado
			$checkSql = "SELECT COUNT(*) as total 
                     FROM cmx_tarifa_venta 
                     WHERE cliente_id = :cliente_id 

                       AND vigencia = :vigencia 
                       AND mes = :mes 
                       AND origen = :origen 
                       AND destino = :destino 
                       AND estado_tarifa = 'Activa'";
			$checkStmt = $this->_db3->prepare($checkSql);
			$checkStmt->bindParam(":cliente_id", $cliente, PDO::PARAM_INT);
			$checkStmt->bindParam(":vigencia", $vigencia, PDO::PARAM_INT);
			$checkStmt->bindParam(":mes", $mes, PDO::PARAM_INT);
			$checkStmt->bindParam(":origen", $origen, PDO::PARAM_STR);
			$checkStmt->bindParam(":destino", $destino, PDO::PARAM_STR);
			$checkStmt->execute();

			$existe = $checkStmt->fetch(PDO::FETCH_ASSOC);

			if ($existe && $existe['total'] > 0) {
				// 🚫 Ya existe un registro activo con esos datos
				return [
					"status"  => false,
					"message" => "Ya existe una tarifa activa para este cliente con el mismo origen y destino."
				];
			}

			// ✅ Si no existe, procedemos al insert
			$this->_db3->beginTransaction();

			$sql = "INSERT INTO cmx_tarifa_venta 
                (cliente_id, vigencia, mes, origen, destino, tipo_vehiculo, tarifa, estado_tarifa, usuario, fecha, hora, empresa_id)
                VALUES (:cliente_id, :vigencia, :mes, :origen, :destino, :tipo_vehiculo, :tarifa, :estado_tarifa, :usuario, :fecha, :hora, :empresa_id)";

			$stmt = $this->_db3->prepare($sql);

			// 🔹 Variables adicionales desde sesión
			$usuario    = $_SESSION['usuario']['nom_usuario'] ?? 'sistema';
			$empresa_id = $_SESSION['usuario']['empresa_id'] ?? 0;
			$fecha      = date("Y-m-d");
			$hora       = date("H:i:s");

			// 🔹 Bind de parámetros
			$stmt->bindParam(":cliente_id", $cliente, PDO::PARAM_INT);
			$stmt->bindParam(":vigencia", $vigencia, PDO::PARAM_INT);
			$stmt->bindParam(":mes", $mes, PDO::PARAM_INT);
			$stmt->bindParam(":origen", $origen, PDO::PARAM_STR);
			$stmt->bindParam(":destino", $destino, PDO::PARAM_STR);
			$stmt->bindParam(":tipo_vehiculo", $configuracion_vehiculos, PDO::PARAM_STR);
			$stmt->bindParam(":tarifa", $tarifa, PDO::PARAM_STR);
			$stmt->bindParam(":estado_tarifa", $estado_tarifa, PDO::PARAM_STR);
			$stmt->bindParam(":usuario", $usuario, PDO::PARAM_STR);
			$stmt->bindParam(":fecha", $fecha, PDO::PARAM_STR);
			$stmt->bindParam(":hora", $hora, PDO::PARAM_STR);
			$stmt->bindParam(":empresa_id", $empresa_id, PDO::PARAM_INT);

			// Ejecutar
			$stmt->execute();

			// Confirmar transacción
			$this->_db3->commit();

			return [
				"status"  => true,
				"message" => "Tarifa insertada correctamente."
			];
		} catch (\Throwable $th) {
			// Revertir si hay error
			$this->_db3->rollBack();
			error_log("❌ Error insertar_tarifa_ventas: " . $th->getMessage());

			return [
				"status"  => false,
				"message" => "Error al insertar tarifa: " . $th->getMessage()
			];
		}
	}

	public function update_tarifa_ventas(
		$id_tarifa,
		$vigencia,
		$mes,
		$cliente,
		$origen,
		$destino,
		$tarifa,
		$estado_tarifa,
		$configuracion_vehiculos
	) {
		try {
			// 🔹 Validar que no exista duplicado con otro ID
			$checkSql = "SELECT COUNT(*) as total 
                     FROM cmx_tarifa_venta 
                     WHERE cliente_id = :cliente_id 
                       AND vigencia = :vigencia 
                       AND mes = :mes 
                       AND origen = :origen 
                       AND destino = :destino 
                       AND estado_tarifa = 'Activa'
                       AND id != :id_tarifa"; // 👈 evitar que se compare con sí mismo
			$checkStmt = $this->_db3->prepare($checkSql);
			$checkStmt->bindParam(":cliente_id", $cliente, PDO::PARAM_INT);
			$checkStmt->bindParam(":vigencia", $vigencia, PDO::PARAM_INT);
			$checkStmt->bindParam(":mes", $mes, PDO::PARAM_INT);
			$checkStmt->bindParam(":origen", $origen, PDO::PARAM_STR);
			$checkStmt->bindParam(":destino", $destino, PDO::PARAM_STR);
			$checkStmt->bindParam(":id_tarifa", $id_tarifa, PDO::PARAM_INT);
			$checkStmt->execute();

			$existe = $checkStmt->fetch(PDO::FETCH_ASSOC);

			if ($existe && $existe['total'] > 0) {
				return [
					"status"  => false,
					"message" => "Ya existe una tarifa activa para este cliente con el mismo origen y destino."
				];
			}

			// ✅ Si no existe duplicado, procedemos al update
			$this->_db3->beginTransaction();

			$sql = "UPDATE cmx_tarifa_venta
                SET cliente_id     = :cliente_id,
                    vigencia       = :vigencia,
                    mes            = :mes,
                    origen         = :origen,
                    destino        = :destino,
                    tipo_vehiculo  = :tipo_vehiculo,
                    tarifa         = :tarifa,
                    estado_tarifa  = :estado_tarifa,
                    usuario        = :usuario,
                    fecha          = :fecha,
                    hora           = :hora,
                    empresa_id     = :empresa_id
                WHERE id = :id_tarifa";

			$stmt = $this->_db3->prepare($sql);

			// 🔹 Variables adicionales desde sesión
			$usuario    = $_SESSION['usuario']['nom_usuario'] ?? 'sistema';
			$empresa_id = $_SESSION['usuario']['empresa_id'] ?? 0;
			$fecha      = date("Y-m-d");
			$hora       = date("H:i:s");

			// 🔹 Bind de parámetros
			$stmt->bindParam(":id_tarifa", $id_tarifa, PDO::PARAM_INT);
			$stmt->bindParam(":cliente_id", $cliente, PDO::PARAM_INT);
			$stmt->bindParam(":vigencia", $vigencia, PDO::PARAM_INT);
			$stmt->bindParam(":mes", $mes, PDO::PARAM_INT);
			$stmt->bindParam(":origen", $origen, PDO::PARAM_STR);
			$stmt->bindParam(":destino", $destino, PDO::PARAM_STR);
			$stmt->bindParam(":tipo_vehiculo", $configuracion_vehiculos, PDO::PARAM_STR);
			$stmt->bindParam(":tarifa", $tarifa, PDO::PARAM_STR);
			$stmt->bindParam(":estado_tarifa", $estado_tarifa, PDO::PARAM_STR);
			$stmt->bindParam(":usuario", $usuario, PDO::PARAM_STR);
			$stmt->bindParam(":fecha", $fecha, PDO::PARAM_STR);
			$stmt->bindParam(":hora", $hora, PDO::PARAM_STR);
			$stmt->bindParam(":empresa_id", $empresa_id, PDO::PARAM_INT);

			// Ejecutar
			$stmt->execute();

			// Confirmar transacción
			$this->_db3->commit();

			return [
				"status"  => true,
				"message" => "Tarifa actualizada correctamente."
			];
		} catch (\Throwable $th) {
			// Revertir si hay error
			$this->_db3->rollBack();
			error_log("❌ Error update_tarifa_ventas: " . $th->getMessage());

			return [
				"status"  => false,
				"message" => "Error al actualizar tarifa: " . $th->getMessage()
			];
		}
	}

	public function Inactivar_tarifa_venta($TarifaId)
	{

		try {
			$this->_db3->beginTransaction();

			$sql = $this->_db3->prepare("UPDATE  cmx_tarifa_venta SET estado_tarifa='Inactiva' WHERE id=:Id");
			$sql->bindParam(":Id", $TarifaId);
			$sql->execute();
			$this->_db3->commit();
			return [
				"status" => true,
				"message" => "Tarifa inactivada correctamente para el cliente."
			];
		} catch (\Throwable $th) {
			// Revertir si hay error
			$this->_db3->rollBack();
			error_log("❌ Error update_tarifa_ventas: " . $th->getMessage());

			return [
				"status"  => false,
				"message" => "Error al actualizar tarifa: " . $th->getMessage()
			];
		}
	}

	public function Activar_tarifa_venta($TarifaId)
	{

		try {
			$this->_db3->beginTransaction();

			$sql = $this->_db3->prepare("UPDATE cmx_tarifa_venta SET estado_tarifa='Activa' WHERE id=:Id");
			$sql->bindParam(":Id", $TarifaId);
			$sql->execute();
			$this->_db3->commit();
			return [
				"status" => true,
				"message" => "Tarifa inactivada correctamente para el cliente."
			];
		} catch (\Throwable $th) {
			// Revertir si hay error
			$this->_db3->rollBack();
			error_log("❌ Error update_tarifa_ventas: " . $th->getMessage());

			return [
				"status"  => false,
				"message" => "Error al actualizar tarifa: " . $th->getMessage()
			];
		}
	}

	public function Inactivar_tarifa_costo($TarifaId)
	{
		try {
			$this->_db3->beginTransaction();

			$sql = $this->_db3->prepare("UPDATE cmx_fletes_nacional SET estado='0' WHERE id=:Id");
			$sql->bindParam(":Id", $TarifaId);
			$sql->execute();
			$this->_db3->commit();
			return [
				"status" => true,
				"message" => "Tarifa inactivada correctamente."
			];
		} catch (\Throwable $th) {
			// Revertir si hay error
			$this->_db3->rollBack();
			error_log("❌ Error update_tarifa_ventas: " . $th->getMessage());

			return [
				"status"  => false,
				"message" => "Error al actualizar tarifa: " . $th->getMessage()
			];
		}
	}

	public function Activar_tarifa_costo($TarifaId)
	{
		try {
			$this->_db3->beginTransaction();

			$sql = $this->_db3->prepare("UPDATE cmx_fletes_nacional SET estado='1' WHERE id=:Id");
			$sql->bindParam(":Id", $TarifaId);
			$sql->execute();
			$this->_db3->commit();
			return [
				"status" => true,
				"message" => "Tarifa inactivada correctamente."
			];
		} catch (\Throwable $th) {
			// Revertir si hay error
			$this->_db3->rollBack();
			error_log("❌ Error update_tarifa_ventas: " . $th->getMessage());

			return [
				"status"  => false,
				"message" => "Error al actualizar tarifa: " . $th->getMessage()
			];
		}
	}

	public function Listar_tarifas_clientes()
	{
		$sql = $this->_db3->prepare("SELECT
			cl.nombre AS cliente,
			tv.vigencia,
			tv.mes,
			CONCAT(ori.municipio, '-', ori.depto) AS origen,
			CONCAT(des.municipio, '-', des.depto) AS destino,
			tv.tipo_vehiculo,
			tv.tarifa,
			tv.estado_tarifa,
			tv.id AS tarifa_id
		FROM
			cmx_tarifa_venta tv
			INNER JOIN cmx_clientes cl ON tv.cliente_id = cl.id
			INNER JOIN cmx_municipios ori ON tv.origen = ori.rndc_codigo_ciudad
			INNER JOIN cmx_municipios des ON tv.destino = des.rndc_codigo_ciudad");
		$sql->execute();
		$result = $sql->fetchAll();
		return $result;
	}

	public function listar_Fletes_Nacionales(array $filtros = [])
	{
		$sql = "
        SELECT
            ct.id,
            cmu1.id id_origen,
            cmu1.municipio municipio_origen,
            cmu1.depto depto_origen,
            cmu1.pais pais_origen,
            cmu2.id id_destino,
            cmu2.municipio municipio_destino,
            cmu2.depto depto_destino,
            cmu2.pais pais_destino,
            ct.tarifa,
            ct.vigencia,
            ct.estado,
            ct.mes,
            ct.tipo_vehiculo,
						ct.tarifa_padre_id
        FROM cmx_fletes_nacional ct
        INNER JOIN cmx_municipios cmu1 ON ct.origen = cmu1.rndc_codigo_ciudad
        INNER JOIN cmx_municipios cmu2 ON ct.destino = cmu2.rndc_codigo_ciudad
    ";

		$where = [];
		$params = [];

		if (!empty($filtros['origen'])) {
			$where[] = "ct.origen = :origen";
			$params[':origen'] = $filtros['origen'];
		}

		if (!empty($filtros['destino'])) {
			$where[] = "ct.destino = :destino";
			$params[':destino'] = $filtros['destino'];
		}

		if (!empty($filtros['tipo_vehiculo'])) {
			$where[] = "ct.tipo_vehiculo = :tipo_vehiculo";
			$params[':tipo_vehiculo'] = $filtros['tipo_vehiculo'];
		}

		if (!empty($where)) {
			$sql .= " WHERE " . implode(" AND ", $where);
		}

		$sql .= " AND ct.es_actual = 1";

		$stmt = $this->_db3->prepare($sql);

		foreach ($params as $key => $value) {
			$stmt->bindValue($key, $value);
		}

		$stmt->execute();
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public function Inactivar_tarifa_costo_servicio($TarifaId, $ProveedorId)
	{
		try {
			$this->_db3->beginTransaction();

			$sql = $this->_db3->prepare("UPDATE cmx_serivicio_especial SET estado_servicio='Inactivo' WHERE proveedor_id=:proveedor_id AND tipo_servicio_id=:tipo_servicio_id");
			$sql->bindParam(":proveedor_id", $ProveedorId);
			$sql->bindParam(":tipo_servicio_id", $TarifaId);
			$sql->execute();

			$this->_db3->commit();
			return [
				"status" => true,
				"message" => "Tarifa inactivada correctamente."
			];
		} catch (\Throwable $th) {
			// Revertir si hay error
			$this->_db3->rollBack();
			error_log("❌ Error update_tarifa_ventas: " . $th->getMessage());

			return [
				"status"  => false,
				"message" => "Error al actualizar tarifa: " . $th->getMessage()
			];
		}
	}

	public function Activar_tarifa_costo_servicio($TarifaId, $ProveedorId)
	{
		try {
			$this->_db3->beginTransaction();

			$sql = $this->_db3->prepare("UPDATE cmx_serivicio_especial SET estado_servicio='Activo' WHERE proveedor_id=:proveedor_id AND tipo_servicio_id=:tipo_servicio_id ");
			$sql->bindParam(":proveedor_id", $ProveedorId);
			$sql->bindParam(":tipo_servicio_id", $TarifaId);
			$sql->execute();

			$this->_db3->commit();
			return [
				"status" => true,
				"message" => "Tarifa inactivada correctamente."
			];
		} catch (\Throwable $th) {
			// Revertir si hay error
			$this->_db3->rollBack();
			error_log("❌ Error update_tarifa_ventas: " . $th->getMessage());

			return [
				"status"  => false,
				"message" => "Error al actualizar tarifa: " . $th->getMessage()
			];
		}
	}

	public function getTabla()
	{
		// $sql = $this->_db3->prepare('SELECT * FROM  cmx_para_tipo_sevicio');
		$sql = $this->_db3->prepare('SELECT
			ps.tipificacion,
			ps.nombre,
			pt.razon_social,
			se.id,
			se.estado_servicio,
			se.proveedor_id,
			se.tipo_servicio_id AS Servicio_Id
		FROM
			cmx_serivicio_especial se
			INNER JOIN cmx_para_tipo_sevicio ps ON se.tipo_servicio_id = ps.id
			INNER JOIN cmx_proveedor_torre_control pt ON se.proveedor_id = pt.id
		WHERE
			pt.tipo_proveedor = "Proveedor servicio especial"');
		$sql->execute();
		$result = $sql->fetchAll(PDO::FETCH_ASSOC);
		//  $this->_db3->prepare($sql); //viene de confinguraciones funciones establecidas por defecto para consultas, eliminar, registrar... (getconsuktas SOLO para consultar algo)
		return $result;
	}

	public function getTabla_Proveedores_Servicio_Especial()
	{
		$sql = $this->_db3->prepare("SELECT * FROM cmx_proveedor_torre_control WHERE tipo_proveedor='Proveedor servicio especial'");
		$sql->execute();
		$result = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $result;
	}

	public function InsertarProveedor($data)
	{
		$user = $_SESSION["usuario"]["nom_usuario"];
		$empresa_id = $_SESSION['usuario']['empresa_id'];
		$db = $this->_db3; // conexión PDO
		try {
			$db->beginTransaction();

			// insertar cabecera en tipos_servicio
			$stmt = $db->prepare("
            INSERT INTO cmx_serivicio_especial 
                (proveedor_id, tipo_servicio_id, estado_servicio, usuario, fecha, hora, empresa_id) 
            VALUES 
                (:proveedor_id, :tipo_servicio_id, :estado, :usuario, :fecha, :hora, :empresa_id)
        	");

			$stmt->execute([
				':proveedor_id' => $data['proveedor'] ?? null,
				':tipo_servicio_id'       => $data['tipo'],
				':estado'       => $data['estado'],
				':usuario'      => $user ?? 'sistema',
				':fecha'        => date('Y-m-d'),
				':hora'         => date('H:i:s'),
				':empresa_id'   => $empresa_id ?? null
			]);

			$id_servicio = $db->lastInsertId();

			// insertar detalles en tipos_servicio_detalle
			if (!empty($data['detalles'])) {
				$stmtDetalle = $db->prepare("
                INSERT INTO cmx_detalle_servicio_especial 
                    (servicio_id, ciudad, costo, estado_ciudad, usuario, fecha, hora) 
                VALUES 
                    (:servicio_id, :ciudad, :costo, :estado_ciudad, :usuario, :fecha, :hora)
            ");

				foreach ($data['detalles'] as $detalle) {
					$stmtDetalle->execute([
						':servicio_id'   => $id_servicio,
						':ciudad'        => $detalle['municipio'],
						':costo'         => $detalle['costo'] ?? 0,
						':estado_ciudad' => 'Activo',
						':usuario'       => $data['usuario'] ?? 'sistema',
						':fecha'         => date('Y-m-d'),
						':hora'          => date('H:i:s')
					]);
				}
			}

			$db->commit();
			return true;
		} catch (Exception $e) {
			$db->rollBack();
			error_log("❌ Error InsertarProveedor: " . $e->getMessage());
			return false;
		}
	}

	public function ActualizarProveedor($data)
	{
		$user = $_SESSION["usuario"]["nom_usuario"] ?? 'sistema';
		$empresa_id = $_SESSION['usuario']['empresa_id'] ?? null;
		$db = $this->_db3;

		try {
			$db->beginTransaction();

			// 🔹 Actualizar cabecera
			$stmt = $db->prepare("
            UPDATE cmx_serivicio_especial 
            SET 
                proveedor_id     = :proveedor_id,
                tipo_servicio_id = :tipo_servicio_id,
                estado_servicio  = :estado,
                usuario          = :usuario,
                fecha            = :fecha,
                hora             = :hora,
                empresa_id       = :empresa_id
            WHERE id = :servicio_id
        ");
			$stmt->execute([
				':proveedor_id'    => $data['proveedor'],
				':tipo_servicio_id' => $data['tipo'],
				':estado'          => $data['estado'],
				':usuario'         => $user,
				':fecha'           => date('Y-m-d'),
				':hora'            => date('H:i:s'),
				':empresa_id'      => $empresa_id,
				':servicio_id'     => $data['servicio_id']
			]);

			// 🔹 Eliminar detalles previos
			$stmtDel = $db->prepare("DELETE FROM cmx_detalle_servicio_especial WHERE servicio_id = :servicio_id");
			$stmtDel->execute([":servicio_id" => $data['servicio_id']]);

			// 🔹 Insertar los nuevos detalles
			if (!empty($data['detalles'])) {
				$stmtDetalle = $db->prepare("
                INSERT INTO cmx_detalle_servicio_especial 
                    (servicio_id, ciudad, costo, estado_ciudad, usuario, fecha, hora) 
                VALUES 
                    (:servicio_id, :ciudad, :costo, :estado_ciudad, :usuario, :fecha, :hora)
            ");
				foreach ($data['detalles'] as $detalle) {
					$stmtDetalle->execute([
						':servicio_id'   => $data['servicio_id'],
						':ciudad'        => $detalle['municipio'],
						':costo'         => $detalle['costo'] ?? 0,
						':estado_ciudad' => 'Activo',
						':usuario'       => $user,
						':fecha'         => date('Y-m-d'),
						':hora'          => date('H:i:s')
					]);
				}
			}

			$db->commit();
			return true;
		} catch (Exception $e) {
			$db->rollBack();
			error_log("❌ Error ActualizarProveedor: " . $e->getMessage());
			return false;
		}
	}

	public function InsertarCliente($data)
	{
		$user = $_SESSION["usuario"]["nom_usuario"];
		$empresa_id = $_SESSION['usuario']['empresa_id'];
		$db = $this->_db3; // conexión PDO
		try {
			$db->beginTransaction();

			// insertar cabecera en tipos_servicio
			$stmt = $db->prepare("
				INSERT INTO cmx_venta_tipo_sevicio 
					(cliente_id, servicio_id, estado_servicio_venta, usuario, fecha, hora, empresa_id) 
				VALUES 
					(:cliente_id, :servicio_id, :estado, :usuario, :fecha, :hora, :empresa_id)
			");

			$stmt->execute([
				':cliente_id'   => $data['cliente'] ?? null,
				// ':id_rndc'      => $data['id_rndc'] ?? null,
				':servicio_id'  => $data['tipo'],
				// ':tipificacion' => $data['tipi'],
				':estado'       => $data['estado'],
				// ':costo'        => $data['costo'] ?? null, // opcional si lo manejas global
				':usuario'      => $user ?? 'sistema',
				':fecha'        => date('Y-m-d'),
				':hora'         => date('H:i:s'),
				':empresa_id'   => $empresa_id ?? null
			]);

			$id_servicio = $db->lastInsertId();

			// insertar detalles en tipos_servicio_detalle
			if (!empty($data['detalles'])) {
				$stmtDetalle = $db->prepare("
                INSERT INTO cmx_detalle_venta_servicio_especial 
                    (servicio_id, ciudad, costo, estado_ciudad, usuario, fecha, hora) 
                VALUES 
                    (:servicio_id, :ciudad, :costo, :estado_ciudad, :usuario, :fecha, :hora)
            ");

				foreach ($data['detalles'] as $detalle) {
					$stmtDetalle->execute([
						':servicio_id'   => $id_servicio,
						':ciudad'        => $detalle['municipio'],
						':costo'         => $detalle['costo'] ?? 0,
						':estado_ciudad' => 'Activo',
						':usuario'       => $data['usuario'] ?? 'sistema',
						':fecha'         => date('Y-m-d'),
						':hora'          => date('H:i:s')
					]);
				}
			}

			$db->commit();
			return true;
		} catch (Exception $e) {
			$db->rollBack();
			error_log("❌ Error InsertarProveedor: " . $e->getMessage());
			return false;
		}
	}

	public function ActualizarCliente($data)
	{
		$user = $_SESSION["usuario"]["nom_usuario"];
		$empresa_id = $_SESSION['usuario']['empresa_id'];
		$db = $this->_db3; // conexión PDO

		try {
			$db->beginTransaction();

			// ✅ Actualizar cabecera
			$stmt = $db->prepare("
				UPDATE cmx_venta_tipo_sevicio 
				SET 
					cliente_id = :cliente_id,
					servicio_id = :servicio_id,
					estado_servicio_venta = :estado,
					usuario = :usuario,
					fecha = :fecha,
					hora = :hora,
					empresa_id = :empresa_id
				WHERE id = :id_servicio
			");

			$stmt->execute([
				':cliente_id'  => $data['cliente'] ?? null,
				':servicio_id' => $data['tipo'],
				':estado'      => $data['estado'],
				':usuario'     => $user ?? 'sistema',
				':fecha'       => date('Y-m-d'),
				':hora'        => date('H:i:s'),
				':empresa_id'  => $empresa_id ?? null,
				':id_servicio' => $data['servicio_id'] // obligatorio
			]);

			// ✅ Borrar detalles anteriores
			$stmtDel = $db->prepare("DELETE FROM cmx_detalle_venta_servicio_especial WHERE servicio_id = :id_servicio");
			$stmtDel->execute([':id_servicio' => $data['servicio_id']]);

			// ✅ Insertar los nuevos detalles
			if (!empty($data['detalles'])) {
				$stmtDetalle = $db->prepare("
					INSERT INTO cmx_detalle_venta_servicio_especial 
						(servicio_id, ciudad, costo, estado_ciudad, usuario, fecha, hora) 
					VALUES 
						(:servicio_id, :ciudad, :costo, :estado_ciudad, :usuario, :fecha, :hora)
				");

				foreach ($data['detalles'] as $detalle) {
					$stmtDetalle->execute([
						':servicio_id'   => $data['servicio_id'],
						':ciudad'        => $detalle['municipio'],
						':costo'         => $detalle['costo'] ?? 0,
						':estado_ciudad' => 'Activo',
						':usuario'       => $data['usuario'] ?? 'sistema',
						':fecha'         => date('Y-m-d'),
						':hora'          => date('H:i:s')
					]);
				}
			}

			$db->commit();
			return true;
		} catch (Exception $e) {
			$db->rollBack();
			error_log("❌ Error ActualizarCliente: " . $e->getMessage());
			return false;
		}
	}

	public function getTablaVenta()
	{
		// $sql = $this->_db3->prepare('SELECT * FROM  cmx_para_tipo_sevicio');
		$sql = $this->_db3->prepare('SELECT ps.tipificacion,
				ps.nombre AS tipo_servicio,
				vs.id,
				vs.cliente_id,
				vs.servicio_id AS Servicio_Id,
				vs.estado_servicio_venta,
				cl.nombre
			FROM cmx_venta_tipo_sevicio vs
			INNER JOIN cmx_para_tipo_sevicio ps ON vs.servicio_id = ps.id
			INNER JOIN cmx_clientes cl ON vs.cliente_id=cl.id');
		$sql->execute();
		$result = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $result;
	}

	public function Inactivar_tarifa_venta_servicio($TarifaId, $ProveedorId)
	{
		try {
			$this->_db3->beginTransaction();

			$sql = $this->_db3->prepare("UPDATE cmx_venta_tipo_sevicio SET estado_servicio_venta='Inactivo' WHERE cliente_id=:cliente_id AND servicio_id=:servicio_id");
			$sql->bindParam(":cliente_id", $ProveedorId);
			$sql->bindParam(":servicio_id", $TarifaId);
			$sql->execute();

			$this->_db3->commit();
			return [
				"status" => true,
				"message" => "Tarifa inactivada correctamente."
			];
		} catch (\Throwable $th) {
			// Revertir si hay error
			$this->_db3->rollBack();
			error_log("❌ Error update_tarifa_ventas: " . $th->getMessage());

			return [
				"status"  => false,
				"message" => "Error al actualizar tarifa: " . $th->getMessage()
			];
		}
	}

	public function Activar_tarifa_venta_servicio($TarifaId, $ProveedorId)
	{
		try {
			$this->_db3->beginTransaction();

			$sql = $this->_db3->prepare("UPDATE cmx_venta_tipo_sevicio SET estado_servicio_venta='Activo' WHERE cliente_id=:cliente_id AND servicio_id=:servicio_id ");
			$sql->bindParam(":cliente_id", $ProveedorId);
			$sql->bindParam(":servicio_id", $TarifaId);
			$sql->execute();

			$this->_db3->commit();
			return [
				"status" => true,
				"message" => "Tarifa inactivada correctamente."
			];
		} catch (\Throwable $th) {
			// Revertir si hay error
			$this->_db3->rollBack();
			error_log("❌ Error update_tarifa_ventas: " . $th->getMessage());

			return [
				"status"  => false,
				"message" => "Error al actualizar tarifa: " . $th->getMessage()
			];
		}
	}

	public function Get_Tabla_Servicio_Especiales()
	{
		$empresa_id = $_SESSION['usuario']['empresa_id'];
		$sql = $this->_db3->prepare("SELECT * FROM cmx_para_tipo_sevicio WHERE estado='Activo' OR estado='activo'");
		// $sql->execute([":Empresa_id" => $empresa_id]);
		$sql->execute();
		$result = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $result;
	}

	private function obtenerSemanaMes($fecha)
	{
		return (int) ceil(date('j', strtotime($fecha)) / 7);
	}

	private function obtenerFechaInicioFin($vigencia, $mes)
	{
		$fecha_inicio = sprintf('%04d-%02d-01', $vigencia, $mes);
		$fecha_fin = date('Y-m-t', strtotime($fecha_inicio));

		return [$fecha_inicio, $fecha_fin];
	}

	public function guardarFleteNacional($data)
	{
		$user = $_SESSION["usuario"]["nom_usuario"] ?? 'sistema';
		$empresa_id = $_SESSION['usuario']['empresa_id'] ?? null;

		try {
			$this->_db3->beginTransaction();

			// 1️⃣ Calcular fechas y semana
			[$fecha_inicio, $fecha_fin] = $this->obtenerFechaInicioFin($data['vigencia'], $data['mes']);
			$semana = $this->obtenerSemanaMes($fecha_inicio);

			// 2️⃣ Si viene tarifa_id → inactivar tarifa anterior
			if (!empty($data['tarifa_costo_id'])) {
				$sqlInactivar = $this->_db3->prepare("
                UPDATE cmx_fletes_nacional
                SET estado = 0,
                    es_actual = 0
                WHERE id = :id
            ");
				$sqlInactivar->execute([
					':id' => $data['tarifa_costo_id']
				]);
			}

			// 3️⃣ Insertar NUEVA tarifa
			$sql = $this->_db3->prepare("
            INSERT INTO cmx_fletes_nacional
            (
                vigencia,
                mes,
                semana,
                origen,
                destino,
                tipo_vehiculo,
                tarifa,
                tipo_origen,
                estado,
                es_actual,
                tarifa_padre_id,
                fecha_inicio,
                fecha_fin,
                usuario,
                fecha,
                hora,
                empresa_id
            )
            VALUES
            (
                :vigencia,
                :mes,
                :semana,
                :origen,
                :destino,
                :tipo_vehiculo,
                :tarifa,
                :tipo_origen,
                1,
                1,
                :tarifa_padre_id,
                :fecha_inicio,
                :fecha_fin,
                :usuario,
                :fecha,
                :hora,
                :empresa_id
            )
        ");

			// 🔒 Normalizar tarifa_padre_id
			$tarifaPadreId = (!empty($data['tarifa_costo_id']))
				? (int)$data['tarifa_costo_id']
				: null;

			$sql->execute([
				':vigencia'         => $data['vigencia'],
				':mes'              => $data['mes'],
				':semana'           => $semana,
				':origen'           => $data['origen'],
				':destino'          => $data['destino'],
				':tipo_vehiculo'    => $data['tipo_vehiculo'],
				':tarifa'           => $data['tarifa'],
				':tipo_origen'      => $data['tipo_origen'] ?? null,
				':tarifa_padre_id'  => $tarifaPadreId,   // ✅ AQUÍ
				':fecha_inicio'     => $fecha_inicio,
				':fecha_fin'        => $fecha_fin,
				':usuario'          => $user,
				':fecha'            => date('Y-m-d'),
				':hora'             => date('H:i:s'),
				':empresa_id'       => $empresa_id
			]);

			$this->_db3->commit();

			return [
				'success' => true,
				'message' => 'Tarifa creada correctamente',
				'id'      => $this->_db3->lastInsertId()
			];
		} catch (\Throwable $th) {
			$this->_db3->rollBack();
			return [
				'success' => false,
				'message' => $th->getMessage()
			];
		}
	}

	public function updateFleteNacional($data)
	{
		$user = $_SESSION["usuario"]["nom_usuario"] ?? "sistema";

		try {
			$this->_db3->beginTransaction();

			$sql = $this->_db3->prepare("
            UPDATE cmx_fletes_nacional
            SET
                vigencia      = :vigencia,
                mes           = :mes,
                origen        = :origen,
                destino       = :destino,
                tipo_vehiculo = :tipo_vehiculo,
                tarifa        = :tarifa,
                estado        = :estado,
                usuario       = :usuario,
                fecha         = :fecha,
                hora          = :hora
            WHERE id = :tarifa_costo_id
        ");

			$sql->execute([
				":vigencia"        => $data["vigencia"],
				":mes"             => $data["mes"],
				":origen"          => $data["origen"],
				":destino"         => $data["destino"],
				":tipo_vehiculo"   => $data["tipo_vehiculo"],
				":tarifa"          => $data["tarifa"],
				":estado"          => $data["estado"],
				":usuario"         => $user,
				":fecha"           => $data["fecha"],
				":hora"            => $data["hora"],
				":tarifa_costo_id" => $data["tarifa_costo_id"]
			]);

			$this->_db3->commit();

			return [
				"success" => true,
				"message" => "Flete nacional actualizado correctamente"
			];
		} catch (\Throwable $th) {
			$this->_db3->rollBack();
			return [
				"success" => false,
				"message" => $th->getMessage()
			];
		}
	}

	public function Detalle_tarifa_venta($TarifaId)
	{
		$sql = $this->_db3->prepare("SELECT * FROM cmx_tarifa_venta WHERE id=:Id");
		$sql->execute([":Id" => $TarifaId]);
		$result = $sql->fetch(PDO::FETCH_ASSOC);
		return $result;
	}

	public function Detalle_tarifa_costo($tarifaId)
	{
		// 1️⃣ Traer la tarifa solicitada (sea raíz o versión)
		$sqlBase = $this->_db3->prepare("
        SELECT *
        FROM cmx_fletes_nacional
        WHERE id = :id
        LIMIT 1
    ");
		$sqlBase->execute([':id' => $tarifaId]);
		$base = $sqlBase->fetch(PDO::FETCH_ASSOC);

		if (!$base) {
			return [
				'actual' => null,
				'historica_1' => null,
				'historica_2' => null,
				'error' => 'No existe tarifa con ese ID'
			];
		}

		// 2️⃣ Resolver raíz REAL
		$raizId = $base['tarifa_padre_id'] ?? $base['id'];

		// 3️⃣ Tarifa actual REAL
		$sqlActual = $this->_db3->prepare("
        SELECT *
        FROM cmx_fletes_nacional
        WHERE (id = :raiz OR tarifa_padre_id = :raiz)
        ORDER BY es_actual DESC, id DESC
        LIMIT 1
    ");
		$sqlActual->execute([':raiz' => $raizId]);
		$actual = $sqlActual->fetch(PDO::FETCH_ASSOC);

		// 4️⃣ Históricas
		$sqlHistoricas = $this->_db3->prepare("
        SELECT *
        FROM cmx_fletes_nacional
        WHERE tarifa_padre_id = :raiz
          AND id <> :actual_id
        ORDER BY id DESC
        LIMIT 2
    ");
		$sqlHistoricas->execute([
			':raiz' => $raizId,
			':actual_id' => $actual['id']
		]);
		$historicas = $sqlHistoricas->fetchAll(PDO::FETCH_ASSOC);

		return [
			'actual'      => $actual,
			'historica_1' => $historicas[0] ?? null,
			'historica_2' => $historicas[1] ?? null
		];
	}

	public function Detalle_tarifa_costo_servicio($TarifaId, $ProveedorId, $servi_id)
	{
		try {
			// 🔹 Consulta cabecera
			$sql = $this->_db3->prepare("
				SELECT
					ps.tipificacion,
					ps.nombre,
					pt.razon_social,
					se.id AS ser_id,
					se.estado_servicio,
					se.proveedor_id,
					se.tipo_servicio_id AS Servicio_Id
				FROM
					cmx_serivicio_especial se
					INNER JOIN cmx_para_tipo_sevicio ps ON se.tipo_servicio_id = ps.id
					INNER JOIN cmx_proveedor_torre_control pt ON se.proveedor_id = pt.id
				WHERE
					se.proveedor_id = :proveedor_id
					AND se.tipo_servicio_id = :tipo_servicio_id
					AND pt.tipo_proveedor = 'Proveedor servicio especial'
			");
			$sql->bindParam(":proveedor_id", $ProveedorId);
			$sql->bindParam(":tipo_servicio_id", $TarifaId);
			$sql->execute();
			$cabecera = $sql->fetch(PDO::FETCH_ASSOC);

			// 🔹 Consulta detalle costos
			$sql_costos = $this->_db3->prepare("
				SELECT
					ds.ciudad,
					CONCAT(mu.municipio,' - ',mu.depto) AS Destino,
					ds.costo
				FROM
					cmx_serivicio_especial se
					INNER JOIN cmx_detalle_servicio_especial ds ON se.tipo_servicio_id = ds.servicio_id
					INNER JOIN cmx_municipios mu ON ds.ciudad = mu.rndc_codigo_ciudad
				WHERE
					se.proveedor_id = :proveedor_id
					AND ds.servicio_id = :tipo_servicio_id
			");
			$sql_costos->bindParam(":proveedor_id", $ProveedorId);
			$sql_costos->bindParam(":tipo_servicio_id", $servi_id);
			$sql_costos->execute();
			$costos = $sql_costos->fetchAll(PDO::FETCH_ASSOC);

			// 🔹 Respuesta unificada
			return [
				"status"   => true,
				"cabecera" => $cabecera,
				"costos"   => $costos
			];
		} catch (\Throwable $th) {
			return [
				"status"  => false,
				"message" => "Error al obtener detalle: " . $th->getMessage()
			];
		}
	}

	public function Detalle_tarifa_venta_servicio($TarifaId, $ProveedorId, $servi_id)
	{
		try {
			// 🔹 Consulta cabecera
			$sql = $this->_db3->prepare("
				SELECT
					ps.tipificacion,
					ps.nombre AS tipo_servicio,
					vs.id,
					vs.cliente_id,
					vs.servicio_id AS Servicio_Id,
					vs.estado_servicio_venta,
					cl.nombre
				FROM
					cmx_venta_tipo_sevicio vs
					INNER JOIN cmx_para_tipo_sevicio ps ON vs.servicio_id = ps.id
					INNER JOIN cmx_clientes cl ON vs.cliente_id=cl.id
				WHERE
					vs.cliente_id = :proveedor_id
					AND vs.servicio_id = :tipo_servicio_id
			");
			$sql->bindParam(":proveedor_id", $ProveedorId);
			$sql->bindParam(":tipo_servicio_id", $TarifaId);
			$sql->execute();
			$cabecera = $sql->fetch(PDO::FETCH_ASSOC);

			// 🔹 Consulta detalle costos
			$sql_costos = $this->_db3->prepare("
				SELECT
					ds.ciudad,
					CONCAT(mu.municipio,' - ',mu.depto) AS Destino,
					ds.costo
				FROM
					cmx_venta_tipo_sevicio se
					INNER JOIN cmx_detalle_venta_servicio_especial ds ON se.id = ds.servicio_id
					INNER JOIN cmx_municipios mu ON ds.ciudad = mu.rndc_codigo_ciudad
				WHERE
					se.cliente_id = :proveedor_id
					AND ds.servicio_id = :tipo_servicio_id
			");
			$sql_costos->bindParam(":proveedor_id", $ProveedorId);
			$sql_costos->bindParam(":tipo_servicio_id", $servi_id);
			$sql_costos->execute();
			$costos = $sql_costos->fetchAll(PDO::FETCH_ASSOC);

			// 🔹 Respuesta unificada
			return [
				"status"   => true,
				"cabecera" => $cabecera,
				"costos"   => $costos
			];
		} catch (\Throwable $th) {
			return [
				"status"  => false,
				"message" => "Error al obtener detalle: " . $th->getMessage()
			];
		}
	}

	public function Get_Tipo_Servicio_Especiales()
	{
		$sql = $this->_db3->prepare("SELECT * FROM cmx_para_tipo_sevicio");
		$sql->execute();
		$result = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $result;
	}

	public function Consultar_Grupos_Clientes($Cliente)
	{
		$sql = $this->_db3->prepare("SELECT g.*, cl.nombre
			FROM cmx_grupo g 
			INNER JOIN cmx_clientes cl ON g.id_cliente=cl.id
			WHERE g.estado=1  
			AND cl.id=:Cliente");
		$sql->execute(array(":Cliente" => $Cliente));
		$result = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $result;
	}

	public function Consultar_Contactos_Grupo($GrupoId)
	{
		$sql = $this->_db3->prepare("SELECT * FROM cmx_grupo_contacto_cliente
			WHERE idgrupo=:GrupoId");
		$sql->execute(array(":GrupoId" => $GrupoId));
		$result = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $result;
	}

	public function insertar_bodega($responsable_bodega, $cliente_bodega, $nombre_bodega, $estado_bodega)
	{
		$user = $_SESSION["usuario"]["nom_usuario"];
		$empresa_id = $_SESSION['usuario']['empresa_id'];
		$fecha = date('Y-m-d');
		$hora = date('H:i:s');

		try {
			$this->_db3->beginTransaction();
			$sql = $this->_db3->prepare("INSERT INTO cmx_bodega (cliente_id,responsable,nombre_bodega,estado_bodega,usuario,fecha,hora,empresa_id) 
			VALUES(:cliente_id,:responsable,:nombre_bodega,:estado_bodega,:usuario,:fecha,:hora,:empresa_id)");
			$sql->bindParam(":cliente_id", $cliente_bodega);
			$sql->bindParam(":responsable", $responsable_bodega);
			$sql->bindParam(":nombre_bodega", $nombre_bodega);
			$sql->bindParam(":estado_bodega", $estado_bodega);
			$sql->bindParam(":usuario", $user);
			$sql->bindParam(":fecha", $fecha);
			$sql->bindParam(":hora", $hora);
			$sql->bindParam(":empresa_id", $empresa_id);
			$sql->execute();
			$this->_db3->commit();
			return [
				"status" => true,
				"message" => "Bodega insertada correctamente."
			];
		} catch (\Throwable $th) {
			//throw $th;
			$this->_db3->rollBack();
			error_log("❌ Error insertar_bodega: " . $th->getMessage());
			return [
				"status"  => false,
				"message" => "Error al insertar bodega: " . $th->getMessage()
			];
		}
	}

	public function Consultar_responsables_vehiculo()
	{
		$sql_responsable = $this->_db3->prepare("SELECT u.user_log,u.nom_usuario,u.id AS usuario_responsable_id FROM cmx_usuarios u 
        INNER JOIN cmx_usuario_cliente uc ON u.id=uc.id_usuario
        INNER JOIN cmx_perfiles p ON uc.id_perfil=p.id
        WHERE u.estado=1 ORDER BY u.nom_usuario ASC");
		$sql_responsable->execute();
		$resultado = $sql_responsable->fetchAll(PDO::FETCH_ASSOC);
		return $resultado;
	}

	/**
	 * Obtiene todas las bodegas de la tabla cmx_bodegas.
	 * @return array Retorna un array con las bodegas o un array vacío en caso de error.
	 */
	public function Listar_bodegas()
	{
		try {
			// $sql = "SELECT * FROM cmx_bodega";
			$sql = " SELECT bo.responsable,bo.nombre_bodega,bo.estado_bodega,cl.nombre AS cliente FROM cmx_bodega bo
 			INNER JOIN cmx_clientes cl ON bo.cliente_id=cl.id";
			$stmt = $this->_db3->prepare($sql);
			$stmt->execute();

			// Devolvemos el resultado como un array asociativo
			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			// En un entorno de producción, podrías loggear el error
			// error_log("Error al listar bodegas: " . $e->getMessage());
			return []; // Devolvemos un array vacío en caso de error
		}
	}

	public function Consultar_agencias_destino()
	{
		try {
			$sql = "SELECT * FROM cmx_bodega WHERE estado_bodega='Activo' AND nombre_bodega<>'Almacén'ORDER BY nombre_bodega ASC";
			$stmt = $this->_db3->prepare($sql);
			$stmt->execute();

			// Devolvemos el resultado como un array asociativo
			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			// En un entorno de producción, podrías loggear el error
			// error_log("Error al listar bodegas: " . $e->getMessage());
			return []; // Devolvemos un array vacío en caso de error
		}
	}
	public function Consultar_agencias_origen()
	{
		try {
			$sql = "SELECT * FROM cmx_bodega WHERE estado_bodega='Activo' AND nombre_bodega='Almacén'ORDER BY nombre_bodega ASC";
			$stmt = $this->_db3->prepare($sql);
			$stmt->execute();

			// Devolvemos el resultado como un array asociativo
			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			// En un entorno de producción, podrías loggear el error
			// error_log("Error al listar bodegas: " . $e->getMessage());
			return []; // Devolvemos un array vacío en caso de error
		}
	}
}
