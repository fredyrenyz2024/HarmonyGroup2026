<?php
error_reporting(E_PARSE);
session_start();

//Nombre de usuario de mysql
const USER = "root";
//Servidor de mysql
const SERVER = "localhost";
//Nombre de la base de datos
const BD = "cmx_nexos";
//Contraseña de myqsl
const PASS = "";
//Carpeta donde se almacenaran las copias de seguridad
const BACKUP_PATH = "./backups/";
date_default_timezone_set('America/Bogota');
class copiasModel extends Model
{

    // private $zip;
    public function __construct()
    {
        parent::__construct();
        // $this->zip = new ZipArchive();

    }

    public function Crear_copia_mysql()
    {
        $user = $_SESSION["usuario"]["nom_usuario"];
        $zip = new ZipArchive();
        $day = date("d");
        $mont = date("m");
        $year = date("Y");
        $hora = date("H-i-s");
        $fecha = $day . '_' . $mont . '_' . $year;
        $DataBASE = $fecha . "_(" . $hora . "_hrs).sql";
        $tables = array();
        // $result = SGBD::sql('SHOW TABLES');
        $result = self::sql('SHOW TABLES');
        if ($result) {
            while ($row = mysqli_fetch_row($result)) {
                $tables[] = $row[0];
            }
            $sql = 'SET FOREIGN_KEY_CHECKS=0;' . "\n\n";
            $sql .= 'CREATE DATABASE IF NOT EXISTS ' . BD . ";\n\n";
            $sql .= 'USE ' . BD . ";\n\n";
            foreach ($tables as $table) {
                $result = $this->sql('SELECT * FROM ' . $table);
                if ($result) {
                    $numFields = mysqli_num_fields($result);
                    $sql .= 'DROP TABLE IF EXISTS ' . $table . ';';
                    $row2 = mysqli_fetch_row($this->sql('SHOW CREATE TABLE ' . $table));
                    $sql .= "\n\n" . $row2[1] . ";\n\n";
                    for ($i = 0; $i < $numFields; $i++) {
                        while ($row = mysqli_fetch_row($result)) {
                            $sql .= 'INSERT INTO ' . $table . ' VALUES(';
                            for ($j = 0; $j < $numFields; $j++) {
                                $row[$j] = addslashes($row[$j]);
                                $row[$j] = str_replace("\n", "\\n", $row[$j]);
                                if (isset($row[$j])) {
                                    $sql .= '"' . $row[$j] . '"';
                                } else {
                                    $sql .= '""';
                                }
                                if ($j < ($numFields - 1)) {
                                    $sql .= ',';
                                }
                            }
                            $sql .= ");\n";
                        }
                    }
                    $sql .= "\n\n\n";
                } else {
                    $error = 1;
                }
            }
            if ($error == 1) {
                $response = array(
                    'numero' => 400,
                    'mensaje' => '<strong>Mnesaje!</strong> Ocurrio un error inesperado al crear la copia de seguridad',
                );
            } else {
                $carpeta = './backups/Backup ' . date("Y-m-d") . '/';
                if (!file_exists($carpeta)) {
                    if (mkdir($carpeta, 0777, true)) {
                        chmod(BACKUP_PATH, 0777);
                        $sql .= 'SET FOREIGN_KEY_CHECKS=1;';
                        // $handle = fopen(BACKUP_PATH . $DataBASE, 'w+');
                        $handle1 = fopen($carpeta . $DataBASE, 'w+');
                        // if (fwrite($handle, $sql) && fwrite($handle1, $sql)) {
                        if (fwrite($handle1, $sql)) {
                            // fclose($handle);
                            fclose($handle1);
                            $response = array(
                                'numero' => 200,
                                'mensaje' => '<strong>Mnesaje!</strong> Copia de Seguridad Generada con exito.',
                            );
                        } else {
                            echo 'Ocurrio un error inesperado al crear la copia de seguridad';
                        }
                    }
                } else {
                    chmod(BACKUP_PATH, 0777);
                    $sql .= 'SET FOREIGN_KEY_CHECKS=1;';
                    // $handle = fopen(BACKUP_PATH . $DataBASE, 'w+');
                    $handle1 = fopen($carpeta . $DataBASE, 'w+');
                    $handle2 = fopen($carpeta . $DataBASE, 'w+');
                    // if (fwrite($handle, $sql) && fwrite($handle1, $sql)) {
                    if (fwrite($handle1, $sql)) {
                        // fclose($handle);
                        $estado = 'Estado';
                        $subido = 'no';
                        $date = date("Y-m-d");
                        $documento = fwrite($handle2, $sql);
                        $ruta = $carpeta . $handle2;
                        $sql = $this->_db3->prepare("INSERT INTO cmx_copias_seguridad(Ruta,Usuario,Estado,subida_ondrive,Fecha) VALUES(:Ruta,:Usuario,:Estado,:subida_ondrive,:Fecha)");
                        $sql->bindParam(':Ruta', $ruta);
                        $sql->bindParam(':Usuario', isset($user) ? $user : 'Sistema');
                        $sql->bindParam(':Estado', $estado);
                        $sql->bindParam(':subida_ondrive', $subido);
                        $sql->bindParam(':Fecha', $date);
                        $resultado = $sql->execute();
                        if ($resultado) {
                            fclose($handle1);
                            $response = array(
                                'numero' => 200,
                                'mensaje' => '<strong>Mnesaje!</strong> Copia de Seguridad Generada con exito.',
                            );
                        } else {
                            fclose($handle1);
                            $response = array(
                                'numero' => 400,
                                'mensaje' => '<strong>Mnesaje!</strong> Copia de Seguridad no generada.',
                            );
                        }

                    } else {
                        $response = array(
                            'numero' => 400,
                            'mensaje' => '<strong>Mnesaje!</strong> Ocurrio un error inesperado al crear la copia de seguridad.',
                        );
                        // echo 'Ocurrio un error inesperado al crear la copia de seguridad';
                    }

                }
            }
        } else {
            $response = array(
                'numero' => 400,
                'mensaje' => '<strong>Mnesaje!</strong> Ocurrio un error inesperado.',
            );
        }
        mysqli_free_result($result);
        if ($error == null) {
            return $response;
        }
    }

