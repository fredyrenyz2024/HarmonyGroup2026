window.VENTANA = null; // Variable global para almacenar el ID
// Definir la función initScript globalmente
window.initScript = function (id) {
  window.VENTANA = id; // Asigna el ID recibido a la variable global
  Listar_clientes();

  // Obtenemos referencias a los elementos
  const select = document.getElementById("miSelect");
  const btnAcciones = document.getElementById("btn-acciones");
  const btnDescargarPlantilla = document.getElementById("boton_descargar_plantilla");
  const divCargue = document.getElementById("cargue_masivo");
  const divCarguePedidos = document.getElementById("visualizar_pedidos");
  const TipoPedido = document.getElementById("seleccionar_tipo_pedido");
  const btn_pedido = document.getElementById("btn-acciones-pedidos");
  const NuevoPedido = document.getElementById("crear_pedido");

  // Escuchamos el evento "change" del select
  select.addEventListener("change", function () {
    // Mostramos el div correspondiente según la opción seleccionada
    const selected = select.value;
    if (selected === "cargue") {
      divCargue.style.display = '';
      divCarguePedidos.style.display = '';
      btnAcciones.style.display = '';
      btnDescargarPlantilla.style.display = '';
      TipoPedido.style.display = 'none';
      NuevoPedido.style.display = 'none';
    } else if (selected === "crear_pedido") {
      divCarguePedidos.style.display = "none";
      divCargue.style.display = "none";
      btnAcciones.style.display = "none";
      btnDescargarPlantilla.style.display = "none";
      TipoPedido.style.display = "none";
      NuevoPedido.style.display = '';
      btn_pedido.style.display = '';
    }
  });

  document.addEventListener("click", async (e) => {
    // if (e.target.matches("#btn_importar_pedidos") || e.target.matches("#btn_importar_pedidos *")) {
    //   if (globalData.length === 0) {
    //     // alert("No hay datos para enviar. Primero carga y previsualiza un archivo de Excel.");
    //     Swal.fire({
    //       title: "Mensaje!",
    //       text: "No hay datos para enviar. Primero carga y previsualiza un archivo de Excel.",
    //       icon: "warning",
    //       draggable: true
    //     });
    //     return;
    //   }

    //   const result = await Swal.fire({
    //     title: 'Seguro',
    //     text: '¿Desea aprobar la solicitud?',
    //     icon: 'warning',
    //     showCancelButton: true,
    //     confirmButtonColor: '#3B71CA',
    //     cancelButtonColor: '#9FA6B2',
    //     confirmButtonText: 'Aceptar',
    //     cancelButtonText: 'Cancelar',
    //     customClass: {
    //       popup: 'swal2-custom-font',
    //     },
    //   });

    //   if (result.isConfirmed) {
    //     // Mostramos indicador de carga
    //     const btn = document.querySelector("#btn_importar_pedidos");
    //     btn.disabled = true;
    //     btn.innerHTML = "Importando... ⏳";
    //     try {
    //       const response = await fetch($('#base_url').val() + 'torrecontrol/importar_pedidos_masivos', {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(globalData)
    //       });

    //       const data = await response.json();

    //       Swal.fire({
    //         title: "Mensaje!",
    //         text: data.message,
    //         icon: data.status === true ? "success" : "error",
    //         draggable: true
    //       });

    //     } catch (err) {  // ← Aquí estaba el error
    //       console.error(err);
    //       alert("Error al enviar datos al servidor.");
    //     } finally {
    //       // Ocultamos indicador de carga
    //       btn.disabled = false;
    //       btn.innerHTML = "<span class='uil uil-file-import'></span> Importar Pedidos";
    //     }
    //   }
    // }

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

      if (document.getElementById("miSelectModalidad").value === '') {
        Swal.fire({
          title: "Mensaje!",
          text: "Seleccione una modalidad.",
          icon: "warning",
          draggable: true
        });
        document.getElementById("miSelectModalidad").classList.add("is-invalid");
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
            body: JSON.stringify({
              globalData: globalData,
              Modalidad: document.getElementById("miSelectModalidad").value
            })
          });

          const data = await response.json();

          Swal.fire({
            title: "Mensaje!",
            text: data.message,
            icon: data.status === true ? "success" : "error",
            draggable: true
          });

        } catch (err) {
          console.error(err);
          alert("Error al enviar datos al servidor.");
        } finally {
          btn.disabled = false;
          btn.innerHTML = "<span class='uil uil-file-import'></span> Importar Pedidos";
        }

      }
    }

    if (e.target.matches("#btn-cancelar-importacion") || e.target.matches("#btn-cancelar-importacion *")) {
      divCarguePedidos.style.display = "none";
      divCargue.style.display = "none";
      btnAcciones.style.display = "none";
      btnDescargarPlantilla.style.display = "none";
      TipoPedido.style.display = "";
    } else if (e.target.matches("btn-cancelar-pedido") || e.target.matches("#btn-cancelar-pedido *")) {

    }

    if (e.target.matches("#agregar_fila") || e.target.matches("#agregar_fila *")) {
      // e.preventDefault();
      agregar_mercancia();
    }
    if (e.target.matches("#btn_guardar_pedido") || e.target.matches("#btn_guardar_pedido *")) {
      // e.preventDefault();
      guardar_mercancias();
    }

  });
}

