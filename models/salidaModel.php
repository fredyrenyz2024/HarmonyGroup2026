<?php
session_start();
class salidaModel extends Model
{

	public function __construct(){
			parent::__construct();
	}

	public function getPruebas(){
		$sql="";
		$result = $this->_db->getConsulta($sql);
		return $result;
	}

	public function Buscar_Manifiesto(){
		try{
			$fecha=date('Y-m-d');	
			$sql="SELECT 
				DISTINCT o.manifiesto, 
				ma.id AS n_manifiesto, i.id AS plan, ma.placa
				FROM cmx_cargue_ordenes o
				INNER JOIN cmx_manifiesto ma
				ON ma.id=o.manifiesto
				INNER JOIN cmx_inicio_ruta i
				ON ma.id=i.num_manifiesto
				LEFT JOIN cmx_salida_vehiculo sal
				ON ma.id=sal.num_manifiesto
				WHERE  o.proceso = 2
				AND sal.num_manifiesto IS NULL";
			$resultado=$this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		}catch(PDOExeption $e){
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}


	public function Consulta_Datos($mnf){
		try{
			$fecha=date('Y-m-d');	
			$sql="	
			SELECT  mn.id AS num_manifiesto, 
				mn1.municipio AS mnorigen, mn1.depto AS mndepto, mn2.municipio AS mn2origen, mn2.depto AS mn2depto,
				mn1.rndc_codigo_ciudad AS origennum, mn2.rndc_codigo_ciudad AS destinonum,
				mn.placa, pro.nombre, pro.apellido1, pro.apellido2,
				pro.numero_documento ,pro.celular, tra.placa AS trailer, mak.marca,
				line.descripcion AS linea, ceria.descripcion AS tipo_carroceria, ve.web_satelital, 
				b.cod_plan, pl.nombre_plan, b.fechasalida, b.horasalida,
				mn.Lugar
			FROM cmx_manifiesto mn
			INNER JOIN cmx_manifiesto_estado me
			ON mn.id=me.id_manifiesto
			INNER JOIN cmx_municipios mn1
			ON mn.origen_viaje=mn1.id
			INNER JOIN cmx_municipios mn2
			ON mn.destino_viaje=mn2.id
			INNER JOIN cmx_proveedores pro
			ON pro.numero_documento=mn.conductor_manifiesto
			INNER JOIN cmx_detalle_conductor dc
			ON pro.id=dc.id_proveedor
			INNER JOIN cmx_vehiculos ve
			ON mn.placa=ve.placa
			INNER JOIN cmx_vehiculo2 ve2
			ON ve.id=ve2.id_vehiculo
			INNER JOIN cmx_rndc_vehiculos_carroceria ceria
			ON ve.tipo_carroceria=ceria.id
			INNER JOIN cmx_rndc_vehiculos_marcas mak	
			ON ve2.marca=mak.id
			INNER JOIN cmx_rndc_vehiculos_linea line
			ON ve2.linea=line.id
			INNER JOIN cmx_rndc_clase_vehiculo cla
			ON cla.id=ve2.clase_vehiculo
			LEFT JOIN cmx_trailer_vehiculo ti
			ON ve.id=ti.id_vehiculo
			LEFT JOIN cmx_trailer tra
			ON ti.id_trailer=tra.id AND ti.estado=1
			INNER JOIN cmx_inicio_ruta b
			ON mn.id = b.num_manifiesto
			INNER JOIN cmx_plan_ruta pl
			ON b.cod_plan=pl.id
			WHERE 
			mn.id=".$mnf." AND
			me.estado=1";
			$resultado=$this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetch();
		}catch(PDOExeption $e){
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function Consulta_Remesas($mnf){
		try{
			/*$sql="SELECT rem.id, ro.id_orden_cargue,
			b.tipo_mercancia, b.cantidad_empaque,
			emp.empaque,
			cli.nombre AS remitente,
			clid.nombre AS destinatario,
			rem.fecha_creacion
			FROM cmx_remesa  rem
			INNER JOIN cmx_manifiesto_remesa mnf
			ON rem.id=mnf.id_remesa
			LEFT JOIN cmx_remesa_ordencargue ro
			ON rem.id=ro.id_remesa
			LEFT JOIN cmx_orden_cargue oc
			ON ro.id_orden_cargue=oc.id
			INNER JOIN cmx_ruta_puntosentrega rr
			ON oc.id_remitente=rr.id
			INNER JOIN cmx_remitente_destinatario cli
			ON rr.cliente=cli.id
			INNER JOIN cmx_ruta_puntosentrega rd
			ON rem.id_destinatario=rd.id
			INNER JOIN cmx_remitente_destinatario clid
			ON rd.cliente=clid.id	
			LEFT JOIN cmx_solicitud_vehiculo2 ser
			ON oc.mer_idservicio=ser.id
			LEFT JOIN cmx_detalle_mercancia2 b
			ON ser.idpareja_origen_destino=b.id
			LEFT JOIN cmx_para_tipo_empaque emp
			ON b.tipo_empaque=emp.id
			WHERE mnf.id_manifiesto=".$mnf;*/

			$sql="SELECT rem.id, ro.id_orden_cargue,
			b.tipo_mercancia, b.cantidad_empaque,
			emp.empaque,
			cli.nombre AS remitente,
			clid.nombre AS destinatario,
			rem.fecha_creacion
			FROM cmx_remesa  rem
			INNER JOIN cmx_manifiesto_remesa mnf
			ON rem.id=mnf.id_remesa
			LEFT JOIN cmx_remesa_ordencargue ro
			ON rem.id=ro.id_remesa
			LEFT JOIN cmx_orden_cargue oc
			ON ro.id_orden_cargue=oc.id
			INNER JOIN cmx_ruta_puntosentrega rr
			ON oc.id_remitente=rr.id
			INNER JOIN cmx_remitente_destinatario cli
			ON rr.cliente=cli.id
			INNER JOIN cmx_destinatarios_ss rd
			ON rem.id_destinatario=rd.id
			INNER JOIN cmx_remitente_destinatario clid
			ON rd.cliente=clid.id	
			LEFT JOIN cmx_solicitud_vehiculo2 ser
			ON oc.mer_idservicio=ser.id
			LEFT JOIN cmx_detalle_mercancia2 b
			ON ser.idpareja_origen_destino=b.id
			LEFT JOIN cmx_para_tipo_empaque emp
			ON b.tipo_empaque=emp.id
			WHERE mnf.id_manifiesto=".$mnf;
			$resultado=$this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		}catch(PDOExeption $e){
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}

	}


	public function Consulta_Remesas_llegada($mnf){
		try{
			
			$sql="SELECT rem.id, ro.id_orden_cargue,
			b.tipo_mercancia, b.cantidad_empaque,
			emp.empaque,
			cli.nombre AS remitente,
			clid.nombre AS destinatario,
			rem.fecha_creacion
			FROM cmx_remesa  rem
			INNER JOIN cmx_manifiesto_remesa mnf
			ON rem.id=mnf.id_remesa
			LEFT JOIN cmx_remesa_ordencargue ro
			ON rem.id=ro.id_remesa
			LEFT JOIN cmx_orden_cargue oc
			ON ro.id_orden_cargue=oc.id
			INNER JOIN cmx_ruta_puntosentrega rr
			ON oc.id_remitente=rr.id
			INNER JOIN cmx_remitente_destinatario cli
			ON rr.cliente=cli.id
			INNER JOIN cmx_destinatarios_ss rd
			ON rem.id_destinatario=rd.id
			INNER JOIN cmx_remitente_destinatario clid
			ON rd.cliente=clid.id	
			LEFT JOIN cmx_solicitud_vehiculo2 ser
			ON oc.mer_idservicio=ser.id
			LEFT JOIN cmx_detalle_mercancia2 b
			ON ser.idpareja_origen_destino=b.id
			LEFT JOIN cmx_para_tipo_empaque emp
			ON b.tipo_empaque=emp.id
			LEFT JOIN cmx_descargue_remesas dr
			ON rem.id=dr.remesa 
			WHERE mnf.id_manifiesto=".$mnf."
			AND dr.remesa IS NULL";
			$resultado=$this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		}catch(PDOExeption $e){
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}

	}

	public function Insertar_Salida($manifi,$orig,$desti,$placa,$condu,$celular,$trail,$marca,$line,$carroc,$gps,$agenci,$plan,$fec1,$hora1,$fec2,$hora2,$observa,$num_ori,$num_des,$documento_condu,$numdetalle,$nomdetalle){
		$resultado= $this->_db2->conectar();
		$factual=date('Y-m-d');
		$horactual=date('H:i:s');
		$id_usuario = $_SESSION["usuario"]["nom_usuario"];
		//santizar
		(int) $manifi;
		(int) $celular;
		(int) $num_ori;
		(int) $num_des;
		(int) $documento_condu;

		try{
			$sqlm="select numero_actual from cmx_maestro 
					where tipo='SAL' and numero_actual>=numero_inicial
					and numero_actual<=numero_final ";
			$number=$resultado->query($sqlm);
			$number1=$number->fetch();
			$number2=$number1['numero_actual'];

			$resultado->prepare("insert into cmx_salida_vehiculo(id,num_manifiesto,origen,destino,conductor,documento_conductor,telefono,placa,placa_trailer,marca,linea,carroceria,gps,agencia,cod_plan_ruta,fecha_salida,hora_salida,fecha_tentativa,hora_tentativa,observacion,usuario,fecha,hora,estado,origen_num,destino_num,detalle_ruta,detalle_ruta_nom)
				values(:num_salida,:mnf,:orig,:dest,:condu,:doc_condu,:celular,:placa,:trailer,:marca,:linea,:carroce,:gps,:agencia,:plan_ruta,:fecha_pro,:hora_pro,:fecha_tenta,:hora_tenta,:obs,:user,:fecha,:hora,:statu,:num_origen,:num_destino,:num_detalle,:nom_detalle)")->execute(
				array(
					':num_salida'=>$number2,
					':mnf'=>$manifi,
					':orig'=>$orig,
					':dest'=>$desti,
					':condu'=>$condu,
					':celular'=>$celular,
					':placa'=>$placa,
					':trailer'=>$trail,
					':marca'=>$marca,
					':linea'=>$line,
					':carroce'=>$carroc,
					':gps'=>$gps,
					':agencia'=>$agenci,
					':plan_ruta'=>$plan,
					':fecha_tenta'=>$fec1,
					':hora_tenta'=>$hora1,
					':fecha_pro'=>$fec2,
					':hora_pro'=>$hora2,
					':obs'=>$observa,
					':user'=>$id_usuario,
					':fecha'=>$factual,
					':hora'=>$horactual,
					':statu'=>1,
					':doc_condu'=>$documento_condu,
					':num_origen'=>$num_ori,
					':num_destino'=>$num_des,
					':num_detalle'=>$numdetalle,
					':nom_detalle'=>$nomdetalle
				)
			);

			if($resultado){
				//registrar estado
				$resultado->prepare("insert into cmx_estado_salida_vehiculo
					(id,id_salida,estado,fecha,hora,usuario)
					values(:id,:num_salida,:estado,:fecha,:hora,:user)")->execute(
					array(
						':id'=>null,
						':num_salida'=>$number2,
						':estado'=>1,
						':fecha'=>$factual,
						':hora'=>$horactual,
						':user'=>$id_usuario
					)
				);
			}	

			$operacion=($number2+1);
			$resultado->prepare('update cmx_maestro set 
			numero_actual=:numero
			where tipo=:tipo')->execute(
				array(
				':numero'=>$operacion,
				':tipo'=>'SAL'
				)
			);

			return 'true';

		}catch(PDOExeption $e){
			$error = $e->getMessage();
			$this->_db2->rollBack();
			return 'false';
		}
	}

	public function Consulta_Tabla($filtro,$mnf,$fec1,$fec2,$plaq){
		try{
			if($filtro==1){//fecha
				$sql="SELECT sal.* 
				FROM cmx_salida_vehiculo sal
				WHERE sal.fecha  
				BETWEEN '".$fec1."' AND '".$fec2."'";
			}
			if($filtro==2){//Manifiesto
				$sql="SELECT sal.* 
				FROM cmx_salida_vehiculo sal
				WHERE sal.num_manifiesto=".$mnf;
			}
			if($filtro==3){//placa
				$sql="SELECT sal.* 
				FROM cmx_salida_vehiculo sal
				WHERE sal.placa='".$plaq."'";
			}
			$resultado=$this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		}catch(PDOExeption $e){
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}


	public function Consulta_Salida_Invidual($id_salida){
		try{
			$sql="SELECT sal.* 
			FROM cmx_salida_vehiculo sal
			INNER JOIN cmx_estado_salida_vehiculo salest
			ON sal.id=salest.id_salida
			WHERE sal.id=".$id_salida;
			$resultado=$this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetch();
		}catch(PDOExeption $e){
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function Anula_Salida($id_salida){
		try{
			$resultado= $this->_db2->conectar();
			$factual=date('Y-m-d');
			$horactual=date('H:i:s');
			$usuario = $_SESSION["usuario"]["nom_usuario"];

			$resultado->prepare('update cmx_salida_vehiculo set 
						estado=:esta
						where id=:num_salida
				')->execute(
				array(
					':esta'=>0,
					':num_salida'=>$id_salida
				)
			);
			if($resultado){
				$resultado->prepare("insert into cmx_estado_salida_vehiculo
					(id,id_salida,estado,fecha,hora,usuario)
					values(:id,:num_salida,:estado,:fecha,:hora,:user)")->execute(
					array(
						':id'=>null,
						':num_salida'=>$id_salida,
						':estado'=>0,
						':fecha'=>$factual,
						':hora'=>$horactual,
						':user'=>$usuario
					)
				);
			}	
			return 'true';
		}catch(PDOExeption $e){
			$error = $e->getMessage();
			$this->_db2->rollBack();
			return 'false';
		}
	}


	public function Actualiza_Salida($num_salida,$num_mani,$fechapro,$horapro,$obs){
		try{
			$resultado= $this->_db2->conectar();
			$factual=date('Y-m-d');
			$horactual=date('H:i:s');
			$usuario = $_SESSION["usuario"]["nom_usuario"];
			$resultado->prepare('update cmx_salida_vehiculo set
				fecha_salida=:fecha,
				hora_salida=:hora,
				observacion=:observa
				where id=:salida
				')->execute(
				array(
					':salida'=>$num_salida,
					':fecha'=>$fechapro,
					':hora'=>$horapro,
					':observa'=>$obs
				)
			);
			if($resultado){
				return 'true';
			}else{
				return 'false';
			}		
		}catch(PDOExeption $e){
			$error = $e->getMessage();
			$this->_db2->rollBack();
			return 'false';
		}
	}

	public function Manifiesto_Salida(){
		try{
			$fecha=date('Y-m-d');	
			/*$sql="
			SELECT ma.id AS n_manifiesto, ma.placa, i.id AS salida
			FROM cmx_salida_vehiculo s 
			INNER JOIN cmx_manifiesto ma
			ON s.num_manifiesto=ma.id 
			INNER JOIN cmx_inicio_ruta i
			ON ma.id=i.num_manifiesto
			LEFT JOIN cmx_llegada_vehiculo ll ON s.id = ll.id_salida 
			WHERE ll.id_salida IS NULL";*/

			$sql="SELECT DISTINCT  ma.id AS n_manifiesto, ma.placa, i.id AS salida
			FROM cmx_salida_vehiculo s 
			INNER JOIN cmx_manifiesto ma 
			ON s.num_manifiesto=ma.id 
			INNER JOIN cmx_inicio_ruta i
			ON ma.id=i.num_manifiesto 
			INNER JOIN cmx_manifiesto_remesa r ON ma.id = r.id_manifiesto 
			AND r.estado = 1 
			LEFT JOIN cmx_llegada_vehiculo ll ON s.num_manifiesto = ll.num_manifiesto 
			LEFT JOIN cmx_tiempo_descargue_rem td ON r.id_remesa = td.id_remesa
			WHERE td.id_remesa IS NULL";
			$resultado=$this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		}catch(PDOExeption $e){
			$error = $e->getMessage();
			$this->_db2->rollBack();
			return 'false';
		}
	}

	public function Consulta_Datos_Salida($mnf){
		try{
			$fecha=date('Y-m-d');	
			$sql="	
			SELECT sal.num_manifiesto, sal.origen, sal.destino, sal.conductor,
			sal.documento_conductor,sal.telefono, sal.placa, 
			sal.placa_trailer, sal.marca, sal.linea, 
			sal.carroceria, sal.GPS, sal.agencia, 
			sal.fecha_salida, sal.hora_salida,
			sal.fecha_tentativa, 
			sal.hora_tentativa,
			sal.observacion,
			sal.fecha, sal.hora, 
			sal.detalle_ruta_nom,
			sal.origen_num,
			sal.destino_num,
			sal.cod_plan_ruta,
			sal.detalle_ruta,
			sal.id as idsalida
			FROM cmx_salida_vehiculo sal
			WHERE sal.num_manifiesto=".$mnf."
			AND sal.estado=1
			";
			$resultado=$this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetch();
		}catch(PDOExeption $e){
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}


	public function Insertar_LLegada($salida,$fechapro,$horaprog,$observacion,$nummanifi,$placa,$conductor,$remi,$idtiempo){
		try{
			$resultado= $this->_db2->conectar();
			$factual=date('Y-m-d');
			$horactual=date('H:i:s');
			$usuario = $_SESSION["usuario"]["nom_usuario"];

			$sqlm="select numero_actual from cmx_maestro 
					where tipo='LLEG' and numero_actual>=numero_inicial
					and numero_actual<=numero_final ";
			$number=$resultado->query($sqlm);
			$number1=$number->fetch();
			$number3=$number1['numero_actual'];

			$insertllegada=$resultado->prepare('insert into cmx_llegada_vehiculo(id,id_salida,fecha_llegada,hora_llegada,observacion,placa,
				doc_conductor,num_manifiesto,estado,fecha,hora,usuario)
				values(:id,:idsalida,:fechapro,:horaprog,:observacion,:placa,:conductor,:nummanifi,:statu,:fecha_creacion,:hora_creacion,:user)
				')->execute(
				array(
					':id'=>$number3,
					':idsalida'=>$salida,
					':fechapro'=>$fechapro,
					':horaprog'=>$horaprog,
					':observacion'=>$observacion,
					':nummanifi'=>$nummanifi,
					':placa'=>$placa,
					':conductor'=>$conductor,
					':statu'=>1,
					':fecha_creacion'=>$factual,
					':hora_creacion'=>$horactual,
					':user'=>$usuario
				)
			);

			if($insertllegada){
				$resultado->prepare('insert into cmx_estado_llegada(id,id_llegada,estado,usuario,fecha,hora)
					values(:id,:id_llegada,:estado,:usuario,:fecha,:hora)')->execute(
					array(
						':id'=>null,
						':estado'=>1,
						':id_llegada'=>$number3,
						':usuario'=>$usuario,
						':fecha'=>$factual,
						':hora'=>$horactual
					)
				);



				//REGISTRAR TIEMPOS DE LLEGADA AL DESCARGUE	

				if($idtiempo!=null && $idtiempo!=''){//ya hay un número de tiempo
					$number2=$idtiempo;
					$valor=str_replace (',',' ',$remi);
					$datos=explode(' ',$valor);
					$i=0;
					for ($i=0;$i<count($datos);$i++){
						$numero_rem=$datos[$i];
						//registrar remesa-llegada
							//REGISTRO DE TIEMPO LOGISTICO DE DESCRAGUE - FECHA DE LLEGADA AL DESCARGUE (es el primer tiempo a registrar)
						$resultado->prepare('insert into cmx_tiempo_descargue_rem
							(id,id_descargue,id_remesa,fecha_descargue,hora_descargue,obs_descargue,tipo_fecha,id_llegada,fecha_registro,hora_registro,usuario,estado)values(:id,:id_tabla,:id_reme,:fecd,:hord,:obsd,:clase,:idllegada,:fechareg,:horareg,:userreg,:statu)')->execute(
							array(
								':id'=>null,
								':id_tabla'=>$number2,
								':id_reme'=>$numero_rem,
								':fecd'=>$fechapro,
								':hord'=>$horaprog,
								':obsd'=>$observacion,
								':clase'=>'fec_llegada',
								':fechareg'=>$factual,
								':horareg'=>$horactual,
								':userreg'=>$usuario,
								':statu'=>1,
								':idllegada'=>$number3
							));

						$resultado->prepare('insert into cmx_descargue_remesas
							(id,remesa,manifiesto,f_lleg,proceso)
							values(:id,:remesa,:mnf,:f_lleg,:proceso)')->execute(
						array(
							':id'=>null,
							':remesa'=>$numero_rem,
							':mnf'=>$nummanifi,
							':f_lleg'=>1,
							':proceso'=>1
						));	

					}
				}else{

					$sqlm="select numero_actual from cmx_maestro 
					where tipo='TIM_DESCAR' and numero_actual>=numero_inicial
					and numero_actual<=numero_final";
					$number=$resultado->query($sqlm);
					$number1=$number->fetch();
					$number2=$number1['numero_actual'];

					$valor=str_replace (',',' ',$remi);
					$datos=explode(' ',$valor);


					$resultado->prepare("insert into cmx_tiempo_descargue
					(id,num_manifiesto,placa,fecha,hora,usuario,estado)
					values(:id,:mani,:plak,:fecha,:hora,:user,:statu)")
					->execute(
					array(
						':id'=>$number2,
						':mani'=>$nummanifi,
						':plak'=>$placa,
						':fecha'=>$factual,
						':hora'=>$horactual,
						':user'=>$usuario,
						':statu'=>1
						)
					);

					if($resultado){
						$i=0;
						for ($i=0;$i<count($datos);$i++){
							$numero_rem=$datos[$i];

							$resultado->prepare('insert into cmx_tiempo_descargue_rem
							(id,id_descargue,id_remesa,fecha_descargue,hora_descargue,obs_descargue,tipo_fecha,id_llegada,fecha_registro,hora_registro,usuario,estado)values(:id,:id_tabla,:id_reme,:fecd,:hord,:obsd,:clase,:idllegada,:fechareg,:horareg,:userreg,:statu)')->execute(
							array(
								':id'=>null,
								':id_tabla'=>$number2,
								':id_reme'=>$numero_rem,
								':fecd'=>$fechapro,
								':hord'=>$horaprog,
								':obsd'=>$observacion,
								':clase'=>'fec_llegada',
								':fechareg'=>$factual,
								':horareg'=>$horactual,
								':userreg'=>$usuario,
								':statu'=>1,
								':idllegada'=>$number3
							));

							$resultado->prepare('insert into cmx_descargue_remesas
							(id,remesa,manifiesto,f_lleg,proceso)
							values(:id,:remesa,:mnf,:f_lleg,:proceso)')->execute(
							array(
								':id'=>null,
								':remesa'=>$numero_rem,
								':mnf'=>$nummanifi,
								':f_lleg'=>1,
								':proceso'=>1
							));	

						}
					}

					$operacion=($number2+1);
					$resultado->prepare('update cmx_maestro set 
						numero_actual=:numero
						where tipo=:tipo')->execute(
							array(
							':numero'=>$operacion,
							':tipo'=>'TIM_DESCAR'
						)
					);

					
				}//cierre del else	

			}		

			$operacion=($number3+1);
			$resultado->prepare('update cmx_maestro set 
			numero_actual=:numero
			where tipo=:tipo')->execute(
				array(
				':numero'=>$operacion,
				':tipo'=>'LLEG'
				)
			);

			return 'true';	

		}catch(PDOExeption $e){
			$error = $e->getMessage();
			$this->_db2->rollBack();
			return 'false';
		}
	}


	public function Consulta_LLegadas($filtro,$mnf,$fec1,$fec2,$placa){
		try{

			if($filtro==1){
				$sql="SELECT l.* FROM 
				cmx_llegada_vehiculo l
				WHERE l.fecha_llegada BETWEEN '".$fec1."' AND '".$fec2."'";
			}

			if($filtro==2){
				$sql="SELECT l.* FROM cmx_llegada_vehiculo l
				WHERE l.num_manifiesto=".$mnf;
			}

			if($filtro==3){
				$sql="SELECT l.* FROM cmx_llegada_vehiculo l
				WHERE l.placa='".$placa."'";
			}	
			$resultado=$this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetchall();
		}catch(PDOExeption $e){
			$error = $e->getMessage();
			$this->_db3->rollBack();
		}
	}

	public function Consulta_LLegada_Sola($idllegada){
		try{
			$sql="SELECT a.num_manifiesto, b.origen, b.destino,
				b.placa, b.conductor, b.telefono, 
				b.placa_trailer, b.marca, b.linea,
				b.carroceria, b.GPS, b.agencia, 
				b.detalle_ruta_nom, a.fecha_llegada,
				a.hora_llegada, a.observacion, a.id_salida,
				a.id 
				FROM cmx_llegada_vehiculo a
				INNER JOIN cmx_salida_vehiculo b
				ON a.id_salida=b.id
				WHERE a.id=".$idllegada;
			$resultado=$this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetch();
		}catch(PDOExeption $e){
			$error = $e->getMessage();
			$this->_db2->rollBack();
			return 'false';
		}
	}

	public function Actualiza_LLegada($id_lleg,$id_sal,$manifi,$fecha_llega,$hora_llega,$observ_llega){
		try{
			$resultado= $this->_db2->conectar();
			$factual=date('Y-m-d');
			$horactual=date('H:i:s');
			$usuario = $_SESSION["usuario"]["nom_usuario"];

			$resultado->prepare('update cmx_llegada_vehiculo
				set 
				fecha_llegada=:fecha_l,
				hora_llegada=:hora_l,
				observacion=:observa
				where 
				id=:id
				AND num_manifiesto=:manifiesto
				AND id_salida=:id_sal
				')->execute(
				array(
					':fecha_l'=>$fecha_llega,
					':hora_l'=>$hora_llega,
					':observa'=>$observ_llega,
					':id'=>$id_lleg,
					':manifiesto'=>$manifi,
					':id_sal'=>$id_sal
				));
			return 'true';		
		}catch(PDOExeption $e){
			$error = $e->getMessage();
			$this->_db2->rollBack();
			return 'false';
		}
	}


	public function Anula_llegada($id_llegada){
		try{
			$resultado= $this->_db2->conectar();
			$factual=date('Y-m-d');
			$horactual=date('H:i:s');
			$usuario = $_SESSION["usuario"]["nom_usuario"];

			$anula=$resultado->prepare("update cmx_llegada_vehiculo
				set estado=:statu
				where id=:id_ll
				")->execute(
				array(
					':statu'=>0,
					':id_ll'=>$id_llegada,
				));
			if($anula){
				$resultado->prepare('insert into cmx_estado_llegada
					(id,id_llegada,estado,usuario,fecha,hora)
					values(:id,:id_llegada,:estado,:user,:fech,:hora)
					')->execute(
					array(
						':id'=>null,
						':id_llegada'=>$id_llegada,
						':estado'=>0,
						':user'=>$usuario,
						':hora'=>$horactual,
						':fech'=>$factual
					)
				);
				return 'true';	
			}	

		}catch(PDOExeption $e){
			$error = $e->getMessage();
			$this->_db2->rollBack();
			return 'false';	
		}
	}

	public function Buscar_Idtiempo($mnf){
		try{
			$sql="SELECT id FROM cmx_tiempo_descargue
				WHERE num_manifiesto=".$mnf;
			$resultado=$this->_db3->query($sql);
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			return $resultado->fetch();
		}catch(PDOExeption $e){
			$error = $e->getMessage();
			$this->_db2->rollBack();
			return 'false';
		}
	}






}
?>