<?php
require 'libs/PHPMailer/src/PHPMailer.php';
require 'libs/PHPMailer/src/SMTP.php';
require 'libs/PHPMailer/src/Exception.php';

// Usa los espacios de nombres correspondientes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// define('BASE_URL', 'http://localhost/mvcLuisMiguel/');

// $clientes = [56, 49];
// $manifiesto = 102540;
// $empresa = 1;

// $user = "Lucas Villegas";

// $correos = [];
// $response = [];
// $factual = date('Y-m-d');
// $hactual = date('H:i:s');
// $receptor2 = 'controltrafico@nexosgroup.com';

// // Crear una nueva instancia de PHPMailer
// $mail = new PHPMailer();
// $mail->IsSMTP();
// $mail->isHTML(true);
// $mail->CharSet = 'UTF-8';
// $mail->SMTPDebug = 0; // Cambiar a 0 para producción, 2 para obtener más detalles en caso de errores
// $mail->SMTPAuth = true;
// $mail->SMTPSecure = 'tls'; // Seguridad TLS
// // $mail->Host = "smtp.gmail.com"; // Servidor SMTP
// $mail->Host = "smtp.office365.com"; // Servidor SMTP
// $mail->Port = 587; // Puerto SMTP (TLS)
// // $mail->Username = 'soportenexosgroup@gmail.com'; // Nombre de usuario
// $mail->Username = 'controltrafico@nexosgroup.com'; // Nombre de usuario
// $mail->Password = 'Trafic2024*'; // Contraseña Nexos2024*
// // $mail->Password = 'gweqtjwnpzikbams'; // Contraseña Gmail
// $mail->SetFrom($receptor2, 'Nexos Cargo S.A.S');

// // Opciones de seguridad (opcional)
// $mail->SMTPOptions = array(
//   'ssl' => array(
//     'verify_peer' => false,
//     'verify_peer_name' => false,
//     'allow_self_signed' => true
//   )
// );

// $mail->AddAddress("liucasda@gmail.com");
// $mail->AddAddress("lvillegas@nexosgroup.com");

// // Añadir imágenes embebidas
// $mail->AddEmbeddedImage('public/img/magnetron.png', 'magnetron_logo', 'magnetron.png');
// $mail->AddEmbeddedImage('public/img/nexos.png', 'nexos_logo', 'nexos.png');


// //  Mensaje HTML
// $mensaje = "<html><body>";
// $mensaje .= "<p style='font-weight:700; font-size:14pt;'>Informe de seguimiento vehicular, solicitud de servicio N°: 0001: </p>";
// $mensaje .= "</body></html>";

// // Añadir imágenes embebidas
// $mail->AddEmbeddedImage('public/img/magnetron.png', 'magnetron_logo', 'magnetron.png');
// $mail->AddEmbeddedImage('public/img/nexos.png', 'nexos_logo', 'nexos.png');

