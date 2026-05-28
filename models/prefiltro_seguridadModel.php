<?php
session_start();
class prefiltro_seguridadModel extends Model
{

	public function __construct()
	{
		parent::__construct();
	}

	public function getsolicitud()
	{
		$sql = '
				SELECT csv.id, csv.tipo_vehiculo ,clv.placa ,cv.estado as ev, clv.estado FROM cmx_solicitud_vehiculo2 csv
				INNER JOIN cmx_log_solicitudvehiculo clv
				INNER JOIN cmx_vehiculos cv
				ON csv.id=clv.id_solictud AND clv.placa=cv.placa
			';
		$result = $this->_db->getConsulta($sql); //viene de confinguraciones funciones establecidas por defecto para consultas, eliminar, registrar... (getconsuktas SOLO para consultar algo)
		return $result;
	}


	public function getestudio()
	{
		$sql = "SELECT csv.id, csv.tipo_vehiculo ,clv.estado_ruta,clv.placa ,cv.estado AS ev,
 				clv.estado,cv.id_conductor,cv.id AS 'idvehi', csv.id AS 'idsoli',
 				tv.nombre
				 FROM cmx_solicitud_vehiculo2 csv
				 INNER JOIN cmx_para_tipo_vehiculo tv ON csv.tipo_vehiculo=tv.id
				 INNER JOIN cmx_preestudio_solicitudes_servicio sp ON csv.id=sp.id_servicio_cliente
				INNER JOIN cmx_log_solicitudvehiculo2 clv
				INNER JOIN cmx_vehiculos cv ON sp.id_solicitudpreestudio=clv.id_solictud AND clv.placa=cv.placa
				ORDER BY clv.fecha_asignacion, clv.hora_asignacion DESC
				";
		$result = $this->_db->getConsulta($sql); //viene de confinguraciones funciones establecidas por defecto para consultas, eliminar, registrar... (getconsuktas SOLO para consultar algo)
		return $result;
	}

