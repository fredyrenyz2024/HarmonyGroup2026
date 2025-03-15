<?php
class servicioclienteController extends Controller
{
	private $_modelo;
	private $coti;
	private $consultar_cotizaciones;
	private $cabecera_no_editar;
	private $consultem_no;
	private $no_consulteE;
	private $ver;
	private $ver_mer;
	private $ver_espe;
	private $historico_cotizacion;
	private $tsolicitudservicio;
	private $tbl_solicitudes;
	private $consulta_serviciob;
	private $consulta_remitente;
	private $consultar_solicitud_servicio;
	private $consulta_servicio;
	private $consultar_grupo;
	private $traer_agencia;
	private $municipiostable;
	private $vehiculo_solservi;
	private $consulte_movimientos;
	private $historico_cotizaciones;
	private $solicitud_vehiculo;
	private $num_cotizacion;
	private $consulte_aprobacion;
	private $cantidad_solicitud;
	private $tipo_cont;
	private $cont_muncipio;
	private $traer_tipos;
	private $traer_tipo_mercancia;
	private $traer_municipios;
	private $traer_tipo_empaque;
	private $traer_flete;
	private $traer_naturaleza;
	private $guardar_puntos_entrega;
	private $guardar_contenedor;
	private $listar_agencias_tipo_servicios;
	private $update_solicitud;
	private $_filtros;
	private $_ver_solicitud;
	private $_traer_escenarios;
	private $_lita_clientes;
	private $_lita_empresas;
	private $_validar_tarifa_sicetac;
	private $_consulta_datos_subasta;
	private $_respuesta_flete;
	private $_requiere_cancelacion;

	public function __construct()
	{
		parent::__construct();
		//$this->_modelo = $this->loadModel('servicioclientei');
		$this->_modelo = $this->loadModel('servicioclientei');
	}

