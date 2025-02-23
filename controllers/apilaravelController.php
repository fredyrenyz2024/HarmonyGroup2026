<?php
session_start();
class apilaravelController extends Controller
{

    public function __construct()
    {
        parent::__construct();
    }

    public function index()
    {
        $datos = array(
            "cliente_id" => $_SESSION["usuario"]["id_cliente"],
            "cliente_nombre" => $_SESSION["usuario"]["nombre_cliente"],
            "usuario_id" => $_SESSION["usuario"]["id_usuario"],
            "perfil_id" => $_SESSION["usuario"]["id_perfil"],
        );
        // Convertir los datos a formato JSON
        $datos_json = json_encode($datos);
        // URL del endpoint de la API Laravel
        $url_api = 'http://127.0.0.1:8000/api/session';

        // Configuración de la solicitud cURL
        $ch = curl_init($url_api);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $datos_json);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));

        // Realizar la solicitud cURL
        $resultado = curl_exec($ch);

        // Verificar errores
        if (curl_errno($ch)) {
            echo 'Error en la solicitud cURL: ' . curl_error($ch);
        }

        // Cerrar la sesión cURL
        curl_close($ch);

        // Manejar la respuesta de la API
        // echo $resultado;
        // Redirigir a una nueva ruta después de enviar los datos
        header('Location: http://127.0.0.1:8000/api/session');
        exit;
    }


    public function login_dash()
    {
        // $cliente = $_POST['cliente_id'];
        // var_dump($cliente);
        // $datos = [
        //     "cliente_id" => $_POST['cliente_id'],
        //     "cliente_nombre" => $_SESSION["usuario"]["nombre_cliente"],
        //     "usuario_id" => $_SESSION["usuario"]["id_usuario"],
        //     "perfil_id" => $_SESSION["usuario"]["id_perfil"],
        // ];
        // // Convertir los datos a formato JSON
        // $datos_json = json_encode($datos);

        // $token = '123456789';
        // $url = 'http://127.0.0.1:8000/api/user';

        // $ch = curl_init($url);

        // curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        // curl_setopt($ch, CURLOPT_HTTPHEADER, [
        //     'Authorization: Bearer ' . $token,
        // ]);

        // $response = curl_exec($ch);
        // curl_close($ch);

        // echo $response;

        $email = '1102882008';
        $password = 'lucas123456';
        $url = 'http://127.0.0.1:8000/api/login_api';

        $data = [
            'email' => $email,
            'password' => $password,
        ];

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/x-www-form-urlencoded',
        ]);

        $response = curl_exec($ch);
        curl_close($ch);

        var_dump($response);
        exit();

        $responseData = json_decode($response, true);

        if (isset($responseData['redirect_url'])) {
            header('Location: ' . $responseData['redirect_url']);
            exit;
        } else {
            echo 'Login failed or no redirect URL provided.';
        }
    }
}