// Variable global donde guardaremos los datos en formato de objetos (JSON)
// let globalData = [];
if (!window.globalData) {
  window.globalData = [];
} else {
  console.log('El offcanvas ya está creado.');
}

// function leerExcel() {
//   const fileInput = document.getElementById('excelFile');
//   const file = fileInput.files[0];

//   if (!file) {
//     alert("Por favor selecciona un archivo de Excel primero.");
//     return;
//   }

//   const reader = new FileReader();

//   reader.onload = function (e) {
//     const data = new Uint8Array(e.target.result);
//     const workbook = XLSX.read(data, { type: 'array' });

//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];

//     const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

//     if (sheetData.length === 0) {
//       alert("El archivo está vacío o no tiene datos.");
//       return;
//     }

//     const previewTable = document.getElementById("previewTable");
//     previewTable.innerHTML = "";

//     // Crear encabezados de la tabla
//     const thead = document.createElement("thead");
//     thead.style.fontSize = "10px";
//     thead.style.color = "#332D2D";

//     const headerRow = document.createElement("tr");
//     headerRow.classList.add("text-center");
//     const headers1 = sheetData[0].filter(header => header.trim() !== ""); // Filtra vacíos
//     headers1.forEach(headerText => {
//       const th = document.createElement("th");
//       th.textContent = headerText;
//       headerRow.appendChild(th);
//     });

//     // Agregar una columna adicional para el botón de eliminar
//     const thEliminar = document.createElement("th");
//     thEliminar.textContent = "Acciones";
//     headerRow.appendChild(thEliminar);

//     thead.appendChild(headerRow);
//     previewTable.appendChild(thead);

//     // Crear cuerpo de la tabla con las filas
//     const tbody = document.createElement("tbody");
//     tbody.style.fontSize = "10px";
//     tbody.style.textAlign = "center";

//     const headers = sheetData[0]; // Definir headers antes del bucle

//     sheetData.slice(1).forEach((rowData, rowIndex) => {
//       const row = document.createElement("tr");

//       rowData.forEach((cellData, index) => {
//         const td = document.createElement("td");

//         // // Convertir fechas en formato numérico a fecha legible
//         // if (typeof cellData === "number" && headers[index].toLowerCase().includes("fecha")) {
//         //   let date = new Date((cellData - 25569) * 86400 * 1000);
//         //   td.textContent = date.toISOString().split("T")[0];
//         // } else {
//         //   td.textContent = (cellData !== undefined && cellData !== null) ? cellData : "";
//         // }

//         if (typeof cellData === "number") {
//           if (headers[index].toLowerCase().includes("fecha")) {
//             // Convertir la fecha en formato numérico de Excel a formato legible
//             let date = new Date((cellData - 25569) * 86400 * 1000);
//             td.textContent = date.toISOString().split("T")[0];
//           } else if (headers[index].toLowerCase().includes("hora")) {
//             // Convertir la hora en decimal a HH:MM:SS
//             let totalSeconds = Math.round(cellData * 86400); // Convertir fracción de día a segundos
//             let hours = Math.floor(totalSeconds / 3600);
//             let minutes = Math.floor((totalSeconds % 3600) / 60);
//             let seconds = totalSeconds % 60;

//             // Formatear con ceros a la izquierda
//             let formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
//             td.textContent = formattedTime;
//           } else {
//             td.textContent = cellData;
//           }
//         } else {
//           td.textContent = (cellData !== undefined && cellData !== null) ? cellData : "";
//         }



//         row.appendChild(td);
//       });
//       // Agregar botón de eliminar
//       const tdEliminar = document.createElement("td");
//       const btnEliminar = document.createElement("button");
//       // btnEliminar.textContent = "Eliminar";
//       btnEliminar.innerHTML = `<span class="uil-trash-alt"></span>`;
//       btnEliminar.classList.add("btn", "btn-subtle-danger", "btn-sm", "me-1", "px-1", "py-0");
//       // btnEliminar.onclick = function () {
//       //   if (confirm("¿Estás seguro de que quieres eliminar esta fila?")) {
//       //     row.remove(); // Eliminar la fila del DOM
//       //     globalData.splice(rowIndex, 1); // Eliminar del array global
//       //   }
//       // };

