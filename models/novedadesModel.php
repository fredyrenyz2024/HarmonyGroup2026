<?php
session_start();
class novedadesModel extends Model
{

	public function __construct()
	{
		parent::__construct();
	}

	public function num_novedad()
	{
		$sql = 'SELECT max(codigo_nove)+1 AS nco FROM cmx_novedades2';
		$result = $this->_db->getConsulta($sql); //viene de confinguraciones funciones establecidas por defecto para consultas, eliminar, registrar... (getconsuktas SOLO para consultar algo)
		return $result;
	}

	public function Listar_Manifiestos_Seguimiento($perfil_id)
	{
		$resultado = [];
		if ($perfil_id === "44") { #Perfil Administrador Torre Control
			// echo 'HOLA MUNDO';
			$sql = $this->_db3->prepare("SELECT
				pd.numdoc_solicitud,
				cs.referencia AS placa,
				cs.cedula_conductor,
				cs.nombre_conductor,
				pd.ciudad_origen AS origen,
				pd.ciudad_destino AS destino,
				CONCAT(
					IFNULL(pd.cod_producto, '-'),
					pd.producto
				) AS mer_producto,
				CONCAT(
					cs.fecha_inicio, '-', cs.hora_inicio
				) AS Fecha_Inicio,
				cl.nombre AS nombre_cliente,
				cl.email,
				CONCAT(ult.fecha, '-', ult.hora) AS Ultimo_Registro,
				pd.referencia_pedido,
				ult.tipo_trazabilidad,
				ult.observacion,
				IF(
					ult.evidencia IS NULL,
					'SIN REGISTRO',
					CONCAT(ult.evidencia, '/', ult.archivo)
				) AS Evidencia,
				cl.id AS Cliente_Id,
				cs.estado_pedido_asignado AS Estado_Pedido
			FROM
				(
					SELECT
						pt.*,
						ROW_NUMBER() OVER (
							PARTITION BY
								pt.pedido_id
							ORDER BY
								pt.fecha DESC,
								pt.hora DESC
						) AS row_num
					FROM
						cmx_trazabilidad_pedido_tr pt
					WHERE pt.tipo_trazabilidad<>'Salida Descargue'
				) AS ult
				JOIN cmx_pedido_torre_control AS pd ON ult.pedido_id = pd.numdoc_solicitud
				JOIN cmx_cliente_proveedor_servicio AS cs ON ult.pedido_id = cs.pedido_id
				JOIN cmx_clientes AS cl ON pd.cliente = cl.id
			WHERE 
				pd.fecha BETWEEN DATE_FORMAT(CURDATE(), '2025-07-01') 
							AND LAST_DAY(CURDATE())
				AND ult.row_num = 1
				AND cs.estado_pedido_asignado='Activo' AND ult.tipo_trazabilidad<>'Salida Descargue'");
			// WHERE 
			// 	pd.fecha BETWEEN DATE_FORMAT(CURDATE(), '%Y-%m-01') 
			// 				AND LAST_DAY(CURDATE())
			// 	AND ult.row_num = 1");

			$sql->execute();
			$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		} else {
			$sql = $this->_db3->prepare("SELECT
				ma.placa,
				ss.nundoc_solicitud AS Solicitud_Id,
				cl.nombre AS Cliente,
				ma.id AS Manifiesto,
				r.id AS Remesa,
				oc.id AS Orden_Cargue,
				mn1.municipio AS origen,
				mn2.municipio AS destino,
				CONCAT(ma.fecha_expedicion, ' - ', ma.hora_expedicion) AS Feca_Expedicion,
				cl.id AS Cliente_Id,
				CONCAT(pro.nombre,' ', pro.apellido1,' ',pro.apellido2) AS Nombre_Conductor,
				ise.novedad,
				IFNULL(m.municipio, pc.punto_controlador) AS Ultimo_Sitio,
				ce.envio_automatico,
				ce.envio_manual,
				ce.envio_whatsapp,
				ce.estado_configuracion,
				de.nombre,
				de.correo,
				de.celular,
				de.estado_detalle
			FROM
				cmx_manifiesto ma -- JOIN de datos generales
				INNER JOIN cmx_proveedores pro ON ma.conductor_manifiesto = pro.numero_documento
				INNER JOIN cmx_municipios mn1 ON ma.origen_viaje = mn1.id
				INNER JOIN cmx_municipios mn2 ON ma.destino_viaje = mn2.id
				INNER JOIN cmx_inicio_ruta inr ON ma.id = inr.num_manifiesto -- JOIN de remesas y órdenes
				INNER JOIN cmx_manifiesto_remesa mr ON mr.id_manifiesto = ma.id
				INNER JOIN cmx_remesa r ON r.id = mr.id_remesa
				INNER JOIN cmx_remesa_ordencargue ro ON ro.id_remesa = r.id
				INNER JOIN cmx_orden_cargue oc ON oc.id = ro.id_orden_cargue -- JOIN de cliente y mercancía
				INNER JOIN cmx_clientes cl ON cl.id = oc.cli_id
				INNER JOIN cmx_solicitud_vehiculo2 ss ON ss.nundoc_solicitud = oc.mer_idservicio
				INNER JOIN cmx_cotizaciones_serviciocliente cs ON cs.n_cotizacion = ss.n_cotizacion -- INNER JOIN cmx_detalle_mercancia2 dm ON dm.n_cotizacion = cs.n_cotizacion
				-- JOIN de tabla de ultimo seguimento realizado
				INNER JOIN cmx_inicio_seguimiento ise ON inr.cod_inicio = ise.cod_ini_ruta
				INNER JOIN cmx_ultimo_seguimiento us ON ise.id = us.seguimiento_id -- LEFT JOIN para cumplido y seguimiento
				-- INSTANCIAR CONFIGURACION DE ENVIOS PARA LOS CLIENTES
				INNER JOIN cmx_configuracion_envios ce ON cl.id=ce.cliente_id
				INNER JOIN cmx_detalle_configuracion_envio de ON ce.id=de.configuracion_id

				LEFT JOIN cmx_cumplido cu ON ma.id = cu.manifiesto -- LEFT JOIN cmx_view_seguimiento us ON us.cod_ini_ruta = inr.cod_inicio
				LEFT JOIN cmx_municipios m ON ise.detalle_tipo = m.id
				LEFT JOIN cmx_puntos_controlador pc ON ise.id = pc.seguimiento_id
				-- Condiciones
				-- LEFT JOIN cmx_conf
			WHERE
				cu.manifiesto IS NULL AND ma.estado_seguimiento = 'SEGUIMIENTO' -- Agrupación y orden
			GROUP BY
				ma.id
			ORDER BY
				ise.tiempo DESC");

			$sql->execute();
			$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		}

		// $sql->execute();
		// $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $resultado;
	}

	public function Consultar_Configuraciones_Cliente($ClienteId)
	{
		$sql = $this->_db3->prepare("SELECT
			*,
			dce.id AS detalle_id
		FROM
			cmx_configuracion_envios ce
			INNER JOIN cmx_detalle_configuracion_envio dce ON ce.id = dce.configuracion_id
		WHERE
			ce.cliente_id = :ClienteId");

		$sql->bindParam(":ClienteId", $ClienteId);
		$sql->execute();
		$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $resultado;
	}

	//Funcion para actualizar los eventos
	public function Actualizar_Campo_Configuracion($campo, $valor, $cliente_id, $empresa_id = null, $usuario = null)
	{
		try {
			// Verificar que el campo sea válido (seguridad, evitar SQL injection)
			$camposPermitidos = ["envio_automatico", "envio_manual", "envio_whatsapp", "estado_configuracion"];
			if (!in_array($campo, $camposPermitidos)) {
				throw new Exception("Campo no permitido: " . $campo);
			}

			// Construir SQL dinámico
			$sql = "UPDATE cmx_configuracion_envios 
                SET $campo = :valor, usuario = :usuario, fecha = CURDATE(), hora = CURTIME() 
                WHERE cliente_id = :cliente_id";

			// Si hay empresa, también filtrar por empresa_id
			if ($empresa_id !== null) {
				$sql .= " AND empresa_id = :empresa_id";
			}

			$stmt = $this->_db3->prepare($sql);
			$stmt->bindParam(":valor", $valor, PDO::PARAM_STR);
			$stmt->bindParam(":usuario", $usuario, PDO::PARAM_STR);
			$stmt->bindParam(":cliente_id", $cliente_id, PDO::PARAM_INT);

			if ($empresa_id !== null) {
				$stmt->bindParam(":empresa_id", $empresa_id, PDO::PARAM_INT);
			}

			return $stmt->execute();
		} catch (\Throwable $th) {
			return ["error" => true, "message" => $th->getMessage()];
		}
	}

	public function Actualizar_Usuario_Configuracion($detalleId, $clienteId, $configuracionId, $estado)
	{

		$user = $_SESSION["usuario"]["nom_usuario"];

		$sql = "UPDATE cmx_detalle_configuracion_envio
            SET estado_detalle = :estado,
                usuario = :usuario,
                fecha = CURDATE(),
                hora = CURTIME()
            WHERE id = :detalle_id";

		$stmt = $this->_db3->prepare($sql);
		$stmt->bindParam(':estado', $estado);
		$stmt->bindParam(':usuario', $user);
		$stmt->bindParam(':detalle_id', $detalleId);

		return $stmt->execute();
	}

	public function GuardarContactosEnvio($contactos, $configuracionId)
	{
		$response = [];

		$usuario = $_SESSION["usuario"]["nom_usuario"];
		$empresa_id = $_SESSION['usuario']['empresa_id'];
		foreach ($contactos as $c) {
			$sql = "INSERT INTO cmx_detalle_configuracion_envio
                (configuracion_id, nombre, correo, celular, estado_detalle, usuario, fecha, hora, empresa_id)
                VALUES (:configuracion_id, :nombre, :correo, :celular, :estado_detalle, :usuario, CURDATE(), CURTIME(), :empresa_id)";

			$stmt = $this->_db3->prepare($sql);
			$stmt->bindParam(':configuracion_id', $configuracionId);
			$stmt->bindParam(':nombre', $c['nombre']);
			$stmt->bindParam(':correo', $c['correo']);
			$stmt->bindParam(':celular', $c['celular']);
			$stmt->bindParam(':estado_detalle', $c['estado']);
			$stmt->bindParam(':usuario', $usuario);
			$stmt->bindParam(':empresa_id', $empresa_id); // si manejas multiempresa

			$stmt->execute();
		}

		if ($stmt) {
			return true;
		}
	}

	/**
	 * Consulta y cuenta los manifiestos agrupados por el titular (tenedor) de la carga.
	 */
	public function getManifiestoConteoPorTitular(): array
	{
		// 🚨 La consulta no tiene parámetros WHERE, por lo que no necesita sentencias preparadas.
		$sql =
			"SELECT
				cond.numero_documento AS Nit_titular,
                CONCAT(cond.nombre,' ', IFNULL(cond.apellido1,' '),' ', IFNULL(cond.apellido2,' ')) AS Conductor,
                cond.direccion,
                cond.celular,
                CONCAT(m1.municipio,'-',m1.depto) AS Municipio,
                COUNT(m.id) AS cantidad_manifiesto
            FROM
                cmx_manifiesto m
                LEFT JOIN cmx_manifiesto_anticipo ma ON m.id = ma.id_manifiesto
                INNER JOIN cmx_pagos_manifiestos pm ON m.id = pm.manifiesto_id
                INNER JOIN cmx_proveedores cond ON m.conductor_manifiesto = cond.numero_documento
                INNER JOIN cmx_municipios m1 ON cond.id_municipio=m1.id
            GROUP BY
                cond.numero_documento,
                Conductor,
                cond.direccion,
                cond.celular,
                Municipio
            HAVING
                COUNT(m.id) > 0
			";
		try {
			$stmt = $this->_db3->prepare($sql);
			$stmt->execute();

			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			throw new Exception("Error BD al consultar el conteo de manifiestos: " . $e->getMessage());
		}
	}

	public function getManifiestoConteoPorTenedor(): array
	{
		// 🚨 La consulta no tiene parámetros WHERE, por lo que no necesita sentencias preparadas.
		$sql = "SELECT
	            ten.numero_documento AS Nit_titular,
	            CONCAT(
	                ten.nombre,' ',
	                IFNULL(ten.apellido1, ''),' ',
	                IFNULL(ten.apellido2, '')
	            ) AS Tenedor,
	            CONCAT(
	                cond.nombre,' ',
	                IFNULL(cond.apellido1, ''),' ',
	                IFNULL(cond.apellido2, '')
	            ) AS Conductor,
	            ten.direccion,
	            ten.celular,
	            CONCAT(m1.municipio,'-',m1.depto) AS Municipio,
	            COUNT(m.id) AS cantidad_manifiesto
	        FROM
	            cmx_manifiesto m
	            LEFT JOIN cmx_manifiesto_anticipo ma ON m.id = ma.id_manifiesto
	            INNER JOIN cmx_pagos_manifiestos pm ON m.id = pm.manifiesto_id
	            INNER JOIN cmx_proveedores ten ON m.titular_manifiesto = ten.numero_documento
	            INNER JOIN cmx_proveedores cond ON m.conductor_manifiesto = cond.numero_documento
	            INNER JOIN cmx_municipios m1 ON cond.id_municipio=m1.id
	        GROUP BY
	            ten.numero_documento,
	            Tenedor,
	            Conductor,
	            cond.direccion,
	            cond.celular,
	            Municipio
	        HAVING
	            COUNT(m.id) > 0
	    ";
		try {
			$stmt = $this->_db3->prepare($sql);
			$stmt->execute();

			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			throw new Exception("Error BD al consultar el conteo de manifiestos: " . $e->getMessage());
		}
	}

	/**
	 * Obtiene el listado completo de manifiestos para un titular específico.
	 * @param string $nitTitular Documento del titular (tenedor) de la carga.
	 */
	public function getDetalleManifiestosByTitular(string $nitTitular): array
	{
		// 🚨 SEGURIDAD: Sentencia preparada
		$sql = "SELECT
				m.id,
				m.placa,
				m.fecha_expedicion,
				m.estado_seguimiento,
				-- pm.anticipo AS valor_pago,
				CONCAT(m1.municipio,' - ',m1.depto) AS Origen,
				CONCAT(m2.municipio,' - ',m2.depto) AS Destino,
				m.Lugar AS Agencia,
				m.conductor_manifiesto,
				m.titular_manifiesto,
				cond.numdoc_nexos AS Nudoc_Conductor,
				CONCAT(cond.nombre,' ',cond.apellido1,' ',cond.apellido2) AS Conductor,
				pm.estado_ancipo,
				pm.estado_liquidacion,
				pm.estado AS estado_pago,
				ma.valor_anticipo,
				m.saldo,
				m.estado_cargue,
				m.valor_total_viaje,
				m.saldo
			FROM
				cmx_manifiesto m
				INNER JOIN cmx_pagos_manifiestos pm ON m.id = pm.manifiesto_id
				INNER JOIN cmx_municipios m1 ON m.origen_viaje=m1.id
				INNER JOIN cmx_municipios m2 ON m.destino_viaje=m2.id
			  INNER JOIN cmx_proveedores cond ON m.conductor_manifiesto=cond.numero_documento
				LEFT JOIN cmx_manifiesto_anticipo ma ON m.id = ma.id_manifiesto
			WHERE
				m.conductor_manifiesto = :nit_titular
			ORDER BY
				m.fecha_expedicion DESC";

		try {
			$stmt = $this->_db3->prepare($sql);
			$stmt->bindParam(':nit_titular', $nitTitular);
			$stmt->execute();

			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			throw new Exception("Error BD al consultar detalle de manifiestos: " . $e->getMessage());
		}
	}

	public function getDetalleManifiestosTitular(string $nitTitular): array
	{
		// 🚨 SEGURIDAD: Sentencia preparada
		$sql = "SELECT
				m.id,
				m.placa,
				m.fecha_expedicion,
				m.estado_seguimiento,
				CONCAT(m1.municipio,' - ',m1.depto) AS Origen,
				CONCAT(m2.municipio,' - ',m2.depto) AS Destino,
				m.Lugar AS Agencia,
				m.conductor_manifiesto,
				m.titular_manifiesto,
				cond.numdoc_nexos AS Nudoc_Conductor,
				CONCAT(cond.nombre,' ',cond.apellido1,' ',cond.apellido2) AS Conductor,
				ten.numdoc_nexos AS Nudoc_Tenedor,
				pm.estado_ancipo,
				pm.estado_liquidacion,
				pm.estado AS estado_pago,
				ma.valor_anticipo,
				m.valor_total_viaje,
				
				-- 🛑 INICIO: LÓGICA DE SALDO AJUSTADO
				m.saldo AS Saldo_Original,
				pad.valor AS Valor_Sobreanticipo,
				
				CASE 
					WHEN pad.valor IS NOT NULL THEN 
						(
							-- 1. Limpiamos m.saldo (VARCHAR) (Quitamos '$' y ',' de miles)
							CAST(
								REPLACE(REPLACE(m.saldo, '$', ''), ',', '') 
							AS DECIMAL(12, 2))
							
							-- 2. Restamos el Sobre Anticipo (DECIMAL)
							- pad.valor
						)
					ELSE 
						-- Si no hay sobre anticipo, solo devolvemos el saldo limpio
						CAST(
							REPLACE(REPLACE(m.saldo, '$', ''), ',', '') 
						AS DECIMAL(12, 2))
				END AS Saldo_Ajustado_Liquidacion
				-- 🛑 FIN: LÓGICA DE SALDO AJUSTADO
				
			FROM
				cmx_manifiesto m
				INNER JOIN cmx_pagos_manifiestos pm ON m.id = pm.manifiesto_id
				INNER JOIN cmx_municipios m1 ON m.origen_viaje=m1.id
				INNER JOIN cmx_municipios m2 ON m.destino_viaje=m2.id
				INNER JOIN cmx_proveedores cond ON m.conductor_manifiesto=cond.numero_documento
				INNER JOIN cmx_proveedores ten ON m.titular_manifiesto=ten.numero_documento
				-- INNER JOIN cmx_cumplido cu ON m.id=cu.manifiesto AND cu.estado=1
				LEFT JOIN cmx_pagos_anticipo_detalle pad ON pm.id=pad.id_cabecera AND pad.tipo_item='SOBREANTICIPO'
				LEFT JOIN cmx_manifiesto_anticipo ma ON m.id = ma.id_manifiesto
			WHERE
				m.titular_manifiesto = :nit_titular
			ORDER BY
				m.fecha_expedicion DESC";

		try {
			$stmt = $this->_db3->prepare($sql);
			$stmt->bindParam(':nit_titular', $nitTitular);
			$stmt->execute();

			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			throw new Exception("Error BD al consultar detalle de manifiestos: " . $e->getMessage());
		}
	}

	/**
	 * Verifica la existencia de métodos de pago activos (Cuenta, Tarjeta o Beneficiario) 
	 * y cumplimiento para un proveedor.
	 * * @param int $idProveedor ID interno del proveedor.
	 * @return array Resultado de la validación, incluyendo el método de pago activo.
	 */
	public function validarDatosPagoConductor(int $idProveedor): array
	{
		// 🛑 MÉTODO DE PAGO ACTIVO
		$metodo_pago_activo = 'Ninguno';

		// 🚨 CONSULTA ÚNICA: Recopilar todos los estados de pago activos (Estado = 1/Vigente)
		$sqlMetodosPago = "SELECT 
				-- Datos de Cuenta Bancaria Principal (Vigente/Activa)
				pf.id AS pf_id,
				pf.numero_cuenta AS pf_cuenta,
				pf.documento_eps AS pf_eps,
				-- Datos de Tercero Beneficiario (Solo buscamos su existencia)
				pb.documento AS ben_documento,
				-- Datos de Tarjeta Asignada (Estado de la asignación Vigente = 1)
				at.id AS asignacion_id,
				p.numdoc_nexos
				
			FROM cmx_proveedores p
			-- LEFT JOIN a Datos Financieros (Cuenta Bancaria)
			LEFT JOIN cmx_proveedor_financieros pf  ON p.numdoc_nexos = pf.id_proveedor AND pf.estado = 1
			-- LEFT JOIN a Beneficiario
			LEFT JOIN cmx_proveedor_beneficiario pb  ON p.numdoc_nexos = pb.id_proveedor
			-- LEFT JOIN a Asignación de Tarjeta
			LEFT JOIN cmx_asignacion_tarjeta at ON p.numdoc_nexos = at.id_conductor AND at.estado_asignacion = 1
				
			WHERE p.numdoc_nexos = :id_proveedor"; // El filtro principal es el ID del conductor

		try {
			$stmt = $this->_db3->prepare($sqlMetodosPago);
			$stmt->bindParam(':id_proveedor', $idProveedor, PDO::PARAM_INT);
			$stmt->execute();
			$result = $stmt->fetch(PDO::FETCH_ASSOC);

			// ---------------------------------------------------
			// 🛑 LÓGICA DE DETERMINACIÓN DEL MÉTODO ACTIVO
			// ---------------------------------------------------
			if ($result) {
				// Prioridad 1: Tarjeta Asignada (si está vigente)
				if (!empty($result['asignacion_id'])) {
					$metodo_pago_activo = 'Tarjeta Asignada';
				}
				// Prioridad 2: Cuenta de Tercero Beneficiario (si existe el registro)
				elseif (!empty($result['ben_documento'])) {
					$metodo_pago_activo = 'Tercero Beneficiario';
				}
				// Prioridad 3: Cuenta Bancaria Principal (si existe el registro activo)
				elseif (!empty($result['pf_id']) && !empty($result['pf_cuenta'])) {
					$metodo_pago_activo = 'Cuenta Principal';
				}
			}

			// ---------------------------------------------------
			// 🛑 VALIDACIÓN DE CUMPLIMIENTO (OPCIONAL)
			// Se puede añadir lógica aquí si documento_eps es obligatorio:
			$cumplimiento_ok = !empty($result['pf_eps']); // Ejemplo: solo si tiene el documento EPS

			// ---------------------------------------------------

			return [
				'status' => $metodo_pago_activo !== 'Ninguno', // Es válido si tiene CUALQUIER método activo
				'metodo_pago' => $metodo_pago_activo,
				'bancarios_ok' => $metodo_pago_activo !== 'Ninguno',
				'cumplimiento_ok' => $cumplimiento_ok ?? false,
				'datos_adicionales' => $result ?? null
			];
		} catch (PDOException $e) {
			throw new Exception("Error BD validando métodos de pago del proveedor: " . $e->getMessage());
		}
	}

	/**
	 * Obtiene proveedores activos filtrados por una actividad específica (Conductor, Poseedor Vehículo).
	 * * @param string $actividad La actividad a filtrar (ej: 'Conductor' o 'Poseedor Vehículo').
	 * @return array Lista de proveedores activos.
	 */
	public function getProveedoresActivos(string $actividad): array
	{
		// Usamos DISTINCT para evitar duplicados si un proveedor tiene el mismo ID en múltiples actividades (aunque filtramos por una).
		$sql = "
			SELECT 
				DISTINCT p.numdoc_nexos, 
				CONCAT(p.nombre, ' ', IFNULL(p.apellido1,' '), ' ', IFNULL(p.apellido2,' ')) AS nombre_completo,
				p.numero_documento
			FROM 
				cmx_proveedores p
				-- 🛑 JOIN con la tabla de actividad
				INNER JOIN cmx_actividad_proveedor ap ON p.numdoc_nexos = ap.id_proveedor
			WHERE 
				p.estado = :estado_activo
				AND ap.actividad = :actividad_filtro
			ORDER BY 
				nombre_completo ASC
    	";

		$estadoActivo = 'Activo';

		try {
			$stmt = $this->_db3->prepare($sql);
			$stmt->bindParam(':estado_activo', $estadoActivo);
			$stmt->bindParam(':actividad_filtro', $actividad); // 🛑 Binding de la nueva actividad
			$stmt->execute();
			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			error_log("Error BD en getProveedoresActivos: " . $e->getMessage());
			throw new Exception("Error al consultar proveedores activos.");
		}
	}

	const UPLOAD_DIR_FINANCIERO = 'public/files/proveedores/financieros/';
	protected $_db3;

	// 🛑 NOTA: Asumo que la función subirArchivo y la constante UPLOAD_DIR_FINANCIERO están definidas.
	/**
	 * Sube un archivo de forma segura. (Mantenida de la lógica previa)
	 * @param array $fileData El array del archivo de $_FILES.
	 * @param string $idProveedor ID del proveedor.
	 * @param string $prefix Prefijo para el nombre del archivo ('certificado', 'rut', 'seguridad_social', 'ben_cert', etc.).
	 * @return string|null La ruta relativa del archivo guardado, o null si no hay archivo.
	 * @throws Exception Si la subida o el movimiento fallan.
	 */
	protected function subirArchivo(array $fileData, string $idProveedor, string $prefix): ?string
	{
		if (!isset($fileData['tmp_name']) || empty($fileData['tmp_name'])) {
			return null;
		}

		if ($fileData['error'] !== UPLOAD_ERR_OK) {
			throw new Exception("Error al subir el archivo {$prefix}. Código de error: {$fileData['error']}");
		}

		$targetDir = self::UPLOAD_DIR_FINANCIERO . $idProveedor . '/';

		if (!is_dir($targetDir)) {
			if (!mkdir($targetDir, 0777, true)) {
				throw new Exception("Fallo la creación del directorio para el proveedor: {$idProveedor}");
			}
		}

		$ext = pathinfo($fileData['name'], PATHINFO_EXTENSION);
		$fileName = "{$prefix}_{$idProveedor}_" . time() . '.' . $ext;
		$targetFile = $targetDir . $fileName;

		if (!move_uploaded_file($fileData['tmp_name'], $targetFile)) {
			throw new Exception("Fallo la operación al mover el archivo {$prefix} subido.");
		}

		return $idProveedor . '/' . $fileName;
	}

	// --------------------------------------------------------------------------------------------------

	/**
	 * Inserta o Actualiza (UPSERT) los datos financieros del proveedor principal y, condicionalmente,
	 * los datos del tercero beneficiario.
	 *
	 * @param array $datos Array de datos del formulario (POST).
	 * @param ?array $file Certificado bancario del proveedor.
	 * @param ?array $rut_file RUT del proveedor.
	 * @param ?array $seguridad_file Seguridad social del proveedor.
	 * @param ?array $file_ben_cuenta Certificado bancario del beneficiario.
	 * @param ?array $file_ben_rut RUT del beneficiario.
	 * @param ?array $file_ben_seguridad Seguridad social del beneficiario.
	 * @param ?array $file_ben_acuerdo Acuerdo del beneficiario.
	 * @return array Estado y mensaje del resultado.
	 * @throws Exception Si la subida del archivo o la operación de base de datos fallan.
	 */
	public function upsertDatosFinancieros(array $datos, ?array $file, ?array $rut_file, ?array $seguridad_file, ?array $file_ben_cuenta, ?array $file_ben_rut, ?array $file_ben_seguridad, ?array $file_ben_acuerdo): array
	{
		// 1. Datos de Auditoría y Control
		$usuario = $_SESSION["usuario"]["nom_usuario"] ?? 'SYSTEM_USER';
		$empresa_id = $_SESSION["usuario"]["empresa_id"] ?? 1;
		$fechaAuditoria = date('Y-m-d');
		$horaAuditoria = date('H:i:s');
		$estado = 1;
		$idProveedor = (int)$datos['id_proveedor'];
		$numeroCuenta = $datos['numero_cuenta'] ?? ''; // Usar '' en lugar de null para NOT NULL
		$esBeneficiario = (int)($datos['es_beneficiario'] ?? 0);

		// Rutas inicializadas
		$rutaCertificado = $rutaRut = $rutaSeguridad = null;
		$rutaBenCertificado = $rutaBenRut = $rutaBenSeguridad = $rutaBenAcuerdo = null;

		try {
			$this->_db3->beginTransaction();

			// 2. Subir Archivos del BENEFICIARIO (Solo si esBeneficiario = 1)
			if ($esBeneficiario === 1) {
				if ($file_ben_cuenta && !empty($file_ben_cuenta['tmp_name'])) {
					$rutaBenCertificado = $this->subirArchivo($file_ben_cuenta, (string)$idProveedor, 'ben_cert');
				}
				if ($file_ben_rut && !empty($file_ben_rut['tmp_name'])) {
					$rutaBenRut = $this->subirArchivo($file_ben_rut, (string)$idProveedor, 'ben_rut');
				}
				if ($file_ben_seguridad && !empty($file_ben_seguridad['tmp_name'])) {
					$rutaBenSeguridad = $this->subirArchivo($file_ben_seguridad, (string)$idProveedor, 'ben_seguridad');
				}
				if ($file_ben_acuerdo && !empty($file_ben_acuerdo['tmp_name'])) {
					$rutaBenAcuerdo = $this->subirArchivo($file_ben_acuerdo, (string)$idProveedor, 'ben_acuerdo');
				}
			} else {
				// 3. Subir Archivos PROVEEDOR PRINCIPAL
				if ($file && !empty($file['tmp_name'])) {
					$rutaCertificado = $this->subirArchivo($file, (string)$idProveedor, 'certificado');
				}
				if ($rut_file && !empty($rut_file['tmp_name'])) {
					$rutaRut = $this->subirArchivo($rut_file, (string)$idProveedor, 'rut');
				}
				if ($seguridad_file && !empty($seguridad_file['tmp_name'])) {
					$rutaSeguridad = $this->subirArchivo($seguridad_file, (string)$idProveedor, 'seguridad_social');
				}
			}

			// 4. CONSULTAR REGISTRO EXISTENTE (cmx_proveedor_financieros)
			// $sqlCheck = "SELECT id, numero_cuenta FROM cmx_proveedor_financieros WHERE id_proveedor = :id_proveedor LIMIT 1";
			$sqlCheck = "SELECT id FROM cmx_proveedor_financieros WHERE id_proveedor = :id_proveedor AND estado = 1";
			$stmtCheck = $this->_db3->prepare($sqlCheck);
			$stmtCheck->bindParam(':id_proveedor', $idProveedor, PDO::PARAM_INT);
			$stmtCheck->execute();
			$registroExistente = $stmtCheck->fetch(PDO::FETCH_ASSOC);

			$mensaje = 'Operación completada.'; // Mensaje por defecto

			// --------------------------------------------------------------------------------------
			// 5. LÓGICA DE UPSERT PARA cmx_proveedor_beneficiario
			// --------------------------------------------------------------------------------------
			if ($esBeneficiario === 1) {
				// Recopilar y sanear datos del beneficiario
				// Recopilación de datos y bindings
				$datosBen = [
					':documento' => $datos['doc_beneficiario'],
					':nombres' => $datos['nombres_beneficiario'],
					':apellidos' => $datos['apellidos_beneficiario'],
					':id_banco' => $datos['banco_beneficiario'],
					':tipo_cuenta' => $datos['tipo_cuenta_beneficiario'],
					':numero_cuenta' => $datos['num_cuenta_beneficiario'],
					':usuario' => $usuario,
					':fecha' => $fechaAuditoria, // Se usa para la columna DATE
					':hora' => $horaAuditoria,   // Se usa para la columna TIME
					':empresa_id' => $empresa_id, // 🛑 NUEVO: Incluimos la empresa
					':id_proveedor' => $idProveedor
				];

				// Rutas de Archivos: Inicialmente en el array si existe la ruta subida
				$datosBen[':certificado_adjunto'] = $rutaBenCertificado ?? NULL;
				$datosBen[':documento_rut'] = $rutaBenRut ?? NULL;
				$datosBen[':documento_seguridad'] = $rutaBenSeguridad ?? NULL;
				$datosBen[':documento_acuerdo'] = $rutaBenAcuerdo ?? NULL;

				// Buscar registro existente... (se mantiene)
				$sqlCheckBen = "SELECT id FROM cmx_proveedor_beneficiario WHERE id_proveedor = :id_proveedor LIMIT 1";
				$stmtCheckBen = $this->_db3->prepare($sqlCheckBen);
				$stmtCheckBen->bindParam(':id_proveedor', $idProveedor, PDO::PARAM_INT);
				$stmtCheckBen->execute();
				$registroBenExistente = $stmtCheckBen->fetch(PDO::FETCH_ASSOC);

				if ($registroBenExistente) {
					// 9. 🚨 UPDATE Beneficiario (Se necesita un array de bindings temporal para la ejecución)

					// Definimos los campos de actualización base
					$setClausesBen = [
						"documento = :documento",
						"nombres = :nombres",
						"apellidos = :apellidos",
						"id_banco = :id_banco",
						"tipo_cuenta = :tipo_cuenta",
						"numero_cuenta = :numero_cuenta",
						"usuario = :usuario",
						"fecha = :fecha",
						"hora = :hora",
						"empresa_id = :empresa_id"
					];

					// 🛑 Creamos un array de bindings temporal, copiando los datosBen
					$updateBenBindings = $datosBen;

					// Añadir archivos condicionalmente al SET y remover el binding si es NULL
					if ($rutaBenCertificado) {
						$setClausesBen[] = "certificado_adjunto = :certificado_adjunto";
					} else {
						unset($updateBenBindings[':certificado_adjunto']); // 🛑 CLAVE: Quitar el binding si no se usa
					}

					if ($rutaBenRut != 'undefined') {
						$setClausesBen[] = "documento_rut = :documento_rut";
					} else {
						unset($updateBenBindings[':documento_rut']);
					}

					if ($rutaBenSeguridad != 'undefined') {
						$setClausesBen[] = "documento_seguridad = :documento_seguridad";
					} else {
						unset($updateBenBindings[':documento_seguridad']);
					}

					if ($rutaBenAcuerdo != 'undefined') {
						$setClausesBen[] = "documento_acuerdo = :documento_acuerdo";
					} else {
						unset($updateBenBindings[':documento_acuerdo']);
					}

					$sqlBen = "UPDATE cmx_proveedor_beneficiario SET " . implode(', ', $setClausesBen) . " WHERE id_proveedor = :id_proveedor";
					$stmtBen = $this->_db3->prepare($sqlBen);

					// 🛑 EJECUCIÓN CLAVE: Usamos el array filtrado
					$stmtBen->execute($updateBenBindings);
				} else {
					// 10. INSERT Beneficiario (se mantiene, pero usamos la hora y fecha correctas)
					$sqlBen = "INSERT INTO cmx_proveedor_beneficiario (
					id_proveedor, documento, nombres, apellidos, id_banco, tipo_cuenta, numero_cuenta, 
					certificado_adjunto, documento_rut, documento_seguridad, documento_acuerdo, 
					usuario, fecha, hora, empresa_id) 
					VALUES (:id_proveedor, :documento, :nombres, :apellidos, :id_banco, :tipo_cuenta, :numero_cuenta, 
					:certificado_adjunto, :documento_rut, :documento_seguridad, :documento_acuerdo, 
					:usuario, :fecha, :hora, :empresa_id)";

					$stmtBen = $this->_db3->prepare($sqlBen);
					// 🛑 EJECUCIÓN CLAVE: Usamos el array $datosBen
					$stmtBen->execute($datosBen);
				}

				// Ejecución de Beneficiario (Usando el array de bindings completo)
				$stmtBen->execute($datosBen);
				$mensaje .= ' Y datos de beneficiario guardados.';
			} else {

				// 5. Preparar Bindings y Cláusulas

				// 5.1 Bindings comunes (para UPDATE y para el cuerpo del INSERT)
				$bindings = [
					':actividad_economica' => $datos['actividad_economica'] ?? 0,
					':obliga_tributaria' => $datos['obliga_tributaria'] ?? 0,
					':banco' => $datos['banco'] ?? 0,
					':tipo_cuenta' => $datos['tipo_cuenta'] ?? 0,
					':estado' => $estado,
					':usuario' => $usuario,
					':fecha' => $fechaAuditoria,
					':hora' => $horaAuditoria,
				];

				if ($registroExistente) {
					// // 6. 🚨 OPERACIÓN: UPDATE cmx_proveedor_financieros
					// $idRegistro = $registroExistente['id'];
					// // $cuentaExistente = (int)$registroExistente['numero_cuenta'];
					// $bindings[':id_registro'] = $idRegistro;

					// $setClauses = [
					// 	"actividad_economica = :actividad_economica",
					// 	"obliga_tributaria = :obliga_tributaria",
					// 	"banco = :banco",
					// 	"tipo_cuenta = :tipo_cuenta",
					// 	"estado = :estado",
					// 	"usuario = :usuario",
					// 	"fecha = :fecha",
					// 	"hora = :hora",
					// ];

					// // Lógica condicional de NUMERO_CUENTA (actualizar solo si es 0 en DB)
					// // if (empty($cuentaExistente) || $cuentaExistente === 0) { // Incluye chequeo de empty si la DB lo permite
					// if (empty($cuentaExistente)) { // Incluye chequeo de empty si la DB lo permite
					// 	$setClauses[] = "numero_cuenta = :numero_cuenta";
					// 	$bindings[':numero_cuenta'] = $numeroCuenta ?? 0;
					// }

					// // Añadir rutas de archivo condicionales
					// if ($rutaCertificado) {
					// 	$setClauses[] = "certificado_adjunto = :certificado_adjunto";
					// 	$bindings[':certificado_adjunto'] = $rutaCertificado;
					// }
					// if ($rutaRut) {
					// 	$setClauses[] = "documento_rut = :documento_rut";
					// 	$bindings[':documento_rut'] = $rutaRut;
					// }
					// if ($rutaSeguridad) {
					// 	$setClauses[] = "documento_eps = :documento_eps";
					// 	$bindings[':documento_eps'] = $rutaSeguridad;
					// }

					// $sqlUpdate = "UPDATE cmx_proveedor_financieros SET " . implode(', ', $setClauses) . " WHERE id = :id_registro";
					// $stmt = $this->_db3->prepare($sqlUpdate);
					// $mensaje = 'Datos financieros actualizados correctamente.';

					// $stmt->execute($bindings);

					// 🛑 6. 🚨 OPERACIÓN: HISTÓRICO - INACTIVAR REGISTRO VIGENTE (Sustituyendo el UPDATE)
					$idRegistro = $registroExistente['id'];

					// 6.1 INACTIVAR: Marcar el registro existente como inactivo (estado = 0)
					$sqlInactivar = "UPDATE cmx_proveedor_financieros
                                 SET estado = 0, usuario = :usuario, fecha = :fecha, hora = :hora
                                 WHERE id = :id_registro AND id_proveedor = :id_proveedor";

					$stmtInactivar = $this->_db3->prepare($sqlInactivar);
					$stmtInactivar->bindParam(':id_registro', $idRegistro, PDO::PARAM_INT);
					$stmtInactivar->bindParam(':id_proveedor', $idProveedor, PDO::PARAM_INT);
					$stmtInactivar->bindParam(':usuario', $usuario);
					$stmtInactivar->bindParam(':fecha', $fechaAuditoria);
					$stmtInactivar->bindParam(':hora', $horaAuditoria);
					$stmtInactivar->execute();

					// 6.2 OBTENER DATOS DE LA FILA INACTIVADA (para base del nuevo INSERT)
					// Usaremos los datos que ya tenemos del POST ($datos) para los campos modificables
					// y los datos existentes para los que no cambiaron (si fuera necesario, 
					// pero aquí asumimos que el POST trae la data completa de la cuenta).

					// 6.3 🚨 INSERTAR NUEVA FILA ACTIVA (DUPLICADO CON NUEVOS VALORES)

					// Preparamos los bindings para el INSERT de la nueva fila activa
					$bindingsInsert = [
						':id_proveedor' => $idProveedor,
						':actividad_economica' => $datos['actividad_economica'] ?? 0,
						':obliga_tributaria' => $datos['obliga_tributaria'] ?? 0,
						':banco' => $datos['banco'] ?? 0,
						':tipo_cuenta' => $datos['tipo_cuenta'] ?? 0,
						':numero_cuenta' => $numeroCuenta, // Valor nuevo
						':estado' => 1, // ACTIVAMOS LA NUEVA FILA
						':usuario' => $usuario,
						':fecha' => $fechaAuditoria,
						':hora' => $horaAuditoria,
						// Rutas de Archivos: Usar las rutas subidas o la ruta anterior si no se actualizó (COMPLEJO)
						// Para simplificar, asumimos que si no subió archivo nuevo, el front NO DEBERÍA HABER LLAMADO A ESTA ACCIÓN
						// pero, si lo hizo, el modelo debería obtener la ruta anterior si está vacía.
						':certificado_adjunto' => $rutaCertificado ?? $this->getOldFilePath($idProveedor, 'certificado_adjunto') ?? '',
						':documento_rut' => $rutaRut ?? $this->getOldFilePath($idProveedor, 'documento_rut') ?? '',
						':documento_eps' => $rutaSeguridad ?? $this->getOldFilePath($idProveedor, 'documento_eps') ?? '',
						':fecha_vencimiento' => $datos['fecha_vencimiento_seguridad_social'], // Valor nuevo
					];

					$sqlInsert = "INSERT INTO cmx_proveedor_financieros (
                    id_proveedor, actividad_economica, obliga_tributaria, banco, tipo_cuenta, numero_cuenta, 
                    certificado_adjunto, documento_rut, documento_eps, fecha_vencimiento, estado, usuario, fecha, hora) 
                    VALUES (:id_proveedor, :actividad_economica, :obliga_tributaria, :banco, :tipo_cuenta, :numero_cuenta, 
                    :certificado_adjunto, :documento_rut, :documento_eps, :fecha_vencimiento, :estado, :usuario, :fecha, :hora)";

					$stmt = $this->_db3->prepare($sqlInsert);
					$mensaje = 'Cuenta anterior inactivada y nueva cuenta registrada correctamente.';

					$stmt->execute($bindingsInsert); // Usamos el array con el valor '1' para estado
				} else {
					// 7. 🚨 OPERACIÓN: INSERT cmx_proveedor_financieros
					$bindings[':id_proveedor'] = $idProveedor;
					$bindings[':numero_cuenta'] = $numeroCuenta;
					$bindings[':certificado_adjunto'] = $rutaCertificado ?? '';
					$bindings[':documento_rut'] = $rutaRut ?? '';
					$bindings[':documento_eps'] = $rutaSeguridad ?? ''; // 🛑 Asegurar que el INSERT incluye documento_eps
					// $bindings[':fecha_vencimiento'] = empty($datos['fecha_vencimiento_seguridad_social']) ?? null; // 🛑 Asegurar que el INSERT incluye documento_eps
					// Corrección con operador ternario
					$bindings[':fecha_vencimiento'] = empty($datos['fecha_vencimiento_seguridad_social']) ? null : $datos['fecha_vencimiento_seguridad_social'];

					$sqlInsert = "INSERT INTO cmx_proveedor_financieros (id_proveedor, actividad_economica, obliga_tributaria, banco, tipo_cuenta, numero_cuenta, 
						certificado_adjunto, documento_rut, documento_eps, fecha_vencimiento, estado, usuario, fecha, hora) 
						VALUES (:id_proveedor, :actividad_economica, :obliga_tributaria, :banco, :tipo_cuenta, :numero_cuenta, 
						:certificado_adjunto, :documento_rut, :documento_eps, :fecha_vencimiento, :estado,  :usuario, :fecha, :hora)";

					$stmt = $this->_db3->prepare($sqlInsert);
					$mensaje = 'Nueva cuenta registrada correctamente.';

					$stmt->execute($bindings);
				}
			}

			// 9. Commit y Retorno
			$this->_db3->commit();
			return ['status' => true, 'message' => $mensaje];
		} catch (Exception $e) {
			if ($this->_db3->inTransaction()) {
				$this->_db3->rollBack();
			}
			// Manejo de errores y limpieza de archivos subidos
			throw new Exception($e->getMessage());
		}
	}

