<?php
date_default_timezone_set('America/Bogota');

//include_once dirname(__FILE__) .'/sec_ajax.php';
include 'Session.php';
include './Crud.php';

$mensaje = "";
$ContenidoHTML = "";
if ($_POST['Op'] == "login") {
    $model = new Session();
    $model->user_log = $_POST['user_log'];
    $model->pass = $_POST['pass'];
    $model->login();
    $respuesta = $model->respuesta;
}
if ($_POST['Op'] == "recuperar") {
    $model = new Session();
    $model->email = $_POST['email'];
    $model->recuperar();
    $respuesta = $model->respuesta;
    if ($respuesta == "GOOD") {
        $ContenidoHTML = $model->mensaje;
    }
}
if ($_POST['Op'] == "reset") {
    $model = new Session();
    $model->email = $_POST['email'];
    $model->user_log = $_POST['user_log'];
    $model->pass = $_POST['pass'];
    $model->reset();
    $respuesta = $model->respuesta;
}
if ($_POST['Op'] == "insertar_ruta") {
    $origen_lat = $_POST["origen_lat"];
    $origen_lng = $_POST["origen_lng"];
    $destino_lat = $_POST["destino_lat"];
    $destino_lng = $_POST["destino_lng"];
    $model = new Crud;
    $model->insertInto = "cmx_demo_rutas";
    $model->insertValues = "null,'$origen_lat','$origen_lng','$destino_lat','$destino_lng'";
    $model->Crear();
    $respuesta = $model->mensaje;
}
if ($_POST['Op'] == "notif") {
    $model = new Session();
    $model->user_log = $_POST['user_log'];
    $model->notificar();
    $respuesta = $model->respuesta;
    if ($respuesta == "GOOD") {
        $filas = $model->listado;
        $ContenidoHTML = [];
        $x = 0;
        $mensaje = $model->mensaje;
        foreach ($filas as $fila) {
            $ContenidoHTML[$x][0] = $fila["nombre"];
            // $ContenidoHTML[$x][1] = $fila["cs_num_de_orden"]; // Version oredenes de compra OC
            $ContenidoHTML[$x][1] = $fila["numero_importacion"];
            $ContenidoHTML[$x][2] = $fila["tiempo_notificaciones"];
            $x++;
        }
    }
}
if ($_POST['Op'] == "campana") {
    $model = new Session();
    $model->user_log = $_POST['user_log'];
    $model->campana_notificaciones();
    $respuesta = $model->respuesta;
    if ($respuesta == "GOOD") {
        $filas = $model->listado;
        $ContenidoHTML = [];
        $x = 0;
        $mensaje = $model->mensaje;
        $_msg = "";
        foreach ($filas as $fila) {
            $ContenidoHTML[$x][0] = $fila["nombre"];
            $ContenidoHTML[$x][1] = $fila["numero_importacion"];
            $ContenidoHTML[$x][2] = $fila["tiempo_notificaciones"];
            $x++;
        }
        $contenido = $ContenidoHTML; 
    }
}
if ($_POST['Op'] == "ValidarDatosReset") {
    session_start();
    if ($_POST['dato'] == "user_log") {
        if ($_POST["campo"] == $_SESSION['confirm_reset']['user_log'] && !(empty($_POST["campo"]))) {
            $respuesta = "GOOD";
        } else {
            $respuesta = "BAD";
        }
    } else if ($_POST['dato'] == "correo") {
        if ($_POST["campo"] == $_SESSION['confirm_reset']['email'] && !(empty($_POST["campo"]))) {
            $respuesta = "GOOD";
        } else {
            $respuesta = "BAD";
        }
    } else if ($_POST['dato'] == "code") {
        if ($_POST["campo"] == $_SESSION['confirm_reset']['reset_pass'] && !(empty($_POST["campo"]))) {
            $respuesta = "GOOD";
        } else {
            $respuesta = "BAD";
        }
    }
}


