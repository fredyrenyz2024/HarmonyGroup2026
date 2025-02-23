<?php
//include '../application/Conexion.php';
//require_once '../application/Config.php';
//$model    = new Conexion;
//$conexion = $model->conectar();
//include("vehiculosModel.php");
 $placa = $_POST["placa"];
//echo "<script> alert('".$placa."');</script>";
$model = new Vehiculos();
$model->listarVehiculos($placa);


?>

