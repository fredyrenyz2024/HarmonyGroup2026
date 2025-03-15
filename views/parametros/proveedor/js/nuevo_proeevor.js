window.VENTANA = null; // Variable global para almacenar el ID
// Definir la función initScript globalmente
window.initScript = function (id) {
  window.VENTANA = id; // Asigna el ID recibido a la variable global
  Municipios();
  document.addEventListener("click", async (e) => {
    if (e.target.matches("#btn_guardar_proveedor") || e.target.matches("#btn_guardar_proveedor *")) {
      const result = await Swal.fire({
        title: "Seguro",
        text: "¿Desea guardar el proveedor?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3B71CA",
        cancelButtonColor: "#9FA6B2",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        customClass: {
          popup: "swal2-custom-font",
        },
      });

      if (result.isConfirmed) {
        const btn = document.querySelector("#btn_guardar_proveedor");

        // Obtener valores de los campos
        let formFields = {
          slct_tipo_documento_: document.getElementById("slct_tipo_documento_"),
          slct_regimen_: document.getElementById("slct_regimen_"),
          documento: document.getElementById("documento"),
          digito_verificacion: document.getElementById("digito_verificacion"),
          razon_social: document.getElementById("razon_social"),
          slct_ciudad_: document.getElementById("slct_ciudad_"),
          telefono_proveedor: document.getElementById("telefono_proveedor"),
          correo_proveedor: document.getElementById("correo_proveedor"),
          contacto_proveedor: document.getElementById("contacto_proveedor"),
          numero_contacto: document.getElementById("numero_contacto"),
          direccion_proveedor: document.getElementById("direccion_proveedor"),
          estado_proveedor: document.getElementById("slct_estado_proveedor_"),
        };

        let camposVacios = [];

        // Restablecer los bordes antes de validar
        Object.values(formFields).forEach((campo) => campo.style.border = "");

        // Validar campos vacíos
        Object.entries(formFields).forEach(([key, campo]) => {
          if (campo.value.trim() === "") {
            camposVacios.push(key.replace(/_/g, " ")); // Formatear nombre para la alerta
            campo.style.border = "1px solid red"; // Poner borde rojo
          }
        });

        if (camposVacios.length > 0) {
          Swal.fire({
            title: "Campos Vacíos",
            text: "Por favor complete los siguientes campos:\n" + camposVacios.join(", "),
            icon: "error",
          });
          return; // Detiene la ejecución si hay campos vacíos
        }

        // Deshabilitar botón y mostrar mensaje de carga
        btn.disabled = true;
        btn.innerHTML = "Guardando... ⏳";

        let formData = new FormData();
        Object.entries(formFields).forEach(([key, campo]) => {
          formData.append(key, campo.value.trim());
        });

        try {
          const response = await fetch($('#base_url').val() + 'parametros/insertar_proveedores', {
            method: 'POST',
            body: formData,
            cache: 'no-cache',
          });

          const data = await response.json();

          Swal.fire({
            title: "Mensaje!",
            text: data.message,
            icon: data.status === true ? "success" : "error",
            draggable: true
          }).then((result) => {
            if (result.isConfirmed) {
              location.reload(); // Recargar la página
            }
          });

          // Si la inserción es exitosa, restaurar los estilos
          if (data.status === true) {
            Object.values(formFields).forEach((campo) => {
              campo.style.border = ""; // Quitar bordes rojos
              campo.value = ""; // Limpiar los campos
            });
          }

        } catch (err) {
          console.error(err);
          Swal.fire("Error", "Error al enviar datos al servidor.", "error");
        } finally {
          btn.disabled = false;
          btn.innerHTML = "<span class='uil uil-file-import'></span> Guardar Proveedor";
        }
      }
    }
  });


  document.addEventListener('change', async e => {
    if (e.target.matches('.address') || e.target.matches('.address *')) {
      const elements = ['di_tipovia', 'di_nomvia', 'di_letra1', 'di_prefijo1', 'di_letra2', 'di_cuadrante', 'di_num1', 'di_letra3', 'di_numero2', 'di_cuadrante2', 'di_tipovia1', 'di_numero3'];

      // Filtra y concatena solo los valores que no están vacíos
      const nomenclatura = elements.map(id => document.getElementById(id).value.trim()).filter(value => value !== '').join(' ');

      // Asigna la dirección sin espacios innecesarios
      const direccionCompuesta = document.getElementById('direccion_compuesta');
      const direccionTercero = document.getElementById('direccion_proveedor');

      direccionCompuesta.value = nomenclatura;
      direccionTercero.value = nomenclatura;

      // Dispara un evento para que Livewire detecte el cambio
      // direccionTercero.dispatchEvent(new Event('input'));
    }
  });
}
async function Municipios() {
  // Vaciar el contenido de los selects específicos usando el identificador dinámico
  $('#slct_ciudad_').empty();

  try {
    const response = await fetch($('#base_url').val() + 'parametros/Consulta_Municipios', {
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

function Cambia_Direccion() {
  tipovia = $("#di_tipoviasd").val();
  di_nomvia = $("#di_nomviasd").val();
  di_letra1 = $("#di_letra1sd").val();
  di_prefijo1 = $("#di_prefijo1sd").val();
  di_letra2 = $("#di_letra2sd").val();
  di_cuadrante = $("#di_cuadrantesd").val();
  di_num1 = $("#di_num1sd").val();
  di_letra3 = $("#di_letra3sd").val();
  di_numero2 = $("#di_numero2sd").val();
  di_cuadrante2 = $("#di_cuadrante2sd").val();
  di_tipovia1 = $("#di_tipovia1sd").val();
  di_numero3 = $("#di_numero3sd").val();
  var nomenclatura = (tipovia + ' ' + di_nomvia + ' ' + di_letra1 + ' ' + di_prefijo1 + ' ' + di_letra2 + ' ' + di_cuadrante + ' ' + di_num1 + ' ' + di_letra3 + ' ' + di_numero2 + ' ' + di_cuadrante2 + ' ' + di_tipovia1 + ' ' + di_numero3);
  $("#direccion_compuesta_sd").val(nomenclatura);
  $("#dire" + id).val(nomenclatura);
}