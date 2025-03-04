<?php
include "../application/Config.php";
include '../application/Conexion.php';
include '../application/Model.php';
// $Prefiltro = new servicioclienteModel;
$Data = new Consultas;
$facil = new Conexion;

switch ($_REQUEST['action']) {
        //cargar campos en el modal crear vehiculo
    case 'verificar':
        $confi = $_REQUEST["confi"];
        $sql = "SELECT nombre FROM cmx_rndc_vehiculos_configuracion
				WHERE id=" . $confi . " ";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'tipo_color':
        $sql = "SELECT * FROM cmx_rndc_vehiculos_color
			WHERE estado=1
			ORDER BY color ASC, rndc_id DESC
			LIMIT 12000";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'cambiocolour':
        $color = $_REQUEST["color"];
        $sql = 'SELECT * FROM cmx_rndc_vehiculos_color
			WHERE color="' . $color . '"';
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'tipo_marca':
        $sql = "SELECT * FROM cmx_rndc_vehiculos_marcas
			 WHERE estado=1
		 	ORDER BY marca ASC";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'cambiomarca':
        $marca = $_REQUEST["marca"];
        $sql = 'SELECT * ,
		m.id as id_marca_pk,
		m.rndc_id as rndc_marca,
		cvl.id as id_line
		FROM cmx_rndc_vehiculos_marcas m
			LEFT JOIN cmx_rndc_vehiculos_linea cvl
			ON m.rndc_id=cvl.id_marca
			WHERE m.id=' . $marca . ' ORDER BY cvl.descripcion ASC';
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'consulta_lineas':
        $marcalin = $_POST["marcalin"];
        $sql = "SELECT lni.*
		FROM cmx_rndc_vehiculos_linea lni
		INNER JOIN cmx_rndc_vehiculos_marcas mca
		ON lni.id_marca=mca.rndc_id
		WHERE mca.id=" . $marcalin;
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'clase_vehiculo':
        $sql = "SELECT  * FROM cmx_rndc_clase_vehiculo
		ORDER BY clase ASC";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'tipo_carroceria':
        //$sql="SELECT  * FROM cmx_rndc_tipo_carroceria";
        $sql = "SELECT * FROM cmx_rndc_vehiculos_carroceria WHERE estado=1 ORDER BY descripcion ASC";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'TraerSatelital':
        $placa = $_REQUEST["placa"];
        $sql = " SELECT
	                *
	            FROM cmx_vehiculos_preestudio cv

	            WHERE
	            cv.placa_vehiculo='" . $placa . "' ";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'confi_vehiculo':
        $cabezote = $_POST["cabezote"];
        $trailer = $_POST["trailer"];
        if ($trailer != 'NA') {

            $sql = "SELECT id,rndc_id,nombre,descripcion FROM cmx_rndc_vehiculos_configuracion WHERE nombre=
			(
			SELECT  CONCAT(confv.nombre,'',cont.nombre) AS conffinal
			FROM cmx_rndc_vehiculos_configuracion cont
			INNER JOIN cmx_trailer tra
			ON cont.id=tra.configuracion
			INNER JOIN cmx_rndc_vehiculos_configuracion confv
			ON confv.nombre=" . $cabezote . " AND confv.tipo='Cabezote'
			INNER JOIN cmx_configuracion_cabezote_trailer unir
			ON cont.nombre=unir.conf_trailer
			AND confv.nombre=unir.conf_cabezote
			WHERE tra.id=" . $trailer . "
			AND confv.nombre='" . $cabezote . "'
			GROUP BY conffinal)";
        } else {
            $sql = "SELECT id,rndc_id,nombre,descripcion
				FROM  cmx_rndc_vehiculos_configuracion cont
				WHERE nombre='" . $cabezote . "' AND tipo='Completa'";
        }
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'traer_crndc_configuracion':
        $id = $_REQUEST["id"];
        $sql = "SELECT id, rndc_id ,nombre FROM cmx_rndc_vehiculos_configuracion WHERE nombre='" . $id . "'";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];

        break;

        //validar placa del trailer no repetida
    case 'datos_conductor':
        $sql = "
			SELECT p.numdoc_nexos, p.tipo_documento, p.numero_documento, p.digito_verificacion, p.nombre, p.apellido1, p.apellido2,
			p.celular FROM cmx_proveedores p
			INNER JOIN cmx_actividad_proveedor a
			ON p.numdoc_nexos=a.id_proveedor
			WHERE a.actividad='Conductor'
			AND p.estado='Activo' ORDER BY  p.nombre ASC;
		";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'datos_poseedor':
        $sql = "
			SELECT p.numdoc_nexos, p.tipo_documento, p.numero_documento, p.digito_verificacion, p.nombre, p.apellido1, p.apellido2,
			p.celular FROM cmx_proveedores p
			INNER JOIN cmx_actividad_proveedor a ON p.numdoc_nexos=a.id_proveedor
			WHERE a.actividad='Poseedor Vehiculo' AND p.estado='Activo' ORDER BY  p.nombre ASC;
		";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'datos_propietario':
        $sql = "SELECT p.numdoc_nexos, p.tipo_documento, p.numero_documento, p.digito_verificacion, p.nombre, p.apellido1, p.apellido2,p.celular
			FROM cmx_proveedores p
			INNER JOIN cmx_actividad_proveedor a ON p.numdoc_nexos=a.id_proveedor
			WHERE a.actividad='Propietario Vehiculo' AND p.estado='Activo' ORDER BY  p.nombre ASC";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'valideptrailer':
        $placa = $_REQUEST["placa"];
        $sql = "
			SELECT placa FROM cmx_trailer
			WHERE placa='" . $placa . "'
		";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

        //consultar trailer
    case 'vertrailer':
        //echo 'entro ver trailer';
        $id = $_REQUEST["id"];

        $sql = "SELECT * FROM cmx_trailer WHERE numdoc_trailer=" . $id . "";
        $result = $Data->getConsulta($sql);

        $idmarca = $result["rowsData"][0]["marca"];
        $idtramite = $result["rowsData"][0]["tipo_tramite"];
        $idconfig = $result["rowsData"][0]["configuracion"];
        $idcarroceria = $result["rowsData"][0]["carroceria"];
        $documento = $result["rowsData"][0]["doc_propietario"];
        $aseguradora = $result["rowsData"][0]["aseguradora"];

        //marcas
        $sql2 = "SELECT marca AS marca_trailer FROM cmx_rndc_trailermarcas WHERE id=" . $idmarca . " ";
        $result2 = $Data->getConsulta($sql2);

        //tramites

        $sql3 = "SELECT tramite FROM cmx_rndc_trailertramites WHERE id=" . $idtramite . "";
        $result3 = $Data->getConsulta($sql3);

        //configuracion
        $sql4 = "SELECT nombre FROM cmx_rndc_vehiculos_configuracion WHERE id=" . $idconfig . "";
        $result4 = $Data->getConsulta($sql4);

        //carroceria
        $sql5 = "SELECT descripcion FROM cmx_rndc_vehiculos_carroceria WHERE id=" . $idcarroceria . "";
        $result5 = $Data->getConsulta($sql5);

        //propietario
        $sql6 = "SELECT nombre AS Propietario FROM cmx_proveedores WHERE numdoc_nexos=" . $documento . "";
        $result6 = $Data->getConsulta($sql6);

        //aseguradora
        if ($aseguradora == '' && $aseguradora == null) {
            $sql7 = "SELECT nombre FROM cmx_rndc_aseguradoras WHERE id=0 ORDER BY nombre ASC";
            $result7 = $Data->getConsulta($sql7);
        } else {
            $sql7 = "SELECT nombre FROM cmx_rndc_aseguradoras WHERE id=" . $aseguradora . " ORDER BY nombre ASC";
            $result7 = $Data->getConsulta($sql7);
        }

        if ($result > 1) {
            $return["result"] = $result["rowsData"];
        } else {
            $return["result"] = $result;
        }
        if ($result2 > 1) {
            $return["result2"] = $result2["rowsData"];
        } else {
            $return["result2"] = $result2;
        }

        if ($result3 > 1) {
            $return["result3"] = $result3["rowsData"];
        } else {
            $return["result3"] = $result3;
        }

        if ($result4 > 1) {
            $return["result4"] = $result4["rowsData"];
        } else {
            $return["result4"] = $result4;
        }

        if ($result5 > 1) {
            $return["result5"] = $result5["rowsData"];
        } else {
            $return["result5"] = $result5;
        }

        if ($result6 > 1) {
            $return["result6"] = $result6["rowsData"];
        } else {
            $return["result6"] = $result6;
        }


        if ($result7 > 1) {
            $return["result7"] = $result7["rowsData"];
        } else {
            $return["result7"] = $result7;
        }
        break;
        //historico del trailer
    case 'historicotrailer':
        $idtrailer = $_REQUEST["id"];
        $sql = "SELECT a.*, b.placa AS 'ptrailer', v.placa AS 'pvehiculo' FROM cmx_trailer_vehiculo a
			INNER JOIN  cmx_trailer b ON a.id_trailer=b.numdoc_trailer
			INNER JOIN cmx_vehiculos v ON a.id_vehiculo=v.id
			WHERE a.id_trailer=" . $idtrailer . "";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;
        //traer los selects para crear un vehículo

    case 'config_cabezote':
        $sql = "SELECT * FROM cmx_rndc_vehiculos_configuracion
			WHERE tipo='Completa' ORDER BY nombre";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'carga_empr_gps':
        $sql = "SELECT * FROM cmx_rndc_empresa_gps
		ORDER BY operador_gps ASC";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'traertrailer':
        //$cabezote=$_POST["cabezote"];
        $nombre = $_POST["nombre"];

        $sql = "SELECT t.* , p.nombre AS namec, p.descripcion AS descc
			FROM cmx_trailer t
			INNER JOIN cmx_rndc_vehiculos_configuracion p ON t.configuracion=p.id
			LEFT JOIN cmx_configuracion_cabezote_trailer cct ON p.nombre=cct.conf_trailer
			WHERE cct.conf_cabezote='" . $nombre . "' AND t.estado_solicitud='Disponible'";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;
        //consultar los datos del trailer a editar con el vehciulo
    case 'editar_traertrailer':

        $idvehiculo = $_REQUEST["id"];
        $sql = "
			SELECT t.id AS idtrailer, t.* FROM cmx_trailer_vehiculo  tv
			INNER JOIN cmx_trailer AS t
			ON tv.id_trailer=t.id
			WHERE  tv.id_vehiculo='$idvehiculo'
		";
        // echo $sql;
        $result = $Data->getConsulta($sql);
        // consulta de tramite del trailer
        $sqlt = "
			SELECT * FROM cmx_rndc_trailertramites;
		";
        $result2 = $Data->getConsulta($sqlt);
        $tmpSelector = array();
        //consulta marca del trailer

        $sqlm = "
			SELECT * FROM cmx_rndc_trailermarcas
		";
        $result3 = $Data->getConsulta($sqlm);
        $arraymarcas = array();
        //consultar confguracion del trailer
        $sqlc = "
			SELECT * FROM cmx_rndc_vehiculos_configuracion WHERE nombre LIKE '%S%'
		";
        $result4 = $Data->getConsulta($sqlc);
        $arrayconfig = array();
        //consultar tipo carroceria trailer
        $sqlk = "
			SELECT * FROM cmx_rndc_vehiculos_carroceria
		";
        $result5 = $Data->getConsulta($sqlk);
        $arraycarroceria = array();
        //consultar aseguradora
        $sqlA = " SELECT * FROM cmx_rndc_aseguradoras ORDER BY nombre ASC";
        $result6 = $Data->getConsulta($sqlA);
        $arrayasegu = array();
        //consultar propietario
        $sqlp = "
			SELECT p.nombre, p.numero_documento, p.tipo_documento FROM cmx_proveedores p
			INNER JOIN cmx_actividad_proveedor a
			ON p.numdoc_nexos=a.id_proveedor
			WHERE a.actividad='Propietario Vehiculo'
		";
        $result7 = $Data->getConsulta($sqlp);
        $arraypropietario = array();

        foreach ($result2["rowsData"] as $index => $element) {
            if (strcasecmp($element['id'], $result["rowsData"][0]['tipo_tramite']) == 0) {
                $tmpSelector[$index]['selected'] = true;
            } else {
                $tmpSelector[$index]['selected'] = false;
            }
            $tmpSelector[$index]['id'] = $element['id'];
            $tmpSelector[$index]['nombre'] = $element['tramite'];
        }
        $result["rowsData"][0]['eltramite'] = $tmpSelector;

        foreach ($result3["rowsData"] as $index => $element) {
            if (strcasecmp($element['codigo'], $result["rowsData"][0]['marca']) == 0) {
                $arraymarcas[$index]['selected'] = true;
            } else {
                $arraymarcas[$index]['selected'] = false;
            }
            $arraymarcas[$index]['codigo'] = $element['codigo'];
            $arraymarcas[$index]['marca'] = $element['marca'];
        }
        $result["rowsData"][0]['lasmarcas'] = $arraymarcas;

        foreach ($result4["rowsData"] as $index => $element) {
            if (strcasecmp($element['id'], $result["rowsData"][0]['configuracion']) == 0) {
                $arrayconfig[$index]['selected'] = true;
            } else {
                $arrayconfig[$index]['selected'] = false;
            }
            $arrayconfig[$index]['id'] = $element['id'];
            $arrayconfig[$index]['sigla'] = $element['nombre'];
            $arrayconfig[$index]['descrip'] = $element['descripcion'];
        }
        $result["rowsData"][0]['configura'] = $arrayconfig;

        foreach ($result5['rowsData'] as $index => $element) {
            if (strcasecmp($element["id"], $result["rowsData"][0]['carroceria']) == 0) {
                $arraycarroceria[$index]['selected'] = true;
            } else {
                $arraycarroceria[$index]['selected'] = false;
            }
            $arraycarroceria[$index]['id'] = $element['id'];
            $arraycarroceria[$index]['nombre'] = $element['descripcion'];
        }
        $result["rowsData"][0]['carroceriatrailer'] = $arraycarroceria;

        foreach ($result6["rowsData"] as $index => $element) {
            if (strcasecmp($element["nombre"], $result["rowsData"][0]['aseguradora']) == 0) {
                $arrayasegu[$index]['selected'] = true;
            } else {
                $arrayasegu[$index]['selected'] = false;
            }
            $arrayasegu[$index]['id'] = $element['nombre'];
        }
        $result["rowsData"][0]['aseguratrailer'] = $arrayasegu;
        foreach ($result7["rowsData"] as $index => $element) {

            if (strcasecmp($element['numero_documento'], $result["rowsData"][0]['doc_propietario']) == 0) {
                $arraypropietario[$index]['selected'] = true;
            } else {
                $arraypropietario[$index]['selected'] = false;
            }
            $arraypropietario[$index]['id'] = $element['numero_documento'];
            $arraypropietario[$index]['nombre'] = $element['nombre'];
            $arraypropietario[$index]['tipo'] = $element['tipo_documento'];
        }
        $result["rowsData"][0]['propietario'] = $arraypropietario;

        $return["result"] = $result["rowsData"];
        break;
        //consultar los datos del trailer
    case 'editar_traertrailerunico':

        $idvehiculo = $_REQUEST["id"];
        $sql = "
			SELECT SUBSTR(t.placa,1,1) AS 'letra_placa',
			SUBSTR(t.placa,2,5) AS 'num_placa', t.*
			FROM cmx_trailer AS t WHERE t.id=" . $idvehiculo . "
		";
        // echo $sql;
        $result = $Data->getConsulta($sql);
        // consulta de tramite del trailer
        $sqlt = "
			SELECT * FROM cmx_rndc_trailertramites;
		";
        $result2 = $Data->getConsulta($sqlt);
        $tmpSelector = array();
        //consulta marca del trailer

        $sqlm = "
			SELECT * FROM cmx_rndc_trailermarcas
			WHERE estado=1
			ORDER BY marca ASC";
        $result3 = $Data->getConsulta($sqlm);
        $arraymarcas = array();
        //consultar confguracion del trailer
        $sqlc = "
			SELECT * FROM cmx_rndc_vehiculos_configuracion
			WHERE tipo='Remolque'
			ORDER BY nombre ASC
		";
        $result4 = $Data->getConsulta($sqlc);
        $arrayconfig = array();
        //consultar tipo carroceria trailer
        $sqlk = "
			SELECT * FROM cmx_rndc_vehiculos_carroceria
			WHERE estado=1
			ORDER BY descripcion ASC
		";
        $result5 = $Data->getConsulta($sqlk);
        $arraycarroceria = array();
        //consultar aseguradora
        $sqlA = "
			SELECT * FROM cmx_rndc_aseguradoras
			ORDER BY nombre ASC
		";
        $result6 = $Data->getConsulta($sqlA);
        $arrayasegu = array();
        //consultar propietario
        $sqlp = "
			SELECT p.numdoc_nexos, p.nombre, p.numero_documento, p.tipo_documento FROM cmx_proveedores p
			INNER JOIN cmx_actividad_proveedor a
			ON p.numdoc_nexos=a.id_proveedor
			WHERE a.actividad='Propietario Vehiculo'
			ORDER BY p.nombre ASC
		";
        $result7 = $Data->getConsulta($sqlp);
        $arraypropietario = array();

        //consultar poseedor
        $sqlpo = "
			SELECT p.numdoc_nexos, p.nombre, p.numero_documento, p.tipo_documento FROM cmx_proveedores p
			INNER JOIN cmx_actividad_proveedor a
			ON p.numdoc_nexos=a.id_proveedor
			WHERE a.actividad='Poseedor Vehiculo'
			ORDER BY p.nombre ASC
		";
        $result8 = $Data->getConsulta($sqlpo);
        $arrayposeedor = array();

        foreach ($result2["rowsData"] as $index => $element) {
            if (strcasecmp($element['id'], $result["rowsData"][0]['tipo_tramite']) == 0) {
                $tmpSelector[$index]['selected'] = true;
            } else {
                $tmpSelector[$index]['selected'] = false;
            }
            $tmpSelector[$index]['id'] = $element['id'];
            $tmpSelector[$index]['nombre'] = $element['tramite'];
        }
        $result["rowsData"][0]['eltramite'] = $tmpSelector;

        foreach ($result3["rowsData"] as $index => $element) {
            if (strcasecmp($element['id'], $result["rowsData"][0]['marca']) == 0) {
                $arraymarcas[$index]['selected'] = true;
            } else {
                $arraymarcas[$index]['selected'] = false;
            }
            $arraymarcas[$index]['codigo'] = $element['id'];
            $arraymarcas[$index]['marca'] = $element['marca'];
        }
        $result["rowsData"][0]['lasmarcas'] = $arraymarcas;

        foreach ($result4["rowsData"] as $index => $element) {
            if (strcasecmp($element['id'], $result["rowsData"][0]['configuracion']) == 0) {
                $arrayconfig[$index]['selected'] = true;
            } else {
                $arrayconfig[$index]['selected'] = false;
            }
            $arrayconfig[$index]['id'] = $element['id'];
            $arrayconfig[$index]['sigla'] = $element['nombre'];
            $arrayconfig[$index]['descrip'] = $element['descripcion'];
        }
        $result["rowsData"][0]['configura'] = $arrayconfig;

        foreach ($result5['rowsData'] as $index => $element) {
            if (strcasecmp($element["id"], $result["rowsData"][0]['carroceria']) == 0) {
                $arraycarroceria[$index]['selected'] = true;
            } else {
                $arraycarroceria[$index]['selected'] = false;
            }
            $arraycarroceria[$index]['id'] = $element['id'];
            $arraycarroceria[$index]['nombre'] = $element['descripcion'];
        }
        $result["rowsData"][0]['carroceriatrailer'] = $arraycarroceria;

        foreach ($result6["rowsData"] as $index => $element) {
            if (strcasecmp($element["id"], $result["rowsData"][0]['aseguradora']) == 0) {
                $arrayasegu[$index]['selected'] = true;
            } else {
                $arrayasegu[$index]['selected'] = false;
            }
            $arrayasegu[$index]['nom'] = $element['nombre'];
            $arrayasegu[$index]['id'] = $element['id'];
        }
        $result["rowsData"][0]['aseguratrailer'] = $arrayasegu;
        foreach ($result7["rowsData"] as $index => $element) {

            if (strcasecmp($element['numdoc_nexos'], $result["rowsData"][0]['doc_propietario']) == 0) {
                $arraypropietario[$index]['selected'] = true;
            } else {
                $arraypropietario[$index]['selected'] = false;
            }
            $arraypropietario[$index]['id'] = $element['numero_documento'];
            $arraypropietario[$index]['nombre'] = $element['nombre'];
            $arraypropietario[$index]['tipo'] = $element['tipo_documento'];
            $arraypropietario[$index]['idtb'] = $element['numdoc_nexos'];
        }
        $result["rowsData"][0]['propietario'] = $arraypropietario;
        foreach ($result8["rowsData"] as $index => $element) {
            if (strcasecmp($element['numdoc_nexos'], $result["rowsData"][0]['doc_poseedor']) == 0) {
                $arrayposeedor[$index]['selected'] = true;
            } else {
                $arrayposeedor[$index]['selected'] = false;
            }
            $arrayposeedor[$index]['id'] = $element['numero_documento'];
            $arrayposeedor[$index]['nombre'] = $element['nombre'];
            $arrayposeedor[$index]['tipo'] = $element['tipo_documento'];
            $arrayposeedor[$index]['idtb'] = $element['numdoc_nexos'];
        }
        $result["rowsData"][0]['poseedor'] = $arrayposeedor;
        $return["result"] = $result["rowsData"];
        break;
        //traer los datos del trailer
    case 'datos_trailer':
        $sql = "
			SELECT * FROM cmx_rndc_trailermarcas WHERE estado=1
			ORDER BY marca ASC
		";
        $result = $Data->getConsulta($sql);
        $sql2 = "
			SELECT * from cmx_rndc_trailertramites
			ORDER BY tramite ASC
		";
        $result2 = $Data->getConsulta($sql2);
        $sql3 = "
			SELECT * FROM cmx_rndc_vehiculos_configuracion
 			WHERE tipo='Remolque'
 			ORDER BY nombre ASC";
        $result3 = $Data->getConsulta($sql3);
        $sql4 = "
			SELECT p.numdoc_nexos, p.nombre, p.numero_documento, p.tipo_documento
			FROM cmx_proveedores p
			INNER JOIN cmx_actividad_proveedor a
			ON p.numdoc_nexos=a.id_proveedor
			WHERE a.actividad='Propietario Vehiculo'
			ORDER BY p.nombre ASC";
        $result4 = $Data->getConsulta($sql4);
        $sql5 = "
			 SELECT * FROM cmx_rndc_aseguradoras
			 ORDER BY nombre ASC";
        $result5 = $Data->getConsulta($sql5);
        //traier tirpos de carroceria
        $sql6 = "
			SELECT * FROM cmx_rndc_vehiculos_carroceria
			WHERE estado=1
			ORDER BY descripcion ASC";
        $result6 = $Data->getConsulta($sql6);
        //trailer poseedores
        $sql7 = "SELECT p.numdoc_nexos, p.nombre, p.numero_documento, p.tipo_documento
			FROM cmx_proveedores p
			INNER JOIN cmx_actividad_proveedor a
			ON p.numdoc_nexos=a.id_proveedor
			WHERE a.actividad='Poseedor Vehiculo'
			ORDER BY p.nombre ASC";
        $result7 = $Data->getConsulta($sql7);

        $return["result"] = $result["rowsData"];
        $return["result2"] = $result2["rowsData"];
        $return["result3"] = $result3["rowsData"];
        $return["result4"] = $result4["rowsData"];
        $return["result5"] = $result5["rowsData"];
        $return["result6"] = $result6["rowsData"];
        $return["result7"] = $result7["rowsData"];
        //trailer tramites
        break;
        //traer los datos del vehiculo que no son selects
    case 'traer_datos_vehiculo':
        $id_vehiculo = $_REQUEST["id"];
        $sql = "SELECT v.id AS elid,  v.*,v2.*,d.*,
						b.estado_proceso, g.nombre AS 'v_confi', g.descripcion AS 'v_descri'
 						FROM cmx_vehiculos v
						INNER JOIN cmx_vehiculo2 v2
						INNER JOIN cmx_rndc_vehiculos_configuracion g
						ON v2.configuracion=g.id
						INNER JOIN cmx_detalle_vehiculo d
						ON v.id=v2.id_vehiculo AND v2.id_vehiculo=d.id_vehiculo
						LEFT JOIN cmx_estado_bloqueo b
						ON v.id=b.id_objeto AND tipo_objeto='vehiculo'
						WHERE v.id='$id_vehiculo'";
        // echo $sql;
        $result = $Data->getConsulta($sql);

        //consultar tipo vehiculo
        $sql2 = 'SELECT * FROM cmx_para_tipo_vehiculo';
        $resulttipo = $Data->getConsulta($sql2);
        //aseguradoras
        $sql3 = 'SELECT * FROM cmx_rndc_aseguradoras ORDER BY nombre ASC';
        $resultaseguradora = $Data->getConsulta($sql3);
        //propietario
        $sql4 = '
					SELECT p.* FROM cmx_proveedores p
					INNER JOIN cmx_actividad_proveedor a
					ON p.numdoc_nexos=a.id_proveedor WHERE a.actividad="Propietario Vehiculo"';
        $resultpropietario = $Data->getConsulta($sql4);

        //poseedor
        $sql5 = '
					SELECT p.* FROM cmx_proveedores p
					INNER JOIN cmx_actividad_proveedor a
					ON p.numdoc_nexos=a.id_proveedor WHERE a.actividad="Poseedor Vehiculo"';
        $resulttenedor = $Data->getConsulta($sql5);

        //conductor
        $sql6 = 'SELECT p.* FROM cmx_proveedores p
					INNER JOIN cmx_actividad_proveedor a
					ON p.numdoc_nexos=a.id_proveedor WHERE a.actividad="Conductor"';
        $resultconductor = $Data->getConsulta($sql6);

        //trailer
        $sql7 = "SELECT id_trailer FROM cmx_trailer_vehiculo WHERE id_vehiculo='" . $id_vehiculo . "'";
        $resultidtrailer = $Data->getConsulta($sql7);

        $conf_completa = $result["rowsData"][0]['v_confi'];
        $sql8 = "SELECT t.*,c.nombre, c.descripcion
					FROM cmx_trailer t
					INNER JOIN cmx_rndc_vehiculos_configuracion c
					ON t.configuracion=c.id
					LEFT JOIN cmx_configuracion_cabezote_trailer ct
					ON c.nombre=ct.conf_trailer
					WHERE
					ct.conf_cabezote='" . $conf_completa . "'";

        $resulttrailer_todos = $Data->getConsulta($sql8);

        //configuracion
        $sql9 = "SELECT * FROM cmx_rndc_vehiculos_configuracion
					WHERE tipo='Completa' ORDER BY nombre";
        $resultconfi = $Data->getConsulta($sql9);

        //color
        $sql10 = "SELECT * FROM cmx_rndc_vehiculos_color WHERE estado=1 ORDER BY color ASC";
        $resultcolor = $Data->getConsulta($sql10);

        //marca
        $sql11 = "SELECT * FROM cmx_rndc_vehiculos_marcas
				WHERE estado=1 ORDER BY marca asc;";
        $resultmarca = $Data->getConsulta($sql11);

        //linea
        $sql12 = "SELECT lni.* FROM cmx_rndc_vehiculos_linea lni
        INNER JOIN cmx_rndc_vehiculos_marcas mca ON lni.id_marca = mca.rndc_id
        WHERE mca.id= " . $result['rowsData'][0]['marca'] . " ORDER BY lni.descripcion ASC";

        $resultline = $Data->getConsulta($sql12);

        //carroceria
        $sql13 = "SELECT * FROM cmx_rndc_vehiculos_carroceria WHERE estado=1 ORDER BY descripcion ASC";
        $resultcarroceria = $Data->getConsulta($sql13);

        //tipo de carroceria
        $sql14 = "SELECT  * FROM cmx_rndc_tipo_carroceria";
        $resulttipocarroceria = $Data->getConsulta($sql14);

        //clase tipo vehiculo
        $sql15 = "SELECT * FROM cmx_rndc_clase_vehiculo";
        $resultclasev = $Data->getConsulta($sql15);

        $tmpSelector = array();
        $asegurar = array();
        $propietario = array();
        $tenedor = array();
        $conduce = array();
        $fotovehiculo = array();
        $trailer = array();

        $config = array();
        $color = array();
        $mark = array();
        $line = array();
        $carroc = array();
        $tipocarroc = array();
        $clase = array();

        foreach ($resulttipo["rowsData"] as $index => $element1) {
            if (strcasecmp($element1['id'], $result["rowsData"][0]['tipo_vehiculo']) == 0) {
                $tmpSelector[$index]['selected'] = true;
            } else {
                $tmpSelector[$index]['selected'] = false;
            }
            $tmpSelector[$index]['tipo_carro'] = $element1['id'];
            $tmpSelector[$index]['tipo_carron'] = $element1['nombre'];
            //traer datos de la aseguradora
            foreach ($resultaseguradora["rowsData"] as $index => $element1) {
                if (strcasecmp($element1['id'], $result["rowsData"][0]['aseguradora']) == 0) {
                    $asegurar[$index]['selected'] = true;
                } else {
                    $asegurar[$index]['selected'] = false;
                }
                $asegurar[$index]['asegure'] = $element1['nombre'];
                $asegurar[$index]['idasegure'] = $element1['id'];
            }
            // traer datos del propietario
            foreach ($resultpropietario["rowsData"] as $index => $element1) {
                if (strcasecmp($element1['numdoc_nexos'], $result["rowsData"][0]['id_propietario']) == 0) {
                    $propietario[$index]['selected'] = true;
                } else {
                    $propietario[$index]['selected'] = false;
                }
                $propietario[$index]['propi'] = $element1['numdoc_nexos'];
                $propietario[$index]['propin'] = $element1['nombre'];
                $propietario[$index]['propia1'] = $element1['apellido1'];
                $propietario[$index]['propia2'] = $element1['apellido2'];
                $propietario[$index]['propid'] = $element1['numero_documento'];
            }
            //traer datos del tenedor
            foreach ($resulttenedor["rowsData"] as $index => $element1) {
                if (strcasecmp($element1['numdoc_nexos'], $result["rowsData"][0]['id_tenedor']) == 0) {
                    $tenedor[$index]['selected'] = true;
                } else {
                    $tenedor[$index]['selected'] = false;
                }
                $tenedor[$index]['tene'] = $element1['numdoc_nexos'];
                $tenedor[$index]['tenename'] = $element1['nombre'];
                $tenedor[$index]['teneape1'] = $element1['apellido1'];
                $tenedor[$index]['teneape2'] = $element1['apellido2'];
                $tenedor[$index]['tenedocu'] = $element1['numero_documento'];
            }
            //traer datos del conductor
            foreach ($resultconductor["rowsData"] as $index => $element1) {
                if (strcasecmp($element1['numdoc_nexos'], $result["rowsData"][0]['id_conductor']) == 0) {
                    $conduce[$index]['selected'] = true;
                } else {
                    $conduce[$index]['selected'] = false;
                }
                $conduce[$index]['conductor'] = $element1['numdoc_nexos'];
                $conduce[$index]['conductorname'] = $element1['nombre'];
                $conduce[$index]['conapell1'] = $element1['apellido1'];
                $conduce[$index]['conapell2'] = $element1['apellido2'];
                $conduce[$index]['conductordocu'] = $element1['numero_documento'];
            }

            if ($resulttrailer_todos) {
                foreach ($resulttrailer_todos["rowsData"] as $index => $element1) {
                    if (strcasecmp($element1["id"], $resultidtrailer["rowsData"][0]["id_trailer"]) == 0) {
                        $trailer[$index]['selected'] = true;
                    } else {
                        $trailer[$index]['selected'] = false;
                    }
                    $trailer[$index]['idtrailer'] = $element1['id'];
                    $trailer[$index]['placatrailer'] = $element1['placa'];
                    $trailer[$index]['estado_soli'] = $element1['estado_solicitud'];
                    $trailer[$index]['nombret'] = $element1['nombre'];
                    $trailer[$index]['descripciont'] = $element1['descripcion'];
                }
            }

            //traer la configuracion
            foreach ($resultconfi["rowsData"] as $index => $element1) {
                if (strcasecmp($element1["id"], $result["rowsData"][0]["configuracion"]) == 0) {
                    $config[$index]['selected'] = true;
                } else {
                    $config[$index]['selected'] = false;
                }
                $config[$index]['id'] = $element1['id'];
                $config[$index]['rndc_id'] = $element1['rndc_id'];
                $config[$index]['nombre'] = $element1['nombre'];
                $config[$index]['descripcion'] = $element1['descripcion'];
                //traer configuracion cabezote

                //traer configuración de trailer

            }
            //traer el color
            foreach ($resultcolor["rowsData"] as $index => $element1) {
                if (strcasecmp($element1["id"], $result["rowsData"][0]["color"]) == 0) {
                    $color[$index]['selected'] = true;
                } else {
                    $color[$index]['selected'] = false;
                }
                $color[$index]['color'] = $element1['color'];
                $color[$index]['idcolor'] = $element1['id'];
            }
            //traer marca
            foreach ($resultmarca["rowsData"] as $index => $element1) {
                if (strcasecmp($element1["id"], $result["rowsData"][0]["marca"]) == 0) {
                    $mark[$index]['selected'] = true;
                } else {
                    $mark[$index]['selected'] = false;
                }
                $mark[$index]['marca'] = $element1['marca'];
                $mark[$index]['idmarca'] = $element1['id'];
            }
            //traer linea
            foreach ($resultline["rowsData"] as $index => $element1) {
                if (strcasecmp($element1["id"], $result["rowsData"][0]["linea"]) == 0) {
                    $line[$index]['selected'] = true;
                } else {
                    $line[$index]['selected'] = false;
                }
                $line[$index]['linea'] = $element1['descripcion'];
                $line[$index]['idlinea'] = $element1['id'];
            }

            // carroceria
            foreach ($resultcarroceria["rowsData"] as $index => $element1) {
                if (strcasecmp($element1["id"], $result["rowsData"][0]["tipo_carroceria"]) == 0) {
                    $carroc[$index]['selected'] = true;
                } else {
                    $carroc[$index]['selected'] = false;
                }
                $carroc[$index]['carroceria'] = $element1['descripcion'];
                $carroc[$index]['id_carroceria'] = $element1['id'];
            }

            //tipo carroceria
            foreach ($resulttipocarroceria["rowsData"] as $index => $element1) {
                if (strcasecmp($element1["tipo"], $result["rowsData"][0]["tipo_carroceria"]) == 0) {
                    $tipocarroc[$index]['selected'] = true;
                } else {

                    $tipocarroc[$index]['selected'] = false;
                }
                $tipocarroc[$index]['tipocarroceria'] = $element1['tipo'];
                $tipocarroc[$index]['id_carroceria'] = $element1['id'];
            }

            //clase del vehiculo
            foreach ($resultclasev["rowsData"] as $index => $element1) {
                if (strcasecmp($element1["id"], $result["rowsData"][0]["clase_vehiculo"]) == 0) {
                    $clase[$index]['selected'] = true;
                } else {
                    $clase[$index]['selected'] = false;
                }
                $clase[$index]['idclase'] = $element1['id'];
                $clase[$index]['clase'] = $element1['clase'];
            }

            //TRAER ARCHIVOS DEL VEHICULO
            // foreach ($result["rowsData"] as $key => $element) {
            //     if($element['foto_vehiculo']){
            //         echo 'si';
            //     $fotovehiculo[$key]['fotocar'] = $element['foto_vehiculo'];
            //     $return["archivos"]="<label>Archivos subidos</label><br>";
            //     $ficheros1  = scandir("../".$result['foto_vehiculo'][$key]);
            //     // $result["rowsData"][$index1]['tipo_servicio_mer'] = $arreglo_t;
            //     for($x=2;$x< count($ficheros1);$x++){
            //         $return["archivos"][$key].="<a href='".BASE_URL.$return["foto_vehiculo"][$key].$ficheros1[$x]."' target='_blank' >$ficheros1[$x]</a> <br>";
            //         }
            //     }else{
            //         echo 'nooo';
            //     }
            // }
        }

        $result["rowsData"][0]['tipo_vehiculo'] = $tmpSelector;
        $result["rowsData"][0]['aseguradora'] = $asegurar;
        $result["rowsData"][0]['id_propietario'] = $propietario;
        $result["rowsData"][0]['id_tenedor'] = $tenedor;
        $result["rowsData"][0]['id_conductor'] = $conduce;
        $result["rowsData"][0]['id_trailer'] = $trailer;
        $result["rowsData"][0]['configuracion'] = $config;
        $result["rowsData"][0]['color'] = $color;
        $result["rowsData"][0]['marca'] = $mark;
        $result["rowsData"][0]['line'] = $line;
        $result["rowsData"][0]['carroceria'] = $carroc;
        $result["rowsData"][0]['tipocarroceria'] = $tipocarroc;
        $result["rowsData"][0]['clase'] = $clase;
        $return["result"] = $result["rowsData"];
        break;

        //traer la configuraciones
    case 'traer_configuracion':
        $id = $_POST["id"];
        //configuracion individual por separado
        $sql = "SELECT SUBSTRING(config.nombre, 1, 1) AS cabeza,
		SUBSTRING(config.nombre, 2, 2) AS cuerpo,
		config.nombre AS total
		FROM cmx_vehiculo2 ve
		INNER JOIN cmx_rndc_vehiculos_configuracion config
		ON ve.configuracion=config.id
		WHERE ve.id_vehiculo=" . $id;
        $result = $Data->getConsulta($sql);
        var_dump($result);
        exit();
        //consultar configuracion - cabezote
        $sqlb = "SELECT * FROM cmx_rndc_vehiculos_configuracion
		WHERE tipo='Cabezote'";
        $resultb = $Data->getConsulta($sqlb);
        //trailer actual
        $sqlc = "SELECT id,configuracion,placa FROM cmx_trailer tra
			WHERE tra.estado='Activo'
			AND tra.estado_solicitud<>'Asignado'";
        $resultc = $Data->getConsulta($sqlc);

        //trailers con la configuracion actual y activos
        $sqlt = 'SELECT a.*, b.id AS id_config_trailer
		FROM cmx_configuracion_cabezote_trailer a
		INNER JOIN cmx_rndc_vehiculos_configuracion b
		ON a.conf_trailer=b.nombre AND a.estado=1
		WHERE
		a.conf_cabezote=' . $result["rowsData"][0]['cabeza'] . '
		AND a.tipo="t"';
        // echo $sqlt;
        // exit();
        $resultt = $Data->getConsulta($sqlt);
        //configuracion completa

        $tmpSelector = array();
        $Selecttrailer = array();
        foreach ($resultb["rowsData"] as $index => $element1) {

            if (strcasecmp($element1['nombre'], $result["rowsData"][0]['cabeza']) == 0) {
                $tmpSelector[$index]['selected'] = true;
            } else {
                $tmpSelector[$index]['selected'] = false;
            }
            $tmpSelector[$index]['cabezo'] = $element1['nombre'];
            $tmpSelector[$index]['idcabezote'] = $element1['id'];
        }
        //consultar trailer actualmente vinculado al vehículo
        foreach ($resultc["rowsData"] as $index => $element2) {
            if (strcasecmp($element2['configuracion'], $resultt["rowsData"][0]['id_config_trailer']) == 0) {
                $Selecttrailer[$index]['selected'] = true;
            } else {
                $Selecttrailer[$index]['selected'] = false;
            }
            $tmpSelector[$index]['placatrailer'] = $element2['placa'];
            $tmpSelector[$index]['idtrailer'] = $element2['id'];
            $tmpSelector[$index]['id_config'] = $element2['configuracion'];
        }

        //$return["result"]= $result["rowsData"];
        break;

    case 'consultar_actividad_proveedor':
        $id_proveedor = $_REQUEST["id_proveedor"];
        $sql = "SELECT actividad as acti FROM cmx_actividad_proveedor WHERE id_proveedor=$id_proveedor";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'traer_datos_proveedor':
        $id_proveedor = $_REQUEST["id"];
        $sql = "
			SELECT  p.numdoc_nexos as idp, p.*, c.id AS iddetalle, c.* , b.estado_proceso
			FROM  cmx_proveedores p
			LEFT JOIN cmx_detalle_conductor c
			ON  p.numdoc_nexos=c.id_proveedor
			LEFT JOIN cmx_estado_bloqueo b
			ON p.numdoc_nexos=b.id_objeto
			WHERE p.numdoc_nexos='$id_proveedor' GROUP BY p.numdoc_nexos";

        $sql9 = "SELECT actividad as acti FROM cmx_actividad_proveedor WHERE id_proveedor=$id_proveedor";
        $result9 = $Data->getConsulta($sql9);

        $result = $Data->getConsulta($sql);
        if ($result) {
            $sql3 = "SELECT ref.*
			FROM cmx_referencias_preestudio ref
			INNER JOIN cmx_proveedores pro ON ref.id_conductor=pro.numero_documento
			WHERE pro.numdoc_nexos=" . $id_proveedor . "";
            $result2 = $Data->getConsulta($sql3);

            $sql5 = "SELECT * FROM cmx_referencias_personales WHERE id_conductor=" . $id_proveedor . "";
            $result3 = $Data->getConsulta($sql5);

            //consultas de proveedores
            $sql6 = "SELECT * FROM cmx_proveedores_detalle WHERE id_proveedor=" . $id_proveedor . "";
            $result6 = $Data->getConsulta($sql6);

            $sqlm = "SELECT * FROM cmx_municipios WHERE estado_nacional='Activa'";
            $resultlocal = $Data->getConsulta($sqlm);

            $localizacion = array();
            foreach ($resultlocal["rowsData"] as $index => $element1) {
                if (strcasecmp($element1['id'], $result6["rowsData"][0]['cod_pais']) == 0) {
                    $localizacion[$index]['selected'] = true;
                } else {
                    $localizacion[$index]['selected'] = false;
                }
                $localizacion[$index]['munid'] = $element1['id'];
                $localizacion[$index]['munmun'] = $element1['municipio'];
                $localizacion[$index]['mundepto'] = $element1['depto'];
                $localizacion[$index]['munpais'] = $element1['pais'];
            }
            $result6["rowsData"][0]['id_municipio'] = $localizacion;

            $sql7 = "SELECT * FROM cmx_proveedor_contactos WHERE id_proveedor=" . $id_proveedor . "";
            $result7 = $Data->getConsulta($sql7);
        }

        //traer los municipios
        $sql2 = "SELECT * FROM cmx_municipios WHERE estado_nacional='Activa'
		";
        $resultmuni = $Data->getConsulta($sql2);
        //traer datos financieros

        $sql4 = "SELECT pf.*
			FROM cmx_proveedor_financieros pf
			WHERE pf.id_proveedor='$id_proveedor'
			AND pf.estado=1";
        $resultfinan = $Data->getConsulta($sql4);
        //consulta de bancos
        $sql6 = "SELECT *
			FROM cmx_para_bancos
			WHERE estado=1";
        $resultbanc = $Data->getConsulta($sql6);
        //consulta de obligaciones tributarios
        $sql7 = "SELECT *
			FROM cmx_para_obligacion_tributaria
			WHERE estado=1";
        $resultoblig = $Data->getConsulta($sql7);
        //consulta de actividades economicas
        $sql8 = "SELECT * FROM
			cmx_para_actividad_economica
			WHERE estado=1";
        $resultacty = $Data->getConsulta($sql8);
        $municipio = array();
        $bancos = array();
        $obliga = array();
        $actividad = array();
        foreach ($resultmuni["rowsData"] as $index => $element1) {
            if (strcasecmp($element1['id'], $result["rowsData"][0]['id_municipio']) == 0) {
                $municipio[$index]['selected'] = true;
            } else {
                $municipio[$index]['selected'] = false;
            }
            $municipio[$index]['munid'] = $element1['id'];
            $municipio[$index]['munmun'] = $element1['municipio'];
            $municipio[$index]['mundepto'] = $element1['depto'];
        }

        $result["rowsData"][0]['id_municipio'] = $municipio;
        $cantidad = count($resultfinan["rowsData"]);

        $return["result"] = $result["rowsData"];
        $return["result9"] = $result9["rowsData"];
        $return["result2"] = $result2["rowsData"];
        $return["result3"] = $result3["rowsData"];
        $return["result6"] = $result6["rowsData"];
        $return["result7"] = $result7["rowsData"];
        $return["resultfinan"] = $resultfinan["rowsData"];
        $return["resultcantidad"] = $cantidad;
        $return["resultbancos"] = $resultbanc["rowsData"];
        $return["resultciiu"] = $resultacty["rowsData"];
        $return["resultobligaciones"] = $resultoblig["rowsData"];

        break;

    case 'traer_datos_proveedorver':
        $id_proveedor = $_REQUEST["id"];
        $sql = "
			SELECT  p.id AS idp, p.*,
			CONCAT(mu.municipio,'-',mu.depto) AS cipio,
			c.id AS existec, c.*,
			b.estado_proceso
			FROM  cmx_proveedores p
			LEFT JOIN cmx_detalle_conductor c ON  p.numdoc_nexos=c.id_proveedor
			LEFT JOIN cmx_estado_bloqueo b ON p.numdoc_nexos=b.id_objeto
			LEFT JOIN cmx_municipios mu ON p.id_municipio=mu.id
			WHERE p.numdoc_nexos='" . $id_proveedor . "' GROUP BY p.id
		";
        //echo $sql;
        $result = $Data->getConsulta($sql);
        if ($result) {
            $sql9 = "SELECT actividad as acti FROM cmx_actividad_proveedor WHERE id_proveedor=$id_proveedor";
            $result9 = $Data->getConsulta($sql9);
            //OJO REVISAR EL 2 DEL RESULT9 PORQUE SEGUN LA POSICION DE LA ACTIVIDAD TOCA PONERLO O SINO NO SIRVE
            //$activity=$result9["rowsData"][2]["acti"];
            foreach ($result9["rowsData"] as $key => $value) {
                //echo 'Actividad'.$value['acti'];
                if ($value['acti'] == 'Proveedor') {
                    //echo 'CONTADORCITO'.$cont++;
                    $sql_a = "SELECT CONCAT(b.pais,'-',b.depto,'-',b.municipio) AS cipio,  a.* FROM cmx_proveedores_detalle a
							LEFT JOIN cmx_municipios b
							ON a.cod_pais=b.id
							WHERE a.id_proveedor=" . $id_proveedor . "  ";
                    //echo $sql_a;
                    $resulta = $Data->getConsulta($sql_a);
                    $return["resulta"] = $resulta["rowsData"];

                    $sql_b = "SELECT * FROM cmx_proveedor_contactos
						WHERE id_proveedor=" . $id_proveedor . " ";
                    //echo $sql_b;

                    $resultb = $Data->getConsulta($sql_b);
                    $return["resultb"] = $resultb["rowsData"];
                }
            }

            $sql2 = "SELECT ref.*
			FROM cmx_referencias_preestudio ref
			INNER JOIN cmx_proveedores pro
			ON ref.id_conductor=pro.numero_documento
			WHERE pro.numdoc_nexos=" . $id_proveedor . "";
            $result2 = $Data->getConsulta($sql2);

            $sql3 = "SELECT * FROM cmx_referencias_personales
			WHERE id_conductor=" . $id_proveedor . "  ";
            $result3 = $Data->getConsulta($sql3);

            $sql4 = "SELECT pf.tipo_cuenta, pf.numero_cuenta,
				ae.descripcion as economi, ot.descripcion, ban.nombre
				FROM cmx_proveedor_financieros pf
				INNER JOIN cmx_para_actividad_economica ae
				ON pf.actividad_economica=ae.id
				INNER JOIN cmx_para_obligacion_tributaria ot
				ON pf.obliga_tributaria=ot.id
				INNER JOIN cmx_para_bancos ban
				ON pf.banco=ban.id
				WHERE pf.id_proveedor=" . $id_proveedor . "
				AND pf.estado=1";
            $result4 = $Data->getConsulta($sql4);
        }
        $return["result"] = $result["rowsData"];
        $return["result2"] = $result2["rowsData"];
        $return["result3"] = $result3["rowsData"];
        $return["result9"] = $result9["rowsData"];
        $return["result4"] = $result4["rowsData"];
        break;

        //historico para el vehiculo
    case 'historicoproveedor':
        //ver los vehiculos que tiene ese proveedor
        $id_proveedor = $_REQUEST["id"];
        $sql = "SELECT * FROM cmx_asignar_conductorvehiculo WHERE cod_conductor=" . $id_proveedor . " ORDER BY id DESC";
        // ECHO $sql;
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

        //historico para proveedores
    case 'historicovehiculo':
        //ver los proveedores que tiene ese vehiculo
        $id_vehiculo = $_REQUEST["id"];
        $sql = "SELECT a.*,p.nombre,p.numero_documento,b.placa FROM cmx_asignar_conductorvehiculo a
				INNER JOIN cmx_proveedores p ON a.cod_conductor=p.numdoc_nexos
				INNER JOIN cmx_vehiculos b ON a.cod_vehiculo=b.placa
				WHERE b.id=" . $id_vehiculo . " ORDER BY id DESC";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

        //PROVEEDOR INTERNACIONAL
    case 'localizacion_operacional':
        $sql = "SELECT * FROM cmx_municipios ORDER BY pais, depto";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'eliminar_contacto_proveedor':
        $id = $_POST["idtb"];
        $sql = "DELETE FROM cmx_proveedor_contactos
				WHERE id=" . $id . "";
        $result = $Data->ejecuteRegistro($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'Consulta_Datos_Financieros':
        //PROPIETARIOS Y POSEEDORES datos que aplican solo para
        $sql = "SELECT id,nit,digito_verificacion,abreviatura
			FROM cmx_para_bancos
			WHERE estado=1
			ORDER BY nombre ASC";
        $result = $Data->getConsulta($sql);
        $sql2 = "SELECT id,codigo,descripcion
			FROM cmx_para_obligacion_tributaria
			WHERE estado=1
			ORDER BY descripcion ASC";
        $result2 = $Data->getConsulta($sql2);
        $sql3 = "SELECT id,codigo,descripcion
			FROM cmx_para_actividad_economica
			WHERE estado=1
			ORDER BY descripcion";
        $result3 = $Data->getConsulta($sql3);
        $return["result"] = $result["rowsData"];
        $return["result2"] = $result2["rowsData"];
        $return["result3"] = $result3["rowsData"];
        break;

    case 'Actualiza_Cuenta_Bancaria':
        $actividad_economica = $_POST["actividad_economica"];
        $obligacion = $_POST["obligacion"];
        $banco = $_POST["banco"];
        $tipo_cuenta = $_POST["tipo_cuenta"];
        $numero_cuenta = $_POST["numero_cuenta"];
        $idtabla = $_POST["idtabla"];
        $sql = "UPDATE cmx_proveedor_financieros
			SET
			actividad_economica=" . $actividad_economica . ",
			obliga_tributaria=" . $obligacion . ",
			banco=" . $banco . ",
			tipo_cuenta=" . $tipo_cuenta . ",
			numero_cuenta=" . $numero_cuenta . "
			WHERE 	id=" . $idtabla;
        $result = $Data->ejecuteRegistro($sql);
        $return["result"] = $result["rowsData"];
        break;

    case 'crear_transaccion_ministerio':
        session_start();
        $fecha_actual = date('Y-m-d');
        $hora_actual = date('H:i:s');
        $user = $_SESSION["usuario"]["nom_usuario"];
        $num_documento = $_POST["num_documento"];
        $tercero_clase = $_POST["tercero_clase"];
        $sql = "INSERT INTO web_service_RNDC(id,codigo_proceso,tipo,estado_envio_rndc,estado,fecha,hora,usuario,tipo_tercero,accion)
		VALUES(null,$num_documento,'Tercero',0,1,'" . $fecha_actual . "','" . $hora_actual . "','" . $user . "','" . $tercero_clase . "','Crear')";
        $result = $Data->ejecuteRegistro($sql);
        if ($result) {
            $return["result"] = 1;
        } else {
            $return["result"] = 0;
        }
        break;

    case 'valida_placa_trailer':
        $placa = $_POST["placatrailer"];
        $sql = "SELECT * FROM cmx_trailer
			WHERE 	placa='" . $placa . "'";
        $result = $Data->getConsulta($sql);
        $return["result"] = $result["rowsData"];
        break;
}
$return["result"] = $result["rowsData"];
echo json_encode($return);
