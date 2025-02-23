<?php

class Model
{
	protected $_db;
	protected $_db3;
	protected $_db2;

	public function __construct()
	{
		$this->_db2 = new Conexion();
		$this->_db = new Consultas();
		$this->_db3 = new Database2();
	}

	function limpiaTexto($text)
	{
		// $text = filter_var(trim($text), FILTER_SANITIZE_STRING);
		// $text = preg_replace('/\s+/', ' ', $text);
		// $text = trim($text);

		$text = trim($text); // Eliminar espacios en blanco al inicio y al final
		$text = strip_tags($text); // Eliminar todas las etiquetas HTML y PHP
		$text = htmlspecialchars($text, ENT_QUOTES, 'UTF-8'); // Convertir caracteres especiales en entidades HTML
		$text = preg_replace('/\s+/', ' ', $text); // Reemplazar múltiples espacios en blanco con un solo espacio
		$text = trim($text); // Eliminar nuevamente espacios en blanco al inicio y al final


		//Filtro anti-XSS
		$caracteres_malos = array("<", ">", "\"", "'", "/", "<", ">", "'", "/");
		$caracteres_buenos = array("& lt;", "& gt;", "& quot;", "& #x27;", "& #x2F;", "& #060;", "& #062;", "& #039;", "& #047;");
		$consultaBusqueda = str_replace($caracteres_malos, $caracteres_buenos, $text);
		return $text;
	}

	public function textContabilidad($text)
	{
		return strtoupper(trim(preg_replace('/[\s\t\n\r\s]+/', ' ', $text)));
	}

	public function formatNumber($number)
	{
		return str_replace(",", ".", str_replace(".", "", $number));
	}

	public function validarFecha($fecha)
	{
		$return = false;
		$validaFecha = explode("-", $fecha);
		if (count($validaFecha, 0) == 3) {
			$return = true;
		}
		return $return;
	}

	public function validarFechaDow($lote)
	{
		$fecha_vencimiento = getYearDow(substr($lote, 4, 1)) . "-" . getMonthDow(substr($lote, 5, 1)) . "-" . getDayDow(substr($lote, 6, 1));
		return $fecha_vencimiento;
	}

	public function permisosPerfil($id_perfil, $id_submenu)
	{
		$sql = ' SELECT * FROM  cmx_menu_perfil cmp WHERE cmp.id_submenu = ' . $id_submenu . ' AND cmp.id_perfil = ' . $id_perfil . ' AND cmp.estado = 1';
		$request = $this->_db->getConsulta($sql);
		if ($request > 1) {
			return $request["rowsData"][0];
		} else {
			return $request;
		}
	}

	public function get_extension_archivo($nombre_archivo)
	{
		$archivo = explode(".", $nombre_archivo);
		return ($archivo[count($archivo) - 1]);
	}

	public function getMesEnLetra($mes)
	{
		switch ($mes) {
			case '1':
				$mesLetra = 'Enero';
				break;
			case '01':
				$mesLetra = 'Enero';
				break;
			case '2':
				$mesLetra = 'Febrero';
				break;
			case '02':
				$mesLetra = 'Febrero';
				break;
			case '3':
				$mesLetra = 'Marzo';
				break;
			case '03':
				$mesLetra = 'Marzo';
				break;
			case '4':
				$mesLetra = 'Abril';
				break;
			case '04':
				$mesLetra = 'Abril';
				break;
			case '5':
				$mesLetra = 'Mayo';
				break;
			case '05':
				$mesLetra = 'Mayo';
				break;
			case '6':
				$mesLetra = 'Junio';
				break;
			case '06':
				$mesLetra = 'Junio';
				break;
			case '7':
				$mesLetra = 'Julio';
				break;
			case '07':
				$mesLetra = 'Julio';
				break;
			case '8':
				$mesLetra = 'Agosto';
				break;
			case '08':
				$mesLetra = 'Agosto';
				break;
			case '9':
				$mesLetra = 'Septiembre';
				break;
			case '09':
				$mesLetra = 'Septiembre';
				break;
			case '10':
				$mesLetra = 'Octubre';
				break;
			case '11':
				$mesLetra = 'Noviembre';
				break;
			case '12':
				$mesLetra = 'Diciembre';
				break;
			default:
				$mesLetra = 'Error en la selección del mes.';
				break;
		}
		return $mesLetra;
	}

	public function getTimestampToDate($timestamp, $format = 'Y-m-d')
	{
		$array = explode("-", $timestamp);
		$timestamp = $array[count($array) - 1];
		return date($format, $timestamp);
	}

	/***** Función de envío de correos *****/
	public function sendMail($array)
	{
		$return = array();
		$cuerpo = '
				<!DOCTYPE html>
				<html lang="es">
					<head>
						<title></title>
						<meta charset="UTF-8">
					</head>
					<body>
						' . $array['cuerpo'] . '
					</body>
				</html>
			';

		//para el envío en formato HTML
		$headers = "MIME-Version: 1.0\r\n";
		$headers .= "Content-type: text/html; charset=iso-8859-1\r\n";

		//dirección del remitente
		$headers .= "From: " . APP_COMPANY . " <" . mailuser . ">\r\n";

		//Una Dirección de respuesta, si queremos que sea distinta que la del remitente
		$headers .= "<- Do not Reply! ->\r\n";

		//Direcciones que recibián copia''
		if (isset($array["cc"])) {
			$headers .= "Cc: " . $array["cc"] . "\r\n";
		}

		//direcciones que recibirán copia oculta
		if (isset($array["bcc"])) {
			$headers .= "Bcc: " . $array["bcc"] . "\r\n";
		}

		if (mail($array['destinatario'], $array['asunto'], $cuerpo, $headers)) {
			$return["result"] = 'Funcion "mail()" ejecutada, por favor verifique su bandeja de correo.';
		} else {
			$return["error"] = 'No se pudo enviar el mail, por favor verifique su configuracion de correo SMTP saliente.';
		}

		return $return;
	}


