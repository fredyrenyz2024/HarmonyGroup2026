<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Trazabilidad</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }

        .table-container {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        .table-container th,
        .table-container td {
            border: 1px solid black;
            padding: 8px;
            text-align: center;
            color: black;
        }

        .header,
        .subheader {
            /* background-color: #333; */
        }

        .header img {
            width: 100px;
        }

        .header td {
            border: none;
        }

        .company-info,
        .report-info {
            text-align: left;
        }

        .logo-right img {
            width: 80px;
        }
    </style>
</head>

<body>
    <table class="table-container">
        <tr class="header">
            <td rowspan="3"><img src="cid:magnetron_logo" alt="Magnetron Logo"></td>
            <td class="company-info" colspan="5">
                <strong>{{Titulo_Cliente}}</strong><br>TRANSPORTES
                <!-- <strong>MAGNETRON S.A.S</strong><br>TRANSPORTES -->
            </td>
            <td class="report-info" colspan="3">
                <strong>FORMATO</strong><br> REPORTE DE TRAZABILIDAD
            </td>
            <td class="logo-right" rowspan="3">
                <img src="cid:nexos_logo" alt="Nexos Logo" style="width: 180px;">
            </td>
        </tr>
        <tr class="subheader">
            <td class="company-info" colspan="5">ANEXO AL INSTRUCTIVO<br>CONTRATACIÓN DE PROVEEDORES DE TRANSPORTE</td>
            <td class="report-info" colspan="3">
                <strong>FECHA</strong><br> <?= date('d/m/Y H:i'); ?>
            </td>
        </tr>
        <tr class="subheader">
            <td class="company-info" colspan="5"></td>
            <td class="report-info" colspan="3">
                <strong>CODIGO</strong>
            </td>
        </tr>
        <tr class="data">
            <th>REFERENCIA</th>
            <th>CONTENEDOR</th>
            <th>PLACA</th>
            <th>CONDUCTOR</th>
            <th>CC</th>
            <th>ORIGEN</th>
            <th>DESTINO</th>
            <th>Información Último Seguimiento</th>
            <th>Novedad de tránsito</th>
            <th>FECHA Y HORA</th>
        </tr>

        <!-- Generación dinámica del tbody -->
        <tbody>
        {{contenido_dinamico}}
        </tbody>
    </table>
</body>

</html>