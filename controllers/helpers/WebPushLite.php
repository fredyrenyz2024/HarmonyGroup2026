<?php

class WebPushLite
{
    private $subject;
    private $publicKey;
    private $privateKey;

    public function __construct($subject, $publicKey, $privateKey)
    {
        $this->subject = $subject;
        $this->publicKey = $publicKey;
        $this->privateKey = $privateKey;
    }

    public function send($endpoint, $p256dh, $auth, $payload)
    {
        // SOLO ENVÍA SI endpoint comienza por "https"
        if (strpos($endpoint, 'https') !== 0) return;

        $headers = [
            'TTL: 60',
            'Content-Type: application/json',
            'Content-Encoding: identity', // Simplicidad (sin cifrado real)
        ];

        // Crear JWT VAPID (no usa ECDSA real aquí por simplicidad, ver nota abajo)
        $jwt = $this->createVapidJWT($endpoint);
        $headers[] = 'Authorization: WebPush ' . $jwt;

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $endpoint);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_exec($ch);
        curl_close($ch);
    }

    private function createVapidJWT($endpoint)
    {
        $aud = parse_url($endpoint, PHP_URL_SCHEME) . '://' . parse_url($endpoint, PHP_URL_HOST);

        $header = ['alg' => 'ES256', 'typ' => 'JWT'];
        $claims = [
            'aud' => $aud,
            'exp' => time() + 3600,
            'sub' => $this->subject
        ];

        $encodedHeader = $this->base64url_encode(json_encode($header));
        $encodedClaims = $this->base64url_encode(json_encode($claims));
        $unsignedToken = $encodedHeader . '.' . $encodedClaims;

        // Firma (REQUIERE clave privada en formato PEM EC)
        $pemKey = <<<EOD
-----BEGIN EC PRIVATE KEY-----
TU_CLAVE_PRIVADA_EN_PEM
-----END EC PRIVATE KEY-----
EOD;

        $signature = '';
        $privateKey = openssl_pkey_get_private($pemKey);
        openssl_sign($unsignedToken, $signature, $privateKey, OPENSSL_ALGO_SHA256);
        openssl_free_key($privateKey);

        return $unsignedToken . '.' . $this->base64url_encode($signature);
    }

    private function base64url_encode($data)
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
}