//       btnEliminar.onclick = function () {
//         if (confirm("¿Estás seguro de que quieres eliminar esta fila?")) {
//           row.remove(); // Eliminar del DOM

//           // Buscar el índice correcto en globalData
//           let indexToRemove = globalData.findIndex(item =>
//             Object.values(item).join("") === row.innerText.replace(/\s/g, "")
//           );

//           if (indexToRemove > -1) {
//             globalData.splice(indexToRemove, 1); // Eliminar del array global
//           }
//         }
//       };

//       tdEliminar.appendChild(btnEliminar);
//       row.appendChild(tdEliminar);

//       tbody.appendChild(row);
//     });

//     previewTable.appendChild(tbody);

//     // globalData = sheetData.slice(1).map(row => {
//     //   let obj = {};
//     //   headers.forEach((header, index) => {
//     //     let cellData = row[index] || "";

//     //     // Convertir fechas si el header contiene "fecha"
//     //     if (typeof cellData === "number" && header.toLowerCase().includes("fecha")) {
//     //       let date = new Date((cellData - 25569) * 86400 * 1000);
//     //       cellData = date.toISOString().split("T")[0]; // Formato YYYY-MM-DD
//     //     }

//     //     obj[header] = cellData;
//     //   });
//     //   return obj;
//     // });

//     globalData = sheetData.slice(1).map(row => {
//       let obj = {};
//       headers.forEach((header, index) => {
//         let cellData = row[index] || "";

//         if (typeof cellData === "number") {
//           if (header.toLowerCase().includes("fecha")) {
//             // Convertir fecha en formato Excel a YYYY-MM-DD
//             let date = new Date((cellData - 25569) * 86400 * 1000);
//             cellData = date.toISOString().split("T")[0];
//           } else if (header.toLowerCase().includes("hora")) {
//             // Convertir hora en decimal a HH:MM:SS
//             let totalSeconds = Math.round(cellData * 86400); // Convertir fracción de día a segundos
//             let hours = Math.floor(totalSeconds / 3600);
//             let minutes = Math.floor((totalSeconds % 3600) / 60);
//             let seconds = totalSeconds % 60;

//             // Formatear con ceros a la izquierda
//             cellData = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
//           }
//         }

//         obj[header] = cellData;
//       });
//       return obj;
//     });


//   };

//   reader.readAsArrayBuffer(file);
// }


// function leerExcel() {
//   const fileInput = document.getElementById('excelFile');
//   const file = fileInput.files[0];

//   if (!file) {
//     alert("Por favor selecciona un archivo de Excel primero.");
//     return;
//   }

//   const reader = new FileReader();

//   reader.onload = function (e) {
//     const data = new Uint8Array(e.target.result);
//     const workbook = XLSX.read(data, { type: 'array' });

//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

//     if (sheetData.length === 0) {
//       alert("El archivo está vacío o no tiene datos.");
//       return;
//     }

//     const previewTable = document.getElementById("previewTable");
//     previewTable.innerHTML = "";

//     // Crear encabezados de la tabla
//     const thead = document.createElement("thead");
//     thead.style.fontSize = "10px";
//     thead.style.color = "#332D2D";

//     const headerRow = document.createElement("tr");
//     headerRow.classList.add("text-center");
//     const headers = sheetData[0].filter(header => header.trim() !== "");
//     headers.forEach(headerText => {
//       const th = document.createElement("th");
//       th.textContent = headerText;
//       headerRow.appendChild(th);
//     });

//     const thEliminar = document.createElement("th");
//     thEliminar.textContent = "Acciones";
//     headerRow.appendChild(thEliminar);

//     thead.appendChild(headerRow);
//     previewTable.appendChild(thead);

//     const tbody = document.createElement("tbody");
//     tbody.style.fontSize = "10px";
//     tbody.style.textAlign = "center";

//     const allHeaders = sheetData[0]; // Headers completos, para globalData

//     // Buscamos dinámicamente el índice de "Pedido"
//     const pedidoIndex = allHeaders.findIndex(h => h.trim().toLowerCase() === "pedido");

//     if (pedidoIndex === -1) {
//       alert("No se encontró la columna 'Pedido' en el archivo.");
//       return;
//     }

//     sheetData.slice(1).forEach((rowData, rowIndex) => {
//       const row = document.createElement("tr");

//       rowData.forEach((cellData, index) => {
//         const td = document.createElement("td");

