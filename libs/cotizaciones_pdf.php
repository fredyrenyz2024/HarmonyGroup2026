<?php
include("../application/Config.php");
include '../application/Conexion.php';
 // $model = new Conexion;
 // $conexion = $model->conectar();
$Data = new Consultas;
$idcotizar=$_GET["id"];
$nomcliente=$_GET["nom"];
$tipo_merca=$_GET["tmerca"];
$fecha=date('Y-m-d');
$bta='Bogotá';
//Hacer consulta
$sql='
	SELECT m.tipo_servicio_mer, m.origen, m.destino, m.tipo_vehiculo, m.total_tarifa FROM cmx_detalle_mercancia2 AS m
LEFT JOIN cmx_detalle_servespecial2 AS d
ON m.n_cotizacion=d.n_cotizacion
WHERE m.n_cotizacion='.$idcotizar.' ';
$result = $Data->getConsulta($sql);


/**
 * Creates an example PDF TEST document using TCPDF
 * @package com.tecnick.tcpdf
 * @abstract TCPDF - Example: Default Header and Footer
 * @author Nicola Asuni
 * @since 2008-03-04
 */


include('Nuevacarpeta/tcpdf.php');
//imagen
class MYPDF extends TCPDF {

    //Page header
    public function Header() {
        // Logo
        $ruta='Nuevacarpeta/examples/images/';
		$image_file = $ruta.'logonexos.PNG';
        $this->Image($image_file, 100, 15, 30,'', 'PNG', 'C', '', false, 500, '', false, false, 0, false, false, false);
}
}
//instanciar la clase
$pdf = new MYPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
//encabezado
$pdf->SetCreator(PDF_CREATOR);
$pdf->SetAuthor('Nexos Cargo');
$pdf->SetTitle('Cotizacion');
$pdf->SetSubject('TCPDF Tutorial');
$pdf->SetKeywords('TCPDF, PDF, example, test, guide');
//TIPOGRAFIAS Y CONFIGURACIONES DEL CDOCUMENTO
$pdf->SetFont('times', 'BI',9);
// $ruta='Nuevacarpeta/examples/images/';
// $image_file = $ruta.'logonexos.PNG';
// $pdf->SetHeaderData($ruta.'tcpdf_logo.JPG',100,'','N° Cotización:'.$idcotizar);
// set margins
$pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
$pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
$pdf->SetFooterMargin(PDF_MARGIN_FOOTER);
$pdf->AddPage();
$pdf->Ln(10);
$pdf->SetFont('times', 'b',9);
$pdf->Cell(0, 30,'Bogotá D.C.     '.$fecha, 0, false, 'L', 0, '', 0, false, 'M','M');
$pdf->Ln(6);
$pdf->Cell(0, 15,'Señores:    '.$nomcliente, 0, false, 'L', 0, '', 0, false, 'M','M');
$pdf->Ln(6);
$pdf->Cell(0, 15,'Ciudad:     '.$bta.'  D.C.', 0, false, 'L', 0, '', 0, false, 'M','M');
$pdf->Ln(6);
$pdf->Cell(0, 15,'N° cotización:  '.$idcotizar, 0, false, 'L', 0, '', 0, false, 'M','M');
$pdf->Ln(10);
$txt2='Respetados Señores.';
$pdf->writeHTML($txt2, true, false, true, false, '');
$txt='
De acuerdo con nuestra conversación nos permitimos presentarles la oferta de servicios para el transporte de sus mercancías a nivel nacional y local (urbano), en modalidad masiva, semi-masiva, granel en los siguientes trayectos:
';
$pdf->writeHTML($txt, true, false, true, false, '');
$pdf->Ln(10);
$pdf->Cell(0, 15,'Producto:'.$tipo_merca, 0, false, 'L', 0, '', 0, false, 'M','M');
$pdf->Ln(6);
$pdf->Cell(0, 15,'Tipo Regimen:', 0, false, 'L', 0, '', 0, false, 'M','M');
$pdf->Ln(6);
$pdf->Cell(0, 15,'Tipo Empaque:', 0, false, 'L', 0, '', 0, false, 'M','M');
//TABLA VEHICULOS Y TARIFAS
$pdf->Ln(10);
$pdf->Cell(0, 15,'1.  Tarifas en origen:', 0, false, 'L', 0, '', 0, false, 'M','M');
$pdf->Ln(4);