	/**
	 * Consulta la ruta de un documento específico de la fila ACTIVA más reciente.
	 */
	protected function getOldFilePath(int $idProveedor, string $column): ?string
	{
		$sql = "SELECT {$column} FROM cmx_proveedor_financieros WHERE id_proveedor = :id_proveedor AND estado = 1 ORDER BY id DESC LIMIT 1";
		try {
			$stmt = $this->_db3->prepare($sql);
			$stmt->bindParam(':id_proveedor', $idProveedor, PDO::PARAM_INT);
			$stmt->execute();
			$result = $stmt->fetch(PDO::FETCH_ASSOC);

			return $result[$column] ?? null;
		} catch (PDOException $e) {
			return null; // Fallo silencioso si no se encuentra el archivo anterior
		}
	}

	/**
	 * Obtiene todos los registros financieros para un proveedor, incluyendo los datos del Tercero Beneficiario.
	 */
	public function getDatosFinancierosByProveedor(int $idProveedor): array
	{
		$sql = "
			SELECT 
				pf.id, pf.numero_cuenta, pf.certificado_adjunto, pf.documento_rut, pf.documento_eps, pf.estado,
				pf.actividad_economica, pf.obliga_tributaria, -- Añadir estos para el formulario principal
				pf.banco, pf.tipo_cuenta, 
				b.abreviatura AS nombre_banco, 
				CASE pf.tipo_cuenta WHEN 1 THEN 'Ahorros' WHEN 2 THEN 'Corriente' ELSE 'Otro' END AS tipo_cuenta_desc,
				
				-- 🛑 DATOS DEL TERCERO BENEFICIARIO (LEFT JOIN)
				pb.documento AS ben_documento,
				pb.nombres AS ben_nombres,
				pb.apellidos AS ben_apellidos,
				pb.numero_cuenta AS ben_numero_cuenta,
				pb.certificado_adjunto AS ben_certificado_adjunto,
				pb.documento_rut AS ben_documento_rut,
				pb.documento_seguridad AS ben_documento_seguridad,
				pb.documento_acuerdo AS ben_documento_acuerdo,
				bb.abreviatura AS ben_nombre_banco, -- Banco del Beneficiario
				CASE pb.tipo_cuenta WHEN 1 THEN 'Ahorros' WHEN 2 THEN 'Corriente' ELSE 'Otro' END AS ben_tipo_cuenta_desc
			FROM 
				cmx_proveedor_financieros pf
				LEFT JOIN cmx_para_bancos b ON pf.banco = b.id -- Banco del proveedor principal
				LEFT JOIN cmx_proveedor_beneficiario pb ON pf.id_proveedor = pb.id_proveedor 
				LEFT JOIN cmx_para_bancos bb ON pb.id_banco = bb.id
			WHERE 
				pf.id_proveedor = :id_proveedor
			GROUP BY pf.id
				ORDER BY 
				pf.estado DESC, pf.id DESC

			";

		// pf.id_proveedor = :id_proveedor AND pf.estado=1
		try {
			$stmt = $this->_db3->prepare($sql);
			$stmt->bindParam(':id_proveedor', $idProveedor, PDO::PARAM_INT);
			$stmt->execute();
			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			throw new Exception("Error al listar datos financieros: " . $e->getMessage());
		}
	}

