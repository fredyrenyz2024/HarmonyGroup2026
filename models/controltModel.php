<?php
session_start();

class controltModel extends Model
{

    public function __construct()
    {
        parent::__construct();
    }

    // public function CantidadManifiestos($placa, $clienteid, $destinoid)
    // {

    //     #Contador General de viajes del vehiculo
    //     $sql = $this->_db3->prepare("SELECT
    //         COUNT(DISTINCT m.id) AS Manifiestos,
    //         m.placa,
    //         cond.numdoc_nexos
    //     FROM
    //         cmx_manifiesto m
    //         INNER JOIN cmx_cumplido c ON m.id = c.manifiesto -- Descomentar o añadir el JOIN
    //         INNER JOIN cmx_manifiesto_estado me ON m.id = me.id_manifiesto
    //         AND me.estado = 1
    //         INNER JOIN cmx_vehiculos v ON m.placa=v.placa
    //         INNER JOIN cmx_proveedores cond ON v.id_conductor=cond.numdoc_nexos
    //     WHERE
    //         m.estadomnf_actual = 1
    //         AND m.placa =:Placa");
    //     $sql->bindParam(':Placa', $placa, PDO::PARAM_STR);
    //     $sql->execute();
    //     $resultado = $sql->fetch(PDO::FETCH_ASSOC);
    //     return $resultado;
    // }

