<?php
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
                $query_string = str_replace('/?', '&', $query_string);

                // Parsear los parámetros
                parse_str($query_string, $query_params);

                // // Obtener los valores de idmenu y submenu
                // $idmenu_encrypted = $query_params['idmenu'] ?? null;
                // $submenu_encrypted = $query_params['submenu'] ?? null;

                // // Descifrar los valores
                // $idmenu = decrypt($idmenu_encrypted);
                // $submenu = decrypt($submenu_encrypted);
                // // Validar que los valores no estén vacíos
                // // if (empty($idmenu) || empty($submenu)) {
                // //     die("Parámetros inválidos o corruptos.");
                // // }
                // $tmpIdmenu = 0;
                // if (empty($idmenu)) {
                //     //El id no existe
                //     $tmpIdmenu = 0;
                // } else if ($idmenu == 0) {
                //     // Ingresa a un menu
                //     $tmpIdmenu = $idmenu;
                // } else {
                //     // El id ya fue utilizado
                //     $tmpIdmenu = $idmenu;
                // }

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

                // print_r($tmpIdmenu);
                // exit();

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
        // print_r($rutaView);

        // Obtener la URL de la página actual
        $url = $_SERVER['REQUEST_URI'];
        // var_dump($url);
        // exit();
        if ($url == '/mvcLuisMiguel/') {
            require_once ROOT . 'views' . DS . 'layout' . DS . DEFAULT_LAYOUT . DS . 'headerlog.php';
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
            $url == '/mvcLuisMiguel/index/index1/?idmenu=8' || $url == '/mvcLuisMiguel/serviciocliente/cotizaciones_nuevo?idmenu=8/?submenu=85' || $url == '/mvcLuisMiguel/index/index1/?idmenu=1' ||
            $url == '/mvcLuisMiguel/prefiltro_nacional/solicitudes_nacional?idmenu=1/?submenu=92' || $url == '/mvcLuisMiguel/pantallas/nuevo_filtro/?idmenu=3' || $url == '/mvcLuisMiguel/pantallas/nueva_ventana/?idmenu=3'
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

    /* Renderizar la vista sin el header y el footer */

    public function renderizar_ventana($vista, $item = false)
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
                $query_string = str_replace('/?', '&', $query_string);

                // Parsear los parámetros
                parse_str($query_string, $query_params);

                // Obtener los valores de idmenu y submenu
                $idmenu_encrypted = $query_params['idmenu'] ?? null;
                $submenu_encrypted = $query_params['submenu'] ?? null;

                // Descifrar los valores
                $idmenu = decrypt($idmenu_encrypted);
                $submenu = decrypt($submenu_encrypted);
                // Validar que los valores no estén vacíos
                // if (empty($idmenu) || empty($submenu)) {
                //     die("Parámetros inválidos o corruptos.");
                // }
                $tmpIdmenu = 0;
                if (empty($idmenu)) {
                    //El id no existe
                    $tmpIdmenu = 0;
                } else if ($idmenu == 0) {
                    // Ingresa a un menu
                    $tmpIdmenu = $idmenu;
                } else {
                    // El id ya fue utilizado
                    $tmpIdmenu = $idmenu;
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
        // var_dump($url);
        if ($url == '/mvcLuisMiguel/') {
            require_once ROOT . 'views' . DS . 'layout' . DS . DEFAULT_LAYOUT . DS . 'headerlog.php';
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
            $url == '/mvcLuisMiguel/index/index1/?idmenu=8' || $url == '/mvcLuisMiguel/serviciocliente/cotizaciones_nuevo/?idmenu=85' || $url == '/mvcLuisMiguel/index/index1/?idmenu=1' ||
            $url == '/mvcLuisMiguel/transporte/ver_orden/?idmenu=%201' || $url = "mvcLuisMiguel/parametros/nueva_pantalla/?idmenu=3" || $url = '/mvcLuisMiguel/prefiltro_nacional/solicitudes_nacional/?idmenu=92'
        ) {
            // require_once ROOT . 'views' . DS . 'layout' . DS . DEFAULT_LAYOUT . DS . 'headernuevo.php';
            // require_once ROOT . 'views' . DS . 'layout' . DS . DEFAULT_LAYOUT . DS . 'headertop.php';
            if (is_readable($rutaView)) {
                require_once $rutaView;
            } else {
                throw new Exception("Error de vista: El archivo " . $rutaView . " no es leible o no se encuentra en el servidor");
            }
            // require_once ROOT . 'views' . DS . 'layout' . DS . DEFAULT_LAYOUT . DS . 'footernuevo.php';
        } else {
            // require_once ROOT . 'views' . DS . 'layout' . DS . DEFAULT_LAYOUT . DS . 'header.php';
            if (is_readable($rutaView)) {
                require_once $rutaView;
            } else {
                throw new Exception("Error de vista: El archivo " . $rutaView . " no es leible o no se encuentra en el servidor");
            }
            // require_once ROOT . 'views' . DS . 'layout' . DS . DEFAULT_LAYOUT . DS . 'footer.php';
        }
    }

    public function Cargar_Filtros_ventana($ventana)
    {
        $model = new Conexion;
        $conexion = $model->conectar();
        $empresa_id = $_SESSION["usuario"]["empresa_id"];

        $sql = $conexion->prepare("SELECT f.id, f.tipo_campo, f.label, f.nombre_filtro, fo.opcion  
        FROM cmx_filtros f 
        INNER JOIN cmx_ventana_filtro vf ON f.id = vf.filtro_id
        LEFT JOIN cmx_filtro_opcion fo ON f.id = fo.filtro_id
        WHERE vf.ventena_id = :ventana AND f.empresa_id = :empresa AND vf.estado_ventana_filtro='Activo'");
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
