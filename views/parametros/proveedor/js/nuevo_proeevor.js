window.VENTANA = null; // Variable global para almacenar el ID
// Definir la función initScript globalmente
window.initScript = function (id) {
  window.VENTANA = id; // Asigna el ID recibido a la variable global
  // Municipios();
  Pais();
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

        let sedes = [];
        $('#tbody_sedes tr').each(function () {
          const rowId = $(this).attr('id').replace('fila_sede_', '');
          const sede = {
            pais: $(`#sede_pais_${rowId}`).val(),
            municipio_id: $(`#sede_muni_${rowId}`).val(),
            nombre_direccion: $(`#sede_nombre_${rowId}`).val()
          };
          if (sede.pais && sede.municipio_id) {
            sedes.push(sede);
          }
        });

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
          tipo_proveedor: document.getElementById("slct_tipo_proveedor_"),
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

        // Agregar al FormData
        formData.append('sedes', JSON.stringify(sedes));

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

    if (e.target.matches('#slct_tipo_proveedor_') || e.target.matches('#slct_tipo_proveedor_ *')) {
      const tipoProveedor = e.target.value;
      const divSedes = document.getElementById('tbl-sedes');

      if (tipoProveedor === '4Pl') {
        divSedes.classList.remove('d-none'); // Se muestra respetando sus clases col-

        // IMPORTANTE: Recalcular el ancho de Select2 después de mostrarlo
        // $('#slct_pais_').select2({
        //   width: '100%' // Esto fuerza a que tome el ancho del contenedor
        // });
      } else {
        divSedes.classList.add('d-none');
      }
    }

  });

  // Escuchar el cambio en el select de país
  $('#slct_pais_').on('select2:select', function (e) {
    const paisSeleccionado = e.params.data.id; // Obtenemos el valor seleccionado
    Municipios(paisSeleccionado); // Llamamos a la función con el ID del país
  });

  // Opcional: Limpiar municipios si se borra el país (si usas allowClear)
  $('#slct_pais_').on('select2:unselect', function (e) {
    Municipios(null);
  });


  // Variable para llevar el conteo de filas y generar IDs únicos
  let sedeIndex = 0;

  document.getElementById('btn_agregar_sede').addEventListener('click', () => {
    sedeIndex++;
    const nuevaFila = `
        <tr id="fila_sede_${sedeIndex}">
            <td>
                <select class="form-select form-select-sm slct-pais-tabla" id="sede_pais_${sedeIndex}" data-index="${sedeIndex}">
                    <option value="">Seleccione...</option>
                </select>
            </td>
            <td>
                <select class="form-select form-select-sm slct-muni-tabla" id="sede_muni_${sedeIndex}">
                    <option value="">Seleccione país primero</option>
                </select>
            </td>
            <td>
                <input type="text" class="form-control form-control-sm" placeholder="Ej: Sede Norte / Calle 123" id="sede_nombre_${sedeIndex}">
            </td>
            <td class="text-center">
                <button type="button" class="btn btn-outline-danger btn-sm btn-eliminar-sede">
                    <i class="uil uil-trash-alt"></i>
                </button>
            </td>
        </tr>
    `;

    $('#tbody_sedes').append(nuevaFila);

    $(`#sede_pais_${sedeIndex}`).select2({
      width: '100%' // Esto fuerza a que tome el ancho del contenedor
    });

    // Llenar el select de países de la nueva fila (usando la data ya cargada si es posible o llamando a la función)
    llenarPaisesTabla(`#sede_pais_${sedeIndex}`);
  });

  // Delegación de eventos para eliminar fila
  $(document).on('click', '.btn-eliminar-sede', function () {
    $(this).closest('tr').remove();
  });

  // Evento cuando cambia el país EN LA TABLA
  $(document).on('change', '.slct-pais-tabla', async function () {
    const index = $(this).data('index');
    const paisId = $(this).val();
    const $selectMuni = $(`#sede_muni_${index}`);

    if (!paisId) {
      $selectMuni.empty().append('<option value="">Seleccione país primero</option>');
      return;
    }

    $selectMuni.empty().append('<option value="">Cargando...</option>');

    try {
      const response = await fetch($('#base_url').val() + 'parametros/Consulta_Municipios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 'pais': paisId }),
        cache: 'no-cache'
      });
      const data = await response.json();

      $selectMuni.empty().append('<option value="">Seleccione municipio</option>');
      data.forEach(element => {
        $selectMuni.append(`<option value="${element.id}">${element.municipio} - ${element.depto}</option>`);
      });

      $(`#sede_muni_${index}`).select2({
        width: '100%' // Esto fuerza a que tome el ancho del contenedor
      });
    } catch (error) {
      console.error(error);
      $selectMuni.empty().append('<option value="">Error</option>');
    }
  });

  // Función auxiliar para llenar países en la tabla
  async function llenarPaisesTabla(selector) {
    const response = await fetch($('#base_url').val() + 'parametros/Consulta_Pais', { method: 'POST' });
    const data = await response.json();
    data.forEach(element => {
      $(selector).append(`<option value="${element.pais}">${element.pais}</option>`);
    });
  }
}

