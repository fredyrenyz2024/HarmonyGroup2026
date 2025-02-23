<?php
include '../application/Conexion.php';
require_once '../application/Config.php';
session_start();

// echo 'sjdjsdhd';
class Preestudio
{
    public $user_log;
    public $pass;
    public $mensaje;
    public $respuesta;
    public $email;
    public $listado;

    public function verpreestudio()
    {
        $placa = $_POST["id"];
        // echo $placa;
        // echo 'ferrocarril';

        $model = new Conexion;
        $conexion = $model->conectar();
        //consultar
        $sql = "SELECT * FROM cmx_vehiculos_preestudio
						WHERE placa_vehiculo='" . $placa . "'  ";
        // echo $sql;
        $consulta = $conexion->prepare($sql);
        $consulta->execute();
        $total = $consulta->rowCount();
        // $this->mensaje = $total;
        if ($total == 0) {
            echo 'no hay nada vehiculospreestudio';
            $this->mensaje = '0';

            $this->respuesta = "GOOD";
        } else {
            //si hay en cmx_vehiculos
            echo 'si hay algo';
            $this->respuesta = "GOOD";
            $this->mensaje = '1';
            while ($datos_solicitudes = $consulta->fetch()) {
                $this->listado[] = $datos_solicitudes;
            }
        }

        //PRINCIPAL VEHICULOS

        //consultar cmx_vehiculos
        $sql2 = "SELECT * FROM cmx_vehiculos
						WHERE placa='" . $placa . "'   ";
        echo $sql2;
        $consulta2 = $conexion->prepare($sql2);
        $result = $consulta2->execute();
        if ($result) {
            echo 'si hay vehiculos';
            $this->mensaje = '11';
        } else {
            echo 'no hay vehiculos';
            $this->mensaje = '00';
        }
        $return["success"] = true;
        $return["error"] = $_msg_error;
        return $return;
    }

