<?php 

 	class servicio_especialModel extends Model{

 		public function __construct(){
			parent::__construct();
		}

		public function Consulta_Tabla($tipo_doc,$numdoc){
			try{
				if($tipo_doc=='cot'){
					$sql="SELECT id, estado
					FROM cmx_cotizaciones_serviciocliente
					WHERE id=".$numdoc;
				}
				if($tipo_doc=='ss'){
					$sql="SELECT a.id, a.estado
						FROM cmx_solicitud_vehiculo2 a
						INNER JOIN cmx_detalle_mercancia2 b
						ON a.idpareja_origen_destino=b.id
						WHERE a.id=".$numdoc;
				}
				if($tipo_doc=='oc'){
					$sql="SELECT id,estado 
						FROM cmx_orden_cargue
						WHERE id=".$numdoc;
				}

				if($tipo_doc=='rm'){
					$sql="SELECT id,estado 
					FROM cmx_remesa
					WHERE id=".$numdoc;	
				}

				if($tipo_doc=='mnf'){
					$sql="SELECT id, estadomnf_actual AS estado
						FROM cmx_manifiesto
						WHERE id=".$numdoc;
				}

				$resultado=$this->_db3->query($sql);
				$resultado->setFetchMode(PDO::FETCH_ASSOC);
				return $resultado->fetch();
			}catch(PDOException $e){
				$error = $e->getMessage();
				$this->_db3->rollBack();
			}
		}

		public function Consulta_Servicios(){
			try{
				$sql='SELECT * FROM 
					cmx_para_tipo_sevicio 
					WHERE tipificacion="Especial"
					 AND estado="activo"';
				$resultado=$this->_db3->query($sql);
				$resultado->setFetchMode(PDO::FETCH_ASSOC);
				return $resultado->fetchall();
			}catch(PDOException $e){
				$error = $e->getMessage();
				$this->_db3->rollBack();
			}
		}

		public function valor_servicio($servicio){
			try{
				$sql="SELECT costo FROM cmx_para_tipo_sevicio WHERE nombre='".$servicio."'";
				$resultado=$this->_db3->query($sql);
				$resultado->setFetchMode(PDO::FETCH_ASSOC);
				return $resultado->fetch();
			}catch(PDOException $e){
				$error = $e->getMessage();
				$this->_db3->rollBack();
			}
		}


		public function pareja_servicio($numero,$tipo){
			try{
				if($tipo==1){
					$sql="SELECT id, tipo_mercancia 
					FROM cmx_detalle_mercancia2 
					WHERE n_cotizacion=".$numero;
				}
				if($tipo==2){
					$sql="SELECT b.id, b.tipo_mercancia 
						FROM cmx_solicitud_vehiculo2 a
						INNER JOIN cmx_detalle_mercancia2 b
						ON a.idpareja_origen_destino=b.id
						WHERE a.id=".$numero;
				}
				if($tipo==3){
					$sql="SELECT se.idpareja_origen_destino AS id, de.tipo_mercancia
					FROM cmx_orden_cargue oc
					INNER JOIN cmx_solicitud_vehiculo2 se
					ON oc.mer_idservicio=se.id
					INNER JOIN cmx_detalle_mercancia2 de
					ON se.idpareja_origen_destino=de.id
					WHERE oc.id=".$numero;
				}

				if($tipo==4){
					$sql="SELECT a.idpareja_origen_destino AS id, 
						d.tipo_mercancia
						FROM cmx_remesa re
						INNER JOIN cmx_solicitud_vehiculo2 a
						ON re.mer_idservicio=a.id
						INNER JOIN cmx_detalle_mercancia2 d
						ON a.idpareja_origen_destino=d.id
						WHERE re.id=".$numero;
				}

				if($tipo==5){
					$sql="SELECT a.idpareja_origen_destino AS id, 
						d.tipo_mercancia
						FROM cmx_manifiesto ma
						INNER JOIN cmx_manifiesto_remesa mr
						ON ma.id=mr.id_manifiesto
						INNER JOIN cmx_remesa re
						ON mr.id_remesa=re.id
						INNER JOIN cmx_solicitud_vehiculo2 a
						ON re.mer_idservicio=a.id
						INNER JOIN cmx_detalle_mercancia2 d
						ON a.idpareja_origen_destino=d.id
						WHERE ma.id=".$numero;
				}

				$resultado=$this->_db3->query($sql);
				$resultado->setFetchMode(PDO::FETCH_ASSOC);
				return $resultado->fetchall();	
			}catch(PDOException $e){
				$error = $e->getMessage();
				$this->_db3->rollBack();
			}
		}

	public function registra_servicio($tipo,$cant,$costo,$tarifa,$costototal,$tarifatotal,$rentabi,$utilidad,$conexion){
			$resultado= $this->_db2->conectar();
			try{
				/*$sql="INSERT INTO cmx_detalle_servespecial2(id,tipo_servicio,cantidad,valor_unitario,total_servicio,tarifa,utilidad,rentabilidad,tarifa_unitaria,idpareja,estado)
				VALUES(null,'".$tipo."','".$cant."','".$costo."','".$costototal."','".$tarifatotal."','".$utilidad."','".$rentabi."','".$tarifa."','".$conexion."','Activo')";*/
				$resultado->prepare("insert into cmx_detalle_servespecial2
					(id,tipo_servicio,cantidad,valor_unitario,total_servicio,tarifa,utilidad,rentabilidad,tarifa_unitaria,id_pareja,estado)values(:id,:tipo,:canti,:costo,:totals,:tarifat,:util,:renta,:tariuni,:pareja,:estado)")->execute(
					array(
						':id'=>null,
						':tipo'=>$tipo,
						':canti'=>$cant,
						':costo'=>$costo,
						':totals'=>$costototal,
						':tarifat'=>$tarifatotal,
						':util'=>$utilidad,
						':renta'=>$rentabi,
						':tariuni'=>$tarifa,
						':pareja'=>$conexion,
						':estado'=>'Activo'
					));
					if($resultado){
						return true;
					}else{
						return false;
					}
			}catch(PDOException $e){
				$error = $e->getMessage();
				$this->_db3->rollBack();
			}
		}

		
		

 	}



?>