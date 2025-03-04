<?php
include("../application/Config.php");
include '../application/Conexion.php';


session_start();
$usuario = $_SESSION["usuario"]["nom_usuario"];
$fecha_sistem=date('Y-m-d');
$hora_sistem=date('H:i:s');

$numcumplido=$_GET['numcumplido'];
$placa=$_GET['placa'];
$poseedor=$_GET['poseedor'];
$docposee=$_GET["docposee"];
$conductor=$_GET["conductor"];
$doccondu=$_GET["doccondu"];
$cel=$_GET["cel"];
$marca=$_GET["marca"];
$modelo=$_GET["modelo"];
$cant_multa=$_GET["cantmulta"];
$manifiesto=$_GET["manifiesto"];
$origen=$_GET["origen"];
$destino=$_GET["destino"];
$novedad=$_GET["novedad"];
$tipodocp=$_GET["tipodocp"];
$pesototal=$_GET["pesototal"];
$volumentotal=$_GET["volumentotal"];



//Construcción del PDF
include('Nuevacarpeta/tcpdf.php');
class MYPDF extends TCPDF{
	public function Header(){
        $fecha=date('Y-m-d');
		$ruta='Nuevacarpeta/examples/images/';
		//LOGOTIPO
		$image_file = $ruta.'logo_nexos3.PNG';
		$this->Image($image_file, 5, 5, 60,'', 'PNG', 'B', '', false, 400, '', false, false, 0, false, false, false);
		//DATOS DE EMPRESA
		$this->SetFont('helvetica','b',10);
		$this->SetXY(120, 8);
		$this->Cell('C', 0, 'TIQUETE DE CUMPLIDO', 0, false, '', 0, '', 0, false, 'M', 'M');
		$this->SetXY(110, 8);
		$this->SetFont('helvetica','',12);
		$this->Cell(50, 12, 'NEXOS CARGO SAS', 0, false,'R');
		$this->SetXY(60, 14);
		$this->SetFont('helvetica','b',8);
		$this->Cell(90, 9, 'Nit 9000062596-8', 0, false,'R');
		$this->SetFont('helvetica','',8);
		$this->Cell(0.2, 20, 'CL 23 N 116 31', 0, false,'R');
		$this->Cell(4, 30, '6017452882 - 3186061986', 0, false,'R');
		
		//NUMERO MANIFISTO
		$this->SetFont('helvetica','',10);
		$this->SetXY(150, 3);
        $this->Cell(0, 15, 'Fecha '.$fecha, 0 ,false,'R');
        $this->Cell(1, 25,("Lugar de Pago:"), 0, false,'R');
        $this->Cell(1, 35, 'Origen: '.$_GET["origen"], 0, false,'R');
        $this->Cell(1, 45, 'Cumplido: '.$_GET['numcumplido'] , 0, false,'R');

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
$pdf->SetFont('helvetica', 'b',20);
$pdf->AddPage('L', 'A4');

$pdf->SetMargins(5, 20, 5);
$pdf->SetHeaderMargin(7);
//$pdf->SetFooterMargin(PDF_MARGIN_FOOTER);
$pdf->Ln(10);
$pdf->SetFont('times', '',9);
 $pdf->SetFontSize(10);

/*$pdf->Cell(0, 14,'<img src="'.$filename.'" />', 0, false, 'R', 0, '', 0, false, 'B','M');*/
//$pdf->Image($filename, 255, 0, 38,'', 'PNG', 'C', '', false, 200, '', false, false, 0, false, false, false);

$tabla2='
	<div class="row">
	<div class="col-md-12">
		<table border="1" cellpading="1">
			<thead>
				<tr class="text-center">
					<th colspan="2" >Poseedor: '.$poseedor.'</th>
					<th  colspan="2" >'.$tipodocp.': '.$docposee.'</th>
					
				</tr>
				<tr>
					<th colspan="2">Conductor: '.$conductor.'</th>
					<th>Cédula:  '.$doccondu.'</th>
                    <th>Teléfono: '.$cel.'</th>
				</tr>
                <tr colspan="4">
                    <th>Placa: '.$placa.'</th>
                    <th>Marca: '.$marca.'</th>
                    <th>Módelo:  '.$modelo.'</th>
                    <th>Remolque: </th>
                </tr>
                <tr>
                    <th>Manifiesto: '.$manifiesto.'</th>
                    <th>Peso: '.$pesototal.'</th>
                    <th colspan="2">Volúmen: '.$volumentotal.'</th>
                </tr>
                <tr>
                    <th>Planilla de puestos control:  NO</th>
                    <th>Multas: '.$cant_multa.'</th>
                    <th colspan="2">Comodato: </th>
                </tr>
			</thead>
		</table>	
		<table border="1" cellpading="1">
			<thead>
				<tr class="text-center" style="text-align:center;">
					<th>Remesa</th>
					<th>Cliente</th>
					<th>Empaque</th>
					<th>Peso</th>
					<th>Vol</th>
					<th>Novedad</th>
					<th>Destino</th>
				</tr>
			</thead>
			<tbody>';

              // for($i=0; $i< $tot_remesas; $i++){
                    try{
                        $Data = new Database2;
                        $sql="SELECT re.id, se.nombre_cliente,
                        de.tipo_empaque, re.cantidad_real_cargada,
                        de.volumen_total, cu.novedad, re.id_destinatario,
                        emp.empaque, des.nombre AS 'destinatario'
                        FROM cmx_cumplido_remesa cr
                        INNER JOIN cmx_cumplido cu
                        ON cr.id_cumplido=cu.id
                        INNER JOIN cmx_remesa re
                        ON cr.id_remesa=re.id
                        INNER JOIN cmx_solicitud_vehiculo2 se
                        ON re.mer_idservicio=se.id
                        INNER JOIN cmx_detalle_mercancia2 de
                        ON se.idpareja_origen_destino=de.id
                        INNER JOIN cmx_para_tipo_empaque emp
                        ON de.tipo_empaque=emp.id
                        INNER JOIN cmx_remitente_destinatario des
                        ON re.id_destinatario=des.id
                        WHERE cr.id_cumplido=".$_GET['numcumplido']."
                        GROUP BY cr.id_remesa";
                        $resultado=$Data->query($sql);  
                        $resultado->setFetchMode(PDO::FETCH_ASSOC);
                        foreach($resultado as $key => $value){

                             $tabla2.='<tr class="text-center" style="text-align:center;">
                                   <td>'.$value["id"].'</td> 
                                   <td>'.$value["nombre_cliente"].'</td>
                                   <td>'.$value["empaque"].'</td>
                                   <td>'.$value["cantidad_real_cargada"].'</td>
                                   <td>'.$value["volumen_total"].'</td>
                                   <td>'.$value["novedad"].'</td>
                                   <td>'.$destino.'</td>
                             </tr>';   

                        }
                    }catch(PDOException $e){
                        $error = $e->getMessage();
                        $this->_db3->rollBack();
                    }
               //}	
$tabla2.='</tbody>
		</table>
        <table  border="1" cellpading="1">
            <thead>
                <tr>
                   <td>Observaciones</td> 
                </tr>
            </thead>
            <tbody>
                <th>'.$novedad.'</th>
            </tbody>
        </table>
	
	';

$pdf->Ln(17);
//$pdf->writeHTML($tabla, false, false, false, false, '');
$pdf->writeHTML($tabla2, false, false, false, false, '');
$pdf->SetFont('times', '',9);



$pdf->Output();
?>