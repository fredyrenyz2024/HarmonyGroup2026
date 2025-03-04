<?php

use PhpParser\Node\Stmt\Echo_;

class validacionparametrosController extends Controller
{
    private $_modelo;
    private $vehiculo;
    private $estado;
    private $datos;
    private $solicitudes;
    private $inicio_prefiltro;
    private $solicitud_ser_id;
    private $fecha_cargue_id;
    private $consultda_solicitud_id;
    private $ver_seguridad;
    private $validar_prefiltro;
    private $consulta_estado;
    private $vence;
    private $traer_solicitudes;
    private $enviar_prefiltro;
    private $validar;
    private $solicitudes_operaciones;
    private $vasolicitud_preestudio;
    private $campos_actualizar;
    private $vsolicitud_preestudio;
    private $respusta_seguridad;
    private $validar_placa;
    private $cancela_solicitud;
    private $validar_hv;
    private $validar_hv_new;
    private $crear_estudio;
    private $consulta_referencia;
    private $inicio_estudio_seguridad;
    private $crear_subasta;
    private $ver_estudio_seguridad;
    private $ver_vehiculo;
    private $aprobar_vehiculo;
    private $desaprobar_vehiculo;
    private $ver_conductor;
    private $aprobar_conductor;
    private $desaprobar_conductor;
    private $aprobar_risk;
    private $desaprobar_risk;
    private $r_tipos_estudios;
    private $aprobacion_estudio;
    private $ver_estudio_respuesta_seguridad;
    private $consultar_respuesta_operaciones;
    private $reactivar_estudio;
    private $respuesta_operaciones;
    private $ver_seguridad_nuevo;
    private $ver_datos_actuales_recurso_nuevo;
    private $listar_logs;
    private $guardar_prefiltro_seguridad_nuevo;
    private $respuesta_propietario;
    private $respuesta_trailer;
    private $buscar_vehiculo_itr;
    private $crear_estudio_itr;
    private $subasta_itr;
    private $validar_vigencia_solicitud;
    private $datos_hojas_vida;
    private $listar_responsables_vehiculo;

    public function __construct()
    {
        parent::__construct();
        $this->_modelo = $this->loadModel('validacion_parametro');
    }

    public function index() {}

    public function busqueda_datos_vencimiento()
    {
        $placa_vehiculo = $_POST["placa"];
        $this->datos_hojas_vida = $this->_modelo->buscar_datos_hojas_vida($placa_vehiculo);
        echo json_encode($this->datos_hojas_vida);
    }

    public function busqueda_vehiculo()
    {
        $placa_vehiculo = $_POST["placa"];
        $proceso_itr = $_POST["proceso_itr"];

        if ($proceso_itr == "Si") {
            $this->buscar_vehiculo_itr = $this->_modelo->buscar_vehiculo_itr($placa_vehiculo);
            echo json_encode($this->buscar_vehiculo_itr);
        } else {
            $this->vehiculo = $this->_modelo->buscar_vehiculo($placa_vehiculo);
            echo json_encode($this->vehiculo);
        }
    }

    public function datos_vehiculo()
    {
        $placa_vehiculo = $_POST["placa"];
        $this->vehiculo = $this->_modelo->consulta_vehiculo($placa_vehiculo);
        echo json_encode($this->vehiculo);
    }

    public function Insertar_preestudio_nuevo()
    {
        $placa = $_POST["placa"];
        if ($_POST["trailer"]) {
            $trailer = $_POST["trailer"];
        } else {
            $trailer = 'No aplica';
        }

        $propietario = $_POST["propietario"];
        $docu_pro = $_POST["documento_pro"];
        $tenedor = $_POST["tenedor"];
        $docu_tene = $_POST["documento_tene"];
        $conductor = $_POST["conductor"];
        $docu_condu = $_POST["documento_condu"];
        $web = $_POST["web"];
        $useri = $_POST["user_satelite"];
        $clave = $_POST["clave"];
        $tipologianuevo = $_POST["tipologianuevo"];
        $tipologiahabilte = $_POST["tipologiahabilte"];
        $tipologiaactualice = $_POST["tipologiaactualice"];
        $tipo_operacion = $_POST["tipo_operacion"];
        $fecha = $_POST["fecha"];
        $hora = $_POST["hora"];
        $usuario = $_POST["usuario"];
        $su_sumatorianeto = $_POST["su_sumatorianeto"];
        $total_peso = $_POST["total_peso"];
        $observacion = $_POST["observacion"];
        $tipo_operacion = $_POST["tipo_operacion"];
        // Empresa informacion
        $empre = $_POST["empresa_crear"];
        $ingreso = empty($_POST["fingreso_crear"]) ? null : $_POST["fingreso_crear"];
        $retiro = empty($_POST["fretiro_crear"]) ? null : $_POST["fretiro_crear"];
        $persona = $_POST["contacto_crear"];
        $num = $_POST["numero_crear"];
        $cargo = $_POST["cargo_crear"];
        $anti = empty($_POST["antiguedad_crear"]) ? 0 : $_POST["antiguedad_crear"];
        $index = 0;
        $flete_subasta = $_POST["flete_subasta"];
        $tarifa_subasta = $_POST["tarifa_subasta"];
        $responsable_vehiculo = $_POST["responsable_vehiculo"];
        $empresa_cliente = $_POST["empresa_cliente"];
        // Empresas
        foreach ($empre as $item) {
            ${"empresa_" . $index} = $item;
            $index++;
        }
        // Fecha de ingreso
        $index = 0;
        foreach ($ingreso as $item) {
            ${"ingreso_" . $index} = $item;
            $index++;
        }
        // Fecha de retiro
        $index = 0;
        foreach ($retiro as $item) {
            ${"retiro_" . $index} = $item;
            $index++;
        }
        // Contacto
        $index = 0;
        foreach ($persona as $item) {
            ${"persona_" . $index} = $item;
            $index++;
        }
        // Numero
        $index = 0;
        foreach ($num as $item) {
            ${"numero_" . $index} = $item;
            $index++;
        }
        // Cargo
        $index = 0;
        foreach ($cargo as $item) {
            ${"carg_" . $index} = $item;
            $index++;
        }
        // Atiguedad
        $index = 0;
        foreach ($anti as $item) {
            ${"antiguedad_" . $index} = $item;
            $index++;
        }
        // Recibir la o las solicitudes de servicio
        $solicitudes = $_POST["fserva"];

        // Documentos
        if (isset($_POST["Papel"]) && $_POST["Papel"] != 'false') {
            if ($_POST["Papel"] != 'false') {
                //papeles
                $papel = $_POST["Papel"];
                $papeles = $_FILES["papeles"];
                $archivos = json_decode($_POST['notas']);
            } else {
                $papel = false;
                $papeles = "";
                $archivos = "";
            }
        } else {
            $papel = false;
            $papeles = "";
            $archivos = "";
        }

        /* Validar si los daotos del trailer son obligatorios */
        if ($_POST['propietario_obligatorio']) {
            if ($_POST["trailer"]) {
                $trailer = $_POST["trailer"];
            } else {
                $trailer = 'No aplica';
            }
            $documento_propietario_trailer = $_POST['documento_propietario_trailer'];
            $propietario_trailer = $_POST['propietario_trailer'];
            $tiene_trailer = 'SI';
        } else {
            $trailer = 'No aplica';
            $documento_propietario_trailer = 'No aplica';
            $propietario_trailer = 'No aplica';
            $tiene_trailer = 'no';
        }

        // Proceso Itr
        if (isset($_POST['proceso_itr']) == 'Si') {
            $itr = 'SI';
        } else {
            $itr = 'NO';
        }

        $datos_vehiculo = array(
            'placa_vehiculo' => $placa,
            'placa_trailer' => $trailer,
            'documento_propietario_trailer' => $documento_propietario_trailer,
            'propietario_trailer' => $propietario_trailer,
            // 'placa_trailer' => $trailer,
            'nombre_propietario' => $propietario,
            'documento_propietario' => $docu_pro,
            'nombre_tenedor' => $tenedor,
            'documento_tene' => $docu_tene,
            'nombre_conductor' => $conductor,
            'documento_conductor' => $docu_condu,
            'web_satelital' => $web,
            'usuario_satelital' => $useri,
            'clave_satelital' => $clave,
            'fecha' => $fecha,
            'hora' => $hora,
            'observacion' => $observacion,
            'empre1' => $empresa_0,
            'empre2' => $empresa_1,
            'empre3' => $empresa_2,
            'ingreso1' => $ingreso_0,
            'ingreso2' => $ingreso_1,
            'ingreso3' => $ingreso_2,
            'retiro1' => $retiro_0,
            'retiro2' => $retiro_1,
            'retiro3' => $retiro_2,
            'persona1' => $persona_0,
            'persona2' => $persona_1,
            'persona3' => $persona_2,
            'num1' => $numero_0,
            'num2' => $numero_1,
            'num3' => $numero_2,
            'cargo1' => $carg_0,
            'cargo2' => $carg_1,
            'cargo3' => $carg_2,
            'anti1' => empty($antiguedad_0) ? 0 : $antiguedad_0,
            'anti2' => empty($antiguedad_1) ? 0 : $antiguedad_1,
            'anti3' => empty($antiguedad_2) ? 0 : $antiguedad_2,
            'solicitudes' => $solicitudes,
            'tipo_operacion' => $tipo_operacion,
            'Papel' => $papel,
            'flete_subasta' => $flete_subasta,
            'tarifa_subasta' => $tarifa_subasta,
            'responsable_vehiculo' => $responsable_vehiculo,
            'archivos' => $archivos,
            'papeles' => $papeles,
            'tiene_trailer' => $tiene_trailer,
            'itr' => $itr,
            'usuario' =>  $usuario,
            'empresa_cliente' =>  $empresa_cliente,
        );
        $this->datos = $this->_modelo->Insertar_vehiculo_nuevo($datos_vehiculo);
        echo json_encode($this->datos);
    }