if ($_POST['Op'] == "datasets") {
    $model = new Session();

   $arrayPedidos = Array();
    // Material 1
    $arrayPedidos[0]["material"] = "1234556";
    $arrayPedidos[0]["pedido"] = "3132654";
    $arrayPedidos[0]["lote"] = "852456";
    // Material 2
    $arrayPedidos[1]["material"] = "321654";
    $arrayPedidos[1]["pedido"] = "3132654";
    $arrayPedidos[1]["lote"] = "963321";

    // Material 3
    $arrayPedidos[2]["material"] = "741258";
    $arrayPedidos[2]["pedido"] = "3132654";
    $arrayPedidos[2]["lote"] = "852963";

    $JSON       = $_POST['qrtext'];
        $request    = $_POST['qrtext'];
        $flag = false;
        $qrtext    = $request;
        $arrayQR = $model->reversarKeyPedido($qrtext);
        foreach ($arrayPedidos as $key => $value) {
            if ($arrayPedidos[$key]["material"] == $arrayQR[0] AND $arrayPedidos[$key]["pedido"] == $arrayQR[1] AND $arrayPedidos[$key]["lote"] == $arrayQR[2] ) {
                $flag = true;
                break;
            }
        }
    if($flag){
        $respuesta="GOOD";
    }
    else{
        $respuesta="BAD";
    }
}
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers:        {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}


if ($_POST['Op'] == "loginapp") {
    $model = new Session();
    $model->user_log = $_POST['user_log'];
    $model->pass = $_POST['pass'];
    $model->loginapp();
    $respuesta = $model->respuesta;
    $filas = $model->listado;
    $ContenidoHTML=[];
    $ContenidoHTML[0][0] = $filas["id_usuario"];
    $ContenidoHTML[0][1] = utf8_encode($filas["nom_usuario"]);
    $ContenidoHTML[0][2] = $filas["email"];
    $ContenidoHTML[0][3] =  utf8_encode($filas["nombre_perfil"]);
    $ContenidoHTML[0][4] = $filas["id_perfil"];
    $ContenidoHTML[0][5] =  utf8_encode($filas["nombre_cliente"]);
    $ContenidoHTML[0][6] = $filas["id_bodega"];
}
if ($_POST['Op'] == "obteneringresos") {
    $model = new Session();
    $id_bodega = $_POST["id_bodega"];
    $model->Obteneringresos($id_bodega);
    $respuesta = $model->respuesta;
    if ($respuesta == "GOOD") {
        $filas = $model->listado;
        if(count($filas)>0){
            $ContenidoHTML = [];
            $x = 0;
            $mensaje = $model->mensaje;
            foreach ($filas as $fila) {
                $ContenidoHTML[$x][0] = $fila["id"];
                $ContenidoHTML[$x][1] = $fila["numero_ingreso"];
                $ContenidoHTML[$x][2] = $fila["doc_conductor"];
                $ContenidoHTML[$x][3] = utf8_encode($fila["nom_conductor"]);
                $ContenidoHTML[$x][4] = $fila["placa"];
                $ContenidoHTML[$x][5] = $fila["precinto"];
                $ContenidoHTML[$x][6] = $fila["estado"];
                $ContenidoHTML[$x][7] = $fila["esc"];
                $ContenidoHTML[$x][8] = $fila["tot"];
                $ContenidoHTML[$x][9] = date('Y-m-d', $fila["numero_ingreso"]);
                $x++;
            }
        }
        else{
            $respuesta = "BAD";
        }
    }
}
if ($_POST['Op'] == "ObtenerembalajeAlmacen") {
    $model = new Session();
    $id_bodega = $_POST["id_bodega"];
    $model->ObtenerembalajeAlmacen($id_bodega);
    $respuesta = $model->respuesta;
    if ($respuesta == "GOOD") {
        $filas = $model->listado;
        if(count($filas)>0){
            $ContenidoHTML = [];
            $x = 0;
            $mensaje = $model->mensaje;
            foreach ($filas as $fila) {
                $ContenidoHTML[$x][0] = $fila["id"];
                $ContenidoHTML[$x][1] = $fila["numero_ingreso"];
                $ContenidoHTML[$x][2] = $fila["doc_conductor"];
                $ContenidoHTML[$x][3] = utf8_encode($fila["nom_conductor"]);
                $ContenidoHTML[$x][4] = $fila["placa"];
                $ContenidoHTML[$x][5] = $fila["precinto"];
                $ContenidoHTML[$x][6] = $fila["estado"];
                $ContenidoHTML[$x][7] = $fila["esc"];
                $ContenidoHTML[$x][8] = $fila["tot"];
                $ContenidoHTML[$x][9] = date('Y-m-d', $fila["numero_ingreso"]);
                $x++;
            }
        }
        else{
            $respuesta = "BAD";
        }
    }
}
if ($_POST['Op'] == "verificarembalajepedidos") {
    $model = new Session();
    $id_ingreso = $_POST["id_ingreso"];
    $qrtext = $_POST["qrtext"];
    $id_usuario = $_POST["id_usuario"];
    $id_bodega = $_POST["id_bodega"];
    $model->verificarembalajepedidos($id_ingreso,$qrtext,$id_usuario,$id_bodega);
    $respuesta = $model->respuesta;
    $mensaje = $model->mensaje;
}
if ($_POST['Op'] == "desbloquearpedido") {
    $model = new Session();
    $id_ingreso = $_POST["id_ingreso"];
    $qrtext = $_POST["qrtext"];
    $id_usuario = $_POST["id_usuario"];
    $id_bodega = $_POST["id_bodega"];    
    $model->desbloquearpedido($id_ingreso,$qrtext,$id_usuario,$id_bodega);
    $respuesta = $model->respuesta;
    $mensaje = $model->mensaje;
}
if ($_POST['Op'] == "terminarescaneo") {
    $model = new Session();
    $id_ingreso = $_POST["id_ingreso"];
    $id_usuario = $_POST["id_usuario"];
    $id_bodega = $_POST["id_bodega"];
    $model->terminarescaneo($id_ingreso,$id_usuario,$id_bodega);
    $respuesta = $model->pass;
    $mensaje = $model->mensaje;
}

