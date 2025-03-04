<?php
include("../application/Config.php");
// Url para cerrar la session desde el dahsboard clientes
$url = 'http://localhost/mvcLuisMiguel/dashcliente/logout';

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);

// Verificar si la solicitud fue exitosa y manejar la respuesta según sea necesario
if (curl_getinfo($ch, CURLINFO_HTTP_CODE) === 200) {
    // echo "Sesión cerrada exitosamente";
    session_start();
        session_destroy();
        //header('location:'.BASE_URL);
        header('location:'.BASE_URL_CLOSE);
        echo BASE_URL_CLOSE;
        ?>
<html>

<head>
</head>

<body>
  <div id="usuarios">
    <script>
    </script>
    <?php
session_start();
        session_destroy();
        //header(BASE_URL);
        header(BASE_URL_CLOSE);
        ?>
  </div>
</body>

</html>
<?php
} else {
echo "Error al cerrar la sesión";
}

curl_close($ch);
?>