    public function registrar_respuesta_operacion()
    {
        $_msg_error = "";
        $model = new Conexion;
        $conexion = $model->conectar();

        $nestudio = $_POST["nestudio"];
        $ntipo = $_POST["ntipo"];
        $rta = $_POST["rta"];
        $estudio = $_POST["estudio"];
        $fecha = date('Y-m-d');
        $hora = date('H:i:s');
        $user = $_SESSION["usuario"]["nom_usuario"];
        if (isset($_POST["nomarchivo"])) {
            $nomarchivo = $_POST["nomarchivo"];
        }

        $sql = "INSERT INTO cmx_respuesta_operacion (id,id_estudio,id_movimiento,estudio_letra,nota,fecha,hora,usuario)
				VALUES(null," . $nestudio . "," . $ntipo . ",'" . $estudio . "','" . $rta . "','" . $fecha . "','" . $hora . "','" . $user . "');";
        $crear_rta = $conexion->prepare($sql);
        $result = $crear_rta->execute();

        /* Validar si va con archivo o no la respuesta */
        if (isset($_FILES['op_archivo'])) {
            $ruta_empresarial2 = "../public/files/estudioseguridad/respuesta_operaciones/" . $nestudio . "/";
            $ruta_empresarial22 = "public/files/estudioseguridad/respuesta_operaciones/" . $nestudio . "/";
            if ($result) {
                $sql_update_hora_fecha = "UPDATE cmx_estudio_vehiculo SET fecha_respuesta='" . $fecha . "', hora_respuesta='" . $hora . "' WHERE id_estudio= " . $nestudio;
                $consulta_update_fecha_hora = $conexion->prepare($sql_update_hora_fecha);
                $consulta_update_fecha_hora->execute();
                if ($consulta_update_fecha_hora) {
                    $sql = "SELECT max(id) as 'id' FROM cmx_respuesta_operacion";
                    $consulta_solic_vehic = $conexion->prepare($sql);
                    $consulta_solic_vehic->execute();
                    $datos_proveedor = $consulta_solic_vehic->fetch();
                    $id_respuesta = $datos_proveedor["id"];
                    if (file_exists($ruta_empresarial2)) {
                        if (file_exists($ruta_empresarial2) && $nomarchivo != '') {
                            if (!file_exists($ruta_empresarial2)) {
                                mkdir($ruta_empresarial2, 0777, true);
                            }
                            if ($_FILES['op_archivo'] != null) {
                                $nombre = $_FILES['op_archivo']['name'];
                                $rutaTemporal = $_FILES['op_archivo']['tmp_name'];
                                $carpeta = $ruta_empresarial2;
                                $src = $carpeta . $nombre;
                                // move_uploaded_file($rutaTemporal, $src);
                                if (move_uploaded_file($rutaTemporal, $src)) {
                                    // El archivo se subió correctamente
                                    // Ejecuta otra acción aquí, por ejemplo, actualiza la base de datos, etc.
                                    // echo "El archivo se ha subido correctamente.";
                                    $nom1 = $nomarchivo;
                                    $sql2 = "UPDATE cmx_respuesta_operacion SET archivo = '" . $ruta_empresarial22 . "', nom_archivo='" . $nom1 . "' WHERE id= " . $id_respuesta . "";
                                    $consulta_act_archivo = $conexion->prepare($sql2);
                                    $consulta_act_archivo->execute();
                                    if ($consulta_act_archivo) {
                                        $return["success"] = true;
                                    }
                                } else {
                                    // Hubo un error al subir el archivo
                                    $mensajeError = "Error al mover el archivo a la carpeta de destino." . date("Y-m-d H:i:s");
                                    error_log($mensajeError . "\n", 3, "error_log.txt");
                                    $return["success"] = false;
                                    // echo "Hubo un error al subir el archivo.";
                                    // Ejecuta otra acción aquí en caso de error, por ejemplo, devuelve una respuesta de error al usuario.
                                }
                            } else {
                                // Cuando no hay documentos para subir
                                $mensajeError = "No se han proporcionado documentos para subir." . date("Y-m-d");
                                error_log($mensajeError . "\n", 3, "error_log.txt");
                                // throw new Exception("Error al guardar proveedor 1");
                            }
                        }
                    } else {
                        mkdir($ruta_empresarial2, 0777, true);
                        if (file_exists($ruta_empresarial2) && $nomarchivo != '') {
                            $aleatorio1 = rand(10000, 90000);
                            $nom1 = $nomarchivo;
                            $sql2 = "UPDATE cmx_respuesta_operacion
                                  SET archivo = '" . $ruta_empresarial22 . "',
                                  nom_archivo='" . $nom1 . "'
                                  WHERE id = " . $id_respuesta . "";

                            $consulta_act_archivo = $conexion->prepare($sql2);
                            $consulta_act_archivo->execute();

                            if ($_FILES['op_archivo'] != null) {
                                $nombre = $_FILES['op_archivo']['name'];
                                $rutaTemporal = $_FILES['op_archivo']['tmp_name'];
                                $carpeta = $ruta_empresarial2;
                                $src = $carpeta . $nombre;
                                // move_uploaded_file($rutaTemporal, $src);
                                if (move_uploaded_file($rutaTemporal, $src)) {
                                    // El archivo se subió correctamente
                                    // Ejecuta otra acción aquí, por ejemplo, actualiza la base de datos, etc.
                                    // echo "El archivo se ha subido correctamente.";
                                    $nom1 = $nomarchivo;
                                    $sql2 = "UPDATE cmx_respuesta_operacion SET archivo = '" . $ruta_empresarial22 . "', nom_archivo='" . $nom1 . "' WHERE id= " . $id_respuesta . "";
                                    $consulta_act_archivo = $conexion->prepare($sql2);
                                    $consulta_act_archivo->execute();
                                    if ($consulta_act_archivo) {
                                        $return["success"] = true;
                                    }
                                } else {
                                    // Hubo un error al subir el archivo
                                    $mensajeError = "Error al mover el archivo a la carpeta de destino." . date("Y-m-d H:i:s");
                                    error_log($mensajeError . "\n", 3, "error_log.txt");
                                    $return["success"] = false;
                                    // echo "Hubo un error al subir el archivo.";
                                    // Ejecuta otra acción aquí en caso de error, por ejemplo, devuelve una respuesta de error al usuario.
                                }
                            } else {
                                // Cuando no hay documentos para subir
                                $mensajeError = "No se han proporcionado documentos para subir." . date("Y-m-d");
                                error_log($mensajeError . "\n", 3, "error_log.txt");
                                // throw new Exception("Error al guardar proveedor 1");
                            }
                        }
                    }
                    // $return["success"] = true;
                } else {
                    $return["success"] = false;
                }
            } else {
                $return["success"] = false;
            }
        } else {
            $return["success"] = false;
        }

        // $ruta_empresarial2 = "../public/files/estudioseguridad/respuesta_operaciones/" . $nestudio . "/";
        // $ruta_empresarial22 = "public/files/estudioseguridad/respuesta_operaciones/" . $nestudio . "/";

        // if ($result) {
        //     $sql_update_hora_fecha = "UPDATE cmx_estudio_vehiculo SET fecha_respuesta='" . $fecha . "', hora_respuesta='" . $hora . "' WHERE id_estudio= " . $nestudio;
        //     $consulta_update_fecha_hora = $conexion->prepare($sql_update_hora_fecha);
        //     $consulta_update_fecha_hora->execute();
        //     if ($consulta_update_fecha_hora) {
        //         $sql = "SELECT max(id) as 'id' FROM cmx_respuesta_operacion";
        //         $consulta_solic_vehic = $conexion->prepare($sql);
        //         $consulta_solic_vehic->execute();
        //         $datos_proveedor = $consulta_solic_vehic->fetch();
        //         $id_respuesta = $datos_proveedor["id"];
        //         if (file_exists($ruta_empresarial2)) {
        //             if (file_exists($ruta_empresarial2) && $nomarchivo != '') {
        //                 if (!file_exists($ruta_empresarial2)) {
        //                     mkdir($ruta_empresarial2, 0777, true);
        //                 }
        //                 if ($_FILES['op_archivo'] != null) {
        //                     $nombre = $_FILES['op_archivo']['name'];
        //                     $rutaTemporal = $_FILES['op_archivo']['tmp_name'];
        //                     $carpeta = $ruta_empresarial2;
        //                     $src = $carpeta . $nombre;
        //                     // move_uploaded_file($rutaTemporal, $src);
        //                     if (move_uploaded_file($rutaTemporal, $src)) {
        //                         // El archivo se subió correctamente
        //                         // Ejecuta otra acción aquí, por ejemplo, actualiza la base de datos, etc.
        //                         // echo "El archivo se ha subido correctamente.";
        //                         $nom1 = $nomarchivo;
        //                         $sql2 = "UPDATE cmx_respuesta_operacion SET archivo = '" . $ruta_empresarial22 . "', nom_archivo='" . $nom1 . "' WHERE id= " . $id_respuesta . "";
        //                         $consulta_act_archivo = $conexion->prepare($sql2);
        //                         $consulta_act_archivo->execute();
        //                         if ($consulta_act_archivo) {
        //                             $return["success"] = true;
        //                         }
        //                     } else {
        //                         // Hubo un error al subir el archivo
        //                         $mensajeError = "Error al mover el archivo a la carpeta de destino." . date("Y-m-d H:i:s");
        //                         error_log($mensajeError . "\n", 3, "error_log.txt");
        //                         $return["success"] = false;
        //                         // echo "Hubo un error al subir el archivo.";
        //                         // Ejecuta otra acción aquí en caso de error, por ejemplo, devuelve una respuesta de error al usuario.
        //                     }
        //                 } else {
        //                     // Cuando no hay documentos para subir
        //                     $mensajeError = "No se han proporcionado documentos para subir." . date("Y-m-d");
        //                     error_log($mensajeError . "\n", 3, "error_log.txt");
        //                     // throw new Exception("Error al guardar proveedor 1");
        //                 }
        //             }
        //         } else {
        //             mkdir($ruta_empresarial2, 0777, true);
        //             if (file_exists($ruta_empresarial2) && $nomarchivo != '') {
        //                 $aleatorio1 = rand(10000, 90000);
        //                 $nom1 = $nomarchivo;
        //                 $sql2 = "UPDATE cmx_respuesta_operacion
        //                       SET archivo = '" . $ruta_empresarial22 . "',
        //                       nom_archivo='" . $nom1 . "'
        //                       WHERE id = " . $id_respuesta . "";

        //                 $consulta_act_archivo = $conexion->prepare($sql2);
        //                 $consulta_act_archivo->execute();

        //                 if ($_FILES['op_archivo'] != null) {
        //                     $nombre = $_FILES['op_archivo']['name'];
        //                     $rutaTemporal = $_FILES['op_archivo']['tmp_name'];
        //                     $carpeta = $ruta_empresarial2;
        //                     $src = $carpeta . $nombre;
        //                     // move_uploaded_file($rutaTemporal, $src);
        //                     if (move_uploaded_file($rutaTemporal, $src)) {
        //                         // El archivo se subió correctamente
        //                         // Ejecuta otra acción aquí, por ejemplo, actualiza la base de datos, etc.
        //                         // echo "El archivo se ha subido correctamente.";
        //                         $nom1 = $nomarchivo;
        //                         $sql2 = "UPDATE cmx_respuesta_operacion SET archivo = '" . $ruta_empresarial22 . "', nom_archivo='" . $nom1 . "' WHERE id= " . $id_respuesta . "";
        //                         $consulta_act_archivo = $conexion->prepare($sql2);
        //                         $consulta_act_archivo->execute();
        //                         if ($consulta_act_archivo) {
        //                             $return["success"] = true;
        //                         }
        //                     } else {
        //                         // Hubo un error al subir el archivo
        //                         $mensajeError = "Error al mover el archivo a la carpeta de destino." . date("Y-m-d H:i:s");
        //                         error_log($mensajeError . "\n", 3, "error_log.txt");
        //                         $return["success"] = false;
        //                         // echo "Hubo un error al subir el archivo.";
        //                         // Ejecuta otra acción aquí en caso de error, por ejemplo, devuelve una respuesta de error al usuario.
        //                     }
        //                 } else {
        //                     // Cuando no hay documentos para subir
        //                     $mensajeError = "No se han proporcionado documentos para subir." . date("Y-m-d");
        //                     error_log($mensajeError . "\n", 3, "error_log.txt");
        //                     // throw new Exception("Error al guardar proveedor 1");
        //                 }
        //             }
        //         }
        //         // $return["success"] = true;
        //     } else {
        //         $return["success"] = false;
        //     }
        // } else {
        //     $return["success"] = false;
        // }

        // $return["error"] = $_msg_error;
        return $return;
    }

