<?php
class aprobacionesModel extends Model
{

    public function __construct()
    {
        parent::__construct();
    }

    public function getMonedas()
    {
        $monedas = $this->_db->getConsulta("SELECT * FROM cmx_solicitudes ");
        return $monedas;
    }

    public function getTabla()
    {
        $monedas = $this->_db->getConsulta("SELECT * FROM cmx_solicitudes ");
        return $monedas;
    }

    public function getHtmlSelect($name, $id)
    {

        if ($name) {
            $query = 'SELECT * FROM cmx_monedas cmo';

            // echo $query;
            $array = $this->_db->getConsulta($query);

            // Se recorre contenido de la consulta
            if ($array) {
                // print_r($array);
                $select = '
						<select class="select2 select2-hidden-accessible" name="' . $name . '" id="slct_monedas_' . $id . '" aria-hidden="true">
					';
                $select .= '<option value="" selected disabled>Seleccione</option>';

                foreach ($array['rowsData'] as $key => $value) {

                    if ($value[0] == $id) {
                        $select .= '<option value="' . $value[0] . '" selected="">' . $value[1] . '</option>';
                    } else {
                        $select .= '<option value="' . $value[0] . '">' . $value[1] . '</option>';
                    }
                }
                $select .= '</select>';
            } else {
                $select = "No hay datos en esta tabla...";
            }
        } else {
            $select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
        }

        return $select;
    }

    public function getHtmlSelectMultiple($name, $id)
    {

        if ($name) {
            $query = 'SELECT * FROM cmx_monedas cmo';

            // echo $query;
            $array = $this->_db->getConsulta($query);

            // Se recorre contenido de la consulta
            if ($array) {
                // print_r($array);
                $select = '
						<select class="tags" multiple="multiple" name="' . $name . '" id="slct_monedas_' . $id . '" aria-hidden="true">
					';
                foreach ($array['rowsData'] as $key => $value) {

                    if ($value[0] == $id) {
                        $select .= '<option value="' . $value[0] . '" selected="">' . $value[1] . '</option>';
                    } else {
                        $select .= '<option value="' . $value[0] . '">' . $value[1] . '</option>';
                    }
                }
                $select .= '</select>';
            } else {
                $select = "No hay datos en esta tabla...";
            }
        } else {
            $select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
        }
        return $select;
    }
}

class Aprobaciones extends Model
{

    public $user_log;
    public $pass;
    public $mensaje;
    public $respuesta;
    public $email;
    public $listado;

