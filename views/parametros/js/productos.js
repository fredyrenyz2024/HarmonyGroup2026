(function () {

  'use strict';

  window.VENTANA = null; // Variable global para almacenar el ID
  // Definir la función initScript globalmente
  window.initScript = function (id) {
    window.VENTANA = id; // Asigna el ID recibido a la variable global
    // Crear instancia
    // Usar una variable global o una propiedad en el objeto window
    // if (!window.myOffcanvas) {
    //   window.myOffcanvas = new DynamicOffcanvas({
    //     id: `customOffcanvas${id}`,
    //     title: '<span class="text-dark uil uil-car"></span> Titulo General',
    //     content: '<p>Contenido inicial</p>',
    //     scroll: true,
    //     backdrop: false
    //   });
    // } else {
    //   console.log('El offcanvas ya esta creado.');
    // }


    $(document).on('click', '#btn_guardar_producto', async function () {
      const btn = $(this);

      // Validación rápida de obligatorios
      const campos = {
        cliente_id: $('#prod_cliente_id').val(),
        sku: $('#prod_sku').val(),
        nombre_producto: $('#prod_nombre').val(),
        presentacion: $('#prod_presentacion').val()
      };

      if (Object.values(campos).some(v => v === "")) {
        return Swal.fire("Error", "Por favor complete los campos obligatorios (*)", "error");
      }

      let formData = new FormData();
      formData.append('cliente_id', $('#prod_cliente_id').val());
      formData.append('sku', $('#prod_sku').val());
      formData.append('nombre_producto', $('#prod_nombre').val());
      formData.append('kg_neto', $('#prod_kg_neto').val());
      formData.append('kg_bruto', $('#prod_kg_bruto').val());
      formData.append('unidades_palet', $('#prod_unidades_palet').val());
      formData.append('presentacion', $('#prod_presentacion').val());

      btn.prop('disabled', true).html('Guardando...');

      try {
        const response = await fetch($('#base_url').val() + 'parametros/insertar_producto', {
          method: 'POST',
          body: formData
        });
        const res = await response.json();

        if (res.status) {
          Swal.fire("Éxito", res.message, "success").then(() => location.reload());
        } else {
          Swal.fire("Error", res.message, "error");
          btn.prop('disabled', false).html('Guardar Producto');
        }
      } catch (e) {
        console.error(e);
        btn.prop('disabled', false).html('Guardar Producto');
      }
    });
  }

})();