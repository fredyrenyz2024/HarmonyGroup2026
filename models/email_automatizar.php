<?php
// // include '../application/Conexion.php';
// require_once '../application/Config.php';
// require_once 'PHPMailer/class.phpmailer.php';
// require_once 'PHPMailer/class.smtp.php';
// // session_start();
// class emailautomatico
// {
//     public $user_log;
//     public $mensaje;
//     public $respuesta;

//     public function enviar_correo_automatico()
//     {
//         $contador = 0;
//         $contador_grupo = 0;
//         $_msg_error = "";
//         $model    = new Conexion;
//         $conexion = $model->conectar();
//         //PARÁMETROS
//         $clientenombre = $_POST["cliente"];
//         $iniruta = $_POST["iniruta"];
//         $servicio = $_POST["servicio"];
//         $factual = date('Y-m-d');
//         $hactual = date('G:i:h');
//         $user = $_SESSION["usuario"]["nom_usuario"];
//         $receptor2 = 'desarrolladores@nexosgroup.com';
//         //CONSULTAS
//         //Horas de envio seleccionadas
//         $sql4 = "SELECT cl.*, a.nombre FROM cmx_horacliente_servicio cs 
//             INNER JOIN cmx_cliente_hora cl ON cs.hora_email=cl.id 
//             INNER JOIN cmx_clientes a ON cl.id_cliente=a.id 
//             LEFT JOIN cmx_mail_enviados me  ON cl.id=me.id_fecha_parametro AND me.fecha='" . $factual . "' WHERE cs.id_servicio=" . $servicio . " AND '" . $factual . "' 
//             BETWEEN cl.fecha_inicio AND cl.fecha_final AND cl.hora_envio <= '" . $hactual . "'  AND me.id_fecha_parametro IS NULL";
//         $consulta = $conexion->prepare($sql4);
//         $consulta->execute();
//         $total = $consulta->rowCount();
//         //realizar la otra consulta
//         //recorrerla
//         $hora_envio = $consulta->fetchAll();
//         if ($total > 0) { //SI TRAE REGISTROS LA CONSULTA - envia email
//             //Correos destinatarios
//             $sql = "SELECT g.email
//                 FROM cmx_grupocliente_servicio gs
//                 INNER JOIN cmx_grupo_contacto_cliente g ON gs.id_grupo=g.idgrupo
//                 INNER JOIN cmx_clientes cl ON g.idcliente=cl.id
//                 WHERE cl.nombre='" . $clientenombre . "' AND gs.id_servicio=" . $servicio . "";
//             $consultae = $conexion->prepare($sql);
//             $consultae->execute();
//             $contador_grupo = $consultae->rowCount();
//             $correo_receptor1 = $consultae->fetchAll();
//             //Consultar seguimientos
//             $sqls = "SELECT se.id,se.tipo_seguimiento,
//                     se. observacion,
//                     se.fecha, se.hora, se.usuario,se.reporte_cliente,
//                     mn.municipio, n.novedad, ser.id_servicio
//                     FROM    
//                     cmx_inicio_seguimiento se
//                     LEFT JOIN  cmx_municipios mn ON se.detalle_tipo=mn.id
//                     LEFT JOIN cmx_para_novedades_seguimiento n ON se.novedad=n.id
//                     INNER JOIN cmx_seguimiento_servicio ser ON se.id=ser.id_seguimiento 
//                     WHERE se.cod_ini_ruta=" . $iniruta . " AND se.reporte_cliente='si'
//                     AND ser.id_servicio=" . $servicio . "";
//             $consulta_se = $conexion->prepare($sqls);
//             $consulta_se->execute();
//             $contador = $consulta_se->rowCount();
//             $datos_seguimiento = $consulta_se->fetchAll();
//             // SI EXISTEN SEGUIMIENTOS Y CORREOS DE  DESTINOS
//             if ($contador > 0 && $contador_grupo > 0) {
//                 //Construcción del envio de correos
//                 require '../libs/PHPMailer/PHPMailerAutoload.php';
//                 //Create a new PHPMailer instance
//                 $mail = new PHPMailer();
//                 $mail->IsSMTP();
//                 //$mail->isMail();
//                 $mail->isHTML = (true);
//                 $mail->CharSet = 'UTF-8';
//                 //$mail->From = 'fredyrenyz@hotmail.com'; 
//                 $mail->SMTPDebug = 0;
//                 $mail->SMTPAuth = true;
//                 $mail->SMTPSecure = 'tls'; //seguridad
//                 $mail->Host = "smtp.gmail.com"; // servidor 
//                 $mail->Port = 587; //puerto
//                 $mail->Username = 'soportenexosgroup@gmail.com'; //nombre usuario
//                 $mail->Password = 'Nexosdesarrollo2017'; //contraseña
//                 $mail->SetFrom($receptor2, 'Mailer');
//                 //Agregar destinatario
//                 for ($i = 0; $i < $contador_grupo; $i++) {
//                     $mail->AddAddress($correo_receptor1[0][$i]);
//                 }
//                 $mensaje = "<html><body>";
//                 $mensaje .= "<p style='font-weight:700; font-size:14pt;'>Informe de seguimiento vehícular, solicitud de servicio N° " . $servicio . ": </p>";
//                 $mensaje .= "<table width='100%' bgcolor='' cellpadding='2' cellspacing='1' border='1'      style='color:black;'>";
//                 $mensaje .= '<thead style="background-color:"#262626">
//                         <th>Solicitud servicio</th>
//                         <th>Ubicación</th>
//                         <th>Fecha</th>
//                         <th>Hora</th>
//                         <th>Novedad</th>
//                     </thead>';
//                 foreach ($datos_seguimiento as $value) {
//                     $mensaje .= '<tr>' .
//                         '<td>' . $value[9] . '</td>' .
//                         '<td>' . $value[7] . '</td>' .
//                         '<td>' . $value[3] . '</td>' .
//                         '<td>' . $value[4] . '</td>' .
//                         '<td>' . $value[8] . '</td>' .
//                         '</tr>';
//                 }
//                 $mensaje .= "</table>";
//                 $mensaje .= "</body></html>";
//                 $mail->Subject = "";
//                 $mail->Body = $mensaje;
//                 $mail->AltBody = $mensaje;
//                 if ($mail->Send()) {
//                     // echo'<script type="text/javascript">
//                     //           alert("Enviado Correctamente");
//                     //        </script>';
//                     foreach ($hora_envio as $value) {
//                         $sqlm = "INSERT INTO cmx_mail_enviados
//                                 (id,id_servicio,id_fecha_parametro,fecha,hora,usuario,modalidad)
//                                 VALUES(null," . $servicio . "," . $value['id'] . ",'" . $factual . "','" . $hactual . "','" . $user . "','Automatico')";
//                         $registro = $conexion->prepare($sqlm);
//                         $registro->execute();
//                     }
//                     $return["success"] = true;
//                 } else {
//                     // echo'<script type="text/javascript">
//                     //           alert("NO ENVIADO, intentar de nuevo");
//                     //        </script>';
//                     $return["success"] = false;
//                 }
//                 // $return["success"] = true;	
//                 // $return["error"] = $_msg_error;
//                 return $return;
//             }
//         } //cierre del contador de horas
//     } //cierre del metodo
// } //cierre de la clase
