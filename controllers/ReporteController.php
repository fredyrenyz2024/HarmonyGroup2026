<?php

use Dompdf\Dompdf;
use Dompdf\Options;

require_once 'libs/dompdf/autoload.inc.php';

class ReporteController
{

  public function generarPDF()
  {
    // 1. Cargar contenido HTML (puedes hacer output buffering)
    ob_start();
    require 'views/torrecontrol/informes_torre_control.phtml';
    $html = ob_get_clean();

    // 2. Configurar Dompdf
    $options = new Options();
    $options->set('isRemoteEnabled', true); // Permitir imágenes externas
    $dompdf = new Dompdf($options);

    // 3. Cargar el HTML
    $dompdf->loadHtml($html);

    // 4. Opcional: configurar tamaño y orientación
    $dompdf->setPaper('A4', 'portrait'); // o 'landscape'

    // 5. Renderizar PDF
    $dompdf->render();

    // 6. Enviar al navegador (o descargar)
    $dompdf->stream("reporte.pdf", ["Attachment" => false]); // false: lo muestra en navegador
  }
}