	// SELECTS DE PARAMETROS
	// Select de remitentes - destinatarios
	public function getHtmlSelectRemitenteDestinatario($name, $id, $id_cliente)
	{
		if ($name) {
			$query = '
					SELECT crd.id, crd.nombre,
						CONCAT(cm.municipio," (",cm.depto," - ",cm.pais,")") CIUDAD
					FROM cmx_remitente_destinatario crd
						INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
					WHERE crd.estado = 1
						AND crd.rndc_id IS NOT NULL
						AND crd.rndc_id != ""
						AND crd.id_cliente IN (1 , ' . $id_cliente . ')
					ORDER BY crd.id_cliente DESC, crd.nombre
				;';
			$array = $this->_db->getConsulta($query);

			// Se recorre contenido de la consulta
			if ($array) {
				$select = '<select class="form-control" name="' . $name . '" id="slct_remitente_destinatario_' . $id . '" aria-hidden="true">';
				$select .= '<option value="" selected disabled>Seleccione</option>';

				foreach ($array['rowsData'] as $key => $value) {
					if ($value[0] == $id) {
						$select .= '<option value="' . $value[0] . '" selected="">' . $value[1] . ' -  ' . $value[2] . '</option>';
					} else {
						$select .= '<option value="' . $value[0] . '">' . $value[1] . ' -  ' . $value[2] . '</option>';
					}
				}
				$select .= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}
		return $select;
	}

	// Select de remitentes - destinatarios
	public function getHtmlSelectRemitenteDestinatario_sm($name, $id, $id_cliente)
	{

		if ($name) {
			$query = '
					SELECT 
						crd.id, crd.nombre,
						CONCAT(cm.municipio," (",cm.depto," - ",cm.pais,")") CIUDAD
					FROM 
						cmx_remitente_destinatario crd
						INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
					WHERE 
						crd.estado = 1
						AND crd.rndc_id IS NOT NULL
						AND crd.rndc_id != ""
						AND crd.id_cliente IN (1 , ' . $id_cliente . ')
					ORDER BY crd.id_cliente DESC, crd.nombre
				;';
			// echo $query;
			$array = $this->_db->getConsulta($query);

			// Se recorre contenido de la consulta
			if ($array) {
				// print_r($array);
				$select = '<select class="form-control input-sm" name="' . $name . '" id="slct_remitente_destinatario_' . $id . '" aria-hidden="true">';
				$select .= '<option value="" selected disabled>Seleccione</option>';

				foreach ($array['rowsData'] as $key => $value) {

					if ($value[0] == $id) {
						$select .= '<option value="' . $value[0] . '" selected="">' . $value[1] . ' -  ' . $value[2] . '</option>';
					} else {
						$select .= '<option value="' . $value[0] . '">' . $value[1] . ' -  ' . $value[2] . '</option>';
					}
				}
				$select .= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}

		return $select;
	}

	// Select de remitentes - destinatarios
	public function getHtmlSelectIntrRemitenteDestinatario_sm($name, $id, $id_cliente)
	{
		if ($name) {
			$id_cliente = isset($id_cliente) ? intval($id_cliente) : 0;

			// Crear la lista de clientes válidos
			$clientes = [1];
			if ($id_cliente > 0) {
				$clientes[] = $id_cliente;
			}
			$lista_clientes = implode(', ', $clientes);

			$query = '
    SELECT crd.id, crd.nombre,
        CONCAT(cm.municipio," (",cm.depto," - ",cm.pais,")") CIUDAD
    FROM cmx_remitente_destinatario crd
        INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
    WHERE crd.estado = 1
        AND crd.id_cliente IN (' . $lista_clientes . ')
    ORDER BY crd.id_cliente DESC, crd.nombre';
			// $array = $this->_db->getConsulta($query);
			$array = $this->_db3->prepare($query);
			$array->execute();
			$array = $array->fetchAll(PDO::FETCH_ASSOC);

			// Se recorre contenido de la consulta
			if ($array) {
				$select = '<select class="form-control input-sm" name="' . $name . '" id="slct_remitente_destinatario_' . $id . '" aria-hidden="true">';
				$select .= '<option value="" selected disabled>Seleccione</option>';

				foreach ($array as $key => $value) {
					if ($value['id'] == $id) {
						$select .= '<option value="' . $value['id'] . '" selected="">' . $value['nombre'] . ' -  ' . $value['CIUDAD'] . '</option>';
					} else {
						$select .= '<option value="' . $value['id'] . '">' . $value['nombre'] . ' -  ' . $value['CIUDAD'] . '</option>';
					}
				}
				$select .= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}
		return $select;
	}

	// Select de puertos
	public function getHtmlSelectPuertos($name, $id)
	{
		if ($name) {
			$query = '
					SELECT cpr.id, crd.nombre,
						CONCAT(cm.municipio," (",cm.depto," - ",cm.pais,")") CIUDAD
					FROM cmx_puertos cpr
						INNER JOIN cmx_remitente_destinatario crd ON cpr.id_remtente_destinatario = crd.id
						INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
					WHERE cpr.estado = 1
						AND crd.estado = 1
				';
			// $array = $this->_db->getConsulta($query);
			$array = $this->_db3->prepare($query);
			$array->execute();
			$array = $array->fetchAll(PDO::FETCH_ASSOC);

			// Se recorre contenido de la consulta
			if ($array) {
				$select = '
						<select class="select2 select2-hidden-accessible" name="' . $name . '" id="slct_puertos_' . $id . '" aria-hidden="true">
					';
				$select .= '<option value="" selected disabled>Seleccione</option>';

				foreach ($array['rowsData'] as $key => $value) {
					if ($value['id'] == $id) {
						$select .= '<option value="' . $value['id'] . '" selected="">' . $value['nombre'] . ' -  ' . $value['CIUDAD'] . '</option>';
					} else {
						$select .= '<option value="' . $value['id'] . '">' . $value['nombre'] . ' -  ' . $value['CIUDAD'] . '</option>';
					}
				}
				$select .= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}
		return $select;
	}

	// Select de municipios
	public function getHtmlSelectMunicipios($name, $id)
	{
		if ($name) {
			$query = '
					SELECT cm.id,
						CONCAT(cm.municipio," (",cm.depto," - ",cm.pais,")") CIUDAD
					FROM cmx_municipios cm 
					ORDER BY cm.municipio
				';
			$array = $this->_db->getConsulta($query);

			// Se recorre contenido de la consulta
			if ($array) {
				// print_r($array);
				$select = '<select class="form-control" name="' . $name . '" id="slct_municipios_' . $id . '" aria-hidden="true">';
				$select .= '<option value="" selected disabled>Seleccione</option>';

				foreach ($array['rowsData'] as $key => $value) {
					if ($value[0] == $id) {
						$select .= '<option value="' . $value[0] . '" selected="">' . $value[1] . '</option>';
					} else {
						$select .= '<option value="' . $value[0] . '">' . $value[1] . '</option>';
					}
				}
				$select .= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}
		return $select;
	}

	public function getHtmlSelectMunicipios_sm($name, $id)
	{
		if ($name) {
			$query = '
					SELECT cm.id,
						CONCAT(cm.municipio," (",cm.depto," - ",cm.pais,")") CIUDAD
					FROM cmx_municipios cm 
					ORDER BY cm.municipio
				';
			$array = $this->_db->getConsulta($query);

			// Se recorre contenido de la consulta
			if ($array) {
				$select = '<select class="form-control input-sm" name="' . $name . '" id="slct_municipios_' . $id . '" aria-hidden="true">';
				$select .= '<option value="" selected disabled>Seleccione</option>';

				foreach ($array['rowsData'] as $key => $value) {
					if ($value[0] == $id) {
						$select .= '<option value="' . $value[0] . '" selected="">' . $value[1] . '</option>';
					} else {
						$select .= '<option value="' . $value[0] . '">' . $value[1] . '</option>';
					}
				}
				$select .= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}
		return $select;
	}

	public function getHtmlSelectMunicipios_multi($name, $id, $nacional = NULL)
	{
		if ($name) {
			if ($nacional) {
				$query = '
						SELECT  cm.id,
							CONCAT(cm.municipio," (",cm.depto," - ",cm.pais,")") CIUDAD
						FROM  cmx_municipios cm 
						WHERE cm.rndc_codigo_ciudad IS NOT NULL
						ORDER BY cm.municipio
					';
			} else {
				$query = '
						SELECT cm.id,
							CONCAT(cm.municipio," (",cm.depto," - ",cm.pais,")") CIUDAD
						FROM cmx_municipios cm 
						ORDER BY cm.municipio
					';
			}
			$array = $this->_db->getConsulta($query);

			// Se recorre contenido de la consulta
			if ($array) {
				$select = '
						<select multiple="" class="tags tarifas" name="' . $name . '" id="slct_municipios_' . $id . '" aria-hidden="true">
					';
				foreach ($array['rowsData'] as $key => $value) {
					if ($value["id"] == $id) {
						$select .= '<option value="' . $value["id"] . '" selected="">' . $value["CIUDAD"] . '</option>';
					} else {
						$select .= '<option value="' . $value["id"] . '">' . $value["CIUDAD"] . '</option>';
					}
				}
				$select .= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}
		return $select;
	}

	// Select de todos paises registrados
	public function getHtmlSelectPaisesTodos_sm($name, $id)
	{
		if ($name) {
			$query = '
					SELECT DISTINCT(cm.pais)
					FROM cmx_municipios cm 
					ORDER BY cm.pais
				';
			$array = $this->_db->getConsulta($query);

			// Se recorre contenido de la consulta
			if ($array) {
				$select = '<select class="form-control input-sm" name="' . $name . '" id="slct_pais_' . $id . '" placeholder="País" aria-hidden="true">';
				$select .= '<option value="" selected disabled>Seleccione</option>';

				foreach ($array['rowsData'] as $key => $value) {
					if ($value[0] == $id) {
						$select .= '<option value="' . $value[0] . '" selected="">' . $value[0] . '</option>';
					} else {
						$select .= '<option value="' . $value[0] . '">' . $value[0] . '</option>';
					}
				}
				$select .= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}
		return $select;
	}

	// Select de todos paises registrados
	public function getHtmlSelectPaisesConDepto_sm($name, $id)
	{
		if ($name) {
			$query = '
					SELECT pais
					FROM cmx_municipios cm 
					UNION
					SELECT pais
					FROM cmx_municipios cm1
					GROUP BY pais
					ORDER BY pais
				';
			$array = $this->_db->getConsulta($query);

			// Se recorre contenido de la consulta
			if ($array) {
				$select = '<select class="form-control input-sm" name="' . $name . '" id="slct_pais_' . $id . '" placeholder="País" aria-hidden="true">';
				$select .= '<option value="" selected disabled>Seleccione</option>';

				foreach ($array['rowsData'] as $key => $value) {
					if ($value[0] == $id) {
						$select .= '<option value="' . $value[0] . '" selected="">' . $value[0] . '</option>';
					} else {
						$select .= '<option value="' . $value[0] . '">' . $value[0] . '</option>';
					}
				}
				$select .= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}
		return $select;
	}

	// Select de paises
	public function getHtmlSelectPaises_sm($name, $id)
	{
		if ($name) {
			$query = '
					SELECT DISTINCT(cm.pais)
					FROM cmx_municipios cm 
					WHERE cm.depto IS NOT NULL AND cm.depto != "" 
						AND cm.municipio IS NOT NULL AND cm.municipio != ""
					ORDER BY cm.pais
				';
			$array = $this->_db->getConsulta($query);

			// Se recorre contenido de la consulta
			if ($array) {
				$select = '<select class="form-control input-sm" name="' . $name . '" id="slct_pais_' . $id . '" aria-hidden="true">';
				$select .= '<option value="" selected disabled>Seleccione</option>';

				foreach ($array['rowsData'] as $key => $value) {
					if ($value['pais'] == $id) {
						$select .= '<option value="' . $value['pais'] . '" selected="">' . $value['pais'] . '</option>';
					} else {
						$select .= '<option value="' . $value['pais'] . '">' . $value['pais'] . '</option>';
					}
				}
				$select .= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}
		return $select;
	}

	// Select de deptos
	public function getHtmlSelectDeptos_sm($name, $id, $pais)
	{
		if ($name) {
			$query = '
					SELECT  DISTINCT(cm.depto)
					FROM cmx_municipios cm 
					WHERE cm.pais = "' . $pais . '"
					ORDER BY cm.depto
				';
			// echo $query;
			$array = $this->_db->getConsulta($query);

			// Se recorre contenido de la consulta
			if ($array) {
				$select = '<select class="form-control input-sm" name="' . $name . '" id="slct_depto_' . $id . '" aria-hidden="true" placeholder="Estado | Departamento | Región">';
				$select .= '<option value="" selected disabled>Seleccione</option>';

				foreach ($array['rowsData'] as $key => $value) {
					if ($value['depto'] == $id) {
						$select .= '<option value="' . $value['depto'] . '" selected="">' . $value['depto'] . '</option>';
					} else {
						$select .= '<option value="' . $value['depto'] . '">' . $value['depto'] . '</option>';
					}
				}
				$select .= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}
		return $select;
	}

	// Select de deptos
	public function getHtmlSelectCiudadFiltered_sm($name, $id, $pais, $depto)
	{
		if ($name) {
			$rndc_id_municipio = "";
			$query = '
					SELECT cm.id, cm.municipio, cm.rndc_codigo_ciudad
					FROM cmx_municipios cm 
					WHERE cm.pais = "' . $pais . '"
						AND cm.depto = "' . $depto . '"
					ORDER BY cm.municipio
				';
			$array = $this->_db->getConsulta($query);

			// Se recorre contenido de la consulta
			if ($array) {
				$select = '<select class="form-control input-sm" name="' . $name . '" id="slct_municipio_' . $id . '" aria-hidden="true">';
				$select .= '<option value="" selected disabled>Seleccione</option>';

				foreach ($array['rowsData'] as $key => $value) {
					if ($value['municipio'] == $id) {
						$select .= '<option value="' . $value['id'] . '" selected="">' . $value[['municipio']] . '</option>';
						$rndc_id_municipio = $value["rndc_codigo_ciudad"];
					} else {
						$select .= '<option value="' . $value['id'] . '">' . $value['municipio'] . '</option>';
					}
				}
				$select .= '</select>';
				$select .= '<input type="hidden" id="rndc_id_municipio" name="rndc_id_municipio" value=' . $rndc_id_municipio . ' >';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}
		return $select;
	}

	// Select de modedas
	public function getHtmlSelectMonedas($name, $id)
	{
		if ($name) {
			$query = 'SELECT  cm.id, CONCAT(cm.nom_moneda," (",cm.codigo,")") MONEDA FROM cmx_monedas cm 
			 WHERE cm.estado = 1 ORDER BY cm.nom_moneda';
			// $array = $this->_db->getConsulta($query);
			$array = $this->_db3->prepare($query);
			$array->execute();
			$array->setFetchMode(PDO::FETCH_ASSOC);

			// Se recorre contenido de la consulta
			if ($array) {
				$select = '<select class="form-control input-sm" name="' . $name . '" id="slct_monedas_' . $id . '" aria-hidden="true">';
				$select .= '<option value="" selected disabled>Seleccione</option>';

				foreach ($array as $key => $value) {
					if ($value['id'] == $id) {
						$select .= '<option value="' . $value['id'] . '" selected="">' . $value['MONEDA'] . '</option>';
					} else {
						$select .= '<option value="' . $value['id'] . '">' . $value['MONEDA'] . '</option>';
					}
				}
				$select .= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}
		return $select;
	}

	// Select de modedas
	public function getHtmlSelectMonedas_xs($name, $id, $options)
	{
		if ($name) {
			$query = 'SELECT cm.id, CONCAT(cm.nom_moneda," (",cm.codigo,")") AS MONEDA FROM cmx_monedas cm WHERE cm.estado = 1 ORDER BY cm.nom_moneda';
			// $array = $this->_db->getConsulta($query);
			$array = $this->_db3->prepare($query);
			$array->execute();
			$array = $array->fetchAll(PDO::FETCH_ASSOC);

			// Se recorre contenido de la consulta
			if ($array) {
				$select = '<select class="form-control input-xs" name="' . $name . '" id="slct_monedas_' . $id . '" aria-hidden="true" ' . $options . ' placeholder="Moneda">';
				$select .= '<option value="" selected disabled>Moneda</option>';

				foreach ($array as $key => $value) {
					if ($value['id'] == $id) {
						$select .= '<option value="' . $value['id'] . '" selected="">' . $value['MONEDA'] . '</option>';
					} else {
						$select .= '<option value="' . $value['id'] . '">' . $value['MONEDA'] . '</option>';
					}
				}
				$select .= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}
		return $select;
	}

	// Select de modedas
	public function getHtmlSelectMonedas_sm($name, $id, $options)
	{
		if ($name) {
			$query = 'SELECT cm.id, CONCAT(cm.nom_moneda," (",cm.codigo,")") AS MONEDA FROM cmx_monedas cm  WHERE cm.estado = 1 ORDER BY cm.nom_moneda';
			// $array = $this->_db->getConsulta($query);
			$array = $this->_db3->prepare($query);
			$array->execute();
			$array = $array->fetchAll(PDO::FETCH_ASSOC);

			// Se recorre contenido de la consulta
			if ($array) {
				$select = '<select class="form-control input-sm slct_' . $name . '" name="' . $name . '" id="slct_monedas_' . $id . '" aria-hidden="true" ' . $options . ' placeholder="Moneda">';
				$select .= '<option value="" selected disabled>Moneda</option>';

				foreach ($array as $key => $value) {
					if ($value['id'] == $id) {
						$select .= '<option value="' . $value['id'] . '" selected="">' . $value['MONEDA'] . '</option>';
					} else {
						$select .= '<option value="' . $value['id'] . '">' . $value['MONEDA'] . '</option>';
					}
				}
				$select .= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}
		return $select;
	}

	// Select de modedas
	public function getHtmlSelectTrmMonedas_sm($name, $id, $options)
	{
		if ($name) {
			$query = 'SELECT cm.id, CONCAT(cm.nom_moneda," (",cm.codigo,")") AS MONEDA FROM cmx_monedas cm 
					WHERE cm.estado = 1 AND cm.id != 2 ORDER BY cm.nom_moneda';
			// $array = $this->_db->getConsulta($query);
			$array = $this->_db3->prepare($query);
			$array->execute();
			$array = $array->fetchAll(PDO::FETCH_ASSOC);

			// Se recorre contenido de la consulta
			if ($array) {
				$select = '<select class="form-control input-sm" name="' . $name . '" id="slct_monedas_' . $id . '" aria-hidden="true" ' . $options . ' placeholder="Moneda">';
				$select .= '<option value="" selected disabled>Moneda</option>';

				foreach ($array as $key => $value) {
					if ($value['id'] == $id) {
						$select .= '<option value="' . $value['id'] . '" selected="">' . $value['MONEDA'] . '</option>';
					} else {
						$select .= '<option value="' . $value['id'] . '">' . $value['MONEDA'] . '</option>';
					}
				}
				$select .= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}
		return $select;
	}

	// Select de Conceptos Internacional
	public function getHtmlSelectConceptos($name, $id)
	{
		if ($name) {
			$query = 'SELECT cic.id, cic.nombre FROM cmx_intr_conceptos cic WHERE cic.estado = 1 ORDER BY cic.nombre';
			// $array = $this->_db->getConsulta($query);
			$array = $this->_db3->prepare($query);
			$array->execute();
			$array = $array->fetchAll(PDO::FETCH_ASSOC);

			// Se recorre contenido de la consulta
			if ($array) {
				$select = '<select class="form-control input-sm" name="' . $name . '" id="slct_conceptos_' . $id . '" aria-hidden="true">';
				$select .= '<option value="" selected disabled>Seleccione</option>';

				foreach ($array as $key => $value) {
					if ($value['id'] == $id) {
						$select .= '<option value="' . $value['id'] . '" selected="">' . $value['nombre'] . '</option>';
					} else {
						$select .= '<option value="' . $value['id'] . '">' . $value['nombre'] . '</option>';
					}
				}
				$select .= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}
		return $select;
	}

	// Select de Conceptos Internacional
	public function getHtmlSelectConceptos_xs($name, $id, $options)
	{
		if ($name) {
			$query = 'SELECT cic.id, cic.nombre FROM cmx_intr_conceptos cic WHERE cic.estado = 1 ORDER BY cic.nombre';
			// $array = $this->_db->getConsulta($query);
			$array = $this->_db3->prepare($query);
			$array->execute();
			$array = $array->fetchAll(PDO::FETCH_ASSOC);

			// Se recorre contenido de la consulta
			if ($array) {
				$select = '<select class="form-control input-xs" name="' . $name . '" id="slct_conceptos_' . $id . '" aria-hidden="true" ' . $options . ' placeholder="Concepto">';
				$select .= '<option value="" selected disabled>Concepto</option>';

				foreach ($array as $key => $value) {
					if ($value['id'] == $id) {
						$select .= '<option value="' . $value['id'] . '" selected="">' . $value['nombre'] . '</option>';
					} else {
						$select .= '<option value="' . $value['id'] . '">' . $value['nombre'] . '</option>';
					}
				}
				$select .= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}
		return $select;
	}

	// Select de Proveedores
	public function getHtmlSelectProveedores($name, $id, $options)
	{
		if ($name) {
			$query = 'SELECT cp.id, cp.nombre FROM cmx_proveedores cp
								INNER JOIN cmx_actividad_proveedor cap ON cap.id_proveedor = cp.id
								WHERE cp.estado = "Activo" AND cap.actividad = "Proveedor" ORDER BY cp.nombre';
			// $array = $this->_db->getConsulta($query);
			$array = $this->_db3->prepare($query);
			$array->execute();
			$array = $array->fetchAll(PDO::FETCH_ASSOC); // Fetch_ASSOC para obtener los resultados como asociativos. Fetch_NUM para obtener los resultados como numéricos. Fetch_BOTH para obtener los resultados como numéricos y asociativos.

			// Se recorre contenido de la consulta
			if ($array) {
				$select = '<select class="form-control input-sm" name="' . $name . '" id="slct_proveedores_' . $id . '" aria-hidden="true" ' . $options . '>';
				$select .= '<option value="" selected disabled>Seleccione</option>';

				foreach ($array as $key => $value) {
					if ($value['id'] == $id) {
						$select .= '<option value="' . $value['id'] . '" selected="">' . $value['nombre'] . '</option>';
					} else {
						$select .= '<option value="' . $value['id'] . '">' . $value['nombre'] . '</option>';
					}
				}
				$select .= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}
		return $select;
	}

	// Select de Proveedores
	public function getHtmlSelectProveedores_xs($name, $id, $options)
	{
		if ($name) {
			$query = 'SELECT cp.id, cp.nombre FROM cmx_proveedores cp
								INNER JOIN cmx_actividad_proveedor cap ON cap.id_proveedor = cp.id
								WHERE cp.estado = "Activo" AND cap.actividad = "Proveedor" ORDER BY cp.nombre';
			$array = $this->_db3->prepare($query);
			$array->execute();
			$array = $array->fetchAll(PDO::FETCH_ASSOC);

			// Se recorre contenido de la consulta
			if ($array) {
				$select = '<select class="form-control input-xs" name="' . $name . '" id="slct_proveedores_' . $id . '" aria-hidden="true" ' . $options . ' placeholder="Proveedor">';
				$select .= '<option value="" selected disabled>Proveedor</option>';

				foreach ($array as $key => $value) {
					if ($value['id'] == $id) {
						$select .= '<option value="' . $value['id'] . '" selected="">' . $value['nombre'] . '</option>';
					} else {
						$select .= '<option value="' . $value['id'] . '">' . $value['nombre'] . '</option>';
					}
				}
				$select .= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}
		return $select;
	}

	// Select de Unidades de Empaque 
	public function getHtmlSelectEmpaques($name, $id, $options)
	{
		if ($name) {
			$query = 'SELECT cue.id, cue.nom_unidad_empaque
					FROM cmx_unidad_empaque cue
					WHERE cue.estado = 1
					ORDER BY cue.nom_unidad_empaque';
			// $array = $this->_db->getConsulta($query);
			$array = $this->_db3->prepare($query);
			$array->execute();
			$array = $array->fetchAll(PDO::FETCH_ASSOC);

			// Se recorre contenido de la consulta
			if ($array) {
				$select = '<select class="form-control input-sm" name="' . $name . '" id="slct_' . $name . '_' . $id . '" aria-hidden="true" ' . $options . ' placeholder="Empaque">';
				$select .= '<option value="" selected disabled>Empaque</option>';
				foreach ($array as $key => $value) {
					if ($value['id'] == $id) {
						$select .= '<option value="' . $value['id'] . '" selected="">' . $value['nom_unidad_empaque'] . '</option>';
					} else {
						$select .= '<option value="' . $value['id'] . '">' . $value['nom_unidad_empaque'] . '</option>';
					}
				}
				$select .= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}
		return $select;
	}

	// Select de Unidades de Empaque 
	public function getHtmlSelectEmpaques_xs($name, $id, $options)
	{
		if ($name) {
			$query = 'SELECT cue.id, cue.nom_unidad_empaque FROM cmx_unidad_empaque cue WHERE cue.estado = 1 ORDER BY cue.nom_unidad_empaque';
			// $array = $this->_db->getConsulta($query);
			$array = $this->_db3->prepare($query);
			$array->execute();
			$array = $array->fetchAll(PDO::FETCH_ASSOC); // Fetch_ASSOC para obtener los resultados como asociativos. Fetch_NUM para obtener los resultados como numéricos. Fetch_BOTH para obtener los resultados como numéricos y asociativos.

			// Se recorre contenido de la consulta
			if ($array) {
				$select = '<select class="form-control input-xs" name="' . $name . '" id="slct_empaque_' . $id . '" aria-hidden="true" ' . $options . ' placeholder="Empaque">';
				$select .= '<option value="" selected disabled>Empaque</option>';

				foreach ($array as $key => $value) {
					if ($value['id'] == $id) {
						$select .= '<option value="' . $value['id'] . '" selected="">' . $value['nom_unidad_empaque'] . '</option>';
					} else {
						$select .= '<option value="' . $value['id'] . '">' . $value['nom_unidad_empaque'] . '</option>';
					}
				}
				$select .= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}
		return $select;
	}

	// Select de Unidades de Empaque 
	public function getHtmlSelectRiesgoMaterial($name, $id, $options)
	{
		if ($name) {
			$query = 'SELECT crm.id, CONCAT(crm.numero_riesgo ," (", crm.nom_riesgo_material,")") AS Material FROM cmx_riesgo_material crm';
			// $array = $this->_db->getConsulta($query);
			$array = $this->_db3->prepare($query);
			$array->execute();
			$array = $array->fetchAll(PDO::FETCH_ASSOC);

			// Se recorre contenido de la consulta
			if ($array) {
				$select = '<select class="form-control input-sm" name="' . $name . '" id="slct_' . $name . '_' . $id . '" aria-hidden="true" ' . $options . ' placeholder="Riesgo">';
				$select .= '<option value="" selected disabled>Riesgo</option>';

				foreach ($array as $key => $value) {
					if ($value['id'] == $id) {
						$select .= '<option value="' . $value['id'] . '" selected="">' . $value['Material'] . '</option>';
					} else {
						$select .= '<option value="' . $value['id'] . '">' . $value['Material'] . '</option>';
					}
				}
				$select .= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}
		return $select;
	}

	// Select de Unidades de Empaque 
	public function getHtmlSelectRiesgoMaterial_xs($name, $id, $options)
	{
		if ($name) {
			$query = 'SELECT crm.id, CONCAT(crm.numero_riesgo ," (", crm.nom_riesgo_material,")") AS RIESGO FROM cmx_riesgo_material crm';
			// $array = $this->_db->getConsulta($query);
			$array = $this->_db3->prepare($query);
			$array->execute();
			$array = $array->fetchAll(PDO::FETCH_ASSOC);

			// Se recorre contenido de la consulta
			if ($array) {
				$select = '<select class="form-control input-xs" name="' . $name . '" id="slct_' . $name . '_' . $id . '" aria-hidden="true" ' . $options . ' placeholder="Riesgo">';
				$select .= '<option value="" selected disabled>Riesgo</option>';

				foreach ($array as $key => $value) {
					if ($value['id'] == $id) {
						$select .= '<option value="' . $value['id'] . '" selected="">' . $value['RIESGO'] . '</option>';
					} else {
						$select .= '<option value="' . $value['id'] . '">' . $value['RIESGO'] . '</option>';
					}
				}
				$select .= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}
		return $select;
	}

	// Select de contratos de cliente para generación de proyectos
	public function getHtmlSelectContratoCliente_sm($name, $id, $id_cliente)
	{
		if ($name) {
			$time = date('Y-m-d');
			$sql = 'SELECT ccc.id, ccc.cod_contrato, ctc.nombre, 
						IF(	DATE_FORMAT( ccc.fecha_inicio, "%d") < DATE_FORMAT( "' . $time . '", "%d"),
							(	SELECT DATE_FORMAT( 
								CONCAT(
									DATE_FORMAT( "' . $time . '", "%Y") ,"-",
									DATE_FORMAT( "' . $time . '", "%m"),"-",
								 	DATE_FORMAT( ccc.fecha_inicio, "%d")
								) 
								, "%Y-%m-%d")
							),
							(	SELECT DATE_FORMAT( 
								CONCAT(
									DATE_FORMAT( "' . $time . '", "%Y") ,"-",
									DATE_FORMAT( DATE_SUB("' . $time . '", INTERVAL 1 MONTH), "%m"),"-",
								 	DATE_FORMAT( ccc.fecha_inicio, "%d")
								) 
								, "%Y-%m-%d")
							)
						) FECHA_CORTE_INICIAL,
						IF(	DATE_FORMAT( ccc.fecha_inicio, "%d") < DATE_FORMAT( "' . $time . '", "%d"),
							(	SELECT DATE_ADD(
									DATE_FORMAT( 
										CONCAT(
											DATE_FORMAT( "' . $time . '", "%Y") ,"-",
											DATE_FORMAT( "' . $time . '", "%m"),"-",
										 	DATE_FORMAT( ccc.fecha_inicio, "%d")
										) 
									, "%Y-%m-%d")
								, INTERVAL 1 MONTH)
							),
							(	SELECT DATE_ADD(
									DATE_FORMAT( 
										CONCAT(
											DATE_FORMAT( "' . $time . '", "%Y") ,"-",
											DATE_FORMAT( DATE_SUB("' . $time . '", INTERVAL 1 MONTH), "%m"),"-",
										 	DATE_FORMAT( ccc.fecha_inicio, "%d")
										)
									, "%Y-%m-%d")
								, INTERVAL 1 MONTH) 
							)
						) FECHA_CORTE_FINAL,
						(
							CASE
								WHEN ctc.id = 1 THEN (
									IF((
										SELECT COUNT(cip1.id) IMPORTACION
										FROM cmx_importacion_proyecto cip1 
										WHERE cip1.id_contrato = ccc.id
											AND DATE_FORMAT( FROM_UNIXTIME( cip1.numero_importacion ), "%Y-%m-%d") 
												BETWEEN 
													IF(	DATE_FORMAT( ccc.fecha_inicio, "%d") < DATE_FORMAT( "' . $time . '", "%d"),
														(	SELECT DATE_FORMAT( 
																CONCAT(
																	DATE_FORMAT( ccc.fecha_inicio, "%Y") ,"-",
																	DATE_FORMAT( "' . $time . '", "%m"),"-",
																 	DATE_FORMAT( ccc.fecha_inicio, "%d")
																) 
															, "%Y-%m-%d")
														),
														(	SELECT DATE_FORMAT( 
																CONCAT(
																	DATE_FORMAT( ccc.fecha_inicio, "%Y") ,"-",
																	DATE_FORMAT( DATE_SUB("' . $time . '", INTERVAL 1 MONTH), "%m"),"-",
																 	DATE_FORMAT( ccc.fecha_inicio, "%d")
																) 
															, "%Y-%m-%d")
														)
													)
												AND 
													IF(	DATE_FORMAT( ccc.fecha_inicio, "%d") < DATE_FORMAT( "' . $time . '", "%d"),
														(	SELECT DATE_ADD(
																DATE_FORMAT( 
																	CONCAT(
																		DATE_FORMAT( ccc.fecha_inicio, "%Y") ,"-",
																		DATE_FORMAT( "' . $time . '", "%m"),"-",
																	 	DATE_FORMAT( ccc.fecha_inicio, "%d")
																	) 
																, "%Y-%m-%d")
															, INTERVAL 1 MONTH)
														),
														(	SELECT DATE_ADD(
																DATE_FORMAT( 
																	CONCAT(
																		DATE_FORMAT( ccc.fecha_inicio, "%Y") ,"-",
																		DATE_FORMAT( DATE_SUB("' . $time . '", INTERVAL 1 MONTH), "%m"),"-",
																	 	DATE_FORMAT( ccc.fecha_inicio, "%d")
																	)
																, "%Y-%m-%d")
															, INTERVAL 1 MONTH) 
														)
													)
									) < (
										SELECT CAST(ccco1.descripcion AS UNSIGNED)
										FROM cmx_contrato_condiciones ccco1
										WHERE ccco1.id_condicion = 1
											AND ccco1.id_contrato = ccc.id
									)
									, TRUE
									, FALSE
									)
								)
								WHEN ctc.id = 3 THEN TRUE 
								ELSE FALSE
							END
						) VALIDA_CONTRATO
					FROM cmx_contrato_cliente ccc
						INNER JOIN cmx_tipo_contrato ctc ON ctc.id = ccc.tipo_contrato
					WHERE ccc.id_cliente = ' . $id_cliente . '
						AND ccc.estado = 1
						AND ccc.fecha_fin > "' . $time . '"
					HAVING VALIDA_CONTRATO
					ORDER BY ccc.fecha_fin DESC
				;';
			// $array = $this->_db->getConsulta($sql);
			$array = $this->_db3->prepare($sql);
			$array->execute();
			$array = $array->fetchAll(PDO::FETCH_ASSOC);

			// Se recorre contenido de la consulta
			$select = '<select class="form-control input-sm" name="' . $name . '" id="slct_contrato_' . $id . '" aria-hidden="true" onchange="muestraFormContrato()">';
			$select .= '<option value="" selected disabled>Seleccione</option>';
			if ($array) {
				foreach ($array as $key => $value) {
					// Se buscan los origenes del contrato
					$query = 'SELECT cm.municipio, cct.tipo_tramo FROM cmx_contrato_tramos cct 
										INNER JOIN cmx_municipios cm ON cm.id = cct.id_ciudad
										WHERE cct.id_contrato = ' . $value['id'] . ' ORDER BY cm.municipio';
					// $result = $this->_db->getConsulta($query);
					$result = $this->_db3->prepare($query);
					$result->execute();
					$result = $result->fetchAll(PDO::FETCH_ASSOC);

					if ($result) {
						$_flag_primer_origen = true;
						$_flag_primer_destino = true;
						$_origenes = "";
						$_destinos = "";
						foreach ($result as $key_01 => $value_01) {
							switch ($value_01["tipo_tramo"]) {
								case 'Cargue':
									if ($_flag_primer_origen) {
										$_flag_primer_origen = false;
										$_origenes .= "[" . $value_01["municipio"];
									} else {
										$_origenes .= "|" . $value_01["municipio"];
									}
									break;

								case 'Descargue':
									if ($_flag_primer_destino) {
										$_flag_primer_destino = false;
										$_destinos .= "[" . $value_01["municipio"];
									} else {
										$_destinos .= "|" . $value_01["municipio"];
									}
									break;
							}
						}
						$_origenes .= "]";
						$_destinos .= "]";
					}

					if ($value['id'] == $id) {
						$select .= '<option value="' . $value['id'] . '" selected="">' . $value['cod_contrato'] . ' - ' . $value['nombre'] . ' ' . $_origenes . $_destinos . '</option>';
					} else {
						$select .= '<option value="' . $value['id'] . '">' . $value['cod_contrato'] . ' - ' . $value['nombre'] . ' ' . $_origenes . $_destinos . '</option>';
					}
				}
			}
			$select .= '<option value="otro">Otro</option>';
			$select .= '</select>';
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}
		return $select;
	}

	// Select de agencias de Nexos Cargo
	public function getSlctAgencias($name, $id, $id_agencia = NULL)
	{
		$sql = 'SELECT * FROM cmx_agencias cag WHERE cag.estado = "Activo" ORDER BY cag.nombre';
		// $request = $this->_db->getConsulta($sql);
		$request = $this->_db3->prepare($sql);
		$request->execute();
		$request = $request->fetchAll(PDO::FETCH_ASSOC);

		$select = '<select class="form-control input-sm" name="' . $name . '" id="slct_agencia_' . $id . '" aria-hidden="true">';
		$select .= '<option value="" disabled selected>Seleccione</option>';
		foreach ($request as $key => $value) {
			if ($value['id'] == $id_agencia) {
				$select .= '<option value="' . $value['id'] . '" selected="selected">' . $value["codigo"] . ' - ' . $value["nombre"] . '</option>';
			} else {
				$select .= '<option value="' . $value['id'] . '">' . $value["codigo"] . ' - ' . $value["nombre"] . '</option>';
			}
		}
		$select .= '</select>';
		return $select;
	}

	// Select de agencias de Nexos Cargo
	public function getSlctContabildadBancosToAnticipos($name, $id, $id_banco = NULL)
	{
		$sql = 'SELECT * FROM cmx_contabilidad_bancos ccb WHERE ccb.estado = "Activo"';
		// $request = $this->_db->getConsulta($sql);
		$request = $this->_db3->prepare($sql);
		$request->execute();
		$request = $request->fetchAll(PDO::FETCH_ASSOC);

		$select = '<select class="form-control" name="' . $name . '" id="cuenta_' . $id . '">';
		$select .= '<option value="" disabled selected>Seleccione</option>';
		foreach ($request as $key => $value) {
			if ($value['id'] == $id_banco) {
				$select .= '<option value="' . $value["cuenta_puc"] . '-' . $value["banco"] . ' (' . $value["numero_cuenta"] . ')" selected="selected">' . $value["banco"] . ' (' . $value["numero_cuenta"] . ')</option>';
			} else {
				$select .= '<option value="' . $value["cuenta_puc"] . '-' . $value["banco"] . ' (' . $value["numero_cuenta"] . ')">' . $value["banco"] . ' (' . $value["numero_cuenta"] . ')</option>';
			}
		}
		$select .= '</select>';
		return $select;
	}

	/***** Funciones con monedas internacionales *****/
	public function getTrmHoy()
	{
		$sql = 'SELECT * FROM cmx_monedas cm
						INNER JOIN cmx_monedas_trm cmt ON cmt.id_moneda = cm.id
						WHERE cmt.fecha = "' . date("Y-m-d", time()) . '"';
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetch(PDO::FETCH_ASSOC);

		$return = '<h4 class="text-danger text-center">No hay TRM registradas para hoy.</h4>';
		if ($result) {
			$return = '
					<table class="table table-striped table-hover">
						<thead>
							<tr>
								<th colspan="2" class="text-center">TRM - ' . date("Y-m-d", time()) . '</th>
							</tr>
						</thead>
						<tbody>
				';

			foreach ($result as $key => $value) {
				$return .= '
						<tr>
							<td class="cell-detail">
								<span>' . $value["nom_moneda"] . ' (' . $value["codigo"] . ')</span>
							</td>
							<td class="cell-detail text-right">
								<span>$' . number_format($value["valor"], 2, ',', '.') . '</span>
							</td>
						</tr>
					';
			}
			$return .= '
						</tbody>
					</table>
				';
		}
		return $return;
	}

	public function getTrmHoyFacturas()
	{
		$sql = 'SELECT *, (cmt.valor+25) TRM_FACTURACON FROM cmx_monedas cm
						INNER JOIN cmx_monedas_trm cmt ON cmt.id_moneda = cm.id
						WHERE cmt.fecha = "' . date("Y-m-d", time()) . '"';
		// $result = $this->_db->getConsulta($sql);
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$result = $result->fetchAll(PDO::FETCH_ASSOC);

		$content = '<h4 class="text-danger text-center">No hay TRM registradas para hoy.</h4>';
		if ($result) {
			$content = '
					<table class="table table-striped table-hover">
						<thead>
							<tr>
								<th colspan="2" class="text-center">TRM - ' . date("Y-m-d", time()) . '</th>
								<th class="text-right">TRM - Facturación</th>
							</tr>
						</thead>
						<tbody>
				';

			$_trm_form = '';
			foreach ($result as $key => $value) {
				$return["result"][$value['id']] = $value;
				$_trm_form .= '<input type="hidden" class="trm_dia_facturacion" data-id_moneda="' . $value['id'] . '" data-moneda_trm="' . $value["nom_moneda"] . ' (' . $value["codigo"] . ')" data-valor_facturacion="' . $value["TRM_FACTURACON"] . '" data-fecha_facturacion_trm="' . date("Y-m-d", time()) . '">';
				$content .= '
						<tr>
							<td class="cell-detail">
								<span>' . $value["nom_moneda"] . ' (' . $value["codigo"] . ')</span>
							</td>
							<td class="cell-detail text-right">
								<span>$' . number_format($value["valor"], 2, ',', '.') . '</span>
							</td>
							<td class="cell-detail text-right">
								<span>$' . number_format($value["TRM_FACTURACON"], 2, ',', '.') . '</span>
							</td>
						</tr>
					';
			}
			$content .= '
						</tbody>
					</table>
					' . $_trm_form . '
				';
		}
		$return["content"] = $content;
		return $return;
	}

	public function getTrm($id_moneda, $fecha)
	{
		if (!$fecha) {
			$fecha = date("Y-m-d");
		}
		$sql = 'SELECT cmt.fecha, cmt.valor, cm.nom_moneda, cm.codigo, CONCAT(cm.nom_moneda," (",cm.codigo,")") MONEDA FROM cmx_monedas_trm cmt
						INNER JOIN cmx_monedas cm ON cm.id = cmt.id_moneda
			     	WHERE cmt.id_moneda = ' . $id_moneda . ' AND cmt.fecha = "' . $fecha . '"';
		// $result = $this->_db->getConsulta($sql);
		// $return = $result["rowsData"][0];
		// return $return;
		$result = $this->_db3->prepare($sql);
		$result->execute();
		$return = $result->fetch(PDO::FETCH_ASSOC);
		return $return;
	}
	/***** FIN - Funciones con monedas internacionales *****/

	public function getNumeroEnLetra($num, $decimales)
	{
		return numeroEnLetras($num, $decimales);
	}

	public function numeroAletra($numero)
	{
		switch ($numero) {
			case 1:
				$return = "A";
				break;

			case 2:
				$return = "B";
				break;

			case 3:
				$return = "C";
				break;

			case 4:
				$return = "D";
				break;

			case 5:
				$return = "E";
				break;

			case 6:
				$return = "F";
				break;

			case 7:
				$return = "G";
				break;

			case 8:
				$return = "H";
				break;

			case 9:
				$return = "I";
				break;

			case 10:
				$return = "J";
				break;

			case 11:
				$return = "K";
				break;

			case 12:
				$return = "L";
				break;

			case 13:
				$return = "M";
				break;

			case 14:
				$return = "N";
				break;

			case 15:
				$return = "O";
				break;

			case 16:
				$return = "P";
				break;

			case 17:
				$return = "Q";
				break;

			case 18:
				$return = "R";
				break;

			case 19:
				$return = "S";
				break;

			case 20:
				$return = "T";
				break;

			case 21:
				$return = "U";
				break;

			case 22:
				$return = "V";
				break;

			case 23:
				$return = "W";
				break;

			case 24:
				$return = "X";
				break;

			case 25:
				$return = "Y";
				break;

			case 26:
				$return = "Z";
				break;

			case 27:
				$return = "AA";
				break;

			case 28:
				$return = "AB";
				break;

			case 29:
				$return = "AC";
				break;

			case 30:
				$return = "AD";
				break;

			case 31:
				$return = "AE";
				break;

			case 32:
				$return = "AF";
				break;

			case 33:
				$return = "AG";
				break;

			case 34:
				$return = "AH";
				break;

			case 35:
				$return = "AI";
				break;

			case 36:
				$return = "AJ";
				break;

			case 37:
				$return = "AK";
				break;

			case 38:
				$return = "AL";
				break;

			case 39:
				$return = "AM";
				break;

			case 40:
				$return = "AN";
				break;

			case 41:
				$return = "AO";
				break;

			default:
				$return = $numero;
				break;
		}
		return $return;
	}

	public function minutesToString($minutes)
	{
		$numdays = floor($minutes / 1440);
		$numhours = floor(($minutes % 1440) / 60);
		$numminutes = floor((($minutes % 1440) % 60) % 60);

		$textominutos = "";
		$textodias = "";
		$textohoras = "";

		if ($numminutes == 1) {
			$textominutos = $numminutes . " minuto";
		} else if ($numminutes > 1) {
			$textominutos = $numminutes . " minutos";
		}
		if ($numhours == 1) {
			$textohoras = $numhours . " hora";
		} else if ($numhours > 1) {
			$textohoras = $numhours . " horas";
		}

		if ($numdays == 1) {
			$textodias = $numdays . " dia";
		} else if ($numdays > 1) {
			$textodias = $numdays . " dias";
		}
		if ($numdays > 0 && $numhours > 0 && $numminutes > 0) {
			return $textodias . ", " . $textohoras . " y " . $textominutos;
		} else if ($numdays > 0 && $numhours == 0 && $numminutes > 0) {
			return $textodias . " y " . $textominutos;
		} else if ($numdays > 0 && $numhours > 0 && $numminutes == 0) {
			return $textodias . " y " . $textohoras;
		} else if ($numdays == 0 && $numhours > 0 && $numminutes > 0) {
			return $textohoras . " y " . $textominutos;
		} else if ($numdays > 0 && $numhours == 0 && $numminutes == 0) {
			return $textodias;
		} else if ($numdays == 0 && $numhours > 0 && $numminutes == 0) {
			return $textohoras;
		} else if ($numdays == 0 && $numhours == 0 && $numminutes > 0) {
			return $textominutos;
		}
	}

	public function validaAdministrador($id_perfil, $tmp_perfil = NULL)
	{
		$flag_administrador = false;
		if ($id_perfil == 13 or $id_perfil == 1 or $id_perfil == 22 || $tmp_perfil) {
			$flag_administrador = true;
		}
		return $flag_administrador;
	}

	/****** Funciones de integración con Web Service Min-Transporte ******/
	// Consulta al RNDC 
	public function getRNDCQueryArray($array)
	{
		$result = $this->_db->getRNDCQueryArray($array);
		return $result;
	}

	// Select de materiales rndc 
	public function getHtmlSelectRNDCTipoMaterial($name, $id)
	{
		if ($name) {
			$query = '
					SELECT * 
					FROM cmx_rndc_materiales crm
					ORDER BY crm.nombre';
			$array = $this->_db->getConsulta($query);

			// Se recorre contenido de la consulta
			if ($array) {
				$select = '<select class="form-control" name="' . $name . '" id="slct_rndc_material_' . $id . '">';
				$select .= '<option value="" selected disabled>Seleccione</option>';

				foreach ($array['rowsData'] as $key => $value) {
					if ($value[0] == $id) {
						$select .= '<option value="' . $value[0] . '" selected="">' . $value[1] . '</option>';
					} else {
						$select .= '<option value="' . $value[0] . '">' . $value[1] . '</option>';
					}
				}
				$select .= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}
		return $select;
	}

	// Select de materiales rndc 
	public function getHtmlSelectRNDCTipoMaterial_sm($name, $id)
	{
		if ($name) {
			$query = $this->_db3->prepare('SELECT * FROM cmx_rndc_materiales crm ORDER BY crm.nombre');
			$query->execute();
			$array = $query->fetchAll(PDO::FETCH_ASSOC);
			// $array = $this->_db->getConsulta($query);

			// Se recorre contenido de la consulta
			if ($array) {
				$select = '<select class="form-control input-sm" name="' . $name . '" id="slct_rndc_material_' . $id . '">';
				$select .= '<option value="" selected disabled>Seleccione</option>';

				foreach ($array as $key => $value) {
					if ($value['rndc_id_material'] == $id) {
						$select .= '<option value="' . $value['rndc_id_material'] . '" selected="">' . $value['nombre'] . '</option>';
					} else {
						$select .= '<option value="' . $value['rndc_id_material'] . '">' . $value['nombre'] . '</option>';
					}
				}
				$select .= '</select>';
			} else {
				$select = "No hay datos en esta tabla...";
			}
		} else {
			$select = "Debe poner un nombre al campo, para que funcione debe hacerlo enviando el nombre en el primer parámetro de la función";
		}
		return $select;
	}
	/****** Fin - Funciones de integración con Web Service Min-Transporte ******/

	/***** FUNCIÓN PARA SACAR LA DIFERENCIA DE TIEMPO ENTRE 2 FECHAS *****/
	public function getTimeDiff($fecha_ini, $fecha_fin)
	{
		$return["fecha_inicial"] = $fecha_ini;
		$return["fecha_final"] = $fecha_fin;

		// Se verifica si tiempo sin realizarse el seguimiento
		$fecha_ini = new DateTime($fecha_ini);
		$fecha_fin = new DateTime($fecha_fin);
		$diferencia = $fecha_ini->diff($fecha_fin);

		$return["diferencia"]["years"]["value"] = (int) $diferencia->format('%Y');
		$return["diferencia"]["years"]["text"] = "años";
		$return["diferencia"]["months"]["value"] = (int) $diferencia->format('%m');
		$return["diferencia"]["months"]["text"] = "meses";
		$return["diferencia"]["days"]["value"] = (int) $diferencia->format('%d');
		$return["diferencia"]["days"]["text"] = "días";
		$return["diferencia"]["hours"]["value"] = (int) $diferencia->format('%H');
		$return["diferencia"]["hours"]["text"] = "horas";
		$return["diferencia"]["minutes"]["value"] = (int) $diferencia->format('%i');
		$return["diferencia"]["minutes"]["text"] = "minutos";
		$return["diferencia"]["seconds"]["value"] = (int) $diferencia->format('%s');
		$return["diferencia"]["seconds"]["text"] = "segundos";

		$return["diferencia_text_full"] = $diferencia->format('%Y años %m meses %d days %H horas %i minutos %s segundos');
		$return["diferencia_text"] = "";
		foreach ($return["diferencia"] as $key => $value) {
			if ($value["value"] > 0) {
				$return["diferencia_text"] .= $value["value"] . ' ' . $value["text"] . ' ';
			}
		}
		return $return;
	}
	/***** FUNCIÓN PARA SACAR LA DIFERENCIA DE TIEMPO ENTRE 2 FECHAS *****/

	public function getTiemposSeguimientos($fecha_inicio, $array_seguimientos)
	{
		// Se invierte el orden del arreglo 
		$_count = 1;
		foreach ($array_seguimientos as $key => $value) {
			$_key = COUNT($array_seguimientos) - $_count;
			$tiempo = $this->getTimeDiff($fecha_inicio, $array_seguimientos[$_key]["fecha_hora"]);
			$array[$_key] = $tiempo["diferencia_text"];
			$fecha_inicio = $array_seguimientos[$_key]["fecha_hora"];
			$_count++;
		}
		$return = $array;
		return $return;
	}

	/***** FUNCIONES DE PARAMENTROS DE CUENTAS CONTABLES *****/
	public function getEnumSlctContTipoPersona($name, $id, $value_select)
	{
		$sql = "
				SHOW COLUMNS FROM 
					cmx_contabilidad_cuentas 
				LIKE 'tipo_persona' 
			";
		$result = $this->_db->getConsulta($sql);

		foreach ($result["rowsData"] as $key => $value) {
			$value["Type"] = str_replace("enum(", "", $value["Type"]);
			$value["Type"] = str_replace(")", "", $value["Type"]);
			$value["Type"] = str_replace("'", "", $value["Type"]);

			$array = explode(",", $value["Type"]);
		}

		$select = '<select  class="form-control input-sm" name="' . $name . '" id="slct_' . $name . '_' . $id . '">';
		$select .= '<option value="" selected disabled>Seleccione</option>';
		foreach ($array as $key => $value) {
			if ($value == $value_select) {
				$select .= '<option value="' . $value . '" selected="">' . $value . '</option>';
			} else {
				$select .= '<option value="' . $value . '">' . $value . '</option>';
			}
		}
		$select .= '</select>';
		return $select;
	}

	public function getEnumSlctContTipoDocumento($name, $id, $value_select)
	{
		$sql = "
				SHOW COLUMNS FROM 
					cmx_contabilidad_cuentas 
				LIKE 'tipo_documento' 
			";
		$result = $this->_db->getConsulta($sql);

		foreach ($result["rowsData"] as $key => $value) {
			$value["Type"] = str_replace("enum(", "", $value["Type"]);
			$value["Type"] = str_replace(")", "", $value["Type"]);
			$value["Type"] = str_replace("'", "", $value["Type"]);

			$array = explode(",", $value["Type"]);
		}

		$select = '<select  class="form-control input-sm" name="' . $name . '" id="slct_' . $name . '_' . $id . '">';
		$select .= '<option value="" selected disabled>Seleccione</option>';
		foreach ($array as $key => $value) {
			if ($value == $value_select) {
				$select .= '<option value="' . $value . '" selected="">' . $value . '</option>';
			} else {
				$select .= '<option value="' . $value . '">' . $value . '</option>';
			}
		}
		$select .= '</select>';
		return $select;
	}

	public function getEnumSlctContTipoCuenta($name, $id, $value_select)
	{
		$sql = "
				SHOW COLUMNS FROM 
					cmx_contabilidad_cuentas 
				LIKE 'tipo_cuenta' 
			";
		$result = $this->_db->getConsulta($sql);

		foreach ($result["rowsData"] as $key => $value) {
			$value["Type"] = str_replace("enum(", "", $value["Type"]);
			$value["Type"] = str_replace(")", "", $value["Type"]);
			$value["Type"] = str_replace("'", "", $value["Type"]);

			$array = explode(",", $value["Type"]);
		}

		$select = '<select  class="form-control input-sm" name="' . $name . '" id="slct_' . $name . '_' . $id . '">';
		$select .= '<option value="" selected disabled>Seleccione</option>';
		foreach ($array as $key => $value) {
			if ($value == $value_select) {
				$select .= '<option value="' . $value . '" selected="">' . $value . '</option>';
			} else {
				$select .= '<option value="' . $value . '">' . $value . '</option>';
			}
		}
		$select .= '</select>';
		return $select;
	}
	/***** FIN - FUNCIONES DE PARAMENTROS DE CUENTAS CONTABLES *****/
}

function getYearDow($year)
{
	switch ($year) {
		case '0':
			$nuevo_year = "2000";
			break;

		case '1':
			$nuevo_year = "2001";
			break;

		case '2':
			$nuevo_year = "2002";
			break;

		case '3':
			$nuevo_year = "2003";
			break;

		case '4':
			$nuevo_year = "2004";
			break;

		case '5':
			$nuevo_year = "2005";
			break;

		case '6':
			$nuevo_year = "2006";
			break;

		case '7':
			$nuevo_year = "2007";
			break;

		case '8':
			$nuevo_year = "2008";
			break;

		case '9':
			$nuevo_year = "2009";
			break;

		case 'A':
			$nuevo_year = "2010";
			break;

		case 'B':
			$nuevo_year = "2011";
			break;

		case 'C':
			$nuevo_year = "2012";
			break;

		case 'D':
			$nuevo_year = "2013";
			break;

		case 'E':
			$nuevo_year = "2014";
			break;

		case 'F':
			$nuevo_year = "2015";
			break;

		case 'G':
			$nuevo_year = "2016";
			break;

		case 'H':
			$nuevo_year = "2017";
			break;

		case 'I':
			$nuevo_year = "2018";
			break;

		case 'J':
			$nuevo_year = "2019";
			break;

		case 'K':
			$nuevo_year = "2020";
			break;

		case 'L':
			$nuevo_year = "2021";
			break;

		case 'M':
			$nuevo_year = "2022";
			break;

		case 'N':
			$nuevo_year = "2023";
			break;

		case 'O':
			$nuevo_year = "2024";
			break;

		case 'P':
			$nuevo_year = "2025";
			break;

		case 'Q':
			$nuevo_year = "2026";
			break;

		case 'R':
			$nuevo_year = "2027";
			break;

		case 'S':
			$nuevo_year = "2028";
			break;

		case 'T':
			$nuevo_year = "2029";
			break;

		case 'U':
			$nuevo_year = "2030";
			break;

		case 'V':
			$nuevo_year = "2031";
			break;

		case 'W':
			$nuevo_year = "2032";
			break;

		case 'X':
			$nuevo_year = "2033";
			break;

		case 'Y':
			$nuevo_year = "2034";
			break;

		case 'Z':
			$nuevo_year = "2035";
			break;

		default:
			$nuevo_year = "Error de año";
			break;
	}
	return $nuevo_year;
}

function getMonthDow($month)
{
	switch ($month) {
		case '0':
			$nuevo_month = "2000";
			break;

		case '1':
			$nuevo_month = "01";
			break;

		case '2':
			$nuevo_month = "02";
			break;

		case '3':
			$nuevo_month = "03";
			break;

		case '4':
			$nuevo_month = "04";
			break;

		case '5':
			$nuevo_month = "05";
			break;

		case '6':
			$nuevo_month = "06";
			break;

		case '7':
			$nuevo_month = "07";
			break;

		case '8':
			$nuevo_month = "08";
			break;

		case '9':
			$nuevo_month = "09";
			break;

		case 'A':
			$nuevo_month = "10";
			break;

		case 'B':
			$nuevo_month = "11";
			break;

		case 'C':
			$nuevo_month = "12";
			break;

		default:
			$nuevo_month = "Error de mes";
			break;
	}
	return $nuevo_month;
}

function getDayDow($day)
{
	switch ($day) {
		case '0':
			$nuevo_day = "00";
			break;

		case '1':
			$nuevo_day = "01";
			break;

		case '2':
			$nuevo_day = "02";
			break;

		case '3':
			$nuevo_day = "03";
			break;

		case '4':
			$nuevo_day = "04";
			break;

		case '5':
			$nuevo_day = "05";
			break;

		case '6':
			$nuevo_day = "06";
			break;

		case '7':
			$nuevo_day = "07";
			break;

		case '8':
			$nuevo_day = "08";
			break;

		case '9':
			$nuevo_day = "09";
			break;

		case 'A':
			$nuevo_day = "10";
			break;

		case 'B':
			$nuevo_day = "11";
			break;

		case 'C':
			$nuevo_day = "12";
			break;

		case 'D':
			$nuevo_day = "13";
			break;

		case 'E':
			$nuevo_day = "14";
			break;

		case 'F':
			$nuevo_day = "15";
			break;

		case 'G':
			$nuevo_day = "16";
			break;

		case 'H':
			$nuevo_day = "17";
			break;

		case 'I':
			$nuevo_day = "18";
			break;

		case 'J':
			$nuevo_day = "19";
			break;

		case 'K':
			$nuevo_day = "";
			break;

		case 'L':
			$nuevo_day = "21";
			break;

		case 'M':
			$nuevo_day = "22";
			break;

		case 'N':
			$nuevo_day = "23";
			break;

		case 'O':
			$nuevo_day = "24";
			break;

		case 'P':
			$nuevo_day = "25";
			break;

		case 'Q':
			$nuevo_day = "26";
			break;

		case 'R':
			$nuevo_day = "27";
			break;

		case 'S':
			$nuevo_day = "28";
			break;

		case 'T':
			$nuevo_day = "29";
			break;

		case 'U':
			$nuevo_day = "30";
			break;

		case 'V':
			$nuevo_day = "31";
			break;

		default:
			$nuevo_day = "Error de día";
			break;
	}
	return $nuevo_day;
}

/***** FUNCIONES PARA PASAR NÚMEROS A TEXTO *****/
function numeroEnLetras($num, $decimal)
{
	$new_num = number_format($num, 2, ',', '.');
	$array = explode(",", $new_num);

	// Se buscan los enteros 
	$entero = $array[0];
	$arrayEntero = explode(".", $entero);

	foreach ($arrayEntero as $key => $value) {
		$new_key = ((COUNT($arrayEntero) - 1) - $key);
		$newArrayEntero[$new_key] = $value;
	}

	$numero = "";
	foreach ($newArrayEntero as $key => $value) {
		switch ($key) {
			case '0':
				$numero .= pasaALetra((int) $value);
				break;

			case '1': // miles
				if ((int) $value == 1) {
					if (count($newArrayEntero) == 2) {
						$numero .= "MIL ";
					} else {
						$numero .= " UN MIL ";
					}
				} else {
					$numero .= pasaALetra((int) $value) . " MIL ";
				}
				break;

			case '2': // millones 
				if ((int) $value == 1) {
					$numero .= pasaALetra((int) $value) . " MILLÓN ";
				} else {
					$numero .= pasaALetra((int) $value) . " MILLONES ";
				}
				break;

			case '3': // miles de millones
				$numero .= pasaALetra((int) $value) . " MIL MILLONES ";
				break;
		}
	}
	$return["entero"] = $numero;

	// Se buscan los decimales 
	if ($decimal == 1) {
		// Se pregunta si es diferente de 0
		$decimal = $array[1];
		if ($decimal != "0") {
			$cantidad_cifras = strlen($decimal);
			if ($cantidad_cifras == 1) {
				$decimal *= 10;
			}
			$return["decimal"] = pasaALetra((int) $decimal);
		} else {
			$return["decimal"] = "";
		}
	}
	return $return;
}

function pasaALetra($num)
{
	$digitos = strlen($num);
	switch ($digitos) {
		case '1':
			$numero = unidadesLetra($num);
			break;

		case '2':
			$numero = decenasLetra($num);
			break;

		case '3':
			$numero = centenasLetra($num);
			break;
	}
	return $numero;
}

function unidadesLetra($num)
{
	switch ($num) {
		case '0':
			$numero = "CERO";
			break;
		case '1':
			$numero = "UN";
			break;
		case '2':
			$numero = "DOS";
			break;
		case '3':
			$numero = "TRES";
			break;
		case '4':
			$numero = "CUATRO";
			break;
		case '5':
			$numero = "CINCO";
			break;
		case '6':
			$numero = "SEIS";
			break;
		case '7':
			$numero = "SIETE";
			break;
		case '8':
			$numero = "OCHO";
			break;
		case '9':
			$numero = "NUEVE";
			break;
		default:
			$numero = "";
			break;
	}
	return $numero;
}

function decenasLetra($num)
{
	switch ($num) {
		case '10':
			$numero = "DIEZ";
			break;
		case '11':
			$numero = "ONCE";
			break;
		case '12':
			$numero = "DOCE";
			break;
		case '13':
			$numero = "TRECE";
			break;
		case '14':
			$numero = "CATORCE";
			break;
		case '15':
			$numero = "QUINCE";
			break;
		case '16':
			$numero = "DIECISEIS";
			break;
		case '17':
			$numero = "DIECISIETE";
			break;
		case '18':
			$numero = "DIECIOCHO";
			break;
		case '19':
			$numero = "DIECINUEVE";
			break;
		case '20':
			$numero = "VEINTE";
			break;
		case '21':
			$numero = "VEINTIUN";
			break;
		case '22':
			$numero = "VEINTIDOS";
			break;
		case '23':
			$numero = "VEINTITRES";
			break;
		case '24':
			$numero = "VEINTICUATRO";
			break;
		case '25':
			$numero = "VEINTICINCO";
			break;
		case '26':
			$numero = "VEINTISEIS";
			break;
		case '27':
			$numero = "VEINTISIETE";
			break;
		case '28':
			$numero = "VEINTIOCHO";
			break;
		case '29':
			$numero = "VEINTINUEVE";
			break;
		default:
			$array = str_split((string) $num);
			switch ($array[0]) {
				case '3':
					$decima = "TREINTA";
					break;
				case '4':
					$decima = "CUARENTA";
					break;
				case '5':
					$decima = "CINCUENTA";
					break;
				case '6':
					$decima = "SESENTA";
					break;
				case '7':
					$decima = "SETENTA";
					break;
				case '8':
					$decima = "OCHENTA";
					break;
				case '9':
					$decima = "NOVENTA";
					break;
			}
			$numero = $decima;
			if ($array[1] != 0) {
				$numero = $decima . " Y " . unidadesLetra($array[1]);
			}
			break;
	}
	return $numero;
}

function centenasLetra($num)
{
	switch ($num) {
		case '100':
			$numero = "CIEN";
			break;
		default:
			$array = str_split((string) $num);
			switch ($array[0]) {
				case '1':
					$centena = "CIENTO";
					break;
				case '2':
					$centena = "DOSCIENTOS";
					break;
				case '3':
					$centena = "TRESCIENTOS";
					break;
				case '4':
					$centena = "CUATROCIENTOS";
					break;
				case '5':
					$centena = "QUINIENTOS";
					break;
				case '6':
					$centena = "SEISCIENTOS";
					break;
				case '7':
					$centena = "SETECIENTOS";
					break;
				case '8':
					$centena = "OCHOCIENTOS";
					break;
				case '9':
					$centena = "NOVECIENTOS";
					break;
			}
			$numero = $centena;
			$decimas = $array[1] . $array[2];
			if ($decimas != 0) {
				if ($decimas > 9) {
					$numero = $centena . " " . decenasLetra($decimas);
				} else {
					$numero = $centena . " " . unidadesLetra($decimas);
				}
			}
			break;
	}
	return $numero;
}
/***** FUNCIONES PARA PASAR NUMEROS A TEXTO *****/
