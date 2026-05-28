<?php
// archivo: /webhook/recibir_whatsapp.php
// $verify_token = "EAAKJcYuBxe0BPCo0LfZCIc6BnZA7o891DuwbIpei8GfeKPZCTG32ZAWHPRJI6pk6UGOJoPinQemJo11DZAy1zxlHNVclZCK8HVweseMKcoSI5ABbsCT3jPHcm7AqeiIoQXXZCHfoxC25NHZAZCD2HrGIbh7pkJkkjlZBepSdpKDmwu1FKbL45T97qgbMofQpNfQMPZAfsCgpEFnZB2Xpf5W3CQ8mO3HqBGMAFAUZCVw2JDwxcDv3DGJgZD"; // el mismo que pondrás en Meta
$verify_token = TOKEN_WHATSAPP; // el mismo que pondrás en Meta

// 1. Verificación inicial desde Meta (GET)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $mode = $_GET['hub_mode'] ?? '';
    $token = $_GET['hub_verify_token'] ?? '';
    $challenge = $_GET['hub_challenge'] ?? '';

    if ($mode === 'subscribe' && $token === $verify_token) {
        echo $challenge;
        exit;
    } else {
        http_response_code(403);
        echo "Token no válido";
        exit;
    }
}

// 2. Conexión a MySQL con PDO
$host = "localhost";
$dbname = "nexosapp_principal";
$user = "root";
$password = "1234567891.123";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    file_put_contents("error_db.log", "Error DB: " . $e->getMessage());
    http_response_code(500);
    exit;
}

// 3. Recibir el JSON desde Meta
$entrada = file_get_contents("php://input");
$datos = json_decode($entrada, true);

// 4. Registrar log bruto
file_put_contents(__DIR__ . "/respuesta.log", json_encode($datos, JSON_PRETTY_PRINT));

// 5. Extraer datos si el mensaje existe
if (isset($datos['entry'][0]['changes'][0]['value']['messages'][0])) {
    $mensaje = $datos['entry'][0]['changes'][0]['value']['messages'][0];
    $telefono = $mensaje['from'];

    // Detectar tipo de mensaje
    if ($mensaje['type'] === 'text') {
        $texto = $mensaje['text']['body'];
    } elseif ($mensaje['type'] === 'button') {
        $texto = $mensaje['button']['payload']; // ej: rechazar_8706_9209
    } else {
        $texto = 'Tipo de mensaje no procesado';
    }

    // Obtener fecha y hora con zona horaria de Bogotá
    $date = new DateTime('now', new DateTimeZone('America/Bogota'));
    $recibido_en = $date->format('Y-m-d H:i:s');

    // 6. Guardar en la base de datos
    try {
        $sql = "INSERT INTO cmx_respuestas_whatsapp (telefono, mensaje, recibido_en) VALUES (:telefono, :mensaje, :recibido_en)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':telefono' => $telefono,
            ':mensaje' => $texto,
            ':recibido_en' => $recibido_en
        ]);
    } catch (PDOException $e) {
        file_put_contents("error_insert.log", "Error insert: " . $e->getMessage());
    }

    // === Separar valores del payload si aplica ===
    if (preg_match('/^([a-z_]+)_(\d+)_(\d+)$/i', $texto, $match)) {
        $accion = $match[1];             // postulado
        $solicitud_id = $match[2];       // 8706
        $conductor_id = $match[3];       // 9209

        // Mapeo de acciones a estados
        $estado_enturnamiento = match ($accion) {
            'postulado' => 'Postulado',
            'rechazar' => 'Rechazado',
            default => null
        };

        if ($estado_enturnamiento) {
            try {
                $sql = "UPDATE cmx_enturnamiento_vehiculo SET estado_enturnamiento = :estado WHERE solicitud_id = :solicitud AND conductor_id = :conductor";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([
                    ':estado' => $estado_enturnamiento,
                    ':solicitud' => $solicitud_id,
                    ':conductor' => $conductor_id
                ]);
            } catch (PDOException $e) {
                file_put_contents("error_update.log", "Error update: " . $e->getMessage());
            }
        }
    }

    // 7. Log adicional opcional
    file_put_contents(__DIR__ . "/respuesta.txt", "Tel: $telefono - Mensaje: $texto - Fecha: $recibido_en\n", FILE_APPEND);
}


// 8. Confirmar recepción a Meta
http_response_code(200);

// // Conexión a tu base de datos
// $host = "localhost";
// $user = "root";
// $password = "1234567891.123";
// $database = "nexosapp_principal"; // <-- cámbialo por el real

// $conn = new mysqli($host, $user, $password, $database);
// if ($conn->connect_error) {
//     file_put_contents("error_db.log", "Error DB: " . $conn->connect_error);
//     http_response_code(500);
//     exit;
// }

// // Recepción de mensajes (POST)
// $entrada = file_get_contents("php://input");
// $datos = json_decode($entrada, true);

// // Log de prueba
// file_put_contents(__DIR__ . "/respuesta.log", json_encode($datos, JSON_PRETTY_PRINT));

// Procesar mensaje si existe
// if (isset($datos['entry'][0]['changes'][0]['value']['messages'][0])) {
//     $mensaje = $datos['entry'][0]['changes'][0]['value']['messages'][0];
//     $telefono = $mensaje['from'];
//     // $texto = $mensaje['text']['body'];
//     $texto = $mensaje['text'];

//     $stmt = $conn->prepare("INSERT INTO cmx_respuestas_whatsapp (telefono, mensaje, recibido_en) VALUES (?, ?,?)");
//     // $stmt->bind_param("ss", $telefono, $texto, date('Y-m-d H:i:s'));
//     $stmt->bind_param("sss", $telefono, $texto, date('Y-m-d H:i:s'));
//     $stmt->execute();
//     $stmt->close();


//     // Aquí puedes guardar en BD o ejecutar lógica
//     file_put_contents(__DIR__ . "/respuesta.txt", "Tel: $telefono - Mensaje: $texto\n", FILE_APPEND);
// }

// if (isset($datos['entry'][0]['changes'][0]['value']['messages'][0])) {
//     $mensaje = $datos['entry'][0]['changes'][0]['value']['messages'][0];
//     $telefono = $mensaje['from'];

//     // Verificar tipo de mensaje: texto o botón
//     if ($mensaje['type'] === 'text') {
//         $texto = $mensaje['text']['body'];
//     } elseif ($mensaje['type'] === 'button') {
//         $texto = $mensaje['button']['payload']; // o ['text'] si prefieres el texto mostrado
//     } else {
//         $texto = 'Tipo de mensaje no procesado';
//     }

//     $stmt = $conn->prepare("INSERT INTO cmx_respuestas_whatsapp (telefono, mensaje, recibido_en) VALUES (?, ?, ?)");
//     $stmt->bind_param("sss", $telefono, $texto, date('Y-m-d H:i:s'));
//     $stmt->execute();
//     $stmt->close();

//     file_put_contents(__DIR__ . "/respuesta.txt", "Tel: $telefono - Mensaje: $texto\n", FILE_APPEND);
// }


// $conn->close();

// http_response_code(200);
