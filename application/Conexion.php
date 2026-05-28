<?php
//include('Controller.php');
//include('../controllers/web_serviceController.php');
ini_set('max_user_connections', 1600);
ini_set('max_connections', 2200);
//ini_set('max_execution_time', 300);

/** Conexion a la base de datos
 *
 */
class Conexion
{
    public function conectar()
    {

        $usuario = DB_USER;
        $clave = DB_PASS;
        $host = DB_HOST;
        $db = DB_NAME;

        $option = "PDO::ATTR_PERSISTENT=>true, PDO::ATTR_ERRMODE=>PDO::ERRMODE_WARNING,PDO::MYSQL_ATTR_INIT_COMMAND=>'SET NAMES'.DB_CHAR";

        return $conexion = new PDO("mysql:host=$host;dbname=$db", $usuario, $clave, array(PDO::ATTR_PERSISTENT => true, PDO::ATTR_ERRMODE => PDO::ERRMODE_WARNING));
    }

    public static function conectar2()
    {

        $usuario = DB_USER;
        $clave = DB_PASS;
        $host = DB_HOST;
        $db = DB_NAME;

        $option = "PDO::ATTR_PERSISTENT=>true, PDO::ATTR_ERRMODE=>PDO::ERRMODE_WARNING,PDO::MYSQL_ATTR_INIT_COMMAND=>'SET NAMES'.DB_CHAR";

        return $conexion = new PDO("mysql:host=$host;dbname=$db", $usuario, $clave, array(PDO::ATTR_PERSISTENT => true, PDO::ATTR_ERRMODE => PDO::ERRMODE_WARNING));
    }

    public function verificar_url($user_log)
    {
        $conexion = $this->conectar();
        $sql = "SELECT * from cmx_usuarios WHERE user_log = '" . $user_log . "'";
        $consulta = $conexion->prepare($sql);
        $consulta->execute();
        $total = $consulta->rowCount();
        if ($total == 0) {
            return false;
        } else {
            $fila = $consulta->fetch();

            $_SESSION['confirm_reset']['reset_pass'] = $fila['reset_pass'];
            $_SESSION['confirm_reset']['user_log'] = $fila['user_log'];
            $_SESSION['confirm_reset']['email'] = $fila['email'];
            return true;
        }
    }
}

class ConectarDb
{
    /**
     * Conexion a la base de datos
     * return conexion
     */

    public static function getConexion()
    {
        $DB_NAME = DB_NAME;
        $DB_HOST = DB_HOST;
        $DB_USER = DB_USER;
        $DB_PASS = DB_PASS;

        $conex = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);

        if (mysqli_connect_errno()):
            return "Connect failed: %s\n" . mysqli_connect_error();
            exit();
        else:
            $conex->query("SET NAMES utf8");
            return $conex;
        endif;

        /* liberar la serie de resultados */
        $conex->free();

        /* cerrar la conexión */
        $conex->close();
    }
}

/**
 * return array de los resultados de una consulta
 * verifica cedula
 * booleano ingreso de usuarios
 */

class Consultas
{
    /**
     * hace una consulta a la base de datos
     *
     * @param string $sql
     * @return array
     */

    // public function getConsulta($sql)
    // {
    //     ini_set('memory_limit', '1024M'); // or you could use 1G
    //     set_time_limit(300); // Increase the maximum execution time to 300 seconds

    //     $conex = ConectarDb::getConexion();

    //     try {
    //         // Perform the query and handle any errors
    //         $result = $conex->query($sql);
    //         if (!$result) {
    //             throw new Exception("Query Error: " . $conex->error);
    //         }

    //         $arrayrows = array();
    //         if ($result->num_rows > 0) {
    //             while ($row = $result->fetch_array(MYSQLI_ASSOC)) { // Fetch associative array
    //                 array_push($arrayrows, $row);
    //             }
    //             // Store the result in an array
    //             $arrayData = array("rowsData" => $arrayrows, "rowsNum" => $result->num_rows);

    //             // Free the result set
    //             $result->free();
    //         } else {
    //             $arrayData = false;
    //         }

    //         // Close the connection
    //         $conex->close();

    //         return $arrayData;
    //     } catch (Exception $e) {
    //         // Handle exceptions and close the connection
    //         if (isset($conex) && $conex->ping()) {
    //             $conex->close();
    //         }
    //         echo "Error: " . $e->getMessage();
    //         return false;
    //     }
    // }

