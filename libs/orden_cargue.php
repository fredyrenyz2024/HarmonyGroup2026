<?php
include("../application/Config.php");
include '../application/Conexion.php';
// include('../Controllers/transporte.php');
//traer datos por URL
session_start();
$id_usuario = $_SESSION["usuario"]["nom_usuario"];
$fecha_sistem = date('Y-m-d');
$hora_sistem = date('H:i:s');
$num_orden = base64_decode($_GET["n_orden"]);

/**
 * Creates an example PDF TEST document using TCPDF
 * @package com.tecnick.tcpdf
 * @abstract TCPDF - Example: Default Header and Footer
 * @author Nicola Asuni
 * @since 2008-03-04
 */
include('Nuevacarpeta/tcpdf.php');
class MYPDF extends TCPDF
{
	public function Header()
	{
	}
}

//instanciar la clase
$pdf = new MYPDF('P', PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
// $pdf = new MYPDF();
//encabezado
$pdf->SetCreator(PDF_CREATOR);
$pdf->SetAuthor('Nexos Cargo');
$pdf->SetTitle('Orden cargue' . $num_orden);
// Establecer los márgenes para centrar el contenido (en milímetros)
$pdf->AddPage();
//Tabla datos del cliente
$ruta = 'Nuevacarpeta/examples/images/';

$image_file = $ruta . 'logonexos.png';
$image_files = $ruta . 'logos.png';

//Consulta para armar los pdf
$conexion = new Database2();
$detalle_orden = $conexion->prepare("SELECT oc.id, oc.ve_fletecotizacion, oc.ve_fletepactado,oc.ve_idestudiosegu, oc.mer_idservicio, oc.mer_producto,
				oc.mer_empaque, oc.mer_cantidad, oc.mer_pesomercancia,oc.mer_volumen, oc.mer_contenedor1, oc.mer_contenedor2,
				oc.ca_condiciones, oc.ca_observacion, oc.ca_embalaje,oc.ca_fechacargue, oc.ca_horacargue, oc.ca_pesocargue,
				ve.placa, b.color, b.anio_fabricacion, b.marca, b.cod_rndc_carroceria,
				b.tipo_vinculacion, b.clase_vehiculo, co.nombre AS nombreconductor, co.apellido1, co.apellido2,co.numero_documento, co.celular,
				cli.nombre AS cliente, cli.documento, t.placa AS placatrailer,rd.nombre, rtp.direccion_entrega, rtp.telefono,
				mre.municipio AS origen,colo.color AS color_texto,desi.nombre AS destinatario,bdes.direccion_entrega AS dire_destinatario,
				bdes.telefono AS tel_destinatario,mde.municipio AS destino,ma.marca AS marca_letra,oc.mer_idservicio AS solicitud_servicio,ag.nombre AS Nombre_Agencia,ss.nundoc_solicitud,ss.observaciones AS observaciones_solicitud,oc.fecha_orden
				FROM cmx_orden_cargue oc
				INNER JOIN cmx_vehiculos ve ON oc.ve_idcarro=ve.numdoc_vehiculo
				INNER JOIN cmx_vehiculo2 b ON ve.numdoc_vehiculo=b.id_vehiculo
				INNER JOIN cmx_proveedores co ON oc.ve_id_conductor=co.numdoc_nexos
				INNER JOIN cmx_clientes cli ON oc.cli_id=cli.id
				LEFT JOIN cmx_rndc_clase_vehiculo cl ON b.clase_vehiculo=cl.id
				LEFT JOIN cmx_rndc_vehiculos_color colo ON b.color=colo.id
				LEFT JOIN cmx_rndc_vehiculos_marcas ma ON b.marca=ma.id
				LEFT JOIN cmx_trailer t ON oc.ve_idtrailer=t.id
				LEFT JOIN cmx_ruta_puntosentrega rtp ON oc.id_remitente=rtp.id
				LEFT JOIN cmx_remitente_destinatario rd ON rtp.cliente=rd.id
				LEFT JOIN cmx_municipios mre ON rtp.municipio_entrega=mre.id
				LEFT JOIN cmx_destinatarios_ss bdes ON rtp.id_punto=bdes.id_punto AND bdes.solicitud_servicio=oc.mer_idservicio
				LEFT JOIN cmx_remitente_destinatario desi ON bdes.cliente=desi.id
				LEFT JOIN cmx_municipios mde ON bdes.municipio_entrega=mde.id
        LEFT JOIN cmx_solicitud_vehiculo2 ss ON oc.mer_idservicio=ss.nundoc_solicitud
        LEFT JOIN cmx_agencias ag ON ss.agencia=ag.id
				WHERE oc.id=$num_orden");
$detalle_orden->execute();
$fila = $detalle_orden->fetch(PDO::FETCH_ASSOC);
$agencia = $fila['Nombre_Agencia'];
$cliente = $fila['cliente'];
$nit = $fila['documento'];
$mark = $fila['marca_letra'];
$plak = $fila['placa'];
$modelo = $fila['anio_fabricacion'];
if ($fila['placatrailer'] != null && $fila['placatrailer'] != null) {
	$trailern = $fila['placatrailer'];
} else {
	$trailern = '';
}
$color = $fila['color_texto'];
$conductor = $fila['nombreconductor'] . ' ' . $fila['apellido1'] . ' ' . $fila['apellido2'];
$cedula = $fila['numero_documento'];
$solicitud_servicio = $fila['nundoc_solicitud'];
$remorigen = $fila['origen'];
$remitente = $fila['nombre'];
$remdire = $fila['direccion_entrega'];
$telefono = $fila['telefono'];
$destinatario = $fila['destinatario'];
$destino = $fila['destino'];
$destidire = $fila['dire_destinatario'];
$destitel = $fila['tel_destinatario'];
$condici = $fila['ca_condiciones'];
$obscargue = $fila['observaciones_solicitud'];
$embalaje = $fila['ca_embalaje'];
$fecha_orden = $fila['fecha_orden'];

//Consultar precintos
$precintos = $conexion->prepare("SELECT * FROM cmx_planilla_detalle2 WHERE id_planilla=$num_orden");
$precintos->execute();
$precintos_array = $precintos->fetchAll(PDO::FETCH_ASSOC);

$lista_precintos = '';  // Inicializa la variable para almacenar los valores concatenados
foreach ($precintos_array as $key => $value) {
	$lista_precintos .= $value['serie_precinto'] . ', ';
}

// Elimina la última coma y espacio si existen
$lista_precintos = rtrim($lista_precintos, ', ');


$html = '
		<table style="text-align:center;" >
				<tr>
					<td>
							<img src="' . $image_file . '" alt="" width="125">
					</td>
					<td>
							<table>
								<tr>
									<th style="font-family: Arial, Helvetica, sans-serif;font-size:11px;font-weight: bold;">ORDEN DE CARGUE</th>
								</tr>
								<tr>
									<th style="font-family: Arial, Helvetica, sans-serif;font-size:7px;font-weight: bold;text-align: center;">NEXOS CARGOS SAS</th>
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
									<th colspan="2" style="font-family: Arial, Helvetica, sans-serif;font-size:11px;"><b>ORDEN No. ' . $num_orden . '</b></th>
								</tr>
								<tr>
									<td style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;font-weight: 900;"><b>FECHA</b></td>
									<td style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:9px;font-weight: 900;"><b>AGENCIA</b></td>
								</tr>
								<tr>
									<td style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: 900;">' . $fecha_orden . '</td>
									<td style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: 900;">' . $agencia . '</td>
								</tr>
							</table>
					</td>
				</tr>
		</table>
		
		<table class="margined-table" style="border: 0.7px solid #000000;">
			<tr class="text-center" style="text-align:center;">
				<th class="text-center" colspan="2" style="font-family: Arial, Helvetica, sans-serif;font-size:7px;font-weight: 900;"><strong>DATOS DEL CLIENTE</strong></th>
			</tr>
			<tr>
				<th class="text-center" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: 900;"><strong>Nombre:  </strong>' . $cliente . '</th>
				<th class="text-center" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: 900;"><strong>Nit o CC. No:  </strong>' . $nit . '</th>
			</tr>
		</table>
		
		<table class="margined-table" style="border: 0.7px solid #000000;">
			<tr class="text-center" style="text-align:center;">
				<th class="text-center" colspan="5" style="font-family: Arial, Helvetica, sans-serif;font-size:7px;font-weight: 900;"><strong>DATOS DEL VEHÍCULO</strong></th>
			</tr>
			<tr>
				<th class="text-center"style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;"><strong>Marca:</strong> ' . $mark . '</th>
				<th class="text-center"style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;"><strong>Placa:</strong> ' . $plak . '</th>
				<th class="text-center"style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;"><strong>Modelo:</strong> ' . $modelo . '</th>
				<th class="text-center"style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;"><strong>Trailer:</strong> ' . $trailern . ' </th>
				<th class="text-center"style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;"><strong>Color:</strong> ' . $color . '</th>
			</tr>
			<tr>
				<th class="text-center"colspan="3"style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;"><strong>Conductor:</strong>  ' . $conductor . ' </th>
				<th class="text-center"style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;"><strong>CC:</strong> ' . $cedula . '</th>
				<th class="text-center"style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;"><strong>O. servicio:</strong>' . $solicitud_servicio . '</th>
			</tr>
		</table>
		
		<table class="margined-table" style="border: 0.7px solid #000000;">
			<tr  style="text-align:center;">
				<th class="text-center" style="font-family: Arial, Helvetica, sans-serif;font-size:7px;font-weight: 900;"><strong>DATOS DEL REMITENTE</strong></th>
				<th style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;text-align:left;"><strong>Origen:</strong> ' . $remorigen . '</th>
			</tr>
		</table>

		<table>
			<tr>
				<th class="text-center"style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;"><strong>Nombre:</strong> ' . $remitente . '</th>
				<th class="text-center"style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;"><strong>Dirección:</strong> ' . $remdire . '</th>
				<th class="text-center"style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;"><strong>Teléfono:</strong> ' . $telefono . '</th>
			</tr>
		</table>

		<table style="border: 0.7px solid #000000;">
			<tr class="text-center" style="text-align:center;">
				<th class="text-center" colspan="4" style="font-family: Arial, Helvetica, sans-serif;font-size:7px;font-weight: 900;"><strong>DATOS DEL DESTINATARIO</strong></th>
			</tr>
			<tr>
				<th class="text-center" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;text-align:center;"><strong>Nombre</strong></th>
				<th class="text-center" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;text-align:center;"><strong>Destino</strong></th>
				<th class="text-center" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;text-align:center;"><strong>Dirección</strong></th>
				<th class="text-center" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;text-align:center;"><strong>Teléfono</strong></th>
			</tr>
			<tr>
				<th class="text-center" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;"> ' . $destinatario . '</th>
				<th class="text-center" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;">' . $destino . '</th>
				<th class="text-center" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;"> ' . $destidire . '</th>
				<th class="text-center" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;"> ' . $destitel . '</th>
			</tr>
		</table>

		<table style="border: 0.7px solid #000000;">
			<tr class="text-center" style="text-align:center;">
				<th class="text-center" colspan="4" style="font-family: Arial, Helvetica, sans-serif;font-size:7px;font-weight: 900;"><strong>DATOS GENERALES</strong></th>
			</tr>
			<tr>
				<th class="text-center"style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;"><strong>Condiciones especiales del cargue:</strong></th>
				<td colspan="3"style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;">' . $condici . '</td>
			</tr>
			<tr>
				<th class="text-center"style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;"><strong>Precintos:</strong></th>
				<td colspan="4"style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;">' . $lista_precintos . '</td>
			</tr>
			<tr>
				<th class="text-center"style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;"><strong>Observaciones adicionales:</strong></th>
				<td colspan="3"style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;">' . $obscargue . '</td>
			</tr>
			<tr>
				<th class="text-center"style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;"><strong>Recomendaciones:</strong></th>
				<td colspan="3"style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;">' . $embalaje . '</td>
			</tr>
		</table>

		<table style="border: 0.7px solid #000000;" cellpading="2">
			<tr>
				<th class="text-center" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;"><strong>Elaborado por:</strong> ' . $id_usuario . '</th>
				<th class="text-center" style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;"><strong>Recibido:</strong></th>
				<th  style="border: 0.7px solid #000000;font-family: Arial, Helvetica, sans-serif;font-size:8px;text-align:center;"><img src="' . $image_files . '" alt="Sin foto" width="80" height:150;></th>
			</tr>
		</table>
		<br>
		<br>
		<br>
';

// Repetir el contenido del contenedor dos veces
for ($i = 0; $i < 2; $i++) {
	$pdf->Ln(8);
	$pdf->writeHTML($html, true, false, true, false, '');
	if ($i < 1) {
		$pdf->writeHTML('<hr><br>', true, false, true, false, ''); // Agregar una nueva página después de la primera repetición
	}
}

//FINAL DEL DOCUMENTO
ob_end_clean();
$pdf->Output('Orden Cargue.pdf' . date("Y-m-d H:m:s") . "-" . $plak, 'I');
