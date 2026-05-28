window.VENTANA = "";
// Variable global para el título del detalle

window.initScript = function (id) {
    window.VENTANA = id;
    listarDocumentosSeguimiento();

}

/**
 * Función para renderizar la lista de manifiestos en seguimiento y sus documentos pendientes.
 */
async function listarDocumentosSeguimiento() {
    const tbody = $('#tbody-docs-pendientes');
    const baseUrl = $('#base_url').val();

    tbody.html('<tr><td colspan="4" class="text-muted">⏳ Consultando manifiestos en seguimiento...</td></tr>');

    try {
        const response = await fetch(baseUrl + 'novedades/listarDocumentosSeguimiento');
        const result = await response.json();

        if (result.status && result.data.length > 0) {
            let template = '';

            result.data.forEach(item => {
                const manifiestoId = item.Manifiesto_ID;

                // 🛑 1. VALIDACIÓN Y PREPARACIÓN DE PENDIENTES DEL TENEDOR
                const pendientesTenedor = [];
                if (!item.Ten_Certificado) pendientesTenedor.push('Certificado Bancario');
                if (!item.Ten_RUT) pendientesTenedor.push('RUT');
                if (!item.Ten_EPS) pendientesTenedor.push('Seguridad Social (EPS)');

                // 🛑 2. VALIDACIÓN Y PREPARACIÓN DE PENDIENTES DEL CONDUCTOR
                const pendientesConductor = [];
                if (!item.Con_Certificado) pendientesConductor.push('Certificado Bancario');
                if (!item.Con_RUT) pendientesConductor.push('RUT');
                if (!item.Con_EPS) pendientesConductor.push('Seguridad Social (EPS)');


                // 🛑 3. CONSTRUCCIÓN DE FILAS SEPARADAS (Tenedor y Conductor)

                // Fila del Tenedor
                template += construirFilaProveedor(item, 'Tenedor', item.Nombre_Tenedor, item.Doc_Tenedor, pendientesTenedor);

                // Fila del Conductor (Solo si el conductor es diferente al tenedor o si los IDs son distintos)
                // Usamos una lógica simple de filas para mostrar los datos
                template += construirFilaProveedor(item, 'Conductor', item.Nombre_Conductor, item.Doc_Conductor, pendientesConductor);
            });

            tbody.html(template);

        } else {
            tbody.html('<tr><td colspan="4" class="text-success fw-bold">🎉 No hay manifiestos en seguimiento con documentos pendientes.</td></tr>');
        }

    } catch (error) {
        tbody.html('<tr><td colspan="4" class="text-danger">Error al cargar la lista de manifiestos.</td></tr>');
    }
}

/**
 * Función auxiliar para construir la fila HTML de un proveedor específico.
 */
function construirFilaProveedor(item, tipo, nombre, documento, pendientes) {
    const isTenedor = tipo === 'Tenedor';
    const pendienteCount = pendientes.length;
    const badgeColor = pendienteCount > 0 ? 'danger' : 'success';

    // Lista de documentos pendientes en formato HTML
    const listaPendientes = pendienteCount > 0 ?
        '<ul class="list-unstyled mb-0 text-start">' + pendientes.map(p => `<li><i class="fas fa-exclamation-triangle me-1"></i> ${p}</li>`).join('') + '</ul>' :
        '<span class="text-success fw-bold"><i class="fas fa-check-circle"></i> Documentación Completa</span>';

    return `
        <tr>
            <td rowspan="2" class="align-middle fw-bold">${item.Manifiesto_ID}</td>
            <td rowspan="2" class="align-middle">${item.placa}</td>
            
            <td class="text-start p-1 bg-light">
                <span class="fw-bold">${tipo}:</span> ${nombre} (${documento})
            </td>
            
            <td class="text-center p-1">
                <span class="badge badge-phoenix badge-phoenix-${badgeColor}">
                    ${pendienteCount} Pendiente(s)
                </span>
            </td>
        </tr>
        <tr class="${isTenedor ? 'bg-white' : 'bg-light'}">
            <td colspan="2" class="text-start pt-0 pb-1">
                 ${listaPendientes}
            </td>
        </tr>
    `;
}

// 🛑 Inicialización: Llamar al cargar la página
// document.addEventListener('DOMContentLoaded', listarDocumentosSeguimiento);