    public function Consultar_Estdo_Coductor()
    {
        $placa = $_POST["placa"];
        $this->estado = $this->_modelo->Estado_Conductor($placa);
        echo json_encode($this->estado);
    }

    public function Consultar_Estdo_Vehiuclo()
    {
        $placa = $_POST["placa"];
        $this->estado = $this->_modelo->Estado_Vehiculo($placa);
        echo json_encode($this->estado);
    }

    // Funciones para la parte de seguridad
    public function Consutar_solicitudes_seguridad()
    {
        $estado = $_POST["estado"];
        $fecha_inicial = $_POST["fecha_inicial"];
        $fecha_final = $_POST["fecha_final"];
        $placa = $_POST["placa"];
        if (isset($_POST["prefiltro_seguridad"])) {
            $operacion = $_POST["prefiltro_seguridad"];
        } else {
            $operacion = $_POST["estudio_seguridad"];
        }
        $datos = [
            "estado" => $estado,
            "fecha_inicial" => $fecha_inicial,
            "fecha_final" => $fecha_final,
            "placa" => $placa,
            "operacion" => $operacion,
        ];
        $this->solicitudes = $this->_modelo->Consultar_solicitudes($datos);
        $datos = $this->solicitudes;
        $json = [];
        if (isset($datos['Estudio_Seguridad'])) {
            $json = [];
            foreach ($datos['respuesta'] as $row) {
                $json[] = array(
                    'id_estudio_c' => $row['id_estudio_c'],
                    'id_estudio' => $row['id_estudio'],
                    'fecha' => $row['fecha'],
                    'hora' => $row['hora'],
                    'placa' => $row['placa'],
                    'operacion' => $row['operacion'],
                    'estado' => $row['estado'],
                    'estado_actual' => $row['estado_actu'],
                    'nombre' => $row['nombre'],
                    'apellido1' => $row['apellido1'],
                    'id_vehiculo' => $row['id_vehiculo'],
                    // 'id_conductor' => $row['id_conductor'],
                    'id_conductor' => $row['numdoc_nexos'],
                    'numero_documento' => $row['numero_documento'],
                    'operacio_ejecutada' => $datos['Estudio_Seguridad'],
                    'estado_prefiltro' => $row['estado_prefiltro'],
                    'itr' => $row['itr'],
                    'observacion_general' => $row['observacion_general'],
                    'estado_creacion' => $row['estado_creacion'],
                );
            }
        } else {
            $json = [];
            foreach ($datos as $row) {
                $json[] = array(
                    'estado' => $row['estado'],
                    'fecha' => $row['fecha'],
                    'hora' => $row['hora'],
                    'operacion' => $row['operacion'],
                    'esoli' => $row['esoli'],
                    'idv' => $row['idv'],
                    'placa' => $row['placa'],
                    'id_preestudio' => $row['id_preestudio'],
                    // 'soli_estudio' => $row['soli_estudio'],
                    'estado_actual' => $row['estado_actual'],
                    'itr' => $row['itr'],
                );
            }
        }
        echo json_encode($json);
    }

    // Iniciar Prefilto de vehiculo nuevo
    public function Validar_solicitud_agrupacion()
    {
        $solicitud_servicio_id = $_POST["solicitud_servicio_id"];
        $this->solicitud_ser_id = $this->_modelo->Traer_preestudio_servicio_agrupacion($solicitud_servicio_id);
        echo json_encode($this->solicitud_ser_id);
    }

    public function Consultar_fecha_cargue()
    {
        $agrupacion_id = $_POST["id_agrupacion"];
        $solicitud_servicio_id = $_POST["solicitud_servicio_id"];
        $this->fecha_cargue_id = $this->_modelo->Consulta_fecha_cargue($agrupacion_id, $solicitud_servicio_id);
        echo json_encode($this->fecha_cargue_id);
    }

    public function Consulta_solicitudes_anidadas()
    {
        $id_agrupacion = $_POST["id_agrupacion"];
        $num_servicio = $_POST["num_servicio"];
        $solicitudes_num = array(
            "id_agrupacion" => $id_agrupacion,
            "num_servicio" => $num_servicio,
        );
        $this->consultda_solicitud_id = $this->_modelo->Consultar_solicitudes_anidadas($solicitudes_num);
        echo json_encode($this->consultda_solicitud_id);
    }

    // Funciones para ver es estdudio de seguridad
    public function Ver_Seguridad()
    {
        $preestudio = $_POST["preestudio"];
        $solicitud = $_POST["solicitud"];
        $datos = array(
            "preestudio" => $preestudio,
            "solicitud" => $solicitud,
        );
        $this->ver_seguridad = $this->_modelo->Ver_seguridad($datos);
        echo json_encode($this->ver_seguridad);
    }

    /* Funcion para listar los nuevos recursos para prefiltro y crear hojas de vida */
    public function verificar_datos_nuevos()
    {
        $solicitud = $_POST['solicitud_id'];
        $this->ver_seguridad_nuevo = $this->_modelo->Ver_datos_nuevos_prefiltro($solicitud);
        echo json_encode($this->ver_seguridad_nuevo);
    }

    public function verificar_datos_actuales()
    {
        $placa = $_POST['placa_consulta'];
        $this->ver_datos_actuales_recurso_nuevo = $this->_modelo->Ver_datos_actuales_nuevos_prefiltro($placa);
        echo json_encode($this->ver_datos_actuales_recurso_nuevo);
    }

    public function listar_logs_prefiltro_nuevo()
    {
        $placa = $_POST['placa_consulta'];
        $solicitud_id = $_POST['solicitud_id'];
        $this->listar_logs = $this->_modelo->ver_logs_prefiltro_nuevo($placa, $solicitud_id);
        echo json_encode($this->listar_logs);
    }

    /* Funcion para gaurdar el prefiltro */
    public function Guardar_prefiltro_nuevo()
    {
        $solicitud = $_POST['solicitud_id'];
        $estado = $_POST['estado'];
        $observacion = $_POST['observacion'];
        $placa = $_POST['placa'];
        // echo $solicitud_id;
        $this->guardar_prefiltro_seguridad_nuevo = $this->_modelo->guardar_datos_nuevos_prefiltro($solicitud, $estado, $observacion, $placa);
        echo json_encode($this->guardar_prefiltro_seguridad_nuevo);
    }

    // Validar inicio de prefiltro
    public function Validar_inicio_prefiltro()
    {
        $solicitud_id = $_POST["solicitud_id"];
        $this->inicio_prefiltro = $this->_modelo->Iniciar_prefiltro($solicitud_id);
        echo json_encode($this->inicio_prefiltro);
    }

    public function Validar_prefriltro()
    {
        $solicitud_id = $_POST["solicitud_id"];
        // $preestudio_id = $_POST["preestudio_id"];
        $this->validar_prefiltro = $this->_modelo->validar_prefiltro($solicitud_id);
        echo json_encode($this->validar_prefiltro);
    }

    public function Traer_preestudio()
    {
        $solicitud_id = $_POST["solicitud_id"];
    }

    public function buscar_estado_prefiltro()
    {
        $placa = $_POST["placa"];
        $this->consulta_estado = $this->_modelo->Consulta_estado_prefiltro($placa);
        echo json_encode($this->consulta_estado);
    }

    public function vencimientoprefiltro()
    {
        $this->vence = $this->_modelo->vencer_prefiltro();
        echo json_encode($this->vence);
    }

    public function Consultar_Solicitudes()
    {
        $solicitud = $_POST['solicitud_id'];
        $this->traer_solicitudes = $this->_modelo->traer_solicitudes($solicitud);
        echo json_encode($this->traer_solicitudes);
    }