$tabla='
<div class="row">
	<div class="col-md-12">
		<table border="1" cellpading="2">
			<thead>
				<tr>
					<th class="text-center">Origen - Destino</th>
					<th class="text-center">Tipo de Servicio</th>
					<th class="text-center">Tipo de Vehículo</th>
					<th class="text-center">Tarifa</th>
				</tr>
			</thead>';
foreach ( $result["rowsData"] as $key => $value ) {	
			$origen=$value['origen'];
			$destino=$value['destino'];		
//CONSULTAS DEL MUNICIPIO
$sqlo="SELECT  CONCAT(municipio,'-',depto) as 'origenm' 
		FROM cmx_municipios 
		WHERE rndc_codigo_ciudad=".$origen."	";
$result1 = $Data->getConsulta($sqlo);
//municipio de destino
$sqld="SELECT  CONCAT(municipio,'-',depto) as 'destinom' 
		FROM cmx_municipios 
		WHERE rndc_codigo_ciudad=".$destino."	";
$result2 = $Data->getConsulta($sqld);
	$tabla.='<tbody>';		
	foreach ($result1["rowsData"] as $key => $value1) {
		$tabla.='<tr>
				<td class="text-center">'.$value1["origenm"].'<br>';
	}
	foreach ($result2["rowsData"] as $key => $value2) {
		$tabla.=''.$value2["destinom"].'</td>';
	}
$tabla.='<td class="text-center">'.$value["tipo_servicio_mer"].'</td>
				<td class="text-center">'.$value["tipo_vehiculo"].'</td>
				<td class="text-center">'.$value["total_tarifa"].'</td>
			</tr>
		</tbody>';
}
$tabla.='</table>
	</div>
</div>
';

$pdf->writeHTML($tabla, true, false, false, false, '');
$pdf->Ln(3);
//continua
$txt2='
Estas tarifas de fletes Incluyen:
';
$pdf->writeHTML($txt2, true, false, true, false, '');
$pdf->Ln(6);
$txt02='
•	Movilización de carga 24 horas.';
$pdf->writeHTML($txt02, true, false, true, false, '');
$pdf->Ln(6);
$txt03='
•	Transporte en vehículos de no más de 15 años de antigüedad.';
$pdf->writeHTML($txt03, true, false, true, false, '');
$pdf->Ln(6);
$txt04='•	Parqueaderos previamente contratados y designados por la compañía.';
$pdf->writeHTML($txt04, true, false, true, false, '');
$pdf->Ln(6);
$txt05='
•	Plan de trazabilidad de los trayectos. ';
$pdf->writeHTML($txt05, true, false, true, false, '');
$pdf->Ln(6);
$txt06='•	Análisis de hojas de vida de Propietarios de vehículos, conductores';
$pdf->writeHTML($txt06, true, false, true, false, '');
$pdf->Ln(6);
$txt07='Estas tarifas de fletes no incluyen:  Seguros de las mercancías.  ';
$pdf->writeHTML($txt07, true, false, true, false, '');
$pdf->Ln(10);
$pdf->Cell(0, 15,'2.  Seguro de las Mercancías Transportadas:', 0, false, 'L', 0, '', 0, false, 'M','M');
$txt3='a. '.$nomcliente.' debe contar con una póliza de seguros de transporte con cobertura completa, más huelga, asonada, motín, etc., la cual debe ser aplicada en caso de siniestro, en cuyo caso NEXOS CARGO S.A.S., cuenta con una póliza de transportes que (solo actúa en caso de repetición o subrogación) con la Aseguradora LA PREVISORA S.A., la cual tiene un cubrimiento por despacho de máximo $300.000.000.

En este evento, el cliente debe entregar copia de las condiciones y garantías que le exige la póliza con el fin de que NEXOS CARGO S.A.S., dé cumplimiento a tales indicaciones y evitar objeciones en un eventual siniestro.
';
$pdf->writeHTML($txt3, true, false, true, false, '');
$pdf->Ln(10);
$txt4='b. NEXOS CARGO S.A.S., cuenta con una póliza de seguros de mercancías, la cual actúa por despacho e incluye los amparos de pérdida total, falta de entrega, avería particular, asonada, huelgas etc. Su cobertura es de hasta $300.000.000 por despacho, con una extensión hasta $500.000.000. Esta póliza tiene la siguiente tasa:';
$pdf->writeHTML($txt4, true, false, true, false, '');
$pdf->Ln(6);
$pdf->Cell(0, 15,'Tasa:	0.X   % sobre los valores declarados de las mercancías.', 0, false, 'L', 0, '', 0, false, 'M','M');
$pdf->Ln(6);
$pdf->Cell(0, 15,'Deducible de la póliza 10% en cualquiera de las dos opciones anteriores.', 0, false, 'L', 0, '', 0, false, 'M','M');
$pdf->Ln(10);
$pdf->Cell(0, 15,'3.  Escoltas de las mercancías Transportadas..', 0, false, 'L', 0, '', 0, false, 'M','M');