if ($_POST['Op'] == "verificarposicion") {
    $model = new Session();
    $qrtext = $_POST["qrtext"];
    $id_usuario = $_POST["id_usuario"];
    $id_ingreso = $_POST["id_ingreso"];
    $id_bodega = $_POST["id_bodega"];
    $model->verificarposicion($id_ingreso,$qrtext,$id_usuario,$id_bodega);
        $respuesta = $model->respuesta;
        $mensaje = $model->mensaje;
        if ($respuesta == "GOOD") {
            if($mensaje == "GOOD"){

            $filas = $model->listado;
            $ContenidoHTML=[];
            $ContenidoHTML[0][0] = $filas["id"];
            $ContenidoHTML[0][1] = $filas["linea"];
            $ContenidoHTML[0][2] = $filas["columna"];
            $ContenidoHTML[0][3] = $filas["nivel"];
            $ContenidoHTML[0][4] = $filas["qr_posicion"];
            $ContenidoHTML[0][5] = $filas["tipo_ubicacion"];
            $ContenidoHTML[0][6] = $filas["estado"];
            $ContenidoHTML[0][7] = $filas["cantidad_material"];
            $ContenidoHTML[0][8] = $filas["DISPONIBLES"];
            $ContenidoHTML[0][9] = $filas["material"];
            }
        }
}
if ($_POST['Op'] == "desbloquearingresoalmacen") {
    $model = new Session();
    $id_ingreso = $_POST["id_ingreso"];
    $qrtext = $_POST["qrtext"];
    $id_usuario = $_POST["id_usuario"];
    $id_bodega = $_POST["id_bodega"];
    $model->desbloquearingresoalmacen($id_ingreso,$qrtext,$id_usuario,$id_bodega);
    $respuesta = $model->respuesta;
    $mensaje = $model->mensaje;
}
if ($_POST['Op'] == "verificarembalaje") {
    $model = new Session();
    $id_ingreso = $_POST["id_ingreso"];
    $qrtext = $_POST["qrtext"];
    $id_usuario = $_POST["id_usuario"];
    $id_bodega = $_POST["id_bodega"];
    $id_bodega = $_POST["id_bodega"];
    $model->verificarembalaje($id_ingreso,$qrtext,$id_usuario,$id_bodega);
    $respuesta = $model->respuesta;
    $mensaje = $model->mensaje;
    if($respuesta == "GOOD"){
        $filas = $model->listado;
        $ContenidoHTML = [];
        $ContenidoHTML[0][0] = $filas["id"];
        $ContenidoHTML[0][1] = $filas["total_estiba"];
        $ContenidoHTML[0][2] = $filas["cantidad_grupo"]; 
        $ContenidoHTML[0][3] = $filas["material"];     
    }
    
}
if ($_POST['Op'] == "completaralmacen") {
    $model = new Session();
    $id_ingreso = $_POST["id_ingreso"];
    $qr_posicion = $_POST["qr_posicion"];
    $qr_embalaje = $_POST["qr_embalaje"];
    $id_usuario = $_POST["id_usuario"];
    $id_bodega = $_POST["id_bodega"];
    $model->completaralmacen($id_ingreso,$qr_posicion,$qr_embalaje,$id_usuario,$id_bodega);
    $respuesta = $model->respuesta;
    $mensaje = $model->mensaje;
}
if ($_POST['Op'] == "terminaralmacen") {
    $model = new Session();
    $id_ingreso = $_POST["id_ingreso"];
    $id_usuario = $_POST["id_usuario"];
    $id_bodega = $_POST["id_bodega"];
    $model->terminaralmacen($id_ingreso,$id_usuario,$id_bodega);
    $respuesta = $model->pass;
    $mensaje = $model->mensaje;
}