    public function getConsulta($sql)
    {
        ini_set('memory_limit', '1024M');
        set_time_limit(300);

        $conex = ConectarDb::getConexion();

        try {
            $result = $conex->query($sql);

            if ($result === false) {
                throw new Exception("Error en la consulta: " . $conex->error);
            }

            $arrayData = false;

            // Verificar si es un resultado de tipo SELECT
            if ($result instanceof mysqli_result) {
                $num_rows = $result->num_rows;
                $arrayrows = array();

                if ($num_rows > 0) {
                    while ($row = $result->fetch_assoc()) {
                        $arrayrows[] = $row;
                    }
                    $arrayData = array(
                        "rowsData" => $arrayrows,
                        "rowsNum" => $num_rows
                    );
                }
                $result->free();
            } else {
                // Para consultas que no devuelven resultados (INSERT/UPDATE/DELETE)
                $arrayData = array(
                    "affected_rows" => $conex->affected_rows,
                    "insert_id" => $conex->insert_id
                );
            }

            $conex->close();

            return $arrayData;
        } catch (Exception $e) {
            if (isset($conex)) {
                $conex->close();
                // if ($conex->ping()) {}
                // if ($conex->ping()) {
                //     $conex->close();
                // }
            }
            error_log("Error en getConsulta: " . $e->getMessage());
            return false;
        }
    }

    public function getUser($user)
    {
        $conex = ConectarDb::getConexion();
        $sql = "SELECT usuario, password, perfil FROM usuarios WHERE usuario='" . $user . "' LIMIT 1 ";

        $result = $conex->query($sql) or die($conex->error . __LINE__);
        $row = $result->fetch_assoc();

        return $row;

        /* liberar la serie de resultados */
        $conex->free();

        /* cerrar la conexión */
        $conex->close();
    }

    /**
     * hace una consulta a la base de datos para insertar un registro en la db
     *
     * @param array $arrayData
     * @return boolean
     */
    // public function setRegistro($table, $array)
    // {
    //     $conex = ConectarDb::getConexion();
    //     // $conex = Conexion::conectar2();
    //     $campos = '';
    //     $valor = '';

    //     foreach ($array as $key => $value) {
    //         $campos .= "`{$key}`,";
    //         $valor .= "'{$value}',";
    //     }

    //     if ($table == 'cmx_remitente_destinatario') {
    //         $sql = 'INSERT INTO `' . $table . '` (' . substr($campos, 0, -1) . ') VALUES (' . substr($valor, 0, -1) . ')';
    //         $result = $conex->query($sql) or die($conex->error . __LINE__);
    //         return $conex->insert_id;
    //     } else {
    //         $sql = 'INSERT INTO `' . $table . '` (' . substr($campos, 0, -1) . ') VALUES (' . substr($valor, 0, -1) . ')';
    //         $result = $conex->query($sql) or die($conex->error . __LINE__);
    //         return $conex->insert_id;
    //     }
    //     /* liberar la serie de resultados */
    //     // $conex->free();

    //     /* cerrar la conexión */
    //     // $conex->close(); //solo para insertar
    // }

    public function setRegistro($table, $array)
    {
        // Obtenemos la conexión PDO
        $conex = Conexion::conectar2();

        // Extraemos los nombres de los campos del array
        $campos = array_keys($array);
        // Se construye la lista de columnas, escapando los nombres con backticks
        $columns = '`' . implode('`,`', $campos) . '`';
        // Se crean los placeholders para cada campo (ejemplo: :nombre, :email, etc.)
        $placeholders = ':' . implode(', :', $campos);

        // Preparamos la sentencia SQL para la inserción
        $sql = "INSERT INTO `$table` ($columns) VALUES ($placeholders)";
        $stmt = $conex->prepare($sql);

        // Se asocian los valores a cada placeholder
        foreach ($array as $key => $value) {
            $stmt->bindValue(":$key", $value);
        }

        // Se ejecuta la consulta
        if ($stmt->execute()) {
            return $conex->lastInsertId();
        } else {
            // Opcional: Manejo de errores en caso de falla en la ejecución
            $errorInfo = $stmt->errorInfo();
            die("Error en la inserción: " . $errorInfo[2]);
        }
    }


    // public function setRegistro($table, $array)
    // {
    //     try {
    //         $conex = Conexion::conectar2();

    //         // Validar conexión PDO
    //         if (!($conex instanceof PDO)) {
    //             throw new Exception("Error de conexión: No es una instancia PDO válida");
    //         }