    public function Enviar_Prefiltro()
    {
        $solicitud = $_POST["solicitud"];
        $estado = $_POST["estado"];
        // $causalidad = $_POST["causalidad_seguridad"];
        $proceso = $_POST["proceso"];
        // $observacion = $_POST["observacion"];

        $causalidad = "";

        if ($_POST["observacion"]) {
            $observacion = $_POST["observacion"];
        } else {
            $observacion = '';
        }

        $datos = array(
            "solicitud" => $solicitud,
            "estado" => $estado,
            "proceso" => $proceso,
            "causalidad" => $causalidad,
            "observacion" => $observacion,
        );
        $this->enviar_prefiltro = $this->_modelo->Guardar_prefiltro($datos);
        echo json_encode($this->enviar_prefiltro);
    }

    // Funiones e operacio para poder cgrar la hoja de vida
    public function validar_token()
    {
        $token = $_POST["token"];
        $placa = $_POST["placa"];
        $propietario = $_POST["propietario"];
        $tenedor = $_POST["tenedor"];
        $conductor = $_POST["conductor"];
        $numsoli = $_POST["numsoli"];
        $datos_token = array(
            "token" => $token,
            "placa" => $placa,
            "propietario" => $propietario,
            "conductor" => $conductor,
            "tenedor" => $tenedor,
            "numsoli" => $numsoli,
        );
        $this->validar = $this->_modelo->Validar_Token_seguridad($datos_token);
        echo json_encode($this->validar);
    }

    // Solicitidues de prefiltro desde el area de operacioes
    public function Consultar_solicitudes_operaciones()
    {
        $estado = $_POST["estado"];
        $fecha_inicial = $_POST["fecha_inicial"];
        $fecha_final = $_POST["fecha_final"];
        if (isset($_POST["prefiltro_seguridad"])) {
            $operacion = $_POST["prefiltro_seguridad"];
        } else {
            $operacion = $_POST["estudio_seguridad"];
        }
        $datos = [
            "estado" => $estado,
            "fecha_inicial" => $fecha_inicial,
            "fecha_final" => $fecha_final,
            "operacion" => $operacion,
        ];
        $this->solicitudes_operaciones = $this->_modelo->Consultar_solicitudes_operaciones($datos);
        $datos = $this->solicitudes_operaciones;
        if (isset($datos['Estudio_Seguridad'])) {
            $json = [];
            foreach ($datos['respuesta'] as $row) {
                $json[] = array(
                    'id_estudio_c' => $row['id_estudio_c'],
                    'id_estudio' => $row['id_estudio'],
                    'fecha' => $row['fecha'],
                    'hora' => $row['hora'],
                    'placa' => $row['placa'],
                    'operacion' => $row['operacion'],
                    'estado' => $row['estado'],
                    'estado_actual' => $row['estado_actu'],
                    'nombre' => $row['nombre'],
                    'apellido1' => $row['apellido1'],
                    'operacio_ejecutada' => $datos['Estudio_Seguridad'],
                    'vehiculo_id' => $row['id_vehiculo'],
                    'conductor_id' => $row['id_conductor'],
                    'numero_documento' => $row['numero_documento'],
                    'id_estudio' => $row['id_estudio'],
                    'id_vehiculo' => $row['id_vehiculo'],
                    'id_conductor' => $row['id_conductor'],
                    'observacion' => $row['observacion'],
                    'estado_prefiltro' => $row['estado_prefiltro'],
                    'itr' => $row['itr'],
                    'estado_creacion' => $row['estado_creacion'],
                    'responsable_vehiculo' => $row['responsable_vehiculo'],
                );
            }
        } else {
            $json = [];
            foreach ($datos as $row) {
                $json[] = array(
                    'estado' => $row['estado'],
                    'fecha' => $row['fecha'],
                    'hora' => $row['hora'],
                    'operacion' => $row['operacion'],
                    'esoli' => $row['esoli'],
                    'campo' => $row['campo'],
                    'placa' => $row['placa'],
                    'id_preestudio' => $row['id_preestudio'],
                    'estado_actual' => $row['estado_actual'],
                    'documento_propietario' => $row['documento_propietario'],
                    'documento_tenedor' => $row['documento_tenedor'],
                    'documento_conductor' => $row['documento_conductor'],
                    'existe_estudio' => $row['existe_estudio'],
                    'placa_trailer' => $row['placa_trailer'],
                    'documento_propietario_trailer' => $row['documento_propietario_trailer'],
                    'itr' => $row['itr'],
                    'observacion' => $row['observacion'],
                    'responsable_vehiculo' => $row['responsable_vehiculo'],
                    'usuario_responsable_vehiculo' => $row['usuario_responsable_vehiculo']
                );
            }
        }
        echo json_encode($json);
    }

    public function vsolicitud_preestudio()
    {
        $placa = $_POST['placa'];
        $solicitud = $_POST['solicitud'];
        $this->vsolicitud_preestudio = $this->_modelo->Validar_Solicitud_operaciones($placa, $solicitud);
        echo json_encode($this->vsolicitud_preestudio);
    }

    public function vasolicitud_preestudio()
    {
        $placa = $_POST['placa'];
        $solicitud = $_POST['solicitud'];
        $this->vasolicitud_preestudio = $this->_modelo->Consular_campos_actualizar_operaciones($placa, $solicitud);
        echo json_encode($this->vasolicitud_preestudio);
    }

    public function Documentos_Actualizar()
    {
        $placa = $_POST['placa'];
        $solicitud = $_POST['solicitud'];
        $this->campos_actualizar = $this->_modelo->Consular_documentos_actualizar_operaciones($placa, $solicitud);
        echo json_encode($this->campos_actualizar);
    }

    public function consultar_respuesta_seguridad()
    {
        $placa = $_POST['placa'];
        $solicitud = $_POST['solicitud'];
        $this->respusta_seguridad = $this->_modelo->Consular_respuesta_seguridad_operaciones($placa, $solicitud);
        echo json_encode($this->respusta_seguridad);
    }

    public function Estados_preestudio()
    {
        $placa = $_POST['placa'];
        $conductor = $_POST['conductor'];
        $propietario = $_POST['propietario'];
        $tenedor = $_POST['tenedor'];
        $propietario_trailer = $_POST['propietario_trailer'];
        $trailer = $_POST['trailer'];

        $datos = array(
            "placa" => $placa,
            "conductor" => $conductor,
            "propietario" => $propietario,
            "tenedor" => $tenedor,
            "propietario_trailer" => $propietario_trailer,
            "trailer" => $trailer
        );
        $this->validar_placa = $this->_modelo->Validar_estudio_seguridad_operaciones($datos);
        echo json_encode($this->validar_placa);
    }

    public function Cancelacion_preestudio()
    {
        $numero_pre = $_POST["preestudio"];
        $placa = $_POST["placa"];
        $motivo = $_POST["motivo"];
        $nota = $_POST["anotacion"];
        $accion_actividad = $_POST["accion_actividad"];
        $estudioc = $_POST["estudioc"];
        $vehiculo_cancelar = $_POST["vehiculo_cancelar"];
        $coductor_cancelar = $_POST["coductor_cancelar"];

        $this->cancela_solicitud = $this->_modelo->cancela_preestudio($numero_pre, $placa, $motivo, $nota, $accion_actividad, $estudioc, $vehiculo_cancelar, $coductor_cancelar);
        echo json_encode($this->cancela_solicitud);
    }

    public function validar_hojas_vida()
    {
        $propietario = $_POST["propietario"];
        $tenedor = $_POST["tenedor"];
        $conductor = $_POST["conductor"];
        $placa = $_POST["placa"];
        $propietario_trailer = $_POST["propietario_trailer"];
        $trailer = $_POST["trailer"];

        $datos = array(
            "propietario" => $propietario,
            "tenedor" => $tenedor,
            "conductor" => $conductor,
            "placa" => $placa,
            "propietario_trailer" => $propietario_trailer,
            "trailer" => $trailer,
        );
        $this->validar_hv = $this->_modelo->Validar_hojas_de_vida($datos);
        echo json_encode($this->validar_hv);
    }

    public function validar_hojas_prefiltro_recurso_nuevo()
    {
        $propietario = $_POST["propietario"];
        $poseedor = $_POST["poseedor"];
        $conductor = $_POST["conductor"];
        $Propietario_Trailer = $_POST["Propietario_Trailer"];
        // $placa = $_POST["placa"];
        $estudio = $_POST["estudio"];
        $token = $_POST["token"];
        $estado = $_POST["estado"];

        $datos = array(
            "propietario" => $propietario,
            "tenedor" => $poseedor,
            "conductor" => $conductor,
            "Propietario_Trailer" => $Propietario_Trailer,
            // "placa" => $placa,
            "estudio" => $estudio,
            "token" => $token,
            "estado" => $estado,
        );
        $this->validar_hv_new = $this->_modelo->Validar_hojas_de_vida_nuevo_recurso($datos);
        echo json_encode($this->validar_hv_new);
    }