if ($_POST['Op'] == "ObtenerlistadoSalidas") {
    $model = new Session();
    $id_bodega = $_POST["id_bodega"];
    $model->ObtenerlistadoSalidas($id_bodega);
    $respuesta = $model->respuesta;
        if ($respuesta == "GOOD") {
        $filas = $model->listado;
        if(count($filas)>0){
            $ContenidoHTML = [];
            $x = 0;
            $mensaje = $model->mensaje;
            foreach ($filas as $fila) {
                $ContenidoHTML[$x][0] = $fila["id"];
                $ContenidoHTML[$x][1] = $fila["numero_salida"];
                $ContenidoHTML[$x][2] = $fila["doc_conductor"];
                $ContenidoHTML[$x][3] = utf8_encode($fila["nom_conductor"]);
                $ContenidoHTML[$x][4] = $fila["placa"];
                $ContenidoHTML[$x][5] = $fila["precinto"];
                $ContenidoHTML[$x][6] = $fila["estado"];
                $ContenidoHTML[$x][7] = $fila["esc"];
                $ContenidoHTML[$x][8] = $fila["tot"];
                $ContenidoHTML[$x][9] = utf8_encode($fila["destino"]);
                $ContenidoHTML[$x][10] = date('Y-m-d', $fila["numero_salida"]);
                $x++;
            }
        }
        else{
            $respuesta = "BAD";
        }
    }
}
if ($_POST['Op'] == "terminaralistamiento") {
    $model = new Session();
    $id_salida = $_POST["id_ingreso"];
    $id_usuario = $_POST["id_usuario"];
    $id_bodega = $_POST["id_bodega"];
    $model->terminaralistamiento($id_salida,$id_usuario,$id_bodega);
    $respuesta = $model->pass;
    $mensaje = $model->mensaje;
}
if ($_POST['Op'] == "alistarmercancia") {
    $model = new Session();
    $id_salida = $_POST["id_ingreso"];
    $qrtext = $_POST["qrtext"];
    $id_usuario = $_POST["id_usuario"];
    $id_bodega = $_POST["id_bodega"];
    $model->alistarmercancia($id_salida,$qrtext,$id_usuario,$id_bodega);
    $respuesta = $model->respuesta;
    $mensaje = $model->mensaje;
}
if ($_POST['Op'] == "desbloquearalistamiento") {
    $model = new Session();
    $id_salida = $_POST["id_ingreso"];
    $qrtext = $_POST["qrtext"];
    $id_usuario = $_POST["id_usuario"];
    $id_bodega = $_POST["id_bodega"];
    $model->desbloquearalistamiento($id_salida,$qrtext,$id_usuario,$id_bodega);
    $respuesta = $model->respuesta;
    $mensaje = $model->mensaje;
}