	const UPLOAD_DIR_ANTICIPO = 'public/files/anticipos/proveedor/';

	/**
	 * Sube el archivo de anticipo de forma segura.
	 * @param array $fileData El array del archivo de $_FILES.
	 * @param string $idProveedor ID del proveedor para nombrar la subcarpeta.
	 * @return string La ruta relativa del archivo guardado (para la DB).
	 * @throws Exception Si la subida, validación o el movimiento fallan.
	 */
	protected function subirAnticipo(array $fileData, string $idProveedor): string
	{
		// NOTA: La validación de que el archivo es OBLIGATORIO debe hacerse en el controlador.

		// 1. 🚨 SEGURIDAD: Validar errores de subida
		if (!isset($fileData['tmp_name']) || $fileData['error'] !== UPLOAD_ERR_OK) {
			// Este error puede indicar que el archivo es demasiado grande o falló la subida.
			throw new Exception("Error al subir el anticipo. Código de error: {$fileData['error']}", 400);
		}

		// 2. Validaciones de Contenido y Tamaño (Seguridad Extra)
		$max_size = 5 * 1024 * 1024; // 5 MB
		$allowed_types = ['application/pdf', 'image/jpeg', 'image/png'];
		$file_type = mime_content_type($fileData['tmp_name']);

		if ($fileData['size'] > $max_size) {
			throw new Exception("El archivo excede el tamaño máximo permitido (5MB).", 400);
		}
		if (!in_array($file_type, $allowed_types)) {
			throw new Exception("Tipo de archivo no permitido ($file_type). Solo PDF, JPG y PNG.", 400);
		}

		// 3. Definir y crear la carpeta de destino
		$targetDirAbs = self::UPLOAD_DIR_ANTICIPO . $idProveedor . '/'; // Ruta ABSOLUTA para PHP

		if (!is_dir($targetDirAbs)) {
			// Usar 0755 es más común y seguro en entornos de producción que 0777.
			if (!mkdir($targetDirAbs, 0755, true)) {
				throw new Exception("Fallo la creación del directorio para el proveedor: {$idProveedor}", 500);
			}
		}

		// 4. Generar nombre de archivo único
		$ext = pathinfo($fileData['name'], PATHINFO_EXTENSION);
		$fileName = "anticipo_{$idProveedor}_" . time() . '.' . $ext;
		$targetFileAbs = $targetDirAbs . $fileName; // Ruta ABSOLUTA final

		// 5. Mover el archivo subido de forma segura
		if (!move_uploaded_file($fileData['tmp_name'], $targetFileAbs)) {
			throw new Exception("Fallo la operación al mover el archivo subido.", 500);
		}

		// 6. Devolver la ruta RELATIVA a la raíz de la aplicación (para guardar en la DB)
		// Ruta que coincide con la especificación: public/files/anticipos/proveedores/{id}/archivo.ext
		return 'public/files/anticipos/proveedor/' . $idProveedor . '/' . $fileName;
	}