    public function Crear_estudio_seguridad()
    {
        $placa = $_POST["placa"];
        $idprees = $_POST["idprees"];
        $user = $_POST["user"];
        $fecha = $_POST["fecha"];
        $hora = $_POST["hora"];
        $proceso = $_POST["proceso"];
        $proceso_prefiltro_itr = $_POST["proceso_prefiltro_itr"];
        $observacion_prefiltro = $_POST["observacion_prefiltro"];
        $responsable_vehiculo = $_POST["responsable_vehiculo"];
        $datos = array(
            "placa" => $placa,
            "preestudio" => $idprees,
            "usuario" => $user,
            "fecha" => $fecha,
            "hora" => $hora,
            "proceso" => $proceso,
            "proceso_prefiltro_itr" => $proceso_prefiltro_itr,
            "observacion_prefiltro" => $observacion_prefiltro,
            "responsable_vehiculo" => $responsable_vehiculo,
        );
        $this->crear_estudio = $this->_modelo->Guardar_estudio_seguridad($datos);
        echo json_encode($this->crear_estudio);
    }

    public function Consulta_Preestudio()
    {
        $placa = $_POST["placa"];
        $this->cancela_solicitud = $this->_modelo->Consulta_preestudio($placa);
        echo json_encode($this->cancela_solicitud);
    }

    public function Consulta_Referencia()
    {
        $placa = $_POST["placa"];
        $this->cancela_solicitud = $this->_modelo->Consulta_Referencia($placa);
        echo json_encode($this->cancela_solicitud);
    }

    public function Consulta_Rpersonal()
    {
        $placa = $_POST["placa"];
        $this->consulta_referencia = $this->_modelo->Consulta_Referencia_Personal($placa);
        echo json_encode($this->consulta_referencia);
    }

    public function Insert_estudio()
    {

        //Validar si la placa esta en un estudio por algun error generado al momento de la insercion del estudio de seguridad
        // $validar=$this->Buscar_placa_estudios( $_POST["placa"]);

        $tipo_operacion = $_POST["tipo_operacion"];
        $placa = $_POST["placa"];
        $flete_subasta = $_POST["flete_subasta"];
        $tarifa_subasta = $_POST["tarifa_subasta"];
        $fecha = $_POST["fecha"];
        $hora = $_POST["hora"];
        $usuario = $_POST["usuario"];
        $fserva = $_POST["fserva"];
        $observacion = $_POST["observacion"];
        $empresa_cliente = $_POST["empresa_cliente"];
        $temp = array();

        if ($_POST["tipo_operacion"] == 'Actualizar') {
            $datos_nuevos = [];
            if ($_POST["dinamicos"] == "si") {
                if (count($_FILES) > 0) {
                    $papeles = $_FILES['papeles'];
                    $archivos = json_decode($_POST['notas']);
                } else {
                    $papeles = 'Sin_datos';
                    $archivos = json_decode($_POST['notas']);
                }
            }

            if (isset($_POST["nuevos_recursos"])) {
                if ($_POST["nuevos_recursos"] == "si") {
                    //propietario
                    if ($_POST["propietario_check"] === "true") {
                        $propietario_check = $_POST["propietario_check"];
                        $tipo_propi = $_POST["tipo_propi"];
                        $nombre_propietario = $_POST["nombre_propietario"];
                        $docu_propi = $_POST["docu_propi"];
                    } else {
                        $propietario_check = false;
                        $tipo_propi = "";
                        $nombre_propietario = "";
                        $docu_propi = "";
                    }
                    //poseedor
                    if ($_POST["poseedor_check"] === "true") {
                        $poseedor_check = true;
                        $tipo_posee = true;
                        //$tipo_posee = "";
                        //$poseedor_check = false;
                        $nombre_poseedor = $_POST["nombre_poseedor"];
                        // $nombre_poseedor = "";
                        $docu_posee = $_POST["docu_posee"];
                        //$docu_posee = "";
                    } else {
                        $tipo_posee = false;
                        $nombre_poseedor = "";
                        $docu_posee = "";
                    }
                    //conductor
                    if ($_POST["conductor_check"] === "true") {

                        if (isset($_POST["conductor_check"]) == true) {
                            $conductor_check = $_POST["conductor_check"];
                        } else {
                            $conductor_check = false;
                        }

                        $tipo_condu = $_POST["tipo_condu"];
                        if (isset($_POST["nombre_conductor"])) {
                            $nombre_conductor = $_POST["nombre_conductor"];
                        } else {
                            $nombre_conductor = "";
                        }

                        if (isset($_POST["docu_condu"])) {
                            $docu_condu = $_POST["docu_condu"];
                        } else {
                            $docu_condu = "";
                        }

                        if (isset($_POST["refe1"])) {
                            $refe1 = $_POST["refe1"];
                        } else {
                            $refe1 = "";
                        }

                        if (isset($_POST["contacto1"])) {
                            $contacto1 = $_POST["contacto1"];
                        } else {
                            $contacto1 = "";
                        }

                        if (isset($_POST["celular1"])) {
                            $celular1 = $_POST["celular1"];
                        } else {
                            $celular1 = "";
                        }

                        if (isset($_POST["cargo1"])) {
                            $cargo1 = $_POST["cargo1"];
                        } else {
                            $cargo1 = "";
                        }

                        if (isset($_POST["fechaa1"])) {
                            $fechaa1 = $_POST["fechaa1"];
                        } else {
                            $fechaa1 = "";
                        }

                        if (isset($_POST["fechaa2"])) {
                            $fechaa2 = $_POST["fechaa2"];
                        } else {
                            $fechaa2 = "";
                        }

                        if (isset($_POST["anti1"])) {
                            $anti1 = $_POST["anti1"];
                        } else {
                            $anti1 = "";
                        }

                        if (isset($_POST["refe2"])) {
                            $refe2 = $_POST["refe2"];
                        } else {
                            $refe2 = "";
                        }

                        if (isset($_POST["contacto2"])) {
                            $contacto2 = $_POST["contacto2"];
                        } else {
                            $contacto2 = "";
                        }

                        if (isset($_POST["celular2"])) {
                            $celular2 = $_POST["celular2"];
                        } else {
                            $celular2 = "";
                        }

                        if (isset($_POST["cargo2"])) {
                            $cargo2 = $_POST["cargo2"];
                        } else {
                            $cargo2 = "";
                        }

                        if (isset($_POST["fechab1"])) {
                            $fechab1 = $_POST["fechab1"];
                        } else {
                            $fechab1 = "";
                        }

                        if (isset($_POST["fechab2"])) {
                            $fechab2 = $_POST["fechab2"];
                        } else {
                            $fechab2 = "";
                        }

                        if (isset($_POST["anti2"])) {
                            $anti2 = $_POST["anti2"];
                        } else {
                            $anti2 = "";
                        }

                        if (isset($_POST["refe3"])) {
                            $refe3 = $_POST["refe3"];
                        } else {
                            $refe3 = "";
                        }

                        if (isset($_POST["contacto3"])) {
                            $contacto3 = $_POST["contacto3"];
                        } else {
                            $contacto3 = "";
                        }

                        if (isset($_POST["celular3"])) {
                            $celular3 = $_POST["celular3"];
                        } else {
                            $celular3 = "";
                        }

                        if (isset($_POST["cargo3"])) {
                            $cargo3 = $_POST["cargo3"];
                        } else {
                            $cargo3 = "";
                        }

                        if (isset($_POST["fechac1"])) {
                            $fechac1 = $_POST["fechac1"];
                        } else {
                            $fechac1 = "";
                        }

                        if (isset($_POST["fechac2"])) {
                            $fechac2 = $_POST["fechac2"];
                        } else {
                            $fechac2 = "";
                        }

                        if (isset($_POST["anti3"])) {
                            $anti3 = $_POST["anti3"];
                        } else {
                            $anti3 = "";
                        }
                    } else {
                        $conductor_check = false;
                        $tipo_condu = "";
                        $nombre_conductor = "";
                        $docu_condu = "";
                        $refe1 = "";
                        $contacto1 = "";
                        $celular1 = "";
                        $cargo1 = "";
                        $fechaa1 = "";
                        $fechaa2 = "";
                        $anti1 = "";
                        $refe2 = "";
                        $contacto2 = "";
                        $celular2 = "";
                        $cargo2 = "";
                        $fechab1 = "";
                        $fechab2 = "";
                        $anti2 = "";
                        $refe3 = "";
                        $contacto3 = "";
                        $celular3 = "";
                        $cargo3 = "";
                        $fechac1 = "";
                        $fechac2 = "";
                        $anti3 = "";
                    }
                    //vehiculo
                    if (isset($_POST["vehi_check"]) === "true") {
                        if (isset($_POST["vehi_check"]) == true) {
                            $vehi_check = $_POST["vehi_check"];
                        } else {
                            $vehi_check = false;
                        }
                        if (isset($_POST["tipo_veh"])) {
                            $tipo_veh = $_POST["tipo_veh"];
                        } else {
                            $tipo_veh = "";
                        }
                        if (isset($_POST["placa_vehiculo"])) {
                            $placa_vehiculo = $_POST["placa_vehiculo"];
                        } else {
                            $placa_vehiculo = "";
                        }
                        if (isset($_POST["satelital"])) {
                            $satelital = $_POST["satelital"];
                        } else {
                            $satelital = "";
                        }
                        if (isset($_POST["url_satelital"])) {
                            $url_satelital = $_POST["url_satelital"];
                        } else {
                            $url_satelital = "";
                        }
                        if (isset($_POST["clave_satelital"])) {
                            $clave_satelital = $_POST["clave_satelital"];
                        } else {
                            $clave_satelital = "";
                        }
                    } else {
                        $vehi_check = false;
                        $tipo_veh = "";
                        $placa_vehiculo = "";
                        $satelital = "";
                        $url_satelital = "";
                        $clave_satelital = "";
                    }

                    //trailer
                    if ($_POST["trailer_check"] === "true") {
                        if (isset($_POST["trailer_check"]) == true) {
                            $trailer_check = $_POST["trailer_check"];
                        } else {
                            $trailer_check = false;
                        }
                        if (isset($_POST["placa_trailer"])) {
                            $placa_trailer = $_POST["placa_trailer"];
                        } else {
                            $placa_trailer = "";
                        }
                        if (isset($_POST["propi_trailer"])) {
                            $propi_trailer = $_POST["propi_trailer"];
                        } else {
                            $propi_trailer = "";
                        }
                        if (isset($_POST["propidoc_trailer"])) {
                            $propidoc_trailer = $_POST["propidoc_trailer"];
                        } else {
                            $propidoc_trailer = "";
                        }
                    } else {
                        $trailer_check = false;
                        $placa_trailer = "";
                        $propi_trailer = "";
                        $propidoc_trailer = "";
                    }

                    $datos_nuevos = array(
                        "propietario_check" => $propietario_check,
                        "tipo_propi" => $tipo_propi,
                        "nombre_propietario" => $nombre_propietario,
                        "docu_propi" => $docu_propi,
                        "tipo_posee" => $tipo_posee,
                        "nombre_poseedor" => $nombre_poseedor,
                        "docu_posee" => $docu_posee,
                        "conductor_check" => $conductor_check,
                        "tipo_condu" => $tipo_condu,
                        "nombre_conductor" => $nombre_conductor,
                        "docu_condu" => $docu_condu,
                        "refe1" => $refe1,
                        "contacto1" => $contacto1,
                        "celular1" => $celular1,
                        "cargo1" => $cargo1,
                        "fechaa1" => $fechaa1,
                        "fechaa2" => $fechaa2,
                        "anti1" => $anti1,
                        "refe2" => $refe2,
                        "contacto2" => $contacto2,
                        "celular2" => $celular2,
                        "cargo2" => $cargo2,
                        "fechab1" => $fechab1,
                        "fechab2" => $fechab2,
                        "anti2" => $anti2,
                        "refe3" => $refe3,
                        "contacto3" => $contacto3,
                        "celular3" => $celular3,
                        "cargo3" => $cargo3,
                        "fechac1" => $fechac1,
                        "fechac2" => $fechac2,
                        "anti3" => $anti3,
                        "vehi_check" => $vehi_check,
                        "tipo_veh" => $tipo_veh,
                        "placa_vehiculo" => $placa_vehiculo,
                        "satelital" => $satelital,
                        "url_satelital" => $url_satelital,
                        "clave_satelital" => $clave_satelital,
                        "trailer_check" => $trailer_check,
                        "placa_trailer" => $placa_trailer,
                        "propi_trailer" => $propi_trailer,
                        "propidoc_trailer" => $propidoc_trailer,
                    );
                }
            }
        } else {
            //datos nuevos
            $datos_nuevos = [];
        }

        /* Responsable vehiculo */
        $responsable_vehiculo = $_POST["responsable_vehiculo"];
        $datos = array(
            "tipo_operacion" => $tipo_operacion,
            "placa" => $placa,
            "flete" => $flete_subasta,
            "tarifa" => $tarifa_subasta,
            "fecha" => $fecha,
            "hora" => $hora,
            "usuario" => $usuario,
            "solicitudes" => $fserva,
            "observacion" => $observacion,
            "empresa_cliente" => $empresa_cliente,
            "responsable_vehiculo" => $responsable_vehiculo,
            "dinamicos" => isset($_POST["dinamicos"]) ? $_POST["dinamicos"] : "",
            "nuevo_recurso" => isset($_POST["nuevos_recursos"]) ? $_POST["nuevos_recursos"] : "",
            "papeles" => isset($papeles) ? $papeles : $_POST["papeles"],
            'archivos' => isset($archivos) ? $archivos : '',
            // 'archivos' => $archivos
        );
        $this->crear_estudio = $this->_modelo->Insert_estudio($datos, $datos_nuevos);
        echo json_encode($this->crear_estudio);
    }