    //         // Configurar atributos para lanzar excepciones
    //         $conex->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    //         // Construir la consulta
    //         $campos = implode('`, `', array_keys($array));
    //         $placeholders = ':' . implode(', :', array_keys($array));

    //         $sql = "INSERT INTO `$table` (`$campos`) VALUES ($placeholders)";

    //         // Preparar la consulta
    //         $stmt = $conex->prepare($sql);

    //         // Bind parameters
    //         foreach ($array as $key => $value) {
    //             $type = PDO::PARAM_STR;

    //             // Determinar tipo de dato
    //             if (is_int($value)) {
    //                 $type = PDO::PARAM_INT;
    //             } elseif (is_bool($value)) {
    //                 $type = PDO::PARAM_BOOL;
    //             } elseif (is_null($value)) {
    //                 $type = PDO::PARAM_NULL;
    //             }

    //             $stmt->bindValue(":$key", $value, $type);
    //         }

    //         // Ejecutar consulta
    //         $stmt->execute();

    //         // Obtener último ID insertado
    //         print_r($conex->lastInsertId());
    //         exit();
    //         // return $conex->lastInsertId();

    //     } catch (PDOException $e) {
    //         // Manejar error
    //         error_log("Error PDO: " . $e->getMessage());
    //         throw new Exception("Error al insertar registro: " . $e->getMessage());
    //     } catch (Exception $e) {
    //         error_log("Error General: " . $e->getMessage());
    //         throw $e;
    //     }
    // }

    /**
     * elimina un registro por su id
     *
     * @param int $id
     * @return boolean
     */
    public function setDeleteId($table, $id)
    {

        $conex = ConectarDb::getConexion();
        $clearId = mysqli_real_escape_string($conex, (int) $id);
        $sql = "DELETE FROM " . $table . " WHERE id = {$clearId} LIMIT 1";
        $result = $conex->query($sql) or die($conex->error . __LINE__);

        mysqli_close($conex);

        return true; //solo para eliminar un regristro
    }

    /**
     * update de un registro
     *
     * @param array $arrayData
     * @return boolean
     */
    // public function updateRegistro($table, $array, $id)
    // {
    //     $conex = ConectarDb::getConexion();

    //     $campos = "";
    //     $valores = [];
    //     $tipos = "";

    //     foreach ($array as $key => $value) {
    //         $campos .= "`{$key}` = ?, ";
    //         $valores[] = $value;
    //         $tipos .= is_int($value) ? "i" : "s"; // Detecta tipo de dato
    //     }

    //     $campos = rtrim($campos, ", "); // Elimina la última coma

    //     $sql = "UPDATE `$table` SET $campos WHERE id = ?";

    //     $stmt = $conex->prepare($sql);
    //     if (!$stmt) {
    //         return 0; // Error en la preparación
    //     }

    //     $valores[] = $id; // Agregar ID a los valores
    //     $tipos .= "i"; // ID siempre es un entero

    //     $stmt->bind_param($tipos, ...$valores);

    //     if ($stmt->execute()) {
    //         $stmt->close();
    //         return 1; // Éxito
    //     } else {
    //         $stmt->close();
    //         return 0; // Error en ejecución
    //     }
    // }

    // public function updateRegistro($table, $array, $id)
    // {
    //     // $pdo = ConectarDb::getConexion(); // Asumiendo que retorna instancia PDO
    //     $pdo = Conexion::conectar2();

    //     try {
    //         // Construir SET clause dinámicamente
    //         $set = implode(', ', array_map(fn($k) => "`$k` = ?", array_keys($array)));
    //         // Preparar y ejecutar query
    //         $sql = "UPDATE `$table` SET $set WHERE id = ?";
    //         $stmt = $pdo->prepare($sql);

    //         // Unir valores en orden correcto (campos + id)
    //         $valores = array_values($array);
    //         $valores[] = $id;

    //         // Ejecutar con parámetros
    //         $stmt->execute($valores);

    //         print_r([
    //             'sql' => $sql,
    //             'valores' => $valores
    //         ]);

    //         exit();

    //         return $stmt->rowCount() > 0 ? 1 : 0;
    //     } catch (PDOException $e) {
    //         // Manejo de errores (opcional)
    //         error_log("Error en updateRegistro: " . $e->getMessage());
    //         return 0;
    //     }
    // }