	public function estadoestudio($id_solicitud)
	{
		$id_solicitu = $id_solicitud;
		$sql = 'SELECT ec.estado,ee.id_solicitud FROM 
					cmx_estudio_vehiculo ee
					INNER JOIN cmx_estudiov_completo ec	ON ee.id=ec.id_estudio			
					WHERE ee.id_solicitud=' . $id_solicitu . '
					 AND NOT estado="iniciado"  ';
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	public function num_estudio()
	{
		$sql = 'SELECT id AS nco 
			FROM cmx_estudio_vehiculo;';
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	//METODOS PARA E PREESTUDIO
	public function getTabla_principal()
	{
		$sql = "SELECT v.*, s.id as id_sol ,s.fecha, s.hora, s.usuario, e.estado, e.estado_actual
						FROM  cmx_vehiculos_preestudio v
						INNER JOIN cmx_solicitudes_preestudio s ON v.id=s.id_preestudio
						INNER JOIN cmx_solicitudes_estados e ON s.id=e.id_solicitud
						WHERE e.estado IN('Pendiente','iniciado','rechazado para modificar')
						AND e.estado_actual=1
						GROUP BY v.id";
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	public function consultar_v_preestudio()
	{
		$sql = "SELECT a.* FROM cmx_vehiculos_preestudio a ";
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	public function Listar_Datos_Recursos($datos)
	{
		$where = ""; // Parte dinámica del WHERE
		$params = []; // Valores a pasar a execute()

		if (!empty($datos['filtro']) && isset($datos['valor']) && isset($datos['busqueda'])) {
			$valor = $datos['valor'];
			$filtro = $datos['filtro'];
			$busqueda = $datos['busqueda'];

			if ($datos['filtro'] === 'Proveedores') {
				switch ($valor) {
					case 'Conductor':
						// $where = "WHERE cond.numero_documento LIKE :busqueda";
						// $params[':busqueda'] = "%{$busqueda}%";
						$where = "WHERE cond.numero_documento = :busqueda";
						$params[':busqueda'] = "{$busqueda}";
						break;
					case 'Propietario':
						// $where = "WHERE pro.numero_documento LIKE :busqueda";
						// $params[':busqueda'] = "%{$busqueda}%";
						$where = "WHERE pro.numero_documento = :busqueda";
						$params[':busqueda'] = "{$busqueda}";
						break;
					case 'Tenedor':
						// $where = "WHERE ten.numero_documento LIKE :busqueda";
						// $params[':busqueda'] = "%{$busqueda}%";
						$where = "WHERE ten.numero_documento = :busqueda";
						$params[':busqueda'] = "{$busqueda}";
						break;
					// case 'Todos':
					// 	// $where = "WHERE ( pro.numero_documento LIKE :busqueda OR ten.numero_documento LIKE :busqueda OR cond.numero_documento LIKE :busqueda)";
					// 	// $params[':busqueda'] = "%{$busqueda}%";
					// 	$where = "WHERE ( pro.numero_documento = :busqueda OR ten.numero_documento = :busqueda OR cond.numero_documento = :busqueda)";
					// 	$params[':busqueda'] = "{$busqueda}";
					// 	break;
					case 'Todos':
						if (!empty($busqueda)) {
							$where = "WHERE (
								pro.numero_documento = :busqueda OR
								ten.numero_documento = :busqueda OR
								cond.numero_documento = :busqueda
							)";
							$params[':busqueda'] = $busqueda;
						} else {
							$where = ""; // sin filtro
						}
						break;

					default:
						# code...
						break;
				}
			} else if ($datos['filtro'] === 'Vehiculos') {
				switch ($valor) {
					case 'Carrocería':
						// $where = "WHERE tc.descripcion LIKE :busqueda";
						// $params[':busqueda'] = "%{$busqueda}%";
						$where = "WHERE tc.descripcion = :busqueda";
						$params[':busqueda'] = "{$busqueda}";
						break;
					case 'Placa':
						// $where = "WHERE v.placa LIKE :busqueda";
						// $params[':busqueda'] = "%{$busqueda}%";
						$where = "WHERE v.placa = :busqueda";
						$params[':busqueda'] = "{$busqueda}";
						break;
					case 'Todos':
						if (!empty($busqueda)) {
							$where = "WHERE (v.placa = :busqueda OR tc.descripcion = :busqueda)";
							$params[':busqueda'] = $busqueda;
						} else {
							// Sin WHERE, traerá todos los registros
							$where = "";
						}
						break;

					default:
						# code...
						break;
				}
			}
		}

		// Construir SQL con WHERE dinámico
		$sqlText = "SELECT
			v.numdoc_vehiculo,
			v.placa,
			CONCAT(pro.nombre, ' ', IFNULL(pro.apellido1,''), ' ', IFNULL(pro.apellido2,'')) AS Nombre_Propietario,
			pro.numero_documento AS Documento_Propietario,
			pro.direccion AS Direccion_Propietario,
			CONCAT(mun1.municipio,' ',mun1.depto) AS Municipio_Propietario,
			IF(TRIM(pro.abreviatura) = '', '-', pro.abreviatura) AS Abreviatura_Propietario,
			pro.celular AS Celular_Propietario,
			pro.estado AS Estado_Propietario,
			CONCAT(ten.nombre, ' ', IFNULL(pro.apellido1,''), ' ', IFNULL(pro.apellido2,'')) AS Nombre_Tenedor,
			ten.numero_documento AS Documento_Tenedor,
			ten.direccion AS Direccion_Tenedor,
			CONCAT(mun2.municipio,' ',mun2.depto) AS Municipio_Tenedor,
			IF(TRIM(ten.abreviatura) = '', '-', ten.abreviatura) AS Abreviatura_Tenedor,
			ten.celular AS Celular_Tenedor,
			ten.estado AS Estado_Tenedor,
			CONCAT(cond.nombre, ' ', cond.apellido1, ' ', cond.apellido2) AS Nombre_Conductor,
			cond.numero_documento AS Documento_Conductor,
			cond.direccion AS Direccion_Conductor,
			CONCAT(mun3.municipio,' ',mun3.depto) AS Municipio_Conductor,
			IF(TRIM(cond.abreviatura) = '', '-', cond.abreviatura) AS Abreviatura_Conductor,
			CONCAT(cond.celular,'-',dc.celular2)  AS Celular_Conductor,
			cond.estado AS Estado_Conductor,
			pro.numdoc_nexos AS Numdoc_Propietario,
			ten.numdoc_nexos AS Numdoc_Tenedor,
			cond.numdoc_nexos AS Numdoc_Conductor,
			v.id_propietario, 
			v.id_tenedor,
			v.id_conductor,
			vm.marca,
			vc.descripcion AS Configuracion,
			v2.anio_fabricacion AS Modelo,
			vcl.color,
			vel.descripcion AS Linea,
			tc.descripcion AS Carroceria,
			bv.estado_proceso
		FROM
			cmx_vehiculos v
			INNER JOIN cmx_proveedores pro ON v.id_propietario = pro.numdoc_nexos
			INNER JOIN cmx_proveedores ten ON v.id_tenedor = ten.numdoc_nexos
			INNER JOIN cmx_proveedores cond ON v.id_conductor = cond.numdoc_nexos
			INNER JOIN cmx_vehiculo2 v2 ON v.numdoc_vehiculo=v2.id_vehiculo
			INNER JOIN cmx_rndc_vehiculos_carroceria tc ON v.tipo_carroceria=tc.id
			INNER JOIN cmx_rndc_vehiculos_marcas vm ON v2.marca=vm.id
			INNER JOIN cmx_rndc_vehiculos_configuracion vc ON v2.configuracion=vc.id
			INNER JOIN cmx_rndc_vehiculos_color vcl ON v2.color=vcl.id
			INNER JOIN cmx_rndc_vehiculos_linea vel ON v2.linea=vel.id
			INNER JOIN cmx_municipios mun1 ON mun1.id=pro.id_municipio
			INNER JOIN cmx_municipios mun2 ON mun2.id=ten.id_municipio
			INNER JOIN cmx_municipios mun3 ON mun3.id=cond.id_municipio
			LEFT JOIN cmx_detalle_conductor dc ON cond.numdoc_nexos=dc.id_proveedor
			LEFT JOIN cmx_estado_bloqueo bv ON v.numdoc_vehiculo=bv.id_objeto AND bv.tipo_objeto='vehiculo' AND bv.estado_bloqueo=1
			-- LEFT JOIN cmx_estado_bloqueo bpro ON v.numdoc_vehiculo=bpro.id_objeto AND bpro.tipo_objeto='proveedor' AND bpro.estado_bloqueo=1
		$where
		GROUP BY v.placa
		ORDER BY v.numdoc_vehiculo DESC";

		$sql = $this->_db3->prepare($sqlText);
		$sql->execute($params);
		return $sql->fetchAll(PDO::FETCH_ASSOC);
	}

	public function Inhabilitar_vehiculo($datos)
	{
		// --- 0. Inicialización y Preparación de Datos ---
		$response = [];
		$nombre_proceso = 'bloquear';
		$estado_bloqueo_nuevo = 1;

		// Uso de DateTime para zona horaria
		$date = new DateTime('now', new DateTimeZone('America/Bogota'));
		$fecha = $date->format('Y-m-d');
		$hora = $date->format('H:i:s');

		// Asignación con chequeo de existencia (Mejora la robustez)
		$nom_usuario = $_SESSION['usuario']['nom_usuario'] ?? 'SYSTEM'; // Default user if session is missing
		$session_empresa_id = $_SESSION['usuario']['empresa_id'] ?? null;

		// IDs de Terceros, usando el rol como clave para la inserción posterior
		$ids_terceros_asociativos = array_filter([
			'proveedor' => $datos['PropietarioId'] ?? null,
			'proveedor'     => $datos['TenedorId'] ?? null,
			'proveedor'   => $datos['ConductorId'] ?? null,
		]);
		// Array simple solo con los IDs para las cláusulas IN (UPDATE cmx_proveedores y cmx_estado_bloqueo)
		$ids_terceros = array_values($ids_terceros_asociativos);

		try {
			// Iniciar transacción: ¡Fundamental para asegurar atomicidad!
			$this->_db3->beginTransaction();

			// --------------------------------------------------------------------------------
			## 1. Trazabilidad del Vehículo
			// --------------------------------------------------------------------------------

			// Paso 1: Actualizar estado_bloqueo a 0 (Inactivar estado anterior del recurso)
			$sql_update_anterior = "UPDATE cmx_estado_bloqueo SET estado_bloqueo = 0 WHERE id_objeto = :id_objeto AND tipo_objeto = :tipo_objeto";
			$stmt_update_anterior = $this->_db3->prepare($sql_update_anterior);
			$stmt_update_anterior->bindParam(':id_objeto', $datos['RecursoId'], PDO::PARAM_INT);
			$stmt_update_anterior->bindParam(':tipo_objeto', $datos['Objeto']);
			// La ejecución se realiza y los errores se capturan en el catch general.
			$stmt_update_anterior->execute();

			// Paso 2: Insertar en cmx_estado_bloqueo el nuevo estado (Activar nuevo estado)
			$sql_insert_nuevo = "INSERT INTO cmx_estado_bloqueo (nombre_proceso, estado_proceso, id_objeto, tipo_objeto, tipo_inhabilitacion, estado_bloqueo, fecha, hora, usuario)
                             VALUES (:nombre_proceso, :estado_proceso, :id_objeto, :tipo_objeto, :tipo_inhabilitacion,  :estado_bloqueo, :fecha, :hora, :usuario)";
			$stmt_insert_nuevo = $this->_db3->prepare($sql_insert_nuevo);

			$stmt_insert_nuevo->bindParam(':nombre_proceso', $nombre_proceso);
			$stmt_insert_nuevo->bindParam(':estado_proceso', $datos['Estado']);
			$stmt_insert_nuevo->bindParam(':id_objeto', $datos['RecursoId'], PDO::PARAM_INT);
			$stmt_insert_nuevo->bindParam(':tipo_objeto', $datos['Objeto']);
			$stmt_insert_nuevo->bindParam(':tipo_inhabilitacion', $datos['TipoHinhabilitacion']);
			$stmt_insert_nuevo->bindParam(':estado_bloqueo', $estado_bloqueo_nuevo, PDO::PARAM_INT);
			$stmt_insert_nuevo->bindParam(':fecha', $fecha);
			$stmt_insert_nuevo->bindParam(':hora', $hora);
			$stmt_insert_nuevo->bindParam(':usuario', $nom_usuario);
			$stmt_insert_nuevo->execute();

			$lastInsertId = $this->_db3->lastInsertId(); // ID del nuevo registro de estado

			// Paso 3: Insertar en cmx_historico_bloqueo
			$sql_historico = "INSERT INTO cmx_historico_bloqueo (bloqueo_id, observacion, usuario, fecha, hora, empresa_id) 
                          VALUES (:bloqueo_id, :observacion, :usuario, :fecha, :hora, :empresa_id)";
			$stmt_historico = $this->_db3->prepare($sql_historico);
			$stmt_historico->bindParam(':bloqueo_id', $lastInsertId);
			$stmt_historico->bindParam(':observacion', $datos['Observacion']);
			$stmt_historico->bindParam(':usuario', $nom_usuario);
			$stmt_historico->bindParam(':fecha', $fecha);
			$stmt_historico->bindParam(':hora', $hora);
			$stmt_historico->bindParam(':empresa_id', $session_empresa_id);
			$stmt_historico->execute();

			// Paso 4: Actualizar estado en cmx_vehiculos
			$sql_update_vehiculo = "UPDATE cmx_vehiculos SET estado = 'Inhabilitado' WHERE numdoc_vehiculo = :numdoc_vehiculo";
			$stmt_update_vehiculo = $this->_db3->prepare($sql_update_vehiculo);
			$stmt_update_vehiculo->bindParam(':numdoc_vehiculo', $datos['RecursoId']);
			$stmt_update_vehiculo->execute();

			// --------------------------------------------------------------------------------
			## 2. Inhabilitación de Terceros (cmx_proveedores y cmx_estado_bloqueo)
			// --------------------------------------------------------------------------------

			if (!empty($ids_terceros)) {
				$placeholders = implode(', ', array_fill(0, count($ids_terceros), '?'));

				// A. Actualizar estado a 'Inactivo' en la tabla principal de terceros
				$sql_update_terceros = "UPDATE cmx_proveedores SET estado = 'Inactivo' WHERE numdoc_nexos IN ($placeholders)";
				$stmt_update_terceros = $this->_db3->prepare($sql_update_terceros);
				$stmt_update_terceros->execute($ids_terceros);

				// B. Inactivar el estado de bloqueo ANTERIOR de los terceros
				$sql_update_bloqueo_anterior_terceros = "UPDATE cmx_estado_bloqueo SET estado_bloqueo = 0 WHERE id_objeto IN ($placeholders) AND tipo_objeto IN ('Propietario', 'Tenedor', 'Conductor')";
				$stmt_update_bloqueo_anterior_terceros = $this->_db3->prepare($sql_update_bloqueo_anterior_terceros);
				$stmt_update_bloqueo_anterior_terceros->execute($ids_terceros); // Usa el array simple de IDs

				// C. Insertar el nuevo estado de bloqueo (activo=1) para CADA tercero
				$sql_insert_tercero_bloqueo = "INSERT INTO cmx_estado_bloqueo (nombre_proceso, estado_proceso, id_objeto, tipo_objeto, tipo_inhabilitacion, estado_bloqueo, fecha, hora, usuario)
                                           VALUES (:nombre_proceso, :estado_proceso, :id_objeto, :tipo_objeto, :tipo_inhabilitacion, :estado_bloqueo, :fecha, :hora, :usuario)";

				$stmt_terceros_bloqueo = $this->_db3->prepare($sql_insert_tercero_bloqueo);

				foreach ($ids_terceros_asociativos as $rol_tercero => $id_tercero) {
					// Se utiliza bindValue en lugar de bindParam dentro del bucle
					// para asegurar que el valor actual de $id_tercero se vincule correctamente.
					$stmt_terceros_bloqueo->bindValue(':nombre_proceso', $nombre_proceso);
					$stmt_terceros_bloqueo->bindValue(':estado_proceso', $datos['Estado']);
					$stmt_terceros_bloqueo->bindValue(':tipo_inhabilitacion', $datos['TipoHinhabilitacion']);
					$stmt_terceros_bloqueo->bindValue(':estado_bloqueo', $estado_bloqueo_nuevo, PDO::PARAM_INT);
					$stmt_terceros_bloqueo->bindValue(':fecha', $fecha);
					$stmt_terceros_bloqueo->bindValue(':hora', $hora);
					$stmt_terceros_bloqueo->bindValue(':usuario', $nom_usuario);

					// Parámetros que CAMBIAN en cada iteración:
					$stmt_terceros_bloqueo->bindValue(':id_objeto', $id_tercero, PDO::PARAM_INT);
					$stmt_terceros_bloqueo->bindValue(':tipo_objeto', $rol_tercero); // Ej: 'Propietario'

					$stmt_terceros_bloqueo->execute();
				}
			}

			// --- 3. Confirmación de Transacción ---
			$this->_db3->commit();
			$response = ["status" => true, "message" => "Recurso inhabilitado y datos registrados correctamente."];
		} catch (PDOException $e) {
			// Error de BD: rollback
			if ($this->_db3->inTransaction()) {
				$this->_db3->rollBack();
			}
			// Registrar error detallado para debugging
			error_log("PDO Exception en Inhabilitar_vehiculo: " . $e->getMessage() . " - SQLSTATE: " . $e->getCode());
			$response = [
				"status" => false,
				"message" => "Error de base de datos al inhabilitar recurso. Contacte a soporte."
			];
		} catch (Exception $e) {
			// Otros errores (ej: lógica de negocio o errores de sesión)
			if ($this->_db3->inTransaction()) {
				$this->_db3->rollBack();
			}
			error_log("General Exception en Inhabilitar_vehiculo: " . $e->getMessage());
			$response = [
				"status" => false,
				"message" => "Error interno: " . $e->getMessage()
			];
		}

		return $response;
	}
	// Asegúrate de que este método esté dentro de la clase VehiculoModel
	public function Habilitar_vehiculo(array $datos): array
	{
		$response = [];

		// **Valores de Control**
		$nombre_proceso = 'modificar'; // Más descriptivo para historial
		$estado_bloqueo_anterior = 0; // Estado para INACTIVAR el registro anterior (histórico)
		$estado_bloqueo_nuevo = 1;      // Estado para ACTIVAR el nuevo registro de habilitación

		// Obtener fecha y hora en zona Bogotá
		try {
			$date = new DateTime('now', new DateTimeZone('America/Bogota'));
		} catch (Exception $e) {
			// En caso de error de zona horaria (poco probable)
			return [["status" => false, "message" => "Error de configuración de zona horaria: " . $e->getMessage()]];
		}

		$fecha = $date->format('Y-m-d');
		$hora = $date->format('H:i:s');

		// **SEGURIDAD:** Asumiendo que $_SESSION ya fue iniciada y validada en el controlador/inicio de app.
		$nom_usuario = $_SESSION['usuario']['nom_usuario'] ?? 'SYSTEM_USER'; // Default por seguridad
		$session_empresa_id = $_SESSION['usuario']['empresa_id'] ?? null;

		// **Validaciones básicas de entrada**
		if (!isset($datos['RecursoId'], $datos['Objeto'], $datos['TipoHinhabilitacion'], $datos['Observacion'])) {
			return [["status" => false, "message" => "Datos de entrada incompletos."]];
		}

		try {
			// Iniciar transacción (Excelente práctica)
			$this->_db3->beginTransaction();

			// Paso 1: Inactivar (poner en histórico) el registro activo actual
			$sql_update_anterior = "UPDATE cmx_estado_bloqueo 
                                SET estado_bloqueo = :estado_bloqueo_anterior
                                WHERE id_objeto = :id_objeto AND tipo_objeto = :tipo_objeto 
                                AND estado_bloqueo = 1"; // Solo inactivamos el que está vigente (1)

			$stmt_update = $this->_db3->prepare($sql_update_anterior);
			$stmt_update->bindParam(':estado_bloqueo_anterior', $estado_bloqueo_anterior, PDO::PARAM_INT);
			$stmt_update->bindParam(':id_objeto', $datos['RecursoId'], PDO::PARAM_INT);
			$stmt_update->bindParam(':tipo_objeto', $datos['Objeto']);
			$stmt_update->execute();

			// Paso 2: Insertar el nuevo estado como ACTIVO/HABILITADO (estado_bloqueo = 1)
			$sql_insert = "INSERT INTO cmx_estado_bloqueo 
                       (nombre_proceso, estado_proceso, id_objeto, tipo_objeto, tipo_inhabilitacion,
                        estado_bloqueo, fecha, hora, usuario)
                       VALUES (:nombre_proceso, :estado_proceso, :id_objeto, :tipo_objeto, :tipo_inhabilitacion, 
                               :estado_bloqueo_nuevo, :fecha, :hora, :usuario)";

			$stmt = $this->_db3->prepare($sql_insert);

			$stmt->bindParam(':nombre_proceso', $nombre_proceso);
			// El estado de proceso debe ser la palabra clave que indica Habilitado (ej: 'HABILITADO')
			$stmt->bindParam(':estado_proceso', $datos['Estado']);
			$stmt->bindParam(':id_objeto', $datos['RecursoId'], PDO::PARAM_INT);
			$stmt->bindParam(':tipo_objeto', $datos['Objeto']);
			$stmt->bindParam(':tipo_inhabilitacion', $datos['TipoHinhabilitacion']);
			$stmt->bindParam(':estado_bloqueo_nuevo', $estado_bloqueo_nuevo, PDO::PARAM_INT);
			$stmt->bindParam(':fecha', $fecha);
			$stmt->bindParam(':hora', $hora);
			$stmt->bindParam(':usuario', $nom_usuario);
			$stmt->execute();

			$lastInsertId = $this->_db3->lastInsertId();

			// Paso 3: Insertar en cmx_historico_bloqueo
			$sql_historico = "INSERT INTO cmx_historico_bloqueo 
                          (bloqueo_id, observacion, usuario, fecha, hora, empresa_id) 
                          VALUES (:bloqueo_id, :observacion, :usuario, :fecha, :hora, :empresa_id)";

			$stmt_historico = $this->_db3->prepare($sql_historico);
			$stmt_historico->bindParam(':bloqueo_id', $lastInsertId);
			$stmt_historico->bindParam(':observacion', $datos['Observacion']);
			$stmt_historico->bindParam(':usuario', $nom_usuario);
			$stmt_historico->bindParam(':fecha', $fecha);
			$stmt_historico->bindParam(':hora', $hora);
			$stmt_historico->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_INT);
			$stmt_historico->execute();

			// Todo correcto: commit
			$this->_db3->commit();

			$response = ["status" => true, "message" => "Recurso habilitado y datos registrados correctamente."];
		} catch (PDOException $e) {
			// Error: rollback
			if ($this->_db3->inTransaction()) {
				$this->_db3->rollBack();
			}

			$response = [
				"status" => false,
				"message" => "Error de base de datos al habilitar: " . $e->getMessage()
			];
		} catch (Exception $e) {
			$response = [
				"status" => false,
				"message" => "Error interno al habilitar: " . $e->getMessage()
			];
		}
		return $response;
	}

	// Usaremos un nombre más genérico ya que este método puede manejar tanto INHABILITAR como HABILITAR
	public function gestionarBloqueoRecurso(array $datos): array
	{
		$response = [];

		// **Valores de Control Fijos**
		$nombre_proceso = ($datos['Estado'] == 'INHABILITADO') ? 'bloquear' : 'modificar';
		$estado_bloqueo_anterior = 0; // Para el registro histórico
		$estado_bloqueo_nuevo = 1;      // Para el nuevo registro ACTIVO/VIGENTE

		// Obtener fecha y hora en zona Bogotá
		try {
			$date = new DateTime('now', new DateTimeZone('America/Bogota'));
		} catch (Exception $e) {
			return [["status" => false, "message" => "Error de zona horaria: " . $e->getMessage()]];
		}

		$fecha = $date->format('Y-m-d');
		$hora = $date->format('H:i:s');

		// **SEGURIDAD:** Asumiendo que $_SESSION existe y es válida
		$nom_usuario = $_SESSION['usuario']['nom_usuario'] ?? 'SYSTEM_USER';
		$session_empresa_id = $_SESSION['usuario']['empresa_id'] ?? null;

		// La validación de entrada la movimos al controlador, aquí solo verificamos existencia básica
		if (!isset($datos['RecursoId'], $datos['Objeto'])) {
			return [["status" => false, "message" => "Datos de recurso incompletos en el Modelo."]];
		}

		try {
			// Iniciar transacción
			$this->_db3->beginTransaction();

			// Paso 1: Inactivar (poner en histórico) el registro activo actual
			$sql_update_anterior = "UPDATE cmx_estado_bloqueo 
                                    SET estado_bloqueo = :estado_bloqueo_anterior
                                    WHERE id_objeto = :id_objeto AND tipo_objeto = :tipo_objeto 
                                    AND estado_bloqueo = 1"; // Solo inactivamos el vigente (1)

			$stmt_update = $this->_db3->prepare($sql_update_anterior);
			$stmt_update->bindParam(':estado_bloqueo_anterior', $estado_bloqueo_anterior, PDO::PARAM_INT);
			$stmt_update->bindParam(':id_objeto', $datos['RecursoId'], PDO::PARAM_INT);
			$stmt_update->bindParam(':tipo_objeto', $datos['Objeto']);
			$stmt_update->execute();

			// Paso 2: Insertar el nuevo estado (ej: 'INHABILITADO' o 'HABILITADO') como ACTIVO/VIGENTE (estado_bloqueo = 1)
			$sql_insert = "INSERT INTO cmx_estado_bloqueo 
                           (nombre_proceso, estado_proceso, id_objeto, tipo_objeto, tipo_inhabilitacion,
                            estado_bloqueo, fecha, hora, usuario)
                           VALUES (:nombre_proceso, :estado_proceso, :id_objeto, :tipo_objeto, :tipo_inhabilitacion, 
                                   :estado_bloqueo_nuevo, :fecha, :hora, :usuario)";

			$stmt = $this->_db3->prepare($sql_insert);

			$stmt->bindParam(':nombre_proceso', $nombre_proceso);
			$stmt->bindParam(':estado_proceso', $datos['Estado']); // Ej: 'INHABILITADO' o 'HABILITADO'
			$stmt->bindParam(':id_objeto', $datos['RecursoId'], PDO::PARAM_INT);
			$stmt->bindParam(':tipo_objeto', $datos['Objeto']);
			$stmt->bindParam(':tipo_inhabilitacion', $datos['TipoHinhabilitacion']);
			$stmt->bindParam(':estado_bloqueo_nuevo', $estado_bloqueo_nuevo, PDO::PARAM_INT);
			$stmt->bindParam(':fecha', $fecha);
			$stmt->bindParam(':hora', $hora);
			$stmt->bindParam(':usuario', $nom_usuario);
			$stmt->execute();

			$lastInsertId = $this->_db3->lastInsertId();

			// Paso 3: Insertar en cmx_historico_bloqueo
			$sql_historico = "INSERT INTO cmx_historico_bloqueo 
                              (bloqueo_id, observacion, usuario, fecha, hora, empresa_id) 
                              VALUES (:bloqueo_id, :observacion, :usuario, :fecha, :hora, :empresa_id)";

			$stmt_historico = $this->_db3->prepare($sql_historico);
			$stmt_historico->bindParam(':bloqueo_id', $lastInsertId);
			$stmt_historico->bindParam(':observacion', $datos['Observacion']);
			$stmt_historico->bindParam(':usuario', $nom_usuario);
			$stmt_historico->bindParam(':fecha', $fecha);
			$stmt_historico->bindParam(':hora', $hora);
			$stmt_historico->bindParam(':empresa_id', $session_empresa_id, PDO::PARAM_INT);
			$stmt_historico->execute();

			// Paso 4: Actualizar el estado en la tabla principal cmx_proveedores
			// Determinamos el estado final en cmx_proveedores basándonos en el 'Estado' enviado
			$estado_final_proveedor = ($datos['Estado'] == 'INHABILITADO') ? 'Inactivo' : 'Activo';

			$sql_principal = "UPDATE cmx_proveedores 
                  SET estado = :estado_final
                  WHERE numdoc_nexos = :numdoc_nexos";

			$stmt_principal = $this->_db3->prepare($sql_principal);

			// 🚨 SEGURIDAD: Vinculamos los parámetros
			$stmt_principal->bindParam(':estado_final', $estado_final_proveedor);

			// Asumo que el numdoc_nexos viene en el array de datos
			if (!isset($datos['RecursoId'])) {
				// Si no tienes numDocNexos, usa RecursoId si es el mismo valor
				// DEBES asegurar que este campo es el correcto para la clave de la tabla
				throw new Exception("El campo 'numDocNexos' es requerido para actualizar la tabla principal.");
			}
			$stmt_principal->bindParam(':numdoc_nexos', $datos['RecursoId']);

			$stmt_principal->execute();

			// Todo correcto: commit
			$this->_db3->commit();

			// Mensaje dinámico basado en la acción
			$accion = ($datos['Estado'] == 'INHABILITADO') ? 'inhabilitado' : 'habilitado';

			$response[] = ["status" => true, "message" => "Recurso {$accion} y datos registrados correctamente."];
		} catch (PDOException $e) {
			// Error: rollback
			if ($this->_db3->inTransaction()) {
				$this->_db3->rollBack();
			}

			$response[] = [
				"status" => false,
				"message" => "Error BD al gestionar bloqueo: " . $e->getMessage()
			];
		} catch (Exception $e) {
			$response[] = [
				"status" => false,
				"message" => "Error interno al gestionar bloqueo: " . $e->getMessage()
			];
		}
		return $response;
	}

	public function Inhabilitar_cliente($datos)
	{
		$response = [];

		// Obtener fecha y hora en zona Bogotá
		$date = new DateTime('now', new DateTimeZone('America/Bogota'));
		$fecha = $date->format('Y-m-d');
		$hora = $date->format('H:i:s');

		$nom_usuario = $_SESSION['usuario']['nom_usuario'] ?? null;
		$session_empresa_id = $_SESSION['usuario']['empresa_id'];

		try {
			// Iniciar transacción
			$this->_db3->beginTransaction();

			// if ($datos['EstadoCliente'] == 'Inactivo') {
			// 	$estado = 1;
			// 	$estado_proceso = 'Habilitado';
			// 	$sql_update = $this->_db3->prepare('UPDATE cmx_clientes SET estado=:estado, estado_proceso=:estado_proceso WHERE id=:id');
			// 	$sql_update->bindParam(':estado', $estado);
			// 	$sql_update->bindParam(':estado_proceso', $estado_proceso);
			// 	$sql_update->bindParam(':id', $datos['ClienteId']);
			// 	$sql_update->execute();

			// 	if ($sql_update) {
			// 		$sql_historico = "INSERT INTO cmx_historico_bloqueo (bloqueo_id, observacion, usuario, fecha, hora, empresa_id) 
			// 	VALUES (:bloqueo_id, :observacion, :usuario, :fecha, :hora, :empresa_id)";
			// 		$stmt_historico = $this->_db3->prepare($sql_historico);
			// 		$stmt_historico->bindParam(':bloqueo_id', $datos['ClienteId']);
			// 		$stmt_historico->bindParam(':observacion', $datos['Observacion']);
			// 		$stmt_historico->bindParam(':usuario', $nom_usuario);
			// 		$stmt_historico->bindParam(':fecha', $fecha);
			// 		$stmt_historico->bindParam(':hora', $hora);
			// 		$stmt_historico->bindParam(':empresa_id', $session_empresa_id);
			// 		$stmt_historico->execute();
			// 		// Todo correcto: commit
			// 		$this->_db3->commit();
			// 		$response[] = ["status" => true, "message" => "Cliente inhabilitado y datos registrados correctamente."];
			// 	}
			// } else {
			// 	$estado = 0;
			// 	$estado_proceso = 'Inhabilitado';
			// 	$sql_update = $this->_db3->prepare('UPDATE cmx_clientes SET estado=:estado, estado_proceso=:estado_proceso,capacidad_endeudamiento=:capacidad_endeudamiento,plazo_facturacion=:plazo_facturacion WHERE id=:id');
			// 	$sql_update->bindParam(':estado', $estado);
			// 	$sql_update->bindParam(':estado_proceso', $estado_proceso);
			// 	$sql_update->bindParam(':capacidad_endeudamiento', $datos['cupo_facturacion']);
			// 	$sql_update->bindParam(':plazo_facturacion', $datos['DiasVencimiento']);
			// 	$sql_update->bindParam(':id', $datos['ClienteId']);
			// 	$sql_update->execute();

			// 	if ($sql_update) {
			// 		$sql_historico = "INSERT INTO cmx_historico_bloqueo (bloqueo_id, observacion, usuario, fecha, hora, empresa_id) 
			// 		VALUES (:bloqueo_id, :observacion, :usuario, :fecha, :hora, :empresa_id)";
			// 		$stmt_historico = $this->_db3->prepare($sql_historico);
			// 		$stmt_historico->bindParam(':bloqueo_id', $datos['ClienteId']);
			// 		$stmt_historico->bindParam(':observacion', $datos['Observacion']);
			// 		$stmt_historico->bindParam(':usuario', $nom_usuario);
			// 		$stmt_historico->bindParam(':fecha', $fecha);
			// 		$stmt_historico->bindParam(':hora', $hora);
			// 		$stmt_historico->bindParam(':empresa_id', $session_empresa_id);
			// 		$stmt_historico->execute();
			// 		// Todo correcto: commit
			// 		$this->_db3->commit();
			// 		$response[] = ["status" => true, "message" => "Cliente inhabilitado y datos registrados correctamente."];
			// 	}
			// }

			$estado = 1;
			$estado_proceso = 'Habilitado';
			$sql_update = $this->_db3->prepare('UPDATE cmx_clientes SET estado=:estado, estado_proceso=:estado_proceso,capacidad_endeudamiento=:capacidad_endeudamiento,plazo_facturacion=:plazo_facturacion WHERE id=:id');
			$sql_update->bindParam(':estado', $estado);
			$sql_update->bindParam(':estado_proceso', $estado_proceso);
			$sql_update->bindParam(':capacidad_endeudamiento', $datos['cupo_facturacion']);
			$sql_update->bindParam(':plazo_facturacion', $datos['DiasVencimiento']);
			$sql_update->bindParam(':id', $datos['ClienteId']);
			$sql_update->execute();

			if ($sql_update) {
				$sql_historico = "INSERT INTO cmx_historico_bloqueo (bloqueo_id, observacion, usuario, fecha, hora, empresa_id) 
					VALUES (:bloqueo_id, :observacion, :usuario, :fecha, :hora, :empresa_id)";
				$stmt_historico = $this->_db3->prepare($sql_historico);
				$stmt_historico->bindParam(':bloqueo_id', $datos['ClienteId']);
				$stmt_historico->bindParam(':observacion', $datos['Observacion']);
				$stmt_historico->bindParam(':usuario', $nom_usuario);
				$stmt_historico->bindParam(':fecha', $fecha);
				$stmt_historico->bindParam(':hora', $hora);
				$stmt_historico->bindParam(':empresa_id', $session_empresa_id);
				$stmt_historico->execute();
				// Todo correcto: commit
				$this->_db3->commit();
				$response[] = ["status" => true, "message" => "Cliente inhabilitado y datos registrados correctamente."];
			}
		} catch (\Throwable $e) {
			// Error: rollback
			$this->_db3->rollBack();

			$response[] = [
				"status" => false,
				"message" => "Error al inhabilitar recurso: " . $e->getMessage()
			];
		}
		return $response;
	}

	public function Listar_Clientes_Bloqueo($buscar, $filtro)
	{
		$where = "";
		$params = [];

		if ($filtro === 'Documento') {
			// La búsqueda por documento puede ser estricta o LIKE, pero la dejaremos estricta si es un ID único.
			$where = "WHERE c.documento = :busqueda";
			$params[':busqueda'] = $buscar;
		} elseif ($filtro === 'Nombre') {
			// 🚨 CORRECCIÓN: Usar LIKE para búsqueda flexible por subcadena
			// NOTA: Usamos el operador LIKE en el WHERE y pasamos el comodín (%) al parámetro.
			$where = "WHERE c.nombre LIKE :busqueda";

			// El LIKE debe ser Case-Insensitive (depende de la Collation de MySQL, pero es común)
			// Agregamos comodines a la variable de búsqueda.
			$params[':busqueda'] = '%' . $buscar . '%';
		} elseif ($filtro === 'Todos') {
			$where = "";
		} else {
			// ...
		}

		$sql = $this->_db3->prepare("SELECT DISTINCT c.documento,c.nombre,c.actividad_cliente,IF(c.estado=1,'Activo','Inactivo') AS Estado,
			c.id AS cliente_id,c.sigla,c.telefono,c.direccion,c.capacidad_endeudamiento,c.plazo_facturacion,c.saldo_inicial,c.saldo_cartera
		FROM cmx_clientes c $where");

		$sql->execute($params);
		return $sql->fetchAll(PDO::FETCH_ASSOC);
	}

	/**
	 * Obtiene el historial de bloqueos de un vehículo usando la consulta específica.
	 * @param int $vehiculoId El ID del vehículo (que actúa como id_objeto).
	 * @return array El historial de bloqueos.
	 */
	public function getHistoricoBloqueosById(int $vehiculoId): array
	{

		// 🚨 SEGURIDAD: Sentencia preparada
		$sql = "
            SELECT
                eb.nombre_proceso,
                eb.estado_proceso AS estado,
                eb.tipo_inhabilitacion,
                hb.observacion,
                hb.usuario,
                CONCAT(hb.fecha, ' ', hb.hora) AS fecha_operacion
            FROM
                cmx_estado_bloqueo eb
                INNER JOIN cmx_historico_bloqueo hb ON eb.id = hb.bloqueo_id
            WHERE
                eb.id_objeto = :ObjetoId
            ORDER BY 
                hb.fecha DESC, hb.hora DESC
        ";

		try {
			// Usando tu instancia de conexión
			$stmt = $this->_db3->prepare($sql);

			// Vincular el parámetro. Usamos 'ObjetoId' tal como está en el SQL.
			$stmt->bindParam(':ObjetoId', $vehiculoId, PDO::PARAM_INT);

			$stmt->execute();

			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			// Manejo de errores
			throw new Exception("Error BD al consultar histórico: " . $e->getMessage());
		}
	}

	/**
	 * Actualiza el campo 'estado' y 'estado_proceso' en cmx_clientes.
	 * @param array $datos Array con clienteId, documento y nuevo_estado.
	 * @return array Resultado de la operación.
	 */
	public function setEstadoCliente(array $datos): array
	{
		// El campo 'estado' en la DB (ACTIVO/INACTIVO)
		// $estado = $datos['nuevo_estado'];
		// $estado = 1;

		// El campo 'estado_proceso' suele ser la etiqueta de negocio (ej: Habilitado / Bloqueado)
		// Puedes usar el mismo valor para 'estado' o una descripción más detallada:
		$estado_proceso = ($datos['nuevo_estado'] === 'Activo') ? 'Habilitado' : 'Inhabilitado';
		$estado = ($datos['nuevo_estado'] === 'Activo') ? 1 : 0;

		// 🚨 SEGURIDAD: Sentencia preparada
		$sql_update = "
            UPDATE 
                cmx_clientes 
            SET 
                estado = :estado, 
                estado_proceso = :estado_proceso 
            WHERE 
                id = :clienteId
                AND documento = :documento -- Opcional, para doble verificación
        ";

		try {
			$sql = $this->_db3->prepare($sql_update);

			// Vincular parámetros
			$sql->bindParam(':estado', $estado);
			$sql->bindParam(':estado_proceso', $estado_proceso);
			$sql->bindParam(':clienteId', $datos['clienteId'], PDO::PARAM_INT);
			$sql->bindParam(':documento', $datos['documento']);

			$sql->execute();

			if ($sql->rowCount() > 0) {
				return ['status' => true, 'message' => "Cliente actualizado a {$estado}."];
			} else {
				return ['status' => false, 'message' => 'No se encontró el cliente o el estado ya era el mismo.'];
			}
		} catch (PDOException $e) {
			throw new Exception("Error BD al actualizar cliente: " . $e->getMessage());
		}
	}
}
