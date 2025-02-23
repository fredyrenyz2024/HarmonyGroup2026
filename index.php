<?php
define('DS', DIRECTORY_SEPARATOR);
//
define('ROOT', realpath(dirname(__FILE__)) . DS); //
define('APP_PATH', ROOT . 'application' . DS);
//definir el directorioo de los archivos del framework
ini_set('display_errors', 1);

try {
    //require_once(APP_PATH . 'Database2.php');
    require_once APP_PATH . 'Config.php';
    require_once APP_PATH . 'Request.php';
    require_once APP_PATH . 'Bootstrap.php';
    require_once APP_PATH . 'Controller.php';
    require_once APP_PATH . 'View.php';
    require_once APP_PATH . 'Model.php';
    require_once APP_PATH . 'Registro.php';
    require_once APP_PATH . 'Conexion.php';
    require_once APP_PATH . 'Popups.php';
    require_once APP_PATH . 'phpqrcode/qrlib.php';

    // Este es codigo que se debe dejar

    Bootstrap::run(new Request());

} catch (Exception $e) {
    echo "<p>" . $e->getMessage() . "</p>";
}

// fin del  codigo que se debe dejar

// echo '<h1>EN MIGRACI&Oacute;N</h1>';
