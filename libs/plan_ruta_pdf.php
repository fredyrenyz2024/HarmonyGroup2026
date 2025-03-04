<?php
include("../application/Config.php");
include '../application/Conexion.php';
//recoger variables
$manifiesto = $_GET["id_manf"];
$id2 = $_GET["idplan"]; //id del plan de ruta
$id_ini = $_GET["cod_ini_ruta"]; //id de inicio de ruta

include('Nuevacarpeta/tcpdf.php');
class MYPDF extends TCPDF
{
	public function Header()
	{
		$ruta = 'Nuevacarpeta/examples/images/';
		$image_file = $ruta . 'logo_nexos3.PNG';
		$this->Image($image_file, 15, 5, 60, '', 'PNG', 'C', '', false, 500, '', false, false, 0, false, false, false);
	}
}

//instanciar la clase
$pdf = new MYPDF('P', 'mm', 'A4', true, 'UTF-8', false);
$pdf->SetCreator(PDF_CREATOR);
$pdf->SetAuthor('Nexos Cargo');
$pdf->SetTitle('Plan de ruta');
$pdf->SetSubject('TCPDF Tutorial');
$pdf->SetKeywords('TCPDF, PDF, example, test, guide');
$pdf->SetFont('times', 'BI', 9);
$pdf->AddPage('L', 'A4');

$pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
$pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
$pdf->SetFooterMargin(PDF_MARGIN_FOOTER);
$pdf->Ln(6);
$pdf->SetFont('times', 'b', 9);
$pdf->SetFontSize(10);

//$pdf->Image($filename, 230, 0, 50,'', 'PNG', 'C', '', false, 200, '', false, false, 0, false, false, false);

$Data = new Database2;
$sql = "SELECT pu.*, mn.municipio, mn.depto,
			rori.municipio AS 'munorigen', rori.depto AS 'deporigen',
			rdest.municipio AS 'mundestino', rdest.depto AS 'depdestino'
			FROM cmx_inicio_ruta ini
			INNER JOIN cmx_plan_ruta pl
			ON ini.cod_plan=pl.cod_plan
			INNER JOIN cmx_rutas rut
			ON pl.cod_ruta=rut.id
			INNER JOIN cmx_municipios rori	
			ON rut.cod_ciudad_origen=rori.id
			INNER JOIN cmx_municipios rdest
			ON rut.cod_ciudad_destino=rdest.id
			INNER JOIN cmx_planruta_detalle pu
			ON pl.cod_plan=pu.cod_plan
			INNER JOIN cmx_municipios mn
			ON pu.cod_ciudad=mn.id
			WHERE ini.cod_inicio=" . $id_ini . "
			AND ini.num_manifiesto=" . $manifiesto . "
			ORDER BY pu.id ASC";
$resultado = $Data->query($sql);
$resultado->setFetchMode(PDO::FETCH_ASSOC);
$total = $resultado->rowCount();
if ($total > 15) {
	$a = '<tr>';
	$b = '</tr>';
} else {
	$a = ' ';
	$b = ' ';
}


$sql2 = "SELECT ma.placa, vv.marca, 
	vv.anio_fabricacion,
	vv.color,
	vv.cod_rndc_carroceria,
	vv.linea,
	pro.nombre, pro.apellido1, pro.apellido2,
	pro.numero_documento,
	pro.rndc_categoria_licencia, 
	pro.rndc_numero_licencia,
	pro.celular,
	ini.observacion,
	ini.fechasalida,
	ini.horasalida,
	CONCAT(mn1.municipio,' ',mn1.depto) AS Origen,
	CONCAT(mn2.municipio,' ',mn2.depto) AS Destino
	FROM cmx_manifiesto ma
	INNER JOIN cmx_municipios mn1 ON ma.origen_viaje=mn1.id
	INNER JOIN cmx_municipios mn2 ON ma.destino_viaje=mn2.id
	INNER JOIN cmx_vehiculos ve ON ma.placa=ve.placa	
	INNER JOIN cmx_vehiculo2 vv ON ve.numdoc_vehiculo=vv.id_vehiculo
	INNER JOIN cmx_proveedores pro ON ma.conductor_manifiesto=pro.numero_documento
	LEFT JOIN cmx_inicio_ruta ini ON ma.id=ini.num_manifiesto
	WHERE ma.id=" . $manifiesto . "	
	GROUP BY ma.placa";