    //funcion para la asociacion de solicitud de servicio
    public function insertar_preestudio_ss()
    {
        $_msg_error = "";
        $model = new Conexion;
        $conexion = $model->conectar();
        $fecha = date('Y-m-d');
        $hora = date('H:i:s');
        $user = $_SESSION["usuario"]["nom_usuario"];
        $soli = $_POST["soli_total"];
        if ($soli == 3) {
            $id_s = $_SESSION["id_s2"];
            echo $servicio = $_POST["solicitud"];
            $placa2 = $_POST["placa2"];
            $sqlid = "SELECT MAX(id) AS id2 FROM cmx_solicitudes_preestudio
					WHERE placa='" . $placa2 . "'
					AND fecha='" . $fecha . "'";
            //echo $sqlid;

            $consulta_idvehiculo = $conexion->prepare($sqlid);
            $consulta_idvehiculo->execute();
            $idvehiculo = $consulta_idvehiculo->fetch();

            $idsolicitud = $idvehiculo["id2"];
            if (empty($idvehiculo["id2"])) {
                //echo 'entro a 1000';
                $idsolicitud = 1000;
            } else {
                //$idsolicitud=$idvehiculo["id2"]+1;
                $idsolicitud = $idvehiculo["id2"];
            }
            /*$sqls ="INSERT INTO cmx_preestudio_solicitudes_servicio(id,id_servicio_cliente,id_solicitudpreestudio,fecha,hora,usuario,es)
            VALUES(null,$servicio,$id_s,'$fecha','$hora','$user','1')";*/
            $sqls = "INSERT INTO cmx_preestudio_solicitudes_servicio(id,id_servicio_cliente,id_solicitudpreestudio,fecha,hora,usuario,es)
					VALUES(null,$servicio,$idsolicitud,'$fecha','$hora','$user','1')";
            //echo $sqls;
            $crearservico = $conexion->prepare($sqls);
            $result = $crearservico->execute();
            if ($result) {
                //consultar el valor de la diponibilidad
                //para esa solicitud de servicio
                $sqld = "SELECT cant_disponible FROM cmx_solicitud_vehiculo2
					WHERE id=" . $servicio;
                $consulta_valor = $conexion->prepare($sqld);
                $consulta_valor->execute();
                $cant_disponible = $consulta_valor->fetch();
                $dosis = $cant_disponible["cant_disponible"];

                $sqlu = "UPDATE cmx_solicitud_vehiculo2
								SET estado='En_subasta'
								WHERE id=" . $servicio;
                $updateestados = $conexion->prepare($sqlu);
                $result = $updateestados->execute();

                if (empty($_POST["su_subasta"])) {
                    //es la primera vez que existe subasta para la solicitud
                    $sqles = "INSERT INTO cmx_log_solicitudvehiculo(id,id_solictud,user_log,fecha_asignacion,hora_asignacion,estado)
						VALUES(null," . $servicio . ",'" . $user . "','" . $fecha . "','" . $hora . "','En_subasta')";
                    $crearestado = $conexion->prepare($sqles);
                    $result = $crearestado->execute();
                } else {
                    //solicitudes q ya estan asoaciadas a una subasta
                    $sqlesu = "UPDATE cmx_log_solicitudvehiculo
									SET estado='En_subasta'
									WHERE id_solictud=" . $servicio;
                    $actuestado = $conexion->prepare($sqlesu);
                    $result = $actuestado->execute();
                }
            }
        }
    }