    /* Funciones para insertar estudio de itr */
    public function Insert_estudio_itr()
    {
        $tipo_operacion = $_POST["tipo_operacion"];
        $placa = $_POST["placa"];
        $flete_subasta = $_POST["flete_subasta"];
        $tarifa_subasta = $_POST["tarifa_subasta"];
        $fecha = $_POST["fecha"];
        $hora = $_POST["hora"];
        $usuario = $_POST["usuario"];
        $fserva = $_POST["fserva"];
        $observacion = $_POST["observacion"];
        $empresa_cliente = $_POST["empresa_cliente"];
        $temp = array();
        $datos_nuevos = [];

        if ($_POST["tipo_operacion"] == 'Actualizar') {
            if ($_POST["dinamicos"] == "si") {
                if (count($_FILES) > 0) {
                    $papeles = $_FILES['papeles'];
                    $archivos = json_decode($_POST['notas']);
                } else {
                    $papeles = 'Sin_datos';
                    $archivos = json_decode($_POST['notas']);
                }
            }

            if (isset($_POST["nuevos_recursos"]) == "si") {
                //propietario
                if ($_POST["propietario_check"] === "true") {
                    $propietario_check = $_POST["propietario_check"];
                    $tipo_propi = $_POST["tipo_propi"];
                    $nombre_propietario = $_POST["nombre_propietario"];
                    $docu_propi = $_POST["docu_propi"];
                } else {
                    $propietario_check = false;
                    $tipo_propi = "";
                    $nombre_propietario = "";
                    $docu_propi = "";
                }
                //poseedor
                if ($_POST["poseedor_check"] === "true") {
                    $poseedor_check = true;
                    $tipo_posee = true;
                    //$tipo_posee = "";
                    //$poseedor_check = false;
                    $nombre_poseedor = $_POST["nombre_poseedor"];
                    // $nombre_poseedor = "";
                    $docu_posee = $_POST["docu_posee"];
                    //$docu_posee = "";
                } else {
                    $tipo_posee = false;
                    $nombre_poseedor = "";
                    $docu_posee = "";
                }
                //conductor
                if ($_POST["conductor_check"] === "true") {

                    if (isset($_POST["conductor_check"]) == true) {
                        $conductor_check = $_POST["conductor_check"];
                    } else {
                        $conductor_check = false;
                    }

                    $tipo_condu = $_POST["tipo_condu"];
                    if (isset($_POST["nombre_conductor"])) {
                        $nombre_conductor = $_POST["nombre_conductor"];
                    } else {
                        $nombre_conductor = "";
                    }

                    if (isset($_POST["docu_condu"])) {
                        $docu_condu = $_POST["docu_condu"];
                    } else {
                        $docu_condu = "";
                    }

                    if (isset($_POST["refe1"])) {
                        $refe1 = $_POST["refe1"];
                    } else {
                        $refe1 = "";
                    }

                    if (isset($_POST["contacto1"])) {
                        $contacto1 = $_POST["contacto1"];
                    } else {
                        $contacto1 = "";
                    }

                    if (isset($_POST["celular1"])) {
                        $celular1 = $_POST["celular1"];
                    } else {
                        $celular1 = "";
                    }

                    if (isset($_POST["cargo1"])) {
                        $cargo1 = $_POST["cargo1"];
                    } else {
                        $cargo1 = "";
                    }

                    if (isset($_POST["fechaa1"])) {
                        $fechaa1 = $_POST["fechaa1"];
                    } else {
                        $fechaa1 = "";
                    }

                    if (isset($_POST["fechaa2"])) {
                        $fechaa2 = $_POST["fechaa2"];
                    } else {
                        $fechaa2 = "";
                    }

                    if (isset($_POST["anti1"])) {
                        $anti1 = $_POST["anti1"];
                    } else {
                        $anti1 = "";
                    }

                    if (isset($_POST["refe2"])) {
                        $refe2 = $_POST["refe2"];
                    } else {
                        $refe2 = "";
                    }

                    if (isset($_POST["contacto2"])) {
                        $contacto2 = $_POST["contacto2"];
                    } else {
                        $contacto2 = "";
                    }

                    if (isset($_POST["celular2"])) {
                        $celular2 = $_POST["celular2"];
                    } else {
                        $celular2 = "";
                    }

                    if (isset($_POST["cargo2"])) {
                        $cargo2 = $_POST["cargo2"];
                    } else {
                        $cargo2 = "";
                    }

                    if (isset($_POST["fechab1"])) {
                        $fechab1 = $_POST["fechab1"];
                    } else {
                        $fechab1 = "";
                    }

                    if (isset($_POST["fechab2"])) {
                        $fechab2 = $_POST["fechab2"];
                    } else {
                        $fechab2 = "";
                    }

                    if (isset($_POST["anti2"])) {
                        $anti2 = $_POST["anti2"];
                    } else {
                        $anti2 = "";
                    }

                    if (isset($_POST["refe3"])) {
                        $refe3 = $_POST["refe3"];
                    } else {
                        $refe3 = "";
                    }

                    if (isset($_POST["contacto3"])) {
                        $contacto3 = $_POST["contacto3"];
                    } else {
                        $contacto3 = "";
                    }

                    if (isset($_POST["celular3"])) {
                        $celular3 = $_POST["celular3"];
                    } else {
                        $celular3 = "";
                    }

                    if (isset($_POST["cargo3"])) {
                        $cargo3 = $_POST["cargo3"];
                    } else {
                        $cargo3 = "";
                    }

                    if (isset($_POST["fechac1"])) {
                        $fechac1 = $_POST["fechac1"];
                    } else {
                        $fechac1 = "";
                    }

                    if (isset($_POST["fechac2"])) {
                        $fechac2 = $_POST["fechac2"];
                    } else {
                        $fechac2 = "";
                    }

                    if (isset($_POST["anti3"])) {
                        $anti3 = $_POST["anti3"];
                    } else {
                        $anti3 = "";
                    }
                } else {
                    $conductor_check = false;
                    $tipo_condu = "";
                    $nombre_conductor = "";
                    $docu_condu = "";
                    $refe1 = "";
                    $contacto1 = "";
                    $celular1 = "";
                    $cargo1 = "";
                    $fechaa1 = "";
                    $fechaa2 = "";
                    $anti1 = "";
                    $refe2 = "";
                    $contacto2 = "";
                    $celular2 = "";
                    $cargo2 = "";
                    $fechab1 = "";
                    $fechab2 = "";
                    $anti2 = "";
                    $refe3 = "";
                    $contacto3 = "";
                    $celular3 = "";
                    $cargo3 = "";
                    $fechac1 = "";
                    $fechac2 = "";
                    $anti3 = "";
                }
                //vehiculo
                if (isset($_POST["vehi_check"]) === "true") {
                    if (isset($_POST["vehi_check"]) == true) {
                        $vehi_check = $_POST["vehi_check"];
                    } else {
                        $vehi_check = false;
                    }
                    if (isset($_POST["tipo_veh"])) {
                        $tipo_veh = $_POST["tipo_veh"];
                    } else {
                        $tipo_veh = "";
                    }
                    if (isset($_POST["placa_vehiculo"])) {
                        $placa_vehiculo = $_POST["placa_vehiculo"];
                    } else {
                        $placa_vehiculo = "";
                    }
                    if (isset($_POST["satelital"])) {
                        $satelital = $_POST["satelital"];
                    } else {
                        $satelital = "";
                    }
                    if (isset($_POST["url_satelital"])) {
                        $url_satelital = $_POST["url_satelital"];
                    } else {
                        $url_satelital = "";
                    }
                    if (isset($_POST["clave_satelital"])) {
                        $clave_satelital = $_POST["clave_satelital"];
                    } else {
                        $clave_satelital = "";
                    }
                } else {
                    $vehi_check = false;
                    $tipo_veh = "";
                    $placa_vehiculo = "";
                    $satelital = "";
                    $url_satelital = "";
                    $clave_satelital = "";
                }

                //trailer
                if ($_POST["trailer_check"] === "true") {
                    if (isset($_POST["trailer_check"]) == true) {
                        $trailer_check = $_POST["trailer_check"];
                    } else {
                        $trailer_check = false;
                    }
                    if (isset($_POST["placa_trailer"])) {
                        $placa_trailer = $_POST["placa_trailer"];
                    } else {
                        $placa_trailer = "";
                    }
                    if (isset($_POST["propi_trailer"])) {
                        $propi_trailer = $_POST["propi_trailer"];
                    } else {
                        $propi_trailer = "";
                    }
                    if (isset($_POST["propidoc_trailer"])) {
                        $propidoc_trailer = $_POST["propidoc_trailer"];
                    } else {
                        $propidoc_trailer = "";
                    }
                } else {
                    $trailer_check = false;
                    $placa_trailer = "";
                    $propi_trailer = "";
                    $propidoc_trailer = "";
                }

                $datos_nuevos = array(
                    "propietario_check" => $propietario_check,
                    "tipo_propi" => $tipo_propi,
                    "nombre_propietario" => $nombre_propietario,
                    "docu_propi" => $docu_propi,
                    "tipo_posee" => $tipo_posee,
                    "nombre_poseedor" => $nombre_poseedor,
                    "docu_posee" => $docu_posee,
                    "conductor_check" => $conductor_check,
                    "tipo_condu" => $tipo_condu,
                    "nombre_conductor" => $nombre_conductor,
                    "docu_condu" => $docu_condu,
                    "refe1" => $refe1,
                    "contacto1" => $contacto1,
                    "celular1" => $celular1,
                    "cargo1" => $cargo1,
                    "fechaa1" => $fechaa1,
                    "fechaa2" => $fechaa2,
                    "anti1" => $anti1,
                    "refe2" => $refe2,
                    "contacto2" => $contacto2,
                    "celular2" => $celular2,
                    "cargo2" => $cargo2,
                    "fechab1" => $fechab1,
                    "fechab2" => $fechab2,
                    "anti2" => $anti2,
                    "refe3" => $refe3,
                    "contacto3" => $contacto3,
                    "celular3" => $celular3,
                    "cargo3" => $cargo3,
                    "fechac1" => $fechac1,
                    "fechac2" => $fechac2,
                    "anti3" => $anti3,
                    "vehi_check" => $vehi_check,
                    "tipo_veh" => $tipo_veh,
                    "placa_vehiculo" => $placa_vehiculo,
                    "satelital" => $satelital,
                    "url_satelital" => $url_satelital,
                    "clave_satelital" => $clave_satelital,
                    "trailer_check" => $trailer_check,
                    "placa_trailer" => $placa_trailer,
                    "propi_trailer" => $propi_trailer,
                    "propidoc_trailer" => $propidoc_trailer
                );
            }
        } else {
            //datos nuevos
            $datos_nuevos = [];
        }

        /* Responsable vehiculo */
        $responsable_vehiculo = $_POST["responsable_vehiculo"];
        $datos = array(
            "tipo_operacion" => $tipo_operacion,
            "placa" => $placa,
            "flete" => $flete_subasta,
            "tarifa" => $tarifa_subasta,
            "fecha" => $fecha,
            "hora" => $hora,
            "usuario" => $usuario,
            "solicitudes" => $fserva,
            "observacion" => $observacion,
            "empresa_cliente" => $empresa_cliente,
            "responsable_vehiculo" => $responsable_vehiculo,
            "dinamicos" => isset($_POST["dinamicos"]) ? $_POST["dinamicos"] : 'No',
            "nuevo_recurso" => isset($_POST["nuevos_recursos"]) ? $_POST["nuevos_recursos"] : 'No',
            "papeles" => isset($papeles) ? $papeles : $_POST["papeles"],
            'archivos' => isset($archivos) ? $archivos :  $_POST["papeles"]
        );
        $this->crear_estudio_itr = $this->_modelo->Insert_estudio_Itr($datos, $datos_nuevos);
        echo json_encode($this->crear_estudio_itr);
    }


