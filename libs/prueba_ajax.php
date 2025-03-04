<?php 
	include("../application/Config.php");
	include '../application/Conexion.php';
	include ('../application/Model.php');	


	$_msg_error = "";
	$_msg_control = "Entro en prueba_ajax.php\n";
	$_array_result = Array();

	$Data = new Consultas;
	$Model = new Model;

/* ___________________________estados y llenado de la tabla _______________________ */	
	//guardar todo el cuerpo del ajax en la variable return para encriptarlo y enviarlo al modelo
	$return["get"] = $_GET;
	$return["post"] = $_POST;

	switch ( $_POST["action"] ) {
		case 'cambiarEstado':
			$_msg_control.= "Entro en la accion cambiarEstado.\n";
			$array = array(
				"estado" => $_POST["estado"]
			);
			$Data->updateRegistro("cmx_fletes", $array, (int)$_POST["id"]);
			break;

		default:
			$_msg_error.= "Error en la seleccion del action.\n";
			break;



/*_________________________________ crear prueba_______________________________*/
		case 'crea_prueba':
			$_msg_control.= "Entro en crea_prueba\n";

			// Se crea el usuario 
			$array = Array();
			$array["texto"] = $Model->limpiaTexto( $_POST["descri_prueba"] );
			$Data->setRegistro("prueba", $array);


			//traer el id del registro que ya se creo y realizar alguna acciòn con este, en este caso se realizo otro registro
			//$id = $Data->setRegistro("cmx_usuarios", $array);
			/*if ($id) {
				// Se asigna el perfil y cliente al usuario creado
				$array = Array();
				$array["id_cliente"] = $Model->limpiaTexto( $_POST["id_cliente"] );
				$array["id_usuario"] = $Model->limpiaTexto( $id );
				$array["id_perfil"] = $Model->limpiaTexto( $_POST["id_perfil"] );
				if (isset($_POST["id_bodega"]) AND $_POST["id_bodega"] != "") {
					$array["id_bodega"] = $Model->limpiaTexto( $_POST["id_bodega"] );
				} 

				$Data->setRegistro("cmx_usuario_cliente", $array);
			}
			*/
			break;



	}

	$return["control"] = $_msg_control;
	if ( $_msg_error ) {
		$return["error"] = $_msg_error;
	}
	if ( $_array_result ) {
		$return["result"] = $_array_result;
	}




	echo json_encode($return);
?>