if ($_POST['Op'] == "ObtenerSalidasCargue") {
    $model = new Session();
    $id_bodega = $_POST["id_bodega"];
    $model->ObtenerSalidasCargue($id_bodega);
    $respuesta = $model->respuesta;
        if ($respuesta == "GOOD") {
        $filas = $model->listado;
        if (count($filas) > 0){
            $ContenidoHTML = [];
            $x = 0;
            $mensaje = $model->mensaje;
            foreach ($filas as $fila) {
                $ContenidoHTML[$x][0] = $fila["id"];
                $ContenidoHTML[$x][1] = $fila["numero_salida"];
                $ContenidoHTML[$x][2] = $fila["doc_conductor"];
                $ContenidoHTML[$x][3] = utf8_encode($fila["nom_conductor"]);
                $ContenidoHTML[$x][4] = $fila["placa"];
                $ContenidoHTML[$x][5] = $fila["precinto"];
                $ContenidoHTML[$x][6] = $fila["estado"];
                $ContenidoHTML[$x][7] = utf8_encode($fila["destino"]);
                $ContenidoHTML[$x][8] = $fila["esc"];
                $ContenidoHTML[$x][9] = $fila["tot"];
                $ContenidoHTML[$x][10] = date('Y-m-d', $fila["numero_salida"]);
                $x++;
            }
        }
        else {
            $respuesta = "BAD";
        }
    }
}
if ($_POST['Op'] == "terminarsalidas") {
    $model = new Session();
    $id_salida = $_POST["id_ingreso"];
    $id_usuario = $_POST["id_usuario"];
    $id_bodega = $_POST["id_bodega"];
    $model->terminarsalidas($id_salida, $id_usuario,$id_bodega);
    $respuesta = $model->pass;
    $mensaje = $model->mensaje;
}
if ($_POST['Op'] == "sacarmercancia") {
    $model = new Session();
    $id_salida = $_POST["id_ingreso"];
    $qrtext = $_POST["qrtext"];
    $id_usuario = $_POST["id_usuario"];
    $id_bodega = $_POST["id_bodega"];
    $model->sacarmercancia($id_salida,$qrtext,$id_usuario,$id_bodega);
    $respuesta = $model->respuesta;
    $mensaje = $model->mensaje;
}
if ($_POST['Op'] == "desbloquearsalida") {
    $model = new Session();
    $id_salida = $_POST["id_ingreso"];
    $qrtext = $_POST["qrtext"];
    $id_usuario = $_POST["id_usuario"];
    $id_bodega = $_POST["id_bodega"];
    $model->desbloquearsalida($id_salida,$qrtext,$id_usuario,$id_bodega);
    $respuesta = $model->respuesta;
    $mensaje = $model->mensaje;
}
if ($_POST['Op'] == "buscartraslado") {
    $model = new Session();
    $id_salida = $_POST["id_ingreso"];
    $id_usuario = $_POST["id_usuario"];
    $id_bodega = $_POST["id_bodega"];
    $model->buscartraslado($id_salida,$id_usuario,$id_bodega);
    $respuesta = $model->respuesta;
    $mensaje = $model->mensaje;
}
if ($_POST['Op'] == "completartraslado") {
    $model = new Session();
    $id_traslado = $_POST["id_traslado"];
    $qrtext = $_POST["qrtext"];
    $id_usuario = $_POST["id_usuario"];
    $id_bodega = $_POST["id_bodega"];
    $model->completartraslado($id_traslado,$qrtext,$id_usuario,$id_bodega);
    $respuesta = $model->respuesta;
    $mensaje = $model->mensaje;
}