    //funcion para registrar la subasta
    public function insertar_subasta()
    {
        $_msg_error = "";
        $model = new Conexion;
        $conexion = $model->conectar();
        $fecha = date('Y-m-d');
        $hora = date('H:i:s');
        $user = $_SESSION["usuario"]["nom_usuario"];
        $su_placa = $_POST["su_placa"];
        //$su_servicio=$_POST["su_servicio"];
        $su_fletecot = $_POST["su_fletecot"];
        $su_propuesto = $_POST["su_propuesto"];
        $su_estado = $_POST["su_estado"];
        $su_user = $_POST["su_user"];
        $su_fecha = $_POST["su_fecha"];
        $su_hora = $_POST["su_hora"];
        $su_numsubasta = $_POST["su_numsubasta"];
        $su_final_cargue = $_POST["su_final_cargue"];
        $su_tarifacot = $_POST["su_tarifacot"];
        //dividir fecha y hora de fecha_cargue
        $hora_c = substr($su_final_cargue, 10);
        $fecha_c = substr($su_final_cargue, 0, 10);

        $cant_filas = $_POST["cant_filas"];
        //obtener todas las solicitudes de servicio
        $num_solicitud = $_POST["su_servicio"];

        if (empty($_POST["su_numsubasta"])) {
            //crear subasta
            $sqla = "INSERT INTO cmx_subasta(id,fecha_inicio,hora_inicio,fecha_finaliza,hora_finaliza,estado,usuario,fecha,hora)
					VALUES(null,'" . $fecha . "','" . $hora . "','" . $fecha_c . "','" . $hora_c . "','iniciado','" . $su_user . "','" . $su_fecha . "','" . $su_hora . "')";
            $crearsubasta = $conexion->prepare($sqla);
            $resultm = $crearsubasta->execute();
            if ($resultm) {
                //obtener el número de estudio
                $sql3 = "SELECT MAX(id) AS 'id'
					 FROM cmx_solicitudes_preestudio
					WHERE placa='" . $su_placa . "'";
                $consulta_soli = $conexion->prepare($sql3);
                $consulta_soli->execute();
                $datos_solicitu = $consulta_soli->fetch();
                $id_estudio = $datos_solicitu["id"];
                //obtener el número de la subasta
                $sql4 = "SELECT MAX(id) AS id_subasta FROM cmx_subasta";
                $consulta_sub = $conexion->prepare($sql4);
                $consulta_sub->execute();
                $datos_subasta = $consulta_sub->fetch();
                $id_subast = $datos_subasta["id_subasta"];
                //echo $id_subast;
                //insertar el estado de la subasta
                $sqlb = "INSERT INTO cmx_estado_subasta
				(id,id_subasta,estado,fecha,hora,usuario)
				VALUES(null," . $id_subast . ",'1','" . $fecha . "',
				'" . $hora . "','" . $user . "')";
                $crearestado = $conexion->prepare($sqlb);
                $result = $crearestado->execute();
                //insertar asociación de subasta por cada una de las  solicitudes de servicio

                $numeros = explode(",", $num_solicitud);
                for ($d = 0; $d < $cant_filas; $d++) {
                    if (isset($numeros[$d])) {
                        $su_servicio = $numeros[$d];
                    }
                    $sqlc = "INSERT INTO cmx_subasta_solicitud_servicio
					(id,id_subasta,numer_solservicio,fecha,hora,usuario)
					VALUES(null," . $id_subast . "," . $su_servicio . ",'" . $fecha . "','" . $hora . "','" . $user . "')";
                    //echo $sqlc;
                    $crearsubastas = $conexion->prepare($sqlc);
                    $resultse = $crearsubastas->execute();
                    if ($resultse) {
                        $sqlcc = "SELECT  MAX(id) AS 'id_suba_servi'
						FROM cmx_subasta_solicitud_servicio
						WHERE id_subasta=" . $id_subast;
                        $consulta_subser = $conexion->prepare($sqlcc);
                        $consulta_subser->execute();
                        $datos_subservi = $consulta_subser->fetch();
                        $id_subastservi = $datos_subservi["id_suba_servi"];
                        //insertar asociación de flete- solicitud de servicio
                        $sqld = "INSERT INTO cmx_subasta_flete
							(id,id_suba,num_estudioseguridad,placa,flete_sugerido,
							flete_propuesto,fecha,hora,usuario,id_suba_servicio,tarifa_promedio)
							VALUES(null," . $id_subast . "," . $id_estudio . ",'" . $su_placa . "','" . $su_fletecot . "','" . $su_propuesto . "','" . $fecha . "','" . $hora . "','" . $user . "'," . $id_subastservi . ",'" . $su_tarifacot . "')";

                        $crearsubastaf = $conexion->prepare($sqld);
                        $resultfle = $crearsubastaf->execute();
                        if ($resultfle) {
                            $sqlcc = "SELECT  MAX(id) AS 'id_suba_flete'
							FROM  cmx_subasta_flete
							WHERE id_suba=" . $id_subast . "
							AND num_estudioseguridad=" . $id_estudio;

                            $consultaf = $conexion->prepare($sqlcc);
                            $consultaf->execute();
                            $datos_flete = $consultaf->fetch();
                            $id_subflete = $datos_flete["id_suba_flete"];

                            $sqle = "INSERT INTO cmx_estado_subasta_flete
							(id,id_suba,estado,fecha,hora,usuario,id_suba_flete)
								VALUES(null," . $id_subast . ",'pendiente','" . $fecha . "','" . $hora . "','" . $user . "'," . $id_subflete . ")";

                            $crearsubastaef = $conexion->prepare($sqle);
                            $result = $crearsubastaef->execute();
                        }
                    }
                }
            }
        } else {
            //solo fletes
            $sql3 = "SELECT MAX(id) AS 'id'
					FROM cmx_solicitudes_preestudio
					WHERE placa='" . $su_placa . "'";
            $consulta_soli = $conexion->prepare($sql3);
            $consulta_soli->execute();
            $datos_solicitu = $consulta_soli->fetch();
            $id_estudio = $datos_solicitu["id"];
            //insertar asociación de subasta por cada una de las  solicitudes de servicio
            $numeros = explode(",", $num_solicitud);
            for ($d = 0; $d < $cant_filas; $d++) {
                if (isset($numeros[$d])) {
                    $su_servicio = $numeros[$d];
                }
                $sqlc = "INSERT INTO cmx_subasta_solicitud_servicio
					(id,id_subasta,numer_solservicio,fecha,hora,usuario)
					VALUES(null," . $su_numsubasta . "," . $su_servicio . ",'" . $fecha . "','" . $hora . "','" . $user . "')";
                //echo $sqlc;
                $crearsubastas = $conexion->prepare($sqlc);
                $result = $crearsubastas->execute();
                if ($result) {
                    $sqlcc = "SELECT  MAX(id) AS 'id_suba_servi'
						FROM cmx_subasta_solicitud_servicio
						WHERE id_subasta=" . $su_numsubasta;
                    $consulta_subser = $conexion->prepare($sqlcc);
                    $consulta_subser->execute();
                    $datos_subservi = $consulta_subser->fetch();
                    $id_subastservi = $datos_subservi["id_suba_servi"];

                    $sqld = "INSERT INTO cmx_subasta_flete
						(id,id_suba,num_estudioseguridad,placa,flete_sugerido,
						flete_propuesto,fecha,hora,usuario,id_suba_servicio,tarifa_promedio)
						VALUES(null," . $su_numsubasta . "," . $id_estudio . ",'" . $su_placa . "','" . $su_fletecot . "','" . $su_propuesto . "','" . $fecha . "','" . $hora . "','" . $user . "'," . $id_subastservi . ",'" . $su_tarifacot . "')";
                    //echo $sqld;
                    $crearsubastaf = $conexion->prepare($sqld);
                    $resultse = $crearsubastaf->execute();
                    if ($resultse) {
                        $sqlcc = "SELECT  MAX(id) AS 'id_suba_flete'
							FROM  cmx_subasta_flete
							WHERE id_suba=" . $su_numsubasta . "  AND num_estudioseguridad=" . $id_estudio;

                        $consulta = $conexion->prepare($sqlcc);
                        $consulta->execute();
                        $datos_flete = $consulta->fetch();
                        $id_subflete = $datos_flete["id_suba_flete"];

                        $sqle = "INSERT INTO cmx_estado_subasta_flete
							(id,id_suba,estado,fecha,hora,usuario,id_suba_flete)
								VALUES(null," . $su_numsubasta . ",'pendiente','" . $fecha . "','" . $hora . "','" . $user . "'," . $id_subflete . ")";

                        $crearsubastaef = $conexion->prepare($sqle);
                        $result = $crearsubastaef->execute();
                    }
                }
            }
        }
    }

    //funciones individuales para la creacion de campos
    public function insertar_camposactualizar_solo()
    {
        $_msg_error = "";
        $model = new Conexion;
        $conexion = $model->conectar();
        $fecha = date('Y-m-d');
        $hora = date('H:i:s');
        $user = $_SESSION["usuario"]["nom_usuario"];
        //DATOS ACTUALIZAR POR SEGURIDAD
        $segu_actu = $_POST["segu_actu"];
        if ($segu_actu == '9') {
            $sqlm = "SELECT max(id) as 'id' FROM cmx_solicitudes_preestudio";
            $consulta_soli = $conexion->prepare($sqlm);
            $consulta_soli->execute();
            $datos_solicitu = $consulta_soli->fetch();
            $id_solicitud = $datos_solicitu["id"];
            $placa = $_POST["placa"];
            $tipohv = $_POST["tipohv"];
            $campo = $_POST["campo"];
            $dato = $_POST["dato"];
            //insertar campos a actualizar
            $sqls = "INSERT INTO cmx_actualiza_seguridad
					(id,id_sol_prees,tipo_hv,tipo_campo,info_campo,fecha, hora, usuario)
				VALUES(null,'$id_solicitud','$tipohv','$campo','$dato','$fecha','$hora','$user')";
            $insertseg = $conexion->prepare($sqls);
            $result = $insertseg->execute();
        }

        $return["success"] = true;
        // $return["error"] = $_msg_error;
        return $return;
    }

    public function reactivar_estudio()
    {
        $_msg_error = "";
        $model = new Conexion;
        $conexion = $model->conectar();
        $fecha = date('Y-m-d');
        $hora = date('H:i:s');
        $user = $_SESSION["usuario"]["nom_usuario"];

        $placa = $_POST["placa"];
        $npree = $_POST["npree"];
        $nestu = $_POST["nestu"];
        $idco = $_POST["idco"];
        $idve = $_POST["idve"];
        $idtb = $_POST["idtb"];

        //actualizar el estado anterior
        $sql1 = "UPDATE cmx_estudiov_completo
				SET estado_actu=0
				WHERE id=" . $idtb . "  ";
        $update_vc = $conexion->prepare($sql1);
        $result_estado = $update_vc->execute();
        //insertar el nuevo estado
        $sql = "
				INSERT INTO cmx_estudiov_completo
				(id,id_estudio,estado,id_vehiculo,id_conductor,proceso,estado_actu)
				VALUES(null," . $nestu . ",'Pendiente'," . $idve . "," . $idco . ",'Pen_Sol_Rut',1)";
        $insert_vc = $conexion->prepare($sql);
        $result = $insert_vc->execute();

        //crear
        $sqlm = "SELECT max(id) as 'id'
			 FROM cmx_estudiov_completo";
        $consulta_soli = $conexion->prepare($sqlm);
        $consulta_soli->execute();
        $datos_solicitu = $consulta_soli->fetch();
        $id_solicitud = $datos_solicitu["id"];
        if ($consulta_soli) {
            $sql4 = "INSERT cmx_logestudio_com
						(id,id_completo,id_estudio,fecha,hora,usuario,estado)
						VALUES(NULL," . $id_solicitud . "," . $nestu . ",'" . $fecha . "','" . $hora . "','" . $user . "',Actualizar)";

            $insert_vc = $conexion->prepare($sql4);
            $result = $insert_vc->execute();
        }

        $return["success"] = true;
        // $return["error"] = $_msg_error;
        return $return;
    }

