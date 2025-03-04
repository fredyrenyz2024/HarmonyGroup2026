<?php
print_r("Entro en editar.php\n");
include("../application/Config.php");
include '../application/Conexion.php';

$Data = new Consultas;
$Data2 = new Conexion;
$PDO = $Data2->conectar();
$table = $_GET['tabla'];

// print_r($_POST);
// print_r("\n");

$array = array();

foreach ($_POST as $key => $value) {
	if ($key != 'id') {
		$array[$key] = $value;
	}
}
// print_r($array);

// filtro de invalidación de adjuntos obligatorios
if ($_GET['tabla'] == "cmx_actividades_plantilla") {
	if (!isset($_POST["adjunto"])) {
		$array["adjunto"] = 0;
	}
}

$arrayId = explode(",", $_POST["id"]);
if (count($arrayId) > 1) {
	print_r("hay varios un id en el post\n");
	for ($i = 0; $i < (count($arrayId) - 1); $i++) {
		// print_r("\nentro en for " . $i . " \n");
		// print_r($arrayId[$i] . "\n");
		print_r($Data->updateRegistro($table, $array, $arrayId[$i]));

		// Si el registro a actualizar es de las actividades se busca si es simultanea 
		if ($table == "cmx_importacion_actividades") {
			$sql = '
					SELECT 
						simultaneo, id_importacion
					FROM 
						' . $table . '
					WHERE 
						id = ' . $arrayId[$i] . '
						AND simultaneo != "0"
				';
			// $result = $Data->getConsulta($sql);
			$result = $PDO->prepare($sql);
			$result->execute();
			$result = $result->fetch();
			// print_r($sql);
			// print_r($result);

			if ($result) {
				$sql = '
						UPDATE
							' . $table . ' 
						SET 
							estado = 2,
							fecha_hora_inicio = "' . $array["fecha_hora_inicio"] . '"
						WHERE 
							id_importacion = ' . $result[1] . '
							AND simultaneo = "' . $result[0] . '"
					';
				$result = $Data->getConsulta($sql);
				// print_r($result);
			}
		}
	}
} else {
	print_r("Solo hay un id en el post\n");
	print_r($Data->updateRegistro($table, $array, (int)$_POST['id']));
	print_r("\nEl id de la tabla " . $_GET['tabla'] . " es " . $_POST['id'] . "\n");
}
