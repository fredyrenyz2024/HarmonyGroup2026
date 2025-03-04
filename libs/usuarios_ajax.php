<?php
	include("../application/Config.php");
	include '../application/Conexion.php';
	include '../application/Model.php';
	//incluir archivos para crear correo
	require_once 'PHPMailer/class.phpmailer.php';
	require_once 'PHPMailer/class.smtp.php';


	$Data = new Consultas;
	$Model = new Model;

	$_msg_control = '';
	$_msg_error = '';
	$_msg_content = '';
	$_time = date('Y-m-d H:i:s', time());
	$_date = date('Y-m-d', time());

	switch ( $_POST["action"] ) {
		//cambiar clave mi cuenta
		case 'cambiar_clave_bd':
			$_msg_control.= "Entro en cambiar mi clave";
			$id_usuario=$_POST["id_usuario"];
			$pass=sha1($_POST["pass"]);

			// echo 'ID'.$id_usuario;
			// echo 'PASS'.$pass;

			$sql='UPDATE cmx_usuarios
			SET reset_pass="'.$pass.'" , pass="'.$pass.'"
			WHERE id='.$id_usuario.'  ';
			 // echo $sql;
			  $result= $Data->ejecuteRegistro($sql);

			  if($result){
				$sql2='UPDATE cmx_usuarios_claves
				SET pass="'.$pass.'"
				WHERE id_usuario='.$id_usuario.'  
				and estado="Activo"  ';
				 // echo $sql2;
				 $result= $Data->ejecuteRegistro($sql2);
			 }

		break;

		// Casos para el módulo de perfiles 
		case 'crea_perfil':
			$_msg_control.= "Entro en crea_perfil\n";
			$array = Array();
			$array["tipo_perfil"] = $Model->limpiaTexto($_POST["tipo_perfil"]);
			$array["nombre_perfil"] = $Model->limpiaTexto($_POST["nombre_perfil"]);
			$Data->setRegistro("cmx_perfiles", $array);
			break;

		case 'ver_modulos_perfil':
			$_msg_control.= "Entro en ver_modulos_perfil\n";
			$id_perfil = $_POST["id"];
			$nombre = $_POST["nombre"];
			$autor = $_POST["autor"];

			$_table = '
				<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible">
					<div class="icon"><span class="mdi mdi-alert-triangle"></span></div>
					<div class="message">
						<strong>Atencion!</strong>
						<p>No enconstraron módulos para ser asignados al perfil <strong>' . $nombre . '</strong>.</p>
					</div>
				</div>
			';

			$sql = '
				SELECT *,
					(	SELECT COUNT(cmp1.id)
						FROM cmx_modulos_perfil cmp1
						WHERE cmp1.id_modulo = cmo.id
							AND cmp1.id_perfil = ' . $id_perfil . '
					) CUANTOS
				FROM cmx_modulos cmo
				WHERE cmo.estado = "Activo"
			';
			$result = $Data->getConsulta($sql);

			if ($result) {
				$_table_content = ''; 
				foreach ($result["rowsData"] as $key => $value) {
					// Se valida si el perfil ya tiene el módulo asignado 
					$_checked = '';
					if ($value["CUANTOS"] > 0) { $_checked = ' checked '; }

					$_table_content.= '
						<tr>
							<td>
								<div class="be-checkbox">
									<center>
										<input type="checkbox" class="check_solo_1 check_1_' . $id_perfil . '" name="check_' . $value[0] . '" id="check_' . $value[0] . '" value="' . $value[0] . '" data-id_perfil="' . $id_perfil . '" data-autor="' . $autor . '" ' . $_checked . '>
										<label for="check_' . $value[0] . '"></label>
									</center>
								</div>
							</td>
							<td class="cell-detail">
								<span>' . $value["nombre"] . '</span>
								<span class="cell-detail-description">' . $value["descripcion"] . '</span>
							</td>
						</tr>
					'; 
				}

				$_table = '
					<table class="table table-hover">
						<thead>
							<tr class="fila_modulo">
								<th class="col-xs-2 col-sm-2 col-md-2">
									<div class="be-checkbox">
										<center>
											<input type="checkbox" class="check_todos_1" id="check_todos_1_' . $id_perfil . '" data-id="' . $id_perfil . '">
											<label for="check_todos_1_' . $id_perfil . '"></label>
										</center>
									</div>
								</th>
								<th>Módulo</th>
							</tr>
						</thead>
						<tbody>' . $_table_content . '</tbody>
					</table>
				';
			}
			$_msg_content.= $_table;
			break;

		case 'cambia_modulo':
			$_msg_control.= "Entro en cambia_modulo\n";
			foreach ($_POST["id_modulo"] as $value) {
				if ($_POST["accion"] == "crear") {
					if ($value["flag"] == "true") {
						$sql = '
							SELECT cmp.id
							FROM cmx_modulos_perfil cmp
							WHERE cmp.id_modulo = ' . $value["id"] . '
								AND cmp.id_perfil = ' . $_POST["id_perfil"] . '
						';
						$result = $Data->getConsulta($sql);
						if (!$result) {
							$array = Array();
							$array["id_modulo"] = $value["id"];
							$array["id_perfil"] = $_POST["id_perfil"];
							$array["fecha_hora"] = $_time;
							$array["usuario_auditor"] = $value["autor"];
							$Data->setRegistro("cmx_modulos_perfil", $array);
						}
					}
				} else {
					$sql = '
						DELETE FROM cmx_modulos_perfil
						WHERE id_modulo = ' . $value["id"] . '
							AND id_perfil = ' . $_POST["id_perfil"] . '
					';
					$Data->ejecuteRegistro($sql);
				}
			}
			break;

		case 'ver_permisos_perfil':
			$_msg_control.= "Entro en ver_permisos_perfil\n";
			$accordeon = '';
			$sql = '
				SELECT *
				FROM cmx_menu cm
				WHERE cm.estado = 1
				ORDER BY cm.orden
			';
			$result = $Data->getConsulta($sql);
			$return["result"]["menu"] = $result["rowsData"];

			if ($result) {
				$accordeon = '<div id="accordion1" class="panel-group accordion">';

				foreach ($result["rowsData"] as $key => $value) {
					$sql = '
						SELECT 
							cs.id, cs.id_menu, cs.titulo,
							IF(
								(SELECT 
									COUNT(cmp1.id_perfil)
								FROM 
									cmx_menu_perfil cmp1
								WHERE 
									cmp1.id_submenu = cs.id
									AND cmp1.id_perfil = ' . $_POST["id"] . ') > 0
								,1,0
							) ACCESO,
							IF(
								(SELECT 
									COUNT(cmp1.id_perfil)
								FROM 
									cmx_menu_perfil cmp1
								WHERE 
									cmp1.id_submenu = cs.id
									AND cmp1.id_perfil = ' . $_POST["id"] . ') > 0
								,
								(SELECT 
									cmp1.adicionar
								FROM 
									cmx_menu_perfil cmp1
								WHERE 
									cmp1.id_submenu = cs.id
									AND cmp1.id_perfil = ' . $_POST["id"] . ')
								,0
							) ADICIONAR,
							IF(
								(SELECT 
									COUNT(cmp1.id_perfil)
								FROM 
									cmx_menu_perfil cmp1
								WHERE 
									cmp1.id_submenu = cs.id
									AND cmp1.id_perfil = ' . $_POST["id"] . ') > 0
								,
								(SELECT 
									cmp1.editar
								FROM 
									cmx_menu_perfil cmp1
								WHERE 
									cmp1.id_submenu = cs.id
									AND cmp1.id_perfil = ' . $_POST["id"] . ')
								,0
							) EDITAR,
							IF(
								(SELECT 
									COUNT(cmp1.id_perfil)
								FROM 
									cmx_menu_perfil cmp1
								WHERE 
									cmp1.id_submenu = cs.id
									AND cmp1.id_perfil = ' . $_POST["id"] . ') > 0
								,
								(SELECT 
									cmp1.eliminar
								FROM 
									cmx_menu_perfil cmp1
								WHERE 
									cmp1.id_submenu = cs.id
									AND cmp1.id_perfil = ' . $_POST["id"] . ')
								,0
							) ELIMINAR

						FROM 
							cmx_submenu cs
						WHERE 
							cs.id_menu = ' . $value[0] . '
						ORDER BY cs.orden;
					';
					$result_01 = $Data->getConsulta($sql);
					$_table_content = "";
					if ($result_01) {
						$return["result"]["acceso"][$value[0]] = $result_01["rowsData"];
						$_table_content = '
							<table class="table table-hover">
								<thead>
									<tr class="fila_permiso">
										<th>
											<div class="be-checkbox">
												<center>
													<input type="checkbox" class="check_todos" id="check_todos_' . $value[0] . '" data-id="' . $value[0] . '">
													<label for="check_todos_' . $value[0] . '"></label>
												</center>
											</div>
										</th>
										<th>Submenú</th>
										<th>Adicionar</th>
										<th>Editar</th>
										<th>Eliminar</th>
									</tr>
								</thead>
								<tbody>
						';
						$_panel_color = "default";
						foreach ($result_01["rowsData"] as $key_01 => $value_01) {
							$_checked = "";
							$_disabled = "disabled";
							if ($value_01["ACCESO"] == 1) {
								$_checked = "checked";
								$_panel_color = "success";
								$_disabled = "";
							}
							$_checked_adicionar = "";
							if ($value_01["ADICIONAR"] == 1) {
								$_checked_adicionar = "checked";
							}
							$_checked_editar = "";
							if ($value_01["EDITAR"] == 1) {
								$_checked_editar = "checked";
							}
							$_checked_eliminar = "";
							if ($value_01["ELIMINAR"] == 1) {
								$_checked_eliminar = "checked";
							}
							$_table_content.= '
								<tr>
									<td>
										<div class="be-checkbox">
											<center>
												<input type="checkbox" class="check_solo check_' . $value[0] . '" name="check_' . $value_01[0] . '" id="check_' . $value_01[0] . '" value="' . $value_01[0] . '" data-id_menu="' . $value[0] . '" ' . $_checked . '>
												<label for="check_' . $value_01[0] . '"></label>
											</center>
										</div>
									</td>
									<td class="cell-detail">
										<span>' . $value_01["titulo"] . '</span>
									</td>
									<td>
										<div class="be-checkbox">
											<center>
												<input type="checkbox" class="check_adicionar check_adicionar_' . $value[0] . '" name="check_adicionar_' . $value_01[0] . '" id="check_adicionar_' . $value_01[0] . '" value="' . $value_01[0] . '" ' . $_checked_adicionar . ' ' . $_disabled . '>
												<label for="check_adicionar_' . $value_01[0] . '"></label>
											</center>
										</div>
									</td>
									<td>
										<div class="be-checkbox">
											<center>
												<input type="checkbox" class="check_editar check_editar_' . $value[0] . '" name="check_editar_' . $value_01[0] . '" id="check_editar_' . $value_01[0] . '" value="' . $value_01[0] . '" ' . $_checked_editar . ' ' . $_disabled . '>
												<label for="check_editar_' . $value_01[0] . '"></label>
											</center>
										</div>
									</td>
									<td>
										<div class="be-checkbox">
											<center>
												<input type="checkbox" class="check_eliminar check_eliminar_' . $value[0] . '" name="check_eliminar_' . $value_01[0] . '" id="check_eliminar_' . $value_01[0] . '" value="' . $value_01[0] . '" ' . $_checked_eliminar . ' ' . $_disabled . '>
												<label for="check_eliminar_' . $value_01[0] . '"></label>
											</center>
										</div>
									</td>
								</tr>
							';
						}
						$_table_content.= '
								</tbody>
							</table>
						';
					}

					$accordeon.= '
						<div class="panel panel-default panel-border-color panel-border-color-' . $_panel_color . '" id="perfil_' . $value[0] . '">
							<div class="panel-heading">
								<h4 class="panel-title">
									<a data-toggle="collapse" data-parent="#accordion1" href="#accordion_' . $value[0] . '" class="collapsed" aria-expanded="false"><i class="icon mdi mdi-chevron-down"></i> ' . $value["nom_menu"] . '
										<span class="panel-subtitle"></span>
									</a>
								</h4>
							</div>
							<div id="accordion_' . $value[0] . '" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
								<div class="panel-body">
									' . $_table_content . '
								</div>
							</div>
						</div>
					';
				}

				$accordeon.= '
					</div>
				';
			}
			$_msg_content.= $accordeon;
			break;

		case 'cambia_acceso':
			$_msg_control.= "Entro en cambia_acceso\n";
			foreach ($_POST["id_submenu"] as $value) {
				if ($_POST["accion"] == "crear") {
					if ($value["flag"] == "true") {
						$array = Array();
						$array["id_submenu"] = $value["id"];
						$array["id_perfil"] = $_POST["id_perfil"];
						$Data->setRegistro("cmx_menu_perfil", $array);
					}
				} else {
					$sql = '
						DELETE FROM cmx_menu_perfil
						WHERE 
							id_submenu = ' . $value["id"] . '
							AND id_perfil = ' . $_POST["id_perfil"] . '
					';
					$Data->ejecuteRegistro($sql);
				}
			}
			break;

		case 'cambia_permiso':
			$_msg_control.= "Entro en cambia_permiso\n";
			if ($_POST["accion"] == "asignar") {
				$_estado = 1;
			} else {
				$_estado = 0;
			}
			$sql = '
				UPDATE cmx_menu_perfil
				SET ' . $_POST["campo"] . ' = ' . $_estado . '
				WHERE 
					id_submenu = ' . $_POST["id_submenu"] . '
					AND id_perfil = ' . $_POST["id_perfil"] . '
			';
			$Data->ejecuteRegistro($sql);
			break;

		case 'edita_perfil':
			$_msg_control.= "Entro en edita_perfil\n";
			$array = Array();
			$array["tipo_perfil"] = $Model->limpiaTexto($_POST["tipo_perfil"]);
			$array["nombre_perfil"] = $Model->limpiaTexto($_POST["nombre_perfil"]);
			if ( !$Data->updateRegistro("cmx_perfiles", $array, (int)$_POST['id']) ) {
				$_msg_error.= "<p>Error al editar el perfil.</p>";
			}
			break;

		case 'activa_perfil':
			$_msg_control.= "Entro en activa_perfil\n";
			$array = Array();
			$array["estado"] = 1;
			if ( !$Data->updateRegistro("cmx_perfiles", $array, (int)$_POST['id']) ) {
				$_msg_error.= "<p>Error al editar el perfil.</p>";
			}
			break;

		case 'inactiva_perfil':
			$_msg_control.= "Entro en inactiva_perfil\n";
			$array = Array();
			$array["estado"] = 0;
			if ( !$Data->updateRegistro("cmx_perfiles", $array, (int)$_POST['id']) ) {
				$_msg_error.= "<p>Error al editar el perfil.</p>";
			}
			break;

		// Casos para el módulo de usuarios 
		case 'busca_email_usuario':
			$_msg_control.= "Entro en busca_email_usuario\n";
			$sql = '
				SELECT COUNT(cu.id) CUANTOS
				FROM cmx_usuarios cu
				WHERE cu.email = "' . $Model->limpiaTexto($_POST["email"]) . '"
			';
			if (isset($_POST["id_usuario"])) {
				$sql = '
					SELECT COUNT(cu.id) CUANTOS
					FROM cmx_usuarios cu
					WHERE cu.email = "' . $Model->limpiaTexto($_POST["email"]) . '"
						AND cu.id != "' . $Model->limpiaTexto($_POST["id_usuario"]) . '"
				';
			}
			$result = $Data->getConsulta($sql);
			$return["cuantos"] = $result["rowsData"][0][0];
			break;

		case 'crea_usuario':
			$_msg_control.= "Entro en crea_usuario\n";
			$pass = "nxs" . mt_rand(10000,99999);
			$return["pass"] = $pass;
			$sha1_pass = sha1($pass);

			// Se crea el usuario 
			$array = Array();
			$array["nom_usuario"] = $Model->limpiaTexto( $_POST["nom_usuario"] );
			$array["user_log"] = $Model->limpiaTexto( $_POST["user_log"] );
			$array["email"] = $Model->limpiaTexto( $_POST["email"] );
			$array["pass"] = $Model->limpiaTexto($sha1_pass);
			$array["url_avatar"] = $Model->limpiaTexto( $_POST["url_avatar"] );
			$id = $Data->setRegistro("cmx_usuarios", $array);

			if ($id) {
				// Se asigna el perfil y cliente al usuario creado
				$array = Array();
				$array["id_cliente"] = $Model->limpiaTexto( $_POST["id_cliente"] );
				$array["id_usuario"] = $Model->limpiaTexto( $id );
				$array["id_perfil"] = $Model->limpiaTexto( $_POST["id_perfil"] );
				if (isset($_POST["id_bodega"]) AND $_POST["id_bodega"] != "") {
					$array["id_bodega"] = $Model->limpiaTexto( $_POST["id_bodega"] );
				}
				$Data->setRegistro("cmx_usuario_cliente", $array);

				// Se asigna el histórico de la clave y cliente al usuario creado
				$array = Array();
				$array["id_usuario"] = $Model->limpiaTexto( $id );
				$array["fecha"] = $Model->limpiaTexto( $_date );
				$array["pass"] = $Model->limpiaTexto( $sha1_pass );
				$array["autor"] = $Model->limpiaTexto( $_POST["autor"] );
				$array["fecha_audit"] = $Model->limpiaTexto( $_time );
				$Data->setRegistro("cmx_usuarios_claves", $array);
				//enviar los datos por correo

				require 'PHPMailer/PHPMailerAutoload.php';

				 //Create a new PHPMailer instance
                $mail = new PHPMailer();
                $mail->IsSMTP();
                $mail->CharSet = 'UTF-8'; 

                 //Configuracion servidor mail
                $mail->From = "soportenexosgroup@gmail.com"; //remitente
                $mail->SMTPAuth = true;
                $mail->SMTPSecure = 'tls'; //seguridad
                $mail->Host = "smtp.gmail.com"; // servidor smtp
                $mail->Port = 587; //puerto
                $mail->Username ='soportenexosgroup@gmail.com'; //nombre usuario
                $mail->Password = 'Nexosdesarrollo2017'; //contraseña
                 //Agregar destinatario
                $mail->AddAddress($_POST["email"] );
                $mail->Subject = "Creacion de usuario Nexos";
                $mail->Body ='Bienvenido a Nexos Group, su usuario es:'.$_POST["user_log"].' su contraseña es: '.$pass.'   ';
               // $mail->Send();
                if( $mail->Send()){
                	$_msg_content.='<p>Usuario creado correctamente, por favor verifique su correo electrónico</p>';
                }else{
                	$_msg_error.='<p>No se enviado </p>';
                	
                }

				// Contenido de la respuesta de la pantalla
				// $_msg_content.= '
				// 	<p>Se generado el usuario <strong>' . $_POST["nom_usuario"] . '</strong>. <strong class="text-danger">Por favor tome nota de la siguiente información</strong>.</p>
				// 	<p>
				// 		Los datos de acceso son:<br />
				// 		Usuario: <strong>' . $_POST["user_log"] . '</strong><br />
				// 		Clave: <strong>' . $pass . '</strong>
				// 	</p>
				// ';
			}
			break;

		case 'activa_usuario':
			$_msg_control.= "Entro en activa_usuario\n";
			$array = Array();
			$array["estado"] = 1;
			if ( !$Data->updateRegistro("cmx_usuarios", $array, (int)$_POST['id']) ) {
				$_msg_error.= "<p>Error al editar el usuario.</p>";
			}
			break;

		case 'inactiva_usuario':
			$_msg_control.= "Entro en inactiva_usuario\n";
			$array = Array();
			// Se inactiva el usuario
			$array["estado"] = 0;
			if ( !$Data->updateRegistro("cmx_usuarios", $array, (int)$_POST['id']) ) {
				$_msg_error.= "<p>Error al editar el usuario.</p>";
			}

			// Se quita la responsabilidad del usuario a los clientes 
			$sql = '
				UPDATE cmx_clientes_serv_responsables
				SET estado = 0
				WHERE id_usuario = ' . (int)$_POST['id'] . '
			';
			$Data->ejecuteRegistro($sql);
			break;

		case 'select_perfil_sm':
			$_msg_control.= "Entro en select_perfil_sm\n";
			$sql = '
				SELECT cp.id, cp.nombre_perfil
				FROM cmx_perfiles cp
				WHERE cp.tipo_perfil = "' . $_POST["tipo_perfil"] . '"
					AND cp.estado = 1
				ORDER BY cp.nombre_perfil
			';
			$result = $Data->getConsulta($sql);
			$return["result"] = $result["rowsData"];

			if ($result) {
				// Se recorre contenido de la consulta
				$select = '<select class="form-control input-sm" name="' . $_POST["name"] . '" id="slct_'. $_POST["id"] . '">';

				$select.= '<option value="" selected="" disabled="" >Seleccione</option>';
				foreach ($result['rowsData'] as $key => $value) {
					$select.= '<option value="' . $value[0] . '">' . $value[1] . '</option>';
				}
				$select.= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
			$_msg_content.= $select;
			break;

		case 'select_clientes_sm':
			$_msg_control.= "Entro en select_clientes_sm\n";
			$sql = '
				SELECT cc.id, cc.sigla,,cc.nombre
				FROM cmx_clientes cc
				WHERE cc.estado = 1
				ORDER BY cc.sigla
			';
			$result = $Data->getConsulta($sql);
			$return["result"] = $result["rowsData"];

			if ($result) {
				// Se recorre contenido de la consulta
				$select = '<select class="form-control input-sm" name="' . $_POST["name"] . '" id="slct_'. $_POST["id"] . '">';

				$select.= '<option value="" selected="" disabled="" >Seleccione</option>';
				foreach ($result['rowsData'] as $key => $value) {
					$select.= '<option value="' . $value[0] . '">' . $value[1] . '</option>';
				}
				$select.= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
			$_msg_content.= $select;
			break;

		case 'select_bodegas_sm':
			$_msg_control.= "Entro en select_bodegas_sm\n";
			$sql = '
				SELECT crd.id, crd.sigla
				FROM cmx_remitente_destinatario crd
					INNER JOIN cmx_bodegas cb ON cb.id_remtente_destinatario = crd.id
				WHERE crd.estado = 1
					AND cb.estado = 1
			';
			$result = $Data->getConsulta($sql);
			$return["result"] = $result["rowsData"];

			if ($result) {
				// Se recorre contenido de la consulta
				$select = '<select class="form-control input-sm" name="' . $_POST["name"] . '" id="slct_'. $_POST["id"] . '">';

				$select.= '<option value="" selected="" disabled="" >Seleccione</option>';
				foreach ($result['rowsData'] as $key => $value) {
					$select.= '<option value="' . $value[0] . '">' . $value[1] . '</option>';
				}
				$select.= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
			$_msg_content.= $select;
			break;

		case 'edita_usuario':
			$_msg_control.= "Entro en edita_usuario\n";
			$array = Array();
			$array["nom_usuario"] = $Model->limpiaTexto($_POST["nom_usuario"]);
			$array["email"] = $Model->limpiaTexto($_POST["email"]);
			$array["url_avatar"] = $Model->limpiaTexto($_POST["url_avatar"]);
			if ( $Data->updateRegistro("cmx_usuarios", $array, (int)$_POST['id']) ) {
				$_flag = "null";
				if ( isset($_POST["id_bodega"]) AND $_POST["id_bodega"]) { $_flag = $_POST["id_bodega"]; }
				$sql = '
					UPDATE cmx_usuario_cliente cuc
					SET cuc.id_perfil = ' . $_POST["id_perfil"] . ',
						cuc.id_cliente = ' . $_POST["id_cliente"] . ', 
						cuc.id_bodega = ' . $_flag . '
					WHERE cuc.id_usuario = ' . (int)$_POST['id'] . '
				';
				if ( !$Data->ejecuteRegistro($sql) ) { $_msg_error.= "<p>Error al editar el el perfil del usuario.</p>"; }
			} else { $_msg_error.= "<p>Error al editar el usuario.</p>"; }
			break;

		default:
			$_msg_control.= "Error en la selección de acción de archivo";
			$_msg_error.= "<p>Error en la selección de acción de archivo.</p>";
			break;
	}

	$return["control"] = $_msg_control;
	if ( $_msg_error ) {
		$return["error"] = $_msg_error;
	}
	if ( isset($_array_result) ) {
		$return["result"] = $_array_result;
	}
	if ($_msg_content) {
		$return["content"] = $_msg_content;
	}

	echo json_encode( $return );
?>
