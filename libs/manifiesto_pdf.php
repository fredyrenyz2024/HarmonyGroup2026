<?php
include "../application/Config.php";
include '../application/Conexion.php';
include "phpqrcode/qrlib.php";
include '../vendor/luecano/numero-a-letras/src/NumeroALetras.php';
$dir = 'phpqrcode/temp/';
$Data = new Database2;
//Consulta para generar el pdf
$id_manif = base64_decode($_GET["id_mnf"]);
$detalle_minifiesto = $Data->prepare("SELECT ma.id,ma.placa,ma.tipo_manifiesto,ma.valor_total_viaje,ma.retencion_fuente,ma.rete_ica,ma.neto_pagar,ma.saldo,ma.Lugar,
			ma.fecha_pago,ma.cargue_pagado,ma.descargue_pagado,ma.observacion, CONCAT(mn.municipio,' ',mn.depto) AS origen,CONCAT(mnd.municipio,' ',mnd.depto) AS destino,
			con.nombre AS conductor, con.apellido1 AS conape1,con.apellido2 AS conape2,	con.numero_documento, con.direccion, con.celular, con.rndc_numero_licencia,
			CONCAT(mcon.municipio,'',mcon.depto) AS cityconductor,ten.nombre, ten.apellido1, ten.apellido2,
			ten.numero_documento AS docten, ten.direccion AS direten,ten.celular AS celten, CONCAT(mten.municipio,' ',mten.depto) cityten,marq.marca, conf.nombre AS configuracion, ve2.peso, ve2.num_soat,
			ase.nombre AS aseguradora, ve2.vence_soat,tra.placa AS placa_remolque,MAX(mnfa.valor_anticipo) AS anticipo_actual,ma.num_autorizacion,ma.fecha_expedicion
			FROM cmx_manifiesto ma
			INNER JOIN cmx_municipios mn ON ma.origen_viaje=mn.id
			INNER JOIN cmx_municipios mnd ON ma.destino_viaje=mnd.id
			INNER JOIN cmx_proveedores con ON ma.conductor_manifiesto=con.numero_documento
			INNER JOIN cmx_municipios mcon ON con.id_municipio=mcon.id
			INNER JOIN cmx_proveedores ten ON ma.titular_manifiesto=ten.numero_documento
			INNER JOIN cmx_municipios mten ON ten.id_municipio=mten.id
			INNER JOIN cmx_vehiculos ve ON ma.placa=ve.placa
			INNER JOIN cmx_vehiculo2 ve2 ON ve.numdoc_vehiculo=ve2.id_vehiculo
			INNER JOIN cmx_rndc_vehiculos_configuracion  conf ON ve2.configuracion=conf.id
			LEFT JOIN cmx_rndc_vehiculos_marcas marq ON ve2.marca=marq.id
			LEFT JOIN cmx_rndc_aseguradoras ase ON ve2.aseguradora=ase.id
			LEFT JOIN cmx_trailer_vehiculo	tr ON ve.numdoc_vehiculo=tr.id_vehiculo AND tr.estado=1
			LEFT JOIN cmx_trailer tra ON tra.id=tr.id_trailer
			LEFT JOIN cmx_manifiesto_anticipo mnfa ON ma.id=mnfa.id_manifiesto
			LEFT JOIN cmx_estado_mnf_anticipo mnfae ON mnfa.id=mnfae.id_anticipo AND mnfae.estado=1
			WHERE ma.id=$id_manif");
$detalle_minifiesto->execute();
$fila = $detalle_minifiesto->fetch(PDO::FETCH_ASSOC);
$placa = $fila['placa'];
$placa_remolque = $fila['placa_remolque'];
$origen = $fila['origen'];
$destino = $fila['destino'];
$dococndu = $fila['numero_documento'];
// $dococndu = '';
$obs = '';

if ($fila['num_autorizacion'] != 'null') {
	$ingresoid = $fila['num_autorizacion'];
}
if ($fila['num_autorizacion'] == 'null') {
	$ingresoid = '';
}

$num_mnfqr = 'Manifiesto #' . base64_decode($_GET["id_mnf"]);
$autorizacion = 'Autorización: ' . $ingresoid;
$fecha_qr = 'Fecha: ' . date('Y/m/d');
$placa_qr = 'Placa: ' . $placa;
$placa_remolqueqr = 'Remolque: ' . $placa_remolque;
$origenqr = 'Origen: ' . $origen;
$destinoqr = 'Destino: ' . $destino;
$docconduqr = 'Conductor: ' . $dococndu;
$empresaqr = 'Empresa: NEXOS CARGO SAS';
$obsqr = 'Observacion: ' . $obs;
// $mercaqr = 'Mercancia: ';
$mercaqr = '';
//$seguro=registrar los 28 caracteres del codigo de seguridad en el manifiesto entregado por el rndc en el xml de aceptacion del manifiesto.
if (file_exists($dir)) {
	//mkdir($dir);
	$aleatorio1 = rand(10000, 90000);
	$filename = $dir . 'MNF' . $num_mnfqr . $aleatorio1 . '.png';
	$tamano = 1;
	$level = 'M';
	$frameSize = 3;
	$contenido = $num_mnfqr . "\n" . $autorizacion . "\n" . $fecha_qr . "\n" . $placa_qr . "\n" . $placa_remolqueqr . "\n" . $origenqr . "\n" . $destinoqr . "\n" . $mercaqr . "\n" . $docconduqr . "\n" . $empresaqr . "\n" . $obsqr;
	QRcode::png($contenido, $filename, $level, $tamano, $frameSize);
	//echo '<img src="'.$filename.'" />';
} else {
	//echo 'NO QRRR';
}
//include('../Controllers/transporte.php');
//traer datos
session_start();
$usuario = $_SESSION["usuario"]["nom_usuario"];
$fecha_sistem = date('Y-m-d');
$hora_sistem = date('H:i:s');
$num_mnf = base64_decode($_GET["id_mnf"]);
// $placa = $_GET["placa"];
if ($fila['tipo_manifiesto'] == 1) {
	$tipo = 'General';
}
if ($fila['tipo_manifiesto'] == 2) {
	$tipo = 'Paqueteo';
}
if ($fila['tipo_manifiesto'] == 3) {
	$tipo = 'Urbano de puertos';
}
if ($fila['tipo_manifiesto'] == 4) {
	$tipo = 'Masivo';
}
if ($fila['tipo_manifiesto'] == 5) {
	$tipo = 'Semimasivo';
}
if ($fila['tipo_manifiesto'] == 6) {
	$tipo = 'Urbano';
}
if ($fila['tipo_manifiesto'] == 7) {
	$tipo = 'Movimiento contenedores';
}
$valort = $fila["valor_total_viaje"];
$reten = $fila["retencion_fuente"];
$reteica = $fila["rete_ica"];
$neto = $fila["neto_pagar"];
$saldo = $fila["saldo"];
$observacion = $fila["observacion"];
$Lugar = $fila["Lugar"];
$fecha_pago = $fila["fecha_pago"];
if ($fila["cargue_pagado"] == 1) {
	$cargue_pagado = 'Empresa';
}
if ($fila["cargue_pagado"] == 2) {
	$cargue_pagado = 'Destinatario';
}
if ($fila["cargue_pagado"] == 3) {
	$cargue_pagado = 'Remitente';
}
if ($fila["cargue_pagado"] == 4) {
	$cargue_pagado = 'Conductor';
}

if ($fila["descargue_pagado"] == 1) {
	$descargue = 'Empresa';
}
if ($fila["descargue_pagado"] == 2) {
	$descargue = 'Destinatario';
}
if ($fila["descargue_pagado"] == 3) {
	$descargue = 'Remitente';
}
if ($fila["descargue_pagado"] == 4) {
	$descargue = 'Conductor';
}

$origen = $fila["origen"];
$destino = $fila["destino"];
$condu = $fila["conductor"] . ' ' . $fila['conape1'] . ' ' . $fila['conape2'];
$dococndu = $fila["numero_documento"];
$direccion = $fila["direccion"];
$cel = $fila["celular"];
$licencia = $fila["rndc_numero_licencia"];
$ciudadcon = $fila["cityconductor"];
$nombreten = $fila["nombre"] . ' ' . $fila['apellido1'] . ' ' . $fila['apellido2'];
$doctene = $fila["docten"];
$direten = $fila["direten"];
$celten = $fila["celten"];
$cityten = $fila["cityten"];
$marca = $fila["marca"];
$config = $fila["configuracion"];
$peso_vacio = $fila["peso"];
$soat = $fila["num_soat"];
$aseguradora = $fila["aseguradora"];
$vence_soat = $fila["vence_soat"];
$fecha_expedicion = $fila["fecha_expedicion"];
$antici = $fila["anticipo_actual"] != "null" ? $fila["anticipo_actual"] : "0";
// echo $antici;
if ($fila["placa_remolque"] != 'null') {
	$placa_remolque = $fila["placa_remolque"];
}
if ($fila["placa_remolque"] == 'null') {
	$placa_remolque = '';
}

// $obs = $fila["obs"];
$obs = '';


//Consulta Remesas
$sql_rmesas = $Data->prepare("SELECT r.id AS id_remesa, d.tipo_servicio_mer,
			d.cantidad_empaque,d.naturaleza, d.tipo_mercancia, te.empaque, co.nombre_cliente,
			aa.nombre AS nomdest, aa.documento AS docdest,bb.nombre AS nomrem, bb.documento AS docrem,
			CONCAT(ori.municipio,'-',ori.depto) AS origen_rem,CONCAT(dest.municipio,'-',dest.depto) AS destino_rem
			FROM cmx_manifiesto_remesa  mr
			INNER JOIN cmx_remesa r ON mr.id_remesa=r.id
			INNER JOIN cmx_remesa_ordencargue ro ON  r.id=ro.id_remesa
			INNER JOIN cmx_orden_cargue o ON ro.id_orden_cargue=o.id
			INNER JOIN cmx_solicitud_vehiculo2 se ON o.mer_idservicio=se.nundoc_solicitud
			INNER JOIN cmx_destinatarios_ss des ON r.id_destinatario=des.id
			INNER JOIN cmx_remitente_destinatario aa ON des.cliente=aa.id
			INNER JOIN cmx_ruta_puntosentrega rem ON o.id_remitente=rem.id 
      INNER JOIN cmx_remitente_destinatario bb ON rem.cliente=bb.id
			INNER JOIN cmx_detalle_mercancia2 d ON se.idpareja_origen_destino=d.id
			INNER JOIN cmx_para_tipo_empaque te ON te.id=d.tipo_empaque
			INNER JOIN cmx_cotizaciones_serviciocliente co ON d.n_cotizacion=co.n_cotizacion
			INNER JOIN cmx_municipios ori ON d.origen=ori.rndc_codigo_ciudad
			INNER JOIN cmx_municipios dest ON d.destino=dest.rndc_codigo_ciudad
			INNER JOIN cmx_vehiculos ve ON o.ve_idcarro=ve.numdoc_vehiculo
			WHERE mr.id_manifiesto=:id_manif");

// Vincular el parámetro (si aplica)
$sql_rmesas->bindParam(':id_manif', $id_manif, PDO::PARAM_INT);
// Ejecutar la consulta
$sql_rmesas->execute();
// Obtener el número de filas
$rowCount = $sql_rmesas->rowCount();
// Obtener todos los resultados
$results = $sql_rmesas->fetchAll(PDO::FETCH_ASSOC);

//remesas
$tot_remesas = $rowCount;
// $rem = json_encode($_GET['paqueterem']);
// $porciones = explode(",", $_GET['paqueterem']);
//santizar

//$remesas=$_GET["remesas"];//este es un array
//Construcción del PDF
include 'Nuevacarpeta/tcpdf.php';
class MYPDF extends TCPDF
{
	public function Header() {}
}
$formatter = new NumeroALetras();
$formatter->conector = 'Y';

//instanciar la clase
$pdf = new MYPDF('P', 'mm', 'A4', true, 'UTF-8', false);
$pdf->SetCreator(PDF_CREATOR);
$pdf->SetAuthor('Nexos Cargo');
$pdf->SetTitle('Manifiesto' . $num_mnf);
$pdf->SetSubject('TCPDF Tutorial');
$pdf->SetKeywords('TCPDF, PDF, example, test, guide');
$pdf->SetFont('helvetica', 'b', 20);
$pdf->AddPage('L', 'A4');

$pdf->SetMargins(5, 28, 5);
$pdf->SetHeaderMargin(7);
//$pdf->SetFooterMargin(PDF_MARGIN_FOOTER);
// $pdf->Ln(5);
$pdf->SetFont('times', '', 9);
$pdf->SetFontSize(10);

//Tabla datos del cliente
$ruta = 'Nuevacarpeta/examples/images/';
$image_file = $ruta . 'logo_nexos3.PNG';
// $image_file = $ruta . 'logo-xx.png';
// $image_file = $ruta . 'logonexos.png';
$image_files = $ruta . 'logos.png';
$tabla2 = '

		<table style="text-align:center;" >
				<tr>
					<td colspan="1">
							<img src="' . $image_file . '" alt="" width="150">
					</td>
					<td style="width:328px;">
							<table>
								<tr>
									<th  style="font-family: Arial, Helvetica, sans-serif;font-size:15px;font-weight: bold;">MANIFIESTO ELECTRONICO DE CARGA</th>
								</tr>
								<tr>
									<th  style="font-family: Arial, Helvetica, sans-serif;font-size:7px;font-weight: bold;text-align: center;">NIT. NEXOS CARGOS SAS</th>
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
					<td style="width:180px;">
						<table>
							<tr>
									<th style="font-family: Arial, Helvetica, sans-serif;font-size:6px;text-align: justify;">
									"La impresión en soporte cartular (papel) de este acto administrativo producido por
									medios electrónicos en cumplimiento de la ley 527 de 1999 (Articulos 6 al 13) y de la
									ley 962 de 2005 (Articulo 6), es una reproducción del documento original que se
									encuentra en formato electrónico firmado digitalmente en la base de datos del
									RNDC del Ministerio de Transporte, cuya representación digital goza de autenticidad,
									integridad y no repudio."
									</th>
							</tr>
							<tr>
							<td style="font-family: Arial, Helvetica, sans-serif;font-size:9px;text-align: center;font-weight: 900;background-color:#9FA6B2;"><b>Manifiesto: </b> ' . $num_mnf . '</td>
						</tr>
						<tr>
							<td style="font-family: Arial, Helvetica, sans-serif;font-size:9px;text-align: center;font-weight: 900;background-color:#9FA6B2;"><b>Autorización:</b> ' . $ingresoid . '</td>
						</tr>
						</table>
					</td>
					<td  style="font-family: Arial, Helvetica, sans-serif;font-size:8px;text-align:left;"><img src="' . $filename . '" alt="" width="100"></td>
				</tr>
		</table>

		<table style="border: 0.7px solid #000000;" cellpading="1">
			<thead>
				<tr class="text-center" style="text-align:center;">
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: bold;border-right: 0.7px solid #000000;">FECHA DE EXPEDICIÓN</th>
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: bold;border-right: 0.7px solid #000000;">TIPO MANIFIESTO</th>
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: bold;border-right: 0.7px solid #000000;">CANTIDAD DE VIAJES</th>
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: bold;border-right: 0.7px solid #000000;">ORIGEN DEL VIAJE</th>
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: bold;border-right: 0.7px solid #000000;">DESTINO DEL VIAJE</th>
				</tr>

				<tr>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:8px;text-align:center;border-right: 0.7px solid #000000;">' . $fecha_expedicion . '</td>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:8px;text-align:center;border-right: 0.7px solid #000000;">' . $tipo . '</td>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:8px;text-align:center;border-right: 0.7px solid #000000;">1</td>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:8px;text-align:center;border-right: 0.7px solid #000000;">' . $origen . '</td>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:8px;text-align:center;border-right: 0.7px solid #000000;">' . $destino . '</td>
				</tr>
				<tr class="text-center" style="text-align:center;">
					<th colspan="10" style="font-family: Arial, Helvetica, sans-serif;text-align:center;border: 0.7px solid #000000;background-color:#9FA6B2;font-weight:bold;zfont-size:9px;">INFORMACIÓN DEL VEHICULO Y CONDUCTOR</th>
				</tr>
				<tr style="text-align:center;border: 0.7px solid #000000;">
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: bold;border-right: 0.7px solid #000000;">TITULAR DEL MANIFIESTO</th>
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: bold;border-right: 0.7px solid #000000;">DOCUMENTO DE IDENTIFICACIÓN</th>
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: bold;border-right: 0.7px solid #000000;">DIRECCIÓN</th>
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: bold;border-right: 0.7px solid #000000;">TELÉFONO</th>
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: bold;border-right: 0.7px solid #000000;">CIUDAD</th>
				</tr>
				<tr style="text-align:center;border: 0.7px solid #000000;">
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;border-right: 0.7px solid #000000;">' . $nombreten . '</th>
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;border-right: 0.7px solid #000000;">' . $doctene . '</th>
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;border-right: 0.7px solid #000000;">' . $direten . '</th>
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;border-right: 0.7px solid #000000;">' . $celten . '</th>
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;border-right: 0.7px solid #000000;">' . $cityten . '</th>
				</tr>
			</thead>
		</table>
		<table style="border: 0.7px solid #000000;">
				<tr class="text-center" style="text-align:center;">
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: bold;border-right: 0.7px solid #000000;width:50px;">PLACA</th>
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: bold;border-right: 0.7px solid #000000;width:70px;">MARCA</th>
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: bold;border-right: 0.7px solid #000000;width:130px;">PLACA SEMIREMOLQUE</th>
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: bold;border-right: 0.7px solid #000000;width:80px;">CONFIGURACIÓN</th>
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: bold;border-right: 0.7px solid #000000;width:60px;">PESO VACÍO</th>
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: bold;border-right: 0.7px solid #000000;width:90px;">N. POLIZA SOAT</th>
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: bold;border-right: 0.7px solid #000000;width:200px;">COMPAÑIA DE SEGUROS SOAT</th>
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: bold;width:133px;">F.Vencim/SOAT</th>
				</tr>

				<tr class="text-center" style="text-align:center;">
					<td  style="font-family: Arial, Helvetica, sans-serif;font-size:8px;border-right: 0.7px solid #000000;">' . $placa . '</td>
					<td  style="font-family: Arial, Helvetica, sans-serif;font-size:8px;border-right: 0.7px solid #000000;">' . $marca . '</td>
					<td  style="font-family: Arial, Helvetica, sans-serif;font-size:8px;border-right: 0.7px solid #000000;">' . $placa_remolque . '</td>
					<td  style="font-family: Arial, Helvetica, sans-serif;font-size:8px;border-right: 0.7px solid #000000;">' . $config . '</td>
					<td  style="font-family: Arial, Helvetica, sans-serif;font-size:8px;border-right: 0.7px solid #000000;">' . $peso_vacio . '</td>
					<td  style="font-family: Arial, Helvetica, sans-serif;font-size:8px;border-right: 0.7px solid #000000;">' . $soat . '</td>
					<td  style="font-family: Arial, Helvetica, sans-serif;font-size:8px;border-right: 0.7px solid #000000;">' . $aseguradora . '</td>
					<td  style="font-family: Arial, Helvetica, sans-serif;font-size:8px;border-right: 0.7px solid #000000;">' . $vence_soat . '</td>
				</tr>

		</table>
		<table style="border: 0.7px solid #000000;" cellpading="1">
			<thead>
				<tr class="text-center" style="text-align:center;">
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: bold;border-right: 0.7px solid #000000;">CONDUCTOR</th>
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: bold;border-right: 0.7px solid #000000;">DOCUMENTO IDENTIFICACIÓN</th>
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: bold;border-right: 0.7px solid #000000;">DIRECCIÓN</th>
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: bold;border-right: 0.7px solid #000000;">TÉLEFONO</th>
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: bold;border-right: 0.7px solid #000000;">N° LICENCIA</th>
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: bold;border-right: 0.7px solid #000000;">CIUDAD</th>
				</tr>
			</thead>
			<tbody>
				<tr class="text-center" style="text-align:center;">
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:8px;border-right: 0.7px solid #000000;">' . $condu . '</td>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:8px;border-right: 0.7px solid #000000;">' . $dococndu . '</td>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:8px;border-right: 0.7px solid #000000;">' . $direccion . '</td>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:8px;border-right: 0.7px solid #000000;">' . $cel . '</td>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:8px;border-right: 0.7px solid #000000;">' . $licencia . '</td>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:8px;border-right: 0.7px solid #000000;">' . $ciudadcon . '</td>
				</tr>
			</tbody>
		</table>
		<table style="border: 0.7px solid #000000;" cellpading="1">
			<thead>
				<tr class="text-center" style="text-align:center;">
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: bold;border-right: 0.7px solid #000000;">CONDUCTOR Nro.2</th>
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: bold;border-right: 0.7px solid #000000;">DOCUMENTO IDENTIFICACIÓN</th>
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: bold;border-right: 0.7px solid #000000;">DIRECCIÓN CONDUCTOR 2</th>
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: bold;border-right: 0.7px solid #000000;">TÉLEFONO</th>
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: bold;border-right: 0.7px solid #000000;">N° LICENCIA</th>
					<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: bold;border-right: 0.7px solid #000000;">CIUDAD CONDUCTOR 2</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:8px;border-right: 0.7px solid #000000;"></td>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:8px;border-right: 0.7px solid #000000;"></td>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:8px;border-right: 0.7px solid #000000;"></td>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:8px;border-right: 0.7px solid #000000;"></td>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:8px;border-right: 0.7px solid #000000;"></td>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:8px;border-right: 0.7px solid #000000;"></td>
				</tr>
			</tbody>
		</table>
		<table style="border: 0.7px solid #000000;" cellpading="1">
			<thead>
			<tr class="text-center" style="text-align:center;">
				<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: bold;border-right: 0.7px solid #000000;">POSEEDOR O TENEDOR VEHICULO</th>
				<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: bold;border-right: 0.7px solid #000000;">DOCUMENTO IDENTIFICACIÓN</th>
				<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: bold;border-right: 0.7px solid #000000;">DIRECCIÓN</th>
				<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: bold;border-right: 0.7px solid #000000;">TÉLEFONO</th>
				<th style="font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: bold;border-right: 0.7px solid #000000;">CIUDAD</th>
			</tr>
			</thead>
			<tbody>
				<tr class="text-center" style="text-align:center;">
						<td style="font-family: Arial, Helvetica, sans-serif;font-size:8px;border-right: 0.7px solid #000000;">' . $nombreten . '</td>
						<td style="font-family: Arial, Helvetica, sans-serif;font-size:8px;border-right: 0.7px solid #000000;">' . $doctene . '</td>
						<td style="font-family: Arial, Helvetica, sans-serif;font-size:8px;border-right: 0.7px solid #000000;">' . $direten . '</td>
						<td style="font-family: Arial, Helvetica, sans-serif;font-size:8px;border-right: 0.7px solid #000000;">' . $celten . '</td>
						<td style="font-family: Arial, Helvetica, sans-serif;font-size:8px;border-right: 0.7px solid #000000;">' . $cityten . '</td>
					</tr>
			</tbody>
		</table>
		<table style="border: 0.7px solid #000000;" cellpading="1">
			<thead>
				<tr class="text-center" style="text-align:center;">
					<th colspan="10" style="font-family: Arial, Helvetica, sans-serif;text-align:center;border: 0.7px solid #000000;background-color:#9FA6B2;font-weight:bold;font-size:9px;">INFORMACIÓN DE LA MERCANCIA TRANSPORTADA</th>
				</tr>
			</thead>
		</table>

	';

$pdf->Ln(17);
//$pdf->writeHTML($tabla, false, false, false, false, '');
$pdf->writeHTML($tabla2, false, false, false, false, '');
$pdf->SetFont('times', '', 9);
$tablad = '
	<table style="border: 0.7px solid #000000;" cellpading="2">
				<tr class="text-center" style="text-align:center;">
					<th colspan="5" style="font-family: Arial, Helvetica, sans-serif;text-align:center;font-weight: bold;font-size:8px;border-right: 0.7px solid #000000;">Información Mercancía</th>
					<th style="font-family: Arial, Helvetica, sans-serif;text-align:center;font-weight: bold;font-size:8px;border-right: 0.7px solid #000000;width:120px;">Información Remitente</th>
					<th style="font-family: Arial, Helvetica, sans-serif;text-align:center;font-weight: bold;font-size:8px;border-right: 0.7px solid #000000;width:129.5px;">Información Destinatario</th>
					<th style="font-family: Arial, Helvetica, sans-serif;text-align:center;font-weight: bold;font-size:8px;width:55px;">Dueño poliza</th>
				</tr>
				<tr class="text-center" style="text-align:center;">
					<th style="font-family: Arial, Helvetica, sans-serif;text-align:center;border: 0.7px solid #000000;font-weight:bold;font-size:8px;width:60px;">N° Remesa</th>
					<th style="font-family: Arial, Helvetica, sans-serif;text-align:center;border: 0.7px solid #000000;font-weight:bold;font-size:8px;width:90px;">Unidad</th>
					<th style="font-family: Arial, Helvetica, sans-serif;text-align:center;border: 0.7px solid #000000;font-weight:bold;font-size:8px;width:70px;">Cantidad</th>
					<th style="font-family: Arial, Helvetica, sans-serif;text-align:center;border: 0.7px solid #000000;font-weight:bold;font-size:8px;width:60px;">Naturaleza</th>
					<th style="font-family: Arial, Helvetica, sans-serif;text-align:center;border: 0.7px solid #000000;font-weight:bold;font-size:8px;width:177px;">Empaque</th>
					<th style="font-family: Arial, Helvetica, sans-serif;text-align:center;font-weight: bold;font-size:8px;border: 0.7px solid #000000;width:150px;">NIT/CC Nombre/Razón Social</th>
					<th style="font-family: Arial, Helvetica, sans-serif;text-align:center;font-weight: bold;font-size:8px;border: 0.7px solid #000000;width:151px;">NIT/CC Nombre/Razón Social</th>
				</tr>
	</table>';

$pdf->SetFont('times', '', 1);
$tablad .= '<table cellpading="1">
		<thead></thead>
		<tbody>
		';
$cont = 0;
$natur = "";

//for($i=0; $i< $tot_remesas; $i++){
if ($cont <= 1) {
	try {
		$Data = new Database2;
		$sql = "SELECT r.id, d.tipo_servicio_mer, d.cantidad_empaque,
		d.naturaleza, d.tipo_mercancia, te.empaque, co.nombre_cliente,
		aa.nombre AS nomdest, aa.documento AS docdest,
		bb.nombre AS nomrem, bb.documento AS docrem,
		CONCAT(ori.municipio,'-',ori.depto) AS origen_rem,
		CONCAT(dest.municipio,'-',dest.depto) AS destino_rem
		FROM cmx_manifiesto_remesa  mr
		INNER JOIN cmx_remesa r ON mr.id_remesa=r.id AND mr.estado=1 AND mr.estado_rem_rndc=1
		INNER JOIN cmx_remesa_ordencargue ro ON  r.id=ro.id_remesa
		INNER JOIN cmx_orden_cargue o ON ro.id_orden_cargue=o.id
		INNER JOIN cmx_solicitud_vehiculo2 se ON o.mer_idservicio=se.nundoc_solicitud
		INNER JOIN cmx_destinatarios_ss des ON r.id_destinatario=des.id
		INNER JOIN cmx_remitente_destinatario aa ON des.cliente=aa.id
		INNER JOIN cmx_ruta_puntosentrega rem ON o.id_remitente=rem.id
		INNER JOIN cmx_remitente_destinatario bb ON rem.cliente=bb.id
		INNER JOIN cmx_detalle_mercancia2 d ON se.idpareja_origen_destino=d.id
		INNER JOIN cmx_para_tipo_empaque te ON te.id=d.tipo_empaque
		INNER JOIN cmx_cotizaciones_serviciocliente co ON d.n_cotizacion=co.n_cotizacion
		INNER JOIN cmx_municipios ori ON d.origen=ori.rndc_codigo_ciudad
		INNER JOIN cmx_municipios dest ON d.destino=dest.rndc_codigo_ciudad
		INNER JOIN cmx_vehiculos ve ON o.ve_idcarro=ve.numdoc_vehiculo
		WHERE mr.id_manifiesto=$id_manif";

		$resultado = $Data->query($sql);
		$resultado->setFetchMode(PDO::FETCH_ASSOC);
		//$resultado->fetchall();
		foreach ($resultado as $key => $value) {
			if ($value["naturaleza"] == 1) {
				$natur = "Carga normal";
			}
			if ($value["naturaleza"] == 2) {
				$natur = "Carga peligrosa";
			}
			if ($value["naturaleza"] == 3) {
				$natur = "Carga extradimensionada";
			}
			if ($value["naturaleza"] == 4) {
				$natur = "Carga extrapesada";
			}
			if ($value["naturaleza"] == 5) {
				$natur = "Residuos Peligrosos";
			}
			if ($value["naturaleza"] == 6) {
				$natur = "Semovientes";
			}
			if ($value["naturaleza"] == 7) {
				$natur = "Refrigerada";
			}
			$tablad .= '<tr class="text-center">
								<td style="font-family: Arial, Helvetica, sans-serif;font-size:8px;border-left: 0.7px solid #000000;border-right: 0.7px solid #000000;width:60px;text-align:center;">' . $value["id"] . '</td>
								<td style="font-family: Arial, Helvetica, sans-serif;font-size:8px;border-right: 0.7px solid #000000;width:90px;text-align:center;">Kilogramos</td>
								<td style="font-family: Arial, Helvetica, sans-serif;font-size:8px;border-right: 0.7px solid #000000;width:80px;text-align:center;width:70px;">' . $value["cantidad_empaque"] . '</td>
								<td style="font-family: Arial, Helvetica, sans-serif;font-size:8px;border-right: 0.7px solid #000000;text-align:center;width:61px;">' . $natur . '</td>
								<td style="font-family: Arial, Helvetica, sans-serif;font-size:8px;border-right: 0.7px solid #000000;width:177px;text-align:center;">' . $value["empaque"] . '/' . $value["tipo_mercancia"] . '</td>
								<td style="font-family: Arial, Helvetica, sans-serif;font-size:8px;border-right: 0.7px solid #000000;width:150px;text-align:left;">' . $value["nomrem"] . '' . $value["docrem"] . '</td>
								<td style="font-family: Arial, Helvetica, sans-serif;font-size:8px;border-right: 0.7px solid #000000;width:150px;text-align:left;">' . $value["nomdest"] . '' . $value["docdest"] . '</td>
								<td style="font-family: Arial, Helvetica, sans-serif;font-size:8px;border-right: 0.7px solid #000000;width:55px;text-align:center;">' . $value["nombre_cliente"] . '</td>
								</tr>';
		}
		$cont = $cont + 1;
	} catch (PDOException $e) {
		$error = $e->getMessage();
		$this->_db3->rollBack();
	}
}

$pdf->SetFont('times', '', 9);
$tablad .= '</tbody>
	</table>
';
$pdf->writeHTML($tablad, false, false, false, false, '');

$cadena_sin_puntos = str_replace(',', '', $valort);
// Convierte la cadena en un número entero
$numero_entero = intval($cadena_sin_puntos);

$tabla_valores = '
<table  style="border: 0.7px solid #000000;">
		<tr style="text-align:center;">
			<th colspan="6" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;background-color:#9FA6B2;font-weight:bold;"><strong>VALORES</strong></th>
			<th colspan="4" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;background-color:#9FA6B2;font-weight:bold;"></th>
			<th colspan="6" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;text-align:center;background-color:#9FA6B2;font-weight:bold;"><strong>OBSERVACIONES</strong></th>
		</tr>
		<tr>
			<th colspan="4" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;text-align:left;font-weight:bold;">VALOR TOTAL DEL VIAJE</th>
			<th colspan="2" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;text-align:rigth;">$ ' . number_format($valort, 2, ',', '.') . '</th>
			<th rowspan="2" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;text-align:center;font-weight:bold;">LUGAR</th>
			<th rowspan="2" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;text-align:rigth;position: absolute;top: 50%;left: 50%; margin: -25px 0 0 -25px;">' . strtoupper($Lugar) . '</th>
			<th rowspan="2" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;text-align:center;font-weight:bold;">FECHA</th>
			<th rowspan="2" colspan="1" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;text-align:rigth;">' . $fecha_pago . '</th>
			<th colspan="12" rowspan="6" style="text-align:left;border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:7px;">' . $observacion . '<br> CEL CONDUC: ' . $cel . ' <br> PEDIDO: </th>
		</tr>
		<tr class="text-center" style="text-align:center;">
			<th colspan="4" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;text-align:left;font-weight:bold;">RETENCIÓN EN LA FUENTE</th>
			<th colspan="2" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;text-align:rigth;">$ ' . $reten . '</th>
		</tr>
		<tr class="text-center" style="text-align:center;">
			<th colspan="4" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;text-align:left;font-weight:bold;">RETENCIÓN ICA</th>
			<th colspan="2" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;text-align:rigth;">$ ' . $reteica . '</th>
			<th colspan="4" rowspan="2" style="border-right: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;text-align:left;"><b>CARGUE PAGADO POR: </b> ' . strtoupper($cargue_pagado) . '</th>
		</tr>
		<tr class="text-center" style="text-align:center;">
			<th colspan="4" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;text-align:left;font-weight:bold;">VALOR NETO A PAGAR</th>
			<th colspan="2" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;text-align:rigth;">$ ' . $neto . '</th>
		</tr>
		<tr class="text-center" style="text-align:center;">
			<th colspan="4" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;text-align:left;font-weight:bold;">VALOR ANTICIPO</th>
			<th colspan="2" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;text-align:rigth;">$ ' . $antici . '</th>
			<th colspan="4" rowspan="2" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;text-align:left;"><b>DESCARGUE PAGADO POR: </b> ' . strtoupper($descargue) . '</th>
		</tr>
		<tr class="text-center" style="text-align:center;">
			<th colspan="4" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;text-align:left;font-weight:bold;">SALDO A PAGAR</th>
			<th colspan="2" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;text-align:rigth;">$ ' . $saldo . '</th>
		</tr>
		<tr class="text-center" style="text-align:center;">
			<th colspan="4" style="font-family: Arial, Helvetica, sans-serif;font-size:9px;text-align:left;font-weight:bold;">VALOR TOTAL DEL VIAJE EN LETRAS:</th>
			<th colspan="8" style="font-family: Arial, Helvetica, sans-serif;font-size:9px;text-align:left;">' . $formatter->toMoney($numero_entero, 2, 'pesos', 'centavos') . '</th>
		</tr>
		<tr class="text-center" style="text-align:center;">
			<th colspan="6" style="font-family: Arial, Helvetica, sans-serif;font-size:7px;text-align:left;border: 0.7px solid #000000;">Si es víctima de algún fraude o conoce de alguna irregularidad en el Registro Nacional de Despachos de
			Carga RNDC denúncielo a la Superintendencia de Puertos y Transporte, en la línea gratuita nacional 018000 915615 y a través del correo electrónico: atencionciudadano@supertransporte.gov.co</th>
		<th colspan="6" style="font-family: Arial, Helvetica, sans-serif;font-size:8px;text-align:left;border: 0.7px solid #000000;text-align:center;font-weight:bold;">FIRMA Y HUELLA TITULAR MANIFIESTO</th>
		<th colspan="6" style="font-family: Arial, Helvetica, sans-serif;font-size:8px;text-align:left;border: 0.7px solid #000000;text-align:center;font-weight:bold;">FIRMA Y HUELLA TITULAR DEL CONDUCTOR</th>
	</tr>

</table>
';

$pdf->writeHTML($tabla_valores, false, false, false, false, '');
if ($cont > 1) {
	$pdf->AddPage();
	$tabla_remesas = '<div class="col-md-12"><table border="1" cellpading="1"><thead>
		<tr class="text-center" style="text-align:center;">
			<th colspan="5">Información Mercancía</th>
			<th>Información Remitente</th>
			<th>Información Destinatario</th>
			<th>Dueño poliza</th>
		</tr>
		<tr>
		<th>N° Remesa</th>
		<th>Unidad</th>
		<th>Cantidad</th>
		<th>Naturaleza</th>
		<th>Empaque</th>
		<th>Remitente</th>
		<th>Destinatario</th>
		<th>Dueño</th>
		</tr>
		</thead><tbody>';
	$natur = "";
	for ($i = $cont; $i < $tot_remesas; $i++) {

		$Data = new Database2;
		$sql = "SELECT r.id, d.tipo_servicio_mer, d.cantidad_empaque,
				d.naturaleza, d.tipo_mercancia, te.empaque,
				co.nombre_cliente,
				aa.nombre AS nomdest, aa.documento AS docdest,
				bb.nombre AS nomrem, bb.documento AS docrem,
				CONCAT(ori.municipio,'-',ori.depto) AS origen_rem,
				CONCAT(dest.municipio,'-',dest.depto) AS destino_rem
				FROM cmx_manifiesto_remesa  mr
				INNER JOIN cmx_remesa r ON mr.id_remesa=r.id
				INNER JOIN cmx_remesa_ordencargue ro ON  r.id=ro.id_remesa
				INNER JOIN cmx_orden_cargue o ON ro.id_orden_cargue=o.id
				INNER JOIN cmx_solicitud_vehiculo2 se ON o.mer_idservicio=se.nundoc_solicitud
				INNER JOIN cmx_destinatarios_ss des ON r.id_destinatario=des.id
				INNER JOIN cmx_remitente_destinatario aa ON des.cliente=aa.id
				INNER JOIN cmx_ruta_puntosentrega rem ON o.id_remitente=rem.id
				INNER JOIN cmx_remitente_destinatario bb ON rem.cliente=bb.id
				INNER JOIN cmx_detalle_mercancia2 d ON se.idpareja_origen_destino=d.id
				INNER JOIN cmx_para_tipo_empaque te ON te.id=d.tipo_empaque
				INNER JOIN cmx_cotizaciones_serviciocliente co ON d.n_cotizacion=co.n_cotizacion
				INNER JOIN cmx_municipios ori ON d.origen=ori.rndc_codigo_ciudad
				INNER JOIN cmx_municipios dest ON d.destino=dest.rndc_codigo_ciudad
				INNER JOIN cmx_vehiculos ve ON o.ve_idcarro=ve.numdoc_vehiculo
				WHERE mr.id_manifiesto=$id_manif";
		$resultado = $Data->query($sql);
		$resultado->setFetchMode(PDO::FETCH_ASSOC);
		foreach ($resultado as $key => $value) {
			if ($value["naturaleza"] == 1) {
				$natur = "Carga normal";
			}
			if ($value["naturaleza"] == 2) {
				$natur = "Carga peligrosa";
			}
			if ($value["naturaleza"] == 3) {
				$natur = "Carga extradimensionada";
			}
			if ($value["naturaleza"] == 4) {
				$natur = "Carga extrapesada";
			}
			if ($value["naturaleza"] == 5) {
				$natur = "Residuos Peligrosos";
			}
			if ($value["naturaleza"] == 6) {
				$natur = "Semovientes";
			}
			if ($value["naturaleza"] == 7) {
				$natur = "Refrigerada";
			}
			$tabla_remesas .= '<tr class="text-center" style="text-align:center;">
					<td>' . $value["id"] . '</td>
					<td>Kilogramos</td>
					<td>' . $value["cantidad_empaque"] . '</td>
					<td>' . $natur . '</td>
					<td>' . $value["empaque"] . '/' . $value["tipo_mercancia"] . '</td>
					<td>' . $value["nomrem"] . '' . $value["docrem"] . '</td>
					<td>' . $value["nomdest"] . '' . $value["docdest"] . '</td>
					<td>' . $value["nombre_cliente"] . '</td>
				</tr>';
		}
	}
	$tabla_remesas .= '</tbody></table></div></div>';
	$pdf->Ln(18);
	$pdf->writeHTML($tabla_remesas, false, false, false, false, '');
}

//$pdf->writeHTML($tabla_rem, false, false, false, false, '');

//******************************SEGUNDA PAGINA*********************
$pdf->AddPage();
$tabla_tiempos = '
<table style="text-align:center;" >
	<tr>
		<td colspan="1">
				<img src="' . $image_file . '" alt="" width="150">
		</td>
		<td>
				<table>
					<tr>
						<th  style="font-family: Arial, Helvetica, sans-serif;font-size:9px;font-weight: bold;">MANIFIESTO ELECTRONICO DE CARGA</th>
					</tr>
					<tr>
						<th  style="font-family: Arial, Helvetica, sans-serif;font-size:7px;font-weight: bold;text-align: center;">NIT. NEXOS CARGOS SAS</th>
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
			<table>
				<tr>
						<th style="font-family: Arial, Helvetica, sans-serif;font-size:6px;text-align: justify;">
						"La impresión en soporte cartular (papel) de este acto administrativo producido por
						medios electrónicos en cumplimiento de la ley 527 de 1999 (Articulos 6 al 13) y de la
						ley 962 de 2005 (Articulo 6), es una reproducción del documento original que se
						encuentra en formato electrónico firmado digitalmente en la base de datos del
						RNDC del Ministerio de Transporte, cuya representación digital goza de autenticidad,
						integridad y no repudio."
						</th>
				</tr>
				<tr>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:8px;text-align: center;font-weight: 900;"><b>Manifiesto: </b> ' . $num_mnf . '</td>
				</tr>
				<tr>
					<td style="font-family: Arial, Helvetica, sans-serif;font-size:8px;text-align: center;font-weight: 900;"><b>Autorización:</b> ' . $ingresoid . '</td>
				</tr>
			</table>
		</td>
	</tr>
</table>

<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
	<label>Placa:    ' . $placa . '     </label>
	<label>Nombre del Conductor:     ' . $condu . '      </label>
	<label>CC:   ' . $dococndu . '      </label>
</div>
<table style="border: 0.7px solid #000000;">
		<thead>
			<tr>
				<th rowspan="2" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;text-align:center;background-color:#9FA6B2;font-weight:bold;">Número Remesa</th>
				<th colspan="2" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;text-align:center;background-color:#9FA6B2;font-weight:bold;">Horas pactada</th>
				<th colspan="2" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;text-align:center;background-color:#9FA6B2;font-weight:bold;">Llegada al lugar del cargue</th>
				<th colspan="2" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;text-align:center;background-color:#9FA6B2;font-weight:bold;">Salida lugar del cargue</th>
				<th rowspan="2" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;text-align:center;background-color:#9FA6B2;font-weight:bold;">Firma Remitente</th>
				<th rowspan="2" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;text-align:center;background-color:#9FA6B2;font-weight:bold;">Firma  Conductor</th>
				<th colspan="2" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;text-align:center;background-color:#9FA6B2;font-weight:bold;">Llegada lugar Descargue</th>
				<th colspan="2" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;text-align:center;background-color:#9FA6B2;font-weight:bold;">Salida del lugar Descargue</th>
				<th rowspan="2" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;text-align:center;background-color:#9FA6B2;font-weight:bold;">Firma Destinatario</th>
				<th rowspan="2" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;text-align:center;background-color:#9FA6B2;font-weight:bold;">Firma  Conductor</th>
			</tr>
			<tr>
				<th style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:7px;text-align:center;background-color:#9FA6B2;font-weight:bold;">Cargue</th>
				<th style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:7px;text-align:center;background-color:#9FA6B2;font-weight:bold;">Descargue</th>
				<th style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:7px;text-align:center;background-color:#9FA6B2;font-weight:bold;">Fecha</th><th style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:7px;text-align:center;background-color:#9FA6B2;font-weight:bold;">Hora</th>
				<th style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:7px;text-align:center;background-color:#9FA6B2;font-weight:bold;">Fecha</th> <th style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:7px;text-align:center;background-color:#9FA6B2;font-weight:bold;">Hora</th>
				<th style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:7px;text-align:center;background-color:#9FA6B2;font-weight:bold;">Fecha</th> <th style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:7px;text-align:center;background-color:#9FA6B2;font-weight:bold;">Hora</th>
				<th style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:7px;text-align:center;background-color:#9FA6B2;font-weight:bold;">Fecha</th> <th style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:7px;text-align:center;background-color:#9FA6B2;font-weight:bold;">Hora</th>
			</tr>
		</thead>
		<tbody>';

for ($i = 1; $i <= 20; $i++) {
	$tabla_tiempos .= '<tr>
				<td style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;text-align:center;"></td>
				<td style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;text-align:center;"></td>
				<td style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;text-align:center;"></td>
				<td style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;text-align:center;"></td>
				<td style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;text-align:center;"></td>
				<td style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;text-align:center;"></td>
				<td style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;text-align:center;"></td>
				<td style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;text-align:center;"></td>
				<td style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;text-align:center;"></td>
				<td style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;text-align:center;"></td>
				<td style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;text-align:center;"></td>
				<td style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;text-align:center;"></td>
				<td style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;text-align:center;"></td>
				<td style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;text-align:center;"></td>
				<td style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;text-align:center;"></td>
				<td style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;text-align:center;"></td>
				<td style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;text-align:center;"></td>
				<td style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;text-align:center;"></td>
				<td style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;text-align:center;"></td>
			</tr>';
}
$tabla_tiempos .= '</tbody>
		</table>';
$pdf->Ln(18);
$pdf->writeHTML($tabla_tiempos, false, false, false, false, '');

// $pdf->Output();$placa
// $pdf->Output('MANIFIESTO.pdf' . date("Y-m-d H:m:s") . "-" . $placa, 'I');
$pdf->Output('MANIFIESTO_' . date("Y-m-d_H-i-s") . "_" . $placa . '.pdf', 'I');
