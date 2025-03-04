<?php
include("../application/Config.php");
include '../application/Conexion.php';


session_start();
$usuario = $_SESSION["usuario"]["nom_usuario"];
$fecha_sistem = date('Y-m-d');
$hora_sistem = date('H:i:s');

$numcumplido = $_GET['numcumplido'];
$placa = $_GET['placa'];
$poseedor = $_GET['poseedor'];
$docposee = $_GET["docposee"];
$conductor = $_GET["conductor"];
$doccondu = $_GET["doccondu"];
$cel = $_GET["cel"];
$marca = $_GET["marca"];
$modelo = $_GET["modelo"];
$cant_multa = $_GET["cantmulta"];
$manifiesto = $_GET["manifiesto"];
$origen = $_GET["origen"];
$destino = $_GET["destino"];
$novedad = $_GET["novedad"];
$tipodocp = $_GET["tipodocp"];
$pesototal = $_GET["pesototal"];
$volumentotal = $_GET["volumentotal"];
$fecha_pago = $_GET["fecha_pago"];

//Construcción del PDF
include('Nuevacarpeta/tcpdf.php');
class MYPDF extends TCPDF
{
    public function Header()
    {
        // $fecha = date('Y-m-d');
        // $ruta = 'Nuevacarpeta/examples/images/';
        // //LOGOTIPO
        // // $image_file = $ruta . 'logo_nexos3.PNG';
        // $image_file = $ruta . 'logo-xx.png';
        // $this->Image($image_file, 5, 5, 60, '', 'PNG', 'B', '', false, 400, '', false, false, 0, false, false, false);
        // //DATOS DE EMPRESA
        // $this->SetFont('helvetica', 'b', 10);
        // $this->SetXY(120, 8);
        // //$this->Cell('C', 0, 'TIQUETE DE CUMPLIDO', 0, false, '', 0, '', 0, false, 'M', 'M');
        // $this->Cell(50, 0, 'TIQUETE DE CUMPLIDO', 0, false, '', 0, '', 0, false, 'M', 'M');
        // $this->SetXY(110, 8);
        // $this->SetFont('helvetica', '', 12);
        // $this->Cell(50, 12, 'NEXOS CARGO SAS', 0, false, 'R');
        // $this->SetXY(60, 14);
        // $this->SetFont('helvetica', 'b', 8);
        // $this->Cell(90, 9, 'Nit 9000062596-8', 0, false, 'R');
        // $this->SetFont('helvetica', '', 8);
        // $this->Cell(0.2, 20, 'CL 23 N 116 31', 0, false, 'R');
        // $this->Cell(4, 30, '6017452882 - 3186061986', 0, false, 'R');

        // //NUMERO MANIFISTO
        // $this->SetFont('helvetica', '', 10);
        // $this->SetXY(150, 3);
        // $this->Cell(0, 15, 'Fecha ' . $fecha, 0, false, 'R');
        // $this->Cell(1, 25, ("Lugar de Pago:"), 0, false, 'R');
        // $this->Cell(1, 35, 'Origen: ' . $_GET["origen"], 0, false, 'R');
        // $this->Cell(1, 45, 'Cumplido: ' . $_GET['numcumplido'], 0, false, 'R');

        //QR  = $filename
    }
}
//instanciar la clase
$pdf = new MYPDF('P', 'mm', 'A4', true, 'UTF-8', false);
$pdf->SetCreator(PDF_CREATOR);
$pdf->SetAuthor('Nexos Cargo');
$pdf->SetTitle('Cumplido');
$pdf->SetSubject('TCPDF Tutorial');
$pdf->SetKeywords('TCPDF, PDF, example, test, guide');
$pdf->SetFont('helvetica', 'b', 20);
$pdf->AddPage('p', 'A4');

$pdf->SetMargins(5, 20, 5);
$pdf->SetHeaderMargin(7);
//$pdf->SetFooterMargin(PDF_MARGIN_FOOTER);
$pdf->Ln(-20);
$pdf->SetFont('times', '', 9);
$pdf->SetFontSize(10);

/*$pdf->Cell(0, 14,'<img src="'.$filename.'" />', 0, false, 'R', 0, '', 0, false, 'B','M');*/
//$pdf->Image($filename, 255, 0, 38,'', 'PNG', 'C', '', false, 200, '', false, false, 0, false, false, false); style="text-align:center;"
//Tabla datos del cliente
$ruta = 'Nuevacarpeta/examples/images/';

