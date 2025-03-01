<?php

session_start();
class solicitudesController extends Controller
{
private $_modelo;
private $_update_cargue;
private $cu;

public function __construct()
{
        parent::__construct();
        $this->_modelo = $this->loadModel('solicitudes');
}

public function index()
{
        $solicitudes = $this->loadModel('solicitudes');
        $this->_view->solicitudes = $solicitudes;
        $this->_view->titulo = 'Solicitudes';
        $this->_view->renderizar('index', 'solicitudes');
}

public function vehiculos()
{
        $vehiculos = $this->loadModel('vehiculos');
        $this->_view->vehiculos = $vehiculos;
        $this->_view->titulo = 'Vehículos';
        $this->_view->renderizar('vehiculos', 'solicitudes');
}

public function crear_vehiculos()
{
        $vehiculos = $this->loadModel('vehiculos');
        $this->_view->vehiculos = $vehiculos;
        $this->_view->titulo = 'Crear Vehículos';
        $this->_view->renderizar('crear_vehiculo', 'solicitudes');
}

public function editar_vehiculo()
{
        $vehiculos = $this->loadModel('vehiculos');
        $this->_view->vehiculos = $vehiculos;
        $this->_view->titulo = 'Editar Vehiculo';
        $this->_view->renderizar('editar_vehiculo', 'solicitudes');
}

public function agrupaciones()
{
        $agrupaciones = $this->loadModel('agrupaciones');
        $this->_view->agrupaciones = $agrupaciones;
        $this->_view->titulo = 'Operaciones Pendientes';
        $this->_view->renderizar('agrupaciones', 'solicitudes');
}

public function control_agrupaciones()
{
        $control_agrupaciones = $this->loadModel('agrupaciones');
        $this->_view->control_agrupaciones = $control_agrupaciones;
        $this->_view->titulo = 'Operaciones Pendientes';
        $this->_view->renderizar('control_agrupaciones', 'solicitudes');
}

public function proveedores()
{
        $proveedores = $this->loadModel('proveedores');
        $this->_view->proveedores = $proveedores;
        $this->_view->titulo = 'Proveedores';
        $this->_view->renderizar('proveedores', 'solicitudes');
}

public function crear_proveedores()
{
        $proveedores = $this->loadModel('proveedores');
        $this->_view->proveedores = $proveedores;
        $this->_view->titulo = 'Crear proveedores';
        $this->_view->renderizar('crear_proveedor', 'solicitudes');
}

public function editar_proveedor()
{
        $proveedores = $this->loadModel('proveedores');
        $this->_view->proveedores = $proveedores;
        $this->_view->titulo = 'Editar Proveedor';
        $this->_view->renderizar('editar_proveedor', 'solicitudes');
}


public function trailer()
{
        $trailer = $this->loadModel('trailers');
        $this->_view->trailer = $trailer;
        $this->_view->titulo = 'Trailers';
        $this->_view->renderizar('trailer', 'solicitudes');
}

public function crear_trailer()
{
        $trailer = $this->loadModel('trailers');
        $this->_view->trailer = $trailer;
        $this->_view->titulo = 'Crear railer';
        $this->_view->renderizar('crear_trailer', 'solicitudes');
}
public function editar_trailer()
{
        $trailer = $this->loadModel('trailers');
        $this->_view->trailer = $trailer;
        $this->_view->titulo = 'Editar railer';
        $this->_view->renderizar('editar_trailer', 'solicitudes');
}

public function asignaciones()
{
        $asignaciones = $this->loadModel('asignaciones');
        $this->_view->vehiculos = $asignaciones;
        $this->_view->titulo = 'Vehículos Pendientes';
        $this->_view->renderizar('asignaciones', 'solicitudes');
}

public function control_asignaciones()
{
        $aprobaciones = $this->loadModel('aprobaciones');
        $this->_view->vehiculos = $aprobaciones;
        $this->_view->titulo = 'Control Asignaciones';
        $this->_view->renderizar('control_asignaciones', 'solicitudes');
}

public function aprobaciones()
{
        $aprobaciones = $this->loadModel('aprobaciones');
        $this->_view->vehiculos = $aprobaciones;
        $this->_view->titulo = 'Aprobaciones';
        $this->_view->renderizar('aprobaciones', 'solicitudes');
}

public function calificacion()
{
        $calificacion = $this->loadModel('calificacion');
        $this->_view->vehiculos = $calificacion;
        $this->_view->titulo = 'Calificación';
        $this->_view->renderizar('calificacion', 'solicitudes');
}

public function anticipos()
{
        $solicitudes = $this->loadModel('solicitudes');
        $this->_view->solicitudes = $solicitudes;
        $this->_view->titulo = 'Anticipos';
        $this->_view->renderizar('anticipos', 'solicitudes');
}

public function planillar_vehiculo()
{
        $solicitudes = $this->loadModel('solicitudes');
        $this->_view->solicitudes = $solicitudes;
        $this->_view->titulo = 'Planillar Vehículo';
        $this->_view->renderizar('planillar_vehiculo', 'solicitudes');
}

public function enturnamientos()
{
        $solicitudes = $this->loadModel('solicitudes');
        $this->_view->solicitudes = $solicitudes;
        $this->_view->titulo = 'Enturnamientos App Nexos Conductores';
        $this->_view->renderizar('enturnamientos', 'solicitudes');
}

public function anticipos_excel()
{
        $solicitudes = $this->loadModel('solicitudes');
        $this->_view->solicitudes = $solicitudes;
        $this->_view->titulo = 'Anticipos';
        $this->_view->renderizar('anticipos_excel', 'solicitudes');
}

public function anticipos_excel_todos()
{
        $solicitudes = $this->loadModel('solicitudes');
        $this->_view->solicitudes = $solicitudes;
        $this->_view->titulo = 'Lista Anticipos';
        $this->_view->renderizar('anticipos_excel_todos', 'solicitudes');
}


public function Registro_Cuentas()
{
        $idproveedor = $_POST["idproveedor"];
        $dato_bancario = json_decode($_POST['dato_bancario']);
        $this->cu = $this->_modelo->Insertar_Cuentas(
                $idproveedor,
                $dato_bancario
        );
        echo json_encode($this->cu);
}

public function update_cargue()
{
        $fecha_cargue = $_POST["fecha_cargue"];
        $hora_cargue = $_POST["hora_cargue"];
        $solicitud = $_POST["solicitud"];
        $punto_rem = $_POST["punto_rem"];
        $this->_update_cargue = $this->_modelo->Update_Cargue_solicitud_servicio($fecha_cargue, $hora_cargue, $solicitud, $punto_rem);
        echo json_encode($this->_update_cargue);
}

public function update_descargue()
{
        $fecha_descargue = $_POST["fecha_descargue"];
        $hora_descargue = $_POST["hora_descargue"];
        $solicitud = $_POST["solicitud"];
        $punto_desc = $_POST["punto_desc"];
        $this->_update_cargue = $this->_modelo->Update_Descargue_solicitud_servicio($fecha_descargue, $hora_descargue, $solicitud, $punto_desc);
        echo json_encode($this->_update_cargue);
}

// public function update_cargue()
// {
//         $fecha_cargue = $_POST["fecha_cargue"];
//         $hora_cargue = $_POST["hora_cargue"];
//         $fecha_descargue = $_POST["fecha_descargue"];
//         $hora_descargue = $_POST["hora_descargue"];
//         $solicitud = $_POST["solicitud"];
//         $punto_rem = $_POST["punto_rem"];
//         $punto_des = $_POST["punto_des"];
//         $this->_update_cargue = $this->_modelo->Update_Cargue_solicitud_servicio($fecha_cargue, $hora_cargue, $fecha_descargue, $hora_descargue, $solicitud, $punto_rem, $punto_des);
//         echo json_encode($this->_update_cargue);
// }
}
