<?php

session_start();

class traficoModel extends Model
{

    public function __construct()
    {

        parent::__construct();
    }

    public function Inicio_ruta($manifiesto)
    {
        $sql = $this->_db3->prepare("SELECT i.*, p.nombre, p.apellido1, p.apellido2, est.id AS med,
        e.estado, CONCAT(mn1.municipio,'-', mn1.depto) AS 'origin', CONCAT(mn2.municipio,'-', mn2.depto) AS 'destini', est.fecha AS 'ufecha',est.hora AS 'uhora'
       FROM cmx_inicio_ruta i -- PLAN DE RUTA
       INNER JOIN cmx_inici_manifiesto_estado est ON i.cod_inicio=est.cod_ini_ruta AND est.ultimo_estado=1
       INNER JOIN cmx_proveedores p ON i.cond_cedula=p.numero_documento
       INNER JOIN cmx_estado_segui e ON est.estado=e.id
       INNER JOIN cmx_plan_ruta pl ON i.cod_plan=pl.cod_plan
       INNER JOIN cmx_rutas ru ON pl.cod_ruta=ru.id
       INNER JOIN cmx_municipios mn1 ON ru.cod_ciudad_origen=mn1.id
       INNER JOIN cmx_municipios mn2 ON ru.cod_ciudad_destino=mn2.id
       LEFT JOIN cmx_inicio_ruta inr ON i.num_manifiesto=inr.num_manifiesto
       WHERE i.num_manifiesto=:Manifiesto");
        $sql->bindParam(':Manifiesto', $manifiesto);
        $sql->execute();
        $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultados;
    }

    public function Cargar_origen()
    {
        $sql = $this->_db3->prepare("SELECT * FROM cmx_municipios WHERE pais='COLOMBIA'
        AND estado_nacional='Activa' ORDER BY municipio ASC");
        $sql->execute();
        $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultados;
    }
    public function Cargar_destino()
    {
        $sql = $this->_db3->prepare("SELECT * FROM cmx_municipios WHERE pais='COLOMBIA'
        AND estado_nacional='Activa' ORDER BY municipio ASC");
        $sql->execute();
        $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultados;
    }

    public function Coordenada_Rutas($id)
    {
        $sql = $this->_db3->prepare("SELECT latitud, longitud FROM cmx_municipios WHERE id=:Id");
        $sql->bindParam(':Id', $id);
        $sql->execute();
        $resultados = $sql->fetch(PDO::FETCH_ASSOC);
        return $resultados;
    }

    public function Filtro_Rutas($eleccion, $lugar)
    {
        if ($eleccion === "Origen") {
            $sql = $this->_db3->prepare("SELECT r.*, c1.municipio AS om,c1.depto AS od, c2.municipio AS od1 ,c2.depto AS dd
           FROM cmx_rutas AS r
           INNER JOIN cmx_municipios AS c1 ON r.cod_ciudad_origen=c1.id
           INNER JOIN cmx_municipios AS c2 ON r.cod_ciudad_destino=c2.id
           WHERE cod_ciudad_origen=:Lugar");
            $sql->bindParam(':Lugar', $lugar);

            // $sql->execute();
        } else {
            $sql = $this->_db3->prepare("SELECT r.*, c1.municipio AS om,c1.depto AS od,
            c2.municipio AS od1 ,c2.depto AS dd
            FROM cmx_rutas AS r
            INNER JOIN cmx_municipios AS c1 ON r.cod_ciudad_origen=c1.id
            INNER JOIN cmx_municipios AS c2  ON r.cod_ciudad_destino=c2.id
            WHERE cod_ciudad_destino=:Lugar");
            $sql->bindParam(':Lugar', $lugar);
            // $sql->execute();
        }
        $sql->execute();
        $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultados;
    }

    public function Consultar_Lugares($id, $origen, $destino)
    {
        $sql = $this->_db3->prepare("SELECT ta.*,mun.municipio, mun.depto FROM cmx_rutas ta
        INNER JOIN cmx_municipios mun ON ta.cod_ciudad_origen=mun.id
        WHERE ta.id=:ID");
        $sql->bindParam(':ID', $id);
        $sql->execute();
        $resultados1 = $sql->fetchAll(PDO::FETCH_ASSOC);

        if ($resultados1) {
            $sql2 = $this->_db3->prepare("SELECT mun.municipio, mun.depto FROM cmx_rutas ta
                INNER JOIN cmx_municipios mun ON ta.cod_ciudad_destino=mun.id
                WHERE ta.id=:ID");
            $sql2->bindParam(':ID', $id);
            $sql2->execute();
            $resultados2 = $sql2->fetchAll(PDO::FETCH_ASSOC);
        }
        $response = array(
            "Resultado_uno" => $resultados1,
            "Resultado_dos" => $resultados2,
        );
        return $response;
    }

    public function Editar_Rutas($id, $origen, $destino)
    {
        $sql = $this->_db3->prepare("SELECT * FROM cmx_rutas WHERE id=:Id");
        $sql->bindParam(':Id', $id);
        $sql->execute();
        $resultado = $sql->fetch(PDO::FETCH_ASSOC);
        //Consultar Origen
        $sqlo = $this->_db3->prepare("SELECT * FROM cmx_municipios");
        $sqlo->execute();
        $resultados_origen = $sqlo->fetchAll(PDO::FETCH_ASSOC);
        //consultar destino
        $sqld = $this->_db3->prepare("SELECT * FROM cmx_municipios");
        $sqld->execute();
        $resultados_destino = $sqld->fetchAll(PDO::FETCH_ASSOC);
        $origen = array();
        $destino = array();

        foreach ($resultados_origen as $index => $element1) {
            //origen
            if (strcasecmp($element1['id'], $resultado['cod_ciudad_origen']) == 0) {
                $origen[$index]['selected'] = true;
            } else {
                $origen[$index]['selected'] = false;
            }
            $origen[$index]['mun_origen'] = $element1["municipio"];
            $origen[$index]['dep_origen'] = $element1["depto"];
            $origen[$index]['id_origen'] = $element1["id"];

            foreach ($resultados_destino as $index => $element2) {
                if (strcasecmp($element2['id'], $resultado["cod_ciudad_destino"]) == 0) {
                    $destino[$index]['selected'] = true;
                } else {
                    $destino[$index]['selected'] = false;
                }
                $destino[$index]['mun_destino'] = $element2["municipio"];
                $destino[$index]['dep_destino'] = $element2["depto"];
                $destino[$index]['id_destino'] = $element2["id"];
            }
        }
        $resultado['cod_ciudad_origen'] = $origen;
        $resultado['cod_ciudad_destino'] = $destino;
        return $resultado;
    }

    public function Validar_Una_Rutas($origen, $destino)
    {
        $sql = $this->_db3->prepare("SELECT * FROM cmx_rutas WHERE cod_ciudad_origen=:origen
			AND cod_ciudad_destino=:destino AND estado='habilitado'");
        $sql->bindParam(':origen', $origen);
        $sql->bindParam(':destino', $destino);
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        $respusta = 0;
        if ($resultado) {
            $respusta++;
        } else {
            $respusta;
        }
        return $respusta;
    }

    public function Crear_Ruta($datos)
    {
        $estado = "habilitado";
        $sql = "INSERT INTO cmx_rutas (id,cod_ciudad_origen,cod_ciudad_destino,estado,observaciones,fecha,hora,usuario,latitud_origen,latitud_destino,longitud_origen,longitud_destino,tiempo_tot_ruta,km_tot_ruta,tipo_ruta)
				VALUES(null,:origen,:destino,:estado,:observa,:fecha,:hora,:usuario,:latitud_origen,:latitud_destino,:longitud_origen,:longitud_destino,:tiempo_tot,:kilo_tot,:tipo_ruta)";
        $crearruta = $this->_db3->prepare($sql);
        $crearruta->bindParam(':origen', $datos['origen']);
        $crearruta->bindParam(':destino', $datos['destino']);
        $crearruta->bindParam(':estado', $estado);
        $crearruta->bindParam(':observa', $datos['observa']);
        $crearruta->bindParam(':fecha', $datos['fecha']);
        $crearruta->bindParam(':hora', $datos['hora']);
        $crearruta->bindParam(':usuario', $datos['user']);
        $crearruta->bindParam(':latitud_origen', $datos['latitud_origen']);
        $crearruta->bindParam(':latitud_destino', $datos['latitud_destino']);
        $crearruta->bindParam(':longitud_origen', $datos['longitud_origen']);
        $crearruta->bindParam(':longitud_destino', $datos['longitud_destino']);
        $crearruta->bindParam(':tiempo_tot', $datos['tiempo_tot']);
        $crearruta->bindParam(':kilo_tot', $datos['kilo_tot']);
        $crearruta->bindParam(':tipo_ruta', $datos['tipo_ruta']);
        $resultado = $crearruta->execute();
        // return $resultado;
        if ($resultado) {
            $ultimoId = $this->_db3->lastInsertId();
            return [
                'success' => true,
                'id_ruta' => $ultimoId
            ];
        } else {
            return [
                'success' => false,
                'error' => $crearruta->errorInfo()
            ];
        }
    }

    public function Elegur_Origen_Ruta()
    {
        $sql = $this->_db3->prepare("SELECT mun.*  FROM cmx_municipios mun
        INNER JOIN cmx_rutas rut ON mun.id=rut.cod_ciudad_origen
        GROUP BY mun.id");
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Elegur_Destino_Ruta()
    {
        $sql = $this->_db3->prepare("SELECT mun.* FROM cmx_municipios mun
        INNER JOIN cmx_rutas rut ON mun.id=rut.cod_ciudad_destino
        GROUP BY mun.id");
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Actualizar_Ruta($datos)
    {
        $sql = "UPDATE cmx_rutas SET cod_ciudad_origen=:origen, cod_ciudad_destino=:destino, observaciones=:observa, estado=:estado,
        latitud_origen=:vla_ori_e, latitud_destino=:vla_des_e, longitud_origen=:vlo_ori_e, longitud_destino=:vlo_des_e, tiempo_tot_ruta=:tiempoe, km_tot_ruta=:kilometroe WHERE id=:Id";
        $actualizarruta = $this->_db3->prepare($sql);
        $actualizarruta->bindParam(':origen', $datos['origen']);
        $actualizarruta->bindParam(':destino', $datos['destino']);
        $actualizarruta->bindParam(':observa', $datos['observa']);
        $actualizarruta->bindParam(':estado', $datos['estado']);
        $actualizarruta->bindParam(':vla_ori_e', $datos['vla_ori_e']);
        $actualizarruta->bindParam(':vla_des_e', $datos['vla_des_e']);
        $actualizarruta->bindParam(':vlo_ori_e', $datos['vlo_ori_e']);
        $actualizarruta->bindParam(':vlo_des_e', $datos['vlo_des_e']);
        $actualizarruta->bindParam(':tiempoe', $datos['tiempoe']);
        $actualizarruta->bindParam(':kilometroe', $datos['kilometroe']);
        $actualizarruta->bindParam(':Id', $datos['id']);
        $resultado = $actualizarruta->execute();
        return $resultado;
    }

    /* Seguimiento de planes */
    public function Seguimiento_Ruta($num_manifiesto)
    {
        $sql = "SELECT i.cod_inicio,i.num_manifiesto,i.cond_cedula,i.placa,i.fechasalida,i.horasalida,i.usuario,i.cod_plan,p.nombre, p.apellido1, p.apellido2,p.celular, est.id AS med,
        e.estado, CONCAT(mn1.municipio,'-', mn1.depto) AS 'origin', CONCAT(mn2.municipio,'-', mn2.depto) AS 'destini', est.fecha AS 'ufecha',est.hora AS 'uhora',
        pl.nombre_plan,vm.marca,vl.descripcion,vc.color,vcr.descripcion AS 'carrocerias',vcf.descripcion AS 'configuracion',eg.operador_gps,
        eg.id,eg.url,vh.usuario_satelital,vh.clave_satelital,v2.anio_fabricacion,tr.placa AS 'Placatrailer',/*tdes.fecha_descargue,tdes.hora_descargue,*/mn.Lugar
        FROM cmx_inicio_ruta i -- PLAN DE RUTA
        INNER JOIN cmx_inici_manifiesto_estado est ON i.cod_inicio=est.cod_ini_ruta AND est.ultimo_estado=1
        INNER JOIN cmx_proveedores p ON i.cond_cedula=p.numero_documento
        INNER JOIN cmx_estado_segui e ON est.estado=e.id
        INNER JOIN cmx_plan_ruta pl ON i.cod_plan=pl.cod_plan
        INNER JOIN cmx_rutas ru ON pl.cod_ruta=ru.id
        INNER JOIN cmx_municipios mn1 ON ru.cod_ciudad_origen=mn1.id
        INNER JOIN cmx_municipios mn2 ON ru.cod_ciudad_destino=mn2.id
        INNER JOIN cmx_vehiculos vh ON vh.placa=i.placa
        INNER JOIN cmx_vehiculo2 v2 ON v2.id_vehiculo=vh.numdoc_vehiculo
        INNER JOIN cmx_rndc_vehiculos_marcas vm ON vm.id=v2.marca
        INNER JOIN cmx_rndc_vehiculos_linea vl ON v2.linea=vl.id
        INNER JOIN cmx_rndc_vehiculos_color vc ON v2.color=vc.id
        INNER JOIN cmx_rndc_vehiculos_carroceria vcr ON vh.tipo_carroceria=vcr.id
        INNER JOIN cmx_rndc_vehiculos_configuracion vcf ON v2.configuracion=vcf.id
        INNER JOIN cmx_rndc_empresa_gps eg ON eg.id=vh.empresa_gps
        LEFT JOIN cmx_trailer_vehiculo trv ON vh.numdoc_vehiculo=trv.id_vehiculo AND trv.estado=1
        LEFT JOIN cmx_trailer tr ON trv.id_trailer=tr.id
        LEFT JOIN cmx_manifiesto mn ON i.num_manifiesto=mn.id
        WHERE i.num_manifiesto=:Manifiesto GROUP BY cod_inicio";

        $datos_Seguimiento = $this->_db3->prepare($sql);
        $datos_Seguimiento->bindParam(':Manifiesto', $num_manifiesto);
        // $datos_Seguimiento->bindParam(':num_manifiesto', $num_manifiesto);
        $datos_Seguimiento->execute();
        $resultado = $datos_Seguimiento->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Consular_Puntos_Geograficos($idplan, $codini)
    {
        $sql = $this->_db3->prepare("SELECT p.*,mn.id AS 'idmunicipio',mn.depto,mn.municipio,mn.latitud,mn.longitud FROM cmx_planruta_detalle p
        LEFT JOIN cmx_inicio_seguimiento se ON p.cod_ciudad<>se.detalle_tipo AND se.cod_ini_ruta=:codigo_inicio
        INNER JOIN cmx_municipios mn ON p.cod_ciudad=mn.id
        WHERE p.cod_plan=:plan_id GROUP BY p.cod_ciudad ORDER BY p.id");
        $sql->bindParam(':plan_id', $idplan);
        $sql->bindParam(':codigo_inicio', $codini);
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Listar_Puntos()
    {
        $sql = "SELECT r.id, mr.municipio,mr.depto, r.nom_punto,r.latitud, r.longitud, r.estado,mr.id AS idmunicipio FROM cmx_para_punto_ruta r
        INNER JOIN cmx_municipios mr ON r.cod_ciudad=mr.id";
        $puntos_control = $this->_db3->prepare($sql);
        $puntos_control->execute();
        $resultado = $puntos_control->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Consultar_Seguimiento($codigo_inicio)
    {
        $sql = $this->_db3->prepare("SELECT
            m.municipio,
            a.tipo_seguimiento,
            a.fecha,
            a.hora,
            a.observacion,
            a.usuario,
            ppr.nom_punto,
            prd.nombre_punto,
            a.novedad,
            pc.punto_controlador
        FROM
            cmx_inicio_seguimiento a -- INNER JOIN cmx_seguimiento_servicio b ON a.id=b.id_seguimiento
            LEFT JOIN cmx_municipios m ON a.detalle_tipo = m.id
            LEFT JOIN cmx_puntos_controlador pc ON a.id = pc.seguimiento_id
            LEFT JOIN cmx_planruta_detalle prd ON prd.cod_punto = a.codigo_punto
            LEFT JOIN cmx_para_punto_ruta ppr ON ppr.id = a.codigo_punto
        WHERE
            a.cod_ini_ruta = :codigo_inicio
        GROUP BY
            a.id
        ORDER BY
            a.id DESC");
        // $sql = $this->_db3->prepare("SELECT m.municipio,a.tipo_seguimiento,a.fecha, a.hora,a.observacion,a.usuario,ppr.nom_punto,prd.nombre_punto,a.novedad,pc.punto_controlador
        // FROM cmx_inicio_seguimiento a
        // -- INNER JOIN cmx_seguimiento_servicio b ON a.id=b.id_seguimiento
        // LEFT JOIN cmx_municipios m ON a.detalle_tipo=m.id
        // -- LEFT JOIN cmx_para_novedades_seguimiento nov ON a.novedad=nov.id
        // LEFT JOIN cmx_puntos_controlador pc ON a.id=pc.seguimiento_id
        // LEFT JOIN cmx_planruta_detalle prd ON prd.cod_punto=a.codigo_punto
        // LEFT JOIN cmx_para_punto_ruta ppr ON ppr.id=a.codigo_punto
        // WHERE a.cod_ini_ruta=:codigo_inicio GROUP BY a.id ORDER BY a.id DESC");
        $sql->bindParam(':codigo_inicio', $codigo_inicio);
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Consultar_Puntos_Geograficos($id_plan)
    {
        $sql = $this->_db3->prepare("SELECT *,d.latitud AS latitud_punto,d.longitud AS longitud_punto FROM cmx_plan_ruta p
        INNER JOIN cmx_rutas ru ON p.cod_ruta=ru.id
        INNER JOIN cmx_planruta_detalle d ON p.cod_plan=d.cod_plan
        INNER JOIN cmx_municipios m ON d.cod_ciudad=m.id
        WHERE p.cod_plan=:plan_id AND d.tipo_punto='punto geografico'");
        $sql->bindParam(':plan_id', $id_plan);
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Consultar_Puntos_Control($codinin)
    {
        $sql = $this->_db3->prepare("SELECT ru.latitud_origen,ru.latitud_destino,
		ru.longitud_origen,ru.longitud_destino,
		a.latitud,a.longitud
		FROM cmx_iniruta_ubicacion a
		INNER JOIN cmx_inicio_ruta b ON a.cod_ini_ruta=b.cod_inicio
		INNER JOIN cmx_plan_ruta pl ON pl.cod_plan= b.cod_plan
		INNER JOIN cmx_rutas ru ON pl.cod_ruta=ru.id
		WHERE b.cod_inicio=:Codigo_Inicio AND a.id IN(SELECT MAX(id) FROM cmx_iniruta_ubicacion WHERE cod_ini_ruta=:Codigo_Inicio)");
        $sql->bindParam(':Codigo_Inicio', $codinin);
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function Consultar_Tiempo_Semaforo($codini)
    {
        $sql = $this->_db3->prepare("WITH MaxID AS (
        SELECT MAX(id) AS max_id 
        FROM cmx_inicio_seguimiento 
        WHERE cod_ini_ruta = :Codigo_Inicio 
        AND tipo_proceso = 'seguimiento') 
        SELECT s.tiempo 
        FROM cmx_inicio_seguimiento s 
        JOIN MaxID ON s.id = MaxID.max_id");

        $sql->bindParam(':Codigo_Inicio', $codini);
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }



    public function obtenerInformacionSeguimiento(array $codigos)
    {
        if (empty($codigos)) return [];

        $placeholders = implode(',', array_fill(0, count($codigos), '?'));


        $sql = "
        SELECT 
            s1.cod_ini_ruta,
            s1.tiempo,
            s1.fecha,
            s1.hora,
            s1.usuario,
            IFNULL(m.municipio, pc.punto_controlador) AS Municipio
        FROM cmx_inicio_seguimiento s1 
        INNER JOIN cmx_ultimo_seguimiento us ON s1.id= us.seguimiento_id
        LEFT JOIN cmx_municipios m ON s1.detalle_tipo = m.id
        LEFT JOIN cmx_puntos_controlador pc ON s1.id = pc.seguimiento_id
        WHERE s1.cod_ini_ruta IN ($placeholders)
        ";

        //     $sql = "
        //     WITH Ultimos AS (
        //         SELECT s1.*
        //         FROM cmx_inicio_seguimiento s1
        //         INNER JOIN (
        //             SELECT cod_ini_ruta, MAX(id) AS max_id
        //             FROM cmx_inicio_seguimiento
        //             WHERE tipo_proceso = 'seguimiento'
        //             GROUP BY cod_ini_ruta
        //         ) s2 ON s1.cod_ini_ruta = s2.cod_ini_ruta AND s1.id = s2.max_id
        //     )
        //     SELECT 
        //         u.cod_ini_ruta,
        //         u.tiempo,
        //         u.fecha,
        //         u.hora,
        //         u.usuario,
        //         IFNULL(m.municipio, pc.punto_controlador) AS Municipio
        //     FROM Ultimos u
        //     LEFT JOIN cmx_municipios m ON u.detalle_tipo = m.id
        //     LEFT JOIN cmx_puntos_controlador pc ON u.id = pc.seguimiento_id
        //     WHERE u.cod_ini_ruta IN ($placeholders)
        // ";

        $stmt = $this->_db3->prepare($sql);
        $stmt->execute($codigos);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function Actualizar_Tiempo_Manifiesto($codini)
    {
        $sql_select = $this->_db3->prepare("SELECT id FROM cmx_inicio_seguimiento WHERE cod_ini_ruta=:Codigo_Inicio ORDER BY id DESC LIMIT 1");
        $sql_select->bindParam(':Codigo_Inicio', $codini, PDO::PARAM_STR);
        $sql_select->execute();
        $resultado_id = $sql_select->fetch(PDO::FETCH_ASSOC);
        if ($resultado_id) {
            $sql = $this->_db3->prepare("UPDATE cmx_inicio_seguimiento SET tiempo=tiempo+1 WHERE cod_ini_ruta=:Codigo AND id=:Id");
            $sql->bindParam(':Codigo', $codini, PDO::PARAM_STR);
            $sql->bindParam(':Id', intval($resultado_id['id']), PDO::PARAM_STR); // Se cambió PDO::PARAM_STR a PDO::PARAM_INT
            $resultado = $sql->execute();
            if ($resultado) {
                return true;
            } else {
                return false;
            }
        } else {
            $mensajeError = 'Error al econjer el id' . date("Y-m-d H:m:s");
            error_log($mensajeError . "\n", 3, "error_log.txt");
        }
    }

    public function Datos_SinFiltro()
    {
        // Consulta original para obtener los datos
        $sql = $this->_db3->prepare("SELECT 
            ise.tiempo,
            ma.id,
            ma.placa,
            -- ma.estado_seguimiento,
            -- ma.origen_viaje,
            -- ma.destino_viaje,
            pro.nombre AS nombre_conductor,
            pro.apellido1,
            pro.apellido2,
            pro.celular,
            mn1.municipio AS origen,
            mn2.municipio AS destino,
            inr.cod_inicio AS cod_ini_ruta,
            cl.nombre AS nombre_cliente,
            oc.mer_producto
            -- dm.tipo_transporte

        FROM cmx_manifiesto ma

        -- JOIN de datos generales
        INNER JOIN cmx_proveedores pro ON ma.conductor_manifiesto = pro.numero_documento
        INNER JOIN cmx_municipios mn1 ON ma.origen_viaje = mn1.id
        INNER JOIN cmx_municipios mn2 ON ma.destino_viaje = mn2.id
        INNER JOIN cmx_inicio_ruta inr ON ma.id = inr.num_manifiesto

        -- JOIN de remesas y órdenes
        INNER JOIN cmx_manifiesto_remesa mr ON mr.id_manifiesto = ma.id
        INNER JOIN cmx_remesa r ON r.id = mr.id_remesa
        INNER JOIN cmx_remesa_ordencargue ro ON ro.id_remesa = r.id
        INNER JOIN cmx_orden_cargue oc ON oc.id = ro.id_orden_cargue

        -- JOIN de cliente y mercancía
        INNER JOIN cmx_clientes cl ON cl.id = oc.cli_id
        INNER JOIN cmx_solicitud_vehiculo2 ss ON ss.nundoc_solicitud = oc.mer_idservicio
        INNER JOIN cmx_cotizaciones_serviciocliente cs ON cs.n_cotizacion = ss.n_cotizacion
        -- INNER JOIN cmx_detalle_mercancia2 dm ON dm.n_cotizacion = cs.n_cotizacion

        -- JOIN de tabla de ultimo seguimento realizado
        INNER JOIN cmx_inicio_seguimiento ise ON inr.cod_inicio= ise.cod_ini_ruta
        INNER JOIN cmx_ultimo_seguimiento us ON ise.id= us.seguimiento_id

        -- LEFT JOIN para cumplido y seguimiento
        LEFT JOIN cmx_cumplido cu ON ma.id = cu.manifiesto
        -- LEFT JOIN cmx_view_seguimiento us ON us.cod_ini_ruta = inr.cod_inicio

        -- Condiciones
        WHERE cu.manifiesto IS NULL
        AND ma.estado_seguimiento = 'SEGUIMIENTO'

        -- Agrupación y orden
        GROUP BY ma.id ORDER BY ise.tiempo DESC");

        // $sql = $this->_db3->prepare("WITH ultimos_seguimiento AS (
        //     SELECT 
        //         observacion,
        //         usuario,
        //         tiempo,
        //         cod_ini_ruta
        //     FROM (
        //         SELECT 
        //         s1.*,
        //         ROW_NUMBER() OVER (PARTITION BY cod_ini_ruta ORDER BY id DESC) AS rn
        //         FROM cmx_inicio_seguimiento s1
        //         WHERE tipo_proceso = 'seguimiento' AND fecha > '2025-08-01'
        //     ) AS ordenados
        //     WHERE rn = 1
        //     )

        //     SELECT 
        //         us.tiempo,
        //         ma.id,
        //         ma.placa,
        //         -- ma.estado_seguimiento,
        //         -- ma.origen_viaje,
        //         -- ma.destino_viaje,
        //         pro.nombre AS nombre_conductor,
        //         pro.apellido1,
        //         pro.apellido2,
        //         pro.celular,
        //         mn1.municipio AS origen,
        //         mn2.municipio AS destino,
        //         inr.cod_inicio AS cod_ini_ruta,
        //         cl.nombre AS nombre_cliente,
        //         oc.mer_producto,
        //         cl.nombre
        //         -- dm.tipo_transporte

        //     FROM cmx_manifiesto ma

        //     -- JOIN de datos generales
        //     INNER JOIN cmx_proveedores pro ON ma.conductor_manifiesto = pro.numero_documento
        //     INNER JOIN cmx_municipios mn1 ON ma.origen_viaje = mn1.id
        //     INNER JOIN cmx_municipios mn2 ON ma.destino_viaje = mn2.id
        //     INNER JOIN cmx_inicio_ruta inr ON ma.id = inr.num_manifiesto

        //     -- JOIN de remesas y órdenes
        //     INNER JOIN cmx_manifiesto_remesa mr ON mr.id_manifiesto = ma.id
        //     INNER JOIN cmx_remesa r ON r.id = mr.id_remesa
        //     INNER JOIN cmx_remesa_ordencargue ro ON ro.id_remesa = r.id
        //     INNER JOIN cmx_orden_cargue oc ON oc.id = ro.id_orden_cargue

        //     -- JOIN de cliente y mercancía
        //     INNER JOIN cmx_clientes cl ON cl.id = oc.cli_id
        //     INNER JOIN cmx_solicitud_vehiculo2 ss ON ss.nundoc_solicitud = oc.mer_idservicio
        //     INNER JOIN cmx_cotizaciones_serviciocliente cs ON cs.n_cotizacion = ss.n_cotizacion
        //     -- INNER JOIN cmx_detalle_mercancia2 dm ON dm.n_cotizacion = cs.n_cotizacion

        //     -- LEFT JOIN para cumplido y seguimiento
        //     LEFT JOIN cmx_cumplido cu ON ma.id = cu.manifiesto
        //     LEFT JOIN ultimos_seguimiento us ON us.cod_ini_ruta = inr.cod_inicio

        //     -- Condiciones
        //     WHERE cu.manifiesto IS NULL
        //     AND ma.estado_seguimiento = 'SEGUIMIENTO'

        //     -- Agrupación y orden
        //     GROUP BY ma.id
        //     ORDER BY us.tiempo DESC");

        // $sql = $this->_db3->prepare("SELECT ins.tiempo, ma.*, pro.nombre AS nombre_conductor, pro.apellido1, 
        //     pro.apellido2, pro.celular,mn1.municipio AS origen, mn2.municipio AS destino,inr.cod_inicio AS cod_ini_ruta, cl.nombre, oc.mer_producto, dm.tipo_transporte
        //     FROM cmx_manifiesto ma
        //     INNER JOIN cmx_proveedores pro ON ma.conductor_manifiesto = pro.numero_documento
        //     INNER JOIN cmx_municipios mn1 ON ma.origen_viaje = mn1.id
        //     INNER JOIN cmx_municipios mn2 ON ma.destino_viaje = mn2.id
        //     INNER JOIN cmx_inicio_ruta inr ON ma.id = inr.num_manifiesto
        //     INNER JOIN cmx_manifiesto_remesa mr ON mr.id_manifiesto = ma.id
        //     INNER JOIN cmx_remesa r ON r.id = mr.id_remesa
        //     INNER JOIN cmx_remesa_ordencargue ro ON ro.id_remesa = r.id
        //     INNER JOIN cmx_orden_cargue oc ON oc.id = ro.id_orden_cargue
        //     INNER JOIN cmx_clientes cl ON cl.id = oc.cli_id
        //     INNER JOIN cmx_solicitud_vehiculo2 ss ON ss.nundoc_solicitud = oc.mer_idservicio
        //     INNER JOIN cmx_cotizaciones_serviciocliente cs ON cs.n_cotizacion = ss.n_cotizacion
        //     INNER JOIN cmx_detalle_mercancia2 dm ON dm.n_cotizacion = cs.n_cotizacion
        //     LEFT JOIN cmx_cumplido cu ON ma.id = cu.manifiesto
        //     LEFT JOIN (SELECT s1.* FROM  cmx_inicio_seguimiento s1
        //     INNER JOIN (SELECT  cod_ini_ruta, MAX(id) AS max_id FROM  cmx_inicio_seguimiento WHERE tipo_proceso = 'seguimiento'
        //     GROUP BY cod_ini_ruta) s2 ON s1.cod_ini_ruta = s2.cod_ini_ruta AND s1.id = s2.max_id) ins ON ins.cod_ini_ruta = inr.cod_inicio
        //     WHERE cu.manifiesto IS NULL AND ma.estado_seguimiento = 'SEGUIMIENTO'
        //     GROUP BY ma.placa, ma.id ORDER BY ins.tiempo DESC");
        $sql->execute();
        $data = $sql->fetchAll(PDO::FETCH_ASSOC);

        return [
            'data' => $data,
        ];
    }

    // public function Contadores_SinFiltros()
    // {
    //     try {
    //         // Inicia la transacción
    //         $this->_db3->beginTransaction();
    //         // Nueva consulta para contar los manifiestos en seguimiento
    //         $sql_total_Seguimiento = "SELECT COUNT(DISTINCT ma.id,inr.num_manifiesto) AS total_manifiestos_seguimiento
    //         FROM cmx_manifiesto ma
    //         INNER JOIN cmx_inicio_ruta inr ON ma.id = inr.num_manifiesto
    //         LEFT JOIN cmx_cumplido cu ON ma.id = cu.manifiesto
    //         WHERE cu.manifiesto IS NULL AND ma.estado_seguimiento='SEGUIMIENTO'";
    //         $resultado_total = $this->_db3->query($sql_total_Seguimiento);
    //         $resultado_total->setFetchMode(PDO::FETCH_ASSOC);
    //         $total_manifiestos_seguimiento = $resultado_total->fetch();

    //         // Nueva consulta para contar los manifiestos en seguimiento Y llegada
    //         $sql_total_general = "SELECT COUNT(DISTINCT ma.id) AS total_manifiestos_general
    //         FROM cmx_manifiesto ma
    //         INNER JOIN cmx_inicio_ruta inr ON ma.id = inr.num_manifiesto
    //         LEFT JOIN cmx_cumplido cu ON ma.id = cu.manifiesto
    //         WHERE cu.manifiesto IS NULL AND ma.estado_seguimiento IN ('SEGUIMIENTO', 'LLEGADA')";
    //         $resultado_total_general = $this->_db3->query($sql_total_general);
    //         $resultado_total_general->setFetchMode(PDO::FETCH_ASSOC);
    //         $total_manifiestos_general = $resultado_total_general->fetch();


    //         // Nueva consulta para contar los manifiestos en llegada
    //         $sql_total_Seguimiento_llegada = "SELECT COUNT(DISTINCT ma.id) AS total_manifiestos_llegada
    //         FROM cmx_manifiesto ma
    //         INNER JOIN cmx_inicio_ruta inr ON ma.id = inr.num_manifiesto
    //         LEFT JOIN cmx_cumplido cu ON ma.id = cu.manifiesto
    //         WHERE cu.manifiesto IS NULL AND ma.estado_seguimiento = 'LLEGADA'";
    //         $resultado_total_llegada = $this->_db3->query($sql_total_Seguimiento_llegada);
    //         $resultado_total_llegada->setFetchMode(PDO::FETCH_ASSOC);
    //         $total_manifiestos_llegada = $resultado_total_llegada->fetch();

    //         // Confirma la transacción
    //         $this->_db3->commit();
    //         // Retorna ambos resultados
    //         return [
    //             'total_manifiestos_seguimiento' => $total_manifiestos_seguimiento['total_manifiestos_seguimiento'],
    //             'total_manifiestos_general' => $total_manifiestos_general['total_manifiestos_general'],
    //             'total_manifiestos_llegada' => $total_manifiestos_llegada['total_manifiestos_llegada'],
    //         ];
    //     } catch (\Throwable $th) {
    //         // Realiza un rollback en caso de error
    //         $this->_db3->rollBack();
    //         // Manejo del error
    //         $error = $th->getMessage();
    //         throw new Exception("Error en la consulta: " . $error);
    //     }
    // }


    public function Contadores_SinFiltros()
    {
        try {
            // Inicia la transacción
            $this->_db3->beginTransaction();

            // 1. Contar manifiestos en seguimiento
            $sql_total_Seguimiento = "
            SELECT COUNT(DISTINCT ma.id) AS total_manifiestos_seguimiento
            FROM cmx_manifiesto ma
            INNER JOIN cmx_inicio_ruta inr ON ma.id = inr.num_manifiesto
            WHERE NOT EXISTS (
                SELECT 1 FROM cmx_cumplido cu WHERE cu.manifiesto = ma.id
            )
            AND ma.estado_seguimiento = 'SEGUIMIENTO'";
            $resultado_total = $this->_db3->query($sql_total_Seguimiento);
            $resultado_total->setFetchMode(PDO::FETCH_ASSOC);
            $total_manifiestos_seguimiento = $resultado_total->fetch();

            // 2. Contar manifiestos en seguimiento o llegada
            $sql_total_general = "
            SELECT COUNT(DISTINCT ma.id) AS total_manifiestos_general
            FROM cmx_manifiesto ma
            INNER JOIN cmx_inicio_ruta inr ON ma.id = inr.num_manifiesto
            WHERE NOT EXISTS (
                SELECT 1 FROM cmx_cumplido cu WHERE cu.manifiesto = ma.id
            )
            AND ma.estado_seguimiento IN ('SEGUIMIENTO', 'LLEGADA')";
            $resultado_total_general = $this->_db3->query($sql_total_general);
            $resultado_total_general->setFetchMode(PDO::FETCH_ASSOC);
            $total_manifiestos_general = $resultado_total_general->fetch();

            // 3. Contar manifiestos en llegada
            $sql_total_llegada = "
            SELECT COUNT(DISTINCT ma.id) AS total_manifiestos_llegada
            FROM cmx_manifiesto ma
            INNER JOIN cmx_inicio_ruta inr ON ma.id = inr.num_manifiesto
            WHERE NOT EXISTS (
                SELECT 1 FROM cmx_cumplido cu WHERE cu.manifiesto = ma.id
            )
            AND ma.estado_seguimiento = 'LLEGADA'";
            $resultado_total_llegada = $this->_db3->query($sql_total_llegada);
            $resultado_total_llegada->setFetchMode(PDO::FETCH_ASSOC);
            $total_manifiestos_llegada = $resultado_total_llegada->fetch();

            // Confirma la transacción
            $this->_db3->commit();

            // Retorna los resultados
            return [
                'total_manifiestos_seguimiento' => $total_manifiestos_seguimiento['total_manifiestos_seguimiento'],
                'total_manifiestos_general'     => $total_manifiestos_general['total_manifiestos_general'],
                'total_manifiestos_llegada'     => $total_manifiestos_llegada['total_manifiestos_llegada'],
            ];
        } catch (\Throwable $th) {
            // Rollback en caso de error
            $this->_db3->rollBack();

            // Lanza la excepción
            throw new Exception("Error en la consulta: " . $th->getMessage());
        }
    }

    public function listar_seguimientos_llegada()
    {
        try {
            $sql = "SELECT 
                    -- ma.*,
                    ma.id,
	                ma.placa,
                    pro.nombre, 
                    pro.apellido1, 
                    pro.apellido2,
                    pro.celular,
                    mn1.municipio AS origen, 
                    mn2.municipio AS destino,
                    inr.cod_inicio AS cod_ini_ruta,
                    cl.nombre AS cliente_nombre,
                    oc.mer_producto
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
                LEFT JOIN cmx_cumplido cu ON ma.id = cu.manifiesto
                WHERE cu.manifiesto IS NULL 
                AND ma.estado_seguimiento = 'LLEGADA'
                GROUP BY  ma.id
                ORDER BY ma.id ASC";

            $stmt = $this->_db3->prepare($sql);
            $stmt->execute(); // ✅ Ejecutar la consulta

            return $stmt->fetchAll(PDO::FETCH_ASSOC); // ✅ Retornar resultados en forma asociativa
        } catch (PDOException $e) {
            throw new Exception("Error en listar_seguimientos_llegada: " . $e->getMessage());
        }
    }

    public function Consultar_Notas_Controlador($codini)
    {
        $sql = $this->_db3->prepare("SELECT ins.hora, ins.fecha, ins.observacion, IFNULL(m.municipio, pc.punto_controlador) AS Municipio, ins.usuario, ins.novedad
        FROM cmx_inicio_seguimiento ins
        LEFT JOIN cmx_planruta_detalle prd ON prd.cod_punto = ins.codigo_punto
        LEFT JOIN cmx_municipios m ON ins.detalle_tipo = m.id
        LEFT JOIN cmx_puntos_controlador pc ON ins.id = pc.seguimiento_id
        LEFT JOIN cmx_para_punto_ruta ppr ON ppr.id = ins.codigo_punto
        WHERE ins.cod_ini_ruta = :Codigo_Inicio
        ORDER BY ins.id DESC
        LIMIT 1");
        $sql->bindParam(':Codigo_Inicio', $codini, PDO::PARAM_STR);
        $sql->execute();
        $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultados;
    }

    /* Consulta para asignar los planes de ruta */

    // public function crear_inicio_ruta($datos)
    // {
    //     $_msg_error = "";

    //     // Iniciar una transacción
    //     $this->_db3->beginTransaction();

    //     $fecha = date('Y-m-d');
    //     $hora = date('H:i:s');
    //     $user = $_SESSION["usuario"]["nom_usuario"];

    //     try {
    //         // // Validar y sanear los datos
    //         // $cab = filter_input(INPUT_POST, 'cab', FILTER_SANITIZE_NUMBER_INT);
    //         if ($datos['cab'] == '1') {

    //             //Selccionar el el codigo de inicio del maestro
    //             $empresa_id = $_SESSION['usuario']['empresa_id'];
    //             $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='INICIO_RUTA' AND numero_actual>numero_inicial AND empresa_id='" . $empresa_id . "'");
    //             $resultado_consecutivo = $sql_consecutivo->execute();
    //             $resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
    //             $numdoc_inicio_ruta = $resultado_consecutivo['numero_actual'];
    //             $numero_inicioruta = $resultado_consecutivo['numero_actual'] + 1;

    //             if ($numdoc_inicio_ruta) {
    //                 # code...
    //             } else {
    //                 # code...
    //             }


    //             // Inserción en cmx_inicio_ruta
    //             $sql = "INSERT INTO cmx_inicio_ruta (id, cod_inicio, num_manifiesto, cod_plan, cond_cedula, placa, observacion, fecha, hora, usuario, clave_tarjeta, fechasalida, horasalida)
    //                 VALUES (null, :cod_ini, :mani, :Plan, :cedula, :placa, :obse, :fecha, :hora, :user, :calvetj, :fechasalida, :horasalida)";
    //             $crearinicio = $this->_db3->prepare($sql);
    //             $crearinicio->bindParam(':cod_ini', $numdoc_inicio_ruta);
    //             $crearinicio->bindParam(':mani', $datos['mani']);
    //             $crearinicio->bindParam(':Plan', $datos['Plan']);
    //             $crearinicio->bindParam(':cedula', $datos['cedula']);
    //             $crearinicio->bindParam(':placa', $datos['placa']);
    //             $crearinicio->bindParam(':obse', $datos['obse']);
    //             $crearinicio->bindParam(':fecha', $datos['fecha']);
    //             $crearinicio->bindParam(':hora', $datos['hora']);
    //             $crearinicio->bindParam(':user', $datos['user']);
    //             $crearinicio->bindParam(':calvetj', $datos['calvetj']);
    //             $crearinicio->bindParam(':fechasalida', $datos['fechasalida']);
    //             $crearinicio->bindParam(':horasalida', $datos['horasalida']);
    //             $crearinicio->execute();

    //             // Actualización de cmx_manifiesto
    //             $sql_update_manifiesto = "UPDATE cmx_manifiesto SET estado_seguimiento = 'SALIDA' WHERE id = :mani";
    //             $result_update = $this->_db3->prepare($sql_update_manifiesto);
    //             $result_update->bindParam(':mani', $datos['mani']);
    //             $result_update->execute();

    //             // Inserción en cmx_inici_manifiesto_estado
    //             $sql3 = "INSERT INTO cmx_inici_manifiesto_estado (id, cod_ini_ruta, estado, actual, fecha, hora, usuario, ultimo_estado)
    //                  VALUES (null, :cod_ini, '2', 'completado', :fecha, :hora, :user, '1')";
    //             $crearmani = $this->_db3->prepare($sql3);
    //             $crearmani->bindParam(':cod_ini', $numdoc_inicio_ruta);
    //             $crearmani->bindParam(':fecha', $fecha);
    //             $crearmani->bindParam(':hora', $hora);
    //             $crearmani->bindParam(':user', $user);
    //             $crearmani->execute();

    //             // Consultar los números de servicio
    //             $sqlx = "SELECT id_servicio FROM cmx_planilla_detalle1 WHERE id_planilla = :id_estudio";
    //             $consul = $this->_db3->prepare($sqlx);
    //             $consul->bindParam(':id_estudio', $datos['id_estudio']);
    //             $consul->execute();
    //             $numero_servicio = $consul->fetchAll();

    //             // Inserción en cmx_cliente_envio
    //             foreach ($numero_servicio as $value) {
    //                 $num = $value['id_servicio'];
    //                 $sqli = "INSERT INTO cmx_cliente_envio (id, estado, fecha, hora, usuario, id_servicio, cod_ini_ruta)
    //                      VALUES (null, '1', :fecha, :hora, :user, :num, :cod_ini)";
    //                 $crear = $this->_db3->prepare($sqli);
    //                 $crear->bindParam(':fecha', $fecha);
    //                 $crear->bindParam(':hora', $hora);
    //                 $crear->bindParam(':user', $user);
    //                 $crear->bindParam(':num', $num);
    //                 $crear->bindParam(':cod_ini', $numdoc_inicio_ruta);
    //                 $crear->execute();
    //             }
    //         }

    //         // Puntos de entrega
    //         if ($datos['pun'] == '2') {

    //             foreach ($datos['maximo'] as $value) {
    //                 // Inserción en cmx_ruta_puntosentrega
    //                 $sql2 = "INSERT INTO cmx_ruta_puntosentrega (id, cod_ini_ruta, municipio_entrega, direccion_entrega, cliente, remesa, fecha_estimada_entrega, observacion, fecha, hora, usuario, hora_estimada, tipo, orden)
    //                      VALUES (null, :cod_ini, :mentrega, :dire, :cliente, :remesa, :fentrega, :obs, :fecha, :hora, :user, :hora_estimada, :tipo, :orden)";
    //                 $crearentre = $this->_db3->prepare($sql2);
    //                 $crearentre->bindParam(':cod_ini', $numdoc_inicio_ruta);
    //                 $crearentre->bindParam(':mentrega', $datos['mentrega']);
    //                 $crearentre->bindParam(':dire', $datos['dire']);
    //                 $crearentre->bindParam(':cliente', $datos['cliente']);
    //                 $crearentre->bindParam(':remesa', $datos['remesa']);
    //                 $crearentre->bindParam(':fentrega', $datos['fentrega']);
    //                 $crearentre->bindParam(':obs', $datos['obs']);
    //                 $crearentre->bindParam(':fecha', $fecha);
    //                 $crearentre->bindParam(':hora', $hora);
    //                 $crearentre->bindParam(':user', $user);
    //                 $crearentre->bindParam(':hora_estimada', $datos['hora_estimada']);
    //                 $crearentre->bindParam(':tipo', $datos['tipo']);
    //                 $crearentre->bindParam(':orden', $datos['orden']);
    //                 $crearentre->execute();
    //             }
    //         }

    //         // Confirmar transacción
    //         $this->_db3->commit();

    //         echo json_encode(['status' => 'success', 'message' => 'Proceso completado exitosamente']);
    //     } catch (Exception $e) {
    //         // Revertir cambios en caso de error
    //         $this->_db3->rollBack();
    //         echo json_encode(['status' => 'error', 'message' => 'Error: ' . $e->getMessage()]);
    //     }
    // }

    public function crear_inicio_ruta($datos)
    {
        $_msg_error = "";
        $this->_db3->beginTransaction();

        $fecha = date('Y-m-d');
        $hora = date('H:i:s');
        $user = $_SESSION["usuario"]["nom_usuario"];
        $empresa_id = $_SESSION['usuario']['empresa_id'];

        try {
            // Validación: cabecera
            if ($datos['cab'] === '1') {
                // Obtener número actual del maestro
                $sql_consecutivo = $this->_db3->prepare("
                SELECT numero_actual 
                FROM cmx_maestro 
                WHERE tipo = 'INICIO_RUTA' 
                    AND numero_actual > numero_inicial 
                    AND empresa_id = :empresa_id
                LIMIT 1
            ");
                $sql_consecutivo->bindParam(':empresa_id', $empresa_id);
                $sql_consecutivo->execute();
                $res = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);

                if (!$res || !isset($res['numero_actual'])) {
                    throw new Exception("No se pudo obtener número consecutivo para INICIO_RUTA.");
                }

                $numdoc_inicio_ruta = $res['numero_actual'];
                $nuevo_consecutivo = $numdoc_inicio_ruta + 1;

                // Insertar en cmx_inicio_ruta
                $sql = "INSERT INTO cmx_inicio_ruta (
                        cod_inicio, num_manifiesto, cod_plan, cond_cedula, placa, observacion,
                        fecha, hora, usuario, clave_tarjeta, fechasalida, horasalida
                    ) VALUES (
                        :cod_ini, :mani, :Plan, :cedula, :placa, :obse,
                        :fecha, :hora, :user, :calvetj, :fechasalida, :horasalida
                    )";

                $stmt = $this->_db3->prepare($sql);
                $stmt->execute([
                    ':cod_ini' => $numdoc_inicio_ruta,
                    ':mani' => $datos['mani'],
                    ':Plan' => $datos['Plan'],
                    ':cedula' => $datos['cedula'],
                    ':placa' => $datos['placa'],
                    ':obse' => $datos['obse'],
                    ':fecha' => $datos['fecha'],
                    ':hora' => $datos['hora'],
                    ':user' => $datos['user'],
                    ':calvetj' => $datos['calvetj'],
                    ':fechasalida' => $datos['fechasalida'],
                    ':horasalida' => $datos['horasalida'],
                ]);

                // Actualizar cmx_manifiesto
                $stmt = $this->_db3->prepare("
                UPDATE cmx_manifiesto 
                SET estado_seguimiento = 'SALIDA' 
                WHERE id = :mani
            ");
                $stmt->bindParam(':mani', $datos['mani']);
                $stmt->execute();

                // Insertar estado de manifiesto
                $stmt = $this->_db3->prepare("
                INSERT INTO cmx_inici_manifiesto_estado (
                    cod_ini_ruta, estado, actual, fecha, hora, usuario, ultimo_estado
                ) VALUES (
                    :cod_ini, '2', 'completado', :fecha, :hora, :user, '1'
                )
            ");
                $stmt->execute([
                    ':cod_ini' => $numdoc_inicio_ruta,
                    ':fecha' => $fecha,
                    ':hora' => $hora,
                    ':user' => $user,
                ]);

                // Obtener servicios de la planilla
                $stmt = $this->_db3->prepare("
                SELECT id_servicio 
                FROM cmx_planilla_detalle1 
                WHERE id_planilla = :id_estudio
            ");
                $stmt->bindParam(':id_estudio', $datos['id_estudio']);
                $stmt->execute();
                $servicios = $stmt->fetchAll(PDO::FETCH_COLUMN);

                // Insertar en cmx_cliente_envio
                foreach ($servicios as $id_servicio) {
                    $stmt = $this->_db3->prepare("
                    INSERT INTO cmx_cliente_envio (
                        estado, fecha, hora, usuario, id_servicio, cod_ini_ruta
                    ) VALUES (
                        '1', :fecha, :hora, :user, :id_servicio, :cod_ini
                    )
                ");
                    $stmt->execute([
                        ':fecha' => $fecha,
                        ':hora' => $hora,
                        ':user' => $user,
                        ':id_servicio' => $id_servicio,
                        ':cod_ini' => $numdoc_inicio_ruta,
                    ]);
                }

                // Actualizar consecutivo en cmx_maestro
                $stmt = $this->_db3->prepare("
                UPDATE cmx_maestro 
                SET numero_actual = :nuevo_consecutivo 
                WHERE tipo = 'INICIO_RUTA' 
                    AND empresa_id = :empresa_id
            ");
                $stmt->execute([
                    ':nuevo_consecutivo' => $nuevo_consecutivo,
                    ':empresa_id' => $empresa_id,
                ]);
            }

            // Puntos de entrega
            if ($datos['pun'] === '2' && !empty($datos['maximo'])) {
                foreach ($datos['maximo'] as $value) {
                    $stmt = $this->_db3->prepare("
                    INSERT INTO cmx_ruta_puntosentrega (
                        cod_ini_ruta, municipio_entrega, direccion_entrega, cliente,
                        remesa, fecha_estimada_entrega, observacion, fecha, hora,
                        usuario, hora_estimada, tipo, orden
                    ) VALUES (
                        :cod_ini, :mentrega, :dire, :cliente,
                        :remesa, :fentrega, :obs, :fecha, :hora,
                        :user, :hora_estimada, :tipo, :orden
                    )
                ");
                    $stmt->execute([
                        ':cod_ini' => $numdoc_inicio_ruta,
                        ':mentrega' => $datos['mentrega'],
                        ':dire' => $datos['dire'],
                        ':cliente' => $datos['cliente'],
                        ':remesa' => $datos['remesa'],
                        ':fentrega' => $datos['fentrega'],
                        ':obs' => $datos['obs'],
                        ':fecha' => $fecha,
                        ':hora' => $hora,
                        ':user' => $user,
                        ':hora_estimada' => $datos['hora_estimada'],
                        ':tipo' => $datos['tipo'],
                        ':orden' => $datos['orden'],
                    ]);
                }
            }

            // Confirmar transacción
            $this->_db3->commit();

            return [
                'status' => 'success',
                'message' => 'Inicio de ruta registrado correctamente',
                'cod_inicio_ruta' => $numdoc_inicio_ruta
            ];
        } catch (Exception $e) {
            $this->_db3->rollBack();
            return [
                'status' => 'error',
                'message' => 'Error al registrar inicio de ruta: ' . $e->getMessage()
            ];
        }
    }


    public function Validar_Parametros_Salida($placa, $cedula, $celular)
    {
        try {
            $params = [
                'placa' => $placa,
                'cedula' => $cedula,
                'celular' => $celular,
            ];

            foreach ($params as $key => $value) {
                // Crear consulta dinámica basada en el parámetro no nulo
                $query = " SELECT inr.placa, inr.cod_inicio, ma.id AS manifiesto
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
                INNER JOIN cmx_solicitud_vehiculo2 cs ON cs.nundoc_solicitud = oc.mer_idservicio
                INNER JOIN cmx_detalle_mercancia2 dm ON dm.n_cotizacion = cs.n_cotizacion
                LEFT JOIN cmx_cumplido cu ON ma.id = cu.manifiesto
                LEFT JOIN cmx_inicio_seguimiento ins ON ins.cod_ini_ruta = inr.cod_inicio
                WHERE cu.manifiesto IS NULL 
                AND ma.estado_seguimiento = 'SEGUIMIENTO'
                AND " . ($key === 'placa' ? 'inr.placa = :placa' : ($key === 'cedula' ? 'pro.numero_documento = :cedula' : 'pro.celular = :celular'));

                $stmt = $this->_db3->prepare($query);
                $stmt->execute([":$key" => $value]);
                $result = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($result) {
                    return [
                        "estado" => true,
                        "dato" => $result['manifiesto'],
                    ];
                }
            }

            // Si ninguna consulta devuelve resultados
            return ["estado" => false];
        } catch (\Throwable $th) {
            // Manejo de excepciones mejorado
            error_log("Error en Validar_Parametros_Salida: " . $th->getMessage());
            return ["estado" => false, "error" => $th->getMessage()];
        }
    }

    public function Salida_Manifiesto($manifiesto_id, $codigo_inicio_salida)
    {
        $response = [];

        $sql_inicio = $this->_db3->prepare("SELECT id FROM cmx_inicio_ruta WHERE num_manifiesto=$manifiesto_id ORDER BY id DESC LIMIT 1");
        $sql_inicio->execute();
        $result_id = $sql_inicio->fetch(PDO::FETCH_ASSOC);
        $idm = $result_id["id"];
        /* Insertar en la tabla cmx_inici_manifiesto_estado para saber el ultimo estado */
        $estadoq = 5;
        $procesoq = 'completado';
        $fecha = date('Y-m-d');
        $hora = date('H:i:s');
        $user = $_SESSION["usuario"]["nom_usuario"];
        $reportecliente = 'no';
        $tipo_contacto = 'Llamada telefonica';
        $tipo_seguimiento = 'punto geografico';
        $detalle_tipo = 101;
        $tipo_proceso = 'seguimiento';
        $observacion = 'observacion';
        $novedad = 'novedad';
        $ocurrio = 'En sitio';
        $codigo_punto = 0;
        $tiempo = 0;
        $estado_punto = 'CERRADO';

        $sql_insert_inici = $this->_db3->prepare("INSERT INTO cmx_inici_manifiesto_estado (id,cod_ini_ruta,estado,actual,fecha,hora,usuario,ultimo_estado,reporte_cliente)
                        VALUES(null,'$codigo_inicio_salida','$estadoq','$procesoq','$fecha','$hora','$user','1','$reportecliente')");
        $result_estado = $sql_insert_inici->execute();
        if ($result_estado) {
            $sql_inicio_estado = $this->_db3->prepare("SELECT id FROM cmx_inici_manifiesto_estado WHERE cod_ini_ruta=$codigo_inicio_salida ORDER BY id DESC LIMIT 1");
            $sql_inicio_estado->execute();
            $result_idesatdo = $sql_inicio_estado->fetch(PDO::FETCH_ASSOC);
            $idmestado = $result_idesatdo["id"];

            $sql_insert_inicio = $this->_db3->prepare("INSERT INTO cmx_inicio_seguimiento (id,cod_man_estado,tipo_contacto,tipo_seguimiento,detalle_tipo,tipo_proceso,observacion,fecha,hora,usuario,reporte_cliente,cod_ini_ruta,novedad,ocurrio,codigo_punto,tiempo,estado_punto)
            VALUES (null,'$idmestado','$tipo_contacto','$tipo_seguimiento','$detalle_tipo','$tipo_proceso','$observacion','$fecha','$hora','$user','$reportecliente','$codigo_inicio_salida','$novedad','$ocurrio','$codigo_punto','$tiempo','$estado_punto')");
            $result = $sql_insert_inicio->execute();

            $id_seguimiento = $this->_db3->lastInsertId();
            if ($result) {

                // Insertar ultimo seguimiento para la nota
                $sql = $this->_db3->prepare("INSERT INTO cmx_ultimo_seguimiento (manifiesto_id, seguimiento_id, usuario, fecha, hora)
                                    VALUES (:manifiesto_id, :seguimiento_id, :usuario, :fecha, :hora)
                                    ON DUPLICATE KEY UPDATE
                                        seguimiento_id = VALUES(seguimiento_id),
                                        usuario = VALUES(usuario),
                                        fecha = VALUES(fecha),
                                        hora = VALUES(hora)
                                ");
                $sql->bindParam(':manifiesto_id', $manifiesto_id, PDO::PARAM_INT);
                $sql->bindParam(':seguimiento_id', $id_seguimiento);
                $sql->bindParam(':usuario', $user);
                $sql->bindParam(':fecha', $fecha);
                $sql->bindParam(':hora', $hora);
                $sql->execute();

                $sql = $this->_db3->prepare("UPDATE cmx_manifiesto SET estado_seguimiento=:estado_seguimiento WHERE id=:num_manifiesto");
                $estado = 'SEGUIMIENTO';
                $sql->bindParam(':estado_seguimiento', $estado, PDO::PARAM_STR);
                $sql->bindParam(':num_manifiesto', $manifiesto_id, PDO::PARAM_STR);
                $sql->execute();
                if ($sql) {
                    $response = true;
                } else {
                    $response = false;
                }
            } else {
                echo 'No inserto en la tabla cmx_inicio_seguimiento para guardar el punto';
            }
        } else {
            echo 'No inserto en la tabla cmx_inici_manifiesto_estado para obtener el ultimo estado del registro';
        }
        return $response;
    }

    public function Lista_Novedades($codigo)
    {
        $sql = $this->_db3->prepare("SELECT * FROM cmx_para_novedades_seguimiento WHERE id LIKE :codigo OR novedad LIKE :codigo");
        $codigo = '%' . $codigo . '%';  // Concatenar los comodines al valor de $codigo
        $sql->bindParam(':codigo', $codigo, PDO::PARAM_STR);
        $sql->execute();
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function Consulta_Manifiestos_Pendientes()
    {

        $sql = $this->_db3->prepare("
            SELECT 
                mn.id AS n_manifiesto,
                mn.placa AS placa_manifiesto,
                pro.numero_documento,
                pro.nombre,
                pro.apellido1,
                pro.apellido2,
                ve.placa AS placa_vehiculo,
                cla.clase,
                pro.celular,
                dc.celular2,
                ve.web_satelital,
                ve.usuario_satelital,
                ve.clave_satelital,
                tra.placa AS placatrailer,
                mn1.municipio AS origen_final,
                mn2.municipio AS destino_final,
                mn.origen_viaje,
                mn.destino_viaje,
                mn.tipo_manifiesto,
                mn.fecha_expedicion,
                mn.hora_expedicion,
                mn.manifiesto_itr,
                CASE
                    WHEN mn.manifiesto_itr = 'NO' THEN 'Sin ITR y sin cita'
                    WHEN mn.manifiesto_itr = 'SI' AND ac.confirmacion = 'Confirmada' AND ac.esatdo_cita = 'ACTIVO' THEN 'Con ITR y cita confirmada'
                    ELSE 'Otro'
                END AS tipo_registro
            FROM 
                cmx_manifiesto mn
            INNER JOIN 
                cmx_manifiesto_estado me ON mn.id = me.id_manifiesto
            INNER JOIN 
                cmx_municipios mn1 ON mn.origen_viaje = mn1.id
            INNER JOIN 
                cmx_municipios mn2 ON mn.destino_viaje = mn2.id
            INNER JOIN 
                cmx_proveedores pro ON pro.numero_documento = mn.conductor_manifiesto
            INNER JOIN 
                cmx_detalle_conductor dc ON pro.numdoc_nexos = dc.id_proveedor
            INNER JOIN 
                cmx_vehiculos ve ON mn.placa = ve.placa
            INNER JOIN 
                cmx_vehiculo2 ve2 ON ve.numdoc_vehiculo = ve2.id_vehiculo
            INNER JOIN 
                cmx_rndc_clase_vehiculo cla ON cla.id = ve2.clase_vehiculo
            LEFT JOIN 
                cmx_trailer_vehiculo ti ON ve.numdoc_vehiculo = ti.id_vehiculo AND ti.estado = 1
            LEFT JOIN 
                cmx_trailer tra ON ti.id_trailer = tra.numdoc_trailer
            LEFT JOIN 
                cmx_inicio_ruta b ON mn.id = b.num_manifiesto
            LEFT JOIN 
                cmx_asigancio_cita ac ON mn.id = ac.manifiesto
          
            GROUP BY 
                mn.id 
            ORDER BY 
                mn.id ASC
        ");
        $sql->execute();
        $result = $sql->fetchAll(PDO::FETCH_ASSOC);

        $response = [
            "result" => $result
        ];
        return $response;
    }

    public function Maximo_Estado($id)
    {
        $sql = $this->_db3->prepare("SELECT e.estado, s.estado as letra
				FROM cmx_inici_manifiesto_estado e
				INNER JOIN  cmx_estado_segui s ON e.estado=s.id
				WHERE e.cod_ini_ruta=:CodIni AND e.ultimo_estado=1");
        $sql->bindParam(':CodIni', $id);
        $sql->execute();
        $result = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function Consulta_Solicitudes($id)
    {
        $sql = $this->_db3->prepare("SELECT oc.mer_idservicio , cli.nombre
		FROM cmx_manifiesto ma
		INNER JOIN cmx_manifiesto_remesa rema ON ma.id=rema.id_manifiesto AND rema.estado=1
		INNER JOIN cmx_remesa_ordencargue roc ON rema.id_remesa=roc.id_remesa AND roc.estado=1
		INNER JOIN cmx_orden_cargue oc ON roc.id_orden_cargue=oc.id AND oc.estado=1
		INNER JOIN cmx_clientes cli ON oc.cli_id=cli.id
		WHERE ma.id=:Manifiesto
		GROUP BY oc.mer_idservicio");
        $sql->bindParam(':Manifiesto', $id);
        $sql->execute();
        $result = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function Validar_Tipo_Proceso($cod_iniruta, $segui, $detalle, $proce)
    {

        $sql = $this->_db3->prepare("SELECT i.* FROM cmx_inicio_seguimiento i
				INNER JOIN cmx_inici_manifiesto_estado e ON i.cod_man_estado=e.id
				WHERE i.cod_ini_ruta=:cod_iniruta
				AND i.tipo_seguimiento=:segui
				AND i.detalle_tipo=:detalle
				AND i.tipo_proceso='completado'");
        $sql->bindParam(':cod_iniruta', $cod_iniruta);
        $sql->bindParam(':segui', $segui);
        $sql->bindParam(':detalle', $detalle);
        $sql->execute();
        $result = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function guardarGestion($data, $orden_cargue_id, $remesa_descargue_id)
    {
        $_msg_error = "";
        $response = [];
        $ultimoseguimiento = [];
        // $model = new Conexion;
        // $conexion = $model->conectar();
        $fecha = date('Y-m-d');
        $hora = date('H:i:s');
        $user = $_SESSION["usuario"]["nom_usuario"];

        /* Verificar el si esta enviando el punto de llegada para validar los tiempos logisticos  */
        if ($data["accion_punto"] == "Lugar Llegada") {
            $manifiesto = $data["manifiesto"];
            $ordenes_cargue = $orden_cargue_id;
            $remesas_descargue = $remesa_descargue_id;
            /* Validar los tiempo de cargue del manifiesto */
            $sql_tiempo_cargue = $this->_db3->prepare("SELECT num_manifiesto,id FROM cmx_tiempo_cargue WHERE num_manifiesto=$manifiesto LIMIT 1");
            $sql_tiempo_cargue->execute();
            $result_tiempo_cargue = $sql_tiempo_cargue->fetch();

            if ($result_tiempo_cargue) {
                $validar_todas_orden_cargue = true; // Inicialmente asumimos que todas las remesas son válidas.
                for ($i = 0; $i < count($ordenes_cargue); $i++) {
                    $orden_cargue = $ordenes_cargue[$i];
                    $sql_ordenes_Cargue = $this->_db3->prepare("SELECT id_orden_cargue FROM cmx_tiempo_cargue_ordenes WHERE id_orden_cargue=$orden_cargue /*AND id_cargue=$result_tiempo_cargue[id]*/");
                    $sql_ordenes_Cargue->execute();
                    $result_orden_cargue = $sql_ordenes_Cargue->fetch();
                    if (!$result_orden_cargue) {
                        $validar_todas_orden_cargue = false;
                        break;
                    }
                }

                if ($validar_todas_orden_cargue) {
                    /* Validar tiempos logisticos de descargues*/
                    $sql_tiempo_descargue = $this->_db3->prepare("SELECT num_manifiesto,id FROM cmx_tiempo_descargue WHERE num_manifiesto=$manifiesto LIMIT 1");
                    $sql_tiempo_descargue->execute();
                    $result_tiempo_descargue = $sql_tiempo_descargue->fetch();

                    if ($result_tiempo_descargue) {
                        $validar_todas_remesas = true; // Inicialmente asumimos que todas las remesas son válidas.

                        for ($o = 0; $o < count($remesas_descargue); $o++) {
                            $remesa = $remesas_descargue[$o];
                            $sql_remesas_decargue = $this->_db3->prepare("SELECT id_remesa FROM cmx_tiempo_descargue_rem WHERE id_remesa = :remesa");
                            $sql_remesas_decargue->bindParam(':remesa', $remesa);
                            $sql_remesas_decargue->execute();
                            $result_remesas_descargue = $sql_remesas_decargue->fetch();

                            // Si alguna remesa no existe, marcamos como falso y rompemos el bucle.
                            if (!$result_remesas_descargue) {
                                $validar_todas_remesas = false;
                                break;
                            }
                        }

                        if ($validar_todas_remesas) {
                            /* Logica para insertar la nota en las tabla de sguimiento del controlador de ruta */
                            // Validar el valor de Ocurrio para las insertsiones a las base de datos
                            if ($data["ocurrio"] == "En sitio") {
                                /* Validar si la novedad es comentario o alguna novedad */
                                if ($data["novedad_general"] == "COMENTARIO" || substr($data["novedad_general"], 0, 7) == "NOVEDAD") {
                                    $codigo = $data["id_ini_ruta"];
                                    /* Consultar el tiempo del ultimo punto de este manifiesto para mantenerlo */
                                    $sql_ultimo_tiempo = $this->_db3->prepare("SELECT tiempo FROM cmx_inicio_seguimiento WHERE cod_ini_ruta=$codigo ORDER BY id DESC LIMIT 1");
                                    $sql_ultimo_tiempo->execute();
                                    $result_tiempo = $sql_ultimo_tiempo->fetch();
                                    $tiempo = $result_tiempo['tiempo'];
                                    if ($tiempo) {
                                        if ($data) {
                                            $id_ini_ruta = $data["id_ini_ruta"];
                                            $idm = $data["idmanifiesto"];
                                            $contacto = $data["contacto"];
                                            $tsegui = $data["tipo_seguimiento"];
                                            $tdetalle = empty($data["tipo_detalle"]) ? 0 : $data["tipo_detalle"];
                                            $tproceso = $data["tipo_proceso"];
                                            $observa = $data["observacion"];
                                            $reportecliente = $data["reporte_cliente"];
                                            // $estadoactual = $data["estado_actual"];
                                            $deta = $data["accion_completado"];
                                            $nota_punto_controlador = $data["nota_punto_controlador"];
                                            $tipo = $data["tipo_seguimiento"];
                                            if (isset($data["novedad_general"])) {
                                                $new = $data["novedad_general"];
                                            } else {
                                                $new = '';
                                            }
                                            $ocurrio = $data["ocurrio"];
                                            $codigo_punto = empty($data["codigo_punto"]) ? 0 : $data["codigo_punto"];
                                            $accion_punto = $data["accion_punto"];
                                            $manifiesto = $data["manifiesto"];
                                            $estado_punto = 'CERRADO';
                                            //estado
                                            $id_ini_ruta = $data["id_ini_ruta"];
                                            $estadoq = $data["estado_siguiente"];
                                            $procesoq = $data["accion_completado"];

                                            try {
                                                $this->_db3->beginTransaction();

                                                // 1. Actualizar ultimo estado a 0
                                                $sql4 = "UPDATE cmx_inici_manifiesto_estado SET ultimo_estado = 0 WHERE cod_ini_ruta = :id_ini_ruta";
                                                $stmt4 = $this->_db3->prepare($sql4);
                                                $stmt4->bindParam(':id_ini_ruta', $id_ini_ruta, PDO::PARAM_INT);
                                                $stmt4->execute();

                                                // 2. Insertar nuevo estado
                                                $sql3 = "INSERT INTO cmx_inici_manifiesto_estado 
                                                (cod_ini_ruta, estado, actual, fecha, hora, usuario, ultimo_estado, reporte_cliente)
                                                VALUES (:cod_ini_ruta, :estado, :actual, :fecha, :hora, :usuario, 1, :reporte_cliente)";
                                                $stmt3 = $this->_db3->prepare($sql3);
                                                $stmt3->bindParam(':cod_ini_ruta', $id_ini_ruta);
                                                $stmt3->bindParam(':estado', $estadoq);
                                                $stmt3->bindParam(':actual', $procesoq);
                                                $stmt3->bindParam(':fecha', $fecha);
                                                $stmt3->bindParam(':hora', $hora);
                                                $stmt3->bindParam(':usuario', $user);
                                                $stmt3->bindParam(':reporte_cliente', $reportecliente);
                                                $stmt3->execute();

                                                // 3. Insertar seguimiento
                                                $sql = "INSERT INTO cmx_inicio_seguimiento 
                                                (cod_man_estado, tipo_contacto, tipo_seguimiento, detalle_tipo, tipo_proceso, observacion, fecha, hora, usuario, reporte_cliente, cod_ini_ruta, novedad, ocurrio, codigo_punto, tiempo, estado_punto)
                                                VALUES (:cod_man_estado, :contacto, :tipo_seguimiento, :detalle_tipo, :tipo_proceso, :observacion, :fecha, :hora, :usuario, :reporte_cliente, :cod_ini_ruta, :novedad, :ocurrio, :codigo_punto, :tiempo, :estado_punto)";
                                                $stmt = $this->_db3->prepare($sql);
                                                $stmt->bindParam(':cod_man_estado', $idm);
                                                $stmt->bindParam(':contacto', $contacto);
                                                $stmt->bindParam(':tipo_seguimiento', $tsegui);
                                                $stmt->bindParam(':detalle_tipo', $tdetalle);
                                                $stmt->bindParam(':tipo_proceso', $tproceso);
                                                $stmt->bindParam(':observacion', $observa);
                                                $stmt->bindParam(':fecha', $fecha);
                                                $stmt->bindParam(':hora', $hora);
                                                $stmt->bindParam(':usuario', $user);
                                                $stmt->bindParam(':reporte_cliente', $reportecliente);
                                                $stmt->bindParam(':cod_ini_ruta', $id_ini_ruta);
                                                $stmt->bindParam(':novedad', $new);
                                                $stmt->bindParam(':ocurrio', $ocurrio);
                                                $stmt->bindParam(':codigo_punto', $codigo_punto);
                                                $stmt->bindParam(':tiempo', $tiempo);
                                                $stmt->bindParam(':estado_punto', $estado_punto);
                                                $stmt->execute();

                                                // Obtener id del seguimiento
                                                $sqlf = "SELECT max(id) as ids FROM cmx_inicio_seguimiento WHERE cod_ini_ruta = :id_ini_ruta";
                                                $stmtf = $this->_db3->prepare($sqlf);
                                                $stmtf->bindParam(':id_ini_ruta', $id_ini_ruta);
                                                $stmtf->execute();
                                                $id_seguimiento = $stmtf->fetchColumn();


                                                // Insertar ultimo seguimiento para la nota
                                                $sql = $this->_db3->prepare("INSERT INTO cmx_ultimo_seguimiento (manifiesto_id, seguimiento_id, usuario, fecha, hora)
                                    VALUES (:manifiesto_id, :seguimiento_id, :usuario, :fecha, :hora)
                                    ON DUPLICATE KEY UPDATE
                                        seguimiento_id = VALUES(seguimiento_id),
                                        usuario = VALUES(usuario),
                                        fecha = VALUES(fecha),
                                        hora = VALUES(hora)
                                ");
                                                $sql->bindParam(':manifiesto_id', $manifiesto, PDO::PARAM_INT);
                                                $sql->bindParam(':seguimiento_id', $id_seguimiento);
                                                $sql->bindParam(':usuario', $user);
                                                $sql->bindParam(':fecha', $fecha);
                                                $sql->bindParam(':hora', $hora);
                                                $sql->execute();

                                                // 4. Insertar servicios relacionados
                                                $nservicio = is_array($data["solicitud_servicio_nuevo"])
                                                    ? $data["solicitud_servicio_nuevo"]
                                                    : explode(",", $data["solicitud_servicio_nuevo"]);

                                                foreach ($nservicio as $nsolicitud) {
                                                    $sqls = "INSERT INTO cmx_seguimiento_servicio (id_servicio, id_seguimiento, usuario, hora, fecha)
                                                    VALUES (:id_servicio, :id_seguimiento, :usuario, :hora, :fecha)";
                                                    $stmts = $this->_db3->prepare($sqls);
                                                    $stmts->bindParam(':id_servicio', $nsolicitud);
                                                    $stmts->bindParam(':id_seguimiento', $id_seguimiento);
                                                    $stmts->bindParam(':usuario', $user);
                                                    $stmts->bindParam(':hora', $hora);
                                                    $stmts->bindParam(':fecha', $fecha);
                                                    $stmts->execute();
                                                }

                                                // 5. Cambiar estado del manifiesto
                                                if ($accion_punto == 'Lugar Llegada') {
                                                    $estado = "LLEGADA";
                                                    $estado_punto = "GESTION";

                                                    $sql_upd1 = "UPDATE cmx_manifiesto SET estado_seguimiento = :estado WHERE id = :id";
                                                    $stmt_upd1 = $this->_db3->prepare($sql_upd1);
                                                    $stmt_upd1->bindParam(':estado', $estado);
                                                    $stmt_upd1->bindParam(':id', $manifiesto);
                                                    $stmt_upd1->execute();

                                                    $sql_upd2 = "UPDATE cmx_inicio_seguimiento SET estado_punto = :estado_punto 
                                                    WHERE cod_ini_ruta = :cod_ini_ruta AND codigo_punto = :codigo_punto";
                                                    $stmt_upd2 = $this->_db3->prepare($sql_upd2);
                                                    $stmt_upd2->bindParam(':estado_punto', $estado_punto);
                                                    $stmt_upd2->bindParam(':cod_ini_ruta', $id_ini_ruta);
                                                    $stmt_upd2->bindParam(':codigo_punto', $codigo_punto);
                                                    $stmt_upd2->execute();
                                                } else {
                                                    $sql_es = "UPDATE cmx_manifiesto SET estado_seguimiento = 'SEGUIMIENTO' WHERE id = :id";
                                                    $stmt_es = $this->_db3->prepare($sql_es);
                                                    $stmt_es->bindParam(':id', $manifiesto);
                                                    $stmt_es->execute();
                                                }

                                                // 6. Insertar ubicación si aplica
                                                if ($tipo == 'punto geografico') {
                                                    $sql_ubi = "INSERT INTO cmx_iniruta_ubicacion (cod_ini_ruta, latitud, longitud, usuario, fecha, hora, lugar, id_seguimiento, existe_evidencia)
                                                    VALUES (:cod_ini_ruta, :latitud, :longitud, :usuario, :fecha, :hora, :lugar, :id_seguimiento, :existe_evidencia)";
                                                    $stmt_ubi = $this->_db3->prepare($sql_ubi);
                                                    $stmt_ubi->bindParam(':cod_ini_ruta', $id_ini_ruta);
                                                    $stmt_ubi->bindParam(':latitud', $data["latitud"]);
                                                    $stmt_ubi->bindParam(':longitud', $data["longitud"]);
                                                    $stmt_ubi->bindParam(':usuario', $user);
                                                    $stmt_ubi->bindParam(':fecha', $fecha);
                                                    $stmt_ubi->bindParam(':hora', $hora);
                                                    $stmt_ubi->bindParam(':lugar', $tdetalle);
                                                    $stmt_ubi->bindParam(':id_seguimiento', $id_seguimiento);
                                                    $stmt_ubi->bindParam(':existe_evidencia', $data["edocu"] ?? 0);
                                                    $stmt_ubi->execute();

                                                    // Manejar archivos adjuntos si existen
                                                    $ruta_evidencia = "../public/files/evidencia_seguimiento/$id_ini_ruta/$id_seguimiento/";
                                                    if (!file_exists($ruta_evidencia)) {
                                                        mkdir($ruta_evidencia, 0777, true);
                                                    }

                                                    foreach ($_FILES as $key => $file) {
                                                        if (strpos($key, "udocumnento") !== false) {
                                                            $nombre = $file["name"];
                                                            $ruta_provisional = $file["tmp_name"];
                                                            move_uploaded_file($ruta_provisional, $ruta_evidencia . $nombre);
                                                        }
                                                    }

                                                    // Actualizar evidencia
                                                    $sql_update_ubi = "UPDATE cmx_iniruta_ubicacion 
                                                    SET evidencia = :ruta, existe_evidencia = :existe 
                                                    WHERE id_seguimiento = :id_seguimiento";
                                                    $stmt_update_ubi = $this->_db3->prepare($sql_update_ubi);
                                                    $ruta_db = "public/files/evidencia_seguimiento/$id_ini_ruta/$id_seguimiento/";
                                                    $stmt_update_ubi->bindParam(':ruta', $ruta_db);
                                                    $stmt_update_ubi->bindParam(':existe', $data["edocu"] ?? 0);
                                                    $stmt_update_ubi->bindParam(':id_seguimiento', $id_seguimiento);
                                                    $stmt_update_ubi->execute();
                                                }

                                                $this->_db3->commit();
                                                $response = ["success" => true, "message" => "<b>Nota:</b> Registrada exitosamente en NexosApp."];
                                            } catch (\Throwable $e) {
                                                $this->_db3->rollback();
                                                error_log("Error en transacción: " . $e->getMessage() . " | Usuario: $user | Fecha: " . date("Y-m-d H:i:s") . "\n", 3, 'error_log.txt');
                                                $response = ['success' => false, 'message' => 'Error al registrar la nota. Intenta nuevamente o comunícate con soporte.'];
                                            }
                                        } else {
                                            $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                                        }
                                    } else {
                                        $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                                    }
                                } else {
                                    if ($data) {
                                        $id_ini_ruta = $data["id_ini_ruta"];
                                        $idm = $data["idmanifiesto"];
                                        $contacto = $data["contacto"];
                                        $tsegui = $data["tipo_seguimiento"];
                                        $tdetalle = $data["tipo_detalle"];
                                        $tproceso = $data["tipo_proceso"];
                                        $observa = $data["observacion"];
                                        $reportecliente = $data["reporte_cliente"];
                                        $deta = $data["accion_completado"];
                                        $nota_punto_controlador = $data["nota_punto_controlador"];
                                        $tipo = $data["tipo_seguimiento"];
                                        if (isset($data["novedad_general"])) {
                                            $new = $data["novedad_general"];
                                        } else {
                                            $new = '';
                                        }
                                        $ocurrio = $data["ocurrio"];
                                        $codigo_punto = $data["codigo_punto"];
                                        $accion_punto = $data["accion_punto"];
                                        $manifiesto = $data["manifiesto"];
                                        $estado_punto = 'CERRADO';
                                        //estado
                                        $id_ini_ruta = $data["id_ini_ruta"];
                                        $estadoq = $data["estado_siguiente"];
                                        $procesoq = $data["accion_completado"];

                                        try {
                                            $this->_db3->beginTransaction();

                                            // UPDATE último estado
                                            $sql4 = "UPDATE cmx_inici_manifiesto_estado SET ultimo_estado='0' WHERE cod_ini_ruta = :id_ini_ruta";
                                            $updatemani = $this->_db3->prepare($sql4);
                                            $updatemani->bindParam(':id_ini_ruta', $id_ini_ruta);
                                            $result = $updatemani->execute();

                                            if ($result) {
                                                // INSERT nuevo estado
                                                $sql3 = "INSERT INTO cmx_inici_manifiesto_estado 
                                                (cod_ini_ruta, estado, actual, fecha, hora, usuario, ultimo_estado, reporte_cliente)
                                                VALUES (:id_ini_ruta, :estadoq, :procesoq, :fecha, :hora, :user, '1', :reportecliente)";
                                                $crearmani = $this->_db3->prepare($sql3);
                                                $crearmani->bindParam(':id_ini_ruta', $id_ini_ruta);
                                                $crearmani->bindParam(':estadoq', $estadoq);
                                                $crearmani->bindParam(':procesoq', $procesoq);
                                                $crearmani->bindParam(':fecha', $fecha);
                                                $crearmani->bindParam(':hora', $hora);
                                                $crearmani->bindParam(':user', $user);
                                                $crearmani->bindParam(':reportecliente', $reportecliente);
                                                $result_estado = $crearmani->execute();

                                                if ($result_estado) {
                                                    // INSERT seguimiento
                                                    $sql = "INSERT INTO cmx_inicio_seguimiento 
                                                    (cod_man_estado, tipo_contacto, tipo_seguimiento, detalle_tipo, tipo_proceso, observacion, fecha, hora, usuario, reporte_cliente, cod_ini_ruta, novedad, ocurrio, codigo_punto, tiempo, estado_punto)
                                                    VALUES (:idm, :contacto, :tsegui, :tdetalle, :tproceso, :observa, :fecha, :hora, :user, :reportecliente, :id_ini_ruta, :new, :ocurrio, :codigo_punto, -59, :estado_punto)";
                                                    $crearinicio = $this->_db3->prepare($sql);
                                                    $crearinicio->bindParam(':idm', $idm);
                                                    $crearinicio->bindParam(':contacto', $contacto);
                                                    $crearinicio->bindParam(':tsegui', $tsegui);
                                                    $crearinicio->bindParam(':tdetalle', $tdetalle);
                                                    $crearinicio->bindParam(':tproceso', $tproceso);
                                                    $crearinicio->bindParam(':observa', $observa);
                                                    $crearinicio->bindParam(':fecha', $fecha);
                                                    $crearinicio->bindParam(':hora', $hora);
                                                    $crearinicio->bindParam(':user', $user);
                                                    $crearinicio->bindParam(':reportecliente', $reportecliente);
                                                    $crearinicio->bindParam(':id_ini_ruta', $id_ini_ruta);
                                                    $crearinicio->bindParam(':new', $new);
                                                    $crearinicio->bindParam(':ocurrio', $ocurrio);
                                                    $crearinicio->bindParam(':codigo_punto', $codigo_punto);
                                                    $crearinicio->bindParam(':estado_punto', $estado_punto);
                                                    $result = $crearinicio->execute();

                                                    if ($result) {
                                                        $sqlf = "SELECT MAX(id) AS ids FROM cmx_inicio_seguimiento WHERE cod_ini_ruta = :id_ini_ruta";
                                                        $consulta_solic = $this->_db3->prepare($sqlf);
                                                        $consulta_solic->bindParam(':id_ini_ruta', $id_ini_ruta);
                                                        $consulta_solic->execute();
                                                        $dato = $consulta_solic->fetch();
                                                        $id_seguimiento = $dato["ids"];


                                                        // Insertar ultimo seguimiento para la nota
                                                        $sql = $this->_db3->prepare("INSERT INTO cmx_ultimo_seguimiento (manifiesto_id, seguimiento_id, usuario, fecha, hora)
                                                                VALUES (:manifiesto_id, :seguimiento_id, :usuario, :fecha, :hora)
                                                                ON DUPLICATE KEY UPDATE
                                                                    seguimiento_id = VALUES(seguimiento_id),
                                                                    usuario = VALUES(usuario),
                                                                    fecha = VALUES(fecha),
                                                                    hora = VALUES(hora)
                                                            ");
                                                        $sql->bindParam(':manifiesto_id', $manifiesto, PDO::PARAM_INT);
                                                        $sql->bindParam(':seguimiento_id', $id_seguimiento);
                                                        $sql->bindParam(':usuario', $user);
                                                        $sql->bindParam(':fecha', $fecha);
                                                        $sql->bindParam(':hora', $hora);
                                                        $sql->execute();

                                                        // Insertar servicios
                                                        $nservicio = $data["solicitud_servicio_nuevo"];
                                                        foreach ($nservicio as $nsolicitud) {
                                                            $sqls = "INSERT INTO cmx_seguimiento_servicio (id_servicio, id_seguimiento, usuario, hora, fecha)
                                                            VALUES (:nsolicitud, :id_seguimiento, :user, :hora, :fecha)";
                                                            $crearsoli = $this->_db3->prepare($sqls);
                                                            $crearsoli->bindParam(':nsolicitud', $nsolicitud);
                                                            $crearsoli->bindParam(':id_seguimiento', $id_seguimiento);
                                                            $crearsoli->bindParam(':user', $user);
                                                            $crearsoli->bindParam(':hora', $hora);
                                                            $crearsoli->bindParam(':fecha', $fecha);
                                                            $crearsoli->execute();
                                                        }

                                                        // Cambio de estado del manifiesto
                                                        if ($accion_punto == 'Lugar Llegada') {
                                                            $estado = "LLEGADA";
                                                            $estado_punto = "GESTION";
                                                        } else {
                                                            $estado = "SEGUIMIENTO";
                                                        }

                                                        $sql_es = "UPDATE cmx_manifiesto SET estado_seguimiento = :estado WHERE id = :manifiesto";
                                                        $update_est = $this->_db3->prepare($sql_es);
                                                        $update_est->bindParam(':estado', $estado);
                                                        $update_est->bindParam(':manifiesto', $manifiesto);
                                                        $update_est->execute();

                                                        if ($accion_punto == 'Lugar Llegada') {
                                                            $sql_punto = "UPDATE cmx_inicio_seguimiento SET estado_punto = :estado_punto WHERE cod_ini_ruta = :id_ini_ruta AND codigo_punto = :codigo_punto";
                                                            $update_est = $this->_db3->prepare($sql_punto);
                                                            $update_est->bindParam(':estado_punto', $estado_punto);
                                                            $update_est->bindParam(':id_ini_ruta', $id_ini_ruta);
                                                            $update_est->bindParam(':codigo_punto', $codigo_punto);
                                                            $update_est->execute();
                                                        }

                                                        // Si es punto geográfico
                                                        if ($tipo == 'punto geografico') {
                                                            $ubilatitud = $data["latitud"];
                                                            $ubilongitud = $data["longitud"];
                                                            $edoc = empty($data["edocu"]) ? 0 : $data["edocu"];

                                                            $sql = "INSERT INTO cmx_iniruta_ubicacion 
                                                            (cod_ini_ruta, latitud, longitud, usuario, fecha, hora, lugar, id_seguimiento, existe_evidencia)
                                                            VALUES (:id_ini_ruta, :latitud, :longitud, :user, :fecha, :hora, :tdetalle, :id_seguimiento, :edoc)";
                                                            $crearubi = $this->_db3->prepare($sql);
                                                            $crearubi->bindParam(':id_ini_ruta', $id_ini_ruta);
                                                            $crearubi->bindParam(':latitud', $ubilatitud);
                                                            $crearubi->bindParam(':longitud', $ubilongitud);
                                                            $crearubi->bindParam(':user', $user);
                                                            $crearubi->bindParam(':fecha', $fecha);
                                                            $crearubi->bindParam(':hora', $hora);
                                                            $crearubi->bindParam(':tdetalle', $tdetalle);
                                                            $crearubi->bindParam(':id_seguimiento', $id_seguimiento);
                                                            $crearubi->bindParam(':edoc', $edoc);
                                                            $crearubi->execute();

                                                            // Guardar evidencia
                                                            $ruta_evidencia = "../public/files/evidencia_seguimiento/$id_ini_ruta/$id_seguimiento/";
                                                            $ruta_evidencia2 = "public/files/evidencia_seguimiento/$id_ini_ruta/$id_seguimiento/";
                                                            if (!file_exists($ruta_evidencia)) {
                                                                mkdir($ruta_evidencia, 0777, true);
                                                            }

                                                            $sqlt = "SELECT MAX(id) AS idu FROM cmx_iniruta_ubicacion WHERE id_seguimiento = :id_seguimiento";
                                                            $stmt = $this->_db3->prepare($sqlt);
                                                            $stmt->bindParam(':id_seguimiento', $id_seguimiento);
                                                            $stmt->execute();
                                                            $dato = $stmt->fetch();
                                                            $id_ubica = $dato["idu"];

                                                            $sqlub = "UPDATE cmx_iniruta_ubicacion SET evidencia = :evidencia, existe_evidencia = :edoc WHERE id = :id_ubica";
                                                            $stmt = $this->_db3->prepare($sqlub);
                                                            $stmt->bindParam(':evidencia', $ruta_evidencia2);
                                                            $stmt->bindParam(':edoc', $edoc);
                                                            $stmt->bindParam(':id_ubica', $id_ubica);
                                                            $stmt->execute();

                                                            for ($i = 0; $i < count($_FILES); $i++) {
                                                                if (isset($_FILES["udocumnento" . $i])) {
                                                                    $file = $_FILES["udocumnento" . $i];
                                                                    $nombre = $file["name"];
                                                                    $ruta_provisional = $file["tmp_name"];
                                                                    $src = $ruta_evidencia . $nombre;
                                                                    move_uploaded_file($ruta_provisional, $src);
                                                                }
                                                            }
                                                        }

                                                        $this->_db3->commit();
                                                        $response = ["success" => true, "message" => "<b>Nota:</b> Registrada exitosamente en NexosApp."];
                                                    }
                                                } else {
                                                    $response = ['success' => false, 'message' => 'Error al insertar la nota. Inténtalo de nuevo o contacta soporte.'];
                                                }
                                            }
                                        } catch (\Throwable $e) {
                                            $this->_db3->rollback();
                                            $errorMessage = "Error al insertar nota: " . $e->getMessage() . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
                                            $logFilePath = 'error_log.txt';
                                            error_log($errorMessage, 3, $logFilePath);
                                            $response = ['success' => false, 'message' => 'Error inesperado. Intenta más tarde o contacta a soporte.'];
                                        }
                                    } else {
                                        $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                                    }
                                }
                            } else {
                                //Antes
                                if ($data["novedad_general"] == "COMENTARIO" || substr($data["novedad_general"], 0, 7) == "NOVEDAD") {
                                    $codigo = $data["id_ini_ruta"];
                                    /* Consultar el tiempo del ultimo punto de este manifiesto para mantenerlo */
                                    $sql_ultimo_tiempo = $this->_db3->prepare("SELECT tiempo FROM cmx_inicio_seguimiento WHERE cod_ini_ruta=$codigo ORDER BY id DESC LIMIT 1");
                                    $sql_ultimo_tiempo->execute();
                                    $result_tiempo = $sql_ultimo_tiempo->fetch();
                                    $tiempo = $result_tiempo['tiempo'];
                                    if ($tiempo) {
                                        if ($data) {
                                            $id_ini_ruta = $data["id_ini_ruta"];
                                            $idm = $data["idmanifiesto"];
                                            $contacto = $data["contacto"];
                                            $tsegui = $data["tipo_seguimiento"];
                                            $tdetalle = empty($data["tipo_detalle"]) ? 0 : $data["tipo_detalle"];
                                            $tproceso = $data["tipo_proceso"];
                                            $observa = $data["observacion"];
                                            $reportecliente = $data["reporte_cliente"];
                                            $deta = $data["accion_completado"];
                                            $nota_punto_controlador = $data["nota_punto_controlador"];
                                            $tipo = $data["tipo_seguimiento"];
                                            if (isset($data["novedad_general"])) {
                                                $new = $data["novedad_general"];
                                            } else {
                                                $new = '';
                                            }
                                            $ocurrio = $data["ocurrio"];
                                            $codigo_punto = empty($data["codigo_punto"]) ? 0 : $data["codigo_punto"];
                                            $accion_punto = $data["accion_punto"];
                                            $manifiesto = $data["manifiesto"];
                                            $estado_punto = 'CERRADO';
                                            //estado
                                            $id_ini_ruta = $data["id_ini_ruta"];
                                            $estadoq = $data["estado_siguiente"];
                                            $procesoq = $data["accion_completado"];
                                            /* Para registrar los puntos que no estan creados en el sistema */
                                            if ($nota_punto_controlador) {
                                                try {
                                                    // Iniciar transacción
                                                    $this->_db3->beginTransaction();

                                                    // Paso 1: Desactivar último estado anterior
                                                    $sql4 = "UPDATE cmx_inici_manifiesto_estado SET ultimo_estado='0' WHERE cod_ini_ruta = :id_ini_ruta";
                                                    $updatemani = $this->_db3->prepare($sql4);
                                                    $updatemani->bindParam(':id_ini_ruta', $id_ini_ruta);
                                                    $result = $updatemani->execute();

                                                    if ($result) {
                                                        // Paso 2: Insertar nuevo estado
                                                        $sql3 = "INSERT INTO cmx_inici_manifiesto_estado (id, cod_ini_ruta, estado, actual, fecha, hora, usuario, ultimo_estado, reporte_cliente)
                                                        VALUES (NULL, :id_ini_ruta, :estadoq, :procesoq, :fecha, :hora, :user, '1', :reportecliente)";
                                                        $crearmani = $this->_db3->prepare($sql3);
                                                        $crearmani->bindParam(':id_ini_ruta', $id_ini_ruta);
                                                        $crearmani->bindParam(':estadoq', $estadoq);
                                                        $crearmani->bindParam(':procesoq', $procesoq);
                                                        $crearmani->bindParam(':fecha', $fecha);
                                                        $crearmani->bindParam(':hora', $hora);
                                                        $crearmani->bindParam(':user', $user);
                                                        $crearmani->bindParam(':reportecliente', $reportecliente);
                                                        $result_estado = $crearmani->execute();

                                                        if ($result_estado) {
                                                            // Paso 3: Insertar seguimiento
                                                            $sql = "INSERT INTO cmx_inicio_seguimiento (id, cod_man_estado, tipo_contacto, tipo_seguimiento, detalle_tipo, tipo_proceso, observacion, fecha, hora, usuario, reporte_cliente, cod_ini_ruta, novedad, ocurrio, codigo_punto, tiempo, estado_punto)
                                                            VALUES (NULL, :idm, :contacto, :tsegui, :tdetalle, :tproceso, :observa, :fecha, :hora, :user, :reportecliente, :id_ini_ruta, :new, :ocurrio, :codigo_punto, :tiempo, :estado_punto)";
                                                            $crearinicio = $this->_db3->prepare($sql);
                                                            $crearinicio->bindParam(':idm', $idm);
                                                            $crearinicio->bindParam(':contacto', $contacto);
                                                            $crearinicio->bindParam(':tsegui', $tsegui);
                                                            $crearinicio->bindParam(':tdetalle', $tdetalle);
                                                            $crearinicio->bindParam(':tproceso', $tproceso);
                                                            $crearinicio->bindParam(':observa', $observa);
                                                            $crearinicio->bindParam(':fecha', $fecha);
                                                            $crearinicio->bindParam(':hora', $hora);
                                                            $crearinicio->bindParam(':user', $user);
                                                            $crearinicio->bindParam(':reportecliente', $reportecliente);
                                                            $crearinicio->bindParam(':id_ini_ruta', $id_ini_ruta);
                                                            $crearinicio->bindParam(':new', $new);
                                                            $crearinicio->bindParam(':ocurrio', $ocurrio);
                                                            $crearinicio->bindParam(':codigo_punto', $codigo_punto);
                                                            $crearinicio->bindParam(':tiempo', $tiempo);
                                                            $crearinicio->bindParam(':estado_punto', $estado_punto);
                                                            $result = $crearinicio->execute();

                                                            if ($result) {
                                                                // Paso 4: Obtener ID de seguimiento
                                                                $sqlf = "SELECT MAX(id) as ids FROM cmx_inicio_seguimiento WHERE cod_ini_ruta = :id_ini_ruta";
                                                                $consulta_solic = $this->_db3->prepare($sqlf);
                                                                $consulta_solic->bindParam(':id_ini_ruta', $id_ini_ruta);
                                                                $consulta_solic->execute();
                                                                $dato = $consulta_solic->fetch();
                                                                $id_seguimiento = $dato["ids"];


                                                                // Insertar ultimo seguimiento para la nota
                                                                $sql = $this->_db3->prepare("INSERT INTO cmx_ultimo_seguimiento (manifiesto_id, seguimiento_id, usuario, fecha, hora)
                                                                    VALUES (:manifiesto_id, :seguimiento_id, :usuario, :fecha, :hora)
                                                                    ON DUPLICATE KEY UPDATE
                                                                        seguimiento_id = VALUES(seguimiento_id),
                                                                        usuario = VALUES(usuario),
                                                                        fecha = VALUES(fecha),
                                                                        hora = VALUES(hora)
                                                                ");
                                                                $sql->bindParam(':manifiesto_id', $manifiesto, PDO::PARAM_INT);
                                                                $sql->bindParam(':seguimiento_id', $id_seguimiento);
                                                                $sql->bindParam(':usuario', $user);
                                                                $sql->bindParam(':fecha', $fecha);
                                                                $sql->bindParam(':hora', $hora);
                                                                $sql->execute();

                                                                // Paso 5: Insertar servicios asociados
                                                                $nservicio = $data["solicitud_servicio_nuevo"];
                                                                foreach ($nservicio as $nsolicitud) {
                                                                    $sqls = "INSERT INTO cmx_seguimiento_servicio (id, id_servicio, id_seguimiento, usuario, hora, fecha)
                                                                    VALUES (NULL, :nsolicitud, :id_seguimiento, :user, :hora, :fecha)";
                                                                    $crearsoli = $this->_db3->prepare($sqls);
                                                                    $crearsoli->bindParam(':nsolicitud', $nsolicitud);
                                                                    $crearsoli->bindParam(':id_seguimiento', $id_seguimiento);
                                                                    $crearsoli->bindParam(':user', $user);
                                                                    $crearsoli->bindParam(':hora', $hora);
                                                                    $crearsoli->bindParam(':fecha', $fecha);
                                                                    $crearsoli->execute();
                                                                }

                                                                // Paso 6: Insertar punto de control personalizado
                                                                $sqlpuntocontrol = "INSERT INTO cmx_puntos_controlador (seguimiento_id, punto_controlador, usuario, fecha_at)
                                                                VALUES (:id_seguimiento, :nota_punto_controlador, :user, :fecha_hora)";
                                                                $crearPuntoControl = $this->_db3->prepare($sqlpuntocontrol);
                                                                $fecha_hora = $fecha . ' ' . $hora;
                                                                $crearPuntoControl->bindParam(':id_seguimiento', $id_seguimiento);
                                                                $crearPuntoControl->bindParam(':nota_punto_controlador', $nota_punto_controlador);
                                                                $crearPuntoControl->bindParam(':user', $user);
                                                                $crearPuntoControl->bindParam(':fecha_hora', $fecha_hora);
                                                                $crearPuntoControl->execute();

                                                                // Paso 7: Cambiar estado del manifiesto
                                                                if ($accion_punto == 'Lugar Llegada') {
                                                                    $estado = "LLEGADA";
                                                                    $estado_punto = "GESTION";
                                                                } else {
                                                                    $estado = "SEGUIMIENTO";
                                                                }
                                                                $sql_estado = "UPDATE cmx_manifiesto SET estado_seguimiento = :estado WHERE id = :manifiesto";
                                                                $update_est = $this->_db3->prepare($sql_estado);
                                                                $update_est->bindParam(':estado', $estado);
                                                                $update_est->bindParam(':manifiesto', $manifiesto);
                                                                $update_est->execute();

                                                                if ($accion_punto == 'Lugar Llegada') {
                                                                    $sql_gestion = "UPDATE cmx_inicio_seguimiento SET estado_punto = :estado_punto WHERE cod_ini_ruta = :id_ini_ruta AND codigo_punto = :codigo_punto";
                                                                    $update_gestion = $this->_db3->prepare($sql_gestion);
                                                                    $update_gestion->bindParam(':estado_punto', $estado_punto);
                                                                    $update_gestion->bindParam(':id_ini_ruta', $id_ini_ruta);
                                                                    $update_gestion->bindParam(':codigo_punto', $codigo_punto);
                                                                    $update_gestion->execute();
                                                                }
                                                            }
                                                        } else {
                                                            $response = ['success' => false, 'message' => 'Error al insertar la nota. Intente más tarde o contacte al equipo de desarrollo.'];
                                                        }
                                                    }

                                                    // Confirmar transacción
                                                    $this->_db3->commit();
                                                    $response = ['success' => true, 'message' => '<b>Nota:</b> Registrada exitosamente en NexosApp.'];
                                                } catch (\Throwable $e) {
                                                    $this->_db3->rollback();
                                                    $errorMessage = "Error en la transacción al insertar nota: " . $e->getMessage() . " - " . date("Y-m-d H:i:s") . " - Usuario: " . $user . "\n";
                                                    $logFilePath = 'error_log.txt';
                                                    error_log($errorMessage, 3, $logFilePath);
                                                    $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Inténtelo más tarde o contacte al equipo de desarrollo.'];
                                                }
                                            } else {

                                                try {
                                                    $this->_db3->beginTransaction();

                                                    // UPDATE: Desactivar el último estado anterior
                                                    $sql4 = "UPDATE cmx_inici_manifiesto_estado SET ultimo_estado = '0' WHERE cod_ini_ruta = :id_ini_ruta";
                                                    $stmt = $this->_db3->prepare($sql4);
                                                    $stmt->bindParam(':id_ini_ruta', $id_ini_ruta);
                                                    $stmt->execute();

                                                    // INSERT: Nuevo estado del manifiesto
                                                    $sql3 = "INSERT INTO cmx_inici_manifiesto_estado 
                                                    (cod_ini_ruta, estado, actual, fecha, hora, usuario, ultimo_estado, reporte_cliente)
                                                    VALUES (:id_ini_ruta, :estadoq, :procesoq, :fecha, :hora, :user, '1', :reportecliente)";
                                                    $stmt = $this->_db3->prepare($sql3);
                                                    $stmt->bindParam(':id_ini_ruta', $id_ini_ruta);
                                                    $stmt->bindParam(':estadoq', $estadoq);
                                                    $stmt->bindParam(':procesoq', $procesoq);
                                                    $stmt->bindParam(':fecha', $fecha);
                                                    $stmt->bindParam(':hora', $hora);
                                                    $stmt->bindParam(':user', $user);
                                                    $stmt->bindParam(':reportecliente', $reportecliente);
                                                    $stmt->execute();

                                                    // INSERT: Seguimiento
                                                    $sql = "INSERT INTO cmx_inicio_seguimiento 
                                                    (cod_man_estado, tipo_contacto, tipo_seguimiento, detalle_tipo, tipo_proceso, observacion, fecha, hora, usuario, reporte_cliente, cod_ini_ruta, novedad, ocurrio, codigo_punto, tiempo, estado_punto)
                                                    VALUES (:idm, :contacto, :tsegui, :tdetalle, :tproceso, :observa, :fecha, :hora, :user, :reportecliente, :id_ini_ruta, :new, :ocurrio, :codigo_punto, :tiempo, :estado_punto)";
                                                    $stmt = $this->_db3->prepare($sql);
                                                    $stmt->bindParam(':idm', $idm);
                                                    $stmt->bindParam(':contacto', $contacto);
                                                    $stmt->bindParam(':tsegui', $tsegui);
                                                    $stmt->bindParam(':tdetalle', $tdetalle);
                                                    $stmt->bindParam(':tproceso', $tproceso);
                                                    $stmt->bindParam(':observa', $observa);
                                                    $stmt->bindParam(':fecha', $fecha);
                                                    $stmt->bindParam(':hora', $hora);
                                                    $stmt->bindParam(':user', $user);
                                                    $stmt->bindParam(':reportecliente', $reportecliente);
                                                    $stmt->bindParam(':id_ini_ruta', $id_ini_ruta);
                                                    $stmt->bindParam(':new', $new);
                                                    $stmt->bindParam(':ocurrio', $ocurrio);
                                                    $stmt->bindParam(':codigo_punto', $codigo_punto);
                                                    $stmt->bindParam(':tiempo', $tiempo);
                                                    $stmt->bindParam(':estado_punto', $estado_punto);
                                                    $stmt->execute();

                                                    // ID seguimiento generado
                                                    $sqlf = "SELECT MAX(id) AS ids FROM cmx_inicio_seguimiento WHERE cod_ini_ruta = :id_ini_ruta";
                                                    $stmt = $this->_db3->prepare($sqlf);
                                                    $stmt->bindParam(':id_ini_ruta', $id_ini_ruta);
                                                    $stmt->execute();
                                                    $id_seguimiento = $stmt->fetch()["ids"];




                                                    // Insertar ultimo seguimiento para la nota
                                                    $sql = $this->_db3->prepare("INSERT INTO cmx_ultimo_seguimiento (manifiesto_id, seguimiento_id, usuario, fecha, hora)
                                                        VALUES (:manifiesto_id, :seguimiento_id, :usuario, :fecha, :hora)
                                                        ON DUPLICATE KEY UPDATE
                                                            seguimiento_id = VALUES(seguimiento_id),
                                                            usuario = VALUES(usuario),
                                                            fecha = VALUES(fecha),
                                                            hora = VALUES(hora)
                                                    ");

                                                    $sql->bindParam(':manifiesto_id', $manifiesto, PDO::PARAM_INT);
                                                    $sql->bindParam(':seguimiento_id', $id_seguimiento);
                                                    $sql->bindParam(':usuario', $user);
                                                    $sql->bindParam(':fecha', $fecha);
                                                    $sql->bindParam(':hora', $hora);
                                                    $sql->execute();


                                                    // INSERT: Servicios relacionados
                                                    foreach ($data["solicitud_servicio_nuevo"] as $nsolicitud) {
                                                        $sql = "INSERT INTO cmx_seguimiento_servicio (id_servicio, id_seguimiento, usuario, hora, fecha)
                                                        VALUES (:id_servicio, :id_seguimiento, :usuario, :hora, :fecha)";
                                                        $stmt = $this->_db3->prepare($sql);
                                                        $stmt->bindParam(':id_servicio', $nsolicitud);
                                                        $stmt->bindParam(':id_seguimiento', $id_seguimiento);
                                                        $stmt->bindParam(':usuario', $user);
                                                        $stmt->bindParam(':hora', $hora);
                                                        $stmt->bindParam(':fecha', $fecha);
                                                        $stmt->execute();
                                                    }

                                                    // INSERT: Punto de control si aplica
                                                    if (!empty($nota_punto_controlador)) {
                                                        $sql = "INSERT INTO cmx_puntos_controlador(seguimiento_id, punto_controlador, usuario, fecha_at)
                                                        VALUES (:id_seguimiento, :nota_punto_controlador, :usuario, :fecha_at)";
                                                        $stmt = $this->_db3->prepare($sql);
                                                        $fecha_at = "$fecha.$hora";
                                                        $stmt->bindParam(':id_seguimiento', $id_seguimiento);
                                                        $stmt->bindParam(':nota_punto_controlador', $nota_punto_controlador);
                                                        $stmt->bindParam(':usuario', $user);
                                                        $stmt->bindParam(':fecha_at', $fecha_at);
                                                        $stmt->execute();
                                                    }

                                                    // Actualizar estado del manifiesto
                                                    $estadoNuevo = ($accion_punto === 'Lugar Llegada') ? 'LLEGADA' : 'SEGUIMIENTO';
                                                    $sql = "UPDATE cmx_manifiesto SET estado_seguimiento = :estado WHERE id = :manifiesto";
                                                    $stmt = $this->_db3->prepare($sql);
                                                    $stmt->bindParam(':estado', $estadoNuevo);
                                                    $stmt->bindParam(':manifiesto', $manifiesto);
                                                    $stmt->execute();

                                                    if ($accion_punto === 'Lugar Llegada') {
                                                        $estado_punto = "GESTION";
                                                        $sql = "UPDATE cmx_inicio_seguimiento SET estado_punto = :estado_punto WHERE cod_ini_ruta = :id_ini_ruta AND codigo_punto = :codigo_punto";
                                                        $stmt = $this->_db3->prepare($sql);
                                                        $stmt->bindParam(':estado_punto', $estado_punto);
                                                        $stmt->bindParam(':id_ini_ruta', $id_ini_ruta);
                                                        $stmt->bindParam(':codigo_punto', $codigo_punto);
                                                        $stmt->execute();
                                                    }

                                                    // Si es punto geográfico: Insertar ubicación
                                                    if ($tipo === 'punto geografico') {
                                                        $ubilatitud = $data["latitud"];
                                                        $ubilongitud = $data["longitud"];
                                                        $edoc = !empty($data["edocu"]) ? $data["edocu"] : 0;

                                                        $sql = "INSERT INTO cmx_iniruta_ubicacion (cod_ini_ruta, latitud, longitud, usuario, fecha, hora, lugar, id_seguimiento, existe_evidencia)
                                                        VALUES (:id_ini_ruta, :latitud, :longitud, :usuario, :fecha, :hora, :lugar, :id_seguimiento, :existe_evidencia)";
                                                        $stmt = $this->_db3->prepare($sql);
                                                        $stmt->bindParam(':id_ini_ruta', $id_ini_ruta);
                                                        $stmt->bindParam(':latitud', $ubilatitud);
                                                        $stmt->bindParam(':longitud', $ubilongitud);
                                                        $stmt->bindParam(':usuario', $user);
                                                        $stmt->bindParam(':fecha', $fecha);
                                                        $stmt->bindParam(':hora', $hora);
                                                        $stmt->bindParam(':lugar', $tdetalle);
                                                        $stmt->bindParam(':id_seguimiento', $id_seguimiento);
                                                        $stmt->bindParam(':existe_evidencia', $edoc);
                                                        $stmt->execute();

                                                        // Manejo de evidencia
                                                        $ruta_evidencia = "../public/files/evidencia_seguimiento/$id_ini_ruta/$id_seguimiento/";
                                                        $ruta_evidencia2 = "public/files/evidencia_seguimiento/$id_ini_ruta/$id_seguimiento/";
                                                        if (!file_exists($ruta_evidencia)) {
                                                            mkdir($ruta_evidencia, 0777, true);
                                                        }

                                                        $sql = "SELECT MAX(id) AS idu FROM cmx_iniruta_ubicacion WHERE id_seguimiento = :id_seguimiento";
                                                        $stmt = $this->_db3->prepare($sql);
                                                        $stmt->bindParam(':id_seguimiento', $id_seguimiento);
                                                        $stmt->execute();
                                                        $id_ubica = $stmt->fetch()["idu"];

                                                        $sql = "UPDATE cmx_iniruta_ubicacion SET evidencia = :ruta, existe_evidencia = :existe WHERE id = :id_ubica";
                                                        $stmt = $this->_db3->prepare($sql);
                                                        $stmt->bindParam(':ruta', $ruta_evidencia2);
                                                        $stmt->bindParam(':existe', $edoc);
                                                        $stmt->bindParam(':id_ubica', $id_ubica);
                                                        $stmt->execute();

                                                        for ($i = 0; $i < count($_FILES); $i++) {
                                                            if (isset($_FILES["udocumnento" . $i])) {
                                                                $file = $_FILES["udocumnento" . $i];
                                                                $nombre = $file["name"];
                                                                $ruta_provisional = $file["tmp_name"];
                                                                $src = $ruta_evidencia . $nombre;
                                                                move_uploaded_file($ruta_provisional, $src);
                                                            }
                                                        }
                                                    }

                                                    // Confirmar transacción
                                                    $this->_db3->commit();
                                                    $response = ['success' => true, 'message' => '<b>Nota:</b> Registrada exitosamente en NexosApp.'];
                                                } catch (\Throwable $e) {
                                                    $this->_db3->rollback();
                                                    $errorMessage = "Error en la transacción: " . $e->getMessage() . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
                                                    error_log($errorMessage, 3, 'error_log.txt');
                                                    $response = ['success' => false, 'message' => 'Ha ocurrido un error. Por favor, intente más tarde o contacte a soporte.'];
                                                }
                                            }
                                        } else {
                                            // echo "No se recibieron datos válidos.";
                                            $mensajeError = "Error No se recibieron datos válidos El dia " . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
                                            error_log($mensajeError . "\n", 3, "error_log.txt");
                                            $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                                            throw new Exception("Error al guardar los datos");
                                        }
                                    } else {
                                        // echo "No se recibio el tiempo de la nota.";
                                        $mensajeError = "Error No se recibio el tiempo de la nota. El dia " . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
                                        error_log($mensajeError . "\n", 3, "error_log.txt");
                                        $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                                        throw new Exception("Error al guardar Tiempos");
                                    }
                                } else {
                                    if ($data) {
                                        $id_ini_ruta = $data["id_ini_ruta"];
                                        $idm = $data["idmanifiesto"];
                                        $contacto = $data["contacto"];
                                        $tsegui = $data["tipo_seguimiento"];
                                        $tdetalle = empty($data["tipo_detalle"]) ? 0 : $data["tipo_detalle"];
                                        $tproceso = $data["tipo_proceso"];
                                        $observa = $data["observacion"];
                                        $reportecliente = $data["reporte_cliente"];
                                        $deta = $data["accion_completado"];
                                        $nota_punto_controlador = $data["nota_punto_controlador"];
                                        $tipo = $data["tipo_seguimiento"];
                                        if (isset($data["novedad_general"])) {
                                            $new = $data["novedad_general"];
                                        } else {
                                            $new = '';
                                        }
                                        $ocurrio = $data["ocurrio"];
                                        $codigo_punto = empty($data["codigo_punto"]) ? 0 : $data["codigo_punto"];
                                        $accion_punto = $data["accion_punto"];
                                        $manifiesto = $data["manifiesto"];
                                        //estado
                                        $id_ini_ruta = $data["id_ini_ruta"];
                                        $estadoq = $data["estado_siguiente"];
                                        $procesoq = $data["accion_completado"];
                                        $estado_punto = 'GESTION';

                                        /* Validar si el punto del controlador esta en el sistema */
                                        if ($nota_punto_controlador) {

                                            try {
                                                $this->_db3->beginTransaction();

                                                // 1. Actualizar el último estado
                                                $sql4 = "UPDATE cmx_inici_manifiesto_estado SET ultimo_estado='0' WHERE cod_ini_ruta = :id_ini_ruta";
                                                $updatemani = $this->_db3->prepare($sql4);
                                                $updatemani->bindParam(':id_ini_ruta', $id_ini_ruta, PDO::PARAM_INT);
                                                $updatemani->execute();

                                                // 2. Insertar nuevo estado de manifiesto
                                                $sql3 = "INSERT INTO cmx_inici_manifiesto_estado (cod_ini_ruta, estado, actual, fecha, hora, usuario, ultimo_estado, reporte_cliente)
                                                VALUES (:id_ini_ruta, :estadoq, :procesoq, :fecha, :hora, :user, 1, :reportecliente)";
                                                $crearmani = $this->_db3->prepare($sql3);
                                                $crearmani->bindParam(':id_ini_ruta', $id_ini_ruta);
                                                $crearmani->bindParam(':estadoq', $estadoq);
                                                $crearmani->bindParam(':procesoq', $procesoq);
                                                $crearmani->bindParam(':fecha', $fecha);
                                                $crearmani->bindParam(':hora', $hora);
                                                $crearmani->bindParam(':user', $user);
                                                $crearmani->bindParam(':reportecliente', $reportecliente);
                                                $crearmani->execute();

                                                // 3. Insertar seguimiento
                                                $sql = "INSERT INTO cmx_inicio_seguimiento (
                                                    cod_man_estado, tipo_contacto, tipo_seguimiento, detalle_tipo,
                                                    tipo_proceso, observacion, fecha, hora, usuario,
                                                    reporte_cliente, cod_ini_ruta, novedad, ocurrio,
                                                    codigo_punto, tiempo, estado_punto
                                                ) VALUES (
                                                    :idm, :contacto, :tsegui, :tdetalle,
                                                    :tproceso, :observa, :fecha, :hora, :user,
                                                    :reportecliente, :id_ini_ruta, :new, :ocurrio,
                                                    :codigo_punto, -59, :estado_punto
                                                )";
                                                $crearinicio = $this->_db3->prepare($sql);
                                                $crearinicio->bindParam(':idm', $idm);
                                                $crearinicio->bindParam(':contacto', $contacto);
                                                $crearinicio->bindParam(':tsegui', $tsegui);
                                                $crearinicio->bindParam(':tdetalle', $tdetalle);
                                                $crearinicio->bindParam(':tproceso', $tproceso);
                                                $crearinicio->bindParam(':observa', $observa);
                                                $crearinicio->bindParam(':fecha', $fecha);
                                                $crearinicio->bindParam(':hora', $hora);
                                                $crearinicio->bindParam(':user', $user);
                                                $crearinicio->bindParam(':reportecliente', $reportecliente);
                                                $crearinicio->bindParam(':id_ini_ruta', $id_ini_ruta);
                                                $crearinicio->bindParam(':new', $new);
                                                $crearinicio->bindParam(':ocurrio', $ocurrio);
                                                $crearinicio->bindParam(':codigo_punto', $codigo_punto);
                                                $crearinicio->bindParam(':estado_punto', $estado_punto);
                                                $crearinicio->execute();

                                                // Obtener ID de seguimiento
                                                $sqlf = "SELECT MAX(id) AS ids FROM cmx_inicio_seguimiento WHERE cod_ini_ruta = :id_ini_ruta";
                                                $consulta_solic = $this->_db3->prepare($sqlf);
                                                $consulta_solic->bindParam(':id_ini_ruta', $id_ini_ruta, PDO::PARAM_INT);
                                                $consulta_solic->execute();
                                                $dato = $consulta_solic->fetch();
                                                $id_seguimiento = $dato["ids"];

                                                // Insertar ultimo seguimiento para la nota
                                                $sql = $this->_db3->prepare("INSERT INTO cmx_ultimo_seguimiento (manifiesto_id, seguimiento_id, usuario, fecha, hora)
                                                    VALUES (:manifiesto_id, :seguimiento_id, :usuario, :fecha, :hora)
                                                    ON DUPLICATE KEY UPDATE
                                                        seguimiento_id = VALUES(seguimiento_id),
                                                        usuario = VALUES(usuario),
                                                        fecha = VALUES(fecha),
                                                        hora = VALUES(hora)
                                                ");
                                                $sql->bindParam(':manifiesto_id', $manifiesto, PDO::PARAM_INT);
                                                $sql->bindParam(':seguimiento_id', $id_seguimiento);
                                                $sql->bindParam(':usuario', $user);
                                                $sql->bindParam(':fecha', $fecha);
                                                $sql->bindParam(':hora', $hora);
                                                $sql->execute();

                                                // 4. Insertar solicitudes de servicio
                                                foreach ($data["solicitud_servicio_nuevo"] as $nsolicitud) {
                                                    $sqls = "INSERT INTO cmx_seguimiento_servicio (id_servicio, id_seguimiento, usuario, hora, fecha)
                                                    VALUES (:nsolicitud, :id_seguimiento, :user, :hora, :fecha)";
                                                    $crearsoli = $this->_db3->prepare($sqls);
                                                    $crearsoli->bindParam(':nsolicitud', $nsolicitud);
                                                    $crearsoli->bindParam(':id_seguimiento', $id_seguimiento);
                                                    $crearsoli->bindParam(':user', $user);
                                                    $crearsoli->bindParam(':hora', $hora);
                                                    $crearsoli->bindParam(':fecha', $fecha);
                                                    $crearsoli->execute();
                                                }

                                                // 5. Insertar punto de control si aplica
                                                $sqlpuntocontrol = "INSERT INTO cmx_puntos_controlador (seguimiento_id, punto_controlador, usuario, fecha_at)
                                                VALUES (:id_seguimiento, :nota_punto_controlador, :user, :fecha_hora)";
                                                $crearPuntocontrol = $this->_db3->prepare($sqlpuntocontrol);
                                                $fecha_hora = $fecha . '.' . $hora;
                                                $crearPuntocontrol->bindParam(':id_seguimiento', $id_seguimiento);
                                                $crearPuntocontrol->bindParam(':nota_punto_controlador', $nota_punto_controlador);
                                                $crearPuntocontrol->bindParam(':user', $user);
                                                $crearPuntocontrol->bindParam(':fecha_hora', $fecha_hora);
                                                $crearPuntocontrol->execute();

                                                // 6. Cambiar estado de manifiesto
                                                $nuevo_estado = ($accion_punto == 'Lugar Llegada') ? "LLEGADA" : "SEGUIMIENTO";
                                                $sql_es = "UPDATE cmx_manifiesto SET estado_seguimiento = :nuevo_estado WHERE id = :manifiesto";
                                                $update_est = $this->_db3->prepare($sql_es);
                                                $update_est->bindParam(':nuevo_estado', $nuevo_estado);
                                                $update_est->bindParam(':manifiesto', $manifiesto, PDO::PARAM_INT);
                                                $update_est->execute();

                                                // Finalizar transacción
                                                $this->_db3->commit();
                                                $response = ["success" => true, "message" => "<b>Nota:</b> Registrada exitosamente en NexosApp."];
                                            } catch (\Throwable $e) {
                                                $this->_db3->rollback();
                                                $errorMessage = "Error en la transacción al insertar nota controlador: " . $e->getMessage() . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
                                                error_log($errorMessage, 3, 'error_log.txt');
                                                $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                                            }
                                        } else {
                                            try {
                                                $this->_db3->beginTransaction();

                                                // Paso 1: Actualizar último estado
                                                $sql4 = "UPDATE cmx_inici_manifiesto_estado SET ultimo_estado='0' WHERE cod_ini_ruta = :id_ini_ruta";
                                                $updatemani = $this->_db3->prepare($sql4);
                                                $updatemani->bindParam(':id_ini_ruta', $id_ini_ruta);
                                                $updatemani->execute();

                                                // Paso 2: Insertar nuevo estado
                                                $sql3 = "INSERT INTO cmx_inici_manifiesto_estado 
                                                (cod_ini_ruta, estado, actual, fecha, hora, usuario, ultimo_estado, reporte_cliente) 
                                                VALUES (:id_ini_ruta, :estadoq, :procesoq, :fecha, :hora, :user, 1, :reportecliente)";
                                                $crearmani = $this->_db3->prepare($sql3);
                                                $crearmani->bindParam(':id_ini_ruta', $id_ini_ruta);
                                                $crearmani->bindParam(':estadoq', $estadoq);
                                                $crearmani->bindParam(':procesoq', $procesoq);
                                                $crearmani->bindParam(':fecha', $fecha);
                                                $crearmani->bindParam(':hora', $hora);
                                                $crearmani->bindParam(':user', $user);
                                                $crearmani->bindParam(':reportecliente', $reportecliente);
                                                $crearmani->execute();

                                                // Paso 3: Insertar seguimiento
                                                $sql = "INSERT INTO cmx_inicio_seguimiento 
                                                (cod_man_estado, tipo_contacto, tipo_seguimiento, detalle_tipo, tipo_proceso, observacion, fecha, hora, usuario, reporte_cliente, cod_ini_ruta, novedad, ocurrio, codigo_punto, tiempo, estado_punto)
                                                VALUES (:idm, :contacto, :tsegui, :tdetalle, :tproceso, :observa, :fecha, :hora, :user, :reportecliente, :id_ini_ruta, :novedad, :ocurrio, :codigo_punto, -59, :estado_punto)";
                                                $crearinicio = $this->_db3->prepare($sql);
                                                $crearinicio->bindParam(':idm', $idm);
                                                $crearinicio->bindParam(':contacto', $contacto);
                                                $crearinicio->bindParam(':tsegui', $tsegui);
                                                $crearinicio->bindParam(':tdetalle', $tdetalle);
                                                $crearinicio->bindParam(':tproceso', $tproceso);
                                                $crearinicio->bindParam(':observa', $observa);
                                                $crearinicio->bindParam(':fecha', $fecha);
                                                $crearinicio->bindParam(':hora', $hora);
                                                $crearinicio->bindParam(':user', $user);
                                                $crearinicio->bindParam(':reportecliente', $reportecliente);
                                                $crearinicio->bindParam(':id_ini_ruta', $id_ini_ruta);
                                                $crearinicio->bindParam(':novedad', $new);
                                                $crearinicio->bindParam(':ocurrio', $ocurrio);
                                                $crearinicio->bindParam(':codigo_punto', $codigo_punto);
                                                $crearinicio->bindParam(':estado_punto', $estado_punto);
                                                $crearinicio->execute();

                                                // Obtener ID de seguimiento
                                                $sqlf = "SELECT MAX(id) as ids FROM cmx_inicio_seguimiento WHERE cod_ini_ruta = :id_ini_ruta";
                                                $consulta_solic = $this->_db3->prepare($sqlf);
                                                $consulta_solic->bindParam(':id_ini_ruta', $id_ini_ruta);
                                                $consulta_solic->execute();
                                                $dato = $consulta_solic->fetch();
                                                $id_seguimiento = $dato["ids"];



                                                // Insertar ultimo seguimiento para la nota
                                                $sql = $this->_db3->prepare("INSERT INTO cmx_ultimo_seguimiento (manifiesto_id, seguimiento_id, usuario, fecha, hora)
                                                    VALUES (:manifiesto_id, :seguimiento_id, :usuario, :fecha, :hora)
                                                    ON DUPLICATE KEY UPDATE
                                                        seguimiento_id = VALUES(seguimiento_id),
                                                        usuario = VALUES(usuario),
                                                        fecha = VALUES(fecha),
                                                        hora = VALUES(hora)
                                                ");
                                                $sql->bindParam(':manifiesto_id', $manifiesto, PDO::PARAM_INT);
                                                $sql->bindParam(':seguimiento_id', $id_seguimiento);
                                                $sql->bindParam(':usuario', $user);
                                                $sql->bindParam(':fecha', $fecha);
                                                $sql->bindParam(':hora', $hora);
                                                $sql->execute();

                                                // Paso 4: Insertar solicitudes de servicio
                                                foreach ($data["solicitud_servicio_nuevo"] as $nsolicitud) {
                                                    $sqls = "INSERT INTO cmx_seguimiento_servicio (id_servicio, id_seguimiento, usuario, hora, fecha)
                                                    VALUES (:nsolicitud, :id_seguimiento, :user, :hora, :fecha)";
                                                    $crearsoli = $this->_db3->prepare($sqls);
                                                    $crearsoli->bindParam(':nsolicitud', $nsolicitud);
                                                    $crearsoli->bindParam(':id_seguimiento', $id_seguimiento);
                                                    $crearsoli->bindParam(':user', $user);
                                                    $crearsoli->bindParam(':hora', $hora);
                                                    $crearsoli->bindParam(':fecha', $fecha);
                                                    $crearsoli->execute();
                                                }

                                                // Paso 5: Insertar en punto controlador
                                                $sqlpuntocontrol = "INSERT INTO cmx_puntos_controlador(seguimiento_id, punto_controlador, usuario, fecha_at)
                                                VALUES (:id_seguimiento, :nota_punto_controlador, :user, :fecha_hora)";
                                                $crearPuntoControl = $this->_db3->prepare($sqlpuntocontrol);
                                                $fecha_hora = $fecha . ' ' . $hora;
                                                $crearPuntoControl->bindParam(':id_seguimiento', $id_seguimiento);
                                                $crearPuntoControl->bindParam(':nota_punto_controlador', $nota_punto_controlador);
                                                $crearPuntoControl->bindParam(':user', $user);
                                                $crearPuntoControl->bindParam(':fecha_hora', $fecha_hora);
                                                $crearPuntoControl->execute();

                                                // Paso 6: Estado manifiesto
                                                if ($accion_punto == 'Lugar Llegada') {
                                                    $estado = "LLEGADA";
                                                    $estado_punto = "GESTION";
                                                } else {
                                                    $estado = "SEGUIMIENTO";
                                                }

                                                $sql_es = "UPDATE cmx_manifiesto SET estado_seguimiento = :estado WHERE id = :manifiesto";
                                                $update_est = $this->_db3->prepare($sql_es);
                                                $update_est->bindParam(':estado', $estado);
                                                $update_est->bindParam(':manifiesto', $manifiesto);
                                                $update_est->execute();

                                                // Paso 7: Insertar ubicación si aplica
                                                if ($tipo == 'punto geografico') {
                                                    $ubilatitud = $data["latitud"];
                                                    $ubilongitud = $data["longitud"];
                                                    $edoc = $data["edocu"];

                                                    $sql = "INSERT INTO cmx_iniruta_ubicacion (cod_ini_ruta, latitud, longitud, usuario, fecha, hora, lugar, id_seguimiento, existe_evidencia)
                                                    VALUES (:id_ini_ruta, :latitud, :longitud, :user, :fecha, :hora, :lugar, :id_seguimiento, :existe_evidencia)";
                                                    $crearubi = $this->_db3->prepare($sql);
                                                    $crearubi->bindParam(':id_ini_ruta', $id_ini_ruta);
                                                    $crearubi->bindParam(':latitud', $ubilatitud);
                                                    $crearubi->bindParam(':longitud', $ubilongitud);
                                                    $crearubi->bindParam(':user', $user);
                                                    $crearubi->bindParam(':fecha', $fecha);
                                                    $crearubi->bindParam(':hora', $hora);
                                                    $crearubi->bindParam(':lugar', $tdetalle);
                                                    $crearubi->bindParam(':id_seguimiento', $id_seguimiento);
                                                    $crearubi->bindParam(':existe_evidencia', $edoc);
                                                    $crearubi->execute();

                                                    // Manejo de evidencias
                                                    $ruta_evidencia = "../public/files/evidencia_seguimiento/{$id_ini_ruta}/{$id_seguimiento}/";
                                                    $ruta_evidencia2 = "public/files/evidencia_seguimiento/{$id_ini_ruta}/{$id_seguimiento}/";
                                                    if (!file_exists($ruta_evidencia)) {
                                                        mkdir($ruta_evidencia, 0777, true);
                                                    }

                                                    $sqlt = "SELECT MAX(id) as idu FROM cmx_iniruta_ubicacion WHERE id_seguimiento = :id_seguimiento";
                                                    $consulta_solic = $this->_db3->prepare($sqlt);
                                                    $consulta_solic->bindParam(':id_seguimiento', $id_seguimiento);
                                                    $consulta_solic->execute();
                                                    $dato = $consulta_solic->fetch();
                                                    $id_ubica = $dato["idu"];

                                                    $sqlub = "UPDATE cmx_iniruta_ubicacion SET evidencia = :ruta, existe_evidencia = :edoc WHERE id = :id_ubica";
                                                    $consulta = $this->_db3->prepare($sqlub);
                                                    $consulta->bindParam(':ruta', $ruta_evidencia2);
                                                    $consulta->bindParam(':edoc', $edoc);
                                                    $consulta->bindParam(':id_ubica', $id_ubica);
                                                    $consulta->execute();

                                                    for ($i = 0; $i < count($_FILES); $i++) {
                                                        if (isset($_FILES["udocumnento" . $i])) {
                                                            $file = $_FILES["udocumnento" . $i];
                                                            move_uploaded_file($file["tmp_name"], $ruta_evidencia . $file["name"]);
                                                        }
                                                    }
                                                }

                                                $this->_db3->commit();
                                                $response = ["success" => true, "message" => "<b>Nota:</b> Registrada exitosamente en NexosApp."];
                                            } catch (\Throwable $e) {
                                                $this->_db3->rollback();
                                                $errorMessage = "Error al insertar nota: " . $e->getMessage() . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
                                                error_log($errorMessage, 3, 'error_log.txt');
                                                $response = ['success' => false, 'message' => 'Error al insertar la nota. Intente más tarde o contacte soporte.'];
                                            }
                                        }
                                    } else {
                                        // echo "No se recibieron datos válidos.";
                                        $mensajeError = "Error No se recibieron datos válidos El dia " . date("Y-m.d");
                                        error_log($mensajeError . "\n", 3, "error_log.txt");
                                        $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                                        throw new Exception("Error al guardar los datos");
                                    }
                                }
                                /* Codigo comentario */
                            }
                        } else {
                            $response = ["success" => false, "message" => "No existen <b>tiempos logísticos de descargue</b> para este manifiesto, por favor diligenciarlos antes de finalizar el seguimiento."];
                        }
                    } else {
                        $response = ["success" => false, "message" => "No existen <b>tiempos logísticos de descargue</b> para este manifiesto, por favor diligenciarlos antes de finalizar el seguimiento."];
                    }
                } else {
                    $response = ["success" => false, "message" => "Los <b>tiempos logísticos</b> no estan completo, por favor revisarlo antes de finalizar el seguimiento."];
                }
            } else {
                $response = ["success" => false, "message" => "No existen <b>tiempos logísticos de cargue</b> para este manifiesto, por favor diligenciarlos antes de finalizar el seguimiento."];
            }
        } else {
            // Validar el valor de Ocurrio para las insertsiones a las base de datos
            if ($data["ocurrio"] == "En sitio") {
                /* Validar si la novedad es comentario o alguna novedad */
                if ($data["novedad_general"] == "COMENTARIO" || substr($data['novedad_general'] ?? '', 0, 7) == "NOVEDAD") {
                    $codigo = $data["id_ini_ruta"];
                    /* Consultar el tiempo del ultimo punto de este manifiesto para mantenerlo */
                    $sql_ultimo_tiempo = $this->_db3->prepare("SELECT tiempo FROM cmx_inicio_seguimiento WHERE cod_ini_ruta=$codigo ORDER BY id DESC LIMIT 1");
                    $sql_ultimo_tiempo->execute();
                    $result_tiempo = $sql_ultimo_tiempo->fetch();
                    $tiempo = $result_tiempo['tiempo'];
                    if ($tiempo) {
                        if ($data) {
                            $id_ini_ruta = $data["id_ini_ruta"];
                            $idm = $data["idmanifiesto"];
                            $contacto = $data["contacto"];
                            $tsegui = $data["tipo_seguimiento"];
                            $tdetalle = empty($data["tipo_detalle"]) ? 0 : $data["tipo_detalle"];
                            $tproceso = $data["tipo_proceso"];
                            $observa = $data["observacion"];
                            $reportecliente = $data["reporte_cliente"];
                            // $estadoactual = $data["estado_actual"];
                            $deta = $data["accion_completado"];
                            $nota_punto_controlador = $data["nota_punto_controlador"];
                            $tipo = $data["tipo_seguimiento"];
                            if (isset($data["novedad_general"])) {
                                $new = $data["novedad_general"];
                            } else {
                                $new = '';
                            }
                            $ocurrio = $data["ocurrio"];
                            $codigo_punto = empty($data["codigo_punto"]) ? 0 : $data["codigo_punto"];
                            $accion_punto = $data["accion_punto"];
                            $manifiesto = $data["manifiesto"];
                            $estado_punto = 'CERRADO';
                            //estado
                            $id_ini_ruta = $data["id_ini_ruta"];
                            $estadoq = $data["estado_siguiente"];
                            $procesoq = $data["accion_completado"];

                            try {
                                $this->_db3->beginTransaction();

                                // 1. UPDATE cmx_inici_manifiesto_estado - poner todos en 0
                                $sql4 = "UPDATE cmx_inici_manifiesto_estado SET ultimo_estado = 0 WHERE cod_ini_ruta = :id_ini_ruta";
                                $stmt4 = $this->_db3->prepare($sql4);
                                $stmt4->bindParam(':id_ini_ruta', $id_ini_ruta);
                                $stmt4->execute();

                                // 2. INSERT cmx_inici_manifiesto_estado - nuevo estado
                                $sql3 = "INSERT INTO cmx_inici_manifiesto_estado (cod_ini_ruta, estado, actual, fecha, hora, usuario, ultimo_estado, reporte_cliente)
                                VALUES (:id_ini_ruta, :estadoq, :procesoq, :fecha, :hora, :user, 1, :reportecliente)";
                                $stmt3 = $this->_db3->prepare($sql3);
                                $stmt3->bindParam(':id_ini_ruta', $id_ini_ruta);
                                $stmt3->bindParam(':estadoq', $estadoq);
                                $stmt3->bindParam(':procesoq', $procesoq);
                                $stmt3->bindParam(':fecha', $fecha);
                                $stmt3->bindParam(':hora', $hora);
                                $stmt3->bindParam(':user', $user);
                                $stmt3->bindParam(':reportecliente', $reportecliente);
                                $stmt3->execute();

                                // 3. INSERT cmx_inicio_seguimiento
                                $sql = "INSERT INTO cmx_inicio_seguimiento (cod_man_estado, tipo_contacto, tipo_seguimiento, detalle_tipo, tipo_proceso, observacion, fecha, hora, usuario, reporte_cliente, cod_ini_ruta, novedad, ocurrio, codigo_punto, tiempo, estado_punto)
                                VALUES (:idm, :contacto, :tsegui, :tdetalle, :tproceso, :observa, :fecha, :hora, :user, :reportecliente, :id_ini_ruta, :new, :ocurrio, :codigo_punto, :tiempo, :estado_punto)";
                                $stmt = $this->_db3->prepare($sql);
                                $stmt->bindParam(':idm', $idm);
                                $stmt->bindParam(':contacto', $contacto);
                                $stmt->bindParam(':tsegui', $tsegui);
                                $stmt->bindParam(':tdetalle', $tdetalle);
                                $stmt->bindParam(':tproceso', $tproceso);
                                $stmt->bindParam(':observa', $observa);
                                $stmt->bindParam(':fecha', $fecha);
                                $stmt->bindParam(':hora', $hora);
                                $stmt->bindParam(':user', $user);
                                $stmt->bindParam(':reportecliente', $reportecliente);
                                $stmt->bindParam(':id_ini_ruta', $id_ini_ruta);
                                $stmt->bindParam(':new', $new);
                                $stmt->bindParam(':ocurrio', $ocurrio);
                                $stmt->bindParam(':codigo_punto', $codigo_punto);
                                $stmt->bindValue(':tiempo', -59);
                                $stmt->bindParam(':estado_punto', $estado_punto);
                                $stmt->execute();

                                // 4. Obtener ID del seguimiento insertado
                                $id_seguimiento = $this->_db3->lastInsertId();

                                // 5. Insertar solicitudes de servicio
                                foreach ($data["solicitud_servicio_nuevo"] as $nsolicitud) {
                                    $sqls = "INSERT INTO cmx_seguimiento_servicio (id_servicio, id_seguimiento, usuario, hora, fecha)
                                    VALUES (:nsolicitud, :id_seguimiento, :user, :hora, :fecha)";
                                    $stmt_s = $this->_db3->prepare($sqls);
                                    $stmt_s->bindParam(':nsolicitud', $nsolicitud);
                                    $stmt_s->bindParam(':id_seguimiento', $id_seguimiento);
                                    $stmt_s->bindParam(':user', $user);
                                    $stmt_s->bindParam(':hora', $hora);
                                    $stmt_s->bindParam(':fecha', $fecha);
                                    $stmt_s->execute();
                                }

                                // Insertar ultimo seguimiento para la nota
                                $sql = $this->_db3->prepare("INSERT INTO cmx_ultimo_seguimiento (manifiesto_id, seguimiento_id, usuario, fecha, hora)
                                    VALUES (:manifiesto_id, :seguimiento_id, :usuario, :fecha, :hora)
                                    ON DUPLICATE KEY UPDATE
                                        seguimiento_id = VALUES(seguimiento_id),
                                        usuario = VALUES(usuario),
                                        fecha = VALUES(fecha),
                                        hora = VALUES(hora)
                                ");
                                $sql->bindParam(':manifiesto_id', $manifiesto, PDO::PARAM_INT);
                                $sql->bindParam(':seguimiento_id', $id_seguimiento);
                                $sql->bindParam(':usuario', $user);
                                $sql->bindParam(':fecha', $fecha);
                                $sql->bindParam(':hora', $hora);
                                $sql->execute();

                                // 6. Cambiar estado del manifiesto
                                if ($accion_punto == 'Lugar Llegada') {
                                    $estado = "LLEGADA";
                                    $estado_punto = "GESTION";
                                    $sql_es = "UPDATE cmx_manifiesto SET estado_seguimiento = :estado WHERE id = :manifiesto";
                                    $stmt_es = $this->_db3->prepare($sql_es);
                                    $stmt_es->bindParam(':estado', $estado);
                                    $stmt_es->bindParam(':manifiesto', $manifiesto);
                                    $stmt_es->execute();

                                    $sql_seg = "UPDATE cmx_inicio_seguimiento SET estado_punto = :estado_punto WHERE cod_ini_ruta = :id_ini_ruta AND codigo_punto = :codigo_punto";
                                    $stmt_seg = $this->_db3->prepare($sql_seg);
                                    $stmt_seg->bindParam(':estado_punto', $estado_punto);
                                    $stmt_seg->bindParam(':id_ini_ruta', $id_ini_ruta);
                                    $stmt_seg->bindParam(':codigo_punto', $codigo_punto);
                                    $stmt_seg->execute();
                                } else {
                                    $estado = "SEGUIMIENTO";
                                    $sql_es = "UPDATE cmx_manifiesto SET estado_seguimiento = :estado WHERE id = :manifiesto";
                                    $stmt_es = $this->_db3->prepare($sql_es);
                                    $stmt_es->bindParam(':estado', $estado);
                                    $stmt_es->bindParam(':manifiesto', $manifiesto);
                                    $stmt_es->execute();
                                }

                                // 7. Si es tipo "punto geográfico"
                                if ($tipo == 'punto geografico') {
                                    $ubilatitud = $data["latitud"];
                                    $ubilongitud = $data["longitud"];
                                    $edoc = empty($data["edocu"]) ? 0 : $data["edocu"];

                                    $sql = "INSERT INTO cmx_iniruta_ubicacion (cod_ini_ruta, latitud, longitud, usuario, fecha, hora, lugar, id_seguimiento, existe_evidencia)
                                    VALUES (:id_ini_ruta, :latitud, :longitud, :user, :fecha, :hora, :tdetalle, :id_seguimiento, :edoc)";
                                    $stmt = $this->_db3->prepare($sql);
                                    $stmt->bindParam(':id_ini_ruta', $id_ini_ruta);
                                    $stmt->bindParam(':latitud', $ubilatitud);
                                    $stmt->bindParam(':longitud', $ubilongitud);
                                    $stmt->bindParam(':user', $user);
                                    $stmt->bindParam(':fecha', $fecha);
                                    $stmt->bindParam(':hora', $hora);
                                    $stmt->bindParam(':tdetalle', $tdetalle);
                                    $stmt->bindParam(':id_seguimiento', $id_seguimiento);
                                    $stmt->bindParam(':edoc', $edoc);
                                    $stmt->execute();

                                    $id_ubica = $this->_db3->lastInsertId();

                                    // Crear carpeta y guardar archivos
                                    $ruta_evidencia = "../public/files/evidencia_seguimiento/$id_ini_ruta/$id_seguimiento/";
                                    $ruta_evidencia2 = "public/files/evidencia_seguimiento/$id_ini_ruta/$id_seguimiento/";
                                    if (!file_exists($ruta_evidencia)) {
                                        mkdir($ruta_evidencia, 0777, true);
                                    }

                                    $sqlub = "UPDATE cmx_iniruta_ubicacion SET evidencia = :evidencia, existe_evidencia = :edoc WHERE id = :id_ubica";
                                    $stmtub = $this->_db3->prepare($sqlub);
                                    $stmtub->bindParam(':evidencia', $ruta_evidencia2);
                                    $stmtub->bindParam(':edoc', $edoc);
                                    $stmtub->bindParam(':id_ubica', $id_ubica);
                                    $stmtub->execute();

                                    for ($i = 0; $i < count($_FILES); $i++) {
                                        if (isset($_FILES["udocumnento" . $i])) {
                                            $file = $_FILES["udocumnento" . $i];
                                            $nombre = $file["name"];
                                            $ruta_provisional = $file["tmp_name"];
                                            $destino = $ruta_evidencia . $nombre;
                                            move_uploaded_file($ruta_provisional, $destino);
                                        }
                                    }
                                }

                                $this->_db3->commit();
                                $response = ["success" => true, "message" => "<b>Nota:</b> Registrada exitosamente en NexosApp."];
                            } catch (\Throwable $e) {
                                $this->_db3->rollback();
                                $mensajeError = "Error en la transacción al insertar nota controlador: " . $e->getMessage() . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
                                error_log($mensajeError, 3, "error_log.txt");
                                $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                            }
                        } else {
                            $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                        }
                    } else {
                        $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                    }
                } else {
                    if ($data) {
                        $id_ini_ruta = $data["id_ini_ruta"];
                        $idm = $data["idmanifiesto"];
                        $contacto = $data["contacto"];
                        $tsegui = $data["tipo_seguimiento"];
                        $tdetalle = $data["tipo_detalle"];
                        $tproceso = $data["tipo_proceso"];
                        $observa = $data["observacion"];
                        $reportecliente = $data["reporte_cliente"];
                        $deta = $data["accion_completado"];
                        $nota_punto_controlador = $data["nota_punto_controlador"];
                        $tipo = $data["tipo_seguimiento"];
                        if (isset($data["novedad_general"])) {
                            $new = $data["novedad_general"];
                        } else {
                            $new = '';
                        }
                        $ocurrio = $data["ocurrio"];
                        $codigo_punto = $data["codigo_punto"];
                        $accion_punto = $data["accion_punto"];
                        $manifiesto = $data["manifiesto"];
                        $estado_punto = 'CERRADO';
                        //estado
                        $id_ini_ruta = $data["id_ini_ruta"];
                        $estadoq = $data["estado_siguiente"];
                        $procesoq = $data["accion_completado"];

                        try {
                            $this->_db3->beginTransaction();

                            // 1. Actualizar estado anterior a 0
                            $sql4 = "UPDATE cmx_inici_manifiesto_estado SET ultimo_estado = 0 WHERE cod_ini_ruta = :id_ini_ruta";
                            $stmt4 = $this->_db3->prepare($sql4);
                            $stmt4->bindParam(':id_ini_ruta', $id_ini_ruta, PDO::PARAM_INT);
                            $stmt4->execute();

                            // 2. Insertar nuevo estado
                            $sql3 = "INSERT INTO cmx_inici_manifiesto_estado 
                            (cod_ini_ruta, estado, actual, fecha, hora, usuario, ultimo_estado, reporte_cliente) 
                            VALUES (:id_ini_ruta, :estadoq, :procesoq, :fecha, :hora, :user, 1, :reportecliente)";
                            $stmt3 = $this->_db3->prepare($sql3);
                            $stmt3->bindParam(':id_ini_ruta', $id_ini_ruta);
                            $stmt3->bindParam(':estadoq', $estadoq);
                            $stmt3->bindParam(':procesoq', $procesoq);
                            $stmt3->bindParam(':fecha', $fecha);
                            $stmt3->bindParam(':hora', $hora);
                            $stmt3->bindParam(':user', $user);
                            $stmt3->bindParam(':reportecliente', $reportecliente);
                            $stmt3->execute();

                            // 3. Insertar seguimiento
                            $sql = "INSERT INTO cmx_inicio_seguimiento 
                            (cod_man_estado, tipo_contacto, tipo_seguimiento, detalle_tipo, tipo_proceso, observacion,
                            fecha, hora, usuario, reporte_cliente, cod_ini_ruta, novedad, ocurrio, codigo_punto, tiempo, estado_punto)
                            VALUES (:idm, :contacto, :tsegui, :tdetalle, :tproceso, :observa, :fecha, :hora, :user, 
                            :reportecliente, :id_ini_ruta, :new, :ocurrio, :codigo_punto, -59, :estado_punto)";
                            $stmt = $this->_db3->prepare($sql);
                            $stmt->bindParam(':idm', $idm);
                            $stmt->bindParam(':contacto', $contacto);
                            $stmt->bindParam(':tsegui', $tsegui);
                            $stmt->bindParam(':tdetalle', $tdetalle);
                            $stmt->bindParam(':tproceso', $tproceso);
                            $stmt->bindParam(':observa', $observa);
                            $stmt->bindParam(':fecha', $fecha);
                            $stmt->bindParam(':hora', $hora);
                            $stmt->bindParam(':user', $user);
                            $stmt->bindParam(':reportecliente', $reportecliente);
                            $stmt->bindParam(':id_ini_ruta', $id_ini_ruta);
                            $stmt->bindParam(':new', $new);
                            $stmt->bindParam(':ocurrio', $ocurrio);
                            $stmt->bindParam(':codigo_punto', $codigo_punto);
                            $stmt->bindParam(':estado_punto', $estado_punto);
                            $stmt->execute();

                            $id_seguimiento = $this->_db3->lastInsertId();

                            // 4. Insertar servicios relacionados
                            if (!empty($data["solicitud_servicio_nuevo"])) {
                                foreach ($data["solicitud_servicio_nuevo"] as $nsolicitud) {
                                    $sqls = "INSERT INTO cmx_seguimiento_servicio (id_servicio, id_seguimiento, usuario, hora, fecha)
                                    VALUES (:nsolicitud, :id_seguimiento, :user, :hora, :fecha)";
                                    $stmtS = $this->_db3->prepare($sqls);
                                    $stmtS->bindParam(':nsolicitud', $nsolicitud);
                                    $stmtS->bindParam(':id_seguimiento', $id_seguimiento);
                                    $stmtS->bindParam(':user', $user);
                                    $stmtS->bindParam(':hora', $hora);
                                    $stmtS->bindParam(':fecha', $fecha);
                                    $stmtS->execute();
                                }
                            }

                            // Insertar ultimo seguimiento para la nota
                            $sql = $this->_db3->prepare("INSERT INTO cmx_ultimo_seguimiento (manifiesto_id, seguimiento_id, usuario, fecha, hora)
                                    VALUES (:manifiesto_id, :seguimiento_id, :usuario, :fecha, :hora)
                                    ON DUPLICATE KEY UPDATE
                                        seguimiento_id = VALUES(seguimiento_id),
                                        usuario = VALUES(usuario),
                                        fecha = VALUES(fecha),
                                        hora = VALUES(hora)
                                ");
                            $sql->bindParam(':manifiesto_id', $manifiesto, PDO::PARAM_INT);
                            $sql->bindParam(':seguimiento_id', $id_seguimiento);
                            $sql->bindParam(':usuario', $user);
                            $sql->bindParam(':fecha', $fecha);
                            $sql->bindParam(':hora', $hora);
                            $sql->execute();

                            // 5. Actualizar estado manifiesto
                            if ($accion_punto === 'Lugar Llegada') {
                                $estado = "LLEGADA";
                                $sqlE1 = "UPDATE cmx_manifiesto SET estado_seguimiento = :estado WHERE id = :manifiesto";
                                $stmtE1 = $this->_db3->prepare($sqlE1);
                                $stmtE1->bindParam(':estado', $estado);
                                $stmtE1->bindParam(':manifiesto', $manifiesto);
                                $stmtE1->execute();

                                $sqlE2 = "UPDATE cmx_inicio_seguimiento SET estado_punto = 'GESTION' WHERE cod_ini_ruta = :id_ini_ruta AND codigo_punto = :codigo_punto";
                                $stmtE2 = $this->_db3->prepare($sqlE2);
                                $stmtE2->bindParam(':id_ini_ruta', $id_ini_ruta);
                                $stmtE2->bindParam(':codigo_punto', $codigo_punto);
                                $stmtE2->execute();
                            } else {
                                $estado = "SEGUIMIENTO";
                                $sqlE = "UPDATE cmx_manifiesto SET estado_seguimiento = :estado WHERE id = :manifiesto";
                                $stmtE = $this->_db3->prepare($sqlE);
                                $stmtE->bindParam(':estado', $estado);
                                $stmtE->bindParam(':manifiesto', $manifiesto);
                                $stmtE->execute();
                            }

                            // 6. Insertar ubicación si es punto geográfico
                            if ($tipo === 'punto geografico') {
                                $sql = "INSERT INTO cmx_iniruta_ubicacion (cod_ini_ruta, latitud, longitud, usuario, fecha, hora, lugar, id_seguimiento, existe_evidencia)
                                VALUES (:id_ini_ruta, :latitud, :longitud, :user, :fecha, :hora, :tdetalle, :id_seguimiento, :edoc)";
                                $stmtU = $this->_db3->prepare($sql);
                                $stmtU->bindParam(':id_ini_ruta', $id_ini_ruta);
                                $stmtU->bindParam(':latitud', $data["latitud"]);
                                $stmtU->bindParam(':longitud', $data["longitud"]);
                                $stmtU->bindParam(':user', $user);
                                $stmtU->bindParam(':fecha', $fecha);
                                $stmtU->bindParam(':hora', $hora);
                                $stmtU->bindParam(':tdetalle', $tdetalle);
                                $stmtU->bindParam(':id_seguimiento', $id_seguimiento);
                                $edoc = empty($data["edocu"]) ? 0 : $data["edocu"];
                                $stmtU->bindParam(':edoc', $edoc);
                                $stmtU->execute();

                                $id_ubica = $this->_db3->lastInsertId();
                                $ruta_evidencia = "../public/files/evidencia_seguimiento/{$id_ini_ruta}/{$id_seguimiento}/";
                                $ruta_evidencia2 = "public/files/evidencia_seguimiento/{$id_ini_ruta}/{$id_seguimiento}/";

                                if (!file_exists($ruta_evidencia)) {
                                    mkdir($ruta_evidencia, 0777, true);
                                }

                                $sqlUb = "UPDATE cmx_iniruta_ubicacion SET evidencia = :ruta, existe_evidencia = :edoc WHERE id = :id_ubica";
                                $stmtUb = $this->_db3->prepare($sqlUb);
                                $stmtUb->bindParam(':ruta', $ruta_evidencia2);
                                $stmtUb->bindParam(':edoc', $edoc);
                                $stmtUb->bindParam(':id_ubica', $id_ubica);
                                $stmtUb->execute();

                                for ($i = 0; $i < count($_FILES); $i++) {
                                    if (isset($_FILES["udocumnento" . $i])) {
                                        $file = $_FILES["udocumnento" . $i];
                                        $src = $ruta_evidencia . $file["name"];
                                        move_uploaded_file($file["tmp_name"], $src);
                                    }
                                }
                            }

                            $this->_db3->commit();
                            $response = ["success" => true, "message" => "<b>Nota:</b> Registrada exitosamente en NexosApp."];
                        } catch (\Throwable $e) {
                            $this->_db3->rollback();
                            $errorMessage = "Error al insertar nota controlador: " . $e->getMessage() . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
                            $logFilePath = 'error_log.txt';
                            error_log($errorMessage, 3, $logFilePath);
                            $response = ["success" => false, "message" => "Ocurrió un error inesperado. Inténtelo más tarde o contacte soporte técnico."];
                        }
                    } else {
                        $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                    }
                }
            } else {
                //Antes
                if ($data["novedad_general"] == "COMENTARIO" || substr($data['novedad_general'] ?? '', 0, 7) == "NOVEDAD") {
                    $codigo = $data["id_ini_ruta"];
                    /* Consultar el tiempo del ultimo punto de este manifiesto para mantenerlo */
                    $sql_ultimo_tiempo = $this->_db3->prepare("SELECT tiempo FROM cmx_inicio_seguimiento WHERE cod_ini_ruta=$codigo ORDER BY id DESC LIMIT 1");
                    $sql_ultimo_tiempo->execute();
                    $result_tiempo = $sql_ultimo_tiempo->fetch();
                    $tiempo = $result_tiempo['tiempo'];
                    if ($tiempo) {
                        if ($data) {
                            $id_ini_ruta = $data["id_ini_ruta"];
                            $idm = $data["idmanifiesto"];
                            $contacto = $data["contacto"];
                            $tsegui = $data["tipo_seguimiento"];
                            $tdetalle = empty($data["tipo_detalle"]) ? 0 : $data["tipo_detalle"];
                            $tproceso = $data["tipo_proceso"];
                            $observa = $data["observacion"];
                            $reportecliente = $data["reporte_cliente"];
                            $deta = $data["accion_completado"];
                            $nota_punto_controlador = $data["nota_punto_controlador"];
                            $tipo = $data["tipo_seguimiento"];
                            if (isset($data["novedad_general"])) {
                                $new = $data["novedad_general"];
                            } else {
                                $new = '';
                            }
                            $ocurrio = $data["ocurrio"];
                            $codigo_punto = empty($data["codigo_punto"]) ? 0 : $data["codigo_punto"];
                            $accion_punto = $data["accion_punto"];
                            $manifiesto = $data["manifiesto"];
                            $estado_punto = 'CERRADO';
                            //estado
                            $id_ini_ruta = $data["id_ini_ruta"];
                            $estadoq = $data["estado_siguiente"];
                            $procesoq = $data["accion_completado"];
                            /* Para registrar los puntos que no estan creados en el sistema */
                            if ($nota_punto_controlador) {

                                try {
                                    $this->_db3->beginTransaction();

                                    // 1. Actualizar último estado
                                    $sql4 = "UPDATE cmx_inici_manifiesto_estado SET ultimo_estado = '0' WHERE cod_ini_ruta = :id_ini_ruta";
                                    $updatemani = $this->_db3->prepare($sql4);
                                    $updatemani->bindParam(':id_ini_ruta', $id_ini_ruta);
                                    $updatemani->execute();

                                    // 2. Insertar nuevo estado del manifiesto
                                    $sql3 = "INSERT INTO cmx_inici_manifiesto_estado 
                                    (cod_ini_ruta, estado, actual, fecha, hora, usuario, ultimo_estado, reporte_cliente)
                                    VALUES (:id_ini_ruta, :estadoq, :procesoq, :fecha, :hora, :user, '1', :reportecliente)";
                                    $crearmani = $this->_db3->prepare($sql3);
                                    $crearmani->bindParam(':id_ini_ruta', $id_ini_ruta);
                                    $crearmani->bindParam(':estadoq', $estadoq);
                                    $crearmani->bindParam(':procesoq', $procesoq);
                                    $crearmani->bindParam(':fecha', $fecha);
                                    $crearmani->bindParam(':hora', $hora);
                                    $crearmani->bindParam(':user', $user);
                                    $crearmani->bindParam(':reportecliente', $reportecliente);
                                    $crearmani->execute();

                                    // 3. Insertar seguimiento
                                    $sql = "INSERT INTO cmx_inicio_seguimiento 
                                    (cod_man_estado, tipo_contacto, tipo_seguimiento, detalle_tipo, tipo_proceso, observacion, fecha, hora, usuario, reporte_cliente, cod_ini_ruta, novedad, ocurrio, codigo_punto, tiempo, estado_punto)
                                    VALUES (:idm, :contacto, :tsegui, :tdetalle, :tproceso, :observa, :fecha, :hora, :user, :reportecliente, :id_ini_ruta, :novedad, :ocurrio, :codigo_punto, :tiempo, :estado_punto)";
                                    $crearinicio = $this->_db3->prepare($sql);
                                    $crearinicio->bindParam(':idm', $idm);
                                    $crearinicio->bindParam(':contacto', $contacto);
                                    $crearinicio->bindParam(':tsegui', $tsegui);
                                    $crearinicio->bindParam(':tdetalle', $tdetalle);
                                    $crearinicio->bindParam(':tproceso', $tproceso);
                                    $crearinicio->bindParam(':observa', $observa);
                                    $crearinicio->bindParam(':fecha', $fecha);
                                    $crearinicio->bindParam(':hora', $hora);
                                    $crearinicio->bindParam(':user', $user);
                                    $crearinicio->bindParam(':reportecliente', $reportecliente);
                                    $crearinicio->bindParam(':id_ini_ruta', $id_ini_ruta);
                                    $crearinicio->bindParam(':novedad', $new);
                                    $crearinicio->bindParam(':ocurrio', $ocurrio);
                                    $crearinicio->bindParam(':codigo_punto', $codigo_punto);
                                    $crearinicio->bindParam(':tiempo', $tiempo);
                                    $crearinicio->bindParam(':estado_punto', $estado_punto);
                                    $crearinicio->execute();

                                    // 4. Obtener id del seguimiento recién insertado
                                    $sqlf = "SELECT MAX(id) as ids FROM cmx_inicio_seguimiento WHERE cod_ini_ruta = :id_ini_ruta";
                                    $consulta_solic = $this->_db3->prepare($sqlf);
                                    $consulta_solic->bindParam(':id_ini_ruta', $id_ini_ruta);
                                    $consulta_solic->execute();
                                    $dato = $consulta_solic->fetch();
                                    $id_seguimiento = $dato["ids"];

                                    // 5. Insertar solicitudes de servicio
                                    foreach ($data["solicitud_servicio_nuevo"] as $nsolicitud) {
                                        $sqls = "INSERT INTO cmx_seguimiento_servicio (id_servicio, id_seguimiento, usuario, hora, fecha)
                                        VALUES (:nsolicitud, :id_seguimiento, :user, :hora, :fecha)";
                                        $crearsoli = $this->_db3->prepare($sqls);
                                        $crearsoli->bindParam(':nsolicitud', $nsolicitud);
                                        $crearsoli->bindParam(':id_seguimiento', $id_seguimiento);
                                        $crearsoli->bindParam(':user', $user);
                                        $crearsoli->bindParam(':hora', $hora);
                                        $crearsoli->bindParam(':fecha', $fecha);
                                        $crearsoli->execute();
                                    }

                                    // Insertar ultimo seguimiento para la nota
                                    $sql = $this->_db3->prepare("INSERT INTO cmx_ultimo_seguimiento (manifiesto_id, seguimiento_id, usuario, fecha, hora)
                                    VALUES (:manifiesto_id, :seguimiento_id, :usuario, :fecha, :hora)
                                    ON DUPLICATE KEY UPDATE
                                        seguimiento_id = VALUES(seguimiento_id),
                                        usuario = VALUES(usuario),
                                        fecha = VALUES(fecha),
                                        hora = VALUES(hora)
                                ");
                                    $sql->bindParam(':manifiesto_id', $manifiesto, PDO::PARAM_INT);
                                    $sql->bindParam(':seguimiento_id', $id_seguimiento);
                                    $sql->bindParam(':usuario', $user);
                                    $sql->bindParam(':fecha', $fecha);
                                    $sql->bindParam(':hora', $hora);
                                    $sql->execute();

                                    // 6. Insertar punto controlador
                                    $sqlpuntocontrol = "INSERT INTO cmx_puntos_controlador(seguimiento_id, punto_controlador, usuario, fecha_at)
                                    VALUES (:id_seguimiento, :nota_punto_controlador, :user, :fecha_at)";
                                    $crearPuntocontrol = $this->_db3->prepare($sqlpuntocontrol);
                                    $fecha_at = $fecha . ' ' . $hora;
                                    $crearPuntocontrol->bindParam(':id_seguimiento', $id_seguimiento);
                                    $crearPuntocontrol->bindParam(':nota_punto_controlador', $nota_punto_controlador);
                                    $crearPuntocontrol->bindParam(':user', $user);
                                    $crearPuntocontrol->bindParam(':fecha_at', $fecha_at);
                                    $crearPuntocontrol->execute();

                                    // 7. Actualizar estado del manifiesto según acción
                                    if ($accion_punto == 'Lugar Llegada') {
                                        $estado = "LLEGADA";
                                        $estado_punto = "GESTION";

                                        $sql_es = "UPDATE cmx_manifiesto SET estado_seguimiento = :estado WHERE id = :manifiesto";
                                        $update_est = $this->_db3->prepare($sql_es);
                                        $update_est->bindParam(':estado', $estado);
                                        $update_est->bindParam(':manifiesto', $manifiesto);
                                        $update_est->execute();

                                        $sql_ep = "UPDATE cmx_inicio_seguimiento SET estado_punto = :estado_punto WHERE cod_ini_ruta = :id_ini_ruta AND codigo_punto = :codigo_punto";
                                        $update_ep = $this->_db3->prepare($sql_ep);
                                        $update_ep->bindParam(':estado_punto', $estado_punto);
                                        $update_ep->bindParam(':id_ini_ruta', $id_ini_ruta);
                                        $update_ep->bindParam(':codigo_punto', $codigo_punto);
                                        $update_ep->execute();
                                    } else {
                                        $estado = "SEGUIMIENTO";
                                        $sql_es = "UPDATE cmx_manifiesto SET estado_seguimiento = :estado WHERE id = :manifiesto";
                                        $update_est = $this->_db3->prepare($sql_es);
                                        $update_est->bindParam(':estado', $estado);
                                        $update_est->bindParam(':manifiesto', $manifiesto);
                                        $update_est->execute();
                                    }

                                    // 8. Finalizar transacción
                                    $this->_db3->commit();
                                    $response = ["success" => true, "message" => "<b>Nota:</b> Registrada exitosamente en NexosApp."];
                                } catch (\Throwable $e) {
                                    $this->_db3->rollback();
                                    $errorMessage = "Error en la transacción al insertar nota controlador: " . $e->getMessage() . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
                                    $logFilePath = 'error_log.txt';
                                    error_log($errorMessage, 3, $logFilePath);
                                    if (!file_exists($logFilePath)) {
                                        error_log("No se pudo crear el archivo de log: $logFilePath\n", 3, $logFilePath);
                                    }
                                    $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                                }
                            } else {

                                try {
                                    // Iniciar una transacción
                                    $this->_db3->beginTransaction();

                                    // Desactivar el último estado anterior
                                    $sql4 = "UPDATE cmx_inici_manifiesto_estado SET ultimo_estado='0' WHERE cod_ini_ruta=:id_ini_ruta";
                                    $updatemani = $this->_db3->prepare($sql4);
                                    $updatemani->bindParam(':id_ini_ruta', $id_ini_ruta, PDO::PARAM_INT);
                                    $result = $updatemani->execute();

                                    if ($result) {
                                        // Insertar nuevo estado
                                        $sql3 = "INSERT INTO cmx_inici_manifiesto_estado 
                                        (cod_ini_ruta, estado, actual, fecha, hora, usuario, ultimo_estado, reporte_cliente)
                                        VALUES(:id_ini_ruta, :estadoq, :procesoq, :fecha, :hora, :user, 1, :reportecliente)";
                                        $crearmani = $this->_db3->prepare($sql3);
                                        $crearmani->bindParam(':id_ini_ruta', $id_ini_ruta);
                                        $crearmani->bindParam(':estadoq', $estadoq);
                                        $crearmani->bindParam(':procesoq', $procesoq);
                                        $crearmani->bindParam(':fecha', $fecha);
                                        $crearmani->bindParam(':hora', $hora);
                                        $crearmani->bindParam(':user', $user);
                                        $crearmani->bindParam(':reportecliente', $reportecliente);
                                        $result_estado = $crearmani->execute();

                                        if ($result_estado) {
                                            // Insertar seguimiento
                                            $sql = "INSERT INTO cmx_inicio_seguimiento 
                                            (cod_man_estado, tipo_contacto, tipo_seguimiento, detalle_tipo, tipo_proceso, observacion, fecha, hora, usuario, reporte_cliente, cod_ini_ruta, novedad, ocurrio, codigo_punto, tiempo, estado_punto)
                                            VALUES(:idm, :contacto, :tsegui, :tdetalle, :tproceso, :observa, :fecha, :hora, :user, :reportecliente, :id_ini_ruta, :new, :ocurrio, :codigo_punto, :tiempo, :estado_punto)";
                                            $crearinicio = $this->_db3->prepare($sql);
                                            $crearinicio->bindParam(':idm', $idm);
                                            $crearinicio->bindParam(':contacto', $contacto);
                                            $crearinicio->bindParam(':tsegui', $tsegui);
                                            $crearinicio->bindParam(':tdetalle', $tdetalle);
                                            $crearinicio->bindParam(':tproceso', $tproceso);
                                            $crearinicio->bindParam(':observa', $observa);
                                            $crearinicio->bindParam(':fecha', $fecha);
                                            $crearinicio->bindParam(':hora', $hora);
                                            $crearinicio->bindParam(':user', $user);
                                            $crearinicio->bindParam(':reportecliente', $reportecliente);
                                            $crearinicio->bindParam(':id_ini_ruta', $id_ini_ruta);
                                            $crearinicio->bindParam(':new', $new);
                                            $crearinicio->bindParam(':ocurrio', $ocurrio);
                                            $crearinicio->bindParam(':codigo_punto', $codigo_punto);
                                            $crearinicio->bindParam(':tiempo', $tiempo);
                                            $crearinicio->bindParam(':estado_punto', $estado_punto);
                                            $result = $crearinicio->execute();

                                            if ($result) {
                                                // Obtener el último ID insertado
                                                $sqlf = "SELECT max(id) as ids FROM cmx_inicio_seguimiento WHERE cod_ini_ruta=:id_ini_ruta";
                                                $consulta_solic = $this->_db3->prepare($sqlf);
                                                $consulta_solic->bindParam(':id_ini_ruta', $id_ini_ruta);
                                                $consulta_solic->execute();
                                                $dato = $consulta_solic->fetch();
                                                $id_seguimiento = $dato["ids"];

                                                // Insertar servicios nuevos
                                                $nservicio = $data["solicitud_servicio_nuevo"];
                                                foreach ($nservicio as $nsolicitud) {
                                                    $sqls = "INSERT INTO cmx_seguimiento_servicio (id_servicio, id_seguimiento, usuario, hora, fecha)
                                                    VALUES(:nsolicitud, :id_seguimiento, :user, :hora, :fecha)";
                                                    $crearsoli = $this->_db3->prepare($sqls);
                                                    $crearsoli->bindParam(':nsolicitud', $nsolicitud);
                                                    $crearsoli->bindParam(':id_seguimiento', $id_seguimiento);
                                                    $crearsoli->bindParam(':user', $user);
                                                    $crearsoli->bindParam(':hora', $hora);
                                                    $crearsoli->bindParam(':fecha', $fecha);
                                                    $crearsoli->execute();
                                                }


                                                // Insertar ultimo seguimiento para la nota
                                                $sql = $this->_db3->prepare("INSERT INTO cmx_ultimo_seguimiento (manifiesto_id, seguimiento_id, usuario, fecha, hora)
                                                    VALUES (:manifiesto_id, :seguimiento_id, :usuario, :fecha, :hora)
                                                    ON DUPLICATE KEY UPDATE
                                                        seguimiento_id = VALUES(seguimiento_id),
                                                        usuario = VALUES(usuario),
                                                        fecha = VALUES(fecha),
                                                        hora = VALUES(hora)
                                                ");

                                                $sql->bindParam(':manifiesto_id', $manifiesto, PDO::PARAM_INT);
                                                $sql->bindParam(':seguimiento_id', $id_seguimiento);
                                                $sql->bindParam(':usuario', $user);
                                                $sql->bindParam(':fecha', $fecha);
                                                $sql->bindParam(':hora', $hora);
                                                $sql->execute();

                                                // Insertar punto de control
                                                $sqlpuntocontrol = "INSERT INTO cmx_puntos_controlador(seguimiento_id, punto_controlador, usuario, fecha_at)
                                                VALUES(:id_seguimiento, :nota_punto_controlador, :user, :fecha_at)";
                                                $crearPuntocontrol = $this->_db3->prepare($sqlpuntocontrol);
                                                $fecha_at = $fecha . " " . $hora;
                                                $crearPuntocontrol->bindParam(':id_seguimiento', $id_seguimiento);
                                                $crearPuntocontrol->bindParam(':nota_punto_controlador', $nota_punto_controlador);
                                                $crearPuntocontrol->bindParam(':user', $user);
                                                $crearPuntocontrol->bindParam(':fecha_at', $fecha_at);
                                                $crearPuntocontrol->execute();

                                                // Actualizar estado manifiesto
                                                if ($accion_punto == 'Lugar Llegada') {
                                                    $estado = "LLEGADA";
                                                    $estado_punto = "GESTION";
                                                } else {
                                                    $estado = "SEGUIMIENTO";
                                                }

                                                $sql_estado = "UPDATE cmx_manifiesto SET estado_seguimiento=:estado WHERE id=:manifiesto";
                                                $update_est = $this->_db3->prepare($sql_estado);
                                                $update_est->bindParam(':estado', $estado);
                                                $update_est->bindParam(':manifiesto', $manifiesto);
                                                $update_est->execute();

                                                if ($accion_punto == 'Lugar Llegada') {
                                                    $sql_estado_punto = "UPDATE cmx_inicio_seguimiento SET estado_punto=:estado_punto WHERE cod_ini_ruta=:id_ini_ruta AND codigo_punto=:codigo_punto";
                                                    $update_punto = $this->_db3->prepare($sql_estado_punto);
                                                    $update_punto->bindParam(':estado_punto', $estado_punto);
                                                    $update_punto->bindParam(':id_ini_ruta', $id_ini_ruta);
                                                    $update_punto->bindParam(':codigo_punto', $codigo_punto);
                                                    $update_punto->execute();
                                                }
                                            }
                                        } else {
                                            $response = ['success' => false, 'message' => 'Error al insertar estado. Intente más tarde o contacte soporte.'];
                                        }
                                    }

                                    // Confirmar transacción
                                    $this->_db3->commit();
                                    $response = ["success" => true, "message" => "<b>Nota:</b> Registrada exitosamente en NexosApp."];
                                } catch (\Throwable $e) {
                                    $this->_db3->rollback();
                                    $errorMessage = "Error en transacción: " . $e->getMessage() . " " . date("Y-m-d H:i:s") . " Usuario: " . $user . "\n";
                                    $logFilePath = 'error_log.txt';
                                    error_log($errorMessage, 3, $logFilePath);

                                    $response = ['success' => false, 'message' => 'Error interno. Intente más tarde o contacte con soporte técnico.'];
                                }
                            }
                        } else {
                            // echo "No se recibieron datos válidos.";
                            $mensajeError = "Error No se recibieron datos válidos El dia " . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
                            error_log($mensajeError . "\n", 3, "error_log.txt");
                            $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                            throw new Exception("Error al guardar los datos");
                        }
                    } else {
                        // echo "No se recibio el tiempo de la nota.";
                        $mensajeError = "Error No se recibio el tiempo de la nota. El dia " . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
                        error_log($mensajeError . "\n", 3, "error_log.txt");
                        $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                        throw new Exception("Error al guardar Tiempos");
                    }
                } else {
                    if ($data) {
                        $id_ini_ruta = $data["id_ini_ruta"];
                        $idm = $data["idmanifiesto"];
                        $contacto = $data["contacto"];
                        $tsegui = $data["tipo_seguimiento"];
                        $tdetalle = empty($data["tipo_detalle"]) ? 0 : $data["tipo_detalle"];
                        $tproceso = $data["tipo_proceso"];
                        $observa = $data["observacion"];
                        $reportecliente = $data["reporte_cliente"];
                        $deta = $data["accion_completado"];
                        $nota_punto_controlador = $data["nota_punto_controlador"];
                        $tipo = $data["tipo_seguimiento"];
                        if (isset($data["novedad_general"])) {
                            $new = $data["novedad_general"];
                        } else {
                            $new = '';
                        }
                        $ocurrio = $data["ocurrio"];
                        $codigo_punto = empty($data["codigo_punto"]) ? 0 : $data["codigo_punto"];
                        $accion_punto = $data["accion_punto"];
                        $manifiesto = $data["manifiesto"];
                        //estado
                        $id_ini_ruta = $data["id_ini_ruta"];
                        $estadoq = $data["estado_siguiente"];
                        $procesoq = $data["accion_completado"];
                        $estado_punto = 'GESTION';

                        /* Validar si el punto del controlador esta en el sistema */
                        // if ($nota_punto_controlador) {

                        if ($nota_punto_controlador) {
                            try {
                                $this->_db3->beginTransaction();

                                // 1. Resetear último estado
                                $sql4 = "UPDATE cmx_inici_manifiesto_estado SET ultimo_estado = 0 WHERE cod_ini_ruta = :cod_ini_ruta";
                                $stmt4 = $this->_db3->prepare($sql4);
                                $stmt4->bindParam(':cod_ini_ruta', $id_ini_ruta, PDO::PARAM_INT);
                                $stmt4->execute();

                                // 2. Insertar nuevo estado
                                $sql3 = "INSERT INTO cmx_inici_manifiesto_estado (id, cod_ini_ruta, estado, actual, fecha, hora, usuario, ultimo_estado, reporte_cliente)
                                VALUES (NULL, :cod_ini_ruta, :estado, :actual, :fecha, :hora, :usuario, 1, :reporte_cliente)";
                                $stmt3 = $this->_db3->prepare($sql3);
                                $stmt3->bindParam(':cod_ini_ruta', $id_ini_ruta);
                                $stmt3->bindParam(':estado', $estadoq);
                                $stmt3->bindParam(':actual', $procesoq);
                                $stmt3->bindParam(':fecha', $fecha);
                                $stmt3->bindParam(':hora', $hora);
                                $stmt3->bindParam(':usuario', $user);
                                $stmt3->bindParam(':reporte_cliente', $reportecliente);
                                $stmt3->execute();

                                // 3. Insertar seguimiento
                                $sql = "INSERT INTO cmx_inicio_seguimiento (id, cod_man_estado, tipo_contacto, tipo_seguimiento, detalle_tipo, tipo_proceso, observacion, fecha, hora, usuario, reporte_cliente, cod_ini_ruta, novedad, ocurrio, codigo_punto, tiempo, estado_punto)
                                VALUES (NULL, :cod_man_estado, :tipo_contacto, :tipo_seguimiento, :detalle_tipo, :tipo_proceso, :observacion, :fecha, :hora, :usuario, :reporte_cliente, :cod_ini_ruta, :novedad, :ocurrio, :codigo_punto, -59, :estado_punto)";
                                $stmt = $this->_db3->prepare($sql);
                                $stmt->bindParam(':cod_man_estado', $idm);
                                $stmt->bindParam(':tipo_contacto', $contacto);
                                $stmt->bindParam(':tipo_seguimiento', $tsegui);
                                $stmt->bindParam(':detalle_tipo', $tdetalle);
                                $stmt->bindParam(':tipo_proceso', $tproceso);
                                $stmt->bindParam(':observacion', $observa);
                                $stmt->bindParam(':fecha', $fecha);
                                $stmt->bindParam(':hora', $hora);
                                $stmt->bindParam(':usuario', $user);
                                $stmt->bindParam(':reporte_cliente', $reportecliente);
                                $stmt->bindParam(':cod_ini_ruta', $id_ini_ruta);
                                $stmt->bindParam(':novedad', $new);
                                $stmt->bindParam(':ocurrio', $ocurrio);
                                $stmt->bindParam(':codigo_punto', $codigo_punto);
                                $stmt->bindParam(':estado_punto', $estado_punto);
                                $stmt->execute();

                                // 4. Obtener el último ID de seguimiento
                                $sqlf = "SELECT MAX(id) AS ids FROM cmx_inicio_seguimiento WHERE cod_ini_ruta = :cod_ini_ruta";
                                $stmtf = $this->_db3->prepare($sqlf);
                                $stmtf->bindParam(':cod_ini_ruta', $id_ini_ruta);
                                $stmtf->execute();
                                $dato = $stmtf->fetch(PDO::FETCH_ASSOC);
                                $id_seguimiento = $dato["ids"];

                                // 5. Insertar solicitudes de servicio
                                $nservicio = $data["solicitud_servicio_nuevo"] ?? [];
                                $sqls = "INSERT INTO cmx_seguimiento_servicio (id, id_servicio, id_seguimiento, usuario, hora, fecha)
                                VALUES (NULL, :id_servicio, :id_seguimiento, :usuario, :hora, :fecha)";
                                $stmt_servicio = $this->_db3->prepare($sqls);
                                foreach ($nservicio as $nsolicitud) {
                                    $stmt_servicio->bindParam(':id_servicio', $nsolicitud);
                                    $stmt_servicio->bindParam(':id_seguimiento', $id_seguimiento);
                                    $stmt_servicio->bindParam(':usuario', $user);
                                    $stmt_servicio->bindParam(':hora', $hora);
                                    $stmt_servicio->bindParam(':fecha', $fecha);
                                    $stmt_servicio->execute();
                                }
                                if (!isset($_POST['manifiesto'])) {
                                    throw new Exception("Falta el manifiesto");
                                }

                                // Insertar ultimo seguimiento para la nota
                                $sql = $this->_db3->prepare("INSERT INTO cmx_ultimo_seguimiento (manifiesto_id, seguimiento_id, usuario, fecha, hora)
                                    VALUES (:manifiesto_id, :seguimiento_id, :usuario, :fecha, :hora)
                                    ON DUPLICATE KEY UPDATE
                                        seguimiento_id = VALUES(seguimiento_id),
                                        usuario = VALUES(usuario),
                                        fecha = VALUES(fecha),
                                        hora = VALUES(hora)
                                ");
                                $sql->bindParam(':manifiesto_id', $manifiesto, PDO::PARAM_INT);
                                $sql->bindParam(':seguimiento_id', $id_seguimiento);
                                $sql->bindParam(':usuario', $user);
                                $sql->bindParam(':fecha', $fecha);
                                $sql->bindParam(':hora', $hora);
                                $sql->execute();

                                // 6. Insertar punto controlador
                                $sqlpuntocontrol = "INSERT INTO cmx_puntos_controlador (seguimiento_id, punto_controlador, usuario, fecha_at)
                                VALUES (:seguimiento_id, :punto_controlador, :usuario, :fecha_at)";
                                $stmt_punto = $this->_db3->prepare($sqlpuntocontrol);
                                $fecha_at = $fecha . $hora;
                                $stmt_punto->bindParam(':seguimiento_id', $id_seguimiento);
                                $stmt_punto->bindParam(':punto_controlador', $nota_punto_controlador);
                                $stmt_punto->bindParam(':usuario', $user);
                                $stmt_punto->bindParam(':fecha_at', $fecha_at);
                                $stmt_punto->execute();

                                // 7. Actualizar estado del manifiesto
                                if ($accion_punto === 'Lugar Llegada') {
                                    $estado = "LLEGADA";
                                } else {
                                    $estado = "SEGUIMIENTO";
                                }
                                $sql_est = "UPDATE cmx_manifiesto SET estado_seguimiento = :estado WHERE id = :id";
                                $stmt_est = $this->_db3->prepare($sql_est);
                                $stmt_est->bindParam(':estado', $estado);
                                $stmt_est->bindParam(':id', $manifiesto, PDO::PARAM_INT);
                                $stmt_est->execute();

                                // Finalizar transacción
                                $this->_db3->commit();
                                $response = ["success" => true, "message" => "<b>Nota:</b> Registrada exitosamente en NexosApp."];
                            } catch (\Throwable $e) {
                                $this->_db3->rollback();
                                error_log("Error en transacción: " . $e->getMessage(), 3, 'error_log.txt');
                                $response = ["success" => false, "message" => "Ocurrió un error interno. Intente más tarde o contacte a soporte."];
                            }
                        } else {

                            try {
                                $this->_db3->beginTransaction();

                                // Resetear el ultimo estado
                                $sql4 = "UPDATE cmx_inici_manifiesto_estado SET ultimo_estado='0' WHERE cod_ini_ruta=:id_ini_ruta";
                                $updatemani = $this->_db3->prepare($sql4);
                                $updatemani->bindParam(':id_ini_ruta', $id_ini_ruta);
                                $updatemani->execute();

                                // Insertar nuevo estado
                                $sql3 = "INSERT INTO cmx_inici_manifiesto_estado (cod_ini_ruta, estado, actual, fecha, hora, usuario, ultimo_estado, reporte_cliente)
                                VALUES (:id_ini_ruta, :estadoq, :procesoq, :fecha, :hora, :user, '1', :reportecliente)";
                                $crearmani = $this->_db3->prepare($sql3);
                                $crearmani->execute([
                                    ':id_ini_ruta' => $id_ini_ruta,
                                    ':estadoq' => $estadoq,
                                    ':procesoq' => $procesoq,
                                    ':fecha' => $fecha,
                                    ':hora' => $hora,
                                    ':user' => $user,
                                    ':reportecliente' => $reportecliente
                                ]);

                                // Insertar seguimiento
                                $sql = "INSERT INTO cmx_inicio_seguimiento (cod_man_estado, tipo_contacto, tipo_seguimiento, detalle_tipo, tipo_proceso, observacion, fecha, hora, usuario, reporte_cliente, cod_ini_ruta, novedad, ocurrio, codigo_punto, tiempo, estado_punto)
                                VALUES (:idm, :contacto, :tsegui, :tdetalle, :tproceso, :observa, :fecha, :hora, :user, :reportecliente, :id_ini_ruta, :new, :ocurrio, :codigo_punto, -59, :estado_punto)";
                                $crearinicio = $this->_db3->prepare($sql);
                                $crearinicio->execute([
                                    ':idm' => $idm,
                                    ':contacto' => $contacto,
                                    ':tsegui' => $tsegui,
                                    ':tdetalle' => $tdetalle,
                                    ':tproceso' => $tproceso,
                                    ':observa' => $observa,
                                    ':fecha' => $fecha,
                                    ':hora' => $hora,
                                    ':user' => $user,
                                    ':reportecliente' => $reportecliente,
                                    ':id_ini_ruta' => $id_ini_ruta,
                                    ':new' => $new,
                                    ':ocurrio' => $ocurrio,
                                    ':codigo_punto' => $codigo_punto,
                                    ':estado_punto' => $estado_punto
                                ]);

                                $id_seguimiento = $this->_db3->lastInsertId();

                                // Insertar servicios
                                foreach ($data["solicitud_servicio_nuevo"] as $nsolicitud) {
                                    $sqls = "INSERT INTO cmx_seguimiento_servicio (id_servicio, id_seguimiento, usuario, hora, fecha)
                                    VALUES (:nsolicitud, :id_seguimiento, :user, :hora, :fecha)";
                                    $crearsoli = $this->_db3->prepare($sqls);
                                    $crearsoli->execute([
                                        ':nsolicitud' => $nsolicitud,
                                        ':id_seguimiento' => $id_seguimiento,
                                        ':user' => $user,
                                        ':hora' => $hora,
                                        ':fecha' => $fecha
                                    ]);
                                }

                                // Insertar ultimo seguimiento para la nota
                                $sql = $this->_db3->prepare("INSERT INTO cmx_ultimo_seguimiento (manifiesto_id, seguimiento_id, usuario, fecha, hora)
                                    VALUES (:manifiesto_id, :seguimiento_id, :usuario, :fecha, :hora)
                                    ON DUPLICATE KEY UPDATE
                                        seguimiento_id = VALUES(seguimiento_id),
                                        usuario = VALUES(usuario),
                                        fecha = VALUES(fecha),
                                        hora = VALUES(hora)
                                ");
                                $sql->bindParam(':manifiesto_id', $data['manifiesto'], PDO::PARAM_INT);
                                $sql->bindParam(':seguimiento_id', $id_seguimiento);
                                $sql->bindParam(':usuario', $user);
                                $sql->bindParam(':fecha', $fecha);
                                $sql->bindParam(':hora', $hora);
                                $sql->execute();

                                // Punto de control personalizado
                                $sqlpuntocontrol = "INSERT INTO cmx_puntos_controlador(seguimiento_id, punto_controlador, usuario, fecha_at)
                                VALUES(:id_seguimiento, :nota_punto_controlador, :user, :fechahora)";
                                $crearPuntocontrol = $this->_db3->prepare($sqlpuntocontrol);
                                $crearPuntocontrol->execute([
                                    ':id_seguimiento' => $id_seguimiento,
                                    ':nota_punto_controlador' => $nota_punto_controlador,
                                    ':user' => $user,
                                    ':fechahora' => $fecha . $hora
                                ]);

                                // Actualizar estado manifiesto
                                $estado = ($accion_punto == 'Lugar Llegada') ? 'LLEGADA' : 'SEGUIMIENTO';
                                $sql_es = "UPDATE cmx_manifiesto SET estado_seguimiento=:estado WHERE id=:manifiesto";
                                $update_est = $this->_db3->prepare($sql_es);
                                $update_est->execute([':estado' => $estado, ':manifiesto' => $manifiesto]);

                                // Punto geográfico
                                if ($tipo == 'punto geografico') {
                                    $ubilatitud = $data["latitud"];
                                    $ubilongitud = $data["longitud"];
                                    $edoc = $data["edocu"];

                                    $sql = "INSERT INTO cmx_iniruta_ubicacion (cod_ini_ruta, latitud, longitud, usuario, fecha, hora, lugar, id_seguimiento, existe_evidencia)
                                    VALUES (:id_ini_ruta, :lat, :lng, :user, :fecha, :hora, :lugar, :id_seguimiento, :existe)";
                                    $crearubi = $this->_db3->prepare($sql);
                                    $crearubi->execute([
                                        ':id_ini_ruta' => $id_ini_ruta,
                                        ':lat' => $ubilatitud,
                                        ':lng' => $ubilongitud,
                                        ':user' => $user,
                                        ':fecha' => $fecha,
                                        ':hora' => $hora,
                                        ':lugar' => $tdetalle,
                                        ':id_seguimiento' => $id_seguimiento,
                                        ':existe' => $edoc
                                    ]);

                                    $id_ubica = $this->_db3->lastInsertId();

                                    // Evidencia ruta
                                    $ruta_evidencia = "../public/files/evidencia_seguimiento/$id_ini_ruta/$id_seguimiento/";
                                    $ruta_evidencia2 = "public/files/evidencia_seguimiento/$id_ini_ruta/$id_seguimiento/";
                                    if (!file_exists($ruta_evidencia)) mkdir($ruta_evidencia, 0777, true);

                                    $sqlub = "UPDATE cmx_iniruta_ubicacion SET evidencia=:evidencia, existe_evidencia=:existe WHERE id=:id_ubica";
                                    $stmt = $this->_db3->prepare($sqlub);
                                    $stmt->execute([
                                        ':evidencia' => $ruta_evidencia2,
                                        ':existe' => $edoc,
                                        ':id_ubica' => $id_ubica
                                    ]);

                                    for ($i = 0; $i < count($_FILES); $i++) {
                                        if (isset($_FILES["udocumnento" . $i])) {
                                            $file = $_FILES["udocumnento" . $i];
                                            $src = $ruta_evidencia . $file["name"];
                                            move_uploaded_file($file["tmp_name"], $src);
                                        }
                                    }
                                }

                                $this->_db3->commit();
                                $response = ["success" => true, "message" => "<b>Nota:</b> Registrada exitosamente en NexosApp."];
                            } catch (\Throwable $e) {
                                $this->_db3->rollback();
                                error_log("Error en la transacción al insertar nota controlador: " . $e->getMessage() . " " . date("Y-m-d H:i:s") . " $user\n", 3, "error_log.txt");
                                $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.<br> O comunicarse con el equipo de desarrollo.'];
                            }
                        }
                    } else {
                        // echo "No se recibieron datos válidos.";
                        $mensajeError = "Error No se recibieron datos válidos El dia " . date("Y-m.d");
                        error_log($mensajeError . "\n", 3, "error_log.txt");
                        $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                        throw new Exception("Error al guardar los datos");
                    }
                }
            }
        }
        return $response;
    }

    /* Consulta de puntos para plan de ruta */

    public function ConsultaPuntos($ciudad_id)
    {
        $sql = $this->_db3->prepare("SELECT r.id, mr.municipio,mr.depto, r.nom_punto,
			r.latitud, r.longitud, r.estado
			FROM  cmx_para_punto_ruta r
			INNER JOIN cmx_municipios mr
			ON r.cod_ciudad=mr.id
			WHERE cod_ciudad=:CiudadId");
        $sql->bindParam(':CiudadId', $ciudad_id);
        $sql->execute();
        $result = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function ConsultaPuntosPara($id_punto)
    {
        $sql = $this->_db3->prepare("SELECT r.id, mr.id as id_muni, mr.municipio,mr.depto, r.nom_punto,
			r.latitud, r.longitud, r.estado, r.descripcion_punto
			FROM  cmx_para_punto_ruta r
			INNER JOIN cmx_municipios mr
			ON r.cod_ciudad=mr.id
			WHERE r.id=:PuntoId");
        $sql->bindParam(':PuntoId', $id_punto);
        $sql->execute();
        $result = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function MaestroDetallePlan()
    {
        try {
            // Obtener número actual
            $sql = "SELECT numero_actual FROM cmx_maestro WHERE tipo = :tipo";
            $stmt = $this->_db3->prepare($sql);
            $tipo = 'DET_RUTA';
            $stmt->bindParam(':tipo', $tipo, PDO::PARAM_STR);
            $stmt->execute();

            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($result) {
                $numeracion = $result['numero_actual'] + 1;

                // Actualizar número
                $sql2 = "UPDATE cmx_maestro SET numero_actual = :numeracion WHERE tipo = :tipo";
                $stmt2 = $this->_db3->prepare($sql2);
                $stmt2->bindParam(':numeracion', $numeracion, PDO::PARAM_INT);
                $stmt2->bindParam(':tipo', $tipo, PDO::PARAM_STR);
                $stmt2->execute();

                // Aquí podrías usar directamente $numeracion si lo necesitas
                return $result;
            }
        } catch (PDOException $e) {
            // Manejo del error si lo necesitas (puedes quitar esto si no quieres nada)
            echo "Error: " . $e->getMessage();
        }
    }

    public function TplanRuta($origen_ruta, $destino_ruta)
    {
        $sql = $this->_db3->prepare("SELECT pl.cod_plan ,pl.nombre_plan, mn1.municipio as origen, mn2.municipio as destino, ru.km_tot_ruta, pl.observacion
			FROM cmx_rutas AS ru
			INNER JOIN cmx_plan_ruta AS pl ON ru.id=pl.cod_ruta
			INNER JOIN cmx_municipios mn1 ON ru.cod_ciudad_origen=mn1.id
			INNER JOIN cmx_municipios mn2 ON ru.cod_ciudad_destino=mn2.id
			WHERE ru.cod_ciudad_origen=:origen_ruta AND ru.cod_ciudad_destino=:destino_ruta AND pl.estado='Activo' AND ru.tipo_ruta='Principal' GROUP BY pl.cod_plan");
        $sql->bindParam(':origen_ruta', $origen_ruta);
        $sql->bindParam(':destino_ruta', $destino_ruta);
        $sql->execute();
        $result = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function consultarViajesVehiculo($placa, $destino, $cliente)
    {
        $response = [];

        try {
            // Contador General de viajes del vehiculo
            $sql1 = "SELECT
                COUNT(DISTINCT m.id) AS Manifiestos,
                m.placa,
                cond.numdoc_nexos
            FROM
                cmx_manifiesto m
                INNER JOIN cmx_cumplido c ON m.id = c.manifiesto
                INNER JOIN cmx_manifiesto_estado me ON m.id = me.id_manifiesto AND me.estado = 1
                INNER JOIN cmx_vehiculos v ON m.placa = v.placa
                INNER JOIN cmx_proveedores cond ON v.id_conductor = cond.numdoc_nexos
            WHERE
                m.estadomnf_actual = 1
                AND m.placa = :placa";
            $stmt1 = $this->_db3->prepare($sql1);
            $stmt1->bindParam(':placa', $placa);
            $stmt1->execute();
            $response['general'] = $stmt1->fetch(PDO::FETCH_ASSOC);

            // Contador de viajes de la placa por el destino
            $sql2 = "SELECT
                COUNT(DISTINCT m.id) AS Manifiestos
            FROM
                cmx_manifiesto m
                INNER JOIN cmx_municipios des ON m.destino_viaje=des.id
                INNER JOIN cmx_cumplido c ON m.id = c.manifiesto
                INNER JOIN cmx_manifiesto_estado me ON m.id = me.id_manifiesto AND me.estado = 1
                INNER JOIN cmx_vehiculos v ON m.placa = v.placa
                INNER JOIN cmx_proveedores cond ON v.id_conductor = cond.numdoc_nexos
            WHERE
                m.estadomnf_actual = 1
                AND m.placa = :placa
                AND des.rndc_codigo_ciudad= :destino";
            $stmt2 = $this->_db3->prepare($sql2);
            $stmt2->bindParam(':placa', $placa);
            $stmt2->bindParam(':destino', $destino);
            $stmt2->execute();
            $response['por_destino'] = $stmt2->fetch(PDO::FETCH_ASSOC);

            // Contador de viajes por cliente
            $sql3 = "SELECT
                COUNT(DISTINCT m.id) AS Manifiestos
            FROM
                cmx_manifiesto m
                INNER JOIN cmx_municipios des ON m.destino_viaje=des.id
                INNER JOIN cmx_cumplido c ON m.id = c.manifiesto
                INNER JOIN cmx_manifiesto_estado me ON m.id = me.id_manifiesto AND me.estado = 1
                INNER JOIN cmx_vehiculos v ON m.placa = v.placa
                INNER JOIN cmx_proveedores cond ON v.id_conductor = cond.numdoc_nexos
                INNER JOIN cmx_manifiesto_remesa mr ON m.id=mr.id_manifiesto
                INNER JOIN cmx_remesa r ON mr.id_remesa=r.id
                INNER JOIN cmx_solicitud_vehiculo2 ss ON r.mer_idservicio=ss.nundoc_solicitud
                INNER JOIN cmx_cotizaciones_serviciocliente cs ON ss.n_cotizacion=cs.n_cotizacion
                INNER JOIN cmx_clientes cl ON cs.id_cliente=cl.id
            WHERE
                m.estadomnf_actual = 1
                AND m.placa = :placa
                AND cl.id= :cliente";
            $stmt3 = $this->_db3->prepare($sql3);
            $stmt3->bindParam(':placa', $placa);
            $stmt3->bindParam(':cliente', $cliente);
            $stmt3->execute();
            $response['por_cliente'] = $stmt3->fetch(PDO::FETCH_ASSOC);

        } catch (Exception $e) {
            $response['error'] = $e->getMessage();
        }

        return $response;
    }
}