//         if (typeof cellData === "number") {
//           if (allHeaders[index].toLowerCase().includes("fecha")) {
//             let date = new Date((cellData - 25569) * 86400 * 1000);
//             td.textContent = date.toISOString().split("T")[0];
//           } else if (allHeaders[index].toLowerCase().includes("hora")) {
//             let totalSeconds = Math.round(cellData * 86400);
//             let hours = Math.floor(totalSeconds / 3600);
//             let minutes = Math.floor((totalSeconds % 3600) / 60);
//             let seconds = totalSeconds % 60;
//             td.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
//           } else {
//             td.textContent = cellData;
//           }
//         } else {
//           td.textContent = (cellData !== undefined && cellData !== null) ? cellData : "";
//         }

//         row.appendChild(td);
//       });

//       // Botón de eliminar
//       const tdEliminar = document.createElement("td");
//       const btnEliminar = document.createElement("button");
//       btnEliminar.innerHTML = `<span class="uil-trash-alt"></span>`;
//       btnEliminar.classList.add("btn", "btn-subtle-danger", "btn-sm", "me-1", "px-1", "py-0");

//       btnEliminar.onclick = function () {
//         if (confirm("¿Estás seguro de que quieres eliminar esta fila?")) {
//           const cells = row.querySelectorAll("td");
//           const pedido = cells[pedidoIndex]?.innerText?.trim();

//           if (!pedido) {
//             alert("No se pudo identificar el pedido para eliminar.");
//             return;
//           }

//           const indexToRemove = globalData.findIndex(item =>
//             item["Pedido"]?.toString().trim() === pedido
//           );

//           if (indexToRemove > -1) {
//             globalData.splice(indexToRemove, 1);
//           } else {
//             console.warn("Pedido no encontrado en globalData:", pedido);
//           }

//           row.remove(); // Eliminar visualmente
//         }
//       };

//       tdEliminar.appendChild(btnEliminar);
//       row.appendChild(tdEliminar);

//       tbody.appendChild(row);
//     });

//     previewTable.appendChild(tbody);

//     // Construir el globalData
//     globalData = sheetData.slice(1).map(row => {
//       let obj = {};
//       allHeaders.forEach((header, index) => {
//         let cellData = row[index] || "";

//         if (typeof cellData === "number") {
//           if (header.toLowerCase().includes("fecha")) {
//             let date = new Date((cellData - 25569) * 86400 * 1000);
//             cellData = date.toISOString().split("T")[0];
//           } else if (header.toLowerCase().includes("hora")) {
//             let totalSeconds = Math.round(cellData * 86400);
//             let hours = Math.floor(totalSeconds / 3600);
//             let minutes = Math.floor((totalSeconds % 3600) / 60);
//             let seconds = totalSeconds % 60;
//             cellData = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
//           }
//         }

//         obj[header] = cellData;
//       });
//       return obj;
//     });
//   };