$image_file = $ruta . 'logonexos.png';
$image_files = $ruta . 'logos.png';
$tabla2 = '
        <table style="margin-bottom: 20px;">
            <tr>
                <td><img src="' . $image_file . '" alt="" width="135"></td>
                <td>
                    <table>
                        <tr>
                            <th  style="font-family: Arial, Helvetica, sans-serif;font-size:11px;font-weight: bold;text-align:center;">TIQUETE DE CUMPLIDO</th>
                        </tr>
                        <tr>
                            <th  style="font-family: Arial, Helvetica, sans-serif;font-size:7px;font-weight: bold;text-align: center;">NEXOS CARGOS SAS</th>
                        </tr>
                        <tr>
                            <td style="font-family: Arial, Helvetica, sans-serif;font-size:7px;text-align: center;">NIT.9000062596-8</td>
                        </tr>
                        <tr>
                            <td style="font-family: Arial, Helvetica, sans-serif;font-size:7px;text-align: center;">CL 23 116 31</td>
                        </tr>
                        <tr>
                            <td style="font-family: Arial, Helvetica, sans-serif;font-size:7px;font-weight: bold;text-align: center;">Tel. 7452882</td>
                        </tr>
                    </table>
                </td>
                <td>
                    <table style="border: 0.7px solid #000000;">
                        <tr>
                            <td style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;font-weight: 900;text-align:center;"><b>FECHA</b></td>
                            <td style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;font-weight: 900;">' . date("Y-m-d") . '</td>
                        </tr>
                        <tr>
                            <td style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;font-weight: 900;text-align:center;"><b>LUGAR DE PAGO</b></td>
                            <td style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;font-weight: 900;">BOGOTA</td>
                        </tr>
                        <tr>
                            <td style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;font-weight: 900;text-align:center;"><b>FECHA DE PAGO</b></td>
                            <td style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;font-weight: 900;">' . $fecha_pago . '</td>
                        </tr>
                        <tr>
                            <td style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;font-weight: 900;text-align:center;"><b>ORIGEN</b></td>
                            <td style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;font-weight: 900;">' . $origen . '</td>
                        </tr>
                    </table>
                </td>
            </tr>
    </table>
    <br>
    <br>
    <table border="1" cellpading="1" style="margin-bottom: 20px;">
        <thead>
            <tr class="text-center">
                <th colspan="2" style="font-family: Arial, Helvetica, sans-serif;font-size:11px;">Poseedor: ' . $poseedor . '</th>
                <th  colspan="2" style="font-family: Arial, Helvetica, sans-serif;font-size:11px;" >' . $tipodocp . ': ' . $docposee . '</th>
            </tr>
            <tr>
                <th colspan="2" style="font-family: Arial, Helvetica, sans-serif;font-size:11px;">Conductor: ' . $conductor . '</th>
                <th style="font-family: Arial, Helvetica, sans-serif;font-size:11px;">Cédula:  ' . $doccondu . '</th>
                <th style="font-family: Arial, Helvetica, sans-serif;font-size:11px;">Teléfono: ' . $cel . '</th>
            </tr>
            <tr colspan="4">
                <th style="font-family: Arial, Helvetica, sans-serif;font-size:11px;">Placa: ' . $placa . '</th>
                <th style="font-family: Arial, Helvetica, sans-serif;font-size:11px;">Marca: ' . $marca . '</th>
                <th style="font-family: Arial, Helvetica, sans-serif;font-size:11px;">Módelo:  ' . $modelo . '</th>
                <th style="font-family: Arial, Helvetica, sans-serif;font-size:11px;">Remolque: </th>
            </tr>
            <tr>
                <th style="font-family: Arial, Helvetica, sans-serif;font-size:11px;">Manifiesto: ' . $manifiesto . '</th>
                <th style="font-family: Arial, Helvetica, sans-serif;font-size:11px;">Peso: ' . $pesototal . '</th>
                <th style="font-family: Arial, Helvetica, sans-serif;font-size:11px;" colspan="2">Volúmen: ' . $volumentotal . '</th>
            </tr>
            <tr>
                <th style="font-family: Arial, Helvetica, sans-serif;font-size:11px;"  colspan="2">Planilla de puestos control:  NO</th>
                <th style="font-family: Arial, Helvetica, sans-serif;font-size:11px;">Multas: ' . $cant_multa . '</th>
                <th style="font-family: Arial, Helvetica, sans-serif;font-size:11px;">Comodato: </th>
            </tr>
        </thead>
    </table>
    <br>
    <br>
    <table cellpading="2">
        <thead>
            <tr class="text-center" style="text-align:center;">
                <th style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:10px;font-weight:bold;">Remesa</th>
                <th style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:10px;font-weight:bold;">Cliente</th>
                <th style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:10px;font-weight:bold;">Empaque</th>
                <th style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:10px;font-weight:bold;">Peso</th>
                <th style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:10px;font-weight:bold;">Vol</th>
                <th style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:10px;font-weight:bold;">Novedad</th>
                <th style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:10px;font-weight:bold;">Destino</th>
            </tr>
        </thead>
        <tbody>';
