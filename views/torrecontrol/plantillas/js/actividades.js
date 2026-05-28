// alert("HOla");window.VENTANA = null; // Variable global para almacenar el ID
// Definir la función initScript globalmente
window.initScript = function (id) {
  window.VENTANA = id; // Asigna el ID recibido a la variable global
  Listar_tipos_trazabilidad();
};

async function Listar_tipos_trazabilidad() {
  try {
    const response = await fetch($('#base_url').val() + 'pedidos/Listar_Tipos_Seguimiento', {
      method: 'POST',
      cache: 'no-cache',
    });

    const data = await response.json();
    const container = document.getElementById('tipos_trazabilidad');
    container.innerHTML = '';

    if (data.length > 0) {
      const accordion = document.createElement('div');
      accordion.className = 'accordion';
      accordion.id = 'accordionTiposTrazabilidad';

      data.forEach((element, index) => {
        const itemId = `collapseTipo${index}`;
        const headingId = `headingTipo${index}`;
        const operacionesDivId = `operaciones_${index}`; // <--- nombre real del contenedor

        const accordionItem = `
          <div class="accordion-item">
            <h2 class="accordion-header" id="${headingId}">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                data-bs-target="#${itemId}" aria-expanded="false" aria-controls="${itemId}">
                ${element.nombre_tipo}
              </button>
            </h2>
            <div id="${itemId}" class="accordion-collapse collapse" aria-labelledby="${headingId}" data-bs-parent="#accordionTiposTrazabilidad"
              data-tipo-id="${element.id}" data-container-id="${operacionesDivId}">
              <div class="accordion-body">
                <div id="${operacionesDivId}" class="mt-2">Cargando...</div>
              </div>
            </div>
          </div>
        `;

        accordion.insertAdjacentHTML('beforeend', accordionItem);
      });

      container.appendChild(accordion);

      // Escuchar la apertura de cualquier acordeón del grupo
      const allItems = accordion.querySelectorAll('.accordion-collapse');
      allItems.forEach(item => {
        item.addEventListener('shown.bs.collapse', function () {
          const idTipo = item.getAttribute('data-tipo-id');
          const containerId = item.getAttribute('data-container-id');
          Listar_tipos_operacion(idTipo, containerId); // <--- llamada correcta
        });
      });

    } else {
      container.innerHTML = `<div class="alert alert-warning">No se encontraron tipos de trazabilidad.</div>`;
    }
  } catch (error) {
    console.error("Error al cargar los tipos de trazabilidad:", error);
    container.innerHTML = `<div class="alert alert-danger">Error al cargar datos.</div>`;
  }
}