// $mensaje = '
//       <!DOCTYPE html>
//       <html lang="es">
//       <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>Reporte de Trazabilidad</title>
//           <style>
//               body {
//                   font-family: Arial, sans-serif;
//               }
//               .table-container {
//                   width: 100%;
//                   border-collapse: collapse;
//                   margin-top: 20px;
//               }
//               .table-container th, .table-container td {
//                   border: 1px solid black;
//                   padding: 8px;
//                   text-align: center;
//                   color: black;
//               }
//               .header, .subheader {
//                  /* background-color: #333;*/
//               }
//               .header img {
//                   width: 100px;
//               }
//               .header td {
//                   border: none;
//               }
//               .company-info, .report-info {
//                   text-align: left;
//               }
//               .logo-right img {
//                   width: 80px;
//               }
//               .data th, .data td {
//                   /*background-color: #444;*/
//               }
//               .table-container th {
//                   /*background-color: #222;*/
//               }
//           </style>
//       </head>
//       <body>
//           <table class="table-container">
//               <tr class="header">
//                   <td rowspan="3"><img src="cid:magnetron_logo" alt="Magnetron Logo"></td>
//                   <td class="company-info" colspan="5">
//                       <strong>MAGNETRON S.A.S</strong><br>
//                       TRANSPORTES
//                   </td>
//                   <td class="report-info" colspan="3">
//                       <strong>FORMATO</strong> <br> REPORTE DE TRAZABILIDAD
//                   </td>
//                   <td class="logo-right" rowspan="3">
//                       <img src="cid:nexos_logo" alt="Nexos Logo" style="width: 180px;">
//                   </td>
//               </tr>
//               <tr class="subheader">
//                   <td class="company-info" colspan="5">ANEXO AL INSTRUCTIVO<br>CONTRATACIÓN DE PROVEEDORES DE TRANSPORTE</td>
//                   <td class="report-info" colspan="3">
//                       <strong>FECHA</strong><br> 17/10/2024 15:55
//                   </td>
//               </tr>
//               <tr class="subheader">
//                   <td class="company-info" colspan="5"></td>
//                   <td class="report-info" colspan="3">
//                       <strong>CODIGO</strong>
//                   </td>
//               </tr>
//               <tr class="data">
//                   <th>REFERENCIA</th>
//                   <th>CONTENEDOR</th>
//                   <th>PLACA</th>
//                   <th>CONDUCTOR</th>
//                   <th>CC</th>
//                   <th>ORIGEN</th>
//                   <th>DESTINO</th>
//                   <th>Información Último Seguimiento</th>
//                   <th>Novedad de tránsito</th>
//                   <th>FECHA Y HORA</th>
//               </tr>
//               <tr class="data">
//                   <td>EXPO 301-241-1 / SOUTHERN COMPANY // 2 X 40 HC</td>
//                   <td>GESU5954691</td>
//                   <td>LFQ604</td>
//                   <td>JOÉ RODRIGO MONTAÑA GIMENEZ</td>
//                   <td>11.365.302</td>
//                   <td>PEREIRA</td>
//                   <td>CARTAGENA</td>
//                   <td>VH EN TRANSITO POR PAILITAS</td>
//                   <td></td>
//                   <td>17/10/2024 14:20</td>
//               </tr>
//               <tr class="data">
//                   <td>EXPO 301-241-1 / SOUTHERN COMPANY // 2 X 40 HC</td>
//                   <td>SMLU7855261</td>
//                   <td>TSP902</td>
//                   <td>RIGOBERTO MILLÁN RIAÑO</td>
//                   <td>11.431.825</td>
//                   <td>PEREIRA</td>
//                   <td>CARTAGENA</td>
//                   <td>VH EN TRANSITO POR PEREIRA</td>
//                   <td></td>
//                   <td>17/10/2024 14:20</td>
//               </tr>
//           </table>
//       </body>
//       </html>';

// // Asunto del correo
// $mail->Subject = "SOLICITUD DE VEHICULO // EXPO 301-24-1 // SOUTHERN COMPANY // 2 X 40 HC // DDP";

// // Cuerpo del correo
// $mail->Body = $mensaje;
// $mail->AltBody = strip_tags($mensaje); // Versión de texto plano del mensaje


// // Enviar el correo y verificar el resultado
// if ($mail->Send()) {
//   echo  true;
// } else {
//   echo false;
//   // Mostrar el error en caso de fallo
//   // $return["error"] = $mail->ErrorInfo;
// }

/** CONSULTAS PARA LOS ENVIOS DE CORREOS PARA SE ENVIEN A TODOS LOS CLIENTES CON MANIFIESTOS EN SEGUIMIENTO **/

$usuario = "root";
$clave = "1234567891.123";
$host = "localhost";
$db = "nexosapp_principal";
$charset = "utf8";


// $clientes = [56, 49];
$clientes = [];
// $manifiesto = 102540;
// $manifiesto = 102518;
$manifiestos = [];
$empresa = 1;

$user = "Lucas Villegas";

$correos = [];
$response = [];
$factual = date('Y-m-d');
$hactual = date('H:i:s');
// $receptor2 = 'controltrafico@nexosgroup.com';