	/**
	 * Actualiza los campos específicos del anticipo en cmx_pagos_manifiestos, 
	 * inserta el detalle en cmx_pagos_anticipo_detalle y registra el movimiento de saldo.
	 */
	public function updateAnticipo(
		$manifiesto_id,
		$anticipo,
		$fecha_anticipo, // Ej: 2025-11-04
		$documento_anticipo,
		$id_proveedor,
		$slct_metodo_pago,
		$slct_tarjeta_disponible,
		$slct_cuenta_bancaria
	) {
		$hora_anticipo = date("H:i:s"); // 05:46:03
		$estado_ancipo_str = 'Pagado';
		$usuario_anticipo = $_SESSION["usuario"]["nom_usuario"] ?? 'Usuario Desconocido';
		$empresa_id = $_SESSION["usuario"]["empresa_id"] ?? 1;
		$rollback_file_abs = null;

		// 🛑 Determinar la cuenta final usada (id_cuenta_destino en cmx_pagos_manifiestos)
		$idCuentaDestino = null;
		if ($slct_metodo_pago === 'TARJETA' && !empty($slct_tarjeta_disponible)) {
			$idCuentaDestino = (int)$slct_tarjeta_disponible;
		} elseif (in_array($slct_metodo_pago, ['CUENTA_P', 'TERCERO', 'NUEVA_CUENTA']) && !empty($slct_cuenta_bancaria)) {
			$idCuentaDestino = (int)$slct_cuenta_bancaria;
		}

		try {
			$this->_db3->beginTransaction();

			// 1. Subir Archivo (Asumo que funciona)
			$rutaAnticipo = $this->subirAnticipo($documento_anticipo, (string)$id_proveedor);

			// 2. 🚨 ACTUALIZAR CABECERA DE PAGO (cmx_pagos_manifiestos)
			// La tabla cmx_pagos_manifiestos usa el estado ENUM ('Pendiente', 'Pagado', etc.)
			$queryCabecera = "UPDATE cmx_pagos_manifiestos
                         SET
                             total_pagado = :anticipo, 
                             estado_ancipo = :estado_ancipo, 
                             usuario = :usuario_anticipo,
                             fecha = :fecha_anticipo,
                             hora = :hora_anticipo
                         WHERE manifiesto_id = :manifiesto_id";

			$stmtCabecera = $this->_db3->prepare($queryCabecera);
			$stmtCabecera->bindParam(':anticipo', $anticipo, PDO::PARAM_STR);
			$stmtCabecera->bindParam(':estado_ancipo', $estado_ancipo_str);
			$stmtCabecera->bindParam(':usuario_anticipo', $usuario_anticipo);
			$stmtCabecera->bindParam(':fecha_anticipo', $fecha_anticipo);
			$stmtCabecera->bindParam(':hora_anticipo', $hora_anticipo); // 🛑 CORREGIDO: Pasa el valor TIME
			$stmtCabecera->bindParam(':manifiesto_id', $manifiesto_id, PDO::PARAM_INT);

			if (!$stmtCabecera->execute()) {
				throw new Exception("Error al actualizar la cabecera del manifiesto (cmx_pagos_manifiestos).", 500);
			}

			// 🛑 CORRECCIÓN DE INTEGRIDAD: OBTENER ID DE CABECERA (result['id'] no era null)
			// Buscamos el ID de la cabecera del manifiesto (ya sabemos que debe existir y estar actualizado)
			$sqlGetCabeceraId = "SELECT id FROM cmx_pagos_manifiestos WHERE manifiesto_id = :manifiesto_id";
			$stmtGetCabecera = $this->_db3->prepare($sqlGetCabeceraId);
			$stmtGetCabecera->bindParam(':manifiesto_id', $manifiesto_id, PDO::PARAM_INT);
			$stmtGetCabecera->execute();
			$idPagoCabecera = $stmtGetCabecera->fetch(PDO::FETCH_ASSOC)['id'] ?? null;

			if (empty($idPagoCabecera)) {
				throw new Exception("No se pudo obtener el ID de la cabecera de pago (cmx_pagos_manifiestos) para el detalle.");
			}

			// 3. 🚨 INSERTAR DETALLE DE ANTICIPO (cmx_pagos_anticipo_detalle)
			// NOTA: Tu tabla cmx_pagos_anticipo_detalle tiene columnas 'usuario', 'fecha', 'hora'.
			$sqlDetalle = "INSERT INTO cmx_pagos_anticipo_detalle (id_cabecera, tipo_item, valor, metodo_pago, id_cuenta_destino, documento_soporte, observacion, usuario, fecha, hora)
                       VALUES (:id_cabecera, 'ANTICIPO', :valor,:metodo_pago, :id_cuenta_destino, :documento_soporte, 'Anticipo inicial', :usuario, :fecha, :hora)"; // Columnas ajustadas

			$stmtDetalle = $this->_db3->prepare($sqlDetalle);
			// 🛑 CORRECCIÓN 1: Pasa el ID de cabecera obtenido
			$stmtDetalle->bindParam(':id_cabecera', $idPagoCabecera, PDO::PARAM_INT);
			$stmtDetalle->bindParam(':valor', $anticipo, PDO::PARAM_STR);
			$stmtDetalle->bindParam(':metodo_pago', $slct_metodo_pago);
			$stmtDetalle->bindParam(':id_cuenta_destino', $idCuentaDestino, PDO::PARAM_INT);
			$stmtDetalle->bindParam(':documento_soporte', $rutaAnticipo);
			$stmtDetalle->bindParam(':usuario', $usuario_anticipo);
			$stmtDetalle->bindParam(':fecha', $fecha_anticipo);
			$stmtDetalle->bindParam(':hora', $hora_anticipo);
			$stmtDetalle->execute();


			// 4. 🚨 REGISTRAR MOVIMIENTO DE SALDO (cmx_cartera_movimiento_anticipo)
			// Nota: Tu tabla cmx_cartera_movimiento_anticipo tiene columna 'fecha' y 'hora' separadas
			$saldoAnteriorMf = $this->getSaldoManifiesto($manifiesto_id);
			if ($saldoAnteriorMf === null || $saldoAnteriorMf === 'undefined' || $saldoAnteriorMf === '' || $saldoAnteriorMf === 0) {
				$saldoAnteriorMf = 0;
				// $saldoNuevoMf = $saldoAnteriorMf - $anticipo;
			} else {
				// $saldoAnteriorMf = parseFloat($saldoAnteriorMf);
				$saldoNuevoMf = $anticipo + $saldoAnteriorMf;
			}

			// 🛑 CORRECCIÓN 2: Ajustar la consulta a las columnas reales del histórico
			$sqlMov = "INSERT INTO cmx_cartera_movimiento_anticipo (id_manifiesto, tipo_movimiento, valor_movimiento, saldo_anterior_mf, saldo_nuevo_mf, usuario, fecha, hora, empresa_id)
                   VALUES (:id_manifiesto, 'ANTICIPO_REG', :valor, :saldo_ant, :saldo_nuevo, :usuario, :fecha, :hora, :empresa_id)";

			$stmtMov = $this->_db3->prepare($sqlMov);
			$stmtMov->bindParam(':id_manifiesto', $manifiesto_id, PDO::PARAM_INT);
			$stmtMov->bindParam(':valor', $anticipo, PDO::PARAM_STR);
			$stmtMov->bindParam(':saldo_ant', $saldoAnteriorMf);
			$stmtMov->bindParam(':saldo_nuevo', $saldoNuevoMf);
			$stmtMov->bindParam(':usuario', $usuario_anticipo);
			$stmtMov->bindParam(':fecha', $fecha_anticipo);
			$stmtMov->bindParam(':hora', $hora_anticipo); // 🛑 CORREGIDO: Pasa el valor TIME
			$stmtMov->bindParam(':empresa_id', $empresa_id); // 🛑 CORREGIDO: Pasa el valor TIME
			$stmtMov->execute(); // 🛑 LÍNEA 1261 (Aproximada)

			// 5. Commit: Si todo fue bien, guardar los cambios
			$this->_db3->commit();

			return ['status' => 'success', 'message' => 'Anticipo actualizado y registrado en historial correctamente.'];
		} catch (Exception $e) {
			// ... (Lógica de Rollback y manejo de excepciones) ...
			if ($this->_db3->inTransaction()) {
				$this->_db3->rollBack();
			}
			throw $e;
		}
	}

	public function updateSobreAnticipo(
		$manifiesto_id,
		$sobreAnticipo, // Valor del nuevo sobre anticipo
		$fecha_anticipo,
		$documento_anticipo,
		$id_proveedor,
		$slct_metodo_pago,
		$slct_tarjeta_disponible,
		$slct_cuenta_bancaria,
		$observacion
	) {
		$hora_anticipo = date("H:i:s");
		$estado_ancipo_str = 'Pagado';
		$usuario_anticipo = $_SESSION["usuario"]["nom_usuario"] ?? 'SYSTEM';
		$empresa_id = $_SESSION["usuario"]["empresa_id"] ?? 1;

		// 🛑 Determinar la cuenta final usada
		$idCuentaDestino = null;
		if ($slct_metodo_pago === 'TARJETA' && !empty($slct_tarjeta_disponible)) {
			$idCuentaDestino = (int)$slct_tarjeta_disponible;
		} elseif (in_array($slct_metodo_pago, ['CUENTA_P', 'TERCERO', 'NUEVA_CUENTA']) && !empty($slct_cuenta_bancaria)) {
			$idCuentaDestino = (int)$slct_cuenta_bancaria;
		}

		try {
			$this->_db3->beginTransaction();

			// 1. Subir Archivo
			$rutaAnticipo = $this->subirAnticipo($documento_anticipo, (string)$id_proveedor);

			// 2. 🚨 ACTUALIZAR CABECERA DE PAGO (cmx_pagos_manifiestos)

			// 🛑 Lógica para SUMAR el nuevo valor al total existente
			$queryCabecera = "UPDATE cmx_pagos_manifiestos
                         SET
                             total_pagado = total_pagado + :sobre_anticipo, -- 🛑 SUMA DIRECTA AL VALOR EXISTENTE
                             usuario = :usuario_anticipo, 
                             fecha = :fecha_anticipo,
                             hora = :hora_anticipo
                         WHERE manifiesto_id = :manifiesto_id";

			$stmtCabecera = $this->_db3->prepare($queryCabecera);

			// Bindings de la Cabecera
			$stmtCabecera->bindParam(':sobre_anticipo', $sobreAnticipo, PDO::PARAM_STR); // El valor a sumar
			$stmtCabecera->bindParam(':usuario_anticipo', $usuario_anticipo);
			$stmtCabecera->bindParam(':fecha_anticipo', $fecha_anticipo);
			$stmtCabecera->bindParam(':hora_anticipo', $hora_anticipo);
			$stmtCabecera->bindParam(':manifiesto_id', $manifiesto_id, PDO::PARAM_INT);

			if (!$stmtCabecera->execute()) {
				throw new Exception("Error al actualizar la cabecera del manifiesto para el Sobre Anticipo.", 500);
			}

			// 4. OBTENER ID DE CABECERA (cmx_pagos_manifiestos.id)
			$sqlGetCabeceraId = "SELECT id FROM cmx_pagos_manifiestos WHERE manifiesto_id = :manifiesto_id";
			$stmtGetCabecera = $this->_db3->prepare($sqlGetCabeceraId);
			$stmtGetCabecera->bindParam(':manifiesto_id', $manifiesto_id, PDO::PARAM_INT);
			$stmtGetCabecera->execute();
			$idPagoCabecera = $stmtGetCabecera->fetch(PDO::FETCH_ASSOC)['id'] ?? null;

			if (empty($idPagoCabecera)) {
				// 🛑 Esto debería ser imposible si el Anticipo inicial fue guardado correctamente
				throw new Exception("No se pudo obtener el ID de la cabecera de pago; el anticipo inicial no existe.", 404);
			}

			// 5. INSERTAR DETALLE DE SOBRE ANTICIPO (cmx_pagos_anticipo_detalle)
			$sqlDetalle = "INSERT INTO cmx_pagos_anticipo_detalle (id_cabecera, tipo_item, valor, metodo_pago, id_cuenta_destino, documento_soporte, observacion, usuario, fecha, hora)
                       VALUES (:id_cabecera, 'SOBREANTICIPO', :valor,:metodo_pago, :id_cuenta_destino, :documento_soporte, 'Anticipo inicial', :usuario, :fecha, :hora)"; // Columnas ajustadas

			$stmtDetalle = $this->_db3->prepare($sqlDetalle);
			// 🛑 CORRECCIÓN 1: Pasa el ID de cabecera obtenido
			$stmtDetalle->bindParam(':id_cabecera', $idPagoCabecera, PDO::PARAM_INT);
			$stmtDetalle->bindParam(':valor', $sobreAnticipo, PDO::PARAM_STR);
			$stmtDetalle->bindParam(':metodo_pago', $slct_metodo_pago);
			$stmtDetalle->bindParam(':id_cuenta_destino', $idCuentaDestino, PDO::PARAM_INT);
			$stmtDetalle->bindParam(':documento_soporte', $rutaAnticipo);
			$stmtDetalle->bindParam(':usuario', $usuario_anticipo);
			$stmtDetalle->bindParam(':fecha', $fecha_anticipo);
			$stmtDetalle->bindParam(':hora', $hora_anticipo);
			$stmtDetalle->execute();

			// 6. REGISTRAR MOVIMIENTO DE SALDO (cmx_cartera_movimiento_anticipo)
			// $saldoAnteriorMf = $this->getSaldoManifiesto($manifiesto_id);
			// $saldoNuevoMf = $saldoAnteriorMf - $sobreAnticipo;
			$saldoAnteriorMf = $this->getSaldoManifiesto($manifiesto_id);
			if ($saldoAnteriorMf === null || $saldoAnteriorMf === 'undefined' || $saldoAnteriorMf === '' || $saldoAnteriorMf === 0) {
				$saldoAnteriorMf = 0;
				// $saldoNuevoMf = $saldoAnteriorMf - $anticipo;
			} else {
				// $saldoAnteriorMf = parseFloat($saldoAnteriorMf);
				$saldoNuevoMf = $sobreAnticipo + $saldoAnteriorMf;
			}

			$sqlMov = "INSERT INTO cmx_cartera_movimiento_anticipo (id_manifiesto, tipo_movimiento, valor_movimiento, saldo_anterior_mf, saldo_nuevo_mf, usuario, fecha, hora, empresa_id)
                   VALUES (:id_manifiesto, 'SOBREANTICIPO_REG', :valor, :saldo_ant, :saldo_nuevo, :usuario, :fecha, :hora, :empresa_id)";

			$stmtMov = $this->_db3->prepare($sqlMov);
			$stmtMov->bindParam(':id_manifiesto', $manifiesto_id, PDO::PARAM_INT);
			$stmtMov->bindParam(':valor', $sobreAnticipo, PDO::PARAM_STR);
			$stmtMov->bindParam(':saldo_ant', $saldoAnteriorMf);
			$stmtMov->bindParam(':saldo_nuevo', $saldoNuevoMf);
			$stmtMov->bindParam(':usuario', $usuario_anticipo);
			$stmtMov->bindParam(':fecha', $fecha_anticipo);
			$stmtMov->bindParam(':hora', $hora_anticipo);
			$stmtMov->bindParam(':empresa_id', $empresa_id, PDO::PARAM_INT);
			$stmtMov->execute();

			// 7. Commit
			$this->_db3->commit();

			return ['status' => 'success', 'message' => 'Sobre Anticipo registrado con éxito. Nuevo total de anticipos: $' . number_format($saldoNuevoMf, 2)];
		} catch (Exception $e) {
			if ($this->_db3->inTransaction()) {
				$this->_db3->rollBack();
			}
			throw $e;
		}
	}

	/**
	 * Obtiene el ID del registro de la cabecera de pago (cmx_pagos_manifiestos)
	 * que está actualmente vigente para un manifiesto.
	 *
	 * @param int $manifiestoId ID del manifiesto.
	 * @return int|null El ID de la cabecera de pago, o null si no se encuentra.
	 */
	public function getIdPagoCabecera(int $manifiestoId): ?int
	{
		// Asumo que el estado 1 es el registro ACTIVO/VIGENTE
		$sql = "SELECT id FROM cmx_pagos_manifiestos WHERE manifiesto_id = :manifiesto_id AND estado = 'Pendiente'";

		$stmt = $this->_db3->prepare($sql);
		$stmt->bindParam(':manifiesto_id', $manifiestoId, PDO::PARAM_INT);
		$stmt->execute();
		$result = $stmt->fetch(PDO::FETCH_ASSOC);

		// Devolvemos solo el ID (entero)
		return $result['id'] ?? null;
	}