    public function listarAsignaciones()
    {
        $usuario = $_SESSION["usuario"];
        $model    = new Conexion;
        $conexion = $model->conectar();
        if ($this->validaAdministrador($usuario["id_perfil"])) {
            $sql = "
        			SELECT 
        				cag.*, cags.tipo_vehiculo
        			FROM 
        				cmx_agrupaciones cag 
        				INNER JOIN cmx_agrupacion_solicitudes cags ON cag.id = cags.id_agrupacion 
        				INNER JOIN cmx_agrupaciones_vehiculos cav ON cag.id = cav.id_agrupacion 
        				INNER JOIN cmx_solicitudes cs ON cs.id = cags.id_solicitud
        			WHERE 
        				cav.estado IN ('Asignado','Propuesto','Preaprobado','Pendiente','No Aprobado','Cancelado')
        			GROUP BY cag.codigo_rojo DESC, cag.fecha_hora_operacion ASC, cag.id ASC;
        		";
        } else {
            $sql = "
                SELECT 
                    cag.*, cags.tipo_vehiculo
                FROM 
                    cmx_agrupaciones cag 
                    INNER JOIN cmx_agrupacion_solicitudes cags ON cag.id = cags.id_agrupacion 
                    INNER JOIN cmx_agrupaciones_vehiculos cav ON cag.id = cav.id_agrupacion 
                    INNER JOIN cmx_solicitudes cs ON cs.id = cags.id_solicitud
                    INNER JOIN cmx_integracion_soluc_import cisi ON cisi.id_solucion = cs.id
                    INNER JOIN cmx_importacion_actividades cia ON cia.id = cisi.id_importacion_actividad
                    INNER JOIN cmx_importacion_proyecto cip ON cip.id = cia.id_importacion
                WHERE 
                        cav.estado IN ('Asignado','Propuesto','Preaprobado','Pendiente','No Aprobado','Cancelado')
                        AND cip.estado = 1
                        AND cia.nombre = 'Aprobar Vehículo'
                        AND cia.estado = 2
                        AND cia.perfil_responsable IN (
                            SELECT cuc1.id_perfil
                            FROM cmx_clientes_serv_contratados ccsc1 
                                INNER JOIN cmx_clientes_serv_responsables ccsr1 ON ccsr1.id_serv_contratado = ccsc1.id
                                INNER JOIN cmx_usuario_cliente cuc1 ON cuc1.id_usuario = ccsr1.id_usuario
                            WHERE ccsc1.estado = 1
                                AND ccsr1.estado = 1
                                AND ccsc1.id_cliente = cip.id_cliente
                                AND ccsr1.id_usuario = " . $usuario["id_usuario"] . "
                                AND cuc1.id_perfil = " . $usuario["id_perfil"] . "
                                AND ccsc1.servicio = (
                                    SELECT 
                                        CASE
                                            WHEN cip.tipo_operacion = 'IMPORTACION' THEN 'Transporte de Carga Internacional'
                                            WHEN cip.tipo_operacion = 'EXPORTACION' THEN 'Transporte de Carga Internacional'
                                            WHEN cip.tipo_operacion = 'NACIONAL_AEREO' THEN 'Transporte de Carga Internacional'
                                            WHEN cip.tipo_operacion = 'NACIONAL' THEN 'Transporte de Carga Nacional'
                                            WHEN cip.tipo_operacion = 'URBANO' THEN 'Transporte de Carga Nacional'
                                            ELSE 'No definido'
                                        END
                                )
                        )
                    GROUP BY cag.codigo_rojo DESC, cag.fecha_hora_operacion ASC, cag.id ASC;
                ";
        }
        $array = $this->_db->getConsulta($sql);

        if ($array) {
            $this->respuesta = "GOOD";
            $this->mensaje = $array["rowsNum"];
            foreach ($array["rowsData"] as $key => $datos_agrupaciones) {
                // Se pregunta si la agrupacion ya tiene un vehículo aprobado
                $sql = "
                        SELECT
                            cv.placa, cav.estado,
                            cav.id as 'id_agrupacion_solicitud',
                            cav.tipo_tramite,cv.id as 'id_vehiculo'
                        FROM 
                            cmx_vehiculos cv
                            INNER JOIN cmx_agrupaciones_vehiculos cav ON cv.id = cav.id_vehiculo
                            INNER JOIN cmx_agrupaciones ca ON ca.id = cav.id_agrupacion
                        WHERE
                            cav.id_agrupacion = " . $datos_agrupaciones["id"] . "
                            AND cav.estado IN ('Aprobado','Anticipo Asignado','Planillado');
                    ";
                $consulta_asignaciones = $conexion->prepare($sql);
                $consulta_asignaciones->execute();
                $total_aprobados = $consulta_asignaciones->rowCount();
                // Si no tiene vehículos aprobados se busca la información de los vehículos propuestos
                if ($total_aprobados == 0) {
                    $sql      = " SELECT * FROM cmx_tipo_vehiculos WHERE id = " . $datos_agrupaciones["tipo_vehiculo"] . " LIMIT 1";
                    $consulta_vehiculo = $conexion->prepare($sql);
                    $consulta_vehiculo->execute();
                    $total_vehiculo = $consulta_vehiculo->rowCount();
                    $datos_vehiculo = $consulta_vehiculo->fetch();

                    if ($total_vehiculo == 0) {
                        $datos_agrupaciones["tipo_vehiculo"] = "";
                    } else {
                        $datos_agrupaciones["tipo_vehiculo"] = $datos_vehiculo["nombre"];
                    }
                    $sql = "
                            SELECT CONCAT('<span>',cs.numero_solicitud,'</span><span class= \"\cell-detail-description\"\>(Peso: ',FORMAT(cas.peso_parcial,2),' Kg)</span>') as 'numero_solicitud',
                                cc.nombre NOM_CLIENTE
                            FROM 
                                cmx_solicitudes cs, 
                                cmx_clientes cc,
                                cmx_agrupaciones ca,
                                cmx_agrupacion_solicitudes cas 
                            WHERE 
                                cs.id = cas.id_solicitud
                                AND cc.id = cs.id_cliente
                                AND cas.id_agrupacion = ca.id 
                                AND ca.id = " . $datos_agrupaciones["id"] . "
                            GROUP BY cs.id
                        ";
                    $consulta_solicitudes = $conexion->prepare($sql);
                    $consulta_solicitudes->execute();
                    while ($datos_solicitudes = $consulta_solicitudes->fetch()) {
                        $datos_agrupaciones["solicitudes"][] = $datos_solicitudes["numero_solicitud"];
                        $datos_agrupaciones["clientes"][] = $datos_solicitudes["NOM_CLIENTE"];
                    }
                    $sql = "
                            SELECT
                                cv.placa, cav.estado,
                                cav.id as 'id_agrupacion_solicitud',
                                cav.tipo_tramite,cv.id as 'id_vehiculo'
                            FROM 
                                cmx_vehiculos cv
                                INNER JOIN cmx_agrupaciones_vehiculos cav ON cv.id = cav.id_vehiculo
                                INNER JOIN cmx_agrupaciones ca ON ca.id = cav.id_agrupacion
                            WHERE
                                cav.id_agrupacion = " . $datos_agrupaciones["id"] . "
                                AND cav.estado IN ('Asignado','Propuesto','Preaprobado','Pendiente');
                        ";
                    $consulta_asignaciones = $conexion->prepare($sql);
                    $consulta_asignaciones->execute();
                    $datos_agrupaciones["vehiculos"] = array();
                    while ($datos_asignaciones = $consulta_asignaciones->fetch()) {
                        $datos_agrupaciones["vehiculos"][] = $datos_asignaciones;
                    }
                    $this->listado[] = $datos_agrupaciones;
                }
            }
        } else {
            $this->respuesta = "BAD";
        }
    }