    public function reactivar_estudio2()
    {
        $_msg_error = "";
        $model = new Conexion;
        $conexion = $model->conectar();
        $fecha = date('Y-m-d');
        $hora = date('H:i:s');
        $user = $_SESSION["usuario"]["nom_usuario"];

        $placa = $_POST["placa"];
        $npree = $_POST["npree"];
        $estado = $_POST["estado"];
        $idestado = $_POST["idestado"];

        //actualizar el estado anterior
        $sql1 = "UPDATE cmx_solicitudes_estados
				SET estado_actual=0
				WHERE id=" . $idestado . "  ";

        $update_vc = $conexion->prepare($sql1);
        $result_estado = $update_vc->execute();

        //insertar el nuevo estado
        $sql = "
				INSERT INTO cmx_solicitudes_estados
				(id,estado,id_solicitud,fecha,hora,usuario,estado_actual,area)
				VALUES(null,'pendiente_iniciar'," . $npree . ",'" . $fecha . "','" . $hora . "','" . $user . "',1,'operaciones')
				";

        $insert_vc = $conexion->prepare($sql);
        $result = $insert_vc->execute();

        $return["success"] = true;
        // $return["error"] = $_msg_error;
        return $return;
    }

    //funcion para insertar tb respuestas seguridad y solicitud estudio de seguridad
    public function insertar_estadoautomaticos_solo()
    {
        $sql = "SELECT MAX(id) AS ID_ACTUALIZAR FROM cmx_solicitudes_estados
					WHERE id_solicitud=" . $id_solicitud . " ";
        $consulta_estado = $conexion->prepare($sql);
        $consulta_estado->execute();
        $dato_estado = $consulta_estado->fetch();
        $id_actu = $dato_estado["ID_ACTUALIZAR"];
        //echo $sql;
        if ($consulta_estado) {
            //actualizar estado anterior
            $sql2 = "UPDATE  cmx_solicitudes_estados
					SET estado_actual='0'
					WHERE  estado='pendiente' AND id=" . $id_actu . "  ";
            $update_anterior = $conexion->prepare($sql2);
            $result_anterior = $update_anterior->execute();
            //echo $sql2;
            if ($result_anterior) {
                //insertar estado nuevo
                $sql1 = "INSERT INTO cmx_solicitudes_estados
					(id,estado,id_solicitud,fecha,hora,usuario,
					estado_actual,area)
					VALUES(NULL,'aprobado'," . $id_solicitud . ",'" . $fecha . "','" . $hora . "','" . $user . "','1','sistema')";
                $insert_estado = $conexion->prepare($sql1);
                $result_estado = $insert_estado->execute();
                //echo $sql1;
                if ($result_estado) {
                    //consultar el id del ultimo estado registrado
                    $sqli = "SELECT MAX(id) AS ID
						FROM cmx_solicitudes_estados
						WHERE id_solicitud=" . $id_solicitud . " ";
                    $insert_estado = $conexion->prepare($sqli);
                    $insert_estado->execute();
                    $estado = $insert_estado->fetch();
                    $id_sol = $estado["ID"];

                    // echo 'consulta estado de registro'.$sqli;
                    if ($id_sol) {
                        //23, cumple requisitos
                        //insertar observacion de seguridad
                        $sqla = "INSERT INTO cmx_respuestasseguridad_preestudio
						(id,causalidad,observacion,id_estado)VALUES(null,'23','actualizada por sistema'," . $id_sol . ")";
                        $insert_respu = $conexion->prepare($sqla);
                        $result_respu = $insert_respu->execute();
                        //echo $sqla;

                        //actualizar el campo proceso del preestudio
                        $sqlp = "UPDATE cmx_solicitudes_preestudio
							SET proceso='Rea_Sol_PreR'
							WHERE id=" . $id_solicitud . " ";
                        $insert_proceso = $conexion->prepare($sqlp);
                        $result_proceso = $insert_proceso->execute();

                        //echo $sqlp;

                        /*    $sqlac="UPDATE cmx_solicitudes_preestudio
                    SET estado_actual_sol='0'
                    WHERE id=".$id_solicitud."  ";
                    $insert_sp=$conexion->prepare($sqlac);
                    $result_ac=$insert_sp->execute();  */
                    }
                }
            }
        }
        //y aprobación de estudio autómaticamente
        $sqlapro = "
				INSERT INTO cmx_log_solicitudvehiculo2(id, id_solictud,placa,user_log,fecha_asignacion,hora_asignacion,proceso,estado_ruta)VALUES(null," . $id_solicitud . ",'" . $placa . "','" . $user . "','" . $fecha . "','" . $hora . "','Pen_Sol_Seg','Pendiente')";
        $insertsoli = $conexion->prepare($sqlapro);
        $result = $insertsoli->execute();

        $return["success"] = true;
        // $return["error"] = $_msg_error;
        return $return;
    }

    //documentos
    public function insertar_documento_solo()
    {
        $_msg_error = "";
        $model = new Conexion;
        $conexion = $model->conectar();
        $fecha = date('Y-m-d');
        $hora = date('H:i:s');
        $user = $_SESSION["usuario"]["nom_usuario"];
        //DOCUMENTOS A SUBIR
        $Papel = $_POST["Papel"];
        if ($Papel == '6') {
            $sqlm = "SELECT max(id) as 'id' FROM cmx_solicitudes_preestudio";
            $consulta_soli = $conexion->prepare($sqlm);
            $consulta_soli->execute();
            $datos_solicitu = $consulta_soli->fetch();
            $id_solicitud = $datos_solicitu["id"];

            $tipohv_docu = $_POST["tipohv_docu"];
            $ruta = $_POST["ruta"];
            $namearchivo = $_POST["namearchivo"];
            $ruta2 = '../' . $ruta . '/';

            $sqlc = "INSERT INTO cmx_documeto_preestudio (id,id_sol_prees,tipo_hv,ruta,nombre_archivo,fecha,hora,usuario)
			VALUES(null,'$id_solicitud','$tipohv_docu','$ruta','$namearchivo','$fecha','$hora','$user')";
            $crear_solicitud = $conexion->prepare($sqlc);
            $result = $crear_solicitud->execute();

            if (!file_exists($ruta2)) {
                mkdir($ruta2, 0777, true);
            }

            //papeles
            for ($i = 0; $i < count($_FILES); $i++) {
                if (isset($_FILES["papeles" . $i])) {
                    $file = $_FILES["papeles" . $i];
                    $nombre = $file["name"];
                    $tipo = $file["type"];
                    $ruta_provisional = $file["tmp_name"];
                    $carpeta = $ruta2;
                    $src = $carpeta . $nombre;
                    move_uploaded_file($ruta_provisional, $src);
                }
            }
        }
        $return["success"] = true;
        // $return["error"] = $_msg_error;
        return $return;
    }

