<?php
date_default_timezone_set('America/Bogota');

include "../application/Config.php";
include '../application/Conexion.php';
require_once 'PHPMailer/class.phpmailer.php';
require_once 'PHPMailer/class.smtp.php';

class Session
{

    public $user_log;
    public $pass;
    public $mensaje;
    public $respuesta;
    public $email;
    public $listado;

public $coun_actividades;
public $fetch;

    public function login()
    {
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "SELECT uc.* , u.nom_usuario as 'nom_usuario',
                u.url_avatar as 'avatar' , u.email as 'email',
                p.nombre_perfil as 'nombre_perfil',
                c.nombre as 'nombre_cliente'
                FROM cmx_usuarios u, "
            . "cmx_usuario_cliente uc, cmx_clientes c, cmx_perfiles p  "
            . "WHERE u.user_log=:user_log "
            . "AND (u.pass=:pass) "
            . "AND u.estado=1 AND u.id = uc.id_usuario "
            . "AND uc.estado=1 AND uc.id_cliente =c.id "
            . "AND p.estado=1 "
            . "AND uc.id_perfil = p.id "
            . "AND c.estado=1 AND p.id NOT IN (2,3) ";
        $this->pass = sha1($this->pass);
        $consulta   = $conexion->prepare($sql);
        $consulta->bindParam(':user_log', $this->user_log, PDO::PARAM_STR);
        $consulta->bindParam(':pass', $this->pass, PDO::PARAM_STR);
        $consulta->execute();
        $total = $consulta->rowCount();
        if ($total == 0) {
            $this->respuesta = "BAD";
        } else {
            $this->respuesta = "GOOD";
            $fila            = $consulta->fetch();
            session_start();
            $_SESSION['usuario']['id_cliente']     = $fila['id_cliente'];
            $_SESSION['usuario']['id_usuario']     = $fila['id_usuario'];
            $_SESSION['usuario']['id_perfil']      = $fila['id_perfil'];
            $_SESSION['usuario']['nom_usuario']    = $fila['nom_usuario'];
            $_SESSION['usuario']['avatar']         = $fila['avatar'];
            $_SESSION['usuario']['nombre_perfil']  = $fila['nombre_perfil'];
            $_SESSION['usuario']['nombre_cliente'] = $fila['nombre_cliente'];
            $_SESSION['usuario']['id_bodega'] = $fila['id_bodega'];
        }
    }

    public function recuperar()
    {
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "SELECT u.reset_pass,u.email,u.user_log FROM cmx_usuarios u, "
            . "cmx_usuario_cliente uc, cmx_clientes c "
            . "WHERE u.email=:email "
            . "AND u.estado=1 AND u.id = uc.id_usuario "
            . "AND uc.estado=1 AND uc.id_cliente =c.id "
            . "AND c.estado=1";
        $consulta = $conexion->prepare($sql);
        $consulta->bindParam(':email', $this->email, PDO::PARAM_STR);
        $consulta->execute();
        $total = $consulta->rowCount();
        $fila  = $consulta->fetch();
        if ($total == 0) {
            $this->respuesta = "BAD";
        } else {

            $sql = "UPDATE cmx_usuarios "
                . "SET reset_pass=:code "
                . "WHERE email=:email ";
            $consulta = $conexion->prepare($sql);
            $code     = $this->generarRandompassword(8);
            $consulta->bindParam(':email', $this->email, PDO::PARAM_STR);
            $consulta->bindParam(':code', $code, PDO::PARAM_STR);
            $consulta->execute();
            session_start();
            $_SESSION['confirm_reset']['reset_pass'] = $user['reset_pass'] = $code;
            $_SESSION['confirm_reset']['user_log']   = $user['user_log']   = $fila['user_log'];
            $_SESSION['confirm_reset']['email']      = $user['email']      = $fila['email'];
            $key                                     = $this->crearKey($user);
            $enlace                                  = BASE_URL . "index/reset?k=" . $key;
            $this->mensaje                           = $enlace;
            $subject                                 = "Correo de Prueba";
            $message                                 = "Hola, como estas<br><br><br><br><br>"
                . "Este es el codigo de recuperacion que se te asigno.<br><br>Codigo de recuperacion: " . $code . "<br><br>"
                . "Accede a este enlace para la recuperacion de tu contraseña<br><br>" . $enlace . "<br><br>";
            $to              = $user['email'];
            $email           = $this->sendEmail($subject, $message, null, null, null, $to);
            $this->respuesta = "GOOD";
        }
    }

