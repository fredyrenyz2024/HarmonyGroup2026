<?php
require 'libs/PHPMailer/src/PHPMailer.php';
require 'libs/PHPMailer/src/SMTP.php';
require 'libs/PHPMailer/src/Exception.php';
date_default_timezone_set("America/Bogota");
// Usa los espacios de nombres correspondientes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

/** CONSULTAS PARA LOS ENVIOS DE CORREOS PARA SE ENVIEN A TODOS LOS CLIENTES CON MANIFIESTOS EN SEGUIMIENTO **/
$usuario = "root";
$clave = "1234567891.123";
$host = "localhost";
$db = "nexosapp_principal";
$charset = "utf8";

$clientes = [];
$manifiestos = [];
$contactos_agrupados = [];
$empresa = 1;

$agrupadas = [];
$no_agrupadas = [];

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

  // Consultar manifiestos en seguimiento
  $sql = $conexion->prepare("SELECT m.id AS manifiesto_id, oc.cli_id AS cliente_id,ce.logo_cliente,ce.nombre_cliente FROM cmx_manifiesto m
  INNER JOIN cmx_manifiesto_remesa mr ON m.id = mr.id_manifiesto
  INNER JOIN cmx_remesa r ON mr.id_remesa = r.id
  INNER JOIN cmx_remesa_ordencargue ro ON r.id = ro.id_remesa
  INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue = oc.id
  INNER JOIN cmx_inicio_ruta ir ON m.id = ir.num_manifiesto
  INNER JOIN cmx_configuracion_envios ce ON oc.cli_id = ce.cliente_id AND ce.envio_automatico = 'SI'
  WHERE m.estado_seguimiento = 'SEGUIMIENTO' AND ir.num_manifiesto IS NOT NULL AND ce.envia_correo='SI'
  GROUP BY m.id, oc.cli_id");
  $sql->execute();
  $datos_clientes = $sql->fetchAll(PDO::FETCH_ASSOC);

  $agrupados_por_cliente = [];
  foreach ($datos_clientes as $value) {
    $cliente_id = $value['cliente_id'];
    $manifiesto_id = $value['manifiesto_id'];
    // $plantilla = $value['man_plantilla'];
    $logo_plantilla = $value['logo_cliente'];
    $nombre_cliente_plantilla = $value['nombre_cliente'];

    // Inicializar el array para el cliente si no existe
    if (!isset($agrupados_por_cliente[$cliente_id])) {
      $agrupados_por_cliente[$cliente_id] = [
        'manifiestos' => [],
        'contactos' => [],
        // 'maneja_plantillas' => [],
        'logos_clientes_plantillas' => [],
        'cliente_nombre_plantillas' => [],
      ];
    }

    // Agregar el manifiesto al cliente si no existe
    if (!in_array($manifiesto_id, $agrupados_por_cliente[$cliente_id]['manifiestos'])) {
      $agrupados_por_cliente[$cliente_id]['manifiestos'][] = $manifiesto_id;
    }

    //Agregar logos y nombre del cliente
    if (!in_array($plantilla, $agrupados_por_cliente[$cliente_id]['logos_clientes_plantillas'])) {
      $agrupados_por_cliente[$cliente_id]['logos_clientes_plantillas'][] = $logo_plantilla;
      $agrupados_por_cliente[$cliente_id]['cliente_nombre_plantillas'][] = $nombre_cliente_plantilla;
    }
  }

  //Variables para gaurdar los logs de los correos
  $numdoc_solicitud = "";
  $numdoc_manifiesto = "";
  $numdoc_seguimiento_inicio_id = "";
  $nota_enviar = "";
  $fecha_trazabilidad = "";
  $fecha = date('Y-m-d');
  $hora = date('H:i:s');

  // Validar que existan clientes y manifiestos
  if (!empty($agrupados_por_cliente)) {

    foreach ($agrupados_por_cliente as $cliente_id => &$data) {
      $sql = $conexion->prepare("SELECT g.id_cliente, g.nombre_grupo, gc.nombre_contactos, gc.email, gc.idgrupo, gc.id AS contacto_id, n.novedad,n.id AS novedad_id
          FROM cmx_grupo g
          INNER JOIN cmx_grupo_contacto_cliente gc ON g.id = gc.idgrupo AND g.id_cliente = gc.idcliente
          /*INNER JOIN cmx_cliente_hora ch ON g.id_cliente = ch.id_cliente*/
          INNER JOIN cmx_configuracion_envios ce ON g.id_cliente = ce.cliente_id
          INNER JOIN cmx_envio_contacto_cliente cc ON cc.grupo_id = g.id AND gc.id = cc.contacto_id
          INNER JOIN cmx_para_novedades_seguimiento n ON cc.novedad_id = n.id
          WHERE g.id_cliente = :cliente AND cc.estado_contacto_envio = 'ACTIVO' and g.estado=1
          GROUP BY g.id_cliente, g.nombre_grupo, gc.nombre_contactos, gc.email, /*ch.hora_envio,*/ gc.idgrupo, n.novedad");
      $sql->bindParam(':cliente', $cliente_id, PDO::PARAM_INT);
      $sql->execute();
      $datos_contactos = $sql->fetchAll(PDO::FETCH_ASSOC);

      // Consiltar las hora de envio del cliente
      $sql = $conexion->prepare("SELECT ch.hora_envio, ch.id AS ch_id
          FROM cmx_cliente_hora ch WHERE ch.id_cliente = :cliente");
      $sql->bindParam(':cliente', $cliente_id, PDO::PARAM_INT);
      $sql->execute();
      $datos_horas_envio = $sql->fetchAll(PDO::FETCH_ASSOC);

      foreach ($datos_contactos as $contacto) {
        $grupo = $contacto['nombre_grupo'];
        $identificador_contacto = $contacto['email']; // Usamos el email como identificador único

        // Inicializar el array para contactos
        if (!isset($data['contactos'][$grupo])) {
          $data['contactos'][$grupo] = [];
        }

        // Verificar si el contacto ya fue agregado
        $index_contacto = array_search($identificador_contacto, haystack: array_column($data['contactos'][$grupo], 'email'));

        if ($index_contacto === false) {
          // Si no existe, agrega un nuevo contacto
          $data['contactos'][$grupo][] = [
            'nombre_contacto' => $contacto['nombre_contactos'],
            'email' => $contacto['email'],
            // 'horas_envio' => [$contacto['hora_envio']],
            'grupo_id' => $contacto['idgrupo'],
            'contacto_id' => $contacto['contacto_id'],
            'novedades' => [$contacto['novedad']], // Inicializar con la primera novedad
            'novedades_id' => [$contacto['novedad_id']], // Inicializar con la primera novedad
            'cliente_id' => $cliente_id, // Inicializar con la primera novedad
            // 'ch_id' => $contacto['ch_id'], // Inicializar con la primera novedad
          ];
        } else {
          // Si ya existe, agrega la novedad al array de novedades
          if (!in_array($contacto['novedad_id'], $data['contactos'][$grupo][$index_contacto]['novedades_id'])) {
            $data['contactos'][$grupo][$index_contacto]['novedades_id'][] = $contacto['novedad_id'];
          }
          if (!in_array($contacto['novedad'], $data['contactos'][$grupo][$index_contacto]['novedades'])) {
            $data['contactos'][$grupo][$index_contacto]['novedades'][] = $contacto['novedad'];
          }
        }
      }
    }

    foreach ($agrupados_por_cliente as $cliente_id => $value) {
      // Concatenar manifiestos separados por comas
      if (is_array($value['manifiestos'])) {
        $manifiestos = implode(', ', $value['manifiestos']);
      } else {
        $manifiestos = $value['manifiestos'];
      }

      // Obtener el nombre del cliente
      $cliente_nombre = $value['cliente_nombre_plantillas'][0] ?? 'Sin Nombre'; // Asegura un nombre predeterminado si no existe

      // Iterar sobre los logos y asegurarse de imprimir cada uno solo una vez
      $printedLogos = [];
      foreach ($value['logos_clientes_plantillas'] as $logo_cliente) {
        if (!in_array($logo_cliente, $printedLogos)) {
          $printedLogos[] = $logo_cliente;
          // Mostrar resultado
          // echo "Logo: " . $logo_cliente . " Cliente: " . $cliente_nombre . " (ID: " . $cliente_id . ") Manifiesto: " . $manifiestos;
          // echo "<br/>";
          foreach ($agrupados_por_cliente as $cliente_id => &$data) {
            foreach ($data['manifiestos'] as $manifiesto_id) {
              foreach ($data['contactos'] as $contactos_grupo) {
                foreach ($contactos_grupo as $contacto) {
                  foreach ($contacto['novedades'] as $novedad) {
                    // Preparar la consulta
                    $sql = $conexion->prepare("SELECT CONCAT(ise.fecha, ' - ', ise.hora) AS fecha_trazabilidad,rd.observacion AS Referencia,ss.numero_contenedor,m.placa,CONCAT(cond.nombre, ' ', cond.apellido1, ' ', cond.apellido2) AS Conductor,
                    m.conductor_manifiesto,ori.municipio AS origen,des.municipio AS destino,ise.novedad,IFNULL(mn.municipio, pc.punto_controlador) AS Municipio,ise.id AS seguimiento_inicio_id,ss.nundoc_solicitud,ss.agrupable,m.id AS id_manifiesto, n.id AS id_novedad
                    FROM cmx_inicio_ruta ir
                    INNER JOIN cmx_inicio_seguimiento ise ON ir.cod_inicio = ise.cod_ini_ruta
                    INNER JOIN cmx_manifiesto m ON ir.num_manifiesto = m.id
                    INNER JOIN cmx_manifiesto_remesa mr ON m.id = mr.id_manifiesto
                    INNER JOIN cmx_remesa rm ON mr.id_remesa = rm.id
                    INNER JOIN cmx_destinatarios_ss rd ON rm.id_destinatario = rd.id
                    INNER JOIN cmx_remesa_ordencargue ro ON rm.id = ro.id_remesa
                    INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue = oc.id
                    INNER JOIN cmx_solicitud_vehiculo2 ss ON oc.mer_idservicio = ss.nundoc_solicitud
                    INNER JOIN cmx_proveedores cond ON m.conductor_manifiesto = cond.numero_documento
                    INNER JOIN cmx_municipios ori ON m.origen_viaje = ori.id
                    INNER JOIN cmx_municipios des ON m.destino_viaje = des.id
                    INNER JOIN cmx_configuracion_envios ce ON oc.cli_id = ce.cliente_id AND ce.estado_configuracion = 'ACTIVO'
                    LEFT JOIN cmx_para_novedades_seguimiento n ON ise.novedad = n.novedad
                    LEFT JOIN cmx_municipios mn ON ise.detalle_tipo = mn.id
                    LEFT JOIN cmx_puntos_controlador pc ON ise.id = pc.seguimiento_id
                    LEFT JOIN cmx_mail_enviados me ON ise.id = me.id_fecha_parametro
                    WHERE ir.num_manifiesto = :manifiesto /*AND ise.novedad = :novedad*/AND ce.envio_automatico = 'SI' /*AND pn.reporta_cliente = 'SI'*/ AND me.id_fecha_parametro IS NULL GROUP BY ss.nundoc_solicitud, m.placa  ORDER BY ise.fecha DESC, ise.hora DESC LIMIT 1");
                    // Vincular parámetros
                    $sql->bindParam(':manifiesto', $manifiesto_id, PDO::PARAM_INT);
                    // $sql->bindParam(':novedad', $novedad, PDO::PARAM_STR);
                    $sql->execute();

                    // Obtener resultados
                    $datos_ruta = $sql->fetchAll(PDO::FETCH_ASSOC);

                    // Filtrar resultados válidos antes de añadir al arreglo
                    foreach ($datos_ruta as $dato) {
                      // Validar que los campos clave tengan contenido
                      if (
                        !empty($dato['fecha_trazabilidad']) &&
                        !empty($dato['Referencia']) &&
                        !empty($dato['placa']) &&
                        !empty($dato['Conductor']) &&
                        !empty($dato['origen']) &&
                        !empty($dato['destino'])
                      ) {

                        // Añadir solo datos válidos al arreglo principal
                        $agrupados_por_cliente[$cliente_id]['datos_ruta'][] = $dato;
                      }
                    }
                  }
                }
              }
            }
          }


          // Armar correo para los clientes
          foreach ($agrupados_por_cliente as &$value) {
            foreach ($value['datos_ruta'] as $datos_ruta) {
              if ($datos_ruta['agrupable'] === 'SI') {
                $agrupadas[$datos_ruta['nundoc_solicitud']][] = $datos_ruta;
              } else if ($datos_ruta['agrupable'] === 'NO') {
                $no_agrupadas[] = $datos_ruta;
              }
            }
          }

          // validar las horas de envio del correo para el cliente
          foreach ($agrupados_por_cliente as $cliente_id => &$data) {
            // foreach ($data['manifiestos'] as $manifiesto_id) { }
            foreach ($data['contactos'] as $contactos_grupo) {
              // Hora actual del servidor
              // (int)$horaActual = date("H");
              // foreach ($datos_horas_envio as  $contacto) {
              //   (int)$hora_contacto = explode(":", $contacto['hora_envio'])[0];
              //   if ($hora_contacto >= $horaActual && $hora_contacto < $horaActual + 1) {
              //   } else {
              //     echo "NO HAY HORAS DE ENVIO PARA EL CORRO PLANTILLA NEXOSAPP" . "<br/>";
              //   }
              // }

              // Enviar correos agrupados
              if (!empty($agrupadas)) {
                $mail = new PHPMailer();
                $mail->IsSMTP();
                $mail->isHTML(true);
                $mail->CharSet = 'UTF-8';
                $mail->SMTPDebug = 0; // Cambiar a 0 para producción, 2 para obtener más detalles en caso de errores
                $mail->SMTPAuth = true;
                $mail->SMTPSecure = 'tls';
                // $mail->Host = "smtp.gmail.com";
                $mail->Host = "smtp.office365.com"; // Servidor SMTP
                $mail->Port = 587;
                // $mail->Username = 'soportenexosgroup@gmail.com';
                // $mail->Password = 'gweqtjwnpzikbams';
                $mail->Username = 'controltrafico@nexosgroup.com';
                $mail->Password = 'Trafico2024*';
                // $mail->Username = 'ing.lucasvillegas@gmail.com';
                // $mail->Password = 'ybdnfqlhghpwdnoa';
                $mail->SetFrom('controltrafico@nexosgroup.com', 'Nexos Cargo S.A.S');
                // $mail->SetFrom('controltrafico@nexosgroup.com', 'Nexos Cargo S.A.S');

                //Validar que cliente enviar
                $mail->AddAddress("liucasda@gmail.com");
                // $mail->AddAddress($contacto['email']);
                // foreach ($contactos_grupo as $email) {
                //   $email = trim($email['email']); // Quitar espacios en blanco
                //   if (filter_var($email, FILTER_VALIDATE_EMAIL)) { // Validar formato de correo
                //     $mail->AddAddress($email);
                //   }
                // }

                // Añadir imágenes embebidas
                // $mail->AddEmbeddedImage('C:/appserver/Apache24/htdocs/mvcLuisMiguel/' . 'public/img/magnetron.png', 'magnetron_logo', 'magnetron.png');
                $mail->AddEmbeddedImage('C:/appserver/Apache24/htdocs/mvcLuisMiguel/' . 'public/img/' . $logo_cliente, 'magnetron_logo', 'Logo.png');
                $mail->AddEmbeddedImage('C:/appserver/Apache24/htdocs/mvcLuisMiguel/' . 'public/img/nexos.png', 'nexos_logo', 'nexos.png');

                $template = file_get_contents('C:/appserver/Apache24/htdocs/mvcLuisMiguel/views/templates/magnetron.php');
                $contenidoDinamico = '';
                // Array auxiliar para almacenar los 'nundoc_solicitud' ya procesados
                $solicitudesProcesadas = [];
                // Recorrer las solicitudes agrupadas
                foreach ($agrupadas as $solicitud => $datosAgrupados) {
                  foreach ($datosAgrupados as $dato) {
                    // Verificar si 'nundoc_solicitud' ya ha sido procesado
                    if (in_array($dato['nundoc_solicitud'], $solicitudesProcesadas)) {
                      continue; // Si ya está en el array, omitir esta iteración
                    }

                    $novedad = trim($dato['novedad']); // Limpia espacios en blanco
                    $procesado = false;

                    if (substr($novedad, 0, 7) == "NOVEDAD" || substr($novedad, 0, 7) == "SAQUEO" && stripos($novedad, "DESCARGUE SIN NOVEDAD") === false &&  stripos($novedad, "OK VEHÍCULO SIN NOVEDAD") === false) {
                      echo "Novedades";
                      $procesado = false;
                      break;
                    } else {
                      //Asignar los valres a las variables
                      $numdoc_solicitud = $dato['nundoc_solicitud'];
                      $numdoc_manifiesto = $dato['id_manifiesto'];
                      $numdoc_seguimiento_inicio_id = $dato['seguimiento_inicio_id'];
                      $nota_enviar = $novedad . '-' . $dato['Municipio'] ?? '';
                      $fecha_trazabilidad = $dato['fecha_trazabilidad'] ?? '';

                      $solicitudesProcesadas[] = $dato['nundoc_solicitud'];
                      $contenidoDinamico .= '<tr>';
                      $contenidoDinamico .= '<td>' . htmlspecialchars($dato['Referencia'] ?? '') . '</td>';
                      $contenidoDinamico .= '<td>' . htmlspecialchars($dato['numero_contenedor'] ?? '') . '</td>';
                      $contenidoDinamico .= '<td>' . htmlspecialchars($dato['placa'] ?? '') . '</td>';
                      $contenidoDinamico .= '<td>' . htmlspecialchars($dato['Conductor'] ?? '') . '</td>';
                      $contenidoDinamico .= '<td>' . htmlspecialchars($dato['conductor_manifiesto'] ?? '') . '</td>';
                      $contenidoDinamico .= '<td>' . htmlspecialchars($dato['origen'] ?? '') . '</td>';
                      $contenidoDinamico .= '<td>' . htmlspecialchars($dato['destino'] ?? '') . '</td>';
                      $contenidoDinamico .= '<td>' . htmlspecialchars($novedad . '-' . ($dato['Municipio'] ?? '')) . '</td>';
                      $contenidoDinamico .= '<td></td>';
                      $contenidoDinamico .= '<td>' . htmlspecialchars($dato['fecha_trazabilidad'] ?? '') . '</td>';
                      $contenidoDinamico .= '</tr>';
                      $procesado = true;
                      break;
                    }
                  }
                }

                if ($procesado == true) {
                  // Reemplazar el contenido dinámico en la plantilla
                  $template = str_replace('{{Titulo_Cliente}}', $cliente_nombre, $template);

                  $template = str_replace('{{contenido_dinamico}}', $contenidoDinamico, $template);
                  // Configura los detalles del correo
                  $mail->Subject = $dato['Referencia'];
                  // Configurar cuerpo del correo
                  $mail->Body = $template;
                  $mail->AltBody = strip_tags($template);

                  if ($mail->Send()) {
                    $estado_envio = 'ENVIADO';
                    echo "Correo agrupado enviado con éxito 2 magnetron" . "\n" . "<br/>";
                    try {
                      $user = 'system';
                      $error_info = $mail->Send();
                      $sqlm = $conexion->prepare("INSERT INTO cmx_mail_enviados 
                      (id, id_servicio, manifesto_id, id_fecha_parametro, modalidad, nota_enviar, estado_envio,respuesta_envio, fecha, hora, usuario) 
                      VALUES(null, :nundoc_solicitud, :manifiesto, :id_fecha_parametro, 'Automático', :nota_enviar, :estado_envio,:respuesta_envio, :fecha, :hora, :usuario)");
                      $sqlm->bindParam(':nundoc_solicitud', $numdoc_solicitud);
                      $sqlm->bindParam(':manifiesto', $numdoc_manifiesto);
                      $sqlm->bindParam(':id_fecha_parametro', $numdoc_seguimiento_inicio_id);
                      // $sqlm->bindParam(':seguimiento_inicio_id', $numdoc_seguimiento_inicio_id);
                      $sqlm->bindParam(':nota_enviar', $nota_enviar);
                      $sqlm->bindParam(':estado_envio', $estado_envio);
                      $sqlm->bindParam(':respuesta_envio', $error_info);
                      $sqlm->bindParam(':fecha', $fecha);
                      $sqlm->bindParam(':hora', $hora);
                      $sqlm->bindParam(':usuario', $user); // Cambiar por el usuario real
                      $sqlm->execute();
                    } catch (PDOException $e) {
                      echo "Error al guardar en la base de datos: " . $e->getMessage();
                    }
                  } else {
                    $estado_envio = 'NO ENVIADO';


                    try {
                      $user = 'system';
                      $error_info = $mail->ErrorInfo;
                      $sqlm = $conexion->prepare("INSERT INTO cmx_mail_enviados 
                          (id, id_servicio, manifesto_id, id_fecha_parametro, modalidad, nota_enviar, estado_envio,respuesta_envio, fecha, hora, usuario) 
                          VALUES(null, :nundoc_solicitud, :manifiesto, :id_fecha_parametro, 'Automático', :nota_enviar, :estado_envio,:respuesta_envio, :fecha, :hora, :usuario)");
                      $sqlm->bindParam(':nundoc_solicitud', $numdoc_solicitud);
                      $sqlm->bindParam(':manifiesto', $numdoc_manifiesto);
                      $sqlm->bindParam(':id_fecha_parametro', $numdoc_seguimiento_inicio_id);
                      // $sqlm->bindParam(':seguimiento_inicio_id', $numdoc_seguimiento_inicio_id);
                      $sqlm->bindParam(':nota_enviar', $nota_enviar);
                      $sqlm->bindParam(':estado_envio', $estado_envio);
                      $sqlm->bindParam(':respuesta_envio', $error_info);
                      $sqlm->bindParam(':fecha', $fecha);
                      $sqlm->bindParam(':hora', $hora);
                      $sqlm->bindParam(':usuario', $user); // Cambiar por el usuario real
                      $sqlm->execute();
                    } catch (PDOException $e) {
                      echo "Error al guardar en la base de datos: " . $e->getMessage();
                    }
                    // echo "Error al enviar el correo agrupado" . "\n" . "<br/>";
                    // echo 'Mailer Error: ' . $mail->ErrorInfo . "<br/>";
                  }
                } else {
                  echo "no tiene notas para enviar el correo";
                }
              }

              if (!empty($no_agrupadas)) {
                // Array auxiliar para almacenar los 'nundoc_solicitud' ya procesados
                $solicitudesProcesadas = [];
                $fecha = date('Y-m-d');
                $hora = date('H:i:s');
                foreach ($no_agrupadas as $dato) {
                  // Verificar si 'nundoc_solicitud' ya ha sido procesado
                  if (in_array($dato['nundoc_solicitud'], $solicitudesProcesadas)) {
                    continue; // Si ya está en el array, omitir esta iteración
                  }

                  $novedad = trim($dato['novedad']); // Limpia espacios en blanco
                  $procesado = false;

                  if (substr($novedad, 0, 7) == "NOVEDAD" || substr($novedad, 0, 7) == "SAQUEO" && stripos($novedad, "DESCARGUE SIN NOVEDAD") === false &&  stripos($novedad, "OK VEHÍCULO SIN NOVEDAD") === false) {
                    echo "Novedades";
                    $procesado = false;
                    break;
                  } else {
                    // Si no ha sido procesado, añadirlo al array de solicitudes procesadas
                    $solicitudesProcesadas[] = $dato['nundoc_solicitud'];

                    // Obtener correos asociados a la solicitud
                    $correos = explode(',', $contacto['email']); // Asegúrate de que esta variable contiene correos separados por comas
                    $mail = new PHPMailer();
                    $mail->IsSMTP();
                    $mail->isHTML(true);
                    $mail->CharSet = 'UTF-8';
                    $mail->SMTPDebug = 0; // Cambiar a 0 para producción, 2 para obtener más detalles en caso de errores
                    $mail->SMTPAuth = true;
                    $mail->SMTPSecure = 'tls';
                    // $mail->Host = "smtp.gmail.com";
                    $mail->Host = "smtp.office365.com"; // Servidor SMTP
                    $mail->Port = 587;
                    // $mail->Username = 'soportenexosgroup@gmail.com';
                    // $mail->Password = 'gweqtjwnpzikbams';
                    $mail->Username = 'controltrafico@nexosgroup.com';
                    $mail->Password = 'Trafic2024*';
                    // $mail->Username = 'ing.lucasvillegas@gmail.com';
                    // $mail->Password = 'ybdnfqlhghpwdnoa';
                    $mail->SetFrom('desarrolladores@nexosgroup.com', 'Nexos Cargo S.A.S');
                    // $mail->SetFrom('controltrafico@nexosgroup.com', 'Nexos Cargo S.A.S');

                    // Añadir cada correo asociado
                    $mail->AddAddress("liucasda@gmail.com");
                    // foreach ($contactos_grupo as $email) {
                    //   $email = trim($email['email']); // Quitar espacios en blanco
                    //   if (filter_var($email, FILTER_VALIDATE_EMAIL)) { // Validar formato de correo
                    //     $mail->AddAddress($email);
                    //   }
                    // }

                    // Añadir imágenes embebidas
                    // $mail->AddEmbeddedImage('C:/appserver/Apache24/htdocs/mvcLuisMiguel/' . 'public/img/magnetron.png', 'magnetron_logo', 'magnetron.png');
                    $mail->AddEmbeddedImage('C:/appserver/Apache24/htdocs/mvcLuisMiguel/' . 'public/img/' . $logo_cliente, 'magnetron_logo', 'Logo.png');
                    $mail->AddEmbeddedImage('C:/appserver/Apache24/htdocs/mvcLuisMiguel/' . 'public/img/nexos.png', 'nexos_logo', 'nexos.png');

                    // Generar contenido dinámico
                    $template = file_get_contents('C:/appserver/Apache24/htdocs/mvcLuisMiguel/views/templates/magnetron.php');
                    $contenidoDinamico = '';
                    $contenidoDinamico .= '<tr>';
                    $contenidoDinamico .= '<td>' . htmlspecialchars($dato['Referencia']) . '</td>';
                    $contenidoDinamico .= '<td>' . htmlspecialchars($dato['numero_contenedor']) . '</td>';
                    $contenidoDinamico .= '<td>' . htmlspecialchars($dato['placa']) . '</td>';
                    $contenidoDinamico .= '<td>' . htmlspecialchars($dato['Conductor']) . '</td>';
                    $contenidoDinamico .= '<td>' . htmlspecialchars($dato['conductor_manifiesto']) . '</td>';
                    $contenidoDinamico .= '<td>' . htmlspecialchars($dato['origen']) . '</td>';
                    $contenidoDinamico .= '<td>' . htmlspecialchars($dato['destino']) . '</td>';
                    // $contenidoDinamico .= '<td>' . htmlspecialchars($dato['novedad'] . '-' . $dato['Municipio']) . '</td>';
                    $contenidoDinamico .= '<td>' . htmlspecialchars($novedad . '-' . $dato['Municipio']) . '</td>';
                    $contenidoDinamico .= '<td></td>';
                    $contenidoDinamico .= '<td>' . htmlspecialchars($dato['fecha_trazabilidad']) . '</td>';
                    $contenidoDinamico .= '</tr>';

                    // $titulo_cliente = "MAGNETRON S.A.S";
                    // Reemplazar el contenido dinámico en la plantilla
                    // $template = str_replace('{{Titulo_Cliente}}', $titulo_cliente, $template);
                    $template = str_replace('{{Titulo_Cliente}}', $cliente_nombre, $template);
                    $template = str_replace('{{contenido_dinamico}}', $contenidoDinamico, $template);

                    // Configura los detalles del correo
                    $mail->Subject = $dato['Referencia'];
                    $mail->Body = $template;
                    $mail->AltBody = strip_tags($template);

                    // Enviar el correo
                    if ($mail->Send()) {
                      echo "Correo enviado con éxito a: " . implode(", ", $correos) . "<br/>";
                      // $sqlm = $conexion->prepare("INSERT INTO cmx_mail_enviados (id, id_servicio, manifesto_id, id_fecha_parametro, fecha, hora, usuario, modalidad)
                      //                                                 VALUES(null, :nundoc_solicitud, :manifiesto, :seguimiento_inicio_id, :fecha, :hora, :usuario, 'Automático')");
                      // $sqlm->bindParam(':nundoc_solicitud', $dato['nundoc_solicitud']);
                      // $sqlm->bindParam(':manifiesto', $dato['id_manifiesto']);
                      // $sqlm->bindParam(':seguimiento_inicio_id', $dato['seguimiento_inicio_id']);
                      // $sqlm->bindParam(':fecha', $fecha);
                      // $sqlm->bindParam(':hora', $hora);
                      // $sqlm->bindParam(':usuario', 'system'); // Cambiar por el usuario real
                      $sqlm->execute();
                    } else {
                      echo 'Mailer Error: ' . $mail->ErrorInfo . "<br/>";
                      // $sqlm = $conexion->prepare("INSERT INTO cmx_mail_enviados (id, id_servicio, manifesto_id, id_fecha_parametro, fecha, hora, usuario, modalidad)
                      // VALUES(null, :nundoc_solicitud, :manifiesto, :seguimiento_inicio_id, :fecha, :hora, :usuario, 'Automático')");
                      // $sqlm->bindParam(':nundoc_solicitud', $dato['nundoc_solicitud']);
                      // $sqlm->bindParam(':manifiesto', $dato['id_manifiesto']);
                      // $sqlm->bindParam(':seguimiento_inicio_id', $dato['seguimiento_inicio_id']);
                      // $sqlm->bindParam(':fecha', $fecha);
                      // $sqlm->bindParam(':hora', $hora);
                      // $sqlm->bindParam(':usuario', 'system'); // Cambiar por el usuario real
                      // $sqlm->execute();
                    }
                  }
                }
              } else {
                echo "No hay datos no agrupados 2" . "<br/>";
              }
            }
          }
        }
      }
    }
    // Imprimir los contactos agrupados
    // print_r($agrupados_por_cliente);
  } else {
    echo 'No hay datos para generar el correo' . "\n";
  }
} catch (PDOException $e) {
  echo "Error en la conexión: " . $e->getMessage();
}