	/**
	 * Obtiene el último saldo registrado para un manifiesto en el histórico de movimientos.
	 * Si no hay histórico, se asume 0 o se obtiene el saldo inicial del manifiesto.
	 *
	 * @param int $manifiestoId ID del manifiesto.
	 * @return float El saldo restante (nuevo) del manifiesto antes de la transacción actual.
	 */
	protected function getSaldoManifiesto(int $manifiestoId): float
	{
		// Buscamos el último saldo_nuevo_mf registrado para ese manifiesto
		$sql = "SELECT saldo_nuevo_mf 
            FROM cmx_cartera_movimiento_anticipo 
            WHERE id_manifiesto = :manifiesto_id
            ORDER BY fecha DESC, id DESC
            LIMIT 1";

		$stmt = $this->_db3->prepare($sql);
		$stmt->bindParam(':manifiesto_id', $manifiestoId, PDO::PARAM_INT);
		$stmt->execute();
		$result = $stmt->fetch(PDO::FETCH_ASSOC);

		// Si no se encuentra un registro anterior, asumimos que el saldo anterior era 0.
		return (float)($result['saldo_nuevo_mf'] ?? 0.0);
	}

	const UPLOAD_DIR_LIQUIDACION = 'public/files/liquidaciones/proveedor/';
	protected function subirLiquidacion(array $fileData, string $idProveedor): string
	{
		// NOTA: La validación de que el archivo es OBLIGATORIO debe hacerse en el controlador.

		// 1. 🚨 SEGURIDAD: Validar errores de subida
		if (!isset($fileData['tmp_name']) || $fileData['error'] !== UPLOAD_ERR_OK) {
			// Este error puede indicar que el archivo es demasiado grande o falló la subida.
			throw new Exception("Error al subir el anticipo. Código de error: {$fileData['error']}", 400);
		}

		// 2. Validaciones de Contenido y Tamaño (Seguridad Extra)
		$max_size = 5 * 1024 * 1024; // 5 MB
		$allowed_types = ['application/pdf', 'image/jpeg', 'image/png'];
		$file_type = mime_content_type($fileData['tmp_name']);

		if ($fileData['size'] > $max_size) {
			throw new Exception("El archivo excede el tamaño máximo permitido (5MB).", 400);
		}
		if (!in_array($file_type, $allowed_types)) {
			throw new Exception("Tipo de archivo no permitido ($file_type). Solo PDF, JPG y PNG.", 400);
		}

		// 3. Definir y crear la carpeta de destino
		$targetDirAbs = self::UPLOAD_DIR_LIQUIDACION . $idProveedor . '/'; // Ruta ABSOLUTA para PHP

		if (!is_dir($targetDirAbs)) {
			// Usar 0755 es más común y seguro en entornos de producción que 0777.
			if (!mkdir($targetDirAbs, 0755, true)) {
				throw new Exception("Fallo la creación del directorio para el proveedor: {$idProveedor}", 500);
			}
		}

		// 4. Generar nombre de archivo único
		$ext = pathinfo($fileData['name'], PATHINFO_EXTENSION);
		$fileName = "anticipo_{$idProveedor}_" . time() . '.' . $ext;
		$targetFileAbs = $targetDirAbs . $fileName; // Ruta ABSOLUTA final

		// 5. Mover el archivo subido de forma segura
		if (!move_uploaded_file($fileData['tmp_name'], $targetFileAbs)) {
			throw new Exception("Fallo la operación al mover el archivo subido.", 500);
		}

		// 6. Devolver la ruta RELATIVA a la raíz de la aplicación (para guardar en la DB)
		// Ruta que coincide con la especificación: public/files/anticipos/proveedores/{id}/archivo.ext
		return 'public/files/liquidaciones/proveedor/' . $idProveedor . '/' . $fileName;
	}

	/**
	 * Registra la LIQUIDACIÓN en las tablas históricas (Cabecera, Detalle y Movimiento).
	 *
	 * @param int $manifiesto_id ID del manifiesto.
	 * @param float $liquidacion Valor de la liquidación.
	 * @param string $fecha_liquidacion Fecha del pago.
	 * @param array $documento_liquidacion Archivo de soporte.
	 * @param string $id_proveedor Documento del Tenedor.
	 * @param string $slct_metodo_pago Método de pago (CUENTA_P, TARJETA, NUEVA_CUENTA).
	 * @param int|null $id_cuenta_destino ID de la cuenta/tarjeta existente (si aplica).
	 * @param string $tipo_item 'LIQUIDACION'.
	 * @param string $observacion Observación (opcional).
	 * @param array|null $nuevaCuentaDatos Datos para inscribir una nueva cuenta (si aplica).
	 * @return array Resultado de la operación.
	 */
	public function UpdateLiquidacion(
		int $manifiesto_id,
		float $liquidacion,
		string $fecha_liquidacion,
		?array $documento_liquidacion,
		string $id_proveedor,
		string $slct_metodo_pago,
		$id_cuenta_destino, // Puede ser string 'null' o int
		string $tipo_item,
		string $observacion,
		?array $nuevaCuentaDatos
	) {
		// 1. Variables internas y de sesión
		$hora_pago = date("H:i:s");
		$estado_liquidacion_str = 'Pagado';
		$estado_manifiesto_str = 'Pagado'; // Estado final del manifiesto
		$usuario = $_SESSION["usuario"]["nom_usuario"] ?? 'SYSTEM';
		$empresa_id = $_SESSION["usuario"]["empresa_id"] ?? 1;

		try {
			$this->_db3->beginTransaction();

			// 2. Subir Archivo
			// Asumo que tienes una función 'subirLiquidacion' o reutilizas 'subirAnticipo'
			$rutaDocumento = $this->subirAnticipo($documento_liquidacion, (string)$id_proveedor);

			// 3. (Opcional) Manejo de NUEVA CUENTA
			// 🛑 3. DETERMINAR EL ID DE LA CUENTA DE DESTINO (Lógica combinada)
			$idCuentaDestinoFinal = null;

			if ($slct_metodo_pago === 'TARJETA') {
				// Opción 1: Es una tarjeta existente
				$idCuentaDestinoFinal = (int)$id_cuenta_destino; // (Valor de slct_tarjeta_disponible)

			} elseif (in_array($slct_metodo_pago, ['CUENTA_P', 'TERCERO'])) {
				// Opción 2: Es una cuenta existente (Principal o Beneficiario)
				$idCuentaDestinoFinal = (int)$id_cuenta_destino; // (Valor de slct_cuenta_bancaria)

			}
			//elseif ($slct_metodo_pago === 'NUEVA_CUENTA' && !empty($nuevaCuentaDatos)) {
			// 	// Opción 3: Es una NUEVA CUENTA. Debemos insertarla AHORA.

			// 	// Llamamos a la función auxiliar para insertar en cmx_proveedor_financieros
			// 	$idCuentaDestinoFinal = $this->inscribirNuevaCuenta(
			// 		$id_proveedor,
			// 		$nuevaCuentaDatos,
			// 		$usuario,
			// 		$empresa_id
			// 	);

			// 	if (empty($idCuentaDestinoFinal)) {
			// 		throw new Exception("Fallo al inscribir la nueva cuenta bancaria.");
			// 	}
			// }

			// Convertir $id_cuenta_destino a entero, asegurando que 0 sea NULL
			$idCuentaDestinoFinal = !empty($id_cuenta_destino) ? (int)$id_cuenta_destino : NULL;

			// 4. 🚨 OBTENER SALDO ANTERIOR (cmx_cartera_movimiento_anticipo)
			$saldoAnteriorMf = $this->getSaldoManifiesto($manifiesto_id);

			// 🛑 VALIDACIÓN DE SALDO: El pago no debe exceder el saldo pendiente
			if ($liquidacion > $saldoAnteriorMf) {
				throw new Exception("El valor de la liquidación ($liquidacion) supera el saldo pendiente ($saldoAnteriorMf).");
			}
			$saldoNuevoMf = $saldoAnteriorMf + $liquidacion;

			// 5. 🚨 ACTUALIZAR CABECERA DE PAGO (cmx_pagos_manifiestos)
			// Actualiza el estado de liquidación y el estado general del manifiesto
			$queryCabecera = "UPDATE cmx_pagos_manifiestos
                         SET
						 	total_pagado = total_pagado + :liquidacion,
                            estado = :estado_pago, 
                            estado_liquidacion = :estado_liquidacion, 
                            usuario = :usuario_liquidacion,
                            fecha = :fecha_liquidacion,
                            hora = :hora_liquidacion
                         WHERE manifiesto_id = :manifiesto_id";

			$stmtCabecera = $this->_db3->prepare($queryCabecera);
			$stmtCabecera->bindParam(':liquidacion', $liquidacion, PDO::PARAM_STR);
			$stmtCabecera->bindParam(':estado_pago', $estado_manifiesto_str);
			$stmtCabecera->bindParam(':estado_liquidacion', $estado_liquidacion_str);
			$stmtCabecera->bindParam(':usuario_liquidacion', $usuario);
			$stmtCabecera->bindParam(':fecha_liquidacion', $fecha_liquidacion);
			$stmtCabecera->bindParam(':hora_liquidacion', $hora_pago); // 🛑 CORREGIDO: Pasa el valor TIME
			$stmtCabecera->bindParam(':manifiesto_id', $manifiesto_id, PDO::PARAM_INT);
			$stmtCabecera->execute();

			// 6. OBTENER ID DE CABECERA (cmx_pagos_manifiestos.id)
			$idPagoCabecera = $this->getIdPagoCabeceraLiquidacion($manifiesto_id, $estado_manifiesto_str); // Buscamos el ID del registro que acabamos de actualizar

			if (empty($idPagoCabecera)) {
				throw new Exception("No se pudo obtener el ID de la cabecera de pago (cmx_pagos_manifiestos).");
			}

			// 7. 🚨 INSERTAR DETALLE DE LIQUIDACIÓN (cmx_pagos_anticipo_detalle)
			$sqlDetalle = "INSERT INTO cmx_pagos_anticipo_detalle (id_cabecera, tipo_item, valor, metodo_pago, id_cuenta_destino, documento_soporte, observacion, usuario, fecha, hora)
                       VALUES (:id_cabecera, :tipo_item, :valor,:metodo_pago, :id_cuenta_destino, :documento_soporte, 'Liquidación', :usuario, :fecha, :hora)"; // Columnas ajustadas

			$stmtDetalle = $this->_db3->prepare($sqlDetalle);
			// 🛑 CORRECCIÓN 1: Pasa el ID de cabecera obtenido
			$stmtDetalle->bindParam(':id_cabecera', $idPagoCabecera, PDO::PARAM_INT);
			$stmtDetalle->bindParam(':tipo_item', $tipo_item);
			$stmtDetalle->bindParam(':valor', $liquidacion, PDO::PARAM_STR);
			$stmtDetalle->bindParam(':metodo_pago', $slct_metodo_pago);
			$stmtDetalle->bindParam(':id_cuenta_destino', $idCuentaDestinoFinal, PDO::PARAM_INT);
			$stmtDetalle->bindParam(':documento_soporte', $rutaDocumento);
			$stmtDetalle->bindParam(':usuario', $usuario);
			$stmtDetalle->bindParam(':fecha', $fecha_liquidacion);
			$stmtDetalle->bindParam(':hora', $hora_pago);
			$stmtDetalle->execute();

			// 8. 🚨 REGISTRAR MOVIMIENTO DE SALDO (cmx_cartera_movimiento_anticipo)
			$sqlMov = "INSERT INTO cmx_cartera_movimiento_anticipo (id_manifiesto, tipo_movimiento, valor_movimiento, saldo_anterior_mf, saldo_nuevo_mf, usuario, fecha, hora, empresa_id)
                   VALUES (:id_manifiesto, 'LIQUIDACION_REG', :valor, :saldo_ant, :saldo_nuevo, :usuario, :fecha, :hora, :empresa_id)";

			$stmtMov = $this->_db3->prepare($sqlMov);
			$stmtMov->bindParam(':id_manifiesto', $manifiesto_id, PDO::PARAM_INT);
			$stmtMov->bindParam(':valor', $liquidacion, PDO::PARAM_STR);
			$stmtMov->bindParam(':saldo_ant', $saldoAnteriorMf);
			$stmtMov->bindParam(':saldo_nuevo', $saldoNuevoMf);
			$stmtMov->bindParam(':usuario', $usuario);
			$stmtMov->bindParam(':fecha', $fecha_liquidacion);
			$stmtMov->bindParam(':hora', $hora_pago);
			$stmtMov->bindParam(':empresa_id', $empresa_id, PDO::PARAM_INT);
			$stmtMov->execute();

			// 9. Commit
			$this->_db3->commit();

			return ['status' => 'success', 'message' => 'Liquidación registrada y manifiesto completado con éxito.'];
		} catch (Exception $e) {
			if ($this->_db3->inTransaction()) {
				$this->_db3->rollBack();
			}
			// 🛑 Borrar el archivo si se subió correctamente pero la BD falló
			if ($rutaDocumento && file_exists($rutaDocumento)) {
				// Cuidado: $rutaDocumento debe ser la ruta ABSOLUTA para unlink.
				// $this->subirAnticipo debería devolver la ruta absoluta si falla.
			}
			throw $e;
		}
	}


	/**
	 * Obtiene el ID del registro de la cabecera de pago (cmx_pagos_manifiestos)
	 * que está actualmente vigente para un manifiesto.
	 * (Función auxiliar)
	 */
	public function getIdPagoCabeceraLiquidacion(int $manifiestoId, string $estado = 'Pendiente'): ?int
	{
		// Buscamos el ID de la cabecera por manifiesto y estado
		$sql = "SELECT id FROM cmx_pagos_manifiestos WHERE manifiesto_id = :manifiesto_id AND estado = :estado";

		$stmt = $this->_db3->prepare($sql);
		$stmt->bindParam(':manifiesto_id', $manifiestoId, PDO::PARAM_INT);
		$stmt->bindParam(':estado', $estado);
		$stmt->execute();
		$result = $stmt->fetch(PDO::FETCH_ASSOC);

		return $result['id'] ?? null;
	}

	/**
	 * Obtiene todos los detalles de un manifiesto por su ID.
	 * @param int $id ID del manifiesto.
	 * @return array|false Los datos completos del manifiesto.
	 */
	public function getDetalleManifiesto(int $id)
	{
		// 1. Obtener la Cabecera de Pago (Datos Generales)
		$sqlCabecera = "SELECT
            pm.id,
            pm.manifiesto_id,
            pm.total_pagado AS Total_Pagado_General, -- El total de anticipos/sobreanticipos pagados
            pm.estado_ancipo,
            pm.estado_liquidacion,
            pm.estado, -- Estado general del manifiesto
            m.valor_total_viaje AS valor_total_manifiesto -- El valor total del viaje
        FROM
            cmx_pagos_manifiestos pm
        INNER JOIN cmx_manifiesto m ON pm.manifiesto_id = m.id
        WHERE
            pm.manifiesto_id = :id
        LIMIT 1"; // Solo debe haber una cabecera de pago por manifiesto

		$stmt = $this->_db3->prepare($sqlCabecera);
		$stmt->bindParam(':id', $id, PDO::PARAM_INT);
		$stmt->execute();
		$cabecera = $stmt->fetch(PDO::FETCH_ASSOC);

		if (!$cabecera) {
			return ['cabecera' => null, 'detalles' => []]; // No hay pagos registrados
		}

		// 2. Obtener los Detalles de Pago (Anticipos y Sobreanticipos)
		$sqlDetalle = "SELECT 
            pad.id,
            pad.tipo_item,
            pad.valor,
            pad.observacion,
            pad.usuario,
            pad.fecha,
            pad.hora,
            pad.documento_soporte -- Documento del anticipo inicial
            -- pm.documento_soporte_sobre -- Documento del sobreanticipo (si lo tienes)
        FROM 
            cmx_pagos_anticipo_detalle pad
        INNER JOIN cmx_pagos_manifiestos pm ON pad.id_cabecera = pm.id
        WHERE
            pm.manifiesto_id = :id
        ORDER BY
            pad.id ASC";

		$stmtDetalle = $this->_db3->prepare($sqlDetalle);
		$stmtDetalle->bindParam(':id', $id, PDO::PARAM_INT);
		$stmtDetalle->execute();
		$detalles = $stmtDetalle->fetchAll(PDO::FETCH_ASSOC);

		return [
			'cabecera' => $cabecera,
			'detalles' => $detalles
		];
	}

