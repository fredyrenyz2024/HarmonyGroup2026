<?php
include_once 'sec_ajax.php';
include "../models/Trafico.php";
// include "../models/emailtrafico.php";
// include "../models/email_automatizar.php";

if (isset($_REQUEST["accion"])) {
    $accion = $_REQUEST['accion'];
} else {
    $data = json_decode(file_get_contents('php://input'), true);
    if ($data) {
        $accion = $data['accion'];
    } else {
        echo "No se recibieron datos válidos.";
    }
}

// $accion = $_REQUEST['accion'];
switch ($accion) {
        //RUTAS
    case 'insertar_ruta':
        echo insertar_ruta();
        break;

    case 'update_ruta':
        echo update_ruta();
        break;

        //PLAN DE RUTA
    case 'crear_plan':
        echo crear_plan();
        break;

    case 'update_plan':
        echo update_plan();
        break;

    case 'agregar_punto':
        echo agregar_punto();
        break;

        //INCIO DE RUTA
    case 'crear_inicio':
        echo crear_inicio();
        break;

        //SEGUIMIENTO RUTA
    case 'crear_seguimiento':
        echo crear_seguimiento();
        break;

    case 'crear_estado_seguimiento':
        echo crear_estado_seguimiento();
        break;

    case 'crear_gestion':
        echo crear_gestion();
        // echo "LLEGO AQUI NO MEFRIEGUE";
        // exit();
        break;

    case 'crear_gestionestado':
        echo crear_gestionestado();
        break;

        //GRUPO

    case 'insertar_grupo':
        echo insertar_grupo();
        break;

    case 'insertar_contactos':
        echo insertar_contactos();
        break;

    case 'actualizar_grupo':
        echo actualizar_grupo();
        break;

    // case 'enviar_correo':
    //     echo enviar_correo();
    //     break;

    // case 'enviar_correo_automatico':
    //     echo enviar_correo_automatico();
    //     break;
    default:
        echo "Acción no válida";
        break;
}

function insertar_ruta()
{
    $vehic = new Trafico();
    return json_encode($vehic->insertar_ruta(), JSON_UNESCAPED_UNICODE);
}

function update_ruta()
{
    $vehic = new Trafico();
    return json_encode($vehic->update_ruta(), JSON_UNESCAPED_UNICODE);
}

//PLAN RUTAS
function crear_plan()
{
    $vehic = new Trafico();
    return json_encode($vehic->crear_plan(), JSON_UNESCAPED_UNICODE);
}

function update_plan()
{
    $vehic = new Trafico();
    return json_encode($vehic->update_plan(), JSON_UNESCAPED_UNICODE);
}

function agregar_punto()
{
    $vehic = new Trafico();
    return json_encode($vehic->agregar_punto(), JSON_UNESCAPED_UNICODE);
}

//INCIO RUTA

function crear_inicio()
{
    $vehic = new Trafico();
    return json_encode($vehic->crear_inicio(), JSON_UNESCAPED_UNICODE);
}

//SEGUIMEINTO RUTA
function crear_seguimiento()
{
    $vehic = new Trafico();
    return json_encode($vehic->crear_seguimiento(), JSON_UNESCAPED_UNICODE);
}

function crear_estado_seguimiento()
{
    $vehic = new Trafico();
    return json_encode($vehic->crear_estado_seguimiento(), JSON_UNESCAPED_UNICODE);
}

function crear_gestion()
{
    $vehic = new Trafico();
    return json_encode($vehic->crear_gestion(), JSON_UNESCAPED_UNICODE);
}

function crear_gestionestado()
{
    $vehic = new Trafico();
    return json_encode($vehic->crear_gestionestado(), JSON_UNESCAPED_UNICODE);
}

function insertar_grupo()
{
    $vehic = new Trafico();
    return json_encode($vehic->insertar_grupo(), JSON_UNESCAPED_UNICODE);
}

function insertar_contactos()
{
    $vehic = new Trafico();
    return json_encode($vehic->insertar_contactos(), JSON_UNESCAPED_UNICODE);
}

function actualizar_grupo()
{
    $vehic = new Trafico();
    return json_encode($vehic->actualizar_grupo(), JSON_UNESCAPED_UNICODE);
}

// function enviar_correo()
// {
//     $vehic = new emailtrafico();
//     return json_encode($vehic->enviar_correo(), JSON_UNESCAPED_UNICODE);
// }

// function enviar_correo_automatico()
// {
//     $vehic = new emailautomatico();
//     return json_encode($vehic->enviar_correo_automatico(), JSON_UNESCAPED_UNICODE);
// }
