// Constructor del Offcanvas Dinámico
function DynamicOffcanvas(options) {
    // Configuración predeterminada
    var defaults = {
        id: 'dynamicOffcanvas',
        title: 'Default Title',
        content: 'Default Content',
        class: 'offcanvas-end',
        scroll: true,
        backdrop: false,
        width: '70%', // Nuevo valor por defecto
        height: 'auto' // Puedes agregar height también
    };

    // Fusionar opciones con defaults
    this.settings = Object.assign({}, defaults, options);

    // Inicializar
    this.initialize();
}

DynamicOffcanvas.prototype.initialize = function () {
    this.createOffcanvas();
    this.bsOffcanvas = new bootstrap.Offcanvas(this.offcanvasElement);
};

DynamicOffcanvas.prototype.createOffcanvas = function () {
    var offcanvasHTML = `
    <div class="offcanvas ${this.settings.class}" 
        id="${this.settings.id}" 
        data-bs-scroll="${this.settings.scroll}" 
        data-bs-backdrop="${this.settings.backdrop}" 
        tabindex="-1" 
        aria-labelledby="${this.settings.id}-label" style="width: ${this.settings.width}; height: ${this.settings.height}">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title fw-bold" id="${this.settings.id}-label">
            ${this.settings.title}
          </h5>
          <button class="btn-close text-reset" type="button" data-bs-dismiss="offcanvas" id="btn-close-${this.settings.id}"></button>
        </div>
      <div class="offcanvas-body">
        ${this.settings.content}
      </div>
    </div>
  `;

    var container = document.createElement('div');
    container.innerHTML = offcanvasHTML;
    this.offcanvasElement = container.firstElementChild;
    document.body.appendChild(this.offcanvasElement);
};

DynamicOffcanvas.prototype.updateContent = function (newContent) {
    var body = this.offcanvasElement.querySelector('.offcanvas-body');
    body.innerHTML = newContent;
};

DynamicOffcanvas.prototype.updateTitle = function (newTitle) {
    var title = this.offcanvasElement.querySelector('.offcanvas-title');
    title.innerHTML = newTitle;
};

DynamicOffcanvas.prototype.updateClass = function (newClass) {
    var offcanvas = this.offcanvasElement;

    // Eliminar todas las clases de posición de offcanvas
    Array.from(offcanvas.classList)
        .filter(cls => cls.startsWith('offcanvas-') && cls !== 'offcanvas')
        .forEach(cls => offcanvas.classList.remove(cls));

    // Agregar la nueva clase
    offcanvas.classList.add(newClass);

    // ⚡⚡ Destruir la instancia anterior
    if (this.bsOffcanvas) {
        this.bsOffcanvas.dispose();
    }

    // ⚡⚡ Crear nueva instancia con las nuevas clases
    this.bsOffcanvas = new bootstrap.Offcanvas(this.offcanvasElement);
};

// Función para modificar el ancho
DynamicOffcanvas.prototype.updateWidth = function (newWidth) {
    this.offcanvasElement.style.width = newWidth;
};

// Función para modificar el alto
DynamicOffcanvas.prototype.updateHeight = function (newHeight) {
    this.offcanvasElement.style.height = newHeight;
};

DynamicOffcanvas.prototype.show = function () {
    this.bsOffcanvas.show();
};

DynamicOffcanvas.prototype.hide = function () {
    this.bsOffcanvas.hide();
};

DynamicOffcanvas.prototype.getContent = function () {
    var body = this.offcanvasElement.querySelector('.offcanvas-body');
    return body.innerHTML; // Devuelve el contenido actual
};

// Función para crear badge
function createBadge(text, type) {
    return `
    <span class="badge badge-phoenix fs-10 badge-phoenix-${type}">
      <span class="badge-label">${text}</span>
      <span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span>
    </span>`;
}

// --- Estados de Publicación ---
window.estadosPublicacion = {
    'Pendiente': 'secondary',
    'Publicado': 'info',
    'Cancelado': 'danger',
    'Aceptado': 'success',
    'Pendiente Respuesta': 'warning',
    'Completado': 'success'
};

// Función para obtener el estado corregido
function obtenerEstadoTrazabilidad(tipoTrazabilidad) {
    let textoTrazabilidad = tipoTrazabilidad;

    // Devolvemos el texto corregido y el color
    return {
        texto: textoTrazabilidad,
        color: window.estadosTrazabilidad[textoTrazabilidad] || 'secondary'
    };
}

window.estadosTrazabilidad = {
    'desbloqueado': 'primary',
    'bloqueado': 'warning',
    'ACTIVO': 'success',
    'INHABILITADO': 'danger',
    'Activo': 'success',
    'Inactivo': 'danger',
};