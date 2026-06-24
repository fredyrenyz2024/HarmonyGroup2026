<?php
// session_start();
class View
{
    private $_controlador;
    public $titulo;
    public $lanzador;
    public $dashboard;
    public $prueba;
    public $aprobar;
    public $prefiltro_coti;
    public $pedir_vehiculo;
    public $pedir_vehiculo2;
    public $preestudio;
    public $sub;
    public $orden;
    public $remesa;
    public $vremesa;
    public $mani;
    public $anticipo;
    public $cumplido;
    public $liquide;
    public $index_preestudio;
    public $vehiculos;
    public $proveedores;
    public $_view;
    public $cliente;
    public $usuario;
    public $municipios;
    public $bodega;
    public $subasta;
    public $ruta;
    public $planes;
    public $inicia_ruta;
    public $control_horas;
    public $group;
    public $trailer;
    public $solicitudes;
    public $tipo_pro;
    public $continuaruta;
    public $cargar;
    public $modelo;
    public $pedido;
    public $envia;
    public $trazo;
    public $asigne_conductor;
    public $punto_virtual;
    public $regla_sistema;
    // Variables de internacional
    public $plantillas;
    public $plantillas_actividades;
    public $monedas;
    public $usuarios;
    public $centro_costo;
    public $control_agrupaciones;
    public $agrupaciones;
    public $internacional;
    public $index_habilitar;
    public $estudio_vehiculo;
    public $index_historico;
    public $automatico;
    public $automatizar;
    public $seguir;
    public $seguir_documento;
    public $Municipio;
    public $flete;
    public $tipo_vehiculo;
    public $tipo_servicio;
    public $servicios_especiales;
    public $importacion;
    public $clientes;
    public $contenedores;
    public $justificaciones;
    public $informes;

    public function __construct(Request $peticion)
    {
        $this->_controlador = $peticion->getControlador();
    }

