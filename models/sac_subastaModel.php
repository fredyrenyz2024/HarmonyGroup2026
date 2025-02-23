<?php
session_start();
class sac_subastaModel extends Model
{
  public function __construct()
  {
    parent::__construct();
  }

  public function Consulta_Subasta_sac($tipo, $valor)
  {
    try {
      if ($tipo == 3) {
        $sql = $this->_db3->prepare("SELECT  su.id, su.fecha, su.hora,
        v.placa, concat(pro.nombre,' ',pro.apellido1,' ',pro.apellido2) AS conductor, b.estado
        FROM cmx_subasta su
        INNER JOIN cmx_subasta_flete a ON su.id=a.id_suba
        INNER JOIN cmx_estado_subasta_flete b ON a.id=b.id_suba_flete
        AND b.estado IN('pendiente_aprobacion','aprueba_flete_sac','no_aprueba_ge')
        INNER JOIN cmx_vehiculos v ON a.placa=v.placa
        INNER JOIN cmx_proveedores pro ON v.id_conductor=pro.id
        WHERE su.id=:valor");
        $sql->bindParam(':valor', $valor, PDO::PARAM_STR);
        $sql->execute();
      }
      if ($tipo == 2) {
        $sql = $this->_db3->prepare("SELECT  su.id, su.fecha, su.hora,
        v.placa, concat(pro.nombre,' ',pro.apellido1,' ',pro.apellido2) AS conductor, b.estado
        FROM cmx_subasta su
        INNER JOIN cmx_subasta_flete a ON su.id=a.id_suba
        INNER JOIN cmx_estado_subasta_flete b ON a.id=b.id_suba_flete
        AND b.estado IN('pendiente_aprobacion','aprueba_flete_sac','no_aprueba_ge')
        INNER JOIN cmx_vehiculos v ON a.placa=v.placa
        INNER JOIN cmx_proveedores pro ON v.id_conductor=pro.id
        WHERE v.placa=:valor");
        $sql->bindParam(':valor', $valor, PDO::PARAM_STR);
        $sql->execute();
      }
      if ($tipo == 1) {
        $sql = $this->_db3->prepare("SELECT  su.id, su.fecha, su.hora,
        v.placa, concat(pro.nombre,' ',pro.apellido1,' ',pro.apellido2) AS conductor, b.estado
        FROM cmx_subasta su
        INNER JOIN cmx_subasta_flete a ON su.id=a.id_suba
        INNER JOIN cmx_estado_subasta_flete b ON a.id=b.id_suba_flete
        AND b.estado IN('pendiente_aprobacion','aprueba_flete_sac','no_aprueba_ge')
        INNER JOIN cmx_vehiculos v ON a.placa=v.placa
        INNER JOIN cmx_proveedores pro ON v.id_conductor=pro.id
        WHERE su.fecha=:valor");
        $sql->bindParam(':valor', $valor, PDO::PARAM_STR);
        $sql->execute();
      }
      $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
      return $resultado;
    } catch (\Throwable $th) {
      $this->_db3->rollBack();
      echo "Error en la transacción: " . $th->getMessage();
    }
  }

  public function Consulta_detalle($id_subasta)
  {
    try {
      $sql = $this->_db3->prepare("SELECT a.num_estudioseguridad, a.placa, 
			a.flete_sugerido AS 'flete_suma', a.flete_propuesto, d.flete AS 'flete_individual',
			ss.numer_solservicio, ser.nombre_cliente, 
			d.total_tarifa, b.estado AS estadoflete, 
			a.id_suba, a.id AS idflete, b.id AS idestadoflete,
			d.id AS parejaorigen, b.acepta_flete, a.tarifa_promedio, CONCAT(pro.nombre,' ',pro.apellido1,' ',pro.apellido2) AS conductor
      FROM cmx_subasta_flete a
      LEFT JOIN cmx_estado_subasta_flete b ON a.id=b.id_suba_flete AND b.estado IN('pendiente_aprobacion','Ganador')
      LEFT JOIN cmx_subasta_solicitud_servicio ss ON a.id_suba_servicio=ss.id
      LEFT JOIN cmx_solicitud_vehiculo2 ser ON ss.numer_solservicio=ser.nundoc_solicitud AND ser.estado_secundario IN('pendiente_aprobacion_sac','no_aprueba_flete_sac','Ganador','aprueba_flete_sac')
      LEFT JOIN cmx_detalle_mercancia2 d ON ser.idpareja_origen_destino=d.id
      LEFT JOIN cmx_vehiculos ve ON a.placa=ve.placa
      LEFT JOIN cmx_proveedores pro ON ve.id_conductor=pro.numdoc_nexos
      LEFT JOIN cmx_estudiov_completo es ON a.num_estudioseguridad=es.id_estudio AND es.estado='Aprobado' AND es.estado_actu=1
      WHERE a.id_suba=:numero_subasta AND a.estado_vigencia=1 GROUP BY ss.numer_solservicio");
      $sql->bindParam(':numero_subasta', $id_subasta, PDO::PARAM_STR);
      $sql->execute();
      $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
      return $resultado;
    } catch (\Throwable $th) {
      $this->_db3->rollBack();
      echo "Error en la transacción: " . $th->getMessage();
    }
  }

  public function Aprueba_flete($flete, $tarifa, $utilidad, $rentabilidad, $subasta, $rta)
  {
    $user = $_SESSION["usuario"]["nom_usuario"];
    if ($rta == 1) {
      $statu = 'Aceptado';
      $estado = 'aprueba_flete_sac';
    } else if ($rta == 0) {
      $statu = 'No aceptado';
      $estado = 'no_aprueba_flete_sac';
    }
    $hora = date('H:i:s');
    $fecha = date('Y-m-d');
    $area = 'SAC';
    $estado_actual = 'pendiente_aprobacion';

    $sql = "INSERT INTO cmx_operacion_subasta(n_subasta,flete_ganador,tarifa_ganador,rentabilidad,utilidad,estado,fecha,hora,usuario,area,estado_letra)
    VALUES(:num_subasta,:flete,:tarifa,:renta,:utili,:estado,:fecha,:hora,:usuario,:area,:estadoletra)";
    $crear_rta = $this->_db3->prepare($sql);
    $crear_rta->bindParam(':num_subasta', $subasta, PDO::PARAM_STR);
    $crear_rta->bindParam(':flete', $flete, PDO::PARAM_STR);
    $crear_rta->bindParam(':tarifa', $tarifa, PDO::PARAM_STR);
    $crear_rta->bindParam(':renta', $rentabilidad, PDO::PARAM_STR);
    $crear_rta->bindParam(':utili', $utilidad, PDO::PARAM_STR);
    $crear_rta->bindParam(':estado', $estado, PDO::PARAM_STR);
    $crear_rta->bindParam(':fecha', $fecha, PDO::PARAM_STR);
    $crear_rta->bindParam(':hora', $hora, PDO::PARAM_STR);
    $crear_rta->bindParam(':usuario', $user, PDO::PARAM_STR);
    $crear_rta->bindParam(':area', $area, PDO::PARAM_STR);
    $crear_rta->bindParam(':estadoletra', $estado, PDO::PARAM_STR);
    $result = $crear_rta->execute();
    if ($result) {
      //actualizar estado en subasta para el flete en tratamiento
      $sql2 = "UPDATE cmx_estado_subasta_flete 
      SET acepta_flete=:statu , estado=:estado 
      WHERE id_suba=:subasta  AND estado=:estado_actual";
      $crear_sql2 = $this->_db3->prepare($sql2);
      $crear_sql2->bindParam(':statu', $statu, PDO::PARAM_STR);
      $crear_sql2->bindParam(':estado', $estado, PDO::PARAM_STR);
      $crear_sql2->bindParam(':subasta', $subasta, PDO::PARAM_STR);
      $crear_sql2->bindParam(':estado_actual', $estado_actual, PDO::PARAM_STR);
      $result2 = $crear_sql2->execute();
      if ($result2) {
        $sql3 = "UPDATE cmx_solicitud_vehiculo2  ser
        INNER JOIN cmx_subasta_solicitud_servicio ss
        ON ser.nundoc_solicitud=ss.numer_solservicio
        INNER JOIN cmx_subasta_flete f
        ON ss.id=f.id_suba_servicio
        INNER JOIN cmx_estado_subasta_flete e
        ON f.id=e.id_suba_flete
        SET ser.estado_secundario=:estado
        WHERE e.id_suba=:subasta";
        $crear_sql3 = $this->_db3->prepare($sql3);
        $crear_sql3->bindParam(':estado', $estado, PDO::PARAM_STR);
        $crear_sql3->bindParam(':subasta', $subasta, PDO::PARAM_STR);
        $result3 = $crear_sql3->execute();
        if ($result3) {
          return 'true';
        } else {
          return 'true';
        }
      }
    }
  }

  public function Aprobacion_Completa($flete, $tarifa, $utilidad, $rentabilidad, $subasta, $rta, $idpareja, $estadotarifa)
  {
    $user = $_SESSION["usuario"]["nom_usuario"];
    if ($rta == 1) {
      $statu = 'Aceptado';
      $estado = 'aprueba_flete_sac';
      $es = 1;
    } else if ($rta == 0) {
      $statu = 'No aceptado';
      $estado = 'no_aprueba_flete_sac';
      $es = 0;
    }
    $hora = date('H:i:s');
    $fecha = date('Y-m-d');
    $area = 'SAC';
    $estado_actual = 'pendiente_aprobacion';
    $responsable = $fecha . ' ' . $hora . ' ' . $user;
    $sql = "INSERT INTO cmx_operacion_subasta(n_subasta,flete_ganador,tarifa_ganador,rentabilidad,utilidad,estado,fecha,hora,usuario,area,estado_letra)
    VALUES(:num_subasta,:flete,:tarifa,:renta,:utili,:estado,:fecha,:hora,:usuario,:area,:estadoletra)";
    $crear_rta = $this->_db3->prepare($sql);
    $crear_rta->bindParam(':num_subasta', $subasta, PDO::PARAM_STR);
    $crear_rta->bindParam(':flete', $flete, PDO::PARAM_STR);
    $crear_rta->bindParam(':tarifa', $tarifa, PDO::PARAM_STR);
    $crear_rta->bindParam(':renta', $rentabilidad, PDO::PARAM_STR);
    $crear_rta->bindParam(':utili', $utilidad, PDO::PARAM_STR);
    $crear_rta->bindParam(':estado', $es, PDO::PARAM_STR);
    $crear_rta->bindParam(':fecha', $fecha, PDO::PARAM_STR);
    $crear_rta->bindParam(':hora', $hora, PDO::PARAM_STR);
    $crear_rta->bindParam(':usuario', $user, PDO::PARAM_STR);
    $crear_rta->bindParam(':area', $area, PDO::PARAM_STR);
    $crear_rta->bindParam(':estadoletra', $estado, PDO::PARAM_STR);
    $result = $crear_rta->execute();
    if ($result) {
      //actualizar estado en subasta para el flete en tratamiento
      $sql2 = "UPDATE cmx_estado_subasta_flete 
      SET acepta_flete=:statu , estado=:estado 
      WHERE id_suba=:subasta  AND estado=:estado_actual";
      $crear_sql2 = $this->_db3->prepare($sql2);
      $crear_sql2->bindParam(':statu', $statu, PDO::PARAM_STR);
      $crear_sql2->bindParam(':estado', $estado, PDO::PARAM_STR);
      $crear_sql2->bindParam(':subasta', $subasta, PDO::PARAM_STR);
      $crear_sql2->bindParam(':estado_actual', $estado_actual, PDO::PARAM_STR);
      $result2 = $crear_sql2->execute();
      if ($result2) {
        $sql3 = "UPDATE cmx_solicitud_vehiculo2 ser
        INNER JOIN cmx_subasta_solicitud_servicio ss
        ON ser.nundoc_solicitud=ss.numer_solservicio
        INNER JOIN cmx_subasta_flete f
        ON ss.id=f.id_suba_servicio
        INNER JOIN cmx_estado_subasta_flete e
        ON f.id=e.id_suba_flete
        SET ser.estado_secundario=:estado
        WHERE e.id_suba=:subasta";
        $crear_sql3 = $this->_db3->prepare($sql3);
        $crear_sql3->bindParam(':estado', $estado, PDO::PARAM_STR);
        $crear_sql3->bindParam(':subasta', $subasta, PDO::PARAM_STR);
        $result3 = $crear_sql3->execute();
        if ($result3) {
          //tarifa
          if ($utilidad >= 15) {
            $estadog = 'Ganador';
            $sql5 = "INSERT INTO cmx_operacion_subasta(n_subasta,flete_ganador,tarifa_ganador,rentabilidad,utilidad,estado,fecha,hora,usuario,area,estado_letra)
            VALUES(:num_subasta,:flete,:tarifa,:renta,:utili,:estado,:fecha,:hora,:usuario,:area,:estadoletra)";
            $crear_rta = $this->_db3->prepare($sql5);
            $crear_rta->bindParam(':num_subasta', $subasta, PDO::PARAM_STR);
            $crear_rta->bindParam(':flete', $flete, PDO::PARAM_STR);
            $crear_rta->bindParam(':tarifa', $tarifa, PDO::PARAM_STR);
            $crear_rta->bindParam(':renta', $rentabilidad, PDO::PARAM_STR);
            $crear_rta->bindParam(':utili', $utilidad, PDO::PARAM_STR);
            $crear_rta->bindParam(':estado', $estado, PDO::PARAM_STR);
            $crear_rta->bindParam(':fecha', $fecha, PDO::PARAM_STR);
            $crear_rta->bindParam(':hora', $hora, PDO::PARAM_STR);
            $crear_rta->bindParam(':usuario', $user, PDO::PARAM_STR);
            $crear_rta->bindParam(':area', $area, PDO::PARAM_STR);
            $crear_rta->bindParam(':estadoletra', $estadog, PDO::PARAM_STR);
            $result5 = $crear_rta->execute();
            if ($result5) {
              $estado_a = 'aprobado_sac';
              $estado_b = 'Ganador';
              $sql6 = "	UPDATE cmx_estado_subasta_flete ef
              INNER JOIN cmx_subasta_flete sf
              ON ef.id_suba_flete=sf.id
              SET 
              ef.estado_sac=:estadoa,
              ef.estado_final=:estadob,
              ef.estado=:estadob,
              sf.tarifa_promedio=:tarifa_final
              WHERE ef.id_suba=:subasta AND ef.estado=:estado_actual";
              $crear_sql6 = $this->_db3->prepare($sql6);
              $crear_sql6->bindParam(':estadoa', $estado_a, PDO::PARAM_STR);
              $crear_sql6->bindParam(':estadob', $estado_b, PDO::PARAM_STR);
              $crear_sql6->bindParam(':tarifa_final', $tarifa, PDO::PARAM_STR);
              $crear_sql6->bindParam(':subasta', $subasta, PDO::PARAM_STR);
              $crear_sql6->bindParam(':estado_actual', $estado, PDO::PARAM_STR);
              $result6 = $crear_sql6->execute();
              if ($result6) {
                $sql7 = "UPDATE cmx_detalle_mercancia2 SET tarifa_subasta=:tarifa_final, responsable_ts=:responsable
               WHERE id=:idpareja";
                $crear_sql7 = $this->_db3->prepare($sql7);
                $crear_sql7->bindParam(':tarifa_final', $tarifa, PDO::PARAM_STR);
                $crear_sql7->bindParam(':responsable', $responsable, PDO::PARAM_STR);
                $crear_sql7->bindParam(':idpareja', $idpareja, PDO::PARAM_STR);
                $result7 = $crear_sql7->execute();
                if ($result7) {
                  $sql8 = "UPDATE cmx_solicitud_vehiculo2
                  SET estado_secundario=:estadob
                  WHERE idpareja_origen_destino=:idpareja";
                  $crear_sql8 = $this->_db3->prepare($sql8);
                  $crear_sql8->bindParam(':estadob', $estado_b, PDO::PARAM_STR);
                  $crear_sql8->bindParam(':idpareja', $idpareja, PDO::PARAM_STR);
                  $result8 = $crear_sql8->execute();
                  if ($result8) {
                    return 'true';
                  } else {
                    return 'false';
                  }
                }
              }
            }
          }
          if ($utilidad < 15) {
            $estadog = 'pendiente_aprobacion_ge';
            $sql5 = "INSERT INTO cmx_operacion_subasta(n_subasta,flete_ganador,tarifa_ganador,rentabilidad,utilidad,fecha,hora,usuario,area,estado_letra)
            VALUES(:num_subasta,:flete,:tarifa,:renta,:utili,:fecha,:hora,:usuario,:area,:estadoletra)";
            $crear_rta = $this->_db3->prepare($sql5);
            $crear_rta->bindParam(':num_subasta', $subasta, PDO::PARAM_STR);
            $crear_rta->bindParam(':flete', $flete, PDO::PARAM_STR);
            $crear_rta->bindParam(':tarifa', $tarifa, PDO::PARAM_STR);
            $crear_rta->bindParam(':renta', $rentabilidad, PDO::PARAM_STR);
            $crear_rta->bindParam(':utili', $utilidad, PDO::PARAM_STR);
            $crear_rta->bindParam(':fecha', $fecha, PDO::PARAM_STR);
            $crear_rta->bindParam(':hora', $hora, PDO::PARAM_STR);
            $crear_rta->bindParam(':usuario', $user, PDO::PARAM_STR);
            $crear_rta->bindParam(':area', $area, PDO::PARAM_STR);
            $crear_rta->bindParam(':estadoletra', $estadog, PDO::PARAM_STR);
            $result5 = $crear_rta->execute();
            if ($result5) {
              $estado_a = 'no_aprobado_sac';
              $estado_b = 'pendiente_aprobacion_ge';
              $sql6 = "	UPDATE cmx_estado_subasta_flete ef
              INNER JOIN cmx_subasta_flete sf
              ON ef.id_suba_flete=sf.id
              SET 
              ef.estado_sac=:estadoa,
              ef.estado_final=:estadob,
              ef.estado=:estadob,
              sf.tarifa_promedio=:tarifa_final
              WHERE ef.id_suba=:subasta AND ef.estado=:estado_actual";
              $crear_sql6 = $this->_db3->prepare($sql6);
              $crear_sql6->bindParam(':estadoa', $estado_a, PDO::PARAM_STR);
              $crear_sql6->bindParam(':estadob', $estado_b, PDO::PARAM_STR);
              $crear_sql6->bindParam(':tarifa_final', $tarifa, PDO::PARAM_STR);
              $crear_sql6->bindParam(':subasta', $subasta, PDO::PARAM_STR);
              $crear_sql6->bindParam(':estado_actual', $estado, PDO::PARAM_STR);
              $result6 = $crear_sql6->execute();
              if ($result6) {
                $sql7 = "UPDATE cmx_detalle_mercancia2 SET tarifa_subasta=:tarifa_final, responsable_ts=:responsable
                WHERE id=:idpareja";
                $crear_sql7 = $this->_db3->prepare($sql7);
                $crear_sql7->bindParam(':tarifa_final', $tarifa, PDO::PARAM_STR);
                $crear_sql7->bindParam(':responsable', $responsable, PDO::PARAM_STR);
                $crear_sql7->bindParam(':idpareja', $idpareja, PDO::PARAM_STR);
                $result7 = $crear_sql7->execute();
                if ($result7) {
                  $sql8 = "UPDATE cmx_solicitud_vehiculo2
                  SET estado_secundario=:estadob
                  WHERE idpareja_origen_destino=:idpareja";
                  $crear_sql8 = $this->_db3->prepare($sql8);
                  $crear_sql8->bindParam(':estadob', $estado_b, PDO::PARAM_STR);
                  $crear_sql8->bindParam(':idpareja', $idpareja, PDO::PARAM_STR);
                  $result8 = $crear_sql8->execute();
                  if ($result8) {
                    return 'true';
                  } else {
                    return 'false';
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
