<?php
date_default_timezone_set('America/Bogota');

define('BASE_URL', 'http://localhost/mvcLuisMiguel/');

define('BASE_URL_CLOSE', 'http://localhost/mvcLuisMiguel/');

/***** se define el tamaño máximo de subida de archivos *****/
define('MAX_FILE_SIZE_JS', 3000000);

/***** estos enlaces apuntan a la dashboard *****/
define('DEFAULT_CONTROLLER', 'index');
define('DEFAULT_LAYOUT', 'assets');

/***** Constantes por defecto de ejemplo se pueden definir otros para personalizar la aplicacion *****/
define('APP_NAME', ''); // Nombre de la aplicacion
define('APP_SLOGAN', 'Logística Integral');
define('APP_COMPANY', 'Harmony Group');


// Clave secreta (debe ser la misma para cifrar y descifrar)
define('SECRET_KEY', '$RP*@2025'); // Cambia esto por una clave segura
define('CIPHER_METHOD', 'AES-256-CBC'); // Método de cifrado
/***** Parametros de conexion a la base de datos *****/
//BD LOCAL  web

// define('DB_HOST', '162.240.67.50');
// define('DB_USER', 'nexosapp_local');
// define('DB_PASS', 'cqcUM$p5tT3C');
// define('DB_NAME', 'nexosapp_cmx_nexos');
// define('DB_CHAR', 'utf8');

//  Base de datos de Lucas
// define('DB_HOST', '192.168.0.160');
// define('DB_USER', 'root');
// define('DB_PASS', '');
// define('DB_NAME', 'cmx_nexos');
// define('DB_CHAR', 'utf8');

//BD LOCAL pc

define('DB_HOST', 'localhost');
// define('DB_HOST', '192.168.0.160');
define('DB_USER', 'root');
define('DB_PASS', '1234567891.123');
// define('DB_PASS', '');
// define('DB_NAME', 'cmx_nexos');
define('DB_NAME', 'nexosapp_principal');
// define('DB_NAME', 'nexosapp_principal');
define('DB_CHAR', 'utf8');

/***** Parametros de conexion al correo de envio de notificaciones *****/
define('mailhost', "smtp.gmail.com");
define('mailport', 465);
define('mailuser', "soportenexosgroup@gmail.com");
define('mailpwd', "Nexosdesarrollo2017");
define('mailauth', true);
define('mailfrom', "noreply@nexosapp.com");
define('mailreply', "soportenexosgroup@gmail.com");
define('mailfromname', "nexosgroup.com");
define('mailtest', "soportenexosgroup@gmail.com");
define('maillogo', "images/logo_mail.png");

/***** Se define variable temporal de uso en bodegas para salida de material sin lote *****/
define('BODEGAS_LITE', true);

/***** Se define el tiempo de entre seguimientos *****/
define('STANDBY_SEGUIMIENTO_HOURS', 1);

/***** Se define los días de vigencia de las claves de los usuarios - en días *****/
define('VIGENCIA_CLAVES', 180);

/***** Se define los parámteros de uso del Web Service del Ministerio de Transporte *****/
// define('MINTRANS_URL', "http://plc.mintransporte.gov.co:8080/wsdl/IBPMServices"); // URL de simulación 2019
define('MINTRANS_URL', "http://plc.mintransporte.gov.co:8080/wsdl/IBPMServices"); // URL de simulación 2019
define('MINTRANS_URL2', "http://plc.mintransporte.gov.co:8080/wsdl/IBPMServices"); // URL de simulación 2019
define('MINTRANS_USER', "NEXOSCAR@1622"); //PRUEBAS
define('MINTRANS_PASS', "12345678"); //PRUEBAS
define('MINTRANS_NIT', 9000625968); // PRUEBAS
define('MINTRANS_SIMULACION', "S"); // "S" Para el entono de simulación | "R" Para el entono de producción

// Ambiente de Produccion
// define('MINTRANS_USER', "NEXOSCAR@1622"); //PRODUCCION
// define('MINTRANS_PASS', "NexosSAS2024"); // PRODUCCION
// define('MINTRANS_NIT', 9000625968); // PRODUCCION
// define('MINTRANS_URL', "http://rndcws.mintransporte.gov.co:8080/ws/svr008w.dll/wsdl/IBPMServices");
// define('MINTRANS_URL_2', "http://rndcws2.mintransporte.gov.co:8080/ws/svr008w.dll/wsdl/IBPMServices"); // URL de simulación 2024
// define('MINTRANS_SIMULACION', "R"); // "S" Para el entono de simulación | "R" Para el entono de producción

//rndc@mintransporte.gov.co
//https://rndc.mintransporte.gov.co/wstest/defaultp.aspx


const METHOD = "AES-256-CBC";
// const SECRET_KEY = '$RP*@2021';
const SECRET_IV = '10172'; // esto hace que cada quien tenga modo de incriptacion

// Función para cifrar
function encrypt($data)
{
  $iv_length = openssl_cipher_iv_length(CIPHER_METHOD);
  $iv = openssl_random_pseudo_bytes($iv_length); // Vector de inicialización (IV)
  $encrypted = openssl_encrypt($data, CIPHER_METHOD, SECRET_KEY, 0, $iv);
  return base64_encode($iv . $encrypted); // Concatenar IV y datos cifrados
}

// Función para descifrar
function decrypt($data)
{
  $data = base64_decode($data);
  $iv_length = openssl_cipher_iv_length(CIPHER_METHOD);
  $iv = substr($data, 0, $iv_length); // Extraer el IV
  $encrypted = substr($data, $iv_length); // Extraer los datos cifrados
  return openssl_decrypt($encrypted, CIPHER_METHOD, SECRET_KEY, 0, $iv);
}