    //estado_habilitar , inserción automatica en respuesta de seguridad y solicitud de estudio
    public function insertar_habil_solo()
    {
        $_msg_error = "";
        $model = new Conexion;
        $conexion = $model->conectar();
        $fecha = date('Y-m-d');
        $hora = date('H:i:s');
        $user = $_SESSION["usuario"]["nom_usuario"];
        $placa = $_POST["placa"];
        $habilitacion = $_POST["habilitacion"];

        if ($habilitacion == '2') {
            $sqlm = "SELECT max(id) as 'id' FROM cmx_solicitudes_preestudio";
            $consulta_soli = $conexion->prepare($sqlm);
            $consulta_soli->execute();
            $datos_solicitu = $consulta_soli->fetch();
            $id_solicitud = $datos_solicitu["id"];

            $sql = "SELECT MAX(id) AS ID_ACTUALIZAR FROM cmx_solicitudes_estados
					WHERE id_solicitud=" . $id_solicitud . " ";
            $consulta_estado = $conexion->prepare($sql);
            $consulta_estado->execute();
            $dato_estado = $consulta_estado->fetch();
            $id_actu = $dato_estado["ID_ACTUALIZAR"];
            //echo $sql;
            if ($consulta_estado) {
                //actualizar estado anterior
                $sql2 = "UPDATE  cmx_solicitudes_estados
					SET estado_actual='0'
					WHERE  estado='pendiente' AND id=" . $id_actu . "  ";
                $update_anterior = $conexion->prepare($sql2);
                $result_anterior = $update_anterior->execute();
                //echo $sql2;
                if ($result_anterior) {
                    //insertar estado nuevo
                    $sql1 = "INSERT INTO cmx_solicitudes_estados
					(id,estado,id_solicitud,fecha,hora,usuario,
					estado_actual,area)
					VALUES(NULL,'aprobado'," . $id_solicitud . ",'" . $fecha . "','" . $hora . "','" . $user . "','1','sistema')";
                    $insert_estado = $conexion->prepare($sql1);
                    $result_estado = $insert_estado->execute();
                    //echo $sql1;
                    if ($result_estado) {
                        //consultar el id del ultimo estado registrado
                        $sqli = "SELECT MAX(id) AS ID
						FROM cmx_solicitudes_estados
						WHERE id_solicitud=" . $id_solicitud . " ";
                        $insert_estado = $conexion->prepare($sqli);
                        $insert_estado->execute();
                        $estado = $insert_estado->fetch();
                        $id_sol = $estado["ID"];

                        // echo 'consulta estado de registro'.$sqli;
                        if ($id_sol) {
                            //23, cumple requisitos
                            //insertar observacion de seguridad
                            $sqla = "INSERT INTO cmx_respuestasseguridad_preestudio
						(id,causalidad,observacion,id_estado)VALUES(null,'23','actualizada por sistema'," . $id_sol . ")";
                            $insert_respu = $conexion->prepare($sqla);
                            $result_respu = $insert_respu->execute();
                            //echo $sqla;

                            //actualizar el campo proceso del preestudio
                            $sqlp = "UPDATE cmx_solicitudes_preestudio
							SET proceso='Rea_Sol_PreR'
							WHERE id=" . $id_solicitud . " ";
                            $insert_proceso = $conexion->prepare($sqlp);
                            $result_proceso = $insert_proceso->execute();

                            //echo $sqlp;

                            /*    $sqlac="UPDATE cmx_solicitudes_preestudio
                        SET estado_actual_sol='0'
                        WHERE id=".$id_solicitud."  ";
                        $insert_sp=$conexion->prepare($sqlac);
                        $result_ac=$insert_sp->execute();  */
                        }
                    }
                }
            }
            //y aprobación de estudio autómaticamente
            $sqlapro = "
				INSERT INTO cmx_log_solicitudvehiculo2(id, id_solictud,placa,user_log,fecha_asignacion,hora_asignacion,proceso,estado_ruta)VALUES(null," . $id_solicitud . ",'" . $placa . "','" . $user . "','" . $fecha . "','" . $hora . "','Pen_Sol_Seg','Pendiente')";
            $insertsoli = $conexion->prepare($sqlapro);
            $result = $insertsoli->execute();
        }
        $return["success"] = true;
        // $return["error"] = $_msg_error;
        return $return;
    }

    //tabla de filtros
    public function insertar_referencias()
    {
        $_msg_error = "";
        $model = new Conexion;
        $conexion = $model->conectar();
        $ref = $_POST["ref"];

        if ($ref == '2') {
            //consultar el consecutivo
            $id_vehiculo = $_POST["id_vehiculo"];
            $empresa = $_POST["empre"];
            $ingreso = $_POST["ingreso"];
            $retiro = $_POST["retiro"];
            $persona = $_POST["persona"];
            $num = $_POST["num"];
            $cargo = $_POST["cargo"];
            $fecha = date('Y-m-d');
            $hora = date('H:i:s');
            $user = $_SESSION["usuario"]["nom_usuario"];
            $sql_r = "INSERT INTO cmx_referencias_preestudio
						(id,nombre_empresa,fecha_ingreso,fecha_retiro,
						persona_contacto,celular,cargo,consecutivo,fecha,hora,usuario,estado)
						VALUES(null,'$empresa','$ingreso','$retiro','$persona','$num','$cargo',
						'$id_vehiculo','$fecha','$hora','$user','1')";
            // echo $sql_r;
            $crearRpreestudio = $conexion->prepare($sql_r);
            $result = $crearRpreestudio->execute();
        }

        $return["success"] = true;
        // $return["error"] = $_msg_error;
        return $return;
    }