//   reader.readAsArrayBuffer(file);
// }


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
    const workbook = XLSX.read(data, { type: 'array' });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    if (sheetData.length === 0) {
      alert("El archivo está vacío o no tiene datos.");
      return;
    }

    const previewTable = document.getElementById("previewTable");
    previewTable.innerHTML = "";

    // Crear encabezados de la tabla
    const thead = document.createElement("thead");
    thead.style.fontSize = "10px";
    thead.style.color = "#332D2D";

    const headerRow = document.createElement("tr");
    headerRow.classList.add("text-center");

    const headers = sheetData[0].filter(header => header && header.trim() !== "");
    headers.forEach(headerText => {
      const th = document.createElement("th");
      th.textContent = headerText;
      headerRow.appendChild(th);
    });

    const thEliminar = document.createElement("th");
    thEliminar.textContent = "Acciones";
    headerRow.appendChild(thEliminar);

    thead.appendChild(headerRow);
    previewTable.appendChild(thead);

    const tbody = document.createElement("tbody");
    tbody.style.fontSize = "10px";
    tbody.style.textAlign = "center";

    const allHeaders = sheetData[0]; // Headers completos

    // Buscar índice de "Pedido"
    const pedidoIndex = allHeaders.findIndex(h => h && h.trim().toLowerCase() === "pedido");
    if (pedidoIndex === -1) {
      alert("No se encontró la columna 'Pedido' en el archivo.");
      return;
    }

    // Filtrar filas útiles (que tengan datos)
    const filasUtiles = sheetData.slice(1).filter(row =>
      row.some(cell => cell !== undefined && cell !== null && String(cell).trim() !== "")
    );

    filasUtiles.forEach((rowData, rowIndex) => {
      const row = document.createElement("tr");

      rowData.forEach((cellData, index) => {
        const td = document.createElement("td");

        if (typeof cellData === "number") {
          if (allHeaders[index].toLowerCase().includes("fecha")) {
            let date = new Date((cellData - 25569) * 86400 * 1000);
            td.textContent = date.toISOString().split("T")[0];
          } else if (allHeaders[index].toLowerCase().includes("hora")) {
            let totalSeconds = Math.round(cellData * 86400);
            let hours = Math.floor(totalSeconds / 3600);
            let minutes = Math.floor((totalSeconds % 3600) / 60);
            let seconds = totalSeconds % 60;
            td.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
          } else {
            td.textContent = cellData;
          }
        } else {
          td.textContent = (cellData !== undefined && cellData !== null) ? cellData : "";
        }

        row.appendChild(td);
      });

      // Botón de eliminar
      const tdEliminar = document.createElement("td");
      const btnEliminar = document.createElement("button");
      btnEliminar.innerHTML = `<span class="uil-trash-alt"></span>`;
      btnEliminar.classList.add("btn", "btn-subtle-danger", "btn-sm", "me-1", "px-1", "py-0");

      btnEliminar.onclick = function () {
        if (confirm("¿Estás seguro de que quieres eliminar esta fila?")) {
          const cells = row.querySelectorAll("td");
          const pedido = cells[pedidoIndex]?.innerText?.trim();

          if (!pedido) {
            alert("No se pudo identificar el pedido para eliminar.");
            return;
          }

          const indexToRemove = globalData.findIndex(item =>
            item["Pedido"]?.toString().trim() === pedido
          );

          if (indexToRemove > -1) {
            globalData.splice(indexToRemove, 1);
          } else {
            console.warn("Pedido no encontrado en globalData:", pedido);
          }

          row.remove(); // Eliminar visualmente
        }
      };

      tdEliminar.appendChild(btnEliminar);
      row.appendChild(tdEliminar);

      tbody.appendChild(row);
    });

    previewTable.appendChild(tbody);

    // Construir el globalData
    globalData = filasUtiles.map((rowData) => {
      let obj = {};
      allHeaders.forEach((header, index) => {
        let cellData = rowData[index] || "";

        if (typeof cellData === "number") {
          if (header.toLowerCase().includes("fecha")) {
            let date = new Date((cellData - 25569) * 86400 * 1000);
            cellData = date.toISOString().split("T")[0];
          } else if (header.toLowerCase().includes("hora")) {
            let totalSeconds = Math.round(cellData * 86400);
            let hours = Math.floor(totalSeconds / 3600);
            let minutes = Math.floor((totalSeconds % 3600) / 60);
            let seconds = totalSeconds % 60;
            cellData = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
          }
        }

        obj[header] = cellData;
      });
      return obj;
    });
  };

  reader.readAsArrayBuffer(file);
}


async function Listar_clientes() {
  // Vaciar el contenido de los selects específicos usando el identificador dinámico
  $('#slct_clientes_').empty();

  try {
    const response = await fetch($('#base_url').val() + 'parametros/Listar_clientes', {
      method: 'POST',
      dataType: 'json',
      cache: 'no-cache'
    });
    const data = await response.json();

    // Caso general: llenar los selects con la data obtenida
    data.forEach(function (element) {
      $('#slct_clientes_').append('<option value="' + element.id + '">' + element.nombre + '</option>');
    });

    // Inicializar (o reinicializar) los selects con Select2 para ambos casos
    $('#slct_clientes_').select2({
      placeholder: 'Seleccione una opción',
      allowClear: true
    });

  } catch (error) {
    console.error('Error en la solicitud:', error);
    throw error;
  }
}

// let contadorMercancias = 0; // Contador global para IDs únicos
if (!window.contadorMercancias) {
  window.contadorMercancias = 0;
} else {
  console.log('El offcanvas ya está creado.');
}

