<?php
include "../application/Config.php";
include '../application/Conexion.php';
require_once 'PHPMailer/class.phpmailer.php';
header("Content-Type: text/html;charset=utf-8");

$mail = new PHPMailer();
$mail->Host = "localhost";
$mail->From = "noreply@nexosapp.com";
$mail->FromName = 'Seguimientos Nexosapp';
$mail->Subject = 'Informe de Seguimiento de Rutas ';
// $mail->addAddress('fgomez@ingecall.com');
// $mail->addAddress('sorjuela@imocom.com.co'); 
$mail->addAddress('desarrolladores@nexosgroup.com'); // correo de destino 
$body = '<table border="1" width="438" align="center" cellpadding="0" cellspacing="0">
				<tr>
					<td><strong>Nombre Cliente:</strong> Lucho</td>
					<td><strong>Teléfono:</strong> El de la casa</td>
				</tr>
				<tr>
					<td colspan="2"><strong>Razón Social:</strong> La vagancia</td>
				</tr>
				<tr>
					<td colspan="2">Probando ando...</td>
				</tr>
			</table>';

$mail->Body = $body;
$mail->isHTML(true);
// Activo condificación utf-8
$mail->CharSet = 'UTF-8';
$msg = $mail->send();

if ($msg) {
	echo '<p>La queja se ha enviado exitosamente</p>';
} else {
	echo '<p>No se envió</p>';
	echo $body;
}