$resultadob = $Data->query($sql2);
$resultadob->setFetchMode(PDO::FETCH_ASSOC);


$pdf->Ln(2);
//tabla de datos
$maqueta = '
 <div class="row">
 	<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
 		<table border="1" cellpading="2">
 			<thead>
 				<tr>
 					<th colspan="7" class="text-center">
 					Datos del Manifiesto ' . $manifiesto . '</th>
 				</tr>';
//primer 				
foreach ($resultadob as $key => $value) {

	$maqueta .= '<tr>
 					<th class="text-center">Manifiesto: ' . $manifiesto . '</th>
 					<th class="text-center" colspan="2">Origen: ' . $value["Origen"] . '</th>
 					<th class="text-center" colspan="2">Destino: ' . $value["Destino"] . '</th>
 					<th class="text-center" colspan="2">N° Caravana: 0</th>
 				</tr>
 				<tr>
 					<th class="text-center">Placa: ' . $value["placa"] . '</th>
 					<th class="text-center">Marca: ' . $value["marca"] . '</th>
 					<th class="text-center">Modelo: ' . $value["anio_fabricacion"] . '</th>
 					<th class="text-center">Color: ' . $value["color"] . '</th>
 					<th class="text-center">Carrocería: ' . $value["cod_rndc_carroceria"] . '</th>
 					<th class="text-center">Remolque: </th>
 					<th class="text-center">Línea:  ' . $value["linea"] . '</th>
 				</tr>
 				<tr>
 					<th class="text-center" colspan="2">Conductor: ' . $value["nombre"] . ' ' . $value["apellido1"] .
		' ' . $value["apellido2"] . '</th>
 					<th class="text-center">CC:  ' . $value["numero_documento"] . '</th>
 					<th class="text-center" colspan="2">Licencia de conducción: ' . $value["rndc_numero_licencia"] . '</th>
 					<th class="text-center">Categoría: ' . $value["rndc_categoria_licencia"] . '</th>
 					<th class="text-center">Tel: ' . $value["celular"] . '</th>	
 				</tr>
 				<tr>
 					<th class="text-center" colspan="3">Fecha salida programada: ' . $value["fechasalida"] . ' ' . $value["horasalida"] . '</th>
 					<th class="text-center" colspan="3">Fecha Llegada programada: </th>';
	//}				

	$maqueta .= '<th class="text-center">
 					Valor Multa: $ 50.000</th>
 				</tr>
 			</thead>
 		</table>
 	</div>
 </div>
	
	';
	$pdf->Ln(17);
	$pdf->writeHTML($maqueta, false, false, false, false, '');
	//tabla de puntos de control
	$maqueta2 = '<div class="row">
	
		<table border="1" cellpading="2">
			<thead>
				<tr colspan="7" class="text-center">
					<th class="text-center">PUESTOS DE CONTROL</th>
				</tr>
			</thead>
			<tbody>
			<tr> <th>' . $value['Origen'] . '</th>   </tr>
				 	
				 ';

	$res = 0;
	foreach ($resultado as $key => $value2) {
		++$res;

		if ($res == 1) {
			($value2['tiempo_estimacion']);
		}


		$fec = $value["fechasalida"] . ' ' . $value["horasalida"];
		$a = (date('Y-m-d H:i:s', strtotime($fec . "+ 2000 minute")));


		$maqueta2 .= '
			<tr>
			<td> ' . $value2['municipio'] . ' ' . $value2['depto']   . '  </td>
			</tr>
			';
	}
	$maqueta2 .= ' 
			

			</tbody>	
		</table>


<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
		<table border="1">
			<thead>
				<tr>
					<th class="text-center" colspan="2">Observaciones: ' . $value['observacion'] . '</th>
				</tr>
				<tr>
					<th cellpading="2">Firma y sello autorizados por la empresa</th>
					<th>Firma y N° Cédula Conductor</th>
				</tr>	
			</thead>
			<tbody></tbody>
		</table>
	</div>
</div>';
} //cierre del primer foreach 
$pdf->writeHTML($maqueta2, false, false, false, false, '');
$pdf->Output();