	public function index()
	{
		$prueba = $this->loadModel('serviciocliente'); //se añade el modelo a usar 
		$this->_view->prueba = $prueba; // Se einsatcia el modelos
		$subtitulo = '<br>
			<span class="detail-description">
				<h5>Servicio al Cliente -> Atención al cliente -> Cotizaciones</h5>
			</span>';
		$this->_view->titulo = 'Cotizaciones' . $subtitulo;
		$this->_view->renderizar('index', 'serviciocliente'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function todos()
	{
		$this->_view->titulo = 'Ejemplos';
		// $js = $_POST['param1'];
		// $this->_view->renderizar('lista_solicitudes', 'serviciocliente'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
		$this->_view->renderizar_ventana('lista_solicitudes', 'serviciocliente'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}
	public function nueva()
	{
		$prueba = $this->loadModel('serviciocliente'); //se añade el modelo a usar 
		$this->_view->prueba = $prueba; // Se einsatcia el modelos
		$this->_view->titulo = 'Nueva Solicitud';
		// $this->_view->renderizar('nueva_solicitud', 'serviciocliente'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
		$this->_view->renderizar_ventana('nueva_solicitud', 'serviciocliente'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function pendientes()
	{
		$this->_view->titulo = 'Solicitudes Pendientes';
		$this->_view->renderizar_ventana('pendientes', 'serviciocliente'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}
	public function prioritarias()
	{
		$this->_view->titulo = 'Solicitudes Pendientes';
		$this->_view->renderizar_ventana('prioritarias', 'serviciocliente'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}
	public function en_curso()
	{
		$this->_view->titulo = 'Solicitudes en Curso';
		$this->_view->renderizar_ventana('en_curso', 'serviciocliente'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function completadas()
	{
		$this->_view->titulo = 'Solicitudes Completadas';
		$this->_view->renderizar_ventana('completadas', 'serviciocliente'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}
	public function canvas()
	{
		$this->_view->titulo = 'Solicitudes Completadas';
		$this->_view->renderizar_ventana('canvas', 'serviciocliente'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	//Funcion para cargar los filtros
	public function crear_filtro()
	{
		$ventana = $_POST['param1'];
		$this->_filtros = $this->_view->Cargar_Filtros_ventana($ventana);
		// $this->_filtros = $this->_modelo->Cargar_Filtros_ventana($ventana);
		echo json_encode($this->_filtros);
	}

	//ver solicitudes de servicio
	public function ver_solicitud()
	{
		// $numdoc_solicitud = $_POST['numdoc_solicitud'];
		// $this->_ver_solicitud = $this->_modelo->Get_Solicitudes($numdoc_solicitud);
		// echo json_encode($this->_ver_solicitud);
		// $this->_view->renderizar_ventana('ver_solicitud', 'serviciocliente'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function sessio()
	{
		$this->_view->titulo = 'Nueva solicitud de servicio';
		$this->_view->renderizar('nueva_solicitud', 'serviciocliente'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	public function index_aprobaciones()
	{
		$aprobar = $this->loadModel('serviciocliente'); //se añade el modelo a usar 
		$this->_view->aprobar = $aprobar; // Se einsatcia el modelos
		$this->_view->titulo = 'Aprobaciones';
		$this->_view->renderizar('index_aprobaciones', 'serviciocliente'); //index=nombre del archivo.phtml, prueba= la carpeta adentro de la views
	}

	/* Caragar Contenedor */
	public function Consultar_Contenedor()
	{
		$this->tipo_cont = $this->_modelo->Get_Conedores();
		echo json_encode($this->tipo_cont);
	}
	public function Consultar_Municipios()
	{
		$this->cont_muncipio = $this->_modelo->Get_Municipios();
		echo json_encode($this->cont_muncipio);
	}

	public function Tipo_Vehiculos()
	{
		$this->traer_tipos = $this->_modelo->Get_Vehiculos();
		echo json_encode($this->traer_tipos);
	}

	public function Tipo_Mercancia()
	{
		$this->traer_tipo_mercancia = $this->_modelo->Get_Tipo_Mercancia();
		echo json_encode($this->traer_tipo_mercancia);
	}

	public function Consulta_Municipios()
	{
		$this->traer_municipios = $this->_modelo->Get_Municipio();
		echo json_encode($this->traer_municipios);
	}

	public function Tipo_Empaque()
	{
		$this->traer_tipo_empaque = $this->_modelo->Get_Tipo_Empaque();
		echo json_encode($this->traer_tipo_empaque);
	}

	public function Consultar_Flete()
	{
		$ori = $_POST["origen"];
		$des = $_POST["destino"];
		$vehiculo = $_POST["vehiculo"];

		$this->traer_flete = $this->_modelo->Get_Flete($ori, $des, $vehiculo);
		echo json_encode($this->traer_flete);
	}

	public function Consultar_naturaleza()
	{
		$id = $_POST["id_mercancia"];
		$this->traer_naturaleza = $this->_modelo->Get_Naturaleza($id);
		echo json_encode($this->traer_naturaleza);
	}


	/* Funcion para validar la  tarifa del sicetac */
	public function Validar_tarifa_sicetac()
	{
		$CostosEficientesSicetac = json_decode($_POST['CostosEficientesSicetac']);
		$this->_validar_tarifa_sicetac = $this->_modelo->Validar_trafifa_Sicetac($CostosEficientesSicetac);
		echo json_encode($this->_validar_tarifa_sicetac);
	}


	public function CrearCotizacion()
	{
		$response = [];
		$nit = $_POST["nit"];
		$digito = $_POST["digito"];
		$dire = $_POST["direccion_cotizacion"];
		$telefono = $_POST["telefono"];
		$procedencia = "Email";
		// $observacion = $_POST["observacion_general"];
		$observacion = "Obsrevacion";
		$usuario = $_POST["usuario_elaborado"];
		$check = $_POST["check"];
		$total_transporte = $_POST["total_transporte"];
		$Ttotal_cotizacion = $_POST["Ttotal_cotizacion"];
		$Tcosto_flete = $_POST["Tcosto_flete"];
		$Tutilidad = $_POST["Tutilidad"];
		$Trentabilidad = $_POST["Trentabilidad"];
		$Tcosto_especial = $_POST["Tcosto_especial"];
		$Ttarifa_especial = $_POST["Ttarifa_especial"];
		$Tutilidad_especial = $_POST["Tutilidad_especial"];
		$Trenta_especial = $_POST["Trenta_especial"];
		$name_cliente = $_POST["name_cliente"];
		$mercancias = json_decode($_POST["bloques_negocio"]);
		$especial = json_decode($_POST["bloque_datoespecial"]);
		$clienteid = $_POST["clienteid"];
		$empresa_id = $_POST["empresa_id"];
		$escenario_id = $_POST["escenario_id"];
		$this->_modelo = $this->loadModel('servicioclientei');
		$this->coti = $this->_modelo->Insertar_Cotizacion(
			// $num_cotizacion,
			$nit,
			$digito,
			$dire,
			$telefono,
			$procedencia,
			$observacion,
			$usuario,
			$check,
			$total_transporte,
			$Ttotal_cotizacion,
			$Tcosto_flete,
			$Tutilidad,
			$Trentabilidad,
			$Tcosto_especial,
			$Ttarifa_especial,
			$Tutilidad_especial,
			$Trenta_especial,
			$name_cliente,
			$mercancias,
			$especial,
			$clienteid,
			$empresa_id,
			$escenario_id
		);

		if ($this->coti['success'] === false) {
			$response = ['numero' => 400, 'mensaje' => $this->coti['message']];
			echo json_encode($response);
		} else {
			// $response = ['numero' => 200, 'mensaje' => $this->coti['message']];
			// $this->Solicitud_Vehiculo();
			$response = [];
			$fecha_reg = date('Y-m-d');
			$hora_reg = date('G:i:s');
			$user = $_SESSION["usuario"]["nom_usuario"];
			// $cotizacion = $_POST["numero"];
			$cotizacion = $this->coti["numero_cotizacion"];
			$estado = $_POST["estado"];
			$tipo_veh = $_POST["tipo_veh"];
			$ori = $_POST["ori"];
			$dest = $_POST["dest"];
			$peso = $_POST["peso"];
			$flete = $_POST["flete"];
			$nombre_cliente = $_POST["cliente"];
			// $pareja = $_POST["pareja"];
			$pareja = $this->coti["pareja"];
			$observacion = $_POST["observacion"];
			$agencia = $_POST["agencia"];
			$cant_solicitada = $_POST["cant_solicitada"];
			$cant_disponible = $_POST["cant_disponible"];
			$grupo = $_POST["grupo"];
			$horacliente = $_POST["horacliente"];
			$empresa_id = $_POST["empresa_id"];
			$escenario_id = $_POST["escenario_id"];

			if (isset($_POST["cont_opcion"]) || $_POST["cont_opcion"] == '' || $_POST["cont_opcion"] == 'undefined') {
				$cont_opcion = $_POST["cont_opcion"];
			} else {
				$cont_opcion = 0;
			}

			if (isset($_POST["cont_dias"]) && !empty($_POST["cont_dias"])) {
				$cont_dias = $_POST["cont_dias"];
			} else {
				$cont_dias = date('Y-m-d');
			}

			if (isset($_POST["cont_municipio"]) && !empty($_POST["cont_municipio"])) {
				$cont_municipio = $_POST["cont_municipio"];
			} else {

				$cont_municipio = 0;
			}

			if (isset($_POST["cont_direccion"]) && !empty($_POST["cont_direccion"])) {
				$cont_direccion = $_POST["cont_direccion"];
			} else {
				$cont_direccion = '';
			}

			if (isset($_POST["cont_tipo"]) && !empty($_POST["cont_tipo"])) {
				$cont_tipo = $_POST["cont_tipo"];
			} else {
				$cont_tipo = 0;
			}

			if (isset($_POST["cont_num"]) && !empty($_POST["cont_num"])) {
				$cont_num = $_POST["cont_num"];
			} else {
				$cont_num = '';
			}

			if (isset($_POST["cont_comodato"]) && !empty($_POST["cont_comodato"])) {
				$cont_comodato = $_POST["cont_comodato"];
			} else {
				$cont_comodato = date('Y-m-d');
			}

			if (isset($_POST["cont_peso"]) && !empty($_POST["cont_peso"])) {
				$cont_peso = $_POST["cont_peso"];
			} else {
				$cont_peso = 0;
			}

			/*********************************************Puntod de entrega(Remitentes)******************************************************/
			// $solicitud_servicio1 = $_POST["solicitud_servicio1"];
			// $id_punto = $_POST["idpuntrem"];
			// $mentrega = $_POST["mentrega"];
			// $dire = $_POST["dire"];
			// $cliente = $_POST["clientea"];
			// $fentrega = $_POST["fentrega"];
			// $obs = $_POST["obs"];
			// $hora_estimada = $_POST["hora"];
			// $tipo = $_POST["tipo"];
			// $orden = $_POST["orden"];
			// $pun = $_POST["pun"];
			$userio = $_SESSION["usuario"]["nom_usuario"];
			$hora = date('H:i:s');
			$fecha = date('Y-m-d');
			// $telefono = $_POST["telefono"];
			$peso = $_POST["peso"];
			// $peso = $_POST["peso_remitente"];
			// $sitio = $_POST["sitio"];
			$maximo = $_POST["maximo"];
			$insertremit = json_decode($_POST['datos_remitentes']);
			/*********************************************Puntod de entrega(Destinatario)******************************************************/
			$insertdesti = json_decode($_POST['datos_destinatario']);
			$nFilas = $_POST["nFilas"];
			// $user = $_SESSION["usuario"]["nom_usuario"];

			$data = [
				'fecha_reg' => $fecha_reg,
				'hora_reg' => $hora_reg,
				'user' => $userio,
				'cotizacion' => $cotizacion,
				'estado' => $estado,
				'tipo_veh' => $tipo_veh,
				'ori' => $ori,
				'dest' => $dest,
				'peso' => $peso,
				'flete' => $flete,
				'nombre_cliente' => $nombre_cliente,
				'pareja' => $pareja,
				'observacion' => $observacion,
				'agencia' => $agencia,
				'cant_solicitada' => $cant_solicitada,
				'cant_disponible' => $cant_disponible,
				'cont_opcion' => $cont_opcion,
				'cont_dias' => $cont_dias,
				'cont_municipio' => $cont_municipio,
				'cont_direccion' => $cont_direccion,
				'cont_tipo' => $cont_tipo,
				'cont_num' => $cont_num,
				'cont_comodato' => $cont_comodato,
				'cont_peso' => $cont_peso,
				'grupo' => $grupo,
				'horacliente' => $horacliente,
				/*********************************************Puntod de entrega(Remitentes)******************************************************/
				// 'solicitud_servicio1' => $solicitud_servicio1,
				// 'id_punto' => $id_punto,
				// 'mentrega' => $mentrega,
				// 'dire' => $dire,
				// 'cliente' => $cliente,
				// 'fentrega' => $fentrega,
				// 'obs' => $obs,
				// 'hora_estimada' => $hora_estimada,
				// 'tipo' => $tipo,
				// 'orden' => $orden,
				// 'pun' => $pun,
				// 'user' => $user,
				'hora' => $hora,
				'fecha' => $fecha,
				// 'telefono' => $telefono,
				// 'peso' => $peso,
				// 'sitio' => $sitio,
				'maximo' => $maximo,
				'insertremit' => $insertremit,
				'insertdesti' => $insertdesti,
				'nFilas' => $nFilas,
				'empresa_id' => $empresa_id,
				'escenario_id' => $escenario_id,
			];

			$this->solicitud_vehiculo = $this->_modelo->Guardar_Solicitud($data);

			if ($this->solicitud_vehiculo['success'] === false) {
				$response = ['numero' => 400, 'mensaje' => $this->solicitud_vehiculo['message']];
			} else {
				$response = ['numero' => 200, 'mensaje' => $this->solicitud_vehiculo['message'], 'numero_solicitud' => $this->solicitud_vehiculo['numero_solicitud']];
			}
			echo json_encode($response);
		}
	}

	public function consultar_cotizaciones()
	{
		$this->_modelo = $this->loadModel('servicioclientei');

		// Obtener y sanitizar valores
		$tipo = $_POST['tipo'] ?? '';
		$fecha_inicial = $_POST['fecha_inicial'] ?? '';
		$fecha_final = $_POST['fecha_final'] ?? '';
		$estado = $_POST['estado'] ?? '';

		// Si cliente/empresa están vacíos, se asignan como NULL o cadena vacía
		$cliente = !empty($_POST['cliente']) ? intval($_POST['cliente']) : null; // Si es numérico
		$empresa = !empty($_POST['empresa']) ? intval($_POST['empresa']) : null;

		// Pasar los parámetros al modelo
		$this->consultar_cotizaciones = $this->_modelo->getPrueba(
			$tipo,
			$fecha_inicial,
			$fecha_final,
			$estado,
			$cliente,
			$empresa
		);

		echo json_encode($this->consultar_cotizaciones);
	}

	public function Cabecera_Editar()
	{
		$num_cotizacion = $_POST['n_cotizar'];
		$this->cabecera_no_editar = $this->_modelo->Editar_Cabecera($num_cotizacion);
		echo json_encode($this->cabecera_no_editar);
	}

	public function Consultar_No()
	{
		$num_cotizacion = $_POST['cotizarm_no'];
		$this->consultem_no = $this->_modelo->Consultem_No($num_cotizacion);
		echo json_encode($this->consultem_no);
	}

	public function No_Consulta_E()
	{
		$num_cotizacion = $_POST['cotizare_no'];
		$this->no_consulteE = $this->_modelo->No_Consulta_E($num_cotizacion);
		echo json_encode($this->no_consulteE);
	}

	public function Ver_cotizacion()
	{
		$numero_cotizacion = $_REQUEST['ncotizar'];
		// $numdoc_solictud = $_REQUEST['numdoc_solictud'];
		$this->ver = $this->_modelo->Visualizar_cotizacion($numero_cotizacion);
		echo json_encode($this->ver);
	}
	// public function Ver_solicitud_Servicio()
	// {
	// 	$numdoc_solictud = $_REQUEST['numdoc_solictud'];
	// 	$this->ver = $this->_modelo->Visualizar_solictud($numdoc_solictud);
	// 	echo json_encode($this->ver);
	// }

	public function Ver_Merncancia()
	{
		$numero_cotizacion = $_POST['ncotizar1'];
		$this->ver_mer = $this->_modelo->Visualizar_Mercancias($numero_cotizacion);
		echo json_encode($this->ver_mer);
	}

	public function Ver_Servicios_Especiales()
	{
		$numero_cotizacion = $_POST['ncotizar2'];
		$this->ver_espe = $this->_modelo->Visualizar_Servicios_Especiales($numero_cotizacion);
		echo json_encode($this->ver_espe);
	}

	public function Historio_Cotizaciones()
	{
		$id = $_REQUEST["ncotizar"];
		$this->historico_cotizacion = $this->_modelo->Historico_Cotizaciones($id);
		echo json_encode($this->historico_cotizacion);
	}

	public function T_Solicitud_Servcio()
	{
		$ncotiza = $_POST["n_cotizar"];
		$this->tsolicitudservicio = $this->_modelo->T_Solicitudes_Servicio($ncotiza);
		echo json_encode($this->tsolicitudservicio);
	}

	public function Tabla_Solicitudes()
	{
		$id = $_POST['id'];
		$this->tbl_solicitudes = $this->_modelo->listado_Solicitudes_Servicio($id);
		echo json_encode($this->tbl_solicitudes);
	}

	public function Consultar_Solicitud_Servcio()
	{
		$numero_cotizacion = $_POST["cotizar"];
		$solicitud_servicio = $_POST["solicitud"];
		$this->consulta_serviciob = $this->_modelo->Consulta_Solictude_Servicio($numero_cotizacion, $solicitud_servicio);
		echo json_encode($this->consulta_serviciob);
	}

	public function Consultar_Remitente()
	{
		$numero_cotizacion = $_POST["cotizar"];
		$solicitud_servicio = $_POST["solicitud"];
		$this->consulta_remitente = $this->_modelo->Consulta_Remitentes($numero_cotizacion, $solicitud_servicio);
		echo json_encode($this->consulta_remitente);
	}

	public function Consulta_servicio()
	{
		$cotizar = $_POST["cotizar"];
		$item = $_POST["item"];
		$this->consulta_servicio = $this->_modelo->Consultar_Servicios($cotizar, $item);
		echo json_encode($this->consulta_servicio);
	}

	public function Consultar_grupo()
	{
		$fecha = date('Y-m-d');
		$cliente = $_POST["cliente"];
		$this->consultar_grupo = $this->_modelo->Consultar_Grupos($fecha, $cliente);
		echo json_encode($this->consultar_grupo);
	}

	public function Traer_Agencias()
	{
		$this->traer_agencia = $this->_modelo->Traer_Agencia();
		echo json_encode($this->traer_agencia);
	}
	public function Traer_Escenarios()
	{
		$this->_traer_escenarios = $this->_modelo->Traer_escenario();
		echo json_encode($this->_traer_escenarios);
	}

	public function Municipio_Table()
	{
		$origen = $_POST['origes'];
		$destino = $_POST['destinos'];
		$cotizacion = $_POST['cotizar'];
		$this->municipiostable = $this->_modelo->Municipios_Table($origen, $destino, $cotizacion);
		echo json_encode($this->municipiostable);
	}

	public function Vehiculo_Servicio()
	{
		$idv = $_POST["veh"];
		$this->vehiculo_solservi = $this->_modelo->Vehiculo_Servicios($idv);
		echo json_encode($this->vehiculo_solservi);
	}

	public function Consultar_Movimientos()
	{
		$id = $_POST["idcotizar"];
		$idpareja = $_POST["idpareja"];
		$idsolicitud = $_POST["idsolicitud"];
		$this->consulte_movimientos = $this->_modelo->Consulta_Movimiento($id, $idpareja, $idsolicitud);
		echo json_encode($this->consulte_movimientos);
	}

	public function Historico_Cotizaciones()
	{
		$id = $_REQUEST["ncotizar"];
		$this->historico_cotizaciones = $this->_modelo->Historial_Cotizaciones($id);
		echo json_encode($this->historico_cotizaciones);
	}

	public function Solicitud_Vehiculo()
	{
		$response = [];
		$fecha_reg = date('Y-m-d');
		$hora_reg = date('G:i:s');
		$user = $_SESSION["usuario"]["nom_usuario"];
		$cotizacion = $_POST["numero"];
		$estado = $_POST["estado"];
		$tipo_veh = $_POST["tipo_veh"];
		$ori = $_POST["ori"];
		$dest = $_POST["dest"];
		$peso = $_POST["peso"];
		$flete = $_POST["flete"];
		$nombre_cliente = $_POST["cliente"];
		$pareja = $_POST["pareja"];
		$observacion = $_POST["observacion"];
		$agencia = $_POST["agencia"];
		$cant_solicitada = $_POST["cant_solicitada"];
		$cant_disponible = $_POST["cant_disponible"];
		$grupo = $_POST["grupo"];
		$horacliente = $_POST["horacliente"];

		if (isset($_POST["cont_opcion"])) {
			$cont_opcion = $_POST["cont_opcion"];
		} else {
			$cont_opcion = '';
		}

		if (isset($_POST["cont_dias"]) && !empty($_POST["cont_dias"])) {
			$cont_dias = $_POST["cont_dias"];
		} else {
			$cont_dias = date('Y-m-d');
		}

		if (isset($_POST["cont_municipio"]) && !empty($_POST["cont_municipio"])) {
			$cont_municipio = $_POST["cont_municipio"];
		} else {

			$cont_municipio = 0;
		}

		if (isset($_POST["cont_direccion"]) && !empty($_POST["cont_direccion"])) {
			$cont_direccion = $_POST["cont_direccion"];
		} else {
			$cont_direccion = '';
		}

		if (isset($_POST["cont_tipo"]) && !empty($_POST["cont_tipo"])) {
			$cont_tipo = $_POST["cont_tipo"];
		} else {
			$cont_tipo = 0;
		}

		if (isset($_POST["cont_num"]) && !empty($_POST["cont_num"])) {
			$cont_num = $_POST["cont_num"];
		} else {
			$cont_num = '';
		}

		if (isset($_POST["cont_comodato"]) && !empty($_POST["cont_comodato"])) {
			$cont_comodato = $_POST["cont_comodato"];
		} else {
			$cont_comodato = date('Y-m-d');
		}

		if (isset($_POST["cont_peso"]) && !empty($_POST["cont_peso"])) {
			$cont_peso = $_POST["cont_peso"];
		} else {
			$cont_peso = 0;
		}

		/*********************************************Puntod de entrega(Remitentes)******************************************************/
		// $solicitud_servicio1 = $_POST["solicitud_servicio1"];
		$id_punto = $_POST["idpuntrem"];
		$mentrega = $_POST["mentrega"];
		$dire = $_POST["dire"];
		$cliente = $_POST["clientea"];
		$fentrega = $_POST["fentrega"];
		$obs = $_POST["obs"];
		$hora_estimada = $_POST["hora"];
		$tipo = $_POST["tipo"];
		$orden = $_POST["orden"];
		$pun = $_POST["pun"];
		$userio = $_SESSION["usuario"]["nom_usuario"];
		$hora = date('H:i:s');
		$fecha = date('Y-m-d');
		$telefono = $_POST["telefono"];
		$peso = $_POST["peso"];
		$sitio = $_POST["sitio"];
		$maximo = $_POST["maximo"];
		/*********************************************Puntod de entrega(Destinatario)******************************************************/
		$insertdesti = json_decode($_POST['datos_destinatario']);
		$nFilas = $_POST["nFilas"];
		// $user = $_SESSION["usuario"]["nom_usuario"];

		$data = [
			'fecha_reg' => $fecha_reg,
			'hora_reg' => $hora_reg,
			'user' => $userio,
			'cotizacion' => $cotizacion,
			'estado' => $estado,
			'tipo_veh' => $tipo_veh,
			'ori' => $ori,
			'dest' => $dest,
			'peso' => $peso,
			'flete' => $flete,
			'nombre_cliente' => $nombre_cliente,
			'pareja' => $pareja,
			'observacion' => $observacion,
			'agencia' => $agencia,
			'cant_solicitada' => $cant_solicitada,
			'cant_disponible' => $cant_disponible,
			'cont_opcion' => $cont_opcion,
			'cont_dias' => $cont_dias,
			'cont_municipio' => $cont_municipio,
			'cont_direccion' => $cont_direccion,
			'cont_tipo' => $cont_tipo,
			'cont_num' => $cont_num,
			'cont_comodato' => $cont_comodato,
			'cont_peso' => $cont_peso,
			'grupo' => $grupo,
			'horacliente' => $horacliente,
			/*********************************************Puntod de entrega(Remitentes)******************************************************/
			// 'solicitud_servicio1' => $solicitud_servicio1,
			'id_punto' => $id_punto,
			'mentrega' => $mentrega,
			'dire' => $dire,
			'cliente' => $cliente,
			'fentrega' => $fentrega,
			'obs' => $obs,
			'hora_estimada' => $hora_estimada,
			'tipo' => $tipo,
			'orden' => $orden,
			'pun' => $pun,
			// 'user' => $user,
			'hora' => $hora,
			'fecha' => $fecha,
			'telefono' => $telefono,
			// 'peso' => $peso,
			'sitio' => $sitio,
			'maximo' => $maximo,
			'insertdesti' => $insertdesti,
			'nFilas' => $nFilas,
		];

		$this->solicitud_vehiculo = $this->_modelo->Guardar_Solicitud($data);

		if ($this->solicitud_vehiculo['success'] === false) {
			$response = ['numero' => 400, 'mensaje' => $this->solicitud_vehiculo['message']];
		} else {
			$response = ['numero' => 200, 'mensaje' => $this->solicitud_vehiculo['message'], 'numero_solicitud' => $this->solicitud_vehiculo['numero_solicitud']];
		}
		echo json_encode($response);
	}

	/******************************************Funciones para las solicitudes de servicio**************************************/

	public function Consultar_Aprobacion()
	{
		$num_cotizacion = $_POST['doc'];
		$fecha_inicia = $_POST['fecha_inicia'];
		$fecha_final = $_POST['fecha_final'];
		$this->consulte_aprobacion = $this->_modelo->Consulta_Aprobacion($num_cotizacion, $fecha_inicia, $fecha_final);
		echo json_encode($this->consulte_aprobacion);
	}

	public function Cantidad_Solicitudes()
	{
		$fecha_inicial = $_POST["fecha_inicia"];
		$fecha_final = $_POST["fecha_final"];
		$this->cantidad_solicitud = $this->_modelo->Cantidad_Solicitudes_Servicio($fecha_inicial, $fecha_final);
		echo json_encode($this->cantidad_solicitud);
	}

	/*******************************************Guardar Contenedor***************************************************/

	public function GuardarContenedor()
	{
		$contenedor = $_POST["numero_contenedor"];
		$mer_idservicio = $_POST["mer_idservicio"];
		$agrupado = $_POST["agrupado"];
		$this->guardar_contenedor = $this->_modelo->Guardar_contenedor($contenedor, $mer_idservicio, $agrupado);
		echo json_encode($this->guardar_contenedor);
	}
	public function ActualizarReferencia()
	{
		$referencia_operacion = $_POST["referencia_operacion"];
		$mer_idservicio = $_POST["mer_idservicio"];
		$puntoId = $_POST["puntoId"];
		$this->guardar_contenedor = $this->_modelo->Actualizar_referencia($referencia_operacion, $mer_idservicio, $puntoId);
		echo json_encode($this->guardar_contenedor);
	}

	/* Listar las agencias y solicitudes de servicios */

	public function ListarAgenciasTipoServicios()
	{
		$this->listar_agencias_tipo_servicios = $this->_modelo->Listar_Agencias_Tipo_Servicios();
		echo json_encode($this->listar_agencias_tipo_servicios);
	}

	public function update_solicitud()
	{
		$response = [];
		$agencia = $_POST['agencia'];
		$tipo_servicio = $_POST['tipo_servicio'];
		$solicitud = $_POST['solicitud'];
		$numero_cotizacion = $_POST['numero_cotizacion'];
		if (empty($tipo_servicio)) {
			$this->update_solicitud = $this->_modelo->Update_Solicitud_agencia($agencia,  $solicitud);
			echo json_encode($this->update_solicitud);
		} else {
			$this->update_solicitud = $this->_modelo->Update_Solicitud_tipo_Servicio($tipo_servicio, $numero_cotizacion, $solicitud);
			echo json_encode($this->update_solicitud);
		}
	}

	public function Actualizar_Prioridad()
	{
		$estado = $_POST['estado'];
		$numdoc_solicitud = $_POST['numdoc_solicitud'];
		$nivel_prioridad = $_POST['nivel_prioridad'];
		$motivo_prioridad = $_POST['motivo_prioridad'];

		$this->update_solicitud = $this->_modelo->Update_Solicitud_Prioridad($estado,  $numdoc_solicitud, $nivel_prioridad, $motivo_prioridad);
		echo json_encode($this->update_solicitud);
	}
	public function Aprobar_Prioridad()
	{
		$solicitud = $_POST['solicitud'];
		$estado = $_POST['estado'];
		$this->update_solicitud = $this->_modelo->Update_Solicitud_Aprobada($estado, $solicitud);
		echo json_encode($this->update_solicitud);
	}

	public function Listar_Clientes()
	{
		$this->_lita_clientes = $this->_modelo->ListarClientes();
		echo json_encode($this->_lita_clientes);
	}
	public function Listar_Empresas()
	{
		$this->_lita_empresas = $this->_modelo->ListarEmpresas();
		echo json_encode($this->_lita_empresas);
	}

	public function solicitar_remitentes()
	{
		$soli_servi = $_POST['soli_servi'];
		$this->_lita_empresas = $this->_modelo->ListarRemitentes($soli_servi);
		echo json_encode($this->_lita_empresas);
	}
	public function solicitar_destinatarios()
	{
		$soli_servi = $_POST['soli_servi'];
		$this->_lita_empresas = $this->_modelo->ListarDestinatarios($soli_servi);
		echo json_encode($this->_lita_empresas);
	}

	public function actualizar_session()
	{
		// Si existe una sesión previa para 'ventana_id', la eliminamos
		if (isset($_SESSION['ventana_id'])) {
			unset($_SESSION['ventana_id']);
		}

		if (isset($_POST['ventana_id'])) {
			$_SESSION['ventana_id'] = $_POST['ventana_id'];
			echo json_encode(['status' => 'ok', 'ventana_id' => $_SESSION['ventana_id']]);
		} else {
			echo json_encode(['status' => 'error', 'message' => 'ID no recibido']);
		}
	}

	/* Consultar datos para aprobacionde las tarifas de subasta */
	public function consulta_datos_subasta()
	{
		$n_servicio = $_POST["n_servicio"];
		$this->_consulta_datos_subasta = $this->_modelo->Datos_Subasta_Tarifa($n_servicio);
		echo json_encode($this->_consulta_datos_subasta);
	}

	public function respuesta_flete()
	{
		if ($_POST["estado"] == 1) {
			$statu = 'Aceptado';
			$estado_letra = 'aprueba_flete_sac';
		} else {
			$statu = 'No aceptado';
			$estado_letra = 'no_aprueba_flete_sac';
		}
		$datos = [
			"flete_propu" => $_POST["flete_propu"],
			"tarifa_pro"  => $_POST["tarifa_pro"],
			"utilidad"    => $_POST["utilidad"],
			"rentabili"   => $_POST["rentabili"],
			"subasta"     => $_POST["subasta"],
			"estado"      => $_POST["estado"],
			"sidflete"    => $_POST["sidflete"],
			"user"        => $_SESSION["usuario"]["nom_usuario"],
			"servicio"    => $_POST["nservicio"],
			"hora"        => date('H:i:s'),
			"fecha"       => date('Y-m-d'),
			"statu"       => $statu,
			"estado_letra"      => $estado_letra,

		];

		$this->_respuesta_flete = $this->_modelo->Respuesta_Subasta_Tarifa($datos);
		echo json_encode($this->_respuesta_flete);
	}
	public function cancelar_solicitud_servicio()
	{
		$n_servicio = $_POST["idsolicitud"];
		$this->_requiere_cancelacion = $this->_modelo->Cancelar_Solicitud_Servicio($n_servicio);
		echo json_encode($this->_requiere_cancelacion);
	}
	public function aprueba_Sac()
	{
		$fecha = date('Y-m-d');
		$hora = date('G:i:s');
		$user = $_SESSION["usuario"]["nom_usuario"];
		$datos = [
			"user" => $_SESSION["usuario"]["nom_usuario"],
			"hora" => date('H:i:s'),
			"fecha" => date('Y-m-d'),
			"sidflete" => $_POST["sidflete"],
			"subasta" => $_POST["subasta"],
			"tarifa" => $_POST["tarifa"],
			"estado" => $_POST["estado"],
			"idpareja" => $_POST["idpareja"],
			"responsable" => $fecha . ' ' . $hora . ' ' . $user,
		];

		$this->_requiere_cancelacion = $this->_modelo->Aprueba_Sac($datos);
		echo json_encode($this->_requiere_cancelacion);
	}
}
