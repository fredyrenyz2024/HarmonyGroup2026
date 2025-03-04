<?php
session_start();
include "../application/Config.php";
include '../application/Conexion.php';
// include '../controllers/transporte.php';
$usuario = $_SESSION["usuario"]["nom_usuario"];
$fecha_sistem = date('Y-m-d');
$hora_sistem = date('H:i:s');

$id_rem = base64_decode($_GET["remesa"]);
$idord = base64_decode($_GET["orden"]);

// if ($_GET["rta_ministerio"] !== 'null') {
// 	$rta_ministerio = $_GET["rta_ministerio"];
// 	// Parsear el XML
// 	$xml = simplexml_load_string($rta_ministerio);
// 	if ($xml) {
// 		// Ahora puedes acceder a los elementos y atributos del XML como objetos
// 		$elemento = $xml->xml;
// 		$atributo = $xml->ingresoid;
// 		// Realiza las operaciones necesarias con los datos XML
// 		if ($atributo != "") {
// 			$atributo = $atributo;
// 		} else {
// 			$atributo = "No presenta numero de autorización";
// 		}
// 	} else {
// 		// Maneja el caso en el que el XML no se pueda analizar correctamente
// 		$atributo = " ";
// 	}
// } else {
// 	$rta_ministerio = "Sin respuesta";
// 	$atributo = " ";
// }


/**
 * Creates an example PDF TEST document using TCPDF
 * @package com.tecnick.tcpdf
 * @abstract TCPDF - Example: Default Header and Footer
 * @author Nicola Asuni
 * @since 2008-03-04
 */
include 'Nuevacarpeta/tcpdf.php';
class MYPDF extends TCPDF
{
	public function Header()
	{
	}
}
//instanciar la clase
$pdf = new MYPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
//encabezado
$pdf->SetCreator(PDF_CREATOR);
$pdf->SetAuthor('Nexos Cargo');
$pdf->SetTitle('Remesa' . $id_rem);

$pdf->AddPage();
// $pdf->Ln(4);

$pdf->Ln(8);
//Tabla datos basicos
$ruta = 'Nuevacarpeta/examples/images/';

$image_file = $ruta . 'logonexos.png';
$image_files = $ruta . 'supertransporte-min.png';

//Consulta para armar los pdf
$conexion = new Database2();