	public function getRemesasPorClientes()
	{
		// 🚨 La consulta no tiene parámetros WHERE, por lo que no necesita sentencias preparadas.
		$sql = "SELECT
					cl.id AS ID_Cliente,
					cl.nombre AS Nombre_Cliente,
					cl.documento AS Documento_Cliente,
					COUNT(r.id) AS Total_Remesas, -- 🛑 Cuenta el número de remesas por cliente
					-- Puedes incluir más columnas de la tabla cmx_clientes aquí
					cl.direccion,
					cl.telefono,
					CONCAT(m.municipio,'-',m.depto) AS Ciudad,
					    CASE cl.estado
							WHEN 1 THEN 'Activo'
							ELSE 'Inactivo'
						END AS Estado_Cliente
					-- ce.id AS ID_Cotizacion
				FROM
					cmx_remesa r
					INNER JOIN cmx_solicitud_vehiculo2 ss ON r.mer_idservicio = ss.nundoc_solicitud
					INNER JOIN cmx_cotizaciones_serviciocliente ce ON ss.n_cotizacion = ce.n_cotizacion
					INNER JOIN cmx_clientes cl ON ce.id_cliente = cl.id
					INNER JOIN cmx_municipios m ON cl.ciudad = m.id
					INNER JOIN cmx_manifiesto_remesa mr ON r.id = mr.id_remesa
					-- 🛑 NUEVO: LEFT JOIN para excluir remesas ya pagadas
        			LEFT JOIN cmx_pagos_remesas_historico prh ON r.id = prh.id_remesa
				WHERE 
					r.fecha_creacion >='2025-07-01'
					AND prh.id IS NULL -- 🛑 EXCLUIR las que tienen un registro de pago
				GROUP BY
					cl.id, cl.nombre -- cl.num_documento, ce.servicio_cliente, ce.id -- 🛑 Agrupar por las columnas no agregadas
				ORDER BY
					Total_Remesas DESC";

		try {
			$stmt = $this->_db3->prepare($sql);
			$stmt->execute();

			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			throw new Exception("Error BD al consultar el conteo de manifiestos: " . $e->getMessage());
		}
	}

	/**
	 * Obtiene el detalle de todas las remesas (y manifiestos/pagos asociados)
	 * para un cliente específico por su número de documento.
	 *
	 * @param string $nitTitular Documento (NIT/CC) del cliente.
	 * @return array Retorna un array con el detalle de remesas o un array vacío.
	 */
	public function obtenerDetalleRemesas(string $nitTitular): array
	{
		// 🛑 Consulta SQL para obtener todas las remesas y sus detalles por Documento del Cliente
		$sql = "SELECT
            r.id AS ID_Remesa,
            r.fecha_creacion AS Fecha_Remesa,
            -- Datos del Manifiesto
            m.id AS id,
            m.placa,
            m.fecha_expedicion,
            CONCAT(ori.municipio,'-',ori.depto) AS Origen,
            CONCAT(des.municipio,'-',des.depto) AS Destino,
            m.conductor_manifiesto,
            m.valor_total_viaje AS valor_anticipo, -- Asumo que el valor_total_viaje se usa para anticipo
            m.saldo,
            m.Lugar AS Agencia,
            -- Datos de Pagos
            pmnf.estado_ancipo,
            pmnf.estado_liquidacion,
            pmnf.estado_pago,
            -- Documentos y Conductores/Tenedores
            veh.id_conductor AS Nudoc_Conductor,
            veh.id_tenedor AS Nudoc_Tenedor,
			dm.total_tarifa
        FROM
            cmx_clientes cl
            INNER JOIN cmx_cotizaciones_serviciocliente ce ON cl.id = ce.id_cliente
            INNER JOIN cmx_solicitud_vehiculo2 ss ON ce.n_cotizacion = ss.n_cotizacion
			INNER JOIN cmx_detalle_mercancia2 dm ON ce.n_cotizacion=dm.n_cotizacion
            INNER JOIN cmx_remesa r ON ss.nundoc_solicitud = r.mer_idservicio
            INNER JOIN cmx_manifiesto_remesa mr ON r.id = mr.id_remesa
            INNER JOIN cmx_manifiesto m ON mr.id_manifiesto = m.id
			INNER JOIN cmx_municipios ori ON m.origen_viaje=ori.id
            INNER JOIN cmx_municipios des ON m.destino_viaje=des.id
            LEFT JOIN cmx_pagos_manifiestos pmnf ON m.id = pmnf.manifiesto_id
            LEFT JOIN cmx_vehiculos veh ON m.placa = veh.placa -- Para obtener IDs de conductor/tenedor

			-- 🛑 NUEVO: LEFT JOIN para excluir remesas ya pagadas
        	LEFT JOIN cmx_pagos_remesas_historico prh ON r.id = prh.id_remesa
        WHERE 
			r.fecha_creacion >= '2025-07-01'
    		AND cl.id = :Id
			AND prh.id IS NULL -- 🛑 EXCLUIR las que tienen un registro de pago
        ORDER BY
            m.fecha_expedicion DESC";

		try {
			$stmt = $this->_db3->prepare($sql);
			$stmt->bindParam(':Id', $nitTitular, PDO::PARAM_STR);
			$stmt->execute();
			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			error_log("Error en obtenerDetalleRemesas (Modelo): " . $e->getMessage());
			return [];
		}
	}

	/**
	 * Crea un nuevo registro de tarjeta bancaria.
	 */
	public function crearTarjeta(array $datos): array
	{
		$sql = "INSERT INTO cmx_tarjetas_bancarias (numero_tarjeta, banco_id, tipo_cuenta, usuario, fecha, hora, estado, empresa_id)
            VALUES (:numero_tarjeta, :banco_id, :tipo_cuenta, :usuario, CURDATE(),CURTIME(), 'Disponible', :empresa_id )";

		try {
			$usuario = $_SESSION["usuario"]["nom_usuario"] ?? 'SYSTEM';
			$empresa_id = $_SESSION["usuario"]["empresa_id"] ?? 'SYSTEM';

			$stmt = $this->_db3->prepare($sql);
			$stmt->bindParam(':numero_tarjeta', $datos['numero_tarjeta']);
			$stmt->bindParam(':banco_id', $datos['id_banco'], PDO::PARAM_INT);
			$stmt->bindParam(':tipo_cuenta', $datos['tipo_cuenta'], PDO::PARAM_INT);
			$stmt->bindParam(':usuario', $usuario);
			$stmt->bindParam(':empresa_id', $empresa_id);
			$stmt->execute();

			return ['status' => true, 'mensaje' => 'Tarjeta registrada con éxito.'];
		} catch (PDOException $e) {
			// Manejar duplicados (ej: llave única en numero_tarjeta)
			if ($e->getCode() == 23000) {
				return ['status' => false, 'mensaje' => 'Error: El número de tarjeta ya existe.'];
			}
			error_log("Error al crear tarjeta: " . $e->getMessage());
			return ['status' => false, 'mensaje' => 'Error de BD al registrar tarjeta.'];
		}
	}

	/**
	 * Lista todas las tarjetas bancarias registradas con información del banco.
	 *
	 * @return array Lista de todas las tarjetas.
	 */
	public function listarTodasTarjetas(): array
	{
		$sql = "SELECT 
                t.id,
                t.numero_tarjeta,
                t.estado,
                t.fecha,
                t.usuario,
                b.nombre AS nombre_banco,
                CASE t.tipo_cuenta 
                    WHEN 1 THEN 'Ahorros' 
                    WHEN 2 THEN 'Corriente' 
                    ELSE 'Desconocida' 
                END AS tipo_cuenta_nombre
            FROM cmx_tarjetas_bancarias t
            INNER JOIN cmx_para_bancos b ON t.banco_id = b.id
            ORDER BY t.fecha DESC";

		try {
			$stmt = $this->_db3->prepare($sql);
			$stmt->execute();
			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			error_log("Error al listar todas las tarjetas: " . $e->getMessage());
			return [];
		}
	}

	/**
	 * Cambia el estado de una tarjeta específica.
	 *
	 * @param int $tarjetaId ID de la tarjeta.
	 * @param string $nuevoEstado El valor del nuevo estado (ej: 'Inactivo', 'Congelada', 'Reportada').
	 * @return array Resultado de la operación.
	 */
	public function cambiarEstadoTarjeta(int $tarjetaId, string $nuevoEstado): array
	{
		// El campo 'estado' es ENUM('Disponible', 'Asignada', 'Inactivo', 'Reportado', 'Congelada')
		// Asumo que tu ENUM de la BD usa los valores que se muestran en tu imagen.

		$sql = "UPDATE cmx_tarjetas_bancarias 
            SET estado = :nuevo_estado 
            WHERE id = :tarjeta_id";

		try {
			$stmt = $this->_db3->prepare($sql);
			$stmt->bindParam(':nuevo_estado', $nuevoEstado, PDO::PARAM_STR);
			$stmt->bindParam(':tarjeta_id', $tarjetaId, PDO::PARAM_INT);
			$stmt->execute();

			if ($stmt->rowCount() > 0) {
				return ['status' => true, 'mensaje' => "Estado de la tarjeta actualizado a '{$nuevoEstado}'.", 'nuevo_estado' => $nuevoEstado];
			} else {
				return ['status' => false, 'mensaje' => "No se encontró la tarjeta o el estado ya es '{$nuevoEstado}'."];
			}
		} catch (PDOException $e) {
			error_log("Error al cambiar estado de tarjeta: " . $e->getMessage());
			return ['status' => false, 'mensaje' => 'Error de BD al actualizar estado.'];
		}
	}

	/**
	 * Lista todos los proveedores que tienen la actividad 'Conductor' y están activos (estado=1).
	 *
	 * @return array Lista de conductores con ID (numdoc_nexos) y nombre.
	 */
	public function listarConductoresActivos(): array
	{
		// Unimos cmx_proveedores (p) con cmx_actividad_proveedor (ap) para filtrar por 'Conductor'
		$sql = "SELECT 
                p.numdoc_nexos AS id_conductor,
                CONCAT(p.nombre, ' ', p.apellido1, ' ', p.apellido2) AS nombre_completo
            FROM cmx_proveedores p
            INNER JOIN cmx_actividad_proveedor ap ON p.numdoc_nexos = ap.id_proveedor
            WHERE ap.actividad = 'Conductor' AND p.estado = 'Activo'";

		try {
			$stmt = $this->_db3->prepare($sql);
			$stmt->execute();
			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			error_log("Error al listar conductores: " . $e->getMessage());
			return [];
		}
	}

	/**
	 * Lista todas las tarjetas bancarias que están disponibles (estado=1).
	 *
	 * @return array Lista de tarjetas disponibles con ID, número y banco.
	 */
	public function listarTarjetasDisponibles(): array
	{
		// Asumo que el estado 1 en cmx_tarjetas_bancarias significa 'Disponible'
		$sql = "SELECT 
                t.id AS id_tarjeta,
                t.numero_tarjeta,
                t.banco_id,
                b.nombre AS nombre_banco
            FROM cmx_tarjetas_bancarias t
            INNER JOIN cmx_para_bancos b ON t.banco_id = b.id
            WHERE t.estado = 1
            ORDER BY b.nombre, t.numero_tarjeta";

		try {
			$stmt = $this->_db3->prepare($sql);
			$stmt->execute();
			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			error_log("Error al listar tarjetas: " . $e->getMessage());
			return [];
		}
	}

	/**
	 * Obtiene el historial de tarjetas asignadas a un conductor.
	 */
	public function obtenerHistorial(int $conductorId): array
	{
		$sql = "SELECT 
                t.numero_tarjeta,
                t.banco_id,
                a.fecha_asignacion,
                a.fecha_retiro,
                a.estado_asignacion,
                a.id,
				b.nombre AS banco
            FROM cmx_asignacion_tarjeta a
            INNER JOIN cmx_tarjetas_bancarias t ON a.id_tarjeta = t.id
			INNER JOIN cmx_para_bancos b ON t.banco_id = b.id
            WHERE a.id_conductor = :id_conductor
            ORDER BY a.fecha_asignacion DESC";

		try {
			$stmt = $this->_db3->prepare($sql);
			$stmt->bindParam(':id_conductor', $conductorId, PDO::PARAM_INT);
			$stmt->execute();

			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			error_log("Error al obtener historial: " . $e->getMessage());
			return [];
		}
	}

	/**
	 * Registra una nueva asignación de tarjeta y actualiza el estado de la tarjeta anterior (si existe).
	 */
	public function asignarTarjeta(int $conductorId, int $tarjetaId): array
	{
		try {
			$this->_db3->beginTransaction();
			$usuario = $_SESSION["usuario"]["nom_usuario"] ?? 'SYSTEM';

			// 1. Finalizar la tarjeta vigente anterior (si existe)
			$sqlRetirar = "UPDATE cmx_asignacion_tarjeta 
                       SET estado_asignacion = 0, fecha_retiro = NOW(), usuario_gestion = :usuario
                       WHERE id_conductor = :id_conductor AND estado_asignacion = 1";
			$stmtRetirar = $this->_db3->prepare($sqlRetirar);
			$stmtRetirar->bindParam(':id_conductor', $conductorId, PDO::PARAM_INT);
			$stmtRetirar->bindParam(':usuario', $usuario);
			$stmtRetirar->execute();

			// 2. Insertar la nueva asignación (estado_asignacion = 1 (Vigente))
			$sqlInsert = "INSERT INTO cmx_asignacion_tarjeta (id_tarjeta, id_conductor, fecha_asignacion, estado_asignacion, usuario_gestion)
                      VALUES (:id_tarjeta, :id_conductor, NOW(), 1, :usuario)";
			$stmtInsert = $this->_db3->prepare($sqlInsert);
			$stmtInsert->bindParam(':id_tarjeta', $tarjetaId, PDO::PARAM_INT);
			$stmtInsert->bindParam(':id_conductor', $conductorId, PDO::PARAM_INT);
			$stmtInsert->bindParam(':usuario', $usuario);
			$stmtInsert->execute();

			// 3. Actualizar el estado de la tarjeta en el maestro a 'Asignada' (estado=2)
			$sqlUpdateTarjeta = "UPDATE cmx_tarjetas_bancarias SET estado = 2 WHERE id = :id_tarjeta";
			$stmtUpdateTarjeta = $this->_db3->prepare($sqlUpdateTarjeta);
			$stmtUpdateTarjeta->bindParam(':id_tarjeta', $tarjetaId, PDO::PARAM_INT);
			$stmtUpdateTarjeta->execute();

			$this->_db3->commit();
			return ['status' => true, 'mensaje' => 'Tarjeta asignada y vigencia anterior actualizada.'];
		} catch (PDOException $e) {
			$this->_db3->rollBack();
			error_log("Error al asignar tarjeta: " . $e->getMessage());
			return ['status' => false, 'mensaje' => 'Error de BD al asignar tarjeta.'];
		}
	}

	/**
	 * Finaliza la vigencia de una tarjeta asignada (la retira del conductor) 
	 * y actualiza el estado de la tarjeta maestra.
	 *
	 * @param int $asignacionId ID del registro en cmx_asignacion_tarjeta.
	 * @return array Estado y mensaje del resultado.
	 */
	public function retirarTarjeta(int $asignacionId): array
	{
		try {
			$this->_db3->beginTransaction();
			$usuario = $_SESSION["usuario"]["nom_usuario"] ?? 'SYSTEM';

			// 1. Obtener el ID de la tarjeta antes de actualizar (necesario para el paso 3)
			$sqlGetTarjetaId = "SELECT id_tarjeta FROM cmx_asignacion_tarjeta WHERE id = :asignacion_id AND estado_asignacion = 'Vigente'";
			$stmtGetId = $this->_db3->prepare($sqlGetTarjetaId);
			$stmtGetId->bindParam(':asignacion_id', $asignacionId, PDO::PARAM_INT);
			$stmtGetId->execute();
			$tarjetaData = $stmtGetId->fetch(PDO::FETCH_ASSOC);

			if (!$tarjetaData) {
				$this->_db3->rollBack();
				return ['status' => false, 'mensaje' => 'La asignación no está vigente o no existe.'];
			}

			$tarjetaId = $tarjetaData['id_tarjeta'];

			// 2. Finalizar el registro de asignación (Historial)
			$sqlRetirar = "UPDATE cmx_asignacion_tarjeta 
                       SET estado_asignacion = 'Finalizado', fecha_retiro = NOW(), usuario_gestion = :usuario
                       WHERE id = :asignacion_id";
			$stmtRetirar = $this->_db3->prepare($sqlRetirar);
			$stmtRetirar->bindParam(':asignacion_id', $asignacionId, PDO::PARAM_INT);
			$stmtRetirar->bindParam(':usuario', $usuario);
			$stmtRetirar->execute();

			// 3. Actualizar el estado de la tarjeta maestra a 'Disponible' (estado=1)
			$sqlUpdateTarjeta = "UPDATE cmx_tarjetas_bancarias SET estado = 1 WHERE id = :id_tarjeta";
			$stmtUpdateTarjeta = $this->_db3->prepare($sqlUpdateTarjeta);
			$stmtUpdateTarjeta->bindParam(':id_tarjeta', $tarjetaId, PDO::PARAM_INT);
			$stmtUpdateTarjeta->execute();

			$this->_db3->commit();
			return ['status' => true, 'mensaje' => 'Tarjeta retirada y marcada como disponible con éxito.'];
		} catch (PDOException $e) {
			$this->_db3->rollBack();
			error_log("Error al retirar tarjeta: " . $e->getMessage());
			return ['status' => false, 'mensaje' => 'Error de BD al retirar la tarjeta.'];
		}
	}