function agregar_mercancia() {
  contadorMercancias++;

  // Crear IDs únicos para la nueva pestaña y su contenido
  const tabId = `mercancia-${contadorMercancias}`;
  const contentId = `content-${contadorMercancias}`;

  // 1. Template Header (Tabs)
  const nuevoTab = `
        <li class="nav-item" role="presentation">
            <a class="nav-link" id="${tabId}-tab" data-bs-toggle="tab" href="#${contentId}" role="tab" aria-controls="${contentId}" aria-selected="false">
                Mercancia ${contadorMercancias}
            </a>
        </li>
    `;

  // Agregar nuevo tab al header
  $('#bloque_header').append(nuevoTab);

  var ciudad_origen = `<select class="form-select form-select-sm slct_origen_" name="origen" id="slct_origen_${contadorMercancias}"></select>`;

  // 2. Template Body (Contenido)
  const nuevoContenido = `
    <div class="tab-pane fade" id="${contentId}" role="tabpanel" aria-labelledby="${tabId}-tab" data-id="${contadorMercancias}">
      <div class="row">
        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
          <div class="mb-3">
            <label class="control-label">(*) Referencia Pedido:</label>
            <input type="text" name="referencia_pedido_${contadorMercancias}" id="referencia_pedido_${contadorMercancias}" placeholder="Referencia del Pedido"
              class="form-control form-control-sm referencia_pedido_">
          </div>
        </div>

        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
          <div class="mb-3">
            <label class="control-label">(*) Ciudad Origen:</label>
            ${ciudad_origen}
          </div>
        </div>

        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
          <div class="mb-3">
            <label class="control-label">(*) Remitente:</label>
            <input type="text" name="sitio_cargue_${contadorMercancias}" id="sitio_cargue_${contadorMercancias}" placeholder="Sitio Cargue"
              class="form-control form-control-sm sitio_cargue_">
          </div>
        </div>

        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
          <div class="mb-3">
            <label class="control-label">(*) Ciudad Destino:</label>
            <select class="form-select form-select-sm slct_destino_" name="destino_${contadorMercancias}" id="slct_destino_${contadorMercancias}">
              <!-- <option value="" disabled="" selected="">Seleccione</option> -->
            </select>
          </div>
        </div>

        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
          <div class="mb-3">
            <label class="control-label">(*) Destinatario:</label>
            <input type="text" name="sitio_descargue_${contadorMercancias}" id="sitio_descargue_${contadorMercancias}" placeholder="Sitio Descargue"
              class="form-control form-control-sm sitio_descargue_">
          </div>
        </div>

        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
          <div class="mb-3">
            <label class="control-label">(*) Codigo Producto:</label>
            <input type="text" name="cod_producto_${contadorMercancias}" id="cod_producto_${contadorMercancias}" placeholder="Codigo Producto"
              class="form-control form-control-sm cod_producto_">
          </div>
        </div>

        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
          <div class="mb-3">
            <label class="control-label">(*) Producto:</label>
            <input type="text" name="producto_${contadorMercancias}" id="producto_${contadorMercancias}" placeholder="Producto"
              class="form-control form-control-sm producto_">
          </div>
        </div>

        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
          <div class="mb-3">
            <label class="control-label">(*) Peso Neto Kg:</label>
            <input type="number" name="peso_neto_${contadorMercancias}" id="peso_neto_${contadorMercancias}" placeholder="Peso Neto"
              class="form-control form-control-sm peso_neto_">
          </div>
        </div>

        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
          <div class="mb-3">
            <label class="control-label">(*) Peso Bruto Kg:</label>
            <input type="number" name="peso_bruto_${contadorMercancias}" id="peso_bruto_${contadorMercancias}" placeholder="Peso Bruto"
              class="form-control form-control-sm peso_bruto_">
          </div>
        </div>

        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
          <div class="mb-3">
            <label class="control-label">(*) Presentación:</label>
            <input type="text" name="presentacion_${contadorMercancias}" id="presentacion_${contadorMercancias}" placeholder="Presentación"
              class="form-control form-control-sm presentacion_">
          </div>
        </div>

        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
          <div class="mb-3">
            <label class="control-label">(*) Unidades:</label>
            <input type="number" name="unidades_${contadorMercancias}" id="unidades_${contadorMercancias}" placeholder="Unidades"
              class="form-control form-control-sm unidades_">
          </div>
        </div>

        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
          <div class="mb-3">
            <label class="control-label">(*) Lote:</label>
            <input type="text" name="lote_${contadorMercancias}" id="lote_${contadorMercancias}" placeholder="Lote" class="form-control form-control-sm lote_">
          </div>
        </div>

        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
          <div class="mb-3">
            <label class="control-label">(*) Numero Estibas:</label>
            <input type="number" name="num_estibas_${contadorMercancias}" id="num_estibas_${contadorMercancias}" placeholder="Estibas"
              class="form-control form-control-sm num_estibas_">
          </div>
        </div>

        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
          <div class="mb-3">
            <label class="control-label">(*) Fecha Cargue:</label>
            <input type="date" name="fecha_cargue_${contadorMercancias}" id="fecha_cargue_${contadorMercancias}" placeholder="Estibas"
              class="form-control form-control-sm fecha_cargue_">
          </div>
        </div>

        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
          <div class="mb-3">
            <label class="control-label">(*) Fecha Entrega:</label>
            <input type="date" name="fecha_entrega_${contadorMercancias}" id="fecha_entrega_${contadorMercancias}" placeholder="Estibas"
              class="form-control form-control-sm fecha_entrega_">
          </div>
        </div>
      </div>
    </div>
    `;
  Municipios(contadorMercancias); // Llama a la función para llenar los municipios
  // Agregar nuevo contenido
  $('#bloques_mercamcia').append(nuevoContenido);

  // Activar automáticamente el nuevo tab
  const tabElement = document.querySelector(`#${tabId}-tab`);
  const tab = new bootstrap.Tab(tabElement);
  tab.show();
}

