<?php

class helpers
{
    // Limpiar Cadenas contra inyecion sql
    public function limpiar_cadena($cadena)
    {
        $cadena = trim($cadena); // trim elimina los espacios emblanco al final o comienzo de una cadena
        $cadena = stripslashes($cadena); // quita barra invertidas de un strign
        $cadena = str_ireplace("<script>", "", $cadena); // remplaza valores no permitidos en los formularios
        $cadena = str_ireplace("</script>", "", $cadena);
        $cadena = str_ireplace("<script src", "", $cadena);
        $cadena = str_ireplace("<script type=", "", $cadena);
        $cadena = str_ireplace("SELECT * FROM", "", $cadena);
        $cadena = str_ireplace("DELETE FROM", "", $cadena);
        $cadena = str_ireplace("INSERT INTO", "", $cadena);
        $cadena = str_ireplace("--", "", $cadena);
        $cadena = str_ireplace("^", "", $cadena);
        $cadena = str_ireplace("[", "", $cadena);
        $cadena = str_ireplace("]", "", $cadena);
        $cadena = str_ireplace("==", "", $cadena);
        $cadena = str_ireplace(";", "", $cadena);
        return $cadena;
    }

    // funciones encritar y desencirptar contraseñas
    public static function encryption($string)
    {
        $output = FALSE;
        $key = hash('sha256', SECRET_KEY);
        $iv = substr(hash('sha256', SECRET_IV), 0, 16);
        $output = openssl_encrypt($string, METHOD, $key, 0, $iv); // encripta las contraseñas
        $output = base64_encode($output);
        return $output;
    }

    public static function decryption($string)
    {
        $key = hash('sha256', SECRET_KEY);
        $iv = substr(hash('sha256', SECRET_IV), 0, 16);           // Desencriptan la contraseña
        $output = openssl_decrypt(base64_decode($string), METHOD, $key, 0, $iv);
        return $output;
    }
}