if ($_POST['Op'] == "verificarembalajetraslados") {
    $model = new Session();
    $id_traslado = $_POST["id_traslado"];
    $qrtext = $_POST["qrtext"];
    $id_usuario = $_POST["id_usuario"];
    $model->verificarembalajetraslados($id_traslado,$qrtext,$id_usuario);
    $respuesta = $model->respuesta;
    $mensaje = $model->mensaje;
}
if ($_POST['Op'] == "verificarposiciontraslado") {
    $model = new Session();
    $qrtext = $_POST["qrtext"];
    $id_usuario = $_POST["id_usuario"];
    $id_salida = $_POST["id_ingreso"];
    $model->verificarposiciontraslado($id_salida,$qrtext,$id_usuario);
        $respuesta = $model->respuesta;
        if ($respuesta == "GOOD") {
            $filas = $model->listado;
            $ContenidoHTML=[];
            $ContenidoHTML[0][0] = $filas["id"];
            $ContenidoHTML[0][1] = $filas["linea"];
            $ContenidoHTML[0][2] = $filas["columna"];
            $ContenidoHTML[0][3] = $filas["nivel"];
            $ContenidoHTML[0][4] = $filas["qr_posicion"];     
        }
}
if ($_POST['Op'] == "ObtenerListaTraslados") {
    $model = new Session();
    $id_bodega = $_POST["id_bodega"];
    $model->ObtenerListaTraslados($id_bodega);
    $respuesta = $model->respuesta;
        if ($respuesta == "GOOD") {
        $filas = $model->listado;
        if (count($filas) > 0){
            $ContenidoHTML = [];
            $x = 0;
            $mensaje = $model->mensaje;
            foreach ($filas as $fila) {
                    $ContenidoHTML[$x][0] = $fila["id_traslado"];
                    $ContenidoHTML[$x][1] = $fila["lote"];
                    $ContenidoHTML[$x][2] = $fila["codigo"];
                    $ContenidoHTML[$x][3] = $fila["Existencias"];
                    $ContenidoHTML[$x][4] = $fila["Provenientes"];
                    $ContenidoHTML[$x][5] = $fila["fecha_hora"];
                    $ContenidoHTML[$x][6] = $fila["estado"];
                    $ContenidoHTML[$x][7] = $fila["tipo_movimiento"];
                    $ContenidoHTML[$x][8] = $fila["ternaorigen"];
                    $ContenidoHTML[$x][9] = $fila["ternadestino"];
                    $ContenidoHTML[$x][10] = $fila["origen"];
                    $ContenidoHTML[$x][11] = $fila["destino"];
                    $ContenidoHTML[$x][12] = $fila["descripcion"];
                    $x++;
            }
        }
        else{
            $respuesta = "BAD";
        }
    }
}

if ($_POST['Op'] == "desbloqueartraslado") {
    $model = new Session();
    $id_traslado = $_POST["id_traslado"];
    $qrtext = $_POST["qrtext"];
    $id_usuario = $_POST["id_usuario"];
    $model->desbloqueartraslado($id_traslado,$qrtext,$id_usuario);
    $respuesta = $model->respuesta;
    $mensaje = $model->mensaje;
}

if ($_POST['Op'] == "verificarposicionsaliente") {
    $model = new Session();
    $qrtext = $_POST["qrtext"];
    $id_usuario = $_POST["id_usuario"];
    $id_traslado = $_POST["id_traslado"];
    $model->verificarposicionsaliente($id_traslado,$qrtext,$id_usuario);
        $respuesta = $model->respuesta;
        if ($respuesta == "GOOD") {
            $filas = $model->listado;
            $ContenidoHTML=[];
            $ContenidoHTML[0][0] = $filas["id"];
            $ContenidoHTML[0][1] = $filas["linea"];
            $ContenidoHTML[0][2] = $filas["columna"];
            $ContenidoHTML[0][3] = $filas["nivel"];
            $ContenidoHTML[0][4] = $filas["qr_posicion"];     
        }
}
if ($_POST['Op'] == "ObtenerlistaEstibasAlmacen") {
    $model = new Session();
    $id_ingreso = $_POST["id_ingreso"];
    $model->ObtenerlistaEstibasAlmacen($id_ingreso);
    $respuesta = $model->respuesta;
        if ($respuesta == "GOOD") {
        $filas = $model->listado;
        $ContenidoHTML = [];
        $x = 0;
        $mensaje = $model->mensaje;
        foreach ($filas as $fila) {
                $ContenidoHTML[$x][0] = $fila["id"];
                $ContenidoHTML[$x][1] = $fila["lote"];
                $ContenidoHTML[$x][2] = $fila["codigo"];
                $ContenidoHTML[$x][3] = $fila["descripcion"];
                $ContenidoHTML[$x][4] = $fila["cantidad"];
                $ContenidoHTML[$x][5] = $fila["estado"];
                $ContenidoHTML[$x][6] = $fila["ubicacion"];
                $x++;
        }
    }
}