    public function Registra_subasta_final()
    {
        $numero = $_POST["numero"];
        $dato = array(
            "numero" => $numero,
        );
        $this->crear_subasta = $this->_modelo->Insert_Subasta_Final($dato);
        echo json_encode($this->crear_subasta);
    }

    // Inicio Estudio de seguridad
    public function Inicio_Estudio_seguridad()
    {
        $numsoli = $_POST["numsoli"];
        $fechag = $_POST["fechag"];
        $horag = $_POST["horag"];
        $usuariog = $_POST["usuariog"];
        $id_conductor = $_POST["id_conductor"];
        $id_vehiculo = $_POST["id_vehiculo"];
        $estudio_id_c = $_POST["estudio_id_c"];
        $datos = array(
            "numsoli" => $numsoli,
            "fechag" => $fechag,
            "horag" => $horag,
            "usuariog" => $usuariog,
            "id_conductor" => $id_conductor,
            "id_vehiculo" => $id_vehiculo,
            "estudio_id_c" => $estudio_id_c,
            "estado" => "iniciado",
            "estado_actual" => 1,
            "estado_subasta" => "Activo",
            "fecha" => date("Y-m-d"),
            "hora" => date("H:i:s"),
            "observacion" => null,
            "proceso" => "Pen_Sol_Rut",
        );
        $this->inicio_estudio_seguridad = $this->_modelo->Inicio_de_estudio_de_seguridad($datos);
        echo json_encode($this->inicio_estudio_seguridad);
    }