try {
    $Data = new Database2;
    $sql = "SELECT re.id, se.nombre_cliente,
                            de.tipo_empaque, re.cantidad_real_cargada,
                            de.volumen_total, cu.novedad, re.id_destinatario,
                            emp.empaque,cu.usuario
                            FROM cmx_cumplido_remesa cr
                            INNER JOIN cmx_cumplido cu ON cr.id_cumplido=cu.id
                            INNER JOIN cmx_remesa re ON cr.id_remesa=re.id
                            -- INNER JOIN cmx_solicitud_vehiculo2 se ON re.mer_idservicio=se.id
                            INNER JOIN cmx_solicitud_vehiculo2 se ON re.mer_idservicio=se.nundoc_solicitud
                            INNER JOIN cmx_detalle_mercancia2 de ON se.idpareja_origen_destino=de.id
                            INNER JOIN cmx_para_tipo_empaque emp ON de.tipo_empaque=emp.id
                            -- INNER JOIN cmx_remitente_destinatario des ON re.id_destinatario=des.id
                            WHERE cr.id_cumplido=" . $_GET['numcumplido'] . "
                            GROUP BY cr.id_remesa";
    $resultado = $Data->query($sql);
    $resultado->setFetchMode(PDO::FETCH_ASSOC);
    $usuario_cumplido = '';
    foreach ($resultado as $key => $value) {
        $usuario_cumplido = $value["usuario"];
        $tabla2 .= '<tr style="text-align:center;">
                        <td style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;">' . $value["id"] . '</td> 
                        <td style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;">' . $value["nombre_cliente"] . '</td>
                        <td style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;">' . $value["empaque"] . '</td>
                        <td style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;">' . $value["cantidad_real_cargada"] . '</td>
                        <td style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;">' . $value["volumen_total"] . '</td>
                        <td style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;">' . $value["novedad"] . '</td>
                        <td style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;">' . $destino . '</td>
                    </tr>';
    }
} catch (PDOException $e) {
    $error = $e->getMessage();
    $this->_db3->rollBack();
}

$tabla2 .= '</tbody>
		</table>
        
<table>
    <thead>
        <tr>
            <th style="border: 0.7px solid #000000; font-family: Arial, Helvetica, sans-serif; font-size: 8px; padding: 10px;height:60px;">
                Observaciones: ' . $novedad . '
            </th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="border: 0.7px solid #000000; font-family: Arial, Helvetica, sans-serif; font-size: 8px;height:20px;">
                <strong>Elaborado por:</strong> ' . $usuario_cumplido . '
            </td>
        </tr>
        <tr>
            <td style="border: 0.7px solid #000000; font-family: Arial, Helvetica, sans-serif; font-size: 8px; height:20px;">
                <strong>Recibido:</strong>
            </td>
        </tr>
    </tbody>
</table>';

// Repetir el contenido del contenedor dos veces
for ($i = 0; $i < 2; $i++) {
    $pdf->Ln(25);
    $pdf->writeHTML($tabla2, true, false, true, false, '');
    if ($i < 1) {
        $pdf->writeHTML('<br><br><hr><br><br>', true, false, true, false, ''); // Agregar una nueva página después de la primera repetición
    }
}

//FINAL DEL DOCUMENTO
ob_end_clean();

$pdf->Output('Tiquete de Cumplido.pdf' . date("Y-m-d H:m:s") . "_" . $manifiesto, 'I');