async function Municipios(cont) {
  // Vaciar el contenido de los selects específicos usando el identificador dinámico
  $('#slct_origen_').html("");
  $('#slct_destino_').html("");

  try {
    const response = await fetch($('#base_url').val() + 'serviciocliente/Consulta_Municipios', {
      method: 'POST',
      dataType: 'json',
      cache: 'no-cache'
    });
    const data = await response.json();

    // Caso general: llenar los selects con la data obtenida
    data.forEach(function (element) {
      $('#slct_origen_' + cont).append('<option value="' + element.municipio + ' - ' + element.depto + '" data-codigo_rndc="' + element.rndc_codigo_ciudad + '">' + element.municipio + '-' + element.depto + '</option>');
      $('#slct_destino_' + cont).append('<option value="' + element.municipio + ' - ' + element.depto + '" data-codigo_rndc="' + element.rndc_codigo_ciudad + '">' + element.municipio + '-' + element.depto + '</option>');
    });

    // Inicializar (o reinicializar) los selects con Select2 para ambos casos
    $('#slct_origen_' + cont).select2({
      placeholder: 'Seleccione una opción',
      allowClear: true
    });
    $('#slct_destino_' + cont).select2({
      placeholder: 'Seleccione una opción',
      allowClear: true
    });

  } catch (error) {
    console.error('Error en la solicitud:', error);
    throw error;
  }
}