    public function Ver_Estudio_Seguridad()
    {
        $vehiculo = $_POST["idv"];
        $conductor = $_POST["idc"];
        $solicitud = $_POST["idsoli"];
        $datos = array(
            "vehiculo" => $vehiculo,
            "conductor" => $conductor,
            "solicitud" => $solicitud,
        );
        $this->ver_estudio_seguridad = $this->_modelo->Ver_estudio_seguridad($datos);
        echo json_encode($this->ver_estudio_seguridad);
    }

    public function ver_vehiculo()
    {
        $id_vehiculo = $_POST["id_vehiculo"];
        $this->ver_vehiculo = $this->_modelo->Ver_vehiculo_seguridad($id_vehiculo);
        echo json_encode($this->ver_vehiculo);
    }

    public function Aprobar_vehiculo_estudio()
    {
        $fecha = $_POST["fecha"];
        $hora = $_POST["hora"];
        $user = $_POST["user"];
        $observeheciulo = $_POST["observeheciulo"];
        $id_vehiculo = $_POST["id_vehiculo"];
        $id_conductor = $_POST["id_conductor"];
        $idsoli = $_POST["idsoli"];
        $idtipo = $_POST["idtipo"];
        $datos = array(
            "fecha" => $fecha,
            "hora" => $hora,
            "user" => $user,
            "observeheciulo" => $observeheciulo,
            "id_vehiculo" => $id_vehiculo,
            "id_conductor" => $id_conductor,
            "idsoli" => $idsoli,
            "idtipo" => $idtipo,
        );
        $this->aprobar_vehiculo = $this->_modelo->aprovar_hoja_vida_vehiculo_seguridad($datos);
        echo json_encode($this->aprobar_vehiculo);
    }

    public function Desaprobar_vehiculo_estudio()
    {
        $fecha = $_POST["fecha"];
        $hora = $_POST["hora"];
        $user = $_POST["user"];
        $observeheciulo = $_POST["observeheciulo"];
        $id_vehiculo = $_POST["id_vehiculo"];
        $id_conductor = $_POST["id_conductor"];
        $idsoli = $_POST["idsoli"];
        $idtipo = $_POST["idtipo"];
        $datos = array(
            "fecha" => $fecha,
            "hora" => $hora,
            "user" => $user,
            "observeheciulo" => $observeheciulo,
            "id_vehiculo" => $id_vehiculo,
            "id_conductor" => $id_conductor,
            "idsoli" => $idsoli,
            "idtipo" => $idtipo,
        );
        $this->desaprobar_vehiculo = $this->_modelo->desaprovar_hoja_vida_vehiculo_seguridad($datos);
        echo json_encode($this->desaprobar_vehiculo);
    }

    public function ver_conductor()
    {
        $id_conductor = $_POST["id_conductor"];
        $num_documento = $_POST["num_documento"];
        $this->ver_conductor = $this->_modelo->Ver_conductor_seguridad($id_conductor, $num_documento);
        echo json_encode($this->ver_conductor);
    }

    public function Aprobar_conductor_estudio()
    {
        $fecha = $_POST["fech"];
        $hora = $_POST["hor"];
        $usuario = $_POST["usuari"];
        $id_vehiculo = $_POST["id_vehiculo"];
        $id_conductor = $_POST["id_conductor"];
        $idsoli = $_POST["idsoli"];
        $idtipo = $_POST["idtipo"];
        if ($_POST["obse_condu"]) {
            $obse_condu = $_POST["obse_condu"];
        } else {
            $obse_condu = '';
        }
        $aprobo = '1';
        //aprobar_conductor
        $datos = array(
            "fecha" => $fecha,
            "hora" => $hora,
            "user" => $usuario,
            "id_vehiculo" => $id_vehiculo,
            "id_conductor" => $id_conductor,
            "idsoli" => $idsoli,
            "idtipo" => $idtipo,
            "obse_condu" => $obse_condu,
            "aprobo" => $aprobo,
        );
        $this->aprobar_conductor = $this->_modelo->aprovar_hoja_vida_conductor_seguridad($datos);
        echo json_encode($this->aprobar_conductor);
    }

    public function Desaprobar_conductor_estudio()
    {
        $fecha = $_POST["fech"];
        $hora = $_POST["hor"];
        $usuario = $_POST["usuari"];
        $id_vehiculo = $_POST["id_vehiculo"];
        $id_conductor = $_POST["id_conductor"];
        $idsoli = $_POST["idsoli"];
        $idtipo = $_POST["idtipo"];
        if ($_POST["obse_condu"]) {
            $obse_condu = $_POST["obse_condu"];
        } else {
            $obse_condu = '';
        }
        $aprobo = '0';
        //aprobar_conductor
        $datos = array(
            "fecha" => $fecha,
            "hora" => $hora,
            "user" => $usuario,
            "id_vehiculo" => $id_vehiculo,
            "id_conductor" => $id_conductor,
            "idsoli" => $idsoli,
            "idtipo" => $idtipo,
            "obse_condu" => $obse_condu,
            "aprobo" => $aprobo,
            "activo" => 1,
        );
        $this->desaprobar_conductor = $this->_modelo->desaprovar_hoja_vida_conductor_seguridad($datos);
        echo json_encode($this->desaprobar_conductor);
    }

    public function Aprobar_risk()
    {
        $fecha = $_POST["fecha"];
        $hora = $_POST["hora"];
        $usuario = $_POST["usuario"];
        $id_vehiculo = $_POST["id_vehiculo"];
        $id_conductor = $_POST["id_conductor"];
        $estudio = $_POST["tipo_estudio"];
        $idsoli = $_POST["idsoli"];
        $ruta_eviden = $_POST["ruta_eviden"];
        $idtipo = $_POST["idtipo"];
        if (count($_FILES) > 0) {
            for ($i = 0; $i < count($_FILES); $i++) {
                if (isset($_FILES["evi_plataforma" . $i])) {
                    $evi_plataforma = $_FILES["evi_plataforma" . $i];
                }
            }
        } else {
            $evi_plataforma = '';
        }

        if ($_POST["obse_todo"]) {
            $obse_todo = $_POST["obse_todo"];
        } else {
            $obse_todo = '';
        }
        $name_eviden = $_POST["name_eviden"];
        $datos = array(
            "fecha" => $fecha,
            "hora" => $hora,
            "user" => $usuario,
            "id_vehiculo" => $id_vehiculo,
            "id_conductor" => $id_conductor,
            "idsoli" => $idsoli,
            "idtipo" => $idtipo,
            "estudio" => $estudio,
            "ruta_eviden" => $ruta_eviden,
            "obse_todo" => $obse_todo,
            "name_eviden" => $name_eviden,
            "aprobo" => 1,
            "evi_plataforma" => $evi_plataforma,
        );
        $this->aprobar_risk = $this->_modelo->aprovar_risk_seguridad($datos);
        echo json_encode($this->aprobar_risk);
    }

    public function Desaprobar_risk()
    {
        $fecha = $_POST["fecha"];
        $hora = $_POST["hora"];
        $usuario = $_POST["usuario"];
        $id_vehiculo = $_POST["id_vehiculo"];
        $id_conductor = $_POST["id_conductor"];
        $estudio = $_POST["tipo_estudio"];
        $idsoli = $_POST["idsoli"];
        $aleatorio1 = rand(10000, 90000);
        $aleatorio2 = rand(10000, 90000);
        $ruta_eviden = $_POST["ruta_eviden"];
        $idtipo = $_POST["idtipo"];
        if (count($_FILES) > 0) {
            for ($i = 0; $i < count($_FILES); $i++) {
                if (isset($_FILES["evi_plataforma" . $i])) {
                    $evi_plataforma = $_FILES["evi_plataforma" . $i];
                }
            }
        } else {
            $evi_plataforma = '';
        }

        if ($_POST["obse_todo"]) {
            $obse_todo = $_POST["obse_todo"];
        } else {
            $obse_todo = '';
        }

        $name_eviden = $_POST["name_eviden"];

        $datos = array(
            "fecha" => $fecha,
            "hora" => $hora,
            "user" => $usuario,
            "id_vehiculo" => $id_vehiculo,
            "id_conductor" => $id_conductor,
            "idsoli" => $idsoli,
            "idtipo" => $idtipo,
            "estudio" => $estudio,
            "ruta_eviden" => $ruta_eviden,
            "obse_todo" => $obse_todo,
            "name_eviden" => $name_eviden,
            "aprobo" => 0,
            "activo" => 1,
            "evi_plataforma" => $evi_plataforma,
        );
        $this->desaprobar_risk = $this->_modelo->desaprovar_risk_seguridad($datos);
        echo json_encode($this->desaprobar_risk);
    }

