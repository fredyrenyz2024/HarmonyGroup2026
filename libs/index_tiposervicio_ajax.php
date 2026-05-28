<?php

include("../application/Config.php");
include '../application/Conexion.php';
include '../application/Model.php';

$Data = new Consultas;

switch ($_REQUEST['action']) {

	case 'consultar_tipo_servicio':
		// echo 'entro a crear tipo vejiculo';
		$tipo = $_REQUEST["tipo"];
		$estado = $_REQUEST["estado"];
		$tipi = $_REQUEST["tipi"];
		if ($tipi == 'Mercancia') {
			$sql = '
					SELECT * FROM cmx_para_tipo_sevicio 
					WHERE nombre="' . $tipo . '" 
					AND tipificacion="' . $tipi . '"
					   ';
		}

		if ($tipi == 'Especial') {
			$costo = $_REQUEST["costo"];
			$sql = '
					SELECT * FROM cmx_para_tipo_sevicio 
					WHERE nombre="' . $tipo . '" 
					AND tipificacion="' . $tipi . '"
					AND costo=' . $costo . '
					   ';
		}

		$result = $Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
		break;

	case 'crear_tipo_vehiculo':
		// echo 'entro a crear tipo vejiculo';
		$tipo = $_REQUEST["tipo"];
		$estado = $_REQUEST["estado"];
		$tipi = $_REQUEST["tipi"];
		$costo = $_REQUEST["costo"];
		$proveedor_servicio_especial = $_REQUEST["proveedor_servicio_especial"];
		$sql = 'INSERT INTO cmx_para_tipo_sevicio
					(id,proveedor_id,nombre,tipificacion,estado,costo)
					VALUES(null,"' . $proveedor_servicio_especial . '","' . $tipo . '","' . $tipi . '", "' . $estado . '",' . $costo . ');   ';
		$result = $Data->ejecuteRegistro($sql);
		$return["result"] = $result["rowsData"];
		break;

	case 'actualizar':
		// echo 'entro a crear tipo vejiculo';
		$id = $_REQUEST["id"];
		$nom = $_REQUEST["nom"];
		$tipi = $_REQUEST["tipi"];
		$estado = $_REQUEST["esta"];
		$ecosto = $_REQUEST["ecosto"];
		if ($tipi == 'Especial') {
			$sql = '
					UPDATE cmx_para_tipo_sevicio 
					SET nombre="' . $nom . '", 
					tipificacion="' . $tipi . '",
					estado="' . $estado . '",
					costo=' . $ecosto . '
					WHERE id=' . $id . '   ; ';
		}
		if ($tipi == 'Mercancia') {
			$sql = '
					UPDATE cmx_para_tipo_sevicio 
					SET nombre="' . $nom . '", 
					tipificacion="' . $tipi . '",
					estado="' . $estado . '"
					WHERE id=' . $id . '   ; ';
		}

		$result = $Data->ejecuteRegistro($sql);
		$return["result"] = $result["rowsData"];
		break;





	default:
		break;
}
$return["result"] = $result["rowsData"];
echo json_encode($return);