    public function insertar_nueva_solicitud()
    {
        // echo 'entro aca';
        $_msg_error = "";
        $model = new Conexion;
        $conexion = $model->conectar();
        //traer datos del vehiculo actualizar
        $ecab = $_POST["ecab"];
        $id_preestudio2 = $_POST["id_preestudio"];
        $sqlcon = "select numero_actual from cmx_maestro from tipo= SEV";
        $id_preestudioT = $conexion->prepare($sqlcon);
        $id_preestudioT->execute();
        $id_preestudio = $id_preestudioT->fetch();

        if ($ecab == '2') {
            // $id_preestudio=$_POST["id_preestudio"];
            $placa = $_POST["placa"];
            $trailer = $_POST["trailer"];
            $web = $_POST["web"];
            $usuerweb = $_POST["usuerweb"];
            $clave = $_POST["clave"];
            $propi = $_POST["propi"];
            $num_propi = $_POST["num_propi"];
            $tene = $_POST["tene"];
            $num_tene = $_POST["num_tene"];
            $condu = $_POST["condu"];
            $num_condu = $_POST["num_condu"];

            //solicitud insertar
            $solicitud_anterior = $_POST["solicitud_anterior"];
            $fechanew = $_POST["fechanew"];
            $horanew = $_POST["horanew"];
            $user_new = $_POST["user_new"];
            $observacion_new = $_POST["observacion_new"];

            //actualizar datos vehiculo
            $sql1 = "UPDATE cmx_vehiculos_preestudio
								SET placa_trailer='$trailer',
								nombre_propietario='$propi',
								documento_propietario='$num_propi',
								nombre_tenedor='$tene',
								documento_tenedor='$num_tene',
								nombre_conductor='$condu',
								documento_conductor='$num_condu',
								web_satelital='$web',
								usuario_satelital='$usuerweb',
								clave_satelital='$clave'
								WHERE id=$id_preestudio  ";
            // echo $sql1;
            $crearvehi_prees = $conexion->prepare($sql1);
            $result = $crearvehi_prees->execute();
            if ($result) {
                //inactivar solicitud anterior y estado anterior a 0
                $sql_sa = "UPDATE cmx_solicitudes_preestudio
									SET estado_actual_sol='0'
									WHERE id='$solicitud_anterior'
									";
                $update_soli_antes = $conexion->prepare($sql_sa);
                $resultsa = $update_soli_antes->execute();
                if ($resultsa) {
                    //consultar el id del estado actual sin haber registrado el nuevo (estado seguridad)
                    $sqles = "SELECT MAX(id) as 'id' FROM cmx_solicitudes_estados";
                    $consulta_es = $conexion->prepare($sqles);
                    $consulta_es->execute();
                    $datos_es = $consulta_es->fetch();
                    //id estado
                    $id_estado = $datos_es["id"];

                    $sql_ea = "UPDATE cmx_solicitudes_estados
										SET estado_actual='0'
										WHERE  id='$id_estado' ";
                    $update_estado_antes = $conexion->prepare($sql_ea);
                    $resultsa = $update_estado_antes->execute();
                    //Una vez inactivos la solicitud y el estado anterior se procede a registrar la solicitud y el estado nuevo
                    //insertar nueva solicitud + estado
                    $sql2 = "INSERT INTO
								cmx_solicitudes_preestudio(id,id_preestudio,placa,fecha,hora,usuario,observacion,estado_actual_sol)
								VALUES(null,'$id_preestudio','$placa','$fechanew','$horanew','$user_new',
									'$observacion_new','1')";
                    // echo $sql2;
                    $crearsolicitud = $conexion->prepare($sql2);
                    $result2 = $crearsolicitud->execute();
                    if ($result2) {
                        //consultar el id de solicitud e insertar estado
                        $sqlmax = "SELECT MAX(id) as 'id' FROM cmx_solicitudes_preestudio";
                        $consulta_maxid = $conexion->prepare($sqlmax);
                        $consulta_maxid->execute();
                        $datos_solicitud = $consulta_maxid->fetch();
                        //id solicitud mas reciente
                        $id_solilictud = $datos_solicitud["id"];

                        $sql3 = "INSERT INTO cmx_solicitudes_estados(id,estado,id_solicitud,fecha,hora,usuario,estado_actual,area)
								 	VALUES(null,'pendiente',$id_solilictud,'$fechanew','$horanew','$user_new','1','operaciones')";
                        // echo $sql3;
                        $crearestado = $conexion->prepare($sql3);
                        $resulta = $crearestado->execute();
                    } //cierre result2
                } //cierre resultsa
            } //cierre result; actualiza datos del vehiculo
        } //cierre del ecab

        //actualizar referencias
        $refi = $_POST["refi"];
        if ($refi == '3') {
            //actualizar referencias laborales
            $eempresa = $_POST["eempresa"];
            $efingreso = $_POST["efingreso"];
            $efretiro = $_POST["efretiro"];
            $econtacto = $_POST["econtacto"];
            $enumero = $_POST["enumero"];
            $ecargo = $_POST["ecargo"];
            $id_ref = $_POST["id_ref"];
            $fecha = date('Y-m-d');
            $hora = date('H:i:s');
            $user = $_SESSION["usuario"]["nom_usuario"];
            $sql4 = "UPDATE cmx_referencias_preestudio
							SET nombre_empresa='$eempresa',
							fecha_ingreso='$efingreso',
							fecha_retiro='$efretiro',
							persona_contacto='$econtacto',
							celular='$enumero',
							cargo='$ecargo',
							consecutivo='$id_preestudio',
							fecha='$fecha',
							hora='$hora',
							usuario='$user'
							WHERE  id='$id_ref'     ";
            $actualizarreferencia = $conexion->prepare($sql4);
            $result = $actualizarreferencia->execute();
        } //cierre de referencias

        //registrar solicitud de servicio nueva
        $soli = $_POST["soli2"];
        if ($soli == 3) {
            //echo 'entroa  solicitud servicio';
            $sqlm = "SELECT max(id) as 'id' FROM cmx_solicitudes_preestudio";
            $consulta_soli = $conexion->prepare($sqlm);
            $consulta_soli->execute();
            $datos_solicitu = $consulta_soli->fetch();
            $id_solicitud = $datos_solicitu["id"];

            $servicio = $_POST["solicitud"];
            $sqls = "INSERT INTO cmx_preestudio_solicitudes_servicio(id,id_servicio_cliente,id_solicitudpreestudio,fecha,hora,usuario,es)
							VALUES(null,$servicio,$id_solicitud,'$fecha','$hora','$user','1')";
            //echo $sqls;
            $crearservico = $conexion->prepare($sqls);
            $result = $crearservico->execute();
            //if($result){
            $sqles = "INSERT INTO cmx_log_solicitudvehiculo(id,id_solictud,user_log,fecha_asignacion,hora_asignacion,estado)
								VALUES(null,$servicio,'$user','$fecha','$hora','Realizada')";
            //echo $sqles;
            $crearestado = $conexion->prepare($sqles);
            $result = $crearestado->execute();
            //}
        }

        $return["success"] = true;
        // $return["error"] = $_msg_error;
        return $return;
    }

