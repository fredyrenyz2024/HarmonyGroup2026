<?php
include("../application/Config.php");

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