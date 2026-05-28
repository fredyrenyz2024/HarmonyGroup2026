<?php

/**
 * Clase que gestiona la conexión y las peticiones a la API Supply de ControlT.
 * Asume que las credenciales (USER, PASS, ID_USER) están definidas en algún lugar
 * de la configuración de la aplicación (por ejemplo, constantes o un archivo de configuración).
 * NOTA: Reemplaza los valores de las constantes con tus credenciales reales.
 */
class controltController extends Controller
{
    private $_modelo;

    // Propiedad para almacenar el token y su tiempo de expiración para evitar reautentización constante
    private $_tokenData = [];

    // --- CONFIGURACIÓN DE LA CONEXIÓN (Reemplaza estos valores) ---
    // En un entorno real, estas variables deben cargarse desde un archivo de configuración seguro.
    const API_USERNAME = 'NexosGroupC';         // Nombre de usuario para oAuth
    const API_PASSWORD = 'N3x0s25G';         // Contraseña para oAuth
    const API_ID_USER  = '12364';    // ID de usuario para la búsqueda (entero)
    // Vigencia por defecto del token en segundos (24 horas) si la API no devuelve 'expires_in'
    const DEFAULT_TOKEN_LIFETIME = 86400;

    public function __construct()
    {
        parent::__construct();
        // Carga del modelo de novedades, si es necesario.
        $this->_modelo = $this->loadModel('controlt');
    }

    public function index()
    {
        // Método por defecto del controlador. Aquí podrías llamar a la acción principal.
        // Si llamas a searchVehiclesAction sin parámetros POST/GET, usará los valores por defecto.
        $this->searchVehiclesAction();
    }