async function guardar_mercancias() {
  let mercancias = {
    referencia_pedido: [],
    ciudad_origen: [],
    sitio_cargue: [],
    ciudad_destino: [],
    sitio_descargue: [],
    cod_producto: [],
    producto: [],
    peso_neto: [],
    peso_bruto: [],
    presentacion: [],
    unidades: [],
    lote: [],
    num_estibas: [],
    fecha_cargue: [],
    fecha_entrega: []
  };

  $(".referencia_pedido_").each(function () {
    let referencia_pedido = $(this).val() || "";
    if (!referencia_pedido) {
      console.warn("⚠️ No se encontró referencia_pedido en un input, revisa el HTML.");
      return; // Salta este tab si no tiene ID
    }

    if (referencia_pedido) {
      mercancias.referencia_pedido.push(referencia_pedido);
    } else {
      console.warn(`⚠️ Referencia Pedido ignorado por falta de datos.`);
    }
  });

  $(".slct_origen_").each(function () {
    let ciudad_origen = $(this).val() || "";

    if (!ciudad_origen) {
      console.warn("⚠️ No se encontró ciudad_origen en un input, revisa el HTML.");
      return; // Salta este tab si no tiene ID
    }

    if (ciudad_origen) {
      mercancias.ciudad_origen.push(ciudad_origen);
    } else {
      console.warn(`⚠️ Ciudad Origen ignorado por falta de datos.`);
    }
  });

  $(".sitio_cargue_").each(function () {
    let sitio_cargue = $(this).val() || "";

    if (!sitio_cargue) {
      console.warn("⚠️ No se encontró sitio_cargue en un input, revisa el HTML.");
      return; // Salta este tab si no tiene ID
    }

    if (sitio_cargue) {
      mercancias.sitio_cargue.push(sitio_cargue);
    } else {
      console.warn(`⚠️ Sitio Cargue ignorado por falta de datos.`);
    }
  });

  $(".slct_destino_").each(function () {
    let ciudad_destino = $(this).val() || "";

    if (!ciudad_destino) {
      console.warn("⚠️ No se encontró ciudad_destino en un input, revisa el HTML.");
      return; // Salta este tab si no tiene ID
    }

    if (ciudad_destino) {
      mercancias.ciudad_destino.push(ciudad_destino);
    } else {
      console.warn(`⚠️ Ciudad Destino ignorado por falta de datos.`);
    }
  });

  $(".sitio_descargue_").each(function () {
    let sitio_descargue = $(this).val() || "";

    if (!sitio_descargue) {
      console.warn("⚠️ No se encontró sitio_descargue en un input, revisa el HTML.");
      return; // Salta este tab si no tiene ID
    }

    if (sitio_descargue) {
      mercancias.sitio_descargue.push(sitio_descargue);
    } else {
      console.warn(`⚠️ Sitio Descargue ignorado por falta de datos.`);
    }
  });

  $(".cod_producto_").each(function () {
    let cod_producto = $(this).val() || "";

    if (!cod_producto) {
      console.warn("⚠️ No se encontró cod_producto en un input, revisa el HTML.");
      return; // Salta este tab si no tiene ID
    }

    if (cod_producto) {
      mercancias.cod_producto.push(cod_producto);
    } else {
      console.warn(`⚠️ Cod Producto ignorado por falta de datos.`);
    }
  });

  $(".producto_").each(function () {
    let producto = $(this).val() || "";

    if (!producto) {
      console.warn("⚠️ No se encontró producto en un input, revisa el HTML.");
      return; // Salta este tab si no tiene ID
    }

    if (producto) {
      mercancias.producto.push(producto);
    } else {
      console.warn(`⚠️ Producto ignorado por falta de datos.`);
    }
  });

  $(".peso_neto_").each(function () {
    let peso_neto = $(this).val() || "";

    if (!peso_neto) {
      console.warn("⚠️ No se encontró peso_neto en un input, revisa el HTML.");
      return; // Salta este tab si no tiene ID
    }

    if (peso_neto) {
      mercancias.peso_neto.push(peso_neto);
    } else {
      console.warn(`⚠️ Peso Neto ignorado por falta de datos.`);
    }
  });

  $(".peso_bruto_").each(function () {
    let peso_bruto = $(this).val() || "";
    if (peso_bruto) { // Solo agrega si no está vacío
      mercancias.peso_bruto.push(peso_bruto);
    } else {
      console.warn(`⚠️ Peso Bruto ignorado por falta de datos.`);
    }
  });

  $(".presentacion_").each(function () {
    let presentacion = $(this).val() || "";
    if (presentacion) {
      mercancias.presentacion.push(presentacion);
    } else {
      console.warn(`⚠️ Presentación ignorado por falta de datos.`);
    }
  });

  $(".unidades_").each(function () {
    let unidades = $(this).val() || "";
    if (unidades) {
      mercancias.unidades.push(unidades);
    } else {
      console.warn(`⚠️ Unidades ignorado por falta de datos.`);
    }
  });

  $(".lote_").each(function () {
    let lote = $(this).val() || "";
    if (lote) {
      mercancias.lote.push(lote);
    } else {
      console.warn(`⚠️ Lote ignorado por falta de datos.`);
    }
  });

  $(".num_estibas_").each(function () {
    let num_estibas = $(this).val() || "";
    if (num_estibas) {
      mercancias.num_estibas.push(num_estibas);
    } else {
      console.warn(`⚠️ Número Estibas ignorado por falta de datos.`);
    }
  });

  $(".fecha_cargue_").each(function () {
    let fecha_cargue = $(this).val() || "";
    if (fecha_cargue) {
      mercancias.fecha_cargue.push(fecha_cargue);
    } else {
      console.warn(`⚠️ Fecha Cargue ignorado por falta de datos.`);
    }
  });

  $(".fecha_entrega_").each(function () {
    let fecha_entrega = $(this).val() || "";
    if (fecha_entrega) {
      mercancias.fecha_entrega.push(fecha_entrega);
    } else {
      console.warn(`⚠️ Fecha Entrega ignorado por falta de datos.`);
    }
  });

  console.log("JSON final de mercancías:", JSON.stringify({ mercancias }));

  if (mercancias.length === 0) {
    alert("⚠️ No hay mercancías para enviar. Verifica los formularios.");
    return;
  }

  const base_url = document.getElementById("base_url")?.value || "";
  if (!base_url) {
    console.error("⚠️ base_url no encontrado en el DOM.");
    alert("Error: No se encontró la URL base.");
    return;
  }

  const url = `${base_url}torrecontrol/insertar_pedido_torre_control`;
  console.log("URL de la solicitud:", url);

  // $('#loading-overlay-nexosapp').css('display', 'flex'); // Mostrar mensaje de carga
  // Crear una instancia de FormData
  let formData = new FormData();
  formData.append('mercancias', JSON.stringify(mercancias));
  formData.append('cliente', document.getElementById('slct_clientes_').value);

  try {
    let response = await fetch(url, {
      method: 'POST',
      body: formData,
      cache: 'no-cache',
    });

    let data = await response.json();
    console.log("Respuesta del servidor:", data);

    if (data.success) {
      alert("✅ Mercancías guardadas correctamente.");
      resetFormulario();
    } else {
      alert("❌ Error al guardar las mercancías.");
    }
  } catch (error) {
    console.error("❌ Error en la solicitud:", error);
    alert("Error en la solicitud. Verifica la conexión con el servidor.");
  }
}

// 🔹 Función para reiniciar los campos del formulario y las pestañas
function resetFormulario() {
  document.querySelectorAll(".tab-pane").forEach((pane) => {
    pane.querySelectorAll("input, select, textarea").forEach((input) => {
      input.value = ""; // Limpia todos los inputs
    });
  });

  // Reiniciar la primera pestaña como activa si estás usando Bootstrap Tabs
  let firstTab = document.querySelector(".nav-tabs li:first-child a");
  if (firstTab) {
    firstTab.click();
  }
}