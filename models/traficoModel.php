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
        $sql = "INSERT INTO cmx_rutas
				(id,cod_ciudad_origen,cod_ciudad_destino,estado,observaciones,fecha,hora,usuario,latitud_origen,latitud_destino,longitud_origen,longitud_destino,tiempo_tot_ruta,km_tot_ruta)
				VALUES(null,:origen,:destino,:estado,:observa,:fecha,:hora,:usuario,:latitud_origen,:latitud_destino,:longitud_origen,:longitud_destino,:tiempo_tot,:kilo_tot)";
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
        $resultado = $crearruta->execute();
        return $resultado;
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
        -- LEFT JOIN cmx_tiempo_descargue des ON des.num_manifiesto=i.num_manifiesto
       -- LEFT JOIN cmx_tiempo_descargue_rem tdes ON tdes.id_descargue=des.id AND tdes.tipo_fecha='fec_llegada'
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
        $sql = $this->_db3->prepare("SELECT m.municipio,a.tipo_seguimiento,a.fecha, a.hora,a.observacion,a.usuario,ppr.nom_punto,prd.nombre_punto,a.novedad,pc.punto_controlador
        FROM cmx_inicio_seguimiento a
        INNER JOIN cmx_seguimiento_servicio b ON a.id=b.id_seguimiento
        LEFT JOIN cmx_municipios m ON a.detalle_tipo=m.id
        -- LEFT JOIN cmx_para_novedades_seguimiento nov ON a.novedad=nov.id
        LEFT JOIN cmx_puntos_controlador pc ON a.id=pc.seguimiento_id
        LEFT JOIN cmx_planruta_detalle prd ON prd.cod_punto=a.codigo_punto
        LEFT JOIN cmx_para_punto_ruta ppr ON ppr.id=a.codigo_punto
        WHERE a.cod_ini_ruta=:codigo_inicio GROUP BY a.id ORDER BY a.id DESC");
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
        // $sql = $this->_db3->prepare("SELECT s.tiempo
        // FROM cmx_inicio_seguimiento s
        // WHERE s.cod_ini_ruta=:Codigo_Inicio AND s.tipo_proceso IN('seguimiento') AND s.id IN(
        // SELECT MAX(s.id) FROM cmx_inicio_seguimiento s WHERE s.cod_ini_ruta=:Codigo_Inicio AND s.tipo_proceso IN('seguimiento'))");

        // $sql = $this->_db3->prepare("SELECT s.tiempo FROM cmx_inicio_seguimiento s WHERE s.cod_ini_ruta = :Codigo_Inicio
        // AND s.tipo_proceso = 'seguimiento'
        // AND s.id = (SELECT MAX(s2.id) FROM cmx_inicio_seguimiento s2 WHERE s2.cod_ini_ruta = :Codigo_Inicio AND s2.tipo_proceso = 'seguimiento')");
        // $sql->bindParam(':Codigo_Inicio', $codini);
        // $sql->execute();
        // $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        // return $resultado;

        $sql = $this->_db3->prepare("WITH MaxID AS (SELECT MAX(id) AS max_id FROM cmx_inicio_seguimiento
        WHERE cod_ini_ruta = :Codigo_Inicio AND tipo_proceso = 'seguimiento') SELECT s.tiempo FROM cmx_inicio_seguimiento s JOIN MaxID ON s.id = MaxID.max_id");
        $sql->bindParam(':Codigo_Inicio', $codini);
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
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

    public function Consultar_Notas_Controlador($codini)
    {
        // $sql = $this->_db3->prepare("SELECT hora,fecha,observacion FROM cmx_inicio_seguimiento WHERE cod_ini_ruta=:Codigo_Inicio ORDER BY id DESC LIMIT 1");
        // $sql = $this->_db3->prepare("SELECT ins.hora,ins.fecha,ins.observacion,prd.nombre_punto AS punto_plan_ruta,ppr.nom_punto,ins.usuario,ins.novedad FROM cmx_inicio_seguimiento ins

        // $sql = $this->_db3->prepare("SELECT ins.hora,ins.fecha,ins.observacion,IFNULL(m.municipio,pc.punto_controlador) AS Municipio,ins.usuario,ins.novedad FROM cmx_inicio_seguimiento ins
        // LEFT JOIN cmx_planruta_detalle prd ON prd.cod_punto=ins.codigo_punto
        //  LEFT JOIN cmx_municipios m ON ins.detalle_tipo=m.id
        //    LEFT JOIN cmx_puntos_controlador pc ON ins.id=pc.seguimiento_id
        // LEFT JOIN cmx_para_punto_ruta ppr ON ppr.id=ins.codigo_punto
        // WHERE cod_ini_ruta=:Codigo_Inicio ORDER BY ins.id DESC LIMIT 1");
        // $sql->bindParam(':Codigo_Inicio', $codini, PDO::PARAM_STR);
        // $sql->execute();
        // $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
        // return $resultados;

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

    public function crear_inicio_ruta($datos)
    {
        $_msg_error = "";

        // Iniciar una transacción
        $this->_db3->beginTransaction();

        $fecha = date('Y-m-d');
        $hora = date('H:i:s');
        $user = $_SESSION["usuario"]["nom_usuario"];

        try {
            // // Validar y sanear los datos
            // $cab = filter_input(INPUT_POST, 'cab', FILTER_SANITIZE_NUMBER_INT);
            if ($datos['cab'] == '1') {

                //Selccionar el el codigo de inicio del maestro
                $empresa_id = $_SESSION['usuario']['empresa_id'];
                $sql_consecutivo = $this->_db3->prepare("SELECT numero_actual FROM cmx_maestro WHERE tipo='INICIO_RUTA' AND numero_actual>numero_inicial AND empresa_id='" . $empresa_id . "'");
                $resultado_consecutivo = $sql_consecutivo->execute();
                $resultado_consecutivo = $sql_consecutivo->fetch(PDO::FETCH_ASSOC);
                $numdoc_inicio_ruta = $resultado_consecutivo['numero_actual'];
                $numero_inicioruta = $resultado_consecutivo['numero_actual'] + 1;

                if ($numdoc_inicio_ruta) {
                    # code...
                } else {
                    # code...
                }


                // Inserción en cmx_inicio_ruta
                $sql = "INSERT INTO cmx_inicio_ruta (id, cod_inicio, num_manifiesto, cod_plan, cond_cedula, placa, observacion, fecha, hora, usuario, clave_tarjeta, fechasalida, horasalida)
                    VALUES (null, :cod_ini, :mani, :Plan, :cedula, :placa, :obse, :fecha, :hora, :user, :calvetj, :fechasalida, :horasalida)";
                $crearinicio = $this->_db3->prepare($sql);
                $crearinicio->bindParam(':cod_ini', $numdoc_inicio_ruta);
                $crearinicio->bindParam(':mani', $datos['mani']);
                $crearinicio->bindParam(':Plan', $datos['Plan']);
                $crearinicio->bindParam(':cedula', $datos['cedula']);
                $crearinicio->bindParam(':placa', $datos['placa']);
                $crearinicio->bindParam(':obse', $datos['obse']);
                $crearinicio->bindParam(':fecha', $datos['fecha']);
                $crearinicio->bindParam(':hora', $datos['hora']);
                $crearinicio->bindParam(':user', $datos['user']);
                $crearinicio->bindParam(':calvetj', $datos['calvetj']);
                $crearinicio->bindParam(':fechasalida', $datos['fechasalida']);
                $crearinicio->bindParam(':horasalida', $datos['horasalida']);
                $crearinicio->execute();

                // Actualización de cmx_manifiesto
                $sql_update_manifiesto = "UPDATE cmx_manifiesto SET estado_seguimiento = 'SALIDA' WHERE id = :mani";
                $result_update = $this->_db3->prepare($sql_update_manifiesto);
                $result_update->bindParam(':mani', $datos['mani']);
                $result_update->execute();

                // Inserción en cmx_inici_manifiesto_estado
                $sql3 = "INSERT INTO cmx_inici_manifiesto_estado (id, cod_ini_ruta, estado, actual, fecha, hora, usuario, ultimo_estado)
                     VALUES (null, :cod_ini, '2', 'completado', :fecha, :hora, :user, '1')";
                $crearmani = $this->_db3->prepare($sql3);
                $crearmani->bindParam(':cod_ini', $numdoc_inicio_ruta);
                $crearmani->bindParam(':fecha', $fecha);
                $crearmani->bindParam(':hora', $hora);
                $crearmani->bindParam(':user', $user);
                $crearmani->execute();

                // Consultar los números de servicio
                $sqlx = "SELECT id_servicio FROM cmx_planilla_detalle1 WHERE id_planilla = :id_estudio";
                $consul = $this->_db3->prepare($sqlx);
                $consul->bindParam(':id_estudio', $datos['id_estudio']);
                $consul->execute();
                $numero_servicio = $consul->fetchAll();

                // Inserción en cmx_cliente_envio
                foreach ($numero_servicio as $value) {
                    $num = $value['id_servicio'];
                    $sqli = "INSERT INTO cmx_cliente_envio (id, estado, fecha, hora, usuario, id_servicio, cod_ini_ruta)
                         VALUES (null, '1', :fecha, :hora, :user, :num, :cod_ini)";
                    $crear = $this->_db3->prepare($sqli);
                    $crear->bindParam(':fecha', $fecha);
                    $crear->bindParam(':hora', $hora);
                    $crear->bindParam(':user', $user);
                    $crear->bindParam(':num', $num);
                    $crear->bindParam(':cod_ini', $numdoc_inicio_ruta);
                    $crear->execute();
                }
            }

            // Puntos de entrega
            if ($datos['pun'] == '2') {

                foreach ($datos['maximo'] as $value) {
                    // Inserción en cmx_ruta_puntosentrega
                    $sql2 = "INSERT INTO cmx_ruta_puntosentrega (id, cod_ini_ruta, municipio_entrega, direccion_entrega, cliente, remesa, fecha_estimada_entrega, observacion, fecha, hora, usuario, hora_estimada, tipo, orden)
                         VALUES (null, :cod_ini, :mentrega, :dire, :cliente, :remesa, :fentrega, :obs, :fecha, :hora, :user, :hora_estimada, :tipo, :orden)";
                    $crearentre = $this->_db3->prepare($sql2);
                    $crearentre->bindParam(':cod_ini', $numdoc_inicio_ruta);
                    $crearentre->bindParam(':mentrega', $datos['mentrega']);
                    $crearentre->bindParam(':dire', $datos['dire']);
                    $crearentre->bindParam(':cliente', $datos['cliente']);
                    $crearentre->bindParam(':remesa', $datos['remesa']);
                    $crearentre->bindParam(':fentrega', $datos['fentrega']);
                    $crearentre->bindParam(':obs', $datos['obs']);
                    $crearentre->bindParam(':fecha', $fecha);
                    $crearentre->bindParam(':hora', $hora);
                    $crearentre->bindParam(':user', $user);
                    $crearentre->bindParam(':hora_estimada', $datos['hora_estimada']);
                    $crearentre->bindParam(':tipo', $datos['tipo']);
                    $crearentre->bindParam(':orden', $datos['orden']);
                    $crearentre->execute();
                }
            }

            // Confirmar transacción
            $this->_db3->commit();

            echo json_encode(['status' => 'success', 'message' => 'Proceso completado exitosamente']);
        } catch (Exception $e) {
            // Revertir cambios en caso de error
            $this->_db3->rollBack();
            echo json_encode(['status' => 'error', 'message' => 'Error: ' . $e->getMessage()]);
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
            if ($result) {
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
        $sql = $this->_db3->prepare("SELECT * FROM cmx_para_novedades_seguimiento WHERE id=:codigo OR novedad=:codigo");
        // $codigo = '%' . $codigo . '%';  // Concatenar los comodines al valor de $codigo
        $sql->bindParam(':codigo', $codigo, PDO::PARAM_STR);
        $sql->execute();
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function Consulta_Manifiestos_Pendientes()
    {
        // $response = [];
        // // $fecha = date('Y-m-d');

        // $sql =  $this->_db3->prepare("SELECT mn.id AS n_manifiesto,
        // mn.placa AS placa_manifiesto,
        // pro.numero_documento,
        // pro.nombre,
        // pro.apellido1,
        // pro.apellido2,
        // ve.placa AS placa_vehiculo,
        // cla.clase,
        // pro.celular,
        // dc.celular2,
        // ve.web_satelital,
        // ve.usuario_satelital,
        // ve.clave_satelital,
        // tra.placa AS placatrailer,
        // mn1.municipio AS origen_final,
        // mn2.municipio AS destino_final,
        // mn.origen_viaje,
        // mn.destino_viaje,
        // mn.tipo_manifiesto,
        // mn.fecha_expedicion,
        // mn.hora_expedicion,
        // mn.manifiesto_itr
        // FROM cmx_manifiesto mn
        // INNER JOIN cmx_manifiesto_estado me ON mn.id = me.id_manifiesto
        // INNER JOIN cmx_municipios mn1 ON mn.origen_viaje = mn1.id
        // INNER JOIN cmx_municipios mn2 ON mn.destino_viaje = mn2.id
        // INNER JOIN cmx_proveedores pro ON pro.numero_documento = mn.conductor_manifiesto
        // INNER JOIN cmx_detalle_conductor dc ON pro.numdoc_nexos = dc.id_proveedor
        // INNER JOIN cmx_vehiculos ve ON mn.placa = ve.placa
        // INNER JOIN cmx_vehiculo2 ve2 ON ve.numdoc_vehiculo = ve2.id_vehiculo
        // INNER JOIN cmx_rndc_clase_vehiculo cla ON cla.id = ve2.clase_vehiculo
        // LEFT JOIN cmx_trailer_vehiculo ti ON ve.numdoc_vehiculo = ti.id_vehiculo AND ti.estado = 1
        // LEFT JOIN cmx_trailer tra ON ti.id_trailer = tra.numdoc_trailer
        // LEFT JOIN cmx_inicio_ruta b ON mn.id = b.num_manifiesto
        // LEFT JOIN cmx_asigancio_cita ac ON mn.id = ac.manifiesto AND ac.confirmacion = 'No Confirmada'
        // WHERE me.estado = 1 AND b.num_manifiesto IS NULL AND mn.manifiesto_itr = 'NO' GROUP BY mn.id ORDER BY mn.id ASC");
        // $sql->execute();
        // $result = $sql->fetchAll(PDO::FETCH_ASSOC);


        // /* Cuando es itr y confirman la cita para poder sacrlos a seguimiento */
        // $sql_valida = $this->_db3->prepare("SELECT mn.id AS n_manifiesto,
        //     mn.placa AS placa_manifiesto,
        //     pro.numero_documento,
        //     pro.nombre,
        //     pro.apellido1,
        //     pro.apellido2,
        //     ve.placa AS placa_vehiculo,
        //     cla.clase,
        //     pro.celular,
        //     dc.celular2,
        //     ve.web_satelital,
        //     ve.usuario_satelital,
        //     ve.clave_satelital,
        //     tra.placa AS placatrailer,
        //     mn1.municipio AS origen_final,
        //     mn2.municipio AS destino_final,
        //     mn.origen_viaje,
        //     mn.destino_viaje,
        //     mn.tipo_manifiesto,
        //     mn.fecha_expedicion,
        //     mn.hora_expedicion,
        //     mn.manifiesto_itr
        // FROM cmx_manifiesto mn
        // INNER JOIN cmx_manifiesto_estado me ON mn.id = me.id_manifiesto
        // INNER JOIN cmx_municipios mn1 ON mn.origen_viaje = mn1.id
        // INNER JOIN cmx_municipios mn2 ON mn.destino_viaje = mn2.id
        // INNER JOIN cmx_proveedores pro ON pro.numero_documento = mn.conductor_manifiesto
        // INNER JOIN cmx_detalle_conductor dc ON pro.numdoc_nexos = dc.id_proveedor
        // INNER JOIN cmx_vehiculos ve ON mn.placa = ve.placa
        // INNER JOIN cmx_vehiculo2 ve2 ON ve.numdoc_vehiculo = ve2.id_vehiculo
        // INNER JOIN cmx_rndc_clase_vehiculo cla ON cla.id = ve2.clase_vehiculo
        // LEFT JOIN cmx_trailer_vehiculo ti ON ve.numdoc_vehiculo = ti.id_vehiculo AND ti.estado = 1
        // LEFT JOIN cmx_trailer tra ON ti.id_trailer = tra.numdoc_trailer
        // LEFT JOIN cmx_inicio_ruta b ON mn.id = b.num_manifiesto
        // LEFT JOIN cmx_asigancio_cita ac ON mn.id = ac.manifiesto AND ac.confirmacion = 'Confirmada'
        // WHERE me.estado = 1 AND b.num_manifiesto IS NULL AND ac.esatdo_cita = 'ACTIVO' AND mn.manifiesto_itr = 'SI' GROUP BY mn.id ORDER BY mn.id ASC");

        // $sql->execute();
        // $result1 = $sql->fetchAll(PDO::FETCH_ASSOC);

        // $response = [
        //     "result" => $result,
        //     "result1" => $result1,
        // ];
        // return $response;

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
    WHERE 
        me.estado = 1 
        AND b.num_manifiesto IS NULL
        AND (
            (mn.manifiesto_itr = 'NO') OR 
            (mn.manifiesto_itr = 'SI' AND ac.confirmacion = 'Confirmada' AND ac.esatdo_cita = 'ACTIVO')
        )
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
}
