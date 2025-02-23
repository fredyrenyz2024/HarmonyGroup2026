<?php
session_start();

//Construcción del envio de correos
// require 'libs/PHPMailer/PHPMailerAutoload.php';
require 'libs/PHPMailer/src/PHPMailer.php';
require 'libs/PHPMailer/src/SMTP.php';
require 'libs/PHPMailer/src/Exception.php';

// Usa los espacios de nombres correspondientes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class tableroseguimientoModel extends Model
{
    public function __construct()
    {
        parent::__construct();
    }

    public function getPruebas()
    {
        $sql = "";
        $result = $this->_db->getConsulta($sql);
        return $result;
    }

    public function consulta_agencia()
    {
        try {
            $fecha = date('Y-m-d');
            $sql = "SELECT * FROM cmx_agencias
				WHERE estado='Activo'";
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function consulta_municipios()
    {
        try {
            $sql = "SELECT id, municipio, depto, rndc_codigo_ciudad
				FROM cmx_municipios
				WHERE pais='COLOMBIA'
				ORDER BY municipio ASC";
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function consulta_clientes()
    {
        try {
            $sql = "SELECT id, nombre, documento, digito_verificacion
			FROM cmx_clientes
			WHERE estado=1
			ORDER BY nombre ASC";
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function consulta_conductor()
    {
        try {
            $sql = "SELECT p.nombre, p.id,
			p.numero_documento,p.digito_verificacion
			FROM cmx_proveedores p
			INNER JOIN cmx_actividad_proveedor a
			ON p.id=a.id_proveedor
			WHERE a.actividad='Conductor'
			ORDER BY nombre ASC";
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function consulta_Datos($nummani, $tipomnf, $ffecha, $agenci, $origen, $desti, $fcliente, $fechaultima, $fconductor)
    {
        try {
            if ($nummani !== '' && $nummani !== null) {
                $numero_manifiesto = 'ma.id=' . $nummani . '';
                $op = 'AND ';
            } else {
                $numero_manifiesto = '';
                $op = '';
            }
            if ($tipomnf !== '' && $tipomnf !== null) {
                $tipo_manifiesto = $op . 'ma.tipo_manifiesto=' . $tipomnf . '';
                $op = 'AND ';
            } else {
                $tipo_manifiesto = '';
                $op = '';
            }
            if ($ffecha !== '' && $ffecha !== null) {
                $fecha_manifiesto = $op . 'ma.fecha_expedicion="' . $ffecha . '"';
                $op = 'AND ';
            } else {
                $fecha_manifiesto = '';
                $op = '';
            }
            if ($agenci !== '' && $agenci !== null) {
                $agencia = $op . 'ma.Lugar="' . $agenci . '"';
                $op = 'AND ';
            } else {
                $agencia = '';
                $op = '';
            }
            if ($origen !== '' && $origen !== null && $origen !== 'null') {
                $origen_manifiesto = $op . 'ma.origen_viaje=' . $origen . '';
                $op = 'AND ';
            } else {
                $origen_manifiesto = '';
                $op = '';
            }
            if ($desti !== '' && $desti !== null && $desti !== 'null') {
                $destino_manifiesto = $op . 'ma.destino_viaje=' . $desti . '';
                $op = 'AND ';
            } else {
                $destino_manifiesto = '';
                $op = '';
            }
            if ($fcliente !== '' && $fcliente !== null) {
                $cliente = '';
                $op = 'AND ';
            } else {
                $cliente = '';
                $op = '';
            }
            if ($fechaultima != '') {
            }
            if (
                $fconductor !== '' && $fconductor !== null && $fconductor !== 'NULL'
                && $fconductor !== 'null'
            ) {
                $conductor_manifiesto = $op . 'ma.conductor_manifiesto=' . $fconductor . '';
                $op = 'AND ';
            } else {
                $conductor_manifiesto = '';
                $op = '';
            }
            $sql = "SELECT ma.*,
			pro.nombre , pro.apellido1, pro.apellido2,
			pro.contacto,
			mn1.municipio AS origen,
			mn2.municipio AS destino,
			inr.cod_inicio AS cod_ini_ruta
			FROM cmx_manifiesto ma
			INNER JOIN cmx_proveedores pro ON ma.conductor_manifiesto=pro.numero_documento
			INNER JOIN cmx_municipios mn1 ON ma.origen_viaje=mn1.id
			INNER JOIN cmx_municipios mn2 ON ma.destino_viaje=mn2.id
			LEFT JOIN cmx_cumplido cu ON ma.id=cu.manifiesto
			LEFT JOIN cmx_inicio_ruta inr ON ma.id=inr.num_manifiesto
			WHERE
				" . $numero_manifiesto . "
				" . $tipo_manifiesto . "
				" . $agencia . "
				" . $origen_manifiesto . "
				" . $destino_manifiesto . "
				" . $conductor_manifiesto . "
				" . $fecha_manifiesto . "
				 AND cu.manifiesto IS NULL
			";
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchall();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Datos_SinFiltro()
    {
        try {
            // Inicia la transacción
            $this->_db3->beginTransaction();

            // Consulta original para obtener los datos
            $sql = "SELECT ins.tiempo, ma.*, pro.nombre AS nombre_conductor, pro.apellido1, 
            pro.apellido2, pro.celular,mn1.municipio AS origen, mn2.municipio AS destino,inr.cod_inicio AS cod_ini_ruta, cl.nombre, oc.mer_producto, dm.tipo_transporte
            FROM cmx_manifiesto ma
            INNER JOIN cmx_proveedores pro ON ma.conductor_manifiesto = pro.numero_documento
            INNER JOIN cmx_municipios mn1 ON ma.origen_viaje = mn1.id
            INNER JOIN cmx_municipios mn2 ON ma.destino_viaje = mn2.id
            INNER JOIN cmx_inicio_ruta inr ON ma.id = inr.num_manifiesto
            INNER JOIN cmx_manifiesto_remesa mr ON mr.id_manifiesto = ma.id
            INNER JOIN cmx_remesa r ON r.id = mr.id_remesa
            INNER JOIN cmx_remesa_ordencargue ro ON ro.id_remesa = r.id
            INNER JOIN cmx_orden_cargue oc ON oc.id = ro.id_orden_cargue
            INNER JOIN cmx_clientes cl ON cl.id = oc.cli_id
            INNER JOIN cmx_solicitud_vehiculo2 ss ON ss.nundoc_solicitud = oc.mer_idservicio
            INNER JOIN cmx_cotizaciones_serviciocliente cs ON cs.n_cotizacion = ss.n_cotizacion
            INNER JOIN cmx_detalle_mercancia2 dm ON dm.n_cotizacion = cs.n_cotizacion
            LEFT JOIN cmx_cumplido cu ON ma.id = cu.manifiesto
            LEFT JOIN (SELECT s1.* FROM  cmx_inicio_seguimiento s1
            INNER JOIN (SELECT  cod_ini_ruta, MAX(id) AS max_id FROM  cmx_inicio_seguimiento WHERE tipo_proceso = 'seguimiento'
            GROUP BY cod_ini_ruta) s2 ON s1.cod_ini_ruta = s2.cod_ini_ruta AND s1.id = s2.max_id) ins ON ins.cod_ini_ruta = inr.cod_inicio
            WHERE cu.manifiesto IS NULL AND ma.estado_seguimiento = 'SEGUIMIENTO'
            GROUP BY ma.placa, ma.id ORDER BY ins.tiempo DESC";

            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            $data = $resultado->fetchAll();

            // Confirma la transacción
            $this->_db3->commit();
            // Retorna ambos resultados
            return [
                'data' => $data,
            ];
        } catch (PDOException $e) {
            // Realiza un rollback en caso de error
            $this->_db3->rollBack();

            // Manejo del error
            $error = $e->getMessage();
            throw new Exception("Error en la consulta: " . $error);
        }
    }

    public function Contadores_SinFiltros()
    {
        try {
            // Inicia la transacción
            $this->_db3->beginTransaction();
            // Nueva consulta para contar los manifiestos en seguimiento
            $sql_total_Seguimiento = "SELECT COUNT(DISTINCT ma.id,inr.num_manifiesto) AS total_manifiestos_seguimiento
            FROM cmx_manifiesto ma
            INNER JOIN cmx_inicio_ruta inr ON ma.id = inr.num_manifiesto
            LEFT JOIN cmx_cumplido cu ON ma.id = cu.manifiesto
            WHERE cu.manifiesto IS NULL AND ma.estado_seguimiento='SEGUIMIENTO'";
            $resultado_total = $this->_db3->query($sql_total_Seguimiento);
            $resultado_total->setFetchMode(PDO::FETCH_ASSOC);
            $total_manifiestos_seguimiento = $resultado_total->fetch();

            // Nueva consulta para contar los manifiestos en seguimiento Y llegada
            $sql_total_general = "SELECT COUNT(DISTINCT ma.id) AS total_manifiestos_general
            FROM cmx_manifiesto ma
            INNER JOIN cmx_inicio_ruta inr ON ma.id = inr.num_manifiesto
            LEFT JOIN cmx_cumplido cu ON ma.id = cu.manifiesto
            WHERE cu.manifiesto IS NULL AND ma.estado_seguimiento IN ('SEGUIMIENTO', 'LLEGADA')";
            $resultado_total_general = $this->_db3->query($sql_total_general);
            $resultado_total_general->setFetchMode(PDO::FETCH_ASSOC);
            $total_manifiestos_general = $resultado_total_general->fetch();


            // Nueva consulta para contar los manifiestos en llegada
            $sql_total_Seguimiento_llegada = "SELECT COUNT(DISTINCT ma.id) AS total_manifiestos_llegada
            FROM cmx_manifiesto ma
            INNER JOIN cmx_inicio_ruta inr ON ma.id = inr.num_manifiesto
            LEFT JOIN cmx_cumplido cu ON ma.id = cu.manifiesto
            WHERE cu.manifiesto IS NULL AND ma.estado_seguimiento = 'LLEGADA'";
            $resultado_total_llegada = $this->_db3->query($sql_total_Seguimiento_llegada);
            $resultado_total_llegada->setFetchMode(PDO::FETCH_ASSOC);
            $total_manifiestos_llegada = $resultado_total_llegada->fetch();

            // Confirma la transacción
            $this->_db3->commit();
            // Retorna ambos resultados
            return [
                'total_manifiestos_seguimiento' => $total_manifiestos_seguimiento['total_manifiestos_seguimiento'],
                'total_manifiestos_general' => $total_manifiestos_general['total_manifiestos_general'],
                'total_manifiestos_llegada' => $total_manifiestos_llegada['total_manifiestos_llegada'],
            ];
        } catch (\Throwable $th) {
            // Realiza un rollback en caso de error
            $this->_db3->rollBack();
            // Manejo del error
            $error = $th->getMessage();
            throw new Exception("Error en la consulta: " . $error);
        }
    }

    /* Funcion para lisatr los seguimientos que ya les dieon llegada */
    public function listar_seguimientos_llegada()
    {
        $response = [];
        try {
            $sql = "SELECT ma.*,pro.nombre, pro.apellido1, pro.apellido2,pro.celular,mn1.municipio AS origen, mn2.municipio AS destino,
            inr.cod_inicio AS cod_ini_ruta, cl.nombre,oc.mer_producto,dm.tipo_transporte
            FROM cmx_manifiesto ma
            INNER JOIN cmx_proveedores pro ON ma.conductor_manifiesto=pro.numero_documento
            INNER JOIN cmx_municipios mn1 ON ma.origen_viaje=mn1.id
            INNER JOIN cmx_municipios mn2 ON ma.destino_viaje=mn2.id
            INNER JOIN cmx_inicio_ruta inr ON ma.id=inr.num_manifiesto
            INNER JOIN cmx_manifiesto_remesa mr ON mr.id_manifiesto=ma.id
            INNER JOIN cmx_remesa r ON r.id=mr.id_remesa
            INNER JOIN cmx_remesa_ordencargue ro ON ro.id_remesa=r.id
            INNER JOIN cmx_orden_cargue oc ON oc.id=ro.id_orden_cargue
            INNER JOIN cmx_clientes cl ON cl.id=oc.cli_id
            INNER JOIN cmx_solicitud_vehiculo2 ss ON ss.nundoc_solicitud=oc.mer_idservicio
           	INNER JOIN cmx_cotizaciones_serviciocliente cs ON cs.n_cotizacion=ss.n_cotizacion
            INNER JOIN cmx_detalle_mercancia2 dm ON dm.n_cotizacion=cs.n_cotizacion
            LEFT JOIN cmx_inicio_seguimiento ins ON ins.cod_ini_ruta=inr.cod_inicio
            LEFT JOIN cmx_cumplido cu ON ma.id=cu.manifiesto
            WHERE cu.manifiesto IS NULL AND ma.estado_seguimiento='LLEGADA' GROUP BY ma.placa,ma.id ORDER BY ins.tiempo ASC";
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchAll();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function listar_seguimientos_salida()
    {
        try {
            $sql =   $this->_db3->prepare("SELECT ma.*,pro.nombre AS 'Nombre_Conductor', pro.apellido1, pro.apellido2,
            pro.celular, mn1.municipio AS origen, mn2.municipio AS destino,
            inr.cod_inicio AS cod_ini_ruta, /*cl.nombre,oc.mer_producto,dm.tipo_transporte,*/vh.web_satelital
            FROM cmx_manifiesto ma
            INNER JOIN cmx_proveedores pro ON ma.conductor_manifiesto=pro.numero_documento
            INNER JOIN cmx_municipios mn1 ON ma.origen_viaje=mn1.id
            INNER JOIN cmx_municipios mn2 ON ma.destino_viaje=mn2.id
            INNER JOIN cmx_inicio_ruta inr ON ma.id=inr.num_manifiesto
            INNER JOIN cmx_manifiesto_remesa mr ON mr.id_manifiesto=ma.id
            INNER JOIN cmx_vehiculos vh ON ma.placa=vh.placa
            LEFT JOIN cmx_inicio_seguimiento ins ON ins.cod_ini_ruta=inr.cod_inicio
            LEFT JOIN cmx_cumplido cu ON ma.id=cu.manifiesto
            WHERE cu.manifiesto IS NULL AND ma.estado_seguimiento='SALIDA' GROUP BY ma.placa,ma.id ORDER BY ins.tiempo ASC");

            $sql->execute();
            return $sql->fetchAll();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    function Traer_codigo_punto($cod_inicio)
    {
        $sql_codpunto = $this->_db3->prepare("SELECT dp.cod_punto FROM cmx_inicio_seguimiento ise
            INNER JOIN  cmx_planruta_detalle dp ON ise.codigo_punto=dp.cod_punto
            WHERE ise.cod_ini_ruta=:codigo_inicio AND dp.nombre_punto='Lugar Llegada' GROUP BY ise.novedad");
        $sql_codpunto->bindParam(':codigo_inicio', $cod_inicio);
        $sql_codpunto->execute();
        $resultado = $sql_codpunto->fetch(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Finalizar_seguimiento_trafico($maniesto, $cod_inicio, $cod_punto)
    {
        $sql_update_punto = $this->_db3->prepare("UPDATE cmx_inicio_seguimiento SET estado_punto='CERRADO' WHERE cod_ini_ruta=:codigo_inicio AND codigo_punto=:codigo_punto");
        $sql_update_punto->bindParam(':codigo_inicio', $cod_inicio);
        $sql_update_punto->bindParam(':codigo_punto', $cod_punto);
        $sql_update_punto->execute();
        if ($sql_update_punto) {
            $sql_update_manifiesto = $this->_db3->prepare("UPDATE cmx_manifiesto SET estado_seguimiento='FINALIZADO' WHERE id=:manifiesto");
            $sql_update_manifiesto->bindParam(':manifiesto', $maniesto);
            $sql_update_manifiesto->execute();
            if ($sql_update_manifiesto) {
                $response = array('numero' => 200, 'mensaje' => 'Manifiesto Finalizado exitosamente en NexosApp.');
                return $response;
            } else {

                $mensajeError = 'Error al actualiza el manifiesto ' . date("Y-m-d");
                error_log($mensajeError . "\n", 3, "error_log.txt");
            }
        } else {
            $mensajeError = 'Error al actualizar el punto final ' . date("Y-m-d");
            error_log($mensajeError . "\n", 3, "error_log.txt");
        }
    }



    public function Filtro_Mnifiesto($dato)
    {
        try {
            $sql = $this->_db3->prepare("SELECT ma.*,pro.nombre AS nombre_conductor, pro.apellido1, pro.apellido2,
            pro.celular,mn1.municipio AS origen, mn2.municipio AS destino,inr.cod_inicio AS cod_ini_ruta, cl.nombre,oc.mer_producto,dm.tipo_transporte
            FROM cmx_manifiesto ma
            INNER JOIN cmx_proveedores pro ON ma.conductor_manifiesto=pro.numero_documento
            INNER JOIN cmx_municipios mn1 ON ma.origen_viaje=mn1.id
            INNER JOIN cmx_municipios mn2 ON ma.destino_viaje=mn2.id
            LEFT JOIN cmx_cumplido cu ON ma.id=cu.manifiesto
            LEFT JOIN cmx_inicio_ruta inr ON ma.id=inr.num_manifiesto
            INNER JOIN cmx_manifiesto_remesa mr ON mr.id_manifiesto=ma.id
            INNER JOIN cmx_remesa r ON r.id=mr.id_remesa
            INNER JOIN cmx_remesa_ordencargue ro ON ro.id_remesa=r.id
            INNER JOIN cmx_orden_cargue oc ON oc.id=ro.id_orden_cargue
            INNER JOIN cmx_clientes cl ON cl.id=oc.cli_id
             INNER JOIN cmx_solicitud_vehiculo2 ss ON ss.id=oc.mer_idservicio
            INNER JOIN cmx_cotizaciones_serviciocliente cs ON cs.id=ss.n_cotizacion
            INNER JOIN cmx_detalle_mercancia2 dm ON dm.n_cotizacion=cs.n_cotizacion
            LEFT JOIN (SELECT s.* FROM cmx_inicio_seguimiento s WHERE s.tipo_proceso IN ('seguimiento') AND s.id = (SELECT MAX(s2.id)  FROM cmx_inicio_seguimiento s2 WHERE s2.cod_ini_ruta = s.cod_ini_ruta AND s2.tipo_proceso IN ('seguimiento'))) ins ON ins.cod_ini_ruta = inr.cod_inicio
            WHERE cu.manifiesto IS NULL AND ma.estado_seguimiento='SEGUIMIENTO' 
            AND (ma.id LIKE :dato OR ma.placa LIKE :dato OR pro.celular LIKE :dato 
            OR pro.nombre LIKE :dato OR CONCAT(pro.apellido1,' ',pro.apellido2) LIKE :dato 
            OR CONCAT(pro.nombre,' ',pro.apellido1,' ',pro.apellido2) LIKE :dato
            OR pro.numero_documento LIKE :dato
            OR cl.nombre LIKE :dato
            OR cl.documento LIKE :dato) 
            GROUP BY ma.placa,ma.id ORDER BY ins.tiempo ASC");
            $data = '%' . $dato . '%';
            $sql->bindParam(':dato', $data);
            $sql->execute();
            return $resultado = $sql->fetchAll();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function Filtro_Mnifiesto_llegada($dato)
    {
        try {
            $sql = $this->_db3->prepare("SELECT ma.*,pro.nombre, pro.apellido1, pro.apellido2,
            pro.celular,
            mn1.municipio AS origen, mn2.municipio AS destino,
            inr.cod_inicio AS cod_ini_ruta, cl.nombre,oc.mer_producto,dm.tipo_transporte
            FROM cmx_manifiesto ma
            INNER JOIN cmx_proveedores pro ON ma.conductor_manifiesto=pro.numero_documento
            INNER JOIN cmx_municipios mn1 ON ma.origen_viaje=mn1.id
            INNER JOIN cmx_municipios mn2 ON ma.destino_viaje=mn2.id
            LEFT JOIN cmx_cumplido cu ON ma.id=cu.manifiesto
            LEFT JOIN cmx_inicio_ruta inr ON ma.id=inr.num_manifiesto
            INNER JOIN cmx_manifiesto_remesa mr ON mr.id_manifiesto=ma.id
            INNER JOIN cmx_remesa r ON r.id=mr.id_remesa
            INNER JOIN cmx_remesa_ordencargue ro ON ro.id_remesa=r.id
            INNER JOIN cmx_orden_cargue oc ON oc.id=ro.id_orden_cargue
            INNER JOIN cmx_clientes cl ON cl.id=oc.cli_id
            INNER JOIN cmx_solicitud_vehiculo2 ss ON ss.id=oc.mer_idservicio
            INNER JOIN cmx_cotizaciones_serviciocliente cs ON cs.id=ss.n_cotizacion
            INNER JOIN cmx_detalle_mercancia2 dm ON dm.n_cotizacion=cs.n_cotizacion
            LEFT JOIN cmx_inicio_seguimiento ins ON ins.cod_ini_ruta=inr.cod_inicio
            WHERE cu.manifiesto IS NULL AND ma.estado_seguimiento='LLEGADA' 
            AND (ma.id LIKE :dato OR ma.placa LIKE :dato OR pro.celular LIKE :dato 
            OR pro.nombre LIKE :dato OR CONCAT(pro.apellido1,' ',pro.apellido2) LIKE :dato 
            OR CONCAT(pro.nombre,' ',pro.apellido1,' ',pro.apellido2) LIKE :dato
            OR pro.numero_documento LIKE :dato
            OR cl.nombre LIKE :dato
            OR cl.documento LIKE :dato) 
            GROUP BY ma.placa,ma.id ORDER BY ins.tiempo ASC");
            $data = '%' . $dato . '%';
            $sql->bindParam(':dato', $data);
            $sql->execute();
            return $resultado = $sql->fetchAll();
        } catch (PDOException $e) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    /* Nuevas Funciones */

    public function Ultima_Novedad($datos)
    {
        $sql = $this->_db3->prepare("SELECT s.*, n.color_alerta, n.novedad, n.genera_alerta
        FROM cmx_inicio_seguimiento s
        INNER JOIN cmx_para_novedades_seguimiento n ON s.novedad=n.novedad
        WHERE s.cod_ini_ruta=:cod_inicia AND s.tipo_proceso IN('seguimiento')
        AND s.id IN(SELECT MAX(s.id) FROM cmx_inicio_seguimiento s WHERE s.cod_ini_ruta=:cod_inicia AND s.tipo_proceso IN('seguimiento')) ORDER BY s.hora DESC");
        $sql->bindParam(':cod_inicia', $datos);
        $sql->execute();
        return $resultado = $sql->fetchAll();
    }

    public function Historial_Seguimiento($tipo, $num_manifiesto, $fecha_inicial, $fecha_final, $cliente)
    {
        $response = [];
        try {
            if ($tipo == 1) {
                $sql = "SELECT m.id, m.fecha_expedicion, m.placa, pro.numero_documento,
                CONCAT(pro.nombre,' ',pro.apellido1,' ',pro.apellido2) AS conductor, ptt.cod_inicio, ptt.id_estudio_seguridad,
                m1.municipio AS origen, m2.municipio AS destino,pro.celular
                FROM cmx_manifiesto m 
                INNER JOIN cmx_municipios m1
                ON m.origen_viaje=m1.id
                INNER JOIN cmx_municipios m2
                ON m.destino_viaje=m2.id
                INNER JOIN cmx_proveedores pro
                ON m.conductor_manifiesto=pro.numero_documento
                INNER JOIN cmx_inicio_ruta ptt ON m.id=ptt.num_manifiesto
                INNER JOIN cmx_salida_vehiculo sali ON ptt.num_manifiesto=sali.num_manifiesto
                LEFT JOIN cmx_inicio_seguimiento se ON ptt.cod_inicio=se.cod_ini_ruta
                WHERE m.fecha_expedicion BETWEEN '" . $fecha_inicial . "' AND '" . $fecha_final . "' GROUP BY se.cod_ini_ruta";
                $resultado = $this->_db3->query($sql);
                $resultado->setFetchMode(PDO::FETCH_ASSOC);
                $datos = $resultado->fetchAll();
                $response = $datos;
            } elseif ($tipo == 2) {
                $sql = "SELECT m.id, m.fecha_expedicion, m.placa, pro.numero_documento,
                CONCAT(pro.nombre,' ',pro.apellido1,' ',pro.apellido2) AS conductor, ptt.cod_inicio, ptt.id_estudio_seguridad,
                m1.municipio AS origen, m2.municipio AS destino,pro.celular
                FROM cmx_manifiesto m 
                INNER JOIN cmx_municipios m1 ON m.origen_viaje=m1.id
                INNER JOIN cmx_municipios m2 ON m.destino_viaje=m2.id
                INNER JOIN cmx_proveedores pro ON m.conductor_manifiesto=pro.numero_documento
                INNER JOIN cmx_inicio_ruta ptt ON m.id=ptt.num_manifiesto
                INNER JOIN cmx_salida_vehiculo sali ON ptt.num_manifiesto=sali.num_manifiesto
                LEFT JOIN cmx_inicio_seguimiento se ON ptt.cod_inicio=se.cod_ini_ruta
                WHERE m.id=" . $num_manifiesto . " GROUP BY se.cod_ini_ruta";
                $resultado = $this->_db3->query($sql);
                $resultado->setFetchMode(PDO::FETCH_ASSOC);
                $datos = $resultado->fetchAll();
                $response = $datos;
            } elseif ($tipo == 3) {
                $sql = "SELECT m.id, m.fecha_expedicion, m.placa, pro.numero_documento, CONCAT(pro.nombre,' ',pro.apellido1,' ',pro.apellido2) AS conductor, ptt.cod_inicio, ptt.id_estudio_seguridad,m1.municipio AS origen, m2.municipio AS destino,pro.celular
                FROM cmx_manifiesto m
                INNER JOIN cmx_municipios m1 ON m.origen_viaje=m1.id
                INNER JOIN cmx_municipios m2 ON m.destino_viaje=m2.id
                INNER JOIN cmx_proveedores pro ON m.conductor_manifiesto=pro.numero_documento
                INNER JOIN cmx_inicio_ruta ptt ON m.id=ptt.num_manifiesto
                INNER JOIN cmx_salida_vehiculo sali ON ptt.num_manifiesto=sali.num_manifiesto
                INNER JOIN cmx_manifiesto_remesa mr ON m.id = mr.id_manifiesto
                INNER JOIN cmx_remesa rm ON mr.id_remesa = rm.id
                INNER JOIN cmx_remesa_ordencargue ro ON rm.id = ro.id_remesa
                INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue=oc.id
                INNER JOIN cmx_clientes cl ON oc.cli_id = cl.id
                LEFT JOIN cmx_inicio_seguimiento se ON ptt.cod_inicio=se.cod_ini_ruta
                WHERE cl.id=" . $cliente . "
                GROUP BY se.cod_ini_ruta";
                $resultado = $this->_db3->query($sql);
                $resultado->setFetchMode(PDO::FETCH_ASSOC);
                $datos = $resultado->fetchAll();
                $response = $datos;
            }
            return $response;
        } catch (\Throwable $th) {
            // $this->_db3->rollBack();
            $error = $th->getMessage();
            $response = $error;
        }
    }


    public function seguimiento_cabecera($manifiesto)
    {
        try {
            $sql = "SELECT ma.id, ma.placa, concat(con.nombre,' ',con.apellido1,' ',con.apellido2) AS conductor, 
                con.numero_documento, mac.marca, confi.nombre AS configuracion, tra.placa AS placa_trailer,
                m1.municipio AS origen, m2.municipio AS destino, ase.nombre AS aseguradora
                FROM cmx_manifiesto ma
                INNER JOIN cmx_municipios m1 ON ma.origen_viaje=m1.id
                INNER JOIN cmx_municipios m2 ON ma.destino_viaje=m2.id
                INNER JOIN cmx_inicio_ruta i  ON ma.id=i.num_manifiesto
                INNER JOIN cmx_inicio_seguimiento seg ON seg.cod_ini_ruta=i.cod_inicio
                INNER JOIN cmx_proveedores con ON ma.conductor_manifiesto=con.numero_documento
                INNER JOIN cmx_vehiculos ve ON ma.placa=ve.placa
                INNER JOIN cmx_vehiculo2 vh ON ve.numdoc_vehiculo=vh.id_vehiculo
                INNER JOIN cmx_rndc_vehiculos_marcas mac ON vh.marca=mac.id
                INNER JOIN cmx_rndc_vehiculos_configuracion confi ON vh.configuracion=confi.id
                INNER JOIN cmx_rndc_aseguradoras ase ON vh.aseguradora=ase.id
                LEFT JOIN cmx_trailer_vehiculo trav ON ve.numdoc_vehiculo=trav.id_vehiculo AND trav.estado=1
                LEFT JOIN cmx_trailer tra ON trav.id_trailer=tra.id
                WHERE ma.id=" . $manifiesto;
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchAll();
        } catch (\Throwable $th) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }

    public function seguimiento_historia($manifiesto)
    {
        try {
            $sql = "SELECT IFNULL(m.municipio,pc.punto_controlador) AS Municipio,a.tipo_seguimiento,CONCAT(a.fecha,' - ',a.hora) AS fecha_nota,a.observacion, a.usuario,ppr.nom_punto,prd.nombre_punto,a.novedad,pc.punto_controlador
            FROM cmx_inicio_ruta ru
            INNER JOIN cmx_salida_vehiculo sali ON ru.num_manifiesto=sali.num_manifiesto
            INNER JOIN cmx_inicio_seguimiento a ON ru.cod_inicio=a.cod_ini_ruta
            LEFT JOIN cmx_seguimiento_servicio b ON a.id=b.id_seguimiento
            LEFT JOIN cmx_municipios m ON a.detalle_tipo=m.id
            LEFT JOIN cmx_puntos_controlador pc ON a.id=pc.seguimiento_id
            LEFT JOIN cmx_planruta_detalle prd ON prd.cod_punto=a.codigo_punto
            LEFT JOIN cmx_para_punto_ruta ppr ON ppr.id=a.codigo_punto
            WHERE ru.num_manifiesto=" . $manifiesto . "
            GROUP BY a.id ORDER BY a.id ASC";
            $resultado = $this->_db3->query($sql);
            $resultado->setFetchMode(PDO::FETCH_ASSOC);
            return $resultado->fetchAll();
        } catch (\Throwable $th) {
            $error = $e->getMessage();
            $this->_db3->rollBack();
        }
    }


    // public function enviar_correo_automatico($clientes,$manifiesto)
    public function enviar_correo_automatico()
    {
        $clientes = [56, 49];
        $manifiesto = 102540;
        $empresa_id = $_SESSION['usuario']['empresa_id'];
        $correos = [];
        $response = [];
        $factual = date('Y-m-d');
        $hactual = date('G:i:h');
        $user = $_SESSION["usuario"]["nom_usuario"];

        if (!empty($clientes)) {
            foreach ($clientes as $cliente_id) {
                // Realiza la primera consulta
                $sql = $this->_db3->prepare("SELECT g.id_cliente,g.nombre_grupo,gc.idgrupo,gc.nombre_contactos,gc.email,ch.hora_envio,g.id AS idgrupo, gc.id AS contacto_id FROM cmx_grupo g
                    INNER JOIN cmx_grupo_contacto_cliente gc ON g.id=gc.idgrupo AND g.id_cliente=gc.idcliente
                    INNER JOIN cmx_cliente_hora ch ON g.id_cliente=ch.id_cliente
                    WHERE g.id_cliente = :cliente");
                $sql->bindParam(':cliente', $cliente_id, PDO::PARAM_INT);
                $sql->execute();
                $datos_novedades = $sql->fetchAll(PDO::FETCH_ASSOC);

                // Solo continúa si se obtuvieron resultados en `$datos_novedades`
                if (!empty($datos_novedades)) {
                    foreach ($datos_novedades as $value) {
                        // $correos = [$value['email']];
                        $correos[] = $value['email'];
                        // Hora actual del servidor
                        $horaActual = date("H:i:s");

                        // Define el rango de tolerancia en segundos (por ejemplo, 10 minutos antes y después)
                        $tolerancia = 10 * 60; // 10 minutos en segundos

                        // Convierte las horas a timestamps para la comparación
                        $timestampHoraValidar = strtotime($value['hora_envio']);
                        $timestampHoraActual = strtotime($horaActual);

                        // Calcula el rango de inicio y fin permitidos
                        $rangoInicio = $timestampHoraValidar - $tolerancia;
                        $rangoFin = $timestampHoraValidar + $tolerancia;

                        // if ($timestampHoraActual >= $rangoInicio && $timestampHoraActual <= $rangoFin) {
                        //     // Realiza la segunda consulta
                        //     $sql_contactos = $this->_db3->prepare("SELECT *, g.id AS contacto_id FROM cmx_envio_contacto_cliente cc
                        //     INNER JOIN cmx_grupo g ON cc.grupo_id = g.id
                        //     INNER JOIN cmx_grupo_contacto_cliente gc ON cc.contacto_id = gc.id
                        //     INNER JOIN cmx_para_novedades_seguimiento n ON cc.novedad_id = n.id
                        //     INNER JOIN cmx_configuracion_envios ce ON g.id_cliente = ce.cliente_id
                        //     INNER JOIN cmx_plantilla_novedad_email ne ON ce.cliente_id = ne.cliente_id
                        //     WHERE g.id_cliente = :cliente AND cc.grupo_id = :Grupo AND cc.contacto_id = :Contacto 
                        //     AND ce.estado_configuracion = 'ACTIVO' AND ce.envio_automatico = 'SI' 
                        //     AND ne.reporta_cliente = 'SI' AND cc.empresa_id = :Empresa 
                        //     GROUP BY n.id");

                        //     $sql_contactos->bindParam(':cliente', $cliente_id, PDO::PARAM_INT);
                        //     $sql_contactos->bindParam(':Grupo', $value['idgrupo'], PDO::PARAM_INT);
                        //     $sql_contactos->bindParam(':Contacto', $value['contacto_id'], PDO::PARAM_INT);
                        //     $sql_contactos->bindParam(':Empresa', $empresa_id, PDO::PARAM_INT);
                        //     $sql_contactos->execute();
                        //     $datos_contactos = $sql_contactos->fetchAll(PDO::FETCH_ASSOC);

                        //     // Imprime los resultados
                        //     // var_dump($datos_contactos);
                        // } else {
                        //     $mensajeError = "La fecha de envío de la novedad no ha llegado a tiempo. No se enviará el email a: " . $value['email'] . " Grupo: " . $value['idgrupo'] . "<br>";
                        //     error_log($mensajeError, 3, "error_log.txt");
                        // }

                        // Realiza la segunda consulta para traser las novedades que se úedne enviar al cliente
                        $sql_contactos = $this->_db3->prepare("SELECT g.id AS contacto_id,n.novedad,gc.email,gc.nombre_contactos,gc.cargo,gc.areaa FROM cmx_envio_contacto_cliente cc
                          INNER JOIN cmx_grupo g ON cc.grupo_id = g.id
                          INNER JOIN cmx_grupo_contacto_cliente gc ON cc.contacto_id = gc.id
                          INNER JOIN cmx_para_novedades_seguimiento n ON cc.novedad_id = n.id
                          INNER JOIN cmx_configuracion_envios ce ON g.id_cliente = ce.cliente_id
                          INNER JOIN cmx_plantilla_novedad_email ne ON ce.cliente_id = ne.cliente_id
                          WHERE g.id_cliente = :cliente AND cc.grupo_id = :Grupo AND cc.contacto_id = :Contacto 
                          AND ce.estado_configuracion = 'ACTIVO' AND ce.envio_automatico = 'SI' 
                          AND ne.reporta_cliente='SI' AND cc.empresa_id=:Empresa 
                          GROUP BY n.id");
                        $sql_contactos->bindParam(':cliente', $cliente_id, PDO::PARAM_INT);
                        $sql_contactos->bindParam(':Grupo', $value['idgrupo'], PDO::PARAM_INT);
                    $sql_contactos->bindParam(':Contacto', $value['contacto_id'], PDO::PARAM_INT);
                        $sql_contactos->bindParam(':Empresa', $empresa_id, PDO::PARAM_INT);
                        $sql_contactos->execute();
                        $datos_contactos = $sql_contactos->fetchAll(PDO::FETCH_ASSOC);
                        // var_dump($datos_contactos);
                    }

                    if (isset($datos_contactos)) {
                        /* Consultar que plantilla es la que se utilizara para el envio del cliente */
                        $sql_plantilla = $this->_db3->prepare("SELECT * FROM cmx_plantillas_envio");
                        // $sql_plantilla->bindParam(':cliente_id', $cliente_id, PDO::PARAM_INT);
                        $sql_plantilla->execute();
                        $plantilla_envio = $sql_plantilla->fetchAll(PDO::FETCH_ASSOC);

                        foreach ($datos_contactos as $value) {
                            /* Consultar datos para enviar los correos */
                            $sql = $this->_db3->prepare("SELECT CONCAT(ise.fecha,' - ',ise.hora) AS fecha_trazabilidad,rd.observacion AS Referencia,ss.numero_contenedor,m.placa,
                            CONCAT(cond.nombre, ' ', cond.apellido1, ' ', cond.apellido2) AS Conductor,m.conductor_manifiesto,ori.municipio AS origen,des.municipio AS destino,
                            ise.novedad,IFNULL(mn.municipio, pc.punto_controlador) AS Municipio,ise.id AS seguimiento_inicio_id,ss.nundoc_solicitud,ss.agrupable
                            FROM cmx_inicio_ruta ir
                            INNER JOIN cmx_inicio_seguimiento ise ON ir.cod_inicio = ise.cod_ini_ruta
                            INNER JOIN cmx_manifiesto m ON ir.num_manifiesto = m.id
                            INNER JOIN cmx_manifiesto_remesa mr ON m.id = mr.id_manifiesto
                            INNER JOIN cmx_remesa rm ON mr.id_remesa = rm.id
                            INNER JOIN cmx_destinatarios_ss rd ON rm.id_destinatario = rd.id
                            INNER JOIN cmx_remesa_ordencargue ro ON rm.id = ro.id_remesa
                            INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue = oc.id
                            INNER JOIN cmx_solicitud_vehiculo2 ss ON oc.mer_idservicio = ss.nundoc_solicitud
                            INNER JOIN cmx_proveedores cond ON m.conductor_manifiesto = cond.numero_documento
                            INNER JOIN cmx_municipios ori ON m.origen_viaje = ori.id
                            INNER JOIN cmx_municipios des ON m.destino_viaje = des.id
                            INNER JOIN (SELECT cod_ini_ruta, MAX(CONCAT(fecha, ' ', hora)) AS max_fecha_hora FROM cmx_inicio_seguimiento WHERE novedad = :novedad
                            GROUP BY cod_ini_ruta) AS ult_novedad ON ise.cod_ini_ruta = ult_novedad.cod_ini_ruta AND CONCAT(ise.fecha, ' ', ise.hora) = ult_novedad.max_fecha_hora
                            LEFT JOIN cmx_municipios mn ON ise.detalle_tipo = mn.id
                            LEFT JOIN cmx_puntos_controlador pc ON ise.id = pc.seguimiento_id
                            LEFT JOIN cmx_mail_enviados me ON ise.id = me.id_fecha_parametro
                            WHERE ir.num_manifiesto = :manifiesto AND ise.novedad = :novedad AND me.id_fecha_parametro IS NULL");
                            
                            // $sql = $this->_db3->prepare("SELECT CONCAT(ise.fecha,' - ',ise.hora) AS fecha_trazabilidad,rd.observacion AS Referencia,ss.numero_contenedor,m.placa,
                            // CONCAT(cond.nombre,' ',cond.apellido1,' ',cond.apellido2) AS Conductor,m.conductor_manifiesto,ori.municipio AS origen,des.municipio AS destino,
                            // ise.novedad,IFNULL(mn.municipio,pc.punto_controlador) AS Municipio,ise.id AS seguimiento_inicio_id,ss.nundoc_solicitud,ss.agrupable
                            // FROM cmx_inicio_ruta ir 
                            // INNER JOIN cmx_inicio_seguimiento ise ON ir.cod_inicio=ise.cod_ini_ruta
                            // INNER JOIN cmx_manifiesto m ON ir.num_manifiesto=m.id
                            // INNER JOIN cmx_manifiesto_remesa mr ON m.id=mr.id_manifiesto
                            // INNER JOIN cmx_remesa rm ON mr.id_remesa=rm.id
                            // INNER JOIN cmx_destinatarios_ss rd ON rm.id_destinatario=rd.id
                            // INNER JOIN cmx_remesa_ordencargue ro ON rm.id=ro.id_remesa
                            // INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue=oc.id
                            // INNER JOIN cmx_solicitud_vehiculo2 ss ON oc.mer_idservicio=ss.nundoc_solicitud
                            // INNER JOIN cmx_proveedores cond ON m.conductor_manifiesto=cond.numero_documento
                            // INNER JOIN cmx_municipios ori ON m.origen_viaje=ori.id
                            // INNER JOIN cmx_municipios des ON m.destino_viaje=des.id
                            // LEFT JOIN cmx_municipios mn ON ise.detalle_tipo=mn.id
                            // LEFT JOIN cmx_puntos_controlador pc ON ise.id=pc.seguimiento_id
                            // WHERE ir.num_manifiesto=:manifiesto AND ise.novedad=:novedad");
                            $sql->bindParam(':manifiesto',  $manifiesto, PDO::PARAM_INT);
                            $sql->bindParam(':novedad', $value['novedad'], PDO::PARAM_STR);
                            $sql->execute();
                            $datos_ruta = $sql->fetchAll(PDO::FETCH_ASSOC);

                            if ($datos_ruta) {
                                // PARÁMETROS
                                $user = $_SESSION["usuario"]["nom_usuario"];
                                $receptor2 = 'controltrafico@nexosgroup.com';

                                // Crear una nueva instancia de PHPMailer
                                $mail = new PHPMailer();
                                $mail->IsSMTP();
                                $mail->isHTML(true);
                                $mail->CharSet = 'UTF-8';
                                $mail->SMTPDebug = 0; // Cambiar a 0 para producción, 2 para obtener más detalles en caso de errores
                                $mail->SMTPAuth = true;
                                $mail->SMTPSecure = 'tls'; // Seguridad TLS
                                // $mail->Host = "smtp.gmail.com"; // Servidor SMTP
                                $mail->Host = "smtp.office365.com"; // Servidor SMTP
                                $mail->Port = 587; // Puerto SMTP (TLS)
                                // $mail->Username = 'soportenexosgroup@gmail.com'; // Nombre de usuario
                                $mail->Username = 'controltrafico@nexosgroup.com'; // Nombre de usuario
                                $mail->Password = 'Trafic2024*'; // Contraseña Nexos2024*
                                // $mail->Password = 'gweqtjwnpzikbams'; // Contraseña Gmail
                                $mail->SetFrom($receptor2, 'Nexos Cargo S.A.S');

                                // Opciones de seguridad (opcional)
                                $mail->SMTPOptions = array(
                                    'ssl' => array(
                                        'verify_peer' => false,
                                        'verify_peer_name' => false,
                                        'allow_self_signed' => true
                                    )
                                );

                                foreach ($plantilla_envio as $plantila) {
                                    if ($plantila['cliente_id'] === 49) { // Cambiar solo al cliente de magnetron
                                        // echo "entro 1";
                                        // PARÁMETROS
                                        // $user = $_SESSION["usuario"]["nom_usuario"];
                                        // $receptor2 = 'desarrolladores@nexosgroup.com';
                                        // $receptor2 = 'controltrafico@nexosgroup.com';

                                        // Crear una nueva instancia de PHPMailer
                                        // $mail = new PHPMailer();
                                        // $mail->IsSMTP();
                                        // $mail->isHTML(true);
                                        // $mail->CharSet = 'UTF-8';
                                        // $mail->SMTPDebug = 0; // Cambiar a 0 para producción, 2 para obtener más detalles en caso de errores
                                        // $mail->SMTPAuth = true;
                                        // $mail->SMTPSecure = 'tls'; // Seguridad TLS
                                        // $mail->Host = "smtp.gmail.com"; // Servidor SMTP
                                        // $mail->Port = 587; // Puerto SMTP (TLS)
                                        // $mail->Username = 'soportenexosgroup@gmail.com'; // Nombre de usuario
                                        // // $mail->Password = 'Nexosdesarrollo2017'; // Contraseña Nexos2024*
                                        // $mail->Password = 'gweqtjwnpzikbams'; // Contraseña
                                        // $mail->SetFrom($receptor2, 'Nexos Cargo S.A.S');

                                        // // Opciones de seguridad (opcional)
                                        // $mail->SMTPOptions = array(
                                        //     'ssl' => array(
                                        //         'verify_peer' => false,
                                        //         'verify_peer_name' => false,
                                        //         'allow_self_signed' => true
                                        //     )
                                        // );

                                        //Agregar destinatario
                                        // foreach ($correos  as $correo) {
                                        //     $mail->AddAddress($correo);
                                        // }

                                        $mail->AddAddress("liucasda@gmail.com");
                                        // $mail->AddAddress("lvillegas@nexosgroup.com");

                                        // Añadir imágenes embebidas
                                        $mail->AddEmbeddedImage('public/img/magnetron.png', 'magnetron_logo', 'magnetron.png');
                                        $mail->AddEmbeddedImage('public/img/nexos.png', 'nexos_logo', 'nexos.png');

                                        // Cargar el contenido de la plantilla HTML
                                        $template = file_get_contents(BASE_URL . $plantila['ruta_archivo']);

                                        // Reemplazar los marcadores de posición con valores dinámicos
                                        // $contenidoHTML = str_replace('{{fecha_hora}}',  date("Y-m-d H:m:s"), $template);
                                        // $contenidoHTML = str_replace('{{referencia}}',  $datos_ruta['Referencia'], $contenidoHTML);
                                        // $contenidoHTML = str_replace('{{contenedor}}',  $datos_ruta['numero_contenedor'], $contenidoHTML);
                                        // $contenidoHTML = str_replace('{{placa}}',  $datos_ruta['placa'], $contenidoHTML);
                                        // $contenidoHTML = str_replace('{{conductor}}',  $datos_ruta['Conductor'], $contenidoHTML);
                                        // $contenidoHTML = str_replace('{{documento_conductor}}',  $datos_ruta['conductor_manifiesto'], $contenidoHTML);
                                        // $contenidoHTML = str_replace('{{origen}}',  $datos_ruta['origen'], $contenidoHTML);
                                        // $contenidoHTML = str_replace('{{destino}}',  $datos_ruta['destino'], $contenidoHTML);
                                        // $contenidoHTML = str_replace('{{ultima_novedad}}',  $datos_ruta['novedad'] . ' - ' . $datos_ruta['Municipio'], $contenidoHTML);
                                        // $contenidoHTML = str_replace('{{fecha_hora}}',  $datos_ruta['fecha_trazabilidad'], $contenidoHTML);

                                        // // Asunto del correo
                                        // // $mail->Subject = "SOLICITUD DE VEHICULO // EXPO 301-24-1 // SOUTHERN COMPANY // 2 X 40 HC // DDP";
                                        // $mail->Subject = $datos_ruta[0]['Referencia'];


                                        // Arreglos para almacenar solicitudes agrupables y no agrupables
                                        $agrupables = [];
                                        $noAgrupables = [];

                                        // Clasifica cada solicitud en agrupables y no agrupables
                                        foreach ($datos_ruta as $datos) {
                                            if (isset($datos['agrupable']) && $datos['agrupable'] === 'SI') {
                                                $agrupables[] = $datos;
                                            } else {
                                                $noAgrupables[] = $datos;
                                            }
                                        }

                                        // Variable para almacenar el contenido HTML generado
                                        $contenidoDinamico = '';

                                        // Envío del correo para las solicitudes agrupables
                                        if (!empty($agrupables)) {
                                            // Genera el contenido del correo para las solicitudes agrupables
                                            $contenidoDinamico = '';
                                            foreach ($agrupables as $datos) {
                                                $contenidoDinamico .= '<tr>';
                                                $contenidoDinamico .= '<td>' . $datos['Referencia'] . '</td>';
                                                $contenidoDinamico .= '<td>' . $datos['numero_contenedor'] . '</td>';
                                                $contenidoDinamico .= '<td>' . $datos['placa'] . '</td>';
                                                $contenidoDinamico .= '<td>' . $datos['Conductor'] . '</td>';
                                                $contenidoDinamico .= '<td>' . $datos['conductor_manifiesto'] . '</td>';
                                                $contenidoDinamico .= '<td>' . $datos['origen'] . '</td>';
                                                $contenidoDinamico .= '<td>' . $datos['destino'] . '</td>';
                                                $contenidoDinamico .= '<td>' . $datos['novedad'] . '-' . $datos['Municipio'] . '</td>';
                                                $contenidoDinamico .= '<td></td>'; // Campo vacío o algún valor predeterminado si es necesario
                                                $contenidoDinamico .= '<td>' . $datos['fecha_trazabilidad'] . '</td>';
                                                $contenidoDinamico .= '</tr>';
                                            }

                                            // Reemplaza el marcador de posición en la plantilla por el contenido dinámico
                                            $templateAgrupable = str_replace('{{contenido_dinamico}}', $contenidoDinamico, $template);

                                            // Configura los detalles del correo
                                            // $mail->Subject = "Solicitudes Agrupables" . $datos['Referencia'];
                                            $mail->Subject = $datos['Referencia'];
                                            $mail->Body = $templateAgrupable;
                                            $mail->AltBody = strip_tags($templateAgrupable);

                                            // Envía el correo
                                            if ($mail->Send()) {
                                                $sqlm = $this->_db3->prepare("INSERT INTO cmx_mail_enviados (id, id_servicio, manifesto_id, id_fecha_parametro, fecha, hora, usuario, modalidad)
                                                VALUES(null, :nundoc_solicitud, :manifiesto, :seguimiento_inicio_id, :fecha, :hora, :usuario, 'Automatico')");
                                                $sqlm->bindParam(':nundoc_solicitud', $datos_ruta['nundoc_solicitud']);
                                                $sqlm->bindParam(':manifiesto', $manifiesto);
                                                $sqlm->bindParam(':seguimiento_inicio_id', $datos_ruta['seguimiento_inicio_id']);
                                                $sqlm->bindParam(':fecha', $factual);
                                                $sqlm->bindParam(':hora', $hactual);
                                                $sqlm->bindParam(':usuario', $user);

                                                if ($sqlm->execute()) {
                                                    $response = [
                                                        'success' => true,
                                                        'result' => 'Correo enviado al cliente de forma exitosa'
                                                    ];
                                                } else {
                                                    $response = [
                                                        'success' => false,
                                                        'result' => 'Error al insertar los correos enviados'
                                                    ];
                                                }
                                            } else {
                                                $response = [
                                                    'success' => false,
                                                    'result' => $mail->ErrorInfo // Mensaje de error de PHPMailer
                                                ];
                                            }
                                        }

                                        // Envío de correos para las solicitudes no agrupables
                                        foreach ($noAgrupables as $datos) {
                                            // Genera el contenido del correo para cada solicitud no agrupable
                                            $contenidoDinamico = '<tr>';
                                            $contenidoDinamico .= '<td>' . $datos['Referencia'] . '</td>';
                                            $contenidoDinamico .= '<td>' . $datos['numero_contenedor'] . '</td>';
                                            $contenidoDinamico .= '<td>' . $datos['placa'] . '</td>';
                                            $contenidoDinamico .= '<td>' . $datos['Conductor'] . '</td>';
                                            $contenidoDinamico .= '<td>' . $datos['conductor_manifiesto'] . '</td>';
                                            $contenidoDinamico .= '<td>' . $datos['origen'] . '</td>';
                                            $contenidoDinamico .= '<td>' . $datos['destino'] . '</td>';
                                            $contenidoDinamico .= '<td>' . $datos['novedad'] . '-' . $datos['Municipio'] . '</td>';
                                            $contenidoDinamico .= '<td></td>'; // Campo vacío o algún valor predeterminado si es necesario
                                            $contenidoDinamico .= '<td>' . $datos['fecha_trazabilidad'] . '</td>';
                                            $contenidoDinamico .= '</tr>';

                                            // Reemplaza el marcador de posición en la plantilla por el contenido dinámico
                                            $templateNoAgrupable = str_replace('{{contenido_dinamico}}', $contenidoDinamico, $template);

                                            // Configura los detalles del correo
                                            // $mail->Subject = "Solicitud No Agrupable - " . $datos['Referencia'];
                                            $mail->Subject = $datos['Referencia'];
                                            $mail->Body = $templateNoAgrupable;
                                            $mail->AltBody = strip_tags($templateNoAgrupable);

                                            // Envía el correo individual para esta solicitud no agrupable
                                            if ($mail->Send()) {
                                                $sqlm = $this->_db3->prepare("INSERT INTO cmx_mail_enviados (id, id_servicio, manifesto_id, id_fecha_parametro, fecha, hora, usuario, modalidad)
                                                VALUES(null, :nundoc_solicitud, :manifiesto, :seguimiento_inicio_id, :fecha, :hora, :usuario, 'Automatico')");
                                                $sqlm->bindParam(':nundoc_solicitud', $datos_ruta[0]['nundoc_solicitud']);
                                                $sqlm->bindParam(':manifiesto', $manifiesto);
                                                $sqlm->bindParam(':seguimiento_inicio_id', $datos_ruta[0]['seguimiento_inicio_id']);
                                                $sqlm->bindParam(':fecha', $factual);
                                                $sqlm->bindParam(':hora', $hactual);
                                                $sqlm->bindParam(':usuario', $user);

                                                if ($sqlm->execute()) {
                                                    $response = [
                                                        'success' => true,
                                                        'result' => 'Correo enviado al cliente de forma exitosa'
                                                    ];
                                                } else {
                                                    $response = [
                                                        'success' => false,
                                                        'result' => 'Error al insertar los correos enviados'
                                                    ];
                                                }
                                            } else {
                                                $response = [
                                                    'success' => false,
                                                    'result' => $mail->ErrorInfo // Mensaje de error de PHPMailer
                                                ];
                                            }

                                            // Reinicia el objeto PHPMailer para el próximo correo
                                            // $mail->clearAddresses();
                                            // $mail->clearAttachments();
                                        }
                                    } else {
                                        // echo "Hola desde aqui ";
                                        // #plantilla de nexosapp
                                        $mail->AddAddress("liucasda@gmail.com");
                                        // $mail->AddAddress("lvillegas@nexosgroup.com");

                                        // Añadir imágenes embebidas
                                        // $mail->AddEmbeddedImage('public/img/magnetron.png', 'magnetron_logo', 'magnetron.png');
                                        $mail->AddEmbeddedImage('public/img/nexos.png', 'nexos_logo', 'nexos.png');

                                        // Cargar el contenido de la plantilla HTML
                                        $template = file_get_contents(BASE_URL . $plantila['ruta_archivo']);

                                        // Genera el contenido del correo para las solicitudes agrupables
                                        $contenidoDinamico = '';
                                        foreach ($datos_ruta as $datos) {
                                            $contenidoDinamico .= '<tr>';
                                            $contenidoDinamico .= '<td>' . $datos['Referencia'] . '</td>';
                                            $contenidoDinamico .= '<td>' . $datos['numero_contenedor'] . '</td>';
                                            $contenidoDinamico .= '<td>' . $datos['placa'] . '</td>';
                                            $contenidoDinamico .= '<td>' . $datos['Conductor'] . '</td>';
                                            $contenidoDinamico .= '<td>' . $datos['conductor_manifiesto'] . '</td>';
                                            $contenidoDinamico .= '<td>' . $datos['origen'] . '</td>';
                                            $contenidoDinamico .= '<td>' . $datos['destino'] . '</td>';
                                            $contenidoDinamico .= '<td>' . $datos['novedad'] . '-' . $datos['Municipio'] . '</td>';
                                            $contenidoDinamico .= '<td></td>'; // Campo vacío o algún valor predeterminado si es necesario
                                            $contenidoDinamico .= '<td>' . $datos['fecha_trazabilidad'] . '</td>';
                                            $contenidoDinamico .= '</tr>';
                                        }

                                        // Reemplaza el marcador de posición en la plantilla por el contenido dinámico
                                        $templateAgrupable = str_replace('{{contenido_plantilla_nexos}}', $contenidoDinamico, $template);

                                        // Configura los detalles del correo
                                        // $mail->Subject = "Solicitudes Agrupables" . $datos['Referencia'];
                                        // $mail->Subject = $datos['Referencia'];
                                        $mail->Subject = "EJEMPLO DE PLANTILLA PARA NEXOSAPP";
                                        $mail->Body = $templateAgrupable;
                                        $mail->AltBody = strip_tags($templateAgrupable);

                                        // Envía el correo
                                        if ($mail->Send()) {
                                            $sqlm = $this->_db3->prepare("INSERT INTO cmx_mail_enviados (id, id_servicio, manifesto_id, id_fecha_parametro, fecha, hora, usuario, modalidad)
                                                                                    VALUES(null, :nundoc_solicitud, :manifiesto, :seguimiento_inicio_id, :fecha, :hora, :usuario, 'Automatico')");
                                            $sqlm->bindParam(':nundoc_solicitud', $datos_ruta[0]['nundoc_solicitud']);
                                            $sqlm->bindParam(':manifiesto', $manifiesto);
                                            $sqlm->bindParam(':seguimiento_inicio_id', $datos_ruta[0]['seguimiento_inicio_id']);
                                            $sqlm->bindParam(':fecha', $factual);
                                            $sqlm->bindParam(':hora', $hactual);
                                            $sqlm->bindParam(':usuario', $user);

                                            if ($sqlm->execute()) {
                                                $response = [
                                                    'success' => true,
                                                    'result' => 'Correo enviado al cliente de forma exitosa'
                                                ];
                                            } else {
                                                $response = [
                                                    'success' => false,
                                                    'result' => 'Error al insertar los correos enviados'
                                                ];
                                            }
                                        } else {
                                            $response = [
                                                'success' => false,
                                                'result' => $mail->ErrorInfo // Mensaje de error de PHPMailer
                                            ];
                                        }
                                    }
                                }
                            } else {
                                $response = [
                                    'success' => false,
                                    'codigo' => 305,
                                    'result' => 'No hay novedades nuevas para enviar correo al cliente'
                                ];
                            }
                        }
                    } else {
                        #si no hay horas disponibles
                        $response = [
                            'success' => false,
                            'result' => 'no hay horario disponible para el envio del correo',
                        ];
                    }
                }
            }
        }
        // Enviar la respuesta como JSON
        return $response;
        // exit();
        // // PARÁMETROS
        // $user = $_SESSION["usuario"]["nom_usuario"];
        // $receptor2 = 'desarrolladores@nexosgroup.com';

        // /* Consultar datos para enviar los correos */



        // // Crear una nueva instancia de PHPMailer
        // $mail = new PHPMailer();
        // $mail->IsSMTP();
        // $mail->isHTML(true);
        // $mail->CharSet = 'UTF-8';
        // $mail->SMTPDebug = 2; // Cambiar a 0 para producción, 2 para obtener más detalles en caso de errores
        // $mail->SMTPAuth = true;
        // $mail->SMTPSecure = 'tls'; // Seguridad TLS
        // $mail->Host = "smtp.gmail.com"; // Servidor SMTP
        // $mail->Port = 587; // Puerto SMTP (TLS)
        // $mail->Username = 'soportenexosgroup@gmail.com'; // Nombre de usuario
        // // $mail->Password = 'Nexosdesarrollo2017'; // Contraseña Nexos2024*
        // $mail->Password = 'gweqtjwnpzikbams'; // Contraseña
        // $mail->SetFrom($receptor2, 'Nexos Cargo S.A.S');

        // // Opciones de seguridad (opcional)
        // $mail->SMTPOptions = array(
        //     'ssl' => array(
        //         'verify_peer' => false,
        //         'verify_peer_name' => false,
        //         'allow_self_signed' => true
        //     )
        // );

        // // Agregar destinatario
        // $mail->AddAddress("liucasda@gmail.com");
        // $mail->AddAddress("mcastillo@nexosgroup.com");
        // $mail->AddAddress("jrodriguez@nexosgroup.com");
        // $mail->AddAddress("desarrolladores@nexosgroup.com");
        // $mail->AddAddress("dpinilla@nexosgroup.com");
        // $mail->AddAddress("ediaz@nexosgroup.com");
        // $mail->AddAddress("fredy.renyz@datafour.co");

        // Mensaje HTML
        // $mensaje = "<html><body>";
        // $mensaje .= "<p style='font-weight:700; font-size:14pt;'>Informe de seguimiento vehicular, solicitud de servicio N°: 0001: </p>";
        // $mensaje .= "</body></html>";

        // Añadir imágenes embebidas
        // $mail->AddEmbeddedImage('public/img/magnetron.png', 'magnetron_logo', 'magnetron.png');
        // $mail->AddEmbeddedImage('public/img/nexos.png', 'nexos_logo', 'nexos.png');

        // $mensaje = '
        // <!DOCTYPE html>
        // <html lang="es">
        // <head>
        //     <meta charset="UTF-8">
        //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
        //     <title>Reporte de Trazabilidad</title>
        //     <style>
        //         body {
        //             font-family: Arial, sans-serif;
        //         }
        //         .table-container {
        //             width: 100%;
        //             border-collapse: collapse;
        //             margin-top: 20px;
        //         }
        //         .table-container th, .table-container td {
        //             border: 1px solid black;
        //             padding: 8px;
        //             text-align: center;
        //             color: black;
        //         }
        //         .header, .subheader {
        //            /* background-color: #333;*/
        //         }
        //         .header img {
        //             width: 100px;
        //         }
        //         .header td {
        //             border: none;
        //         }
        //         .company-info, .report-info {
        //             text-align: left;
        //         }
        //         .logo-right img {
        //             width: 80px;
        //         }
        //         .data th, .data td {
        //             /*background-color: #444;*/
        //         }
        //         .table-container th {
        //             /*background-color: #222;*/
        //         }
        //     </style>
        // </head>
        // <body>
        //     <table class="table-container">
        //         <tr class="header">
        //             <td rowspan="3"><img src="cid:magnetron_logo" alt="Magnetron Logo"></td>
        //             <td class="company-info" colspan="5">
        //                 <strong>MAGNETRON S.A.S</strong><br>
        //                 TRANSPORTES
        //             </td>
        //             <td class="report-info" colspan="3">
        //                 <strong>FORMATO</strong> <br> REPORTE DE TRAZABILIDAD
        //             </td>
        //             <td class="logo-right" rowspan="3">
        //                 <img src="cid:nexos_logo" alt="Nexos Logo" style="width: 180px;">
        //             </td>
        //         </tr>
        //         <tr class="subheader">
        //             <td class="company-info" colspan="5">ANEXO AL INSTRUCTIVO<br>CONTRATACIÓN DE PROVEEDORES DE TRANSPORTE</td>
        //             <td class="report-info" colspan="3">
        //                 <strong>FECHA</strong><br> 17/10/2024 15:55
        //             </td>
        //         </tr>
        //         <tr class="subheader">
        //             <td class="company-info" colspan="5"></td>
        //             <td class="report-info" colspan="3">
        //                 <strong>CODIGO</strong>
        //             </td>
        //         </tr>
        //         <tr class="data">
        //             <th>REFERENCIA</th>
        //             <th>CONTENEDOR</th>
        //             <th>PLACA</th>
        //             <th>CONDUCTOR</th>
        //             <th>CC</th>
        //             <th>ORIGEN</th>
        //             <th>DESTINO</th>
        //             <th>Información Último Seguimiento</th>
        //             <th>Novedad de tránsito</th>
        //             <th>FECHA Y HORA</th>
        //         </tr>
        //         <tr class="data">
        //             <td>EXPO 301-241-1 / SOUTHERN COMPANY // 2 X 40 HC</td>
        //             <td>GESU5954691</td>
        //             <td>LFQ604</td>
        //             <td>JOÉ RODRIGO MONTAÑA GIMENEZ</td>
        //             <td>11.365.302</td>
        //             <td>PEREIRA</td>
        //             <td>CARTAGENA</td>
        //             <td>VH EN TRANSITO POR PAILITAS</td>
        //             <td></td>
        //             <td>17/10/2024 14:20</td>
        //         </tr>
        //         <tr class="data">
        //             <td>EXPO 301-241-1 / SOUTHERN COMPANY // 2 X 40 HC</td>
        //             <td>SMLU7855261</td>
        //             <td>TSP902</td>
        //             <td>RIGOBERTO MILLÁN RIAÑO</td>
        //             <td>11.431.825</td>
        //             <td>PEREIRA</td>
        //             <td>CARTAGENA</td>
        //             <td>VH EN TRANSITO POR PEREIRA</td>
        //             <td></td>
        //             <td>17/10/2024 14:20</td>
        //         </tr>
        //     </table>
        // </body>
        // </html>';

        // // Asunto del correo
        // $mail->Subject = "SOLICITUD DE VEHICULO // EXPO 301-24-1 // SOUTHERN COMPANY // 2 X 40 HC // DDP";

        // // Cuerpo del correo
        // $mail->Body = $mensaje;
        // $mail->AltBody = strip_tags($mensaje); // Versión de texto plano del mensaje

        // // Enviar el correo y verificar el resultado
        // if ($mail->Send()) {
        //     $return["success"] = true;
        // } else {
        //     $return["success"] = false;
        //     // Mostrar el error en caso de fallo
        //     $return["error"] = $mail->ErrorInfo;
        // }

        // return $return;


        // $sql4 = "SELECT cl.*, a.nombre FROM cmx_horacliente_servicio cs INNER JOIN cmx_cliente_hora cl
        //     ON cs.hora_email=cl.id INNER JOIN cmx_clientes a ON cl.id_cliente=a.id LEFT JOIN cmx_mail_enviados me 
        //     ON cl.id=me.id_fecha_parametro AND me.fecha='" . $factual . "' WHERE cs.id_servicio=" . $servicio . "
        //     AND '" . $factual . "' 
        //     BETWEEN cl.fecha_inicio AND cl.fecha_final AND cl.hora_envio <= '" . $hactual . "'  AND me.id_fecha_parametro IS NULL";
        // $consulta = $conexion->prepare($sql4);
        // $consulta->execute();
        // $total = $consulta->rowCount();
        // //realizar la otra consulta
        // //recorrerla
        // $hora_envio = $consulta->fetchAll();
        // if ($total > 0) { //SI TRAE REGISTROS LA CONSULTA - envia email
        //     //Correos destinatarios
        //     $sql = "SELECT g.email
        //         FROM cmx_grupocliente_servicio gs
        //         INNER JOIN cmx_grupo_contacto_cliente g
        //         ON gs.id_grupo=g.idgrupo
        //         INNER JOIN cmx_clientes cl
        //         ON g.idcliente=cl.id
        //         WHERE cl.nombre='" . $clientenombre . "' AND
        //         gs.id_servicio=" . $servicio . "";
        //     $consultae = $conexion->prepare($sql);
        //     $consultae->execute();
        //     $contador_grupo = $consultae->rowCount();
        //     $correo_receptor1 = $consultae->fetchAll();
        //     //Consultar seguimientos
        //     $sqls = "SELECT se.id,se.tipo_seguimiento,
        //             se. observacion,
        //             se.fecha, se.hora, se.usuario,se.reporte_cliente,
        //             mn.municipio, n.novedad, ser.id_servicio
        //             FROM    
        //             cmx_inicio_seguimiento se
        //             LEFT JOIN  cmx_municipios mn ON se.detalle_tipo=mn.id
        //             LEFT JOIN cmx_para_novedades_seguimiento n ON se.novedad=n.id
        //             INNER JOIN cmx_seguimiento_servicio ser ON se.id=ser.id_seguimiento 
        //             WHERE se.cod_ini_ruta=" . $iniruta . " AND se.reporte_cliente='si'
        //             AND ser.id_servicio=" . $servicio . "";
        //     $consulta_se = $conexion->prepare($sqls);
        //     $consulta_se->execute();
        //     $contador = $consulta_se->rowCount();
        //     $datos_seguimiento = $consulta_se->fetchAll();
        //     // SI EXISTEN SEGUIMIENTOS Y CORREOS DE  DESTINOS
        //     if ($contador > 0 && $contador_grupo > 0) {
        //         //Construcción del envio de correos
        //         require '../libs/PHPMailer/PHPMailerAutoload.php';
        //         //Create a new PHPMailer instance
        //         $mail = new PHPMailer();
        //         $mail->IsSMTP();
        //         //$mail->isMail();
        //         $mail->isHTML = (true);
        //         $mail->CharSet = 'UTF-8';
        //         //$mail->From = 'fredyrenyz@hotmail.com'; 
        //         $mail->SMTPDebug = 0;
        //         $mail->SMTPAuth = true;
        //         $mail->SMTPSecure = 'tls'; //seguridad
        //         $mail->Host = "smtp.gmail.com"; // servidor 
        //         $mail->Port = 587; //puerto
        //         $mail->Username = 'soportenexosgroup@gmail.com'; //nombre usuario
        //         $mail->Password = 'Nexosdesarrollo2017'; //contraseña
        //         $mail->SetFrom($receptor2, 'Mailer');
        //         //Agregar destinatario
        //         for ($i = 0; $i < $contador_grupo; $i++) {
        //             $mail->AddAddress($correo_receptor1[0][$i]);
        //         }
        //         $mensaje = "<html><body>";
        //         $mensaje .= "<p style='font-weight:700; font-size:14pt;'>Informe de seguimiento vehícular, solicitud de servicio N° " . $servicio . ": </p>";
        //         $mensaje .= "<table width='100%' bgcolor='' cellpadding='2' cellspacing='1' border='1'      style='color:black;'>";
        //         $mensaje .= '<thead style="background-color:"#262626">
        //                 <th>Solicitud servicio</th>
        //                 <th>Ubicación</th>
        //                 <th>Fecha</th>
        //                 <th>Hora</th>
        //                 <th>Novedad</th>
        //             </thead>';
        //         foreach ($datos_seguimiento as $value) {
        //             $mensaje .= '<tr>' .
        //                 '<td>' . $value[9] . '</td>' .
        //                 '<td>' . $value[7] . '</td>' .
        //                 '<td>' . $value[3] . '</td>' .
        //                 '<td>' . $value[4] . '</td>' .
        //                 '<td>' . $value[8] . '</td>' .
        //                 '</tr>';
        //         }
        //         $mensaje .= "</table>";
        //         $mensaje .= "</body></html>";
        //         $mail->Subject = "";
        //         $mail->Body = $mensaje;
        //         $mail->AltBody = $mensaje;
        //         if ($mail->Send()) {
        //             // echo'<script type="text/javascript">
        //             //           alert("Enviado Correctamente");
        //             //        </script>';
        //             foreach ($hora_envio as $value) {
        //                 $sqlm = "INSERT INTO cmx_mail_enviados
        //                         (id,id_servicio,id_fecha_parametro,fecha,hora,usuario,modalidad)
        //                         VALUES(null," . $servicio . "," . $value['id'] . ",'" . $factual . "','" . $hactual . "','" . $user . "','Automatico')";
        //                 $registro = $conexion->prepare($sqlm);
        //                 $registro->execute();
        //             }
        //             $return["success"] = true;
        //         } else {
        //             $return["success"] = false;
        //         }
        //         return $return;
        //     }
        // } //cierre del contador de horas
    } //cierre del metodo




}