$txt5='NEXOS CARGO S.A.S., hace un acompañamiento y control de seguridad a todas sus mercancías de acuerdo al perfil de las mismas. Las mercancías que superen un monto de valor declarado de $200.000.000 deben tener un escolta punto a punto por condiciones contenidas en nuestra póliza de transporte con la Previsora de Seguros. Este servicio puede ser tomado con nuestra compañía o la que designe el cliente.
';
$pdf->writeHTML($txt5, true, false, true, false, '');
$pdf->Ln(6);
$pdf->Cell(0, 15,'4.  Acuerdo de Seguridad.', 0, false, 'L', 0, '', 0, false, 'M','M');
$pdf->Ln(6);
$pdf->Cell(0, 15,'NEXOS CARGO S.A.S., se compromete con el CLIENTE a:', 0, false, 'L', 0, '', 0, false, 'M','M');
$txt5='a.	Comunicar las políticas de seguridad para el manejo de la información confidencial, manipulación, transporte y distribución de la carga, lo anterior relacionado con el servicio que presta, NEXOS CARGO S.A.S., ya que estamos certificados en el Sistema de Gestión en Control y Seguridad otorgada por el ente BASC (Business Alliance For Segure Commerce) Versión 4 de 2012, certificación que nos permite garantizar a nuestros clientes la idoneidad necesaria para la ejecución de mecanismos en el transporte para el comercio seguro.';
$pdf->writeHTML($txt5, true, false, true, false, '');
$pdf->Ln(4);
$txt6='
b.	Prestar los servicios y realizar las actividades propias de su objeto: transporte y distribución que comprenden un criterio de servicio integral, es decir que incluye: recibo y transporte de la carga, eventual trasbordo, ubicación, cuidado y supervisión del producto o bienes, comunicación oportuna y presentación de documentos para el pago de los fletes (Remesa Terrestre).
';
$pdf->writeHTML($txt6, true, false, true, false, '');
$pdf->Ln(4);
$txt7='
c.	En caso de presentarse algún tipo de contratiempo en la entrega de las mercancías se realizará “Gestión en el Punto de Entrega” la cual consiste en contactar a la persona designada por EL CLIENTE para lograr la respectiva solución en el punto, con el fin de minimizar la situación y obtener la satisfacción por parte del CLIENTE.
';
$pdf->writeHTML($txt7, true, false, true, false, '');
$pdf->Ln(4);
$txt8='d.  Nuestro SERVICIO AL CLIENTE enviará en línea los respectivos status de la operación de entrega de los pedidos que genere el servicio, vía e-mail o a través de la asignación a nuestros CLIENTES de un usuario / clave, designada  por el Departamento de SEGURIDAD, para ser utilizado ingresando a nuestra página de Internet www.nexosgroup.com.co, en el link Consulte sus envíos.';
$pdf->writeHTML($txt8, true, false, true, false, '');
$pdf->Ln(6);
$pdf->Cell(0, 15,'
EL CLIENTE se compromete con NEXOS CARGO S.A.S., a:
', 0, false, 'L', 0, '', 0, false, 'M','M');
$pdf->Ln(6);
$pdf->Cell(0, 15,'Información confidencial:', 0, false, 'L', 0, '', 0, false, 'M','M');
$pdf->Ln(6);
$txt9='
Como quiera que toda la información confidencial pueda caer en manos inescrupulosas y con el fin de garantizar su seguridad, se requiere un compromiso de parte de Ustedes como clientes y que contemple los siguientes aspectos, así:
';
$pdf->writeHTML($txt9, true, false, true, false, '');
$pdf->Ln(6);
$txt10='
•	El manejo y manipulación de la información como: Datos y ubicación del vehículo y conductor, será realizado exclusivamente por las personas acreditadas por su compañía, quienes responderán por la información puesta a su cargo, haciendo énfasis en la compartimentación del material puesto  bajo su responsabilidad.
';
$pdf->writeHTML($txt10, true, false, true, false, '');
$pdf->Ln(6);
$txt11='•	Por ningún motivo se dará información de la empresa a terceros sin autorización o para fines diferentes a los pactados. ';
$pdf->writeHTML($txt11, true, false, true, false, '');
$pdf->Ln(6);
$txt12='
•	La información debe contar con la debida seguridad física. 
';
$pdf->writeHTML($txt12, true, false, true, false, '');
$pdf->Ln(6);
$pdf->Cell(0, 15,'Otras Pertinentes:', 0, false, 'L', 0, '', 0, false, 'M','M');
$pdf->Ln(6);
$txt13='•	 Efectuar los pagos de los fletes en la forma prevista del presente Acuerdo.';
$pdf->writeHTML($txt13, true, false, true, false, '');
$pdf->Ln(6);

$txt14='•	Autorizar a NEXOS CARGO S.A.S., a realizar la consulta y reporte a las Centrales de Riesgo (Data crédito).';
$pdf->writeHTML($txt14, true, false, true, false, '');
$pdf->Ln(6);
$txt15='•	Emitir las Solicitudes de Servicio, para el Cumplimiento por parte del NEXOS CARGO S.A.S.';
$pdf->writeHTML($txt15, true, false, true, false, '');
$pdf->Ln(6);
$txt16='•	Dar cumplimiento a lo dispuesto en el Artículo 1010 y siguientes del Código de Comercio, en relación con las indicaciones que debe dar el Remitente al Transportador.';
$pdf->writeHTML($txt16, true, false, true, false, '');
$pdf->Ln(6);
$pdf->Cell(0, 15,'5.	Medidas de Seguridad y Control de las mercancías.', 0, false, 'L', 0, '', 0, false, 'M','M');
$pdf->Ln(6);
$txt17='•	Puestos de control. Se tienen 27 puestos de control reales en las diferentes vías cubriendo los principales trayectos a nivel nacional con la compañía XXXXXXXXXXXXX';
$pdf->writeHTML($txt17, true, false, true, false, '');
$pdf->Ln(6);

$txt18='•	Frente de Seguridad. Hacemos parte del frente de seguridad, lo cual nos permite estar conectados todo el tiempo con Policía de Carreteras, SIJIN, DIJIN y demás organismos de reacción, recibiendo adicionalmente información actualizada del estado de las vías, eventos como derrumbes, y problemas de orden público entre otros.';
$pdf->writeHTML($txt18, true, false, true, false, '');
$pdf->Ln(6);
$txt19='•	Operación centralizada de Seguridad. La operación está direccionada 100% por el Departamento de Seguridad y tráfico de NEXOS CARGO S.A.S., lo que garantiza total control de los despachos, los cuales se realizan bajo estrictas normas y políticas de seguridad de acuerdo al perfil y valor de las mercancías a transportar.';
$pdf->writeHTML($txt19, true, false, true, false, '');
$pdf->Ln(6);
$txt20='•	Planes de Contingencia. Tenemos planes de contingencia ante la ocurrencia de volcamiento, varadas, intervención de autoridad en carretera, detención de grupos al margen de la ley, hurtos y trasporte de mercancías peligrosas, lo cual nos permite tener una reacción oportuna y eficaz.';
$pdf->writeHTML($txt20, true, false, true, false, '');
$pdf->Ln(6);
$pdf->Cell(0, 15,'6.	Condiciones Generales.', 0, false, 'L', 0, '', 0, false, 'M','M');
$pdf->Ln(6);
$txt21='Facturación: El servicio de transporte nacional se facturará contra la presentación de los cumplidos que respaldan la entrega de la mercancía. ';
$pdf->writeHTML($txt21, true, false, true, false, '');
$pdf->Ln(6);
$txt22='Pago: Se concederán (***) __XXX___ días después de entregada la factura para su respectivo pago. ';
$pdf->writeHTML($txt22, true, false, true, false, '');
$pdf->Ln(6);
$txt23='Vigencia: La vigencia de estas tarifas está sujeta a las resoluciones del Ministerio de Transporte, a las negociaciones entre gremios transportadores o a las condiciones de variabilidad del mercado.';
$pdf->writeHTML($txt23, true, false, true, false, '');
$pdf->Ln(6);
$pdf->Cell(0, 15,'Cualquier duda con gusto la resolveremos.', 0, false, 'L', 0, '', 0, false, 'M','M');
$pdf->Ln(6);
$pdf->Cell(0, 15,'Cordialmente,', 0, false, 'L', 0, '', 0, false, 'M','M');
$pdf->Ln(6);






//FINAL DEL DOCUMENTO
ob_end_clean();
$pdf->Output('cotizacion.pdf', 'I');


?>