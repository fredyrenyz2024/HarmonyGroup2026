<?php
include("../application/Config.php");
include '../application/Conexion.php';
// include('../Controllers/transporte.php');
//traer datos por URL
session_start();
$id_usuario = $_SESSION["usuario"]["nom_usuario"];
$fecha_sistem = date('Y-m-d');
$hora_sistem = date('H:i:s');
$num_orden = base64_decode($_GET["manifiesto"]);

include('Nuevacarpeta/tcpdf.php');

// Crear una nueva instancia de la clase MYPDF
class MYPDF extends TCPDF
{
  public function Header()
  {
    //Consulta para armar los pdf
    // $conexion = new Database2();
    // $detalle_manifiesto = $conexion->prepare("SELECT ma.placa,CONCAT(ma.fecha_expedicion ,'-', ma.hora_expedicion) AS fecha_despacho
    // FROM cmx_manifiesto ma 
    // INNER JOIN cmx_manifiesto_remesa mr ON ma.id = mr.id_manifiesto
    // INNER JOIN cmx_remesa rm ON mr.id_remesa = rm.id
    // INNER JOIN cmx_remesa_ordencargue ro ON rm.id = ro.id_remesa
    // INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue=oc.id
    // WHERE ma.id=" . base64_decode($_GET["manifiesto"]) . "");
    // $detalle_manifiesto->execute();
    // $fila = $detalle_manifiesto->fetch(PDO::FETCH_ASSOC);
    // $placa = $fila['placa'];
    // $fecha_expedicion = $fila['fecha_despacho'];
    // //Tabla datos del cliente
    // $ruta = 'Nuevacarpeta/examples/images/';
    // $image_file = $ruta . 'logo-combinado.png';
    // $this->Ln(5);
    // $html = '
    // <table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse: collapse; text-align:left;">
    // 		<tr>
    //       <td style="width: 145px;">
    //         <table>
    //           <tr>
    //             <td style="text-align: left;">
    //               <img src="' . $image_file . '" alt="" width="200">
    //             </td>
    //           </tr>
    //         </table>
    //       </td>
    // 			<td style="width: 160px;">
    // 					<table>
    // 						<tr>
    // 							<th style="font-family: Arial, Helvetica, sans-serif;font-size:14px;font-weight: bold;text-align: center;color:#332D2D;">NEXOS CARGOS SAS</th>
    // 						</tr>
    // 						<tr>
    // 							<td style="font-family: Arial, Helvetica, sans-serif;font-size:10px;text-align: center;">NIT.9000062596-8</td>
    // 						</tr>
    // 						<tr>
    // 							<td style="font-family: Arial, Helvetica, sans-serif;font-size:10px;text-align: center;">CL 23 No. 116-31 Of. 301 <br> Bogotá - Colombia</td>
    // 						</tr>
    // 						<tr>
    // 							<td style="font-family: Arial, Helvetica, sans-serif;font-size:10px;text-align: center;">Tel. 7452882 - 3186061986</td>
    // 						</tr>
    // 				</table>
    // 			</td>
    // 			<td style="width: 230px;text-align: center;padding: 1px 1px 1px 1px;">
    //         <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: separate; border-spacing: 0; border-radius: 8px; overflow: hidden;">
    //             <tr>
    //                <td colspan="2" style="font-family: Arial, Helvetica, sans-serif;font-size:10px;font-weight:bold;width: 230px;text-align: left;">
    //                   CONTACTO AREA DE SEGURIDAD Y TRAFICO
    //                 </td>
    //             </tr>
    //             <tr>
    //                 <td class="text-center" colspan="2" style="font-family: Arial, Helvetica, sans-serif;font-size:9px;">
    //                   Teléfono: 316 7432712
    //               </td>
    //             </tr>
    //         </table>
    //         <table cellpadding="2" cellspacing="0" border="0" style="border-collapse: separate; border-spacing: 0; border-radius: 1px; overflow: hidden;">
    //           <tr>
    //             <th colspan="2" style="font-family: Arial, Helvetica, sans-serif;font-size:8px;background-color:#E0E0E0;border: 0.7px solid #9FA6B2;width: 230px;">
    //               <b>TRAZABILIDAD MOVIMIENTO DE CARGA</b>
    //             </th>
    //           </tr>
    //           <tr>
    //             <td style="border: 0.7px solid #9FA6B2;font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: 900;"><b>Manifiesto</b></td>
    //             <td style="border: 0.7px solid #9FA6B2;font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: 900;"><b>Placa</b></td>
    //           </tr>
    //           <tr>
    //             <td style="border: 0.7px solid #9FA6B2;font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: 900;">' . base64_decode($_GET["manifiesto"]) . '</td>
    //             <td style="border: 0.7px solid #9FA6B2;font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: 900;">' . $placa . '</td>
    //           </tr>
    //           <tr>
    //              <th style="background-color: #F5F5F5; width: 115px;font-weight: bold;border: 1px solid #ddd;font-size:9px;">Fecha del despacho</th>
    //              <td style="border: 1px solid #ddd;width: auto; white-space: nowrap;width: 115px;font-size:8px;">' . $fecha_expedicion . '</td>
    //           </tr>
    //         </table>
    // 			</td>
    // 		</tr>
    // </table>';

    // // Escribir el contenido HTML en el encabezado
    // $this->writeHTML($html, true, false, false, false, '');

  }
}

