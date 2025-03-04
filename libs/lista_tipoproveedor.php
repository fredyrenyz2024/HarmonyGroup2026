<?php
include("../application/Config.php");
include '../application/Conexion.php';
include '../application/Model.php';

$Data = new Consultas;
switch ($_POST['action']) {

	case 'cargar_actividades':
		$id_proveedor = $_POST["id_proveedor"];
		$sql = "SELECT * FROM cmx_actividad_proveedor
		WHERE id_proveedor=" . $id_proveedor . "";
		$result = $Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];

		/*$sql2="SELECT * FROM cmx_proveedores
			WHERE id=".$id_proveedor."";*/
		$sql2 = "SELECT p.*, CONCAT(m.municipio,'-',m.depto) AS municipio,
			d.celular2
			FROM cmx_proveedores p
			INNER JOIN cmx_municipios m ON p.id_municipio=m.id
			LEFT JOIN cmx_detalle_conductor d ON p.numdoc_nexos=d.id_proveedor
			WHERE p.numdoc_nexos=" . $id_proveedor . "";

		$result2 = $Data->getConsulta($sql2);
		$return["result2"] = $result2["rowsData"];
		break;

	case 'validar_conductor': //validar si tiene vehículo asociado
		$id_proveedor = $_POST["id_proveedor"];
		$sql = "SELECT COUNT(p.id) AS 'vdriver'
			FROM cmx_proveedores p
			INNER JOIN cmx_actividad_proveedor a ON p.numdoc_nexos=a.id_proveedor
			INNER JOIN cmx_vehiculos v ON p.numdoc_nexos=v.id_conductor
			WHERE a.actividad='Conductor' AND 
			p.numdoc_nexos=" . $id_proveedor . "";
		$result = $Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
		break;

	case 'datos_enconductor':
		$id_proveedor = $_POST["id_proveedor"];
		$sql = "SELECT COUNT(p.id) AS 'tb_condu' 
			FROM cmx_proveedores p
			INNER JOIN cmx_actividad_proveedor a ON p.numdoc_nexos=a.id_proveedor
			INNER JOIN cmx_detalle_conductor c ON p.numdoc_nexos=c.id_proveedor
			WHERE a.actividad='Conductor' AND p.numdoc_nexos=" . $id_proveedor . " AND c.id_proveedor=" . $id_proveedor . "";
		$result = $Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];

		$sql2 = "SELECT COUNT(p.id) AS 'tb_provee' FROM cmx_proveedores p
			INNER JOIN cmx_actividad_proveedor a ON p.numdoc_nexos=a.id_proveedor
			INNER JOIN cmx_proveedores_detalle d ON p.numdoc_nexos=d.id_proveedor
			WHERE a.actividad='Proveedor' AND p.numdoc_nexos=" . $id_proveedor . "  AND d.id_proveedor=" . $id_proveedor . "";
		$result2 = $Data->getConsulta($sql2);
		$return["result2"] = $result2["rowsData"];


		$sql3 = "SELECT COUNT(p.id) AS 'tb_dueno' FROM cmx_proveedores p
			INNER JOIN cmx_actividad_proveedor a ON  p.numdoc_nexos=a.id_proveedor
			WHERE a.actividad='Propietario Vehiculo'
			AND p.numdoc_nexos=" . $id_proveedor . "";

		$result3 = $Data->getConsulta($sql3);
		$return["result3"] = $result3["rowsData"];


		$sql4 = "SELECT COUNT(p.id) AS 'tb_tene' FROM cmx_proveedores p
			INNER JOIN cmx_actividad_proveedor a ON  p.numdoc_nexos=a.id_proveedor
			WHERE a.actividad='Poseedor Vehiculo' AND p.numdoc_nexos=" . $id_proveedor . "";
		$result4 = $Data->getConsulta($sql4);
		$return["result4"] = $result4["rowsData"];

		break;
}n 


$return["result"] = $result["rowsData"];
echo json_encode($return);