    public function tipos_estudios()
    {
        $idestudio = $_POST["idestudio"];
        $this->r_tipos_estudios = $this->_modelo->tipos_estudios($idestudio);
        echo json_encode($this->r_tipos_estudios);
    }

    public function Aprobacion_total()
    {
        $idcarro = $_POST["idcarro"];
        $idcondu = $_POST["idcondu"];
        $idestudio = $_POST["idestudio"];
        $estado = $_POST["estado"];
        $id_usuario = $_POST["user"];
        $id_estudio_c = $_POST["id_estudio_c"];
        if ($_POST["obser"]) {
            $obser = $_POST["obser"];
        } else {
            $obser = '';
        }
        $fecha = date('Y-m-d');
        $hora = date('G:i:s');
        $operacion = 'Crear';
        $proceso = $_POST["proceso"];
        $proceso_estudio = $_POST["proceso_estudio"];
        // $causalidad = $_POST["causalidad"];
        $causalidad = "";

        $datos = array(
            "idcarro" => $idcarro,
            "idcondu" => $idcondu,
            "idestudio" => $idestudio,
            "estado" => $estado,
            "id_usuario" => $id_usuario,
            "obser" => $obser,
            "fecha" => $fecha,
            "hora" => $hora,
            "operacion" => $operacion,
            "proceso" => $proceso,
            "proceso_estudio" => $proceso_estudio,
            "estado_actu" => 1,
            "id_estudio_c" => $id_estudio_c,
            "causalidad" => $causalidad,
        );
        $this->aprobacion_estudio = $this->_modelo->Aprobacion_total_estudio($datos);
        echo json_encode($this->aprobacion_estudio);
    }

    public function ver_estudio_operaciones()
    {
        $idv = $_POST["idv"];
        $idc = $_POST["idc"];
        $idsoli = $_POST["idsoli"];
        $datos = array(
            "idv" => $idv,
            "idc" => $idc,
            "idsoli" => $idsoli,
        );
        $this->ver_estudio_respuesta_seguridad = $this->_modelo->Ver_estudio_operaciones($datos);
        echo json_encode($this->ver_estudio_respuesta_seguridad);
    }

    public function Consultar_respuesta_operaciones()
    {
        $idstu = $_POST["idestudio"];
        $this->consultar_respuesta_operaciones = $this->_modelo->Consultar_respuesta_operaciones($idstu);
        echo json_encode($this->consultar_respuesta_operaciones);
    }

    public function reactivar_estudio()
    {
        $num_estudio = $_POST["num_estudio"];
        $id_conductor = $_POST["id_conductor"];
        $id_vehiculo = $_POST["id_vehiculo"];
        $id_estudio_c = $_POST["id_estudio_c"];
        $observacion = $_POST["observacion"];
        $fecha = date('Y-m-d');
        $hora = date('G:i:s');
        $datos = array(
            "num_estudio" => $num_estudio,
            "id_conductor" => $id_conductor,
            "id_vehiculo" => $id_vehiculo,
            "proceso" => "Pen_Sol_Rut",
            "id_estudio_c" => $id_estudio_c,
            "estado" => "pendiente_iniciar",
            "observacion" => $observacion,
            "fecha" => $fecha,
            "hora" => $hora,
            "estado_actual" => 1,
            "estado_subasta" => "Activo",
            "estado_log" => "Actualizar",
        );
        $this->reactivar_estudio = $this->_modelo->reactivar_estudio_operaciones($datos);
        echo json_encode($this->reactivar_estudio);
    }

    public function registrar_respuesta_operacion()
    {
        $nestudio = $_POST["nestudio"];
        $ntipo = $_POST["ntipo"];
        $rta = $_POST["rta"];
        $estudio = $_POST["estudio"];
        $fecha = date('Y-m-d');
        $hora = date('H:i:s');
        // $user = $_SESSION["usuario"]["nom_usuario"];
        if (isset($_POST["nomarchivo"])) {
            $nomarchivo = $_POST["nomarchivo"];
        }

        for ($s = 0; $s < count($_FILES); $s++) {
            if (isset($_FILES["op_archivo" . $s])) {
                $archivo = $_FILES["op_archivo" . $s];
            }
        }

        $datos = array(
            "nestudio" => $nestudio,
            "ntipo" => $ntipo,
            "rta" => $rta,
            "estudio" => $estudio,
            "fecha" => $fecha,
            "hora" => $hora,
            "nomarchivo" => $nomarchivo,
            "archivo" => $archivo,
        );

        $this->respuesta_operaciones = $this->_modelo->registrar_respuesta_operacion($datos);
        echo json_encode($this->respuesta_operaciones);
    }

    public function busqueda_referencias()
    {
        $documento = $_POST["documento_conductor"];
        $this->reactivar_estudio = $this->_modelo->busca_referencias($documento);
        echo json_encode($this->reactivar_estudio);
    }

    public function Validar_Propietario()
    {
        $documento = $_POST['documento'];
        $this->respuesta_propietario = $this->_modelo->Validar_Propietarios($documento);
        echo json_encode($this->respuesta_propietario);
    }

    public function Validar_Poseedor()
    {
        $documento = $_POST['documento'];
        $this->respuesta_propietario = $this->_modelo->Validar_Poseedor($documento);
        echo json_encode($this->respuesta_propietario);
    }

    public function Validar_Conductor()
    {
        $documento = $_POST['documento'];
        $this->respuesta_propietario = $this->_modelo->Validar_Conductor($documento);
        echo json_encode($this->respuesta_propietario);
    }

    public function Validar_Trailer()
    {
        $placa_trailer = $_POST['placa_trailer'];
        $this->respuesta_trailer = $this->_modelo->Validar_Trailer($placa_trailer);
        echo json_encode($this->respuesta_trailer);
    }

    /* Subasta para itr */
    // public function Insertar_subasta_itr()
    // {
    //     $solicitud = $_POST['solicitud_servicio'];
    //     $this->subasta_itr = $this->_modelo->Insert_Subasta_Final($solicitud);
    //     echo json_encode($this->subasta_itr);
    // }

    public function Insert_estudio_itr_subasta()
    {
        $tipo_operacion = $_POST["tipo_operacion"];
        $placa = $_POST["placa"];
        $flete_subasta = $_POST["flete_subasta"];
        $tarifa_subasta = $_POST["tarifa_subasta"];
        $fecha = $_POST["fecha"];
        $hora = $_POST["hora"];
        $usuario = $_POST["usuario"];
        $fserva = $_POST["fserva"];
        $solicitud = $_POST["solicitud"];
        $responsable_vehiculo = $_POST["responsable_vehiculo"];
        $empresa_cliente = $_POST["empresa_cliente"];

        $datos = array(
            "tipo_operacion" => $tipo_operacion,
            "placa" => $placa,
            "flete" => $flete_subasta,
            "tarifa" => $tarifa_subasta,
            "fecha" => $fecha,
            "hora" => $hora,
            "usuario" => $usuario,
            "solicitudes" => $fserva,
            "solicitud" => $solicitud,
            "responsable_vehiculo" => $responsable_vehiculo,
            "empresa_cliente" => $empresa_cliente,
            // "dinamicos" => isset($_POST["dinamicos"]) ? $_POST["dinamicos"] : 'No',
            // "nuevo_recurso" => isset($_POST["nuevos_recursos"]) ? $_POST["nuevos_recursos"] : 'No',
            "papeles" => isset($papeles) ? $papeles : $_POST["papeles"],
            'archivos' => isset($archivos) ? $archivos :  $_POST["papeles"]
        );
        $this->subasta_itr = $this->_modelo->insert_estudio_itr_subasta($datos);
        echo json_encode($this->subasta_itr);
    }

    public function Validar_solicitud_vigencia()
    {
        $solicitud_servicio = $_POST["solicitud_servicio_id"];
        $this->validar_vigencia_solicitud = $this->_modelo->Validar_vigencia_Solicitud($solicitud_servicio);
        echo json_encode($this->validar_vigencia_solicitud);
    }

    public function listar_responsables_vehiculo()
    {
        $this->listar_responsables_vehiculo = $this->_modelo->Consultar_responsables_vehiculo();
        echo json_encode($this->listar_responsables_vehiculo);
    }
}