    public function updateRegistro($table, $array, $id)
    {
        $pdo = Conexion::conectar2();

        try {
            // Activar errores PDO si no está activado en la conexión
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Construir la cláusula SET dinámicamente
            $set = implode(', ', array_map(fn($k) => "`$k` = ?", array_keys($array)));

            // Preparar la consulta
            $sql = "UPDATE `$table` SET $set WHERE id = ?";
            $stmt = $pdo->prepare($sql);

            // Combinar valores de los campos con el ID al final
            $valores = array_values($array);
            $valores[] = $id;

            // Ejecutar la consulta
            $stmt->execute($valores);

            // Puedes imprimir si estás depurando (quítalo en producción)
            /*
            print_r([
                'sql' => $sql,
                'valores' => $valores
            ]);
            exit();
            */

            // Consideramos éxito si no hay errores (aunque rowCount() sea 0)
            return 1;
        } catch (PDOException $e) {
            // Log de error
            error_log("Error en updateRegistro: " . $e->getMessage());
            return 0;
        }
    }



    /**
     * borrar,actualizar, registrar registros desde un sql completo
     *
     * @param string $sql
     * @return boolean
     */
    // public function ejecuteRegistro($sql)
    // {
    //     $conex = ConectarDb::getConexion();

    //     // Ejecutar la consulta
    //     if ($conex->query($sql) === TRUE) {
    //         $conex->close(); // Cierra la conexión después de ejecutar
    //         return 1; // Éxito
    //     } else {
    //         error_log("Error en la consulta: " . $conex->error); // Registra el error en logs
    //         $conex->close(); // Cierra la conexión en caso de fallo
    //         return 0; // Falla
    //     }
    // }


    // MODELO / BASE DE DATOS
    // Asumiendo que esta función está en tu clase de manejo de datos ($Data en el ejemplo anterior)
    public function ejecuteRegistro(string $sql): int
    {
        // Obtener la instancia PDO desde tu método estático
        // Asumo que Conexion::conectar2() devuelve la instancia PDO
        $pdo = Conexion::conectar2();

        try {
            // PDO usa exec() para consultas que no devuelven conjuntos de resultados (INSERT, UPDATE, DELETE)
            $filas_afectadas = $pdo->exec($sql);

            // Si no hubo error (exec() lanza una excepción si falla), devolvemos el número de filas afectadas.
            // En el formato original, devuelve 1 (Éxito) si la consulta se ejecutó.
            // Devolver 1 (o el número de filas) es una señal de éxito.
            return $filas_afectadas >= 0 ? 1 : 0;
        } catch (PDOException $e) {
            // En PDO, los errores son manejados mediante excepciones.
            // Si hay un error, lo registramos.
            error_log("Error en ejecuteRegistro (SQL: " . $sql . "): " . $e->getMessage());

            // Devolvemos 0 (Falla)
            return 0;
        }

        // NOTA: Con PDO, la conexión no se cierra después de cada consulta 
        // (a diferencia de mysqli en tu código original) ya que se gestiona la única instancia.
    }

    /****** Funciones de integración con Web Service Min-Transporte ******/
    private function getConectOptions()
    {
        $options = array(
            "uri" => MINTRANS_URL,
            "style" => SOAP_RPC,
            "use" => SOAP_ENCODED,
            "soap_version" => SOAP_1_1,
            "cache_wsdl" => WSDL_CACHE_BOTH,
            "connection_timeout" => 30,
            "trace" => false,
            "encoding" => "UTF-8",
            "exceptions" => false,
        );
        return $options;
    }

