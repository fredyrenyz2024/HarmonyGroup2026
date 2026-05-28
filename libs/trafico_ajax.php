<?php
include "../application/Config.php";
include '../application/Conexion.php';
include '../application/Model.php';
session_start();
$Data = new Consultas;

switch ($_REQUEST['action']) {
        //clientes tb principal
    case 'tb_clientes':
        $fi = $_REQUEST["fecha_inicia"];
        $ff = $_REQUEST["fecha_fina"];
        $id = $_REQUEST["idc"];
        $sql = "
			SELECT
				plu.id_servicio AS 'idservicio',plu.orden_cargue,
				plu.remesa,i.id AS 'idruta',pla.placa, tra.placa AS 'placatrailer',
				pro.nombre, se.nombre_cliente, pla.n_manifiesto, pla.fecha_manifiesto,
				i.id, pla.id AS 'idplanilla', pro.numero_documento, cle.estado, cli.id AS 'idcliente'
				FROM cmx_inicio_ruta i
				INNER JOIN cmx_planilla pla
				ON i.id_estudio_seguridad=pla.id
				INNER JOIN cmx_planilla_detalle1 plu
				ON pla.id=plu.id_planilla
				LEFT JOIN cmx_vehiculos v
				ON pla.placa=v.placa
				LEFT JOIN cmx_trailer_vehiculo tv
				ON v.id=tv.id_vehiculo AND tv. estado=1
				LEFT JOIN cmx_trailer tra
				ON tv.id_trailer=tra.id
				INNER JOIN cmx_proveedores pro
				ON i.cond_cedula=pro.numero_documento
				INNER JOIN cmx_solicitud_vehiculo2 se
				ON plu.id_servicio=se.nundoc_solicitud
				INNER JOIN cmx_cliente_envio cle
				ON i.id=cle.cod_ini_ruta AND plu.id_servicio=cle.id_servicio
				INNER JOIN cmx_cotizaciones_serviciocliente co
				ON se.n_cotizacion=co.n_cotizacion
				INNER JOIN cmx_clientes cli
				ON co.nit=cli.documento
				WHERE cli.id=" . $id . " AND
				i.fecha BETWEEN '" . $fi . "' AND '" . $ff . "'
				ORDER BY  i.id DESC
		";

        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;
        //correos enviados al cliente
    case 'consultar_correoenviado':
        $idservi = $_POST["idservi"];
        $idcliente = $_POST["idcliente"];
        $sql = "SELECT a.id_servicio,a.fecha,a.usuario,a.hora,
		b.fecha_inicio, b.fecha_final, b.hora_envio, a.modalidad
		FROM cmx_mail_enviados a
		LEFT JOIN cmx_cliente_hora b
		ON a.id_fecha_parametro=b.id
		WHERE id_servicio=" . $idservi;
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;
        //seguimiento vehicular
    case 'consultar_seguimiento':
        $idservi = $_POST["idservi"];
        $idcliente = $_POST["idcliente"];
        $idruta = $_POST["idruta"];
        $sql = "SELECT se.id,se.tipo_seguimiento,
				se. observacion,
				se.fecha, se.hora, se.usuario,se.reporte_cliente,
				mn.municipio, n.novedad
				FROM
				cmx_inicio_seguimiento se
				LEFT JOIN  cmx_municipios mn
				ON se.detalle_tipo=mn.id
				LEFT JOIN cmx_para_novedades_seguimiento n
				ON se.novedad=n.id
				WHERE se.cod_ini_ruta=" . $idruta . " AND se.reporte_cliente='si';";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;
        //ubicacion actual
    case 'consultar_ubicacion':
        $codinio = $_POST["codini"];
        /*$sql="SELECT * FROM cmx_iniruta_ubicacion
        WHERE cod_ini_ruta=".$codinio;*/
        $sql = "SELECT u.*, s.observacion ,
		CONCAT(m.municipio, '-', m.depto) AS espacio
		FROM cmx_iniruta_ubicacion u
		INNER JOIN cmx_municipios m
		ON u.lugar=m.id
		LEFT JOIN cmx_inicio_seguimiento s
		ON u.id_seguimiento=s.id
		WHERE u.cod_ini_ruta=" . $codinio;
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'consulta_trazabilidad':
        $idcliente = $_POST["idcliente"];
        $fechai = $_POST["fechai"];
        $fechaf = $_POST["fechaf"];
        $sql = "SELECT
		CASE WHEN a.id  IS NULL THEN 0 ELSE a.id END AS 'idcoti' ,
		CASE WHEN a.fecha_creacion IS NULL THEN 0 ELSE a.fecha_creacion END AS 'fechacoti',
		CASE WHEN b.nundoc_solicitud IS NULL THEN 0 ELSE b.id END AS 'idservi',
		CASE WHEN b.fecha IS NULL THEN 0 ELSE b.fecha END AS 'fechaservi',
		CASE WHEN d.id  IS NULL THEN 0 ELSE d.id  END AS 'idsoli',
		CASE WHEN d.fecha_asignacion IS NULL THEN 0 ELSE d.fecha_asignacion END AS 'fechasoli',
		CASE WHEN e.id IS NULL THEN 0 ELSE e.id END AS 	'idestu',
		CASE WHEN e.fecha  IS NULL THEN 0 ELSE e.fecha END AS 'fechaestu',
		CASE WHEN f.id IS NULL THEN 0 ELSE f.id END AS 'idplani',
		CASE WHEN f.fecha IS NULL THEN 0 ELSE f.fecha END AS 'fechaplani',
		CASE WHEN g.id IS NULL THEN 0 ELSE g.id END AS 'idruta',
		CASE WHEN g.fecha IS NULL THEN 0 ELSE g.fecha END AS 'fecharuta',
		CASE WHEN TIMESTAMPDIFF(MINUTE, CONCAT(a.fecha_creacion,' ',a.hora_creacion), CONCAT(b.fecha,' ',b.hora))
		IS NULL THEN 0 ELSE TIMESTAMPDIFF(MINUTE, CONCAT(a.fecha_creacion,' ',a.hora_creacion), CONCAT(b.fecha,' ',b.hora))
		END AS weatherA,
		CASE WHEN TIMESTAMPDIFF(MINUTE, CONCAT(d.fecha_asignacion,' ',d.hora_asignacion), CONCAT(e.fecha,' ',e.hora))
		IS NULL THEN 0 ELSE TIMESTAMPDIFF(MINUTE, CONCAT(d.fecha_asignacion,' ',d.hora_asignacion), CONCAT(e.fecha,' ',e.hora))
		END AS weatherB,
		CASE WHEN TIMESTAMPDIFF(MINUTE, CONCAT(f.fecha,' ',f.hora ), CONCAT(g.fecha,' ',g.hora))
		IS NULL THEN 0 ELSE TIMESTAMPDIFF(MINUTE, CONCAT(f.fecha,' ',f.hora ), CONCAT(g.fecha,' ',g.hora))
		END AS weatherC,
		CASE WHEN  TIMESTAMPDIFF(MINUTE, CONCAT(a.fecha_creacion,' ',a.hora_creacion), CONCAT(g.fecha,' ',g.hora))
		IS NULL THEN 0 ELSE TIMESTAMPDIFF(MINUTE, CONCAT(a.fecha_creacion,' ',a.hora_creacion), CONCAT(g.fecha,' ',g.hora))
		END AS 	weatherD
		FROM  cmx_clientes cl
		LEFT JOIN cmx_cotizaciones_serviciocliente a ON a.nit=cl.documento
		LEFT JOIN cmx_solicitud_vehiculo2 b ON a.n_cotizacion=b.n_cotizacion
		LEFT JOIN cmx_preestudio_solicitudes_servicio c ON b.nundoc_solicitud=c.id_servicio_cliente
		LEFT JOIN cmx_log_solicitudvehiculo2 d ON c.id_solicitudpreestudio=d.id_solictud
		LEFT JOIN cmx_estudio_vehiculo e ON d.id=e.id_solicitud
		LEFT JOIN cmx_planilla f
		LEFT JOIN cmx_inicio_ruta g ON f.id=g.id_estudio_seguridad ON e.id=f.id_estudio
		WHERE cl.id=" . $idcliente . " AND a.fecha_creacion
		BETWEEN '" . $fechai . "' AND '" . $fechaf . "';";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

        //mapa ubicacion
    case 'consulta_puntocontrol':
        $codini = $_POST["codini"];
        //AUTOMÃTICO
        /*$sql="SELECT ru.latitud_origen,ru.latitud_destino,ru.longitud_origen,longitud_destino,
        d.* FROM cmx_inicio_seguimiento s
        INNER  JOIN cmx_planruta_detalle  d
        ON s.detalle_tipo=d.id
        INNER JOIN cmx_plan_ruta pl
        ON d.cod_plan=pl.id
        INNER JOIN cmx_rutas ru
        ON pl.cod_ruta=ru.id
        WHERE s.cod_ini_ruta=".$codini." AND s.tipo_seguimiento IN('punto control','punto geografico')
        AND s.id IN(SELECT MAX(s.id) FROM cmx_inicio_seguimiento s
        INNER  JOIN cmx_planruta_detalle  d
        ON s.detalle_tipo=d.id
        INNER JOIN cmx_plan_ruta pl
        ON d.cod_plan=pl.id
        INNER JOIN cmx_rutas ru
        ON pl.cod_ruta=ru.id
        WHERE s.cod_ini_ruta=".$codini."
        AND s.tipo_seguimiento
        IN('punto control','punto geografico'))";*/
        //MANUAL
        $sql = "SELECT ru.latitud_origen,ru.latitud_destino,
		ru.longitud_origen,ru.longitud_destino,
		a.latitud,a.longitud
		FROM cmx_iniruta_ubicacion a
		INNER JOIN cmx_inicio_ruta b
		ON a.cod_ini_ruta=b.cod_inicio
		INNER JOIN cmx_plan_ruta pl
		ON b.cod_plan=pl.id
		INNER JOIN cmx_rutas ru
		ON pl.cod_ruta=ru.id
		WHERE b.cod_inicio=" . $codini . "
		AND a.id
		IN(SELECT MAX(a.id) FROM cmx_iniruta_ubicacion a
		WHERE a.cod_ini_ruta=" . $codini . ")";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

        //RUTAS

    case 'cargar_origen':
        $sql = "SELECT * FROM cmx_municipios WHERE pais='COLOMBIA'
			AND estado_nacional='Activa'";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'cargar_destino':
        $sql = "SELECT * FROM cmx_municipios WHERE pais='COLOMBIA'
			AND estado_nacional='Activa'";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'solo_una_ruta':
        $origen = $_REQUEST["origen"];
        $destino = $_REQUEST["destino"];
        $sql = "SELECT * FROM cmx_rutas
			WHERE cod_ciudad_origen=" . $origen . "
			AND cod_ciudad_destino=" . $destino . "
			AND estado='habilitado'";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'origeesderuta':
        $sql = "SELECT mun.*
			FROM cmx_municipios mun
			INNER JOIN cmx_rutas rut
			ON mun.id=rut.cod_ciudad_origen
			GROUP BY mun.id
			";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'destinosderuta':
        $sql = "SELECT mun.*
			FROM cmx_municipios mun
			INNER JOIN cmx_rutas rut
			ON mun.id=rut.cod_ciudad_destino
			GROUP BY mun.id
			";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'filtro_rutas':
        $eleccion = $_REQUEST["eleccion"];
        $lugar = $_REQUEST["lugar"];
        if ($eleccion == 'Origen') {
            $sql = "
				SELECT r.*, c1.municipio AS om,c1.depto AS od,
				c2.municipio AS od1 ,c2.depto AS dd
				FROM cmx_rutas AS r
				INNER JOIN cmx_municipios AS c1
				ON r.cod_ciudad_origen=c1.id
				INNER JOIN cmx_municipios AS c2
				ON r.cod_ciudad_destino=c2.id
				WHERE cod_ciudad_origen=" . $lugar . "
				";
        }
        if ($eleccion == 'Destino') {
            $sql = "
				SELECT r.*, c1.municipio AS om,c1.depto AS od,
				c2.municipio AS od1 ,c2.depto AS dd
				FROM cmx_rutas AS r
				INNER JOIN cmx_municipios AS c1
				ON r.cod_ciudad_origen=c1.id
				INNER JOIN cmx_municipios AS c2
				ON r.cod_ciudad_destino=c2.id
				WHERE cod_ciudad_destino=" . $lugar . "
			";
        }
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'lugares':
        $id = $_REQUEST["id"];
        $origen = $_REQUEST["origen"];
        $destino = $_REQUEST["destino"];

        $sql = "
			SELECT ta.*,mun.municipio, mun.depto FROM cmx_rutas ta
			INNER JOIN cmx_municipios mun
			ON ta.cod_ciudad_origen=mun.id
			WHERE ta.id=" . $id . "  ";
        $result = $Data->getConsulta($sql);
        if ($result) {
            $sql2 = "SELECT mun.municipio, mun.depto FROM cmx_rutas ta
				INNER JOIN cmx_municipios mun
				ON ta.cod_ciudad_destino=mun.id
				WHERE ta.id=" . $id . " ";
            $result2 = $Data->getConsulta($sql2);
        }
        //$return["result"] = $result["rowsData"];
        //$return["result2"] = $result2["rowsData"];
        if ($result2 > 1) {
            $return["result"] = $result2["rowsData"];
        } else {
            $return["result"] = $result2;
        }
        break;

    case 'edit_ruta':
        $id = $_REQUEST["id"];
        $origen = $_REQUEST["origen"];
        $destino = $_REQUEST["destino"];

        $sql = "SELECT * FROM cmx_rutas
			WHERE id=" . $id . "";
        $result = $Data->getConsulta($sql);
        //consultar origen
        $sqlo = "
			SELECT * FROM cmx_municipios
		";
        $resultorigen = $Data->getConsulta($sqlo);
        //consultar destino
        $sqld = "
			SELECT * FROM cmx_municipios
		";
        $resultdestino = $Data->getConsulta($sqld);

        $origen = array();
        $destino = array();

        foreach ($resultorigen["rowsData"] as $index => $element1) {
            //origen
            if (strcasecmp($element1['id'], $result["rowsData"][0]['cod_ciudad_origen']) == 0) {

                $origen[$index]['selected'] = true;
            } else {
                $origen[$index]['selected'] = false;
            }

            $origen[$index]['mun_origen'] = $element1["municipio"];
            $origen[$index]['dep_origen'] = $element1["depto"];
            $origen[$index]['id_origen'] = $element1["id"];

            foreach ($resultdestino["rowsData"] as $index => $element2) {
                if (strcasecmp($element2['id'], $result["rowsData"][0]["cod_ciudad_destino"]) == 0) {
                    $destino[$index]['selected'] = true;
                } else {
                    $destino[$index]['selected'] = false;
                }
                $destino[$index]['mun_destino'] = $element2["municipio"];
                $destino[$index]['dep_destino'] = $element2["depto"];
                $destino[$index]['id_destino'] = $element2["id"];
            }
        }
        $result["rowsData"][0]['cod_ciudad_origen'] = $origen;
        $result["rowsData"][0]['cod_ciudad_destino'] = $destino;
        //$return["result"] = $result["rowsData"];
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

        //PLANES RUTA

    case 'consultar_punto':
        $sql = "
			SELECT rut.cod_ciudad_origen, mun.municipio, mun.depto
			 FROM cmx_rutas rut
			INNER JOIN cmx_municipios mun
			ON rut.cod_ciudad_origen=mun.id
			WHERE rut.estado='habilitado'
			GROUP BY rut.cod_ciudad_origen
			";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'consultar_punto2':
        $origen = $_REQUEST["origen"];
        $sql = "
			SELECT rut.cod_ciudad_destino, mun.municipio, mun.depto
			FROM cmx_rutas rut
			INNER JOIN cmx_municipios mun
			ON rut.cod_ciudad_destino=mun.id
			WHERE rut.estado='habilitado'
			AND cod_ciudad_origen=" . $origen . "
			";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'filtro_planes':
        $origen_ruta = $_REQUEST["origen_ruta"];
        $destino_ruta = $_REQUEST["destino_ruta"];
        // $sql="SELECT ru.id as idruta, ru.*,pl.*
        //     FROM cmx_rutas ru
        //         INNER JOIN cmx_plan_ruta pl
        //         ON ru.id=pl.cod_ruta
        //         WHERE ru.cod_ciudad_origen=".$origen_ruta."
        //         AND ru.cod_ciudad_destino=".$destino_ruta." ";

        $sql = "
			SELECT ru.id AS idruta, ru.*,pl.*,
			CONCAT(c1.municipio,'-',c1.depto) AS o,
			CONCAT(c2.municipio,'-',c2.depto) AS d
			FROM cmx_rutas AS ru
			INNER JOIN cmx_plan_ruta AS pl
			ON ru.id=pl.cod_ruta
			INNER JOIN cmx_municipios AS c1
			ON ru.cod_ciudad_origen=c1.id
			INNER JOIN cmx_municipios AS c2
			ON ru.cod_ciudad_destino=c2.id
			WHERE ru.cod_ciudad_origen=" . $origen_ruta . "
			AND ru.cod_ciudad_destino=" . $destino_ruta . ";
		";

        // echo $sql;
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'puntos_deruta':
        $idplan = $_REQUEST["idplan"];
        $sql = "SELECT r.*, mun.municipio, mun.depto
			FROM cmx_planruta_detalle r
			INNER JOIN cmx_municipios mun
			ON r.cod_ciudad=mun.id
			WHERE r.cod_plan=" . $idplan . "
			AND r.tipo_punto='punto control'";

        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        $sql2 = "SELECT r.*, mun.municipio, mun.depto
			FROM cmx_planruta_detalle r
			INNER JOIN cmx_municipios mun
			ON r.cod_ciudad=mun.id
			WHERE r.cod_plan=" . $idplan . "
			AND r.tipo_punto='punto geografico'
			ORDER BY r.orden";
        $result2 = $Data->getConsulta($sql2);
        $return["result2"] = $result2["rowsData"];
        break;

    case 'puntos_derutae':
        $idplan = $_REQUEST["idplan"];
        $sql = "SELECT r.*,
		p.nombre_plan ,p.observacion,p.estado as pes,
		 mun.municipio, mun.depto
			FROM cmx_planruta_detalle r
			INNER JOIN cmx_municipios mun
			ON r.cod_ciudad=mun.id
			INNER JOIN cmx_plan_ruta p
			ON r.cod_plan=p.cod_plan
			WHERE r.cod_plan=" . $idplan . "
			ORDER BY r.orden";
        // echo $sql;
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        break;

    case 'traer_ciudad':
        $sql = "
		SELECT * FROM cmx_municipios
		WHERE pais='COLOMBIA'   ";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'consulta_puntos':
        $id_ciudad = $_POST["id_ciudad"];
        $sql = "SELECT r.id, mr.municipio,mr.depto, r.nom_punto,
			r.latitud, r.longitud, r.estado
			FROM  cmx_para_punto_ruta r
			INNER JOIN cmx_municipios mr
			ON r.cod_ciudad=mr.id
			WHERE cod_ciudad=" . $id_ciudad;
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'consulta_base':
        $sql = "SELECT id, municipio, depto
			FROM cmx_municipios
			WHERE 	pais='COLOMBIA'";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'consultar_punto_para':
        $id_punto = $_POST['id_punto'];
        $sql = "SELECT r.id, mr.id as id_muni, mr.municipio,mr.depto, r.nom_punto,
			r.latitud, r.longitud, r.estado, r.descripcion_punto
			FROM  cmx_para_punto_ruta r
			INNER JOIN cmx_municipios mr
			ON r.cod_ciudad=mr.id
			WHERE r.id=" . $id_punto;
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

        //INCIO RUTA

    case 'consulta_conductor':
        $cc = $_REQUEST["cc"];
        $sql = "
				SELECT p.nombre FROM cmx_proveedores p
				INNER JOIN cmx_actividad_proveedor a
				ON p.id=a.id_proveedor
				WHERE a.actividad='Conductor'
				AND p.numero_documento=" . $cc . "
		";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'consulta_placa':
        $pla = $_REQUEST["plak"];
        $sql = "
			SELECT t.nombre FROM cmx_vehiculos v
			INNER JOIN cmx_para_tipo_vehiculo t
			ON v.tipo_vehiculo=t.id
			WHERE placa='" . $pla . "'
		";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'consultar_punti':
        $sql = "
			SELECT rut.cod_ciudad_origen, mun.municipio, mun.depto
			 FROM cmx_rutas rut
			INNER JOIN cmx_municipios mun
			ON rut.cod_ciudad_origen=mun.id
			WHERE rut.estado='habilitado'
			GROUP BY rut.cod_ciudad_origen
			";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'tplan':
        $origen_ruta = $_REQUEST["origen_ruta"];
        $destino_ruta = $_REQUEST["destino_ruta"];
        $sql = "
			SELECT pl.cod_plan ,pl.nombre_plan,
			mn1.municipio as origen,
			mn2.municipio as destino,
			ru.km_tot_ruta, pl.observacion
			FROM cmx_rutas AS ru
			INNER JOIN cmx_plan_ruta AS pl ON ru.id=pl.cod_ruta
			INNER JOIN cmx_municipios mn1 ON ru.cod_ciudad_origen=mn1.id
			INNER JOIN cmx_municipios mn2 ON ru.cod_ciudad_destino=mn2.id
			WHERE ru.cod_ciudad_origen=" . $origen_ruta . "
			AND ru.cod_ciudad_destino=" . $destino_ruta . "
			AND pl.estado='Activo'";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'cargue':
        $sql = "
			SELECT id, CONCAT(municipio,'-',depto) AS t FROM cmx_municipios
			WHERE pais='COLOMBIA'";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'traer_ciudade':
        $sql = "
			SELECT * FROM cmx_municipios
			WHERE pais='COLOMBIA'
		";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'cliente':
        /*$sql="SELECT id, nombre
        FROM cmx_clientes";*/
        $placa = $_REQUEST["placa"];
        $sql = "SELECT c.nit, c.digito, c.nombre_cliente , cl.id
				FROM cmx_solicitudes_preestudio sp
				INNER JOIN cmx_preestudio_solicitudes_servicio p
				ON sp.id_preestudio=p.id_solicitudpreestudio
				INNER JOIN cmx_solicitud_vehiculo2 se
				ON p.id_servicio_cliente=se.nundoc_solicitud
				INNER JOIN cmx_cotizaciones_serviciocliente c
				ON se.n_cotizacion=c.n_cotizacion
				INNER JOIN cmx_clientes cl
				ON c.nit=cl.documento
				WHERE sp.placa='" . $placa . "'";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'tabla_inicio':
        $filtro = $_REQUEST["filtro"];
        $num_mnf = $_REQUEST["num_mnf"];
        $fi = $_REQUEST["fi"];
        $ff = $_REQUEST["ff"];

        if ($filtro == 1) {
            $sql = "SELECT r.*, p.nombre,
				p.apellido1, p.apellido2,
				 e.estado
				FROM cmx_inicio_ruta r
				INNER JOIN cmx_proveedores p
				ON r.cond_cedula=p.numero_documento
				INNER JOIN cmx_inici_manifiesto_estado e
				ON r.cod_inicio=e.cod_ini_ruta
				WHERE r.num_manifiesto=" . $num_mnf . "
				GROUP BY r.cod_inicio";
        }

        if ($filtro == 2) {
            $sql = "
				SELECT r.*, p.nombre,
				p.apellido1, p.apellido2,
				 e.estado
				FROM cmx_inicio_ruta r
				INNER JOIN cmx_proveedores p
				ON r.cond_cedula=p.numero_documento
				INNER JOIN cmx_inici_manifiesto_estado e
				ON r.cod_inicio=e.cod_ini_ruta
				WHERE r.fecha
				BETWEEN '" . $fi . "' AND '" . $ff . "'
				GROUP BY r.cod_inicio";
        }
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'estado_select':
        $actual = $_REQUEST["actual"];
        if ($actual == '2') { //enturnado
            $sql = "
				SELECT id,estado
				FROM cmx_estado_segui
				WHERE id   IN (3)
			";
        }
        if ($actual == '3') { //cargue
            $sql = "
				SELECT id,estado
				FROM cmx_estado_segui
				WHERE id   IN (5);
			";
        }
        if ($actual == '5') { //en ruta
            $sql = "
				SELECT id,estado
				FROM cmx_estado_segui
				WHERE id   IN (4);
			";
        }
        if ($actual == '4') { //descargue
            $sql = "
				SELECT id,estado
				FROM cmx_estado_segui
				WHERE id  IN (8);
			";
        }
        if ($actual == '8') { //devolucion
            $sql = "
				SELECT id,estado
				FROM cmx_estado_segui
				WHERE id   IN (6);
			";
        }
        if ($actual == '7') { //cumplido entregado
            $sql = "
				SELECT id,estado
				FROM cmx_estado_segui
			";
        }
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'puntos_decontrol':
        $idplan = $_REQUEST["idplan"];

        $sql = "
			SELECT r.*, mun.municipio, mun.depto,
			pr.nombre_plan, CONCAT(CI.municipio,'-',CI.depto) AS origen,
			CONCAT(C2.municipio,'-',C2.depto) AS destino
			FROM cmx_planruta_detalle r
			INNER JOIN cmx_municipios mun
			ON r.cod_ciudad=mun.id
			INNER JOIN cmx_plan_ruta pr
			ON r.cod_plan=pr.cod_plan
			INNER JOIN cmx_rutas ru
			ON pr.cod_ruta=ru.id
			INNER JOIN cmx_municipios CI
			ON ru.cod_ciudad_origen=CI.id
			INNER JOIN cmx_municipios C2
			ON ru.cod_ciudad_destino=C2.id
			WHERE pr.cod_plan=" . $idplan . "
		";
        // echo $sql;
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'punto_entrega':
        $codini = $_REQUEST["codini"];
        $idplan = $_REQUEST["idplan"];
        $num_manifiesto = $_REQUEST["planilla"];

        //inicio de ruta
        $sql2 = "SELECT * FROM cmx_inicio_ruta
			WHERE cod_inicio=" . $codini . "";
        $result = $Data->getConsulta($sql2);
        $return["result"] = $result["rowsData"];
        //datos del plan
        $sql3 = "SELECT d.* , mn.municipio, mn.depto, p.*
			FROM cmx_plan_ruta p
			INNER JOIN cmx_planruta_detalle d
			ON p.cod_plan=d.cod_plan
			INNER JOIN cmx_municipios mn
			ON d.cod_ciudad=mn.id
			WHERE p.cod_plan=" . $idplan . "";
        $result3 = $Data->getConsulta($sql3);
        $return["result3"] = $result3["rowsData"];
        //remesas
        $sql4 = "SELECT oc.id, a.id AS idrem,
			cli.nombre AS 'remite',
			clid.nombre AS 'destino',
			oc.mer_producto, oc.ca_pesocargue
			FROM cmx_remesa a
			INNER JOIN cmx_remesa_ordencargue ro
			ON a.id=ro.id_remesa
			INNER JOIN cmx_orden_cargue oc
			ON ro.id_orden_cargue=oc.id
			INNER JOIN cmx_ruta_puntosentrega rr
			ON oc.id_remitente=rr.id
			INNER JOIN cmx_remitente_destinatario cli
			ON rr.cliente=cli.id
			INNER JOIN cmx_destinatarios_ss destinat
			ON oc.mer_idservicio=destinat.solicitud_servicio
			AND rr.id_punto=destinat.id_punto
			INNER JOIN cmx_remitente_destinatario clid
			ON destinat.cliente=clid.id
			INNER JOIN cmx_manifiesto_remesa b
			ON a.id=b.id_remesa
			WHERE b.id_manifiesto=" . $num_manifiesto;
        $result4 = $Data->getConsulta($sql4);
        $return["result4"] = $result4["rowsData"];

        //puntos de entrega
        $sql6 = "
		SELECT ser.id, pe.direccion_entrega,
			pe.fecha_estimada_entrega,
			pe.observacion,
			pe.hora_estimada,
			pe.telefono,
			pe.lugar,
			mn1.municipio, mn1.depto,
			remdes.nombre AS cliente
			FROM cmx_manifiesto mnf
			INNER JOIN cmx_manifiesto_remesa mr
			ON mnf.id=mr.id_manifiesto
			LEFT JOIN cmx_remesa_ordencargue rmo
			ON mr.id_remesa=rmo.id_remesa
			AND mr.estado=1 AND rmo.estado=1
			LEFT JOIN cmx_orden_cargue oc
			ON rmo.id_orden_cargue=oc.id
			LEFT JOIN cmx_solicitud_vehiculo2  ser
			ON oc.mer_idservicio=ser.nundoc_solicitud
			LEFT JOIN cmx_destinatarios_ss pe
			ON ser.id=pe.solicitud_servicio
			LEFT JOIN cmx_municipios mn1
			ON pe.municipio_entrega=mn1.id
			LEFT JOIN cmx_remitente_destinatario remdes
			ON pe.cliente=remdes.id
			WHERE mnf.id=" . $num_manifiesto . "
			GROUP BY pe.solicitud_servicio
			";
        $result6 = $Data->getConsulta($sql6);
        $return["result6"] = $result6["rowsData"];
        if ($result6 > 1) {
            $return["result6"] = $result6["rowsData"];
        } else {
            $return["result6"] = $result6;
        }
        break;

    case 'status_iruta':
        $id = $_REQUEST["codini"];
        $sql = "SELECT * FROM cmx_inici_manifiesto_estado
				WHERE cod_ini_ruta=" . $id . "  ";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

        //seguimiento
    case 'puntos_controls':
        $idplan = $_REQUEST["idplan"];
        // $sql="SELECT r.*, mun.municipio, mun.depto
        //     FROM cmx_planruta_detalle r
        //     INNER JOIN cmx_municipios mun
        //     ON r.cod_ciudad=mun.id
        //     WHERE cod_plan=".$idplan." ";

        $sql = "
			SELECT r.*, mun.municipio, mun.depto,
			pr.nombre_plan, CONCAT(CI.municipio,'-',CI.depto) AS origen,
			CONCAT(C2.municipio,'-',C2.depto) AS destino
			FROM cmx_planruta_detalle r
			INNER JOIN cmx_municipios mun
			ON r.cod_ciudad=mun.id
			INNER JOIN cmx_plan_ruta pr
			ON r.cod_plan=pr.cod_plan
			INNER JOIN cmx_rutas ru
			ON pr.cod_ruta=ru.id
			INNER JOIN cmx_municipios CI
			ON ru.cod_ciudad_origen=CI.id
			INNER JOIN cmx_municipios C2
			ON ru.cod_ciudad_destino=C2.id
			WHERE pr.cod_plan=" . $idplan . "
		";
        // echo $sql;
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'consultar_seguimientos':
        $idmani = $_POST["idmani"];
        $sql = "
			SELECT tipo_contacto, tipo_seguimiento,
				tipo_proceso,observacion, CONCAT(mn.municipio,'-',mn.depto) as lugar
			 FROM cmx_inicio_seguimiento  s
			 LEFT JOIN cmx_municipios mn
			 ON s.detalle_tipo=mn.id
			 WHERE s.cod_man_estado=" . $idmani . "
		";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

        //AGENCIAS

    case 'validar_creacion':
        $age = $_REQUEST["age"];
        $usu = $_REQUEST["usu"];
        $fcha = $_REQUEST["fcha"];
        $hr = $_REQUEST["hr"];
        $user_creador = $_REQUEST["user_creador"];

        if ($age != '5') {
            $sql3 = "SELECT *
			FROM cmx_agencia_usuario
			WHERE id_usuario=" . $usu . "  AND id_agencia=" . $age . " ";
            $result = $Data->getConsulta($sql3);
        }
        if ($result) {
            $filas  = $result["rowsNum"];
            //$datos_grupo = $result ->fetch();
            $return["result"] = false;
        } else {
            $filas = 0;
            $return["result"] = true;
        }
        /*
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }*/

        break;

    case 'traer_usuarios':

        $sql = "SELECT id,nom_usuario,user_log
			FROM cmx_usuarios
			WHERE estado=1 ORDER BY nom_usuario ASC";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        break;

    case 'buscar_agencias':
        $id_usuario = $_REQUEST["usu"];
        $sql = "SELECT a.nombre, au.estado FROM cmx_agencias a
			LEFT JOIN cmx_agencia_usuario au
			ON a.id=au.id_agencia
			WHERE au.id_usuario=" . $id_usuario . " ";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'traer_agencia':
        $sql = "SELECT id,nombre
				FROM cmx_agencias
				WHERE estado='Activo'";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'accion_agencia':
        $id_agencia_usuario = $_REQUEST["id_agencia_usuario"];
        $estado = $_REQUEST["estado"];
        //estado actual de la agencia asociada al usuario
        if ($estado == 'Activo') {
            $sql = "
				UPDATE cmx_agencia_usuario
				SET estado='Inactivo'
				WHERE id=" . $id_agencia_usuario . "   ";
            $result = $Data->ejecuteRegistro($sql);
            if ($result > 1) {
                $return["result"] = $result["rowsData"];
            } else {
                $return["result"] = $result;
            }
        }
        if ($estado == 'Inactivo') {
            $sql = "
				UPDATE cmx_agencia_usuario
				SET estado='Activo'
				WHERE id=" . $id_agencia_usuario . "";
            $result = $Data->ejecuteRegistro($sql);
            if ($result > 1) {
                $return["result"] = $result["rowsData"];
            } else {
                $return["result"] = $result;
            }
        }
        //$return["result"] = $result["rowsData"];
        break;

    case 'agencias_usuario':
        $id_usuario = $_REQUEST["id_usuario"];
        $sql = "
			SELECT a.*, u.nom_usuario,
			b.nombre
			 FROM cmx_agencia_usuario a
			INNER JOIN cmx_usuarios u
			ON a.id_usuario=u.id
			INNER JOIN cmx_agencias b
			ON a.id_agencia=b.id
			WHERE u.id=" . $id_usuario . "
		";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'usuario_agencia':
        $age = $_REQUEST["age"];
        $usu = $_REQUEST["usu"];
        $fcha = $_REQUEST["fcha"];
        $hr = $_REQUEST["hr"];
        $user_creador = $_REQUEST["user_creador"];
        /*if ($age == '5') {
            //traer todas las agencias activas excepto la que es todos
            $sql1 = "
				SELECT id FROM cmx_agencias WHERE NOT id='5'
			";
            $resultv = $Data->getConsulta($sql1);
            foreach ($resultv["rowsData"] as $index => $element) {

                $id_agencia = $element['id'];
                $sql = "INSERT INTO cmx_agencia_usuario
					(id,id_usuario,id_agencia,estado,fecha,hora,usuario)
					VALUES(NULL," . $usu . "," . $id_agencia . ",'Activo','" . $fcha . "','" . $hr . "','" . $user_creador . "');";
                $result = $Data->ejecuteRegistro($sql);
            }
        }*/
        if ($age != '5') {
            //echo 'es diferente a todos';
            $sql = "INSERT INTO cmx_agencia_usuario
			(id,id_usuario,id_agencia,estado,fecha,hora,usuario)
			VALUES(NULL," . $usu . "," . $age . ",'Activo','" . $fcha . "','" . $hr . "','" . $user_creador . "');";
            $result = $Data->ejecuteRegistro($sql);
        }
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        /*$sql="INSERT INTO  cmx_usuario_clienten
        (id,cod_usuario,cod_cliente,fecha,hora,usuario)VALUES(null,'$cli','$usu','$fcha','$hr','$user_creador')"; */
        //$return["result"] = $result["rowsData"];
        break;

    case 'pintar_pc':
        $idplan = $_REQUEST["idplan"];
        $sql = "
			SELECT r.*, ru.cod_ciudad_origen, ru.cod_ciudad_destino,
				mun.municipio, mun.depto,
				pr.nombre_plan, CONCAT(CI.municipio,'-',CI.depto) AS origen,
				CONCAT(C2.municipio,'-',C2.depto) AS destino
				FROM cmx_planruta_detalle r
				INNER JOIN cmx_municipios mun
				ON r.cod_ciudad=mun.id
				INNER JOIN cmx_plan_ruta pr
				ON r.cod_plan=pr.cod_plan
				INNER JOIN cmx_rutas ru
				ON pr.cod_ruta=ru.id
				INNER JOIN cmx_municipios CI
				ON ru.cod_ciudad_origen=CI.id
				INNER JOIN cmx_municipios C2
				ON ru.cod_ciudad_destino=C2.id
				WHERE pr.cod_plan=" . $idplan . "
		";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'pintar_pe':
        $ini = $_REQUEST["codini"];
        $sql = "
			SELECT r.*,
		CONCAT(mun.municipio,'-',mun.depto) AS entrega,
		CONCAT(C1.municipio,'-',C1.depto) AS origen,
		CONCAT(C2.municipio,'-',C2.depto) AS destino,
		ru.cod_ciudad_origen, ru.cod_ciudad_destino
		FROM cmx_ruta_puntosentrega r
		INNER JOIN cmx_municipios mun
		ON r.municipio_entrega=mun.id
		INNER JOIN cmx_inicio_ruta a
		ON r.cod_ini_ruta=a.cod_inicio
		INNER JOIN cmx_plan_ruta p
		ON a.cod_plan=p.cod_plan
		INNER JOIN cmx_rutas ru
		ON p.cod_ruta=ru.id
		INNER JOIN cmx_municipios C1
		ON ru.cod_ciudad_origen=C1.id
		INNER JOIN cmx_municipios C2
		ON ru.cod_ciudad_destino=C2.id
		WHERE r.cod_ini_ruta=" . $ini . "
		";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        break;

    case 'estado_max':
        $id = $_REQUEST["id"];
        // $sql="SELECT e.estado
        // FROM cmx_inici_manifiesto_estado e
        // WHERE e.cod_ini_ruta=".$id." AND e.ultimo_estado=1 ";
        $sql = "
				SELECT e.estado, s.estado as letra
				FROM cmx_inici_manifiesto_estado e
				INNER JOIN  cmx_estado_segui s
				ON e.estado=s.id
				WHERE e.cod_ini_ruta=" . $id . "
				 AND e.ultimo_estado=1
		";

        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'valida_puntoc':
        $punto = $_REQUEST["punto"];
        $sql = "
			SELECT COUNT(detalle_tipo) AS numero
			FROM cmx_inicio_seguimiento
			WHERE 	tipo_seguimiento='punto control'
			AND detalle_tipo=" . $punto . "
		";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'detalle_point':
        $idpunto = $_REQUEST["idpunto"];
        $sql = "
			SELECT d.*,
			CONCAT(m.municipio,'-',m.depto) AS ciu
				FROM cmx_planruta_detalle d
				INNER JOIN cmx_municipios m
				ON d.cod_ciudad = m.id
				WHERE d.id=" . $idpunto . "
		";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'valida_puntoe':
        $identrega = $_REQUEST["identrega"];
        $sql = "SELECT COUNT(detalle_tipo) AS numero
			FROM cmx_inicio_seguimiento
			WHERE 	tipo_seguimiento='punto entrega'
			AND detalle_tipo=" . $identrega . " ";
        // echo $sql;
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'point_entrega':
        $pe = $_REQUEST["pe"];
        $sql = "
			SELECT e.*, CONCAT(mn.municipio,'-',mn.depto) AS ciu_entrega,
			cl.nombre, CONCAT(cl.documento,'-',cl.digito_verificacion) AS cli
			FROM cmx_ruta_puntosentrega e
			INNER JOIN cmx_municipios mn
			ON e.municipio_entrega=mn.id
			INNER JOIN cmx_clientes cl
			ON e.cliente=cl.id
			WHERE e.id=" . $pe . "
		";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'destino_pc':
        $idplan = $_REQUEST["idplan"];
        $sql = "
			SELECT CONCAT(ci.municipio,'-',ci.depto) AS des
			FROM cmx_plan_ruta pl
			INNER JOIN cmx_rutas ru
			ON pl.cod_plan=ru.id
			INNER JOIN cmx_municipios ci
			ON ru.cod_ciudad_destino=ci.id
			WHERE pl.id=" . $idplan . "
		";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

        //iniciar ruta

    case 'cliente_puntos':
        $cliente = $_POST["cliente"];
        $destino_rndc = $_POST["destino"];
        
        $sql = "SELECT re.id, re.nombre, mn.municipio,mn.depto FROM cmx_clientes cl
		INNER JOIN cmx_remitente_destinatario re ON cl.id=re.id_cliente
		INNER JOIN cmx_municipios mn ON re.id_ciudad=mn.id
		WHERE cl.id='" . $cliente . "' AND mn.rndc_codigo_ciudad=" . $destino_rndc . "
		ORDER BY re.nombre ASC";
        //WHERE cl.nombre='" . $cliente . "' AND mn.rndc_codigo_ciudad=" . $origen_rndc . "
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;
        //primer remitente de la solicitud de servicio debe contener la ciudad de origen
        
    case 'cliente_puntos1':
        $cliente = $_POST["cliente"];
        $origen_rndc = $_POST["origen"];

        $sql = "SELECT re.id, re.nombre, mn.municipio,mn.depto FROM cmx_clientes cl
		INNER JOIN cmx_remitente_destinatario re ON cl.id=re.id_cliente
		INNER JOIN cmx_municipios mn ON re.id_ciudad=mn.id
		WHERE cl.id='" . $cliente . "' AND mn.rndc_codigo_ciudad=" . $origen_rndc . "
		ORDER BY re.nombre ASC";
        //WHERE cl.nombre='" . $cliente . "'
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'num_iniruta':
        $sql = "SELECT max(cod_inicio)+1 AS nco FROM cmx_inicio_ruta";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'consultar_puntosentrega':
        $id = $_POST["manifiesto"];
        $sql = "SELECT ser.nundoc_solicitud, pe.direccion_entrega,
			pe.fecha_estimada_entrega,
			pe.observacion,
			pe.hora_estimada,
			pe.telefono,
			pe.lugar,
			mn1.municipio, mn1.depto,
			remdes.nombre, remdes.id AS iddesti
			FROM cmx_manifiesto mnf
			INNER JOIN cmx_manifiesto_remesa mr ON mnf.id=mr.id_manifiesto
			LEFT JOIN cmx_remesa_ordencargue rmo ON mr.id_remesa=rmo.id_remesa AND mr.estado=1 AND rmo.estado=1
			LEFT JOIN cmx_orden_cargue oc ON rmo.id_orden_cargue=oc.id
			LEFT JOIN cmx_solicitud_vehiculo2  ser ON oc.mer_idservicio=ser.nundoc_solicitud
			LEFT JOIN cmx_destinatarios_ss pe ON ser.nundoc_solicitud=pe.solicitud_servicio
			LEFT JOIN cmx_municipios mn1 ON pe.municipio_entrega=mn1.id
			LEFT JOIN cmx_remitente_destinatario remdes ON pe.cliente=remdes.id
			WHERE mnf.id=" . $id . " GROUP BY pe.solicitud_servicio";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'consultar_grupoclientes':
        $id = $_POST["id"];
        $sql = "SELECT gc.*, gs.id_servicio
			FROM cmx_manifiesto mnf
			INNER JOIN cmx_manifiesto_remesa mr
			ON mnf.id=mr.id_manifiesto
			LEFT JOIN cmx_remesa_ordencargue rmo
			ON mr.id_remesa=rmo.id_remesa
			AND mr.estado=1 AND rmo.estado=1
			LEFT JOIN cmx_orden_cargue oc
			ON rmo.id_orden_cargue=oc.id
			LEFT JOIN cmx_solicitud_vehiculo2  ser
			ON oc.mer_idservicio=ser.nundoc_solicitud
			LEFT JOIN cmx_grupocliente_servicio gs
			ON ser.id=gs.id_servicio
			LEFT JOIN cmx_grupo_contacto_cliente gc
			ON gs.id_grupo=gc.idgrupo
			WHERE mnf.id=" . $id . "
			GROUP BY rmo.id_orden_cargue";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'borrar_puntocontrols':
        $id = $_POST["idtb"];
        $sql = "DELETE FROM cmx_planruta_detalle
			WHERE id=" . $id . "";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'borrar_puntogeografico':
        $id = $_POST["idtb"];
        $sql = "DELETE FROM cmx_planruta_detalle
			WHERE id=" . $id . "";
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'consultar_remesas':
        $id = $_POST["manifiesto"];
        $sql = "
			SELECT rem.id, ro.id_orden_cargue,
			b.tipo_mercancia,
			rem.cantidad_real_cargada,
			cli.nombre as remitente,
			clid.nombre as destinatario,
			rem.fecha_creacion
			FROM cmx_remesa  rem
			INNER JOIN cmx_manifiesto_remesa mnf
			ON rem.id=mnf.id_remesa
			LEFT JOIN cmx_remesa_ordencargue ro
			ON rem.id=ro.id_remesa
			LEFT JOIN cmx_orden_cargue oc
			ON ro.id_orden_cargue=oc.id
			-- remitente
			INNER JOIN cmx_ruta_puntosentrega rr
			ON oc.id_remitente=rr.id
			INNER JOIN cmx_remitente_destinatario cli
			ON rr.cliente=cli.id
			-- destinatario
			INNER JOIN cmx_destinatarios_ss rd
			ON rem.id_destinatario=rd.id
			INNER JOIN cmx_remitente_destinatario clid
			ON rd.cliente=clid.id
			LEFT JOIN cmx_solicitud_vehiculo2 ser
			ON oc.mer_idservicio=ser.nundoc_solicitud
			LEFT JOIN cmx_detalle_mercancia2 b
			ON ser.idpareja_origen_destino=b.id
			WHERE mnf.id_manifiesto=" . $id;
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }

        //TABLA DE PRECINTOS PARA ORDEN DE CARGUE
        $sql2 = "SELECT * FROM cmx_planilla_detalle2
			WHERE id_planilla=" . $id . "";
        $result2 = $Data->getConsulta($sql2);
        if ($result2 > 1) {
            $return["result2"] = $result2["rowsData"];
        } else {
            $return["result2"] = $result2;
        }

        break;

    case 'cordenadas_municipios':
        $id = $_POST["id"];
        $sql = "SELECT
			latitud, longitud
			FROM cmx_municipios
			WHERE id=" . $id;
        $result = $Data->getConsulta($sql);
        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        break;

    case 'maestro_detalle_ruta':
        $sql = "SELECT numero_actual FROM cmx_maestro WHERE tipo='DET_RUTA'";
        $result = $Data->getConsulta($sql);
        if ($result) {
            $numeracion = $result["rowsData"][0]['numero_actual'] + 1;
            $sql2 = "UPDATE cmx_maestro SET numero_actual=" . $numeracion . " WHERE tipo='DET_RUTA'";
            $result2 = $Data->ejecuteRegistro($sql2);
            if ($result2) {
                $return["result"] = $result["rowsData"];
            } else {
                $return["result"] = null;
            }
        }
        break;
}





/*
if ($return["result"] > 1) {
    $return["result"] = $result["rowsData"];
} else {
    $return["result"] = $result;
}*/

echo json_encode($return);