if ($_POST['Op'] == "ObtenerlistaEstibasEntradas") {
    $model = new Session();
    $id_ingreso = $_POST["id_ingreso"];
    $model->ObtenerlistaEstibasEntradas($id_ingreso);
    $respuesta = $model->respuesta;
        if ($respuesta == "GOOD") {
        $filas = $model->listado;
        $ContenidoHTML = [];
        $x = 0;
        $mensaje = $model->mensaje;
        foreach ($filas as $fila) {
                $ContenidoHTML[$x][0] = $fila["id"];
                $ContenidoHTML[$x][1] = $fila["lote"];
                $ContenidoHTML[$x][2] = $fila["codigo"];
                $ContenidoHTML[$x][3] = $fila["descripcion"];
                $ContenidoHTML[$x][4] = $fila["cantidad"];
                $ContenidoHTML[$x][5] = $fila["estado"];
                $x++;
        }
    }
}
if ($_POST['Op'] == "ObtenerlistaEstibasAlistamiento") {
    $model = new Session();
    $id_salida = $_POST["id_salida"];
    $model->ObtenerlistaEstibasAlistamiento($id_salida);
    $respuesta = $model->respuesta;
        if ($respuesta == "GOOD") {
        $filas = $model->listado;
        $ContenidoHTML = [];
        $x = 0;
        $mensaje = $model->mensaje;
        foreach ($filas as $fila) {
                $ContenidoHTML[$x][0] = $fila["id"];
                $ContenidoHTML[$x][1] = $fila["lote"];
                $ContenidoHTML[$x][2] = $fila["codigo"];
                $ContenidoHTML[$x][3] = $fila["descripcion"];
                $ContenidoHTML[$x][4] = $fila["cantidad"];
                $ContenidoHTML[$x][5] = $fila["estado"];
                $ContenidoHTML[$x][6] = $fila["ubicacion"];
                $x++;
        }
    }
}

if ($_POST['Op'] == "ObtenerlistaEstibasSalidas") {
    $model = new Session();
    $id_salida = $_POST["id_salida"];
    $model->ObtenerlistaEstibasSalidas($id_salida);
    $respuesta = $model->respuesta;
        if ($respuesta == "GOOD") {
        $filas = $model->listado;
        $ContenidoHTML = [];
        $x = 0;
        $mensaje = $model->mensaje;
        foreach ($filas as $fila) {
                $ContenidoHTML[$x][0] = $fila["id"];
                $ContenidoHTML[$x][1] = $fila["lote"];
                $ContenidoHTML[$x][2] = $fila["codigo"];
                $ContenidoHTML[$x][3] = $fila["descripcion"];
                $ContenidoHTML[$x][4] = $fila["cantidad"];
                $ContenidoHTML[$x][5] = $fila["estado"];
                $x++;
        }
    }
}

