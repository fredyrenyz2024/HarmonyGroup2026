<?php
date_default_timezone_set('America/Bogota');

class Crud 
{
    public $insertInto;
    public $insertcolumnas;
    public $insertValues;
    public $select;
    public $from;
    public $condicion;
    public $rows;
    public $mensaje;
    public $update;
    public $set;
    public $deletefrom;
    public function Crear() {
        $model= new Conexion;
        $conexion= $model->conectar();
        $insertInto= $this->insertInto;
        $insertColumnas= $this->insertcolumnas;
        $insertValues=  $this->insertValues;
        $sql="INSERT INTO $insertInto VALUES ($insertValues)";
        $consulta=$conexion->prepare($sql);
        if (!$consulta) {
        $this->mensaje="BAD".$sql;}
        else{    
            $consulta->execute();
            $this->mensaje="GOOD";
        }
    }
    public function Leer() {
        $model= new Conexion;
        $conexion= $model->conectar();
        $select= $this->select;
        $from= $this->from;
        $condicion=  $this->condicion;
        if ($condicion!=''){
            $condicion=" WHERE ".$condicion;
        }
        $sql="SELECT $select FROM $from $condicion";
        $consulta=$conexion->prepare($sql);
           $consulta->execute();
           while ($filas =$consulta->fetch()){
            $this->rows[]=$filas;
        }
    $this->mensaje="GOOD";
    }
    public function actualizar(){
        $model= new Conexion;
        $conexion= $model->conectar();
        $update=$this->update;
        $set=$this->set;
        $condicion=  $this->condicion;
        if ($condicion!=''){
            $condicion=" WHERE ".$condicion;
        }
         $sql="UPDATE $update set $set $condicion";
          $this->mensaje=$sql;
         $consulta=$conexion->prepare($sql);
         if (!$consulta) {
        $this->mensaje="BAD";}
       else{    
            $consulta->execute();
        $this->mensaje="GOOD";}
    }
    public function eliminar(){
        $model= new Conexion;
        $conexion = $model->conectar();
        $deletefrom =$this->deletefrom;
        $condicion=  $this->condicion;
        if ($condicion!=''){
            $condicion=" WHERE ".$condicion;
        }
         $sql="DELETE FROM $deletefrom $condicion";
         $consulta=$conexion->prepare($sql);
          if (!$consulta) {
        $this->mensaje="BAD".$sql;}
        else{    
            $consulta->execute();
            $this->mensaje="GOOD";
        }
    }  
}