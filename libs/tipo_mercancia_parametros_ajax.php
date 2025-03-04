<?php
include("../application/Config.php");
include '../application/Conexion.php';
include '../application/Model.php';

$Data = new Consultas;

switch($_REQUEST['action']) {
	case 'consultar_tipo_mercancia':
	 // echo 'entro a crear tipo merca';
				$tipo=$_REQUEST["tipo"];//nombre empresa al producto
				$numero_rndc=$_REQUEST["numero_rndc"];//Numero producto mintransporte
				$idtb=$_REQUEST["idtb"];//PK producto
				$id_capitulo=$_REQUEST["id_capitulo"];
				$sql='
					SELECT * FROM cmx_para_tipo_mercancia
					WHERE nombre="'.$tipo.'"
					AND id_producto_mn='.$idtb.'
					AND id_capitulo_mn='.$id_capitulo;		
				$result = $Data->getConsulta($sql);
			 	$return["result"] = $result["rowsData"];
	break;

	case 'crear_tipo_mercancia':
	 // echo 'entro a crear tipo merca';
				$estado=$_REQUEST["estado"];
				$name_nexos=$_POST["name_nexos"];
				$numero_rndc=$_POST["numero_rndc"];
				$idtb=$_POST["idtb"];
				$id_capitulo=$_POST["id_capitulo"];
				$sql='INSERT INTO cmx_para_tipo_mercancia
					(id,id_rndc,nombre,estado,id_producto_mn,id_capitulo_mn)
					VALUES(null,"'.$numero_rndc.'","'.$name_nexos.'","'.$estado.'","'.$idtb.'","'.$id_capitulo.'")';
				$result = $Data->ejecuteRegistro($sql);
			 	$return["result"] = $result["rowsData"];
	break;


	case 'Buscar_Registro_Producto': 
		$id=$_POST["id"];
		$sql="SELECT b.id, b.tipo, 
			c.descripcion, b.capitulo,
			a.nombre,a.estado, a.id AS idtb,
			a.id_producto_mn, a.id_capitulo_mn,
			b.codigo AS id_rndc
			FROM cmx_para_tipo_mercancia a
			INNER JOIN cmx_rndc_codificacion_producto b
			ON a.id_producto_mn=b.id
			INNER JOIN cmx_rndc_mercancia c
			ON a.id_capitulo_mn=c.id
			WHERE a.id=".$id;
		$result = $Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
	break;


	case 'actualizar':
	// echo 'entro a crear tipo vejiculo';
				$id=$_REQUEST["id"];
				$nom=$_REQUEST["nom"];
				$estado=$_REQUEST["estado"];
				$sql='
					UPDATE cmx_para_tipo_mercancia 
					SET nombre="'.$nom.'", estado="'.$estado.'"
					WHERE id="'.$id.'"';		
				$result = $Data->ejecuteRegistro($sql);
			 	$return["result"] = $result["rowsData"];
	break;

	case 'buscar_mercancia_rndc':
		$sql="SELECT b.descripcion, a.codigo AS id_rndc,
			a.capitulo, a.tipo, a.partida, a.id
			FROM cmx_rndc_codificacion_producto a
			INNER JOIN cmx_rndc_mercancia b
			ON  a.tipo=b.naturaleza LIMIT 10000000";
		$result = $Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
	break;

	case 'consulta_producto':
		$producto=$_POST['producto'];
		$sql="SELECT id_rndc,capitulo 
			FROM cmx_para_tipo_mercancia2
			WHERE id_rndc=".$producto;
		$result = $Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
	break;

	default:
	break;

}

$return["result"] = $result["rowsData"];
echo json_encode($return);

?>