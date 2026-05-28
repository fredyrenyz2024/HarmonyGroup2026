<?php
$xml = <<<XML
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:BPMServicesIntf-IBPMServices">
    <soapenv:Header/>
    <soapenv:Body>
        <urn:AtenderMensajeRNDC>
            <Request>
                <root>
                    <acceso>
                        <username>NEXOSCAR@1622</username>
                        <password>NexosSAS2024</password>
                    </acceso>
                    <solicitud>
                        <tipo>2</tipo>
                        <procesoid>26</procesoid>
                    </solicitud>
                    <variables>
                    RUTA, NOMBREUNIDADTRANSPORTE, NOMBRETIPOCARGA, NOMBRERUTA, VALOR, VALORTONELADA, VALORHORA, DISTANCIA
                    </variables>
                    <documento>
                        <PERIODO>202412</PERIODO>
                        <CONFIGURACION>3S3</CONFIGURACION>
                        <ORIGEN>11001000</ORIGEN>
                        <DESTINO>5001000</DESTINO>
                    </documento>
                </root>
            </Request>
        </urn:AtenderMensajeRNDC>
    </soapenv:Body>
</soapenv:Envelope>
XML;

// $url = "http://rndcws.mintransporte.gov.co:8080/soap/IBPMServices";
$url = "http://rndcws2.mintransporte.gov.co:8080/ws/svr008w.dll/wsdl/IBPMServices";

$headers = [
  "Content-Type: text/xml; charset=utf-8",
  "SOAPAction: urn:BPMServicesIntf-IBPMServices#AtenderMensajeRNDC",
  "Content-Length: " . strlen($xml)
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_POSTFIELDS, $xml);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);

if (curl_errno($ch)) {
  echo 'Error:' . curl_error($ch);
} else {
  echo $response;
}

curl_close($ch);