    public function campana_notificaciones()
    {
		$Data = new Consultas;

        // Tomo la fecha actual
        $fecha_actual = getdate();
        // Se toma la fecha actual para poner la fecha inicial de la siguinete actividad
        $_ahora = $fecha_actual["year"] . "-" . $fecha_actual["mon"] . "-" . $fecha_actual["mday"] . " " . $fecha_actual["hours"] . ":" . $fecha_actual["minutes"] . ":" . $fecha_actual["seconds"];

        // Se pregunta si el usuario tiene actividades asignadas dentro de los proyectos
		$sql = "
			SELECT 
				cia.id_importacion, cia.grupo, COUNT(cia.id) CUANTOS
			FROM 
				cmx_importacion_actividades cia
			WHERE 
				cia.responsable = $this->user_log
				AND cia.estado = 2
			GROUP BY cia.id_importacion, cia.grupo;
		";

		$arrayActividades = $Data->getConsulta($sql);

		if ($arrayActividades) {
			$this->respuesta = "GOOD";
			foreach ($arrayActividades["rowsData"] as $key => $value) {
				// Se pregunta si el usuario tiene actividades asignadas dentro de los proyectos
				$sql = '
					SELECT 
						COUNT(cia.id) CUANTOS
					FROM 
						cmx_importacion_actividades cia
					WHERE 
						cia.id_importacion = ' . $value["id_importacion"] . '
						AND cia.grupo = ' . $value["grupo"] . '
						AND cia.id_material IS NOT NULL
				';
				$arrayValidaActividades = $Data->getConsulta($sql);

				if ( $arrayValidaActividades["rowsData"][0]["CUANTOS"] > 0 ) {
					$sql = "
						SELECT 
							cip.numero_importacion, cia.grupo,
							cia.id_importacion, cia.fecha_hora_inicio, cia.nombre, cia.notificado,
							TIMESTAMPDIFF(MINUTE, '" . $_ahora . "',
							(cia.fecha_hora_inicio + INTERVAL cia.tiempo_aprobado MINUTE )) as 'tiempo_notificaciones'
						FROM 
							cmx_importacion_actividades cia
							INNER JOIN cmx_importacion_proyecto cip ON cip.id = cia.id_importacion
						WHERE 
							cia.responsable = $this->user_log
							AND cia.estado = 2
							AND cia.id_importacion = " . $value["id_importacion"] . "
							AND cia.grupo = " . $value["grupo"] . "
							AND cia.fecha_hora_inicio IS NOT NULL
							AND cia.id_material IS NOT NULL
						GROUP BY cip.numero_importacion, cia.grupo, cia.orden
						ORDER BY tiempo_notificaciones ASC;
					";

					$arrayActividadesPendientes = $Data->getConsulta($sql);
					if ($arrayActividadesPendientes) {
						foreach ($arrayActividadesPendientes["rowsData"] as $key_1 => $value_1) {
							$array["nombre"] = $value_1["nombre"];
							$array["numero_importacion"] = $value_1["numero_importacion"];
							$array["tiempo_notificaciones"] = $value_1["tiempo_notificaciones"];
							$array["grupo"] = $value_1["grupo"];
							$this->listado[] = $array;
						}
					}
				}else{
					$sql = "
						SELECT 
							cip.numero_importacion, cia.grupo,
							cia.id_importacion, cia.fecha_hora_inicio, cia.nombre, cia.notificado,
							TIMESTAMPDIFF(MINUTE, '" . $_ahora . "',
							(cia.fecha_hora_inicio + INTERVAL cia.tiempo_aprobado MINUTE )) as 'tiempo_notificaciones'
						FROM 
							cmx_importacion_actividades cia
							INNER JOIN cmx_importacion_proyecto cip ON cip.id = cia.id_importacion
						WHERE 
							cia.responsable = $this->user_log
							AND cia.estado = 2
							AND cia.id_importacion = " . $value["id_importacion"] . "
							AND cia.grupo = " . $value["grupo"] . "
							AND cia.fecha_hora_inicio IS NOT NULL
							AND cia.id_material IS NULL
						GROUP BY cip.numero_importacion, cia.grupo, cia.orden
						ORDER BY tiempo_notificaciones ASC;
					";

					$arrayActividadesPendientes = $Data->getConsulta($sql);
					if ($arrayActividadesPendientes) {
						foreach ($arrayActividadesPendientes["rowsData"] as $key_1 => $value_1) {
							$array["nombre"] = $value_1["nombre"];
							$array["numero_importacion"] = $value_1["numero_importacion"];
							$array["tiempo_notificaciones"] = $value_1["tiempo_notificaciones"];
							$array["grupo"] = $value_1["grupo"];
							$this->listado[] = $array;
						}
					}
				}
			}
		} else {
			$this->respuesta = "BAD";
		}
    }
    public function notificar(){
        $model = new Conexion;
        $conexion = $model->conectar();

        // Tomo la fecha actual
        $fecha_actual = getdate();
        // Se toma la fecha actual para poner la fecha inicial de la siguinete actividad
        $_ahora = $fecha_actual["year"] . "-" . $fecha_actual["mon"] . "-" . $fecha_actual["mday"] . " " . $fecha_actual["hours"] . ":" . $fecha_actual["minutes"] . ":" . $fecha_actual["seconds"];

        $sql ="
            SELECT 
                cip.numero_importacion, cia.id_importacion, cia.fecha_hora_inicio,
                cia.tiempo_aprobado, cia.nombre, cia.notificado,
                TIMESTAMPDIFF(MINUTE, cia.fecha_hora_inicio, '" . $_ahora . "') as 'diferencia',
                TIMESTAMPDIFF(MINUTE, '" . $_ahora . "',
                (cia.fecha_hora_inicio + INTERVAL cia.tiempo_aprobado MINUTE )) as 'tiempo_notificaciones'
            FROM 
                    cmx_importacion_actividades cia
                    INNER JOIN cmx_importacion_proyecto cip ON cip.id = cia.id_importacion
            WHERE 
                cia.responsable = :user_log
                AND cia.estado = 2
                AND cia.fecha_hora_inicio IS NOT NULL
                AND cia.notificado = '0'
            GROUP BY cip.numero_importacion
            ORDER BY tiempo_notificaciones ASC;
        ";

        $consulta = $conexion->prepare($sql);
        $consulta->bindParam(':user_log', $this->user_log, PDO::PARAM_STR);
        $consulta->execute();
        $total = $consulta->rowCount();
        if ($total == 0) {
            $this->respuesta = "BAD";
        } else {
            $this->respuesta = "GOOD";
            while ($datos_actividades = $consulta->fetch()) {
                $dato1 = $datos_actividades['diferencia_restante'] = $this->calculartiempo($datos_actividades['tiempo_aprobado']);
                $dato2 = $datos_actividades['diferencia'];
                if ($datos_actividades['diferencia'] >= $datos_actividades['diferencia_restante']) {
                    $this->listado[] = array_map("utf8_encode", $datos_actividades );

                    $sql = "SELECT id FROM cmx_importacion_proyecto "
                        . "WHERE numero_importacion= :numero_importacion";
                    $consultaordenes = $conexion->prepare($sql);
                    $consultaordenes->bindParam(':numero_importacion', $datos_actividades["numero_importacion"], PDO::PARAM_STR);
                    $consultaordenes->execute();
                    $tot           = $consultaordenes->rowCount();

                    $this->mensaje.= $tot;
                    while ($ordenes = $consultaordenes->fetch()) {
                        $sql = "UPDATE cmx_importacion_actividades "
                            . "SET notificado = '1' "
                            . "WHERE nombre= :nombre AND id_importacion = :id_importacion";
                        $consulta_actividades = $conexion->prepare($sql);
                        $consulta_actividades->bindParam(':id_importacion', $ordenes["id"], PDO::PARAM_STR);
                        $consulta_actividades->bindParam(':nombre', $datos_actividades["nombre"], PDO::PARAM_STR);
                        $consulta_actividades->execute();
                    }
                    break;
                }
            }
        }
    }
    public function Obteneringresos($id_bodega)
    {
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "   SELECT ci.*, (SELECT COUNT(ce.id) 
                        FROM cmx_material_bodega cmb, 
                         cmx_embalaje ce
                        WHERE cmb.id = ce.id_material_bodega 
                        AND cmb.id_ingreso = ci.id 
                        AND ce.grupo > 0 ) AS 'tot',
                        (SELECT COUNT(ce.id) 
                        FROM cmx_material_bodega cmb, cmx_embalaje ce
                        WHERE cmb.id = ce.id_material_bodega 
                        AND cmb.id_ingreso = ci.id 
                        AND ce.grupo > 0 
                        AND (
                        (ce.sub_estado =5 
                        AND (ce.estado = 1 OR ce.estado = 2 OR ce.estado = 3))
                        OR (ce.sub_estado =3 AND ce.estado = 1)
                        OR (ce.sub_estado =6 AND ce.estado = 1)
                        OR (ce.sub_estado =7 AND ce.estado = 1)
                        OR (ce.sub_estado =8 AND ce.estado = 1)
                        OR (ce.sub_estado =10 AND ce.estado = 1)
                        )
                        ) AS 'esc'
                        FROM cmx_ingresos ci
                        WHERE ci.estado <= 3 
                        AND ci.id_bodega_destino = $id_bodega 
                        ORDER BY ci.estado,ci.id ";
        $consulta = $conexion->prepare($sql);
        $consulta->execute();
        $total         = $consulta->rowCount();
        $this->mensaje = $total;
        if ($total == 0) {
            $this->respuesta = "BAD";
        } else {
            $this->respuesta = "GOOD";
            while ($datos_ingresos = $consulta->fetch()) {
                if ($datos_ingresos["estado"] == '3'){
                    $sql      = "    SELECT *, TIMESTAMPDIFF(MINUTE, fecha_hora, NOW()) AS 'min_transcurridos'
                                 FROM cmx_log_material_bodega 
                                 WHERE id_ingreso = ".$datos_ingresos["id"]." 
                                 AND tipo_movimiento IN ('Finalizar Entrada') 
                                 ORDER BY id DESC 
                                 LIMIT 1";
                    $consulta_log = $conexion->prepare($sql);
                    $consulta_log->execute();
                    $datos_log = $consulta_log->fetch();
                    $datos_ingresos["fecha_hora"]= $datos_log["fecha_hora"];
                    $datos_ingresos["tipo_movimiento"]= $datos_log["tipo_movimiento"];
                    $datos_ingresos["min_transcurridos"]= $datos_log["min_transcurridos"];
                    if ($datos_log["min_transcurridos"] < 10080){
                        $this->listado[] = $datos_ingresos;    
                    }
                }
                else {
                    $this->listado[] = $datos_ingresos;
                }
            }
        }
    }
    public function ObtenerembalajeAlmacen($id_bodega)
    {
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "   SELECT ci.*, (SELECT COUNT(ce.id) 
                        FROM cmx_material_bodega cmb, 
                         cmx_embalaje ce
                        WHERE cmb.id = ce.id_material_bodega 
                        AND cmb.id_ingreso = ci.id 
                        AND ce.grupo > 0 ) AS 'tot',
                        (SELECT COUNT(ce.id) 
                        FROM cmx_material_bodega cmb, cmx_embalaje ce
                        WHERE cmb.id = ce.id_material_bodega 
                        AND cmb.id_ingreso = ci.id 
                        AND ce.grupo > 0 
                        AND (
                        (ce.sub_estado =5 
                        AND (ce.estado = 1 OR ce.estado = 2 OR ce.estado = 3))
                        OR (ce.sub_estado =6 AND ce.estado = 1)
                        OR (ce.sub_estado =7 AND ce.estado = 1)
                        OR (ce.sub_estado =8 AND ce.estado = 1)
                        OR (ce.sub_estado =10 AND ce.estado = 1)
                        )) AS 'esc'
                        FROM cmx_ingresos ci
                        WHERE ci.estado <= 20 
                        AND ci.id_bodega_destino = $id_bodega 
                        ORDER BY ci.estado, ci.id  ";
        $consulta = $conexion->prepare($sql);
        $consulta->execute();
        $total         = $consulta->rowCount();
        $this->mensaje = $total;
        if ($total == 0) {
            $this->respuesta = "BAD";
        } else {
            $this->respuesta = "GOOD";
            while ($datos_almacen = $consulta->fetch()) {
                if ($datos_almacen["estado"] == '5'){
                    $sql      = "    SELECT *, TIMESTAMPDIFF(MINUTE, fecha_hora, NOW()) AS 'min_transcurridos'
                                 FROM cmx_log_material_bodega 
                                 WHERE id_ingreso = ".$datos_almacen["id"]." 
                                 AND tipo_movimiento IN ('Finalizar Almacenamiento') 
                                 ORDER BY id DESC 
                                 LIMIT 1";
                    $consulta_log = $conexion->prepare($sql);
                    $consulta_log->execute();
                    $datos_log = $consulta_log->fetch();
                    $datos_almacen["fecha_hora"]= $datos_log["fecha_hora"];
                    $datos_almacen["tipo_movimiento"]= $datos_log["tipo_movimiento"];
                    $datos_almacen["min_transcurridos"]= $datos_log["min_transcurridos"];
                    if ($datos_log["min_transcurridos"] < 10080){
                        $this->listado[] = $datos_almacen;    
                    }
                }
                else {
                    $this->listado[] = $datos_almacen;
                }
            }
        }
    }
    public function ObtenerlistadoSalidas($id_bodega)
    {
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "   SELECT cs.*, (SELECT COUNT(ce.id) 
                        FROM cmx_material_bodega_salida cmbs, 
                         cmx_embalaje ce
                        WHERE cmbs.id = ce.id_material_bodega_salida 
                        AND cmbs.id_salida = cs.id 
                        AND ce.grupo > 0 ) +
                        (SELECT COUNT(ce.id) 
                        FROM cmx_material_bodega_salida cmbs, 
                         cmx_embalaje ce, cmx_embalaje cel
                        WHERE cmbs.id = ce.id_material_bodega_salida 
                        AND cmbs.id_salida = cs.id 
                        AND  ce.grupo =0 AND cel.id = ce.id_embalaje AND cel.sub_estado = 5 AND cel.estado = 2 ) AS 'tot',
                        ((SELECT COUNT(ce.id) 
                        FROM cmx_material_bodega_salida cmbs, cmx_embalaje ce
                        WHERE cmbs.id = ce.id_material_bodega_salida
                        AND cmbs.id_salida = cs.id 
                        AND ce.grupo > 0 
                        AND ce.sub_estado = 7 
                        AND ce.estado = 1)+(SELECT COUNT(ce.id) 
                        FROM cmx_material_bodega_salida cmbs, cmx_embalaje ce,cmx_embalaje cel
                        WHERE cmbs.id = ce.id_material_bodega_salida
                        AND cmbs.id_salida = cs.id 
                        AND  ce.grupo =0 AND cel.id = ce.id_embalaje AND ((cel.sub_estado = 5 AND cel.estado = 2 ) 
                        and ( ce.sub_estado = 7 
                        AND ce.estado = 1)))) AS 'esc'
                        FROM cmx_salidas cs
                        WHERE cs.estado <= 3 
                        AND cs.id_bodega = 2
                        ORDER BY cs.estado, cs.id  ";
        $consulta = $conexion->prepare($sql);
        $consulta->execute();
        $total         = $consulta->rowCount();
        $this->mensaje = $total;
        if ($total == 0) {
            $this->respuesta = "BAD";
        } else {
            $this->respuesta = "GOOD";
            while ($datos_alistamiento = $consulta->fetch()) {
                if ($datos_alistamiento["estado"] == '3'){
                    $sql      = "    SELECT *, TIMESTAMPDIFF(MINUTE, fecha_hora, NOW()) AS 'min_transcurridos'
                                 FROM cmx_log_material_bodega 
                                 WHERE id_ingreso = ".$datos_alistamiento["id"]." 
                                 AND tipo_movimiento IN ('Finalizar Alistamiento') 
                                 ORDER BY id DESC 
                                 LIMIT 1";
                    $consulta_log = $conexion->prepare($sql);
                    $consulta_log->execute();
                    $datos_log = $consulta_log->fetch();
                    $datos_alistamiento["fecha_hora"]= $datos_log["fecha_hora"];
                    $datos_alistamiento["tipo_movimiento"]= $datos_log["tipo_movimiento"];
                    $datos_alistamiento["min_transcurridos"]= $datos_log["min_transcurridos"];
                    if ($datos_log["min_transcurridos"] < 10080){
                        $this->listado[] = $datos_alistamiento;    
                    }
                }
                else {
                    $this->listado[] = $datos_alistamiento;
                }
            }
        }
    }
    public function ObtenerSalidasCargue($id_bodega)
    {
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "   SELECT cs.*, (SELECT COUNT(ce.id) 
                        FROM cmx_material_bodega_salida cmbs, 
                         cmx_embalaje ce
                        WHERE cmbs.id = ce.id_material_bodega_salida 
                        AND cmbs.id_salida = cs.id 
                        AND ce.grupo > 0 ) +
                        (SELECT COUNT(ce.id) 
                        FROM cmx_material_bodega_salida cmbs, 
                         cmx_embalaje ce, cmx_embalaje cel
                        WHERE cmbs.id = ce.id_material_bodega_salida 
                        AND cmbs.id_salida = cs.id 
                        AND  ce.grupo =0 AND cel.id = ce.id_embalaje AND cel.sub_estado = 5 AND cel.estado  IN (2,3) ) AS 'tot',
                        ((SELECT COUNT(ce.id) 
                        FROM cmx_material_bodega_salida cmbs, cmx_embalaje ce
                        WHERE cmbs.id = ce.id_material_bodega_salida
                        AND cmbs.id_salida = cs.id 
                        AND ce.grupo > 0 
                        AND ce.sub_estado = 8 
                        AND ce.estado = 1)+(SELECT COUNT(ce.id) 
                        FROM cmx_material_bodega_salida cmbs, cmx_embalaje ce,cmx_embalaje cel
                        WHERE cmbs.id = ce.id_material_bodega_salida
                        AND cmbs.id_salida = cs.id 
                        AND  ce.grupo =0 AND cel.id = ce.id_embalaje AND cel.sub_estado = 5 AND cel.estado IN (2,3) 
                        AND ce.sub_estado = 8 
                        AND ce.estado = 1)) AS 'esc'
                        FROM cmx_salidas cs
                        WHERE cs.estado > 2 
                        AND NOT(cs.nom_conductor= '')
                        AND cs.id_bodega = $id_bodega 
                        ORDER BY cs.estado, cs.id   ";
        $consulta = $conexion->prepare($sql);
        $consulta->execute();
        $total         = $consulta->rowCount();
        $this->mensaje = $total;
        if ($total == 0) {
            $this->respuesta = "BAD";
        } else {
            $this->respuesta = "GOOD";
            while ($datos_salidas = $consulta->fetch()) {
                if ($datos_salidas["estado"] == '5'){
                    $sql      = "    SELECT *, TIMESTAMPDIFF(MINUTE, fecha_hora, NOW()) AS 'min_transcurridos'
                                 FROM cmx_log_material_bodega 
                                 WHERE id_ingreso = ".$datos_salidas["id"]." 
                                 AND tipo_movimiento IN ('Finalizar Salida') 
                                 ORDER BY id DESC 
                                 LIMIT 1";
                    $consulta_log = $conexion->prepare($sql);
                    $consulta_log->execute();
                    $datos_log = $consulta_log->fetch();
                    $datos_salidas["fecha_hora"]= $datos_log["fecha_hora"];
                    $datos_salidas["tipo_movimiento"]= $datos_log["tipo_movimiento"];
                    $datos_salidas["min_transcurridos"]= $datos_log["min_transcurridos"];
                    if ($datos_log["min_transcurridos"] < 10080){
                        $this->listado[] = $datos_salidas;    
                    }
                }
                else {
                    $this->listado[] = $datos_salidas;
                }
            }
        }
    }
    public function ObtenerListaTraslados($id_bodega)
    {
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "   SELECT ct.id as 'id_traslado', CONCAT(cmb.lote,'-',ce.grupo) as 'lote', cm.codigo, cm.descripcion,
                        (SELECT COUNT(ce.id) FROM    cmx_embalaje ce
                        WHERE ce.id_embalaje = ct.id_embalaje AND ce.sub_estado= 5 AND ce.estado = 1) as 'Existencias',
                        (SELECT COUNT(ce.id) FROM    cmx_embalaje ce
                        WHERE ce.id_embalaje = ct.id_embalaje ) as 'Provenientes',
                        ct.estado, ct.id_ubicacion_destino as 'destino', ce.ubicacion as 'origen',
                                (SELECT CONCAT (cu.linea,'-',cu.columna,'-',cu.nivel) FROM cmx_ubicaciones cu WHERE ce.ubicacion = cu.id ) as 'ternaorigen'
                                ,
                                (SELECT CONCAT (cu.linea,'-',cu.columna,'-',cu.nivel) FROM cmx_ubicaciones cu WHERE ct.id_ubicacion_destino = cu.id ) as 'ternadestino'
                        FROM cmx_traslados ct, cmx_embalaje ce, cmx_material_bodega cmb, cmx_material_cliente cm, cmx_ubicaciones cu
                        WHERE ce.id = ct.id_embalaje 
                        AND cmb.id = ce.id_material_bodega 
                        AND cu.id= ct.id_ubicacion_destino 
                        AND cu.id_bodega = $id_bodega 
                        GROUP BY ct.estado, ct.id
        ";
        $consulta = $conexion->prepare($sql);
        $consulta->execute();
        $total         = $consulta->rowCount();
        $this->mensaje = $total;
        if ($total == 0) {
            $this->respuesta = "BAD";
        } else {
            $this->respuesta = "GOOD";
            while ($datos_traslados = $consulta->fetch()) {
                if ($datos_traslados["estado"] == '2'){
                    $sql      = "SELECT *, TIMESTAMPDIFF(MINUTE, fecha_hora, NOW()) AS 'min_transcurridos'
                                 FROM cmx_log_material_bodega 
                                 WHERE id_traslado= ".$datos_traslados["id_traslado"]." 
                                 AND tipo_movimiento IN ('Solicitud Traslado') 
                                 ORDER BY id DESC 
                                 LIMIT 1";
                $consulta_log = $conexion->prepare($sql);
                $consulta_log->execute();
                $datos_log = $consulta_log->fetch();
                    $datos_traslados["fecha_hora"]= $datos_log["fecha_hora"];
                    $datos_traslados["tipo_movimiento"]= $datos_log["tipo_movimiento"];
                    $datos_traslados["min_transcurridos"]= $datos_log["min_transcurridos"];
                }
               else if ($datos_traslados["estado"] == '3'){
                    $sql      = "    SELECT *, TIMESTAMPDIFF(MINUTE, fecha_hora, NOW()) AS 'min_transcurridos'
                                 FROM cmx_log_material_bodega 
                                 WHERE id_traslado= ".$datos_traslados["id_traslado"]." 
                                 AND tipo_movimiento IN ('Finalizar Traslado') 
                                 ORDER BY id DESC 
                                 LIMIT 1 ";
                    $consulta_log = $conexion->prepare($sql);
                    $consulta_log->execute();
                    $datos_log = $consulta_log->fetch();
                    $datos_traslados["fecha_hora"]= $datos_log["fecha_hora"];
                    $datos_traslados["tipo_movimiento"]= $datos_log["tipo_movimiento"];
                    $datos_traslados["min_transcurridos"]= $datos_log["min_transcurridos"];
                }
                
                 if (($datos_traslados["estado"] == 3 && $datos_traslados["min_transcurridos"] < 10080) || $datos_traslados["estado"] == 2){
                    $this->listado[] = $datos_traslados;
                }
                
            }
        }
    }
    public function ObtenerlistaEstibasAlmacen($id_ingreso)
    {
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "    SELECT ce.id, CONCAT (cmb.lote,'-',ce.grupo) as 'lote', cm.codigo, cm.descripcion,
                        (SELECT COUNT(cem.id) FROM cmx_embalaje cem WHERE cem.id_embalaje = ce.id) as 'cantidad',
                        (SELECT CONCAT (cu.linea,'-',cu.columna,'-',cu.nivel) FROM cmx_ubicaciones cu WHERE ce.ubicacion = cu.id ) as 'ubicacion', ce.sub_estado as 'estado'
                         FROM cmx_embalaje ce, cmx_material_bodega cmb, cmx_material_cliente  cm, cmx_ingresos ci
                        WHERE ce.grupo > 0 AND cmb.id = ce.id_material_bodega
                        AND cm.id = cmb.id_material
                        AND ci.id = cmb.id_ingreso
                        AND ci.id = :id_ingreso
                        GROUP BY ce.id 
                        ORDER BY ce.sub_estado,ce.id ";
        $consulta = $conexion->prepare($sql);
        $consulta->bindParam(':id_ingreso', $id_ingreso, PDO::PARAM_STR);
        $consulta->execute();
        $total         = $consulta->rowCount();
        $this->mensaje = $total;
        if ($total == 0) {
            $this->respuesta = "BAD";
        } else {
            $this->respuesta = "GOOD";
            while ($datos_estibas = $consulta->fetch()) {
                $this->listado[] = $datos_estibas;
            }
        }
    }

    public function ObtenerlistaEstibasEntradas($id_ingreso)
    {
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "    SELECT ce.id, CONCAT (cmb.lote,'-',ce.grupo) as 'lote', cm.codigo, cm.descripcion,
                        (SELECT COUNT(cem.id) FROM cmx_embalaje cem WHERE cem.id_embalaje = ce.id) as 'cantidad',
                        (SELECT CONCAT (cu.linea,'-',cu.columna,'-',cu.nivel) FROM cmx_ubicaciones cu WHERE ce.ubicacion = cu.id ) as 'ubicacion', ce.sub_estado as 'estado'
                         FROM cmx_embalaje ce, cmx_material_bodega cmb,cmx_material_cliente  cm, cmx_ingresos ci
                        WHERE ce.grupo > 0 AND cmb.id = ce.id_material_bodega
                        AND cm.id = cmb.id_material
                        AND ci.id = cmb.id_ingreso
                        AND ci.id = :id_ingreso
                        GROUP BY ce.id 
                        ORDER BY ce.sub_estado,ce.id ";
        $consulta = $conexion->prepare($sql);
        $consulta->bindParam(':id_ingreso', $id_ingreso, PDO::PARAM_STR);
        $consulta->execute();
        $total         = $consulta->rowCount();
        $this->mensaje = $total;
        if ($total == 0) {
            $this->respuesta = "BAD";
        } else {
            $this->respuesta = "GOOD";
            while ($datos_estibas = $consulta->fetch()) {
                $this->listado[] = $datos_estibas;
            }
        }
    }
    public function ObtenerlistaEstibasAlistamiento($id_salida)
    {
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "     SELECT ce.id, CONCAT (cmbs.lote,'-',ce.grupo) as 'lote', cm.codigo, cm.descripcion,
                        (SELECT COUNT(cem.id) FROM cmx_embalaje cem WHERE cem.id_embalaje = ce.id) as 'cantidad',
                        (SELECT CONCAT (cu.linea,'-',cu.columna,'-',cu.nivel) FROM cmx_ubicaciones cu WHERE ce.ubicacion = cu.id ) as 'ubicacion', ce.sub_estado as 'estado'
                         FROM cmx_embalaje ce, cmx_material_bodega_salida cmbs,cmx_material_cliente  cm, cmx_ubicaciones cu,
                         cmx_salidas cs
                        WHERE ce.grupo > 0 AND cmbs.id = ce.id_material_bodega_salida
                        AND cm.id = cmbs.id_material
                        AND cs.id =  cmbs.id_salida
                        AND cs.id = :id_salida
                        UNION
                         (SELECT ce.id, CONCAT (cmbs.lote,'-',(ce.id_embalaje-ce.id)) as 'lote', cm.codigo, cm.descripcion,
                        (SELECT COUNT(cem.id)+1 FROM cmx_embalaje cem WHERE cem.id_embalaje = ce.id) as 'cantidad',
                        (SELECT CONCAT (cu.linea,'-',cu.columna,'-',cu.nivel) FROM cmx_ubicaciones cu WHERE ce.ubicacion = cu.id ) as 'ubicacion', ce.sub_estado as 'estado'
                         FROM cmx_embalaje ce, cmx_material_bodega_salida cmbs,cmx_material_cliente  cm, cmx_ubicaciones cu,
                         cmx_salidas cs
                        WHERE ce.id_embalaje IN ( 
                        SELECT ce1.id 
                        FROM cmx_embalaje ce1 
                        WHERE 
                            ce1.sub_estado = 5 
                            AND ce1.estado IN (2,3) 
                            AND ce1.grupo > 0 )  AND cmbs.id = ce.id_material_bodega_salida
                        AND cm.id = cmbs.id_material
                        AND cs.id =  cmbs.id_salida
                        AND cs.id = :id_salida) ORDER BY estado, id ";
        $consulta = $conexion->prepare($sql);
        $consulta->bindParam(':id_salida', $id_salida, PDO::PARAM_STR);
        $consulta->execute();
        $total         = $consulta->rowCount();
        $this->mensaje = $total;
        if ($total == 0) {
            $this->respuesta = "BAD";
        } else {
            $this->respuesta = "GOOD";
            while ($datos_estibas = $consulta->fetch()) {
                $this->listado[] = $datos_estibas;
            }
        }
    }

    public function ObtenerlistaEstibasSalidas($id_salida)
    {
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "       SELECT ce.id, CONCAT (cmbs.lote,'-',ce.grupo) as 'lote', cm.codigo, cm.descripcion,
                        (SELECT COUNT(cem.id) FROM cmx_embalaje cem WHERE cem.id_embalaje = ce.id) as 'cantidad',
                        (SELECT CONCAT (cu.linea,'-',cu.columna,'-',cu.nivel) FROM cmx_ubicaciones cu WHERE ce.ubicacion = cu.id ) as 'ubicacion', ce.sub_estado as 'estado'
                         FROM cmx_embalaje ce, cmx_material_bodega_salida cmbs,cmx_material_cliente  cm, cmx_ubicaciones cu,
                         cmx_salidas cs
                        WHERE ce.grupo > 0 AND cmbs.id = ce.id_material_bodega_salida
                        AND cm.id = cmbs.id_material
                        AND cs.id =  cmbs.id_salida
                        AND cs.id = :id_salida
                        UNION
                         (SELECT ce.id, CONCAT (cmbs.lote,'-',(SELECT cel.grupo FROM cmx_embalaje cel WHERE cel.id =ce.id_embalaje),'-',(ce.id_embalaje-ce.id)) as 'lote', cm.codigo, cm.descripcion,
                        (SELECT COUNT(cem.id)+1 FROM cmx_embalaje cem WHERE cem.id_embalaje = ce.id) as 'cantidad',
                        (SELECT CONCAT (cu.linea,'-',cu.columna,'-',cu.nivel) FROM cmx_ubicaciones cu WHERE ce.ubicacion = cu.id ) as 'ubicacion', ce.sub_estado as 'estado'
                         FROM cmx_embalaje ce, cmx_material_bodega_salida cmbs,cmx_material_cliente  cm, cmx_ubicaciones cu,
                         cmx_salidas cs
                        WHERE ce.id_embalaje IN ( 
                        SELECT ce1.id 
                        FROM cmx_embalaje ce1 
                        WHERE 
                            ce1.sub_estado = 5 
                            AND ce1.estado IN (2,3) 
                            AND ce1.grupo > 0 )  AND cmbs.id = ce.id_material_bodega_salida
                        AND cm.id = cmbs.id_material
                        AND cs.id =  cmbs.id_salida
                        AND cs.id = :id_salida) ORDER BY estado, id ";
        $consulta = $conexion->prepare($sql);
        $consulta->bindParam(':id_salida', $id_salida, PDO::PARAM_STR);
        $consulta->execute();
        $total         = $consulta->rowCount();
        $this->mensaje = $total;
        if ($total == 0) {
            $this->respuesta = "BAD";
        } else {
            $this->respuesta = "GOOD";
            while ($datos_estibas = $consulta->fetch()) {
                $this->listado[] = $datos_estibas;
            }
        }
    }

    public function Obtenerubicaciones($id_bodega)
    {
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "  SELECT 
                            cu.id as 'id_ubicacion',
                            CONCAT(cu.linea,'-',cu.columna,'-',cu.nivel) UBICACION, 
                            cmc.codigo, cmc.descripcion,
                            (cmc.unidades_x_tendido* cmc.planchas_x_estiba) as 'cantidad_grupo',cu.linea,cu.columna,cu.nivel
                        FROM 
                            cmx_material_cliente cmc
                            INNER JOIN cmx_material_bodega cmb ON cmc.id = cmb.id_material
                            INNER JOIN cmx_ingresos ci ON ci.id = cmb.id_ingreso
                            INNER JOIN cmx_embalaje ce ON ce.id_material_bodega = cmb.id
                            INNER JOIN cmx_ubicaciones cu ON cu.id = ce.ubicacion
                        WHERE 
                            ce.grupo > 0
                            AND cu.id_bodega = $id_bodega 
                            group BY cu.id
                            ORDER BY cu.linea, cu.columna, cu.nivel  ";
        $consulta = $conexion->prepare($sql);
        $consulta->execute();
        $total         = $consulta->rowCount();
        $this->mensaje = $total;
        if ($total == 0) {
            $this->respuesta = "BAD";
        } else {
            $this->respuesta = "GOOD";
            while ($datos_ubicacion = $consulta->fetch()) {
                $sql      = "SELECT 
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
                                AND cu.id_bodega = $id_bodega AND cu.id = ".$datos_ubicacion["id_ubicacion"];
                $consulta_embalaje = $conexion->prepare($sql);
                $consulta_embalaje->execute();
                $datos_ubicacion["Existencias"] = 0;
                $datos_ubicacion["num_estibas"] = $consulta_embalaje->rowCount();
                while ($datos_embalaje = $consulta_embalaje->fetch()) {
                    $datos_ubicacion["Existencias"] = $datos_ubicacion["Existencias"] + $datos_embalaje["DISPONIBLES"];
                }
                $this->listado[] = $datos_ubicacion;
            }
        }
    }
    public function obtenerbodegas()
    {
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "   SELECT * FROM cmx_remitente_destinatario WHERE id_cliente = 1 AND id != 1 ";
        $consulta = $conexion->prepare($sql);
        $consulta->execute();
        $total         = $consulta->rowCount();
        $this->mensaje = $total;
        if ($total == 0) {
            $this->respuesta = "BAD";
        } else {
            $this->respuesta = "GOOD";
            while ($datos_bodegas = $consulta->fetch()) {
                    $this->listado[] = $datos_bodegas;
            }
        }
    }
    public function verificarubicacion($qr_posicion,$id_bodega)
    {
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "  SELECT 
                            cu.id as 'id_ubicacion',
                            CONCAT(cu.linea,'-',cu.columna,'-',cu.nivel) UBICACION, 
                            cmc.codigo, cmc.descripcion,
                            (cmc.unidades_x_tendido* cmc.planchas_x_estiba) as 'cantidad_grupo',cu.linea,cu.columna,cu.nivel
                        FROM 
                            cmx_material_cliente cmc
                            INNER JOIN cmx_material_bodega cmb ON cmc.id = cmb.id_material
                            INNER JOIN cmx_ingresos ci ON ci.id = cmb.id_ingreso
                            INNER JOIN cmx_embalaje ce ON ce.id_material_bodega = cmb.id
                            INNER JOIN cmx_ubicaciones cu ON cu.id = ce.ubicacion
                        WHERE 
                            ce.grupo > 0
                            AND cu.id_bodega = $id_bodega AND cu.qr_posicion = :qr_posicion
                            GROUP BY cu.id ";
        $consulta = $conexion->prepare($sql);
        $qr_posici= $qr_posicion.".png";

        $consulta->bindParam(':qr_posicion', $qr_posici , PDO::PARAM_STR);
        $consulta->execute();
        $total         = $consulta->rowCount();
        $this->mensaje = $total;
        if ($total == 0) {
            $this->respuesta = "BAD";
        } else {
            $this->respuesta = "GOOD";
            while ($datos_ubicacion = $consulta->fetch()) {
                $sql      = "SELECT 
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
                                AND cu.id_bodega = $id_bodega AND cu.id = ".$datos_ubicacion["id_ubicacion"];
                $consulta_embalaje = $conexion->prepare($sql);
                $consulta_embalaje->execute();
                $datos_ubicacion["Existencias"] = 0;
                $datos_ubicacion["num_estibas"] = $consulta_embalaje->rowCount();
                while ($datos_embalaje = $consulta_embalaje->fetch()) {
                    $datos_ubicacion["Existencias"] = $datos_ubicacion["Existencias"] + $datos_embalaje["DISPONIBLES"];
                }
                $this->listado[] = $datos_ubicacion;
            }
        }
    }
    public function liberarubicacion($qr_posicion,$id_usuario,$id_bodega)
    {
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "   SELECT 
                            *
                        FROM cmx_ubicaciones   
                        WHERE 
                            qr_posicion = :qr_posicion 
                        AND id_bodega = $id_bodega ";
        $consulta = $conexion->prepare($sql);
        $qr_posici= $qr_posicion.".png";
        $consulta->bindParam(':qr_posicion', $qr_posici, PDO::PARAM_STR);
        $consulta->execute();
        $total         = $consulta->rowCount();
        $this->mensaje = $total;
        if ($total == 0) {
            $this->respuesta = "BAD";
        } else {
            $datos_ubicacion= $consulta->fetch();
           
            $sql      = "SELECT ce.id as 'embalaje',ce.*
                            FROM 
                                cmx_embalaje ce 
                                INNER JOIN cmx_ubicaciones cu ON cu.id = ce.ubicacion
                            WHERE 
                                ce.grupo > 0
                                AND cu.id_bodega = $id_bodega AND cu.id = ".$datos_ubicacion["id"]." ";
                $consulta_embalaje = $conexion->prepare($sql);
                $consulta_embalaje->execute();
                if ($consulta_embalaje->rowCount()>0){
                while ($datos_embalaje = $consulta_embalaje->fetch()) {
                     $sql = "UPDATE cmx_embalaje 
                             SET sub_estado = 10, estado = 1, ubicacion = NULL 
                             WHERE ubicacion = :id_ubicacion AND (id = :id_embalaje OR id_embalaje = :id_embalaje) 
                             AND id_material_bodega = :id_material_bodega "; 
                              $actualizar_embalaje = $conexion->prepare($sql);
                    $actualizar_embalaje->bindParam(':id_ubicacion', $datos_ubicacion["id"], PDO::PARAM_STR);
                    $actualizar_embalaje->bindParam(':id_embalaje', $datos_embalaje["embalaje"], PDO::PARAM_STR);
                    $actualizar_embalaje->bindParam(':id_material_bodega', $datos_embalaje["id_material_bodega"], PDO::PARAM_STR);
                    $actualizar_embalaje->execute();

                    $sql = "INSERT INTO cmx_log_material_bodega (id_usuario, qr_leido, tipo_movimiento, fecha_hora, id_ubicacion) VALUES ('".$id_usuario."','". $datos_embalaje["url_qr"]."','Solicitud Liberacion', NOW(), '" . $datos_ubicacion["id"]. "') "; 
                    $ins_log_material = $conexion->prepare($sql);
                    $ins_log_material->execute();
                }
            }
               $sql                 ="UPDATE cmx_ubicaciones
                                   SET estado = 1
                                   WHERE id= :id_ubicacion AND id_bodega = $id_bodega ";
            $actua_ubic = $conexion->prepare($sql);
            $actua_ubic->bindParam(':id_ubicacion', $datos_ubicacion["id"], PDO::PARAM_STR);
            $actua_ubic->execute();
                $this->respuesta = "GOOD";


        }
    }
    public function Obtenerlistaestibasubicaciones($id_ubicacion, $id_bodega)
    {
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "  SELECT ce.id,CONCAT(cmb.lote,'-',ce.grupo) AS 'lote',ce.cantidad_grupo,
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
                        AND cu.id_bodega = $id_bodega 
                        AND cu.id = :id_ubicacion ";
        $consulta = $conexion->prepare($sql);
        $consulta->bindParam(':id_ubicacion', $id_ubicacion, PDO::PARAM_STR);
        $consulta->execute();
        $total         = $consulta->rowCount();
        $this->mensaje = $total;
        if ($total == 0) {
            $this->respuesta = "BAD";
        } else {
            $this->respuesta = "GOOD";
                while ($datos_estibas = $consulta->fetch()) {
                    $this->listado[] = $datos_estibas;
                }
            }
    }
    //Metodo para verificar apk Ingresos
    public function verificarembalajepedidos($id_ingreso, $qrtext,$id_usuario,$id_bodega)
    {
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "SELECT *
                    FROM cmx_ingresos
                    WHERE id =:id 
                    AND estado = 1 AND id_bodega_destino = $id_bodega ";
        $consulta_ingresos = $conexion->prepare($sql);
        $consulta_ingresos->bindParam(':id', $id_ingreso, PDO::PARAM_STR);
        $consulta_ingresos->execute();
        $datos_ingresos= $consulta_ingresos->fetch();
        $total = $consulta_ingresos->rowCount();
        if ($total == 0) {
            $this->respuesta = "BAD";
        } else {
            $this->respuesta = "GOOD";
            $sql             = "SELECT *
                                FROM cmx_material_bodega
                                WHERE id_ingreso = :id_ingreso ";
            $consulta_material_bodega = $conexion->prepare($sql);
            $consulta_material_bodega->bindParam(':id_ingreso', $id_ingreso, PDO::PARAM_STR);
            $consulta_material_bodega->execute();
            $total_material_bodega = $consulta_material_bodega->rowCount();
            $this->mensaje         = $total_material_bodega;
            if ($total_material_bodega == 0) {
                $sql = "UPDATE cmx_ingresos
                        SET estado = 2
                        WHERE id =:id AND id_bodega_destino = $id_bodega";
                $actualizar_pedido = $conexion->prepare($sql);
                $actualizar_pedido->bindParam(':id', $id_ingreso, PDO::PARAM_STR);
                $actualizar_pedido->execute();
                $this->respuesta = "BAD";
            } else {
                $bandera        = 0;
                $datos_embalaje = [];
                while ($datos_material_bodega = $consulta_material_bodega->fetch()) {
                    $this->respuesta = $datos_material_bodega["id"];
                    $sql             = "SELECT *
                                        FROM cmx_embalaje
                                        WHERE id_material_bodega = :id_material_bodega
                                        AND url_qr = :url_qr ";
                    $consulta_embalaje = $conexion->prepare($sql);
                    $url_qr            = $qrtext . ".png";
                    $consulta_embalaje->bindParam(':id_material_bodega', $datos_material_bodega["id"], PDO::PARAM_STR);
                    $consulta_embalaje->bindParam(':url_qr', $url_qr, PDO::PARAM_STR);
                    $consulta_embalaje->execute();
                    $total_embalaje = $consulta_embalaje->rowCount();
                    if ($total_embalaje > 0) {
                        $bandera        = 1;
                        $datos_embalaje = $consulta_embalaje->fetch();
                    }
                }
                $this->respuesta = "BAD";
                if ($bandera == 1) {
                    $this->respuesta = "GOOD";
                    if ($datos_embalaje["estado"] == "2" && $datos_embalaje["sub_estado"] == "2" ) {
                        if ($datos_embalaje["grupo"] > 0  && $datos_embalaje["cantidad_grupo"] > 0){
                            // $sql = "SELECT (cmc.unidades_x_tendido * cmc.planchas_x_estiba) AS 'total_estiba',ce.cantidad_grupo,ce.id 
                            //         FROM cmx_material_cliente cmc, cmx_material_bodega cmb, cmx_embalaje ce
                            //         WHERE  ce.grupo > 0
                            //         AND ce.id_material_bodega = cmb.id 
                            //         AND cmb.id_material = cmc.id
                            //         AND ce.id = :id_embalaje
                            //         ORDER BY ce.id ASC ";
                            // $cons_cant_estibas = $conexion->prepare($sql);
                            // $cons_cant_estibas->bindParam(':id_embalaje', $datos_embalaje["id"], PDO::PARAM_STR);
                            // $cons_cant_estibas ->execute();
                            // $cant_estib_mate = $cons_cant_estibas->fetch();
                            // $tipo_ubic = "";
                            // if($cant_estib_mate["cantidad_grupo"] < $cant_estib_mate["total_estiba"]){
                            //     $tipo_ubic= "Saldos";
                            // }
                            // else{
                            //     $tipo_ubic= "FULL";
                            // }
                            // $sql ="     SELECT min(id) as 'id'
                            //             FROM cmx_ubicaciones 
                            //             WHERE tipo_ubicacion = '"
                            //             .$tipo_ubic."'
                            //             AND estado = 1 
                            //             AND id_bodega = :id_bodega ";
                            // $cons_ubic_nueva = $conexion->prepare($sql);
                            // $cons_ubic_nueva->bindParam(':id_bodega', $datos_ingresos["id_bodega_destino"], PDO::PARAM_STR);
                            // $cons_ubic_nueva->execute();
                            // $ubic_estiba =$cons_ubic_nueva->fetch();
                            // $sql ="     UPDATE cmx_ubicaciones 
                            //             SET estado = 2 
                            //             WHERE id = :id 
                            //             AND estado = 1 ";
                            // $update_ubic_nueva = $conexion->prepare($sql);
                            // $update_ubic_nueva->bindParam(':id', $ubic_estiba["id"], PDO::PARAM_STR);
                            // $update_ubic_nueva->execute();
                            $sql                 ="UPDATE cmx_embalaje
                                                   SET estado = 1 , sub_estado = 3
                                                   WHERE id_material_bodega =:id_material_bodega
                                                   AND url_qr =:url_qr 
                                                   AND id= :id ";
                            $actualizar_embalaje = $conexion->prepare($sql);
                            $actualizar_embalaje->bindParam(':id_material_bodega', $datos_embalaje["id_material_bodega"], PDO::PARAM_STR);
                            $url_qr = $qrtext . ".png";
                            $actualizar_embalaje->bindParam(':url_qr', $url_qr, PDO::PARAM_STR);
                            //$actualizar_embalaje->bindParam(':ubicacion', $ubic_estiba["id"], PDO::PARAM_STR);
                            $actualizar_embalaje->bindParam(':id', $datos_embalaje["id"], PDO::PARAM_STR);
                            $actualizar_embalaje->execute();
                            $sql = "INSERT INTO cmx_log_material_bodega (id_ingreso, id_usuario, qr_leido, tipo_movimiento, fecha_hora) VALUES (".$id_ingreso.",'".$id_usuario."','". $datos_embalaje["url_qr"]."','Ingreso',NOW()) "; 
                            $ins_log_material = $conexion->prepare($sql);
                            $ins_log_material->execute();
                            $sql             = "SELECT *
                                                FROM cmx_embalaje
                                                WHERE id_embalaje = :id_embalaje
                                                AND id_material_bodega = :id_material_bodega ";
                            $cons_emba_estib = $conexion->prepare($sql);
                            $cons_emba_estib->bindParam(':id_material_bodega', $datos_embalaje["id_material_bodega"] , PDO::PARAM_STR);
                            $cons_emba_estib->bindParam(':id_embalaje', $datos_embalaje["id"] , PDO::PARAM_STR);
                            $cons_emba_estib->execute();
                            $total_emba_estibas = $cons_emba_estib->rowCount();
                            if ($total_emba_estibas > 0) {
                            
                                //while ($datos_emba_estib = $cons_emba_estib->fetch()) {
                                    $sql             = "UPDATE cmx_embalaje
                                                       SET estado = 1, sub_estado = 3
                                                       WHERE id_material_bodega =:id_material_bodega
                                                       AND id_embalaje = :id_embalaje ";
                                    $act_emba_estib = $conexion->prepare($sql);
                                    $act_emba_estib->bindParam(':id_material_bodega', $datos_embalaje["id_material_bodega"], PDO::PARAM_STR);
                                    //$act_emba_estib->bindParam(':ubicacion', $ubic_estiba["id"], PDO::PARAM_STR);
                                    $act_emba_estib->bindParam(':id_embalaje', $datos_embalaje["id"] , PDO::PARAM_STR);
                                    $act_emba_estib->execute();
                                //}
                            }
                            $this->mensaje = "GOOD";
                            $this->terminarescaneo($id_ingreso,$id_usuario,$id_bodega); 
                            if ($this->pass == "GOOD"){
                                $this->mensaje = "FINISH";
                            } 
                        }
                        else if($datos_embalaje["grupo"] == 0){
                            $sql                 ="UPDATE cmx_embalaje
                                                   SET estado = 1, sub_estado = 3
                                                   WHERE id_material_bodega =:id_material_bodega
                                                   AND url_qr =:url_qr
                                                   AND id= :id ";
                            $actualizar_embalaje = $conexion->prepare($sql);
                            $actualizar_embalaje->bindParam(':id_material_bodega', $datos_embalaje["id_material_bodega"], PDO::PARAM_STR);
                            $url_qr = $qrtext . ".png";
                            $actualizar_embalaje->bindParam(':url_qr', $url_qr, PDO::PARAM_STR);
                            $actualizar_embalaje->bindParam(':id', $datos_embalaje["id"], PDO::PARAM_STR);
                            $actualizar_embalaje->execute();
                            $this->mensaje = "GOOD";
                            $sql = "INSERT INTO cmx_log_material_bodega (id_ingreso, id_usuario, qr_leido, tipo_movimiento, fecha_hora) VALUES (".$id_ingreso.",'".$id_usuario."','". $datos_embalaje["url_qr"]."','Ingreso',NOW()) "; 
                            $ins_log_material = $conexion->prepare($sql);
                            $ins_log_material->execute();
                            $this->mensaje = "GOOD";
                            $this->terminarescaneo($id_ingreso,$id_usuario,$id_bodega); 
                            if ($this->pass == "GOOD"){
                                $this->mensaje = "FINISH";
                            } 
                        }

                       /* else if($datos_embalaje["grupo"] > 0 && $datos_embalaje["cantidad_grupo"] == 1){
                            $sql                 ="UPDATE cmx_embalaje
                                                   SET estado = 1, sub_estado = 3 
                                                   WHERE id_material_bodega =:id_material_bodega 
                                                   AND url_qr =:url_qr 
                                                   AND id= :id ";
                            $actualizar_embalaje = $conexion->prepare($sql);
                            $actualizar_embalaje->bindParam(':id_material_bodega', $datos_embalaje["id_material_bodega"], PDO::PARAM_STR);
                            $url_qr = $qrtext . ".png";
                            $actualizar_embalaje->bindParam(':url_qr', $url_qr, PDO::PARAM_STR);
                            $actualizar_embalaje->bindParam(':id', $datos_embalaje["id"], PDO::PARAM_STR);
                            $actualizar_embalaje->execute();
                            $this->mensaje = "GOOD";
                            $sql = "INSERT INTO cmx_log_material_bodega (id_ingreso, id_usuario, qr_leido, tipo_movimiento, fecha_hora) VALUES (".$id_ingreso.",'".$id_usuario."','". $datos_embalaje["url_qr"]."','Ingreso',NOW()) "; 
                            $ins_log_material = $conexion->prepare($sql);
                            $ins_log_material->execute();
                            $this->mensaje = "GOOD";
                            $this->terminarescaneo($id_ingreso,$id_usuario,$id_bodega); 
                            if ($this->pass == "GOOD"){
                                $this->mensaje = "FINISH";
                            } 
                        }*/
                        
                    } else if ( $datos_embalaje["estado"] == "1" && $datos_embalaje["sub_estado"] == "3") {
                        $this->mensaje = "BAD";
                        $this->terminarescaneo($id_ingreso,$id_usuario,$id_bodega); 
                        if ($this->pass == "GOOD"){
                            $this->mensaje = "FINISH";
                        } 
                    } else if ( $datos_embalaje["estado"] == "1" && $datos_embalaje["sub_estado"] == "5") {
                        $this->mensaje = "ALM";
                        $this->terminarescaneo($id_ingreso,$id_usuario,$id_bodega); 
                        if ($this->pass == "GOOD"){
                            $this->mensaje = "FINISH";
                        } 
                    }

                } else {
                    $sql               = " UPDATE cmx_ingresos SET estado = 0 WHERE id = '" . $id_ingreso . "' AND id_bodega_destino = $id_bodega ";
                    $actualizar_pedido = $conexion->prepare($sql);
                    $actualizar_pedido->execute();
                    $qr_leido=$qrtext.".png";
                    $sql = "INSERT INTO cmx_log_material_bodega (id_ingreso, id_usuario, qr_leido, tipo_movimiento, fecha_hora) VALUES (".$id_ingreso.",'".$id_usuario."','". $qr_leido."','Bloqueo',NOW()) "; 
                    $ins_log_material = $conexion->prepare($sql);
                    $ins_log_material->execute();
                    $this->respuesta = "GOOD";
                    $this->mensaje = "NOT";
                }
            }
        }
    }
    //Metodo para verificar apk Ingresos para Almacenar
    public function verificarembalaje($id_ingreso, $qrtext,$id_usuario,$id_bodega)
    {
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "SELECT *
                    FROM cmx_ingresos
                    WHERE id =:id 
                    AND estado IN (1,3)
                    AND id_bodega_destino = $id_bodega ";
        $consulta_ingresos = $conexion->prepare($sql);
        $consulta_ingresos->bindParam(':id', $id_ingreso, PDO::PARAM_STR);
        $consulta_ingresos->execute();
        $total = $consulta_ingresos->rowCount();
        if ($total == 0) {
            $this->respuesta = "BAD";
        } else {
            $this->respuesta = "GOOD";
            $sql             = "SELECT *
                                FROM cmx_material_bodega
                                WHERE id_ingreso = :id_ingreso ";
            $consulta_material_bodega = $conexion->prepare($sql);
            $consulta_material_bodega->bindParam(':id_ingreso', $id_ingreso, PDO::PARAM_STR);
            $consulta_material_bodega->execute();
            $total_material_bodega = $consulta_material_bodega->rowCount();
            $this->mensaje         = $total_material_bodega;
            if ($total_material_bodega == 0) {
                /*$sql = "UPDATE cmx_ingresos
                        SET estado = 4
                        WHERE id =:id ";
                $actualizar_pedido = $conexion->prepare($sql);
                $actualizar_pedido->bindParam(':id', $id_ingreso, PDO::PARAM_STR);
                $actualizar_pedido->execute();*/
                $this->respuesta = "BAD";
            } else {
                $bandera        = 0;
                $datos_embalaje = [];
                while ($datos_material_bodega = $consulta_material_bodega->fetch()) {
                    //$this->respuesta = $datos_material_bodega["id"];
                    $sql             = "SELECT (cmc.unidades_x_tendido * cmc.planchas_x_estiba) AS 'total_estiba', ce.*,cmc.id as 'material'
                                     FROM cmx_material_cliente cmc, cmx_material_bodega cmb, cmx_embalaje ce
                                     WHERE  ce.grupo > 0
                                     AND ce.id_material_bodega = cmb.id 
                                     AND cmb.id_material = cmc.id
                                     AND ce.url_qr = :url_qr
                                     AND ce.id_material_bodega = :id_material_bodega
                                     ORDER BY ce.id ASC ";
                    $consulta_embalaje = $conexion->prepare($sql);
                    $url_qr            = $qrtext . ".png";
                    $consulta_embalaje->bindParam(':id_material_bodega', $datos_material_bodega["id"], PDO::PARAM_STR);
                    $consulta_embalaje->bindParam(':url_qr', $url_qr, PDO::PARAM_STR);
                    $consulta_embalaje->execute();
                    $total_embalaje = $consulta_embalaje->rowCount();
                    if ($total_embalaje > 0) {
                        $bandera        = 1;
                        $datos_embalaje = $consulta_embalaje->fetch();
                    }
                }
                //$this->respuesta = "BAD";
                if ($bandera == 1) {
                    $this->respuesta = "GOOD";
                    if ($datos_embalaje["estado"] == "1" && $datos_embalaje["sub_estado"] == "3") {
                        $this->listado= $datos_embalaje;
                        $this->mensaje = "GOOD";
                    } else if ( $datos_embalaje["estado"] == "1" && $datos_embalaje["sub_estado"] == "5") {
                        $this->mensaje = "BAD";
                        $this->terminaralmacen($id_ingreso,$id_usuario,$id_bodega); 
                        if ($this->pass == "GOOD"){
                            $this->mensaje = "FINISH";
                        } 
                    }
                     else if ( $datos_embalaje["estado"] == "2" && $datos_embalaje["sub_estado"] == "2") {
                        $this->mensaje = "SDESC";
                        $this->terminaralmacen($id_ingreso,$id_usuario,$id_bodega); 
                        if ($this->pass == "GOOD"){
                            $this->mensaje = "FINISH";
                        } 
                    }

                } else {
                    $sql= " SELECT * FROM cmx_ingresos WHERE id = '" . $id_ingreso . "' AND id_bodega_destino = $id_bodega ";
                    $buscaringreso = $conexion->prepare($sql);
                    $buscaringreso->execute();
                    $datos_ingreso= $buscaringreso->fetch();
                    if($datos_ingreso["estado"] == 1){
                        $sql= " UPDATE cmx_ingresos SET estado = 0 WHERE id = '" . $id_ingreso . "'  AND id_bodega_destino = $id_bodega ";
                        $actualizar_pedido = $conexion->prepare($sql);
                        $actualizar_pedido->execute();
                        $qr_leido= $qrtext.".png";
                        $sql = "INSERT INTO cmx_log_material_bodega (id_ingreso, id_usuario, qr_leido, tipo_movimiento, fecha_hora) VALUES (".$id_ingreso.",'".$id_usuario."','". $qr_leido."','Bloqueo',NOW()) "; 
                        $ins_log_material = $conexion->prepare($sql);
                        $ins_log_material->execute();
                    }
                    else if($datos_ingreso["estado"] == 3){
                        $sql= " UPDATE cmx_ingresos SET estado = 4 WHERE id = '" . $id_ingreso . "'  AND id_bodega_destino = $id_bodega ";
                        $actualizar_pedido = $conexion->prepare($sql);
                        $actualizar_pedido->execute();
                        $qr_leido= $qrtext.".png";
                        $sql = "INSERT INTO cmx_log_material_bodega (id_ingreso, id_usuario, qr_leido, tipo_movimiento, fecha_hora) VALUES (".$id_ingreso.",'".$id_usuario."','". $qr_leido."','Bloqueo',NOW()) "; 
                        $ins_log_material = $conexion->prepare($sql);
                        $ins_log_material->execute();
                    }
                    $this->respuesta = "GOOD";
                    $this->mensaje = "NOT";
                }
            }
        }
    } 
    public function completaralmacen($id_ingreso, $qr_posicion,$qr_embalaje,$id_usuario,$id_bodega)
    {
        for ($k=0; $k<count($qr_embalaje);$k++){
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "SELECT *
                    FROM cmx_ingresos
                    WHERE id =:id 
                    AND estado IN(1,3) AND id_bodega_destino = $id_bodega ";
        $consulta_ingresos = $conexion->prepare($sql);
        $consulta_ingresos->bindParam(':id', $id_ingreso, PDO::PARAM_STR);
        $consulta_ingresos->execute();
        $total = $consulta_ingresos->rowCount();
        if ($total == 0) {
            $this->respuesta = "BAD";
        } else {
            $this->respuesta = "GOOD";
            $sql             = "SELECT *
                                FROM cmx_material_bodega
                                WHERE id_ingreso = :id_ingreso ";
            $consulta_material_bodega = $conexion->prepare($sql);
            $consulta_material_bodega->bindParam(':id_ingreso', $id_ingreso, PDO::PARAM_STR);
            $consulta_material_bodega->execute();
            $total_material_bodega = $consulta_material_bodega->rowCount();
            $this->mensaje         = $total_material_bodega;
            if ($total_material_bodega == 0) {
                $sql = "UPDATE cmx_ingresos
                        SET estado = 4
                        WHERE id =:id  AND id_bodega_destino = $id_bodega ";
                $actualizar_pedido = $conexion->prepare($sql);
                $actualizar_pedido->bindParam(':id', $id_ingreso, PDO::PARAM_STR);
                $actualizar_pedido->execute();
                $this->respuesta = "BAD";
            } else {
                $bandera        = 0;
                $datos_embalaje = [];
                while ($datos_material_bodega = $consulta_material_bodega->fetch()) {
                    $this->respuesta = $datos_material_bodega["id"];
                    $sql             = "SELECT *
                                        FROM cmx_embalaje
                                        WHERE id_material_bodega = :id_material_bodega
                                        AND url_qr = :url_qr ";
                    $consulta_embalaje = $conexion->prepare($sql);
                    $url_qr            = $qr_embalaje[$k] . ".png";
                    $consulta_embalaje->bindParam(':id_material_bodega', $datos_material_bodega["id"], PDO::PARAM_STR);
                    $consulta_embalaje->bindParam(':url_qr', $url_qr, PDO::PARAM_STR);
                    $consulta_embalaje->execute();
                    $total_embalaje = $consulta_embalaje->rowCount();
                    if ($total_embalaje > 0) {
                        $bandera        = 1;
                        $datos_embalaje = $consulta_embalaje->fetch();
                    }
                }
                $this->respuesta = "BAD";
                if ($bandera == 1) {
                    $this->respuesta = "GOOD";
                    if ($datos_embalaje["estado"] == "1" && $datos_embalaje["sub_estado"] == "3") {
                        $this->listado= $datos_embalaje;
                        $this->mensaje = "GOOD";
                        if ($datos_embalaje["grupo"] > 0  && $datos_embalaje["cantidad_grupo"] > 0){
                            $sql                 ="UPDATE cmx_embalaje
                                                   SET estado = 1, sub_estado = 5, ubicacion = :ubicacion 
                                                   WHERE id_material_bodega =:id_material_bodega
                                                   AND url_qr =:url_qr 
                                                   AND id= :id ";
                            $actualizar_embalaje = $conexion->prepare($sql);
                            $actualizar_embalaje->bindParam(':id_material_bodega', $datos_embalaje["id_material_bodega"], PDO::PARAM_STR);
                            $url_qr = $qr_embalaje[$k] . ".png";
                            $actualizar_embalaje->bindParam(':url_qr', $url_qr, PDO::PARAM_STR);
                            $actualizar_embalaje->bindParam(':id', $datos_embalaje["id"], PDO::PARAM_STR);
                            $actualizar_embalaje->bindParam(':ubicacion', $qr_posicion, PDO::PARAM_STR);
                            $actualizar_embalaje->execute();
                            $sql = "INSERT INTO cmx_log_material_bodega (id_ingreso, id_usuario, qr_leido, tipo_movimiento, fecha_hora,id_ubicacion) VALUES (".$id_ingreso.",'".$id_usuario."','". $datos_embalaje["url_qr"]."','Almacenado',NOW(),'$qr_posicion') "; 
                            $ins_log_material = $conexion->prepare($sql);
                            $ins_log_material->execute();
                            $sql      = "   UPDATE cmx_ubicaciones
                                            SET estado = 0
                                            WHERE id = :id  AND id_bodega = $id_bodega ";
                            $actuubic = $conexion->prepare($sql);
                            $actuubic->bindParam(':id', $qr_posicion, PDO::PARAM_STR);
                            $actuubic->execute();    
                            $sql             = "SELECT *
                                                FROM cmx_embalaje
                                                WHERE id_embalaje = :id_embalaje
                                                AND id_material_bodega = :id_material_bodega ";
                            $cons_emba_estib = $conexion->prepare($sql);
                            $cons_emba_estib->bindParam(':id_material_bodega', $datos_embalaje["id_material_bodega"] , PDO::PARAM_STR);
                            $cons_emba_estib->bindParam(':id_embalaje', $datos_embalaje["id"] , PDO::PARAM_STR);
                            $cons_emba_estib->execute();
                            $total_emba_estibas = $cons_emba_estib->rowCount();
                            if ($total_emba_estibas > 0) {
                            
                            //while ($datos_emba_estib = $cons_emba_estib->fetch()) {
                                $sql             = "UPDATE cmx_embalaje
                                                   SET estado = 1, sub_estado = 5, ubicacion = :ubicacion 
                                                   WHERE id_material_bodega =:id_material_bodega
                                                   AND id_embalaje= :id_embalaje ";
                                $act_emba_estib = $conexion->prepare($sql);
                                $act_emba_estib->bindParam(':id_material_bodega', $datos_embalaje["id_material_bodega"], PDO::PARAM_STR);
                                $act_emba_estib->bindParam(':id_embalaje',$datos_embalaje["id"] , PDO::PARAM_STR);
                                $act_emba_estib->bindParam(':ubicacion', $qr_posicion, PDO::PARAM_STR);
                                $act_emba_estib->execute();
                            //}
                        }
                            $this->mensaje = "GOOD";
                            $this->terminaralmacen($id_ingreso,$id_usuario,$id_bodega); 
                            if ($this->pass == "GOOD"){
                                $this->mensaje = "FINISH";
                            } 
                        }
                        else if($datos_embalaje["grupo"] == 0){
                            $sql                 ="UPDATE cmx_embalaje
                                                   SET estado = 1, sub_estado = 5, ubicacion = :ubicacion 
                                                   WHERE id_material_bodega =:id_material_bodega
                                                   AND url_qr =:url_qr
                                                   AND id= :id ";
                            $actualizar_embalaje = $conexion->prepare($sql);
                            $actualizar_embalaje->bindParam(':id_material_bodega', $datos_embalaje["id_material_bodega"], PDO::PARAM_STR);
                            $url_qr = $qr_embalaje[$k] . ".png";
                            $actualizar_embalaje->bindParam(':url_qr', $url_qr, PDO::PARAM_STR);
                            $actualizar_embalaje->bindParam(':ubicacion', $qr_posicion, PDO::PARAM_STR);
                            $actualizar_embalaje->bindParam(':id', $datos_embalaje["id"], PDO::PARAM_STR);
                            $actualizar_embalaje->execute();
                            $this->mensaje = "GOOD";
                            $sql = "INSERT INTO cmx_log_material_bodega (id_ingreso, id_usuario, qr_leido, tipo_movimiento, fecha_hora, id_ubicacion) VALUES (".$id_ingreso.",'".$id_usuario."','". $datos_embalaje["url_qr"]."','Almacenado',NOW(),'$qr_posicion') "; 
                            $ins_log_material = $conexion->prepare($sql);
                            $ins_log_material->execute();
                            $this->mensaje = "GOOD";
                            $this->terminaralmacen($id_ingreso,$id_usuario,$id_bodega); 
                            if ($this->pass == "GOOD"){
                                $this->mensaje = "FINISH";
                            } 
                        }
                        /*
                        else if($datos_embalaje["grupo"] > 0 && $datos_embalaje["cantidad_grupo"] == 1){
                            $sql                 ="UPDATE cmx_embalaje
                                                   SET estado = 1, sub_estado = 5, ubicacion = :ubicacion 
                                                   WHERE id_material_bodega =:id_material_bodega 
                                                   AND url_qr =:url_qr 
                                                   AND id= :id ";
                            $actualizar_embalaje = $conexion->prepare($sql);
                            $actualizar_embalaje->bindParam(':id_material_bodega', $datos_embalaje["id_material_bodega"], PDO::PARAM_STR);
                            $actualizar_embalaje->bindParam(':ubicacion', $qr_posicion, PDO::PARAM_STR);
                            $url_qr = $qr_embalaje . ".png";
                            $actualizar_embalaje->bindParam(':url_qr', $url_qr, PDO::PARAM_STR);
                            $actualizar_embalaje->bindParam(':id', $datos_embalaje["id"], PDO::PARAM_STR);
                            $actualizar_embalaje->execute();
                            $this->mensaje = "GOOD";
                            $sql = "INSERT INTO cmx_log_material_bodega (id_ingreso, id_usuario, qr_leido, tipo_movimiento, fecha_hora) VALUES (".$id_ingreso.",'".$id_usuario."','". $datos_embalaje["url_qr"]."','Almacenado',NOW()) "; 
                            $ins_log_material = $conexion->prepare($sql);
                            $ins_log_material->execute();
                            $this->mensaje = "GOOD";
                            $this->terminaralmacen($id_ingreso,$id_usuario,$id_bodega); 
                            if ($this->pass == "GOOD"){
                                $this->mensaje = "FINISH";
                            } 
                        }*/
                    } else if ( $datos_embalaje["estado"] == "1" && $datos_embalaje["sub_estado"] == "5") {
                        $this->mensaje = "BAD";
                        $this->terminaralmacen($id_ingreso,$id_usuario,$id_bodega); 
                        if ($this->pass == "GOOD"){
                            $this->mensaje = "FINISH";
                        } 
                    }

                } else {
                   /* $sql               = " UPDATE cmx_ingresos SET estado = 4 WHERE id = '" . $id_ingreso . "' ";
                    $actualizar_pedido = $conexion->prepare($sql);
                    $actualizar_pedido->execute();
                    $qr_leido=$qrtext.".png";
                    $sql = "INSERT INTO cmx_log_material_bodega (id_ingreso, id_usuario, qr_leido, tipo_movimiento, fecha_hora) VALUES (".$id_ingreso.",'".$id_usuario."','". $qr_leido."','Bloqueo',NOW()) "; 
                    $ins_log_material = $conexion->prepare($sql);
                    $ins_log_material->execute();
                    $this->respuesta = "GOOD";
                    $this->mensaje = "NOT";*/
                }
            }
        }
    }
    }  
    public function alistarmercancia($id_salida, $qrtext,$id_usuario,$id_bodega)
    {
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "SELECT *
                    FROM cmx_salidas
                    WHERE id =:id 
                    AND estado = 1 AND id_bodega = $id_bodega ";
        $consulta_ingresos = $conexion->prepare($sql);
        $consulta_ingresos->bindParam(':id', $id_salida, PDO::PARAM_STR);
        $consulta_ingresos->execute();
        $total = $consulta_ingresos->rowCount();
        if ($total == 0) {
            $this->respuesta = "BAD";
        } else {
            $this->respuesta = "GOOD";
            $sql             = "SELECT *
                                FROM cmx_material_bodega_salida
                                WHERE id_salida = :id_salida ";
            $cons_mat_bod_sal = $conexion->prepare($sql);
            $cons_mat_bod_sal->bindParam(':id_salida', $id_salida, PDO::PARAM_STR);
            $cons_mat_bod_sal->execute();
            $total_material_bodega = $cons_mat_bod_sal->rowCount();
            $this->mensaje         = $total_material_bodega;
            if ($total_material_bodega == 0) {
                $sql = "UPDATE cmx_salidas
                        SET estado = 0
                        WHERE id =:id AND id_bodega = $id_bodega ";
                $actualizar_pedido = $conexion->prepare($sql);
                $actualizar_pedido->bindParam(':id', $id_salida, PDO::PARAM_STR);
                $actualizar_pedido->execute();
                $this->respuesta = "BAD";
            } else {
                $bandera        = 0;
                $datos_embalaje = [];
                while ($datos_material_bodega = $cons_mat_bod_sal->fetch()) {
                    $this->respuesta = $datos_material_bodega["id"];
                    $sql             = "SELECT *
                                        FROM cmx_embalaje
                                        WHERE id_material_bodega_salida = :id_material_bodega_salida
                                        AND url_qr = :url_qr ";
                    $consulta_embalaje = $conexion->prepare($sql);
                    $url_qr            = $qrtext . ".png";
                    $consulta_embalaje->bindParam(':id_material_bodega_salida', $datos_material_bodega["id"], PDO::PARAM_STR);
                    $consulta_embalaje->bindParam(':url_qr', $url_qr, PDO::PARAM_STR);
                    $consulta_embalaje->execute();
                    $total_embalaje = $consulta_embalaje->rowCount();
                    if ($total_embalaje > 0) {
                        $bandera        = 1;
                        $datos_embalaje = $consulta_embalaje->fetch();
                    }
                }
                $this->respuesta = "BAD";
                if ($bandera == 1) {
                    $this->respuesta = "GOOD";
                    if ($datos_embalaje["estado"] == "1" && $datos_embalaje["sub_estado"] == "6") {
                        $this->listado= $datos_embalaje;
                        $this->mensaje = "GOOD";
                        if ($datos_embalaje["grupo"] > 0  && $datos_embalaje["cantidad_grupo"] > 0){
                            $sql                 ="UPDATE cmx_embalaje
                                                   SET estado = 1, sub_estado = 7, ubicacion = NULL 
                                                   WHERE id_material_bodega =:id_material_bodega
                                                   AND url_qr =:url_qr 
                                                   AND id= :id ";
                            $actualizar_embalaje = $conexion->prepare($sql);
                            $actualizar_embalaje->bindParam(':id_material_bodega', $datos_embalaje["id_material_bodega"], PDO::PARAM_STR);
                            $url_qr = $qrtext . ".png";
                            $actualizar_embalaje->bindParam(':url_qr', $url_qr, PDO::PARAM_STR);
                            $actualizar_embalaje->bindParam(':id', $datos_embalaje["id"], PDO::PARAM_STR);
                            $actualizar_embalaje->execute();
                            $sql = "INSERT INTO cmx_log_material_bodega (id_salida, id_usuario, qr_leido, tipo_movimiento, fecha_hora, id_ubicacion) VALUES (".$id_salida.",'".$id_usuario."','". $datos_embalaje["url_qr"]."','Alistamiento',NOW(),'".$datos_embalaje["ubicacion"]." ') "; 
                            $ins_log_material = $conexion->prepare($sql);
                            $ins_log_material->execute();
                            $sql      = "   UPDATE cmx_ubicaciones
                                            SET estado = 1
                                            WHERE id = :id
                                            AND estado = 0 AND tipo_ubicacion = 'FULL' AND id_bodega = $id_bodega ";
                            $actuubic = $conexion->prepare($sql);
                            $actuubic->bindParam(':id', $datos_embalaje["ubicacion"], PDO::PARAM_STR);
                            $actuubic->execute();    
                            $sql             = "SELECT *
                                                FROM cmx_embalaje
                                                WHERE id_embalaje = :id_embalaje
                                                AND id_material_bodega = :id_material_bodega ";
                            $cons_emba_estib = $conexion->prepare($sql);
                            $cons_emba_estib->bindParam(':id_material_bodega', $datos_embalaje["id_material_bodega"] , PDO::PARAM_STR);
                            $cons_emba_estib->bindParam(':id_embalaje', $datos_embalaje["id"] , PDO::PARAM_STR);
                            $cons_emba_estib->execute();
                            $total_emba_estibas = $cons_emba_estib->rowCount();
                            if ($total_emba_estibas > 0) {
                                //while ($datos_emba_estib = $cons_emba_estib->fetch()) {
                                    $sql             = "UPDATE cmx_embalaje
                                                       SET estado = 1, sub_estado = 7, ubicacion = NULL 
                                                       WHERE id_material_bodega =:id_material_bodega
                                                       AND id_embalaje = :id_embalaje AND sub_estado = 6 AND estado = 1 ";
                                    $act_emba_estib = $conexion->prepare($sql);
                                    $act_emba_estib->bindParam(':id_material_bodega', $datos_embalaje["id_material_bodega"], PDO::PARAM_STR);
                                    $act_emba_estib->bindParam(':id_embalaje',  $datos_embalaje["id"], PDO::PARAM_STR);
                                    $act_emba_estib->execute();
                                //}
                            }
                            $this->mensaje = "GOOD";
                            $this->terminaralistamiento($id_salida,$id_usuario,$id_bodega); 
                            if ($this->pass == "GOOD"){
                                $this->mensaje = "FINISH";
                            } 
                            /*else if ($this->pass == "NOT"){
                                $this->mensaje = "TRASLADO";
                            }*/
                        }
                        else if($datos_embalaje["grupo"] == 0){
                            $sql                 ="UPDATE cmx_embalaje
                                                   SET estado = 1, sub_estado = 7, ubicacion = NULL 
                                                   WHERE id_material_bodega =:id_material_bodega
                                                   AND url_qr =:url_qr
                                                   AND id= :id ";
                            $actualizar_embalaje = $conexion->prepare($sql);
                            $actualizar_embalaje->bindParam(':id_material_bodega', $datos_embalaje["id_material_bodega"], PDO::PARAM_STR);
                            $url_qr = $qrtext . ".png";
                            $actualizar_embalaje->bindParam(':url_qr', $url_qr, PDO::PARAM_STR);
                            $actualizar_embalaje->bindParam(':id', $datos_embalaje["id"], PDO::PARAM_STR);
                            $actualizar_embalaje->execute();
                            $this->mensaje = "GOOD";
                            $sql = "INSERT INTO cmx_log_material_bodega (id_salida, id_usuario, qr_leido, tipo_movimiento, fecha_hora, id_ubicacion) VALUES (".$id_salida.",'".$id_usuario."','". $datos_embalaje["url_qr"]."','Alistamiento',NOW(),'".$datos_embalaje["ubicacion"]." ') "; 
                            $ins_log_material = $conexion->prepare($sql);
                            $ins_log_material->execute();
                            $this->mensaje = "GOOD";
                            $this->terminaralistamiento($id_salida,$id_usuario,$id_bodega); 
                            if ($this->pass == "GOOD"){
                                $this->mensaje = "FINISH";
                            } 
                           /* else if ($this->pass == "NOT"){
                                $this->mensaje = "TRASLADO";
                            }*/
                        }

                    } else if ( $datos_embalaje["estado"] == "1" && $datos_embalaje["sub_estado"] == "7") {
                        $this->mensaje = "BAD";
                        $this->terminaralistamiento($id_salida,$id_usuario,$id_bodega); 
                        if ($this->pass == "GOOD"){
                            $this->mensaje = "FINISH";
                        } 
                        /*else if ($this->pass == "NOT"){
                            $this->mensaje = "TRASLADO";
                        }*/
                    }

                } else {
                    $sql               = " UPDATE cmx_salidas SET estado = 0 WHERE id = '" . $id_salida . "' AND id_bodega = $id_bodega ";
                    $actualizar_pedido = $conexion->prepare($sql);
                    $actualizar_pedido->execute();
                    $qr_leido=$qrtext.".png";
                    $sql = "INSERT INTO cmx_log_material_bodega (id_salida, id_usuario, qr_leido, tipo_movimiento, fecha_hora) VALUES (".$id_salida.",'".$id_usuario."','". $qr_leido."','Bloqueo',NOW()) "; 
                    $ins_log_material = $conexion->prepare($sql);
                    $ins_log_material->execute();
                    $this->respuesta = "GOOD";
                    $this->mensaje = "NOT";
                }
            }
        }
    } 
    public function sacarmercancia($id_salida, $qrtext,$id_usuario,$id_bodega)
    {
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "SELECT *
                    FROM cmx_salidas
                    WHERE id =:id 
                    AND estado = 3 AND id_bodega = $id_bodega ";
        $consulta_ingresos = $conexion->prepare($sql);
        $consulta_ingresos->bindParam(':id', $id_salida, PDO::PARAM_STR);
        $consulta_ingresos->execute();
        $total = $consulta_ingresos->rowCount();
        if ($total == 0) {
            $this->respuesta = "BAD";
        } else {
            $this->respuesta = "GOOD";
            $sql             = "SELECT *
                                FROM cmx_material_bodega_salida
                                WHERE id_salida = :id_salida ";
            $cons_mat_bod_sal = $conexion->prepare($sql);
            $cons_mat_bod_sal->bindParam(':id_salida', $id_salida, PDO::PARAM_STR);
            $cons_mat_bod_sal->execute();
            $total_material_bodega = $cons_mat_bod_sal->rowCount();
            $this->mensaje         = $total_material_bodega;
            if ($total_material_bodega == 0) {
                $sql = "UPDATE cmx_salidas
                        SET estado = 4
                        WHERE id =:id ";
                $actualizar_pedido = $conexion->prepare($sql);
                $actualizar_pedido->bindParam(':id', $id_salida, PDO::PARAM_STR);
                $actualizar_pedido->execute();
                $this->respuesta = "BAD";
            } else {
                $bandera        = 0;
                $datos_embalaje = [];
                while ($datos_material_bodega = $cons_mat_bod_sal->fetch()) {
                    $this->respuesta = $datos_material_bodega["id"];
                    $sql             = "SELECT *
                                        FROM cmx_embalaje
                                        WHERE id_material_bodega_salida = :id_material_bodega_salida
                                        AND url_qr = :url_qr ";
                    $consulta_embalaje = $conexion->prepare($sql);
                    $url_qr            = $qrtext . ".png";
                    $consulta_embalaje->bindParam(':id_material_bodega_salida', $datos_material_bodega["id"], PDO::PARAM_STR);
                    $consulta_embalaje->bindParam(':url_qr', $url_qr, PDO::PARAM_STR);
                    $consulta_embalaje->execute();
                    $total_embalaje = $consulta_embalaje->rowCount();
                    if ($total_embalaje > 0) {
                        $bandera        = 1;
                        $datos_embalaje = $consulta_embalaje->fetch();
                    }
                }
                $this->respuesta = "BAD";
                if ($bandera == 1) {
                    $this->respuesta = "GOOD";
                    if ($datos_embalaje["estado"] == "1" && $datos_embalaje["sub_estado"] == "7") {
                        $this->listado= $datos_embalaje;
                        $this->mensaje = "GOOD";
                        if ($datos_embalaje["grupo"] > 0  && $datos_embalaje["cantidad_grupo"] > 0){
                            $sql                 ="UPDATE cmx_embalaje
                                                   SET estado = 1, sub_estado = 8, ubicacion = NULL 
                                                   WHERE id_material_bodega =:id_material_bodega
                                                   AND url_qr =:url_qr 
                                                   AND id= :id ";
                            $actualizar_embalaje = $conexion->prepare($sql);
                            $actualizar_embalaje->bindParam(':id_material_bodega', $datos_embalaje["id_material_bodega"], PDO::PARAM_STR);
                            $url_qr = $qrtext . ".png";
                            $actualizar_embalaje->bindParam(':url_qr', $url_qr, PDO::PARAM_STR);
                            $actualizar_embalaje->bindParam(':id', $datos_embalaje["id"], PDO::PARAM_STR);
                            $actualizar_embalaje->execute();
                            $sql = "INSERT INTO cmx_log_material_bodega (id_salida, id_usuario, qr_leido, tipo_movimiento, fecha_hora) VALUES (".$id_salida.",'".$id_usuario."','". $datos_embalaje["url_qr"]."','Salida',NOW()) "; 
                            $ins_log_material = $conexion->prepare($sql);
                            $ins_log_material->execute();
                            $sql             = "SELECT *
                                                FROM cmx_embalaje
                                                WHERE id_embalaje = :id_embalaje
                                                AND id_material_bodega = :id_material_bodega ";
                            $cons_emba_estib = $conexion->prepare($sql);
                            $cons_emba_estib->bindParam(':id_material_bodega', $datos_embalaje["id_material_bodega"] , PDO::PARAM_STR);
                            $cons_emba_estib->bindParam(':id_embalaje', $datos_embalaje["id"] , PDO::PARAM_STR);
                            $cons_emba_estib->execute();
                            $total_emba_estibas = $cons_emba_estib->rowCount();
                            if ($total_emba_estibas > 0) {
                            
                            //while ($datos_emba_estib = $cons_emba_estib->fetch()) {
                                $sql             = "UPDATE cmx_embalaje
                                                   SET estado = 1, sub_estado = 8, ubicacion = NULL 
                                                   WHERE id_material_bodega =:id_material_bodega
                                                   AND id_embalaje = :id_embalaje  AND sub_estado = 7 AND estado = 1 ";
                                $act_emba_estib = $conexion->prepare($sql);
                                $act_emba_estib->bindParam(':id_material_bodega', $datos_embalaje["id_material_bodega"], PDO::PARAM_STR);
                                $act_emba_estib->bindParam(':id_embalaje', $datos_embalaje["id"], PDO::PARAM_STR);
                                $act_emba_estib->execute();
                            //}
                        }
                            $this->mensaje = "GOOD";
                            $this->terminarsalidas($id_salida,$id_usuario); 
                            if ($this->pass == "GOOD"){
                                $this->mensaje = "FINISH";
                            } 
                        }
                        else if($datos_embalaje["grupo"] == 0){
                            $sql                 ="UPDATE cmx_embalaje
                                                   SET estado = 1, sub_estado = 8, ubicacion = NULL 
                                                   WHERE id_material_bodega =:id_material_bodega
                                                   AND url_qr =:url_qr
                                                   AND id= :id ";
                            $actualizar_embalaje = $conexion->prepare($sql);
                            $actualizar_embalaje->bindParam(':id_material_bodega', $datos_embalaje["id_material_bodega"], PDO::PARAM_STR);
                            $url_qr = $qrtext . ".png";
                            $actualizar_embalaje->bindParam(':url_qr', $url_qr, PDO::PARAM_STR);
                            $actualizar_embalaje->bindParam(':id', $datos_embalaje["id"], PDO::PARAM_STR);
                            $actualizar_embalaje->execute();
                            $this->mensaje = "GOOD";
                            $sql = "INSERT INTO cmx_log_material_bodega (id_salida, id_usuario, qr_leido, tipo_movimiento, fecha_hora) VALUES (".$id_salida.",'".$id_usuario."','". $datos_embalaje["url_qr"]."','Salida',NOW()) "; 
                            $ins_log_material = $conexion->prepare($sql);
                            $ins_log_material->execute();
                            $this->mensaje = "GOOD";
                            $this->terminarsalidas($id_salida,$id_usuario); 
                            if ($this->pass == "GOOD"){
                                $this->mensaje = "FINISH";
                            } 
                        }

                    } else if ( $datos_embalaje["estado"] == "1" && $datos_embalaje["sub_estado"] == "8") {
                        $this->mensaje = "BAD";
                        $this->terminarsalidas($id_salida,$id_usuario); 
                        if ($this->pass == "GOOD"){
                            $this->mensaje = "FINISH";
                        } 
                    }

                } else {
                    $sql               = " UPDATE cmx_salidas SET estado = 4 WHERE id = '" . $id_salida . "' AND id_bodega = $id_bodega ";
                    $actualizar_pedido = $conexion->prepare($sql);
                    $actualizar_pedido->execute();
                    $qr_leido=$qrtext.".png";
                    $sql = "INSERT INTO cmx_log_material_bodega (id_salida, id_usuario, qr_leido, tipo_movimiento, fecha_hora) VALUES (".$id_salida.",'".$id_usuario."','". $qr_leido."','Bloqueo',NOW()) "; 
                    $ins_log_material = $conexion->prepare($sql);
                    $ins_log_material->execute();
                    $this->respuesta = "GOOD";
                    $this->mensaje = "NOT";
                }
            }
        }
    }    
    public function desbloquearalistamiento($id_salida, $qrtext, $id_usuario,$id_bodega)
    {
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "SELECT *
                    FROM cmx_salidas
                    WHERE id =:id 
                    AND estado = 0 AND id_bodega = $id_bodega ";
        $consulta_ingresos = $conexion->prepare($sql);
        $consulta_ingresos->bindParam(':id', $id_salida, PDO::PARAM_STR);
        $consulta_ingresos->execute();
        $total = $consulta_ingresos->rowCount();
        if ($total == 0) {
            $this->respuesta = "BAD";
        } else {
            $this->respuesta = "GOOD";
            $sql             = "SELECT * FROM cmx_log_material_bodega
                                WHERE id_salida = :id_salida  
                                AND tipo_movimiento = 'Bloqueo' 
                                ORDER BY id 
                                DESC LIMIT 1 ";
            $buscarmaximo = $conexion->prepare($sql);
            $buscarmaximo->bindParam(':id_salida', $id_salida, PDO::PARAM_STR);
            $buscarmaximo->execute();
            $datos_log_material_bodega = $buscarmaximo->fetch();
            $qr_leido=$qrtext.".png";
            if ($datos_log_material_bodega["qr_leido"] == $qr_leido ){
                $sql             = "UPDATE cmx_salidas
                                    SET estado = 1
                                    WHERE id =:id AND id_bodega = $id_bodega ";
                $actualizar_pedido = $conexion->prepare($sql);
                $actualizar_pedido->bindParam(':id', $id_salida, PDO::PARAM_STR);
                $actualizar_pedido->execute();
                $sql = "INSERT INTO cmx_log_material_bodega (id_salida, id_usuario, qr_leido, tipo_movimiento, fecha_hora) VALUES (".$id_salida.",'".$id_usuario."','". $qr_leido."','Desbloqueo',NOW()) "; 
                $ins_log_material = $conexion->prepare($sql);
                $ins_log_material->execute();
                $this->mensaje="GOOD";   
            }
            else {
                $this->mensaje="BAD";    
            }
        }
    }
    public function desbloquearpedido($id_ingreso, $qrtext, $id_usuario, $id_bodega)
    {
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "SELECT *
                    FROM cmx_ingresos
                    WHERE id =:id 
                    AND estado = 0 AND id_bodega_destino = $id_bodega ";
        $consulta_ingresos = $conexion->prepare($sql);
        $consulta_ingresos->bindParam(':id', $id_ingreso, PDO::PARAM_STR);
        $consulta_ingresos->execute();
        $total = $consulta_ingresos->rowCount();
        if ($total == 0) {
            $this->respuesta = "BAD";
        } else {
            $this->respuesta = "GOOD";
            $sql             = "SELECT * FROM cmx_log_material_bodega 
                                WHERE id_ingreso = :id_ingreso  
                                AND tipo_movimiento = 'Bloqueo'
                                ORDER BY id 
                                DESC LIMIT 1 ";
            $buscarmaximo = $conexion->prepare($sql);
            $buscarmaximo->bindParam(':id_ingreso', $id_ingreso, PDO::PARAM_STR);
            $buscarmaximo->execute();
            $datos_log_material_bodega = $buscarmaximo->fetch();
            $qr_leido=$qrtext.".png";
            if ($datos_log_material_bodega["qr_leido"] == $qr_leido ){
                $sql             = "UPDATE cmx_ingresos
                                    SET estado = 1
                                    WHERE id =:id  AND id_bodega_destino = $id_bodega ";
                $actualizar_pedido = $conexion->prepare($sql);
                $actualizar_pedido->bindParam(':id', $id_ingreso, PDO::PARAM_STR);
                $actualizar_pedido->execute();
                $sql = "INSERT INTO cmx_log_material_bodega (id_ingreso, id_usuario, qr_leido, tipo_movimiento, fecha_hora) VALUES (".$id_ingreso.",'".$id_usuario."','". $qr_leido."','Desbloqueo',NOW()) "; 
                $ins_log_material = $conexion->prepare($sql);
                $ins_log_material->execute();
                $this->mensaje="GOOD";   
            }
            else {
                $this->mensaje="BAD";    
            }
        }
    }
    public function desbloquearingresoalmacen($id_ingreso, $qrtext, $id_usuario,$id_bodega)
    {
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "SELECT *
                    FROM cmx_ingresos
                    WHERE id =:id 
                    AND estado = 4  AND id_bodega_destino = $id_bodega ";
        $consulta_ingresos = $conexion->prepare($sql);
        $consulta_ingresos->bindParam(':id', $id_ingreso, PDO::PARAM_STR);
        $consulta_ingresos->execute();
        $total = $consulta_ingresos->rowCount();
        if ($total == 0) {
            $this->respuesta = "BAD";
        } else {
            $this->respuesta = "GOOD";
            $sql             = "SELECT * FROM cmx_log_material_bodega 
                                WHERE id_ingreso = :id_ingreso
                                AND tipo_movimiento = 'Bloqueo'  
                                ORDER BY id 
                                DESC LIMIT 1 ";
            $buscarmaximo = $conexion->prepare($sql);
            $buscarmaximo->bindParam(':id_ingreso', $id_ingreso, PDO::PARAM_STR);
            $buscarmaximo->execute();
            $datos_log_material_bodega = $buscarmaximo->fetch();
            $qr_leido=$qrtext.".png";
            if ($datos_log_material_bodega["qr_leido"] == $qr_leido ){
                $sql             = "UPDATE cmx_ingresos
                                    SET estado = 3
                                    WHERE id =:id  AND id_bodega_destino = $id_bodega ";
                $actualizar_pedido = $conexion->prepare($sql);
                $actualizar_pedido->bindParam(':id', $id_ingreso, PDO::PARAM_STR);
                $actualizar_pedido->execute();
                $sql = "INSERT INTO cmx_log_material_bodega (id_ingreso, id_usuario, qr_leido, tipo_movimiento, fecha_hora) VALUES (".$id_ingreso.",'".$id_usuario."','". $qr_leido."','Desbloqueo',NOW()) "; 
                $ins_log_material = $conexion->prepare($sql);
                $ins_log_material->execute();
                $this->mensaje="GOOD";   
            }
            else {
                $this->mensaje="BAD";    
            }
        }
    }
    public function verificarposicion($id_ingreso,$qrtext, $id_usuario,$id_bodega)
    {
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "SELECT *
                    FROM cmx_ubicaciones
                    WHERE qr_posicion = :qr_posicion  AND id_bodega = $id_bodega ";
        $consubicacion = $conexion->prepare($sql);
        $qr_posicion = $qrtext.".png";
        $consubicacion->bindParam(':qr_posicion', $qr_posicion, PDO::PARAM_STR);
        $consubicacion->execute();
        $total = $consubicacion->rowCount();
        if ($total == 0) {
            $this->respuesta = "BAD";
            $sql= " SELECT * FROM cmx_ingresos WHERE id = '" . $id_ingreso . "'  AND id_bodega_destino = $id_bodega ";
            $buscaringreso = $conexion->prepare($sql);
            $buscaringreso->execute();
            $datos_ingreso= $buscaringreso->fetch();
            if($datos_ingreso["estado"] == 1){
                $sql= " UPDATE cmx_ingresos SET estado = 0 WHERE id = '" . $id_ingreso . "'  AND id_bodega_destino = $id_bodega ";
                $actualizar_pedido = $conexion->prepare($sql);
                $actualizar_pedido->execute();
                $qr_leido= $qrtext.".png";
                $sql = "INSERT INTO cmx_log_material_bodega (id_ingreso, id_usuario, qr_leido, tipo_movimiento, fecha_hora) VALUES (".$id_ingreso.",'".$id_usuario."','". $qr_leido."','Bloqueo',NOW()) "; 
                $ins_log_material = $conexion->prepare($sql);
                $ins_log_material->execute();
            }
            else if($datos_ingreso["estado"] == 3){
                $sql= " UPDATE cmx_ingresos SET estado = 4 WHERE id = '" . $id_ingreso . "'  AND id_bodega_destino = $id_bodega ";
                $actualizar_pedido = $conexion->prepare($sql);
                $actualizar_pedido->execute();
                $qr_leido= $qrtext.".png";
                $sql = "INSERT INTO cmx_log_material_bodega (id_ingreso, id_usuario, qr_leido, tipo_movimiento, fecha_hora) VALUES (".$id_ingreso.",'".$id_usuario."','". $qr_leido."','Bloqueo',NOW()) "; 
                $ins_log_material = $conexion->prepare($sql);
                $ins_log_material->execute();
            }
        } else {
            $datos_ubicacion = $consubicacion->fetch();
            if ($datos_ubicacion["tipo_ubicacion"] == "FULL" && $datos_ubicacion["estado"] == 0){
                $this->respuesta= "BAD";
                $sql= " SELECT * FROM cmx_ingresos WHERE id = '" . $id_ingreso . "'  AND id_bodega_destino = $id_bodega ";
                $buscaringreso = $conexion->prepare($sql);
                $buscaringreso->execute();
                $datos_ingreso= $buscaringreso->fetch();
                if($datos_ingreso["estado"] == 1){
                    $sql= " UPDATE cmx_ingresos SET estado = 0 WHERE id = '" . $id_ingreso . "'  AND id_bodega_destino = $id_bodega ";
                    $actualizar_pedido = $conexion->prepare($sql);
                    $actualizar_pedido->execute();
                    $qr_leido= $qrtext.".png";
                    $sql = "INSERT INTO cmx_log_material_bodega (id_ingreso, id_usuario, qr_leido, tipo_movimiento, fecha_hora) VALUES (".$id_ingreso.",'".$id_usuario."','". $qr_leido."','Bloqueo',NOW()) "; 
                    $ins_log_material = $conexion->prepare($sql);
                    $ins_log_material->execute();
                }
                else if($datos_ingreso["estado"] == 3){
                    $sql= " UPDATE cmx_ingresos SET estado = 4 WHERE id = '" . $id_ingreso . "'  AND id_bodega_destino = $id_bodega ";
                    $actualizar_pedido = $conexion->prepare($sql);
                    $actualizar_pedido->execute();
                    $qr_leido= $qrtext.".png";
                    $sql = "INSERT INTO cmx_log_material_bodega (id_ingreso, id_usuario, qr_leido, tipo_movimiento, fecha_hora) VALUES (".$id_ingreso.",'".$id_usuario."','". $qr_leido."','Bloqueo',NOW()) "; 
                    $ins_log_material = $conexion->prepare($sql);
                    $ins_log_material->execute();
                }
            }
            else if ($datos_ubicacion["tipo_ubicacion"] == "FULL" && $datos_ubicacion["estado"] == 1){
                $this->listado = $datos_ubicacion;
                $this->respuesta ="GOOD";
                $this->mensaje = "GOOD";
            }
            else if ($datos_ubicacion["tipo_ubicacion"] == "Saldos" && ($datos_ubicacion["estado"] == 1 || $datos_ubicacion["estado"] == 0)){
                 $sql      = "SELECT ce.id,cmc.id as 'material',
                                  (cmc.unidades_x_tendido* cmc.planchas_x_estiba) as 'cantidad_material',
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
                                    AND cu.id_bodega = $id_bodega 
                                    AND cu.qr_posicion = :qr_posicion ";
                $buscar_inventario = $conexion->prepare($sql);
                $qr_posicion = $qrtext.".png";
                $buscar_inventario->bindParam(':qr_posicion', $qr_posicion, PDO::PARAM_STR);
                $buscar_inventario->execute();
                $total_inventario = $buscar_inventario->rowCount();
                $this->respuesta ="GOOD";
                
                if ($total_inventario == 0) {
                    $this->mensaje = "GOOD";
                    $datos_ubicacion["cantidad_material"]= 1000;
                    $datos_ubicacion["DISPONIBLES"]= 0;
                    $datos_ubicacion["material"]= "";
                    $this->listado = $datos_ubicacion;
                } else {
                    
                    $dispo=0;
                    while ($datos_inventario = $buscar_inventario->fetch()) {
                        $dispo= $dispo+ $datos_inventario["DISPONIBLES"];
                        $datos_ubicacion["cantidad_material"]= $datos_inventario["cantidad_material"];
                        $datos_ubicacion["material"]= $datos_inventario["material"];
                    }

                    $datos_ubicacion["DISPONIBLES"]= $dispo;
                    if($datos_ubicacion["DISPONIBLES"] < $datos_ubicacion["cantidad_material"]){
                    $this->listado = $datos_ubicacion;
                        $this->mensaje ="GOOD";
                    }
                    else{
                        $this->mensaje ="BAD";
                    }
                }
            }
        }
    }
    public function desbloquearsalida($id_salida, $qrtext, $id_usuario,$id_bodega)
    {
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "SELECT *
                    FROM cmx_salidas
                    WHERE id =:id 
                    AND estado = 4 AND id_bodega = $id_bodega ";
        $consulta_ingresos = $conexion->prepare($sql);
        $consulta_ingresos->bindParam(':id', $id_salida, PDO::PARAM_STR);
        $consulta_ingresos->execute();
        $total = $consulta_ingresos->rowCount();
        if ($total == 0) {
            $this->respuesta = "BAD";
        } else {
            $this->respuesta = "GOOD";
            $sql             = "SELECT * FROM cmx_log_material_bodega
                                WHERE id_salida = :id_salida  
                                AND tipo_movimiento = 'Bloqueo'
                                ORDER BY id 
                                DESC LIMIT 1 ";
            $buscarmaximo = $conexion->prepare($sql);
            $buscarmaximo->bindParam(':id_salida', $id_salida, PDO::PARAM_STR);
            $buscarmaximo->execute();
            $datos_log_material_bodega = $buscarmaximo->fetch();
            $qr_leido=$qrtext.".png";
            if ($datos_log_material_bodega["qr_leido"] == $qr_leido ){
                $sql             = "UPDATE cmx_salidas
                                    SET estado = 3
                                    WHERE id =:id AND id_bodega = $id_bodega ";
                $actualizar_pedido = $conexion->prepare($sql);
                $actualizar_pedido->bindParam(':id', $id_salida, PDO::PARAM_STR);
                $actualizar_pedido->execute();
                $sql = "INSERT INTO cmx_log_material_bodega (id_salida, id_usuario, qr_leido, tipo_movimiento, fecha_hora) VALUES (".$id_salida.",'".$id_usuario."','". $qr_leido."','Desbloqueo',NOW()) "; 
                $ins_log_material = $conexion->prepare($sql);
                $ins_log_material->execute();
                $this->mensaje="GOOD";   
            }
            else {
                $this->mensaje="BAD";    
            }
        }
    }
    public function terminarescaneo($id_ingreso,$id_usuario,$id_bodega)
    {
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "SELECT *
                    FROM cmx_ingresos
                    WHERE id =:id AND id_bodega_destino = $id_bodega ";
        $consulta_ingresos = $conexion->prepare($sql);
        $consulta_ingresos->bindParam(':id', $id_ingreso, PDO::PARAM_STR);
        $consulta_ingresos->execute();
        $total = $consulta_ingresos->rowCount();
        if ($total == 0) {
            $this->pass = "BAD";
        } else {
            $this->pass = "GOOD";
            $sql             = "SELECT *
                                FROM cmx_material_bodega
                                WHERE id_ingreso = :id_ingreso ";
            $consulta_material_bodega = $conexion->prepare($sql);
            $consulta_material_bodega->bindParam(':id_ingreso', $id_ingreso, PDO::PARAM_STR);
            $consulta_material_bodega->execute();
            $total_material_bodega = $consulta_material_bodega->rowCount();
                $bandera           = 0;
                while ($datos_material_bodega = $consulta_material_bodega->fetch()) {
                    $this->pass = $datos_material_bodega["id"];
                    $sql             = "SELECT *
                                        FROM cmx_embalaje
                                        WHERE id_material_bodega = :id_material_bodega
                                        AND estado = 2 AND sub_estado = 2";
                    $consulta_embalaje = $conexion->prepare($sql);
                    $consulta_embalaje->bindParam(':id_material_bodega', $datos_material_bodega["id"], PDO::PARAM_STR);
                    $consulta_embalaje->execute();
                    $total_embalaje = $consulta_embalaje->rowCount();
                    if ($total_embalaje > 0) {
                        $bandera        = 1;
                    }
                }
                $this->pass = "BAD";
                if ($bandera == 0) {
                    $this->pass = "GOOD";
                    $sql               = " UPDATE cmx_ingresos SET estado = 3 WHERE id = '" . $id_ingreso . "'  AND id_bodega_destino = $id_bodega ";
                    $actualizar_pedido = $conexion->prepare($sql);
                    $actualizar_pedido->execute();
                    $sql = "INSERT INTO cmx_log_material_bodega (id_ingreso, id_usuario, qr_leido, tipo_movimiento, fecha_hora) VALUES (".$id_ingreso.",'".$id_usuario."',' ','Finalizar Entrada',NOW()) "; 
                        $ins_log_material = $conexion->prepare($sql);
                        $ins_log_material->execute();
                } else {
                    $this->pass = "BAD";
                }
        }
    }
    public function terminaralmacen($id_ingreso,$id_usuario,$id_bodega)
    {
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "SELECT *
                    FROM cmx_ingresos
                    WHERE id =:id AND estado = 3 AND id_bodega_destino = $id_bodega ";
        $consulta_ingresos = $conexion->prepare($sql);
        $consulta_ingresos->bindParam(':id', $id_ingreso, PDO::PARAM_STR);
        $consulta_ingresos->execute();
        $total = $consulta_ingresos->rowCount();
        if ($total == 0) {
            $this->pass = "BAD";
        } else {
            $this->pass = "GOOD";
            $sql             = "SELECT *
                                FROM cmx_material_bodega
                                WHERE id_ingreso = :id_ingreso ";
            $consulta_material_bodega = $conexion->prepare($sql);
            $consulta_material_bodega->bindParam(':id_ingreso', $id_ingreso, PDO::PARAM_STR);
            $consulta_material_bodega->execute();
            $total_material_bodega = $consulta_material_bodega->rowCount();
                $bandera           = 0;
                while ($datos_material_bodega = $consulta_material_bodega->fetch()) {
                    $this->pass = $datos_material_bodega["id"];
                    $sql             = "SELECT *
                                        FROM cmx_embalaje
                                        WHERE id_material_bodega = :id_material_bodega
                                        AND sub_estado = 3 AND estado = 1 ";
                    $consulta_embalaje = $conexion->prepare($sql);
                    $consulta_embalaje->bindParam(':id_material_bodega', $datos_material_bodega["id"], PDO::PARAM_STR);
                    $consulta_embalaje->execute();
                    $total_embalaje = $consulta_embalaje->rowCount();
                    if ($total_embalaje > 0) {
                        $bandera        = 1;
                    }
                }
                $this->pass = "BAD";
                if ($bandera == 0) {
                    $this->pass = "GOOD";
                    $sql               = " UPDATE cmx_ingresos SET estado = 5 WHERE id = '" . $id_ingreso . "'  AND id_bodega_destino = $id_bodega ";
                    $actualizar_pedido = $conexion->prepare($sql);
                    $actualizar_pedido->execute();
                    $sql = "INSERT INTO cmx_log_material_bodega (id_ingreso, id_usuario, qr_leido, tipo_movimiento, fecha_hora) VALUES (".$id_ingreso.",'".$id_usuario."',' ','Finalizar Almacenamiento',NOW()) "; 
                        $ins_log_material = $conexion->prepare($sql);
                        $ins_log_material->execute();
                } else {
                    $this->pass = "BAD";
                }
        }
    }
    public function terminaralistamiento($id_salida,$id_usuario,$id_bodega)
    {
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "SELECT *
                    FROM cmx_salidas
                    WHERE id =:id AND id_bodega = $id_bodega ";
        $consulta_ingresos = $conexion->prepare($sql);
        $consulta_ingresos->bindParam(':id', $id_salida, PDO::PARAM_STR);
        $consulta_ingresos->execute();
        $total = $consulta_ingresos->rowCount();
        if ($total == 0) {
            $this->pass = "BAD";
        } else {
            $this->pass = "GOOD";
            $sql             = "SELECT *
                                FROM cmx_material_bodega_salida
                                WHERE id_salida = :id_salida ";
            $consulta_material_bodega = $conexion->prepare($sql);
            $consulta_material_bodega->bindParam(':id_salida', $id_salida, PDO::PARAM_STR);
            $consulta_material_bodega->execute();
            $total_material_bodega = $consulta_material_bodega->rowCount();
                $bandera           = 0;
            while ($datos_material_bodega = $consulta_material_bodega->fetch()) {
                $this->pass = $datos_material_bodega["id"];
                $sql             = "SELECT *
                                    FROM cmx_embalaje
                                    WHERE id_material_bodega_salida = :id_material_bodega_salida
                                    AND sub_estado = 6 AND estado = 1 ";
                $consulta_embalaje = $conexion->prepare($sql);
                $consulta_embalaje->bindParam(':id_material_bodega_salida', $datos_material_bodega["id"], PDO::PARAM_STR);
                $consulta_embalaje->execute();
                $total_embalaje = $consulta_embalaje->rowCount();
                if ($total_embalaje > 0) {
                    $bandera        = 1;
                }
            }
            $this->pass = "BAD";
            if ($bandera == 0) {
                $traslado =$this->buscartraslado($id_salida,$id_usuario,$id_bodega);
                //if ($traslado == "BAD"){
                    $this->pass = "GOOD";
                    $sql               = " UPDATE cmx_salidas SET estado = 3 WHERE id = '" . $id_salida . "' AND id_bodega = $id_bodega ";
                    $actualizar_pedido = $conexion->prepare($sql);
                    $actualizar_pedido->execute();
                    $sql = "INSERT INTO cmx_log_material_bodega (id_ingreso, id_usuario, qr_leido, tipo_movimiento, fecha_hora) VALUES (".$id_salida.",'".$id_usuario."',' ','Finalizar Alistamiento',NOW()) "; 
                        $ins_log_material = $conexion->prepare($sql);
                        $ins_log_material->execute();
                /*}
                else{
                    $this->pass = "NOT";
                }*/
            } else {
                $this->pass = "BAD";
            }
        }
    }

    public function buscartraslado($id_salida,$id_usuario, $id_bodega )
    {
        
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = " SELECT *
                    FROM cmx_salidas
                    WHERE id =:id 
                    AND (estado = 1 OR estado = 3) AND id_bodega = $id_bodega ";
        $consulta_ingresos = $conexion->prepare($sql);
        $consulta_ingresos->bindParam(':id', $id_salida, PDO::PARAM_STR);
        $consulta_ingresos->execute();
        $total = $consulta_ingresos->rowCount();
        if ($total == 0) {
        } else {
            $sql             = "SELECT *
                                FROM cmx_material_bodega_salida
                                WHERE id_salida = :id_salida ";
            $cons_mat_bod_sal = $conexion->prepare($sql);
            $cons_mat_bod_sal->bindParam(':id_salida', $id_salida, PDO::PARAM_STR);
            $cons_mat_bod_sal->execute();
            $total_material_bodega = $cons_mat_bod_sal->rowCount();
            if ($total_material_bodega == 0) {
            } else {
                $conjunto_estibas = [];
                $x= 0;
                while ($datos_material_bodega = $cons_mat_bod_sal->fetch()) {
                    $sql             = "SELECT *
                                        FROM cmx_embalaje
                                        WHERE id_material_bodega_salida = :id_material_bodega_salida 
                                        ORDER BY id ASC ";
                    $consulta_embalaje = $conexion->prepare($sql);
                    $consulta_embalaje->bindParam(':id_material_bodega_salida', $datos_material_bodega["id"], PDO::PARAM_STR);
                    $consulta_embalaje->execute();
                    $total_embalaje = $consulta_embalaje->rowCount();
                    if ($total_embalaje > 0) {
                        while ($datos_embalaje = $consulta_embalaje->fetch()) {
                            if($datos_embalaje["grupo"] == 0  && $datos_embalaje["estado"] == '1' &&  $datos_embalaje["sub_estado"] == '7'){
                                    $sql = "SELECT *
                                            FROM cmx_embalaje
                                            WHERE id = :id ";
                                    $consul_embalaje = $conexion->prepare($sql);
                                    $consul_embalaje->bindParam(':id', $datos_embalaje["id_embalaje"], PDO::PARAM_STR);
                                    $consul_embalaje->execute();
                                    $estado_estibas =$consul_embalaje->fetch();
                                    if ($estado_estibas["estado"] ==  '2' && $estado_estibas["sub_estado"] == '5'){
                                        $sql = "SELECT *
                                            FROM cmx_ubicaciones
                                            WHERE id = :id AND id_bodega = $id_bodega ";
                                        $consul_ubic = $conexion->prepare($sql);
                                        $consul_ubic->bindParam(':id', $estado_estibas["ubicacion"], PDO::PARAM_STR);
                                        $consul_ubic->execute();    
                                        $estado_ubic =$consul_ubic->fetch();
                                        if( $estado_ubic["tipo_ubicacion"] != 'Saldos' ){
                                            if($x==0){
                                                $conjunto_estibas[$x] = $datos_embalaje["id_embalaje"];
                                                $x++;
                                            }
                                            else if ($x>0){
                                                if($datos_embalaje["id_embalaje"] != $conjunto_estibas[($x-1)]){
                                                    $conjunto_estibas[$x] = $datos_embalaje["id_embalaje"];
                                                    $x++;
                                                }    
                                            }
 
                                            $sql = "SELECT MIN(id) as 'idmin'
                                                    FROM cmx_ubicaciones 
                                                    WHERE tipo_ubicacion = 'Saldos' 
                                                    AND estado = 1 AND id_bodega = $id_bodega ";
                                            $buscarsaldos = $conexion->prepare($sql);
                                            $buscarsaldos->execute(); 
                                            $posicionsaldos= $buscarsaldos->fetch();
                                            if($posicionsaldos["idmin"] == ""){

                                            }
                                            else{
                                                $sql = "UPDATE cmx_ubicaciones 
                                                        SET estado = 2 
                                                        WHERE id = :id 
                                                        AND id_bodega = $id_bodega ";
                                                $update_ubic = $conexion->prepare($sql);
                                                $update_ubic->bindParam(':id', $posicionsaldos["idmin"], PDO::PARAM_STR);
                                                $update_ubic->execute();  
                                                $sql = "UPDATE cmx_embalaje 
                                                        SET sub_estado = 5, estado = 3
                                                        WHERE id = :id ";
                                                $update_embalaje = $conexion->prepare($sql);
                                                $update_embalaje->bindParam(':id', $estado_estibas["id"], PDO::PARAM_STR);
                                                $update_embalaje->execute(); 
                                                $sql = "INSERT INTO cmx_traslados (id_embalaje, id_ubicacion_origen, id_ubicacion_destino, estado) 
                                                    VALUES (:id_embalaje,:id_ubicacion_origen, :id_ubicacion_destino, 2) ";
                                                $insert_traslado = $conexion->prepare($sql);
                                                $insert_traslado->bindParam(':id_embalaje', $estado_estibas["id"], PDO::PARAM_STR);
                                                $insert_traslado->bindParam(':id_ubicacion_origen', $estado_estibas["ubicacion"], PDO::PARAM_STR);
                                                $insert_traslado->bindParam(':id_ubicacion_destino', $posicionsaldos["idmin"], PDO::PARAM_STR);
                                                $insert_traslado->execute(); 
                                                $sql = "INSERT INTO cmx_log_material_bodega (id_traslado, id_usuario, qr_leido, tipo_movimiento, fecha_hora) VALUES ((SELECT MAX(id) FROM cmx_traslados),$id_usuario, :url_qr,'Solicitud Traslado',NOW()) ";
                                                $insert_traslado = $conexion->prepare($sql);
                                                $insert_traslado->bindParam(':url_qr',$estado_estibas["url_qr"] , PDO::PARAM_STR);
                                                $insert_traslado->execute(); 
                                            }

                                        }
                                    }
                            }
                        }
                    }
                    else{
                        
                    }
                }
                if (count($conjunto_estibas) >0){
                    return $conjunto_estibas;
                }
                else{
                    return "BAD";
                }
            }
        }
    }

    public function terminarsalidas($id_salida,$id_usuario,$id_bodega)
    {
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "SELECT *
                    FROM cmx_salidas
                    WHERE id =:id AND id_bodega = $id_bodega ";
        $consulta_ingresos = $conexion->prepare($sql);
        $consulta_ingresos->bindParam(':id', $id_salida, PDO::PARAM_STR);
        $consulta_ingresos->execute();
        $total = $consulta_ingresos->rowCount();
        if ($total == 0) {
            $this->pass = "BAD";
        } else {
            $this->pass = "GOOD";
            $sql             = "SELECT *
                                FROM cmx_material_bodega_salida
                                WHERE id_salida = :id_salida ";
            $consulta_material_bodega = $conexion->prepare($sql);
            $consulta_material_bodega->bindParam(':id_salida', $id_salida, PDO::PARAM_STR);
            $consulta_material_bodega->execute();
            $total_material_bodega = $consulta_material_bodega->rowCount();
                $bandera           = 0;
                while ($datos_material_bodega = $consulta_material_bodega->fetch()) {
                    $this->pass = $datos_material_bodega["id"];
                    $sql             = "SELECT *
                                        FROM cmx_embalaje
                                        WHERE id_material_bodega_salida = :id_material_bodega_salida
                                        AND sub_estado = 7 AND estado = 1 ";
                    $consulta_embalaje = $conexion->prepare($sql);
                    $consulta_embalaje->bindParam(':id_material_bodega_salida', $datos_material_bodega["id"], PDO::PARAM_STR);
                    $consulta_embalaje->execute();
                    $total_embalaje = $consulta_embalaje->rowCount();
                    if ($total_embalaje > 0) {
                        $bandera        = 1;
                    }
                }
                $this->pass = "BAD";
                if ($bandera == 0) {
                    $this->pass = "GOOD";
                    $sql               = " UPDATE cmx_salidas SET estado = 5 WHERE id = '" . $id_salida . "' AND id_bodega = $id_bodega";
                    $actualizar_pedido = $conexion->prepare($sql);
                    $actualizar_pedido->execute();
                    $sql = "INSERT INTO cmx_log_material_bodega (id_ingreso, id_usuario, qr_leido, tipo_movimiento, fecha_hora) VALUES (".$id_salida.",'".$id_usuario."',' ','Finalizar Salida',NOW()) "; 
                        $ins_log_material = $conexion->prepare($sql);
                        $ins_log_material->execute();
                } else {
                    $this->pass = "BAD";
                }
        }
    }
    public function verificarposiciontraslado($id_salida,$qrtext, $id_usuario)
    {
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "   SELECT *
                        FROM cmx_ubicaciones
                        WHERE qr_posicion = :qr_posicion ";
        $consubicacion = $conexion->prepare($sql);
        $qr_posicion = $qrtext.".png";
        $consubicacion->bindParam(':qr_posicion', $qr_posicion, PDO::PARAM_STR);
        $consubicacion->execute();
        $total = $consubicacion->rowCount();
        if ($total == 0) {
            $this->respuesta = "BAD";
            $sql= " UPDATE cmx_salidas SET estado = 0 WHERE id = '" . $id_salida . "' ";
            $actualizar_pedido = $conexion->prepare($sql);
            $actualizar_pedido->execute();
            $qr_leido= $qrtext.".png";
            $sql = "INSERT INTO cmx_log_material_bodega (id_salida, id_usuario, qr_leido, tipo_movimiento, fecha_hora) VALUES (".$id_salida.",'".$id_usuario."','". $qr_leido."','Bloqueo',NOW()) "; 
            $ins_log_material = $conexion->prepare($sql);
            $ins_log_material->execute();
        } else {
            $datos_ubicacion = $consubicacion->fetch();
            if($datosubicacion["tipo_ubicacion"] == "FULL"){
                if($datosubicacion["estado"] != 2){
                    $this->respuesta ="BAD";     
                    $sql= " UPDATE cmx_salidas SET estado = 0 WHERE id = '" . $id_salida . "' ";
                    $actualizar_pedido = $conexion->prepare($sql);
                    $actualizar_pedido->execute();
                    $qr_leido= $qrtext.".png";
                    $sql = "INSERT INTO cmx_log_material_bodega (id_salida, id_usuario, qr_leido, tipo_movimiento, fecha_hora) VALUES (".$id_salida.",'".$id_usuario."','". $qr_leido."','Bloqueo',NOW()) "; 
                    $ins_log_material = $conexion->prepare($sql);
                    $ins_log_material->execute();
                }
                else{
                    $this->listado = $datos_ubicacion;
                    $this->respuesta ="GOOD";
                }
            }
            else if($datosubicacion["tipo_ubicacion"] == "Saldos"){
                    $this->listado = $datos_ubicacion;
                    $this->respuesta ="GOOD";
            } 
            
        }
    }
    public function verificarposicionsaliente($id_traslado,$qrtext, $id_usuario)
    {
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "   SELECT ct.id_embalaje, ce.ubicacion, cu.*
                        FROM cmx_traslados ct, cmx_embalaje ce,
                        cmx_ubicaciones cu
                        WHERE ct.id = :id_traslado
                        AND ct.id_embalaje = ce.id 
                        AND ce.ubicacion = cu.id
                        AND cu.qr_posicion = :qr_posicion
                        AND ct.id_ubicacion_origen = cu.id
                        AND ct.id_ubicacion_origen = ce.ubicacion ";
        $consubicacion = $conexion->prepare($sql);
        $qr_posicion = $qrtext.".png";
        $consubicacion->bindParam(':id_traslado', $id_traslado, PDO::PARAM_STR);
        $consubicacion->bindParam(':qr_posicion', $qr_posicion, PDO::PARAM_STR);
        $consubicacion->execute();
        $total = $consubicacion->rowCount();
        if ($total == 0) {
            $this->respuesta = "BAD";
                    $sql= " UPDATE cmx_traslados SET estado = 0 WHERE id = '" . $id_traslado . "' ";
                    $actualizar_pedido = $conexion->prepare($sql);
                    $actualizar_pedido->execute();
                    $qr_leido= $qrtext.".png";
                    $sql = "INSERT INTO cmx_log_material_bodega (id_traslado, id_usuario, qr_leido, tipo_movimiento, fecha_hora) VALUES (".$id_traslado.",'".$id_usuario."','". $qr_leido."','Bloqueo',NOW()) "; 
                    $ins_log_material = $conexion->prepare($sql);
                    $ins_log_material->execute();
        } else {
            $datos_ubicacion = $consubicacion->fetch();
            
            $this->listado = $datos_ubicacion;
            $this->respuesta ="GOOD";
        }
    }
    public function verificarembalajetraslados($id_traslado,$qrtext,$id_usuario)
    {
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "   SELECT ct.*
                        FROM cmx_embalaje ce, cmx_traslados ct
                        WHERE ce.url_qr = :url_qr
                        AND ce.sub_estado = 5
                        AND ce.estado = 3 
                        AND ct.id = :id_traslado
                        AND ce.id = ct.id_embalaje ";
        $cons_embalaje = $conexion->prepare($sql);
        $url_qr= $qrtext.".png";
        $cons_embalaje->bindParam(':url_qr', $url_qr, PDO::PARAM_STR);
        $cons_embalaje->bindParam(':id_traslado', $id_traslado, PDO::PARAM_STR);
        $cons_embalaje->execute();
        $total = $cons_embalaje->rowCount();
        if ($total == 0) {
            $this->respuesta="BAD";
            $sql= " UPDATE cmx_traslados SET estado = 0 WHERE id = $id_traslado ";
            $actuali_traslado = $conexion->prepare($sql);
            $actuali_traslado->execute();
            $qr_leido= $qrtext.".png";
            $sql = "INSERT INTO cmx_log_material_bodega (id_traslado, id_usuario, qr_leido, tipo_movimiento, fecha_hora) VALUES (".$id_traslado.",'".$id_usuario."','". $qr_leido."','Bloqueo',NOW()) "; 
            $ins_log_material = $conexion->prepare($sql);
            $ins_log_material->execute();

        }
        else{
            $this->respuesta="GOOD";

        }
    } 
    public function completartraslado($id_traslado, $qrtext,$id_usuario,$id_bodega)
    {
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "   SELECT ct.*, ce.ubicacion
                        FROM cmx_traslados ct, cmx_embalaje ce,
                        cmx_ubicaciones cu
                        WHERE ct.id = :id_traslado
                        AND ct.id_embalaje = ce.id 
                        AND ct.id_ubicacion_destino = cu.id 
                        AND cu.qr_posicion =  :qr_posicion 
                        AND cu.id_bodega = $id_bodega ";
        $consubicacion = $conexion->prepare($sql);
        $qr_posicion = $qrtext.".png";
        $consubicacion->bindParam(':id_traslado', $id_traslado, PDO::PARAM_STR);
        $consubicacion->bindParam(':qr_posicion', $qr_posicion, PDO::PARAM_STR);
        $consubicacion->execute();
        $total = $consubicacion->rowCount();
        $datos_traslado = $consubicacion->fetch();
        if ($total == 0) {
            $this->respuesta = "BAD";
                    $sql= " UPDATE cmx_traslados SET estado = 0 WHERE id = '" . $id_traslado . "' ";
                    $actualizar_pedido = $conexion->prepare($sql);
                    $actualizar_pedido->execute();
                    $qr_leido= $qrtext.".png";
                    $sql = "INSERT INTO cmx_log_material_bodega (id_traslado, id_usuario, qr_leido, tipo_movimiento, fecha_hora) VALUES (".$id_traslado.",'".$id_usuario."','". $qr_leido."','Bloqueo',NOW()) "; 
                    $ins_log_material = $conexion->prepare($sql);
                    $ins_log_material->execute();
        } else {
            $sql= " UPDATE cmx_traslados SET estado = 3 WHERE id = '" . $id_traslado . "' ";
            $actualizar_traslado = $conexion->prepare($sql);
            $actualizar_traslado->execute();
            $qr_leido= $qrtext.".png";
            $sql = "INSERT INTO cmx_log_material_bodega (id_traslado, id_usuario, qr_leido, tipo_movimiento, fecha_hora, id_ubicacion) VALUES (".$id_traslado.",'".$id_usuario."','". $qr_leido."','Finalizar Traslado', NOW(), '" . $datos_traslado["id_ubicacion_destino"] . "') "; 
            $ins_log_material = $conexion->prepare($sql);
            $ins_log_material->execute();
            $sql = "INSERT INTO cmx_log_material_bodega (id_traslado, id_usuario, qr_leido, tipo_movimiento, fecha_hora, id_ubicacion) VALUES (".$id_traslado.",'".$id_usuario."','". $qr_leido."','Iniciar Traslado', NOW(), '" . $datos_traslado["id_ubicacion_origen"] . "') "; 
            $ins_log_material2 = $conexion->prepare($sql);
            $ins_log_material2->execute();


            $sql= " UPDATE cmx_embalaje 
                    SET sub_estado = 5, estado = 2, ubicacion = ". $datos_traslado["id_ubicacion_destino"] . " 
                    WHERE id = '" . $datos_traslado["id_embalaje"] . "' ";
            $actualizar_estiba = $conexion->prepare($sql);
            $actualizar_estiba->execute();
            $sql= " UPDATE cmx_embalaje 
                    SET sub_estado = 5, estado = 1, ubicacion = ". $datos_traslado["id_ubicacion_destino"] . " 
                    WHERE id_embalaje = '" . $datos_traslado["id_embalaje"] . "' 
                    AND sub_estado = 5 AND estado = 1 ";
            $actualizar_embalaje = $conexion->prepare($sql);
            $actualizar_embalaje->execute();
            $sql= " UPDATE cmx_ubicaciones 
                    SET estado = 0 
                    WHERE id = '" . $datos_traslado["id_ubicacion_destino"] . "'  AND id_bodega = $id_bodega ";
            $actualizar_destino = $conexion->prepare($sql);
            $actualizar_destino->execute();
            $sql= " UPDATE cmx_ubicaciones 
                    SET estado = 1 
                    WHERE id = '" . $datos_traslado["id_ubicacion_origen"] . "' AND id_bodega = $id_bodega  ";
            $actualizar_origen = $conexion->prepare($sql);
            $actualizar_origen->execute();            
            $this->respuesta ="GOOD";
        }
        /*$model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "SELECT *
                    FROM cmx_salidas
                    WHERE id =:id 
                    AND estado = 1 ";
        $consulta_ingresos = $conexion->prepare($sql);
        $consulta_ingresos->bindParam(':id', $id_salida, PDO::PARAM_STR);
        $consulta_ingresos->execute();
        $total = $consulta_ingresos->rowCount();
        if ($total == 0) {
            $this->respuesta = "BAD";
        } else {
            $this->respuesta = "GOOD";
            $sql             = "SELECT *
                                FROM cmx_material_bodega_salida
                                WHERE id_salida = :id_salida ";
            $consulta_material_bodega = $conexion->prepare($sql);
            $consulta_material_bodega->bindParam(':id_salida', $id_salida, PDO::PARAM_STR);
            $consulta_material_bodega->execute();
            $total_material_bodega = $consulta_material_bodega->rowCount();
            $this->mensaje         = $total_material_bodega;
            if ($total_material_bodega == 0) {
               $this->respuesta = "BAD"."bodega";
            } else {
                $bandera        = 0;
                $datos_embalaje = [];
                while ($datos_material_bodega = $consulta_material_bodega->fetch()) {
                    $this->respuesta = $datos_material_bodega["id"];
                    $sql             = "SELECT *
                                        FROM cmx_embalaje
                                        WHERE id_material_bodega_salida = :id_material_bodega_salida
                                        AND url_qr = :url_qr ";
                    $consulta_embalaje = $conexion->prepare($sql);
                    $url_qr            = $qr_embalaje . ".png";
                    $consulta_embalaje->bindParam(':id_material_bodega_salida', $datos_material_bodega["id"], PDO::PARAM_STR);
                    $consulta_embalaje->bindParam(':url_qr', $url_qr, PDO::PARAM_STR);
                    $consulta_embalaje->execute();
                    $total_embalaje = $consulta_embalaje->rowCount();
                    if ($total_embalaje > 0) {
                        $bandera        = 1;
                        $datos_embalaje = $consulta_embalaje->fetch();
                    }
                }
                $this->respuesta = "BAD".$bandera."bandera".$url_qr;
                if ($bandera == 1) {
                    $this->respuesta = "GOOD".$id_salida;
                    $this->listado= $datos_embalaje;
                    $this->mensaje = "GOOD";
                    if ($datos_embalaje["grupo"] > 0  && $datos_embalaje["cantidad_grupo"] > 0){
                        $sql                 ="UPDATE cmx_embalaje
                                               ubicacion = :ubicacion 
                                               WHERE id_material_bodega =:id_material_bodega
                                               AND url_qr =:url_qr 
                                               AND id= :id AND sub_estado = 5 AND estado = 2";
                        $actualizar_embalaje = $conexion->prepare($sql);
                        $actualizar_embalaje->bindParam(':id_material_bodega', $datos_embalaje["id_material_bodega"], PDO::PARAM_STR);
                        $url_qr = $qr_embalaje . ".png";
                        $actualizar_embalaje->bindParam(':url_qr', $url_qr, PDO::PARAM_STR);
                        $actualizar_embalaje->bindParam(':id', $datos_embalaje["id"], PDO::PARAM_STR);
                        $actualizar_embalaje->bindParam(':ubicacion', $qr_posicion, PDO::PARAM_STR);
                        $actualizar_embalaje->execute();
                        $sql = "INSERT INTO cmx_log_material_bodega (id_ingreso, id_usuario, qr_leido, tipo_movimiento, fecha_hora) VALUES (".$id_salida.",'".$id_usuario."','". $datos_embalaje["url_qr"]."','Traslado',NOW()) "; 
                        $ins_log_material = $conexion->prepare($sql);
                        $ins_log_material->execute();
                        $sql      = "   UPDATE cmx_ubicaciones
                                        SET estado = 0
                                        WHERE id = :id
                                        AND estado = 2 ";
                        $actuubic = $conexion->prepare($sql);
                        $actuubic->bindParam(':id', $qr_posicion, PDO::PARAM_STR);
                        $actuubic->execute();    
                        $sql             = "SELECT *
                                            FROM cmx_embalaje
                                            WHERE id_embalaje = :id_embalaje
                                            AND id_material_bodega = :id_material_bodega 
                                            AND sub_estado = 6 AND estado = 1";
                        $cons_emba_estib = $conexion->prepare($sql);
                        $cons_emba_estib->bindParam(':id_material_bodega', $datos_embalaje["id_material_bodega"] , PDO::PARAM_STR);
                        $cons_emba_estib->bindParam(':id_embalaje', $datos_embalaje["id"] , PDO::PARAM_STR);
                        $cons_emba_estib->execute();
                        $total_emba_estibas = $cons_emba_estib->rowCount();
                        if ($total_emba_estibas > 0) {
                            while ($datos_emba_estib = $cons_emba_estib->fetch()) {
                                $sql             = "UPDATE cmx_embalaje
                                                    ubicacion = :ubicacion 
                                                   WHERE id_material_bodega =:id_material_bodega
                                                   AND id= :id ";
                                $act_emba_estib = $conexion->prepare($sql);
                                $act_emba_estib->bindParam(':id_material_bodega', $datos_embalaje["id_material_bodega"], PDO::PARAM_STR);
                                $act_emba_estib->bindParam(':id', $datos_emba_estib["id"], PDO::PARAM_STR);
                                $act_emba_estib->bindParam(':ubicacion', $qr_posicion, PDO::PARAM_STR);
                                $act_emba_estib->execute();
                            }
                        }
                            $this->mensaje = "GOOD";
                            $this->terminaralistamiento($id_salida,$id_usuario,$id_bodega); 
                            if ($this->pass == "GOOD"){
                                $this->mensaje = "FINISH";
                            } 
                            else if ($this->pass == "NOT"){
                                $this->mensaje = "TRASLADO";
                            }

                        $this->terminaralistamiento($id_salida,$id_usuario,$id_bodega); 
                        if ($this->pass == "GOOD"){
                            $this->mensaje = "FINISH";
                        } 
                        else if ($this->pass == "NOT"){
                            $this->mensaje = "TRASLADO";
                        }
                    }
                }
            }
        }*/
    }
    public function desbloqueartraslado($id_traslado, $qrtext, $id_usuario)
    {
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "SELECT *
                    FROM cmx_traslados
                    WHERE id =:id 
                    AND estado = 0 ";
        $consulta_ingresos = $conexion->prepare($sql);
        $consulta_ingresos->bindParam(':id', $id_traslado, PDO::PARAM_STR);
        $consulta_ingresos->execute();
        $total = $consulta_ingresos->rowCount();
        if ($total == 0) {
            $this->respuesta = "BAD";
        } else {
            $this->respuesta = "GOOD";
            $sql             = "SELECT * FROM cmx_log_material_bodega
                                WHERE id_traslado = :id_traslado  
                                AND tipo_movimiento = 'Bloqueo'
                                ORDER BY id 
                                DESC LIMIT 1 ";
            $buscarmaximo = $conexion->prepare($sql);
            $buscarmaximo->bindParam(':id_traslado', $id_traslado, PDO::PARAM_STR);
            $buscarmaximo->execute();
            $datos_log_material_bodega = $buscarmaximo->fetch();
            $qr_leido=$qrtext.".png";
            if ($datos_log_material_bodega["qr_leido"] == $qr_leido ){
                $sql             = "UPDATE cmx_traslados
                                    SET estado = 2
                                    WHERE id =:id ";
                $actualizar_pedido = $conexion->prepare($sql);
                $actualizar_pedido->bindParam(':id', $id_traslado, PDO::PARAM_STR);
                $actualizar_pedido->execute();
                $sql = "INSERT INTO cmx_log_material_bodega (id_traslado, id_usuario, qr_leido, tipo_movimiento, fecha_hora) VALUES (".$id_traslado.",'".$id_usuario."','". $qr_leido."','Desbloqueo',NOW()) "; 
                $ins_log_material = $conexion->prepare($sql);
                $ins_log_material->execute();
                $this->mensaje="GOOD";   
            }
            else {
                $this->mensaje="BAD";    
            }
        }
    }  
    public function calculartiempo($tiempo_aprobado)
    {
        $tiempo_notificacion = 0;
        if ($tiempo_aprobado > 2160) {
            $tiempo_notificacion = 1440;
            return $tiempo_notificacion;
        } else if ($tiempo_aprobado > 120 && $tiempo_aprobado <= 2160) {
            $tiempo_notificacion = 120;
            return $tiempo_notificacion;
        } else if ($tiempo_aprobado > 0 && $tiempo_aprobado <= 120) {
            $tiempo_notificacion = $tiempo_aprobado * 0.3;
            return $tiempo_notificacion;
        }
    }

    public function reset()
    {
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "UPDATE cmx_usuarios "
            . "SET pass=:pass, reset_pass=:pass "
            . "WHERE user_log=:user_log AND email=:email ";
        $consulta   = $conexion->prepare($sql);
        $this->pass = sha1($this->pass);
        $consulta->bindParam(':user_log', $this->user_log, PDO::PARAM_STR);
        $consulta->bindParam(':email', $this->email, PDO::PARAM_STR);
        $consulta->bindParam(':pass', $this->pass, PDO::PARAM_STR);
        if ($consulta->execute()) {
            $this->respuesta = "GOOD";
        } else {
            $this->respuesta = "BAD";
        }
    }
    public function loginapp()
    {
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "SELECT uc.* ,
                u.nom_usuario as 'nom_usuario',
                u.id as 'id_usuario',
                u.url_avatar as 'avatar' , u.email as 'email',
                p.nombre_perfil as 'nombre_perfil',
                p.id as 'id_perfil',
                c.nombre as 'nombre_cliente'
                FROM cmx_usuarios u,
                cmx_usuario_cliente uc, cmx_clientes c, cmx_perfiles p
                WHERE u.user_log=:user_log
                AND (u.pass=:pass)
                AND u.estado=1 AND u.id = uc.id_usuario
                AND uc.estado=1 AND uc.id_cliente = c.id
                AND p.estado=1
                AND uc.id_perfil = p.id
                AND c.estado=1 AND p.id IN (1,2,3) ";
        $this->pass = sha1($this->pass);
        $consulta   = $conexion->prepare($sql);
        $consulta->bindParam(':user_log', $this->user_log, PDO::PARAM_STR);
        $consulta->bindParam(':pass', $this->pass, PDO::PARAM_STR);
        $consulta->execute();
        $total = $consulta->rowCount();
        if ($total == 0) {
            $this->respuesta = "BAD";
        } else {
            $this->respuesta = "GOOD";
            $fila            = $consulta->fetch();
            $this->listado   = $fila;
        }
    }

    public function generarRandompassword($length)
    {
        $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        return substr(str_shuffle($chars), 0, $length);
    }

    public function crearKey($user)
    {
        $key = $user['reset_pass'] . '|' . $user['user_log'] . '|' . $user['email'];
        $key = base64_encode($key);
        $key = strrev($key);
        return htmlentities($key);
    }

    public function reversarKey($key)
    {
        $key = html_entity_decode($key);
        $key = strrev($key);
        $key = base64_decode($key);
        return explode('|', $key);
    }

    public function reversarKeyPedido($key)
    {
        $key = html_entity_decode($key);
        $key = strrev($key);
        $key = base64_decode($key);
        return explode('-', $key);
    }

    public function sendEmail($subject, $message, $from = null, $replyTo = null, $fromName = null, $to = null, $cc = null, $bcc = null, $attachments = null, $domain = null)
    {
        $cc      = null;
        $bcc     = null;
        $subject = "** CORREO DE PRUEBA ** - " . $subject;
        //$message = '<span style="color:RED;font-size: 2em;">** ESTE CORREO ES DE PRUEBA, POR FAVOR NO LO TENGA EN CUENTA **</span><br/><br/>' . $message;
        $mail = new PHPMailer();
        $mail->IsSMTP();
        $mail->Host     = mailhost;
        $mail->Port     = mailport;
        $mail->Username = mailuser;
        $mail->Password = mailpwd;
        $mail->SMTPAuth = mailauth;
        if (mailhost == "smtp.gmail.com") {
            $mail->SMTPSecure = 'tls';
        }

        if (empty($from)) {
            $from = mailfrom;
        }
        $mail->From = $from;
        if (empty($replyTo)) {
            $replyTo = mailreply;
        }
        $mail->AddReplyTo($replyTo);
        if (empty($fromName)) {
            $fromName = mailfromname;
        }

        $mail->FromName = $fromName;
        $mail->Subject  = $subject;
        $mail->msgHTML($message);
        if (!empty($to)) {
            $to = str_replace(" ", "", $to);
            $to = str_replace(";", ",", $to);
            $to = explode(",", $to);
            if (is_array($to)) {
                foreach ($to as $email) {
                    $mail->AddAddress($email);
                }
            } else {
                $mail->AddAddress($to);
            }
        }

        if (!empty($cc)) {
            $cc = str_replace(" ", "", $cc);
            $cc = str_replace(";", ",", $cc);
            $cc = explode(",", $cc);
            if (is_array($cc)) {
                foreach ($cc as $email) {
                    $mail->AddCC($email);
                }
            } else {
                $mail->AddCC($cc);
            }
        }
        if (!empty($bcc)) {
            $bcc = str_replace(" ", "", $bcc);
            $bcc = str_replace(";", ",", $bcc);
            $bcc = explode(",", $bcc);
            if (is_array($bcc)) {
                foreach ($bcc as $email) {
                    $mail->AddBCC($email);
                }
            } else {
                $mail->AddBCC($bcc);
            }
        }

        if (!empty($attachments)) {
            foreach ($attachments as $name => $path) {
                $mail->AddAttachment($path, $name);
            }
        }
        if ($mail->Send()) {
            $return['success'] = true;
            $return['message'] = 'El mensaje ha sido enviado.';
        } else {
            $return['success'] = false;
        }
        return $return;
    }

    /****** Metodos para apk de conductores *******/
    public function verificarConductor($documento){
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = '
                        SELECT 
                            cp.id, cp.numero_documento, cp.nombre
                        FROM 
                            cmx_proveedores cp
                            INNER JOIN cmx_vehiculos cv ON cp.id = cv.id_conductor
                        WHERE 
                            cp.numero_documento = :documento
                            AND cp.estado = "Activo"
                            AND cv.estado = "Activo"
                        GROUP BY cp.id
                    ';
        $consulta = $conexion->prepare($sql);
        $consulta->bindParam(':documento', $documento, PDO::PARAM_STR);
        $consulta->execute();
        $total         = $consulta->rowCount();
        $this->mensaje = $total;
        if ($total == 0) {
            $this->respuesta = "BAD";
        } else {
            $this->respuesta = "GOOD";
            while ($datos_conductor = $consulta->fetch()) {
                    $this->listado[] = $datos_conductor;
            }
        }
    }

    public function asignarUnbicacionConductor($id,$latitud,$longitud){
        $model    = new Conexion;
        $conexion = $model->conectar();
        // Se toma el tiempo actual
        $fecha_actual = getdate();
        $now = $fecha_actual["year"] . "-" . $fecha_actual["mon"] . "-" . $fecha_actual["mday"] . " " . $fecha_actual["hours"] . ":" . $fecha_actual["minutes"] . ":" . $fecha_actual["seconds"];

        $sql = " 
            UPDATE 
                cmx_proveedores 
            SET 
                latitud = " . $latitud . ",
                longitud = " . $longitud . ", 
                fecha_ubicacion = '" . $now . "'
            WHERE 
                id = '" . $id . "'";
        // $this->mensaje = $sql;
        $actualizar_pedido = $conexion->prepare($sql);
        $actualizar_pedido->execute();
        $this->respuesta = "GOOD";
    }
}
