window.VENTANA = null; // Variable global para almacenar el ID
// Definir la función initScript globalmente
window.initScript = function (id) {
  window.VENTANA = id; // Asigna el ID recibido a la variable global

  Listar_proveedores();
  Listar_clientes();

  document.addEventListener("click", async (e) => {
    if (e.target.matches("#btn_guardar_asignacion") || e.target.matches("#btn_guardar_asignacion *")) {
      let proveedor = $("#slct_proveedor_asignar_").val();
      let clientes = $("#slct_clientes_asignar_").val();

      if (!proveedor || clientes === null || clientes.length === 0) {
        // alert("Debe seleccionar un proveedor y al menos un cliente.");
        Swal.fire({
          title: "Advertencia",
          text: "Debe seleccionar un proveedor y al menos un cliente.",
          icon: "warning",
          customClass: {
            popup: "swal2-custom-font",
          },
        });
        return;
      }

      const result = await Swal.fire({
        title: "Seguro",
        text: "¿Desea asignar el proveedor?",
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
        Asignar_proveedor();
      }
    }
  });
}

async function Listar_proveedores() {
  // Vaciar el contenido de los selects específicos usando el identificador dinámico
  $('#slct_proveedor_asignar_').empty();

  try {
    const response = await fetch($('#base_url').val() + 'parametros/listar_proveedores', {
      method: 'POST',
      dataType: 'json',
      cache: 'no-cache'
    });
    const data = await response.json();

    // Caso general: llenar los selects con la data obtenida
    data.forEach(function (element) {
      $('#slct_proveedor_asignar_').append('<option value="' + element.id + '">' + element.razon_social + '</option>');
    });

    // Inicializar (o reinicializar) los selects con Select2 para ambos casos
    $('#slct_proveedor_asignar_').select2({
      placeholder: 'Seleccione una opción',
      allowClear: true
    });

  } catch (error) {
    console.error('Error en la solicitud:', error);
    throw error;
  }
}

async function Listar_clientes() {
  // Vaciar el contenido de los selects específicos usando el identificador dinámico
  $('#slct_clientes_asignar_').empty();

  try {
    const response = await fetch($('#base_url').val() + 'parametros/Listar_clientes', {
      method: 'POST',
      dataType: 'json',
      cache: 'no-cache'
    });
    const data = await response.json();

    // Caso general: llenar los selects con la data obtenida
    data.forEach(function (element) {
      $('#slct_clientes_asignar_').append('<option value="' + element.id + '">' + element.nombre + '</option>');
    });

    // Inicializar (o reinicializar) los selects con Select2 para ambos casos
    $('#slct_clientes_asignar_').select2({
      placeholder: 'Seleccione una opción',
      allowClear: true
    });

  } catch (error) {
    console.error('Error en la solicitud:', error);
    throw error;
  }
}

// async function Asignar_proveedor() {
//   let proveedor = $("#slct_proveedor_asignar_").val();
//   let clientes = $("#slct_clientes_asignar_").val();
//   const response = await fetch($('#base_url').val() + 'parametros/asignar_proveedor', {
//     method: 'POST',
//     dataType: 'json',
//     cache: 'no-cache',
//     headers: {
//       'Content-Type': 'application/json', // Establece el tipo de contenido como JSON
//     },
//     body: JSON.stringify({ proveedor: proveedor, clientes: clientes })
//   });
//   const data = await response.json(); // Parsea la respuesta como JSON
//   // console.log(data);
//   Toast.fire({
//     icon: "success",
//     // title: "Mensaje",
//     text: data.message
//   }).then(() => {
//     // w.location.reload();
//     Listar_proveedores();
//     Listar_clientes();
//   });

// }

async function Asignar_proveedor() {
  let proveedor = $("#slct_proveedor_asignar_").val();
  let clientes = $("#slct_clientes_asignar_").val();

  try {
    const response = await fetch($('#base_url').val() + 'parametros/asignar_proveedor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ proveedor: proveedor, clientes: clientes }),
    });

    const data = await response.json(); // Parsea la respuesta como JSON

    if (data.status === true) {
      Swal.fire({
        title: "Mensaje!",
        text: data.message,
        icon: data.status === true ? "success" : "error",
        draggable: true
      }).then((result) => {
        if (result.isConfirmed) {
          // w.location.reload();
          $("#slct_proveedor_asignar_").val('').trigger('change');
          $("#slct_clientes_asignar_").val('').trigger('change');
          Listar_proveedores();
          Listar_clientes();
        }
      });


    } else {
      // Error: Mostrar clientes duplicados si existen
      let mensaje = data.message;
      if (data.duplicados && data.duplicados.length > 0) {
        mensaje += "\nClientes ya asignados: " + data.duplicados.join(", ");
      }

      Swal.fire({
        title: "Mensaje!",
        text: data.message,
        icon: data.status === true ? "success" : "error",
        draggable: true
      });
    }
  } catch (error) {
    // Error en la solicitud AJAX
    console.error("Error en la petición:", error);
    Swal.fire({
      title: "Mensaje!",
      text: "Ocurrió un error inesperado. Intente nuevamente.",
      icon: "error",
      draggable: true
    });
  }
}