async function Pais() {
  $('#slct_pais_').empty();
  // Agregar la opción inicial por defecto
  $('#slct_pais_').append('<option value="">Seleccione un país</option>');

  try {
    const response = await fetch($('#base_url').val() + 'parametros/Consulta_Pais', {
      method: 'POST',
      dataType: 'json',
      cache: 'no-cache'
    });
    const data = await response.json();

    data.forEach(function (element) {
      $('#slct_pais_').append('<option value="' + element.pais + '">' + element.pais + '</option>');
    });

    $('#slct_pais_').select2({
      placeholder: 'Seleccione una opción',
      allowClear: true
    });

  } catch (error) {
    console.error('Error en la solicitud:', error);
  }
}

// async function Municipios() {
//   $('#slct_ciudad_').empty();
//   // Agregar la opción inicial por defecto
//   $('#slct_ciudad_').append('<option value="">Seleccione un municipio</option>');

//   try {
//     const response = await fetch($('#base_url').val() + 'parametros/Consulta_Municipios', {
//       method: 'POST',
//       dataType: 'json',
//       cache: 'no-cache'
//     });
//     const data = await response.json();

//     data.forEach(function (element) {
//       $('#slct_ciudad_').append('<option value="' + element.id + '" data-municipio="' + element.municipio + '" data-depto="' + element.depto + '">' + element.municipio + '-' + element.depto + '</option>');
//     });

//     $('#slct_ciudad_').select2({
//       placeholder: 'Seleccione una opción',
//       allowClear: true
//     });

//   } catch (error) {
//     console.error('Error en la solicitud:', error);
//   }
// }


async function Municipios(paisId) {
  const $selectCiudad = $('#slct_ciudad_');

  // Si no hay país seleccionado, limpiamos municipios y salimos
  if (!paisId) {
    $selectCiudad.empty().append('<option value="">Seleccione un municipio</option>').trigger('change');
    return;
  }

  $selectCiudad.empty().append('<option value="">Cargando...</option>');

  try {
    const response = await fetch($('#base_url').val() + 'parametros/Consulta_Municipios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ 'pais': paisId }), // Enviamos el país al servidor
      cache: 'no-cache'
    });

    const data = await response.json();
    $selectCiudad.empty().append('<option value="">Seleccione un municipio</option>');

    data.forEach(function (element) {
      $selectCiudad.append('<option value="' + element.id + '" data-municipio="' + element.municipio + '" data-depto="' + element.depto + '">' + element.municipio + ' - ' + element.depto + '</option>');
    });

    // Refrescar Select2
    $selectCiudad.trigger('change');

  } catch (error) {
    console.error('Error al cargar municipios:', error);
    $selectCiudad.empty().append('<option value="">Error al cargar</option>');
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