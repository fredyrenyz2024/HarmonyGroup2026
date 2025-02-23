const d = document;
const w = window;
d.addEventListener('DOMContentLoaded', e => {
  e.preventDefault();
  d.addEventListener('click', async e => {
    if (e.target.matches('#buscar_datos') || e.target.matches('#buscar_datos *')) {
      // alert(d.getElementById('numero_manifiesto').value);
      $('#loading-overlay-nexosapp ').css('display', 'flex'); // Mostrar mensaje de carga
      let datos = new FormData();
      datos.append('num_manifiesto', d.getElementById('numero_manifiesto').value);

      try {
        const response = await fetch($('#id_url_ajax').val() + 'web_service/Consultar_Datos', {
          method: 'POST',
          body: datos,
          cache: 'no-cache',
        });
        const data = await response.json();
        if (data.state === 200) {
          let digito = '';
          data.data.forEach(element => {
            // console.log('🚀 ~ data:', element.nombre);  + '-' + element.digito_verificacion != null ? '' : element.digito_verificacion
            d.getElementById('tipo_documento').textContent = element.tipo_documento;
            if (element.digito_verificacion != null) {
              digito = element.digito_verificacion;
            } else {
              digito = '';
            }
            d.getElementById('numero_documento').textContent = element.documento + digito;
            d.getElementById('codigo_cliente').textContent = element.cod_cliente;
            d.getElementById('nombre_cliente').textContent = element.nombre;
            d.getElementById('telefono_cliente').textContent = element.telefono;
            d.getElementById('direccion_cliente').textContent = element.direccion;
          });
        } else {
        }
      } catch (error) {
        console.error('Error en la primera solicitud:', error);
        throw error;
      } finally {
        $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
        clientes();
      }
    }
  });
});

async function clientes() {}
