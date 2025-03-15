window.VENTANA = null; // Variable global para almacenar el ID
// Definir la función initScript globalmente
window.initScript = function (id) {
  window.VENTANA = id; // Asigna el ID recibido a la variable global
}

async function Listar_proveedores() {
  // Vaciar el contenido de los selects específicos usando el identificador dinámico
  $('#slct_ciudad_').empty();

  try {
    const response = await fetch($('#base_url').val() + 'parametros/Consultar_proveedores', {
      method: 'POST',
      dataType: 'json',
      cache: 'no-cache'
    });
    const data = await response.json();

    // Caso general: llenar los selects con la data obtenida
    data.forEach(function (element) {
      $('#slct_ciudad_').append('<option value="' + element.id + '" data-municipio="' + element.municipio + '" data-depto="' + element.depto + '">' + element.municipio + '-' + element.depto + '</option>');
    });

    // Inicializar (o reinicializar) los selects con Select2 para ambos casos
    $('#slct_ciudad_').select2({
      placeholder: 'Seleccione una opción',
      allowClear: true
    });

  } catch (error) {
    console.error('Error en la solicitud:', error);
    throw error;
  }
}