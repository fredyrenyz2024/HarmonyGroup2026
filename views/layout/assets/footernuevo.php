</main>
<!-- ===============================================-->
<!--    JavaScripts-->
<!-- ===============================================-->
<script src="<?= BASE_URL ?>views/layout/assets/lib/jquery/jquery.min.js" type="text/javascript"></script>
<script src="<?= BASE_URL ?>public/vendors/popper/popper.min.js"></script>
<script src="<?= BASE_URL ?>public/vendors/bootstrap/bootstrap.min.js"></script>
<script src="<?= BASE_URL ?>public/vendors/anchorjs/anchor.min.js"></script>
<script src="<?= BASE_URL ?>public/vendors/is/is.min.js"></script>
<script src="<?= BASE_URL ?>public/vendors/fontawesome/all.min.js"></script>
<script src="<?= BASE_URL ?>public/vendors/lodash/lodash.min.js"></script>
<!-- <script src="https://polyfill.io/v3/polyfill.min.js?features=window.scroll"></script> -->
<script src="<?= BASE_URL ?>public/vendors/list.js/list.min.js"></script>
<script src="<?= BASE_URL ?>public/vendors/feather-icons/feather.min.js"></script>
<script src="<?= BASE_URL ?>public/vendors/dayjs/dayjs.min.js"></script>
<script src="<?= BASE_URL ?>public/vendors/flatpickr/flatpickr.min.js"></script>
<script src="<?= BASE_URL ?>public/vendors/tinymce/tinymce.min.js"></script>
<!-- <script src="<?= BASE_URL ?>public/vendors/choices/choices.min.js"></script> -->
<script src="<?= BASE_URL ?>public/vendors/prism/prism.js"></script>
<script src="<?= BASE_URL ?>public/assets/js/phoenix.js"></script>
<script src="<?= BASE_URL ?>public/src/js/theme/dropdown-on-hover.js" type="module"></script>
<script src="<?= BASE_URL ?>public/vendors/echarts/echarts.min.js"></script>
<!-- <script src="<?= BASE_URL ?>public/vendors/leaflet/leaflet.js"></script> -->
<!-- <script src="<?= BASE_URL ?>public/vendors/leaflet.markercluster/leaflet.markercluster.js"></script> -->
<!-- <script src="<?= BASE_URL ?>public/vendors/leaflet.tilelayer.colorfilter/leaflet-tilelayer-colorfilter.min.js"></script> -->

<script src="<?= BASE_URL ?>public/vendors/glightbox/glightbox.min.js"></script>
<script src="https://unpkg.com/picmo@5.7.6/dist/umd/index.js"></script>
<script src="https://unpkg.com/@picmo/popup-picker@5.7.6/dist/umd/index.js"></script>
<script src="<?= BASE_URL ?>public/vendors/lottie/lottie.min.js"></script>
<!-- <script src="<?= BASE_URL ?>public/assets/js/phoenix.js"></script> -->
<script src="<?= BASE_URL ?>public/assets/js/pages/chat.js"></script>

<script src="<?= BASE_URL ?>public/assets/js/ecommerce-dashboard.js"></script>

<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.27.0/moment.min.js"></script>
<!-- <script src="https://cdn.datatables.net/2.2.2/js/dataTables.min.js"></script> -->
<!-- <script src="https://cdn.datatables.net/2.2.2/js/dataTables.bootstrap5.min.js"></script> -->
 
<!-- JSZip para exportar a Excel -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
<!-- <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script> -->
<!-- <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script> -->
<script src="https://js.pusher.com/8.4.0/pusher.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://cdn.jsdelivr.net/npm/tom-select@2.4.5/dist/js/tom-select.complete.min.js"></script>

<!-- <script src="https://code.jquery.com/jquery-3.7.0.js"></script> -->
<script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/1.13.6/js/dataTables.bootstrap5.min.js"></script>
<script src="https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js"></script>