    //actualizar edicion tabla filtros
    public function update_solicitud()
    {
        $_msg_error = "";
        $model = new Conexion;
        $conexion = $model->conectar();
        $s_cab = $_POST["s_cab"];
        $fecha = $_POST["fecha"];
        $hora = $_POST["hora"];
        $usuario = $_POST["usuario"];
        $idsolicitud = $_POST["idsolicitud"];
        if ($s_cab == '2') {

            $x = $_POST["x"];
            $observacion_ope = $_POST["observacion_ope"];
            $sqle = "INSERT INTO cmx_edicion_preestudio(id,edicion,usuario,fecha,hora,id_Solicitud,observacion)
				VALUES(null,'$x','$usuario','$fecha','$hora','$idsolicitud','$observacion_ope')";
            $dato_edicion = $conexion->prepare($sqle);
            $result = $dato_edicion->execute();

            //solicitudes
            $placa = $_POST["placa"];

            if ($_POST["trailer"]) {
                $trailer = $_POST["trailer"];
            } else {
                $trailer = '';
            }
            $preestudi = $_POST["preestudi"];

            //preestudio

            $propi = $_POST["propi"];
            $docu_propi = $_POST["docu_propi"];
            $tenedor = $_POST["tenedor"];
            $docu_tenedor = $_POST["docu_tenedor"];
            $conductor = $_POST["conductor"];
            $docu_condu = $_POST["docu_condu"];
            $web = $_POST["web"];
            $user_web = $_POST["user_web"];
            $user_clave = $_POST["user_clave"];
            //actualizar preestudio vehiculo

            $sql = "UPDATE cmx_vehiculos_preestudio
					SET
					placa_vehiculo='$placa',
					placa_trailer='$trailer',
					nombre_propietario='$propi',
					documento_propietario='$docu_propi',
					nombre_tenedor='$tenedor',
					documento_tenedor='$docu_tenedor',
					nombre_conductor='$conductor',
					documento_conductor='$docu_condu',
					web_satelital='$web',
					usuario_satelital='$user_web',
					clave_satelital='$user_clave'
					WHERE id='$preestudi'  ";
            // echo $sql;
            $crearsolicitud = $conexion->prepare($sql);
            $result = $crearsolicitud->execute();
        }
        //referencias
        $s_ref = $_POST["s_ref"];
        if ($s_ref == '3') {
            $empre = $_POST["empre"];
            $ingreso = $_POST["ingreso"];
            $retiro = $_POST["retiro"];
            $contacto = $_POST["contacto"];
            $telefono = $_POST["telefono"];
            $cargo = $_POST["cargo"];
            $id = $_POST["id"];
            $sql_r = "UPDATE cmx_referencias_preestudio
						SET nombre_empresa='$empre',
						fecha_ingreso='$ingreso',
						fecha_retiro='$retiro',
						persona_contacto='$contacto',
						celular='$telefono',
						cargo='$cargo'
						WHERE id=$id  ";
            $updater = $conexion->prepare($sql_r);
            $result = $updater->execute();
        }

        //documentos
        $s_docu = $_POST["s_docu"];
        if ($s_docu == '8') {

            if (isset($_POST["rutad"])) { //traer la ruta que se le aplicará el cambio
                $rutad = '../' . $_POST["rutad"];
            }

            if (isset($_POST["soli_prees"])) {
                $soli_prees = $_POST["soli_prees"];
            }

            if (isset($_POST["id_docu"])) {
                $id_docu = $_POST["id_docu"];
            }

            if (isset($_POST["name_documento"])) {
                $name_documento = $_POST["name_documento"];
            }

            if (file_exists($rutad) && $name_documento != '') {
                //$carpru=$_POST["rutad"];
                $carpru = $rutad . '/';

                $aleatorio1 = rand(10000, 90000);
                $aleatorio2 = rand(10000, 90000);
                $ndocu = $aleatorio1 . $name_documento . $aleatorio2;

                $sql = "UPDATE cmx_documeto_preestudio
					SET nombre_archivo='" . $ndocu . "'
					WHERE id=" . $id_docu . "
					AND id_sol_prees=" . $soli_prees . "
					";
                $editlab1 = $conexion->prepare($sql);
                $result = $editlab1->execute();

                //mover el archivo
                for ($a = 0; $a < count($_FILES); $a++) {
                    if (isset($_FILES["papel" . $a])) {
                        $file = $_FILES["papel" . $a];
                        $nombre = $aleatorio1 . $file["name"] . $aleatorio2;
                        $tipo = $file["type"];
                        $ruta_provisional = $file["tmp_name"];
                        $carpeta = $carpru;
                        $src = $carpeta . $nombre;
                        move_uploaded_file($ruta_provisional, $src);
                    }
                }
            }
        }

        $return["success"] = true;
        // $return["error"] = $_msg_error;
        return $return;
    }

    //update del modal
    public function update_sol()
    {
        $_msg_error = "";
        $model = new Conexion;
        $conexion = $model->conectar();
        //traer variables
        $id_preestudio = $_POST["id_preestudio"];
        $cab = $_POST["cab"];
        if ($cab == '2') {
            $placa = $_POST["placa"];
            if ($_POST["trailer"]) {
                $trailer = $_POST["trailer"];
            } else {
                $trailer = '';
            }

            $web = $_POST["web"];
            $usuerweb = $_POST["usuerweb"];
            $clave = $_POST["clave"];
            $propi = $_POST["propi"];
            $num_propi = $_POST["num_propi"];
            $tene = $_POST["tene"];
            $num_tene = $_POST["num_tene"];
            $condu = $_POST["condu"];
            $num_condu = $_POST["num_condu"];
            $id_solicitud = $_POST["id_solicitud"];
            $cliente = $_POST["cliente"];
            $fecha = $_POST["fecha"];
            $hora = $_POST["hora"];
            $usuario = $_POST["usuario"];

            if ($_POST["observacion"]) {
                $observacion = $_POST["observacion"];
            } else {
                $observacion = '';
            }

            //hacer update de preestudio
            $sql = "UPDATE cmx_vehiculos_preestudio
				SET placa_vehiculo='$placa',
					placa_trailer='$trailer',
					nombre_propietario='$propi',
					documento_propietario='$num_propi',
					nombre_tenedor='$tene',
					documento_tenedor='$num_tene',
					nombre_conductor='$condu',
					documento_conductor='$num_condu',
					web_satelital='$web',
					usuario_satelital='$usuerweb',
					clave_satelital='$clave',
					fecha='$fecha',
					hora='$hora',
					usuario='$usuario'
				WHERE id=$id_preestudio";
            // echo $sql;
            $crearsolicitud = $conexion->prepare($sql);
            $result2 = $crearsolicitud->execute();

            //hacer update de solictud
            // if($result2){
            $sql2 = "UPDATE cmx_solicitudes_preestudio
						SET cliente='$cliente',
						observacion='$observacion'
						WHERE id=$id_solicitud";
            // echo $sql2;
            $crearsoli = $conexion->prepare($sql2);
            $result = $crearsoli->execute();
            // }
        }

        //referencias
        $ref = $_POST["ref"];
        if ($ref == '3') {
            $empresa = $_POST["edit_empre"];
            $ingreso = $_POST["edit_ingreso"];
            $retiro = $_POST["edit_retiro"];
            $persona = $_POST["edit_contacto"];
            $telefono = $_POST["edit_telefono"];
            $cargo = $_POST["edit_cargo"];
            $id = $_POST["edit_id"];
            $sqla = "UPDATE cmx_referencias_preestudio
						SET nombre_empresa='$empresa',
						fecha_ingreso='$ingreso',
						fecha_retiro='$retiro',
						persona_contacto='$persona',
						celular='$telefono',
						cargo='$cargo'
						WHERE id='$id'        ";
            // echo $sqla;
            $actualice_referencia = $conexion->prepare($sqla);
            $result = $actualice_referencia->execute();
        }
        $return["success"] = true;
        // $return["error"] = $_msg_error;
        return $return;
    }

    //Registrar mas referencias a una solicitud
    public function insertar_mas_referencias()
    {
        $_msg_error = "";
        $model = new Conexion;
        $conexion = $model->conectar();
        $empresa = $_POST["empresa"];
        $fingreso = $_POST["fingreso"];
        $fretiro = $_POST["fretiro"];
        $contacto = $_POST["contacto"];
        $telefono = $_POST["telefono"];
        $cargo = $_POST["cargo"];
        $idsolicitud = $_POST["idpreestudio"];
        $fecha = date('Y-m-d');
        $hora = date('H:i:s');
        $user = $_SESSION["usuario"]["nom_usuario"];

        $sql = "INSERT INTO cmx_referencias_preestudio
				(id,nombre_empresa,fecha_ingreso,fecha_retiro,persona_contacto,celular,cargo,consecutivo,fecha,hora,usuario,estado)
				VALUES(null,'$empresa','$fingreso','$fretiro','$contacto','$telefono','$cargo','$idsolicitud','fecha','$hora','$user','1')
			";
        $insert_referencia = $conexion->prepare($sql);
        $result = $insert_referencia->execute();
        $return["success"] = true;
        // $return["error"] = $_msg_error;
        return $return;
    }

    //cierre de la llave de la clase
}
