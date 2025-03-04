<?php 
	include("../application/Config.php");
	include '../application/Conexion.php';
	include '../application/Model.php';
	include '../models/modulosModel.php';
	date_default_timezone_set('America/Bogota');

	$_msg_error = "";
	$_msg_control = "Entro en internacional_ajax.php\n";
	$_msg_content = Array();
	$_array_result = Array();

	$Modulos = new modulosModel;

	$return["get"] = $_GET;
	$return["post"] = $_POST;
	if ( isset($_FILES) ) {
		$return["file"] = $_FILES;
	}

	switch ( $_POST["action"] ) {
		/***** CASOS PARA EL MÓDULO DE MÓDULOS (LÍNEAS DE NEGOCIO) *****/
		case 'crear_modulo':
			$_msg_control.= "Entro en la acción crear_modulo.\n";

			$array = Array();
			$array["nombre"] = $_POST["nombre"];
			$array["descripcion"] = $_POST["descripcion"];
			$Modulos->setModulo($array);
			break;

		case 'editar_modulo':
			$_msg_control.= "Entro en la acción editar_modulo.\n";

			// Se actualiza los datos del módulo 
			$array = Array();
			$array["nombre"] = $_POST["nombre"];
			$array["descripcion"] = $_POST["descripcion"];
			$Modulos->updateModulo($array, $_POST["id"]);
			break;

		case 'cambiar_estado_modulo':
			$_msg_control.= "Entro en la acción cambiar_estado_modulo.\n";

			// Se cambia el estado del módulo 
			$array = Array();
			$array["estado"] = $_POST["estado"];
			$Modulos->updateModulo($array, $_POST["id"]);
			break;

		
		/***** FIN - CASOS PARA EL MÓDULO DE MÓDULOS (LÍNEAS DE NEGOCIO) *****/

		/***** CASOS PARA EL MÓDULO DE MENÚS *****/
		case 'crear_menu':
			$_msg_control.= "Entro en la acción crear_menu.\n";

			$array = Array();
			$array["nom_menu"] = $Modulos->limpiaTexto($_POST["nombre"]);
			$Modulos->setMenu($array);
			break;

		case 'editar_menu':
			$_msg_control.= "Entro en la acción editar_menu.\n";

			// Se actualiza los datos del módulo 
			$array = Array();
			$array["nom_menu"] = $Modulos->limpiaTexto($_POST["nombre"]);
			$Modulos->updateMenu($array, $_POST["id"]);
			break;

		case 'cambiar_estado_menu':
			$_msg_control.= "Entro en la acción cambiar_estado_menu.\n";

			// Se cambia el estado del módulo 
			$array = Array();
			$array["estado"] = $_POST["estado"];
			$Modulos->updateMenu($array, $_POST["id"]);
			break;

		case 'ordenar_menu':
			$_msg_control.= "Entro en la acción ordenar_menu.\n";

			foreach ($_POST["array"] as $key => $value) {
				$array = Array();
				$array["orden"] = $value["orden"];
				$Modulos->updateMenu($array, (int)$value["id"]);
			}
			break;
		/***** FIN - CASOS PARA EL MÓDULO DE MENÚS *****/

		/***** CASOS PARA EL MÓDULO DE SUBMENÚS *****/
		case 'buscar_submenus';
			$_msg_control.= "Entro en la acción buscar_submenus.\n";
			$result = $Modulos->getSubmenu($_POST["id"]);
			$_array_result = $result;
			break;

		case 'crear_submenu':
			$_msg_control.= "Entro en la acción crear_submenu.\n";

			$array = Array();
			$array["id_menu"] = $Modulos->limpiaTexto($_POST["id_menu"]);
			$array["menu"] = str_replace(" ", "_", $Modulos->limpiaTexto($_POST["menu"]));
			$array["metodo"] = str_replace(" ", "_", $Modulos->limpiaTexto($_POST["metodo"]));
			$array["titulo"] = $Modulos->limpiaTexto($_POST["titulo"]);
			$array["orden"] = $Modulos->limpiaTexto($_POST["orden"]);
			$Modulos->setSubmenu($array);
			break;

		case 'editar_submenu':
			$_msg_control.= "Entro en la acción editar_submenu.\n";

			$array = Array();
			$array["menu"] = str_replace(" ", "_", $Modulos->limpiaTexto($_POST["menu"]));
			$array["metodo"] = str_replace(" ", "_", $Modulos->limpiaTexto($_POST["metodo"]));
			$array["titulo"] = $Modulos->limpiaTexto($_POST["titulo"]);
			$Modulos->updateSubmenu($array, $_POST["id"]);
			break;

		case 'cambiar_estado_submenu':
			$_msg_control.= "Entro en la acción cambiar_estado_submenu.\n";

			// Se cambia el estado del módulo 
			$array = Array();
			$array["estado"] = $_POST["estado"];
			$Modulos->updateSubmenu($array, $_POST["id"]);
			break;

		case 'ordenar_submenu':
			$_msg_control.= "Entro en la acción ordenar_submenu.\n";

			// Se actualiza el oreden de los submenús
			foreach ($_POST["array"] as $key => $value) {
				$array = Array();
				$array["orden"] = $value["orden"];
				$Modulos->updateSubmenu($array, (int)$value["id"]);
			}
			break;

		case 'asigna_modulo':
			$_msg_control.= "Entro en la acción asigna_modulo.\n";
			$array = Array();
			if (isset($_POST["array"])) { $array = $_POST["array"]; }
			$Modulos->asignaModulo($array, (int)$_POST["id_submenu"], (int)$_POST["id_usuario"]);
			break;

		case 'cambiar_menu':
			$_msg_control.= "Entro en la acción cambiar_menu.\n";

			// Se actualiza el menú del submenú
			$array = Array();
			$array["id_menu"] = $_POST["id_menu"];
			$array["orden"] = $_POST["orden"];
			$Modulos->updateSubmenu($array, (int)$_POST["id_submenu"]);

			$sql = '
				UPDATE cmx_submenu
				SET orden = (orden - 1)
				WHERE orden > ' . $_POST["orden_otros"] . '
					AND id_menu = ' . $_POST["id_menu_otros"] . ';
			';
			$Modulos->ejecuteSubmenu($sql);

			break;
		/***** FIN - CASOS PARA EL MÓDULO DE SUBMENÚS *****/

		default:
			$_msg_error.= "<p>Error en la selección del action.</p>\n";
			break;
	}

	$return["control"] = $_msg_control;
	if ( $_msg_error ) {
		$return["error"] = $_msg_error;
	}
	if ( $_array_result ) {
		$return["result"] = $_array_result;
	}
	if ( $_msg_content ) {
		$return["content"] = $_msg_content;
	}

	$return["result"] = $result["rowsData"];

	echo json_encode($return);

?>