    public function getRNDCQueryArray($array)
    {

        if (isset($array["documento"])) {
            $params = array(
                "acceso" => array(
                    "username" => MINTRANS_USER,
                    "password" => MINTRANS_PASS,
                    // "simulacion" => MINTRANS_SIMULACION,
                ),
                "solicitud" => $array["solicitud"],
                "variables" => $array["variables"],
                "documento" => $array["documento"],
            );
        } else {
            $params = array(
                "acceso" => array(
                    "username" => MINTRANS_USER,
                    "password" => MINTRANS_PASS,
                    // "simulacion" => MINTRANS_SIMULACION,
                ),
                "solicitud" => $array["solicitud"],
                "variables" => $array["variables"],
            );
        }

        $xml_content = $this->array2XML($params);
        // print_r($xml_content);

        $xml_content = simplexml_load_string($xml_content);
        if ($xml_content->solicitud->tipo[0] == 1) {
            switch ($xml_content->solicitud->procesoid[0]) {
                case '2': // Caso de creración de Información de viaje
                    if (isset($array["preremesas"])) {
                        $xml_content->variables->addChild('PREREMESAS');
                        $xml_content->variables->PREREMESAS->addAttribute('procesoid', 44);
                        foreach ($array["preremesas"] as $key => $value) {
                            foreach ($value as $key_01 => $value_01) {
                                $xml_content->variables->PREREMESAS->addChild($key_01);
                                foreach ($value_01 as $key_02 => $value_02) {
                                    $xml_content->variables->PREREMESAS->MANPREREMESA[$key]->addChild($key_02, $value_02);
                                }
                            }
                        }
                    }
                    break;

                case '4': // Caso de creración de Manifiestos
                    if (isset($array["remesas"])) {
                        $xml_content->variables->addChild('REMESASMAN');
                        $xml_content->variables->REMESASMAN->addAttribute('procesoid', 43);
                        foreach ($array["remesas"] as $key => $value) {
                            foreach ($value as $key_01 => $value_01) {
                                $xml_content->variables->REMESASMAN->addChild($key_01);
                                foreach ($value_01 as $key_02 => $value_02) {
                                    $xml_content->variables->REMESASMAN->REMESA[$key]->addChild($key_02, $value_02);
                                }
                            }
                        }
                    }
                    break;

                default:
                    $procesoid = "error";
                    break;
            }
        }
        $xml_content = html_entity_decode($xml_content->asXML());
        // print_r($xml_content); // Para ver XML de las variables a enviar a la peticion del Web Service dl Ministerio de Transporte

        // Se envía la petición al Web Service del Min-Transporte
        try {
            $wsdl_request = new SoapClient(MINTRANS_URL, $this->getConectOptions());
            $XMLresult = $wsdl_request->AtenderMensajeBPM($xml_content);
            // print_r($XMLresult); // Para ver el resultado del web service como elemento XML

            if ($XMLresult) {
                // Se pasa la respuesta del Web Service a un array php
                // $xml = simplexml_load_string(utf8_decode($XMLresult));
                $xml = simplexml_load_string(mb_convert_encoding($XMLresult, 'UTF-8', 'ISO-8859-1'));
                $json = json_encode($xml);
                $result = json_decode($json, true);
            } else {
                $result = "Error de conexión";
            }
        } catch (SoapFault $e) {
            $result = $e->getMessage();
        }
        $result["xml"] = $xml_content; // Para ver XML de las variables a enviar a la peticion del Web Service dl Ministerio de Transporte

        return $result;
    }

    private function array2XML($data, $rootNodeName = 'root', $xml = null)
    {
        if ($xml == null) {
            $xml = simplexml_load_string("<?xml version='1.0' encoding='utf-8'?>
<$rootNodeName />");
        }

        foreach ($data as $key => $value) {
            if (is_numeric($key)) {
                $key = "nodeId_" . (string) $key;
            }
            if (is_array($value)) {
                $node = $xml->addChild($key);
                $this->array2XML($value, $rootNodeName, $node);
            } else {
                $value = htmlentities($value);
                $xml->addChild($key, $value);
            }
        }
        return html_entity_decode($xml->asXML());
    }

    public function getRNDCTipoDocumento($tipo_documento)
    {
        switch ($tipo_documento) {
            case 'NIT':
                $RNDCTipoDocumento = "N";
                break;

            case 'Cedula de Ciudadania':
                $RNDCTipoDocumento = "C";
                break;

            case 'Cedula de Extranjeria':
                $RNDCTipoDocumento = "E";
                break;

            default:
                $RNDCTipoDocumento = "error";
                break;
        }
        return $RNDCTipoDocumento;
    }
    /****** Fin - Funciones de integración con Web Service Min-Transporte ******/

    /********* Funciones de integración con avansat - Grupo OET* *******/
    public function Conexion_Oet()
    {
        /*$token = Array{
        "Content-Type" => "application/json",
        "Authorization" => "21b2e5c191e46165607c23cc48779c61e08972d5",
        //token
        "cod_usuari" => "InterfPrueba",
        "nom_usuari" => "InterfPrueba",
        "nom_usuari" => "",
        "cod_perfil" => ""
        };*/
    }

    /********* FIN- Funciones de integración con avansat - Grupo OET* *******/
}

class Database2 extends PDO
{

    public function __construct()
    {
        parent::__construct(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
            DB_USER,
            DB_PASS,
            array(
                PDO::ATTR_PERSISTENT => true,
                PDO::ATTR_ERRMODE => PDO::ERRMODE_WARNING,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET
NAMES " . DB_CHAR
            )
        );
    }
}
