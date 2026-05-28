window.VENTANA = null; // Variable global para almacenar el ID
// window.globalData = []; // Variable global para almacenar el ID
// Definir la función initScript globalmente
window.initScript = function (id) {
  window.VENTANA = id; // Asigna el ID recibido a la variable global
  // Obtenemos referencias a los elementos
  const select = document.getElementById("miSelect");
  const btnAcciones = document.getElementById("btn-acciones");
  const btnDescargarPlantilla = document.getElementById("boton_descargar_plantilla");
  const divCargue = document.getElementById("cargue_masivo");
  const divCarguePedidos = document.getElementById("visualizar_pedidos");
  // const divFlete = document.getElementById("crear_flete");
  // const btn_flete = document.getElementById("footer_botones");

  // Escuchamos el evento "change" del select
  select.addEventListener("change", function () {
    // Mostramos el div correspondiente según la opción seleccionada
    const selected = select.value;
    if (selected === "cargue") {
      divCargue.style.display = '';
      divCarguePedidos.style.display = '';
      btnAcciones.style.display = '';
      btnDescargarPlantilla.style.display = '';
    } else if (selected === "flete") {
      divCarguePedidos.style.display = "none";
      divCargue.style.display = "none";
      btnAcciones.style.display = "none";
      btnDescargarPlantilla.style.display = "none";
    }
  });


  document.addEventListener("click", async (e) => {
    if (e.target.matches("#btn_importar_pedidos") || e.target.matches("#btn_importar_pedidos *")) {
      if (globalData.length === 0) {
        // alert("No hay datos para enviar. Primero carga y previsualiza un archivo de Excel.");
        Swal.fire({
          title: "Mensaje!",
          text: "No hay datos para enviar. Primero carga y previsualiza un archivo de Excel.",
          icon: "warning",
          draggable: true
        });
        return;
      }

      const result = await Swal.fire({
        title: 'Seguro',
        text: '¿Desea aprobar la solicitud?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3B71CA',
        cancelButtonColor: '#9FA6B2',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        customClass: {
          popup: 'swal2-custom-font',
        },
      });

      if (result.isConfirmed) {
        // Mostramos indicador de carga
        const btn = document.querySelector("#btn_importar_pedidos");
        btn.disabled = true;
        btn.innerHTML = "Importando... ⏳";
        try {
          const response = await fetch($('#base_url').val() + 'torrecontrol/importar_pedidos_masivos', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(globalData)
          });

          const data = await response.json();

          Swal.fire({
            title: "Mensaje!",
            text: data.message,
            icon: data.status === true ? "success" : "error",
            draggable: true
          });

        } catch (err) {  // ← Aquí estaba el error
          console.error(err);
          alert("Error al enviar datos al servidor.");
        } finally {
          // Ocultamos indicador de carga
          btn.disabled = false;
          btn.innerHTML = "<span class='uil uil-file-import'></span> Importar Pedidos";
        }
      }
    }
  });


}

// Variable global donde guardaremos los datos en formato de objetos (JSON)
// let globalData = [];
if (typeof window.globalData === "undefined") {
  window.globalData = [];
}

function leerExcel() {
  const fileInput = document.getElementById('excelFile');
  const file = fileInput.files[0];

  if (!file) {
    alert("Por favor selecciona un archivo de Excel primero.");
    return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    // Leemos el workbook (libro) usando SheetJS
    const workbook = XLSX.read(data, {
      type: 'array'
    });

    // Obtenemos el nombre de la primera hoja
    const sheetName = workbook.SheetNames[0];
    // Obtenemos la hoja
    const sheet = workbook.Sheets[sheetName];

    // Convertimos la hoja a un array de arrays
    const sheetData = XLSX.utils.sheet_to_json(sheet, {
      header: 1
    });
    // sheetData[0] será la fila de cabeceras
    // sheetData[1..] serán las filas con datos

    if (sheetData.length === 0) {
      alert("El archivo está vacío o no tiene datos.");
      return;
    }

    // Limpiamos la tabla de vista previa
    const previewTable = document.getElementById("previewTable");
    previewTable.innerHTML = "";

    // 1) Crear la fila de encabezados en la tabla
    const thead = document.createElement("thead");
    thead.style.borderCollapse = "collapse";
    thead.style.fontSize = "10px";
    // thead.style.backgroundColor = "#332D2D";
    thead.style.color = "#332D2D";
    const headerRow = document.createElement("tr");
    headerRow.setAttribute("class", "text-center");

    sheetData[0].forEach(headerText => {
      const th = document.createElement("th");
      th.textContent = headerText;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    previewTable.appendChild(thead);

    // 2) Crear el cuerpo de la tabla con las filas
    const tbody = document.createElement("tbody");
    tbody.style.borderCollapse = "collapse";
    tbody.style.fontSize = "10px";
    for (let i = 1; i < sheetData.length; i++) {
      const rowData = sheetData[i];
      const row = document.createElement("tr");

      rowData.forEach(cellData => {
        const td = document.createElement("td");
        td.textContent = (cellData !== undefined && cellData !== null) ? cellData : "";
        row.appendChild(td);
      });

      tbody.appendChild(row);
    }
    previewTable.appendChild(tbody);

    // 3) Convertimos los datos a JSON para poder enviarlos luego al servidor
    //    - La primera fila (sheetData[0]) son las cabeceras
    //    - El resto (sheetData.slice(1)) son las filas de datos
    const headers = sheetData[0];
    const rows = sheetData.slice(1);

    // Mapeamos cada fila a un objeto { cabecera: valor }
    globalData = rows.map(row => {
      let obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || "";
      });
      return obj;
    });

    // alert("Vista previa generada. Ahora puedes confirmar y enviar los datos.");
  };

  // Leemos el archivo como arrayBuffer para que SheetJS lo pueda interpretar
  reader.readAsArrayBuffer(file);
}