window.VENTANA = null; // Variable global para almacenar el ID
// Definir la función initScript globalmente
window.initScript = function (id) {
  window.VENTANA = id; // Asigna el ID recibido a la variable global

  if (window.VENTANA === 38) {
    Listar_proveedores();
    Listar_servicios();
  }

  document.addEventListener("click", async (e) => {
    if (e.target.id === "btn_guardar_servicio" || e.target.id === "btn_guardar_servicio *") {
      Guardar_Servicio();
    }
    if (e.target.id === "btn_guardar_asignacion" || e.target.id === "btn_guardar_asignacion *") {
      Guardar_Asignacion();
    }
  });
}

async function Guardar_Servicio() {

  var servicio = document.getElementById("tipo_servicio").value;
  var descripcion = document.getElementById("observacion_servicio").value;
  var estado = document.getElementById("slct_estado_servicio_").value;

  if (servicio == "" || estado == "") {
    // alert("Todos los campos son obligatorios.");
    Swal.fire({
      title: "Mensaje!",
      text: "El campo tipo servico y estado son obligatorios.",
      icon: "warning",
      draggable: true
    });
    return;
  }
  let formData = new FormData();
  formData.append('servicio', servicio);
  formData.append('descripcion', descripcion);
  formData.append('estado', estado);

  try {
    const response = await fetch($('#base_url').val() + 'parametros/Guardar_Servicio', {
      method: 'POST',
      body: formData,
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
          $("#tipo_servicio").val('');
          $("#observacion_servicio").val('');
          $("#slct_estado_servicio_").val('');
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

function capitalizeWords(str) {
  return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
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
async function Listar_servicios() {
  // Vaciar el contenido de los selects específicos usando el identificador dinámico
  $('#slct_servicios_asignar_').empty();

  try {
    const response = await fetch($('#base_url').val() + 'parametros/listar_asignacion_servicios', {
      method: 'POST',
      dataType: 'json',
      cache: 'no-cache'
    });
    const data = await response.json();

    // Caso general: llenar los selects con la data obtenida
    data.forEach(function (element) {
      $('#slct_servicios_asignar_').append('<option value="' + element.id + '">' + element.tipo_servicio + '</option>');
    });

    // Inicializar (o reinicializar) los selects con Select2 para ambos casos
    $('#slct_servicios_asignar_').select2({
      placeholder: 'Seleccione una opción',
      allowClear: true
    });

  } catch (error) {
    console.error('Error en la solicitud:', error);
    throw error;
  }
}

async function Guardar_Asignacion() {
  let servicio = $("#slct_servicios_asignar_").val();
  let proveedor = $("#slct_proveedor_asignar_").val();
  let estado = $("#slct_estado_servicio_").val(); // Parece que no se está usando, pero lo dejo por si se necesita

  if (!servicio || !proveedor) {
    Swal.fire({
      title: "Advertencia",
      text: "Debe seleccionar un servicio y un proveedor.",
      icon: "warning",
      customClass: {
        popup: "swal2-custom-font",
      },
    });
    return;
  }

  try {
    const response = await fetch($("#base_url").val() + "parametros/Guardar_Asignacion_Servicio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ servicio, proveedor, estado }),
    });

    const data = await response.json(); // Parsea la respuesta como JSON

    if (data.status) {
      Swal.fire({
        title: "Éxito",
        text: data.message,
        icon: "success",
        draggable: true,
      }).then((result) => {
        if (result.isConfirmed) {
          // Resetear selects
          $("#slct_servicios_asignar_").val("").trigger("change");
          $("#slct_proveedor_asignar_").val("").trigger("change");
          $("#slct_estado_servicio_").val("");
          // Listar_proveedores();
          // Listar_clientes();
        }
      });
    } else {
      // Construcción del mensaje de error
      let mensaje = data.message;
      if (data.duplicados && data.duplicados.length > 0) {
        mensaje += "\nServicios ya asignados: " + data.duplicados.join(", ");
      }

      Swal.fire({
        title: "Error",
        text: mensaje,
        icon: "error",
        draggable: true,
      });
    }
  } catch (error) {
    console.error("Error en la petición:", error);
    Swal.fire({
      title: "Error",
      text: "Ocurrió un error inesperado. Intente nuevamente.",
      icon: "error",
      draggable: true,
    });
  }
}
