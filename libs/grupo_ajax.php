<?php
include("../application/Config.php");
include '../application/Conexion.php';
include '../application/Model.php';
session_start();
$Data = new Consultas;

switch($_REQUEST['action']) {
	case 'consultar_cliente':
		$sql="SELECT cli.*
				FROM cmx_clientes cli
				INNER JOIN cmx_clientes_serv_contratados ccsc
				ON cli.id=ccsc.id_cliente
				WHERE cli.estado=1 
				AND ccsc.servicio IN ('Transporte de Carga Nacional','Transporte de Carga Internacional') 
				GROUP BY cli.id
				ORDER BY cli.nombre ASC";
		$result=$Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
	break;

	case 'consultar_cliente_tabla':
		$sql="SELECT  cl.id, cl.nombre, cl.documento
			FROM cmx_clientes cl
			INNER JOIN cmx_cliente_hora ch
			ON cl.id=ch.id_cliente
			GROUP BY ch.id_cliente
			ORDER BY cl.nombre ASC";
		$result=$Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
	break;

	case 'consultar_grupo':
		//$sql="SELECT * FROM cmx_grupo";
		$sql="SELECT cl.nombre, cl.documento, cl.id
				FROM cmx_grupo g
				INNER JOIN cmx_clientes cl
				ON g.id_cliente=cl.id
				GROUP BY cl.nombre";
		$result=$Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
	break;

	case 'tabla_grupos':
		$grupo=$_POST["grupo"];
		/*$sql="SELECT g.*, cl.nombre
			FROM cmx_grupo g 
			INNER JOIN cmx_clientes cl
			ON g.id_cliente=cl.id
			WHERE g.estado=1  
			AND g.nombre_grupo='".$grupo."'";*/
		$sql="SELECT g.*, cl.nombre
			FROM cmx_grupo g 
			INNER JOIN cmx_clientes cl
			ON g.id_cliente=cl.id
			WHERE g.estado=1  
			AND cl.id=".$grupo;		
		$result=$Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
	break;

	case 'indagar_grupo':
		$idgrupo=$_POST["idgrupo"];
		$sql="SELECT g.*,c.nombre 
			FROM cmx_grupo g
			inner join cmx_clientes c
			ON g.id_cliente=c.id
			WHERE g.id=".$idgrupo."";
		$result=$Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
		//Contactos
		$sql2="SELECT * FROM cmx_grupo_contacto_cliente
			WHERE idgrupo=".$idgrupo."";
		$result2=$Data->getConsulta($sql2);
		$return["result2"] = $result2["rowsData"];
	break;
	//editar
	case 'indagar_grupoe':
		$idgrupo=$_POST["idgrupo"];
		$sql="SELECT g.*,c.nombre 
			FROM cmx_grupo g
			inner join cmx_clientes c
			ON g.id_cliente=c.id
			WHERE g.id=".$idgrupo."";
		$result=$Data->getConsulta($sql);

		$sqlc="SELECT * FROM cmx_clientes";
		$resultm=$Data->getConsulta($sqlc);
		$array_cliente = Array();

		foreach ($resultm["rowsData"] as $index => $element) {
			if(strcasecmp($element['id'], $result["rowsData"][0]['id_cliente']) == 0){
				$array_cliente[$index]['selected'] = true;
			}else{
				$array_cliente[$index]['selected'] = false;
			}
			$array_cliente[$index]['id']  = $element['id'];
			$array_cliente[$index]['nombre']  = $element['nombre'];
		}
		$result["rowsData"][0]['clienten'] = $array_cliente;
		$return["result"] = $result["rowsData"];
		//Contactos
		$sql2="SELECT * FROM cmx_grupo_contacto_cliente
			WHERE idgrupo=".$idgrupo."";
		$result2=$Data->getConsulta($sql2);
		$return["result2"] = $result2["rowsData"];
	break;


	case 'eliminar_contacto':
		$id=$_POST["id"];
		$sql="DELETE FROM cmx_grupo_contacto_cliente
			WHERE id=".$id."
		";
		$result=$Data->ejecuteRegistro($sql);
		$return["result"] = $result["rowsData"];
	break;


	//Novedades de seguimiento parametros

	case 'registrarnovedad':
		$novedad1=$_POST["novedad1"];
		$inter1=$_POST["inter1"];
		$color=$_POST["color"];
		$alerta1=$_POST["alerta1"];
		$codigo1=$_POST["codigo1"];
		$alarma1=$_POST["alarma1"];
		$solicita1=$_POST["solicita1"];
		$sql="INSERT INTO cmx_para_novedades_seguimiento
			(id,novedad,genera_alerta,color_alerta,codigo,solicita_tiempo,interpretacion,alarma)
			VALUES(null,'".$novedad1."','".$alerta1."','".$color."',".$codigo1.",'".$solicita1."','".$inter1."','".$alarma1."')";
		$result=$Data->ejecuteRegistro($sql);
		$return["result"] = $result["rowsData"];
	break;

	case 'buscar_novedad':
		$nom=$_POST["nom"];
		$sql="SELECT * FROM cmx_para_novedades_seguimiento
			WHERE novedad  LIKE '%".$nom."%'";
		$result=$Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
	break;

	case 'traer_aedicion':
		$id=$_POST["id"];
		$sql="SELECT * FROM cmx_para_novedades_seguimiento
			WHERE id=".$id."";
		$result=$Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
	break;

	case 'actualice_novedad':
		$nove=$_POST["nove"];
		$color=$_POST["color"];
		$inter=$_POST["inter"];
		$idt=$_POST["idt"];
		$alerta=$_POST["alerta"];
		$alarma=$_POST["alarma"];
		$solicita=$_POST["solicita"];
		$codigo=$_POST["codigo"];

		$sql="UPDATE cmx_para_novedades_seguimiento
		SET novedad='".$nove."',
		genera_alerta='".$alerta."',
		color_alerta='".$color."',
		codigo=".$codigo.",
		solicita_tiempo='".$solicita."',
		interpretacion='".$inter."',
		alarma='".$alarma."'
		WHERE id=".$idt."";
		
		$result=$Data->ejecuteRegistro($sql);
		$return["result"] = $result["rowsData"];
	break;



}
$return["result"] = $result["rowsData"];
echo json_encode($return);
?>