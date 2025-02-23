<?php

use PhpParser\Node\Expr\Empty_;

include '../application/Conexion.php';

require_once '../application/Config.php';

session_start();

class Trafico
{

    public $user_log;

    public $pass;

    public $mensaje;

    public $respuesta;

    public $email;

    public $listado;

    //RUTAS

    public function insertar_ruta()
    {

        $_msg_error = "";

        $model = new Conexion;

        $conexion = $model->conectar();

        $origen = $_POST["origen"];

        $destino = $_POST["destino"];

        $observa = $_POST["observa"];

        $fecha = $_POST["fecha"];

        $hora = $_POST["hora"];

        $user = $_POST["user"];

        $latitud_origen = $_POST["latitud_origen"];

        $latitud_destino = $_POST["latitud_destino"];

        $longitud_origen = $_POST["longitud_origen"];

        $longitud_destino = $_POST["longitud_destino"];

        $tiempo_tot = $_POST["tiempo_tot"];

        $kilo_tot = $_POST["kilo_tot"];

        $sql = "INSERT INTO cmx_rutas

				(id,cod_ciudad_origen,cod_ciudad_destino,estado,observaciones,fecha,hora,usuario,latitud_origen,latitud_destino,longitud_origen,longitud_destino,tiempo_tot_ruta,km_tot_ruta)

				VALUES(null,'$origen','$destino','habilitado','$observa','$fecha','$hora','$user','$latitud_origen','$latitud_destino','$longitud_origen','$longitud_destino','$tiempo_tot','$kilo_tot')";

        $crearruta = $conexion->prepare($sql);

        $result = $crearruta->execute();

        $return["success"] = true;

        // $return["error"] = $_msg_error;

        return $return;
    }

    public function update_ruta()
    {

        $_msg_error = "";

        $model = new Conexion;

        $conexion = $model->conectar();

        $id = $_POST["id"];

        $origen = $_POST["origen"];

        $destino = $_POST["destino"];

        $observa = $_POST["observa"];

        $fecha = $_POST["fecha"];

        $hora = $_POST["hora"];

        $user = $_POST["user"];

        $estado = $_POST["estado"];

        $vla_ori_e = $_POST["vla_ori_e"];

        $vla_des_e = $_POST["vla_des_e"];

        $vlo_ori_e = $_POST["vlo_ori_e"];

        $vlo_des_e = $_POST["vlo_des_e"];

        $tiempoe = $_POST["tiempoe"];

        $kilometroe = $_POST["kilometroe"];

        $sql = "UPDATE cmx_rutas

				SET cod_ciudad_origen='$origen',

				cod_ciudad_destino='$destino',

				observaciones='$observa',

				estado='$estado',

				latitud_origen='$vla_ori_e',

				latitud_destino='$vla_des_e',

				longitud_origen='$vlo_ori_e',

				longitud_destino='$vlo_des_e',

				tiempo_tot_ruta='$tiempoe',

				km_tot_ruta='$kilometroe'

				WHERE id=$id";

        $actualizarruta = $conexion->prepare($sql);

        $result = $actualizarruta->execute();

        $return["success"] = true;

        // $return["error"] = $_msg_error;

        return $return;
    }

    //PLANES

    public function crear_plan()
    {

        $_msg_error = "";

        $model = new Conexion;

        $conexion = $model->conectar();

        $id_ruta = $_POST["id_ruta"];

        $cod_plan = $_POST["cod_plan"];

        $cab = $_POST["cab"];

        if ($cab == '1') {

            // echo 'entro a cabecera';

            $name_plan = $_POST["name_plan"];

            $detallep = $_POST["detallep"];

            $fplan = $_POST["fplan"];

            $hplan = $_POST["hplan"];

            $uplan = $_POST["uplan"];

            $sql = "INSERT INTO cmx_plan_ruta

					(id,cod_plan,nombre_plan,cod_ruta,estado, observacion,fecha,hora,usuario)

					VALUES(null,$cod_plan,'$name_plan',$id_ruta,'Activo','$detallep',

					'$fplan','$hplan','$uplan')";

            // echo $sql;

            $crearplan = $conexion->prepare($sql);

            $result = $crearplan->execute();
        }

        $punto = $_POST["punto"];

        if ($punto == '2') {

            //agregar puntos

            $ciudad = $_POST["ciudad"];

            $name_punto = $_POST["name_punto"];

            $tiempo = $_POST["tiempo"];

            $orden = $_POST["orden"];

            $descri = $_POST["descri"];

            $tipo_punto = $_POST["tipo_punto"];

            $latitud = $_POST["latitud"];

            $longitud = $_POST["longitud"];

            $kilometros = $_POST["kilometros"];

            $fecha = date('Y-m-d');

            $hora = date('H:i:s');

            $user = $_SESSION["usuario"]["nom_usuario"];

            $sql3 = "INSERT INTO cmx_planruta_detalle

					(id,cod_plan,cod_ciudad,nombre_punto,descripcion_punto,tiempo_estimacion,estado,fecha,hora,usuario,orden,tipo_punto,latitud,longitud,km_estimacion)

					VALUES(null,'$cod_plan','$ciudad','$name_punto',

					'$descri','$tiempo','habilitado','$fecha','$hora','$user','$orden','$tipo_punto','$latitud','$longitud','$kilometros')";

            $crearplan = $conexion->prepare($sql3);

            $result = $crearplan->execute();
        }

        $final = $_POST["fin"];

        if ($final == '3') {

            $puntofinal = $_POST["puntofinal"];

            $tiempofinal = $_POST["tiempofinal"];

            $descripfinal = $_POST["descripfinal"];

            $kmfinal = $_POST["kmfinal"];

            $ordenfinal = $_POST["ordenfinal"];

            $tpfinal = $_POST["tpfinal"];

            $latitudfinal = $_POST["latitudfinal"];

            $longifinal = $_POST["longifinal"];

            $ubicacion = $_POST["ubicacion"];

            $fecha = date('Y-m-d');

            $hora = date('H:i:s');

            $user = $_SESSION["usuario"]["nom_usuario"];

            $sql4 = "INSERT INTO cmx_planruta_detalle

					(id,cod_plan,cod_ciudad,nombre_punto,descripcion_punto,tiempo_estimacion,estado,fecha,hora,usuario,orden,tipo_punto,latitud,longitud,km_estimacion)

					VALUES(null,'$cod_plan','$ubicacion','$puntofinal',

					'$descripfinal','$tiempofinal','habilitado','$fecha','$hora','$user','$ordenfinal','$tpfinal','$latitudfinal','$longifinal','$kmfinal')";

            $crearplan = $conexion->prepare($sql4);

            $result = $crearplan->execute();
        }

        $return["success"] = true;

        // $return["error"] = $_msg_error;

        return $return;
    }

    public function update_plan()
    {

        $_msg_error = "";

        $model = new Conexion;

        $conexion = $model->conectar();

        $id_plan = $_POST["id_plan"];

        $namplan = $_POST["namplan"];

        $detaplan = $_POST["detaplan"];

        $es_plan = $_POST["es_plan"];

        $sql = "UPDATE cmx_plan_ruta

				SET nombre_plan='$namplan',

				observacion='$detaplan',

				estado='$es_plan'

				WHERE cod_plan=$id_plan   ";

        $crearplan = $conexion->prepare($sql);

        $result = $crearplan->execute();

        if ($result) {

            $return["success"] = true;

            // $return["error"] = $_msg_error;

            return $return;
        }
    }

    public function agregar_punto()
    {

        $_msg_error = "";

        $model = new Conexion;

        $conexion = $model->conectar();

        $codigo_ruta = $_POST["codigo_ruta"];

        $id_plan = $_POST["id_plan"];

        $ciudad = $_POST["ciudad"];

        $punto = $_POST["nombrepunto"];

        $tiempo = $_POST["tiempo"];

        $decri = $_POST["decri"];

        $orden = $_POST["orden"];

        $tipopunto = $_POST["tipopunto"];

        $lati = $_POST["lati"];

        $long = $_POST["long"];

        $fecha = date('Y-m-d');

        $hora = date('H:i:s');

        $kilome = $_POST["kilome"];

        $user = $_SESSION["usuario"]["nom_usuario"];

        $sql = "

				INSERT INTO cmx_planruta_detalle

				(id,cod_plan,cod_ciudad,nombre_punto,descripcion_punto,tiempo_estimacion,estado,fecha,hora,usuario,orden,tipo_punto,latitud,longitud,km_estimacion)

				VALUES(null,'$id_plan','$ciudad','$punto','$decri','$tiempo','habilitado','$fecha','$hora','$user','$orden','$tipopunto','$lati','$long','$kilome')";

        $crearplan = $conexion->prepare($sql);

        $result = $crearplan->execute();

        $return["success"] = true;

        // $return["error"] = $_msg_error;

        return $return;
    }

    //INCIO DE RUTA
    public function crear_inicio()
    {

        $_msg_error = "";
        $model = new Conexion;
        $conexion = $model->conectar();
        $fecha = date('Y-m-d');
        $hora = date('H:i:s');
        $user = $_SESSION["usuario"]["nom_usuario"];
        $cab = $_POST["cab"];
        if ($cab == '1') {
            $cod_ini = $_POST["cod_ini"];
            $mani = $_POST["mani"];
            $cedula = $_POST["cedula"];
            $placa = $_POST["placa"];
            $Plan = $_POST["Plan"];
            $obse = $_POST["obse"];
            $id_estudio = $_POST["id_estudio"]; //id del estudio de seguridad
            $calvetj = $_POST["calvetj"];
            $fechasalida = $_POST["fechasalida"];
            $horasalida = $_POST["horasalida"];
            //Cambio de estado a la solicitud de estudio de seguridad

            $sql = "INSERT INTO cmx_inicio_ruta(id,cod_inicio,num_manifiesto, cod_plan,cond_cedula,placa, observacion,fecha,hora,usuario,clave_tarjeta,fechasalida,horasalida)
				VALUES(null,'$cod_ini','$mani','$Plan','$cedula','$placa','$obse','$fecha','$hora','$user','$calvetj','$fechasalida','$horasalida')";
            $crearinicio = $conexion->prepare($sql);
            $result = $crearinicio->execute();

            if ($result) {
                $sql_update_manifiesto = "UPDATE cmx_manifiesto SET estado_seguimiento='SALIDA' WHERE id='$mani'";
                $result_update = $conexion->prepare($sql_update_manifiesto);
                $resultado_update = $result_update->execute();
                if ($resultado_update) {
                    //insert en tabla manifiesto
                    $sql3 = "INSERT INTO cmx_inici_manifiesto_estado (id,cod_ini_ruta,estado,actual,fecha,hora,usuario,ultimo_estado)VALUES(null,'$cod_ini','2','completado','$fecha','$hora','$user','1')";
                    $crearmani = $conexion->prepare($sql3);
                    $result = $crearmani->execute();

                    //CONSULTAR NUMEROS DE SOLICITUD DE SERVICIO
                    $sqlx = "SELECT id_servicio FROM cmx_planilla_detalle1 WHERE id_planilla=$id_estudio";
                    $consul = $conexion->prepare($sqlx);
                    $result = $consul->execute();
                    $numero_servicio = $consul->fetchAll();
                    foreach ($numero_servicio as $value) {
                        $num = $value['id_servicio'];
                        $sqli = "INSERT INTO cmx_cliente_envio (id,estado,fecha,hora,usuario,id_servicio,cod_ini_ruta)VALUES(null,'1','$fecha','$hora','$user','$num','$cod_ini')";
                        $crear = $conexion->prepare($sqli);
                        $result2 = $crear->execute();
                    }
                } else {
                    # code...
                }
            }
        }

        //puntos de entrega
        $pun = $_POST["pun"];

        if ($pun == '2') {
            $cod_ini = $_POST["cod_ini"];
            $mentrega = $_POST["mentrega"];
            $dire = $_POST["dire"];
            $cliente = $_POST["clientea"];
            $remesa = $_POST["remesa"];
            $fentrega = $_POST["fentrega"];
            $obs = $_POST["obs"];
            $hora = $_POST["hora"];
            $tipo = $_POST["tipo"];
            $orden = $_POST["orden"];
            $sql2 = "INSERT INTO cmx_ruta_puntosentrega(id,cod_ini_ruta,municipio_entrega,direccion_entrega,cliente,remesa,fecha_estimada_entrega,observacion,fecha,hora,usuario,hora_estimada,tipo,orden)
				VALUES(null,'$cod_ini','$mentrega','$dire','$cliente','$remesa','$fentrega','$obs','$fecha','$hora','$user','$hora','$tipo','$orden')";
            // echo $slq2;
            $crearentre = $conexion->prepare($sql2);
            $result = $crearentre->execute();
        }

        $return["success"] = true;
        // $return["error"] = $_msg_error;
        return $return;
    }

    //SEGUIMEINTO RUTA

    public function crear_seguimiento()
    {

        $_msg_error = "";

        $model = new Conexion;

        $conexion = $model->conectar();

        $fecha = date('Y-m-d');

        $hora = date('H:i:s');

        $user = $_SESSION["usuario"]["nom_usuario"];

        $idm = $_POST["idmanifiesto"];

        $contacto = $_POST["contacto"];

        $tsegui = $_POST["tsegui"];

        $tdetalle = $_POST["tdetalle"];

        $tproceso = $_POST["tproceso"];

        $observa = $_POST["observa"];

        $sql = "

				INSERT INTO cmx_inicio_seguimiento

				(id,cod_man_estado,tipo_contacto,tipo_seguimiento,detalle_tipo,tipo_proceso,observacion,fecha,hora,usuario)

				VALUES(null,'$idm','$contacto','$tsegui',

				'$tdetalle','$tproceso','$observa','$fecha','$hora','$user')

			";

        $crearinicio = $conexion->prepare($sql);

        $result = $crearinicio->execute();

        $return["success"] = true;

        // $return["error"] = $_msg_error;

        return $return;
    }

    public function crear_estado_seguimiento()
    {

        $_msg_error = "";

        $model = new Conexion;

        $conexion = $model->conectar();

        $fecha = date('Y-m-d');

        $hora = date('H:i:s');

        $user = $_SESSION["usuario"]["nom_usuario"];

        $id_ini_ruta = $_POST["id_ini_ruta"];

        $estadoq = $_POST["estadoq"];

        $procesoq = $_POST["procesoq"];

        $noveq = $_POST["noveq"];

        //primero actualizo a cero los que hayan

        //segundo inserto en nuevo estado de seguimiento

        $sql4 = "

				UPDATE cmx_inici_manifiesto_estado

				SET ultimo_estado='0'

				WHERE cod_ini_ruta=$id_ini_ruta ";

        // echo $sql4;

        $updatemani = $conexion->prepare($sql4);

        $result = $updatemani->execute();

        if ($result) {

            $sql3 = "INSERT INTO cmx_inici_manifiesto_estado

					(id,cod_ini_ruta,estado,actual,

					fecha,hora,usuario,ultimo_estado)

					VALUES(null,'$id_ini_ruta','$estadoq','$procesoq','$fecha','$hora','$user','1')";

            $crearmani = $conexion->prepare($sql3);

            $result = $crearmani->execute();
        }

        $return["success"] = true;

        // $return["error"] = $_msg_error;

        return $return;
    }

