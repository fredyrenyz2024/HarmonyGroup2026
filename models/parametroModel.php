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


	public function consulte_munipios()
	{
		try {
			$sql2 = "SELECT id, municipio, depto 
			FROM cmx_municipios WHERE pais='COLOMBIA'";
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
			$stmt = $this->_db3->prepare("SELECT * FROM cmx_clientes");
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

	public function Guardar_configuracion_correo($novedades, $cliente, $correo_automatico, $correo_manual)
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
			$sql = $this->_db3->prepare("INSERT INTO cmx_configuracion_envios (cliente_id, envio_automatico, envio_manual, estado_configuracion, usuario, fecha, hora, empresa_id) 
            VALUES (:cliente_id, :envio_automatico, :envio_manual, :estado_configuracion, :usuario, :fecha, :hora, :empresa_id)");
			// $sql->bindParam(param: ':cliente_id', $cliente);
			$sql->bindParam(':cliente_id', $cliente);
			$sql->bindParam(':envio_automatico', $correo_automatico);
			$sql->bindParam(':envio_manual', $correo_manual);
			$sql->bindParam(':estado_configuracion', $estado_configuracion);
			$sql->bindParam(':usuario', $user);
			$sql->bindParam(':fecha', $fecha);
			$sql->bindParam(':hora', $hora);
			$sql->bindParam(':empresa_id', $empresa_id);
			$sql->execute();
			if ($sql) {
				// Preparar consulta para cmx_plantilla_novedad_email
				$sql_novedad = $this->_db3->prepare("INSERT INTO cmx_plantilla_novedad_email (cliente_id, novedad_id, reporta_cliente, reporta_sac, usuario, fecha, hora, empresa_id)
                VALUES (:cliente_id, :novedad_id, :reporta_cliente, :reporta_sac, :usuario, :fecha, :hora, :empresa_id)");

				if (isset($novedades)) {
					foreach ($novedades as $id => $reportes) {
						$reportaCliente = isset($reportes['reporta_cliente']) ? 'SI' : 'NO';
						$reportaSac = isset($reportes['reporta_sac']) ? 'SI' : 'NO';

						// Usar variables intermedias para bindParam
						$sql_novedad->bindParam(':cliente_id', $cliente);
						$sql_novedad->bindParam(':novedad_id', $id);
						$sql_novedad->bindParam(':reporta_cliente', $reportaCliente);
						$sql_novedad->bindParam(':reporta_sac', $reportaSac);
						$sql_novedad->bindParam(':usuario', $user);
						$sql_novedad->bindParam(':fecha', $fecha);
						$sql_novedad->bindParam(':hora', $hora);
						$sql_novedad->bindParam(':empresa_id', $empresa_id);
						$sql_novedad->execute();
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
		// echo json_encode($response);
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
}