async function Listar_tipos_operacion(idTipo, containerId) {
  try {
    let formData = new FormData();
    formData.append("id", idTipo);

    const response = await fetch($('#base_url').val() + 'pedidos/Listar_Opciones', {
      method: 'POST',
      cache: 'no-cache',
      body: formData
    });

    const data = await response.json();
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    if (data.length > 0) {
      const ul = document.createElement('ul');
      ul.className = 'list-group';

      data.forEach(function (element) {
        const li = document.createElement('li');
        li.className = 'list-group-item';

        // Contenedor interno con 3 columnas
        const rowDiv = document.createElement('div');
        rowDiv.className = 'd-flex align-items-center justify-content-between w-100';

        // Columna: Nombre
        const nameDiv = document.createElement('div');
        nameDiv.className = 'flex-grow-1';
        const nameSpan = document.createElement('strong');
        nameSpan.textContent = element.nombre_opcion;
        nameSpan.style.fontSize = '13px';
        nameDiv.appendChild(nameSpan);

        // Columna: Estado
        const estadoDiv = document.createElement('div');
        estadoDiv.className = 'text-center';
        estadoDiv.style.width = '100px'; // fijo para centrar y evitar que se pegue
        const estadoBadge = document.createElement('span');
        estadoBadge.textContent = element.estado_opcion;
        estadoBadge.className = element.estado_opcion === 'ACTIVO'
          ? 'badge badge-phoenix badge-phoenix-success'
          : 'badge badge-phoenix badge-phoenix-danger';
        estadoBadge.style.fontSize = '11px';
        estadoDiv.appendChild(estadoBadge);

        // Columna: Botón
        const buttonDiv = document.createElement('div');
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.className = 'btn btn-sm btn-outline-secondary';
        buttonDiv.appendChild(editButton);


        editButton.onclick = () => {
          // Evitar múltiples formularios abiertos
          if (li.querySelector('input')) return;

          // Input nombre
          const input = document.createElement('input');
          input.type = 'text';
          input.value = element.nombre_opcion;
          input.className = 'form-control form-control-sm mt-2';

          // Select estado
          const select = document.createElement('select');
          select.className = 'form-select form-select-sm mt-2';
          ['ACTIVO', 'INACTIVO'].forEach(status => {
            const option = document.createElement('option');
            option.value = status;
            option.text = status;
            if (element.estado_opcion === status) option.selected = true;
            select.appendChild(option);
          });

          // Botón guardar
          const saveButton = document.createElement('button');
          saveButton.textContent = 'Guardar';
          saveButton.className = 'btn btn-sm btn-success mt-2';

          saveButton.onclick = async () => {
            const nuevoNombre = input.value.trim();
            const nuevoEstado = select.value;

            if (!nuevoNombre) {
              alert("El nombre no puede estar vacío.");
              return;
            }

            let formUpdate = new FormData();
            formUpdate.append("id_opcion", element.id);
            formUpdate.append("nombre", nuevoNombre);
            formUpdate.append("estado", nuevoEstado);

            try {
              const resp = await fetch($('#base_url').val() + 'torrecontrol/Editar_Actividad', {
                method: 'POST',
                body: formUpdate
              });

              const result = await resp.json();

              const icono = result.numero === 200 ? 'success' : 'error';
              const titulo = result.numero === 200 ? 'Actualizado' : 'Error';

              Swal.fire({
                title: titulo,
                html: result.mensaje || 'Sin mensaje.',
                icon: icono,
                customClass: { popup: 'swal2-custom-font' },
              });

              if (result.numero === 200) {
                Listar_tipos_operacion(idTipo, containerId);
              }

            } catch (err) {
              console.error("Error al actualizar:", err);
              alert("Error al actualizar.");
            }
          };

          li.appendChild(document.createElement('hr'));
          li.appendChild(input);
          li.appendChild(select);
          li.appendChild(saveButton);
        };

        // Agregar todo al contenedor
        rowDiv.appendChild(nameDiv);
        rowDiv.appendChild(estadoDiv);
        rowDiv.appendChild(buttonDiv);

        // Agregar contenedor al li
        li.appendChild(rowDiv);
        ul.appendChild(li);


      });

      container.appendChild(ul);
    } else {
      container.innerHTML = '<div class="alert alert-warning">No hay tipos disponibles</div>';
    }

    // Contenedor y botón para agregar nueva operación
    const formContainer = document.createElement('div');
    formContainer.className = 'mt-2';

    const addButton = document.createElement('button');
    addButton.className = 'btn btn-sm btn-outline-primary mt-2';
    addButton.textContent = 'Agregar nueva operación';

    addButton.onclick = () => {
      if (formContainer.querySelector('input')) return;

      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Nombre de la operación';
      input.className = 'form-control mt-2';

      const saveButton = document.createElement('button');
      saveButton.textContent = 'Guardar';
      saveButton.className = 'btn btn-success btn-sm mt-2';

      saveButton.onclick = async () => {
        const nombre = input.value.trim();
        if (!nombre) return alert("Debes ingresar un nombre.");

        let formData = new FormData();
        formData.append("id_tipo_padre", idTipo);
        formData.append("nombre_operacion", nombre);

        try {
          const resp = await fetch($('#base_url').val() + 'torrecontrol/Guardar_Actividad', {
            method: 'POST',
            body: formData
          });

          const result = await resp.json();

          const icono = result.numero === 200 ? 'success' : 'error';
          const titulo = result.numero === 200 ? 'Mensaje' : 'Error';

          Swal.fire({
            title: titulo,
            html: result.mensaje || 'Sin mensaje.',
            icon: icono,
            customClass: { popup: 'swal2-custom-font' },
          });

          if (result.numero === 200) {
            Listar_tipos_operacion(idTipo, containerId);
          }

        } catch (err) {
          console.error("Error en guardar operación:", err);
          alert("Error al guardar operación.");
        }
      };

      formContainer.appendChild(input);
      formContainer.appendChild(saveButton);
    };

    container.appendChild(addButton);
    container.appendChild(formContainer);

  } catch (error) {
    console.error("Error al cargar los tipos de operación:", error);
  }
}