    public function crear_gestion()
    {
        $_msg_error = "";
        $response = [];
        $model = new Conexion;
        $conexion = $model->conectar();
        $fecha = date('Y-m-d');
        $hora = date('H:i:s');
        $user = $_SESSION["usuario"]["nom_usuario"];
        // $gestion = $_POST["gestion"];
        $data = json_decode(file_get_contents('php://input'), true);

        /* Verificar el si esta enviando el punto de llegada para validar los tiempos logisticos  */
        if ($data["accion_punto"] == "Lugar Llegada") {
            $manifiesto = $data["manifiesto"];
            $ordenes_cargue = $data['orden_cargue_id'];
            $remesas_descargue = $data['remesa_descargue_id'];
            /* Validar los tiempo de cargue del manifiesto */
            $sql_tiempo_cargue = $conexion->prepare("SELECT num_manifiesto,id FROM cmx_tiempo_cargue WHERE num_manifiesto=$manifiesto LIMIT 1");
            $sql_tiempo_cargue->execute();
            $result_tiempo_cargue = $sql_tiempo_cargue->fetch();

            if ($result_tiempo_cargue) {
                $validar_todas_orden_cargue = true; // Inicialmente asumimos que todas las remesas son válidas.
                for ($i = 0; $i < count($ordenes_cargue); $i++) {
                    $orden_cargue = $ordenes_cargue[$i];
                    $sql_ordenes_Cargue = $conexion->prepare("SELECT id_orden_cargue FROM cmx_tiempo_cargue_ordenes WHERE id_orden_cargue=$orden_cargue /*AND id_cargue=$result_tiempo_cargue[id]*/");
                    $sql_ordenes_Cargue->execute();
                    $result_orden_cargue = $sql_ordenes_Cargue->fetch();
                    if (!$result_orden_cargue) {
                        $validar_todas_orden_cargue = false;
                        break;
                    }
                }

                if ($validar_todas_orden_cargue) {
                    /* Validar tiempos logisticos de descargues*/
                    $sql_tiempo_descargue = $conexion->prepare("SELECT num_manifiesto,id FROM cmx_tiempo_descargue WHERE num_manifiesto=$manifiesto LIMIT 1");
                    $sql_tiempo_descargue->execute();
                    $result_tiempo_descargue = $sql_tiempo_descargue->fetch();

                    if ($result_tiempo_descargue) {
                        $validar_todas_remesas = true; // Inicialmente asumimos que todas las remesas son válidas.

                        for ($o = 0; $o < count($remesas_descargue); $o++) {
                            $remesa = $remesas_descargue[$o];
                            $sql_remesas_decargue = $conexion->prepare("SELECT id_remesa FROM cmx_tiempo_descargue_rem WHERE id_remesa = :remesa");
                            $sql_remesas_decargue->bindParam(':remesa', $remesa);
                            $sql_remesas_decargue->execute();
                            $result_remesas_descargue = $sql_remesas_decargue->fetch();

                            // Si alguna remesa no existe, marcamos como falso y rompemos el bucle.
                            if (!$result_remesas_descargue) {
                                $validar_todas_remesas = false;
                                break;
                            }
                        }

                        if ($validar_todas_remesas) {
                            /* Logica para insertar la nota en las tabla de sguimiento del controlador de ruta */
                            // Validar el valor de Ocurrio para las insertsiones a las base de datos
                            if ($data["ocurrio"] == "En sitio") {
                                /* Validar si la novedad es comentario o alguna novedad */
                                if ($data["novedad_general"] == "COMENTARIO" || substr($data["novedad_general"], 0, 7) == "NOVEDAD") {
                                    $codigo = $data["id_ini_ruta"];
                                    /* Consultar el tiempo del ultimo punto de este manifiesto para mantenerlo */
                                    $sql_ultimo_tiempo = $conexion->prepare("SELECT tiempo FROM cmx_inicio_seguimiento WHERE cod_ini_ruta=$codigo ORDER BY id DESC LIMIT 1");
                                    $sql_ultimo_tiempo->execute();
                                    $result_tiempo = $sql_ultimo_tiempo->fetch();
                                    $tiempo = $result_tiempo['tiempo'];
                                    if ($tiempo) {
                                        if ($data) {
                                            $id_ini_ruta = $data["id_ini_ruta"];
                                            $idm = $data["idmanifiesto"];
                                            $contacto = $data["contacto"];
                                            $tsegui = $data["tipo_seguimiento"];
                                            $tdetalle = empty($data["tipo_detalle"]) ? 0 : $data["tipo_detalle"];
                                            $tproceso = $data["tipo_proceso"];
                                            $observa = $data["observacion"];
                                            $reportecliente = $data["reporte_cliente"];
                                            // $estadoactual = $data["estado_actual"];
                                            $deta = $data["accion_completado"];
                                            $nota_punto_controlador = $data["nota_punto_controlador"];
                                            $tipo = $data["tipo_seguimiento"];
                                            if (isset($data["novedad_general"])) {
                                                $new = $data["novedad_general"];
                                            } else {
                                                $new = '';
                                            }
                                            $ocurrio = $data["ocurrio"];
                                            $codigo_punto = empty($data["codigo_punto"]) ? 0 : $data["codigo_punto"];
                                            $accion_punto = $data["accion_punto"];
                                            $manifiesto = $data["manifiesto"];
                                            $estado_punto = 'CERRADO';
                                            //estado
                                            $id_ini_ruta = $data["id_ini_ruta"];
                                            $estadoq = $data["estado_siguiente"];
                                            $procesoq = $data["accion_completado"];

                                            try {
                                                // Iniciar una transacción
                                                $conexion->beginTransaction();
                                                $sql4 = "UPDATE cmx_inici_manifiesto_estado SET ultimo_estado='0' WHERE cod_ini_ruta=$id_ini_ruta";
                                                $updatemani = $conexion->prepare($sql4);
                                                $result = $updatemani->execute();
                                                if ($result) {
                                                    $sql3 = "INSERT INTO cmx_inici_manifiesto_estado (id,cod_ini_ruta,estado,actual,fecha,hora,usuario,ultimo_estado,reporte_cliente)
                                             VALUES(null,'$id_ini_ruta','$estadoq','$procesoq','$fecha','$hora','$user','1','$reportecliente')";
                                                    $crearmani = $conexion->prepare($sql3);
                                                    $result_estado = $crearmani->execute();

                                                    if ($result_estado) {
                                                        // Insertar el registro de seguimiento
                                                        $sql = "INSERT INTO cmx_inicio_seguimiento (id,cod_man_estado,tipo_contacto,tipo_seguimiento,detalle_tipo,tipo_proceso,observacion,fecha,hora,usuario,reporte_cliente,cod_ini_ruta,novedad,ocurrio,codigo_punto,tiempo,estado_punto)
                                                VALUES(null,'$idm','$contacto','$tsegui','$tdetalle','$tproceso','$observa','$fecha','$hora','$user','$reportecliente','$id_ini_ruta','$new','$ocurrio','$codigo_punto','$tiempo','$estado_punto')";
                                                        $crearinicio = $conexion->prepare($sql);
                                                        $result = $crearinicio->execute();

                                                        if ($result) {
                                                            $sqlf = "SELECT max(id) as ids  FROM cmx_inicio_seguimiento WHERE cod_ini_ruta=$id_ini_ruta";
                                                            $consulta_solic = $conexion->prepare($sqlf);
                                                            $consulta_solic->execute();
                                                            $dato = $consulta_solic->fetch();
                                                            $id_seguimiento = $dato["ids"];
                                                            //insertar solicitudes de servicio
                                                            // Nuevo
                                                            $nservicio = $data["solicitud_servicio_nuevo"];
                                                            for ($i = 0; $i < count($nservicio); $i++) {
                                                                $nsolicitud = $nservicio[$i];
                                                                $sqls = "INSERT INTO cmx_seguimiento_servicio (id,id_servicio,id_seguimiento,usuario,hora,fecha)
                                                                VALUES(null,'$nsolicitud','$id_seguimiento','$user','$hora','$fecha');";
                                                                $crearsoli = $conexion->prepare($sqls);
                                                                $result2 = $crearsoli->execute();
                                                            }

                                                            /* Cambiar el estado del manifieto cuando le den en llegada */
                                                            if ($accion_punto == 'Lugar Llegada') {
                                                                $estado = "LLEGADA";
                                                                $estado_punto = "GESTION";
                                                                $sql_es = "UPDATE cmx_manifiesto SET estado_seguimiento='$estado' WHERE id=" . $manifiesto . "";
                                                                $update_est = $conexion->prepare($sql_es);
                                                                $update_est->execute();
                                                                /* COLOCAR EN GESTION PARA CUANDO SEA LUGAR DE LLEGADA PARA HACER MAS GESTION */
                                                                $sql_es = "UPDATE cmx_inicio_seguimiento SET estado_punto='$estado_punto' WHERE cod_ini_ruta=" . $id_ini_ruta . " AND codigo_punto='$codigo_punto'";
                                                                $update_est = $conexion->prepare($sql_es);
                                                                $update_est->execute();
                                                            } else {
                                                                $sql_es = "UPDATE cmx_manifiesto SET estado_seguimiento='SEGUIMIENTO' WHERE id=" . $manifiesto . "";
                                                                $update_est = $conexion->prepare($sql_es);
                                                                $update_est->execute();
                                                            }
                                                        }

                                                        if ($tipo == 'punto geografico') {
                                                            $sqlf = "SELECT max(id) as ids FROM cmx_inicio_seguimiento WHERE cod_ini_ruta=$id_ini_ruta";
                                                            $consulta_solic = $conexion->prepare($sqlf);
                                                            $consulta_solic->execute();
                                                            $dato = $consulta_solic->fetch();
                                                            $id_seguimiento = $dato["ids"];
                                                            $ubilatitud = $data["latitud"];
                                                            $ubilongitud = $data["longitud"];
                                                            $edoc = empty($data["edocu"]) ? 0 : $data["edocu"];
                                                            $sql = "INSERT INTO cmx_iniruta_ubicacion (id,cod_ini_ruta,latitud,longitud,usuario,fecha,hora,lugar,id_seguimiento,existe_evidencia)
                                                    VALUES(null,$id_ini_ruta,$ubilatitud,$ubilongitud,'$user','$fecha','$hora',$tdetalle,$id_seguimiento,$edoc)";
                                                            $crearubi = $conexion->prepare($sql);
                                                            $result2 = $crearubi->execute();
                                                            if ($result2) {
                                                                //Archivo
                                                                $aleatorio1 = rand(10000, 90000);
                                                                $ruta_evidencia = "../public/files/evidencia_seguimiento/" . $id_ini_ruta . "/" . $id_seguimiento . "/";
                                                                $ruta_evidencia2 = "public/files/evidencia_seguimiento/" . $id_ini_ruta . "/" . $id_seguimiento . "/";
                                                                if (!file_exists($ruta_evidencia)) {
                                                                    mkdir($ruta_evidencia, 0777, true);
                                                                }
                                                                $sqlt = "SELECT max(id) as idu  FROM cmx_iniruta_ubicacion WHERE id_seguimiento=id_seguimiento";
                                                                $consulta_solic = $conexion->prepare($sqlt);
                                                                $consulta_solic->execute();
                                                                $dato = $consulta_solic->fetch();
                                                                $id_ubica = $dato["idu"];
                                                                $sqlub = "UPDATE cmx_iniruta_ubicacion
                                                    SET evidencia='$ruta_evidencia2',
                                                    existe_evidencia=" . $edoc . "
                                                    WHERE id = " . $id_ubica . "";
                                                                $consulta = $conexion->prepare($sqlub);
                                                                $consulta->execute();
                                                                for ($i = 0; $i < count($_FILES); $i++) {
                                                                    if (isset($_FILES["udocumnento" . $i])) {
                                                                        $file = $_FILES["udocumnento" . $i];
                                                                        $nombre = $file["name"];
                                                                        $tipo = $file["type"];
                                                                        $ruta_provisional = $file["tmp_name"];
                                                                        $carpeta = $ruta_evidencia;
                                                                        $src = $carpeta . $nombre;
                                                                        move_uploaded_file($ruta_provisional, $src);
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    } else {
                                                        $response = ["success" => false, "message" => "<b>Error:</b>  Nota no registrada en el sistema, por favor intentarlo nuevamente o comomunicarse con sistemas."];
                                                    }
                                                }
                                                // Confirmar la transacción
                                                $conexion->commit();
                                                $response = ["success" => true, "message" => "<b>Nota:</b>  Registrada exitosamente en NexosApp."];
                                            } catch (\Throwable $e) {
                                                // Ocurrió un error, deshacer la transacción
                                                $conexion->rollback();
                                                // echo "Error en la transacción: " . $e->getMessage();
                                                // Registrar el error en un archivo de log en la raíz del proyecto
                                                $errorMessage = "Error en la transacción al insertar nota controlador: " . $e->getMessage() . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
                                                $logFilePath = 'error_log.txt'; // Ajusta la ruta según la estructura de tu proyecto
                                                error_log($errorMessage, 3, $logFilePath);

                                                // Verificar si el archivo de log se ha escrito correctamente
                                                if (!file_exists($logFilePath)) {
                                                    error_log("No se pudo crear el archivo de log: $logFilePath\n", 3, $logFilePath);
                                                }

                                                // Mostrar un mensaje amigable al usuario
                                                $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                                            }
                                        } else {
                                            $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                                        }
                                    } else {
                                        $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                                    }
                                } else {
                                    if ($data) {
                                        $id_ini_ruta = $data["id_ini_ruta"];
                                        $idm = $data["idmanifiesto"];
                                        $contacto = $data["contacto"];
                                        $tsegui = $data["tipo_seguimiento"];
                                        $tdetalle = $data["tipo_detalle"];
                                        $tproceso = $data["tipo_proceso"];
                                        $observa = $data["observacion"];
                                        $reportecliente = $data["reporte_cliente"];
                                        $deta = $data["accion_completado"];
                                        $nota_punto_controlador = $data["nota_punto_controlador"];
                                        $tipo = $data["tipo_seguimiento"];
                                        if (isset($data["novedad_general"])) {
                                            $new = $data["novedad_general"];
                                        } else {
                                            $new = '';
                                        }
                                        $ocurrio = $data["ocurrio"];
                                        $codigo_punto = $data["codigo_punto"];
                                        $accion_punto = $data["accion_punto"];
                                        $manifiesto = $data["manifiesto"];
                                        $estado_punto = 'CERRADO';
                                        //estado
                                        $id_ini_ruta = $data["id_ini_ruta"];
                                        $estadoq = $data["estado_siguiente"];
                                        $procesoq = $data["accion_completado"];

                                        try {
                                            // Iniciar una transacción
                                            $conexion->beginTransaction();
                                            $sql4 = "UPDATE cmx_inici_manifiesto_estado SET ultimo_estado='0' WHERE cod_ini_ruta=$id_ini_ruta";
                                            $updatemani = $conexion->prepare($sql4);
                                            $result = $updatemani->execute();
                                            if ($result) {
                                                $sql3 = "INSERT INTO cmx_inici_manifiesto_estado (id,cod_ini_ruta,estado,actual,fecha,hora,usuario,ultimo_estado,reporte_cliente)
                                                 VALUES(null,'$id_ini_ruta','$estadoq','$procesoq','$fecha','$hora','$user','1','$reportecliente')";
                                                $crearmani = $conexion->prepare($sql3);
                                                $result_estado = $crearmani->execute();

                                                if ($result_estado) {
                                                    // Insertar el registro de seguimiento
                                                    $sql = "INSERT INTO cmx_inicio_seguimiento (id,cod_man_estado,tipo_contacto,tipo_seguimiento,detalle_tipo,tipo_proceso,observacion,fecha,hora,usuario,reporte_cliente,cod_ini_ruta,novedad,ocurrio,codigo_punto,tiempo,estado_punto)
                                                    VALUES(null,'$idm','$contacto','$tsegui','$tdetalle','$tproceso','$observa','$fecha','$hora','$user','$reportecliente','$id_ini_ruta','$new','$ocurrio','$codigo_punto',-59,'$estado_punto')";
                                                    $crearinicio = $conexion->prepare($sql);
                                                    $result = $crearinicio->execute();

                                                    if ($result) {
                                                        $sqlf = "SELECT max(id) as ids  FROM cmx_inicio_seguimiento WHERE cod_ini_ruta=$id_ini_ruta";
                                                        $consulta_solic = $conexion->prepare($sqlf);
                                                        $consulta_solic->execute();
                                                        $dato = $consulta_solic->fetch();
                                                        $id_seguimiento = $dato["ids"];
                                                        //insertar solicitudes de servicio
                                                        // Nuevo
                                                        $nservicio = $data["solicitud_servicio_nuevo"];
                                                        for ($i = 0; $i < count($nservicio); $i++) {
                                                            $nsolicitud = $nservicio[$i];
                                                            $sqls = "INSERT INTO cmx_seguimiento_servicio (id,id_servicio,id_seguimiento,usuario,hora,fecha)
                                                            VALUES(null,'$nsolicitud','$id_seguimiento','$user','$hora','$fecha');";
                                                            $crearsoli = $conexion->prepare($sqls);
                                                            $result2 = $crearsoli->execute();
                                                        }

                                                        /* Cambiar el estado del manifieto cuando le den en llegada */
                                                        if ($accion_punto == 'Lugar Llegada') {
                                                            $estado = "LLEGADA";
                                                            $estado_punto = "GESTION";
                                                            $sql_es = "UPDATE cmx_manifiesto SET estado_seguimiento='$estado' WHERE id=" . $manifiesto . "";
                                                            $update_est = $conexion->prepare($sql_es);
                                                            $update_est->execute();
                                                            /* COLOCAR EN GESTION PARA CUANDO SEA LUGAR DE LLEGADA PARA HACER MAS GESTION */
                                                            $sql_es = "UPDATE cmx_inicio_seguimiento SET estado_punto='$estado_punto' WHERE cod_ini_ruta=" . $id_ini_ruta . " AND codigo_punto='$codigo_punto'";
                                                            $update_est = $conexion->prepare($sql_es);
                                                            $update_est->execute();
                                                        } else {
                                                            $sql_es = "UPDATE cmx_manifiesto SET estado_seguimiento='SEGUIMIENTO' WHERE id=" . $manifiesto . "";
                                                            $update_est = $conexion->prepare($sql_es);
                                                            $update_est->execute();
                                                        }
                                                    }

                                                    if ($tipo == 'punto geografico') {
                                                        $sqlf = "SELECT max(id) as ids FROM cmx_inicio_seguimiento WHERE cod_ini_ruta=$id_ini_ruta";
                                                        $consulta_solic = $conexion->prepare($sqlf);
                                                        $consulta_solic->execute();
                                                        $dato = $consulta_solic->fetch();
                                                        $id_seguimiento = $dato["ids"];
                                                        $ubilatitud = $data["latitud"];
                                                        $ubilongitud = $data["longitud"];
                                                        $edoc = empty($data["edocu"]) ? 0 : $data["edocu"];
                                                        //$udocumnento=$_POST["udocumnento"];
                                                        $sql = "INSERT INTO cmx_iniruta_ubicacion (id,cod_ini_ruta,latitud,longitud,usuario,fecha,hora,lugar,id_seguimiento,existe_evidencia)
                                                         VALUES(null,$id_ini_ruta,$ubilatitud,$ubilongitud,'$user','$fecha','$hora',$tdetalle,$id_seguimiento,$edoc)";
                                                        //echo 'INSERTE UBICACION'.$sql;
                                                        $crearubi = $conexion->prepare($sql);
                                                        $result2 = $crearubi->execute();
                                                        if ($result2) {
                                                            //Archivo
                                                            //if ($i=0;$i<count($_FILES);$i++){
                                                            $aleatorio1 = rand(10000, 90000);
                                                            $ruta_evidencia = "../public/files/evidencia_seguimiento/" . $id_ini_ruta . "/" . $id_seguimiento . "/";
                                                            $ruta_evidencia2 = "public/files/evidencia_seguimiento/" . $id_ini_ruta . "/" . $id_seguimiento . "/";
                                                            if (!file_exists($ruta_evidencia)) {
                                                                mkdir($ruta_evidencia, 0777, true);
                                                            }
                                                            $sqlt = "SELECT max(id) as idu  FROM cmx_iniruta_ubicacion WHERE id_seguimiento=id_seguimiento";
                                                            $consulta_solic = $conexion->prepare($sqlt);
                                                            $consulta_solic->execute();
                                                            $dato = $consulta_solic->fetch();
                                                            $id_ubica = $dato["idu"];
                                                            $sqlub = "UPDATE cmx_iniruta_ubicacion
                                                SET evidencia='$ruta_evidencia2',
                                                existe_evidencia=" . $edoc . "
                                                WHERE id = " . $id_ubica . "";
                                                            $consulta = $conexion->prepare($sqlub);
                                                            $consulta->execute();
                                                            for ($i = 0; $i < count($_FILES); $i++) {
                                                                if (isset($_FILES["udocumnento" . $i])) {
                                                                    $file = $_FILES["udocumnento" . $i];
                                                                    $nombre = $file["name"];
                                                                    $tipo = $file["type"];
                                                                    $ruta_provisional = $file["tmp_name"];
                                                                    $carpeta = $ruta_evidencia;
                                                                    $src = $carpeta . $nombre;
                                                                    move_uploaded_file($ruta_provisional, $src);
                                                                }
                                                            }
                                                        }
                                                    }
                                                } else {
                                                    $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                                                }
                                            }
                                            // Confirmar la transacción
                                            $conexion->commit();
                                            $response = ["success" => true, "message" => "<b>Nota:</b>  Registrada exitosamente en NexosApp."];
                                        } catch (\Throwable $e) {
                                            //throw $th;
                                            // Ocurrió un error, deshacer la transacción
                                            $conexion->rollback();
                                            // Registrar el error en un archivo de log en la raíz del proyecto
                                            $errorMessage = "Error en la transacción al insertar nota controlador: " . $e->getMessage() . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
                                            $logFilePath = 'error_log.txt'; // Ajusta la ruta según la estructura de tu proyecto
                                            error_log($errorMessage, 3, $logFilePath);

                                            // Verificar si el archivo de log se ha escrito correctamente
                                            if (!file_exists($logFilePath)) {
                                                error_log("No se pudo crear el archivo de log: $logFilePath\n", 3, $logFilePath);
                                            }

                                            // Mostrar un mensaje amigable al usuario
                                            $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                                        }
                                    } else {
                                        $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                                    }
                                }
                            } else {
                                //Antes
                                if ($data["novedad_general"] == "COMENTARIO" || substr($data["novedad_general"], 0, 7) == "NOVEDAD") {
                                    $codigo = $data["id_ini_ruta"];
                                    /* Consultar el tiempo del ultimo punto de este manifiesto para mantenerlo */
                                    $sql_ultimo_tiempo = $conexion->prepare("SELECT tiempo FROM cmx_inicio_seguimiento WHERE cod_ini_ruta=$codigo ORDER BY id DESC LIMIT 1");
                                    $sql_ultimo_tiempo->execute();
                                    $result_tiempo = $sql_ultimo_tiempo->fetch();
                                    $tiempo = $result_tiempo['tiempo'];
                                    if ($tiempo) {
                                        if ($data) {
                                            $id_ini_ruta = $data["id_ini_ruta"];
                                            $idm = $data["idmanifiesto"];
                                            $contacto = $data["contacto"];
                                            $tsegui = $data["tipo_seguimiento"];
                                            $tdetalle = empty($data["tipo_detalle"]) ? 0 : $data["tipo_detalle"];
                                            $tproceso = $data["tipo_proceso"];
                                            $observa = $data["observacion"];
                                            $reportecliente = $data["reporte_cliente"];
                                            $deta = $data["accion_completado"];
                                            $nota_punto_controlador = $data["nota_punto_controlador"];
                                            $tipo = $data["tipo_seguimiento"];
                                            if (isset($data["novedad_general"])) {
                                                $new = $data["novedad_general"];
                                            } else {
                                                $new = '';
                                            }
                                            $ocurrio = $data["ocurrio"];
                                            $codigo_punto = empty($data["codigo_punto"]) ? 0 : $data["codigo_punto"];
                                            $accion_punto = $data["accion_punto"];
                                            $manifiesto = $data["manifiesto"];
                                            $estado_punto = 'CERRADO';
                                            //estado
                                            $id_ini_ruta = $data["id_ini_ruta"];
                                            $estadoq = $data["estado_siguiente"];
                                            $procesoq = $data["accion_completado"];
                                            /* Para registrar los puntos que no estan creados en el sistema */
                                            if ($nota_punto_controlador) {
                                                try {
                                                    // Iniciar una transacción
                                                    $conexion->beginTransaction();
                                                    $sql4 = "UPDATE cmx_inici_manifiesto_estado SET ultimo_estado='0' WHERE cod_ini_ruta=$id_ini_ruta";
                                                    $updatemani = $conexion->prepare($sql4);
                                                    $result = $updatemani->execute();
                                                    if ($result) {
                                                        $sql3 = "INSERT INTO cmx_inici_manifiesto_estado (id,cod_ini_ruta,estado,actual,fecha,hora,usuario,ultimo_estado,reporte_cliente)
                                                         VALUES(null,'$id_ini_ruta','$estadoq','$procesoq','$fecha','$hora','$user','1','$reportecliente')";
                                                        $crearmani = $conexion->prepare($sql3);
                                                        $result_estado = $crearmani->execute();

                                                        if ($result_estado) {
                                                            // Insertar el registro de seguimiento
                                                            $sql = "INSERT INTO cmx_inicio_seguimiento (id,cod_man_estado,tipo_contacto,tipo_seguimiento,detalle_tipo,tipo_proceso,observacion,fecha,hora,usuario,reporte_cliente,cod_ini_ruta,novedad,ocurrio,codigo_punto,tiempo,estado_punto)
                                                            VALUES(null,'$idm','$contacto','$tsegui','$tdetalle','$tproceso','$observa','$fecha','$hora','$user','$reportecliente','$id_ini_ruta','$new','$ocurrio','$codigo_punto','$tiempo','$estado_punto')";
                                                            $crearinicio = $conexion->prepare($sql);
                                                            $result = $crearinicio->execute();

                                                            if ($result) {
                                                                $sqlf = "SELECT max(id) as ids  FROM cmx_inicio_seguimiento WHERE cod_ini_ruta=$id_ini_ruta";
                                                                $consulta_solic = $conexion->prepare($sqlf);
                                                                $consulta_solic->execute();
                                                                $dato = $consulta_solic->fetch();
                                                                $id_seguimiento = $dato["ids"];
                                                                //insertar solicitudes de servicio
                                                                // Nuevo
                                                                $nservicio = $data["solicitud_servicio_nuevo"];
                                                                for ($i = 0; $i < count($nservicio); $i++) {
                                                                    $nsolicitud = $nservicio[$i];
                                                                    $sqls = "INSERT INTO cmx_seguimiento_servicio (id,id_servicio,id_seguimiento,usuario,hora,fecha)
                                                                    VALUES(null,'$nsolicitud','$id_seguimiento','$user','$hora','$fecha');";
                                                                    $crearsoli = $conexion->prepare($sqls);
                                                                    $result2 = $crearsoli->execute();
                                                                }
                                                                //Insertar en la tabla de punto de control para los sitios no establecidos en el plan de ruta inicial
                                                                $sqlpuntocontrol = "INSERT INTO cmx_puntos_controlador(seguimiento_id,punto_controlador,usuario,fecha_at)
                                                                VALUES('$id_seguimiento','$nota_punto_controlador','$user','$fecha.$hora')";
                                                                $crearPuntocontrol = $conexion->prepare($sqlpuntocontrol);
                                                                $crearPuntocontrol->execute();

                                                                /* Cambiar el estado del manifieto cuando le den en llegada */
                                                                if ($accion_punto == 'Lugar Llegada') {
                                                                    $estado = "LLEGADA";
                                                                    $estado_punto = "GESTION";
                                                                    $sql_es = "UPDATE cmx_manifiesto SET estado_seguimiento='$estado' WHERE id=" . $manifiesto . "";
                                                                    $update_est = $conexion->prepare($sql_es);
                                                                    $update_est->execute();
                                                                    /* COLOCAR EN GESTION PARA CUANDO SEA LUGAR DE LLEGADA PARA HACER MAS GESTION */
                                                                    $sql_es = "UPDATE cmx_inicio_seguimiento SET estado_punto='$estado_punto' WHERE cod_ini_ruta=" . $id_ini_ruta . " AND codigo_punto='$codigo_punto'";
                                                                    $update_est = $conexion->prepare($sql_es);
                                                                    $update_est->execute();
                                                                } else {
                                                                    $sql_es = "UPDATE cmx_manifiesto SET estado_seguimiento='SEGUIMIENTO' WHERE id=" . $manifiesto . "";
                                                                    $update_est = $conexion->prepare($sql_es);
                                                                    $update_est->execute();
                                                                }
                                                            }
                                                        } else {
                                                            $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                                                        }
                                                    }
                                                    // Confirmar la transacción
                                                    $conexion->commit();
                                                    $response = ["success" => true, "message" => "<b>Nota:</b>  Registrada exitosamente en NexosApp."];
                                                } catch (\Throwable $e) {
                                                    // Ocurrió un error, deshacer la transacción
                                                    $conexion->rollback();
                                                    $errorMessage = "Error en la transacción al insertar nota controlador: " . $e->getMessage() . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
                                                    $logFilePath = 'error_log.txt'; // Ajusta la ruta según la estructura de tu proyecto
                                                    error_log($errorMessage, 3, $logFilePath);

                                                    // Verificar si el archivo de log se ha escrito correctamente
                                                    if (!file_exists($logFilePath)) {
                                                        error_log("No se pudo crear el archivo de log: $logFilePath\n", 3, $logFilePath);
                                                    }
                                                    // Mostrar un mensaje amigable al usuario
                                                    $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                                                }
                                            } else {
                                                try {
                                                    // Iniciar una transacción
                                                    $conexion->beginTransaction();
                                                    $sql4 = "UPDATE cmx_inici_manifiesto_estado SET ultimo_estado='0' WHERE cod_ini_ruta=$id_ini_ruta";
                                                    $updatemani = $conexion->prepare($sql4);
                                                    $result = $updatemani->execute();
                                                    if ($result) {
                                                        $sql3 = "INSERT INTO cmx_inici_manifiesto_estado (id,cod_ini_ruta,estado,actual,fecha,hora,usuario,ultimo_estado,reporte_cliente)
                                                         VALUES(null,'$id_ini_ruta','$estadoq','$procesoq','$fecha','$hora','$user','1','$reportecliente')";
                                                        $crearmani = $conexion->prepare($sql3);
                                                        $result_estado = $crearmani->execute();

                                                        if ($result_estado) {
                                                            // Insertar el registro de seguimiento
                                                            $sql = "INSERT INTO cmx_inicio_seguimiento (id,cod_man_estado,tipo_contacto,tipo_seguimiento,detalle_tipo,tipo_proceso,observacion,fecha,hora,usuario,reporte_cliente,cod_ini_ruta,novedad,ocurrio,codigo_punto,tiempo,estado_punto)
                                                            VALUES(null,'$idm','$contacto','$tsegui','$tdetalle','$tproceso','$observa','$fecha','$hora','$user','$reportecliente','$id_ini_ruta','$new','$ocurrio','$codigo_punto','$tiempo','$estado_punto')";
                                                            $crearinicio = $conexion->prepare($sql);
                                                            $result = $crearinicio->execute();

                                                            if ($result) {
                                                                $sqlf = "SELECT max(id) as ids  FROM cmx_inicio_seguimiento WHERE cod_ini_ruta=$id_ini_ruta";
                                                                $consulta_solic = $conexion->prepare($sqlf);
                                                                $consulta_solic->execute();
                                                                $dato = $consulta_solic->fetch();
                                                                $id_seguimiento = $dato["ids"];
                                                                //insertar solicitudes de servicio
                                                                // Nuevo
                                                                $nservicio = $data["solicitud_servicio_nuevo"];
                                                                for ($i = 0; $i < count($nservicio); $i++) {
                                                                    $nsolicitud = $nservicio[$i];
                                                                    $sqls = "INSERT INTO cmx_seguimiento_servicio (id,id_servicio,id_seguimiento,usuario,hora,fecha)
                                                                    VALUES(null,'$nsolicitud','$id_seguimiento','$user','$hora','$fecha');";
                                                                    $crearsoli = $conexion->prepare($sqls);
                                                                    $result2 = $crearsoli->execute();
                                                                }
                                                                //Insertar en la tabla de punto de control para los sitios no establecidos en el plan de ruta inicial
                                                                $sqlpuntocontrol = "INSERT INTO cmx_puntos_controlador(seguimiento_id,punto_controlador,usuario,fecha_at)
                                                                VALUES('$id_seguimiento','$nota_punto_controlador','$user','$fecha.$hora')";
                                                                $crearPuntocontrol = $conexion->prepare($sqlpuntocontrol);
                                                                $crearPuntocontrol->execute();

                                                                /* Cambiar el estado del manifieto cuando le den en llegada */
                                                                if ($accion_punto == 'Lugar Llegada') {
                                                                    $estado = "LLEGADA";
                                                                    $estado_punto = "GESTION";
                                                                    $sql_es = "UPDATE cmx_manifiesto SET estado_seguimiento='$estado' WHERE id=" . $manifiesto . "";
                                                                    $update_est = $conexion->prepare($sql_es);
                                                                    $update_est->execute();
                                                                    /* COLOCAR EN GESTION PARA CUANDO SEA LUGAR DE LLEGADA PARA HACER MAS GESTION */
                                                                    $sql_es = "UPDATE cmx_inicio_seguimiento SET estado_punto='$estado_punto' WHERE cod_ini_ruta=" . $id_ini_ruta . " AND codigo_punto='$codigo_punto'";
                                                                    $update_est = $conexion->prepare($sql_es);
                                                                    $update_est->execute();
                                                                } else {
                                                                    $sql_es = "UPDATE cmx_manifiesto SET estado_seguimiento='SEGUIMIENTO' WHERE id=" . $manifiesto . "";
                                                                    $update_est = $conexion->prepare($sql_es);
                                                                    $update_est->execute();
                                                                }
                                                            }

                                                            if ($tipo == 'punto geografico') {
                                                                $sqlf = "SELECT max(id) as ids FROM cmx_inicio_seguimiento WHERE cod_ini_ruta=$id_ini_ruta";
                                                                $consulta_solic = $conexion->prepare($sqlf);
                                                                $consulta_solic->execute();
                                                                $dato = $consulta_solic->fetch();
                                                                $id_seguimiento = $dato["ids"];
                                                                $ubilatitud = $data["latitud"];
                                                                $ubilongitud = $data["longitud"];
                                                                $edoc = empty($data["edocu"]) ? 0 : $data["edocu"];
                                                                //$udocumnento=$_POST["udocumnento"];
                                                                $sql = "INSERT INTO cmx_iniruta_ubicacion (id,cod_ini_ruta,latitud,longitud,usuario,fecha,hora,lugar,id_seguimiento,existe_evidencia)
                                                            VALUES(null,$id_ini_ruta,$ubilatitud,$ubilongitud,'$user','$fecha','$hora',$tdetalle,$id_seguimiento,$edoc)";
                                                                $crearubi = $conexion->prepare($sql);
                                                                $result2 = $crearubi->execute();
                                                                if ($result2) {
                                                                    //Archivo
                                                                    $aleatorio1 = rand(10000, 90000);
                                                                    $ruta_evidencia = "../public/files/evidencia_seguimiento/" . $id_ini_ruta . "/" . $id_seguimiento . "/";
                                                                    $ruta_evidencia2 = "public/files/evidencia_seguimiento/" . $id_ini_ruta . "/" . $id_seguimiento . "/";
                                                                    if (!file_exists($ruta_evidencia)) {
                                                                        mkdir($ruta_evidencia, 0777, true);
                                                                    }
                                                                    $sqlt = "SELECT max(id) as idu  FROM cmx_iniruta_ubicacion WHERE id_seguimiento=id_seguimiento";
                                                                    $consulta_solic = $conexion->prepare($sqlt);
                                                                    $consulta_solic->execute();
                                                                    $dato = $consulta_solic->fetch();
                                                                    $id_ubica = $dato["idu"];
                                                                    $sqlub = "UPDATE cmx_iniruta_ubicacion
                                                        SET evidencia='$ruta_evidencia2',
                                                        existe_evidencia=" . $edoc . "
                                                        WHERE id = " . $id_ubica . "";
                                                                    $consulta = $conexion->prepare($sqlub);
                                                                    $consulta->execute();
                                                                    for ($i = 0; $i < count($_FILES); $i++) {
                                                                        if (isset($_FILES["udocumnento" . $i])) {
                                                                            $file = $_FILES["udocumnento" . $i];
                                                                            $nombre = $file["name"];
                                                                            $tipo = $file["type"];
                                                                            $ruta_provisional = $file["tmp_name"];
                                                                            $carpeta = $ruta_evidencia;
                                                                            $src = $carpeta . $nombre;
                                                                            move_uploaded_file($ruta_provisional, $src);
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        } else {
                                                            $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                                                        }
                                                    }
                                                    // Confirmar la transacción
                                                    $conexion->commit();
                                                    $response = ["success" => true, "message" => "<b>Nota:</b>  Registrada exitosamente en NexosApp."];
                                                } catch (\Throwable $e) {
                                                    // Ocurrió un error, deshacer la transacción
                                                    $conexion->rollback();
                                                    $errorMessage = "Error en la transacción al insertar nota controlador: " . $e->getMessage() . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
                                                    $logFilePath = 'error_log.txt'; // Ajusta la ruta según la estructura de tu proyecto
                                                    error_log($errorMessage, 3, $logFilePath);

                                                    // Verificar si el archivo de log se ha escrito correctamente
                                                    if (!file_exists($logFilePath)) {
                                                        error_log("No se pudo crear el archivo de log: $logFilePath\n", 3, $logFilePath);
                                                    }
                                                    // Mostrar un mensaje amigable al usuario
                                                    $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                                                }
                                            }
                                        } else {
                                            // echo "No se recibieron datos válidos.";
                                            $mensajeError = "Error No se recibieron datos válidos El dia " . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
                                            error_log($mensajeError . "\n", 3, "error_log.txt");
                                            $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                                            throw new Exception("Error al guardar los datos");
                                        }
                                    } else {
                                        // echo "No se recibio el tiempo de la nota.";
                                        $mensajeError = "Error No se recibio el tiempo de la nota. El dia " . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
                                        error_log($mensajeError . "\n", 3, "error_log.txt");
                                        $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                                        throw new Exception("Error al guardar Tiempos");
                                    }
                                } else {
                                    if ($data) {
                                        $id_ini_ruta = $data["id_ini_ruta"];
                                        $idm = $data["idmanifiesto"];
                                        $contacto = $data["contacto"];
                                        $tsegui = $data["tipo_seguimiento"];
                                        $tdetalle = empty($data["tipo_detalle"]) ? 0 : $data["tipo_detalle"];
                                        $tproceso = $data["tipo_proceso"];
                                        $observa = $data["observacion"];
                                        $reportecliente = $data["reporte_cliente"];
                                        $deta = $data["accion_completado"];
                                        $nota_punto_controlador = $data["nota_punto_controlador"];
                                        $tipo = $data["tipo_seguimiento"];
                                        if (isset($data["novedad_general"])) {
                                            $new = $data["novedad_general"];
                                        } else {
                                            $new = '';
                                        }
                                        $ocurrio = $data["ocurrio"];
                                        $codigo_punto = empty($data["codigo_punto"]) ? 0 : $data["codigo_punto"];
                                        $accion_punto = $data["accion_punto"];
                                        $manifiesto = $data["manifiesto"];
                                        //estado
                                        $id_ini_ruta = $data["id_ini_ruta"];
                                        $estadoq = $data["estado_siguiente"];
                                        $procesoq = $data["accion_completado"];
                                        $estado_punto = 'GESTION';

                                        /* Validar si el punto del controlador esta en el sistema */
                                        if ($nota_punto_controlador) {
                                            try {
                                                // Iniciar una transacción
                                                $conexion->beginTransaction();
                                                $sql4 = "UPDATE cmx_inici_manifiesto_estado SET ultimo_estado='0' WHERE cod_ini_ruta=$id_ini_ruta";
                                                $updatemani = $conexion->prepare($sql4);
                                                $result = $updatemani->execute();
                                                if ($result) {
                                                    $sql3 = "INSERT INTO cmx_inici_manifiesto_estado (id,cod_ini_ruta,estado,actual,fecha,hora,usuario,ultimo_estado,reporte_cliente)
                                                     VALUES(null,'$id_ini_ruta','$estadoq','$procesoq','$fecha','$hora','$user','1','$reportecliente')";
                                                    $crearmani = $conexion->prepare($sql3);
                                                    $result_estado = $crearmani->execute();
                                                    if ($result_estado) {
                                                        // Insertar el registro de seguimiento
                                                        $sql = "INSERT INTO cmx_inicio_seguimiento (id,cod_man_estado,tipo_contacto,tipo_seguimiento,detalle_tipo,tipo_proceso,observacion,fecha,hora,usuario,reporte_cliente,cod_ini_ruta,novedad,ocurrio,codigo_punto,tiempo,estado_punto)
                                                        VALUES(null,'$idm','$contacto','$tsegui','$tdetalle','$tproceso','$observa','$fecha','$hora','$user','$reportecliente','$id_ini_ruta','$new','$ocurrio','$codigo_punto',-59,'$estado_punto')";
                                                        $crearinicio = $conexion->prepare($sql);
                                                        $result = $crearinicio->execute();

                                                        if ($result) {
                                                            $sqlf = "SELECT max(id) as ids  FROM cmx_inicio_seguimiento WHERE cod_ini_ruta=$id_ini_ruta";
                                                            $consulta_solic = $conexion->prepare($sqlf);
                                                            $consulta_solic->execute();
                                                            $dato = $consulta_solic->fetch();
                                                            $id_seguimiento = $dato["ids"];
                                                            //insertar solicitudes de servicio
                                                            // Nuevo
                                                            $nservicio = $data["solicitud_servicio_nuevo"];
                                                            for ($i = 0; $i < count($nservicio); $i++) {
                                                                $nsolicitud = $nservicio[$i];
                                                                $sqls = "INSERT INTO cmx_seguimiento_servicio (id,id_servicio,id_seguimiento,usuario,hora,fecha)
                                                                VALUES(null,'$nsolicitud','$id_seguimiento','$user','$hora','$fecha');";
                                                                $crearsoli = $conexion->prepare($sqls);
                                                                $result2 = $crearsoli->execute();
                                                            }
                                                            //Insertar en la tabla de punto de control para los sitios no establecidos en el plan de ruta inicial
                                                            $sqlpuntocontrol = "INSERT INTO cmx_puntos_controlador(seguimiento_id,punto_controlador,usuario,fecha_at)
                                            VALUES('$id_seguimiento','$nota_punto_controlador','$user','$fecha.$hora')";
                                                            $crearPuntocontrol = $conexion->prepare($sqlpuntocontrol);
                                                            $crearPuntocontrol->execute();
                                                            /* Cambiar el estado del manifieto cuando le den en llegada */
                                                            if ($accion_punto == 'Lugar Llegada') {
                                                                $estado = "LLEGADA";
                                                                $sql_es = "UPDATE cmx_manifiesto SET estado_seguimiento='$estado' WHERE id=" . $manifiesto . "";
                                                                $update_est = $conexion->prepare($sql_es);
                                                                $update_est->execute();
                                                            } else {
                                                                $sql_es = "UPDATE cmx_manifiesto SET estado_seguimiento='SEGUIMIENTO' WHERE id=" . $manifiesto . "";
                                                                $update_est = $conexion->prepare($sql_es);
                                                                $update_est->execute();
                                                            }
                                                        }
                                                    } else {
                                                        $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                                                    }
                                                }
                                                // Confirmar la transacción
                                                $conexion->commit();
                                                $response = ["success" => true, "message" => "<b>Nota:</b> Registrada exitosamente en NexosApp."];
                                            } catch (\Throwable $e) {
                                                // Ocurrió un error, deshacer la transacción
                                                $conexion->rollback();
                                                $errorMessage = "Error en la transacción al insertar nota controlador: " . $e->getMessage() . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
                                                $logFilePath = 'error_log.txt'; // Ajusta la ruta según la estructura de tu proyecto
                                                error_log($errorMessage, 3, $logFilePath);

                                                // Verificar si el archivo de log se ha escrito correctamente
                                                if (!file_exists($logFilePath)) {
                                                    error_log("No se pudo crear el archivo de log: $logFilePath\n", 3, $logFilePath);
                                                }
                                                // Mostrar un mensaje amigable al usuario
                                                $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                                            }
                                        } else {
                                            try {
                                                // Iniciar una transacción
                                                $conexion->beginTransaction();
                                                $sql4 = "UPDATE cmx_inici_manifiesto_estado SET ultimo_estado='0' WHERE cod_ini_ruta=$id_ini_ruta";
                                                $updatemani = $conexion->prepare($sql4);
                                                $result = $updatemani->execute();
                                                if ($result) {
                                                    $sql3 = "INSERT INTO cmx_inici_manifiesto_estado (id,cod_ini_ruta,estado,actual,fecha,hora,usuario,ultimo_estado,reporte_cliente)
                                                     VALUES(null,'$id_ini_ruta','$estadoq','$procesoq','$fecha','$hora','$user','1','$reportecliente')";
                                                    $crearmani = $conexion->prepare($sql3);
                                                    $result_estado = $crearmani->execute();
                                                    if ($result_estado) {
                                                        // Insertar el registro de seguimiento
                                                        $sql = "INSERT INTO cmx_inicio_seguimiento (id,cod_man_estado,tipo_contacto,tipo_seguimiento,detalle_tipo,tipo_proceso,observacion,fecha,hora,usuario,reporte_cliente,cod_ini_ruta,novedad,ocurrio,codigo_punto,tiempo,estado_punto)
                                                        VALUES(null,'$idm','$contacto','$tsegui','$tdetalle','$tproceso','$observa','$fecha','$hora','$user','$reportecliente','$id_ini_ruta','$new','$ocurrio','$codigo_punto',-59,'$estado_punto')";
                                                        $crearinicio = $conexion->prepare($sql);
                                                        $result = $crearinicio->execute();

                                                        if ($result) {
                                                            $sqlf = "SELECT max(id) as ids  FROM cmx_inicio_seguimiento WHERE cod_ini_ruta=$id_ini_ruta";
                                                            $consulta_solic = $conexion->prepare($sqlf);
                                                            $consulta_solic->execute();
                                                            $dato = $consulta_solic->fetch();
                                                            $id_seguimiento = $dato["ids"];
                                                            //insertar solicitudes de servicio
                                                            // Nuevo
                                                            $nservicio = $data["solicitud_servicio_nuevo"];
                                                            for ($i = 0; $i < count($nservicio); $i++) {
                                                                $nsolicitud = $nservicio[$i];
                                                                $sqls = "INSERT INTO cmx_seguimiento_servicio (id,id_servicio,id_seguimiento,usuario,hora,fecha)
                                                                VALUES(null,'$nsolicitud','$id_seguimiento','$user','$hora','$fecha');";
                                                                $crearsoli = $conexion->prepare($sqls);
                                                                $result2 = $crearsoli->execute();
                                                            }
                                                            //Insertar en la tabla de punto de control para los sitios no establecidos en el plan de ruta inicial
                                                            $sqlpuntocontrol = "INSERT INTO cmx_puntos_controlador(seguimiento_id,punto_controlador,usuario,fecha_at)
                                            VALUES('$id_seguimiento','$nota_punto_controlador','$user','$fecha.$hora')";
                                                            $crearPuntocontrol = $conexion->prepare($sqlpuntocontrol);
                                                            $crearPuntocontrol->execute();
                                                            /* Cambiar el estado del manifieto cuando le den en llegada */
                                                            if ($accion_punto == 'Lugar Llegada') {
                                                                $estado = "LLEGADA";
                                                                $sql_es = "UPDATE cmx_manifiesto SET estado_seguimiento='$estado' WHERE id=" . $manifiesto . "";
                                                                $update_est = $conexion->prepare($sql_es);
                                                                $update_est->execute();
                                                            } else {
                                                                $sql_es = "UPDATE cmx_manifiesto SET estado_seguimiento='SEGUIMIENTO' WHERE id=" . $manifiesto . "";
                                                                $update_est = $conexion->prepare($sql_es);
                                                                $update_est->execute();
                                                            }
                                                        }

                                                        if ($tipo == 'punto geografico') {
                                                            $sqlf = "SELECT max(id) as ids FROM cmx_inicio_seguimiento WHERE cod_ini_ruta=$id_ini_ruta";
                                                            $consulta_solic = $conexion->prepare($sqlf);
                                                            $consulta_solic->execute();
                                                            $dato = $consulta_solic->fetch();
                                                            $id_seguimiento = $dato["ids"];
                                                            $ubilatitud = $data["latitud"];
                                                            $ubilongitud = $data["longitud"];
                                                            $edoc = $data["edocu"];

                                                            $sql = "INSERT INTO cmx_iniruta_ubicacion (id, cod_ini_ruta, latitud, longitud, usuario, fecha, hora, lugar, id_seguimiento, existe_evidencia)
                                                    VALUES (null, $id_ini_ruta, $ubilatitud, $ubilongitud, '$user', '$fecha', '$hora', $tdetalle, $id_seguimiento, $edoc)";
                                                            $crearubi = $conexion->prepare($sql);
                                                            $result2 = $crearubi->execute();
                                                            if ($result2) {
                                                                //Archivo
                                                                $aleatorio1 = rand(10000, 90000);
                                                                $ruta_evidencia = "../public/files/evidencia_seguimiento/" . $id_ini_ruta . "/" . $id_seguimiento . "/";
                                                                $ruta_evidencia2 = "public/files/evidencia_seguimiento/" . $id_ini_ruta . "/" . $id_seguimiento . "/";
                                                                if (!file_exists($ruta_evidencia)) {
                                                                    mkdir($ruta_evidencia, 0777, true);
                                                                }
                                                                $sqlt = "SELECT max(id) as idu  FROM cmx_iniruta_ubicacion WHERE id_seguimiento=id_seguimiento";
                                                                $consulta_solic = $conexion->prepare($sqlt);
                                                                $consulta_solic->execute();
                                                                $dato = $consulta_solic->fetch();
                                                                $id_ubica = $dato["idu"];
                                                                $sqlub = "UPDATE cmx_iniruta_ubicacion
                                                    SET evidencia='$ruta_evidencia2',
                                                    existe_evidencia=" . $edoc . "
                                                    WHERE id = " . $id_ubica . "";
                                                                $consulta = $conexion->prepare($sqlub);
                                                                $consulta->execute();
                                                                for ($i = 0; $i < count($_FILES); $i++) {
                                                                    if (isset($_FILES["udocumnento" . $i])) {
                                                                        $file = $_FILES["udocumnento" . $i];
                                                                        $nombre = $file["name"];
                                                                        $tipo = $file["type"];
                                                                        $ruta_provisional = $file["tmp_name"];
                                                                        $carpeta = $ruta_evidencia;
                                                                        $src = $carpeta . $nombre;
                                                                        move_uploaded_file($ruta_provisional, $src);
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    } else {
                                                        $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                                                    }
                                                }
                                                // Confirmar la transacción
                                                $conexion->commit();
                                                $response = ["success" => true, "message" => "<b>Nota:</b> Registrada exitosamente en NexosApp."];
                                            } catch (\Throwable $e) {
                                                // Ocurrió un error, deshacer la transacción
                                                $conexion->rollback();
                                                $errorMessage = "Error en la transacción al insertar nota controlador: " . $e->getMessage() . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
                                                $logFilePath = 'error_log.txt'; // Ajusta la ruta según la estructura de tu proyecto
                                                error_log($errorMessage, 3, $logFilePath);

                                                // Verificar si el archivo de log se ha escrito correctamente
                                                if (!file_exists($logFilePath)) {
                                                    error_log("No se pudo crear el archivo de log: $logFilePath\n", 3, $logFilePath);
                                                }
                                                // Mostrar un mensaje amigable al usuario
                                                $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                                            }
                                        }
                                    } else {
                                        // echo "No se recibieron datos válidos.";
                                        $mensajeError = "Error No se recibieron datos válidos El dia " . date("Y-m.d");
                                        error_log($mensajeError . "\n", 3, "error_log.txt");
                                        $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                                        throw new Exception("Error al guardar los datos");
                                    }
                                }
                                /* Codigo comentario */
                            }
                        } else {
                            $response = ["success" => false, "message" => "No existen <b>tiempos logísticos de descargue</b> para este manifiesto, por favor diligenciarlos antes de finalizar el seguimiento."];
                        }
                    } else {
                        $response = ["success" => false, "message" => "No existen <b>tiempos logísticos de descargue</b> para este manifiesto, por favor diligenciarlos antes de finalizar el seguimiento."];
                    }
                } else {
                    $response = ["success" => false, "message" => "Los <b>tiempos logísticos</b> no estan completo, por favor revisarlo antes de finalizar el seguimiento."];
                }
            } else {
                $response = ["success" => false, "message" => "No existen <b>tiempos logísticos de cargue</b> para este manifiesto, por favor diligenciarlos antes de finalizar el seguimiento."];
            }
        } else {
            // Validar el valor de Ocurrio para las insertsiones a las base de datos
            if ($data["ocurrio"] == "En sitio") {
                /* Validar si la novedad es comentario o alguna novedad */
                if ($data["novedad_general"] == "COMENTARIO" || substr($data["novedad_general"], 0, 7) == "NOVEDAD") {
                    $codigo = $data["id_ini_ruta"];
                    /* Consultar el tiempo del ultimo punto de este manifiesto para mantenerlo */
                    $sql_ultimo_tiempo = $conexion->prepare("SELECT tiempo FROM cmx_inicio_seguimiento WHERE cod_ini_ruta=$codigo ORDER BY id DESC LIMIT 1");
                    $sql_ultimo_tiempo->execute();
                    $result_tiempo = $sql_ultimo_tiempo->fetch();
                    $tiempo = $result_tiempo['tiempo'];
                    if ($tiempo) {
                        if ($data) {
                            $id_ini_ruta = $data["id_ini_ruta"];
                            $idm = $data["idmanifiesto"];
                            $contacto = $data["contacto"];
                            $tsegui = $data["tipo_seguimiento"];
                            $tdetalle = empty($data["tipo_detalle"]) ? 0 : $data["tipo_detalle"];
                            $tproceso = $data["tipo_proceso"];
                            $observa = $data["observacion"];
                            $reportecliente = $data["reporte_cliente"];
                            // $estadoactual = $data["estado_actual"];
                            $deta = $data["accion_completado"];
                            $nota_punto_controlador = $data["nota_punto_controlador"];
                            $tipo = $data["tipo_seguimiento"];
                            if (isset($data["novedad_general"])) {
                                $new = $data["novedad_general"];
                            } else {
                                $new = '';
                            }
                            $ocurrio = $data["ocurrio"];
                            $codigo_punto = empty($data["codigo_punto"]) ? 0 : $data["codigo_punto"];
                            $accion_punto = $data["accion_punto"];
                            $manifiesto = $data["manifiesto"];
                            $estado_punto = 'CERRADO';
                            //estado
                            $id_ini_ruta = $data["id_ini_ruta"];
                            $estadoq = $data["estado_siguiente"];
                            $procesoq = $data["accion_completado"];

                            try {
                                // Iniciar una transacción
                                $conexion->beginTransaction();
                                $sql4 = "UPDATE cmx_inici_manifiesto_estado SET ultimo_estado='0' WHERE cod_ini_ruta=$id_ini_ruta";
                                $updatemani = $conexion->prepare($sql4);
                                $result = $updatemani->execute();
                                if ($result) {
                                    $sql3 = "INSERT INTO cmx_inici_manifiesto_estado (id,cod_ini_ruta,estado,actual,fecha,hora,usuario,ultimo_estado,reporte_cliente)
                                             VALUES(null,'$id_ini_ruta','$estadoq','$procesoq','$fecha','$hora','$user','1','$reportecliente')";
                                    $crearmani = $conexion->prepare($sql3);
                                    $result_estado = $crearmani->execute();

                                    if ($result_estado) {
                                        // Insertar el registro de seguimiento
                                        $sql = "INSERT INTO cmx_inicio_seguimiento (id,cod_man_estado,tipo_contacto,tipo_seguimiento,detalle_tipo,tipo_proceso,observacion,fecha,hora,usuario,reporte_cliente,cod_ini_ruta,novedad,ocurrio,codigo_punto,tiempo,estado_punto)
                                                VALUES(null,'$idm','$contacto','$tsegui','$tdetalle','$tproceso','$observa','$fecha','$hora','$user','$reportecliente','$id_ini_ruta','$new','$ocurrio','$codigo_punto','$tiempo','$estado_punto')";
                                        $crearinicio = $conexion->prepare($sql);
                                        $result = $crearinicio->execute();

                                        if ($result) {
                                            $sqlf = "SELECT max(id) as ids  FROM cmx_inicio_seguimiento WHERE cod_ini_ruta=$id_ini_ruta";
                                            $consulta_solic = $conexion->prepare($sqlf);
                                            $consulta_solic->execute();
                                            $dato = $consulta_solic->fetch();
                                            $id_seguimiento = $dato["ids"];
                                            //insertar solicitudes de servicio
                                            // Nuevo
                                            $nservicio = $data["solicitud_servicio_nuevo"];
                                            for ($i = 0; $i < count($nservicio); $i++) {
                                                $nsolicitud = $nservicio[$i];
                                                $sqls = "INSERT INTO cmx_seguimiento_servicio (id,id_servicio,id_seguimiento,usuario,hora,fecha)
                                                                VALUES(null,'$nsolicitud','$id_seguimiento','$user','$hora','$fecha');";
                                                $crearsoli = $conexion->prepare($sqls);
                                                $result2 = $crearsoli->execute();
                                            }

                                            /* Cambiar el estado del manifieto cuando le den en llegada */
                                            if ($accion_punto == 'Lugar Llegada') {
                                                $estado = "LLEGADA";
                                                $estado_punto = "GESTION";
                                                $sql_es = "UPDATE cmx_manifiesto SET estado_seguimiento='$estado' WHERE id=" . $manifiesto . "";
                                                $update_est = $conexion->prepare($sql_es);
                                                $update_est->execute();
                                                /* COLOCAR EN GESTION PARA CUANDO SEA LUGAR DE LLEGADA PARA HACER MAS GESTION */
                                                $sql_es = "UPDATE cmx_inicio_seguimiento SET estado_punto='$estado_punto' WHERE cod_ini_ruta=" . $id_ini_ruta . " AND codigo_punto='$codigo_punto'";
                                                $update_est = $conexion->prepare($sql_es);
                                                $update_est->execute();
                                            } else {
                                                $sql_es = "UPDATE cmx_manifiesto SET estado_seguimiento='SEGUIMIENTO' WHERE id=" . $manifiesto . "";
                                                $update_est = $conexion->prepare($sql_es);
                                                $update_est->execute();
                                            }
                                        }

                                        if ($tipo == 'punto geografico') {
                                            $sqlf = "SELECT max(id) as ids FROM cmx_inicio_seguimiento WHERE cod_ini_ruta=$id_ini_ruta";
                                            $consulta_solic = $conexion->prepare($sqlf);
                                            $consulta_solic->execute();
                                            $dato = $consulta_solic->fetch();
                                            $id_seguimiento = $dato["ids"];
                                            $ubilatitud = $data["latitud"];
                                            $ubilongitud = $data["longitud"];
                                            $edoc = empty($data["edocu"]) ? 0 : $data["edocu"];
                                            $sql = "INSERT INTO cmx_iniruta_ubicacion (id,cod_ini_ruta,latitud,longitud,usuario,fecha,hora,lugar,id_seguimiento,existe_evidencia)
                                                    VALUES(null,$id_ini_ruta,$ubilatitud,$ubilongitud,'$user','$fecha','$hora',$tdetalle,$id_seguimiento,$edoc)";
                                            $crearubi = $conexion->prepare($sql);
                                            $result2 = $crearubi->execute();
                                            if ($result2) {
                                                //Archivo
                                                $aleatorio1 = rand(10000, 90000);
                                                $ruta_evidencia = "../public/files/evidencia_seguimiento/" . $id_ini_ruta . "/" . $id_seguimiento . "/";
                                                $ruta_evidencia2 = "public/files/evidencia_seguimiento/" . $id_ini_ruta . "/" . $id_seguimiento . "/";
                                                if (!file_exists($ruta_evidencia)) {
                                                    mkdir($ruta_evidencia, 0777, true);
                                                }
                                                $sqlt = "SELECT max(id) as idu  FROM cmx_iniruta_ubicacion WHERE id_seguimiento=id_seguimiento";
                                                $consulta_solic = $conexion->prepare($sqlt);
                                                $consulta_solic->execute();
                                                $dato = $consulta_solic->fetch();
                                                $id_ubica = $dato["idu"];
                                                $sqlub = "UPDATE cmx_iniruta_ubicacion
                                                    SET evidencia='$ruta_evidencia2',
                                                    existe_evidencia=" . $edoc . "
                                                    WHERE id = " . $id_ubica . "";
                                                $consulta = $conexion->prepare($sqlub);
                                                $consulta->execute();
                                                for ($i = 0; $i < count($_FILES); $i++) {
                                                    if (isset($_FILES["udocumnento" . $i])) {
                                                        $file = $_FILES["udocumnento" . $i];
                                                        $nombre = $file["name"];
                                                        $tipo = $file["type"];
                                                        $ruta_provisional = $file["tmp_name"];
                                                        $carpeta = $ruta_evidencia;
                                                        $src = $carpeta . $nombre;
                                                        move_uploaded_file($ruta_provisional, $src);
                                                    }
                                                }
                                            }
                                        }
                                    } else {
                                        $response = ["success" => false, "message" => "<b>Error:</b>  Nota no registrada en el sistema, por favor intentarlo nuevamente o comomunicarse con sistemas."];
                                    }
                                }
                                // Confirmar la transacción
                                $conexion->commit();
                                $response = ["success" => true, "message" => "<b>Nota:</b>  Registrada exitosamente en NexosApp."];
                            } catch (\Throwable $e) {
                                // Ocurrió un error, deshacer la transacción
                                $conexion->rollback();
                                // Registrar el error en un archivo de log en la raíz del proyecto
                                $errorMessage = "Error en la transacción al insertar nota controlador: " . $e->getMessage() . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
                                $logFilePath = 'error_log.txt'; // Ajusta la ruta según la estructura de tu proyecto
                                error_log($errorMessage, 3, $logFilePath);

                                // Verificar si el archivo de log se ha escrito correctamente
                                if (!file_exists($logFilePath)) {
                                    error_log("No se pudo crear el archivo de log: $logFilePath\n", 3, $logFilePath);
                                }
                                // Mostrar un mensaje amigable al usuario
                                $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                            }
                        } else {
                            $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                        }
                    } else {
                        $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                    }
                } else {
                    if ($data) {
                        $id_ini_ruta = $data["id_ini_ruta"];
                        $idm = $data["idmanifiesto"];
                        $contacto = $data["contacto"];
                        $tsegui = $data["tipo_seguimiento"];
                        $tdetalle = $data["tipo_detalle"];
                        $tproceso = $data["tipo_proceso"];
                        $observa = $data["observacion"];
                        $reportecliente = $data["reporte_cliente"];
                        $deta = $data["accion_completado"];
                        $nota_punto_controlador = $data["nota_punto_controlador"];
                        $tipo = $data["tipo_seguimiento"];
                        if (isset($data["novedad_general"])) {
                            $new = $data["novedad_general"];
                        } else {
                            $new = '';
                        }
                        $ocurrio = $data["ocurrio"];
                        $codigo_punto = $data["codigo_punto"];
                        $accion_punto = $data["accion_punto"];
                        $manifiesto = $data["manifiesto"];
                        $estado_punto = 'CERRADO';
                        //estado
                        $id_ini_ruta = $data["id_ini_ruta"];
                        $estadoq = $data["estado_siguiente"];
                        $procesoq = $data["accion_completado"];

                        try {
                            // Iniciar una transacción
                            $conexion->beginTransaction();
                            $sql4 = "UPDATE cmx_inici_manifiesto_estado SET ultimo_estado='0' WHERE cod_ini_ruta=$id_ini_ruta";
                            $updatemani = $conexion->prepare($sql4);
                            $result = $updatemani->execute();
                            if ($result) {
                                $sql3 = "INSERT INTO cmx_inici_manifiesto_estado (id,cod_ini_ruta,estado,actual,fecha,hora,usuario,ultimo_estado,reporte_cliente)
                                                 VALUES(null,'$id_ini_ruta','$estadoq','$procesoq','$fecha','$hora','$user','1','$reportecliente')";
                                $crearmani = $conexion->prepare($sql3);
                                $result_estado = $crearmani->execute();

                                if ($result_estado) {
                                    // Insertar el registro de seguimiento
                                    $sql = "INSERT INTO cmx_inicio_seguimiento (id,cod_man_estado,tipo_contacto,tipo_seguimiento,detalle_tipo,tipo_proceso,observacion,fecha,hora,usuario,reporte_cliente,cod_ini_ruta,novedad,ocurrio,codigo_punto,tiempo,estado_punto)
                                                    VALUES(null,'$idm','$contacto','$tsegui','$tdetalle','$tproceso','$observa','$fecha','$hora','$user','$reportecliente','$id_ini_ruta','$new','$ocurrio','$codigo_punto',-59,'$estado_punto')";
                                    $crearinicio = $conexion->prepare($sql);
                                    $result = $crearinicio->execute();

                                    if ($result) {
                                        $sqlf = "SELECT max(id) as ids  FROM cmx_inicio_seguimiento WHERE cod_ini_ruta=$id_ini_ruta";
                                        $consulta_solic = $conexion->prepare($sqlf);
                                        $consulta_solic->execute();
                                        $dato = $consulta_solic->fetch();
                                        $id_seguimiento = $dato["ids"];
                                        //insertar solicitudes de servicio
                                        // Nuevo
                                        $nservicio = $data["solicitud_servicio_nuevo"];
                                        for ($i = 0; $i < count($nservicio); $i++) {
                                            $nsolicitud = $nservicio[$i];
                                            $sqls = "INSERT INTO cmx_seguimiento_servicio (id,id_servicio,id_seguimiento,usuario,hora,fecha)
                                                            VALUES(null,'$nsolicitud','$id_seguimiento','$user','$hora','$fecha');";
                                            $crearsoli = $conexion->prepare($sqls);
                                            $result2 = $crearsoli->execute();
                                        }

                                        /* Cambiar el estado del manifieto cuando le den en llegada */
                                        if ($accion_punto == 'Lugar Llegada') {
                                            $estado = "LLEGADA";
                                            $estado_punto = "GESTION";
                                            $sql_es = "UPDATE cmx_manifiesto SET estado_seguimiento='$estado' WHERE id=" . $manifiesto . "";
                                            $update_est = $conexion->prepare($sql_es);
                                            $update_est->execute();
                                            /* COLOCAR EN GESTION PARA CUANDO SEA LUGAR DE LLEGADA PARA HACER MAS GESTION */
                                            $sql_es = "UPDATE cmx_inicio_seguimiento SET estado_punto='$estado_punto' WHERE cod_ini_ruta=" . $id_ini_ruta . " AND codigo_punto='$codigo_punto'";
                                            $update_est = $conexion->prepare($sql_es);
                                            $update_est->execute();
                                        } else {
                                            $sql_es = "UPDATE cmx_manifiesto SET estado_seguimiento='SEGUIMIENTO' WHERE id=" . $manifiesto . "";
                                            $update_est = $conexion->prepare($sql_es);
                                            $update_est->execute();
                                        }
                                    }

                                    if ($tipo == 'punto geografico') {
                                        $sqlf = "SELECT max(id) as ids FROM cmx_inicio_seguimiento WHERE cod_ini_ruta=$id_ini_ruta";
                                        $consulta_solic = $conexion->prepare($sqlf);
                                        $consulta_solic->execute();
                                        $dato = $consulta_solic->fetch();
                                        $id_seguimiento = $dato["ids"];
                                        $ubilatitud = $data["latitud"];
                                        $ubilongitud = $data["longitud"];
                                        $edoc = empty($data["edocu"]) ? 0 : $data["edocu"];
                                        //$udocumnento=$_POST["udocumnento"];
                                        $sql = "INSERT INTO cmx_iniruta_ubicacion (id,cod_ini_ruta,latitud,longitud,usuario,fecha,hora,lugar,id_seguimiento,existe_evidencia)
                                                    VALUES(null,$id_ini_ruta,$ubilatitud,$ubilongitud,'$user','$fecha','$hora',$tdetalle,$id_seguimiento,$edoc)";
                                        //echo 'INSERTE UBICACION'.$sql;
                                        $crearubi = $conexion->prepare($sql);
                                        $result2 = $crearubi->execute();
                                        if ($result2) {
                                            //Archivo
                                            //if ($i=0;$i<count($_FILES);$i++){
                                            $aleatorio1 = rand(10000, 90000);
                                            $ruta_evidencia = "../public/files/evidencia_seguimiento/" . $id_ini_ruta . "/" . $id_seguimiento . "/";
                                            $ruta_evidencia2 = "public/files/evidencia_seguimiento/" . $id_ini_ruta . "/" . $id_seguimiento . "/";
                                            if (!file_exists($ruta_evidencia)) {
                                                mkdir($ruta_evidencia, 0777, true);
                                            }
                                            $sqlt = "SELECT max(id) as idu  FROM cmx_iniruta_ubicacion WHERE id_seguimiento=id_seguimiento";
                                            $consulta_solic = $conexion->prepare($sqlt);
                                            $consulta_solic->execute();
                                            $dato = $consulta_solic->fetch();
                                            $id_ubica = $dato["idu"];
                                            $sqlub = "UPDATE cmx_iniruta_ubicacion
                                                SET evidencia='$ruta_evidencia2',
                                                existe_evidencia=" . $edoc . "
                                                WHERE id = " . $id_ubica . "";
                                            $consulta = $conexion->prepare($sqlub);
                                            $consulta->execute();
                                            for ($i = 0; $i < count($_FILES); $i++) {
                                                if (isset($_FILES["udocumnento" . $i])) {
                                                    $file = $_FILES["udocumnento" . $i];
                                                    $nombre = $file["name"];
                                                    $tipo = $file["type"];
                                                    $ruta_provisional = $file["tmp_name"];
                                                    $carpeta = $ruta_evidencia;
                                                    $src = $carpeta . $nombre;
                                                    move_uploaded_file($ruta_provisional, $src);
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                                }
                            }
                            // Confirmar la transacción
                            $conexion->commit();
                            $response = ["success" => true, "message" => "<b>Nota:</b>  Registrada exitosamente en NexosApp."];
                        } catch (\Throwable $e) {
                            //throw $th;
                            // Ocurrió un error, deshacer la transacción
                            $conexion->rollback();
                            // Registrar el error en un archivo de log en la raíz del proyecto
                            $errorMessage = "Error en la transacción al insertar nota controlador: " . $e->getMessage() . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
                            $logFilePath = 'error_log.txt'; // Ajusta la ruta según la estructura de tu proyecto
                            error_log($errorMessage, 3, $logFilePath);

                            // Verificar si el archivo de log se ha escrito correctamente
                            if (!file_exists($logFilePath)) {
                                error_log("No se pudo crear el archivo de log: $logFilePath\n", 3, $logFilePath);
                            }

                            // Mostrar un mensaje amigable al usuario
                            $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                        }
                    } else {
                        $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                    }
                }
            } else {
                //Antes
                if ($data["novedad_general"] == "COMENTARIO" || substr($data["novedad_general"], 0, 7) == "NOVEDAD") {
                    $codigo = $data["id_ini_ruta"];
                    /* Consultar el tiempo del ultimo punto de este manifiesto para mantenerlo */
                    $sql_ultimo_tiempo = $conexion->prepare("SELECT tiempo FROM cmx_inicio_seguimiento WHERE cod_ini_ruta=$codigo ORDER BY id DESC LIMIT 1");
                    $sql_ultimo_tiempo->execute();
                    $result_tiempo = $sql_ultimo_tiempo->fetch();
                    $tiempo = $result_tiempo['tiempo'];
                    if ($tiempo) {
                        if ($data) {
                            $id_ini_ruta = $data["id_ini_ruta"];
                            $idm = $data["idmanifiesto"];
                            $contacto = $data["contacto"];
                            $tsegui = $data["tipo_seguimiento"];
                            $tdetalle = empty($data["tipo_detalle"]) ? 0 : $data["tipo_detalle"];
                            $tproceso = $data["tipo_proceso"];
                            $observa = $data["observacion"];
                            $reportecliente = $data["reporte_cliente"];
                            $deta = $data["accion_completado"];
                            $nota_punto_controlador = $data["nota_punto_controlador"];
                            $tipo = $data["tipo_seguimiento"];
                            if (isset($data["novedad_general"])) {
                                $new = $data["novedad_general"];
                            } else {
                                $new = '';
                            }
                            $ocurrio = $data["ocurrio"];
                            $codigo_punto = empty($data["codigo_punto"]) ? 0 : $data["codigo_punto"];
                            $accion_punto = $data["accion_punto"];
                            $manifiesto = $data["manifiesto"];
                            $estado_punto = 'CERRADO';
                            //estado
                            $id_ini_ruta = $data["id_ini_ruta"];
                            $estadoq = $data["estado_siguiente"];
                            $procesoq = $data["accion_completado"];
                            /* Para registrar los puntos que no estan creados en el sistema */
                            if ($nota_punto_controlador) {
                                try {
                                    // Iniciar una transacción
                                    $conexion->beginTransaction();
                                    $sql4 = "UPDATE cmx_inici_manifiesto_estado SET ultimo_estado='0' WHERE cod_ini_ruta=$id_ini_ruta";
                                    $updatemani = $conexion->prepare($sql4);
                                    $result = $updatemani->execute();
                                    if ($result) {
                                        $sql3 = "INSERT INTO cmx_inici_manifiesto_estado (id,cod_ini_ruta,estado,actual,fecha,hora,usuario,ultimo_estado,reporte_cliente)
                                                         VALUES(null,'$id_ini_ruta','$estadoq','$procesoq','$fecha','$hora','$user','1','$reportecliente')";
                                        $crearmani = $conexion->prepare($sql3);
                                        $result_estado = $crearmani->execute();

                                        if ($result_estado) {
                                            // Insertar el registro de seguimiento
                                            $sql = "INSERT INTO cmx_inicio_seguimiento (id,cod_man_estado,tipo_contacto,tipo_seguimiento,detalle_tipo,tipo_proceso,observacion,fecha,hora,usuario,reporte_cliente,cod_ini_ruta,novedad,ocurrio,codigo_punto,tiempo,estado_punto)
                                                            VALUES(null,'$idm','$contacto','$tsegui','$tdetalle','$tproceso','$observa','$fecha','$hora','$user','$reportecliente','$id_ini_ruta','$new','$ocurrio','$codigo_punto','$tiempo','$estado_punto')";
                                            $crearinicio = $conexion->prepare($sql);
                                            $result = $crearinicio->execute();

                                            if ($result) {
                                                $sqlf = "SELECT max(id) as ids  FROM cmx_inicio_seguimiento WHERE cod_ini_ruta=$id_ini_ruta";
                                                $consulta_solic = $conexion->prepare($sqlf);
                                                $consulta_solic->execute();
                                                $dato = $consulta_solic->fetch();
                                                $id_seguimiento = $dato["ids"];
                                                //insertar solicitudes de servicio
                                                // Nuevo
                                                $nservicio = $data["solicitud_servicio_nuevo"];
                                                for ($i = 0; $i < count($nservicio); $i++) {
                                                    $nsolicitud = $nservicio[$i];
                                                    $sqls = "INSERT INTO cmx_seguimiento_servicio (id,id_servicio,id_seguimiento,usuario,hora,fecha)
                                                                    VALUES(null,'$nsolicitud','$id_seguimiento','$user','$hora','$fecha');";
                                                    $crearsoli = $conexion->prepare($sqls);
                                                    $result2 = $crearsoli->execute();
                                                }
                                                //Insertar en la tabla de punto de control para los sitios no establecidos en el plan de ruta inicial
                                                $sqlpuntocontrol = "INSERT INTO cmx_puntos_controlador(seguimiento_id,punto_controlador,usuario,fecha_at)
                                                VALUES('$id_seguimiento','$nota_punto_controlador','$user','$fecha.$hora')";
                                                $crearPuntocontrol = $conexion->prepare($sqlpuntocontrol);
                                                $crearPuntocontrol->execute();

                                                /* Cambiar el estado del manifieto cuando le den en llegada */
                                                if ($accion_punto == 'Lugar Llegada') {
                                                    $estado = "LLEGADA";
                                                    $estado_punto = "GESTION";
                                                    $sql_es = "UPDATE cmx_manifiesto SET estado_seguimiento='$estado' WHERE id=" . $manifiesto . "";
                                                    $update_est = $conexion->prepare($sql_es);
                                                    $update_est->execute();
                                                    /* COLOCAR EN GESTION PARA CUANDO SEA LUGAR DE LLEGADA PARA HACER MAS GESTION */
                                                    $sql_es = "UPDATE cmx_inicio_seguimiento SET estado_punto='$estado_punto' WHERE cod_ini_ruta=" . $id_ini_ruta . " AND codigo_punto='$codigo_punto'";
                                                    $update_est = $conexion->prepare($sql_es);
                                                    $update_est->execute();
                                                } else {
                                                    $sql_es = "UPDATE cmx_manifiesto SET estado_seguimiento='SEGUIMIENTO' WHERE id=" . $manifiesto . "";
                                                    $update_est = $conexion->prepare($sql_es);
                                                    $update_est->execute();
                                                }
                                            }
                                        } else {
                                            $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                                        }
                                    }
                                    // Confirmar la transacción
                                    $conexion->commit();
                                    $response = ["success" => true, "message" => "<b>Nota:</b>  Registrada exitosamente en NexosApp."];
                                } catch (\Throwable $e) {
                                    //throw $th;
                                    // Ocurrió un error, deshacer la transacción
                                    $conexion->rollback();
                                    $errorMessage = "Error en la transacción al insertar nota controlador: " . $e->getMessage() . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
                                    $logFilePath = 'error_log.txt'; // Ajusta la ruta según la estructura de tu proyecto
                                    error_log($errorMessage, 3, $logFilePath);

                                    // Verificar si el archivo de log se ha escrito correctamente
                                    if (!file_exists($logFilePath)) {
                                        error_log("No se pudo crear el archivo de log: $logFilePath\n", 3, $logFilePath);
                                    }
                                    // Mostrar un mensaje amigable al usuario
                                    $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                                }
                            } else {
                                try {
                                    // Iniciar una transacción
                                    $conexion->beginTransaction();
                                    $sql4 = "UPDATE cmx_inici_manifiesto_estado SET ultimo_estado='0' WHERE cod_ini_ruta=$id_ini_ruta";
                                    $updatemani = $conexion->prepare($sql4);
                                    $result = $updatemani->execute();
                                    if ($result) {
                                        $sql3 = "INSERT INTO cmx_inici_manifiesto_estado (id,cod_ini_ruta,estado,actual,fecha,hora,usuario,ultimo_estado,reporte_cliente)
                                                         VALUES(null,'$id_ini_ruta','$estadoq','$procesoq','$fecha','$hora','$user','1','$reportecliente')";
                                        $crearmani = $conexion->prepare($sql3);
                                        $result_estado = $crearmani->execute();

                                        if ($result_estado) {
                                            // Insertar el registro de seguimiento
                                            $sql = "INSERT INTO cmx_inicio_seguimiento (id,cod_man_estado,tipo_contacto,tipo_seguimiento,detalle_tipo,tipo_proceso,observacion,fecha,hora,usuario,reporte_cliente,cod_ini_ruta,novedad,ocurrio,codigo_punto,tiempo,estado_punto)
                                                            VALUES(null,'$idm','$contacto','$tsegui','$tdetalle','$tproceso','$observa','$fecha','$hora','$user','$reportecliente','$id_ini_ruta','$new','$ocurrio','$codigo_punto','$tiempo','$estado_punto')";
                                            $crearinicio = $conexion->prepare($sql);
                                            $result = $crearinicio->execute();

                                            if ($result) {
                                                $sqlf = "SELECT max(id) as ids  FROM cmx_inicio_seguimiento WHERE cod_ini_ruta=$id_ini_ruta";
                                                $consulta_solic = $conexion->prepare($sqlf);
                                                $consulta_solic->execute();
                                                $dato = $consulta_solic->fetch();
                                                $id_seguimiento = $dato["ids"];
                                                //insertar solicitudes de servicio
                                                // Nuevo
                                                $nservicio = $data["solicitud_servicio_nuevo"];
                                                for ($i = 0; $i < count($nservicio); $i++) {
                                                    $nsolicitud = $nservicio[$i];
                                                    $sqls = "INSERT INTO cmx_seguimiento_servicio (id,id_servicio,id_seguimiento,usuario,hora,fecha)
                                                                    VALUES(null,'$nsolicitud','$id_seguimiento','$user','$hora','$fecha');";
                                                    $crearsoli = $conexion->prepare($sqls);
                                                    $result2 = $crearsoli->execute();
                                                }
                                                //Insertar en la tabla de punto de control para los sitios no establecidos en el plan de ruta inicial
                                                $sqlpuntocontrol = "INSERT INTO cmx_puntos_controlador(seguimiento_id,punto_controlador,usuario,fecha_at)
                                                VALUES('$id_seguimiento','$nota_punto_controlador','$user','$fecha.$hora')";
                                                $crearPuntocontrol = $conexion->prepare($sqlpuntocontrol);
                                                $crearPuntocontrol->execute();

                                                /* Cambiar el estado del manifieto cuando le den en llegada */
                                                if ($accion_punto == 'Lugar Llegada') {
                                                    $estado = "LLEGADA";
                                                    $estado_punto = "GESTION";
                                                    $sql_es = "UPDATE cmx_manifiesto SET estado_seguimiento='$estado' WHERE id=" . $manifiesto . "";
                                                    $update_est = $conexion->prepare($sql_es);
                                                    $update_est->execute();
                                                    /* COLOCAR EN GESTION PARA CUANDO SEA LUGAR DE LLEGADA PARA HACER MAS GESTION */
                                                    $sql_es = "UPDATE cmx_inicio_seguimiento SET estado_punto='$estado_punto' WHERE cod_ini_ruta=" . $id_ini_ruta . " AND codigo_punto='$codigo_punto'";
                                                    $update_est = $conexion->prepare($sql_es);
                                                    $update_est->execute();
                                                } else {
                                                    $sql_es = "UPDATE cmx_manifiesto SET estado_seguimiento='SEGUIMIENTO' WHERE id=" . $manifiesto . "";
                                                    $update_est = $conexion->prepare($sql_es);
                                                    $update_est->execute();
                                                }
                                            }

                                            if ($tipo == 'punto geografico') {
                                                $sqlf = "SELECT max(id) as ids FROM cmx_inicio_seguimiento WHERE cod_ini_ruta=$id_ini_ruta";
                                                $consulta_solic = $conexion->prepare($sqlf);
                                                $consulta_solic->execute();
                                                $dato = $consulta_solic->fetch();
                                                $id_seguimiento = $dato["ids"];
                                                $ubilatitud = $data["latitud"];
                                                $ubilongitud = $data["longitud"];
                                                $edoc = empty($data["edocu"]) ? 0 : $data["edocu"];
                                                //$udocumnento=$_POST["udocumnento"];
                                                $sql = "INSERT INTO cmx_iniruta_ubicacion (id,cod_ini_ruta,latitud,longitud,usuario,fecha,hora,lugar,id_seguimiento,existe_evidencia)
                                                            VALUES(null,$id_ini_ruta,$ubilatitud,$ubilongitud,'$user','$fecha','$hora',$tdetalle,$id_seguimiento,$edoc)";
                                                $crearubi = $conexion->prepare($sql);
                                                $result2 = $crearubi->execute();
                                                if ($result2) {
                                                    //Archivo
                                                    $aleatorio1 = rand(10000, 90000);
                                                    $ruta_evidencia = "../public/files/evidencia_seguimiento/" . $id_ini_ruta . "/" . $id_seguimiento . "/";
                                                    $ruta_evidencia2 = "public/files/evidencia_seguimiento/" . $id_ini_ruta . "/" . $id_seguimiento . "/";
                                                    if (!file_exists($ruta_evidencia)) {
                                                        mkdir($ruta_evidencia, 0777, true);
                                                    }
                                                    $sqlt = "SELECT max(id) as idu  FROM cmx_iniruta_ubicacion WHERE id_seguimiento=id_seguimiento";
                                                    $consulta_solic = $conexion->prepare($sqlt);
                                                    $consulta_solic->execute();
                                                    $dato = $consulta_solic->fetch();
                                                    $id_ubica = $dato["idu"];
                                                    $sqlub = "UPDATE cmx_iniruta_ubicacion
                                                        SET evidencia='$ruta_evidencia2',
                                                        existe_evidencia=" . $edoc . "
                                                        WHERE id = " . $id_ubica . "";
                                                    $consulta = $conexion->prepare($sqlub);
                                                    $consulta->execute();
                                                    for ($i = 0; $i < count($_FILES); $i++) {
                                                        if (isset($_FILES["udocumnento" . $i])) {
                                                            $file = $_FILES["udocumnento" . $i];
                                                            $nombre = $file["name"];
                                                            $tipo = $file["type"];
                                                            $ruta_provisional = $file["tmp_name"];
                                                            $carpeta = $ruta_evidencia;
                                                            $src = $carpeta . $nombre;
                                                            move_uploaded_file($ruta_provisional, $src);
                                                        }
                                                    }
                                                }
                                            }
                                        } else {
                                            $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                                        }
                                    }
                                    // Confirmar la transacción
                                    $conexion->commit();
                                    $response = ["success" => true, "message" => "<b>Nota:</b>  Registrada exitosamente en NexosApp."];
                                } catch (\Throwable $e) {
                                    // Ocurrió un error, deshacer la transacción
                                    $conexion->rollback();
                                    $errorMessage = "Error en la transacción al insertar nota controlador: " . $e->getMessage() . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
                                    $logFilePath = 'error_log.txt'; // Ajusta la ruta según la estructura de tu proyecto
                                    error_log($errorMessage, 3, $logFilePath);

                                    // Verificar si el archivo de log se ha escrito correctamente
                                    if (!file_exists($logFilePath)) {
                                        error_log("No se pudo crear el archivo de log: $logFilePath\n", 3, $logFilePath);
                                    }
                                    // Mostrar un mensaje amigable al usuario
                                    $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                                }
                            }
                        } else {
                            // echo "No se recibieron datos válidos.";
                            $mensajeError = "Error No se recibieron datos válidos El dia " . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
                            error_log($mensajeError . "\n", 3, "error_log.txt");
                            $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                            throw new Exception("Error al guardar los datos");
                        }
                    } else {
                        // echo "No se recibio el tiempo de la nota.";
                        $mensajeError = "Error No se recibio el tiempo de la nota. El dia " . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
                        error_log($mensajeError . "\n", 3, "error_log.txt");
                        $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                        throw new Exception("Error al guardar Tiempos");
                    }
                } else {
                    if ($data) {
                        $id_ini_ruta = $data["id_ini_ruta"];
                        $idm = $data["idmanifiesto"];
                        $contacto = $data["contacto"];
                        $tsegui = $data["tipo_seguimiento"];
                        $tdetalle = empty($data["tipo_detalle"]) ? 0 : $data["tipo_detalle"];
                        $tproceso = $data["tipo_proceso"];
                        $observa = $data["observacion"];
                        $reportecliente = $data["reporte_cliente"];
                        $deta = $data["accion_completado"];
                        $nota_punto_controlador = $data["nota_punto_controlador"];
                        $tipo = $data["tipo_seguimiento"];
                        if (isset($data["novedad_general"])) {
                            $new = $data["novedad_general"];
                        } else {
                            $new = '';
                        }
                        $ocurrio = $data["ocurrio"];
                        $codigo_punto = empty($data["codigo_punto"]) ? 0 : $data["codigo_punto"];
                        $accion_punto = $data["accion_punto"];
                        $manifiesto = $data["manifiesto"];
                        //estado
                        $id_ini_ruta = $data["id_ini_ruta"];
                        $estadoq = $data["estado_siguiente"];
                        $procesoq = $data["accion_completado"];
                        $estado_punto = 'GESTION';

                        /* Validar si el punto del controlador esta en el sistema */
                        if ($nota_punto_controlador) {
                            try {
                                // Iniciar una transacción
                                $conexion->beginTransaction();
                                $sql4 = "UPDATE cmx_inici_manifiesto_estado SET ultimo_estado='0' WHERE cod_ini_ruta=$id_ini_ruta";
                                $updatemani = $conexion->prepare($sql4);
                                $result = $updatemani->execute();
                                if ($result) {
                                    $sql3 = "INSERT INTO cmx_inici_manifiesto_estado (id,cod_ini_ruta,estado,actual,fecha,hora,usuario,ultimo_estado,reporte_cliente)
                                                     VALUES(null,'$id_ini_ruta','$estadoq','$procesoq','$fecha','$hora','$user','1','$reportecliente')";
                                    $crearmani = $conexion->prepare($sql3);
                                    $result_estado = $crearmani->execute();
                                    if ($result_estado) {
                                        // Insertar el registro de seguimiento
                                        $sql = "INSERT INTO cmx_inicio_seguimiento (id,cod_man_estado,tipo_contacto,tipo_seguimiento,detalle_tipo,tipo_proceso,observacion,fecha,hora,usuario,reporte_cliente,cod_ini_ruta,novedad,ocurrio,codigo_punto,tiempo,estado_punto)
                                                        VALUES(null,'$idm','$contacto','$tsegui','$tdetalle','$tproceso','$observa','$fecha','$hora','$user','$reportecliente','$id_ini_ruta','$new','$ocurrio','$codigo_punto',-59,'$estado_punto')";
                                        $crearinicio = $conexion->prepare($sql);
                                        $result = $crearinicio->execute();

                                        if ($result) {
                                            $sqlf = "SELECT max(id) as ids  FROM cmx_inicio_seguimiento WHERE cod_ini_ruta=$id_ini_ruta";
                                            $consulta_solic = $conexion->prepare($sqlf);
                                            $consulta_solic->execute();
                                            $dato = $consulta_solic->fetch();
                                            $id_seguimiento = $dato["ids"];
                                            //insertar solicitudes de servicio
                                            // Nuevo
                                            $nservicio = $data["solicitud_servicio_nuevo"];
                                            for ($i = 0; $i < count($nservicio); $i++) {
                                                $nsolicitud = $nservicio[$i];
                                                $sqls = "INSERT INTO cmx_seguimiento_servicio (id,id_servicio,id_seguimiento,usuario,hora,fecha)
                                                                VALUES(null,'$nsolicitud','$id_seguimiento','$user','$hora','$fecha');";
                                                $crearsoli = $conexion->prepare($sqls);
                                                $result2 = $crearsoli->execute();
                                            }
                                            //Insertar en la tabla de punto de control para los sitios no establecidos en el plan de ruta inicial
                                            $sqlpuntocontrol = "INSERT INTO cmx_puntos_controlador(seguimiento_id,punto_controlador,usuario,fecha_at)
                                            VALUES('$id_seguimiento','$nota_punto_controlador','$user','$fecha.$hora')";
                                            $crearPuntocontrol = $conexion->prepare($sqlpuntocontrol);
                                            $crearPuntocontrol->execute();
                                            /* Cambiar el estado del manifieto cuando le den en llegada */
                                            if ($accion_punto == 'Lugar Llegada') {
                                                $estado = "LLEGADA";
                                                $sql_es = "UPDATE cmx_manifiesto SET estado_seguimiento='$estado' WHERE id=" . $manifiesto . "";
                                                $update_est = $conexion->prepare($sql_es);
                                                $update_est->execute();
                                            } else {
                                                $sql_es = "UPDATE cmx_manifiesto SET estado_seguimiento='SEGUIMIENTO' WHERE id=" . $manifiesto . "";
                                                $update_est = $conexion->prepare($sql_es);
                                                $update_est->execute();
                                            }
                                        }
                                    } else {
                                        $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                                    }
                                }
                                // Confirmar la transacción
                                $conexion->commit();
                                $response = ["success" => true, "message" => "<b>Nota:</b> Registrada exitosamente en NexosApp."];
                            } catch (\Throwable $e) {
                                // Ocurrió un error, deshacer la transacción
                                $conexion->rollback();
                                $errorMessage = "Error en la transacción al insertar nota controlador: " . $e->getMessage() . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
                                $logFilePath = 'error_log.txt'; // Ajusta la ruta según la estructura de tu proyecto
                                error_log($errorMessage, 3, $logFilePath);

                                // Verificar si el archivo de log se ha escrito correctamente
                                if (!file_exists($logFilePath)) {
                                    error_log("No se pudo crear el archivo de log: $logFilePath\n", 3, $logFilePath);
                                }
                                // Mostrar un mensaje amigable al usuario
                                $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                            }
                        } else {
                            try {
                                // Iniciar una transacción
                                $conexion->beginTransaction();
                                $sql4 = "UPDATE cmx_inici_manifiesto_estado SET ultimo_estado='0' WHERE cod_ini_ruta=$id_ini_ruta";
                                $updatemani = $conexion->prepare($sql4);
                                $result = $updatemani->execute();
                                if ($result) {
                                    $sql3 = "INSERT INTO cmx_inici_manifiesto_estado (id,cod_ini_ruta,estado,actual,fecha,hora,usuario,ultimo_estado,reporte_cliente)
                                                     VALUES(null,'$id_ini_ruta','$estadoq','$procesoq','$fecha','$hora','$user','1','$reportecliente')";
                                    $crearmani = $conexion->prepare($sql3);
                                    $result_estado = $crearmani->execute();
                                    if ($result_estado) {
                                        // Insertar el registro de seguimiento
                                        $sql = "INSERT INTO cmx_inicio_seguimiento (id,cod_man_estado,tipo_contacto,tipo_seguimiento,detalle_tipo,tipo_proceso,observacion,fecha,hora,usuario,reporte_cliente,cod_ini_ruta,novedad,ocurrio,codigo_punto,tiempo,estado_punto)
                                                        VALUES(null,'$idm','$contacto','$tsegui','$tdetalle','$tproceso','$observa','$fecha','$hora','$user','$reportecliente','$id_ini_ruta','$new','$ocurrio','$codigo_punto',-59,'$estado_punto')";
                                        $crearinicio = $conexion->prepare($sql);
                                        $result = $crearinicio->execute();

                                        if ($result) {
                                            $sqlf = "SELECT max(id) as ids  FROM cmx_inicio_seguimiento WHERE cod_ini_ruta=$id_ini_ruta";
                                            $consulta_solic = $conexion->prepare($sqlf);
                                            $consulta_solic->execute();
                                            $dato = $consulta_solic->fetch();
                                            $id_seguimiento = $dato["ids"];
                                            //insertar solicitudes de servicio
                                            // Nuevo
                                            $nservicio = $data["solicitud_servicio_nuevo"];
                                            for ($i = 0; $i < count($nservicio); $i++) {
                                                $nsolicitud = $nservicio[$i];
                                                $sqls = "INSERT INTO cmx_seguimiento_servicio (id,id_servicio,id_seguimiento,usuario,hora,fecha)
                                                                VALUES(null,'$nsolicitud','$id_seguimiento','$user','$hora','$fecha');";
                                                $crearsoli = $conexion->prepare($sqls);
                                                $result2 = $crearsoli->execute();
                                            }
                                            //Insertar en la tabla de punto de control para los sitios no establecidos en el plan de ruta inicial
                                            $sqlpuntocontrol = "INSERT INTO cmx_puntos_controlador(seguimiento_id,punto_controlador,usuario,fecha_at)
                                            VALUES('$id_seguimiento','$nota_punto_controlador','$user','$fecha.$hora')";
                                            $crearPuntocontrol = $conexion->prepare($sqlpuntocontrol);
                                            $crearPuntocontrol->execute();
                                            /* Cambiar el estado del manifieto cuando le den en llegada */
                                            if ($accion_punto == 'Lugar Llegada') {
                                                $estado = "LLEGADA";
                                                $sql_es = "UPDATE cmx_manifiesto SET estado_seguimiento='$estado' WHERE id=" . $manifiesto . "";
                                                $update_est = $conexion->prepare($sql_es);
                                                $update_est->execute();
                                            } else {
                                                $sql_es = "UPDATE cmx_manifiesto SET estado_seguimiento='SEGUIMIENTO' WHERE id=" . $manifiesto . "";
                                                $update_est = $conexion->prepare($sql_es);
                                                $update_est->execute();
                                            }
                                        }

                                        if ($tipo == 'punto geografico') {
                                            $sqlf = "SELECT max(id) as ids FROM cmx_inicio_seguimiento WHERE cod_ini_ruta=$id_ini_ruta";
                                            $consulta_solic = $conexion->prepare($sqlf);
                                            $consulta_solic->execute();
                                            $dato = $consulta_solic->fetch();
                                            $id_seguimiento = $dato["ids"];
                                            $ubilatitud = $data["latitud"];
                                            $ubilongitud = $data["longitud"];
                                            $edoc = $data["edocu"];

                                            $sql = "INSERT INTO cmx_iniruta_ubicacion (id, cod_ini_ruta, latitud, longitud, usuario, fecha, hora, lugar, id_seguimiento, existe_evidencia)
                                                    VALUES (null, $id_ini_ruta, $ubilatitud, $ubilongitud, '$user', '$fecha', '$hora', $tdetalle, $id_seguimiento, $edoc)";
                                            $crearubi = $conexion->prepare($sql);
                                            $result2 = $crearubi->execute();
                                            if ($result2) {
                                                //Archivo
                                                $aleatorio1 = rand(10000, 90000);
                                                $ruta_evidencia = "../public/files/evidencia_seguimiento/" . $id_ini_ruta . "/" . $id_seguimiento . "/";
                                                $ruta_evidencia2 = "public/files/evidencia_seguimiento/" . $id_ini_ruta . "/" . $id_seguimiento . "/";
                                                if (!file_exists($ruta_evidencia)) {
                                                    mkdir($ruta_evidencia, 0777, true);
                                                }
                                                $sqlt = "SELECT max(id) as idu  FROM cmx_iniruta_ubicacion WHERE id_seguimiento=id_seguimiento";
                                                $consulta_solic = $conexion->prepare($sqlt);
                                                $consulta_solic->execute();
                                                $dato = $consulta_solic->fetch();
                                                $id_ubica = $dato["idu"];
                                                $sqlub = "UPDATE cmx_iniruta_ubicacion
                                                    SET evidencia='$ruta_evidencia2',
                                                    existe_evidencia=" . $edoc . "
                                                    WHERE id = " . $id_ubica . "";
                                                $consulta = $conexion->prepare($sqlub);
                                                $consulta->execute();
                                                for ($i = 0; $i < count($_FILES); $i++) {
                                                    if (isset($_FILES["udocumnento" . $i])) {
                                                        $file = $_FILES["udocumnento" . $i];
                                                        $nombre = $file["name"];
                                                        $tipo = $file["type"];
                                                        $ruta_provisional = $file["tmp_name"];
                                                        $carpeta = $ruta_evidencia;
                                                        $src = $carpeta . $nombre;
                                                        move_uploaded_file($ruta_provisional, $src);
                                                    }
                                                }
                                            }
                                        }
                                    } else {
                                        $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                                    }
                                }
                                // Confirmar la transacción
                                $conexion->commit();
                                $response = ["success" => true, "message" => "<b>Nota:</b> Registrada exitosamente en NexosApp."];
                            } catch (\Throwable $e) {
                                // Ocurrió un error, deshacer la transacción
                                $conexion->rollback();
                                $errorMessage = "Error en la transacción al insertar nota controlador: " . $e->getMessage() . " " . date("Y-m-d H:i:s") . " " . $user . "\n";
                                $logFilePath = 'error_log.txt'; // Ajusta la ruta según la estructura de tu proyecto
                                error_log($errorMessage, 3, $logFilePath);

                                // Verificar si el archivo de log se ha escrito correctamente
                                if (!file_exists($logFilePath)) {
                                    error_log("No se pudo crear el archivo de log: $logFilePath\n", 3, $logFilePath);
                                }
                                // Mostrar un mensaje amigable al usuario
                                $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                            }
                        }
                    } else {
                        // echo "No se recibieron datos válidos.";
                        $mensajeError = "Error No se recibieron datos válidos El dia " . date("Y-m.d");
                        error_log($mensajeError . "\n", 3, "error_log.txt");
                        $response = ['success' => false, 'message' => 'Ha ocurrido un error al insertar la nota. Por favor, inténtelo nuevamente más tarde.</br> o comunicarse con el equipo de desarrollo.'];
                        throw new Exception("Error al guardar los datos");
                    }
                }
                /* Codigo comentario */
            }
        }
        return $response;
    }

    public function crear_gestionestado()
    {

        $_msg_error = "";

        $model = new Conexion;

        $conexion = $model->conectar();

        $fecha = date('Y-m-d');

        $hora = date('H:i:s');

        $user = $_SESSION["usuario"]["nom_usuario"];

        $gestion = $_POST["gestion"];

        if ($gestion == 1) {

            $id_ini_ruta = $_POST["id_ini_ruta"];

            $estadoq = $_POST["estadoq"];

            $procesoq = $_POST["procesoq"];

            $noveq = $_POST["noveq"];

            $reportecliente = $_POST["reportecliente"];

            $sql4 = "

				UPDATE cmx_inici_manifiesto_estado

				SET ultimo_estado='0'

				WHERE cod_ini_ruta=$id_ini_ruta";

            // echo $sql4;

            $updatemani = $conexion->prepare($sql4);

            $result = $updatemani->execute();

            if ($result) {

                $sql3 = "INSERT INTO cmx_inici_manifiesto_estado

						(id,cod_ini_ruta,estado,actual,

						fecha,hora,usuario,ultimo_estado,reporte_cliente)

						VALUES(null,'$id_ini_ruta','$estadoq','$procesoq','$fecha','$hora','$user','1','$reportecliente')";

                $crearmani = $conexion->prepare($sql3);

                $result = $crearmani->execute();

                $return["success"] = true;

                return $return;
            }
        }
    }

    //GRUPO

    public function insertar_grupo()
    {

        $_msg_error = "";

        $model = new Conexion;

        $conexion = $model->conectar();

        $fecha = date('Y-m-d');

        $hora = date('H:i:s');

        $user = $_SESSION["usuario"]["nom_usuario"];

        $cliente = $_POST["cliente"];

        $nomgrupo = $_POST["nomgrupo"];

        $sql = "INSERT INTO cmx_grupo

				(id,id_cliente,nombre_grupo,estado)

				VALUES(null," . $cliente . ",'" . $nomgrupo . "',1)";

        $crear = $conexion->prepare($sql);

        $result = $crear->execute();

        $return["success"] = true;

        return $return;
    }

    public function insertar_contactos()
    {

        $_msg_error = "";

        $model = new Conexion;

        $conexion = $model->conectar();

        $fecha = date('Y-m-d');

        $hora = date('H:i:s');

        $user = $_SESSION["usuario"]["nom_usuario"];

        $nombre = $_POST["nombre"];

        $correo = $_POST["correo"];

        $cliente = $_POST["cliente"];

        if (isset($_POST["cargo"])) {

            $cargo = $_POST["cargo"];
        } else {

            $cargo = '';
        }

        if (isset($_POST["tele"])) {

            $tele = $_POST["tele"];
        } else {

            $tele = '';
        }

        if (isset($_POST["area"])) {

            $area = $_POST["area"];
        } else {

            $area = '';
        }

        $sql = "SELECT max(id)as id FROM cmx_grupo";

        $consulta_solic_grupo = $conexion->prepare($sql);

        $consulta_solic_grupo->execute();

        $datos_grupo = $consulta_solic_grupo->fetch();

        $id_grupo = $datos_grupo["id"];

        $sql2 = "INSERT INTO cmx_grupo_contacto_cliente

				(id,idgrupo,idcliente,nombre_contactos,telefono,

				cargo,areaa,email,fecha,hora,usuario)

				VALUES(null," . $id_grupo . "," . $cliente . ",'" . $nombre . "'," . $tele . ",'" . $cargo . "','" . $area . "','" . $correo . "','" . $fecha . "','" . $hora . "','" . $user . "')";

        $crear = $conexion->prepare($sql2);

        $result = $crear->execute();

        $return["success"] = true;

        return $return;
    }

    public function actualizar_grupo()
    {

        $_msg_error = "";

        $model = new Conexion;

        $conexion = $model->conectar();

        $fecha = date('Y-m-d');

        $hora = date('H:i:s');

        $user = $_SESSION["usuario"]["nom_usuario"];

        $nuevo = $_POST["nuevo"];

        $actual = $_POST["actual"];

        $cliente = $_POST["cliente"];

        $nomgrupo = $_POST["nomgrupo"];

        $idgrupo = $_POST["idgrupo"];

        $sql = "UPDATE cmx_grupo

				SET id_cliente=" . $cliente . ",

					nombre_grupo='" . $nomgrupo . "'

				WHERE id=" . $idgrupo . "";

        $crearu = $conexion->prepare($sql);

        $result = $crearu->execute();

        if ($actual == 9) { //actualizar

            $aid = $_POST["aid"];

            $aname = $_POST["aname"];

            $atel = $_POST["atel"];

            $acargo = $_POST["acargo"];

            $aarea = $_POST["aarea"];

            $aemail = $_POST["aemail"];

            $sql2 = "UPDATE cmx_grupo_contacto_cliente

				SET idcliente=" . $cliente . ",

					nombre_contactos='" . $aname . "',

					telefono=" . $atel . ",

					cargo='" . $acargo . "',

					areaa='" . $aarea . "',

					email='" . $aemail . "'

				WHERE  id=" . $aid . "";

            $crear = $conexion->prepare($sql2);

            $result = $crear->execute();
        }

        if ($nuevo == 8) { //insertar

            $nnombre = $_POST["nnombre"];

            $ncargo = $_POST["ncargo"];

            $nfijo = $_POST["nfijo"];

            $narea = $_POST["narea"];

            $ncorreo = $_POST["ncorreo"];

            $sql3 = "INSERT INTO   cmx_grupo_contacto_cliente

						(id,idgrupo,idcliente,nombre_contactos,telefono,cargo,areaa,email,fecha,hora,usuario)

					VALUES(null," . $idgrupo . "," . $cliente . ",'" . $nnombre . "'," . $nfijo . ",'" . $ncargo . "','" . $narea . "','" . $ncorreo . "','" . $fecha . "','" . $hora . "','" . $user . "')";

            $crear = $conexion->prepare($sql3);

            $result = $crear->execute();
        }

        $return["success"] = true;

        return $return;
    }
}