    public function listarControlAsignaciones()
    {
        $model    = new Conexion;
        $conexion = $model->conectar();
        // $sql      = "
        //         SELECT 
        //             cag.*, cags.tipo_vehiculo,
        //             (
        //                 SELECT 
        //                     COUNT(cav1.id)
        //                 FROM 
        //                     cmx_agrupaciones_vehiculos cav1
        //                 WHERE
        //                     cav.id_agrupacion = cav1.id_agrupacion
        //                     AND cav1.estado IN ('Aprobado','Anticipo Asignado','Planillado')
        //             ) APROBADOS
        //         FROM 
        //             cmx_agrupaciones cag 
        //             INNER JOIN cmx_agrupacion_solicitudes cags ON cag.id = cags.id_agrupacion 
        //             INNER JOIN cmx_agrupaciones_vehiculos cav ON cag.id = cav.id_agrupacion 
        //             INNER JOIN cmx_solicitudes cs ON cs.id = cags.id_solicitud
        //         WHERE 
        //             cav.estado IN ('Verificacion Flete')
        //         GROUP BY cag.codigo_rojo DESC, cag.fecha_hora_operacion ASC, cag.id ASC";
        $sql = "
    SELECT 
        cag.*, 
        cags.tipo_vehiculo,
        (
            SELECT 
                COUNT(cav1.id)
            FROM 
                cmx_agrupaciones_vehiculos cav1
            WHERE
                cav.id_agrupacion = cav1.id_agrupacion
                AND cav1.estado IN ('Aprobado', 'Anticipo Asignado', 'Planillado')
        ) AS APROBADOS
    FROM 
        cmx_agrupaciones cag 
        INNER JOIN cmx_agrupacion_solicitudes cags ON cag.id = cags.id_agrupacion 
        INNER JOIN cmx_agrupaciones_vehiculos cav ON cag.id = cav.id_agrupacion 
        INNER JOIN cmx_solicitudes cs ON cs.id = cags.id_solicitud
    WHERE 
        cav.estado IN ('Verificacion Flete')
    GROUP BY cag.id
    ORDER BY cag.codigo_rojo DESC, cag.fecha_hora_operacion ASC, cag.id ASC";

        $consulta = $conexion->prepare($sql);
        $consulta->execute();
        $total         = $consulta->rowCount();
        $this->mensaje = $total;
        if ($total == 0) {
            $this->respuesta = "BAD";
        } else {
            $this->respuesta = "GOOD";
            while ($datos_agrupaciones = $consulta->fetch()) {
                if ($datos_agrupaciones["APROBADOS"] == 0) {
                    $sql      = " SELECT * FROM cmx_tipo_vehiculos WHERE id = " . $datos_agrupaciones["tipo_vehiculo"] . " LIMIT 1";
                    $consulta_vehiculo = $conexion->prepare($sql);
                    $consulta_vehiculo->execute();
                    $total_vehiculo = $consulta_vehiculo->rowCount();
                    $datos_vehiculo = $consulta_vehiculo->fetch();

                    if ($total_vehiculo == 0) {
                        $datos_agrupaciones["tipo_vehiculo"] = "";
                    } else {
                        $datos_agrupaciones["tipo_vehiculo"] = $datos_vehiculo["nombre"];
                    }
                    $sql = "SELECT CONCAT('<span>',cs.numero_solicitud,'</span><span class= \"\cell-detail-description\"\>(Peso: ',FORMAT(cas.peso_parcial,2),' Kg)</span>') as 'numero_solicitud',
                        		cc.nombre NOM_CLIENTE
                        	FROM 
                        		cmx_solicitudes cs, 
                        		cmx_clientes cc,
                        		cmx_agrupaciones ca,
                        		cmx_agrupacion_solicitudes cas 
                        	WHERE 
                        		cs.id = cas.id_solicitud
                        		AND cc.id = cs.id_cliente
                        		AND cas.id_agrupacion = ca.id 
                        		AND ca.id = " . $datos_agrupaciones["id"] . "
                        	GROUP BY cs.id
                        ";
                    $consulta_solicitudes = $conexion->prepare($sql);
                    $consulta_solicitudes->execute();
                    while ($datos_solicitudes = $consulta_solicitudes->fetch()) {
                        $datos_agrupaciones["solicitudes"][] = $datos_solicitudes["numero_solicitud"];
                        $datos_agrupaciones["clientes"][] = $datos_solicitudes["NOM_CLIENTE"];
                    }
                    $sql = "
                            SELECT 
                                cv.placa, cav.estado, cav.id as 'id_agrupacion_solicitud', cav.flete, 
                                cav.tipo_tramite,cv.id as 'id_vehiculo'
                            FROM 
                                cmx_vehiculos cv
                                INNER JOIN cmx_agrupaciones_vehiculos cav ON cv.id = cav.id_vehiculo
                                INNER JOIN cmx_agrupaciones ca ON ca.id = cav.id_agrupacion
                            WHERE 
                                cav.id_agrupacion = " . $datos_agrupaciones["id"] . "
                                AND cav.estado IN ('Verificacion Flete')
                            ORDER BY cav.flete;
                        ";
                    $consulta_asignaciones = $conexion->prepare($sql);
                    $consulta_asignaciones->execute();
                    $datos_agrupaciones["vehiculos"] = array();
                    while ($datos_asignaciones = $consulta_asignaciones->fetch()) {
                        $datos_agrupaciones["vehiculos"][] = $datos_asignaciones;
                    }

                    $this->listado[] = $datos_agrupaciones;
                }
            }
        }
    }
}