$detalle_orden = $conexion->prepare("SELECT ro.id_remesa, ro.id_orden_cargue,
				r.fecha_creacion, r.aplica_seguro, r.descripcion_novedad,
				r.remesa_contado, r.remesa_contraentrega,ag.nombre AS agencia,ve.placa,
				pro.nombre, pro.apellido1, pro.apellido2, pro.numero_documento,
				rr.direccion_entrega AS remdireccion, cli.nombre AS remnombre, mn.municipio AS remcity,
				rd.direccion_entrega AS desdireccion, clid.nombre AS desnombre, mnd.municipio AS descity,
				r.valor_declarado,
				b.tipo_mercancia, b.naturaleza, b.cantidad_empaque, b.peso_neto_tn, b.volumen_total,
				em.empaque, ser.nundoc_solicitud,o.mer_idservicio,rd.observacion AS 'Observacion_Destinatario'
				FROM cmx_remesa r
				INNER JOIN cmx_remesa_ordencargue ro ON r.id=ro.id_remesa
				INNER JOIN cmx_orden_cargue o ON o.id=ro.id_orden_cargue
				INNER JOIN cmx_solicitud_vehiculo2 ser ON o.mer_idservicio=ser.nundoc_solicitud
				INNER JOIN cmx_agencias ag ON ser.agencia=ag.id
				INNER JOIN cmx_vehiculos ve ON o.ve_idcarro=ve.numdoc_vehiculo
				INNER JOIN cmx_proveedores pro ON o.ve_id_conductor=pro.numdoc_nexos
				INNER JOIN cmx_ruta_puntosentrega rr ON o.id_remitente=rr.id
				INNER JOIN cmx_remitente_destinatario cli ON rr.cliente=cli.id
				INNER JOIN cmx_municipios mn ON rr.municipio_entrega=mn.id
				INNER JOIN cmx_destinatarios_ss rd ON r.id_destinatario=rd.id
				INNER JOIN cmx_remitente_destinatario clid ON rd.cliente=clid.id
				INNER JOIN cmx_municipios mnd ON rd.municipio_entrega=mnd.id
				INNER JOIN cmx_detalle_mercancia2 b ON ser.idpareja_origen_destino=b.id
				INNER JOIN cmx_para_tipo_empaque em ON b.tipo_empaque=em.id
				LEFT JOIN cmx_manifiesto_remesa mr ON mr.id_remesa=r.id
				LEFT JOIN cmx_manifiesto m ON m.id=mr.id_manifiesto
				LEFT JOIN cmx_remesas_transmision rt ON rt.id_remesa=r.id
				WHERE ro.id_remesa=$id_rem  AND ro.id_orden_cargue=$idord");
$detalle_orden->execute();
$fila = $detalle_orden->fetch(PDO::FETCH_ASSOC);
$fecha = $fila['fecha_creacion'];
$oficina = $fila['agencia'];
$placa = $fila['placa'];
$conductor = $fila['nombre'] . ' ' . $fila['apellido1'] . ' ' . $fila['apellido2'];
$identifica = $fila['numero_documento'];
$rnombre = $fila['remnombre'];
$rciudad = $fila['remcity'];
$rdireccion = $fila['remdireccion'];
$dnombre = $fila['desnombre'];
$dciudad = $fila['descity'];
$ddireccion = $fila['desdireccion'];
$idser = $fila['nundoc_solicitud'];
$mer_idservicio = $fila['mer_idservicio'];
$mercancia = $fila['tipo_mercancia'];

if ($fila['naturaleza'] == 1) {
	$natu = 'Carga normal';
}
if ($fila['naturaleza'] == 2) {
	$natu = 'Carga peligrosa';
}
if ($fila['naturaleza'] == 3) {
	$natu = 'Carga extradimensionada';
}
if ($fila['naturaleza'] == 4) {
	$natu = 'Carga extrapesada';
}
if ($fila['naturaleza'] == 5) {
	$natu = 'Residuos Peligrosos';
}
if ($fila['naturaleza'] == 6) {
	$natu = 'Semovientes';
}
if ($fila['naturaleza'] == 7) {
	$natu = 'Refrigerada';
}
if ($fila['naturaleza'] != 7 && $fila['naturaleza'] != 6 && $fila['naturaleza'] != 5 && $fila['naturaleza'] != 4 && $fila['naturaleza'] != 3 && $fila['naturaleza'] != 2 && $fila['naturaleza'] != 1) {
	$natu = $fila['naturaleza'];
}
$cant = $fila['cantidad_empaque'];
$empaque = $fila['empaque'];
$peso = $fila['peso_neto_tn'];
$volum = $fila['volumen_total'];
$mercancia = $fila['tipo_mercancia'];
$obs = $fila['Observacion_Destinatario'];

//Consultar precintos
$precintos = $conexion->prepare("SELECT * FROM cmx_planilla_detalle2 WHERE id_planilla=$idord");
$precintos->execute();
$precintos_array = $precintos->fetchAll(PDO::FETCH_ASSOC);

$lista_precintos = '';  // Inicializa la variable para almacenar los valores concatenados
foreach ($precintos_array as $key => $value) {
	$lista_precintos .= $value['serie_precinto'] . ', ';
}

// Elimina la última coma y espacio si existen
$lista_precintos = rtrim($lista_precintos, ', ');

$tabla = '
	<table style="text-align:center;" >
		<tr>
			<td>
					<img src="' . $image_file . '" alt="" width="125">
			</td>
			<td>
					<table>
						<tr>
							<th  style="font-family: Arial, Helvetica, sans-serif;font-size:10px;font-weight: bold;">NEXOS CARGO SAS</th>
						</tr>
						<tr>
							<td style="font-family: Arial, Helvetica, sans-serif;text-align: center;font-size:6px;font-weight: bold;">NIT.9000062596-8</td>
						</tr>
						<tr>
							<td style="font-family: Arial, Helvetica, sans-serif;font-size:6px;">CL 23 116 31</td>
						</tr>
						<tr>
							<td style="font-family: Arial, Helvetica, sans-serif;font-size:6px;font-weight: bold;">Tel. 7452882</td>
						</tr>
				</table>
			</td>
			<td>
					<table style="border: 0.7px solid #000000;">
						<tr>
							<td  style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;font-weight: 900;height:10px;"><b>REMESA No. ' . $id_rem . '</b></td>
						</tr>
						<tr>
							<td style="font-family: Arial, Helvetica, sans-serif;font-size:9px;font-weight: bold;">NUMERO AUTORIZACION</td>
						</tr>
						<tr>
							<--<td style="font-family: Arial, Helvetica, sans-serif;font-size:9px;font-weight: bold;"> /*. $atributo .*/ </td>-->
							<td style="font-family: Arial, Helvetica, sans-serif;font-size:9px;font-weight: bold;"></td>
						</tr>
					</table>
			</td>
		</tr>
	</table>

	<table style="border: 0.7px solid #000000;" cellpading="2">
			<thead>
					<tr>
						<th class="text-center" style="text-align:left;border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:7px;"><strong>FECHA:</strong> ' . $fecha . '</th>
						<th class="text-center" style="text-align:left;border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:7px;"><strong>OFICINA:</strong> ' . $oficina . '</th>
						<th class="text-center" style="text-align:left;border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:7px;"><strong>ORDEN DE CARGUE:</strong> ' . $idord . '</th>
					</tr>
					<tr>
						<th class="text-center" style="text-align:left;border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:7px;width:100px;"><strong>PLACA:</strong> ' . $placa . '</th>
						<th class="text-center" style="text-align:left;border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:7px;width:259px;"><strong>CONDUCTOR:</strong> ' . $conductor . '</th>
						<th class="text-center" style="text-align:left;border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:7px;"><strong>CEDULA:</strong> ' . $identifica . '</th>
					</tr>
					<tr>
						<th class="text-center" style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;width:190px;"><strong>REMITENTE:</strong> ' . $rnombre . '</th>
						<th class="text-center" style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;width:150px;"><strong>CIUDAD:</strong> ' . $rciudad . '</th>
						<th class="text-center" style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;width:199px;"><strong>DIRECCIÓN:</strong> ' . $rdireccion . '</th>
					</tr>
					<tr>
						<th class="text-center" style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;"><strong>DESTINATARIO:</strong> ' . $dnombre . '</th>
						<th class="text-center" style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;"><strong>CIUDAD:</strong> ' . $dciudad . '</th>
						<th class="text-center" style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;"><strong>DIRECCIÓN:</strong> ' . $ddireccion . '</th>
					</tr>
					<tr>
						<th class="text-center" style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;width:120px;"><strong>VALOR DECLARADO:</strong> xxxxxx</th>
						<th class="text-center" style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;width:50px;"><strong>PEDIDO:</strong></th>
						<th class="text-center" style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: center;width:80px;">' . $idser . '</th>
						<th class="text-center" style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: center;width:100px;"><strong>APLICA SEGURO:</strong></th>
						<th class="text-center" style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: center;width:20px;"></th>
						<th class="text-center" style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: center;width:100px;"><strong>O.SERVICIO:</strong></th>
						<th class="text-center" style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: center;width:69px;">' . $mer_idservicio . '</th>
					</tr>
					<tr>
						<th class="text-center" style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: left;width:272px;"><strong>PROD. TRANSPORTADO:</strong> ' . $mercancia . '</th>
						<th class="text-center" style="font-family: Arial, Helvetica, sans-serif;font-size:7px;text-align: left;width:260px;"><strong>NATURALEZA:</strong> ' . $natu . '</th>
					</tr>
				</thead>
		</table>
		<br>
		<br>
		<table style="border: 0.7px solid #000000;" cellpading="3">
			<thead>
				<tr>
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: center;"><strong>REMISIÓN</strong></th>
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: center;"><strong>CANTIDAD</strong></th>
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: center;"><strong>EMPAQUE</strong></th>
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: center;"><strong>PESO(Kg)</strong></th>
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: center;"><strong>VOLUMEN(m3)</strong></th>
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: center;"><strong>CONTENIDO</strong></th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: center;">' . $mer_idservicio . '</td>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: center;">' . $cant . '</td>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: center;">' . $empaque . '</td>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: center;">' . $peso . '</td>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: center;">' . $volum . '</td>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: center;">' . $mercancia . '</td>
				</tr>
				<tr>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: center;"></td>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: center;"></td>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: center;"></td>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: center;"></td>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: center;"></td>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: center;"></td>
				</tr>
				<tr>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: center;"></td>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: center;"></td>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: center;"></td>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: center;"></td>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: center;"></td>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: center;"></td>
				</tr>
				<tr>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: center;"></td>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: center;"></td>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: center;"></td>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: center;"></td>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: center;"></td>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: center;"></td>
				</tr>
			</tbody>
		</table>
		<br>
		<br>
		<table style="border: 0.7px solid #000000;"  cellpading="2">
		<thead>
			<tr>
				<th class="text-center" style="font-family: Arial, Helvetica, sans-serif; font-size:7px; border: 0.7px solid #000000; text-align: left;">
    			<strong>OBSERVACIONES:</strong> ' . $obs . '<br>' . 'PRECINTOS:' . $lista_precintos . '
				</th>
				<th class="text-left" style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: left;"><strong>Elaborado por:</strong> <br><br><br> <hr><br>Firma y sello</th>
				<th class="text-left" style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: left;"><strong>Recibir satisfacción:</strong> <br><br><br> <hr><br>Firma y sello</th>
				<th class="text-left" style="font-family: Arial, Helvetica, sans-serif;font-size:7px;border: 0.7px solid #000000;text-align: left;"><img src="' . $image_files . '" alt="" width="120"></th>
			</tr>
		</thead>
	</table>

';

for ($i = 0; $i < 2; $i++) {
	$pdf->Ln(8);
	$pdf->writeHTML($tabla, true, false, false, false, '');
	if ($i < 1) {
		$pdf->writeHTML('<br><br><hr><br><br>', true, false, true, false, ''); // Agregar una nueva página después de la primera repetición
	}
}
// $pdf->Output();
$pdf->Output('Remesa.pdf' . date("Y-m-d H:m:s") . "-" . $placa, 'I');