    public function sql($query)
    {
        $con = mysqli_connect(SERVER, USER, PASS, BD);
        mysqli_set_charset($con, "utf8");
        if (mysqli_connect_errno()) {
            printf("Conexion fallida: %s\n", mysqli_connect_error());
            exit();
        } else {
            mysqli_autocommit($con, false);
            mysqli_begin_transaction($con, MYSQLI_TRANS_START_WITH_CONSISTENT_SNAPSHOT);
            if ($consul = mysqli_query($con, $query)) {
                if (!mysqli_commit($con)) {
                    print("Falló la consignación de la transacción\n");
                    exit();
                }
            } else {
                mysqli_rollback($con);
                echo "Falló la transacción";
                exit();
            }
            return $consul;
        }
    }

    public function Listar_Copias()
    {

        $const = 1;
        $ruta = BACKUP_PATH; // Asegúrate de que BACKUP_PATH esté definida

        if (is_dir($ruta)) {
            $response = array(); // Inicializa el array de respuesta
            if ($aux = opendir($ruta)) {
                while (($archivo = readdir($aux)) !== false) {
                    if ($archivo != "." && $archivo != ".." && pathinfo($archivo, PATHINFO_EXTENSION) == "sql") {
                        $nombrearchivo = str_replace(".sql", "", $archivo);
                        $nombrearchivo = str_replace("-", ":", $nombrearchivo);
                        $ruta_completa = $ruta . '/' . $archivo; // Añade el separador de directorios

                        if (!is_dir($ruta_completa)) {
                            $response[] = array(
                                "const" => $const++,
                                "nombrearchivo" => $nombrearchivo,
                                "ruta" => $ruta_completa,
                            );

                            // $response[] = ' <div class="email-list-item email-list-item--unread">
                            // <div class="email-list-actions">
                            //   <div class="custom-control custom-checkbox">
                            //     <input class="custom-control-input" type="checkbox" id="check2">
                            //     <label class="custom-control-label" for="check2"></label>
                            //   </div><a class="favorite active" href="#"><span class="mdi mdi-star"></span></a>
                            // </div>
                            // <div class="email-list-detail"><span class="date float-right"><i class="icon mdi mdi-attachment-alt"></i>' . $const++ . '</span><span class="from">Penelope Thornton</span>
                            //   <p class="msg">' . $nombrearchivo . '</p>
                            // </div>
                            // </div>';
                        }
                    }
                }
                closedir($aux);
                return $response; // Devuelve la respuesta como JSON
            }
        } else {
            echo $ruta . " No es una ruta válida";
        }

        // $const = 1;
        // $ruta = BACKUP_PATH;
        // if (is_dir($ruta)) {
        //     if ($aux = opendir($ruta)) {
        //         while (($archivo = readdir($aux)) !== false) {
        //             if ($archivo != "." && $archivo != "..") {
        //                 $nombrearchivo = str_replace(".sql", "", $archivo);
        //                 $nombrearchivo = str_replace("-", ":", $nombrearchivo);
        //                 $ruta_completa = $ruta . $archivo;
        //                 if (is_dir($ruta_completa)) {
        //                 } else {

        //                     // echo $const++;
        //                     // echo $nombrearchivo;
        //                     $response = array(
        //                         "const" => $const++,
        //                         "nombrearchivo" => $nombrearchivo,
        //                     );

        //                 }
        //             }
        //         }
        //         closedir($aux);
        //     }
        //     return $response;
        // } else {
        //     echo $ruta . " No es ruta válida";
        // }
        // if (is_dir($ruta)) {
        //     if ($aux = opendir($ruta)) {
        //         while (($archivo = readdir($aux)) !== false) {
        //             if ($archivo != "." && $archivo != "..") {
        //                 $nombrearchivo = str_replace(".sql", "", $archivo);
        //                 $nombrearchivo = str_replace("-", ":", $nombrearchivo);
        //                 $ruta_completa = $ruta . $archivo;
        //                 if (is_dir($ruta_completa)) {
        //                 } else {
        //                     $response = array(
        //                         "const" => $const++,
        //                         "nombrearchivo" => $nombrearchivo,
        //                     );
        //                     return $response;
        //                 }
        //             }
        //         }
        //         closedir($aux);
        //     }
        // }

    }
}
