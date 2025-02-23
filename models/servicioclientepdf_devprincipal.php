<?php
// include '../application/Conexion.php';
require_once '../application/Config.php';
require_once 'PHPMailer/class.phpmailer.php';
require_once 'PHPMailer/class.smtp.php';
// session_start();

class servicioclientepdf
{
	public $user_log;
	public $mensaje;
	public $respuesta;

	public function enviarcorreo(){
		$_msg_error = "";
		$model    = new Conexion;
		$conexion = $model->conectar();

		$nombre_cliente=$_POST["nombre"];
		$cotizar=$_POST["cotizar"];
		$receptor=$_POST["receptor"];
		$mensaje=$_POST["mensaje"];
		// $archivo=$_FILES["pdf"];
		//nombre de archivo
            
       
        $ruta = "../public/files/cotizaciones/".$cotizar." ";
        if (!file_exists($ruta)) {
            mkdir($ruta, 0777, true);
        }

        for ($x=0;$x<count($_FILES);$x++){
                if(isset($_FILES["achivo".$x])){
                $file = $_FILES["achivo".$x];
                $nombre = $file["name"];
                $tipo = $file["type"];
                $ruta_provisional = $file["tmp_name"];
                //ruta dentro de la carpeta
                $carpeta=$ruta.'/';
                $src=$carpeta.$nombre;
                move_uploaded_file($ruta_provisional, $src);
                }
            }
           $name=$nombre; 
		//correo
	  	require '../libs/PHPMailer/PHPMailerAutoload.php';
                //Create a new PHPMailer instance
                $mail = new PHPMailer();
                // $mail->IsSMTP();
                $mail->isMail();
                $mail->CharSet = 'UTF-8'; 
                //Configuracion servidor mail
                $mail->From = "soportenexosgroup@gmail.com"; //remitente
                $mail->SMTPAuth = true;
                $mail->isHTML=(true);
                $mail->SMTPSecure = 'tls'; //seguridad
                $mail->Host = "smtp.gmail.com"; // servidor smtp
                $mail->Port = 587; //puerto
                $mail->Username ='soportenexosgroup@gmail.com'; //nombre usuario
                $mail->Password = 'Nexosdesarrollo2017'; //contraseña
                //Agregar destinatario
                $mail->AddAddress($receptor);
                $mail->Subject = "Cotizacion N° ".$cotizar." Nexos Group ";
                $mail->Body ='Señores:    '.$nombre_cliente.': '.$mensaje.'';
                // $archivo1='';
                // $ruta2="../public/files/cotizaciones/".$cotizar."/".$nombre." ";;

                // $pat='../public/files/cotizaciones/'.$cotizar.'/'.$name.'';
                // $pat='http://devprincipal.nexosapp.com/public/files/cotizaciones/'.$cotizar.'/'.$name.'';
                 // $pat=''.BASE_URL.'/public/files/cotizaciones/'.$cotizar.'/'.$name.'';
                //validar si esxiste en la carpeta
                if($ruta_provisional){
                    // echo 'si existe la ruta temporal';
                    // echo $ruta_provisional;
                    $dir=$ruta.'/';
                    $src2=$dir.$name;
                    if($dir){
                        //  echo 'si existe carpeta';
                        // echo $src2;
                        if($name){
                            // echo 'si existe archivo';
                            // echo $name;
                            //enviar el archivo
                            $pat=$src2;
                            $mail->AddAttachment($pat);
                        }else{
                            // echo 'no existe archivo';
                        }
                       
                    }else{
                        // echo 'no existe carpeta';
                    }

                }else{
                    // echo 'no existe esta ruta temporal';
                }
                //     $dir='http://devprincipal.nexosapp.com/';
                //  $pat=''.$dir.'/public/files/cotizaciones/'.$cotizar.'/'.$name.'';
                // $mail->AddAttachment($pat);

                // if(isset($_FILES['name'])){


                // }
                // $mail->Send();
                if($mail->Send()){
                	// echo'<script type="text/javascript">
                 //           alert("Enviado Correctamente");
                 //        </script>';
                	 $return["success"] = true;
                }else{
                	// echo'<script type="text/javascript">
                 //           alert("NO ENVIADO, intentar de nuevo");
                 //        </script>';
                	 $return["success"] = false;

                }
                // $return["success"] = true;	
				// $return["error"] = $_msg_error;
				return $return;
	}

}

?>