try {
  $conexion = new PDO(
    "mysql:host=$host;dbname=$db;charset=$charset",
    $usuario,
    $clave,
    [
      PDO::ATTR_PERSISTENT => true,
      PDO::ATTR_ERRMODE => PDO::ERRMODE_WARNING,
      PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES $charset"
    ]
  );

  // echo "Conexión exitosa";

  //Consultar todos los manifiestos que estan en seguimiento para traer clientes y nnumeros de manifestos.
  $sql = $conexion->prepare("SELECT m.id,oc.cli_id FROM cmx_manifiesto m
  INNER JOIN cmx_manifiesto_remesa mr ON m.id=mr.id_manifiesto
  INNER JOIN cmx_remesa r ON mr.id_remesa=r.id
  INNER JOIN cmx_remesa_ordencargue ro ON r.id=ro.id_remesa
  INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue=oc.id
  INNER JOIN cmx_inicio_ruta ir ON m.id=ir.num_manifiesto
  INNER JOIN cmx_plantilla_novedad_email pn ON oc.cli_id=pn.cliente_id
  WHERE m.estado_seguimiento='SEGUIMIENTO' AND ir.num_manifiesto IS NOT NULL GROUP BY m.id");
  $sql->execute();
  $datos_clientes = $sql->fetchAll(PDO::FETCH_ASSOC);
  foreach ($datos_clientes as $value) {
    $clientes[] = $value['cli_id'];
    $manifiestos[] = $value['id'];
  }

  if (!empty($clientes)) {
    // Realiza la primera consulta
    foreach ($clientes as $index => $cliente_id) {
      $manifiesto_id = $manifiestos[$index]; // Accedes al manifiesto correspondiente al cliente actual
      // foreach ($clientes as $cliente_id) {
      // Realiza la primera consulta
      $sql = $conexion->prepare("SELECT g.id_cliente,g.nombre_grupo,gc.idgrupo,gc.nombre_contactos,gc.email,ch.hora_envio,g.id AS idgrupo, gc.id AS contacto_id FROM cmx_grupo g
                INNER JOIN cmx_grupo_contacto_cliente gc ON g.id=gc.idgrupo AND g.id_cliente=gc.idcliente
                INNER JOIN cmx_cliente_hora ch ON g.id_cliente=ch.id_cliente
                WHERE g.id_cliente = :cliente");
      $sql->bindParam(':cliente', $cliente_id, PDO::PARAM_INT);
      $sql->execute();
      $datos_novedades = $sql->fetchAll(PDO::FETCH_ASSOC);

      // Solo continúa si se obtuvieron resultados en `$datos_novedades`
      if (!empty($datos_novedades)) {
        foreach ($datos_novedades as $value) {
          // $correos = [$value['email']];
          $correos[] = $value['email'];
          // Hora actual del servidor
          $horaActual = date("H:i:s");

          // Define el rango de tolerancia en segundos (por ejemplo, 10 minutos antes y después)
          $tolerancia = 10 * 60; // 10 minutos en segundos

          // Convierte las horas a timestamps para la comparación
          $timestampHoraValidar = strtotime($value['hora_envio']);
          $timestampHoraActual = strtotime($horaActual);

          // Calcula el rango de inicio y fin permitidos
          $rangoInicio = $timestampHoraValidar - $tolerancia;
          $rangoFin = $timestampHoraValidar + $tolerancia;

          // if ($timestampHoraActual >= $rangoInicio && $timestampHoraActual <= $rangoFin) {
          //     // Realiza la segunda consulta
          //     $sql_contactos = $conexion->prepare("SELECT *, g.id AS contacto_id FROM cmx_envio_contacto_cliente cc
          //     INNER JOIN cmx_grupo g ON cc.grupo_id = g.id
          //     INNER JOIN cmx_grupo_contacto_cliente gc ON cc.contacto_id = gc.id
          //     INNER JOIN cmx_para_novedades_seguimiento n ON cc.novedad_id = n.id
          //     INNER JOIN cmx_configuracion_envios ce ON g.id_cliente = ce.cliente_id
          //     INNER JOIN cmx_plantilla_novedad_email ne ON ce.cliente_id = ne.cliente_id
          //     WHERE g.id_cliente = :cliente AND cc.grupo_id = :Grupo AND cc.contacto_id = :Contacto 
          //     AND ce.estado_configuracion = 'ACTIVO' AND ce.envio_automatico = 'SI' 
          //     AND ne.reporta_cliente = 'SI' AND cc.empresa_id = :Empresa 
          //     GROUP BY n.id");

          //     $sql_contactos->bindParam(':cliente', $cliente_id, PDO::PARAM_INT);
          //     $sql_contactos->bindParam(':Grupo', $value['idgrupo'], PDO::PARAM_INT);
          //     $sql_contactos->bindParam(':Contacto', $value['contacto_id'], PDO::PARAM_INT);
          //     $sql_contactos->bindParam(':Empresa', $empresa_id, PDO::PARAM_INT);
          //     $sql_contactos->execute();
          //     $datos_contactos = $sql_contactos->fetchAll(PDO::FETCH_ASSOC);

          //     // Imprime los resultados
          //     // var_dump($datos_contactos);
          // } else {
          //     $mensajeError = "La fecha de envío de la novedad no ha llegado a tiempo. No se enviará el email a: " . $value['email'] . " Grupo: " . $value['idgrupo'] . "<br>";
          //     error_log($mensajeError, 3, "error_log.txt");
          // }

          // Realiza la segunda consulta para traser las novedades que se úedne enviar al cliente
          $sql_contactos = $conexion->prepare("SELECT g.id AS contacto_id,n.novedad,gc.email,gc.nombre_contactos,gc.cargo,gc.areaa FROM cmx_envio_contacto_cliente cc
                      INNER JOIN cmx_grupo g ON cc.grupo_id = g.id
                      INNER JOIN cmx_grupo_contacto_cliente gc ON cc.contacto_id = gc.id
                      INNER JOIN cmx_para_novedades_seguimiento n ON cc.novedad_id = n.id
                      INNER JOIN cmx_configuracion_envios ce ON g.id_cliente = ce.cliente_id
                      INNER JOIN cmx_plantilla_novedad_email ne ON ce.cliente_id = ne.cliente_id
                      WHERE g.id_cliente = :cliente AND cc.grupo_id = :Grupo AND cc.contacto_id = :Contacto 
                      AND ce.estado_configuracion = 'ACTIVO' AND ce.envio_automatico = 'SI' 
                      AND ne.reporta_cliente='SI' AND cc.empresa_id=:Empresa 
                      GROUP BY n.id");
          $sql_contactos->bindParam(':cliente', $cliente_id, PDO::PARAM_INT);
          $sql_contactos->bindParam(':Grupo', $value['idgrupo'], PDO::PARAM_INT);
          $sql_contactos->bindParam(':Contacto', $value['contacto_id'], PDO::PARAM_INT);
          $sql_contactos->bindParam(':Empresa', $empresa, PDO::PARAM_INT);
          $sql_contactos->execute();
          $datos_contactos = $sql_contactos->fetchAll(PDO::FETCH_ASSOC);
          // var_dump($datos_contactos);
        }

        if (isset($datos_contactos)) {
          /* Consultar que plantilla es la que se utilizara para el envio del cliente */
          $sql_plantilla = $conexion->prepare("SELECT * FROM cmx_plantillas_envio");
          // $sql_plantilla->bindParam(':cliente_id', $cliente_id, PDO::PARAM_INT);
          $sql_plantilla->execute();
          $plantilla_envio = $sql_plantilla->fetchAll(PDO::FETCH_ASSOC);

          foreach ($datos_contactos as $value) {
            /* Consultar datos para enviar los correos */
            $sql = $conexion->prepare("SELECT CONCAT(ise.fecha,' - ',ise.hora) AS fecha_trazabilidad,rd.observacion AS Referencia,ss.numero_contenedor,m.placa,
                        CONCAT(cond.nombre,' ',cond.apellido1,' ',cond.apellido2) AS Conductor,m.conductor_manifiesto,ori.municipio AS origen,des.municipio AS destino,
                        ise.novedad,IFNULL(mn.municipio,pc.punto_controlador) AS Municipio,ise.id AS seguimiento_inicio_id,ss.nundoc_solicitud,ss.agrupable
                        FROM cmx_inicio_ruta ir 
                        INNER JOIN cmx_inicio_seguimiento ise ON ir.cod_inicio=ise.cod_ini_ruta
                        INNER JOIN cmx_manifiesto m ON ir.num_manifiesto=m.id
                        INNER JOIN cmx_manifiesto_remesa mr ON m.id=mr.id_manifiesto
                        INNER JOIN cmx_remesa rm ON mr.id_remesa=rm.id
                        INNER JOIN cmx_destinatarios_ss rd ON rm.id_destinatario=rd.id
                        INNER JOIN cmx_remesa_ordencargue ro ON rm.id=ro.id_remesa
                        INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue=oc.id
                        INNER JOIN cmx_solicitud_vehiculo2 ss ON oc.mer_idservicio=ss.nundoc_solicitud
                        INNER JOIN cmx_proveedores cond ON m.conductor_manifiesto=cond.numero_documento
                        INNER JOIN cmx_municipios ori ON m.origen_viaje=ori.id
                        INNER JOIN cmx_municipios des ON m.destino_viaje=des.id
                        LEFT JOIN cmx_municipios mn ON ise.detalle_tipo=mn.id
                        LEFT JOIN cmx_puntos_controlador pc ON ise.id=pc.seguimiento_id
                        WHERE ir.num_manifiesto=:manifiesto AND ise.novedad=:novedad");
                        
            // $sql = $this->_db3->prepare("SELECT CONCAT(ise.fecha,' - ',ise.hora) AS fecha_trazabilidad,rd.observacion AS Referencia,ss.numero_contenedor,m.placa,
            // CONCAT(cond.nombre, ' ', cond.apellido1, ' ', cond.apellido2) AS Conductor,m.conductor_manifiesto,ori.municipio AS origen,des.municipio AS destino,
            // ise.novedad,IFNULL(mn.municipio, pc.punto_controlador) AS Municipio,ise.id AS seguimiento_inicio_id,ss.nundoc_solicitud,ss.agrupable
            // FROM cmx_inicio_ruta ir
            // INNER JOIN cmx_inicio_seguimiento ise ON ir.cod_inicio = ise.cod_ini_ruta
            // INNER JOIN cmx_manifiesto m ON ir.num_manifiesto = m.id
            // INNER JOIN cmx_manifiesto_remesa mr ON m.id = mr.id_manifiesto
            // INNER JOIN cmx_remesa rm ON mr.id_remesa = rm.id
            // INNER JOIN cmx_destinatarios_ss rd ON rm.id_destinatario = rd.id
            // INNER JOIN cmx_remesa_ordencargue ro ON rm.id = ro.id_remesa
            // INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue = oc.id
            // INNER JOIN cmx_solicitud_vehiculo2 ss ON oc.mer_idservicio = ss.nundoc_solicitud
            // INNER JOIN cmx_proveedores cond ON m.conductor_manifiesto = cond.numero_documento
            // INNER JOIN cmx_municipios ori ON m.origen_viaje = ori.id
            // INNER JOIN cmx_municipios des ON m.destino_viaje = des.id
            // INNER JOIN (SELECT cod_ini_ruta, MAX(CONCAT(fecha, ' ', hora)) AS max_fecha_hora FROM cmx_inicio_seguimiento WHERE novedad = :novedad
            // GROUP BY cod_ini_ruta) AS ult_novedad ON ise.cod_ini_ruta = ult_novedad.cod_ini_ruta AND CONCAT(ise.fecha, ' ', ise.hora) = ult_novedad.max_fecha_hora
            // LEFT JOIN cmx_municipios mn ON ise.detalle_tipo = mn.id
            // LEFT JOIN cmx_puntos_controlador pc ON ise.id = pc.seguimiento_id
            // LEFT JOIN cmx_mail_enviados me ON ise.id = me.id_fecha_parametro
            // WHERE ir.num_manifiesto = :manifiesto AND ise.novedad = :novedad AND me.id_fecha_parametro IS NULL");
            $sql->bindParam(':manifiesto',   $manifiesto_id, PDO::PARAM_INT);
            $sql->bindParam(':novedad', $value['novedad'], PDO::PARAM_STR);
            $sql->execute();
            $datos_ruta = $sql->fetchAll(PDO::FETCH_ASSOC);


            if ($datos_ruta) {
              // PARÁMETROS
              $receptor2 = 'controltrafico@nexosgroup.com';
              // Crear una nueva instancia de PHPMailer
              $mail = new PHPMailer();
              $mail->IsSMTP();
              $mail->isHTML(true);
              $mail->CharSet = 'UTF-8';
              $mail->SMTPDebug = 0; // Cambiar a 0 para producción, 2 para obtener más detalles en caso de errores
              $mail->SMTPAuth = true;
              $mail->SMTPSecure = 'tls'; // Seguridad TLS
              // $mail->Host = "smtp.gmail.com"; // Servidor SMTP
              $mail->Host = "smtp.office365.com"; // Servidor SMTP
              $mail->Port = 587; // Puerto SMTP (TLS)
              // $mail->Username = 'soportenexosgroup@gmail.com'; // Nombre de usuario
              $mail->Username = 'controltrafico@nexosgroup.com'; // Nombre de usuario
              $mail->Password = 'Trafic2024*'; // Contraseña Nexos2024*
              // $mail->Password = 'gweqtjwnpzikbams'; // Contraseña Gmail
              $mail->SetFrom($receptor2, 'Nexos Cargo S.A.S');

              // Opciones de seguridad (opcional)
              $mail->SMTPOptions = [
                'ssl' => [
                  'verify_peer' => false,
                  'verify_peer_name' => false,
                  'allow_self_signed' => true
                ]
              ];


              foreach ($plantilla_envio as $plantila) {
                if ($plantila['cliente_id'] === 49) { // Cambiar solo al cliente de magnetron

                  //Agregar destinatario
                  // foreach ($correos  as $correo) {
                  //     $mail->AddAddress($correo);
                  // }

                  $mail->AddAddress("liucasda@gmail.com");
                  // $mail->AddAddress("lvillegas@nexosgroup.com");

                  // Añadir imágenes embebidas
                  $mail->AddEmbeddedImage('C:/appserver/Apache24/htdocs/mvcLuisMiguel' . 'public/img/magnetron.png', 'magnetron_logo', 'magnetron.png');
                  $mail->AddEmbeddedImage('C:/appserver/Apache24/htdocs/mvcLuisMiguel' . 'public/img/nexos.png', 'nexos_logo', 'nexos.png');

                  // Cargar el contenido de la plantilla HTML
                  // var_dump($plantila['ruta_archivo']);
                  $template = file_get_contents($plantila['ruta_archivo']);
                  // var_dump($template);
                  // var_dump($clientes);

                  // Arreglos para almacenar solicitudes agrupables y no agrupables
                  $agrupables = [];
                  $noAgrupables = [];

                  // Clasifica cada solicitud en agrupables y no agrupables
                  foreach ($datos_ruta as $datos) {
                    if (isset($datos['agrupable']) && $datos['agrupable'] === 'SI') {
                      $agrupables[] = $datos;
                    } else {
                      $noAgrupables[] = $datos;
                    }
                  }

                  // Variable para almacenar el contenido HTML generado
                  // $contenidoDinamico = '';

                  // Envío del correo para las solicitudes agrupables
                  if (!empty($agrupables)) {
                    // Genera el contenido del correo para las solicitudes agrupables
                    $contenidoDinamico = '';
                    foreach ($agrupables as $datos) {
                      $contenidoDinamico .= '<tr>';
                      $contenidoDinamico .= '<td>' . $datos['Referencia'] . '</td>';
                      $contenidoDinamico .= '<td>' . $datos['numero_contenedor'] . '</td>';
                      $contenidoDinamico .= '<td>' . $datos['placa'] . '</td>';
                      $contenidoDinamico .= '<td>' . $datos['Conductor'] . '</td>';
                      $contenidoDinamico .= '<td>' . $datos['conductor_manifiesto'] . '</td>';
                      $contenidoDinamico .= '<td>' . $datos['origen'] . '</td>';
                      $contenidoDinamico .= '<td>' . $datos['destino'] . '</td>';
                      $contenidoDinamico .= '<td>' . $datos['novedad'] . '-' . $datos['Municipio'] . '</td>';
                      $contenidoDinamico .= '<td></td>'; // Campo vacío o algún valor predeterminado si es necesario
                      $contenidoDinamico .= '<td>' . $datos['fecha_trazabilidad'] . '</td>';
                      $contenidoDinamico .= '</tr>';
                    }

                    // Reemplaza el marcador de posición en la plantilla por el contenido dinámico
                    $templateAgrupable = str_replace('{{contenido_dinamico}}', $contenidoDinamico, $template);

                    // Configura los detalles del correo
                    // $mail->Subject = "Solicitudes Agrupables" . $datos['Referencia'];
                    $mail->Subject = $datos['Referencia'];
                    $mail->Body = $templateAgrupable;
                    $mail->AltBody = strip_tags($templateAgrupable);

                    // Envía el correo
                    if ($mail->Send()) {
                      $sqlm = $conexion->prepare("INSERT INTO cmx_mail_enviados (id, id_servicio, manifesto_id, id_fecha_parametro, fecha, hora, usuario, modalidad)
                                            VALUES(null, :nundoc_solicitud, :manifiesto, :seguimiento_inicio_id, :fecha, :hora, :usuario, 'Automatico')");
                      $sqlm->bindParam(':nundoc_solicitud', $datos_ruta[0]['nundoc_solicitud']);
                      $sqlm->bindParam(':manifiesto',  $manifiesto_id);
                      $sqlm->bindParam(':seguimiento_inicio_id', $datos_ruta[0]['seguimiento_inicio_id']);
                      $sqlm->bindParam(':fecha', $factual);
                      $sqlm->bindParam(':hora', $hactual);
                      $sqlm->bindParam(':usuario', $user);

                      if ($sqlm->execute()) {
                        // $response = [
                        //   'success' => true,
                        //   'result' => 'Correo enviado al cliente de forma exitosa'
                        // ];
                        echo 'Correo enviado al cliente de forma exitosa<br>';
                      } else {
                        // $response = [
                        //   'success' => false,
                        //   'result' => 'Error al insertar los correos enviados'
                        // ];
                        echo 'Error al insertar los correos enviados<br>';
                      }
                    } else {
                      echo $mail->ErrorInfo . "<br>";
                      // $response = [
                      //   'success' => false,
                      //   'result' => $mail->ErrorInfo // Mensaje de error de PHPMailer
                      // ];
                    }
                  }
                  // Envío de correos para las solicitudes no agrupables
                  foreach ($noAgrupables as $datos) {
                    // Genera el contenido del correo para cada solicitud no agrupable
                    $contenidoDinamico = '<tr>';
                    $contenidoDinamico .= '<td>' . $datos['Referencia'] . '</td>';
                    $contenidoDinamico .= '<td>' . $datos['numero_contenedor'] . '</td>';
                    $contenidoDinamico .= '<td>' . $datos['placa'] . '</td>';
                    $contenidoDinamico .= '<td>' . $datos['Conductor'] . '</td>';
                    $contenidoDinamico .= '<td>' . $datos['conductor_manifiesto'] . '</td>';
                    $contenidoDinamico .= '<td>' . $datos['origen'] . '</td>';
                    $contenidoDinamico .= '<td>' . $datos['destino'] . '</td>';
                    $contenidoDinamico .= '<td>' . $datos['novedad'] . '-' . $datos['Municipio'] . '</td>';
                    $contenidoDinamico .= '<td></td>'; // Campo vacío o algún valor predeterminado si es necesario
                    $contenidoDinamico .= '<td>' . $datos['fecha_trazabilidad'] . '</td>';
                    $contenidoDinamico .= '</tr>';

                    // Reemplaza el marcador de posición en la plantilla por el contenido dinámico
                    $templateNoAgrupable = str_replace('{{contenido_dinamico}}', $contenidoDinamico, $template);

                    // Configura los detalles del correo
                    // $mail->Subject = "Solicitud No Agrupable - " . $datos['Referencia'];
                    $mail->Subject = $datos['Referencia'];
                    $mail->Body = $templateNoAgrupable;
                    $mail->AltBody = strip_tags($templateNoAgrupable);

                    // Envía el correo individual para esta solicitud no agrupable
                    if ($mail->Send()) {
                      $sqlm = $conexion->prepare("INSERT INTO cmx_mail_enviados (id, id_servicio, manifesto_id, id_fecha_parametro, fecha, hora, usuario, modalidad)
                                              VALUES(null, :nundoc_solicitud, :manifiesto, :seguimiento_inicio_id, :fecha, :hora, :usuario, 'Automatico')");
                      $sqlm->bindParam(':nundoc_solicitud', $datos_ruta[0]['nundoc_solicitud']);
                      $sqlm->bindParam(':manifiesto',  $manifiesto_id);
                      $sqlm->bindParam(':seguimiento_inicio_id', $datos_ruta[0]['seguimiento_inicio_id']);
                      $sqlm->bindParam(':fecha', $factual);
                      $sqlm->bindParam(':hora', $hactual);
                      $sqlm->bindParam(':usuario', $user);

                      if ($sqlm->execute()) {
                        // $response = [
                        //   'success' => true,
                        //   'result' => 'Correo enviado al cliente de forma exitosa'
                        // ];
                        echo 'Correo enviado al cliente de forma exitosa<br>';
                      } else {
                        // $response = [
                        //   'success' => false,
                        //   'result' => 'Error al insertar los correos enviados'
                        // ];
                        echo 'Error al insertar los correos enviados<br>';
                      }
                    } else {
                      echo $mail->ErrorInfo . "<br>";
                    }
                  }
                } else {
                  // echo "Hola desde aqui ";
                  // #plantilla de nexosapp
                  $mail->AddAddress("liucasda@gmail.com");
                  // $mail->AddAddress("lvillegas@nexosgroup.com");

                  // Añadir imágenes embebidas
                  // $mail->AddEmbeddedImage('public/img/magnetron.png', 'magnetron_logo', 'magnetron.png');
                  $mail->AddEmbeddedImage('public/img/nexos.png', 'nexos_logo', 'nexos.png');

                  // Cargar el contenido de la plantilla HTML
                  $template = file_get_contents($plantila['ruta_archivo']);

                  // Genera el contenido del correo para las solicitudes agrupables
                  $contenidoDinamico = '';
                  foreach ($datos_ruta as $datos) {
                    $contenidoDinamico .= '<tr>';
                    $contenidoDinamico .= '<td>' . $datos['Referencia'] . '</td>';
                    $contenidoDinamico .= '<td>' . $datos['numero_contenedor'] . '</td>';
                    $contenidoDinamico .= '<td>' . $datos['placa'] . '</td>';
                    $contenidoDinamico .= '<td>' . $datos['Conductor'] . '</td>';
                    $contenidoDinamico .= '<td>' . $datos['conductor_manifiesto'] . '</td>';
                    $contenidoDinamico .= '<td>' . $datos['origen'] . '</td>';
                    $contenidoDinamico .= '<td>' . $datos['destino'] . '</td>';
                    $contenidoDinamico .= '<td>' . $datos['novedad'] . '-' . $datos['Municipio'] . '</td>';
                    $contenidoDinamico .= '<td></td>'; // Campo vacío o algún valor predeterminado si es necesario
                    $contenidoDinamico .= '<td>' . $datos['fecha_trazabilidad'] . '</td>';
                    $contenidoDinamico .= '</tr>';
                  }

                  // Reemplaza el marcador de posición en la plantilla por el contenido dinámico
                  $templateAgrupable = str_replace('{{contenido_plantilla_nexos}}', $contenidoDinamico, $template);

                  // Configura los detalles del correo
                  $mail->Subject = "EJEMPLO DE PLANTILLA PARA NEXOSAPP";
                  $mail->Body = $templateAgrupable;
                  $mail->AltBody = strip_tags($templateAgrupable);

                  // Envía el correo
                  if ($mail->Send()) {
                    $sqlm = $conexion->prepare("INSERT INTO cmx_mail_enviados (id, id_servicio, manifesto_id, id_fecha_parametro, fecha, hora, usuario, modalidad)
                                                       VALUES(null, :nundoc_solicitud, :manifiesto, :seguimiento_inicio_id, :fecha, :hora, :usuario, 'Automatico')");
                    $sqlm->bindParam(':nundoc_solicitud', $datos_ruta[0]['nundoc_solicitud']);
                    $sqlm->bindParam(':manifiesto',  $manifiesto_id);
                    $sqlm->bindParam(':seguimiento_inicio_id', $datos_ruta[0]['seguimiento_inicio_id']);
                    $sqlm->bindParam(':fecha', $factual);
                    $sqlm->bindParam(':hora', $hactual);
                    $sqlm->bindParam(':usuario', $user);

                    if ($sqlm->execute()) {
                      // $response = [
                      //   'success' => true,
                      //   'result' => 'Correo enviado al cliente de forma exitosa'
                      // ];
                      echo 'Correo enviado al cliente de forma exitosa' . "\n";
                    } else {
                      // $response = [
                      //   'success' => false,
                      //   'result' => 'Error al insertar los correos enviados'
                      // ];
                      echo 'Error al insertar los correos enviados' . "\n";
                    }
                  } else {
                    echo $mail->ErrorInfo . "\n";
                  }
                }
              }
            } else {
              echo "Error 1<br>" . "\n";
            }
          }
        } else {
          #si no hay horas disponibles
          echo 'no hay horario disponible para el envio del correo' . "\n";
        }
      }
    }
  } else {
    echo 'No hay datos para generar el correo' . "\n";
  }
} catch (PDOException $e) {
  echo "Error en la conexión: " . $e->getMessage();
}
