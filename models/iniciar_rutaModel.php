<?php

class iniciar_rutaModel extends Model
{

    public function __construct()
    {
        parent::__construct();
    }

    public function n_inicio()
    {
        $sql = "SELECT max(cod_inicio)+1 AS nco
			 FROM cmx_inicio_ruta";
        $result = $this->_db->getConsulta($sql);
        return $result;
    }

    public function cargar_estado()
    {
        $sql = "SELECT * FROM cmx_estado_segui;";
        $result = $this->_db->getConsulta($sql);
        return $result;
    }

    //seguimientos submenu
    public function tabla_seguimiento()
    {
        //consulta para gerencia y trafico seguimientos
        $sql = "SELECT r.*, e.id AS med, e.cod_ini_ruta, e.estado, e.actual, e.observacion, e.fecha, e.hora, e.usuario, e.ultimo_estado ,p.nombre,MAX(e.estado) AS ultimo
        FROM cmx_inicio_ruta AS r
        INNER JOIN cmx_inici_manifiesto_estado AS e ON r.cod_inicio=e.cod_ini_ruta
        LEFT JOIN cmx_proveedores AS p ON p.numero_documento=r.cond_cedula
        GROUP BY e.cod_ini_ruta
       ";

        $result = $this->_db->getConsulta($sql);
        return $result;
    }

    public function estadoactual($inicio)
    {
        $idini = $inicio;
        $sql = "SELECT e.estado FROM cmx_inici_manifiesto_estado e
			WHERE e.cod_ini_ruta=" . $idini . " AND e.ultimo_estado=1";
        $result = $this->_db->getConsulta($sql);
        return $result;
    }

    public function planillas_seguridad()
    {
        $response = [];
        $fecha = date('Y-m-d');

        $sql = "SELECT mn.id AS n_manifiesto,
        mn.placa AS placa_manifiesto,
        pro.numero_documento,
        pro.nombre,
        pro.apellido1,
        pro.apellido2,
        ve.placa AS placa_vehiculo,
        cla.clase,
        pro.celular,
        dc.celular2,
        ve.web_satelital,
        ve.usuario_satelital,
        ve.clave_satelital,
        tra.placa AS placatrailer,
        mn1.municipio AS origen_final,
        mn2.municipio AS destino_final,
        mn.origen_viaje,
        mn.destino_viaje,
        mn.tipo_manifiesto,
        mn.fecha_expedicion,
        mn.hora_expedicion,
        mn.manifiesto_itr
        FROM cmx_manifiesto mn
        INNER JOIN cmx_manifiesto_estado me ON mn.id = me.id_manifiesto
        INNER JOIN cmx_municipios mn1 ON mn.origen_viaje = mn1.id
        INNER JOIN cmx_municipios mn2 ON mn.destino_viaje = mn2.id
        INNER JOIN cmx_proveedores pro ON pro.numero_documento = mn.conductor_manifiesto
        INNER JOIN cmx_detalle_conductor dc ON pro.numdoc_nexos = dc.id_proveedor
        INNER JOIN cmx_vehiculos ve ON mn.placa = ve.placa
        INNER JOIN cmx_vehiculo2 ve2 ON ve.numdoc_vehiculo = ve2.id_vehiculo
        INNER JOIN cmx_rndc_clase_vehiculo cla ON cla.id = ve2.clase_vehiculo
        LEFT JOIN cmx_trailer_vehiculo ti ON ve.numdoc_vehiculo = ti.id_vehiculo AND ti.estado = 1
        LEFT JOIN cmx_trailer tra ON ti.id_trailer = tra.numdoc_trailer
        LEFT JOIN cmx_inicio_ruta b ON mn.id = b.num_manifiesto
        LEFT JOIN cmx_asigancio_cita ac ON mn.id = ac.manifiesto AND ac.confirmacion = 'No Confirmada'
        -- WHERE me.estado = 1 AND b.num_manifiesto IS NULL AND mn.manifiesto_itr = 'NO'
        GROUP BY mn.id
        ORDER BY mn.id ASC";
        $result = $this->_db->getConsulta($sql);

        /* Cuando es itr y confirman la cita para poder sacrlos a seguimiento */
        $sql_valida = "SELECT mn.id AS n_manifiesto,
            mn.placa AS placa_manifiesto,
            pro.numero_documento,
            pro.nombre,
            pro.apellido1,
            pro.apellido2,
            ve.placa AS placa_vehiculo,
            cla.clase,
            pro.celular,
            dc.celular2,
            ve.web_satelital,
            ve.usuario_satelital,
            ve.clave_satelital,
            tra.placa AS placatrailer,
            mn1.municipio AS origen_final,
            mn2.municipio AS destino_final,
            mn.origen_viaje,
            mn.destino_viaje,
            mn.tipo_manifiesto,
            mn.fecha_expedicion,
            mn.hora_expedicion,
            mn.manifiesto_itr
        FROM cmx_manifiesto mn
        INNER JOIN cmx_manifiesto_estado me ON mn.id = me.id_manifiesto
        INNER JOIN cmx_municipios mn1 ON mn.origen_viaje = mn1.id
        INNER JOIN cmx_municipios mn2 ON mn.destino_viaje = mn2.id
        INNER JOIN cmx_proveedores pro ON pro.numero_documento = mn.conductor_manifiesto
        INNER JOIN cmx_detalle_conductor dc ON pro.numdoc_nexos = dc.id_proveedor
        INNER JOIN cmx_vehiculos ve ON mn.placa = ve.placa
        INNER JOIN cmx_vehiculo2 ve2 ON ve.numdoc_vehiculo = ve2.id_vehiculo
        INNER JOIN cmx_rndc_clase_vehiculo cla ON cla.id = ve2.clase_vehiculo
        LEFT JOIN cmx_trailer_vehiculo ti ON ve.numdoc_vehiculo = ti.id_vehiculo AND ti.estado = 1
        LEFT JOIN cmx_trailer tra ON ti.id_trailer = tra.numdoc_trailer
        LEFT JOIN cmx_inicio_ruta b ON mn.id = b.num_manifiesto
        LEFT JOIN cmx_asigancio_cita ac ON mn.id = ac.manifiesto AND ac.confirmacion = 'Confirmada'
        -- WHERE me.estado = 1 AND b.num_manifiesto IS NULL AND ac.esatdo_cita = 'ACTIVO' AND mn.manifiesto_itr = 'SI'
        GROUP BY mn.id
        ORDER BY mn.id ASC
";

        $result1 = $this->_db->getConsulta($sql_valida);

        $response = [
            "result" => $result,
            "result1" => $result1,
        ];
        return $response;
    }
}
