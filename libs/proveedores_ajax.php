<?php
include_once 'sec_ajax.php';
include "../models/Proveedores.php";

$accion = $_REQUEST['accion'];

switch ($accion) {
    case 'crearProveedor':
        echo crearProveedor();
        break;

    case 'crearContactos':
        echo crearContactos();
        break;

    case 'crearContactos2':
        echo crearContactos2();
        break;

    case 'CrearTipoProveedor':
        echo CrearTipoProveedor();
        break;

    case 'crearContactostp':
        echo crearContactostp();
        break;

    case 'verProveedor':
        echo verProveedor();
        break;
    case 'verProveedorDoc':
        echo verProveedorDoc();
        break;
    case 'editarProveedornew':
        echo editarProveedornew();
        break;

    case 'editarsolo_Proveedor':
        echo editarsolo_Proveedor();
        break;

    case 'editarProveedor':
        echo editarProveedor();
        break;
    case 'inactivarProveedor':
        echo inactivarProveedor();
        break;
    case 'activarProveedor':
        echo activarProveedor();
        break;
    case 'cargarmunicipios':
        echo cargarmunicipios();
        break;
    case 'obtenerdatosmunicipio':
        echo obtenerdatosmunicipio();
        break;

    case 'TraerRefeCondu':
        echo TraerRefeCondu();
        break;

    case 'TraerName':
        echo TraerName();
        break;

}
function crearProveedor()
{
    $vehic = new Proveedores();
    return json_encode($vehic->crearProveedor(), JSON_UNESCAPED_UNICODE);
}

function crearContactos()
{
    $vehic = new Proveedores();
    return json_encode($vehic->crearContactos(), JSON_UNESCAPED_UNICODE);
}

function crearContactos2()
{
    $vehic = new Proveedores();
    return json_encode($vehic->crearContactos2(), JSON_UNESCAPED_UNICODE);
}

function CrearTipoProveedor()
{
    $vehic = new Proveedores();
    return json_encode($vehic->CrearTipoProveedor(), JSON_UNESCAPED_UNICODE);
}

function crearContactostp()
{
    $vehic = new Proveedores();
    return json_encode($vehic->crearContactostp(), JSON_UNESCAPED_UNICODE);
}

function verProveedor()
{
    $vehic = new Proveedores();
    return json_encode($vehic->verProveedor(), JSON_UNESCAPED_UNICODE);
}
function verProveedorDoc()
{
    $vehic = new Proveedores();
    return json_encode($vehic->verProveedorDoc(), JSON_UNESCAPED_UNICODE);
}

function editarProveedornew()
{
    $vehic = new Proveedores();
    return json_encode($vehic->editarProveedornew(), JSON_UNESCAPED_UNICODE);
}

function editarsolo_Proveedor()
{
    $vehic = new Proveedores();
    return json_encode($vehic->editarsolo_Proveedor(), JSON_UNESCAPED_UNICODE);
}

function editarProveedor()
{
    $vehic = new Proveedores();
    return json_encode($vehic->editarProveedor(), JSON_UNESCAPED_UNICODE);
}
function inactivarProveedor()
{
    $vehic = new Proveedores();
    return json_encode($vehic->inactivarProveedor(), JSON_UNESCAPED_UNICODE);
}
function activarProveedor()
{
    $vehic = new Proveedores();
    return json_encode($vehic->activarProveedor(), JSON_UNESCAPED_UNICODE);
}
function cargarmunicipios()
{
    $vehic = new Proveedores();
    return json_encode($vehic->cargarmunicipios(), JSON_UNESCAPED_UNICODE);
}
function obtenerdatosmunicipio()
{
    $vehic = new Proveedores();
    return json_encode($vehic->obtenerdatosmunicipio(), JSON_UNESCAPED_UNICODE);
}

function TraerRefeCondu()
{
    $vehic = new Proveedores();
    return json_encode($vehic->TraerRefeCondu(), JSON_UNESCAPED_UNICODE);
}

function TraerName()
{
    $vehic = new Proveedores();
    return json_encode($vehic->TraerName(), JSON_UNESCAPED_UNICODE);
}
