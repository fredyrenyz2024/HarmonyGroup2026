<?php
// include '../application/Conexion.php';
// require_once '../application/Config.php';
// require_once 'PHPMailer/class.phpmailer.php';
// require_once 'PHPMailer/class.smtp.php';
// // session_start();

// class emailtrafico
// {
//     public $user_log;
//     public $mensaje;
//     public $respuesta;

//     public function enviar_correo()
//     {
//         $_msg_error = "";
//         $model    = new Conexion;
//         $conexion = $model->conectar();

//         $clientenombre = $_POST["cliente"];
//         //$mensaje=$_POST["mensaje"];
//         $receptor = $_POST["para"];
//         $receptor2 = 'desarrolladores@nexosgroup.com';
//         $iniruta = $_POST["iniruta"];
//         $servicio = $_POST["servicio"];
//         $correoenvio = explode(",", $receptor);
//         $factual = date('Y-m-d');
//         $hactual = date('G:i:h');
//         $user = $_SESSION["usuario"]["nom_usuario"];

//         //Consultar seguimientos
//         $sql = "SELECT se.id,se.tipo_seguimiento,
//                 se. observacion,
//                 se.fecha, se.hora, se.usuario,se.reporte_cliente,
//                 mn.municipio, n.novedad, ser.id_servicio
//                 FROM    
//                 cmx_inicio_seguimiento se
//                 LEFT JOIN  cmx_municipios mn ON se.detalle_tipo=mn.id
//                 LEFT JOIN cmx_para_novedades_seguimiento n ON se.novedad=n.id
//                 INNER JOIN cmx_seguimiento_servicio ser ON se.id=ser.id_seguimiento 
//                 WHERE se.cod_ini_ruta=" . $iniruta . " AND se.reporte_cliente='si'
//                 AND ser.id_servicio=" . $servicio . "";
//         $consulta = $conexion->prepare($sql);
//         $consulta->execute();
//         $datos_seguimiento = $consulta->fetchAll();
//         //print_r($datos_seguimiento);
//         //Construcción del envio de correos
//         require '../libs/PHPMailer/PHPMailerAutoload.php';
//         //Create a new PHPMailer instance
//         $mail = new PHPMailer();
//         $mail->IsSMTP();
//         //$mail->isMail();
//         $mail->isHTML = (true);
//         $mail->CharSet = 'UTF-8';
//         //$mail->From = 'fredyrenyz@hotmail.com'; 
//         $mail->SMTPDebug = 0;
//         $mail->SMTPAuth = true;
//         $mail->SMTPSecure = 'tls'; //seguridad
//         $mail->Host = "smtp.gmail.com"; // servidor 
//         $mail->Port = 587; //puerto
//         $mail->Username = 'soportenexosgroup@gmail.com'; //nombre usuario
//         $mail->Password = 'Nexosdesarrollo2017'; //contraseña
//         $mail->SetFrom($receptor2, 'Mailer');
//         //Agregar destinatario
//         for ($i = 0; $i < count($correoenvio); $i++) {
//             //$receptorfinal=$correoenvio[$i];
//             //echo $correoenvio[$i];
//             $mail->AddAddress($correoenvio[$i]);
//             //$mail->addBcc($mail);
//         }

//         $mensaje = "<html><body>";
//         $mensaje .= "<p style='font-weight:700; font-size:14pt;'>Informe de seguimiento vehícular, solicitud de servicio N° " . $servicio . ": </p>";
//         $mensaje .= "<table width='100%' bgcolor='' cellpadding='2' cellspacing='1' border='1'      style='color:black;'>";
//         $mensaje .= '<thead style="background-color:"#262626">
//                     <th>Solicitud servicio</th>
//                     <th>Ubicación</th>
//                     <th>Fecha</th>
//                     <th>Hora</th>
//                     <th>Novedad</th>
//                 </thead>';
//         foreach ($datos_seguimiento as $value) {
//             $mensaje .= '<tr>' .
//                 '<td>' . $value[9] . '</td>' .
//                 '<td>' . $value[7] . '</td>' .
//                 '<td>' . $value[3] . '</td>' .
//                 '<td>' . $value[4] . '</td>' .
//                 '<td>' . $value[8] . '</td>' .
//                 '</tr>';
//         }

//         $mensaje .= "</table>";
//         $mensaje .= "</body></html>";
//         $mail->Subject = "";
//         $mail->Body = $mensaje;
//         $mail->AltBody = $mensaje;
//         if ($mail->Send()) {
//             // echo'<script type="text/javascript">
//             //           alert("Enviado Correctamente");
//             //        </script>';
//             $sqlm = "INSERT INTO cmx_mail_enviados (id,id_servicio,id_fecha_parametro,fecha,hora,usuario,modalidad)
//                     VALUES(null," . $servicio . ",0,'" . $factual . "','" . $hactual . "','" . $user . "','Manual')";
//             $registro = $conexion->prepare($sqlm);
//             $registro->execute();
//             $return["success"] = true;
//         } else {
//             // echo'<script type="text/javascript">
//             //           alert("NO ENVIADO, intentar de nuevo");
//             //        </script>';
//             $return["success"] = false;
//         }
//         // $return["success"] = true;	
//         // $return["error"] = $_msg_error;
//         return $return;
//     }
// }