<script>
  (g => {
    var h, a, k, p = "The Google Maps JavaScript API",
      c = "google",
      l = "importLibrary",
      q = "__ib__",
      m = document,
      b = window;
    b = b[c] || (b[c] = {});
    var d = b.maps || (b.maps = {}),
      r = new Set,
      e = new URLSearchParams,
      u = () => h || (h = new Promise(async (f, n) => {
        await (a = m.createElement("script"));
        e.set("libraries", [...r] + "");
        for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]);
        e.set("callback", c + ".maps." + q);
        a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
        d[q] = f;
        a.onerror = () => h = n(Error(p + " could not load."));
        a.nonce = m.querySelector("script[nonce]")?.nonce || "";
        m.head.append(a)
      }));
    d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n))
  })({
    // key: "AIzaSyAMAVgMHRVN1R3ApTuJQzAMUoQi9sNpZIE",
    key: "AIzaSyAMAVgMHRVN1R3ApTuJQzAMUoQi9sNpZIE",
    v: "weekly",
    // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
    // Add other bootstrap parameters as needed, using camel case.
  });
</script>

<script>
  /**
   * WindowManager: Módulo para emular comportamiento tipo Livewire
   */
  const WindowManager = {
    // Mapa de scripts por ID de ventana (Extraído de tu switch)
    scriptsConfig: {
      '1': ['views/serviciocliente/js/todos.js', 'public/helpers/helpers.js'],
      '2': ['views/serviciocliente/js/prioritarias.js', 'public/helpers/helpers.js'],
      '4': ['views/serviciocliente/js/nueva_solicitud.js'],
      '5': ['views/serviciocliente/js/pendientes.js', 'public/helpers/helpers.js'],
      '7': ['views/serviciocliente/js/completadas.js', 'public/helpers/helpers.js'],
      '8': ['views/prefiltro_nacional/js/prefiltro_nacional.js', 'views/prefiltro_nacional/js/helpers_operaciones.js'],
      '11': ['views/prefiltro_nacional/js/prioritarias_operaciones.js', 'public/helpers/helpers.js'],
      '12': ['views/serviciocliente/js/en_curso.js', 'public/helpers/helpers.js'],
      '13': ['views/prefiltro_nacional/js/pendientes_operaciones.js', 'public/helpers/helpers.js'],
      '14': ['views/prefiltro_nacional/js/en_curso_operaciones.js', 'public/helpers/helpers.js'],
      '16': ['views/torrecontrol/js/administrador_pedidos.js', 'views/torrecontrol/js/SatrackGPS.js', /* 'views/torrecontrol/js/tiempos_logisticos.js', */ 'views/torrecontrol/js/helper_torre_control.js', 'public/assets/js/phoenix.js'],
      '17': ['views/torrecontrol/js/prioritarias_pedidos.js', 'public/helpers/helpers.js'],
      '18': ['views/torrecontrol/js/pendientes_pedidos.js', 'public/helpers/helpers.js'],
      '19': ['views/torrecontrol/js/en_curso_pedidos.js', 'public/helpers/helpers.js'],
      '21': ['views/torrecontrol/js/nuevo_pedido.js'],
      '22': ['views/torrecontrol/proveedor/js/proveedor_pedidos.js', 'views/torrecontrol/proveedor/js/helper_proveedor_torre_control.js'],
      '23': ['views/torrecontrol/proveedor/js/proveedor_prioritarias.js', 'views/torrecontrol/proveedor/js/helper_proveedor_torre_control.js'],
      '24': ['views/torrecontrol/proveedor/js/proveedor_pendientes.js', 'views/torrecontrol/proveedor/js/helper_proveedor_torre_control.js'],
      '25': ['views/torrecontrol/proveedor/js/proveedor_en_curso.js', 'views/torrecontrol/proveedor/js/helper_proveedor_torre_control.js'],
      '26': ['views/torrecontrol/proveedor/js/proveedor_completadas.js', 'views/torrecontrol/proveedor/js/helper_proveedor_torre_control.js'],
      '27': ['views/torrecontrol/cliente/js/clientes_todos.js', 'views/torrecontrol/cliente/js/helper_cliente_torre_control.js'],
      '32': ['views/torrecontrol/cliente/js/clientes_nuevo_pedido.js', 'views/torrecontrol/cliente/js/helper_cliente_torre_control.js'],
      '33': ['views/parametros/proveedor/js/listar_proeevores.js'],
      '34': ['views/parametros/proveedor/js/nuevo_proeevor.js'],
      '35': ['views/parametros/proveedor/js/asignar_proveedor.js'],
      '36': ['views/parametros/servicios/js/listar_servicio.js'],
      '37': ['views/parametros/servicios/js/nuevo_servicio.js'],
      '38': ['views/parametros/servicios/js/nuevo_servicio.js'],
      '39': ['views/torrecontrol/js/recurso_torre_control.js', 'views/torrecontrol/js/helper_torre_control.js'],
      '40': ['views/torrecontrol/proveedor/js/recurso_proveedor_torre_control.js'],
      '41': ['views/torrecontrol/proveedor/js/recurso_proveedor_torre_control.js'],
      '42': ['views/torrecontrol/proveedor/js/trazabilidad_recurso.js', 'views/torrecontrol/js/helper_torre_control.js'],
      '43': ['views/torrecontrol/js/trazabilidad_administrador.js', 'views/torrecontrol/js/helper_torre_control.js'],
      // '44': ['views/torrecontrol/plantillas/js/listar_plantillas.js', 'views/torrecontrol/js/helper_torre_control.js'],
      '44': ['views/torrecontrol/js/plantilla_pedidos.js'],
      '45': ['views/torrecontrol/js/plantilla_pedidos.js'],
      '46': ['views/torrecontrol/cliente/js/trazabilidad_cliente_pedidos.js', 'views/torrecontrol/js/helper_torre_control.js'],
      '47': ['views/torrecontrol/js/informes_torre_control.js'],
      '48': ['views/torrecontrol/cliente/js/informes_cliente_torre_control.js'],
      // '49': ['views/torrecontrol/js/administrador_pedidos.js', 'views/torrecontrol/js/helper_torre_control.js', 'public/assets/js/phoenix.js'],
      '50': ['views/torrecontrol/js/recurso_torre_control.js', 'views/torrecontrol/js/helper_torre_control.js'],
      '51': ['views/torrecontrol/js/indicadores_torre_control.js'],
      '52': ['views/torrecontrol/cliente/js/recurso_cliente_torre_control.js', 'views/torrecontrol/js/helper_torre_control.js'],
      '53': ['views/torrecontrol/plantillas/js/actividades.js'],
      '54': ['views/serviciocliente/js/instruccion_facturacion.js', 'views/seguridad_prefiltro/js/helper_bloqueos.js'],
      '55': ['views/serviciocliente/js/instrucciones.js', 'views/seguridad_prefiltro/js/helper_bloqueos.js', 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'],
      '56': ['views/serviciocliente/js/historico_instrucciones.js', 'views/seguridad_prefiltro/js/helper_bloqueos.js'],
      '57': ['views/seguridad_prefiltro/js/bloqueos.js', 'views/seguridad_prefiltro/js/helper_bloqueos.js'],
      '58': ['views/seguridad_prefiltro/js/clientes_bloqueos.js', 'views/seguridad_prefiltro/js/helper_bloqueos.js'],
      '59': ['views/parametros/precintos/js/precinto.js'],
      '60': ['views/parametros/precintos/js/inventario.js'],
      '61': ['views/torrecontrol/js/graficos_torre_control.js'],
      '62': ['views/preestudiov/js/estudios_seguridad.js'],
      '63': ['views/prefiltro_nacional/js/enturnados.js'],
      '64': ['views/prefiltro_nacional/js/contenedor_vacio.js'],
      '65': ['views/seguridad_prefiltro/js/estudios_de_seguridad.js'],
      '66': ['views/prefiltro_nacional/js/subasta.js'],
      '67': ['views/prefiltro_nacional/js/ajax.js'],
      '68': ['views/prefiltro_nacional/js/tbremesaajax.js'],
      '69': ['views/prefiltro_nacional/js/vermnfajax.js'],
      '70': ['views/prefiltro_nacional/js/tbcumplidoajax.js'],
      '71': ['views/control_ruta/js/rutas.js'],
      '72': ['views/novedades/js/portal_envios.js'],
      '73': ['views/clientes/js/administrar_clientes.js', 'public/helpers/helpers.js'],
      '74': ['views/torrecontrol/tareas/js/tareas_compartidas.js'],
      '75': ['views/indicadores/js/graficos_precintos.js'],
      '76': ['views/parametros/js/configuracion_correo.js'],
      '77': ['views/indicadores/js/graficos_manifiestos.js'],
      '78': ['views/indicadores/js/graficos_solicitudes.js'],
      '79': ['views/indicadores/js/indicadores_solicitudes.js'],
      '80': ['views/indicadores/js/grafico_tipo_vehiculo.js'],
      '81': ['views/indicadores/js/graficos_instrucciones.js'],
      '82': ['views/indicadores/js/graficos_remesas.js'],
      '83': ['views/indicadores/js/graficos_estudios.js'],
      '84': ['views/indicadores/js/graficos_analitica.js'],
      '85': ['views/indicadores/js/graficos_filtros.js'],
      '86': ['views/serviciocliente/js/contabilidad_facturacion.js'],
      '87': ['views/parametros/tarifas/js/tarifa_ventas.js'],
      '88': ['views/parametros/tarifas/js/flete_nacional.js'],
      '89': ['views/parametros/tarifas/js/tarifa_servicio_especial.js'],
      '90': ['views/parametros/tarifas/js/tarifa_venta_servicio_especial.js'],
      '91': ['views/indicadores/js/grafico_instruciones_anulada.js'],
      '92': ['views/indicadores/js/graficos_ventas_costo.js'],
      '93': ['views/novedades/pagos/js/portal_pagos.js'],
      '94': ['views/novedades/js/datos_bancarios_proveedor.js'],
      '95': ['views/parametros/precintos/js/bodegas.js'],
      '96': ['views/novedades/pagos/js/cartera_cliente.js'],
      '97': ['views/prefiltro_nacional/js/compromisos.js'],
      '98': ['views/novedades/pagos/js/tarjetas_bancarias.js'],
      '99': ['views/novedades/pagos/js/asignar_tarjetas.js'],
      '100': ['views/novedades/pagos/js/liquidaciones.js'],
      '101': ['views/novedades/pagos/js/comprobar_documentos.js'],
      '103': ['views/prefiltro_nacional/js/enturnado.js'],
      '104': ['views/torrecontrol/js/seguimiento_facturacion.js', 'views/torrecontrol/js/helper_torre_control.js'],
      '105': ['views/torrecontrol/js/seguimiento_facturacion.js', 'views/torrecontrol/js/helper_torre_control.js'],
      '106': ['views/torrecontrol/js/seguimiento_facturacion.js', 'views/torrecontrol/js/helper_torre_control.js'],
      '107': ['views/servicios_especiales/js/crear_servicio.js'],
      '108': ['views/servicios_especiales/js/listar_servicios_especiales.js'],
      '109': ['views/prefiltro_nacional/js/historico_enturnado.js'],
      '110': ['views/torrecontrol/js/bandeja_pendientes.js', 'views/torrecontrol/js/helper_torre_control.js'],
      '111': ['views/torrecontrol/proveedor/js/gestion_proveedor.js', 'views/torrecontrol/js/helper_torre_control.js'],
      // '112': ['views/parametros/zonas/js/zona.js'],
      '113': ['views/novedades/facturacion/js/facturacion_dsnube.js'],
      '114': ['views/pantallas/js/parametros_general.js'],
      '115': ['views/parametros/tarifas/js/aprobaciones_tarifas.js'],
      '116': ['views/parametros/tarifas/js/bandeja_aprobacion.js'],
      '117': ['views/pantallas/js/causales_aprobacion.js'],
      '118': ['views/parametros/tarifas/js/rutas_frecuentes.js'],
      '119': ['views/pantallas/zonas/js/zona.js'],
      '120': ['views/parametros/tarifas/js/generador_tarifas.js'],
      '121': ['views/parametros/tarifas/js/generacion_automaticas.js'],
      '122': ['views/parametros/tarifas/js/tarifas_sicetac.js'],
      '123': ['views/parametros/tarifas/js/indicadores.js'],
      '125': ['views/torrecontrol/js/clientes_ext.js'],
      '126': ['views/parametros/tarifas/js/exportar_tarifas.js'],
      '127': ['views/parametros/tarifas/js/generacion_automaticas_ventas.js'],
      '131': ['views/parametros/js/productos.js'],
    },

    baseUrl: $('#base_url').val(),

    /**
     * Inicializa la escucha de eventos
     */
    init() {
      // Crear el elemento de la barra de progreso en el DOM si no existe
      if (!document.getElementById('progress-bar-container')) {
        const bar = document.createElement('div');
        bar.id = 'progress-bar-container';
        bar.innerHTML = '<div id="progress-bar-fill"></div>';
        document.body.appendChild(bar);
      }

      const tab = document.getElementById('myTab');
      if (!tab) return;

      // Delegación de eventos para los enlaces de las pestañas
      tab.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[data-controlador]');
        if (anchor) {
          e.preventDefault();
          this.cargarContenidoVentana(anchor);
        }
      });
    },

    showProgress() {
      const container = document.getElementById('progress-bar-container');
      const fill = document.getElementById('progress-bar-fill');
      fill.style.width = '0%';
      container.style.display = 'block';
      // Simular un inicio rápido
      setTimeout(() => fill.style.width = '30%', 50);
    },

    updateProgress(percent) {
      const fill = document.getElementById('progress-bar-fill');
      if (fill) fill.style.width = percent + '%';
    },

    hideProgress() {
      const container = document.getElementById('progress-bar-container');
      const fill = document.getElementById('progress-bar-fill');
      fill.style.width = '100%';
      setTimeout(() => {
        container.style.display = 'none';
      }, 300);
    },

    /**
     * Carga el HTML y gestiona scripts/filtros
     */
    async cargarContenidoVentana(anchor) {
      const ventanaId = anchor.getAttribute('data-id');
      const controlador = anchor.getAttribute('data-controlador');
      const metodo = anchor.getAttribute('data-metodo').replace(/ /g, '_').toLowerCase();
      const url = `${this.baseUrl}${controlador}/${metodo}`;
      const contenedorContenido = document.getElementById(`contenido_ventana-${ventanaId}`);

      this.showProgress();

      try {
        // 1. Cargar HTML
        // const response = await fetch(url);
        const response = await fetch(url, {
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        });
        this.updateProgress(60); // El HTML ya llegó

        if (!response.ok) throw new Error('Error en el servidor');

        const html = await response.text();
        contenedorContenido.innerHTML = html;

        // 2. Gestionar Scripts
        this.updateProgress(80); // Iniciando carga de scripts
        await this.gestionarScripts(ventanaId);

        // 3. Cargar Filtros
        // this.cargarFiltros(controlador, ventanaId);

        this.updateProgress(100);
      } catch (error) {
        console.error("Error:", error);
        Swal.fire('Error', 'No se pudo cargar la ventana', 'error');
      } finally {
        this.hideProgress();
      }
    },

    /**
     * Carga scripts uno por uno para respetar dependencias
     */
    async gestionarScripts(ventanaId) {
      const scripts = this.scriptsConfig[ventanaId] || [];

      // Limpiar scripts anteriores cargados por este sistema para esta ventana
      document.querySelectorAll(`script[data-ventana-id="${ventanaId}"]`).forEach(s => s.remove());

      for (const path of scripts) {
        await this.inyectarScript(path, ventanaId);
      }

      // Ejecutar initScript si existe en el scope global
      if (typeof window.initScript === 'function') {
        window.initScript(parseInt(ventanaId, 10));
      }
    },

    /**
     * Crea el elemento script en el DOM y retorna una Promesa
     */
    inyectarScript(path, ventanaId) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        // Verificar si es URL absoluta o relativa
        script.src = path.startsWith('http') ? path : `${this.baseUrl}${path}`;
        script.type = 'text/javascript';
        script.async = false; // Importante para mantener el orden de ejecución
        script.setAttribute('data-ventana-id', ventanaId);

        script.onload = () => resolve();
        script.onerror = () => {
          console.error(`Error cargando: ${path}`);
          reject();
        };

        document.body.appendChild(script);
      });
    },

    /**
     * Lógica de filtros integrada
     */
    cargarFiltros(controlador, ventanaId) {
      fetch(`${this.baseUrl}${controlador}/crear_filtro`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            param1: ventanaId
          })
        })
        .then(response => response.json())
        .then(data => {
          const contenedor = document.getElementById(`contenedor-campo-${ventanaId}`);
          if (!contenedor) return;

          contenedor.innerHTML = '';
          if (data.resultados && Array.isArray(data.resultados)) {
            // Ordenar: Selects -> Otros -> Botones
            const ordenados = [
              ...data.resultados.filter(e => e.tipo_campo === 'select'),
              ...data.resultados.filter(e => e.tipo_campo !== 'select' && e.tipo_campo !== 'button'),
              ...data.resultados.filter(e => e.tipo_campo === 'button')
            ];

            ordenados.forEach(element => {
              contenedor.appendChild(this.crearElementoCampo(ventanaId, element));
            });
          }
        })
        .catch(err => console.error("Error en filtros:", err));
    },

    /**
     * Generador de elementos DOM para filtros
     */
    crearElementoCampo(ventana, data) {
      const {
        tipo_campo: tipo,
        label,
        nombre_filtro: nombre,
        opciones = []
      } = data;
      const contenedor = document.createElement('div');
      contenedor.classList.add('d-flex', 'flex-column', 'me-2');
      contenedor.id = `contenedor_${ventana}_${label}`;

      const elementoID = `campo-${ventana}-${label}`;

      if (tipo === "button") {
        const button = document.createElement('button');
        button.className = 'btn btn-sm btn-phoenix-success';
        button.id = elementoID;
        button.style.fontSize = "10px";

        if (nombre === "CARRITO") {
          button.classList.replace('btn-phoenix-success', 'btn-phoenix-primary');
          button.style.display = "none";
          button.innerHTML = `<i class="uil uil-shopping-cart-alt"></i> <span id="contadorCarrito">0</span>`;
        } else {
          button.textContent = nombre || "Botón";
        }
        contenedor.appendChild(button);

      } else if (tipo === "select") {
        const select = document.createElement('select');
        select.className = 'form-select form-select-sm';
        select.id = elementoID;
        if (["clientes", "empresas", "estados"].includes(label)) select.style.display = "none";

        const optDefault = new Option(`Seleccione ${label}`, "");
        select.add(optDefault);
        opciones.forEach(opt => select.add(new Option(opt, opt)));
        contenedor.appendChild(select);

      } else {
        const input = document.createElement('input');
        input.type = tipo;
        input.className = 'form-control form-control-sm';
        input.id = elementoID;

        if (tipo.includes("date")) {
          const date = new Date();
          date.setHours(date.getHours() - 5);
          input.value = tipo === "date" ? date.toISOString().split('T')[0] : date.toISOString().slice(0, 16);
        }
        contenedor.appendChild(input);
      }
      return contenedor;
    }
  };

  function inicializarDataTable(id) {
    const $tabla = $(id);

    // 1. Limpieza absoluta antes de empezar
    if ($.fn.DataTable.isDataTable(id)) {
      $tabla.DataTable().destroy();
    }
    $tabla.find("thead tr.filters").remove();

    // 2. Crear la fila de filtros clonando el header original
    const $headerRow = $tabla.find("thead tr:first");
    const $filterRow = $headerRow.clone(true).addClass("filters");
    $filterRow.appendTo($tabla.find("thead"));

    // 3. Inicializar DataTable
    window.tablaTarifas = $tabla.api = $tabla.DataTable({
      orderCellsTop: true,
      fixedHeader: true,
      destroy: true,
      search: false,
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
      },
      initComplete: function() {
        const api = this.api();

        // Usamos el API de datatables para recorrer las columnas de forma segura
        api
          .columns()
          .eq(0)
          .each(function(colIdx) {
            // Seleccionamos la celda de filtro usando el contexto de la tabla actual
            // Esto evita el error de "reading property cell"
            const cell = $tabla.find(".filters th").get(colIdx);

            if (!cell) return; // Salvaguarda: si la celda no existe, saltar

            const title = $(api.column(colIdx).header()).text();

            // Columna 0 (ID/Número) se deja limpia
            if (colIdx === 0) {
              $(cell).html("");
              return;
            }

            // Inyectamos el input
            // $(cell).html(`<input type="text" class="form-control form-control-sm w-100" placeholder="${title}" style="font-size: 11px;"/>`);
            $(cell).html(
              `<input type="text" class="w-100" placeholder="${title}" style="font-size: 11px;height:24px;"/>`,
            );

            // Eventos de filtrado optimizados
            $("input", cell).on("keyup change", function(e) {
              e.stopPropagation(); // Evita que el click en el input active el ordenamiento de la columna
              if (api.column(colIdx).search() !== this.value) {
                api.column(colIdx).search(this.value).draw();
              }
            });
          });
      },
    });
  }

  // Arrancar cuando el DOM esté listo
  document.addEventListener('DOMContentLoaded', () => WindowManager.init());
</script>


</body>

</html>