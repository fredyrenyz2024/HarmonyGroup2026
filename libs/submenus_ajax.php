<?php
include("../application/Config.php");
include '../application/Conexion.php';
include '../application/Model.php';
$Data = new Consultas;
switch($_REQUEST['action']) {

	case 'traer submenus':
				
		$sql="SELECT m.nom_menu, su.titulo, su.id FROM cmx_menu m
		INNER JOIN cmx_submenu  su
		ON m.id=su.id_menu
		WHERE su.estado=1;
		";
		$result = $Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];		
				
	break;	

	case 'traer_modulo':		
		$sql="
				SELECT id,nombre FROM cmx_modulos
				WHERE estado='Activo'
		";
		$result = $Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];				
	break;	

	case 'crear_submenumodulo':	
		$a=$_REQUEST["submemu"];
		$b=$_REQUEST["modulo"];
		$user=$_REQUEST["user"];
		$fecha=date('Y-m-d G:i:s');
		$sql="
			INSERT INTO cmx_modulos_submenu(id_modulo,id_submenu,fecha_hora,usuario_auditor)
			VALUES(".$b.",".$a.",'".$fecha."',".$user.")	
		";
		// echo $sql;
		$result = $Data->ejecuteRegistro($sql);
		$return["result"] = $result["rowsData"];				
	break;	




		default:
		break;

}

 $return["result"] = $result["rowsData"];
echo json_encode($return);


?>