    public function renderizar($vista, $item = false)
    {
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
        $ssn_id_cliente = "";
        $ssn_id_usuario = "";
        $ssn_id_perfil = "";
        $ssn_id_rol_perfil = "";
        $idlanzador = "";
        $id = "";

        $menu = [];
        if (isset($_SESSION['usuario']) == true) {
            $ssn_id_cliente = $_SESSION['usuario']['id_cliente'];
            $ssn_id_usuario = $_SESSION["usuario"]["id_usuario"];
            $ssn_id_perfil = $_SESSION["usuario"]["id_perfil"];

            $url = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
            // Parseamos la URL para obtener el path
            $path = parse_url($url, PHP_URL_PATH);
            // Obtenemos la última parte del path usando basename
            $lastSegment = basename($path);
            if ($lastSegment == 'lanzador') {
                # code...
            } else {
                // Parsear la URL
                // Extraer la parte de la consulta (query)
                $query_string = parse_url($url, PHP_URL_QUERY);

                // Reemplazar "/?" por "&" para corregir el formato
                $query_string = str_replace('/?', '&', $query_string ?? '');

                // Parsear los parámetros
                parse_str($query_string, $query_params);

                $tmpIdmenu = 0;
                if (empty($query_params['idmenu'])) {
                    //El id no existe
                    $tmpIdmenu = 0;
                } else if ($query_params['idmenu'] == 0) {
                    // Ingresa a un menu
                    $tmpIdmenu = $query_params['idmenu'];
                } else {
                    // El id ya fue utilizado
                    $tmpIdmenu = $query_params['idmenu'];
                }

                /***** PROGRAMACION DEL MENU ******/
                $model = new Conexion;
                $conexion = $model->conectar();

                $sql = $conexion->prepare("SELECT DISTINCT(m.id), m.nom_menu FROM cmx_menu_perfil cp
                        INNER JOIN cmx_modulos_submenu ms
                        INNER JOIN cmx_submenu su
                        INNER JOIN cmx_menu m ON cp.id_submenu=ms.id_submenu AND ms.id_submenu=su.id AND su.id_menu=m.id
                        WHERE  m.estado=1 AND su.estado=1 AND cp.estado=1 AND ms.id_modulo='{$tmpIdmenu}'");
                $sql->execute();
                $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
                // $arrayMenu = $Data->getConsulta($sql);
                if ($resultado) {
                    foreach ($resultado as $key => $value) {
                        $sql = $conexion->prepare('SELECT su.* FROM  cmx_modulos_perfil mp
                                INNER JOIN cmx_modulos m
                                INNER JOIN cmx_modulos_submenu  ms
                                INNER JOIN cmx_submenu su
                                INNER JOIN cmx_menu mn
                                INNER JOIN cmx_menu_perfil o ON mp.id_modulo=m.id AND m.id=ms.id_modulo AND ms.id_submenu=su.id AND su.id_menu=mn.id AND o.id_submenu=su.id
                                WHERE  mp.id_perfil="' . $ssn_id_perfil . '" AND o.id_perfil="' . $ssn_id_perfil . '" AND mn.id="' . $value['id'] . '" AND m.id=' . $tmpIdmenu . '');
                        $sql->execute();
                        $arraySubMenu = $sql->fetchAll(PDO::FETCH_ASSOC);

                        if ($arraySubMenu) {
                            foreach ($arraySubMenu as $key1 => $value1) {
                                $submenu = [];
                                $submenu["submenu_id"] = $value1["id"];
                                $submenu["id"] = $value1["menu"];
                                $submenu["metodo"] = $value1["metodo"];
                                $submenu["titulo"] = $value1["titulo"];
                                $submenu["enlace"] = BASE_URL . $value1["menu"];
                                $menu[$value["nom_menu"]][] = $submenu;
                            }
                        }
                    }
                }
                /***** FIN PROGRAMACION DEL MENU ******/
            }
        }
        $_layoutParams = array(
            'ruta_layout' => BASE_URL . 'views/layout/' . DEFAULT_LAYOUT . '/',
            'ruta_css' => BASE_URL . 'views/layout/' . DEFAULT_LAYOUT . '/css/',
            'ruta_img' => BASE_URL . 'views/layout/' . DEFAULT_LAYOUT . '/img/',
            'ruta_js' => BASE_URL . 'views/layout/' . DEFAULT_LAYOUT . '/js/',
            // 'menu' => $menu1 // MENU QUEMADO
            'menu' => $menu, // MENU PROGARAMADO
        );

        $rutaView = ROOT . "views" . DS . $this->_controlador . DS . $vista . ".phtml";

        // Obtener la URL de la página actual
        $url = $_SERVER['REQUEST_URI'];

        if ($url == '/mvcLuisMiguel/') {
            // require_once ROOT . 'views' . DS . 'layout' . DS . DEFAULT_LAYOUT . DS . 'headerlog.php';
            if (is_readable($rutaView)) {
                require_once $rutaView;
            } else {
                throw new Exception("Error de vista: El archivo " . $rutaView . " no es leible o no se encuentra en el servidor");
            }
        } else if ($url == '/mvcLuisMiguel/control_ruta/seguir_ruta/?idmenu=5' || $url == '/mvcLuisMiguel/index/lanzador') {
            require_once ROOT . 'views' . DS . 'layout' . DS . DEFAULT_LAYOUT . DS . 'header.php';
            if (is_readable($rutaView)) {
                require_once $rutaView;
            } else {
                throw new Exception("Error de vista: El archivo " . $rutaView . " no es leible o no se encuentra en el servidor");
            }
            // require_once ROOT . 'views' . DS . 'layout' . DS . DEFAULT_LAYOUT . DS . 'footer.php';  $url == '/mvcLuisMiguel/index/index1/?idmenu=' . $idmenu . '/?submenu=' . $submenu . ''
        } else if (
            $url == '/mvcLuisMiguel/index/index1/?idmenu=8' ||
            $url == '/mvcLuisMiguel/serviciocliente/cotizaciones_nuevo?idmenu=8&submenu=85' ||
            $url == '/mvcLuisMiguel/index/index1/?idmenu=1' ||
            $url == '/mvcLuisMiguel/prefiltro_nacional/solicitudes_nacional?idmenu=1&submenu=92' ||
            $url == '/mvcLuisMiguel/pantallas/nuevo_filtro/?idmenu=3' ||
            $url == '/mvcLuisMiguel/pantallas/index?idmenu=3&submenu=193' ||
            // $url == '/mvcLuisMiguel/pantallas/nueva_ventana/?idmenu=3' ||
            $url == '/mvcLuisMiguel/index/index1/?idmenu=16' ||
            $url == '/mvcLuisMiguel/index/index1/?idmenu=18' ||
            // $url == '/mvcLuisMiguel/pantallas/nueva_ventana?idmenu=3&submenu=200' ||
            $url == '/mvcLuisMiguel/torrecontrol/index?idmenu=16&submenu=207' ||
            $url == "/mvcLuisMiguel/torrecontrol/proveedor_torre_control?idmenu=16&submenu=208" ||
            $url == '/mvcLuisMiguel/torrecontrol/cliente_torre_control?idmenu=16&submenu=209' ||
            $url == '/mvcLuisMiguel/index/index1/?idmenu=3' ||
            $url == '/mvcLuisMiguel/parametros/crear_proveedor?idmenu=3&submenu=211' ||
            $url == '/mvcLuisMiguel/torrecontrol/crear_plantilla?idmenu=3&submenu=212' ||
            $url == '/mvcLuisMiguel/pantallas/nuevo_filtro?idmenu=3&submenu=195' ||
            $url == '/mvcLuisMiguel/pantallas/index?idmenu=3&submenu=199' ||
            $url == '/mvcLuisMiguel/torrecontrol/despachador_torre_control?idmenu=16&submenu=213' ||
            $url == '/mvcLuisMiguel/seguridad_prefiltro/habilitar_carropreestudio?idmenu=4&submenu=115' ||
            $url == '/mvcLuisMiguel/parametros/precinto?idmenu=3&submenu=215' ||
            $url == '/mvcLuisMiguel/parametros/servicio_torre_control?idmenu=3&submenu=210' ||
            $url == '/mvcLuisMiguel/seguridad_prefiltro/preestudio_solicitudes?idmenu=4&submenu=114' ||
            $url == '/mvcLuisMiguel/control_ruta/seguir_ruta?idmenu=5&submenu=127' ||
            $url == '/mvcLuisMiguel/pantallas/nueva_ventana?idmenu=3&submenu=194' ||
            $url == '/mvcLuisMiguel/control_ruta/ruta?idmenu=5&submenu=116' ||
            $url == '/mvcLuisMiguel/control_ruta/seguimiento_ruta?idmenu=5&submenu=207' ||
            $url == '/mvcLuisMiguel/novedades/notificacion_seguimiento?idmenu=12&submenu=208' ||
            $url == '/mvcLuisMiguel/clientes/clientes_index?idmenu=3&submenu=209' ||
            $url == '/mvcLuisMiguel/torrecontrol/index?idmenu=16&submenu=198' ||
            $url == '/mvcLuisMiguel/torrecontrol/proveedor_torre_control?idmenu=16&submenu=199' ||
            $url == '/mvcLuisMiguel/torrecontrol/cliente_torre_control?idmenu=16&submenu=200' ||
            $url == '/mvcLuisMiguel/parametros/configuracion_envio?idmenu=3&submenu=188' ||
            $url == '/mvcLuisMiguel/indicadores/index?idmenu=17&submenu=189' ||
            $url == '/mvcLuisMiguel/index/index1/?idmenu=17' ||
            $url == '/mvcLuisMiguel/indicadores/graficos_operacion?idmenu=17&submenu=210' ||
            $url == '/mvcLuisMiguel/indicadores/graficos_facturacion?idmenu=17&submenu=211' ||
            $url == '/mvcLuisMiguel/indicadores/graficos_comercial?idmenu=17&submenu=212' ||
            $url == '/mvcLuisMiguel/parametros/tarifa_ventas?idmenu=3&submenu=213' ||
            $url == '/mvcLuisMiguel/fletes_nacional/fletes_nacional?idmenu=3&submenu=98' ||
            $url == '/mvcLuisMiguel/tipo_servicio_mercancia/index_tiposervicio?idmenu=3&submenu=95' ||
            $url == '/mvcLuisMiguel/parametros/crear_proveedor?idmenu=3&submenu=196' ||
            $url == '/mvcLuisMiguel/novedades/anticipos_pagos?idmenu=12&submenu=214' ||
            $url == '/mvcLuisMiguel/novedades/datos_bancarios?idmenu=12&submenu=215' ||
            $url == '/mvcLuisMiguel/parametros/precinto?idmenu=3&submenu=205' ||
            $url == '/mvcLuisMiguel/novedades/tarjetas?idmenu=12&submenu=216' ||
            $url == '/mvcLuisMiguel/servicios_especiales/crear_servicio?idmenu=12&submenu=159' ||
            $url == '/mvcLuisMiguel/parametros/zonas_despacho?idmenu=3&submenu=217' ||
            $url == '/mvcLuisMiguel/novedades/facturacion?idmenu=12&submenu=219' ||
            $url == '/mvcLuisMiguel/pantallas/parametro_general?idmenu=3&submenu=220' ||
            $url == '/mvcLuisMiguel/torrecontrol/crear_plantilla?idmenu=3&submenu=202' ||
            $url == '/mvcLuisMiguel/torrecontrol/parametros_torre_control?idmenu=3&submenu=221' ||
            $url == '/mvcLuisMiguel/cuatropl/index?idmenu=18&submenu=223' ||
            $url == '/mvcLuisMiguel/cuatropl/cliente_cuatro_pl?idmenu=18&submenu=224' ||
            $url == '/mvcLuisMiguel/cuatropl/proveedor_cuatro_pl?idmenu=18&submenu=225' ||
            $url == '/mvcLuisMiguel/parametros/productos_clientes?idmenu=3&submenu=226' ||
            $url == '/mvcLuisMiguel/index/index1/?idmenu=5' ||
            $url == '/mvcLuisMiguel/alertas_trafico/index?idmenu=5&submenu=227'
        ) {
            // require_once ROOT . 'views' . DS . 'layout' . DS . DEFAULT_LAYOUT . DS . 'headernuevo.php';
            require_once ROOT . 'views' . DS . 'layout' . DS . DEFAULT_LAYOUT . DS . 'headertop.php';
            if (is_readable($rutaView)) {
                require_once $rutaView;
            } else {
                throw new Exception("Error de vista: El archivo " . $rutaView . " no es leible o no se encuentra en el servidor");
            }
            require_once ROOT . 'views' . DS . 'layout' . DS . DEFAULT_LAYOUT . DS . 'footernuevo.php';
        } else {
            require_once ROOT . 'views' . DS . 'layout' . DS . DEFAULT_LAYOUT . DS . 'header.php';
            if (is_readable($rutaView)) {
                require_once $rutaView;
            } else {
                throw new Exception("Error de vista: El archivo " . $rutaView . " no es leible o no se encuentra en el servidor");
            }
            require_once ROOT . 'views' . DS . 'layout' . DS . DEFAULT_LAYOUT . DS . 'footer.php';
        }
    }

    /**
     * Renderiza la vista de forma inteligente:
     * 1. Si es AJAX (Livewire-style), solo devuelve el fragmento HTML.
     * 2. Si es carga normal (F5), carga el layout completo (Header, Menú, Footer).
     */
    public function renderizar_ventana($vista, $item = false)
    {
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }

        // 1. DETECCIÓN DE PETICIÓN DINÁMICA (Livewire / Fetch)
        $isAjax = (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest')
            || isset($_GET['ajax']);

        $rutaView = ROOT . "views" . DS . $this->_controlador . DS . $vista . ".phtml";

        if (!is_readable($rutaView)) {
            throw new Exception("Error de vista: El archivo [" . $rutaView . "] no es leíble o no se encuentra.");
        }

        // --- CASO A: PETICIÓN AJAX (Solo el contenido de la ventana) ---
        if ($isAjax) {
            // No cargamos headers, ni menús, ni SQL pesado. Directo a la vista.
            require_once $rutaView;
            return; // Terminamos la ejecución inmediatamente.
        }

        // --- CASO B: CARGA COMPLETA (F5 / Acceso directo) ---
        $menu = [];
        if (isset($_SESSION['usuario'])) {
            $ssn_id_perfil = $_SESSION["usuario"]["id_perfil"];

            // Obtenemos el ID del menú de la URL (Refactorizado para ser más limpio)
            $idmenu_encrypted = $_GET['idmenu'] ?? null;
            $idmenu = ($idmenu_encrypted) ? decrypt($idmenu_encrypted) : 0;
            $tmpIdmenu = empty($idmenu) ? 0 : $idmenu;

            // PROGRAMACIÓN DEL MENÚ (Solo se ejecuta en carga completa)
            $model = new Conexion;
            $conexion = $model->conectar();

            $sqlMenu = $conexion->prepare("SELECT DISTINCT(m.id), m.nom_menu FROM cmx_menu_perfil cp
            INNER JOIN cmx_modulos_submenu ms ON cp.id_submenu = ms.id_submenu
            INNER JOIN cmx_submenu su ON ms.id_submenu = su.id
            INNER JOIN cmx_menu m ON su.id_menu = m.id
            WHERE m.estado=1 AND su.estado=1 AND cp.estado=1 AND ms.id_modulo = :idmodulo");

            $sqlMenu->execute([':idmodulo' => $tmpIdmenu]);
            $resultado = $sqlMenu->fetchAll(PDO::FETCH_ASSOC);

            if ($resultado) {
                foreach ($resultado as $value) {
                    $sqlSub = $conexion->prepare('SELECT su.* FROM cmx_modulos_perfil mp
                    INNER JOIN cmx_modulos m ON mp.id_modulo = m.id
                    INNER JOIN cmx_modulos_submenu ms ON m.id = ms.id_modulo
                    INNER JOIN cmx_submenu su ON ms.id_submenu = su.id
                    INNER JOIN cmx_menu mn ON su.id_menu = mn.id
                    INNER JOIN cmx_menu_perfil o ON o.id_submenu = su.id
                    WHERE mp.id_perfil = :perfil AND o.id_perfil = :perfil2 
                    AND mn.id = :menuid AND m.id = :moduloid');

                    $sqlSub->execute([
                        ':perfil' => $ssn_id_perfil,
                        ':perfil2' => $ssn_id_perfil,
                        ':menuid' => $value['id'],
                        ':moduloid' => $tmpIdmenu
                    ]);
                    $arraySubMenu = $sqlSub->fetchAll(PDO::FETCH_ASSOC);

                    if ($arraySubMenu) {
                        foreach ($arraySubMenu as $value1) {
                            $menu[$value["nom_menu"]][] = [
                                "submenu_id" => $value1["id"],
                                "id" => $value1["menu"],
                                "metodo" => $value1["metodo"],
                                "titulo" => $value1["titulo"],
                                "enlace" => BASE_URL . $value1["menu"]
                            ];
                        }
                    }
                }
            }
        }

        $_layoutParams = [
            'ruta_layout' => BASE_URL . 'views/layout/' . DEFAULT_LAYOUT . '/',
            'ruta_css'    => BASE_URL . 'views/layout/' . DEFAULT_LAYOUT . '/css/',
            'ruta_img'    => BASE_URL . 'views/layout/' . DEFAULT_LAYOUT . '/img/',
            'ruta_js'     => BASE_URL . 'views/layout/' . DEFAULT_LAYOUT . '/js/',
            'menu'        => $menu,
        ];

        // LÓGICA DE HEADERS SIMPLIFICADA
        $url = $_SERVER['REQUEST_URI'];

        // Si es la raíz del proyecto
        if ($url == '/mvcLuisMiguel/' || empty($url)) {
            require_once ROOT . 'views' . DS . 'layout' . DS . DEFAULT_LAYOUT . DS . 'headerlog.php';
        } else {
            // Para cualquier otra URL que no sea AJAX, usamos el header estándar.
            // Ya no necesitas listar los 30 else if.
            require_once ROOT . 'views' . DS . 'layout' . DS . DEFAULT_LAYOUT . DS . 'header.php';
        }

        // Carga de la vista principal
        require_once $rutaView;

        // Carga del footer (Solo en F5)
        require_once ROOT . 'views' . DS . 'layout' . DS . DEFAULT_LAYOUT . DS . 'footer.php';
    }

    public function Cargar_Filtros_ventana($ventana)
    {
        // session_start();
        // session_start();
        $model = new Conexion;
        $conexion = $model->conectar();
        $empresa_id = $_SESSION["usuario"]["empresa_id"];

        $sql = $conexion->prepare("SELECT f.id, f.tipo_campo, f.label, f.nombre_filtro, fo.opcion  
        FROM cmx_filtros f 
        INNER JOIN cmx_ventana_filtro vf ON f.id = vf.filtro_id
        LEFT JOIN cmx_filtro_opcion fo ON f.id = fo.filtro_id AND fo.estado_opcion='Activo'
        WHERE vf.ventena_id = :ventana AND f.empresa_id = :empresa AND vf.estado_ventana_filtro='Activo' AND f.estado_filtro='Activo' ORDER BY f.id ASC");
        $sql->bindParam(':ventana', $ventana, PDO::PARAM_INT);
        $sql->bindParam(':empresa', $empresa_id, PDO::PARAM_INT);
        $sql->execute();

        $resultados = [];
        foreach ($sql->fetchAll(PDO::FETCH_ASSOC) as $value) {
            $id = $value['id'];

            // Si el filtro ya existe en el array, solo agregamos la opción
            if (!isset($resultados[$id])) {
                $resultados[$id] = [
                    "tipo_campo" => $value['tipo_campo'],
                    "label" => $value['label'],
                    "nombre_filtro" => $value['nombre_filtro'],
                    "opciones" => [] // Inicializamos opciones por cada filtro
                ];
            }

            if (!empty($value['opcion'])) {
                $resultados[$id]['opciones'][] = $value['opcion'];
            }
        }

        return ["resultados" => array_values($resultados)];
    }
}