	/**
	 * Actualiza el documento de Seguridad Social (EPS) creando un nuevo registro histórico
	 * y marcando el anterior como inactivo.
	 *
	 * @param int $idProveedor ID del proveedor.
	 * @param array $fileData Datos del archivo de Seguridad Social ($_FILES).
	 * @return array Estado y mensaje del resultado.
	 */
	public function actualizarSeguridadSocial(int $idProveedor, ?array $fileData): array
	{
		if (empty($idProveedor)) {
			return ['status' => false, 'message' => 'ID de proveedor no especificado.'];
		}
		if (!$fileData || empty($fileData['tmp_name'])) {
			return ['status' => false, 'message' => 'Debe adjuntar el nuevo archivo de Seguridad Social.'];
		}

		$usuario = $_SESSION["usuario"]["nom_usuario"] ?? 'SYSTEM_USER';
		$fecha = date('Y-m-d'); // Columna 'fecha'
		$hora = date('H:i:s'); // Columna 'hora'
		$rutaSeguridad = null;
		$estadoInactivo = 0;
		$estadoActivo = 1;

		try {
			$this->_db3->beginTransaction();

			// 1. Subir el nuevo archivo (Asumo que esta función es un método de esta clase)
			$rutaSeguridad = $this->subirArchivo($fileData, (string)$idProveedor, 'seguridad_social');

			// 2. Inactivar el registro VIGENTE actual
			// 🛑 CORRECCIÓN: Usamos las columnas existentes: usuario, fecha, hora
			$sqlInactivar = "UPDATE cmx_proveedor_financieros
                         SET estado = :estado_inactivo,
                             usuario = :usuario,
                             fecha = :fecha,
                             hora = :hora
                         WHERE id_proveedor = :id_proveedor AND estado = :estado_activo";

			$stmtInactivar = $this->_db3->prepare($sqlInactivar);
			$stmtInactivar->bindParam(':estado_inactivo', $estadoInactivo, PDO::PARAM_INT);
			$stmtInactivar->bindParam(':estado_activo', $estadoActivo, PDO::PARAM_INT);
			$stmtInactivar->bindParam(':id_proveedor', $idProveedor, PDO::PARAM_INT);
			$stmtInactivar->bindParam(':usuario', $usuario);
			$stmtInactivar->bindParam(':fecha', $fecha);
			$stmtInactivar->bindParam(':hora', $hora);
			$stmtInactivar->execute();

			// 3. Consultar los datos del registro INACTIVO (para duplicar)
			// Obtenemos los datos base que NO vamos a cambiar (banco, actividad, rut, etc.)
			$sqlDatosBase = "SELECT id_proveedor, actividad_economica, obliga_tributaria, banco, tipo_cuenta, numero_cuenta, certificado_adjunto, documento_rut 
                         FROM cmx_proveedor_financieros 
                         WHERE id_proveedor = :id_proveedor AND estado = :estado_inactivo 
                         ORDER BY id DESC LIMIT 1";

			$stmtBase = $this->_db3->prepare($sqlDatosBase);
			$stmtBase->bindParam(':id_proveedor', $idProveedor, PDO::PARAM_INT);
			$stmtBase->bindParam(':estado_inactivo', $estadoInactivo, PDO::PARAM_INT);
			$stmtBase->execute();
			$baseData = $stmtBase->fetch(PDO::FETCH_ASSOC);

			if (!$baseData) {
				// Fallback si no había registro vigente (esto no debería pasar si hay datos)
				$baseData = ['actividad_economica' => 0, 'obliga_tributaria' => 0, 'banco' => 0, 'tipo_cuenta' => 0, 'numero_cuenta' => '', 'certificado_adjunto' => null, 'documento_rut' => null, 'id_proveedor' => $idProveedor];
			}

			// 4. Insertar el nuevo registro (DUPLICADO con el nuevo documento EPS)
			// 🛑 CORRECCIÓN: Usamos las columnas existentes: usuario, fecha, hora, documento_eps
			$sqlDuplicar = "INSERT INTO cmx_proveedor_financieros (
                            id_proveedor, actividad_economica, obliga_tributaria, banco, tipo_cuenta, numero_cuenta, 
                            certificado_adjunto, documento_rut, documento_eps, estado, usuario, fecha, hora
                        ) VALUES (
                            :id_proveedor, :actividad_economica, :obliga_tributaria, :banco, :tipo_cuenta, :numero_cuenta, 
                            :certificado_adjunto, :documento_rut, :documento_eps, :estado_activo, :usuario, :fecha, :hora
                        )";

			$stmtDuplicar = $this->_db3->prepare($sqlDuplicar);

			// Bindings para el nuevo registro activo
			$stmtDuplicar->bindParam(':id_proveedor', $idProveedor, PDO::PARAM_INT);
			$stmtDuplicar->bindParam(':actividad_economica', $baseData['actividad_economica'], PDO::PARAM_INT);
			$stmtDuplicar->bindParam(':obliga_tributaria', $baseData['obliga_tributaria'], PDO::PARAM_INT);
			$stmtDuplicar->bindParam(':banco', $baseData['banco'], PDO::PARAM_INT);
			$stmtDuplicar->bindParam(':tipo_cuenta', $baseData['tipo_cuenta'], PDO::PARAM_INT);
			$stmtDuplicar->bindParam(':numero_cuenta', $baseData['numero_cuenta']);
			$stmtDuplicar->bindParam(':certificado_adjunto', $baseData['certificado_adjunto']);
			$stmtDuplicar->bindParam(':documento_rut', $baseData['documento_rut']);
			$stmtDuplicar->bindParam(':documento_eps', $rutaSeguridad); // NUEVA RUTA
			$stmtDuplicar->bindParam(':estado_activo', $estadoActivo, PDO::PARAM_INT);
			$stmtDuplicar->bindParam(':usuario', $usuario);
			$stmtDuplicar->bindParam(':fecha', $fecha);
			$stmtDuplicar->bindParam(':hora', $hora);

			$stmtDuplicar->execute();

			$this->_db3->commit();
			return ['status' => true, 'message' => 'Seguridad Social actualizada y registro histórico guardado.'];
		} catch (Exception $e) {
			if ($this->_db3->inTransaction()) {
				$this->_db3->rollBack();
			}
			error_log("Error histórico de EPS: " . $e->getMessage());
			return ['status' => false, 'message' => 'Error de servidor al guardar el historial de EPS.'];
		}
	}

	public function actualizarCertificadoCuenta(int $idProveedor, ?array $fileData): array
	{
		if (empty($idProveedor)) {
			return ['status' => false, 'message' => 'ID de proveedor no especificado.'];
		}
		if (!$fileData || empty($fileData['tmp_name'])) {
			return ['status' => false, 'message' => 'Debe adjuntar el nuevo archivo de Seguridad Social.'];
		}

		$usuario = $_SESSION["usuario"]["nom_usuario"] ?? 'SYSTEM_USER';
		$fecha = date('Y-m-d'); // Columna 'fecha'
		$hora = date('H:i:s'); // Columna 'hora'
		$rutaSeguridad = null;
		$estadoInactivo = 0;
		$estadoActivo = 1;

		try {
			$this->_db3->beginTransaction();

			// 1. Subir el nuevo archivo (Asumo que esta función es un método de esta clase)
			$rutaSeguridad = $this->subirArchivo($fileData, (string)$idProveedor, 'certificado');

			// 2. Inactivar el registro VIGENTE actual
			// 🛑 CORRECCIÓN: Usamos las columnas existentes: usuario, fecha, hora
			$sqlInactivar = "UPDATE cmx_proveedor_financieros
                         SET estado = :estado_inactivo,
                             usuario = :usuario,
                             fecha = :fecha,
                             hora = :hora
                         WHERE id_proveedor = :id_proveedor AND estado = :estado_activo";

			$stmtInactivar = $this->_db3->prepare($sqlInactivar);
			$stmtInactivar->bindParam(':estado_inactivo', $estadoInactivo, PDO::PARAM_INT);
			$stmtInactivar->bindParam(':estado_activo', $estadoActivo, PDO::PARAM_INT);
			$stmtInactivar->bindParam(':id_proveedor', $idProveedor, PDO::PARAM_INT);
			$stmtInactivar->bindParam(':usuario', $usuario);
			$stmtInactivar->bindParam(':fecha', $fecha);
			$stmtInactivar->bindParam(':hora', $hora);
			$stmtInactivar->execute();

			// 3. Consultar los datos del registro INACTIVO (para duplicar)
			// Obtenemos los datos base que NO vamos a cambiar (banco, actividad, rut, etc.)
			$sqlDatosBase = "SELECT id_proveedor, actividad_economica, obliga_tributaria, banco, tipo_cuenta, numero_cuenta, certificado_adjunto, documento_rut, documento_eps
                         FROM cmx_proveedor_financieros 
                         WHERE id_proveedor = :id_proveedor AND estado = :estado_inactivo 
                         ORDER BY id DESC LIMIT 1";

			$stmtBase = $this->_db3->prepare($sqlDatosBase);
			$stmtBase->bindParam(':id_proveedor', $idProveedor, PDO::PARAM_INT);
			$stmtBase->bindParam(':estado_inactivo', $estadoInactivo, PDO::PARAM_INT);
			$stmtBase->execute();
			$baseData = $stmtBase->fetch(PDO::FETCH_ASSOC);

			if (!$baseData) {
				// Fallback si no había registro vigente (esto no debería pasar si hay datos)
				$baseData = ['actividad_economica' => 0, 'obliga_tributaria' => 0, 'banco' => 0, 'tipo_cuenta' => 0, 'numero_cuenta' => '', 'certificado_adjunto' => null, 'documento_rut' => null, 'id_proveedor' => $idProveedor];
			}

			// 4. Insertar el nuevo registro (DUPLICADO con el nuevo documento EPS)
			// 🛑 CORRECCIÓN: Usamos las columnas existentes: usuario, fecha, hora, documento_eps
			$sqlDuplicar = "INSERT INTO cmx_proveedor_financieros (
                            id_proveedor, actividad_economica, obliga_tributaria, banco, tipo_cuenta, numero_cuenta, 
                            certificado_adjunto, documento_rut, documento_eps, estado, usuario, fecha, hora
                        ) VALUES (
                            :id_proveedor, :actividad_economica, :obliga_tributaria, :banco, :tipo_cuenta, :numero_cuenta, 
                            :certificado_adjunto, :documento_rut, :documento_eps, :estado_activo, :usuario, :fecha, :hora
                        )";

			$stmtDuplicar = $this->_db3->prepare($sqlDuplicar);

			// Bindings para el nuevo registro activo
			$stmtDuplicar->bindParam(':id_proveedor', $idProveedor, PDO::PARAM_INT);
			$stmtDuplicar->bindParam(':actividad_economica', $baseData['actividad_economica'], PDO::PARAM_INT);
			$stmtDuplicar->bindParam(':obliga_tributaria', $baseData['obliga_tributaria'], PDO::PARAM_INT);
			$stmtDuplicar->bindParam(':banco', $baseData['banco'], PDO::PARAM_INT);
			$stmtDuplicar->bindParam(':tipo_cuenta', $baseData['tipo_cuenta'], PDO::PARAM_INT);
			$stmtDuplicar->bindParam(':numero_cuenta', $baseData['numero_cuenta']);
			// $stmtDuplicar->bindParam(':certificado_adjunto', $baseData['certificado_adjunto']);
			$stmtDuplicar->bindParam(':certificado_adjunto', $rutaSeguridad);
			$stmtDuplicar->bindParam(':documento_rut', $baseData['documento_rut']);
			$stmtDuplicar->bindParam(':documento_eps', $baseData['documento_eps']); // NUEVA RUTA
			$stmtDuplicar->bindParam(':estado_activo', $estadoActivo, PDO::PARAM_INT);
			$stmtDuplicar->bindParam(':usuario', $usuario);
			$stmtDuplicar->bindParam(':fecha', $fecha);
			$stmtDuplicar->bindParam(':hora', $hora);

			$stmtDuplicar->execute();

			$this->_db3->commit();
			return ['status' => true, 'message' => 'Certificado Bancario actualizado y registro histórico guardado.'];
		} catch (Exception $e) {
			if ($this->_db3->inTransaction()) {
				$this->_db3->rollBack();
			}
			error_log("Error histórico de EPS: " . $e->getMessage());
			return ['status' => false, 'message' => 'Error de servidor al guardar el historial de EPS.'];
		}
	}

	/**
	 * Registra el pago masivo de remesas y actualiza el saldo de cartera del cliente.
	 * * @param int $idCliente ID del cliente que realiza el pago.
	 * @param array $remesasIds IDs de las remesas seleccionadas.
	 * @param array $remesasValores Array paralelo de los valores pagados por CADA remesa.
	 * @param float $totalPagado Suma total de los valores.
	 * @return array Resultado de la operación.
	 */
	public function procesarPagoMasivo(int $idCliente, array $remesasIds, array $manifiestosIds, array $remesasValores, float $totalPagado): array
	{
		if (count($remesasIds) !== count($remesasValores) || empty($remesasIds)) {
			return ['status' => false, 'message' => 'Error: Lista de remesas o valores vacía/desincronizada.'];
		}

		$usuario = $_SESSION["usuario"]["nom_usuario"] ?? 'SYSTEM';
		$empresa_id = $_SESSION["usuario"]["empresa_id"] ?? 1;
		$fechaPago = date('Y-m-d H:i:s');

		try {
			$this->_db3->beginTransaction();

			// 1. OBTENER SALDO ANTERIOR DEL CLIENTE
			$sqlCartera = "SELECT saldo_cartera FROM cmx_clientes WHERE id = :id_cliente FOR UPDATE";
			$stmtCartera = $this->_db3->prepare($sqlCartera);
			$stmtCartera->bindParam(':id_cliente', $idCliente, PDO::PARAM_INT);
			$stmtCartera->execute();
			$cliente = $stmtCartera->fetch(PDO::FETCH_ASSOC);
			$saldoAnterior = (float)($cliente['saldo_cartera'] ?? 0);
			$nuevoSaldo = $saldoAnterior - $totalPagado; // 🛑 RESTA: Nuevo Saldo = Saldo Anterior - Total Pagado
			$estado_pago = 'Pagada';
			// 2. INSERTAR REGISTRO DE CABECERA DE PAGO
			$sqlCabecera = "INSERT INTO cmx_pagos_cabecera (id_cliente, valor_total_pagado, fecha_pago, usuario_pago, estado_pago, empresa_id)
                        VALUES (:id_cliente, :total, :fecha, :usuario, :estado_pago, :empresa_id)";
			$stmtCabecera = $this->_db3->prepare($sqlCabecera);
			$stmtCabecera->bindParam(':id_cliente', $idCliente, PDO::PARAM_INT);
			$stmtCabecera->bindParam(':total', $totalPagado);
			$stmtCabecera->bindParam(':fecha', $fechaPago);
			$stmtCabecera->bindParam(':usuario', $usuario);
			$stmtCabecera->bindParam(':estado_pago', $estado_pago);
			$stmtCabecera->bindParam(':empresa_id', $empresa_id);

			$stmtCabecera->execute();
			$idPagoCabecera = $this->_db3->lastInsertId();

			// 3. INSERTAR DETALLES DE REMESAS Y MARCAR EN HISTÓRICO
			$sqlDetalle = "INSERT INTO cmx_pagos_remesas_historico (id_pago_cabecera, id_remesa, id_manifiesto, valor_remesa)
                       VALUES (:id_pago, :id_remesa, :id_manifiesto, :valor_remesa)";
			$stmtDetalle = $this->_db3->prepare($sqlDetalle);

			for ($i = 0; $i < count($remesasIds); $i++) {
				$idRemesa = $remesasIds[$i];
				$idManifiesto = $manifiestosIds[$i];
				$valorRemesa = $remesasValores[$i]; // Valor individual de la remesa

				$stmtDetalle->bindParam(':id_pago', $idPagoCabecera, PDO::PARAM_INT);
				$stmtDetalle->bindParam(':id_remesa', $idRemesa, PDO::PARAM_INT);
				$stmtDetalle->bindParam(':id_manifiesto', $idManifiesto, PDO::PARAM_INT);
				$stmtDetalle->bindParam(':valor_remesa', $valorRemesa);
				$stmtDetalle->execute();
			}

			// 4. GUARDAR HISTÓRICO DEL MOVIMIENTO DE CARTERA
			$sqlMov = "INSERT INTO cmx_cartera_movimiento (id_cliente, tipo_movimiento, valor_movimiento, saldo_anterior, saldo_nuevo, fecha_movimiento, usuario_gestion, empresa_id)
                   VALUES (:id_cliente, 'PAGO', :valor, :saldo_ant, :saldo_nuevo, :fecha, :usuario, :empresa_id)";
			$stmtMov = $this->_db3->prepare($sqlMov);
			$stmtMov->bindParam(':id_cliente', $idCliente, PDO::PARAM_INT);
			$stmtMov->bindParam(':valor', $totalPagado); // Valor total del pago como movimiento
			$stmtMov->bindParam(':saldo_ant', $saldoAnterior);
			$stmtMov->bindParam(':saldo_nuevo', $nuevoSaldo);
			$stmtMov->bindParam(':fecha', $fechaPago);
			$stmtMov->bindParam(':usuario', $usuario);
			$stmtMov->bindParam(':empresa_id', $empresa_id);
			$stmtMov->execute();

			// 5. ACTUALIZAR SALDO FINAL EN cmx_clientes
			$sqlUpdateCliente = "UPDATE cmx_clientes SET saldo_cartera = :nuevo_saldo WHERE id = :id_cliente";
			$stmtUpdateCliente = $this->_db3->prepare($sqlUpdateCliente);
			$stmtUpdateCliente->bindParam(':nuevo_saldo', $nuevoSaldo);
			$stmtUpdateCliente->bindParam(':id_cliente', $idCliente, PDO::PARAM_INT);
			$stmtUpdateCliente->execute();

			$this->_db3->commit();
			return ['status' => true, 'message' => "Se procesó el pago masivo. Saldo Cartera anterior: $" . number_format($saldoAnterior, 2) . ", Nuevo Saldo: $" . number_format($nuevoSaldo, 2)];
		} catch (PDOException $e) {
			$this->_db3->rollBack();
			error_log("Error masivo de pago de remesas (Cartera): " . $e->getMessage());
			return ['status' => false, 'message' => 'Error de base de datos al procesar el pago masivo.'];
		}
	}

	/**
	 * Obtiene el historial de movimientos de cartera para un cliente específico.
	 * Se corrige la duplicación de registros de 'PAGO' usando GROUP BY.
	 * * @param int $idCliente ID interno del proveedor.
	 * @return array Historial de movimientos.
	 */
	public function obtenerHistoricoMovimientos(int $idCliente): array
	{
		// 1. Consulta Principal de Movimientos (Usa GROUP BY para forzar unicidad en el LEFT JOIN)
		$sqlMovimientos = "SELECT 
			cm.id, cm.tipo_movimiento, cm.valor_movimiento, cm.saldo_anterior,
			cm.saldo_nuevo, cm.fecha_movimiento, cm.usuario_gestion,
			pc.valor_total_pagado AS valor_cabecera_pago,
			pc.id AS id_cabecera_pago,
			c.nombre AS Nombre_Cliente,
			c.documento AS Documento_Cliente
		FROM cmx_cartera_movimiento cm
		INNER JOIN cmx_clientes c ON cm.id_cliente = c.id
		-- 🛑 LEFT JOIN para correlacionar los pagos (puede haber varios pc.id para el mismo cm.valor_movimiento)
		INNER JOIN cmx_pagos_cabecera pc ON cm.id_cliente = pc.id_cliente AND cm.valor_movimiento = pc.valor_total_pagado AND cm.tipo_movimiento = 'PAGO'
		WHERE 
			cm.id_cliente = :id_cliente
		GROUP BY cm.id, pc.id -- 🛑 CLAVE: Agrupar por el ID del movimiento (cm.id) y el ID de pago (pc.id)
		ORDER BY 
			cm.fecha_movimiento DESC";

		try {
			$stmt = $this->_db3->prepare($sqlMovimientos);
			$stmt->bindParam(':id_cliente', $idCliente, PDO::PARAM_INT);
			$stmt->execute();
			$movimientos = $stmt->fetchAll(PDO::FETCH_ASSOC);

			// 2. Anidar Detalle de Remesas para cada 'PAGO' (La lógica se mantiene)
			foreach ($movimientos as $key => $mov) {
				$movimientos[$key]['detalle_remesas'] = []; // Inicializar

				if ($mov['tipo_movimiento'] === 'PAGO' && $mov['id_cabecera_pago']) {
					$sqlRemesas = "SELECT 
                                    r.id_remesa, r.id_manifiesto, r.valor_remesa
                                FROM cmx_pagos_remesas_historico r
                                WHERE r.id_pago_cabecera = :id_pago_cabecera";

					$stmtRemesas = $this->_db3->prepare($sqlRemesas);
					$stmtRemesas->bindParam(':id_pago_cabecera', $mov['id_cabecera_pago'], PDO::PARAM_INT);
					$stmtRemesas->execute();

					// Añadir el detalle de remesas al registro de movimiento
					$movimientos[$key]['detalle_remesas'] = $stmtRemesas->fetchAll(PDO::FETCH_ASSOC);
				}
			}

			return $movimientos;
		} catch (PDOException $e) {
			throw new Exception("Error BD validando métodos de pago del proveedor: " . $e->getMessage());
		}
	}

	/**
	 * Lista las tarjetas activas y vigentes que están ASIGNADAS al conductor/proveedor.
	 *
	 * @param int $idProveedor ID del conductor/proveedor (cmx_proveedores.numdoc_nexos).
	 * @return array Lista de tarjetas vigentes asignadas.
	 */
	public function listarTarjetasAsignadasVigentes(int $idProveedor): array
	{
		$sql = "SELECT 
                t.id AS id_tarjeta,
                t.numero_tarjeta,
                b.nombre AS nombre_banco,
                t.tipo_cuenta -- Añadir tipo de cuenta por si es útil
            FROM cmx_asignacion_tarjeta at
            INNER JOIN cmx_tarjetas_bancarias t ON at.id_tarjeta = t.id
            INNER JOIN cmx_para_bancos b ON t.banco_id = b.id
            WHERE 
                at.id_conductor = :id_proveedor
                AND at.estado_asignacion = 1 -- Vigente
                AND t.estado = 'Asignada'   -- El estado en la tabla maestra debe ser 'Asignada'
            ORDER BY 
                t.numero_tarjeta";

		try {
			$stmt = $this->_db3->prepare($sql);
			$stmt->bindParam(':id_proveedor', $idProveedor, PDO::PARAM_INT);
			$stmt->execute();
			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			error_log("Error al listar tarjetas asignadas vigentes: " . $e->getMessage());
			return [];
		}
	}

	/**
	 * Lista todas las cuentas bancarias activas (estado=1) registradas para el proveedor,
	 * y lista los bancos disponibles para la opción de "Nueva Cuenta".
	 *
	 * @param int $idProveedor ID del proveedor/conductor.
	 * @return array Contiene 'cuentas' vigentes y 'bancos_disponibles'.
	 */
	public function listarCuentasYBancos(int $idProveedor): array
	{
		// 1. Consulta de Cuentas Vigentes (cmx_proveedor_financieros)
		$sqlCuentas = "SELECT 
                        pf.id, 
                        pf.numero_cuenta, 
                        pf.tipo_cuenta, 
                        pf.banco AS id_banco,
                        pf.certificado_adjunto,
                        pf.documento_rut,
                        b.abreviatura AS nombre_banco
                    FROM cmx_proveedor_financieros pf
                    INNER JOIN cmx_para_bancos b ON pf.banco = b.id
                    WHERE pf.id_proveedor = :id_proveedor 
                    AND pf.estado = 1"; // Solo registros ACTIVO/VIGENTE

		// 2. Consulta de Bancos Disponibles (para el select de nueva cuenta)
		// Asumo que tienes una tabla de bancos (cmx_para_bancos) para el select
		$sqlBancos = "SELECT id, abreviatura AS nombre_banco FROM cmx_para_bancos WHERE estado = 1 ORDER BY nombre_banco";

		try {
			// Ejecutar consulta de cuentas
			$stmtCuentas = $this->_db3->prepare($sqlCuentas);
			$stmtCuentas->bindParam(':id_proveedor', $idProveedor, PDO::PARAM_INT);
			$stmtCuentas->execute();
			$cuentas = $stmtCuentas->fetchAll(PDO::FETCH_ASSOC);

			// Ejecutar consulta de bancos
			$stmtBancos = $this->_db3->prepare($sqlBancos);
			$stmtBancos->execute();
			$bancos = $stmtBancos->fetchAll(PDO::FETCH_ASSOC);

			return [
				'cuentas' => $cuentas,
				'bancos_disponibles' => $bancos
			];
		} catch (PDOException $e) {
			error_log("Error al listar cuentas y bancos: " . $e->getMessage());
			return ['cuentas' => [], 'bancos_disponibles' => []];
		}
	}

	/**
	 * Obtiene los manifiestos en seguimiento y lista los documentos financieros pendientes
	 * para el Tenedor y el Conductor.
	 *
	 * @return array Lista de manifiestos con el estado de los documentos.
	 */
	public function obtenerDocumentosPendientesSeguimiento(): array
	{
		// La consulta utiliza el JOIN DOS VECES (una para Tenedor, una para Conductor)
		$sql = "
            SELECT
                m.id AS Manifiesto_ID,
                m.placa,
                m.fecha_expedicion,
                m.estado_seguimiento,
                
                -- Datos del Tenedor
                ten.numero_documento AS Doc_Tenedor,
                CONCAT(ten.nombre, ' ', ten.apellido1) AS Nombre_Tenedor,
                pft.certificado_adjunto AS Ten_Certificado,
                pft.documento_rut AS Ten_RUT,
                pft.documento_eps AS Ten_EPS,
                
                -- Datos del Conductor
                cond.numero_documento AS Doc_Conductor,
                CONCAT(cond.nombre, ' ', cond.apellido1) AS Nombre_Conductor,
                pfc.certificado_adjunto AS Con_Certificado,
                pfc.documento_rut AS Con_RUT,
                pfc.documento_eps AS Con_EPS
            FROM
                cmx_manifiesto m
                INNER JOIN cmx_proveedores ten ON m.titular_manifiesto = ten.numero_documento
                INNER JOIN cmx_proveedores cond ON m.conductor_manifiesto = cond.numero_documento
                -- LEFT JOIN para Datos Financieros del Tenedor
                LEFT JOIN cmx_proveedor_financieros pft ON ten.numdoc_nexos = pft.id_proveedor AND pft.estado = 1
                -- LEFT JOIN para Datos Financieros del Conductor
                LEFT JOIN cmx_proveedor_financieros pfc ON cond.numdoc_nexos = pfc.id_proveedor AND pfc.estado = 1
            WHERE 
                m.estado_seguimiento = 'SEGUIMIENTO'
            ORDER BY 
                m.fecha_expedicion DESC";

		try {
			$stmt = $this->_db3->prepare($sql);
			$stmt->execute();
			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			error_log("Error BD en documentos pendientes: " . $e->getMessage());
			return [];
		}
	}

	public function GetFacturacionDs()
	{
		$sqlfacturacion = "SELECT
		  fa.id,
			fa.numero_factura,
			ifa.estado_instruccion,
			-- '-' AS estado_rndc,
			fa.estado_rndc,
			CASE
				WHEN UPPER(cl.tipo_documento) = 'NIT'
					THEN CONCAT(cl.documento, '-', cl.digito_verificacion)
				ELSE cl.documento    -- o ELSE NULL si quieres null cuando no sea NIT
			END AS numero_documento,
			cl.nombre,
				/* Nuevo CASE para agencia */
			CASE ss.agencia
				WHEN 1 THEN 'Bogotá'
				WHEN 2 THEN 'Cartagena'
				WHEN 4 THEN 'Buenaventura'
				ELSE NULL          -- o 'Desconocida' si prefieres texto por defecto
			END AS agencia_nombre,
			CONCAT(ifa.fecha,' ',ifa.hora) AS Fecha_Instruccion,
			fa.fecha_emision,
			fa.valor_total_factura,
			ifa.usuario
		FROM cmx_facturas fa
		INNER JOIN cmx_instruccion_facturacion ifa ON fa.numero_instruccion = ifa.id
		INNER JOIN cmx_clientes cl ON ifa.cliente_id = cl.id
		INNER JOIN cmx_factura_remesas fr ON fa.id = fr.factura_id
		INNER JOIN cmx_remesa rm ON  fr.numero_remesa = rm.id
		INNER JOIN cmx_solicitud_vehiculo2 ss ON rm.mer_idservicio = ss.nundoc_solicitud
		GROUP BY fa.numero_instruccion";
		try {
			$stmt = $this->_db3->prepare($sqlfacturacion);
			$stmt->execute();
			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			error_log("Error BD en documentos pendientes: " . $e->getMessage());
			return [];
		}
	}

	// public function DetalleFactura($factura_id) {}

	// ================================
	// Cabecera factura
	// ================================
	public function getCabeceraFactura($factura_id)
	{
		$sql = "
            SELECT
                fa.numero_factura,
                fa.fecha_emision,
                cl.nombre AS cliente,
                CASE 
                    WHEN UPPER(cl.tipo_documento) = 'NIT' THEN 
                        CONCAT(cl.documento, '-', cl.digito_verificacion)
                    ELSE cl.documento
                END AS numero_documento,
                CONCAT(mu.municipio, ' - ', mu.depto) AS ciudad,
                cl.telefono,
                fi.usuario
            FROM cmx_facturas fa
                INNER JOIN cmx_instruccion_facturacion fi ON fa.numero_instruccion = fi.id
                INNER JOIN cmx_clientes cl ON fi.cliente_id = cl.id
                INNER JOIN cmx_municipios mu ON cl.ciudad = mu.id
            WHERE fa.id = :id
        ";

		$stmt = $this->_db3->prepare($sql);
		$stmt->bindParam(':id', $factura_id, PDO::PARAM_INT);
		$stmt->execute();

		return $stmt->fetch(PDO::FETCH_ASSOC);
	}

	// ================================
	// Detalle factura
	// ================================
	public function getDetalleFactura($factura_id)
	{
		$sql = "
            SELECT
                fm.numero_remesa,
                CONCAT(rm.fecha_creacion, ' ', rm.hora_creacion) AS fecha,
                '-' AS descripcion,
                fm.valor_remesa AS valor_unitario,
                dm.peso_neto_tn AS cantidad,
                (fm.valor_remesa * dm.peso_neto_tn) AS valor
            FROM cmx_facturas fa
                INNER JOIN cmx_factura_remesas fm ON fa.id = fm.factura_id
                INNER JOIN cmx_remesa rm ON fm.numero_remesa = rm.id
                INNER JOIN cmx_solicitud_vehiculo2 ss ON rm.mer_idservicio = ss.nundoc_solicitud
                INNER JOIN cmx_cotizaciones_serviciocliente co ON co.n_cotizacion = ss.n_cotizacion
                INNER JOIN cmx_detalle_mercancia2 dm ON ss.idpareja_origen_destino = dm.id
            WHERE fa.id = :id
            GROUP BY fm.numero_remesa
        ";
		// $sql = "
    //         SELECT
    //             fm.numero_remesa,
    //             CONCAT(rm.fecha_creacion, ' ', rm.hora_creacion) AS fecha,
    //             '-' AS descripcion,
    //             fm.valor_remesa AS valor_unitario,
    //             dm.peso_neto_tn AS cantidad,
    //             (fm.valor_remesa * dm.peso_neto_tn) AS valor
    //         FROM cmx_facturas fa
    //             INNER JOIN cmx_factura_remesas fm ON fa.id = fm.factura_id
    //             INNER JOIN cmx_remesa rm ON fm.numero_remesa = rm.id
    //             INNER JOIN cmx_solicitud_vehiculo2 ss ON rm.mer_idservicio = ss.nundoc_solicitud
    //             INNER JOIN cmx_cotizaciones_serviciocliente co ON co.n_cotizacion = ss.n_cotizacion
    //             INNER JOIN cmx_detalle_mercancia2 dm ON ss.idpareja_origen_destino = dm.id
    //         WHERE fa.id = :id
    //         GROUP BY fm.numero_remesa
    //     ";

		$stmt = $this->_db3->prepare($sql);
		$stmt->bindParam(':id', $factura_id, PDO::PARAM_INT);
		$stmt->execute();

		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}
}