//instanciar la clase
$pdf = new MYPDF('A4', PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
$pdf->SetMargins(10, 5, 10); // Ajustar el margen superior para dejar espacio al encabezado
// Configurar las propiedades del documento
//encabezado
$pdf->SetCreator(PDF_CREATOR);
// Agregar una página
$pdf->AddPage();

// Establecer la fuente
$pdf->SetFont('helvetica', '', 10);

//Consulta para armar los pdf
$conexion = new Database2();
$detalle_manifiesto = $conexion->prepare("SELECT ma.placa,CONCAT(ma.fecha_expedicion ,'-', ma.hora_expedicion) AS fecha_despacho,cl.id AS cliente_id,cl.nombre,pl.nombre_plan AS plan_ruta,
CONCAT(mn1.municipio,'-', mn1.depto) AS 'origin', CONCAT(mn2.municipio,'-', mn2.depto) AS 'destini',CONCAT(cond.nombre,' ',cond.apellido1,' ',cond.apellido2) AS Conductor,
cond.numero_documento,/*CONCAT(cond.celular,' - ',dc.celular2) AS celulares*/cond.celular AS celular
FROM cmx_manifiesto ma 
INNER JOIN cmx_manifiesto_remesa mr ON ma.id = mr.id_manifiesto
INNER JOIN cmx_remesa rm ON mr.id_remesa = rm.id
INNER JOIN cmx_remesa_ordencargue ro ON rm.id = ro.id_remesa
INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue=oc.id
INNER JOIN cmx_clientes cl ON oc.cli_id = cl.id
INNER JOIN cmx_inicio_ruta i ON ma.id=i.num_manifiesto
INNER JOIN cmx_inici_manifiesto_estado est ON i.cod_inicio=est.cod_ini_ruta AND est.ultimo_estado=1
INNER JOIN cmx_estado_segui e ON est.estado=e.id
INNER JOIN cmx_plan_ruta pl ON i.cod_plan=pl.cod_plan
INNER JOIN cmx_rutas ru ON pl.cod_ruta=ru.id
INNER JOIN cmx_municipios mn1 ON ru.cod_ciudad_origen=mn1.id
INNER JOIN cmx_municipios mn2 ON ru.cod_ciudad_destino=mn2.id
INNER JOIN cmx_proveedores cond ON ma.conductor_manifiesto=cond.numero_documento
INNER JOIN cmx_detalle_conductor dc ON cond.numdoc_nexos=dc.id_proveedor
WHERE ma.id=$num_orden");
$detalle_manifiesto->execute();
$fila = $detalle_manifiesto->fetch(PDO::FETCH_ASSOC);
$placa = $fila['placa'];
$fecha_expedicion = $fila['fecha_despacho'];
$cliente = $fila['nombre'];
$ruta = $fila['origin'] . ' - ' . $fila['destini'] . ' - ' . $fila['plan_ruta'];
$numero_documento = $fila['numero_documento'];
$conductor = $fila['Conductor'];
$celular = $fila['celular'];

$pdf->Ln(5);
$ruta_imagen = 'Nuevacarpeta/examples/images/';
$image_file = $ruta_imagen . 'logo-combinado.png';
// $this->Ln(5);
// Definir contenido del PDF (extraído del archivo proporcionado)
$html .= '
		<table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse: collapse; text-align:left;">
				<tr>
          <td style="width: 145px;">
            <table>
              <tr>
                <td style="text-align: left;">
                  <img src="' . $image_file . '" alt="" width="200">
                </td>
              </tr>
            </table>
          </td>
					<td style="width: 160px;">
							<table>
								<tr>
									<th style="font-family: Arial, Helvetica, sans-serif;font-size:14px;font-weight: bold;text-align: center;color:#332D2D;">NEXOS CARGOS SAS</th>
								</tr>
								<tr>
									<td style="font-family: Arial, Helvetica, sans-serif;font-size:10px;text-align: center;">NIT.9000062596-8</td>
								</tr>
								<tr>
									<td style="font-family: Arial, Helvetica, sans-serif;font-size:10px;text-align: center;">CL 23 No. 116-31 Of. 301 <br> Bogotá - Colombia</td>
								</tr>
								<tr>
									<td style="font-family: Arial, Helvetica, sans-serif;font-size:10px;text-align: center;">Tel. 7452882 - 3186061986</td>
								</tr>
						</table>
					</td>
					<td style="width: 230px;text-align: center;padding: 1px 1px 1px 1px;">
            <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: separate; border-spacing: 0; border-radius: 8px; overflow: hidden;">
                <tr>
                   <td colspan="2" style="font-family: Arial, Helvetica, sans-serif;font-size:10px;font-weight:bold;width: 230px;text-align: left;">
                      CONTACTO AREA DE SEGURIDAD Y TRAFICO
                    </td>
                </tr>
                <tr>
                    <td class="text-center" colspan="2" style="font-family: Arial, Helvetica, sans-serif;font-size:9px;">
                      Teléfono: 316 7432712
                  </td>
                </tr>
            </table>
            <table cellpadding="2" cellspacing="0" border="0" style="border-collapse: separate; border-spacing: 0; border-radius: 1px; overflow: hidden;">
              <tr>
                <th colspan="2" style="font-family: Arial, Helvetica, sans-serif;font-size:8px;background-color:#E0E0E0;border: 0.7px solid #9FA6B2;width: 230px;">
                  <b>TRAZABILIDAD MOVIMIENTO DE CARGA</b>
                </th>
              </tr>
              <tr>
                <td style="border: 0.7px solid #9FA6B2;font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: 900;"><b>Manifiesto</b></td>
                <td style="border: 0.7px solid #9FA6B2;font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: 900;"><b>Placa</b></td>
              </tr>
              <tr>
                <td style="border: 0.7px solid #9FA6B2;font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: 900;">' . base64_decode($_GET["manifiesto"]) . '</td>
                <td style="border: 0.7px solid #9FA6B2;font-family: Arial, Helvetica, sans-serif;font-size:8px;font-weight: 900;">' . $placa . '</td>
              </tr>
              <tr>
                 <th style="background-color: #F5F5F5; width: 115px;font-weight: bold;border: 1px solid #ddd;font-size:9px;">Fecha del despacho</th>
                 <td style="border: 1px solid #ddd;width: auto; white-space: nowrap;width: 115px;font-size:8px;">' . $fecha_expedicion . '</td>
              </tr>
            </table>
					</td>
				</tr>
		</table>
    <table cellpadding="1" cellspacing="0" width="100%" border="0" style="border-collapse: collapse;background-color: #E0E0E0;color:#332D2D;border: 0.7px solid #9FA6B2;font-size: 9px;">
        <tbody>
          <tr>
            <td style="text-align:center;">
              INFORMACION DEL DESPACHO
            </td>
          </tr>
        </tbody>
    </table>
    <table cellpadding="3" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;font-size: 8px;">
      <tbody>
        <tr>
          <th style="width: 60px;font-weight: bold;border-left: 0px solid #ddd;border-bottom: 0px solid #ddd;text-align:left;">CLIENTE:</th>
          <td style="border-right: 1px solid #ddd;border-bottom: 0px solid #ddd;width: auto; white-space: nowrap;">' . $cliente . '</td>
        </tr>
        <tr>
          <th style="width: 100px;font-weight: bold;border-left: 0px solid #ddd;border-bottom: 0px solid #ddd;text-align:left;">RUTA CONTROL:</th>
          <td style="border-right: 1px solid #ddd;border-bottom: 0px solid #ddd;width: auto; white-space: nowrap;">' . $ruta . '</td>
        </tr>
      </tbody>
    </table>
    <table cellpadding="1" cellspacing="0" width="100%" border="0" style="border-collapse: collapse;background-color: #E0E0E0;color:#332D2D;border: 0.7px solid #9FA6B2;font-size: 9px;">
        <tbody>
          <tr>
            <td style="text-align:center;">
              DATOS DEL CONDUCTOR
            </td>
          </tr>
        </tbody>
    </table>
    <table cellpadding="3" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;font-size: 8px;">
      <tbody>
        <tr>
          <th style="width: 60px;white-space: nowrap;font-weight: bold;border-left: 0px solid #ddd;border-bottom: 0px solid #ddd;text-align:left;">CEDULA:</th>
          <td style="border-right: 1px solid #ddd;border-bottom: 0px solid #ddd;width: 80px; white-space: nowrap;text-align:left;">' . $numero_documento . '</td>
          <th style="width: 60px;white-space: nowrap;font-weight: bold;border-left: 0px solid #ddd;border-bottom: 0px solid #ddd;text-align:left;">NOMBRE:</th>
          <td style="border-right: 1px solid #ddd;border-bottom: 0px solid #ddd;width: 199px; white-space: nowrap;text-align:left;">' . $conductor . 'Z</td>
          <th style="width: 60px;white-space: nowrap;font-weight: bold;border-left: 0px solid #ddd;border-bottom: 0px solid #ddd;text-align:left;">CELULAR:</th>
          <td style="border-right: 1px solid #ddd;border-bottom: 0px solid #ddd;width: 80px; white-space: nowrap;text-align:left;">' . $celular . '</td>
        </tr>
      </tbody>
    </table>
    <br/>
    <br/>
    <table cellpadding="3" cellspacing="0" border="1" style="width: 100%; font-size: 8px;background-color: #E0E0E0;color:#332D2D;">
      <tbody>
        <tr>
          <td style="width: 45px;white-space: nowrap; text-align:center;"><b>REMESA</b></td>
          <td style="width: 112px;white-space: nowrap; text-align:center;"><b>MERCANCIA</b></td>
          <td style="width: 112pxwhite-space: nowrap; text-align:center;"><b>DESTINATARIO</b></td>
          <td style="white-space: nowrap; text-align:center;"><b>NOVEDAD</b></td>
          <td style="white-space: nowrap; text-align:center;"><b>FECHA</b></td>
          <td style="white-space: nowrap; text-align:center;"><b>OPERADOR</b></td>
        </tr>
      </tbody>
    </table>
    ';
$sql_remesas = $conexion->prepare('SELECT rm.id AS remesa, dm.tipo_mercancia,CONCAT(clid.nombre," - ",clid.direccion) AS Destinatario,ss.nundoc_solicitud AS solicitud_servicio,
te.empaque,dm.tipo_empaque,rr.observacion,oc.id AS orden_servicio,pre.serie_precinto,pre.tipo_precinto
FROM cmx_manifiesto ma 
INNER JOIN cmx_manifiesto_remesa mr ON ma.id = mr.id_manifiesto
INNER JOIN cmx_remesa rm ON mr.id_remesa = rm.id
INNER JOIN cmx_remesa_ordencargue ro ON rm.id = ro.id_remesa
INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue=oc.id
INNER JOIN cmx_clientes cl ON oc.cli_id = cl.id
INNER JOIN cmx_solicitud_vehiculo2 ss ON oc.mer_idservicio=ss.nundoc_solicitud
INNER JOIN cmx_detalle_mercancia2 dm ON ss.n_cotizacion=dm.n_cotizacion
INNER JOIN cmx_ruta_puntosentrega rr ON oc.id_remitente=rr.id
INNER JOIN cmx_remitente_destinatario cli ON rr.cliente=cli.id
INNER JOIN cmx_municipios mn ON rr.municipio_entrega=mn.id
INNER JOIN cmx_destinatarios_ss rd ON rm.id_destinatario=rd.id
INNER JOIN cmx_remitente_destinatario clid ON rd.cliente=clid.id
INNER JOIN cmx_municipios mnd ON rd.municipio_entrega=mnd.id
INNER JOIN cmx_para_tipo_empaque te ON dm.tipo_empaque=te.id
INNER JOIN cmx_planilla_detalle2 pre ON oc.id=pre.id_planilla
WHERE ma.id=' . $num_orden . ' GROUP BY rm.id');
$sql_remesas->execute();
$resultados = $sql_remesas->fetchAll(PDO::FETCH_ASSOC);
// $resultado = $resultados[0]['solicitud_servicio'];

$lista_solicitudes = '';  // Inicializa la variable para almacenar los valores concatenados
foreach ($resultados as $key => $value) {
  $lista_solicitudes .= $value['orden_servicio'] . ', ';
}

// Elimina la última coma y espacio si existen
$lista_solicitudes = rtrim($lista_solicitudes, ', ');

foreach ($resultados as $value) {
  $html .= '
    <table cellpadding="3" cellspacing="0" border="0" style="width: 100%; font-size: 6px; color:#332D2D; border-collapse: collapse;">
      <tbody>
        <tr style="border-bottom:1px solid #000;">
          <td style="width: 45px; white-space: nowrap; text-align:center; border-left:1px solid #000; border-right:1px solid #000;">' . $value['remesa'] . '</td>
          <td style="width: 112px; white-space: nowrap; text-align:left; border-right:1px solid #000;">' . $value['tipo_mercancia'] . '</td>
          <td style="width: 112px; white-space: nowrap; text-align:left; border-right:1px solid #000;">' . $value['Destinatario'] . '</td>
          <td style="white-space: nowrap; text-align:left; border-right:1px solid #000;"></td>
          <td style="white-space: nowrap; text-align:left; border-right:1px solid #000;"></td>
          <td style="white-space: nowrap; text-align:left; border-right:1px solid #000;"></td>
        </tr>
      </tbody>
    </table>
  ';
}
$html .= '<table cellpadding="3" cellspacing="0" border="0" style="width: 100%; font-size: 6px; color:#332D2D; border-collapse: collapse;border-top:1px solid #000;"></table>';

$html .= '
    <br/>
    <br/>
    <table cellpadding="3" cellspacing="0" border="0" style="border-collapse: separate; border-spacing: 0; border-radius: 8px; overflow: hidden;">
      <tr>
        <th style="background-color: #F5F5F5; width: 115px;font-weight: bold;border: 1px solid #000;">ORDEN DE SERVICIO</th>
        <td style="border: 1px solid #ddd;white-space: nowrap;width: 424px;border: 1px solid #000;">' . $lista_solicitudes . '</td>
      </tr>
    </table>
    <br/>
    <br/>
    ';

$tipo_contenedor = "";
$contenedor = "";
$precinto = "";
$tipo_precinto = "";

foreach ($resultados as $key => $value) {
  if ($value['tipo_empaque'] == 8) {
    $tipo_contenedor = "1 C 40 Pies";
    $contenedor = $value['observacion'];
    $precinto = $value['serie_precinto'];
    $tipo_precinto = $value['tipo_precinto'];
  } elseif ($value['tipo_empaque'] == 9) {
    $tipo_contenedor = "2 C 20 Pies";
    $contenedor = $value['observacion'];
    $precinto = $value['serie_precinto'];
    $tipo_precinto = $value['tipo_precinto'];
  } elseif ($value['tipo_empaque'] == 10) {
    $tipo_contenedor = "1 C 20 Pies ";
    $contenedor = $value['observacion'];
    $precinto = $value['serie_precinto'];
    $tipo_precinto = $value['tipo_precinto'];
  } else {
    $tipo_contenedor = "No Aplica";
    $contenedor = "No Aplica";
    $precinto = $value['serie_precinto'];
    $tipo_precinto = $value['tipo_precinto'];
  }
}

$html .= '
    <table cellpadding="3" cellspacing="0" border="1" style="width:100%; border-collapse: collapse;font-size: 7px;">
      <tbody>
        <tr>
          <th style="width: 80px;white-space: nowrap;font-weight: bold;text-align:left;background-color: #E0E0E0;color:#332D2D;">TIPO CONTENEDOR:</th>
          <td style="width: 55px; white-space: nowrap;text-align:left;">' . $tipo_contenedor . '</td>
          <th style="width: 60px;white-space: nowrap;font-weight: bold;text-align:left;background-color: #E0E0E0;color:#332D2D;">CONTENEDOR:</th>
          <td style="width: 174px; white-space: nowrap;text-align:left;">' . $contenedor . '</td>
          <th style="width: 50px;white-space: nowrap;font-weight: bold;text-align:left;background-color: #E0E0E0;color:#332D2D;">PRECINTO:</th>
          <td style="width: 120px; white-space: nowrap;text-align:left;">' . $precinto . ' - ' . $tipo_precinto . '</td>
        </tr>
      </tbody>
    </table>
';

$sql_trazabilidad = $conexion->prepare("SELECT IFNULL(m.municipio,pc.punto_controlador) AS Municipio,a.tipo_seguimiento,CONCAT(a.fecha,' - ',a.hora) AS fecha_nota,a.observacion, a.usuario,ppr.nom_punto,prd.nombre_punto,a.novedad,pc.punto_controlador
    FROM cmx_inicio_ruta ru
    INNER JOIN cmx_salida_vehiculo sali ON ru.num_manifiesto=sali.num_manifiesto
    INNER JOIN cmx_inicio_seguimiento a ON ru.cod_inicio=a.cod_ini_ruta
    LEFT JOIN cmx_seguimiento_servicio b ON a.id=b.id_seguimiento
    LEFT JOIN cmx_municipios m ON a.detalle_tipo=m.id
    LEFT JOIN cmx_puntos_controlador pc ON a.id=pc.seguimiento_id
    LEFT JOIN cmx_planruta_detalle prd ON prd.cod_punto=a.codigo_punto
    LEFT JOIN cmx_para_punto_ruta ppr ON ppr.id=a.codigo_punto
    WHERE ru.num_manifiesto=$num_orden
    GROUP BY a.id ORDER BY a.id ASC");
$sql_trazabilidad->execute();
$resultados_trazabilidad = $sql_trazabilidad->fetchAll(PDO::FETCH_ASSOC);

// $html .= '
//     <br/>
//     <br/>
//     <table cellpadding="2" cellspacing="0" border="1" style="width: 100%; font-size: 8px;background-color: #E0E0E0;color:#332D2D;">
//       <tbody>
//         <tr>
//           <td style="width: 150px;white-space: nowrap; text-align:center;"><b>UBICACIÓN</b></td>
//           <td style="width: 190px;white-space: nowrap; text-align:center;"><b>NOVEDAD</b></td>
//           <td style="width: 100px;white-space: nowrap; text-align:center;"><b>FECHA</b></td>
//           <td style="width: 100px;white-space: nowrap; text-align:center;"><b>OPERADOR</b></td>
//         </tr>
//       </tbody>
//     </table>
// ';

// foreach ($resultados_trazabilidad as $trazabilidad) {
//   $html .= '
//   <table cellpadding="3" cellspacing="0" border="0" style="width: 100%; font-size: 7px;color:#332D2D;">
//     <tbody>
//       <tr>
//         <td style="width: 150px;white-space: nowrap; text-align:center;border-left:1px solid #000; border-right:1px solid #000;">' . $trazabilidad['Municipio'] . '</td>
//         <td style="width: 190px;white-space: nowrap; text-align:center;border-right:1px solid #000;">' . $trazabilidad['observacion'] . ' - ' . $trazabilidad['novedad'] . '</td>
//         <td style="width: 100px;white-space: nowrap; text-align:center;border-right:1px solid #000;">' . $trazabilidad['fecha_nota'] . '</td>
//         <td style="width: 100px;white-space: nowrap; text-align:center;border-right:1px solid #000;">' . $trazabilidad['usuario'] . '</td>
//       </tr>
//     </tbody>
//   </table>
// ';
// }
// $html .= '<table cellpadding="3" cellspacing="0" border="0" style="width: 100%; font-size: 6px; color:#332D2D; border-collapse: collapse;border-top:1px solid #000;"></table>';
// // Escribir el contenido en el PDF
$pdf->writeHTML($html, true, false, true, false, '');


$contador = 0; // Inicializa un contador de registros
$max_por_pagina = 7; // Establece el máximo de registros por página

// Función para generar la cabecera de la tabla
function getTableHeader()
{
  return '<table cellpadding="2" cellspacing="0" border="1" style="width: 100%; font-size: 8px;background-color: #E0E0E0;color:#332D2D;">
              <thead>
                <tr>
                  <td style="width: 150px;white-space: nowrap; text-align:center;"><b>UBICACIÓN</b></td>
                  <td style="width: 190px;white-space: nowrap; text-align:center;"><b>NOVEDAD</b></td>
                  <td style="width: 100px;white-space: nowrap; text-align:center;"><b>FECHA</b></td>
                  <td style="width: 100px;white-space: nowrap; text-align:center;"><b>OPERADOR</b></td>
                </tr>
              </thead>
              <tbody>';
}

// Función para cerrar la tabla
function closeTable()
{
  return '</tbody></table>';
}

// Abre la tabla con la cabecera
$html = getTableHeader();

foreach ($resultados_trazabilidad as $trazabilidad) {
  $contador++;

  // Agrega filas de contenido dentro de la tabla
  $html .= '<tr style="width: 100%; font-size: 8px;background-color: #FFFFFF;color:#332D2D;">
              <td style="padding-left:15px; width: 150px;white-space: nowrap; text-align:center;border-left:1px solid #000; border-right:1px solid #000;margin-top:14px;">' . $trazabilidad['Municipio'] . '</td>
              <td style="width: 190.3px;white-space: nowrap; text-align:center;border-right:1px solid #000;">' . $trazabilidad['observacion'] . ' - ' . $trazabilidad['novedad'] . '</td>
              <td style="width: 100px;white-space: nowrap; text-align:center;border-right:1px solid #000;">' . $trazabilidad['fecha_nota'] . '</td>
              <td style="width: 100px;white-space: nowrap; text-align:center;border-right:1px solid #000;">' . $trazabilidad['usuario'] . '</td>
           </tr>';

  // Verifica si se han alcanzado los registros máximos por página
  if ($contador % $max_por_pagina == 0) {
    $html .= closeTable(); // Cierra la tabla antes de escribir en el PDF

    $pdf->writeHTML($html, true, false, true, false, ''); // Imprime la tabla en el PDF
    $pdf->AddPage(); // Añade una nueva página
    $pdf->Ln(3);

    // Reinicia el contenido HTML para la nueva página, abriendo nuevamente la tabla con la cabecera
    $html = getTableHeader();
  }
}

// Si quedan registros pendientes, cierra la tabla después del bucle
if ($contador % $max_por_pagina != 0) {
  $html .= closeTable(); // Cierra la tabla
  $pdf->writeHTML($html, true, false, true, false, ''); // Imprime el contenido final
}

//FINAL DEL DOCUMENTO
ob_end_clean();
$pdf->Output('Historial de Trazabilidad.pdf', 'I');
