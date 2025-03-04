<?php 
	ini_set('max_execution_time', 120);

	include("../application/Config.php");
	include '../application/Conexion.php';
	include '../application/PHPExcel/PHPExcel.php';

	$Data = new Consultas;

	if (isset($_GET["id_bodega"])) {
		$sql = '
			SELECT 
				* 
			FROM 
				cmx_remitente_destinatario crd
				INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad 
			WHERE 
				crd.id = ' . $_GET["id_bodega"] . '
		';
		$arrayBodega = $Data->getConsulta($sql);

		$sql = '
			SELECT 
				CONCAT(cu.linea,"-",cu.columna,"-",cu.nivel) UBICACION, 
				cmc.codigo, cmc.descripcion,
				cmb.lote, CONCAT(cmb.lote,"-",ce.grupo) ESTIBA,
				ce.cantidad_grupo,
				(
					SELECT
						COUNT(ce1.id)
					FROM 
						cmx_embalaje ce1
					WHERE 
						ce1.grupo = 0
						AND ce1.id_embalaje = ce.id
						AND ce1.sub_estado = 5 
						AND ce.estado IN (1,2,3)
				) DISPONIBLES
			FROM 
				cmx_material_cliente cmc
				INNER JOIN cmx_material_bodega cmb ON cmc.id = cmb.id_material
				INNER JOIN cmx_ingresos ci ON ci.id = cmb.id_ingreso
				INNER JOIN cmx_embalaje ce ON ce.id_material_bodega = cmb.id
				INNER JOIN cmx_ubicaciones cu ON cu.id = ce.ubicacion
			WHERE 
				ce.grupo > 0
				AND cu.id_bodega = ' . $_GET["id_bodega"] . ';
		';
		$arrayInventario = $Data->getConsulta($sql);

		$fila = 2;
		
		$objPHPExcel = new PHPExcel;
		
		$objPHPExcel->getProperties()
			->setCreator('Nexos Group S.A.S')
			->setTitle('Inventario Bodega - ' . $arrayBodega["rowsData"][0]["nombre"])
			->setDescription('Inventario Bodega - ' . $arrayBodega["rowsData"][0]["nombre"])
			->setKeywords('inventario ' . $arrayBodega["rowsData"][0]["nombre"])
			->setCategory('Inventario')
		;
		
		$objPHPExcel->setActiveSheetIndex(0);
		$objPHPExcel->getActiveSheet('Inventario - ' . ('Inventario Bodega - ' . $arrayBodega["rowsData"][0]["nombre"]));

		$objPHPExcel->getActiveSheet()->setCellValue('A1','UBICACION');
		$objPHPExcel->getActiveSheet()->setCellValue('B1','CÓDIGO');
		$objPHPExcel->getActiveSheet()->setCellValue('C1','DESCRIPCIÓN');
		$objPHPExcel->getActiveSheet()->setCellValue('D1','LOTE');
		$objPHPExcel->getActiveSheet()->setCellValue('E1','ESTIBA');
		$objPHPExcel->getActiveSheet()->setCellValue('F1','CANTIDAD');
		$objPHPExcel->getActiveSheet()->setCellValue('G1','DISPONIBLES');

		foreach ($arrayInventario["rowsData"] as $key => $value) {
			$objPHPExcel->getActiveSheet()->setCellValue('A' . $fila , $value['UBICACION']);
			$objPHPExcel->getActiveSheet()->setCellValue('B' . $fila , $value['codigo']);
			$objPHPExcel->getActiveSheet()->setCellValue('C' . $fila , $value['descripcion']);
			$objPHPExcel->getActiveSheet()->setCellValue('D' . $fila , $value['lote']);
			$objPHPExcel->getActiveSheet()->setCellValue('E' . $fila , $value['ESTIBA']);
			$objPHPExcel->getActiveSheet()->setCellValue('F' . $fila , $value['cantidad_grupo']);
			$objPHPExcel->getActiveSheet()->setCellValue('G' . $fila , $value['DISPONIBLES']);

			$fila++;
		}

		header('Content-Type: application/vnd.ms-excel');
		header('Content-Disposition: attachment;filename="Inventario Bodega - ' . $arrayBodega["rowsData"][0]["nombre"] . '.xls"');
		header('Cache-Control: max-age=0');

		$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');

		$objWriter->save('php://output');
	}else{
		echo "<h3>Archivo no encontrado para descargar</h3>";
	}

?>