    public function CantidadManifiestos($placa, $destino, $cliente)
    {
        $response = [];

        try {
            // Contador General de viajes del vehiculo
            $sql1 = "SELECT
                COUNT(DISTINCT m.id) AS Manifiestos,
                m.placa,
                cond.numdoc_nexos
            FROM
                cmx_manifiesto m
                INNER JOIN cmx_cumplido c ON m.id = c.manifiesto
                INNER JOIN cmx_manifiesto_estado me ON m.id = me.id_manifiesto AND me.estado = 1
                INNER JOIN cmx_vehiculos v ON m.placa = v.placa
                INNER JOIN cmx_proveedores cond ON v.id_conductor = cond.numdoc_nexos
            WHERE
                m.estadomnf_actual = 1
                AND m.placa = :placa";
            $stmt1 = $this->_db3->prepare($sql1);
            $stmt1->bindParam(':placa', $placa);
            $stmt1->execute();
            $response['general'] = $stmt1->fetch(PDO::FETCH_ASSOC);

            // Contador de viajes de la placa por el destino
            $sql2 = "SELECT
                COUNT(DISTINCT m.id) AS Cantidad_Viajes_Destino
            FROM
                cmx_manifiesto m
                INNER JOIN cmx_municipios des ON m.destino_viaje=des.id
                INNER JOIN cmx_cumplido c ON m.id = c.manifiesto
                INNER JOIN cmx_manifiesto_estado me ON m.id = me.id_manifiesto AND me.estado = 1
                INNER JOIN cmx_vehiculos v ON m.placa = v.placa
                INNER JOIN cmx_proveedores cond ON v.id_conductor = cond.numdoc_nexos
            WHERE
                m.estadomnf_actual = 1
                AND m.placa = :placa
                AND des.rndc_codigo_ciudad= :destino";
            $stmt2 = $this->_db3->prepare($sql2);
            $stmt2->bindParam(':placa', $placa);
            $stmt2->bindParam(':destino', $destino);
            $stmt2->execute();
            $response['por_destino'] = $stmt2->fetch(PDO::FETCH_ASSOC);

            // Contador de viajes por cliente
            $sql3 = "SELECT
                COUNT(DISTINCT m.id) AS Cantidad_Viajes_Cliente
            FROM
                cmx_manifiesto m
                INNER JOIN cmx_municipios des ON m.destino_viaje=des.id
                INNER JOIN cmx_cumplido c ON m.id = c.manifiesto
                INNER JOIN cmx_manifiesto_estado me ON m.id = me.id_manifiesto AND me.estado = 1
                INNER JOIN cmx_vehiculos v ON m.placa = v.placa
                INNER JOIN cmx_proveedores cond ON v.id_conductor = cond.numdoc_nexos
                INNER JOIN cmx_manifiesto_remesa mr ON m.id=mr.id_manifiesto
                INNER JOIN cmx_remesa r ON mr.id_remesa=r.id
                INNER JOIN cmx_solicitud_vehiculo2 ss ON r.mer_idservicio=ss.nundoc_solicitud
                INNER JOIN cmx_cotizaciones_serviciocliente cs ON ss.n_cotizacion=cs.n_cotizacion
                INNER JOIN cmx_clientes cl ON cs.id_cliente=cl.id
            WHERE
                m.estadomnf_actual = 1
                AND m.placa = :placa
                AND cl.id= :cliente";
            $stmt3 = $this->_db3->prepare($sql3);
            $stmt3->bindParam(':placa', $placa);
            $stmt3->bindParam(':cliente', $cliente);
            $stmt3->execute();
            $response['por_cliente'] = $stmt3->fetch(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            $response['error'] = $e->getMessage();
        }

        return $response;
    }

    /**
     * Obtiene el detalle de remesas agrupadas por remesa ID para un vehículo específico.
     * @param string $placa Placa del vehículo.
     * @return array Lista de viajes.
     */
    public function DetalleViajesPlaca(string $placa): array
    {
        $sql = "SELECT
            m.id AS Manifiesto,
            r.id AS remesa,
            oc.id AS Orden_Cargue,
            m.fecha_expedicion,
            IFNULL(ar.origen_ajuste, CONCAT(ori.municipio, ' ', ori.depto)) AS Origen,
            IFNULL(ar.origen_ajuste, CONCAT(des.municipio, ' ', des.depto)) AS Destino,
            m.valor_total_viaje AS Total_Manifiesto,
            IFNULL(ma.valor_anticipo, '$0.00') AS Anticipo,
            m.Lugar AS Lugar_Expedicion
        FROM
            cmx_manifiesto m
            INNER JOIN cmx_manifiesto_estado me ON m.id = me.id_manifiesto AND me.estado = 1
            INNER JOIN cmx_manifiesto_remesa mr ON m.id = mr.id_manifiesto
            INNER JOIN cmx_remesa r ON mr.id_remesa = r.id
            INNER JOIN cmx_remesa_ordencargue ro ON r.id = ro.id_remesa
            INNER JOIN cmx_orden_cargue oc ON ro.id_orden_cargue = oc.id
            INNER JOIN cmx_clientes cl ON oc.cli_id = cl.id
            INNER JOIN cmx_municipios ori ON m.origen_viaje = ori.id
            INNER JOIN cmx_municipios des ON m.destino_viaje = des.id
            INNER JOIN cmx_cumplido c ON m.id = c.manifiesto 
            LEFT JOIN cmx_manifiesto_anticipo ma ON m.id = ma.id_manifiesto
            LEFT JOIN cmx_ajuste_valor_remesa ar ON r.id = ar.remesa_id
        WHERE
            m.placa = :Placa
            AND m.estadomnf_actual = 1
        GROUP BY r.id";

        try {
            $stmt = $this->_db3->prepare($sql);
            $stmt->bindParam(':Placa', $placa, PDO::PARAM_STR);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error al obtener detalle de viajes por placa: " . $e->getMessage());
            return [];
        }
    }


    public function GetCelularConductor($placa) {
        $sql="SELECT CONCAT(cond.celular,' - ',dc.celular2) AS celulares FROM cmx_vehiculos v
            INNER JOIN cmx_proveedores cond ON v.id_conductor=cond.numdoc_nexos
            INNER JOIN cmx_detalle_conductor dc ON cond.numdoc_nexos=dc.id_proveedor
            WHERE v.placa=:Placa";

        try {
            $stmt = $this->_db3->prepare($sql);
            $stmt->bindParam(':Placa', $placa, PDO::PARAM_STR);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (\Throwable $th) {
                        error_log("Error al obtener detalle de viajes por placa: " . $e->getMessage());
            return [];
        }
    }
}