    /**
     * @brief Obtiene el token de autorización (oAuth) para la API Supply.
     * Implementa caching en memoria (propiedad de clase) para reutilizar el token
     * mientras no expire.
     * @param string $username Nombre de usuario para la autenticación.
     * @param string $password Contraseña del usuario.
     * @return string|null El access_token si la conexión es exitosa, o null en caso de error.
     */
    private function getAuthToken($username, $password)
    {
        // 1. Verificar si el token actual es válido (no ha expirado)
        if (isset($this->_tokenData['token']) && isset($this->_tokenData['expires_at']) && $this->_tokenData['expires_at'] > time()) {
            // El token sigue siendo válido, lo retornamos sin hacer una nueva petición
            return $this->_tokenData['token'];
        }

        // Si el token no existe o ha expirado, procedemos a obtener uno nuevo
        $url = "https://app.controlt.com.co/apipublic/api/login/oauth"; // URL del autenticador
        $data = array(
            'username' => $username, // Nombre del usuario
            'password' => $password  // Contraseña del usuario
        );

        $ch = curl_init();

        // Configuración básica de cURL
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        // Se desactiva la verificación SSL para entornos de prueba, pero DEBE ser TRUE en producción.
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

        // Se envía el contenido como application/x-www-form-urlencoded
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/x-www-form-urlencoded'
        ));

        // Se codifican los datos en formato x-www-form-urlencoded
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));

        $response = curl_exec($ch);
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if (curl_errno($ch)) {
            // Manejo de error de cURL
            error_log('cURL Error (getAuthToken): ' . curl_error($ch));
            curl_close($ch);
            return null;
        }

        curl_close($ch);

        if ($http_code === 200) { // El estado 200 OK indica éxito
            $result = json_decode($response, true);
            $token = $result['access_token'] ?? null;

            if ($token) {
                // 2. Calcular la expiración y almacenar el token
                $expiresIn = $result['expires_in'] ?? self::DEFAULT_TOKEN_LIFETIME;
                $expiresAt = time() + $expiresIn;

                $this->_tokenData = [
                    'token' => $token,
                    'expires_at' => $expiresAt
                ];
            }

            return $token;
        } else {
            // Manejo de error de la API (ej: credenciales incorrectas)
            error_log("API Error (getAuthToken). HTTP Code: $http_code. Response: $response");
            return null;
        }
    }

    /**
     * @brief Consulta el servicio de vehículos (VEHICLES).
     * @param string $token El access_token obtenido de getAuthToken.
     * @param array $searchParams Parámetros de búsqueda (Filter, latitude, longitude, radio, IdUser).
     * @return array|null Un array con la respuesta decodificada o null en caso de error.
     */
    public function searchVehicles($token, $searchParams)
    {
        if (empty($token)) {
            error_log('Token de autorización no proporcionado.');
            return null;
        }

        // URL del método VEHICLES/Search/Vehicles (usando la URL de búsqueda del PDF)
        $url = "https://apisupply.controlt.com.co/api/Search/Vehicles";

        // NOTA: El radio máximo permitido es 1000, aunque el ejemplo del PDF use 6000.
        // Se asegura de que el parámetro radio no exceda el límite documentado.
        if (isset($searchParams['radio']) && $searchParams['radio'] > 10000) {
            $searchParams['radio'] = 10000;
        }

        $ch = curl_init();

        // Configuración de cURL
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        // Headers: Content-Type y Authorization (Bearer Token)
        $headers = array(
            'Content-Type: application/x-www-form-urlencoded',
            'Authorization: Bearer ' . $token
        );

        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        // Se codifican los parámetros en formato x-www-form-urlencoded
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($searchParams));

        $response = curl_exec($ch);
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if (curl_errno($ch)) {
            // Manejo de error de cURL
            error_log('cURL Error (searchVehicles): ' . curl_error($ch));
            curl_close($ch);
            return null;
        }

        curl_close($ch);

        if ($http_code === 200) { // El estado 200 OK indica éxito
            // La respuesta se entrega en formato JSON.
            return json_decode($response, true);
        } else {
            // Manejo de error de la API
            error_log("API Error (searchVehicles). HTTP Code: $http_code. Response: $response");
            return null;
        }
    }

    /**
     * @brief Acción principal que ejecuta el flujo completo de obtención de token
     * y búsqueda de vehículos, y presenta los resultados.
     */
    public function searchVehiclesAction()
    {
        // 🛑 AUMENTAR EL LÍMITE DE TIEMPO DE EJECUCIÓN A 60 SEGUNDOS
        // Esto previene que las llamadas a getAuthToken() o searchVehicles() excedan los 30s predeterminados.
        set_time_limit(60);

        // Obtener latitud y longitud desde la solicitud. 
        // FILTER_VALIDATE_FLOAT sigue siendo válido.
        $latitude = filter_input(INPUT_POST, 'latitude', FILTER_VALIDATE_FLOAT) ?: 4.6149;
        $longitude = filter_input(INPUT_POST, 'longitude', FILTER_VALIDATE_FLOAT) ?: -74.0694;
        $clienteid = filter_input(INPUT_POST, 'clienteid', FILTER_VALIDATE_INT) ?: -74.0694;
        $destinoid = filter_input(INPUT_POST, 'destinoid', FILTER_SANITIZE_SPECIAL_CHARS) ?: -74.0694;

        // 🛑 NUEVO: Obtener el filtro 'Filter' enviado desde JS (Usamos Sanitize String si no es una entrada crítica)
        // Para JSON (Filter), el filtro seguro es FILTER_DEFAULT para luego decodificar.
        $filterJson = filter_input(INPUT_POST, 'Filter', FILTER_DEFAULT);

        // 1. Definición de parámetros de búsqueda.
        $vehicleParams = [
            'latitude' => (string)$latitude,
            'longitude' => (string)$longitude,
            'radio' => '10000', // Máximo permitido
            'IdUser' => self::API_ID_USER
        ];

        // 🛑 AÑADIR FILTROS DINÁMICOS si existen y son válidos
        if (!empty($filterJson)) {
            $vehicleParams['Filter'] = $filterJson;
        }

        // El método getAuthToken maneja el caching interno.
        $token = $this->getAuthToken(self::API_USERNAME, self::API_PASSWORD);

        header('Content-Type: application/json');

        if ($token) {
            // 2. Realizar la búsqueda de Vehículos
            $vehicles = $this->searchVehicles($token, $vehicleParams);

            // 🛑 INICIALIZAR EL MAPA DE VIAJES
            $viajesPorPlaca = [];
            $viajesPorDestino = [];
            $viajesPorCliente = [];
            $NumConductor = [];
            $dataVehicles = $vehicles ?? [];
            $NumCelularConductor = [];

            // 🛑 ITERAR SOBRE LOS DATOS PARA AÑADIR EL CONTEO DE VIAJES
            foreach ($dataVehicles as $key => $value) {
                $placa = $value['vehicle']['licence_plate'];

                // Llamada al modelo para obtener el total de manifiestos para esta placa
                $totalViajes = $this->_modelo->CantidadManifiestos($placa, $clienteid, $destinoid);

                $celulares= $this->_modelo->GetCelularConductor($placa);
                $NumCelularConductor[$placa] = $celulares['celulares'] ?? 0;

                // Almacenar el resultado en el array de mapeo (Placa => Total)
                $viajesPorPlaca[$placa] = $totalViajes['general']['Manifiestos'] ?? 0;
                $NumConductor[$placa] = $totalViajes['general']['numdoc_nexos'] ?? 0;
                $viajesPorDestino[$placa] = $totalViajes['por_destino']['Cantidad_Viajes_Destino'] ?? 0;
                $viajesPorCliente[$placa] = $totalViajes['por_cliente']['Cantidad_Viajes_Cliente'] ?? 0;

                // Opcional: Adjuntar el total directamente al array de vehículos si la estructura lo permite
                // $vehicles['data'][$key]['total_viajes'] = $totalViajes['Manifiestos'] ?? 0;
            }

            // 🛑 COMPROBACIÓN DE RESULTADOS (NULL, VACÍO O CON DATOS)
            // if (empty($vehicles) || empty($vehicles['data'])) {
            if (empty($vehicles) || (isset($vehicles['data']) && empty($vehicles['data']))) {
                // Si la búsqueda es exitosa pero la data está vacía
                echo json_encode([
                    'success' => false,
                    'message' => 'Vehículos no encontrados en este radio.',
                    'data' => [],
                    'Viajes' => $viajesPorPlaca, // Aunque vacío, devolvemos el mapa de viajes
                    'Codigo' => $NumConductor, // Aunque vacío, devolvemos el mapa de viajes
                ]);
            } elseif ($vehicles) {
                // Éxito: Devolver los datos de los vehículos y el array de conteo de viajes
                echo json_encode([
                    'success' => true,
                    'data' => $vehicles,
                    'Viajes' => $viajesPorPlaca, // 🛑 ENVIAMOS EL MAPA COMPLETO
                    'Codigo' => $NumConductor, // 🛑 ENVIAMOS EL MAPA COMPLETO
                    'Destino' => $viajesPorDestino, // 🛑 ENVIAMOS EL MAPA COMPLETO
                    'Cliente' => $viajesPorCliente, // 🛑 ENVIAMOS EL MAPA COMPLETO
                    'Celulares' => $NumCelularConductor, // 🛑 ENVIAMOS EL MAPA COMPLETO
                ]);
            } else {
                // Error en la búsqueda de vehículos (fallo de API/cURL)
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Error al consultar el servicio de vehículos.']);
            }
        } else {
            // Error en la obtención del token
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Error de autenticación. Credenciales inválidas o token expirado.']);
        }
    }

    /**
     * Obtiene el detalle de manifiestos y remesas para una placa específica.
     */
    public function getManifiestosByPlaca()
    {
        // Usamos INPUT_POST ya que el JS envía formData (aunque con URLSearchParams)
        $placa = filter_input(INPUT_POST, 'placa', FILTER_SANITIZE_SPECIAL_CHARS);

        if (empty($placa)) {
            header('Content-Type: application/json');
            echo json_encode(['status' => false, 'message' => 'Placa no proporcionada.']);
            exit;
        }

        // 🛑 LLAMADA AL MODELO 🛑
        $data = $this->_modelo->DetalleViajesPlaca($placa); // Asumo que el modelo está cargado

        header('Content-Type: application/json');
        echo json_encode(['status' => true, 'data' => $data]);
        exit;
    }
}