if ($_POST['Op'] == "Obtenerubicaciones") {
    $model = new Session();
    $id_bodega = $_POST["id_bodega"];
    $model->Obtenerubicaciones($id_bodega);
    $respuesta = $model->respuesta;
        if ($respuesta == "GOOD") {
        $filas = $model->listado;
        if (count($filas) > 0){
            $ContenidoHTML = [];
            $x = 0;
            $mensaje = $model->mensaje;
            foreach ($filas as $fila) {
                    $ContenidoHTML[$x][0] = $fila["id_ubicacion"];
                    $ContenidoHTML[$x][1] = $fila["UBICACION"];
                    $ContenidoHTML[$x][2] = $fila["codigo"];
                    $ContenidoHTML[$x][3] = $fila["descripcion"];
                    $ContenidoHTML[$x][4] = $fila["cantidad_grupo"];
                    $ContenidoHTML[$x][5] = $fila["linea"];
                    $ContenidoHTML[$x][6] = $fila["columna"];
                    $ContenidoHTML[$x][7] = $fila["nivel"];
                    $ContenidoHTML[$x][8] = $fila["Existencias"];
                    $ContenidoHTML[$x][9] = $fila["num_estibas"];
                    $x++;
            }
        }
        else{
            $respuesta = "BAD";
        }
    }
}
if ($_POST['Op'] == "Obtenerlistaestibasubicaciones") {
    $model = new Session();
    $id_ubicacion= $_POST["id_ubicacion"];
    $id_bodega = $_POST["id_bodega"];
    $model->Obtenerlistaestibasubicaciones($id_ubicacion ,$id_bodega);
    $respuesta = $model->respuesta;
        if ($respuesta == "GOOD") {
        $filas = $model->listado;
        if (count($filas) > 0){
            $ContenidoHTML = [];
            $x = 0;
            $mensaje = $model->mensaje;
            foreach ($filas as $fila) {
                    $ContenidoHTML[$x][0] = $fila["id"];
                    $ContenidoHTML[$x][1] = $fila["lote"];
                    $ContenidoHTML[$x][2] = $fila["cantidad_grupo"];
                    $ContenidoHTML[$x][3] = $fila["DISPONIBLES"];
                    $x++;
            }
        }
        else{
            $respuesta = "BAD";
        }
    }
}
if ($_POST['Op'] == "verificarubicacion") {
    $model = new Session();
    $qr_posicion= $_POST["qrtext"];
    $id_bodega = $_POST["id_bodega"];
    $model->verificarubicacion($qr_posicion,$id_bodega);
    $respuesta = $model->respuesta;
        if ($respuesta == "GOOD") {
        $filas = $model->listado;
        if (count($filas) > 0){
            $ContenidoHTML = [];
            $x = 0;
            $mensaje = $model->mensaje;
            foreach ($filas as $fila) {
                    $ContenidoHTML[$x][0] = $fila["id_ubicacion"];
                    $ContenidoHTML[$x][1] = $fila["UBICACION"];
                    $ContenidoHTML[$x][2] = $fila["codigo"];
                    $ContenidoHTML[$x][3] = $fila["descripcion"];
                    $ContenidoHTML[$x][4] = $fila["cantidad_grupo"];
                    $ContenidoHTML[$x][5] = $fila["linea"];
                    $ContenidoHTML[$x][6] = $fila["columna"];
                    $ContenidoHTML[$x][7] = $fila["nivel"];
                    $ContenidoHTML[$x][8] = $fila["Existencias"];
                    $ContenidoHTML[$x][9] = $fila["num_estibas"];
                    $x++;
            }
        }
        else{
            $respuesta = "BAD";
        }
    }
}
if ($_POST['Op'] == "liberarubicacion") {
    $model = new Session();
    $qr_posicion= $_POST["qrtext"];
    $id_usuario = $_POST["id_usuario"];
    $id_bodega = $_POST["id_bodega"];
    $model->liberarubicacion($qr_posicion,$id_usuario,$id_bodega);
    $respuesta = $model->respuesta;
    $mensaje = $model->mensaje;   
}
if ($_POST['Op'] == "obtenerbodegas") {
    $model = new Session();
    $model->obtenerbodegas();
    $respuesta = $model->respuesta;
        if ($respuesta == "GOOD") {
        $filas = $model->listado;
        if (count($filas) > 0){
            $ContenidoHTML = [];
            $x = 0;
            $mensaje = $model->mensaje;
            foreach ($filas as $fila) {
                    $ContenidoHTML[$x][0] = $fila["id"];
                    $ContenidoHTML[$x][1] = $fila["nombre"];
                    $x++;
            }
        }
        else{
            $respuesta = "BAD";
        }
    }
}
$salidaJSON = array("respuesta" => $respuesta, "mensaje" => $mensaje, "contenido" => $ContenidoHTML);
echo json_encode($salidaJSON);
?> 